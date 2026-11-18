# SHORT-016 · Bảng cue âm thanh (hình ↔ tiếng)

Mọi tiếng động đặt theo sự kiện trong `timeline.js` (`EV`) → `events.json` → `mix.py` (bảng `SFX`). Tiếng nằm dưới lời thì ở dải cao và nhỏ, hoặc ở dải trầm; tiếng động nhường giọng bằng `toon.duck`. Mỗi chuyển cảnh một tiếng riêng. Chuỗi nhịp có chủ đích ghi `run` (không tính là lặp máy móc).

**Tiếng riêng của nhân vật không lời và đạo cụ** (dựng trong `mix.py`, không dùng mẫu):
- **Waggle:** mỗi nhịp rung ngực một tiếng "brr" vo ve ngắn (`buzzshake`: bass vo ve theo bậc của hợp âm + tiếng "tink" nhỏ), chuỗi `shake` theo phách; tiếng rì rầm của cả quả bóng (`hum`, dải trầm, nhỏ).
- **Đàn bướm vua:** "phập phập" mềm (`flutter`: nhiễu lọc dải 700–3 000 Hz), chuỗi `flight` theo phách 126 BPM.
- **Miss Loupe:** rùng mình "brrr" (`brrr`: mõ lập cập + rung thấp); vặn vành kính (`twist`: bốn tiếng click); kính ấm bật (`warmup`: "vù" ấm đi lên + lách tách).
- **Dot:** bật dậy (boing + bong bóng), ngáp (`yawnfx`: còi trượt lên rồi xuống), lặn xuống (giấy + còi xuống), chiếc lá trùm lên (`fwump`: "phụp" + tuyết bung "xì").
- **Gió tuyết:** nền gió dải trầm cả phim, tiếng tuyết "tink" lác đác ở chỗ không có lời; cuối phim gió thổi và bông tuyết lớn rơi (`snowfx`).

| Giây | Hình | Tiếng | Hàm |
|---|---|---|---|
| 0,0 | chữ móc nảy (2 dòng) | pop + ting, boing | `titlepop`, `wordpop` |
| 0,02 | bông tuyết đậu trúng kính | "ting" giọt | `plip` |
| 0,05–0,7 | Miss Loupe rùng mình | lập cập "brrr" | `brrr` |
| 0,3–1,0 | Albie run | giấy sột soạt | `chatter` |
| 0,95 / 1,4 | ngó trái / phải | swish lên / xuống | `swish` |
| 2,0 | hai dấu hỏi | "huh?" | `huh` |
| 2,75 | ba ô "1 2 3" | ba pop | `slots` |
| 3,0 | logo lao vào kính | riser + còi + lấp lánh | `zoom`, `logo` |
| 5,0 | vặn vành kính | click ×4 | `twist` |
| 5,25 | kính ấm bật | "vù" ấm | `warmup` |
| 6,0–8,6 | quả bóng ong | rì rầm | `hum` |
| 9,0 | lao sâu | swish + riser | `deep` |
| 9,66–11,8 | Waggle rung ngực ×9 | "brr" mỗi nửa phách (chuỗi) | `buzzshake` |
| 11,98 / 19,95 / 33,7 | chụp | click + lấp lánh | `snap` |
| 12,05 / 20,05 | sticker bay lên ô | swipe | `swipe` |
| 12,55 / 20,6 / 34,85 | sticker dán vào ô | thump + ding | `slotstamp` |
| 12,4 | kính thu về sân khấu | swish xuống | `lensdown` |
| 12,8 | Albie nhảy | boing + giấy | `albiehop` |
| 14,8 / 40,15 | "Nope!" dấu X | bonk | `nope` |
| 15,45 | Albie mở trang | giấy + swish | `pageopen` |
| 16,2–19,1 | đàn bướm bay ×7 | phập phập (chuỗi) | `flutter` |
| 16,55 | nhãn "up to 3,000 miles!" | mõ + boing | `sign` |
| 18,25 | tới Mexico | lấp lánh + ding | `arrive` |
| 18,35 | rừng hoá cam | swell + pop (+ "ta-da" trong nhạc) | `trees` |
| 21,0 / 42,2 | điệp khúc | lấp lánh | `chorus` |
| 23,0 | ô 3 "?" | pop | `qpop` |
| 24,05 / 24,55 | Miss Loupe nhảy sang / đáp | boing / thump tuyết | `hopL`, `landsnow` |
| 26,85 | kính lên | swish | `lensup` |
| 27,0 | nhấc lá | giấy + tuyết xì | `leaflift` |
| 27,45 / 38,35 | Dot bật dậy / chui ra | boing + bong bóng | `popup` |
| 27,65–28,62 | Dot đếm 1 2 3 | blip + mõ + xylophone (chuỗi) | `count` |
| 32,7 | Dot ngáp | còi trượt | `yawn` |
| 33,2 / 40,7 | Dot chui lại | giấy + còi xuống | `burrow` |
| 33,8 / 34,1 / 34,45 | match cut → trang sổ | swish, giấy, bong bóng | `zoomin`, `zoomout`, `page` |
| 34,6 | sticker 3 | dán + ding | `stamp`, `ding` |
| 35,25–35,75 | Albie đếm chân | blip (chuỗi) | `count` |
| 36,95 | Albie đớp | giấy + boing + bong bóng | `gulp` |
| 37,75 | lật trang | giấy + swish | `flip` |
| 38,7 | Dot vươn vai | còi lên + boing | `stretch` |
| 40,55 / 40,9 | Dot lặn, lá trùm lên | còi trượt xuống / "fwump" | `whee`, `plop` |
| 41,25 | Albie cười | khúc khích | `giggle` |
| 45,4 | hai bạn ôm nhau | wobble + lấp lánh | `hug` |
| 46,75 | chữ móc trở lại | pop + boing | `recall` |
| 46,6–48 | bông tuyết lớn rơi | gió + tink | `snowfall` |

**Lượt âm thanh 4 lớp (18/11/2026):**

| Giây | Hình | Tiếng | Hàm |
|---|---|---|---|
| 3,24 / 3,6 | chữ "of tiny bugs" của logo; máy xuyên qua mặt kính | pop + tink; swish đi xuống | `logopop`, `stingout` |
| 5,3 · 9,4 · 16,0 · 17,75 · 18,4 · 29,1 | chữ WARM VIEW!, HEATER BEES!, nhãn EASTERN NORTH AMERICA, MEXICO, chữ MILLIONS!, SO MANY! | "pốp" + nốt chuông đi lên | `textpop` (`toon.textpop`) |
| 9,45–12,0 | máy lao vào quả bóng ong | vo ve nhỏ ở dải cao | `beebuzz` (`toon.flybuzz`) |
| 16,1 · 20,0 | đàn bướm bay xuống; bản đồ gập về trang | gió vút | `gust` (`toon.gust`) |
| 21,0 · 21,5 | ô 1, 2 nảy theo "Huddle", "fly" | bong bóng + blip | `slotbounce` |
| 21,1–24,0 · 42,2–45,2 | hai bạn nhún nhảy ở điệp khúc | bước giẫm tuyết "rộp" (chuỗi `dance1`, `dance2`) | `snowstep` (`toon.snowstep`) |
| 42,2 · 42,7 · 43,7 | ba sticker bật lên | pop + chuông | `badgepop` |
| 45,3 / 45,65 · 46,3 / 47,35 | Albie nhảy tới ôm và đáp; hai bạn nhảy về chỗ cũ và đáp | boing + giấy; thịch trên tuyết | `albiehop`, `hopL`, `landsnow` |

Nền (Lớp 4, `ambience.beds`) theo cảnh: vườn tuyết · trong tổ ong · trang sổ / bản đồ · sát đống lá; bảng đầy đủ ở `SOUND-PLAN.md`.
