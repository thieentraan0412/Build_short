"""Âm thanh của SHORT-012 → out/mix.wav (48 kHz stereo): nhạc theo từng cảnh ("Reverse-Gear Reggae", Rê giáng trưởng, MUSIC.md và SOUND-PLAN.md),
tiếng động theo events.json, nền vườn nhiệt đới buổi trưa, giọng.
python mix.py   (cần timeline.json + voice/*.wav từ tools/lines.mjs và core/tts/tts.py, events.json từ core/render/events.mjs)
Nhạc cụ: _shared/audio/band.py; lớp nhịp theo cảnh: _shared/audio/groove.py (plan=True, Sound Design Plan); tiếng động: _shared/audio/toon.py.
Viết riêng ở đây (không sửa file chung): spinback() — cú "rewind" của DJ reggae (đoạn nhạc vừa chơi quay ngược, nhanh dần) mỗi khi Zip bay lùi ở chỗ
không có lời; tiếng phanh kít, tiếng cào đĩa "wiki-wiki", tiếng cánh rì rì, còi lùi "bíp bíp".
Không dùng mẫu âm thanh của bên thứ ba. Phim phát vòng lặp: nốt La giáng (bậc năm) ở cuối dẫn về hợp âm Rê giáng ở 0,0; đuôi tiếng sau 24 s gấp về đầu phim."""
import os, sys, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio')); sys.path.insert(0, os.path.join(LIB, '_shared', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, thump, pop, click, clack, compress, add
from band import mf, pluck, marimba, bassn, steel, rhodes, celesta, harp, trumpet, tuba, xylo, kazoo, bassoon, triangle, timpani, riser, clap
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
def speaking(t, pad_=.05, d=0.): return any(l['t'] - pad_ <= t + d and t < l['t'] + l['dur'] + pad_ for l in LINES)


# ---------- nhạc: "Reverse-Gear Reggae" — Rê giáng trưởng; reggae one-drop là điệu riêng của tập ----------
# Trống thép (steel pan) là giọng của Zip. Mỗi cú bay lùi lớn ở chỗ không lời là một cú "rewind" của DJ (spinback, bên dưới).
# Soi chậm: cánh trước lên = xylophone đi lên ở dải cao, cánh sau xuống = tuba đi xuống ở dải trầm (ngược chiều nhau, ngoài dải giọng).
from groove import Groove
mus = B['mus']
def M(x, t, g=1., pan=0.): add(mus, x, t, g, pan)
def seq(inst, ns, t0, step, g=1., pan=0., d=None, ramp=0.):
    for i, n in enumerate(ns):
        if n: M(inst(n, d) if d else inst(n), t0 + i * step, g * (1 + ramp * i), pan)
def strum(inst, ns, t, g=.4, d=None, spread=.012):
    for k, n in enumerate(ns): M(inst(n, d) if d else inst(n), t + k * spread, g, -.3 + .6 * k / max(1, len(ns) - 1))

ST, SC = HIT['strokes'], 1.25
PEAK_UP = [8.85 + i * SC for i in range(4)]                       # đỉnh "cánh trước lên" (timeline.js SLOW)
AVOID = [(0, .3), (end('L01'), 1.95), (HIT['back2'][0] - .05, L['L02']['t']), (HIT['zoom'][0] - .05, HIT['zoom'][1] + .2), (end('L03'), L['L04']['t']),
         (end('L04'), L['L05']['t']), (end('L05'), HIT['stamp'] + .5), (HIT['gulp'] - .1, HIT['gulp'] + .5), (HIT['flip'][0] - .05, HIT['flip'][1] + .1),
         (HIT['bump'] - .05, L['L08']['t']), (end('L08'), L['L09']['t']), (HIT['spin'] - .05, DUR)]
# Sound Design Plan (11/2026, QUALITY.md §4, SOUND-PLAN.md): mỗi cảnh một phong cách nhạc, một BPM, một nhạc cụ hát chính, một cách chuyển.
# Giữ 120 BPM ở móc và cảnh cuối (Zip bay lùi ra rồi lao tới lại đúng khung đầu, vòng lặp liền).
G = Groove(M, BEAT, LINES, meter=4, seed=12, avoid=AVOID, plan=True)
G.sec('móc · phanh kít, bay lùi', 0, 3.25, 'reggae', 'Db', 'Db Gb', bass='bassn', comp='rhodes', lead='steel', kit='dub', energy=2, cue=False,
      bpm=120, mood='playful', arc='open', what='Zip lao tới, phanh kít trước kính rồi bay giật lùi, hai lần; "Could you fly backwards?"; Miss Loupe hoa mắt',
      emo='bất ngờ, buồn cười', why='Điệu riêng của tập: reggae one-drop (trống chỉ rơi ở phách 3, đàn phím điện "skank" phách 2 và 4); trống thép là giọng của Zip. Cú lùi thứ hai là một cú "rewind" của DJ: nhạc quay ngược rồi chơi tiếp.')
G.sec('"Let\'s zoom in!"', 3.25, HIT['zoom'][1], 'bounce', 'Db', 'Gb Ab', bass='bassn', comp='pluck', lead='vibes', kit='pop', energy=2,
      bpm=126, mood='happy', arc='open', what='Miss Loupe lắc đầu cho hết hoa mắt: "Let\'s zoom in!", kính bật về phía máy', emo='háo hức',
      why='Pop nảy 126 BPM, ukulele chặn; vibraphone đáp sau câu cửa miệng; đàn hạc vuốt lên khi kính bật (viết tay).')
G.sec('kính · bay lùi', HIT['zoom'][1], HIT['lbrake'] + .1, 'quest', 'Db', 'Db Bbm Gb Ab', bass='upright', comp='pizz', arp='celesta', lead='flute', kit='tom', energy=2,
      bpm=108, mood='magic', arc='build', what='Trong kính lớn Zip bay lùi, đuôi đi trước: "Dragonflies can fly backwards!"; chữ BACKWARDS!', emo='kỳ diệu',
      why='Phiêu lưu nước kiệu 108 BPM: pizzicato và celesta rải theo chuyến bay, sáo hát (lần đầu sáo hát điệu này ở kênh).')
G.sec('kính · đứng yên', HIT['lbrake'] + .1, HIT['slow'][0], 'float', 'Db', 'Gb Db', bass='upright', arp='harp', lead='glock', kit='tri', energy=2, tr='gliss',
      bpm=108, mood='cute', arc='build', what='Zip phanh, đứng yên giữa trời trên đường chấm chấm, quay mặt ra: "And stay still in the air!"; chữ STILL!',
      emo='ngạc nhiên, nín thở vui', why='Rải lơ lửng 108 BPM (vẫn tươi, không chậm hẳn), đàn hạc rải và glockenspiel: nhạc cũng "đứng yên" lơ lửng như Zip; triangle ở phách đầu.')
G.sec('soi chậm · bốn cánh', HIT['slow'][0], HIT['snap'], 'reggae', 'Db', 'Db Ab Bbm Gb', bass='bassn', comp='piano', lead='trumpet', kit='dub', energy=3,
      bpm=120, mood='epic', arc='peak', what='Soi chậm: cánh trước (chanh) lên khi cánh sau (hồng) xuống, mũi tên bật theo nhịp: "Front wings up, back wings down!"',
      emo='wow, vỡ lẽ', why='Cao trào của tập là reggae 120 BPM, vui và nảy (11/2026: không để cao trào chậm): một chu kỳ cánh 1,25 s bằng đúng 5 móc đơn, nên mỗi đỉnh cánh rơi trên lưới nhịp; piano chặn phách lẻ, timpani mở cảnh, '
      'kèn trumpet hát ở hai khoảng trống. Dưới lời: cánh trước lên = xylophone đi lên (dải cao), cánh sau xuống = tuba đi xuống (dải trầm), ngược chiều như hai cặp cánh.')
G.mark('chụp → sổ', HIT['snap'], HIT['stamp'], 'break', 'Db', 'marimba harp', 2, mood='happy', arc='end', what='Kính "chụp" Zip đang đứng yên, sticker hiện trên trang sổ',
       emo='háo hức', why='Marimba chạy lên (tiếng "chụp" của ban nhạc kênh), đàn hạc vuốt qua mặt kính.')
G.sec('sổ · Albie', HIT['stamp'], HIT['flip'][0], 'reggae', 'Db', 'Gb Db', bass='bassn', comp='pluck', lead='kazoo', kit='dub', energy=2,
      bpm=112, mood='playful', arc='end', what='Sticker "Flies backwards!" dán vào sổ; Zip đứng yên cho Albie đếm chân: "Six legs? In you go!", Zip lùi đuôi vào trang đúng "go!"',
      emo='vui, tự hào', why='Cảnh sổ phối theo điệu của tập: reggae 112 BPM, ukulele "skank", kazoo đáp sau câu cửa miệng; dưới giọng trầm của Albie lớp nhịp tự bỏ bass.')
G.sec('gag · đi lùi "bíp bíp"', HIT['flip'][0], HIT['bump'], 'hop', 'Db', 'Db Gb', bass='tuba', comp='pizz', lead='accordion', kit='comic', energy=2,
      bpm=112, mood='funny', arc='end', what='"I can go backwards too!" Miss Loupe bước lùi kêu "bíp bíp", không thấy Albie sau lưng',
      emo='buồn cười, tinh nghịch', why='Nảy lệch phách 112 BPM, vui tươi (11/2026: không dùng điệu rình rập): tuba và pizzicato nảy theo từng bước lùi, accordion đáp; còi lùi "bíp" là tiếng động, nhạc nhường chỗ.')
G.sec('"Watch the corners!"', HIT['bump'], L['L09']['t'] - .15, 'polka', 'Db', 'Ab Db', bass='bassn', comp='marimba', lead='bassoon', kit='clap', energy=2,
      bpm=116, mood='funny', arc='end', what='Bộp! Lưng Miss Loupe chạm góc sách của Albie: "Watch the corners!"; góc sách lấp lánh, Miss Loupe đỏ mặt cười',
      emo='buồn cười, nhẹ nhõm', why='Polka hài 116 BPM bật ra ngay sau cú "bộp" (tuba "bwomp" viết tay); bassoon "hô hô" đáp khi Miss Loupe cười.')
G.sec('câu hỏi · vòng lặp', L['L09']['t'] - .15, DUR, 'gallop', 'Db', 'Db Ab', bass='bassn', comp='marimba', lead='xylo', kit='toy', energy=2,
      bpm=120, mood='bouncy', arc='end', what='"Which way is Zip flying?" – Zip bay lùi ngang khung ra phải; chữ móc trở lại; "rewind", Zip lao tới lại như khung đầu',
      emo='háo hức, mời gọi', why='Phi ngựa (nhịp kép) 120 BPM theo chuyến bay ngang khung; cú "rewind" cuối kéo nhạc về hợp âm Rê giáng của khung đầu nên vòng lặp liền.')
G.answer(1.5, HIT['dizzy'][0] + .2, 7.0, end('L05') + .05, end('L08') + .05)   # câu đáp viết tay bên dưới (trống thép của Zip, hoa mắt, triangle, kèn, bassoon cười)
G.play(); os.makedirs(os.path.join(HERE, 'out'), exist_ok=True); G.save(os.path.join(HERE, 'out', 'music.json'), color='"Reverse-Gear Reggae" (Rê giáng trưởng, reggae one-drop, mỗi cú bay lùi là một cú "rewind" của DJ)')

# — Móc: hợp âm Rê giáng ở giây 0; trống thép của Zip "ting-ting-ting" khi Zip đứng yên (sau câu hỏi) —
M(bassn(37, .5), 0., 1.0); strum(rhodes, (61, 65, 68, 73), 0., .25, .6); M(steel(85, .5), 0., .25, .4)
seq(lambda m, d: steel(m, d), (80, 85, 89), 1.5, .1, .4, .35, d=.25)
# — hoa mắt: trống thép đi xuống chậm, lảo đảo —
seq(lambda m, d: steel(m, d), (89, 85, 82, 77, 80), HIT['dizzy'][0] + .15, .13, .3, -.3, d=.3)
# — Kính bật: đàn hạc vuốt lên —
M(T.gliss(73, 97, .45, .26, 'harp'), HIT['zoom'][0], .9)
# — Đứng yên: triangle + celesta ngay trước "And stay still…" —
M(triangle(.5, 1.2), HIT['lbrake'] + .03, .5, .2); M(celesta(85, 1.0), HIT['lbrake'] + .05, .22, .3)
# — Soi chậm: timpani mở cảnh; mỗi đỉnh "cánh trước lên": xylophone đi lên (cao); mỗi đỉnh "cánh trước xuống / cánh sau lên": tuba đi xuống (trầm) —
M(timpani(44, .8, 1.0), HIT['slow'][0], .55)
for p in PEAK_UP:                                                  # cánh trước lên + cánh sau xuống: xylophone đi lên, tuba trượt xuống, cùng lúc
    if p < HIT['snap'] - .1: seq(xylo, (85, 89, 92), p - .1, .05, .16, .25, d=.18); M(tuba(49, .45, 1., -5.), p - .05, .5, -.2)
for s in ST[::2]:                                                  # nửa nhịp kia: cánh trước xuống, cánh sau lên (nhỏ hơn)
    if s < HIT['snap']: seq(xylo, (92, 89, 85), s - .1, .05, .1, .25, d=.16); M(tuba(44, .4, 1., 5.), s - .05, .35, -.2)
# — Ngay sau lời giải thích: trumpet Rê giáng–Fa–La giáng–Rê giáng đi lên (ta-da nhỏ) —
seq(lambda m, d: trumpet(m, d), (73, 77, 80), end('L05') + .06, .1, .3, .1, d=.2); M(trumpet(85, .45), end('L05') + .36, .27, .1)
# — Chụp → sổ: marimba chạy lên; đàn hạc vuốt; sticker: đàn hạc rải + hộp nhạc; Zip lùi vào trang: xylophone trượt xuống; lật trang —
seq(marimba, (73, 77, 80, 85, 89), HIT['snap'] + .04, .07, .45, .2, ramp=.1)
M(T.gliss(80, 99, HIT['zoomIn'][1] - HIT['zoomIn'][0], .28, 'harp'), HIT['zoomIn'][0], .9)
M(T.gliss(95, 78, HIT['zoomOut'][1] - HIT['zoomOut'][0], .2, 'harp'), HIT['zoomOut'][0], .7)
strum(harp, (73, 77, 80, 85), HIT['zoomOut'][1], .35, .9); M(celesta(92, 1.0), HIT['stamp'] + .02, .3, .3)
seq(xylo, (92, 89, 85, 80, 77), HIT['gulp'] + .02, .05, .32, .1, d=.2)
M(celesta(97, .8), HIT['mini'] + .02, .3, .4)
M(T.gliss(75, 99, .45, .3, 'harp'), HIT['flip'][0] + .02, .7)
# — Gag: "bộp" → tuba "bwomp" đi xuống + vỗ tay; Miss Loupe cười: bassoon "hô hô" —
M(tuba(42, .5, 1., -4.), HIT['bump'] + .02, .6); M(clap(.8), HIT['bump'] + .01, .35)
seq(lambda m, d: bassoon(m, d), (56, 61, 56, 61), end('L08') + .04, .09, .3, -.2, d=.09)
# — Chữ móc trở lại: hợp âm Rê giáng nhỏ; nốt dẫn La giáng → Rê giáng ở 0,0 —
strum(pluck, (61, 65, 68, 73), HIT['recall'] + .5, .22, .7)
M(bassn(44, .3), DUR - BEAT / 2, .9)


# ---------- "rewind" của DJ (spinback): đoạn nhạc vừa chơi quay ngược, nhanh dần, rồi nhạc chơi tiếp ----------
def spinback(buf, t, d=.42, r0=1., r1=4.2, g=.95):
    """Thay [t, t+d) của bus nhạc bằng đoạn nhạc ngay trước t phát ngược, tốc độ đọc tăng r0→r1 (cao độ trượt lên như kéo đĩa),
    kèm một lớp mờ của nhạc gốc để không có lỗ im. Viết riêng cho tập (reggae sound-system "rewind")."""
    s, n = int(t * SR), int(d * SR)
    rate = np.linspace(r0, r1, n); pos = np.cumsum(rate)                     # số mẫu đã đọc lùi
    src = buf[max(0, s - int(pos[-1]) - 4):s][::-1]
    if len(src) < 8: return
    out = np.stack([np.interp(pos, np.arange(len(src)), src[:, ch]) for ch in (0, 1)], 1)
    e = np.minimum(1, np.arange(n) / (.012 * SR)) * (1 - .55 * (np.arange(n) / n) ** 1.5)
    w = np.minimum(1, np.minimum(np.arange(n), n - np.arange(n)) / (.015 * SR))[:, None]
    buf[s:s + n] = buf[s:s + n] * (1 - .75 * w) + out * e[:, None] * g * w
SPINS = [HIT['back2'][0], HIT['spin']]                             # hai cú lùi ở chỗ không có lời
for ts in SPINS: spinback(mus, ts)

# — cường độ theo cảnh (chuyển mềm 0,3 s) —
LEVEL = ((0, .95), (.2, .72), (HIT['brake'], .9), (HIT['brake'] + .25, .72), (end('L01'), 1.0), (HIT['back2'][0], 1.0), (HIT['dizzy'][1], .85), (L['L02']['t'], .78),
         (HIT['zoom'][0], 1.0), (L['L03']['t'], .74), (end('L03'), .95), (L['L04']['t'], .72), (end('L04'), 1.0), (L['L05']['t'], .74), (end('L05'), 1.0),
         (HIT['snap'], 1.0), (HIT['stamp'] + .3, .78), (HIT['gulp'], .95), (HIT['gulp'] + .5, .8), (HIT['flip'][0], .9), (L['L07']['t'], .72), (end('L07'), .85),
         (HIT['bump'], 1.0), (L['L08']['t'], .72), (end('L08'), .95), (L['L09']['t'], .7), (HIT['spin'], 1.0))
tt = np.arange(len(mus)) / SR; lev = np.full(len(mus), LEVEL[0][1])
for (t, g), (_, g0) in zip(LEVEL[1:], LEVEL[:-1]): lev = np.where(tt >= t - .15, np.where(tt < t + .15, g0 + (g - g0) * (tt - t + .15) / .3, g), lev)
mus *= lev[:, None]


# ---------- tiếng động theo sự kiện ----------
fx = B['fx']
def fade_safe(x): n = min(len(x), int(.01 * SR)); x = x.copy(); x[:n] *= np.linspace(0, 1, n); x[len(x) - n:] *= np.linspace(1, 0, n); return x
def whirr(d, v=1.):                              # cánh chuồn chuồn rì rì khi đứng yên: rung trầm, rất nhỏ
    tt = t_(d); x = lp(noise(d), 260) * (.6 + .4 * np.sin(2 * np.pi * 34 * tt)) + .4 * np.sin(2 * np.pi * 120 * tt) * (.5 + .5 * np.sin(2 * np.pi * 34 * tt))
    return fade_safe(x * np.minimum(1, tt / .08) * np.minimum(1, (d - tt) / .12)) * .22 * v
def screech(d=.26, v=1.):                        # phanh kít: còi trượt xuống có rung + "phụt" gió
    tt = t_(d); f = 2600 * np.exp(-tt * 3.2) * (1 + .03 * np.sin(2 * np.pi * 38 * tt)); ph = np.cumsum(f) / SR
    s = np.sin(2 * np.pi * ph) * .5 + np.sign(np.sin(2 * np.pi * ph)) * .12
    x = bp(s, 900, 4200) * np.exp(-tt * 5) * np.minimum(1, tt / .01)
    air = np.pad(lp(noise(.22), 900) * env_exp(.22, .05), (int(.05 * SR), 0)) * .6
    return fade_safe(mixl(x * .55, air)) * v
def scratch(d=.45, v=1., wig=2.):                 # cào đĩa "wiki-wiki": tần số đi lui đi tới, nhanh dần
    tt = t_(d); u = tt / d; f = 380 + 1100 * np.abs(np.sin(np.pi * wig * u ** 1.3)); ph = np.cumsum(f) / SR
    saw = 2 * (ph % 1) - 1; x = bp(saw, 300, 3200) * .5 + bp(noise(d), 1200, 5000) * .25 * np.abs(np.sin(np.pi * wig * u))
    return fade_safe(x * np.minimum(1, tt / .015) * (1 - .6 * u)) * .55 * v
def airback(d=.8, v=1.):                          # bay lùi dưới lời: chỉ có gió ở dải cao + "vù" trầm, tránh dải giọng
    tt = t_(d); e = np.sin(np.pi * np.clip(tt / d, 0, 1)) ** 1.2
    return fade_safe(hp(noise(d), 4300) * e * .32 + lp(noise(d), 180) * e * .55) * v
def beep(v=1.):                                   # còi xe lùi "bíp": nốt vuông mềm 1,6 kHz, ngắn
    d = .16; tt = t_(d); x = np.sign(np.sin(2 * np.pi * 1568 * tt)) * .35 + np.sin(2 * np.pi * 1568 * tt) * .5
    return fade_safe(lp(x, 5000) * np.minimum(1, tt / .008) * np.minimum(1, (d - tt) / .02)) * .3 * v
def slowmo(d=.5, v=1.):                           # "chậm lại": tiếng băng chậm dần, trầm xuống
    tt = t_(d); f = 520 * np.exp(-tt * 3.4) + 70; ph = np.cumsum(f) / SR
    return fade_safe(lp(np.sin(2 * np.pi * ph) + .4 * np.sin(4 * np.pi * ph), 1500) * np.minimum(1, tt / .02) * (1 - tt / d) * .35 + hp(noise(d), 5000) * .06 * (1 - tt / d)) * v
def stroke(n, v=1.):                              # một nhịp cánh soi chậm: "vút" ở dải rất cao + "phụp" trầm (ngoài dải giọng)
    d = .3; tt = t_(d); up = n % 2 == 0
    air = bp(noise(d), 5200 if up else 4300, 9000) * np.sin(np.pi * tt / d) ** 2 * .3
    low = np.sin(2 * np.pi * (95 if up else 70) * tt) * np.exp(-tt * 14) * .5
    return fade_safe(air + low) * v
SFX = {
    'titlepop': lambda e: mixl(T.bubble(1600, .5, .06, 2.4), np.pad(T._ting(mf(97), .5, .35), (int(.02 * SR), 0))),
    'wordpop': lambda e: mixl(T.boing(220 + 120 * e.get('n', 0), .35, .3, 2.4, 16.), np.pad(pop(.6) * .45, (int(.02 * SR), 0)), T.bubble(1300 + 500 * e.get('n', 0), .35, .05, 2.4)),
    'brake': lambda e: mixl(screech(.26, e.get('v', 1.)), np.pad(thump(.5, 120) * .25 * e.get('v', 1.), (int(.02 * SR), 0))),
    'startle': lambda e: mixl(T.boing(260, .3, .32, 2.3, 15.), T.surprise(.35)),
    'reverse': lambda e: airback(e.get('d', .8), e.get('v', 1.)) if speaking(e['t'], .05, e.get('d', .8) * .6) else mixl(scratch(min(.5, e.get('d', .5)), e.get('v', 1.)), airback(e.get('d', .8), .6 * e.get('v', 1.))),
    'hum': lambda e: whirr(e.get('d', .5), .9),
    'dash': lambda e: mixl(T.zip_(e.get('d', .25), 600, 2600, .45), T.swish(e.get('d', .25), .22, 900, 4200, False)),
    'dizzy': lambda e: mixl(T.wobble(150, e.get('d', .7), .3, 6., .2), T.pops(4, .12, 91, .25, False)),
    'zoom': lambda e: mixl(riser(.4, .8), T.whistle(420, 1250, .4, .12)),
    'textpop': lambda e: mixl(pop(.7) * .5, T.bubble(900, .4, .07, 2.4)),
    'still': lambda e: mixl(T.tink(.5, 4200), np.pad(T.ding(98, .25, .6), (int(.03 * SR), 0)), whirr(1.4, .7)),
    'slowmo': lambda e: slowmo(e.get('d', .5), .9),
    'stroke': lambda e: stroke(e.get('n', 0), .8),
    'sparkle': lambda e: T.sparkle(.5, .3, 91, 105, 7, 5, 'up'),
    'snap': lambda e: mixl(click(1., .25) * .8, np.pad(click(.8, .2) * .5, (int(.045 * SR), 0)), np.pad(T.sparkle(.45, .3, 93, 108, 6, 7, 'up'), (int(.06 * SR), 0))),
    'zoomin': lambda e: mixl(T.swish(e.get('d', .3), .42, 600, 5200, True, .15, .25), riser(e.get('d', .3), .4)),
    'zoomout': lambda e: mixl(T.swish(e.get('d', .35), .3, 500, 3800, False, .25, .2), np.pad(T.paper(.3, .35, 5, 4), (int(.1 * SR), 0))),
    'page': lambda e: mixl(T.paper(.35, .45, 5, 1), T.bubble(520, .3, .09)),
    'swipe': lambda e: T.swipe(e.get('d', .3), .32, True, e.get('lo', 1500), e.get('hi', 5500)),
    'stamp': lambda e: mixl(thump(.8, 110) * .7, hp(noise(.07), 1200) * env_exp(.07, .012) * .6),
    'ding': lambda e: T.ding(e.get('m', 88), .4, .7),
    'zip': lambda e: mixl(T.zip_(e.get('d', .4), 700, 2800, .5), T.swish(e.get('d', .4), .25, 900, 4200, True)),
    'countA': lambda e: mixl(T.blip(84 + 3 * e.get('n', 0), .35), T.block(91 + 2 * e.get('n', 0), .25)),
    'gulp': lambda e: mixl(T.paper(.3, .45, 5, 2), T.boing(170, .45, .4, 2.2, 14.), np.pad(T.bubble(420, .35, .12, 1.4), (int(.08 * SR), 0))),
    'pops': lambda e: T.pops(e.get('n', 6), e.get('step', .035), e.get('m', 84), e.get('v', .5)),
    'flip': lambda e: mixl(T.paper(e.get('d', .5), .5, 7, 3), T.swish(e.get('d', .5), .22, 700, 3200, True)),
    'steps': lambda e: T.footsteps(5, .21, .45, 86, 3, soft=True),
    'beep': lambda e: beep(1.),
    'notice': lambda e: mixl(T.surprise(.3), T.blip(91, .2)),
    'bonk': lambda e: mixl(T.bonk(.9, 72), T.boing(190, .4, .35, 2.0, 13.)),
    'stars': lambda e: T.sparkle(.7, .28, 94, 106, 6, 11, 'down'),
    'glint': lambda e: mixl(T.tink(.35, 4600), np.pad(T.tink(.25, 5200), (int(.12 * SR), 0))),
    'giggle': lambda e: T.giggle(4, .45, 86, .1, 2),
    'hop': lambda e: T.boing(240, .3, .3, 2.2, 15.),
    'recall': lambda e: mixl(T.bubble(1600, .3, .06, 2.4), np.pad(T.boing(260, .3, .2, 2.4, 16.), (int(.1 * SR), 0))),
    'zipin': lambda e: mixl(np.pad(scratch(.4, .75, 1.5), (0, 0)), np.pad(T.zip_(.5, 900, 2600, .5), (int(.38 * SR), 0)), np.pad(T.swish(.6, .25, 800, 4000, False), (int(.45 * SR), 0))),
}
missing = sorted({e['type'] for e in EV} - SFX.keys())
if missing: sys.exit(f'mix.py: no sound for event types {missing}')
VERB = {'zoom': .3, 'titlepop': .3, 'ding': .4, 'flip': .3, 'page': .3, 'swipe': .25, 'sparkle': .4, 'still': .35, 'glint': .4, 'stars': .35, 'textpop': .25}
snd = np.zeros(NW)
for e in EV:
    x = SFX[e['type']](e); add(fx, x, e['t'], 1., e.get('pan', 0))
    if e['type'] in VERB: s0 = int(e['t'] * SR); k = min(len(x), NW - s0); snd[s0:s0 + k] += x[:k] * VERB[e['type']]
fx += T.verb(snd, 1.3) * .35


# ---------- vòng lặp: phần dư sau 24 s cộng vào đầu phim ----------
for k in ('mus', 'fx'):
    b = B[k]; tail = b[N0:].copy(); b[:len(tail)] += tail; B[k] = b[:N].copy()
mus, fx = B['mus'], B['fx']


# ---------- nền: vườn nhiệt đới buổi trưa (gió lá rất nhỏ, chim xa hót ngắn ở chỗ không có lời) ----------
amb = B['amb']
d = DUR; tt = t_(d)
add(amb, lp(brown(d), 380) * .7 * np.minimum(1, tt / .05) * .055, 0, 1., 0)
rng = np.random.default_rng(12)
t0 = .7
while t0 < DUR - .5:
    if not speaking(t0, .2, .4) and not (HIT['zoom'][0] - .2 < t0 < HIT['snap']) and not (HIT['zoomIn'][0] - .2 < t0 < HIT['flip'][1]):
        f0 = rng.uniform(2300, 3100); add(amb, mixl(T.whistle(f0, f0 * 1.25, .09, .5), np.pad(T.whistle(f0 * 1.2, f0 * .95, .11, .45), (int(.11 * SR), 0))) * .1, t0, 1., rng.uniform(-.8, .8))
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
for name, a, b in (('móc', 0, 4.25), ('kính', 4.25, 12.65), ('sổ', 12.65, 16.35), ('gag', 16.35, 24)):
    i, j = int(a * SR), int(b * SR)
    print(f'{name:5s}', '  '.join(f'{k}={20 * np.log10(max(rms(B[k][i:j]), 1e-9)):6.1f}' for k in ('mus', 'fx', 'amb', 'vox')), 'dBFS rms')
print('out/mix.wav', f'{len(mix) / SR:.2f} s')
