"""Cảm xúc và nhấn nhá cho câu NÓI (Lớp 1 – Voice của thiết kế âm thanh theo cảnh, Task.md 18/11/2026, _shared/QUALITY.md §10).
python _shared/emote.py <lines.json> <voice_dir>

Giọng Kokoro không có điều khiển cảm xúc. Ở đây uốn ngữ điệu bằng PSOLA của Praat (parselmouth, như _shared/sing.py):
giữ formant nên giữ nguyên chất giọng của nhân vật, chỉ đổi đường cao độ, nhịp từng từ và độ to từ nhấn.
Chỉ đụng câu nói có trường "emo" trong lines.json (tools/lines.mjs ghi từ timeline.js), dùng mốc từ của voice/words.json.

Cảm xúc (EMO): happy · surprised · curious · excited · startled ("giật mình vui", thay cho "sợ hãi": kênh luôn vui tươi) ·
calm (giải thích) · proud · playful (câu cửa miệng). Mỗi cảm xúc:
  range  : nới / co dải cao độ quanh trung vị câu (×)
  shift  : nâng cả câu (nửa cung)
  first  : đẩy từ đầu (nửa cung, ngạc nhiên / giật mình) · tail: đuôi câu đi lên (nửa cung, câu hỏi tò mò)
  em     : đỉnh cao độ của từ nhấn (nửa cung, "kw" của câu = từ được nhấn trên phụ đề), kèm dài thêm EM_LEN và to thêm EM_DB
Độ mạnh nhân theo nhân vật (EMO_RANGE trong _shared/voices.js qua lines.json "emo_k"): Albie giữ dải hẹp, lịch sự.
Câu cửa miệng ("catch": true) không đổi nhịp (giữ đúng tốc độ của kênh), chỉ đổi cao độ.
Tổng độ dài câu giữ nguyên (từ nhấn dài ra thì phần còn lại co lại tương ứng), nên t, dur trong timeline.js không đổi.
Ghi đè <id>.wav; ghi voice/emote.json (số đo trước / sau: dải cao độ p10–p90, từ nhấn). Bản trước khi uốn: voice/plain/<id>.wav.
"""
import sys, os, json, re, shutil
import numpy as np, soundfile as sf

EMO = {   # range, shift, first, tail, em
    'happy':     dict(range=1.12, shift=.5, first=0., tail=0., em=2.),
    'excited':   dict(range=1.25, shift=1., first=1., tail=0., em=2.5),
    'surprised': dict(range=1.3, shift=.8, first=3., tail=0., em=2.5),
    'curious':   dict(range=1.15, shift=.3, first=0., tail=4., em=2.),
    'startled':  dict(range=1.3, shift=1.2, first=5., tail=0., em=2.),
    'calm':      dict(range=.92, shift=0., first=0., tail=0., em=1.5),
    'proud':     dict(range=1.1, shift=.3, first=0., tail=0., em=2.),
    'playful':   dict(range=1.25, shift=.6, first=1.5, tail=0., em=1.5),
}
EM_LEN, EM_DB = 1.12, 2.
VERSION = 1
# độ to của cả câu theo cảm xúc (mix.py cộng vào sau khi cân độ to từng câu; vocal_qc.py trừ ra khi so độ nhất quán): giải thích nhẹ hơn,
# hào hứng / ngạc nhiên to hơn; điệp khúc (câu hát có chorus) thêm CHORUS_DB
EMO_DB = {'calm': -2.5, 'curious': -.5, 'happy': 0., 'proud': .5, 'playful': 1., 'excited': 1.5, 'surprised': 1.5, 'startled': 2.}
CHORUS_DB = 1.5


def accent(y, sr, spans, db=EM_DB):
    """Tăng độ to (db) theo cửa sổ cos² trên các khoảng [a, b] giây (từ nhấn). Dùng cho câu nói (ở đây) và câu hát (mix.py)."""
    g = np.ones(len(y))
    for a, b in spans:
        s0, s1 = int(max(0, a - .02) * sr), int(min(len(y) / sr, b + .03) * sr)
        if s1 - s0 < 8: continue
        u = np.linspace(0, 1, s1 - s0); g[s0:s1] = np.maximum(g[s0:s1], 1 + (10 ** (db / 20) - 1) * np.sin(np.pi * u) ** 2)
    return y * g


def prange(snd, floor, ceil):
    F = snd.to_pitch_ac(time_step=.01, pitch_floor=floor, pitch_ceiling=ceil).selected_array['frequency']; F = F[F > 0]
    if len(F) < 5: return 0., 0.
    med = np.median(F); F = F[np.abs(12 * np.log2(F / med)) < 9]                 # bỏ khung dò nhầm quãng tám
    return float(12 * np.log2(np.percentile(F, 90) / np.percentile(F, 10))), float(med)


def emote_line(L, y, sr, words, P):
    import parselmouth
    from parselmouth.praat import call
    snd = parselmouth.Sound(y, sr); T = len(y) / sr
    hz0 = 440 * 2 ** ((P['home'] - 69) / 12) if P.get('home') else None
    floor, ceil = (max(55, hz0 / 2.2), min(800, hz0 * 2.6)) if hz0 else (60, 700)
    before, med = prange(snd, floor, ceil)
    if med <= 0: return y, dict(skipped='no pitch')
    E = EMO[L['emo']]; k = float(L.get('emo_k', 1.))
    rng_ = 1 + (E['range'] - 1) * k; sh, fi, ta, em = E['shift'] * k, E['first'] * k, E['tail'] * k, E['em'] * k
    ws = [(w, max(0., a), min(T, b)) for w, a, b in words if b > 0]
    kw = {re.sub(r"[^a-z']", '', x.lower()) for x in (L.get('kw') or [])}
    emw = [(a, b) for w, a, b in ws if re.sub(r"[^a-z']", '', w.lower()) in kw and b - a > .05]
    first = ws[0] if ws else None; last = ws[-1] if ws else None
    def bump(t, a, b, amp):
        if b <= a or t < a or t > b: return 0.
        return amp * np.sin(np.pi * (t - a) / (b - a))
    def shift_at(t):
        s = sh
        if first and fi: s += bump(t, first[1] - .03, first[2] + .05, fi)
        if last and ta and t >= last[1]: s += ta * min(1., (t - last[1]) / max(.08, last[2] - last[1]))
        for a, b in emw: s += bump(t, a - .02, b + .02, em)
        return s
    man = call(snd, 'To Manipulation', .01, floor, ceil)
    pt = call(man, 'Extract pitch tier'); n = call(pt, 'Get number of points')
    pts = [(call(pt, 'Get time from index', i), call(pt, 'Get value at index', i)) for i in range(1, n + 1)]
    call(pt, 'Remove points between', 0, T)
    for t, f in pts:
        st = 12 * np.log2(f / med) * rng_ + shift_at(t)
        call(pt, 'Add point', t, med * 2 ** (st / 12))
    call([pt, man], 'Replace pitch tier')
    if emw and not L.get('catch'):                                                 # từ nhấn dài thêm, phần còn lại co lại: tổng độ dài giữ nguyên
        lem = sum(b - a for a, b in emw); c = (T - EM_LEN * lem) / max(.05, T - lem)
        if c >= .88:
            dt = call(man, 'Extract duration tier'); call(dt, 'Remove points between', 0, T)
            edges = sorted({0., T} | {x for a, b in emw for x in (a, b)})
            for a, b in zip(edges, edges[1:]):
                f_ = EM_LEN if any(abs(a - x) < 1e-6 and abs(b - z) < 1e-6 for x, z in emw) else c
                call(dt, 'Add point', a + .001, f_); call(dt, 'Add point', b - .001, f_)
            call([dt, man], 'Replace duration tier')
            # mốc từ nhấn sau khi giãn (để tăng độ to đúng chỗ)
            def warp(t):
                out = 0.; prev = 0.
                for a, b in zip(edges, edges[1:]):
                    f_ = EM_LEN if any(abs(a - x) < 1e-6 and abs(b - z) < 1e-6 for x, z in emw) else c
                    if t <= b: return out + (t - a) * f_
                    out += (b - a) * f_
                return out
            emw = [(warp(a), warp(b)) for a, b in emw]
    out = call(man, 'Get resynthesis (overlap-add)').values[0]
    out = np.asarray(out, float)
    if len(out) > len(y): out = out[:len(y)]
    elif len(out) < len(y): out = np.pad(out, (0, len(y) - len(out)))
    out = accent(out, sr, emw, EM_DB * min(1., k + .2))
    pk = float(np.abs(out).max()) if len(out) else 0.
    if pk > .97: out *= .97 / pk
    after, _ = prange(parselmouth.Sound(out, sr), floor, ceil)
    return out, dict(emo=L['emo'], k=k, range_before=round(before, 1), range_after=round(after, 1), median_hz=round(med, 1), em_words=len(emw), version=VERSION)


def main():
    lines_p, d = sys.argv[1], sys.argv[2]
    lines = json.load(open(lines_p, encoding='utf-8'))
    words = json.load(open(os.path.join(d, 'words.json'), encoding='utf-8')) if os.path.exists(os.path.join(d, 'words.json')) else {}
    stats_p = os.path.join(d, 'emote.json'); stats = json.load(open(stats_p, encoding='utf-8')) if os.path.exists(stats_p) else {}
    os.makedirs(os.path.join(d, 'plain'), exist_ok=True); n = 0
    for L in lines:
        if L.get('sing') or not L.get('emo'): continue
        if L['emo'] not in EMO: sys.exit(f"emote.py: {L['id']}: unknown emo '{L['emo']}' ({', '.join(EMO)})")
        f = os.path.join(d, L['id'] + '.wav'); y, sr = sf.read(f)
        if y.ndim > 1: y = y.mean(1)
        shutil.copyfile(f, os.path.join(d, 'plain', L['id'] + '.wav'))
        out, info = emote_line(L, y, sr, words.get(L['id'], []), L)
        sf.write(f, out, sr); stats[L['id']] = info; n += 1
        print(L['id'], f"{L['emo']:<9}", f"range {info.get('range_before')} → {info.get('range_after')} st", f"· {info.get('em_words', 0)} từ nhấn |", L['text'])
    json.dump(stats, open(stats_p, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    print(f'emote.py: {n} spoken lines')


if __name__ == '__main__':
    main()
