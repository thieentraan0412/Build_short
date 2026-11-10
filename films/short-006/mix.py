"""Âm thanh của SHORT-006 → out/mix.wav (48 kHz stereo): nhạc theo từng cảnh ("Barnyard Hoedown", đồng quê Mi trưởng, MUSIC.md)
trên lưới 120 BPM (ô nhịp 2 s), tiếng động theo events.json, nền vườn buổi chiều, giọng.
python mix.py   (cần timeline.json + voice/*.wav từ tools/lines.mjs và core/tts/tts.py, events.json từ core/render/events.mjs)
Nhạc cụ: _shared/audio/band.py; tiếng động hoạt hình: _shared/audio/toon.py (dùng chung cho mọi tập). Không dùng mẫu âm thanh của bên thứ ba.
Phim phát vòng lặp: phách cuối (Si, bậc năm) dẫn về hợp âm Mi ở 0,0; mọi đuôi tiếng vượt quá 22 s được gấp về đầu phim."""
import os, sys, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio')); sys.path.insert(0, os.path.join(LIB, '_shared', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, thump, pop, click, compress, add
from band import mf, pluck, marimba, bassn, bell, pad, riser, glide
from band import pizz, xylo, reed, tuba, celesta, harp, banjo, secret   # màu "Barnyard Hoedown" (MUSIC.md)
import toon as T

TL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))
EV = json.load(open(os.path.join(HERE, 'events.json'), encoding='utf-8'))['ev']
HIT = TL['hit']
BEAT = 60 / TL['bpm']; BAR = BEAT * 4; DUR = TL['dur']; N = int((DUR + .05) * SR); N0 = int(DUR * SR)
NW = N + int(2.5 * SR)                          # nhạc và tiếng động được viết dài hơn phim, phần dư gấp về đầu (vòng lặp)
at = lambda bar, beat=0: (bar * 4 + beat) * BEAT
B = {k: np.zeros((NW if k in ('mus', 'fx') else N, 2)) for k in ('mus', 'fx', 'amb', 'vox')}
def mixl(*xs):
    n = max(len(x) for x in xs); return sum(np.pad(x, (0, n - len(x))) for x in xs)
LINES = TL['lines']
def speaking(t, pad_=.05): return any(l['t'] - pad_ <= t < l['t'] + l['dur'] + pad_ for l in LINES)


# ---------- nhạc: "Barnyard Hoedown" — đồng quê Mi trưởng, khác 001 (tổ khúc), 002 (calypso), 003 (swing), 004 (diễu hành), 005 (valse) ----------
# Kèn dăm hát như harmonica, banjo gảy đệm, tuba "oom-pah" làm bè trầm, phách gỗ gõ như vó ngựa. Mô-típ bí mật Mi–Sol♯–Si khi giọt ngọt "pop!".
# Lớp nhịp theo cảnh (_shared/audio/groove.py): đồng quê ở móc → phi ngựa khi Miss Loupe vào → rón rén khi giọt ngọt phồng →
# đồng quê sáng khi "pop!" và "tiny cows" → nhảy chân sáo ở sổ → polka khi giọt ngọt nảy → nảy nhẹ dẫn về khung đầu.
from groove import Groove
mus = B['mus']
REST = ((HIT['hitLens'] - .02, HIT['hitLens'] + .32),)          # khựng nhạc: giọt ngọt trúng mặt kính
def M(x, t, g=1., pan=0.):
    if any(a <= t < b for a, b in REST): return
    add(mus, x, t, g, pan)
def seq(inst, ns, t0, step, g=1., pan=0., d=None, ramp=0.):
    for i, n in enumerate(ns):
        if n: M(inst(n, d) if d else inst(n), t0 + i * step, g * (1 + ramp * i), pan)
def strum(inst, ns, t, g=.4, d=None, spread=.012):
    for k, n in enumerate(ns): M(inst(n, d) if d else inst(n), t + k * spread, g, -.3 + .6 * k / max(1, len(ns) - 1))

AVOID = [(2.05, 2.3), (HIT['lensIn'][0] - .05, HIT['lensIn'][0] + .4), (HIT['pop'] - .05, HIT['pop'] + .6), (HIT['clonk'] - .05, HIT['clonk'] + .3),
         (HIT['splash'] - .05, HIT['splash'] + .5), (HIT['hitLens'] - .05, HIT['hitLens'] + .6), (HIT['recall'], DUR)]
# Sound Design Plan (11/2026, QUALITY.md §4, SOUND-PLAN.md): mỗi cảnh một phong cách nhạc, một BPM, một nhạc cụ hát chính, một cách chuyển.
# Giữ 120 BPM ở móc và ở cảnh kết về khung đầu (vòng lặp); các cảnh giữa đổi BPM theo nội dung.
G = Groove(M, BEAT, LINES, meter=4, seed=6, avoid=AVOID, plan=True)
G.sec('móc · đồng quê', 0, HIT['lensIn'][0], 'country', 'E', 'E B7', bass='tuba', comp='banjo', lead='xylo', kit='wood', energy=2, cue=False,
      bpm=120, mood='happy', arc='open', what='Crumb ôm con rệp: "What if your pet made you sweets?" – "My pet does!"', emo='tò mò, vui',
      why='"Barnyard Hoedown": banjo, tuba "oom-pah", phách gỗ như vó ngựa; xylophone "ta-da" giữa hai câu.')
G.sec('Miss Loupe vào · phi ngựa', HIT['lensIn'][0], HIT['zoom'][0], 'gallop', 'E', 'A E', bass='tuba', comp='pluck', lead='mute', kit='toy', energy=3,
      bpm=116, mood='bouncy', arc='open', what='Miss Loupe nhảy vào: "Let\'s zoom in!"', emo='háo hức',
      why='Phi ngựa (nhịp kép) cho cú nhảy vào, banjo chạy lên (viết tay), trumpet bịt "wah" đáp sau "zoom in".')
G.sec('kính lớn · rón rén', HIT['zoom'][0], HIT['pop'], 'tiptoe', 'C#m', 'C#m A', bass='pizzbass', comp='pizz', lead='celesta', kit='wood', energy=1,
      bpm=100, mood='suspense', arc='build', what='Trong kính: Crumb gõ nhẹ con rệp, giọt ngọt phồng dần: "Some ants tap aphids for sweet drops!"', emo='hồi hộp, chờ đợi',
      why='Rón rén 100 BPM ở Đô♯ thứ, pizzicato đi lên từng nốt theo giọt ngọt phồng (viết tay), celesta chờ.')
G.sec('pop · tiny cows', HIT['pop'], HIT['snap'], 'country', 'E', 'E A B7', bass='tuba', comp='banjo', lead='kazoo', kit='comic', energy=3,
      bpm=132, mood='funny', arc='peak', what='Giọt ngọt "pop!", Crumb uống: "Like milking tiny cows!" – con rệp "clonk"', emo='phấn khích, buồn cười',
      why='Cao trào: đồng quê nhanh 132 BPM, kazoo "vè vè" như tiếng cười, mõ hai cao độ cho tiếng "clonk"; "pop!" là mô-típ bí mật Mi–Sol♯–Si (viết tay).')
G.sec('sổ · shuffle banjo', HIT['snap'], HIT['flip'][0], 'skip', 'A', 'A E', bass='bassn', comp='pluck', lead='banjo', kit='clap', energy=2,
      bpm=112, mood='happy', arc='end', what='Sticker dán vào sổ; Albie: "Six legs? In you go!" – Crumb nhảy ùm vào trang', emo='vui, tự hào',
      why='Shuffle nhảy chân sáo 112 BPM của sân trại: banjo đáp sau câu cửa miệng, ukulele, vỗ tay; xylophone trượt xuống khi Crumb nhảy ùm (viết tay). '
          '(v2, 11/2026 lượt 2: thay ukulele nắng + piano đồ chơi, công thức trùng ở 5 tập.)')
G.sec('giọt nảy · polka', HIT['flip'][0], HIT['laugh'], 'polka', 'E', 'E B7', bass='tuba', comp='accordion', lead='trombone', kit='toy', energy=3,
      bpm=136, mood='bouncy', arc='end', what='Giọt ngọt nảy khỏi trang, Crumb đuổi theo: "Wait! Come back!" – giọt trúng mặt kính', emo='tinh nghịch, náo nhiệt',
      why='Polka 136 BPM, accordion, trombone "oom-pah" đáp; mỗi cú nảy một nốt xylophone cao dần (viết tay), khựng khi giọt trúng kính.')
G.sec('câu hỏi · về khung đầu', HIT['laugh'], DUR, 'bounce', 'E', 'E A', bass='bassn', comp='banjo', lead='reed', kit='pop', energy=2, no=('comp',),
      bpm=120, mood='happy', arc='end', what='Mọi người cười: "What would YOUR pet make?" – về khung đầu', emo='vui, mời gọi',
      why='Pop nảy nhẹ ở 120 BPM dẫn về hợp âm Mi của khung đầu; bỏ đệm để câu hỏi kết rõ, clarinet đáp.')
G.answer(2.1, HIT['gulp'][1] + .05, HIT['hitLens'] + .35)       # câu đáp viết tay bên dưới ("ta-da" nhỏ, "ực", "hả?")
G.play(); os.makedirs(os.path.join(HERE, 'out'), exist_ok=True); G.save(os.path.join(HERE, 'out', 'music.json'), color='"Barnyard Hoedown" (Mi trưởng)')

# — Hook 0–3 s: hợp âm Mi ở giây 0 (tuba, banjo); "ta-da" giữa câu móc và câu của Crumb —
M(tuba(40, .5), 0., 1.0); strum(banjo, (64, 68, 71, 76), 0., .35, .5); M(T._ting(mf(100), .5), 0., .14, .4)
seq(xylo, (76, 80, 83), 2.1, BEAT / 3, .3, .3, d=.3)
seq(reed, (71, 73), HIT['gulp'][1] + .05, .16, .3, -.2, d=.25)                       # "ực": Crumb nuốt chửng giọt ngọt
# — Miss Loupe nhảy vào: banjo chạy lên; vào kính lớn: riser —
seq(banjo, (64, 68, 71, 76, 80), HIT['lensIn'][0], .06, .4, -.3, d=.3)
M(riser(.6, .8), HIT['zoom'][0] - .5, .3)
# — Trong kính: giọt ngọt phồng (pizzicato đi lên từng nốt, chậm rồi nhanh), "pop!" = mô-típ bí mật Mi–Sol♯–Si —
sw0, sw1 = HIT['swell']
for i, n in enumerate((61, 64, 68, 71, 73, 76, 80)): M(pizz(n, .25), sw0 + (sw1 - sw0) * (1 - (1 - i / 7) ** 1.6), .3, .2)
secret(M, xylo, 76, HIT['pop'] + .02, .15, .5, .3)
M(pad([64, 68, 71, 76], 1.6), HIT['pop'], .25)
seq(banjo, (76, 80, 83, 88), HIT['clonk'] + .25, .1, .3, .3, d=.25)                  # "clonk!": banjo vui
seq(celesta, (88, 83, 80), HIT['aww'][0] + .05, .16, .25, .3, d=.6)                   # nhịp "ồ"
seq(marimba, (64, 68, 71, 76, 80), HIT['snap'] + .04, .07, .45, .2, ramp=.1)          # "chụp": marimba chạy lên (ban nhạc kênh)
M(T.gliss(81, 100, HIT['zoomIn'][1] - HIT['zoomIn'][0], .28, 'harp'), HIT['zoomIn'][0], .9)
M(T.gliss(96, 79, HIT['zoomOut'][1] - HIT['zoomOut'][0], .2, 'harp'), HIT['zoomOut'][0], .7)
# — Sổ: sticker (đàn hạc + hộp nhạc); Crumb nhảy ùm (xylophone trượt xuống), sticker tí hon (hộp nhạc) —
ti = HIT['zoomOut'][1]; strum(harp, (69, 73, 76, 81), ti, .35, .9); M(celesta(93, 1.0), HIT['stamp'] + .02, .3, .3)
seq(xylo, (88, 84, 81, 76, 72), HIT['splash'] + .02, .05, .35, .1, d=.2)
M(celesta(96, .8), HIT['mini'] + .02, .3, .4)
M(T.gliss(76, 100, .45, .3, 'harp'), HIT['flip'][0] + .02, .7)                       # lật trang
# — Gag: mỗi cú nảy một nốt cao dần; khựng khi trúng kính; "hả?" rồi cả ban nhạc trở lại —
for i, (h, n) in enumerate(((HIT['slip'], 76), (HIT['bounce'][0], 80), (HIT['bounce'][1], 83))): M(xylo(n, .25), h + .01, .35, -.2 + .2 * i)
add(mus, pad([64, 68, 71], .6), HIT['hitLens'] + .02, .14, 0)                         # khựng nhưng còn một lớp mỏng
seq(pizz, (71, 0, 76), HIT['hitLens'] + .35, .14, .35, -.3, d=.25)                    # "hả?"
for i, n in enumerate((52, 56, 59)): M(pizz(n, .5), HIT['recall'] + i * .012, .5, -.2 + .2 * i)   # chữ móc trở lại: hợp âm Mi của khung đầu
M(celesta(88, .8), HIT['recall'], .25, .3)
seq(xylo, (76, 80, 83, 88), at(10, 2), BEAT / 2, .22, .3, d=.3)
M(tuba(35, .3), DUR - BEAT / 2, .8)                                                   # nốt dẫn (Si) → Mi ở 0,0

# — cường độ theo cảnh (chuyển mềm 0,3 s) —
L08 = next(l for l in LINES if l['id'] == 'L08')
LEVEL = ((0, .9), (.5, .8), (HIT['lensIn'][0], .92), (HIT['zoom'][0], .74), (HIT['pop'], 1.0), (HIT['pop'] + .6, .8), (HIT['clonk'], .95), (HIT['clonk'] + .5, .8),
         (HIT['snap'], 1.0), (ti, .75), (HIT['splash'], .95), (HIT['splash'] + .5, .78), (HIT['flip'][0], .92), (HIT['walkG'][0], .82), (HIT['slip'], .95),
         (HIT['slip'] + .5, .8), (HIT['laugh'], .78), (HIT['recall'], .72), (L08['t'] + L08['dur'], 1.0))
tt = np.arange(len(mus)) / SR; lev = np.full(len(mus), LEVEL[0][1])
for (t, g), (_, g0) in zip(LEVEL[1:], LEVEL[:-1]): lev = np.where(tt >= t - .15, np.where(tt < t + .15, g0 + (g - g0) * (tt - t + .15) / .3, g), lev)
mus *= lev[:, None]


# ---------- tiếng động theo sự kiện ----------
fx = B['fx']
def steps(d, n, v=1.):                          # bước chân kiến: tiếng "tách" nhỏ, cao, xen kẽ
    x = np.zeros(int(d * SR))
    for k in range(n):
        s = int(k * d / n * SR); b = bp(noise(.03), 2500, 7000) * env_exp(.03, .004) * (.5 + .3 * (k % 2)); x[s:s + len(b)] += b[:len(x) - s]
    return x * .4 * v
def puff(d=.4, v=1.):                           # "phù": làn hơi mềm
    tt = t_(d); return bp(noise(d), 500, 2600) * np.sin(np.pi * tt / d) ** 2 * v * .22
def cowbell(v=1.):                              # chuông bò "clonk": hai bội âm lệch, tắt nhanh, lọc dải
    tt = t_(.55); x = np.sign(np.sin(2 * np.pi * 545 * tt)) * .5 + np.sign(np.sin(2 * np.pi * 812 * tt)) * .5
    return bp(x, 400, 3200) * env_exp(.55, .11) * .32 * v
def slurp(v=1.):                                # "ực": hơi hút lên + bong bóng nhỏ
    return mixl(T.swish(.32, .16, 500, 2400, True), np.pad(T.pops(4, .05, 70, .3), (int(.08 * SR), 0))) * v
SFX = {
    'titlepop': lambda e: mixl(T.bubble(1600, .5, .06, 2.4), np.pad(T._ting(mf(103), .5, .35), (int(.02 * SR), 0))),
    'wordpop': lambda e: mixl(T.boing(220 + 120 * e.get('n', 0), .35, .3, 2.4, 16.), np.pad(pop(.6) * .45, (int(.02 * SR), 0)), T.bubble(1300 + 500 * e.get('n', 0), .35, .05, 2.4)),
    'crash': lambda e: mixl(T.swish(e.get('d', .4), .28, 900, 4200, True, .2, .2), T.whistle(700, 1500, e.get('d', .4), .05)),
    'boing': lambda e: T.boing(e.get('f0', 150), .5, .3 * e.get('v', .5) / .5, 2.2, 14.),
    'plip': lambda e: T.plip(1000, .7),
    'squish': lambda e: mixl(T.bubble(420, .3, .12, 1.2), np.pad(T.bubble(600, .25, .08, 1.6), (int(.12 * SR), 0))),
    'turn': lambda e: T.swish(.25, .18, 1400, 4200, True),
    'slurp': lambda e: slurp(),
    'hop': lambda e: mixl(T.boing(260, .35, .25, 2.4, 16.), T.swish(.3, .2, 900, 3600, True)),
    'land': lambda e: thump(.6, 140) * .5,
    'blip': lambda e: T.blip(e.get('m', 88), .3),
    'zoom': lambda e: mixl(riser(.6, 1.), T.whistle(420, 1250, .55, .15)),
    'tap': lambda e: mixl(click(.6, .4) * .5, T._ting(mf(e.get('m', 91)), .4, .35)) * e.get('v', 1.),
    'giggle': lambda e: mixl(*(np.pad(xylo(n, .15) * .35, (int(i * .07 * SR), 0)) for i, n in enumerate((84, 88, 84, 88, 91)))),
    'swell': lambda e: T.swell(e.get('d', 1.), .22, 76, 100),
    'pop': lambda e: mixl(pop(1.) * .8, T.boing(420, .3, .3, 2.6, 18.), np.pad(T.sparkle(.45, .3, 93, 108, 6, 7, 'up'), (int(.04 * SR), 0))),
    'swish': lambda e: T.swish(e.get('d', .45), e.get('v', .4), e.get('lo', 350), e.get('hi', 2600), e.get('up', True)),
    'pops': lambda e: T.pops(e.get('n', 6), e.get('step', .035), e.get('m', 84), e.get('v', .5)),
    'clonk': lambda e: cowbell(),
    'poof': lambda e: mixl(puff(.4, .9), T.sparkle(.4, .2, 88, 100, 5, 3, 'down')),
    'aww': lambda e: T.sparkle(.6, .3, 88, 103, 6, 3, 'up'),
    'wink': lambda e: T.tink(.45, 4200),
    'snap': lambda e: mixl(click(1., .25) * .8, np.pad(click(.8, .2) * .5, (int(.045 * SR), 0)), np.pad(T.sparkle(.45, .3, 93, 108, 6, 7, 'up'), (int(.06 * SR), 0))),
    'zoomin': lambda e: mixl(T.swish(e.get('d', .3), .42, 600, 5200, True, .15, .25), riser(e.get('d', .3), .4)),
    'zoomout': lambda e: mixl(T.swish(e.get('d', .35), .3, 500, 3800, False, .25, .2), np.pad(T.paper(.3, .35, 5, 4), (int(.1 * SR), 0))),
    'page': lambda e: mixl(T.paper(.35, .45, 5, 1), T.bubble(520, .3, .09)),
    'swipe': lambda e: T.swipe(e.get('d', .3), .32, True, e.get('lo', 1500), e.get('hi', 5500)),
    'stamp': lambda e: mixl(thump(.8, 110) * .7, hp(noise(.07), 1200) * env_exp(.07, .012) * .6),
    'ding': lambda e: T.ding(e.get('m', 88), .4, .7),
    'steps': lambda e: steps(e.get('d', 1.), e.get('n', 8), e.get('v', 1.)),
    'jump': lambda e: mixl(T.boing(200, .4, .35, 2.6, 14.), T.swish(.35, .22, 800, 3800, True)),
    'splash': lambda e: mixl(T.splat(.7, 2), np.pad(T.bubble(380, .5, .12, 2.2), (int(.05 * SR), 0)), np.pad(T.sparkle(.5, .25, 91, 105, 6, 5, 'down'), (int(.08 * SR), 0))),
    'flip': lambda e: mixl(T.paper(e.get('d', .5), .5, 7, 3), T.swish(e.get('d', .5), .22, 700, 3200, True)),
    'tink': lambda e: mixl(T.tink(1., 3800), T._ting(mf(96), .5, .4)),
    'recall': lambda e: mixl(SFX['titlepop'](e), SFX['wordpop']({'n': 0}), np.pad(SFX['wordpop']({'n': 1}), (int(.12 * SR), 0))),
    'dropiris': lambda e: mixl(T.swirl(.65, .4, 6, 700, 3000), T.revcymbal(.65, .28), T.bubble(500, .4, .3, 2.5)),
}
missing = sorted({e['type'] for e in EV} - SFX.keys())
if missing: sys.exit(f'mix.py: no sound for event types {missing}')
VERB = {'pop': .4, 'clonk': .35, 'zoom': .3, 'titlepop': .3, 'ding': .4, 'flip': .3, 'dropiris': .3, 'page': .3, 'swipe': .25, 'splash': .3, 'tink': .35, 'aww': .4}
snd = np.zeros(NW)
for e in EV:
    x = SFX[e['type']](e); add(fx, x, e['t'], 1., e.get('pan', 0))
    if e['type'] in VERB: s0 = int(e['t'] * SR); k = min(len(x), NW - s0); snd[s0:s0 + k] += x[:k] * VERB[e['type']]
fx += T.verb(snd, 1.1) * .35


# ---------- vòng lặp: phần dư sau 22 s cộng vào đầu phim, rồi cắt về đúng độ dài ----------
for k in ('mus', 'fx'):
    b = B[k]; tail = b[N0:].copy(); b[:len(tail)] += tail; B[k] = b[:N].copy()
mus, fx = B['mus'], B['fx']


# ---------- nền: vườn buổi chiều (gió nhẹ trầm, vài tiếng chim rất xa ở chỗ không có lời) ----------
amb = B['amb']
d = DUR; tt = t_(d)
air = lp(brown(d), 260) * .7
add(amb, air * np.minimum(1, tt / .05) * .05, 0, 1., 0)
rng = np.random.default_rng(6)
for t0 in (4.85, 12.2, 16.2, 21.3):                 # chim xa: hai tiếng "chíp" ngắn (2,6–3,6 kHz), chỉ ở chỗ trống
    if speaking(t0, .2): continue
    for k in range(2):
        f0 = rng.uniform(2600, 3200); tw = glide(f0, f0 * 1.18, .07, .06, 0.)
        add(amb, tw, t0 + k * .11, 1., rng.uniform(-.7, .7))


# ---------- giọng ----------
vox = np.zeros(N)
for L in LINES:
    y, sr = sf.read(os.path.join(HERE, 'voice', L['id'] + '.wav'))
    if y.ndim > 1: y = y.mean(1)
    y = soxr.resample(y, sr, SR) * (1.15 if L['id'] == 'L07' else 1.)   # "Wait! Come back!" to hơn một chút
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
B['mus'] = mus = T.duck(mus, ve, .82, .55)          # nhạc nhường giọng: dải chữ 300–4000 Hz −15 dB, bass/lớp sáng −7 dB
B['fx'] = fx = T.duck(fx, ve, .6, .3)                 # tiếng động nhường giọng: dải chữ −8 dB, phần còn lại −3 dB
mix = B['mus'] + B['fx'] + B['amb'] + B['vox']
mix = np.tanh(mix * 1.1) / 1.1
mix, I_mix, ceil_db = T.master(mix, 11.6); print(f'master: {I_mix:.1f} LUFS, true-peak ceiling {ceil_db:.1f} dBFS')
nf = int(.02 * SR); mix[:nf] *= np.linspace(0, 1, nf)[:, None]   # mép đầu file: fade-in 20 ms (phim vòng lặp)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR, subtype='PCM_24')
for k in ('mus', 'fx', 'vox'): sf.write(os.path.join(HERE, 'out', f'stem_{k}.wav'), B[k].astype(np.float32), SR, subtype='PCM_16')   # để kiểm lời có bị che không

from scipy.signal import welch
f, p = welch(mix.mean(1), SR, nperseg=8192); low = p[(f >= 20) & (f < 120)].mean(); rest = p[(f >= 120) & (f < 8000)].mean()
print(f'low band 20–120 Hz vs 120–8000 Hz: {10 * np.log10(low / rest):+.1f} dB (per-Hz density)')
for name, a, b in (('móc', 0, 3.2), ('kính', 3.2, 12.15), ('sổ', 12.15, 16.05), ('gag', 16.05, 22)):
    i, j = int(a * SR), int(b * SR)
    print(f'{name:5s}', '  '.join(f'{k}={20 * np.log10(max(rms(B[k][i:j]), 1e-9)):6.1f}' for k in ('mus', 'fx', 'amb', 'vox')), 'dBFS rms')
print('out/mix.wav', f'{len(mix) / SR:.2f} s')
