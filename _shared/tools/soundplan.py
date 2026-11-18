"""Bảng Sound Design Plan của một Short → <tập>/SOUND-PLAN.md (QUALITY.md §4, lượt 11/2026).
    python _shared/tools/soundplan.py films/short-00x
Đọc out/music.json (bảng cảnh nhạc do _shared/audio/groove.py ghi: phong cách, BPM, nhạc cụ, nội dung, cảm xúc, lý do),
events.json (tiếng động theo hình) và timeline.json. Viết:
- bảng 7 cột: Thời gian | Nội dung cảnh | Cảm xúc | Phong cách nhạc | Nhạc cụ | BPM | SFX;
- vì sao chọn nhạc đó cho từng cảnh;
- các chỗ chuyển cảnh âm thanh;
- tóm tắt chống trùng lặp (cùng số liệu qa.py kiểm);
- chống trùng lặp giữa các tập (_shared/audio/channel.py), và ghi <tập>/music-plan.json để các tập khác so.
Không sửa tay SOUND-PLAN.md: sửa G.sec / G.mark trong mix.py (what=, emo=, why=, mood=, arc=, bpm=, sfx=), chạy mix.py rồi chạy lại công cụ này."""
import os, sys, json, collections
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'audio'))
from groove import MOODS, ARCS, TRANS, INST_VI, KIT_VI, STYLE_VI, FAMILY   # noqa: E402
from channel import write_plan, check, lead_of                              # noqa: E402  (chống trùng giữa các tập)

FILM = os.path.abspath(sys.argv[1]); NAME = os.path.basename(FILM)
MJ = json.load(open(os.path.join(FILM, 'out', 'music.json'), encoding='utf-8'))
EV = json.load(open(os.path.join(FILM, 'events.json'), encoding='utf-8'))['ev']
TL = json.load(open(os.path.join(FILM, 'timeline.json'), encoding='utf-8'))
DUR = TL['dur']; MS = sorted(MJ['sections'], key=lambda s: s['t0']); PAUSE = ('break', 'jingle')

SFX_VI = {
    'titlepop': 'pop chữ móc', 'wordpop': 'boing + pop từng chữ', 'notepop': 'pop nốt nhạc', 'popup': 'pop bật lên', 'pop': 'pop', 'pops': 'chuỗi pop',
    'bubble': 'bong bóng', 'bubbles': 'bong bóng', 'blip': 'blip "…"', 'boop': 'boop', 'poof': 'poof',
    'boing': 'boing', 'sproing': 'boing lò xo', 'wobble': 'lò xo rung', 'hop': 'nhảy (boing + whoosh)', 'jump': 'nhảy (boing + whoosh)',
    'swipe': 'whoosh mỏng', 'swish': 'whoosh', 'swishout': 'whoosh lùi', 'zip': 'zip vút', 'whoosh': 'whoosh', 'zoom': 'whoosh lao vào kính',
    'zoomin': 'whoosh xuyên kính', 'zoomout': 'whoosh lùi ra sổ', 'pullback': 'whoosh kéo xa', 'push': 'whoosh đẩy vào', 'shrink': 'thu nhỏ',
    'flyby': 'bay vụt qua', 'buzzby': 'ong bay vụt', 'turn': 'quay người', 'slide': 'trượt', 'glide': 'lướt', 'swirl': 'xoáy phép thuật',
    'punch': 'cartoon hit', 'bonk': 'bonk (va nhẹ)', 'clonk': 'clonk (va nhẹ)', 'crash': 'va chạm hoạt hình', 'splat': 'bẹp!', 'stomp': 'giẫm',
    'squish': 'bẹp mềm', 'squeeze': 'bóp', 'fall': 'rơi', 'drop': 'giọt rơi', 'plip': 'giọt nước', 'splash': 'tõm', 'land': 'đáp xuống',
    'tap': 'gõ nhẹ', 'clack': 'tách tách (cánh)', 'steps': 'bước chân', 'climb': 'leo', 'giggle': 'tiếng cười', 'aww': '"aww"',
    'startle': 'giật mình', 'huh': '"hử?"', 'reveal': 'lộ ra (bất ngờ)', 'buzzer': 'còi sai', 'nope': '"NOPE!" bất ngờ', 'freeze': 'khựng',
    'hush': 'trống lăn thì thầm', 'twitch': 'giật nhẹ', 'shrug': 'nhún vai', 'sparkle': 'lấp lánh', 'flare': 'bùng sáng', 'glint': 'loé sáng',
    'tink': 'tink kính', 'chime': 'chuông', 'ding': 'ding', 'dingdong': 'ding-dong', 'badge': 'huy hiệu ding', 'wonder': 'lấp lánh "wow"',
    'swell': 'dâng phép thuật', 'bloom': 'hoa nở', 'blush': 'đỏ mặt lấp lánh', 'wink': 'nháy mắt', 'hearts': 'tim bay', 'petals': 'cánh hoa',
    'flash': 'nháy sáng (glock)', 'code': 'mật mã ánh sáng', 'reply': 'nháy đáp', 'sync': 'nháy đồng loạt', 'signal': 'tín hiệu ngọt',
    'scent': 'mùi bay', 'wisp': 'làn mùi', 'puffin': 'mây mùi bay vào', 'snap': 'chụp sticker', 'stamp': 'dán sticker',
    'slotstamp': 'sticker vào ô', 'slots': 'ô sticker hiện', 'page': 'lật trang', 'pages': 'lật trang', 'paper': 'giấy sột soạt',
    'flip': 'lật trang', 'count': 'đếm "1 2 3"', 'show': 'khoe', 'lensiris': 'chuyển cảnh qua kính', 'ringiris': 'chuyển cảnh vòng sóng',
    'puffiris': 'chuyển cảnh mây mùi', 'dropiris': 'chuyển cảnh giọt', 'glowiris': 'chuyển cảnh ánh sáng', 'spot': 'chuyển cảnh đốm',
    'descend': 'hạ xuống (vòng lặp)', 'nightfall': 'ngày → đêm', 'recall': 'chữ móc trở lại', 'logo': 'logo lấp lánh',
    'flutter': 'cánh bướm vỗ', 'buzzin': 'ong vo ve', 'chirp': 'dế gáy', 'farchirp': 'dế xa', 'hear': 'tai "nghe"', 'legup': 'nhấc chân',
    'drum': 'màng nhĩ rung', 'sniff': 'hít ngửi', 'mmm': '"Mmm!"', 'munch': 'nhồm nhoàm', 'slurp': 'hút sột', 'sip': 'nhấp', 'gulp': 'ực',
    'curl': 'cuộn vòi', 'squeak': 'chít chít', 'nuzzle': 'cọ râu', 'tick': 'tíc tắc', 'windup': 'lên dây cót', 'block': 'mõ',
    'roll': 'Rollo lăn', 'tadda': 'ta-da', 'cheer': 'reo vui', 'surprise': 'ngạc nhiên', 'scurry': 'chạy lon ton', 'footsteps': 'bước chân',
    'scrape': 'kéo chân "zzip"', 'hopL': 'nhảy sang (boing + whoosh)', 'landsoft': 'đáp nhẹ', 'slide': 'kính trượt', 'chorus': 'lấp lánh vào điệp khúc',
    'notestream': 'nốt tuôn ra', 'deepout': 'whoosh lùi ra', 'glintrun': 'gai sáng lần lượt', 'lensdown': 'kính hạ xuống', 'rubtry': 'cọ chân',
    'blinkhop': 'chớp mắt', 'hmm': '"hử?"', 'wiggle': 'ngọ nguậy', 'deep': 'lao sâu vào kính', 'zzzip': 'tràng "zzzzip"', 'touch': 'chạm mép cánh',
    'violin': 'vĩ cầm hiện ra', 'step': 'bước', 'ready': 'sẵn sàng', 'pan': 'lia (whoosh nhẹ)',
}
f1 = lambda x: f'{x:.1f}'.replace('.', ',')
def inst(k): return INST_VI.get(k, k) if k else None
def pace(s):
    if s['style'] in PAUSE: return 'khựng' if s['style'] == 'break' else 'bừng lên'
    fb = s.get('feel_bpm') or s.get('bpm') or 120
    if s.get('arc') == 'peak' and s.get('energy', 2) >= 3: return 'cao trào'
    if fb >= 126 or s.get('energy', 2) >= 3: return 'nhanh'
    if fb >= 100 and s.get('energy', 2) >= 2: return 'vừa'
    return 'chậm' if fb < 100 or s.get('energy', 2) <= 1 else 'vừa'
def mood(s):
    if s['style'] == 'break':
        m = s.get('mood')
        return 'Khựng (Suspense & Surprise)' if m in (None, 'suspense') else f"Khựng · {MOODS.get(m, m)}"
    if s['style'] == 'jingle': return 'Nhạc hiệu kênh'
    return MOODS.get(s.get('mood') or '', s.get('mood') or '—')
def instruments(s):
    if s['style'] == 'break' and not (s.get('comp') or s.get('lead')): return 'lớp mỏng (khoảng lặng có chủ đích)'
    parts = []
    if s.get('lead'): parts.append(f"**{inst(s['lead'])}** (giai điệu)")
    for r in ('comp', 'arp'):
        k = s.get(r)
        if k and k != s.get('lead') and inst(k) not in [p.split(' (')[0].strip('*') for p in parts] and k in INST_VI: parts.append(inst(k))
    if s.get('bass'): parts.append(inst(s['bass']))
    if s.get('kit') and KIT_VI.get(s['kit']): parts.append(KIT_VI[s['kit']])
    return ' · '.join(parts) or '—'
def bpm(s):
    if s['style'] == 'break': return '—'
    b = s.get('bpm') or MJ.get('bpm', 120); fb = s.get('feel_bpm') or b
    b = int(round(b)); fb = int(round(fb))
    return f'{b}' + (f' (cảm giác {fb})' if fb != b else '')
def sfx(s):
    ev = [e for e in EV if s['t0'] - 1e-6 <= e['t'] < s['t1'] - 1e-6]
    c = collections.Counter(SFX_VI.get(e['type'], e['type']) for e in ev if SFX_VI.get(e['type'], e['type']))
    out = [s['sfx']] if s.get('sfx') else []
    out += [f'{k} ×{n}' if n > 1 else k for k, n in c.most_common(5)]
    if len(c) > 5: out.append(f'+{sum(c.values()) - sum(n for _, n in c.most_common(5))} tiếng khác')
    return ', '.join(out) or '—'
cell = lambda x: str(x).replace('|', '/').replace('\n', ' ')

# ---------- (11/2026b) bảng Musical Storytelling ----------
STYLE_EN = {'bounce': 'bouncy two-step', 'skip': 'skipping shuffle', 'march': 'cartoon march', 'polka': 'polka', 'calypso': 'calypso', 'swing': 'swing',
            'sway': 'gentle sway', 'gallop': 'gallop', 'tiptoe': 'tiptoe pizzicato', 'float': 'floating arpeggios', 'country': 'country hoedown',
            'waltz': 'waltz', 'waltzfloat': 'floating waltz', 'stride': 'stride piano', 'hero': 'heroic fanfare', 'quest': 'adventure quest',
            'sunny': 'sunny ukulele pop', 'hop': 'hopping off-beat groove', 'twinkle': 'twinkling music-box', 'lilt': 'lilting 6/8', 'jingle': 'channel jingle',
            'jig': '12/8 jig', 'bossa': 'bossa nova', 'ska': 'ska', 'samba': 'samba', 'disco': 'disco', 'secondline': 'second-line brass', 'chacha': 'cha-cha-chá',
            'reggae': 'reggae one-drop', 'cumbia': 'cumbia', 'funk': 'funk', 'tango': 'cartoon tango', 'break': 'comic stop'}
INST_EN = {'pluck': 'ukulele', 'marimba': 'marimba', 'bassn': 'plucked bass', 'buzz': 'buzzy bass', 'upright': 'upright bass', 'tuba': 'tuba',
           'pizzbass': 'low pizzicato', 'pizz': 'pizzicato strings', 'xylo': 'xylophone', 'glock': 'glockenspiel', 'flute': 'flute', 'reed': 'clarinet',
           'horn': 'toy horn', 'steel': 'steel drum', 'celesta': 'celesta', 'harp': 'harp', 'rhodes': 'electric piano', 'vibes': 'vibraphone', 'banjo': 'banjo',
           'bell': 'bells', 'piano': 'piano', 'pianohi': 'bright piano', 'toypiano': 'toy piano', 'trumpet': 'trumpet', 'mute': 'muted trumpet',
           'trombone': 'trombone', 'bassoon': 'bassoon', 'bassoonlo': 'low bassoon', 'kazoo': 'kazoo', 'accordion': 'accordion', 'strings': 'spiccato strings'}
KIT_EN = {'toy': 'hand claps, shaker and wood blocks', 'pop': 'kick, claps and hi-hat', 'march': 'snare and tambourine', 'jazz': 'finger snaps and brushes',
          'latin': 'claves and shaker', 'wood': 'wood blocks and shaker', 'tom': 'soft toms', 'brush': 'brushes', 'epic': 'timpani and snare',
          'bongo': 'bongos and shaker', 'clap': 'hand claps and tambourine', 'tri': 'triangle and shaker', 'comic': 'two-tone wood blocks',
          'bodhran': 'bodhrán', 'rim': 'rim clicks', 'ska': 'ska drums', 'samba': 'samba percussion', 'disco': 'four-on-the-floor disco drums',
          'second': 'second-line snare', 'cha': 'cowbell and guiro', 'dub': 'one-drop drums', 'guira': 'tambora and güira', 'funk': 'funk drums',
          'tango': 'brush drags and marcato bass'}
TRANS_EN = {'fill': 'a drum fill', 'riser': 'a riser with reverse cymbal', 'pickup': 'pickup notes of the next instrument', 'run': 'a descending run',
            'gliss': 'a harp glissando', 'swell': 'a sparkle swell', 'drop': 'a slide-whistle drop', 'tail': 'a soft tail', 'soft': 'a soft change under the voice',
            'tay': 'a hand-written stinger'}
WHO_EN = {'loupe': 'Miss Loupe (cheerful woman, clear)', 'albie': 'Albie (warm low man)', 'crumb': 'Crumb (little kid voice)', 'dot': 'Dot (bright kid voice, British)',
          'blink': 'Blink (high giggly kid voice, British)'}
MODE_VI = {'sing-talk': 'sing-talk (nói theo nhịp)', 'half-sing': 'half-sing (nửa hát)', 'sing': 'hát trọn', 'speak': 'nói'}
MODE_EN = {'sing-talk': 'rhythmic sing-talk', 'half-sing': 'half-sung', 'sing': 'fully sung', 'speak': 'spoken'}
NN = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
note_name = lambda m: f'{NN[m % 12]}{m // 12 - 1}'
EN_E = {1: 'low', 2: 'medium', 3: 'high'}


def musical_tables():
    LN = sorted(TL['lines'], key=lambda l: l['t'])
    def in_sec(s): return [l for l in LN if l['t'] < s['t1'] - 1e-6 and l['t'] + l['dur'] > s['t0'] + 1e-6]
    def vocal(s):
        ls = in_sec(s)
        if not ls: return 'không lời'
        return '<br>'.join(f"{l['id']} {l['who']}: {MODE_VI[(l.get('sung') or {}).get('mode', 'speak')]}" + (f" · điệp khúc '{l['sung']['chorus']}'" if (l.get('sung') or {}).get('chorus') else '') for l in ls)
    def bgm(s):
        if s['style'] in PAUSE: return mood(s)
        return f"{mood(s)}: {STYLE_VI.get(s['style'], s['style'])}, {s['key']}, {bpm(s)} BPM, " + (f"giai điệu {inst(s.get('lead') or s.get('arp'))}" if (s.get('lead') or s.get('arp')) else 'đệm') + (' · theo bài hát' if s.get('song') else '')
    o = ['## Music Timeline', '', '> Task.md mục 8B. Cột Vocal Style lấy từ kiểu hát của từng câu (`sing.mode` trong `timeline.js`); SFX từ `events.json`.', '',
         '| Thời gian | Cảnh | Background Music | Vocal Style | SFX |', '|---|---|---|---|---|']
    for s in MS:
        o.append('| ' + ' | '.join(cell(x) for x in (f"{f1(s['t0'])}–{f1(s['t1'])} s", s.get('what') or s['name'], bgm(s), vocal(s), sfx(s))) + ' |')
    o += ['', '## Sing-along Dialogue', '', '> Task.md mục 8C. Nốt do `_shared/song.js` giải từ `sing.notes`; giọng hát do `_shared/sing.py` làm từ chính giọng TTS của nhân vật.', '',
          '| Câu | Ai | Lời | Kiểu | Giai điệu (nốt · giây) | Điệp khúc | Nhấn |', '|---|---|---|---|---|---|---|']
    for l in LN:
        sg = l.get('sung'); mode = (sg or {}).get('mode', 'speak')
        mel = ' '.join(f"{note_name(n['m'])}·{n['d']:.2f}" for n in sg['notes']) if sg else '—'
        o.append('| ' + ' | '.join(cell(x) for x in (f"{l['id']} ({f1(l['t'])} s)", l['who'], l['text'], MODE_VI[mode], mel, (sg or {}).get('chorus') or '', ', '.join(l.get('em') or []))) + ' |')
    words = lambda l: len(l['text'].split()); tot = sum(words(l) for l in LN) or 1
    sung = sum(words(l) for l in LN if (l.get('sung') or {}).get('mode') in ('sing-talk', 'half-sing', 'sing'))
    o += ['', f'Lời có nhịp hoặc giai điệu: **{sung / tot:.0%}** số từ ({sung}/{tot}); nói tự nhiên {1 - sung / tot:.0%}.', '']
    o += ['## Sound Effects Timeline', '', '> Task.md mục 8E. Chuỗi nhịp có chủ đích ghi `run` trong `events.json` (qa: không tính là lặp máy móc).', '',
          '| Giây | Tiếng | Chuỗi |', '|---|---|---|']
    for e in sorted(EV, key=lambda e: e['t']):
        o.append(f"| {f1(e['t'])} | {cell(SFX_VI.get(e['type'], e['type']))} | {e.get('run', '')} |")
    o += ['', '## AI Music Generation Prompts', '',
          '> Task.md mục 8D. Prompt tiếng Anh cho từng đoạn nhạc, sinh từ đúng thông số của cảnh (phong cách, BPM, giọng, nhạc cụ, năng lượng, cách chuyển).',
          '> Chỉ để tham khảo hoặc làm bản nháp ngoài: nhạc trong phim vẫn tổng hợp bằng code (`groove.py`), giọng hát vẫn là giọng nhân vật.', '']
    for i, s in enumerate(MS):
        if s['style'] == 'jingle': continue
        nx = MS[i + 1] if i + 1 < len(MS) else None; tr = next((t for t in trs if nx and abs(t['t'] - nx['t0']) < 1e-3), None)
        ls = in_sec(s)
        voc = '; '.join(f"{WHO_EN.get(l['who'], l['who'])} {MODE_EN[(l.get('sung') or {}).get('mode', 'speak')]}: \"{l['text']}\"" for l in ls) or 'instrumental only (no vocals)'
        ins = ', '.join(dict.fromkeys(INST_EN.get(k, k) for k in (s.get('lead'), s.get('comp'), s.get('arp'), s.get('bass')) if k)) + (f", {KIT_EN[s['kit']]}" if KIT_EN.get(s.get('kit') or '') else '')
        mel = (f"lead {INST_EN.get(s.get('lead'), s.get('lead'))} answers in the gaps between lines" if s.get('lead') else 'no lead melody, light accompaniment') + \
              ('; backing follows the vocal melody\'s chords, ' + s['chords'] if s.get('song') else '')
        end = (f"hand over to the next scene with {TRANS_EN.get(tr['type'], tr['type'])}" if tr else 'end on the tonic chord so the loop returns to the first frame') if s['style'] != 'break' else 'hold a thin vibraphone shimmer, then resume'
        genre = 'comic stop' if s['style'] == 'break' else f"{MOODS.get(s.get('mood') or '', 'Playful Cartoon')} kids' music, {STYLE_EN.get(s['style'], s['style'])}"
        o += [f"**{f1(s['t0'])}–{f1(s['t1'])} s · {s.get('what') or s['name']}**", '',
              '```', f"Genre: {genre}. Mood: cheerful, {EN_E.get(s.get('energy', 2), 'medium')} energy, major key ({s['key']}). BPM: {bpm(s)}.",
              f"Instruments: {ins or 'light percussion'}. Vocal style: {voc}.",
              f"Melody: {mel}. Voice stays on top: music ducks under every word.",
              f"Energy changes: {'builds' if s.get('arc') in ('build', 'peak') else 'steady'}; accent the first beat. Ending: {end}. Length: {s['t1'] - s['t0']:.1f} s.", '```', '']
    o += ['## Final Audio Checklist', '', '> Task.md mục 8F: điền tay khi nghe lại cả phim.', '',
          '- [ ] Nhạc có sinh động không? · [ ] Có thay đổi theo cảnh không? · [ ] Lời thoại có giai điệu không?',
          '- [ ] Có đoạn nhạc dễ nhớ (điệp khúc, motif) không? · [ ] Giọng hát có rõ không? · [ ] Nhạc nền có lấn át giọng không?',
          '- [ ] SFX có khớp hành động không? · [ ] Âm nhạc có tạo cảm xúc và giữ chân người xem không?', '']
    return o

rows = []
for i, s in enumerate(MS):
    when = f"{f1(s['t0'])}–{f1(s['t1'])} s" + (f"<br>*{ARCS[s['arc']]}*" if s.get('arc') in ARCS else '')
    what = s.get('what') or s['name']
    emo = (s.get('emo') or '—') + f" · nhịp {pace(s)}"
    sty = mood(s) + (f"<br>{STYLE_VI.get(s['style'], s['style'])}, {s['key']}" if s['style'] not in PAUSE else '')
    rows.append('| ' + ' | '.join(cell(x) for x in (when, what, emo, sty, instruments(s), bpm(s), sfx(s))) + ' |')

body = [l for l in MS if l['style'] not in PAUSE]
moods = collections.Counter(s.get('mood') for s in body if s.get('mood'))
leads = collections.Counter(s.get('lead') or s.get('arp') for s in body if s.get('lead') or s.get('arp'))
fams = sorted({FAMILY.get(k) for s in MS for k in (s.get('lead'), s.get('comp'), s.get('arp'), s.get('bass')) if FAMILY.get(k)} |
              ({'bộ gõ'} if any(s.get('kit') not in (None, '', 'none') for s in MS) else set()))
bpms = sorted({int(round(s.get('bpm') or 120)) for s in body})
trs = MJ.get('transitions', [])
trc = collections.Counter(t['type'] for t in trs)
arcs = collections.OrderedDict()
for s in MS:
    if s.get('arc') in ARCS: arcs.setdefault(s['arc'], []).append(s)

out = [f'# {NAME.upper()} · Sound Design Plan', '',
       '> Sinh tự động bằng `python _shared/tools/soundplan.py films/' + NAME + '` từ `out/music.json` (bảng cảnh nhạc khai báo trong `mix.py` bằng `G.sec` / `G.mark`) và `events.json`.',
       '> Đừng sửa tay: sửa `what=`, `emo=`, `why=`, `mood=`, `arc=`, `bpm=`, `sfx=` trong `mix.py`, dựng lại rồi chạy lại công cụ. Quy tắc: [`QUALITY.md` §4](../../_shared/QUALITY.md#4-âm-thanh-và-nhạc-nền).', '']
if MJ.get('color'): out += [f"**Màu nhạc của tập:** {MJ['color']}. Chi tiết nhạc cụ, giọng và điểm nhấn viết tay: [`MUSIC.md`](MUSIC.md); bảng cue hình ↔ tiếng: [`SOUND.md`](SOUND.md).", '']
out += ['## Cung bậc', '']
for a in ('open', 'build', 'peak', 'end'):
    if a in arcs:
        ss = arcs[a]; sb = [s for s in ss if s['style'] not in PAUSE] or ss
        ms = ', '.join(dict.fromkeys(mood(s) for s in sb)); bs = sorted({int(round(s.get('bpm') or 120)) for s in sb})
        out.append(f"- **{ARCS[a]}** {f1(ss[0]['t0'])}–{f1(ss[-1]['t1'])} s: {ms}; {'–'.join(map(str, [bs[0], bs[-1]] if len(bs) > 1 else bs))} BPM; "
                   + ', '.join(dict.fromkeys(inst(s.get('lead') or s.get('arp')) for s in sb if (s.get('lead') or s.get('arp')))))
out += ['', '## Bảng thiết kế âm thanh', '',
        '| Thời gian | Nội dung cảnh | Cảm xúc | Phong cách nhạc | Nhạc cụ | BPM | SFX |', '|---|---|---|---|---|---|---|'] + rows
out += ['', '## Vì sao chọn nhạc này', '']
for i, s in enumerate(MS, 1):
    tr = next((t for t in trs if abs(t['t'] - s['t0']) < 1e-3), None)
    head = f"{i}. **{f1(s['t0'])}–{f1(s['t1'])} s · {s.get('what') or s['name']}** ({mood(s)}, {bpm(s)} BPM)"
    why = s.get('why') or '—'
    t_ = f" *Vào cảnh:* {TRANS.get(tr['type'], tr['type'])}." if tr else ''
    out.append(f'{head}: {why}{t_}')
out += ['', '## Chuyển cảnh âm thanh', '', '| Giây | Từ → sang | Cách chuyển | BPM |', '|---|---|---|---|']
for t in trs:
    b0, b1 = (int(round(x)) for x in t['bpm'])
    out.append(f"| {f1(t['t'])} | {cell(t['from'])} → {cell(t['to'])} | {TRANS.get(t['type'], t['type'])} | {b0}{' → ' + str(b1) if b1 != b0 else ''} |")
out += ['', '## Chống trùng lặp', '',
        f"- {len(MS)} cảnh nhạc ({len(body)} cảnh có điệu, còn lại là khựng / nhạc hiệu viết tay).",
        f"- {len(moods)} phong cách nhạc: " + ', '.join(f'{MOODS.get(k, k)} ×{n}' for k, n in moods.most_common()) + '.',
        f"- {len(leads)} nhạc cụ hát chính: " + ', '.join(f'{inst(k)} ×{n}' for k, n in leads.most_common()) + '.',
        f"- {len(fams)} họ nhạc cụ: " + ', '.join(fams) + '.',
        f"- BPM: {', '.join(map(str, bpms))} ({len(bpms)} mức).",
        f"- Chuyển cảnh: " + ', '.join(f'{TRANS.get(k, k)} ×{n}' for k, n in trc.most_common()) + '.',
        f"- Câu đáp của nhạc giữa các câu thoại: {MJ.get('fills', 0) + len(MJ.get('answers', []))}.", '']
# ---- (11/2026b) Musical Storytelling: Music Timeline, Sing-along, SFX timeline, AI music prompts (Task.md mục 8 A–F) ----
if str(TL.get('standard', '')) >= '2026-11b':
    out += musical_tables()
# ---- chống trùng giữa các tập (channel.py): so với music-plan.json của mọi Short khác ----
write_plan(FILM, MJ, DUR)
if not NAME.startswith('long-'):
    R = check(FILM, MS, DUR)
    pct = lambda x: f'{x * 100:.0f} %'
    sty = lambda k: STYLE_VI.get(k, k)
    rec = lambda s: ' + '.join(x for x in (sty(s['style']), inst(lead_of(s)), inst(s.get('comp') or s.get('arp')), KIT_VI.get(s.get('kit') or '', '')) if x)
    borrowed = ', '.join(sty(s['style']) + ' (' + ep + ')' for s, ep in R['foreign'])
    out += ['## Chống trùng lặp giữa các tập', '',
            f"So với {len(R['compared'])} Short khác ({', '.join(c.replace('short-', '') for c in R['compared']) or 'chưa có'}), từ `music-plan.json` của từng tập.", '',
            '- **Điệu riêng của tập:** ' + (', '.join(sty(s) for s in R['own']) or 'chưa có (ghi vào `SIGNATURE` trong groove.py)')
            + f", chiếm {pct(R['sig_share'])} thời lượng" + (f'; mượn điệu riêng của tập khác: {borrowed}' if borrowed else '') + '.',
            '- **Công thức trùng với Short khác:** ' + ('; '.join(f"{f1(s['t0'])} s {rec(s)} = {n} {f1(o['t0'])} s" for s, n, o in R['dups']) or 'không có') + '.',
            '- **Cặp điệu + nhạc cụ hát chính đã có ở Short khác:** '
            + ('; '.join(f"{STYLE_VI.get(k[0], k[0])} + {inst(k[1])} ({', '.join(e.replace('short-', '') for e in v)})" for k, v in R['pairs'].items() if v) or 'không có')
            + (f" (quá quen, ≥ 3 tập: {len(R['common'])})" if R['common'] else '') + '.',
            f"- **Vui nhộn:** hồi hộp + khựng {pct(R['sus_share'])}, cảnh nền giọng thứ {pct(R['minor_share'])} thời lượng (mỗi mục ≤ 20 %).", '']
# ---- (18/11/2026) thiết kế âm thanh theo cảnh, 4 lớp (Task.md 18/11/2026, QUALITY.md §10): out/scenes.json do mix.py ghi ----
_sc = os.path.join(FILM, 'out', 'scenes.json')
if os.path.exists(_sc):
    SCN = json.load(open(_sc, encoding='utf-8'))['scenes']
    EN_VI = {'calm': 'êm', 'normal': 'thường', 'high': 'mạnh', 'peak': 'cao trào'}
    AMB_VI = {'snow_garden': 'vườn tuyết: gió lạnh có cơn, gió rít khẽ, chim mùa đông xa, tuyết lách tách', 'hive_warm': 'trong tổ ong: rì rầm ấm qua vách',
              'paper_room': 'trang sổ / bản đồ: phòng yên tĩnh, giấy sột soạt', 'leaf_snow': 'sát đống lá: lá xào xạc, tuyết lách tách',
              'meadow': 'bãi cỏ: gió nhẹ, chim líu lo', 'night': 'vườn đêm: gió nhẹ, dế xa', 'pond': 'mép ao: nước lăn tăn, chim xa'}
    out += ['## Thiết kế âm thanh theo cảnh (4 lớp)', '',
            '> Task.md 18/11/2026 mục 5: mỗi cảnh 4 lớp Voice · Background Music · Sound Effects · Ambient. Sinh từ `out/scenes.json` (mức năng lượng và lớp nền khai báo ở `SCENES` trong `mix.py`), cảm xúc của câu (`emo` trong `timeline.js`) và `events.json`.', '',
            '| Cảnh | Năng lượng | Lớp 1 · Voice | Lớp 2 · Music | Lớp 3 · SFX | Lớp 4 · Ambient |', '|---|---|---|---|---|---|']
    for sc in SCN:
        vo = '<br>'.join(f"{v['id']} {v['who']} · {v.get('emo') or '—'} · {v['mode']}" for v in sc['voice']) or '—'
        out.append('| ' + ' | '.join(cell(x) for x in (f"{f1(sc['t0'])}–{f1(sc['t1'])} s · {sc['id']}", EN_VI.get(sc['energy'], sc['energy']), vo,
                                                     '<br>'.join(sc['music']) or '—', ', '.join(sc['sfx']) or '—', AMB_VI.get(sc['amb'], sc['amb']))) + ' |')
    out.append('')
_av = os.path.join(FILM, 'out', 'av-sync.json')
if os.path.exists(_av):
    AV = json.load(open(_av, encoding='utf-8'))
    out += ['## Đồng bộ hình – tiếng', '', f"`_shared/tools/av_sync.py` đo trên video: {len(AV['onsets'])} điểm chuyển động mạnh, {AV['coverage'] * 100:.0f} % có tiếng động hoặc lời trong ± {AV['tol']} s."
            + (f" Thiếu tiếng: {', '.join(f'{x:.2f}' for x in AV['missing'])} s." if AV['missing'] else '')
            + (f" Tiếng lệch > 0,15 s: {', '.join(f'{t} s {ty} ({d:+.2f})' for t, ty, d in AV['off'])}." if AV['off'] else ''), '']
out += ['Các ngưỡng và kết quả kiểm: `python _shared/qa.py films/' + NAME + '` (nhóm "4 Âm thanh", "Sound Design Plan" và "10 Âm thanh theo cảnh").', '']
open(os.path.join(FILM, 'SOUND-PLAN.md'), 'w', encoding='utf-8').write('\n'.join(out))
print(f'{NAME}/SOUND-PLAN.md: {len(MS)} cảnh, {len(moods)} phong cách, {len(leads)} nhạc cụ chính, BPM {bpms}; music-plan.json')
