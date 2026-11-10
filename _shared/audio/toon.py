"""Bảng tiếng động hoạt hình của kênh Big Secrets of Tiny Bugs: swipe, swish, zip, còi trượt, boing, bong bóng, sparkle,
gliss, ding, tink, plip, splat, cymbal, swell, giấy, ong vo ve… và một phòng vang nhỏ cho đuôi tiếng chuyển cảnh.
Dùng chung cho mọi tập, để tiếng chuyển cảnh và tiếng nhân vật giống nhau giữa các tập.

    sys.path.insert(0, os.path.join(LIB, '_shared', 'audio')); from toon import *

Mỗi hàm trả mono float @ 48 kHz, đã có fade đầu/cuối, đỉnh ≈ v. Mọi tiếng có tham số (cao độ, hướng, độ dài, seed),
để các lần chuyển cảnh trong một tập không lặp lại y hệt nhau. Tổng hợp bằng numpy/scipy, không dùng mẫu của bên thứ ba.
"""
import os, sys
import numpy as np
from scipy.signal import fftconvolve
_HERE = os.path.dirname(os.path.abspath(__file__))
_LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(_HERE, '..', '..'))
for p in (os.path.join(_LIB, 'core', 'audio'), _HERE):
    if p not in sys.path: sys.path.insert(0, p)
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm   # noqa: E402
from band import fade, mf                                  # noqa: E402

PENT = (0, 2, 4, 7, 9)                                     # ngũ cung trưởng: mọi chuỗi nốt đều hợp với nhạc nền C–G–Am–F


def _env(d, peak=.5, a=2., r=2.):
    """Đường bao một đỉnh: lên theo mũ a tới `peak` (0..1 của d), xuống theo mũ r."""
    u = t_(d) / d
    return np.where(u < peak, (u / peak) ** a, ((1 - u) / (1 - peak)) ** r)


def _sweep(x, f0, f1, q=.3, curve=lambda u: u, block=480):
    """Lọc dải trượt theo thời gian (f đi từ f0 đến f1 theo thang log)."""
    out = np.zeros_like(x); n = len(x)
    for i in range(0, n, block):
        hi = min(n, i + block); f = f0 * (f1 / f0) ** curve(i / n)
        out[i:hi] = bp(x[max(0, i - 2000):hi], f * (1 - q), min(f * (1 + q), SR * .45))[-(hi - i):]
    return out


def _ting(f, d=.6, v=1.):
    """Phím glockenspiel: hai bội âm không hoà, đánh nhanh, ngân."""
    tt = t_(d)
    x = np.sin(2 * np.pi * f * tt) * np.exp(-tt / (d * .3)) + .35 * np.sin(2 * np.pi * 2.76 * f * tt) * np.exp(-tt / (d * .1)) \
        + .12 * np.sin(2 * np.pi * 5.4 * f * tt) * np.exp(-tt / (d * .05))
    return fade(x, .0015, .03) * v


def _harp(f, d=.5, v=1.):
    tt = t_(d)
    x = sum(a * np.sin(2 * np.pi * f * k * tt) * np.exp(-tt * (3 + 3 * k)) for k, a in ((1, 1), (2, .45), (3, .2), (4, .08)))
    return fade(x, .002, .04) * v


def _at(buf, x, t):
    s = int(t * SR); e = min(len(buf), s + len(x)); buf[s:e] += x[:e - s]


def scale(lo, hi):
    """Các nốt MIDI ngũ cung từ lo đến hi."""
    return [m for m in range(lo, hi + 1) if (m - 60) % 12 in PENT]


# ---------- di chuyển: swipe · swish · zip · còi trượt · swirl ----------
def swipe(d=.22, v=1., up=True, lo=1400, hi=7000, peak=None):
    """Quẹt mỏng và nhanh (vật nhỏ bay ngang, sticker bay vào). Nằm trên dải giọng nói nên ít che lời."""
    x = _sweep(noise(d), lo if up else hi, hi if up else lo, .35)
    return fade(norm(x * _env(d, peak or (.6 if up else .35), 1.6, 2.2)), .003, .02) * v


def swish(d=.45, v=1., lo=350, hi=2600, up=True, peak=None, air=.35):
    """Whoosh dày hơn, có hướng: up = tiến lại gần (đỉnh muộn), down = lùi ra xa (đỉnh sớm)."""
    pk = peak or (.68 if up else .32)
    x = _sweep(noise(d), lo if up else hi, hi if up else lo, .4) + lp(noise(d), 500) * air
    return fade(norm(x * _env(d, pk, 1.8, 1.8)), .004, .03) * v


def zip_(d=.18, f0=700, f1=2800, v=1.):
    """Tiếng "zíp": vút một mạch (vật vụt khỏi khung hình)."""
    tt = t_(d); f = f0 * (f1 / f0) ** (tt / d); ph = np.cumsum(f) / SR
    x = .5 * lp(2 * (ph % 1) - 1, 5000) + .5 * np.sin(2 * np.pi * ph) + .3 * bp(noise(d), 2000, 8000)
    return fade(norm(x * _env(d, .45, 1., 1.6)), .003, .02) * v


def whistle(f0, f1, d, v=1., vib=.015, rate=6.5):
    """Còi trượt: lên (nhấc lên, bay lên) hoặc xuống (rơi, hạ xuống)."""
    tt = t_(d); f = f0 * (f1 / f0) ** (tt / d) * (1 + vib * np.sin(2 * np.pi * rate * tt)); ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) + .12 * np.sin(2 * ph) + .02 * hp(noise(d), 3000)
    return fade(x * np.minimum(1, tt / .03) * np.minimum(1, (d - tt) / .06) * .9, .004, .03) * v


def swirl(d=.6, v=1., rate=5., lo=900, hi=3600, rise=True):
    """Gió xoáy phép thuật: dải lọc đảo lên xuống theo vòng (kính xoáy mở ra)."""
    x = _sweep(noise(d), lo, hi, .3, curve=lambda u: .5 + .5 * np.sin(2 * np.pi * rate * u * d - np.pi / 2))
    return fade(norm(x * (_env(d, .8, 2.2, 1.2) if rise else _env(d, .25, 1.2, 2.))), .004, .03) * v


# ---------- nảy, bật: boing · wobble · bong bóng · plip · splat ----------
def boing(f0=150, d=.55, v=1., rise=2.2, rate=14., depth=.25):
    """Lò xo hoạt hình: cao độ vọt lên rồi rung tắt dần."""
    tt = t_(d)
    f = f0 * (1 + (rise - 1) * (1 - np.exp(-tt / .06))) * (1 + depth * np.exp(-tt / .2) * np.sin(2 * np.pi * rate * tt))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = sum(np.sin(k * ph) / k ** 1.2 for k in range(1, 9))
    x = bp(x, 300, 3200) + .3 * lp(x, 600)
    return fade(norm(x * np.minimum(1, tt / .005) * np.exp(-tt / (d * .4))), .002, .04) * v


def wobble(f0=120, d=.7, v=1., rate=7., depth=.18):
    """Lò xo trầm, rung chậm: chữ hoặc bông hoa còn lắc sau cú va."""
    return boing(f0, d, v, rise=1.25, rate=rate, depth=depth)


def bubble(f=700, v=1., d=.07, up=2.4):
    """Bong bóng vỡ "blíp": vút lên rất nhanh."""
    tt = t_(d); fr = f * (1 + (up - 1) * (tt / d) ** .7)
    x = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-tt / (d * .35))
    x[:int(.004 * SR)] += hp(noise(.004), 3000) * .3
    return fade(norm(x), .001, .01) * v


def pops(n=6, step=.035, m0=79, v=1., up=True):
    """Chuỗi bong bóng nối nhau, cao dần (chữ hiện từng ký tự)."""
    ms = scale(m0, m0 + 24)[:n]
    if not up: ms = ms[::-1]
    x = np.zeros(int((n * step + .12) * SR))
    for i, m in enumerate(ms): _at(x, bubble(mf(m) * .6, .55 + .45 * i / max(1, n - 1)), i * step)
    return norm(x) * v


def plip(f=1100, v=1.):
    """Giọt nước nhỏ rơi."""
    d = .06; tt = t_(d); fr = f * (1 + 2 * (1 - np.exp(-tt / .012)))
    return fade(np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-tt / .018), .001, .01) * v


def splat(v=1., seed=0):
    """Bẹp! Vật mềm và ướt bị dẫm: thân ướt, đáy trầm, vài giọt bắn."""
    r = np.random.default_rng(seed); d = .42; tt = t_(d)
    x = lp(noise(d), 1800) * env_exp(d, .035) + np.sin(2 * np.pi * 80 * tt * (1 - .4 * tt)) * env_exp(d, .06) * .8 \
        + bp(noise(d), 300, 1200) * env_exp(d, .08) * .5
    for k in range(3): _at(x, plip(r.uniform(900, 1700), .35), r.uniform(.07, .3))
    return fade(norm(x), .001, .04) * v


# ---------- lấp lánh, phát hiện: sparkle · gliss · ding · tink · swell ----------
def sparkle(d=.7, v=1., lo=86, hi=103, n=8, seed=0, order=None):
    """Lấp lánh phép thuật: những phím glock cao rải ngẫu nhiên + lớp sáng ở dải rất cao.
    order: 'up' / 'down' / None (ngẫu nhiên)."""
    r = np.random.default_rng(seed); ns = scale(lo, hi)
    ts = np.sort(r.uniform(0, d * .75, n)); ts[0] = 0
    ms = sorted(r.choice(ns, n)) if order == 'up' else sorted(r.choice(ns, n), reverse=True) if order == 'down' else r.choice(ns, n)
    x = np.zeros(int((d + .6) * SR))
    for i, (t, m) in enumerate(zip(ts, ms)): _at(x, _ting(mf(m), .55, 1 - .5 * i / n), t)
    sh = hp(noise(len(x) / SR), 7000) * _env(len(x) / SR, .15, 1.5, 2.5) * .25
    return fade(norm(x + sh[:len(x)]), .002, .05) * v


def gliss(m0=72, m1=96, d=.4, v=1., inst='harp', accel=1.3):
    """Gliss ngũ cung (đàn hạc hoặc glock) đi lên hoặc đi xuống trong d giây."""
    ns = scale(min(m0, m1), max(m0, m1))
    if m1 < m0: ns = ns[::-1]
    k = len(ns); x = np.zeros(int((d + .6) * SR)); f = _harp if inst == 'harp' else _ting
    for i, m in enumerate(ns): _at(x, f(mf(m), .5, .6 + .4 * i / k), d * (i / k) ** accel)
    return fade(norm(x), .002, .05) * v


def ding(m=88, v=1., d=1.1):
    """Ding sáng (huy hiệu, ý đúng)."""
    x = _ting(mf(m), d); b = _ting(mf(m + 12), d * .6); x[:len(b)] += .5 * b
    x[:int(.003 * SR)] += hp(noise(.003), 4000) * .2
    return fade(norm(x), .001, .05) * v


def tink(v=1., f=3800):
    """Chạm thuỷ tinh rất nhẹ (kính lúp, chân côn trùng đậu lên mặt kính)."""
    d = .14; tt = t_(d)
    x = sum(a * np.sin(2 * np.pi * f * k * tt + k) * np.exp(-tt / tau) for k, a, tau in ((1, 1, .045), (2.41, .5, .025), (3.93, .25, .012)))
    return fade(norm(x), .0008, .02) * v


def swell(d=.5, v=1., m0=76, m1=100, seed=0):
    """Dâng phép thuật kết thúc đúng điểm cắt: lớp sáng tăng dần + gliss glock đi lên; cắt gọn ở d để chạm phách sau."""
    tt = t_(d); u = tt / d
    air = hp(noise(d), 2500) * u ** 3
    g = gliss(m0, m1, d * .9, 1., 'ting', 1.6)[:len(tt)]
    g = np.pad(g, (0, len(tt) - len(g)))
    x = norm(air) * .6 + norm(g) * .55 * (.3 + .7 * u)
    x[-int(.004 * SR):] *= np.linspace(1, 0, int(.004 * SR))
    return x * v


def cymbal(d=1.6, v=1., bright=4500):
    """Chũm chọe mềm cho phách đầu cảnh mới (không chói: lọc thấp ở 12 kHz)."""
    tt = t_(d); x = hp(noise(d), bright) * env_exp(d, d * .22) + bp(noise(d), 3000, 9000) * env_exp(d, .08) * .6
    return fade(norm(lp(x, 12000)), .002, .1) * v


def revcymbal(d=.6, v=1.):
    """Chũm chọe ngược: dâng lên rồi cắt gọn, dẫn vào một cú chạm."""
    x = cymbal(d + .3, 1.)[::-1][-int(d * SR):]
    x[-int(.004 * SR):] *= np.linspace(1, 0, int(.004 * SR))
    return norm(x) * v


# ---------- chất liệu: giấy · ong vo ve · gõ ----------
def paper(d=.3, v=1., n=5, seed=0):
    """Giấy sột soạt (trang sổ, sticker tách khỏi tờ)."""
    r = np.random.default_rng(seed); x = bp(noise(d), 1500, 6000) * _env(d, .3, 1., 2.) * .3
    for k in range(n):
        s = r.uniform(0, d * .8); b = bp(noise(.03), 2500, 9000) * env_exp(.03, .006) * r.uniform(.5, 1.); _at(x, b, s)
    return fade(norm(x), .002, .03) * v


def buzzup(d=.7, v=1., f0=170, f1=420):
    """Ong vo ve bay vụt lên."""
    tt = t_(d); f = f0 * (f1 / f0) ** (tt / d) * (1 + .02 * np.sin(2 * np.pi * 9 * tt)); ph = np.cumsum(f) / SR
    x = lp(2 * (ph % 1) - 1, 2200) * (.75 + .25 * np.sin(2 * np.pi * 33 * tt))
    return fade(norm(x * _env(d, .7, 1.5, 1.5)), .005, .04) * v


def block(m=79, v=1.):
    """Mõ gỗ nhỏ (tích tắc khi nhân vật đang nghĩ)."""
    d = .09; tt = t_(d); f = mf(m)
    x = np.sin(2 * np.pi * f * tt) * np.exp(-tt / .018) + .4 * np.sin(2 * np.pi * 2.6 * f * tt) * np.exp(-tt / .008)
    return fade(norm(x), .0008, .01) * v


def windup(d=.4, v=1., n=9, m0=84):
    """Lên dây cót "tách-tách-tách" nhanh dần, cao dần (lấy đà trước cú nhảy, cú giẫm). Tiếng ngắn nên ít che lời."""
    x = np.zeros(int((d + .1) * SR))
    for k in range(n): _at(x, block(m0 + 2 * k, .5 + .5 * k / n), d * (k / n) ** .8)
    return norm(x) * v


def blip(m=84, v=1., d=.09):
    """Chấm thoại "…": nốt sin tròn, ngắn."""
    tt = t_(d); f = mf(m) * (1 + .06 * (tt / d))
    return fade(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / d) ** 1.5, .002, .01) * v


# ---------- nhường giọng theo dải ----------
def duck(x, ve, mid=.8, rest=.5, lo=300, hi=4000, thr=.25):
    """Nhạc / tiếng động nhường giọng: dải mang chữ (lo–hi Hz) giảm mạnh (mid), phần còn lại (bass, kick, lớp lấp lánh)
    giảm nhẹ (rest), nên nhạc vẫn còn nhịp mà lời không bị che. x: (n, 2); ve: đường bao giọng (n,), đầy ở `thr`."""
    g = np.clip(ve[:len(x)] / thr, 0, 1)[:, None]
    m = np.stack([bp(x[:, c], lo, hi) for c in range(x.shape[1])], 1)
    return (x - m) * (1 - rest * g) + m * (1 - mid * g)


# ---------- đo độ to và chặn đỉnh thật ----------
def lufs(x):
    """Độ to tích hợp theo ITU-R BS.1770 (K-weighting, khối 400 ms chồng 75 %, cổng −70 LUFS và −10 LU). x: (n, 2) @ 48 kHz."""
    from scipy.signal import lfilter
    x = x if x.ndim > 1 else x[:, None]
    y = lfilter([1.53512485958697, -2.69169618940638, 1.19839281085285], [1, -1.69065929318241, .73248077421585], x, axis=0)
    y = lfilter([1., -2., 1.], [1, -1.99004745483398, .99007225036621], y, axis=0)
    w, h = int(.4 * SR), int(.1 * SR)
    z = np.array([np.mean(y[i:i + w] ** 2, 0).sum() for i in range(0, len(y) - w + 1, h)])
    L = -.691 + 10 * np.log10(np.maximum(z, 1e-12)); z = z[L > -70]
    rel = -.691 + 10 * np.log10(z.mean()) - 10; z = z[-.691 + 10 * np.log10(z) > rel]
    return float(-.691 + 10 * np.log10(z.mean()))


def tplimit(x, ceil=.5, look=.005):
    """Limiter đỉnh thật, hai kênh liên kết: đo đỉnh trên tín hiệu lấy mẫu gấp 4 (bắt cả đỉnh nằm giữa hai mẫu), giảm gain trước đỉnh."""
    from scipy.signal import resample_poly
    from scipy.ndimage import maximum_filter1d, uniform_filter1d
    up = np.abs(resample_poly(x, 4, 1, axis=0)); up = up.max(1) if up.ndim > 1 else up
    pk = np.pad(up, (0, max(0, 4 * len(x) - len(up))))[:4 * len(x)].reshape(-1, 4).max(1)
    n = int(look * SR); g = np.minimum(1, ceil / np.maximum(maximum_filter1d(pk, 2 * n + 1), 1e-9)); g = uniform_filter1d(g, n)
    g = np.minimum(g, uniform_filter1d(g, n))
    return x * (g[:, None] if x.ndim > 1 else g)


def master(mix, crest=12.3):
    """Khâu cuối: chặn đỉnh thật ở (độ to + crest) dB, để loudnorm của core/render/mux.sh (−14 LUFS, TP −1,2) nâng tuyến tính,
    không phải chuyển sang chế độ động (đỉnh − độ to ≤ 12,8 dB). Trả (mix, độ to LUFS, trần dBFS)."""
    I = lufs(mix); ceil = min(.9, 10 ** ((I + crest) / 20))
    for _ in range(3):
        out = tplimit(mix, ceil)
        from scipy.signal import resample_poly
        tp = np.abs(resample_poly(out, 4, 1, axis=0)).max()
        if tp <= ceil * 1.02: break
        ceil *= ceil / tp
    return out, I, 20 * np.log10(ceil)


# ---------- phòng vang cho đuôi tiếng ----------
def room(d=1.1, seed=1, tone=5000):
    """Đáp ứng xung của một phòng vang nhỏ, sáng (dùng cho đường gửi vang của tiếng chuyển cảnh)."""
    r = np.random.default_rng(seed); tt = t_(d)
    ir = lp(r.standard_normal(len(tt)), tone) * np.exp(-tt / (d / 5.5)); ir[:int(.012 * SR)] = 0
    return ir / np.sqrt(np.sum(ir ** 2))


def verb(send, d=1.1, tone=5000):
    """Đường vang stereo từ một bus gửi mono: hai đáp ứng xung khác nhau cho trái/phải."""
    L = fftconvolve(send, room(d, 1, tone))[:len(send)]; R = fftconvolve(send, room(d, 2, tone))[:len(send)]
    return np.stack([L, R], 1)


# ---------- tiếng động của lượt "Sound Design Plan" (11/2026): va chạm nhẹ · bước chân · chạy · cười · ngạc nhiên · reo vui ----------
def bonk(v=1., m=76):
    """Cú va hoạt hình nhẹ "bonk": gõ gỗ rỗng + cao độ rơi nhanh + ngân ngắn (đụng đầu, va kính). Không đau, không gắt."""
    d = .35; tt = t_(d); f = mf(m) * (1 + 1.2 * np.exp(-tt / .012)) * (1 - .25 * np.minimum(1, tt / .2))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / .06) + bp(noise(d), 600, 2500) * env_exp(d, .006) * .7 \
        + np.sin(2 * np.pi * mf(m + 19) * tt) * np.exp(-tt / .09) * .15
    return fade(norm(x), .0008, .04) * v


def footsteps(n=6, step=.16, v=1., m=88, seed=0, soft=False):
    """Bước chân tí hon "típ-táp": mỗi bước một tiếng gõ nhỏ, xen hai cao độ, kèm chút sột soạt; soft: rón rén (nhỏ hơn, mềm hơn)."""
    r = np.random.default_rng(seed); x = np.zeros(int((n * step + .2) * SR))
    for k in range(n):
        tap = block(m + (0 if k % 2 == 0 else -5) + int(r.integers(-1, 2)), .5 if soft else .8) * .6
        tap[:int(.04 * SR)] += bp(noise(.04), 2500, 7000) * env_exp(.04, .006) * (.2 if soft else .35)
        _at(x, tap, max(0., k * step + r.uniform(-.008, .008)))
    return norm(x) * v * (.6 if soft else 1.)


def scurry(d=.6, v=1., m=91, seed=0):
    """Chạy lon ton: bước chân dồn nhanh dần + một luồng gió ngắn theo hướng chạy."""
    n = max(4, int(d / .07)); r = np.random.default_rng(seed); x = np.zeros(int((d + .2) * SR))
    for k in range(n): _at(x, block(m + (0 if k % 2 else -4), .45 + .4 * k / n) * .5, max(0., d * (k / n) ** .85 + r.uniform(-.004, .004)))
    w = swish(d, .35, 700, 3200, True); x[:len(w)] += w * .5
    return norm(x) * v


def giggle(n=4, v=1., m=84, step=.105, seed=0):
    """Cười khúc khích "hi-hi-hi-hi": những tiếng ngắn có nguyên âm "i" (F1 ≈ 300 Hz, F2 ≈ 2,4 kHz), đi xuống dần (nhân vật không lời)."""
    r = np.random.default_rng(seed); x = np.zeros(int((n * step + .25) * SR))
    for k in range(n):
        d = .075 + .02 * (k == n - 1); tt = t_(d); f0 = mf(m - 1.5 * k + r.uniform(-.3, .3)) * (1 + .05 * np.sin(np.pi * tt / d))
        ph = 2 * np.pi * np.cumsum(f0) / SR; src = sum(np.sin(j * ph) / j for j in range(1, 12))
        y = bp(src, 250, 420) * .7 + bp(src, 2100, 2800) + bp(noise(d), 2500, 6000) * .08
        _at(x, fade(y * np.sin(np.pi * tt / d) ** .8, .003, .01), k * step * (1 - .06 * k))
    return norm(x) * v


def surprise(v=1.):
    """Ngạc nhiên "ồ!": còi trượt vút lên + boing nhỏ + một ting sáng (mắt tròn xoe)."""
    x = np.zeros(int(.7 * SR)); _at(x, whistle(520, 1500, .22, 1., .02) * .7, 0); _at(x, boing(260, .3, .45, 2.4, 16.), .08)
    _at(x, _ting(mf(96), .4, .35), .2)
    return norm(x) * v


def cheer(d=.9, v=1., seed=0):
    """Reo vui "yay!": kèn giấy thổi vút lên (party horn) + pháo giấy lấp lánh + vỗ tay lấm tấm (không có giọng người)."""
    r = np.random.default_rng(seed); x = np.zeros(int((d + .6) * SR))
    hd = min(.45, d * .5); tt = t_(hd); f = 620 * (1.5 ** np.minimum(1, tt / (hd * .6))); ph = np.cumsum(f) / SR
    buzz = np.tanh(3 * (2 * (ph % 1) - 1)); hornx = bp(buzz, 500, 1000) + .7 * bp(buzz, 1200, 2200)
    _at(x, fade(hornx * np.minimum(1, tt / .02) * np.minimum(1, (hd - tt) / .05), .004, .03) * .45, 0)
    _at(x, sparkle(d * .8, .6, 88, 105, 10, seed, 'up'), .12)
    for k in range(int(d * 14)):
        c = bp(noise(.03), 1000, 3500) * env_exp(.03, .006) * r.uniform(.25, .6); _at(x, c, .1 + r.uniform(0, d * .85))
    return fade(norm(x), .002, .05) * v
