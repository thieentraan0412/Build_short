"""Âm thanh của SHORT-013 → out/mix.wav (48 kHz stereo): nhạc theo từng cảnh ("Meadow Cumbia Duet", Rê giáng trưởng, MUSIC.md và SOUND-PLAN.md),
nhạc hiệu 0,8 s (band.sting) ở cú lao vào kính, tiếng động theo events.json, nền bãi cỏ trưa hè, giọng.
python mix.py   (cần timeline.json + voice/*.wav từ tools/lines.mjs và core/tts/tts.py, events.json từ core/render/events.mjs)
Nhạc cụ: _shared/audio/band.py; lớp nhịp theo cảnh: _shared/audio/groove.py (plan=True, Sound Design Plan); tiếng động: _shared/audio/toon.py.
Không dùng mẫu âm thanh của bên thứ ba. Phim phát vòng lặp: nốt La giáng (bậc năm) ở cuối dẫn về hợp âm Rê giáng ở 0,0; đuôi tiếng sau 44 s gấp về đầu phim.
Tiếng riêng của nhân vật không lời (dựng tại đây): Hop "kéo vĩ" = rasp() (răng cưa có cao độ, rung theo hàng gai ~38 lần/giây), Hop nảy = boing;
Chirp gáy = band.chirp (không cao độ, tiếng động) hoặc chirpn() (ba xung có cao độ, khi gáy thành nhạc trong song tấu)."""
import os, sys, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio')); sys.path.insert(0, os.path.join(LIB, '_shared', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, thump, pop, click, compress, add
from band import (mf, pluck, marimba, bassn, celesta, harp, xylo, trumpet, trombone, tuba, pizz, toypiano, riser, sting, chirp, accordion,
                  strings, tom, shaker, bongo, timpani, vibes, bassoon, glide, secret, triangle, kick, clap, fade)
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


# ---------- tiếng riêng của Hop và Chirp ----------
def rasp(m, d=.2, v=1., buzz=38.):
    """Hop "kéo vĩ": đùi sau có hàng gai cọ vào mép cánh → răng cưa có cao độ m, bị "băm" theo hàng gai (~buzz lần/giây), lọc dải giữa.
    Nghe như một cây vĩ cầm đồ chơi kéo nhanh (gần giọng của nhạc cụ hơn là tiếng xì), nên viết được thành giai điệu."""
    f = mf(m); tt = t_(d); ph = f * tt
    saw = 2 * (ph % 1) - 1 + .5 * (2 * ((2 * ph + .3) % 1) - 1)
    pegs = .45 + .55 * np.abs(np.sin(np.pi * buzz * tt + .4 * np.sin(2 * np.pi * 7 * tt)))
    x = bp(saw * pegs, 380, 4200) + bp(noise(d), 2500, 5500) * pegs * .12
    return fade(x * np.minimum(1, tt / .015) * np.exp(-tt * 5.5), .003, .04) * v * .2
def chirpn(m, v=1., n=3):
    """Chirp gáy có cao độ: ba (n) xung sine ngắn ở nốt m (dải cao, "chuông dế")."""
    x = np.zeros(int((.05 + n * .045) * SR)); tt = t_(.03); f = mf(m)
    b = (np.sin(2 * np.pi * f * tt) + .25 * np.sin(4 * np.pi * f * tt)) * np.sin(np.pi * tt / .03) ** 2
    for k in range(n): s = int(k * .045 * SR); x[s:s + len(b)] += b
    return x * v * .22
def grasswhistle(d=.34, v=1.):
    """Crumb thổi còi lá cỏ "PWEEET!": tiếng lưỡi gà the thé, cao độ vút lên rồi rung, có hơi thở."""
    tt = t_(d); f = np.interp(tt, [0, .05, d], [1500, 2350, 2250]) * (1 + .03 * np.sin(2 * np.pi * 23 * tt))
    ph = np.cumsum(f) / SR; x = np.sin(2 * np.pi * ph) + .35 * np.sin(4 * np.pi * ph) + .15 * np.sign(np.sin(2 * np.pi * ph))
    x = x + bp(noise(d), 1800, 5000) * .25
    return fade(x * np.minimum(1, tt / .02) * np.minimum(1, (d - tt) / .06), .004, .04) * v * .28


# ---------- nhạc: "Meadow Cumbia Duet" — Rê giáng trưởng, bãi cỏ khô giữa trưa ----------
# Điệu riêng của tập: CUMBIA (güira cạo móc kép: một nhạc cụ "cạo" cho những chú côn trùng hát bằng cách cạo!). Ba cảnh: Hop hát bằng chân
# (dây spiccato hát như cây vĩ cầm của Hop), song tấu (viết tay: Hop kéo vĩ, Chirp gáy, phong cầm đệm), sổ.
# Motif "lò xo" của Hop (Rê giáng–Fa–La giáng–Rê giáng) đi lên mỗi lần Hop nhảy; mô-típ bí mật đô–mi–sol của kênh (ở Rê giáng) khi lộ màng nghe.
from groove import Groove
mus = B['mus']
def M(x, t, g=1., pan=0.): add(mus, x, t, g, pan)
def seq(inst, ns, t0, step, g=1., pan=0., d=None, ramp=0.):
    for i, n in enumerate(ns):
        if n: M(inst(n, d) if d else inst(n), t0 + i * step, g * (1 + ramp * i), pan)
def strum(inst, ns, t, g=.4, d=None, spread=.012):
    for k, n in enumerate(ns): M(inst(n, d) if d else inst(n), t + k * spread, g, -.3 + .6 * k / max(1, len(ns) - 1))
glock = lambda m, d=.6: T._ting(mf(m), d, 1.) * .5
SPRING = (73, 77, 80, 85)                                           # Rê♭ Fa La♭ Rê♭: Hop nảy lên
DB, GB, AB = (61, 65, 68), (66, 70, 73), (68, 72, 75)              # hợp âm Rê giáng, Sol giáng, La giáng

S0, S1 = HIT['sting']
D0, D1 = HIT['land'], HIT['snap3']                                  # song tấu viết tay (G.mark)
AVOID = [(0, .3), (S0 - .05, S1 + .1), (HIT['startle'] - .05, HIT['startle'] + .5), (HIT['kneeGlow'][0], HIT['kneeGlow'][0] + .6),
         (HIT['xmark'] + .55, HIT['xmark'] + 1.0), (HIT['earOn'] - .05, HIT['earOn'] + .7), (HIT['chirps'][0] - .05, HIT['chirps'][1] + .4),
         (HIT['solo'][0] - .05, HIT['solo'][-1] + .35), (HIT['crouch'][0], HIT['launch'] + .6), (HIT['land'] - .05, HIT['land'] + .3),
         (HIT['snap1'] - .05, HIT['stamp1'] + .4), (HIT['snap2'] - .05, HIT['stamp2'] + .4), (HIT['gulp'] - .1, HIT['gulp'] + .5),
         (HIT['flip'][0] - .05, HIT['flip'][1] + .1), (HIT['chirpCover'] - .05, HIT['loupeCover'] + .5), (HIT['recall'] - .05, HIT['recall'] + .5)]
# Sound Design Plan (11/2026, QUALITY.md §4, SOUND-PLAN.md): mỗi cảnh một phong cách nhạc, một BPM, một nhạc cụ hát chính, một cách chuyển.
G = Groove(M, BEAT, LINES, meter=4, seed=13, avoid=AVOID, plan=True)
HOOK = dict(bass='bassn', comp='pluck', lead='banjo', kit='bongo', energy=2, bpm=120, mood='playful')
G.sec('móc · còi lá cỏ', 0, S0, 'skip', 'Db', 'Db Gb,Ab', **HOOK, cue=False, arc='open',
      what='Crumb thổi còi lá cỏ "PWEEET!"; Chirp, Hop và Miss Loupe giật mình, mỗi người "nghe" ở một chỗ: đầu gối, bụng, kính. "Where does a grasshopper hide its ears?"',
      emo='bất ngờ, tò mò', why='Shuffle nhảy chân sáo 120 BPM (phách của phim, để vòng lặp khớp): banjo hát như một buổi trưa ngoài đồng, ukulele đệm, bongo cho cú giật mình; xylophone chạy lên đúng lúc cả ba nảy lên (viết tay).')
G.mark('logo · nhạc hiệu 0,8 s', S0, S1, 'jingle', 'Db', 'horn marimba bell', 3, mood='epic', arc='open', what='Máy lao vào mặt kính, logo bật lên',
       emo='háo hức', why='Nhạc hiệu 0,8 s của kênh (band.sting) ở Rê giáng, khớp đúng cú lao vào kính.')
G.sec('bí mật 1 · tai Chirp ở đầu gối', S1, HIT['hush'][0], 'quest', 'Db', 'Db Bbm Gb Ab', bass='upright', comp='celesta', lead='toypiano', kit='tri', energy=2,
      bpm=108, mood='magic', arc='build', what='"Let\'s zoom in!" — kính soi Chirp và Hop; tai Chirp ở chân trước sáng lên. Crumb: "Are they on its legs, like Chirp?"',
      emo='tò mò, kỳ diệu', why='Phiêu lưu nước kiệu 108 BPM, piano đồ chơi hát, celesta đệm như ánh sáng nhỏ trong kính; đàn hạc vuốt lên khi tai Chirp sáng (viết tay).')
G.mark('khựng trước "Nope!"', HIT['hush'][0], L['L04']['t'], 'break', 'Db', '', 1, mood='funny', arc='build', what='Kính trượt sang chân trước của Hop: không có gì… khựng hài',
       emo='tinh nghịch, chờ', why='Khựng hài 0,65 s ở giọng trưởng (11/2026: không hồi hộp, không giọng thứ), trống lăn thì thầm để "Nope!" bật ra rõ: thử nghiệm của tập là "Nope!" ở bí mật 1.')
G.sec('"Nope!" · tai ở bụng', L['L04']['t'], L['L06']['t'], 'twinkle', 'Db', 'Db Gb Db Ab', bass='bassn', comp='harp', lead='vibes', kit='tri', energy=2,
      bpm=108, mood='cute', arc='build', what='"Nope!" (dấu X); kính quét dọc sườn Hop, cánh nhấc lên như tấm rèm, lộ màng nghe tròn: "Its ears are on its tummy!"; Chirp gáy, màng rung',
      emo='bất ngờ, thích thú', why='Hộp nhạc lấp lánh 108 BPM, vibraphone hát: bí mật hiện ra nhẹ như mở một chiếc hộp. Trombone "wah-wah" sau "Nope!", mô-típ bí mật đô–mi–sol (celesta) khi màng nghe lộ ra, mỗi tiếng gáy chạm màng là một nốt marimba (viết tay).')
G.sec('Crumb hỏi · châu chấu xa hát', L['L06']['t'], HIT['stamp1'], 'hop', 'Gb', 'Gb Db Ab Db', bass='pizzbass', comp='pluck', lead='reed', kit='comic', energy=2,
      bpm=116, mood='funny', arc='build', what='Crumb xoa bụng mình: "But WHY on its tummy?" — "To hear other grasshoppers sing!": hai châu chấu xa hát, vòng âm bay tới tai bụng của Hop',
      emo='buồn cười, ngộ ra', why='Nảy lệch phách 116 BPM ở Sol giáng, clarinet hát như một câu hỏi tinh nghịch; mõ hai cao độ cho cú xoa bụng. Tiếng hát xa là ba nốt "kéo vĩ" rất nhỏ (viết tay).')
G.sec('bí mật 2 · hát bằng chân', HIT['stamp1'], HIT['stamp2'], 'cumbia', 'Db', 'Db Ab Gb Ab', bass='bassn', comp='accordion', lead='strings', kit='guira', energy=2,
      bpm=120, mood='bouncy', arc='build', what='"Many grasshoppers sing with their legs!" — Hop giơ đùi sau, kéo lên xuống dọc mép cánh; "They rub a back leg on a wing!"; Hop độc tấu bốn nốt',
      emo='vui, ngạc nhiên', why='Điệu riêng của tập vào lần đầu: cumbia 120 BPM, güira cạo móc kép như chính cái chân "cạo" của Hop; dàn dây spiccato hát như cây vĩ cầm của Hop, phong cầm đệm. Mỗi nhát kéo là một nốt "rè" có cao độ; đoạn độc tấu Rê giáng–Fa–La giáng–Rê giáng (viết tay).')
G.sec('bí mật 3 · lò xo nén', HIT['stamp2'], HIT['launch'], 'stride', 'Db', 'Db Ab', bass='tuba', comp='pizz', lead='trombone', kit='comic', energy=2,
      bpm=112, mood='funny', arc='build', what='"And its back legs are like springs!" — Hop co chân, lò xo bên cạnh nén lại', emo='tinh nghịch, chờ cú bật',
      why='Ragtime hài 112 BPM, vui tươi (11/2026: không dùng điệu rình rập): trombone hát, trượt xuống từng bậc theo lò xo nén như một chiếc lò xo bị ép (viết tay), mõ hai cao độ; riser ngắn ngay trước cú bật. (Rình rập + bassoon đã quen ở 003, 005, 007.)')
G.sec('BOING! ra khỏi kính', HIT['launch'], D0, 'hero', 'Db', 'Db Ab', bass='bassn', comp='pluck', lead='trumpet', kit='epic', energy=3,
      bpm=132, mood='epic', arc='peak', what='BOING! Hop nhảy vọt lên, ra khỏi mặt kính; máy ngước theo lên trời rồi cúi xuống bãi cỏ; Crumb: "Look at it go!"', emo='phấn khích, choáng ngợp',
      why='Cao trào anh hùng 132 BPM, timpani: cú nhảy là khoảnh khắc wow. Kèn trumpet thổi motif lò xo Rê giáng–Fa–La giáng–Rê giáng đi lên đúng cú bật (viết tay).', tr='riser')
G.mark('song tấu · nốt thành hình', D0, D1, 'cumbia', 'Db', 'accordion strings celesta', 3, bpm=120, mood='happy', arc='peak', kit='guira',
       what='Chirp và Hop song tấu trên gốc cây; nốt nhạc bay lên xếp thành trái tim, ngôi sao, mặt cười. Crumb: "A bug band!" — Miss Loupe: "The notes make a heart!"',
       emo='vui sướng, tự hào', why='Cảnh đặc trưng, viết tay hoàn toàn trên nền cumbia 120 BPM: tambora phách 1–3, güira cạo móc kép, bass gảy, phong cầm chặn phách lẻ. Hop kéo vĩ (dây "rè" có cao độ) hỏi, Chirp gáy (chuông dế ba xung) đáp, đúng như một cặp song tấu; mỗi hình hiện lên là một hợp âm celesta.')
G.mark('chụp → sổ', HIT['snap3'], HIT['stamp3'], 'break', 'Db', 'marimba harp', 2, mood='happy', arc='end', what='Kính "chụp", máy xuyên mặt kính, sticker 3 dán vào sổ',
       emo='háo hức', why='Marimba chạy lên (tiếng "chụp" của ban nhạc kênh), đàn hạc vuốt qua mặt kính.')
G.sec('sổ · cumbia', HIT['stamp3'], HIT['flip'][0], 'cumbia', 'Db', 'Db Ab', bass='bassn', comp='marimba', lead='horn', kit='guira', energy=2, cue=False,
      bpm=116, mood='epic', arc='end', what='Đủ ba sticker; Hop nhảy tưng tưng vào; Albie: "Six legs? In you go!", Hop nhảy vào trang đúng "go!"', emo='tự hào, vui',
      why='Cumbia của tập trở lại ở sổ, 116 BPM, kèn đồ chơi đáp, marimba chặn: đủ ba bí mật là một điệu nhảy nhỏ; dưới giọng trầm của Albie lớp nhịp tự bỏ bass.')
G.sec('gag · "Play it again! Louder!"', HIT['flip'][0], HIT['encore'][0], 'bounce', 'Gb', 'Gb Db', bass='bassn', comp='pluck', lead='kazoo', kit='clap', energy=2,
      bpm=124, mood='playful', arc='end', what='Lật trang về bãi cỏ; Crumb nhảy cẫng: "Play it again! Louder!"', emo='háo hức, tinh nghịch',
      why='Pop nảy 124 BPM ở Sol giáng, kazoo hát như Crumb đang nài nỉ; vỗ tay 2–4.')
G.sec('gag · to quá!', HIT['encore'][0], HIT['chirpCover'], 'gallop', 'Db', 'Db Ab', bass='bassn', comp='accordion', lead='steel', kit='pop', energy=3,
      bpm=126, mood='bouncy', arc='end', what='Chirp và Hop chơi lại, to dần: nốt to, vòng âm dày, kính của Miss Loupe rung', emo='náo nhiệt, quá đà',
      why='Phi ngựa nhịp kép 126 BPM, trống thép hát, phong cầm đệm, to dần lên tới mức "quá" — để cú khựng sau nghe rõ.')
G.mark('khựng · bịt tai', HIT['chirpCover'], L['L16']['t'], 'break', 'Db', 'vibes celesta marimba', 1, mood='funny', arc='end',
       what='Khựng: Chirp bịt đầu gối, Hop bịt bụng, Miss Loupe bịt… kính', emo='buồn cười', why='Cả dàn dừng, chỉ còn vibraphone run run; ba cú bịt là ba nốt: celesta (Chirp), marimba (Hop), tiếng "keng" thuỷ tinh (kính của Miss Loupe), viết tay.')
G.sec('"Oops! Too loud!" · "Where are YOUR ears?"', L['L16']['t'], HIT['home'][0], 'sunny', 'Gb', 'Gb Db Ebm Ab', bass='bassn', comp='pluck', lead='celesta', kit='brush', energy=2,
      bpm=112, mood='happy', arc='end', what='"Oops! Too loud!"; Crumb cười; Miss Loupe hỏi trẻ: "Where are YOUR ears?"; cả ba bỏ tay ra', emo='vui, mời gọi',
      why='Ukulele nắng 112 BPM, celesta hát nhẹ (11/2026: kết luôn vui tươi, không chậm như bài ru): sau tiếng ồn là một nhịp vui, gọn để trẻ chỉ vào tai mình và trả lời.')
G.sec('nhặt lá cỏ · chữ móc trở lại', HIT['home'][0], HIT['home'][1], 'polka', 'Db', 'Db Ab', bass='tuba', comp='pluck', lead='piano', kit='toy', energy=2,
      bpm=120, mood='happy', arc='end', what='Crumb nhặt một lá cỏ mới, đưa lên miệng; chữ móc trở lại', emo='tinh nghịch, vui',
      why='Polka 120 BPM, piano hát: Crumb lại sắp nghịch; chữ móc trở lại với hợp âm Rê giáng.')
G.sec('nối vòng lặp', HIT['home'][1], DUR, 'skip', 'Db', 'Db', **HOOK, cue=False, arc='open', reprise=True,
      what='Chirp và Hop lại đứng cạnh nhau, Crumb phồng má sắp thổi (đúng khung đầu)', emo='tinh nghịch',
      why='Mở đầu của vòng sau: nhạc của móc bắt đầu lại 1,15 s trước điểm lặp, cùng 120 BPM, nên vòng lặp nghe liền một mạch. Phần kết của tập là polka ở cảnh trước.')
G.answer(HIT['giggle'], HIT['footWag'][0], HIT['legUp'][0], HIT['giggle2'])
G.play(); os.makedirs(os.path.join(HERE, 'out'), exist_ok=True); G.save(os.path.join(HERE, 'out', 'music.json'), color='"Meadow Cumbia Duet" (Rê giáng trưởng, song tấu güira – vĩ cầm chân – chuông dế)')

# — Móc: hợp âm Rê giáng ở giây 0; cả ba nảy lên: xylophone chạy lên; Chirp giơ chân: celesta; Hop xoay sườn: marimba; "?": bassoon hỏi —
M(bassn(37, .5), 0., 1.0); strum(pluck, DB + (73,), 0., .3, .5); M(glock(97, .5), 0., .1, .4)
seq(xylo, (73, 77, 80, 85, 89), HIT['startle'], .05, .3, .1, d=.25)
M(celesta(92, .4), HIT['chirpLeg'][0] + .05, .16, -.2); M(celesta(97, .4), HIT['chirpLeg'][0] + .17, .13, -.2)
M(marimba(80, .4), HIT['hopTurn'][0] + .05, .22, .3); M(marimba(85, .4), HIT['hopTurn'][0] + .17, .2, .3)
seq(lambda m, d: bassoon(m, d), (56, 61), HIT['puzzle'][0], .2, .35, 0, d=.22)
# — Nhạc hiệu 0,8 s ở cú lao vào kính —
_x = sting(1., root=73); _s = int(S0 * SR); mus[_s:_s + len(_x)] += _x * .9          # sting() trả về stereo
# — Bí mật 1: tai Chirp sáng: đàn hạc vuốt lên; "Nope!": trombone "wah-wah"; màng nghe lộ ra: mô-típ bí mật đô–mi–sol (celesta, Rê giáng) —
M(T.gliss(73, 97, .45, .22, 'harp'), HIT['kneeGlow'][0] + .05, .8)
M(trombone(56, .3, 1., -1.5), HIT['xmark'] + .62, .32, .1); M(trombone(53, .4, 1., -2.5), HIT['xmark'] + .92, .3, .1)
M(T.gliss(68, 92, .5, .2, 'harp'), HIT['earOn'] - .05, .7)
secret(M, celesta, 85, HIT['earOn'] + .05, .14, .2, .2, d=.6, last=12)
for i, h in enumerate(HIT['chirps']): M(marimba(85 + 4 * i, .4), h + .19, .26, .25)                       # vòng âm chạm màng nghe
for i, h in enumerate(HIT['farRings']): M(rasp(85 + (0, 4, 7)[i], .18, .5), h, .12, .7)                 # châu chấu xa hát (rất nhỏ, xa, bên phải)
# — chụp: marimba chạy lên; đàn hạc —
for h in (HIT['snap1'], HIT['snap2']):
    seq(marimba, (73, 77, 80, 85, 89), h + .04, .06, .4, .2, ramp=.1); M(T.gliss(80, 101, .45, .22, 'harp'), h + .1, .6)
# — Bí mật 2: Hop kéo vĩ (mỗi nhát một nốt "rè" ở Rê giáng ngũ cung; nhỏ dưới lời, to ở đoạn độc tấu) —
PENT = (73, 75, 77, 80, 82, 85)
SAWS = sorted(e['t'] for e in EV if e['type'] == 'rasp' and e['t'] < 20)
for i, h in enumerate(SAWS):
    solo = h >= HIT['solo'][0] - .01
    m = (73, 77, 80, 85)[HIT['solo'].index(min(HIT['solo'], key=lambda s: abs(s - h)))] if solo else PENT[(i * 2) % len(PENT)]
    M(rasp(m, .22 if solo else .16, 1.), h, .55 if solo else (.12 if speaking(h) else .3), .25)
# — Bí mật 3: lò xo nén: bassoon trượt xuống từng bậc; riser; BOING: trumpet motif lò xo đi lên + timpani —
for i, m in enumerate((61, 60, 58, 56, 54)): M(trombone(m - 12, .22, 1., -.6), HIT['crouch'][0] + i * .22, .3, .1)   # lò xo nén: trombone trượt xuống từng bậc
M(riser(.5, .9), HIT['launch'] - .5, .6)
seq(lambda m, d: trumpet(m, d), SPRING, HIT['launch'] + .02, .09, .36, 0, d=.22); M(timpani(37, 1., 1.2), HIT['launch'], .7)
M(timpani(37, .9, 1.), HIT['land'], .7); strum(pluck, DB + (73,), HIT['land'] + .02, .3, .6)
# — Song tấu viết tay (G.mark, cumbia 120 BPM): tambora 1–3, güira cạo móc kép, bass, phong cầm chặn phách lẻ; Hop hỏi (rasp), Chirp đáp (chirpn) —
DS, DB_ = HIT['duet'][0], BEAT                                       # lưới của song tấu bắt đầu đúng lúc Hop kéo nhát đầu
DCH = [DB, (66, 70, 73), (68, 72, 75), DB]                           # Rê giáng | Sol giáng | La giáng | Rê giáng (mỗi hợp âm 2 phách)
def dchord(t): return DCH[min(len(DCH) - 1, int((t - DS) / (2 * DB_)) % len(DCH))]
t = D0 + .05
while t < D1 - .02:
    k = int(round((t - DS) / (DB_ / 4)))                             # móc kép thứ k (lưới 16 móc kép mỗi ô)
    tt = DS + k * DB_ / 4
    if tt < D0 or tt >= D1: t += DB_ / 4; continue
    s16 = k % 16
    if s16 in (0, 8): M(tom(41, 1.), tt, .55, -.1)                                             # tambora
    if s16 in (4, 12): M(tom(48, .7), tt, .35, .1)
    M(shaker(1.15 if s16 % 2 == 0 else .7), tt, .55, .35)                                      # güira cạo
    if s16 in (2, 6, 10, 14): M(bongo(.6, True), tt, .25, -.4)
    ch = dchord(tt)
    if s16 in (0, 8): M(bassn(ch[0] - 24, .3), tt, .9)
    if s16 in (6, 14): M(bassn(ch[2] - 24, .2), tt, .7)
    if s16 in (2, 6, 10, 14): strum(accordion, ch, tt, .16 if speaking(tt) else .24, .18, .006)   # phong cầm chặn phách lẻ
    t = tt + DB_ / 4
# Hop hỏi: nốt "rè" ở mỗi nhát kéo (phách 1, 2…); Chirp đáp: chuông dế ở nửa phách sau. Dưới lời: nhỏ lại, giữ nhịp
HOPQ = [73, 77, 80, 77, 82, 80, 77, 73, 85, 82, 80, 77, 80, 85, 89, 85]
CHA = [92, 97, 92, 89, 94, 92, 97, 101, 97, 94, 92, 97, 101, 104, 101, 97]
DUET_H = [h for h in (DS + i * DB_ for i in range(20)) if h < D1 - .1]
for i, h in enumerate(DUET_H):
    sp = speaking(h, .1)
    M(rasp(HOPQ[i % len(HOPQ)], .2, 1.), h, .14 if sp else .42, .3)
    M(chirpn(CHA[i % len(CHA)], 1.), h + DB_ / 2, .2 if sp else .55, -.3)
for k, a in enumerate((HIT['heart'][0], HIT['star'][0], HIT['smile'][0])):                    # mỗi hình hiện lên: hợp âm celesta + đàn hạc
    strum(celesta, [n + 24 for n in (DB, GB, AB)[k]], a + .02, .16, .9, .03); M(T.gliss(80 + 2 * k, 100 + 2 * k, .35, .16, 'harp'), a - .3, .6)
seq(lambda m, d: trumpet(m, d), SPRING, HIT['finale'] + .02, .08, .3, .2, d=.2)               # cú nảy cuối song tấu
# — Chụp → sổ: marimba chạy lên; đàn hạc vuốt; sticker; Hop nhảy vào trang: xylophone trượt xuống; lật trang —
seq(marimba, (73, 77, 80, 85, 89), HIT['snap3'] + .04, .07, .45, .2, ramp=.1)
M(T.gliss(80, 101, HIT['zoomIn'][1] - HIT['zoomIn'][0], .28, 'harp'), HIT['zoomIn'][0], .9)
M(T.gliss(97, 80, HIT['zoomOut'][1] - HIT['zoomOut'][0], .2, 'harp'), HIT['zoomOut'][0], .7)
strum(harp, DB + (73,), HIT['zoomOut'][1], .35, .9); M(celesta(97, 1.0), HIT['stamp3'] + .02, .3, .3)
seq(xylo, (97, 92, 89, 85, 80), HIT['gulp'] + .02, .05, .35, .1, d=.2)
M(celesta(101, .8), HIT['mini'] + .02, .3, .4)
M(T.gliss(77, 101, .45, .3, 'harp'), HIT['flip'][0] + .02, .7)
# — Gag: to quá! — cả dàn khựng; ba cú bịt là ba nốt; vibraphone run run giữ một lớp mỏng —
for i, h in enumerate(sorted(e['t'] for e in EV if e['type'] == 'rasp' and e['t'] > 34)): M(rasp((73, 80, 85, 89)[i % 4], .2, 1.), h, .35 + .05 * i, .3)
for k in range(10): M(vibes(85 + (k % 2) * 4, .25), HIT['chirpCover'] + .05 + k * .11, .07, -.2 + .04 * k)
M(celesta(97, .5), HIT['chirpCover'] + .02, .3, -.1); M(marimba(80, .5), HIT['hopCover'] + .02, .35, .3); M(T._ting(mf(104), .8, 1.) * .5, HIT['loupeCover'] + .02, .35, -.4)
# — Chữ móc trở lại: hợp âm Rê giáng nhỏ; nốt dẫn La giáng → Rê giáng ở 0,0 —
strum(pluck, DB + (73,), HIT['recall'], .28, .8)
M(bassn(44, .3), DUR - BEAT / 2, .9)

# — cường độ theo cảnh (chuyển mềm 0,3 s) —
LEVEL = ((0, .85), (.3, .74), (HIT['startle'], .95), (L['L01']['t'] + .25, .74), (S0, .95), (S1 + .1, .8), (L['L02']['t'], .74), (HIT['kneeGlow'][0], .86), (L['L03']['t'], .72),
         (HIT['hush'][0], .5), (L['L04']['t'], 1.0), (L['L05']['t'], .74), (HIT['earOn'], .9), (end('L05'), .95), (L['L06']['t'], .74), (end('L06'), .9), (L['L07']['t'], .74),
         (HIT['snap1'], 1.0), (HIT['stamp1'] + .2, .8), (L['L08']['t'], .72), (end('L09'), .95), (HIT['stamp2'] + .2, .78), (L['L10']['t'], .72), (end('L10'), .86),
         (HIT['launch'], 1.0), (L['L11']['t'], .78), (end('L11'), 1.0), (L['L12']['t'], .78), (end('L12'), .95), (L['L13']['t'], .76), (end('L13'), 1.0),
         (HIT['snap3'], 1.0), (HIT['stamp3'] + .3, .8), (HIT['gulp'], .95), (HIT['gulp'] + .5, .8), (HIT['flip'][0], .9), (L['L15']['t'], .74), (end('L15'), .9),
         (HIT['encore'][0], .95), (HIT['loud'][0], 1.0), (HIT['chirpCover'], .55), (L['L16']['t'], .7), (end('L16'), .8), (L['L17']['t'], .66), (end('L17'), .82))
tt = np.arange(len(mus)) / SR; lev = np.full(len(mus), LEVEL[0][1])
for (t, g), (_, g0) in zip(LEVEL[1:], LEVEL[:-1]): lev = np.where(tt >= t - .15, np.where(tt < t + .15, g0 + (g - g0) * (tt - t + .15) / .3, g), lev)
mus *= lev[:, None]


# ---------- tiếng động theo sự kiện ----------
fx = B['fx']
def roll(d, v=1.):                              # Rollo lăn viên tròn trên bãi xa: "rù rù" trầm rất nhỏ
    tt = t_(d); return lp(brown(d), 220) * (.6 + .4 * np.sin(2 * np.pi * 3.2 * tt)) * np.minimum(1, np.minimum(tt, d - tt) / .3) * .5 * v
def hushroll(d, v=1.):
    tt = t_(d); return bp(noise(d), 1800, 6000) * (.5 + .5 * np.sign(np.sin(2 * np.pi * 22 * tt))) * np.minimum(1, tt / .1) * .05 * v
def glassring(d, v=1.):                         # kính của Miss Loupe rung "ong ong": hai bội âm thuỷ tinh, rung nhanh, tắt dần
    tt = t_(d); x = (np.sin(2 * np.pi * 1760 * tt) + .5 * np.sin(2 * np.pi * 3910 * tt)) * (.6 + .4 * np.sin(2 * np.pi * 26 * tt))
    return x * np.exp(-tt * 2.2) * np.minimum(1, tt / .01) * .1 * v
def eardrum(v=1., n=0):                         # màng nghe rung "bum": màng căng, cao độ rơi nhanh, kèm một tiếng "tinh" nhỏ
    d = .3; tt = t_(d); f = 260 * (1 + .25 * np.exp(-tt * 30)) + 20 * n
    return mixl(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 11) * .35 * v, T.tink(.18 * v, 4200 + 300 * n))
def creak(d, v=1.):                             # lò xo nén "kééét": tiếng rít đi xuống, rung
    tt = t_(d); f = np.interp(tt, [0, d], [1300, 700]) * (1 + .04 * np.sign(np.sin(2 * np.pi * 30 * tt)))
    x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * .5 + np.sin(2 * np.pi * np.cumsum(f) / SR) * .5
    return lp(x, 2600) * np.minimum(1, tt / .05) * np.minimum(1, (d - tt) / .1) * .05 * v
def farsong(d, v=1.):                           # hai châu chấu xa hát: chuỗi "rè rè" nhỏ, có cao độ, rất xa
    x = np.zeros(int(d * SR) + 1); k = 0; t0 = 0.
    while t0 < d - .2: y = rasp((85, 89, 92)[k % 3], .15, .5); s = int(t0 * SR); x[s:s + len(y)] += y[:len(x) - s]; t0 += .24; k += 1
    return lp(x, 3000) * .5 * v
def scrape(v=1.):                               # tiếng cọ của một nhát kéo (đùi có gai cọ mép cánh): "sột" ngắn, băm theo hàng gai; cao độ nằm ở phần nhạc
    d = .13; tt = t_(d); pegs = .4 + .6 * np.abs(np.sin(np.pi * 38 * tt))
    return bp(noise(d), 2200, 5200) * pegs * np.sin(np.pi * tt / d) ** 1.5 * .14 * v
def curtain(d, v=1.):                           # cánh nhấc lên như tấm rèm: "sột" giấy mỏng + một tiếng "tinh"
    return mixl(T.paper(d, .3 * v, 4, 2), np.pad(T.tink(.15 * v), (int(d * .8 * SR), 0)))
def cover(n, v=1.):                             # bịt tai: "bộp" mềm, mỗi người một cao độ
    return mixl(thump(.5 * v, (150, 120, 180)[n]) * .5, T.bonk(.35 * v, (80, 74, 86)[n]), np.pad(T.blip((91, 86, 96)[n], .2), (int(.06 * SR), 0)))
SFX = {
    'titlepop': lambda e: mixl(T.bubble(1600, .5, .06, 2.4), np.pad(T._ting(mf(101), .5, .35), (int(.02 * SR), 0))),
    'wordpop': lambda e: mixl(T.boing(220 + 120 * e.get('n', 0), .35, .3, 2.4, 16.), np.pad(pop(.6) * .45, (int(.02 * SR), 0)), T.bubble(1300 + 500 * e.get('n', 0), .35, .05, 2.4)),
    'whistle': lambda e: grasswhistle(e.get('d', .34), 1.),
    'startle': lambda e: mixl(T.boing(240, .35, .3, 2.4, 16.), T.surprise(.3)),
    'chirp': lambda e: chirp(1.2 * e.get('v', 1.)),
    'boing': lambda e: mixl(T.boing(170, .55, .45 * e.get('v', 1.), 2.8, 16.), T.swish(.3, .15 * e.get('v', 1.), 800, 3600, True)),
    'glassring': lambda e: glassring(e.get('d', 1.), .9),
    'land': lambda e: mixl(thump(.45 * e.get('v', 1.), 170) * .4, T.plip(1100, .3)),
    'swish': lambda e: T.swish(e.get('d', .45), e.get('v', .4), e.get('lo', 350), e.get('hi', 2600), e.get('up', True)),
    'turn': lambda e: T.swish(.25, .16, 1400, 4200, True),
    'giggle': lambda e: T.giggle(4, .5 * e.get('v', 1.), e.get('m', 86), .1, 3),
    'huh': lambda e: mixl(T.boing(300, .3, .2, 2.0, 12.), np.pad(T.blip(86, .25), (int(.1 * SR), 0)), np.pad(T.blip(91, .25), (int(.2 * SR), 0))),
    'slots': lambda e: T.pops(3, .08, 84, .32),
    'zoom': lambda e: mixl(riser(.4, .8), T.whistle(420, 1250, .4, .12)),
    'logo': lambda e: T.sparkle(.5, .22, 91, 105, 6, 4, 'up'),
    'shine': lambda e: T.sparkle(.6, .26, 91, 105, 7, 2, 'up'),
    'swipe': lambda e: T.swipe(e.get('d', .3), .32, True, e.get('lo', 1500), e.get('hi', 5500)),
    'hush': lambda e: hushroll(e.get('d', .5)),
    'nope': lambda e: mixl(T.bonk(.35, 70), np.pad(pop(.4) * .3, (int(.03 * SR), 0))),
    'tap': lambda e: mixl(T.block(88 + 3 * e.get('n', 0), .22), T.tink(.12)),
    'curtain': lambda e: curtain(e.get('d', .5), 1.),
    'reveal': lambda e: mixl(T.sparkle(.6, .3, 93, 106, 7, 5, 'up'), np.pad(T.ding(92, .3, .8), (int(.05 * SR), 0))),
    'eardrum': lambda e: eardrum(e.get('v', 1.), e.get('n', 0)),
    'step': lambda e: mixl(T.block(91 + 3 * (e.get('n', 0) % 2), .14 * e.get('v', 1.)), T.blip(98 + 3 * (e.get('n', 0) % 2), .06, .04)),
    'pat': lambda e: mixl(T.bonk(.3, 82), np.pad(T.bonk(.25, 84), (int(.18 * SR), 0))),
    'farsong': lambda e: farsong(e.get('d', 1.5), .8),
    'snap': lambda e: mixl(click(1., .25) * .8, np.pad(click(.8, .2) * .5, (int(.045 * SR), 0)), np.pad(T.sparkle(.45, .3, 93, 108, 6, 7, 'up'), (int(.06 * SR), 0))),
    'slotstamp': lambda e: mixl(thump(.7, 120) * .55, hp(noise(.06), 1400) * env_exp(.06, .012) * .45, np.pad(T.ding(89 + 3 * e.get('n', 0), .35, .8), (int(.02 * SR), 0))),
    'rasp': lambda e: scrape(e.get('v', 1.)),
    'creak': lambda e: creak(e.get('d', 1.), 1.),
    'zoomback': lambda e: T.swish(e.get('d', .6), .3, 4200, 500, False, .4, .3),
    'shape': lambda e: mixl(T.pops(6, .03, 89 + 2 * e.get('n', 0), .3), np.pad(T.sparkle(.5, .22, 94, 106, 6, 3 + e.get('n', 0), 'up'), (int(.04 * SR), 0))),
    'zoomin': lambda e: mixl(T.swish(e.get('d', .3), .42, 600, 5200, True, .15, .25), riser(e.get('d', .3), .4)),
    'zoomout': lambda e: mixl(T.swish(e.get('d', .35), .3, 500, 3800, False, .25, .2), np.pad(T.paper(.3, .35, 5, 4), (int(.1 * SR), 0))),
    'page': lambda e: mixl(T.paper(.35, .45, 5, 1), T.bubble(520, .3, .09)),
    'stamp': lambda e: mixl(thump(.8, 110) * .7, hp(noise(.07), 1200) * env_exp(.07, .012) * .6),
    'ding': lambda e: T.ding(e.get('m', 88), e.get('v', .4), .7),
    'count': lambda e: mixl(T.blip(84 + 3 * e.get('n', 0), .35), T.block(91 + 2 * e.get('n', 0), .25)),
    'gulp': lambda e: mixl(T.paper(.3, .45, 5, 2), T.boing(170, .45, .4, 2.2, 14.), np.pad(T.bubble(420, .35, .12, 1.4), (int(.08 * SR), 0))),
    'pops': lambda e: T.pops(e.get('n', 6), e.get('step', .035), e.get('m', 84), e.get('v', .5)),
    'flip': lambda e: mixl(T.paper(e.get('d', .5), .5, 7, 3), T.swish(e.get('d', .5), .22, 700, 3200, True)),
    'hopjoy': lambda e: mixl(T.boing(260, .3, .25, 2.4, 16.), np.pad(T.boing(300, .3, .2, 2.4, 16.), (int(.3 * SR), 0))),
    'roll': lambda e: roll(e.get('d', 2.), .8),
    'cover': lambda e: cover(e.get('n', 0), 1.),
    'bonk': lambda e: T.bonk(.3, 92),
    'unpop': lambda e: mixl(pop(.5) * .4, T.bubble(900 + 200 * e.get('n', 0), .3, .06, 2.4)),
    'scurry': lambda e: T.scurry(e.get('d', 1.2), .4, 91, 4),
    'pluck': lambda e: mixl(T.plip(1500, .35), np.pad(T.paper(.12, .2, 3, 6), (int(.02 * SR), 0))),
    'recall': lambda e: mixl(SFX['titlepop'](e), SFX['wordpop']({'n': 0}), np.pad(SFX['wordpop']({'n': 1}), (int(.12 * SR), 0))),
}
missing = sorted({e['type'] for e in EV} - SFX.keys())
if missing: sys.exit(f'mix.py: no sound for event types {missing}')
VERB = {'zoom': .3, 'titlepop': .3, 'ding': .4, 'flip': .3, 'page': .3, 'swipe': .25, 'count': .45, 'shine': .4, 'reveal': .4, 'slotstamp': .3, 'shape': .4, 'glassring': .3, 'whistle': .2}
snd = np.zeros(NW)
for e in EV:
    x = SFX[e['type']](e); add(fx, x, e['t'], 1., e.get('pan', 0))
    if e['type'] in VERB: s0 = int(e['t'] * SR); k = min(len(x), NW - s0); snd[s0:s0 + k] += x[:k] * VERB[e['type']]
fx += T.verb(snd, 1.3) * .35


# ---------- vòng lặp: phần dư sau 44 s cộng vào đầu phim ----------
for k in ('mus', 'fx'):
    b = B[k]; tail = b[N0:].copy(); b[:len(tail)] += tail; B[k] = b[:N].copy()
mus, fx = B['mus'], B['fx']


# ---------- nền: bãi cỏ trưa hè (gió nhẹ, chim xa hót ở chỗ không có lời; không có trong sổ) ----------
amb = B['amb']
d = DUR; tt = t_(d)
add(amb, lp(brown(d), 420) * (.75 + .25 * np.sin(2 * np.pi * .17 * tt)) * np.minimum(1, tt / .05) * .045, 0, 1., 0)
def tweet(v=1., f=3200):
    d = .16; tt = t_(d); fr = f * (1 + .25 * np.sin(np.pi * tt / d)); x = np.sin(2 * np.pi * np.cumsum(fr) / SR)
    return x * np.sin(np.pi * tt / d) ** 2 * .05 * v
rng = np.random.default_rng(13)
t0 = .9
while t0 < DUR - .5:
    if not speaking(t0, .25) and not (HIT['zoomIn'][0] - .2 < t0 < HIT['flip'][1]):
        for k in range(2): add(amb, tweet(.6, rng.uniform(2800, 3600)), t0 + k * .19, 1., rng.uniform(-.8, .8))
    t0 += rng.uniform(2.4, 3.8)


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
for name, a, b in (('móc', 0, 3.8), ('kính', 3.8, 22.4), ('nhảy+song tấu', 22.4, 28.65), ('sổ', 28.65, 33.1), ('gag', 33.1, 44)):
    i, j = int(a * SR), int(b * SR)
    print(f'{name:14s}', '  '.join(f'{k}={20 * np.log10(max(rms(B[k][i:j]), 1e-9)):6.1f}' for k in ('mus', 'fx', 'amb', 'vox')), 'dBFS rms')
print('out/mix.wav', f'{len(mix) / SR:.2f} s')
