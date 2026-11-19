# SHORT-011 · Bảng cue âm thanh (hình ↔ tiếng)

> **Cập nhật 19/11/2026 (dựng lại theo chuẩn 11/2026b, như SHORT-016):** phần dưới đây mô tả bản 14/11/2026. Mốc thời gian của các cue đã dời theo timeline mới; thêm các tiếng của điệp khúc 2 và các chuỗi có chủ đích (`run`). Bảng hiện hành: [`SOUND-PLAN.md`](SOUND-PLAN.md) (sinh từ `out/music.json`, `events.json`, `out/scenes.json`), [`TREATMENT.md`](TREATMENT.md) mục 7, 8, A và H.

Mọi tiếng động đặt theo sự kiện trong `timeline.js` (`EV`) → `events.json` → `mix.py` (bảng `SFX`). Tiếng nằm dưới lời thì ở dải cao và nhỏ, hoặc ở dải trầm; tiếng động nhường giọng bằng `toon.duck`. Mỗi chuyển cảnh một tiếng riêng (khoá kéo, mắt mở, chụp, lật trang).

| Giây | Hình | Tiếng | Hàm |
|---|---|---|---|
| 0,0 | Chữ SNEAK / UP?! nảy từng dòng | pop chữ móc + boing từng dòng | `titlepop`, `wordpop` |
| 0,02 · 0,25 · 0,75 · 1,25 · 1,75 | Crumb nhón chân (mỗi phách một bước) | "típ" gỗ nhỏ, mềm | `tiptoe` (`toon.footsteps`, soft) |
| 1,98 | Crumb giẫm lá khô | "rắc" giòn: chuỗi tiếng nứt + một tiếng gãy trầm | `crunch` (viết trong `mix.py`) |
| 2,04 | Crumb đứng sững một chân, lắc lư | lò xo trầm rung chậm | `wobble` |
| 2,1 | Đuôi Zip giật nhẹ (chi tiết xem lại) | blip cao rất nhỏ | `twitch` |
| 2,25 | Crumb cười trừ | cười khúc khích hai tiếng | `sheepish` |
| 3,0 | Chữ móc rời đi | whoosh đi xuống | `titleout` |
| 3,85–4,35 | Khoá kéo chạy xuống, tách khung | răng khoá lách tách dồn nhanh + "zíp" đi lên | `zipper` (viết trong `mix.py`) |
| 4,35 | Hai khung và hai nhãn bật ra | hai pop + giấy | `panels` |
| 6,6 | Mắt Zip mở (khung phải) | dâng lấp lánh + bong bóng | `eyeopen` |
| 6,9–7,9 | Tầm nhìn nở rộng, Crumb trượt vào | whoosh dài + còi trượt lên nhỏ | `widen` |
| 8,2 | Vòng "bị thấy rồi!" và "!" | ding + lấp lánh đi lên | `spot` |
| 9,65 | Crumb nấp sau tấm biển | whoosh đi xuống + giấy | `hide` |
| 10,3 | Hai vòm mắt Zip sáng lên (khung trái) | lấp lánh | `glow` |
| 10,8–12,3 | Vệt sáng chạy quanh tầm nhìn | gió xoáy nhẹ | `sweep` |
| 12,55 | Crumb ló ra vẫy | blip + cười khúc khích | `peek` |
| 13,25–14,15 | Chụp → sticker → sổ | chụp, xuyên qua, lùi ra sổ, lật trang, dán, ding | `snap`, `zoomin`, `zoomout`, `page`, `swipe`, `stamp`, `ding` |
| 14,25 | Zip bay vào trang sổ | zip | `zip` |
| 14,65–15,15 | Albie đếm chân | blip "1 2 3" | `countA` |
| 16,25 · 16,65 | Zip lao vào trang, Albie "đớp" | nhảy, ực | `jump`, `gulp` |
| 16,85 | Sticker Zip tí hon | chuỗi pop | `pops` |
| 17,0 | Lật trang về khu vườn | giấy + whoosh | `flip` |
| 17,55 · 17,8 | Crumb rón rén lần nữa | "típ" gỗ | `tiptoe` |
| 18,0 | Crumb hít một hơi thật sâu | hơi gió đi lên | `inhale` (viết trong `mix.py`) |
| 18,05 | Zip quay lại TRƯỚC | "zíp" + whoosh | `zipturn` |
| 18,4 | Crumb tự giật mình, nhảy bật ("EEK!") | ngạc nhiên (còi vút + boing + ting) + boing | `startle` |
| 18,44–19,12 | Tấm biển bay vèo, xoay (lộ mặt sau "hi!") | gió xoáy + còi trượt | `signfly` |
| 18,88 | Crumb ngã ngồi lên đệm cỏ | "phịch" mềm + nảy | `plop` (viết trong `mix.py`) |
| 19,12 | Tấm biển đáp lên đầu như chiếc mũ | "bonk" gỗ rỗng nhẹ + bong bóng | `hat` |
| 19,75 | Zip cười rung cánh | cười khúc khích cao | `giggle` |
| 20,55 | Zip quay lưng lại | "zíp" nhỏ | `zipturn` |
| 20,6 | Crumb đứng dậy | boing + whoosh lên | `getup` |
| 20,95 | Chữ móc trở lại | pop chữ + boing | `recall` |
| 21,5 → (0,02) | Crumb lại nhón chân (nối vòng lặp) | "típ" gỗ | `tiptoe` |

**Tiếng của nhân vật không lời:** Zip không có lời; tiếng của Zip là "zíp" (`toon.zip_`) khi quay người và tiếng cười cao rung cánh (`toon.giggle` ở cao độ cao). Trống thép trong nhạc là "mắt" của Zip.

**Nền:** gió lá rất nhỏ (nhiễu nâu lọc thấp); chim xa líu lo (còi trượt rất nhỏ, 3–4 kHz) chỉ ở chỗ không có lời, không có trong sổ.

**Không lạm dụng:** tối đa 8 cue trong 1 s sau móc; lời hơn riêng tiếng động ≥ 11 dB ở mọi câu (`qa.py`). Tiếng "rắc" rơi đúng khoảng lặng giữa câu móc và câu của Crumb, không đè lời.
