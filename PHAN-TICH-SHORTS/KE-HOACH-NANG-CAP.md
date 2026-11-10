# Kế hoạch nâng cấp Short của "Big Secrets of Tiny Bugs"

Ngày 09/11/2026. Làm theo [`Task.md`](../Task.md): từ [bản phân tích 5 Short đầu](README.md), lập kế hoạch nâng cấp cho các Short hiện có và các Short về sau.

## 1. Quyết định và phạm vi

Chủ kênh đã chốt ngày 09/11/2026:

| # | Quyết định | Hệ quả |
|---|---|---|
| 1 | **Giữ nguyên SHORT-001 đến 005**, không dựng lại | Năm tập này là **mốc so sánh** sau khi đăng (mục 2). Mọi nâng cấp áp dụng từ SHORT-006 |
| 2 | **Tập A: logo và nhạc hiệu ≤ 0,8 s, lồng vào cú lao vào kính** ngay sau móc | Bỏ khung tựa 2 s đứng riêng. Video dài giữ nhạc hiệu 2 s |
| 3 | **Tập A dài khoảng 45 s** (22–23 ô nhịp ở 120 BPM), thay cho 50–52 s | Cắt các đoạn trũng, không cắt nội dung: vẫn 3 bí mật, cảnh đặc trưng, sổ, gag |

Kết quả phân tích ngắn gọn:
- Cả 5 tập đạt chuẩn kỹ thuật của `qa.py`.
- Đoạn trũng lặp lại theo cùng một mẫu:
  - kính đứng yên trên một hình nhỏ;
  - câu cửa miệng nói trên trang sổ đứng yên;
  - tập A có những đoạn dài không lời;
  - logo 2 s ngay sau móc;
  - phụ đề và mặt Loupe nằm trong vùng giao diện YouTube che.
- Điểm: 001 6,1 · 002 7,3 · 003 7,1 · 004 6,3 · 005 7,0.

**Đã làm trong lượt này:**
- Bộ quy tắc [`_shared/QUALITY.md`](../_shared/QUALITY.md) có thêm các quy tắc ghi *(11/2026)*.
- [`_shared/qa.py`](../_shared/qa.py) đo được phần lớn các quy tắc đó.
- Hai công cụ mới:
  - [`_shared/tools/safezone.mjs`](../_shared/tools/safezone.mjs) đo vùng an toàn và người nói;
  - [`_shared/tools/safesheet.py`](../_shared/tools/safesheet.py) ghép khung có phủ vùng che.
- `stage.js` và `episode.js` có thêm bộ ghi vị trí mặt và phụ đề. Phần này chỉ ghi, không vẽ: đã kiểm 11 khung tĩnh của 001, 002, 004, 005 trước và sau khi sửa, khớp từng byte.
- Công thức tập A trong [`KE-HOACH-PHAT-TRIEN-KENH.md`](../KE-HOACH-PHAT-TRIEN-KENH.md) §4 và độ dài tập A trong [`DE-CUONG-CAC-BO.md`](../DE-CUONG-CAC-BO.md) đã cập nhật.

**Chưa làm:**
- Dựng SHORT-006 trở đi. Mỗi tập cần `FACTS.md`, treatment, giọng…, theo lịch ở mục 8.
- Các hàm dựng hình mới ở mục 6. Chúng sẽ được làm cùng tập đầu tiên dùng tới.

## 2. Năm tập cũ là mốc so sánh

Năm tập đăng đúng lịch, không sửa. Sau khi đăng, so biểu đồ giữ chân trong YouTube Studio với các **điểm rơi dự đoán** sau (mục 7 của từng báo cáo, mức Cao trở lên):

| Tập | Ngày đăng | Điểm rơi dự đoán [DĐ] | Cùng loại sẽ so với |
|---|---|---|---|
| [001](SHORT-001.md) (A, 52 s) | Thứ Hai 16/11 | 4–6 s logo · 16–18 s câu móc đã có lời đáp · 33,3–42,0 s không lời · 42–48 s sổ đứng yên | 007, 010 |
| [002](SHORT-002.md) (B, 22 s) | Thứ Tư 18/11 | 4,5–8,0 s kính đứng · 14,5–17,0 s câu cửa miệng đứng | 006, 008, 009 |
| [003](SHORT-003.md) (B, 24 s) | Thứ Sáu 20/11 | 4,0–9,5 s kính đứng · 13,0–15,5 s câu cửa miệng đứng | 006, 008, 009 |
| [004](SHORT-004.md) (A, 52 s) | Thứ Hai 23/11 | 4–7 s logo và khung trống · 21,7–30,3 s và 32–38 s không lời · 38–45,5 s sổ đứng yên | 007, 010 |
| [005](SHORT-005.md) (B, 24 s) | Thứ Tư 25/11 | 6,0–10,5 s kính đứng · 15,5–18,6 s câu cửa miệng đứng | 006, 008, 009 |

Bảng cải thiện ở mục 11 và 12 của từng báo cáo vẫn dùng được nếu sau này dựng lại các tập này, ví dụ khi ghép vào video dài dạng sổ tổng hợp (C1).

## 3. Công thức mới của tập A, khoảng 45 s

Khung nhịp ở 120 BPM. Đây chỉ là ngữ pháp: mỗi tập vẫn phải có côn trùng, bối cảnh, cảnh đặc trưng, gag và lời dẫn riêng (KE-HOACH §4.2).

| Giây | Nhịp | Yêu cầu |
|---|---|---|
| 0–3 | **Móc** | Va chạm hoặc phản ứng mạnh trong 1 s đầu; chữ móc đủ ở khung 0. Ba ô sticker trống **"1 2 3"** hiện khi chữ móc rời đi: vòng mở, lý do để xem hết |
| ≈3–3,8 | **Logo và nhạc hiệu ≤ 0,8 s** | Lồng vào cú lao vào kính. Khai báo cảnh `title` dài 0,8 s |
| 3,8–14 | **Bí mật 1** | Kính lớn (r ≥ 300 px) hoặc cận toàn khung; bí mật "xảy ra" thành chuyển động, mỗi nhịp một tiếng → ô sticker 1 sáng lên |
| 14–24 | **Bí mật 2, có "Nope!"** | Đoán sai → khựng ≤ 1 s → đáp án là âm thanh đầu tiên sau khoảng lặng → ô 2 |
| 24–34 | **Bí mật 3 và cảnh đặc trưng** | Một cú hình chỉ thủ pháp kính làm được → ô 3 |
| 34–38 | **Sổ** | "Six legs? In you go!" nói **trong lúc** Albie đớp sticker. Trang đủ 3 sticker đứng ≥ 3 s để chụp màn hình, nhân vật trên trang vẫn chuyển động |
| 38–45 | **Gag kết** | Đạo cụ đã được gài trước. Câu hỏi cho trẻ trả lời to, chữ móc trở lại, vòng lặp |

Không có đoạn nào dài hơn 4 s không lời. Không có cảnh giới thiệu lặp lại điều móc vừa cho thấy.

## 4. Bản B, 20–24 s

Giữ khung KE-HOACH §4.3: móc mới, một bí mật, sticker và Albie, gag kết mới. Thêm ba ràng buộc:
1. Kính đứng ≤ 3 s: bí mật xảy ra trong kính, kính hoặc máy luôn chuyển động.
2. "Six legs? In you go!" có hành động: nhân vật bay hoặc nhảy vào sổ đúng lúc nói.
3. Người nói có trên hình, nhất là câu gag ("NOPE!", "Oops! Sorry!") và câu hỏi cuối.

## 5. Quy tắc mới và cách kiểm

Chi tiết từng quy tắc ở [`QUALITY.md`](../_shared/QUALITY.md), các dòng ghi *(11/2026)*.

| # | Vấn đề đã thấy | Quy tắc mới | Kiểm |
|---|---|---|---|
| 1 | Kính đứng 2–5,5 s ở cả 5 tập | Kính đứng ≤ 3 s; bí mật xảy ra thành chuyển động | `qa.py`: hình gần đứng yên > 3 s, kể cả khi có lời |
| 2 | Bí mật nằm trong kính rộng khoảng 30 % khung; vòi bướm chỉ là một nét mảnh | Kính r ≥ 300 px hoặc cận toàn khung; chi tiết chính rộng ≥ 10 % khung | Khung tĩnh ở cỡ điện thoại |
| 3 | "Six legs? In you go!" đứng yên ở cả 5 tập | Nói trong lúc có hành động | `qa.py`: chuyển động trong câu ≥ 2,0 |
| 4 | Tập A có những đoạn 6–8,7 s không lời | Không đoạn nào > 4 s không lời | `qa.py` |
| 5 | Tập A: logo 2 s rồi một cảnh giới thiệu lặp lại | Logo ≤ 0,8 s trong cú lao vào kính; không lặp lại điều móc vừa cho thấy | `qa.py` (cảnh tựa) + treatment |
| 6 | Tập A: cảnh sổ 8–10 s gần đứng yên | Sổ ≤ 4,5 s, có hành động | `qa.py` (cảnh `album`) |
| 7 | Tập A không có lý do để xem hết | Vòng mở "1 2 3" | Treatment + khung tĩnh |
| 8 | Móc dựa vào chữ (003, 005) | 1–2,5 s nhân vật phản ứng bằng hành động | `qa.py`: chuyển động 1–2,5 s ≥ 2,0 |
| 9 | Phụ đề và mặt Loupe trong vùng giao diện YouTube | Phụ đề dưới cùng ở 1500 px (`SAFE.subY`); chữ và mặt ngoài vùng che | `qa.py` + `safesheet.py` |
| 10 | Người nói vắng mặt (002, 003) | Từ giây 3, người nói có trên hình; lời dẫn có chủ đích ghi `off` | `qa.py` |
| 11 | Gag cây kem không được gài trước (004) | Đạo cụ của gag xuất hiện trước đó | Treatment + checklist |
| 12 | "Tiny cows" chưa được giải thích (004) | Nói rõ nghĩa ẩn dụ ("like milk") | Treatment + `FACTS.md` |
| 13 | Hai con kiến nâu giống hệt nhau (005) | Nhân vật cần phân biệt phải khác nhau ở hình | Khung tĩnh |
| 14 | Chữ tương phản thấp, mây đè chữ (004); nền hồng trên hồng (005) | Chữ có viền hoặc nền đặc, nằm trên hiệu ứng; nền tương phản với nhân vật | Khung tĩnh |

**Kiểm thử các mục đo mới trên 5 tập mốc:**
- Các mục mới bắt đúng những gì bản phân tích đã thấy bằng mắt: bảng hiệu chỉnh ở cuối [`QUALITY.md`](../_shared/QUALITY.md#hiệu-chỉnh-các-mục-đo-mới-112026).
- Không báo nhầm ở móc của 002, đoạn kính trượt của 004 và gag của 005.
- Cả 5 tập vẫn không có mục CHƯA ĐẠT; chúng có 4–8 CẢNH BÁO, đúng với vai trò mốc.
- LONG-001 không có cảnh báo mới.

**Cách dùng:**
- `qa.py` tự chạy `safezone.mjs` với Short. `build.sh` mẫu của SHORT-004 dùng được nguyên.
- Lời dẫn ngoài hình có chủ đích thì ghi `off: 'lời dẫn'` vào câu trong `timeline.js`.
- Phụ đề của tập mới: `subtitle(c, card, t, 510, SAFE.subY)` (import `SAFE` từ `/_shared/episode.js`).

## 6. Thư viện dựng làm cùng SHORT-006 và 007

Làm trong tập đầu tiên dùng tới, kiểm bằng khung tĩnh của tập thật, rồi mới gom vào [`_shared/episode.js`](../_shared/episode.js) và [`_shared/audio/band.py`](../_shared/audio/band.py). Hàm cũ giữ nguyên để không đổi hình của 5 tập mốc.

| Hàm | Làm gì | Tập đầu tiên |
|---|---|---|
| `titleSting()` + nhạc hiệu 0,8 s trong `band.py` | Logo "Big Secrets of Tiny Bugs" bật lên trong mặt kính lúc máy lao vào, dài ≤ 0,8 s. Thêm một biến thể của `jingle()`; `jingle()` 2 s giữ nguyên cho video dài | 007 |
| `stickerSlots()` | Ba ô tròn nét đứt "1 2 3", nhỏ, dưới thanh trên (y ≈ 200–300). Hiện khi chữ móc rời đi, không đè `hookTitle`. Mỗi ô sáng lên kèm tiếng `stamp` khi kính "chụp" một bí mật. Ở cảnh sổ, ba ô bay về đúng chỗ của chúng trên trang | 007 |
| `albumGulp()` | Câu cửa miệng có hành động, dựng trên `albieAt` (hop, page, curl): sticker bay từ kính tới, Albie mở trang "đớp" đúng chữ "In you go!", nảy lên một nhịp, kèm tiếng `paper` và `boing` | 006 |
| Kính lớn + máy trôi | Kính r ≥ 300 px; máy đẩy vào chậm (3–5 %/s) và lắc nhẹ để kính không bao giờ đứng hẳn. Hoạt cảnh trong kính gắn với nhịp của bí mật | 006 |
| `subtitle(…, SAFE.subY)` | Đã có. Phụ đề ở tâm 1400 px, đáy trên 1500 px. Khi có phụ đề, mặt nhân vật đứng trên 1250 px hoặc lệch hẳn sang bên | 006 |

**Trạng thái ngày 09/11:** [SHORT-006](../films/short-006/TREATMENT.md) đã dựng xong. `qa.py` cho 41/41 mục đạt, gồm cả các mục mới.
- Đã dùng thật trong `film.js` của tập: kính lớn kèm máy trôi, và phụ đề ở `SAFE.subY`.
- Câu cửa miệng ở 006 có hành động bằng cú Crumb nhảy ùm vào sổ. Cú nhảy này là của riêng tập nên chưa thành hàm chung.
- `albumGulp()`, `titleSting()` và `stickerSlots()` chờ SHORT-007.

**Trạng thái ngày 09/11 (tối):** [SHORT-007](../films/short-007/TREATMENT.md) đã dựng xong, là tập A đầu tiên theo công thức 45 s (44 s). `qa.py` cho 42/42 mục đạt, 0 cảnh báo.
- Đã gom vào `_shared/episode.js`: `titleSting()`, `stickerSlots()`, `flyBadge()`, `albumGulp()`. Đã thêm `sting(v, root)` vào `_shared/audio/band.py`. Chỉ thêm, không đổi hàm cũ.
- Ở 007, câu cửa miệng có hành động bằng `albumGulp()`: trang giấy của Albie đếm chân Blink, Albie há miệng rồi "đớp" đúng chữ "go!" khi Blink lao vào trang (đo được 3,60, ngưỡng 2,0).
- Cảnh sổ 4,45 s; logo 0,8 s ở 3,0–3,8 s; ô "1 2 3" từ 2,75 s.

**Trạng thái ngày 10/11:** [SHORT-008](../films/short-008/TREATMENT.md) (bản B, 22 s) đã dựng xong. `qa.py` cho 50/50 mục đạt, 0 cảnh báo, gồm cả 8 mục Sound Design Plan.
- Ghi chú 008 ở mục 7: móc là hành động (Miss Loupe hơ tay bên "lửa trại" Blink, băng mọc trên tay); bí mật "các chất trộn lại tạo ánh sáng" xảy ra trong kính lớn thành tám cú "pop" có tiếng, buồng sáng bừng lên.
- Câu cửa miệng có hành động bằng `albumGulp()` (Blink lao vào trang đúng "go!"; đo được 2,83).

**Trạng thái ngày 10/11 (chiều):** [SHORT-009](../films/short-009/TREATMENT.md) (bản B, 24 s) đã dựng xong. `qa.py` cho 50/50 mục đạt, 0 cảnh báo.
- Ghi chú 009 ở mục 7: ruồi (Fizz) đáp xuống cạnh Blink ở khung 0 và là đạo cụ của gag; Fizz khác hẳn Blink ở hình (xanh than, mắt đỏ, hai cánh trong).
- Fizz được thiết kế và thêm vào thư viện nhân vật ([`cast/fizz.js`](../_shared/characters/cast/fizz.js), nhóm khách mời `GUESTS`).
- Không trùng bí mật 2 của 007: móc mới ("Which one is a fly?"), bí mật là trò đếm cánh (ruồi 2, Blink 4) trong kính lớn.

**Trạng thái ngày 10/11 (tối):** [SHORT-010](../films/short-010/TREATMENT.md) (tập A, 44 s) đã dựng xong. `qa.py` cho 51/51 mục đạt, 0 cảnh báo, gồm cả 8 mục Sound Design Plan.
- Ghi chú 010 ở mục 7: móc là hành động (Crumb đang rón rén ở khung 0; Zip thấy Crumb dù Crumb ở sau lưng nó, vụt lên). Cảnh mắt kép phủ cả khung: kính đẩy vào vòm mắt rồi phình ra, hàng trăm ô thấy được, mỗi ô phản chiếu một Crumb tí hon. Lời chỉ nói "thousands".
- Zip được thiết kế và thêm vào thư viện nhân vật ([`cast/zip.js`](../_shared/characters/cast/zip.js), nhóm khách mời `GUESTS`).
- Không trùng SHORT-011 (khung chia đôi tầm nhìn): tập này không vẽ góc nhìn của chuồn chuồn; bay lùi chỉ là câu trả lời cho "Nope!" và gag.

## 7. Ghi chú cho các tập sắp tới

Lấy từ [`DE-CUONG-CAC-BO.md`](../DE-CUONG-CAC-BO.md), đối chiếu với quy tắc mới. Đây là đầu vào cho `TREATMENT.md` của từng tập, chưa phải kịch bản. Dữ kiện của các tập này đang ở mức **[Cao – chưa kiểm]**, nên phải qua `FACTS.md` trước khi viết lời.

| Tập | Loại · ngày đăng | Lưu ý theo quy tắc mới |
|---|---|---|
| 006 Ants Run a Tiny Cow Farm?! | B · Thứ Sáu 27/11 | Trùng đề tài với bí mật 3 của 004, nên cảnh và nhịp phải mới (QUALITY §3). Móc trong đề cương là chú rệp đứng yên → mở bằng giọt ngọt bật ra "boing" ở khung 0. Nói rõ "like milk" (nguồn của 004 có từ "milk"). Gag giọt ngọt nảy tưng tưng: giọt đã có ở móc nên được gài sẵn |
| 007 Fireflies Talk in Secret Light Codes! | A · Thứ Hai 30/11 | **Tập A đầu tiên theo công thức 45 s** (logo 0,8 s, ô "1 2 3", sổ ≤ 4,5 s). Vườn đêm tối có rủi ro khung đen, độ rực < 0,35 và ít chuyển động → mở bằng một chùm chớp sáng của Blink và kính giật mình, không mở bằng một đốm sáng đơn độc. Blink có lời lần đầu: thử A/B giọng, ≥ 240 Hz, cách các giọng khác ≥ 3 nửa cung. Gag "Is it winking at me?" cần gài ánh lóe trên kính từ sớm |
| 008 A Light That Doesn't Get Hot?! | B · Thứ Tư 02/12 | Móc đã là hành động (hơ tay). Bí mật "các chất trộn lại tạo ánh sáng" phải hiện to, thành chuyển động, không chỉ là một đốm sáng trong kính |
| 009 Is a Firefly a Fly? Nope! | B · Thứ Sáu 04/12 | Móc trong đề cương chỉ có chữ → cho con ruồi và Blink đứng cạnh nhau, ruồi đáp xuống. Ruồi là đạo cụ của gag, nên phải có từ móc. Hai nhân vật phải khác nhau rõ ở hình |
| 010 Dragonflies See Behind Their Heads! | A · Thứ Hai 07/12 | Móc đã là hành động (Crumb rón rén). Cảnh mắt kép "hàng nghìn Crumb tí hon" là khoảnh khắc wow: cận toàn khung, không để trong kính nhỏ. Chỉ nói "thousands" |
| 011 Sneaking Up on a Dragonfly... Oops! | B · Thứ Tư 09/12 | Chia khung đôi: mỗi nửa phải đọc được ở cỡ điện thoại, phụ đề không cắt ngang chỗ chia |
| 012 This Bug Can Fly Backwards! | B · Thứ Sáu 11/12 | Gag "Watch the corners!" là câu của Albie, nên Albie phải có trên hình khi nói |
| 013 Grasshoppers Hide Their Ears in a Funny Place! | A · Thứ Hai 14/12 | Móc "Chirp và Hop đứng cạnh nhau" đang tĩnh → cả hai giật mình vì một tiếng động, mỗi con "nghe" bằng một chỗ khác. Chirp và Hop phải khác nhau rõ ở hình (bài học từ 005). Đây là tập thử "Nope!" ở bí mật 1 (KE-HOACH §10): chỉ đổi biến số đó |

## 8. Lịch dựng

Quy tắc kho tập (KE-HOACH §5): luôn có **ít nhất 2 tập A dựng xong mà chưa đăng**. Hiện có 001 và 004. Sau mỗi tập A được đăng thì phải có một tập A mới dựng xong:

| Hạn dựng xong | Tập | Lý do |
|---|---|---|
| **Chủ Nhật 15/11** | **007** (A) | 001 đăng ngày 16/11; kho còn 004 và 007. **Đã xong 09/11** |
| Thứ Sáu 20/11 | 006 (B) | Bản B xong trước ngày đăng 1 tuần. **Đã xong 09/11** |
| Chủ Nhật 22/11 | **010** (A) | 004 đăng ngày 23/11 |
| 25/11 và 27/11 | 008, 009 (B) | Trước ngày đăng 1 tuần |
| Chủ Nhật 29/11 | **013** (A) | 007 đăng ngày 30/11 |
| 02/12 và 04/12 | 011, 012 (B) | Trước ngày đăng 1 tuần |
| Chủ Nhật 06/12 | **016** (A, đặc biệt mùa đông) | 010 đăng ngày 07/12 |

**Rủi ro (đã qua):** 007 còn 6 ngày; đã dựng xong ngày 09/11 cùng các hàm `titleSting`, `stickerSlots`, `albumGulp`. Tập A kế tiếp là 010 (hạn 22/11).
- Nếu không kịp, theo quy tắc kho tập: kho dưới 1 tập thì chuyển sang 1 tập A mỗi 2 tuần.
- Không lấp chỗ trống bằng một bản gần giống tập cũ.
- Nên làm 007 trước 006, vì 007 cần nhiều hàm mới hơn và có hạn sớm hơn.

## 9. Đo sau khi đăng

- **So "công thức cũ" với "công thức mới"**, cùng loại tập:
  - tập A: 001 và 004 so với 007 và 010;
  - bản B: 002, 003 và 005 so với 006, 008 và 009.
- **Chỉ số trong YouTube Studio** (bảng theo dõi ở KE-HOACH §10):
  - *Viewed vs. swiped away*: móc có giữ được người xem không;
  - *Average % viewed*: trên 100 % là có người xem lại;
  - biểu đồ giữ chân ở bốn chỗ: giây 4–8 (logo cũ so với mới), nhịp kính, cảnh sổ, 5 s cuối.
- **Đối chiếu dự đoán với thật:** đặt các điểm rơi dự đoán ở mục 2 lên biểu đồ thật.
  - Chỗ dự đoán đúng: giữ quy tắc tương ứng.
  - Chỗ dự đoán sai: xem lại quy tắc và ngưỡng trong `qa.py`, ghi thay đổi vào bảng hiệu chỉnh của `QUALITY.md`.
- **Mốc xem lại:**
  - khoảng 14/12, khi 007 và 010 đã có 1 tuần số liệu;
  - 11/01/2027, mốc đánh giá của KE-HOACH §10.
- **Giới hạn:** đề tài, côn trùng và nhân vật khác nhau giữa các tập, và mẫu còn nhỏ. So sánh này chỉ cho biết công thức mới có tốt hơn nói chung không, không tách được tác động của từng quy tắc. Thử từng biến số (KE-HOACH §10: kiểu câu móc, chữ ở khung đầu, vị trí "Nope!"…) làm sau, mỗi lần một biến.
