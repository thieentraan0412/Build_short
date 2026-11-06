# SHORT-001 · Bảng cue âm thanh

Lượt sound design theo `Task.md`: hook âm thanh ngay từ 0 s, mỗi chuyển cảnh một tiếng riêng, nhạc chạy liền mạch, lời không bị che.
Hình, lời thoại và thời lượng (52,0 s) giữ nguyên; chỉ `mix.py` và khối `EV` trong `timeline.js` thay đổi.
Tiếng động lấy từ [`_shared/audio/toon.py`](../../_shared/audio/toon.py), nhạc cụ và nhạc hiệu lấy từ [`_shared/audio/band.py`](../../_shared/audio/band.py). Không dùng mẫu âm thanh của bên thứ ba.
Bản trước: `out/short-001-v1.mp4`, `out/mix-v1.py`, `out/timeline-v1.js`.

## 3 giây đầu (hook)

Nhịp móc làm lại theo [HOOK.md](HOOK.md): bàn chân có mặt từ khung đầu, Miss Loupe phản ứng ở 1,6 s, Flutter đậu và chân lóe sáng ở 2,6–3,4 s.

| Thời điểm | Hình | Tiếng |
|---|---|---|
| 0,00 | Bàn chân lơ lửng ngay trên cây kem, ngón ngọ nguậy "đánh hơi"; Flutter lơ lửng bên trái, mắt tròn xoe phồng to; chữ TASTE WITH bật ra (80% → 100% trong 0,22 s) | Chữ bật: bong bóng cao + phím glock. Cánh vỗ nhỏ. Kick mỗi phách đến cú giẫm, pizzicato trầm đi lên từng nửa cung C → F, mõ gỗ phách lẻ; xylophone "hỏi" đi lên (MUSIC.md). Lời: "Can you taste with your feet?" |
| 0,55 | FEET?! hiện từng ký tự | Chuỗi 6 bong bóng cao dần, mỗi ký tự một tiếng |
| 0,62 | Ngón chân chạm thử đỉnh kem, kem rung rinh | "Boop": bong bóng trầm + giọt nhỏ, ngay sau chữ "taste" |
| 0,90–1,30 | Chân nhấc lên lấy đà | Lên dây cót tách-tách nhanh dần (tiếng ngắn: không che chữ "feet"); hai tiếng tom dồn ở 1,25 · 1,375 |
| 1,32 | Chân rơi | Gió vút ở dải cao |
| 1,50 | Giẫm bẹp cây kem, màn hình rung; Flutter giật nảy lên | Thump + bẹp kem; cả dàn đánh C cùng lúc (kick, tuba, hợp âm pizzicato, kèn, chũm chọe mềm) |
| 1,53 | Chữ còn lắc | Lò xo trầm "boyoing" |
| 1,60 | Miss Loupe bật lên từ góc dưới-phải, mắt tròn xoe, miệng chữ O | Swipe mỏng, pan phải (nằm trong khoảng trống giữa hai câu) |
| 1,62 · 1,78 · 1,94 | Giọt kem văng ra | Ba tiếng giọt nước, mỗi giọt một cao độ |
| 2,00 | Bàn chân vút khỏi khung (2,0–2,4) | Zíp đi lên, xong trước chữ "Butterflies" |
| 2,00–2,60 | Flutter sà từ chỗ lơ lửng xuống chỗ kem bẹp, bay thấp dưới chữ | Cánh vỗ |
| 2,00–3,50 | | Nhạc nảy theo phách: kick, clap, bass G, mõ gỗ; không có tiếng xì dưới "Butterflies can!" |
| 2,25 | Miss Loupe bật cười | Lời: "Butterflies can!" |
| 2,60 | Flutter đậu lên chỗ kem bẹp | Tiếng đậu |
| 2,88 · 3,12 | Flutter dậm chân; trong kính, vệt sáng chanh dưới sáu bàn chân, đốm sao nháy; Miss Loupe ngước nhìn vào kính | Hai tiếng tink ở 3,25 và 3,37 (sau chữ "can") |

## Chuyển cảnh: mỗi lần một tiếng

| Thời điểm | Chuyển | Tiếng |
|---|---|---|
| 3,5 → 4,0 | Kính nở → tựa | Dâng glock + chũm chọe ngược, marimba chạy lên; chạm nhạc hiệu đúng 4,0 |
| 5,5 → 6,0 | Kính có bông hoa → khu vườn | Gió xoáy + gliss glock; huy hiệu SECRET 1: bong bóng + ding (C) + chũm chọe mềm |
| 17,0 → 18,0 | Vườn ban ngày → đêm của dế | Gliss rơi xuống ("trời tối") + gió dâng; huy hiệu SECRET 2: ding (E) |
| 27,0 → 28,0 | Đêm → tổ ong | Ong vo ve dâng lên + gió; huy hiệu SECRET 3: ding (G) |
| 34,0 | Tổ ong thu nhỏ → bản đồ khu vườn (kéo máy) | Whoosh lùi rộng + chũm chọe sáng |
| 39,0 → 40,0 | Bông hoa nở trùm màn hình → sổ | Gliss đàn hạc đi lên + xoáy + riser; trang sổ: giấy sột soạt |
| 47,5 → 48,0 | Kính Miss Loupe nở → cảnh kết | Xoáy nhanh + lấp lánh đi lên; nhạc bốn nốt đi xuống |

## Góc máy, nhân vật xuất hiện, phát hiện

| Thời điểm | Hình | Tiếng |
|---|---|---|
| 4,0 | Miss Loupe trượt vào từ trái (tựa) | Swish nhỏ dưới nhạc hiệu |
| 8,0 | Bướm đậu, bông hoa nhún | Đậu + boing nhẹ |
| 8,2 · 20,0 | Miss Loupe trượt vào | Swipe, mỗi lần một dải |
| 9,6 | Kính phóng to ("Let's zoom in!") | Riser + còi đi lên (tiếng zoom của kênh) |
| 10,4 | Điểm nếm sáng | Lấp lánh + bong bóng |
| 13,0 · 16,4 · 22,6 · 25,9 · 26,8 | Kính di chuyển | Swish lùi / tiến, mỗi lần dài ngắn và hướng khác nhau |
| 14,25 | SWEET! | Chime |
| 19,0 · 19,3 | WHERE ARE / ITS EARS? | Hai chuỗi bong bóng |
| 22,3 | Nope! | BZZT |
| 23,1 · 23,6 | Dế im, Miss Loupe đang nghĩ | Mõ gỗ tích… tắc; nhạc không gõ nốt mới, các nốt trước ngân hết tự nhiên |
| 23,9 → 24,0 | Kính phóng to vào tai: EARS ON ITS LEGS! | Swish phóng + riser → chuông phát hiện + bong bóng + chũm chọe |
| 28,2–29,6 | Bóng thoại rỗng, ba chấm nảy | Bong bóng + sáu tiếng "blíp" theo từng chấm (ong không nói được); nhạc nghỉ như trên |
| 30,0 | DANCE! | Tiếng dán + chũm chọe, ban nhạc vào |
| 36,2 | Bông hoa đích nở | Bong bóng + lấp lánh đi lên |
| 36,6 · 36,8 | THE DANCE / SHOWS THE WAY! | Hai chuỗi bong bóng |
| 36,2–39,8 | Rollo lăn ngang (Find Rollo!) | Tiếng lăn đi theo từ phải sang trái |
| 40,2 · 40,7 · 41,2 | Ba sticker bay vào | Swipe, cao dần |
| 40,5 · 41,0 · 41,5 | Dán sticker, Albie tỉnh | Tiếng dán cao dần 1-2-3, boing, giấy |
| 48,0–50,5 | Flutter rón rén lại gần | Nhạc nhón chân nhỏ dần (thay cho khoảng lặng cũ) |
| 49,0–49,75 | Đậu lên mặt kính, chân nếm thử | Tink thuỷ tinh ×4 |
| 50,1 · 50,5 | Hút, Miss Loupe bật cười | Slurp · hai nốt dẫn → boing + hợp âm C + chũm chọe |

## Nhạc

Lượt nhạc nền theo cảnh ("Tổ khúc khu vườn"): bảng Soundtrack Timeline, giọng, điệu, nhạc cụ và số đo ở [MUSIC.md](MUSIC.md).
Lưới 120 BPM giữ nguyên vì hình khớp theo phách. Hai khoảng lặng trước đáp án (23–24 s, 29–30 s) giữ nguyên: chỉ ngừng gõ nốt mới, nốt cũ ngân hết, tiếng nền đêm và tổ ong vẫn chạy. Thêm một chỗ ngắt nhạc cho gag kết (49,0–50,25 s); tiếng nền vườn chạy đến hết phim.
Bản trước lượt này (nhạc C–G–Am–F một khuôn suốt phim): `out/short-001-v3.mp4`, `out/mix-v3.py`.

## Nhường giọng và kiểm tra

- Nhạc chỉ giảm mạnh ở dải chữ (300–4000 Hz) khi có lời, ở mức −15 dB; bass, kick và lớp sáng giảm −6 dB. Tiếng động giảm −6 / −2 dB (`toon.duck`).
- Khâu cuối `toon.master` chặn đỉnh thật để `mux.sh` chuẩn hoá tuyến tính.
- Phim: −14,0 LUFS, đỉnh −1,6 dBFS, 52,0 s.
- Whisper `small.en` trên bản mix cuối: 85/85 từ. `base.en`: 84/85; chỗ lệch "In" → "and" ở câu của Albie, bản cũ cũng vậy.
- Giọng so với nhạc trong dải chữ (trung vị theo câu): 12,6–33 dB. Các câu bằng bản cũ (chênh trong ±1 dB) hoặc tốt hơn, trừ hai câu mở đầu vì hook giờ có nhịp:
  - "Can you taste with your feet?": 15,5 dB (bản cũ 19,6 dB);
  - "Butterflies can!": 18,4 dB (bản cũ gần như không có nhạc).
- Không có chỗ âm thanh tụt quá 24 dB trong 50 ms, không có đoạn nào dưới −55 dB. Bản cũ hụt ở 50,45 s và im ở 48,95 s.
- Không thêm lời thoại: lời đã bắt đầu từ 0,0 s và gần như liền đến 3,4 s.

## Lượt hook (HOOK.md): số đo bản mới

- Phim: −14,0 LUFS, đỉnh −1,6 dBFS, 52,0 s (không đổi).
- Whisper `small.en` trên bản cuối: 85/85 từ. `base.en`: 84/85, vẫn là chỗ "In" → "and" ở câu của Albie như các bản trước.
- Giọng so với nhạc trong dải chữ (trung vị theo câu) không đổi: "Can you taste with your feet?" 15,5 dB, "Butterflies can!" 18,4 dB. So với tiếng động: 32,9 dB và 34,9 dB. Tiếng "boop" mới nằm sau chữ "taste", hai tiếng tink nằm sau chữ "can".
- Không có chỗ tụt quá 24 dB trong 50 ms. Mức thấp nhất là −49 dB ở 51,9 s (đuôi hợp âm cuối).
- Hình sau 4,0 s giống bản v2 (PSNR trung bình 59 dB, chỉ khác do nén).
