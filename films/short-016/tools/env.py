"""Khẩu hình: âm lượng của từng câu thoại, 24 giá trị mỗi giây (0..1) → voice/env.json, trang phim đọc để mở miệng Miss Loupe.
python tools/env.py   (cần voice/<id>.wav từ tts_zh.py)"""
import os, json, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
lines = json.load(open(os.path.join(HERE, 'voice', 'lines.json'), encoding='utf-8'))
out = {}
for L in lines:
    y, sr = sf.read(os.path.join(HERE, 'voice', L['id'] + '.wav'))
    if y.ndim > 1: y = y.mean(1)
    hop = sr // 24; n = int(np.ceil(len(y) / hop))
    rms = np.array([np.sqrt(np.mean(y[i * hop:(i + 1) * hop] ** 2)) if len(y[i * hop:(i + 1) * hop]) else 0 for i in range(n)])
    ref = np.percentile(rms, 90) or 1
    v = np.clip((rms / ref - .12) / .88, 0, 1)                    # khoảng lặng ngắn giữa từ → miệng khép
    out[L['id']] = [round(float(x), 2) for x in v]
json.dump(out, open(os.path.join(HERE, 'voice', 'env.json'), 'w', encoding='utf-8'))
print('voice/env.json', len(out), 'lines')
