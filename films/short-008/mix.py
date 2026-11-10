"""Âm thanh của SHORT-008 → out/mix.wav (48 kHz stereo): nhạc theo từng cảnh ("Campfire Glow", La giáng trưởng, MUSIC.md và SOUND-PLAN.md),
tiếng động theo events.json, nền trại đêm, giọng.
python mix.py   (cần timeline.json + voice/*.wav từ tools/lines.mjs và core/tts/tts.py, events.json từ core/render/events.mjs)
Nhạc cụ: _shared/audio/band.py; lớp nhịp theo cảnh: _shared/audio/groove.py (plan=True: phong cách, BPM, chuyển cảnh theo Sound Design Plan);
tiếng động hoạt hình: _shared/audio/toon.py. Không dùng mẫu âm thanh của bên thứ ba.
Phim phát vòng lặp: nốt Đô (bậc năm của Fa thứ) ở cuối dẫn về hợp âm Fa thứ ở 0,0; mọi đuôi tiếng vượt quá 22 s được gấp về đầu phim."""
import os, sys, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio')); sys.path.insert(0, os.path.join(LIB, '_shared', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, thump, pop, click, clack, compress, add
from band import mf, pluck, marimba, bassn, bell, pad, riser, glide, chirp, tuba, pizz, xylo, celesta, harp, reed, bassoon, trumpet, tada, timpani
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
L = {l['id']: l for l in LINES}
def speaking(t, pad_=.05): return any(l['t'] - pad_ <= t < l['t'] + l['dur'] + pad_ for l in LINES)


# ---------- nhạc: "Campfire Glow" — La giáng trưởng (Fa thứ ở móc lạnh), khác 001–007 về giọng, điệu và nhạc cụ hát chính ----------
# Ukulele quạt như hát quanh lửa trại; bassoon và pizzicato "run cầm cập" cho cái lạnh; mỗi cú "pop" trong buồng sáng là một nốt
# glockenspiel đi lên theo thang ngũ cung La giáng (bí mật cũng là một câu nhạc); cao trào gag là "ta-da" kèn trumpet + timpani.
from groove import Groove
mus = B['mus']
def M(x, t, g=1., pan=0.): add(mus, x, t, g, pan)
def seq(inst, ns, t0, step, g=1., pan=0., d=None, ramp=0.):
    for i, n in enumerate(ns):
        if n: M(inst(n, d) if d else inst(n), t0 + i * step, g * (1 + ramp * i), pan)
def strum(inst, ns, t, g=.4, d=None, spread=.012):
    for k, n in enumerate(ns): M(inst(n, d) if d else inst(n), t + k * spread, g, -.3 + .6 * k / max(1, len(ns) - 1))
glock = lambda m, d=.6: T._ting(mf(m), d, 1.) * .5

POPS = HIT['pops']
AVOID = [(0, .45), (HIT['frost'][0] - .05, HIT['frost'][1] + .3), (HIT['flare'][0] - .05, HIT['flare'][0] + .7), (HIT['zoom'][0] - .05, HIT['dive'][1]),
         (POPS[0] - .1, HIT['bloom'] + .8), (HIT['tick'] - .05, HIT['tick'] + .4), (HIT['wink'][0] - .05, HIT['wink'][1] + .2), (HIT['snap'] - .05, HIT['stamp'] + .5),
         (HIT['gulp'] - .1, HIT['gulp'] + .5), (HIT['flip'][0] - .05, HIT['flip'][1] + .1), (L['L08']['t'] + L['L08']['dur'], L['L08']['t'] + L['L08']['dur'] + 1.0), (HIT['recall'] - .05, DUR)]
L8end = L['L08']['t'] + L['L08']['dur']
# Sound Design Plan (11/2026, QUALITY.md §4, SOUND-PLAN.md): mỗi cảnh một phong cách nhạc, một BPM, một nhạc cụ hát chính, một cách chuyển.
# Giữ 120 BPM ở móc và ở cảnh kết (vòng lặp nối về hợp âm Fa thứ của khung đầu) và ở cú bùng sáng của móc (cùng ô nhịp).
G = Groove(M, BEAT, LINES, meter=4, seed=8, avoid=AVOID, plan=True)
G.sec('móc · run cầm cập', 0, 2.4, 'tiptoe', 'Fm', 'Fm Db', bass='pizzbass', comp='marimba', lead='bassoon', kit='comic', energy=2, cue=False,
      bpm=120, mood='funny', arc='open', what='Đêm lạnh: Miss Loupe quàng khăn hơ tay bên "lửa trại" Blink, băng mọc trên tay, cô giật nảy "BRRR!": "Could you glow without getting hot?"',
      emo='buồn cười, tò mò', why='Rón rén hài ở Fa thứ: marimba gõ nhanh "run cầm cập", bassoon trầm là cái lạnh, mõ hai cao độ gõ như răng va; nhạc chạy từ giây 0 dưới câu móc.')
G.sec('"Watch this!" · bùng sáng', 2.4, HIT['raise'][0], 'stab', 'Ab', 'Ab', bass='tuba', comp='trumpet', lead='xylo', kit='epic', energy=3,
      bpm=120, mood='suspense', arc='open', what='Blink quay ra máy: "Watch this!" – đuôi bùng sáng rực cả trại, tay Miss Loupe vẫn đóng băng',
      emo='bất ngờ, phấn khích', why='Dừng nhịp: hai cú chặn của kèn trumpet và timpani rồi để trống cho tiếng bùng sáng; câu hỏi "vì sao sáng mà không nóng" còn bỏ ngỏ.')
G.sec('"Let\'s zoom in!"', HIT['raise'][0], HIT['zoom'][0], 'disco', 'Ab', 'Ab Eb', bass='bassn', comp='strings', lead='marimba', kit='disco', energy=2,
      bpm=128, mood='bouncy', arc='open', what='Miss Loupe giơ kính: "Let\'s zoom in!"', emo='háo hức',
      why='Điệu riêng của tập vào lần đầu: disco 128 BPM (kick bốn phách, hi-hat mở, dàn dây chặn) như một bữa tiệc que phát sáng; marimba đáp ngay sau câu cửa miệng.')
G.sec('buồng sáng · trộn và "pop"', HIT['zoom'][0], HIT['bloom'], 'quest', 'Ab', 'Ab Fm Db Eb', bass='upright', comp='pizz', arp='harp', lead='celesta', kit='tom', energy=2,
      bpm=108, mood='magic', arc='build', what='Kính lớn lao vào trong đèn đuôi: giọt vàng, bong bóng xanh, cánh quạt hồng gặp nhau, "pop!" thành ánh sáng: "Tiny bits mix together and make light!"',
      emo='kỳ diệu, khám phá', why='Phiêu lưu 108 BPM: trống tom nước kiệu như đi vào bên trong, đàn hạc rải; mỗi cú "pop" là một nốt glockenspiel viết tay đi lên, nhanh dần tới lúc bừng sáng.')
G.sec('nhiệt kế · gần như không nóng', HIT['bloom'], HIT['out'][0], 'tiptoe', 'Db', 'Db Ab', bass='bassoonlo', comp='pizz', lead='reed', kit='wood', energy=1,
      bpm=100, mood='funny', arc='build', what='Buồng sáng bừng lên; nhiệt kế tí hon run run, vạch đỏ chỉ nhích một nấc: "Light with almost no heat!"',
      emo='ngạc nhiên, buồn cười', why='Rón rén 100 BPM sau cú bừng sáng: bassoon trầm làm bè, clarinet hỏi nhỏ; xylophone "tích" đúng nấc nhiệt kế nhích (viết tay).')
G.sec('nhịp "ồ" · Blink nháy mắt', HIT['out'][0], HIT['snap'], 'twinkle', 'Ab', 'Ab', bass='bassn', arp='glock', lead='vibes', kit='tri', energy=1,
      bpm=96, mood='cute', arc='build', what='Kính lùi ra khỏi đèn đuôi, Blink nháy mắt, Miss Loupe bật cười', emo='dễ thương, ấm áp',
      why='Một hơi thở dễ thương: hộp nhạc lấp lánh 96 BPM, triangle, celesta ba nốt theo cái nháy mắt (viết tay).')
G.mark('chụp → sổ', HIT['snap'], HIT['stamp'], 'break', 'Ab', 'marimba harp', 2, mood='happy', arc='build', what='Kính "chụp" buồng sáng, máy lao xuyên kính, sticker hiện trên trang sổ',
       emo='háo hức', why='Marimba chạy lên (tiếng "chụp" của ban nhạc kênh), đàn hạc vuốt lên rồi xuống theo cú lao xuyên kính.')
G.sec('sổ · disco que sáng', HIT['stamp'], HIT['flip'][0], 'disco', 'Ab', 'Ab Db', bass='bassn', comp='strings', lead='xylo', kit='disco', energy=2, cue=False,
      bpm=116, mood='happy', arc='build', what='Sticker "Mix and make light!" dán vào sổ; Albie đếm chân: "Six legs? In you go!", Blink lao vào trang đúng chữ "go!"',
      emo='vui, tự hào', why='Disco 116 BPM: kick bốn phách, hi-hat mở, dàn dây chặn, xylophone đáp sau câu cửa miệng; dưới giọng trầm của Albie lớp nhịp tự bỏ bass. '
                           '(11/2026 lượt 2: thay ukulele nắng + piano đồ chơi, công thức trùng ở 5 tập.)')
G.sec('về trại · "You\'re so bright!"', HIT['flip'][0], HIT['blaze'][0] - .1, 'sway', 'Db', 'Db Ab', bass='pizzbass', comp='harp', lead='flute', kit='brush', energy=1,
      bpm=104, mood='cute', arc='build', what='Trang sổ lật về trại: "You\'re so bright, Blink!" – Blink ngượng, lấy chân che mặt',
      emo='ấm áp, ngượng ngùng', why='Nửa nhịp đung đưa 104 BPM, đàn hạc và sáo mềm như lời khen; nhịp chậm lại để cú bùng chói sau đó bật ra.')
G.sec('"I\'m not glowing!" · bùng chói', HIT['blaze'][0] - .1, HIT['blaze'][1], 'disco', 'Ab', 'Ab Eb', bass='bassn', comp='strings', lead='trumpet', kit='disco', energy=3,
      bpm=132, mood='epic', arc='peak', what='Blink chối "I\'m not glowing!" – đúng lúc đuôi bùng chói cả trại, Miss Loupe nheo mắt che kính',
      emo='phấn khích, buồn cười', why='Cao trào hài: disco nhanh nhất tập 132 BPM, dàn dây spiccato chặn, bass quãng tám, timpani nhấn phách đầu; "ta-da" kèn trumpet ngay sau câu chối (viết tay), không đè lên chữ "glowing".')
G.sec('câu hỏi · về khung đầu', HIT['blaze'][1], DUR, 'skip', 'Ab', 'Db Ab,C7', bass='bassn', comp='pluck', lead='glock', kit='toy', energy=2,
      bpm=120, mood='playful', arc='end', what='"What would YOU light up?" – chữ móc trở lại, Miss Loupe lại chìa tay hơ, vòng sáng mở về khung đầu',
      emo='vui, mời gọi', why='Shuffle ukulele 120 BPM; hợp âm Đô bảy ở cuối dẫn về Fa thứ của khung đầu nên vòng lặp liền; glockenspiel nhắc lại "tiếng của ánh sáng".')
G.answer(HIT['frost'][0], HIT['tick'], HIT['wink'][0], L8end + .02)   # câu đáp viết tay bên dưới (băng "tinh tinh", nhiệt kế "tích", nháy mắt, "ta-da")
# v2 (11/2026, lượt 2: chống trùng giữa các tập): disco là điệu riêng của tập (giơ kính, sổ, cao trào "bùng chói": ánh sáng không nóng = tiệc que phát sáng);
# móc đổi sang rón rén + marimba (bassoon vẫn là cái lạnh) vì rình rập + bassoon đã quá quen ở 002, 003, 005.
G.play(); os.makedirs(os.path.join(HERE, 'out'), exist_ok=True); G.save(os.path.join(HERE, 'out', 'music.json'), color='"Campfire Glow" (La giáng trưởng, móc ở Fa thứ; tiệc disco que sáng)')

# — Móc 0–3,9 s: hợp âm Fa thứ ở giây 0; băng mọc: glockenspiel rơi xuống lạnh; giật nảy: pizzicato chặn; bùng sáng: kèn đi lên + đàn hạc vuốt —
M(bassn(41, .5), 0., 1.0); strum(pizz, (53, 56, 60, 65), 0., .32, .3); M(glock(89, .5), 0., .12, .4)
seq(glock, (96, 92, 89, 87, 84), HIT['frost'][0] + .02, .08, .22, .3, d=.4)
strum(pizz, (53, 56, 60), HIT['jolt'], .45, .15); M(bassoon(41, .3), HIT['jolt'], .45)
seq(lambda m, d: trumpet(m, d), (68, 72, 75), HIT['flare'][0] - .02, .09, .32, .1, d=.25); M(trumpet(80, .7), HIT['flare'][0] + .27, .3, .1)
M(T.gliss(68, 96, .45, .3, 'harp'), HIT['flare'][0] + .05, .8)
# — Kính: đàn hạc vuốt lên khi bật về phía máy; dâng lấp lánh khi lao vào đèn đuôi —
M(T.gliss(75, 99, .4, .26, 'harp'), HIT['zoom'][0], .9)
M(T.swell(HIT['dive'][1] - HIT['dive'][0], .5, 80, 100, 3), HIT['dive'][0], .35)
# — Buồng sáng: mỗi cú "pop" một nốt glockenspiel đi lên (thang ngũ cung La giáng), kèm celesta quãng năm nhỏ; bừng sáng: hợp âm La giáng rải + chuông —
for i, (h, m) in enumerate(zip(POPS, (80, 82, 84, 87, 89, 92, 94, 96))):
    M(glock(m, .55), h, .42 + .03 * i, -.3 + .08 * i); M(celesta(m - 5, .5), h + .01, .12, .2)
tb = HIT['bloom']
strum(harp, (68, 72, 75, 80, 84), tb, .38, .9, .025); M(bell(92, .5, 1.3), tb + .05, .35, .3); M(bassn(44, .8), tb, 1.0); M(T.cymbal(1.6, 1., 5200), tb, .14, .2)
# — Nhiệt kế nhích một nấc: xylophone "tích" + mõ; nháy mắt: celesta ba nốt —
M(xylo(91, .2), HIT['tick'], .32, .5); M(T.block(96, .4), HIT['tick'] + .02, .16, .5)
seq(celesta, (87, 91, 94), HIT['wink'][0] - .02, .1, .3, .3, d=.5)
# — Chụp → sổ: marimba chạy lên; đàn hạc vuốt lên/xuống; sticker: đàn hạc rải + hộp nhạc —
seq(marimba, (68, 72, 75, 80, 84), HIT['snap'] + .04, .07, .45, .2, ramp=.1)
M(T.gliss(80, 100, HIT['zoomIn'][1] - HIT['zoomIn'][0], .28, 'harp'), HIT['zoomIn'][0], .9)
M(T.gliss(96, 79, HIT['zoomOut'][1] - HIT['zoomOut'][0], .2, 'harp'), HIT['zoomOut'][0], .7)
strum(harp, (68, 72, 75, 80), HIT['zoomOut'][1], .35, .9); M(celesta(92, 1.0), HIT['stamp'] + .02, .3, .3)
# — Blink lao vào trang: xylophone trượt xuống; sticker tí hon: hộp nhạc; lật trang: đàn hạc vuốt —
seq(xylo, (92, 87, 84, 80, 75), HIT['gulp'] + .02, .05, .35, .1, d=.2)
M(celesta(96, .8), HIT['mini'] + .02, .3, .4)
M(T.gliss(77, 101, .45, .3, 'harp'), HIT['flip'][0] + .02, .7)
# — Gag: "ta-da" ngay sau câu chối (không đè chữ "glowing"); dịu lại: glockenspiel đi xuống —
_x = tada(68, 1.); _s = int((L8end + .03) * SR); mus[_s:_s + len(_x)] += _x * .8
seq(glock, (96, 92, 89, 84, 80), HIT['blaze'][1] + .02, .07, .22, .3, d=.4)
# — Chữ móc trở lại: hợp âm La giáng của ukulele + celesta; nốt dẫn Đô (bậc năm của Fa thứ) → Fa thứ ở 0,0 —
strum(pluck, (56, 60, 63, 68), HIT['recall'], .45, .9); M(celesta(92, .8), HIT['recall'], .25, .3)
M(bassn(48, .3), DUR - BEAT / 2, .9)

# — cường độ theo cảnh (chuyển mềm 0,3 s) —
L1, L4, L5, L7, L9 = L['L01'], L['L04'], L['L05'], L['L07'], L['L09']
LEVEL = ((0, .9), (.25, .74), (HIT['jolt'], .95), (HIT['jolt'] + .5, .76), (HIT['flare'][0], 1.0), (HIT['flare'][1] + .2, .82), (HIT['zoom'][0], .95), (L4['t'], .78),
         (POPS[3], .88), (HIT['bloom'], 1.0), (L5['t'], .76), (HIT['out'][0], .85), (HIT['snap'], 1.0), (HIT['stamp'] + .3, .78), (HIT['gulp'], .95), (HIT['gulp'] + .5, .8),
         (HIT['flip'][0], .9), (L7['t'], .7), (HIT['blaze'][0], .92), (L8end, 1.0), (HIT['blaze'][1] + .3, .8), (L9['t'], .7), (L9['t'] + L9['dur'], 1.0))
tt = np.arange(len(mus)) / SR; lev = np.full(len(mus), LEVEL[0][1])
for (t, g), (_, g0) in zip(LEVEL[1:], LEVEL[:-1]): lev = np.where(tt >= t - .15, np.where(tt < t + .15, g0 + (g - g0) * (tt - t + .15) / .3, g), lev)
mus *= lev[:, None]


# ---------- tiếng động theo sự kiện ----------
fx = B['fx']
def chatter(d, v=1.):                           # răng va lập cập: những tiếng "tách" gỗ nhỏ xen hai cao độ, rất nhanh
    x = np.zeros(int((d + .1) * SR))
    for k in range(int(d / .045)):
        b = T.block(98 if k % 2 else 93, .5 + .3 * (k % 3 == 0)) * .5; s = int(k * .045 * SR); x[s:s + len(b)] += b[:len(x) - s]
    return x * v * .6
def brrr(d, v=1.):                              # "brrr": rung môi, nhiễu dải trầm-trung điều biên 28 Hz, to rồi nhỏ
    tt = t_(d); x = bp(noise(d), 250, 1100) * (.55 + .45 * np.sign(np.sin(2 * np.pi * 28 * tt))) * np.sin(np.pi * tt / d) ** .7
    return x * v * .5
def breathfx(v=1.):                             # hơi thở "phù" trong đêm lạnh
    d = .55; tt = t_(d); return mixl(lp(noise(d), 1400) * np.sin(np.pi * tt / d) ** 2 * .35, T.swish(d, .12, 500, 1600, False)) * v
def frostfx(d, v=1.):                           # băng mọc: lách tách tinh thể + lấp lánh đi xuống
    x = np.zeros(int((d + .7) * SR)); r = np.random.default_rng(3)
    for k in range(7): b = T.tink(.35 + .3 * r.random(), 3800 + 900 * r.random()); s = int(r.uniform(0, d) * SR); x[s:s + len(b)] += b
    sp = T.sparkle(d + .2, .25, 93, 106, 7, 4, 'down')
    return mixl(x, sp) * v
def blaze(d, v=1.):                             # bùng chói "FWOOM": thân trầm dâng + lấp lánh + chũm chọe ngược (dải giọng giữ nhỏ)
    tt = t_(d); body = lp(brown(d), 300) * np.minimum(1, tt / .2) * np.exp(-tt * 1.6) * .8
    return mixl(body, T.sparkle(d * .7, .35, 91, 106, 10, 6, 'up'), np.pad(T.swell(.35, .2, 82, 100, 2), (int(.02 * SR), 0))) * v
def rub(v=1.):                                  # xoa tay
    return mixl(T.paper(.25, .3, 4, 5), np.pad(T.paper(.22, .25, 4, 6), (int(.2 * SR), 0))) * v
SFX = {
    'titlepop': lambda e: mixl(T.bubble(1600, .5, .06, 2.4), np.pad(T._ting(mf(101), .5, .35), (int(.02 * SR), 0))),
    'wordpop': lambda e: mixl(T.boing(220 + 120 * e.get('n', 0), .35, .3, 2.4, 16.), np.pad(pop(.6) * .45, (int(.02 * SR), 0)), T.bubble(1300 + 500 * e.get('n', 0), .35, .05, 2.4)),
    'chatter': lambda e: chatter(e.get('d', .9), e.get('v', 1.)),
    'glowhum': lambda e: T.sparkle(.6, .16, 91, 103, 5, 1, 'up'),
    'breath': lambda e: breathfx(),
    'frost': lambda e: frostfx(e.get('d', .45)),
    'startle': lambda e: T.surprise(.45),
    'brrr': lambda e: brrr(e.get('d', .6)),
    'giggle': lambda e: T.giggle(4, .32, 90, .1, 1),
    'flare': lambda e: mixl(T.sparkle(.6, .35, 88, 103, 7, 3, 'up'), T._ting(mf(92), .8, .4), np.pad(T.swell(.45, .18, 80, 100), (int(.02 * SR), 0)), lp(brown(.5), 250) * env_exp(.5, .15) * .4),
    'swish': lambda e: T.swish(e.get('d', .45), e.get('v', .4), e.get('lo', 350), e.get('hi', 2600), e.get('up', True)),
    'zoom': lambda e: mixl(riser(.4, .8), T.whistle(420, 1250, .4, .12)),
    'dive': lambda e: mixl(T.swirl(e.get('d', .55), .35, 6, 700, 3200), np.pad(T.bubble(420, .35, .12, 1.6), (int(e.get('d', .55) * .8 * SR), 0))),
    'bubbles': lambda e: mixl(T.pops(4, .09, 72, .28), np.pad(T.bubble(380, .25, .1, 1.5), (int(.3 * SR), 0))),
    'mix': lambda e: mixl(pop(.7) * .5, np.pad(T._ting(mf(84 + 2 * e.get('n', 0)), .35, .3), (int(.01 * SR), 0)), T.bubble(900 + 120 * e.get('n', 0), .25, .06, 2.0)),
    'bloom': lambda e: mixl(T.sparkle(.8, .4, 88, 105, 10, 5, 'up'), T.ding(91, .35, 1.0), T.swell(.5, .15, 80, 100, 4)),
    'swipe': lambda e: T.swipe(e.get('d', .3), .32, True, e.get('lo', 1500), e.get('hi', 5500)),
    'tick': lambda e: mixl(click(1.8, .5) * .45, T.block(100, .3)),
    'wink': lambda e: mixl(T.tink(.45, 4400), T.sparkle(.35, .18, 96, 106, 4, 5, 'up')),
    'snap': lambda e: mixl(click(1., .25) * .8, np.pad(click(.8, .2) * .5, (int(.045 * SR), 0)), np.pad(T.sparkle(.45, .3, 93, 108, 6, 7, 'up'), (int(.06 * SR), 0))),
    'zoomin': lambda e: mixl(T.swish(e.get('d', .3), .42, 600, 5200, True, .15, .25), riser(e.get('d', .3), .4)),
    'zoomout': lambda e: mixl(T.swish(e.get('d', .35), .3, 500, 3800, False, .25, .2), np.pad(T.paper(.3, .35, 5, 4), (int(.1 * SR), 0))),
    'page': lambda e: mixl(T.paper(.35, .45, 5, 1), T.bubble(520, .3, .09)),
    'stamp': lambda e: mixl(thump(.8, 110) * .7, hp(noise(.07), 1200) * env_exp(.07, .012) * .6),
    'ding': lambda e: T.ding(e.get('m', 88), .4, .7),
    'zip': lambda e: mixl(T.zip_(e.get('d', .4), 700, 2800, .5), T.swish(e.get('d', .4), .25, 900, 4200, True)),
    'count': lambda e: mixl(T.blip(84 + 3 * e.get('n', 0), .35), T.block(91 + 2 * e.get('n', 0), .25)),
    'jump': lambda e: mixl(T.boing(220, .4, .35, 2.6, 14.), T.swish(.35, .22, 800, 3800, True)),
    'gulp': lambda e: mixl(T.paper(.3, .45, 5, 2), T.boing(170, .45, .4, 2.2, 14.), np.pad(T.bubble(420, .35, .12, 1.4), (int(.08 * SR), 0))),
    'pops': lambda e: T.pops(e.get('n', 6), e.get('step', .035), e.get('m', 84), e.get('v', .5)),
    'flip': lambda e: mixl(T.paper(e.get('d', .5), .5, 7, 3), T.swish(e.get('d', .5), .22, 700, 3200, True)),
    'blush': lambda e: T.sparkle(.4, .25, 93, 105, 5, 2, 'up'),
    'blaze': lambda e: blaze(e.get('d', 1.1), .55),
    'huh': lambda e: mixl(T.boing(300, .3, .22, 2.0, 12.), np.pad(T.blip(86, .3), (int(.1 * SR), 0)), np.pad(T.blip(91, .3), (int(.2 * SR), 0))),
    'dim': lambda e: T.gliss(96, 80, .35, .18, 'ting'),
    'recall': lambda e: mixl(SFX['titlepop'](e), SFX['wordpop']({'n': 0}), np.pad(SFX['wordpop']({'n': 1}), (int(.12 * SR), 0))),
    'rub': lambda e: rub(),
    'glowiris': lambda e: mixl(T.swirl(.6, .4, 6, 700, 3000), T.revcymbal(.6, .28), T.sparkle(.6, .25, 89, 105, 8, 11, 'up')),
}
missing = sorted({e['type'] for e in EV} - SFX.keys())
if missing: sys.exit(f'mix.py: no sound for event types {missing}')
VERB = {'flare': .4, 'zoom': .3, 'titlepop': .3, 'ding': .4, 'flip': .3, 'glowiris': .35, 'page': .3, 'swipe': .25, 'mix': .45, 'bloom': .45, 'wink': .4, 'frost': .35, 'blaze': .3}
snd = np.zeros(NW)
for e in EV:
    x = SFX[e['type']](e); add(fx, x, e['t'], 1., e.get('pan', 0))
    if e['type'] in VERB: s0 = int(e['t'] * SR); k = min(len(x), NW - s0); snd[s0:s0 + k] += x[:k] * VERB[e['type']]
fx += T.verb(snd, 1.3) * .35


# ---------- vòng lặp: phần dư sau 22 s cộng vào đầu phim, rồi cắt về đúng độ dài ----------
for k in ('mus', 'fx'):
    b = B[k]; tail = b[N0:].copy(); b[:len(tail)] += tail; B[k] = b[:N].copy()
mus, fx = B['mus'], B['fx']


# ---------- nền: đêm lạnh (gió nhẹ trầm, dế rất xa ở chỗ không có lời) ----------
amb = B['amb']
d = DUR; tt = t_(d)
add(amb, lp(brown(d), 260) * .7 * np.minimum(1, tt / .05) * .055, 0, 1., 0)
rng = np.random.default_rng(8)
t0 = .7
while t0 < DUR - .5:
    if not speaking(t0, .15) and not (HIT['zoom'][0] - .2 < t0 < HIT['out'][1]) and not (HIT['zoomIn'][0] - .2 < t0 < HIT['flip'][1]):
        add(amb, chirp(1.) * .18, t0, 1., rng.uniform(-.8, .8))
    t0 += rng.uniform(1.0, 1.8)


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
mus *= .075 / max(rms(mus), 1e-9)               # nhạc thấp hơn giọng khoảng 10 dB
fx *= .55 / max(np.abs(fx).max(), 1e-9)
from scipy.ndimage import maximum_filter1d, uniform_filter1d
ve = uniform_filter1d(maximum_filter1d(np.abs(vox), int(.05 * SR)), int(.25 * SR))
B['mus'] = mus = T.duck(mus, ve, .82, .55)          # nhạc nhường giọng: dải chữ 300–4000 Hz −15 dB, bass/lớp sáng −7 dB
B['fx'] = fx = T.duck(fx, ve, .6, .3)                 # tiếng động nhường giọng: dải chữ −8 dB, phần còn lại −3 dB
mix = B['mus'] + B['fx'] + B['amb'] + B['vox']
mix = np.tanh(mix * 1.1) / 1.1
mix, I_mix, ceil_db = T.master(mix, 11.0); print(f'master: {I_mix:.1f} LUFS, true-peak ceiling {ceil_db:.1f} dBFS')
nf = int(.02 * SR); mix[:nf] *= np.linspace(0, 1, nf)[:, None]   # mép đầu file: fade-in 20 ms (phim vòng lặp)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR, subtype='PCM_24')
for k in ('mus', 'fx', 'vox'): sf.write(os.path.join(HERE, 'out', f'stem_{k}.wav'), B[k].astype(np.float32), SR, subtype='PCM_16')   # để kiểm lời có bị che không
for name, a, b in (('móc', 0, 3.85), ('kính', 3.85, 11.9), ('sổ', 11.9, 15.85), ('gag', 15.85, 22)):
    i, j = int(a * SR), int(b * SR)
    print(f'{name:5s}', '  '.join(f'{k}={20 * np.log10(max(rms(B[k][i:j]), 1e-9)):6.1f}' for k in ('mus', 'fx', 'amb', 'vox')), 'dBFS rms')
print('out/mix.wav', f'{len(mix) / SR:.2f} s')
