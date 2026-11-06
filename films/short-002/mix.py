"""Âm thanh của SHORT-002 → out/mix.wav (48 kHz stereo): nhạc theo từng cảnh ("Calypso picnic" ở giọng G, MUSIC.md) trên lưới 120 BPM, tiếng động theo events.json, nền, giọng.
python mix.py   (cần timeline.json + voice/*.wav từ tools/lines.mjs và core/tts/tts.py, events.json từ core/render/events.mjs)
Nhạc cụ, tiếng ngân của Flutter: _shared/audio/band.py; tiếng động hoạt hình: _shared/audio/toon.py (dùng chung cho mọi tập).
Không dùng mẫu âm thanh của bên thứ ba. Bảng cue âm thanh (hình ↔ tiếng): SOUND.md.
Phim phát vòng lặp: hai nốt steel pan cuối phim (21,0 · 21,5) nối với nốt đầu phim (0,0, hợp âm D) và cú dậm chân ở 0,5 s (hợp âm G);
mọi đuôi tiếng vượt quá 22 s (còi rơi, vang, nốt ngân) được gấp về đầu phim, nên điểm lặp không bị ngắt."""
import os, sys, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio')); sys.path.insert(0, os.path.join(LIB, '_shared', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, whoosh, thump, ding, pop, click, step, compress, limit, add
from band import fade, mf, pluck, marimba, bassn, kick, clap, hat, shaker, bell, horn, pad, riser, glide, mmm
from band import pizz, xylo, flute, steel, tuba, claves, celesta, harp, secret   # nhạc cụ của lượt nhạc nền theo cảnh (MUSIC.md)
import toon as T

TL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))
EV = json.load(open(os.path.join(HERE, 'events.json'), encoding='utf-8'))['ev']
BEAT = 60 / TL['bpm']; BAR = BEAT * 4; DUR = TL['dur']; N = int((DUR + .05) * SR); N0 = int(DUR * SR)
NW = N + int(2.5 * SR)                          # nhạc và tiếng động được viết dài hơn phim, phần dư gấp về đầu (vòng lặp)
at = lambda bar, beat=0: (bar * 4 + beat) * BEAT
rng = np.random.default_rng(11)
B = {k: np.zeros((NW if k in ('mus', 'fx') else N, 2)) for k in ('mus', 'fx', 'amb', 'vox')}
def mixl(*xs):
    n = max(len(x) for x in xs); return sum(np.pad(x, (0, n - len(x))) for x in xs)


# ---------- nhạc: "Calypso picnic" ở giọng G (MUSIC.md) — khác SHORT-001 về giọng, điệu và nhạc cụ ----------
# Trống thép (steel pan) đệm phách lệch, bass tresillo 3+3+2, phách gỗ son clave; marimba và ukulele của ban nhạc kênh vẫn có mặt.
# Mô-típ bí mật đô–mi–sol (band.secret) ở giọng G khi điểm nếm sáng. Vòng lặp: hai nốt cuối phim (21,0 · 21,5) + nốt đầu phim (0,0, hợp âm D)
# dẫn vào cú dậm chân (0,5 s, hợp âm G); đuôi tiếng sau 22 s được gấp về đầu phim như cũ.
mus = B['mus']
HIT = TL['hit']
# khựng (ngắt nhạc): lúc mắt Flutter phồng to sau cú bung vòi; lúc Flutter vừa đậu lên trang, ngay trước "NOT my pages!"
REST = ((1.0, 1.2), (HIT['land'], HIT['land'] + .18))   # khựng ngắn (một móc đơn) khi mắt phồng to, nhịp chạy tiếp ngay
def M(x, t, g=1., pan=0.):
    if any(a - .02 <= t < b - .02 for a, b in REST): return
    add(mus, x, t, g, pan)
def seq(inst, ns, t0, step, g=1., pan=0., d=None, ramp=0.):
    for i, n in enumerate(ns):
        if n: M(inst(n, d) if d else inst(n), t0 + i * step, g * (1 + ramp * i), pan)
def strum(inst, ns, t, g=.55, d=None, spread=.014):
    for k, n in enumerate(ns): M(inst(n, d) if d else inst(n), t + k * spread, g, -.35 + .7 * k / max(1, len(ns) - 1))
def cymbal(t, g=.25, br=4500): M(T.cymbal(1.6, 1., br), t, g, .15)
CLAVE = (0, 3, 6, 10, 12)                       # son clave 3-2, tính theo móc kép trong một ô nhịp
def calypso(bar, root, tones, ta=None, tb=None, g=1., bass=True, comp=True, clave=True, kick_=True):
    """Một ô nhịp calypso (hoặc một đoạn [ta, tb) của ô): bass tresillo gốc–năm–tám ở móc đơn 0, 3, 6; steel pan đệm phách lệch; son clave; kick 1 và 3."""
    t0 = at(bar); ta = t0 if ta is None else ta; tb = t0 + BAR if tb is None else tb
    for i in range(8):
        t = t0 + i * BEAT / 2
        if not ta <= t < tb: continue
        if bass and i in (0, 3, 6): M(bassn((root, root + 7, root + 12)[(0, 3, 6).index(i)], .3), t, 1.1 * g)
        if comp and i % 2: strum(steel, tones, t, .2 * g, .22, .006)
        if kick_ and i in (0, 4): M(kick(.7), t, .55 * g)
    for p in CLAVE if clave else ():
        t = t0 + p * BEAT / 4
        if ta <= t < tb: M(claves(), t, .45 * g, .3)
G_, C_, D_, EM = (43, (67, 71, 74)), (48, (67, 72, 76)), (50, (66, 69, 74)), (40, (67, 71, 76))

# — Hook 0–2,45 s: dậm chân → tò mò, khựng khi mắt phồng to → "hả?" —
M(kick(.8), 0., .35); M(bassn(50, .3), 0., .6); M(T._ting(mf(98), .5), 0., .16, .4); M(steel(74, .5), 0., .3, .2)   # nốt đầu phim (D) nối từ cuối phim
ts = HIT['stomp']; M(kick(), ts, 1.1); M(bassn(43, .5), ts, 1.2); strum(steel, (67, 71, 74, 79), ts, .5, .6); M(xylo(79), ts + .01, .35, .2); cymbal(ts, .16, 5000)
calypso(0, *G_, ta=ts + .1, comp=False, g=.48)                             # nhịp calypso chạy ngay sau cú dậm (bass tresillo, son clave, kick), không có tiếng đệm dưới câu hỏi
seq(xylo, (74, 79, 83), HIT['sproing'], .045, .42, .25)                   # vòi bật ra: xylophone vút lên, rồi khựng 1,0–1,45 s
seq(pizz, (71, 74), 1.45, .12, .42, -.15, d=.18)                           # cúi nhìn cái vòi: "hm?"
seq(pizz, (74, 71, 67), HIT['curl'], .12, .38, -.15, d=.18)               # vòi cuộn lại
calypso(1, *G_, tb=HIT['pull'] + .05, comp=False, g=.48); calypso(1, *G_, ta=HIT['pull'] + .05, g=.75)                                # máy kéo xa: nhịp calypso vào

# — Soi trong kính 4–10,3 s: khám phá, có nhịp —
calypso(2, *G_, tb=at(2, 2)); calypso(2, *C_, ta=at(2, 2))
seq(steel, (74, 76, 79), at(2) - .38, .12, .4, .25)                        # câu dẫn trước "Its feet have tiny taste spots"
secret(M, celesta, 79, HIT['tap'], .17, .4, .35)                           # điểm nếm sáng: mô-típ bí mật ở giọng G
calypso(3, *EM, tb=at(3, 2), comp=False)
tsw = HIT['sweet']                                                         # "It's sweet!": hợp âm C bừng lên
M(kick(.8), tsw, .8); M(bassn(48, .5), tsw, 1.0); M(xylo(84), tsw, .2, .25); M(xylo(88), tsw + .07, .18, .25); cymbal(tsw, .12, 5500)   # nhỏ, để chữ "sweet" rõ
calypso(3, *C_, ta=tsw + .6, comp=False, clave=False, g=.75)
M(pad([62, 69, 72], 1.1), HIT['sigA'], .6)                                 # tia "ngọt" chạy lên: D7 chờ, bass móc đơn dồn
seq(pizz, (50,) * 8, HIT['sigA'], BEAT / 4, .24, 0., d=.14, ramp=.08)
seq(harp, (67, 71, 74, 79), HIT['straw'], .1, .2, -.2, d=.8)              # vòi duỗi ra: đàn hạc rải G đi lên
calypso(4, *G_, ta=at(4, 2), comp=False, g=.6)
calypso(5, *G_, tb=HIT['lensOut'], comp=False, g=.55)

# — Nhịp "ồ" 10,3–14 s: ấm, rồi gần như ngắt nhạc cho tiếng giày —
M(pad([64, 67, 71], 1.6), HIT['lensOut'], .5); M(flute(71, .8), 11.15, .38, .2)   # sáo vào sau chữ "straw" (QA: nốt Si nằm giữa dải giọng)
M(pad([64, 67, 72], 2.4), 11.5, .7); M(flute(72, .5), 11.2, .3, .2)
seq(xylo, (71, 67), HIT['shrug'], .25, .4, .3)                             # nhún vai: "hử?"
seq(marimba, (67, 69, 71, 74, 79), HIT['snap'] + .04, .07, .5, .2, ramp=.1)   # v4: "chụp": marimba chạy lên
M(T.gliss(79, 100, HIT['zoomIn'][1] - HIT['zoomIn'][0], .28, 'harp'), HIT['zoomIn'][0], .9)
M(T.gliss(96, 79, HIT['zoomOut'][1] - HIT['zoomOut'][0], .2, 'harp'), HIT['zoomOut'][0], .7)

ti = HIT['stamp']; M(kick(.9), ti, .9); cymbal(ti, .3, 4500); strum(steel, (67, 71, 74, 79), ti, .4, .6)   # v4: nhấn ở cú dán sticker

# — Sổ 14–18 s: sticker, Albie (thưa, không bè trầm dưới giọng trầm của Albie) —
tst = HIT['stamp']; strum(steel, (71, 74, 79, 83), tst, .45, .5); M(xylo(91), tst + .02, .3, .3); M(kick(.6), tst, .5)
for t, ch in ((at(7, 3), (67, 71, 74)), (at(8, 1), (67, 72, 76)), (at(8, 3), (66, 69, 74))):   # ukulele G · C · D
    strum(pluck, ch, t, .42)
seq(flute, (74, 76, 79, 81, 83, 86, 83, 86), HIT['fly'] + .1, .085, .4, .3, d=.12)   # Flutter bay vào: sáo vút lên, láy
calypso(8, *D_, ta=HIT['fly'] + .05, bass=False, clave=False, g=.8)

# — Gag 18–21,25 s: khựng → "NOT my pages!" → "Mmm!" → nhịp vui trở lại —
strum(pizz, (64, 67, 71), HIT['land'] + .19, .5, .16); M(tuba(40, .4, .6, bend=-3), HIT['land'] + .19, .5)   # "ối!": hợp âm Em ngắn
for i, n in enumerate((88, 91, 95, 91, 88, 95)): M(xylo(n, .2), HIT['land'] + .55 + i * .3, .12, .35)   # v4: lấp lánh xylophone thưa ở dải cao dưới gag (không còn lỗ im)
M(shaker(.5), HIT['sipPage'], .3, .4); M(shaker(.5), HIT['sipPage'] + .25, .25, .4)
calypso(10, *G_, ta=at(10, 1) + .1, tb=HIT['takeoff'], g=.85)
seq(steel, (71, 72), at(10, 2), BEAT, .5, .2)                              # vòng lặp: hai nốt cuối phim → nốt D ở 0,0 → G ở 0,5
M(bassn(50, .3), at(10, 3), .9); M(claves(), at(10, 3), .4, .3)

# — cường độ theo cảnh (chuyển mềm 0,3 s) —
LEVEL = ((0, .72), (HIT['pull'], .95), (at(2), .85), (tsw, .8), (HIT['sigA'], .9), (HIT['lensOut'], .75), (12., .6), (HIT['snap'], 1.0), (ti, .85), (ti + .3, .78),   # v4: dâng ở cú chụp và chữ móc trở lại
         (HIT['fly'], 1.), (HIT['land'], .8), (HIT['mmm'], .85), (20.4, .6), (HIT['recall'] + .8, .9))   # dưới câu hỏi kết: hạ nhạc để lời rõ
tt = np.arange(len(mus)) / SR; lev = np.full(len(mus), LEVEL[0][1])
for (t, g), (_, g0) in zip(LEVEL[1:], LEVEL[:-1]): lev = np.where(tt >= t - .15, np.where(tt < t + .15, g0 + (g - g0) * (tt - t + .15) / .3, g), lev)
mus *= lev[:, None]


# ---------- tiếng động theo sự kiện ----------
fx = B['fx']
def wings(d):
    tt = t_(d); return lp(noise(d), 1400) * (.5 + .5 * np.sin(2 * np.pi * 12 * tt)) ** 2 * np.sin(np.pi * tt / d) * .35
def bubbles(d):
    x = np.zeros(int(d * SR))
    for k in range(int(d * 9)):
        s = int(rng.uniform(0, d - .06) * SR); b = glide(rng.uniform(700, 1400), rng.uniform(1500, 2400), .05, .25); x[s:s + len(b)] += b
    return x
def stamp(): return mixl(thump(.8, 95) * .7, hp(noise(.07), 1200) * env_exp(.07, .012) * .6)
def squish():                                   # chân dậm lên miếng dưa mọng nước
    return mixl(thump(.7, 120) * .6, bp(noise(.22), 300, 1500) * env_exp(.22, .05) * .8, np.pad(glide(420, 180, .18, .25), (int(.02 * SR), 0)))
def splash():
    x = np.zeros(int(.5 * SR))
    for k in range(7):
        s = int(rng.uniform(0, .3) * SR); b = glide(rng.uniform(900, 1600), rng.uniform(2000, 3200), .045, .22); x[s:s + len(b)] += b
    return x
def signal(d):                                  # tia "ngọt": chuỗi chuông đi lên theo tia sáng
    x = np.zeros(int((d + .9) * SR))
    for i, n in enumerate((79, 81, 84, 86, 88, 91)):
        s = int(i * d / 6 * SR); b = bell(n, .5 + .06 * i, .7); x[s:s + len(b)] += b[:len(x) - s]
    return x
def squeak(v=.5):                               # giày gõ: tiếng "kít" cao su
    tt = t_(.11); f = 1500 + 900 * np.sin(np.pi * tt / .11)
    return mixl(fade(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / .11) * .35, .003, .02) * v, step(.4) * .3)
SFX = {
    'squish': lambda e: squish(), 'splash': lambda e: splash(),
    'punch': lambda e: T.swish(.3, .3, 1500, 6000, True, .85, .1),                                      # máy đẩy cận
    'shrink': lambda e: T.whistle(2400, 1200, .3, .2),     # chữ móc thu lại
    'swipe': lambda e: T.swipe(e.get('d', .3), .32, True, e.get('lo', 1500), e.get('hi', 5500)),
    'tink': lambda e: T.tink(.3),
    'titlepop': lambda e: mixl(T.bubble(1600, .5, .06, 2.4), np.pad(T._ting(mf(103), .5, .35), (int(.02 * SR), 0))),   # chữ móc bật ra ở khung đầu
    'swishout': lambda e: T.swish(.5, .22, 1500, 5000, False),                                 # dưới chữ "curly straw": dải cao, nhỏ (QA)
    'push': lambda e: T.swish(.8, .18, 250, 1500, True, .75, .6),
    'wonder': lambda e: T.sparkle(1.1, .5, 91, 108, 9, 4, 'down'),
    'lensiris': lambda e: mixl(T.swirl(.5, .45, 5, 800, 3400), T.swell(.5, .55, 79, 103)),       # kết thúc đúng 14,0
    'page': lambda e: mixl(T.paper(.35, .45, 5, 1), T.bubble(520, .3, .09)),
    'ding': lambda e: T.ding(e.get('m', 88), .4, .7),
    'paper': lambda e: T.paper(.22, .3, 4, 3),
    'flyby': lambda e: T.swish(.4, .5, 300, 2400, True, .85),
    'spot': lambda e: mixl(T.swirl(.45, .45, 6, 700, 3000), T.revcymbal(.45, .3)),                # dâng đến đúng điểm lặp
    'descend': lambda e: T.whistle(1300, 700, e.get('d', .45), .22),
    'sproing': lambda e: mixl(glide(300, 1100, .22, .32, .08), np.pad(pop(.6) * .4, (int(.2 * SR), 0))),
    'curl': lambda e: glide(900, 350, e.get('d', .45), .2, .05),
    'pullback': lambda e: mixl(whoosh(.9, .6) * .8, lp(noise(.9), 300) * np.sin(np.pi * t_(.9) / .9) * .2),
    'whoosh': lambda e: whoosh(e.get('d', .35), e.get('v', .5)),
    'zoom': lambda e: mixl(riser(.6, 1.), T.whistle(420, 1250, .55, .15)),
    'tap': lambda e: mixl(step(.7), thump(.3, 140) * .5),
    'sparkle': lambda e: mixl(*(np.pad(bell(n, .6, .9), (int(i * .07 * SR), 0)) for i, n in enumerate((88, 91, 95)))) * .6,   # dưới câu "Its feet have tiny taste spots" (QA)
    'bubbles': lambda e: bubbles(e.get('d', 1.)) * .45,
    'chime': lambda e: mixl(ding(.55) * .5, bell(84, .7)),
    'signal': lambda e: signal(e.get('d', .9)) * .6,                                           # nằm dưới câu "So out comes its curly straw!": nhỏ lại (QA)
    'slide': lambda e: glide(2400, 5200, e.get('d', .8), .1, .02),                             # vòi duỗi: còi trượt trên dải giọng, nhỏ (bản cũ 500–1400 Hz che lời)
    'slurp': lambda e: mixl(glide(900, 380, .35, .14), bp(noise(.35), 600, 2200) * np.sin(np.pi * t_(.35) / .35) * .08),
    'squeak': lambda e: squeak(e.get('v', .5)),
    'boing': lambda e: glide(260, 520, .35, .3 * e.get('v', .5) / .5, .06),
    'stamp': lambda e: stamp(),
    'flutter': lambda e: wings(e.get('d', .6)),
    'land': lambda e: mixl(step(.5) * .6, np.pad(glide(320, 640, .25, .25, .04), (int(.02 * SR), 0))),
    'mmm': lambda e: mmm(1.),
    'swish': lambda e: T.swish(e.get('d', .45), e.get('v', .4), e.get('lo', 350), e.get('hi', 2600), e.get('up', True)),
    'wordpop': lambda e: mixl(T.boing(220 + 120 * e.get('n', 0), .35, .3, 2.4, 16.), np.pad(pop(.6) * .45, (int(.02 * SR), 0)), T.bubble(1300 + 500 * e.get('n', 0), .35, .05, 2.4)),
    'snap': lambda e: mixl(click(1., .25) * .8, np.pad(click(.8, .2) * .5, (int(.045 * SR), 0)), np.pad(T.sparkle(.45, .3, 93, 108, 6, 7, 'up'), (int(.06 * SR), 0))),
    'zoomin': lambda e: mixl(T.swish(e.get('d', .3), .42, 600, 5200, True, .15, .25), riser(e.get('d', .3), .4)),
    'zoomout': lambda e: mixl(T.swish(e.get('d', .35), .3, 500, 3800, False, .25, .2), np.pad(T.paper(.3, .35, 5, 4), (int(.1 * SR), 0))),
    'recall': lambda e: SFX['titlepop'](e) * .6,                 # chữ móc trở lại giữa câu hỏi kết: chỉ một tiếng "ting" nhỏ ở dải cao (không che lời)
}
missing = sorted({e['type'] for e in EV} - SFX.keys())
if missing: sys.exit(f'mix.py: no sound for event types {missing}')
# đường gửi vang: tiếng lấp lánh và tiếng chuyển cảnh có đuôi vang mềm, không tắt cụt
VERB = {'sparkle': .5, 'chime': .4, 'signal': .4, 'wonder': .6, 'lensiris': .6, 'spot': .2, 'ding': .4, 'tink': .5, 'swipe': .3,
        'page': .3, 'shrink': .3, 'zoom': .3, 'mmm': .15, 'sproing': .25}
snd = np.zeros(NW)
for e in EV:
    x = SFX[e['type']](e); add(fx, x, e['t'], 1., e.get('pan', 0))
    if e['type'] in VERB: s0 = int(e['t'] * SR); k = min(len(x), NW - s0); snd[s0:s0 + k] += x[:k] * VERB[e['type']]
fx += T.verb(snd, 1.1) * .35


# ---------- vòng lặp: phần dư sau 22 s cộng vào đầu phim, rồi cắt về đúng độ dài ----------
for k in ('mus', 'fx'):
    b = B[k]; tail = b[N0:].copy(); b[:len(tail)] += tail; B[k] = b[:N].copy()
mus, fx = B['mus'], B['fx']


# ---------- nền: gió vườn suốt phim ----------
amb = B['amb']
d = DUR; tt = t_(d)
add(amb, (lp(brown(d), 700) * .5 + bp(noise(d), 2000, 6000) * .01) * np.minimum(1, tt / .05) * .06, 0, 1., 0)


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
mus *= .075 / max(rms(mus), 1e-9)               # nhạc thấp hơn giọng khoảng 10 dB
fx *= .55 / max(np.abs(fx).max(), 1e-9)
from scipy.ndimage import maximum_filter1d, uniform_filter1d
ve = uniform_filter1d(maximum_filter1d(np.abs(vox), int(.05 * SR)), int(.25 * SR))
B['mus'] = mus = T.duck(mus, ve, .82, .55)          # nhạc nhường giọng: dải chữ 300–4000 Hz −15 dB, bass/kick/lớp sáng −7 dB
B['fx'] = fx = T.duck(fx, ve, .6, .3)                 # tiếng động nhường giọng: dải chữ −8 dB, phần còn lại −3 dB
mix = B['mus'] + B['fx'] + B['amb'] + B['vox']
mix = np.tanh(mix * 1.1) / 1.1
# khâu cuối: chặn đỉnh thật ở độ to + 12,3 dB, để loudnorm của mux.sh nâng tuyến tính lên −14 LUFS mà đỉnh vẫn ≤ −1,2 dBTP
mix, I_mix, ceil_db = T.master(mix); print(f'master: {I_mix:.1f} LUFS, true-peak ceiling {ceil_db:.1f} dBFS')
# mép đầu file: fade-in 20 ms. Khung đầu là phách nối vòng lặp nên mẫu đầu không bằng 0, và bộ mã AAC vọt đỉnh ở mép file
# (đo được −0,4 dBTP ở 13 ms, trong khi loudnorm ra −1,5). 20 ms chỉ làm mềm đầu cú kick; trình phát khởi động lại khi lặp chứ không nối liền từng mẫu.
nf = int(.02 * SR); mix[:nf] *= np.linspace(0, 1, nf)[:, None]
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR, subtype='PCM_24')
for k in ('mus', 'fx', 'vox'): sf.write(os.path.join(HERE, 'out', f'stem_{k}.wav'), B[k].astype(np.float32), SR, subtype='PCM_16')   # để kiểm lời có bị che không

from scipy.signal import welch
f, p = welch(mix.mean(1), SR, nperseg=8192); low = p[(f >= 20) & (f < 120)].mean(); rest = p[(f >= 120) & (f < 8000)].mean()
print(f'low band 20–120 Hz vs 120–8000 Hz: {10 * np.log10(low / rest):+.1f} dB (per-Hz density)')
for name, a, b in (('mở', 0, 2.5), ('soi', 2.5, 10.3), ('ồ', 10.3, 14), ('sổ', 14, 18), ('gag', 18, 22)):
    i, j = int(a * SR), int(b * SR)
    print(f'{name:5s}', '  '.join(f'{k}={20 * np.log10(max(rms(B[k][i:j]), 1e-9)):6.1f}' for k in ('mus', 'fx', 'amb', 'vox')), 'dBFS rms')
print('out/mix.wav', f'{len(mix) / SR:.2f} s')
