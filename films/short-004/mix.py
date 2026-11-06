"""Âm thanh của SHORT-004 → out/mix.wav (48 kHz stereo): nhạc theo từng cảnh ("Ant Parade": ban kèn diễu hành đồ chơi, MUSIC.md)
trên lưới 120 BPM, nhạc hiệu chung, tiếng động theo events.json, nền vườn, giọng.
python mix.py   (cần timeline.json + voice/*.wav từ tools/lines.mjs, core/tts/tts.py và _shared/voicefx.py, events.json từ core/render/events.mjs)
Nhạc cụ và nhạc hiệu: _shared/audio/band.py; tiếng động hoạt hình: _shared/audio/toon.py. Không dùng mẫu âm thanh của bên thứ ba.
Phim phát vòng lặp: kính ở cảnh kết nở ra khung đầu; đuôi tiếng vượt quá 52 s được gấp về đầu phim; mép đầu file có fade-in 20 ms."""
import os, sys, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio')); sys.path.insert(0, os.path.join(LIB, '_shared', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, whoosh, thump, ding, pop, click, step, compress, limit, add
from band import fade, mf, pluck, marimba, bassn, kick, clap, hat, bell, horn, pad, riser, glide, jingle
from band import pizz, xylo, tuba, tom, celesta, reed, snare, banjo, triad, secret, MIN   # màu "Ant Parade" (MUSIC.md)
import toon as T

TL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))
EV = json.load(open(os.path.join(HERE, 'events.json'), encoding='utf-8'))['ev']
HIT = TL['hit']
BEAT = 60 / TL['bpm']; BAR = BEAT * 4; DUR = TL['dur']; N = int((DUR + .05) * SR); N0 = int(DUR * SR)
NW = N + int(2.5 * SR)
at = lambda bar, beat=0: (bar * 4 + beat) * BEAT
rng = np.random.default_rng(23)
B = {k: np.zeros((NW if k in ('mus', 'fx') else N, 2)) for k in ('mus', 'fx', 'amb', 'vox')}
def mixl(*xs):
    n = max(len(x) for x in xs); return sum(np.pad(x, (0, n - len(x))) for x in xs)
glock = lambda m, d=.6: T._ting(mf(m), d, 1.) * .5


# ---------- nhạc: "Ant Parade" — ban kèn diễu hành đồ chơi; khác SHORT-001 (tổ khúc), 002 (calypso), 003 (swing) ----------
mus = B['mus']
REST = ((HIT['rest'][0], HIT['rest'][1] - .02), (HIT['freeze'][0] + .05, HIT['freeze'][1] - .05), (HIT['splat'] + .1, HIT['laugh'] - .02))   # khoảng lặng trước đáp án; khựng khi Rollo lăn qua; khựng khi kem đổ
def M(x, t, g=1., pan=0.):
    if any(a - .02 <= t < b - .02 for a, b in REST): return
    add(mus, x, t, g, pan)
def seq(inst, ns, t0, step, g=1., pan=0., d=None, ramp=0.):
    for i, n in enumerate(ns):
        if n: M(inst(n, d) if d else inst(n), t0 + i * step, g * (1 + ramp * i), pan)
def strum(inst, ns, t, g=.4, d=None, spread=.012):
    for k, n in enumerate(ns): M(inst(n, d) if d else inst(n), t + k * spread, g, -.3 + .6 * k / max(1, len(ns) - 1))
def cymbal(t, g=.25, br=4500): M(T.cymbal(1.6, 1., br), t, g, .15)
def march(t0, t1, roots, chords, g=1., drum=True, tub=True, comp=True, mel=None, inst=pizz):
    """Nhịp diễu hành 2/4: tuba "oom" phách 1 và 3 (gốc – năm), hợp âm "pah" phách 2 và 4, snare: móc đơn + nhấn phách 2, 4.
    roots/chords: một gốc và một hợp âm mỗi nửa ô nhịp (lặp vòng). mel: [(beat_offset, midi)] glockenspiel theo từng ô."""
    b0, b1 = int(round(t0 / BEAT)), int(round(t1 / BEAT))
    for i, b in enumerate(range(b0, b1)):
        tb = b * BEAT; h = (b // 2) % len(roots); r = roots[h]
        if tub and b % 2 == 0: M(tuba(r if (b // 2) % 2 == 0 else r + 7, .32), tb, .85 * g)
        if comp and b % 2 == 1: strum(inst, chords[h], tb, .3 * g, .25)
        if drum:
            M(snare(.6 if b % 2 else .35), tb, .55 * g, -.15); M(snare(.25), tb + BEAT / 2, .4 * g, -.15)
            if b % 2 == 0: M(kick(.6), tb, .5 * g)
    if mel:
        for off, n in mel:
            if t0 <= t0 + off < t1: M(glock(n, .5), t0 + off, .32 * g, .25)
F_, BB, C_, DM, AM, G_ = triad(65), triad(58, inv=1), triad(60), triad(62, MIN), triad(57, MIN), triad(55, inv=1)

# — Hook 0–3,5 s: nhịp diễu hành chạy từ giây 0; vụn bánh nhón chân; ngón tay "ngửi"; Crumb bật lên = cú đánh của cả ban —
M(kick(.8), 0., .6); M(T._ting(mf(96), .5), 0., .16, .4)
for i in range(4): M(pizz((53, 57, 60, 57)[i], .2), i * BEAT / 2, .55, -.1)                # bước nhón chân của vụn bánh
march(0., HIT['pop'], [41], [F_], g=.6, comp=False)
for t in HIT['sniff']: M(reed(60, .25), t, .3, .3); M(reed(64, .2), t + .12, .25, .3)         # "khịt khịt" (kèn dăm nhỏ)
tp = HIT['pop']; M(kick(), tp, 1.0); M(tuba(41, .5), tp, .9); strum(xylo, [65, 69, 72, 77], tp, .45); cymbal(tp, .25, 5000)
for n in (72, 76, 79): M(horn(n, .3, .7), tp, .3)
march(2.0, at(1, 3), [41, 36], [F_, C_], g=.75, mel=[(0, 77), (.5, 81), (1, 84), (1.25, 81)])
seq(glock, (72, 74, 77, 79), at(1, 3), BEAT / 4, .4, .2, ramp=.08)                          # kính nở: chạy lên vào nhạc hiệu
J = jingle(); s = int(at(2) * SR); e = min(N, s + len(J)); mus[s:e] += J[:e - s] * .9          # nhạc hiệu 2 s, giống hệt mọi tập

# — Bí mật 1 (6–16 s), Fa: diễu hành nhẹ, glockenspiel; mô-típ bí mật khi hạt mùi bay vào râu; "tap, tap" —
cymbal(at(3), .2, 5000)
march(at(3), HIT['zoom'] - .2, [41, 46, 36, 41], [F_, BB, C_, F_], g=.65, comp=True, mel=[(1.5, 72), (3.5, 74), (5.5, 77)])
M(riser(.5, .7), HIT['zoom'] - .45, .3)
secret(M, glock, 77, HIT['scent'], .18, .4, .3)                                             # mô-típ bí mật: Fa–La–Đô
M(pad([65, 69, 72, 76], 2.3), HIT['scent'], .35)
march(HIT['lensOut'], at(7, 3), [41, 36], [F_, C_], g=.55, drum=False)
for i, t in enumerate(HIT['taps']): M(glock((84, 88)[i], .7), t, .4, .3); M(xylo((72, 76)[i]), t, .3, -.2)   # tap, tap
strum(xylo, [69, 72, 77], 14.75, .3)

# — Bí mật 2 (16–28 s), Rê thứ: thám tử rón rén → "Nope!" → lặng → đường mùi sáng lên → đi theo đường mùi (nhịp dồn) —
cymbal(at(8), .15, 3500)
for i in range(int((HIT['nope'] - at(8)) / (BEAT / 2))):                                    # pizzicato rón rén + snare chổi
    t = at(8) + i * BEAT / 2; M(pizz((50, 57, 53, 57, 50, 57, 55, 57)[i % 8], .18), t, .42, -.1)
    if i % 2: M(snare(.25), t, .3, -.15)
M(tuba(45, .5, .7, bend=-4), HIT['nope'] + .45, .6)                                          # "bwomp" sau "Nope!"
tr = HIT['trail']; secret(M, glock, 77, tr, .15, .42, .3); M(pad([62, 65, 69, 74], 2.0), tr, .38); M(bell(89, .4, 1.2), tr + 1.5, .3)   # đáp án: mô-típ bí mật, pad Rê thứ sáng
march(HIT['slide'][0], HIT['slide'][1], [38, 46, 36, 41], [DM, BB, C_, F_], g=.9, mel=[(0, 74), (.5, 77), (1, 81), (2, 79), (3, 77), (4, 74), (4.5, 77), (5, 81), (6, 84)])   # đi theo đường mùi
seq(glock, (74, 77, 81, 86), HIT['slide'][1] - .1, BEAT / 4, .35, .2, ramp=.08)              # đường mùi bò lên thân cây
M(riser(.6, .7), at(13, 3) - .1, .3)

# — Bí mật 3 (28–36 s), Đô trưởng đồng quê: banjo "boom-chick", tuba; giọt ngọt = mô-típ bí mật; TINY COWS! = tuba "moo" —
cymbal(at(14), .18, 5000)
for i, b in enumerate(range(int(at(14) / BEAT), int(at(17, 3) / BEAT))):
    tb = b * BEAT
    if b % 2 == 0: M(tuba((36, 43)[(b // 2) % 2], .3), tb, .7)
    else: strum(banjo, C_ if (b // 4) % 2 == 0 else G_, tb, .32)
    M(banjo((72, 76, 79, 76)[i % 4] + 12, .25), tb + BEAT / 2, .16, .3)
for t in HIT['aphidTap']: M(glock(91, .5), t, .3, .2)
secret(M, xylo, 72, HIT['drop'], .14, .45, .2, last=12)                                     # giọt ngọt: Đô–Mi–Sol–Đô
M(tuba(36, .9, .75, bend=-2), HIT['cows'] + .05, .55)                                        # "moo" tí hon
M(celesta(91, .8), HIT['spindle'][0], .3, .6); M(celesta(86, .8), HIT['spindle'][0] + .18, .25, .6)   # Spindle ló ra
seq(marimba, (72, 74, 76, 79, 84), HIT['snap'] + .04, .07, .5, .2, ramp=.1)                  # v2: "chụp": marimba chạy lên (ban nhạc kênh)
M(T.gliss(79, 100, HIT['zoomIn'][1] - HIT['zoomIn'][0], .28, 'harp'), HIT['zoomIn'][0], .9)
M(T.gliss(96, 79, HIT['zoomOut'][1] - HIT['zoomOut'][0], .2, 'harp'), HIT['zoomOut'][0], .7)

# — Sổ (36–46 s), Fa: ấm, nhẹ; ba sticker; dưới câu của Albie không có bè trầm —
for i, (t, ch) in enumerate(zip(HIT['stamp'], ((65, 69, 72, 77), (67, 70, 74, 79), (60, 64, 67, 72)))):
    strum(pizz, ch, t, .45, .3); M(kick(.6), t, .5); M(glock(ch[-1] + 12, .6), t + .02, .25, .3)
for t, ch in ((at(19, 1), (65, 69, 72)), (at(19, 3), (58, 62, 65))): strum(pluck, ch, t, .38)
ask = [l for l in TL['lines'] if l['id'] == 'L13'][0]['t']; no = [l for l in TL['lines'] if l['id'] == 'L14'][0]['t']
seq(glock, (72, 76, 79, 84), ask + 1.45, .08, .3, .3)                                         # "Can I hold the lens?": dấu hỏi đi lên
for i, n in enumerate((84, 88, 91, 88, 84, 91, 88)): M(glock(n, .4), 40.3 + i * .3, .2, .4)   # v2: lấp lánh thưa ở dải cao (không còn lỗ im sau câu của Albie)
for i in range(6): M(pizz((41, 48)[i % 2], .3), 40.25 + i * BEAT, .45, 0)                       # bass gảy nhẹ (dải trầm)
M(tuba(41, .5, .6, bend=-3), no + .85, .45)                                                  # "Not yet!": Crumb xìu xuống
march(44.0, at(22, 3), [41, 36], [F_, C_], g=.45, drum=False)

# — Kết (46–52 s): nhón chân theo đường mùi → "I can carry it!" → trống dồn khi nhấc → kem đổ: khựng → bật cười: hợp âm Fa → vòng lặp —
for i in range(int((HIT['gagWalk'][1] - HIT['gagWalk'][0]) / (BEAT / 2))): M(pizz((53, 60, 57, 60)[i % 4], .16), HIT['gagWalk'][0] + i * BEAT / 2, .4, -.1)
for i in range(10): M(snare(.3 + .06 * i, .1), HIT['lift'][0] + i * .06, .5, -.1)              # trống dồn khi Crumb gồng nhấc cây kem
for n in (72, 77, 81): M(horn(n, .35, .7), HIT['lift'][1] - .05, .3)                          # kèn đồ chơi "ta-da!" (sắp đổ…)
M(pad([53, 60, 65, 69], 1.0), HIT['laugh'] + .4, .35); M(bassn(41, .6), HIT['laugh'] + .45, .6)   # v2: lớp mỏng dưới câu hỏi kết
tl = HIT['laugh']; strum(pluck, (65, 69, 72, 77), tl, .55, .8, .02); M(tuba(41, .6), tl, .8); M(kick(), tl, .8); cymbal(tl, .2, 5000)   # v2: ngắn lại để câu hỏi kết rõ
march(HIT['loopIris'][0], DUR, [41], [F_], g=.6, comp=False)                                 # vòng lặp: nhịp diễu hành dẫn về khung đầu
M(riser(.7, .7), HIT['loopIris'][0], .3)
M(celesta(84, .5), HIT['wait'], .16, .35); M(celesta(88, .6), HIT['wait'] + .12, .18, .35)   # v3: nhịp chờ trẻ trả lời: hai nốt hộp nhạc hỏi lên "ding-ding?" (dải cao, sau lời)

# — cường độ theo cảnh (chuyển mềm 0,3 s) —
LEVEL = ((0, .62), (at(2), .45), (at(3), .85), (HIT['scent'], .8), (HIT['lensOut'], .85), (at(8), .8), (HIT['slide'][0], 1.), (at(14), .85), (HIT['snap'], 1.0), (at(18), .8), (44., .7),   # v2: dâng ở cú chụp, ở tiếng cười; hạ dưới câu hỏi kết
         (at(23), .85), (HIT['laugh'], 1.0), (HIT['ask'][0] + .3, .72), (HIT['wait'], .85), (HIT['loopIris'][0], .85))   # v3: hạ dưới câu hỏi kết, dâng ở nhịp chờ trẻ trả lời
tt = np.arange(len(mus)) / SR; lev = np.full(len(mus), LEVEL[0][1])
for (t, g), (_, g0) in zip(LEVEL[1:], LEVEL[:-1]): lev = np.where(tt >= t - .15, np.where(tt < t + .15, g0 + (g - g0) * (tt - t + .15) / .3, g), lev)
mus *= lev[:, None]


# ---------- tiếng động theo sự kiện ----------
fx = B['fx']
def steps(d, n, v=1.):                          # bước chân bé xíu: tiếng "tách" nhỏ, cao, xen kẽ
    x = np.zeros(int(d * SR))
    for k in range(n):
        s = int(k * d / n * SR); b = bp(noise(.03), 2500, 7000) * env_exp(.03, .004) * (.5 + .3 * (k % 2)); x[s:s + len(b)] += b[:len(x) - s]
    return x * .35 * v
def sniff(v=1.):                                # "khịt": hơi thở hút vào ngắn, lọc dải
    tt = t_(.22); return bp(noise(.22), 900, 4000) * np.sin(np.pi * tt / .22) ** 2 * (1 + tt / .22) * v * .3
def buzzer(): tt = t_(.32); return fade(lp(np.sign(np.sin(2 * np.pi * 140 * tt)), 1600) * .3, .005, .04)
def roll(d):                                    # viên tròn của Rollo
    x = lp(brown(d), 220) * .5 * np.minimum(1, t_(d) / .4) * np.minimum(1, (d - t_(d)) / .4)
    for k in range(int(d / .42)):
        s = int((k * .42 + .1) * SR); b = click(.55, .5) * .5; x[s:s + len(b)] += b[:len(x) - s]
    return x * .7
def stampN(n):
    return mixl(thump(.8, 95 + 18 * n) * .7, hp(noise(.07), 1200) * env_exp(.07, .012) * .6, T._ting(mf((79, 84, 88)[n]), .35, .35))
SFX = {
    'titlepop': lambda e: mixl(T.bubble(1600, .5, .06, 2.4), np.pad(T._ting(mf(103), .5, .35), (int(.02 * SR), 0))),
    'steps': lambda e: steps(e.get('d', 1.), e.get('n', 8), e.get('v', 1.)),
    'sniff': lambda e: sniff(e.get('v', 1.)),
    'popup': lambda e: mixl(T.boing(200, .5, .4, 2.4, 14.), np.pad(pop(.6) * .5, (int(.03 * SR), 0))),
    'blip': lambda e: T.blip(e.get('m', 88), .3),
    'swipe': lambda e: T.swipe(e.get('d', .3), .32, True, e.get('lo', 1500), e.get('hi', 5500)),
    'swell': lambda e: mixl(T.swell(.5, .55, 76, 100), T.revcymbal(.5, .22)),
    'swish': lambda e: T.swish(e.get('d', .45), e.get('v', .4), e.get('lo', 350), e.get('hi', 2600), e.get('up', True)),
    'swirl': lambda e: mixl(T.swirl(e.get('d', .5), .45, 4, 800, 3200), T.gliss(84, 100, e.get('d', .5) * .8, .3, 'ting')),
    'badge': lambda e: mixl(T.bubble(600 + 120 * e['n'], .45, .08), np.pad(T.ding((84, 88, 91)[e['n'] - 1], .4, .8), (int(.03 * SR), 0))),
    'zoom': lambda e: mixl(riser(.6, 1.), T.whistle(420, 1250, .55, .15)),
    'scent': lambda e: mixl(T.sparkle(e.get('d', 2.) * .5, .35, 88, 103, 8, 3, 'up'), np.pad(T.sparkle(.8, .25, 91, 108, 6, 5), (int(.9 * SR), 0))),
    'swishout': lambda e: T.swish(.5, .45, 400, 2800, False),
    'tap': lambda e: mixl(click(.6, .4) * .5, T._ting(mf(e.get('m', 91)), .4, .35)),
    'whoosh': lambda e: whoosh(e.get('d', .4), e.get('v', .5)),
    'paper': lambda e: T.paper(.3, .4, 4, 2),
    'buzzer': lambda e: buzzer(),
    'reveal': lambda e: mixl(bell(84, .8), bell(91, .5), np.pad(T.sparkle(.7, .35, 91, 108, 7, 2, 'up'), (int(.05 * SR), 0))),
    'glide': lambda e: T.swish(e.get('d', 5.), .18, 300, 1800, True, .5, .5),
    'roll': lambda e: roll(e.get('d', 1.8)),
    'freeze': lambda e: mixl(T.blip(91, .3), np.pad(T.blip(84, .25), (int(.12 * SR), 0))),
    'climb': lambda e: mixl(T.gliss(72, 96, .45, .35, 'harp'), T.swish(.5, .25, 600, 3000, True)),
    'drop': lambda e: mixl(T.plip(900, .45), np.pad(T.sparkle(.5, .3, 91, 103, 4, 8), (int(.04 * SR), 0))),
    'sip': lambda e: mixl(glide(900, 380, .3, .25), bp(noise(.3), 600, 2200) * np.sin(np.pi * t_(.3) / .3) * .12),
    'pops': lambda e: T.pops(e.get('n', 6), e.get('step', .035), e.get('m', 84), e.get('v', .5)),
    'petals': lambda e: mixl(T.gliss(72, 96, .45, .45, 'harp'), T.swirl(.5, .3, 4, 700, 2800)),
    'page': lambda e: mixl(T.paper(.35, .45, 5, 1), T.bubble(520, .3, .09)),
    'stamp': lambda e: stampN(e.get('n', 0)),
    'lensiris': lambda e: mixl(T.swirl(.5, .45, 6, 900, 3600), T.sparkle(.45, .35, 91, 108, 6, 9, 'up')),
    'windup': lambda e: T.windup(e.get('d', .5), .3),
    'wobble': lambda e: T.wobble(110, .6, .3, 7, .2),
    'fall': lambda e: T.whistle(1400, 500, e.get('d', .35), .25),
    'splat': lambda e: T.splat(.6, 3),
    'tink': lambda e: T.tink(.35),
    'wordpop': lambda e: mixl(T.boing(220 + 120 * e.get('n', 0), .35, .3, 2.4, 16.), np.pad(pop(.6) * .45, (int(.02 * SR), 0)), T.bubble(1300 + 500 * e.get('n', 0), .35, .05, 2.4)),
    'snap': lambda e: mixl(click(1., .25) * .8, np.pad(click(.8, .2) * .5, (int(.045 * SR), 0)), np.pad(T.sparkle(.45, .3, 93, 108, 6, 7, 'up'), (int(.06 * SR), 0))),
    'zoomin': lambda e: mixl(T.swish(e.get('d', .3), .42, 600, 5200, True, .15, .25), riser(e.get('d', .3), .4)),
    'zoomout': lambda e: mixl(T.swish(e.get('d', .35), .3, 500, 3800, False, .25, .2), np.pad(T.paper(.3, .35, 5, 4), (int(.1 * SR), 0))),
    'ask': lambda e: mixl(T.bubble(1500, .3, .05, 2.4), np.pad(SFX['titlepop'](e) * .4, (int(.1 * SR), 0))),   # v3: chữ câu hỏi kết bật ra (nhỏ, trước lời)
    'askq': lambda e: mixl(T.tink(.18, 4800), np.pad(T.tink(.16, 5400), (int(.09 * SR), 0))),   # hai dấu "?" nhún: dải cao, nhỏ
    'recall': lambda e: SFX['titlepop'](e) * .6,                 # chữ móc trở lại giữa câu hỏi kết: một tiếng "ting" nhỏ ở dải cao
    'boing': lambda e: T.boing(e.get('f0', 150), .5, .3 * e.get('v', .5) / .5, 2.2, 14.),
    'squeak': lambda e: mixl(glide(1400, 2200, .18, .2, .1), np.pad(glide(2000, 1300, .15, .15, .1), (int(.2 * SR), 0))),
    'ringiris': lambda e: mixl(T.swirl(.7, .4, 6, 700, 3000), T.revcymbal(.7, .3)),
}
missing = sorted({e['type'] for e in EV} - SFX.keys())
if missing: sys.exit(f'mix.py: no sound for event types {missing}')
VERB = {'scent': .5, 'reveal': .45, 'badge': .35, 'swell': .4, 'swirl': .5, 'petals': .5, 'lensiris': .5, 'tink': .5, 'swipe': .25, 'page': .3, 'zoom': .3, 'stamp': .15, 'drop': .4, 'titlepop': .3, 'climb': .4, 'ringiris': .3}
snd = np.zeros(NW)
for e in EV:
    if e['type'] == 'roll':                     # Rollo lăn từ phải sang trái: chia khúc để đổi pan
        x = SFX['roll'](e); n = len(x); k = 8
        for i in range(k): add(fx, x[i * n // k:(i + 1) * n // k], e['t'] + i * n / k / SR, .9, .6 - .9 * i / (k - 1))
        continue
    x = SFX[e['type']](e); add(fx, x, e['t'], 1., e.get('pan', 0))
    if e['type'] in VERB: s0 = int(e['t'] * SR); k = min(len(x), NW - s0); snd[s0:s0 + k] += x[:k] * VERB[e['type']]
fx += T.verb(snd, 1.1) * .35


# ---------- vòng lặp: phần dư sau 52 s cộng vào đầu phim, rồi cắt về đúng độ dài ----------
for k in ('mus', 'fx'):
    b = B[k]; tail = b[N0:].copy(); b[:len(tail)] += tail; B[k] = b[:N].copy()
mus, fx = B['mus'], B['fx']


# ---------- nền: vườn ban ngày (gió nhẹ + chim xa rất nhỏ), riêng cảnh tựa không có ----------
amb = B['amb']
def bed(d):
    tt = t_(d); e = np.minimum(1, tt / .3) * np.minimum(1, (d - tt) / .3)
    return (lp(brown(d), 700) * .5 + bp(noise(d), 2000, 6000) * .01) * e * .06
for a, b in ((0., at(2) - .1), (at(3) - .3, DUR)): add(amb, bed(b - a), a, 1., 0)


# ---------- giọng ----------
vox = np.zeros(N)
for L in TL['lines']:
    y, sr = sf.read(os.path.join(HERE, 'voice', L['id'] + '.wav'))
    if y.ndim > 1: y = y.mean(1)
    y = soxr.resample(y, sr, SR); s = int(L['t'] * SR); e = min(N, s + len(y)); vox[s:e] += y[:e - s]
vox = compress(norm(vox, .9), thr=.22, ratio=3.5)
vox = norm(vox, .85)
B['vox'][:, 0] = B['vox'][:, 1] = vox


# ---------- trộn ----------
def rms(x): x = x[np.abs(x).max(1) > 1e-4] if x.ndim > 1 else x[np.abs(x) > 1e-4]; return float(np.sqrt(np.mean(x ** 2))) if len(x) else 0.
mus *= .075 / max(rms(mus), 1e-9)
fx *= .55 / max(np.abs(fx).max(), 1e-9)
from scipy.ndimage import maximum_filter1d, uniform_filter1d
ve = uniform_filter1d(maximum_filter1d(np.abs(vox), int(.05 * SR)), int(.25 * SR))
B['mus'] = mus = T.duck(mus, ve, .82, .55)
B['fx'] = fx = T.duck(fx, ve, .6, .3)
mix = B['mus'] + B['fx'] + B['amb'] + B['vox']
mix = np.tanh(mix * 1.1) / 1.1
mix, I_mix, ceil_db = T.master(mix, 11.6)   # crest 11,6: chừa đỉnh cho AAC (bản trước −0,9 dBTP)
print(f'master: {I_mix:.1f} LUFS, true-peak ceiling {ceil_db:.1f} dBFS')
nf = int(.02 * SR); mix[:nf] *= np.linspace(0, 1, nf)[:, None]   # mép đầu file: fade-in 20 ms (xem SHORT-002 MUSIC.md)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR, subtype='PCM_24')
for k in ('mus', 'fx', 'vox'): sf.write(os.path.join(HERE, 'out', f'stem_{k}.wav'), B[k].astype(np.float32), SR, subtype='PCM_16')

from scipy.signal import welch
f, p = welch(mix.mean(1), SR, nperseg=8192); low = p[(f >= 20) & (f < 120)].mean(); rest = p[(f >= 120) & (f < 8000)].mean()
print(f'low band 20–120 Hz vs 120–8000 Hz: {10 * np.log10(low / rest):+.1f} dB (per-Hz density)')
for name, a, b in (('mở', 0, 4), ('tựa', 4, 6), ('râu', 6, 16), ('đường mùi', 16, 28), ('rệp', 28, 36), ('sổ', 36, 46), ('kết', 46, 52)):
    i, j = int(a * SR), int(b * SR)
    print(f'{name:9s}', '  '.join(f'{k}={20 * np.log10(max(rms(B[k][i:j]), 1e-9)):6.1f}' for k in ('mus', 'fx', 'amb', 'vox')), 'dBFS rms')
print('out/mix.wav', f'{len(mix) / SR:.2f} s')
