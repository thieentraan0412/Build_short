# Mẫu giọng A/B: Miss Loupe và Albie

Tiêu chí 7 của [QUALITY.md](../QUALITY.md) yêu cầu mỗi nhân vật có một giọng riêng, ngộ nghĩnh, thu hút trẻ em. Crumb đã có giọng trẻ em. Miss Loupe và Albie hiện dùng giọng người lớn, đúng cách phân vai trong kế hoạch kênh (§11.3): Miss Loupe "nữ, vui, rõ, chậm", Albie "nam trầm, lịch sự".

Đổi giọng sẽ thay giọng của mọi tập và mọi câu cửa miệng, nên cần bạn nghe và chọn. Các file `.wav` trong thư mục này được thu bằng đúng công cụ của kênh (`core/tts/tts.py` + `_shared/voicefx.py`).

| File | Giọng | Cao độ | Whisper `small.en` / `base.en` | Ghi chú |
|---|---|---|---|---|
| `loupe_A_af_heart_p+0.wav` | **Hiện tại** | 204 Hz | ✓ / ✗* | |
| `loupe_B_af_heart_p+2.wav` | af_heart, nhanh hơn một chút, +2 nửa cung | 229 Hz | ✓ / ✗* | Vẫn là Miss Loupe, sáng và vui hơn |
| `loupe_C_af_bella_p+1.wav` | af_bella +1 | 224 Hz | ✓ / ✗* | Giọng khác, tươi hơn |
| `loupe_D_af_nova_p+2.wav` | af_nova +2 | 186 Hz | ✗ / ✗ | Không nên dùng |
| `albie_A_bm_lewis_p+0.wav` | **Hiện tại** | 97 Hz | ✓ / ✓ | Trong phim bị Whisper nghe "In" thành "and" ở mọi tập |
| `albie_B_bm_lewis_p+3.wav` | bm_lewis +3 | 112 Hz | ✓ / ✗ | |
| `albie_C_bm_fable_p+2.wav` | bm_fable +2 | 129 Hz | ✓ / ✓ | Ấm, vui hơn; vẫn là giọng nam của "cuốn sổ" |
| `albie_D_am_puck_p+1.wav` | am_puck +1 | 127 Hz | ✗ / ✗ | Không nên dùng |

\* Câu thử ghép hai câu làm một ("Let's zoom in! Ants sniff…"), nên Whisper dính "in ants" thành "in and". Trong phim hai câu này đứng riêng và đều qua.

**Gợi ý:**
- **Miss Loupe:** B, sáng hơn mà vẫn nhận ra là cô.
- **Albie:** C, vui hơn và qua cả hai mô hình Whisper.

Nếu chọn, chỉ cần sửa hai dòng trong [`_shared/voices.js`](../voices.js) (thêm `pitch`, đổi `voice`/`speed`), rồi chạy `sh films/short-00x/build.sh` cho từng tập.

Câu thử nằm trong `lines.json`. Có thể xoá cả thư mục này sau khi đã chọn.

## Spindle (nhân vật mới của LONG-002)

Treatment của LONG-002 (§8) cần một giọng nữ trầm ấm, hơi kịch, cách Miss Loupe (205–218 Hz ở các tập đã dựng) ≥ 3 nửa cung hoặc khác hẳn chất giọng Anh/Mỹ. Mỗi file ghép 7 câu của Spindle trong phim (16/11/2026, `core/tts/tts.py` + `_shared/voicefx.py`).

| File | Giọng | Cao độ | Whisper `small.en` / `base.en` (lỗi / 7 câu) | Ghi chú |
|---|---|---|---|---|
| `spindle_A_bf_emma_p+0.wav` | bf_emma | 180 Hz | 4 / 3 | "Oopsie" → "of oopsie", "caught me" → "caught Mia" |
| `spindle_B_af_nicole_p+0.wav` | af_nicole | 158 Hz | 1 / 1 | Thì thầm, khó nghe dưới nhạc |
| `spindle_C_af_kore_p+0.wav` | af_kore | 171 Hz | 1 / 1 | Chỉ cách Miss Loupe 3,1–4,0 nửa cung |
| `spindle_D_bf_emma_p-1.5.wav` | bf_emma −1,5 | 167 Hz | 4 / 4 | Không nên dùng |
| `spindle_E_af_kore_p-2.wav` | af_kore −2 | 152 Hz | 1 / 1 | Trầm hơn nhưng chậm, âm sắc nghe "to" |
| **`spindle_F_af_kore_p-1.wav`** | **af_kore −1, speed .95 (đã chọn)** | **157 Hz** | **0 / 0** | Ấm, hơi kịch; cách Miss Loupe 4,5–5,8 nửa cung, Dot 8 nửa cung |

Lỗi chung của mọi giọng là "Six! See?" bị nghe thành "6C" (đồng âm "sixty"). Câu trong phim đổi thành *"Six legs! See? I am a bug!"* (bản F ghi đúng câu này), qua cả hai Whisper.

## Mr. Rollo (lần đầu có nhiều lời, LONG-003)

Treatment của LONG-003 (§8) cần một giọng nam già, trầm, chậm, cách Albie (`bm_lewis`, giọng Anh, ≈ 97 Hz) ở chất giọng Anh/Mỹ hoặc ≥ 3 nửa cung. Mỗi file ghép 12 câu của Rollo trong phim (17/11/2026, `core/tts/tts.py` + `_shared/voicefx.py`).

| File | Giọng | Cao độ | Whisper `small.en` / `base.en` (lỗi / 12 câu) | Ghi chú |
|---|---|---|---|---|
| `rollo_A_bm_george_p+0.wav` | bm_george, .8 | 150 Hz | 3 / 4 | Cao, nghe trẻ; "lighter" → "Lidert" |
| `rollo_B_am_michael_p+0.wav` | am_michael, .8 | 122 Hz | 0 / 2 | Rõ nhưng chưa "già" |
| `rollo_C_bm_fable_p+0.wav` | bm_fable, .8 | 126 Hz | 0 / 2 | Giọng Anh, gần Albie về chất giọng |
| `rollo_D_bm_george_p-2.wav` | bm_george −2, .88 | 133 Hz | 1 / 1 | "The stars!" → "The star is it" |
| **`rollo_E_am_michael_p-2.wav`** | **am_michael −2, .88 (đã chọn)** | **110 Hz** | **0 / 1** | Trầm, chậm, ấm; giọng Mỹ nên khác Albie ở chất giọng. Lỗi duy nhất "A pond!" → "upon": câu trong phim đổi thành *"Oh my. It's a pond!"* |
| `rollo_F_bm_daniel_p-1.wav` | bm_daniel −1, .85 | 123 Hz | 2 / 1 | "The stars!" → "The star is here" |
| `rollo_G_am_onyx_p+0.wav` | am_onyx, .8 | 90 Hz | 1 / 1 | Trầm hơn cả Albie, "Leave" → "Love" |

"Hmm." ở đầu câu của Rollo đã đổi thành "Oh my." trước khi thử (Kokoro đọc "Hmm" thành "hem", xem SOUND.md của LONG-002).
