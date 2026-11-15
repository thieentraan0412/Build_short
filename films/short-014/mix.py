"""Âm thanh của SHORT-014 → out/mix.wav (48 kHz stereo): nhạc theo từng cảnh ("Tummy-Rumble Funk", Fa♯ trưởng, MUSIC.md và SOUND-PLAN.md),
tiếng động theo events.json, nền khoảng trống bồ công anh lúc chiều vàng, giọng.
python mix.py   (cần timeline.json + voice/*.wav từ tools/lines.mjs và core/tts/tts.py, events.json từ core/render/events.mjs)
Nhạc cụ: _shared/audio/band.py; lớp nhịp theo cảnh: _shared/audio/groove.py (plan=True, Sound Design Plan); tiếng động: _shared/audio/toon.py.
Tiếng riêng của tập dựng tại đây (không sửa thư viện dùng chung): guitar "gà cục tác" của funk (đăng ký tạm vào groove.PITCHED trong lúc chạy),
tiếng bụng sôi "ục ục" của Crumb, tiếng khúc khích "xè xè" của Hop, cú vọt "boing" và cú rơi về.
Không dùng mẫu âm thanh của bên thứ ba. Phim phát vòng lặp: hợp âm Đô♯7 ở cuối dẫn về Fa♯7 ở 0,0; đuôi tiếng sau 22 s gấp về đầu phim."""
import os, sys, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio')); sys.path.insert(0, os.path.join(LIB, '_shared', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, thump, pop, click, clack, compress, add
from band import mf, fade, pluck, marimba, bassn, bell, chirp, tuba, pizz, xylo, celesta, harp, trumpet, trombone, kazoo, riser, horn, tom, secret, vibes, steel, toypiano
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


# ---------- guitar "gà cục tác" (chicken-scratch) của funk: dây bị chặn, tiếng "chk" + nốt gảy cực ngắn, lọc wah ----------
def guitar(m, d=.1, v=1.):
    d = float(np.clip(d, .05, .16)); f = mf(m); D_ = d + .04; tt = t_(D_)
    x = sum(np.sin(2 * np.pi * f * k * tt * (1 + .0015 * k)) / k for k in range(1, 8)) * np.exp(-tt / (d * .32))
    chk = bp(noise(D_), 1800, 5200) * np.exp(-tt / .009) * .55
    return fade(bp(x, 350, 3200) * 1.3 + chk, .002, .02) * v * .4
import groove
groove.PITCHED['guitar'] = (lambda m, d: guitar(m, d), (55, 72))      # chỉ trong lúc chạy mix.py; groove.py không đổi
groove.FAMILY.setdefault('guitar', 'guitar'); groove.INST_VI.setdefault('guitar', 'guitar "gà cục tác"')
from groove import Groove

# ---------- nhạc: "Tummy-Rumble Funk" — Fa♯ trưởng, funk hợp âm bảy; bụng sôi nằm trong tiếng bass slap ----------
mus = B['mus']
def M(x, t, g=1., pan=0.): add(mus, x, t, g, pan)
def seq(inst, ns, t0, step, g=1., pan=0., d=None, ramp=0.):
    for i, n in enumerate(ns):
        if n: M(inst(n, d) if d else inst(n), t0 + i * step, g * (1 + ramp * i), pan)
def strum(inst, ns, t, g=.4, d=None, spread=.012):
    for k, n in enumerate(ns): M(inst(n, d) if d else inst(n), t + k * spread, g, -.3 + .6 * k / max(1, len(ns) - 1))
glock = lambda m, d=.6: T._ting(mf(m), d, 1.) * .5
F7 = (66, 70, 73, 76); B7 = (71, 75, 78, 81); Cs7 = (68, 73, 77, 80)                  # Fa♯7, Si7, Đô♯7 (giọng guitar)

R = HIT['rumble']
AVOID = [(0, .45), (HIT['zoom'][0] - .05, HIT['zoom'][1] + .1), (HIT['glow'] - .05, HIT['glow'] + .7), (HIT['snap'] - .05, HIT['stamp'] + .5),
         (HIT['gulp'] - .1, HIT['gulp'] + .5), (HIT['flip'][0] - .05, HIT['flip'][1] + .1), (R[0] - .05, HIT['crashOut'][1] + .05),
         (HIT['leap'][0] - .05, HIT['leap'][1] + .2), (HIT['recall'] - .02, HIT['recall'] + .4), (HIT['fall'][1] - .1, DUR)]
# Sound Design Plan (11/2026, QUALITY.md §4, SOUND-PLAN.md): mỗi cảnh một phong cách nhạc, một BPM, một nhạc cụ hát chính, một cách chuyển.
# Giữ 120 BPM (lưới của phim) ở móc, ở cảnh màng nhĩ rung theo phách kick (hình đặt theo lưới phim) và ở cảnh nối vòng lặp.
G = Groove(M, BEAT, LINES, meter=4, seed=14, avoid=AVOID, plan=True)
G.sec('móc · tai ở bụng?', 0, HIT['hopIn'][0], 'funk', 'F#', 'F#7 B7', bass='bassn', comp='guitar', lead='mute', kit='funk', energy=2, cue=False,
      bpm=120, mood='funny', arc='open', what='Crumb áp tai vào bụng Hop: "Could you hear with your tummy?" Hop nhột, khúc khích, nảy lên hất Crumb ra',
      emo='tò mò, buồn cười', why='Điệu riêng của tập: funk 120 BPM vào ngay khung 0, bass slap lệch phách và guitar "gà cục tác" như tiếng bụng; trumpet bịt "wah" đáp sau câu hỏi.')
G.sec('Miss Loupe bật vào · "Well, Hop can!"', HIT['hopIn'][0], HIT['zoom'][0], 'gallop', 'F#', 'F# D#m B C#', bass='bassn', comp='pluck', lead='xylo', kit='toy', energy=2,
      bpm=132, mood='bouncy', arc='open', what='Miss Loupe bật vào từ bên trái: "Well, Hop can!" – "Let\'s zoom in!"', emo='bất ngờ, háo hức',
      why='Phi ngựa nhịp kép 132 BPM theo cú bật vào; ukulele quạt, xylophone đáp giữa hai câu cửa miệng.')
G.sec('kính lớn · tai ở bên bụng', HIT['zoom'][0], HIT['lean'][1], 'quest', 'B', 'B G#m E F#', bass='upright', comp='harp', arp='celesta', lead='flute', kit='tom', energy=2,
      bpm=108, mood='magic', arc='build', what='Kính lớn lướt từ mặt Hop xuống bên bụng; màng nhĩ sáng lên: "Hop\'s ears are on its tummy!" – chữ EAR!',
      emo='kỳ diệu, khám phá', why='Phiêu lưu 108 BPM ở giọng Si (bậc IV): đàn hạc đệm, celesta rải; mô-típ bí mật đô–mi–sol (celesta, viết tay) đúng lúc màng nhĩ sáng.')
G.sec('"Hello in there!" · màng nhĩ rung theo funk', HIT['lean'][1], HIT['snap'], 'funk', 'F#', 'F#7 E7 B7 C#7', bass='bassn', comp='horn', lead='trumpet', kit='funk', energy=3,
      bpm=120, mood='epic', arc='peak', what='Crumb ghé sát: "Hello in there!" – ba vòng sóng làm màng nhĩ gợn; "It\'s an eardrum. Sound makes it wiggle!" – màng nhĩ rung theo giọng và theo phách kick',
      emo='vỡ lẽ, phấn khích', why='Cao trào của tập là chính điệu riêng: funk 120 BPM đủ năng lượng, kèn chặn và trumpet hát; kick rơi đúng lưới phim nên màng nhĩ trong kính rung đúng phách.')
G.mark('chụp → sổ', HIT['snap'], HIT['stamp'], 'break', 'F#', 'marimba harp', 2, mood='happy', arc='end', what='Kính "chụp" màng nhĩ, sticker hiện trên trang sổ',
       emo='háo hức', why='Marimba chạy lên (tiếng "chụp" của ban nhạc kênh), đàn hạc vuốt qua mặt kính.')
G.sec('sổ · Albie', HIT['stamp'], HIT['flip'][0], 'stride', 'F#', 'F# D#m G#m C#7', bass='bassn', comp='piano', lead='toypiano', kit='brush', energy=2, cue=False,
      bpm=112, mood='playful', arc='end', what='Sticker "Tummy ears!" dán vào sổ; Albie đếm chân: "Six legs? In you go!", Hop lao vào trang đúng "go!"',
      emo='vui, tự hào', why='Ragtime 112 BPM, piano "oom-pah" và piano đồ chơi đáp sau câu cửa miệng; dưới giọng trầm của Albie lớp nhịp tự bỏ bass. Khác cảnh sổ của 009 (shuffle + accordion).')
G.sec('gag · bụng sôi "ục ục"', HIT['flip'][0], HIT['leap'][0], 'funk', 'F#', 'B7 F#7', bass='bassn', comp='rhodes', lead='trombone', kit='funk', energy=2,
      bpm=108, mood='funny', arc='end', what='Crumb nhìn vụn bánh, liếm môi; bụng sôi "ục ục" hai lần, máy lao vào màng nhĩ đang rung mạnh',
      emo='buồn cười, hồi hộp nhẹ', why='Funk chậm 100 BPM, phím điện "clav" chặn; bass slap đáp lại từng tiếng "ục ục" (viết tay), trombone "wah" trượt xuống khi Hop giật mình.')
G.sec('Hop vọt khỏi khung · câu hỏi', HIT['leap'][0], HIT['recall'], 'bounce', 'F#', 'F# B', bass='bassn', comp='pluck', lead='steel', kit='pop', energy=2,
      bpm=126, mood='happy', arc='end', what='Hop vọt khỏi khung; Crumb đỏ mặt: "Sorry! My tummy!"; Miss Loupe hỏi: "Can YOUR tummy hear things?"', emo='vui, mời gọi',
      why='Pop nảy 126 BPM, trống thép hát như tiếng nảy của Hop; ukulele quạt nhẹ dưới câu hỏi để trẻ trả lời to.')
G.sec('Hop rơi về · vòng lặp', HIT['recall'], DUR, 'hop', 'F#', 'B C#7', bass='bassn', comp='marimba', lead='kazoo', kit='clap', energy=2,
      bpm=120, mood='bouncy', arc='end', what='Chữ móc trở lại; Hop rơi về đúng chỗ cũ, Crumb chạy lại áp tai (khung đầu)', emo='háo hức, nối vòng',
      why='Nảy lệch phách 120 BPM (lưới phim) cho cú rơi "boing"; hợp âm Đô♯7 ở cuối dẫn về Fa♯7 của khung đầu nên vòng lặp liền.')
G.answer(end('L01') + .1, HIT['glow'], R[0] + .17, R[1] + .17, HIT['leap'][0] + .04)   # câu đáp viết tay bên dưới (trumpet bịt, mô-típ bí mật, bass slap đáp bụng sôi, trumpet vọt)
G.play(); os.makedirs(os.path.join(HERE, 'out'), exist_ok=True); G.save(os.path.join(HERE, 'out', 'music.json'), color='"Tummy-Rumble Funk" (Fa♯ trưởng, funk hợp âm bảy, bass slap = tiếng bụng)')

# — Móc: hợp âm Fa♯7 ở giây 0 (bass slap + guitar chặn) —
M(bassn(42, .3), 0., 1.1); M(bassn(54, .12), .25, .6); strum(guitar, F7, 0., .5, .09); strum(guitar, F7, .375, .35, .06)
# — Hop khúc khích: trumpet bịt "wah-wah" đáp sau câu hỏi của Crumb —
seq(lambda m, d: trumpet(m, d, 1., .8), (73, 76, 73), end('L01') + .1, .11, .3, -.1, d=.12)
# — Kính bật về phía máy: đàn hạc vuốt lên; màng nhĩ sáng: mô-típ bí mật đô–mi–sol (celesta, giọng Si, dải cao) —
M(T.gliss(71, 95, .42, .26, 'harp'), HIT['zoom'][0], .9)
secret(M, lambda m: celesta(m, .7), 83, HIT['glow'], .15, .26, .25, last=12)
# — "Hello in there!": mỗi vòng sóng chạm màng nhĩ một nốt vibraphone cao dần (dải cao, trên giọng) —
hello_hits = [h + .2 for h in HIT['hello']]
for i, h in enumerate(hello_hits): M(vibes(85 + 4 * i, .5), h + .2, .16, -.2 + .2 * i)
# — Chụp → sổ: marimba chạy lên; đàn hạc vuốt; sticker: đàn hạc rải + hộp nhạc; Hop lao vào trang: xylophone trượt xuống; lật trang —
seq(marimba, (66, 70, 73, 78, 82), HIT['snap'] + .04, .07, .45, .2, ramp=.1)
M(T.gliss(78, 97, HIT['zoomIn'][1] - HIT['zoomIn'][0], .28, 'harp'), HIT['zoomIn'][0], .9)
M(T.gliss(94, 78, HIT['zoomOut'][1] - HIT['zoomOut'][0], .2, 'harp'), HIT['zoomOut'][0], .7)
strum(harp, (66, 70, 73, 78), HIT['zoomOut'][1], .35, .9); M(celesta(90, 1.0), HIT['stamp'] + .02, .3, .3)
seq(xylo, (90, 85, 82, 78, 73), HIT['gulp'] + .02, .05, .35, .1, d=.2)
M(celesta(97, .8), HIT['mini'] + .02, .3, .4)
M(T.gliss(73, 97, .45, .3, 'harp'), HIT['flip'][0] + .02, .7)
# — Gag: bass slap đáp từng tiếng "ục ục" (nốt lướt lên, bật dây); trombone "wah" trượt xuống khi Hop giật mình; trumpet vút theo cú vọt —
for i, r in enumerate(R):
    seq(lambda m, d: bassn(m, d), (35, 47, 45) if i == 0 else (35, 47, 49), r + .17, .085, 1.0, 0, d=.14)
M(trombone(57, .45, 1., -4.), HIT['startle'] + .02, .45, .15)
seq(lambda m, d: trumpet(m, d), (73, 78, 82, 85), HIT['leap'][0] + .04, .06, .3, -.1, d=.12)
# — Chữ móc trở lại: Fa♯ chặn nhỏ; cú rơi về: bass Đô♯ dẫn về Fa♯ ở 0,0 —
strum(guitar, F7, HIT['recall'], .35, .08); M(bassn(49, .3), DUR - BEAT / 2, .9)

# — cường độ theo cảnh (chuyển mềm 0,3 s) —
LEVEL = ((0, .92), (.25, .74), (end('L01'), .95), (HIT['bump'][1], .9), (L['L02']['t'], .74), (L['L03']['t'], .78), (HIT['zoom'][0], .98), (L['L04']['t'], .74),
         (HIT['glow'], .82), (end('L04'), .9), (L['L05']['t'], .78), (end('L05'), 1.0), (L['L06']['t'], .74), (HIT['snap'], 1.0), (HIT['stamp'] + .3, .78), (HIT['gulp'], .95), (HIT['gulp'] + .5, .82),
         (HIT['flip'][0], .9), (R[0], .78), (HIT['crashIn'][0], 1.0), (HIT['leap'][0], 1.0), (L['L08']['t'], .72), (L['L09']['t'], .7), (end('L09'), .95))
tt = np.arange(len(mus)) / SR; lev = np.full(len(mus), LEVEL[0][1])
for (t, g), (_, g0) in zip(LEVEL[1:], LEVEL[:-1]): lev = np.where(tt >= t - .15, np.where(tt < t + .15, g0 + (g - g0) * (tt - t + .15) / .3, g), lev)
mus *= lev[:, None]


# ---------- tiếng động theo sự kiện ----------
fx = B['fx']
def tummy(n=0, v=1.):
    """Bụng Crumb sôi "ục ục": tiếng gầm trầm lượn cao độ, rung "r-r-r", kèm bong bóng sôi (dải trầm, không có lời lúc này)."""
    d = .42; tt = t_(d)
    f = (70 if n else 78) * (1 + .22 * np.sin(2 * np.pi * 7 * tt)) * (1 + (.35 if n else -.25) * tt / d)
    ph = np.cumsum(f) / SR; saw = 2 * (ph % 1) - 1
    growl = lp(saw, 480) * (.62 + .38 * np.sign(np.sin(2 * np.pi * 14 * tt)))
    env = np.minimum(1, tt / .03) * np.minimum(1, (d - tt) / .12)
    bub = [np.pad(T.bubble(240 + 80 * k + 40 * n, .5, .06, 1.7), (int((.05 + .085 * k) * SR), 0)) for k in range(4)]
    return mixl(lp(growl * env, 900) * 1.1, mixl(*bub) * .5) * v
def hopgiggle(v=1.):
    """Hop khúc khích: chuỗi "xè-xè" ngắn (cạo nhẹ như chân cọ cánh, cao dần) xen tiếng "hi" nhỏ: tiếng riêng của Hop (không lời)."""
    parts = []
    for k in range(4):
        d = .07; tt = t_(d)
        x = bp(noise(d), 2300 + 350 * k, 4800 + 350 * k) * (.55 + .45 * np.sign(np.sin(2 * np.pi * 85 * tt))) * np.exp(-tt / .028)
        parts.append(np.pad(x * .55, (int(k * .1 * SR), 0)))
    return mixl(mixl(*parts), T.giggle(4, .45, 88, .1, 3) * .7) * v
def strainup(d, v=1.):                           # co chân lấy đà: lên dây cót nhanh dần
    return T.windup(d, .5 * v, 7, 86)
SFX = {
    'titlepop': lambda e: mixl(T.bubble(1600, .5, .06, 2.4), np.pad(T._ting(mf(102), .5, .35), (int(.02 * SR), 0))),
    'wordpop': lambda e: mixl(T.boing(220 + 120 * e.get('n', 0), .35, .3, 2.4, 16.), np.pad(pop(.6) * .45, (int(.02 * SR), 0)), T.bubble(1300 + 500 * e.get('n', 0), .35, .05, 2.4)),
    'press': lambda e: mixl(T.bubble(420, .35, .09, 1.3), thump(.25, 140) * .3),
    'giggle': lambda e: hopgiggle(.9),
    'hop': lambda e: T.boing(250, .3, .3, 2.2, 15.),
    'bump': lambda e: mixl(T.boing(330, .45, .35, 2.6, 14.), T.swish(e.get('d', .5), .2, 900, 3800, True)),
    'plop': lambda e: mixl(T.bonk(.5, 72), thump(.4, 120) * .4),
    'qq': lambda e: mixl(T.blip(84, .3), np.pad(T.blip(89, .3), (int(.11 * SR), 0))),
    'zip': lambda e: mixl(T.zip_(e.get('d', .4), 700, 2800, .5), T.swish(e.get('d', .4), .25, 900, 4200, True)),
    'landL': lambda e: mixl(thump(.6, 150) * .5, T.boing(200, .2, .15, 1.8, 12.)),
    'titleout': lambda e: T.swish(.3, .16, 1200, 4800, False),
    'zoom': lambda e: mixl(riser(.4, .8), T.whistle(420, 1250, .4, .12)),
    'glide': lambda e: T.swish(e.get('d', .9), .12, 500, 2400, False, .4, .3),
    'glowup': lambda e: T.sparkle(.45, .16, 93, 105, 6, 4, 'up'),
    'tag': lambda e: mixl(pop(.5) * .3, T.bubble(1100 + 300 * e.get('n', 0), .3, .05, 2.2)),
    'steps': lambda e: T.footsteps(4, .1, .5, 88, 4),
    'ripple': lambda e: mixl(tom(47 + 2 * e.get('n', 0), .55), T.wobble(150 + 20 * e.get('n', 0), .4, .25)),
    'wiggle': lambda e: T.wobble(130 + 20 * e.get('n', 0), .45, .2),
    'snap': lambda e: mixl(click(1., .25) * .8, np.pad(click(.8, .2) * .5, (int(.045 * SR), 0)), np.pad(T.sparkle(.45, .3, 93, 108, 6, 7, 'up'), (int(.06 * SR), 0))),
    'zoomin': lambda e: mixl(T.swish(e.get('d', .3), .42, 600, 5200, True, .15, .25), riser(e.get('d', .3), .4)),
    'zoomout': lambda e: mixl(T.swish(e.get('d', .35), .3, 500, 3800, False, .25, .2), np.pad(T.paper(.3, .35, 5, 4), (int(.1 * SR), 0))),
    'page': lambda e: mixl(T.paper(.35, .45, 5, 1), T.bubble(520, .3, .09)),
    'swipe': lambda e: T.swipe(e.get('d', .3), .32, True, e.get('lo', 1500), e.get('hi', 5500)),
    'stamp': lambda e: mixl(thump(.8, 110) * .7, hp(noise(.07), 1200) * env_exp(.07, .012) * .6),
    'ding': lambda e: T.ding(e.get('m', 88), .4, .7),
    'hopin': lambda e: mixl(T.boing(200, .45, .4, 2.4, 14.), T.swish(.4, .2, 800, 3600, True)),
    'countA': lambda e: mixl(T.blip(84 + 3 * e.get('n', 0), .35), T.block(91 + 2 * e.get('n', 0), .25)),
    'jump': lambda e: mixl(T.boing(220, .4, .35, 2.6, 14.), T.swish(.35, .22, 800, 3800, True)),
    'gulp': lambda e: mixl(T.paper(.3, .45, 5, 2), T.boing(170, .45, .4, 2.2, 14.), np.pad(T.bubble(420, .35, .12, 1.4), (int(.08 * SR), 0))),
    'pops': lambda e: T.pops(e.get('n', 6), e.get('step', .035), e.get('m', 84), e.get('v', .5)),
    'flip': lambda e: mixl(T.paper(e.get('d', .5), .5, 7, 3), T.swish(e.get('d', .5), .22, 700, 3200, True)),
    'glance': lambda e: T.blip(88, .3),
    'lick': lambda e: mixl(T.bubble(650, .45, .08, 1.5), np.pad(T.bubble(820, .35, .07, 1.6), (int(.09 * SR), 0)), np.pad(T.whistle(700, 1000, .14, .08), (int(.04 * SR), 0))),
    'rumble': lambda e: tummy(e.get('n', 0), 1.0),
    'crash': lambda e: mixl(T.swish(e.get('d', .15) + .1, .45, 600, 5200, True, .08, .3), T.zip_(.18, 900, 2600, .35)),
    'thrum': lambda e: mixl(tom(43 + 3 * e.get('n', 0), .9), T.wobble(110 + 15 * e.get('n', 0), .6, .55, 9., .3)),
    'crashout': lambda e: T.swish(e.get('d', .16) + .1, .35, 500, 4200, False, .1, .3),
    'startle': lambda e: T.surprise(.6),
    'crouch': lambda e: strainup(.18, 1.),
    'leap': lambda e: mixl(T.boing(140, .6, .7, 3.2, 14.), T.whistle(480, 2300, .38, .3), T.swish(.4, .35, 700, 4800, True)),
    'dust': lambda e: lp(noise(.4), 1400) * env_exp(.4, .1) * .25,
    'recall': lambda e: mixl(SFX['titlepop'](e), SFX['wordpop']({'n': 0}), np.pad(SFX['wordpop']({'n': 1}), (int(.12 * SR), 0))),
    'fall': lambda e: T.whistle(2300, 520, e.get('d', .5), .26),
    'landing': lambda e: mixl(thump(.75, 120) * .55, T.boing(180, .5, .45, 2.0, 13.), lp(noise(.3), 1500) * env_exp(.3, .07) * .2),
    'scurry': lambda e: T.scurry(e.get('d', .3), .45, 91, 5),
    'hopout': lambda e: mixl(T.zip_(.35, 2600, 800, .35), T.swish(.35, .2, 900, 3600, False)),
}
missing = sorted({e['type'] for e in EV} - SFX.keys())
if missing: sys.exit(f'mix.py: no sound for event types {missing}')
VERB = {'zoom': .3, 'titlepop': .3, 'ding': .4, 'flip': .3, 'page': .3, 'swipe': .25, 'glowup': .4, 'tag': .25, 'ripple': .3, 'leap': .25, 'landing': .2, 'thrum': .3}
snd = np.zeros(NW)
for e in EV:
    x = SFX[e['type']](e); add(fx, x, e['t'], 1., e.get('pan', 0))
    if e['type'] in VERB: s0 = int(e['t'] * SR); k = min(len(x), NW - s0); snd[s0:s0 + k] += x[:k] * VERB[e['type']]
fx += T.verb(snd, 1.3) * .35


# ---------- vòng lặp: phần dư sau 22 s cộng vào đầu phim ----------
for k in ('mus', 'fx'):
    b = B[k]; tail = b[N0:].copy(); b[:len(tail)] += tail; B[k] = b[:N].copy()
mus, fx = B['mus'], B['fx']


# ---------- nền: khoảng trống bồ công anh lúc chiều vàng (gió lá rất nhỏ, chim xa hót ở chỗ không có lời, ngoài kính và sổ) ----------
amb = B['amb']
d = DUR; tt = t_(d)
add(amb, lp(brown(d), 300) * .7 * np.minimum(1, tt / .05) * .05, 0, 1., 0)
def birdy(v=1., seed=0):                         # chim xa: hai tiếng huýt ngắn lượn lên
    r = np.random.default_rng(seed); f0 = r.uniform(2600, 3400)
    return mixl(T.whistle(f0, f0 * 1.35, .09, 1., .0), np.pad(T.whistle(f0 * 1.1, f0 * 1.5, .08, .8, .0), (int(.13 * SR), 0))) * .3 * v
rng = np.random.default_rng(14)
t0 = .7
while t0 < DUR - .5:
    if not speaking(t0, .2) and not (HIT['zoom'][0] - .2 < t0 < HIT['snap']) and not (HIT['zoomIn'][0] - .2 < t0 < HIT['flip'][1]):
        add(amb, birdy(1., int(t0 * 10)) * .5, t0, 1., rng.uniform(-.8, .8))
    t0 += rng.uniform(1.3, 2.2)


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
for name, a, b in (('móc', 0, HIT['zoom'][0]), ('kính', HIT['zoom'][0], HIT['zoomIn'][0]), ('sổ', HIT['zoomIn'][0], HIT['flip'][1]), ('gag', HIT['flip'][1], DUR)):
    i, j = int(a * SR), int(b * SR)
    print(f'{name:5s}', '  '.join(f'{k}={20 * np.log10(max(rms(B[k][i:j]), 1e-9)):6.1f}' for k in ('mus', 'fx', 'amb', 'vox')), 'dBFS rms')
print('out/mix.wav', f'{len(mix) / SR:.2f} s')
