"""Nhóm "9 Vocal QC" của _shared/qa.py (Task.md 18/11/2026 "AI Vocal & Musical Quality Control", _shared/QUALITY.md §9).
Chỉ đọc <tập>/out/vocal-qc.json do _shared/tools/vocal_qc.py ghi (build.sh chạy nó sau mix.py); không nghe lại gì ở đây.
Mỗi tiêu chuẩn cuối cùng của Task.md §10 thành một dòng: LỖI (đã xác nhận bằng số đo) → CHƯA ĐẠT · CẦN NGHE → CẢNH BÁO (nghe đúng đoạn
đó rồi sửa, hoặc ghi kết luận vào báo cáo) · ĐẠT. Phần chỉ nghe được nằm ở checklist G của VOCAL-QC.md."""
import os, json


def run(C):
    row, OK, WARN, FAIL, OUT = C['row'], C['OK'], C['WARN'], C['FAIL'], C['OUT']
    G = '9 Vocal QC'; p = os.path.join(OUT, 'vocal-qc.json'); mix = os.path.join(OUT, 'mix.wav')
    if not os.path.exists(p):
        row(G, 'Vocal & Musical QC', WARN, 'chưa có out/vocal-qc.json', 'chạy _shared/tools/vocal_qc.py <tập> sau mix.py (build.sh)'); return
    q = json.load(open(p, encoding='utf-8'))
    if os.path.exists(mix) and os.path.getmtime(mix) > os.path.getmtime(p) + 1:
        row(G, 'Vocal QC mới nhất', WARN, 'vocal-qc.json cũ hơn out/mix.wav', 'chạy lại _shared/tools/vocal_qc.py')
    for c in q.get('criteria', []):
        st = FAIL if c['status'] == 'LỖI' else WARN if c['status'] == 'CẦN NGHE' else OK
        row(G, c['name'], st, '; '.join(c['items'][:3]) or 'đạt (số đo)', c['how'])
