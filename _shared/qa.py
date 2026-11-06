"""Kiểm tra chất lượng một Short theo bộ tiêu chí của kênh (_shared/QUALITY.md). Chạy sau khi dựng xong:
    python _shared/qa.py films/short-00x            # đo các tiêu chí đo được, in bảng ĐẠT / CẢNH BÁO / CHƯA ĐẠT
    python _shared/qa.py films/short-00x --json     # thêm out/qa.json
Cần: <film>/timeline.json, events.json, out/stem_{mus,fx,vox}.wav, out/mix.wav, <film>/<tên>.mp4 (build.sh tạo ra hết).
Đo bằng numpy và ffmpeg, không dùng mạng. Phần không đo được (câu chuyện, độ hài, biểu cảm) nằm trong checklist của QUALITY.md.
Mã thoát: 0 khi không có mục CHƯA ĐẠT; 1 khi có (build.sh vẫn in đủ báo cáo)."""
import os, sys, json, glob, subprocess, numpy as np, soundfile as sf

FILM = os.path.abspath(sys.argv[1]); NAME = os.path.basename(FILM)
TL = json.load(open(os.path.join(FILM, 'timeline.json'), encoding='utf-8'))
EV = json.load(open(os.path.join(FILM, 'events.json'), encoding='utf-8'))['ev']
DUR = TL['dur']; LINES = TL['lines']; SECS = TL.get('secs', [])
MP4 = os.path.join(FILM, f'{NAME}.mp4')
OUT = os.path.join(FILM, 'out')
rows = []
def row(group, item, status, value, rule): rows.append({'group': group, 'item': item, 'status': status, 'value': value, 'rule': rule})
OK, WARN, FAIL = 'ĐẠT', 'CẢNH BÁO', 'CHƯA ĐẠT'
def db(x): return 20 * np.log10(max(float(x), 1e-9))
def rms(x): return float(np.sqrt(np.mean(np.square(x)))) if len(x) else 0.

# ---------- đọc hình: 8 khung/giây, xám 90×160 ----------
FPS = 8
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', MP4, '-vf', f'fps={FPS},scale=90:160,format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
F = np.frombuffer(raw, np.uint8).reshape(-1, 160, 90).astype(np.float32)
diff = np.r_[0, np.abs(np.diff(F, axis=0)).mean(axis=(1, 2))]        # chuyển động giữa hai khung liên tiếp (0..255)
luma = F.mean(axis=(1, 2))
def spans(mask, step):                                             # các đoạn liên tục mask=True → [(t0, t1)]
    out, s = [], None
    for i, m in enumerate(list(mask) + [False]):
        if m and s is None: s = i
        if not m and s is not None: out.append((s * step, i * step)); s = None
    return out

# ---------- đọc tiếng ----------
def load(p):
    x, sr = sf.read(p); return (x.mean(1) if x.ndim > 1 else x), sr
vox, sr = load(os.path.join(OUT, 'stem_vox.wav')); mus, _ = load(os.path.join(OUT, 'stem_mus.wav')); fx, _ = load(os.path.join(OUT, 'stem_fx.wav'))
mix, _ = load(os.path.join(OUT, 'mix.wav'))
n = min(len(vox), len(mus), len(fx)); vox, mus, fx = vox[:n], mus[:n], fx[:n]
W = int(.1 * sr)
def env(x): return np.array([rms(x[i:i + W]) for i in range(0, len(x) - W, W)])
ev_v, ev_m, ev_f = env(vox), env(mus), env(fx)

# ======================= 1. Hook (3 giây đầu) =======================
first_line = min(l['t'] for l in LINES) if LINES else 99
row('1 Hook', 'Lời đầu tiên', OK if first_line <= .5 else WARN if first_line <= 1.5 else FAIL, f'{first_line:.2f} s', '≤ 0,5 s (câu móc có cả hình và lời)')
mot1 = float(diff[1:FPS + 1].mean()) if len(diff) > FPS else 0
row('1 Hook', 'Chuyển động trong giây đầu', OK if mot1 >= 1.2 else WARN if mot1 >= .6 else FAIL, f'{mot1:.2f}', '≥ 1,2 (khung đầu đã có hành động)')
m0 = db(rms(mus[:int(.5 * sr)]))
row('1 Hook', 'Nhạc ngay từ giây 0', OK if m0 > -40 else FAIL, f'{m0:.0f} dBFS (0–0,5 s)', '> −40 dBFS')
sfx0 = [e for e in EV if e['t'] <= .3]
row('1 Hook', 'Tiếng động ở khung đầu', OK if sfx0 else WARN, f'{len(sfx0)} tiếng ≤ 0,3 s', '≥ 1 (chữ/nhân vật xuất hiện có tiếng)')
hook_ev = [e for e in EV if e['t'] < 3]
row('1 Hook', 'Mật độ tiếng động 0–3 s', OK if len(hook_ev) >= 5 else WARN, f'{len(hook_ev)}', '≥ 5 cue khớp hành động')
title = next((s for s in SECS if s.get('id') == 'title'), None)
if title: row('1 Hook', 'Cảnh tựa / logo', OK if title['t0'] >= 3 and title['t1'] - title['t0'] <= 2.05 else FAIL, f"{title['t0']:.1f}–{title['t1']:.1f} s", 'sau 3 s móc, dài ≤ 2 s')
else: row('1 Hook', 'Cảnh tựa / logo', OK, 'không có', 'bản B không có cảnh tựa')

# ======================= 2. Giữ chân =======================
still = spans(np.convolve(diff, np.ones(FPS) / FPS, 'same') < .35, 1 / FPS)
speak = lambda a, b: any(l['t'] < b and l['t'] + l['dur'] > a for l in LINES)
long_still = [(a, b) for a, b in still if b - a >= 2.5]
bad_still = [(a, b) for a, b in long_still if not speak(a, b)]
row('2 Giữ chân', 'Đoạn hình đứng yên ≥ 2,5 s', OK if not long_still else WARN if not bad_still else FAIL,
    ', '.join(f'{a:.1f}–{b:.1f}' for a, b in long_still) or 'không có', 'không có (được phép khi đang có lời, ví dụ trang sổ)')
quiet = spans((ev_v < 10 ** (-45 / 20)) & (ev_f < 10 ** (-40 / 20)), .1)
dead = [(a, b) for a, b in quiet if b - a >= 1.8 and b < DUR - .2]
row('2 Giữ chân', 'Khoảng "chết" (không lời, không tiếng động) ≥ 1,8 s', OK if not dead else WARN, ', '.join(f'{a:.1f}–{b:.1f}' for a, b in dead) or 'không có', 'không có (khoảng lặng có chủ đích phải ≤ 1 s)')
cuts = int((diff > 18).sum())
secs_n = len(SECS); avg = DUR / max(1, secs_n)
row('2 Giữ chân', 'Độ dài trung bình mỗi cảnh', OK if avg <= 12 else WARN, f'{avg:.1f} s ({secs_n} cảnh, {cuts} chuyển cảnh mạnh)', '≤ 12 s; trong cảnh dài phải có máy quay hoặc kính di chuyển')
words = sum(len(l['text'].split()) for l in LINES); wps = words / DUR
row('2 Giữ chân', 'Tốc độ lời', OK if .8 <= wps <= 2.2 else WARN, f'{wps:.2f} từ/s ({words} từ)', '0,8–2,2 từ/s cho trẻ 4–8 tuổi')

# ======================= 4. Âm thanh =======================
try:
    lo = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', MP4, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True, encoding='utf-8', errors='ignore').stderr
    I = float([l for l in lo.splitlines() if l.strip().startswith('I:')][-1].split()[1]); P = float([l for l in lo.splitlines() if l.strip().startswith('Peak:')][-1].split()[1])
except Exception: I, P = float('nan'), float('nan')
row('4 Âm thanh', 'Độ to', OK if abs(I + 14) <= 1 else FAIL, f'{I:.1f} LUFS', '−14 ± 1 LUFS')
row('4 Âm thanh', 'Đỉnh thật', OK if P <= -1 else FAIL, f'{P:.1f} dBTP', '≤ −1 dBTP')
from scipy.signal import butter, sosfilt
band = butter(2, [300, 4000], 'band', fs=sr, output='sos'); vb, bb = sosfilt(band, vox), sosfilt(band, mus + fx)
snr = []
for l in LINES:
    i, j, w = int(l['t'] * sr), int((l['t'] + l['dur']) * sr), int(.05 * sr); r = []
    for q in range(i, j - w, w):
        a = rms(vb[q:q + w])
        if a > .02: r.append(db(a) - db(rms(bb[q:q + w])))
    if r: snr.append((l['id'], float(np.median(r))))
worst = min(snr, key=lambda s: s[1]) if snr else ('-', 99)
row('4 Âm thanh', 'Lời rõ hơn nhạc + tiếng động', OK if worst[1] >= 10 else WARN if worst[1] >= 7 else FAIL, f'thấp nhất {worst[1]:.1f} dB ({worst[0]})', '≥ 10 dB mỗi câu (dải 300–4000 Hz, trung vị)')
per10 = len(EV) / DUR * 10
row('4 Âm thanh', 'Mật độ tiếng động', OK if per10 >= 4 else WARN, f'{per10:.1f} cue / 10 s ({len(EV)} cue)', '≥ 4 cue / 10 s')
hi = np.abs(np.fft.rfft(mix[:sr * 20])) if len(mix) > sr * 20 else np.abs(np.fft.rfft(mix)); fr = np.fft.rfftfreq((len(mix[:sr * 20]) if len(mix) > sr * 20 else len(mix)), 1 / sr)
share = float((hi[fr > 6000] ** 2).sum() / (hi ** 2).sum() * 100)
row('4 Âm thanh', 'Độ chói (năng lượng > 6 kHz)', OK if share <= 6 else WARN, f'{share:.1f} %', '≤ 6 % (không chói tai)')
drops = int(((ev_v + ev_m + ev_f)[:-1] > 10 ** (-30 / 20)).astype(int) @ ((ev_v + ev_m + ev_f)[1:] < 10 ** (-54 / 20)).astype(int)) if len(ev_v) > 1 else 0
row('4 Âm thanh', 'Tiếng tụt đột ngột', OK if drops == 0 else WARN, f'{drops}', '0 (không ngắt cụt giữa chừng)')

# nhạc nền: không có lỗ im, có tự động hoá âm lượng theo cảnh (QUALITY.md §4)
mu1 = mus if mus.ndim == 1 else mus.mean(1)
sec_db = [20 * np.log10(rms(mu1[i * sr:(i + 1) * sr]) + 1e-9) for i in range(int(len(mu1) / sr))]
holes = [i for i, v in enumerate(sec_db) if v < -45]
row('4 Âm thanh', 'Lỗ im của nhạc nền', OK if len(holes) <= 1 else WARN, f'{len(holes)} giây dưới −45 dB' + (f" ({', '.join(f'{i}s' for i in holes[:6])})" if holes else ''), '≤ 1 giây (khoảng lặng có chủ đích)')
act = [v for v in sec_db if v > -60]
dyn = (max(act) - min(act)) if act else 0
row('4 Âm thanh', 'Âm lượng nhạc đổi theo cảnh', OK if dyn >= 6 else WARN, f'{dyn:.0f} dB giữa giây to nhất và nhỏ nhất', '≥ 6 dB (dâng ở chỗ khám phá, hạ dưới lời)')

# ======================= 5. Hình ảnh =======================
blank = int(((F.std(axis=(1, 2)) < 2)).sum())
row('5 Hình ảnh', 'Khung trống / đen', OK if blank == 0 else FAIL, f'{blank} khung', '0')
pr = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height,r_frame_rate', '-of', 'csv=p=0', MP4], capture_output=True, text=True).stdout.strip().split(',')
try: vw, vh, num, den = int(pr[0]), int(pr[1]), *map(float, pr[2].split('/')); vfps = num / den
except Exception: vw = vh = 0; vfps = 0
row('5 Hình ảnh', 'Khung hình và tốc độ', OK if (vw, vh) in ((1080, 1920), (1920, 1080)) and abs(vfps - 30) < .01 else FAIL, f'{vw}×{vh}, {vfps:g} fps', '1080×1920 (Short) hoặc 1920×1080 (video dài), 30 fps')
flash = np.abs(np.diff(luma)) > 40; fl_rate = max((np.convolve(flash, np.ones(FPS), 'same')).max() if len(flash) else 0, 0)
row('5 Hình ảnh', 'Chớp sáng mạnh', OK if fl_rate <= 3 else FAIL, f'tối đa {int(fl_rate)} lần/giây', '≤ 3 lần/giây (an toàn cho trẻ)')
sat = []
r2 = subprocess.run(['ffmpeg', '-v', 'error', '-i', MP4, '-vf', 'fps=1,scale=90:160', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
RGB = np.frombuffer(r2, np.uint8).reshape(-1, 160, 90, 3).astype(np.float32)
mx, mn = RGB.max(axis=3), RGB.min(axis=3); S = float(((mx - mn) / np.maximum(mx, 1)).mean())
row('5 Hình ảnh', 'Độ rực màu', OK if S >= .35 else WARN, f'{S:.2f}', '≥ 0,35 (màu hoạt hình bắt mắt)')

# ======================= 6. Xem lại =======================
if len(F) > 2:
    seam = float(np.abs(F[-1] - F[0]).mean())
    # phim lặp: có chuyển cảnh "iris" mở về khung đầu trong 1,5 s cuối (ringiris, puffiris…), hoặc timeline khai báo mốc 'loop'
    loop_film = any(e['type'] in ('ringiris', 'spot', 'descend') or ('iris' in e['type'] and e['t'] > DUR - 1.5) for e in EV) or 'loop' in TL.get('hit', {})
    row('6 Xem lại', 'Khung cuối nối khung đầu', OK if seam < 25 or not loop_film else WARN, f'chênh {seam:.1f}/255' + ('' if loop_film else ' (phim không lặp hình)'), 'phim lặp: < 25; phim không lặp: câu cuối nối câu móc')
endq = [l for l in LINES if '?' in l['text'] and l['t'] >= DUR - 5.5]
recall = 'recall' in TL.get('hit', {})
row('6 Xem lại', 'Câu hỏi kết cho trẻ', OK if endq else WARN, f"\"{endq[-1]['text']}\" ở {endq[-1]['t']:.1f} s" if endq else 'không có', 'một câu hỏi ngắn trong 5,5 s cuối (trẻ trả lời to; không kêu gọi bình luận)')
row('6 Xem lại', 'Cảnh cuối gợi lại câu móc', OK if recall else WARN, 'có (chữ móc trở lại)' if recall else 'không có mốc recall', 'chữ/âm thanh của câu móc trở lại ở cuối (mốc HIT.recall)')
egg = [e for e in EV if e['type'] in ('roll',)] + [1 for s in ('spindle', 'rollo') if s in TL.get('hit', {})]
if title: row('6 Xem lại', 'Chi tiết để tìm lại', OK if egg else WARN, 'có' if egg else 'không có', 'tập A có trứng phục sinh (Rollo, Spindle…)')
else: row('6 Xem lại', 'Vòng lặp của bản B', OK if loop_film else WARN, 'có' if loop_film else 'không có', 'bản B phát vòng lặp liền (khung cuối mở về khung đầu)')

# ======================= 7. Giọng nhân vật =======================
def f0(y, sr):
    fr = []; w = int(.04 * sr)
    for i in range(0, len(y) - w, w // 2):
        x = y[i:i + w] - y[i:i + w].mean()
        if rms(x) < .03: continue
        ac = np.correlate(x, x, 'full')[w - 1:]; lo_, hi_ = int(sr / 500), int(sr / 70); k = lo_ + int(np.argmax(ac[lo_:hi_]))
        if ac[k] > .3 * ac[0]: fr.append(sr / k)
    return float(np.median(fr)) if fr else 0.
who = {}
for l in LINES:
    p = os.path.join(FILM, 'voice', l['id'] + '.wav')
    if os.path.exists(p): y, s2 = load(p); who.setdefault(l['who'], []).append(f0(y, s2))
pitch = {k: float(np.median([v for v in vs if v])) for k, vs in who.items() if any(vs)}
names = sorted(pitch)
try: VX = {l['id']: l.get('voice', '') for l in json.load(open(os.path.join(FILM, 'voice', 'lines.json'), encoding='utf-8'))}
except Exception: VX = {}
accent = {k: {VX.get(l['id'], '')[:1] for l in LINES if l['who'] == k} - {''} for k in names}   # 'a' giọng Mỹ, 'b' giọng Anh (tên giọng Kokoro)
pairs = [(abs(12 * np.log2(pitch[a] / pitch[b])), a, b) for i, a in enumerate(names) for b in names[i + 1:]]
close = [(d, a, b) for d, a, b in pairs if d < 3 and not (accent[a] and accent[b] and accent[a].isdisjoint(accent[b]))]   # gần cao độ nhưng khác giọng Anh/Mỹ thì vẫn phân biệt rõ
semis = [d for d, _, _ in pairs]
row('7 Giọng', 'Cao độ từng nhân vật', OK, ', '.join(f'{k} {v:.0f} Hz' for k, v in pitch.items()), 'mỗi nhân vật một giọng riêng')
if semis:
    near = min(pairs); note = '' if near[0] >= 3 else f" ({near[1]}–{near[2]}{'' if close else ', khác giọng Anh/Mỹ'})"
    row('7 Giọng', 'Các giọng khác nhau rõ', OK if not close else WARN, f'gần nhất {near[0]:.1f} nửa cung{note}', '≥ 3 nửa cung, hoặc khác giọng Anh/Mỹ')
kids = [k for k in pitch if k in ('crumb', 'blink', 'dot')]
for k in kids: row('7 Giọng', f'Giọng trẻ em: {k}', OK if pitch[k] >= 240 else WARN, f'{pitch[k]:.0f} Hz', '≥ 240 Hz')

# ---------- in ----------
w1 = max(len(r['item']) for r in rows)
print(f'QA · {NAME} · {DUR:.1f} s')
for g in sorted({r['group'] for r in rows}):
    print(f'\n{g}')
    for r in rows:
        if r['group'] == g: print(f"  {r['status']:9s} {r['item']:{w1}s}  {r['value']}   [{r['rule']}]")
fails = [r for r in rows if r['status'] == FAIL]; warns = [r for r in rows if r['status'] == WARN]
print(f'\n{len(rows) - len(fails) - len(warns)} đạt · {len(warns)} cảnh báo · {len(fails)} chưa đạt. Checklist phần không đo được: _shared/QUALITY.md')
if '--json' in sys.argv: json.dump(rows, open(os.path.join(OUT, 'qa.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
sys.exit(1 if fails else 0)
