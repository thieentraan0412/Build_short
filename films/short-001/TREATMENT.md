# SHORT-001 · Bugs Hide Secret Senses in Their Legs! 🦶 — Treatment

**Tựa đăng YouTube:** *Bugs Hide Secret Senses in Their Legs! 🦶 | Big Secrets of Tiny Bugs* (tiếng Việt tham khảo: *Côn trùng giấu giác quan bí mật ở chân!*)

Tập A, SERIES-001 *Secret Senses*, lên sóng Thứ Hai 16/11/2026. Short dọc 1080×1920, 24 fps, **52 giây**, 120 BPM (26 ô nhịp). Tiếng Anh: lời, chữ trên hình, phụ đề. Khán giả 4–8 tuổi xem cùng bố mẹ.

Đây là bản **dựng lại pilot** `films/bi-mat-ti-hon/` theo đề cương ([DE-CUONG-CAC-BO.md](../../DE-CUONG-CAC-BO.md), SHORT-001) và kế hoạch kênh ([§6 tập 1](../../KE-HOACH-PHAT-TRIEN-KENH.md)). Giữ nguyên câu chuyện, thêm năm thứ:

| Thêm | Ở đâu |
|---|---|
| Câu cửa miệng *"Let's zoom in!"* lần đầu kính vào | Bí mật 1, ngay trước cú phóng to |
| Nhạc hiệu 2 s, giống nhau mọi tập | Cảnh tựa 0:04–0:06, file dùng chung [`_shared/audio/band.py`](../../_shared/audio/band.py) |
| **Albie ra mắt**: cuốn sổ có mắt, bị sticker đầu tiên đánh thức, nói *"Six legs? In you go!"* | Cảnh sổ 0:40–0:48 |
| **Rollo lăn ngang bản đồ vườn** (trứng phục sinh "Find Rollo!" đầu tiên) | Cảnh kéo xa 0:36,2–0:39,8 |
| Giọng đọc có giấy phép rõ (§11.3), lời bí mật 3 rút gọn (§1.3), nhịp "Nope!" theo tật của Miss Loupe (§2.1) | Toàn tập |

Phong cách: "Khối Kẹo Phẳng" ([STYLE.md](../bi-mat-ti-hon/STYLE.md) của pilot). Nhân vật vẽ bằng rig dùng chung [`_shared/characters/`](../../_shared/characters/), không dùng `cast.js` của pilot. Dữ kiện và nguồn: [FACTS.md](FACTS.md).

## 1. Ba cấu trúc đã cân nhắc

| | Cấu trúc | Ưu | Nhược |
|---|---|---|---|
| A | **Giữ nguyên pilot, chỉ chèn thêm**: các phần mới đặt vào khe trống, không đổi cảnh nào | Ít rủi ro, lịch dựng ngắn | Albie chỉ là cuốn sổ có mắt dán vào cảnh cũ; "Let's zoom in!" chen vào làm bí mật 1 càng dày |
| B | **Albie dẫn chuyện**: sổ mở đầu tập, mỗi bí mật là một trang | Albie ra mắt rất rõ | Phá công thức §4.2 (móc bằng câu hỏi về cơ thể trẻ, Miss Loupe là người đi tìm); Albie chỉ được 1–2 câu |
| C | **Pilot + nhịp mới cho từng bí mật**: giữ khung móc → tựa → 3 bí mật → sổ → gag. Bí mật 1 dài thêm 2 s cho "Let's zoom in!" và một nhịp thở. Bí mật 2 đổi thành nhịp đoán sai của chính Miss Loupe ("On its head?" → "Nope!" → lặng → đáp án). Bí mật 3 rút lời, để cảnh kéo xa và Rollo tự nói. Cảnh sổ thành cảnh có nhân vật: Albie tỉnh dậy, nhận sticker, Miss Loupe đứng cạnh nói câu kết rồi chính kính của cô mở sang gag | Giữ mọi điểm mạnh của pilot (§1.2), sửa đúng các điểm yếu §1.3 | Nhiều việc dựng hơn A |

**Chọn C.** Kế hoạch yêu cầu "giữ nguyên pilot" về nội dung, nhưng các thay đổi chỉ có giá trị khi chúng làm việc trong tập: "Let's zoom in!" phải báo trước cú phóng to, Albie phải tự giới thiệu được trong 3 giây vì Shorts được xem lẻ (§2.5), và cảnh sổ phải giữ tĩnh ≥ 3 s để chụp màn hình.

## 2. Logline và mạch truyện

**Logline:** Miss Loupe đi soi côn trùng và phát hiện lưỡi, tai, lời nói của chúng nằm ở chỗ không ai ngờ; cuốn sổ Albie thức dậy để giữ ba bí mật; rồi con bướm đầu phim quay lại... nếm chính cô.

- **Mở:** bàn chân The Giant giẫm vào cây kem. Nếm bằng chân được không? Bướm thì có.
- **Giữa:** ba bí mật, mỗi bí mật lạ hơn: nếm bằng chân, nghe bằng chân, "nói" bằng điệu nhảy.
- **Ngoặt:** điệu nhảy trong tổ hóa ra là đường đi thật ngoài vườn (cảnh kéo xa). Ở góc vườn, một chú bọ hung lăn viên tròn thẳng tắp.
- **Kết:** cuốn sổ mở mắt và nhận ba sticker. Người đi soi bị soi lại: con bướm đậu lên kính và nếm Miss Loupe. Câu cuối "is it tasting me?" nối về câu đầu "taste with your feet?".

## 3. Benchmark

| Tác phẩm | Học | Không lấy |
|---|---|---|
| Pilot của chính kênh (`tiny-secrets.mp4`) | Toàn bộ ngữ pháp: kính là máy quay thứ hai, chuyển cảnh qua kính, khoảng lặng trước đáp án, kết vòng | — (là tài sản của kênh) |
| Các series hoạt hình mầm non dạng "nhân vật vật dụng biết nói" (sổ, đồ chơi biết nói) | Vật dụng chỉ cần mắt và một cử chỉ là thành nhân vật; ra mắt bằng một cú "tỉnh dậy" | Mọi nhân vật, thiết kế, tên, câu thoại cụ thể |
| Video giải thích của Kurzgesagt | Cảnh kéo xa làm người xem ngộ ra tỉ lệ | Nhân vật, nét vẽ, nhạc, giọng văn |

Không dùng "Hey Duggee" ở bất kỳ đâu (kế hoạch §0, §12). Tên, nhân vật, thiết kế, kịch bản và nhạc đều của kênh.

## 4. Danh sách cảnh

Nhịp 120 BPM: 1 phách 0,5 s, 1 ô nhịp 2 s. Mốc trong bảng là đích; lời đọc được đo trên giọng thật rồi khớp lại trong `timeline.js`.

| # | Thời gian | Khung hình | Máy quay | Chuyện xảy ra | Vì sao quay vậy |
|---|---|---|---|---|---|
| 1 | 0:00–0:04 | Toàn, chính diện | Giật khi bàn chân đáp | Bàn chân The Giant lơ lửng trên cây kem từ khung đầu, chạm thử rồi giẫm bẹp (1,5 s), chữ TASTE WITH FEET?!; Miss Loupe bật lên sững sờ; Flutter đậu lên chỗ kem bẹp, chân lóe sáng trong kính ([HOOK.md](HOOK.md)) | Móc: gag đọc được ở cỡ thu nhỏ; đủ ba nhịp hình lạ → phản ứng → bí ẩn trong 3 s |
| 2 | 0:04–0:06 | Trung | Kính quét ngang chữ | BIG SECRETS, chữ "of tiny bugs" tí hon chỉ đọc được trong kính · **nhạc hiệu 2 s** | Tựa tự chứng minh ý tưởng kênh; nhạc hiệu để trẻ nhận ra kênh |
| 3 | 0:06–0:08 | Toàn | Lia theo bướm | Flutter bay vào, đáp lên hoa đúng phách | Đặt không gian |
| 4 | 0:08–0:10 | Trung | Kính trượt vào, **"Let's zoom in!"** | Miss Loupe nghiêng kính về phía chân bướm | Câu cửa miệng báo trước cú phóng to: trẻ học được tín hiệu |
| 5 | 0:10–0:13 | Cận trong kính | Phóng ×4 | Điểm nếm ở bàn chân sáng lên, giọt mật dâng lên | Khung trong khung: chi tiết chỉ kính mới thấy |
| 6 | 0:13–0:17 | Trung | Đẩy vào đầu bướm rồi lùi | "SWEET!", vòi duỗi ra; một nhịp thở | Hành động thay lời; nhịp "ồ" cho trẻ nhỏ |
| 7 | 0:17–0:18 | — | Kính lớn dần lấp khung | Mở vào cảnh đêm | Chuyển cảnh qua kính |
| 8 | 0:18–0:20 | Toàn, góc thấp | Khóa | Chirp gáy dưới trăng, "WHERE ARE ITS EARS?" | Đổi màu, đổi tâm trạng |
| 9 | 0:20–0:22 | Trung | Kính lên đầu dế | Miss Loupe đoán "On its head?" → dấu X → "Nope!" | Tật của cô (nghĩ côn trùng giống người) sinh ra nhịp đố |
| 10 | 0:22–0:24 | Trung | Trôi chậm, nhạc tắt nửa sau | Kính chậm rãi trượt xuống chân trước | Nén hơi trước đáp án |
| 11 | 0:24–0:26 | Cận trong kính | Zoom gấp | Tai sáng lên, vòng âm hút vào chân | Đáp án là âm thanh đầu tiên sau khoảng lặng |
| 12 | 0:26–0:28 | Toàn | Kính lớn dần | Chirp nâng chân lên "nghe", mở sang tổ ong | Gag rồi chuyển cảnh |
| 13 | 0:28–0:30 | Trung | Đẩy chậm | Waggle ú ớ, bóng thoại rỗng, nhạc rút còn tiếng ong | Khoảng lặng trước cú ngoặt |
| 14 | 0:30–0:34 | Toàn | Khóa, giật theo phách | "DANCE!", Waggle vẽ hình số 8, hai ong nối đuôi | Điệu nhảy là tâm điểm |
| 15 | 0:34–0:40 | Từ toàn đến siêu toàn | **Kéo xa rồi tilt dọc khung** | Vạch nhảy nối dài thành đường bay thật tới bông hoa. **Rollo lăn ngang bãi cỏ** theo đường thẳng | **Cảnh đặc trưng** (chỉ khung dọc làm được) + trứng phục sinh |
| 16 | 0:40–0:47,5 | Toàn, tĩnh | Khóa; trang sổ đứng yên 5,8 s | Albie đang ngủ ("z z"); sticker đầu tiên bay vào dán "pách" và đánh thức Albie; hai sticker nữa dán theo phách; Albie: "Six legs? In you go!", ba sticker ấn xuống trang đúng chữ "In"; Miss Loupe đứng cạnh: "Go outside with a grown-up, and look closely!" | Albie tự giới thiệu trong 3 s, có nguyên nhân để tỉnh dậy; khung để chụp màn hình, ôn lại |
| 17 | 0:47,5–0:48 | — | Kính của Miss Loupe lớn dần | Mở sang cận cảnh cô | Chuyển cảnh qua chính kính của nhân vật |
| 18 | 0:48–0:52 | Cận | Đẩy chậm | Flutter đáp lên kính, nếm cô: "Hey... is it tasting me?" | Kết vòng về câu móc |

Năm kiểu máy: đẩy, lia, tilt, kéo xa, zoom gấp; khung trong khung xuyên suốt. **Rollo trốn ở cảnh 15** (0:36,2–0:39,8), bãi cỏ giữa bông hoa cam và hồ nước, lăn thẳng từ phải sang trái.

## 5. Lời thoại

Hai giọng (Kokoro, Apache 2.0, chạy offline; §11.3 kế hoạch): **Miss Loupe** `af_heart`, tốc độ 0,9 (nữ, vui, rõ, chậm); **Albie** `bm_lewis`, tốc độ 0,8 (nam trầm, lịch sự, chậm; kết quả thử A/B ở mục 9). Bảng giọng của kênh nằm ở [`_shared/voices.js`](../../_shared/voices.js) để mọi tập dùng cùng một giọng và cùng tốc độ.

| Mã | Ai | Lời |
|---|---|---|
| L01 | Miss Loupe | Can you taste with your feet? |
| L02 | Miss Loupe | Butterflies can! |
| L03 | Miss Loupe | Big secrets of tiny bugs! |
| L04 | Miss Loupe | A butterfly lands on a flower. |
| L05 | Miss Loupe | Let's zoom in! |
| L06 | Miss Loupe | Tiny taste spots on its feet tell it right away: |
| L07 | Miss Loupe | Sweet! Time to eat! |
| L08 | Miss Loupe | What about crickets? |
| L09 | Miss Loupe | Where are its ears? |
| L10 | Miss Loupe | On its head? |
| L11 | Miss Loupe | Nope! |
| L12 | Miss Loupe | A cricket's ears are on its front legs! |
| L13 | Miss Loupe | Honeybees can't talk, |
| L14 | Miss Loupe | so they dance! |
| L15 | Miss Loupe | The dance shows the way! |
| L16 | Albie | Six legs? In you go! |
| L17 | Miss Loupe | Go outside with a grown-up, and look closely! |
| L18 | Miss Loupe | Hey... is it tasting me? |

- 83 từ trong 52 s, khoảng 1,6 từ/giây (pilot 1,8), hợp trẻ 4–5 tuổi hơn.
- Hai nhân vật nói (Miss Loupe, Albie), đúng một "Nope!", một nhân vật ra mắt (Albie) (§2.5).
- L17 thêm "with a grown-up" theo quy định an toàn §12. Phim không có cảnh bắt hay cầm côn trùng.
- Thời điểm thật của từng câu: `LINES` trong [`timeline.js`](timeline.js). Mỗi câu được Whisper nghe lại, khớp từng chữ.

## 6. Cue map

| Ô nhịp | Giây | Nhạc | Cue trên phách |
|---|---|---|---|
| 0–1 | 0–4 | Vỗ tay, pluck đơn, ba nốt marimba đi lên | Bàn chân đáp ở phách 4 ô 0 (1,5 s) |
| 2 | 4–6 | **Nhạc hiệu 2 s** | Mỗi chữ tựa pop một phách; chuông khi "of tiny bugs" hiện |
| 3–8 | 6–18 | Giai điệu chính, lớp lắc cánh bướm | Bướm đáp đầu ô 4; "zoom" ở ô 4 phách 3,2; "SWEET!" ô 7 phách 0,5 |
| 9–11 | 18–24 | Bỏ bè trầm, tiếng dế làm hi-hat; **im nửa sau ô 11** | Dấu X ô 10 phách 3,5 |
| 12–13 | 24–28 | Cả dàn trở lại, thêm tiếng dế | Tai sáng đúng đầu ô 12 |
| 14 | 28–30 | Rút dần còn tiếng ong, **tắt 2 phách cuối** | Ong ú ớ |
| 15–16 | 30–34 | Bùng lại, tiếng ong thành bè trầm | "DANCE!" đúng đầu ô 15 |
| 17–19 | 34–40 | Mở rộng, chuông rải, tăng dần; riser vào cảnh sổ | Đàn ong rời tổ đầu ô 17 |
| 20 | 40–42 | Chỉ pad và kick nhẹ (Albie còn ngủ) | Sticker dán phách 1, 2, 3; phách 1 đánh thức Albie |
| 21–23 | 42–48 | Cả ba tiếng côn trùng cùng chơi | "Six legs? In you go!" đầu ô 21; iris phách 3 ô 23 |
| 24 | 48–50 | Gần im lặng, chỉ tiếng cánh bướm | Bướm đáp ô 24 phách 2 |
| 25 | 50–52 | Hợp âm kết | Miss Loupe cười ô 25 phách 1, kết |

## 7. Thiết kế âm thanh

Nhạc tích lũy theo phim: mỗi côn trùng góp tiếng của mình vào dàn nhạc, đến cảnh sổ cả ba cùng chơi.

| Phần | Nền | Tiếng theo hành động | Nhạc |
|---|---|---|---|
| Mở | Không | Bàn chân "bẹp", kem "phụt", ngón chân lách tách | Vỗ tay, pluck |
| Tựa | Không | Chữ pop, chuông lấp lánh | Nhạc hiệu: kèn đồ chơi + marimba + chuông |
| Bướm | Gió vườn nhẹ | Cánh phập phồng, đáp "tạch", riser khi phóng, chuông khi điểm nếm sáng, vòi duỗi "húuu" | Ukulele tổng hợp, marimba |
| Dế | Đêm: gió thấp | Tiếng dế hóa nhịp, còi "bíp" khi sai, vòng âm hút "ù" | Bass gảy, tiếng dế |
| Ong | Rì rầm trong tổ | Vo ve, tiếng rung khi nhảy | Tiếng ong làm bass |
| Kéo xa | Gió cao | Đàn ong bay qua, **viên tròn của Rollo lăn lộc cộc** | Chuông, dàn nhạc mở rộng |
| Sổ | Gió vườn | Albie tỉnh "boing", sticker "pách" đúng phách, mép sticker lật phật | Cả dàn |
| Kết | Im lặng | Chân bướm gõ kính "tách tách tách", "slurp" | Hợp âm cuối |

Khoảng lặng thật: nửa sau ô 11 và hai phách cuối ô 14. Âm đầu tiên sau mỗi khoảng lặng chính là đáp án. Chuyển cảnh bằng âm (J-cut): tiếng đêm vào sớm trước cảnh dế, tiếng tổ vào sớm trước cảnh ong.

## 8. Chữ và phụ đề

- **Chữ lớn:** Paytone One, khối phẳng có bóng lệch màu đậm, không viền.
- **Phụ đề:** Baloo 2 ExtraBold trên tấm kem bo tròn, cỡ 56 px, tâm x = 510 để tránh cột nút của Shorts. Chữ hiện dần theo từng câu đã được nói (tấm giữ nguyên kích thước), nên "Nope!" không lộ trước dấu X.
- **Vùng an toàn:** nội dung chính trong x 60–960, y 220–1560.
- **Giữ chữ:** phụ đề ≥ 1,8 s và ≥ lời đọc + 0,6 s; chữ trên hình kiểm bằng `readcheck.mjs`.

## 9. Ghi chú sản xuất

- Nhân vật: `drawChar()` của `_shared/characters`. Miss Loupe đặt theo **tâm kính** (hàm `loupe()` trong `film.js` tính ngược vị trí chân), cảnh phóng to trong kính vẽ qua tham số `inside` của rig nên mặt kính, vành và vệt sáng luôn nằm đúng chỗ.
- Đạo cụ cảnh (hoa, cây kem, mây, mặt trời) chép từ pilot vào [`props.js`](props.js) của tập.
- **Chọn giọng Albie** (câu "Six legs? In you go!", tốc độ 0,86, Whisper `small.en`):

  | Giọng | Cao độ trung vị | Whisper |
  |---|---|---|
  | `bm_george` | 152 Hz | đúng |
  | `bm_lewis` | **98 Hz** | đúng |
  | `bm_fable` | 117 Hz | đúng |
  | `am_michael` | 119 Hz | sai ("and you go") |
  | `am_onyx` | 86 Hz | sai ("and you go") |
  | `am_fenrir` | — | sai |

  Chọn `bm_lewis`: trầm nhất trong các giọng nghe đúng, giọng Anh lịch sự hợp "thủ thư khó tính". Trong bản mix, ở tốc độ 0,86 chữ "In" vẫn bị nghe thành "and"; hạ xuống 0,8 thì cả `small.en` và `base.en` đều nghe đúng, nên tốc độ chuẩn của Albie trong `_shared/voices.js` là 0,8.
- **L09** viết là "Where are its ears?" nhưng đọc là "Where... are its ears?": Kokoro đọc liền "where are" thành "wear". Phụ đề vẫn là câu gốc.
- **Sửa rig dùng chung:** tai của Chirp bị vẽ dưới ống chân khi chân trước đổi tư thế (`_shared/characters/cast/chirp.js`). Đã sửa độ sâu vẽ để tai luôn nằm trên ống chân; tư thế mặc định không đổi.
- **Kiểm tra cuối:** readcheck đạt hết; −14,0 LUFS, đỉnh −1,1 dBFS; không có khung đen; Whisper nghe bản mix cuối khớp 85/85 từ.
- **Lượt sound design (Task.md "Tăng cường sound design"):** hook âm thanh từ 0 s, mỗi chuyển cảnh một tiếng riêng, hai khoảng lặng trước đáp án không còn cắt cụt, nhạc nhường giọng theo dải. Hình, lời và thời lượng giữ nguyên. Bảng cue và số đo: [`SOUND.md`](SOUND.md). Sau lượt này: −14,0 LUFS, đỉnh −1,6 dBFS, Whisper 85/85 từ.
- **Lượt hook (Task.md "Thiết kế hook mở đầu"):** ba phương án và lựa chọn ở [`HOOK.md`](HOOK.md). Chỉ đổi phần mở 0–3,5 s (hình và tiếng động). Lời, nhạc, thời lượng và các cảnh sau giữ nguyên. Sau lượt này: −14,0 LUFS, đỉnh −1,6 dBFS, Whisper 85/85 từ.
- **Lượt nhạc nền (Task.md "Điều chỉnh nhạc nền sinh động"):** nhạc viết lại theo từng cảnh thành "Tổ khúc khu vườn" (C → F → La thứ/C → F swing → C). Mô-típ bí mật đô–mi–sol trở lại ở mỗi phát hiện, mỗi lần một cách chơi. Hình, lời, tiếng động và thời lượng giữ nguyên. Soundtrack Timeline và số đo: [`MUSIC.md`](MUSIC.md). Sau lượt này: −14,0 LUFS, đỉnh −1,6 dBFS, Whisper 85/85 từ.
- **Lượt tối ưu phần mở đầu (Task.md "Tối ưu phần mở đầu"):** Flutter có mặt từ khung đầu với mắt tròn xoe, chữ móc bật ra có tiếng, nhịp nhạc chạy từ giây 0. Bảng đối chiếu từng yêu cầu: [`HOOK.md`](HOOK.md) mục 5.

## 10. Bản v4 (quy tắc câu hỏi kết, 06/11/2026)

Áp dụng quy tắc mới của [`_shared/QUALITY.md`](../../_shared/QUALITY.md) §6, rút ra từ SHORT-003 v4. Câu cuối cũ *"Hey... is it tasting me?"* là câu giữa hai nhân vật, không hỏi trẻ.

- **Câu hỏi kết mới (L19, Miss Loupe, tốc độ chuẩn):** *"Can YOUR feet taste?"* ở 50,3 s (1,25 s), trên tấm phụ đề riêng. Câu này nhắc lại câu móc *"Can you taste with your feet?"*, trẻ đáp to "No!". Không thêm dữ kiện mới (FACTS.md không đổi).
- **Chữ to trên hình** (`askTitle`, mốc `HIT.ask` 49,2–51,45 s; chữ hiện trước lời khoảng 1,1 s để đủ 2,2 s đọc): *Can YOUR / FEET TASTE?* ở đúng chỗ chữ móc sẽ trở lại (phía trên kính). Miss Loupe thôi cười, nhìn thẳng ra người xem và giơ ngón tay khi hỏi.
- **Chữ móc trở lại** TASTE WITH / FEET?! ở 51,45 s (`HIT.recall`, có kick và chuông nhỏ), đúng lúc câu hỏi vừa dứt, nên ở trên khung cuối khoảng 0,55 s (lần dựng đầu chỉ 0,18 s, trông như chớp).
- **Nhịp chờ trẻ trả lời:** 51,6 s, hai nốt hộp nhạc hỏi lên, trong lúc chữ móc đang ở trên hình.
- **Dời mốc để vừa 52 s:**
  - L17: 44,95 → 44,9 s.
  - L18: 49,0 → 48,16 s; Flutter đậu ở 48,45 s, liếm ở 49,55 s, cười "ta-da" ở 49,75 s.
  - Chỗ khựng của gag theo mốc mới.
  - Dưới câu hỏi có lớp nhạc mỏng ngoài dải giọng (bass trầm, hat cao); nhạc hạ 0,72 dưới câu hỏi.
- **Tiếng mới:** `ask` (chữ câu hỏi bật ra), `askq` (hai dấu "?" nhún).
- **Chuyển cảnh kính → sổ:** tập này vào sổ qua bông hoa nở (không có cú "chụp" sticker), nên quy tắc "kính soi đúng hình trước cú chụp" không áp dụng.
- `build.sh` thêm bước kiểm Whisper `base.en` (QUALITY.md §7). Bản cũ: `out/short-001-v3.mp4`.
