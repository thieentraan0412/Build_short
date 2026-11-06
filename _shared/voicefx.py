"""Hậu kỳ giọng dùng chung: nâng cao độ cho các câu có trường "pitch" (nửa cung) trong voice/lines.json, sau core/tts/tts.py.
python _shared/voicefx.py <film>/voice/lines.json <film>/voice
Cách làm: lấy mẫu lại (soxr) nên cao độ, âm sắc (formant) và tốc độ cùng tăng: giọng nghe nhỏ và trẻ hơn, nói nhanh hơn
(+4 nửa cung ≈ nhanh hơn 26%). Dùng cho Crumb (kiến con). Ghi đè <id>.wav và cập nhật dur.json. Chạy lại an toàn: mỗi câu
được đánh dấu trong voice/fx.json theo (văn bản, giọng, tốc độ, pitch) và kích thước file, nên câu đã nâng không bị nâng lần nữa."""
import sys, os, json
import soundfile as sf, soxr
lines, d = json.load(open(sys.argv[1], encoding='utf-8')), sys.argv[2]
dur = json.load(open(os.path.join(d, 'dur.json'), encoding='utf-8'))
mark_p = os.path.join(d, 'fx.json'); mark = json.load(open(mark_p, encoding='utf-8')) if os.path.exists(mark_p) else {}
for L in lines:
    st = L.get('pitch')
    if not st: continue
    f = os.path.join(d, L['id'] + '.wav'); key = f"{L['text']}|{L.get('voice')}|{L.get('speed')}|{st}"
    if mark.get(L['id'], {}).get('key') == key and mark[L['id']].get('size') == os.path.getsize(f): continue   # đã nâng rồi
    y, sr = sf.read(f); y = soxr.resample(y, sr, int(round(sr / 2 ** (st / 12)))); sf.write(f, y, sr)
    dur[L['id']] = round(len(y) / sr, 3); mark[L['id']] = {'key': key, 'size': os.path.getsize(f)}
    print(L['id'], f'+{st} st', dur[L['id']], L['text'])
json.dump(dur, open(os.path.join(d, 'dur.json'), 'w', encoding='utf-8'), indent=1)
json.dump(mark, open(mark_p, 'w', encoding='utf-8'), indent=1)
