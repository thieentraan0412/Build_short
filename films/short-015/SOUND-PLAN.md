# SHORT-015 · Sound Design Plan

> Sinh tự động bằng `python _shared/tools/soundplan.py films/short-015` từ `out/music.json` (bảng cảnh nhạc khai báo trong `mix.py` bằng `G.sec` / `G.mark`) và `events.json`.
> Đừng sửa tay: sửa `what=`, `emo=`, `why=`, `mood=`, `arc=`, `bpm=`, `sfx=` trong `mix.py`, dựng lại rồi chạy lại công cụ. Quy tắc: [`QUALITY.md` §4](../../_shared/QUALITY.md#4-âm-thanh-và-nhạc-nền).

**Màu nhạc của tập:** "Leg-Violin Tango" (Rê giáng trưởng, tango habanera, vĩ cầm pizzicato của Hop). Chi tiết nhạc cụ, giọng và điểm nhấn viết tay: [`MUSIC.md`](MUSIC.md); bảng cue hình ↔ tiếng: [`SOUND.md`](SOUND.md).

## Cung bậc

- **Mở đầu** 0,0–3,6 s: Playful Cartoon, Bouncy Rhythm; 120–126 BPM; accordion, xylophone
- **Diễn biến** 3,6–12,6 s: Magical Adventure, Playful Cartoon; 108–112 BPM; dây pizzicato, glockenspiel, marimba
- **Cao trào** 12,6–15,5 s: Epic Cartoon; 132 BPM; dàn dây spiccato
- **Kết** 15,5–22,0 s: Funny Comedy, Happy Kids; 112–120 BPM; trombone, clarinet, sáo

## Bảng thiết kế âm thanh

| Thời gian | Nội dung cảnh | Cảm xúc | Phong cách nhạc | Nhạc cụ | BPM | SFX |
|---|---|---|---|---|---|---|
| 0,0–2,2 s<br>*Mở đầu* | Hop kéo đùi sau trên sân khấu gốc cây, "zzip!", nốt nhạc bật ra; Miss Loupe giật mình: "Could you sing with your legs?", ngó xuống chân mình | bất ngờ, tò mò · nhịp vừa | Playful Cartoon<br>tango, Db | **accordion** (giai điệu) · piano · contrabass · tango (bass marcato, chổi "kéo") | 120 | scrape ×7, boing + pop từng chữ ×2, pop chữ móc, pop nốt nhạc, giật mình, +2 tiếng khác |
| 2,2–3,6 s<br>*Mở đầu* | Hop kéo một tràng "zzip-zzip-zzip"; Miss Loupe nghiêng đầu "?", nhảy sang: "Let's zoom in!" | háo hức, tò mò · nhịp nhanh | Bouncy Rhythm<br>nảy lệch phách, Db | **xylophone** (giai điệu) · ukulele · bass gảy · bongo + shaker | 126 | scrape ×3, pop nốt nhạc ×2, hmm, hopL, landsoft |
| 3,6–6,6 s<br>*Diễn biến* | Kính lớn trên chân sau của Hop: đùi kéo lên xuống dọc mép cánh, mỗi lượt một "zzip": "Watch Hop's back leg!" | tò mò, chăm chú · nhịp vừa | Magical Adventure<br>tango, Db | **dây pizzicato** (giai điệu) · accordion · pizzicato trầm · tango (bass marcato, chổi "kéo") | 108 | scrape ×7, whoosh lao vào kính |
| 6,6–9,4 s<br>*Diễn biến* | Kính lao sâu vào mặt trong của đùi: "Look! A row of tiny pegs!", hàng gai sáng lần lượt | kỳ diệu, ngạc nhiên · nhịp vừa | Magical Adventure<br>rải lơ lửng, Db | **glockenspiel** (giai điệu) · đàn hạc · contrabass | 108 | scrape, deep, glintrun |
| 9,4–12,6 s<br>*Diễn biến* | Đùi hạ xuống mép cánh: mỗi gai vấp qua gờ là một tiếng tách và một nốt; "Each peg scrapes the wing!", kéo ngược lại | thích thú, từng bước · nhịp vừa | Playful Cartoon<br>hộp nhạc lấp lánh, Db | **marimba** (giai điệu) · dây pizzicato · bass gảy · gỗ (mõ, shaker) | 112 | tíc tắc ×10, touch |
| 12,6–15,5 s<br>*Cao trào* | Đùi kéo nhanh: các tiếng tách liền thành "zzzzip", nốt nhạc tuôn ra khỏi kính; "It's like a violin bow!", vĩ cầm kéo cùng nhịp | vỡ lẽ, phấn khích · nhịp cao trào | Epic Cartoon<br>tango, Db | **dàn dây spiccato** (giai điệu) · piano · contrabass · timpani + snare | 132 | scrape ×5, zzzip, notestream, deepout, violin |
| 15,5–17,9 s<br>*Kết* | Miss Loupe: "Let me try!", đứng một chân, nhắm mắt như nghệ sĩ, kéo chân dọc sườn | tự tin, buồn cười · nhịp vừa | Funny Comedy<br>ragtime piano, Db | **trombone** (giai điệu) · dàn dây spiccato · tuba · mõ hai cao độ | 112 | lensdown, step, nhấc chân, rubtry |
| 17,9–18,4 s<br>*Kết* | "squeak." bé tí; nhạc khựng, Hop chớp mắt | hụt hẫng buồn cười · nhịp khựng | Khựng · Funny Comedy | vibraphone | — | chít chít, blinkhop, tiếng cười |
| 18,4–20,0 s<br>*Kết* | Hop bật cười khúc khích; Miss Loupe đỏ mặt nhìn chân: "Oops! No pegs!", nhún vai | buồn cười, đáng yêu · nhịp vừa | Funny Comedy<br>polka, Db | **clarinet** (giai điệu) · ukulele · tuba · vỗ tay + lục lạc | 116 | nhún vai |
| 20,0–22,0 s<br>*Kết* | "Can YOU make music with your legs?" – chữ móc trở lại, Hop giơ chân sau và lại kéo, về đúng khung đầu | vui, mời gọi · nhịp vừa | Happy Kids<br>ukulele nắng, Db | **sáo** (giai điệu) · ukulele · bass gảy · đồ chơi (vỗ tay, shaker, phách gỗ) | 120 | scrape ×3, ready, chữ móc trở lại |

## Vì sao chọn nhạc này

1. **0,0–2,2 s · Hop kéo đùi sau trên sân khấu gốc cây, "zzip!", nốt nhạc bật ra; Miss Loupe giật mình: "Could you sing with your legs?", ngó xuống chân mình** (Playful Cartoon, 120 BPM): Điệu riêng của tập: tango 120 BPM (habanera, bốn phách marcato, chổi "kéo" vào phách 1) cho cây "vĩ cầm chân"; accordion như bandoneon, piano chặn marcato; mỗi lượt kéo to của Hop là một nốt pizzicato viết tay.
2. **2,2–3,6 s · Hop kéo một tràng "zzip-zzip-zzip"; Miss Loupe nghiêng đầu "?", nhảy sang: "Let's zoom in!"** (Bouncy Rhythm, 126 BPM): Nảy lệch phách 126 BPM, ukulele và bongo theo cú nhảy của Miss Loupe; xylophone đáp sau câu cửa miệng. *Vào cảnh:* trống dồn.
3. **3,6–6,6 s · Kính lớn trên chân sau của Hop: đùi kéo lên xuống dọc mép cánh, mỗi lượt một "zzip": "Watch Hop's back leg!"** (Magical Adventure, 108 BPM): Tango chậm 108 BPM: dây pizzicato hát như cây vĩ cầm tí hon của Hop, accordion đệm; nốt pizzicato viết tay theo từng lượt kéo. *Vào cảnh:* ngân đuôi, cảnh sau vào mềm.
4. **6,6–9,4 s · Kính lao sâu vào mặt trong của đùi: "Look! A row of tiny pegs!", hàng gai sáng lần lượt** (Magical Adventure, 108 BPM): Rải lơ lửng 108 BPM, đàn hạc rải và glockenspiel đáp như ánh đèn lấp lánh trên từng gai: một khoảnh khắc "ồ" nhẹ khi thấy hàng gai; năng lượng thấp để cú tách đầu tiên nghe rõ. *Vào cảnh:* dâng lấp lánh.
5. **9,4–12,6 s · Đùi hạ xuống mép cánh: mỗi gai vấp qua gờ là một tiếng tách và một nốt; "Each peg scrapes the wing!", kéo ngược lại** (Playful Cartoon, 112 BPM): Hộp nhạc lấp lánh 112 BPM, vui tươi (11/2026: không dùng điệu rón rén): mõ và shaker gõ đều như từng gai một; năm nốt pizzicato viết tay đi lên, rồi đi xuống nhỏ hơn dưới lời. *Vào cảnh:* ngân đuôi, cảnh sau vào mềm.
6. **12,6–15,5 s · Đùi kéo nhanh: các tiếng tách liền thành "zzzzip", nốt nhạc tuôn ra khỏi kính; "It's like a violin bow!", vĩ cầm kéo cùng nhịp** (Epic Cartoon, 132 BPM): Cao trào: tango nhanh 132 BPM, dàn dây spiccato là cây vĩ cầm thật, timpani nhấn phách đầu; tràng nốt pizzicato viết tay nối thành tiếng vuốt dây đi lên. *Vào cảnh:* riser + chũm chọe ngược.
7. **15,5–17,9 s · Miss Loupe: "Let me try!", đứng một chân, nhắm mắt như nghệ sĩ, kéo chân dọc sườn** (Funny Comedy, 112 BPM): Ragtime hài 112 BPM (11/2026: không dùng điệu dừng nhịp): dây chặn "oom-pah" như màn mở đầu long trọng mà vui; trombone ngân "ta-daa" giả nghiêm túc trước cú "squeak". *Vào cảnh:* ngân đuôi, cảnh sau vào mềm.
8. **17,9–18,4 s · "squeak." bé tí; nhạc khựng, Hop chớp mắt** (Khựng · Funny Comedy, — BPM): Khựng 0,55 s cho gag (chỉ còn vibraphone run run, không im hẳn) để tiếng "squeak" bé tí nghe rõ. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
9. **18,4–20,0 s · Hop bật cười khúc khích; Miss Loupe đỏ mặt nhìn chân: "Oops! No pegs!", nhún vai** (Funny Comedy, 116 BPM): Polka 116 BPM, tuba "oom-pah", clarinet đáp sau câu; kazoo "hi-hi" viết tay là tiếng cười của Hop, ngay trước câu của Miss Loupe. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
10. **20,0–22,0 s · "Can YOU make music with your legs?" – chữ móc trở lại, Hop giơ chân sau và lại kéo, về đúng khung đầu** (Happy Kids, 120 BPM): Ukulele nắng 120 BPM (lưới của phim, khớp lượt kéo của Hop ở cuối); hợp âm La giáng ở cuối dẫn về Rê giáng của khung đầu nên vòng lặp liền. *Vào cảnh:* nốt mồi của nhạc cụ mới.

## Chuyển cảnh âm thanh

| Giây | Từ → sang | Cách chuyển | BPM |
|---|---|---|---|
| 2,2 | móc · vĩ cầm chân → Hop kéo một tràng · "Let's zoom in!" | trống dồn | 120 → 126 |
| 3,6 | Hop kéo một tràng · "Let's zoom in!" → kính · chân sau kéo | ngân đuôi, cảnh sau vào mềm | 126 → 108 |
| 6,6 | kính · chân sau kéo → cận cảnh · hàng gai | dâng lấp lánh | 108 |
| 9,4 | cận cảnh · hàng gai → tách từng gai | ngân đuôi, cảnh sau vào mềm | 108 → 112 |
| 12,6 | tách từng gai → "Zzzzip!" · "It's like a violin bow!" | riser + chũm chọe ngược | 112 → 132 |
| 15,5 | "Zzzzip!" · "It's like a violin bow!" → gag · "Let me try!" | ngân đuôi, cảnh sau vào mềm | 132 → 112 |
| 17,9 | gag · "Let me try!" → "squeak." · khựng | viết tay (stinger, khựng, nhạc hiệu) | 112 → 120 |
| 18,4 | "squeak." · khựng → "Oops! No pegs!" | viết tay (stinger, khựng, nhạc hiệu) | 120 → 116 |
| 20,0 | "Oops! No pegs!" → câu hỏi · Hop lại kéo | nốt mồi của nhạc cụ mới | 116 → 120 |

## Chống trùng lặp

- 10 cảnh nhạc (9 cảnh có điệu, còn lại là khựng / nhạc hiệu viết tay).
- 6 phong cách nhạc: Playful Cartoon ×2, Magical Adventure ×2, Funny Comedy ×2, Bouncy Rhythm ×1, Epic Cartoon ×1, Happy Kids ×1.
- 9 nhạc cụ hát chính: accordion ×1, xylophone ×1, dây pizzicato ×1, glockenspiel ×1, marimba ×1, dàn dây spiccato ×1, trombone ×1, clarinet ×1, sáo ×1.
- 13 họ nhạc cụ: bass, bộ gõ, chuông, dàn dây, dây pizzicato, kèn gỗ, kèn đồng, marimba, nhạc cụ hoạt hình, piano, ukulele, xylophone, đàn hạc.
- BPM: 108, 112, 116, 120, 126, 132 (6 mức).
- Chuyển cảnh: ngân đuôi, cảnh sau vào mềm ×3, viết tay (stinger, khựng, nhạc hiệu) ×2, trống dồn ×1, dâng lấp lánh ×1, riser + chũm chọe ngược ×1, nốt mồi của nhạc cụ mới ×1.
- Câu đáp của nhạc giữa các câu thoại: 6.

## Chống trùng lặp giữa các tập

So với 14 Short khác (001, 002, 003, 004, 005, 006, 007, 008, 009, 010, 011, 012, 013, 014), từ `music-plan.json` của từng tập.

- **Điệu riêng của tập:** tango, chiếm 37 % thời lượng.
- **Công thức trùng với Short khác:** không có.
- **Cặp điệu + nhạc cụ hát chính đã có ở Short khác:** nảy lệch phách + xylophone (005); rải lơ lửng + glockenspiel (012); ragtime piano + trombone (010).
- **Vui nhộn:** hồi hộp + khựng 0 %, cảnh nền giọng thứ 0 % thời lượng (mỗi mục ≤ 20 %).

Các ngưỡng và kết quả kiểm: `python _shared/qa.py films/short-015` (nhóm "4 Âm thanh" và "Sound Design Plan").
