"""Lớp nhịp theo cảnh cho nhạc nền của kênh: mỗi cảnh một điệu, một bộ nhạc cụ, một vòng hoà âm, một mức năng lượng
và (từ lượt "Sound Design Plan" 11/2026) một phong cách nhạc, một BPM và một cách chuyển cảnh riêng.

    from groove import Groove
    G = Groove(M, BEAT, LINES, meter=4, seed=3, avoid=[(a, b), ...], plan=True)   # M: hàm đặt nốt của mix.py (đã tôn trọng REST)
    G.sec('móc · đêm lấp lánh', 0, 3.0, 'bounce', 'Bb', 'Bb F', bass='bassn', comp='marimba', lead='glock', kit='latin', energy=2,
          bpm=120, mood='happy', arc='open', what='Blink vụt vào, bụng sáng', emo='tò mò, bất ngờ', why='…', cue=False)
    G.mark('logo · nhạc hiệu', 3.0, 3.8, 'jingle', 'Bb', 'horn marimba bell', 3, mood='epic', arc='open', what='…')
    ...
    G.play(); G.save(os.path.join(HERE, 'out', 'music.json'), color='Glow-Code Bossa')
    # rồi: python _shared/tools/soundplan.py films/<tập>  → SOUND-PLAN.md (bảng Sound Design Plan); qa.py đọc music.json

Lớp nhịp tự làm, để mỗi tập không phải viết tay:
1. **Thưa dưới lời.** Đang có lời thì chỉ còn bass, kick, hat/shaker và tiếng đệm rất ngắn ở dải cao; giai điệu im.
   Dưới giọng trầm (Albie) bỏ luôn bass và kick (`low_voices`).
2. **Câu đáp trong khoảng trống.** Mỗi khoảng không lời ≥ 0,45 s trong cảnh có một câu nhạc ngắn của nhạc cụ hát chính,
   đi theo hợp âm đang chơi, nối tiếp cao độ của câu đáp trước. Với `plan=True`, nhịp và dáng câu đáp theo phong cách nhạc
   của cảnh (`MOOD_FILL`: hài thì nhảy quãng và có nốt láy, phép thuật thì rải đi lên, hồi hộp thì đi nửa cung…) và không lặp
   lại ô nhịp của câu đáp trước.
3. **Đổi cảnh có dấu.** Mặc định: phách cuối trước cảnh mới có trống dồn (mạnh lên) hoặc chuỗi nốt đi xuống (nhẹ đi); phách đầu
   cảnh mới có kick + chũm chọe mềm. Với `plan=True`: mỗi chỗ đổi cảnh một cách chuyển (`TRANS`: trống dồn, riser, nốt mồi,
   chuỗi đi xuống, vuốt đàn hạc, dâng lấp lánh, còi trượt xuống, ngân đuôi), chọn theo phong cách và năng lượng của cảnh sau,
   không lặp kiểu của lần chuyển trước, tránh dải giọng khi có lời; cảnh sau vào mềm (`ramp`) khi chuyển nhẹ; phách đầu
   được nhấn theo phong cách (timpani cho cao trào, triangle cho dễ thương…). Mỗi lần chuyển được ghi vào music.json.

**BPM theo cảnh** (`bpm=`). Không ghi thì cảnh chạy trên lưới của phim (mặc định 120 BPM), phách trùng phách của hình.
Có ghi BPM khác thì lưới của cảnh bắt đầu đúng ở t0 (phách 1 của cảnh trùng điểm cắt), nên đoạn nhảy theo phách của hình
phải giữ BPM của phim. Điệu nửa nhịp ('sway', 'hush') và nhịp kép ('gallop') đổi thêm nhịp cảm nhận (`STYLE_FEEL`).

**Bảng Sound Design Plan.** `what` (nội dung cảnh), `emo` (cảm xúc), `why` (vì sao chọn nhạc này), `sfx` (tiếng động viết tay
của cảnh, nếu có), `mood` (một trong 8 phong cách của `MOODS`), `arc` ('open' mở đầu · 'build' diễn biến · 'peak' cao trào ·
'end' kết), `reprise=True` (cố ý lặp lại nhạc của một cảnh trước, ví dụ kết nối về khung đầu của phim lặp). `qa.py` kiểm các
quy tắc chống trùng lặp của QUALITY.md §4 từ music.json; `_shared/tools/soundplan.py` viết bảng 7 cột ra SOUND-PLAN.md.

**Điệu riêng của tập** (lượt chống trùng giữa các tập, 11/2026 lượt 2). `SIGNATURE` ghi điệu nào thuộc tập nào: jig 12/8 (001),
calypso (002), swing (003), diễu hành + second-line (004), valse (005), đồng quê (006), bossa nova (007), disco (008), ska (009),
samba (010). Mỗi Short dùng điệu riêng của mình ≥ 20 % thời lượng và không mượn điệu riêng của tập khác; `channel.py` so bảng
cảnh nhạc với `music-plan.json` của mọi Short khác (soundplan.py ghi, qa.py kiểm). Tập mới: thêm một điệu mới vào `STYLES`.
Điệu `jig` chia ba mỗi phách của phim (`'swing': 'trip'`), nên hình vẫn nhún đúng phách 120 BPM.

Mọi nốt dùng nhạc cụ tổng hợp của band.py và toon.py (không mẫu của bên thứ ba).
"""
import json
import numpy as np
from band import (mf, pluck, marimba, bassn, buzzbass, kick, clap, hat, shaker, bell, horn, pizz, xylo, flute, reed, steel, tuba,
                  tom, claves, brush, tamb, celesta, harp, rhodes, vibes, snap, upright, snare, banjo, riser,
                  piano, toypiano, trumpet, trombone, bassoon, kazoo, accordion, strings, timpani, bongo, triangle, ohat, agogo)
import toon as T

# ---------- nhạc cụ có cao độ: (hàm (midi, dài) → mono, quãng thường dùng cho từng vai) ----------
def glock(m, d=.6): return T._ting(mf(m), d, 1.) * .5
PITCHED = {
    'pluck': (lambda m, d: pluck(m, d), (60, 76)), 'marimba': (lambda m, d: marimba(m, d), (64, 84)),
    'bassn': (lambda m, d: bassn(m, d), (36, 47)), 'buzz': (lambda m, d: buzzbass(m, d), (36, 47)),
    'upright': (lambda m, d: upright(m, d), (33, 45)), 'tuba': (lambda m, d: tuba(m, d), (34, 46)),
    'pizzbass': (lambda m, d: pizz(m, d), (43, 55)), 'pizz': (lambda m, d: pizz(m, d), (60, 79)),
    'xylo': (lambda m, d: xylo(m, d), (72, 91)), 'glock': (glock, (79, 96)), 'flute': (lambda m, d: flute(m, d), (72, 86)),
    'reed': (lambda m, d: reed(m, d), (60, 74)), 'horn': (lambda m, d: horn(m, d, .8), (67, 81)),
    'steel': (lambda m, d: steel(m, d), (64, 84)), 'celesta': (lambda m, d: celesta(m, d), (76, 93)),
    'harp': (lambda m, d: harp(m, d), (65, 86)), 'rhodes': (lambda m, d: rhodes(m, d), (57, 72)),
    'vibes': (lambda m, d: vibes(m, d), (69, 88)), 'banjo': (lambda m, d: banjo(m, d), (67, 84)),
    'bell': (lambda m, d: bell(m, 1., d), (79, 93)),
    # lượt Sound Design Plan (11/2026)
    'piano': (lambda m, d: piano(m, max(d, .35)), (55, 79)), 'pianohi': (lambda m, d: piano(m, max(d, .3)), (72, 91)),
    'toypiano': (lambda m, d: toypiano(m, max(d, .3)), (72, 91)),
    'trumpet': (lambda m, d: trumpet(m, d), (64, 81)), 'mute': (lambda m, d: trumpet(m, d, 1., .8), (64, 81)),
    'trombone': (lambda m, d: trombone(m, d), (48, 65)), 'bassoon': (lambda m, d: bassoon(m, d), (46, 62)),
    'bassoonlo': (lambda m, d: bassoon(m, d), (34, 46)), 'kazoo': (lambda m, d: kazoo(m, d), (62, 77)),
    'accordion': (lambda m, d: accordion(m, d), (60, 76)), 'strings': (lambda m, d: strings(m, min(d, .3)), (62, 81)),
}
# họ nhạc cụ (để luân phiên: piano · ukulele · marimba · xylophone · dây pizzicato · kèn gỗ · kèn đồng · bộ gõ · nhạc cụ hoạt hình)
FAMILY = {'piano': 'piano', 'pianohi': 'piano', 'toypiano': 'piano', 'rhodes': 'piano',
          'pluck': 'ukulele', 'banjo': 'ukulele',
          'marimba': 'marimba', 'xylo': 'xylophone',
          'glock': 'chuông', 'celesta': 'chuông', 'vibes': 'chuông', 'bell': 'chuông',
          'pizz': 'dây pizzicato', 'pizzbass': 'dây pizzicato', 'harp': 'đàn hạc', 'strings': 'dàn dây',
          'flute': 'kèn gỗ', 'reed': 'kèn gỗ', 'bassoon': 'kèn gỗ', 'bassoonlo': 'kèn gỗ',
          'horn': 'kèn đồng', 'trumpet': 'kèn đồng', 'mute': 'kèn đồng', 'trombone': 'kèn đồng', 'tuba': 'kèn đồng',
          'kazoo': 'nhạc cụ hoạt hình', 'accordion': 'nhạc cụ hoạt hình', 'steel': 'nhạc cụ hoạt hình',
          'bassn': 'bass', 'buzz': 'bass', 'upright': 'bass'}
INST_VI = {'pluck': 'ukulele', 'marimba': 'marimba', 'bassn': 'bass gảy', 'buzz': 'bass vo ve', 'upright': 'contrabass',
           'tuba': 'tuba', 'pizzbass': 'pizzicato trầm', 'pizz': 'dây pizzicato', 'xylo': 'xylophone', 'glock': 'glockenspiel',
           'flute': 'sáo', 'reed': 'clarinet', 'horn': 'kèn đồ chơi', 'steel': 'trống thép', 'celesta': 'celesta', 'harp': 'đàn hạc',
           'rhodes': 'phím điện', 'vibes': 'vibraphone', 'banjo': 'banjo', 'bell': 'chuông', 'piano': 'piano', 'pianohi': 'piano (cao)',
           'toypiano': 'piano đồ chơi', 'trumpet': 'trumpet', 'mute': 'trumpet bịt', 'trombone': 'trombone', 'bassoon': 'bassoon',
           'bassoonlo': 'bassoon trầm', 'kazoo': 'kazoo', 'accordion': 'accordion', 'strings': 'dàn dây spiccato'}

# ---------- bộ trống: vai → hàm (độ mạnh) → mono ----------
KITS = {
    'toy':   {'kick': kick, 'back': clap, 'hat': shaker, 'perc': claves},
    'pop':   {'kick': kick, 'back': clap, 'hat': hat, 'perc': tamb},
    'march': {'kick': kick, 'back': lambda v: snare(v), 'hat': tamb, 'perc': lambda v: snare(v * .6, .1)},
    'jazz':  {'kick': lambda v: kick(v * .7), 'back': snap, 'hat': hat, 'perc': lambda v: brush(v)},
    'latin': {'kick': kick, 'back': lambda v: claves(v), 'hat': shaker, 'perc': claves},
    'wood':  {'kick': None, 'back': lambda v: T.block(79, v * .5), 'hat': lambda v: shaker(v * .8), 'perc': claves},   # hat: shaker ở dải cao, vẫn nghe dưới lời
    'tom':   {'kick': kick, 'back': lambda v: tom(52, v), 'hat': shaker, 'perc': lambda v: tom(45, v)},
    'brush': {'kick': lambda v: kick(v * .6), 'back': lambda v: brush(v), 'hat': lambda v: hat(v * .7), 'perc': lambda v: brush(v * .7, .1)},
    'none':  {},
    # lượt Sound Design Plan (11/2026)
    'epic':  {'kick': lambda v: timpani(41, v, .8), 'back': lambda v: snare(v), 'hat': lambda v: shaker(v * .8), 'perc': lambda v: snare(v * .5, .1)},
    'bongo': {'kick': lambda v: kick(v * .8), 'back': lambda v: bongo(v, False), 'hat': shaker, 'perc': lambda v: bongo(v * .8, True)},
    'clap':  {'kick': kick, 'back': lambda v: clap(v), 'hat': lambda v: tamb(v * 1.2), 'perc': lambda v: clap(v * .5)},
    'tri':   {'kick': None, 'back': lambda v: triangle(v * .7, .5), 'hat': lambda v: shaker(v * .6), 'perc': lambda v: triangle(v * .5, .4)},
    'comic': {'kick': kick, 'back': lambda v: T.block(72, v * .6), 'hat': lambda v: shaker(v * .8), 'perc': lambda v: T.block(86, v * .45)},
    # lượt "chống trùng giữa các tập" (11/2026, lượt 2): bộ gõ của các điệu riêng
    'bodhran': {'kick': lambda v: tom(43, v * .95), 'back': lambda v: tom(55, v * .6), 'hat': lambda v: shaker(v * .8), 'perc': lambda v: tom(50, v * .45)},
    'rim':     {'kick': lambda v: kick(v * .6), 'back': lambda v: T.block(90, v * .4), 'hat': lambda v: shaker(v * .7), 'perc': lambda v: brush(v * .6, .1)},
    'ska':     {'kick': kick, 'back': lambda v: snare(v * .9), 'hat': hat, 'perc': lambda v: T.block(84, v * .35)},
    'samba':   {'kick': lambda v: tom(40, v * 1.1), 'back': lambda v: T.block(82, v * .5), 'hat': shaker, 'perc': lambda v: agogo(v, v > .55)},
    'disco':   {'kick': kick, 'back': clap, 'hat': ohat, 'perc': hat},
    'second':  {'kick': kick, 'back': lambda v: snare(v), 'hat': lambda v: tamb(v * .9), 'perc': lambda v: snare(v * .45, .08)},
}
KIT_VI = {'toy': 'đồ chơi (vỗ tay, shaker, phách gỗ)', 'pop': 'pop (kick, vỗ tay, hi-hat)', 'march': 'diễu hành (snare, lục lạc)',
          'jazz': 'jazz (búng tay, hi-hat, chổi)', 'latin': 'latin (phách gỗ, shaker)', 'wood': 'gỗ (mõ, shaker)', 'tom': 'trống tom',
          'brush': 'chổi trống', 'none': '', 'epic': 'timpani + snare', 'bongo': 'bongo + shaker', 'clap': 'vỗ tay + lục lạc',
          'tri': 'triangle + shaker', 'comic': 'mõ hai cao độ', 'bodhran': 'trống bodhrán + shaker', 'rim': 'rim click + shaker',
          'ska': 'ska (snare, hi-hat, mõ)', 'samba': 'samba (surdo, tamborim, agogô, ganzá)', 'disco': 'disco (kick 4 phách, vỗ tay, hi-hat mở)',
          'second': 'kèn đồng diễu phố (snare lệch phách, lục lạc)'}
ROLE_G = {'kick': .7, 'back': .5, 'hat': .62, 'perc': .45, 'bass': 1.1, 'comp': .42, 'arp': .36, 'lead': .42}
UNDER = {'kick': .8, 'back': .3, 'comp': .6, 'arp': .65}            # dưới lời: tiếng đệm nhỏ lại, giai điệu im
LOW_KICK = .55                                                      # dưới giọng trầm: kick nhỏ hơn nữa, bass bỏ hẳn

# ---------- điệu: vai → [(móc kép trong ô nhịp, độ mạnh[, bậc hoặc chỉ số nốt, độ dài theo phách])] ----------
# 4/4: 16 móc kép mỗi ô; 3/4: 12. Một mẫu dài 32 (24) móc kép là mẫu hai ô nhịp (son clave 3-2, bass luân phiên).
# Bậc bass: R gốc · 5 quãng năm · 8 quãng tám · 3 quãng ba · A nốt dẫn nửa cung vào gốc của ô sau.
O8 = (0, 2, 4, 6, 8, 10, 12, 14)
STYLES = {
    'bounce': {'kick': [(0, 1), (8, .85), (11, .4)], 'back': [(4, 1), (12, 1)], 'hat': [(s, 1. if s % 4 else .55) for s in O8],
               'bass': [(0, .95, 'R', .45), (6, .6, '5', .3), (8, .85, '8', .4), (14, .55, '5', .25)],
               'comp': [(s, .8, None, .12) for s in (2, 6, 10, 14)]},
    'skip': {'swing': True, 'kick': [(0, 1), (8, .8)], 'back': [(4, .9), (12, .9)], 'hat': [(s, .8 if s % 4 else .5) for s in O8],
             'bass': [(0, .9, 'R', .4), (4, .7, '5', .35), (8, .85, '8', .4), (12, .7, '5', .35)],
             'comp': [(2, .75, None, .14), (10, .75, None, .14)]},
    'march': {'kick': [(0, 1), (8, .9)], 'back': [(0, .45), (2, .3), (4, 1), (6, .3), (8, .45), (10, .3), (12, 1), (14, .35), (15, .3)],
              'hat': [(4, .5), (12, .5)], 'bass': [(0, .95, 'R', .35), (8, .85, '5', .35)], 'comp': [(4, .9, None, .2), (12, .9, None, .2)]},
    'polka': {'kick': [(0, 1), (8, .9)], 'back': [(s, .5) for s in (2, 6, 10, 14)],
              'bass': [(0, .95, 'R', .3), (4, .75, '5', .3), (8, .9, '8', .3), (12, .75, '5', .3)],
              'comp': [(s, .8, None, .1) for s in (2, 6, 10, 14)]},
    'calypso': {'kick': [(0, 1), (8, .8)], 'hat': [(s, .7 if s % 4 == 2 else .3) for s in range(16)],
                'perc': [(0, .9), (6, .8), (12, .8), (20, .8), (24, .8)],                       # son clave 3-2 (hai ô)
                'bass': [(0, .95, 'R', .35), (6, .75, '5', .3), (12, .8, '8', .25)],         # tresillo 3+3+2
                'comp': [(2, .7, None, .16), (6, .5, None, .12), (7, .6, None, .12), (10, .7, None, .16), (14, .7, None, .16)]},
    'swing': {'swing': True, 'kick': [(0, .5), (8, .4)], 'back': [(4, 1), (12, 1)],
              'hat': [(0, .7), (4, .85), (6, .5), (8, .7), (12, .85), (14, .5)],
              'bass': [(0, .95, 'R', .45), (4, .8, '3', .45), (8, .85, '5', .45), (12, .8, 'A', .45)],     # đi bộ
              'comp': [(0, .7, None, .28), (6, .7, None, .22)]},                               # Charleston
    'sway': {'kick': [(0, .9)], 'back': [(8, .9)], 'hat': [(s, .45) for s in (0, 4, 8, 12)],          # nửa nhịp: thấy chậm lại
             'bass': [(0, .9, 'R', .9), (12, .5, '5', .4)], 'comp': [(4, .6, None, .25), (12, .6, None, .25)]},
    'gallop': {'kick': [(0, 1), (4, .8), (8, .9), (12, .8)], 'back': [(4, 1), (12, 1)],               # nhịp kép: thấy nhanh lên
               'hat': [(s, .8 if s % 2 == 0 else .45) for s in range(16)],
               'bass': [(0, .9, 'R', .2), (2, .55, 'R', .2), (4, .75, '8', .2), (6, .55, 'R', .2), (8, .85, 'R', .2), (10, .55, 'R', .2), (12, .75, '8', .2), (14, .6, '5', .2)],
               'comp': [(s, .7, None, .1) for s in (2, 6, 10, 14)]},
    'tiptoe': {'back': [(6, .6), (14, .6)], 'hat': [(s, .5) for s in (3, 7, 11, 15)],
               'bass': [(0, .8, 'R', .15), (4, .5, '5', .12), (8, .7, 'R', .15), (12, .5, '5', .12)],
               'comp': [(s, .55, None, .08) for s in (2, 6, 10, 14)]},
    'float': {'hat': [(s, .4) for s in (2, 6, 10, 14)], 'bass': [(0, .85, 'R', 1.2), (8, .6, '5', .9)],
              'arp': [(s, .8 if s in (0, 8) else .6, i, .5) for s, i in zip(O8, (0, 1, 2, 3, 2, 1, 2, 3))]},
    'country': {'kick': [(0, .9), (8, .8)], 'back': [(4, .5), (12, .5)], 'bass': [(0, .95, 'R', .35), (8, .85, '5', .35)],
                'comp': [(4, .9, None, .2), (12, .9, None, .2)],
                'arp': [(s, .45, i, .2) for s, i in zip((2, 3, 6, 7, 10, 11, 14, 15), (2, 3, 1, 2, 2, 3, 1, 3))]},      # banjo cuộn
    'tension': {'kick': [(0, .8), (3, .45), (8, .8), (11, .45)], 'hat': [(s, .3) for s in O8],           # nhịp tim: hồi hộp
                'bass': [(0, .85, 'R', .25), (8, .7, 'R', .25)],
                'arp': [(s, .5, i, .3) for s, i in zip((0, 4, 8, 12), (3, 2, 3, 1))]},
    'hush': {'hat': [(s, .25) for s in (4, 12)], 'arp': [(0, .5, 2, 1.2), (8, .4, 3, 1.2)]},             # lắng nghe: gần như im
    'waltz': {'meter': 3, 'kick': [(0, .7)], 'perc': [(4, .4), (8, .4)],
              'bass': [(0, .95, 'R', .5), (12, .9, '5', .5)], 'comp': [(4, .8, None, .2), (8, .75, None, .2)]},
    'waltzfloat': {'meter': 3, 'bass': [(0, .85, 'R', 1.2)],
                   'arp': [(s, .7 if s == 0 else .55, i, .45) for s, i in zip((0, 2, 4, 6, 8, 10), (0, 1, 2, 3, 2, 1))]},
    'break': {},                                                                                   # chỉ có điểm nhấn của tập
    # ---- lượt Sound Design Plan (11/2026): mỗi phong cách nhạc có điệu riêng, để hai cảnh không nghe như một bản đổi tốc độ ----
    'stride': {'kick': [(0, .7), (8, .6)], 'back': [(4, .6), (12, .6)], 'hat': [(s, .4) for s in (2, 6, 10, 14)],      # ragtime: "oom" 1–3, "pah" 2–4
               'bass': [(0, .95, 'R', .35), (8, .85, '5', .35)],
               'comp': [(4, .9, None, .16), (12, .9, None, .16), (14, .45, None, .08)]},
    'hero': {'kick': [(0, 1), (8, .9)], 'back': [(4, .9), (12, .9), (14, .35), (15, .45)],                             # cao trào: bass móc đơn dồn, kèn chặn
             'bass': [(s, .85 if s % 8 == 0 else .6, 'R' if s < 12 else '5', .2) for s in O8],
             'comp': [(0, .9, None, .32), (6, .7, None, .14), (10, .75, None, .2)],
             'arp': [(s, .6, i, .18) for s, i in zip(O8, (0, 2, 1, 3, 0, 2, 1, 3))]},
    'quest': {'kick': [(0, .9), (8, .8)], 'perc': [(s, .55 if s % 4 == 0 else .35) for s in (0, 2, 3, 4, 6, 7, 8, 10, 11, 12, 14, 15)],   # phi nước kiệu "da-da-dum"
              'bass': [(0, .9, 'R', .3), (3, .55, 'R', .12), (8, .85, '5', .3), (11, .55, '5', .12)],
              'arp': [(s, .6, i, .35) for s, i in zip((0, 4, 8, 12), (0, 2, 3, 1))], 'comp': [(6, .5, None, .2), (14, .5, None, .2)]},
    'sneak': {'back': [(4, .7), (12, .7)], 'hat': [(s, .32 if s % 4 else .22) for s in O8],                          # rình rập hài: bass staccato đi nửa cung vào gốc
              'bass': [(0, .9, 'R', .18), (4, .6, '5', .24), (8, .8, 'R', .18), (12, .7, 'A', .3)],                    # nốt cuối ô ngân qua khoảng trống (không tụt tiếng)
              'comp': [(3, .45, None, .08), (7, .55, None, .08), (11, .45, None, .08), (15, .55, None, .08)]},
    'sunny': {'kick': [(0, 1), (8, .85)], 'back': [(4, 1), (12, 1)], 'hat': [(s, .5) for s in O8],                     # ukulele quạt D-DU-UDU, vỗ tay 2–4
              'bass': [(0, .9, 'R', .4), (8, .8, '5', .3), (14, .5, '8', .15)],
              'comp': [(0, .8, None, .18), (4, .6, None, .1), (6, .65, None, .1), (10, .6, None, .1), (12, .7, None, .1), (14, .6, None, .1)]},
    'hop': {'kick': [(0, 1), (6, .7), (10, .6)], 'back': [(4, .9), (12, .9)], 'perc': [(s, .45) for s in (3, 7, 11, 15)],   # nảy lệch phách
            'bass': [(0, .9, 'R', .2), (3, .6, '8', .15), (6, .75, 'R', .2), (10, .7, '5', .2), (12, .6, '8', .15)],
            'comp': [(2, .7, None, .09), (7, .6, None, .08), (10, .7, None, .09), (15, .5, None, .07)]},
    'twinkle': {'perc': [(0, .6), (8, .35)], 'hat': [(s, .3) for s in (4, 12)], 'bass': [(0, .8, 'R', 1.0)],                                               # hộp nhạc lấp lánh 3+3+2
                'arp': [(s, .65 if s == 0 else .5, i, .4) for s, i in zip((0, 3, 6, 8, 11, 14), (2, 3, 1, 2, 0, 1))]},
    'stab': {'kick': [(0, 1), (6, .8)], 'bass': [(0, .95, 'R', .3), (6, .8, 'R', .2)],                                  # dừng nhịp: hai cú chặn rồi để trống cho bất ngờ
             'comp': [(0, 1., None, .25), (6, .85, None, .18)], 'hat': [(12, .4), (14, .4)]},
    # ---- lượt "chống trùng giữa các tập" (11/2026, lượt 2): mỗi điệu dưới đây là điệu riêng của đúng một tập (SIGNATURE) ----
    'jig': {'swing': 'trip', 'kick': [(0, 1), (8, .8)], 'back': [(4, .5), (12, .5)],                                 # jig 12/8: mỗi phách của phim chia ba móc đơn,
            'hat': [(4 * b + k, .55 if k == 0 else .32) for b in range(4) for k in range(3)],                       # "oom-cha-cha" — hình vẫn nhún đúng phách
            'perc': [(4 * b + 2, .3) for b in range(4)],
            'bass': [(0, .95, 'R', .4), (4, .7, '5', .3), (8, .85, '8', .4), (12, .7, '5', .3)],
            'comp': [(4 * b + k, .65 if k == 1 else .5, None, .08) for b in range(4) for k in (1, 2)]},
    'bossa': {'kick': [(0, .8), (6, .5), (8, .8), (14, .5)],                                                        # bossa nova: rim clave 3-2 (hai ô), bass gốc – năm
              'back': [(0, .8), (6, .8), (12, .8), (20, .8), (26, .8)], 'hat': [(s, .5 if s % 4 == 0 else .32) for s in O8],
              'bass': [(0, .9, 'R', .35), (6, .55, '5', .12), (8, .85, '5', .35), (14, .55, 'R', .12)],
              'comp': [(0, .7, None, .18), (3, .55, None, .12), (6, .65, None, .14), (10, .6, None, .12), (12, .65, None, .16)]},
    'ska': {'kick': [(0, .9), (8, .85)], 'back': [(4, .9), (12, .9)], 'hat': [(s, .5) for s in O8],                  # ska: đệm chặn ở mọi phách lẻ, bass đi bộ thẳng
            'perc': [(7, .4), (15, .4)],
            'bass': [(0, .9, 'R', .4), (4, .7, '3', .4), (8, .85, '5', .4), (12, .7, 'A', .4)],
            'comp': [(2, .9, None, .06), (6, .9, None, .06), (10, .9, None, .06), (14, .9, None, .06), (15, .45, None, .04)]},
    'samba': {'kick': [(0, .5), (4, 1), (8, .5), (12, 1)],                                                          # samba: surdo mạnh ở phách 2, tamborim lệch phách
              'back': [(0, .7), (3, .6), (6, .7), (8, .6), (10, .7), (13, .6)],
              'hat': [(s, .55 if s % 4 == 3 else .32) for s in range(16)], 'perc': [(0, .7), (2, .45), (6, .7), (10, .45), (12, .7)],
              'bass': [(0, .8, 'R', .18), (3, .55, 'R', .1), (4, .95, '5', .25), (8, .8, 'R', .18), (11, .55, 'R', .1), (12, .95, '5', .25)],
              'comp': [(2, .7, None, .08), (5, .6, None, .08), (7, .65, None, .08), (10, .7, None, .08), (13, .6, None, .08), (15, .55, None, .07)]},
    'disco': {'kick': [(0, 1), (4, .9), (8, 1), (12, .9)], 'back': [(4, .9), (12, .9)],                             # disco: kick bốn phách, hi-hat mở phách lẻ, bass quãng tám
              'hat': [(2, .8), (6, .8), (10, .8), (14, .8)], 'perc': [(s, .3) for s in range(16) if s % 4 != 2],
              'bass': [(s, .85 if s % 4 == 0 else .7, 'R' if s % 4 == 0 else '8', .14) for s in O8],
              'comp': [(0, .6, None, .35), (6, .7, None, .1), (10, .7, None, .1)]},
    'secondline': {'kick': [(0, .9), (6, .6), (10, .75)],                                                            # second-line: kèn đồng diễu phố New Orleans
                   'back': [(2, .35), (4, .9), (7, .5), (10, .4), (12, .9), (14, .35), (15, .5)], 'hat': [(s, .4) for s in O8],
                   'bass': [(0, .9, 'R', .3), (3, .6, '5', .15), (6, .8, '8', .25), (8, .85, '5', .3), (11, .6, 'R', .15), (14, .7, 'A', .2)],
                   'comp': [(4, .7, None, .12), (7, .6, None, .1), (12, .7, None, .12)]},
}
STYLE_VI = {'bounce': 'pop nảy', 'skip': 'shuffle nhảy chân sáo', 'march': 'diễu hành', 'polka': 'polka', 'calypso': 'calypso',
            'swing': 'swing', 'sway': 'nửa nhịp đung đưa', 'gallop': 'phi ngựa (nhịp kép)', 'tiptoe': 'rón rén', 'float': 'rải lơ lửng',
            'country': 'đồng quê', 'tension': 'nhịp tim hồi hộp', 'hush': 'lắng nghe', 'waltz': 'valse 3/4', 'waltzfloat': 'valse lơ lửng',
            'break': 'khựng', 'jingle': 'nhạc hiệu', 'stride': 'ragtime piano', 'hero': 'cao trào anh hùng', 'quest': 'phiêu lưu nước kiệu',
            'sneak': 'rình rập hài', 'sunny': 'ukulele nắng', 'hop': 'nảy lệch phách', 'twinkle': 'hộp nhạc lấp lánh', 'stab': 'dừng nhịp',
            'lilt': 'lơi 3+3+2', 'jig': 'jig 12/8', 'bossa': 'bossa nova', 'ska': 'ska phách lẻ', 'samba': 'samba lễ hội',
            'disco': 'disco', 'secondline': 'second-line kèn đồng'}
STYLE_FEEL = {'sway': .5, 'hush': .5, 'gallop': 2.}                  # nhịp cảm nhận = BPM × hệ số
# ---------- điệu riêng của từng tập (QUALITY.md §4, chống trùng giữa các tập) ----------
# Một điệu ở đây chỉ được dùng trong đúng tập đó; mỗi Short có ≥ 1 điệu riêng, chiếm ≥ 20 % thời lượng nhạc (qa.py).
# Tập mới: thêm một điệu mới vào STYLES rồi ghi vào đây, không mượn điệu riêng của tập khác.
SIGNATURE = {'jig': 'short-001', 'calypso': 'short-002', 'swing': 'short-003', 'march': 'short-004', 'secondline': 'short-004',
             'waltz': 'short-005', 'waltzfloat': 'short-005', 'country': 'short-006', 'bossa': 'short-007', 'disco': 'short-008',
             'ska': 'short-009', 'samba': 'short-010'}
# ---------- phong cách nhạc (Sound Design Plan) ----------
MOODS = {'playful': 'Playful Cartoon', 'happy': 'Happy Kids', 'funny': 'Funny Comedy', 'magic': 'Magical Adventure',
         'cute': 'Cute & Sweet', 'bouncy': 'Bouncy Rhythm', 'suspense': 'Suspense & Surprise', 'epic': 'Epic Cartoon'}
STYLE_MOOD = {'bounce': 'happy', 'skip': 'playful', 'march': 'epic', 'polka': 'funny', 'calypso': 'bouncy', 'swing': 'playful',
              'sway': 'cute', 'gallop': 'bouncy', 'tiptoe': 'suspense', 'float': 'magic', 'country': 'happy', 'tension': 'suspense',
              'hush': 'suspense', 'waltz': 'cute', 'waltzfloat': 'magic', 'stride': 'funny', 'hero': 'epic', 'quest': 'magic',
              'sneak': 'suspense', 'sunny': 'happy', 'hop': 'bouncy', 'twinkle': 'cute', 'stab': 'suspense', 'lilt': 'magic', 'jingle': 'epic',
              'jig': 'playful', 'bossa': 'cute', 'ska': 'bouncy', 'samba': 'bouncy', 'disco': 'happy', 'secondline': 'funny'}
ARCS = {'open': 'Mở đầu', 'build': 'Diễn biến', 'peak': 'Cao trào', 'end': 'Kết'}
TRANS = {'fill': 'trống dồn', 'riser': 'riser + chũm chọe ngược', 'pickup': 'nốt mồi của nhạc cụ mới', 'run': 'chuỗi nốt đi xuống',
         'gliss': 'vuốt đàn hạc', 'swell': 'dâng lấp lánh', 'drop': 'còi trượt xuống "bwomp"', 'tail': 'ngân đuôi, cảnh sau vào mềm',
         'soft': 'nhẹ dưới lời', 'tay': 'viết tay (stinger, khựng, nhạc hiệu)'}
ENERGY_G = {1: .72, 2: .88, 3: 1.0}
NOTE = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
QUAL = {'': (0, 4, 7), 'm': (0, 3, 7), '7': (0, 4, 7, 10), 'm7': (0, 3, 7, 10), 'maj7': (0, 4, 7, 11), '6': (0, 4, 7, 9),
        'sus4': (0, 5, 7), 'dim': (0, 3, 6), 'add9': (0, 4, 7, 14), 'sus2': (0, 2, 7)}
CONTOURS = {                                                                                       # bước trên thang ngũ cung + nốt hợp âm
    2: [(0, 2), (0, -1), (0, 3), (2, 0)], 3: [(0, 1, 2), (2, 1, 0), (0, 2, 1), (0, 0, 3), (1, 0, 2), (0, 3, 2)],
    4: [(0, 1, 2, 4), (4, 2, 1, 0), (0, 2, 1, 3), (0, 1, 0, 3), (3, 1, 2, 0), (0, 2, 4, 2)],
    5: [(0, 1, 2, 3, 5), (5, 3, 2, 1, 0), (0, 2, 1, 3, 2), (0, 1, 3, 2, 4), (2, 0, 1, 3, 5)],
    6: [(0, 1, 2, 1, 3, 4), (0, 2, 1, 3, 2, 4), (4, 3, 2, 3, 1, 0), (0, 1, 2, 4, 3, 5)],
}
# câu đáp theo phong cách nhạc (plan=True): ô nhịp (đơn vị: móc đơn của cảnh) và dáng giai điệu
MOOD_FILL = {
    'playful':  {'cells': ((0, 1, 2, 3), (0, 1, 1.5, 2, 3), (0, .5, 1, 2)), 'shape': 'pent'},
    'happy':    {'cells': ((0, 1, 2, 3), (0, 1, 2, 2.5, 3), (0, 2, 3)), 'shape': 'pent'},
    'funny':    {'cells': ((0, .5, 2), (0, 1, 1.5, 3), (0, .5, 1, 2.5)), 'shape': 'leap'},
    'magic':    {'cells': ((0, .5, 1, 1.5, 2, 2.5), (0, 1, 2, 3, 4)), 'shape': 'arp'},
    'cute':     {'cells': ((0, 1, 2), (0, .5, 1, 2), (0, 1, 1.5, 2)), 'shape': 'step'},
    'bouncy':   {'cells': ((0, 1.5, 2, 3), (0, .75, 1.5, 2.5), (0, 1.5, 3)), 'shape': 'pent'},
    'suspense': {'cells': ((0, 2, 3), (0, 1, 3), (0, .5, 2)), 'shape': 'chroma'},
    'epic':     {'cells': ((0, .5, 1, 2), (0, 1, 1.5, 2, 3)), 'shape': 'fanfare'},
}
# cách chuyển cảnh ưu tiên theo phong cách nhạc của cảnh sau (plan=True)
TR_ORDER = {'magic': ('gliss', 'swell', 'pickup'), 'epic': ('riser', 'fill', 'pickup'), 'funny': ('drop', 'pickup', 'fill'),
            'cute': ('tail', 'gliss', 'run'), 'suspense': ('tail', 'run', 'drop'), 'bouncy': ('pickup', 'fill', 'riser'),
            'happy': ('pickup', 'fill', 'gliss'), 'playful': ('fill', 'pickup', 'run')}


def chord(sym):
    """'F' → (5, (0, 4, 7)); 'Dm' → (2, (0, 3, 7)); 'Bb' → (10, …); 'E7' → (4, (0, 4, 7, 10))."""
    r = NOTE[sym[0]]; q = sym[1:]
    if q[:1] in ('#', 'b'): r += 1 if q[0] == '#' else -1; q = q[1:]
    return r % 12, QUAL[q]


def place(pc, lo, hi, near=None):
    """Nốt có lớp cao độ pc trong [lo, hi], gần `near` nhất (mặc định thấp nhất)."""
    c = [m for m in range(lo, hi + 1) if m % 12 == pc]
    if not c: c = [lo + (pc - lo) % 12]
    return min(c, key=lambda m: abs(m - near)) if near is not None else c[0]


class Groove:
    def __init__(self, M, beat, lines, meter=4, seed=1, avoid=(), low_voices=('albie',), dur=None, plan=False):
        self.M, self.beat, self.meter = M, beat, meter
        self.lines = sorted(lines, key=lambda l: l['t'])
        self.avoid = list(avoid); self.low = low_voices
        self.rng = np.random.default_rng(seed); self.S = []; self.dur = dur
        self.last_lead = None; self.voice = None; self.fills = 0; self.notes = 0; self.answers = []
        self.plan = plan; self.trans = []; self.last_tr = None; self.cell_i = {}; self.last_ctr = None

    # ---------- lời ----------
    def speaking(self, t, pre=.06, post=.03, who=None):
        return any(l['t'] - pre <= t < l['t'] + l['dur'] + post and (who is None or l['who'] in who) for l in self.lines)
    def talk(self, a, b):
        """Có lời trong [a, b)?"""
        return any(l['t'] - .06 < b and l['t'] + l['dur'] + .03 > a for l in self.lines)
    def gaps(self, a, b):
        """Các khoảng không lời trong [a, b), đã trừ các vùng `avoid` (điểm nhấn riêng của tập)."""
        busy = sorted([(l['t'] - .06, l['t'] + l['dur'] + .05) for l in self.lines] + [tuple(x) for x in self.avoid])
        out, cur = [], a
        for s, e in busy:
            if e <= cur or s >= b: continue
            if s > cur: out.append((cur, min(s, b)))
            cur = max(cur, e)
        if cur < b: out.append((cur, b))
        return [(s, e) for s, e in out if e - s > .05]
    def avoided(self, t): return any(a <= t < b for a, b in self.avoid)
    def avoided_span(self, a, b): return any(x < b and y > a for x, y in self.avoid)

    # ---------- khai báo cảnh ----------
    def _meta(self, style, bpm, mood, arc, what, emo, why, sfx, reprise, t0):
        beat = 60. / bpm if bpm else self.beat
        return dict(beat=beat, bpm=round(60. / beat, 2), origin=0. if abs(beat - self.beat) < 1e-9 else float(t0),
                    mood=mood or STYLE_MOOD.get(style), arc=arc, what=what, emo=emo, why=why, sfx=sfx, reprise=reprise,
                    feel_bpm=round(60. / beat * STYLE_FEEL.get(style, 1.), 1), tr=None, ramp=0., nfill=0)

    def sec(self, name, t0, t1, style, key, chords, bass=None, comp=None, lead=None, arp=None, kit='none', energy=2,
            fills=True, cue=True, no=(), g=1., lead_g=1., comp_reg=None, bpm=None, mood=None, arc=None, what='', emo='', why='',
            sfx='', tr=None, reprise=False, **kw):
        """Một cảnh nhạc từ t0 tới t1. chords: chuỗi hợp âm cách nhau bởi dấu cách, mỗi hợp âm một ô nhịp
        ('F C Dm Bb'); 'F,C' = hai hợp âm trong một ô. no: các vai bỏ hẳn ('kick', 'bass'…). cue: dấu đổi cảnh ở đầu cảnh này.
        bpm: BPM riêng của cảnh (không ghi: lưới của phim). mood/arc/what/emo/why/sfx/reprise: bảng Sound Design Plan.
        tr: ép một cách chuyển vào cảnh này ('fill', 'riser', 'pickup', 'run', 'gliss', 'swell', 'drop', 'tail')."""
        S = dict(name=name, t0=float(t0), t1=float(t1), style=style, key=key, chords=chords, bass=bass, comp=comp,
                 lead=lead, arp=arp or comp, kit=kit, energy=energy, fills=fills, cue=cue, no=tuple(no), g=g,
                 lead_g=lead_g, comp_reg=comp_reg, hand=False, **kw)
        S.update(self._meta(style, bpm, mood, arc, what, emo, why, sfx, reprise, t0)); S['tr_req'] = tr
        self.S.append(S)

    def answer(self, *ts):
        """Ghi các câu đáp viết tay trong mix.py (một câu nhạc ngắn đặt vào khoảng không lời, ví dụ xylophone "hử?"), để báo cáo đếm."""
        self.answers += [float(t) for t in ts]

    def mark(self, name, t0, t1, style, key, inst='', energy=2, bpm=None, mood=None, arc=None, what='', emo='', why='', sfx='',
             kit='', reprise=False):
        """Ghi một cảnh nhạc đã viết tay trong mix.py (nhạc hiệu, stinger, đoạn tổ khúc…) vào bảng cảnh, không đặt nốt nào.
        style: tên điệu để so với cảnh kề bên ('polka', 'jingle', 'break'…); inst: các nhạc cụ chính, cách nhau bởi dấu cách
        (thứ tự: đệm, giai điệu, lớp thứ ba). bpm, mood, arc, what, emo, why, sfx: như G.sec."""
        ins = inst.split() + [None, None, None]
        S = dict(name=name, t0=float(t0), t1=float(t1), style=style, key=key, chords=key, bass=None, comp=ins[0],
                 lead=ins[1], arp=ins[2], kit=kit, energy=energy, fills=False, cue=False, no=(), g=1., lead_g=1.,
                 comp_reg=None, hand=True)
        S.update(self._meta(style, bpm, mood, arc, what, emo, why, sfx, reprise, t0)); S['tr_req'] = None; S['origin'] = float(t0)
        self.S.append(S)

    # ---------- dựng ----------
    def _step_t(self, s, swing, spb, beat=None, origin=0.):
        beat = beat or self.beat
        b, sub = divmod(s % spb, 4); base = (s // spb) * spb // 4 + b
        if swing == 'trip': frac = (0, 1 / 3, 2 / 3, 5 / 6)[sub]           # chia ba (jig 12/8): móc kép 0, 1, 2 = ba móc đơn của phách
        else: frac = {0: 0, 1: .25, 2: 2 / 3 if swing else .5, 3: 5 / 6 if swing else .75}[sub]
        return origin + (base + frac) * beat
    def _chord_at(self, S, t):
        """Hợp âm đang chơi lúc t và hợp âm của ô nhịp sau. Hợp âm thứ k của chuỗi thuộc ô nhịp thứ k tính từ ô chứa t0."""
        bars = [c.split(',') for c in S['chords'].split()]
        O = S.get('origin', 0.); bar_len = STYLES.get(S['style'], {}).get('meter', 4) * S.get('beat', self.beat)
        b0 = int(np.floor((S['t0'] - O) / bar_len + 1e-6)); u = t - O
        k = int(np.floor(u / bar_len + 1e-6)) - b0; cs = bars[k % len(bars)]
        sub = int((u - np.floor(u / bar_len + 1e-6) * bar_len) / (bar_len / len(cs)) + 1e-6)
        return chord(cs[min(sub, len(cs) - 1)]), chord(bars[(k + 1) % len(bars)][0])
    def _key(self, S):
        k = S['key']; minor = k.endswith('m'); r = chord(k.rstrip('m') or k)[0]
        return r, ((0, 3, 5, 7, 10) if minor else (0, 2, 4, 7, 9))
    def _note(self, inst, m, t, g, d, pan):
        f, _ = PITCHED[inst]; self.M(f(int(m), d), t, g, pan); self.notes += 1
    def _drum(self, fn, v, t, g, pan):
        if fn is None: return
        self.M(fn(v), t, g, pan); self.notes += 1
    def _ent(self, S, t):
        """Cảnh vào mềm (plan=True, sau cách chuyển nhẹ): độ to tăng dần trong `ramp` giây đầu."""
        r = S.get('ramp', 0.)
        return 1. if not r or t >= S['t0'] + r else .5 + .5 * (t - S['t0']) / r

    def play(self):
        self.S.sort(key=lambda S: S['t0'])
        for i, S in enumerate(self.S):
            prev = self.S[i - 1] if i else None
            if S['hand']: continue
            if self.plan and prev is not None and S['cue'] and abs(prev['t1'] - S['t0']) < .3:
                if prev['hand']: S['accent'] = True                        # sau đoạn viết tay: chỉ nhấn phách đầu
                else:
                    S['tr'] = self._pick_tr(prev, S)
                    if S['tr'] in ('tail', 'gliss', 'swell', 'soft'): S['ramp'] = S['beat']
            self._play_sec(S, prev)
        for i, S in enumerate(self.S):                                     # bảng các chỗ đổi cảnh (cho SOUND-PLAN.md và qa.py)
            if not i: continue
            prev = self.S[i - 1]
            if abs(prev['t1'] - S['t0']) > .3: continue
            kind = S['tr'] if S['tr'] else ('tay' if (S['hand'] or prev['hand'] or not S['cue']) else ('fill' if S['energy'] >= prev['energy'] else 'run'))
            self.trans.append({'t': round(S['t0'], 3), 'from': prev['name'], 'to': S['name'], 'type': kind,
                               'bpm': [prev['bpm'], S['bpm']], 'mood': [prev['mood'], S['mood']]})
        return self.S

    def _play_sec(self, S, prev):
        st = STYLES[S['style']]; meter = st.get('meter', 4); spb = meter * 4; swing = st.get('swing', False)
        kit = KITS[S['kit']]; E = ENERGY_G[S['energy']] * S['g']; rng = self.rng; beat = S['beat']; O = S['origin']; q = beat / 4
        t0, t1 = S['t0'], S['t1']
        s0, s1 = int(np.ceil((t0 - O) / q - 1e-6)), int(np.ceil((t1 - O) / q - 1e-6))
        lowv = lambda t: self.speaking(t, who=self.low)
        for s in range(s0, s1):
            pos = s % spb; t = self._step_t(s, swing, spb, beat, O)
            if not t0 - 1e-6 <= t < t1: continue
            under = self.speaking(t); (root, iv), (nroot, _) = self._chord_at(S, t); en = self._ent(S, t)
            for role in ('kick', 'back', 'hat', 'perc'):
                if role in S['no'] or role not in st or not kit.get(role): continue
                if role == 'kick' and S['energy'] < 2 and S['style'] not in ('tension', 'sway'): continue
                if role == 'back' and S['energy'] < 2 and S['style'] not in ('tiptoe', 'sway', 'sneak'): continue
                span = 2 * spb if max(p[0] for p in st[role]) >= spb else spb      # mẫu hai ô nhịp (son clave 3-2…)
                for p in st[role]:
                    if p[0] != s % span: continue
                    v = p[1] * (1 + rng.uniform(-.08, .08))
                    gg = ROLE_G[role] * E * (UNDER.get(role, 1) if under else 1) * (LOW_KICK if role == 'kick' and lowv(t) else 1)
                    if role == 'hat' and S['energy'] == 3: gg *= 1.15
                    self._drum(kit[role], v, t + (rng.uniform(-.004, .004) if role in ('hat', 'perc') else 0), gg * en,
                               {'hat': .35, 'perc': .3, 'back': -.15}.get(role, 0))
            if S['bass'] and 'bass' not in S['no'] and 'bass' in st and not lowv(t):
                span = 2 * spb if max(p[0] for p in st['bass']) >= spb else spb
                for p in st['bass']:
                    if p[0] != s % span: continue
                    lo, hi = PITCHED[S['bass']][1]; r = place(root, lo, hi)
                    deg = 'R' if under and p[2] == '8' else p[2]                   # dưới lời không nhảy quãng tám (bồi âm rơi vào dải giọng)
                    m = {'R': r, '5': r + 7 if r + 7 <= hi + 2 else r - 5, '8': r + 12 if r + 12 <= hi + 7 else r,
                         '3': r + iv[1], 'A': place(nroot, lo, hi + 5) + (1 if rng.random() < .5 else -1)}[deg]
                    self._note(S['bass'], m, t, ROLE_G['bass'] * E * p[1] * en, p[3] * beat * 2, 0)
            if S['comp'] and 'comp' not in S['no'] and 'comp' in st and not self.avoided(t):
                for k_, p in enumerate(st['comp']):
                    if p[0] != pos: continue
                    if under and len(st['comp']) >= 4 and k_ % 2 == 0: continue    # dưới lời: tiếng đệm thưa một nửa
                    lo, hi = S['comp_reg'] or PITCHED[S['comp']][1]
                    if under: lo, hi = max(lo, 72), max(hi, 84)
                    vo = self._voicing(root, iv, lo, hi)
                    d = p[3] * beat * 2 * (.6 if under else 1)
                    for k, m in enumerate(vo):
                        self._note(S['comp'], m, t + k * .007, ROLE_G['comp'] * E * p[1] * (UNDER['comp'] if under else 1) / len(vo) ** .5 * 1.6 * en, d, -.3 + .6 * k / max(1, len(vo) - 1))
            if S['arp'] and 'arp' not in S['no'] and 'arp' in st and not self.avoided(t):
                for p in st['arp']:
                    if p[0] != pos: continue
                    lo, hi = PITCHED[S['arp']][1]; lo = max(lo, 72) if under else lo
                    tones = self._voicing(root, iv, lo, hi + 12, n=4)
                    m = tones[p[2] % len(tones)]
                    self._note(S['arp'], m, t, ROLE_G['arp'] * E * p[1] * (UNDER['arp'] if under else 1) * en, p[3] * beat * 2, .25)
        # nốt bass mở cảnh khi cảnh bắt đầu giữa ô nhịp (phách 1 của ô đã qua): cảnh mới nghe ra ngay từ đầu
        if S['bass'] and 'bass' not in S['no'] and 'bass' in st and S['style'] != 'break' and not lowv(t0):
            spb4 = st.get('meter', 4) * 4; s_first = int(np.ceil((t0 - O) / q - 1e-6))
            if not any(p[0] % spb4 == s_first % spb4 for p in st['bass']):
                (root, _), _ = self._chord_at(S, t0); lo, hi = PITCHED[S['bass']][1]
                self._note(S['bass'], place(root, lo, hi), O + s_first * q, ROLE_G['bass'] * E * .9 * self._ent(S, t0), beat * .9, 0)
        # dấu đổi cảnh
        if prev is not None and S['cue']:
            if self.plan and S['tr']: self._transition(prev, S)
            elif self.plan and S.get('accent'): self._accent(S)
            elif not self.plan: self._cue(prev, S)
        # câu đáp trong khoảng trống
        if S['lead'] and S['fills'] and 'lead' not in S['no']:
            for a, b in self.gaps(t0, t1):
                if self.plan: self._fill_plan(S, a, b, swing)
                else: self._fill(S, a, b, swing)

    def _voicing(self, root, iv, lo, hi, n=3):
        pcs = [(root + i) % 12 for i in iv][:max(n, 3)]
        near = self.voice if self.voice is not None else (lo + hi) // 2
        out = []
        for k, pc in enumerate(pcs):
            m = place(pc, lo, hi, near + 4 * k - 4)
            while m in out: m += 12
            out.append(m)
        out = sorted(out)[:n]; self.voice = out[len(out) // 2]
        return out

    def _cue(self, prev, S):
        """(Mặc định) Phách cuối trước cảnh mới: trống dồn (mạnh lên) hoặc chuỗi nốt đi xuống (nhẹ đi); phách đầu: kick + chũm chọe."""
        tb = S['t0']; up = S['energy'] >= prev['energy']; q = prev['beat'] / 4; under = self.speaking(tb - .2)
        gg = .55 if under else 1.
        if prev['hand']: pass                                              # đoạn viết tay tự lo phần chuyển của nó
        elif up and prev['style'] not in ('hush', 'break'):
            if prev['kit'] == 'march': seq = [(lambda v: snare(v), .35 + .15 * k) for k in range(4)]
            else: seq = [(lambda v, m=m: tom(m, v), .5 + .1 * k) for k, m in enumerate((55, 52, 48, 45))]
            for k, (f, v) in enumerate(seq): self._drum(f, v, tb - (4 - k) * q, .42 * gg, -.1 + .07 * k)
        elif not up and prev['lead'] and not under:
            (root, iv), _ = self._chord_at(prev, tb - .01)
            lo, hi = PITCHED[prev['lead']][1]; tones = sorted(self._voicing(root, iv, lo, hi, n=3), reverse=True)
            for k, m in enumerate(tones): self._note(prev['lead'], m, tb - (3 - k) * q * 1.5, ROLE_G['lead'] * .7, .3, .25)
        if S['energy'] >= 2 and S['style'] != 'break' and 'kick' not in S['no']:
            if KITS[S['kit']].get('kick') and not self.speaking(tb, who=self.low): self._drum(KITS[S['kit']]['kick'], 1., tb, .6, 0)
            self.M(T.cymbal(1.4, 1., 5000 if S['energy'] == 3 else 3800), tb, .2 if S['energy'] == 3 else .13, .15); self.notes += 1
        elif S['style'] in ('float', 'hush', 'waltzfloat', 'tension') and S['arp']:
            self.M(T.swell(.45, 1., 76, 96, len(self.S)), tb - .4, .12, .2)

    # ---------- chuyển cảnh (plan=True) ----------
    def _pitched(self, S, roles=('lead', 'arp', 'comp')):
        for r in roles:
            if S.get(r) and S[r] in PITCHED and r not in S['no']: return S[r]
        return None

    def _pick_tr(self, prev, S):
        """Chọn cách chuyển: theo phong cách và năng lượng của cảnh sau, tránh dải giọng khi có lời, không lặp kiểu của lần trước."""
        if S['tr_req']: self.last_tr = S['tr_req']; return S['tr_req']
        tb = S['t0']; pb = prev['beat']; up = S['energy'] > prev['energy']; down = S['energy'] < prev['energy']
        order = list(TR_ORDER.get(S['mood'], ('fill', 'pickup', 'run')))
        if up and S['energy'] == 3 and S['mood'] not in ('magic', 'cute'): order = ['riser', 'fill'] + order
        if down and S['mood'] != 'magic': order = ['run', 'tail'] + order
        ok, quiet = [], {}
        for o in dict.fromkeys(order + ['swell', 'fill', 'tail']):
            w = self._win(o, prev, S); busy = self.talk(tb - w, tb + .02)
            if self.avoided_span(tb - w, tb - .02) and o not in ('fill', 'tail'): continue   # nhường điểm nhấn viết tay
            if busy:                                                       # dưới lời: không vuốt, không còi, không riser; nốt mồi / chuỗi nốt chỉ ở dải cao
                if o in ('riser', 'gliss', 'drop'): continue
                if o == 'pickup' and not self._hi(S): continue
                if o == 'run' and not self._hi(prev): continue
            if o == 'run' and not self._pitched(prev): continue
            if o == 'pickup' and not self._pitched(S): continue
            if o == 'fill' and prev['style'] in ('hush', 'break', 'float', 'waltzfloat', 'twinkle') and not up: continue
            if o == 'swell' and o not in order and not busy: continue       # dâng lấp lánh: kiểu riêng của phép thuật, hoặc kiểu nhẹ khi có lời
            ok.append(o); quiet[o] = busy
        if not ok: S['quiet'] = True; return 'soft'
        pick = next((o for o in ok if o != self.last_tr), ok[0])
        self.last_tr = pick; S['quiet'] = quiet[pick]
        return pick

    def _hi(self, S, roles=('lead', 'arp', 'comp')):
        """Nhạc cụ có cao độ ở dải cao (≥ 76) của cảnh: được chơi vài nốt ngắn dưới lời."""
        for r in roles:
            k = S.get(r)
            if k and k in PITCHED and r not in S['no'] and PITCHED[k][1][0] >= 76: return k
        return None

    def _win(self, o, prev, S):
        """Độ dài (giây) mà cách chuyển `o` chiếm trước điểm cắt."""
        pb, nb = prev['beat'], S['beat']
        return {'fill': pb, 'riser': min(pb * 1.5, .9), 'pickup': 1.5 * nb, 'run': 1.15 * pb, 'gliss': min(pb * .9, .6),
                'swell': min(pb * .9, .6), 'drop': min(pb * 1.2, .6), 'tail': pb * .5}[o]

    def _gliss(self, S, inst, t, d, up, g):
        kroot, pent = self._key(S); lo, hi = PITCHED[inst][1]
        ns = [m for m in range(lo, hi + 1) if (m - kroot) % 12 in pent]
        if not up: ns = ns[::-1]
        for i, m in enumerate(ns): self._note(inst, m, t + d * (i / len(ns)) ** 1.25, g * (.6 + .4 * i / len(ns)), .45, -.3 + .6 * i / len(ns))

    def _transition(self, prev, S):
        tr = S['tr']; tb = S['t0']; pb = prev['beat']; pq = pb / 4; nb = S['beat']
        talk = S.get('quiet', False); gg = .55 if talk else 1.
        if tr in ('fill', 'soft'):
            if tr == 'fill':
                if S['mood'] == 'epic' or prev['kit'] in ('march', 'epic'):
                    for k in range(8): self._drum(lambda v: snare(v), .25 + .09 * k, tb - (8 - k) * pq / 2, .42 * gg, -.1 + .03 * k)
                else:
                    for k, m in enumerate((55, 52, 48, 45)): self._drum(lambda v, m=m: tom(m, v), .5 + .1 * k, tb - (4 - k) * pq, .42 * gg, -.1 + .07 * k)
        elif tr == 'riser':
            d = min(pb * 1.5, .9); self.M(riser(d, .8), tb - d, .3, 0); self.M(T.revcymbal(d, 1.), tb - d, .16, .15); self.notes += 2
        elif tr in ('gliss', 'swell'):
            inst = 'glock' if tr == 'swell' else 'harp'; d = min(pb * .9, .6)
            self._gliss(S if S['energy'] >= prev['energy'] or tr == 'swell' else prev, inst, tb - d, d, S['energy'] >= prev['energy'] or tr == 'swell', (.26 if tr == 'gliss' else .2) * (.7 if talk else 1))
            if tr == 'swell' and not talk: self.M(T.swell(d, 1., 76, 96, len(self.trans)), tb - d, .08, .2); self.notes += 1
        elif tr == 'drop':
            d = min(pb * 1.2, .6); (root, _), _ = self._chord_at(prev, tb - .02)
            self.M(T.whistle(1500, 480, d * .8, 1., .02), tb - d, .1, .2)                   # còi trượt xuống
            self.M(trombone(place(root, 50, 61) + 7, d * .55 + .1, 1., -5.), tb - d * .55, .3, 0); self.notes += 2   # trombone "bwomp"
        elif tr == 'run':
            inst = self._hi(prev) if talk else self._pitched(prev); (root, iv), _ = self._chord_at(prev, tb - .01)
            lo, hi = PITCHED[inst][1]; tones = sorted(self._voicing(root, iv, lo, hi, n=3), reverse=True)
            for k, m in enumerate(tones): self._note(inst, m, tb - (3 - k) * pq * 1.5, ROLE_G['lead'] * .7 * gg, .3, .25)
        elif tr == 'pickup':
            inst = self._hi(S) if talk else self._pitched(S); (root, iv), _ = self._chord_at(S, tb + .01); kroot, pent = self._key(S)
            lo, hi = PITCHED[inst][1]; lo2 = max(lo, 76) if (talk or self.speaking(tb + .05)) else lo
            pool = sorted({m for m in range(lo2 - (0 if talk else 5), hi + 1) if (m - kroot) % 12 in pent or (m - root) % 12 in iv})
            tgt = place(root, lo2 + 5, hi, (lo2 + hi) // 2); i = int(np.argmin([abs(p - tgt) for p in pool]))
            run = [pool[max(0, i - k)] for k in (3, 2, 1)]
            for k, m in enumerate(run): self._note(inst, m, tb - (3 - k) * nb / 2, ROLE_G['lead'] * (.6 + .1 * k) * gg, .2, .2)
            if not self.speaking(tb + .05): self._note(inst, tgt, tb, ROLE_G['lead'] * .9, .4, .2)
        elif tr == 'tail':
            inst = self._pitched(prev, ('comp', 'arp', 'lead'))
            if inst and not self.talk(tb - .1, tb + 1.):
                (root, iv), _ = self._chord_at(prev, tb - .02); lo, hi = PITCHED[inst][1]
                for k, m in enumerate(self._voicing(root, iv, max(lo, 67), max(hi, 79))): self._note(inst, m, tb - pq * 2 + k * .02, ROLE_G['comp'] * .5, 1.1, -.2 + .2 * k)
        self._accent(S)

    def _accent(self, S):
        """Phách đầu cảnh mới, nhấn theo phong cách nhạc."""
        tb = S['t0']; m = S['mood']; low = self.speaking(tb, who=self.low); talk = self.speaking(tb + .02)
        if S['style'] == 'break': return
        kk = KITS[S['kit']].get('kick') if 'kick' not in S['no'] else None
        (root, _), _ = self._chord_at(S, tb + .01)
        if m == 'epic':
            if not low: self.M(timpani(place(root, 38, 50), 1., 1.), tb, .55, 0); self.notes += 1
            self.M(T.cymbal(1.6, 1., 5200), tb, .2 if not talk else .12, .15); self.notes += 1
        elif m in ('bouncy', 'happy', 'playful'):
            if S['energy'] >= 2:
                if kk and not low: self._drum(kk, 1., tb, .6, 0)
                self.M(T.cymbal(1.4, 1., 5000 if S['energy'] == 3 else 3800), tb, (.2 if S['energy'] == 3 else .13) * (.7 if talk else 1), .15); self.notes += 1
            else: self.M(triangle(.8, .8), tb, .3, .3); self.notes += 1
        elif m == 'funny':
            if kk and not low: self._drum(kk, .9, tb, .55, 0)
            self.M(T.block(76, .8), tb + .01, .3, -.2); self.notes += 1
        elif m == 'cute':
            self.M(triangle(1., 1.), tb, .35, .3); self.notes += 1
        elif m == 'magic':
            self.M(T._ting(mf(place(root, 88, 99)), .8, 1.), tb, .18, .3); self.M(T.cymbal(1.8, 1., 6000), tb, .07, -.2); self.notes += 2
        elif m == 'suspense':
            if not low: self._drum(lambda v: tom(45, v), .7, tb, .4, 0)

    # ---------- câu đáp ----------
    def _fill(self, S, a, b, swing):
        """(Mặc định) Câu đáp của nhạc cụ hát chính trong khoảng không lời [a, b)."""
        lead = S['lead']; lo, hi = PITCHED[lead][1]; O = S['origin']; beat = S['beat']
        step = beat / 2 if b - a >= .9 else beat / 4                       # khoảng ngắn: "đáp" nhanh bằng móc kép
        ta = O + np.ceil((a + .04 - O) / step) * step; tb = b - .12
        n = int((tb - ta) / step) + 1
        if n < 2: return
        if step < beat / 2: swing = False; n = min(n, 3)
        n = min(n, 8)
        (root, iv), _ = self._chord_at(S, ta)
        kroot, pent = self._key(S)
        pool = sorted({m for m in range(lo, hi + 1) if (m - kroot) % 12 in pent or (m - root) % 12 in iv})
        start = self.last_lead if self.last_lead is not None else place(root, lo + 4, hi)
        si = int(np.argmin([abs(p - start) for p in pool]))
        if n >= 7:                                                         # khoảng dài: câu hai nửa (hỏi – đáp)
            c1 = CONTOURS[4][self.rng.integers(len(CONTOURS[4]))]; c2 = CONTOURS[min(n - 4, 4)][self.rng.integers(len(CONTOURS[min(n - 4, 4)]))]
            shape = list(c1) + [c1[-1] + x - c2[0] - 1 for x in c2]
        else:
            k = max(2, min(n, 6)); shape = list(CONTOURS[k][self.rng.integers(len(CONTOURS[k]))])
        if si + max(shape) >= len(pool): shape = [-x for x in shape]
        if si + min(shape) < 0: shape = [x - min(shape) for x in shape]
        ns = [pool[int(np.clip(si + x, 0, len(pool) - 1))] for x in shape]
        (r2, iv2), _ = self._chord_at(S, ta + (len(ns) - 1) * step)
        cts = [m for m in pool if (m - r2) % 12 in iv2]
        if cts: ns[-1] = min(cts, key=lambda m: abs(m - ns[-1]))           # nốt cuối rơi vào nốt của hợp âm
        g = ROLE_G['lead'] * ENERGY_G[S['energy']] * S['lead_g']
        for k, m in enumerate(ns):
            t = ta + k * step + (step / 3 if swing and k % 2 else 0)
            if t >= tb: break
            last = k == len(ns) - 1
            self._note(lead, m, t, g * (1.1 if last else .9 + .1 * (k % 2)), (.45 if last else .22), .25 if k % 2 else .15)
        self.last_lead = ns[-1]; self.fills += 1; S['nfill'] += 1

    def _shape(self, S, n, shape, t, lo, hi):
        """Cao độ của một câu đáp n nốt theo dáng của phong cách nhạc."""
        (root, iv), _ = self._chord_at(S, t); kroot, pent = self._key(S)
        pool = sorted({m for m in range(lo, hi + 1) if (m - kroot) % 12 in pent or (m - root) % 12 in iv})
        cts = [m for m in range(lo, hi + 1) if (m - root) % 12 in iv]
        start = self.last_lead if self.last_lead is not None and lo <= self.last_lead <= hi else place(root, lo + 4, hi)
        rng = self.rng
        if shape in ('arp', 'fanfare') and cts:
            j = int(np.argmin([abs(c - (start - 5 if shape == 'arp' else start - 7)) for c in cts]))
            j = min(j, max(0, len(cts) - n)); hop = 1
            ns = [cts[min(len(cts) - 1, j + k * hop)] for k in range(n)]
            if shape == 'fanfare' and len(ns) >= 3 and ns[-1] - ns[0] < 12 and ns[0] + 12 <= hi: ns[-1] = ns[0] + 12
            return ns
        if shape == 'chroma':
            r = place(root, lo, hi, start); fifth = r + 7 if r + 7 <= hi else r - 5
            pat = [r, r + 1, r, fifth, r - 1, r][:n] if n > 3 else [r, r + 1, r][:n]
            return [int(np.clip(m, lo, hi)) for m in pat]
        if shape == 'leap' and cts:
            j = int(np.argmin([abs(c - start) for c in cts])); out = []
            for k in range(n):
                jj = j + (2 if k % 2 else -1) + (k // 2)
                out.append(cts[int(np.clip(jj, 0, len(cts) - 1))])
            if n >= 3:                                                     # nốt cuối nhảy quãng tám xuống: "bwomp" hài
                o = out[-2] - 12; out[-1] = o if o >= lo else min(cts, key=lambda c: abs(c - (out[-2] - 7)))
            return out
        si = int(np.argmin([abs(p - start) for p in pool]))
        if shape == 'step':                                                # dễ thương: bậc liền, ở nửa trên của quãng
            si = max(si, len(pool) // 2)
            opts = [(0, 1, 2, 1, 2, 3), (2, 1, 0, 1, 2, 1), (0, 1, 0, 2, 1, 2), (1, 2, 3, 2, 1, 0)]
        else:
            opts = CONTOURS.get(max(2, min(n, 6)), CONTOURS[4])
        ix = int(rng.integers(len(opts)))
        if ix == self.last_ctr and len(opts) > 1: ix = (ix + 1) % len(opts)
        self.last_ctr = ix; sh = list(opts[ix])[:n]
        while len(sh) < n: sh.append(sh[-1] + (1 if len(sh) % 2 else -1))
        if si + max(sh) >= len(pool): sh = [-x for x in sh]
        if si + min(sh) < 0: sh = [x - min(sh) for x in sh]
        ns = [pool[int(np.clip(si + x, 0, len(pool) - 1))] for x in sh]
        if cts: ns[-1] = min(cts, key=lambda m: abs(m - ns[-1]))           # nốt cuối rơi vào nốt của hợp âm
        return ns

    def _fill_plan(self, S, a, b, swing):
        """Câu đáp theo phong cách nhạc của cảnh (plan=True): ô nhịp và dáng giai điệu từ MOOD_FILL, không lặp ô của lần trước."""
        lead = S['lead']; lo, hi = PITCHED[lead][1]; O = S['origin']; u = S['beat'] / 2
        ta = O + np.ceil((a + .04 - O) / (u / 2)) * (u / 2); tb = b - .12; avail = tb - ta
        if avail < u * .45: return
        spec = MOOD_FILL.get(S['mood'], MOOD_FILL['playful'])
        fit = [c for c in spec['cells'] if c[-1] * u <= avail]
        if not fit:                                                        # khoảng ngắn: "đáp" 2–3 nốt móc kép
            n = min(3, int(avail / (u / 2)) + 1)
            if n < 2: return
            cell = tuple(.5 * i for i in range(n)); swing = False
        else:
            k = self.cell_i.get(S['mood'], int(self.rng.integers(len(fit)))); cell = fit[k % len(fit)]; self.cell_i[S['mood']] = k + 1
        xs = list(cell)
        if fit and (2 * cell[-1] + 2) * u <= avail:                        # khoảng dài: hỏi – đáp, nửa sau là một ô khác
            c2 = fit[(self.cell_i[S['mood']]) % len(fit)]; xs += [cell[-1] + 2 + x for x in c2]; self.cell_i[S['mood']] += 1
        ns = self._shape(S, len(xs), spec['shape'], ta, lo, hi)
        if len(xs) > len(cell):                                            # nửa sau đáp lại: nốt cuối về gốc hợp âm
            (r2, iv2), _ = self._chord_at(S, ta + xs[-1] * u)
            ns[-1] = place(r2, lo, hi, ns[-1])
        g = ROLE_G['lead'] * ENERGY_G[S['energy']] * S['lead_g']
        for k, (x, m) in enumerate(zip(xs, ns)):
            t = ta + x * u + (u / 3 if swing and abs(x % 2 - 1) < 1e-6 else 0)        # swing: móc đơn lẻ trễ về 2/3 phách
            if t >= tb: break
            last = k == len(xs) - 1
            if last and spec['shape'] == 'leap' and t - u / 4 > ta:        # nốt láy trước nốt cuối (hài)
                self._note(lead, int(np.clip(m + 2, lo, hi)), t - u / 4, g * .55, .08, .2)
            self._note(lead, m, t, g * (1.1 if last else .9 + .1 * (k % 2)), (.45 if last else .22), .25 if k % 2 else .15)
        self.last_lead = ns[-1]; self.fills += 1; S['nfill'] += 1

    # ---------- báo cáo ----------
    def save(self, path, color=None):
        keep = ('name', 't0', 't1', 'style', 'key', 'chords', 'bass', 'comp', 'lead', 'arp', 'kit', 'energy', 'hand',
                'bpm', 'feel_bpm', 'mood', 'arc', 'what', 'emo', 'why', 'sfx', 'reprise', 'tr', 'nfill', 'cue')
        json.dump({'version': 2, 'plan': self.plan, 'bpm': round(60 / self.beat, 2), 'color': color,
                   'sections': [{k: S.get(k) for k in keep} for S in self.S], 'transitions': self.trans,
                   'fills': self.fills, 'answers': sorted(self.answers), 'notes': self.notes},
                  open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
