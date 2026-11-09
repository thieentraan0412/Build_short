#!/bin/sh
# Dựng lại toàn bộ LONG-001 bằng một lệnh, chạy từ bất kỳ đâu: sh films/long-001/build.sh
# Video dài 16:9 (1920×1080, 30 fps). Giọng: Kokoro (offline, core/tts/tts.py), giọng và tốc độ từng nhân vật trong _shared/voices.js.
# Chép từ films/short-004/build.sh (voicefx, Whisper hai model, qa.py ở cuối), đổi khung sang 1920x1080.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$(cd "$HERE/../.." && pwd)}          # clone mode: <repo>/films/<name>/
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the library folder"; exit 1; }
PY="$LIB/.venv/bin/python"; [ -x "$PY" ] || PY="$LIB/.venv/Scripts/python.exe"   # macOS/Linux · Windows
export PYTHONIOENCODING=utf-8
cd "$LIB"
node "$HERE/tools/lines.mjs"                                                     # timeline.js → JSON (lần 1: ước lượng)
"$PY" core/tts/tts.py "$HERE/voice/lines.json" "$HERE/voice"
"$PY" _shared/voicefx.py "$HERE/voice/lines.json" "$HERE/voice"                 # Crumb, Dot, Blink: nâng cao độ (voices.js: pitch)
node "$HERE/tools/lines.mjs"                                                     # lần 2: kịch bản "chảy" theo độ dài giọng thật
WHISPER_MODEL=small.en "$PY" core/tts/asr_check.py "$HERE/voice/lines.json" "$HERE/voice" --lang en || echo "asr small.en: còn câu lệch, xem MUSIC/SOUND/README của tập (đồng âm, tên riêng, từ tượng thanh)"
WHISPER_MODEL=base.en "$PY" core/tts/asr_check.py "$HERE/voice/lines.json" "$HERE/voice" --lang en || echo "asr base.en: còn câu lệch"
"$PY" "$HERE/tools/env.py"                                                       # khẩu hình
node core/render/events.mjs "$HERE" --size 1920x1080
node core/render/readcheck.mjs "$HERE" --size 1920x1080
node core/render/video.mjs "$HERE" --fps 30 --workers 4 --size 1920x1080 --out "$HERE/out/video.mp4"
"$PY" "$HERE/mix.py"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/long-001.mp4" 30 0
"$PY" core/render/srt.py "$HERE/cards.json" "$HERE/long-001.srt"
node core/render/still.mjs "$HERE" 0 --q mode=thumb --size 1920x1080 --out "$HERE/out/cover" --prefix thumb_ && cp "$HERE/out/cover/thumb_0.jpg" "$HERE/thumbnail-16x9.jpg"
node core/render/still.mjs "$HERE" 0 --q mode=poster --size 1080x1920 --out "$HERE/out/cover" --prefix poster_ && cp "$HERE/out/cover/poster_0.jpg" "$HERE/poster-9x16.jpg"
ffmpeg -v error -y -ss 1.9 -i "$HERE/long-001.mp4" -frames:v 1 -q:v 2 "$HERE/poster.jpg"
"$PY" _shared/qa.py "$HERE" --json || echo "qa: còn mục CHƯA ĐẠT, xem bảng trên và _shared/QUALITY.md"   # bộ tiêu chí của kênh
echo "done: $HERE/long-001.mp4"
