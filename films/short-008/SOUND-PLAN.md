# SHORT-008 · Sound Design Plan

> Sinh tự động bằng `python _shared/tools/soundplan.py films/short-008` từ `out/music.json` (bảng cảnh nhạc khai báo trong `mix.py` bằng `G.sec` / `G.mark`) và `events.json`.
> Đừng sửa tay: sửa `what=`, `emo=`, `why=`, `mood=`, `arc=`, `bpm=`, `sfx=` trong `mix.py`, dựng lại rồi chạy lại công cụ. Quy tắc: [`QUALITY.md` §4](../../_shared/QUALITY.md#4-âm-thanh-và-nhạc-nền).

**Màu nhạc của tập:** "Campfire Glow" (La giáng trưởng, móc ở Fa thứ; tiệc disco que sáng). Chi tiết nhạc cụ, giọng và điểm nhấn viết tay: [`MUSIC.md`](MUSIC.md); bảng cue hình ↔ tiếng: [`SOUND.md`](SOUND.md).

## Cung bậc

- **Mở đầu** 0,0–5,0 s: Funny Comedy, Suspense & Surprise, Bouncy Rhythm; 120–128 BPM; bassoon, xylophone, marimba
- **Diễn biến** 5,0–18,5 s: Magical Adventure, Funny Comedy, Cute & Sweet, Happy Kids; 96–116 BPM; celesta, clarinet, vibraphone, xylophone, sáo
- **Cao trào** 18,5–19,8 s: Epic Cartoon; 132 BPM; trumpet
- **Kết** 19,8–22,0 s: Playful Cartoon; 120 BPM; glockenspiel

## Bảng thiết kế âm thanh

| Thời gian | Nội dung cảnh | Cảm xúc | Phong cách nhạc | Nhạc cụ | BPM | SFX |
|---|---|---|---|---|---|---|
| 0,0–2,4 s<br>*Mở đầu* | Đêm lạnh: Miss Loupe quàng khăn hơ tay bên "lửa trại" Blink, băng mọc trên tay, cô giật nảy "BRRR!": "Could you glow without getting hot?" | buồn cười, tò mò · nhịp vừa | Funny Comedy<br>rón rén, Fm | **bassoon** (giai điệu) · marimba · pizzicato trầm · mõ hai cao độ | 120 | boing + pop từng chữ ×2, breath ×2, pop chữ móc, chatter, glowhum, +4 tiếng khác |
| 2,4–3,9 s<br>*Mở đầu* | Blink quay ra máy: "Watch this!" – đuôi bùng sáng rực cả trại, tay Miss Loupe vẫn đóng băng | bất ngờ, phấn khích · nhịp nhanh | Suspense & Surprise<br>dừng nhịp, Ab | **xylophone** (giai điệu) · trumpet · tuba · timpani + snare | 120 | bùng sáng |
| 3,9–5,0 s<br>*Mở đầu* | Miss Loupe giơ kính: "Let's zoom in!" | háo hức · nhịp nhanh | Bouncy Rhythm<br>disco, Ab | **marimba** (giai điệu) · dàn dây spiccato · bass gảy · disco (kick 4 phách, vỗ tay, hi-hat mở) | 128 | whoosh |
| 5,0–8,6 s<br>*Diễn biến* | Kính lớn lao vào trong đèn đuôi: giọt vàng, bong bóng xanh, cánh quạt hồng gặp nhau, "pop!" thành ánh sáng: "Tiny bits mix together and make light!" | kỳ diệu, khám phá · nhịp vừa | Magical Adventure<br>phiêu lưu nước kiệu, Ab | **celesta** (giai điệu) · dây pizzicato · đàn hạc · contrabass · trống tom | 108 | mix ×8, bong bóng ×2, whoosh lao vào kính, dive |
| 8,6–10,9 s<br>*Diễn biến* | Buồng sáng bừng lên; nhiệt kế tí hon run run, vạch đỏ chỉ nhích một nấc: "Light with almost no heat!" | ngạc nhiên, buồn cười · nhịp chậm | Funny Comedy<br>rón rén, Db | **clarinet** (giai điệu) · dây pizzicato · bassoon trầm · gỗ (mõ, shaker) | 100 | hoa nở, whoosh mỏng, chatter, tíc tắc |
| 10,9–11,9 s<br>*Diễn biến* | Kính lùi ra khỏi đèn đuôi, Blink nháy mắt, Miss Loupe bật cười | dễ thương, ấm áp · nhịp chậm | Cute & Sweet<br>hộp nhạc lấp lánh, Ab | **vibraphone** (giai điệu) · glockenspiel · bass gảy · triangle + shaker | 96 | whoosh, nháy mắt |
| 11,9–12,8 s<br>*Diễn biến* | Kính "chụp" buồng sáng, máy lao xuyên kính, sticker hiện trên trang sổ | háo hức · nhịp khựng | Khựng · Happy Kids | **đàn hạc** (giai điệu) · marimba | — | chụp sticker, whoosh xuyên kính, whoosh lùi ra sổ, lật trang, whoosh mỏng |
| 12,8–15,8 s<br>*Diễn biến* | Sticker "Mix and make light!" dán vào sổ; Albie đếm chân: "Six legs? In you go!", Blink lao vào trang đúng chữ "go!" | vui, tự hào · nhịp vừa | Happy Kids<br>disco, Ab | **xylophone** (giai điệu) · dàn dây spiccato · bass gảy · disco (kick 4 phách, vỗ tay, hi-hat mở) | 116 | đếm "1 2 3" ×3, dán sticker, ding, zip vút, nhảy (boing + whoosh), +2 tiếng khác |
| 15,8–18,5 s<br>*Diễn biến* | Trang sổ lật về trại: "You're so bright, Blink!" – Blink ngượng, lấy chân che mặt | ấm áp, ngượng ngùng · nhịp chậm | Cute & Sweet<br>nửa nhịp đung đưa, Db | **sáo** (giai điệu) · đàn hạc · pizzicato trầm · chổi trống | 104 (cảm giác 52) | lật trang, đỏ mặt lấp lánh |
| 18,5–19,8 s<br>*Cao trào* | Blink chối "I'm not glowing!" – đúng lúc đuôi bùng chói cả trại, Miss Loupe nheo mắt che kính | phấn khích, buồn cười · nhịp cao trào | Epic Cartoon<br>disco, Ab | **trumpet** (giai điệu) · dàn dây spiccato · bass gảy · disco (kick 4 phách, vỗ tay, hi-hat mở) | 132 | blaze, "hử?" |
| 19,8–22,0 s<br>*Kết* | "What would YOU light up?" – chữ móc trở lại, Miss Loupe lại chìa tay hơ, vòng sáng mở về khung đầu | vui, mời gọi · nhịp vừa | Playful Cartoon<br>shuffle nhảy chân sáo, Ab | **glockenspiel** (giai điệu) · ukulele · bass gảy · đồ chơi (vỗ tay, shaker, phách gỗ) | 120 | dim, chữ móc trở lại, rub, chuyển cảnh ánh sáng |

## Vì sao chọn nhạc này

1. **0,0–2,4 s · Đêm lạnh: Miss Loupe quàng khăn hơ tay bên "lửa trại" Blink, băng mọc trên tay, cô giật nảy "BRRR!": "Could you glow without getting hot?"** (Funny Comedy, 120 BPM): Rón rén hài ở Fa thứ: marimba gõ nhanh "run cầm cập", bassoon trầm là cái lạnh, mõ hai cao độ gõ như răng va; nhạc chạy từ giây 0 dưới câu móc.
2. **2,4–3,9 s · Blink quay ra máy: "Watch this!" – đuôi bùng sáng rực cả trại, tay Miss Loupe vẫn đóng băng** (Suspense & Surprise, 120 BPM): Dừng nhịp: hai cú chặn của kèn trumpet và timpani rồi để trống cho tiếng bùng sáng; câu hỏi "vì sao sáng mà không nóng" còn bỏ ngỏ. *Vào cảnh:* trống dồn.
3. **3,9–5,0 s · Miss Loupe giơ kính: "Let's zoom in!"** (Bouncy Rhythm, 128 BPM): Điệu riêng của tập vào lần đầu: disco 128 BPM (kick bốn phách, hi-hat mở, dàn dây chặn) như một bữa tiệc que phát sáng; marimba đáp ngay sau câu cửa miệng. *Vào cảnh:* ngân đuôi, cảnh sau vào mềm.
4. **5,0–8,6 s · Kính lớn lao vào trong đèn đuôi: giọt vàng, bong bóng xanh, cánh quạt hồng gặp nhau, "pop!" thành ánh sáng: "Tiny bits mix together and make light!"** (Magical Adventure, 108 BPM): Phiêu lưu 108 BPM: trống tom nước kiệu như đi vào bên trong, đàn hạc rải; mỗi cú "pop" là một nốt glockenspiel viết tay đi lên, nhanh dần tới lúc bừng sáng. *Vào cảnh:* trống dồn.
5. **8,6–10,9 s · Buồng sáng bừng lên; nhiệt kế tí hon run run, vạch đỏ chỉ nhích một nấc: "Light with almost no heat!"** (Funny Comedy, 100 BPM): Rón rén 100 BPM sau cú bừng sáng: bassoon trầm làm bè, clarinet hỏi nhỏ; xylophone "tích" đúng nấc nhiệt kế nhích (viết tay). *Vào cảnh:* ngân đuôi, cảnh sau vào mềm.
6. **10,9–11,9 s · Kính lùi ra khỏi đèn đuôi, Blink nháy mắt, Miss Loupe bật cười** (Cute & Sweet, 96 BPM): Một hơi thở dễ thương: hộp nhạc lấp lánh 96 BPM, triangle, celesta ba nốt theo cái nháy mắt (viết tay). *Vào cảnh:* trống dồn.
7. **11,9–12,8 s · Kính "chụp" buồng sáng, máy lao xuyên kính, sticker hiện trên trang sổ** (Khựng · Happy Kids, — BPM): Marimba chạy lên (tiếng "chụp" của ban nhạc kênh), đàn hạc vuốt lên rồi xuống theo cú lao xuyên kính. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
8. **12,8–15,8 s · Sticker "Mix and make light!" dán vào sổ; Albie đếm chân: "Six legs? In you go!", Blink lao vào trang đúng chữ "go!"** (Happy Kids, 116 BPM): Disco 116 BPM: kick bốn phách, hi-hat mở, dàn dây chặn, xylophone đáp sau câu cửa miệng; dưới giọng trầm của Albie lớp nhịp tự bỏ bass. (11/2026 lượt 2: thay ukulele nắng + piano đồ chơi, công thức trùng ở 5 tập.) *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
9. **15,8–18,5 s · Trang sổ lật về trại: "You're so bright, Blink!" – Blink ngượng, lấy chân che mặt** (Cute & Sweet, 104 (cảm giác 52) BPM): Nửa nhịp đung đưa 104 BPM, đàn hạc và sáo mềm như lời khen; nhịp chậm lại để cú bùng chói sau đó bật ra. *Vào cảnh:* ngân đuôi, cảnh sau vào mềm.
10. **18,5–19,8 s · Blink chối "I'm not glowing!" – đúng lúc đuôi bùng chói cả trại, Miss Loupe nheo mắt che kính** (Epic Cartoon, 132 BPM): Cao trào hài: disco nhanh nhất tập 132 BPM, dàn dây spiccato chặn, bass quãng tám, timpani nhấn phách đầu; "ta-da" kèn trumpet ngay sau câu chối (viết tay), không đè lên chữ "glowing". *Vào cảnh:* trống dồn.
11. **19,8–22,0 s · "What would YOU light up?" – chữ móc trở lại, Miss Loupe lại chìa tay hơ, vòng sáng mở về khung đầu** (Playful Cartoon, 120 BPM): Shuffle ukulele 120 BPM; hợp âm Đô bảy ở cuối dẫn về Fa thứ của khung đầu nên vòng lặp liền; glockenspiel nhắc lại "tiếng của ánh sáng". *Vào cảnh:* ngân đuôi, cảnh sau vào mềm.

## Chuyển cảnh âm thanh

| Giây | Từ → sang | Cách chuyển | BPM |
|---|---|---|---|
| 2,4 | móc · run cầm cập → "Watch this!" · bùng sáng | trống dồn | 120 |
| 3,9 | "Watch this!" · bùng sáng → "Let's zoom in!" | ngân đuôi, cảnh sau vào mềm | 120 → 128 |
| 5,0 | "Let's zoom in!" → buồng sáng · trộn và "pop" | trống dồn | 128 → 108 |
| 8,6 | buồng sáng · trộn và "pop" → nhiệt kế · gần như không nóng | ngân đuôi, cảnh sau vào mềm | 108 → 100 |
| 10,9 | nhiệt kế · gần như không nóng → nhịp "ồ" · Blink nháy mắt | trống dồn | 100 → 96 |
| 11,9 | nhịp "ồ" · Blink nháy mắt → chụp → sổ | viết tay (stinger, khựng, nhạc hiệu) | 96 → 120 |
| 12,8 | chụp → sổ → sổ · disco que sáng | viết tay (stinger, khựng, nhạc hiệu) | 120 → 116 |
| 15,8 | sổ · disco que sáng → về trại · "You're so bright!" | ngân đuôi, cảnh sau vào mềm | 116 → 104 |
| 18,5 | về trại · "You're so bright!" → "I'm not glowing!" · bùng chói | trống dồn | 104 → 132 |
| 19,8 | "I'm not glowing!" · bùng chói → câu hỏi · về khung đầu | ngân đuôi, cảnh sau vào mềm | 132 → 120 |

## Chống trùng lặp

- 11 cảnh nhạc (10 cảnh có điệu, còn lại là khựng / nhạc hiệu viết tay).
- 8 phong cách nhạc: Funny Comedy ×2, Cute & Sweet ×2, Suspense & Surprise ×1, Bouncy Rhythm ×1, Magical Adventure ×1, Happy Kids ×1, Epic Cartoon ×1, Playful Cartoon ×1.
- 9 nhạc cụ hát chính: xylophone ×2, bassoon ×1, marimba ×1, celesta ×1, clarinet ×1, vibraphone ×1, sáo ×1, trumpet ×1, glockenspiel ×1.
- 11 họ nhạc cụ: bass, bộ gõ, chuông, dàn dây, dây pizzicato, kèn gỗ, kèn đồng, marimba, ukulele, xylophone, đàn hạc.
- BPM: 96, 100, 104, 108, 116, 120, 128, 132 (8 mức).
- Chuyển cảnh: trống dồn ×4, ngân đuôi, cảnh sau vào mềm ×4, viết tay (stinger, khựng, nhạc hiệu) ×2.
- Câu đáp của nhạc giữa các câu thoại: 4.

## Chống trùng lặp giữa các tập

So với 9 Short khác (001, 002, 003, 004, 005, 006, 007, 009, 010), từ `music-plan.json` của từng tập.

- **Điệu riêng của tập:** disco, chiếm 25 % thời lượng.
- **Công thức trùng với Short khác:** không có.
- **Cặp điệu + nhạc cụ hát chính đã có ở Short khác:** rón rén + bassoon (007); rón rén + clarinet (007); nửa nhịp đung đưa + sáo (001).
- **Vui nhộn:** hồi hộp + khựng 7 %, cảnh nền giọng thứ 11 % thời lượng (mỗi mục ≤ 20 %).

Các ngưỡng và kết quả kiểm: `python _shared/qa.py films/short-008` (nhóm "4 Âm thanh" và "Sound Design Plan").
