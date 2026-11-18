"""Âm thanh của SHORT-016 → out/mix.wav (48 kHz stereo) và stems (chuẩn 11/2026b, _shared/QUALITY.md §4, §8).
python mix.py   (cần timeline.json + voice/*.wav từ tools/lines.mjs, tts.py, sing.py; events.json từ core/render/events.mjs)
- Nhạc: "Snowy Sleigh Song" (Đô trưởng). Lớp nhịp theo cảnh _shared/audio/groove.py với song=TL['song'] (cảnh chồng câu hát dùng
  chords='song' và BPM của phần bài hát) + accomp=True (dưới lời vẫn đủ đệm và bè phụ ở dải cao, đổi cảnh nghe ra) + G.theme (chủ đề
  của tập = câu mở điệp khúc). Điệu riêng của tập: 'sleigh' (xe trượt tuyết: chuông xủng xẻng, vó ngựa lộc cộc).
- Nhạc lùi dưới giọng: duck theo đường bao giọng (dưới câu hát lùi ít hơn), speech_guard giữ lời rõ ≥ 11 dB; master −14 LUFS.
Mọi âm thanh tổng hợp bằng code (_shared/audio/band.py, toon.py, core/audio/sfx.py); không dùng mẫu của bên thứ ba."""
import os, sys, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio')); sys.path.insert(0, os.path.join(LIB, '_shared', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, pop, click, thump, compress, add
from band import mf, pluck, marimba, bassn, kick, bell, horn, riser, glide, sting, pizz, xylo, flute, celesta, harp, vibes, upright, piano
from band import timpani, trumpet, trombone, kazoo, tada, triangle, sleighbell, buzzbass, toypiano, accordion, tuba
import toon as T
from groove import Groove
from band import clap
import ambience as AMB                                   # (18/11/2026) Lớp 4: nền theo bối cảnh
sys.path.insert(0, os.path.join(LIB, '_shared'))
from emote import accent, EMO_DB, CHORUS_DB                                  # (18/11/2026) Lớp 1: nhấn từ khoá trong câu hát
from scipy.ndimage import maximum_filter1d, uniform_filter1d

TL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))
EV = json.load(open(os.path.join(HERE, 'events.json'), encoding='utf-8'))['ev']
HIT = TL['hit']; BEAT = 60 / TL['bpm']; DUR = TL['dur']; N = int((DUR + .05) * SR); N0 = int(DUR * SR); NW = N + int(2.5 * SR)
B = {k: np.zeros((NW if k in ('mus', 'fx') else N, 2)) for k in ('mus', 'fx', 'amb')}
LINES = TL['lines']; L = {l['id']: l for l in LINES}
end = lambda i: L[i]['t'] + L[i]['dur']
B_ALB = max(HIT['zoomIn'][0], end('L11'))   # (18/11/2026) L11 ngân "leaves" tới qua cú chụp: nhạc cảnh sổ vào sau nốt cuối, không đổi hợp âm dưới lời
def speaking(t, pad_=.05): return any(l['t'] - pad_ <= t < l['t'] + l['dur'] + pad_ for l in LINES)
def mixl(*xs): n = max(len(x) for x in xs); return sum(np.pad(x, (0, n - len(x))) for x in xs)
PART = {round(p['t0'], 2): p for p in TL['song']['parts']}
P_BEES, P_MAP, P_CH1, P_LADY, P_CH2 = 3.8, 12.4, 21.0, 24.0, 42.2


# ---------- nhạc: bảng cảnh (Sound Design Plan) theo bài hát ----------
mus = B['mus']
def M(x, t, g=1., pan=0.): add(mus, x, t, g, pan)
def seq(inst, ns, t0, step, g=1., pan=0., d=None):
    for i, n in enumerate(ns):
        if n: M(inst(n, d) if d else inst(n), t0 + i * step, g, pan)
def strum(inst, ns, t, g=.4, d=None, spread=.012):
    for k, n in enumerate(ns): M(inst(n, d) if d else inst(n), t + k * spread, g, -.3 + .6 * k / max(1, len(ns) - 1))
glock = lambda m, d=.6: T._ting(mf(m), d, 1.) * .5
S0, S1 = HIT['sting']
# vùng giai điệu của lớp nhịp nhường chỗ cho điểm nhấn viết tay
AVOID = [(0, .35), (S0 - .05, S1 + .05), (HIT['heatOn'][0], HIT['heatOn'][1] + .2), (HIT['trees'][0], HIT['trees'][0] + 1.1),
         (HIT['lift'][0], HIT['lift'][1] + .2), (HIT['zoomIn'][0] - .1, HIT['zoomOut'][1] + .1), (HIT['plop'][0] - .05, HIT['plop'][1] + .4), (DUR - 1.2, DUR)]
G = Groove(M, BEAT, LINES, meter=4, seed=16, avoid=AVOID, plan=True, song=TL['song'], accomp=True)
# chủ đề của tập (accomp): điệp khúc "Huddle, fly a-WAY, or HIDE" — sol sol sol la si la sol
G.theme([7, 7, 7, 9, 11, 9, 7], [0, 1.5, 2, 3, 4, 6, 8], every=16., first=False)   # nhịp của điệp khúc (móc đơn): vừa khoảng trống ≈ 0,8 s; first=False (18/11/2026): câu hát dài hơn, khoảng trống đầu cảnh hẹp lại
G.sec('móc · tuyết rơi trúng kính', 0, S0, 'sleigh', 'C', 'song', bass='bassn', comp='pluck', lead='glock', arp='celesta', kit='sleigh', energy=2, cue=False,
      bpm=120, mood='playful', arc='open', what='Bông tuyết đậu trúng kính, Miss Loupe rùng mình "brrr", hát hỏi "Where do bugs go when it snows?" (half-sing); vườn vắng tanh',
      emo='bất ngờ, tò mò', why='Điệu riêng của tập: xe trượt tuyết 120 BPM, chuông xủng xẻng + vó ngựa lộc cộc báo ngay "mùa đông"; ukulele chặn hợp âm của bài dưới câu hỏi nửa hát.')
G.mark('logo · nhạc hiệu 0,8 s', S0, S1, 'jingle', 'C', 'horn marimba bell', 3, mood='epic', arc='open', what='Máy lao vào mặt kính, logo bật lên',
       emo='háo hức', why='Nhạc hiệu của kênh (cố ý giống mọi tập), rút còn 0,8 s.')
G.sec('kính · tổ ong lặng im → kính ấm', S1, 7.0, 'float', 'C', 'song', bass='upright', comp='harp', lead='vibes', kit='tri', energy=2,
      bpm=112, mood='magic', arc='build', what='"Let\'s zoom in!" (hát): tổ ong phủ tuyết; vặn vành kính, cả mặt kính đổi màu nhiệt: quả bóng ong rực cam; "Look! A warm ball of bees!" (half-sing)',
      emo='tò mò, kỳ diệu', why='Rải lơ lửng 112 BPM, vibraphone tròn ấm và đàn hạc như hơi ấm toả ra; đàn hạc vuốt lên ở lúc bật kính ấm.')
G.sec('quả bóng ấm · Waggle rung ngực', 7.0, P_MAP, 'skip', 'C', 'song', bass='buzz', comp='pianohi', lead='marimba', kit='wood', energy=2,
      bpm=112, mood='bouncy', arc='build', what='Lao sâu vào quả bóng ong: Waggle rung ngực theo từng phách; "Heater bees shake their wing muscles!" (sing-talk)',
      emo='thích thú', why='Shuffle nhảy chân sáo 112 BPM, bass vo ve như tiếng ong rung cơ; marimba gỗ ấm; mỗi nhịp rung một tiếng "brr" viết tay.')
G.sec('Albie hỏi · "Nope!"', P_MAP, HIT['mapOpen'][0], 'hop', 'C', 'song', bass='bassn', comp='pluck', lead='xylo', kit='comic', energy=2,
      bpm=126, mood='funny', arc='build', what='Kính thu về sân khấu; Albie: "Do all butterflies stay?" (nói); "Nope!" (sing-talk, giai điệu cố định của kênh), dấu X',
      emo='buồn cười, bất ngờ', why='Nảy lệch phách 126 BPM, xylophone và mõ cho câu hỏi ngây ngô của Albie và cái lắc đầu "Nope!".')
G.sec('bản đồ · bướm vua bay về Mexico', HIT['mapOpen'][0], HIT['trees'][0], 'quest', 'C', 'song', bass='pizzbass', comp='strings', lead='flute', arp='harp', kit='bongo', energy=2,
      bpm=126, mood='magic', arc='build', what='Albie mở trang bản đồ; đàn bướm vua bay theo đường chấm từ miền đông Bắc Mỹ xuống Mexico; "These monarchs fly all the way to Mexico!" (half-sing)',
      emo='phiêu lưu, háo hức', why='Phiêu lưu nước kiệu 126 BPM: sáo bay như đàn bướm, dàn dây spiccato và bongo giữ nhịp chuyến đi dài.')
G.sec('rừng hoá cam · MILLIONS!', HIT['trees'][0], P_CH1, 'hero', 'C', 'song', bass='tuba', comp='piano', lead='strings', kit='epic', energy=3, tr='riser',
      bpm=126, mood='epic', arc='peak', what='Tới Mexico: cả cánh rừng linh sam hoá cam vì hàng triệu bướm bám kín cành; chụp, sticker 2 bay lên ô',
      emo='choáng ngợp, vui', why='Cao trào: dàn dây spiccato hát chính 126 BPM như hàng triệu đôi cánh, piano chặn, timpani nhấn phách đầu; "ta-da" ngay khi rừng đổi màu.')
G.sec('điệp khúc 1', P_CH1, P_LADY, 'sleigh', 'C', 'song', bass='bassn', comp='pluck', lead='xylo', arp='glock', kit='sleigh', energy=3, tr='pickup',
      bpm=124, mood='happy', arc='build', what='Về vườn tuyết: Miss Loupe và Albie nhún nhảy; "Huddle, fly away, or hide!" (hát trọn), ô 1, 2 nảy theo lời, ô 3 còn "?"',
      emo='vui, hát theo', why='Xe trượt tuyết 124 BPM (điệu riêng), xylophone đánh đôi giai điệu điệp khúc cao một quãng tám để trẻ hát theo.')
G.sec('đống lá · "Who is hiding under here?"', P_LADY, HIT['lift'][0], 'stride', 'C', 'song', bass='upright', comp='piano', lead='harp', kit='rim', energy=2,
      bpm=116, mood='cute', arc='build', what='Miss Loupe nhảy sang đống lá cạnh hòn đá, hát hỏi (half-sing), kính lớn trên chiếc lá',
      emo='tò mò, nhẹ nhàng', why='Ragtime nhẹ 116 BPM: piano "oom-pah" nhón chân, đàn hạc gảy như bước chân trên tuyết, mõ nhỏ; tò mò mà vẫn vui (giọng trưởng).')
G.sec('Dot đếm · bọ rùa ngủ dưới lá', HIT['lift'][0], B_ALB, 'bounce', 'C', 'song', bass='upright', comp='vibes', lead='pizz', kit='rim', energy=2,
      bpm=116, mood='cute', arc='build', what='Nhấc lá: đám bọ rùa ngủ; Dot bật dậy đếm "One, two, three... so many!" (nói); "Some ladybugs nap together under leaves!" (sing-talk); Dot ngáp, chui lại',
      emo='dễ thương, buồn cười', why='Pop nảy 116 BPM, nhẹ tay như nhịp thở đều của đám bọ rùa ngủ; dây pizzicato đếm cùng Dot (mỗi số một nốt xylophone viết tay).')
G.sec('sổ · "Six legs? In you go!"', B_ALB, HIT['flip'][1], 'sleigh', 'C', 'F G7 C C', bass='tuba', comp='accordion', lead='bell', kit='sleigh', energy=2,
      bpm=128, mood='playful', arc='build', what='Chụp → match cut qua sticker → trang sổ: ba sticker; Albie đếm chân, há miệng, đớp đúng "go!"',
      emo='vui, tự hào', why='Cảnh sổ phối theo điệu riêng của tập (xe trượt tuyết, 128 BPM: nhanh nhất phim) với accordion và tuba "oom-pah", chuông nhỏ hát chính.')
G.sec('gag · "Is it spring yet?" · "Nope!"', HIT['flip'][1], HIT['plop'][0], 'polka', 'C', 'song', bass='tuba', comp='pluck', lead='kazoo', kit='clap', energy=2,
      bpm=116, mood='funny', arc='end', what='Dot chui ra, vươn vai ngái ngủ: "Is it spring yet?" (nói) — "Nope!" (nói), dấu X',
      emo='buồn cười, đáng yêu', why='Polka 116 BPM, kazoo hát chính kiểu hoạt hình cho câu hỏi ngái ngủ của Dot.')
G.mark('khựng · Dot kéo lá trùm lên', HIT['plop'][0], HIT['plop'][1] + .3, 'break', 'C', 'vibes', 1, mood='funny', arc='end',
       what='Dot lặn xuống, kéo chiếc lá trùm kín: "FWUMP!", tuyết trên lá bung ra', emo='bất ngờ buồn cười', why='Khựng hài 0,65 s (còn vibraphone run run, không im hẳn) rồi còi trượt xuống và tiếng "fwump".')
G.sec('Albie cười khúc khích', HIT['plop'][1] + .3, P_CH2, 'skip', 'C', 'song', bass='bassn', comp='marimba', lead='reed', kit='toy', energy=2,
      bpm=116, mood='happy', arc='end', what='Chỉ còn chấm cam ló ra; Albie cười khúc khích; máy lùi ra hai bạn',
      emo='vui', why='Shuffle 116 BPM ngắn, clarinet đồ chơi chen câu đáp, dẫn vào điệp khúc cuối.')
G.sec('điệp khúc 2', P_CH2, HIT['hug'][0], 'sleigh', 'C', 'song', bass='bassn', comp='pluck', lead='xylo', arp='glock', kit='sleigh', energy=3, tr='pickup',
      bpm=124, mood='happy', arc='end', reprise=True, what='Điệp khúc lần 2: hai bạn nhảy, ba sticker bật lên trên đầu theo từng từ khoá',
      emo='vui, hát theo', why='Nhắc lại đúng nhạc của điệp khúc lần 1 (reprise) để trẻ nhận ra và hát theo.')
G.sec('CTA · ôm nhau · vòng lặp', HIT['hug'][0], DUR, 'sunny', 'C', 'F G7', bass='bassn', comp='pluck', lead='steel', kit='toy', energy=2,
      bpm=120, mood='happy', arc='end', what='"Can YOU huddle like a bee?" (nói): hai bạn ôm nhau cho ấm; chữ móc trở lại; bông tuyết lớn rơi về phía kính (khung đầu)',
      emo='ấm áp, mời gọi', why='Ukulele nắng 120 BPM (lưới của phim, nối vòng lặp), trống thép hát chính tròn và ấm; hợp âm Sol bảy dẫn về Đô của khung đầu.')
G.answer(HIT['heatOn'][0] + .1, HIT['trees'][0] + .05, HIT['lift'][0] + .05, HIT['plop'][1])   # câu đáp viết tay bên dưới
G.play()
G.motif(B_ALB + .05, 'celesta', 1.0, .1)                     # giai điệu đặc trưng (câu mở điệp khúc) lúc chụp sticker 3 → trang sổ
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
G.save(os.path.join(HERE, 'out', 'music.json'), color='"Snowy Sleigh Song" có lời hát (Đô trưởng; xe trượt tuyết: chuông xủng xẻng, vó ngựa lộc cộc; điệp khúc "Huddle, fly away, or hide!")')

# — Móc: hợp âm Đô ở giây 0 (ukulele + chuông xe trượt), bông tuyết "ting" trên kính —
strum(pluck, (60, 64, 67, 72), 0., .3, .5, .01); M(glock(96, .5), HIT['plip'] + .01, .18, -.2)
seq(celesta, (84, 88, 91), HIT['lookL'][0], .15, .1, -.4, d=.4); seq(celesta, (91, 88, 84), HIT['lookR'][0], .15, .1, .4, d=.4)
# — Nhạc hiệu 0,8 s ở cú lao vào kính —
_x = sting(1., root=72); _s = int(S0 * SR); mus[_s:_s + len(_x)] += _x * .9
# — Kính ấm bật: đàn hạc vuốt lên + hợp âm vibraphone ấm —
M(T.gliss(72, 96, .5, .3, 'harp'), HIT['heatOn'][0], .9); strum(vibes, (72, 76, 79, 84), HIT['heatOn'][0] + .45, .14, .9)
# — Rừng hoá cam: "ta-da" —
_x = tada(72, 1.); _s = int(HIT['trees'][0] * SR); mus[_s:_s + len(_x)] += _x[:len(mus) - _s] * .75
# — Nhấc lá: celesta rơi xuống như tuyết trên lá —
seq(celesta, (96, 91, 88, 84), HIT['lift'][0] + .05, .09, .14, .3, d=.4)
# — Khựng ở gag: vibraphone run run; còi trượt xuống —
for k in range(5): M(vibes(76 if k % 2 else 72, .14), HIT['plop'][0] + .04 + k * .1, .05, .1)
# — (18/11/2026) điểm nhấn cho tình huống bất ngờ và cao trào (Task.md §2.2, §2.3) —
for k, (m, d_) in enumerate(((55, .16), (53, .34))): M(trombone(m, d_), HIT['xmark'] + .05 + k * .2, .32, .2)          # "Nope!": trombone "wah-wah" hài
M(riser(.4, .9), HIT['trees'][0] - .42, .55); M(T.cymbal(1.8, 1., 5200), HIT['trees'][0], .3, .1)                       # rừng hoá cam: riser → chũm chọe
strum(trumpet, (60, 64, 67, 72), HIT['trees'][0] + .02, .3, .22); strum(trumpet, (62, 67, 71, 74), HIT['trees'][0] + .5, .26, .2)   # kèn chặn
M(timpani(36, 1., 1.2), HIT['trees'][0], .5)
B124 = 60 / 124
for c0 in (P_CH1, P_CH2):                                                                                           # điệp khúc: vỗ tay phách 2 và 4, trẻ vỗ theo
    for k in (1, 3, 5):
        M(clap(.9), c0 + k * B124, .32, -.2); M(clap(.7), c0 + k * B124 + .012, .2, .25)
M(T.gliss(96, 72, .35, .22, 'harp'), HIT['plop'][0] + .4, .7)                                                        # Dot lặn: đàn hạc vuốt xuống
# — Chữ móc trở lại: hợp âm Đô nhỏ ở dải cao; nốt dẫn Sol → Đô ở 0,0 —
strum(pluck, (72, 76, 79, 84), HIT['recall'], .16, .7)
M(bassn(43, .3), DUR - .25, .9)

# — cường độ theo cảnh (chuyển mềm 0,3 s): dâng ở khám phá / bất ngờ, hạ dưới lời —
LEVEL = ((0, .92), (L['L01']['t'], .82), (end('L01'), .95), (S0, 1.0), (L['L02']['t'], .82), (HIT['heatOn'][0], 1.0), (L['L03']['t'], .76), (L['L04']['t'], .66), (end('L04'), .95),
         (L['L05']['t'], .7), (end('L05'), .9), (L['L07']['t'], .72), (HIT['trees'][0], .84), (end('L07'), 1.1), (L['L08']['t'], .85), (end('L08'), .95), (L['L09']['t'], .82),
         (HIT['lift'][0], .98), (L['L10']['t'], .7), (end('L10'), .85), (L['L11']['t'], .8), (B_ALB, .98), (L['L12']['t'], .58), (end('L12'), .92),
         (L['L13']['t'], .68), (end('L13'), .9), (L['L14']['t'], .7), (HIT['plop'][0], .55), (HIT['plop'][1] + .3, .92), (L['L15']['t'], .85),
         (L['L16']['t'], .68), (end('L16'), .95))
tt = np.arange(len(mus)) / SR; lev = np.full(len(mus), LEVEL[0][1])
for (t, g), (_, g0) in zip(LEVEL[1:], LEVEL[:-1]): lev = np.where(tt >= t - .15, np.where(tt < t + .15, g0 + (g - g0) * (tt - t + .15) / .3, g), lev)
mus *= lev[:, None]


# ---------- (18/11/2026) thiết kế âm thanh theo cảnh: mỗi cảnh một mức năng lượng và một lớp nền (QUALITY.md §10) ----------
# energy: calm (êm, khám phá trong kính) · normal · high (móc, điệp khúc) · peak (cao trào); amb: lớp nền của _shared/audio/ambience.py
SCENES = [('hook', 0, S0, 'high', 'snow_garden'), ('title', S0, S1, 'high', 'snow_garden'),
          ('bees', S1, HIT['deep'][0], 'calm', 'hive_warm'), ('shake', HIT['deep'][0], P_MAP, 'normal', 'hive_warm'),
          ('nope', P_MAP, HIT['mapOpen'][0], 'normal', 'snow_garden'), ('map', HIT['mapOpen'][0], HIT['trees'][0], 'normal', 'paper_room'),
          ('forest', HIT['trees'][0], HIT['back'][1], 'peak', 'paper_room'), ('chorus1', HIT['back'][1], P_LADY, 'high', 'snow_garden'),
          ('leaf', P_LADY, HIT['lensUp'][0] + .35, 'calm', 'leaf_snow'), ('dot', HIT['lensUp'][0] + .35, B_ALB, 'calm', 'leaf_snow'),
          ('album', B_ALB, HIT['flip'][1], 'normal', 'paper_room'), ('gag', HIT['flip'][1], L['L15']['t'], 'normal', 'snow_garden'),
          ('chorus2', L['L15']['t'], HIT['hug'][0], 'high', 'snow_garden'), ('cta', HIT['hug'][0], DUR, 'normal', 'snow_garden')]
EDB = {'calm': -8., 'normal': -3., 'high': 1.5, 'peak': 3.}                # dB cho nhạc và nền (tiếng động: một nửa)
VDB = {'calm': -2., 'normal': 0., 'high': 1., 'peak': 1.5}                # giọng cũng theo cảnh, nhẹ hơn nhạc: chênh giữa các cảnh tăng mà lời / nhạc trong cảnh giữ nguyên
def energy_gain(n, k=1., table=None):
    t_s = np.arange(n) / SR; g = np.zeros(n); table = table or EDB
    for _, a, b, en, _a in SCENES: g[(t_s >= a) & (t_s < b)] = table[en] * k
    g = uniform_filter1d(g, int(.5 * SR)); return 10 ** (g / 20)

# ---------- tiếng động theo sự kiện ----------
fx = B['fx']
def fade_safe(x): n = min(len(x), int(.01 * SR)); x = x.copy(); x[:n] *= np.linspace(0, 1, n); x[len(x) - n:] *= np.linspace(1, 0, n); return x
def brrr(d, v=1.):                                # rùng mình: răng va lập cập (mõ nhỏ dồn) + run "brrr" (rung thấp)
    n = int((d + .05) * SR); x = np.zeros(n); t = 0.; k = 0
    while t < d: b = T.block(90 + (k % 2) * 2, .16 * (1 - .5 * t / d)); s = int(t * SR); x[s:s + len(b)] += b[:max(0, n - s)]; t += .045; k += 1
    tt = t_(d); x[:len(tt)] += np.sin(2 * np.pi * 160 * tt) * (.5 + .5 * np.sin(2 * np.pi * 28 * tt)) * np.sin(np.pi * tt / d) * .05
    return fade_safe(x) * v
def warmup(d, v=1.):                              # kính ấm bật: tiếng "vù" ấm đi lên + lách tách lửa nhỏ
    tt = t_(d); f = 180 + 260 * (tt / d) ** .7; x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / d) * .12
    return fade_safe(mixl(x, T.sparkle(d, .22, 86, 100, 6, 9, 'up'))) * v
def hum(d, v=1.):                                 # tiếng ong rì rầm trong quả bóng (nhỏ, dải trầm, dưới lời)
    tt = t_(d); x = sum(np.sin(2 * np.pi * f * tt + p) for f, p in ((118, 0), (236, 1), (354, 2))) * (.6 + .4 * np.sin(2 * np.pi * 7 * tt))
    return fade_safe(lp(x, 900) * np.minimum(1, tt / .3) * np.minimum(1, (d - tt) / .4) * .03) * v
def buzzshake(n, v=1.):                           # một nhịp Waggle rung ngực: "brr" vo ve ngắn, cao độ theo bậc của hợp âm
    m = (48, 52, 55)[n % 3]; return mixl(buzzbass(m, .18) * .35, T.tink(.06, 4200)) * v
def flutter(n, v=1.):                             # đàn bướm vỗ cánh: "phập phập" mềm
    return mixl(bp(noise(.07), 700, 2600) * env_exp(.07, .02) * .3, np.pad(bp(noise(.06), 900, 3000) * env_exp(.06, .02) * .22, (int(.05 * SR), 0))) * v
def chatter(d, v=1.):                             # Albie run cầm cập: giấy sột soạt nhanh
    return T.paper(d, .32, max(3, int(d * 14)), 7) * v
def snowfx(d, v=1.):                              # gió tuyết thổi nhẹ, bông tuyết lớn rơi
    tt = t_(d); w = bp(noise(d), 1200, 5000)[:len(tt)] * np.sin(np.pi * tt / d) ** 2 * .05
    return fade_safe(mixl(w, np.pad(T.tink(.12, 5200), (int(max(0., d - .3) * SR), 0)))) * v
def fwump(v=1.):                                  # chiếc lá trùm xuống: "phụp" mềm + tuyết bung "xì"
    return mixl(thump(.7, 95) * .55, np.pad(bp(noise(.4), 1500, 6000) * env_exp(.4, .1) * .3, (int(.03 * SR), 0)), T.paper(.2, .3, 4, 3))
def yawnfx(v=1.):                                 # Dot ngáp: còi trượt lên rồi xuống, nhỏ, ở dải cao
    return mixl(T.whistle(900, 1400, .3, .1), np.pad(T.whistle(1400, 700, .45, .1), (int(.28 * SR), 0))) * v
SFX = {
    'titlepop': lambda e: mixl(T.bubble(1600, .5, .06, 2.4), np.pad(T._ting(mf(96), .5, .35), (int(.02 * SR), 0))),
    'wordpop': lambda e: mixl(T.boing(220 + 120 * e.get('n', 0), .35, .3, 2.4, 16.), np.pad(pop(.6) * .45, (int(.02 * SR), 0)), T.bubble(1300 + 500 * e.get('n', 0), .35, .05, 2.4)),
    'plip': lambda e: mixl(T.plip(1800, .45), T.tink(.2, 5600)),
    'brrr': lambda e: brrr(e.get('d', .6), 1.),
    'chatter': lambda e: chatter(e.get('d', .7), 1.),
    'swish': lambda e: T.swish(e.get('d', .45), e.get('v', .4), e.get('lo', 350), e.get('hi', 2600), e.get('up', True)),
    'huh': lambda e: mixl(T.boing(300, .3, .2, 2.0, 12.), np.pad(T.blip(86, .25), (int(.1 * SR), 0)), np.pad(T.blip(91, .25), (int(.2 * SR), 0))),
    'slots': lambda e: T.pops(3, .08, 84, .32),
    'zoom': lambda e: mixl(riser(.4, .8), T.whistle(420, 1250, .4, .12)),
    'logo': lambda e: T.sparkle(.5, .22, 91, 105, 6, 4, 'up'),
    'twist': lambda e: mixl(*[np.pad(click(.5, .12) * .5, (int(k * .07 * SR), 0)) for k in range(4)]),
    'warmup': lambda e: warmup(e.get('d', .5), .9),
    'hum': lambda e: hum(e.get('d', 2.), 1.),
    'deep': lambda e: mixl(T.swish(e.get('d', .45), .38, 500, 4800, True, .15, .25), riser(e.get('d', .45), .35)),
    'buzzshake': lambda e: buzzshake(e.get('n', 0), .9),
    'snap': lambda e: mixl(click(1., .25) * .8, np.pad(click(.8, .2) * .5, (int(.045 * SR), 0)), np.pad(T.sparkle(.45, .3, 93, 108, 6, 7, 'up'), (int(.06 * SR), 0))),
    'swipe': lambda e: T.swipe(e.get('d', .3), .32, True, e.get('lo', 1500), e.get('hi', 5500)),
    'slotstamp': lambda e: mixl(thump(.7, 120) * .55, hp(noise(.06), 1400) * env_exp(.06, .012) * .45, np.pad(T.ding(89 + 3 * e.get('n', 0), .35, .8), (int(.02 * SR), 0))),
    'lensdown': lambda e: T.swish(e.get('d', .45), .3, 4200, 500, False, .4, .3),
    'albiehop': lambda e: mixl(T.boing(190, .35, .3, 2.4, 14.), np.pad(T.paper(.15, .25, 3, 2), (int(.25 * SR), 0))),
    'nope': lambda e: mixl(T.bonk(.35, 70), np.pad(pop(.4) * .3, (int(.03 * SR), 0))),
    'pageopen': lambda e: mixl(T.paper(e.get('d', .5), .5, 6, 5), T.swish(e.get('d', .5), .25, 600, 4200, True)),
    'flutter': lambda e: flutter(e.get('n', 0), 1.),
    'sign': lambda e: mixl(T.block(80, .3), np.pad(T.boing(260, .25, .15, 2.2, 14.), (int(.03 * SR), 0))),
    'arrive': lambda e: mixl(T.sparkle(.6, .28, 91, 106, 7, 8, 'up'), np.pad(T.ding(91, .3, .8), (int(.05 * SR), 0))),
    'trees': lambda e: mixl(T.swell(e.get('d', 1.), .3, 74, 98, 2), T.pops(8, .09, 86, .25)),
    'chorus': lambda e: mixl(T.sparkle(.55, .2, 92, 104, 5, 3, 'up'), T.tink(.3)),
    'qpop': lambda e: mixl(pop(.4) * .3, T.blip(93, .2)),
    'hopL': lambda e: mixl(T.boing(220, .35, .3, 2.4, 14.), T.swish(.3, .12, 900, 3600, True)),
    'landsnow': lambda e: mixl(thump(.4, 150) * .35, bp(noise(.12), 2500, 7000) * env_exp(.12, .03) * .18),
    'lensup': lambda e: T.swish(e.get('d', .35), .25, 900, 4000, True),
    'leaflift': lambda e: mixl(T.paper(e.get('d', .45), .45, 5, 8), bp(noise(.35), 2000, 6000) * env_exp(.35, .08) * .15),
    'popup': lambda e: mixl(T.boing(260, .3, .3, 2.6, 16.), T.bubble(1100, .3, .06, 2.4)),
    'count': lambda e: mixl(T.blip(84 + 3 * (e.get('n', 0) % 3), .35), T.block(91 + 2 * (e.get('n', 0) % 3), .25), xylo(84 + (0, 4, 7)[e.get('n', 0) % 3], .3) * .25),
    'yawn': lambda e: yawnfx(.9),
    'burrow': lambda e: mixl(T.paper(e.get('d', .4), .35, 4, 9), T.whistle(1100, 600, e.get('d', .4), .06)),
    'zoomin': lambda e: mixl(T.swish(e.get('d', .3), .42, 600, 5200, True, .15, .25), riser(e.get('d', .3), .4)),
    'zoomout': lambda e: mixl(T.swish(e.get('d', .35), .3, 500, 3800, False, .25, .2), np.pad(T.paper(.3, .35, 5, 4), (int(.1 * SR), 0))),
    'page': lambda e: mixl(T.paper(.35, .45, 5, 1), T.bubble(520, .3, .09)),
    'stamp': lambda e: mixl(thump(.8, 110) * .7, hp(noise(.07), 1200) * env_exp(.07, .012) * .6),
    'ding': lambda e: T.ding(e.get('m', 88), e.get('v', .4), .7),
    'gulp': lambda e: mixl(T.paper(.3, .45, 5, 2), T.boing(170, .45, .4, 2.2, 14.), np.pad(T.bubble(420, .35, .12, 1.4), (int(.08 * SR), 0))),
    'flip': lambda e: mixl(T.paper(e.get('d', .5), .5, 7, 3), T.swish(e.get('d', .5), .22, 700, 3200, True)),
    'stretch': lambda e: mixl(T.whistle(700, 1200, e.get('d', .7) * .8, .08), np.pad(T.boing(330, .25, .15, 2.0, 12.), (int(.5 * SR), 0))),
    'whee': lambda e: T.whistle(1500, 500, e.get('d', .35), .12),
    'plop': lambda e: fwump(1.),
    'giggle': lambda e: T.giggle(4, .5 * e.get('v', 1.), 86, .1, 5),
    'hug': lambda e: mixl(T.wobble(150, .5, .2, 6., .2), np.pad(T.sparkle(.5, .18, 91, 103, 5, 11, 'up'), (int(.15 * SR), 0))),
    'recall': lambda e: mixl(SFX['titlepop'](e), SFX['wordpop']({'n': 0}), np.pad(SFX['wordpop']({'n': 1}), (int(.12 * SR), 0))),
    'snowfall': lambda e: snowfx(e.get('d', 1.4), 1.),
    # (18/11/2026) Lớp SFX phủ mọi hành động
    'stingout': lambda e: T.swish(.3, .3, 3600, 700, False, .2, .3),
    'logopop': lambda e: mixl(T.bubble(1500, .3, .05, 2.4), T.tink(.12, 4800)),
    'textpop': lambda e: T.textpop(.75, 86 + 2 * e.get('n', 0)),
    'beebuzz': lambda e: hp(mixl(T.flybuzz(e.get('d', 2.), .16, 220, 9.), np.pad(T.flybuzz(e.get('d', 2.) * .8, .1, 236, 12.), (int(.2 * SR), 0))), 1800),   # vo ve ở dải cao, nhỏ: không che lời giải thích
    'gust': lambda e: T.gust(e.get('d', .8), .5, e.get('up', True)),
    'slotbounce': lambda e: mixl(T.bubble(1000 + 250 * e.get('n', 0), .35, .06, 2.4), T.blip(88 + 3 * e.get('n', 0), .2)),
    'badgepop': lambda e: mixl(T.textpop(.7, 88 + 3 * e.get('n', 0)), np.pad(T.pops(3, .03, 86 + 2 * e.get('n', 0), .25), (int(.03 * SR), 0))),
    'snowstep': lambda e: T.snowstep(.55, e.get('n', 0), soft=e.get('n', 0) % 2 == 1),
}
missing = sorted({e['type'] for e in EV} - SFX.keys())
if missing: sys.exit(f'mix.py: no sound for event types {missing}')
VERB = {'zoom': .3, 'titlepop': .3, 'ding': .4, 'flip': .3, 'page': .3, 'swipe': .25, 'count': .4, 'arrive': .4, 'slotstamp': .3, 'trees': .35, 'chorus': .3, 'hug': .3}
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

# ---------- (18/11/2026) Lớp 4 – nền theo bối cảnh: vườn tuyết (gió lạnh có cơn, gió rít khẽ, chim mùa đông xa, tuyết lách tách) ·
# trong tổ ong (rì rầm ấm) · trang sổ / bản đồ (phòng yên tĩnh, giấy sột soạt) · sát đống lá (lá xào xạc, tuyết lách tách) ----------
amb = B['amb']; amb += AMB.beds(DUR, [(a, b, nm) for _, a, b, _e, nm in SCENES], speaking=speaking, seed=16)[:len(amb)]

# ---------- giọng (đã hát bằng _shared/sing.py) ----------
vox = np.zeros(N)
def _lvl(y): a = np.abs(y); act = y[a > a.max() * .1] if len(y) else y; return 20 * np.log10(np.sqrt(np.mean(act ** 2)) + 1e-9) if len(act) else -99.
VY = {}
for Ln in LINES:
    y, sr = sf.read(os.path.join(HERE, 'voice', Ln['id'] + '.wav'))
    if y.ndim > 1: y = y.mean(1)
    VY[Ln['id']] = soxr.resample(y, sr, SR)
# (Vocal QC 18/11/2026) cân độ to từng câu về trung vị của chính nhân vật đó (tối đa ±6 dB): "Nope!" ngắn, to không nhảy hẳn lên
LV = {k: _lvl(y) for k, y in VY.items()}
MED = {w: float(np.median([LV[l['id']] for l in LINES if l['who'] == w])) for w in {l['who'] for l in LINES}}
# (18/11/2026) độ to theo cảm xúc: giải thích nhẹ hơn, hào hứng / ngạc nhiên / điệp khúc to hơn (cảnh thường và cao trào khác nhau rõ)
# (18/11/2026, giọng chậm lại) L07 dài hơn, nửa sau nằm trên cao trào rừng hoá cam: nâng riêng câu này thay vì hạ nhạc (nhạc đệm dưới lời giữ ≤ 8 dB)
VOX_TRIM = {'L07': 1.5}
SUNGW = json.load(open(os.path.join(HERE, 'voice', 'sung.json'), encoding='utf-8')) if os.path.exists(os.path.join(HERE, 'voice', 'sung.json')) else {}
def _bare(w): return ''.join(ch for ch in w.lower() if ch.isalpha() or ch == chr(39))
for Ln in LINES:
    y = VY[Ln['id']] * 10 ** (float(np.clip(MED[Ln['who']] - LV[Ln['id']], -6, 6)) / 20)
    sg = Ln.get('sung') or {}; ed = EMO_DB.get(Ln.get('emo'), 0.) + (CHORUS_DB if sg.get('chorus') else 0.) + VOX_TRIM.get(Ln['id'], 0.)
    y = y * 10 ** (ed / 20)
    if sg and Ln.get('em') and Ln['id'] in SUNGW:                                                   # câu hát: nhấn từ khoá (+1,5 dB)
        ws = Ln['text'].split(); kw = {_bare(k) for k in Ln['em']}
        sp = [(a, b) for i, a, b in SUNGW[Ln['id']].get('words', []) if i < len(ws) and _bare(ws[i]) in kw]
        y = accent(y, SR, sp, 1.5)
    s = int(Ln['t'] * SR); e = min(N, s + len(y)); vox[s:e] += y[:e - s]
vox = lp(vox, 8500, 4)                                    # giọng nâng cao độ (Dot) có tiếng rít ~9,5 kHz; trên 8,5 kHz chỉ còn tiếng xì
vox = norm(compress(norm(vox, .9), thr=.22, ratio=2.5), .85)
vox = vox * energy_gain(len(vox), 1., VDB)                 # (18/11/2026) giọng theo năng lượng cảnh (êm −2 dB … cao trào +1,5 dB)   # (18/11/2026) nén nhẹ hơn (3,5 → 2,5): giữ lại chênh lệch cảm xúc

# ---------- trộn: nhạc lùi dưới giọng (dưới câu hát lùi ít hơn), lời rõ ≥ 11 dB, master −14 LUFS ----------
def rms(x): x = x[np.abs(x).max(1) > 1e-4] if x.ndim > 1 else x[np.abs(x) > 1e-4]; return float(np.sqrt(np.mean(x ** 2))) if len(x) else 0.
_e = np.sqrt(uniform_filter1d((mus ** 2).mean(1), int(.6 * SR)) + 1e-14); _ref = np.percentile(_e[_e > 1e-5], 70)
mus = mus * uniform_filter1d(np.clip((_ref / np.maximum(_e, 1e-7)) ** .5, 1, 4), int(.3 * SR))[:, None]   # không có lỗ im của nhạc
mus *= .075 / max(rms(mus), 1e-9); fx *= .55 / max(np.abs(fx).max(), 1e-9); amb *= .022 / max(rms(amb), 1e-9)
# (18/11/2026) năng lượng theo cảnh, áp SAU bước lấp lỗ im (bước đó san phẳng mọi chênh lệch): cảnh êm nhỏ, cao trào nổi
mus *= energy_gain(len(mus))[:, None]; amb *= energy_gain(len(amb), .6)[:, None]
SEC = json.load(open(os.path.join(HERE, 'out', 'music.json'), encoding='utf-8')).get('sections', [])
json.dump({'scenes': [dict(id=i, t0=round(a, 3), t1=round(b, 3), energy=en, amb=nm, music_db=EDB[en], voice_db=VDB[en],
                           voice=[dict(id=l['id'], who=l['who'], emo=l.get('emo'), mode=(l.get('sung') or {}).get('mode', 'speak'), text=l['text']) for l in LINES if a <= l['t'] + l['dur'] / 2 < b],
                           music=[S_['name'] for S_ in SEC if S_['t0'] < b - .05 and S_['t1'] > a + .05],
                           sfx=sorted({e['type'] for e in EV if a <= e['t'] < b})) for i, a, b, en, nm in SCENES]},
          open(os.path.join(HERE, 'out', 'scenes.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
ve = uniform_filter1d(maximum_filter1d(np.abs(vox), int(.05 * SR)), int(.25 * SR))
sungm = np.zeros(len(ve))
for l in LINES:
    if l.get('sung'): sungm[int(l['t'] * SR):int((l['t'] + l['dur']) * SR)] = 1
ve_m = ve * (1 - .25 * uniform_filter1d(sungm, int(.2 * SR)))
mus = T.duck(mus, ve_m, .66, .3); fx = T.duck(fx, ve, .6, .3); amb = T.duck(amb, ve, .7, .5)
mus, GUARD = T.speech_guard(mus, fx, vox, LINES, 11.)               # (Đệm lời) chỉ hạ nhạc ở câu còn thiếu độ rõ
print('speech_guard:', ', '.join(f'{k} {s_:.1f} dB → −{c:.1f} dB' for k, s_, c in GUARD) or 'không câu nào phải hạ')
# (18/11/2026, "hài hòa hơn") vang phòng nhỏ cho giọng (gửi −18 dB, 0,6 s, tối từ 4,5 kHz): đuôi câu và chỗ nghỉ giữa âm tiết không rơi về im tuyệt đối, giọng ngồi cùng không gian với nhạc
V = np.stack([vox, vox], 1) + T.verb(hp(vox, 250), .6, 4500) * .12
mix = mus + fx + amb + V
mix = np.tanh(mix * 1.1) / 1.1
mix, I_mix, ceil_db = T.master(mix, 10.5); print(f'master: {I_mix:.1f} LUFS, true-peak ceiling {ceil_db:.1f} dBFS')
nf = int(.02 * SR); mix[:nf] *= np.linspace(0, 1, nf)[:, None]
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR, subtype='PCM_24')
for k, x in (('mus', mus), ('fx', fx), ('amb', amb), ('vox', V)): sf.write(os.path.join(HERE, 'out', f'stem_{k}.wav'), x.astype(np.float32), SR, subtype='PCM_16')
print('out/mix.wav', f'{len(mix) / SR:.2f} s')
