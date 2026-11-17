# SHORT-015 · Bảng cue âm thanh (hình ↔ tiếng)

Mọi tiếng động đặt theo sự kiện trong `timeline.js` (`EV`) → `events.json` → `mix.py` (bảng `SFX`). Lượt kéo chân và tiếng tách được tính từ cùng danh sách mốc với hình (`HIT.strokes0/1/2`, `HIT.ticksUp/Down`, `HIT.zzzip`), nên mỗi lượt đùi đưa là một tiếng "zzip", mỗi gai vấp qua mép cánh là một tiếng "tách". Tiếng nằm dưới lời thì nhỏ và ở dải cao (lượt kéo dưới lời: lọc từ 3 kHz, 0,3 lần). Tiếng động nhường giọng bằng `toon.duck`. Mỗi chuyển cảnh một tiếng riêng.

| Giây | Hình | Tiếng | Hàm |
|---|---|---|---|
| (21,4)–0,28 | Hop kéo đùi sau (lượt cuối phim nối sang khung đầu) | "zzip": chuỗi tiếng cạo ngắn, mỗi gai một tiếng (~65 tiếng/s), to rồi nhỏ theo lượt kéo | `scrape` |
| 0,0 | Chữ SINGING / LEGS?! nảy từng dòng | pop chữ móc + boing từng dòng | `titlepop`, `wordpop` |
| 0,11 · 2,25 · 2,53 | Nốt nhạc bật ra từ chân Hop | pop + giọt nước | `notepop` |
| 0,08 · 0,5 | Miss Loupe giật mình nảy lên, đáp | "ồ!" (còi vút + boing + ting); bộp nhẹ | `startle`, `landsoft` |
| 0,28–1,88 | Hop kéo nhẹ trong lúc Miss Loupe hỏi | "zzip" nhỏ, dải cao | `scrape` (v 0,45) |
| 1,25 | Miss Loupe nhấc giày ngọ nguậy | bước chân tí hon rón rén | `wiggle` |
| 2,2–2,62 | Hop kéo một tràng | "zzip-zzip-zzip" to | `scrape` |
| 2,25 | Miss Loupe tò mò "?" | hai blip đi lên | `hmm` |
| 2,9 · 3,35 | Nhảy sang Hop, đáp | boing + whoosh; bộp nhẹ | `hopL`, `landsoft` |
| 3,6 | Kính bật về phía máy | riser + còi trượt | `zoom` |
| 3,9–7,1 | Đùi kéo lên xuống dọc mép cánh trong kính | "zzip" từng lượt (dưới lời nhỏ) | `scrape` |
| 6,6 | Kính lao sâu vào mặt trong của đùi | whoosh dài + riser + "bloop" | `deep` |
| 7,55–8,95 | Hàng gai sáng lần lượt | lấp lánh đi lên | `glintrun` |
| 9,38 | Đùi hạ xuống chạm mép cánh | mõ trầm + bộp | `touch` |
| 9,55–10,55 | Năm gai vấp qua mép cánh, mép cánh rung | "tách" giòn + mõ nhỏ, cao dần | `tick` |
| 10,95–12,35 | Kéo ngược lại (dưới lời) | "tách" nhỏ hơn, đi xuống | `tick` (v 0,55) |
| 12,62–13,4 | Kéo nhanh: tiếng tách liền thành "zzzzip" | chuỗi cạo nhanh dần ×4 + whoosh | `zzzip` |
| 13,0 | Nốt nhạc tuôn ra khỏi kính | lấp lánh dày | `notestream` |
| 13,35 | Kính lùi về cả chân | whoosh đi xuống + bloop | `deepout` |
| 13,78 | Vĩ cầm hiện cạnh kính | lấp lánh + tink | `violin` |
| 13,55–15,8 | Đùi kéo cùng nhịp với cây vĩ (dưới lời) | "zzip" nhỏ | `scrape` |
| 15,5 | Kính hạ xuống, về sân khấu | whoosh đi xuống + bộp | `lensdown` |
| 16,15 | Miss Loupe bước ra giữa | hai bước chân | `step` |
| 16,6 | Nhấc chân | whoosh nhỏ + boing | `legup` |
| 17,3–17,85 | Kéo chân dọc sườn | "phụt phụt" mềm (không có tiếng tách: không có gai) | `rubtry` |
| 17,9 | "squeak." | tiếng cao su kêu bé tí, rung | `squeak` |
| 18,15 | Hop chớp mắt | "bink" | `blinkhop` |
| 18,3 | Hop bật cười | "hi-hi-hi-hi" (không giọng người) | `giggle` |
| 19,55 | Miss Loupe nhún vai | hai blip đi xuống | `shrug` |
| 20,85 | Hop giơ chân sau sẵn sàng | whoosh nhỏ + boing | `ready` |
| 20,95 | Chữ móc trở lại | pop chữ + boing | `recall` |

**Nền:** gió chạng vạng rất nhỏ (tiếng nâu lọc thấp) và lá xào xạc khẽ, chỉ ở chỗ không có lời và không có trong cận cảnh.

**Tiếng riêng của Hop (nhân vật không lời):** "zzip" kéo chân và tiếng cười "hi-hi" (QUALITY §7).

**Không lạm dụng:** dày nhất ≤ 8 cue trong 1 s sau móc; lời hơn riêng tiếng động ≥ 11 dB ở mọi câu (`qa.py`, số đo ở báo cáo giao trong TREATMENT.md).
