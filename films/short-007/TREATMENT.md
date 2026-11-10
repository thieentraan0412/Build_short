# SHORT-007 · Fireflies Talk in Secret Light Codes! ✨ — Treatment

**Tựa đăng YouTube:** *Fireflies Talk in Secret Light Codes! ✨ | Big Secrets of Tiny Bugs* (tiếng Việt tham khảo: *Đom đóm nói chuyện bằng mật mã ánh sáng!*)

**Thông số:**
- **Tập A** của tuần 3, SERIES-001 *Secret Senses*, lên sóng Thứ Hai 30/11/2026. Hạn dựng xong: Chủ Nhật 15/11 (kế hoạch nâng cấp §8).
- Short dọc 1080×1920, 30 fps, **44 giây**, 4/4 ở 120 BPM (22 ô nhịp, mỗi ô 2 s). Khung tập A mới là khoảng 45 s.
- Tiếng Anh cho lời, chữ trên hình và phụ đề. Khán giả 4–8 tuổi.

**Căn cứ:**
- Đề cương: [DE-CUONG-CAC-BO.md](../../DE-CUONG-CAC-BO.md), SHORT-007.
- Bộ tiêu chí kênh: [`_shared/QUALITY.md`](../../_shared/QUALITY.md).
- **Tập A đầu tiên theo công thức 45 s** của [kế hoạch nâng cấp](../../PHAN-TICH-SHORTS/KE-HOACH-NANG-CAP.md) (mục 3, 6 và ghi chú 007 ở mục 7):
  - logo ≤ 0,8 s lồng vào cú lao vào kính;
  - ô sticker "1 2 3" mở vòng từ giây 3;
  - sổ ≤ 4,5 s.
- Dữ kiện và nguồn: [FACTS.md](FACTS.md).

**Ghi chú 007 của kế hoạch nâng cấp và cách tập này đáp ứng:**

| Ghi chú | Cách làm |
|---|---|
| Vườn đêm: rủi ro khung tối, độ rực thấp, ít chuyển động | Trời đêm tím đậm (`C.night`, độ rực cao, không dùng đen); trăng to, đồi và cỏ xanh ngọc có viền sáng, nên vẫn có tương phản khi máy trôi |
| Mở bằng một chùm chớp sáng của Blink và kính giật mình, không mở bằng một đốm sáng đơn độc | Khung 0: Blink vụt qua sát mặt kính, đuôi đang nháy chùm "flash-flash", Miss Loupe giật nảy, kính chao đi |
| Blink có lời lần đầu: thử A/B giọng, ≥ 240 Hz, cách các giọng khác ≥ 3 nửa cung | Giọng Blink đã chọn qua A/B ở LONG-001 (`bf_lily`, nâng 8 nửa cung, khoảng 325 Hz, giọng Anh). Tập này dùng y nguyên từ [`voices.js`](../../_shared/voices.js) và kiểm lại bằng `qa.py` |
| Gag "Is it winking at me?" cần gài ánh lóe trên kính từ sớm | Ánh trăng lóe trên vành kính có tiếng "ting" ở móc (2,4 s) và ở mỗi cú "chụp" bí mật |

**Không trùng với các tập kề bên:**
- **SHORT-008** (bản B, 02/12) kể chuyện các chất trộn lại tạo ánh sáng. Tập này **không** soi vào trong đèn đuôi. Bí mật 1 chỉ cho thấy ánh sáng không nướng được kẹo dẻo.
- **SHORT-009** (bản B, 04/12) có kính soi lớp cánh và gag con ruồi. Tập này **không có con ruồi thật**. Bí mật 2 là cảnh "họ hàng bọ cánh cứng": Blink và Dot cùng bật tấm cánh như một màn đồng diễn.
- **LONG-001**, chương 4, có cảnh Blink nháy mật mã, một bạn ở xa nháy đáp. Tập này giữ nhịp nháy đáp vì nó là bí mật 3, nhưng cảnh đặc trưng là **cả vườn nháy theo nhịp dế của Chirp**, chưa có ở đâu.
- **SHORT-003** "Night Band swing" (Rê thứ, swing, vibraphone). Tập này dùng màu nhạc khác: "Glow-Code Bossa" (mục 6).

## 1. Ba cấu trúc đã cân nhắc

| | Cấu trúc | Ưu | Nhược |
|---|---|---|---|
| A | **Đúng dàn ý đề cương:** vườn đêm tối đen, một đốm sáng. *"Could your tummy glow?"* Ba bí mật nối tiếp bằng lời dẫn, cảnh đặc trưng ở cuối | Bám kế hoạch | Móc là một đốm sáng đơn độc trên nền đen: khung tối, ít chuyển động (kế hoạch nâng cấp đã cảnh báo). "Is a firefly a fly?" và lớp cánh trùng nhịp với SHORT-009 |
| B | **Blink làm "phát thanh viên":** Blink tự kể ba bí mật về mình, Miss Loupe chỉ soi | Blink ra mắt rõ, có cá tính | Blink nói hơn nửa phim, giọng cao liên tục dễ mệt tai. Tật "No! … okay, yes" mất duyên vì Blink lại là người khai ra mọi thứ |
| C | **"Đèn lồng bí mật":** khung 0 Blink vụt qua sát kính, đuôi nháy chùm. Miss Loupe hỏi trẻ *"Could your tummy glow?"*, Blink đáp *"My tummy can!"* và đuôi bùng sáng. Cú lao vào kính mang logo 0,8 s. Ba bí mật, mỗi bí mật một trò thấy được: kẹo dẻo không chín (ánh sáng lạnh); Blink và Dot cùng bật tấm cánh (họ bọ cánh cứng); Blink chối *"No!"* nhưng đuôi nháy lộ, rồi nháy mật mã và cả vườn nháy theo nhịp dế. Sổ, rồi gag ánh lóe trên kính, đốm sáng nhỏ nháy đáp | Móc bằng hình và hỏi về chính trẻ. Mỗi bí mật xảy ra thành chuyển động trong kính lớn. Ba lần gài ánh lóe cho gag. Giữ cảnh đặc trưng, gag, vòng lặp và trứng phục sinh của đề cương | Nhiều đạo cụ (kẹo dẻo, bong bóng nghĩ, dải mật mã, đám đom đóm) và một nhân vật phụ (Dot) |

**Chọn C.**
- Giữ của đề cương: nhân vật (Miss Loupe, Blink, Albie có lời; Chirp, Crumb không lời), câu móc, *"Nope!"*, tật *"No! … okay, yes"*, cảnh đặc trưng, gag *"Is it winking at me?"*, vòng lặp về đốm sáng đầu, trứng phục sinh (Rollo trên mặt trăng, mạng nhện đọng sương).
- Đổi theo kế hoạch nâng cấp:
  - mở bằng chùm chớp sáng và kính giật mình;
  - bí mật 2 là màn đồng diễn của họ bọ cánh cứng, không soi lớp cánh, để không trùng SHORT-009;
  - thêm Dot (không lời) vì một con bọ cánh cứng quen thuộc giúp trẻ hiểu "beetle".

## 2. Logline và mạch truyện

**Logline:** Một đêm trong vườn, Blink vụt qua kính của Miss Loupe, đuôi nháy sáng. Ba bí mật của đom đóm: ánh sáng lạnh không có lửa, đom đóm là bọ cánh cứng, và đom đóm nói chuyện bằng mật mã ánh sáng. Rồi cả vườn nháy theo nhịp dế của Chirp.

- **Mở (0–3 s):**
  - Khung 0: Blink vụt qua sát mặt kính, đuôi đang nháy chùm. Miss Loupe giật nảy, kính chao đi. Chữ GLOWING / TUMMY?! đủ ở khung 0.
  - *"Could your tummy glow?"*
  - Blink đáp xuống mô rêu, quay ra phía người xem: *"My tummy can!"* Đuôi bùng sáng, cả cụm cỏ ửng vàng.
  - Ánh trăng lóe "ting" trên vành kính (gài cho gag). Chữ móc thu nhỏ đi, ba ô sticker trống "1 2 3" hiện dưới thanh trên.
- **Logo (3,0–3,8 s):** Miss Loupe giơ kính, máy lao vào mặt kính. Logo "BIG SECRETS of tiny bugs" bật lên trong mặt kính trong 0,8 s, rồi máy xuyên qua thành kính lớn (r 310 px).
- **Bí mật 1, ánh sáng lạnh (3,8–10,6 s):**
  - *"Let's zoom in!"* Trong kính: đèn đuôi của Blink sáng nhịp nhàng.
  - Crumb lò dò vào, chìa một viên kẹo dẻo xiên que vào ánh đèn như hơ lửa. *"Fireflies make cold light!"*
  - Chờ. Đồng hồ "tíc tắc". Kẹo dẻo vàng óng vì được chiếu sáng nhưng vẫn trắng, không chín. Hai râu Crumb uốn thành dấu hỏi.
  - Blink cười: *"Look! No fire!"* Crumb nhún vai, cho kẹo vào miệng.
  - Kính "chụp" → sticker bay lên ô 1, ô sáng lên "stamp".
- **Bí mật 2, có "Nope!" (10,6–17,7 s):**
  - Kính lùi một chút. Bong bóng nghĩ trên đầu Crumb: một con ruồi hoạt hình và dấu hỏi. *"Is a firefly a fly?"*
  - Khựng 0,5 s (trống lăn rất nhỏ). *"Nope!"*: bong bóng vỡ "pop".
  - Blink: *"I'm a little beetle!"* Dot nhảy vào đứng cạnh. Hai bạn cùng bật tấm cánh "clack!" rồi khép lại, hai lần, như một màn đồng diễn. *"See? Beetle wing cases!"*
  - Kính "chụp" → sticker lên ô 2.
- **Bí mật 3 và cảnh đặc trưng (17,7–30,4 s):**
  - *"Blink, any more secrets?"* — *"No!"* (Blink khoanh tay, quay mặt đi). Nhưng đuôi tự nháy "blink-blink-blink". Blink đỏ mặt: *"Okay, yes."*
  - *"Some fireflies flash a secret code!"* Trong kính, Blink nháy mẫu của mình: ngắn, ngắn, nghỉ, dài. Từng chấm, từng gạch hiện dưới kính như một dải mật mã. Từ bãi cỏ xa, sau một nhịp nghỉ, một đốm sáng thấp nháy đáp.
  - **Cảnh đặc trưng:** kính lùi ra toàn cảnh. Chirp kéo "chirp-chirp" giữ nhịp. Blink: *"Light up, everyone!"* Cả vườn nháy theo nhịp dế thành từng làn sóng sáng. Crumb nhún nhảy. Bóng Rollo lăn viên tròn ngang mặt trăng (trứng phục sinh).
  - Kính "chụp" đám đom đóm.
- **Sổ (30,5–34,95 s, 4,45 s):**
  - Máy xuyên qua mặt kính, hình hoá thành sticker 3, lùi ra lộ trang sổ. Ô 1 và ô 2 từ thanh trên bay xuống đúng chỗ trên trang: đủ ba sticker.
  - Albie: *"Six legs? In you go!"* Blink bay vòng quanh, trang giấy của Albie đếm chân "tíc-tíc-tíc". Đúng chữ "In you go!", Albie há miệng thật to và Blink lao vào trang sổ. Một sticker Blink tí hon bật lên, sáng đèn; Albie nảy lên, khép miệng "ực".
- **Gag và kết (34,95–44 s):**
  - Lật trang về vườn đêm. Miss Loupe giơ kính ngắm trăng, ánh lóe "ting" trên vành kính. Dưới cỏ, một đốm sáng nhỏ nháy đáp một cái. Lóe lần nữa, đốm sáng nháy hai cái.
  - *"Is it winking at me?"* Miss Loupe nháy mắt, cho kính lóe ba lần. Đốm sáng nháy đáp ba lần rồi bay vút lên vui sướng.
  - Miss Loupe hỏi người xem: *"Can YOU blink a secret code?"*
  - Chữ móc trở lại đúng chỗ khung 0. Đốm sáng bay về phía máy, phình thành vòng tròn sáng, mở về đúng khung đầu (vòng lặp).

**Thông điệp:** một bài học thấy được bằng mắt. Ánh sáng của đom đóm là "ánh sáng lạnh"; đom đóm là bọ cánh cứng; đom đóm "nói chuyện" bằng những nhịp nháy. Trẻ có thể thử nháy mắt theo một nhịp riêng của mình (câu hỏi kết).

## 3. Benchmark

| Tác phẩm | Học | Không lấy |
|---|---|---|
| SHORT-001, 004 của chính kênh (tập A cũ) | Ba bí mật, sticker, Albie, chữ móc trở lại | Logo 2 s, đoạn không lời dài, sổ đứng yên 8–10 s (bản phân tích) |
| SHORT-006 của chính kênh | Kính lớn kèm máy trôi, phụ đề ở `SAFE.subY`, chuyển cảnh kính → sổ | Bối cảnh, gag, nhạc |
| LONG-001, chương 4 | Dữ kiện đã kiểm, giọng Blink, cách dựng lời đáp (đốm đáp thấp, sau một nhịp nghỉ) | Cảnh trong phòng tuyết, câu "I'm not glowing!" |
| [Bản phân tích 5 Short đầu](../../PHAN-TICH-SHORTS/README.md) | Những gì làm người xem rời đi ở tập A: logo dài, khung trống, kính đứng yên, sổ đứng yên, không lời quá 4 s | — |

Không dùng "Hey Duggee" ở bất kỳ đâu. Tên, nhân vật, thiết kế, kịch bản và nhạc đều của kênh.

## 4. Nhịp tập A, khoảng 45 s

| Giây | Nhịp của công thức | Tập này |
|---|---|---|
| 0–3 | Móc; ba ô "1 2 3" hiện khi chữ móc rời đi | Blink vụt qua kính, đuôi nháy; "Could your tummy glow?" — "My tummy can!"; ô "1 2 3" ở 2,75 s |
| 3,0–3,8 | Logo ≤ 0,8 s lồng vào cú lao vào kính | `titleSting`, cảnh `title` 3,0–3,8 |
| 3,8–10,6 | Bí mật 1 → ô 1 | Kẹo dẻo không chín: ánh sáng lạnh |
| 10,6–17,7 | Bí mật 2 có "Nope!" → ô 2 | "Is a firefly a fly?" — "Nope!" — họ bọ cánh cứng bật cánh |
| 17,7–30,4 | Bí mật 3 và cảnh đặc trưng → ô 3 | "No! … okay, yes"; mật mã ánh sáng; cả vườn nháy theo nhịp dế |
| 30,5–34,95 | Sổ ≤ 4,5 s, câu cửa miệng có hành động | Trang đủ ba sticker; Blink lao vào trang đúng "In you go!" |
| 34,95–44 | Gag kết, câu hỏi cho trẻ, chữ móc trở lại, vòng lặp | "Is it winking at me?"; "Can YOU blink a secret code?" |

Bí mật 3 dài hơn khung (12,7 s thay vì 10 s) vì gồm cả cảnh đặc trưng. Bí mật 1 ngắn hơn để bù.

## 5. Nhịp móc 0–3 s

| Giây | Việc | Kiểm |
|---|---|---|
| 0–1 | **Gây chú ý:** Blink vụt qua sát mặt kính, đuôi nháy chùm; kính chao, Miss Loupe giật nảy; máy đẩy nhanh vào. Chữ GLOWING / TUMMY?! nảy có tiếng | Chuyển động giây đầu ≥ 1,2 |
| 1–2 | **Phản ứng bằng hành động:** Blink lượn vòng rồi đáp xuống cỏ ba lá, quay ra máy, ưỡn ngực. Kính đuổi theo Blink | Chuyển động 1–2,5 s ≥ 2,0 |
| 2–3 | **Câu hỏi chưa giải:** "My tummy can!", đuôi Blink bùng sáng, cụm cỏ ửng vàng; ánh lóe trên kính; chữ móc rời đi, ô "1 2 3" hiện | Vì sao bụng đom đóm sáng? |

## 6. Danh sách cảnh

Mỗi 3–5 s có một chuyện mới (cột cuối). Thời gian là bản cuối, đã khớp với giọng thật trong `timeline.js`.

| # | Thời gian | Khung hình | Máy quay | Chuyện xảy ra | Chuyện mới |
|---|---|---|---|---|---|
| 1 | 0:00–0:03,0 | Trung, vườn đêm | Đẩy nhanh, rung khi Blink vụt qua | Móc (mục 5) | Hành động ở khung 0, câu hỏi, Blink trả lời |
| 2 | 0:03,0–0:03,8 | Kính phủ cả khung | Lao vào mặt kính rồi xuyên qua | Logo 0,8 s | Logo lồng vào chuyển cảnh |
| 3 | 0:03,8–0:07,0 | **Kính lớn** (r 310 px) | Kính trôi; trong kính đẩy vào đèn đuôi | "Let's zoom in!"; Crumb chìa kẹo dẻo vào ánh đèn | Nhân vật mới, đạo cụ mới |
| 4 | 0:07,0–0:10,6 | Kính lớn | Đẩy vào viên kẹo dẻo | Tíc tắc, kẹo không chín, râu dấu hỏi; "Look! No fire!"; Crumb ăn kẹo; chụp → ô 1 | **Khoảnh khắc wow 1**, sticker 1 |
| 5 | 0:10,6–0:13,5 | Kính lớn, lùi ra | Lùi | Bong bóng nghĩ con ruồi; "Is a firefly a fly?"; khựng; "Nope!" | Đoán sai, khựng |
| 6 | 0:13,5–0:17,7 | Kính lớn | Đẩy vào hai bạn | "I'm a little beetle!"; Dot nhảy vào; bật cánh "clack!" ×2; "See? Beetle wing cases!"; chụp → ô 2 | Nhân vật mới, đồng diễn, sticker 2 |
| 7 | 0:17,7–0:22,4 | Kính lớn | Trôi, rung khi đuôi tự nháy | "Any more secrets?" — "No!" — đuôi nháy lộ — "Okay, yes." | Gag tính cách |
| 8 | 0:22,4–0:25,2 | Kính lớn | Đẩy vào đuôi Blink | Mật mã: ngắn, ngắn, nghỉ, dài; dải chấm gạch; đốm xa nháy đáp | Bí mật 3 |
| 9 | 0:25,2–0:30,4 | **Toàn cảnh vườn** | Kính lùi ra thành toàn cảnh, máy trôi chậm | Chirp giữ nhịp; "Light up, everyone!"; cả vườn nháy thành sóng; Rollo lăn ngang trăng; chụp | **Cảnh đặc trưng, khoảnh khắc wow 2**, trứng phục sinh |
| 10 | 0:30,5–0:31,15 | — | Lao xuyên mặt kính | Chụp → sticker 3 → trang sổ | Chuyển cảnh qua kính |
| 11 | 0:31,15–0:34,95 | Toàn, trang sổ | Khoá, đẩy nhẹ khi Blink lao vào | Ô 1, 2 bay xuống trang; "Six legs? In you go!"; Blink lao vào trang, sticker Blink tí hon | Câu cửa miệng có hành động |
| 12 | 0:34,5–0:34,95 | — | Lật trang | Trang sổ lật về vườn đêm | Chuyển cảnh lật trang |
| 13 | 0:34,95–0:39,5 | Trung, Miss Loupe trên tảng rêu | Trôi chậm | Ánh lóe trên kính, đốm sáng nháy đáp ×1, ×2; "Is it winking at me?"; nháy mắt, lóe ×3, đáp ×3 | Gag |
| 14 | 0:39,5–0:44,0 | Trung → khung đầu | Đẩy chậm, rồi về bố cục khung 1 | "Can YOU blink a secret code?"; chữ móc trở lại; đốm sáng phình thành vòng tròn, mở về khung đầu | Câu hỏi cho trẻ, vòng lặp |

**Khoảnh khắc wow:**
1. Kẹo dẻo trong ánh đèn đuôi, kính r 310 px, viên kẹo rộng khoảng 15 % khung: ánh sáng chiếu vàng nhưng kẹo không chín.
2. Cả vườn nháy theo nhịp, toàn cảnh: hàng chục đốm sáng bật cùng lúc theo từng phách của Chirp, thành làn sóng từ gần ra xa.

## 7. Lời thoại

| # | Ai | Lời | Người nói trên hình | Ghi chú |
|---|---|---|---|---|
| L01 | Miss Loupe | Could your tummy glow? | Có (cầm kính ở khung 0) | Câu móc hỏi về chính trẻ |
| L02 | Blink | My tummy can! | Có | Câu đầu tiên của Blink trên kênh. "Mine can!" bị Whisper nghe thành "Mine can't" |
| L03 | Miss Loupe | Let's zoom in! | Có, cầm kính lớn | Câu cửa miệng (tốc độ chuẩn) |
| L04 | Miss Loupe | Fireflies make cold light! | Có | Bí mật 1. "Cold light" đúng chữ của nguồn |
| L05 | Blink | Look! No fire! | Có, trong kính | Không lửa; không nói "không hề nóng" (FACTS §1). "No fire at all!" bị base.en nghe thành "No fire owls" |
| L06 | Miss Loupe | Is a firefly a fly? | Có | Đoán sai |
| L07 | Miss Loupe | Nope! | Có | Câu cửa miệng, sau khựng ≤ 1 s |
| L08 | Blink | I'm a little beetle! | Có, trong kính | "I'm a beetle!" bị nghe thành "Beatles" |
| L09 | Miss Loupe | See? Beetle wing cases! | Có | Nói về chính tấm cánh đang thấy trên hình. Không nói "cứng" (đom đóm là bọ cánh cứng thân mềm) và không nói "All beetles" (có con cái không cánh) (FACTS §2) |
| L10 | Miss Loupe | Blink, any more secrets? | Có | |
| L11 | Blink | No! | Có, trong kính | Tật của nhân vật |
| L12 | Blink | Okay, yes. | Có, trong kính | |
| L13 | Miss Loupe | Some fireflies flash a secret code! | Có | Bí mật 3. "Some": không phải loài nào cũng nháy sáng |
| L14 | Blink | Light up, everyone! | Có, toàn cảnh | Lời mời của nhân vật, không phải dữ kiện. "All together now!" bị base.en nghe sai hẳn |
| L15 | Albie | Six legs? In you go! | Có | Câu cửa miệng, có hành động |
| L16 | Miss Loupe | Is it winking at me? | Có | Gag |
| L17 | Miss Loupe | Can YOU blink a secret code? | Có | Câu hỏi cho trẻ trả lời bằng cách nháy mắt, nối về câu móc |

Tập A đọc ở tốc độ chuẩn (`PACE = 1`).

## 8. Nhạc, tiếng động, chữ

- **Màu nhạc riêng: "Glow-Code Bossa"** (Si giáng trưởng, 120 BPM). Chi tiết: [MUSIC.md](MUSIC.md).
  - **Điệu riêng của tập (11/2026 lượt 2, chống trùng giữa các tập): bossa nova.** Không dùng điệu riêng của tập khác; cảnh sổ, gag và cao trào phối theo điệu của tập. Chi tiết: [MUSIC.md](MUSIC.md), [SOUND-PLAN.md](SOUND-PLAN.md), [`PHAN-TICH-SHORTS/NHAC-NEN-KENH.md`](../../PHAN-TICH-SHORTS/NHAC-NEN-KENH.md).
  - Sáo hát giai điệu; đàn hạc và marimba rải; bass gảy; bộ gõ latin (phách gỗ, shaker).
  - Mỗi cú nháy của đom đóm là một nốt glockenspiel: mật mã ánh sáng cũng là một câu nhạc.
  - Ở cảnh đặc trưng, tiếng dế của Chirp làm bộ gõ và cả ban nhạc vào.
  - Khác 003 (swing Rê thứ, vibraphone), 006 (đồng quê Mi trưởng) và mọi tập trước (Si giáng là giọng mới của kênh).
  - Nhạc hiệu 0,8 s mới (`sting()` trong `band.py`) đi với logo.
- **Tiếng động riêng của tập:**
  - đuôi nháy "bloop" (glockenspiel nhỏ);
  - Blink vụt qua "zip";
  - ánh lóe trên kính "ting";
  - đồng hồ tíc tắc;
  - bong bóng nghĩ vỡ "pop";
  - tấm cánh bật "clack";
  - dải mật mã "bíp";
  - tiếng dế của Chirp;
  - Rollo lăn "rù rù" rất nhỏ;
  - vòng tròn sáng mở về khung đầu.
  - Bảng cue: [SOUND.md](SOUND.md).
- **Chữ trên hình:**
  - GLOWING / TUMMY?! (móc);
  - logo BIG SECRETS / of tiny bugs (0,8 s);
  - ô "1 2 3";
  - "?" trên râu Crumb;
  - NOPE!, CLACK!, dải mật mã;
  - ba sticker: "Cold light", "Beetle!", "Light code".

## 9. Chi tiết để xem lại

- **Trứng phục sinh:**
  - bóng Rollo lăn viên tròn ngang mặt trăng ở cảnh đặc trưng;
  - mạng nhện đọng sương lấp lánh ở góc trái vườn (nhà của Spindle), thấy ở móc và ở gag.
- **Đạo cụ của gag được gài trước:** ánh lóe trên vành kính có ở móc (2,4 s) và ở mỗi cú "chụp" bí mật, mỗi lần một tiếng "ting".
- **Vòng mở "1 2 3":** ba ô sticker trống từ 2,75 s, lấp dần ở 10,6 s, 17,7 s và 31,3 s.
- **Vòng lặp:** khung cuối mở về khung đầu qua vòng tròn sáng của đốm đom đóm nhỏ.

## 10. Ghi chú sản xuất

**Giọng:**
- Blink dùng giọng đã chọn qua A/B ở LONG-001 (`bf_lily`, tốc độ 1, nâng 8 nửa cung bằng `voicefx.py`), đo được 324 Hz. Cách Miss Loupe (211 Hz) 7,4 nửa cung.
- Năm câu được đổi chữ vì Whisper nghe sai. Mỗi phương án được thử qua cả `small.en` và `base.en`; chỉ giữ những câu cả hai đều nghe đúng.

  | Câu cũ | Whisper nghe thành | Câu dùng |
  |---|---|---|
  | Mine can! | "Mine can't" (small) · "Mine tends" (base) | My tummy can! |
  | No fire at all! | "No fire owls" (base) | Look! No fire! |
  | I'm a beetle! | "I'm a Beatles" (base) | I'm a little beetle! |
  | Beetles have wing cases! | "Beatles have wing cases" (small) | See? Beetle wing cases! |
  | All together now! | "Oh, it's a double nerve" (base) | Light up, everyone! |

**Thư viện dựng mới** (kế hoạch nâng cấp §6, chỉ thêm, không đổi hàm cũ):
- `_shared/episode.js`: `titleSting()`, `stickerSlots()`, `flyBadge()`, `albumGulp()`.
- `_shared/audio/band.py`: `sting(v, root)`, nhạc hiệu 0,8 s; tập này dùng `root=70` (Si giáng).
- Dot mở tấm cánh: rig dùng chung chỉ khai báo `pose.open` mà chưa vẽ. Tập này vẽ một bản sao riêng (`DOT_OPEN` trong `props.js`) để không đổi hình của các tập khác.

**Sửa trong quá trình (từ khung tĩnh và `qa.py`):**
- Móc: Blink lúc đầu bay khuất sau kính, nên vẽ Blink trước Miss Loupe khi đang bay; máy đẩy gần hơn (z 1,42–1,68).
- Trong kính: Blink và Crumb bị cắt mép. Dời Crumb lại gần (x 525), Blink sang x 680, đặt lại điểm nhìn và độ phóng theo từng nhịp.
- Dấu "?" của Crumb và bong bóng nghĩ bị vành kính cắt: hạ xuống.
- Dot bị Crumb che ở bí mật 2: Crumb lùi sang trái, Dot to hơn (k 96), vẽ Dot sau Crumb.
- Ngoài kính lớn chỉ vẽ vườn, không vẽ nhân vật, để không có một "Crumb thứ hai" lấp ló sau lưng Miss Loupe.
- Cảnh cả vườn nháy lúc đầu quá xa: máy gần hơn (z 1,22–1,28), đom đóm to và đông hơn.
- Dải mật mã không hiện vì khoảng mờ đi bị đặt ngược: đã sửa.
- Readcheck: chữ "TUMMY?!" 215 px tràn khung khi nảy. Hạ còn 186 px (vẫn ≥ 180 px).
- `qa.py` CẢNH BÁO "hình gần đứng yên" ở 36,4–40,1 s (gag). Đã thêm: máy đẩy về phía đốm sáng khi Miss Loupe hỏi, cô nghiêng người và nhún mỗi lần đốm sáng nháy đáp, đốm sáng nảy lên mỗi lần nháy. Miss Loupe đứng gần giữa khung hơn (x 370) để không bị đẩy ra mép.
- Âm thanh: `sting()` trả về stereo nên cộng thẳng vào bus nhạc. Hạ nhạc dưới câu móc L01 (độ rõ lời 10,0 → 10,9 dB). Chừa thêm khoảng cho đỉnh thật (crest 11,0): −1,0 → −2,3 dBTP.
- Thumbnail 16:9: bỏ trăng sau chữ "LIGHT" (vàng trên kem, tương phản thấp) và mạng nhện sau lưng Blink.

## 11. Báo cáo giao

### Bảng `qa.py` (`out/qa.json`, lần chạy `build.sh` cuối ngày 09/11)

**42 đạt · 0 cảnh báo · 0 chưa đạt.** Whisper `small.en` và `base.en`: 17/17 câu. Readcheck: 6/6 chữ đủ thời gian đọc.

| Nhóm | Mục | Kết quả | Giá trị |
|---|---|---|---|
| 1 Hook | Lời đầu tiên | ĐẠT | 0.10 s |
| 1 Hook | Chuyển động trong giây đầu | ĐẠT | 14.25 |
| 1 Hook | Chuyển động 1–2,5 s | ĐẠT | 5.43 |
| 1 Hook | Nhạc ngay từ giây 0 | ĐẠT | -18 dBFS (0–0,5 s) |
| 1 Hook | Tiếng động ở khung đầu | ĐẠT | 6 tiếng ≤ 0,3 s |
| 1 Hook | Mật độ tiếng động 0–3 s | ĐẠT | 12 |
| 1 Hook | Cảnh tựa / logo | ĐẠT | 3.0–3.8 s (0.8 s) |
| 2 Giữ chân | Đoạn hình đứng yên ≥ 2,5 s | ĐẠT | không có |
| 2 Giữ chân | Khoảng "chết" (không lời, không tiếng động) ≥ 1,8 s | ĐẠT | không có |
| 2 Giữ chân | Độ dài trung bình mỗi cảnh | ĐẠT | 6.3 s (7 cảnh, 16 chuyển cảnh mạnh) |
| 2 Giữ chân | Tốc độ lời | ĐẠT | 1.43 từ/s (63 từ) |
| 2 Giữ chân | Đoạn không lời dài | ĐẠT | không có |
| 2 Giữ chân | Hình gần đứng yên kéo dài (kể cả khi có lời) | ĐẠT | không có |
| 2 Giữ chân | Câu cửa miệng có hành động | ĐẠT | 31.6 s: 3.60 |
| 2 Giữ chân | Cảnh sổ (tập A) | ĐẠT | 4.4 s |
| 3 Nội dung | Người nói có trên hình | ĐẠT | mọi câu sau 3 s |
| 4 Âm thanh | Độ to | ĐẠT | -14.0 LUFS |
| 4 Âm thanh | Đỉnh thật | ĐẠT | -2.3 dBTP |
| 4 Âm thanh | Lời rõ hơn nhạc + tiếng động | ĐẠT | thấp nhất 10.9 dB (L01) |
| 4 Âm thanh | Mật độ tiếng động | ĐẠT | 19.5 cue / 10 s (86 cue) |
| 4 Âm thanh | Độ chói (năng lượng > 6 kHz) | ĐẠT | 2.6 % |
| 4 Âm thanh | Tiếng tụt đột ngột | ĐẠT | 0 |
| 4 Âm thanh | Lỗ im của nhạc nền | ĐẠT | 0 giây dưới −45 dB |
| 4 Âm thanh | Âm lượng nhạc đổi theo cảnh | ĐẠT | 28 dB giữa giây to nhất và nhỏ nhất |
| 4 Âm thanh | Nhạc đổi theo cảnh: đoạn dài nhất cùng một kiểu | ĐẠT | 5.5 s ("No!" · lén lút, 17.0–22.5 s); 13 cảnh nhạc |
| 4 Âm thanh | Số điệu nhạc khác nhau | ĐẠT | 7: bounce, float, gallop, skip, sway, tension, tiptoe |
| 4 Âm thanh | Hai cảnh nhạc kề nhau khác rõ | ĐẠT | mọi cặp khác nhau ≥ 2 điểm |
| 4 Âm thanh | Câu đáp của nhạc giữa các câu thoại | ĐẠT | 16 câu đáp (13 tự động, 3 viết tay) |
| 4 Âm thanh | Nhạc có nhịp liền | ĐẠT | 100% số giây có ≥ 3 nốt (trung vị 6 nốt/s) |
| 5 Hình ảnh | Khung trống / đen | ĐẠT | 0 khung |
| 5 Hình ảnh | Khung hình và tốc độ | ĐẠT | 1080×1920, 30 fps |
| 5 Hình ảnh | Vùng giao diện Shorts | ĐẠT | không chạm |
| 5 Hình ảnh | Phụ đề che mặt nhân vật | ĐẠT | không có |
| 5 Hình ảnh | Chớp sáng mạnh | ĐẠT | tối đa 1 lần/giây |
| 5 Hình ảnh | Độ rực màu | ĐẠT | 0.65 |
| 6 Xem lại | Khung cuối nối khung đầu | ĐẠT | chênh 10.6/255 |
| 6 Xem lại | Câu hỏi kết cho trẻ | ĐẠT | "Can YOU blink a secret code?" ở 40.5 s |
| 6 Xem lại | Cảnh cuối gợi lại câu móc | ĐẠT | có (chữ móc trở lại) |
| 6 Xem lại | Chi tiết để tìm lại | ĐẠT | có |
| 7 Giọng | Cao độ từng nhân vật | ĐẠT | loupe 211 Hz, blink 324 Hz, albie 97 Hz |
| 7 Giọng | Các giọng khác nhau rõ | ĐẠT | gần nhất 7.4 nửa cung |
| 7 Giọng | Giọng trẻ em: blink | ĐẠT | 324 Hz |

### Checklist thủ công (`_shared/QUALITY.md`)

- [x] 0–1 s gây chú ý: Blink vụt qua sát mặt kính, đuôi nháy chùm; Miss Loupe giật nảy; máy đẩy vào; chữ móc nảy. 1–2 s phản ứng bằng hành động: Blink lượn vòng, đáp xuống, quay ra máy. 2–3 s bí ẩn: "My tummy can!", đuôi bùng sáng.
- [x] Mỗi 3–5 s có chuyện mới (bảng cảnh, mục 6). `qa.py`: không có đoạn hình gần đứng yên nào.
- [x] Có gag và bất ngờ: kẹo dẻo không chín, "No!" nhưng đuôi tự nháy lộ, Blink lao vào trang sổ, đốm sáng nháy đáp ánh lóe trên kính. Nhân vật đúng tính cách: Blink hay cười, chối rồi thú nhận; Crumb tò mò, tham ăn; Miss Loupe tò mò, nháy mắt.
- [x] Nội dung đúng `FACTS.md`: "cold light", "No fire" (không nói "not hot"), "beetle", "wing cases" (không nói "hard"), "Some fireflies". Hợp 4–8 tuổi, không đáng sợ: Blink tự lao vào trang sổ, cười; không ai bị đau.
- [x] Có bài học thấy được: kẹo dẻo không chín trong ánh đèn; hai bạn bọ cánh cứng cùng bật tấm cánh; dải chấm gạch của mật mã.
- [x] Biểu cảm đọc được ở cỡ điện thoại; không che mặt, không lơ lửng. Ở cuối móc (khoảng 2,1–3,0 s), khi máy đẩy vào Blink, kính của Miss Loupe ra khỏi mép trái gần một nửa; mặt cô vẫn trong khung. Cố ý để Blink làm tâm khung lúc "My tummy can!", nhưng nên xem lại trên điện thoại. Dot ở bí mật 2 hơi nhỏ trong kính nhưng vẫn thấy rõ mặt và tấm cánh đỏ cam.
- [x] Nhạc đổi theo cảnh (13 cảnh nhạc, 7 điệu); màu "Glow-Code Bossa" (Si giáng, sáo, glockenspiel, bộ gõ latin) khác các tập trước.
- [ ] **Nghe lại cả phim**: mình không nghe trực tiếp được. Phần nhạc đã kiểm bằng số đo (nhịp liền 100 %, câu đáp 16, đổi cảnh), còn cảm nhận khi nghe (nhất là nhạc hiệu 0,8 s mới và tiếng dế giữ nhịp) cần chủ kênh nghe lại.
- [x] Kết có điểm nhấn (Miss Loupe nháy mắt, đốm sáng nháy đáp ba lần rồi bay vút lên) và nối về đầu bằng vòng tròn sáng.
- [x] Không kêu gọi bình luận hay đăng ký; câu hỏi kết là câu trẻ trả lời bằng cách nháy mắt ("Can YOU blink a secret code?").
- [x] Tựa móc nảy ở khung đầu có tiếng; Miss Loupe giật mình ngay khung 0, Blink phản ứng trong 1 s.
- [x] Chuyển cảnh kính → sổ: "chụp" và match cut qua sticker 3; sticker 1, 2 bay từ thanh trên xuống trang.
- [x] Cảnh cuối gợi lại câu móc: chữ móc trở lại đúng chỗ khung 0; đốm sáng mở về khung đầu.
- [x] Mỗi nhân vật có lời một giọng riêng; Blink có giọng trẻ em (324 Hz).
- [x] *(11/2026)* Kính lớn r 310 px; bí mật xảy ra thành chuyển động (kẹo dẻo, tấm cánh bật, đuôi nháy mật mã); cảnh đặc trưng là toàn cảnh cả vườn nháy.
- [x] *(11/2026)* "Six legs? In you go!" có hành động (Albie đếm, há miệng, "đớp"; Blink lao vào trang). Cảnh sổ 4,45 s; vòng mở "1 2 3" từ 2,75 s; logo 0,8 s lồng vào cú lao vào kính.
- [x] *(11/2026)* Người nói có trên hình ở mọi câu sau 3 s; đạo cụ của gag (ánh lóe trên kính) gài ở móc và ở hai cú chụp; ẩn dụ "secret code" đi kèm hình mẫu nháy và dải chấm gạch.
- [x] *(11/2026)* Phụ đề, chữ và mặt nhân vật ngoài vùng giao diện Shorts (`safesheet.py`, 12 khung); phụ đề không che mặt; chữ móc và CLACK! có bóng mực đậm; nền tím đêm tương phản với Blink xanh bạc hà, Crumb hổ phách, Dot đỏ cam.
