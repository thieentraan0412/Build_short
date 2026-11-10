"""Âm thanh của SHORT-009 → out/mix.wav (48 kHz stereo): nhạc theo từng cảnh ("Sunset Counting Song", Rê trưởng, MUSIC.md và SOUND-PLAN.md),
tiếng động theo events.json, nền vườn hoàng hôn, giọng.
python mix.py   (cần timeline.json + voice/*.wav từ tools/lines.mjs và core/tts/tts.py, events.json từ core/render/events.mjs)
Nhạc cụ: _shared/audio/band.py; lớp nhịp theo cảnh: _shared/audio/groove.py (plan=True, Sound Design Plan); tiếng động: _shared/audio/toon.py.
Không dùng mẫu âm thanh của bên thứ ba. Phim phát vòng lặp: nốt La (bậc năm) ở cuối dẫn về hợp âm Rê ở 0,0; đuôi tiếng sau 24 s gấp về đầu phim."""
import os, sys, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio')); sys.path.insert(0, os.path.join(LIB, '_shared', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, thump, pop, click, clack, compress, add
from band import mf, pluck, marimba, bassn, bell, chirp, tuba, pizz, xylo, celesta, harp, trumpet, trombone, kazoo, riser
import toon as T

TL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))
EV = json.load(open(os.path.join(HERE, 'events.json'), encoding='utf-8'))['ev']
HIT = TL['hit']
BEAT = 60 / TL['bpm']; DUR = TL['dur']; N = int((DUR + .05) * SR); N0 = int(DUR * SR)
NW = N + int(2.5 * SR)
B = {k: np.zeros((NW if k in ('mus', 'fx') else N, 2)) for k in ('mus', 'fx', 'amb', 'vox')}
def mixl(*xs):
    n = max(len(x) for x in xs); return sum(np.pad(x, (0, n - len(x))) for x in xs)
LINES = TL['lines']
L = {l['id']: l for l in LINES}
end = lambda i: L[i]['t'] + L[i]['dur']
def speaking(t, pad_=.05): return any(l['t'] - pad_ <= t < l['t'] + l['dur'] + pad_ for l in LINES)


# ---------- nhạc: "Sunset Counting Song" — Rê trưởng, bài đếm số lúc hoàng hôn ----------
# Mỗi số đếm là một nốt marimba cao dần (cánh ruồi 1, 2; tấm cánh và cánh mỏng của Blink 1–4) ở dải cao, trên dải giọng.
# Fizz có kazoo "vè vè" riêng; Blink có glockenspiel; cú vỡ lẽ "So I'm a beetle!" là kèn trumpet.
from groove import Groove
mus = B['mus']
def M(x, t, g=1., pan=0.): add(mus, x, t, g, pan)
def seq(inst, ns, t0, step, g=1., pan=0., d=None, ramp=0.):
    for i, n in enumerate(ns):
        if n: M(inst(n, d) if d else inst(n), t0 + i * step, g * (1 + ramp * i), pan)
def strum(inst, ns, t, g=.4, d=None, spread=.012):
    for k, n in enumerate(ns): M(inst(n, d) if d else inst(n), t + k * spread, g, -.3 + .6 * k / max(1, len(ns) - 1))
glock = lambda m, d=.6: T._ting(mf(m), d, 1.) * .5

C2, C4 = HIT['count2'], HIT['count4']
AVOID = [(0, .45), (1.62, 2.0), (end('L03'), L['L04']['t']), (HIT['zoom'][0] - .05, HIT['spread'] + .4), (C2[0] - .05, C2[1] + .4), (HIT['cases'] - .05, C4[-1] + .4),
         (end('L06'), L['L07']['t']), (HIT['snap'] - .05, HIT['stamp'] + .5), (HIT['gulp'] - .1, HIT['gulp'] + .5), (HIT['flip'][0] - .05, HIT['flip'][1] + .1),
         (HIT['lift'][0] - .05, L['L09']['t']), (end('L10'), DUR)]
# Sound Design Plan (11/2026, QUALITY.md §4, SOUND-PLAN.md): mỗi cảnh một phong cách nhạc, một BPM, một nhạc cụ hát chính, một cách chuyển.
# Giữ 120 BPM ở móc và cảnh cuối (Fizz bay một vòng về đúng khung đầu, vòng lặp liền).
G = Groove(M, BEAT, LINES, meter=4, seed=9, avoid=AVOID, plan=True)
G.sec('móc · ai là ruồi?', 0, HIT['claim'] - .1, 'hop', 'D', 'D G', bass='bassn', comp='pluck', lead='kazoo', kit='bongo', energy=2, cue=False,
      bpm=120, mood='playful', arc='open', what='Fizz vừa đáp xuống cạnh Blink lúc hoàng hôn, cọ hai chân trước; Blink bắt chước: "Which one is a fly?"',
      emo='tò mò, buồn cười', why='Nảy lệch phách, ukulele và bongo vào ngay giây 0 theo cú đáp của Fizz; kazoo "vè vè" là giọng của Fizz, chen vào sau câu hỏi.')
G.sec('"Me! I\'m a firefly!"', HIT['claim'] - .1, HIT['hush'][0], 'stride', 'D', 'D A7', bass='tuba', comp='piano', lead='mute', kit='march', energy=2,
      bpm=112, mood='funny', arc='open', what='Blink giơ chân nhận: "Me! I\'m a firefly!"', emo='tự tin, buồn cười',
      why='Ragtime piano 112 BPM cho câu nhận vơ đầy tự tin; trumpet bịt "wah" như đang cười thầm, vì ai cũng biết câu đoán sắp sai.')
G.mark('khựng', HIT['hush'][0], L['L03']['t'], 'break', 'D', '', 1, mood='suspense', arc='open', what='Khựng: Blink chờ, Fizz nghiêng đầu',
       emo='nín thở', why='Khoảng lặng có chủ đích 0,6 s (chỉ còn trống lăn thì thầm) để "Nope!" bật ra rõ.')
G.sec('"Nope!" · "Let\'s zoom in!"', L['L03']['t'], HIT['zoom'][0], 'bounce', 'D', 'D Bm', bass='bassn', comp='harp', lead='xylo', kit='pop', energy=2, cue=False,
      bpm=126, mood='happy', arc='open', what='Miss Loupe bật vào: "Nope!" – Blink xìu; "Let\'s zoom in!"', emo='bất ngờ, háo hức',
      why='Pop nảy 126 BPM ngay sau "Nope!"; trombone "wah-wah" đi xuống khi Blink xìu (viết tay), rồi xylophone đáp sau "zoom in".')
G.sec('đếm cánh ruồi · 1, 2', HIT['zoom'][0], HIT['pan'][0], 'sunny', 'D', 'D A', bass='bassn', comp='pluck', lead='vibes', kit='clap', energy=2,
      bpm=104, mood='happy', arc='build', what='Kính lớn soi Fizz xoè cánh, số "1", "2" bật lên: "A fly has two wings."', emo='vui, rõ ràng',
      why='Bài đếm số: ukulele quạt 104 BPM, vỗ tay nhẹ; mỗi số là một nốt marimba cao (viết tay), trẻ đếm theo được.')
G.sec('tấm cánh của Blink · 1–4', HIT['pan'][0], HIT['proud'] - .4, 'quest', 'G', 'G Em D', bass='upright', comp='pizz', arp='harp', lead='celesta', kit='tom', energy=2,
      bpm=108, mood='magic', arc='build', what='Kính lia sang Blink: tấm cánh bật lên "1, 2", hai cánh mỏng mở ra "3, 4": "Blink has wing cases on top!"',
      emo='kỳ diệu, bất ngờ', why='Phiêu lưu 108 BPM, đàn hạc rải khi tấm cánh bật; bốn nốt marimba tiếp tục đi lên từ hai nốt của ruồi, nên "4" nghe rõ là nhiều hơn "2".')
G.sec('"So I\'m a beetle!"', HIT['proud'] - .4, HIT['snap'], 'hero', 'D', 'D G', bass='tuba', comp='piano', lead='trumpet', arp='strings', kit='epic', energy=3,
      bpm=132, mood='epic', arc='peak', what='Blink vỡ lẽ, tự hào: "So I\'m a beetle!"', emo='vỡ lẽ, tự hào',
      why='Cao trào ngắn của tập: kèn trumpet ba nốt đi lên ngay trước câu (viết tay), dàn dây spiccato và timpani 132 BPM.')
G.mark('chụp → sổ', HIT['snap'], HIT['stamp'], 'break', 'D', 'marimba harp', 2, mood='happy', arc='end', what='Kính "chụp" Blink đang mở tấm cánh, sticker hiện trên trang sổ',
       emo='háo hức', why='Marimba chạy lên (tiếng "chụp" của ban nhạc kênh), đàn hạc vuốt qua mặt kính.')
G.sec('sổ · Albie', HIT['stamp'], HIT['flip'][0], 'skip', 'D', 'D G', bass='bassn', comp='pluck', lead='toypiano', kit='toy', energy=2, cue=False,
      bpm=116, mood='playful', arc='end', what='Sticker "Beetle!" dán vào sổ; Albie đếm chân: "Six legs? In you go!", Blink lao vào trang đúng "go!"',
      emo='vui, tự hào', why='Shuffle ukulele 116 BPM, piano đồ chơi đáp; dưới giọng trầm của Albie lớp nhịp tự bỏ bass.')
G.sec('gag · Fizz bắt chước', HIT['flip'][0], L['L10']['t'] - .1, 'sneak', 'Bm', 'Bm G', bass='tuba', comp='pizz', lead='bassoon', kit='comic', energy=1,
      bpm=100, mood='funny', arc='end', what='Fizz nhấc cánh như tấm cánh, gồng đuôi cho sáng… chỉ ra một tia "xì": "Nice try, Fizz!"',
      emo='buồn cười, thương', why='Rình rập hài 100 BPM ở Si thứ: pizzicato rón rén theo cú gồng, tuba "bwomp" đi xuống khi "xì" (viết tay), bassoon an ủi.')
G.sec('câu hỏi · Fizz bay một vòng', L['L10']['t'] - .1, DUR, 'gallop', 'D', 'D A', bass='bassn', comp='marimba', lead='flute', kit='toy', energy=2,
      bpm=120, mood='bouncy', arc='end', what='"How many wings does a fly have?" – Fizz vỗ hai cánh, bay một vòng, đáp về đúng khung đầu', emo='háo hức, mời gọi',
      why='Phi ngựa (nhịp kép) 120 BPM theo vòng bay của Fizz; hợp âm La ở cuối dẫn về Rê của khung đầu nên vòng lặp liền.')
G.answer(1.7, end('L03') + .02, C2[0], end('L06') + .05, HIT['fizzle'])   # câu đáp viết tay bên dưới (kazoo của Fizz, "wah-wah", số đếm, kèn, "bwomp")
G.play(); os.makedirs(os.path.join(HERE, 'out'), exist_ok=True); G.save(os.path.join(HERE, 'out', 'music.json'), color='"Sunset Counting Song" (Rê trưởng)')

# — Móc: hợp âm Rê ở giây 0; kazoo "vè vè" của Fizz trong khoảng trống sau câu hỏi —
M(bassn(38, .5), 0., 1.0); strum(pluck, (62, 66, 69, 74), 0., .35, .5); M(glock(93, .5), 0., .12, .4)
seq(lambda m, d: kazoo(m, d), (69, 66, 69), 1.7, .1, .32, -.2, d=.12)
# — "Nope!": trombone "wah-wah" đi xuống khi Blink xìu (sau chữ) —
M(trombone(57, .55, 1., -3.), end('L03') + .02, .5, .2)
# — Kính: đàn hạc vuốt lên; Fizz xoè cánh: glockenspiel rung —
M(T.gliss(74, 98, .4, .26, 'harp'), HIT['zoom'][0], .9)
seq(glock, (93, 95, 93), HIT['spread'], .06, .2, -.2, d=.3)
# — Đếm: mỗi số một nốt marimba cao dần (dải cao, trên dải giọng), kèm celesta quãng tám —
for i, (h, m) in enumerate(zip(C2 + C4, (86, 88, 90, 93, 95, 98))):
    M(marimba(m, .5), h + .01, .38, -.2 + .08 * i); M(celesta(m - 12, .5), h + .015, .12, .2)
M(T.gliss(81, 100, .45, .22, 'harp'), HIT['wings'], .8)
# — Vỡ lẽ: trumpet Rê–Fa♯–La đi lên ngay trước "So I'm a beetle!" —
seq(lambda m, d: trumpet(m, d), (74, 78, 81), end('L06') + .08, .09, .32, .1, d=.2); M(trumpet(86, .5), end('L06') + .35, .28, .1)
# — Chụp → sổ: marimba chạy lên; đàn hạc vuốt; sticker: đàn hạc rải + hộp nhạc; Blink lao vào trang: xylophone trượt xuống; lật trang —
seq(marimba, (74, 78, 81, 86, 90), HIT['snap'] + .04, .07, .45, .2, ramp=.1)
M(T.gliss(81, 100, HIT['zoomIn'][1] - HIT['zoomIn'][0], .28, 'harp'), HIT['zoomIn'][0], .9)
M(T.gliss(96, 79, HIT['zoomOut'][1] - HIT['zoomOut'][0], .2, 'harp'), HIT['zoomOut'][0], .7)
strum(harp, (74, 78, 81, 86), HIT['zoomOut'][1], .35, .9); M(celesta(93, 1.0), HIT['stamp'] + .02, .3, .3)
seq(xylo, (93, 90, 86, 81, 78), HIT['gulp'] + .02, .05, .35, .1, d=.2)
M(celesta(98, .8), HIT['mini'] + .02, .3, .4)
M(T.gliss(76, 100, .45, .3, 'harp'), HIT['flip'][0] + .02, .7)
# — Gag: kazoo vút lên khi Fizz nhấc cánh; "xì" → tuba "bwomp" đi xuống —
seq(lambda m, d: kazoo(m, d), (66, 69, 71, 74), HIT['lift'][0], .07, .26, -.2, d=.1)
M(T.whistle(1300, 500, .3, 1., .02), HIT['fizzle'] + .02, .1, -.2); M(tuba(40, .5, 1., -4.), HIT['fizzle'] + .04, .6)
# — Chữ móc trở lại: hợp âm Rê nhỏ; nốt dẫn La → Rê ở 0,0 —
strum(pluck, (62, 66, 69, 74), HIT['recall'], .3, .8)
M(bassn(45, .3), DUR - BEAT / 2, .9)

# — cường độ theo cảnh (chuyển mềm 0,3 s) —
LEVEL = ((0, .9), (.25, .74), (HIT['claim'], .85), (HIT['hush'][0], .5), (L['L03']['t'], .95), (L['L04']['t'], .78), (HIT['zoom'][0], .95), (L['L05']['t'], .76),
         (HIT['cases'], .9), (L['L06']['t'] + .5, .76), (end('L06'), 1.0), (L['L07']['t'], .82), (HIT['snap'], 1.0), (HIT['stamp'] + .3, .78), (HIT['gulp'], .95), (HIT['gulp'] + .5, .8),
         (HIT['flip'][0], .9), (HIT['lift'][0], .8), (HIT['fizzle'], .95), (L['L09']['t'], .72), (L['L10']['t'], .7), (end('L10'), 1.0))
tt = np.arange(len(mus)) / SR; lev = np.full(len(mus), LEVEL[0][1])
for (t, g), (_, g0) in zip(LEVEL[1:], LEVEL[:-1]): lev = np.where(tt >= t - .15, np.where(tt < t + .15, g0 + (g - g0) * (tt - t + .15) / .3, g), lev)
mus *= lev[:, None]


# ---------- tiếng động theo sự kiện ----------
fx = B['fx']
def flybuzz(d, v=1., f0=196, dop=0., fade_out=True):
    """Ruồi vo ve: sóng răng cưa ~196 Hz (nhịp vỗ cánh của ruồi nhà), rung biên độ nhanh, cao độ lượn; dop: lượn cao độ theo vòng bay."""
    tt = t_(d); f = f0 * (1 + .04 * np.sin(2 * np.pi * 3.3 * tt) + dop * np.sin(2 * np.pi * tt / max(d, .1)))
    ph = np.cumsum(f) / SR; x = lp(2 * (ph % 1) - 1, 2200) * (.75 + .25 * np.sin(2 * np.pi * 31 * tt))
    e = np.minimum(1, tt / .06) * (np.minimum(1, (d - tt) / .15) if fade_out else 1)
    return fade_safe(x * e) * v * .5
def fade_safe(x): n = min(len(x), int(.01 * SR)); x = x.copy(); x[:n] *= np.linspace(0, 1, n); x[len(x) - n:] *= np.linspace(1, 0, n); return x
def rubfx(d, v=1.):                              # cọ chân "sột sột": những tiếng cạo ngắn liên tiếp
    x = np.zeros(int((d + .1) * SR))
    for k in range(int(d / .09)):
        b = bp(noise(.05), 2500, 7000) * env_exp(.05, .012) * (.5 + .3 * (k % 2)); s = int(k * .09 * SR); x[s:s + len(b)] += b[:len(x) - s]
    return x * v * .45
def hushroll(d, v=1.):
    tt = t_(d); return bp(noise(d), 1800, 6000) * (.5 + .5 * np.sign(np.sin(2 * np.pi * 22 * tt))) * np.minimum(1, tt / .1) * .05 * v
def deflate(v=1.):                              # xìu: "phù" xì hơi nhỏ (trombone "wah-wah" viết tay đi cùng)
    d = .45; tt = t_(d); return bp(noise(d), 500, 2500) * np.exp(-tt * 5) * .3 * v
def strainfx(d, v=1.):                          # Fizz gồng "ưm": rung nhẹ, cao dần
    tt = t_(d); f = 160 * (1 + .6 * tt / d); x = lp(np.sin(2 * np.pi * np.cumsum(f) / SR) * (1 + .5 * np.sign(np.sin(2 * np.pi * 18 * tt))), 1200)
    return x * np.minimum(1, tt / .05) * np.minimum(1, (d - tt) / .05) * .18 * v
def fizzlefx(v=1.):                             # "xì": tia lách tách rồi một luồng hơi nhỏ
    d = .5; tt = t_(d); return mixl(hp(noise(d), 3500) * np.exp(-tt * 9) * .5, T.sparkle(.3, .25, 96, 108, 5, 3, 'down'), np.pad(bp(noise(.3), 700, 2500) * env_exp(.3, .08) * .4, (int(.08 * SR), 0))) * v
SFX = {
    'titlepop': lambda e: mixl(T.bubble(1600, .5, .06, 2.4), np.pad(T._ting(mf(101), .5, .35), (int(.02 * SR), 0))),
    'wordpop': lambda e: mixl(T.boing(220 + 120 * e.get('n', 0), .35, .3, 2.4, 16.), np.pad(pop(.6) * .45, (int(.02 * SR), 0)), T.bubble(1300 + 500 * e.get('n', 0), .35, .05, 2.4)),
    'land': lambda e: mixl(thump(.45, 170) * .4, T.plip(1000, .4)),
    'buzzout': lambda e: flybuzz(.35, .55),
    'rub': lambda e: rubfx(e.get('d', .7), e.get('v', 1.)),
    'hop': lambda e: T.boing(260, .3, .3, 2.2, 15.),
    'tadasmall': lambda e: mixl(T.sparkle(.4, .3, 91, 104, 6, 2, 'up'), T._ting(mf(93), .6, .35)),
    'hush': lambda e: hushroll(e.get('d', .5)),
    'zip': lambda e: mixl(T.zip_(e.get('d', .4), 700, 2800, .5), T.swish(e.get('d', .4), .25, 900, 4200, True)),
    'landL': lambda e: mixl(thump(.6, 150) * .5, T.boing(200, .2, .15, 1.8, 12.)),
    'deflate': lambda e: deflate(.8),
    'zoom': lambda e: mixl(riser(.4, .8), T.whistle(420, 1250, .4, .12)),
    'buzz': lambda e: flybuzz(e.get('d', .6), e.get('v', .8)),
    'count': lambda e: mixl(T.ding(86 + 2 * e.get('n', 0), .32, .8), T.blip(84 + 3 * e.get('n', 0), .25)),
    'swish': lambda e: T.swish(e.get('d', .45), e.get('v', .4), e.get('lo', 350), e.get('hi', 2600), e.get('up', True)),
    'clack': lambda e: mixl(clack(1.1, .9) * .6, T.block(84, .5), T.swish(.2, .14, 1500, 4500, True)),
    'unfold': lambda e: mixl(T.swish(.35, .25, 1200, 5200, True), T.sparkle(.35, .18, 93, 105, 5, 4, 'up')),
    'sparkle': lambda e: T.sparkle(.5, .3, 91, 105, 7, 5, 'up'),
    'snap': lambda e: mixl(click(1., .25) * .8, np.pad(click(.8, .2) * .5, (int(.045 * SR), 0)), np.pad(T.sparkle(.45, .3, 93, 108, 6, 7, 'up'), (int(.06 * SR), 0))),
    'zoomin': lambda e: mixl(T.swish(e.get('d', .3), .42, 600, 5200, True, .15, .25), riser(e.get('d', .3), .4)),
    'zoomout': lambda e: mixl(T.swish(e.get('d', .35), .3, 500, 3800, False, .25, .2), np.pad(T.paper(.3, .35, 5, 4), (int(.1 * SR), 0))),
    'page': lambda e: mixl(T.paper(.35, .45, 5, 1), T.bubble(520, .3, .09)),
    'swipe': lambda e: T.swipe(e.get('d', .3), .32, True, e.get('lo', 1500), e.get('hi', 5500)),
    'stamp': lambda e: mixl(thump(.8, 110) * .7, hp(noise(.07), 1200) * env_exp(.07, .012) * .6),
    'ding': lambda e: T.ding(e.get('m', 88), .4, .7),
    'countA': lambda e: mixl(T.blip(84 + 3 * e.get('n', 0), .35), T.block(91 + 2 * e.get('n', 0), .25)),
    'jump': lambda e: mixl(T.boing(220, .4, .35, 2.6, 14.), T.swish(.35, .22, 800, 3800, True)),
    'gulp': lambda e: mixl(T.paper(.3, .45, 5, 2), T.boing(170, .45, .4, 2.2, 14.), np.pad(T.bubble(420, .35, .12, 1.4), (int(.08 * SR), 0))),
    'pops': lambda e: T.pops(e.get('n', 6), e.get('step', .035), e.get('m', 84), e.get('v', .5)),
    'flip': lambda e: mixl(T.paper(e.get('d', .5), .5, 7, 3), T.swish(e.get('d', .5), .22, 700, 3200, True)),
    'strain': lambda e: strainfx(e.get('d', .5)),
    'fizzle': lambda e: fizzlefx(.8),
    'shrug': lambda e: mixl(T.blip(84, .3), np.pad(T.blip(79, .3), (int(.12 * SR), 0))),
    'buzzloop': lambda e: flybuzz(e.get('d', 1.7), .7, 196, .12, fade_out=False),
    'recall': lambda e: mixl(SFX['titlepop'](e), SFX['wordpop']({'n': 0}), np.pad(SFX['wordpop']({'n': 1}), (int(.12 * SR), 0))),
    'hopout': lambda e: mixl(T.zip_(.35, 2600, 800, .35), T.swish(.35, .2, 900, 3600, False)),
}
missing = sorted({e['type'] for e in EV} - SFX.keys())
if missing: sys.exit(f'mix.py: no sound for event types {missing}')
VERB = {'zoom': .3, 'titlepop': .3, 'ding': .4, 'flip': .3, 'page': .3, 'swipe': .25, 'count': .45, 'sparkle': .4, 'unfold': .35, 'tadasmall': .35}
snd = np.zeros(NW)
for e in EV:
    x = SFX[e['type']](e); add(fx, x, e['t'], 1., e.get('pan', 0))
    if e['type'] in VERB: s0 = int(e['t'] * SR); k = min(len(x), NW - s0); snd[s0:s0 + k] += x[:k] * VERB[e['type']]
fx += T.verb(snd, 1.3) * .35


# ---------- vòng lặp: phần dư sau 24 s cộng vào đầu phim ----------
for k in ('mus', 'fx'):
    b = B[k]; tail = b[N0:].copy(); b[:len(tail)] += tail; B[k] = b[:N].copy()
mus, fx = B['mus'], B['fx']


# ---------- nền: vườn hoàng hôn (gió nhẹ, dế bắt đầu gáy xa ở chỗ không có lời) ----------
amb = B['amb']
d = DUR; tt = t_(d)
add(amb, lp(brown(d), 300) * .7 * np.minimum(1, tt / .05) * .05, 0, 1., 0)
rng = np.random.default_rng(9)
t0 = .9
while t0 < DUR - .5:
    if not speaking(t0, .15) and not (HIT['zoom'][0] - .2 < t0 < HIT['snap']) and not (HIT['zoomIn'][0] - .2 < t0 < HIT['flip'][1]):
        add(amb, chirp(1.) * .15, t0, 1., rng.uniform(-.8, .8))
    t0 += rng.uniform(1.2, 2.0)


# ---------- giọng ----------
vox = np.zeros(N)
for Ln in LINES:
    y, sr = sf.read(os.path.join(HERE, 'voice', Ln['id'] + '.wav'))
    if y.ndim > 1: y = y.mean(1)
    y = soxr.resample(y, sr, SR)
    s = int(Ln['t'] * SR); e = min(N, s + len(y)); vox[s:e] += y[:e - s]
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
mix, I_mix, ceil_db = T.master(mix, 11.0); print(f'master: {I_mix:.1f} LUFS, true-peak ceiling {ceil_db:.1f} dBFS')
nf = int(.02 * SR); mix[:nf] *= np.linspace(0, 1, nf)[:, None]
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR, subtype='PCM_24')
for k in ('mus', 'fx', 'vox'): sf.write(os.path.join(HERE, 'out', f'stem_{k}.wav'), B[k].astype(np.float32), SR, subtype='PCM_16')
for name, a, b in (('móc', 0, 5.75), ('kính', 5.75, 13.5), ('sổ', 13.5, 17.6), ('gag', 17.6, 24)):
    i, j = int(a * SR), int(b * SR)
    print(f'{name:5s}', '  '.join(f'{k}={20 * np.log10(max(rms(B[k][i:j]), 1e-9)):6.1f}' for k in ('mus', 'fx', 'amb', 'vox')), 'dBFS rms')
print('out/mix.wav', f'{len(mix) / SR:.2f} s')
