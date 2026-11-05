"""Âm thanh của SHORT-001 → out/mix.wav (48 kHz stereo): nhạc tổng hợp theo lưới 120 BPM, nhạc hiệu chung, tiếng động theo events.json, nền, giọng.
python mix.py   (cần timeline.json + voice/*.wav từ tools/lines.mjs và core/tts/tts.py, events.json từ core/render/events.mjs)
Nhạc cụ và nhạc hiệu: _shared/audio/band.py; tiếng động hoạt hình: _shared/audio/toon.py (dùng chung cho mọi tập).
Không dùng mẫu âm thanh của bên thứ ba. Bảng cue âm thanh (hình ↔ tiếng): SOUND.md."""
import os, sys, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio')); sys.path.insert(0, os.path.join(LIB, '_shared', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, whoosh, thump, ding, pop, click, step, compress, limit, add
from band import fade, mf, pluck, marimba, bassn, buzzbass, kick, clap, hat, shaker, bell, horn, pad, chirp, riser, glide, jingle
import toon as T

TL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))
EV = json.load(open(os.path.join(HERE, 'events.json'), encoding='utf-8'))['ev']
BEAT = 60 / TL['bpm']; BAR = BEAT * 4; DUR = TL['dur']; N = int((DUR + .05) * SR)
at = lambda bar, beat=0: (bar * 4 + beat) * BEAT
rng = np.random.default_rng(5)
B = {k: np.zeros((N, 2)) for k in ('mus', 'fx', 'amb', 'vox')}
def mixl(*xs):                                  # cộng các đoạn khác độ dài
    n = max(len(x) for x in xs); return sum(np.pad(x, (0, n - len(x))) for x in xs)


# ---------- nhạc ----------
CH = [(48, [60, 64, 67]), (43, [59, 62, 67]), (45, [57, 60, 64]), (41, [57, 60, 65])]   # C G Am F, một hợp âm mỗi ô nhịp
MEL = [[76, 0, 79, 0, 76, 74, 72, 0], [74, 0, 79, 0, 74, 0, 71, 0], [72, 0, 76, 0, 81, 79, 76, 0], [77, 0, 81, 0, 79, 0, 76, 0]]
def parts(bar):
    if bar == 0: return {'clap', 'sneak'}                                                        # móc: bass nhón chân đi lên từng nửa cung, chạm cú giẫm 1,5 s
    if bar == 1: return {'kick', 'clap', 'bounce', 'strum'}                                     # sau cú giẫm: nhịp nảy, không có tiếng xì dưới "Butterflies can!"
    if bar == 2: return set()                                                                    # nhạc hiệu chơi một mình
    if bar == 3: return {'kick1', 'bass', 'strum', 'wings'}
    if bar <= 8: return {'kick', 'bass', 'strum', 'mel', 'hat', 'clap', 'wings'}               # bướm: lớp cánh
    if bar <= 11: return {'strum', 'chirp', 'melsparse', 'kick1'}                               # dế: bỏ bè trầm
    if bar <= 13: return {'kick', 'bass', 'strum', 'mel', 'clap', 'chirp'}
    if bar == 14: return {'sparse', 'drone'}
    if bar <= 16: return {'kick', 'buzz', 'strum', 'mel', 'clap', 'hat'}                        # ong: bè trầm vo ve
    if bar <= 19: return {'pad', 'arp'} | ({'kick1'} if bar >= 18 else set())                   # bản đồ: mở rộng
    if bar == 20: return {'kick1', 'pad'}                                                       # sổ: Albie còn ngủ, sticker dán
    if bar <= 23: return {'kick', 'buzz', 'strum', 'mel', 'clap', 'wings', 'chirp'}            # sổ: cả ba côn trùng cùng chơi
    if bar == 24: return {'tiptoe'}                                                             # kết: Flutter rón rén lại gần, nhạc nhón chân đến tiếng cười
    return set()
mus = B['mus']
# hai khoảng lặng trước đáp án: không gõ nốt mới, nốt cũ ngân hết tự nhiên (không cắt cụt), tiếng nền vẫn chạy
REST = ((at(11, 2), at(12)), (at(14, 2), at(15)))
def M(x, t, g=1., pan=0.):
    if any(a - .02 <= t < b - .02 for a, b in REST): return
    add(mus, x, t, g, pan)
for bar in range(25):
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
        if 'bounce' in P: M(bassn((43, 50, 43, 55)[b], .22), tb, 1.1); M(T.block(84, .5), tb + BEAT / 2, .3, .3)
    if 'sneak' in P:                            # móc: bass gảy ngắn đi lên từng nửa cung (C → F) như bàn chân đang rình, mõ gỗ phách lẻ
        M(kick(.8), t0, .6)
        for i, n in enumerate((48, 49, 50, 51, 52, 53)): M(bassn(n, .16), t0 + i * BEAT / 2, .6); M(T.block(79 + i, .5), t0 + i * BEAT / 2 + BEAT / 4, .14, .3)
    if 'tiptoe' in P:                           # kết: rón rén, nhỏ dần cho câu "Hey... is it tasting me?"
        for i in range(10): M(bassn((48, 55, 52, 55)[i % 4], .14), t0 + i * BEAT / 2, .7 - .03 * i); M(T.block(84 if i % 2 else 79, .4), t0 + i * BEAT / 2 + BEAT / 4, .2, .3)
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
# mở: câu hỏi đi lên, rồi bàn chân giẫm trúng phách 4 = cú đánh của cả ban nhạc (kick + bass + hợp âm + chũm chọe mềm)
for i, n in enumerate((67, 69, 71)): M(marimba(n, .5), at(0, i), .6, .2)
M(T._ting(mf(96), .5), 0., .15, .4)
ts = at(0, 3); M(kick(), ts, 1.1); M(bassn(36, .6), ts, 1.3); M(T.cymbal(1.4, .5), ts, .3, .2)
for k, n in enumerate((60, 64, 67, 72)): M(pluck(n, .9), ts + k * .012, .6, -.3 + .2 * k)
# vào tựa: marimba chạy lên trong lúc kính nở, nhạc hiệu chạm 4,0
for i, n in enumerate((67, 69, 72, 74)): M(marimba(n, .3), at(1, 3) + i * BEAT / 4, .5 + .08 * i, .2)
# phách đầu các cảnh mở: chũm chọe mềm, mỗi lần một độ sáng (vườn, tai dế, điệu nhảy, bản đồ)
for t, g, br in ((at(3), .22, 5000), (at(12), .28, 4500), (at(15), .32, 4000), (at(17), .25, 5500)): M(T.cymbal(1.6, 1., br), t, g, .15)
# vào cảnh kết: bốn nốt đi xuống, như nhón chân bước vào
for i, n in enumerate((79, 76, 74, 72)): M(marimba(n, .3), at(23, 3) + i * BEAT / 4, .55, .2)
# nhạc hiệu 2 s (giống hệt mọi tập), đúng ô nhịp 2
J = jingle(); s = int(at(2) * SR); e = min(N, s + len(J)); mus[s:e] += J[:e - s] * 1.15
# trước cảnh sổ: riser dâng suốt lúc hoa nở trùm màn hình, chạm 40,0
M(riser(2.0, .8), at(20) - 2.0, .5)
# kết: hợp âm C dài cùng lúc Miss Loupe bật cười
tf = at(25, 1)
for t, n in ((tf - .25, 74), (tf - .125, 76)): M(marimba(n, .3), t, .5, .2)   # hai nốt dẫn vào tiếng cười, lấp khoảng hụt sau chữ "me?"
for k, n in enumerate((60, 64, 67, 72)): M(pluck(n, 1.4), tf + k * .02, .6, -.3 + .2 * k)
for n in (72, 76, 79): M(horn(n, 1.2, .6), tf, .5)
M(bell(84, .8, 1.4), tf, .7); M(bassn(36, 1.4), tf, 1.); M(kick(), tf, .9); M(T.cymbal(1.8, 1.), tf, .28, -.15)


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
def roll(d):                                    # viên tròn của Rollo: lộc cộc nhỏ mỗi vòng quay + tiếng lăn trầm
    x = lp(brown(d), 220) * .5 * np.minimum(1, t_(d) / .4) * np.minimum(1, (d - t_(d)) / .4)
    for k in range(int(d / .42)):
        s = int((k * .42 + .1) * SR); b = click(.55, .5) * .5; x[s:s + len(b)] += b[:len(x) - s]
    return x * .7
def pages(d):                                   # mép sticker và trang giấy lật phật
    x = np.zeros(int(d * SR))
    for k in range(4):
        s = int(k * d / 4 * SR); b = bp(noise(.05), 2500, 7000) * env_exp(.05, .012) * .5; x[s:s + len(b)] += b[:len(x) - s]
    return x
def stampN(n):                                  # ba sticker liên tiếp: tiếng dán cao dần (1-2-3)
    if n is None: return stamp()
    return mixl(thump(.8, 95 + 18 * n) * .7, hp(noise(.07), 1200) * env_exp(.07, .012) * .6, T._ting(mf((79, 84, 88)[n]), .35, .35))
SFX = {
    'stomp': lambda e: mixl(thump(1., 58), lp(noise(.3), 900) * env_exp(.3, .06) * .7),
    'pops': lambda e: T.pops(e.get('n', 6), e.get('step', .035), e.get('m', 84), e.get('v', .5)),
    'whistle': lambda e: T.whistle(e['f0'], e['f1'], e['d'], e.get('v', .25)),
    'windup': lambda e: T.windup(e.get('d', .4), .3),
    'drop': lambda e: T.swish(e.get('d', .18), .25, 1800, 6000, True, .95, .1),
    'splat': lambda e: T.splat(.6, 2),
    'wobble': lambda e: T.wobble(110, .7, .3, 7, .2),
    'plip': lambda e: T.plip(e.get('f', 1200), .4),
    'boop': lambda e: mixl(T.bubble(360, .45, .08, 1.8), T.plip(700, .2)),                           # ngón chân chạm thử kem (HOOK.md)
    'swipe': lambda e: T.swipe(e.get('d', .3), e.get('v', .32), True, e.get('lo', 1500), e.get('hi', 5500)),
    'zip': lambda e: T.zip_(.22, 500, 2600, .28),
    'swell': lambda e: mixl(T.swell(.5, .55, 76, 100), T.revcymbal(.5, .22)),                          # chạm 4,0
    'swish': lambda e: T.swish(e.get('d', .45), e.get('v', .4), e.get('lo', 350), e.get('hi', 2600), e.get('up', True)),
    'swirl': lambda e: mixl(T.swirl(e.get('d', .5), .45, 4, 800, 3200), T.gliss(84, 100, e.get('d', .5) * .8, .3, 'ting')),
    'badge': lambda e: mixl(T.bubble(600 + 120 * e['n'], .45, .08), np.pad(T.ding((84, 88, 91)[e['n'] - 1], .4, .8), (int(.03 * SR), 0))),
    'punch': lambda e: T.swish(.25, .3, 1500, 6000, True, .85, .1),
    'block': lambda e: T.block(e.get('m', 79), .35),
    'nightfall': lambda e: mixl(T.gliss(100, 72, .9, .5, 'ting', 1.), T.swish(1.0, .3, 200, 1500, True, .9, .6)),   # chạm 18,0
    'buzzin': lambda e: mixl(T.buzzup(.95, .4, 160, 380), T.swish(1.0, .28, 300, 2000, True, .92)),              # chạm 28,0
    'bloom': lambda e: mixl(T.bubble(500, .5, .1), T.sparkle(.6, .4, 88, 103, 6, 7, 'up')),
    'petals': lambda e: mixl(T.gliss(72, 96, .85, .5, 'harp'), T.swirl(.95, .3, 4, 700, 2800)),                 # chạm 40,0
    'page': lambda e: mixl(T.paper(.35, .45, 5, 1), T.bubble(520, .3, .09)),
    'lensiris': lambda e: mixl(T.swirl(.5, .45, 6, 900, 3600), T.sparkle(.45, .35, 91, 108, 6, 9, 'up')),      # chạm 48,0
    'tink': lambda e: T.tink(e.get('v', .3), e.get('f', 3800)),
    'blip': lambda e: T.blip(e.get('m', 84), .3),
    'tick': lambda e: click(1.5, e.get('v', .4)) * .7,
    'whoosh': lambda e: whoosh(e.get('d', .35), e.get('v', .5)),
    'flutter': lambda e: wings(e.get('d', .6)),
    'iris': lambda e: np.concatenate([whoosh(.5, .45), pop(.5)]),
    'pop': lambda e: pop(e.get('v', .6)) * .55,
    'sparkle': lambda e: mixl(*(np.pad(bell(n, e.get('v', .6), .9), (int(i * .07 * SR), 0)) for i, n in enumerate((88, 91, 95)))),
    'sticker': lambda e: stamp() * .8,
    'land': lambda e: mixl(step(.6) * .7, np.pad(glide(320, 640, .25, .25, .04), (int(.02 * SR), 0))),
    'zoom': lambda e: mixl(riser(.6, 1.), T.whistle(420, 1250, .55, .15)),
    'bubbles': lambda e: bubbles(e.get('d', 1.)),
    'slide': lambda e: glide(500, 1400, e.get('d', 1.), .3, .02),
    'chime': lambda e: mixl(ding(.55) * .5, bell(84, .7)),
    'buzzer': lambda e: buzzer(),
    'reveal': lambda e: mixl(bell(84, .9), bell(91, .6)),
    'stamp': lambda e: stampN(e.get('n')),
    'pullback': lambda e: mixl(whoosh(1.1, .7) * .8, lp(noise(1.1), 300) * np.sin(np.pi * t_(1.1) / 1.1) * .2),
    'buzzby': lambda e: buzzby(e.get('d', 1.5)),
    'roll': lambda e: roll(e.get('d', 3.)),
    'pages': lambda e: pages(e.get('d', .35)),
    'tap': lambda e: step(.7),
    'slurp': lambda e: mixl(glide(900, 380, .35, .3), bp(noise(.35), 600, 2200) * np.sin(np.pi * t_(.35) / .35) * .15),
    'boing': lambda e: T.boing(e.get('f0', 150), .5, .3 * e.get('v', .5) / .5, e.get('rise', 2.2), e.get('rate', 14.)),
}
missing = sorted({e['type'] for e in EV} - SFX.keys())
if missing: sys.exit(f'mix.py: no sound for event types {missing}')
# đường gửi vang: tiếng lấp lánh và tiếng chuyển cảnh có đuôi vang mềm, không tắt cụt
VERB = {'sparkle': .5, 'chime': .4, 'reveal': .4, 'badge': .35, 'swell': .4, 'swirl': .5, 'nightfall': .5, 'buzzin': .3, 'petals': .5,
        'lensiris': .5, 'bloom': .4, 'tink': .5, 'swipe': .25, 'pops': .25, 'page': .3, 'zoom': .3, 'stamp': .15}
snd = np.zeros(N)
for e in EV:
    if e['type'] in VERB:
        x = SFX[e['type']](e); s0 = int(e['t'] * SR); k = min(len(x), N - s0); snd[s0:s0 + k] += x[:k] * VERB[e['type']]
for e in EV:
    if e['type'] == 'roll':                     # Rollo lăn từ phải sang trái: tiếng đi theo, chia khúc để đổi pan
        x = SFX['roll'](e); n = len(x); k = 8
        for i in range(k): add(fx, x[i * n // k:(i + 1) * n // k], e['t'] + i * n / k / SR, .9, .55 - .6 * i / (k - 1))
        continue
    add(fx, SFX[e['type']](e), e['t'], 1., e.get('pan', 0))
add(fx, riser(.5, .8), at(12) - .5, .7)         # vòng âm hút vào tai dế: dâng lên đúng đáp án (nằm trong khoảng lặng của nhạc)
fx += T.verb(snd, 1.1) * .35


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
for kind, a, b in (('garden', 6.0, 17.4), ('night', 17.4, 27.4), ('hive', 27.4, 34.2), ('wind', 34.0, 40.2), ('garden', 40.0, 52.05)):   # vườn chạy đến hết phim: cảnh kết không rơi vào im lặng
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
B['mus'] = mus = T.duck(mus, ve, .82, .5)           # nhạc nhường giọng: dải chữ 300–4000 Hz −15 dB, bass/kick/lớp sáng −6 dB
B['fx'] = fx = T.duck(fx, ve, .5, .2)                 # tiếng động nhường giọng: dải chữ −6 dB, phần còn lại −2 dB
mix = B['mus'] + B['fx'] + B['amb'] + B['vox']
mix = np.tanh(mix * 1.1) / 1.1
# khâu cuối: chặn đỉnh thật ở độ to + 12,3 dB, để loudnorm của mux.sh nâng tuyến tính lên −14 LUFS mà đỉnh vẫn ≤ −1,2 dBTP
mix, I_mix, ceil_db = T.master(mix); print(f'master: {I_mix:.1f} LUFS, true-peak ceiling {ceil_db:.1f} dBFS')
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR, subtype='PCM_24')
for k in ('mus', 'fx', 'vox'): sf.write(os.path.join(HERE, 'out', f'stem_{k}.wav'), B[k].astype(np.float32), SR, subtype='PCM_16')

# kiểm tra: bè trầm 20–120 Hz so với phần còn lại; lớp nào có mặt ở từng đoạn (bảng thiết kế âm thanh)
from scipy.signal import welch
f, p = welch(mix.mean(1), SR, nperseg=8192); low = p[(f >= 20) & (f < 120)].mean(); rest = p[(f >= 120) & (f < 8000)].mean()
print(f'low band 20–120 Hz vs 120–8000 Hz: {10 * np.log10(low / rest):+.1f} dB (per-Hz density)')
for name, a, b in (('mở', 0, 4), ('tựa', 4, 6), ('bướm', 6, 18), ('dế', 18, 28), ('ong', 28, 34), ('bản đồ', 34, 40), ('sổ', 40, 48), ('kết', 48, 52)):
    i, j = int(a * SR), int(b * SR)
    print(f'{name:7s}', '  '.join(f'{k}={20 * np.log10(max(rms(B[k][i:j]), 1e-9)):6.1f}' for k in ('mus', 'fx', 'amb', 'vox')), 'dBFS rms')
print('out/mix.wav', f'{len(mix) / SR:.2f} s')
