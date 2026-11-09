"""Âm thanh của LONG-001 → out/mix.wav (48 kHz stereo): nhạc "Winter Album Suite" (MUSIC.md) dựng bằng lớp nhịp theo cảnh (_shared/audio/groove.py)
+ điểm nhấn viết tay (nhạc hiệu, mô-típ bí mật ở mỗi lần trang tan, stinger), tiếng động theo events.json, nền theo bối cảnh, giọng.
python mix.py   (cần timeline.json + voice/*.wav từ tools/lines.mjs, core/tts/tts.py và _shared/voicefx.py, events.json từ core/render/events.mjs)
Mọi âm thanh tổng hợp bằng code (_shared/audio/band.py, toon.py, core/audio/sfx.py); không dùng mẫu của bên thứ ba."""
import os, sys, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio')); sys.path.insert(0, os.path.join(LIB, '_shared', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, whoosh, thump, pop, click, step, compress, add
from band import fade, mf, pluck, marimba, bassn, kick, clap, hat, shaker, bell, horn, pad, chirp, riser, glide, jingle, mmm
from band import pizz, xylo, flute, reed, tuba, tom, claves, celesta, harp, vibes, upright, snare, steel, secret, triad, MIN
from groove import Groove, glock
import toon as T

TL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))
EV = json.load(open(os.path.join(HERE, 'events.json'), encoding='utf-8'))['ev']
H, LINES = TL['hit'], TL['lines']
BEAT = 60 / TL['bpm']; BAR = BEAT * 4; DUR = TL['dur']; N = int((DUR + .05) * SR)
B = {k: np.zeros((N + int(3 * SR), 2)) for k in ('mus', 'fx', 'amb')}
LN = {l['id']: l for l in LINES}
def mixl(*xs):
    n = max(len(x) for x in xs); return sum(np.pad(x, (0, n - len(x))) for x in xs)
def speaking(t, pad_=.05): return any(l['t'] - pad_ <= t < l['t'] + l['dur'] + pad_ for l in LINES)


# ---------- nhạc: "Winter Album Suite" — chủ đề hộp nhạc mùa đông ở bậu cửa sổ; mỗi trang ký ức mang lại một màu nhạc mùa hè ----------
mus = B['mus']
REST = ((H['c2_bonk'] - .02, H['c2_bonk'] + .5), (H['e_sneeze'] + .9, H['e_sneeze'] + 1.45))   # khựng: Crumb đụng ngõ cụt; ngay trước "CHOO!"
def M(x, t, g=1., pan=0.):
    if any(a <= t < b for a, b in REST): return
    add(mus, x, t, g, pan)
def seq(inst, ns, t0, step, g=1., pan=0., d=None, ramp=0.):
    for i, n in enumerate(ns):
        if n: M(inst(n, d) if d else inst(n), t0 + i * step, g * (1 + ramp * i), pan)
def strum(inst, ns, t, g=.4, d=None, spread=.012):
    for k, n in enumerate(ns): M(inst(n, d) if d else inst(n), t + k * spread, g, -.3 + .6 * k / max(1, len(ns) - 1))
def cymbal(t, g=.22, br=4500): M(T.cymbal(1.6, 1., br), t, g, .15)

# vùng giai điệu của lớp nhịp nhường chỗ: điểm nhấn viết tay và các nhịp chờ trẻ trả lời (chỉ còn trống + bass "đang nghĩ")
UNL = ['L22', 'L38', 'L50', 'L61', 'L81']
AVOID = [(LN[u]['t'] - .1, LN[u]['t'] + 1.2) for u in UNL] + [
    (0, 2.3), (H['c1_lab'], H['c1_fly']), (LN['L19']['t'], H['c1_zoom'] + .8), (LN['L28']['t'] + .9, H['c2_sniff1'] + .6), (LN['L30']['t'] + .8, H['c2_wrong']),
    (LN['L33']['t'] + .9, H['c2_sniff3'] + .6), (H['c3_down1'] + .8, H['c3_down1'] + 1.8), (H['c3_down2'] + 1.0, H['c3_down2'] + 2.0), (H['c4_zoom'], H['c4_zoom'] + .8),
    (H['c4_code'], H['c4_code'] + 5.2), (H['c5_heat'], H['c5_heat'] + .8), (H['c5_found'] - .1, H['c5_found'] + 1.2), (H['c5_window'] - .1, H['c5_window'] + 1.0),
    (H['e_land'] - .1, H['e_land'] + 1.2)] + [(H[q + 'c'], H[q + 'c'] + 2.9) for q in ('q1', 'q2', 'q3', 'q4')]
G = Groove(M, BEAT, LINES, seed=11, avoid=AVOID)
L_ = lambda i: LN[i]['t']
S = G.sec
# — mở —
S('móc · hộp nhạc rơi', 0, H['pull'], 'float', 'C', 'C', bass='pizzbass', arp='celesta', lead='harp', energy=2, cue=False)
S('BZZT · run lập cập', H['pull'], H['tryOpen'], 'skip', 'C', 'C F', bass='bassn', comp='pluck', lead='xylo', kit='brush', energy=2)
S('trang đóng băng', H['tryOpen'], H['crumbPop'], 'tension', 'Am', 'Am', bass='upright', arp='pizz', kit='jazz', energy=1)
S('Crumb · luật của truyện', H['crumbPop'], H['yawn'], 'bounce', 'C', 'C Am F G', bass='bassn', comp='pluck', lead='marimba', kit='toy', energy=2)
S('ngáp · buồn ngủ', H['yawn'], L_('L09') - .1, 'sway', 'F', 'F C', bass='pizzbass', comp='harp', lead='celesta', kit='brush', energy=1)
S('đánh thức các trang', L_('L09') - .1, H['jingle'], 'march', 'C', 'C G', bass='tuba', comp='pizz', lead='glock', kit='march', energy=3, fills=False)
G.mark('nhạc hiệu', H['jingle'], H['s_c1'], 'jingle', 'C', 'horn marimba bell')
# — chương 1 · vị giác (calypso nhẹ) —
S('trang 1 · hộp nhạc', H['s_c1'], H['s_c1m'], 'waltzfloat', 'C', 'C F', bass='pizzbass', arp='celesta', lead='harp', energy=1, cue=False)
S('ký ức 1 · đoán món', H['s_c1m'], H['c1_fly'], 'calypso', 'G', 'G C', bass='bassn', comp='steel', lead='xylo', kit='latin', energy=2)
S('Flutter chọn món', H['c1_fly'], L_('L17') - .1, 'bounce', 'G', 'G C D G', bass='bassn', comp='steel', lead='xylo', kit='toy', energy=3)
S('lưỡi hay chân?', L_('L17') - .1, L_('L19'), 'sway', 'Em', 'Em C', bass='bassn', comp='pluck', lead='flute', kit='brush', energy=1)
S('đếm ngược', L_('L19'), H['c1_zoom'], 'tension', 'G', 'D', bass='bassn', arp='steel', kit='jazz', energy=1, cue=False)
S('nếm bằng chân!', H['c1_zoom'], H['s_c1s'], 'calypso', 'G', 'G C G D', bass='bassn', comp='steel', lead='flute', kit='latin', energy=3)
S('trang 1 tan · valse hộp nhạc', H['s_c1s'], H['s_c2'], 'waltz', 'C', 'C F G C', bass='pizzbass', comp='harp', lead='celesta', kit='toy', energy=2)
# — chương 2 · khứu giác (valse "Tap-Tap") —
S('trang 2 · hộp nhạc', H['s_c2'], H['s_c2m'], 'waltzfloat', 'F', 'F Bb', bass='pizzbass', arp='celesta', lead='harp', energy=1)
S('mê cung · valse', H['s_c2m'], H['c2_walk2'], 'waltz', 'A', 'A E7', bass='pizzbass', comp='harp', lead='celesta', kit='toy', energy=2)
S('lên hay xuống?', H['c2_walk2'], H['c2_wrong'], 'tiptoe', 'A', 'A D', bass='pizzbass', comp='pizz', lead='reed', kit='wood', energy=1)
S('lao nhầm · ngõ cụt', H['c2_wrong'], H['c2_sniff2'], 'break', 'A', 'A', cue=False)
S('ngửi lại · valse', H['c2_sniff2'], H['c2_meet'], 'waltz', 'D', 'D A7', bass='pizzbass', comp='pluck', lead='xylo', kit='brush', energy=2, g=1.4)
S('Tap, tap, hello! · polka', H['c2_meet'], H['s_c2s'], 'polka', 'A', 'A E7', bass='pizzbass', comp='pizz', lead='xylo', kit='toy', energy=3)
S('trang 2 tan', H['s_c2s'], H['s_c3'], 'skip', 'F', 'F C', bass='bassn', comp='pluck', lead='glock', kit='toy', energy=2)
# — chương 3 · thính giác (Night Band swing) —
S('trang 3 · hộp nhạc', H['s_c3'], H['s_c3m'], 'waltzfloat', 'Dm', 'Dm Bb', bass='pizzbass', arp='celesta', lead='harp', energy=1)
S('ban nhạc đêm', H['s_c3m'], L_('L42') - .1, 'swing', 'Dm', 'Dm Bb', bass='upright', comp='rhodes', lead='vibes', kit='jazz', energy=3)
S('tai Chirp ở đâu?', L_('L42') - .1, H['s_c3h'], 'tiptoe', 'Dm', 'Dm Gm', bass='pizzbass', comp='pizz', lead='vibes', kit='wood', energy=1)
S('còn Hop?', H['s_c3h'], H['c3_fiddle'], 'sway', 'F', 'F Dm', bass='upright', comp='vibes', lead='celesta', kit='brush', energy=1)
S('hoà nhạc chân và bụng', H['c3_fiddle'], H['s_c3s'], 'swing', 'F', 'F Bb C F', bass='upright', comp='rhodes', lead='vibes', kit='jazz', energy=3)
S('trang 3 tan', H['s_c3s'], H['s_c4'], 'bounce', 'F', 'F C', bass='bassn', comp='pluck', lead='marimba', kit='toy', energy=2)
# — chương 4 · thị giác và tín hiệu (diễu hành nhỏ) —
S('trang 4 · hộp nhạc', H['s_c4'], H['s_c4m'], 'waltzfloat', 'G', 'G C', bass='pizzbass', arp='celesta', lead='harp', energy=1)
S('rón rén tới Zip', H['s_c4m'], H['c4_zip'], 'tiptoe', 'G', 'G D', bass='pizzbass', comp='pizz', lead='reed', kit='wood', energy=1)
S('mắt khổng lồ · diễu hành', H['c4_zip'], H['c4_night'], 'march', 'G', 'G D G C', bass='tuba', comp='pizz', lead='glock', kit='march', energy=2)
S('đêm hè · Blink', H['c4_night'], H['c4_code'], 'float', 'Em', 'Em C', bass='pizzbass', arp='celesta', lead='vibes', energy=1, g=1.4)
S('mật mã ánh sáng', H['c4_code'], H['c4_hive'], 'float', 'C', 'C G', bass='pizzbass', arp='vibes', lead='celesta', energy=2)
S('điệu nhảy của Waggle', H['c4_hive'], H['s_c4s'], 'bounce', 'C', 'C F', bass='bassn', comp='marimba', lead='xylo', kit='toy', energy=3)
S('trang 4 tan · chỉ đường', H['s_c4s'], H['s_c5'], 'march', 'C', 'C G', bass='tuba', comp='pizz', lead='glock', kit='march', energy=2)
# — chương 5 · trang trống → vườn tuyết (dây trầm và gió) —
S('trang trống', H['s_c5'], L_('L66') - .1, 'tension', 'Am', 'Am F', bass='upright', arp='celesta', kit='jazz', energy=1, g=1.3)
S('tìm bí mật mới · ủ ấm Albie', L_('L66') - .1, H['c5_exit'], 'sway', 'C', 'C Am F G', bass='pizzbass', comp='pluck', lead='flute', kit='brush', energy=2)
S('lách ra ngoài', H['c5_exit'], H['s_c5o'], 'break', 'Am', 'Am', cue=False)
S('lạnh quá!', H['s_c5o'], H['c5_heat'], 'tension', 'Am', 'Am', bass='upright', arp='pizz', kit='jazz', energy=1, cue=False)
S('quả bóng ong ấm', H['c5_heat'], H['s_c5r'], 'float', 'C', 'C F', bass='upright', arp='harp', lead='celesta', energy=2)
S('bọ rùa dưới lá · Dot đếm', H['s_c5r'], H['s_c5w'], 'tiptoe', 'F', 'F C', bass='pizzbass', comp='pizz', lead='xylo', kit='wood', energy=1)
S('sâu gấu len · mùa xuân', H['s_c5w'], H['s_c5f'], 'waltzfloat', 'C', 'C F C G', bass='pizzbass', arp='celesta', lead='flute', energy=1, g=1.5)
S('kính mờ · lạc đường', H['s_c5f'], L_('L78') + .6, 'tension', 'Am', 'Am Dm', bass='upright', arp='pizz', kit='tom', energy=1)
S('kính nhiệt · về nhà', L_('L78') + .6, H['s_end'], 'march', 'C', 'C G C F', bass='tuba', comp='pizz', lead='glock', kit='march', energy=3)
# — kết, đố vui, tạm biệt, Rollo —
S('sổ ấm lại · valse đầy', H['s_end'], H['s_quiz'], 'waltz', 'C', 'C F G C', bass='pizzbass', comp='harp', lead='celesta', kit='toy', energy=3)
S('đố 1', H['s_quiz'], H['s_q2'], 'skip', 'C', 'C F', bass='bassn', comp='pluck', lead='xylo', kit='toy', energy=2)
S('đố 2', H['s_q2'], H['q3'] - .3, 'bounce', 'F', 'F C', bass='bassn', comp='marimba', lead='glock', kit='pop', energy=2)
S('đố 3', H['q3'] - .3, H['q4'] - .3, 'calypso', 'G', 'G C', bass='bassn', comp='steel', lead='xylo', kit='latin', energy=2)
S('đố 4', H['q4'] - .3, H['s_bye'], 'swing', 'C', 'C F', bass='upright', comp='rhodes', lead='vibes', kit='jazz', energy=2)
S('ngáp · ru ngủ', H['s_bye'], H['e_sneeze'], 'waltzfloat', 'C', 'C F G C', bass='pizzbass', arp='celesta', lead='harp', energy=1)
S('hắt xì', H['e_sneeze'], H['e_fly'], 'break', 'C', 'C', cue=False)
S('sticker bay như tuyết', H['e_fly'], H['e_land'], 'float', 'C', 'C F', bass='pizzbass', arp='celesta', lead='glock', energy=2, cue=False)
S('chữ móc trở lại', H['e_land'], H['s_rollo'], 'break', 'C', 'C', cue=False)
S('Did you spot Rollo?', H['s_rollo'], H['e_end'], 'polka', 'C', 'C G', bass='tuba', comp='pizz', lead='xylo', kit='march', energy=2)
S('hẹn mùa xuân', H['e_end'], DUR, 'waltzfloat', 'C', 'C F C', bass='pizzbass', arp='celesta', lead='harp', energy=1)
G.answer(L_('L14') - .3, H['c1_mmm'] + .5, LN['L31']['t'] + .7, H['c3_chirp'], H['c4_spot'], H['c4_glow'], H['c5_droop'] + .2)
G.play(); os.makedirs(os.path.join(HERE, 'out'), exist_ok=True); G.save(os.path.join(HERE, 'out', 'music.json'))
# nền trầm rất mỏng (nốt gốc + quãng năm, dưới 250 Hz: không chạm dải giọng) cho các điệu thưa, để nhạc không đứt giữa hai nốt ngắn
from groove import chord as _chord
for S_ in G.S:
    if S_['hand'] or S_['style'] == 'break': continue
    r = 36 + (_chord(S_['key'].rstrip('m') or S_['key'])[0] - 36) % 12
    add(mus, pad([r, r + 7], S_['t1'] - S_['t0'] + .4), S_['t0'], .55, 0)

# — điểm nhấn viết tay —
J = jingle(); s = int(H['jingle'] * SR); mus[s:s + len(J)] += J * .9                                     # nhạc hiệu 2 s, giống hệt mọi tập
for i in range(6): M(T._ting(mf(96 + i * 2), .5), .9 + i * .18, .07, .3)                                 # sáu cánh bông tuyết sáng lần lượt
for u, root in zip(UNL, (72, 77, 74, 79, 72)):                                                          # trang tan: mô-típ bí mật đô–mi–sol trên hộp nhạc
    secret(M, celesta, root, L_(u) - .05, .15, .5, .3, last=12); M(bell(root + 24, .4, 1.2), L_(u) + .5, .3, .3)
tz = H['c1_zoom']; strum(steel, (67, 71, 74, 79), tz + .2, .3, .45); M(bell(91, .5, 1.0), tz + .25, .25, .3); cymbal(tz + .2, .1)   # đáp án "Its feet!"
seq(tuba, (45, 40), H['c2_bonk'] + .5, .25, .6, 0, d=.3); M(tuba(40, .5, .6, bend=-4), LN['L31']['t'] + .1, .5)                     # đụng ngõ cụt: "bwomp"
for h in (H['c3_down1'] + 1.0, H['c3_down2'] + 1.2): seq(vibes, (77, 81, 84), h, .12, .35, .3, d=.8)                                # tai sáng lên
seq(glock, (79, 83, 86, 91), H['c4_zoom'] + .1, .08, .4, .3)                                                                       # mắt khổng lồ
for d in (0, .3, .9): M(T._ting(mf(91), .4), H['c4_code'] + d, .25, .2)                                                            # mật mã ánh sáng
for d in (2.1, 4.6): M(T._ting(mf(86), .4), H['c4_code'] + d, .2, .6)
strum(harp, (60, 64, 67, 72, 76), H['c5_heat'] + .1, .4, .9); M(pad([60, 64, 67, 72], 2.0), H['c5_heat'], .3)                      # kính nhiệt: quả bóng ấm
secret(M, celesta, 72, H['c5_found'], .16, .5, .3, last=12)                                                                       # ba bí mật mùa đông
M(tuba(45, .9, .6, bend=-2), H['c5_fog'] + .1, .4)
strum(harp, (60, 64, 67, 72, 79), H['c5_window'], .45, 1.0); cymbal(H['c5_window'], .18)                                          # khung cửa ấm!
ty = H['e_land']; strum(pluck, (60, 64, 67, 72), ty, .55, 1.2, .02); M(kick(), ty, .8); M(bell(84, .8, 1.4), ty + .2, .5); cymbal(ty, .22)   # chữ móc trở lại: "ta-da"
secret(M, lambda n: horn(n, .8, .7), 72, ty + .3, .12, .45, .1, last=12)
for i, n in enumerate((76, 79, 84, 88)): M(celesta(n, 1.2), H['e_end'] + .3 + i * .25, .3, .3)                                     # kết: chủ đề hộp nhạc vang đủ
M(pad([60, 64, 67, 72], 3.0), DUR - 3.2, .4)
# nhịp chờ trẻ trả lời: mõ gỗ "tích–tắc" rất nhỏ, nghe là biết đang chờ (giai điệu của lớp nhịp đã nhường chỗ)
WAIT = [(H['c1_lab'] + 1.4, H['c1_fly']), (LN['L28']['t'] + .9, H['c2_sniff1']), (LN['L30']['t'] + .8, H['c2_wrong']), (LN['L33']['t'] + .9, H['c2_sniff3'])] + [(H[q + 'c'], H[q + 'c'] + 2.4) for q in ('q1', 'q2', 'q3', 'q4')]
for a, b in WAIT:
    for i in range(int((b - a) / .25)): add(mus, T.block((84, 79)[i % 2], .5), a + i * .25, .16, (.3, -.3)[i % 2])
# chỗ khựng vẫn còn một lớp mỏng (QUALITY.md §4): ngõ cụt, lúc lách ra ngoài, trước "CHOO!"
for a, b, ch in ((H['c2_wrong'], H['c2_sniff2'], [57, 60, 64]), (H['c5_exit'], H['s_c5o'] + .3, [57, 60, 64]), (H['e_sneeze'], H['e_fly'], [60, 64, 67])):
    add(mus, pad(ch, b - a + .3), a, .5, 0)
    for i in range(int((b - a) / .16)): add(mus, celesta(ch[i % 3] + 24, .2), a + i * .16, .08, .3)

# — cường độ theo cảnh (chuyển mềm 0,3 s): dâng ở chỗ khám phá, bất ngờ; hạ dưới lời dài và các nhịp chờ trẻ trả lời —
LEVEL = [(0, .7), (LN['L01']['t'] + LN['L01']['dur'], .9), (H['tryOpen'], .8), (H['crumbPop'], .9), (H['yawn'], .75), (L_('L09'), .95), (H['jingle'], .45), (H['s_c1'], .8)]   # dưới câu móc và câu tựa: nhạc nhỏ lại để lời rõ
for u in UNL: LEVEL += [(L_(u) - .1, 1.0), (L_(u) + 2.0, .85)]
LEVEL += [(H['c1_zoom'], .8), (L_('L20') + 1.0, 1.0), (L_('L20') + 2.0, .85), (H['c2_meet'], .95), (H['c3_fiddle'], 1.0), (H['c3_fiddle'] + 2.3, .85), (H['c4_hive'], .95), (H['s_c5'], .75),
          (H['c5_heat'], .95), (H['c5_heat'] + 2, .8), (H['c5_found'], 1.0), (H['c5_found'] + 1.2, .8), (H['c5_window'], 1.0), (H['s_quiz'], .85), (H['s_bye'], .75), (H['e_land'], 1.0), (H['e_land'] + 1.6, .85), (H['e_end'], .9)]
LEVEL.sort()
tt = np.arange(len(mus)) / SR; lev = np.full(len(mus), LEVEL[0][1])
for (t, g), (_, g0) in zip(LEVEL[1:], LEVEL[:-1]): lev = np.where(tt >= t - .15, np.where(tt < t + .15, g0 + (g - g0) * (tt - t + .15) / .3, g), lev)
mus *= lev[:, None]


# ---------- tiếng động theo sự kiện ----------
fx = B['fx']
def steps_(d, n, v=1., lo=2500, hi=7000):
    x = np.zeros(int(d * SR) + 1)
    for k in range(n):
        s0 = int(k * d / n * SR); b = bp(noise(.03), lo, hi) * env_exp(.03, .004) * (.5 + .3 * (k % 2)); x[s0:s0 + len(b)] += b[:len(x) - s0]
    return x * .9 * v
def crunch_(d, n, v=1.):                                   # bước chân lún tuyết: "rộp" trầm, xốp
    x = np.zeros(int(d * SR) + 1)
    for k in range(n):
        s0 = int(k * d / n * SR); b = bp(noise(.12), 300, 2400) * env_exp(.12, .03) * (.7 + .3 * (k % 2)); x[s0:s0 + len(b)] += b[:len(x) - s0]
    return x * .5 * v
def sniff_(v=1.): tt = t_(.22); return bp(noise(.22), 900, 4000) * np.sin(np.pi * tt / .22) ** 2 * (1 + tt / .22) * v * .3
def wind_(d, v=1.):                                        # gió tuyết: tiếng rít trầm dâng hạ
    tt = t_(d); return T._sweep(noise(d), 350, 900, .4, lambda u: .5 + .5 * np.sin(u * 6)) * np.sin(np.pi * tt / d) ** .7 * v * .5
def chatter_(d, v=1.):                                     # răng lập cập
    x = np.zeros(int(d * SR) + 1)
    for k in range(int(d / .045)): s0 = int(k * .045 * SR); b = T.block(91 + (k % 2) * 2, .35); x[s0:s0 + len(b)] += b[:len(x) - s0]
    return x * v * .5
def icecrack_(v=1.):                                       # băng nứt: chuỗi tách giòn + lấp lánh
    x = np.zeros(int(.45 * SR)); r = np.random.default_rng(3)
    for k in range(9): s0 = int(r.uniform(0, .3) * SR); b = fade(lp(hp(noise(.02), 2500), 9000) * env_exp(.02, .003), .001, .005) * r.uniform(.4, 1); x[s0:s0 + len(b)] += b   # sườn trước 1 ms: bộ mã AAC không vọt đỉnh
    return mixl(x * .6, np.pad(T.tink(.25, 4600), (int(.05 * SR), 0))) * v
def melt_(d, v=1.):                                        # băng tan: giọt nước rơi
    x = np.zeros(int(d * SR) + 1)
    for k in range(int(d / .16)): s0 = int((k * .16 + .03 * (k % 3)) * SR); b = T.plip(900 + 200 * (k % 4), .5); x[s0:s0 + len(b)] += b[:len(x) - s0]
    return x * v * .6
def huff_(d, v=1.): tt = t_(d); return bp(noise(d), 400, 2200) * np.sin(np.pi * tt / d) ** 1.3 * v * .35   # hà hơi "haaa"
def flutterpaper_(d): return mixl(*(np.pad(T.paper(.25, .3, 4, i), (int(i * d / 8 * SR), 0)) for i in range(8)))
def flash_(d, v=1.): return mixl(T._ting(mf(98), d + .2, .3), T.swell(d, .2, 90, 100)) * v
def sneeze_(): return mixl(bp(noise(.35), 800, 5000) * env_exp(.35, .06) * .8, T.boing(220, .4, .3, 2.0, 18.))
SFX = {
    'titlepop': lambda e: mixl(T.bubble(1600, .5, .06, 2.4), np.pad(T._ting(mf(103), .5, .35), (int(.02 * SR), 0))),
    'wordpop': lambda e: mixl(T.boing(220 + 120 * e.get('n', 0), .35, .3, 2.4, 16.), np.pad(pop(.6) * .45, (int(.02 * SR), 0)), T.bubble(1300 + 500 * e.get('n', 0), .35, .05, 2.4)),
    'flakefall': lambda e: mixl(T.whistle(5200, 4200, e.get('d', .5), .03), T.sparkle(e.get('d', .5), .15, 98, 108, 5, 1, 'down')),   # trên dải giọng: câu móc nói cùng lúc
    'flakeland': lambda e: mixl(T._ting(mf(100), .8, .45), np.pad(T.sparkle(.6, .3, 95, 108, 6, 2, 'up'), (int(.05 * SR), 0))),
    'popup': lambda e: mixl(T.boing(260, .4, .3 * e.get('v', 1.), 2.2, 14.), T.swipe(.2, .2 * e.get('v', 1.), True, 1500, 5500)),
    'tink': lambda e: T._ting(mf(e.get('m', 96)), .4, .12),
    'pullback': lambda e: mixl(whoosh(.9, .5) * .8, lp(noise(.9), 300) * np.sin(np.pi * t_(.9) / .9) * .15),
    'chatter': lambda e: chatter_(e.get('d', .4), e.get('v', 1.)),
    'bzzt': lambda e: fade(lp(np.sign(np.sin(2 * np.pi * 120 * t_(.18))), 1800) * .18, .005, .03),
    'pops': lambda e: T.pops(e.get('n', 6), e.get('step', .035), e.get('m', 84), e.get('v', .45)),
    'strain': lambda e: T.windup(.5, .4),
    'icecrack': lambda e: icecrack_(e.get('v', 1.)),
    'tabding': lambda e: T.ding((88, 91, 93, 96)[e.get('n', 0) % 4], .35, .8),
    'melt': lambda e: melt_(e.get('d', 1.), e.get('v', 1.)),
    'yawn': lambda e: T.whistle(900, 500, .7, .12 * e.get('v', 1.), .02, 5.),
    'boing': lambda e: T.boing(240, .45, .3 * e.get('v', .5) / .5, 2.2, 14.),
    'swirl': lambda e: mixl(T.swirl(e.get('d', .4), .4, 6, 900, 3600), T.swell(e.get('d', .4), .4, 77, 101)),
    'swish': lambda e: T.swish(e.get('d', .45), e.get('v', .4), e.get('lo', 350), e.get('hi', 2600), e.get('up', True)),
    'page': lambda e: mixl(T.paper(.35, .45, 5, 1), T.bubble(520, .3, .09)),
    'pageflip': lambda e: mixl(T.paper(.5, .5, 7, 3), T.swish(.5, .22, 700, 3200, True)),
    'dive': lambda e: mixl(T.swish(.9, .45, 500, 5200, True, .7, .25), T.sparkle(.8, .3, 91, 108, 8, 4, 'up')),
    'outof': lambda e: mixl(T.swish(.7, .35, 500, 3800, False, .25, .2), T.sparkle(.6, .2, 84, 96, 6, 5, 'down')),
    'stamp': lambda e: mixl(thump(.8, 110) * .6, hp(noise(.07), 1200) * env_exp(.07, .012) * .5) * e.get('v', 1.),
    'unlock': lambda e: mixl(T.ding(91, .4, 1.0), np.pad(T.ding(96, .35, 1.0), (int(.12 * SR), 0)), np.pad(T.sparkle(.6, .3, 96, 108, 7, 6, 'up'), (int(.2 * SR), 0))),
    'huff': lambda e: huff_(e.get('d', 1.), e.get('v', 1.)),
    'roll': lambda e: mixl(lp(brown(e.get('d', 1.5)), 260) * .25, *(np.pad(click(.5, .3) * .25, (int(k * .22 * SR), 0)) for k in range(int(e.get('d', 1.5) / .22)))) * e.get('v', 1.),
    'wings': lambda e: mixl(*(np.pad(bp(noise(.08), 300, 1400) * np.sin(np.pi * t_(.08) / .08) * .2, (int(k * .1 * SR), 0)) for k in range(int(e.get('d', 1.) / .1)))),
    'land': lambda e: mixl(step(.4) * .5, T.bubble(700, .2, .06)),
    'sour': lambda e: T.wobble(160, .5, .25, 9, .2),
    'meh': lambda e: T.whistle(700, 520, .35, .1),
    'mmm': lambda e: mmm(.9),
    'bubblepop': lambda e: mixl(T.bubble(800, .35, .08, 2.0), pop(.5) * .3),
    'tick': lambda e: mixl(T.block(e.get('m', 84), .5), T._ting(mf(e.get('m', 84) + 12), .3, .15)),
    'zoom': lambda e: mixl(riser(.6, 1.), T.whistle(420, 1250, .55, .15)),
    'wrong': lambda e: T.whistle(500, 380, .25, .12),
    'reveal': lambda e: mixl(T.ding(93, .4, 1.0), T.sparkle(.6, .35, 93, 108, 7, 8, 'up')),
    'slurp': lambda e: mixl(T.whistle(600, 1200, .4, .1), bp(noise(.4), 500, 2500) * np.sin(np.pi * t_(.4) / .4) * .15),
    'shimmer': lambda e: T.sparkle(e.get('d', 1.), .25, 93, 108, int(6 * e.get('d', 1.)) + 2, 9, 'up'),
    'steps': lambda e: steps_(e.get('d', 1.), e.get('n', 8), e.get('v', 1.)),
    'crunch': lambda e: crunch_(e.get('d', 1.), e.get('n', 6), e.get('v', 1.)),
    'sniff': lambda e: sniff_(e.get('v', 1.)),
    'whistle': lambda e: T.whistle(1800, 700, e.get('d', .8), .12 * e.get('v', 1.)),
    'bonk': lambda e: mixl(T.block(72, .5), np.pad(T.wobble(115, .5, .3, 9, .22), (int(.02 * SR), 0))),
    'buzzer': lambda e: fade(lp(np.sign(np.sin(2 * np.pi * 140 * t_(.3))), 1600) * .22 * e.get('v', 1.), .005, .04),
    'blip': lambda e: T.blip(e.get('m', 88), .3),
    'tap': lambda e: mixl(click(.6, .4) * .5, T._ting(mf(e.get('m', 91)), .4, .35)),
    'chirp': lambda e: chirp(1.1),
    'fiddle': lambda e: bp(noise(.3), 2500, 7000) * (.5 + .5 * np.sin(2 * np.pi * 30 * t_(.3))) * np.sin(np.pi * t_(.3) / .3) * .25,
    'slide': lambda e: T.gliss(91, 72, e.get('d', 1.), .25, 'harp'),
    'tiptoe': lambda e: mixl(*(np.pad(T.block(84 + (k % 2) * 3, .25), (int(k * .32 * SR), 0)) for k in range(int(e.get('d', 2.) / .32)))),
    'zip': lambda e: T.zip_(.25, 700, 3200, .4),
    'flop': lambda e: mixl(thump(.7, 90) * .5, T.wobble(140, .4, .2, 8, .2)),
    'night': lambda e: T.swell(e.get('d', 1.), .3, 96, 72),
    'glowup': lambda e: T.swell(.5, .35, 84, 100),
    'flash': lambda e: flash_(e.get('d', .2), e.get('v', 1.)),
    'buzzin': lambda e: T.buzzup(e.get('d', 1.), .3),
    'waggle': lambda e: T.buzzup(e.get('d', 3.), .18, 200, 240),
    'swipe': lambda e: T.swipe(e.get('d', .3), .3, True, e.get('lo', 1500), e.get('hi', 5500)),
    'droop': lambda e: T.whistle(800, 420, .7, .12),
    'hug': lambda e: mixl(T.bubble(500, .35, .12, 1.4), np.pad(T.sparkle(.5, .2, 88, 100, 5, 7, 'up'), (int(.1 * SR), 0))),
    'squeeze': lambda e: mixl(T.whistle(700, 1600, .4, .1), np.pad(pop(.6) * .4, (int(.35 * SR), 0))),
    'wind': lambda e: wind_(e.get('d', 2.), e.get('v', 1.)),
    'heaton': lambda e: mixl(T.swell(.5, .45, 72, 96), T.windup(.4, .3, 7, 79)),
    'leaves': lambda e: T.paper(.5, .4 * e.get('v', 1.), 6, 11),
    'sparkle': lambda e: T.sparkle(.7, .3 * e.get('v', 1.), 91, 108, 7, 12, 'up'),
    'fogup': lambda e: mixl(T.swish(e.get('d', 1.), .3, 300, 1500, True, .6, .6), T.swell(e.get('d', 1.), .2, 84, 72)),
    'sneeze': lambda e: sneeze_(),
    'flutterpaper': lambda e: flutterpaper_(e.get('d', 2.)),
    'recall': lambda e: mixl(SFX['titlepop'](e), SFX['wordpop']({'n': 0}), np.pad(SFX['wordpop']({'n': 1}), (int(.12 * SR), 0))),
    'ding': lambda e: T.ding(e.get('m', 88), .4, .8),
    'swell': lambda e: T.swell(.8, .3, 76, 96),
}
missing = sorted({e['type'] for e in EV} - SFX.keys())
if missing: sys.exit(f'mix.py: no sound for event types {missing}')
VERB = {'flakeland': .5, 'unlock': .5, 'reveal': .4, 'dive': .3, 'tabding': .4, 'ding': .4, 'flash': .5, 'titlepop': .3, 'recall': .3, 'swirl': .3, 'tick': .2}
snd = np.zeros(len(fx))
for e in EV:
    x = SFX[e['type']](e); add(fx, x, e['t'], 1., e.get('pan', 0))
    if e['type'] in VERB: s0 = int(e['t'] * SR); k = min(len(x), len(snd) - s0); snd[s0:s0 + k] += x[:k] * VERB[e['type']]
fx += T.verb(snd, 1.2) * .35


# ---------- nền theo bối cảnh: phòng ấm có gió xa ngoài cửa sổ · nắng hè (chim) · đêm (dế) · tổ ong · vườn tuyết (gió) ----------
amb = B['amb']; rng = np.random.default_rng(7)
def zone(a, b, x, g):
    x = x[:int((b - a) * SR)]; d = len(x) / SR; tt = np.arange(len(x)) / SR; e = np.clip(np.minimum(tt / .4, (d - tt) / .4), 0, 1)
    add(amb, x * e * g, a, 1., 0)
room = lambda d: lp(brown(d), 220) * .5 + T._sweep(noise(d), 300, 600, .3, lambda u: .5 + .5 * np.sin(u * 9)) * .05
def birds(a, b):
    for t0 in np.arange(a + .7, b - .5, 1.9):
        if speaking(t0, .2): continue
        for k in range(2): f0 = rng.uniform(2600, 3300); add(amb, glide(f0, f0 * 1.2, .08, .05, 0.), t0 + k * .12, 1., rng.uniform(-.7, .7))
def crickets(a, b):
    for t0 in np.arange(a, b, .5):
        x = np.zeros(int(.12 * SR)); bb = np.sin(2 * np.pi * rng.uniform(4300, 4900) * t_(.022)) * np.sin(np.pi * t_(.022) / .022) ** 2
        for j in range(3): s0 = int(j * .035 * SR); x[s0:s0 + len(bb)] += bb
        add(amb, lp(x, 6500) * .012, t0 + rng.uniform(0, .25), 1., rng.uniform(-.8, .8))
INDOOR = [(0, H['s_c1m']), (H['s_c1s'], H['s_c2m']), (H['s_c2s'], H['s_c3m']), (H['s_c3s'], H['s_c4m']), (H['s_c4s'], H['s_c5o']), (H['s_end'], DUR)]
for a, b in INDOOR: zone(a, b, room(b - a), .08)
for a, b in ((H['s_c1m'], H['s_c1s']), (H['s_c2m'], H['s_c2s']), (H['s_c4m'], H['c4_night'])): zone(a, b, lp(brown(b - a), 300) * .3, .05); birds(a, b)
crickets(H['s_c3m'], H['s_c3s']); crickets(H['c4_night'], H['c4_hive'])
zone(H['c4_hive'], H['s_c4s'], T.buzzup(H['s_c4s'] - H['c4_hive'], 1., 180, 200), .05)
zone(H['s_c5o'], H['s_end'], wind_(H['s_end'] - H['s_c5o'], 1.), .35)


# ---------- giọng ----------
vox = np.zeros(N)
for L in LINES:
    y, sr = sf.read(os.path.join(HERE, 'voice', L['id'] + '.wav'))
    if y.ndim > 1: y = y.mean(1)
    y = soxr.resample(y, sr, SR); s0 = int(L['t'] * SR); e = min(N, s0 + len(y)); vox[s0:e] += y[:e - s0]
vox = compress(norm(vox, .9), thr=.22, ratio=3.5); vox = norm(vox, .85)


# ---------- trộn ----------
mus, fx, amb = B['mus'][:N], B['fx'][:N], B['amb'][:N]
def rms(x): x = x[np.abs(x).max(1) > 1e-4] if x.ndim > 1 else x[np.abs(x) > 1e-4]; return float(np.sqrt(np.mean(x ** 2))) if len(x) else 0.
# nâng nhẹ các đoạn nhạc quá nhỏ (đoạn rải, đoạn lắng dưới lời): nửa đường tới mức chung, tối đa +12 dB (QUALITY.md §4: không có lỗ im)
from scipy.ndimage import uniform_filter1d as _uf
_e = np.sqrt(_uf((mus ** 2).mean(1), int(.6 * SR)) + 1e-14); _ref = np.percentile(_e[_e > 1e-5], 70)
mus = mus * _uf(np.clip((_ref / np.maximum(_e, 1e-7)) ** .5, 1, 4), int(.3 * SR))[:, None]
mus = mus * (.075 / max(rms(mus), 1e-9))
fx = fx * (.55 / max(np.abs(fx).max(), 1e-9))
from scipy.ndimage import maximum_filter1d, uniform_filter1d
ve = uniform_filter1d(maximum_filter1d(np.abs(vox), int(.05 * SR)), int(.25 * SR))
mus = T.duck(mus, ve, .82, .55); fx = T.duck(fx, ve, .6, .3); amb = T.duck(amb, ve, .7, .5)
V = np.stack([vox, vox], 1)
mix = mus + fx + amb + V
mix = np.tanh(mix * 1.1) / 1.1
mix, I_mix, ceil_db = T.master(mix, 11.0); print(f'master: {I_mix:.1f} LUFS, true-peak ceiling {ceil_db:.1f} dBFS')
nf = int(.02 * SR); mix[:nf] *= np.linspace(0, 1, nf)[:, None]
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR, subtype='PCM_24')
for k, x in (('mus', mus), ('fx', fx), ('vox', V)): sf.write(os.path.join(HERE, 'out', f'stem_{k}.wav'), x.astype(np.float32), SR, subtype='PCM_16')
print('out/mix.wav', f'{len(mix) / SR:.2f} s')
