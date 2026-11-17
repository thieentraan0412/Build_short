"""Âm thanh của <TẬP> → out/mix.wav (48 kHz stereo) và stems (chuẩn 11/2026b, _shared/QUALITY.md §4, §8).
python mix.py   (cần timeline.json + voice/*.wav từ tools/lines.mjs, tts.py, sing.py; events.json từ core/render/events.mjs)
Khung tối thiểu: thay bảng cảnh nhạc (G.sec), phần viết tay, LEVEL và bảng tiếng động (SFX) bằng của tập. Ví dụ đầy đủ (bản thử đã xoá): git show 137d621:films/lab-musical/mix.py
- Nhạc: lớp nhịp theo cảnh _shared/audio/groove.py với song=TL['song']: cảnh có câu hát dùng chords='song' và BPM của phần bài hát
  (sai thì ValueError); dưới câu hát hợp âm đủ nhịp, không arp; câu 'sing' được nhạc cụ hát chính đánh đôi; G.motif đặt giai điệu đặc trưng.
- Nhạc lùi dưới giọng: dưới câu nói ≈ −15 dB ở dải giọng, dưới câu hát ≈ −10 dB (ve_m); LEVEL dưới câu hát ≈ 0,8.
Không dùng mẫu âm thanh của bên thứ ba."""
import os, sys, json, numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'audio')); sys.path.insert(0, os.path.join(LIB, '_shared', 'audio'))
from sfx import SR, t_, bp, lp, noise, norm, brown, pop, compress, add
from band import mf
import toon as T
from groove import Groove
from scipy.ndimage import maximum_filter1d, uniform_filter1d

TL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))
EV = json.load(open(os.path.join(HERE, 'events.json'), encoding='utf-8'))['ev']
HIT = TL['hit']; BEAT = 60 / TL['bpm']; DUR = TL['dur']; N = int((DUR + .05) * SR); N0 = int(DUR * SR); NW = N + int(2.5 * SR)
B = {k: np.zeros((NW if k in ('mus', 'fx') else N, 2)) for k in ('mus', 'fx', 'amb', 'vox')}
LINES = TL['lines']; L = {l['id']: l for l in LINES}
end = lambda i: L[i]['t'] + L[i]['dur']
def speaking(t, pad_=.05): return any(l['t'] - pad_ <= t < l['t'] + l['dur'] + pad_ for l in LINES)
def mixl(*xs): n = max(len(x) for x in xs); return sum(np.pad(x, (0, n - len(x))) for x in xs)

# ---------- nhạc: bảng cảnh (Sound Design Plan) theo bài hát ----------
mus = B['mus']
def M(x, t, g=1., pan=0.): add(mus, x, t, g, pan)
G = Groove(M, BEAT, LINES, meter=4, seed=1, avoid=[(0, .3), (DUR - 1.2, DUR)], plan=True, song=TL['song'])
G.sec('<móc>', 0, 8, 'sunny', 'C', 'song', bass='bassn', comp='pluck', lead='xylo', kit='toy', energy=2, cue=False, bpm=120,
      mood='playful', arc='open', what='<nội dung cảnh>', emo='<cảm xúc>', why='<vì sao chọn nhạc này>')
G.sec('<khám phá · điệp khúc>', 8, DUR, 'bounce', 'C', 'song', bass='bassn', comp='piano', lead='marimba', kit='clap', energy=3, bpm=126,
      mood='happy', arc='peak', what='<…>', emo='<…>', why='<…>')
G.play()
G.motif(TL['song']['parts'][-1]['t0'] + .02, 'glock', .9)               # giai điệu đặc trưng (đặt ở chỗ không có lời)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True); G.save(os.path.join(HERE, 'out', 'music.json'), color='<màu nhạc của tập>')
# cường độ theo cảnh: dâng ở chỗ khám phá / bất ngờ, hạ dưới lời (≈ 0,72 dưới câu nói, ≈ 0,8 dưới câu hát), chuyển mềm 0,3 s
LEVEL = ((0, .92), (L['L01']['t'], .8), (end('L01'), .95), (L['L02']['t'], .74), (end('L02'), .95), (L['L03']['t'], .85), (L['L05']['t'], .7), (end('L05'), .95))
tt = np.arange(len(mus)) / SR; lev = np.full(len(mus), LEVEL[0][1])
for (t, g), (_, g0) in zip(LEVEL[1:], LEVEL[:-1]): lev = np.where(tt >= t - .15, np.where(tt < t + .15, g0 + (g - g0) * (tt - t + .15) / .3, g), lev)
mus *= lev[:, None]

# ---------- tiếng động theo sự kiện (mỗi loại tiếng một hàm; chuỗi nhịp có chủ đích ghi run trong events) ----------
fx = B['fx']
SFX = {
    'titlepop': lambda e: mixl(T.bubble(1600, .5, .06, 2.4), np.pad(T._ting(mf(97), .5, .35), (int(.02 * SR), 0))),
    'wordpop': lambda e: mixl(T.boing(220 + 120 * e.get('n', 0), .35, .3, 2.4, 16.), np.pad(pop(.6) * .45, (int(.02 * SR), 0))),
    'chorus': lambda e: mixl(T.sparkle(.55, .2, 92, 104, 5, 3, 'up'), T.tink(.3)),
    'recall': lambda e: mixl(SFX['titlepop'](e), SFX['wordpop']({'n': 0})),
}
missing = sorted({e['type'] for e in EV} - SFX.keys())
if missing: sys.exit(f'mix.py: no sound for event types {missing}')
for e in EV: add(fx, SFX[e['type']](e), e['t'], 1., e.get('pan', 0))

# ---------- vòng lặp (bản B): phần dư sau DUR cộng vào đầu phim ----------
for k in ('mus', 'fx'):
    b = B[k]; tail = b[N0:].copy(); b[:len(tail)] += tail; B[k] = b[:N].copy()
mus, fx = B['mus'], B['fx']

# ---------- nền ----------
amb = B['amb']; add(amb, lp(brown(DUR), 280) * .05, 0, 1., 0)

# ---------- giọng (đã hát bằng _shared/sing.py) ----------
vox = np.zeros(N)
for Ln in LINES:
    y, sr = sf.read(os.path.join(HERE, 'voice', Ln['id'] + '.wav'))
    if y.ndim > 1: y = y.mean(1)
    y = soxr.resample(y, sr, SR); s = int(Ln['t'] * SR); e = min(N, s + len(y)); vox[s:e] += y[:e - s]
vox = norm(compress(norm(vox, .9), thr=.22, ratio=3.5), .85)
B['vox'][:, 0] = B['vox'][:, 1] = vox

# ---------- trộn: nhạc lùi dưới giọng (dưới câu hát lùi ít hơn), master −14 LUFS ----------
def rms(x): x = x[np.abs(x).max(1) > 1e-4] if x.ndim > 1 else x[np.abs(x) > 1e-4]; return float(np.sqrt(np.mean(x ** 2))) if len(x) else 0.
mus *= .075 / max(rms(mus), 1e-9); fx *= .55 / max(np.abs(fx).max(), 1e-9)
ve = uniform_filter1d(maximum_filter1d(np.abs(vox), int(.05 * SR)), int(.25 * SR))
sungm = np.zeros(len(ve))
for l in LINES:
    if l.get('sung'): sungm[int(l['t'] * SR):int((l['t'] + l['dur']) * SR)] = 1
ve_m = ve * (1 - .15 * uniform_filter1d(sungm, int(.2 * SR)))
B['mus'] = T.duck(mus, ve_m, .82, .55); B['fx'] = T.duck(fx, ve, .6, .3)
mix = B['mus'] + B['fx'] + B['amb'] + B['vox']
mix = np.tanh(mix * 1.1) / 1.1
mix, I_mix, ceil_db = T.master(mix, 11.0); print(f'master: {I_mix:.1f} LUFS, true-peak ceiling {ceil_db:.1f} dBFS')
nf = int(.02 * SR); mix[:nf] *= np.linspace(0, 1, nf)[:, None]
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR, subtype='PCM_24')
for k in ('mus', 'fx', 'vox'): sf.write(os.path.join(HERE, 'out', f'stem_{k}.wav'), B[k].astype(np.float32), SR, subtype='PCM_16')
print('out/mix.wav', f'{len(mix) / SR:.2f} s')
