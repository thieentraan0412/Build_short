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
out += ['Các ngưỡng và kết quả kiểm: `python _shared/qa.py films/' + NAME + '` (nhóm "4 Âm thanh" và "Sound Design Plan").', '']
open(os.path.join(FILM, 'SOUND-PLAN.md'), 'w', encoding='utf-8').write('\n'.join(out))
print(f'{NAME}/SOUND-PLAN.md: {len(MS)} cảnh, {len(moods)} phong cách, {len(leads)} nhạc cụ chính, BPM {bpms}; music-plan.json')
