# SHORT-002 · Bảng cue âm thanh

Lượt sound design theo `Task.md`: hook âm thanh ngay từ 0 s, mỗi chuyển cảnh một tiếng riêng, nhạc chạy liền mạch, lời không bị che.
Hình, lời thoại và thời lượng (22,0 s) giữ nguyên; chỉ `mix.py` và khối `EV` trong `timeline.js` thay đổi.
Tiếng động lấy từ [`_shared/audio/toon.py`](../../_shared/audio/toon.py), nhạc cụ lấy từ [`_shared/audio/band.py`](../../_shared/audio/band.py). Không dùng mẫu âm thanh của bên thứ ba.
Bản trước: `out/short-002-v1.mp4`, `out/mix-v1.py`, `out/timeline-v1.js`.

## 3 giây đầu (hook)

Nhịp móc làm lại theo [HOOK.md](HOOK.md): vòi bật ra như lò xo, Flutter giật mình rồi quay ra người xem, đốm sáng nháy ở bàn chân. Khung 0–0,5 s và khung cuối giữ nguyên để vòng lặp liền.

| Thời điểm | Hình | Tiếng |
|---|---|---|
| 0,00 | Flutter đang hạ xuống, chữ TASTY SOCKS?! | Phách đầu: kick + bass + phím glock cao + nốt marimba nối từ cuối phim. Cánh vỗ. Đuôi còi rơi nối qua điểm lặp |
| 0,10 | | Lời: "What if your socks could taste your snack?" |
| 0,50 | Chân dậm lên miếng dưa, nước bắn | Bẹp mọng nước + giọt bắn; ban nhạc đánh cùng lúc (kick, bass C, hai nốt marimba) |
| 0,55–2,0 | | Nhạc "nhón chân": bass gảy ngắn từng móc đơn + mõ gỗ phách lẻ (không có tiếng xì: shaker từng làm "snack" thành "snacks") |
| 0,68 | Máy đẩy cận vào đầu và cái vòi; chữ móc nhỏ lại, nhích lên khỏi cánh | Swish ngắn ở dải cao |
| 0,875 | Vòi bật ra như lò xo, vệt "bung" chanh, năm vạch hành động; mắt Flutter phồng to | Sproing + pop |
| 1,45 | Flutter cúi nhìn cái vòi đang nảy | |
| 1,90–2,28 | Vòi cuộn lại, Flutter quay ra phía người xem | Còi trượt xuống ở 2,28 (sau chữ "snack") |
| 2,30–2,36 | Hai đốm sao nháy ở bàn chân | Tink |
| 2,45 | Máy kéo xa | Whoosh lùi |
| 2,55 | Chữ móc thu nhỏ biến mất | Còi trượt xuống rất nhỏ |
| 2,60 | Miss Loupe và kính trượt vào từ phải | Swipe mỏng, pan phải |
| 3,40 | Mặt kính dừng trên bàn chân | Tink thuỷ tinh |

## Chuyển cảnh, góc máy, phát hiện

| Thời điểm | Hình | Tiếng |
|---|---|---|
| 3,60 | Kính phóng to ("Let's zoom in!") | Riser + còi đi lên (giống SHORT-001: tiếng zoom của kênh) |
| 4,50 | Chân dậm, điểm nếm sáng lên | Tap + lấp lánh + bong bóng |
| 7,00 | SWEET! | Chime |
| 8,0–8,9 | Tia "ngọt" chạy lên đầu | Chuỗi chuông đi lên |
| 9,2 · 10,2 | Vòi duỗi ra, hút | Còi trượt · slurp |
| 10,30 | Kính rời bướm | Swish lùi |
| 10,60 | Máy đẩy vào Miss Loupe | Gió dâng trầm |
| 12,20 | Sau chữ "Wow!" | Lấp lánh rơi xuống, pad mỏng (cảnh "ồ") |
| 12,5 · 12,75 · 13,0 | Gõ giày, nhún vai | Kít cao su ×2, boing |
| 13,50 → 14,00 | Kính nở thành cảnh sổ | Xoáy phép thuật + dâng glock, cắt gọn đúng 14,0; marimba chạy lên → kick + chũm chọe mềm |
| 14,00 | Trang sổ hiện ra | Giấy sột soạt + bong bóng nhỏ |
| 14,20 → 14,50 | Sticker bay vào từ phải, dán xuống | Swipe → tiếng dán + ding |
| 17,2 → 18,0 | Flutter bay vào, đậu lên mép trang | Cánh vỗ → đậu + giấy + boing |
| 18,9 · 20,05 | Hút góc trang, "Mmm!" | Slurp · tiếng ngân của Flutter |
| 21,25 | Flutter cất cánh, bay thẳng vào ống kính | Cánh vỗ + swish lao tới |
| 21,55 → 22,00 | Vòng đốm mắt mở ra cảnh đầu phim | Xoáy + chũm chọe ngược, dâng đến đúng điểm lặp |
| 21,65 → 0,10 | Flutter hạ xuống miếng dưa (qua điểm lặp) | Còi rơi; phần sau 22 s được gấp về đầu phim |

Mỗi chuyển cảnh dùng một tiếng khác nhau. Tiếng chuyển cảnh và tiếng lấp lánh có đuôi vang mềm (`verb`), nên không tắt cụt.

## Nhạc

Lưới 120 BPM, hoà âm C–G–Am–F như SHORT-001.
- Mở: có nhịp ngay từ phách đầu.
- Soi: đầy đủ nhất.
- Cảnh "ồ": chỉ còn một lớp pad.
- Sổ: thưa dưới giọng trầm của Albie.
- Gag: rút bè trầm.

Vòng lặp: các nốt ở 21,0 và 21,5 nối với nốt ở 0,0 và cú dậm ở 0,5. Mọi đuôi tiếng sau 22 s được cộng vào đầu phim.

## Nhường giọng và kiểm tra

- Nhạc chỉ giảm mạnh ở dải chữ (300–4000 Hz) khi có lời, ở mức −15 dB; bass, kick và lớp sáng giảm −7 dB. Tiếng động giảm −8 / −3 dB (`toon.duck`).
- Khâu cuối `toon.master` chặn đỉnh thật để `mux.sh` chuẩn hoá tuyến tính.
- Phim: −13,7 LUFS, đỉnh −1,2 dBFS, 22,0 s.
- Whisper `small.en` trên bản mix cuối: 34/34 từ. `base.en`: 32/34; hai chỗ lệch là "its" ↔ "it's" (đồng âm), bản cũ cũng vậy.
- Giọng so với nhạc trong dải chữ (trung vị theo câu): từ 6 dB ("It's sweet!", bằng bản cũ) đến 22 dB. Câu mở đầu đạt 15 dB.
- Không có chỗ âm thanh tụt quá 24 dB trong 50 ms, không có đoạn nào dưới −55 dB.
- Không thêm lời thoại: lời đã bắt đầu từ 0,1 s và nối liền đến 3,75 s. Chèn thêm câu sẽ làm dày phần mở và đổi lời gốc.

## Lượt hook (HOOK.md): số đo bản mới

- Phim: −13,7 LUFS, đỉnh −1,2 dBFS, 22,0 s (không đổi).
- Whisper `small.en` trên bản cuối (không lọc VAD): 34/34 từ. `base.en`: 32/34; hai chỗ lệch vẫn là "its" ↔ "it's" (đồng âm). Lần chạy `small.en` có lọc VAD bỏ sót cả đoạn sổ sau 14 s; nghe riêng đoạn 13–22 s thì đủ 8/8 từ. Phần tiếng đó không đổi so với bản v2, nên đây là lỗi giải mã của Whisper, không phải lời bị che.
- Giọng so với nhạc trong dải chữ: câu mở đầu 15,5 dB (bản trước 15 dB). So với tiếng động: 25 dB. Tiếng tink mới (2,36 s) nằm sau chữ "snack".
- Không có chỗ tụt quá 24 dB trong 50 ms.
- Khung 0–0,5 s và khung cuối không đổi trong code, nên vòng lặp vẫn liền. Hình sau 4,0 s giống bản v2 (PSNR trung bình 56 dB, chỉ khác do nén).
