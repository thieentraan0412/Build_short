#!/bin/sh
# Dựng lại toàn bộ phim bằng một lệnh: sh films/bi-mat-ti-hon/build.sh
# Giọng đọc lấy từ cache voice/.cache (không cần mạng nếu lời thoại không đổi; đổi lời thì cần mạng cho edge-tts).
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$(cd "$HERE/../.." && pwd)}          # clone mode: <repo>/films/<name>/
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the library folder"; exit 1; }
PY="$LIB/.venv/bin/python"; [ -x "$PY" ] || PY="$LIB/.venv/Scripts/python.exe"   # macOS/Linux · Windows
export PYTHONIOENCODING=utf-8
cd "$LIB"
node "$HERE/tools/lines.mjs"                                                     # timeline.js → JSON
"$PY" core/tts/tts_zh.py "$HERE/voice/lines.json" "$HERE/voice" --voice en-US-EmmaNeural
WHISPER_MODEL=small.en "$PY" core/tts/asr_check.py "$HERE/voice/lines.json" "$HERE/voice" --lang en
"$PY" "$HERE/tools/env.py"                                                       # khẩu hình
node core/render/events.mjs "$HERE" --size 1080x1920
node core/render/readcheck.mjs "$HERE" --size 1080x1920
node core/render/video.mjs "$HERE" --fps 24 --workers 4 --size 1080x1920 --out "$HERE/out/video.mp4"
"$PY" "$HERE/mix.py"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/tiny-secrets.mp4" 24 0
"$PY" core/render/srt.py "$HERE/cards.json" "$HERE/tiny-secrets.srt"
ffmpeg -v error -y -ss 1.7 -i "$HERE/tiny-secrets.mp4" -frames:v 1 -q:v 2 "$HERE/poster.jpg"
echo "done: $HERE/tiny-secrets.mp4"
