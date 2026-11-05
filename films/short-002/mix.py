"""Âm thanh của SHORT-002 → out/mix.wav (48 kHz stereo): nhạc tổng hợp theo lưới 120 BPM, tiếng động theo events.json, nền, giọng.
python mix.py   (cần timeline.json + voice/*.wav từ tools/lines.mjs và core/tts/tts.py, events.json từ core/render/events.mjs)
Nhạc cụ, tiếng ngân của Flutter: _shared/audio/band.py; tiếng động hoạt hình: _shared/audio/toon.py (dùng chung cho mọi tập).
Không dùng mẫu âm thanh của bên thứ ba. Bảng cue âm thanh (hình ↔ tiếng): SOUND.md.
Phim phát vòng lặp: ba nốt marimba cuối phim (21,0 · 21,5) nối với nốt đầu phim (0,0) và cú dậm chân ở 0,5 s;
mọi đuôi tiếng vượt quá 22 s (còi rơi, vang, nốt ngân) được gấp về đầu phim, nên điểm lặp không bị ngắt."""
import os, sys, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio')); sys.path.insert(0, os.path.join(LIB, '_shared', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, whoosh, thump, ding, pop, click, step, compress, limit, add
from band import fade, mf, pluck, marimba, bassn, kick, clap, hat, shaker, bell, horn, pad, riser, glide, mmm
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


# ---------- nhạc: mô-típ marimba của bộ "Giác quan", cùng hoà âm với SHORT-001 ----------
CH = [(48, [60, 64, 67]), (43, [59, 62, 67]), (45, [57, 60, 64]), (41, [57, 60, 65])]
MEL = [[76, 0, 79, 0, 76, 74, 72, 0], [74, 0, 79, 0, 74, 0, 71, 0], [72, 0, 76, 0, 81, 79, 76, 0], [77, 0, 81, 0, 79, 0, 76, 0]]
def parts(bar):
    if bar == 0: return {'clap', 'sparse', 'tiptoe'}                          # móc: bass nhón chân + mõ gỗ sau cú dậm 0,5 s
    if bar == 1: return {'kick1', 'bass', 'strum'}                            # không shaker: tiếng xì ngay sau "snack?" bị nghe thành "snacks"
    if bar <= 3: return {'kick', 'bass', 'strum', 'mel', 'hat', 'clap', 'wings'}
    if bar == 4: return {'kick', 'strum', 'mel', 'wings'}                     # tia "ngọt" chạy lên: chuông nằm ở tiếng động
    if bar == 5: return {'strum', 'melsparse', 'kick1'}
    if bar == 6: return {'wonder'}                                           # nhịp "ồ": chỉ một lớp pad mỏng, tiếng giày nổi lên
    if bar == 7: return {'kick1', 'strum', 'mel', 'wings'}                   # sổ: thưa dưới câu của Albie (giọng trầm dễ bị bè trầm che)
    if bar == 8: return {'kick1', 'strum', 'clap', 'wings'}
    if bar == 9: return {'strum', 'wings', 'clap', 'kick1'}                  # gag: rút bè trầm
    return {'sparse'}
mus = B['mus']
HIT_STOMP, HIT_IRIS = .5, at(6, 3)
def M(x, t, g=1., pan=0.): add(mus, x, t, g, pan)
for bar in range(11):
    P = parts(bar); root, tones = CH[bar % 4]; t0 = at(bar)
    for b in range(4):
        tb = t0 + b * BEAT
        if 'kick' in P: M(kick(), tb, 1.2)
        if 'kick1' in P and b == 0: M(kick(.7), tb, .7)
        if 'clap' in P and b in (1, 3): M(clap(), tb, .7, .1)
        if 'hat' in P: M(hat(), tb + BEAT / 2, .8, .35)
        if 'bass' in P and b in (0, 2, 3): M(bassn(root + (12 if b == 3 else 0)), tb, 1.35)
        if 'strum' in P and b in (1, 3):
            for k, n in enumerate(tones): M(pluck(n), tb + k * .014, .55, -.35 + .35 * k)
        if 'sparse' in P and b == 0: M(pluck(tones[0] + 12, 1.2), tb, .55)
        if 'wings' in P:
            for s in range(4): M(shaker(.9 if s == 0 else .5), tb + s * BEAT / 4, .8, -.45)
    if 'tiptoe' in P:                           # bass gảy ngắn từng móc đơn + mõ gỗ phách lẻ (không có tiếng xì, để giữ chữ "socks", "snack")
        for i, n in enumerate((55, 52, 55, 48, 50, 52)):
            M(bassn(n, .16), t0 + BEAT * 1.5 + i * BEAT / 2, .9)
        for i in range(6): M(T.block(84 if i % 2 else 79, .6), t0 + BEAT * 1.25 + i * BEAT / 2, .3, .3)
    if 'wonder' in P: M(pad(tones + [root + 12, root + 24], BAR + .6), t0 - .1, 1.3)
    if 'mel' in P:
        for i, n in enumerate(MEL[bar % 4]):
            if n: M(marimba(n), t0 + i * BEAT / 2, .8, .2)
    if 'melsparse' in P:
        for i in (0, 4):
            n = MEL[bar % 4][i]
            if n: M(marimba(n, .9), t0 + i * BEAT / 2, .7, .2)
# vòng lặp: hai nốt cuối phim + nốt đầu phim đi lên, rồi chân dậm ở phách 1
for t, n in ((at(10, 2), 67), (at(10, 3), 69), (0., 71)): M(marimba(n, .5), t, .65, .2)
# phách đầu phim: kick + bass + một phím glock cao, để giây đầu tiên đã có nhịp; cú dậm 0,5 s là điểm giải (C)
M(kick(.8), 0., .8); M(bassn(43, .3), 0., 1.0); M(T._ting(mf(96), .5), 0., .25, .4)
M(kick(), HIT_STOMP, 1.1); M(bassn(36, .5), HIT_STOMP, 1.2); M(marimba(72, .6), HIT_STOMP, .8, .2); M(marimba(76, .6), HIT_STOMP + .01, .5, .2)
# vào sổ: chuỗi marimba lên dần trong lúc kính nở ra, chạm 14,0 bằng kick + chũm chọe mềm
for i, n in enumerate((72, 74, 76, 79)): M(marimba(n, .35), HIT_IRIS + i * BEAT / 4, .6 + .1 * i, .2)
M(kick(.9), at(7), .9); M(T.cymbal(1.6, .5), at(7), .35, -.2)
# nhịp "ồ": một nốt khi Miss Loupe nhún vai
M(marimba(79, .8), 13.0, .6, .3); M(marimba(72, .8), 13.25, .5, .3)


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
    'swishout': lambda e: T.swish(.5, .45, 400, 2800, False),
    'push': lambda e: T.swish(.8, .3, 250, 1500, True, .75, .6),
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
    'sparkle': lambda e: mixl(*(np.pad(bell(n, .6, .9), (int(i * .07 * SR), 0)) for i, n in enumerate((88, 91, 95)))),
    'bubbles': lambda e: bubbles(e.get('d', 1.)),
    'chime': lambda e: mixl(ding(.55) * .5, bell(84, .7)),
    'signal': lambda e: signal(e.get('d', .9)),
    'slide': lambda e: glide(500, 1400, e.get('d', .8), .3, .02),
    'slurp': lambda e: mixl(glide(900, 380, .35, .3), bp(noise(.35), 600, 2200) * np.sin(np.pi * t_(.35) / .35) * .15),
    'squeak': lambda e: squeak(e.get('v', .5)),
    'boing': lambda e: glide(260, 520, .35, .3 * e.get('v', .5) / .5, .06),
    'stamp': lambda e: stamp(),
    'flutter': lambda e: wings(e.get('d', .6)),
    'land': lambda e: mixl(step(.5) * .6, np.pad(glide(320, 640, .25, .25, .04), (int(.02 * SR), 0))),
    'mmm': lambda e: mmm(1.),
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
