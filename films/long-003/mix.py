"""Âm thanh của LONG-003 → out/mix.wav (48 kHz stereo): nhạc "Starlight Shuffle" (MUSIC.md, SOUND-PLAN.md) dựng bằng lớp nhịp theo cảnh
(_shared/audio/groove.py, plan=True, accomp=True: mỗi cảnh một phong cách, một BPM, một nhạc cụ hát chính, một cách chuyển; dưới lời vẫn đủ đệm)
+ điểm nhấn viết tay (nhạc hiệu, mô-típ bí mật đô–mi–sol ở năm ô "cách tìm đường" và ba câu ôn bài, vuốt đàn hạc lên Dải Ngân Hà,
timpani "THỊCH", "ta-da"), tiếng động theo events.json, nền vườn đêm theo bối cảnh, giọng.
python mix.py   (cần timeline.json + voice/*.wav từ tools/lines.mjs, core/tts/tts.py và _shared/voicefx.py, events.json từ core/render/events.mjs)
Mọi âm thanh tổng hợp bằng code (_shared/audio/band.py, toon.py, core/audio/sfx.py); không dùng mẫu của bên thứ ba.
Luôn vui tươi (QUALITY.md §4, 14/11/2026): mọi cảnh giọng trưởng, ≥ 108 BPM, năng lượng ≥ 2; không hồi hộp, không điệu rình rập; khựng hài ≤ 1,2 s."""
import os, sys, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio')); sys.path.insert(0, os.path.join(LIB, '_shared', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, whoosh, thump, pop, click, step, compress, add
from band import fade, mf, pluck, marimba, bassn, kick, bell, horn, pad, riser, glide, jingle, pizz, xylo, flute, celesta, harp, vibes, upright
from band import timpani, trumpet, trombone, kazoo, tada, secret, piano, strings, triangle
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


# ---------- nhạc: "Starlight Shuffle" — diễu hành đêm sao GIỌNG TRƯỞNG; mỗi cách tìm đường một màu nhạc ----------
mus = B['mus']
NOPE1, MONSTER, YES = L0('blink', 'Nope!'), L0('crumb', 'Is it a monster?'), L0('loupe', 'Yes! NOW!')
NOPE2 = L0('dot', 'Nope!')
# khựng hài (≤ 1,2 s, còn một lớp mỏng): máy ngửa lên trời, trước "Nope!" của Blink · ngay sau tiếng THỊCH · trước "Yes! NOW!"
REST = ((NOPE1 - 1.0, NOPE1), (H['thump'] + .12, MONSTER), (YES - .7, YES - .05))
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

FILL = [H['dizzy'] + .6, H['trailEnd'] + .8, H['s_lp2'] - .9, H['clear'] + 1.0, H['slot5']]   # lúc mỗi ô "cách tìm đường" được lấp (film.js)
QUIZ = [('loupe', 'Ants follow...?', 'crumb', 'Smell trails!', 0), ('loupe', 'Rollo follows...?', 'rollo', 'The stars!', 0), ('loupe', 'And bees dance with...?', 'dot', 'The sun!', 0)]
STARS_END = L0('dot', 'The stars!')
ASK = [(Lend('crumb', 'Can you find the sun?'), NOPE1 - 1.0), (Lend('crumb', 'Is it a monster?'), NOPE2)] + [(Lend(a, b), L0(c, d, n)) for a, b, c, d, n in QUIZ] + [
    (Lend('loupe', 'So... what does Rollo follow?'), STARS_END)]                                        # nhịp chờ trẻ trả lời to
# vùng giai điệu của lớp nhịp nhường chỗ: điểm nhấn viết tay và các nhịp chờ trẻ trả lời
AVOID = [(0, 1.0), (H['jingle'] - .05, H['s_map'])] + [(s - .1, s + 1.3) for s in FILL] + [(a, b) for a, b in ASK] + [
    (H['crane'], H['crane'] + 2.6), (H['thump'] - .05, MONSTER), (H['hand'] + .8, H['lift'] + 1.0), (H['pov'], H['pov'] + 1.2), (YES - .7, YES + 1.6),
    (H['glow'], H['glow'] + 3.8), (H['newCorner'], H['newCorner'] + 1.8), (H['recall'] - .05, H['recall'] + 1.0), (H['flip'], H['splash'] + 1.0), (STARS_END - .05, DUR)] + [
    (L0(c, d, n) - .05, Lend(c, d, n) + 1.0) for a, b, c, d, n in QUIZ]
# accomp=True (QUALITY.md §4 (Đệm lời)): dưới lời vẫn đủ đệm hợp âm + bè phụ ở dải cao; đổi cảnh luôn nghe ra.
# Chủ đề "Find the way home" (sol–mi–đô–mi–sol–đô'–la–sol): nhạc cụ hát chính của từng cảnh hát lại, cách nhau ≥ 10 s.
G = Groove(M, BEAT, LINES, seed=33, avoid=AVOID, plan=True, accomp=True)
G.theme([7, 4, 0, 4, 7, 12, 9, 7], [0, 1, 2, 3, 4, 6, 7, 8], every=10.)
S = G.sec
# — mở —
S('móc · Miss Loupe trên viên tròn · cả đội', 0, H['s_title'], 'starwalk', 'F', 'F Dm Gm7 C7', bass='pizzbass', comp='pluck', arp='celesta', lead='celesta', kit='star', energy=2, cue=False,
  bpm=120, mood='playful', arc='open', what='Vườn đêm dưới Dải Ngân Hà: Miss Loupe chạy trên đỉnh viên tròn của Rollo, LOST AT NIGHT!; Crumb chạy theo xin cầm kính; viên tròn vấp sỏi, cô bay vèo; lia nhanh sang cả đội',
  emo='bất ngờ, tinh nghịch, tò mò', why='Điệu riêng của tập: shuffle đêm sao giọng trưởng 120 BPM (ukulele gảy phách lẻ, celesta rải 3+3+2 như sao lấp lánh, chổi trống, shaker, vỗ tay nhẹ); nhạc chạy từ giây 0.')
G.mark('nhạc hiệu', H['jingle'], H['s_map'], 'jingle', 'F', 'horn marimba bell', 3, mood='epic', arc='open', what='Logo BIG SECRETS trên trời sao, Miss Loupe nhỏ xíu bay ngang',
       emo='háo hức', why='Nhạc hiệu 2 s của kênh, giống hệt mọi tập (video dài giữ nhạc hiệu 2 s).')
# — bản đồ, lập đội —
S('bản đồ vườn · "Off my map?!"', H['s_map'], H['s_crew'], 'polka', 'Bb', 'Bb F7 Bb Eb', bass='tuba', comp='pluck', lead='reed', kit='clap', energy=2,
  bpm=112, mood='funny', arc='build', what='Trang MY GARDEN MAP, sao HOME sáng; Rollo chỉ "straight that way"; mũi tên chấm chạy ra khỏi mép bản đồ, dấu "?" to; các trang của Albie phần phật',
  emo='buồn cười, lo một chút mà vui', why='Polka 112 BPM, clarinet hát chính "nghiêm túc giả" cho người giữ bản đồ; tuba "oom-pah"; dưới giọng Albie và Rollo bỏ bass.')
S('lập đội · điểm danh 1–5', H['s_crew'], H['s_sun'], 'gallop', 'C', 'C G C F', bass='bassn', comp='pizz', lead='xylo', kit='toy', energy=3, tr='pickup',
  bpm=124, mood='bouncy', arc='build', what='Crumb: "I\'ll lead the way!"; cả đội xếp hàng, Dot điểm danh, số 1–5 nảy trên đầu từng người; đèn Blink bật; Albie vẫy trang "Come home safe!"',
  emo='quyết tâm, háo hức', why='Nhịp kép 124 BPM (thấy nhanh lên): xylophone hát chính, dây pizzicato đệm; mỗi số điểm danh một tiếng "ding" (tiếng động).')
# — cách 1 · mặt trời —
S('cách 1 · Waggle nhảy số 8', H['s_sun'], NOPE1 - 1.0, 'hop', 'G', 'G C D7 G', bass='bassn', comp='pluck', lead='marimba', kit='bongo', energy=2,
  bpm=120, mood='happy', arc='build', what='Waggle vọt lên, nhảy hình số 8 sáng; "Bees dance to show the way… using the sun!"; "Can you find the sun?"; máy ngửa lên trời: chỉ có sao',
  emo='vui, nhún nhảy, chờ đợi', why='Nảy lệch phách 120 BPM, marimba và bongo: điệu nhảy lắc mông của ong; giai điệu nhường chỗ cho tiếng mõ "tích–tắc" lúc chờ trẻ tìm mặt trời.')
G.mark('khựng · "Nope!"', NOPE1 - 1.0, NOPE1, 'break', 'G', 'vibes', 2, mood='funny', arc='build', what='Trời chỉ có sao: khựng hài trước "Nope!" của Blink', emo='hồi hộp vui',
       why='Khựng 1,0 s (vibraphone run run, không im hẳn) để "Nope!" bật ra.')
S('"Nope!" · Waggle chóng mặt', NOPE1, H['s_lp1'], 'hop', 'D', 'D G A7 D', bass='tuba', comp='marimba', lead='trombone', kit='comic', energy=2,
  bpm=120, mood='funny', arc='build', what='"NOPE!"; Waggle xoay vòng chóng mặt, đáp lên viên tròn; Rollo: "No sun tonight, little bee."; ô 1 lấp; Crumb: "Then I\'ll use my antennae!"',
  emo='buồn cười, không nản', why='Cùng điệu nảy nhưng sang Rê trưởng, trombone "wah" hài và mõ hai cao độ cho cú chóng mặt; mô-típ bí mật khi ô 1 lấp.')
# — Miss Loupe lần 1 —
S('Miss Loupe · "I stay put."', H['s_lp1'], H['s_ants'], 'sway', 'F', 'F Am Bb C', bass='pizzbass', comp='pluck', arp='harp', lead='harp', kit='brush', energy=2,
  bpm=108, mood='cute', arc='build', what='Rìa vườn: Miss Loupe kẹt trong khe đá, nhún vai cười, ngắm sao: "I\'m lost… so I stay put. My friends will find me!"; Spindle trên mạng nhện',
  emo='ấm áp, yên tâm', why='Nửa nhịp đung đưa 108 BPM, đàn hạc: cô vẫn ổn và vui; nhạc thưa để lời dặn "đứng yên chờ" thật rõ.')
# — cách 2 · đường mùi —
S('cách 2 · khung ngửi · đàn kiến', H['s_ants'], H['s_march'], 'skip', 'C', 'C F G7 C', bass='bassn', comp='pluck', lead='pizz', kit='wood', energy=2,
  bpm=116, mood='bouncy', arc='build', what='Crumb chạm râu xuống đất, khung ngửi mở, chấm mùi hồng chạy; gia đình kiến bò tới chạm râu chào; Dot đếm 1–6',
  emo='tò mò, vui gặp người nhà', why='Shuffle nhảy chân sáo 116 BPM, dây pizzicato hát như bước kiến tí tách; mõ gỗ; mỗi con kiến một số đếm (tiếng động).')
S('đi theo đường mùi · "UNDER! OVER!"', H['s_march'], H['s_edge0'], 'skip', 'G', 'G C D7 G', bass='tuba', comp='pizz', lead='xylo', kit='toy', energy=3,
  bpm=116, mood='bouncy', arc='build', what='Máy dolly theo hàng kiến: qua cây nấm, chui dưới chiếc lá "UNDER!", trèo qua hòn sỏi "OVER!"',
  emo='nhịp nhàng, phiêu lưu nhỏ', why='Cùng nhịp chân sáo nhưng sang Sol, năng lượng 3, xylophone hát và tuba: nhịp đi đường "qua, dưới, trên".')
S('đường mùi tắt · "THE END?"', H['s_edge0'], H['s_think'], 'bounce', 'F', 'F Bb C7 F', bass='bassn', comp='pluck', lead='bassoon', kit='comic', energy=2, tr='drop',
  bpm=112, mood='funny', arc='build', what='Bức tường cỏ cao: "The trail ends here!" – "The edge of the garden."; ô 2 lấp; đàn kiến vẫy "bye!" quay về',
  emo='ngạc nhiên, buồn cười', why='Pop nảy 112 BPM, bassoon hát chính "ơ kìa": thử thách mới mà không buồn; mô-típ bí mật khi ô 2 lấp.')
# — cách 3 · kiến sa mạc —
S('cách 3 · bóng nghĩ: kiến sa mạc', H['s_think'], H['s_count'], 'quest', 'D', 'D G A D', bass='upright', comp='strings', arp='harp', lead='flute', kit='bongo', energy=2, tr='gliss',
  bpm=112, mood='magic', arc='build', what='Bóng nghĩ của Crumb phình ra: sa mạc nắng, kiến sa mạc chân dài đi ngoằn ngoèo ra, nhặt hạt, đi thẳng một mạch về tổ, vạch bước sáng dần; "STRAIGHT HOME!"',
  emo='kỳ diệu, vỡ lẽ', why='Phiêu lưu nước kiệu 112 BPM, sáo và đàn hạc, bongo như bước chân trên cát: bí mật chỉ có trong video dài; mỗi vạch bước một "tick" đi lên (tiếng động).')
S('Dot đếm 10 bước', H['s_count'], H['s_lp2'], 'bounce', 'C', 'C F G C', bass='bassn', comp='pluck', lead='toypiano', kit='toy', energy=2, tr='pickup',
  bpm=118, mood='happy', arc='build', what='Cả đội bước vào cỏ cao, Dot đếm 1…10, số nảy trên từng dấu chân; "10 STEPS!"; ô 3 lấp',
  emo='vui, đếm cùng nhau', why='Pop nảy 118 BPM, piano đồ chơi hát: trò đếm bước; mỗi bước một nốt đi lên (tiếng động).')
# — Miss Loupe lần 2 —
S('Miss Loupe · "BLURRY!" · cousin Telly', H['s_lp2'], H['s_stars'], 'twinkle', 'Bb', 'Bb F Eb F', bass='pizzbass', arp='celesta', lead='vibes', kit='tri', energy=2,
  bpm=108, mood='cute', arc='build', what='Miss Loupe nghiêng kính nhìn xa: sao nhoè thành chấm to "BLURRY!"; "I wish cousin Telly were here!"; một ánh lóe nhỏ trên cọc hàng rào',
  emo='dễ thương, buồn cười', why='Hộp nhạc lấp lánh 108 BPM, vibraphone và celesta: gag nhìn xa nhoè; ánh lóe nhỏ gài trước Uncle Telly có một tiếng "ting" riêng.')
# — cách 4 · Dải Ngân Hà —
S('"It all looks the same!" · Rollo trèo lên', H['s_stars'], H['s_sky'], 'hop', 'Eb', 'Eb Ab Bb7 Eb', bass='bassn', comp='pizz', lead='reed', kit='wood', energy=2, tr='pickup',
  bpm=116, mood='playful', arc='build', what='Giữa cỏ cao chỗ nào cũng giống nhau; Rollo: "Leave that to me.", trèo lên đỉnh viên tròn, xoay một vòng, ngước nhìn trời',
  emo='bối rối vui, tin cậy', why='Nảy lệch phách 116 BPM ở Mi giáng, clarinet hát: Rollo điềm tĩnh nhận việc; dưới giọng Rollo bỏ bass.')
S('Dải Ngân Hà (cảnh đặc trưng 1)', H['s_sky'], H['s_track'], 'float', 'C', 'C Am F G', bass='pizzbass', comp='strings', arp='celesta', lead='celesta', energy=3, tr='swell',
  bpm=110, mood='magic', arc='build', what='Máy ngửa vút lên: Dải Ngân Hà to dần và sáng lên chéo khung, chữ MILKY WAY; "Wow… a river of stars!" – "It keeps me rolling straight."',
  emo='choáng ngợp, kỳ diệu', why='Rải lơ lửng 110 BPM, celesta và dàn dây: âm lượng dâng ở phát hiện; vuốt đàn hạc viết tay đi lên cùng máy quay.')
S('vệt lăn thẳng tắp', H['s_track'], H['clouds'] - .3, 'stride', 'F', 'F D7 G7 C7', bass='tuba', comp='piano', lead='piano', kit='comic', energy=2, tr='pickup',
  bpm=116, mood='funny', arc='build', what='Nhìn thẳng từ trên xuống: Rollo lăn, để lại vệt thẳng tắp, cả đội nối đuôi; "So straight!"',
  emo='thích thú', why='Ragtime piano 116 BPM: nhịp lăn đều "oom-pah"; nhẹ để chữ STRAIGHT! rõ.')
S('mây che sao · "WIGGLES!"', H['clouds'] - .3, H['clear'], 'stride', 'Bb', 'Bb G7 C7 F7', bass='tuba', comp='pianohi', lead='kazoo', kit='wood', energy=2, tr='drop',
  bpm=116, mood='funny', arc='build', what='Bóng mây trôi qua, ô trời nhỏ bị che; vệt lăn ngoằn ngoèo, cả đội đi vòng vèo: "No stars… no straight!" – "Rollo is rolling in wiggles!"',
  emo='buồn cười, lắc lư', why='Vẫn ragtime nhưng sang Si giáng, kazoo "vè vè" lắc lư theo vệt ngoằn ngoèo: bí mật chỉ có trong video dài (mây che sao thì không lăn thẳng được).')
S('mây tan · "Straight on!"', H['clear'], H['s_telly'], 'stride', 'F', 'F Bb C7 F', bass='tuba', comp='piano', lead='xylo', kit='clap', energy=3, tr='riser',
  bpm=116, mood='funny', arc='build', what='Mây trôi qua, sao trở lại, vệt lăn thẳng lại: "Stars are back. Straight on!"; ô 4 lấp',
  emo='nhẹ nhõm, phấn khởi', why='Ragtime trở về Fa trưởng, năng lượng 3, xylophone và vỗ tay: thẳng lại rồi; mô-típ bí mật khi ô 4 lấp.')
# — cách 5 · ánh lóe (điệu riêng trở lại) —
S('Uncle Telly trên cọc · qua ống nhòm', H['s_telly'], H['s_signal'], 'starwalk', 'D', 'D Bm Em7 A7', bass='pizzbass', comp='pluck', arp='celesta', lead='glock', kit='star', energy=2, tr='pickup',
  bpm=120, mood='playful', arc='build', reprise=True, what='Rất xa: Uncle Telly trên cọc hàng rào quét ống nhòm; nhìn qua hai vòng tròn: Miss Loupe vẫy "Telly! Over here!"; tròng kính nháy ba lần',
  emo='hy vọng, tinh nghịch', why='Shuffle đêm sao trở lại (cố ý: cuộc tìm kiếm tới gần) ở Rê trưởng, glockenspiel hát; mỗi ánh lóe một tiếng "ting" (tiếng động).')
S('ba ánh lóe · mật mã của Blink', H['s_signal'], H['s_edge'], 'starwalk', 'G', 'G Em Am7 D7', bass='bassn', comp='pluck', arp='vibes', lead='horn', kit='clap', energy=3,
  bpm=120, mood='playful', arc='build', reprise=True, what='Ba ánh lóe xa, Dot đếm 1-2-3; "Uncle Telly! He sees far!"; Blink nháy đáp "Blink! Blink! Blink!"; vệt sáng chỉ chỗ; ô 5 lấp: "She\'s over there! Let\'s go!"',
  emo='háo hức, phấn khích', why='Cùng điệu riêng nhưng sang Sol, năng lượng 3, kèn đồ chơi hát và vỗ tay: trò "mật mã" hỏi–đáp bằng ánh sáng; mô-típ bí mật khi ô 5 lấp.')
# — cao trào · rìa vườn —
S('Crumb tự soi kỹ · "A sparkle!"', H['s_edge'], H['pull'], 'bounce', 'A', 'A D E A', bass='bassn', comp='pizz', lead='flute', kit='toy', energy=2, tr='pickup',
  bpm=116, mood='happy', arc='build', what='Cả đội tới phiến đá; Crumb soi kỹ một mình: "Look closely…"; đốm lấp lánh trong khe: "A sparkle! Miss Loupe!" – "Crumb! You found me!"',
  emo='chăm chú, vỡ oà', why='Pop nảy 116 BPM ở La trưởng, sáo hát: mạch của Crumb (tự tìm ra) nhẹ và sáng; đốm lấp lánh có tiếng "ting" riêng.')
S('"HEAVE!" (cao trào)', H['pull'], H['thump'] + .12, 'hero', 'C', 'C F G C', bass='bassn', comp='strings', lead='trumpet', kit='epic', energy=3, tr='riser',
  bpm=132, mood='epic', arc='peak', what='Cả đội nối thành chuỗi kéo "HEAVE!", khe đá không nhúc nhích; THỊCH: đất rung một nhịp, bóng lớn phủ lên',
  emo='gắng sức vui, bất ngờ', why='Cao trào anh hùng 132 BPM: kèn đồng, dàn dây, timpani; "THỊCH" là một nhịp timpani viết tay rồi khựng.')
G.mark('khựng · sau "THỊCH"', H['thump'] + .12, MONSTER, 'break', 'C', 'celesta', 2, mood='funny', arc='peak', what='Bóng lớn phủ lên cả đội, ai cũng ngước nhìn', emo='ngạc nhiên vui',
       why='Khoảng lặng có chủ đích 0,8 s ngay sau tiếng THỊCH (celesta lấp lánh rất nhỏ, giọng trưởng, không im hẳn).')
S('"Nope! It\'s the Giant." · bàn tay nâng Miss Loupe', MONSTER, H['s_pov'], 'hero', 'F', 'F Bb C F', bass='bassn', comp='strings', lead='horn', arp='xylo', kit='epic', energy=3,
  bpm=132, mood='epic', arc='peak', what='"Is it a monster?" – "NOPE!" – "It\'s the Giant. A gentle friend."; bàn tay hạ xuống nhẹ nhàng, nghiêng phiến đá, Miss Loupe bật ra đứng lên tay, được nâng lên',
  emo='nhẹ nhõm, phấn khích', why='Vẫn cao trào 132 BPM nhưng sang Fa, kèn đồ chơi ấm thay trumpet, xylophone chạy: người khổng lồ là bạn; giai điệu nhường chỗ lúc chờ trẻ trả lời.')
S('góc nhìn The Giant (cảnh đặc trưng 2) · mở đường về', H['s_pov'], H['s_found'], 'float', 'Bb', 'Bb F Gm Eb', bass='pizzbass', comp='pluck', arp='celesta', lead='harp', energy=3, tr='gliss',
  bpm=112, mood='magic', arc='peak', reprise=True, what='Nhìn qua chính kính của Miss Loupe: cả đội phóng to vẫy chào "HELLO!"; bàn tay đặt cô xuống, gạt chiếc lá, sao sáng dọc lối về; bàn tay vẫy chào',
  emo='kỳ diệu, biết ơn', why='Rải lơ lửng trở lại (cùng mạch "kỳ diệu" với Dải Ngân Hà) ở Si giáng, đàn hạc hát: âm lượng dâng khi kính mở to.')
# — mạch của Crumb —
S('"…all by yourself!" · "Can I hold the lens… NOW?"', H['s_found'], YES - .7, 'sunny', 'C', 'C F G C', bass='bassn', comp='pluck', lead='marimba', kit='toy', energy=2, tr='pickup',
  bpm=120, mood='happy', arc='end', what='Miss Loupe: "Crumb, you looked closely… all by yourself!"; Crumb mắt hy vọng: "Can I hold the lens… NOW?"',
  emo='tự hào, hồi hộp vui', why='Ukulele quạt 120 BPM, marimba đáp: ấm và nắng dù là đêm; câu hỏi cả mùa của Crumb sắp được trả lời.')
G.mark('khựng · trước "Yes! NOW!"', YES - .7, YES - .05, 'break', 'C', 'vibes', 2, mood='cute', arc='end', what='Crumb nín thở chờ', emo='hồi hộp vui',
       why='Khoảng lặng có chủ đích 0,65 s trước "Yes! NOW!" (vibraphone rất nhỏ).')
S('"Yes! NOW!" · Crumb ôm kính', YES - .05, H['s_way'], 'sunny', 'G', 'G C D G', bass='bassn', comp='pluck', lead='xylo', kit='clap', energy=3, cue=False,
  bpm=120, mood='happy', arc='end', what='"Yes! NOW!"; Crumb ôm cán kính, mắt to trong kính; Miss Loupe cười',
  emo='vỡ oà, hạnh phúc', why='Ukulele quạt lên Sol trưởng, năng lượng 3, xylophone và vỗ tay; "ta-da" viết tay ngay sau lời.')
# — đường về, về nhà —
S('đường về · ôn bài', H['s_way'], H['s_home'], 'starwalk', 'C', 'C Am Dm7 G7', bass='bassn', comp='banjo', arp='celesta', lead='banjo', kit='star', energy=2, tr='fill',
  bpm=120, mood='bouncy', arc='end', reprise=True, what='Cả đội đi về dưới Dải Ngân Hà, Crumb ôm kính đi đầu; ba câu đố: "Ants follow…?" – "Smell trails!", "Rollo follows…?" – "The stars!", "And bees dance with…?" – "The sun!"',
  emo='vui, tự tin', why='Shuffle đêm sao làm nhạc đi đường về: banjo hát chính, celesta rải; mỗi đáp án một mô-típ bí mật; giai điệu nhường chỗ lúc chờ trẻ trả lời.')
S('về tới nhà', H['s_home'], H['s_glow'], 'polka', 'F', 'F C7 F Bb', bass='tuba', comp='pluck', lead='accordion', kit='clap', energy=3, tr='pickup',
  bpm=120, mood='funny', arc='end', what='Albie nhảy cẫng, tab dựng đứng: "You\'re home! All of you!"',
  emo='mừng rỡ', why='Polka 120 BPM, accordion: màu của Albie trở lại (gọi lại cảnh bản đồ), lần này mừng rỡ.')
S('bản đồ sáng lên · góc mới', H['s_glow'], H['s_song'], 'twinkle', 'G', 'G D Em C', bass='pizzbass', arp='harp', lead='glock', kit='tri', energy=2, tr='swell',
  bpm=112, mood='magic', arc='end', what='Chín chỗ của Mùa 1 sáng lần lượt, đường đi đêm nay sáng xuyên qua; Albie dán thêm góc GARDEN EDGE',
  emo='kỳ diệu, tự hào', why='Hộp nhạc lấp lánh 112 BPM, glockenspiel và đàn hạc: mỗi chỗ sáng một nốt đi lên (viết tay); "ta-da" ở góc mới.')
# — The Six Legs Song —
SONG3 = L0('loupe', 'Two little antennae, sniff and see...')
S('The Six Legs Song · câu 1–2', H['s_song'], SONG3 - .15, 'bounce', 'C', 'C F G C', bass='bassn', comp='pluck', lead='kazoo', kit='clap', energy=3, tr='fill',
  bpm=120, mood='playful', arc='end', what='Cả dàn nhún trên trang bản đồ, chữ nảy từng từ: "Six legs, six legs, count them with me!" – "Head, thorax, abdomen… one, two, three!"',
  emo='vui, đọc theo nhịp', why='Pop nảy đúng 120 BPM (chữ và cả dàn nhún theo phách của phim), vỗ tay 2–4, kazoo đáp lời giữa các câu.')
S('The Six Legs Song · câu 3–4 · "Not you, Spindle!"', SONG3 - .15, H['s_msg'], 'bounce', 'F', 'F Bb C F', bass='tuba', comp='banjo', lead='horn', kit='toy', energy=3,
  bpm=120, mood='playful', arc='end', what='"Two little antennae, sniff and see… That\'s a bug! That\'s a bug!"; Spindle thả xuống: "BZZT! Not you, Spindle!"; Spindle cười, kéo tơ lên',
  emo='vui, buồn cười', why='Cùng nhịp 120 nhưng sang Fa, kèn đồ chơi và banjo: nửa sau của bài; trombone "bwa-bwa" viết tay ở "BZZT!".')
# — thông điệp, Spindle, gag cuối —
S('thông điệp · "Look closely…"', H['s_msg'], H['s_spot'], 'sway', 'Bb', 'Bb F Gm Eb', bass='pizzbass', comp='pluck', lead='piano', kit='brush', energy=2,
  bpm=108, mood='cute', arc='end', what='Dưới Dải Ngân Hà: "Look closely… and you\'ll always find your way!"; chữ LOOK CLOSELY!',
  emo='ấm áp', why='Nửa nhịp đung đưa 108 BPM, piano: lắng lại một nhịp cho thông điệp, vẫn giọng trưởng.')
S('"Did you spot Spindle?"', H['s_spot'], H['s_bye'], 'stride', 'G', 'G E7 A7 D7', bass='tuba', comp='pianohi', lead='piano', kit='comic', energy=2, tr='drop',
  bpm=126, mood='funny', arc='end', what='Ba khung nhỏ bật ra lần lượt (móc, rìa vườn, góc nhìn The Giant), vòng tròn khoanh Spindle',
  emo='thích thú, tinh nghịch', why='Ragtime piano 126 BPM: trò "tìm Spindle"; mỗi khung một nốt.')
S('gag cuối · Crumb trên viên tròn (gợi móc)', H['s_bye'], H['flip'], 'starwalk', 'F', 'F D7 Gm7 C7', bass='pizzbass', comp='pluck', arp='celesta', lead='horn', kit='star', energy=3, tr='fill',
  bpm=124, mood='playful', arc='end', reprise=True, what='Lại một bạn chạy trên viên tròn của Rollo: "Crumb! Come back!" – "Not NOW! Yippee!"; Rollo lăn tới mép trang: "That\'s the END of the page!"',
  emo='tinh nghịch, cười to', why='Shuffle đêm sao trở lại đủ ban (cố ý, nối về móc): kèn đồ chơi hát, năng lượng 3, 124 BPM.')
S('lật trang · "SPLASH!" · "The stars!"', H['flip'], DUR, 'starwalk', 'Bb', 'Bb Gm C7 F', bass='bassn', comp='vibes', arp='harp', lead='glock', kit='tri', energy=2, cue=False,
  bpm=120, mood='playful', arc='end', reprise=True, what='Lật trang: "TÕM!", trang ao xanh (Mùa 2); "Oh my. It\'s a pond!"; "So… what does Rollo follow?" – "THE STARS!"',
  emo='bất ngờ, vui', why='Vẫn điệu riêng nhưng màu nước: glockenspiel chạy xuống tới tiếng "tõm", vibraphone và đàn hạc; "ta-da" Fa trưởng ngay sau "The stars!".')
# câu đáp viết tay (đếm trong báo cáo): mô-típ bí mật ở năm ô và ba đáp án, vuốt Dải Ngân Hà, chín chỗ trên bản đồ, glockenspiel lật trang
G.answer(*FILL, *(Lend(c, d, n) + .02 for a, b, c, d, n in QUIZ), H['crane'], H['glow'], H['flip'], H['recall'])
G.play(); os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
G.save(os.path.join(HERE, 'out', 'music.json'), color='"Starlight Shuffle" (diễu hành đêm sao giọng trưởng: ukulele gảy phách lẻ, celesta rải như sao lấp lánh, chổi trống, shaker, vỗ tay nhẹ)')
# nền trầm rất mỏng (nốt gốc + quãng năm, dưới 250 Hz: không chạm dải giọng) cho các điệu thưa, để nhạc không đứt giữa hai nốt ngắn
from groove import chord as _chord
for S_ in G.S:
    if S_['hand'] or S_['style'] == 'break': continue
    r = 36 + (_chord(S_['key'].rstrip('m') or S_['key'])[0] - 36) % 12
    add(mus, pad([r, r + 7], S_['t1'] - S_['t0'] + .4), S_['t0'], .5, 0)

# — điểm nhấn viết tay —
J = jingle(); s = int(H['jingle'] * SR); mus[s:s + len(J)] += J * .9                                       # nhạc hiệu 2 s, giống hệt mọi tập
strum(celesta, (65, 69, 72, 77), 0., .3, 1.4, .02); M(upright(41, .6), 0., .9)                            # hợp âm Fa ở khung 0 (nhạc chạy từ giây 0)
seq(lambda m, d: xylo(m, d), (77, 81, 84), .35, .12, .3, .2, d=.2)                                         # "da-da-DA" theo chữ móc
for i, t in enumerate(FILL):                                                                              # ô "cách tìm đường" lấp: mô-típ bí mật đô–mi–sol, mỗi ô cao hơn
    root = (72, 74, 76, 77, 79)[i]; secret(M, celesta, root, t - .05, .15, .5, .3, last=12); M(bell(root + 24, .4, 1.2), t + .5, .3, .3)
seq(xylo, (79, 76, 72), Lend('blink', 'Nope!') + .05, .1, .3, .2)                                          # "Nope!" của Blink: xylophone đi xuống ngay sau lời
# Dải Ngân Hà: vuốt đàn hạc đi lên cùng máy quay, celesta rải, chuông ở đỉnh
M(T.gliss(60, 96, 1.6, .35, 'harp'), H['crane'], .9); seq(celesta, (72, 76, 79, 84, 88, 91, 96), H['crane'] + .5, .22, .3, .25, d=1.0)
M(bell(96, .4, 1.6), H['crane'] + 2.1, .3, .3); strum(strings, (60, 64, 67, 72), H['crane'] + 2.1, .22, .5, .02)
for k in range(8): M(kazoo(58 + (0, 3, -2, 4, -1, 3, 0, 2)[k], .22), H['wiggle'] + .15 + k * .3, .22, (-.3, .3)[k % 2])   # vệt ngoằn ngoèo: kazoo lắc lư
for d_ in (.1, .7, 1.3): M(triangle(.5, .6), H['tellyFlash'] + d_, .3, .4)                                # Uncle Telly nháy: triangle
for i, d_ in enumerate((.1, .6, 1.1)): M(glock(91 + i * 2, .5), H['tellyAns'] + d_, .25, .4)              # nháy đáp: glockenspiel đi lên
M(timpani(36, 1., 1.2), H['thump'], .7); M(timpani(43, .7, .8), H['thump'] + .02, .3)                     # THỊCH: một nhịp timpani
M(T.gliss(65, 89, .7, .3, 'harp'), H['hand'] + .9, .8); seq(flute, (77, 81, 84, 89), H['lift'], .2, .3, .1, d=.4)   # Miss Loupe bật ra, được nâng lên
strum(harp, (58, 65, 70, 74, 77), H['pov'] + .1, .3, 1.2, .03); cymbal(H['pov'] + .7, .14, 5200)           # góc nhìn The Giant: kính mở to
Mst(tada(72, 1.), Lend('loupe', 'Yes! NOW!') + .02, .5); cymbal(Lend('loupe', 'Yes! NOW!') + .25, .15)     # "Yes! NOW!": ta-da ngay sau lời
for i, (a, b, c, d, n) in enumerate(QUIZ): secret(M, celesta, (72, 74, 76)[i], Lend(c, d, n) + .02, .14, .45, .3, last=12)   # đáp án ôn bài: mô-típ bí mật
for i in range(9): M(glock((79, 81, 83, 84, 86, 88, 90, 91, 95)[i], .5), H['glow'] + i * .28 + .02, .22, -.4 + .1 * i)      # chín chỗ của Mùa 1 sáng lần lượt
seq(harp, (67, 71, 74, 79, 83, 86, 91), H['glow'] + 2.4, .16, .35, .1, d=.6)                               # đường đi đêm nay sáng xuyên qua
Mst(tada(79, 1.), H['newCorner'] + .55, .45); cymbal(H['newCorner'] + .8, .12)                             # góc GARDEN EDGE: "ta-da" sau tiếng dán giấy
seq(trombone, (55, 50), L0('albie', 'BZZT! Not you, Spindle!') + .15, .22, .3, 0, d=.25)                    # "BZZT!": trombone "bwa-bwa"
for i in range(3): M(piano(79 + i * 2, .5), H['e_spots'] + i * 1.2 + .5, .3, .2)                           # mỗi khung Spindle một nốt
seq(lambda m, d: xylo(m, d), (77, 81, 84), H['recall'] + .05, .12, .3, .2, d=.2)                           # gợi lại móc: "da-da-DA"
for k, n in enumerate((94, 91, 89, 86, 84, 82, 79, 77, 74, 70)): M(glock(n, .4), H['flip'] + .05 + k * .075, .22, .4 - .08 * k)   # lật trang: glockenspiel chạy xuống tới "tõm"
M(timpani(34, .6, 1.), H['splash'] + .02, .4)
Mst(tada(77, 1.), Lend('dot', 'The stars!') + .02, .5); cymbal(Lend('dot', 'The stars!') + .25, .16)       # "THE STARS!": ta-da Fa trưởng ngay sau lời (lời rõ)
strum(vibes, (65, 69, 72, 77), DUR - 1.1, .25, 1.1, .03)
# nhịp chờ trẻ trả lời: mõ gỗ "tích–tắc" rất nhỏ (giai điệu của lớp nhịp đã nhường chỗ)
for a, b in ASK:
    for i in range(int((b - a - .1) / .25)): add(mus, T.block((84, 79)[i % 2], .5), a + .05 + i * .25, .16, (.3, -.3)[i % 2])
# chỗ khựng vẫn còn một lớp mỏng (QUALITY.md §4): vibraphone / celesta run run + pad, giọng trưởng
for (a, b), ch, inst in zip(REST, ([67, 71, 74], [60, 64, 67], [60, 64, 67]), (vibes, celesta, vibes)):
    add(mus, pad(ch, b - a + .3), a, .5, 0)
    for i in range(int((b - a) / .14)): add(mus, inst(ch[i % 3] + 12, .25), a + i * .14, .07, .3)

# — cường độ theo cảnh (chuyển mềm 0,3 s): dâng ở chỗ khám phá, bất ngờ; hạ dưới lời dài và các nhịp chờ —
LEVEL = [(0, .9), (H['crumbRun'], .78), (H['bump'], 1.0), (H['s_team'] + .3, .78), (H['jingle'], .45), (H['s_map'], .8), (H['mapArrow'], .95), (H['mapArrow'] + 1.4, .8),
         (H['s_crew'], .85), (H['blinkOn'], .95), (H['blinkOn'] + 1., .8), (H['s_sun'], .85), (H['dance'], .95), (H['dance'] + 2.2, .8), (ASK[0][0], .65), (NOPE1, .95),
         (NOPE1 + 1.6, .8), (FILL[0] - .1, 1.0), (FILL[0] + 1.4, .8), (H['s_lp1'], .72), (H['s_ants'], .82), (H['antsCome'], .92), (H['antsCome'] + 1.4, .8),
         (H['s_march'], .9), (H['s_edge0'], .8), (FILL[1] - .1, 1.0), (FILL[1] + 1.4, .8), (H['s_think'], .78), (H['dOut'], .9), (H['dOut'] + 1.6, .8), (H['dHome'], .95),
         (H['dHome'] + 2.0, .8), (H['s_count'], .85), (FILL[2] - .1, 1.0), (H['s_lp2'] + .4, .72), (H['s_stars'], .8), (H['climb'], .9), (H['climb'] + 1., .8),
         (H['crane'], 1.0), (H['crane'] + 2.6, .82), (H['s_track'], .88), (H['clouds'], .92), (H['wiggle'], 1.0), (H['wiggle'] + 2.4, .82), (H['clear'], .95),
         (FILL[3] - .1, 1.0), (FILL[3] + 1.4, .82), (H['s_telly'], .9), (H['s_signal'], .82), (H['tellyAns'], .95), (FILL[4] - .1, 1.0), (FILL[4] + 1.4, .82),
         (H['s_edge'], .8), (H['sparkle'], .95), (H['sparkle'] + 1., .8), (H['pull'], 1.0), (MONSTER, .7), (NOPE2, .9), (NOPE2 + 1., .8), (H['hand'], 1.0),
         (H['s_pov'], 1.0), (H['waveAll'] + 1.6, .85), (H['place'], .92), (H['handBye'] + 1., .8), (H['s_found'], .75), (YES - .05, .9), (Lend('loupe', 'Yes! NOW!'), 1.0),
         (H['s_way'], .82), (H['s_home'], .88), (H['s_glow'], .85), (H['glow'], 1.0), (H['glow'] + 3.8, .82), (H['newCorner'] + .5, 1.0), (H['s_song'], .82),
         (H['spindleDrop'], .9), (H['s_msg'], .72), (H['s_spot'], .9), (H['s_bye'], .85), (H['recall'], 1.0), (H['recall'] + 1.2, .82), (H['flip'], 1.0),
         (H['splash'] + 1.2, .8), (ASK[-1][0], .65), (STARS_END, .7), (Lend('dot', 'The stars!'), 1.0)] + [
         x for a, b, c, d, n in QUIZ for x in ((Lend(a, b), .65), (L0(c, d, n), .9), (Lend(c, d, n) + 1., .8))]
LEVEL.sort()
tt = np.arange(len(mus)) / SR; lev = np.full(len(mus), LEVEL[0][1])
for (t, g), (_, g0) in zip(LEVEL[1:], LEVEL[:-1]): lev = np.where(tt >= t - .15, np.where(tt < t + .15, g0 + (g - g0) * (tt - t + .15) / .3, g), lev)
# câu cửa miệng (−6 dB), câu tựa (đè lên nhạc hiệu), "Yes! NOW!" và hai câu mở móc (−4 dB) nói giữa lúc nhạc dâng: nhạc lùi trong lúc nói (lời hơn nhạc ≥ 10 dB)
TITLE = Lb('loupe', 'Big secrets of tiny bugs!')['id']
for l in LINES:
    strong = l.get('catch') or l['id'] == TITLE
    if strong or l['text'] in ('Yes! NOW!', 'Not NOW!', "Whoa! Rollo! I can't stop!", 'Hello, Giant! Thank you!', 'Not NOW! Yippee!'):
        a, b = l['t'] - .1, l['t'] + l['dur'] + .05
        lev *= 1 - (.5 if strong else .37) * np.clip(np.minimum((tt - a) / .1, (b - tt) / .1), 0, 1)
mus *= lev[:, None]


# ---------- tiếng động theo sự kiện ----------
fx = B['fx']
def train(d, n, f, v=1.):                                   # n tiếng f() rải đều trong d giây
    x = np.zeros(int((d + .4) * SR))
    for k in range(max(1, n)):
        b = f(k); s0 = int(k * d / max(1, n) * SR); x[s0:s0 + len(b)] += b[:len(x) - s0]
    return x * v
def at(x, dt): return np.pad(x, (int(dt * SR), 0))
def roll_(d, v=1.):                                         # viên tròn lăn rì rì: rung trầm + lách cách nhỏ
    d = max(.3, d); tt_ = t_(d); e = np.clip(np.minimum(tt_ / .15, (d - tt_) / .2), 0, 1)
    return mixl(lp(brown(d), 260)[:len(e)] * e * .28, train(d, int(d / .22), lambda k: click(.5, .3) * .22)) * v
def patter_(d, v=1.): return train(d, int(d / .11), lambda k: T.block(88 + (k % 2) * 4, .2), v)             # chân Miss Loupe lạch bạch
def antsteps_(d, v=1., m=91): return train(d, int(d / .08), lambda k: T.block(m + (k % 3) * 2, .12), .8 * v)   # bước kiến tí tách
def leaf_(d, v=1.): tt_ = t_(d); return bp(noise(d), 1800, 6500) * np.sin(np.pi * tt_ / d) ** 2 * (.6 + .4 * np.sin(tt_ * 38)) * .16 * v   # lá sột soạt
def paperflap_(d, v=1.): return train(d, int(d / .14), lambda k: T.paper(.12, .35, 3, k), v)
def flash_(n=0, v=1.): return mixl(T._ting(mf(100 + 2 * n), .7, .3), T.sparkle(.3, .12, 100, 108, 3, n, 'up')) * v     # ánh lóe của Uncle Telly: "ting" thủy tinh
def bloop_(n=0): return mixl(T.bubble(620 + 90 * n, .45, .1, 1.8), at(T.blip(88 + 2 * n, .3), .05))                   # Blink nháy "bloop"
def bzzt_(v=1.): return fade(lp(np.sign(np.sin(2 * np.pi * 120 * t_(.22))), 1800) * .18, .005, .03) * v
def thump_(): return fade(mixl(thump(1.1, 62) * .8, at(lp(brown(.7), 120) * env_exp(.7, .22) * .5, .03), hp(noise(.05), 900) * env_exp(.05, .01) * .15), .003, .05)   # THỊCH: đất rung mềm
def hand_(d, v=1.): return mixl(T.swish(d, .3 * v, 180, 1100, True, .55, .5), lp(whoosh(d, .3), 900) * .5 * v)       # bàn tay The Giant lướt "whoosh" mềm, trầm
def splash_():                                                                                                        # "TÕM!": nước bắn + giọt rơi
    d = .7; tt_ = t_(d)
    return mixl(thump(.4, 150) * .45, bp(noise(d), 700, 5200) * env_exp(d, .16) * .32, at(train(.5, 6, lambda k: T.plip(900 + 170 * ((k * 5) % 6), .3)), .12), at(T.bubble(420, .4, .14, 1.5), .05))
SFX = {
    'titlepop': lambda e: mixl(T.bubble(1600, .5, .06, 2.4), at(T._ting(mf(101), .5, .35), .02)),
    'wordpop': lambda e: mixl(T.boing(220 + 120 * e.get('n', 0), .35, .3, 2.4, 16.), at(pop(.6) * .45, .02), T.bubble(1300 + 500 * e.get('n', 0), .35, .05, 2.4)),
    'roll': lambda e: roll_(e.get('d', 1.5), e.get('v', 1.)),
    'patter': lambda e: patter_(e.get('d', 1.), e.get('v', 1.)),
    'scurry': lambda e: T.scurry(e.get('d', .5), .55 * e.get('v', 1.), 91),
    'bump': lambda e: mixl(T.boing(170, .8, .5, 2.6, 15.), T.bonk(.6, 72), at(pop(.6) * .4, .01)),                   # viên tròn vấp sỏi "boing"
    'whizz': lambda e: mixl(T.whistle(700, 2600, e.get('d', .9) * .8, .1 * e.get('v', 1.)), T.swish(e.get('d', .9), .3 * e.get('v', 1.), 600, 5200, True, .6, .3),
                            at(T.sparkle(.5, .2 * e.get('v', 1.), 96, 108, 5, 3, 'up'), e.get('d', .9) * .5)),               # bay vèo vào bóng tối
    'whip': lambda e: mixl(T.swish(.4, .55, 400, 4200, True, .5, .4), whoosh(.4, .35) * .6),
    'sparkle': lambda e: T.sparkle(.7, .3 * e.get('v', 1.), 91, 108, 7, 12, 'up'),
    'tabs': lambda e: T.pops(4, .05, 86, .45 * e.get('v', 1.)),
    'hop': lambda e: mixl(T.boing(240, .4, .35 * e.get('v', 1.), 2.4, 15.), T.swish(.3, .18 * e.get('v', 1.), 900, 3600, True)),
    'qpop': lambda e: mixl(T.blip(79, .3 * e.get('v', 1.)), at(T.blip(86, .3 * e.get('v', 1.)), .1)),                    # dấu hỏi "hử?"
    'boing': lambda e: T.boing(240, .45, .3 * e.get('v', .5) / .5, 2.2, 14.),
    'glowiris': lambda e: mixl(T.swell(.5, .3 * e.get('v', 1.), 84, 103, 5), at(T._ting(mf(105), .7, .22 * e.get('v', 1.)), .3), T.swish(.45, .14, 900, 5000, True, .6, .3)),   # đốm sáng của Blink lớn dần: chuông thủy tinh
    'lensiris': lambda e: mixl(T.swish(.45, .35, 500, 4200, True, .6, .3), T.sparkle(.45, .15, 93, 106, 5, 6, 'up'), at(T._ting(mf(101), .5, .2), .35)),                         # vòng kính trở lại: "ting" kính
    'page': lambda e: mixl(T.paper(.35, .45, 5, 1), T.bubble(520, .3, .09)),
    'pageflip': lambda e: mixl(T.paper(.7, .5, 9, 3), T.swish(.7, .25, 700, 3200, True)),
    'reveal': lambda e: mixl(T.ding(93, .4 * e.get('v', 1.), 1.0), T.sparkle(.6, .3 * e.get('v', 1.), 93, 108, 7, 8, 'up')),
    'blip': lambda e: T.blip(e.get('m', 88), .3),
    'arrow': lambda e: mixl(train(e.get('d', 1.), 9, lambda k: T.blip(79 + k * 2, .22)), at(T.whistle(900, 1900, .3, .07), e.get('d', 1.) - .3)),   # mũi tên chấm chạy ra mép bản đồ
    'bigpop': lambda e: mixl(T.boing(200, .4, .3 * e.get('v', 1.), 2.4, 16.), at(pop(.6) * .4 * e.get('v', 1.), .02), T.bubble(1400, .3 * e.get('v', 1.), .05, 2.4)),
    'flap': lambda e: paperflap_(e.get('d', .8), e.get('v', 1.)),
    'swish': lambda e: T.swish(e.get('d', .45), e.get('v', .4), e.get('lo', 350), e.get('hi', 2600), e.get('up', True)),
    'count': lambda e: mixl(T.blip(84 + 2 * e.get('n', 0), .35), T._ting(mf(91 + 2 * e.get('n', 0)), .3, .2)),          # số đếm nảy: mỗi số cao hơn một bậc
    'step': lambda e: mixl(T.footsteps(1, .1, .5, 84 + e.get('n', 0), e.get('n', 0), True), T._ting(mf(88 + e.get('n', 0) * 2 - (e.get('n', 0) > 6)), .3, .18)),   # bước chân + số, đi lên
    'glowon': lambda e: mixl(T.gliss(84, 103, .35, .28, 'harp'), at(T._ting(mf(103), .9, .3), .3), T.swell(.5, .2, 88, 103, 2)),   # đèn Blink bật: vuốt chuông thủy tinh
    'slots': lambda e: mixl(T.pops(5, .1, 84, .5), T.sparkle(.6, .15, 93, 104, 4, 2, 'up')),
    'buzzin': lambda e: T.buzzup(e.get('d', .7), .3 * e.get('v', 1.)),
    'figure8': lambda e: mixl(T.swirl(e.get('d', 2.), .22 * e.get('v', 1.), 2.2, 700, 2600), T.buzzup(e.get('d', 2.), .18 * e.get('v', 1.), 190, 250),
                              train(e.get('d', 2.), int(e.get('d', 2.) / .55), lambda k: T.sparkle(.3, .12, 96, 106, 3, k, 'up'))),            # vệt số 8 + vo ve lắc mông
    'cluepop': lambda e: mixl(T.boing(260 + 60 * e.get('n', 0), .35, .25, 2.4, 16.), T._ting(mf(93 + 3 * e.get('n', 0)), .4, .25)),
    'dizzy': lambda e: mixl(T.swirl(e.get('d', 1.2), .4, 7, 800, 3200, False), T.whistle(1500, 600, e.get('d', 1.2), .09, .05, 9.), T.buzzup(e.get('d', 1.2), .2, 300, 170)),   # chóng mặt xoay vòng
    'land': lambda e: mixl(step(.4) * .5, T.bubble(700, .2, .06)) * e.get('v', 1.),
    'cluefly': lambda e: mixl(T.swish(.5, .3, 600, 4500, True, .5, .3), T.whistle(700, 1500, .45, .07)),
    'slot': lambda e: mixl(T.ding(91 + 2 * e.get('n', 0), .45, 1.0), T.sparkle(.6, .25, 96, 108, 6, 6, 'up'), at(pop(.6) * .35, .01)),
    'glint': lambda e: mixl(T._ting(mf(100), .6, .3), T.sparkle(.4, .2, 98, 108, 4, 1, 'up')),
    'giggle': lambda e: T.giggle(4, .6 * e.get('v', 1.), 86, .1, 3),
    'sniff': lambda e: mixl(train(.5, 2, lambda k: bp(noise(.12), 1500, 5000) * np.sin(np.pi * t_(.12) / .12) ** 2 * .22), at(train(.3, 2, lambda k: T.block(93 + k * 2, .25)), .05)),   # "sniff, sniff" + râu "tip-tip"
    'scent': lambda e: train(e.get('d', 1.2), 8, lambda k: T.blip(86 + (k % 4) * 2, .2)),                              # chấm mùi hồng "blip"
    'antsteps': lambda e: antsteps_(e.get('d', 2.), e.get('v', 1.), e.get('m', 91)),
    'tap': lambda e: mixl(click(.6, .4) * .5, T._ting(mf(e.get('m', 91)), .4, .35)),
    'leaf': lambda e: leaf_(e.get('d', 1.), e.get('v', 1.)),
    'thinkpop': lambda e: mixl(T.pops(3, .12, 79, .5), at(T.bubble(500, .4, .14, 1.8), .36)),                          # bóng nghĩ phình ra
    'memory': lambda e: mixl(T.gliss(79, 98, .5, .2, 'harp'), T.sparkle(.6, .15, 96, 106, 5, 3, 'up')),
    'pick': lambda e: mixl(T.plip(1300, .4), at(T.blip(91, .3), .06)),
    'ticks': lambda e: train(e.get('d', 3.), e.get('n', 12), lambda k: mixl(T.block(84 + k, .3), T._ting(mf(91 + k), .2, .12))),   # mỗi vạch bước một "tick" đi lên
    'popup': lambda e: mixl(T.boing(260, .4, .3 * e.get('v', 1.), 2.2, 14.), T.swipe(.2, .2 * e.get('v', 1.), True, 1500, 5500)),
    'blurry': lambda e: mixl(T.wobble(240, .7, .3, 6, .25), T.boing(200, .4, .25, 2.4, 16.), at(pop(.6) * .3, .02)),   # sao nhoè: lắc lư
    'flash': lambda e: flash_(e.get('n', 0), e.get('v', 1.)),
    'spin': lambda e: mixl(T.swirl(e.get('d', .6), .4, 6, 900, 3600), T.swell(e.get('d', .6), .3, 79, 101)),
    'crane': lambda e: mixl(T.swell(e.get('d', 2.4), .4, 72, 103, 7), T.sparkle(e.get('d', 2.4), .25, 91, 108, 16, 21, 'up'), T.swish(1.2, .2, 300, 3000, True, .7, .4)),   # máy ngửa lên: dâng lấp lánh
    'label': lambda e: mixl(T.boing(300, .3, .2 * e.get('v', 1.), 2.4, 16.), T.blip(91, .25 * e.get('v', 1.))),
    'shimmer': lambda e: T.sparkle(e.get('d', 1.), .25 * e.get('v', 1.), 93, 108, int(6 * e.get('d', 1.)) + 2, 9, 'up'),
    'cloud': lambda e: mixl(lp(whoosh(e.get('d', 1.8), .3), 1200) * .7, T.swish(e.get('d', 1.8), .2, 200, 900, False, .5, .6)),   # bóng mây trôi qua: "whoosh" mềm
    'wiggle': lambda e: mixl(T.whistle(520, 560, e.get('d', 2.6), .08, .12, 3.2), T.wobble(170, e.get('d', 2.6), .22, 3.2, .3)),  # vệt ngoằn ngoèo: còi lắc lư
    'bonk': lambda e: T.bonk(.5 * e.get('v', 1.), 76),
    'clear': lambda e: mixl(T.swell(.8, .3, 84, 103, 9), T.sparkle(.9, .25, 93, 108, 8, 15, 'up')),                    # mây tan, sao trở lại
    'scan': lambda e: mixl(T.whistle(600, 760, e.get('d', 1.) / 2, .05, .0), at(T.whistle(760, 600, e.get('d', 1.) / 2, .05, .0), e.get('d', 1.) / 2), train(e.get('d', 1.), 4, lambda k: click(.4, .3) * .2)),   # ống nhòm quét
    'bino': lambda e: mixl(click(1., .5) * .5, at(click(1., .4) * .5, .09), T.swish(.35, .25, 500, 2600, True)),      # nhìn qua ống nhòm: hai tiếng "cạch"
    'tink': lambda e: T._ting(mf(e.get('m', 96)), .4, .12),
    'bloop': lambda e: bloop_(e.get('n', 0)),
    'beam': lambda e: mixl(T.whistle(1200, 700, e.get('d', .8), .08), train(e.get('d', .8), 6, lambda k: T.blip(96 - k * 2, .2))),   # vệt sáng chỉ chỗ đi xuống
    'pats': lambda e: T.footsteps(e.get('n', 6), .11, .5 * e.get('v', 1.), 86, 2, True),
    'heave': lambda e: mixl(T.boing(130 + 12 * e.get('n', 0), .4, .32, .8, 9., .2), T.swish(.3, .16, 300, 1400, True)),          # cả đội kéo: "heave!"
    'thump': lambda e: thump_(),
    'handin': lambda e: hand_(e.get('d', .9), e.get('v', 1.)),
    'stone': lambda e: mixl(lp(brown(.5), 500) * np.sin(np.pi * t_(.5) / .5) * .35, bp(noise(.4), 400, 1600) * env_exp(.4, .12) * .12),   # phiến đá nghiêng "rộp"
    'popout': lambda e: mixl(T.bubble(700, .5, .09, 2.2), pop(.7) * .45, at(T.whistle(600, 1700, .35, .09), .03), at(T.sparkle(.5, .25, 93, 108, 6, 4, 'up'), .1)),   # Miss Loupe bật ra "pop"
    'lift': lambda e: mixl(T.swell(e.get('d', 1.), .3, 76, 100, 4), T.swish(e.get('d', 1.), .18, 250, 1600, True, .7, .5)),
    'zoom': lambda e: mixl(riser(.55, .7), T.whistle(420, 1250, .5, .1)),
    'cheer': lambda e: T.cheer(.9, .45 * e.get('v', 1.), 2),
    'cardpop': lambda e: mixl(T.boing(260 + 40 * e.get('n', 0), .35, .25, 2.4, 16.), at(pop(.6) * .3, .02)),
    'mapglow': lambda e: mixl(T.bubble(900 + 60 * e.get('n', 0), .25, .05, 2.2), T.sparkle(.3, .14, 96, 106, 3, e.get('n', 0), 'up')),   # một chỗ trên bản đồ sáng lên
    'trip': lambda e: mixl(T.swish(e.get('d', 1.2), .22, 500, 4000, True, .7, .3), train(e.get('d', 1.2), 10, lambda k: T.blip(84 + k, .18))),   # đường đi đêm nay sáng xuyên qua
    'paste': lambda e: fade(mixl(thump(.5, 140) * .35, T.paper(.2, .4, 3, 5), at(T._ting(mf(96), .4, .2), .05)), .003, .03),   # dán góc giấy mới
    'silkdrop': lambda e: mixl(T.whistle(1900, 900, e.get('d', .9), .09 * e.get('v', 1.)), T.sparkle(e.get('d', .9), .15 * e.get('v', 1.), 96, 106, 5, 5, 'down')),
    'silkup': lambda e: mixl(T.whistle(800, 2000, e.get('d', 1.2) * .8, .09), T.zip_(.3, 700, 3000, .25), T.sparkle(e.get('d', 1.2), .12, 96, 106, 5, 7, 'up')),
    'bzzt': lambda e: bzzt_(),
    'ring': lambda e: mixl(T.swirl(.4, .2, 6, 1200, 3600), T._ting(mf(96 + 2 * e.get('n', 0)), .4, .2)),
    'recall': lambda e: mixl(T.bubble(1600, .5, .06, 2.4), at(T._ting(mf(101), .5, .35), .02), T.boing(220, .35, .3, 2.4, 16.)),   # tiếng chữ móc trở lại
    'splash': lambda e: splash_(),
}
missing = sorted({e['type'] for e in EV} - SFX.keys())
if missing: sys.exit(f'mix.py: no sound for event types {missing}')
VERB = {'slot': .5, 'reveal': .4, 'lensiris': .3, 'glowiris': .4, 'glint': .3, 'titlepop': .3, 'recall': .3, 'flash': .5, 'glowon': .4, 'crane': .4, 'clear': .4,
        'thump': .35, 'splash': .4, 'count': .2, 'step': .2, 'popout': .3, 'bump': .3, 'whizz': .4, 'mapglow': .3, 'bloop': .3}
snd = np.zeros(len(fx))
for e in EV:
    x = SFX[e['type']](e); n_ = min(len(x), int(.0015 * SR)); x = x.copy(); x[:n_] *= np.linspace(0, 1, n_)   # sườn trước 1,5 ms: bộ mã AAC không vọt đỉnh
    add(fx, x, e['t'], 1., e.get('pan', 0))
    if e['type'] in VERB: s0 = int(e['t'] * SR); k = min(len(x), len(snd) - s0); snd[s0:s0 + k] += x[:k] * VERB[e['type']]
fx += T.verb(snd, 1.2) * .35


# ---------- nền theo bối cảnh: vườn đêm (dế xa, gió nhẹ trong cỏ) · rìa vườn (gió qua cỏ cao, dế rõ hơn) · bóng nghĩ sa mạc (gió cát nhẹ, không dế) ----------
amb = B['amb']; rng = np.random.default_rng(33)
def zone(a, b, x, g):
    x = x[:int((b - a) * SR)]; d = len(x) / SR; tt_ = np.arange(len(x)) / SR; e = np.clip(np.minimum(tt_ / .4, (d - tt_) / .4), 0, 1)
    add(amb, x * e * g, a, 1., 0)
def wind(d, lo=180, hi=700, rate=.23):                      # gió nhẹ trong cỏ: nhiễu lọc, phập phồng chậm
    tt_ = t_(d); return bp(brown(d), lo, hi)[:len(tt_)] * (.6 + .4 * np.sin(2 * np.pi * rate * tt_ + 1.))
def crickets(a, b, g=.012, every=.5):
    for t0 in np.arange(a, b, every):
        x = np.zeros(int(.12 * SR)); bb = np.sin(2 * np.pi * rng.uniform(4300, 4900) * t_(.022)) * np.sin(np.pi * t_(.022) / .022) ** 2
        for j in range(3): s0 = int(j * .035 * SR); x[s0:s0 + len(bb)] += bb
        add(amb, lp(x, 6500) * g, t0 + rng.uniform(0, .25), 1., rng.uniform(-.8, .8))
EDGE = [(H['s_lp1'], H['s_ants']), (H['s_edge0'], H['s_think']), (H['s_count'], H['s_stars']), (H['s_telly'], H['s_signal']), (H['s_edge'], H['s_way'])]   # rìa vườn, cỏ cao
DESERT = (H['s_desert'], H['s_count'])
PAGE = [(H['s_title'], H['s_crew']), (H['s_glow'], H['s_msg']), (H['s_spot'], DUR)]                                                                          # tựa, trang bản đồ, trang ao
cuts = sorted({0, DUR, DESERT[0], DESERT[1]} | {x for a, b in EDGE + PAGE for x in (a, b)})
for a, b in zip(cuts, cuts[1:]):
    mid = (a + b) / 2
    if DESERT[0] <= mid < DESERT[1]: zone(a, b, wind(b - a, 300, 1400, .4), .5)                               # gió cát nhẹ (ban ngày: không dế)
    elif any(x <= mid < y for x, y in EDGE): zone(a, b, wind(b - a, 200, 900, .3), .55); crickets(a, b, .02, .35)
    elif any(x <= mid < y for x, y in PAGE): zone(a, b, wind(b - a), .25); crickets(a, b, .008, .7)
    else: zone(a, b, wind(b - a), .4); crickets(a, b)


# ---------- giọng ----------
vox = np.zeros(N)
for L in LINES:
    y, sr = sf.read(os.path.join(HERE, 'voice', L['id'] + '.wav'))
    if y.ndim > 1: y = y.mean(1)
    y = soxr.resample(y, sr, SR); s0 = int(L['t'] * SR); e = min(N, s0 + len(y)); vox[s0:e] += y[:e - s0]
vox = lp(vox, 8500, 4)                                    # giọng nâng cao độ (Dot, Blink) có tiếng rít ~9,5 kHz: bộ mã AAC vọt đỉnh ở đó; trên 8,5 kHz chỉ còn tiếng xì
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
amb = amb * (.012 / max(rms(amb), 1e-9))
from scipy.ndimage import maximum_filter1d, uniform_filter1d
ve = uniform_filter1d(maximum_filter1d(np.abs(vox), int(.05 * SR)), int(.25 * SR))
mus = T.duck(mus, ve, .66, .3); fx = T.duck(fx, ve, .6, .3); amb = T.duck(amb, ve, .7, .5)
mus, GUARD = T.speech_guard(mus, fx, vox, LINES, 11.)               # (Đệm lời) vòng bảo vệ lời rõ: chỉ hạ nhạc ở câu còn thiếu
print('speech_guard:', ', '.join(f'{k} {s_:.1f} dB → −{c:.1f} dB' for k, s_, c in GUARD) or 'không câu nào phải hạ')
V = np.stack([vox, vox], 1)
mix = mus + fx + amb + V
mix = np.tanh(mix * 1.1) / 1.1
mix, I_mix, ceil_db = T.master(mix, 10.5)   # chừa 0,5 dB cho bộ mã AAC
print(f'master: {I_mix:.1f} LUFS, true-peak ceiling {ceil_db:.1f} dBFS')
nf = int(.02 * SR); mix[:nf] *= np.linspace(0, 1, nf)[:, None]
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR, subtype='PCM_24')
for k, x in (('mus', mus), ('fx', fx), ('vox', V)): sf.write(os.path.join(HERE, 'out', f'stem_{k}.wav'), x.astype(np.float32), SR, subtype='PCM_16')
print('out/mix.wav', f'{len(mix) / SR:.2f} s')
