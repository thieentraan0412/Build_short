# SHORT-007 · Bảng cue âm thanh

- Tiếng động lấy từ [`_shared/audio/toon.py`](../../_shared/audio/toon.py), `core/audio/sfx.py` và các hàm riêng trong `mix.py` (`beep`, `roll`, `hushroll`, `nom`, `steps`).
- Nhạc cụ lấy từ [`_shared/audio/band.py`](../../_shared/audio/band.py); tiếng dế của Chirp là `band.chirp`.
- Không dùng mẫu âm thanh của bên thứ ba.
- Nhạc theo cảnh: [MUSIC.md](MUSIC.md). Mốc thời gian lấy từ `HIT` trong `timeline.js`.
- **Tiếng của ánh sáng:** mỗi cú nháy của đom đóm là một nốt glockenspiel (`flash`, `code`, `reply`, `sync`), nháy dài là một nốt ngân (`beep`).

## Móc (0–3 s) và logo

| Thời điểm | Hình | Tiếng |
|---|---|---|
| 0,00 | Blink vụt qua sát mặt kính, đuôi nháy chùm; chữ GLOWING / TUMMY?! đủ ở khung 0 | Chữ bật + "zip" + hợp âm Si giáng |
| 0,00 · 0,12 | Hai dòng chữ móc nảy | Wordpop ×2 |
| 0,05 | Miss Loupe giật nảy, kính chao đi | "Boing" + còi nhỏ đi lên |
| 0,15 · 0,40 | Đuôi Blink nháy | Glockenspiel ×2 |
| 0,10 | | Lời: "Could your tummy glow?" |
| 1,15 | Blink đáp xuống mô rêu | Tiếng đáp nhẹ + "plip" |
| 1,45 | Blink quay ra phía máy | Swish nhỏ |
| 1,50 | | Lời (Blink): "My tummy can!" |
| 2,10 | Đuôi bùng sáng, cả cụm cỏ ửng vàng | Lấp lánh đi lên + ting + marimba chạy lên |
| 2,45 | Ánh trăng lóe trên vành kính (gài cho gag) | **Ting** |
| 2,75 | Ba ô "1 2 3" bật lên | Ba tiếng bong bóng đi lên |
| 3,00–3,80 | Máy lao vào mặt kính; logo bật lên trong kính; xuyên qua | Zoom + **nhạc hiệu 0,8 s** + lấp lánh |

## Bí mật 1: ánh sáng lạnh

| Thời điểm | Hình | Tiếng |
|---|---|---|
| 3,90 | | Lời: "Let's zoom in!" |
| 4,60–5,50 | Crumb lò dò vào, cầm que kẹo dẻo | Bước chân kiến |
| 5,35 | | Lời: "Fireflies make cold light!" |
| 6,50 · 6,90 · 7,30 | Kẹo dẻo trong ánh đèn, vòng đồng hồ nhỏ | **Tíc tắc** ×3 |
| 7,60 | Kẹo không chín; hai dấu "?" trên râu Crumb | "Hả?" (boing nhỏ + hai nốt) + mô-típ bí mật |
| 8,05 | Blink cười | Lời (Blink): "Look! No fire!" |
| 9,35 | Crumb nhún vai, ăn kẹo | "Nhồm" (bong bóng trầm) |
| 9,90 | Kính "chụp" | Snap + ting + marimba chạy lên |
| 10,00–10,60 | Sticker bay lên ô 1, ô sáng lên | Swipe → **stamp + ding** |

## Bí mật 2: "Nope!"

| Thời điểm | Hình | Tiếng |
|---|---|---|
| 10,85 | | Lời: "Is a firefly a fly?" |
| 11,15 | Bong bóng nghĩ con ruồi hiện trên đầu Crumb | Bong bóng |
| 12,35–12,95 | Khựng | Trống lăn rất nhỏ, hợp âm mỏng |
| 12,95 | Bong bóng vỡ, dấu ✕ | Lời: "Nope!" + pop |
| 13,30–13,75 | Dot nhảy vào | Boing + swish; tiếng đáp |
| 13,60 | | Tuba "bwomp" |
| 13,70 | | Lời (Blink): "I'm a little beetle!" |
| 14,75 · 15,50 · 16,00 · 16,60 | Hai bạn bật / khép tấm cánh; chữ CLACK! | **Clack** (gỗ) ×4, mỗi cú một cao độ |
| 15,00 | | Lời: "See? Beetle wing cases!" |
| 17,00–17,70 | Chụp → sticker lên ô 2 | Snap, swipe, stamp + ding |

## Bí mật 3 và cảnh đặc trưng

| Thời điểm | Hình | Tiếng |
|---|---|---|
| 18,00 | | Lời: "Blink, any more secrets?" |
| 19,85 | Blink khoanh tay, quay đi | Lời (Blink): "No!" + swish |
| 20,50 · 20,75 · 21,00 | Đuôi tự nháy, Blink tròn mắt | Glockenspiel ×3, cao dần |
| 21,30 | Blink đỏ mặt | Lấp lánh nhỏ |
| 21,45 | | Lời (Blink): "Okay, yes." + câu đáp "hì" |
| 22,60 | | Lời: "Some fireflies flash a secret code!" |
| 23,00 · 23,30 · 23,90 | Blink nháy: ngắn, ngắn, dài; dải chấm gạch | Ting + nốt ngân ngắn, ngắn, dài |
| 25,05 · 25,50 | Đốm sáng thấp ở bãi cỏ xa nháy đáp | Glockenspiel thấp, nhỏ |
| 25,20–26,00 | Kính lùi ra thành toàn cảnh | Swish đi xuống + riser |
| 26,00–30,25 | Chirp kéo đàn | **Tiếng dế mỗi phách** |
| 27,00 | | Lời (Blink): "Light up, everyone!" |
| 27,00–29,80 | Bóng Rollo lăn ngang mặt trăng | "Rù rù" rất nhỏ |
| 28,0 · 28,5 · 29,0 · 29,5 · 30,0 | Cả vườn nháy cùng phách | Hợp âm glockenspiel + lấp lánh |
| 30,35 | Chụp đám đom đóm | Snap + marimba chạy lên |

## Sổ

| Thời điểm | Hình | Tiếng |
|---|---|---|
| 30,45–31,10 | Máy lao xuyên mặt kính → sticker → trang sổ | Zoom in, zoom out; đàn hạc vuốt lên rồi xuống |
| 31,10 | Trang sổ | Giấy |
| 31,10–31,50 | Ô 1, 2 bay xuống trang | Swipe → stamp + ding |
| 31,25 | Sticker 3 dán | Stamp + ding |
| 31,55 | | Lời (Albie): "Six legs? In you go!" |
| 31,55 | Blink bay vào | "Zip" |
| 32,0 · 32,2 · 32,4 | Trang giấy của Albie đếm chân Blink | Tíc ×3, cao dần |
| 33,05 | Blink lao lên | Boing + swish |
| 33,50 | Blink lao vào trang; Albie "đớp", nảy lên | **Giấy + boing + "ực"**; xylophone trượt xuống |
| 33,65 | Sticker Blink tí hon bật lên | Chuỗi bong bóng |
| 34,40–34,90 | Lật trang về vườn đêm | Giấy lật + swish |

## Gag và vòng lặp

| Thời điểm | Hình | Tiếng |
|---|---|---|
| 35,45 · 36,35 | Ánh trăng lóe trên vành kính | **Ting** |
| 35,85 · 36,75–37,00 | Đốm sáng nhỏ dưới cỏ nháy đáp ×1, ×2 | Glockenspiel nhỏ |
| 37,20 | | Lời: "Is it winking at me?" |
| 38,75 | Miss Loupe nháy mắt | Tink + lấp lánh; celesta ba nốt |
| 38,85 · 39,15 · 39,45 | Kính lóe ba lần | Ting ×3 |
| 39,75 · 40,00 · 40,25 | Đốm sáng nháy đáp ba lần | Glockenspiel ×3 |
| 40,30 | Đốm sáng bay vút lên | "Zip" |
| 40,50 | | Lời: "Can YOU blink a secret code?" |
| 42,30 | Chữ móc trở lại | Recall (chữ bật + wordpop ×2) + hợp âm Si giáng |
| 42,40 | Đốm sáng bay về phía máy | Glockenspiel cao |
| 43,10–44,00 | Đốm sáng phình thành vòng tròn, mở về khung đầu | Swirl + cymbal ngược + lấp lánh |

## Nền

Vườn đêm:
- gió nhẹ ở dải trầm;
- dế rất xa (`band.chirp`, nhỏ), một tiếng mỗi 0,9–1,6 s, chỉ ở chỗ không có lời và ngoài cảnh Chirp kéo đàn.
