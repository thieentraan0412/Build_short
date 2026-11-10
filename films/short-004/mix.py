"""Âm thanh của SHORT-004 → out/mix.wav (48 kHz stereo): nhạc theo từng cảnh ("Ant Parade": ban kèn diễu hành đồ chơi, MUSIC.md)
trên lưới 120 BPM, nhạc hiệu chung, tiếng động theo events.json, nền vườn, giọng.
python mix.py   (cần timeline.json + voice/*.wav từ tools/lines.mjs, core/tts/tts.py và _shared/voicefx.py, events.json từ core/render/events.mjs)
Nhạc cụ và nhạc hiệu: _shared/audio/band.py; tiếng động hoạt hình: _shared/audio/toon.py. Không dùng mẫu âm thanh của bên thứ ba.
Phim phát vòng lặp: kính ở cảnh kết nở ra khung đầu; đuôi tiếng vượt quá 52 s được gấp về đầu phim; mép đầu file có fade-in 20 ms."""
import os, sys, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio')); sys.path.insert(0, os.path.join(LIB, '_shared', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, whoosh, thump, ding, pop, click, step, compress, limit, add
from band import fade, mf, pluck, marimba, bassn, kick, clap, hat, bell, horn, pad, riser, glide, jingle
from band import pizz, xylo, tuba, tom, celesta, reed, snare, banjo, triad, secret, MIN   # màu "Ant Parade" (MUSIC.md)
import toon as T

TL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))
EV = json.load(open(os.path.join(HERE, 'events.json'), encoding='utf-8'))['ev']
HIT = TL['hit']
BEAT = 60 / TL['bpm']; BAR = BEAT * 4; DUR = TL['dur']; N = int((DUR + .05) * SR); N0 = int(DUR * SR)
NW = N + int(2.5 * SR)
at = lambda bar, beat=0: (bar * 4 + beat) * BEAT
rng = np.random.default_rng(23)
B = {k: np.zeros((NW if k in ('mus', 'fx') else N, 2)) for k in ('mus', 'fx', 'amb', 'vox')}
def mixl(*xs):
    n = max(len(x) for x in xs); return sum(np.pad(x, (0, n - len(x))) for x in xs)
glock = lambda m, d=.6: T._ting(mf(m), d, 1.) * .5


# ---------- nhạc: "Ant Parade" — ban kèn diễu hành đồ chơi; khác SHORT-001 (tổ khúc), 002 (calypso), 003 (swing) ----------
# v3 (nhạc nền sinh động, MUSIC.md): lớp nhịp theo cảnh (_shared/audio/groove.py) đổi điệu ở mỗi cảnh: diễu hành → polka khi Crumb bật lên →
# nhạc hiệu → diễu hành ra mắt → rải đàn hạc khi hạt mùi bay vào → shuffle "tap, tap" → thám tử rón rén → lặng → rải glockenspiel khi
# đường mùi sáng → diễu hành dồn theo đường mùi → đồng quê "boom-chick" ở trại rệp → polka "TINY COWS" → shuffle ở sổ → nửa nhịp →
# diễu hành → rón rén theo mùi tới cây kem → khựng → nửa nhịp dưới câu hỏi kết → diễu hành về khung đầu.
# Lớp nhịp thưa dưới lời, chen câu đáp vào khoảng trống, có dấu ở chỗ đổi cảnh. Điểm nhấn của tập đặt tay như trước.
from groove import Groove
mus = B['mus']
REST = ((HIT['rest'][0], HIT['rest'][1] - .02), (HIT['freeze'][0] + .05, HIT['freeze'][1] - .05), (HIT['splat'] + .1, HIT['laugh'] - .02))   # khoảng lặng trước đáp án; khựng khi Rollo lăn qua; khựng khi kem đổ
def M(x, t, g=1., pan=0.):
    if any(a - .02 <= t < b - .02 for a, b in REST): return
    add(mus, x, t, g, pan)
def seq(inst, ns, t0, step, g=1., pan=0., d=None, ramp=0.):
    for i, n in enumerate(ns):
        if n: M(inst(n, d) if d else inst(n), t0 + i * step, g * (1 + ramp * i), pan)
def strum(inst, ns, t, g=.4, d=None, spread=.012):
    for k, n in enumerate(ns): M(inst(n, d) if d else inst(n), t + k * spread, g, -.3 + .6 * k / max(1, len(ns) - 1))
def cymbal(t, g=.25, br=4500): M(T.cymbal(1.6, 1., br), t, g, .15)
def mel(t0, notes, g=.32):                      # giai điệu glockenspiel viết tay: [(phách tính từ t0, midi)]
    for off, n in notes: M(glock(n, .5), t0 + off * BEAT, g, .25)
LINES = TL['lines']
ask = next(l for l in LINES if l['id'] == 'L13')['t']; no = next(l for l in LINES if l['id'] == 'L14')['t']

# — lớp nhịp theo cảnh (v3): bảng ở MUSIC.md —
AVOID = [(HIT['sniff'][0] - .05, HIT['sniff'][1] + .3), (HIT['pop'] - .05, at(2)), (HIT['scent'] - .05, HIT['scent'] + .7), (HIT['taps'][0] - .05, HIT['taps'][1] + .3),
         (HIT['nope'] + .4, HIT['nope'] + 1.0), (HIT['trail'] - .05, HIT['trail'] + .7), (HIT['aphidTap'][0] - .05, HIT['drop'] + .7), (HIT['cows'], HIT['cows'] + .9),
         (HIT['spindle'][0] - .05, HIT['spindle'][1]), (HIT['stamp'][0] - .05, HIT['stamp'][2] + .5), (ask + 1.4, ask + 1.8), (no + .8, no + 1.4), (HIT['lift'][0], HIT['laugh'] + .4)]
# Sound Design Plan (11/2026, QUALITY.md §4, SOUND-PLAN.md): mỗi cảnh một phong cách nhạc, một BPM, một nhạc cụ hát chính, một cách chuyển.
# Giữ 120 BPM ở móc và "Ants can!" (nốt viết tay theo lưới phim), ở đoạn theo đường mùi (glockenspiel viết tay theo phách) và ở cảnh về khung đầu.
G = Groove(M, BEAT, LINES, seed=4, avoid=AVOID, plan=True)
G.sec('móc · diễu hành', 0, HIT['pop'], 'march', 'F', 'F', bass='tuba', comp='pizz', lead='glock', kit='march', energy=2, cue=False,
      bpm=120, mood='playful', arc='open', what='Vụn bánh nhón chân, ngón tay "ngửi": "Could you smell with your fingers?"', emo='tò mò',
      why='Ban kèn diễu hành đồ chơi là màu của tập; pizzicato nhón chân theo vụn bánh, kèn dăm "khịt khịt" (viết tay).')
G.sec('Ants can! · polka', HIT['pop'], at(1, 3), 'polka', 'F', 'F F,C', bass='tuba', comp='pizz', lead='xylo', kit='march', energy=3, cue=False, fills=False,
      bpm=120, mood='funny', arc='open', what='Crumb bật lên: "Ants can! Well, sort of!"', emo='bất ngờ, hài hước',
      why='Cả ban đánh một phát khi Crumb bật lên, polka "oom-pah" vui cho câu "sort of!", glockenspiel đi lên (viết tay).')
G.mark('kính nở', at(1, 3), at(2), 'break', 'F', 'glock', 2, mood='magic', arc='open', what='Kính nở ra', emo='háo hức', why='Glockenspiel chạy lên vào nhạc hiệu.')
G.mark('nhạc hiệu', at(2), at(3), 'jingle', 'C', 'horn marimba bell', 3, mood='epic', arc='open', what='"Big secrets of tiny bugs!" – logo', emo='phấn khích',
       why='Nhạc hiệu 2 s của kênh (tập trước 11/2026), nhạc nền nhường hẳn.')
G.sec('Crumb ra mắt · diễu hành', at(3), HIT['zoom'], 'march', 'F', 'F,Bb C,F', bass='tuba', comp='pizz', lead='trumpet', kit='march', energy=2,
      bpm=112, mood='epic', arc='build', what='Crumb bước ra: "This is Crumb, the ant!" – "Let\'s zoom in!"', emo='tự hào, háo hức',
      why='Màn ra mắt như duyệt binh: diễu hành 112 BPM theo bước chân Crumb, trumpet thổi một câu chào sau tên Crumb.')
G.sec('hạt mùi · rải đàn hạc', HIT['zoom'], HIT['lensOut'], 'float', 'F', 'F', bass='bassn', arp='harp', lead='flute', energy=1,
      bpm=100, mood='magic', arc='build', what='Trong kính: hạt mùi bay vào râu: "Ants sniff with their antennae!"', emo='kỳ diệu, tò mò',
      why='Chậm lại 100 BPM, đàn hạc rải như hạt mùi lơ lửng, glockenspiel chơi mô-típ bí mật (viết tay), sáo đáp.')
G.sec('tap, tap · shuffle', HIT['lensOut'], at(8), 'skip', 'F', 'F C', bass='tuba', comp='pluck', lead='xylo', kit='toy', energy=2,
      bpm=116, mood='playful', arc='build', what='Hai chú kiến chạm râu: "Tap, tap, hello!"', emo='vui, thân thiện',
      why='Shuffle ukulele 116 BPM nhảy chân sáo; mỗi cú "tap" một nốt glockenspiel và xylophone (viết tay).')
G.sec('thám tử · rình rập', at(8), HIT['nope'], 'sneak', 'Dm', 'Dm A7', bass='bassoonlo', comp='pizz', lead='bassoon', kit='wood', energy=1,
      bpm=96, mood='suspense', arc='build', what='Crumb đội mũ thám tử: "So, they follow a map?"', emo='tò mò, hồi hộp',
      why='Rình rập thám tử 96 BPM: bassoon trầm làm bass và giai điệu dò dẫm, mõ gỗ, Rê thứ.')
G.sec('Nope · lặng', HIT['nope'], HIT['trail'], 'break', 'Dm', 'Dm', cue=False, mood='suspense', arc='build', what='"Nope!" – khoảng lặng trước đáp án',
      emo='bất ngờ', why='Tuba "bwomp" đi xuống sau "Nope!" rồi lặng một nhịp để đáp án bật ra.')
G.sec('đường mùi sáng · lấp lánh', HIT['trail'], HIT['slide'][0], 'twinkle', 'Dm', 'Dm', bass='tuba', arp='glock', lead='celesta', kit='tri', energy=1, cue=False,
      bpm=108, mood='magic', arc='build', what='Đường mùi sáng lên: "They follow a smell trail!"', emo='kỳ diệu, vỡ lẽ',
      why='Hộp nhạc lấp lánh 108 BPM, triangle; mô-típ bí mật trên glockenspiel (viết tay) đúng lúc đường mùi sáng.')
G.sec('theo đường mùi · phiêu lưu', HIT['slide'][0], HIT['slide'][1], 'quest', 'Dm', 'Dm,Bb C,F', bass='tuba', comp='pizz', arp='strings', lead='glock', kit='tom', energy=3, fills=False,
      bpm=120, mood='magic', arc='build', what='Kính trượt dọc đường mùi; Rollo lăn qua, khựng một chút', emo='phiêu lưu, hồi hộp vui',
      why='Phiêu lưu nước kiệu: trống tom "da-da-dum", dàn dây spiccato, glockenspiel hát giai điệu viết tay theo phách nên giữ 120 BPM.')
G.mark('bò lên thân cây', HIT['slide'][1], at(14), 'break', 'F', 'glock', 2, mood='magic', arc='build', what='Đường mùi bò lên thân cây', emo='háo hức',
       why='Glockenspiel chạy lên và riser (viết tay) dẫn vào trại rệp.')
G.sec('trại rệp · đồng quê', at(14), HIT['cows'], 'country', 'C', 'C G', bass='tuba', comp='banjo', arp='banjo', lead='reed', kit='toy', energy=2,
      bpm=112, mood='happy', arc='build', what='Crumb gõ nhẹ con rệp, giọt ngọt rơi: "Some ants keep tiny cows!"', emo='vui, ngạc nhiên',
      why='Trại rệp là một nông trại tí hon: đồng quê "boom-chick" 112 BPM, banjo cuộn, clarinet hát như harmonica; giọt ngọt là mô-típ bí mật (viết tay).')
G.sec('TINY COWS · polka', HIT['cows'], HIT['snap'], 'polka', 'C', 'G C G', bass='tuba', comp='accordion', lead='xylo', kit='clap', energy=3,
      bpm=132, mood='funny', arc='peak', what='"TINY COWS!" – tuba "moo", Spindle ló ra', emo='phấn khích, buồn cười',
      why='Cao trào hài của tập: polka nhanh nhất (132 BPM), accordion và vỗ tay, tuba "moo" tí hon (viết tay).')
G.sec('chụp sticker', HIT['snap'], HIT['stamp'][0], 'break', 'F', 'F', cue=False, mood='suspense', arc='end', what='Kính chụp, máy lao xuyên kính vào sổ',
      emo='bất ngờ', why='Marimba chạy lên (viết tay) là tiếng "chụp" của ban nhạc kênh.')
G.sec('sổ · ukulele nắng', HIT['stamp'][0], ask, 'sunny', 'F', 'F F,Bb F', bass='tuba', comp='pluck', lead='toypiano', kit='toy', energy=2, cue=False,
      bpm=116, mood='happy', arc='end', what='Ba sticker dán vào sổ; Albie: "Six legs? In you go!"', emo='vui, tự hào',
      why='Ukulele quạt 116 BPM cho ba cú dán sticker; piano đồ chơi đáp, không bass dưới giọng trầm của Albie.')
G.sec('Can I hold the lens? · nửa nhịp', ask, at(22), 'sway', 'F', 'F Bb', bass='tuba', comp='marimba', lead='vibes', kit='brush', energy=1,
      bpm=100, mood='cute', arc='end', what='Crumb: "Can I hold the lens?" – Miss Loupe: "Not yet!"', emo='dễ thương, nài nỉ',
      why='Nửa nhịp 100 BPM, marimba và vibraphone mềm như lời nài nỉ của Crumb.')
G.sec('về kết · ragtime', at(22), at(23), 'stride', 'F', 'F,C', bass='tuba', comp='piano', lead='mute', kit='march', energy=2,
      bpm=112, mood='funny', arc='end', what='Crumb ngửi thấy một mùi mới', emo='tinh nghịch',
      why='Ragtime piano 112 BPM, trumpet bịt "wah" như một cái nháy mắt: gag sắp tới.')
G.sec('theo mùi tới cây kem · rón rén', at(23), HIT['lift'][0], 'tiptoe', 'F', 'F C', bass='pizzbass', comp='pizz', lead='flute', kit='wood', energy=1,
      bpm=100, mood='suspense', arc='end', what='Crumb theo mùi tới cây kem: "I can carry it!"', emo='hồi hộp, buồn cười',
      why='Rón rén 100 BPM theo từng bước Crumb; sáo hỏi nhỏ giữa các bước.')
G.sec('nhấc · đổ · khựng', HIT['lift'][0], HIT['laugh'], 'break', 'F', 'F', cue=False, mood='funny', arc='end', what='Crumb nhấc cây kem… đổ bẹp',
      emo='bất ngờ, hài', why='Khựng nhạc khi kem đổ để tiếng "bẹp!" vang rõ.')
G.sec('cười · câu hỏi kết', HIT['laugh'], HIT['loopIris'][0], 'sway', 'F', 'F', bass='tuba', comp='marimba', lead='celesta', kit='brush', energy=1, cue=False,
      bpm=104, mood='happy', arc='end', what='Mọi người cười: "What can YOU smell right now?"', emo='vui, mời gọi',
      why='Nhẹ lại dưới câu hỏi kết để trẻ nghe rõ; celesta cười theo.')
G.sec('về khung đầu · diễu hành', HIT['loopIris'][0], DUR, 'march', 'F', 'F', bass='tuba', comp='piano', lead='glock', kit='march', energy=3, fills=False, reprise=True,
      bpm=120, mood='playful', arc='end', what='Vòng sóng về khung đầu', emo='vui',
      why='Diễu hành của móc trở lại ở 120 BPM cho vòng lặp, đệm piano và năng lượng đầy hơn mở đầu.')
G.answer(at(1), HIT['taps'][0], HIT['nope'] + .45, HIT['drop'], HIT['cows'] + .05, HIT['spindle'][0], ask + 1.45, no + .85)   # câu đáp viết tay bên dưới
G.play(); os.makedirs(os.path.join(HERE, 'out'), exist_ok=True); G.save(os.path.join(HERE, 'out', 'music.json'), color='"Ant Parade" (Fa trưởng)')
F_, BB, C_, DM, AM, G_ = triad(65), triad(58, inv=1), triad(60), triad(62, MIN), triad(57, MIN), triad(55, inv=1)

# — Hook 0–3,5 s: nhịp diễu hành chạy từ giây 0 (lớp nhịp); vụn bánh nhón chân; ngón tay "ngửi"; Crumb bật lên = cú đánh của cả ban —
M(kick(.8), 0., .6); M(T._ting(mf(96), .5), 0., .16, .4)
for i in range(4): M(pizz((53, 57, 60, 57)[i], .2), i * BEAT / 2, .55, -.1)                # bước nhón chân của vụn bánh
for t in HIT['sniff']: M(reed(60, .25), t, .3, .3); M(reed(64, .2), t + .12, .25, .3)         # "khịt khịt" (kèn dăm nhỏ)
tp = HIT['pop']; M(kick(), tp, 1.0); M(tuba(41, .5), tp, .9); strum(xylo, [65, 69, 72, 77], tp, .45); cymbal(tp, .25, 5000)
for n in (72, 76, 79): M(horn(n, .3, .7), tp, .3)
mel(at(1), [(0, 77), (1, 81), (2, 84), (2.5, 81)])                                           # "Ants can! Well, sort of!": glockenspiel đi lên
seq(glock, (72, 74, 77, 79), at(1, 3), BEAT / 4, .4, .2, ramp=.08)                          # kính nở: chạy lên vào nhạc hiệu
J = jingle(); s = int(at(2) * SR); e = min(N, s + len(J)); mus[s:e] += J[:e - s] * .9          # nhạc hiệu 2 s, giống hệt mọi tập (v3: LEVEL .45 → .68 để giữ đúng độ to cũ khi nhạc chung đầy hơn)

# — Bí mật 1 (6–16 s), Fa: mô-típ bí mật khi hạt mùi bay vào râu; "tap, tap" —
M(riser(.5, .7), HIT['zoom'] - .45, .3)
secret(M, glock, 77, HIT['scent'], .18, .4, .3)                                             # mô-típ bí mật: Fa–La–Đô
M(pad([65, 69, 72, 76], 2.3), HIT['scent'], .35)
for i, t in enumerate(HIT['taps']): M(glock((84, 88)[i], .7), t, .4, .3); M(xylo((72, 76)[i]), t, .3, -.2)   # tap, tap

# — Bí mật 2 (16–28 s), Rê thứ: "Nope!" → lặng → đường mùi sáng lên → đi theo đường mùi (lớp nhịp: diễu hành dồn; glockenspiel hát viết tay) —
M(tuba(45, .5, .7, bend=-4), HIT['nope'] + .45, .6)                                          # "bwomp" sau "Nope!"
tr = HIT['trail']; secret(M, glock, 77, tr, .15, .42, .3); M(pad([62, 65, 69, 74], 2.0), tr, .38); M(bell(89, .4, 1.2), tr + 1.5, .3)   # đáp án: mô-típ bí mật, pad Rê thứ sáng
mel(HIT['slide'][0], [(0, 74), (.5, 77), (1, 81), (2, 79), (3, 77), (4, 74), (4.5, 77), (5, 81), (6, 84)], .29)   # đi theo đường mùi
seq(glock, (74, 77, 81, 86), HIT['slide'][1] - .1, BEAT / 4, .35, .2, ramp=.08)              # đường mùi bò lên thân cây
M(riser(.6, .7), at(13, 3) - .1, .3)

# — Bí mật 3 (28–36 s), Đô trưởng (lớp nhịp: đồng quê "boom-chick" → polka); giọt ngọt = mô-típ bí mật; TINY COWS! = tuba "moo" —
for t in HIT['aphidTap']: M(glock(91, .5), t, .3, .2)
secret(M, xylo, 72, HIT['drop'], .14, .45, .2, last=12)                                     # giọt ngọt: Đô–Mi–Sol–Đô
M(tuba(36, .9, .75, bend=-2), HIT['cows'] + .05, .55)                                        # "moo" tí hon
M(celesta(91, .8), HIT['spindle'][0], .3, .6); M(celesta(86, .8), HIT['spindle'][0] + .18, .25, .6)   # Spindle ló ra
seq(marimba, (72, 74, 76, 79, 84), HIT['snap'] + .04, .07, .5, .2, ramp=.1)                  # v2: "chụp": marimba chạy lên (ban nhạc kênh)
M(T.gliss(79, 100, HIT['zoomIn'][1] - HIT['zoomIn'][0], .28, 'harp'), HIT['zoomIn'][0], .9)
M(T.gliss(96, 79, HIT['zoomOut'][1] - HIT['zoomOut'][0], .2, 'harp'), HIT['zoomOut'][0], .7)

# — Sổ (36–46 s), Fa: ba sticker; dấu hỏi glockenspiel; "Not yet!" (lớp nhịp: shuffle, không bè trầm dưới giọng trầm của Albie → nửa nhịp → diễu hành) —
for i, (t, ch) in enumerate(zip(HIT['stamp'], ((65, 69, 72, 77), (67, 70, 74, 79), (60, 64, 67, 72)))):
    strum(pizz, ch, t, .45, .3); M(kick(.6), t, .5); M(glock(ch[-1] + 12, .6), t + .02, .25, .3)
seq(glock, (72, 76, 79, 84), ask + 1.45, .08, .3, .3)                                         # "Can I hold the lens?": dấu hỏi đi lên
M(tuba(41, .5, .6, bend=-3), no + .85, .45)                                                  # "Not yet!": Crumb xìu xuống

# — Kết (46–52 s): rón rén theo mùi (lớp nhịp) → "I can carry it!" → trống dồn khi nhấc → kem đổ: khựng → bật cười: hợp âm Fa → vòng lặp —
for i in range(10): M(snare(.3 + .06 * i, .1), HIT['lift'][0] + i * .06, .5, -.1)              # trống dồn khi Crumb gồng nhấc cây kem
for n in (72, 77, 81): M(horn(n, .35, .7), HIT['lift'][1] - .05, .3)                          # kèn đồ chơi "ta-da!" (sắp đổ…)
tl = HIT['laugh']; strum(pluck, (65, 69, 72, 77), tl, .55, .8, .02); M(tuba(41, .6), tl, .8); M(kick(), tl, .8); cymbal(tl, .2, 5000)   # v2: ngắn lại để câu hỏi kết rõ
M(riser(.7, .7), HIT['loopIris'][0], .3)

# — cường độ theo cảnh (chuyển mềm 0,3 s) —
LEVEL = ((0, .62), (at(2), .68), (at(3), .85), (HIT['scent'], .8), (HIT['lensOut'], .85), (at(8), .8), (HIT['slide'][0], 1.), (at(14), .85), (HIT['snap'], 1.0), (at(18), .8), (44., .7),   # v2: dâng ở cú chụp, ở tiếng cười; hạ dưới câu hỏi kết
         (at(23), .85), (HIT['laugh'], 1.0), (50.5, .72), (HIT['loopIris'][0], .85))
tt = np.arange(len(mus)) / SR; lev = np.full(len(mus), LEVEL[0][1])
for (t, g), (_, g0) in zip(LEVEL[1:], LEVEL[:-1]): lev = np.where(tt >= t - .15, np.where(tt < t + .15, g0 + (g - g0) * (tt - t + .15) / .3, g), lev)
mus *= lev[:, None]


# ---------- tiếng động theo sự kiện ----------
fx = B['fx']
def steps(d, n, v=1.):                          # bước chân bé xíu: tiếng "tách" nhỏ, cao, xen kẽ
    x = np.zeros(int(d * SR))
    for k in range(n):
        s = int(k * d / n * SR); b = bp(noise(.03), 2500, 7000) * env_exp(.03, .004) * (.5 + .3 * (k % 2)); x[s:s + len(b)] += b[:len(x) - s]
    return x * .35 * v
def sniff(v=1.):                                # "khịt": hơi thở hút vào ngắn, lọc dải
    tt = t_(.22); return bp(noise(.22), 900, 4000) * np.sin(np.pi * tt / .22) ** 2 * (1 + tt / .22) * v * .3
def buzzer(): tt = t_(.32); return fade(lp(np.sign(np.sin(2 * np.pi * 140 * tt)), 1600) * .3, .005, .04)
def roll(d):                                    # viên tròn của Rollo
    x = lp(brown(d), 220) * .5 * np.minimum(1, t_(d) / .4) * np.minimum(1, (d - t_(d)) / .4)
    for k in range(int(d / .42)):
        s = int((k * .42 + .1) * SR); b = click(.55, .5) * .5; x[s:s + len(b)] += b[:len(x) - s]
    return x * .7
def stampN(n):
    return mixl(thump(.8, 95 + 18 * n) * .7, hp(noise(.07), 1200) * env_exp(.07, .012) * .6, T._ting(mf((79, 84, 88)[n]), .35, .35))
SFX = {
    'titlepop': lambda e: mixl(T.bubble(1600, .5, .06, 2.4), np.pad(T._ting(mf(103), .5, .35), (int(.02 * SR), 0))),
    'steps': lambda e: steps(e.get('d', 1.), e.get('n', 8), e.get('v', 1.)),
    'sniff': lambda e: sniff(e.get('v', 1.)),
    'popup': lambda e: mixl(T.boing(200, .5, .4, 2.4, 14.), np.pad(pop(.6) * .5, (int(.03 * SR), 0))),
    'blip': lambda e: T.blip(e.get('m', 88), .3),
    'swipe': lambda e: T.swipe(e.get('d', .3), .32, True, e.get('lo', 1500), e.get('hi', 5500)),
    'swell': lambda e: mixl(T.swell(.5, .55, 76, 100), T.revcymbal(.5, .22)),
    'swish': lambda e: T.swish(e.get('d', .45), e.get('v', .4), e.get('lo', 350), e.get('hi', 2600), e.get('up', True)),
    'swirl': lambda e: mixl(T.swirl(e.get('d', .5), .45, 4, 800, 3200), T.gliss(84, 100, e.get('d', .5) * .8, .3, 'ting')),
    'badge': lambda e: mixl(T.bubble(600 + 120 * e['n'], .45, .08), np.pad(T.ding((84, 88, 91)[e['n'] - 1], .4, .8), (int(.03 * SR), 0))),
    'zoom': lambda e: mixl(riser(.6, 1.), T.whistle(420, 1250, .55, .15)),
    'scent': lambda e: mixl(T.sparkle(e.get('d', 2.) * .5, .35, 88, 103, 8, 3, 'up'), np.pad(T.sparkle(.8, .25, 91, 108, 6, 5), (int(.9 * SR), 0))),
    'swishout': lambda e: T.swish(.5, .45, 400, 2800, False),
    'tap': lambda e: mixl(click(.6, .4) * .5, T._ting(mf(e.get('m', 91)), .4, .35)),
    'whoosh': lambda e: whoosh(e.get('d', .4), e.get('v', .5)),
    'paper': lambda e: T.paper(.3, .4, 4, 2),
    'buzzer': lambda e: buzzer(),
    'reveal': lambda e: mixl(bell(84, .8), bell(91, .5), np.pad(T.sparkle(.7, .35, 91, 108, 7, 2, 'up'), (int(.05 * SR), 0))),
    'glide': lambda e: T.swish(e.get('d', 5.), .18, 300, 1800, True, .5, .5),
    'roll': lambda e: roll(e.get('d', 1.8)),
    'freeze': lambda e: mixl(T.blip(91, .3), np.pad(T.blip(84, .25), (int(.12 * SR), 0))),
    'climb': lambda e: mixl(T.gliss(72, 96, .45, .35, 'harp'), T.swish(.5, .25, 600, 3000, True)),
    'drop': lambda e: mixl(T.plip(900, .45), np.pad(T.sparkle(.5, .3, 91, 103, 4, 8), (int(.04 * SR), 0))),
    'sip': lambda e: mixl(glide(900, 380, .3, .25), bp(noise(.3), 600, 2200) * np.sin(np.pi * t_(.3) / .3) * .12),
    'pops': lambda e: T.pops(e.get('n', 6), e.get('step', .035), e.get('m', 84), e.get('v', .5)),
    'petals': lambda e: mixl(T.gliss(72, 96, .45, .45, 'harp'), T.swirl(.5, .3, 4, 700, 2800)),
    'page': lambda e: mixl(T.paper(.35, .45, 5, 1), T.bubble(520, .3, .09)),
    'stamp': lambda e: stampN(e.get('n', 0)),
    'lensiris': lambda e: mixl(T.swirl(.5, .45, 6, 900, 3600), T.sparkle(.45, .35, 91, 108, 6, 9, 'up')),
    'windup': lambda e: T.windup(e.get('d', .5), .3),
    'wobble': lambda e: T.wobble(110, .6, .3, 7, .2),
    'fall': lambda e: T.whistle(1400, 500, e.get('d', .35), .25),
    'splat': lambda e: T.splat(.6, 3),
    'tink': lambda e: T.tink(.35),
    'wordpop': lambda e: mixl(T.boing(220 + 120 * e.get('n', 0), .35, .3, 2.4, 16.), np.pad(pop(.6) * .45, (int(.02 * SR), 0)), T.bubble(1300 + 500 * e.get('n', 0), .35, .05, 2.4)),
    'snap': lambda e: mixl(click(1., .25) * .8, np.pad(click(.8, .2) * .5, (int(.045 * SR), 0)), np.pad(T.sparkle(.45, .3, 93, 108, 6, 7, 'up'), (int(.06 * SR), 0))),
    'zoomin': lambda e: mixl(T.swish(e.get('d', .3), .42, 600, 5200, True, .15, .25), riser(e.get('d', .3), .4)),
    'zoomout': lambda e: mixl(T.swish(e.get('d', .35), .3, 500, 3800, False, .25, .2), np.pad(T.paper(.3, .35, 5, 4), (int(.1 * SR), 0))),
    'recall': lambda e: SFX['titlepop'](e) * .6,                 # chữ móc trở lại giữa câu hỏi kết: một tiếng "ting" nhỏ ở dải cao
    'boing': lambda e: T.boing(e.get('f0', 150), .5, .3 * e.get('v', .5) / .5, 2.2, 14.),
    'squeak': lambda e: mixl(glide(1400, 2200, .18, .2, .1), np.pad(glide(2000, 1300, .15, .15, .1), (int(.2 * SR), 0))),
    'ringiris': lambda e: mixl(T.swirl(.7, .4, 6, 700, 3000), T.revcymbal(.7, .3)),
}
missing = sorted({e['type'] for e in EV} - SFX.keys())
if missing: sys.exit(f'mix.py: no sound for event types {missing}')
VERB = {'scent': .5, 'reveal': .45, 'badge': .35, 'swell': .4, 'swirl': .5, 'petals': .5, 'lensiris': .5, 'tink': .5, 'swipe': .25, 'page': .3, 'zoom': .3, 'stamp': .15, 'drop': .4, 'titlepop': .3, 'climb': .4, 'ringiris': .3}
snd = np.zeros(NW)
for e in EV:
    if e['type'] == 'roll':                     # Rollo lăn từ phải sang trái: chia khúc để đổi pan
        x = SFX['roll'](e); n = len(x); k = 8
        for i in range(k): add(fx, x[i * n // k:(i + 1) * n // k], e['t'] + i * n / k / SR, .9, .6 - .9 * i / (k - 1))
        continue
    x = SFX[e['type']](e); add(fx, x, e['t'], 1., e.get('pan', 0))
    if e['type'] in VERB: s0 = int(e['t'] * SR); k = min(len(x), NW - s0); snd[s0:s0 + k] += x[:k] * VERB[e['type']]
fx += T.verb(snd, 1.1) * .35


# ---------- vòng lặp: phần dư sau 52 s cộng vào đầu phim, rồi cắt về đúng độ dài ----------
for k in ('mus', 'fx'):
    b = B[k]; tail = b[N0:].copy(); b[:len(tail)] += tail; B[k] = b[:N].copy()
mus, fx = B['mus'], B['fx']


# ---------- nền: vườn ban ngày (gió nhẹ + chim xa rất nhỏ), riêng cảnh tựa không có ----------
amb = B['amb']
def bed(d):
    tt = t_(d); e = np.minimum(1, tt / .3) * np.minimum(1, (d - tt) / .3)
    return (lp(brown(d), 700) * .5 + bp(noise(d), 2000, 6000) * .01) * e * .06
for a, b in ((0., at(2) - .1), (at(3) - .3, DUR)): add(amb, bed(b - a), a, 1., 0)


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
mus *= .075 / max(rms(mus), 1e-9)
fx *= .55 / max(np.abs(fx).max(), 1e-9)
from scipy.ndimage import maximum_filter1d, uniform_filter1d
ve = uniform_filter1d(maximum_filter1d(np.abs(vox), int(.05 * SR)), int(.25 * SR))
B['mus'] = mus = T.duck(mus, ve, .82, .55)
B['fx'] = fx = T.duck(fx, ve, .6, .3)
mix = B['mus'] + B['fx'] + B['amb'] + B['vox']
mix = np.tanh(mix * 1.1) / 1.1
mix, I_mix, ceil_db = T.master(mix, 11.6)   # crest 11,6: chừa đỉnh cho AAC (bản trước −0,9 dBTP)
print(f'master: {I_mix:.1f} LUFS, true-peak ceiling {ceil_db:.1f} dBFS')
nf = int(.02 * SR); mix[:nf] *= np.linspace(0, 1, nf)[:, None]   # mép đầu file: fade-in 20 ms (xem SHORT-002 MUSIC.md)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR, subtype='PCM_24')
for k in ('mus', 'fx', 'vox'): sf.write(os.path.join(HERE, 'out', f'stem_{k}.wav'), B[k].astype(np.float32), SR, subtype='PCM_16')

from scipy.signal import welch
f, p = welch(mix.mean(1), SR, nperseg=8192); low = p[(f >= 20) & (f < 120)].mean(); rest = p[(f >= 120) & (f < 8000)].mean()
print(f'low band 20–120 Hz vs 120–8000 Hz: {10 * np.log10(low / rest):+.1f} dB (per-Hz density)')
for name, a, b in (('mở', 0, 4), ('tựa', 4, 6), ('râu', 6, 16), ('đường mùi', 16, 28), ('rệp', 28, 36), ('sổ', 36, 46), ('kết', 46, 52)):
    i, j = int(a * SR), int(b * SR)
    print(f'{name:9s}', '  '.join(f'{k}={20 * np.log10(max(rms(B[k][i:j]), 1e-9)):6.1f}' for k in ('mus', 'fx', 'amb', 'vox')), 'dBFS rms')
print('out/mix.wav', f'{len(mix) / SR:.2f} s')
