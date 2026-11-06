# SHORT-003 · Tối ưu theo Retensis (bản v4, mới nhất) và lịch sử v2

Video: *Crickets Have Ears on Their Legs?!* (tựa móc **EARS ON KNEES?!**, 24 s, 9:16, 30 fps, vòng lặp). Bản đang giao: `short-003.mp4` (v4). Bản trước: `out/short-003-v3.mp4`.

## Bản v4 (06/11/2026, theo Task.md)

Không có bảng điểm Retensis gốc trong thư mục dự án. Chẩn đoán dựa trên:
- bốn điểm Task.md nêu: hook 0–3 s, chuyển cảnh 0:13, kết 0:21–0:24, âm thanh;
- khung hình và số đo `qa.py` trên bản v3 (dựng lại cùng máy để so).

Phần lớn yêu cầu của Task.md đã có từ v3:
- hook: tựa móc nảy có tiếng, crash zoom, cái đầu gối "nghe" trước;
- chuyển cảnh 0:13: zoom xuyên kính thành sticker (match cut);
- kết: chữ móc trở lại, vòng lặp liền;
- âm thanh: `LEVEL` dâng/hạ theo cảnh.

v4 chỉ sửa những chỗ còn yếu. Giữ nguyên chủ đề, nhân vật, mọi câu thoại và dữ kiện; không thêm câu mới.

### A. Chẩn đoán (v3)

| Mục Task.md | Mốc | Còn yếu ở đâu |
|---|---|---|
| §2 Hook | 0:00,5 | Cái đầu gối giật lên trước, nhưng ở cỡ điện thoại khó thấy: không có dấu hiệu hình nào ở chỗ bất ngờ |
| §3 Chuyển cảnh | 0:11,8–0:12,2 | Kính "chụp" một **mặt kính trống** (kính đã rời chân từ 9,6 s); hình Chirp trong sticker hiện ra từ chỗ trống, nên cú match cut không có gì để "khớp" |
| §4 Kết (ưu tiên cao nhất) | 0:19,3–0:22,3 | Câu hỏi *"Where are YOUR ears?"* nằm chung tấm phụ đề với *"Oops! Sorry!"*, chỉ có ở phụ đề nhỏ, bắt đầu 20,7 s (trước khung 0:21–0:24). Không có nhịp nào chờ trẻ trả lời: Chirp khoe đầu gối ngay sau câu hỏi |
| §5 Âm thanh | 0:21 | (phát hiện trong lúc sửa) Dời mốc làm nhạc im hẳn 0,9 s dưới câu hỏi; đã sửa |

Không đổi: câu móc ở 0,1 s; chữ móc ≥ 180 px hiện đủ ở khung 0; crash zoom; ba lớp parallax; nhịp "ồ".

### B. Kế hoạch dựng

| Mốc | Cách chỉnh | Hình / âm thanh | Mục tiêu |
|---|---|---|---|
| 0,50–1,15 | Dấu **"!"** to (230 px, chanh, bóng tím đêm) và năm vạch giật mình bật ra ngay trên cái đầu gối | Tiếng `bang`: tink cao + lò xo ngắn | Bất ngờ đọc được ở cỡ điện thoại (Task §2) |
| 11,60–12,20 | **Kính "ngắm"**: trong mặt kính hiện dần đúng hình sẽ thành sticker (Chirp cả con, chân vểnh, tai sáng), bốn góc ngắm khép vào. Chân Chirp giữ vểnh tới cú chụp | Swish mỏng dải cao + tink khi ngắm xong | Cái được chụp chính là sticker: chuyển cảnh liền mạch (Task §3) |
| 12,10–12,90 | Giữ nguyên v3: chụp → máy lao xuyên kính → lùi ra từ chính sticker trên trang sổ (0,8 s) | Như v3 | — |
| 19,00 | "Oops! Sorry!" sớm 0,3 s | — | Nhường chỗ cho tấm phụ đề riêng của câu hỏi |
| 20,05–20,40 | Trang sổ trượt lên khỏi khung | Như v3 | Chừa chỗ cho chữ câu hỏi |
| 20,25–22,45 | **Câu hỏi kết hiện to** (`askTitle`): "Where are" nhỏ + **YOUR EARS?** to, hai dấu "?" nhún hai bên | Tiếng `ask` (hai cú nảy nhỏ, trước lời) + `askq` (tink dải cao) | Câu hỏi đọc được bằng mắt (Task §4) |
| 20,85–21,85 | Lời *"Where are YOUR ears?"* trên **tấm phụ đề riêng**; Chirp nhìn thẳng vào trẻ | Nhạc hạ (`LEVEL` 0,7), bass gảy thưa dải trầm + hat dải cao: không lỗ im | Câu hỏi rõ |
| 21,90–22,10 | **Nhịp chờ trẻ trả lời** | Hai nốt hộp nhạc hỏi lên "ding-ding?" | Mời trẻ chỉ vào tai mình |
| 22,10 | Chirp khoe cái tai ở đầu gối (ta-da) | Đàn hạc + lấp lánh | Đáp án bằng hình |
| 22,45 | Chữ câu hỏi thu lại; **EARS ON KNEES?!** trở lại đúng chỗ, đúng cỡ khung 0 | Như v3 | Câu hỏi → đáp án chính là câu móc |
| 22,70–24,00 | Như v3: Chirp vểnh chân về tiếng gáy xa; vòng sóng âm mở về khung đầu | Như v3 | Vòng lặp liền |

**Vì sao không dùng câu ví dụ của Task.md.** *"Can you find another silly animal fact?"* mở ra ngoài tập, nên vòng lặp yếu đi. Câu này còn dễ được hiểu như lời mời bình luận, trong khi video Made for Kids bị YouTube tắt bình luận (CLAUDE.md, QUALITY.md §6). Vì vậy giữ câu hỏi gắn với chính bí mật của tập: trẻ chỉ vào tai mình, rồi Chirp khoe tai ở đầu gối.

### C. Timeline v4 (chỉ những đoạn đổi so với v3)

| Thời gian | Hình | Lời | Nhạc | SFX |
|---|---|---|---|---|
| 0,50–1,15 | Đầu gối giật lên; **"!"** bật ra | (L01 đang nói) | Như v3 | twitch, **bang** |
| 11,60–12,10 | Kính ngắm: hình sticker hiện trong kính | — | Như v3 | **swish mỏng, tink** |
| 12,10 | Chụp | — | Marimba chạy lên | snap |
| 19,00–20,01 | Chirp hé mắt | "Oops! Sorry!" | Bass + pad mỏng; ba nốt "aww" | blip 20,1 |
| 20,25–22,45 | Chữ **Where are / YOUR EARS?** | 20,85: "Where are YOUR ears?" | Bass thưa + hat (`LEVEL` 0,7) | **ask, askq** |
| 21,90 | Nhịp chờ | — | **ding-ding?** (hộp nhạc) | — |
| 22,10 | Chirp khoe tai ở đầu gối | — | Ta-da phím điện | show |
| 22,45 | Chữ móc trở lại | — | Kick + bass Rê | recall |
| 22,85 · 23,10 · 23,60 | Tiếng gáy xa; vòng sóng từ trăng | — | Swing mỏng | farchirp |
| 23,20–24,00 | Vòng sóng âm mở về khung đầu | — | Vibraphone rải lên; Mi → Rê | ringiris |

### D. Đã sửa (file)

- **`timeline.js`**
  - Mốc mới: `bang`, `aim`, `ask`, `wait`.
  - Dời: `peek` 20,1; `show` 22,1; `recall` 22,45; `listen3` 22,7; `far3` 22,85 · 23,1 · 23,6.
  - L09 19,0. L10 20,85 trên tấm phụ đề riêng (card 8).
  - Sự kiện mới: `bang`, `ask`, `askq`, swish + tink lúc ngắm.
  - Storyboard thêm khung câu hỏi.
- **`film.js`**
  - Hàm mới `bang()` (dấu "!") và `viewfinder()` (kính ngắm).
  - Chân Chirp giữ vểnh đến cú chụp.
  - Trang sổ rời khung ở `HIT.ask[0]`.
  - Gọi `askTitle()`.
- **`mix.py`**
  - SFX `bang`, `ask`, `askq`.
  - Nhịp chờ "ding-ding?".
  - Lớp bass + hat dưới câu hỏi.
  - `LEVEL` hạ ở câu hỏi, dâng ở nhịp chờ và ta-da.
- **Dùng chung**:
  - `_shared/episode.js` thêm `askTitle()`;
  - `_shared/qa.py` thêm ba kiểm tra cho câu hỏi kết;
  - `_shared/QUALITY.md` thêm các quy tắc tương ứng (mục "Quy tắc chung mới" bên dưới).

### E. Số đo v3 → v4 (`qa.py`, cùng máy)

| Mục | v3 | v4 |
|---|---|---|
| Tổng | 28 đạt · 2 cảnh báo | **30 đạt · 0 cảnh báo · 0 chưa đạt** |
| Câu hỏi kết có tấm phụ đề riêng | chung với "Oops! Sorry!" | riêng |
| Câu hỏi kết hiện to trên hình | không | 20,2–22,4 s |
| Câu hỏi kết bắt đầu | 20,7 s | 20,85 s (chữ to từ 20,25 s) |
| Chuyển động giây đầu | 11,78 | 11,99 |
| Độ to · đỉnh thật | −13,9 LUFS · −1,3 dBTP | −13,9 LUFS · −1,5 dBTP |
| Lời rõ hơn nhạc (thấp nhất) | 13,9 dB | 13,1 dB |
| Lỗ im của nhạc | 0 giây | 0 giây |
| Âm lượng nhạc đổi theo cảnh | 23 dB | 31 dB |
| Khung cuối nối khung đầu | 3,5/255 | 3,5/255 |
| Whisper `small.en` / `base.en` | 0 / 0 lệch | 0 / 0 lệch |

Đây là số đo của chính video, không phải điểm Retensis. Điểm thật chỉ biết khi chấm lại hoặc đăng lên.

### Quy tắc chung mới (đã đưa vào `_shared/QUALITY.md`, áp cho mọi tập)

1. Phản ứng bất ngờ ở hook có dấu hiệu hình ngay chỗ bất ngờ ("!", vạch giật mình) kèm tiếng.
2. Trước cú chụp kính → sổ, kính phải đang soi đúng hình sẽ thành sticker (≥ 0,25 s), không chụp kính trống.
3. Câu hỏi kết hỏi thẳng trẻ (YOU/YOUR), có tấm phụ đề riêng, hiện to bằng `askTitle` (mốc `HIT.ask`), chừa 0,2–0,4 s cho trẻ trả lời, rồi chữ móc trở lại đúng chỗ đó.
4. Chữ câu hỏi ở trên hình đủ lâu để đọc (`readcheck`: khoảng 2,1 s cho một dòng 9–10 ký tự), nên chữ hiện trước lời khoảng 0,5 s.

---

# Lịch sử: bản v2

## A. Retensis Diagnosis

| Chỉ số | Mốc (v1) | Nguyên nhân |
|---|---|---|
| **Hook** | 0:00–0:02 | Khung đầu là cảnh trung, máy khóa, tối và tĩnh: bố cục "chuẩn" chữ trên, nhân vật giữa, phụ đề dưới. Chuyển động giây thứ hai tụt còn **1,3** (giây đầu 5,2). Không có cú máy hay hiệu ứng nào kéo mắt vào nhân vật. Điểm tốt nên giữ: câu hỏi ở 0,1 s, Chirp phản ứng ở 0,5 s, không lộ đáp án |
| **Pacing** | 0:09,8–0:15 | Nhịp "ồ" kéo dài 3,7 s: máy đẩy vào rồi **đứng gần như yên** (chuyển động 0:11 = **0,1**). Từ 12,24 tới 15,0 s **không có lời 2,8 s** (khúc khích → kính nở → sticker → Albie mới nói) |
| **Pacing (chuyển cảnh)** | 0:13,5 | Kính "nở" thẳng thành trang sổ, không gắn với hành động nào. Sticker bay vào từ ngoài khung, không liên quan tới cái kính: mạch cảm xúc bị đứt |
| **Pacing** | 0:15–0:16 | Trang sổ đứng yên trong lúc Albie nói (chuyển động **0,2–0,6**) |
| **Audio** | 0:15–0:16 | Dưới câu của Albie nhạc tụt còn **−56 / −67 dB** (chỉ còn tiếng búng tay): gần như im |
| **Audio** | 0:19,7–0:21,15 | Nhạc **ngắt hẳn 1,5 s** sau "NOPE!" |
| **Audio** | cả phim | Một màu swing từ đầu đến cuối. Nền đêm gần như không nghe thấy (−43 dB, không đổi). Phổ nhạc lặp quanh 1,3 kHz |
| **Visual** | cả phim | Mọi lớp nằm cùng một mặt phẳng, không có tiền cảnh, không parallax. Cảnh sổ là một khung đứng yên 9 s |
| **Engage** | 0:22–0:24 | Có vòng lặp (vòng sóng âm mở về khung đầu) nhưng không có tín hiệu nào mời trẻ tham gia. Tiếng gáy xa ở cuối (chính là tiếng của khung đầu) trôi qua mà không ai chỉ ra |

## B. Editing Plan

| Mốc v1 | Vấn đề | Cách chỉnh | Hình / âm thanh / chuyển cảnh mới | Mục tiêu |
|---|---|---|---|---|
| 0:00–0:00,45 | Khung đầu tĩnh | **Crash zoom**: khung 0 rộng (×0,95), máy lao vào Chirp trong 0,45 s (×1,22) | Vệt tốc độ toả từ giữa khung; tiếng whoosh lao tới; vibraphone rung nhẹ "hồi hộp, lắng nghe" | Giữ mắt từ khung đầu |
| 0:00 | Hình phẳng | Thêm 3 lớp: **nền** (trời, sao, quầng trăng, đồi xa) trôi 0,35× máy; **giữa** (nấm, Chirp); **tiền cảnh** cỏ tối hai góc dưới trôi 1,5× máy, lắc nhẹ | Bụi trăng lơ lửng bay lên chậm | Chiều sâu, parallax ở mọi cú máy |
| 0:09,8–0:10,5 | Kính rời đi, máy đẩy, cô cúi xuống: ba việc nối đuôi | Làm **cùng lúc** ở 9,6 s | Swish lùi + gió dâng | Rút 0,55 s |
| 0:10,8 | "Hello, little ears!" muộn | Đưa lên 10,25 s (sớm nhất mà phụ đề không chồng) | Máy vẫn đẩy chậm trong lúc nói (×1,30 → ×1,38) | Không còn khung đứng yên |
| 0:12,35–0:14 | Khúc khích dài, kính nở không lý do | Khúc khích 11,75 s → **kính "chụp" cái tai thành sticker** (12,1 s) → sticker bật ra khỏi mặt kính (12,2 s) → **lia máy ngang** theo sticker sang sổ (12,3–12,75 s) → sticker dán đúng chỗ (12,85 s) | Chớp sáng trong mặt kính + tia; "tách" chụp ảnh + lấp lánh; pop; marimba chạy lên; whoosh lia + vệt mờ chuyển động; đàn hạc vuốt lên theo cú lia; kick + chũm chọe ở cú dán | Chuyển cảnh có hành động nối: cái tai trong kính *chính là* sticker trong sổ |
| 0:15,0 | Albie nói muộn | Đưa lên 13,1 s | — | Khoảng trống lời 2,8 s → **1,4 s** |
| 0:15–0:17 | Trang sổ đứng yên; nhạc gần như im | Máy trôi chậm (+2,5%) suốt cảnh sổ | Dưới câu của Albie: búng tay, chổi trống, bass gảy thưa (dải trầm), lấp lánh hộp nhạc ở dải cao. Không hợp âm phím điện (bài học v1: từng che chữ "In") | Cảnh sổ "sống", lời vẫn rõ |
| 0:17,35–0:19,6 | Chirp nhảy tới, câu hỏi | Dời sớm 1,95 s | Pizzicato rón rén đi lên dưới "Ears on its head?": hồi hộp nhẹ trước "NOPE!" | Tăng tò mò |
| 0:19,7–0:21,15 | Nhạc ngắt hẳn 1,5 s | Khựng ban nhạc nhưng **không im** | Vibraphone run run theo Chirp, rồi bass + pad mỏng nối sang "Oops! Sorry!"; ba nốt "aww" đi xuống sau câu | Không còn lỗ im |
| 0:22,2–0:24 | Kết không mời tham gia | Thêm câu gọi *"Shh... can you hear it?"* (20,85 s), **nền tối lại** (trang sổ và nhân vật vẫn sáng), con dế xa trên vầng trăng gáy 3 lần, tai Chirp lóe ở mỗi tiếng gáy, rồi vòng sóng âm mở về khung đầu | Nhạc lặng gần hết (pad mỏng) để trẻ *nghe được* tiếng gáy; vòng sóng xoáy + chũm chọe ngược; bass dẫn về Rê ở 0,0 | Tín hiệu lặp tự nhiên: câu hỏi ở cuối được trả lời bằng chính âm thanh của khung đầu |
| cả phim | Nền đêm đều, không nghe thấy | Nền mới | Gió trầm dâng hạ chậm; dàn dế xa từng tràng ngắn, nhiều hướng; vài tiếng ếch mềm ở chỗ không có lời. Nền cũng nhường giọng | Không gian sống động |

**Hook: ba phương án.**
- **H1 · Crash zoom + "ping"** (*chọn*):
  - Khung rộng, máy lao vào Chirp trong 0,45 s.
  - Vòng sóng âm chạm chân ở 0,5 s; Chirp tròn mắt rồi gáy đáp; chữ EARS ON / KNEES?! bật ra.
  - Câu hỏi bắt đầu ở 0,1 s.
  - Vì sao chọn: có chuyển động và phản ứng nhân vật trong 1 s, giữ đúng khung lặp, không lộ đáp án.
- **H2 · Chân "kính tiềm vọng":**
  - Mở bằng một cái chân xanh nhô lên sau ngọn cỏ, xoay về phía tiếng động.
  - Bí ẩn hơn, nhưng mặt Chirp xuất hiện sau 1 s và phá khung lặp.
- **H3 · Kính soi đầu:**
  - Mở trong kính đang tìm tai trên đầu Chirp.
  - Lộ cách giải quá sớm và trùng nhịp của SHORT-001 (kế hoạch §4.3).

**Kết: ba phương án.**
- **E1 · "Shh... can you hear it?"** (*chọn*): xem mục C. Câu gọi ngắn (2,2 s), không ép tương tác. Câu hỏi được trả lời bằng chính tiếng gáy của khung đầu, nên khi phát lại mạch liền.
- **E2 · "Where are YOUR ears?":** trẻ chỉ vào tai mình. Tương tác tốt, nhưng rời sợi chỉ "lắng nghe" nối về câu móc.
- **E3 · "Which bug should we listen to next?":** mở ra ngoài truyện nên vòng lặp yếu đi. Kiểu câu này còn gợi trẻ trả lời bằng bình luận, trong khi video cho trẻ em bị tắt bình luận.

## C. Revised Timeline (bản v2, 0:00–0:24)

| Thời gian | Hình và hành động | Lời | Nhạc nền | SFX và nền | Chuyển cảnh / loop |
|---|---|---|---|---|---|
| 0,00–0,45 | **HOOK.** Khung rộng dưới trăng; máy lao vào Chirp; vệt tốc độ; chữ EARS ON / KNEES?! bật ra | 0,10: *"What if your ears were on your knees?"* | Rê: bass, vibraphone, kick nhẹ; vibraphone rung "hồi hộp" | Whoosh lao vào; chữ bật; tiếng gáy xa (nối từ cuối phim); dế xa, gió | Nối vòng lặp |
| 0,50–1,75 | Vòng sóng chạm chân, Chirp tròn mắt, gáy đáp, nốt nhạc bật lên, lại vểnh chân | | Bass đi bộ; phím điện chen giữa các tiếng gáy | Ping; tiếng gáy ×4; nốt bật; boing | Stop-time theo hành động |
| 2,45–3,60 | Kéo xa (parallax: nền chậm, cỏ tiền cảnh nhanh); Miss Loupe trượt vào | 2,75: *"Let's zoom in!"* | Swing đủ | Whoosh; swipe; tink | Riser vào cú phóng |
| 3,60–7,30 | Kính phóng vào ống chân, cái tai sáng | 4,40: *"Its ears are on its front legs!"* | **Khám phá**: mô-típ bí mật Fa–La–Đô, pad Fa | Zoom; lấp lánh | Sang Fa trưởng |
| 7,30–9,60 | Ba vòng sóng làm mặt tai rung "bum"; TINY DRUM! | 7,30: *"Each one is like a tiny drum!"* | **Nhịp theo hành động**: mỗi cú "bum" một nốt bass + tom; trống dồn nhỏ | Tiếng gáy xa → "bum" | Stinger |
| 9,60–11,95 | Kính rời chân, máy đẩy vào, Miss Loupe nhảy lên mép nấm (cùng lúc); máy vẫn đẩy chậm; Chirp khúc khích, tai lóe | 10,25: *"Hello, little ears!"* | **Đáng yêu**: pad Si♭, vibraphone, hộp nhạc nhỏ; vibraphone láy khi khúc khích | Swish; gió; khúc khích; lấp lánh; boing | |
| 12,10–12,85 | **Kính "chụp"** cái tai → sticker bật ra → **lia máy** sang sổ → sticker dán | | Marimba chạy lên; đàn hạc vuốt lên theo cú lia; kick + chũm chọe ở cú dán | Chớp + "tách"; pop; whoosh lia; trang giấy; dán + ding | Match cut: cái tai trong kính = sticker |
| 12,85–15,40 | Trang sổ, máy trôi chậm | 13,10 (Albie): *"Six legs? In you go!"* | **Vui, nhẹ**: búng tay, chổi trống, bass gảy thưa, lấp lánh hộp nhạc dải cao | Nền đêm; ếch mềm (15,6) | |
| 15,40–17,70 | Chirp nhảy tới cạnh sổ | 16,10 (Albie): *"Ears on its head?"* | **Hồi hộp nhẹ**: bass chạy lên; pizzicato rón rén đi lên | Boing; đậu | |
| 17,70 | "NOPE!" bay vào, màn hình rung; Chirp bịt chặt đầu gối | 17,70: *"NOPE!"* | **Bất ngờ**: cả ban nhạc khựng một phát; vibraphone run run | Chữ bay vào; trang phần phật; "chụt" + run run | Khựng (không im) |
| 19,30–20,70 | Chirp hé mắt | 19,30: *"Oops! Sorry!"* | Bass + pad mỏng; ba nốt vibraphone "aww" | Blip | |
| 20,70–23,20 | Chirp lại vểnh chân, nghiêng về phía trăng; **nền tối lại**; con dế xa trên trăng gáy, tai Chirp lóe ở mỗi tiếng gáy | 20,85: *"Shh... can you hear it?"* | **Lắng nghe**: nhạc lặng, chỉ còn pad Rê thứ mỏng | Boing (vểnh chân); tiếng gáy xa 22,85 · 23,15 · 23,70; vòng sóng từ vầng trăng | **Loop cue**: âm thanh của câu móc |
| 23,20–24,00 | Vòng sóng âm từ cái tai mở ra đúng khung đầu | | Vibraphone rải lên; bass Mi → Rê ở 0,0 | Xoáy + chũm chọe ngược | **Vòng lặp liền** (khung cuối chênh khung đầu 8,6/255) |

## D. Final Editing Instructions (đã thực hiện)

Mọi thay đổi nằm trong `films/short-003/`. Dựng lại bằng `sh films/short-003/build.sh`.

1. **`timeline.js`**
   - Mốc mới: `crash`, `snap`, `stickerOut`, `whip`, `far3`.
   - Dời sớm: `lensOut`/`push` 9,6; `bend` 9,7; `giggle` 11,75; `stamp` 12,85; `hop` 15,4; `nope` 17,7; `peek` 20,35; `listen3` 20,7; `ring` 23,2.
   - Lời: L05 10,25 · L06 13,1 · L07 16,1 · L09 19,3. Thêm **L10 "Shh... can you hear it?"** ở 20,85, chung tấm phụ đề với L09.
   - Sự kiện âm thanh mới: `crash`, `snap`, `popout`, `whip`, ba tiếng `farchirp` theo `far3`. Bỏ `lensiris` và `swipe` của sticker.
2. **`film.js`**
   - `cam()`: crash zoom 0–0,45 s; đẩy chậm tiếp trong lúc "Hello".
   - Lớp mới: `skyLayer` (nền parallax 0,35×, quầng trăng, đồi xa), `fgLayer` (cỏ tối 1,5×), `motes` (bụi trăng), `speedLines`.
   - Chuyển cảnh mới: `snapFlash`, `stickerAt`, `whipPan` thay cho `irisLens`.
   - Cảnh sổ:
     - máy trôi chậm;
     - con dế xa trên vầng trăng và vòng sóng của nó;
     - "hush" chỉ làm tối nền;
     - tai Chirp lóe theo tiếng gáy xa.
   - Các mốc cứng của bản cũ (10,4; 10,6; 15,6; 21,2; 21,85) đổi thành mốc tính từ `HIT`.
3. **`mix.py`**
   - `REST` sau "NOPE!" rút còn 1,38 s, có vibraphone run run, bass và pad nối sang câu sau.
   - Nhạc dưới câu của Albie có búng tay, chổi trống, bass gảy thưa và lấp lánh dải cao.
   - Pizzicato rón rén trước "NOPE!"; "aww" sau "Oops! Sorry!"; pad lắng nghe trước vòng lặp.
   - Marimba và đàn hạc theo cú chụp và cú lia. Đường cường độ theo cảnh mới.
   - Nền đêm mới có gió, dàn dế xa và ếch; nền cũng nhường giọng.
   - SFX mới: `crash`, `snap`, `popout`, `whip`.
4. **Âm thanh:** mọi âm thanh vẫn tổng hợp bằng code (`_shared/audio`), không dùng mẫu của bên thứ ba ([CREDITS](CREDITS) không đổi).

## E. Expected Improvement

Số đo dưới đây là của chính video (v1 → v2), không phải điểm Retensis. Điểm Virality và retention thật chỉ biết được sau khi chấm lại hoặc đăng lên.

| Mặt | Thay đổi | Số đo v1 → v2 |
|---|---|---|
| **Hook** | Máy lao vào nhân vật ngay khung đầu, vệt tốc độ, whoosh; giữ câu hỏi ở 0,1 s và phản ứng ở 0,5 s | Chuyển động giây đầu (`qa.py`) 5,2 → **8,5** |
| **Pacing** | Nhịp "ồ" và chuyển cảnh ngắn lại; kính → sổ có hành động nối (chụp sticker + lia máy) | Khoảng trống lời lớn nhất 2,8 s → **1,4 s**; sổ tới ở 12,75 s thay cho 14,0 s; chuyển động 0:16 0,2 → 1,7 |
| **Audio** | Nhạc đổi màu theo cảnh (hồi hộp → khám phá → nhịp → đáng yêu → vui → hồi hộp → bất ngờ → lắng nghe); không còn lỗ im; có nền đêm | Số giây nhạc dưới −45 dB 3 → **1** (giây "lắng nghe" có chủ đích); phổ nhạc dao động 349–3688 Hz giữa các cảnh; lời vẫn rõ: thấp nhất **11,5 dB** (≥ 10) |
| **Visual** | Ba lớp có parallax, bụi trăng, quầng trăng, máy trôi ở cảnh sổ, nền tối khi lắng nghe để nhân vật nổi lên | Số giây gần như đứng yên (chuyển động < 1) 5 → 4; giây còn lại là chỗ Albie đang nói và chỗ lắng nghe có chủ đích |
| **Engage / Loop** | Câu gọi ngắn, mời trẻ lắng nghe; câu trả lời là chính âm thanh mở đầu phim | Khung cuối chênh khung đầu 8,6/255 (liền) |
| **Chất lượng chung** | `_shared/qa.py` | 23/23 đạt; −13,9 LUFS; đỉnh thật −1,5 dBTP; Whisper 10/10 câu trên cả `small.en` và `base.en` |
