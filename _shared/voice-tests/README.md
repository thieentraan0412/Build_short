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
