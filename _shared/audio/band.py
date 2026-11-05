"""Dàn nhạc tổng hợp của kênh Big Secrets of Tiny Bugs + nhạc hiệu 2 giây.
Dùng chung cho mọi tập để nhạc cụ và nhạc hiệu giống hệt nhau (kế hoạch §1.3, §2.6; quy hoạch §5.6).

    import sys, os; sys.path.insert(0, os.path.join(LIB, '_shared', 'audio')); sys.path.insert(0, os.path.join(LIB, 'core', 'audio'))
    from band import *            # pluck, marimba, bassn, buzzbass, kick, clap, hat, shaker, bell, horn, pad, chirp, riser, glide, jingle
    add(mus, jingle(), at(2))     # nhạc hiệu: đúng 1 ô nhịp ở 120 BPM (2,0 s), đuôi ngân thêm ~0,6 s

Không dùng mẫu âm thanh của bên thứ ba: mọi nốt được tổng hợp bằng numpy/scipy và các hàm của core/audio/sfx.py.
Nguồn gốc: các nhạc cụ chuyển từ mix.py của pilot (films/bi-mat-ti-hon), giữ nguyên âm sắc.
"""
import os, sys
import numpy as np
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, add   # noqa: E402

mf = lambda m: 440 * 2 ** ((m - 69) / 12)
BPM = 120; BEAT = 60 / BPM; BAR = 4 * BEAT


def fade(x, a=.004, r=.03):
    x = x.copy(); n1, n2 = min(len(x), max(1, int(a * SR))), min(len(x), max(1, int(r * SR)))   # nốt ngắn hơn đoạn fade vẫn chạy
    x[:n1] *= np.linspace(0, 1, n1); x[len(x) - n2:] *= np.linspace(1, 0, n2); return x


# ---------- nhạc cụ ----------
def pluck(m, d=.7, v=1.):                       # ukulele: hoà âm tắt dần + tiếng móng gảy
    f = mf(m); tt = t_(d)
    x = sum(np.sin(2 * np.pi * f * k * tt + k) * np.exp(-tt * (2.5 + k * 2.0)) / k for k in range(1, 8))
    return fade(x + hp(noise(d), 1500) * env_exp(d, .003) * .3) * v * .35
def marimba(m, d=.6, v=1.):
    f = mf(m); tt = t_(d)
    x = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 5) + .35 * np.sin(2 * np.pi * 3.93 * f * tt) * np.exp(-tt * 20) + .12 * np.sin(2 * np.pi * 9.2 * f * tt) * np.exp(-tt * 45)
    return fade(x, .002) * v * .45
def bassn(m, d=.45, v=1.):                      # bass gảy, có hoà âm 2–3 để nghe được trên loa nhỏ
    f = mf(m); tt = t_(d)
    return fade((np.sin(2 * np.pi * f * tt) + .45 * np.sin(4 * np.pi * f * tt) + .25 * np.sin(6 * np.pi * f * tt)) * np.exp(-tt * 4), .006, .05) * v * .5
def buzzbass(m, d=.45, v=1.):                   # tiếng ong vo ve làm bè trầm
    f = mf(m); tt = t_(d); ph = np.cumsum(f * (1 + .012 * np.sin(2 * np.pi * 7 * tt))) / SR
    return fade(lp(2 * (ph % 1) - 1, 1100) * (.8 + .2 * np.sin(2 * np.pi * 31 * tt)) * np.exp(-tt * 2.5), .01, .06) * v * .36
def kick(v=1.):
    d = .32; tt = t_(d); f = 48 + 110 * np.exp(-tt * 28)
    return np.tanh(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 8) * 1.6) * v * .8
def clap(v=1.):
    x = np.zeros(int(.25 * SR))
    for k, dt in enumerate((0, .011, .022)):
        s = int(dt * SR); b = bp(noise(.2), 900, 3200) * env_exp(.2, .012 if k < 2 else .05); x[s:s + len(b)] += b
    return norm(x) * v * .45
def hat(v=1.): return hp(noise(.06), 7000) * env_exp(.06, .01) * v * .25
def shaker(v=1.): d = .09; return bp(noise(d), 3500, 9000) * np.sin(np.pi * t_(d) / d) ** 2 * v * .2
def bell(m, v=1., d=1.4):
    f = mf(m); tt = t_(d)
    return fade(sum(a * np.sin(2 * np.pi * f * r * tt) * np.exp(-tt * k) for r, a, k in ((1, 1, 2.2), (2.76, .4, 5), (5.4, .2, 9))), .002, .1) * v * .3
def horn(m, d=.4, v=1.):                        # kèn đồ chơi
    f = mf(m); tt = t_(d); ph = 2 * np.pi * f * tt + .15 * np.sin(2 * np.pi * 5.5 * tt) * (tt > .12)
    return fade(lp(sum(np.sin(ph * k) / k for k in (1, 3, 5, 7)), 2600) * np.minimum(1, tt / .02) * np.exp(-tt * 1.5), .005, .06) * v * .32
def pad(ms, d, v=1.):
    tt = t_(d); x = sum(np.sin(2 * np.pi * mf(m) * tt) + .3 * np.sin(4 * np.pi * mf(m) * tt) for m in ms)
    return lp(x, 2000) * np.minimum(1, tt / .4) * np.minimum(1, (d - tt) / .5) * v * .07
def chirp(v=1.):                                # tiếng dế: ba xung 4,6 kHz
    x = np.zeros(int(.12 * SR)); tt = t_(.022); b = np.sin(2 * np.pi * 4600 * tt) * np.sin(np.pi * tt / .022) ** 2
    for k in range(3): s = int(k * .034 * SR); x[s:s + len(b)] += b
    return x * v * .16
def riser(d=1., v=1.):
    n = noise(d); out = np.zeros_like(n)
    for i in range(0, len(n), 960):
        hi = min(len(n), i + 960); f = 700 + 5000 * (i / len(n)) ** 2; out[i:hi] = bp(n[max(0, i - 2000):hi], f * .8, f * 1.2)[-(hi - i):]
    return out * (t_(d) / d) ** 2 * v * .3
def glide(f0, f1, d, v=1., vib=0.):             # còi trượt / lò xo
    tt = t_(d); f = f0 * (f1 / f0) ** (tt / d) * (1 + vib * np.sin(2 * np.pi * 9 * tt))
    return fade(np.sin(2 * np.pi * np.cumsum(f) / SR), .005, .05) * v


# ---------- nhạc hiệu: "BIG SE-CRETS · of ti-ny bugs!" ----------
# Một ô nhịp 120 BPM. Phách 1–2: kèn đồ chơi C–E–G ("BIG SE-CRETS"), to và tròn.
# Phách 3: bốn nốt marimba rất cao, rất nhỏ ("of ti-ny bugs", chữ tí hon của tựa), lên dần.
# Phách 4: hợp âm C trưởng + chuông + kick, ngân ra khỏi ô nhịp. Nhạc nền của tập phải im trong ô nhịp này.
def jingle(v=1.):
    d = BAR + .7; out = np.zeros((int(d * SR), 2))
    J = lambda x, t, g=1., pan=0.: add(out, x, t, g, pan)
    for b, n, dd in ((0, 72, .3), (.5, 76, .3), (1, 79, .55)):
        J(horn(n, dd + .1), b * BEAT, .95); J(horn(n - 12, dd + .1), b * BEAT, .35)
    J(kick(), 0, 1.0); J(clap(.8), BEAT, .6, .1)
    J(bassn(48, .9), 0, 1.2); J(bassn(43, .4), BEAT * 1.5, 1.0)
    for i, n in enumerate((96, 98, 100, 103)):                    # "of ti-ny bugs": cao, nhỏ, lên dần
        J(marimba(n, .25, .5 + .1 * i), 2 * BEAT + i * BEAT / 4, .55, -.45 + .3 * i)
    J(bell(103, .45, .7), 2 * BEAT + .75 * BEAT, .5, .4)
    t3 = 3 * BEAT
    for k, n in enumerate((60, 64, 67, 72)): J(pluck(n, 1.1), t3 + k * .015, .55, -.3 + .2 * k)
    for n in (72, 76, 79): J(horn(n, .9, .7), t3, .45)
    J(bell(84, .7, 1.2), t3, .6, .2); J(kick(.9), t3, .9); J(bassn(36, .9), t3, 1.1); J(clap(.6), t3, .5, -.1)
    return out * v


# ---------- tiếng của các nhân vật không lời (giống nhau mọi tập) ----------
def mmm(v=1.):
    """Flutter ngân "Mmm!": một hơi liền, miệng khép (âm mũi), cao độ trẻ con vút lên rồi hạ ("mmMMm!"). ~0,6 s.
    (Bản hai nhịp "mm-MM!" bị Whisper nghe thành "bye-bye", nên dùng một hơi.)"""
    d = .6; tt = t_(d)
    f0 = np.interp(tt, [0, .18, .36, d], [500, 640, 780, 620]) * (1 + .015 * np.sin(2 * np.pi * 6.5 * tt))
    ph = 2 * np.pi * np.cumsum(f0) / SR
    src = sum(np.sin(ph * k) / k ** 1.6 for k in range(1, 7))
    nasal = lp(src, 1000) + .7 * bp(src, 230, 420)
    e = np.clip(np.minimum(tt / .06, (d - tt) / .16), 0, 1) * (.75 + .25 * np.sin(np.pi * tt / d))
    return fade(norm(nasal) * e, .004, .05) * v * .5
