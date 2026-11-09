# Big Secrets of Tiny Bugs · Bộ tiêu chí chất lượng cho mọi Short và video

Áp dụng cho **mọi** Short (tập A, bản B) và video dài của kênh. Mỗi tiêu chí gồm ba phần:
- quy tắc cụ thể;
- bước trong quy trình phải làm nó;
- cách kiểm: đo tự động bằng [`qa.py`](qa.py) hoặc theo checklist thủ công ở cuối file.

Một video chỉ được giao khi:
- `qa.py` không còn mục **CHƯA ĐẠT**;
- mọi mục **CẢNH BÁO** đã sửa hoặc có lý do ghi trong báo cáo;
- checklist thủ công đã điền.

**Lượt nâng cấp 11/2026.** Các quy tắc ghi *(11/2026)* đến từ [bản phân tích 5 Short đầu](../PHAN-TICH-SHORTS/README.md). Lý do và cách áp dụng ở [kế hoạch nâng cấp](../PHAN-TICH-SHORTS/KE-HOACH-NANG-CAP.md).
- Quy tắc áp dụng từ SHORT-006.
- SHORT-001 đến 005 giữ nguyên làm mốc so sánh, nên `qa.py` vẫn báo CẢNH BÁO ở các tập này.

## Quy trình

| Bước | Việc phải làm theo bộ tiêu chí này |
|---|---|
| 1. Treatment (`TREATMENT.md`) | Viết rõ: nhịp móc 0–1 / 1–2 / 2–3 s; ba cấu trúc và lựa chọn; mỗi 3–5 s có chuyện gì mới (bảng cảnh); gag hoặc bất ngờ; thông điệp; chi tiết để xem lại (trứng phục sinh, vòng lặp); màu nhạc riêng của tập. *(11/2026)* Thêm: **khoảnh khắc wow** (bí mật xảy ra thành chuyển động gì, kính cỡ nào); **người nói của từng câu** có trên hình không; **đạo cụ của gag** được gài ở đâu; tập A theo khung 45 s ([kế hoạch nâng cấp](../PHAN-TICH-SHORTS/KE-HOACH-NANG-CAP.md#3-công-thức-mới-của-tập-a-khoảng-45-s)) |
| 2. Giọng | Mỗi nhân vật có lời phải có trong [`voices.js`](voices.js). Nhân vật mới phải thử A/B. Mọi câu qua Whisper `small.en` và `base.en` (`build.sh` chạy cả hai) |
| 3. Hình | Dựng khung tĩnh của mọi cảnh trước khi render; soi lỗi che khuất, chữ đè, nhân vật lơ lửng, cắt mép. *(11/2026)* Soi cả vùng giao diện Shorts: `node _shared/tools/safezone.mjs films/<tập>` (số đo) và `python _shared/tools/safesheet.py films/<tập>` (khung có phủ vùng che) |
| 4. Âm thanh | Bảng Soundtrack Timeline (`MUSIC.md`) có **bảng cảnh nhạc** (mỗi cảnh một điệu, dựng bằng [`audio/groove.py`](audio/groove.py)) và bảng cue (`SOUND.md`) trước khi trộn |
| 5. Dựng | `build.sh` chạy readcheck, Whisper và **`qa.py`** ở cuối (`qa.py` tự chạy `safezone.mjs` với Short 1080×1920) |
| 6. Giao | Báo cáo gồm bảng `qa.py` (hoặc `out/qa.json`) và checklist thủ công, ghi rõ mục nào chưa đạt và lý do |

## 1. Hook: 3 giây đầu

| Quy tắc | Kiểm |
|---|---|
| Khung đầu đã có hành động hoặc biểu cảm bất ngờ của nhân vật, không có cảnh tĩnh | `qa.py`: chuyển động giây đầu ≥ 1,2 |
| Câu móc có cả hình và lời, bắt đầu ≤ 0,5 s, là câu hỏi về chính trẻ hoặc một bí ẩn đọc được bằng mắt | `qa.py`: lời đầu tiên ≤ 0,5 s |
| Nhạc chạy từ giây 0; chữ móc và nhân vật xuất hiện có tiếng (pop, whoosh, boing, sparkle) | `qa.py`: nhạc 0–0,5 s; tiếng động ≤ 0,3 s; ≥ 5 cue trong 0–3 s |
| Nhịp móc: 0–1 s gây chú ý · 1–2 s nhân vật phản ứng · 2–3 s câu hỏi / bí ẩn chưa giải | Treatment + checklist |
| Không logo, không lời chào. *(11/2026)* Tập A: logo và nhạc hiệu **≤ 0,8 s, lồng vào cú lao vào kính** ngay sau móc, không có khung tựa đứng riêng (khai báo cảnh `title` dài 0,8 s để `qa.py` nhận ra tập A). Bản B không có cảnh tựa. Video dài giữ nhạc hiệu 2 s | `qa.py`: cảnh tựa ≤ 0,85 s, bắt đầu ≥ 2,5 s (nhạc hiệu 2 s của các tập trước 11/2026 là CẢNH BÁO) |
| Chữ móc to, 2–4 từ, đọc được ngay ở khung đầu, không bị nhân vật che | readcheck + khung tĩnh |
| **Tựa móc dùng `hookTitle`** (`_shared/episode.js`): chữ ≥ 180 px, màu tương phản cao với nền, hiện đủ 100% ở khung 0 (để khung cuối của vòng lặp khớp), từng dòng nảy lên 1 → 1,17 → 1 kèm một tiếng `wordpop` | khung tĩnh 0 s và 0,15 s + `events.json` |
| Trong 1 s đầu nhân vật có **một phản ứng bất ngờ gắn với câu hỏi khoa học** (ví dụ: cái đầu gối "nghe" trước, Chirp ngó xuống đầu gối mình), và máy có chuyển động (lao vào, đẩy nhanh) | checklist + `qa.py` chuyển động giây đầu |
| *(11/2026)* **Móc bằng hình, không chỉ bằng chữ**: 1–2,5 s nhân vật phản ứng bằng hành động (giật mình, nhảy, va chạm), không đứng nhìn chữ. Nhân vật chính không bị che trong 3 s đầu | `qa.py`: chuyển động 1–2,5 s ≥ 2,0 + khung tĩnh |

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
| *(11/2026)* **Không có đoạn không lời dài hơn 4 s** (video dài: 8 s). Nhạc và vài tiếng động không đủ giữ trẻ. Nếu cố ý (điệu nhảy, cảnh đặc trưng) thì phải có chữ trên hình hoặc hành động mới mỗi 2 s, và ghi lý do trong báo cáo | `qa.py` |
| *(11/2026)* **Hình không đứng gần yên quá 3 s, kể cả khi đang có lời.** Lời nói không thay được hình: cảnh kính, cảnh sổ phải có hành động hoặc máy trôi | `qa.py`: trung vị chuyển động trong 1,5 s dưới 1,5 không quá 3 s (chỉ Short) |
| *(11/2026)* **Kính soi đứng ≤ 3 s**: trong kính, bí mật phải "xảy ra" (chân bước thì điểm nếm sáng theo bước, tiếng gáy thì màng nhĩ rung, mây mùi hoà vào nhau), mỗi nhịp một tiếng | `qa.py` (mục trên) + khung tĩnh |
| *(11/2026)* **"Six legs? In you go!" nói trong lúc có hành động**: Albie đớp sticker, nhân vật nhảy vào sổ đúng lúc nói. Không đọc trên trang sổ đứng yên | `qa.py`: chuyển động trong câu ≥ 2,0 (chỉ Short) |
| *(11/2026)* **Tập A: cảnh sổ ≤ 4,5 s.** Trang đủ 3 sticker vẫn đứng ≥ 3 s để chụp màn hình, nhưng nhân vật trên trang vẫn chuyển động | `qa.py` (cảnh `album`) |
| *(11/2026)* **Không có cảnh giới thiệu lặp lại** điều móc vừa cho thấy (ví dụ "A butterfly lands on a flower" ngay sau khi móc đã cho thấy bướm) | Treatment + checklist |
| *(11/2026)* **Tập A có vòng mở**: ba ô sticker trống "1 2 3" hiện khi chữ móc rời đi, lấp dần theo từng bí mật. Đây là lý do để xem hết | Treatment + khung tĩnh |

## 3. Nội dung và câu chuyện

| Quy tắc | Kiểm |
|---|---|
| Dữ kiện có nguồn trích nguyên văn (`FACTS.md`); đúng phạm vi ("some ants"…); không nói điều nguồn không nói | `FACTS.md` |
| Có mở (câu hỏi), giữa (phát hiện), kết (gag nối về câu móc) | Treatment |
| Mỗi tập ít nhất một gag hoặc bất ngờ hợp tính cách nhân vật | Treatment + checklist |
| Phù hợp trẻ 4–8 tuổi: không đáng sợ, không làm nhân vật bị đau, không nói sai | checklist |
| Một thông điệp rõ (ví dụ "Go outside with a grown-up, and look closely!") hoặc một bài học nhỏ thấy được bằng mắt | checklist |
| Không trùng nhịp hoặc cảnh của tập khác (kế hoạch §4.3, §12) | Treatment (benchmark) |
| *(11/2026)* **Người nói có trên hình** (kể cả trong kính) từ giây 3 trở đi, nhất là câu phản ứng và gag ("NOPE!", "Oops! Sorry!"). Lời dẫn ngoài hình có chủ đích thì ghi `off: '<lý do>'` vào câu trong `timeline.js` | `qa.py`: mặt người nói hiện ≥ 50 % thời gian câu |
| *(11/2026)* **Gài trước đạo cụ của gag**: thứ làm nên gag kết (cây kem, con ruồi, ánh lóe trên kính) phải xuất hiện ít nhất một lần trước đó | Treatment + checklist |
| *(11/2026)* **Nói rõ nghĩa ẩn dụ** cho trẻ 4–8 tuổi: "tiny cows" phải đi kèm "they tap them for sweet drops, like milk!" | Treatment + `FACTS.md` |
| *(11/2026)* **Nhân vật cần phân biệt phải khác nhau ở hình** (màu, phụ kiện, dáng), không chỉ khác ở hiệu ứng trong kính (bài học từ hai con kiến nâu ở SHORT-005) | khung tĩnh + checklist |

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
| **Nhạc nền sinh động, đổi theo cảnh** (lượt 11/2026): không có đoạn nào quá 8 s (video dài: 15 s) mà nhạc giữ nguyên một kiểu. Hai cảnh nhạc kề nhau khác nhau ở ít nhất 2 trong 5 thứ: điệu, vòng hoà âm, bộ nhạc cụ, bộ trống, mức năng lượng. Một Short có ≥ 3 điệu (dưới 20 s: ≥ 2). Dựng bằng lớp nhịp theo cảnh [`audio/groove.py`](audio/groove.py) (`G.sec`); đoạn viết tay (nhạc hiệu, stinger, tổ khúc) ghi bằng `G.mark`; `G.save` ghi `out/music.json` | `qa.py` (`out/music.json`) + bảng cảnh nhạc trong `MUSIC.md` |
| **Nhạc có nhịp liền, kể cả dưới lời**: dưới lời còn bass, kick, hat/shaker và tiếng đệm ngắn ở dải cao (giai điệu im); dưới giọng trầm (Albie) bỏ bass. Không để nhạc đứng thành pad ngân dài: chỗ khám phá dùng điệu rải (`float`), không dùng pad trơn | `qa.py`: ≥ 85 % số giây có ≥ 3 nốt |
| **Nhạc đáp lời**: khoảng không lời giữa hai câu có một câu đáp ngắn của nhạc cụ hát chính (lớp nhịp tự chen; câu đáp viết tay ghi bằng `G.answer`), ≥ 1 câu / 10 s | `qa.py` |
| **Đổi cảnh nhạc có dấu**: trước cảnh mạnh hơn có trống dồn, trước cảnh nhẹ hơn có chuỗi nốt đi xuống; phách đầu cảnh mới có kick + chũm chọe mềm (lớp nhịp tự làm); chỗ khựng, stinger viết tay | `MUSIC.md` + nghe lại |
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
| *(11/2026)* **Khoảnh khắc bí mật to và rõ**: kính r ≥ 300 px (khoảng 55 % chiều rộng khung) hoặc cận cảnh toàn khung. Chi tiết chính (vòi bướm, tai dế) rộng ≥ 10 % khung, không phải một nét mảnh | khung tĩnh ở cỡ điện thoại |
| *(11/2026)* **Vùng giao diện YouTube Shorts** (ước lượng trên khung 1080×1920; `SAFE` trong [`episode.js`](episode.js)): đáy tấm phụ đề trên 1500 px (tập mới gọi `subtitle(c, card, t, 510, SAFE.subY)`). Chữ và mặt nhân vật ngoài thanh trên (150 px), vùng tên kênh/tiêu đề/nhạc (từ 1530 px) và cột nút phải (x > 940, y 880–1780) | `qa.py` (qua `tools/safezone.mjs`) + `tools/safesheet.py` |
| *(11/2026)* **Phụ đề không che mặt nhân vật**: khi có phụ đề, mặt đứng trên 1250 px hoặc lệch hẳn sang bên | `qa.py` (qua `tools/safezone.mjs`) |
| *(11/2026)* **Chữ đọc được trên mọi nền**: chữ trên nền sáng có viền tối hoặc nền đặc; chữ nằm trên lớp mây, khói, hiệu ứng | khung tĩnh + checklist |
| *(11/2026)* **Nền tương phản với nhân vật chính** (không hồng trên hồng như nền của SHORT-005) | khung tĩnh + checklist |
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

## Hiệu chỉnh các mục đo mới (11/2026)

Ngưỡng các mục mới của `qa.py` được chọn sao cho trên 5 Short đầu, các mục này bắt đúng những gì [bản phân tích](../PHAN-TICH-SHORTS/README.md) đã thấy bằng mắt.

| Mục | 001 | 002 | 003 | 004 | 005 |
|---|---|---|---|---|---|
| Chuyển động 1–2,5 s (≥ 2,0) | 5,11 | 2,99 | **1,30** | 2,64 | **1,18** |
| Đoạn không lời > 4 s | **33,3–42,0** | — | — | **21,6–30,3; 32,0–38,0** | — |
| Hình gần đứng yên > 3 s | **41,8–47,8** (sổ) | **4,2–7,9** (kính) | **5,8–9,0** (kính); **16,4–22,8** (kết) | **29,0–35,0; 36,5–46,0** (sổ); **46,6–50,2** | **1,5–11,0** (móc nhẹ và kính) |
| Câu cửa miệng (≥ 2,0) | **0,27** | **0,57** | **1,21** | **0,29** | **0,63** |
| Cảnh sổ tập A (≤ 4,5 s) | **8,0 s** | — | — | **10,0 s** | — |
| Người nói vắng | **6 câu dẫn** của Loupe | **20,4 s** | **17,7; 19,3; 20,7 s** | **6,5 s** | — |
| Vùng giao diện | chữ móc trở lại ở thanh trên; phụ đề riêng, không đo được | phụ đề 19 s; chữ móc 1,2–2,8 s | phụ đề 20 s | phụ đề 28,5 s; **mặt Loupe 20,0–27,5 s** | phụ đề 21,5 s; **mặt Loupe 4,0–5,8 s** |
| Phụ đề che mặt | không đo được | — | — | **Loupe 9,5–10,0; 20,5–22,5 s** | — |

Không báo nhầm ở những đoạn bản phân tích đánh giá tốt:
- móc của 002;
- đoạn kính trượt dọc đường mùi của 004 (22–27 s);
- gag của 005.

LONG-001 không có mục mới nào bị CẢNH BÁO. Hai mục "hình gần đứng yên" và "câu cửa miệng" chưa hiệu chỉnh cho video dài nên chỉ đo ở Short.

**Giới hạn:**
- Đo chuyển động bằng độ khác trung bình giữa hai khung, nên một chuyển động nhỏ lặp lại vẫn tính là "có chuyển động". Ví dụ, kính đứng ở 9–13 s của SHORT-001 lọt qua vì có nhịp nháy ngắn; hạ ngưỡng để bắt nó thì sẽ báo nhầm ở chỗ khác. Vì vậy vẫn phải soi khung tĩnh.
- Vùng giao diện là ước lượng, khác theo máy và phiên bản ứng dụng YouTube.
- "Người nói có trên hình" chỉ nhận ra mặt nhân vật vẽ bằng rig dùng chung (`drawChar`).
- Sau khi đăng, đối chiếu với biểu đồ giữ chân thật rồi chỉnh ngưỡng ([kế hoạch nâng cấp, mục 9](../PHAN-TICH-SHORTS/KE-HOACH-NANG-CAP.md#9-đo-sau-khi-đăng)).

## Checklist thủ công (điền vào báo cáo giao)

- [ ] 0–1 s gây chú ý · 1–2 s nhân vật phản ứng · 2–3 s câu hỏi hoặc bí ẩn chưa giải
- [ ] Mỗi 3–5 s có chuyện mới; không có cảnh nào kéo dài mà không có lý do
- [ ] Có ít nhất một gag hoặc bất ngờ; nhân vật đúng tính cách
- [ ] Nội dung đúng `FACTS.md`, phù hợp 4–8 tuổi, không đáng sợ
- [ ] Có thông điệp hoặc bài học nhỏ thấy được
- [ ] Biểu cảm đọc được ở cỡ điện thoại; không che, không cắt mép, không lơ lửng
- [ ] Nhạc đổi theo cảnh, khớp hành động; màu nhạc khác các tập trước
- [ ] Nghe lại cả phim: mỗi cảnh nhạc nghe ra khác cảnh trước; dưới lời vẫn còn nhịp; có câu đáp giữa các câu; không đoạn nào nghe như một vòng lặp đều
- [ ] Kết có điểm nhấn và nối về đầu (vòng lặp hoặc câu cuối)
- [ ] Không kêu gọi bình luận hay đăng ký (Made for Kids); câu hỏi kết là câu trẻ trả lời to
- [ ] Tựa móc nảy ở khung đầu có tiếng; nhân vật phản ứng bất ngờ trong 1 s
- [ ] Chuyển cảnh kính → sổ có chuyển động nối (chụp sticker, match cut), không iris trơn
- [ ] Cảnh cuối gợi lại câu móc (chữ móc trở lại / âm thanh mở đầu); không màn hình trống
- [ ] Mỗi nhân vật có lời một giọng riêng; giọng trẻ em cho nhân vật trẻ em
- [ ] *(11/2026)* Khoảnh khắc bí mật to (kính r ≥ 300 px hoặc cận toàn khung) và bí mật "xảy ra" thành chuyển động; kính không đứng quá 3 s
- [ ] *(11/2026)* "Six legs? In you go!" nói trong lúc có hành động; tập A: cảnh sổ ≤ 4,5 s, có vòng mở "1 2 3"
- [ ] *(11/2026)* Người nói có trên hình; đạo cụ của gag đã gài trước; nghĩa ẩn dụ được nói rõ
- [ ] *(11/2026)* Phụ đề, chữ và mặt nhân vật ngoài vùng giao diện Shorts (`safesheet.py`); phụ đề không che mặt; chữ có viền hoặc nền đặc; nền tương phản với nhân vật chính
