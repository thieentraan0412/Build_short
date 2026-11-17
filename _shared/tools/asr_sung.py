"""Kiểm lời hát còn nghe rõ không (Musical Storytelling, _shared/QUALITY.md §8).
python _shared/tools/asr_sung.py <film>/voice/lines.json <film>/voice [--model small.en]

Chạy sau _shared/sing.py. Chỉ kiểm câu có "sing" trong lines.json. Bản nói đã qua bước kiểm khớp từng chữ
(core/tts/asr_check.py); câu hát được phép lệch một chút, nên ở đây đo tỉ lệ lỗi từ (WER, khoảng cách Levenshtein trên các từ đã
chuẩn hoá như asr_check) và bắt buộc mọi từ khoá phải nghe đúng:
  - sing-talk, half-sing và điệp khúc (sing.chorus): WER ≤ 0,15
  - sing (không phải điệp khúc): WER ≤ 0,25
  - từ khoá: trường "kw" của câu (từ được nhấn trên phụ đề và từ khoá của bí mật), không phân biệt số ít / số nhiều
Không đưa lời vào initial_prompt của Whisper (sẽ làm bài kiểm dễ hơn thật).
Ghi voice/words.sung.json (mốc từng từ của bản hát, cho khẩu hình và phụ đề) và voice/asr-sung.json; không đụng words.json
(đó là đầu vào của sing.py). Thoát 1 nếu có câu không đạt: hạ kiểu hát của câu (sing → half-sing → sing-talk) hoặc đổi lời.
Không sửa core/: dùng lại hàm của core/tts/asr_check.py.
"""
import sys, os, json, argparse
LIB = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'core', 'tts'))
from asr_check import norm_en, load_model   # noqa: E402

LIMIT = {'sing-talk': .15, 'half-sing': .15, 'sing': .25}


def wer(a, b):
    d = list(range(len(b) + 1))
    for i, x in enumerate(a, 1):
        p, d[0] = d[0], i
        for j, y in enumerate(b, 1):
            p, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, p + (x != y))
    return d[len(b)] / max(1, len(a))


def stem(w): return w[:-1] if len(w) > 3 and w.endswith('s') else w


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('lines'); ap.add_argument('voices_dir'); ap.add_argument('--model', default=os.environ.get('WHISPER_MODEL', 'small.en'))
    a = ap.parse_args()
    lines = [L for L in json.load(open(a.lines, encoding='utf-8')) if L.get('sing')]
    if not lines: print('asr_sung.py: no sung lines'); return
    import numpy as np, soundfile as sf, soxr
    m = load_model(a.model); words, rep, bad = {}, {}, []
    for L in lines:
        y, sr = sf.read(os.path.join(a.voices_dir, L['id'] + '.wav'))
        if y.ndim > 1: y = y.mean(1)
        y = soxr.resample(y, sr, 16000, quality='HQ'); pad = np.zeros(int(.6 * 16000))
        segs, _ = m.transcribe(np.concatenate([pad, y, pad]).astype(np.float32), beam_size=5, language='en', word_timestamps=True)
        tail = (len(y) + len(pad)) / 16000 - .5
        segs = [s for s in segs if not (s.no_speech_prob > .5 and s.start > tail)]
        got = ' '.join(s.text.strip() for s in segs)
        words[L['id']] = [(w.word.strip(), round(w.start - .6, 3), round(w.end - .6, 3)) for s in segs for w in s.words]
        want = norm_en(L.get('asr', L['text'])); heard = norm_en(got)
        mode = L['sing']['mode']; lim = .15 if L['sing'].get('chorus') else LIMIT[mode]
        e = wer(want, heard); hs = {stem(w) for w in heard}
        miss = [k for k in (L.get('kw') or []) if not all(stem(w) in hs for w in norm_en(k))]
        ok = e <= lim and not miss
        if not ok: bad.append(L['id'])
        rep[L['id']] = dict(mode=mode, chorus=bool(L['sing'].get('chorus')), want=L.get('asr', L['text']), heard=got, wer=round(e, 3), limit=lim, missing_kw=miss, ok=ok)
        print(('OK  ' if ok else 'DIFF'), L['id'], f'{mode:<9} WER {e:.2f} (≤ {lim})', '|', L.get('asr', L['text']), '→', got, f'  missing keywords: {miss}' if miss else '')
    json.dump(words, open(os.path.join(a.voices_dir, 'words.sung.json'), 'w', encoding='utf-8'), indent=0, ensure_ascii=False)
    json.dump(rep, open(os.path.join(a.voices_dir, 'asr-sung.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    print('sung lines not clear enough:', len(bad), f'(model={a.model})')
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
