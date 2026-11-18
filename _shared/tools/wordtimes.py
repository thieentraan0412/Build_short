"""Mốc từng từ thật của câu NÓI → voice/words.js (Vocal QC 18/11/2026, _shared/QUALITY.md §9: phụ đề khớp lời thực tế).
python _shared/tools/wordtimes.py films/<tập>

Đọc voice/lines.json và voice/words.json (Whisper small.en trên bản nói cuối, đã qua voicefx; do core/tts/asr_check.py ghi).
Ghi voice/words.js: export default { L05: [[bắt đầu, kết thúc], …] } (giây tính từ đầu câu, một cặp cho mỗi từ của lời).
timeline.js đọc file này và đưa vào cardsOf(…, { times }), nên chữ phụ đề của câu nói hiện đúng lúc nhân vật nói từ đó, không chia
đều theo âm tiết. Câu hát không cần (chữ hiện theo nốt). Câu mà Whisper tách / gộp từ khác lời thì bỏ qua (giữ cách chia âm tiết).
Chạy sau asr_check.py; rồi chạy lại tools/lines.mjs để cards.json và .srt dùng mốc mới.
"""
import sys, os, json, re
film = os.path.abspath(sys.argv[1]); vd = os.path.join(film, 'voice')
lines = json.load(open(os.path.join(vd, 'lines.json'), encoding='utf-8'))
W = json.load(open(os.path.join(vd, 'words.json'), encoding='utf-8')) if os.path.exists(os.path.join(vd, 'words.json')) else {}
TL = json.load(open(os.path.join(film, 'timeline.json'), encoding='utf-8'))
text = {l['id']: l['text'] for l in TL['lines']}
words_of = lambda s: [w for w in s.split() if re.search(r'[A-Za-z0-9]', w)]
out, skip = {}, []
for L in lines:
    if L.get('sing') or L['id'] not in W: continue
    ws = words_of(text.get(L['id'], L['text'])); hw = W[L['id']]
    if len(hw) != len(ws): skip.append(L['id']); continue
    t, prev = [], 0.
    for _, a, b in hw:
        a = max(prev, float(a), 0.); b = max(a + .05, float(b)); t.append([round(a, 3), round(b, 3)]); prev = a
    out[L['id']] = t
open(os.path.join(vd, 'words.js'), 'w', encoding='utf-8').write(
    '// Sinh tự động bởi _shared/tools/wordtimes.py: mốc từng từ thật của câu nói (giây từ đầu câu), cho phụ đề (song.js cardsOf times).\n'
    'export default ' + json.dumps(out, ensure_ascii=False) + ';\n')
print(f'voice/words.js {len(out)} câu nói' + (f' · bỏ qua (số từ khác lời): {", ".join(skip)}' if skip else ''))
