#!/bin/sh
# Dựng lại toàn bộ tập bằng một lệnh, chạy từ bất kỳ đâu: sh films/<tập>/build.sh   (chuẩn 11/2026b: _shared/template/build.sh)
# Giọng: Kokoro (offline, core/tts/tts.py), giọng và tốc độ từng nhân vật trong _shared/voices.js.
# Câu hát (Musical Storytelling): bản nói qua Whisper khớp từng chữ, rồi _shared/sing.py hát bằng chính giọng đó, rồi _shared/tools/asr_sung.py
# kiểm lời hát còn nghe rõ. Cuối cùng _shared/qa.py chạy cả nhóm "Chuẩn mới" (timeline.json có standard).
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
NAME=$(basename "$HERE")
LIB=${LIB:-$(cd "$HERE/../.." && pwd)}          # clone mode: <repo>/films/<name>/
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the library folder"; exit 1; }
PY="$LIB/.venv/bin/python"; [ -x "$PY" ] || PY="$LIB/.venv/Scripts/python.exe"   # macOS/Linux · Windows
export PYTHONIOENCODING=utf-8
cd "$LIB"
node "$HERE/tools/lines.mjs"                                                     # timeline.js (song.js đã giải câu hát) → JSON, quỹ thời gian
"$PY" core/tts/tts.py "$HERE/voice/lines.json" "$HERE/voice"
"$PY" _shared/voicefx.py "$HERE/voice/lines.json" "$HERE/voice"                 # giọng trẻ em: nâng cao độ (voices.js: pitch)
WHISPER_MODEL=base.en "$PY" core/tts/asr_check.py "$HERE/voice/lines.json" "$HERE/voice" --lang en
WHISPER_MODEL=small.en "$PY" core/tts/asr_check.py "$HERE/voice/lines.json" "$HERE/voice" --lang en   # chạy sau cùng: words.json theo small.en (đầu vào của sing.py)
"$PY" _shared/sing.py "$HERE/voice/lines.json" "$HERE/voice"                    # câu hát: PSOLA theo bản nhạc, giữ chất giọng
WHISPER_MODEL=small.en "$PY" _shared/tools/asr_sung.py "$HERE/voice/lines.json" "$HERE/voice"   # lời hát nghe rõ (WER, từ khoá)
"$PY" "$HERE/tools/env.py"                                                       # khẩu hình (theo bản hát)
node core/render/events.mjs "$HERE" --size 1080x1920
node core/render/readcheck.mjs "$HERE" --size 1080x1920
node core/render/video.mjs "$HERE" --fps 30 --workers 2 --size 1080x1920 --out "$HERE/out/video.mp4"
"$PY" "$HERE/mix.py"
"$PY" _shared/tools/soundplan.py "$HERE"                                    # SOUND-PLAN.md: Sound Design Plan + Music Timeline, Sing-along, SFX timeline, AI prompts
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/$NAME.mp4" 30 0
"$PY" core/render/srt.py "$HERE/cards.json" "$HERE/$NAME.srt"
ffmpeg -v error -y -ss 0.3 -i "$HERE/$NAME.mp4" -frames:v 1 -q:v 2 "$HERE/poster.jpg"
# ảnh bìa riêng (poster.js): Shorts 9:16 và thumbnail YouTube 16:9
node core/render/still.mjs "$HERE" 0 --q mode=poster --size 1080x1920 --out "$HERE/out/cover" --prefix poster_ && cp "$HERE/out/cover/poster_0.jpg" "$HERE/poster-shorts-9x16.jpg"
node core/render/still.mjs "$HERE" 0 --q mode=thumb --size 1920x1080 --out "$HERE/out/cover" --prefix thumb_ && cp "$HERE/out/cover/thumb_0.jpg" "$HERE/thumbnail-16x9.jpg"
"$PY" _shared/qa.py "$HERE" --json || echo "qa: còn mục CHƯA ĐẠT, xem bảng trên và _shared/QUALITY.md"   # bộ tiêu chí của kênh (gồm nhóm 8 Chuẩn mới)
echo "done: $HERE/$NAME.mp4"
