"""Âm thanh của SHORT-011 → out/mix.wav (48 kHz stereo): nhạc theo từng cảnh ("Tiptoe Cha-Cha", Si trưởng, MUSIC.md và SOUND-PLAN.md),
tiếng động theo events.json, nền khu vườn buổi chiều, giọng.
python mix.py   (cần timeline.json + voice/*.wav từ tools/lines.mjs và core/tts/tts.py, events.json từ core/render/events.mjs)
Nhạc cụ: _shared/audio/band.py; lớp nhịp theo cảnh: _shared/audio/groove.py (plan=True, Sound Design Plan); tiếng động: _shared/audio/toon.py.
Không dùng mẫu âm thanh của bên thứ ba. Phim phát vòng lặp: nốt Fa thăng (bậc năm) ở cuối dẫn về hợp âm Si ở 0,0; đuôi tiếng sau 22 s gấp về đầu phim."""
import os, sys, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio')); sys.path.insert(0, os.path.join(LIB, '_shared', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, thump, pop, click, clack, compress, add
from band import mf, pluck, marimba, bassn, celesta, harp, trumpet, trombone, tuba, xylo, steel, reed, timpani, riser, secret, triangle, pizz, shaker
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


# ---------- nhạc: "Tiptoe Cha-Cha" — Si trưởng, cha-cha-chá rón rén ----------
# Điệu riêng của tập là cha-cha-chá ("một, hai, ba, cha-cha"): bước rón rén của Crumb rơi đúng "cha-cha".
# Crumb có clarinet rón rén; mắt Zip là trống thép lấp lánh; cú "bị thấy rồi!" là mô-típ bí mật đô–mi–sol trên trống thép.
from groove import Groove
mus = B['mus']
def M(x, t, g=1., pan=0.): add(mus, x, t, g, pan)
def seq(inst, ns, t0, step, g=1., pan=0., d=None, ramp=0.):
    for i, n in enumerate(ns):
        if n: M(inst(n, d) if d else inst(n), t0 + i * step, g * (1 + ramp * i), pan)
def strum(inst, ns, t, g=.4, d=None, spread=.012):
    for k, n in enumerate(ns): M(inst(n, d) if d else inst(n), t + k * spread, g, -.3 + .6 * k / max(1, len(ns) - 1))

SP, SW, HD = HIT['split'], HIT['sweep'], HIT['hide']
AVOID = [(0, .45), (HIT['crunch'] - .05, HIT['crunch'] + .45), (SP[0] - .05, SP[1] + .15), (HIT['open'][0] - .05, HIT['wide'][1]), (HIT['spot'] - .05, HIT['spot'] + .6),
         (end('L05'), HD[1] + .1), (end('L06'), HIT['snap']), (HIT['snap'] - .05, HIT['stamp'] + .5), (HIT['gulp'] - .1, HIT['gulp'] + .5), (HIT['flip'][0] - .05, HIT['flip'][1] + .1),
         (HIT['turn'][0] - .1, L['L08']['t']), (end('L09'), DUR)]
# Sound Design Plan (11/2026, QUALITY.md §4, SOUND-PLAN.md): mỗi cảnh một phong cách nhạc, một BPM, một nhạc cụ hát chính, một cách chuyển.
# Giữ 120 BPM ở móc (Crumb nhón từng bước đúng phách của phim) và ở cảnh cuối nối vòng lặp.
G = Groove(M, BEAT, LINES, meter=4, seed=11, avoid=AVOID, plan=True)
G.sec('móc · rón rén cha-cha', 0, L['L02']['t'] - .1, 'chacha', 'B', 'B F#', bass='bassn', comp='marimba', lead='reed', kit='cha', energy=2, cue=False,
      bpm=120, mood='funny', arc='open', what='Crumb nhón chân, giơ biển BOO! sau lưng Zip; "Can you sneak up on a dragonfly?"; giẫm lá khô "rắc", đứng sững một chân',
      emo='tinh nghịch, hồi hộp vui', why='Điệu riêng của tập: cha-cha-chá 120 BPM, mỗi bước nhón chân rơi đúng phách của phim ("một, hai, ba, cha-cha"); chuông bò, guiro và phách vào ngay giây 0; clarinet rón rén đáp sau câu hỏi.')
G.sec('"From behind, it can\'t see me!"', L['L02']['t'] - .1, SP[0], 'skip', 'B', 'B G#m', bass='bassn', comp='pizz', lead='mute', kit='wood', energy=2,
      bpm=116, mood='funny', arc='open', what='Crumb cười trừ, chắc mẩm: "From behind, it can\'t see me!"', emo='tự tin, buồn cười',
      why='Shuffle nhảy chân sáo 116 BPM, vui tươi (11/2026: không dùng điệu rình rập): pizzicato nhón từng nốt; trumpet bịt "wah" như cười thầm, vì trẻ sắp biết Crumb nhầm.')
G.mark('khoá kéo tách khung', SP[0], SP[1], 'break', 'B', 'xylo harp', 2, mood='playful', arc='open', what='Khoá kéo chạy từ trên xuống, tách khung thành "CRUMB SEES" | "ZIP SEES"',
       emo='tò mò', why='Viết tay: xylophone chạy nửa cung đi lên theo con chạy của khoá kéo, đàn hạc vuốt khi hai khung mở ra.')
G.sec('Crumb thấy lưng Zip', SP[1], HIT['open'][0], 'quest', 'E', 'E C#m B', bass='upright', comp='harp', lead='vibes', kit='toy', energy=2,
      bpm=108, mood='playful', arc='build', what='Khung trái: qua vai Crumb chỉ thấy lưng Zip; khung phải: mắt Zip còn nhắm. "Crumb only sees its back."',
      emo='tò mò, chờ đợi', why='Phiêu lưu nước kiệu 108 BPM, vibraphone hát nhẹ: cuộc rình còn đang "êm"; đàn hạc gảy như đếm bước chờ mắt Zip mở.')
G.sec('mắt Zip mở · tầm nhìn nở rộng', HIT['open'][0], L['L05']['t'], 'twinkle', 'B', 'B E', bass='bassn', comp='celesta', lead='steel', kit='tri', energy=2,
      bpm=108, mood='magic', arc='build', what='Mắt Zip mở ra, tầm nhìn nở rộng gần trọn vòng, Crumb trượt vào khung: "But Zip can see Crumb!"; vòng "bị thấy rồi!"',
      emo='kỳ diệu, bất ngờ', why='Hộp nhạc lấp lánh 108 BPM: trống thép là "mắt" của Zip, celesta rải theo tầm nhìn nở ra; mô-típ bí mật đô–mi–sol trên trống thép đúng lúc Crumb bị thấy (viết tay).')
G.mark('"Oh no!" · nấp sau biển', L['L05']['t'], HD[1], 'break', 'B', 'trombone', 1, mood='funny', arc='build', what='Crumb: "Oh no!" rồi nấp sau tấm biển, nhưng Zip vẫn thấy',
       emo='luống cuống, buồn cười', why='Khựng ngắn có chủ đích: chỉ còn guiro cạo nhỏ, trombone "wah-wah" đi xuống sau "Oh no!" (viết tay).')
G.sec('"almost all around!"', HD[1], HIT['snap'], 'chacha', 'B', 'E F# B', bass='bassn', comp='piano', lead='trumpet', kit='cha', energy=3,
      bpm=132, mood='epic', arc='peak', what='"Its big eyes see almost all around!": hai vòm mắt Zip sáng lên, vệt sáng chạy quanh tầm nhìn tới tận phía sau; Crumb ló ra vẫy',
      emo='vỡ lẽ, phấn khích', why='Cao trào theo điệu của tập: cha-cha-chá nhanh 132 BPM, piano chặn "cha-cha", trumpet hát sau câu giải thích; timpani nhấn phách đầu.')
G.mark('chụp → sổ', HIT['snap'], HIT['stamp'], 'break', 'B', 'marimba harp', 2, mood='happy', arc='end', what='Khung "ZIP SEES" được "chụp", hoá thành sticker trên trang sổ',
       emo='háo hức', why='Marimba chạy lên (tiếng "chụp" của ban nhạc kênh), đàn hạc vuốt qua mặt sticker.')
G.sec('sổ · Albie', HIT['stamp'], HIT['flip'][0], 'polka', 'E', 'E B', bass='bassn', comp='pluck', lead='accordion', kit='clap', energy=2, cue=False,
      bpm=116, mood='playful', arc='end', what='Sticker "No sneaking!" dán vào sổ; Albie đếm chân: "Six legs? In you go!", Zip lao vào trang đúng "go!"',
      emo='vui, tự hào', why='Polka 116 BPM, accordion đáp sau câu cửa miệng (kênh chưa dùng polka + accordion); dưới giọng trầm của Albie lớp nhịp tự bỏ bass.')
G.sec('gag · rón rén lần nữa', HIT['flip'][0], HIT['jump'], 'chacha', 'B', 'B F#', bass='tuba', comp='pizz', lead='bassoon', kit='cha', energy=2,
      bpm=112, mood='funny', arc='end', what='Crumb rón rén lại gần, giơ biển cao, hít hơi… Zip quay lại trước "zip!"',
      emo='tinh nghịch, nín thở', why='Lại điệu riêng của tập nhưng chậm 112 BPM, bassoon và tuba rón rén từng bước "cha-cha" (khác móc: clarinet + marimba).')
G.mark('giật mình · ngã ngồi', HIT['jump'], L['L08']['t'], 'break', 'B', 'timpani trumpet tuba', 2, mood='funny', arc='end', what='Crumb tự giật mình, nhảy bật, biển bay vèo, ngã ngồi lên đệm cỏ; biển đáp lên đầu như mũ',
       emo='bất ngờ, buồn cười', why='Stinger viết tay: timpani + trumpet "ta!", tuba "bwomp" đi xuống khi Crumb ngã ngồi, xylophone "plink" khi biển đáp lên đầu.')
G.sec('"Oh! I scared myself!"', L['L08']['t'], L['L09']['t'] - .05, 'sunny', 'E', 'E B', bass='bassn', comp='pluck', lead='xylo', kit='pop', energy=2,
      bpm=124, mood='happy', arc='end', what='Crumb ngồi đội biển "hi!", cười: "Oh! I scared myself!"; Zip cười rung cánh',
      emo='vui, nhẹ nhõm', why='Ukulele quạt nắng 124 BPM, xylophone đáp sau câu cười: không ai đau, cả nhà cùng cười.')
G.sec('câu hỏi · vòng lặp', L['L09']['t'] - .05, DUR, 'hop', 'B', 'B F#', bass='bassn', comp='pluck', lead='marimba', kit='bongo', energy=2,
      bpm=120, mood='bouncy', arc='end', what='"Can YOU sneak up on Zip?"; Zip quay lưng lại, Crumb đứng dậy giơ biển, rón rén về đúng khung đầu',
      emo='mời gọi, háo hức', why='Nảy lệch phách 120 BPM theo lưới của phim để nối vòng lặp; hợp âm Fa thăng ở cuối dẫn về Si của khung đầu.')
G.answer(1.95, end('L05') + .02, end('L06') + .05, HIT['hat'] + .1)   # câu đáp viết tay bên dưới (clarinet, trombone, trống thép "ồ!", xylophone "plink")
G.play(); os.makedirs(os.path.join(HERE, 'out'), exist_ok=True); G.save(os.path.join(HERE, 'out', 'music.json'), color='"Tiptoe Cha-Cha" (Si trưởng, cha-cha-chá rón rén: chuông bò, guiro, phách)')

# — Móc: hợp âm Si ở giây 0; clarinet "rón rén" nhảy quãng sau câu hỏi; lá khô "rắc": clarinet kêu chệch một nốt rồi im —
M(bassn(35, .5), 0., 1.0); strum(marimba, (71, 75, 78, 83), 0., .35, .5); M(T._ting(mf(95), .5, .5) * .5, 0., .12, .4)
seq(lambda m, d: reed(m, d), (78, 83, 81), HIT['crunch'] - .02, .07, .3, -.3, d=.09)
M(reed(86, .25), HIT['crunch'] + .25, .22, -.3)
# — Ngay sau câu của Crumb: pizzicato nhón ba nốt + guiro (shaker) lấp chỗ trống trước khoá kéo (không tụt tiếng) —
seq(lambda m, d: pizz(m, d), (71, 73, 75), end('L02') - .04, .045, .32, -.2, d=.12)
for k in range(4): M(shaker(.8), end('L02') - .1 + k * .06, .8, .2)
# — Khoá kéo: xylophone đi lên nửa cung theo con chạy; hai khung mở: đàn hạc vuốt + triangle —
seq(xylo, list(range(71, 84)), SP[0] + .02, (SP[1] - SP[0]) / 13, .26, .1, d=.12)
M(T.gliss(71, 95, .35, .26, 'harp'), SP[1] - .05, .8); M(triangle(.5, .8), SP[1] + .02, .5, .2)
# — Mắt Zip mở: trống thép rải Si trưởng đi lên; tầm nhìn nở rộng: đàn hạc vuốt chậm —
seq(steel, (71, 75, 78, 83, 87), HIT['open'][0], .07, .3, .35, d=.5)
M(T.gliss(74, 98, HIT['wide'][1] - HIT['wide'][0], .2, 'harp'), HIT['wide'][0], .7)
# — Bị thấy rồi! mô-típ bí mật đô–mi–sol (ở đây Si–Rê thăng–Fa thăng) trên trống thép, kèm celesta quãng tám —
secret(M, lambda m, d=None: steel(m, d or .5), 83, HIT['spot'] + .03, step=.14, g=.42, pan=.3, last=12)
secret(M, lambda m, d=None: celesta(m, d or .6), 71, HIT['spot'] + .05, step=.14, g=.14, pan=-.2)
# — "Oh no!": trombone "wah-wah" đi xuống; nấp sau biển: guiro cạo nhỏ giữ nhịp —
M(trombone(59, .5, 1., -3.), end('L05') + .03, .45, .2)
for k in range(6): M(T.block(84 + (k % 2) * 3, .25), end('L05') + .05 + k * .125, .5, .1)
# — Hai vòm mắt sáng: celesta lấp lánh; vệt sáng chạy quanh: đàn hạc vuốt hai chiều; "ồ!" trống thép + trumpet sau câu giải thích —
M(T.sparkle(.6, .25, 93, 106, 7, 3, 'up'), HIT['glow'][0] + .02, .35, -.3)
M(T.gliss(83, 102, SW[1] - SW[0], .14, 'harp'), SW[0] + .02, .6, .3)
seq(steel, (83, 87, 90, 95), end('L06') + .05, .08, .3, .2, d=.5); seq(lambda m, d: trumpet(m, d), (78, 83), end('L06') + .12, .14, .25, -.1, d=.25)
# — Chụp → sổ: marimba chạy lên; đàn hạc vuốt; sticker: đàn hạc rải + celesta; Zip lao vào trang: xylophone trượt xuống —
seq(marimba, (71, 75, 78, 83, 87), HIT['snap'] + .04, .07, .45, .2, ramp=.1)
M(T.gliss(78, 99, HIT['zoomIn'][1] - HIT['zoomIn'][0], .28, 'harp'), HIT['zoomIn'][0], .9)
M(T.gliss(95, 76, HIT['zoomOut'][1] - HIT['zoomOut'][0], .2, 'harp'), HIT['zoomOut'][0], .7)
strum(harp, (76, 80, 83, 88), HIT['zoomOut'][1], .35, .9); M(celesta(92, 1.0), HIT['stamp'] + .02, .3, .3)
seq(xylo, (92, 88, 83, 80, 76), HIT['gulp'] + .02, .05, .35, .1, d=.2)
M(celesta(95, .8), HIT['mini'] + .02, .3, .4)
M(T.gliss(76, 99, .45, .3, 'harp'), HIT['flip'][0] + .02, .7)
# — Gag: Zip quay lại: trống thép "ping"; Crumb giật mình: timpani + trumpet "ta!"; ngã ngồi: tuba "bwomp"; biển đáp lên đầu: xylophone "plink" —
M(steel(90, .4), HIT['turn'][1], .3, .1)
M(timpani(47, .9, .8), HIT['jump'], .55); M(trumpet(78, .3), HIT['jump'] + .01, .3, -.1); M(trumpet(83, .35), HIT['jump'] + .01, .25, .1)
M(tuba(40, .55, 1., -5.), HIT['land'] + .02, .6)
seq(xylo, (88, 95), HIT['hat'] + .1, .1, .3, -.2, d=.15)
# — Chữ móc trở lại: hợp âm Si nhỏ; nốt dẫn Fa thăng → Si ở 0,0 —
strum(pluck, (71, 75, 78, 83), HIT['recall'], .3, .8)
M(bassn(42, .3), DUR - BEAT / 2, .9)

# — cường độ theo cảnh (chuyển mềm 0,3 s) —
LEVEL = ((0, .9), (.25, .74), (HIT['crunch'], .95), (L['L02']['t'], .72), (SP[0], 1.0), (L['L03']['t'], .74), (HIT['open'][0], .95), (L['L04']['t'], .74),
         (HIT['spot'], 1.0), (L['L05']['t'], .6), (HD[0], .8), (L['L06']['t'], .76), (end('L06'), 1.0), (HIT['snap'], 1.0), (HIT['stamp'] + .3, .78),
         (HIT['gulp'], .95), (HIT['gulp'] + .5, .8), (HIT['flip'][0], .9), (HIT['inhale'], .7), (HIT['jump'], 1.0), (L['L08']['t'], .72), (L['L09']['t'], .7), (end('L09'), .95))
tt = np.arange(len(mus)) / SR; lev = np.full(len(mus), LEVEL[0][1])
for (t, g), (_, g0) in zip(LEVEL[1:], LEVEL[:-1]): lev = np.where(tt >= t - .15, np.where(tt < t + .15, g0 + (g - g0) * (tt - t + .15) / .3, g), lev)
mus *= lev[:, None]


# ---------- tiếng động theo sự kiện ----------
fx = B['fx']
def crunchfx(v=1.):                              # lá khô giòn "rắc": chuỗi tiếng nứt ngắn + một tiếng gãy trầm
    x = np.zeros(int(.45 * SR)); r = np.random.default_rng(4)
    for k in range(9):
        c = bp(noise(.025), 1500 + 2500 * r.random(), 7000) * env_exp(.025, .004) * (1 - .07 * k); s = int((k * .028 + r.uniform(0, .01)) * SR); x[s:s + len(c)] += c[:len(x) - s]
    x[:int(.12 * SR)] += lp(noise(.12), 900) * env_exp(.12, .02) * .8
    return norm(x) * v * .7
def zipperfx(d, v=1.):                           # khoá kéo: răng khoá lách tách dồn nhanh + "zíp" đi lên
    x = np.zeros(int((d + .1) * SR)); n = int(d / .022)
    for k in range(n):
        c = bp(noise(.012), 2500, 8000) * env_exp(.012, .002) * (.5 + .5 * k / n); s = int(k * d / n * SR); x[s:s + len(c)] += c[:len(x) - s]
    z = T.zip_(d, 500, 2200, .5); x[:len(z)] += z
    return norm(x) * v * .7
def inhalefx(v=1.):                              # hít một hơi thật sâu (lấy đà để hù): hơi gió đi lên
    d = .4; tt = t_(d); return T._sweep(noise(d), 600, 2600, .4) * np.sin(np.pi * tt / d) ** 1.5 * .35 * v
def plopfx(v=1.):                                # ngã ngồi lên đệm cỏ: "phịch" mềm + nảy
    return mixl(thump(.7, 120) * .55, T.boing(140, .4, .35, 1.8, 10.), np.pad(lp(noise(.2), 1200) * env_exp(.2, .05) * .3, (int(.02 * SR), 0))) * v
def birds(n=2, seed=0):                          # chim xa líu lo (nền)
    r = np.random.default_rng(seed); x = np.zeros(int(.6 * SR))
    for k in range(n):
        f0 = r.uniform(2800, 3600); w = T.whistle(f0, f0 * r.uniform(1.2, 1.5), .07, 1., .0)
        s = int(k * .13 * SR); x[s:s + len(w)] += w[:len(x) - s]
    return x * .08
SFX = {
    'titlepop': lambda e: mixl(T.bubble(1600, .5, .06, 2.4), np.pad(T._ting(mf(99), .5, .35), (int(.02 * SR), 0))),
    'wordpop': lambda e: mixl(T.boing(220 + 120 * e.get('n', 0), .35, .3, 2.4, 16.), np.pad(pop(.6) * .45, (int(.02 * SR), 0)), T.bubble(1300 + 500 * e.get('n', 0), .35, .05, 2.4)),
    'tiptoe': lambda e: T.footsteps(1, .1, .55, 90 + 2 * (e.get('n', 0) % 3), seed=e.get('n', 0), soft=True),
    'crunch': lambda e: crunchfx(.9),
    'wobble': lambda e: T.wobble(150, e.get('d', .6), .35, 8., .22),
    'twitch': lambda e: T.blip(98, .25),
    'sheepish': lambda e: T.giggle(2, .4, 88, seed=1),
    'titleout': lambda e: T.swish(.3, .22, 900, 3600, False),
    'zipper': lambda e: zipperfx(e.get('d', .5)),
    'panels': lambda e: mixl(T.pops(2, .05, 86, .4), T.paper(.25, .3, 4, 2)),
    'eyeopen': lambda e: mixl(T.swell(.45, .4, 79, 100, 2), T.bubble(700, .3, .1, 2.0)),
    'widen': lambda e: mixl(T.swish(e.get('d', 1.), .3, 400, 2600, True), T.whistle(500, 1200, e.get('d', 1.), .1)),
    'spot': lambda e: mixl(T.ding(93, .6, .8), T.sparkle(.4, .3, 91, 104, 6, 5, 'up')),
    'hide': lambda e: mixl(T.swish(.25, .3, 1200, 3800, False), np.pad(T.paper(.2, .35, 4, 6), (int(.08 * SR), 0))),
    'glow': lambda e: T.sparkle(.6, .3, 93, 106, 8, 7, 'up'),
    'sweep': lambda e: T.swirl(e.get('d', 1.5), .25, 3., 1000, 3600),
    'peek': lambda e: mixl(T.blip(88, .3), np.pad(T.giggle(3, .35, 90, seed=3), (int(.1 * SR), 0))),
    'snap': lambda e: mixl(click(1., .25) * .8, np.pad(click(.8, .2) * .5, (int(.045 * SR), 0)), np.pad(T.sparkle(.45, .3, 93, 108, 6, 7, 'up'), (int(.06 * SR), 0))),
    'zoomin': lambda e: mixl(T.swish(e.get('d', .3), .42, 600, 5200, True, .15, .25), riser(e.get('d', .3), .4)),
    'zoomout': lambda e: mixl(T.swish(e.get('d', .35), .3, 500, 3800, False, .25, .2), np.pad(T.paper(.3, .35, 5, 4), (int(.1 * SR), 0))),
    'page': lambda e: mixl(T.paper(.35, .45, 5, 1), T.bubble(520, .3, .09)),
    'swipe': lambda e: T.swipe(e.get('d', .3), .32, True, e.get('lo', 1500), e.get('hi', 5500)),
    'stamp': lambda e: mixl(thump(.8, 110) * .7, hp(noise(.07), 1200) * env_exp(.07, .012) * .6),
    'ding': lambda e: T.ding(e.get('m', 88), .4, .7),
    'zip': lambda e: mixl(T.zip_(e.get('d', .4), 700, 2800, .5), T.swish(e.get('d', .4), .25, 900, 4200, True)),
    'countA': lambda e: mixl(T.blip(84 + 3 * e.get('n', 0), .35), T.block(91 + 2 * e.get('n', 0), .25)),
    'jump': lambda e: mixl(T.boing(220, .4, .35, 2.6, 14.), T.swish(.35, .22, 800, 3800, True)),
    'gulp': lambda e: mixl(T.paper(.3, .45, 5, 2), T.boing(170, .45, .4, 2.2, 14.), np.pad(T.bubble(420, .35, .12, 1.4), (int(.08 * SR), 0))),
    'pops': lambda e: T.pops(e.get('n', 6), e.get('step', .035), e.get('m', 84), e.get('v', .5)),
    'flip': lambda e: mixl(T.paper(e.get('d', .5), .5, 7, 3), T.swish(e.get('d', .5), .22, 700, 3200, True)),
    'inhale': lambda e: inhalefx(.9),
    'zipturn': lambda e: mixl(T.zip_(e.get('d', .25), 900, 2600, .45 * e.get('v', 1.)), T.swish(e.get('d', .25), .2 * e.get('v', 1.), 1000, 4200, True)),
    'startle': lambda e: mixl(T.surprise(.8), np.pad(T.boing(240, .45, .4, 2.6, 15.), (int(.03 * SR), 0))),
    'signfly': lambda e: mixl(T.swirl(e.get('d', .7), .3, 6., 900, 3600), T.whistle(900, 1600, e.get('d', .7) * .6, .08)),
    'plop': lambda e: plopfx(.9),
    'hat': lambda e: mixl(T.bonk(.45, 79), np.pad(T.bubble(800, .3, .08, 1.8), (int(.05 * SR), 0))),
    'giggle': lambda e: T.giggle(4, .45, 93, .09, seed=5),
    'getup': lambda e: mixl(T.boing(230, .3, .3, 2.2, 14.), T.swish(.3, .18, 800, 3400, True)),
    'recall': lambda e: mixl(SFX['titlepop'](e), SFX['wordpop']({'n': 0}), np.pad(SFX['wordpop']({'n': 1}), (int(.12 * SR), 0))),
}
missing = sorted({e['type'] for e in EV} - SFX.keys())
if missing: sys.exit(f'mix.py: no sound for event types {missing}')
VERB = {'titlepop': .3, 'ding': .4, 'flip': .3, 'page': .3, 'swipe': .25, 'spot': .45, 'glow': .4, 'eyeopen': .35, 'panels': .3, 'sweep': .3}
snd = np.zeros(NW)
for e in EV:
    x = SFX[e['type']](e); add(fx, x, e['t'], 1., e.get('pan', 0))
    if e['type'] in VERB: s0 = int(e['t'] * SR); k = min(len(x), NW - s0); snd[s0:s0 + k] += x[:k] * VERB[e['type']]
fx += T.verb(snd, 1.3) * .35


# ---------- vòng lặp: phần dư sau 22 s cộng vào đầu phim ----------
for k in ('mus', 'fx'):
    b = B[k]; tail = b[N0:].copy(); b[:len(tail)] += tail; B[k] = b[:N].copy()
mus, fx = B['mus'], B['fx']


# ---------- nền: khu vườn buổi chiều (gió lá rất nhỏ, chim xa líu lo ở chỗ không có lời, không có trong sổ) ----------
amb = B['amb']
d = DUR; tt = t_(d)
add(amb, lp(brown(d), 400) * .7 * np.minimum(1, tt / .05) * .05, 0, 1., 0)
rng = np.random.default_rng(11)
t0 = .6
while t0 < DUR - .5:
    if not speaking(t0, .2) and not (HIT['zoomIn'][0] - .2 < t0 < HIT['flip'][1]):
        add(amb, birds(int(rng.integers(2, 4)), int(t0 * 10)), t0, 1., rng.uniform(-.8, .8))
    t0 += rng.uniform(1.1, 1.9)


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
for name, a, b in (('móc', 0, SP[0]), ('chia đôi', SP[0], HIT['zoomIn'][0]), ('sổ', HIT['zoomIn'][0], HIT['flip'][0]), ('gag', HIT['flip'][0], DUR)):
    i, j = int(a * SR), int(b * SR)
    print(f'{name:8s}', '  '.join(f'{k}={20 * np.log10(max(rms(B[k][i:j]), 1e-9)):6.1f}' for k in ('mus', 'fx', 'amb', 'vox')), 'dBFS rms')
print('out/mix.wav', f'{len(mix) / SR:.2f} s')
