"""Nhóm "10 Âm thanh theo cảnh" của _shared/qa.py (thiết kế âm thanh theo cảnh, 4 lớp: Task.md 18/11/2026, _shared/QUALITY.md §10).
Đọc: log ebur128 mà qa.py đã chạy trên file cuối (biến `lo`: độ to ngắn hạn S mỗi 0,1 s, LRA), out/scenes.json (mức năng lượng và lớp nền
của từng cảnh, do mix.py ghi), out/stem_amb.wav (lớp nền), out/av-sync.json (do _shared/tools/av_sync.py ghi), timeline.json.
Chạy độc lập để đo một file:  python _shared/qa_scene.py films/<tập>/<tập>.mp4 films/<tập>/out/scenes.json
"""
import os, re, json, sys
import numpy as np

CALM, PEAK = {'calm'}, {'peak', 'high'}


def series(lo):
    """[(t, M, S)] từ log ebur128 (mỗi 0,1 s)."""
    out = []
    for m in re.finditer(r't:\s*([\d.]+)\s+TARGET:[-\d.]+ LUFS\s+M:\s*([-\d.inf]+)\s+S:\s*([-\d.inf]+)', lo):
        try: out.append((float(m.group(1)), float(m.group(2)), float(m.group(3))))
        except ValueError: pass
    return out


def lra(lo):
    m = re.findall(r'LRA:\s*([\d.]+) LU', lo.split('Summary:')[-1]) if 'Summary:' in lo else []
    return float(m[0]) if m else None


def contrast(S, scenes):
    """Độ to ngắn hạn (S, 3 s) trung vị của cảnh cao trào trừ của cảnh êm (LU). Bỏ 1,5 s đầu mỗi cảnh (S trễ 3 s)."""
    def med(kinds):
        v = [s for t, _, s in S for sc in scenes if sc.get('energy') in kinds and sc['t0'] + 1.5 <= t < sc['t1'] and s > -70]
        return float(np.median(v)) if v else None
    hi, lo_ = med(PEAK), med(CALM)
    return (None if hi is None or lo_ is None else hi - lo_), hi, lo_


def run(C):
    row, OK, WARN, FAIL = C['row'], C['OK'], C['WARN'], C['FAIL']
    OUT, TL, DUR, LONG = C['OUT'], C['TL'], C['DUR'], C['LONG']; lo = C.get('lo') or ''
    G = '10 Âm thanh theo cảnh'; rd = lambda p, d=None: json.load(open(p, encoding='utf-8')) if os.path.exists(p) else d
    SC = (rd(os.path.join(OUT, 'scenes.json'), {}) or {}).get('scenes', [])
    # --- cường độ: LRA và độ chênh cao trào / cảnh êm ---
    L = lra(lo)
    row(G, 'Độ chênh cường độ (LRA)', WARN if L is None else OK if 4 <= L <= 9 else WARN, 'không đo được' if L is None else f'{L:.1f} LU',
        '4–9 LU: cảnh êm và cảnh cao trào nghe khác nhau (Task.md: LRA 2,7 LU là quá phẳng), không vọt lên xuống đột ngột')
    if SC:
        d, hi, lo_ = contrast(series(lo), SC)
        row(G, 'Cao trào nổi hơn cảnh êm', WARN if d is None else OK if d >= 3 else WARN,
            'thiếu cảnh calm / peak trong scenes.json' if d is None else f'{d:+.1f} LU (cao trào {hi:.1f}, cảnh êm {lo_:.1f} LUFS ngắn hạn)', '≥ 3 LU (độ to ngắn hạn trung vị)')
    else: row(G, 'Bảng cảnh 4 lớp', WARN, 'chưa có out/scenes.json', 'mix.py ghi mức năng lượng và lớp nền của từng cảnh (SCENES)')
    # --- lớp nền ---
    ap = os.path.join(OUT, 'stem_amb.wav')
    if os.path.exists(ap):
        import soundfile as sf
        a, sr = sf.read(ap); a = a.mean(1) if a.ndim > 1 else a; n = int(DUR)
        db = [20 * np.log10(np.sqrt(np.mean(a[int(i * sr):int((i + 1) * sr)] ** 2)) + 1e-12) for i in range(n)]
        cov = float(np.mean([x > -60 for x in db])) if db else 0.
        miss = [s['id'] for s in SC if not s.get('amb')]
        row(G, 'Âm thanh môi trường', OK if cov >= .95 and not miss else WARN, f'có nền ở {cov:.0%} số giây' + (f'; cảnh không có nền: {", ".join(miss)}' if miss else '') + (f'; lớp nền: {", ".join(sorted({s["amb"] for s in SC if s.get("amb")}))}' if SC else ''),
            'mỗi cảnh một lớp nền đúng bối cảnh (ambience.py), có ở ≥ 95 % số giây (stem nền > −60 dBFS)')
    else: row(G, 'Âm thanh môi trường', WARN, 'chưa có out/stem_amb.wav', 'mix.py ghi stem nền')
    # --- hiệu ứng khớp hành động ---
    av = rd(os.path.join(OUT, 'av-sync.json'))
    if av:
        cov = av.get('coverage', 0); late = av.get('off', [])
        row(G, 'Hiệu ứng khớp hành động', OK if cov >= .85 and not late else WARN,
            f"{cov:.0%} điểm chuyển động mạnh có tiếng (±{av.get('tol', .2):.2f} s)" + (f"; thiếu tiếng: {', '.join(f'{x:.1f}' for x in av.get('missing', [])[:8])} s" if av.get('missing') else '') + (f"; tiếng lệch: {', '.join(f'{x[0]:.2f} s {x[1]}' for x in late[:5])}" if late else ''),
            '≥ 85 % điểm khởi động chuyển động (đo trên video) có tiếng động hoặc lời trong ± 0,2 s; không tiếng nào lệch hành động > 0,15 s (_shared/tools/av_sync.py)')
    else: row(G, 'Hiệu ứng khớp hành động', WARN, 'chưa có out/av-sync.json', 'chạy _shared/tools/av_sync.py <tập> sau khi dựng video')
    # --- khoảng nghỉ giữa các câu ---
    LS = sorted(TL.get('lines', []), key=lambda l: l['t']); tight = []
    for a, b in zip(LS, LS[1:]):
        g = b['t'] - (a['t'] + a['dur']); need = .2 if a['who'] != b['who'] else .12
        if g < need: tight.append(f"{a['id']}→{b['id']} {g * 1000:.0f} ms")
    row(G, 'Khoảng nghỉ giữa các câu', OK if not tight else WARN, ', '.join(tight) or 'đủ', '≥ 0,2 s giữa hai người nói, ≥ 0,12 s giữa hai câu của cùng một người')


if __name__ == '__main__':
    import subprocess
    mp4, scp = sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None
    lo = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', mp4, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True, encoding='utf-8', errors='ignore').stderr
    print('LRA', lra(lo))
    if scp and os.path.exists(scp):
        d, hi, lo_ = contrast(series(lo), json.load(open(scp, encoding='utf-8'))['scenes']); print('contrast', d, hi, lo_)
