"""Âm thanh của SHORT-001 → out/mix.wav (48 kHz stereo): nhạc theo từng cảnh ("Tổ khúc khu vườn", MUSIC.md) trên lưới 120 BPM, nhạc hiệu chung, tiếng động theo events.json, nền, giọng.
python mix.py   (cần timeline.json + voice/*.wav từ tools/lines.mjs và core/tts/tts.py, events.json từ core/render/events.mjs)
Nhạc cụ và nhạc hiệu: _shared/audio/band.py; tiếng động hoạt hình: _shared/audio/toon.py (dùng chung cho mọi tập).
Không dùng mẫu âm thanh của bên thứ ba. Bảng cue âm thanh (hình ↔ tiếng): SOUND.md."""
import os, sys, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio')); sys.path.insert(0, os.path.join(LIB, '_shared', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, whoosh, thump, ding, pop, click, step, compress, limit, add
from band import fade, mf, pluck, marimba, bassn, buzzbass, kick, clap, hat, shaker, bell, horn, pad, chirp, riser, glide, jingle
from band import pizz, xylo, flute, reed, tuba, tom, brush, celesta, harp, triad, secret   # nhạc cụ của lượt nhạc nền theo cảnh (MUSIC.md)
import toon as T

TL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))
EV = json.load(open(os.path.join(HERE, 'events.json'), encoding='utf-8'))['ev']
BEAT = 60 / TL['bpm']; BAR = BEAT * 4; DUR = TL['dur']; N = int((DUR + .05) * SR)
at = lambda bar, beat=0: (bar * 4 + beat) * BEAT
rng = np.random.default_rng(5)
B = {k: np.zeros((N, 2)) for k in ('mus', 'fx', 'amb', 'vox')}
def mixl(*xs):                                  # cộng các đoạn khác độ dài
    n = max(len(x) for x in xs); return sum(np.pad(x, (0, n - len(x))) for x in xs)


# ---------- nhạc: "Tổ khúc khu vườn" — mỗi cảnh một giọng, một điệu, một nhóm nhạc cụ (MUSIC.md) ----------
# Lưới 120 BPM giữ nguyên vì hình đã khớp theo phách; cái đổi là giọng, điệu (rón rén, polka, lơi 3+3+2, swing, chạy móc đơn),
# nhạc cụ và cường độ của từng cảnh. Mô-típ bí mật đô–mi–sol (band.secret) trở lại ở mỗi phát hiện, mỗi lần một cách chơi.
# v5 (nhạc nền sinh động, MUSIC.md): ba đoạn đệm còn đứng yên được thay bằng lớp nhịp theo cảnh (_shared/audio/groove.py):
# kính phóng to (marimba rải, bí ẩn) · SWEET (pop nảy, màu ban nhạc kênh) · sổ (shuffle dưới câu của Albie → nửa nhịp ấm dưới lời dặn).
# Các đoạn tổ khúc viết tay khác giữ nguyên và được ghi vào bảng cảnh nhạc bằng G.mark (out/music.json, qa.py).
from groove import Groove
mus = B['mus']
# khoảng lặng: trước hai đáp án (giữ nguyên) và lúc Flutter đậu lên kính ở cảnh kết (ngắt nhạc cho gag); nốt cũ ngân hết tự nhiên
REST = ((at(11, 2), at(12)), (at(14, 2), at(15)), (at(24, 2), at(25, 1) - .25))
def M(x, t, g=1., pan=0.):
    if any(a - .02 <= t < b - .02 for a, b in REST): return
    add(mus, x, t, g, pan)
def seq(inst, ns, t0, step, g=1., pan=0., swing=0., d=None, ramp=0.):   # chuỗi nốt đều; 0 = nghỉ; swing: đẩy nốt lẻ trễ đi; ramp: to dần
    for i, n in enumerate(ns):
        if n: M(inst(n, d) if d else inst(n), t0 + i * step + (swing * step if i % 2 else 0), g * (1 + ramp * i), pan)
def strum(inst, ns, t, g=.55, d=None, spread=.014):
    for k, n in enumerate(ns): M(inst(n, d) if d else inst(n), t + k * spread, g, -.35 + .7 * k / max(1, len(ns) - 1))
def cymbal(t, g=.25, br=4500): M(T.cymbal(1.6, 1., br), t, g, .15)
HIT = TL['hit']

# — Hook 0–4 s, C: rón rén → cú giẫm → khựng → polka nảy —
M(kick(.8), 0., .6); M(T._ting(mf(96), .5), 0., .15, .4)
for i, n in enumerate((48, 49, 50, 51, 52, 53)):                          # pizzicato trầm đi lên từng nửa cung: bàn chân đang rình
    M(pizz(n, .22), i * BEAT / 2, .6); M(bassn(n, .16), i * BEAT / 2, .35); M(T.block(79 + i, .5), i * BEAT / 2 + BEAT / 4, .14, .3)
seq(xylo, (67, 69, 71), 0., BEAT, .34, .2)                                 # xylophone "hỏi" đi lên dưới câu hỏi
for t in (BEAT, 2 * BEAT): M(kick(.7), t, .45)                            # nhịp chạy ngay từ giây 0: kick mỗi phách đến cú giẫm
M(tom(50, .7), at(0, 2.5), .45, .1); M(tom(55, .7), at(0, 2.75), .4, .1)   # trống dồn khi chân lấy đà
ts = at(0, 3)                                                              # cú giẫm: cả dàn đánh C
M(kick(), ts, 1.1); M(tuba(36, .6), ts, .9); M(bassn(36, .6), ts, 1.0); strum(pizz, (60, 64, 67, 72), ts, .55)
for n in (72, 76, 79): M(horn(n, .3, .8), ts, .32)
cymbal(ts, .3, 5000)
for i, n in enumerate((48, 43, 48)):                                       # 2,0–3,5: polka "oom-pah" (khựng 1,5–2,0: chỉ hợp âm ngân)
    tb = at(1) + i * BEAT; M(tuba(n, .3), tb, .8); M(kick(.6), tb, .5 if i != 1 else .3)
    strum(pizz, (64, 67, 72), tb + BEAT / 2, .28, .18, .008)
seq(xylo, (76, 79), 3.25, .125, .42, .25)                                  # tíu tít sau chữ "can"
seq(xylo, (67, 69, 72, 74), at(1, 3), BEAT / 4, .5, .2, ramp=.08)          # kính nở: chạy lên vào nhạc hiệu
# — Tựa: nhạc hiệu 2 s (giống hệt mọi tập), đúng ô nhịp 2 —
J = jingle(); s = int(at(2) * SR); e = min(N, s + len(J)); mus[s:e] += J[:e - s] * 1.15

# — Bướm 6–18 s, F: bay bổng, đàn hạc rải lơi 3+3+2, sáo vỗ cánh ở chỗ nghỉ lời —
BF = [(41, (65, 69, 72)), (40, (64, 67, 72)), (38, (62, 65, 69)), (46, (62, 65, 70, 72))]   # F · C/E · Dm · B♭add9
cymbal(at(3), .22, 5000)
for k, (root, tones) in enumerate(BF[:2]):                                 # v5: hai ô đầu (6–9,6 s); từ lúc kính phóng to là lớp nhịp (marimba rải)
    t0 = at(3 + k); ns = list(tones[:3]) + [tones[0] + 12]
    for i, j in enumerate((0, 1, 2, 3, 2, 1, 2, 3)):                       # rải hợp âm 8 móc đơn, nhấn 3+3+2
        if t0 + i * BEAT / 2 < HIT['bfZoom']: M(harp(ns[j], .7), t0 + i * BEAT / 2, .34 * (1.25 if i in (0, 3, 6) else .8), -.3)
    for b in (0, 1.5, 3):
        if t0 + b * BEAT < HIT['bfZoom']: M(pizz(root + 12, .35), t0 + b * BEAT, .55)
    M(kick(.5), t0, .45)
seq(flute, (77, 79, 77, 79, 77, 79), at(3), .07, .42, .3, d=.12); M(flute(81, .3), at(3) + .42, .4, .3)   # Flutter bay vào: láy vỗ cánh
seq(flute, (84, 81), 8.28, .14, .38, .3, d=.16)                           # đậu lên hoa (giữa hai câu)
M(pad([62, 65, 69, 72], 1.4), 9.4, .9)                                    # kính phóng to: pad dâng
secret(M, celesta, 77, HIT['bfGlow'], .17, .4, .35)                        # điểm nếm sáng: mô-típ bí mật lơ lửng (F–A–C)
M(pad([62, 65, 69, 72], 2.6), 10.4, .55)
seq(pizz, (60, 62, 64, 65, 67, 69, 70, 72), 13.0, .155, .32, .2, d=.2, ramp=.07)   # dồn vào SWEET!
tsw = HIT['sweet']; M(kick(), tsw, 1.0); M(bassn(41, .5), tsw, 1.1); strum(pluck, (65, 69, 72, 77), tsw, .45); M(xylo(84), tsw, .35, .25); M(xylo(89), tsw + .07, .3, .25)
cymbal(tsw, .2, 5500)
# Time to eat!: lớp nhịp "pop nảy" ở màu ban nhạc kênh (ukulele, marimba, kick, clap), marimba đáp sau câu (xem cuối phần nhạc)
for i, (n, dt) in enumerate(((84, 0), (81, .12), (76, .26), (72, .42), (69, .6), (64, .8))):   # ngày → đêm: đàn hạc rơi xuống, chậm dần
    M(harp(n, .9), at(8, 2) + dt, .36 - .02 * i, .2 - .08 * i)
M(pad([57, 60, 64], 1.6), at(8, 2), .7); M(reed(45, 1.2), at(8, 3), .4)

# — Dế 18–28 s, La thứ → C: đêm rón rén; đáp án bừng sáng —
CK = [(45, (57, 64, 69, 64, 72, 64, 69, 64)), (41, (57, 65, 69, 65, 72, 65, 69, 65)), (38, (57, 62, 65, 62, 69, 62, 65, 62)),
      (36, (60, 67, 72, 67, 76, 67, 72, 67)), (43, (59, 67, 71, 67, 74, 67, 71, 67))]          # Am · F · Dm · C · G
cymbal(at(9), .14, 3000)
for k, (root, pat) in enumerate(CK):
    t0 = at(9 + k); bright = k >= 3
    seq(pizz, pat, t0, BEAT / 2, (.3, .3, .22, .2, .26)[k], .25, d=.18)   # pizzicato staccato: rón rén
    if k < 2: M(reed(root, 1.8), t0, .35, -.2)                             # kèn dăm trầm giữ nốt dài
    for b in (1, 3): M(chirp(), t0 + b * BEAT, .75, .55)                   # tiếng dế làm bộ gõ
    M(tom(45 if not bright else 48, .5), t0, .5)
    if bright: M(kick(.6), t0, .5); M(bassn(root + 12, .5), t0, .9)
seq(reed, (60, 64), 20.78, .22, .38, -.2, d=.25)                           # "hử?" sau câu hỏi
M(tuba(45, .45, .6, bend=-5), 22.95, .6)                                   # "bwomp" ngay sau "Nope!"
tr = HIT['ckEar']                                                          # tai ở chân!: La thứ bừng sang C trưởng
secret(M, celesta, 84, tr, .15, .4, .3); M(pad([60, 64, 67, 72], 2.2), tr, .6); M(bassn(36, .8), tr, 1.0); M(pizz(48, .5), tr, .7); M(bell(96, .4, 1.2), tr + .45, .35, .3)
cymbal(tr, .2, 4500)
seq(pizz, (67, 71, 74), 26.0, .125, .4, -.2, d=.2); M(chirp(1.2), 26.45, .9, .55)      # Chirp nâng chân "nghe": hỏi–đáp với tiếng dế
seq(pizz, (69, 72, 76), 26.7, .125, .4, -.2, d=.2); M(chirp(1.2), 27.1, .8, .55)
seq(pizz, (62, 67) * 4, at(13, 2), BEAT / 4, .16, .1, d=.12, ramp=.12)    # đêm → tổ ong: pizzicato rung dồn

# — Ong 28–34 s, F: khựng (ú ớ) → jig "bee hop" (v6, 11/2026 lượt 2: swing là điệu riêng của SHORT-003; jig là điệu riêng của tập này) —
M(buzzbass(41, 1.0, .7), at(14), .55); M(pluck(77, 1.2), at(14), .3)
td = HIT['dance']; M(kick(), td, 1.1); M(buzzbass(41, .5), td, 1.1); strum(pluck, (65, 69, 72, 77), td, .55); M(xylo(89), td, .4, .3)
cymbal(td, .32, 4000)
# điệu nhảy của Waggle: lớp nhịp jig 12/8 (bass vo ve, accordion "oom-cha-cha", bodhrán) khai báo ở G.sec bên dưới; mô-típ bí mật chia ba
seq(flute, (77, 81, 84, 89), 31.0, BEAT / 3, .45, .3, d=.14)               # mô-típ bí mật trên sáo (tin whistle), giữa hai câu
seq(xylo, (84, 81, 77, 72), 33.32, BEAT / 3, .42, .3)

# — Bản đồ 34–40 s, C: phiêu lưu, chuyển động liên tục (cảnh không lời) —
cymbal(at(17), .25, 5500)
MAP = [(at(17), 4, 48), (at(18), 2, 41), (at(18, 2), 2, 43), (at(19), 2, 45), (at(19, 2), 1, 41), (at(19, 3), 1, 43)]   # C · F · G · Am · F · G
for t0, beats, root in MAP:
    for i in range(beats * 3):                                             # v6: pizzicato chia ba liên tục (jig phiêu lưu): gốc–năm–tám
        M(pizz((root, root + 7, root + 12)[i % 3] + (12 if root < 46 else 0), .17), t0 + i * BEAT / 3, (.4 if i % 3 == 0 else .3), -.15)
    for b in range(beats):
        tb = t0 + b * BEAT
        if b % 2 == 0: M(tom(45 if root != 48 else 48, .7), tb, .6); M(kick(.7), tb, .55); M(bassn(root, .4), tb, .8)
        else: M(tom(52, .5), tb, .4, .2)
for n, t, d in ((72, at(17), 1.0), (76, at(17, 2), 1.1), (79, 36.2, 1.7), (81, at(19), .9), (79, at(19, 2), .9)):   # mô-típ bí mật dãn dài, đỉnh khi hoa đích nở
    M(horn(n, d, .8), t, .5, .1); M(horn(n - 12, d, .6), t, .2, .1)
M(pad([60, 65, 69, 72], 2.2), 36.0, .7)
for i in range(8): M(bell((72, 76, 79, 84)[i % 4] + (12 if i >= 4 else 0), .45, .9), 36.2 + i * BEAT / 4, .4, -.5 + i / 7)   # chuông rải khi hoa nở
for k, t in enumerate((36.4, 37.3, 38.2, 39.1)):                           # mô-típ "Rollo" (kèn dăm nảy xuống), đi theo Rollo từ phải sang trái
    seq(reed, (67, 64, 60), t, .14, .32, .55 - .37 * k, d=.13)
M(riser(2.0, .8), at(20) - 2.0, .5)                                        # trước cảnh sổ: riser dâng suốt lúc hoa nở trùm màn hình
for i in range(8): M(brush(.4 + .08 * i, .12), at(19, 2) + i * BEAT / 4, .55, -.1)   # chổi trống cuộn vào sổ

# — Sổ 40–48 s, C: ru → ba sticker → ấm áp —
seq(celesta, (79, 76), at(20), .25, .4, .3, d=1.0)                         # Albie còn ngủ: hộp nhạc
for t, ch in zip(HIT['stamp'], ((60, 64, 67, 72), (65, 69, 72, 77), (67, 71, 74, 79))):   # ba sticker: C–F–G cao dần
    strum(pizz, ch, t, .45, .3); M(kick(.6), t, .5); M(xylo(ch[-1] + 12), t + .02, .3, .3)
# "Six legs? In you go!" và lời dặn: lớp nhịp (shuffle ukulele không bè trầm dưới giọng Albie → nửa nhịp ấm C · Am · F · G)
seq(flute, (72, 76, 79), 44.32, .2, .45, .2, d=.3)                         # mô-típ bí mật trên sáo, ngay trước lời dặn
seq(xylo, (79, 76, 74, 72), at(23, 3), BEAT / 4, .45, .2)                  # kính nở: bốn nốt đi xuống, như nhón chân bước vào

# — Kết 48–52 s: nhón chân → ngắt nhạc → "ta-da" —
seq(pizz, (60, 67, 64, 67), at(24), BEAT / 2, .36, .2, d=.14, ramp=-.06)
for i in range(2): M(reed(48 if i == 0 else 55, .14), at(24) + i * BEAT, .26, -.2); M(T.block(84 if i else 79, .4), at(24) + i * BEAT + BEAT / 4, .18, .3)
# v3: hai chỗ khựng có chủ đích vẫn còn một lớp mỏng (không im hẳn: QUALITY.md §4)
add(mus, buzzbass(41, 1.0, .5), at(14, 2) + .02, .5, 0); add(mus, pad([65, 69, 72], 1.0), at(14, 2) + .02, .26, 0)   # v5: to hơn một chút (lớp nhịp làm nhạc chung đầy hơn)   # "Honeybees can't talk," … "so they dance!": ong vo ve chờ
for i in range(10): add(mus, celesta((84, 86)[i % 2], .2), at(24, 2) + .05 + i * .12, .12, .3)   # "Hey... is it tasting me?": hộp nhạc rón rén
add(mus, pad([60, 64, 67], 1.25), at(24, 2) + .02, .26, 0)
tf = HIT['gagLaugh']
seq(xylo, (74, 76), tf - .25, .125, .45, .2)                               # hai nốt dẫn vào tiếng cười
strum(pluck, (60, 64, 67, 72), tf, .6, 1.4, .02)
secret(M, lambda n: horn(n, .9, .7), 72, tf, .1, .5, .1, last=12)         # "ta-da": kèn chơi mô-típ bí mật
M(bell(84, .8, 1.4), tf + .3, .6); M(bassn(36, 1.4), tf, 1.); M(kick(), tf, .9); M(T.cymbal(1.8, 1.), tf, .28, -.15)

# — lớp nhịp theo cảnh (v5) + bảng cảnh nhạc của cả tổ khúc (MUSIC.md); các đoạn viết tay ở trên ghi bằng G.mark —
# Sound Design Plan (11/2026, QUALITY.md §4, SOUND-PLAN.md): tổ khúc viết tay giữ nguyên ở 120 BPM vì hình khớp theo phách (dế gáy, ong nhảy,
# bản đồ); bốn cảnh của lớp nhịp đổi BPM theo nội dung (kính phóng to 104, SWEET 126, Albie 112, lời dặn 112 nửa nhịp) và đổi nhạc cụ hát chính.
# v6 (11/2026, lượt 2: chống trùng giữa các tập): điệu riêng của tập là jig 12/8 (chân nhảy step-dance), chạy qua ong nhảy, bản đồ và cảnh Albie;
# bỏ swing (điệu riêng của 003) và shuffle + piano đồ chơi (trùng công thức với 009).
G = Groove(M, BEAT, TL['lines'], seed=1, avoid=[(HIT['bfGlow'] - .05, HIT['bfGlow'] + .7), (tsw - .05, tsw + .4), (31.0, 31.6), (33.3, 34.0), (44.25, 45.0)], plan=True)
G.mark('rình · rón rén', 0, HIT['stomp'], 'tiptoe', 'C', 'pizz xylo tom', mood='suspense', arc='open',
       what='Bàn chân rình trên hoa: "Can you taste with your feet?"', emo='tò mò, hồi hộp',
       why='Pizzicato trầm đi lên từng nửa cung như bàn chân đang rình, kick mỗi phách, trống dồn khi chân lấy đà; xylophone "hỏi" đi lên.')
G.mark('giẫm · polka', HIT['stomp'], at(2), 'polka', 'C', 'tuba pizz xylo', energy=3, mood='funny', arc='open',
       what='Bàn chân giẫm "bẹp!", bướm bay ra: "Butterflies can!"', emo='bất ngờ, hài hước',
       why='Cú giẫm là cú đánh của cả dàn (tuba, pizzicato, kèn đồ chơi, chũm chọe), rồi polka "oom-pah" nảy; xylophone tíu tít sau chữ "can".')
G.mark('nhạc hiệu', at(2), at(3), 'jingle', 'C', 'horn marimba bell', 3, mood='epic', arc='open', what='"Big secrets of tiny bugs!" – logo',
       emo='phấn khích', why='Nhạc hiệu 2 s của kênh (tập trước 11/2026), giống hệt mọi tập.')
G.mark('bướm bay · đàn hạc 3+3+2', at(3), HIT['bfZoom'], 'lilt', 'F', 'harp flute pizz', mood='magic', arc='build',
       what='"A butterfly lands on a flower." – "Let\'s zoom in!"', emo='nhẹ nhàng, kỳ diệu',
       why='Sang Fa, đàn hạc rải lơi 3+3+2 như cánh bướm, sáo láy vỗ cánh khi Flutter bay vào và đáp khi đậu lên hoa.')
G.sec('kính phóng to · marimba rải', HIT['bfZoom'], 13.0, 'float', 'F', 'C Dm Bb', bass='pizzbass', arp='marimba', lead='celesta', energy=1, cue=False,
      bpm=104, mood='magic', arc='build', what='Kính phóng to bàn chân bướm: "Tiny taste spots on its feet tell it right away:"',
      emo='kỳ diệu, tập trung', why='Chậm lại 104 BPM, marimba rải bí ẩn; mô-típ bí mật lơ lửng trên celesta (viết tay) đúng lúc điểm nếm sáng.')
G.mark('dồn vào SWEET', 13.0, tsw, 'break', 'F', 'pizz', 2, mood='suspense', arc='build', what='Chờ đáp án', emo='nín thở',
       why='Pizzicato dồn đi lên tám nốt, to dần vào chữ SWEET.')
G.sec('SWEET · pop nảy', tsw, at(8, 2), 'bounce', 'F', 'F C', bass='bassn', comp='pluck', lead='marimba', kit='toy', energy=3, cue=False, g=.6,   # câu "Sweet! Time to eat!" vẫn phải rõ
      bpm=126, mood='happy', arc='build', what='"Sweet! Time to eat!" – Flutter cuộn vòi', emo='vui sướng',
      why='Đáp án bừng lên thành pop nảy 126 BPM ở màu ban nhạc kênh (ukulele, marimba, kick, vỗ tay); marimba đáp sau câu.')
G.mark('ngày → đêm', at(8, 2), at(9), 'break', 'Am', 'harp reed', 1, mood='magic', arc='build', what='Trời tối dần, sang khu cỏ đêm', emo='lắng lại',
       why='Đàn hạc rơi xuống chậm dần, kèn dăm trầm: chuyển sang đêm không cắt cụt.')
G.mark('dế · rón rén trong đêm', at(9), at(11, 2), 'tiptoe', 'Am', 'pizz reed chirp', energy=1, mood='suspense', arc='build',
       what='Chirp trong cỏ đêm: "What about crickets?" – "Where are its ears?" – "On its head?" – "Nope!"', emo='tò mò, hồi hộp',
       why='La thứ, pizzicato staccato rón rén, tiếng dế làm bộ gõ đúng phách của hình; kèn dăm "hử?" sau câu hỏi, tuba "bwomp" sau "Nope!".')
G.mark('khựng trước đáp án', at(11, 2), at(12), 'break', 'Am', '', 1, mood='suspense', arc='build', what='Khựng một nhịp trước đáp án', emo='nín thở',
       why='Khoảng lặng có chủ đích ≤ 1 s để đáp án bật ra.')
G.mark('tai ở chân · bừng sáng', at(12), at(14), 'tiptoe', 'C', 'pizz celesta chirp', energy=3, mood='magic', arc='build',
       what='"A cricket\'s ears are on its front legs!" – Chirp nhấc chân "nghe"', emo='ngạc nhiên, vui',
       why='La thứ bừng sang Đô trưởng, mô-típ bí mật trên celesta, chuông; pizzicato hỏi – đáp với tiếng dế khi Chirp nhấc chân.')
G.mark('ong · ú ớ', at(14), HIT['dance'], 'break', 'F', 'buzz', 1, mood='funny', arc='build', what='"Honeybees can\'t talk," – Waggle ú ớ', emo='buồn cười',
       why='Gần như ngắt nhạc: chỉ còn ong vo ve trầm và hợp âm mỏng chờ "so they dance!".')
G.sec('ong · jig "bee hop"', HIT['dance'], at(17), 'jig', 'F', 'F,Bb C,F', bass='buzz', comp='accordion', lead='flute', kit='bodhran', energy=3, cue=False,
      mood='playful', arc='build', what='"so they dance!" – Waggle nhảy điệu lắc', emo='vui nhộn',
      why='Điệu riêng của tập: jig 12/8 trên đúng phách của hình (mỗi phách chia ba), bass vo ve của ong, accordion "oom-cha-cha", trống bodhrán; '
          'sáo chơi mô-típ bí mật chia ba giữa hai câu, xylophone đáp đi xuống.')
G.mark('bản đồ · jig phiêu lưu', at(17), at(20), 'jig', 'C', 'pizz horn bell', energy=3, mood='epic', arc='peak',
       what='Bản đồ điệu nhảy: đường bay dẫn tới bông hoa đích nở trùm màn hình; Rollo lăn qua', emo='phiêu lưu, vỡ oà',
       why='Cao trào của tập (cảnh không lời): jig phiêu lưu, pizzicato chia ba chạy liên tục, tom và kick, mô-típ bí mật dãn dài trên kèn, chuông rải khi hoa nở, riser vào sổ.')
G.mark('sổ · ba sticker', at(20), at(21), 'break', 'C', 'pizz xylo', 2, mood='happy', arc='end', what='Albie còn ngủ; ba sticker dán lên trang',
       emo='hài lòng', why='Hộp nhạc cho Albie ngủ, ba hợp âm Đô – Fa – Sol cao dần theo ba sticker.')
G.sec('Albie · jig ukulele', at(21), 44.3, 'jig', 'C', 'C,Am', bass='bassn', comp='pluck', lead='accordion', kit='bodhran', energy=2, cue=False,
      bpm=112, mood='happy', arc='end', what='Albie: "Six legs? In you go!"', emo='vui, tự hào',
      why='Jig ukulele 112 BPM (điệu riêng của tập trở lại ở sổ), không bè trầm dưới giọng trầm của Albie; accordion đáp sau câu cửa miệng.')
G.sec('lời dặn · nửa nhịp ấm', 44.3, at(23, 3), 'sway', 'C', 'C,Am F,G', bass='pizzbass', comp='pluck', lead='flute', kit='tri', energy=2,
      bpm=112, mood='cute', arc='end', what='"Go outside with a grown-up, and look closely!"', emo='ấm áp, dặn dò',
      why='Nửa nhịp ấm 112 BPM (cảm giác 56) dưới lời dặn, triangle ở phách ba; sáo chơi mô-típ bí mật ngay trước câu (viết tay).')
G.mark('nhón chân', at(23, 3), at(24, 2), 'tiptoe', 'C', 'pizz reed xylo', energy=1, mood='suspense', arc='end', what='Kính nở, Flutter nhón chân bước vào',
       emo='tò mò', why='Bốn nốt xylophone đi xuống như nhón chân bước vào, pizzicato và kèn dăm nhỏ dần.')
G.mark('khựng · ta-da', at(24, 2), DUR, 'break', 'C', 'horn bell pluck', 3, mood='funny', arc='end',
       what='Flutter đậu lên kính: "Hey... is it tasting me?" – cười, chữ móc trở lại', emo='bất ngờ, buồn cười',
       why='Ngắt nhạc cho gag (chỉ còn hộp nhạc rón rén), rồi "ta-da": kèn chơi mô-típ bí mật, ukulele, chuông, chũm chọe.')
G.answer(3.25, 8.28, 20.78, 22.95, 26.0, 26.7, 31.0, 33.32, 44.32)          # câu đáp viết tay ở trên (xylophone tíu tít, sáo, "hử?", "bwomp", hỏi–đáp với tiếng dế…)
G.play(); os.makedirs(os.path.join(HERE, 'out'), exist_ok=True); G.save(os.path.join(HERE, 'out', 'music.json'), color='"Tổ khúc khu vườn" (Đô trưởng, mỗi cảnh một giọng)')

# — cường độ theo cảnh (chuyển mềm 0,3 s), trước khi chuẩn hoá và nhường giọng —
LEVEL = ((0, .75), (at(2), .52), (at(3), .9), (HIT['sweet'], 1.), (at(8, 2), .9), (at(9), .85), (HIT['ckEar'], 1.), (26., .9), (at(14), .7), (HIT['dance'], .95),
         (at(17), .9), (at(20), 1.), (44.3, .95), (at(24), .9), (tf - .3, .85), (HIT['recall'], 1.0))   # mở · nhạc hiệu (dưới lời tựa) · bướm · SWEET · đêm · dế · đáp án · … · bản đồ · sổ · lời dặn · kết
tt = np.arange(len(mus)) / SR; lev = np.full(len(mus), LEVEL[0][1])
for (t, g), (_, g0) in zip(LEVEL[1:], LEVEL[:-1]): lev = np.where(tt >= t - .15, np.where(tt < t + .15, g0 + (g - g0) * (tt - t + .15) / .3, g), lev)
mus *= lev[:, None]


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
    'wordpop': lambda e: mixl(T.boing(220 + 120 * e.get('n', 0), .35, .3, 2.4, 16.), np.pad(pop(.6) * .45, (int(.02 * SR), 0)), T.bubble(1300 + 500 * e.get('n', 0), .35, .05, 2.4)),   # v3: mỗi dòng chữ móc nảy một tiếng
    'recall': lambda e: mixl(T.bubble(1600, .5, .06, 2.4), np.pad(T._ting(mf(103), .5, .35), (int(.02 * SR), 0)), SFX['wordpop']({'n': 0}) * .8, np.pad(SFX['wordpop']({'n': 1}) * .8, (int(.12 * SR), 0))),   # chữ móc trở lại
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
    'flutter': lambda e: wings(e.get('d', .6)) * e.get('v', 1.),
    'titlepop': lambda e: mixl(T.bubble(1600, .5, .06, 2.4), np.pad(T._ting(mf(103), .5, .35), (int(.02 * SR), 0))),   # chữ móc bật ra ở khung đầu
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
mix, I_mix, ceil_db = T.master(mix, 11.6); print(f'master: {I_mix:.1f} LUFS, true-peak ceiling {ceil_db:.1f} dBFS')   # crest 11,6: chừa đỉnh cho AAC (SHORT-004; lượt nhạc nền sinh động 11/2026)
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
