# LAB-MUSICAL · Sound Design Plan

> Sinh tự động bằng `python _shared/tools/soundplan.py films/lab-musical` từ `out/music.json` (bảng cảnh nhạc khai báo trong `mix.py` bằng `G.sec` / `G.mark`) và `events.json`.
> Đừng sửa tay: sửa `what=`, `emo=`, `why=`, `mood=`, `arc=`, `bpm=`, `sfx=` trong `mix.py`, dựng lại rồi chạy lại công cụ. Quy tắc: [`QUALITY.md` §4](../../_shared/QUALITY.md#4-âm-thanh-và-nhạc-nền).

**Màu nhạc của tập:** "Leg-Violin Tango" có lời hát (Rê giáng trưởng; điệp khúc "Pegs on the leg, scrape on the wing!"). Chi tiết nhạc cụ, giọng và điểm nhấn viết tay: [`MUSIC.md`](MUSIC.md); bảng cue hình ↔ tiếng: [`SOUND.md`](SOUND.md).

## Cung bậc

- **Mở đầu** 0,0–3,6 s: Playful Cartoon, Bouncy Rhythm; 120–126 BPM; accordion, xylophone
- **Diễn biến** 3,6–12,6 s: Magical Adventure, Happy Kids; 108–126 BPM; dây pizzicato, glockenspiel, xylophone
- **Cao trào** 12,6–15,5 s: Epic Cartoon; 132 BPM; dàn dây spiccato
- **Kết** 15,5–24,0 s: Funny Comedy, Happy Kids; 112–126 BPM; trombone, clarinet, xylophone, sáo

## Bảng thiết kế âm thanh

| Thời gian | Nội dung cảnh | Cảm xúc | Phong cách nhạc | Nhạc cụ | BPM | SFX |
|---|---|---|---|---|---|---|
| 0,0–2,6 s<br>*Mở đầu* | Hop kéo đùi sau, "zzip!", nốt nhạc bật ra; Miss Loupe giật mình, hát hỏi "Could you sing with your legs?" (half-sing), ngó chân mình | bất ngờ, tò mò · nhịp vừa | Playful Cartoon<br>tango, Db | **accordion** (giai điệu) · piano · contrabass · tango (bass marcato, chổi "kéo") | 120 | scrape ×10, pop nốt nhạc ×3, boing + pop từng chữ ×2, pop chữ móc, giật mình, +3 tiếng khác |
| 2,6–3,6 s<br>*Mở đầu* | Hop kéo một tràng "zzip-zzip-zzip"; Miss Loupe nghiêng đầu "?", nhảy sang: "Let's zoom in!" (nói) | háo hức, tò mò · nhịp nhanh | Bouncy Rhythm<br>nảy lệch phách, Db | **xylophone** (giai điệu) · ukulele · bass gảy · bongo + shaker | 126 | hopL, landsoft |
| 3,6–6,6 s<br>*Diễn biến* | Kính lớn trên chân sau, kính trượt dọc đùi: "Watch Hop's back leg!" (sing-talk) | tò mò, chăm chú · nhịp vừa | Magical Adventure<br>tango, Db | **dây pizzicato** (giai điệu) · accordion · pizzicato trầm · tango (bass marcato, chổi "kéo") | 108 | scrape ×7, whoosh lao vào kính, trượt |
| 6,6–9,4 s<br>*Diễn biến* | Lao sâu vào hàng gai, lia dọc hàng gai: "Look! A row of tiny pegs!" (half-sing) | kỳ diệu, ngạc nhiên · nhịp vừa | Magical Adventure<br>phiêu lưu nước kiệu, Db | **glockenspiel** (giai điệu) · celesta · đàn hạc · contrabass · triangle + shaker | 108 | scrape, deep, glintrun, pan |
| 9,4–12,6 s<br>*Diễn biến* | Mỗi gai một tiếng tách và một nốt; điệp khúc lần 1 "Pegs on the leg, scrape on the wing!" (hát trọn) | thích thú, hát theo · nhịp nhanh | Happy Kids<br>pop nảy, Db | **xylophone** (giai điệu) · ukulele · bass gảy · vỗ tay + lục lạc | 126 | tíc tắc ×10, touch, chorus |
| 12,6–15,5 s<br>*Cao trào* | "zzzzip!", nốt tuôn ra khỏi kính, motif "vĩ cầm chân" trên dàn dây; "It's like a violin bow!" (half-sing) | vỡ lẽ, phấn khích · nhịp cao trào | Epic Cartoon<br>tango, Db | **dàn dây spiccato** (giai điệu) · piano · contrabass · timpani + snare | 132 | scrape ×5, zzzip, notestream, deepout, violin |
| 15,5–17,9 s<br>*Kết* | Miss Loupe: "Let me try!" (nói), đứng một chân, kéo chân dọc sườn | tự tin, buồn cười · nhịp vừa | Funny Comedy<br>ragtime piano, Db | **trombone** (giai điệu) · dàn dây spiccato · tuba · mõ hai cao độ | 112 | lensdown, step, nhấc chân, rubtry |
| 17,9–18,4 s<br>*Kết* | "squeak." bé tí; nhạc khựng, Hop chớp mắt | hụt hẫng buồn cười · nhịp khựng | Khựng · Funny Comedy | vibraphone | — | chít chít, blinkhop, tiếng cười |
| 18,4–19,9 s<br>*Kết* | Hop bật cười; Miss Loupe: "Oops! No pegs!" (nói), nhún vai | buồn cười, đáng yêu · nhịp vừa | Funny Comedy<br>polka, Db | **clarinet** (giai điệu) · ukulele · tuba · vỗ tay + lục lạc | 116 | nhún vai |
| 19,9–22,1 s<br>*Kết* | Điệp khúc lần 2: Miss Loupe hát và nhún nhảy, Hop kéo "vĩ cầm" theo từng phách | vui, hát theo · nhịp nhanh | Happy Kids<br>pop nảy, Db | **xylophone** (giai điệu) · ukulele · bass gảy · vỗ tay + lục lạc | 126 | scrape ×4, pop nốt nhạc ×2, chorus |
| 22,1–24,0 s<br>*Kết* | "Can YOU make music with your legs?" (nói): chữ móc trở lại, Hop giơ chân sau và lại kéo, về đúng khung đầu | vui, mời gọi · nhịp vừa | Happy Kids<br>ukulele nắng, Db | **sáo** (giai điệu) · ukulele · bass gảy · đồ chơi (vỗ tay, shaker, phách gỗ) | 120 | scrape ×3, ready, chữ móc trở lại |

## Vì sao chọn nhạc này

1. **0,0–2,6 s · Hop kéo đùi sau, "zzip!", nốt nhạc bật ra; Miss Loupe giật mình, hát hỏi "Could you sing with your legs?" (half-sing), ngó chân mình** (Playful Cartoon, 120 BPM): Tango 120 BPM của "vĩ cầm chân"; piano chặn hợp âm đủ nhịp dưới câu hỏi nửa hát (song mode), accordion như bandoneon đáp trong khoảng trống.
2. **2,6–3,6 s · Hop kéo một tràng "zzip-zzip-zzip"; Miss Loupe nghiêng đầu "?", nhảy sang: "Let's zoom in!" (nói)** (Bouncy Rhythm, 126 BPM): Nảy lệch phách 126 BPM, ukulele và bongo theo cú nhảy; câu cửa miệng nói thường để tương phản với câu hát. *Vào cảnh:* trống dồn.
3. **3,6–6,6 s · Kính lớn trên chân sau, kính trượt dọc đùi: "Watch Hop's back leg!" (sing-talk)** (Magical Adventure, 108 BPM): Tango chậm 108 BPM: accordion giữ hợp âm của bài dưới câu sing-talk, dây pizzicato theo từng lượt kéo. *Vào cảnh:* ngân đuôi, cảnh sau vào mềm.
4. **6,6–9,4 s · Lao sâu vào hàng gai, lia dọc hàng gai: "Look! A row of tiny pegs!" (half-sing)** (Magical Adventure, 108 BPM): Phiêu lưu nhẹ 108 BPM: celesta giữ hợp âm dưới câu nửa hát (arp đàn hạc im dưới giọng, chỉ vang ở khoảng trống), triangle lấp lánh như đèn trên từng gai. *Vào cảnh:* dâng lấp lánh.
5. **9,4–12,6 s · Mỗi gai một tiếng tách và một nốt; điệp khúc lần 1 "Pegs on the leg, scrape on the wing!" (hát trọn)** (Happy Kids, 126 BPM): Pop nảy 126 BPM, ukulele quạt và vỗ tay để trẻ hát theo; xylophone đánh đôi giai điệu điệp khúc cao một quãng tám. *Vào cảnh:* trống dồn.
6. **12,6–15,5 s · "zzzzip!", nốt tuôn ra khỏi kính, motif "vĩ cầm chân" trên dàn dây; "It's like a violin bow!" (half-sing)** (Epic Cartoon, 132 BPM): Cao trào: tango nhanh 132 BPM, dàn dây spiccato chơi motif của tập (câu mở của điệp khúc), timpani nhấn phách đầu. *Vào cảnh:* riser + chũm chọe ngược.
7. **15,5–17,9 s · Miss Loupe: "Let me try!" (nói), đứng một chân, kéo chân dọc sườn** (Funny Comedy, 112 BPM): Ragtime hài 112 BPM; trombone ngân "ta-daa" giả nghiêm túc trước cú "squeak". *Vào cảnh:* ngân đuôi, cảnh sau vào mềm.
8. **17,9–18,4 s · "squeak." bé tí; nhạc khựng, Hop chớp mắt** (Khựng · Funny Comedy, — BPM): Khựng 0,55 s cho gag (chỉ còn vibraphone run run, không im hẳn). *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
9. **18,4–19,9 s · Hop bật cười; Miss Loupe: "Oops! No pegs!" (nói), nhún vai** (Funny Comedy, 116 BPM): Polka 116 BPM, tuba "oom-pah"; kazoo "hi-hi" viết tay là tiếng cười của Hop. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
10. **19,9–22,1 s · Điệp khúc lần 2: Miss Loupe hát và nhún nhảy, Hop kéo "vĩ cầm" theo từng phách** (Happy Kids, 126 BPM): Nhắc lại đúng nhạc của điệp khúc lần 1 (reprise) để trẻ nhận ra và hát theo; vỗ tay ở phách 2 và 4. *Vào cảnh:* nốt mồi của nhạc cụ mới.
11. **22,1–24,0 s · "Can YOU make music with your legs?" (nói): chữ móc trở lại, Hop giơ chân sau và lại kéo, về đúng khung đầu** (Happy Kids, 120 BPM): Ukulele nắng 120 BPM (lưới của phim, khớp lượt kéo của Hop ở cuối); hợp âm La giáng dẫn về Rê giáng của khung đầu. *Vào cảnh:* ngân đuôi, cảnh sau vào mềm.

## Chuyển cảnh âm thanh

| Giây | Từ → sang | Cách chuyển | BPM |
|---|---|---|---|
| 2,6 | móc · vĩ cầm chân → Hop kéo một tràng · "Let's zoom in!" | trống dồn | 120 → 126 |
| 3,6 | Hop kéo một tràng · "Let's zoom in!" → kính · chân sau kéo | ngân đuôi, cảnh sau vào mềm | 126 → 108 |
| 6,6 | kính · chân sau kéo → cận cảnh · hàng gai | dâng lấp lánh | 108 |
| 9,4 | cận cảnh · hàng gai → tách từng gai · điệp khúc | trống dồn | 108 → 126 |
| 12,6 | tách từng gai · điệp khúc → "Zzzzip!" · "It's like a violin bow!" | riser + chũm chọe ngược | 126 → 132 |
| 15,5 | "Zzzzip!" · "It's like a violin bow!" → gag · "Let me try!" | ngân đuôi, cảnh sau vào mềm | 132 → 112 |
| 17,9 | gag · "Let me try!" → "squeak." · khựng | viết tay (stinger, khựng, nhạc hiệu) | 112 → 120 |
| 18,4 | "squeak." · khựng → "Oops! No pegs!" | viết tay (stinger, khựng, nhạc hiệu) | 120 → 116 |
| 19,9 | "Oops! No pegs!" → điệp khúc lần 2 | nốt mồi của nhạc cụ mới | 116 → 126 |
| 22,1 | điệp khúc lần 2 → CTA · Hop lại kéo | ngân đuôi, cảnh sau vào mềm | 126 → 120 |

## Chống trùng lặp

- 11 cảnh nhạc (10 cảnh có điệu, còn lại là khựng / nhạc hiệu viết tay).
- 6 phong cách nhạc: Happy Kids ×3, Magical Adventure ×2, Funny Comedy ×2, Playful Cartoon ×1, Bouncy Rhythm ×1, Epic Cartoon ×1.
- 8 nhạc cụ hát chính: xylophone ×3, accordion ×1, dây pizzicato ×1, glockenspiel ×1, dàn dây spiccato ×1, trombone ×1, clarinet ×1, sáo ×1.
- 12 họ nhạc cụ: bass, bộ gõ, chuông, dàn dây, dây pizzicato, kèn gỗ, kèn đồng, nhạc cụ hoạt hình, piano, ukulele, xylophone, đàn hạc.
- BPM: 108, 112, 116, 120, 126, 132 (6 mức).
- Chuyển cảnh: ngân đuôi, cảnh sau vào mềm ×3, trống dồn ×2, viết tay (stinger, khựng, nhạc hiệu) ×2, dâng lấp lánh ×1, riser + chũm chọe ngược ×1, nốt mồi của nhạc cụ mới ×1.
- Câu đáp của nhạc giữa các câu thoại: 5.

## Music Timeline

> Task.md mục 8B. Cột Vocal Style lấy từ kiểu hát của từng câu (`sing.mode` trong `timeline.js`); SFX từ `events.json`.

| Thời gian | Cảnh | Background Music | Vocal Style | SFX |
|---|---|---|---|---|
| 0,0–2,6 s | Hop kéo đùi sau, "zzip!", nốt nhạc bật ra; Miss Loupe giật mình, hát hỏi "Could you sing with your legs?" (half-sing), ngó chân mình | Playful Cartoon: tango, Db, 120 BPM, giai điệu accordion · theo bài hát | L01 loupe: half-sing (nửa hát) | scrape ×10, pop nốt nhạc ×3, boing + pop từng chữ ×2, pop chữ móc, giật mình, +3 tiếng khác |
| 2,6–3,6 s | Hop kéo một tràng "zzip-zzip-zzip"; Miss Loupe nghiêng đầu "?", nhảy sang: "Let's zoom in!" (nói) | Bouncy Rhythm: nảy lệch phách, Db, 126 BPM, giai điệu xylophone | L02 loupe: nói | hopL, landsoft |
| 3,6–6,6 s | Kính lớn trên chân sau, kính trượt dọc đùi: "Watch Hop's back leg!" (sing-talk) | Magical Adventure: tango, Db, 108 BPM, giai điệu dây pizzicato · theo bài hát | L02 loupe: nói<br>L03 loupe: sing-talk (nói theo nhịp) | scrape ×7, whoosh lao vào kính, trượt |
| 6,6–9,4 s | Lao sâu vào hàng gai, lia dọc hàng gai: "Look! A row of tiny pegs!" (half-sing) | Magical Adventure: phiêu lưu nước kiệu, Db, 108 BPM, giai điệu glockenspiel · theo bài hát | L04 loupe: half-sing (nửa hát) | scrape, deep, glintrun, pan |
| 9,4–12,6 s | Mỗi gai một tiếng tách và một nốt; điệp khúc lần 1 "Pegs on the leg, scrape on the wing!" (hát trọn) | Happy Kids: pop nảy, Db, 126 BPM, giai điệu xylophone · theo bài hát | L05 loupe: hát trọn · điệp khúc 'pegs' | tíc tắc ×10, touch, chorus |
| 12,6–15,5 s | "zzzzip!", nốt tuôn ra khỏi kính, motif "vĩ cầm chân" trên dàn dây; "It's like a violin bow!" (half-sing) | Epic Cartoon: tango, Db, 132 BPM, giai điệu dàn dây spiccato · theo bài hát | L05 loupe: hát trọn · điệp khúc 'pegs'<br>L06 loupe: half-sing (nửa hát) | scrape ×5, zzzip, notestream, deepout, violin |
| 15,5–17,9 s | Miss Loupe: "Let me try!" (nói), đứng một chân, kéo chân dọc sườn | Funny Comedy: ragtime piano, Db, 112 BPM, giai điệu trombone | L07 loupe: nói | lensdown, step, nhấc chân, rubtry |
| 17,9–18,4 s | "squeak." bé tí; nhạc khựng, Hop chớp mắt | Khựng · Funny Comedy | L08 loupe: nói | chít chít, blinkhop, tiếng cười |
| 18,4–19,9 s | Hop bật cười; Miss Loupe: "Oops! No pegs!" (nói), nhún vai | Funny Comedy: polka, Db, 116 BPM, giai điệu clarinet | L08 loupe: nói | nhún vai |
| 19,9–22,1 s | Điệp khúc lần 2: Miss Loupe hát và nhún nhảy, Hop kéo "vĩ cầm" theo từng phách | Happy Kids: pop nảy, Db, 126 BPM, giai điệu xylophone · theo bài hát | L10 loupe: hát trọn · điệp khúc 'pegs' | scrape ×4, pop nốt nhạc ×2, chorus |
| 22,1–24,0 s | "Can YOU make music with your legs?" (nói): chữ móc trở lại, Hop giơ chân sau và lại kéo, về đúng khung đầu | Happy Kids: ukulele nắng, Db, 120 BPM, giai điệu sáo | L09 loupe: nói | scrape ×3, ready, chữ móc trở lại |

## Sing-along Dialogue

> Task.md mục 8C. Nốt do `_shared/song.js` giải từ `sing.notes`; giọng hát do `_shared/sing.py` làm từ chính giọng TTS của nhân vật.

| Câu | Ai | Lời | Kiểu | Giai điệu (nốt · giây) | Điệp khúc | Nhấn |
|---|---|---|---|---|---|---|
| L01 (0,4 s) | loupe | Could you sing with your legs? | half-sing (nửa hát) | Ab3·0.25 Ab3·0.25 F3·0.25 Ab3·0.25 Bb3·0.25 Db4·0.50 |  | sing, legs |
| L02 (2,8 s) | loupe | Let's zoom in! | nói | — |  | zoom |
| L03 (4,0 s) | loupe | Watch Hop's back leg! | sing-talk (nói theo nhịp) | Ab3·0.28 Ab3·0.28 Bb3·0.28 Ab3·0.56 |  | leg |
| L04 (6,8 s) | loupe | Look! A row of tiny pegs! | half-sing (nửa hát) | Ab3·0.28 F3·0.28 F3·0.28 Ab3·0.28 Bb3·0.28 Ab3·0.28 Bb3·0.56 |  | pegs |
| L05 (10,7 s) | loupe | Pegs on the leg, scrape on the wing! | hát trọn | F3·0.24 F3·0.12 Ab3·0.12 Bb3·0.48 Ab3·0.24 F3·0.12 Ab3·0.12 Db4·0.36 | pegs | pegs, leg, wing |
| L06 (13,6 s) | loupe | It's like a violin bow! | half-sing (nửa hát) | Ab3·0.23 Ab3·0.23 Ab3·0.23 Bb3·0.23 Ab3·0.23 F3·0.23 Ab3·0.23 |  | violin, bow |
| L07 (16,1 s) | loupe | Let me try! | nói | — |  | try |
| L08 (18,4 s) | loupe | Oops! No pegs! | nói | — |  | pegs |
| L10 (19,9 s) | loupe | Pegs on the leg, scrape on the wing! | hát trọn | F3·0.24 F3·0.12 Ab3·0.12 Bb3·0.48 Ab3·0.24 F3·0.12 Ab3·0.12 Db4·0.36 | pegs | pegs, leg, wing |
| L09 (22,1 s) | loupe | Can YOU make music with your legs? | nói | — |  | you, legs |

Lời có nhịp hoặc giai điệu: **70%** số từ (37/53); nói tự nhiên 30%.

## Sound Effects Timeline

> Task.md mục 8E. Chuỗi nhịp có chủ đích ghi `run` trong `events.json` (qa: không tính là lặp máy móc).

| Giây | Tiếng | Chuỗi |
|---|---|---|
| 0,0 | pop chữ móc |  |
| 0,0 | boing + pop từng chữ |  |
| 0,1 | scrape | hook |
| 0,1 | giật mình |  |
| 0,1 | pop nốt nhạc | hook |
| 0,1 | boing + pop từng chữ |  |
| 0,3 | scrape | hook |
| 0,5 | landsoft |  |
| 0,6 | scrape | hook |
| 0,9 | scrape | hook |
| 1,2 | scrape | hook |
| 1,2 | wiggle |  |
| 1,6 | scrape | hook |
| 1,9 | scrape | hook |
| 2,2 | scrape | hook |
| 2,2 | pop nốt nhạc | hook |
| 2,2 | hmm |  |
| 2,3 | scrape | hook |
| 2,5 | scrape | hook |
| 2,5 | pop nốt nhạc | hook |
| 2,9 | hopL |  |
| 3,4 | landsoft |  |
| 3,6 | whoosh lao vào kính |  |
| 3,9 | scrape | lens |
| 4,3 | scrape | lens |
| 4,7 | scrape | lens |
| 5,1 | scrape | lens |
| 5,5 | trượt |  |
| 5,5 | scrape | lens |
| 5,9 | scrape | lens |
| 6,3 | scrape | lens |
| 6,6 | deep |  |
| 6,7 | scrape | lens |
| 7,5 | glintrun |  |
| 8,1 | pan |  |
| 9,4 | touch |  |
| 9,6 | tíc tắc | ticks |
| 9,8 | tíc tắc | ticks |
| 10,1 | tíc tắc | ticks |
| 10,3 | tíc tắc | ticks |
| 10,6 | tíc tắc | ticks |
| 10,8 | chorus |  |
| 10,9 | tíc tắc | ticks |
| 11,3 | tíc tắc | ticks |
| 11,7 | tíc tắc | ticks |
| 12,0 | tíc tắc | ticks |
| 12,3 | tíc tắc | ticks |
| 12,6 | zzzip |  |
| 13,0 | notestream |  |
| 13,3 | deepout |  |
| 13,6 | scrape | lens2 |
| 13,8 | violin |  |
| 14,0 | scrape | lens2 |
| 14,4 | scrape | lens2 |
| 14,9 | scrape | lens2 |
| 15,3 | scrape | lens2 |
| 15,5 | lensdown |  |
| 16,1 | step |  |
| 16,6 | nhấc chân |  |
| 17,3 | rubtry |  |
| 17,9 | chít chít |  |
| 18,1 | blinkhop |  |
| 18,3 | tiếng cười |  |
| 19,4 | nhún vai |  |
| 19,9 | chorus |  |
| 20,0 | scrape | reprise |
| 20,1 | pop nốt nhạc | reprise |
| 20,5 | scrape | reprise |
| 21,0 | scrape | reprise |
| 21,5 | scrape | reprise |
| 22,0 | pop nốt nhạc | reprise |
| 22,9 | ready |  |
| 22,9 | chữ móc trở lại |  |
| 23,4 | scrape | hook-loop |
| 23,6 | scrape | hook-loop |
| 23,8 | scrape | hook-loop |

## AI Music Generation Prompts

> Task.md mục 8D. Prompt tiếng Anh cho từng đoạn nhạc, sinh từ đúng thông số của cảnh (phong cách, BPM, giọng, nhạc cụ, năng lượng, cách chuyển).
> Chỉ để tham khảo hoặc làm bản nháp ngoài: nhạc trong phim vẫn tổng hợp bằng code (`groove.py`), giọng hát vẫn là giọng nhân vật.

**0,0–2,6 s · Hop kéo đùi sau, "zzip!", nốt nhạc bật ra; Miss Loupe giật mình, hát hỏi "Could you sing with your legs?" (half-sing), ngó chân mình**

```
Genre: Playful Cartoon kids' music, cartoon tango. Mood: cheerful, medium energy, major key (Db). BPM: 120.
Instruments: accordion, piano, upright bass, brush drags and marcato bass. Vocal style: Miss Loupe (cheerful woman, clear) half-sung: "Could you sing with your legs?".
Melody: lead accordion answers in the gaps between lines; backing follows the vocal melody's chords, Db Ab7. Voice stays on top: music ducks under every word.
Energy changes: steady; accent the first beat. Ending: hand over to the next scene with a drum fill. Length: 2.6 s.
```

**2,6–3,6 s · Hop kéo một tràng "zzip-zzip-zzip"; Miss Loupe nghiêng đầu "?", nhảy sang: "Let's zoom in!" (nói)**

```
Genre: Bouncy Rhythm kids' music, hopping off-beat groove. Mood: cheerful, medium energy, major key (Db). BPM: 126.
Instruments: xylophone, ukulele, plucked bass, bongos and shaker. Vocal style: Miss Loupe (cheerful woman, clear) spoken: "Let's zoom in!".
Melody: lead xylophone answers in the gaps between lines. Voice stays on top: music ducks under every word.
Energy changes: steady; accent the first beat. Ending: hand over to the next scene with a soft tail. Length: 1.0 s.
```

**3,6–6,6 s · Kính lớn trên chân sau, kính trượt dọc đùi: "Watch Hop's back leg!" (sing-talk)**

```
Genre: Magical Adventure kids' music, cartoon tango. Mood: cheerful, medium energy, major key (Db). BPM: 108.
Instruments: pizzicato strings, accordion, low pizzicato, brush drags and marcato bass. Vocal style: Miss Loupe (cheerful woman, clear) spoken: "Let's zoom in!"; Miss Loupe (cheerful woman, clear) rhythmic sing-talk: "Watch Hop's back leg!".
Melody: lead pizzicato strings answers in the gaps between lines; backing follows the vocal melody's chords, Gb Db. Voice stays on top: music ducks under every word.
Energy changes: builds; accent the first beat. Ending: hand over to the next scene with a sparkle swell. Length: 3.0 s.
```

**6,6–9,4 s · Lao sâu vào hàng gai, lia dọc hàng gai: "Look! A row of tiny pegs!" (half-sing)**

```
Genre: Magical Adventure kids' music, adventure quest. Mood: cheerful, medium energy, major key (Db). BPM: 108.
Instruments: glockenspiel, celesta, harp, upright bass, triangle and shaker. Vocal style: Miss Loupe (cheerful woman, clear) half-sung: "Look! A row of tiny pegs!".
Melody: lead glockenspiel answers in the gaps between lines; backing follows the vocal melody's chords, Db Gb. Voice stays on top: music ducks under every word.
Energy changes: builds; accent the first beat. Ending: hand over to the next scene with a drum fill. Length: 2.8 s.
```

**9,4–12,6 s · Mỗi gai một tiếng tách và một nốt; điệp khúc lần 1 "Pegs on the leg, scrape on the wing!" (hát trọn)**

```
Genre: Happy Kids kids' music, bouncy two-step. Mood: cheerful, high energy, major key (Db). BPM: 126.
Instruments: xylophone, ukulele, plucked bass, hand claps and tambourine. Vocal style: Miss Loupe (cheerful woman, clear) fully sung: "Pegs on the leg, scrape on the wing!".
Melody: lead xylophone answers in the gaps between lines; backing follows the vocal melody's chords, Db Gb Ab7 Db. Voice stays on top: music ducks under every word.
Energy changes: builds; accent the first beat. Ending: hand over to the next scene with a riser with reverse cymbal. Length: 3.2 s.
```

**12,6–15,5 s · "zzzzip!", nốt tuôn ra khỏi kính, motif "vĩ cầm chân" trên dàn dây; "It's like a violin bow!" (half-sing)**

```
Genre: Epic Cartoon kids' music, cartoon tango. Mood: cheerful, high energy, major key (Db). BPM: 132.
Instruments: spiccato strings, piano, upright bass, timpani and snare. Vocal style: Miss Loupe (cheerful woman, clear) fully sung: "Pegs on the leg, scrape on the wing!"; Miss Loupe (cheerful woman, clear) half-sung: "It's like a violin bow!".
Melody: lead spiccato strings answers in the gaps between lines; backing follows the vocal melody's chords, Db Gb Ab Db. Voice stays on top: music ducks under every word.
Energy changes: builds; accent the first beat. Ending: hand over to the next scene with a soft tail. Length: 2.9 s.
```

**15,5–17,9 s · Miss Loupe: "Let me try!" (nói), đứng một chân, kéo chân dọc sườn**

```
Genre: Funny Comedy kids' music, stride piano. Mood: cheerful, medium energy, major key (Db). BPM: 112.
Instruments: trombone, spiccato strings, tuba, two-tone wood blocks. Vocal style: Miss Loupe (cheerful woman, clear) spoken: "Let me try!".
Melody: lead trombone answers in the gaps between lines. Voice stays on top: music ducks under every word.
Energy changes: steady; accent the first beat. Ending: hand over to the next scene with a hand-written stinger. Length: 2.4 s.
```

**17,9–18,4 s · "squeak." bé tí; nhạc khựng, Hop chớp mắt**

```
Genre: comic stop. Mood: cheerful, low energy, major key (Db). BPM: —.
Instruments: vibraphone. Vocal style: Miss Loupe (cheerful woman, clear) spoken: "Oops! No pegs!".
Melody: no lead melody, light accompaniment. Voice stays on top: music ducks under every word.
Energy changes: steady; accent the first beat. Ending: hold a thin vibraphone shimmer, then resume. Length: 0.6 s.
```

**18,4–19,9 s · Hop bật cười; Miss Loupe: "Oops! No pegs!" (nói), nhún vai**

```
Genre: Funny Comedy kids' music, polka. Mood: cheerful, medium energy, major key (Db). BPM: 116.
Instruments: clarinet, ukulele, tuba, hand claps and tambourine. Vocal style: Miss Loupe (cheerful woman, clear) spoken: "Oops! No pegs!".
Melody: lead clarinet answers in the gaps between lines. Voice stays on top: music ducks under every word.
Energy changes: steady; accent the first beat. Ending: hand over to the next scene with pickup notes of the next instrument. Length: 1.4 s.
```

**19,9–22,1 s · Điệp khúc lần 2: Miss Loupe hát và nhún nhảy, Hop kéo "vĩ cầm" theo từng phách**

```
Genre: Happy Kids kids' music, bouncy two-step. Mood: cheerful, high energy, major key (Db). BPM: 126.
Instruments: xylophone, ukulele, plucked bass, hand claps and tambourine. Vocal style: Miss Loupe (cheerful woman, clear) fully sung: "Pegs on the leg, scrape on the wing!".
Melody: lead xylophone answers in the gaps between lines; backing follows the vocal melody's chords, Db Gb Ab7 Db. Voice stays on top: music ducks under every word.
Energy changes: steady; accent the first beat. Ending: hand over to the next scene with a soft tail. Length: 2.2 s.
```

**22,1–24,0 s · "Can YOU make music with your legs?" (nói): chữ móc trở lại, Hop giơ chân sau và lại kéo, về đúng khung đầu**

```
Genre: Happy Kids kids' music, sunny ukulele pop. Mood: cheerful, medium energy, major key (Db). BPM: 120.
Instruments: flute, ukulele, plucked bass, hand claps, shaker and wood blocks. Vocal style: Miss Loupe (cheerful woman, clear) spoken: "Can YOU make music with your legs?".
Melody: lead flute answers in the gaps between lines. Voice stays on top: music ducks under every word.
Energy changes: steady; accent the first beat. Ending: end on the tonic chord so the loop returns to the first frame. Length: 1.9 s.
```

## Final Audio Checklist

> Task.md mục 8F: điền tay khi nghe lại cả phim.

- [ ] Nhạc có sinh động không? · [ ] Có thay đổi theo cảnh không? · [ ] Lời thoại có giai điệu không?
- [ ] Có đoạn nhạc dễ nhớ (điệp khúc, motif) không? · [ ] Giọng hát có rõ không? · [ ] Nhạc nền có lấn át giọng không?
- [ ] SFX có khớp hành động không? · [ ] Âm nhạc có tạo cảm xúc và giữ chân người xem không?

## Chống trùng lặp giữa các tập

So với 15 Short khác (001, 002, 003, 004, 005, 006, 007, 008, 009, 010, 011, 012, 013, 014, 015), từ `music-plan.json` của từng tập.

- **Điệu riêng của tập:** chưa có (ghi vào `SIGNATURE` trong groove.py), chiếm 0 % thời lượng; mượn điệu riêng của tập khác: tango (short-015), tango (short-015), tango (short-015).
- **Công thức trùng với Short khác:** 0,0 s tango + accordion + piano + tango (bass marcato, chổi "kéo") = short-015 0,0 s; 2,6 s nảy lệch phách + xylophone + ukulele + bongo + shaker = short-015 2,2 s; 3,6 s tango + dây pizzicato + accordion + tango (bass marcato, chổi "kéo") = short-015 3,6 s; 12,6 s tango + dàn dây spiccato + piano + timpani + snare = short-015 12,6 s; 15,5 s ragtime piano + trombone + dàn dây spiccato + mõ hai cao độ = short-015 15,5 s; 18,4 s polka + clarinet + ukulele + vỗ tay + lục lạc = short-015 18,4 s; 22,1 s ukulele nắng + sáo + ukulele + đồ chơi (vỗ tay, shaker, phách gỗ) = short-015 20,0 s.
- **Cặp điệu + nhạc cụ hát chính đã có ở Short khác:** tango + accordion (015); nảy lệch phách + xylophone (005, 015); tango + dây pizzicato (015); phiêu lưu nước kiệu + glockenspiel (004, 010); pop nảy + xylophone (009); tango + dàn dây spiccato (015); ragtime piano + trombone (010, 013, 015); polka + clarinet (015); ukulele nắng + sáo (015) (quá quen, ≥ 3 tập: 1).
- **Vui nhộn:** hồi hộp + khựng 0 %, cảnh nền giọng thứ 0 % thời lượng (mỗi mục ≤ 20 %).

Các ngưỡng và kết quả kiểm: `python _shared/qa.py films/lab-musical` (nhóm "4 Âm thanh" và "Sound Design Plan").
