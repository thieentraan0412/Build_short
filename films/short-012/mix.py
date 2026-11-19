"""Âm thanh của SHORT-012 → out/mix.wav (48 kHz stereo) và stems (chuẩn 11/2026b theo SHORT-016, _shared/QUALITY.md §4, §8, §10).
python mix.py   (cần timeline.json + voice/*.wav từ tools/lines.mjs, _shared/tools/voice_regen.py; events.json từ core/render/events.mjs)
- Nhạc: "Reverse-Gear Reggae" (Rê giáng trưởng, reggae one-drop là điệu riêng của tập; trống thép là giọng của Zip). Lớp nhịp theo cảnh
  _shared/audio/groove.py với song=TL['song'] (cảnh chồng câu theo phách dùng chords='song' và BPM của phần bài hát) + accomp=True + G.theme
  (chủ đề của tập = điệp khúc "Front wings up, back wings down!"). Không ai hát (§8.3): giai điệu điệp khúc do nhạc cụ hát chính của cảnh chơi.
- Viết riêng ở đây (không sửa file chung): spinback() — cú "rewind" của DJ reggae (đoạn nhạc vừa chơi quay ngược, nhanh dần) mỗi khi Zip bay lùi
  ở chỗ không có lời; tiếng phanh kít, tiếng cào đĩa "wiki-wiki", tiếng cánh rì rì, còi lùi "bíp bíp".
- Âm thanh theo cảnh 4 lớp (§10): SCENES (năng lượng calm / normal / high / peak, lớp nền), EMO_DB, ambience.beds, out/scenes.json.
Không dùng mẫu âm thanh của bên thứ ba. Phim phát vòng lặp: nốt La giáng (bậc năm) ở cuối dẫn về hợp âm Rê giáng ở 0,0; đuôi tiếng sau 24 s gấp về đầu phim."""
import os, sys, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio')); sys.path.insert(0, os.path.join(LIB, '_shared', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, thump, pop, click, clack, compress, add
from band import mf, pluck, marimba, bassn, steel, rhodes, celesta, harp, trumpet, tuba, xylo, kazoo, bassoon, triangle, timpani, riser, clap
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
endm = lambda i: L[i]['t'] + max(n['t'] + n['d'] for n in L[i]['tune']['notes']) + .1 if L[i].get('tune') else end(i)
def speaking(t, pad_=.05, d=0.): return any(l['t'] - pad_ <= t + d and t < l['t'] + l['dur'] + pad_ for l in LINES)
def mixl(*xs): n = max(len(x) for x in xs); return sum(np.pad(x, (0, n - len(x))) for x in xs)
P_ZOOM, P_BACK, P_STILL, P_SLOW, P_CH2 = [p['t0'] for p in TL['song']['parts']][1:]
CTA0 = round(L['L10']['t'] - .13, 2)                      # cảnh câu hỏi kết bắt đầu ngay trước câu (cùng phần F của bài)


# ---------- nhạc: bảng cảnh (Sound Design Plan) theo bài hát ----------
# Soi chậm: cánh trước lên = xylophone đi lên ở dải cao, cánh sau xuống = tuba đi xuống ở dải trầm (ngược chiều nhau, ngoài dải giọng).
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
         (end('L04'), L['L05']['t']), (end('L05'), HIT['stamp'] + .5), (HIT['gulp'] - .1, HIT['gulp'] + .5), (HIT['flip'][0] - .05, HIT['flip'][1] + .02),
         (HIT['bump'] - .05, L['L08']['t']), (end('L08'), L['L09']['t']), (HIT['spin'] - .05, DUR)]
G = Groove(M, BEAT, LINES, meter=4, seed=12, avoid=AVOID, plan=True, song=TL['song'], accomp=True)
# chủ đề của tập (accomp): điệp khúc "front wings UP, back wings DOWN" — fa son la♭, son mi♭ rê♭ (móc đơn liền, vừa khoảng trống ở gag)
G.theme([4, 5, 7, 5, 2, 0], [0, 1, 2, 3, 4, 5], every=10., first=False)
G.sec('móc · phanh kít, bay lùi', 0, P_ZOOM, 'reggae', 'Db', 'song', bass='bassn', comp='rhodes', lead='steel', kit='dub', energy=2, cue=False,
      bpm=120, mood='playful', arc='open', what='Zip lao tới, phanh kít trước kính rồi bay giật lùi, hai lần; "Could you fly backwards?" (đọc vào phách); Miss Loupe hoa mắt',
      emo='bất ngờ, buồn cười', why='Điệu riêng của tập: reggae one-drop (trống chỉ rơi ở phách 3, đàn phím điện "skank" phách 2 và 4); trống thép là giọng của Zip. Cú lùi thứ hai là một cú "rewind" của DJ: nhạc quay ngược rồi chơi tiếp.')
G.sec('"Let\'s zoom in!"', P_ZOOM, P_BACK, 'bounce', 'Db', 'song', bass='bassn', comp='pluck', lead='vibes', kit='pop', energy=2,
      bpm=126, mood='happy', arc='open', what='Máy hạ xuống, Miss Loupe lắc đầu cho hết hoa mắt: "Let\'s zoom in!" (câu cửa miệng, vào phách), kính bật về phía máy', emo='háo hức',
      why='Pop nảy 126 BPM, ukulele chặn hợp âm của bài; vibraphone đáp sau câu cửa miệng; đàn hạc vuốt lên khi kính bật (viết tay).')
G.sec('kính · bay lùi', P_BACK, P_STILL, 'quest', 'Db', 'song', bass='upright', comp='pizz', arp='celesta', lead='flute', kit='tom', energy=2,
      bpm=108, mood='magic', arc='build', what='Trong kính lớn Zip bay lùi, đuôi đi trước: "Dragonflies can fly backwards!" (sing-talk); chữ BACKWARDS!', emo='kỳ diệu',
      why='Phiêu lưu nước kiệu 108 BPM: pizzicato và celesta rải theo chuyến bay, sáo hát.')
G.sec('kính · đứng yên', P_STILL, P_SLOW, 'float', 'Db', 'song', bass='upright', arp='harp', lead='glock', kit='tri', energy=2, tr='gliss',
      bpm=108, mood='cute', arc='build', what='Zip phanh, đứng yên giữa trời trên đường chấm chấm, quay mặt ra: "And stay still in the air!" (đọc vào phách); chữ STILL!',
      emo='ngạc nhiên, nín thở vui', why='Rải lơ lửng 108 BPM (vẫn tươi), đàn hạc rải và glockenspiel: nhạc cũng "đứng yên" lơ lửng như Zip; triangle ở phách đầu.')
G.sec('soi chậm · điệp khúc 1', P_SLOW, HIT['snap'], 'reggae', 'Db', 'song', bass='bassn', comp='piano', lead='trumpet', kit='dub', energy=3, tr='riser',
      bpm=120, mood='epic', arc='peak', what='Soi chậm: cánh trước (chanh) lên khi cánh sau (hồng) xuống, mũi tên bật theo nhịp; điệp khúc lần 1 "Front wings up, back wings down!"',
      emo='wow, vỡ lẽ', why='Cao trào: reggae 120 BPM, một chu kỳ cánh 1,25 s bằng đúng 5 móc đơn nên mỗi đỉnh cánh rơi trên lưới nhịp; trumpet chơi giai điệu điệp khúc dưới câu '
      '(leo lên ở "UP", rơi xuống ở "DOWN"); cánh trước lên = xylophone đi lên (dải cao), cánh sau xuống = tuba đi xuống (dải trầm); vỗ tay phách 2 và 4.')
G.mark('chụp → sổ', HIT['snap'], HIT['stamp'], 'break', 'Db', 'marimba harp', 2, mood='happy', arc='end', what='Kính "chụp" Zip đang đứng yên, sticker hiện trên trang sổ',
       emo='háo hức', why='Marimba chạy lên (tiếng "chụp" của ban nhạc kênh), đàn hạc vuốt qua mặt kính.')
G.sec('sổ · Albie', HIT['stamp'], HIT['flip'][0], 'reggae', 'Db', 'Gb Db', bass='bassn', comp='pluck', lead='kazoo', kit='dub', energy=2,
      bpm=112, mood='playful', arc='end', what='Sticker "Flies backwards!" dán vào sổ; Zip đứng yên cho Albie đếm chân: "Six legs? In you go!", Zip lùi đuôi vào trang đúng "go!"',
      emo='vui, tự hào', why='Cảnh sổ phối theo điệu của tập: reggae 112 BPM, ukulele "skank", kazoo đáp sau câu cửa miệng; dưới giọng trầm của Albie lớp nhịp tự bỏ bass.')
G.sec('gag · dang tay đi lùi "bíp bíp"', HIT['flip'][0], HIT['bump'], 'hop', 'Db', 'Db Gb', bass='tuba', comp='pizz', lead='accordion', kit='comic', energy=2, tr='drop',
      bpm=112, mood='funny', arc='end', what='Lật trang về lối cỏ: Miss Loupe dang tay làm cánh, bước lùi kêu "bíp bíp", không thấy Albie sau lưng; accordion thổi chủ đề của tập',
      emo='buồn cười, tinh nghịch', why='Nảy lệch phách 112 BPM: tuba và pizzicato nảy theo từng bước lùi; câu đáp đầu cảnh là chủ đề của tập (giai điệu điệp khúc) trên accordion, như Miss Loupe tự ngân lại bài.')
G.sec('"Watch the corners!"', HIT['bump'], P_CH2, 'polka', 'Db', 'Ab Db', bass='bassn', comp='marimba', lead='bassoon', kit='clap', energy=2, tr='bump',
      bpm=116, mood='funny', arc='end', what='Bộp! Lưng Miss Loupe chạm góc sách của Albie: "Watch the corners!" (nói); góc sách lấp lánh, Miss Loupe đỏ mặt cười',
      emo='buồn cười, nhẹ nhõm', why='Polka hài 116 BPM bật ra ngay sau cú "bộp" (tuba "bwomp" viết tay); bassoon "hô hô" đáp khi Miss Loupe cười.')
G.sec('điệp khúc 2', P_CH2, CTA0, 'reggae', 'Db', 'song', bass='bassn', comp='piano', lead='trumpet', kit='dub', energy=3, tr='pickup',
      bpm=120, mood='happy', arc='end', reprise=True, what='Điệp khúc lần 2: Zip trôi vào giữa, đập cánh so le (tô hai màu, mũi tên lên / xuống); Miss Loupe vỗ tay như cánh, Albie nhún',
      emo='vui, đọc theo', why='Nhắc lại đúng nhạc của điệp khúc lần 1 (reprise): trumpet chơi lại giai điệu điệp khúc để trẻ nhận ra và đọc theo.')
G.sec('câu hỏi · vòng lặp', CTA0, DUR, 'gallop', 'Db', 'song', bass='bassn', comp='marimba', lead='xylo', kit='toy', energy=2,
      bpm=120, mood='bouncy', arc='end', what='"Which way is Zip flying?" (đọc vào phách) – Zip bay lùi ngang khung ra phải; chữ móc trở lại; "rewind", Zip lao tới lại như khung đầu',
      emo='háo hức, mời gọi', why='Phi ngựa (nhịp kép) 120 BPM theo chuyến bay ngang khung; cú "rewind" cuối kéo nhạc về hợp âm Rê giáng của khung đầu nên vòng lặp liền.')
G.answer(1.5, HIT['dizzy'][0] + .2, 7.0, end('L05') + .05, end('L08') + .05)   # câu đáp viết tay bên dưới (trống thép của Zip, hoa mắt, triangle, kèn, bassoon cười)
G.play()                                                              # giai điệu đặc trưng (motif) = câu điệp khúc, nhạc cụ chơi dưới hai lần điệp khúc
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
G.save(os.path.join(HERE, 'out', 'music.json'), color='"Reverse-Gear Reggae" (Rê giáng trưởng, reggae one-drop, mỗi cú bay lùi là một cú "rewind" của DJ; điệp khúc "Front wings up, back wings down!" ở trumpet)')

# — Móc: hợp âm Rê giáng ở giây 0; trống thép của Zip "ting-ting-ting" khi Zip đứng yên (sau câu hỏi) —
M(bassn(37, .5), 0., 1.0); strum(rhodes, (61, 65, 68, 73), 0., .25, .6); M(steel(85, .5), 0., .25, .4)
seq(lambda m, d: steel(m, d), (80, 85, 89), end('L01') + .05, .1, .4, .35, d=.25)
# — hoa mắt: trống thép đi xuống chậm, lảo đảo —
seq(lambda m, d: steel(m, d), (89, 85, 82, 77, 80), HIT['dizzy'][0] + .15, .13, .3, -.3, d=.3)
# — Kính bật: đàn hạc vuốt lên —
M(T.gliss(73, 97, .45, .26, 'harp'), HIT['zoom'][0], .9)
# — Đứng yên: triangle + celesta ngay trước "And stay still…" —
M(triangle(.5, 1.2), HIT['lbrake'] + .03, .5, .2); M(celesta(85, 1.0), HIT['lbrake'] + .05, .22, .3)
# — Soi chậm: riser → chũm chọe + timpani mở cao trào; mỗi đỉnh "cánh trước lên": xylophone đi lên (cao); "cánh sau lên": tuba đi xuống (trầm) —
M(riser(.4, .9), P_SLOW - .42, .4); M(T.cymbal(1.6, 1., 5200), P_SLOW, .24, .1); M(timpani(44, .8, 1.0), HIT['slow'][0], .55)
for p in PEAK_UP:                                                  # cánh trước lên + cánh sau xuống: xylophone đi lên, tuba trượt xuống, cùng lúc
    if p < HIT['snap'] - .1: seq(xylo, (85, 89, 92), p - .1, .05, .16, .25, d=.18); M(tuba(49, .45, 1., -5.), p - .05, .5, -.2)
for s in ST[::2]:                                                  # nửa nhịp kia: cánh trước xuống, cánh sau lên (nhỏ hơn)
    if s < HIT['snap']: seq(xylo, (92, 89, 85), s - .1, .05, .1, .25, d=.16); M(tuba(44, .4, 1., 5.), s - .05, .35, -.2)
B120 = .5
for c0 in (L['L05']['t'] + .12, L['L09']['t'] + .12):                # điệp khúc: vỗ tay phách 2 và 4, trẻ vỗ theo
    for k in (1, 3):
        M(clap(.9), c0 + k * B120, .3, -.2); M(clap(.7), c0 + k * B120 + .012, .18, .25)
# — Ngay sau lời giải thích: trumpet Rê giáng–Fa–La giáng–Rê giáng đi lên (ta-da nhỏ) —
seq(lambda m, d: trumpet(m, d), (73, 77, 80), end('L05') + .06, .1, .3, .1, d=.2); M(trumpet(85, .45), end('L05') + .36, .27, .1)
# — Chụp → sổ: marimba chạy lên; đàn hạc vuốt; sticker: đàn hạc rải + hộp nhạc; Zip lùi vào trang: xylophone trượt xuống —
seq(marimba, (73, 77, 80, 85, 89), HIT['snap'] + .04, .07, .45, .2, ramp=.1)
M(T.gliss(80, 99, HIT['zoomIn'][1] - HIT['zoomIn'][0], .28, 'harp'), HIT['zoomIn'][0], .9)
M(T.gliss(95, 78, HIT['zoomOut'][1] - HIT['zoomOut'][0], .2, 'harp'), HIT['zoomOut'][0], .7)
strum(harp, (73, 77, 80, 85), HIT['zoomOut'][1], .35, .9); M(celesta(92, 1.0), HIT['stamp'] + .02, .3, .3)
seq(xylo, (92, 89, 85, 80, 77), HIT['gulp'] + .02, .05, .32, .1, d=.2)
M(celesta(97, .8), HIT['mini'] + .02, .3, .4)
# — Gag: "bộp" → tuba "bwomp" đi xuống + vỗ tay; Miss Loupe cười: bassoon "hô hô" —
M(tuba(42, .5, 1., -4.), HIT['bump'] + .02, .6); M(clap(.8), HIT['bump'] + .01, .35)
seq(lambda m, d: bassoon(m, d), (56, 61, 56, 61), end('L08') + .02, .045, .26, -.2, d=.05)
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

# — cường độ theo cảnh (chuyển mềm 0,3 s): dâng ở khám phá / bất ngờ, hạ dưới lời (≈ 0,8 dưới câu theo phách, ≈ 0,75 dưới câu nói) —
LEVEL = ((0, .95), (.2, .8), (HIT['brake'], .92), (HIT['brake'] + .25, .8), (endm('L01'), 1.0), (HIT['back2'][0], 1.0), (HIT['dizzy'][1], .85), (L['L02']['t'], .8),
         (HIT['zoom'][0], 1.0), (L['L03']['t'], .8), (end('L03'), .95), (L['L04']['t'], .78), (end('L04'), 1.0), (L['L05']['t'], .85), (endm('L05'), 1.0),
         (HIT['snap'], 1.0), (HIT['stamp'] + .3, .78), (L['L06']['t'], .42), (HIT['gulp'], .95), (HIT['gulp'] + .5, .85), (HIT['flip'][0], .95),
         (HIT['bump'], 1.0), (L['L08']['t'], .44), (end('L08'), .95),   # (19/11/2026) dưới câu nói của Albie nhạc lùi sâu hơn (≥ 8 dB dưới câu nói)
         (L['L09']['t'], .85), (L['L10']['t'], .74), (HIT['spin'], 1.0))
tt = np.arange(len(mus)) / SR; lev = np.full(len(mus), LEVEL[0][1])
for (t, g), (_, g0) in zip(LEVEL[1:], LEVEL[:-1]): lev = np.where(tt >= t - .15, np.where(tt < t + .15, g0 + (g - g0) * (tt - t + .15) / .3, g), lev)
mus *= lev[:, None]


# ---------- thiết kế âm thanh theo cảnh: mỗi cảnh một mức năng lượng và một lớp nền (QUALITY.md §10) ----------
SCENES = [('hook', 0, P_ZOOM, 'high', 'meadow'), ('zoom', P_ZOOM, P_BACK, 'normal', 'meadow'), ('backwards', P_BACK, P_STILL, 'normal', 'meadow'),
          ('still', P_STILL, P_SLOW, 'calm', 'meadow'), ('slowmo', P_SLOW, HIT['zoomIn'][0], 'peak', 'meadow'), ('album', HIT['zoomIn'][0], HIT['flip'][1], 'normal', 'paper_room'),
          ('gag', HIT['flip'][1], P_CH2, 'normal', 'meadow'), ('chorus2', P_CH2, CTA0, 'high', 'meadow'), ('cta', CTA0, DUR, 'normal', 'meadow')]
EDB = {'calm': -8., 'normal': -3., 'high': 1.5, 'peak': 3.}                # dB cho nhạc và nền (tiếng động: một nửa)
VDB = {'calm': -2., 'normal': 0., 'high': 1., 'peak': 1.5}                # giọng cũng theo cảnh, nhẹ hơn nhạc
def energy_gain(n, k=1., table=None):
    t_s = np.arange(n) / SR; g = np.zeros(n); table = table or EDB
    for _, a, b, en, _a in SCENES: g[(t_s >= a) & (t_s < b)] = table[en] * k
    g = uniform_filter1d(g, int(.5 * SR)); return 10 ** (g / 20)


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
def armflap(n, v=1.):                             # Miss Loupe vỗ tay như cánh: "phạch" vải nhẹ ở dải cao (dưới điệp khúc, không chạm dải giọng)
    d = .18; tt = t_(d)
    return fade_safe(bp(noise(d), 4200 + 400 * (n % 2), 9000) * np.sin(np.pi * tt / d) ** 2 * .28 + np.sin(2 * np.pi * 85 * tt) * np.exp(-tt * 18) * .3) * v
SFX = {
    'titlepop': lambda e: mixl(T.bubble(1600, .5, .06, 2.4), np.pad(T._ting(mf(97), .5, .35), (int(.02 * SR), 0))),
    'wordpop': lambda e: mixl(T.boing(220 + 120 * e.get('n', 0), .35, .3, 2.4, 16.), np.pad(pop(.6) * .45, (int(.02 * SR), 0)), T.bubble(1300 + 500 * e.get('n', 0), .35, .05, 2.4)),
    'brake': lambda e: mixl(screech(.26, e.get('v', 1.)), np.pad(thump(.5, 120) * .25 * e.get('v', 1.), (int(.02 * SR), 0))),
    'startle': lambda e: mixl(T.boing(260, .3, .32, 2.3, 15.), T.surprise(.35)),
    'reverse': lambda e: airback(e.get('d', .8), e.get('v', 1.)) if speaking(e['t'], .05, e.get('d', .8) * .6) else mixl(scratch(min(.5, e.get('d', .5)), e.get('v', 1.)), airback(e.get('d', .8), .6 * e.get('v', 1.))),
    'lensback': lambda e: mixl(airback(e.get('d', 1.4), .6), T.whistle(1400, 700, e.get('d', 1.4) * .6, .05)),       # bay lùi trong kính (dưới lời): gió + còi trượt xuống rất nhỏ
    'tailin': lambda e: mixl(scratch(min(.4, e.get('d', .5)), .45, 1.5), airback(e.get('d', .5), .35)),            # lùi đuôi vào trang: "wiki" ngắn
    'reverseout': lambda e: mixl(airback(e.get('d', 1.1), .5), T.zip_(min(.6, e.get('d', 1.)), 1800, 900, .25)),   # bay lùi ra khỏi khung (dưới câu hỏi kết): gió + "zíp" đi xuống
    'hum': lambda e: whirr(e.get('d', .5), .9),
    'dash': lambda e: mixl(T.zip_(e.get('d', .25), 600, 2600, .45), T.swish(e.get('d', .25), .22, 900, 4200, False)),
    'dizzy': lambda e: mixl(T.wobble(150, e.get('d', .7), .3, 6., .2), T.pops(4, .12, 91, .25, False)),
    'zoom': lambda e: mixl(riser(.4, .8), T.whistle(420, 1250, .4, .12)),
    'textpop': lambda e: T.textpop(.7, e.get('m', 86)),
    'still': lambda e: mixl(T.tink(.5, 4200), np.pad(T.ding(98, .25, .6), (int(.03 * SR), 0)), whirr(1.4, .7)),
    'slowmo': lambda e: slowmo(e.get('d', .5), .9),
    'chorus': lambda e: mixl(T.sparkle(.55, .2, 92, 104, 5, 3, 'up'), T.tink(.3)),
    'stroke': lambda e: stroke(e.get('n', 0), .8),
    'flap': lambda e: armflap(e.get('n', 0), .9),
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
    'wingsup': lambda e: mixl(T.swish(.35, .22, 900, 4200, True), np.pad(T.boing(280, .25, .2, 2.2, 15.), (int(.08 * SR), 0))),
    'steps': lambda e: T.footsteps(5, .21, .45, 86, 3, soft=True),
    'beep': lambda e: beep(1.),
    'notice': lambda e: mixl(T.surprise(.3), T.blip(91, .2)),
    'bonk': lambda e: mixl(T.bonk(.9, 72), T.boing(190, .4, .35, 2.0, 13.)),
    'stars': lambda e: T.sparkle(.7, .28, 94, 106, 6, 11, 'down'),
    'glint': lambda e: mixl(T.tink(.35, 4600), np.pad(T.tink(.25, 5200), (int(.12 * SR), 0))),
    'hop': lambda e: T.boing(240, .3, .3, 2.2, 15.),
    'recall': lambda e: mixl(T.bubble(1600, .3, .06, 2.4), np.pad(T.boing(260, .3, .2, 2.4, 16.), (int(.1 * SR), 0))),
    'zipin': lambda e: mixl(np.pad(scratch(.4, .75, 1.5), (0, 0)), np.pad(T.zip_(.5, 900, 2600, .5), (int(.38 * SR), 0)), np.pad(T.swish(.6, .25, 800, 4000, False), (int(.45 * SR), 0))),
}
missing = sorted({e['type'] for e in EV} - SFX.keys())
if missing: sys.exit(f'mix.py: no sound for event types {missing}')
VERB = {'zoom': .3, 'titlepop': .3, 'ding': .4, 'flip': .3, 'page': .3, 'swipe': .25, 'sparkle': .4, 'still': .35, 'glint': .4, 'stars': .35, 'textpop': .25, 'chorus': .3}
snd = np.zeros(NW)
for e in EV:
    x = SFX[e['type']](e); add(fx, x, e['t'], 1., e.get('pan', 0))
    if e['type'] in VERB: s0 = int(e['t'] * SR); k = min(len(x), NW - s0); snd[s0:s0 + k] += x[:k] * VERB[e['type']]
fx += T.verb(snd, 1.3) * .35
fx *= energy_gain(len(fx), .5)[:, None]                  # tiếng động theo năng lượng cảnh (một nửa mức của nhạc)


# ---------- vòng lặp: phần dư sau 24 s cộng vào đầu phim ----------
for k in ('mus', 'fx'):
    b = B[k]; tail = b[N0:].copy(); b[:len(tail)] += tail; B[k] = b[:N].copy()
mus, fx = B['mus'], B['fx']


# ---------- Lớp 4 – nền theo bối cảnh: vườn nhiệt đới buổi trưa (meadow: gió lá, chim xa né lời), trang sổ (paper_room) ----------
amb = B['amb']; amb += AMB.beds(DUR, [(a, b, nm) for _, a, b, _e, nm in SCENES], speaking=speaking, seed=12)[:len(amb)]


# ---------- giọng (mọi câu là giọng TTS gốc, không hát; không vang phòng / lọc trên giọng Miss Loupe, QUALITY.md §9.10) ----------
vox = np.zeros(N)
def _lvl(y): a = np.abs(y); act = y[a > a.max() * .1] if len(y) else y; return 20 * np.log10(np.sqrt(np.mean(act ** 2)) + 1e-9) if len(act) else -99.
VY = {}
for Ln in LINES:
    y, sr = sf.read(os.path.join(HERE, 'voice', Ln['id'] + '.wav'))
    if y.ndim > 1: y = y.mean(1)
    VY[Ln['id']] = soxr.resample(y, sr, SR)
LV = {k: _lvl(y) for k, y in VY.items()}
MED = {w: float(np.median([LV[l['id']] for l in LINES if l['who'] == w])) for w in {l['who'] for l in LINES}}
for Ln in LINES:
    y = VY[Ln['id']] * 10 ** (float(np.clip(MED[Ln['who']] - LV[Ln['id']], -6, 6)) / 20)
    sg = Ln.get('tune') or {}; y = y * 10 ** ((EMO_DB.get(Ln.get('emo'), 0.) + (CHORUS_DB if sg.get('chorus') else 0.)) / 20)   # điệp khúc nói theo phách to hơn
    s = int(Ln['t'] * SR); e = min(N, s + len(y)); vox[s:e] += y[:e - s]
vox = norm(compress(norm(vox, .9), thr=.22, ratio=2.5), .85)
vox = vox * energy_gain(len(vox), 1., VDB)                 # giọng theo năng lượng cảnh (êm −2 dB … cao trào +1,5 dB)


# ---------- trộn: nhạc lùi dưới giọng (dưới câu theo phách lùi ít hơn), lời rõ ≥ 11 dB, master −14 LUFS ----------
def rms(x): x = x[np.abs(x).max(1) > 1e-4] if x.ndim > 1 else x[np.abs(x) > 1e-4]; return float(np.sqrt(np.mean(x ** 2))) if len(x) else 0.
_e = np.sqrt(uniform_filter1d((mus ** 2).mean(1), int(.6 * SR)) + 1e-14); _ref = np.percentile(_e[_e > 1e-5], 70)
mus = mus * uniform_filter1d(np.clip((_ref / np.maximum(_e, 1e-7)) ** .5, 1, 4), int(.3 * SR))[:, None]   # không có lỗ im của nhạc
mus *= .075 / max(rms(mus), 1e-9); fx *= .55 / max(np.abs(fx).max(), 1e-9); amb *= .022 / max(rms(amb), 1e-9)
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
    if l.get('tune'): tunem[int(l['t'] * SR):int((l['t'] + l['dur']) * SR)] = 1
    if l['who'] != 'loupe': otherm[int(l['t'] * SR):int((l['t'] + l['dur']) * SR)] = 1
ve_m = ve * (1 - .25 * uniform_filter1d(tunem, int(.2 * SR)))   # (19/11/2026) dưới câu nói của Albie nhạc lùi đủ sâu (≥ 8 dB, qa_musical); lần dựng 1 lùi nông hơn: 6,1 dB
mid_m = (.66 - .21 * uniform_filter1d(tunem, int(.2 * SR)))[:, None]
mus = T.duck(mus, ve_m, mid_m, .3); fx = T.duck(fx, ve, .6, .3); amb = T.duck(amb, ve, .7, .5)
mus, GUARD = T.speech_guard(mus, fx, vox, LINES, 11.)
print('speech_guard:', ', '.join(f'{k} {s_:.1f} dB → −{c:.1f} dB' for k, s_, c in GUARD) or 'không câu nào phải hạ')
# vang phòng nhỏ cho Albie (không cho Miss Loupe: giọng cô khô như SHORT-015)
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
