"""Âm thanh của SHORT-011 → out/mix.wav (48 kHz stereo) và stems (chuẩn 11/2026b theo SHORT-016, _shared/QUALITY.md §4, §8, §10).
python mix.py   (cần timeline.json + voice/*.wav từ tools/lines.mjs, _shared/tools/voice_regen.py; events.json từ core/render/events.mjs)
- Nhạc: "Tiptoe Cha-Cha" (Si trưởng, cha-cha-chá rón rén: chuông bò, guiro, phách). Lớp nhịp theo cảnh _shared/audio/groove.py với
  song=TL['song'] (cảnh chồng câu theo phách dùng chords='song' và BPM của phần bài hát) + accomp=True (dưới lời vẫn đủ đệm và bè phụ ở
  dải cao, đổi cảnh nghe ra) + G.theme (chủ đề của tập = câu mở điệp khúc "Big eyes see almost all around!"). Không ai hát (§8.3):
  giai điệu điệp khúc do nhạc cụ hát chính của cảnh chơi dưới câu điệp khúc (TUNE_G).
- Âm thanh theo cảnh 4 lớp (§10): SCENES (năng lượng calm / normal / high / peak, lớp nền), EMO_DB, ambience.beds, out/scenes.json.
- Nhạc lùi dưới giọng: duck theo đường bao giọng (dưới câu theo phách lùi nông hơn), speech_guard giữ lời rõ ≥ 11 dB; master −14 LUFS.
Mọi âm thanh tổng hợp bằng code (_shared/audio/band.py, toon.py, core/audio/sfx.py); không dùng mẫu của bên thứ ba.
Phim phát vòng lặp: phần dư sau DUR cộng vào đầu phim; nốt Fa thăng (bậc năm) ở cuối dẫn về hợp âm Si ở 0,0."""
import os, sys, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio')); sys.path.insert(0, os.path.join(LIB, '_shared', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, thump, pop, click, clack, compress, add
from band import mf, pluck, marimba, bassn, celesta, harp, trumpet, trombone, tuba, xylo, steel, reed, timpani, riser, secret, triangle, pizz, shaker, clap
import toon as T
from groove import Groove
import ambience as AMB                                   # Lớp 4: nền theo bối cảnh
sys.path.insert(0, os.path.join(LIB, '_shared'))
from emote import EMO_DB, CHORUS_DB                      # Lớp 1: độ to theo cảm xúc của câu
from scipy.ndimage import maximum_filter1d, uniform_filter1d

TL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))
EV = json.load(open(os.path.join(HERE, 'events.json'), encoding='utf-8'))['ev']
HIT = TL['hit']; BEAT = 60 / TL['bpm']; DUR = TL['dur']; N = int((DUR + .05) * SR); N0 = int(DUR * SR); NW = N + int(2.5 * SR)
B = {k: np.zeros((NW if k in ('mus', 'fx') else N, 2)) for k in ('mus', 'fx', 'amb')}
LINES = TL['lines']; L = {l['id']: l for l in LINES}
end = lambda i: L[i]['t'] + L[i]['dur']
# câu theo phách: hết đoạn nhạc của câu (nốt cuối của tune); nhạc dâng sau câu theo đoạn nhạc (lời nói ngắn hơn ô của bài)
endm = lambda i: L[i]['t'] + max(n['t'] + n['d'] for n in L[i]['tune']['notes']) + .1 if L[i].get('tune') else end(i)
def speaking(t, pad_=.05): return any(l['t'] - pad_ <= t < l['t'] + l['dur'] + pad_ for l in LINES)
def mixl(*xs): n = max(len(x) for x in xs); return sum(np.pad(x, (0, n - len(x))) for x in xs)
P_CRUMB, P_EYES, P_AROUND, P_CH2, P_CTA = [p['t0'] for p in TL['song']['parts']][1:]
SP, SW, HD = HIT['split'], HIT['sweep'], HIT['hide']


# ---------- nhạc: bảng cảnh (Sound Design Plan) theo bài hát ----------
mus = B['mus']
def M(x, t, g=1., pan=0.): add(mus, x, t, g, pan)
def seq(inst, ns, t0, step, g=1., pan=0., d=None, ramp=0.):
    for i, n in enumerate(ns):
        if n: M(inst(n, d) if d else inst(n), t0 + i * step, g * (1 + ramp * i), pan)
def strum(inst, ns, t, g=.4, d=None, spread=.012):
    for k, n in enumerate(ns): M(inst(n, d) if d else inst(n), t + k * spread, g, -.3 + .6 * k / max(1, len(ns) - 1))
glock = lambda m, d=.6: T._ting(mf(m), d, 1.) * .5
# vùng giai điệu của lớp nhịp nhường chỗ cho điểm nhấn viết tay
AVOID = [(0, .45), (HIT['crunch'] - .05, HIT['crunch'] + .45), (SP[0] - .05, SP[1] + .15), (HIT['open'][0] - .05, HIT['wide'][1]), (HIT['spot'] - .05, HIT['spot'] + .6),
         (end('L05'), HD[1] + .1), (HIT['snap'] - .05, HIT['stamp'] + .5), (HIT['gulp'] - .1, HIT['gulp'] + .25), (HIT['flip'][0] - .05, HIT['flip'][0] + .05),
         (HIT['jump'] - .05, L['L08']['t']), (DUR - 1.0, DUR)]   # khoảng trống lúc lật trang về vườn (≈ 1,2 s) để dành cho chủ đề của tập
G = Groove(M, BEAT, LINES, meter=4, seed=11, avoid=AVOID, plan=True, song=TL['song'], accomp=True)
# chủ đề của tập (accomp): điệp khúc "BIG EYES see AL-most ALL a-ROUND" — fa# si sol# fa# sol# la# sol# fa# (móc đơn)
G.theme([7, 12, 9, 7, 9, 11, 9, 7], [0, 1, 3, 4, 5, 6, 7, 8], every=12., first=False)
G.sec('móc · rón rén cha-cha', 0, L['L02']['t'] - .1, 'chacha', 'B', 'song', bass='bassn', comp='marimba', lead='reed', kit='cha', energy=2, cue=False,
      bpm=120, mood='funny', arc='open', what='Crumb nhón chân, giơ biển BOO! sau lưng Zip; "Can you sneak up on a dragonfly?" (đọc vào phách); giẫm lá khô "rắc", đứng sững một chân',
      emo='tinh nghịch, tò mò', why='Điệu riêng của tập: cha-cha-chá 120 BPM, mỗi bước nhón chân rơi đúng phách ("một, hai, ba, cha-cha"); marimba chặn hợp âm của bài dưới câu hỏi; clarinet rón rén đáp sau câu hỏi.')
G.sec('"From behind, it can\'t see me!"', L['L02']['t'] - .1, SP[0], 'skip', 'B', 'B G#m', bass='bassn', comp='pizz', lead='mute', kit='wood', energy=2,
      bpm=116, mood='funny', arc='open', what='Máy hạ xuống ngang tầm Crumb; Crumb cười trừ, chắc mẩm: "From behind, it can\'t see me!" (nói)', emo='tự tin, buồn cười',
      why='Shuffle nhảy chân sáo 116 BPM, vui tươi: pizzicato nhón từng nốt; trumpet bịt "wah" như cười thầm, vì trẻ sắp biết Crumb nhầm.')
G.mark('khoá kéo tách khung', SP[0], SP[1], 'break', 'B', 'xylo harp', 2, mood='playful', arc='open', what='Khoá kéo chạy từ trên xuống, tách khung thành "CRUMB SEES" | "ZIP SEES"',
       emo='tò mò', why='Viết tay: xylophone chạy nửa cung đi lên theo con chạy của khoá kéo, đàn hạc vuốt khi hai khung mở ra.')
G.sec('Crumb thấy lưng Zip', SP[1], P_EYES, 'quest', 'B', 'song', bass='upright', comp='harp', lead='vibes', kit='toy', energy=2,
      bpm=108, mood='playful', arc='build', what='Máy đẩy vào nửa trái: qua vai Crumb chỉ thấy lưng Zip; "Crumb only sees its back." (đọc vào phách, sing-talk)',
      emo='tò mò, chờ đợi', why='Phiêu lưu nước kiệu 108 BPM, vibraphone hát nhẹ: cuộc rình còn đang "êm"; đàn hạc gảy như đếm bước chờ mắt Zip mở.')
G.sec('mắt Zip mở · tầm nhìn nở rộng', P_EYES, L['L05']['t'], 'twinkle', 'B', 'song', bass='bassn', comp='celesta', lead='steel', kit='tri', energy=2, tr='swell',
      bpm=108, mood='magic', arc='build', what='Máy lia sang nửa phải: mắt Zip mở, tầm nhìn nở rộng gần trọn vòng, Crumb trượt vào khung: "But Zip can see Crumb!"; vòng "bị thấy rồi!"',
      emo='kỳ diệu, bất ngờ', why='Hộp nhạc lấp lánh 108 BPM: trống thép là "mắt" của Zip, celesta rải theo tầm nhìn nở ra; mô-típ bí mật đô–mi–sol trên trống thép đúng lúc Crumb bị thấy (viết tay).')
G.mark('"Oh no!" · nấp sau biển', L['L05']['t'], HD[1], 'break', 'B', 'trombone', 2, mood='funny', arc='build', what='Crumb: "Oh no!" rồi nấp sau tấm biển, nhưng Zip vẫn thấy',
       emo='luống cuống, buồn cười', why='Khựng hài ngắn có chủ đích: chỉ còn guiro cạo nhỏ, trombone "wah-wah" đi xuống sau "Oh no!" (viết tay).')
G.sec('điệp khúc 1 · "Big eyes see almost all around!"', HD[1], HIT['snap'], 'chacha', 'B', 'song', bass='bassn', comp='piano', lead='trumpet', kit='cha', energy=3,
      bpm=132, mood='epic', arc='peak', what='Máy lùi ra cả hai khung: hai vòm mắt Zip sáng lên, vệt sáng chạy quanh tầm nhìn tới tận phía sau; điệp khúc lần 1 (đọc vào phách); Crumb ló ra vẫy',
      emo='vỡ lẽ, phấn khích', why='Cao trào theo điệu của tập: cha-cha-chá nhanh 132 BPM, piano chặn "cha-cha"; trumpet chơi giai điệu điệp khúc dưới câu để trẻ nhớ; timpani nhấn phách đầu, vỗ tay phách 2 và 4.')
G.mark('chụp → sổ', HIT['snap'], HIT['stamp'], 'break', 'B', 'marimba harp', 2, mood='happy', arc='end', what='Khung "ZIP SEES" được "chụp", hoá thành sticker trên trang sổ',
       emo='háo hức', why='Marimba chạy lên (tiếng "chụp" của ban nhạc kênh), đàn hạc vuốt qua mặt sticker.')
G.sec('sổ · Albie', HIT['stamp'], HIT['flip'][0], 'polka', 'E', 'E B', bass='bassn', comp='pluck', lead='accordion', kit='clap', energy=2, cue=False,
      bpm=116, mood='playful', arc='end', what='Sticker "No sneaking!" dán vào sổ; Albie đếm chân: "Six legs? In you go!", Zip lao vào trang đúng "go!"',
      emo='vui, tự hào', why='Polka 116 BPM, accordion đáp sau câu cửa miệng; dưới giọng trầm của Albie lớp nhịp tự bỏ bass.')
G.sec('gag · rón rén lần nữa', HIT['flip'][0], HIT['jump'], 'chacha', 'B', 'B F#', bass='tuba', comp='pizz', lead='bassoon', kit='cha', energy=2, tr='gliss',
      bpm=124, mood='funny', arc='end', what='Lật trang về khu vườn: bassoon thổi chủ đề của tập (câu mở điệp khúc); Crumb rón rén lại gần, giơ biển cao, hít hơi… Zip quay lại trước "zip!"',
      emo='tinh nghịch, nín thở', why='Lại điệu riêng của tập ở 124 BPM, bassoon và tuba rón rén từng bước "cha-cha" (khác móc: clarinet + marimba); câu đáp đầu cảnh là chủ đề của tập.')
G.mark('giật mình · ngã ngồi', HIT['jump'], L['L08']['t'], 'break', 'B', 'timpani trumpet tuba', 2, mood='funny', arc='end', what='Crumb tự giật mình, nhảy bật, biển bay vèo, ngã ngồi lên đệm cỏ',
       emo='bất ngờ, buồn cười', why='Stinger viết tay: timpani + trumpet "ta!", tuba "bwomp" đi xuống khi Crumb ngã ngồi, xylophone "plink" khi biển đáp lên đầu.')
G.sec('"Oh! I scared myself!"', L['L08']['t'], P_CH2, 'sunny', 'E', 'E B', bass='bassn', comp='pluck', lead='xylo', kit='pop', energy=2,
      bpm=124, mood='happy', arc='end', what='Crumb ngồi đội biển "hi!", cười: "Oh! I scared myself!"; Zip cười rung cánh',
      emo='vui, nhẹ nhõm', why='Ukulele quạt nắng 124 BPM, xylophone đáp sau câu cười: không ai đau, cả nhà cùng cười.')
G.sec('điệp khúc 2', P_CH2, P_CTA, 'chacha', 'B', 'song', bass='bassn', comp='piano', lead='trumpet', kit='cha', energy=3, tr='pickup',
      bpm=132, mood='happy', arc='end', reprise=True, what='Điệp khúc lần 2: Zip quay ra, đôi mắt sáng lên lần nữa, vòng sáng chạy quanh khu vườn; Crumb đứng dậy nhún theo; Miss Loupe nhảy',
      emo='vui, đọc theo', why='Nhắc lại đúng nhạc của điệp khúc lần 1 (reprise): trumpet chơi lại giai điệu điệp khúc để trẻ nhận ra và đọc theo.')
G.sec('câu hỏi · vòng lặp', P_CTA, DUR, 'hop', 'B', 'song', bass='bassn', comp='pluck', lead='marimba', kit='bongo', energy=2,
      bpm=120, mood='bouncy', arc='end', what='"Can YOU sneak up on Zip?" (đọc vào phách); Zip quay lưng lại, Crumb giơ biển, rón rén về đúng khung đầu',
      emo='mời gọi, háo hức', why='Nảy lệch phách 120 BPM theo lưới của phim để nối vòng lặp; hợp âm Fa thăng ở cuối dẫn về Si của khung đầu.')
G.answer(1.95, end('L05') + .02, end('L06') + .05, HIT['hat'] + .1)   # câu đáp viết tay bên dưới (clarinet, trombone, trống thép "ồ!", xylophone "plink")
G.play()                                                              # giai điệu đặc trưng (motif) = câu mở điệp khúc, nhạc cụ chơi dưới hai lần điệp khúc
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
G.save(os.path.join(HERE, 'out', 'music.json'), color='"Tiptoe Cha-Cha" (Si trưởng, cha-cha-chá rón rén: chuông bò, guiro, phách; điệp khúc "Big eyes see almost all around!" ở trumpet)')

# — Móc: hợp âm Si ở giây 0; clarinet "rón rén" nhảy quãng sau câu hỏi; lá khô "rắc": clarinet kêu chệch một nốt rồi im —
M(bassn(35, .5), 0., 1.0); strum(marimba, (71, 75, 78, 83), 0., .35, .5); M(T._ting(mf(95), .5, .5) * .5, 0., .12, .4)
seq(lambda m, d: reed(m, d), (78, 83, 81), HIT['crunch'] - .02, .07, .3, -.3, d=.09)
M(reed(86, .25), HIT['crunch'] + .25, .22, -.3)
# — Ngay sau câu của Crumb: pizzicato nhón ba nốt + guiro (shaker) lấp chỗ trống trước khoá kéo —
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
# — "Oh no!": trombone "wah-wah" đi xuống; nấp sau biển: guiro cạo nhỏ giữ nhịp (khựng hài vẫn còn một lớp mỏng) —
M(trombone(59, .5, 1., -3.), end('L05') + .03, .45, .2)
for k in range(int((HD[1] - end('L05')) / .125)): M(T.block(84 + (k % 2) * 3, .25), end('L05') + .05 + k * .125, .5, .1)
# — Điệp khúc 1: hai vòm mắt sáng: celesta lấp lánh; vệt sáng chạy quanh: đàn hạc vuốt; riser → chũm chọe + timpani vào cao trào —
M(riser(.4, .9), HD[1] - .42, .45); M(T.cymbal(1.6, 1., 5200), HD[1], .26, .1); M(timpani(35, 1., 1.0), HD[1], .45)
M(T.sparkle(.6, .25, 93, 106, 7, 3, 'up'), HIT['glow'][0] + .02, .3, -.3)
M(T.gliss(83, 102, SW[1] - SW[0], .14, 'harp'), SW[0] + .02, .6, .3)
seq(steel, (83, 87, 90, 95), end('L06') + .05, .08, .26, .2, d=.5)
B132 = 60 / 132
for c0 in (P_AROUND, P_CH2):                                            # điệp khúc: vỗ tay phách 2 và 4, trẻ vỗ theo
    for k in (1, 3, 5):
        M(clap(.9), c0 + k * B132, .3, -.2); M(clap(.7), c0 + k * B132 + .012, .18, .25)
# — Chụp → sổ: marimba chạy lên; đàn hạc vuốt; sticker: đàn hạc rải + celesta; Zip lao vào trang: xylophone trượt xuống —
seq(marimba, (71, 75, 78, 83, 87), HIT['snap'] + .04, .07, .45, .2, ramp=.1)
M(T.gliss(78, 99, HIT['zoomIn'][1] - HIT['zoomIn'][0], .28, 'harp'), HIT['zoomIn'][0], .9)
M(T.gliss(95, 76, HIT['zoomOut'][1] - HIT['zoomOut'][0], .2, 'harp'), HIT['zoomOut'][0], .7)
strum(harp, (76, 80, 83, 88), HIT['zoomOut'][1], .35, .9); M(celesta(92, 1.0), HIT['stamp'] + .02, .3, .3)
seq(xylo, (92, 88, 83, 80, 76), HIT['gulp'] + .02, .05, .35, .1, d=.2)
M(celesta(95, .8), HIT['mini'] + .02, .3, .4)
# — Gag: Zip quay lại: trống thép "ping"; Crumb giật mình: timpani + trumpet "ta!"; ngã ngồi: tuba "bwomp"; biển đáp lên đầu: xylophone "plink" —
M(steel(90, .4), HIT['turn'][1], .3, .1)
M(timpani(47, .9, .8), HIT['jump'], .55); M(trumpet(78, .3), HIT['jump'] + .01, .3, -.1); M(trumpet(83, .35), HIT['jump'] + .01, .25, .1)
M(tuba(40, .55, 1., -5.), HIT['land'] + .02, .6)
seq(xylo, (88, 95), HIT['hat'] + .1, .1, .3, -.2, d=.15)
# — Điệp khúc 2: mắt Zip sáng lại: celesta lấp lánh + đàn hạc vuốt theo vòng sáng —
M(T.sparkle(.6, .22, 93, 106, 7, 5, 'up'), HIT['glow2'][0] + .02, .26, .2)
M(T.gliss(83, 102, HIT['ring2'][1] - HIT['ring2'][0], .12, 'harp'), HIT['ring2'][0] + .02, .55, -.2)
# — Chữ móc trở lại: hợp âm Si nhỏ ở dải cao; nốt dẫn Fa thăng → Si ở 0,0 —
strum(pluck, (71, 75, 78, 83), HIT['recall'], .2, .8)
M(bassn(42, .3), DUR - BEAT / 2, .9)

# — cường độ theo cảnh (chuyển mềm 0,3 s): dâng ở khám phá / bất ngờ, hạ dưới lời (≈ 0,8 dưới câu theo phách, ≈ 0,72 dưới câu nói) —
# (19/11/2026) dưới câu nói của Crumb, Albie (rõ hơn nhạc 15–25 dB) nhạc chỉ hạ nhẹ: nhạc đệm dưới lời ≤ 8 dB (lần dựng 2: 8,4 dB)
LEVEL = ((0, .9), (L['L01']['t'], .84), (HIT['crunch'], .95), (end('L01'), .95), (L['L02']['t'], .85), (SP[0], 1.0), (L['L03']['t'], .84), (HIT['open'][0], .95), (L['L04']['t'] + .2, .82),
         (HIT['spot'], 1.0), (L['L05']['t'], .82), (HD[0], .86), (L['L06']['t'], .9), (endm('L06'), 1.0), (HIT['snap'], 1.0), (HIT['stamp'] + .3, .8), (L['L07']['t'], .74), (end('L07'), .95),
         (HIT['flip'][0], .95), (HIT['inhale'], .78), (HIT['jump'], 1.0), (L['L08']['t'], .84), (end('L08'), .95), (L['L09']['t'], .9), (L['L10']['t'], .82), (end('L10'), .95))
tt = np.arange(len(mus)) / SR; lev = np.full(len(mus), LEVEL[0][1])
for (t, g), (_, g0) in zip(LEVEL[1:], LEVEL[:-1]): lev = np.where(tt >= t - .15, np.where(tt < t + .15, g0 + (g - g0) * (tt - t + .15) / .3, g), lev)
mus *= lev[:, None]


# ---------- thiết kế âm thanh theo cảnh: mỗi cảnh một mức năng lượng và một lớp nền (QUALITY.md §10) ----------
# energy: calm (êm) · normal · high (móc, điệp khúc) · peak (cao trào); amb: lớp nền của _shared/audio/ambience.py
SCENES = [('hook', 0, SP[0], 'high', 'meadow'), ('crumbsees', SP[0], P_EYES, 'calm', 'meadow'), ('zipsees', P_EYES, HD[1], 'normal', 'meadow'),
          ('chorus1', HD[1], HIT['zoomIn'][0], 'peak', 'meadow'), ('album', HIT['zoomIn'][0], HIT['flip'][1], 'normal', 'paper_room'),
          ('gag', HIT['flip'][1], P_CH2, 'normal', 'meadow'), ('chorus2', P_CH2, P_CTA, 'high', 'meadow'), ('cta', P_CTA, DUR, 'normal', 'meadow')]
EDB = {'calm': -8., 'normal': -3., 'high': 1.5, 'peak': 3.}                # dB cho nhạc và nền (tiếng động: một nửa)
VDB = {'calm': -2., 'normal': 0., 'high': 1., 'peak': 1.5}                # giọng cũng theo cảnh, nhẹ hơn nhạc
def energy_gain(n, k=1., table=None):
    t_s = np.arange(n) / SR; g = np.zeros(n); table = table or EDB
    for _, a, b, en, _a in SCENES: g[(t_s >= a) & (t_s < b)] = table[en] * k
    g = uniform_filter1d(g, int(.5 * SR)); return 10 ** (g / 20)


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
SFX = {
    'titlepop': lambda e: mixl(T.bubble(1600, .5, .06, 2.4), np.pad(T._ting(mf(99), .5, .35), (int(.02 * SR), 0))),
    'wordpop': lambda e: mixl(T.boing(220 + 120 * e.get('n', 0), .35, .3, 2.4, 16.), np.pad(pop(.6) * .45, (int(.02 * SR), 0)), T.bubble(1300 + 500 * e.get('n', 0), .35, .05, 2.4)),
    'tiptoe': lambda e: T.footsteps(1, .1, .55, 90 + 2 * (e.get('n', 0) % 3), seed=e.get('n', 0), soft=True),
    'crunch': lambda e: crunchfx(.9),
    'wobble': lambda e: T.wobble(150, e.get('d', .6), .35, 8., .22),
    'twitch': lambda e: T.blip(98, .25),
    'sheepish': lambda e: T.giggle(2, .4, 88, seed=1),
    'titleout': lambda e: T.swish(.3, .22, 900, 3600, False),
    'tiltup': lambda e: T.swish(e.get('d', .8), .16, 700, 2800, True, .3, .4),
    'tiltdown': lambda e: T.swish(e.get('d', 1.), .14, 2600, 700, False, .3, .4),
    'zipper': lambda e: zipperfx(e.get('d', .5)),
    'panels': lambda e: mixl(T.pops(2, .05, 86, .4), T.paper(.25, .3, 4, 2)),
    'pushL': lambda e: T.swish(.45, .14, 500, 2400, True, .3, .3),
    'eyeopen': lambda e: mixl(T.swell(.45, .4, 79, 100, 2), T.bubble(700, .3, .1, 2.0)),
    'widen': lambda e: mixl(T.swish(e.get('d', 1.), .3, 400, 2600, True), T.whistle(500, 1200, e.get('d', 1.), .1)),
    'spot': lambda e: mixl(T.ding(93, .6, .8), T.sparkle(.4, .3, 91, 104, 6, 5, 'up')),
    'hide': lambda e: mixl(T.swish(.25, .3, 1200, 3800, False), np.pad(T.paper(.2, .35, 4, 6), (int(.08 * SR), 0))),
    'chorus': lambda e: mixl(T.sparkle(.55, .2, 92, 104, 5, 3, 'up'), T.tink(.3)),
    'glow': lambda e: T.sparkle(.6, .3, 93, 106, 8, 7, 'up'),
    'sweep': lambda e: hp(T.swirl(e.get('d', 1.5), .25, 3., 1000, 3600), 1500),     # ở dải cao: không che câu điệp khúc
    'peek': lambda e: mixl(T.blip(88, .3), np.pad(T.giggle(3, .35, 90, seed=3), (int(.1 * SR), 0))),
    'snap': lambda e: mixl(click(1., .25) * .8, np.pad(click(.8, .2) * .5, (int(.045 * SR), 0)), np.pad(T.sparkle(.45, .3, 93, 108, 6, 7, 'up'), (int(.06 * SR), 0))),
    'zoomin': lambda e: mixl(T.swish(e.get('d', .3), .42, 600, 5200, True, .15, .25), riser(e.get('d', .3), .4)),
    'zoomout': lambda e: mixl(T.swish(e.get('d', .35), .3, 500, 3800, False, .25, .2), np.pad(T.paper(.3, .35, 5, 4), (int(.1 * SR), 0))),
    'page': lambda e: mixl(T.paper(.35, .45, 5, 1), T.bubble(520, .3, .09)),
    'swipe': lambda e: T.swipe(e.get('d', .3), .32, True, e.get('lo', 1500), e.get('hi', 5500)),
    'stamp': lambda e: mixl(thump(.8, 110) * .7, hp(noise(.07), 1200) * env_exp(.07, .012) * .6),
    'ding': lambda e: T.ding(e.get('m', 88), .4, .7),
    'textpop': lambda e: T.textpop(.7, 86 + 2 * e.get('n', 0)),
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
VERB = {'titlepop': .3, 'ding': .4, 'flip': .3, 'page': .3, 'swipe': .25, 'spot': .45, 'glow': .4, 'eyeopen': .35, 'panels': .3, 'sweep': .3, 'chorus': .3}
snd = np.zeros(NW)
for e in EV:
    x = SFX[e['type']](e); add(fx, x, e['t'], 1., e.get('pan', 0))
    if e['type'] in VERB: s0 = int(e['t'] * SR); k = min(len(x), NW - s0); snd[s0:s0 + k] += x[:k] * VERB[e['type']]
fx += T.verb(snd, 1.3) * .35
fx *= energy_gain(len(fx), .5)[:, None]                  # tiếng động theo năng lượng cảnh (một nửa mức của nhạc)


# ---------- vòng lặp: phần dư sau DUR cộng vào đầu phim ----------
for k in ('mus', 'fx'):
    b = B[k]; tail = b[N0:].copy(); b[:len(tail)] += tail; B[k] = b[:N].copy()
mus, fx = B['mus'], B['fx']


# ---------- Lớp 4 – nền theo bối cảnh: khu vườn buổi chiều (meadow: gió lá, chim xa né lời), trang sổ (paper_room) ----------
amb = B['amb']; amb += AMB.beds(DUR, [(a, b, nm) for _, a, b, _e, nm in SCENES], speaking=speaking, seed=11)[:len(amb)]


# ---------- giọng (mọi câu là giọng TTS gốc, không hát; không vang phòng / lọc trên giọng Miss Loupe, QUALITY.md §9.10) ----------
vox = np.zeros(N)
def _lvl(y): a = np.abs(y); act = y[a > a.max() * .1] if len(y) else y; return 20 * np.log10(np.sqrt(np.mean(act ** 2)) + 1e-9) if len(act) else -99.
VY = {}
for Ln in LINES:
    y, sr = sf.read(os.path.join(HERE, 'voice', Ln['id'] + '.wav'))
    if y.ndim > 1: y = y.mean(1)
    VY[Ln['id']] = soxr.resample(y, sr, SR)
# cân độ to từng câu về trung vị của chính nhân vật đó (tối đa ±6 dB)
LV = {k: _lvl(y) for k, y in VY.items()}
MED = {w: float(np.median([LV[l['id']] for l in LINES if l['who'] == w])) for w in {l['who'] for l in LINES}}
VOX_TRIM = {}   # (19/11/2026) thử +1 / +1,5 dB cho L04, L06, L09 (lời rõ 10,7–11,3 dB): các câu này là đỉnh của dải giọng, cả dải giọng bị chuẩn hoá xuống, speech_guard phải hạ nhạc nhiều hơn → bỏ
for Ln in LINES:
    y = VY[Ln['id']] * 10 ** (float(np.clip(MED[Ln['who']] - LV[Ln['id']], -6, 6)) / 20)
    sg = Ln.get('tune') or {}; ed = EMO_DB.get(Ln.get('emo'), 0.) + (CHORUS_DB if sg.get('chorus') else 0.) + VOX_TRIM.get(Ln['id'], 0.)   # điệp khúc nói theo phách to hơn
    y = y * 10 ** (ed / 20)
    if Ln['who'] == 'crumb': y = lp(y, 8500, 4)              # giọng nâng cao độ (Crumb +5) có tiếng rít ~9,5 kHz; giọng Miss Loupe giữ đủ dải như SHORT-015
    s = int(Ln['t'] * SR); e = min(N, s + len(y)); vox[s:e] += y[:e - s]
vox = norm(compress(norm(vox, .9), thr=.22, ratio=2.5), .85)
vox = vox * energy_gain(len(vox), 1., VDB)                 # giọng theo năng lượng cảnh (êm −2 dB … cao trào +1,5 dB)


# ---------- trộn: nhạc lùi dưới giọng (dưới câu theo phách lùi ít hơn), lời rõ ≥ 11 dB, master −14 LUFS ----------
def rms(x): x = x[np.abs(x).max(1) > 1e-4] if x.ndim > 1 else x[np.abs(x) > 1e-4]; return float(np.sqrt(np.mean(x ** 2))) if len(x) else 0.
_e = np.sqrt(uniform_filter1d((mus ** 2).mean(1), int(.6 * SR)) + 1e-14); _ref = np.percentile(_e[_e > 1e-5], 70)
mus = mus * uniform_filter1d(np.clip((_ref / np.maximum(_e, 1e-7)) ** .5, 1, 4), int(.3 * SR))[:, None]   # không có lỗ im của nhạc
mus *= .075 / max(rms(mus), 1e-9); fx *= .55 / max(np.abs(fx).max(), 1e-9); amb *= .022 / max(rms(amb), 1e-9)
# năng lượng theo cảnh, áp SAU bước lấp lỗ im: cảnh êm nhỏ, cao trào nổi (LRA 4–9 LU)
mus *= energy_gain(len(mus))[:, None]; amb *= energy_gain(len(amb), .6)[:, None]
SEC = json.load(open(os.path.join(HERE, 'out', 'music.json'), encoding='utf-8')).get('sections', [])
json.dump({'scenes': [dict(id=i, t0=round(a, 3), t1=round(b, 3), energy=en, amb=nm, music_db=EDB[en], voice_db=VDB[en],
                           voice=[dict(id=l['id'], who=l['who'], emo=l.get('emo'), mode=(l.get('tune') or {}).get('mode', 'speak'), text=l['text']) for l in LINES if a <= l['t'] + l['dur'] / 2 < b],
                           music=[S_['name'] for S_ in SEC if S_['t0'] < b - .05 and S_['t1'] > a + .05],
                           sfx=sorted({e['type'] for e in EV if a <= e['t'] < b})) for i, a, b, en, nm in SCENES]},
          open(os.path.join(HERE, 'out', 'scenes.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
ve = uniform_filter1d(maximum_filter1d(np.abs(vox), int(.05 * SR)), int(.25 * SR))
tunem = np.zeros(len(ve)); otherm = np.zeros(len(ve))
for l in LINES:
    if l.get('tune'): tunem[int(l['t'] * SR):int((l['t'] + l['dur']) * SR)] = 1   # câu theo phách = phần lời của bài: nhạc đệm đủ
    if l['who'] != 'loupe': otherm[int(l['t'] * SR):int((l['t'] + l['dur']) * SR)] = 1   # Crumb, Albie rõ hơn nhạc nhiều: lùi ít hơn
ve_m = ve * (1 - .25 * uniform_filter1d(tunem, int(.2 * SR)) - .2 * uniform_filter1d(otherm, int(.2 * SR)))
mid_m = (.66 - .21 * uniform_filter1d(tunem, int(.2 * SR)))[:, None]
mus = T.duck(mus, ve_m, mid_m, .3); fx = T.duck(fx, ve, .6, .3); amb = T.duck(amb, ve, .7, .5)
mus, GUARD = T.speech_guard(mus, fx, vox, LINES, 11.)               # chỉ hạ nhạc ở câu còn thiếu độ rõ
print('speech_guard:', ', '.join(f'{k} {s_:.1f} dB → −{c:.1f} dB' for k, s_, c in GUARD) or 'không câu nào phải hạ')
# vang phòng nhỏ cho Crumb, Albie (không cho Miss Loupe: giọng cô khô như SHORT-015)
_nl = np.zeros(N)
for Ln in LINES:
    if Ln['who'] != 'loupe': _nl[int(Ln['t'] * SR):int((Ln['t'] + Ln['dur']) * SR)] = 1
_nl = uniform_filter1d(_nl, int(.03 * SR))
V = np.stack([vox, vox], 1) + T.verb(hp(vox * _nl, 250), .6, 4500) * .12
mix = mus + fx + amb + V
mix = np.tanh(mix * 1.1) / 1.1
mix, I_mix, ceil_db = T.master(mix, 10.5); print(f'master: {I_mix:.1f} LUFS, true-peak ceiling {ceil_db:.1f} dBFS')
nf = int(.02 * SR); mix[:nf] *= np.linspace(0, 1, nf)[:, None]
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR, subtype='PCM_24')
for k, x in (('mus', mus), ('fx', fx), ('amb', amb), ('vox', V)): sf.write(os.path.join(HERE, 'out', f'stem_{k}.wav'), x.astype(np.float32), SR, subtype='PCM_16')
print('out/mix.wav', f'{len(mix) / SR:.2f} s')
