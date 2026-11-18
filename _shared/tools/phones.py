"""Mốc từng âm vị của bản nói Kokoro (cho _shared/sing.py hát liền hơi, 19/11/2026 Task.md "giọng ngập ngừng").
python _shared/tools/phones.py <film>/voice/lines.json <film>/voice

Kokoro (core/tts/tts.py) tự dự đoán độ dài từng âm vị nhưng bản ONNX không xuất ra. Ở đây nạp kokoro-v1.0.onnx, nối thêm đầu ra
"duration" từ nút /encoder/Clip (độ dài âm vị đã làm tròn), rồi dựng lại đúng câu đó (cùng lời, giọng, tốc độ; không chèn nghỉ) và
cắt đầu như tts.py. Bản dựng lại phải trùng với file giọng (cùng độ dài, tương quan > 0,99) thì mốc mới được ghi. Câu có "pitch"
(voicefx.py lấy mẫu lại) thì mốc co theo tỉ lệ độ dài. Tiếng thật của Kokoro đi sớm hơn khung dự đoán 30–85 ms (đo trên SHORT-016) và
lệch khác nhau dọc câu, nên refine() dời mỗi nguyên âm về chỗ có thanh và to nhất gần đó (ràng buộc theo trung vị của câu, mốc vẫn tăng
dần). Mốc từ của Whisper còn lệch 50–150 ms (có từ chỉ còn 60 ms): sing.py bắt âm tiết sai, nguyên âm dò được ngắn, hát bị đứt.

Chỉ làm cho câu hát (có "sing"). Ghi voice/phones.json: {id: {"key": lời|giọng|tốc độ|pitch, "ph": [[âm vị, t0, t1], ...]}}
(giây, theo file giọng của bản nói: voice/<id>.wav trước sing.py, sau đó là voice/spoken/<id>.wav). Thiếu gói onnx hoặc mô hình khác:
in ghi chú và bỏ qua; sing.py khi đó dò âm tiết theo mốc từ của Whisper như trước.
"""
import sys, os, json
import numpy as np, soundfile as sf

LIB = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
NODE = '/encoder/Clip_output_0'


def phone_key(L):
    return f"{L['text']}|{L.get('voice')}|{L.get('speed')}|{L.get('pitch')}"


VOWELS = set('aeiouæɑɐɒɔəɘɚɛɜɝɞɨɪʉʊʌʏøœɤɯᵻᵊ')
STRESS = set('ˈˌ')
SONOR = set('lnmŋɹjwɫɾvðzʒ')                  # có thanh (để đoán: chỗ này phải có thanh)


def refine(ph, y, sr):
    """Kokoro đặt mốc theo khung dự đoán; tiếng thật lệch 0–80 ms (thường sớm hơn) và lệch khác nhau dọc câu. Mỗi nguyên âm dời
    δ ∈ [−100, +40] ms để chỗ nguyên âm có thanh và to, chỗ phụ âm câm / khoảng lặng thì không; δ kéo về trung vị của câu và đổi chậm
    giữa hai nguyên âm liền nhau (mốc vẫn tăng dần). Mọi mốc dời theo δ nội suy giữa tâm các nguyên âm. Trả về (mốc mới, δ từng nhân)."""
    import parselmouth as pm
    snd = pm.Sound(y, sr)
    it = snd.to_intensity(minimum_pitch=75, time_step=.005); ti, I = it.xs(), it.values[0]
    p = snd.to_pitch_ac(time_step=.005, pitch_floor=60, pitch_ceiling=700); tp, f0 = p.xs(), p.selected_array['frequency']
    vo = np.interp(ti, tp, (f0 > 0).astype(float)) > .5 if len(tp) else np.zeros(len(ti), bool)
    loud = I.max()
    s_vow = vo * np.clip((I - (loud - 25)) / 10, 0, 1)                  # 1: có thanh và to (nguyên âm)
    s_quiet = np.clip(((loud - 18) - I) / 12, 0, 1) * (~vo) + .5 * (~vo) * (I < loud - 12)   # 1: câm / không thanh
    def mean_over(sig, a, b):
        sel = (ti >= a) & (ti < b)
        return float(sig[sel].mean()) if sel.any() else 0.
    nucs = []; i = 0
    while i < len(ph):
        if ph[i][0] in VOWELS or (ph[i][0] in STRESS and i + 1 < len(ph) and ph[i + 1][0] in VOWELS):
            j = i
            while j + 1 < len(ph) and (ph[j + 1][0] in VOWELS or ph[j + 1][0] == 'ː'): j += 1
            nucs.append((i, j)); i = j + 1
        else: i += 1
    if not nucs: return ph, []
    DL = np.arange(-.100, .0401, .005)
    def score(i, j, d):
        a, b = ph[i][1] + d, ph[j][2] + d
        sc = mean_over(s_vow, a, b)
        for q in (i - 1, j + 1):                                       # phụ âm câm / dấu câu hai bên phải câm
            if 0 <= q < len(ph) and ph[q][2] > ph[q][1] and (ph[q][0] not in VOWELS) and (ph[q][0] not in SONOR) and ph[q][0] not in STRESS:
                sc += .5 * mean_over(s_quiet, ph[q][1] + d, ph[q][2] + d)
        return sc
    tab = [[score(i, j, d) for d in DL] for i, j in nucs]
    raw = [float(DL[int(np.argmax(r))]) for r in tab]; med = float(np.median(raw))
    ds = []
    for r in tab:                                                      # kéo về trung vị: 0,15 điểm cho mỗi 50 ms
        ds.append(float(DL[int(np.argmax([x - .15 * abs(d - med) / .05 for x, d in zip(r, DL)]))]))
    cen = [(ph[i][1] + ph[j][2]) / 2 for i, j in nucs]
    for k in range(1, len(ds)):                                        # δ đổi chậm: mốc vẫn tăng dần
        lim = .6 * (cen[k] - cen[k - 1]); ds[k] = float(np.clip(ds[k], ds[k - 1] - lim, ds[k - 1] + lim))
    dur = len(y) / sr
    sh = lambda t: min(dur, max(0., t + float(np.interp(t, cen, ds))))
    return [[q[0], round(sh(q[1]), 4), round(sh(q[2]), 4)] for q in ph], [round(d * 1000) for d in ds]


def session():
    try:
        import onnx, onnxruntime as ort
        from kokoro_onnx import Kokoro
    except ImportError as e:
        print(f'phones.py: {e.name} is missing (.venv python -m pip install onnx): no phoneme timings, sing.py uses Whisper word timings')
        return None
    mp, vp = os.path.join(LIB, 'core', 'tts', 'kokoro-v1.0.onnx'), os.path.join(LIB, 'core', 'tts', 'voices-v1.0.bin')
    m = onnx.load(mp)
    if not any(NODE in n.output for n in m.graph.node):
        print(f'phones.py: {os.path.basename(mp)} has no {NODE}: no phoneme timings'); return None
    m.graph.node.append(onnx.helper.make_node('Identity', [NODE], ['duration'], name='expose_duration'))
    m.graph.output.append(onnx.helper.make_tensor_value_info('duration', onnx.TensorProto.FLOAT, None))
    s = ort.InferenceSession(m.SerializeToString(), providers=['CPUExecutionProvider']); s._model_path = mp
    k = Kokoro.from_session(s, vp)
    return k if k.has_timings else None


def main():
    lines_p, d = sys.argv[1], sys.argv[2]
    lines = [L for L in json.load(open(lines_p, encoding='utf-8')) if L.get('sing') and not L.get('lang', 'en-us').startswith(('cmn', 'zh', 'ja'))]
    out_p = os.path.join(d, 'phones.json'); out = json.load(open(out_p, encoding='utf-8')) if os.path.exists(out_p) else {}
    todo = [L for L in lines if (out.get(L['id']) or {}).get('key') != phone_key(L)]
    if not todo: print(f'phones.py: {len(lines)} sung lines, timings up to date'); return
    k = session()
    if k is None: return
    for L in todo:
        f = os.path.join(d, L['id'] + '.wav')
        if not os.path.exists(f): continue
        a, sr, T = k.create_timed(L['text'], voice=L['voice'], speed=L.get('speed', .92), lang=L.get('lang', 'en-us'), sentence_pause=0, clause_pause=0)
        nz = np.where(np.abs(a) > (np.abs(a).max() if len(a) else 0) * .02)[0]
        if not len(nz): continue
        off = max(0, nz[0] - int(.03 * sr)); a = a[off: nz[-1] + int(.08 * sr)]   # đúng như core/tts/tts.py
        y, sr2 = sf.read(f)
        if y.ndim > 1: y = y.mean(1)
        st = L.get('pitch') or 0; r = 2 ** (-st / 12) if st else 1.0
        # cùng độ dài (độ dài âm vị của Kokoro là tất định) và cùng dạng sóng (tương quan > 0,99: bản đã dựng có thể lệch vài phần nghìn)
        n_ = min(len(y), len(a))
        ok = abs(len(y) - len(a) * r) <= 2 + .002 * len(a) and (st or float(np.corrcoef(y[:n_], a[:n_])[0, 1]) > .99)
        if not ok:
            print(f"phones.py: {L['id']} the voice file does not match a fresh Kokoro take ({len(y)} vs {len(a)} samples): skipped, sing.py uses Whisper"); out.pop(L['id'], None); continue
        r *= len(y) / max(1.0, len(a) * r) if st else 1.0
        dur = len(y) / sr2
        ph = [[t.phoneme, round(min(dur, max(0., (t.start - off / sr) * r)), 4), round(min(dur, max(0., (t.end - off / sr) * r)), 4)] for t in T]
        ph, ds = refine(ph, y, sr2)
        out[L['id']] = {'key': phone_key(L), 'ph': ph, 'shift_ms': ds}
        print(L['id'], len(ph), 'phonemes', ''.join(p[0] for p in ph), '· shift', ds, 'ms')
    json.dump(out, open(out_p, 'w', encoding='utf-8'), indent=0, ensure_ascii=False)


if __name__ == '__main__':
    main()
