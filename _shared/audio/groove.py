"""Lớp nhịp theo cảnh cho nhạc nền của kênh (lượt "nhạc nền sinh động", 11/2026): mỗi cảnh một điệu, một bộ nhạc cụ,
một vòng hoà âm và một mức năng lượng, nên trong một Short nhạc đổi rõ theo từng cảnh thay vì một lớp đệm đều từ đầu đến cuối.

    from groove import Groove
    G = Groove(M, BEAT, LINES, meter=4, seed=3, avoid=[(a, b), ...])      # M: hàm đặt nốt của mix.py (đã tôn trọng REST)
    G.sec('hook', 0, 2.45, 'tension', 'Dm', 'Dm', bass='upright', lead='vibes', kit='jazz', energy=1)
    G.sec('zoom', 2.45, 4.5, 'swing', 'Dm', 'Dm Bb', bass='upright', comp='rhodes', lead='vibes', kit='jazz', energy=3)
    ...
    G.play(); G.save(os.path.join(HERE, 'out', 'music.json'))           # qa.py đọc music.json để kiểm "nhạc đổi theo cảnh"

Ba việc lớp nhịp tự làm, để mỗi tập không phải viết tay:
1. **Thưa dưới lời.** Đang có lời thì chỉ còn bass, kick, hat/shaker và tiếng đệm rất ngắn ở dải cao; giai điệu im.
   Dưới giọng trầm (Albie) bỏ luôn bass và kick (`low_voices`).
2. **Câu đáp trong khoảng trống.** Mỗi khoảng không lời ≥ 0,45 s trong cảnh có một câu nhạc ngắn của nhạc cụ hát chính
   (2–3 nốt "đáp" khi khoảng ngắn, câu 4–8 nốt khi khoảng dài), đi theo hợp âm đang chơi, nối tiếp cao độ của câu đáp trước.
3. **Đổi cảnh có dấu.** Phách cuối trước cảnh mới: trống dồn (khi cảnh sau mạnh hơn) hoặc chuỗi nốt đi xuống (khi cảnh sau nhẹ hơn);
   phách đầu cảnh mới: kick + chũm chọe mềm (năng lượng ≥ 2).

Mọi nốt dùng nhạc cụ tổng hợp của band.py và toon.py (không mẫu của bên thứ ba). Lưới nhịp là lưới của phim (mặc định 120 BPM),
nên phách của lớp nhịp trùng phách của hình. Điệu nửa nhịp ('sway') và nhịp kép ('gallop') làm nhịp cảm thấy chậm/nhanh hơn mà không lệch hình.
"""
import json
import numpy as np
from band import (mf, pluck, marimba, bassn, buzzbass, kick, clap, hat, shaker, bell, horn, pizz, xylo, flute, reed, steel, tuba,
                  tom, claves, brush, tamb, celesta, harp, rhodes, vibes, snap, upright, snare, banjo)
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
}
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
}
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
}
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
    def __init__(self, M, beat, lines, meter=4, seed=1, avoid=(), low_voices=('albie',), dur=None):
        self.M, self.beat, self.meter = M, beat, meter
        self.lines = sorted(lines, key=lambda l: l['t'])
        self.avoid = list(avoid); self.low = low_voices
        self.rng = np.random.default_rng(seed); self.S = []; self.dur = dur
        self.last_lead = None; self.voice = None; self.fills = 0; self.notes = 0; self.answers = []

    # ---------- lời ----------
    def speaking(self, t, pre=.06, post=.03, who=None):
        return any(l['t'] - pre <= t < l['t'] + l['dur'] + post and (who is None or l['who'] in who) for l in self.lines)
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

    # ---------- khai báo cảnh ----------
    def sec(self, name, t0, t1, style, key, chords, bass=None, comp=None, lead=None, arp=None, kit='none', energy=2,
            fills=True, cue=True, no=(), g=1., lead_g=1., comp_reg=None, **kw):
        """Một cảnh nhạc từ t0 tới t1. chords: chuỗi hợp âm cách nhau bởi dấu cách, mỗi hợp âm một ô nhịp
        ('F C Dm Bb'); 'F,C' = hai hợp âm trong một ô. no: các vai bỏ hẳn ('kick', 'bass'…). cue: dấu đổi cảnh ở đầu cảnh này."""
        self.S.append(dict(name=name, t0=float(t0), t1=float(t1), style=style, key=key, chords=chords, bass=bass, comp=comp,
                           lead=lead, arp=arp or comp, kit=kit, energy=energy, fills=fills, cue=cue, no=tuple(no), g=g,
                           lead_g=lead_g, comp_reg=comp_reg, hand=False, **kw))

    def answer(self, *ts):
        """Ghi các câu đáp viết tay trong mix.py (một câu nhạc ngắn đặt vào khoảng không lời, ví dụ xylophone "hử?"), để báo cáo đếm."""
        self.answers += [float(t) for t in ts]

    def mark(self, name, t0, t1, style, key, inst='', energy=2):
        """Ghi một cảnh nhạc đã viết tay trong mix.py (nhạc hiệu, stinger, đoạn tổ khúc…) vào bảng cảnh, không đặt nốt nào.
        style: tên điệu để so với cảnh kề bên ('polka', 'jingle', 'break'…); inst: các nhạc cụ chính, cách nhau bởi dấu cách."""
        ins = inst.split() + [None, None, None]
        self.S.append(dict(name=name, t0=float(t0), t1=float(t1), style=style, key=key, chords=key, bass=None, comp=ins[0],
                           lead=ins[1], arp=ins[2], kit='', energy=energy, fills=False, cue=False, no=(), g=1., lead_g=1.,
                           comp_reg=None, hand=True))

    # ---------- dựng ----------
    def _step_t(self, s, swing, spb):
        b, sub = divmod(s % spb, 4); base = (s // spb) * spb // 4 + b
        frac = {0: 0, 1: .25, 2: 2 / 3 if swing else .5, 3: 5 / 6 if swing else .75}[sub]
        return (base + frac) * self.beat
    def _chord_at(self, S, t):
        """Hợp âm đang chơi lúc t và hợp âm của ô nhịp sau. Hợp âm thứ k của chuỗi thuộc ô nhịp thứ k tính từ ô chứa t0."""
        bars = [c.split(',') for c in S['chords'].split()]
        bar_len = STYLES[S['style']].get('meter', 4) * self.beat; b0 = int(np.floor(S['t0'] / bar_len + 1e-6))
        k = int(np.floor(t / bar_len + 1e-6)) - b0; cs = bars[k % len(bars)]
        sub = int((t - np.floor(t / bar_len + 1e-6) * bar_len) / (bar_len / len(cs)) + 1e-6)
        return chord(cs[min(sub, len(cs) - 1)]), chord(bars[(k + 1) % len(bars)][0])
    def _key(self, S):
        k = S['key']; minor = k.endswith('m'); r = chord(k.rstrip('m') or k)[0]
        return r, ((0, 3, 5, 7, 10) if minor else (0, 2, 4, 7, 9))
    def _note(self, inst, m, t, g, d, pan):
        f, _ = PITCHED[inst]; self.M(f(int(m), d), t, g, pan); self.notes += 1
    def _drum(self, fn, v, t, g, pan):
        if fn is None: return
        self.M(fn(v), t, g, pan); self.notes += 1

    def play(self):
        self.S.sort(key=lambda S: S['t0'])
        for i, S in enumerate(self.S):
            if not S['hand']: self._play_sec(S, self.S[i - 1] if i else None)
        return self.S

    def _play_sec(self, S, prev):
        st = STYLES[S['style']]; meter = st.get('meter', 4); spb = meter * 4; swing = st.get('swing', False)
        kit = KITS[S['kit']]; E = ENERGY_G[S['energy']] * S['g']; rng = self.rng; q = self.beat / 4
        t0, t1 = S['t0'], S['t1']
        s0, s1 = int(np.ceil(t0 / q - 1e-6)), int(np.ceil(t1 / q - 1e-6))
        lowv = lambda t: self.speaking(t, who=self.low)
        for s in range(s0, s1):
            pos = s % spb; t = self._step_t(s, swing, spb)
            if not t0 - 1e-6 <= t < t1: continue
            under = self.speaking(t); (root, iv), (nroot, _) = self._chord_at(S, t)
            for role in ('kick', 'back', 'hat', 'perc'):
                if role in S['no'] or role not in st or not kit.get(role): continue
                if role == 'kick' and S['energy'] < 2 and S['style'] not in ('tension', 'sway'): continue
                if role == 'back' and S['energy'] < 2 and S['style'] not in ('tiptoe', 'sway'): continue
                span = 2 * spb if max(p[0] for p in st[role]) >= spb else spb      # mẫu hai ô nhịp (son clave 3-2…)
                for p in st[role]:
                    if p[0] != s % span: continue
                    v = p[1] * (1 + rng.uniform(-.08, .08))
                    gg = ROLE_G[role] * E * (UNDER.get(role, 1) if under else 1) * (LOW_KICK if role == 'kick' and lowv(t) else 1)
                    if role == 'hat' and S['energy'] == 3: gg *= 1.15
                    self._drum(kit[role], v, t + (rng.uniform(-.004, .004) if role in ('hat', 'perc') else 0), gg,
                               {'hat': .35, 'perc': .3, 'back': -.15}.get(role, 0))
            if S['bass'] and 'bass' not in S['no'] and 'bass' in st and not lowv(t):
                span = 2 * spb if max(p[0] for p in st['bass']) >= spb else spb
                for p in st['bass']:
                    if p[0] != s % span: continue
                    lo, hi = PITCHED[S['bass']][1]; r = place(root, lo, hi)
                    deg = 'R' if under and p[2] == '8' else p[2]                   # dưới lời không nhảy quãng tám (bồi âm rơi vào dải giọng)
                    m = {'R': r, '5': r + 7 if r + 7 <= hi + 2 else r - 5, '8': r + 12 if r + 12 <= hi + 7 else r,
                         '3': r + iv[1], 'A': place(nroot, lo, hi + 5) + (1 if rng.random() < .5 else -1)}[deg]
                    self._note(S['bass'], m, t, ROLE_G['bass'] * E * p[1], p[3] * self.beat * 2, 0)
            if S['comp'] and 'comp' not in S['no'] and 'comp' in st and not self.avoided(t):
                for k_, p in enumerate(st['comp']):
                    if p[0] != pos: continue
                    if under and len(st['comp']) >= 4 and k_ % 2 == 0: continue    # dưới lời: tiếng đệm thưa một nửa
                    lo, hi = S['comp_reg'] or PITCHED[S['comp']][1]
                    if under: lo, hi = max(lo, 72), max(hi, 84)
                    vo = self._voicing(root, iv, lo, hi)
                    d = p[3] * self.beat * 2 * (.6 if under else 1)
                    for k, m in enumerate(vo):
                        self._note(S['comp'], m, t + k * .007, ROLE_G['comp'] * E * p[1] * (UNDER['comp'] if under else 1) / len(vo) ** .5 * 1.6, d, -.3 + .6 * k / max(1, len(vo) - 1))
            if S['arp'] and 'arp' not in S['no'] and 'arp' in st and not self.avoided(t):
                for p in st['arp']:
                    if p[0] != pos: continue
                    lo, hi = PITCHED[S['arp']][1]; lo = max(lo, 72) if under else lo
                    tones = self._voicing(root, iv, lo, hi + 12, n=4)
                    m = tones[p[2] % len(tones)]
                    self._note(S['arp'], m, t, ROLE_G['arp'] * E * p[1] * (UNDER['arp'] if under else 1), p[3] * self.beat * 2, .25)
        # nốt bass mở cảnh khi cảnh bắt đầu giữa ô nhịp (phách 1 của ô đã qua): cảnh mới nghe ra ngay từ đầu
        if S['bass'] and 'bass' not in S['no'] and 'bass' in st and S['style'] != 'break' and not lowv(t0):
            spb4 = st.get('meter', 4) * 4; s_first = int(np.ceil(t0 / q - 1e-6))
            if not any(p[0] % spb4 == s_first % spb4 for p in st['bass']):
                (root, _), _ = self._chord_at(S, t0); lo, hi = PITCHED[S['bass']][1]
                self._note(S['bass'], place(root, lo, hi), s_first * q, ROLE_G['bass'] * E * .9, self.beat * .9, 0)
        # dấu đổi cảnh
        if prev is not None and S['cue']: self._cue(prev, S)
        # câu đáp trong khoảng trống
        if S['lead'] and S['fills'] and 'lead' not in S['no']:
            for a, b in self.gaps(t0, t1): self._fill(S, a, b, swing)

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
        """Phách cuối trước cảnh mới: trống dồn (mạnh lên) hoặc chuỗi nốt đi xuống (nhẹ đi); phách đầu: kick + chũm chọe."""
        tb = S['t0']; up = S['energy'] >= prev['energy']; q = self.beat / 4; under = self.speaking(tb - .2)
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

    def _fill(self, S, a, b, swing):
        """Câu đáp của nhạc cụ hát chính trong khoảng không lời [a, b)."""
        lead = S['lead']; lo, hi = PITCHED[lead][1]
        step = self.beat / 2 if b - a >= .9 else self.beat / 4             # khoảng ngắn: "đáp" nhanh bằng móc kép
        ta = np.ceil((a + .04) / step) * step; tb = b - .12
        n = int((tb - ta) / step) + 1
        if n < 2: return
        if step < self.beat / 2: swing = False; n = min(n, 3)
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
        self.last_lead = ns[-1]; self.fills += 1

    # ---------- báo cáo ----------
    def save(self, path):
        keep = ('name', 't0', 't1', 'style', 'key', 'chords', 'bass', 'comp', 'lead', 'arp', 'kit', 'energy', 'hand')
        json.dump({'sections': [{k: S[k] for k in keep} for S in self.S], 'fills': self.fills, 'answers': sorted(self.answers), 'notes': self.notes},
                  open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
