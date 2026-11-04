"""Âm thanh của phim → out/mix.wav (48 kHz stereo): nhạc tổng hợp theo lưới 120 BPM, tiếng động theo events.json, nền, giọng.
python mix.py   (cần timeline.json + voice/*.wav từ tools/lines.mjs và tts_zh.py, events.json từ core/render/events.mjs)
Không dùng mẫu âm thanh của bên thứ ba: mọi nốt và tiếng động được tổng hợp ở đây hoặc bằng core/audio/sfx.py."""
import os, sys, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, whoosh, thump, ding, pop, click, step, compress, limit, add

TL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))
EV = json.load(open(os.path.join(HERE, 'events.json'), encoding='utf-8'))['ev']
BEAT = 60 / TL['bpm']; BAR = BEAT * 4; DUR = TL['dur']; N = int((DUR + .05) * SR)
at = lambda bar, beat=0: (bar * 4 + beat) * BEAT
mf = lambda m: 440 * 2 ** ((m - 69) / 12)
rng = np.random.default_rng(5)
B = {k: np.zeros((N, 2)) for k in ('mus', 'fx', 'amb', 'vox')}


def mixl(*xs):                                  # cộng các đoạn khác độ dài
    n = max(len(x) for x in xs); return sum(np.pad(x, (0, n - len(x))) for x in xs)
def fade(x, a=.004, r=.03):
    x = x.copy(); n1, n2 = max(1, int(a * SR)), max(1, int(r * SR)); x[:n1] *= np.linspace(0, 1, n1); x[-n2:] *= np.linspace(1, 0, n2); return x


# ---------- nhạc cụ (tổng hợp) ----------
def pluck(m, d=.7, v=1.):                       # ukulele: hoà âm tắt dần + tiếng móng gảy
    f = mf(m); tt = t_(d)
    x = sum(np.sin(2 * np.pi * f * k * tt + k) * np.exp(-tt * (2.5 + k * 2.0)) / k for k in range(1, 8))
    return fade(x + hp(noise(d), 1500) * env_exp(d, .003) * .3) * v * .35
def marimba(m, d=.6, v=1.):
    f = mf(m); tt = t_(d)
    x = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 5) + .35 * np.sin(2 * np.pi * 3.93 * f * tt) * np.exp(-tt * 20) + .12 * np.sin(2 * np.pi * 9.2 * f * tt) * np.exp(-tt * 45)
    return fade(x, .002) * v * .45
def bassn(m, d=.45, v=1.):                      # bass gảy, có hoà âm 2–3 để nghe được trên loa nhỏ
    f = mf(m); tt = t_(d)
    return fade((np.sin(2 * np.pi * f * tt) + .45 * np.sin(4 * np.pi * f * tt) + .25 * np.sin(6 * np.pi * f * tt)) * np.exp(-tt * 4), .006, .05) * v * .5
def buzzbass(m, d=.45, v=1.):                   # tiếng ong vo ve làm bè trầm
    f = mf(m); tt = t_(d); ph = np.cumsum(f * (1 + .012 * np.sin(2 * np.pi * 7 * tt))) / SR
    return fade(lp(2 * (ph % 1) - 1, 1100) * (.8 + .2 * np.sin(2 * np.pi * 31 * tt)) * np.exp(-tt * 2.5), .01, .06) * v * .36
def kick(v=1.):
    d = .32; tt = t_(d); f = 48 + 110 * np.exp(-tt * 28)
    return np.tanh(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 8) * 1.6) * v * .8
def clap(v=1.):
    x = np.zeros(int(.25 * SR))
    for k, dt in enumerate((0, .011, .022)):
        s = int(dt * SR); b = bp(noise(.2), 900, 3200) * env_exp(.2, .012 if k < 2 else .05); x[s:s + len(b)] += b
    return norm(x) * v * .45
def hat(v=1.): return hp(noise(.06), 7000) * env_exp(.06, .01) * v * .25
def shaker(v=1.): d = .09; return bp(noise(d), 3500, 9000) * np.sin(np.pi * t_(d) / d) ** 2 * v * .2
def bell(m, v=1., d=1.4):
    f = mf(m); tt = t_(d)
    return fade(sum(a * np.sin(2 * np.pi * f * r * tt) * np.exp(-tt * k) for r, a, k in ((1, 1, 2.2), (2.76, .4, 5), (5.4, .2, 9))), .002, .1) * v * .3
def horn(m, d=.4, v=1.):                        # kèn đồ chơi
    f = mf(m); tt = t_(d); ph = 2 * np.pi * f * tt + .15 * np.sin(2 * np.pi * 5.5 * tt) * (tt > .12)
    return fade(lp(sum(np.sin(ph * k) / k for k in (1, 3, 5, 7)), 2600) * np.minimum(1, tt / .02) * np.exp(-tt * 1.5), .005, .06) * v * .32
def pad(ms, d, v=1.):
    tt = t_(d); x = sum(np.sin(2 * np.pi * mf(m) * tt) + .3 * np.sin(4 * np.pi * mf(m) * tt) for m in ms)
    return lp(x, 2000) * np.minimum(1, tt / .4) * np.minimum(1, (d - tt) / .5) * v * .07
def chirp(v=1.):                                # tiếng dế: ba xung 4,6 kHz
    x = np.zeros(int(.12 * SR)); tt = t_(.022); b = np.sin(2 * np.pi * 4600 * tt) * np.sin(np.pi * tt / .022) ** 2
    for k in range(3): s = int(k * .034 * SR); x[s:s + len(b)] += b
    return x * v * .16
def riser(d=1., v=1.):
    n = noise(d); out = np.zeros_like(n)
    for i in range(0, len(n), 960):
        hi = min(len(n), i + 960); f = 700 + 5000 * (i / len(n)) ** 2; out[i:hi] = bp(n[max(0, i - 2000):hi], f * .8, f * 1.2)[-(hi - i):]
    return out * (t_(d) / d) ** 2 * v * .3
def glide(f0, f1, d, v=1., vib=0.):             # còi trượt / lò xo
    tt = t_(d); f = f0 * (f1 / f0) ** (tt / d) * (1 + vib * np.sin(2 * np.pi * 9 * tt))
    return fade(np.sin(2 * np.pi * np.cumsum(f) / SR), .005, .05) * v


# ---------- nhạc ----------
CH = [(48, [60, 64, 67]), (43, [59, 62, 67]), (45, [57, 60, 64]), (41, [57, 60, 65])]   # C G Am F, một hợp âm mỗi ô nhịp
MEL = [[76, 0, 79, 0, 76, 74, 72, 0], [74, 0, 79, 0, 74, 0, 71, 0], [72, 0, 76, 0, 81, 79, 76, 0], [77, 0, 81, 0, 79, 0, 76, 0]]
def parts(bar):
    if bar <= 1: return {'clap', 'sparse'}
    if bar == 2: return {'kick', 'bass', 'strum', 'horn', 'clap'}
    if bar <= 7: return {'kick', 'bass', 'strum', 'mel', 'hat', 'clap', 'wings'}               # bướm: lớp cánh
    if bar <= 10: return {'strum', 'chirp', 'melsparse', 'kick1'}                               # dế: bỏ bè trầm
    if bar <= 12: return {'kick', 'bass', 'strum', 'mel', 'clap', 'chirp'}
    if bar == 13: return {'sparse', 'drone'}
    if bar <= 15: return {'kick', 'buzz', 'strum', 'mel', 'clap', 'hat'}                        # ong: bè trầm vo ve
    if bar <= 18: return {'pad', 'arp'} | ({'kick1'} if bar >= 17 else set())                   # bản đồ: mở rộng
    if bar <= 20: return {'kick', 'buzz', 'strum', 'mel', 'clap', 'wings', 'chirp'}            # cả ba côn trùng cùng chơi
    return set()
mus = B['mus']
def M(x, t, g=1., pan=0.): add(mus, x, t, g, pan)
for bar in range(22):
    P = parts(bar); root, tones = CH[bar % 4]; t0 = at(bar)
    for b in range(4):
        tb = t0 + b * BEAT
        if 'kick' in P: M(kick(), tb, 1.2)
        if 'kick1' in P and b == 0: M(kick(.7), tb, .7)
        if 'clap' in P and b in (1, 3): M(clap(), tb, .7, .1)
        if 'hat' in P: M(hat(), tb + BEAT / 2, .8, .35)
        if 'bass' in P and b in (0, 2, 3): M(bassn(root + (12 if b == 3 else 0)), tb, 1.35)
        if 'buzz' in P: M(buzzbass(root + (7 if b % 2 else 0)), tb, 1.25)
        if 'strum' in P and b in (1, 3):
            for k, n in enumerate(tones): M(pluck(n), tb + k * .014, .55, -.35 + .35 * k)
        if 'sparse' in P and b == 0: M(pluck(tones[0] + 12, 1.2), tb, .55)
        if 'chirp' in P: M(chirp(), tb, .9, .55)
        if 'wings' in P:
            for s in range(4): M(shaker(.9 if s == 0 else .5), tb + s * BEAT / 4, .8, -.45)
    if 'mel' in P:
        for i, n in enumerate(MEL[bar % 4]):
            if n: M(marimba(n), t0 + i * BEAT / 2, .8, .2)
    if 'melsparse' in P:
        for i in (0, 4):
            n = MEL[bar % 4][i]
            if n: M(marimba(n, .9), t0 + i * BEAT / 2, .7, .2)
    if 'pad' in P: M(pad(tones + [root + 12], BAR + .4), t0, 1.)
    if 'arp' in P:
        for i in range(8): M(bell(tones[i % 3] + 12 + (12 if i >= 4 else 0), .5, .9), t0 + i * BEAT / 2, .55, -.5 + i / 7)
    if 'drone' in P: M(buzzbass(root, BAR * .75, .7), t0, .6)
# mở: câu hỏi đi lên, rồi bàn chân giẫm trúng phách 4
for i, n in enumerate((67, 69, 71)): M(marimba(n, .5), at(0, i), .6, .2)
# tựa: kèn đồ chơi theo từng chữ
for b, n, d in ((0, 72, .25), (.5, 76, .25), (1, 79, .4), (2, 84, .9)): M(horn(n, d), at(2, b), .9)
M(bell(96, .6), at(2, 1), .6, .4)
# trước bản đồ: riser lên đến lúc chuyển sang sổ
M(riser(2.0, .8), at(18, 2) - 2.0, .6)
# kết: hợp âm C dài cùng lúc Miss Loupe bật cười
tf = at(22, 1)
for k, n in enumerate((60, 64, 67, 72)): M(pluck(n, 1.4), tf + k * .02, .6, -.3 + .2 * k)
for n in (72, 76, 79): M(horn(n, 1.2, .6), tf, .5)
M(bell(84, .8, 1.4), tf, .7); M(bassn(36, 1.4), tf, 1.); M(kick(), tf, .9)
# khoảng lặng thật: cắt hết nhạc trước đáp án
gate = np.ones(N)
for a, b in ((at(10, 2), at(11)), (at(13, 2), at(14)), (at(21), tf)):
    i, j = int(a * SR), int(b * SR); gate[i:j] = 0; r = int(.012 * SR)
    gate[max(0, i - r):i] = np.linspace(1, 0, min(r, i)); gate[j - r:j] = np.linspace(0, 1, r)   # mở lại ngay trên phách
mus *= gate[:, None]


# ---------- tiếng động theo sự kiện ----------
fx = B['fx']
def wings(d):                                   # cánh bướm: những nhịp gió mềm
    tt = t_(d); return lp(noise(d), 1400) * (.5 + .5 * np.sin(2 * np.pi * 12 * tt)) ** 2 * np.sin(np.pi * tt / d) * .35
def bubbles(d):
    x = np.zeros(int(d * SR))
    for k in range(int(d * 9)):
        s = int(rng.uniform(0, d - .06) * SR); b = glide(rng.uniform(700, 1400), rng.uniform(1500, 2400), .05, .25); x[s:s + len(b)] += b
    return x
def buzzer(): tt = t_(.32); return fade(lp(np.sign(np.sin(2 * np.pi * 140 * tt)), 1600) * .3, .005, .04)
def stamp(): return mixl(thump(.8, 95) * .7, hp(noise(.07), 1200) * env_exp(.07, .012) * .6)
def buzzby(d):
    tt = t_(d); f = 230 * (1 + .05 * np.sin(2 * np.pi * 7 * tt)) * (1.06 - .12 * tt / d); ph = np.cumsum(f) / SR
    return lp(2 * (ph % 1) - 1, 1600) * np.sin(np.pi * tt / d) ** 2 * .28
SFX = {
    'stomp': lambda e: mixl(thump(1., 58), lp(noise(.3), 900) * env_exp(.3, .06) * .7),
    'tick': lambda e: click(1.5, e.get('v', .4)) * .7,
    'whoosh': lambda e: whoosh(e.get('d', .35), e.get('v', .5)),
    'flutter': lambda e: wings(e.get('d', .6)),
    'iris': lambda e: np.concatenate([whoosh(.5, .45), pop(.5)]),
    'pop': lambda e: pop(e.get('v', .6)) * .55,
    'sparkle': lambda e: mixl(*(np.pad(bell(n, e.get('v', .6), .9), (int(i * .07 * SR), 0)) for i, n in enumerate((88, 91, 95)))),
    'sticker': lambda e: stamp() * .8,
    'land': lambda e: mixl(step(.6) * .7, np.pad(glide(320, 640, .25, .25, .04), (int(.02 * SR), 0))),
    'zoom': lambda e: riser(.45, 1.),
    'bubbles': lambda e: bubbles(e.get('d', 1.)),
    'slide': lambda e: glide(500, 1400, e.get('d', 1.), .3, .02),
    'chime': lambda e: mixl(ding(.55) * .5, bell(84, .7)),
    'buzzer': lambda e: buzzer(),
    'reveal': lambda e: mixl(bell(84, .9), bell(91, .6)),
    'stamp': lambda e: stamp(),
    'pullback': lambda e: mixl(whoosh(1.1, .7) * .8, lp(noise(1.1), 300) * np.sin(np.pi * t_(1.1) / 1.1) * .2),
    'buzzby': lambda e: buzzby(e.get('d', 1.5)),
    'tap': lambda e: step(.7),
    'slurp': lambda e: mixl(glide(900, 380, .35, .3), bp(noise(.35), 600, 2200) * np.sin(np.pi * t_(.35) / .35) * .15),
    'boing': lambda e: glide(260, 520, .35, .3, .06),
}
missing = sorted({e['type'] for e in EV} - SFX.keys())
if missing: sys.exit(f'mix.py: no sound for event types {missing}')
for e in EV:
    add(fx, SFX[e['type']](e), e['t'], 1., e.get('pan', 0))
add(fx, riser(.5, .8), 22.0 - .5, .7)           # vòng âm hút vào tai dế: dâng lên đúng đáp án (nằm trong khoảng lặng của nhạc)


# ---------- nền ----------
amb = B['amb']
def bed(kind, d):
    tt = t_(d); e = np.minimum(1, tt / .3) * np.minimum(1, (d - tt) / .3)
    if kind == 'garden': x = lp(brown(d), 700) * .5 + bp(noise(d), 2000, 6000) * .01
    elif kind == 'night': x = lp(brown(d), 280) * .7
    elif kind == 'hive':
        ph1, ph2 = np.cumsum(np.full(len(tt), 110.)) / SR, np.cumsum(np.full(len(tt), 113.)) / SR
        x = lp((ph1 % 1) + (ph2 % 1) - 1, 450) * (.8 + .2 * np.sin(2 * np.pi * 4 * tt)) * .6
    else: x = bp(noise(d), 500, 2500) * (.6 + .4 * np.sin(2 * np.pi * .4 * tt)) * .4
    return x * e * .06
# tiếng đêm và tiếng tổ vào sớm hơn hình 0,6 s (J-cut)
for kind, a, b in (('garden', 6.0, 15.4), ('night', 15.4, 25.4), ('hive', 25.4, 32.2), ('wind', 32.0, 38.2), ('garden', 38.0, 42.0)):
    add(amb, bed(kind, b - a), a, 1., 0)


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
mus *= (1 - .55 * np.clip(ve / .25, 0, 1))[:, None]   # nhường giọng ~7 dB
mix = B['mus'] + B['fx'] + B['amb'] + B['vox']
mix = np.tanh(mix * 1.1) / 1.1
mix = np.stack([limit(mix[:, 0], .95), limit(mix[:, 1], .95)], 1)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR, subtype='PCM_24')

# kiểm tra: bè trầm 20–120 Hz so với phần còn lại; lớp nào có mặt ở từng đoạn (bảng thiết kế âm thanh)
from scipy.signal import welch
f, p = welch(mix.mean(1), SR, nperseg=8192); low = p[(f >= 20) & (f < 120)].mean(); rest = p[(f >= 120) & (f < 8000)].mean()
print(f'low band 20–120 Hz vs 120–8000 Hz: {10 * np.log10(low / rest):+.1f} dB (per-Hz density)')
for name, a, b in (('mở', 0, 4), ('tựa', 4, 6), ('bướm', 6, 16), ('dế', 16, 26), ('ong', 26, 32), ('bản đồ', 32, 38), ('sổ', 38, 42), ('kết', 42, 46)):
    i, j = int(a * SR), int(b * SR)
    print(f'{name:7s}', '  '.join(f'{k}={20 * np.log10(max(rms(B[k][i:j]), 1e-9)):6.1f}' for k in ('mus', 'fx', 'amb', 'vox')), 'dBFS rms')
print('out/mix.wav', f'{len(mix) / SR:.2f} s')
