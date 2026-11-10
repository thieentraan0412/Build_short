# SHORT-008 · Bảng cue âm thanh (hình ↔ tiếng)

Mọi tiếng động đặt theo sự kiện trong `timeline.js` (`EV`) → `events.json` → `mix.py` (bảng `SFX`). Tiếng nằm dưới lời thì ở dải cao và nhỏ, hoặc ở dải trầm; tiếng động nhường giọng bằng `toon.duck`. Mỗi chuyển cảnh một tiếng riêng.

| Giây | Hình | Tiếng | Hàm |
|---|---|---|---|
| 0,0 | Chữ NOT / HOT?! nảy từng dòng | pop chữ móc + boing từng dòng | `titlepop`, `wordpop` |
| 0,0–0,9 | Miss Loupe run cầm cập | răng va lập cập (mõ gỗ hai cao độ, rất nhanh) | `chatter` |
| 0,05 | Đuôi Blink sáng | lấp lánh rất nhỏ | `glowhum` |
| 0,45 · 2,15 | Hơi thở phả thành khói | "phù" mềm | `breath` |
| 0,7–1,15 | Băng mọc trên tay | lách tách tinh thể + lấp lánh đi xuống | `frost` |
| 1,2 | Miss Loupe giật nảy | còi trượt vút lên + boing + ting (ngạc nhiên) | `startle` → `toon.surprise` |
| 1,25–1,9 | Vẩy tay "BRRR!" | rung môi "brrr" | `brrr` |
| 1,35 | Blink khúc khích | cười khúc khích "hi-hi-hi-hi" (không lời) | `giggle` → `toon.giggle` |
| 3,2 | Đuôi bùng sáng | lấp lánh + ting + dâng + "whumm" trầm | `flare` |
| 3,85 | Giơ kính | whoosh lên | `swish` |
| 4,95 | Kính bật về phía máy | riser + còi trượt | `zoom` |
| 5,45 | Lao vào trong đèn đuôi | gió xoáy + "blup" | `dive` |
| 5,95 · 6,95 | Bong bóng xanh lùa vào từ ống thở | chuỗi bong bóng | `bubbles` |
| 6,35–8,42 | Tám cú pha trộn | pop + ting cao dần + bong bóng (mỗi cú một cao độ) | `mix` |
| 8,6 | Buồng sáng bừng lên | lấp lánh + ding + dâng | `bloom` |
| 8,75 | Nhiệt kế trượt vào | whoosh mỏng | `swipe` |
| 9,2 | Nhiệt kế run | răng va nhỏ | `chatter` |
| 10,25 | Vạch đỏ nhích một nấc | "tích" | `tick` |
| 10,95 | Kính lùi ra | whoosh xuống | `swish` |
| 11,4 | Blink nháy mắt | tink + lấp lánh | `wink` |
| 11,9–12,8 | Chụp → sticker → sổ | chụp, xuyên kính, lùi ra sổ, lật trang, dán, ding | `snap`, `zoomin`, `zoomout`, `page`, `swipe`, `stamp`, `ding` |
| 13,0 | Blink bay vào | zip vút | `zip` |
| 13,25–13,75 | Albie đếm chân | blip "1 2 3" | `count` |
| 14,75 · 15,15 | Blink lao vào trang, Albie "đớp" | nhảy, ực | `jump`, `gulp` |
| 15,35 | Sticker Blink tí hon | chuỗi pop | `pops` |
| 15,85 | Lật trang về trại | giấy + whoosh | `flip` |
| 17,5 | Blink ngượng, che mặt | lấp lánh đỏ mặt | `blush` |
| 18,6–19,75 | Đuôi bùng chói cả trại | "FWOOM": thân trầm dâng + lấp lánh (dải giọng giữ nhỏ dưới "I'm not glowing!") | `blaze` |
| 18,75 | Miss Loupe nheo mắt | "hử?" | `huh` |
| 19,75 | Ánh sáng dịu lại | glockenspiel vuốt xuống | `dim` |
| 21,3 | Chữ móc trở lại | pop chữ + boing | `recall` |
| 21,3 | Miss Loupe lại xoa tay hơ | xoa tay | `rub` |
| 21,45 | Vòng sáng mở về khung đầu | gió xoáy + chũm chọe ngược + lấp lánh | `glowiris` |

**Nền:** gió đêm trầm rất nhỏ; dế rất xa (`band.chirp`) chỉ ở chỗ không có lời, không có trong kính và trong sổ.

**Không lạm dụng:** dày nhất 7 cue trong 1 s sau móc (ngưỡng 8); lời hơn riêng tiếng động ≥ 11 dB ở mọi câu (`qa.py`).
