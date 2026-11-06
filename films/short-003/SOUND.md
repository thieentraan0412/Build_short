# SHORT-003 · Bảng cue âm thanh

Tiếng động lấy từ [`_shared/audio/toon.py`](../../_shared/audio/toon.py), nhạc cụ lấy từ [`_shared/audio/band.py`](../../_shared/audio/band.py). Không dùng mẫu âm thanh của bên thứ ba. Nhạc theo cảnh: [MUSIC.md](MUSIC.md).

## 3 giây đầu (hook)

| Thời điểm | Hình | Tiếng |
|---|---|---|
| 0,00 | Đêm, sân khấu nấm. Chirp vươn chân trước lên nghe; con dế xa (bóng đen trên vầng trăng) đang gáy; chữ EARS ON / KNEES?! bật ra (85% → 100% trong 0,22 s) | Chữ bật: bong bóng cao + phím glock. Tiếng gáy xa (pan phải). Nhịp swing chạy ngay: bass Rê, vibraphone, kick nhẹ |
| 0,10 | | Lời: "What if your ears were on your knees?" |
| 0,50 | Vòng sóng chạm tai, mắt Chirp tròn xoe | "Ping" (tink + bong bóng) + vibraphone La–Rê |
| 0,75–1,70 | Chirp hạ chân, gáy đáp lại; ba nốt nhạc bật lên | Bốn tiếng gáy của Chirp, ba tiếng bong bóng theo nốt; phím điện chen vào giữa các tiếng gáy |
| 1,75 | Lại vểnh chân nghe | Boing + swipe; bass chạy lên "tò mò" |
| 2,00 · 2,25 | | Con dế xa gáy trả lời |
| 2,45 | Máy kéo xa | Whoosh lùi |
| 2,55 | Chữ móc thu nhỏ biến mất | Còi trượt xuống nhỏ |
| 2,60 | Miss Loupe và kính trượt vào từ phải | Swipe mỏng, pan phải |
| 2,75 | | Lời: "Let's zoom in!" |
| 3,40 | Mặt kính dừng trên ống chân | Tink thuỷ tinh |

## Soi, nhịp "ồ", sổ, gag

| Thời điểm | Hình | Tiếng |
|---|---|---|
| 3,60 | Kính phóng to | Riser + còi đi lên (tiếng zoom của kênh) |
| 4,50 | Cái tai sáng lên (mint) | Lấp lánh; mô-típ bí mật Fa–La–Đô trên vibraphone |
| 7,30 | Kính lùi nhẹ để thấy sóng bay tới | Swish mỏng ở dải cao |
| 7,55 · 8,05 · 8,85 → 8,0 · 8,5 · 9,3 | Ba vòng sóng hội tụ vào tai, mặt tai phồng lên như mặt trống | Mỗi vòng: tiếng gáy xa trước 0,45 s, rồi "bum" mềm ở dải trầm (thump + lò xo), bass và tom (nằm dưới lời) |
| 8,45 · 9,30 | TINY DRUM! hiện cùng chữ "tiny", nảy lên ở cú "bum" thứ ba | Trống dồn nhỏ + hợp âm Fa |
| 9,80 · 10,10 | Kính rời chân; máy đẩy vào | Swish lùi · gió dâng trầm |
| 10,50 | Miss Loupe nhảy lên mép mũ nấm, đứng sau cái chân | Swish nhỏ |
| 10,80 | | Lời: "Hello, little ears!" |
| 12,35 · 12,70 | Chirp khúc khích, tai lóe sáng; cô bật cười | Sáu tiếng gáy ngắn cao dần + lấp lánh nhỏ · boing |
| 13,50 → 14,00 | Kính nở thành trang sổ | Xoáy + dâng glock; marimba chạy lên → kick + chũm chọe mềm |
| 14,00 · 14,50 | Trang sổ; sticker "Hear with legs" dán | Giấy + bong bóng · swipe → tiếng dán + ding Fa |
| 15,00 | | Lời (Albie): "Six legs? In you go!" Dưới câu chỉ có tiếng búng tay |
| 17,35 → 17,80 | Chirp nhảy tới cạnh sổ | Boing + swish → đậu; bass chạy lên |
| 18,00 | | Lời (Albie): "Ears on its head?" |
| 19,56 · 19,60 | "NOPE!" (Miss Loupe hét ngoài khung): chữ to bay vào, màn hình rung | Swish + lò xo trầm; cả ban nhạc khựng một phát. Lời "NOPE!" to hơn các câu khác (×1,35) |
| 19,65 · 19,70 | Trang Albie phần phật; Chirp bịt chặt đầu gối, run run | Giấy · "chụt" + run run; **nhạc ngắt** đến 21,15 |
| 21,20 | | Lời: "Oops! Sorry!" |
| 22,20 · 22,60 | Chirp hé mắt; lại vểnh chân nghe | Blip · boing; bass đi bộ quay lại |
| 22,95 · 23,20 · 23,75 | | Con dế xa lại gáy (nối sang khung đầu) |
| 23,30 → 24,00 | Vòng sóng âm từ cái tai mở ra đúng khung đầu | Xoáy + chũm chọe ngược, dâng đến điểm lặp; vibraphone rải lên, bass dẫn Mi → Rê |

Mỗi chuyển cảnh một tiếng riêng (kéo xa: whoosh; kính → sổ: xoáy + glock; vòng lặp: xoáy + chũm chọe ngược). Tiếng lấp lánh và tiếng chuyển cảnh có đuôi vang mềm (`verb`).

## Nhường giọng và kiểm tra

- Nhạc chỉ giảm mạnh ở dải chữ (300–4000 Hz) khi có lời, ở mức −15 dB; bass, kick và lớp sáng giảm −7 dB. Tiếng động giảm −8 / −3 dB (`toon.duck`).
- Khâu cuối `toon.master` chặn đỉnh thật để `mux.sh` chuẩn hoá tuyến tính. Mép đầu file có fade-in 20 ms, như SHORT-002.
- Phim: −13,9 LUFS, đỉnh −1,5 dBFS, 24,0 s. Chỗ nối vòng lặp trong `out/mix.wav` liền (chênh 0,001).
- Giọng so với mọi thứ còn lại (dải chữ, trung vị theo câu): 14–28 dB. Câu móc 14,9 dB.
- Whisper trên bản cuối:
  - `small.en` 39/40 từ, `base.en` 39/40. Chỗ lệch ở cả hai là "In" → "and" trong câu cửa miệng của Albie "Six legs? In you go!".
  - Dưới câu này không có nhạc và tiếng động thấp hơn lời 68 dB. Khi kiểm riêng từng câu, câu này qua được cả hai model. Câu cửa miệng dùng chung một bản thu ở mọi tập, nên không đổi.
  - SHORT-001 cũng có chỗ lệch này với `base.en`.
- Không có chỗ tụt quá 24 dB trong 50 ms. Phần trên 6 kHz chiếm 3,5% năng lượng.

## Bản v2 (tối ưu theo Retensis, [RETENSIS.md](RETENSIS.md))

| Thời điểm | Hình | Tiếng mới |
|---|---|---|
| 0,00–0,45 | Máy lao vào Chirp, vệt tốc độ | Whoosh lao vào (swish dải cao + còi nhẹ) |
| 9,60 | Kính rời chân, máy đẩy vào, Miss Loupe nhảy lên mép nấm (cùng lúc) | Swish lùi + gió dâng (dời sớm 0,2–0,8 s) |
| 12,10 | Kính "chụp" cái tai | "Tách" chụp ảnh (hai click) + lấp lánh đi lên |
| 12,20 | Sticker bật ra khỏi mặt kính | Pop + bong bóng |
| 12,30–12,75 | Lia máy ngang sang sổ | Whoosh lia (pan phải) |
| 12,85 | Sticker dán | Dán + ding Fa |
| 22,85 · 23,15 · 23,70 | Con dế xa trên vầng trăng gáy; tai Chirp lóe | Tiếng gáy xa (chính là tiếng của khung đầu) |

Bỏ: xoáy của kính nở (`lensiris`), swipe sticker bay vào. Các tiếng còn lại giữ nguyên, dời theo mốc mới trong `timeline.js`.
