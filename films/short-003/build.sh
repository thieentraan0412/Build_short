#!/bin/sh
# Dựng lại toàn bộ SHORT-003 bằng một lệnh, chạy từ bất kỳ đâu: sh films/short-003/build.sh
# Giọng: Kokoro (offline, core/tts/tts.py), giọng và tốc độ từng nhân vật trong _shared/voices.js.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$(cd "$HERE/../.." && pwd)}          # clone mode: <repo>/films/<name>/
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the library folder"; exit 1; }
PY="$LIB/.venv/bin/python"; [ -x "$PY" ] || PY="$LIB/.venv/Scripts/python.exe"   # macOS/Linux · Windows
export PYTHONIOENCODING=utf-8
cd "$LIB"
node "$HERE/tools/lines.mjs"                                                     # timeline.js → JSON
"$PY" core/tts/tts.py "$HERE/voice/lines.json" "$HERE/voice"
WHISPER_MODEL=small.en "$PY" core/tts/asr_check.py "$HERE/voice/lines.json" "$HERE/voice" --lang en
WHISPER_MODEL=base.en "$PY" core/tts/asr_check.py "$HERE/voice/lines.json" "$HERE/voice" --lang en    # câu ngắn: kiểm bằng hai model
"$PY" "$HERE/tools/env.py"                                                       # khẩu hình
node core/render/events.mjs "$HERE" --size 1080x1920
node core/render/readcheck.mjs "$HERE" --size 1080x1920
node core/render/video.mjs "$HERE" --fps 30 --workers 4 --size 1080x1920 --out "$HERE/out/video.mp4"
"$PY" "$HERE/mix.py"
"$PY" _shared/tools/soundplan.py "$HERE"                                    # bảng Sound Design Plan → SOUND-PLAN.md (QUALITY.md §4)
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/short-003.mp4" 30 0
"$PY" core/render/srt.py "$HERE/cards.json" "$HERE/short-003.srt"
ffmpeg -v error -y -ss 0 -i "$HERE/short-003.mp4" -frames:v 1 -q:v 2 "$HERE/poster.jpg"
# ảnh bìa riêng (poster.js): Shorts 9:16 và thumbnail YouTube 16:9
node core/render/still.mjs "$HERE" 0 --q mode=poster --size 1080x1920 --out "$HERE/out/cover" --prefix poster_ && cp "$HERE/out/cover/poster_0.jpg" "$HERE/poster-shorts-9x16.jpg"
node core/render/still.mjs "$HERE" 0 --q mode=thumb --size 1920x1080 --out "$HERE/out/cover" --prefix thumb_ && cp "$HERE/out/cover/thumb_0.jpg" "$HERE/thumbnail-16x9.jpg"
"$PY" _shared/qa.py "$HERE" --json || echo "qa: còn mục CHƯA ĐẠT, xem bảng trên và _shared/QUALITY.md"   # bộ tiêu chí của kênh
echo "done: $HERE/short-003.mp4"
