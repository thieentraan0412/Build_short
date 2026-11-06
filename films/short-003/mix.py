"""Âm thanh của SHORT-003 → out/mix.wav (48 kHz stereo): nhạc theo từng cảnh ("Night Band swing" ở Rê thứ → Fa trưởng, MUSIC.md)
trên lưới 120 BPM, tiếng động theo events.json, nền đêm, giọng.
python mix.py   (cần timeline.json + voice/*.wav từ tools/lines.mjs và core/tts/tts.py, events.json từ core/render/events.mjs)
Nhạc cụ: _shared/audio/band.py; tiếng động hoạt hình: _shared/audio/toon.py (dùng chung cho mọi tập). Không dùng mẫu âm thanh của bên thứ ba.
Phim phát vòng lặp: bass đi bộ ở 22,6–24 s dẫn về nốt Rê ở 0,0; mọi đuôi tiếng vượt quá 24 s được gấp về đầu phim."""
import os, sys, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio')); sys.path.insert(0, os.path.join(LIB, '_shared', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, whoosh, thump, ding, pop, click, step, compress, limit, add
from band import fade, mf, pluck, marimba, bassn, kick, clap, hat, bell, pad, riser, glide, chirp
from band import xylo, tom, brush, celesta, rhodes, vibes, snap, upright, triad, secret, MIN, pizz   # màu "Night Band" (MUSIC.md); pizz: rón rén trước "NOPE!" (v2)
import toon as T

TL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))
EV = json.load(open(os.path.join(HERE, 'events.json'), encoding='utf-8'))['ev']
HIT = TL['hit']
BEAT = 60 / TL['bpm']; BAR = BEAT * 4; DUR = TL['dur']; N = int((DUR + .05) * SR); N0 = int(DUR * SR)
NW = N + int(2.5 * SR)                          # nhạc và tiếng động được viết dài hơn phim, phần dư gấp về đầu (vòng lặp)
at = lambda bar, beat=0: (bar * 4 + beat) * BEAT
rng = np.random.default_rng(17)
B = {k: np.zeros((NW if k in ('mus', 'fx') else N, 2)) for k in ('mus', 'fx', 'amb', 'vox')}
def mixl(*xs):
    n = max(len(x) for x in xs); return sum(np.pad(x, (0, n - len(x))) for x in xs)


# ---------- nhạc: "Night Band swing" — khác SHORT-001 (tổ khúc) và SHORT-002 (calypso) về giọng, điệu, nhạc cụ ----------
# Contrabass gảy đi bộ, búng tay phách 2–4, chổi trống và hat nhịp swing (móc đơn lệch về 2/3 phách), phím điện đệm phách lệch, vibraphone hát.
# Tiếng gáy của Chirp và của con dế xa (tiếng động) đóng vai bộ gõ của ban nhạc. Mô-típ bí mật đô–mi–sol ở Fa trưởng khi cái tai sáng lên.
mus = B['mus']
REST = ((HIT['nope'] + .12, HIT['nope'] + 1.5),)  # khựng ban nhạc sau tiếng hét (v2: ngắn hơn, và vẫn còn tiếng vibraphone run run bên dưới, không im hẳn)
def M(x, t, g=1., pan=0.):
    if any(a - .02 <= t < b - .02 for a, b in REST): return
    add(mus, x, t, g, pan)
def seq(inst, ns, t0, step, g=1., pan=0., d=None, ramp=0., swing=0.):
    for i, n in enumerate(ns):
        if n: M(inst(n, d) if d else inst(n), t0 + i * step + (swing * step if i % 2 else 0), g * (1 + ramp * i), pan)
def strum(inst, ns, t, g=.4, d=None, spread=.012):
    for k, n in enumerate(ns): M(inst(n, d) if d else inst(n), t + k * spread, g, -.3 + .6 * k / max(1, len(ns) - 1))
SW = 1 / 3                                      # swing: móc đơn thứ hai của mỗi phách rơi ở 2/3 phách
def swing(t0, t1, walk, chords, g=1., snaps=True, comp=True, ride=True, kick_=True, brush_=False):
    """Nhịp swing của Night Band trong [t0, t1): walk = các nốt bass (một nốt mỗi phách, lặp vòng), chords = các hợp âm phím điện (một hợp âm mỗi ô nhịp)."""
    b0 = int(round(t0 / BEAT)); b1 = int(round(t1 / BEAT))
    for i, b in enumerate(range(b0, b1)):
        tb = b * BEAT
        if walk and walk[i % len(walk)]: M(upright(walk[i % len(walk)], .45), tb, 1.05 * g)   # 0 = nghỉ
        if ride: M(hat(.7), tb, .45 * g, .35); M(hat(.45), tb + BEAT * (1 - SW), .32 * g, .35)
        if b % 2 == 1:
            if snaps: M(snap(.8), tb, .5 * g, -.25)
            if brush_: M(brush(.8), tb, .4 * g, -.2)
        elif kick_: M(kick(.6), tb, .5 * g)
        if comp and b % 2 == 0: strum(rhodes, chords[(b // 4) % len(chords)], tb + BEAT * (1 - SW), .3 * g, .5)   # đệm phách lệch (swing)
DM, F_, BB, C_, A7 = triad(62, MIN), triad(65), triad(58, inv=1), triad(60), [61, 64, 67]
# vòng hoà âm: Rê thứ · Si♭ · Đô · Rê thứ (mở) → Fa · Rê thứ · Si♭ · Đô (khi cái tai sáng lên)

# — Hook 0–2,45 s: nhịp swing chạy ngay từ giây 0; vibraphone "ping" khi tiếng gáy xa chạm tai; phím điện hỏi–đáp với tiếng gáy của Chirp —
M(kick(.8), 0., .55); M(upright(38, .5), 0., 1.0); M(vibes(74, 1.0), 0., .35, .3); M(T._ting(mf(98), .5), 0., .15, .4)
for i in range(10): M(vibes((86, 89)[i % 2], .22), .05 + i * .22, .07 * (1 - i / 12), .45)   # v2: vibraphone rung nhẹ ở dải cao lúc máy lao vào: "hồi hộp, lắng nghe"
swing(BEAT, HIT['listen2'], (41, 45, 43), [DM], g=.7, comp=False)                       # bass đi bộ Rê–Fa–La… dưới câu hỏi, không đệm dày
M(vibes(81, 1.2), HIT['hear'], .42, .3); M(vibes(86, 1.0), HIT['hear'] + .04, .22, .3)   # nghe thấy!
for i, ch in enumerate(([62, 65, 69], [64, 67, 70], [65, 69, 72])):                    # Chirp gáy đáp: phím điện chen vào giữa các tiếng gáy
    strum(rhodes, ch, HIT['answer'] + .125 + i * .3, .26, .35)
seq(upright, (38, 40, 41, 43, 45), HIT['listen2'], BEAT / 4, .85, 0., d=.3, ramp=.05)   # lại vểnh chân: bass chạy lên "tò mò"
swing(at(1), at(2), (38, 41, 45, 48), [DM, BB], g=.85)                                    # kéo xa, "Let's zoom in!": nhịp đầy
M(riser(.6, .8), HIT['zoom'] - .5, .3)

# — Soi trong kính 4–9,8 s: khám phá, sang Fa trưởng khi cái tai sáng lên; mỗi cú "bum" của mặt tai là một nốt bass + tom —
swing(at(2), at(2, 1), (38,), [DM], g=.7)
secret(M, vibes, 77, HIT['glow'], .17, .42, .3)                                           # mô-típ bí mật: Fa–La–Đô trên vibraphone
M(pad([65, 69, 72, 76], 2.6), HIT['glow'], .55)
swing(at(2, 2), HIT['drumIn'], (41, 45, 48, 45, 38, 41, 45, 41), [F_, DM], g=.7, snaps=False)
for i, h in enumerate(HIT['drumHit']):                                                    # mặt tai rung: "bum" (dải trầm, nằm dưới lời)
    M(upright(41 if i < 2 else 38, .6), h, 1.1); M(tom(43 if i < 2 else 41, .8), h, .5)
    if i < 2: M(vibes(72 + 2 * i, .6), h + .25, .18, .3)
tdr = HIT['drumHit'][2]                                                                   # TINY DRUM!: trống dồn nhỏ + hợp âm Fa
for i, n in enumerate((45, 48, 50)): M(tom(n, .7), tdr + .1 + i * .09, .4, .1)
strum(rhodes, [65, 69, 72, 77], tdr + .38, .3, .8); M(vibes(84, 1.0), tdr + .38, .3, .3)

# — Nhịp "ồ" 9,8–13,5 s: ấm, nửa nhịp (không trống), vibraphone giữ nốt dài; Chirp khúc khích: vibraphone láy —
M(pad([58, 62, 65, 69], 1.8), HIT['lensOut'], .55)
seq(upright, (46, 0, 41), HIT['push'], BEAT * 1.5, .7)
M(vibes(77, 1.2), HIT['bend'] + .2, .25, .25); M(vibes(74, 1.0), HIT['giggle'] - .4, .2, .25)
M(celesta(84, .8), HIT['bend'] + .5, .16, .3); M(celesta(81, .8), HIT['bend'] + 1.0, .14, .3)   # v2: hộp nhạc nhỏ, đáng yêu (sau chữ "Hello")
seq(vibes, (81, 84, 81, 86), HIT['giggle'], .09, .24, .3, d=.4)
strum(rhodes, [65, 69, 72, 76], HIT['laugh'], .3, 1.0); M(upright(41, .6), HIT['laugh'], .8)
seq(marimba, (65, 69, 72, 74, 77), HIT['snap'] + .05, .07, .45, .2, ramp=.1)             # v2: "chụp" sticker: marimba chạy lên (ban nhạc kênh)
M(T.gliss(77, 101, HIT['zoomIn'][1] - HIT['zoomIn'][0], .3, 'harp'), HIT['zoomIn'][0], .9)   # v3: lao xuyên qua mặt kính: đàn hạc vuốt lên
M(T.gliss(96, 79, HIT['zoomOut'][1] - HIT['zoomOut'][0], .22, 'harp'), HIT['zoomOut'][0], .7) # máy lùi ra khỏi sticker: đàn hạc vuốt xuống

# — Sổ 14–19,6 s: sticker, Albie (thưa, không bè trầm dưới giọng trầm của Albie), Chirp nhảy tới —
ti = HIT['stamp']; M(kick(.8), ti, .8); M(T.cymbal(1.6, 1., 4500), ti, .26, .15); strum(rhodes, [65, 69, 72, 77], ti, .32, .9)   # v2: nhấn ở cú dán sticker
ts = HIT['stamp']; M(vibes(89, 1.0), ts + .02, .3, .3); strum(pluck, (65, 69, 72), ts, .38)
swing(ti + .5, HIT['hop'], (41, 0, 46, 0, 45, 0, 43, 0), [F_, BB], g=.6, kick_=False, comp=False, ride=False, brush_=True)   # v2: dưới câu của Albie: búng tay, chổi trống, bass gảy thưa (dải trầm); không hợp âm phím điện (từng che chữ "In")
for i, n in enumerate((89, 93, 96, 93, 89, 96)): M(celesta(n, .3), ti + .6 + i * .42, .1, .45)   # lấp lánh hộp nhạc ở dải cao, thưa: sổ vui, không còn lặng
L6 = next(l for l in TL['lines'] if l['id'] == 'L06'); strum(rhodes, [65, 69, 72], L6['t'] + L6['dur'] + .1, .3, .5)   # hết câu mới đệm
seq(upright, (38, 40, 41, 43, 45), HIT['hop'] - .05, .09, .8, 0., d=.25)                 # Chirp nhảy tới: bass chạy lên
M(vibes(81, .8), HIT['hopLand'], .25, .2)
swing(HIT['hopLand'] + .1, HIT['nope'] - .05, (38, 41, 43, 45), [DM], g=.5, snaps=False, ride=False)   # dưới câu hỏi của Albie: nhẹ, rón rén
for i in range(6): M(pizz((62, 64, 65, 67, 69, 70)[i], .18), HIT['hopLand'] + .2 + i * .25, .18, -.3)   # v2: pizzicato đi lên rón rén: "hồi hộp" trước "NOPE!"
strum(rhodes, [62, 65, 69, 72], HIT['nope'] - .02, .42, .25); M(upright(38, .3), HIT['nope'] - .02, 1.0); M(kick(), HIT['nope'] - .02, .7)   # "NOPE!": cả ban nhạc khựng một phát

# — Sau "NOPE!": ban nhạc khựng, chỉ còn vibraphone run run (Chirp run run); "Oops! Sorry!": ba nốt "aww" đi xuống; hé mắt; lắng nghe: nhạc lặng gần hết (chỉ còn pad mỏng) để trẻ nghe tiếng gáy xa; vòng sóng: vibraphone rải lên, bass dẫn về khung đầu —
for i in range(18): add(mus, vibes((74, 75)[i % 2], .14), HIT['nope'] + .25 + i * .09, .16 * (1 - i / 22), .3)   # run run (qua mặt REST)
add(mus, upright(38, .6), HIT['nope'] + 1.5, .55, 0); add(mus, pad([62, 65, 69], 1.2), HIT['nope'] + 1.5, .18, 0)   # nối mềm sang "Oops! Sorry!" (không còn lỗ im)
L9 = next(l for l in TL['lines'] if l['id'] == 'L09'); seq(vibes, (81, 77, 74), L9['t'] + L9['dur'] + .02, .16, .22, .25, d=.6)
M(vibes(74, .8), HIT['peek'], .28, .2)
swing(HIT['ask'][0] + .2, HIT['show'], (38, 0, 45, 0), [DM], g=.5, snaps=False, comp=False, kick_=False)   # v4: dưới câu hỏi kết vẫn còn lớp mỏng ngoài dải giọng (bass gảy thưa dải trầm + hat dải cao): không lỗ im
M(celesta(84, .5), HIT['wait'], .16, .35); M(celesta(88, .6), HIT['wait'] + .12, .18, .35)   # v4: nhịp chờ trẻ trả lời: hai nốt hộp nhạc hỏi lên "ding-ding?" (dải cao, sau lời)
strum(rhodes, [65, 69, 72, 77], HIT['show'], .32, .8); M(vibes(84, .9), HIT['show'] + .05, .3, .3)   # v3: "ta-da" khi Chirp khoe cái tai
M(kick(.8), HIT['recall'], .7); M(upright(38, .5), HIT['recall'], 1.0); M(vibes(74, 1.0), HIT['recall'], .35, .3); M(vibes(81, 1.0), HIT['recall'] + .12, .3, .3)   # chữ móc trở lại: đúng phách mở đầu phim
swing(HIT['recall'] + BEAT, HIT['ring'], (41, 45, 43, 45), [DM], g=.7, comp=False)
seq(vibes, (69, 72, 74, 77, 81), HIT['ring'], .12, .26, .3, d=.8, ramp=.06)               # vòng sóng âm mở ra: vibraphone rải lên
M(upright(40, .3), DUR - BEAT / 2, .9)                                                    # nốt dẫn (Mi) → Rê ở 0,0

# — cường độ theo cảnh (chuyển mềm 0,3 s) —
# v3: tự động hoá âm lượng rõ hơn: dâng ở chỗ khám phá và bất ngờ, hạ dưới lời (nhường giọng thêm ở toon.duck bên dưới)
LEVEL = ((0, .92), (.6, .8), (HIT['pull'], 1.0), (HIT['zoom'], .82), (HIT['glow'], 1.0), (HIT['glow'] + .6, .78), (HIT['drumIn'], .88), (HIT['drumHit'][2], 1.0),
         (HIT['lensOut'], .74), (HIT['giggle'], .86), (HIT['snap'], 1.0), (ti + .2, .82), (ti + .4, .76), (HIT['hop'], .92), (HIT['hopLand'] + .2, .74),
         (HIT['nope'], 1.0), (HIT['nope'] + .4, .8), (HIT['peek'], .74), (HIT['ask'][0], .7), (HIT['wait'], .85), (HIT['show'], .95), (HIT['recall'], 1.0), (HIT['ring'], .92))
tt = np.arange(len(mus)) / SR; lev = np.full(len(mus), LEVEL[0][1])
for (t, g), (_, g0) in zip(LEVEL[1:], LEVEL[:-1]): lev = np.where(tt >= t - .15, np.where(tt < t + .15, g0 + (g - g0) * (tt - t + .15) / .3, g), lev)
mus *= lev[:, None]


# ---------- tiếng động theo sự kiện ----------
fx = B['fx']
def farchirp(v=1.):                             # tiếng gáy của con dế xa: ba xung, thấp và xa hơn tiếng của Chirp
    x = np.zeros(int(.16 * SR)); tt = t_(.026); b = np.sin(2 * np.pi * 4100 * tt) * np.sin(np.pi * tt / .026) ** 2
    for k in range(3): s = int(k * .04 * SR); x[s:s + len(b)] += b
    return lp(x, 6000) * v * .12
def giggle():                                   # Chirp khúc khích: tiếng gáy ngắn, cao dần
    x = np.zeros(int(.6 * SR))
    for k in range(6):
        tt = t_(.02); f = 4300 + 180 * k; b = np.sin(2 * np.pi * f * tt) * np.sin(np.pi * tt / .02) ** 2 * (1 - k * .1); s = int(k * .085 * SR); x[s:s + len(b)] += b
    return x * .16
def drumhit(v=1.):                              # mặt tai rung: "bum" mềm như trống đồ chơi (dải trầm, nằm dưới lời)
    return mixl(thump(.8, 150) * .8, np.pad(T.boing(170, .35, .25, 1.6, 20.), (int(.01 * SR), 0))) * v
def squeeze():                                  # Chirp bịt chặt đầu gối: "chụt" nhỏ + run run
    tt = t_(.5); trem = lp(noise(.5), 900) * (.5 + .5 * np.sin(2 * np.pi * 22 * tt)) * np.exp(-tt * 3) * .12
    return mixl(T.bubble(500, .4, .05, 1.6), trem)
def stamp(): return mixl(thump(.8, 95) * .7, hp(noise(.07), 1200) * env_exp(.07, .012) * .6)
SFX = {
    'titlepop': lambda e: mixl(T.bubble(1600, .5, .06, 2.4), np.pad(T._ting(mf(103), .5, .35), (int(.02 * SR), 0))),   # chữ móc bật ra ở khung đầu
    'crash': lambda e: mixl(T.swish(e.get('d', .45), .3, 900, 4200, True, .2, .2), T.whistle(700, 1500, e.get('d', .45), .06)),   # v2: máy lao vào Chirp
    'snap': lambda e: mixl(click(1., .25) * .8, np.pad(click(.8, .2) * .5, (int(.045 * SR), 0)), np.pad(T.sparkle(.45, .3, 93, 108, 6, 7, 'up'), (int(.06 * SR), 0))),   # "tách" chụp ảnh + lấp lánh
    'popout': lambda e: mixl(pop(.7) * .6, T.bubble(900, .4, .08, 2.2)),
    'wordpop': lambda e: mixl(T.boing(220 + 120 * e.get('n', 0), .35, .3, 2.4, 16.), np.pad(pop(.6) * .45, (int(.02 * SR), 0)), T.bubble(1300 + 500 * e.get('n', 0), .35, .05, 2.4)),   # v3: mỗi dòng chữ móc nảy một tiếng
    'twitch': lambda e: mixl(T.boing(300, .25, .22, 2.6, 20.), np.pad(T.tink(.2, 4200), (int(.05 * SR), 0))),   # cái đầu gối giật lên
    'zoomin': lambda e: mixl(T.swish(e.get('d', .35), .42, 600, 5200, True, .15, .25), riser(e.get('d', .35), .4)),   # lao xuyên qua mặt kính
    'zoomout': lambda e: mixl(T.swish(e.get('d', .35), .3, 500, 3800, False, .25, .2), np.pad(T.paper(.3, .35, 5, 4), (int(.1 * SR), 0))),   # lùi ra khỏi sticker: trang sổ sột soạt
    'show': lambda e: mixl(T.gliss(76, 100, .35, .3, 'harp'), np.pad(T.sparkle(.6, .3, 91, 108, 7, 3, 'up'), (int(.1 * SR), 0)), T.boing(240, .3, .2, 2.2, 14.)),   # ta-da
    'recall': lambda e: mixl(SFX['titlepop'](e), SFX['wordpop']({'n': 0}), np.pad(SFX['wordpop']({'n': 1}), (int(.12 * SR), 0))),   # chữ móc trở lại
    'whip': lambda e: mixl(T.swish(e.get('d', .45), .5, 700, 5200, True, .25, .25), whoosh(e.get('d', .45), .35)),   # lia máy nhanh
    'farchirp': lambda e: farchirp(e.get('v', 1.)),
    'bang': lambda e: mixl(T.tink(.3, 5200), np.pad(T.boing(420, .25, .2, 2.8, 22.), (int(.03 * SR), 0))),   # v4: dấu "!" bật ra ở cái đầu gối
    'ask': lambda e: mixl(T.bubble(1500, .3, .05, 2.4), np.pad(SFX['wordpop']({'n': 1}) * .55, (int(.1 * SR), 0))),   # v4: chữ câu hỏi kết bật ra (nhỏ, ngay trước lời)
    'askq': lambda e: mixl(T.tink(.18, 4800), np.pad(T.tink(.16, 5400), (int(.09 * SR), 0))),   # hai dấu "?" nhún: tiếng ở dải cao, nhỏ, không che lời
    'hear': lambda e: mixl(T.tink(.35, 4400), T.bubble(900, .35, .07, 2.0)),                   # vòng sóng chạm tai
    'chirp': lambda e: chirp(1.),
    'notepop': lambda e: T.bubble(mf(e.get('m', 84)) * .5, .3, .06, 2.2),
    'legup': lambda e: mixl(T.boing(260, .35, .22, 2.0, 16.), T.swipe(.18, .18, True, 1800, 6000)),   # vểnh chân
    'pullback': lambda e: mixl(whoosh(.9, .6) * .8, lp(noise(.9), 300) * np.sin(np.pi * t_(.9) / .9) * .2),
    'shrink': lambda e: T.whistle(2400, 1200, .3, .2),
    'swipe': lambda e: T.swipe(e.get('d', .3), .32, True, e.get('lo', 1500), e.get('hi', 5500)),
    'tink': lambda e: T.tink(.3),
    'zoom': lambda e: mixl(riser(.6, 1.), T.whistle(420, 1250, .55, .15)),
    'sparkle': lambda e: mixl(*(np.pad(bell(n, .6, .9), (int(i * .07 * SR), 0)) for i, n in enumerate((89, 93, 96)))) * e.get('v', 1.),
    'swish': lambda e: T.swish(e.get('d', .45), e.get('v', .4), e.get('lo', 350), e.get('hi', 2600), e.get('up', True)),
    'drum': lambda e: drumhit(e.get('v', 1.)),
    'pops': lambda e: T.pops(e.get('n', 6), e.get('step', .035), e.get('m', 84), e.get('v', .5)),
    'swishout': lambda e: T.swish(.5, .45, 400, 2800, False),
    'push': lambda e: T.swish(.8, .3, 250, 1500, True, .75, .6),
    'giggle': lambda e: giggle(),
    'boing': lambda e: glide(260, 520, .35, .3 * e.get('v', .5) / .5, .06),
    'lensiris': lambda e: mixl(T.swirl(.5, .45, 5, 800, 3400), T.swell(.5, .55, 77, 101)),       # kết thúc đúng 14,0
    'page': lambda e: mixl(T.paper(.35, .45, 5, 1), T.bubble(520, .3, .09)),
    'stamp': lambda e: stamp(),
    'ding': lambda e: T.ding(e.get('m', 89), .4, .7),
    'hop': lambda e: mixl(T.boing(220, .4, .3, 2.2, 14.), T.swish(.3, .2, 800, 3500, True)),
    'land': lambda e: mixl(step(.5) * .6, np.pad(glide(320, 640, .25, .25, .04), (int(.02 * SR), 0))),
    'nope': lambda e: mixl(T.swish(.35, .5, 600, 5000, True, .3, .2), np.pad(T.wobble(90, .6, .35, 9, .2), (int(.05 * SR), 0))),   # chữ NOPE! bay vào, màn hình rung
    'pages': lambda e: T.paper(e.get('d', .4), .35, 6, 2),
    'squeeze': lambda e: squeeze(),
    'blip': lambda e: T.blip(e.get('m', 88), .3),
    'ringiris': lambda e: mixl(T.swirl(.7, .4, 6, 700, 3000), T.revcymbal(.7, .3)),                # dâng đến đúng điểm lặp
}
missing = sorted({e['type'] for e in EV} - SFX.keys())
if missing: sys.exit(f'mix.py: no sound for event types {missing}')
VERB = {'sparkle': .5, 'lensiris': .6, 'snap': .4, 'whip': .2, 'zoomin': .25, 'show': .35, 'recall': .3, 'ringiris': .3, 'ding': .4, 'tink': .5, 'hear': .5, 'swipe': .3, 'page': .3, 'shrink': .3, 'zoom': .3, 'titlepop': .3, 'farchirp': .6}
snd = np.zeros(NW)
for e in EV:
    x = SFX[e['type']](e); add(fx, x, e['t'], 1., e.get('pan', 0))
    if e['type'] in VERB: s0 = int(e['t'] * SR); k = min(len(x), NW - s0); snd[s0:s0 + k] += x[:k] * VERB[e['type']]
fx += T.verb(snd, 1.3) * .35


# ---------- vòng lặp: phần dư sau 24 s cộng vào đầu phim, rồi cắt về đúng độ dài ----------
for k in ('mus', 'fx'):
    b = B[k]; tail = b[N0:].copy(); b[:len(tail)] += tail; B[k] = b[:N].copy()
mus, fx = B['mus'], B['fx']


# ---------- nền: đêm (gió nhẹ trầm + tiếng côn trùng rì rầm rất xa), chạy suốt phim kể cả cảnh sổ ----------
amb = B['amb']
d = DUR; tt = t_(d)
night = lp(brown(d), 300) * .7 * (.7 + .3 * np.sin(2 * np.pi * .11 * tt))           # gió trầm dâng hạ chậm (v2)
add(amb, night * np.minimum(1, tt / .05) * .07, 0, 1., 0)
rng2 = np.random.default_rng(23)                                                     # v2: dàn dế xa (từng tràng ngắn, nhiều hướng, rất nhỏ) và vài tiếng ếch mềm ở chỗ không có lời
for k in range(int(d / .55)):
    t0 = k * .55 + rng2.uniform(0, .3); x = np.zeros(int(.12 * SR)); f = rng2.uniform(4300, 4900); b = np.sin(2 * np.pi * f * t_(.022)) * np.sin(np.pi * t_(.022) / .022) ** 2
    for j in range(3): s0 = int(j * .035 * SR); x[s0:s0 + len(b)] += b
    add(amb, lp(x, 6500) * .012 * rng2.uniform(.5, 1.), t0, 1., rng2.uniform(-.8, .8))
for t0 in (6.9, 12.0, 15.6, 20.5):
    if any(l['t'] - .2 < t0 < l['t'] + l['dur'] for l in TL['lines']): continue
    rb = glide(240, 170, .16, .5, 0.) * np.exp(-t_(.16) * 6); add(amb, np.concatenate([rb, np.zeros(int(.05 * SR)), rb * .8]) * .05, t0, 1., -.6)


# ---------- giọng ----------
vox = np.zeros(N)
for L in TL['lines']:
    y, sr = sf.read(os.path.join(HERE, 'voice', L['id'] + '.wav'))
    if y.ndim > 1: y = y.mean(1)
    y = soxr.resample(y, sr, SR) * (1.35 if L['id'] == 'L08' else 1.)   # "NOPE!" là tiếng hét: to hơn các câu khác
    s = int(L['t'] * SR); e = min(N, s + len(y)); vox[s:e] += y[:e - s]
vox = compress(norm(vox, .9), thr=.22, ratio=3.5)
vox = norm(vox, .85)
B['vox'][:, 0] = B['vox'][:, 1] = vox


# ---------- trộn ----------
def rms(x): x = x[np.abs(x).max(1) > 1e-4] if x.ndim > 1 else x[np.abs(x) > 1e-4]; return float(np.sqrt(np.mean(x ** 2))) if len(x) else 0.
mus *= .075 / max(rms(mus), 1e-9)               # nhạc thấp hơn giọng khoảng 10 dB
fx *= .55 / max(np.abs(fx).max(), 1e-9)
from scipy.ndimage import maximum_filter1d, uniform_filter1d
ve = uniform_filter1d(maximum_filter1d(np.abs(vox), int(.05 * SR)), int(.25 * SR))
B['mus'] = mus = T.duck(mus, ve, .82, .55)          # nhạc nhường giọng: dải chữ 300–4000 Hz −15 dB, bass/kick/lớp sáng −7 dB
B['fx'] = fx = T.duck(fx, ve, .6, .3)                 # tiếng động nhường giọng: dải chữ −8 dB, phần còn lại −3 dB
B['amb'] = T.duck(B['amb'], ve, .7, .5)              # v2: nền đêm cũng nhường giọng
mix = B['mus'] + B['fx'] + B['amb'] + B['vox']
mix = np.tanh(mix * 1.1) / 1.1
mix, I_mix, ceil_db = T.master(mix); print(f'master: {I_mix:.1f} LUFS, true-peak ceiling {ceil_db:.1f} dBFS')
# mép đầu file: fade-in 20 ms (khung đầu là phách nối vòng lặp; bộ mã AAC vọt đỉnh ở mép file nếu mẫu đầu không bằng 0, xem SHORT-002 MUSIC.md)
nf = int(.02 * SR); mix[:nf] *= np.linspace(0, 1, nf)[:, None]
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR, subtype='PCM_24')
for k in ('mus', 'fx', 'vox'): sf.write(os.path.join(HERE, 'out', f'stem_{k}.wav'), B[k].astype(np.float32), SR, subtype='PCM_16')   # để kiểm lời có bị che không

from scipy.signal import welch
f, p = welch(mix.mean(1), SR, nperseg=8192); low = p[(f >= 20) & (f < 120)].mean(); rest = p[(f >= 120) & (f < 8000)].mean()
print(f'low band 20–120 Hz vs 120–8000 Hz: {10 * np.log10(low / rest):+.1f} dB (per-Hz density)')
for name, a, b in (('mở', 0, 2.5), ('soi', 2.5, 9.8), ('ồ', 9.8, 14), ('sổ', 14, 19.6), ('gag', 19.6, 24)):
    i, j = int(a * SR), int(b * SR)
    print(f'{name:5s}', '  '.join(f'{k}={20 * np.log10(max(rms(B[k][i:j]), 1e-9)):6.1f}' for k in ('mus', 'fx', 'amb', 'vox')), 'dBFS rms')
print('out/mix.wav', f'{len(mix) / SR:.2f} s')
