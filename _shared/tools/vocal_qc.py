"""Kiểm soát chất lượng giọng hát và âm nhạc của một tập (Task.md 18/11/2026 "AI Vocal & Musical Quality Control", _shared/QUALITY.md §9).
python _shared/tools/vocal_qc.py films/<tập> [--only L04,L08] [--fast]

Chạy sau mix.py (cần voice/*.wav bản cuối, voice/spoken/ bản nói gốc của câu hát, voice/sung.json, out/stem_*.wav, out/music.json).
Ghi <tập>/VOCAL-QC.md (đầu ra A–G của Task.md) và <tập>/out/vocal-qc.json (qa.py đọc thành nhóm "9 Vocal QC").

Mỗi phát hiện có một trong hai mức (Task.md: "phân biệt lỗi đã xác nhận và lỗi cần kiểm tra thêm"):
  LỖI       đã xác nhận bằng số đo chắc chắn: cả hai Whisper (small.en, base.en) nghe sai / thiếu / thừa cùng một từ, từ khoá không nghe
            ra ở cả hai, nốt hát lệch > 1,5 lần dung sai của kiểu hát, click, quá tải, nhạc lấn lời (< 10 dB), phụ đề khác lời.
  CẦN NGHE  chỉ là dấu hiệu, phải nghe lại đoạn đó rồi mới kết luận: một Whisper nghe sai, xác suất từ thấp, âm cuối yếu hơn bản nói
            gốc, nguyên âm bị kéo quá dài, cao độ phẳng tuyệt đối (dễ thành "robot"), độ to / cao độ / âm sắc lệch khỏi các câu khác
            của cùng nhân vật, phụ đề lệch thời điểm, nhạc + tiếng động sát ngưỡng.
Không có gì ở đây thay được việc nghe: mục chỉ nghe được (giai điệu tự nhiên, cảm xúc, hợp cảnh) nằm ở checklist G.

Bảng B lấy lời gốc từ trường `was` của câu trong timeline.js (lời trước khi sửa) và lý do từ `why`; câu chưa sửa thì giữ nguyên lời.
"""
import sys, os, json, re, argparse, subprocess, collections
import numpy as np, soundfile as sf
LIB = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'tts'))

MODE_TOL = {'sing-talk': 70, 'half-sing': 50, 'sing': 50}        # cent: dung sai của sing.py (MODES[..]['tol'])
STYLE = {'hook': 'Energetic, playful singing', 'discovery': 'Curious, melodic singing', 'explain': 'Clear rhythmic sing-talk',
         'surprise': 'Expressive, short musical reaction', 'funny': 'Funny voice, comedic timing', 'end': 'Catchy, cheerful singing'}
NOTE = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
nname = lambda m: NOTE[int(m) % 12] + str(int(m) // 12 - 1)
INST_EN = {'pluck': 'ukulele', 'marimba': 'marimba', 'bassn': 'plucked bass', 'buzz': 'buzzy bass', 'upright': 'upright bass', 'tuba': 'tuba',
           'pizzbass': 'low pizzicato', 'pizz': 'pizzicato strings', 'xylo': 'xylophone', 'glock': 'glockenspiel', 'flute': 'flute',
           'reed': 'clarinet', 'horn': 'toy horn', 'steel': 'steel drum', 'celesta': 'celesta', 'harp': 'harp', 'rhodes': 'electric piano',
           'vibes': 'vibraphone', 'banjo': 'banjo', 'bell': 'small bells', 'piano': 'piano', 'pianohi': 'high piano', 'toypiano': 'toy piano',
           'trumpet': 'trumpet', 'mute': 'muted trumpet', 'trombone': 'trombone', 'bassoon': 'bassoon', 'bassoonlo': 'low bassoon',
           'kazoo': 'kazoo', 'accordion': 'accordion', 'strings': 'spiccato strings'}
KIT_EN = {'toy': 'hand claps and shaker', 'pop': 'claps and tambourine', 'clap': 'hand claps and tambourine', 'tri': 'triangle and soft shaker',
          'wood': 'woodblock and shaker', 'comic': 'cartoon woodblocks', 'epic': 'timpani and snare', 'bongo': 'bongos', 'rim': 'rim clicks and brushes',
          'sleigh': 'sleigh bells and clip-clop woodblocks', 'brush': 'brushes', 'latin': 'claves and shaker', 'none': 'no drums'}
GENRE = {'playful': 'Playful Kids Pop', 'happy': 'Catchy Sing-along', 'funny': 'Cartoon Musical (comedy)', 'magic': 'Cartoon Musical (magical)',
         'cute': 'Nursery Rhyme', 'bouncy': 'Bouncy Melody', 'epic': 'Cartoon Musical (big finish)', 'suspense': 'Cartoon Musical'}
FINAL_CL = re.compile(r'(ŋz|ŋk?s|kz|ks|ɡz|gz|ts|dz|lz|vz|nz|mz|ðz|ps|bz|z|s|ʃ|tʃ|dʒ|θ|k|t|p|d|ɡ|g)$')   # âm cuối dễ bị nuốt khi hát


def node_json(js):
    r = subprocess.run(['node', '-e', js], capture_output=True, text=True, encoding='utf-8', cwd=LIB)
    if r.returncode: raise SystemExit('vocal_qc.py: ' + r.stderr.strip()[-400:])
    return json.loads(r.stdout)


SPOKEN_FAST, SUNG_FAST = 4.0, 3.2          # âm tiết / giây (18/11/2026: chủ kênh thấy giọng SHORT-016 nhanh; trước đó 4,8 / 5,5)


def syllables(word):                                                # giống _shared/song.js
    w = re.sub(r'[^a-z]', '', word.lower())
    if not w: return 0
    if len(w) <= 3: return 1
    n = len(re.findall(r'[aeiouy]+', w))
    if re.search(r'[^aeiouy]e$', w) and not re.search(r'[^aeiouy]le$', w): n -= 1
    if re.search(r'[^aeiouy]es$', w) and not re.search(r'(ses|zes|ches|shes|ges|ces|xes|[^aeiouy]les)$', w): n -= 1
    return max(1, n)
words_of = lambda text: [w for w in text.split() if re.search(r'[A-Za-z0-9]', w)]
bare = lambda w: re.sub(r"[^a-z0-9']", '', w.lower())


def align(a, b):
    """Levenshtein a → b, trả danh sách (op, i, j): ok / sub / del (từ của a mất) / ins (từ thừa của b)."""
    n, m = len(a), len(b); D = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1): D[i][0] = i
    for j in range(m + 1): D[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1): D[i][j] = min(D[i - 1][j] + 1, D[i][j - 1] + 1, D[i - 1][j - 1] + (a[i - 1] != b[j - 1]))
    out, i, j = [], n, m
    while i or j:
        if i and j and D[i][j] == D[i - 1][j - 1] + (a[i - 1] != b[j - 1]): out.append(('ok' if a[i - 1] == b[j - 1] else 'sub', i - 1, j - 1)); i -= 1; j -= 1
        elif i and D[i][j] == D[i - 1][j] + 1: out.append(('del', i - 1, None)); i -= 1
        else: out.append(('ins', None, j - 1)); j -= 1
    return out[::-1]


def stem(w): return w[:-1] if len(w) > 3 and w.endswith('s') else w


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('film'); ap.add_argument('--only', default=''); ap.add_argument('--fast', action='store_true', help='chỉ small.en (không xác nhận chéo)')
    A = ap.parse_args()
    FILM = os.path.abspath(A.film); NAME = os.path.basename(FILM); VOX = os.path.join(FILM, 'voice'); OUT = os.path.join(FILM, 'out')
    TL = json.load(open(os.path.join(FILM, 'timeline.json'), encoding='utf-8'))
    CARDS = json.load(open(os.path.join(FILM, 'cards.json'), encoding='utf-8'))
    rd = lambda p, d=None: json.load(open(p, encoding='utf-8')) if os.path.exists(p) else d
    SUNG, ENV, MJ = rd(os.path.join(VOX, 'sung.json'), {}), rd(os.path.join(VOX, 'env.json'), {}), rd(os.path.join(OUT, 'music.json'), {})
    WSP = rd(os.path.join(VOX, 'words.json'), {}); EMS = rd(os.path.join(VOX, 'emote.json'), {})
    EVS = (rd(os.path.join(FILM, 'events.json'), {}) or {}).get('ev', [])
    V = node_json("import('./_shared/voices.js').then(m=>console.log(JSON.stringify({VOICES:m.VOICES,PROFILE:m.PROFILE||{}})))")
    PLAIN = {k for k, v in ((V or {}).get('VOICES') or {}).items() if v.get('emote') is False}   # (19/11/2026) giữ ngữ điệu TTS gốc (Miss Loupe)
    TLJS = node_json(f"import('./{os.path.relpath(os.path.join(FILM, 'timeline.js'), LIB).replace(os.sep, '/')}').then(m=>console.log(JSON.stringify({{lines:(m.LINES||[]).map(l=>({{id:l.id,was:l.was||null,why:l.why||null,style:l.style||null}})),cards:(m.CARDS||[]).map(c=>({{line:c.line||null,text:c.text,t0:c.t0,parts:c.parts||[]}}))}})))")
    EXTRA = {x['id']: x for x in TLJS['lines']}; CARDLINE = TLJS['cards']
    only = set(filter(None, A.only.split(',')))
    LINES = [l for l in TL['lines'] if not only or l['id'] in only]
    DUR = TL['dur']; BEATS = TL.get('beats') or []; SONG = TL.get('song') or {}
    HIDE_END = ((TL.get('hit') or {}).get('titleOut') or [None, None])[1]

    import soxr, parselmouth
    from asr_check import norm_en, load_model
    from kokoro_onnx import Tokenizer
    TOK = Tokenizer()
    ipa = lambda w: TOK.phonemize(re.sub(r"[^A-Za-z']", '', w), 'en-us').strip()

    # ---------- 1. nghe lại bằng hai Whisper (từng từ, xác suất) ----------
    models = ['small.en'] if A.fast else ['small.en', 'base.en']
    HEARD = {}
    for mn in models:
        m = load_model(mn); HEARD[mn] = {}
        for L in LINES:
            y, sr = sf.read(os.path.join(VOX, L['id'] + '.wav'))
            if y.ndim > 1: y = y.mean(1)
            y16 = soxr.resample(y, sr, 16000, quality='HQ'); pad = np.zeros(int(.6 * 16000))
            segs, _ = m.transcribe(np.concatenate([pad, y16, pad]).astype(np.float32), beam_size=5, language='en', word_timestamps=True)
            ws = [(w.word.strip(), w.start - .6, w.end - .6, float(w.probability)) for s in segs for w in s.words]
            HEARD[mn][L['id']] = ws
        print(f'vocal_qc: {mn} done', file=sys.stderr)

    # ---------- dữ liệu chung ----------
    def load(p):
        y, sr = sf.read(p); y = y.mean(1) if y.ndim > 1 else y; return y, sr
    stems = {k: load(os.path.join(OUT, f'stem_{k}.wav')) for k in ('vox', 'mus', 'fx') if os.path.exists(os.path.join(OUT, f'stem_{k}.wav'))}
    def band(x, sr, lo=300, hi=4000):
        X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / sr); X[(f < lo) | (f > hi)] = 0; return np.fft.irfft(X, len(x))
    def frames_db(x, sr, w=.05):
        n = int(w * sr); k = len(x) // n
        return 20 * np.log10(np.sqrt((x[:k * n].reshape(k, n) ** 2).mean(1)) + 1e-9) if k else np.array([])
    def beat_of(t):
        for b in BEATS:
            if b['t0'] - 1e-6 <= t < b['t1']: return b['id']
        return 'discovery'
    def part_of(t):
        ps = SONG.get('parts') or []; p = None
        for q in ps:
            if q['t0'] - 1e-6 <= t: p = q
        return p

    rows = []; per = {}
    for L in LINES:
        lid, who, text = L['id'], L['who'], L['text']; sung = L.get('sung'); mode = sung['mode'] if sung else 'speak'
        y, sr = load(os.path.join(VOX, lid + '.wav')); f = []      # f: (mức, loại, mô tả, cách sửa)
        want = norm_en(L.get('asr') or text); kw = [k for k in (L.get('em') or [])]
        # --- A. phát âm: từng từ qua hai mô hình ---
        bad = collections.defaultdict(list); probs = collections.defaultdict(list); merged = []
        for mn in models:
            hs = HEARD[mn][lid]; heard = norm_en(' '.join(w[0] for w in hs))
            for op, i, j in align(want, heard):
                if op in ('sub', 'del'): bad[i].append((mn, op, heard[j] if j is not None else None))
                if op == 'ins': bad[('ins', heard[j])].append((mn, 'ins', heard[j]))
            for w in hs:
                if '-' in w[0].strip('-'): merged.append((mn, w[0]))
            k = 0
            for w in hs:                                              # xác suất từng từ (gán theo thứ tự từ đã chuẩn hoá)
                for _ in norm_en(w[0]):
                    if k < len(want): probs[k].append(w[3]); k += 1
        conf, sus = [], []
        for key, v in bad.items():
            if isinstance(key, tuple):
                (conf if len({x[0] for x in v}) == len(models) else sus).append(f'thừa "{key[1]}"')
            else:
                desc = f'"{want[key]}" → ' + ' / '.join(f'{x[0].split(".")[0]}: "{x[2]}"' if x[2] else f'{x[0].split(".")[0]}: (mất)' for x in v)
                (conf if len({x[0] for x in v}) == len(models) else sus).append(desc)
        for e in conf: f.append(('LỖI', 'Pronunciation', 'Whisper cả hai mô hình: ' + e, 'tạo lại riêng câu này: đổi cách đọc cho TTS (`say`), làm chậm (`sing.speed`), kéo dài âm tiết đầu, hoặc đổi lời'))
        for e in sus: f.append(('CẦN NGHE', 'Pronunciation', 'một mô hình: ' + e, 'nghe lại từ này; nếu sai thì tạo lại riêng câu này'))
        if merged and len({x[0] for x in merged}) == len(models): f.append(('LỖI', 'Rhythm', 'từ dính nhau: ' + ', '.join(sorted({x[1] for x in merged})), 'cho từ đầu đủ ≥ ½ phách hoặc thêm nghỉ ¼ phách giữa hai từ'))
        elif merged: f.append(('CẦN NGHE', 'Rhythm', 'một mô hình nghe từ dính nhau: ' + ', '.join(sorted({x[1] for x in merged})), 'nghe chỗ nối hai từ'))
        DIG = {'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'zero'}
        low = [want[k] for k, p in probs.items() if len(p) == len(models) and max(p) < .5 and k < len(want) and want[k] not in DIG]   # Whisper viết số bằng chữ số: xác suất thấp giả
        if low: f.append(('CẦN NGHE', 'Pronunciation', 'xác suất thấp ở cả hai mô hình (< 0,5): ' + ', '.join(f'"{w}"' for w in low), 'nghe kỹ các từ này'))
        heard_kw = {stem(w) for mn in models for w in norm_en(' '.join(x[0] for x in HEARD[mn][lid]))}
        miss_kw = [k for k in kw if not all(stem(w) in heard_kw for w in norm_en(k))]
        if miss_kw: f.append(('LỖI', 'Pronunciation', 'từ khoá không nghe ra ở cả hai mô hình: ' + ', '.join(miss_kw), 'tạo lại câu này'))
        if sung:   # (18/11/2026) sing.py không đặt được âm tiết nào của một từ (nguyên âm dò được = 0): từ mất hẳn, Whisper vẫn có thể "đoán" ra
            placed_w = {w[0] for w in (SUNG.get(lid) or {}).get('words', [])}; nw_ = max(n['w'] for n in sung['notes']) + 1; wl_ = words_of(text)
            lost = [wl_[i] if i < len(wl_) else str(i) for i in range(nw_) if i not in placed_w]
            if lost: f.append(('LỖI', 'Pronunciation', 'mất chữ khi hát (sing.py không đặt được âm tiết nào): ' + ', '.join(f'"{bare(w)}"' for w in lost), 'đổi cách đọc nguồn (`say`, thêm dấu phẩy trước từ) hoặc cho từ đó nốt dài hơn, rồi tạo lại câu này'))

        # --- âm cuối (bugs, legs, wings…): so năng lượng xát / bật ở cuối từ với bản nói gốc ---
        wt = [(w[1], w[2]) for w in (SUNG.get(lid) or {}).get('words', [])] if sung else [(max(0, a), b) for _, a, b in (WSP.get(lid) or [])]
        wt = [x[1:] if len(x) == 3 else x for x in wt]
        def fric(x, sr_, a, b):
            s0, s1 = int(max(0, b - .09) * sr_), int(min(len(x) / sr_, b + .05) * sr_)
            seg = x[s0:s1]; whole = x[int(max(0, a) * sr_):int(b * sr_)]
            if len(seg) < 64 or len(whole) < 64: return None
            hf = np.sqrt(np.mean(band(seg, sr_, 3500, 9000) ** 2)) + 1e-9; ref = np.sqrt(np.mean(whole ** 2)) + 1e-9
            return 20 * np.log10(hf / ref)
        weak = []
        if sung and os.path.exists(os.path.join(VOX, 'spoken', lid + '.wav')):
            ys, srs = load(os.path.join(VOX, 'spoken', lid + '.wav')); wsp = [(max(0, a), b) for _, a, b in (WSP.get(lid) or [])]
            for i, w in enumerate(words_of(text)):
                ph = ipa(w)
                if not FINAL_CL.search(ph) or i >= len(wt) or i >= len(wsp): continue
                a1 = fric(y, sr, wt[i][0], wt[i][1]); a0 = fric(ys, srs, *wsp[i])
                if a1 is not None and a0 is not None and a1 < a0 - 9: weak.append(f'"{bare(w)}" /{ph}/ ({a1 - a0:.0f} dB so với bản nói)')
        if weak: f.append(('CẦN NGHE', 'Pronunciation', 'âm cuối yếu hơn bản nói gốc: ' + ', '.join(weak), 'nghe âm cuối; nếu mất thì giảm kéo nguyên âm của từ (nốt ngắn hơn) hoặc thêm nghỉ sau từ'))

        # --- C. nhịp ---
        nsyl = sum(syllables(w) for w in words_of(text)); rate = nsyl / max(.2, L['dur'] - (sung['pre'] + sung['tail'] if sung else 0))
        # tốc độ thật của câu nói: âm tiết / giây trên đoạn có tiếng (cường độ 20 ms > đỉnh − 30 dB), bỏ khoảng lặng TTS ở hai đầu
        hop_ = max(1, int(.02 * sr)); en_ = np.array([np.sqrt(np.mean(y[i:i + hop_] ** 2)) + 1e-9 for i in range(0, max(1, len(y) - hop_), hop_)])
        on_ = np.where(20 * np.log10(en_) > 20 * np.log10(en_.max()) - 30)[0]
        art = nsyl / max(.2, (on_[-1] - on_[0] + 1) * hop_ / sr) if len(on_) else rate
        if sung:
            notes = sung['notes']; mind = min(n['d'] for n in notes)
            # (18/11/2026, chủ kênh: "giọng đang nhanh") câu hát quá 3,2 âm tiết/s là nhanh với trẻ 4–8 tuổi; điệp khúc theo bản nhạc chung
            if rate > SUNG_FAST and not sung.get('chorus'): f.append(('CẦN NGHE', 'Rhythm', f'hát nhanh: {rate:.1f} âm tiết/s (> {SUNG_FAST})', 'giãn nốt: từ nhấn và nốt cuối 1–1,5 phách, nốt ½ phách cho từ phụ; dùng chỗ trống trước câu sau; hoặc bớt chữ'))
            if mind < .11: f.append(('CẦN NGHE', 'Rhythm', f'nốt ngắn nhất {mind * 1000:.0f} ms', 'nốt ≥ ¼ phách ở ≥ 110 ms cho phụ âm kịp vang'))
            brk = []; ws_ = words_of(text)
            for i, w in enumerate(ws_[:-1]):
                if re.search(r'[,.!?;:]["\')]*$', w):
                    end_i = max(n['t'] + n['d'] for n in notes if n['w'] == i); nxt = min(n['t'] for n in notes if n['w'] == i + 1)
                    held = max(n['d'] for n in notes if n['w'] == i)
                    if nxt - end_i < .02 and held < .35: brk.append(f'sau "{w}"')
            if brk: f.append(('CẦN NGHE', 'Rhythm', 'không ngắt ở dấu câu: ' + ', '.join(brk), 'thêm nghỉ ¼ phách (r:.25) hoặc kéo dài nốt trước dấu câu'))
            # (18/11/2026) im tuyệt đối giữa hai âm tiết của cùng một từ ("hi……ding"): nốt dài đặt vào âm tiết có nguyên âm ngắn,
            # sing.py kéo tới trần mà vẫn không lấp được nốt. Nghe "nhát gừng", không hài hoà với nhạc
            ws_t = [(w[1], w[2]) for w in (SUNG.get(lid) or {}).get('words', [])]; zz = np.abs(y) < 1e-5; cut = []
            for i, (a_, b_) in enumerate(ws_t):
                if i >= len(ws_): break
                seg_ = zz[int(a_ * sr):int(b_ * sr)]; run = best = 0
                for v_ in seg_:
                    run = run + 1 if v_ else 0; best = max(best, run)
                if best / sr > .15: cut.append(f'"{bare(ws_[i])}" ({best / sr * 1000:.0f} ms)')
            if cut: f.append(('CẦN NGHE', 'Rhythm', 'đứt giữa từ (im tuyệt đối): ' + ', '.join(cut), 'ngân âm tiết cuối của từ, âm tiết có nguyên âm dài; âm tiết đầu / giữa từ để ½ phách'))
            # (19/11/2026, Task.md "giọng nhân vật ngập ngừng, không trơn tru") im lặng giữa hai âm tiết liền nhau của cùng một cụm (bản
            # nhạc không có dấu nghỉ giữa hai nốt): nghe nhát gừng, ngập ngừng. Khung 5 ms dưới đỉnh câu 35 dB; > 100 ms là lỗi (chỗ ngậm
            # của phụ âm tắc chỉ 30–80 ms), sau dấu câu cho tới 180 ms (một hơi thở) rồi mới cần nghe
            hop5 = max(1, int(.005 * sr)); n5 = len(y) // hop5
            e5 = 20 * np.log10(np.sqrt((y[:n5 * hop5].reshape(n5, hop5) ** 2).mean(1)) + 1e-9) if n5 else np.array([])
            q5 = e5 < (e5.max() if len(e5) else 0) - 35
            def run5(a_, b_):
                seg_ = q5[max(0, int(a_ / .005)):max(0, int(b_ / .005))]; r_ = best_ = 0
                for v_ in seg_: r_ = r_ + 1 if v_ else 0; best_ = max(best_, r_)
                return best_ * .005
            sy = sorted({n['syl'] for n in notes}); hard, soft = [], []
            for k_ in range(len(sy) - 1):
                n0 = [n for n in notes if n['syl'] == sy[k_]]; n1 = [n for n in notes if n['syl'] == sy[k_ + 1]]
                if n1[0]['t'] - (n0[-1]['t'] + n0[-1]['d']) > .01: continue                    # có dấu nghỉ: được ngắt
                g_ = run5(n0[0]['t'] + .03, n1[0]['t'])
                wi, wj = n0[0]['w'], n1[0]['w']; punct = wi != wj and wi < len(ws_) and re.search(r'[,.!?;:]["\')]*$', ws_[wi])
                pair = f'"{bare(ws_[wi]) if wi < len(ws_) else wi}" → "{bare(ws_[wj]) if wj < len(ws_) else wj}" ({g_ * 1000:.0f} ms)'
                if g_ > (.18 if punct else .10): (soft if punct else hard).append(pair)
            if hard: f.append(('LỖI', 'Rhythm', 'hát ngắt quãng trong cụm (nhát gừng): ' + ', '.join(hard), 'sing.py hát liền hơi (mặc định, không đặt legato: false); còn thì cho âm tiết có nguyên âm ngắn nốt ngắn hơn, tạo lại câu này'))
            if soft: f.append(('CẦN NGHE', 'Rhythm', 'ngắt dài sau dấu câu trong cụm: ' + ', '.join(soft), 'nghe xem có thành ngập ngừng không; nếu có, đặt dấu nghỉ (r:) đúng chỗ hoặc bỏ dấu câu trong `say`'))
            mx = (SUNG.get(lid) or {}).get('max_stretch', 1)
            if (SUNG.get(lid) or {}).get('engine') == 'legato':
                # (19/11/2026) hát liền hơi: nguyên âm ngân lấp cả ô nhịp là chủ ý (cách cũ để im phần còn lại), nên chỉ cần nghe khi một
                # nguyên âm bị kéo ≥ 6×: nguyên âm ngắn (ɪ, ʌ, ə của "to", "of", "the") kéo dài quá có thể nghe rè, máy
                st_ = (SUNG.get(lid) or {}).get('stretch') or []
                hi_ = [f'"{bare(ws_[n0["w"]]) if n0["w"] < len(ws_) else n0["w"]}" {x:.1f}×' for k_, x in enumerate(st_) if x >= 6
                       for n0 in [next(n for n in notes if n['syl'] == k_)]]
                if hi_: f.append(('CẦN NGHE', 'Melody', 'nguyên âm ngắn ngân rất dài: ' + ', '.join(hi_), 'nghe xem có rè / máy không; nếu có, cho âm tiết đó nốt ngắn hơn (dồn sang âm tiết bên cạnh)'))
            elif mx >= 2.6 and not sung.get('chorus'): f.append(('CẦN NGHE', 'Melody', f'nguyên âm bị kéo tới {mx:.1f}×', 'nốt ngắn hơn hoặc thêm luyến (~) để chia âm tiết'))
        elif art > SPOKEN_FAST: f.append(('CẦN NGHE', 'Rhythm', f'nói nhanh: {art:.1f} âm tiết/s trên đoạn có tiếng (> {SPOKEN_FAST})', 'pace thấp hơn cho câu này (giọng Dot có pitch +3,5 nửa cung nên nhanh hơn speed ~22 %), dời câu sau, hoặc bớt chữ'))

        # --- B. cao độ từng nốt, độ phẳng, vibrato ---
        snd = parselmouth.Sound(y, sr)
        rg = (sung or {}).get('range') or [75, 600]
        pt = snd.to_pitch_ac(time_step=.01, pitch_floor=max(60, rg[0] * .7), pitch_ceiling=min(900, rg[1] * 1.3))
        F0 = pt.selected_array['frequency']; tt = pt.xs()
        voiced = F0 > 0; med_hz = float(np.median(F0[voiced])) if voiced.any() else 0.
        perr = []; flat = 0; longn = 0; vib = []
        if sung:
            tol = MODE_TOL[mode]
            for n in sung['notes']:
                sel = voiced & (tt >= n['t']) & (tt < n['t'] + n['d'])
                if sel.sum() < 3: continue
                c = 1200 * np.log2(F0[sel] / (440 * 2 ** ((n['m'] - 69) / 12)))
                c = c[np.abs(c - np.median(c)) < 600]                   # bỏ khung dò nhầm quãng tám
                if len(c) < 3: continue
                on = float(np.mean(np.abs(c) <= tol)); vdur = len(c) * .01
                perr.append((n, float(np.median(c)), on, vdur))
                if n['d'] >= .35 and vdur >= .25:
                    longn += 1; dev = c - np.median(c)
                    if np.std(dev) < 4: flat += 1
                    vib.append(float(np.percentile(dev, 90) - np.percentile(dev, 10)))
            off = [(n, e, on, vd) for n, e, on, vd in perr if on < .3 and abs(e) > 1.5 * tol]
            hard = [x for x in off if x[3] >= .12 and mode != 'sing-talk']; soft = [x for x in off if x not in hard]
            fmt = lambda xs: ', '.join(f'{nname(n["m"])} @{L["t"] + n["t"]:.2f}s {e:+.0f} cent ({vd * 1000:.0f} ms có thanh)' for n, e, _, vd in xs[:5])
            if hard: f.append(('LỖI', 'Melody', 'lệch nốt: ' + fmt(hard), 'tạo lại câu (sing.py) hoặc đổi nốt cho hợp quãng giọng'))
            if soft: f.append(('CẦN NGHE', 'Melody', 'nốt lướt / nốt ngắn lệch: ' + fmt(soft), 'nghe xem có lạc giọng không; nếu có, nốt dài hơn hoặc đổi nốt'))
            if longn and flat / longn > .6 and mode == 'sing': f.append(('CẦN NGHE', 'Voice', f'{flat}/{longn} nốt dài có cao độ phẳng tuyệt đối', 'nghe xem có "robot" không; nếu có, thêm vibrato nhẹ / dao động nhỏ'))
            lim_v = {'sing': 110, 'half-sing': 200}.get(mode)                # sing-talk giữ ngữ điệu nói: không đo
            if lim_v and vib and max(vib) > lim_v: f.append(('CẦN NGHE', 'Voice', f'cao độ dao động / trôi tới {max(vib):.0f} cent trên nốt dài', 'nghe nốt dài: vibrato quá mức hoặc cao độ trôi'))

        # --- (18/11/2026, QUALITY.md §10) câu nói: giọng đều đều? từ nhấn có nổi không? ---
        prng = None; emph = None
        if not sung and voiced.sum() > 5:
            Fv = F0[voiced]; Fv = Fv[np.abs(12 * np.log2(Fv / med_hz)) < 9]
            prng = float(12 * np.log2(np.percentile(Fv, 90) / np.percentile(Fv, 10))) if len(Fv) > 5 else None
            if prng is not None and prng < 4: f.append(('CẦN NGHE', 'Voice', f'giọng đều đều: dải cao độ {prng:.1f} nửa cung', 'thêm cảm xúc (emo) cho câu hoặc nhấn từ khoá'))
            kwb = {bare(k) for k in kw}; spans = [(a, b) for (w, a, b) in [(x[0], max(0, x[1]), x[2]) for x in (WSP.get(lid) or [])] if bare(w) in kwb]
            if spans:
                sel = np.zeros(len(tt), bool)
                for a_, b_ in spans: sel |= (tt >= a_) & (tt < b_)
                sel &= voiced
                if sel.sum() > 2: emph = float(12 * np.log2(np.percentile(F0[sel], 80) / med_hz))
                # (19/11/2026) nhân vật giữ ngữ điệu TTS gốc theo quy tắc (voices.js emote: false, Miss Loupe như SHORT-015): không đòi từ nhấn
                if emph is not None and emph < .5 and who not in PLAIN and L.get('emote') is not False:
                    f.append(('CẦN NGHE', 'Voice', f'từ nhấn chưa nổi: đỉnh cao độ {emph:+.1f} nửa cung so với cả câu', 'tăng em của emote.py hoặc kiểm từ nhấn'))
        # --- méo, click, quá tải, độ thở (HNR) ---
        clip = int((np.abs(y) >= .999).sum())
        if clip: f.append(('LỖI', 'Voice', f'{clip} mẫu quá tải (clipping)', 'hạ mức trước khi ghi file'))
        hp_ = band(y, sr, 6000, sr / 2 - 100); d = np.abs(np.diff(hp_)); env_ = np.convolve(np.abs(y), np.ones(240) / 240, 'same')[1:]
        clicks = int(((d > .15) & (env_ < .02)).sum())
        if clicks > 2: f.append(('LỖI', 'Voice', f'{clicks} điểm click ở chỗ nối âm tiết', 'tăng fade ở chỗ nối (sing.py FI/FO) rồi tạo lại câu'))
        hnr = snd.to_harmonicity_cc(time_step=.01, minimum_pitch=75).values[0]; hnr = float(np.mean(hnr[hnr > -100])) if (hnr > -100).any() else 0.
        hnr0 = None
        if sung and os.path.exists(os.path.join(VOX, 'spoken', lid + '.wav')):
            ys, srs = load(os.path.join(VOX, 'spoken', lid + '.wav')); h0 = parselmouth.Sound(ys, srs).to_harmonicity_cc(time_step=.01, minimum_pitch=75).values[0]
            hnr0 = float(np.mean(h0[h0 > -100])) if (h0 > -100).any() else None
            if hnr0 is not None and hnr < hnr0 - 4: f.append(('CẦN NGHE', 'Voice', f'độ trong của giọng (HNR) {hnr:.1f} dB, bản nói {hnr0:.1f} dB', 'nghe tiếng rè / méo; kéo ít hơn hoặc hạ kiểu hát'))

        # --- E. đồng bộ: phụ đề khớp lời và khớp thời điểm, khẩu hình, nhạc lấn lời ---
        if any(c['line'] for c in CARDLINE): cs = [c for c in CARDLINE if c['line'] == lid]
        else: cs = [c for c in CARDS if c['t0'] < L['t'] + L['dur'] + .5 and c['t1'] > L['t'] - .05 and any(bare(w) in {bare(x) for x in words_of(text)} for w in words_of(c['text']))]
        ctext = ' '.join(c['text'] for c in cs)
        hidden = not cs and HIDE_END is not None and L['t'] + L['dur'] <= HIDE_END + .35     # cố ý: không phụ đề khi chữ móc trên hình (cardsOf hide)
        if [bare(w) for w in words_of(ctext)] != [bare(w) for w in words_of(text)] and not L.get('nosub') and not hidden:
            f.append(('LỖI', 'Synchronization', f'phụ đề "{ctext}" khác lời "{text}"', 'sửa text / split của câu trong timeline.js'))
        ws_ = words_of(text)                                             # lúc chữ hiện trên phụ đề: đúng dữ liệu CARDS của timeline.js
        exp = [p['t'] for c in cs for p in (c.get('parts') or [])] if cs and all(c.get('parts') for c in cs) else []
        if len(exp) != len(ws_): exp = [None] * len(ws_)
        got = []
        if sung and (SUNG.get(lid) or {}).get('words'):                # câu hát: mốc từ thật của bản hát (sing.py)
            sw = {w[0]: w[1] for w in SUNG[lid]['words']}; got = [L['t'] + sw[i] if i in sw else None for i in range(len(ws_))]
        for i in range(len(ws_) if not got else 0):
            ts = []
            for mn in models:
                hw = HEARD[mn][lid]; hn = [norm_en(w[0]) for w in hw]; k = 0
                for wi, toks in enumerate(hn):
                    for tok in toks:
                        if k == i and tok == bare(ws_[i]).replace("'", ''): ts.append(L['t'] + max(0, hw[wi][1]))
                        k += 1
            got.append(float(np.mean(ts)) if ts else None)
        lag = [g - e for g, e in zip(got, exp) if g is not None and e is not None]
        if lag and max(abs(x) for x in lag) > .3: f.append(('CẦN NGHE', 'Synchronization', f'chữ phụ đề hiện lệch tiếng tới {max(lag, key=abs):+.2f} s', 'kiểm phụ đề chạy chữ ở đoạn này'))
        nenv = len(ENV.get(lid) or []); want_env = int(np.ceil(len(y) / sr * 24))
        if ENV and abs(nenv - want_env) > 2: f.append(('LỖI', 'Synchronization', f'khẩu hình {nenv} khung, giọng {want_env} khung', 'chạy lại tools/env.py sau sing.py'))
        snr = None; mus_under = None
        if {'vox', 'mus', 'fx'} <= stems.keys():
            (vx, s_), (mu, _), (fx_, _) = stems['vox'], stems['mus'], stems['fx']
            a, b = int(L['t'] * s_), int(min(DUR, L['t'] + L['dur']) * s_)
            from scipy.signal import butter, sosfilt                       # cùng phép đo với qa.py (Lời rõ hơn nhạc + tiếng động)
            if 'VB' not in stems: sos = butter(2, [300, 4000], 'band', fs=s_, output='sos'); stems['VB'] = (sosfilt(sos, vx), sosfilt(sos, mu + fx_))
            vb_, bb_ = stems['VB']; w = int(.05 * s_); r = []
            for q in range(a, b - w, w):
                va = np.sqrt(np.mean(vb_[q:q + w] ** 2))
                if va > .02: r.append(20 * np.log10(va + 1e-9) - 20 * np.log10(np.sqrt(np.mean(bb_[q:q + w] ** 2)) + 1e-9))
            if r:
                snr = float(np.median(r)); mus_under = None
                if snr < 10: f.append(('LỖI', 'Synchronization', f'nhạc + tiếng động che giọng: lời chỉ hơn {snr:.1f} dB', 'hạ nhạc ở câu này (LEVEL, speech_guard) hoặc dời tiếng động'))
                elif snr < 12: f.append(('CẦN NGHE', 'Synchronization', f'lời hơn nhạc + tiếng động {snr:.1f} dB (sát ngưỡng 10)', 'nghe xem có bị che không'))
        per[lid] = dict(who=who, text=text, mode=mode, t=L['t'], dur=L['dur'], rate=round(rate, 2), rate_speech=round(art, 2), med_hz=round(med_hz, 1), hnr=round(hnr, 1),
                        hnr_spoken=None if hnr0 is None else round(hnr0, 1), snr=None if snr is None else round(snr, 1),
                        pitch_cents=[round(x[1]) for x in perr], pitch_on=[round(x[2], 2) for x in perr], pitch_range=None if prng is None else round(prng, 1),
                        emph_st=None if emph is None else round(emph, 1), emote=EMS.get(lid), emo=L.get('emo'), heard={mn: ' '.join(w[0] for w in HEARD[mn][lid]) for mn in models},
                        beat=beat_of(L['t'] + L['dur'] / 2), findings=[dict(level=a, kind=b, what=c, fix=d) for a, b, c, d in f])
        print(f"{lid} {mode:<9} " + ('OK' if not f else '; '.join(f'{a}:{b}' for a, b, _, _ in f)), file=sys.stderr)

    # ---------- D. nhất quán giọng của từng nhân vật ----------
    for who in sorted({p['who'] for p in per.values()}):
        for grp in ('speak', 'sung'):
            ids = [k for k, p in per.items() if p['who'] == who and (p['mode'] == 'speak') == (grp == 'speak') and p['med_hz'] > 0]
            if len(ids) < 2: continue
            md = np.median([per[k]['med_hz'] for k in ids])
            for k in ids:
                st = 12 * np.log2(per[k]['med_hz'] / md)
                if abs(st) > 3.5: per[k]['findings'].append(dict(level='CẦN NGHE', kind='Voice', what=f'cao độ trung vị lệch {st:+.1f} nửa cung so với các câu {"nói" if grp == "speak" else "hát"} khác của {who}', fix='nghe xem còn đúng giọng nhân vật không'))
    sys.path.insert(0, os.path.join(LIB, '_shared')); from emote import EMO_DB, CHORUS_DB
    EMOS = {l['id']: l.get('emo') for l in TL['lines']}; CHOR = {l['id']: bool((l.get('sung') or {}).get('chorus')) for l in TL['lines']}
    SCN = (rd(os.path.join(OUT, 'scenes.json'), {}) or {}).get('scenes', [])                  # mức giọng cố ý theo năng lượng cảnh (mix.py VDB)
    vdb = lambda k: next((sc.get('voice_db', 0.) for sc in SCN if sc['t0'] <= per[k]['t'] + per[k]['dur'] / 2 < sc['t1']), 0.)
    if 'vox' in stems:
        vx, s_ = stems['vox']
        for who in sorted({p['who'] for p in per.values()}):
            ids = [k for k, p in per.items() if p['who'] == who]
            lv = {}
            for k in ids:
                p = per[k]; seg = vx[int(p['t'] * s_):int((p['t'] + p['dur']) * s_)]; d_ = frames_db(seg, s_)
                if len(d_): lv[k] = float(np.median(d_[d_ > d_.max() - 20])) - EMO_DB.get(EMOS.get(k), 0.) - (CHORUS_DB if CHOR.get(k) else 0.) - vdb(k)   # trừ chênh lệch cố ý theo cảm xúc và theo cảnh
            if len(lv) >= 2:
                md = np.median(list(lv.values()))
                for k, v in lv.items():
                    per[k]['level_db'] = round(v, 1)
                    if abs(v - md) > 4: per[k]['findings'].append(dict(level='CẦN NGHE', kind='Voice', what=f'âm lượng lệch {v - md:+.1f} dB so với các câu khác của {who} (đã trừ chênh lệch cố ý theo cảm xúc và theo cảnh)', fix='cân lại mức câu này'))

    # ---------- tổng hợp, ghi JSON và VOCAL-QC.md ----------
    allf = [(k, x) for k, p in per.items() for x in p['findings']]
    conf = [(k, x) for k, x in allf if x['level'] == 'LỖI']; sus = [(k, x) for k, x in allf if x['level'] == 'CẦN NGHE']
    crit = criteria(per, conf, sus, models)
    mixg = mix_guide(per, stems, DUR, MJ, EVS, TL)
    json.dump(dict(film=NAME, models=models, lines=per, confirmed=len(conf), suspect=len(sus), criteria=crit, mix=mixg),
              open(os.path.join(OUT, 'vocal-qc.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    write_md(FILM, NAME, TL, per, EXTRA, V, SONG, MJ, crit, mixg, ipa, beat_of, part_of, models)
    print(f'vocal_qc: {len(per)} câu · {len(conf)} lỗi đã xác nhận · {len(sus)} cần nghe → VOCAL-QC.md, out/vocal-qc.json')


def criteria(per, conf, sus, models):
    """Tiêu chuẩn cuối cùng của Task.md §10: trạng thái đo được của từng tiêu chí (ĐẠT / LỖI / CẦN NGHE / CHỈ NGHE ĐƯỢC)."""
    def st(kinds, pred=lambda x: True):
        c = [f'{k}: {x["what"]}' for k, x in conf if x['kind'] in kinds and pred(x)]; s = [f'{k}: {x["what"]}' for k, x in sus if x['kind'] in kinds and pred(x)]
        return ('LỖI' if c else 'CẦN NGHE' if s else 'ĐẠT'), c + s
    out = []
    add = lambda name, res, how: out.append(dict(name=name, status=res[0], items=res[1], how=how))
    add('Phát âm rõ ràng', st({'Pronunciation'}, lambda x: 'xác suất' in x['what'] or 'một mô hình' in x['what']), f'Whisper {" + ".join(models)} nghe từng từ; từ có xác suất < 0,5 ở cả hai mô hình')
    add('Không sai từ', st({'Pronunciation'}, lambda x: 'Whisper cả hai' in x['what'] or 'từ khoá' in x['what']), 'cả hai mô hình nghe ra đúng mọi từ và mọi từ khoá')
    add('Không nuốt âm', st({'Pronunciation'}, lambda x: 'âm cuối' in x['what']), 'năng lượng xát / bật ở cuối từ (bugs, legs, wings…) so với bản nói gốc')
    add('Không lặp từ ngoài ý muốn', st({'Pronunciation'}, lambda x: 'thừa' in x['what']), 'không mô hình nào nghe ra từ thừa')
    add('Giai điệu tự nhiên', st({'Melody'}), 'cao độ từng nốt so với bản nhạc (dung sai theo kiểu hát), độ kéo nguyên âm · phần "tự nhiên" chỉ nghe được')
    add('Không bị méo giọng', st({'Voice'}, lambda x: any(k in x['what'] for k in ('clipping', 'click', 'HNR', 'phẳng', 'dao động'))), 'quá tải, click ở chỗ nối, HNR so với bản nói, cao độ phẳng, vibrato')
    add('Tốc độ giọng vừa tai trẻ', st({'Rhythm'}, lambda x: 'nhanh' in x['what']), f'câu nói ≤ {SPOKEN_FAST} âm tiết/s trên đoạn có tiếng; câu hát ≤ {SUNG_FAST} âm tiết/s theo bản nhạc (trừ điệp khúc) · chậm, liền hơi: chỉ nghe được')
    add('Nhịp hát phù hợp hình ảnh', st({'Rhythm'}, lambda x: 'nhanh' not in x['what']), 'âm tiết / giây, nốt ngắn nhất, ngắt ở dấu câu, từ dính nhau · khớp hành động chỉ xem được')
    add('Giọng có cảm xúc, có nhấn nhá', st({'Voice'}, lambda x: 'đều đều' in x['what'] or 'từ nhấn' in x['what']), 'câu nói: dải cao độ ≥ 4 nửa cung, từ nhấn cao hơn cả câu ≥ 0,5 nửa cung (emote.py uốn theo emo của câu) · cảm xúc có hợp tình huống: chỉ nghe được')
    add('Giữ nhất quán giọng nhân vật',st({'Voice'}, lambda x: 'lệch' in x['what'] and ('cao độ trung vị' in x['what'] or 'âm lượng' in x['what'])), 'cao độ trung vị và âm lượng từng câu so với các câu khác của cùng nhân vật')
    add('Không bị nhạc nền che lấp', st({'Synchronization'}, lambda x: 'che' in x['what'] or 'hơn nhạc' in x['what']), 'lời hơn nhạc + tiếng động ≥ 10 dB ở dải 300–4000 Hz (stem cuối)')
    add('Phụ đề khớp 100% với lời thoại', st({'Synchronization'}, lambda x: 'phụ đề' in x['what'] or 'khẩu hình' in x['what']), 'chữ trên phụ đề = lời; chữ hiện đúng lúc hát (± 0,3 s); khẩu hình đủ khung')
    return out


def mix_guide(per, stems, DUR, MJ, EVS, TL):
    g = {}
    if {'vox', 'mus', 'fx'} <= stems.keys():
        (vx, s_), (mu, _), (fx, _) = stems['vox'], stems['mus'], stems['fx']
        db = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
        sp = np.zeros(len(vx), bool)
        for p in per.values(): sp[int(p['t'] * s_):int((p['t'] + p['dur']) * s_)] = True
        g['vox_db'] = round(db(vx[sp]), 1) if sp.any() else None
        g['mus_under_db'] = round(db(mu[sp]), 1) if sp.any() else None; g['mus_gap_db'] = round(db(mu[~sp]), 1) if (~sp).any() else None
        g['fx_under_db'] = round(db(fx[sp]), 1) if sp.any() else None
        g['snr'] = {k: p['snr'] for k, p in per.items()}
        g['fade_in_ms'] = 20
    near = []
    for e in EVS:
        for k, p in per.items():
            if p['t'] - .05 <= e['t'] < p['t'] + p['dur']: near.append((round(e['t'], 2), e['type'], k))
    g['sfx_under_lines'] = near
    g['transitions'] = MJ.get('transitions', [])
    return g


def write_md(FILM, NAME, TL, per, EXTRA, V, SONG, MJ, crit, mixg, ipa, beat_of, part_of, models):
    PRO = V.get('PROFILE', {})
    o = [f'# {NAME.upper()} · Vocal & Musical QC',
         '',
         f'> Sinh tự động bởi `_shared/tools/vocal_qc.py` ([`QUALITY.md`](../../_shared/QUALITY.md) §9, Task.md 18/11/2026). Không sửa tay: sửa `timeline.js` / `mix.py` rồi chạy lại.',
         f'> Nghe lại bằng Whisper {" và ".join(models)} trên từng file giọng cuối (`voice/<id>.wav`); số đo âm thanh trên stem cuối (`out/stem_*.wav`).',
         '> **LỖI** = đã xác nhận bằng số đo; **CẦN NGHE** = mới là dấu hiệu, phải nghe đoạn đó trước khi kết luận. Những gì chỉ nghe được nằm ở mục G.',
         '']
    nconf = sum(1 for p in per.values() for x in p['findings'] if x['level'] == 'LỖI'); nsus = sum(1 for p in per.values() for x in p['findings'] if x['level'] == 'CẦN NGHE')
    o += [f'**Kết quả:** {len(per)} câu · **{nconf} lỗi đã xác nhận** · {nsus} chỗ cần nghe.', '']
    ts = lambda p: f"{p['t']:.2f}–{p['t'] + p['dur']:.2f}"
    o += ['## A. Bảng phân tích lỗi', '', '| Timestamp | Lời thoại | Loại lỗi | Mức độ | Cách sửa |', '|---|---|---|---|---|']
    rowsA = 0
    for k, p in per.items():
        for x in p['findings']:
            o.append(f"| {ts(p)} ({k}) | {p['text']} | {x['kind']}: {x['what']} | {x['level']} | {x['fix']} |"); rowsA += 1
    if not rowsA: o.append('| — | — | không phát hiện lỗi đo được | — | — |')
    lines_by = {l['id']: l for l in TL['lines']}
    o += ['', '## B. Bảng lời thoại sau khi cải thiện', '', '| Timestamp | Original Lyrics | Improved Lyrics | Vocal Style |', '|---|---|---|---|']
    def style(k, p):
        e = EXTRA.get(k, {}) or {}
        if e.get('style'): return e['style']
        b, m = p['beat'], p['mode']; L_ = lines_by.get(k, {})
        if (L_.get('sung') or {}).get('chorus'): return STYLE['end']                      # điệp khúc: luôn catchy, cheerful
        if len(words_of(p['text'])) <= 2 and p['text'].rstrip().endswith('!'): return STYLE['surprise'] if m != 'speak' else STYLE['funny']   # thán từ ngắn: phản ứng
        if m == 'speak': return {'hook': 'Energetic, playful speech', 'surprise': 'Funny voice, comedic timing', 'cta': 'Cheerful, inviting question'}.get(b, 'Natural, clear speech')
        if b == 'hook': return STYLE['hook']
        if b in ('payoff', 'cta'): return STYLE['end']
        if b == 'surprise': return STYLE['surprise']
        return STYLE['explain'] if m == 'sing-talk' else STYLE['discovery']
    for k, p in per.items():
        e = EXTRA.get(k, {}) or {}; was = e.get('was')
        o.append(f"| {ts(p)} ({k}, {p['who']}) | {was or p['text']} | {p['text'] if was else '(giữ nguyên)'}{' — ' + e['why'] if e.get('why') else ''} | {style(k, p)} · {p['mode']} |")
    # C. hướng dẫn phát âm
    o += ['', '## C. Pronunciation Guide', '', 'Từ khó (nhiều âm tiết, tên loài, cụm phụ âm cuối dễ bị nuốt, từ Whisper nghe chưa chắc). IPA lấy từ bộ phiên âm của Kokoro (espeak-ng, en-us); `ˈ` đứng trước âm tiết có trọng âm.', '',
          '| Từ | IPA | Âm tiết | Trọng âm | Lưu ý |', '|---|---|---|---|---|']
    seen = set(); flagged = {re.sub(r'[^a-z]', '', w) for p in per.values() for x in p['findings'] for w in re.findall(r'"([^"]+)"', x['what'])}
    SPECIES = {'bees', 'bee', 'monarchs', 'monarch', 'ladybugs', 'ladybug', 'butterflies', 'butterfly', 'grasshopper', 'grasshoppers', 'cricket', 'crickets',
               'firefly', 'fireflies', 'dragonfly', 'dragonflies', 'honeybees', 'ants', 'beetle', 'spider', 'caterpillar', 'antennae', 'thorax', 'abdomen'}
    for p in per.values():
        for w in words_of(p['text']):
            b_ = re.sub(r"[^a-z']", '', w.lower()).strip("'")
            if not b_ or b_ in seen: continue
            ph = ipa(w); n = syllables(w); fin = FINAL_CL.search(ph)
            if not (n >= 3 or b_ in SPECIES or b_ in flagged or (fin and len(fin.group(1)) >= 2)): continue
            seen.add(b_)
            nuc = re.findall(r'ˈ?[aeiouæɑɐɒɔəɚɛɜɪʊʌ][ːɪʊəɚ]*', ph); stress = next((i + 1 for i, x in enumerate(nuc) if x.startswith('ˈ')), 1)
            note = []
            if fin and len(fin.group(1)) >= 2: note.append(f'giữ rõ âm cuối /{fin.group(1)}/')
            elif fin and fin.group(1) in ('z', 's'): note.append('âm cuối /z/ hoặc /s/ phải nghe ra')
            if b_ in SPECIES: note.append('tên loài: viết và đọc đúng, không đổi từ để dễ hát')
            if b_ in flagged: note.append('Whisper từng nghe chưa chắc')
            o.append(f'| {b_} | /{ph}/ | {n} | âm tiết {stress} | {"; ".join(note) or "—"} |')
    o += ['', '**Cách ngắt câu** (‖ = chỗ thở / ngắt; theo dấu câu và nghỉ trong bản nhạc):', '']
    for k, p in per.items():
        o.append(f"- {k} ({p['mode']}): " + re.sub(r'([,.!?;:])\s+', r'\1 ‖ ', p['text']))
    # D. prompt tạo giọng hát
    o += ['', '## D. Vocal Generation Prompt', '', 'Mỗi câu một đoạn riêng (3–8 s), cùng hồ sơ giọng (`PROFILE` trong `_shared/voices.js`). Câu lỗi chỉ tạo lại đúng câu đó. Trong phim, mọi câu là giọng TTS của chính nhân vật, không hát (từ 19/11/2026, QUALITY.md §8.3); prompt dưới đây dùng khi tạo bằng công cụ AI khác hoặc khi thu giọng thật.', '']
    lines_by = {l['id']: l for l in TL['lines']}
    for k, p in per.items():
        L = lines_by[k]; prof = PRO.get(p['who'], p['who'])
        if L.get('sung'):
            pt = part_of(L['t'] + L['sung']['pre']) or {}; nn = L['sung']['notes']; ws = words_of(p['text'])
            syl = [];
            for i, w in enumerate(ws):
                ns = [n for n in nn if n['w'] == i]
                syl.append(f"{re.sub(r'[^A-Za-z]', '', w)} " + '-'.join(f"{nname(n['m'])}({n['d'] / (60 / pt.get('bpm', 120)):.2g})" for n in ns))
            how = {'sing': 'fully sung, one clear vowel per note, legato, a light natural vibrato only on the last held note',
                   'half-sing': 'half-sung: melodic but close to speech, bright and bouncy', 'sing-talk': 'rhythmic sing-talk: spoken words riding the beat, light pitch movement'}[p['mode']]
            o.append(f"- **{k}** (\"{p['text']}\"): {prof}. Style: {style(k, p)}; {how}. Tempo {pt.get('bpm', 120)} BPM, key of {SONG.get('key', 'C')} major. "
                     f"Melody, note(beats) per syllable: {' · '.join(syl)}. Pronounce every final consonant clearly; no extra syllables, no repeated words, "
                     f"no robotic or auto-tuned sound; words must be clearer than vocal tricks; keep the same voice as the character's other lines.")
        else:
            o.append(f"- **{k}** (\"{p['text']}\", spoken): {prof}. Style: {style(k, p)}. Natural, expressive speech at a child-friendly pace ({p['rate']:.1f} syllables/s), clear final consonants, same voice as the character's other lines.")
    # E. prompt tạo nhạc
    o += ['', '## E. Music Generation Prompt', '', 'Mỗi cảnh nhạc một prompt (theo `out/music.json`). Chỉ để tham khảo: nhạc trong phim tổng hợp bằng code. Không lấn giọng: dưới lời giữ dải 300–4000 Hz thưa.', '']
    for S in MJ.get('sections', []):
        if S.get('style') in ('break', 'jingle'): continue
        ins = ', '.join(dict.fromkeys(INST_EN.get(x, x) for x in (S.get('lead'), S.get('comp'), S.get('arp'), S.get('bass')) if x))
        o.append(f"- **{S['t0']:.1f}–{S['t1']:.1f} s · {S['name']}**: {GENRE.get(S.get('mood'), 'Playful Kids Pop')}, {round(S.get('bpm') or 120)} BPM, {S.get('key', 'C')} major, instrumental only. "
                 f"Lead {INST_EN.get(S.get('lead'), S.get('lead'))}; band: {ins}; percussion: {KIT_EN.get(S.get('kit'), S.get('kit'))}. Mood: {S.get('emo') or ''}. "
                 f"Leave space for a child's voice; {'build energy to a big ending' if S.get('arc') == 'peak' else 'end with a clear change into the next scene'}.")
    # F. hướng dẫn trộn
    o += ['', '## F. Audio Mixing Guide (số đo trên bản trộn cuối)', '']
    if mixg.get('vox_db') is not None:
        o += [f"- **Vocal volume:** giọng {mixg['vox_db']} dBFS RMS khi có lời (bản cuối −14 LUFS).",
              f"- **Background music volume:** nhạc {mixg['mus_under_db']} dBFS dưới lời, {mixg['mus_gap_db']} dBFS ở khoảng trống (toàn dải; nhạc lùi {mixg['mus_gap_db'] - mixg['mus_under_db']:.1f} dB dưới lời, dải giọng xem qa.py \"Nhạc lùi dưới giọng\"). Lời hơn nhạc + tiếng động từng câu (300–4000 Hz): "
              + ', '.join(f'{k} {v} dB' for k, v in mixg['snr'].items() if v is not None) + '.',
              f"- **SFX:** tiếng động dưới lời {mixg['fx_under_db']} dBFS RMS (thấp hơn giọng {mixg['vox_db'] - mixg['fx_under_db']:.0f} dB); cue rơi vào giữa câu (gộp theo loại): " + (', '.join(f'{k}: ' + ', '.join(f'{ty} ×{n}' if n > 1 else ty for ty, n in collections.Counter(ty for _, ty, kk in mixg['sfx_under_lines'] if kk == k).items()) for k in dict.fromkeys(kk for _, _, kk in mixg['sfx_under_lines'])) or 'không có') + '.']
    o += ['- **Fade in / out:** 20 ms vào ở đầu phim (mix.py); mỗi âm tiết hát nối bằng fade 5 / 8 ms (sing.py); phim lặp liền nên không fade cuối.',
          '- **Audio transition:** ' + (', '.join(f"{x.get('t', 0):.1f} s {x.get('type', '')}" for x in mixg.get('transitions', [])[:20]) or 'xem SOUND-PLAN.md') + ' ("tay" = viết tay; bảng đầy đủ trong SOUND-PLAN.md).', '']
    # G. checklist cuối
    o += ['## G. Final Quality Checklist', '', '| Tiêu chí (Task.md §10) | Đo được | Cách đo | Chi tiết |', '|---|---|---|---|']
    for c in crit:
        o.append(f"| {c['name']} | {c['status']} | {c['how']} | {'; '.join(c['items'][:4]) or '—'} |")
    o += ['', '**Chỉ nghe / xem được (điền tay khi duyệt):**', '',
          '- [ ] Giai điệu tự nhiên, hợp cảm xúc từng cảnh (không chỉ "nghe vui")',
          '- [ ] Giọng không robot, không chuột chip; vibrato vừa phải; không thấy dấu autotune',
          '- [ ] Giọng hát nghe như chính nhân vật, giữ cùng âm sắc giữa các đoạn',
          '- [ ] Lời hát khớp hành động và khẩu hình',
          '- [ ] Nếu một tiêu chí không đạt: chỉ tạo lại đúng câu đó (`sing.py --only <id>`)', '']
    open(os.path.join(FILM, 'VOCAL-QC.md'), 'w', encoding='utf-8').write('\n'.join(o) + '\n')


if __name__ == '__main__':
    main()
