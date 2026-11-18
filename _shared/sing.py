"""Hát lời thoại bằng chính giọng TTS của nhân vật (Musical Storytelling, _shared/QUALITY.md §8).
python _shared/sing.py <film>/voice/lines.json <film>/voice [--only L01,L04]

Chạy sau core/tts/tts.py, _shared/voicefx.py và bước kiểm Whisper chính xác trên bản nói (cần words.json của bản nói).
Chỉ đụng tới câu có trường "sing" trong lines.json (do _shared/song.js qua tools/lines.mjs sinh ra):
  "sing": {"mode": "sing-talk" | "half-sing" | "sing", "pre": 0.12, "tail": 0.1,
           "range": [floor_hz, ceil_hz],                                    (không bắt buộc: dải dò cao độ của giọng)
           "notes": [{"t": 0.12, "d": 0.25, "m": 56, "syl": 0, "w": 0}, ...]}
  t: giây kể từ đầu câu · d: giây · m: MIDI · syl: số thứ tự âm tiết trong câu · w: số thứ tự từ.
  Một âm tiết có nhiều nốt (luyến) thì các nốt đó cùng "syl".

Cách làm (PSOLA của Praat qua parselmouth, giữ formant nên giữ chất giọng):
  1. Tách âm tiết: mép từ lấy từ words.json, bắt vào chỗ cường độ thấp nhất trong ±60 ms; trong mỗi từ tìm đỉnh nguyên âm
     (đỉnh cường độ có thanh, chênh ≥ 2 dB với chỗ lõm hai bên, cách nhau ≥ 70 ms, kiểu de Jong & Wempe). Phần quanh đỉnh còn
     có thanh và trong 8 dB là nguyên âm; trước là phụ âm đầu, sau là phụ âm cuối.
  2. Một lượt Manipulation cho cả câu: DurationTier chỉ kéo (hoặc nén) nguyên âm, phụ âm giữ nguyên; PitchTier đặt cao độ theo nốt.
  3. Cắt từng âm tiết ở bản tổng hợp lại, đặt sao cho nguyên âm vào đúng phách, khoảng giữa là im lặng, nối bằng fade ngắn.

Ba kiểu hát (MODES): sing-talk giữ 35 % ngữ điệu nói và độ dài gần tự nhiên; half-sing giữ 15 %, nguyên âm lấp 70 % ô nhịp;
sing khoá hẳn vào nốt, nguyên âm lấp 90 % ô, có vibrato ở nốt dài và luyến giữa các nốt.
Ghi đè cho từng câu (18/11/2026): "fill" (phần ô nhịp nguyên âm lấp), "glide" (giây luyến giữa hai nốt), "hi" (trần kéo nguyên âm),
"alpha" (phần ngữ điệu nói giữ lại: cao hơn thì giọng hát gần giọng nói của nhân vật hơn).
Nốt dài chỉ nên đặt vào âm tiết cuối từ có nguyên âm dài: nguyên âm ở đầu / giữa từ dò được thường ngắn, kéo tới trần vẫn để im giữa từ.

Hát liền hơi (legato, mặc định từ 19/11/2026, Task.md "giọng nhân vật ngập ngừng, không trơn tru"): cách cắt từng âm tiết rồi đặt
vào phách ở trên để im lặng ở phần nốt mà nguyên âm (bị chặn ở trần "hi") không lấp hết. SHORT-016 đo được 18–31 % thời gian câu
hát là im giữa các chữ, nghe nhát gừng. Bản legato kéo giãn CẢ CÂU liền một mạch bằng một DurationTier: mỗi nguyên âm vẫn vào
đúng phách (mốc neo), phụ âm giữ độ dài tự nhiên, khoảng lặng giữa hai chữ co lại, phần còn lại của ô nhịp do nguyên âm (và phụ âm
vang cuối âm tiết: l, n, m, ng, r) ngân lấp. Chỉ ngắt ở chỗ bản nhạc có dấu nghỉ (r:) và cuối câu; âm tiết cuối cụm vang "fill" của ô.
Mốc âm tiết lấy từ voice/phones.json (_shared/tools/phones.py: độ dài âm vị Kokoro, chính xác tới 25 ms); không có thì dò như trên
theo mốc từ của Whisper. "legato": false trong sing của câu: cách cũ (giữ để dựng lại đúng như trước).

Ghi đè <id>.wav, cập nhật dur.json, ghi sung.json (nốt, từ theo thời gian mới, độ bám nốt "lock", Hz trung vị, độ kéo lớn nhất).
Bản nói gốc lưu ở voice/spoken/<id>.wav. Chạy lại an toàn: voice/sing-mark.json ghi khoá (lời, giọng, tốc độ, pitch, bản nhạc,
phiên bản và nguồn mốc) và kích thước file, nên câu đã hát không bị hát lần nữa; câu đã hát mà khoá đổi thì hát lại từ bản nói gốc.
Thoát 1 nếu có câu bám nốt kém hơn ngưỡng của kiểu hát.
"""
import sys, os, json, hashlib, argparse, shutil
import numpy as np, soundfile as sf

VERSION = 2                  # 2: hát liền hơi (legato) + mốc âm vị Kokoro (19/11/2026). _shared/tools/voice_regen.py đưa vào khoá câu hát
MODES = {   # fill: phần ô nhịp mà âm tiết vang · lo/hi: giới hạn kéo nguyên âm · alpha: phần ngữ điệu nói giữ lại · glide: luyến (s)
    'sing-talk': dict(fill=.6, lo=.7, hi=1.6, alpha=.35, glide=.03, vib=False, lock=.3, tol=70),
    'half-sing': dict(fill=.7, lo=.6, hi=2.2, alpha=.15, glide=.06, vib=False, lock=.45, tol=50),
    'sing':      dict(fill=.9, lo=.6, hi=3.0, alpha=0.0, glide=.04, vib=True, lock=.6, tol=50),
}
FI, FO = .005, .008          # fade vào / ra của mỗi âm tiết khi nối (cách cũ)
PFI, PFO = .008, .02         # fade vào / ra của mỗi cụm liền hơi (legato)
PAUSE = .3                   # legato: khoảng lặng giữa hai chữ trong cùng cụm (dấu câu, chỗ TTS ngừng) còn 30 % (≈ một hơi thở ngắn)
CLOSE = .5                   # legato: chỗ ngậm im của phụ âm tắc (p, t, k, b, d, g) trong cụm còn 50 %: vẫn nghe ra phụ âm, không thành chỗ ngắt
SON_W = .5                   # legato: phụ âm vang cuối âm tiết (l, n, m, ng, r) ngân bằng nửa nguyên âm
END_HI = 3.0                 # legato: âm tiết cuối cụm kéo nguyên âm tới tối đa max(hi, 3×) rồi để nghỉ (có dấu nghỉ hoặc hết câu)
VOWELS = set('aeiouæɑɐɒɔəɘɚɛɜɝɞɨɪʉʊʌʏøœɤɯᵻᵊ')
STRESS = set('ˈˌ')
SONOR = set('lnmŋɹjwɫɾ')
hz = lambda m: 440.0 * 2 ** ((m - 69) / 12)


def need_parselmouth():
    try:
        import parselmouth  # noqa: F401
        return parselmouth
    except ImportError:
        sys.exit('sing.py: praat-parselmouth is missing: .venv python -m pip install --only-binary=:all: "praat-parselmouth>=0.4.5" (requirements-voice.txt)')


def smooth(x, n=3):
    if len(x) < n: return x.copy()
    k = np.ones(n) / n
    return np.convolve(np.pad(x, (n // 2, n // 2), mode='edge'), k, 'valid')


def analyse(pm, y, sr, rng):
    snd = pm.Sound(y, sampling_frequency=sr)
    if rng: floor, ceil = rng
    else:
        p0 = snd.to_pitch_ac(time_step=.01, pitch_floor=60, pitch_ceiling=700).selected_array['frequency']
        med = float(np.median(p0[p0 > 0])) if (p0 > 0).any() else 200.0
        floor, ceil = max(50.0, med / 2.2), min(900.0, med * 2.4)
    pit = snd.to_pitch_ac(time_step=.005, pitch_floor=floor, pitch_ceiling=ceil)
    tp, f0 = pit.xs(), pit.selected_array['frequency']
    it = snd.to_intensity(minimum_pitch=max(75.0, floor), time_step=.005)
    ti, I = it.xs(), it.values[0]
    voiced = np.interp(ti, tp, (f0 > 0).astype(float)) > .5 if len(tp) else np.zeros(len(ti), bool)
    return snd, floor, ceil, tp, f0, ti, smooth(I, 3), voiced


def snap(b, ti, I, win=.06):
    sel = np.where((ti >= b - win) & (ti <= b + win))[0]
    return float(ti[sel[np.argmin(I[sel])]]) if len(sel) else b


def nuclei(w0, w1, k, ti, I, voiced):
    """k âm tiết trong từ [w0, w1]: trả về [(s0, đỉnh, s1)]"""
    idx = np.where((ti >= w0) & (ti <= w1))[0]
    if k <= 0: return []
    if len(idx) < 4:
        e = np.linspace(w0, w1, k + 1); return [(e[i], (e[i] + e[i + 1]) / 2, e[i + 1]) for i in range(k)]
    Iw, vw, tw = I[idx], voiced[idx], ti[idx]
    top = Iw.max()
    cand = [i for i in range(1, len(Iw) - 1) if Iw[i] >= Iw[i - 1] and Iw[i] >= Iw[i + 1] and vw[i] and Iw[i] >= top - 25]
    cand.sort(key=lambda i: -Iw[i]); acc = []
    for i in cand:
        ok = True
        for j in acc:
            a, b = sorted((i, j))
            if abs(tw[i] - tw[j]) < .07 or Iw[a:b + 1].min() > min(Iw[i], Iw[j]) - 2: ok = False; break
        if ok: acc.append(i)
        if len(acc) == k: break
    if not acc:   # không có đỉnh có thanh: lấy chỗ to nhất
        acc = [int(np.argmax(Iw))]
    acc.sort()
    peaks = [float(tw[i]) for i in acc]
    while len(peaks) < k:   # thiếu đỉnh: chia đôi đoạn dài nhất
        edges = [w0] + [(peaks[i] + peaks[i + 1]) / 2 for i in range(len(peaks) - 1)] + [w1]
        spans = [(edges[i + 1] - edges[i], i) for i in range(len(peaks))]
        _, i = max(spans); a, b = edges[i], edges[i + 1]
        peaks[i:i + 1] = sorted([a + (b - a) * .3, a + (b - a) * .7])
    bounds = [w0]
    for i in range(k - 1):
        sel = np.where((ti > peaks[i]) & (ti < peaks[i + 1]))[0]
        bounds.append(float(ti[sel[np.argmin(I[sel])]]) if len(sel) else (peaks[i] + peaks[i + 1]) / 2)
    bounds.append(w1)
    return [(bounds[i], peaks[i], bounds[i + 1]) for i in range(k)]


def line_nuclei(n, ti, I, voiced, dur_in):
    """n đỉnh nguyên âm trên cả câu, xếp theo độ nổi (topographic prominence) rồi theo thời gian; [] nếu không đủ"""
    top = I.max()
    cand = [i for i in range(1, len(I) - 1) if I[i] >= I[i - 1] and I[i] > I[i + 1] and voiced[i] and I[i] >= top - 25]
    prom = {}
    for i in cand:
        l = next((j for j in reversed(cand) if j < i and I[j] >= I[i]), None)
        r = next((j for j in cand if j > i and I[j] >= I[i]), None)
        lm = I[(l if l is not None else 0):i + 1].min(); rm = I[i:(r + 1 if r is not None else len(I))].min()
        prom[i] = I[i] - max(lm, rm)
    acc = []
    for i in sorted(cand, key=lambda i: -prom[i]):
        if prom[i] < 2 and acc: break
        if all(abs(ti[i] - ti[j]) >= .07 for j in acc): acc.append(i)
        if len(acc) == n: break
    if len(acc) != n: return []
    acc.sort(); peaks = [float(ti[i]) for i in acc]
    bounds = [0.0]
    for a, b in zip(peaks, peaks[1:]):
        sel = np.where((ti > a) & (ti < b))[0]; bounds.append(float(ti[sel[np.argmin(I[sel])]]) if len(sel) else (a + b) / 2)
    bounds.append(dur_in)
    return [(bounds[i], peaks[i], bounds[i + 1]) for i in range(n)]


def trim(s0, p, s1, ti, I):
    """bỏ khoảng lặng ở hai đầu âm tiết (dưới đỉnh 28 dB và dưới mức to nhất của câu 35 dB)"""
    i = int(np.argmin(np.abs(ti - p))); thr = max(I[i] - 28, I.max() - 35)
    sel = np.where((ti >= s0) & (ti <= s1) & (I >= thr))[0]
    if not len(sel): return s0, s1
    return max(s0, float(ti[sel[0]]) - .01), min(s1, float(ti[sel[-1]]) + .015)


def vowel(s0, p, s1, ti, I, voiced):
    """nguyên âm quanh đỉnh p: còn có thanh và trong 8 dB của đỉnh"""
    i = int(np.argmin(np.abs(ti - p))); top = I[i]; a = b = i
    while a - 1 >= 0 and ti[a - 1] >= s0 and voiced[a - 1] and I[a - 1] >= top - 8: a -= 1
    while b + 1 < len(ti) and ti[b + 1] <= s1 and voiced[b + 1] and I[b + 1] >= top - 8: b += 1
    v0, v1 = float(ti[a]), float(ti[b])
    if v1 - v0 < .03:
        c = (v0 + v1) / 2; v0, v1 = max(s0, c - .015), min(s1, c + .015)
    return v0, v1


def whisper_syllables(words, notes, ti, I, voiced, dur_in):
    """[(s0, v0, v1, s1)] cho mỗi âm tiết của bản nhạc: mép từ của Whisper bắt vào chỗ lõm cường độ, đỉnh nguyên âm trong từ"""
    nsyl = max(n['syl'] for n in notes) + 1
    nw = max(n['w'] for n in notes) + 1
    per_w = [len({n['syl'] for n in notes if n['w'] == w}) for w in range(nw)]
    # tách âm tiết theo từ của Whisper (bắt mép vào chỗ lõm cường độ); Whisper gộp / tách từ khác bản nhạc thì dò trên cả câu
    if len(words) == nw:
        edges = [0.0] + [snap((words[i][2] + words[i + 1][1]) / 2, ti, I) for i in range(nw - 1)] + [dur_in]
        syl = [s for w in range(nw) for s in nuclei(edges[w], edges[w + 1], per_w[w], ti, I, voiced)]
    else:
        print(f"  note: {len(words)} words from Whisper vs {nw} in the score, syllables found over the whole line", file=sys.stderr)
        syl = line_nuclei(nsyl, ti, I, voiced, dur_in) or nuclei(0.0, dur_in, nsyl, ti, I, voiced)
    out = []
    for b0, p, b1 in syl:
        s0, s1 = trim(b0, p, b1, ti, I)
        v0, v1 = vowel(s0, p, s1, ti, I, voiced)
        out.append((s0, v0, v1, s1))
    return out


def phone_syllables(ph, notes, dur_in):
    """[(s0, v0, v1, s1)] cho mỗi âm tiết của bản nhạc từ mốc âm vị Kokoro (voice/phones.json); None nếu số từ không khớp bản nhạc.
    Nhân âm tiết = dấu trọng âm + chuỗi nguyên âm (kể cả ː, nguyên âm đôi). Phụ âm giữa hai nhân trong một từ: một phụ âm thì về âm
    tiết sau, hai phụ âm trở lên thì phụ âm đầu ở lại làm âm cuối. Từ có nhiều / ít nhân hơn bản nhạc: gộp hai nhân gần nhau nhất /
    chia đôi nhân dài nhất."""
    nw = max(n['w'] for n in notes) + 1
    per_w = [len({n['syl'] for n in notes if n['w'] == w}) for w in range(nw)]
    import unicodedata
    words, cur = [], []
    for p, a, b in ph:
        if p.isspace() or unicodedata.category(p[:1] or ' ')[0] in 'PSZ':                  # khoảng trắng, dấu câu
            if cur: words.append(cur); cur = []
        else: cur.append((p, min(a, dur_in), min(b, dur_in)))
    if cur: words.append(cur)
    if len(words) != nw: return None
    out = []
    for wph, k in zip(words, per_w):
        nuc, i, n = [], 0, len(wph)
        while i < n:
            if wph[i][0] in VOWELS or (wph[i][0] in STRESS and i + 1 < n and wph[i + 1][0] in VOWELS):
                j = i
                while j + 1 < n and (wph[j + 1][0] in VOWELS or wph[j + 1][0] == 'ː'): j += 1
                nuc.append([wph[i][1], wph[j][2], i, j]); i = j + 1
            else: i += 1
        if not nuc or wph[-1][2] - wph[0][1] < .02: return None
        while len(nuc) > k:                                       # gộp hai nhân sát nhau nhất
            g = min(range(len(nuc) - 1), key=lambda q: nuc[q + 1][0] - nuc[q][1])
            nuc[g:g + 2] = [[nuc[g][0], nuc[g + 1][1], nuc[g][2], nuc[g + 1][3]]]
        while len(nuc) < k:                                       # chia đôi nhân dài nhất
            g = max(range(len(nuc)), key=lambda q: nuc[q][1] - nuc[q][0]); a, b, i0, i1 = nuc[g]; m = (a + b) / 2
            nuc[g:g + 1] = [[a, m, i0, i1], [m, b, i1 + 1, i1]]       # không có phụ âm giữa hai nửa
        bounds = [wph[0][1]]
        for q in range(len(nuc) - 1):
            cons = list(range(nuc[q][3] + 1, nuc[q + 1][2]))
            bounds.append(nuc[q][1] if not cons else wph[cons[0]][1] if len(cons) == 1 else wph[cons[1]][1])
        bounds.append(wph[-1][2])
        for q, (a, b, _, _) in enumerate(nuc):
            out.append((bounds[q], a, b, bounds[q + 1]))
    return out


def sing_line(pm, y, sr, words, S, phones=None):
    mode = {**MODES[S['mode']], **{k: float(S[k]) for k in ('fill', 'glide', 'hi', 'alpha') if S.get(k) is not None}}   # sing.fill / glide / hi / alpha: hát liền hơi, luyến mềm, kéo nguyên âm dài hơn, giữ nhiều ngữ điệu nói hơn kiểu chuẩn (18/11/2026, SHORT-016)
    if S.get('legato', True):
        # (19/11/2026) PSOLA của Praat kéo giãn có phần ngẫu nhiên (mỗi lần dựng một bản khác, tương quan chỉ 0,96–0,99: Whisper lúc
        # nghe đúng lúc sai). Hạt giống theo bản nhạc của câu: cùng đầu vào thì cùng bản hát. sing.seed: chọn "bản thu" khác cho câu đó
        from parselmouth.praat import run
        seed = int(S['seed']) if S.get('seed') is not None else int(hashlib.sha1(json.dumps(S, sort_keys=True).encode()).hexdigest()[:7], 16)
        run(f'random_initializeWithSeedUnsafelyButPredictably ({seed})')
        return sing_line_legato(pm, y, sr, words, S, mode, phones)
    return sing_line_cut(pm, y, sr, words, S, mode)


def sing_line_cut(pm, y, sr, words, S, mode):
    """cách cũ (legato: false): cắt từng âm tiết, đặt nguyên âm vào phách, khoảng giữa là im lặng"""
    from parselmouth.praat import call
    notes = sorted(S['notes'], key=lambda n: n['t'])
    snd, floor, ceil, tp, f0, ti, I, voiced = analyse(pm, y, sr, S.get('range'))
    dur_in = len(y) / sr
    # 1. tách âm tiết theo từ của Whisper
    plan = []
    for k, (s0, v0, v1, s1) in enumerate(whisper_syllables(words, notes, ti, I, voiced, dur_in)):
        ns = [n for n in notes if n['syl'] == k]
        T = ns[0]['t']; D = ns[-1]['t'] + ns[-1]['d'] - T
        plan.append(dict(s0=s0, v0=v0, v1=v1, s1=s1, T=T, D=D, notes=ns, w=ns[0]['w'],
                         on=v0 - s0, v=v1 - v0, co=s1 - v1, f_on=1.0, f_co=1.0))
    # độ dài sau khi kéo: nguyên âm theo kiểu hát. Ô chật thì nén lần lượt: phụ âm đầu của âm tiết sau tới 75 %, phụ âm cuối tới 60 %,
    # nguyên âm tới "lo", rồi mới nén tiếp phụ âm đầu tới 50 % (nén mạnh hơn làm mất phụ âm: "scrape" bị nghe thành "rape")
    ON1, ON2 = .75, .5
    if plan: plan[0]['f_on'] = min(1.0, max(ON2, plan[0]['T'] / max(plan[0]['on'], 1e-3)))
    for k, P in enumerate(plan):
        P['vout'] = float(np.clip(mode['fill'] * P['D'] - P['co'], mode['lo'] * P['v'], mode['hi'] * P['v']))
        if k + 1 < len(plan):
            nx = plan[k + 1]; avail = nx['T'] - P['T']
            over = P['vout'] + P['co'] * P['f_co'] + nx['on'] * nx['f_on'] - avail
            for what, lim in (('on', ON1), ('co', .6), ('v', None), ('on', ON2)):
                if over <= 0: break
                if what == 'on':
                    cut = min(over, max(0.0, nx['on'] * (nx['f_on'] - lim))); nx['f_on'] -= cut / max(nx['on'], 1e-3)
                elif what == 'co':
                    cut = min(over, max(0.0, P['co'] * (P['f_co'] - lim))); P['f_co'] -= cut / max(P['co'], 1e-3)
                else:
                    cut = min(over, max(0.0, P['vout'] - mode['lo'] * P['v'])); P['vout'] -= cut
                over -= cut
        P['phi'] = P['vout'] / P['v']; P['end'] = P['T'] + P['vout'] + P['co'] * P['f_co']
    # 2. DurationTier (thời gian gốc) và ánh xạ gốc → sau khi kéo
    e = .002; pts = []
    for P in plan:
        for a, b, f in ((P['s0'], P['v0'], P['f_on']), (P['v0'], P['v1'], P['phi']), (P['v1'], P['s1'], P['f_co'])):
            if f != 1.0 and b - a > 3 * e: pts += [(a + e, f), (b - e, f)]
            else: pts += [(a + e, 1.0), (b - e, 1.0)]
    pts = [(0.0, 1.0)] + pts + [(dur_in, 1.0)]
    pts = sorted([(max(0.0, min(dur_in, t)), f) for t, f in pts])
    dt = call('Create DurationTier', 'dur', 0, dur_in)
    for t, f in pts: call(dt, 'Add point', t, f)
    g = np.arange(0, dur_in + .0005, .0005)
    phi = np.interp(g, [t for t, _ in pts], [f for _, f in pts]) if pts else np.ones_like(g)
    tau_g = np.concatenate([[0], np.cumsum((phi[1:] + phi[:-1]) / 2 * np.diff(g))])
    tau = lambda t: float(np.interp(t, g, tau_g))
    # PitchTier: mỗi khung có thanh của âm tiết lấy nốt tại thời điểm sẽ vang (sau khi đặt vào phách)
    pt = call('Create PitchTier', 'pitch', 0, dur_in); prev_m = None; last = len(plan) - 1
    for k, P in enumerate(plan):
        sel = np.where((tp >= P['s0']) & (tp < P['s1']) & (f0 > 0))[0]
        if len(sel):
            med = float(np.median(f0[sel])); shift = P['T'] - tau(P['v0'])
            for i in sel:
                t = float(tp[i]); x = tau(t) + shift
                ns = P['notes']; n = ns[0]
                for c in ns:
                    if x >= c['t']: n = c
                j = ns.index(n); m = float(n['m'])
                gl = mode['glide']
                src = ns[j - 1]['m'] if j > 0 else prev_m
                if src is not None and gl > 0 and n['t'] - gl / 2 <= x < n['t'] + gl / 2:
                    w = (x - (n['t'] - gl / 2)) / gl; w = w * w * (3 - 2 * w); m = src + (m - src) * w
                cents = 0.0
                if mode['vib'] and n['d'] >= .4:
                    xv = x - n['t'] - .15
                    if xv > 0: cents += 25 * min(1, xv / .1) * np.sin(2 * np.pi * 5.5 * xv)
                if k == last and x > P['end'] - .08: cents -= 30 * min(1, (x - (P['end'] - .08)) / .08)
                h = hz(m) * (f0[i] / med) ** mode['alpha'] * 2 ** (cents / 1200)
                call(pt, 'Add point', t, float(h))
        prev_m = P['notes'][-1]['m']
    manip = call(snd, 'To Manipulation', .005, floor, ceil)
    call([pt, manip], 'Replace pitch tier'); call([dt, manip], 'Replace duration tier')
    out = call(manip, 'Get resynthesis (overlap-add)').values[0]
    # 3. đặt từng âm tiết: nguyên âm vào đúng phách
    total = notes[-1]['t'] + notes[-1]['d'] + S.get('tail', .1)
    buf = np.zeros(int(round(total * sr)) + 1); prev_end = 0; fi, fo = int(FI * sr), int(FO * sr); placed = []
    for k, P in enumerate(plan):
        a, b = int(round(tau(P['s0']) * sr)), int(round(tau(P['s1']) * sr))
        ch = out[a:b].copy()
        if len(ch) < fi + fo + 2: continue
        st = int(round((P['T'] - (tau(P['v0']) - tau(P['s0']))) * sr))
        if st < 0: ch = ch[-st:]; st = 0
        ch[:fi] *= np.linspace(0, 1, fi); ch[-fo:] *= np.linspace(1, 0, fo)
        if st < prev_end:   # chồng âm tiết trước: cắt đuôi âm tiết trước bằng fade
            cut = min(prev_end, st + fo); buf[st:cut] *= np.linspace(1, 0, cut - st); buf[cut:prev_end] = 0
        en = min(len(buf), st + len(ch)); ch = ch[:en - st]
        if en - st > fo: ch[-fo:] *= np.linspace(1, 0, fo)
        buf[st:en] += ch; prev_end = en; placed.append((P, st / sr, en / sr))
    rms = lambda z: float(np.sqrt(np.mean(z[np.abs(z) > 1e-4] ** 2))) if (np.abs(z) > 1e-4).any() else 0.0
    if rms(buf) > 0: buf *= rms(y) / rms(buf)
    pk = np.abs(buf).max()
    if pk > .98: buf *= .98 / pk
    # đo: phần khung có thanh của mỗi nốt nằm trong ± tol cent
    chk = pm.Sound(buf, sampling_frequency=sr).to_pitch_ac(time_step=.005, pitch_floor=floor, pitch_ceiling=ceil)
    ct, cf = chk.xs(), chk.selected_array['frequency']; hit = tot = 0
    for P, _, _ in placed:
        for n in P['notes']:
            a = n['t'] + mode['glide'] / 2 + .02
            b = min(n['t'] + n['d'], P['T'] + P['vout']) - .01
            sel = np.where((ct >= a) & (ct <= b) & (cf > 0))[0]
            if not len(sel): continue
            err = np.abs(1200 * np.log2(cf[sel] / hz(n['m'])))
            hit += int((err <= mode['tol']).sum()); tot += len(sel)
    lock = hit / tot if tot else 0.0
    v = cf[cf > 0]
    wd = {}
    for P, a, b in placed:
        w = P['w']; wd[w] = (min(wd.get(w, (a, b))[0], a), max(wd.get(w, (a, b))[1], b))
    info = dict(mode=S['mode'], lock=round(lock, 3), med_hz=round(float(np.median(v)), 1) if len(v) else 0,
                max_stretch=round(max(P['phi'] for P in plan), 2), min_stretch=round(min(P['phi'] for P in plan), 2),
                syllables=len(plan), words=[[w, round(a, 3), round(b, 3)] for w, (a, b) in sorted(wd.items())],
                notes=[dict(t=n['t'], d=n['d'], m=n['m'], syl=n['syl'], w=n['w']) for n in notes])
    return buf, info


class Warp:
    """thời gian gốc → thời gian sau khi kéo, với hệ số độ dài tuyến tính từng đoạn qua các điểm (như DurationTier của Praat)"""
    def __init__(self, pts):
        pts = sorted(pts); self.t = np.array([p[0] for p in pts]); self.f = np.array([p[1] for p in pts])
        self.c = np.concatenate([[0.], np.cumsum(np.diff(self.t) * (self.f[1:] + self.f[:-1]) / 2)])

    def __call__(self, t):
        t = float(t)
        if t <= self.t[0]: return (t - self.t[0]) * self.f[0]
        i = min(len(self.t) - 2, int(np.searchsorted(self.t, t, 'right')) - 1)
        if t >= self.t[-1]: return self.c[-1] + (t - self.t[-1]) * self.f[-1]
        ft = self.f[i] + (self.f[i + 1] - self.f[i]) * (t - self.t[i]) / max(1e-9, self.t[i + 1] - self.t[i])
        return self.c[i] + (t - self.t[i]) * (self.f[i] + ft) / 2


def fit(nodes_t, base, wt, target, e=1.0):
    """hệ số tại các điểm trong (a, b) sao cho tích phân trên [a, b] = target; hai đầu cố định e. Dài ra: f = base + λ·wt (nguyên âm
    ngân); ngắn lại: khoảng lặng co trước tới 0,1, rồi mọi thứ co đều. Trả về (hệ số các điểm trong, λ)"""
    t = np.asarray(nodes_t, float); b = np.asarray(base, float); w = np.asarray(wt, float)
    area = lambda v: float(np.sum(np.diff(t) * (v[1:] + v[:-1]) / 2))
    fb = np.concatenate([[e], b, [e]]); fw = np.concatenate([[0.], w, [0.]])
    ib, iw = area(fb), area(fw)
    if target >= ib:
        if iw > 1e-4: lam = (target - ib) / iw; return b + lam * w, lam
        d = np.concatenate([[0.], b, [0.]]); r = (target - area(np.concatenate([[e], 0 * b, [e]]))) / max(1e-6, area(d)); return b * r, 0.
    # ngắn lại theo thứ tự người hát làm: khoảng lặng (tới 0,1) → nguyên âm, phụ âm vang cuối (tới 0,45) → phụ âm (tới 0,6) → co đều.
    # Phụ âm giữ lâu nhất vì nó mang chữ: nén đều thì "Huddle! Fly" (nốt "dle" ¼ phách) mất /f/, Whisper nghe "Ha, don't lie"
    full = lambda v: np.concatenate([[e], v, [e]])
    isv = w > 0
    steps = [np.where(b < 1, np.minimum(b, .1), b)]
    steps.append(np.where(isv, np.minimum(steps[-1], .45), steps[-1]))
    steps.append(np.where(~isv & (b >= 1), np.minimum(steps[-1], .6), steps[-1]))
    prev, A0 = b, ib
    for cur in steps:
        A1 = area(full(cur))
        if A1 <= target:
            k = (A0 - target) / (A0 - A1) if A0 - A1 > 1e-9 else 1.0
            return prev + (cur - prev) * k, 0.
        prev, A0 = cur, A1
    d = np.concatenate([[0.], prev, [0.]]); r = (target - area(np.concatenate([[e], 0 * prev, [e]]))) / max(1e-6, area(d))
    return prev * max(.05, r), 0.


def sing_line_legato(pm, y, sr, words, S, mode, phones=None):
    """hát liền hơi: một DurationTier cho cả câu, nguyên âm của mỗi âm tiết vào đúng phách, không chèn khoảng im giữa các chữ
    (trừ chỗ bản nhạc có dấu nghỉ và cuối câu)"""
    from parselmouth.praat import call
    notes = sorted(S['notes'], key=lambda n: n['t'])
    snd, floor, ceil, tp, f0, ti, I, voiced = analyse(pm, y, sr, S.get('range'))
    dur_in = len(y) / sr
    syl = phone_syllables(phones, notes, dur_in) if phones else None
    align = 'phones' if syl else 'whisper'
    if not syl: syl = whisper_syllables(words, notes, ti, I, voiced, dur_in)
    nsyl = max(n['syl'] for n in notes) + 1
    if len(syl) != nsyl: raise RuntimeError(f'{len(syl)} syllables found for {nsyl} in the score')
    # lớp của từng âm vị (nguyên âm / phụ âm vang / phụ âm khác) để biết chỗ nào được ngân
    cls = []
    if align == 'phones':
        for p, a, b in phones:
            c = 'V' if (p in VOWELS or p == 'ː') else 'R' if p in SONOR else 'S' if p in STRESS else 'C'
            cls.append((min(a, dur_in), min(b, dur_in), c))
    def klass(t):
        for a, b, c in cls:
            if a <= t < b: return c
        return '-'
    plan = []
    for k, (s0, v0, v1, s1) in enumerate(syl):
        ns = [n for n in notes if n['syl'] == k]
        T = ns[0]['t']; D = ns[-1]['t'] + ns[-1]['d'] - T
        v0 = min(max(v0, s0), s1 - .01); v1 = min(max(v1, v0 + .02), s1) if s1 > v0 + .02 else s1
        plan.append(dict(s0=s0, v0=v0, v1=v1, s1=s1, T=T, D=D, notes=ns, w=ns[0]['w']))
    for k in range(len(plan) - 1):                                # âm tiết không chồng lên nhau, nhân của âm tiết sau sau mép của nó
        P, Q = plan[k], plan[k + 1]
        if Q['s0'] < P['s1']: m = (P['s1'] + Q['s0']) / 2; P['s1'] = max(P['v1'], m); Q['s0'] = min(Q['v0'], m)
        if Q['v0'] <= P['v1']: Q['v0'] = P['v1'] + .005
    n = len(plan)
    rest = [k == n - 1 or plan[k + 1]['T'] - (plan[k]['T'] + plan[k]['D']) > .01 for k in range(n)]   # âm tiết cuối cụm
    loud = I.max(); Iat = lambda t: float(np.interp(t, ti, I)); Vat = lambda t: float(np.interp(t, ti, voiced.astype(float))) > .5
    def node_vals(a, b, k, final):
        """các điểm 5 ms trong (a, b) của âm tiết k: base (hệ số khi không ngân) và wt (phần được ngân)"""
        P = plan[k]; Q = plan[k + 1] if k + 1 < n else None
        ts = np.arange(a + .0025, b - .0015, .005)
        if not len(ts): ts = np.array([(a + b) / 2])
        base, wt = np.ones(len(ts)), np.zeros(len(ts))
        for i, t in enumerate(ts):
            quiet = Iat(t) < loud - 30
            if P['v0'] <= t < P['v1']:                                                         # nhân âm tiết: chỗ có thanh ngân,
                if quiet: base[i] = 1.0 if final else CLOSE                                    # chỗ đã tắt tiếng (trước chỗ ngừng) không kéo
                else: wt[i] = 1.0 if Vat(t) else .3
            elif P['v1'] <= t < P['s1']:                                                       # âm cuối: phụ âm vang ngân một nửa,
                c = klass(t)                                                                   # chỗ ngậm của phụ âm tắc (p, t, k) co lại
                if (c == 'R' or (align != 'phones' and Vat(t) and Iat(t) > loud - 20)) and not quiet: wt[i] = SON_W
                elif quiet and not final: base[i] = CLOSE
            elif Q is not None and not final and quiet:                                        # giữa hai chữ: chỗ lặng co lại;
                base[i] = PAUSE if t < Q['s0'] else CLOSE                                      # phụ âm tắc đầu âm tiết sau: chỗ ngậm co lại
        return ts, base, wt
    pts = []                                                       # (thời gian gốc, hệ số)
    # đầu câu: phụ âm đầu giữ nguyên (nén tới 0,5 nếu không đủ "pre")
    A0 = plan[0]['v0']; on0 = A0 - plan[0]['s0']
    f_head = min(1.0, max(.5, plan[0]['T'] / max(on0, 1e-3)))
    pts += [(0.0, f_head), (max(0.0, A0 - .002), f_head)]
    phrase = [[0]]; ends = {}; starts = {0: 0.0}
    for k in range(n):
        P = plan[k]
        if not rest[k]:
            Q = plan[k + 1]
            ts, base, wt = node_vals(P['v0'], Q['v0'], k, False)
            vals, _ = fit([P['v0'], *ts, Q['v0']], base, wt, Q['T'] - P['T'])
            pts += [(P['v0'], 1.0)] + list(zip(ts, vals))
            phrase[-1].append(k + 1)
        else:
            # âm tiết cuối cụm: [v0, s1] vang fill·D (nguyên âm kéo tối đa END_HI), sau s1 hệ số 1
            ts, base, wt = node_vals(P['v0'], P['s1'], k, True)
            nat = P['s1'] - P['v0']; co = P['s1'] - P['v1']; tg = max(nat, mode['fill'] * P['D'])
            if len(P['notes']) > 1:                                # luyến nhiều nốt: nguyên âm phải vang sang nốt cuối (≥ 150 ms), rồi mới tới âm cuối
                ln = P['notes'][-1]; tg = max(tg, ln['t'] - P['T'] + min(.15, .5 * ln['d']) + co)
            capf = max(mode['hi'], END_HI)
            iw = float(np.sum(wt)) * .005
            tg = min(tg, nat + (capf - 1) * iw) if iw > 0 else nat
            vals, _ = fit([P['v0'], *ts, P['s1']], base, wt, tg)
            pts += [(P['v0'], 1.0)] + list(zip(ts, vals)) + [(P['s1'], 1.0)]
            end = min(dur_in, P['s1'] + .03) if k + 1 == n else max(P['s1'], min(P['s1'] + .02, (P['s1'] + plan[k + 1]['s0']) / 2))
            ends[k] = end
            if k + 1 < n:
                Q = plan[k + 1]; start = min(Q['v0'] - .004, max(end + .002, Q['s0'] - .01))
                onq = Q['v0'] - start; room = (Q['T'] - (P['T'] + tg)) - .03          # chỗ trống trước phách của âm tiết sau
                f_on = min(1.0, max(.6, room / max(onq, 1e-3)))
                pts += [(end + .001, 1.0), (start, f_on), (Q['v0'] - .002, f_on)]
                starts[k + 1] = start; phrase.append([k + 1])
    pts.append((dur_in, 1.0))
    # bỏ điểm trùng thời gian (giữ điểm sau), DurationTier cần thời gian tăng dần
    pts = sorted(pts); clean = []
    for t, f in pts:
        t = max(0.0, min(dur_in, t))
        if clean and t - clean[-1][0] < 1e-4: clean[-1] = (clean[-1][0], f) if t <= clean[-1][0] else (t, f); continue
        clean.append((t, float(max(.05, f))))
    tau = Warp(clean)
    dt = call('Create DurationTier', 'dur', 0, dur_in)
    for t, f in clean: call(dt, 'Add point', t, f)
    # cụm: [mép đầu, mép cuối] gốc, độ dời để nhân âm tiết đầu cụm vào đúng phách
    groups = []
    for g in phrase:
        k0, k1 = g[0], g[-1]
        groups.append(dict(ks=g, a=max(0.0, starts[k0]), b=ends[k1], off=plan[k0]['T'] - tau(plan[k0]['v0'])))
    out_t = lambda k, t: tau(t) + groups[next(i for i, g in enumerate(groups) if k in g['ks'])]['off']   # giây trong câu hát
    # PitchTier: khung có thanh lấy nốt đang vang ở thời điểm sẽ phát; phụ âm đầu có thanh luyến từ nốt trước sang nốt của âm tiết
    pt = call('Create PitchTier', 'pitch', 0, dur_in); gl = mode['glide']
    sk = [P['s0'] for P in plan]
    med_all = float(np.median(f0[f0 > 0])) if (f0 > 0).any() else 200.0
    last_end = plan[-1]['T'] + (tau(plan[-1]['s1']) - tau(plan[-1]['v0']))
    for i in np.where(f0 > 0)[0]:
        t = float(tp[i]); k = max(0, int(np.searchsorted(sk, t, 'right')) - 1)
        G = next((g for g in groups if g['a'] - .02 <= t <= g['b'] + .02), None)
        if G is None: continue
        k = min(max(k, G['ks'][0]), G['ks'][-1]); P = plan[k]
        sel = np.where((tp >= P['s0']) & (tp < P['s1']) & (f0 > 0))[0]
        med = float(np.median(f0[sel])) if len(sel) else med_all
        x = tau(t) + G['off']; ns = P['notes']; nn = ns[0]
        for c in ns:
            if x >= c['t']: nn = c
        j = ns.index(nn); m = float(nn['m'])
        src = ns[j - 1]['m'] if j > 0 else (plan[k - 1]['notes'][-1]['m'] if k > 0 else None)
        if src is not None and gl > 0:
            if j == 0 and k > 0 and k != G['ks'][0]:                # sang âm tiết mới trong cụm: luyến qua phụ âm đầu
                w0 = min(nn['t'] - gl / 2, tau(P['s0']) + G['off'] - .01); w1 = nn['t'] + gl / 2
            else: w0, w1 = nn['t'] - gl / 2, nn['t'] + gl / 2
            if w0 <= x < w1:
                u = (x - w0) / max(1e-3, w1 - w0); u = u * u * (3 - 2 * u); m = src + (m - src) * u
        cents = 0.0
        if mode['vib'] and nn['d'] >= .4:
            xv = x - nn['t'] - .15
            if xv > 0: cents += 25 * min(1, xv / .1) * np.sin(2 * np.pi * 5.5 * xv)
        if k == n - 1 and x > last_end - .08: cents -= 30 * min(1, (x - (last_end - .08)) / .08)
        call(pt, 'Add point', t, float(hz(m) * (f0[i] / med) ** mode['alpha'] * 2 ** (cents / 1200)))
    manip = call(snd, 'To Manipulation', .005, floor, ceil)
    call([pt, manip], 'Replace pitch tier'); call([dt, manip], 'Replace duration tier')
    out = call(manip, 'Get resynthesis (overlap-add)').values[0]
    # đặt từng cụm liền hơi
    total = notes[-1]['t'] + notes[-1]['d'] + S.get('tail', .1)
    buf = np.zeros(int(round(total * sr)) + 1); prev_end = 0; fi, fo = int(PFI * sr), int(PFO * sr)
    for G in groups:
        a, b = int(round(tau(G['a']) * sr)), int(round(tau(G['b']) * sr))
        ch = out[a:b].copy(); st = int(round((tau(G['a']) + G['off']) * sr))
        if st < 0: ch = ch[-st:]; st = 0
        if len(ch) < fi + fo + 2: continue
        ch[:fi] *= np.linspace(0, 1, fi)
        if st < prev_end:
            cut = min(prev_end, st + fo); buf[st:cut] *= np.linspace(1, 0, cut - st); buf[cut:prev_end] = 0
        en = min(len(buf), st + len(ch)); ch = ch[:en - st]
        if en - st > fo: ch[-fo:] *= np.linspace(1, 0, fo)
        buf[st:en] += ch; prev_end = en
    rms = lambda z: float(np.sqrt(np.mean(z[np.abs(z) > 1e-4] ** 2))) if (np.abs(z) > 1e-4).any() else 0.0
    if rms(buf) > 0: buf *= rms(y) / rms(buf)
    pk = np.abs(buf).max()
    if pk > .98: buf *= .98 / pk
    # đo: phần khung có thanh của mỗi nốt nằm trong ± tol cent (tới hết nguyên âm của âm tiết)
    chk = pm.Sound(buf, sampling_frequency=sr).to_pitch_ac(time_step=.005, pitch_floor=floor, pitch_ceiling=ceil)
    ct, cf = chk.xs(), chk.selected_array['frequency']; hit = tot = 0
    for k, P in enumerate(plan):
        vend = out_t(k, P['v1'])
        for nn in P['notes']:
            a = nn['t'] + gl / 2 + .02; b = min(nn['t'] + nn['d'], vend) - .01
            sel = np.where((ct >= a) & (ct <= b) & (cf > 0))[0]
            if not len(sel): continue
            err = np.abs(1200 * np.log2(cf[sel] / hz(nn['m'])))
            hit += int((err <= mode['tol']).sum()); tot += len(sel)
    lock = hit / tot if tot else 0.0
    v = cf[cf > 0]
    phi = [(tau(P['v1']) - tau(P['v0'])) / max(1e-3, P['v1'] - P['v0']) for P in plan]
    wd = {}
    for k, P in enumerate(plan):
        a, b = max(0.0, out_t(k, P['s0'])), min(total, out_t(k, min(P['s1'], ends.get(k, P['s1']))))
        w = P['w']; wd[w] = (min(wd.get(w, (a, b))[0], a), max(wd.get(w, (a, b))[1], b))
    info = dict(mode=S['mode'], engine='legato', align=align, lock=round(lock, 3), med_hz=round(float(np.median(v)), 1) if len(v) else 0,
                max_stretch=round(max(phi), 2), min_stretch=round(min(phi), 2), phrases=len(groups), stretch=[round(p, 2) for p in phi],
                syllables=len(plan), words=[[w, round(a, 3), round(b, 3)] for w, (a, b) in sorted(wd.items())],
                notes=[dict(t=nn['t'], d=nn['d'], m=nn['m'], syl=nn['syl'], w=nn['w']) for nn in notes])
    return buf, info


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('lines'); ap.add_argument('voices_dir'); ap.add_argument('--only', default='')
    a = ap.parse_args()
    lines = [L for L in json.load(open(a.lines, encoding='utf-8')) if L.get('sing')]
    if a.only: lines = [L for L in lines if L['id'] in a.only.split(',')]
    if not lines: print('sing.py: no sung lines'); return
    pm = need_parselmouth(); d = a.voices_dir
    rd = lambda f, dflt: json.load(open(os.path.join(d, f), encoding='utf-8')) if os.path.exists(os.path.join(d, f)) else dflt
    dur, words, mark, sung = rd('dur.json', {}), rd('words.json', {}), rd('sing-mark.json', {}), rd('sung.json', {})
    sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tools'))
    from phones import phone_key
    PH = rd('phones.json', {})
    os.makedirs(os.path.join(d, 'spoken'), exist_ok=True); bad = []
    for L in lines:
        f = os.path.join(d, L['id'] + '.wav'); sp = os.path.join(d, 'spoken', L['id'] + '.wav')
        ph = (PH.get(L['id']) or {}).get('ph') if (PH.get(L['id']) or {}).get('key') == phone_key(L) else None
        legato = L['sing'].get('legato', True)
        key = f"{L['text']}|{L.get('voice')}|{L.get('speed')}|{L.get('pitch')}|" + hashlib.sha1(json.dumps(L['sing'], sort_keys=True).encode()).hexdigest()[:12]
        if legato: key += f"|v{VERSION}|{'ph' if ph else 'w'}"                   # cách cũ (legato: false) giữ khoá cũ: dựng lại y như trước
        old = mark.get(L['id'], {})
        if old.get('key') == key and old.get('size') == os.path.getsize(f):
            info = sung.get(L['id'], {})
        else:
            if L['id'] not in words: sys.exit(f"sing.py: no Whisper word timings for {L['id']} in {d}/words.json: run core/tts/asr_check.py on the spoken take first")
            # file đang là bản đã hát (đúng kích thước lần hát trước) thì hát lại từ bản nói gốc, không hát chồng lên bản hát
            src = sp if old and old.get('size') == os.path.getsize(f) and os.path.exists(sp) else f
            if src == f: shutil.copyfile(f, sp)
            y, sr = sf.read(src)
            if y.ndim > 1: y = y.mean(1)
            out, info = sing_line(pm, y, sr, words[L['id']], L['sing'], ph)
            sf.write(f, out, sr); dur[L['id']] = round(len(out) / sr, 3); sung[L['id']] = info
            mark[L['id']] = {'key': key, 'size': os.path.getsize(f)}
        need = MODES[L['sing']['mode']]['lock']; ok = info.get('lock', 0) >= need
        if not ok: bad.append(L['id'])
        print(('OK  ' if ok else 'LOW '), L['id'], f"{L['sing']['mode']:<9} lock {info.get('lock', 0):.2f} (≥ {need})",
              f"· {info.get('med_hz', 0)} Hz · stretch {info.get('min_stretch')}–{info.get('max_stretch')}× · {dur.get(L['id'])} s",
              f"· {info.get('engine', 'cut')} {info.get('align', 'whisper')} {info.get('phrases', '')} |", L['text'])
    for fn, o in (('dur.json', dur), ('sing-mark.json', mark), ('sung.json', sung)):
        json.dump(o, open(os.path.join(d, fn), 'w', encoding='utf-8'), indent=1)
    if bad:
        print('sing.py: pitch lock below the mode threshold:', ', '.join(bad), '(lower the mode, slow the TTS for this line, or simplify the melody)'); sys.exit(1)


if __name__ == '__main__':
    main()
