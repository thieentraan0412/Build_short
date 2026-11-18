"""Âm thanh của LONG-002 → out/mix.wav (48 kHz stereo): nhạc "Tiny Detective Swing" (MUSIC.md, SOUND-PLAN.md) dựng bằng lớp nhịp theo cảnh
(_shared/audio/groove.py, plan=True: mỗi cảnh một phong cách, một BPM, một nhạc cụ hát chính, một cách chuyển) + điểm nhấn viết tay
(nhạc hiệu, mô-típ bí mật đô–mi–sol ở mỗi ô manh mối và ở "6 BUG / 8 SPIDER", trống dồn vào hàng nghi phạm, "ta-da"), tiếng động theo
events.json, nền đêm theo bối cảnh, giọng.
python mix.py   (cần timeline.json + voice/*.wav từ tools/lines.mjs, core/tts/tts.py và _shared/voicefx.py, events.json từ core/render/events.mjs)
Mọi âm thanh tổng hợp bằng code (_shared/audio/band.py, toon.py, core/audio/sfx.py); không dùng mẫu của bên thứ ba.
Luôn vui tươi (QUALITY.md §4, 14/11/2026): mọi cảnh giọng trưởng, ≥ 108 BPM, năng lượng ≥ 2; không hồi hộp, không điệu rình rập; khựng hài ≤ 1,2 s."""
import os, sys, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio')); sys.path.insert(0, os.path.join(LIB, '_shared', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, whoosh, thump, pop, click, step, compress, add
from band import fade, mf, pluck, marimba, bassn, kick, bell, horn, pad, chirp, riser, glide, jingle, mmm, pizz, xylo, flute, reed, tuba
from band import celesta, harp, vibes, upright, snare, timpani, trumpet, trombone, bassoon, tada, secret, toypiano, strings, piano
from groove import Groove, glock
import toon as T

TL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))
EV = json.load(open(os.path.join(HERE, 'events.json'), encoding='utf-8'))['ev']
H, LINES = TL['hit'], TL['lines']
BEAT = 60 / TL['bpm']; DUR = TL['dur']; N = int((DUR + .05) * SR)
B = {k: np.zeros((N + int(3 * SR), 2)) for k in ('mus', 'fx', 'amb')}
def mixl(*xs):
    n = max(len(x) for x in xs); return sum(np.pad(x, (0, n - len(x))) for x in xs)
def speaking(t, pad_=.05): return any(l['t'] - pad_ <= t < l['t'] + l['dur'] + pad_ for l in LINES)
def Lb(who, text, nth=0): return [l for l in LINES if l['who'] == who and l['text'] == text][nth]
L0 = lambda who, text, nth=0: Lb(who, text, nth)['t']
Lend = lambda who, text, nth=0: Lb(who, text, nth)['t'] + Lb(who, text, nth)['dur']


# ---------- nhạc: "Tiny Detective Swing" — swing trinh thám GIỌNG TRƯỞNG; mỗi manh mối, mỗi nghi phạm một màu nhạc ----------
mus = B['mus']
NOPE1, THINK = L0('loupe', 'Nope!', 0), L0('albie', "...I'll think about it.")
LAMP0 = H['t_lamp0']
# khựng hài (≤ 1,2 s, còn một lớp mỏng): trước "Nope!" ở manh mối 1 · ngay sau tiếng đèn tắt · trước "...I'll think about it."
REST = ((H['c1_beat'], NOPE1), (LAMP0 - .08, LAMP0 + .9), (THINK - .75, THINK - .05))
def M(x, t, g=1., pan=0.):
    if any(a <= t < b for a, b in REST): return
    add(mus, x, t, g, pan)
def seq(inst, ns, t0, step_, g=1., pan=0., d=None):
    for i, n in enumerate(ns):
        if n: M(inst(n, d) if d else inst(n), t0 + i * step_, g, pan)
def strum(inst, ns, t, g=.4, d=None, spread=.012):
    for k, n in enumerate(ns): M(inst(n, d) if d else inst(n), t + k * spread, g, -.3 + .6 * k / max(1, len(ns) - 1))
def cymbal(t, g=.2, br=4500): M(T.cymbal(1.6, 1., br), t, g, .15)
def Mst(x, t, g=1.):                                       # tiếng stereo viết sẵn (band.tada)
    s0 = int(t * SR); k = min(len(x), len(mus) - s0); mus[s0:s0 + k] += x[:k] * g

SLOT = [H['c1_slot'] + .6, H['c2_slot'] + .6, H['c3_slot'] + .6]                  # lúc mỗi ô manh mối được lấp
Q6, Q8 = L0('dot', 'Six legs!'), L0('dot', 'Eight legs!', 1)                      # thẻ "6 BUG", "8 SPIDER"
ASK = [(Lend('loupe', 'Then who has eight legs?'), H['c2_shadow']), (Lend('loupe', 'How many legs does a bug have?'), Q6),
       (Lend('loupe', 'And a spider?'), Q8), (Lend('loupe', 'So... is a spider a bug?'), L0('dot', 'Nope!'))]   # nhịp chờ trẻ trả lời to
LINEUP_IN = L0('loupe', 'Time for a lineup!')
# vùng giai điệu của lớp nhịp nhường chỗ: điểm nhấn viết tay và các nhịp chờ trẻ trả lời (chỉ còn trống + bass)
AVOID = [(0, 1.0), (H['jingle'] - .05, H['s_scene'])] + [(s - .1, s + 1.3) for s in SLOT] + [(a, b) for a, b in ASK] + [
    (LINEUP_IN, H['s_line']), (H['eight'] - .05, H['eight'] + 1.0), (H['c1_hang'] + .8, H['c1_hang'] + 2.8), (H['l_lens'], H['l_pop'] + 1.2),
    (H['t_tangle'], H['t_lamp1'] + 1.4), (H['stamp'], H['stamp'] + 1.6), (Q6 - .1, Q6 + 1.2), (Q8 - .1, Q8 + 1.2), (H['recall'] - .05, H['recall'] + 1.0),
    (L0('dot', 'Nope!') - .05, DUR)]
# (16/11/2026, lượt "nhạc đệm dưới lời", QUALITY.md §4 (Đệm lời)): accomp=True: dưới lời vẫn đủ đệm hợp âm + bè phụ ở dải cao,
# đổi cảnh luôn nghe ra; chủ đề "Who snuck in?" (đô–mi–sol–la–sol–mi–rê–sol) do nhạc cụ hát chính của từng cảnh hát lại, cách nhau ≥ 18 s.
G = Groove(M, BEAT, LINES, seed=22, avoid=AVOID, plan=True, accomp=True)
G.theme([0, 4, 7, 9, 7, 4, 2, 7], [0, 1, 2, 3, 4, 6, 7, 8], every=18.)
S = G.sec
# — mở —
S('móc · sợi tơ bạc · đội thám tử', 0, H['s_title'], 'sleuth', 'F', 'F D7 Gm7 C7', bass='pizzbass', comp='vibes', lead='mute', kit='sleuth', energy=2, cue=False,
  bpm=120, mood='playful', arc='open', what='Nửa đêm: sợi tơ bạc lóe ngang trang Insects, sticker 8 chân ngọ nguậy, WHO SNUCK IN?!; lia nhanh sang Albie bật dậy; Miss Loupe, Dot, Crumb vào khung',
  emo='bất ngờ, tò mò, tinh nghịch', why='Điệu riêng của tập: swing trinh thám giọng trưởng 120 BPM (bass pizzicato đi bộ, búng tay 2–4, chổi); trumpet bịt "wah" hát chính như phim thám tử hoạt hình, vibraphone đệm; nhạc chạy từ giây 0.')
G.mark('nhạc hiệu', H['jingle'], H['s_scene'], 'jingle', 'F', 'horn marimba bell', 3, mood='epic', arc='open', what='Logo BIG SECRETS qua vòng kính, sợi tơ giăng dưới chữ',
       emo='háo hức', why='Nhạc hiệu 2 s của kênh, giống hệt mọi tập (video dài giữ nhạc hiệu 2 s).')
# — hiện trường, luật —
S('hiện trường · đếm 8 chân', H['s_scene'], H['s_rule'], 'sleuth', 'F', 'F Dm Gm7 C7', bass='pizzbass', comp='pianohi', lead='vibes', kit='sleuth', energy=2,
  bpm=116, mood='funny', arc='build', what='Trang Insects, máy đẩy vào sticker lạ; Dot leo lên đếm 1…8, số nảy trên từng chân; "8 LEGS?!"',
  emo='tò mò, đếm cùng nhau', why='Swing trinh thám chậm lại 116 BPM để trẻ đếm theo; vibraphone đáp giữa các số, piano cao chặn nhẹ; mỗi số đếm một tiếng chuông riêng (tiếng động).')
S('luật · "Rules are rules!"', H['s_rule'], H['s_clues'], 'sleuth', 'Bb', 'Bb Gm Cm7 F7', bass='pizzbass', comp='toypiano', lead='bassoon', kit='sleuth', energy=2,
  bpm=116, mood='funny', arc='build', what='Albie: "Eight legs?! Insects have SIX!", giơ huy hiệu 6; Crumb: "But WHY?"; Albie nhún: "Rules are rules!"',
  emo='nghiêm túc giả, buồn cười', why='Cùng điệu trinh thám nhưng đổi sang Si giáng, bassoon hát chính "nghiêm túc giả" cho người giữ luật, piano đồ chơi đệm; dưới giọng Albie bỏ bass.')
S('ba ô manh mối · "Let\'s zoom in!"', H['s_clues'], H['s_c1'], 'sleuth', 'F', 'F Bb C7 F', bass='pizzbass', comp='pizz', lead='xylo', kit='sleuth', energy=3, tr='pickup',
  bpm=120, mood='playful', arc='build', what='Ba ô manh mối "1 2 3" hình kính lúp bật ra; Dot: "Three clues! I counted!"; kính giơ cao lóe',
  emo='háo hức, bắt đầu điều tra', why='Swing trinh thám năng lượng 3, xylophone hát chính và dây pizzicato đệm: vòng mở "3 manh mối" nghe như lúc bắt đầu cuộc điều tra.')
# — manh mối 1 · sợi tơ —
S('manh mối 1 · sợi tơ bạc', H['s_c1'], H['c1_beat'], 'twinkle', 'C', 'C Am F G', bass='pizzbass', arp='harp', lead='celesta', kit='tri', energy=2,
  bpm=112, mood='magic', arc='build', what='Kính lướt dọc sợi tơ lấp lánh; Crumb gảy "boing"; "It\'s silk!" – "Silk? Only spiders make silk, right?" – "Only spiders?"',
  emo='kỳ diệu, tò mò', why='Hộp nhạc lấp lánh 112 BPM: đàn hạc rải và celesta như ánh tơ bạc; triangle nhẹ; nhịp thưa để tiếng gảy tơ nghe rõ.')
G.mark('khựng · "Nope!"', H['c1_beat'], NOPE1, 'break', 'C', 'vibes', 2, mood='funny', arc='build', what='Khựng hài trước "Nope!"', emo='hồi hộp vui',
       why='Khựng 0,6 s (vibraphone run run, không im hẳn) để "Nope!" bật ra.')
S('"Nope!" · ảnh hồi bé của Flutter', NOPE1, H['s_c1n'], 'waltz', 'F', 'F C7 F Bb', bass='pizzbass', comp='pluck', lead='glock', kit='toy', energy=2,
  bpm=112, mood='cute', arc='build', what='"Nope!"; Albie lật trang "Baby pictures": Flutter lúc còn là sâu bò trên cành, gặm lá',
  emo='đáng yêu, ngạc nhiên', why='Valse 3/4 dễ thương 112 BPM cho cuốn album ảnh: glockenspiel hát chính, ukulele đệm "um-pa-pa" (gợi lại màu valse của tập về Flutter).')
S('nệm tơ · nhộng · bướm (wow 1)', H['s_c1n'], H['s_c1b'], 'float', 'Bb', 'Bb F Gm Eb', bass='pizzbass', arp='harp', lead='flute', energy=2, tr='swell',
  bpm=112, mood='magic', arc='build', what='Sâu nhả tơ thành nệm nhỏ: "A cocoon?" – "Nope! A tiny silk pad…"; treo chữ J → nhộng → bướm bung cánh bay ra',
  emo='kỳ diệu, vỡ lẽ', why='Rải lơ lửng 112 BPM, đàn hạc rải và sáo hát: khoảnh khắc "ồ" của vòng đời; giai điệu nhường chỗ cho chuỗi nốt viết tay lúc bướm bay ra.')
S('Flutter là nghi phạm · "Mmm?!"', H['s_c1b'], H['s_c2'], 'calypso', 'G', 'G C D7 G', bass='bassn', comp='pluck', lead='steel', kit='latin', energy=2, tr='pickup',
  bpm=120, mood='happy', arc='build', what='Flutter bay vào bàn; Crumb: "So Flutter is a suspect!"; Flutter "Mmm?!"; biểu tượng sợi tơ bay vào ô 1',
  emo='vui, buồn cười', why='Calypso 120 BPM với trống thép hát chính: màu nhạc quen của Flutter (gọi lại tập của cô), Flutter ngạc nhiên mà vẫn vui; mô-típ bí mật khi ô 1 lấp.')
# — manh mối 2 · dấu chân —
S('manh mối 2 · đếm dấu chân', H['s_c2'], H['s_c2b'], 'march', 'C', 'C G7 C F', bass='tuba', comp='pizz', lead='xylo', kit='march', energy=2,
  bpm=118, mood='bouncy', arc='build', what='Máy lia tới bụi tẩy: "Tiny footprints!"; nhìn thẳng từ trên, 8 dấu sáng dần theo lời đếm; "8 FEET!"; Rollo lăn qua để lại rãnh thẳng',
  emo='háo hức, đếm cùng nhau', why='Diễu hành nảy 118 BPM: mỗi bước một dấu chân, xylophone đáp; tuba "oom-pah" như bước chân tí hon.')
S('Flutter in 6 dấu · "Then who?"', H['s_c2b'], H['c2_shadow'], 'bounce', 'F', 'F Dm Bb C', bass='bassn', comp='pluck', lead='marimba', kit='toy', energy=2,
  bpm=118, mood='happy', arc='build', what='Flutter đáp xuống bụi in đúng 6 dấu, bong bóng "6"; "so it was NOT Flutter!"; "Then who has eight legs?" (trẻ trả lời)',
  emo='vỡ lẽ, chờ đợi', why='Pop nảy 118 BPM, marimba đáp: nhẹ và rõ cho câu suy luận; giai điệu nhường chỗ cho tiếng mõ "tích–tắc" lúc chờ trẻ trả lời.')
S('bóng 8 chân có nơ', H['c2_shadow'], H['s_c3'], 'skip', 'F', 'F Bb7 F C7', bass='bassn', comp='pluck', lead='trombone', kit='comic', energy=2, tr='drop',
  bpm=124, mood='funny', arc='build', what='Bóng 8 chân có nơ lướt qua tường, vẫy chân chào; Crumb: "Did you see that?"; biểu tượng dấu chân bay vào ô 2',
  emo='bất ngờ, buồn cười', why='Shuffle nhảy chân sáo 124 BPM, trombone "wah" hài: bóng lạ mà vui, không doạ; mô-típ bí mật khi ô 2 lấp.')
# — manh mối 3 · cánh giấy (swing trinh thám trở lại) —
S('manh mối 3 · cánh giấy phập phồng', H['s_c3'], H['s_c3b'], 'sleuth', 'D', 'D B7 Em7 A7', bass='pizzbass', comp='pizz', lead='reed', kit='sleuth', energy=2, tr='pickup',
  bpm=116, mood='funny', arc='build', reprise=True, what='Dưới góc sticker có gì phập phồng: "A wing! It\'s a butterfly wing!"; Flutter xoè cánh so',
  emo='tò mò, nghi ngờ vui', why='Swing trinh thám trở lại (cố ý: manh mối cuối) ở Rê trưởng, clarinet hát chính, dây pizzicato đệm: cuộc điều tra đang tới gần.')
S('kính · giấy, kéo, băng dính', H['s_c3b'], H['s_sum'], 'sleuth', 'D', 'G E7 A7 D', bass='pizzbass', comp='mute', lead='vibes', kit='sleuth', energy=2,
  bpm=116, mood='funny', arc='build', reprise=True, what='Kính lớn trên cánh giấy: "scissor zigzag!", "pencil lines", "sticky tape!"; "But WHY?"; "A disguise!"; ô 3 lấp',
  emo='vỡ lẽ, thích thú', why='Cùng điệu trinh thám nhưng đổi vòng hoà âm và bộ nhạc cụ (vibraphone hát, trumpet bịt chặn "wah"): mỗi nhãn trong kính một nốt đáp.')
S('tóm tắt · "Time for a lineup!"', H['s_sum'], H['s_line'], 'quest', 'C', 'C F G C', bass='upright', comp='strings', lead='trumpet', kit='tom', energy=3, tr='riser',
  bpm=120, mood='epic', arc='build', what='Ba biểu tượng manh mối nảy lần lượt: "Silk… eight feet… a paper wing."; "Time for a lineup!"',
  emo='tự tin, háo hức', why='Phiêu lưu nước kiệu 120 BPM, trumpet và dàn dây: gom ba manh mối thành một kết luận; trống dồn viết tay vào từ câu "Time for a lineup!" (J-cut).')
# — hàng nghi phạm · LEG-O-METER (game show) —
S('hàng nghi phạm · từng người vào', H['s_line'], H['s_lw'], 'ska', 'G', 'G C D7 G', bass='bassn', comp='pluck', lead='trumpet', kit='ska', energy=2, cue=False,
  bpm=126, mood='bouncy', arc='build', what='Albie: "Suspects! Step in line!"; Waggle vo ve, Flutter bay, Chirp nhảy vào hàng; Spindle thả tơ xuống; Rollo lăn vào cuối',
  emo='háo hức, như game show', why='Ska phách lẻ 126 BPM, kèn đồng: màu game show cho bức tường LEG-O-METER; mỗi nghi phạm vào một tiếng riêng (tiếng động).')
S('đếm chân Waggle, Flutter, Chirp', H['s_lw'], H['s_ls'], 'ska', 'C', 'C F G7 C', bass='bassn', comp='piano', lead='xylo', kit='ska', energy=3,
  bpm=126, mood='bouncy', arc='build', what='Dot đếm từng người, cột đo dâng tới 6 "ding": "Six legs! A bug!", "Flutter… six legs!", "Chirp… six legs!", nhịp nhanh dần',
  emo='vui, nhịp nhàng', why='Cùng màu ska nhưng năng lượng 3, xylophone hát và piano chặn: nhịp đếm nhanh dần; kèn đồng viết tay "ta!" ở mỗi cột dâng tới 6.')
S('Spindle: "Six legs! See?"', H['s_ls'], H['s_llens'], 'stride', 'F', 'F D7 G7 C7', bass='tuba', comp='piano', lead='kazoo', kit='comic', energy=2, tr='drop',
  bpm=120, mood='funny', arc='build', what='Dot đếm Spindle tới 6; Spindle: "Six legs! See? I am a bug!"; Albie: "Really? Six?"; "Let\'s zoom in!"',
  emo='nghi ngờ, buồn cười', why='Ragtime 120 BPM, kazoo hát chính: Spindle tự khoe một cách vụng về và đáng yêu; mõ hai cao độ.')
S('kính: hai chân giấu (wow 2)', H['s_llens'], H['s_body'], 'gallop', 'C', 'C G C G', bass='bassn', comp='strings', lead='glock', kit='clap', energy=3, tr='riser',
  bpm=126, mood='bouncy', arc='build', what='Nhìn qua kính: hai chân giấu sau lưng đang vẫy, số 7, 8 nảy; cột đo vọt lên 8 "boing"; "EIGHT legs!" – "Oopsie!"',
  emo='vỡ lẽ, phấn khích', why='Nhịp kép 126 BPM (thấy nhanh lên), dàn dây nảy cung và glockenspiel: âm lượng dâng ở phát hiện; chuỗi glockenspiel viết tay đi lên khi hai chân bật ra.')
S('đếm phần thân', H['s_body'], H['s_ant'], 'polka', 'F', 'F C7 F Bb', bass='tuba', comp='pluck', lead='accordion', kit='clap', energy=2, tr='pickup',
  bpm=120, mood='happy', arc='build', what='Kính lướt trên Waggle: đầu, ngực, bụng sáng 1-2-3; Spindle 1-2; "Bugs have three body parts. Spiders have two!"',
  emo='vui, học mà chơi', why='Polka 120 BPM, accordion hát chính: đếm "một-hai-ba" theo nhịp oom-pah, mỗi phần thân một tiếng (tiếng động).')
S('râu · "BZZT! Not a bug!"', H['s_ant'], H['s_lq'], 'hop', 'Bb', 'Bb Eb F Bb', bass='bassn', comp='pluck', lead='marimba', kit='bongo', energy=2,
  bpm=122, mood='happy', arc='build', what='Râu Waggle, Flutter, Chirp nảy "2" lần lượt; râu giấy của Spindle rủ rồi rơi: "Oh! Those were paper."; "BZZT!"; Spindle kéo tơ lên',
  emo='bất ngờ, buồn cười', why='Nảy lệch phách 122 BPM, marimba và bongo: mỗi cặp râu nảy một nhịp; bí mật chỉ có trong video dài (2 râu so với không râu).')
S('"We didn\'t SEE her!" · Rollo còn lại', H['s_lq'], H['s_trap'], 'bounce', 'C', 'C Am F G7', bass='bassn', comp='marimba', lead='flute', kit='pop', energy=2, tr='pickup',
  bpm=116, mood='happy', arc='build', what='Crumb: "But did she sneak in? We didn\'t SEE her!"; "Then let\'s catch the intruder… in the act!"; hàng trống, Rollo ngó quanh rồi lăn đi',
  emo='quyết tâm, tinh nghịch', why='Pop nảy 116 BPM, sáo hát chính: kế hoạch mới bắt đầu; nhẹ để câu dài rõ.')
# — bẫy ban đêm —
S('đặt bẫy · cả đội nấp', H['s_trap'], LAMP0 - .08, 'skip', 'F', 'F Gm7 C7 F', bass='pizzbass', comp='pizz', lead='bassoon', kit='comic', energy=2, tr='drop',
  bpm=112, mood='funny', arc='build', what='Crumb đặt mồi "YOUR STICKER HERE!"; cả đội nấp: Miss Loupe trong hũ bút, Crumb trong cuộn băng dính, Dot sau cục tẩy',
  emo='tinh nghịch, rình vui', why='Shuffle nhảy chân sáo 112 BPM (giọng trưởng, không điệu rình rập): dây pizzicato đệm, bassoon hát chính "rón rén mà vui".')
G.mark('đèn tắt · khựng', LAMP0 - .08, LAMP0 + .9, 'break', 'F', 'celesta', 2, mood='funny', arc='build', what='Đèn bàn tắt "tách", ánh trăng xanh', emo='bất ngờ vui',
       why='Khựng 1 s ngay sau tiếng đèn tắt (celesta lấp lánh rất nhỏ, không im hẳn).')
S('giả ngủ · "con bọ" lạ trên tơ', LAMP0 + .9, H['s_snap'], 'skip', 'Bb', 'Bb Eb F7 Bb', bass='pizzbass', comp='celesta', lead='pizz', kit='wood', energy=2,
  bpm=112, mood='funny', arc='build', what='Albie: "Snore… snore… I am totally asleep…"; Dot thì thầm đếm; "con bọ" có cánh, áo sọc đi lắc lư trên tơ: "six legs!" – "Hold on… are you sure?"',
  emo='hồi hộp vui, buồn cười', why='Vẫn shuffle 112 BPM nhưng dưới ánh trăng: dây pizzicato hát nhón chân, celesta lấp lánh, mõ gỗ; giọng trưởng, không nhịp tim.')
S('bẫy sập · bạt nhún tơ (cao trào)', H['s_snap'], H['s_conf'], 'hero', 'C', 'C F G C', bass='bassn', comp='strings', lead='trumpet', arp='xylo', kit='epic', energy=3, tr='riser',
  bpm=132, mood='epic', arc='peak', what='Kẻ cải trang trượt chân trên chính sợi tơ, cuộn thành cục tơ, nảy như bạt nhún; đồ cải trang bung, 8 chân bật ra; đèn bật: "Gotcha!", "BZZT!"',
  emo='phấn khích, vỡ oà', why='Cao trào anh hùng 132 BPM: kèn đồng, dàn dây, timpani nhấn phách đầu; mỗi cú nảy một "boing" (tiếng động) và một nốt timpani viết tay; "ta-da" khi đèn bật.')
# — thú nhận, Albie một mình —
S('thú nhận · "I only wanted one page."', H['s_conf'], H['s_confb'], 'sway', 'F', 'F Am Bb C', bass='pizzbass', comp='pluck', lead='celesta', kit='brush', energy=2,
  bpm=108, mood='cute', arc='end', what='Spindle treo trên tơ: "You caught me! I only wanted one page."; giơ sticker tơ tự dệt lấp lánh',
  emo='dễ thương, chân thành', why='Nửa nhịp đung đưa 108 BPM, ukulele và celesta: ấm và vui (không buồn), Spindle cười hy vọng.')
S('"But WHY can\'t she join?" · "Maybe one day?"', H['s_confb'], THINK - .75, 'sway', 'Bb', 'Bb Gm Eb F', bass='pizzbass', comp='pluck', lead='celesta', kit='tri', energy=2,
  bpm=108, mood='cute', arc='end', what='Crumb: "But WHY can\'t she join?"; Albie: "Rules are rules. This book is for insects."; Spindle: "Okay! Maybe one day?", tặng sticker, kéo tơ lên',
  emo='ấm áp, hy vọng', why='Cùng màu đung đưa nhưng sang Si giáng, triangle nhẹ: lời trao đổi chân thành, nhạc thưa để câu "Rules are rules." rõ.')
G.mark('khựng · Albie ngắm sticker', THINK - .75, THINK - .05, 'break', 'Bb', 'celesta', 2, mood='cute', arc='end', what='Albie một mình ngắm sticker tơ lấp lánh',
       emo='trầm ngâm vui', why='Khoảng lặng có chủ đích 0,7 s trước "...I\'ll think about it." (hộp nhạc rất nhỏ).')
S('"...I\'ll think about it." · giấu dưới ruy băng', THINK - .05, H['s_recap'], 'twinkle', 'Bb', 'Bb F Eb F', bass='pizzbass', arp='celesta', lead='toypiano', kit='tri', energy=2, cue=False,
  bpm=108, mood='cute', arc='end', what='"...I\'ll think about it."; Albie giấu sticker tơ dưới dải ruy băng, ruy băng nảy',
  emo='ấm áp, có hy vọng', why='Hộp nhạc lấp lánh 108 BPM, piano đồ chơi hát: mầm cho tập 12 (luật là luật, nhưng bạn là bạn), dịu mà vẫn vui.')
# — kết vụ án, Rollo, tạm biệt —
S('CASE CLOSED! · ôn bài', H['s_recap'], H['s_rollo'], 'sunny', 'C', 'C F G C', bass='bassn', comp='pluck', lead='flute', kit='toy', energy=2, tr='pickup',
  bpm=120, mood='happy', arc='end', what='Con dấu CASE CLOSED!; "How many legs does a bug have?" – "Six legs!" (thẻ 6 BUG); "And a spider?" – "Eight legs!" (thẻ 8 SPIDER); "Count carefully… before you decide!"',
  emo='tự hào, vui', why='Ukulele nắng 120 BPM, sáo hát chính; "ta-da" viết tay ở con dấu, mô-típ bí mật ở hai thẻ đáp án; giai điệu nhường chỗ lúc chờ trẻ trả lời.')
S('"Did you spot Rollo?"', H['s_rollo'], H['s_bye'], 'stride', 'F', 'F D7 G7 C7', bass='tuba', comp='pianohi', lead='piano', kit='comic', energy=2, tr='drop',
  bpm=126, mood='funny', arc='end', what='"Wait! Did you spot Rollo?": ba khung nhỏ bật ra, vòng tròn khoanh Rollo; Rollo lăn ngang khung',
  emo='thích thú, tinh nghịch', why='Ragtime piano 126 BPM: trò "tìm Rollo" vui nhộn; mỗi khung nhỏ một nốt.')
S('tạm biệt · "Two legs!" · "Nope!"', H['s_bye'], DUR, 'sleuth', 'F', 'F D7 G7 C7', bass='pizzbass', comp='vibes', lead='trumpet', kit='sleuth', energy=3, tr='fill',
  bpm=124, mood='playful', arc='end', reprise=True, what='Dot đếm chân người xem: "Two legs! Not a bug either!"; sợi tơ lóe lại như khung 0, Spindle thả xuống; "So… is a spider a bug?" – "Nope!"',
  emo='vui, tinh nghịch', why='Swing trinh thám trở lại đủ ban (cố ý, nối về móc): trumpet mở (không bịt), năng lượng 3, 124 BPM; "ta-da" ở "Nope!" cuối.')
# câu đáp viết tay (đếm trong báo cáo): mô-típ bí mật ở ba ô manh mối, chuỗi glockenspiel ở hai chân giấu, kèn ở ba cột đo, thẻ đáp án
G.answer(*SLOT, H['l_pop'], H['m_w'] + .45, H['m_f'] + .45, H['m_c'] + .45, Q6 + .1, Q8 + .1, H['c1_hang'] + 1.7, H['eight'])
G.play(); os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
G.save(os.path.join(HERE, 'out', 'music.json'), color='"Tiny Detective Swing" (swing trinh thám giọng trưởng: bass pizzicato đi bộ, búng tay 2–4, trumpet bịt "wah", vibraphone)')
# nền trầm rất mỏng (nốt gốc + quãng năm, dưới 250 Hz: không chạm dải giọng) cho các điệu thưa, để nhạc không đứt giữa hai nốt ngắn
from groove import chord as _chord
for S_ in G.S:
    if S_['hand'] or S_['style'] == 'break': continue
    r = 36 + (_chord(S_['key'].rstrip('m') or S_['key'])[0] - 36) % 12
    add(mus, pad([r, r + 7], S_['t1'] - S_['t0'] + .4), S_['t0'], .5, 0)

# — điểm nhấn viết tay —
J = jingle(); s = int(H['jingle'] * SR); mus[s:s + len(J)] += J * .9                                       # nhạc hiệu 2 s, giống hệt mọi tập
strum(vibes, (65, 69, 72, 77), 0., .3, 1.4, .02); M(upright(41, .6), 0., .9)                              # hợp âm Fa ở khung 0 (nhạc chạy từ giây 0)
seq(lambda m, d: trumpet(m, d, 1., .8), (77, 81, 84), .35, .12, .3, .2, d=.14)                             # trumpet bịt "da-da-DA" theo chữ móc
for i, t in enumerate(SLOT):                                                                              # ô manh mối lấp: mô-típ bí mật đô–mi–sol
    root = (72, 74, 77)[i]; secret(M, celesta, root, t - .05, .15, .5, .3, last=12); M(bell(root + 24, .4, 1.2), t + .5, .3, .3)
for k, n in enumerate((84, 86, 88, 89, 91, 93, 95, 96)): M(glock(n, .5), H['eight'] + .02 + k * .045, .22, .3)   # "8 LEGS?!": chuỗi đi lên
M(bassoon(46, .5), Lend('albie', 'Rules are rules!') + .02, .35); M(bassoon(41, .6), Lend('albie', 'Rules are rules!') + .27, .35)   # "Rules are rules!": bassoon "bum-bum"
# vòng đời: nệm tơ (harp lấp lánh), nhộng (celesta), bướm bay ra (sáo đi lên + đàn hạc vuốt)
seq(celesta, (84, 88, 91), H['c1_hang'] + .9, .14, .3, .25, d=.8)
seq(flute, (77, 81, 84, 89), H['c1_hang'] + 1.7, .12, .35, .1, d=.35); M(T.gliss(72, 96, .5, .3, 'harp'), H['c1_hang'] + 1.7, .8)
# trống dồn vào hàng nghi phạm (J-cut từ "Time for a lineup!")
for k in range(int((H['s_line'] - LINEUP_IN) / .07)): M(snare(.25 + .55 * k * .07 / (H['s_line'] - LINEUP_IN)), LINEUP_IN + k * .07, .3, -.1)
M(T.cymbal(1.6, 1., 5200), H['s_line'], .2, .15); M(timpani(43, 1., 1.), H['s_line'], .5)
for t in (H['m_w'], H['m_f'], H['m_c']): strum(lambda m, d: trumpet(m, d), (67, 71, 74), t + .45, .22, .25, .01)   # cột dâng tới 6: kèn "ta!"
# hai chân giấu: glockenspiel đi lên khi số 7, 8 nảy; chân bật ra: hợp âm kèn + chũm chọe
s7 = L0('dot', 'Seven... eight!')
for i in range(2): seq(glock, (84 + i * 5, 88 + i * 5, 91 + i * 5), s7 + i * .55, .06, .25, .3)
strum(lambda m, d: trumpet(m, d), (60, 64, 67, 72), H['l_pop'], .3, .5, .015); cymbal(H['l_pop'], .22)
seq(trombone, (55, 50), L0('albie', 'BZZT! Not a bug!', 0) + .15, .22, .3, 0, d=.25)                        # "BZZT!": trombone "bwa-bwa"
# bẫy sập: mỗi cú nảy của cục tơ một nốt timpani đi lên; đèn bật: "ta-da"
for k in (1, 2, 3): M(timpani((43, 46, 48)[k - 1], 1., .8), H['t_tangle'] + k * np.pi / 7, .45)
Mst(tada(72, 1.), H['t_lamp1'], .55); cymbal(H['t_lamp1'], .2)
seq(trombone, (55, 50), L0('albie', 'BZZT! Not a bug!', 1) + .15, .22, .3, 0, d=.25)
Mst(tada(72, 1.), H['stamp'] + .5, .45); cymbal(H['stamp'] + .5, .15)                                       # CASE CLOSED!: "ta-da" ngay sau tiếng con dấu (không chồng đỉnh)
for w_, root in (((Q6, Lend('dot', 'Six legs!')), 72), ((Q8, Lend('dot', 'Eight legs!', 1)), 76)):        # thẻ "6 BUG", "8 SPIDER": mô-típ bí mật ngay sau câu trả lời
    secret(M, celesta, root, w_[1] + .02, .14, .45, .3, last=12)
for i in range(3): M(piano(77 + i * 2, .5), H['e_spots'] + i * 1.2 + .5, .3, .2)                           # mỗi khung Rollo một nốt
for k, n in enumerate((89, 93, 96, 101)): M(glock(n, .5), H['recall'] + .02 + k * .05, .2, .3)            # sợi tơ lóe lại như khung 0
Mst(tada(77, 1.), Lend('dot', 'Nope!') + .02, .5); cymbal(Lend('dot', 'Nope!') + .02, .18)                    # "NOPE!" cuối: ta-da Fa trưởng ngay sau lời (lời rõ)
strum(vibes, (65, 69, 72, 77), DUR - 1.2, .25, 1.2, .03)
# nhịp chờ trẻ trả lời: mõ gỗ "tích–tắc" rất nhỏ (giai điệu của lớp nhịp đã nhường chỗ)
for a, b in ASK:
    for i in range(int((b - a - .1) / .25)): add(mus, T.block((84, 79)[i % 2], .5), a + .05 + i * .25, .16, (.3, -.3)[i % 2])
# chỗ khựng vẫn còn một lớp mỏng (QUALITY.md §4): vibraphone / celesta run run + pad, giọng trưởng
for a, b, ch, inst in ((H['c1_beat'], NOPE1, [60, 64, 67], vibes), (LAMP0 - .08, LAMP0 + .9, [65, 69, 72], celesta), (THINK - .75, THINK - .05, [70, 74, 77], celesta)):
    add(mus, pad(ch, b - a + .3), a, .5, 0)
    for i in range(int((b - a) / .14)): add(mus, inst(ch[i % 3] + 12, .25), a + i * .14, .07, .3)

# — cường độ theo cảnh (chuyển mềm 0,3 s): dâng ở chỗ khám phá, bất ngờ; hạ dưới lời dài và các nhịp chờ —
LEVEL = [(0, .9), (L0('albie', 'An intruder! In MY pages!'), .75), (H['whip'], .9), (L0('loupe', 'Who snuck into the Bug Book?'), .75), (H['jingle'], .45), (H['s_scene'], .8),
         (H['eight'], 1.0), (H['eight'] + 1.2, .78), (H['s_clues'], .85), (H['c1_twang'], .95), (H['c1_twang'] + 1., .78), (NOPE1, 1.0), (NOPE1 + .8, .8),
         (H['c1_hang'] + .8, 1.0), (H['c1_hang'] + 2.8, .8), (SLOT[0] - .1, 1.0), (SLOT[0] + 1.4, .8), (H['s_c2a'], .85), (H['rollo1'], .95), (H['s_c2b'], .8),
         (ASK[0][0], .65), (H['c2_shadow'], .95), (H['c2_shadow'] + 1.4, .8), (SLOT[1] - .1, 1.0), (SLOT[1] + 1.4, .8), (H['c3_lens'], .95), (H['c3_lens'] + 1.6, .78),
         (SLOT[2] - .1, 1.0), (SLOT[2] + 1.4, .82), (LINEUP_IN, 1.0), (H['s_line'] + 1.5, .85), (H['s_lw'], .9), (H['s_ls'], .8), (H['l_lens'], .95), (H['l_pop'], 1.0),
         (H['l_pop'] + 1.6, .8), (H['a_droop'] + .7, .95), (H['a_droop'] + 1.6, .8), (H['s_lq'], .8), (H['s_trap'], .82), (LAMP0, .6), (H['s_wait'], .75),
         (H['s_snap'], 1.0), (H['t_lamp1'] + 2.5, .85), (H['s_conf'], .72), (H['s_alone'], .7), (H['s_recap'], .9), (H['stamp'] + 1.8, .8), (ASK[1][0], .65), (Q6, .9),
         (Q6 + 1., .8), (ASK[2][0], .65), (Q8, .9), (Q8 + 1., .8), (H['s_rollo'], .9), (H['s_bye'], .82), (H['recall'], 1.0), (H['recall'] + 1.2, .8), (ASK[3][0], .65),
         (L0('dot', 'Nope!'), .7), (Lend('dot', 'Nope!'), 1.0)]
LEVEL.sort()
tt = np.arange(len(mus)) / SR; lev = np.full(len(mus), LEVEL[0][1])
for (t, g), (_, g0) in zip(LEVEL[1:], LEVEL[:-1]): lev = np.where(tt >= t - .15, np.where(tt < t + .15, g0 + (g - g0) * (tt - t + .15) / .3, g), lev)
# câu cửa miệng (−6 dB), câu tựa (đè lên nhạc hiệu) và "Gotcha!" (−4 dB) nói giữa lúc nhạc dâng: nhạc lùi trong lúc nói (lời hơn nhạc ≥ 10 dB)
for l in LINES:
    if l.get('catch') or l['id'] == 'L06' or l['text'] == 'Gotcha!':
        a, b = l['t'] - .1, l['t'] + l['dur'] + .05
        lev *= 1 - (.5 if l.get('catch') or l['id'] == 'L06' else .37) * np.clip(np.minimum((tt - a) / .1, (b - tt) / .1), 0, 1)
mus *= lev[:, None]


# ---------- tiếng động theo sự kiện ----------
fx = B['fx']
def train(d, n, f, v=1.):                                   # n tiếng f() rải đều trong d giây
    x = np.zeros(int((d + .4) * SR))
    for k in range(n):
        b = f(k); s0 = int(k * d / max(1, n) * SR); x[s0:s0 + len(b)] += b[:len(x) - s0]
    return x * v
def zing_(d, v=1.):                                         # sợi tơ lóe: vuốt chuông thủy tinh đi lên + lấp lánh (dải cao, trên giọng)
    return mixl(T.whistle(3800, 6200, min(d, .5), .05, .01, 9.), T.sparkle(d, .22, 96, 108, int(5 + 4 * d), 3, 'up'), np.pad(T._ting(mf(103), .9, .3), (int(.05 * SR), 0))) * v
def wiggle_(d, v=1.):                                       # 8 chân tí hon ngọ nguậy: tiếng "lách tách" rất nhỏ
    return train(d, int(d / .07), lambda k: T.block(91 + (k % 3) * 2, .18), .7 * v)
def munch_(d, v=1.):                                        # gặm lá "nhóp nhép"
    return train(d, int(d / .18), lambda k: mixl(bp(noise(.06), 900, 3500) * env_exp(.06, .015) * .5, T.plip(700 + 120 * (k % 3), .25)), v)
def silkspin_(d):                                           # nhả tơ: chuỗi giọt nhỏ đi lên, lấp lánh
    return mixl(train(d, int(d / .12), lambda k: T.plip(1500 + 90 * k, .22)), T.sparkle(d, .15, 96, 106, 5, 4, 'up'))
def creak_(v=1.): tt = t_(.5); return T._sweep(noise(.5), 700, 1100, .2, lambda u: .5 + .5 * np.sin(u * 3)) * np.sin(np.pi * tt / .5) * .14 * v   # sợi tơ kẽo kẹt khẽ
def paperflap_(d, v=1.): return train(d, int(d / .14), lambda k: T.paper(.12, .35, 3, k), v)
def lamp_(v=1.): return fade(mixl(click(1.2, .5) * .6, T.block(96, .3), np.pad(thump(.15, 260) * .25, (int(.01 * SR), 0))), .002, .02) * v
def stamp_(v=1.): return fade(mixl(thump(.8, 110) * .5, hp(noise(.07), 1200) * env_exp(.07, .012) * .35), .003, .03) * v
def bzzt_(v=1.): return fade(lp(np.sign(np.sin(2 * np.pi * 120 * t_(.22))), 1800) * .18, .005, .03) * v
def ding_(m, v=1.): return T.ding(m, .4 * v, .8)
SFX = {
    'titlepop': lambda e: mixl(T.bubble(1600, .5, .06, 2.4), np.pad(T._ting(mf(101), .5, .35), (int(.02 * SR), 0))),
    'wordpop': lambda e: mixl(T.boing(220 + 120 * e.get('n', 0), .35, .3, 2.4, 16.), np.pad(pop(.6) * .45, (int(.02 * SR), 0)), T.bubble(1300 + 500 * e.get('n', 0), .35, .05, 2.4)),
    'zing': lambda e: zing_(e.get('d', 1.), e.get('v', 1.)),
    'wiggle': lambda e: wiggle_(e.get('d', 1.), e.get('v', 1.)),
    'tink': lambda e: T._ting(mf(e.get('m', 96)), .4, .12),
    'whip': lambda e: mixl(T.swish(.4, .55, 400, 4200, True, .5, .4), whoosh(.4, .35) * .6),
    'popup': lambda e: mixl(T.boing(260, .4, .3 * e.get('v', 1.), 2.2, 14.), T.swipe(.2, .2 * e.get('v', 1.), True, 1500, 5500)),
    'tabs': lambda e: T.pops(4, .05, 86, .45 * e.get('v', 1.)),
    'slidein': lambda e: mixl(T.swish(.5, .35 * e.get('v', 1.), 500, 3200, True), np.pad(T.bubble(800, .2, .08), (int(.4 * SR), 0))),
    'glint': lambda e: mixl(T._ting(mf(100), .6, .3), T.sparkle(.4, .2, 98, 108, 4, 1, 'up')),
    'blip': lambda e: T.blip(e.get('m', 88), .3),
    'hop': lambda e: mixl(T.boing(240, .4, .35 * e.get('v', 1.), 2.4, 15.), T.swish(.3, .18 * e.get('v', 1.), 900, 3600, True)),
    'land': lambda e: mixl(step(.4) * .5, T.bubble(700, .2, .06)) * e.get('v', 1.),
    'boing': lambda e: T.boing(240, .45, .3 * e.get('v', .5) / .5, 2.2, 14.),
    'spin': lambda e: mixl(T.swirl(e.get('d', .6), .4, 6, 900, 3600), T.swell(e.get('d', .6), .3, 79, 101)),
    'sparkle': lambda e: T.sparkle(.7, .3 * e.get('v', 1.), 91, 108, 7, 12, 'up'),
    'lensiris': lambda e: mixl(T.swish(.45, .35, 500, 4200, True, .6, .3), T.sparkle(.45, .15, 93, 106, 5, 6, 'up')),
    'page': lambda e: mixl(T.paper(.35, .45, 5, 1), T.bubble(520, .3, .09)),
    'pageflip': lambda e: mixl(T.paper(.6, .5, 8, 3), T.swish(.6, .22, 700, 3200, True)),
    'scurry': lambda e: T.scurry(e.get('d', .5), .55 * e.get('v', 1.), 91),
    'count': lambda e: mixl(T.blip(84 + 2 * e.get('n', 0), .35), T._ting(mf(91 + 2 * e.get('n', 0)), .3, .2)),   # số đếm nảy: mỗi số cao hơn một bậc
    'print': lambda e: mixl(T.footsteps(1, .1, .5, 86 + 2 * e.get('n', 0), e.get('n', 0), True), T._ting(mf(91 + 2 * e.get('n', 0)), .3, .18)),   # dấu chân "pat" + số
    'pats': lambda e: T.footsteps(e.get('n', 6), .07, .5, 86, 2, True),
    'bigpop': lambda e: mixl(T.boing(200, .4, .3 * e.get('v', 1.), 2.4, 16.), np.pad(pop(.6) * .4 * e.get('v', 1.), (int(.02 * SR), 0)), T.bubble(1400, .3 * e.get('v', 1.), .05, 2.4)),
    'reveal': lambda e: mixl(T.ding(93, .4, 1.0), T.sparkle(.6, .35, 93, 108, 7, 8, 'up')),
    'badge': lambda e: mixl(T.ding(91, .35, .8), T.swish(.25, .15, 1200, 4200, True)),
    'qpop': lambda e: mixl(T.blip(79, .3 * e.get('v', 1.)), np.pad(T.blip(86, .3 * e.get('v', 1.)), (int(.1 * SR), 0))),   # dấu hỏi "hử?"
    'slots': lambda e: mixl(T.pops(3, .12, 84, .5), T.sparkle(.5, .15, 93, 104, 4, 2, 'up')),
    'tap': lambda e: mixl(click(.6, .4) * .5, T._ting(mf(e.get('m', 91)), .4, .35)),
    'lensup': lambda e: mixl(T.swish(.3, .13, 900, 3600, True), np.pad(T.sparkle(.6, .15, 98, 108, 6, 5, 'up'), (int(.1 * SR), 0)), np.pad(T._ting(mf(103), .5, .16), (int(.12 * SR), 0))),   # nhỏ, đi trước câu cửa miệng
    'swish': lambda e: T.swish(e.get('d', .45), e.get('v', .4), e.get('lo', 350), e.get('hi', 2600), e.get('up', True)),
    'shimmer': lambda e: T.sparkle(e.get('d', 1.), .25 * e.get('v', 1.), 93, 108, int(6 * e.get('d', 1.)) + 2, 9, 'up'),
    'twang': lambda e: mixl(T.boing(180, .7, .4, 1.6, 22., .35), np.pad(T._ting(mf(98), .6, .2), (int(.02 * SR), 0))),   # gảy tơ như dây đàn
    'memory': lambda e: mixl(T.gliss(79, 98, .5, .2, 'harp'), T.sparkle(.6, .15, 96, 106, 5, 3, 'up')),
    'munch': lambda e: munch_(e.get('d', .8), e.get('v', 1.)),
    'silkspin': lambda e: silkspin_(e.get('d', 1.4)),
    'curl': lambda e: T.whistle(1300, 800, .45, .1),
    'pupa': lambda e: mixl(T.bubble(600, .35, .12, 1.6), np.pad(T.sparkle(.4, .15, 93, 104, 4, 4, 'up'), (int(.1 * SR), 0))),
    'unwrap': lambda e: mixl(T.paper(.3, .35, 4, 7), T.swish(.3, .15, 1000, 4200, True)),
    'wings': lambda e: train(e.get('d', 1.), int(e.get('d', 1.) / .1), lambda k: bp(noise(.08), 300, 1400) * np.sin(np.pi * t_(.08) / .08) * .2),
    'mmm': lambda e: mmm(.9),
    'bubblepop': lambda e: mixl(T.bubble(800, .35, .08, 2.0), pop(.5) * .3),
    'cluefly': lambda e: mixl(T.swish(.6, .3, 600, 4500, True, .5, .3), T.whistle(700, 1500, .55, .07)),
    'slot': lambda e: mixl(T.ding(91 + 2 * e.get('n', 0), .45, 1.0), T.sparkle(.6, .25, 96, 108, 6, 6, 'up'), np.pad(pop(.6) * .35, (int(.01 * SR), 0))),
    'roll': lambda e: mixl(lp(brown(e.get('d', 1.5)), 260) * .25, *(np.pad(click(.5, .3) * .25, (int(k * .22 * SR), 0)) for k in range(int(e.get('d', 1.5) / .22)))) * e.get('v', 1.),
    'shadow': lambda e: mixl(T.swish(e.get('d', 1.4), .3, 250, 1500, True, .5, .5), T.scurry(e.get('d', 1.4) * .7, .35, 86, 4)),
    'surprise': lambda e: T.surprise(.7 * e.get('v', 1.)),
    'giggle': lambda e: T.giggle(4, .6 * e.get('v', 1.), 86, .1, 3),
    'flap': lambda e: paperflap_(e.get('d', .8), e.get('v', 1.)),
    'zoom': lambda e: mixl(riser(.55, .7), T.whistle(420, 1250, .5, .1)),
    'label': lambda e: mixl(T.boing(300, .3, .2 * e.get('v', 1.), 2.4, 16.), T.blip(91, .25 * e.get('v', 1.))),
    'snip': lambda e: train(.3, 2, lambda k: mixl(hp(noise(.03), 3000) * env_exp(.03, .006) * .5, T.block(95 - k * 3, .3)), .9),   # kéo "xoẹt xoẹt"
    'scribble': lambda e: train(.5, 5, lambda k: bp(noise(.08), 2500, 7000) * np.sin(np.pi * t_(.08) / .08) * .18),            # bút chì sột soạt
    'tape': lambda e: mixl(T.zip_(.28, 900, 3800, .4), bp(noise(.3), 1500, 6000) * np.sin(np.pi * t_(.3) / .3) * .12),          # băng dính kêu "xoẹt"
    'cluepop': lambda e: mixl(T.boing(260 + 60 * e.get('n', 0), .35, .25, 2.4, 16.), T._ting(mf(93 + 3 * e.get('n', 0)), .4, .25)),
    'buzzin': lambda e: T.buzzup(e.get('d', .7), .3),
    'chirp': lambda e: chirp(1.),
    'silkdrop': lambda e: mixl(T.whistle(1900, 900, e.get('d', .9), .09 * e.get('v', 1.)), T.sparkle(e.get('d', .9), .15 * e.get('v', 1.), 96, 106, 5, 5, 'down')),
    'silkup': lambda e: mixl(T.whistle(800, 2000, e.get('d', 1.2) * .8, .09), T.zip_(.3, 700, 3000, .25), T.sparkle(e.get('d', 1.2), .12, 96, 106, 5, 7, 'up')),
    'tiptoe': lambda e: train(e.get('d', .5), max(2, int(e.get('d', .5) / .16)), lambda k: T.block(84 + (k % 2) * 3, .22), e.get('v', 1.)),
    'meter': lambda e: mixl(T.whistle(500, 900, .4, .07), np.pad(ding_(88 + 2 * e.get('n', 0)), (int(.4 * SR), 0))),           # cột đo dâng tới 6: "ding"
    'meterboing': lambda e: mixl(T.boing(160, .7, .45, 2.8, 18.), np.pad(T.ding(96, .45, 1.0), (int(.3 * SR), 0))),            # vọt lên 8: "boing!"
    'bodypop': lambda e: mixl(T.bubble(900 + 250 * e.get('n', 0), .35 * e.get('v', 1.), .06, 2.4), T.blip(86 + 3 * e.get('n', 0), .25)),
    'antboing': lambda e: mixl(T.boing(300 + 50 * e.get('n', 0), .3, .25, 2.6, 20.), T.tink(.25, 3600 + 300 * e.get('n', 0))),  # râu nảy "tink"
    'droop': lambda e: T.whistle(900, 450, .6, .1),
    'paperfall': lambda e: mixl(paperflap_(e.get('d', .8), .7), T.whistle(1100, 600, e.get('d', .8), .05)),
    'bzzt': lambda e: bzzt_(),
    'hmm': lambda e: mixl(T.blip(79, .25), np.pad(T.blip(84, .25), (int(.12 * SR), 0)), np.pad(T.blip(79, .2), (int(.24 * SR), 0))),
    'baitpop': lambda e: mixl(T.boing(280, .35, .25, 2.4, 16.), T.sparkle(.8, .3, 93, 108, 8, 11, 'up')),
    'hide': lambda e: mixl(T.swish(.3, .25, 600, 3000, True), np.pad(T.scurry(.35, .4, 88, 6), (int(.1 * SR), 0))),
    'lampclick': lambda e: lamp_(e.get('v', 1.)),
    'night': lambda e: T.swell(e.get('d', .9), .25, 96, 79),
    'tick': lambda e: mixl(T.block(e.get('m', 84), .4), T._ting(mf(e.get('m', 84) + 12), .25, .12)),
    'creak': lambda e: creak_(e.get('v', 1.)),
    'slip': lambda e: mixl(T.whistle(1400, 500, .5, .11), np.pad(T.wobble(150, .5, .25, 9, .2), (int(.2 * SR), 0))),
    'wrap': lambda e: mixl(T.swirl(e.get('d', .5), .4, 8, 900, 3600), T.zip_(.3, 600, 2600, .3)),
    'trampoline': lambda e: T.boing(170 + 25 * e.get('n', 1), .55, (.28 + .08 * e.get('n', 1)), 2.0, 12.),    # cục tơ nảy trên tơ, to dần
    'burst': lambda e: mixl(T.pops(5, .045, 84, .6), T.paper(.4, .4, 6, 9), np.pad(T.sparkle(.6, .3, 93, 108, 8, 13, 'up'), (int(.1 * SR), 0))),
    'stickerglow': lambda e: mixl(T._ting(mf(101), .7, .35), T.sparkle(.9, .25, 96, 108, 8, 14, 'up')),
    'ribbon': lambda e: mixl(T.boing(320, .25, .18, 2.4, 18.), T.tink(.2)),
    'stamp': lambda e: stamp_(e.get('v', 1.)),
    'cardpop': lambda e: mixl(T.boing(260 + 40 * e.get('n', 0), .35, .25, 2.4, 16.), np.pad(pop(.6) * .3, (int(.02 * SR), 0))),
    'ring': lambda e: mixl(T.swirl(.4, .2, 6, 1200, 3600), T._ting(mf(96 + 2 * e.get('n', 0)), .4, .2)),
    'cheer': lambda e: T.cheer(.9, .45, 2),
    'recall': lambda e: mixl(zing_(1.2, 1.), T.bubble(1600, .4, .06, 2.4)),                                                       # tiếng "zing" của móc trở lại
}
missing = sorted({e['type'] for e in EV} - SFX.keys())
if missing: sys.exit(f'mix.py: no sound for event types {missing}')
VERB = {'slot': .5, 'reveal': .4, 'lensiris': .3, 'glint': .3, 'titlepop': .3, 'recall': .4, 'zing': .4, 'stickerglow': .4, 'meter': .3, 'meterboing': .3,
        'trampoline': .3, 'lampclick': .2, 'stamp': .3, 'count': .2, 'print': .2, 'twang': .3}
snd = np.zeros(len(fx))
for e in EV:
    x = SFX[e['type']](e); n_ = min(len(x), int(.0015 * SR)); x = x.copy(); x[:n_] *= np.linspace(0, 1, n_)   # sườn trước 1,5 ms: bộ mã AAC không vọt đỉnh
    add(fx, x, e['t'], 1., e.get('pan', 0))
    if e['type'] in VERB: s0 = int(e['t'] * SR); k = min(len(x), len(snd) - s0); snd[s0:s0 + k] += x[:k] * VERB[e['type']]
fx += T.verb(snd, 1.2) * .35


# ---------- nền theo bối cảnh: bàn học lúc nửa đêm (dế xa ngoài cửa sổ, ù rất nhẹ của đèn bàn) · ảnh hồi bé (chim, ban ngày) · bẫy (dế rõ hơn, đồng hồ tích tắc) ----------
amb = B['amb']; rng = np.random.default_rng(22)
def zone(a, b, x, g):
    x = x[:int((b - a) * SR)]; d = len(x) / SR; tt_ = np.arange(len(x)) / SR; e = np.clip(np.minimum(tt_ / .4, (d - tt_) / .4), 0, 1)
    add(amb, x * e * g, a, 1., 0)
room = lambda d: lp(brown(d), 220) * .5 + np.sin(2 * np.pi * 120 * t_(d)) * .012          # phòng đêm + ù đèn 120 Hz rất nhỏ
def crickets(a, b, g=.012, every=.5):
    for t0 in np.arange(a, b, every):
        x = np.zeros(int(.12 * SR)); bb = np.sin(2 * np.pi * rng.uniform(4300, 4900) * t_(.022)) * np.sin(np.pi * t_(.022) / .022) ** 2
        for j in range(3): s0 = int(j * .035 * SR); x[s0:s0 + len(bb)] += bb
        add(amb, lp(x, 6500) * g, t0 + rng.uniform(0, .25), 1., rng.uniform(-.8, .8))
def birds(a, b):
    for t0 in np.arange(a + .7, b - .5, 1.9):
        if speaking(t0, .2): continue
        for k in range(2): f0 = rng.uniform(2600, 3300); add(amb, glide(f0, f0 * 1.2, .08, .05, 0.), t0 + k * .12, 1., rng.uniform(-.7, .7))
def clock(a, b):
    for i, t0 in enumerate(np.arange(a, b, .5)): add(amb, T.block((96, 91)[i % 2], .2), t0, .05, .5)
NIGHT = [(0, H['s_c1m']), (H['s_c1b'], H['s_line']), (H['s_line'], H['s_trap']), (H['s_conf'], DUR)]
for a, b in NIGHT: zone(a, b, room(b - a), .08)
for a, b in ((0, H['s_c1m']), (H['s_c1b'], H['s_line']), (H['s_conf'], H['s_rollo']), (H['s_bye'], DUR)): crickets(a, b)
zone(H['s_c1m'], H['s_c1b'], lp(brown(H['s_c1b'] - H['s_c1m']), 300) * .3, .05); birds(H['s_c1m'], H['s_c1b'])
zone(H['s_trap'], H['s_conf'], room(H['s_conf'] - H['s_trap']), .09); crickets(H['s_trap'], H['s_conf'], .02, .35); clock(LAMP0 + .9, H['s_snap'])


# ---------- giọng ----------
vox = np.zeros(N)
for L in LINES:
    y, sr = sf.read(os.path.join(HERE, 'voice', L['id'] + '.wav'))
    if y.ndim > 1: y = y.mean(1)
    y = soxr.resample(y, sr, SR); s0 = int(L['t'] * SR); e = min(N, s0 + len(y)); vox[s0:e] += y[:e - s0]
vox = lp(vox, 8500, 4)                                    # giọng nâng cao độ (Dot) có tiếng rít ~9,5 kHz: bộ mã AAC vọt đỉnh ở đó; trên 8,5 kHz chỉ còn tiếng xì
vox = compress(norm(vox, .9), thr=.22, ratio=3.5); vox = norm(vox, .85)


# ---------- trộn ----------
mus, fx, amb = B['mus'][:N], B['fx'][:N], B['amb'][:N]
def rms(x): x = x[np.abs(x).max(1) > 1e-4] if x.ndim > 1 else x[np.abs(x) > 1e-4]; return float(np.sqrt(np.mean(x ** 2))) if len(x) else 0.
# nâng nhẹ các đoạn nhạc quá nhỏ (đoạn rải, đoạn lắng dưới lời): nửa đường tới mức chung, tối đa +12 dB (QUALITY.md §4: không có lỗ im)
from scipy.ndimage import uniform_filter1d as _uf
_e = np.sqrt(_uf((mus ** 2).mean(1), int(.6 * SR)) + 1e-14); _ref = np.percentile(_e[_e > 1e-5], 70)
mus = mus * _uf(np.clip((_ref / np.maximum(_e, 1e-7)) ** .5, 1, 4), int(.3 * SR))[:, None]
mus = mus * (.075 / max(rms(mus), 1e-9))
fx = fx * (.55 / max(np.abs(fx).max(), 1e-9))
from scipy.ndimage import maximum_filter1d, uniform_filter1d
ve = uniform_filter1d(maximum_filter1d(np.abs(vox), int(.05 * SR)), int(.25 * SR))
mus = T.duck(mus, ve, .66, .3); fx = T.duck(fx, ve, .6, .3); amb = T.duck(amb, ve, .7, .5)
mus, GUARD = T.speech_guard(mus, fx, vox, LINES, 11.)               # (Đệm lời) vòng bảo vệ lời rõ: chỉ hạ nhạc ở câu còn thiếu
print('speech_guard:', ', '.join(f'{k} {s_:.1f} dB → −{c:.1f} dB' for k, s_, c in GUARD) or 'không câu nào phải hạ')   # (Đệm lời) nhạc nhường giọng vừa đủ: dải giọng −9 dB (cũ −15), ngoài dải −3 dB (cũ −7)
V = np.stack([vox, vox], 1)
mix = mus + fx + amb + V
mix = np.tanh(mix * 1.1) / 1.1
mix, I_mix, ceil_db = T.master(mix, 10.5)   # (Đệm lời) lớp đệm dày hơn: chừa 0,5 dB cho bộ mã AAC; print(f'master: {I_mix:.1f} LUFS, true-peak ceiling {ceil_db:.1f} dBFS')
nf = int(.02 * SR); mix[:nf] *= np.linspace(0, 1, nf)[:, None]
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR, subtype='PCM_24')
for k, x in (('mus', mus), ('fx', fx), ('vox', V)): sf.write(os.path.join(HERE, 'out', f'stem_{k}.wav'), x.astype(np.float32), SR, subtype='PCM_16')
print('out/mix.wav', f'{len(mix) / SR:.2f} s')
