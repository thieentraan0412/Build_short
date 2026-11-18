#!/bin/sh
# Dựng lại toàn bộ tập bằng một lệnh, chạy từ bất kỳ đâu: sh films/<tập>/build.sh   (chuẩn 11/2026b: _shared/template/build.sh)
# Giọng: Kokoro (offline, core/tts/tts.py), giọng và tốc độ từng nhân vật trong _shared/voices.js.
# (19/11/2026, QUALITY.md §8.3) Không ai hát: mọi câu là giọng TTS gốc, câu theo phách (tune) vào đúng phách của bài, bài hát ở nhạc nền.
# Miss Loupe luôn như SHORT-015 (§9.10). Cuối cùng _shared/qa.py chạy cả nhóm "Chuẩn mới" (timeline.json có standard).
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
NAME=$(basename "$HERE")
LIB=${LIB:-$(cd "$HERE/../.." && pwd)}          # clone mode: <repo>/films/<name>/
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the library folder"; exit 1; }
PY="$LIB/.venv/bin/python"; [ -x "$PY" ] || PY="$LIB/.venv/Scripts/python.exe"   # macOS/Linux · Windows
export PYTHONIOENCODING=utf-8
cd "$LIB"
node "$HERE/tools/lines.mjs"                                                     # timeline.js (song.js đã giải câu theo phách) → JSON, quỹ thời gian
# (Vocal QC 18/11/2026) giọng chỉ tạo lại cho câu đã đổi: tts → voicefx → Whisper base.en + small.en (+ emote.py cho câu có emo)
# trong voice/_regen/, đạt hết mới gộp về voice/ (một câu lỗi chỉ tạo lại đúng câu đó). Ép tạo lại: --force L04 · cả tập: --all
"$PY" _shared/tools/voice_regen.py "$HERE"
"$PY" "$HERE/tools/env.py"                                                       # khẩu hình (theo bản giọng cuối)
"$PY" _shared/tools/wordtimes.py "$HERE" && node "$HERE/tools/lines.mjs"           # phụ đề theo mốc từ thật (voice/words.js); câu theo phách lấy độ dài thật (voice/dur.js)
node core/render/events.mjs "$HERE" --size 1080x1920
node core/render/readcheck.mjs "$HERE" --size 1080x1920
node core/render/video.mjs "$HERE" --fps 30 --workers 2 --size 1080x1920 --out "$HERE/out/video.mp4"
"$PY" "$HERE/mix.py"
"$PY" _shared/tools/av_sync.py "$HERE"                                       # (18/11/2026) tiếng động có khớp hành động trên video không (out/av-sync.json)
"$PY" _shared/tools/soundplan.py "$HERE"                                    # SOUND-PLAN.md: Sound Design Plan + Music Timeline, Sing-along, SFX timeline, AI prompts
"$PY" _shared/tools/vocal_qc.py "$HERE"                                      # Vocal & Musical QC (A–G): VOCAL-QC.md, out/vocal-qc.json (qa.py nhóm 9)
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/$NAME.mp4" 30 0
"$PY" core/render/srt.py "$HERE/cards.json" "$HERE/$NAME.srt"
ffmpeg -v error -y -ss 0.3 -i "$HERE/$NAME.mp4" -frames:v 1 -q:v 2 "$HERE/poster.jpg"
# ảnh bìa riêng (poster.js): Shorts 9:16 và thumbnail YouTube 16:9
node core/render/still.mjs "$HERE" 0 --q mode=poster --size 1080x1920 --out "$HERE/out/cover" --prefix poster_ && cp "$HERE/out/cover/poster_0.jpg" "$HERE/poster-shorts-9x16.jpg"
node core/render/still.mjs "$HERE" 0 --q mode=thumb --size 1920x1080 --out "$HERE/out/cover" --prefix thumb_ && cp "$HERE/out/cover/thumb_0.jpg" "$HERE/thumbnail-16x9.jpg"
"$PY" _shared/qa.py "$HERE" --json || echo "qa: còn mục CHƯA ĐẠT, xem bảng trên và _shared/QUALITY.md"   # bộ tiêu chí của kênh (gồm nhóm 8 Chuẩn mới)
echo "done: $HERE/$NAME.mp4"
