# SHORT-005 · Sound Design Plan

> Sinh tự động bằng `python _shared/tools/soundplan.py films/short-005` từ `out/music.json` (bảng cảnh nhạc khai báo trong `mix.py` bằng `G.sec` / `G.mark`) và `events.json`.
> Đừng sửa tay: sửa `what=`, `emo=`, `why=`, `mood=`, `arc=`, `bpm=`, `sfx=` trong `mix.py`, dựng lại rồi chạy lại công cụ. Quy tắc: [`QUALITY.md` §4](../../_shared/QUALITY.md#4-âm-thanh-và-nhạc-nền).

**Màu nhạc của tập:** "Tap-Tap Waltz" (La trưởng). Chi tiết nhạc cụ, giọng và điểm nhấn viết tay: [`MUSIC.md`](MUSIC.md); bảng cue hình ↔ tiếng: [`SOUND.md`](SOUND.md).

## Cung bậc

- **Mở đầu** 0,0–5,5 s: Cute & Sweet, Bouncy Rhythm; 120–132 BPM; celesta, xylophone
- **Diễn biến** 5,5–8,3 s: Magical Adventure; 108 BPM; sáo
- **Cao trào** 8,3–10,8 s: Cute & Sweet; 126 BPM; vibraphone
- **Kết** 10,8–24,0 s: Suspense & Surprise, Happy Kids, Funny Comedy, Cute & Sweet; 96–132 BPM; bassoon, piano đồ chơi, xylophone, glockenspiel, celesta

## Bảng thiết kế âm thanh

| Thời gian | Nội dung cảnh | Cảm xúc | Phong cách nhạc | Nhạc cụ | BPM | SFX |
|---|---|---|---|---|---|---|
| 0,0–3,0 s<br>*Mở đầu* | Hai chú kiến chạm râu "tách, tách": "What if you said hello with a sniff?" – Crumb: "That's how I say hi!" | tò mò, dễ thương · nhịp vừa | Cute & Sweet<br>valse 3/4, A | **celesta** (giai điệu) · đàn hạc · pizzicato trầm · đồ chơi (vỗ tay, shaker, phách gỗ) | 120 | boing + pop từng chữ ×2, gõ nhẹ ×2, hít ngửi ×2, pop chữ móc, va chạm hoạt hình, +1 tiếng khác |
| 3,0–5,5 s<br>*Mở đầu* | Miss Loupe nhảy vào: "Let's zoom in!" | háo hức · nhịp nhanh | Bouncy Rhythm<br>nảy lệch phách, D | **xylophone** (giai điệu) · piano · bass gảy · bongo + shaker | 132 | whoosh mỏng, blip "…" |
| 5,5–8,3 s<br>*Diễn biến* | Trong kính: mây mùi bay ra từ râu: "Their antennae are like noses!" | kỳ diệu, mơ màng · nhịp chậm | Magical Adventure<br>valse lơ lửng, A | **sáo** (giai điệu) · celesta · pizzicato trầm | 108 | gõ nhẹ ×2, whoosh lao vào kính, mây mùi bay vào, làn mùi |
| 8,3–10,8 s<br>*Cao trào* | Hai mây mùi hoà vào nhau, tim bay: "Same smell? Same home!" | ấm áp, vui sướng · nhịp cao trào | Cute & Sweet<br>valse 3/4, A | **vibraphone** (giai điệu) · accordion · pizzicato trầm · chổi trống | 126 | ding-dong, chuỗi pop |
| 10,8–13,4 s<br>*Kết* | Một chú kiến lạ bước tới: "Hey, who's that?" | ngờ vực, hồi hộp · nhịp chậm | Suspense & Surprise<br>rình rập hài, F#m | **bassoon** (giai điệu) · dây pizzicato · tuba · gỗ (mõ, shaker) | 96 | gõ nhẹ ×2, cọ râu, tim bay, bước chân, quay người, +2 tiếng khác |
| 13,4–15,6 s<br>*Kết* | Hai mây mùi đụng nhau: "Nope!" – chú kiến lạ nhún vai bỏ đi | bất ngờ, buồn cười · nhịp khựng | Khựng (Suspense & Surprise) | lớp mỏng (khoảng lặng có chủ đích) | — | bonk (va nhẹ), nhún vai, bước chân, whoosh, gõ nhẹ, +5 tiếng khác |
| 15,6–18,6 s<br>*Kết* | Sticker dán vào sổ; Albie: "Six legs? In you go!" | vui, tự hào · nhịp vừa | Happy Kids<br>ukulele nắng, A | **piano đồ chơi** (giai điệu) · ukulele · pizzicato trầm · vỗ tay + lục lạc | 116 | dán sticker, ding |
| 18,6–20,5 s<br>*Kết* | Lật trang, Crumb lon ton tới cái kính: "Hello, lens!" | tinh nghịch · nhịp nhanh | Funny Comedy<br>polka, A | **xylophone** (giai điệu) · dây pizzicato · pizzicato trầm · mõ hai cao độ | 132 | lật trang, bước chân |
| 20,5–22,9 s<br>*Kết* | Crumb ngửi cái kính "squeak", râu xoăn tít: "You don't smell like home!" | ngơ ngác, buồn cười · nhịp chậm | Suspense & Surprise<br>lắng nghe, Bm | glockenspiel | 100 (cảm giác 50) | chít chít ×2, boing, hít ngửi |
| 22,9–24,0 s<br>*Kết* | Cười: "How do YOU say hi?" – về khung đầu | vui, mời gọi · nhịp nhanh | Cute & Sweet<br>valse 3/4, A | **celesta** (giai điệu) · đàn hạc · pizzicato trầm · triangle + shaker | 120 | chữ móc trở lại, whoosh, quay người, chuyển cảnh mây mùi |

## Vì sao chọn nhạc này

1. **0,0–3,0 s · Hai chú kiến chạm râu "tách, tách": "What if you said hello with a sniff?" – Crumb: "That's how I say hi!"** (Cute & Sweet, 120 BPM): Valse 3/4 là màu của tập: hai cú chạm râu rơi đúng hai phách "pa-pa"; celesta "ta-da" nhỏ giữa hai câu.
2. **3,0–5,5 s · Miss Loupe nhảy vào: "Let's zoom in!"** (Bouncy Rhythm, 132 BPM): Rời valse một lúc: nảy lệch phách 4/4, 132 BPM, piano chặn hợp âm và bongo cho cú nhảy vào; đàn hạc vuốt lên (viết tay) khi kính vào. *Vào cảnh:* trống dồn.
3. **5,5–8,3 s · Trong kính: mây mùi bay ra từ râu: "Their antennae are like noses!"** (Magical Adventure, 108 BPM): Valse lơ lửng 108 BPM, hộp nhạc rải như mây mùi, sáo đáp trong khoảng nghỉ lời. *Vào cảnh:* dâng lấp lánh.
4. **8,3–10,8 s · Hai mây mùi hoà vào nhau, tim bay: "Same smell? Same home!"** (Cute & Sweet, 126 BPM): Cao trào ấm của tập: valse trở lại, phong cầm 126 BPM, vibraphone đáp, mô-típ bí mật La–Đô♯–Mi trên hộp nhạc (viết tay) đúng lúc hai mùi hoà. *Vào cảnh:* ngân đuôi, cảnh sau vào mềm.
5. **10,8–13,4 s · Một chú kiến lạ bước tới: "Hey, who's that?"** (Suspense & Surprise, 96 BPM): Sang Pha♯ thứ, rình rập 96 BPM: tuba staccato, bassoon dò hỏi, pizzicato rón rén (viết tay). *Vào cảnh:* dâng lấp lánh.
6. **13,4–15,6 s · Hai mây mùi đụng nhau: "Nope!" – chú kiến lạ nhún vai bỏ đi** (Khựng (Suspense & Surprise), — BPM): Khựng nhạc khi khác mùi; tuba "bwomp", kèn dăm "wah-wah", pizzicato "thôi vậy" (viết tay). *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
7. **15,6–18,6 s · Sticker dán vào sổ; Albie: "Six legs? In you go!"** (Happy Kids, 116 BPM): Ukulele quạt 4/4, 116 BPM, vỗ tay, piano đồ chơi đáp; không bass dưới giọng trầm của Albie. *Vào cảnh:* nốt mồi của nhạc cụ mới.
8. **18,6–20,5 s · Lật trang, Crumb lon ton tới cái kính: "Hello, lens!"** (Funny Comedy, 132 BPM): Đổi hẳn sang 4/4: polka lon ton 132 BPM, mõ hai cao độ, xylophone theo bước Crumb. *Vào cảnh:* trống dồn.
9. **20,5–22,9 s · Crumb ngửi cái kính "squeak", râu xoăn tít: "You don't smell like home!"** (Suspense & Surprise, 100 (cảm giác 50) BPM): Lắng gần hết để tiếng "squeak" của kính và câu thoại rõ; chỉ còn glockenspiel thưa; pizzicato "hả?" (viết tay). *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
10. **22,9–24,0 s · Cười: "How do YOU say hi?" – về khung đầu** (Cute & Sweet, 120 BPM): Valse của móc trở lại ở 120 BPM để vòng lặp liền; triangle thay phách gỗ và không có đệm để câu hỏi kết rõ. *Vào cảnh:* ngân đuôi, cảnh sau vào mềm.

## Chuyển cảnh âm thanh

| Giây | Từ → sang | Cách chuyển | BPM |
|---|---|---|---|
| 3,0 | chạm râu · valse → Miss Loupe vào · nảy | trống dồn | 120 → 132 |
| 5,5 | Miss Loupe vào · nảy → kính ngửi · mơ màng | dâng lấp lánh | 132 → 108 |
| 8,3 | kính ngửi · mơ màng → cùng mùi · phong cầm | ngân đuôi, cảnh sau vào mềm | 108 → 126 |
| 10,8 | cùng mùi · phong cầm → chú kiến lạ · rình rập | dâng lấp lánh | 126 → 96 |
| 13,4 | chú kiến lạ · rình rập → khác mùi · khựng | viết tay (stinger, khựng, nhạc hiệu) | 96 → 120 |
| 15,6 | khác mùi · khựng → sổ · ukulele nắng | nốt mồi của nhạc cụ mới | 120 → 116 |
| 18,6 | sổ · ukulele nắng → lật trang · polka lon ton | trống dồn | 116 → 132 |
| 20,5 | lật trang · polka lon ton → squeak · lắng | viết tay (stinger, khựng, nhạc hiệu) | 132 → 100 |
| 22,9 | squeak · lắng → cười · về khung đầu | ngân đuôi, cảnh sau vào mềm | 100 → 120 |

## Chống trùng lặp

- 10 cảnh nhạc (9 cảnh có điệu, còn lại là khựng / nhạc hiệu viết tay).
- 6 phong cách nhạc: Cute & Sweet ×3, Suspense & Surprise ×2, Bouncy Rhythm ×1, Magical Adventure ×1, Happy Kids ×1, Funny Comedy ×1.
- 7 nhạc cụ hát chính: celesta ×2, xylophone ×2, sáo ×1, vibraphone ×1, bassoon ×1, piano đồ chơi ×1, glockenspiel ×1.
- 11 họ nhạc cụ: bass, bộ gõ, chuông, dây pizzicato, kèn gỗ, kèn đồng, nhạc cụ hoạt hình, piano, ukulele, xylophone, đàn hạc.
- BPM: 96, 100, 108, 116, 120, 126, 132 (7 mức).
- Chuyển cảnh: trống dồn ×2, dâng lấp lánh ×2, ngân đuôi, cảnh sau vào mềm ×2, viết tay (stinger, khựng, nhạc hiệu) ×2, nốt mồi của nhạc cụ mới ×1.
- Câu đáp của nhạc giữa các câu thoại: 8.

Các ngưỡng và kết quả kiểm: `python _shared/qa.py films/short-005` (nhóm "4 Âm thanh").
