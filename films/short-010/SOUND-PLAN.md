# SHORT-010 · Sound Design Plan

> Sinh tự động bằng `python _shared/tools/soundplan.py films/short-010` từ `out/music.json` (bảng cảnh nhạc khai báo trong `mix.py` bằng `G.sec` / `G.mark`) và `events.json`.
> Đừng sửa tay: sửa `what=`, `emo=`, `why=`, `mood=`, `arc=`, `bpm=`, `sfx=` trong `mix.py`, dựng lại rồi chạy lại công cụ. Quy tắc: [`QUALITY.md` §4](../../_shared/QUALITY.md#4-âm-thanh-và-nhạc-nền).

**Màu nhạc của tập:** "Rewind Pond Hop" (Mi giáng trưởng). Chi tiết nhạc cụ, giọng và điểm nhấn viết tay: [`MUSIC.md`](MUSIC.md); bảng cue hình ↔ tiếng: [`SOUND.md`](SOUND.md).

## Cung bậc

- **Mở đầu** 0,0–44,0 s: Suspense & Surprise, Funny Comedy; 112–126 BPM; bassoon, sáo
- **Diễn biến** 3,8–17,7 s: Magical Adventure, Funny Comedy, Suspense & Surprise, Bouncy Rhythm; 96–132 BPM; celesta, clarinet, bassoon trầm, xylophone, vibraphone
- **Cao trào** 17,7–28,3 s: Cute & Sweet, Happy Kids, Funny Comedy; 104–120 BPM; piano đồ chơi, trống thép, trumpet bịt
- **Kết** 28,3–42,8 s: Epic Cartoon, Cute & Sweet, Suspense & Surprise, Playful Cartoon; 104–124 BPM; kèn đồ chơi, accordion, bassoon, trumpet, kazoo

## Bảng thiết kế âm thanh

| Thời gian | Nội dung cảnh | Cảm xúc | Phong cách nhạc | Nhạc cụ | BPM | SFX |
|---|---|---|---|---|---|---|
| 0,0–1,4 s<br>*Mở đầu* | Crumb nhón chân rón rén sau lưng Miss Loupe định hù; cô hỏi trẻ: "Could you see behind your head?" | hồi hộp, tinh nghịch · nhịp chậm | Suspense & Surprise<br>rón rén, Eb | **bassoon** (giai điệu) · dây pizzicato · pizzicato trầm · gỗ (mõ, shaker) | 112 | tiptoe ×4, boing + pop từng chữ ×2, pop chữ móc, peek |
| 1,4–3,0 s<br>*Mở đầu* | Con ngươi của Zip trượt ra sau, Zip vụt lên, Crumb giật mình ngã ngồi: "Hey! How did it see me?" | bất ngờ, buồn cười · nhịp nhanh | Funny Comedy<br>nảy lệch phách, Eb | **sáo** (giai điệu) · ukulele · bass gảy · bongo + shaker | 126 | zip vút, giật mình, bump, quay người, ô sticker hiện |
| 3,0–3,8 s<br>*Mở đầu* | Máy lao vào mặt kính, logo bật lên | háo hức · nhịp bừng lên | Nhạc hiệu kênh | **marimba** (giai điệu) · kèn đồ chơi · chuông | 120 | whoosh lao vào kính, logo lấp lánh |
| 3,8–7,2 s<br>*Diễn biến* | "Let's zoom in!" — kính soi đầu Zip: hai vòm mắt sáng viền, tia lấp lánh trên đỉnh đầu: "Its eyes cover most of its head!" | kỳ diệu, tò mò · nhịp vừa | Magical Adventure<br>phiêu lưu nước kiệu, Eb | **celesta** (giai điệu) · đàn hạc · contrabass · triangle + shaker | 108 | shine, lấp lánh |
| 7,2–10,6 s<br>*Diễn biến* | Vòng nhìn loang quanh Zip; Crumb rón rén đi một vòng, con ngươi của Zip theo mãi: "So it sees almost all around!" | buồn cười, bị bắt quả tang · nhịp vừa | Funny Comedy<br>rình rập hài, Cm | **clarinet** (giai điệu) · dây pizzicato · tuba · mõ hai cao độ | 100 | tiptoe ×5, peek ×3, ring, tiếng cười, chụp sticker, +1 tiếng khác |
| 10,6–12,2 s<br>*Diễn biến* | Crumb thì thầm: "Can I sneak up on it?" rồi rón rén tới gần Zip từ phía sau | hồi hộp · nhịp chậm | Suspense & Surprise<br>nhịp tim hồi hộp, Cm | **bassoon trầm** (giai điệu) · pizzicato trầm · contrabass · chổi trống | 96 | tiptoe ×3, sticker vào ô |
| 12,2–12,8 s<br>*Diễn biến* | Crumb nhún xuống, sắp vồ… khựng | nín thở · nhịp khựng | Khựng (Suspense & Surprise) | lớp mỏng (khoảng lặng có chủ đích) | — | trống lăn thì thầm, nhảy (boing + whoosh) |
| 12,8–15,3 s<br>*Diễn biến* | "Nope!" — Zip bay lùi vụt đi, Crumb vồ trượt; "It can even fly backwards!" Zip bay tới, bay lùi lần nữa | bất ngờ, phấn khích · nhịp nhanh | Bouncy Rhythm<br>phi ngựa (nhịp kép), Eb | **xylophone** (giai điệu) · marimba · bass gảy · pop (kick, vỗ tay, hi-hat) | 132 (cảm giác 264) | zip vút ×3, flop |
| 15,3–17,7 s<br>*Diễn biến* | Zip đứng yên giữa trời trên đầu Crumb, cánh mờ nhoè; Crumb nhảy với | ngạc nhiên, lơ lửng · nhịp chậm | Magical Adventure<br>rải lơ lửng, Ab | **vibraphone** (giai điệu) · đàn hạc · bass gảy | 96 | hover, nhảy (boing + whoosh), chụp sticker, whoosh mỏng |
| 17,7–20,2 s<br>*Cao trào* | Kính đẩy vào vòm mắt và phình ra phủ cả khung: tổ ong hàng nghìn ô, "Each eye has thousands of tiny eyes!" | kinh ngạc · nhịp vừa | Cute & Sweet<br>hộp nhạc lấp lánh, Eb | **piano đồ chơi** (giai điệu) · celesta · bass gảy · triangle + shaker | 104 | sticker vào ô, dive, facets, pop |
| 20,2–25,1 s<br>*Cao trào* | Crumb ló vào, mỗi ô mắt hiện một Crumb tí hon: "Hi, everybody!" — nghìn Crumb vẫy theo, rón rén theo, lè lưỡi theo | vui sướng, buồn cười · nhịp cao trào | Happy Kids<br>calypso, Eb | **trống thép** (giai điệu) · ukulele · bass gảy · latin (phách gỗ, shaker) | 120 | tiptoe ×3, pop bật lên, reflect, wave, tiếng cười, +1 tiếng khác |
| 25,1–28,3 s<br>*Cao trào* | Kính lùi ra; Miss Loupe cười: "That's a lot of Crumbs!"; Zip và Crumb cùng cười | buồn cười · nhịp vừa | Funny Comedy<br>ragtime piano, Ab | **trumpet bịt** (giai điệu) · piano · tuba · diễu hành (snare, lục lạc) | 112 | zoomback, tiếng cười |
| 28,3–29,2 s<br>*Kết* | Kính "chụp", máy xuyên mặt kính, sticker 3 dán vào sổ | háo hức · nhịp khựng | Khựng · Happy Kids | **đàn hạc** (giai điệu) · marimba | — | chụp sticker, whoosh xuyên kính, whoosh lùi ra sổ, lật trang, whoosh mỏng |
| 29,2–32,4 s<br>*Kết* | Đủ ba sticker; Zip bay lùi vào; Albie: "Six legs? In you go!", Zip lao vào trang đúng "go!" | tự hào, vui · nhịp vừa | Epic Cartoon<br>diễu hành, Eb | **kèn đồ chơi** (giai điệu) · ukulele · tuba · diễu hành (snare, lục lạc) | 116 | đếm "1 2 3" ×3, dán sticker, ding, sticker vào ô, zip vút, +3 tiếng khác |
| 32,9–36,3 s<br>*Kết* | Crumb xin cầm kính; Miss Loupe nháy mắt: "Not yet!"; Crumb xìu | nũng nịu, thương · nhịp chậm | Cute & Sweet<br>nửa nhịp đung đưa, Ab | **accordion** (giai điệu) · ukulele · bass gảy · chổi trống | 104 (cảm giác 52) | whoosh, deflate |
| 36,3–38,9 s<br>*Kết* | Crumb thấy Zip trên ngọn cỏ nến, lại rón rén tới; Zip bay lùi vụt ra khỏi khung phải | tinh nghịch, hồi hộp · nhịp chậm | Suspense & Surprise<br>rón rén, Eb | **bassoon** (giai điệu) · dây pizzicato · pizzicato trầm · gỗ (mõ, shaker) | 112 | tiptoe ×4, Rollo lăn, ding, zip vút, "hử?" |
| 38,9–40,6 s<br>*Kết* | Crumb đếm và hét "boo!" vào chỗ trống; đúng lúc đó Zip vào lại từ khung trái, đuôi chạm Crumb; Crumb giật bắn | hồi hộp → bất ngờ · nhịp nhanh | Suspense & Surprise<br>dừng nhịp, Cm | **trumpet** (giai điệu) · piano · contrabass · timpani + snare | 120 | zip vút, gõ nhẹ, boing, bump |
| 40,6–42,8 s<br>*Kết* | Zip và Crumb cười; Crumb chạy ra sau lưng Miss Loupe; cô hỏi trẻ: "Can YOU see who's behind me?"; Zip về đậu trên vành kính | vui, mời gọi · nhịp vừa | Playful Cartoon<br>polka, Eb | **kazoo** (giai điệu) · ukulele · tuba · đồ chơi (vỗ tay, shaker, phách gỗ) | 124 | tiếng cười, chạy lon ton, zip vút |
| 42,8–44,0 s<br>*Mở đầu* | Crumb lại nhón chân rón rén sau lưng Miss Loupe (đúng khung đầu) | tinh nghịch · nhịp chậm | Suspense & Surprise<br>rón rén, Eb | **bassoon** (giai điệu) · dây pizzicato · pizzicato trầm · gỗ (mõ, shaker) | 112 | tiptoe ×3, đáp xuống, chữ móc trở lại |

## Vì sao chọn nhạc này

1. **0,0–1,4 s · Crumb nhón chân rón rén sau lưng Miss Loupe định hù; cô hỏi trẻ: "Could you see behind your head?"** (Suspense & Surprise, 112 BPM): Rón rén 112 BPM: pizzicato nhón từng bước, bassoon trầm như đang nín thở. Trẻ thấy Crumb, Miss Loupe thì không, nên nhạc "rình" cùng trẻ.
2. **1,4–3,0 s · Con ngươi của Zip trượt ra sau, Zip vụt lên, Crumb giật mình ngã ngồi: "Hey! How did it see me?"** (Funny Comedy, 126 BPM): Nảy lệch phách 126 BPM ngay cú vụt; sáo chạy motif bốn nốt đi lên của Zip (viết tay), bongo cho cú ngã. *Vào cảnh:* trống dồn.
3. **3,0–3,8 s · Máy lao vào mặt kính, logo bật lên** (Nhạc hiệu kênh, 120 BPM): Nhạc hiệu 0,8 s của kênh (band.sting) ở Mi giáng, khớp đúng cú lao vào kính. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
4. **3,8–7,2 s · "Let's zoom in!" — kính soi đầu Zip: hai vòm mắt sáng viền, tia lấp lánh trên đỉnh đầu: "Its eyes cover most of its head!"** (Magical Adventure, 108 BPM): Phiêu lưu 108 BPM, đàn hạc đệm, celesta hát; đàn hạc vuốt lên đúng lúc vòm mắt sáng viền (viết tay). *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
5. **7,2–10,6 s · Vòng nhìn loang quanh Zip; Crumb rón rén đi một vòng, con ngươi của Zip theo mãi: "So it sees almost all around!"** (Funny Comedy, 100 BPM): Rình rập hài 100 BPM ở Đô thứ: mỗi lần con ngươi trượt theo là một nốt marimba (viết tay); clarinet cười khúc khích khi Crumb bị bắt gặp. *Vào cảnh:* dâng lấp lánh.
6. **10,6–12,2 s · Crumb thì thầm: "Can I sneak up on it?" rồi rón rén tới gần Zip từ phía sau** (Suspense & Surprise, 96 BPM): Nhịp tim hồi hộp 96 BPM, chỉ còn bass và chổi trống, để câu hỏi thì thầm nổi lên và trẻ đoán. *Vào cảnh:* ngân đuôi, cảnh sau vào mềm.
7. **12,2–12,8 s · Crumb nhún xuống, sắp vồ… khựng** (Khựng (Suspense & Surprise), — BPM): Khoảng lặng có chủ đích 0,6 s (trống lăn thì thầm) để "Nope!" bật ra rõ. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
8. **12,8–15,3 s · "Nope!" — Zip bay lùi vụt đi, Crumb vồ trượt; "It can even fly backwards!" Zip bay tới, bay lùi lần nữa** (Bouncy Rhythm, 132 (cảm giác 264) BPM): Phi ngựa 132 BPM cho màn bay; motif của Zip chạy NGƯỢC xuống mỗi lần Zip bay lùi và đi lên khi bay tới (viết tay), nghe ra "tua ngược". *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
9. **15,3–17,7 s · Zip đứng yên giữa trời trên đầu Crumb, cánh mờ nhoè; Crumb nhảy với** (Magical Adventure, 96 BPM): Rải lơ lửng 96 BPM, không trống: nhạc "đứng yên" cùng Zip; vibraphone ngân như cánh rung. *Vào cảnh:* dâng lấp lánh.
10. **17,7–20,2 s · Kính đẩy vào vòm mắt và phình ra phủ cả khung: tổ ong hàng nghìn ô, "Each eye has thousands of tiny eyes!"** (Cute & Sweet, 104 BPM): Hộp nhạc lấp lánh 104 BPM: toy piano và celesta nhỏ như từng ô mắt; đàn hạc vuốt lên dài theo cú đẩy vào mắt (viết tay). *Vào cảnh:* ngân đuôi, cảnh sau vào mềm.
11. **20,2–25,1 s · Crumb ló vào, mỗi ô mắt hiện một Crumb tí hon: "Hi, everybody!" — nghìn Crumb vẫy theo, rón rén theo, lè lưỡi theo** (Happy Kids, 120 BPM): Cao trào của tập: calypso 120 BPM với trống thép (steel drum) như một bữa tiệc nghìn người; làn mưa nốt toy piano lan từ giữa ra khi các hình phản chiếu hiện lên (viết tay). *Vào cảnh:* trống dồn.
12. **25,1–28,3 s · Kính lùi ra; Miss Loupe cười: "That's a lot of Crumbs!"; Zip và Crumb cùng cười** (Funny Comedy, 112 BPM): Ragtime piano 112 BPM cho câu đùa, trumpet bịt "wah" cười theo; đàn hạc vuốt xuống khi kính lùi ra (viết tay). *Vào cảnh:* chuỗi nốt đi xuống.
13. **28,3–29,2 s · Kính "chụp", máy xuyên mặt kính, sticker 3 dán vào sổ** (Khựng · Happy Kids, — BPM): Marimba chạy lên (tiếng "chụp" của ban nhạc kênh), đàn hạc vuốt qua mặt kính. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
14. **29,2–32,4 s · Đủ ba sticker; Zip bay lùi vào; Albie: "Six legs? In you go!", Zip lao vào trang đúng "go!"** (Epic Cartoon, 116 BPM): Diễu hành nhỏ 116 BPM với kèn đồ chơi: đủ ba bí mật là một chiến công; dưới giọng trầm của Albie lớp nhịp tự bỏ bass. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
15. **32,9–36,3 s · Crumb xin cầm kính; Miss Loupe nháy mắt: "Not yet!"; Crumb xìu** (Cute & Sweet, 104 (cảm giác 52) BPM): Đung đưa nửa nhịp ở La giáng, accordion hiền như một lời dỗ; trombone "wah-wah" đi xuống khi Crumb xìu (viết tay).
16. **36,3–38,9 s · Crumb thấy Zip trên ngọn cỏ nến, lại rón rén tới; Zip bay lùi vụt ra khỏi khung phải** (Suspense & Surprise, 112 BPM): Nhạc rón rén của móc trở lại y nguyên (reprise): cùng mạch "Crumb đi rình". Motif của Zip chạy ngược xuống khi Zip bay lùi ra (viết tay). *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
17. **38,9–40,6 s · Crumb đếm và hét "boo!" vào chỗ trống; đúng lúc đó Zip vào lại từ khung trái, đuôi chạm Crumb; Crumb giật bắn** (Suspense & Surprise, 120 BPM): Dừng nhịp 120 BPM: mỗi số đếm một cú chặn, "boo!" là cú chặn cả dàn (viết tay); còi trượt lên khi Crumb giật bắn. *Vào cảnh:* trống dồn.
18. **40,6–42,8 s · Zip và Crumb cười; Crumb chạy ra sau lưng Miss Loupe; cô hỏi trẻ: "Can YOU see who's behind me?"; Zip về đậu trên vành kính** (Playful Cartoon, 124 BPM): Polka 124 BPM, kazoo cười; dưới câu hỏi kết nhạc nhỏ lại để trẻ trả lời; chữ móc trở lại với hợp âm Mi giáng. *Vào cảnh:* ngân đuôi, cảnh sau vào mềm.
19. **42,8–44,0 s · Crumb lại nhón chân rón rén sau lưng Miss Loupe (đúng khung đầu)** (Suspense & Surprise, 112 BPM): Mở đầu của vòng sau: nhạc rón rén của móc bắt đầu lại 1,2 s trước điểm lặp, cùng 112 BPM, nên vòng lặp nghe liền một mạch. Phần kết của tập là polka ở cảnh trước. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).

## Chuyển cảnh âm thanh

| Giây | Từ → sang | Cách chuyển | BPM |
|---|---|---|---|
| 1,4 | móc · Crumb rón rén → Zip vụt lên · "How did it see me?" | trống dồn | 112 → 126 |
| 3,0 | Zip vụt lên · "How did it see me?" → logo · nhạc hiệu 0,8 s | viết tay (stinger, khựng, nhạc hiệu) | 126 → 120 |
| 3,8 | logo · nhạc hiệu 0,8 s → bí mật 1 · mắt chiếm gần hết đầu | viết tay (stinger, khựng, nhạc hiệu) | 120 → 108 |
| 7,2 | bí mật 1 · mắt chiếm gần hết đầu → Crumb đi một vòng, mắt theo mãi | dâng lấp lánh | 108 → 100 |
| 10,6 | Crumb đi một vòng, mắt theo mãi → bí mật 2 · "Can I sneak up on it?" | ngân đuôi, cảnh sau vào mềm | 100 → 96 |
| 12,2 | bí mật 2 · "Can I sneak up on it?" → khựng trước "Nope!" | viết tay (stinger, khựng, nhạc hiệu) | 96 → 120 |
| 12,8 | khựng trước "Nope!" → "Nope!" · Zip bay lùi | viết tay (stinger, khựng, nhạc hiệu) | 120 → 132 |
| 15,3 | "Nope!" · Zip bay lùi → đứng yên giữa trời | dâng lấp lánh | 132 → 96 |
| 17,7 | đứng yên giữa trời → vào mắt kép | ngân đuôi, cảnh sau vào mềm | 96 → 104 |
| 20,2 | vào mắt kép → hàng nghìn Crumb tí hon | trống dồn | 104 → 120 |
| 25,1 | hàng nghìn Crumb tí hon → "That's a lot of Crumbs!" | chuỗi nốt đi xuống | 120 → 112 |
| 28,3 | "That's a lot of Crumbs!" → chụp → sổ | viết tay (stinger, khựng, nhạc hiệu) | 112 → 120 |
| 29,2 | chụp → sổ → sổ · Albie | viết tay (stinger, khựng, nhạc hiệu) | 120 → 116 |
| 36,3 | gag · "Can I hold the lens now?" → gag · lại rón rén | viết tay (stinger, khựng, nhạc hiệu) | 104 → 112 |
| 38,9 | gag · lại rón rén → "One, two, three, boo!" | trống dồn | 112 → 120 |
| 40,6 | "One, two, three, boo!" → cười · "Can YOU see who's behind me?" | ngân đuôi, cảnh sau vào mềm | 120 → 124 |
| 42,8 | cười · "Can YOU see who's behind me?" → lại rón rén (nối vòng lặp) | viết tay (stinger, khựng, nhạc hiệu) | 124 → 112 |

## Chống trùng lặp

- 19 cảnh nhạc (16 cảnh có điệu, còn lại là khựng / nhạc hiệu viết tay).
- 8 phong cách nhạc: Suspense & Surprise ×5, Funny Comedy ×3, Magical Adventure ×2, Cute & Sweet ×2, Bouncy Rhythm ×1, Happy Kids ×1, Epic Cartoon ×1, Playful Cartoon ×1.
- 14 nhạc cụ hát chính: bassoon ×3, sáo ×1, celesta ×1, clarinet ×1, bassoon trầm ×1, xylophone ×1, vibraphone ×1, piano đồ chơi ×1, trống thép ×1, trumpet bịt ×1, kèn đồ chơi ×1, accordion ×1, trumpet ×1, kazoo ×1.
- 12 họ nhạc cụ: bass, bộ gõ, chuông, dây pizzicato, kèn gỗ, kèn đồng, marimba, nhạc cụ hoạt hình, piano, ukulele, xylophone, đàn hạc.
- BPM: 96, 100, 104, 108, 112, 116, 120, 124, 126, 132 (10 mức).
- Chuyển cảnh: viết tay (stinger, khựng, nhạc hiệu) ×8, trống dồn ×3, ngân đuôi, cảnh sau vào mềm ×3, dâng lấp lánh ×2, chuỗi nốt đi xuống ×1.
- Câu đáp của nhạc giữa các câu thoại: 15.

Các ngưỡng và kết quả kiểm: `python _shared/qa.py films/short-010` (nhóm "4 Âm thanh").
