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


# ---------- nhạc hiệu ngắn 0,8 s (tập A từ 11/2026: logo lồng vào cú lao vào kính, PHAN-TICH-SHORTS/KE-HOACH-NANG-CAP.md §6) ----------
# Cùng câu "BIG SE-CRETS · of ti-ny bugs!" của jingle() nhưng gọn trong 0,8 s: ba nốt kèn đồ chơi đô–mi–sol (0–0,3 s),
# bốn nốt marimba tí hon (0,34–0,5 s), hợp âm + chuông + kick ở 0,55 s ngân ra sau. root: nốt chủ (72 = Đô như jingle(); tập ở giọng khác đổi root).
# jingle() 2 s giữ nguyên cho video dài và các tập cũ. Nhạc nền của tập phải nhường trong 0,8 s này (G.mark('…', t0, t0 + .8, 'jingle', …)).
def sting(v=1., root=72):
    d = .8 + .8; out = np.zeros((int(d * SR), 2))
    J = lambda x, t, g=1., pan=0.: add(out, x, t, g, pan)
    for b, n, dd in ((0, 0, .14), (.11, 4, .14), (.22, 7, .22)):
        J(horn(root + n, dd + .06), b, .95); J(horn(root + n - 12, dd + .06), b, .35)
    J(kick(), 0, .9); J(bassn(root - 24, .3), 0, 1.1); J(clap(.7), .22, .5, .1)
    for i, n in enumerate((24, 26, 28, 31)):                       # "of ti-ny bugs": cao, nhỏ, lên dần
        J(marimba(root + n, .16, .5 + .1 * i), .34 + i * .045, .5, -.45 + .3 * i)
    t3 = .55
    for k, n in enumerate((-12, -8, -5, 0)): J(pluck(root + n, .9), t3 + k * .012, .5, -.3 + .2 * k)
    for n in (0, 4, 7): J(horn(root + n, .5, .7), t3, .42)
    J(bell(root + 12, .6, 1.0), t3, .55, .2); J(kick(.9), t3, .9); J(bassn(root - 36 + 12, .7), t3, 1.1); J(clap(.6), t3, .45, -.1)
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


# ---------- nhạc cụ mở rộng: nhạc nền theo từng cảnh (lượt nhạc nền 11/2026, MUSIC.md của từng tập) ----------
# Mỗi tập chọn một "màu" từ các nhạc cụ này (SHORT-001: dàn dây gảy + sáo + celesta; SHORT-002: trống thép calypso),
# nên các tập không còn chung một kiểu phối. Nhạc cụ cũ ở trên giữ nguyên để bản cũ dựng lại vẫn y hệt.
def pizz(m, d=.4, v=1.):                        # dây gảy pizzicato: bội âm tắt nhanh dần, thân đàn ấm
    f = mf(m); tt = t_(d)
    x = sum(np.sin(2 * np.pi * f * k * tt + .3 * k) * np.exp(-tt * (7 + 4 * k)) / k ** 1.1 for k in range(1, 9) if f * k < 9000)
    return fade(lp(x * np.minimum(1, tt / .0015), min(4000., f * 6)), .001, .03) * v * .42
def xylo(m, d=.35, v=1.):                       # xylophone: gỗ cứng, sáng, ngắn
    f = mf(m); tt = t_(d)
    x = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 9) + .4 * np.sin(2 * np.pi * 3 * f * tt) * np.exp(-tt * 24) + .12 * np.sin(2 * np.pi * 6.1 * f * tt) * np.exp(-tt * 55)
    x = x + hp(noise(d), 2500) * env_exp(d, .0015) * .06
    return fade(x, .001, .02) * v * .36
def flute(m, d=.5, v=1., vib=.012):             # sáo: sine + hơi thở, rung nhẹ sau 0,12 s
    f = mf(m); tt = t_(d); fr = f * (1 + vib * np.sin(2 * np.pi * 5.2 * tt) * np.clip((tt - .12) / .15, 0, 1))
    ph = 2 * np.pi * np.cumsum(fr) / SR
    x = np.sin(ph) + .2 * np.sin(2 * ph) + .05 * np.sin(3 * ph) + bp(noise(d), f * .8, min(f * 2.5, 9000.)) * .1
    return fade(x * np.minimum(1, tt / .045) * np.minimum(1, (d - tt) / .07), .004, .03) * v * .3
def reed(m, d=.5, v=1.):                        # kèn dăm đồ chơi (clarinet/bassoon): bội lẻ, ấm, hơi "rón rén"
    f = mf(m); tt = t_(d); ph = 2 * np.pi * f * tt
    x = lp(sum(np.sin(ph * k) / k ** 1.3 for k in (1, 3, 5, 7, 9)) + .15 * np.sin(2 * ph), 1800)
    return fade(x * np.minimum(1, tt / .03) * np.minimum(1, (d - tt) / .06), .005, .03) * v * .3
def steel(m, d=.6, v=1.):                       # trống thép (steel pan): chuông tròn, bội 2 và 3 hơi lệch
    f = mf(m); tt = t_(d)
    x = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 4) + .5 * np.sin(2 * np.pi * 2.005 * f * tt) * np.exp(-tt * 6.5) + .22 * np.sin(2 * np.pi * 3.01 * f * tt) * np.exp(-tt * 10)
    return fade(x * np.minimum(1, tt / .004), .002, .05) * v * .32
def tuba(m, d=.35, v=1., bend=0.):              # tuba đồ chơi "oom-pah"; bend: trượt bao nhiêu nửa cung trong nốt (âm = xuống, "bwomp")
    tt = t_(d); f = mf(m) * 2 ** (bend * (tt / d) ** 1.5 / 12); ph = 2 * np.pi * np.cumsum(f) / SR
    x = lp(np.tanh(1.8 * (np.sin(ph) + .5 * np.sin(2 * ph) + .3 * np.sin(3 * ph))), 900)
    return fade(x * np.minimum(1, tt / .025) * np.exp(-tt * (3 if not bend else 1.5)), .004, .05) * v * .42
def tom(m=50, v=1.):                            # trống tom mềm
    d = .35; tt = t_(d); f = mf(m) * (1 + .5 * np.exp(-tt * 30))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9) + bp(noise(d), 200, 900) * env_exp(d, .02) * .25
    return fade(x, .001, .05) * v * .5
def claves(v=1.):                               # phách gỗ "cốc"
    d = .06; tt = t_(d); return fade(np.sin(2 * np.pi * 2500 * tt) * np.exp(-tt * 80), .0005, .01) * v * .3
def brush(v=1., d=.18):                         # chổi quét trống: "xẹt" mềm (chỉ dùng chỗ không có lời)
    tt = t_(d); return bp(noise(d), 1500, 5000) * np.sin(np.pi * tt / d) ** 1.5 * v * .12
def tamb(v=1.):                                 # lục lạc mỏng (chỉ dùng chỗ không có lời)
    d = .12; return hp(noise(d), 6000) * env_exp(d, .025) * v * .12
def celesta(m, d=1., v=1.):                     # celesta / hộp nhạc: tròn, ngân
    f = mf(m); tt = t_(d)
    x = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 3) + .3 * np.sin(2 * np.pi * 4 * f * tt) * np.exp(-tt * 12)
    return fade(x * np.minimum(1, tt / .002), .001, .08) * v * .28
def harp(m, d=.6, v=1.):                        # đàn hạc: rải hợp âm nhẹ
    f = mf(m); tt = t_(d)
    x = sum(a * np.sin(2 * np.pi * f * k * tt) * np.exp(-tt * (3 + 3 * k)) for k, a in ((1, 1), (2, .45), (3, .2), (4, .08)))
    return fade(x, .002, .04) * v * .3


# ---------- ngữ pháp nhạc dùng chung ----------
MAJ, MIN = (0, 4, 7), (0, 3, 7)
def triad(root, kind=MAJ, inv=0):               # hợp âm ba (midi); inv: đảo bao nhiêu nốt lên quãng tám
    n = [root + i for i in kind]
    for _ in range(inv): n = n[1:] + [n[0] + 12]
    return n
# Mô-típ "bí mật" của kênh: đô–mi–sol đi lên (giống "BIG SE-CRETS" của nhạc hiệu). Mỗi tập, mỗi cảnh đổi nhạc cụ, giọng,
# nhịp và cách chơi (rón rén, lơ lửng, swing, dãn dài, bừng sáng…), nên khán giả nhận ra kênh mà nhạc không lặp khuôn.
SECRET = (0, 4, 7)
def secret(M, inst, root, t, step=.17, g=.6, pan=.2, minor=False, d=None, last=None):
    """Chơi mô-típ bí mật ở giọng `root` từ thời điểm t; `last`: nốt thứ tư tuỳ chọn (ví dụ quãng tám, để kết câu)."""
    iv = (0, 3, 7) if minor else SECRET
    ns = [root + i for i in iv] + ([root + last] if last is not None else [])
    for i, n in enumerate(ns): M(inst(n, d) if d else inst(n), t + i * step, g * (1 + .08 * i), pan)


# ---------- nhạc cụ cho màu "Night Band" (SHORT-003): phím điện, vibraphone, contrabass gảy, búng tay ----------
def rhodes(m, d=.8, v=1.):                      # đàn phím điện kiểu Rhodes: sine ấm + tiếng "tine" sáng lúc đánh, tremolo nhẹ
    f = mf(m); tt = t_(d)
    x = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 2.2) + .3 * np.sin(2 * np.pi * 2 * f * tt) * np.exp(-tt * 4) + .22 * np.sin(2 * np.pi * 7.1 * f * tt) * np.exp(-tt * 28)
    return fade(x * (1 + .12 * np.sin(2 * np.pi * 4.5 * tt)) * np.minimum(1, tt / .003), .002, .06) * v * .3
def vibes(m, d=1.2, v=1.):                      # vibraphone: thanh kim loại tròn, rung tremolo
    f = mf(m); tt = t_(d)
    x = (np.sin(2 * np.pi * f * tt) + .18 * np.sin(2 * np.pi * 4 * f * tt) * np.exp(-tt * 6)) * np.exp(-tt * 1.8)
    return fade(x * (1 + .35 * np.sin(2 * np.pi * 5.5 * tt)) * np.minimum(1, tt / .002), .001, .08) * v * .28
def snap(v=1.):                                 # búng tay
    d = .07; tt = t_(d)
    return (bp(noise(d), 1800, 6000) * np.exp(-tt / .008) + np.sin(2 * np.pi * 1900 * tt) * np.exp(-tt / .004) * .3) * v * .4
def upright(m, d=.5, v=1.):                     # contrabass gảy (đi bộ): ấm, tắt chậm hơn bassn
    f = mf(m); tt = t_(d)
    x = (np.sin(2 * np.pi * f * tt) + .35 * np.sin(4 * np.pi * f * tt) + .12 * np.sin(6 * np.pi * f * tt)) * np.exp(-tt * 3) + bp(noise(d), 80, 400) * env_exp(d, .01) * .15
    return fade(x, .004, .05) * v * .55


# ---------- nhạc cụ cho màu "Ant Parade" (SHORT-004): trống snare diễu hành, banjo ----------
def snare(v=1., d=.16):                         # trống snare đồ chơi: da trống + dây lò xo
    tt = t_(d); f = 190 * (1 + .4 * np.exp(-tt * 40))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 30) * .5 + bp(noise(d), 1800, 7000) * np.exp(-tt * 22)
    return fade(x, .0005, .02) * v * .32
def banjo(m, d=.45, v=1.):                      # banjo: gảy sáng, tắt nhanh, tiếng "twang" của mặt da
    f = mf(m); tt = t_(d)
    x = sum(np.sin(2 * np.pi * f * k * tt * (1 + .002 * k)) * np.exp(-tt * (6 + 5 * k)) / k ** .8 for k in range(1, 9) if f * k < 9000)
    x = x + hp(noise(d), 3000) * env_exp(d, .004) * .25
    return fade(lp(x, 6000), .001, .03) * v * .3
