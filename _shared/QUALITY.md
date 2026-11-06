# Big Secrets of Tiny Bugs · Bộ tiêu chí chất lượng cho mọi Short và video

Áp dụng cho **mọi** Short (tập A, bản B) và video dài của kênh. Mỗi tiêu chí gồm ba phần:
- quy tắc cụ thể;
- bước trong quy trình phải làm nó;
- cách kiểm: đo tự động bằng [`qa.py`](qa.py) hoặc theo checklist thủ công ở cuối file.

Một video chỉ được giao khi:
- `qa.py` không còn mục **CHƯA ĐẠT**;
- mọi mục **CẢNH BÁO** đã sửa hoặc có lý do ghi trong báo cáo;
- checklist thủ công đã điền.

## Quy trình

| Bước | Việc phải làm theo bộ tiêu chí này |
|---|---|
| 1. Treatment (`TREATMENT.md`) | Viết rõ: nhịp móc 0–1 / 1–2 / 2–3 s; ba cấu trúc và lựa chọn; mỗi 3–5 s có chuyện gì mới (bảng cảnh); gag hoặc bất ngờ; thông điệp; chi tiết để xem lại (trứng phục sinh, vòng lặp); màu nhạc riêng của tập |
| 2. Giọng | Mỗi nhân vật có lời phải có trong [`voices.js`](voices.js). Nhân vật mới phải thử A/B. Mọi câu qua Whisper `small.en` và `base.en` (`build.sh` chạy cả hai) |
| 3. Hình | Dựng khung tĩnh của mọi cảnh trước khi render; soi lỗi che khuất, chữ đè, nhân vật lơ lửng, cắt mép |
| 4. Âm thanh | Bảng Soundtrack Timeline (`MUSIC.md`) và bảng cue (`SOUND.md`) trước khi trộn |
| 5. Dựng | `build.sh` chạy readcheck, Whisper và **`qa.py`** ở cuối |
| 6. Giao | Báo cáo gồm bảng `qa.py` (hoặc `out/qa.json`) và checklist thủ công, ghi rõ mục nào chưa đạt và lý do |

## 1. Hook: 3 giây đầu

| Quy tắc | Kiểm |
|---|---|
| Khung đầu đã có hành động hoặc biểu cảm bất ngờ của nhân vật, không có cảnh tĩnh | `qa.py`: chuyển động giây đầu ≥ 1,2 |
| Câu móc có cả hình và lời, bắt đầu ≤ 0,5 s, là câu hỏi về chính trẻ hoặc một bí ẩn đọc được bằng mắt | `qa.py`: lời đầu tiên ≤ 0,5 s |
| Nhạc chạy từ giây 0; chữ móc và nhân vật xuất hiện có tiếng (pop, whoosh, boing, sparkle) | `qa.py`: nhạc 0–0,5 s; tiếng động ≤ 0,3 s; ≥ 5 cue trong 0–3 s |
| Nhịp móc: 0–1 s gây chú ý · 1–2 s nhân vật phản ứng · 2–3 s câu hỏi / bí ẩn chưa giải | Treatment + checklist |
| Không logo, không lời chào. Nhạc hiệu 2 s chỉ sau móc (tập A); bản B không có cảnh tựa | `qa.py`: cảnh tựa ≥ 3 s và ≤ 2 s |
| Chữ móc to, 2–4 từ, đọc được ngay ở khung đầu, không bị nhân vật che | readcheck + khung tĩnh |
| **Tựa móc dùng `hookTitle`** (`_shared/episode.js`): chữ ≥ 180 px, màu tương phản cao với nền, hiện đủ 100% ở khung 0 (để khung cuối của vòng lặp khớp), từng dòng nảy lên 1 → 1,17 → 1 kèm một tiếng `wordpop` | khung tĩnh 0 s và 0,15 s + `events.json` |
| Trong 1 s đầu nhân vật có **một phản ứng bất ngờ gắn với câu hỏi khoa học** (ví dụ: cái đầu gối "nghe" trước, Chirp ngó xuống đầu gối mình), và máy có chuyển động (lao vào, đẩy nhanh) | checklist + `qa.py` chuyển động giây đầu |

## 2. Giữ chân người xem

| Quy tắc | Kiểm |
|---|---|
| Không có đoạn hình đứng yên ≥ 2,5 s khi không có lời (trang sổ đứng yên chỉ khi đang có lời) | `qa.py` |
| Không có "khoảng chết" ≥ 1,8 s (không lời, không tiếng động). Khoảng lặng có chủ đích (trước đáp án, khựng cho gag) ≤ 1 s | `qa.py` |
| Mỗi cảnh trung bình ≤ 12 s; trong cảnh dài phải có máy quay hoặc kính di chuyển | `qa.py` + bảng cảnh |
| Tốc độ lời 0,8–2,2 từ/s; câu ngắn, mỗi ý một câu | `qa.py` |
| Chuyển cảnh theo ngữ pháp kênh (qua kính, vòng sóng, đốm mắt…), mỗi chuyển cảnh một tiếng riêng | `SOUND.md` + checklist |
| **Kính → sổ phải có chuyển động nối**, không iris trơn sang cảnh không liên quan: kính "chụp" (`snapFlash`) → máy lao xuyên qua mặt kính, hình trong kính hoá thành sticker → máy lùi ra từ chính sticker, lộ trang sổ (`stickerMatchCut`). Cả chuyển cảnh ≤ 0,8 s; câu đầu tiên của cảnh sau bắt đầu ≤ 0,5 s sau khi sticker dán | khung tĩnh + checklist |
| Mỗi 3–5 s có một chuyện mới: hành động, câu hỏi, phát hiện, gag | Treatment (bảng cảnh) + checklist |

## 3. Nội dung và câu chuyện

| Quy tắc | Kiểm |
|---|---|
| Dữ kiện có nguồn trích nguyên văn (`FACTS.md`); đúng phạm vi ("some ants"…); không nói điều nguồn không nói | `FACTS.md` |
| Có mở (câu hỏi), giữa (phát hiện), kết (gag nối về câu móc) | Treatment |
| Mỗi tập ít nhất một gag hoặc bất ngờ hợp tính cách nhân vật | Treatment + checklist |
| Phù hợp trẻ 4–8 tuổi: không đáng sợ, không làm nhân vật bị đau, không nói sai | checklist |
| Một thông điệp rõ (ví dụ "Go outside with a grown-up, and look closely!") hoặc một bài học nhỏ thấy được bằng mắt | checklist |
| Không trùng nhịp hoặc cảnh của tập khác (kế hoạch §4.3, §12) | Treatment (benchmark) |

## 4. Âm thanh và nhạc nền

| Quy tắc | Kiểm |
|---|---|
| Mỗi tập một màu nhạc riêng (giọng, điệu, nhạc cụ), đổi theo cảnh; giữ nhạc hiệu và mô-típ bí mật đô–mi–sol | `MUSIC.md` |
| Điểm nhấn nhạc khớp hành động, biểu cảm và phát hiện; khựng nhạc cho gag | `MUSIC.md` + `SOUND.md` |
| Mật độ tiếng động ≥ 4 cue / 10 s | `qa.py` |
| Độ to −14 ± 1 LUFS, đỉnh ≤ −1 dBTP | `qa.py` |
| Lời rõ: mỗi câu hơn nhạc + tiếng động ≥ 10 dB (dải 300–4000 Hz). Dưới lời không đặt nốt dài, hợp âm, còi trượt hay tiếng xì nằm giữa dải giọng | `qa.py` |
| Không chói (năng lượng > 6 kHz ≤ 6 %), không tụt tiếng đột ngột | `qa.py` |
| **Tự động hoá âm lượng theo cảnh** (`LEVEL` trong `mix.py`): dâng ở chỗ khám phá và bất ngờ (phát hiện, chụp sticker, "NOPE!", chữ móc trở lại), hạ dưới lời; chênh giữa giây to nhất và nhỏ nhất ≥ 6 dB | `qa.py` |
| **Không có lỗ im của nhạc**: nhạc không dưới −45 dB quá 1 giây. Chỗ "khựng" cho gag thì vẫn còn một lớp mỏng (vibraphone run run, pad), không im hẳn | `qa.py` |
| Có tiếng động cho mọi chuyển động chính: nhân vật (nhảy, giật mình, khoe), kính (chụp, lao vào, lùi ra), sổ (lật, dán), gag | `SOUND.md` |
| Nền (ambience) theo bối cảnh: đêm (gió, dế xa), vườn (chim xa, gió lá)…, nhường giọng như nhạc | `mix.py` |

## 5. Hình ảnh và chuyển động

| Quy tắc | Kiểm |
|---|---|
| Không khung trống hoặc đen | `qa.py` |
| Không chớp sáng mạnh quá 3 lần/giây (an toàn cho trẻ) | `qa.py` |
| Màu rực, đúng bảng màu của phong cách (độ rực ≥ 0,35) | `qa.py` |
| Biểu cảm rõ ở cỡ điện thoại: mắt to khi ngạc nhiên, phản ứng kéo dài ≥ 0,4 s | khung tĩnh + checklist |
| Không biến dạng nhân vật, không che mặt hay chữ, không lơ lửng, không cắt mép | khung tĩnh (bước 3) + checklist |
| Chuyển động có keyframe mượt (ease), có nhún hoặc vọt nhẹ khi dừng | checklist |
| Máy quay có zoom, lia hoặc rung nhẹ ở các điểm nhấn (móc, tiếng chạm, phát hiện, gag, chữ móc trở lại); cảnh dài có máy trôi chậm | khung tĩnh + `qa.py` (đoạn đứng yên) |
| Có chiều sâu: nền trôi chậm hơn máy, tiền cảnh trôi nhanh hơn, chi tiết nhỏ chuyển động nhẹ (bụi sáng, cỏ lắc) nhưng không che nhân vật hay chữ | khung tĩnh |
| **Kỹ thuật:** Short 1080×1920, video dài 1920×1080; **30 fps** (`video.mjs --fps 30`, `mux.sh … 30`); không watermark | `qa.py` |

## 6. Tương tác và khả năng xem lại

| Quy tắc | Kiểm |
|---|---|
| **3–5 s cuối: một câu hỏi ngắn cho trẻ trả lời to** (≤ 1,5 s, ví dụ *"Where are YOUR ears?"*), gắn với chính bí mật của tập. Không kêu gọi bình luận: video cho trẻ em bị YouTube tắt bình luận | `qa.py` |
| **Cảnh cuối gợi lại câu móc**: chữ móc trở lại đúng chỗ, đúng cỡ của khung 0 (`hookTitle`, mốc `HIT.recall`), hoặc âm thanh/hành động của câu móc trở lại; không để màn hình trống hay kết cụt | `qa.py` |
| Bản B phát vòng lặp liền (khung cuối mở về khung đầu); tập A có câu cuối nối câu móc. Phim lặp kết bằng một sự kiện tên chứa `iris` trong 1,5 s cuối (hoặc khai báo mốc `loop` trong `HIT`) để `qa.py` đo khung nối | `qa.py` |
| Tập A có ít nhất một chi tiết để tìm lại (Rollo, Spindle, một chi tiết chỉ thấy trong kính) | `qa.py` + Treatment |
| Kết vui, có điểm nhấn (gag hoặc "ta-da"), không bỏ lửng | checklist |
| **Made for Kids:** không kêu gọi bình luận hay đăng ký trong phim (YouTube tắt bình luận với video cho trẻ em). Tương tác bằng câu hỏi cho trẻ trả lời to, trò tìm đồ vật, vòng lặp | checklist |

## 7. Giọng nhân vật

| Quy tắc | Kiểm |
|---|---|
| Mỗi nhân vật có lời một giọng riêng trong `voices.js`, dùng y hệt ở mọi tập; câu cửa miệng giữ đúng tốc độ | `voices.js` |
| Hai nhân vật bất kỳ cách nhau ≥ 3 nửa cung (cao độ trung vị), hoặc khác hẳn chất giọng Anh/Mỹ (khi dàn nhân vật đông, ví dụ Dot và Blink giọng Anh cạnh Crumb giọng Mỹ) | `qa.py` |
| Nhân vật trẻ em (Crumb, Blink, Dot) có giọng trẻ em: ≥ 240 Hz, nhanh, ngộ nghĩnh (`pitch` trong `voices.js`, xử lý bằng `voicefx.py`) | `qa.py` |
| Nhân vật người lớn (Miss Loupe, Albie…) vui, giàu cảm xúc, không đọc kiểu thuyết minh. Nếu đổi giọng thì đổi cho mọi tập; mẫu A/B ở [`voice-tests/`](voice-tests/) | checklist + A/B |
| Nhân vật không lời có tiếng đặc trưng riêng (Flutter "Mmm!", Chirp gáy, Waggle vo ve…) | `SOUND.md` |
| Nhân vật mới: thử A/B nhiều giọng, chọn giọng qua cả hai Whisper và cách các giọng khác ≥ 3 nửa cung | Treatment (ghi chú sản xuất) |

## Checklist thủ công (điền vào báo cáo giao)

- [ ] 0–1 s gây chú ý · 1–2 s nhân vật phản ứng · 2–3 s câu hỏi hoặc bí ẩn chưa giải
- [ ] Mỗi 3–5 s có chuyện mới; không có cảnh nào kéo dài mà không có lý do
- [ ] Có ít nhất một gag hoặc bất ngờ; nhân vật đúng tính cách
- [ ] Nội dung đúng `FACTS.md`, phù hợp 4–8 tuổi, không đáng sợ
- [ ] Có thông điệp hoặc bài học nhỏ thấy được
- [ ] Biểu cảm đọc được ở cỡ điện thoại; không che, không cắt mép, không lơ lửng
- [ ] Nhạc đổi theo cảnh, khớp hành động; màu nhạc khác các tập trước
- [ ] Kết có điểm nhấn và nối về đầu (vòng lặp hoặc câu cuối)
- [ ] Không kêu gọi bình luận hay đăng ký (Made for Kids); câu hỏi kết là câu trẻ trả lời to
- [ ] Tựa móc nảy ở khung đầu có tiếng; nhân vật phản ứng bất ngờ trong 1 s
- [ ] Chuyển cảnh kính → sổ có chuyển động nối (chụp sticker, match cut), không iris trơn
- [ ] Cảnh cuối gợi lại câu móc (chữ móc trở lại / âm thanh mở đầu); không màn hình trống
- [ ] Mỗi nhân vật có lời một giọng riêng; giọng trẻ em cho nhân vật trẻ em
