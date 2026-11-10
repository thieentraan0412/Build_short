"""Chống trùng nhạc nền giữa các Short của kênh (QUALITY.md §4, lượt 11/2026 thứ hai).

    from channel import write_plan, check
    write_plan(FILM, MJ, DUR)        # soundplan.py: ghi <tập>/music-plan.json (bản rút gọn của out/music.json, được commit)
    R = check(FILM, MS, DUR)         # soundplan.py và qa.py: so với music-plan.json của mọi Short khác trong films/

Ba quy tắc:
1. **Điệu riêng của tập** (`SIGNATURE` trong groove.py): mỗi Short có ≥ 1 điệu riêng chiếm ≥ 20 % thời lượng, và không dùng
   điệu riêng của tập khác (tính cả đoạn viết tay ghi bằng G.mark).
2. **Không trùng cảnh nhạc của Short khác**: không cảnh nào cùng công thức (điệu, nhạc cụ hát chính, đệm, bộ gõ) với một cảnh
   của Short khác; một cặp điệu + nhạc cụ hát chính đã có ở ≥ 3 Short khác là quá quen. Không tính khựng, nhạc hiệu, cảnh viết tay.
3. **Vui nhộn**: hồi hộp + khựng ≤ 20 % thời lượng; cảnh nhạc ở giọng thứ ≤ 20 % thời lượng (tính cả đoạn viết tay).

Tiếng "chụp" (marimba chạy lên + đàn hạc vuốt) và nhạc hiệu là tiếng của kênh, cố ý giống nhau ở mọi tập; chúng là G.mark
('break', 'jingle') nên không bị so.
"""
import os, json, glob
from groove import SIGNATURE

PAUSE = ('break', 'jingle')
KEEP = ('name', 't0', 't1', 'style', 'key', 'chords', 'bass', 'comp', 'lead', 'arp', 'kit', 'energy', 'hand', 'bpm', 'mood',
        'arc', 'reprise')
SIG_MIN, SUS_MAX, MINOR_MAX, PAIR_MAX = .2, .2, .2, 3


def lead_of(s): return s.get('lead') or s.get('arp') or s.get('comp')
def recipe(s): return (s['style'], lead_of(s), s.get('comp') or s.get('arp'), s.get('kit') or 'none')
def body(MS): return [s for s in MS if s['style'] not in PAUSE and not s.get('hand')]
def length(s): return s['t1'] - s['t0']
def suspense(s): return s.get('mood') == 'suspense' or (s['style'] == 'break' and s.get('mood') in (None, 'suspense'))


def write_plan(film, MJ, dur):
    """<tập>/music-plan.json: bảng cảnh nhạc rút gọn để các tập khác so (out/ không được commit)."""
    P = {'film': os.path.basename(os.path.abspath(film)), 'color': MJ.get('color'), 'dur': dur,
         'sections': [{k: s.get(k) for k in KEEP} for s in sorted(MJ['sections'], key=lambda s: s['t0'])]}
    path = os.path.join(film, 'music-plan.json')
    json.dump(P, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    return path


def others(film):
    """music-plan.json của mọi Short khác cùng thư mục films/."""
    film = os.path.abspath(film); name = os.path.basename(film); out = {}
    for p in sorted(glob.glob(os.path.join(os.path.dirname(film), 'short-*', 'music-plan.json'))):
        n = os.path.basename(os.path.dirname(p))
        if n != name: out[n] = json.load(open(p, encoding='utf-8'))
    return out


def check(film, MS, dur):
    name = os.path.basename(os.path.abspath(film)); O = others(film); mine = body(MS)
    dups = []                                                          # (cảnh của tập này, tập khác, cảnh của tập khác)
    for s in mine:
        for n, P in O.items():
            dups += [(s, n, o) for o in body(P['sections']) if recipe(o) == recipe(s)]
    pairs = {}                                                         # (điệu, nhạc cụ hát chính) → các Short khác đã dùng
    for s in mine:
        k = (s['style'], lead_of(s))
        pairs[k] = sorted({n for n, P in O.items() for o in body(P['sections']) if (o['style'], lead_of(o)) == k})
    common = {k: v for k, v in pairs.items() if len(v) >= PAIR_MAX}
    own = sorted({st for st, ep in SIGNATURE.items() if ep == name})
    styled = [s for s in MS if s['style'] not in PAUSE]                # điệu riêng: tính cả đoạn viết tay có ghi điệu (G.mark)
    sig_t = sum(length(s) for s in styled if s['style'] in own)
    foreign = [(s, SIGNATURE[s['style']]) for s in styled if SIGNATURE.get(s['style'], name) != name]
    sus = sum(length(s) for s in MS if suspense(s))
    minor = sum(length(s) for s in styled if (s.get('key') or '').endswith('m'))   # cả đoạn viết tay: trẻ nghe cả hai
    D = max(dur, 1e-6)
    return {'compared': sorted(O), 'dups': dups, 'pairs': pairs, 'common': common, 'own': own, 'sig_share': sig_t / D,
            'foreign': foreign, 'sus_share': sus / D, 'minor_share': minor / D,
            'sig_ok': bool(own) and sig_t / D >= SIG_MIN and not foreign, 'dup_ok': not dups and not common,
            'cheer_ok': sus / D <= SUS_MAX and minor / D <= MINOR_MAX}
