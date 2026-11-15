# SHORT-011 · Sound Design Plan

> Sinh tự động bằng `python _shared/tools/soundplan.py films/short-011` từ `out/music.json` (bảng cảnh nhạc khai báo trong `mix.py` bằng `G.sec` / `G.mark`) và `events.json`.
> Đừng sửa tay: sửa `what=`, `emo=`, `why=`, `mood=`, `arc=`, `bpm=`, `sfx=` trong `mix.py`, dựng lại rồi chạy lại công cụ. Quy tắc: [`QUALITY.md` §4](../../_shared/QUALITY.md#4-âm-thanh-và-nhạc-nền).

**Màu nhạc của tập:** "Tiptoe Cha-Cha" (Si trưởng, cha-cha-chá rón rén: chuông bò, guiro, phách). Chi tiết nhạc cụ, giọng và điểm nhấn viết tay: [`MUSIC.md`](MUSIC.md); bảng cue hình ↔ tiếng: [`SOUND.md`](SOUND.md).

## Cung bậc

- **Mở đầu** 0,0–4,3 s: Funny Comedy; 116–120 BPM; clarinet, trumpet bịt
- **Diễn biến** 4,3–9,9 s: Playful Cartoon, Magical Adventure; 108 BPM; vibraphone, trống thép
- **Cao trào** 9,9–13,2 s: Epic Cartoon; 132 BPM; trumpet
- **Kết** 13,2–22,0 s: Playful Cartoon, Funny Comedy, Happy Kids, Bouncy Rhythm; 112–124 BPM; accordion, bassoon, xylophone, marimba

## Bảng thiết kế âm thanh

| Thời gian | Nội dung cảnh | Cảm xúc | Phong cách nhạc | Nhạc cụ | BPM | SFX |
|---|---|---|---|---|---|---|
| 0,0–2,1 s<br>*Mở đầu* | Crumb nhón chân, giơ biển BOO! sau lưng Zip; "Can you sneak up on a dragonfly?"; giẫm lá khô "rắc", đứng sững một chân | tinh nghịch, hồi hộp vui · nhịp vừa | Funny Comedy<br>cha-cha-chá, B | **clarinet** (giai điệu) · marimba · bass gảy · cha-cha-chá (chuông bò, guiro, phách) | 120 | tiptoe ×5, boing + pop từng chữ ×2, pop chữ móc, crunch, lò xo rung, +1 tiếng khác |
| 2,1–3,9 s<br>*Mở đầu* | Crumb cười trừ, chắc mẩm: "From behind, it can't see me!" | tự tin, buồn cười · nhịp vừa | Funny Comedy<br>shuffle nhảy chân sáo, B | **trumpet bịt** (giai điệu) · dây pizzicato · bass gảy · gỗ (mõ, shaker) | 116 | sheepish, titleout |
| 3,9–4,3 s<br>*Mở đầu* | Khoá kéo chạy từ trên xuống, tách khung thành "CRUMB SEES" / "ZIP SEES" | tò mò · nhịp khựng | Khựng · Playful Cartoon | **đàn hạc** (giai điệu) · xylophone | — | zipper |
| 4,3–6,6 s<br>*Diễn biến* | Khung trái: qua vai Crumb chỉ thấy lưng Zip; khung phải: mắt Zip còn nhắm. "Crumb only sees its back." | tò mò, chờ đợi · nhịp vừa | Playful Cartoon<br>phiêu lưu nước kiệu, E | **vibraphone** (giai điệu) · đàn hạc · contrabass · đồ chơi (vỗ tay, shaker, phách gỗ) | 108 | panels |
| 6,6–8,9 s<br>*Diễn biến* | Mắt Zip mở ra, tầm nhìn nở rộng gần trọn vòng, Crumb trượt vào khung: "But Zip can see Crumb!"; vòng "bị thấy rồi!" | kỳ diệu, bất ngờ · nhịp vừa | Magical Adventure<br>hộp nhạc lấp lánh, B | **trống thép** (giai điệu) · celesta · bass gảy · triangle + shaker | 108 | eyeopen, widen, chuyển cảnh đốm |
| 8,9–9,9 s<br>*Diễn biến* | Crumb: "Oh no!" rồi nấp sau tấm biển, nhưng Zip vẫn thấy | luống cuống, buồn cười · nhịp khựng | Khựng · Funny Comedy | trombone | — | hide |
| 9,9–13,2 s<br>*Cao trào* | "Its big eyes see almost all around!": hai vòm mắt Zip sáng lên, vệt sáng chạy quanh tầm nhìn tới tận phía sau; Crumb ló ra vẫy | vỡ lẽ, phấn khích · nhịp cao trào | Epic Cartoon<br>cha-cha-chá, B | **trumpet** (giai điệu) · piano · bass gảy · cha-cha-chá (chuông bò, guiro, phách) | 132 | glow, sweep, peek |
| 13,2–14,2 s<br>*Kết* | Khung "ZIP SEES" được "chụp", hoá thành sticker trên trang sổ | háo hức · nhịp khựng | Khựng · Happy Kids | **đàn hạc** (giai điệu) · marimba | — | chụp sticker, whoosh xuyên kính, whoosh lùi ra sổ, lật trang, whoosh mỏng |
| 14,2–17,0 s<br>*Kết* | Sticker "No sneaking!" dán vào sổ; Albie đếm chân: "Six legs? In you go!", Zip lao vào trang đúng "go!" | vui, tự hào · nhịp vừa | Playful Cartoon<br>polka, E | **accordion** (giai điệu) · ukulele · bass gảy · vỗ tay + lục lạc | 116 | countA ×3, dán sticker, ding, zip vút, nhảy (boing + whoosh), +2 tiếng khác |
| 17,0–18,4 s<br>*Kết* | Crumb rón rén lại gần, giơ biển cao, hít hơi… Zip quay lại trước "zip!" | tinh nghịch, nín thở · nhịp vừa | Funny Comedy<br>cha-cha-chá, B | **bassoon** (giai điệu) · dây pizzicato · tuba · cha-cha-chá (chuông bò, guiro, phách) | 112 | tiptoe ×2, lật trang, inhale, zipturn |
| 18,4–19,1 s<br>*Kết* | Crumb tự giật mình, nhảy bật, biển bay vèo, ngã ngồi lên đệm cỏ; biển đáp lên đầu như mũ | bất ngờ, buồn cười · nhịp khựng | Khựng · Funny Comedy | **trumpet** (giai điệu) · tuba | — | giật mình, signfly, plop |
| 19,1–20,4 s<br>*Kết* | Crumb ngồi đội biển "hi!", cười: "Oh! I scared myself!"; Zip cười rung cánh | vui, nhẹ nhõm · nhịp vừa | Happy Kids<br>ukulele nắng, E | **xylophone** (giai điệu) · ukulele · bass gảy · pop (kick, vỗ tay, hi-hat) | 124 | hat, tiếng cười |
| 20,4–22,0 s<br>*Kết* | "Can YOU sneak up on Zip?"; Zip quay lưng lại, Crumb đứng dậy giơ biển, rón rén về đúng khung đầu | mời gọi, háo hức · nhịp vừa | Bouncy Rhythm<br>nảy lệch phách, B | **marimba** (giai điệu) · ukulele · bass gảy · bongo + shaker | 120 | zipturn, getup, chữ móc trở lại, tiptoe |

## Vì sao chọn nhạc này

1. **0,0–2,1 s · Crumb nhón chân, giơ biển BOO! sau lưng Zip; "Can you sneak up on a dragonfly?"; giẫm lá khô "rắc", đứng sững một chân** (Funny Comedy, 120 BPM): Điệu riêng của tập: cha-cha-chá 120 BPM, mỗi bước nhón chân rơi đúng phách của phim ("một, hai, ba, cha-cha"); chuông bò, guiro và phách vào ngay giây 0; clarinet rón rén đáp sau câu hỏi.
2. **2,1–3,9 s · Crumb cười trừ, chắc mẩm: "From behind, it can't see me!"** (Funny Comedy, 116 BPM): Shuffle nhảy chân sáo 116 BPM, vui tươi (11/2026: không dùng điệu rình rập): pizzicato nhón từng nốt; trumpet bịt "wah" như cười thầm, vì trẻ sắp biết Crumb nhầm. *Vào cảnh:* trống dồn.
3. **3,9–4,3 s · Khoá kéo chạy từ trên xuống, tách khung thành "CRUMB SEES" | "ZIP SEES"** (Khựng · Playful Cartoon, — BPM): Viết tay: xylophone chạy nửa cung đi lên theo con chạy của khoá kéo, đàn hạc vuốt khi hai khung mở ra. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
4. **4,3–6,6 s · Khung trái: qua vai Crumb chỉ thấy lưng Zip; khung phải: mắt Zip còn nhắm. "Crumb only sees its back."** (Playful Cartoon, 108 BPM): Phiêu lưu nước kiệu 108 BPM, vibraphone hát nhẹ: cuộc rình còn đang "êm"; đàn hạc gảy như đếm bước chờ mắt Zip mở. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
5. **6,6–8,9 s · Mắt Zip mở ra, tầm nhìn nở rộng gần trọn vòng, Crumb trượt vào khung: "But Zip can see Crumb!"; vòng "bị thấy rồi!"** (Magical Adventure, 108 BPM): Hộp nhạc lấp lánh 108 BPM: trống thép là "mắt" của Zip, celesta rải theo tầm nhìn nở ra; mô-típ bí mật đô–mi–sol trên trống thép đúng lúc Crumb bị thấy (viết tay). *Vào cảnh:* ngân đuôi, cảnh sau vào mềm.
6. **8,9–9,9 s · Crumb: "Oh no!" rồi nấp sau tấm biển, nhưng Zip vẫn thấy** (Khựng · Funny Comedy, — BPM): Khựng ngắn có chủ đích: chỉ còn guiro cạo nhỏ, trombone "wah-wah" đi xuống sau "Oh no!" (viết tay). *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
7. **9,9–13,2 s · "Its big eyes see almost all around!": hai vòm mắt Zip sáng lên, vệt sáng chạy quanh tầm nhìn tới tận phía sau; Crumb ló ra vẫy** (Epic Cartoon, 132 BPM): Cao trào theo điệu của tập: cha-cha-chá nhanh 132 BPM, piano chặn "cha-cha", trumpet hát sau câu giải thích; timpani nhấn phách đầu. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
8. **13,2–14,2 s · Khung "ZIP SEES" được "chụp", hoá thành sticker trên trang sổ** (Khựng · Happy Kids, — BPM): Marimba chạy lên (tiếng "chụp" của ban nhạc kênh), đàn hạc vuốt qua mặt sticker. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
9. **14,2–17,0 s · Sticker "No sneaking!" dán vào sổ; Albie đếm chân: "Six legs? In you go!", Zip lao vào trang đúng "go!"** (Playful Cartoon, 116 BPM): Polka 116 BPM, accordion đáp sau câu cửa miệng (kênh chưa dùng polka + accordion); dưới giọng trầm của Albie lớp nhịp tự bỏ bass. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
10. **17,0–18,4 s · Crumb rón rén lại gần, giơ biển cao, hít hơi… Zip quay lại trước "zip!"** (Funny Comedy, 112 BPM): Lại điệu riêng của tập nhưng chậm 112 BPM, bassoon và tuba rón rén từng bước "cha-cha" (khác móc: clarinet + marimba). *Vào cảnh:* trống dồn.
11. **18,4–19,1 s · Crumb tự giật mình, nhảy bật, biển bay vèo, ngã ngồi lên đệm cỏ; biển đáp lên đầu như mũ** (Khựng · Funny Comedy, — BPM): Stinger viết tay: timpani + trumpet "ta!", tuba "bwomp" đi xuống khi Crumb ngã ngồi, xylophone "plink" khi biển đáp lên đầu. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
12. **19,1–20,4 s · Crumb ngồi đội biển "hi!", cười: "Oh! I scared myself!"; Zip cười rung cánh** (Happy Kids, 124 BPM): Ukulele quạt nắng 124 BPM, xylophone đáp sau câu cười: không ai đau, cả nhà cùng cười. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
13. **20,4–22,0 s · "Can YOU sneak up on Zip?"; Zip quay lưng lại, Crumb đứng dậy giơ biển, rón rén về đúng khung đầu** (Bouncy Rhythm, 120 BPM): Nảy lệch phách 120 BPM theo lưới của phim để nối vòng lặp; hợp âm Fa thăng ở cuối dẫn về Si của khung đầu. *Vào cảnh:* dâng lấp lánh.

## Chuyển cảnh âm thanh

| Giây | Từ → sang | Cách chuyển | BPM |
|---|---|---|---|
| 2,1 | móc · rón rén cha-cha → "From behind, it can't see me!" | trống dồn | 120 → 116 |
| 3,9 | "From behind, it can't see me!" → khoá kéo tách khung | viết tay (stinger, khựng, nhạc hiệu) | 116 → 120 |
| 4,3 | khoá kéo tách khung → Crumb thấy lưng Zip | viết tay (stinger, khựng, nhạc hiệu) | 120 → 108 |
| 6,6 | Crumb thấy lưng Zip → mắt Zip mở · tầm nhìn nở rộng | ngân đuôi, cảnh sau vào mềm | 108 |
| 8,9 | mắt Zip mở · tầm nhìn nở rộng → "Oh no!" · nấp sau biển | viết tay (stinger, khựng, nhạc hiệu) | 108 → 120 |
| 9,9 | "Oh no!" · nấp sau biển → "almost all around!" | viết tay (stinger, khựng, nhạc hiệu) | 120 → 132 |
| 13,2 | "almost all around!" → chụp → sổ | viết tay (stinger, khựng, nhạc hiệu) | 132 → 120 |
| 14,2 | chụp → sổ → sổ · Albie | viết tay (stinger, khựng, nhạc hiệu) | 120 → 116 |
| 17,0 | sổ · Albie → gag · rón rén lần nữa | trống dồn | 116 → 112 |
| 18,4 | gag · rón rén lần nữa → giật mình · ngã ngồi | viết tay (stinger, khựng, nhạc hiệu) | 112 → 120 |
| 19,1 | giật mình · ngã ngồi → "Oh! I scared myself!" | viết tay (stinger, khựng, nhạc hiệu) | 120 → 124 |
| 20,4 | "Oh! I scared myself!" → câu hỏi · vòng lặp | dâng lấp lánh | 124 → 120 |

## Chống trùng lặp

- 13 cảnh nhạc (9 cảnh có điệu, còn lại là khựng / nhạc hiệu viết tay).
- 6 phong cách nhạc: Funny Comedy ×3, Playful Cartoon ×2, Magical Adventure ×1, Epic Cartoon ×1, Happy Kids ×1, Bouncy Rhythm ×1.
- 9 nhạc cụ hát chính: clarinet ×1, trumpet bịt ×1, vibraphone ×1, trống thép ×1, trumpet ×1, accordion ×1, bassoon ×1, xylophone ×1, marimba ×1.
- 12 họ nhạc cụ: bass, bộ gõ, chuông, dây pizzicato, kèn gỗ, kèn đồng, marimba, nhạc cụ hoạt hình, piano, ukulele, xylophone, đàn hạc.
- BPM: 108, 112, 116, 120, 124, 132 (6 mức).
- Chuyển cảnh: viết tay (stinger, khựng, nhạc hiệu) ×8, trống dồn ×2, ngân đuôi, cảnh sau vào mềm ×1, dâng lấp lánh ×1.
- Câu đáp của nhạc giữa các câu thoại: 5.

## Chống trùng lặp giữa các tập

So với 14 Short khác (001, 002, 003, 004, 005, 006, 007, 008, 009, 010, 012, 013, 014, 015), từ `music-plan.json` của từng tập.

- **Điệu riêng của tập:** cha-cha-chá, chiếm 31 % thời lượng.
- **Công thức trùng với Short khác:** không có.
- **Cặp điệu + nhạc cụ hát chính đã có ở Short khác:** không có.
- **Vui nhộn:** hồi hộp + khựng 0 %, cảnh nền giọng thứ 0 % thời lượng (mỗi mục ≤ 20 %).

Các ngưỡng và kết quả kiểm: `python _shared/qa.py films/short-011` (nhóm "4 Âm thanh" và "Sound Design Plan").
