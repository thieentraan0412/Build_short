"""Hiệu ứng âm thanh có khớp hành động không (Lớp SFX của thiết kế âm thanh theo cảnh, Task.md 18/11/2026, _shared/QUALITY.md §10).
python _shared/tools/av_sync.py films/<tập> [--video out/video.mp4]

Đo trên chính video đã dựng (không đoán từ mã): giải mã ở 108×192, 30 khung/s, tính độ khác giữa hai khung liền nhau, tìm các
**điểm khởi động chuyển động mạnh** (độ khác vọt lên so với nền 0,5 s trước đó: hành động bắt đầu, va chạm, xuất hiện / biến mất, cắt
cảnh). Mỗi điểm phải có một tiếng động (events.json; tiếng có độ dài d phủ cả khoảng [t, t + d]) hoặc một lời bắt đầu trong ± TOL giây.
Tiếng gần nhất lệch 0,15–0,5 s: ghi là tiếng lệch (sớm / muộn so với hành động); xa hơn TOL: thiếu tiếng.
Ghi out/av-sync.json (qa.py nhóm 10 đọc) và in danh sách để soát. Đây là số đo gần đúng: chuyển động nhỏ (chớp mắt) và tuyết rơi bị
bỏ qua có chủ ý; điểm "thiếu tiếng" là chỗ cần xem lại, không phải lỗi chắc chắn.
"""
import sys, os, json, subprocess, argparse
import numpy as np

TOL, LATE = .2, .15
BEDS = {'hum', 'snowfall', 'chorus', 'warmup', 'trees', 'brrr', 'chatter'}   # tiếng nền / kéo dài: không xét "lệch"


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('film'); ap.add_argument('--video', default='out/video.mp4'); a = ap.parse_args()
    F = os.path.abspath(a.film); vid = os.path.join(F, a.video)
    TL = json.load(open(os.path.join(F, 'timeline.json'), encoding='utf-8')); EV = json.load(open(os.path.join(F, 'events.json'), encoding='utf-8'))['ev']
    w, h, fps = 108, 192, 30
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', vid, '-vf', f'scale={w}:{h},format=gray', '-r', str(fps), '-f', 'rawvideo', '-'], capture_output=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, h, w).astype(np.float32)
    d = np.r_[0, np.abs(np.diff(fr, axis=0)).mean((1, 2))]                     # độ khác giữa hai khung liền nhau
    base = np.array([np.median(d[max(0, i - 15):i]) if i > 2 else d[i] for i in range(len(d))])
    jump = d - base; mad = np.median(np.abs(jump - np.median(jump))) + 1e-6; thr = max(2.5, 6 * mad)
    on = [i for i in range(2, len(d) - 2) if jump[i] > thr and jump[i] == jump[i - 2:i + 3].max()]
    # gộp các điểm cách nhau < 0,15 s (một hành động)
    onsets = []
    for i in on:
        if not onsets or i / fps - onsets[-1] > .15: onsets.append(i / fps)
    # tiếng: (bắt đầu, kết thúc, loại); tiếng có độ dài phủ cả khoảng của nó; lời: lúc bắt đầu
    cues = [(e['t'], e['t'] + min(e.get('d', 0), 1.0), e['type']) for e in EV] +            [(l['t'] + (l.get('sung', {}) or {}).get('pre', 0),) * 2 + ('lời ' + l['id'],) for l in TL['lines']]
    def nearest(t):
        best = (99, None)
        for a0, a1, ty in cues:
            dd = 0. if a0 <= t <= a1 else (a0 - t if t < a0 else a1 - t)
            if abs(dd) < abs(best[0]): best = (dd, ty)
        return best
    res = [(t,) + nearest(t) for t in onsets]
    matched = [t for t, dd, _ in res if abs(dd) <= TOL]; missing = [t for t, dd, _ in res if abs(dd) > TOL]
    off = [(round(t, 2), ty, round(dd, 2)) for t, dd, ty in res if LATE < abs(dd) <= .5]     # tiếng gần nhất sớm (+) / muộn (−) so với chuyển động
    cov = len(matched) / max(1, len(onsets))
    out = dict(fps=fps, tol=TOL, threshold=round(float(thr), 2), onsets=[round(t, 2) for t in onsets], coverage=round(cov, 3),
               missing=[round(t, 2) for t in missing], off=off)
    os.makedirs(os.path.join(F, 'out'), exist_ok=True)
    json.dump(out, open(os.path.join(F, 'out', 'av-sync.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    print(f'av_sync: {len(onsets)} điểm chuyển động mạnh, {cov:.0%} có tiếng trong ±{TOL} s')
    if missing: print('  thiếu tiếng ở:', ', '.join(f'{t:.2f}' for t in missing))
    if off: print('  tiếng lệch chuyển động > 0,15 s (điểm chuyển động, tiếng gần nhất, độ lệch):', ', '.join(f'{t} s {ty} ({dd:+.2f})' for t, ty, dd in off))


if __name__ == '__main__':
    main()
