"""Âm thanh môi trường theo bối cảnh (Lớp 4 – Ambient của thiết kế âm thanh theo cảnh, Task.md 18/11/2026, _shared/QUALITY.md §10).
Gom và chuẩn hoá các hàm nền từng viết riêng trong films/long-002, long-003, short-013 (gió, dế, chim, phòng).

    import ambience as AMB
    amb = AMB.beds(DUR, [(0, 3.8, 'snow_garden'), (3.8, 12.4, 'hive_warm'), …], speaking=speaking, seed=16)   # stereo (N, 2)

Mỗi lớp nền là một hàm (d, rng, speaking, t0) → stereo, mức chuẩn RMS ≈ −36 dBFS; beds() nối các cảnh với crossfade 0,3 s.
Chi tiết điểm xuyết (chim, tiếng tuyết, dế) né lời nói (speaking(t)) để không lấn giọng; phần nền liên tục nhường giọng ở mix.py (duck).
Không dùng mẫu của bên thứ ba: mọi tiếng tổng hợp bằng numpy/scipy và core/audio/sfx.py.
"""
import os, sys
import numpy as np
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, brown   # noqa: E402

REF = 10 ** (-36 / 20)


def _st(x, pan=0.):
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    return np.stack([x * l * 1.41, x * r * 1.41], 1)


def _norm(x, ref=REF):
    r = np.sqrt(np.mean(x ** 2)) if len(x) else 0
    return x * (ref / r) if r > 1e-9 else x


def _add(buf, x, t, g=1., pan=0.):
    s = int(t * SR)
    if s >= len(buf): return
    y = _st(x * g, pan) if x.ndim == 1 else x * g; k = min(len(y), len(buf) - s)
    if k > 0: buf[s:s + k] += y[:k]


def wind(d, lo=180, hi=700, rate=.23, rng=None, gusts=0.):
    """Gió: nhiễu nâu lọc dải, phập phồng chậm; gusts 0..1 thêm những cơn gió mạnh lên rồi tắt (mỗi 3–6 s)."""
    tt = t_(d); x = bp(brown(d), lo, hi)[:len(tt)] * (.6 + .4 * np.sin(2 * np.pi * rate * tt + 1.))
    if gusts and rng is not None:
        g = np.zeros(len(tt)); t0 = rng.uniform(.5, 2.)
        while t0 < d:
            w = rng.uniform(1.2, 2.2); u = np.clip((tt - t0) / w, 0, 1); g += np.sin(np.pi * u) ** 2 * (u > 0) * (u < 1)
            t0 += rng.uniform(3., 6.)
        x = x * (1 + gusts * 1.6 * g)
    return x


def whistle_wind(d, rng):
    """Gió rít khẽ qua cành trơ (mùa đông): tiếng hú mảnh có cao độ trôi chậm, rất nhỏ."""
    tt = t_(d); f = 620 + 140 * np.sin(2 * np.pi * .07 * tt + rng.uniform(0, 6)) + 60 * np.sin(2 * np.pi * .19 * tt)
    ph = np.cumsum(f) / SR; x = bp(noise(d), 500, 1200)[:len(tt)] * .3 + np.sin(2 * np.pi * ph) * .25
    return x * (.5 + .5 * np.sin(2 * np.pi * .11 * tt + 2.)) ** 2


def chirp_bird(rng, kind='winter'):
    """Một tiếng chim xa: mùa đông 'chick-a-dee' ngắn 2–3 nốt; mùa hè líu lo trượt lên."""
    out = []
    if kind == 'winter':
        for k, (f0, f1, dd) in enumerate([(3800, 3400, .06), (3000, 2900, .08), (3000, 2900, .08)][:int(rng.integers(2, 4))]):
            tt = t_(dd); f = np.linspace(f0, f1, len(tt)); out.append((k * .11, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / dd) ** 2))
    else:
        for k in range(2):
            dd = .08; tt = t_(dd); f0 = rng.uniform(2600, 3300); f = np.linspace(f0, f0 * 1.2, len(tt))
            out.append((k * .12, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / dd) ** 2))
    n = int((max(a for a, _ in out) + .12) * SR); x = np.zeros(n)
    for a, y in out: s = int(a * SR); x[s:s + len(y)] += y[:n - s]
    return x


def cricket(rng):
    x = np.zeros(int(.12 * SR)); bb = np.sin(2 * np.pi * rng.uniform(4300, 4900) * t_(.022)) * np.sin(np.pi * t_(.022) / .022) ** 2
    for j in range(3): s0 = int(j * .035 * SR); x[s0:s0 + len(bb)] += bb
    return lp(x, 6500)


def snow_tick(rng):
    """Bông tuyết chạm cành / lá khô: tiếng 'tích' rất nhỏ, dải cao."""
    d = .03; return bp(noise(d), 4000, 7500)[:int(d * SR)] * env_exp(d, .004)[:int(d * SR)]


def rustle(d, rng):
    """Lá khô xào xạc khẽ."""
    tt = t_(d); return bp(noise(d), 1500, 5000)[:len(tt)] * (.3 + .7 * np.abs(np.sin(2 * np.pi * rng.uniform(1.5, 3) * tt))) ** 3


# ---------- các lớp nền: (d, rng, speaking, t0) → stereo ----------
def snow_garden(d, rng, speaking=lambda t: False, t0=0., g=1.):
    """Vườn tuyết: gió lạnh phập phồng có cơn mạnh, gió rít khẽ, chim mùa đông xa ở chỗ không lời, tiếng tuyết lác đác."""
    base = _norm(wind(d, 160, 900, .17, rng, gusts=.6)) + _norm(whistle_wind(d, rng), REF * .45)
    out = np.stack([base * .95, np.roll(base, int(.013 * SR)) * 1.05], 1)
    t = rng.uniform(.6, 1.6)
    while t < d - .4:
        if not speaking(t0 + t, .25): _add(out, _norm(chirp_bird(rng, 'winter'), REF * 2.2), t, 1., rng.uniform(-.8, .8))
        t += rng.uniform(2.6, 4.2)
    t = rng.uniform(.1, .5)
    while t < d - .05:
        _add(out, _norm(snow_tick(rng), REF * 1.4), t, 1., rng.uniform(-.9, .9)); t += rng.uniform(.35, .9)
    return out * g


def hive_warm(d, rng, speaking=lambda t: False, t0=0., g=1.):
    """Trong tổ ong (nghe qua vách): rì rầm ấm của cả đàn, phập phồng chậm, gió ngoài trời rất xa."""
    tt = t_(d); x = sum(np.sin(2 * np.pi * f * tt + p) for f, p in ((118, 0), (236, 1.3), (354, 2.1), (472, .4))) * (.7 + .3 * np.sin(2 * np.pi * 6.5 * tt))
    x = lp(x * (.8 + .2 * np.sin(2 * np.pi * .3 * tt)), 900) + lp(brown(d), 300)[:len(tt)] * .6
    out = _st(_norm(x), 0.) + _st(_norm(wind(d, 150, 500, .2), REF * .3), .3)
    return out * g


def paper_room(d, rng, speaking=lambda t: False, t0=0., g=1.):
    """Trang sổ / bản đồ: phòng yên tĩnh (tiếng thở của phòng, rất trầm) và giấy sột soạt khẽ hiếm hoi."""
    tt = t_(d); x = lp(brown(d), 220)[:len(tt)]
    out = _st(_norm(x, REF * .7))
    t = rng.uniform(1., 2.)
    while t < d - .3:
        if not speaking(t0 + t, .2): _add(out, _norm(rustle(.25, rng), REF * 1.2), t, 1., rng.uniform(-.6, .6))
        t += rng.uniform(2.5, 4.)
    return out * g


def leaf_snow(d, rng, speaking=lambda t: False, t0=0., g=1.):
    """Sát đống lá dưới tuyết: gió rất khẽ, lá khô xào xạc, tuyết lách tách."""
    out = _st(_norm(wind(d, 200, 700, .25), REF * .6))
    t = rng.uniform(.2, .8)
    while t < d - .3:
        _add(out, _norm(rustle(rng.uniform(.2, .4), rng), REF * 1.1), t, 1., rng.uniform(-.5, .5)); t += rng.uniform(1.2, 2.4)
    t = .1
    while t < d - .05:
        _add(out, _norm(snow_tick(rng), REF * 1.2), t, 1., rng.uniform(-.9, .9)); t += rng.uniform(.4, 1.)
    return out * g


def meadow(d, rng, speaking=lambda t: False, t0=0., g=1.):
    """Bãi cỏ ban ngày: gió nhẹ trong cỏ, chim líu lo xa ở chỗ không lời."""
    out = _st(_norm(wind(d, 180, 700, .23)))
    t = rng.uniform(.7, 1.5)
    while t < d - .5:
        if not speaking(t0 + t, .2): _add(out, _norm(chirp_bird(rng, 'summer'), REF * 2.), t, 1., rng.uniform(-.7, .7))
        t += rng.uniform(1.9, 3.2)
    return out * g


def night(d, rng, speaking=lambda t: False, t0=0., g=1.):
    """Vườn đêm: gió rất nhẹ, dế xa đều đều."""
    out = _st(_norm(wind(d, 180, 700, .23), REF * .7))
    for t in np.arange(0, d - .2, .5): _add(out, _norm(cricket(rng), REF * 1.6), t + rng.uniform(0, .25), 1., rng.uniform(-.8, .8))
    return out * g


def pond(d, rng, speaking=lambda t: False, t0=0., g=1.):
    """Mép ao: nước lăn tăn (nhiễu lọc dải, gợn nhanh), chim xa."""
    tt = t_(d); x = bp(noise(d), 300, 1800)[:len(tt)] * (.5 + .5 * np.abs(np.sin(2 * np.pi * 3.1 * tt) * np.sin(2 * np.pi * 1.7 * tt)))
    return _st(_norm(x)) * g + meadow(d, rng, speaking, t0, .4)


BEDS = {'snow_garden': snow_garden, 'hive_warm': hive_warm, 'paper_room': paper_room, 'leaf_snow': leaf_snow,
        'meadow': meadow, 'night': night, 'pond': pond}


def beds(dur, scenes, speaking=lambda t, pad=.2: False, seed=1, xfade=.3):
    """Ghép nền theo cảnh: scenes = [(t0, t1, tên lớp nền[, mức])]. Mỗi cảnh kéo dài thêm xfade hai đầu rồi crossfade (cos²).
    Trả stereo (N, 2) ở mức chuẩn (−36 dBFS RMS / lớp); mix.py chỉnh mức chung và nhường giọng."""
    N = int((dur + .05) * SR); out = np.zeros((N, 2)); rng = np.random.default_rng(seed)
    for sc in scenes:
        a, b, name = sc[:3]; g = sc[3] if len(sc) > 3 else 1.
        a0, b0 = max(0., a - xfade / 2), min(dur, b + xfade / 2); d = b0 - a0
        if d <= .05: continue
        x = BEDS[name](d, rng, speaking, a0, g); n = len(x); tt = np.arange(n) / SR
        e = np.ones(n)
        if a0 > 0: e *= np.clip(tt / xfade, 0, 1) ** .5
        if b0 < dur: e *= np.clip((d - tt) / xfade, 0, 1) ** .5
        _add(out, x * e[:, None], a0)
    return out[:N]
