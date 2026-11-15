# SHORT-012 · Bảng cue âm thanh (hình ↔ tiếng)

Mọi tiếng động đặt theo sự kiện trong `timeline.js` (`EV`) → `events.json` → `mix.py` (bảng `SFX`). Tiếng nằm dưới lời thì ở dải cao và nhỏ, hoặc ở dải trầm; tiếng động nhường giọng bằng `toon.duck`. Mỗi chuyển cảnh một tiếng riêng.

**Zip không lời:** giọng của Zip là tiếng "zip!" (`zip_`), tiếng phanh kít, tiếng cánh rì rì khi đứng yên, và trống thép trong nhạc.

**Bay lùi có hai tiếng:** ở chỗ không có lời là tiếng cào đĩa "wiki-wiki" (`scratch`, tần số đi lui đi tới, nhanh dần) cộng gió; dưới lời chỉ còn gió ở dải rất cao và tiếng "vù" trầm (`airback`), để không chạm dải giọng. Hàm `SFX['reverse']` tự chọn theo lời.

| Giây | Hình | Tiếng | Hàm |
|---|---|---|---|
| (23,45)–0,42 | Zip lao tới từ bên phải (nối vòng lặp) | cào đĩa ngắn, "zip!" tới, gió | `zipin` |
| 0,0 | Chữ TAIL / FIRST?! nảy từng dòng | pop chữ móc + boing từng dòng | `titlepop`, `wordpop` |
| 0,40 | Zip phanh kít trước kính | còi trượt xuống có rung ("kít") + "phụt" gió + "bộp" trầm | `brake` |
| 0,45 | Miss Loupe giật mình nhảy lên | boing + "ồ" | `startle` |
| 0,62–1,45 | Zip bay giật lùi (dưới câu móc) | gió dải cao + "vù" trầm | `reverse` |
| 1,45 | Zip đứng yên | cánh rì rì (rung trầm, rất nhỏ) | `hum` |
| 1,95 | Zip lao tới lần hai | "zip!" xuống + whoosh | `dash` |
| 2,18 | Phanh lần hai | "kít" nhỏ hơn | `brake` |
| 2,32–2,78 | Bay lùi lần hai (không có lời) | cào đĩa "wiki-wiki" + gió; nhạc "rewind" | `reverse` |
| 2,45–3,15 | Miss Loupe hoa mắt | lò xo lắc lư + pop đi xuống | `dizzy` |
| 4,25 | Kính bật về phía máy | riser + còi trượt | `zoom` |
| 5,55–6,95 | Trong kính: Zip bay lùi (dưới lời) | gió dải cao + "vù" trầm | `reverse` |
| 4,95 | Chữ BACKWARDS! | pop + bong bóng | `textpop` |
| 6,95 | Zip phanh trong kính | "kít" nhỏ | `brake` |
| 6,99 | Đứng yên (STILL!), ngay trước lời | "ting" + ding cao, cánh rì rì | `still` |
| 8,85 | Vào soi chậm | tiếng băng chậm dần, trầm xuống | `slowmo` |
| 9,48–11,98 | Mỗi nửa nhịp cánh soi chậm | "vút" ở dải rất cao + "phụp" trầm (ngoài dải giọng) | `stroke` |
| 12,0 | Zip vui | lấp lánh | `sparkle` |
| 12,55–13,47 | Chụp → sticker → sổ | chụp, xuyên kính, lùi ra sổ, lật trang, dán, ding | `snap`, `zoomin`, `zoomout`, `page`, `swipe`, `stamp`, `ding` |
| 13,5 | Zip bay vào trang sổ | zip | `zip` |
| 14,0–14,5 | Albie đếm chân | blip "1 2 3" | `countA` |
| 15,02–15,55 | Zip lùi đuôi vào trang (dưới lời) | gió dải cao + "vù" trầm | `reverse` |
| 15,55 · 15,75 | Albie "đớp"; sticker Zip tí hon | giấy + boing + "ực"; chuỗi pop | `gulp`, `pops` |
| 16,35 | Lật trang về vườn | giấy + whoosh | `flip` |
| 18,75–19,8 | Miss Loupe bước lùi | bước chân tí hon | `steps` |
| 18,85 · 19,17 · 19,49 | Còi lùi | "bíp" 1,6 kHz ngắn (không có lời lúc đó) | `beep` |
| 18,95 | Albie thấy, trợn mắt | "ồ" nhỏ + blip | `notice` |
| 19,8 | Lưng Miss Loupe chạm góc sách | "bộp" mềm + boing | `bonk` |
| 19,88 | Sao nhỏ quay quanh chỗ chạm | lấp lánh đi xuống | `stars` |
| 20,75 | Góc sách lấp lánh ("corners") | hai tiếng "ting" rất cao | `glint` |
| 21,55 | Miss Loupe cười đỏ mặt | cười khúc khích (không giọng người) | `giggle` |
| 21,7 · 22,08 | Albie nhảy ra khỏi khung | boing | `hop` |
| 21,75–23,15 | Zip bay lùi ngang khung (dưới câu hỏi) | gió dải cao + "vù" trầm | `reverse` |
| 22,95 | Chữ móc trở lại | pop + boing nhỏ | `recall` |
| 23,45 | "Rewind", Zip lao tới lại | cào đĩa + "zip!" (đuôi tiếng gấp về đầu phim) | `zipin` |

**Nền:** gió lá rất nhỏ; chim xa hót hai nốt ngắn (còi trượt 2,3–3,1 kHz, rất nhỏ) chỉ ở chỗ không có lời, không có trong kính và trong sổ.

**Không lạm dụng:** ≤ 8 cue trong 1 s bất kỳ sau móc; lời hơn riêng tiếng động ≥ 11 dB ở mọi câu (`qa.py`).
