"""Âm thanh của LAB · Musical Storytelling (dựng lại từ SHORT-015 → out/mix.wav (48 kHz stereo): nhạc theo từng cảnh ("Leg-Violin Tango", Rê giáng trưởng, MUSIC.md và SOUND-PLAN.md),
tiếng động theo events.json, nền sân khấu lúc chạng vạng, giọng.
python mix.py   (cần timeline.json + voice/*.wav từ tools/lines.mjs và core/tts/tts.py, events.json từ core/render/events.mjs)
Nhạc cụ: _shared/audio/band.py; lớp nhịp theo cảnh: _shared/audio/groove.py (plan=True, Sound Design Plan); tiếng động: _shared/audio/toon.py.
Không dùng mẫu âm thanh của bên thứ ba. Phim phát vòng lặp: nốt La giáng (bậc năm) ở cuối dẫn về hợp âm Rê giáng ở 0,0; đuôi tiếng sau 22 s gấp về đầu phim."""
import os, sys, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio')); sys.path.insert(0, os.path.join(LIB, '_shared', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, thump, pop, click, clack, compress, add
from band import mf, pluck, marimba, bassn, bell, chirp, pizz, xylo, celesta, harp, trombone, kazoo, accordion, strings, upright, vibes, riser, piano
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
wrap = lambda t: t + DUR if t < 0 else t                    # mốc âm (thời gian vòng lặp) thuộc cuối phim


# ---------- nhạc: "Leg-Violin Tango" — Rê giáng trưởng, tango hoạt hình cho cây "vĩ cầm chân" ----------
# Hop có phần viết tay đúng giọng: mỗi lượt kéo to là một nốt pizzicato đi trên thang ngũ cung Rê giáng; trong cận cảnh, mỗi gai vấp qua
# mép cánh là một nốt (đi lên năm nốt, rồi đi xuống nhỏ hơn dưới lời); kéo nhanh thì thành một tràng nốt liền + dây vuốt lên.
from groove import Groove
mus = B['mus']
def M(x, t, g=1., pan=0.): add(mus, x, t, g, pan)
def seq(inst, ns, t0, step, g=1., pan=0., d=None, ramp=0.):
    for i, n in enumerate(ns):
        if n: M(inst(n, d) if d else inst(n), t0 + i * step, g * (1 + ramp * i), pan)
def strum(inst, ns, t, g=.4, d=None, spread=.012):
    for k, n in enumerate(ns): M(inst(n, d) if d else inst(n), t + k * spread, g, -.3 + .6 * k / max(1, len(ns) - 1))
glock = lambda m, d=.6: T._ting(mf(m), d, 1.) * .5
PENT = [61, 63, 65, 68, 70, 73, 75, 77, 80, 82, 85, 87, 89, 92]   # ngũ cung Rê giáng (Db Eb F Ab Bb)

S0, S1, S2 = HIT['strokes0'], HIT['strokes1'], HIT['strokes2']
TU, TD, FZ = HIT['ticksUp'], HIT['ticksDown'], HIT['zzzip']
AVOID = [(0, .3), (2.6, 2.75), (HIT['zoom'][0] - .05, HIT['zoom'][1]), (end('L03'), L['L04']['t']), (HIT['touch'] - .1, TU[-1] + .35),
         (FZ[0] - .05, L['L06']['t']), (HIT['rub'][0], HIT['hush'][1] + .1), (end('L09'), DUR), (DUR - 1.2, DUR)]
# Sound Design Plan (QUALITY.md §4) + bài hát (Musical Storytelling, QUALITY.md §8): cảnh nhạc nào chồng câu hát thì chords='song' và BPM của phần bài hát
# (timeline.js SONG: A 0 s 120 · C 3,6 s 108 · D 9,38 s 126 · E 12,62 s 132 · F 18,6 s 126). Dưới câu hát: hợp âm đủ nhịp, không arp, không câu đáp.
G = Groove(M, BEAT, LINES, meter=4, seed=15, avoid=AVOID, plan=True, song=TL['song'])
G.sec('móc · vĩ cầm chân', 0, 2.6, 'tango', 'Db', 'song', bass='upright', comp='piano', lead='accordion', kit='tango', energy=2, cue=False,
      bpm=120, mood='playful', arc='open', what='Hop kéo đùi sau, "zzip!", nốt nhạc bật ra; Miss Loupe giật mình, hát hỏi "Could you sing with your legs?" (half-sing), ngó chân mình',
      emo='bất ngờ, tò mò', why='Tango 120 BPM của "vĩ cầm chân"; piano chặn hợp âm đủ nhịp dưới câu hỏi nửa hát (song mode), accordion như bandoneon đáp trong khoảng trống.')
G.sec('Hop kéo một tràng · "Let\'s zoom in!"', 2.6, HIT['zoom'][0], 'hop', 'Db', 'Gb Ab', bass='bassn', comp='pluck', lead='xylo', kit='bongo', energy=2,
      bpm=126, mood='bouncy', arc='open', what='Hop kéo một tràng "zzip-zzip-zzip"; Miss Loupe nghiêng đầu "?", nhảy sang: "Let\'s zoom in!" (nói)',
      emo='háo hức, tò mò', why='Nảy lệch phách 126 BPM, ukulele và bongo theo cú nhảy; câu cửa miệng nói thường để tương phản với câu hát.')
G.sec('kính · chân sau kéo', HIT['zoom'][0], HIT['deep'][0], 'tango', 'Db', 'song', bass='pizzbass', comp='accordion', lead='pizz', kit='tango', energy=2,
      bpm=108, mood='magic', arc='build', what='Kính lớn trên chân sau, kính trượt dọc đùi: "Watch Hop\'s back leg!" (sing-talk)',
      emo='tò mò, chăm chú', why='Tango chậm 108 BPM: accordion giữ hợp âm của bài dưới câu sing-talk, dây pizzicato theo từng lượt kéo.')
G.sec('cận cảnh · hàng gai', HIT['deep'][0], HIT['touch'], 'quest', 'Db', 'song', bass='upright', comp='celesta', arp='harp', lead='glock', kit='tri', energy=2, tr='swell',
      bpm=108, mood='magic', arc='build', what='Lao sâu vào hàng gai, lia dọc hàng gai: "Look! A row of tiny pegs!" (half-sing)',
      emo='kỳ diệu, ngạc nhiên', why='Phiêu lưu nhẹ 108 BPM: celesta giữ hợp âm dưới câu nửa hát (arp đàn hạc im dưới giọng, chỉ vang ở khoảng trống), triangle lấp lánh như đèn trên từng gai.')
G.sec('tách từng gai · điệp khúc', HIT['touch'], FZ[0], 'bounce', 'Db', 'song', bass='bassn', comp='pluck', lead='xylo', kit='clap', energy=3,
      bpm=126, mood='happy', arc='build', what='Mỗi gai một tiếng tách và một nốt; điệp khúc lần 1 "Pegs on the leg, scrape on the wing!" (hát trọn)',
      emo='thích thú, hát theo', why='Pop nảy 126 BPM, ukulele quạt và vỗ tay để trẻ hát theo; xylophone đánh đôi giai điệu điệp khúc cao một quãng tám.')
G.sec('"Zzzzip!" · "It\'s like a violin bow!"', FZ[0], HIT['lensDown'][0], 'tango', 'Db', 'song', bass='upright', comp='piano', lead='strings', kit='epic', energy=3, tr='riser',
      bpm=132, mood='epic', arc='peak', what='"zzzzip!", nốt tuôn ra khỏi kính, motif "vĩ cầm chân" trên dàn dây; "It\'s like a violin bow!" (half-sing)',
      emo='vỡ lẽ, phấn khích', why='Cao trào: tango nhanh 132 BPM, dàn dây spiccato chơi motif của tập (câu mở của điệp khúc), timpani nhấn phách đầu.')
G.sec('gag · "Let me try!"', HIT['lensDown'][0], HIT['squeak'], 'stride', 'Db', 'Ab7 Db', bass='tuba', comp='strings', lead='trombone', kit='comic', energy=2,
      bpm=112, mood='funny', arc='end', what='Miss Loupe: "Let me try!" (nói), đứng một chân, kéo chân dọc sườn',
      emo='tự tin, buồn cười', why='Ragtime hài 112 BPM; trombone ngân "ta-daa" giả nghiêm túc trước cú "squeak".')
G.mark('"squeak." · khựng', HIT['squeak'], HIT['hush'][1], 'break', 'Db', 'vibes', 1, mood='funny', arc='end', what='"squeak." bé tí; nhạc khựng, Hop chớp mắt',
       emo='hụt hẫng buồn cười', why='Khựng 0,55 s cho gag (chỉ còn vibraphone run run, không im hẳn).')
G.sec('"Oops! No pegs!"', HIT['hush'][1], HIT['reprise'][0] - .02, 'polka', 'Db', 'Gb Db', bass='tuba', comp='pluck', lead='reed', kit='clap', energy=2,
      bpm=116, mood='funny', arc='end', what='Hop bật cười; Miss Loupe: "Oops! No pegs!" (nói), nhún vai',
      emo='buồn cười, đáng yêu', why='Polka 116 BPM, tuba "oom-pah"; kazoo "hi-hi" viết tay là tiếng cười của Hop.')
G.sec('điệp khúc lần 2', HIT['reprise'][0] - .02, L['L09']['t'] - .05, 'bounce', 'Db', 'song', bass='bassn', comp='pluck', lead='xylo', kit='clap', energy=3, tr='pickup',
      bpm=126, mood='happy', arc='end', reprise=True, what='Điệp khúc lần 2: Miss Loupe hát và nhún nhảy, Hop kéo "vĩ cầm" theo từng phách',
      emo='vui, hát theo', why='Nhắc lại đúng nhạc của điệp khúc lần 1 (reprise) để trẻ nhận ra và hát theo; vỗ tay ở phách 2 và 4.')
G.sec('CTA · Hop lại kéo', L['L09']['t'] - .05, DUR, 'sunny', 'Db', 'Gb Ab', bass='bassn', comp='pluck', lead='flute', kit='toy', energy=2,
      bpm=120, mood='happy', arc='end', what='"Can YOU make music with your legs?" (nói): chữ móc trở lại, Hop giơ chân sau và lại kéo, về đúng khung đầu',
      emo='vui, mời gọi', why='Ukulele nắng 120 BPM (lưới của phim, khớp lượt kéo của Hop ở cuối); hợp âm La giáng dẫn về Rê giáng của khung đầu.')
G.answer(end('L03') + .05, TU[0], FZ[0] + .1, HIT['giggle'][0])   # câu đáp viết tay bên dưới (nốt kéo, năm nốt tách, tràng nốt, kazoo "hi-hi")
G.play()
G.motif(FZ[0] + .08, 'strings', 1.1, .1)                                 # giai điệu đặc trưng của tập (câu mở điệp khúc) trên dàn dây, lúc "zzzzip!"
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True); G.save(os.path.join(HERE, 'out', 'music.json'), color='"Leg-Violin Tango" có lời hát (Rê giáng trưởng; điệp khúc "Pegs on the leg, scrape on the wing!")')

# — Móc: hợp âm Rê giáng ở giây 0 (contrabass + accordion), nối với nốt La giáng ở cuối phim —
M(upright(37, .6), 0., 1.0); strum(accordion, (61, 65, 68, 73), 0., .22, .45, .01)
# — "Vĩ cầm chân" của Hop: mỗi lượt kéo to một nốt pizzicato đi lên trên ngũ cung; tràng ở 2,2 s đi xuống rồi bật lên —
for t, m in zip(HIT['loud0'], (68, 70, 73, 75, 77, 75, 73)): M(pizz(m, .35), wrap(t) + .01, .5, -.3)
M(pizz(80, .5), S0[-2] + .01, .45, -.3)
# — Kính: mỗi lượt kéo một nốt pizzicato (dưới lời: quãng tám trên, nhỏ) —
for i, t in enumerate(S1[:-1]):
    m = (73, 68)[i % 2]; sp = speaking(t + .05, .1); M(pizz(m + (12 if sp else 0), .3), t + .01, .16 if sp else .42, -.15)
M(T.gliss(73, 97, .45, .25, 'harp'), HIT['zoom'][0], .9)
M(T.gliss(70, 99, .5, .3, 'harp'), HIT['deep'][0] + .02, .9)
# — Cận cảnh: hàng gai sáng lần lượt (celesta khẽ), gai chạm mép cánh (một nốt trầm), năm tiếng tách đi lên rồi đi xuống —
seq(celesta, (85, 89, 92, 97), HIT['glint'][0] + .05, .32, .12, .3, d=.6)
M(upright(44, .5), HIT['touch'] + .01, .6)
for i, t in enumerate(TU): M(pizz(PENT[5 + i], .45), t + .005, .55, -.15 + .08 * i); M(glock(PENT[5 + i] + 24, .4), t + .01, .1, .2)
for i, t in enumerate(TD): M(pizz(PENT[9 - i] + 12, .3), t + .005, .14, .15 - .06 * i)
# — "Zzzzip": tràng nốt pizzicato theo từng gai (kéo nhanh dần), dây vuốt lên, đuôi là hợp âm Rê giáng của dàn dây —
fz_n = 22
for k in range(fz_n):
    u = k / fz_n; t = FZ[0] + (FZ[1] - FZ[0]) * (u ** .7)
    M(pizz(PENT[3 + (k % 9)], .2), t, .3 + .25 * u, -.3 + .6 * (k % 2))
seq(strings, (73, 77, 80, 85, 89, 92), FZ[1] - .22, .045, .3, .1, d=.18)
strum(strings, (73, 77, 80, 85), FZ[1] + .06, .26, .25)
# — Vĩ cầm hiện cạnh kính: chuông nhỏ ở dải cao (dưới lời) —
M(glock(97, .4), HIT['violin'] + .02, .08, .5)
# — Gag: trombone "ta-daa" giả nghiêm túc khi Miss Loupe nhấc chân; khựng: vibraphone run run; kazoo "hi-hi" của Hop —
M(trombone(56, .25), HIT['legUp'][0] + .02, .35, .2); M(trombone(61, .55), HIT['legUp'][0] + .3, .38, .2)
for k in range(5): M(vibes(77 if k % 2 else 73, .16), HIT['hush'][0] + .05 + k * .1, .05, .1)
seq(lambda m, d: kazoo(m, d), (80, 77, 80, 77), HIT['giggle'][0] + .02, .055, .2, -.3, d=.05)
# — Chữ móc trở lại: hợp âm Rê giáng nhỏ ở dải cao; nốt dẫn La giáng → Rê giáng ở 0,0 —
strum(pluck, (73, 77, 80, 85), HIT['recall'], .16, .7)
M(bassn(44, .3), DUR - BEAT / 2, .9)

# — cường độ theo cảnh (chuyển mềm 0,3 s) —
LEVEL = ((0, .92), (.3, .8), (end('L01'), .95), (L['L02']['t'], .64), (HIT['zoom'][0], .95), (L['L03']['t'], .8), (end('L03'), .9), (L['L04']['t'], .8),
         (HIT['touch'], 1.0), (L['L05']['t'], .85), (FZ[0], 1.0), (L['L06']['t'], .8), (HIT['lensDown'][0], .92), (L['L07']['t'], .6), (end('L07'), .9),
         (HIT['squeak'], .5), (L['L08']['t'], .6), (L['L10']['t'], .85), (L['L09']['t'], .58), (end('L09'), .95))   # dưới câu nói ≈ 0,6 (câu nói đứng cạnh chỗ khựng nhạc)   # dưới câu hát ≈ 0,8 (QUALITY.md §8)
tt = np.arange(len(mus)) / SR; lev = np.full(len(mus), LEVEL[0][1])
for (t, g), (_, g0) in zip(LEVEL[1:], LEVEL[:-1]): lev = np.where(tt >= t - .15, np.where(tt < t + .15, g0 + (g - g0) * (tt - t + .15) / .3, g), lev)
mus *= lev[:, None]


# ---------- tiếng động theo sự kiện ----------
fx = B['fx']
def fade_safe(x): n = min(len(x), int(.01 * SR)); x = x.copy(); x[:n] *= np.linspace(0, 1, n); x[len(x) - n:] *= np.linspace(1, 0, n); return x
def rasp(d, v=1., rate=70., lo=1500, hi=6500, seed=0, accel=1.):
    """Hop kéo chân "zzip": chuỗi tiếng cạo ngắn (mỗi gai một tiếng) theo nhịp rate/s, to dần rồi nhỏ dần theo lượt kéo; accel: nhanh dần."""
    rng = np.random.default_rng(seed); n = int((d + .05) * SR); x = np.zeros(n); t = 0.
    while t < d:
        u = t / d; g = np.sin(np.pi * u) ** .7; b = bp(noise(.012), lo, hi) * env_exp(.012, .003) * g * (.7 + .3 * rng.random())
        s = int(t * SR); x[s:s + len(b)] += b[:max(0, n - s)]
        t += 1 / (rate * (1 + (accel - 1) * u)) * (.85 + .3 * rng.random())
    return fade_safe(x) * v * .55
def squeakfx(v=1.):                              # "squeak" bé tí: tiếng cao su kêu, cao độ đi lên, rung
    d = .2; tt = t_(d); f = 2100 + 1300 * (tt / d) ** .6 + 90 * np.sin(2 * np.pi * 38 * tt); ph = np.cumsum(f) / SR
    x = (np.sin(2 * np.pi * ph) + .3 * np.sin(4 * np.pi * ph)) * np.sin(np.pi * tt / d) ** .8
    return x * .22 * v
def rubcloth(d, v=1.):                           # cọ chân "phụt phụt" mềm (không có gai nên không có tiếng tách)
    x = np.zeros(int((d + .1) * SR))
    for k in range(int(d / .14)):
        b = bp(noise(.11), 500, 2200) * np.sin(np.pi * t_(.11) / .11) * .35; s = int(k * .14 * SR); x[s:s + len(b)] += b[:len(x) - s]
    return x * v
def tickfx(n, v=1.):                             # một gai vấp qua mép cánh: "tách" giòn + gỗ nhỏ
    return mixl(hp(noise(.02), 2500) * env_exp(.02, .003) * .9, T.block(86 + 2 * (n % 5), .35), click(1.2, .2) * .4) * v
SFX = {
    'titlepop': lambda e: mixl(T.bubble(1600, .5, .06, 2.4), np.pad(T._ting(mf(97), .5, .35), (int(.02 * SR), 0))),
    'wordpop': lambda e: mixl(T.boing(220 + 120 * e.get('n', 0), .35, .3, 2.4, 16.), np.pad(pop(.6) * .45, (int(.02 * SR), 0)), T.bubble(1300 + 500 * e.get('n', 0), .35, .05, 2.4)),
    'scrape': lambda e: rasp(e.get('d', .25), e.get('v', 1.) * (1. if e.get('v', 1.) >= 1 else .7), 62 + 6 * (e.get('n', 0) % 3), 1600 if e.get('v', 1.) >= 1 else 3000, 6500, e.get('n', 0)),
    'notepop': lambda e: mixl(T.bubble(900 + 250 * e.get('n', 0), .35, .06, 2.4), T.plip(1500 + 200 * e.get('n', 0), .25)),
    'startle': lambda e: T.surprise(.7),
    'landsoft': lambda e: mixl(thump(.4, 160) * .45, T.plip(900, .25)) * e.get('v', 1.),
    'wiggle': lambda e: T.footsteps(5, .13, .55, 91, 3, True),
    'hmm': lambda e: mixl(T.blip(79, .25), np.pad(T.blip(86, .3), (int(.1 * SR), 0))),
    'hopL': lambda e: mixl(T.boing(240, .4, .35, 2.4, 15.), T.swish(.3, .18, 900, 3600, True)),
    'zoom': lambda e: mixl(riser(.45, .7), T.whistle(420, 1250, .4, .1)),
    'deep': lambda e: mixl(T.swish(e.get('d', .5), .42, 500, 5200, True, .2, .25), riser(e.get('d', .5), .35), np.pad(T.bubble(380, .5, .14, 1.3), (int(.35 * SR), 0))),
    'glintrun': lambda e: T.sparkle(e.get('d', 1.4), .22, 91, 106, 7, 2, 'up'),
    'touch': lambda e: mixl(T.block(74, .5), thump(.25, 220) * .3),
    'tick': lambda e: tickfx(e.get('n', 0), e.get('v', 1.)),
    'zzzip': lambda e: mixl(rasp(e.get('d', .8), 1.1, 60, 1400, 7000, 9, 4.), T.swish(e.get('d', .8), .18, 900, 5000, True)),
    'notestream': lambda e: T.sparkle(e.get('d', .9), .3, 88, 104, 9, 4, 'up'),
    'deepout': lambda e: mixl(T.swish(e.get('d', .4), .3, 500, 3800, False, .25, .2), np.pad(T.bubble(500, .3, .1), (int(.2 * SR), 0))),
    'violin': lambda e: mixl(T.sparkle(.35, .18, 96, 106, 4, 5, 'up'), T.tink(.25)),
    'lensdown': lambda e: mixl(T.swish(e.get('d', .5), .28, 400, 3000, False, .25, .2), np.pad(thump(.35, 150) * .4, (int(.4 * SR), 0))),
    'step': lambda e: T.footsteps(2, .14, .6, 88, 5),
    'legup': lambda e: mixl(T.swish(.25, .2, 900, 3600, True), np.pad(T.boing(300, .25, .25, 2.2, 14.), (int(.08 * SR), 0))),
    'rubtry': lambda e: rubcloth(e.get('d', .55), .9),
    'squeak': lambda e: squeakfx(1.),
    'blinkhop': lambda e: T.blip(93, .25, .06),
    'giggle': lambda e: T.giggle(5, .6, 88, .1, 2),
    'shrug': lambda e: mixl(T.blip(84, .3), np.pad(T.blip(79, .3), (int(.12 * SR), 0))),
    'ready': lambda e: mixl(T.swish(.3, .15, 1200, 4200, True), np.pad(T.boing(320, .25, .18, 2.2, 14.), (int(.05 * SR), 0))),
    'recall': lambda e: mixl(SFX['titlepop'](e), SFX['wordpop']({'n': 0}), np.pad(SFX['wordpop']({'n': 1}), (int(.12 * SR), 0))),
    'slide': lambda e: mixl(T.swish(e.get('d', .6), .22, 700, 3200, True, .2, .25), T.whistle(600, 900, e.get('d', .6) * .7, .05)),
    'pan': lambda e: T.swish(e.get('d', 1.0), .14, 500, 2600, False, .3, .3),
    'chorus': lambda e: mixl(T.sparkle(.55, .2, 92, 104, 5, 3, 'up'), T.tink(.3)),
}
missing = sorted({e['type'] for e in EV} - SFX.keys())
if missing: sys.exit(f'mix.py: no sound for event types {missing}')
VERB = {'zoom': .3, 'titlepop': .3, 'deep': .3, 'glintrun': .4, 'tick': .35, 'notestream': .4, 'violin': .35, 'squeak': .45, 'deepout': .25}
snd = np.zeros(NW)
for e in EV:
    x = SFX[e['type']](e); add(fx, x, e['t'], 1., e.get('pan', 0))
    if e['type'] in VERB: s0 = int(e['t'] * SR); k = min(len(x), NW - s0); snd[s0:s0 + k] += x[:k] * VERB[e['type']]
fx += T.verb(snd, 1.3) * .35


# ---------- vòng lặp: phần dư sau 22 s cộng vào đầu phim ----------
for k in ('mus', 'fx'):
    b = B[k]; tail = b[N0:].copy(); b[:len(tail)] += tail; B[k] = b[:N].copy()
mus, fx = B['mus'], B['fx']


# ---------- nền: sân khấu ngoài trời lúc chạng vạng (gió nhẹ, lá xào xạc rất nhỏ ở chỗ không có lời) ----------
amb = B['amb']
d = DUR; tt = t_(d)
add(amb, lp(brown(d), 280) * .7 * np.minimum(1, tt / .05) * .05, 0, 1., 0)
rng = np.random.default_rng(15)
t0 = 1.0
while t0 < DUR - .6:
    if not speaking(t0, .2) and not (HIT['deep'][0] - .2 < t0 < HIT['out'][1]):
        add(amb, bp(noise(.5), 2500, 7000) * np.sin(np.pi * t_(.5) / .5) * .025, t0, 1., rng.uniform(-.8, .8))
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
mus *= .075 / max(rms(mus), 1e-9)
fx *= .55 / max(np.abs(fx).max(), 1e-9)
from scipy.ndimage import maximum_filter1d, uniform_filter1d
ve = uniform_filter1d(maximum_filter1d(np.abs(vox), int(.05 * SR)), int(.25 * SR))
sungm = np.zeros(len(ve))                                               # dưới câu hát nhạc lùi ít hơn dưới câu nói (≈ −10 dB thay vì −15 dB ở dải giọng)
for l in LINES:
    if l.get('sung'): sungm[int(l['t'] * SR):int((l['t'] + l['dur']) * SR)] = 1
ve_m = ve * (1 - .15 * uniform_filter1d(sungm, int(.2 * SR)))
B['mus'] = mus = T.duck(mus, ve_m, .82, .55)
B['fx'] = fx = T.duck(fx, ve, .6, .3)
mix = B['mus'] + B['fx'] + B['amb'] + B['vox']
mix = np.tanh(mix * 1.1) / 1.1
mix, I_mix, ceil_db = T.master(mix, 11.0); print(f'master: {I_mix:.1f} LUFS, true-peak ceiling {ceil_db:.1f} dBFS')
nf = int(.02 * SR); mix[:nf] *= np.linspace(0, 1, nf)[:, None]
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR, subtype='PCM_24')
for k in ('mus', 'fx', 'vox'): sf.write(os.path.join(HERE, 'out', f'stem_{k}.wav'), B[k].astype(np.float32), SR, subtype='PCM_16')
for name, a, b in (('móc', 0, 3.6), ('kính', 3.6, 6.6), ('cận', 6.6, 13.75), ('vĩ cầm', 13.75, 15.5), ('gag', 15.5, DUR)):
    i, j = int(a * SR), int(b * SR)
    print(f'{name:6s}', '  '.join(f'{k}={20 * np.log10(max(rms(B[k][i:j]), 1e-9)):6.1f}' for k in ('mus', 'fx', 'amb', 'vox')), 'dBFS rms')
print('out/mix.wav', f'{len(mix) / SR:.2f} s')
