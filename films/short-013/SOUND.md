# SHORT-013 · Bảng cue âm thanh (hình ↔ tiếng)

> **Cập nhật 19/11/2026 (dựng lại theo chuẩn 11/2026b, như SHORT-016):** phần dưới đây mô tả bản 14/11/2026. Mốc thời gian của các cue đã dời theo timeline mới; thêm các tiếng của điệp khúc 2 và các chuỗi có chủ đích (`run`). Bảng hiện hành: [`SOUND-PLAN.md`](SOUND-PLAN.md) (sinh từ `out/music.json`, `events.json`, `out/scenes.json`), [`TREATMENT.md`](TREATMENT.md) mục 7, 8, A và H.

Mọi tiếng động đặt theo sự kiện trong `timeline.js` (`EV`) → `events.json` → `mix.py` (bảng `SFX`). Tiếng nằm dưới lời thì ở dải cao và nhỏ, hoặc ở dải trầm; tiếng động nhường giọng bằng `toon.duck`. Mỗi chuyển cảnh một tiếng riêng.

**Tiếng riêng của hai nhân vật không lời** (dựng trong `mix.py`, không dùng mẫu):
- **Hop:** nảy "boing" (`toon.boing`, cao độ đi lên) và **"kéo vĩ"** `rasp(m)`: răng cưa có cao độ, bị "băm" khoảng 38 lần mỗi giây như hàng gai trên đùi cọ qua mép cánh. Có cao độ nên viết được thành giai điệu (bí mật 2, song tấu). Tiếng cọ của mỗi nhát (`scrape`) là tiếng động; cao độ nằm ở phần nhạc.
- **Chirp:** gáy `band.chirp` (ba xung 4,6 kHz, như mọi tập) khi là tiếng động; `chirpn(m)` (ba xung có cao độ, "chuông dế") khi gáy thành nhạc trong song tấu.
- **Crumb:** còi lá cỏ `grasswhistle()`: tiếng lưỡi gà the thé vút lên rồi rung (khung 0).
- **Kính của Miss Loupe:** `glassring()`: hai bội âm thuỷ tinh rung "ong ong" khi có tiếng to (móc, gag) — đạo cụ của gag được gài từ móc.

| Giây | Hình | Tiếng | Hàm |
|---|---|---|---|
| 0,0 | Chữ HIDDEN / EARS?! nảy từng dòng | pop chữ móc + boing từng dòng | `titlepop`, `wordpop` |
| 0,0–0,34 | Crumb thổi còi lá cỏ | "PWEEET!" | `whistle` |
| 0,4 | Cả ba giật mình | boing + "ồ"; Chirp gáy; Hop nảy "boing"; kính rung "ong ong" | `startle`, `chirp`, `boing`, `glassring` |
| 0,82 | Hop đáp xuống | "bịch" nhỏ + plip | `land` |
| 1,0 · 1,15 | Chirp giơ chân về phía tiếng · Hop xoay sườn | whoosh nhỏ | `swish`, `turn` |
| 1,75 | Crumb cười | cười khúc khích | `giggle` |
| 2,05 | Hai bạn nhìn nhau "?" | boing + hai "bíp" hỏi | `huh` |
| 2,75 | Ba ô "1 2 3" hiện | ba pop | `slots` |
| 3,0 · 3,1 | Lao vào mặt kính · logo | riser + còi trượt; lấp lánh | `zoom`, `logo` |
| 5,05 · 5,3 | Tai Chirp ở ống chân trước sáng lên · Chirp gáy khẽ | lấp lánh đi lên · gáy | `shine`, `chirp` |
| 6,55 | Kính trượt sang chân trước của Hop | vuốt | `swipe` |
| 6,6–7,2 | Khựng | trống lăn thì thầm | `hush` |
| 7,25 | "Nope!" dấu X | "bộp" trầm + pop | `nope` |
| 7,4 · 7,6 · 7,8 | Hop lắc chân trước "không phải đây" | ba tiếng gõ nhỏ | `tap` |
| 8,1 | Kính quét dọc sườn | whoosh đi xuống | `swish` |
| 8,4 | Cánh nhấc lên như tấm rèm | "sột" giấy mỏng + tinh | `curtain` |
| 8,95 | Lộ màng nghe | lấp lánh + ding | `reveal` |
| 8,3–10,2 | Crumb chạy dọc chân gốc cây | bước chân tí hon | `step` |
| 9,62 · 9,95 | Chirp gáy, vòng âm chạm màng nghe | gáy · màng rung "bum" + tinh | `chirp`, `eardrum` |
| 10,95 | Crumb xoa bụng mình | hai tiếng "bộp" nhỏ | `pat` |
| 12,1–13,75 | Hai châu chấu xa hát | chuỗi "rè rè" nhỏ, xa, bên phải | `farsong` |
| 12,7 · 13,3 · 13,8 | Vòng âm xa chạm màng nghe | màng rung (nhỏ) | `eardrum` |
| 13,85 · 13,95 · 14,5 | Chụp → sticker bay → ô 1 | chụp, vuốt, dập ô + ding | `snap`, `swipe`, `slotstamp` |
| 15,0 | Hop giơ đùi sau | whoosh nhỏ đi lên | `swish` |
| 15,5–19,45 | Mỗi nhát kéo chân | tiếng cọ "sột" (cao độ ở phần nhạc) | `scrape` (`rasp`) |
| 16,95 | Mép cánh chỗ cọ loé sáng | lấp lánh | `shine` |
| 19,65 · 19,75 · 20,3 | Chụp → ô 2 | như ô 1 | `snap`, `swipe`, `slotstamp` |
| 21,2–22,35 | Hop co chân, lò xo nén | "kééét" lò xo, đi xuống | `creak` |
| 22,4 | BOING! Hop bật ra khỏi kính | boing to + whoosh | `boing`, `swish` |
| 22,75 | Máy ngước theo lên trời rồi cúi xuống bãi cỏ | whoosh dài đi xuống | `zoomback` |
| 24,1 | Hop đáp xuống gốc cây | "bịch" + plip | `land` |
| 25,55 · 26,75 · 27,6 | Nốt xếp thành tim · sao · mặt cười | chuỗi pop + lấp lánh | `shape` |
| 28,05 | Hop nảy cuối song tấu | boing | `boing` |
| 27,9 | Miss Loupe giơ kính | whoosh nhỏ | `swish` |
| 28,55 | Chụp | chụp | `snap` |
| 28,65–29,45 | Lao qua mặt kính → sticker 3 → trang sổ | whoosh lên; whoosh xuống + giấy; trang; dập + ding | `zoomin`, `zoomout`, `page`, `stamp`, `ding` |
| 29,3 · 29,7 | Ô 1, 2 bay xuống trang | vuốt; dập ô | `swipe`, `slotstamp` |
| 29,55 · 29,85 | Hop nhảy tưng tưng vào trang | hai boing | `boing` |
| 30,25–30,65 | Albie đếm chân | ba "bíp" + gõ | `count` |
| 31,3 · 31,75 · 31,9 | Hop nhảy vào trang · Albie "đớp" · sticker tí hon | boing; giấy + boing + bong bóng; ba pop | `boing`, `gulp`, `pops` |
| 32,6 | Lật trang | giấy + whoosh | `flip` |
| 33,2 | Hop nhảy cẫng | hai boing nhỏ | `hopjoy` |
| 34,6–36,1 | Chơi lại, to dần | cọ + gáy mỗi nửa giây; kính rung | `scrape`, `chirp`, `glassring` |
| 36,3 · 36,65 · 37,05 | Chirp bịt chân · Hop bịt bụng · Miss Loupe bịt kính | ba tiếng "bộp", mỗi người một cao độ; "cốp" khi tay chạm kính | `cover`, `bonk` |
| 36,8–41,4 | (trứng phục sinh) Mr. Rollo lăn viên tròn trên bãi xa | "rù rù" trầm rất nhỏ | `roll` |
| 38,75 | Crumb cười | cười khúc khích | `giggle` |
| 40,55 · 40,75 · 40,95 | Cả ba bỏ tay ra | ba pop bong bóng | `unpop` |
| 41,2 · 42,5 | Crumb chạy lại · nhặt lá cỏ | chạy lon ton · "bứt" lá | `scurry`, `pluck` |
| 42,6 | Chữ móc trở lại | pop + boing từng dòng | `recall` |

**Nền:** gió nhẹ trên bãi cỏ (tiếng nâu, lọc trầm, rất nhỏ) suốt phim; chim xa hót hai tiếng ngắn ở chỗ không có lời, không có trong sổ.

**Tiếng động không lạm dụng:** sau móc, dày nhất khoảng 5–6 cue trong 1 s (ngưỡng 8). Song tấu không thêm cue cho từng nốt: nốt của Hop và Chirp là phần nhạc viết tay (`G.mark`), để không có hai lớp tiếng cho cùng một nốt.
