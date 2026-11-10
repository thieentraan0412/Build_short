"""Âm thanh của SHORT-005 → out/mix.wav (48 kHz stereo): nhạc theo từng cảnh ("Tap-Tap Waltz", valse 3/4 ở La trưởng, MUSIC.md)
trên lưới 120 BPM (ô nhịp 1,5 s), tiếng động theo events.json, nền vườn buổi sáng, giọng.
python mix.py   (cần timeline.json + voice/*.wav từ tools/lines.mjs và core/tts/tts.py, events.json từ core/render/events.mjs)
Nhạc cụ: _shared/audio/band.py; tiếng động hoạt hình: _shared/audio/toon.py (dùng chung cho mọi tập). Không dùng mẫu âm thanh của bên thứ ba.
Phim phát vòng lặp: ô nhịp cuối (Mi7) dẫn về hợp âm La ở 0,0; mọi đuôi tiếng vượt quá 24 s được gấp về đầu phim."""
import os, sys, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio')); sys.path.insert(0, os.path.join(LIB, '_shared', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, whoosh, thump, ding, pop, click, step, compress, limit, add
from band import fade, mf, pluck, marimba, bassn, bell, pad, riser, glide
from band import pizz, xylo, reed, tuba, celesta, harp, claves, tamb, triad, secret, MIN   # màu "Tap-Tap Waltz" (MUSIC.md)
import toon as T

TL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))
EV = json.load(open(os.path.join(HERE, 'events.json'), encoding='utf-8'))['ev']
HIT = TL['hit']
BEAT = 60 / TL['bpm']; BAR = BEAT * 3; DUR = TL['dur']; N = int((DUR + .05) * SR); N0 = int(DUR * SR)
NW = N + int(2.5 * SR)                          # nhạc và tiếng động được viết dài hơn phim, phần dư gấp về đầu (vòng lặp)
at = lambda bar, beat=0: (bar * 3 + beat) * BEAT
B = {k: np.zeros((NW if k in ('mus', 'fx') else N, 2)) for k in ('mus', 'fx', 'amb', 'vox')}
def mixl(*xs):
    n = max(len(x) for x in xs); return sum(np.pad(x, (0, n - len(x))) for x in xs)
LINES = TL['lines']
def speaking(t, pad_=.05): return any(l['t'] - pad_ <= t < l['t'] + l['dur'] + pad_ for l in LINES)


# ---------- nhạc: "Tap-Tap Waltz" — nhịp ba, khác SHORT-001 (tổ khúc), 002 (calypso), 003 (swing), 004 (diễu hành) ----------
# Hai cú chạm râu "tách, tách" rơi đúng hai phách "pa-pa" của valse. Mô-típ bí mật La–Đô♯–Mi trên hộp nhạc khi cùng mùi.
# v3 (nhạc nền sinh động, MUSIC.md): lớp nhịp theo cảnh (_shared/audio/groove.py) đổi điệu ở mỗi cảnh: valse chạm râu → valse đầy
# khi Miss Loupe vào → hộp nhạc rải mơ màng trong kính → valse phong cầm ấm khi cùng mùi → rón rén khi chú kiến lạ tới →
# valse marimba ở sổ → polka lon ton khi Crumb tới cành → lắng lại cho tiếng "squeak" → valse đầy dẫn về khung đầu.
# Lớp nhịp thưa dưới lời, chen câu đáp vào khoảng trống, có dấu ở chỗ đổi cảnh. Điểm nhấn của tập đặt tay như trước.
from groove import Groove
mus = B['mus']
REST = ((HIT['clash'] - .02, HIT['shrug'] - .05), (HIT['glass'][0] - .06, HIT['glass'][1] + .55))   # khựng nhạc: lúc "khác mùi" và lúc kính kêu squeak
def M(x, t, g=1., pan=0.):
    if any(a <= t < b for a, b in REST): return
    add(mus, x, t, g, pan)
def seq(inst, ns, t0, step, g=1., pan=0., d=None, ramp=0.):
    for i, n in enumerate(ns):
        if n: M(inst(n, d) if d else inst(n), t0 + i * step, g * (1 + ramp * i), pan)
def strum(inst, ns, t, g=.4, d=None, spread=.012):
    for k, n in enumerate(ns): M(inst(n, d) if d else inst(n), t + k * spread, g, -.3 + .6 * k / max(1, len(ns) - 1))
MEL = {                                         # giai điệu hộp nhạc (chỉ đặt vào chỗ không có lời)
    'hook': (76, 81, 85), 'turn': (85, 83, 81, 78), 'aww': (88, 85, 81), 'end': (76, 81, 85, 88, 86, 85, 83, 81),
}

# — lớp nhịp theo cảnh (v3): bảng ở MUSIC.md. Ô nhịp valse 1,5 s (ba phách); các điệu bốn phách (rón rén, polka, lắng) dùng ô 2 s —
AVOID = [(2.25, 2.62), (HIT['lensIn'] - .05, HIT['lensIn'] + .4), (HIT['match'] - .05, HIT['match'] + .6), (HIT['nuzzle'][0] + .05, HIT['nuzzle'][0] + .65),
         (16.6, 16.95), (HIT['glass'][1] + .5, HIT['glass'][1] + 1.0), (HIT['laugh'], DUR)]
# Sound Design Plan (11/2026, QUALITY.md §4, SOUND-PLAN.md): mỗi cảnh một phong cách nhạc, một BPM, một nhạc cụ hát chính, một cách chuyển.
# Giữ 120 BPM ở móc (hai cú chạm râu rơi đúng phách "pa-pa") và ở cảnh kết về khung đầu.
G = Groove(M, BEAT, LINES, meter=3, seed=5, avoid=AVOID, plan=True)
G.sec('chạm râu · valse', 0, at(2), 'waltz', 'A', 'A E7', bass='pizzbass', comp='harp', lead='celesta', kit='toy', energy=2, cue=False,
      bpm=120, mood='cute', arc='open', what='Hai chú kiến chạm râu "tách, tách": "What if you said hello with a sniff?" – Crumb: "That\'s how I say hi!"',
      emo='tò mò, dễ thương', why='Valse 3/4 là màu của tập: hai cú chạm râu rơi đúng hai phách "pa-pa"; celesta "ta-da" nhỏ giữa hai câu.')
G.sec('Miss Loupe vào · nảy', at(2), HIT['zoom'], 'hop', 'D', 'D E7', bass='bassn', comp='piano', lead='xylo', kit='bongo', energy=3,
      bpm=132, mood='bouncy', arc='open', what='Miss Loupe nhảy vào: "Let\'s zoom in!"', emo='háo hức',
      why='Rời valse một lúc: nảy lệch phách 4/4, 132 BPM, piano chặn hợp âm và bongo cho cú nhảy vào; đàn hạc vuốt lên (viết tay) khi kính vào.')
G.sec('kính ngửi · mơ màng', HIT['zoom'], HIT['match'], 'waltzfloat', 'A', 'A A D', bass='pizzbass', arp='celesta', lead='flute', energy=1,
      bpm=108, mood='magic', arc='build', what='Trong kính: mây mùi bay ra từ râu: "Their antennae are like noses!"', emo='kỳ diệu, mơ màng',
      why='Valse lơ lửng 108 BPM, hộp nhạc rải như mây mùi, sáo đáp trong khoảng nghỉ lời.')
G.sec('cùng mùi · phong cầm', HIT['match'], HIT['stranger'][0], 'waltz', 'A', 'A A D', bass='pizzbass', comp='accordion', lead='vibes', kit='brush', energy=3,
      bpm=126, mood='cute', arc='peak', what='Hai mây mùi hoà vào nhau, tim bay: "Same smell? Same home!"', emo='ấm áp, vui sướng',
      why='Cao trào ấm của tập: valse trở lại, phong cầm 126 BPM, vibraphone đáp, mô-típ bí mật La–Đô♯–Mi trên hộp nhạc (viết tay) đúng lúc hai mùi hoà.')
G.sec('chú kiến lạ · rình rập', HIT['stranger'][0], HIT['clash'], 'sneak', 'F#m', 'F#m Bm', bass='tuba', comp='pizz', lead='bassoon', kit='wood', energy=1,
      bpm=96, mood='suspense', arc='end', what='Một chú kiến lạ bước tới: "Hey, who\'s that?"', emo='ngờ vực, hồi hộp',
      why='Sang Pha♯ thứ, rình rập 96 BPM: tuba staccato, bassoon dò hỏi, pizzicato rón rén (viết tay).')
G.sec('khác mùi · khựng', HIT['clash'], HIT['stamp'], 'break', 'F#m', 'F#m', cue=False, mood='suspense', arc='end',
      what='Hai mây mùi đụng nhau: "Nope!" – chú kiến lạ nhún vai bỏ đi', emo='bất ngờ, buồn cười',
      why='Khựng nhạc khi khác mùi; tuba "bwomp", kèn dăm "wah-wah", pizzicato "thôi vậy" (viết tay).')
G.sec('sổ · ukulele nắng', HIT['stamp'], HIT['flip'][0], 'sunny', 'A', 'A D E7', bass='pizzbass', comp='pluck', lead='toypiano', kit='clap', energy=2,
      bpm=116, mood='happy', arc='end', what='Sticker dán vào sổ; Albie: "Six legs? In you go!"', emo='vui, tự hào',
      why='Ukulele quạt 4/4, 116 BPM, vỗ tay, piano đồ chơi đáp; không bass dưới giọng trầm của Albie.')
G.sec('lật trang · polka lon ton', HIT['flip'][0], HIT['glass'][0], 'polka', 'A', 'A E7', bass='pizzbass', comp='pizz', lead='xylo', kit='comic', energy=2,
      bpm=132, mood='funny', arc='end', what='Lật trang, Crumb lon ton tới cái kính: "Hello, lens!"', emo='tinh nghịch',
      why='Đổi hẳn sang 4/4: polka lon ton 132 BPM, mõ hai cao độ, xylophone theo bước Crumb.')
G.sec('squeak · lắng', HIT['glass'][0], HIT['laugh'], 'hush', 'Bm', 'Bm E7', arp='glock', energy=1, cue=False,
      bpm=100, mood='suspense', arc='end', what='Crumb ngửi cái kính "squeak", râu xoăn tít: "You don\'t smell like home!"', emo='ngơ ngác, buồn cười',
      why='Lắng gần hết để tiếng "squeak" của kính và câu thoại rõ; chỉ còn glockenspiel thưa; pizzicato "hả?" (viết tay).')
G.sec('cười · về khung đầu', HIT['laugh'], DUR, 'waltz', 'A', 'E7', bass='pizzbass', comp='harp', lead='celesta', kit='tri', energy=3, no=('comp',), reprise=True,
      bpm=120, mood='cute', arc='end', what='Cười: "How do YOU say hi?" – về khung đầu', emo='vui, mời gọi',
      why='Valse của móc trở lại ở 120 BPM để vòng lặp liền; triangle thay phách gỗ và không có đệm để câu hỏi kết rõ.')
G.answer(2.3, HIT['shrug'] + .02, HIT['nope'] + .66, HIT['glass'][1] + .55)   # câu đáp viết tay bên dưới ("ta-da" nhỏ, "thôi vậy", "wah-wah", "hả?")
G.play(); os.makedirs(os.path.join(HERE, 'out'), exist_ok=True); G.save(os.path.join(HERE, 'out', 'music.json'), color='"Tap-Tap Waltz" (La trưởng)')

# — Hook 0–3 s: valse chạy từ giây 0 (lớp nhịp); hai cú "tách" của râu nằm đúng phách pa-pa —
M(pizz(45, .6), 0., 1.1); M(bassn(45, .4), 0., .5); M(celesta(88, .8), 0., .22, .3); M(T._ting(mf(100), .5), 0., .14, .4)
seq(celesta, MEL['hook'], 2.3, BEAT / 2, .3, .3, d=.5)                                    # "ta-da" nhỏ giữa câu móc và câu của Crumb
# — Miss Loupe vào, "Let's zoom in!": đàn hạc vuốt lên —
seq(harp, (69, 73, 76, 81, 85), HIT['lensIn'], .06, .35, .2, d=.4)
M(riser(.6, .8), HIT['zoom'] - .55, .3)

# — Trong kính 5,5–10,5 s: "kính ngửi" mơ màng; mô-típ bí mật khi cùng mùi; kèn dăm (phong cầm) ấm ở nhịp "ồ" —
M(pad([69, 73, 76, 81], 1.8), HIT['clouds'], .3)
secret(M, celesta, 81, HIT['match'], .15, .45, .3)                                        # mô-típ bí mật: La–Đô♯–Mi trên hộp nhạc
M(pad([57, 61, 64, 69], 2.4), HIT['match'], .32)
for i, n in enumerate((61, 64)): M(reed(n, 1.2), 10.45 + i * .02, .2, -.2 + .4 * i)       # phong cầm ấm (dải thấp, sau lời)
seq(celesta, MEL['aww'], HIT['nuzzle'][0] + .1, .16, .28, .3, d=.7)                       # nhịp "ồ": dụi đầu
# — Chú kiến lạ 10,8–14,8 s: Pha♯ thứ, pizzicato rón rén; khựng khi khác mùi; kèn dăm "wah-wah" sau "Nope!" —
for i in range(6): M(pizz((66, 69, 66, 64, 66, 69)[i], .2), HIT['stranger'][0] + i * BEAT / 2 + .05, .3, -.4)
M(tuba(42, .5, 1., -3.), HIT['clash'] + .02, .55)                                         # "bwomp": khác mùi
for i, n in enumerate((64, 63)): M(reed(n, .32), HIT['nope'] + .66 + i * .3, .35, -.3)    # "wah-wah" (sau chữ "Nope!")
seq(pizz, (69, 66), HIT['shrug'] + .02, .2, .4, -.4, d=.3)                                # nhún vai: "thôi vậy"
seq(pizz, (66, 64, 62, 61, 59, 57), HIT['leave'][0] + .1, .12, .3, -.6, d=.2)             # đi về
seq(marimba, (69, 73, 76, 81, 85), HIT['snap'] + .04, .07, .45, .2, ramp=.1)              # v2: "chụp": marimba chạy lên (ban nhạc kênh)
M(T.gliss(81, 100, HIT['zoomIn'][1] - HIT['zoomIn'][0], .28, 'harp'), HIT['zoomIn'][0], .9)   # lao xuyên qua mặt kính
M(T.gliss(96, 79, HIT['zoomOut'][1] - HIT['zoomOut'][0], .2, 'harp'), HIT['zoomOut'][0], .7)   # lùi ra khỏi sticker

# — Sổ 15,3–19,1 s: sticker: hộp nhạc + hợp âm; Crumb ló vào: xylophone —
ti = HIT['zoomOut'][1]; strum(harp, (69, 73, 76, 81), ti, .35, .9); M(celesta(93, 1.0), HIT['stamp'] + .02, .3, .3)
M(xylo(88, .2), 16.65, .25, .5); M(xylo(91, .2), 16.8, .25, .5)                          # Crumb ló vào trang sổ
add(mus, pad([69, 73, 76], 1.15), HIT['glass'][0] + .02, .16, 0); add(mus, celesta(93, .5), HIT['glass'][1] + .05, .12, .3)   # khựng cho tiếng squeak nhưng còn một lớp mỏng
M(T.gliss(76, 100, .45, .3, 'harp'), HIT['flip'][0] + .02, .7)                            # lật trang: đàn hạc vuốt lên

# — Gag 19,1–24 s: khựng cho tiếng squeak; pizzicato "hả?" khi râu xoăn; cả ban nhạc trở lại, dẫn về khung đầu —
seq(pizz, (73, 0, 76), HIT['glass'][1] + .55, .16, .35, .2, d=.25)                       # "hả?" (râu xoăn tít)
for i, n in enumerate((57, 61, 64)): M(pizz(n, .5), HIT['recall'] + i * .012, .5, -.2 + .2 * i)   # v2: chữ móc trở lại: hợp âm La của khung đầu
M(celesta(88, .8), HIT['recall'], .25, .3)
seq(xylo, MEL['end'][:4], HIT['laugh'] + .05, .08, .3, .3, d=.3)
seq(celesta, (76, 80, 83, 86), at(15, 1.5), BEAT / 2, .2, .3, d=.3)
M(pizz(40, .3), DUR - BEAT / 2, .8)                                                       # nốt dẫn (Mi) → La ở 0,0

# — cường độ theo cảnh (chuyển mềm 0,3 s) —
L11 = next(l for l in LINES if l['id'] == 'L11')
LEVEL = ((0, .88), (.5, .8), (HIT['lensIn'], .9), (HIT['zoom'], .75), (HIT['match'], 1.0), (HIT['match'] + .6, .82), (HIT['nuzzle'][0], .8), (HIT['stranger'][0], .85), (HIT['clash'], .95), (HIT['clash'] + .5, .82), (HIT['snap'], 1.0), (ti, .75),
         (HIT['flip'][0], .9), (HIT['walkG'][0], .8), (HIT['glass'][0], .95), (HIT['glass'][1] + .6, .8), (HIT['laugh'], .75), (HIT['recall'], .72), (L11['t'] + L11['dur'], 1.0))   # v3: câu hỏi kết rõ hơn; nhạc dâng sau câu hỏi, dẫn về khung đầu
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
def sniff(v=1.):                                # "khịt": hơi hút vào ngắn, lọc dải
    tt = t_(.22); return bp(noise(.22), 900, 4000) * np.sin(np.pi * tt / .22) ** 2 * (1 + tt / .22) * v * .3
def puff(d=.4, v=1.):                           # "phù": làn hơi mềm
    tt = t_(d); return bp(noise(d), 500, 2600) * np.sin(np.pi * tt / d) ** 2 * v * .22
def squeak(v=1.):                               # râu cọ vào mặt kính: "kít" cao, rung nhanh, hơi rít
    tt = t_(.26); f = 2300 + 350 * np.sin(2 * np.pi * 38 * tt) + 900 * tt / .26
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / .26) ** .6
    return mixl(tone * .2, bp(noise(.26), 2500, 5000) * np.sin(np.pi * tt / .26) * .05) * v
def dingdong():                                 # "ding-dong": cùng mùi, như chuông cửa nhà mình
    return mixl(bell(85, .55, .7), np.pad(bell(81, .5, .8), (int(.3 * SR), 0)))
SFX = {
    'titlepop': lambda e: mixl(T.bubble(1600, .5, .06, 2.4), np.pad(T._ting(mf(103), .5, .35), (int(.02 * SR), 0))),
    'tap': lambda e: mixl(click(.6, .4) * .5, T._ting(mf(e.get('m', 91)), .4, .35)) * e.get('v', 1.),
    'sniff': lambda e: sniff(e.get('v', 1.)),
    'turn': lambda e: T.swish(.25, .18, 1400, 4200, True),
    'swipe': lambda e: T.swipe(e.get('d', .3), .32, True, e.get('lo', 1500), e.get('hi', 5500)),
    'blip': lambda e: T.blip(e.get('m', 88), .3),
    'zoom': lambda e: mixl(riser(.6, 1.), T.whistle(420, 1250, .55, .15)),
    'puffin': lambda e: mixl(puff(.45, 1.), np.pad(T.sparkle(.6, .3, 88, 103, 6, 2, 'up'), (int(.1 * SR), 0))),
    'wisp': lambda e: mixl(T.whistle(2600, 4200, e.get('d', .6), .07), T.sparkle(e.get('d', .6), .22, 93, 108, 6, 4, 'up')),
    'dingdong': lambda e: dingdong(),
    'pops': lambda e: T.pops(e.get('n', 6), e.get('step', .035), e.get('m', 84), e.get('v', .5)),
    'nuzzle': lambda e: mixl(T.bubble(520, .3, .1, 1.6), np.pad(T.bubble(640, .25, .08, 1.6), (int(.18 * SR), 0))),
    'hearts': lambda e: T.pops(3, .12, 91, .3),
    'steps': lambda e: steps(e.get('d', 1.), e.get('n', 8), e.get('v', 1.)),
    'swish': lambda e: T.swish(e.get('d', .45), e.get('v', .4), e.get('lo', 350), e.get('hi', 2600), e.get('up', True)),
    'bonk': lambda e: mixl(T.block(72, .45), np.pad(T.wobble(115, .45, .3, 9, .22), (int(.02 * SR), 0))),
    'shrug': lambda e: mixl(T.blip(86, .25), np.pad(T.blip(81, .22), (int(.14 * SR), 0))),
    'lensiris': lambda e: mixl(T.swirl(.5, .45, 6, 900, 3600), T.sparkle(.45, .35, 91, 108, 6, 9, 'up')),
    'page': lambda e: mixl(T.paper(.35, .45, 5, 1), T.bubble(520, .3, .09)),
    'stamp': lambda e: mixl(thump(.8, 110) * .7, hp(noise(.07), 1200) * env_exp(.07, .012) * .6),
    'ding': lambda e: T.ding(e.get('m', 88), .4, .7),
    'flip': lambda e: mixl(T.paper(e.get('d', .5), .5, 7, 3), T.swish(e.get('d', .5), .22, 700, 3200, True)),
    'squeak': lambda e: squeak(e.get('v', 1.)),
    'boing': lambda e: T.boing(e.get('f0', 150), .5, .3 * e.get('v', .5) / .5, 2.2, 14.),
    'crash': lambda e: mixl(T.swish(e.get('d', .4), .28, 900, 4200, True, .2, .2), T.whistle(700, 1500, e.get('d', .4), .05)),
    'wordpop': lambda e: mixl(T.boing(220 + 120 * e.get('n', 0), .35, .3, 2.4, 16.), np.pad(pop(.6) * .45, (int(.02 * SR), 0)), T.bubble(1300 + 500 * e.get('n', 0), .35, .05, 2.4)),
    'snap': lambda e: mixl(click(1., .25) * .8, np.pad(click(.8, .2) * .5, (int(.045 * SR), 0)), np.pad(T.sparkle(.45, .3, 93, 108, 6, 7, 'up'), (int(.06 * SR), 0))),
    'zoomin': lambda e: mixl(T.swish(e.get('d', .3), .42, 600, 5200, True, .15, .25), riser(e.get('d', .3), .4)),
    'zoomout': lambda e: mixl(T.swish(e.get('d', .35), .3, 500, 3800, False, .25, .2), np.pad(T.paper(.3, .35, 5, 4), (int(.1 * SR), 0))),
    'recall': lambda e: mixl(SFX['titlepop'](e), SFX['wordpop']({'n': 0}), np.pad(SFX['wordpop']({'n': 1}), (int(.12 * SR), 0))),
    'giggle': lambda e: mixl(*(np.pad(xylo(n, .15) * .35, (int(i * .07 * SR), 0)) for i, n in enumerate((84, 88, 84, 88, 91)))),
    'puffiris': lambda e: mixl(T.swirl(.65, .4, 6, 700, 3000), T.revcymbal(.65, .28), puff(.65, .8)),
}
missing = sorted({e['type'] for e in EV} - SFX.keys())
if missing: sys.exit(f'mix.py: no sound for event types {missing}')
VERB = {'dingdong': .5, 'puffin': .4, 'wisp': .4, 'lensiris': .5, 'page': .3, 'swipe': .25, 'zoom': .3, 'titlepop': .3, 'ding': .4, 'flip': .3, 'puffiris': .3, 'squeak': .2}
snd = np.zeros(NW)
for e in EV:
    x = SFX[e['type']](e); add(fx, x, e['t'], 1., e.get('pan', 0))
    if e['type'] in VERB: s0 = int(e['t'] * SR); k = min(len(x), NW - s0); snd[s0:s0 + k] += x[:k] * VERB[e['type']]
fx += T.verb(snd, 1.1) * .35


# ---------- vòng lặp: phần dư sau 24 s cộng vào đầu phim, rồi cắt về đúng độ dài ----------
for k in ('mus', 'fx'):
    b = B[k]; tail = b[N0:].copy(); b[:len(tail)] += tail; B[k] = b[:N].copy()
mus, fx = B['mus'], B['fx']


# ---------- nền: vườn buổi sáng (gió nhẹ trầm, vài tiếng chim rất xa ở chỗ không có lời) ----------
amb = B['amb']
d = DUR; tt = t_(d)
air = lp(brown(d), 260) * .7
add(amb, air * np.minimum(1, tt / .05) * .05, 0, 1., 0)
rng = np.random.default_rng(5)
for t0 in (3.95, 15.0, 18.95, 23.2):                 # chim xa: hai tiếng "chíp" ngắn (2,6–3,6 kHz), chỉ ở chỗ trống
    if speaking(t0, .2): continue
    for k in range(2):
        f0 = rng.uniform(2600, 3200); tw = glide(f0, f0 * 1.18, .07, .06, 0.)
        add(amb, tw, t0 + k * .11, 1., rng.uniform(-.7, .7))


# ---------- giọng ----------
vox = np.zeros(N)
for L in LINES:
    y, sr = sf.read(os.path.join(HERE, 'voice', L['id'] + '.wav'))
    if y.ndim > 1: y = y.mean(1)
    y = soxr.resample(y, sr, SR) * (1.25 if L['id'] == 'L07' else 1.)   # "Nope!" to hơn một chút (trẻ hét theo)
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
mix, I_mix, ceil_db = T.master(mix, 11.6); print(f'master: {I_mix:.1f} LUFS, true-peak ceiling {ceil_db:.1f} dBFS')   # crest 11,6: chừa đỉnh cho AAC (SHORT-004)
nf = int(.02 * SR); mix[:nf] *= np.linspace(0, 1, nf)[:, None]   # mép đầu file: fade-in 20 ms (phim vòng lặp, xem SHORT-002 MUSIC.md)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR, subtype='PCM_24')
for k in ('mus', 'fx', 'vox'): sf.write(os.path.join(HERE, 'out', f'stem_{k}.wav'), B[k].astype(np.float32), SR, subtype='PCM_16')   # để kiểm lời có bị che không

from scipy.signal import welch
f, p = welch(mix.mean(1), SR, nperseg=8192); low = p[(f >= 20) & (f < 120)].mean(); rest = p[(f >= 120) & (f < 8000)].mean()
print(f'low band 20–120 Hz vs 120–8000 Hz: {10 * np.log10(low / rest):+.1f} dB (per-Hz density)')
for name, a, b in (('mở', 0, 3.6), ('soi', 3.6, 10.8), ('lạ', 10.8, 15.3), ('sổ', 15.3, 19.1), ('gag', 19.1, 24)):
    i, j = int(a * SR), int(b * SR)
    print(f'{name:5s}', '  '.join(f'{k}={20 * np.log10(max(rms(B[k][i:j]), 1e-9)):6.1f}' for k in ('mus', 'fx', 'amb', 'vox')), 'dBFS rms')
print('out/mix.wav', f'{len(mix) / SR:.2f} s')
