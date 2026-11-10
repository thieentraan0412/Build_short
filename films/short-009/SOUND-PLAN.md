# SHORT-009 · Sound Design Plan

> Sinh tự động bằng `python _shared/tools/soundplan.py films/short-009` từ `out/music.json` (bảng cảnh nhạc khai báo trong `mix.py` bằng `G.sec` / `G.mark`) và `events.json`.
> Đừng sửa tay: sửa `what=`, `emo=`, `why=`, `mood=`, `arc=`, `bpm=`, `sfx=` trong `mix.py`, dựng lại rồi chạy lại công cụ. Quy tắc: [`QUALITY.md` §4](../../_shared/QUALITY.md#4-âm-thanh-và-nhạc-nền).

**Màu nhạc của tập:** "Sunset Counting Song" (Rê trưởng, đếm theo phách lẻ ska). Chi tiết nhạc cụ, giọng và điểm nhấn viết tay: [`MUSIC.md`](MUSIC.md); bảng cue hình ↔ tiếng: [`SOUND.md`](SOUND.md).

## Cung bậc

- **Mở đầu** 0,0–5,8 s: Playful Cartoon, Funny Comedy, Happy Kids; 112–126 BPM; kazoo, trumpet bịt, xylophone
- **Diễn biến** 5,8–11,8 s: Happy Kids, Magical Adventure; 104–108 BPM; vibraphone, đàn hạc
- **Cao trào** 11,8–13,4 s: Epic Cartoon; 132 BPM; trumpet
- **Kết** 13,4–24,0 s: Playful Cartoon, Funny Comedy, Bouncy Rhythm; 100–120 BPM; accordion, kazoo, sáo

## Bảng thiết kế âm thanh

| Thời gian | Nội dung cảnh | Cảm xúc | Phong cách nhạc | Nhạc cụ | BPM | SFX |
|---|---|---|---|---|---|---|
| 0,0–1,9 s<br>*Mở đầu* | Fizz vừa đáp xuống cạnh Blink lúc hoàng hôn, cọ hai chân trước; Blink bắt chước: "Which one is a fly?" | tò mò, buồn cười · nhịp vừa | Playful Cartoon<br>nảy lệch phách, D | **kazoo** (giai điệu) · ukulele · bass gảy · bongo + shaker | 120 | boing + pop từng chữ ×2, rub ×2, nhảy (boing + whoosh) ×2, pop chữ móc, đáp xuống, +1 tiếng khác |
| 1,9–3,1 s<br>*Mở đầu* | Blink giơ chân nhận: "Me! I'm a firefly!" | tự tin, buồn cười · nhịp vừa | Funny Comedy<br>ska phách lẻ, D | **trumpet bịt** (giai điệu) · piano · bass gảy · ska (snare, hi-hat, mõ) | 112 | tadasmall |
| 3,1–3,8 s<br>*Mở đầu* | Khựng: Blink chờ, Fizz nghiêng đầu | nín thở · nhịp khựng | Khựng (Suspense & Surprise) | lớp mỏng (khoảng lặng có chủ đích) | — | trống lăn thì thầm, zip vút, landL |
| 3,8–5,8 s<br>*Mở đầu* | Miss Loupe bật vào: "Nope!" – Blink xìu; "Let's zoom in!" | bất ngờ, háo hức · nhịp nhanh | Happy Kids<br>pop nảy, D | **xylophone** (giai điệu) · đàn hạc · bass gảy · pop (kick, vỗ tay, hi-hat) | 126 | deflate |
| 5,8–8,5 s<br>*Diễn biến* | Kính lớn soi Fizz xoè cánh, số "1", "2" bật lên: "A fly has two wings." | vui, rõ ràng · nhịp vừa | Happy Kids<br>ska phách lẻ, D | **vibraphone** (giai điệu) · ukulele · bass gảy · ska (snare, hi-hat, mõ) | 104 | đếm "1 2 3" ×2, whoosh lao vào kính, buzz |
| 8,5–11,8 s<br>*Diễn biến* | Kính lia sang Blink: tấm cánh bật lên "1, 2", hai cánh mỏng mở ra "3, 4": "Blink has wing cases on top!" | kỳ diệu, bất ngờ · nhịp vừa | Magical Adventure<br>phiêu lưu nước kiệu, G | **đàn hạc** (giai điệu) · dây pizzicato · celesta · contrabass · trống tom | 108 | đếm "1 2 3" ×4, whoosh, tách tách (cánh), unfold |
| 11,8–13,4 s<br>*Cao trào* | Blink vỡ lẽ, tự hào: "So I'm a beetle!" | vỡ lẽ, tự hào · nhịp cao trào | Epic Cartoon<br>ska phách lẻ, D | **trumpet** (giai điệu) · kèn đồ chơi · bass gảy · ska (snare, hi-hat, mõ) | 132 | lấp lánh |
| 13,4–14,3 s<br>*Kết* | Kính "chụp" Blink đang mở tấm cánh, sticker hiện trên trang sổ | háo hức · nhịp khựng | Khựng · Happy Kids | **đàn hạc** (giai điệu) · marimba | — | chụp sticker, whoosh xuyên kính, whoosh lùi ra sổ, lật trang, whoosh mỏng |
| 14,3–17,6 s<br>*Kết* | Sticker "Beetle!" dán vào sổ; Albie đếm chân: "Six legs? In you go!", Blink lao vào trang đúng "go!" | vui, tự hào · nhịp vừa | Playful Cartoon<br>shuffle nhảy chân sáo, D | **accordion** (giai điệu) · ukulele · bass gảy · đồ chơi (vỗ tay, shaker, phách gỗ) | 116 | countA ×3, dán sticker, ding, zip vút, nhảy (boing + whoosh), +2 tiếng khác |
| 17,6–21,4 s<br>*Kết* | Fizz nhấc cánh như tấm cánh, gồng đuôi cho sáng… chỉ ra một tia "xì": "Nice try, Fizz!" | buồn cười, thương · nhịp chậm | Funny Comedy<br>rình rập hài, Bm | **kazoo** (giai điệu) · dây pizzicato · tuba · mõ hai cao độ | 100 | lật trang, buzz, strain, fizzle, nhún vai, +1 tiếng khác |
| 21,4–24,0 s<br>*Kết* | "How many wings does a fly have?" – Fizz vỗ hai cánh, bay một vòng, đáp về đúng khung đầu | háo hức, mời gọi · nhịp nhanh | Bouncy Rhythm<br>phi ngựa (nhịp kép), D | **sáo** (giai điệu) · marimba · bass gảy · đồ chơi (vỗ tay, shaker, phách gỗ) | 120 (cảm giác 240) | buzzloop, chữ móc trở lại, hopout |

## Vì sao chọn nhạc này

1. **0,0–1,9 s · Fizz vừa đáp xuống cạnh Blink lúc hoàng hôn, cọ hai chân trước; Blink bắt chước: "Which one is a fly?"** (Playful Cartoon, 120 BPM): Nảy lệch phách, ukulele và bongo vào ngay giây 0 theo cú đáp của Fizz; kazoo "vè vè" là giọng của Fizz, chen vào sau câu hỏi.
2. **1,9–3,1 s · Blink giơ chân nhận: "Me! I'm a firefly!"** (Funny Comedy, 112 BPM): Điệu riêng của tập: ska 112 BPM, piano chặn ở mọi phách lẻ cho câu nhận vơ đầy tự tin; trumpet bịt "wah" như đang cười thầm, vì ai cũng biết câu đoán sắp sai. *Vào cảnh:* trống dồn.
3. **3,1–3,8 s · Khựng: Blink chờ, Fizz nghiêng đầu** (Khựng (Suspense & Surprise), — BPM): Khoảng lặng có chủ đích 0,6 s (chỉ còn trống lăn thì thầm) để "Nope!" bật ra rõ. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
4. **3,8–5,8 s · Miss Loupe bật vào: "Nope!" – Blink xìu; "Let's zoom in!"** (Happy Kids, 126 BPM): Pop nảy 126 BPM ngay sau "Nope!"; trombone "wah-wah" đi xuống khi Blink xìu (viết tay), rồi xylophone đáp sau "zoom in". *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
5. **5,8–8,5 s · Kính lớn soi Fizz xoè cánh, số "1", "2" bật lên: "A fly has two wings."** (Happy Kids, 104 BPM): Bài đếm số theo phách lẻ: ska chậm 104 BPM, ukulele chặn "chk – chk" như tiếng đếm; mỗi số là một nốt marimba cao (viết tay), trẻ đếm theo được. *Vào cảnh:* ngân đuôi, cảnh sau vào mềm.
6. **8,5–11,8 s · Kính lia sang Blink: tấm cánh bật lên "1, 2", hai cánh mỏng mở ra "3, 4": "Blink has wing cases on top!"** (Magical Adventure, 108 BPM): Phiêu lưu 108 BPM, đàn hạc hát và celesta rải khi tấm cánh bật (008 đã dùng celesta hát chính cho điệu này); bốn nốt marimba tiếp tục đi lên từ hai nốt của ruồi, nên "4" nghe rõ là nhiều hơn "2". *Vào cảnh:* dâng lấp lánh.
7. **11,8–13,4 s · Blink vỡ lẽ, tự hào: "So I'm a beetle!"** (Epic Cartoon, 132 BPM): Cao trào ngắn của tập: ska nhanh 132 BPM, kèn chặn mọi phách lẻ, timpani nhấn phách đầu; kèn trumpet ba nốt đi lên ngay trước câu (viết tay). *Vào cảnh:* trống dồn.
8. **13,4–14,3 s · Kính "chụp" Blink đang mở tấm cánh, sticker hiện trên trang sổ** (Khựng · Happy Kids, — BPM): Marimba chạy lên (tiếng "chụp" của ban nhạc kênh), đàn hạc vuốt qua mặt kính. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
9. **14,3–17,6 s · Sticker "Beetle!" dán vào sổ; Albie đếm chân: "Six legs? In you go!", Blink lao vào trang đúng "go!"** (Playful Cartoon, 116 BPM): Shuffle ukulele 116 BPM, accordion đáp sau câu cửa miệng; dưới giọng trầm của Albie lớp nhịp tự bỏ bass. (11/2026 lượt 2: piano đồ chơi ở cảnh sổ đã quá quen.) *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
10. **17,6–21,4 s · Fizz nhấc cánh như tấm cánh, gồng đuôi cho sáng… chỉ ra một tia "xì": "Nice try, Fizz!"** (Funny Comedy, 100 BPM): Rình rập hài 100 BPM ở Si thứ: pizzicato rón rén theo cú gồng, tuba "bwomp" đi xuống khi "xì" (viết tay), kazoo của Fizz "vè vè" bắt chước theo. *Vào cảnh:* ngân đuôi, cảnh sau vào mềm.
11. **21,4–24,0 s · "How many wings does a fly have?" – Fizz vỗ hai cánh, bay một vòng, đáp về đúng khung đầu** (Bouncy Rhythm, 120 (cảm giác 240) BPM): Phi ngựa (nhịp kép) 120 BPM theo vòng bay của Fizz; hợp âm La ở cuối dẫn về Rê của khung đầu nên vòng lặp liền. *Vào cảnh:* trống dồn.

## Chuyển cảnh âm thanh

| Giây | Từ → sang | Cách chuyển | BPM |
|---|---|---|---|
| 1,9 | móc · ai là ruồi? → "Me! I'm a firefly!" | trống dồn | 120 → 112 |
| 3,1 | "Me! I'm a firefly!" → khựng | viết tay (stinger, khựng, nhạc hiệu) | 112 → 120 |
| 3,8 | khựng → "Nope!" · "Let's zoom in!" | viết tay (stinger, khựng, nhạc hiệu) | 120 → 126 |
| 5,8 | "Nope!" · "Let's zoom in!" → đếm cánh ruồi · 1, 2 | ngân đuôi, cảnh sau vào mềm | 126 → 104 |
| 8,5 | đếm cánh ruồi · 1, 2 → tấm cánh của Blink · 1–4 | dâng lấp lánh | 104 → 108 |
| 11,8 | tấm cánh của Blink · 1–4 → "So I'm a beetle!" | trống dồn | 108 → 132 |
| 13,4 | "So I'm a beetle!" → chụp → sổ | viết tay (stinger, khựng, nhạc hiệu) | 132 → 120 |
| 14,3 | chụp → sổ → sổ · Albie | viết tay (stinger, khựng, nhạc hiệu) | 120 → 116 |
| 17,6 | sổ · Albie → gag · Fizz bắt chước | ngân đuôi, cảnh sau vào mềm | 116 → 100 |
| 21,4 | gag · Fizz bắt chước → câu hỏi · Fizz bay một vòng | trống dồn | 100 → 120 |

## Chống trùng lặp

- 11 cảnh nhạc (9 cảnh có điệu, còn lại là khựng / nhạc hiệu viết tay).
- 6 phong cách nhạc: Playful Cartoon ×2, Funny Comedy ×2, Happy Kids ×2, Magical Adventure ×1, Epic Cartoon ×1, Bouncy Rhythm ×1.
- 8 nhạc cụ hát chính: kazoo ×2, trumpet bịt ×1, xylophone ×1, vibraphone ×1, đàn hạc ×1, trumpet ×1, accordion ×1, sáo ×1.
- 12 họ nhạc cụ: bass, bộ gõ, chuông, dây pizzicato, kèn gỗ, kèn đồng, marimba, nhạc cụ hoạt hình, piano, ukulele, xylophone, đàn hạc.
- BPM: 100, 104, 108, 112, 116, 120, 126, 132 (8 mức).
- Chuyển cảnh: viết tay (stinger, khựng, nhạc hiệu) ×4, trống dồn ×3, ngân đuôi, cảnh sau vào mềm ×2, dâng lấp lánh ×1.
- Câu đáp của nhạc giữa các câu thoại: 7.

## Chống trùng lặp giữa các tập

So với 9 Short khác (001, 002, 003, 004, 005, 006, 007, 008, 010), từ `music-plan.json` của từng tập.

- **Điệu riêng của tập:** ska phách lẻ, chiếm 23 % thời lượng.
- **Công thức trùng với Short khác:** không có.
- **Cặp điệu + nhạc cụ hát chính đã có ở Short khác:** rình rập hài + kazoo (007); phi ngựa (nhịp kép) + sáo (002).
- **Vui nhộn:** hồi hộp + khựng 3 %, cảnh nền giọng thứ 16 % thời lượng (mỗi mục ≤ 20 %).

Các ngưỡng và kết quả kiểm: `python _shared/qa.py films/short-009` (nhóm "4 Âm thanh" và "Sound Design Plan").
