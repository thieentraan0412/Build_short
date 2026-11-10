# SHORT-009 · Bảng cue âm thanh (hình ↔ tiếng)

Mọi tiếng động đặt theo sự kiện trong `timeline.js` (`EV`) → `events.json` → `mix.py` (bảng `SFX`). Tiếng nằm dưới lời thì ở dải cao và nhỏ, hoặc ở dải trầm; tiếng động nhường giọng bằng `toon.duck`. Mỗi chuyển cảnh một tiếng riêng.

| Giây | Hình | Tiếng | Hàm |
|---|---|---|---|
| (23,4)–0,08 | Fizz bay vòng về và đáp xuống lá (nối vòng lặp) | ruồi vo ve (răng cưa ~196 Hz, nhịp vỗ cánh của ruồi nhà), lượn cao độ | `buzzloop` |
| 0,0 | Chữ WHO'S / THE FLY?! nảy từng dòng | pop chữ móc + boing từng dòng | `titlepop`, `wordpop` |
| 0,08 | Fizz chạm lá | "bộp" nhẹ + giọt nước | `land` |
| 0,1 | Fizz thôi vỗ cánh | vo ve tắt dần | `buzzout` |
| 0,75–1,5 · 1,0–1,7 | Fizz cọ hai chân trước; Blink bắt chước | "sột sột" cạo ngắn | `rub` |
| 1,55 · 1,75 | Hai bạn nhún | boing nhỏ | `hop` |
| 2,0 | Blink giơ chân nhận | lấp lánh + ting | `tadasmall` |
| 3,15–3,72 | Khựng | trống lăn thì thầm | `hush` |
| 3,22 · 3,66 | Miss Loupe bật vào, đáp xuống (trước chữ "Nope!") | zip vút; "bộp" trầm | `zip`, `landL` |
| 4,42 | Blink xìu (sau chữ "Nope!") | "phù" xì hơi nhỏ (đi cùng trombone "wah-wah") | `deflate` |
| 5,75 | Kính bật về phía máy | riser + còi trượt | `zoom` |
| 6,45 | Fizz xoè cánh | vo ve | `buzz` |
| 7,0 · 7,35 | Số "1", "2" trên cánh ruồi | ding + blip cao dần | `count` |
| 8,5 | Kính lia sang Blink | whoosh | `swish` |
| 9,7 | Tấm cánh bật lên | "clack" + mõ | `clack` |
| 10,45 | Hai cánh mỏng mở | whoosh mảnh + lấp lánh | `unfold` |
| 9,75–10,9 | Số "1–4" trên cánh Blink | ding + blip tiếp tục cao dần | `count` |
| 12,2 | Blink tự hào | lấp lánh | `sparkle` |
| 13,4–14,3 | Chụp → sticker → sổ | chụp, xuyên kính, lùi ra sổ, lật trang, dán, ding | `snap`, `zoomin`, `zoomout`, `page`, `swipe`, `stamp`, `ding` |
| 14,6 | Blink bay vào | zip | `zip` |
| 14,85–15,35 | Albie đếm chân | blip "1 2 3" | `countA` |
| 16,45 · 16,85 | Blink lao vào trang, Albie "đớp" | nhảy, ực | `jump`, `gulp` |
| 17,05 | Sticker Blink tí hon | chuỗi pop | `pops` |
| 17,6 | Lật trang về chiếc lá | giấy + whoosh | `flip` |
| 18,25 | Fizz nhấc cánh như tấm cánh | vo ve ngắn | `buzz` |
| 18,55–19,05 | Fizz gồng đuôi | "ưm" rung nhẹ, cao dần | `strain` |
| 19,08 | "Xì": tia lách tách, khói nhỏ | lách tách + xì hơi | `fizzle` |
| 20,35 | Fizz nhún vai | hai blip đi xuống | `shrug` |
| 20,6–21,3 | Fizz cọ chân | "sột sột" | `rub` |
| 22,4 | Fizz cất cánh, bay một vòng | vo ve lượn (nối sang đầu phim) | `buzzloop` |
| 23,0 | Chữ móc trở lại | pop chữ + boing | `recall` |
| 23,45 | Miss Loupe nhảy ra khỏi khung | zip đi xuống + whoosh | `hopout` |

**Nền:** gió chiều rất nhỏ; dế bắt đầu gáy xa (`band.chirp`) chỉ ở chỗ không có lời, không có trong kính và trong sổ.

**Không lạm dụng:** dày nhất 7 cue trong 1 s sau móc (ngưỡng 8); lời hơn riêng tiếng động ≥ 11 dB ở mọi câu (`qa.py`).
