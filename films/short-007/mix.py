"""Âm thanh của SHORT-007 → out/mix.wav (48 kHz stereo): nhạc theo từng cảnh ("Glow-Code Bossa", Si giáng trưởng, MUSIC.md)
trên lưới 120 BPM (ô nhịp 2 s), nhạc hiệu 0,8 s (band.sting) ở cú lao vào kính, tiếng động theo events.json, nền vườn đêm, giọng.
python mix.py   (cần timeline.json + voice/*.wav từ tools/lines.mjs và core/tts/tts.py, events.json từ core/render/events.mjs)
Nhạc cụ: _shared/audio/band.py; tiếng động hoạt hình: _shared/audio/toon.py (dùng chung cho mọi tập). Không dùng mẫu âm thanh của bên thứ ba.
Phim phát vòng lặp: phách cuối (Fa, bậc năm) dẫn về hợp âm Si giáng ở 0,0; mọi đuôi tiếng vượt quá 44 s được gấp về đầu phim."""
import os, sys, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio')); sys.path.insert(0, os.path.join(LIB, '_shared', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, thump, pop, click, clack, compress, add
from band import mf, pluck, marimba, bassn, bell, pad, riser, glide, chirp, sting
from band import pizz, xylo, flute, celesta, harp, upright, tuba, secret   # màu "Glow-Code Bossa" (MUSIC.md)
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


# ---------- nhạc: "Glow-Code Bossa" — Si giáng trưởng, khác 001 (tổ khúc), 002 (calypso Sol), 003 (swing Rê thứ), 004 (diễu hành Fa),
# 005 (valse La), 006 (đồng quê Mi). Sáo hát giai điệu, đàn hạc và marimba rải, bass gảy, bộ gõ latin (phách gỗ, shaker).
# Mỗi cú nháy của đom đóm là một nốt glockenspiel (tiếng động 'flash', 'code', 'sync'): mật mã ánh sáng cũng là một câu nhạc.
# Mô-típ bí mật Si giáng–Rê–Fa ở ba khoảnh khắc lời giải. Cảnh đặc trưng: tiếng dế của Chirp làm bộ gõ, cả ban nhạc vào.
from groove import Groove
mus = B['mus']
REST = ((HIT['hush'][0] + .03, HIT['hush'][1] - .02),)           # khựng ≤ 1 s trước "Nope!" (vẫn còn một lớp mỏng, viết tay bên dưới)
def M(x, t, g=1., pan=0.):
    if any(a <= t < b for a, b in REST): return
    add(mus, x, t, g, pan)
def seq(inst, ns, t0, step, g=1., pan=0., d=None, ramp=0.):
    for i, n in enumerate(ns):
        if n: M(inst(n, d) if d else inst(n), t0 + i * step, g * (1 + ramp * i), pan)
def strum(inst, ns, t, g=.4, d=None, spread=.012):
    for k, n in enumerate(ns): M(inst(n, d) if d else inst(n), t + k * spread, g, -.3 + .6 * k / max(1, len(ns) - 1))

S0, S1 = HIT['sting']
AVOID = [(S0 - .05, S1 + .1), (HIT['ask'] - .05, HIT['ask'] + .6), (HIT['clack'][0] - .05, HIT['clack'][0] + .5), (HIT['code'][2] - .05, HIT['code'][2] + .6),
         (HIT['snap1'] - .05, HIT['snap1'] + .3), (HIT['snap2'] - .05, HIT['snap2'] + .3), (HIT['snap3'] - .05, HIT['snap3'] + .3), (HIT['gulp'] - .05, HIT['gulp'] + .4),
         (HIT['recall'], DUR)]
# Sound Design Plan (11/2026, QUALITY.md §4, SOUND-PLAN.md): mỗi cảnh một phong cách nhạc, một BPM, một nhạc cụ hát chính, một cách chuyển.
# Giữ 120 BPM ở móc (vòng lặp), ở cảnh cả vườn (Chirp gáy và mọi người nhún đúng phách của hình) và ở cảnh kết nối về khung đầu.
G = Groove(M, BEAT, LINES, meter=4, seed=7, avoid=AVOID, plan=True)
G.sec('móc · đêm lấp lánh', 0, S0, 'bounce', 'Bb', 'Bb F', bass='bassn', comp='marimba', lead='glock', kit='latin', energy=2, cue=False,
      bpm=120, mood='playful', arc='open', what='Blink vụt qua kính, Miss Loupe giật nảy; "Could your tummy glow?" – "My tummy can!", đuôi bùng sáng',
      emo='bất ngờ, tò mò', why='Pop nảy latin vào ngay giây 0 cho cú giật mình; glockenspiel là "tiếng của ánh sáng" xuyên suốt tập, nên móc giới thiệu nó trước.')
G.mark('logo · nhạc hiệu 0,8 s', S0, S1, 'jingle', 'Bb', 'horn marimba bell', 3, mood='epic', arc='open', what='Máy lao vào mặt kính, logo bật lên',
       emo='phấn khích', why='Nhạc hiệu 0,8 s của kênh (kèn đồ chơi, marimba tí hon, chuông) ở nốt chủ Si giáng, nối thẳng vào cảnh sau.')
G.sec('bí mật 1 · ánh sáng lạnh', S1, HIT['hold'][0] + 1.1, 'float', 'Gm', 'Gm7 Ebmaj7', bass='upright', arp='harp', lead='flute', energy=1,
      bpm=100, mood='magic', arc='build', what='"Let\'s zoom in!" Trong kính lớn, đèn đuôi của Blink sáng nhịp nhàng: "Fireflies make cold light!"',
      emo='kỳ diệu, tò mò', why='Lần đầu nhìn vào trong kính: chậm lại 100 BPM, đàn hạc rải lơ lửng, sáo hát trong khoảng nghỉ lời, Sol thứ cho màu đêm huyền bí.')
G.sec('kẹo dẻo · tíc tắc', HIT['hold'][0] + 1.1, HIT['snap1'], 'tiptoe', 'Bb', 'Bb Gm', bass='pizzbass', comp='pizz', lead='bassoon', kit='wood', energy=1,
      bpm=108, mood='funny', arc='build', what='Crumb hơ kẹo dẻo lên bụng Blink, chờ tíc tắc… "Look! No fire!" rồi nhồm nhoàm ăn',
      emo='hài hước, chờ đợi', why='Trò thử kẹo dẻo là gag nhỏ: pizzicato rón rén theo tiếng tíc tắc, bassoon trầm "bùm-bùm" đáp sau "No fire!", mõ gỗ giữ nhịp chờ.')
G.sec('đom đóm là ruồi? · hồi hộp', HIT['snap1'], HIT['hush'][0], 'tension', 'Gm', 'Gm D7', bass='upright', arp='pizz', lead='vibes', kit='tom', energy=2,
      bpm=96, mood='suspense', arc='build', what='Sticker 1 bay lên ô; "Is a firefly a fly?" – bong bóng nghĩ hình con ruồi',
      emo='hồi hộp, thắc mắc', why='Câu hỏi đánh đố: nhịp tim 96 BPM, trống tom và vibraphone run run giữ hồi hộp tới chỗ khựng ngay trước đáp án.')
G.mark('khựng trước "Nope!"', HIT['hush'][0], HIT['hush'][1], 'break', 'Gm', '', 1, mood='suspense', arc='build', what='Bong bóng nghĩ phồng lên… khựng',
       emo='nín thở', why='Khoảng lặng có chủ đích 0,6 s (chỉ còn hợp âm rất nhỏ và trống lăn thì thầm) để "Nope!" bật ra rõ.')
G.sec('họ bọ cánh cứng · đồng diễn', HIT['hush'][1], HIT['snap2'], 'hop', 'Bb', 'Bb Eb F Bb', bass='bassn', comp='piano', lead='xylo', kit='bongo', energy=3,
      bpm=126, mood='bouncy', arc='build', what='"Nope!" Dot lăn vào: "I\'m a little beetle!" – Blink và Dot cùng bật tấm cánh tách tách',
      emo='bất ngờ, vui', why='Đáp án bật ra thành màn đồng diễn: nhảy lệch phách 126 BPM, piano chặn hợp âm, bongo, xylophone đáp theo mỗi cú bật cánh.')
G.sec('"No!" · lén lút', HIT['snap2'], HIT['code'][0] - .5, 'sneak', 'Eb', 'Eb Cm', bass='tuba', comp='accordion', lead='kazoo', kit='jazz', energy=1,
      bpm=104, mood='funny', arc='build', what='"Blink, any more secrets?" – "No!" nhưng đuôi nháy lộ… "Okay, yes."',
      emo='tinh nghịch, hài', why='Tật chối "No!… okay, yes" là gag tính cách: điệu rình rập 104 BPM, tuba staccato, accordion búng nhẹ, kazoo "vè vè" như cười trộm.')
G.sec('mật mã · lấp lánh', HIT['code'][0] - .5, HIT['wide'][0], 'twinkle', 'Bb', 'Bbmaj7 Gm7', bass='bassn', arp='glock', lead='celesta', kit='tri', energy=1,
      bpm=112, mood='magic', arc='build', what='"Some fireflies flash a secret code!" Blink nháy ngắn-ngắn-dài, một bạn ở xa nháy đáp',
      emo='kỳ diệu, bí ẩn', why='Mật mã ánh sáng là một câu nhạc: hộp nhạc 3+3+2 ở dải cao, triangle, celesta đáp đúng lúc bạn ở xa nháy lại.')
G.sec('cả vườn · ban nhạc đêm', HIT['wide'][0], HIT['snap3'], 'hero', 'Bb', 'Bb F Gm Eb', bass='tuba', comp='piano', lead='trumpet', arp='strings', kit='epic', energy=3,
      bpm=120, mood='epic', arc='peak', what='"Light up, everyone!" Cả vườn nháy theo nhịp dế của Chirp; Rollo lăn trên mặt trăng',
      emo='phấn khích, vỡ oà', why='Cao trào duy nhất của tập: dàn dây spiccato, trumpet, timpani và tiếng dế mỗi phách. Giữ 120 BPM vì mọi người nhún đúng phách của hình.')
G.sec('sổ · ukulele nắng', HIT['snap3'], HIT['flip'][0], 'sunny', 'F', 'F Bb', bass='bassn', comp='pluck', lead='toypiano', kit='clap', energy=2,
      bpm=116, mood='happy', arc='end', what='Sticker thứ ba dán vào sổ; Albie đếm "1 2 3": "Six legs? In you go!", Blink lao vào trang',
      emo='vui, thoả mãn', why='Sau cao trào là niềm vui thu hoạch: ukulele quạt, vỗ tay, piano đồ chơi; dưới giọng trầm của Albie lớp nhịp tự bỏ bass.')
G.sec('gag · đêm thì thầm', HIT['flip'][0], HIT['wink'], 'tiptoe', 'Gm', 'Gm Cm', bass='pizzbass', comp='pizz', lead='reed', kit='comic', energy=1,
      bpm=100, mood='suspense', arc='end', what='Ánh lóe trên kính nháy… "Is it winking at me?"',
      emo='ngờ vực, buồn cười', why='Gag cần im để nghe từng cú lóe: rón rén 100 BPM, mõ hai cao độ, clarinet hỏi "hử?" giữa các cú lóe.')
G.sec('nháy đáp · vui', HIT['wink'], HIT['recall'], 'calypso', 'Bb', 'Bb Eb', bass='bassn', comp='marimba', lead='steel', kit='latin', energy=3,
      bpm=132, mood='bouncy', arc='end', what='Miss Loupe nháy mắt, đốm sáng nhỏ nháy đáp ba lần; Blink vui sướng',
      emo='vui, ấm áp', why='Gag được giải: calypso nhanh nhất tập (132 BPM), trống thép reo theo ba cú nháy đáp, màu latin của tập trở lại.')
G.sec('câu hỏi · về khung đầu', HIT['recall'], DUR, 'bounce', 'Bb', 'Bb F', bass='bassn', comp='harp', lead='glock', kit='pop', energy=2,
      bpm=120, mood='happy', arc='end', reprise=True, what='Chữ móc trở lại: "Can YOU blink a secret code?" rồi về khung đầu',
      emo='háo hức, mời gọi', why='Lặp có chủ đích hoà âm Si giáng của móc ở 120 BPM để vòng lặp liền, nhưng đổi đệm sang đàn hạc và bộ gõ pop cho khác mở đầu.')
G.answer(L['L05']['t'] + L['L05']['dur'] + .1, L['L12']['t'] + L['L12']['dur'] + .08, HIT['hush'][1] + .66)   # câu đáp viết tay bên dưới ("ha-ha", "hì", "bwomp")
G.play(); os.makedirs(os.path.join(HERE, 'out'), exist_ok=True); G.save(os.path.join(HERE, 'out', 'music.json'), color='"Glow-Code Bossa" (Si giáng trưởng)')

# — Hook 0–3 s: hợp âm Si giáng ở giây 0; đuôi bùng sáng: marimba chạy lên —
M(bassn(46, .5), 0., 1.0); strum(marimba, (58, 62, 65, 70), 0., .32, .5); M(T._ting(mf(101), .5), 0., .12, .4)
seq(marimba, (70, 74, 77, 82), HIT['flare'][0] + .02, .07, .35, .3, d=.3)
# — Logo: nhạc hiệu 0,8 s của kênh, nốt chủ Si giáng —
_x = sting(1., root=70); _s = int(S0 * SR); mus[_s:_s + len(_x)] += _x * .9          # sting() trả về stereo
# — Bí mật 1: kẹo dẻo không chín = mô-típ bí mật; Blink cười "ha-ha" —
secret(M, celesta, 82, HIT['ask'] + .02, .15, .45, .25)
seq(xylo, (82, 0, 86), L['L05']['t'] + L['L05']['dur'] + .1, .12, .3, .3, d=.2)
seq(marimba, (70, 74, 77, 82, 86), HIT['snap1'] + .04, .07, .45, .2, ramp=.1)         # "chụp": marimba chạy lên (ban nhạc kênh)
# — Bí mật 2: khựng (một lớp mỏng), "Nope!" rồi tuba "bwomp"; tấm cánh bật = mô-típ bí mật —
add(mus, pad([55, 62], .55), HIT['hush'][0] + .03, .12, 0)
M(tuba(46, .42, 1., -2.), HIT['hush'][1] + .66, .7)
secret(M, xylo, 82, HIT['clack'][0] + .02, .15, .45, .25)
seq(marimba, (70, 74, 77, 82, 86), HIT['snap2'] + .04, .07, .45, .2, ramp=.1)
# — Bí mật 3: "Okay, yes." ("hì"), mẫu nháy dài = mô-típ bí mật —
seq(celesta, (86, 82), L['L12']['t'] + L['L12']['dur'] + .08, .14, .25, .3, d=.4)
secret(M, celesta, 70 + 12, HIT['code'][2] + .02, .14, .4, .2)
# — Cảnh đặc trưng: tiếng dế của Chirp giữ nhịp (mỗi phách), cả ban nhạc vào —
c0, c1 = HIT['chirp']; k = 0
while c0 + k * BEAT < c1:
    tt = c0 + k * BEAT; M(chirp(1.), tt, .7 if k % 2 == 0 else .5, .5); k += 1
M(riser(.7, .7), HIT['wide'][0] - .1, .3)
seq(marimba, (70, 74, 77, 82, 86, 89), HIT['snap3'] + .04, .06, .45, .2, ramp=.1)
M(T.gliss(81, 100, HIT['zoomIn'][1] - HIT['zoomIn'][0], .28, 'harp'), HIT['zoomIn'][0], .9)
M(T.gliss(96, 79, HIT['zoomOut'][1] - HIT['zoomOut'][0], .2, 'harp'), HIT['zoomOut'][0], .7)
# — Sổ: sticker (đàn hạc + hộp nhạc); Blink lao vào trang (xylophone trượt xuống) —
ti = HIT['zoomOut'][1]; strum(harp, (65, 69, 72, 77), ti, .35, .9); M(celesta(89, 1.0), HIT['stamp3'] + .02, .3, .3)
seq(xylo, (89, 86, 82, 77, 74), HIT['gulp'] + .02, .05, .35, .1, d=.2)
M(celesta(94, .8), HIT['mini'] + .02, .3, .4)
M(T.gliss(77, 101, .45, .3, 'harp'), HIT['flip'][0] + .02, .7)                       # lật trang
# — Gag: lóe sáng và nháy đáp do tiếng động (glockenspiel); nháy mắt: celesta; cả ban nhạc trở lại —
seq(celesta, (82, 86, 89), HIT['wink'] - .02, .1, .3, .3, d=.5)
for i, n in enumerate((46, 50, 53)): M(pizz(n + 12, .5), HIT['recall'] + i * .012, .5, -.2 + .2 * i)   # chữ móc trở lại: hợp âm Si giáng của khung đầu
M(celesta(94, .8), HIT['recall'], .25, .3)
seq(xylo, (82, 86, 89, 94), at(21, 2), BEAT / 2, .22, .3, d=.3)
M(bassn(41, .3), DUR - BEAT / 2, .9)                                                   # nốt dẫn (Fa) → Si giáng ở 0,0

# — cường độ theo cảnh (chuyển mềm 0,3 s) —
L17 = L['L17']
LEVEL = ((0, .9), (.25, .72), (S0, 1.0), (S1, .76), (HIT['ask'], .95), (HIT['ask'] + .5, .78), (HIT['snap1'], 1.0), (HIT['stamp1'] + .3, .78),
         (HIT['hush'][0], .6), (HIT['hush'][1], .95), (HIT['clack'][0], 1.0), (HIT['clack'][0] + .6, .84), (HIT['snap2'], 1.0), (HIT['stamp2'] + .3, .74),
         (HIT['tattle'][0], .92), (HIT['tattle'][2] + .4, .76), (HIT['code'][0], .84), (HIT['wide'][0], .95), (HIT['sync'][0], 1.0), (HIT['snap3'], 1.0),
         (ti, .78), (HIT['gulp'], .95), (HIT['gulp'] + .5, .8), (HIT['flip'][0], .9), (HIT['flip'][1], .72), (HIT['joy'][0], .96), (HIT['recall'], .8), (L17['t'] + L17['dur'], 1.0))
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
def beep(m, d, v=1.):                           # một cú nháy dài: nốt ngân tròn, có rung nhẹ, tắt mềm
    tt = t_(d + .25); f = mf(m) * (1 + .006 * np.sin(2 * np.pi * 6 * tt))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) + .25 * np.sin(4 * np.pi * np.cumsum(f) / SR)
    e = np.clip(np.minimum(tt / .02, 1), 0, 1) * np.where(tt < d, 1., np.exp(-(tt - d) / .07))
    return x * e * .16 * v
def roll(d, v=1.):                              # Rollo lăn viên tròn: "rù rù" trầm rất nhỏ, nhịp theo vòng lăn
    tt = t_(d); return lp(brown(d), 220) * (.6 + .4 * np.sin(2 * np.pi * 3.2 * tt)) * np.minimum(1, np.minimum(tt, d - tt) / .3) * .5 * v
def hushroll(d, v=1.):                          # trống lăn rất nhỏ khi khựng
    tt = t_(d); return bp(noise(d), 1800, 6000) * (.5 + .5 * np.sign(np.sin(2 * np.pi * 22 * tt))) * np.minimum(1, tt / .1) * .05 * v
def nom(v=1.):                                  # "nhồm": Crumb ăn kẹo dẻo (hai tiếng bong bóng trầm, mềm)
    return mixl(T.bubble(360, .35, .1, 1.3), np.pad(T.bubble(300, .3, .1, 1.2), (int(.16 * SR), 0)), np.pad(T.bubble(330, .25, .08, 1.3), (int(.32 * SR), 0))) * v
SFX = {
    'titlepop': lambda e: mixl(T.bubble(1600, .5, .06, 2.4), np.pad(T._ting(mf(103), .5, .35), (int(.02 * SR), 0))),
    'wordpop': lambda e: mixl(T.boing(220 + 120 * e.get('n', 0), .35, .3, 2.4, 16.), np.pad(pop(.6) * .45, (int(.02 * SR), 0)), T.bubble(1300 + 500 * e.get('n', 0), .35, .05, 2.4)),
    'zip': lambda e: mixl(T.zip_(e.get('d', .4), 700, 2800, .5), T.swish(e.get('d', .4), .25, 900, 4200, True)),
    'flash': lambda e: mixl(T._ting(mf(e.get('m', 94)), .35, e.get('v', .5)), T.bubble(1800, .2 * e.get('v', .5), .05, 2.)),
    'startle': lambda e: mixl(T.boing(240, .35, .3, 2.4, 16.), T.whistle(600, 1400, .22, .07)),
    'land': lambda e: mixl(thump(.5, 160) * .4, T.plip(900, .4)),
    'turn': lambda e: T.swish(.25, .16, 1400, 4200, True),
    'flare': lambda e: mixl(T.sparkle(.6, .35, 88, 103, 7, 3, 'up'), T._ting(mf(94), .8, .4), np.pad(T.swell(.45, .18, 82, 100), (int(.02 * SR), 0))),
    'glint': lambda e: mixl(T.tink(.55, 4200), T._ting(mf(101), .45, .28)),
    'slots': lambda e: T.pops(3, .08, 84, .32),
    'zoom': lambda e: mixl(riser(.4, .8), T.whistle(420, 1250, .4, .12)),
    'logo': lambda e: T.sparkle(.5, .22, 91, 105, 6, 4, 'up'),
    'steps': lambda e: steps(e.get('d', 1.), e.get('n', 8), e.get('v', 1.)),
    'tick': lambda e: mixl(click(1.7 if e.get('n', 0) % 2 == 0 else 1.4, .5) * .45, T.block(98 if e.get('n', 0) % 2 == 0 else 93, .25)),
    'huh': lambda e: mixl(T.boing(300, .3, .22, 2.0, 12.), np.pad(T.blip(86, .3), (int(.1 * SR), 0)), np.pad(T.blip(91, .3), (int(.2 * SR), 0))),
    'munch': lambda e: nom(),
    'snap': lambda e: mixl(click(1., .25) * .8, np.pad(click(.8, .2) * .5, (int(.045 * SR), 0)), np.pad(T.sparkle(.45, .3, 93, 108, 6, 7, 'up'), (int(.06 * SR), 0))),
    'swipe': lambda e: T.swipe(e.get('d', .3), .32, True, e.get('lo', 1500), e.get('hi', 5500)),
    'slotstamp': lambda e: mixl(thump(.7, 120) * .55, hp(noise(.06), 1400) * env_exp(.06, .012) * .45, np.pad(T.ding(89 + 3 * e.get('n', 0), .35, .8), (int(.02 * SR), 0))),
    'bubble': lambda e: mixl(T.pops(3, .06, 79, .3), np.pad(T.bubble(500, .3, .12, 1.8), (int(.12 * SR), 0))),
    'hush': lambda e: hushroll(e.get('d', .5)),
    'pop': lambda e: mixl(pop(1.) * .8, np.pad(T.sparkle(.4, .25, 91, 105, 6, 9, 'down'), (int(.04 * SR), 0))),
    'hop': lambda e: mixl(T.boing(280, .35, .25, 2.4, 16.), T.swish(.3, .18, 900, 3600, True)),
    'clack': lambda e: mixl(clack(1.15 if e.get('n', 0) % 2 == 0 else .9, .9) * .6, T.block(84 if e.get('n', 0) % 2 == 0 else 79, .5), T.swish(.18, .12, 1500, 4500, e.get('n', 0) % 2 == 0)),
    'blush': lambda e: T.sparkle(.4, .25, 93, 105, 5, 2, 'up'),
    'code': lambda e: mixl(T._ting(mf(e.get('m', 93)), .3, .45), beep(e.get('m', 93) - 12, e.get('d', .18), .8)),
    'reply': lambda e: mixl(T._ting(mf(e.get('m', 86)), .4, .35), beep(e.get('m', 86) - 12, .14, .5)),
    'swish': lambda e: T.swish(e.get('d', .45), e.get('v', .4), e.get('lo', 350), e.get('hi', 2600), e.get('up', True)),
    'roll': lambda e: roll(e.get('d', 2.)),
    'sync': lambda e: mixl(*(np.pad(T._ting(mf(m), .4, .22), (int(i * .012 * SR), 0)) for i, m in enumerate((82, 86, 89, 94))), T.sparkle(.35, .12, 94, 106, 4, e.get('n', 0), 'up')),
    'zoomin': lambda e: mixl(T.swish(e.get('d', .3), .42, 600, 5200, True, .15, .25), riser(e.get('d', .3), .4)),
    'zoomout': lambda e: mixl(T.swish(e.get('d', .35), .3, 500, 3800, False, .25, .2), np.pad(T.paper(.3, .35, 5, 4), (int(.1 * SR), 0))),
    'page': lambda e: mixl(T.paper(.35, .45, 5, 1), T.bubble(520, .3, .09)),
    'stamp': lambda e: mixl(thump(.8, 110) * .7, hp(noise(.07), 1200) * env_exp(.07, .012) * .6),
    'ding': lambda e: T.ding(e.get('m', 88), .4, .7),
    'count': lambda e: mixl(T.blip(84 + 3 * e.get('n', 0), .35), T.block(91 + 2 * e.get('n', 0), .25)),
    'jump': lambda e: mixl(T.boing(220, .4, .35, 2.6, 14.), T.swish(.35, .22, 800, 3800, True)),
    'gulp': lambda e: mixl(T.paper(.3, .45, 5, 2), T.boing(170, .45, .4, 2.2, 14.), np.pad(T.bubble(420, .35, .12, 1.4), (int(.08 * SR), 0))),
    'pops': lambda e: T.pops(e.get('n', 6), e.get('step', .035), e.get('m', 84), e.get('v', .5)),
    'flip': lambda e: mixl(T.paper(e.get('d', .5), .5, 7, 3), T.swish(e.get('d', .5), .22, 700, 3200, True)),
    'wink': lambda e: mixl(T.tink(.45, 4400), T.sparkle(.35, .18, 96, 106, 4, 5, 'up')),
    'recall': lambda e: mixl(SFX['titlepop'](e), SFX['wordpop']({'n': 0}), np.pad(SFX['wordpop']({'n': 1}), (int(.12 * SR), 0))),
    'glowiris': lambda e: mixl(T.swirl(.8, .4, 6, 700, 3000), T.revcymbal(.8, .28), T.sparkle(.8, .25, 89, 105, 8, 11, 'up')),
}
missing = sorted({e['type'] for e in EV} - SFX.keys())
if missing: sys.exit(f'mix.py: no sound for event types {missing}')
VERB = {'flash': .3, 'flare': .4, 'glint': .4, 'zoom': .3, 'titlepop': .3, 'ding': .4, 'flip': .3, 'glowiris': .35, 'page': .3, 'swipe': .25, 'code': .45, 'reply': .5, 'sync': .45,
        'slotstamp': .3, 'wink': .4, 'pop': .3}
snd = np.zeros(NW)
for e in EV:
    x = SFX[e['type']](e); add(fx, x, e['t'], 1., e.get('pan', 0))
    if e['type'] in VERB: s0 = int(e['t'] * SR); k = min(len(x), NW - s0); snd[s0:s0 + k] += x[:k] * VERB[e['type']]
fx += T.verb(snd, 1.3) * .35


# ---------- vòng lặp: phần dư sau 44 s cộng vào đầu phim, rồi cắt về đúng độ dài ----------
for k in ('mus', 'fx'):
    b = B[k]; tail = b[N0:].copy(); b[:len(tail)] += tail; B[k] = b[:N].copy()
mus, fx = B['mus'], B['fx']


# ---------- nền: vườn đêm (gió nhẹ trầm, dế rất xa ở chỗ không có lời) ----------
amb = B['amb']
d = DUR; tt = t_(d)
air = lp(brown(d), 240) * .7
add(amb, air * np.minimum(1, tt / .05) * .05, 0, 1., 0)
rng = np.random.default_rng(7)
t0 = .6
while t0 < DUR - .5:                                 # dế xa: một tiếng "rích" nhỏ mỗi 0,9–1,6 s, chỉ ở chỗ trống
    if not speaking(t0, .15) and not (HIT['chirp'][0] - .2 < t0 < HIT['chirp'][1]):
        add(amb, chirp(1.) * .22, t0, 1., rng.uniform(-.8, .8))
    t0 += rng.uniform(.9, 1.6)


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

from scipy.signal import welch
f, p = welch(mix.mean(1), SR, nperseg=8192); low = p[(f >= 20) & (f < 120)].mean(); rest = p[(f >= 120) & (f < 8000)].mean()
print(f'low band 20–120 Hz vs 120–8000 Hz: {10 * np.log10(low / rest):+.1f} dB (per-Hz density)')
for name, a, b in (('móc', 0, 3.8), ('bí mật 1', 3.8, 10.6), ('bí mật 2', 10.6, 17.7), ('bí mật 3', 17.7, 30.45), ('sổ', 30.45, 34.9), ('gag', 34.9, 44)):
    i, j = int(a * SR), int(b * SR)
    print(f'{name:9s}', '  '.join(f'{k}={20 * np.log10(max(rms(B[k][i:j]), 1e-9)):6.1f}' for k in ('mus', 'fx', 'amb', 'vox')), 'dBFS rms')
print('out/mix.wav', f'{len(mix) / SR:.2f} s')
