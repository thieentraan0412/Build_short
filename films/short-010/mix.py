"""Âm thanh của SHORT-010 → out/mix.wav (48 kHz stereo): nhạc theo từng cảnh ("Rewind Pond Hop", Mi giáng trưởng, MUSIC.md và SOUND-PLAN.md),
nhạc hiệu 0,8 s (band.sting) ở cú lao vào kính, tiếng động theo events.json, nền bờ ao buổi sáng, giọng.
python mix.py   (cần timeline.json + voice/*.wav từ tools/lines.mjs và core/tts/tts.py, events.json từ core/render/events.mjs)
Nhạc cụ: _shared/audio/band.py; lớp nhịp theo cảnh: _shared/audio/groove.py (plan=True, Sound Design Plan); tiếng động: _shared/audio/toon.py.
Không dùng mẫu âm thanh của bên thứ ba. Phim phát vòng lặp: nốt Si giáng (bậc năm) ở cuối dẫn về hợp âm Mi giáng ở 0,0; đuôi tiếng sau 44 s gấp về đầu phim."""
import os, sys, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio')); sys.path.insert(0, os.path.join(LIB, '_shared', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, thump, pop, click, clack, compress, add
from band import mf, pluck, marimba, bassn, celesta, harp, xylo, trumpet, trombone, tuba, pizz, toypiano, riser, sting
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


# ---------- nhạc: "Rewind Pond Hop" — Mi giáng trưởng, bờ ao buổi sáng ----------
# Motif bốn nốt của Zip (Mi♭–Sol–Si♭–Mi♭): đi lên khi Zip bay tới, đi NGƯỢC xuống (đúng bốn nốt ấy, đảo thứ tự) khi Zip bay lùi.
# Rón rén của Crumb là pizzicato + bassoon (móc, và trở lại y nguyên ở gag: cùng mạch "rình"); hàng nghìn ô mắt là một làn mưa nốt toy piano.
from groove import Groove
mus = B['mus']
def M(x, t, g=1., pan=0.): add(mus, x, t, g, pan)
def seq(inst, ns, t0, step, g=1., pan=0., d=None, ramp=0.):
    for i, n in enumerate(ns):
        if n: M(inst(n, d) if d else inst(n), t0 + i * step, g * (1 + ramp * i), pan)
def strum(inst, ns, t, g=.4, d=None, spread=.012):
    for k, n in enumerate(ns): M(inst(n, d) if d else inst(n), t + k * spread, g, -.3 + .6 * k / max(1, len(ns) - 1))
glock = lambda m, d=.6: T._ting(mf(m), d, 1.) * .5
MOTIF = (75, 79, 82, 87)                                           # Mi♭ Sol Si♭ Mi♭: Zip bay tới; đảo ngược = Zip bay lùi

S0, S1 = HIT['sting']
AVOID = [(0, .3), (S0 - .05, S1 + .1), (HIT['zipUp'][0] - .05, HIT['zipUp'][0] + .4), (HIT['eyesGlow'][0] + .25, HIT['eyesGlow'][0] + .8),
         (HIT['caught'] - .05, HIT['caught'] + .6), (HIT['back1'][0] - .05, HIT['back1'][1] + .2), (HIT['dive'][0] - .05, HIT['dive'][0] + .5),
         (HIT['refl'][0] - .05, HIT['refl'][1] + .2), (HIT['snap3'] - .05, HIT['stamp3'] + .5), (HIT['gulp'] - .1, HIT['gulp'] + .5),
         (HIT['flip'][0] - .05, HIT['flip'][1] + .1), (HIT['pout'][0] - .05, HIT['pout'][0] + .6), (HIT['zipOut'][0] - .05, HIT['zipOut'][1] + .2),
         (HIT['boo'] - .05, HIT['boo'] + .5), (HIT['recall'] - .05, HIT['recall'] + .5)]
# Sound Design Plan (11/2026, QUALITY.md §4, SOUND-PLAN.md): mỗi cảnh một phong cách nhạc, một BPM, một nhạc cụ hát chính, một cách chuyển.
# Cảnh "rón rén" ở móc, ở gag và ở 1,2 s cuối là một bản (reprise, cùng 112 BPM): cùng mạch cảm xúc "Crumb đi rình", và nối vòng lặp liền.
G = Groove(M, BEAT, LINES, meter=4, seed=10, avoid=AVOID, plan=True)
TIP = dict(bass='pizzbass', comp='bassoon', lead='pizz', kit='wood', energy=1, bpm=112, mood='funny')   # 11/2026 lượt 2: pizzicato hát, bassoon đệm (007 giữ bassoon hát); rón rén hài, không hồi hộp
G.sec('móc · Crumb rón rén', 0, HIT['startle'] - .05, 'tiptoe', 'Eb', 'Eb Bb', **TIP, cue=False, arc='open',
      what='Crumb nhón chân rón rén sau lưng Miss Loupe định hù; cô hỏi trẻ: "Could you see behind your head?"', emo='hồi hộp, tinh nghịch',
      why='Rón rén hài 112 BPM: pizzicato hát nhón từng bước, bassoon đệm như đang nín cười. Trẻ thấy Crumb, Miss Loupe thì không, nên nhạc "rình" cùng trẻ.')
G.sec('Zip vụt lên · "How did it see me?"', HIT['startle'] - .05, S0, 'hop', 'Eb', 'Eb Ab', bass='bassn', comp='pluck', lead='flute', kit='bongo', energy=2,
      bpm=126, mood='funny', arc='open', what='Con ngươi của Zip trượt ra sau, Zip vụt lên, Crumb giật mình ngã ngồi: "Hey! How did it see me?"', emo='bất ngờ, buồn cười',
      why='Nảy lệch phách 126 BPM ngay cú vụt; sáo chạy motif bốn nốt đi lên của Zip (viết tay), bongo cho cú ngã.')
G.mark('logo · nhạc hiệu 0,8 s', S0, S1, 'jingle', 'Eb', 'horn marimba bell', 3, mood='epic', arc='open', what='Máy lao vào mặt kính, logo bật lên',
       emo='háo hức', why='Nhạc hiệu 0,8 s của kênh (band.sting) ở Mi giáng, khớp đúng cú lao vào kính.')
G.sec('bí mật 1 · mắt chiếm gần hết đầu', S1, HIT['ring'][0], 'quest', 'Eb', 'Eb Cm Ab Bb', bass='upright', comp='harp', lead='glock', kit='tri', energy=2,
      bpm=108, mood='magic', arc='build', what='"Let\'s zoom in!" — kính soi đầu Zip: hai vòm mắt sáng viền, tia lấp lánh trên đỉnh đầu: "Its eyes cover most of its head!"',
      emo='kỳ diệu, tò mò', why='Phiêu lưu 108 BPM, đàn hạc đệm, glockenspiel hát như tia lấp lánh trên mắt; đàn hạc vuốt lên đúng lúc vòm mắt sáng viền (viết tay).')
G.sec('Crumb đi một vòng, mắt theo mãi', HIT['ring'][0], HIT['stamp1'], 'sneak', 'Eb', 'Eb Ab', bass='tuba', comp='pizz', lead='reed', kit='comic', energy=2,
      bpm=100, mood='funny', arc='build', what='Vòng nhìn loang quanh Zip; Crumb rón rén đi một vòng, con ngươi của Zip theo mãi: "So it sees almost all around!"',
      emo='buồn cười, bị bắt quả tang', why='Rình rập hài 100 BPM ở Mi giáng trưởng (vui, không u ám): mỗi lần con ngươi trượt theo là một nốt marimba (viết tay); clarinet cười khúc khích khi Crumb bị bắt gặp.')
G.sec('bí mật 2 · "Can I sneak up on it?"', HIT['stamp1'], HIT['hush'][0], 'tension', 'Cm', 'Cm G', bass='upright', comp='pizzbass', lead='bassoonlo', kit='brush', energy=1,
      bpm=96, mood='suspense', arc='build', what='Crumb thì thầm: "Can I sneak up on it?" rồi rón rén tới gần Zip từ phía sau', emo='hồi hộp',
      why='Nhịp tim hồi hộp 96 BPM, chỉ còn bass và chổi trống, để câu hỏi thì thầm nổi lên và trẻ đoán.')
G.mark('khựng trước "Nope!"', HIT['hush'][0], L['L07']['t'], 'break', 'Cm', '', 1, mood='suspense', arc='build', what='Crumb nhún xuống, sắp vồ… khựng',
       emo='nín thở', why='Khoảng lặng có chủ đích 0,6 s (trống lăn thì thầm) để "Nope!" bật ra rõ.')
G.sec('"Nope!" · Zip bay lùi', L['L07']['t'], HIT['hover'][0], 'samba', 'Eb', 'Eb Bb', bass='bassn', comp='marimba', lead='xylo', kit='samba', energy=3,
      bpm=132, mood='bouncy', arc='build', what='"Nope!" — Zip bay lùi vụt đi, Crumb vồ trượt; "It can even fly backwards!" Zip bay tới, bay lùi lần nữa',
      emo='bất ngờ, phấn khích', why='Điệu riêng của tập vào lần đầu: samba 132 BPM (surdo, tamborim, agogô) cho màn bay tới – bay lùi; motif của Zip chạy NGƯỢC xuống mỗi lần Zip bay lùi và đi lên khi bay tới (viết tay), nghe ra "tua ngược".')
G.sec('đứng yên giữa trời', HIT['hover'][0], HIT['stamp2'], 'float', 'Ab', 'Ab Fm', bass='bassn', comp='harp', lead='vibes', kit='none', energy=1,
      bpm=96, mood='magic', arc='build', what='Zip đứng yên giữa trời trên đầu Crumb, cánh mờ nhoè; Crumb nhảy với', emo='ngạc nhiên, lơ lửng',
      why='Rải lơ lửng 96 BPM, không trống: nhạc "đứng yên" cùng Zip; vibraphone ngân như cánh rung.')
G.sec('vào mắt kép', HIT['stamp2'], HIT['crumbUp'][0], 'twinkle', 'Eb', 'Eb Ab Eb Bb', bass='bassn', comp='celesta', lead='toypiano', kit='tri', energy=2,
      bpm=104, mood='cute', arc='peak', what='Kính đẩy vào vòm mắt và phình ra phủ cả khung: tổ ong hàng nghìn ô, "Each eye has thousands of tiny eyes!"',
      emo='kinh ngạc', why='Hộp nhạc lấp lánh 104 BPM: toy piano và celesta nhỏ như từng ô mắt; đàn hạc vuốt lên dài theo cú đẩy vào mắt (viết tay).')
G.sec('hàng nghìn Crumb tí hon', HIT['crumbUp'][0], HIT['out'][0], 'samba', 'Eb', 'Eb Ab Bb Eb', bass='bassn', comp='pluck', lead='marimba', kit='samba', energy=3,
      bpm=120, mood='happy', arc='peak', what='Crumb ló vào, mỗi ô mắt hiện một Crumb tí hon: "Hi, everybody!" — nghìn Crumb vẫy theo, rón rén theo, lè lưỡi theo',
      emo='vui sướng, buồn cười', why='Cao trào của tập: samba lễ hội 120 BPM (surdo, tamborim, agogô, ukulele chặn như cavaquinho), marimba hát, như một lễ hội nghìn Crumb; làn mưa nốt toy piano lan từ giữa ra khi các hình phản chiếu hiện lên (viết tay).')
G.sec('"That\'s a lot of Crumbs!"', HIT['out'][0], HIT['snap3'], 'stride', 'Ab', 'Ab Eb', bass='tuba', comp='piano', lead='trombone', kit='march', energy=2,
      bpm=112, mood='funny', arc='peak', what='Kính lùi ra; Miss Loupe cười: "That\'s a lot of Crumbs!"; Zip và Crumb cùng cười', emo='buồn cười',
      why='Ragtime piano 112 BPM cho câu đùa, trombone "wah" cười theo (004 giữ trumpet bịt); đàn hạc vuốt xuống khi kính lùi ra (viết tay).')
G.mark('chụp → sổ', HIT['snap3'], HIT['stamp3'], 'break', 'Eb', 'marimba harp', 2, mood='happy', arc='end', what='Kính "chụp", máy xuyên mặt kính, sticker 3 dán vào sổ',
       emo='háo hức', why='Marimba chạy lên (tiếng "chụp" của ban nhạc kênh), đàn hạc vuốt qua mặt kính.')
G.sec('sổ · samba', HIT['stamp3'], HIT['flip'][0], 'samba', 'Eb', 'Eb Bb', bass='bassn', comp='marimba', lead='horn', kit='samba', energy=2, cue=False,
      bpm=116, mood='epic', arc='end', what='Đủ ba sticker; Zip bay lùi vào; Albie: "Six legs? In you go!", Zip lao vào trang đúng "go!"', emo='tự hào, vui',
      why='Samba của tập trở lại ở sổ, 116 BPM, kèn đồ chơi đáp: đủ ba bí mật là một lễ hội nhỏ (diễu hành là điệu riêng của 004); dưới giọng trầm của Albie lớp nhịp tự bỏ bass.')
G.sec('gag · "Can I hold the lens now?"', HIT['flip'][1], HIT['notice'], 'sway', 'Ab', 'Ab Db Ab Eb', bass='bassn', comp='pluck', lead='accordion', kit='brush', energy=1,
      bpm=104, mood='cute', arc='end', what='Crumb xin cầm kính; Miss Loupe nháy mắt: "Not yet!"; Crumb xìu', emo='nũng nịu, thương',
      why='Đung đưa nửa nhịp ở La giáng, accordion hiền như một lời dỗ; trombone "wah-wah" đi xuống khi Crumb xìu (viết tay).')
G.sec('gag · lại rón rén', HIT['notice'], L['L15']['t'], 'tiptoe', 'Eb', 'Eb Bb', **TIP, cue=False, arc='end', reprise=True,
      what='Crumb thấy Zip trên ngọn cỏ nến, lại rón rén tới; Zip bay lùi vụt ra khỏi khung phải', emo='tinh nghịch, hồi hộp',
      why='Nhạc rón rén của móc trở lại y nguyên (reprise): cùng mạch "Crumb đi rình". Motif của Zip chạy ngược xuống khi Zip bay lùi ra (viết tay).')
G.sec('"One, two, three, boo!"', L['L15']['t'], HIT['giggle'][0], 'stab', 'Cm', 'Cm Ab G', bass='upright', comp='piano', lead='trumpet', kit='epic', energy=3,
      bpm=120, mood='suspense', arc='end', what='Crumb đếm và hét "boo!" vào chỗ trống; đúng lúc đó Zip vào lại từ khung trái, đuôi chạm Crumb; Crumb giật bắn',
      emo='hồi hộp → bất ngờ', why='Dừng nhịp 120 BPM: mỗi số đếm một cú chặn, "boo!" là cú chặn cả dàn (viết tay); còi trượt lên khi Crumb giật bắn.')
G.sec('cười · "Can YOU see who\'s behind me?"', HIT['giggle'][0], HIT['home'][1] - .05, 'polka', 'Eb', 'Eb Bb Eb Bb', bass='tuba', comp='pluck', lead='kazoo', kit='toy', energy=2,
      bpm=124, mood='playful', arc='end', what='Zip và Crumb cười; Crumb chạy ra sau lưng Miss Loupe; cô hỏi trẻ: "Can YOU see who\'s behind me?"; Zip về đậu trên vành kính',
      emo='vui, mời gọi', why='Polka 124 BPM, kazoo cười; dưới câu hỏi kết nhạc nhỏ lại để trẻ trả lời; chữ móc trở lại với hợp âm Mi giáng.')
G.sec('lại rón rén (nối vòng lặp)', HIT['home'][1] - .05, DUR, 'tiptoe', 'Eb', 'Eb Bb', **TIP, cue=False, arc='open', reprise=True,
      what='Crumb lại nhón chân rón rén sau lưng Miss Loupe (đúng khung đầu)', emo='tinh nghịch',
      why='Mở đầu của vòng sau: nhạc rón rén của móc bắt đầu lại 1,2 s trước điểm lặp, cùng 112 BPM, nên vòng lặp nghe liền một mạch. Phần kết của tập là polka ở cảnh trước.')
G.answer(HIT['peek'], HIT['caught'], HIT['pout'][0], HIT['giggle'][0] + .05)
# v2 (11/2026, lượt 2: chống trùng giữa các tập): samba là điệu riêng của tập ("Nope!" bay lùi, nghìn Crumb, sổ); bỏ calypso (002) và diễu hành (004);
# rón rén của Crumb: pizzicato hát, bassoon đệm; "Crumb đi một vòng" sang Mi giáng trưởng.
G.play(); os.makedirs(os.path.join(HERE, 'out'), exist_ok=True); G.save(os.path.join(HERE, 'out', 'music.json'), color='"Rewind Pond Hop" (Mi giáng trưởng, lễ hội samba nghìn Crumb)')

# — Móc: hợp âm Mi giáng ở giây 0; con ngươi trượt: celesta; Zip vụt lên: motif đi lên (sáo + glockenspiel) —
M(bassn(39, .5), 0., 1.0); strum(pluck, (63, 67, 70, 75), 0., .3, .5); M(glock(94, .5), 0., .1, .4)
M(celesta(94, .4), HIT['peek'] + .02, .18, .2); M(celesta(99, .4), HIT['peek'] + .14, .14, .2)
seq(glock, [m + 12 for m in MOTIF], HIT['zipUp'][0], .07, .26, .1, d=.35)
# — Nhạc hiệu 0,8 s ở cú lao vào kính —
_x = sting(1., root=75); _s = int(S0 * SR); mus[_s:_s + len(_x)] += _x * .9          # sting() trả về stereo
# — Bí mật 1: vòm mắt sáng viền: đàn hạc vuốt lên; tia lấp lánh trên đỉnh đầu: celesta ba nốt; con ngươi trượt theo Crumb: marimba —
M(T.gliss(75, 99, .5, .26, 'harp'), HIT['eyesGlow'][0] + .3, .9)
seq(celesta, (94, 98, 101), HIT['seam'][0], .1, .16, .3, d=.4)
for i, h in enumerate((8.05, 8.65, 9.25)): M(marimba(86 + 3 * i, .4), h + .01, .3, -.3 + .3 * i)
seq(lambda m, d: trumpet(m, d, mute=1), (79, 75), HIT['caught'] + .05, .16, .24, .2, d=.18)          # "bị bắt quả tang": trumpet bịt hai nốt đi xuống
# — Bí mật 2: Zip bay lùi = motif đảo ngược đi xuống (xylophone); bay tới = đi lên; lần lùi thứ hai nhỏ, ở dải cao (dưới lời) —
seq(xylo, MOTIF[::-1], HIT['back1'][0] + .02, .08, .42, .3, d=.25)
seq(glock, [m + 12 for m in MOTIF], HIT['fwd'][0], .07, .14, -.2, d=.3)
seq(glock, [m + 12 for m in MOTIF[::-1]], HIT['back2'][0], .07, .14, .3, d=.3)
M(T.whistle(700, 1500, .3, .9, .02), HIT['reach'], .08, 0)
# — Bí mật 3: đẩy vào mắt: đàn hạc vuốt lên dài; "1000s!": celesta; hình phản chiếu: làn mưa nốt toy piano lan từ giữa ra —
M(T.gliss(70, 101, HIT['dive'][1] - HIT['dive'][0], .26, 'harp', 1.1), HIT['dive'][0], .8)
strum(celesta, (87, 91, 94, 99), HIT['k1000'][0] + .03, .14, .8, .03)
rng = np.random.default_rng(10); RAIN = (87, 89, 91, 94, 96, 99, 101, 103)
for k in range(26):
    tk = HIT['refl'][0] + (HIT['refl'][1] - HIT['refl'][0]) * (k / 26) ** .8 + rng.uniform(0, .03)
    M(toypiano(int(rng.choice(RAIN)), .3), tk, .12 * (1 - .4 * k / 26), rng.uniform(-.7, .7))
for k in range(10): M(toypiano(int(rng.choice(RAIN[2:])), .25), HIT['wave'][0] + .6 + k * .1, .07, -.6 + .12 * k)   # làn sóng vẫy tay
M(T.gliss(99, 75, HIT['out'][1] - HIT['out'][0], .2, 'harp'), HIT['out'][0], .7)
# — Chụp → sổ: marimba chạy lên; đàn hạc vuốt; sticker; Zip lao vào trang: xylophone trượt xuống; lật trang —
seq(marimba, (75, 79, 82, 87, 91), HIT['snap3'] + .04, .07, .45, .2, ramp=.1)
M(T.gliss(82, 101, HIT['zoomIn'][1] - HIT['zoomIn'][0], .28, 'harp'), HIT['zoomIn'][0], .9)
M(T.gliss(97, 80, HIT['zoomOut'][1] - HIT['zoomOut'][0], .2, 'harp'), HIT['zoomOut'][0], .7)
strum(harp, (75, 79, 82, 87), HIT['zoomOut'][1], .35, .9); M(celesta(94, 1.0), HIT['stamp3'] + .02, .3, .3)
seq(xylo, (94, 91, 87, 82, 79), HIT['gulp'] + .02, .05, .35, .1, d=.2)
M(celesta(99, .8), HIT['mini'] + .02, .3, .4)
M(T.gliss(77, 101, .45, .3, 'harp'), HIT['flip'][0] + .02, .7)
# — Gag: Crumb xìu: trombone "wah-wah"; Zip bay lùi ra khung phải: motif ngược; "boo!": cú chặn cả dàn; giật bắn: còi trượt lên —
M(trombone(56, .55, 1., -3.), HIT['pout'][0] + .02, .45, .1)
seq(xylo, MOTIF[::-1], HIT['zipOut'][0] + .02, .08, .4, .6, d=.25)
for m in (60, 63, 67, 72): M(trumpet(m + 12, .35), HIT['boo'] + .01, .16, .1)
M(trombone(48, .35, 1.), HIT['boo'] + .01, .3, -.1); M(T.whistle(500, 1700, .32, 1., .02), HIT['jump'], .1, .2)
# — Chữ móc trở lại: hợp âm Mi giáng nhỏ; nốt dẫn Si giáng → Mi giáng ở 0,0 —
strum(pluck, (63, 67, 70, 75), HIT['recall'], .28, .8)
M(bassn(46, .3), DUR - BEAT / 2, .9)

# — cường độ theo cảnh (chuyển mềm 0,3 s) —
LEVEL = ((0, .82), (.25, .7), (HIT['startle'], .95), (L['L02']['t'] + .2, .74), (S0, .95), (S1 + .1, .82), (L['L04']['t'], .74), (HIT['ring'][0], .9), (L['L05']['t'], .74),
         (HIT['caught'], .95), (HIT['stamp1'] + .2, .72), (HIT['hush'][0], .5), (L['L07']['t'], 1.0), (L['L08']['t'], .76), (end('L08'), .95), (HIT['hover'][0], .82),
         (HIT['stamp2'] + .2, .85), (L['L09']['t'], .74), (end('L09'), 1.0), (L['L10']['t'], .78), (end('L10') + .1, 1.0), (L['L11']['t'], .76), (end('L11'), .95),
         (HIT['snap3'], 1.0), (HIT['stamp3'] + .3, .78), (HIT['gulp'], .95), (HIT['gulp'] + .5, .8), (HIT['flip'][0], .9), (L['L13']['t'], .72), (HIT['pout'][0], .85),
         (HIT['notice'], .9), (L['L15']['t'], .78), (HIT['boo'], 1.0), (HIT['giggle'][0], .9), (L['L16']['t'], .7), (end('L16'), .8))
tt = np.arange(len(mus)) / SR; lev = np.full(len(mus), LEVEL[0][1])
for (t, g), (_, g0) in zip(LEVEL[1:], LEVEL[:-1]): lev = np.where(tt >= t - .15, np.where(tt < t + .15, g0 + (g - g0) * (tt - t + .15) / .3, g), lev)
mus *= lev[:, None]


# ---------- tiếng động theo sự kiện ----------
fx = B['fx']
def roll(d, v=1.):                              # Rollo lăn viên tròn trên bờ xa: "rù rù" trầm rất nhỏ, nhịp theo vòng lăn
    tt = t_(d); return lp(brown(d), 220) * (.6 + .4 * np.sin(2 * np.pi * 3.2 * tt)) * np.minimum(1, np.minimum(tt, d - tt) / .3) * .5 * v
def hushroll(d, v=1.):
    tt = t_(d); return bp(noise(d), 1800, 6000) * (.5 + .5 * np.sign(np.sin(2 * np.pi * 22 * tt))) * np.minimum(1, tt / .1) * .05 * v
def deflate(v=1.):                              # xìu: "phù" xì hơi nhỏ (trombone "wah-wah" viết tay đi cùng)
    d = .45; tt = t_(d); return bp(noise(d), 500, 2500) * np.exp(-tt * 5) * .3 * v
def hoverhum(d, v=1.):                          # cánh chuồn chuồn rì rì khi đứng yên giữa trời: tiếng gió trầm, đập ~30 lần/giây, rất nhỏ
    tt = t_(d); x = lp(noise(d), 420) * (.55 + .45 * np.sin(2 * np.pi * 30 * tt)) * np.minimum(1, tt / .15) * np.minimum(1, (d - tt) / .2)
    return x * .5 * v
def raspberry(v=1.):                            # lè lưỡi "pbbt": răng cưa trầm rung nhanh
    d = .38; tt = t_(d); f = 120 * (1 - .15 * tt / d); ph = np.cumsum(f) / SR
    x = lp(2 * (ph % 1) - 1, 1600) * (.6 + .4 * np.sign(np.sin(2 * np.pi * 34 * tt))) * np.minimum(1, tt / .02) * np.minimum(1, (d - tt) / .08)
    return x * .3 * v
def tipfx(n, v=1.):                             # nhón chân: tiếng gỗ nhỏ cao, hai nốt luân phiên
    return mixl(T.block(91 + 3 * (n % 2), .2 * v), np.pad(T.blip(98 + 3 * (n % 2), .1 * v, .05), (int(.01 * SR), 0)))
SFX = {
    'titlepop': lambda e: mixl(T.bubble(1600, .5, .06, 2.4), np.pad(T._ting(mf(101), .5, .35), (int(.02 * SR), 0))),
    'wordpop': lambda e: mixl(T.boing(220 + 120 * e.get('n', 0), .35, .3, 2.4, 16.), np.pad(pop(.6) * .45, (int(.02 * SR), 0)), T.bubble(1300 + 500 * e.get('n', 0), .35, .05, 2.4)),
    'tiptoe': lambda e: tipfx(e.get('n', 0), e.get('v', 1.)),
    'peek': lambda e: mixl(T.blip(96 + 2 * e.get('n', 0), .28), np.pad(T.tink(.18), (int(.05 * SR), 0))),
    'zip': lambda e: mixl(T.zip_(e.get('d', .4), 700, 2800, .5) if e.get('up', 1) else T.zip_(e.get('d', .4), 2800, 700, .5), T.swish(e.get('d', .4), .25, 900, 4200, bool(e.get('up', 1)))),
    'startle': lambda e: mixl(T.boing(240, .35, .3, 2.4, 16.), T.whistle(600, 1400, .22, .07)),
    'bump': lambda e: mixl(thump(.5, 140) * .45, T.boing(160, .25, .2, 1.6, 12.)),
    'turn': lambda e: T.swish(.25, .16, 1400, 4200, True),
    'slots': lambda e: T.pops(3, .08, 84, .32),
    'zoom': lambda e: mixl(riser(.4, .8), T.whistle(420, 1250, .4, .12)),
    'logo': lambda e: T.sparkle(.5, .22, 91, 105, 6, 4, 'up'),
    'shine': lambda e: T.sparkle(.6, .26, 91, 105, 7, 2, 'up'),
    'sparkle': lambda e: T.sparkle(.5, .3, 93, 106, 6, 5, 'up'),
    'ring': lambda e: T.swell(e.get('d', .7), .28, 76, 100),
    'giggle': lambda e: T.giggle(4, .5 * e.get('v', 1.), e.get('m', 86), .1, 3),
    'roll': lambda e: roll(e.get('d', 2.), .8),
    'snap': lambda e: mixl(click(1., .25) * .8, np.pad(click(.8, .2) * .5, (int(.045 * SR), 0)), np.pad(T.sparkle(.45, .3, 93, 108, 6, 7, 'up'), (int(.06 * SR), 0))),
    'swipe': lambda e: T.swipe(e.get('d', .3), .32, True, e.get('lo', 1500), e.get('hi', 5500)),
    'slotstamp': lambda e: mixl(thump(.7, 120) * .55, hp(noise(.06), 1400) * env_exp(.06, .012) * .45, np.pad(T.ding(89 + 3 * e.get('n', 0), .35, .8), (int(.02 * SR), 0))),
    'hush': lambda e: hushroll(e.get('d', .5)),
    'jump': lambda e: mixl(T.boing(220, .4, .35, 2.6, 14.), T.swish(.35, .22, 800, 3800, True)),
    'flop': lambda e: mixl(thump(.55, 130) * .5, T.splat(.22, 2)),
    'hover': lambda e: hoverhum(e.get('d', 1.5), .7),
    'hop': lambda e: mixl(T.boing(280, .35, .25, 2.4, 16.), T.swish(.3, .18, 900, 3600, True)),
    'dive': lambda e: mixl(riser(e.get('d', 1.7), .45), T.swish(e.get('d', 1.7), .22, 500, 4200, True, .4, .3)),
    'facets': lambda e: T.pops(12, .07, 96, .16),
    'pop': lambda e: mixl(T.bubble(900, .45, .08, 2.6), np.pad(T.ding(94, .3, .7), (int(.03 * SR), 0))),
    'popup': lambda e: mixl(T.boing(200, .4, .35, 2.4, 14.), T.swish(.35, .2, 700, 3200, True)),
    'reflect': lambda e: T.pops(10, .09, 98, .14),
    'wave': lambda e: T.pops(8, .1, 91, .2, True),
    'raspberry': lambda e: raspberry(.9),
    'zoomback': lambda e: T.swish(e.get('d', .9), .3, 4200, 500, False, .4, .3),
    'zoomin': lambda e: mixl(T.swish(e.get('d', .3), .42, 600, 5200, True, .15, .25), riser(e.get('d', .3), .4)),
    'zoomout': lambda e: mixl(T.swish(e.get('d', .35), .3, 500, 3800, False, .25, .2), np.pad(T.paper(.3, .35, 5, 4), (int(.1 * SR), 0))),
    'page': lambda e: mixl(T.paper(.35, .45, 5, 1), T.bubble(520, .3, .09)),
    'stamp': lambda e: mixl(thump(.8, 110) * .7, hp(noise(.07), 1200) * env_exp(.07, .012) * .6),
    'ding': lambda e: T.ding(e.get('m', 88), e.get('v', .4), .7),
    'count': lambda e: mixl(T.blip(84 + 3 * e.get('n', 0), .35), T.block(91 + 2 * e.get('n', 0), .25)),
    'gulp': lambda e: mixl(T.paper(.3, .45, 5, 2), T.boing(170, .45, .4, 2.2, 14.), np.pad(T.bubble(420, .35, .12, 1.4), (int(.08 * SR), 0))),
    'pops': lambda e: T.pops(e.get('n', 6), e.get('step', .035), e.get('m', 84), e.get('v', .5)),
    'flip': lambda e: mixl(T.paper(e.get('d', .5), .5, 7, 3), T.swish(e.get('d', .5), .22, 700, 3200, True)),
    'swish': lambda e: T.swish(e.get('d', .45), e.get('v', .4), e.get('lo', 350), e.get('hi', 2600), e.get('up', True)),
    'deflate': lambda e: deflate(.8),
    'huh': lambda e: mixl(T.boing(300, .3, .22, 2.0, 12.), np.pad(T.blip(86, .3), (int(.1 * SR), 0)), np.pad(T.blip(91, .3), (int(.2 * SR), 0))),
    'tap': lambda e: mixl(T.tink(.35), T.block(88, .3)),
    'boing': lambda e: mixl(T.boing(180, .55, .45, 2.8, 16.), T.surprise(.35)),
    'scurry': lambda e: T.scurry(e.get('d', 1.4), .45, 91, 4),
    'land': lambda e: mixl(thump(.45, 170) * .35, T.plip(1100, .35)),
    'recall': lambda e: mixl(SFX['titlepop'](e), SFX['wordpop']({'n': 0}), np.pad(SFX['wordpop']({'n': 1}), (int(.12 * SR), 0))),
}
missing = sorted({e['type'] for e in EV} - SFX.keys())
if missing: sys.exit(f'mix.py: no sound for event types {missing}')
VERB = {'zoom': .3, 'titlepop': .3, 'ding': .4, 'flip': .3, 'page': .3, 'swipe': .25, 'count': .45, 'sparkle': .4, 'shine': .4, 'pop': .3, 'slotstamp': .3, 'reflect': .4}
snd = np.zeros(NW)
for e in EV:
    x = SFX[e['type']](e); add(fx, x, e['t'], 1., e.get('pan', 0))
    if e['type'] in VERB: s0 = int(e['t'] * SR); k = min(len(x), NW - s0); snd[s0:s0 + k] += x[:k] * VERB[e['type']]
fx += T.verb(snd, 1.3) * .35


# ---------- vòng lặp: phần dư sau 44 s cộng vào đầu phim ----------
for k in ('mus', 'fx'):
    b = B[k]; tail = b[N0:].copy(); b[:len(tail)] += tail; B[k] = b[:N].copy()
mus, fx = B['mus'], B['fx']


# ---------- nền: bờ ao buổi sáng (nước vỗ rất nhỏ, ếch xa "ộp" ở chỗ không có lời, không có trong kính phủ khung và trong sổ) ----------
amb = B['amb']
d = DUR; tt = t_(d)
add(amb, lp(brown(d), 260) * (.8 + .2 * np.sin(2 * np.pi * .23 * tt)) * np.minimum(1, tt / .05) * .05, 0, 1., 0)
def croak(v=1., f=150):
    d = .22; tt = t_(d); x = np.sin(2 * np.pi * f * tt * (1 - .2 * tt / d)) * (.5 + .5 * np.sign(np.sin(2 * np.pi * 26 * tt)))
    return lp(x, 900) * np.minimum(1, tt / .01) * np.exp(-tt * 6) * .3 * v
rng = np.random.default_rng(10)
t0 = .8
while t0 < DUR - .5:
    if not speaking(t0, .2) and not (HIT['dive'][0] - .2 < t0 < HIT['out'][1]) and not (HIT['zoomIn'][0] - .2 < t0 < HIT['flip'][1]):
        add(amb, croak(.5, rng.uniform(130, 170)), t0, 1., rng.uniform(-.8, .8))
    t0 += rng.uniform(2.2, 3.6)


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
for name, a, b in (('móc', 0, 3.8), ('kính', 3.8, 17.7), ('mắt kép', 17.7, 28.4), ('sổ', 28.4, 32.85), ('gag', 32.85, 44)):
    i, j = int(a * SR), int(b * SR)
    print(f'{name:7s}', '  '.join(f'{k}={20 * np.log10(max(rms(B[k][i:j]), 1e-9)):6.1f}' for k in ('mus', 'fx', 'amb', 'vox')), 'dBFS rms')
print('out/mix.wav', f'{len(mix) / SR:.2f} s')
