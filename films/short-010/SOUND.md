# SHORT-010 · Bảng cue âm thanh (hình ↔ tiếng)

Mọi tiếng động đặt theo sự kiện trong `timeline.js` (`EV`) → `events.json` → `mix.py` (bảng `SFX`). Tiếng nằm dưới lời thì ở dải cao và nhỏ, hoặc ở dải trầm; tiếng động nhường giọng bằng `toon.duck`. Mỗi chuyển cảnh một tiếng riêng.

| Giây | Hình | Tiếng | Hàm |
|---|---|---|---|
| 0,0 | Chữ BEHIND / YOU?! nảy từng dòng | pop chữ móc + boing từng dòng | `titlepop`, `wordpop` |
| (42,8)–1,2 | Crumb nhón chân rón rén (nối từ cuối phim) | tiếng gỗ nhỏ cao, hai nốt luân phiên mỗi bước | `tiptoe` |
| 1,0 | Con ngươi của Zip trượt ra sau vòm mắt | "bíp" cao + ting | `peek` |
| 1,38 | Zip vụt lên | zip đi lên + whoosh | `zip` |
| 1,42 · 1,72 | Crumb giật mình · ngã ngồi | boing + còi; "bịch" + boing nhỏ | `startle`, `bump` |
| 1,95 | Miss Loupe quay lại | whoosh nhỏ | `turn` |
| 2,75 | Ba ô "1 2 3" hiện | ba pop | `slots` |
| 3,0 · 3,1 | Lao vào mặt kính · logo | riser + còi trượt; lấp lánh | `zoom`, `logo` |
| 5,45 · 6,0 | Vòm mắt sáng viền · tia lấp lánh trên đỉnh đầu | lấp lánh đi lên | `shine`, `sparkle` |
| 7,2 | Vòng nhìn loang ra | dâng lấp lánh | `ring` |
| 7,45–9,45 | Crumb đi một vòng | bước nhón chân, đổi bên theo vị trí | `tiptoe` |
| 8,05 · 8,65 · 9,25 | Con ngươi trượt theo | "bíp" cao dần | `peek` |
| 9,5 | Crumb bị bắt quả tang | cười khúc khích | `giggle` |
| 9,95 · 10,05 · 10,6 | Chụp → sticker bay → ô 1 | chụp, vuốt, dập ô + ding | `snap`, `swipe`, `slotstamp` |
| 10,8–12,1 | Crumb rón rén tới Zip | bước nhón chân nhỏ | `tiptoe` |
| 12,15–12,8 | Khựng | trống lăn thì thầm | `hush` |
| 12,75 · 12,87 · 13,1 | Crumb vồ · Zip bay lùi · Crumb úp mặt | boing + whoosh; zip đi xuống; "bẹp" | `jump`, `zip`, `flop` |
| 14,05 · 14,65 | Zip bay tới · bay lùi | zip lên · zip xuống | `zip` |
| 15,35–17,1 | Zip đứng yên giữa trời | cánh rì rì trầm, rất nhỏ | `hover` |
| 16,2 | Crumb nhảy với | boing | `hop` |
| 16,95 · 17,05 · 17,7 | Chụp → ô 2 | như ô 1 | `snap`, `swipe`, `slotstamp` |
| 17,85 | Kính đẩy vào vòm mắt | riser + whoosh dài | `dive` |
| 18,5 | Tổ ong hiện | chuỗi "lách tách" từng ô | `facets` |
| 19,25 | Chữ "1000s!" | bong bóng + ding | `pop` |
| 20,2 | Crumb ló vào | boing + whoosh | `popup` |
| 20,4 | Hình phản chiếu lan ra | chuỗi pop cao | `reflect` |
| 21,95 | Làn sóng vẫy tay | chuỗi pop đi lên | `wave` |
| 23,35–24,55 | Nghìn Crumb rón rén theo | bước nhón chân | `tiptoe` |
| 24,55 | Lè lưỡi | "pbbt" | `raspberry` |
| 25,15 | Kính lùi ra | whoosh đi xuống | `zoomback` |
| 26,9 | Zip và Crumb cười | cười khúc khích | `giggle` |
| 28,3–29,2 | Chụp → sticker → sổ | chụp, xuyên kính, lùi ra sổ, lật trang, dán, ding | `snap`, `zoomin`, `zoomout`, `page`, `stamp`, `ding` |
| 29,45 | Zip bay lùi vào | zip đi xuống | `zip` |
| 30,0–30,4 | Albie đếm chân | blip "1 2 3" | `count` |
| 31,05 · 31,5 · 31,65 | Zip lao vào trang · Albie "đớp" · sticker tí hon | nhảy, ực, chuỗi pop | `jump`, `gulp`, `pops` |
| 32,35 | Lật trang về bờ ao | giấy + whoosh | `flip` |
| 34,75 | Miss Loupe giơ kính lên cao | whoosh nhỏ | `swish` |
| 35,6 | Crumb xìu | "phù" (đi cùng trombone "wah-wah") | `deflate` |
| 36,3 | Crumb thấy Zip | ding nhỏ | `ding` |
| 36,5–38,0 | Crumb rón rén tới cỏ nến | bước nhón chân | `tiptoe` |
| 37,7 | Zip bay lùi ra khỏi khung phải | zip đi xuống, pan phải | `zip` |
| 38,2 | Crumb ngơ ngác | boing + hai blip | `huh` |
| 39,3 | Zip vào lại từ khung trái | zip, pan trái | `zip` |
| 40,02 · 40,08 · 40,5 | Đuôi Zip chạm Crumb · Crumb giật bắn · ngã ngồi | ting + mõ; boing + "ối"; "bịch" | `tap`, `boing`, `bump` |
| 40,6 | Cùng cười | cười khúc khích | `giggle` |
| 41,2 | Crumb chạy ra sau lưng Miss Loupe | chân chạy lách cách | `scurry` |
| 42,6 · 43,45 | Zip bay về · đáp lên vành kính | zip lên; "bộp" nhẹ | `zip`, `land` |
| 42,8–43,6 | Crumb lại rón rén (nối sang đầu phim) | bước nhón chân | `tiptoe` |
| 42,9 | Chữ móc trở lại | pop chữ + boing | `recall` |

**Nền:** nước ao vỗ rất nhỏ; ếch xa "ộp" chỉ ở chỗ không có lời, không có trong cảnh mắt kép và trong sổ.

**Không lạm dụng:** đo bằng `qa.py` (≤ 8 cue trong 1 s sau móc; lời hơn riêng tiếng động ≥ 11 dB ở mọi câu). Kết quả ở mục 11 của [TREATMENT.md](TREATMENT.md).
