# SHORT-014 · Bảng cue âm thanh (hình ↔ tiếng)

Mọi tiếng động đặt theo sự kiện trong `timeline.js` (`EV`) → `events.json` → `mix.py` (bảng `SFX`). Tiếng nằm dưới lời thì ở dải cao và nhỏ, hoặc ở dải trầm; tiếng động nhường giọng bằng `toon.duck`. Mỗi chuyển cảnh một tiếng riêng.

**Tiếng riêng của nhân vật không lời:** Hop có tiếng **khúc khích "xè-xè"** (chuỗi tiếng cạo ngắn cao dần, như chân cọ cánh, xen tiếng "hi" nhỏ; `hopgiggle` trong `mix.py`) và **cú nảy "boing"** (lò xo trầm + còi trượt vút lên khi vọt, còi trượt xuống khi rơi về). Bụng Crumb có tiếng **"ục ục"** (`tummy` trong `mix.py`: tiếng gầm trầm lượn cao độ, rung "r-r-r", bong bóng sôi).

| Giây | Hình | Tiếng | Hàm |
|---|---|---|---|
| (21,45)–0,05 | Hop rơi về đúng chỗ cũ, đáp, Crumb chạy lại áp tai (nối vòng lặp) | còi trượt xuống; "bộp" + boing + bụi; bước chân lon ton | `fall`, `landing`, `scurry` |
| 0,0 | Chữ TUMMY / EARS?! nảy từng dòng | pop chữ móc + boing từng dòng | `titlepop`, `wordpop` |
| 0,05 | Crumb áp đầu vào bụng Hop | "bóp" mềm | `press` |
| 1,05 | Hop nhột, khúc khích | "xè-xè" + "hi-hi" | `giggle` |
| 1,15 | Hop nảy nhẹ | boing nhỏ | `hop` |
| 1,18–1,68 | Crumb bị hất bật ra | boing + whoosh | `bump` |
| 1,68 | Crumb đáp | "bonk" mềm | `plop` |
| 1,9 | Râu Crumb cuộn thành hai dấu "?" | hai blip đi lên | `qq` |
| 1,98 · 2,38 | Miss Loupe bật vào, đáp xuống (trước chữ "Well") | zip vút; "bộp" trầm | `zip`, `landL` |
| 2,35 | Chữ móc rời đi | whoosh mỏng đi xuống | `titleout` |
| 5,0 | Kính bật về phía máy | riser + còi trượt | `zoom` |
| 5,4 | Kính lướt từ mặt Hop xuống bên bụng | whoosh dài, nhỏ | `glide` |
| 6,35 · 6,4 | Màng nhĩ sáng lên; chữ EAR! | lấp lánh nhỏ (dải cao); pop chữ | `glowup`, `tag` |
| 7,75 | Crumb bước lại gần, khum tay | bước chân tí hon | `steps` |
| 8,45 · 8,72 · 8,99 | Ba vòng sóng "Hello in there!" chạm màng nhĩ | "dum" tom trầm + lò xo (dải trầm, dưới giọng) | `ripple` |
| 9,15 | Chữ EARDRUM! | pop chữ | `tag` |
| 10,45 · 11,5 | Màng nhĩ rung theo giọng Miss Loupe | lò xo trầm rất nhỏ | `wiggle` |
| 12,25–13,15 | Chụp → sticker → sổ | chụp, xuyên kính, lùi ra sổ, lật trang, dán, ding | `snap`, `zoomin`, `zoomout`, `page`, `swipe`, `stamp`, `ding` |
| 13,4 | Hop nhảy vào sổ | boing + whoosh | `hopin` |
| 13,65–14,15 | Albie đếm chân | blip "1 2 3" | `countA` |
| 15,25 · 15,65 | Hop lao vào trang, Albie "đớp" | nhảy, ực | `jump`, `gulp` |
| 15,85 | Sticker Hop tí hon | chuỗi pop | `pops` |
| 16,3 | Lật trang về hòn đá | giấy + whoosh | `flip` |
| 16,9 · 17,05 | Crumb nhìn vụn bánh, liếm môi | blip; "chụt chụt" | `glance`, `lick` |
| 17,33 · 17,67 | Bụng Crumb sôi | **"ục ục"** (gầm trầm + bong bóng) | `rumble` |
| 17,43–18,29 | Máy lao vào màng nhĩ rồi lùi ra | whoosh vào; whoosh ra | `crash`, `crashout` |
| 17,63 · 17,97 | Sóng "ục ục" chạm màng nhĩ, màng rung mạnh | "thùm" tom trầm + lò xo rung | `thrum` |
| 18,29 | Hop giật mình | "ồ!" (còi vút + boing + ting) | `startle` |
| 18,33 | Hop co chân sau lấy đà | lên dây cót "tách-tách" | `crouch` |
| 18,51 · 18,56 | Hop vọt thẳng lên khỏi khung | boing lớn + còi trượt vút lên + whoosh; bụi | `leap`, `dust` |
| 21,0 | Chữ móc trở lại | pop chữ + boing | `recall` |
| 21,45–21,95 | Hop rơi về, đáp đúng chỗ cũ | còi trượt xuống; "bộp" + boing (đuôi tiếng gấp về đầu phim) | `fall`, `landing` |
| 21,5 | Crumb chạy lại áp tai | chạy lon ton | `scurry` |
| 21,55 | Miss Loupe nhảy ra khỏi khung | zip đi xuống + whoosh | `hopout` |

**Nền:** gió chiều rất nhỏ; chim xa hót hai tiếng (còi trượt ngắn ở 2,6–4 kHz) chỉ ở chỗ không có lời, không có trong kính và trong sổ.

**Không lạm dụng:** tối đa 8 cue trong 1 s sau móc; lời hơn riêng tiếng động ≥ 11 dB ở mọi câu (`qa.py`). Các tiếng dưới lời ("ripple", "wiggle", "glowup", "tag") là tiếng trầm hoặc tiếng rất ngắn ở dải cao.
