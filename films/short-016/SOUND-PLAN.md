# SHORT-016 · Sound Design Plan

> Sinh tự động bằng `python _shared/tools/soundplan.py films/short-016` từ `out/music.json` (bảng cảnh nhạc khai báo trong `mix.py` bằng `G.sec` / `G.mark`) và `events.json`.
> Đừng sửa tay: sửa `what=`, `emo=`, `why=`, `mood=`, `arc=`, `bpm=`, `sfx=` trong `mix.py`, dựng lại rồi chạy lại công cụ. Quy tắc: [`QUALITY.md` §4](../../_shared/QUALITY.md#4-âm-thanh-và-nhạc-nền).

**Màu nhạc của tập:** "Snowy Sleigh Song" có lời hát (Đô trưởng; xe trượt tuyết: chuông xủng xẻng, vó ngựa lộc cộc; điệp khúc "Huddle, fly away, or hide!"). Chi tiết nhạc cụ, giọng và điểm nhấn viết tay: [`MUSIC.md`](MUSIC.md); bảng cue hình ↔ tiếng: [`SOUND.md`](SOUND.md).

## Cung bậc

- **Mở đầu** 0,0–3,8 s: Playful Cartoon; 120 BPM; glockenspiel
- **Diễn biến** 3,8–38,2 s: Magical Adventure, Bouncy Rhythm, Funny Comedy, Happy Kids, Cute & Sweet, Playful Cartoon; 112–128 BPM; vibraphone, marimba, xylophone, sáo, đàn hạc, dây pizzicato, chuông
- **Cao trào** 18,4–21,0 s: Epic Cartoon; 126 BPM; dàn dây spiccato
- **Kết** 38,2–48,0 s: Funny Comedy, Happy Kids; 116–124 BPM; kazoo, clarinet, xylophone, trống thép

## Bảng thiết kế âm thanh

| Thời gian | Nội dung cảnh | Cảm xúc | Phong cách nhạc | Nhạc cụ | BPM | SFX |
|---|---|---|---|---|---|---|
| 0,0–3,0 s<br>*Mở đầu* | Bông tuyết đậu trúng kính, Miss Loupe rùng mình "brrr", hát hỏi "Where do bugs go when it snows?" (half-sing); vườn vắng tanh | bất ngờ, tò mò · nhịp vừa | Playful Cartoon<br>xe trượt tuyết, C | **glockenspiel** (giai điệu) · ukulele · celesta · bass gảy | 120 | boing + pop từng chữ ×2, whoosh ×2, pop chữ móc, giọt nước, brrr, +3 tiếng khác |
| 3,0–3,8 s<br>*Mở đầu* | Máy lao vào mặt kính, logo bật lên | háo hức · nhịp bừng lên | Nhạc hiệu kênh | **marimba** (giai điệu) · kèn đồ chơi · chuông | 120 | whoosh lao vào kính, logo lấp lánh, logopop, stingout |
| 3,8–7,0 s<br>*Diễn biến* | "Let's zoom in!" (hát): tổ ong phủ tuyết; vặn vành kính, cả mặt kính đổi màu nhiệt: quả bóng ong rực cam; "Look! A warm ball of bees!" (half-sing) | tò mò, kỳ diệu · nhịp vừa | Magical Adventure<br>rải lơ lửng, C | **vibraphone** (giai điệu) · đàn hạc · contrabass · triangle + shaker | 112 | twist, warmup, textpop, hum |
| 7,0–12,4 s<br>*Diễn biến* | Lao sâu vào quả bóng ong: Waggle rung ngực theo từng phách; "Heater bees shake their wing muscles!" (sing-talk) | thích thú · nhịp vừa | Bouncy Rhythm<br>shuffle nhảy chân sáo, C | **marimba** (giai điệu) · piano (cao) · piano (cao) · bass vo ve · gỗ (mõ, shaker) | 112 | buzzshake ×9, lao sâu vào kính, beebuzz, textpop, chụp sticker, +1 tiếng khác |
| 12,4–15,4 s<br>*Diễn biến* | Kính thu về sân khấu; Albie: "Do all butterflies stay?" (nói); "Nope!" (sing-talk, giai điệu cố định của kênh), dấu X | buồn cười, bất ngờ · nhịp nhanh | Funny Comedy<br>nảy lệch phách, C | **xylophone** (giai điệu) · ukulele · bass gảy · mõ hai cao độ | 126 | sticker vào ô, kính hạ xuống, albiehop, "NOPE!" bất ngờ |
| 15,4–18,4 s<br>*Diễn biến* | Albie mở trang bản đồ; đàn bướm vua bay theo đường chấm từ miền đông Bắc Mỹ xuống Mexico; "These monarchs fly all the way to Mexico!" (half-sing) | phiêu lưu, háo hức · nhịp nhanh | Magical Adventure<br>phiêu lưu nước kiệu, C | **sáo** (giai điệu) · dàn dây spiccato · đàn hạc · pizzicato trầm · bongo + shaker | 126 | cánh bướm vỗ ×5, textpop ×2, pageopen, gust, sign, +1 tiếng khác |
| 18,4–21,0 s<br>*Cao trào* | Tới Mexico: cả cánh rừng linh sam hoá cam vì hàng triệu bướm bám kín cành; chụp, sticker 2 bay lên ô | choáng ngợp, vui · nhịp cao trào | Epic Cartoon<br>cao trào anh hùng, C | **dàn dây spiccato** (giai điệu) · piano · tuba · timpani + snare | 126 | cánh bướm vỗ ×2, trees, textpop, chụp sticker, whoosh mỏng, +2 tiếng khác |
| 21,0–24,0 s<br>*Diễn biến* | Về vườn tuyết: Miss Loupe và Albie nhún nhảy; "Huddle, fly away, or hide!" (hát trọn), ô 1, 2 nảy theo lời, ô 3 còn "?" | vui, hát theo · nhịp nhanh | Happy Kids<br>xe trượt tuyết, C | **xylophone** (giai điệu) · ukulele · glockenspiel · bass gảy | 124 | snowstep ×8, slotbounce ×2, lấp lánh vào điệp khúc, qpop |
| 24,0–27,0 s<br>*Diễn biến* | Miss Loupe nhảy sang đống lá cạnh hòn đá, hát hỏi (half-sing), kính lớn trên chiếc lá | tò mò, nhẹ nhàng · nhịp vừa | Cute & Sweet<br>ragtime piano, C | **đàn hạc** (giai điệu) · piano · contrabass · rim click + shaker | 116 | nhảy sang (boing + whoosh), landsnow, lensup |
| 27,0–33,9 s<br>*Diễn biến* | Nhấc lá: đám bọ rùa ngủ; Dot bật dậy đếm "One, two, three... so many!" (nói); "Some ladybugs nap together under leaves!" (sing-talk); Dot ngáp, chui lại | dễ thương, buồn cười · nhịp vừa | Cute & Sweet<br>pop nảy, C | **dây pizzicato** (giai điệu) · vibraphone · contrabass · rim click + shaker | 116 | đếm "1 2 3" ×3, leaflift, pop bật lên, textpop, yawn, +3 tiếng khác |
| 33,9–38,2 s<br>*Diễn biến* | Chụp → match cut qua sticker → trang sổ: ba sticker; Albie đếm chân, há miệng, đớp đúng "go!" | vui, tự hào · nhịp nhanh | Playful Cartoon<br>xe trượt tuyết, C | **chuông** (giai điệu) · accordion · tuba | 128 | đếm "1 2 3" ×3, lật trang ×2, whoosh lùi ra sổ, dán sticker, ding, +3 tiếng khác |
| 38,2–40,5 s<br>*Kết* | Dot chui ra, vươn vai ngái ngủ: "Is it spring yet?" (nói) — "Nope!" (nói), dấu X | buồn cười, đáng yêu · nhịp vừa | Funny Comedy<br>polka, C | **kazoo** (giai điệu) · ukulele · tuba · vỗ tay + lục lạc | 116 | pop bật lên, stretch, "NOPE!" bất ngờ |
| 40,5–41,2 s<br>*Kết* | Dot lặn xuống, kéo chiếc lá trùm kín: "FWUMP!", tuyết trên lá bung ra | bất ngờ buồn cười · nhịp khựng | Khựng · Funny Comedy | vibraphone | — | whee, plop, burrow |
| 41,2–42,2 s<br>*Kết* | Chỉ còn chấm cam ló ra; Albie cười khúc khích; máy lùi ra hai bạn | vui · nhịp vừa | Happy Kids<br>shuffle nhảy chân sáo, C | **clarinet** (giai điệu) · marimba · bass gảy · đồ chơi (vỗ tay, shaker, phách gỗ) | 116 | tiếng cười |
| 42,2–45,3 s<br>*Kết* | Điệp khúc lần 2: hai bạn nhảy, ba sticker bật lên trên đầu theo từng từ khoá | vui, hát theo · nhịp nhanh | Happy Kids<br>xe trượt tuyết, C | **xylophone** (giai điệu) · ukulele · glockenspiel · bass gảy | 124 | snowstep ×8, badgepop ×3, lấp lánh vào điệp khúc |
| 45,3–48,0 s<br>*Kết* | "Can YOU huddle like a bee?" (nói): hai bạn ôm nhau cho ấm; chữ móc trở lại; bông tuyết lớn rơi về phía kính (khung đầu) | ấm áp, mời gọi · nhịp vừa | Happy Kids<br>ukulele nắng, C | **trống thép** (giai điệu) · ukulele · bass gảy · đồ chơi (vỗ tay, shaker, phách gỗ) | 120 | landsnow ×2, albiehop, hug, nhảy sang (boing + whoosh), chữ móc trở lại, +1 tiếng khác |

## Vì sao chọn nhạc này

1. **0,0–3,0 s · Bông tuyết đậu trúng kính, Miss Loupe rùng mình "brrr", hát hỏi "Where do bugs go when it snows?" (half-sing); vườn vắng tanh** (Playful Cartoon, 120 BPM): Điệu riêng của tập: xe trượt tuyết 120 BPM, chuông xủng xẻng + vó ngựa lộc cộc báo ngay "mùa đông"; ukulele chặn hợp âm của bài dưới câu hỏi nửa hát.
2. **3,0–3,8 s · Máy lao vào mặt kính, logo bật lên** (Nhạc hiệu kênh, 120 BPM): Nhạc hiệu của kênh (cố ý giống mọi tập), rút còn 0,8 s. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
3. **3,8–7,0 s · "Let's zoom in!" (hát): tổ ong phủ tuyết; vặn vành kính, cả mặt kính đổi màu nhiệt: quả bóng ong rực cam; "Look! A warm ball of bees!" (half-sing)** (Magical Adventure, 112 BPM): Rải lơ lửng 112 BPM, vibraphone tròn ấm và đàn hạc như hơi ấm toả ra; đàn hạc vuốt lên ở lúc bật kính ấm. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
4. **7,0–12,4 s · Lao sâu vào quả bóng ong: Waggle rung ngực theo từng phách; "Heater bees shake their wing muscles!" (sing-talk)** (Bouncy Rhythm, 112 BPM): Shuffle nhảy chân sáo 112 BPM, bass vo ve như tiếng ong rung cơ; marimba gỗ ấm; mỗi nhịp rung một tiếng "brr" viết tay. *Vào cảnh:* dâng lấp lánh.
5. **12,4–15,4 s · Kính thu về sân khấu; Albie: "Do all butterflies stay?" (nói); "Nope!" (sing-talk, giai điệu cố định của kênh), dấu X** (Funny Comedy, 126 BPM): Nảy lệch phách 126 BPM, xylophone và mõ cho câu hỏi ngây ngô của Albie và cái lắc đầu "Nope!". *Vào cảnh:* trống dồn.
6. **15,4–18,4 s · Albie mở trang bản đồ; đàn bướm vua bay theo đường chấm từ miền đông Bắc Mỹ xuống Mexico; "These monarchs fly all the way to Mexico!" (half-sing)** (Magical Adventure, 126 BPM): Phiêu lưu nước kiệu 126 BPM: sáo bay như đàn bướm, dàn dây spiccato và bongo giữ nhịp chuyến đi dài. *Vào cảnh:* dâng lấp lánh.
7. **18,4–21,0 s · Tới Mexico: cả cánh rừng linh sam hoá cam vì hàng triệu bướm bám kín cành; chụp, sticker 2 bay lên ô** (Epic Cartoon, 126 BPM): Cao trào: dàn dây spiccato hát chính 126 BPM như hàng triệu đôi cánh, piano chặn, timpani nhấn phách đầu; "ta-da" ngay khi rừng đổi màu. *Vào cảnh:* riser + chũm chọe ngược.
8. **21,0–24,0 s · Về vườn tuyết: Miss Loupe và Albie nhún nhảy; "Huddle, fly away, or hide!" (hát trọn), ô 1, 2 nảy theo lời, ô 3 còn "?"** (Happy Kids, 124 BPM): Xe trượt tuyết 124 BPM (điệu riêng), xylophone đánh đôi giai điệu điệp khúc cao một quãng tám để trẻ hát theo. *Vào cảnh:* nốt mồi của nhạc cụ mới.
9. **24,0–27,0 s · Miss Loupe nhảy sang đống lá cạnh hòn đá, hát hỏi (half-sing), kính lớn trên chiếc lá** (Cute & Sweet, 116 BPM): Ragtime nhẹ 116 BPM: piano "oom-pah" nhón chân, đàn hạc gảy như bước chân trên tuyết, mõ nhỏ; tò mò mà vẫn vui (giọng trưởng). *Vào cảnh:* chuỗi nốt đi xuống.
10. **27,0–33,9 s · Nhấc lá: đám bọ rùa ngủ; Dot bật dậy đếm "One, two, three... so many!" (nói); "Some ladybugs nap together under leaves!" (sing-talk); Dot ngáp, chui lại** (Cute & Sweet, 116 BPM): Pop nảy 116 BPM, nhẹ tay như nhịp thở đều của đám bọ rùa ngủ; dây pizzicato đếm cùng Dot (mỗi số một nốt xylophone viết tay). *Vào cảnh:* dâng lấp lánh.
11. **33,9–38,2 s · Chụp → match cut qua sticker → trang sổ: ba sticker; Albie đếm chân, há miệng, đớp đúng "go!"** (Playful Cartoon, 128 BPM): Cảnh sổ phối theo điệu riêng của tập (xe trượt tuyết, 128 BPM: nhanh nhất phim) với accordion và tuba "oom-pah", chuông nhỏ hát chính. *Vào cảnh:* trống dồn.
12. **38,2–40,5 s · Dot chui ra, vươn vai ngái ngủ: "Is it spring yet?" (nói) — "Nope!" (nói), dấu X** (Funny Comedy, 116 BPM): Polka 116 BPM, kazoo hát chính kiểu hoạt hình cho câu hỏi ngái ngủ của Dot. *Vào cảnh:* còi trượt xuống "bwomp".
13. **40,5–41,2 s · Dot lặn xuống, kéo chiếc lá trùm kín: "FWUMP!", tuyết trên lá bung ra** (Khựng · Funny Comedy, — BPM): Khựng hài 0,65 s (còn vibraphone run run, không im hẳn) rồi còi trượt xuống và tiếng "fwump". *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
14. **41,2–42,2 s · Chỉ còn chấm cam ló ra; Albie cười khúc khích; máy lùi ra hai bạn** (Happy Kids, 116 BPM): Shuffle 116 BPM ngắn, clarinet đồ chơi chen câu đáp, dẫn vào điệp khúc cuối. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
15. **42,2–45,3 s · Điệp khúc lần 2: hai bạn nhảy, ba sticker bật lên trên đầu theo từng từ khoá** (Happy Kids, 124 BPM): Nhắc lại đúng nhạc của điệp khúc lần 1 (reprise) để trẻ nhận ra và hát theo. *Vào cảnh:* nốt mồi của nhạc cụ mới.
16. **45,3–48,0 s · "Can YOU huddle like a bee?" (nói): hai bạn ôm nhau cho ấm; chữ móc trở lại; bông tuyết lớn rơi về phía kính (khung đầu)** (Happy Kids, 120 BPM): Ukulele nắng 120 BPM (lưới của phim, nối vòng lặp), trống thép hát chính tròn và ấm; hợp âm Sol bảy dẫn về Đô của khung đầu. *Vào cảnh:* chuỗi nốt đi xuống.

## Chuyển cảnh âm thanh

| Giây | Từ → sang | Cách chuyển | BPM |
|---|---|---|---|
| 3,0 | móc · tuyết rơi trúng kính → logo · nhạc hiệu 0,8 s | viết tay (stinger, khựng, nhạc hiệu) | 120 |
| 3,8 | logo · nhạc hiệu 0,8 s → kính · tổ ong lặng im → kính ấm | viết tay (stinger, khựng, nhạc hiệu) | 120 → 112 |
| 7,0 | kính · tổ ong lặng im → kính ấm → quả bóng ấm · Waggle rung ngực | dâng lấp lánh | 112 |
| 12,4 | quả bóng ấm · Waggle rung ngực → Albie hỏi · "Nope!" | trống dồn | 112 → 126 |
| 15,4 | Albie hỏi · "Nope!" → bản đồ · bướm vua bay về Mexico | dâng lấp lánh | 126 |
| 18,4 | bản đồ · bướm vua bay về Mexico → rừng hoá cam · MILLIONS! | riser + chũm chọe ngược | 126 |
| 21,0 | rừng hoá cam · MILLIONS! → điệp khúc 1 | nốt mồi của nhạc cụ mới | 126 → 124 |
| 24,0 | điệp khúc 1 → đống lá · "Who is hiding under here?" | chuỗi nốt đi xuống | 124 → 116 |
| 27,0 | đống lá · "Who is hiding under here?" → Dot đếm · bọ rùa ngủ dưới lá | dâng lấp lánh | 116 |
| 33,9 | Dot đếm · bọ rùa ngủ dưới lá → sổ · "Six legs? In you go!" | trống dồn | 116 → 128 |
| 38,2 | sổ · "Six legs? In you go!" → gag · "Is it spring yet?" · "Nope!" | còi trượt xuống "bwomp" | 128 → 116 |
| 40,5 | gag · "Is it spring yet?" · "Nope!" → khựng · Dot kéo lá trùm lên | viết tay (stinger, khựng, nhạc hiệu) | 116 → 120 |
| 41,2 | khựng · Dot kéo lá trùm lên → Albie cười khúc khích | viết tay (stinger, khựng, nhạc hiệu) | 120 → 116 |
| 42,2 | Albie cười khúc khích → điệp khúc 2 | nốt mồi của nhạc cụ mới | 116 → 124 |
| 45,3 | điệp khúc 2 → CTA · ôm nhau · vòng lặp | chuỗi nốt đi xuống | 124 → 120 |

## Chống trùng lặp

- 16 cảnh nhạc (14 cảnh có điệu, còn lại là khựng / nhạc hiệu viết tay).
- 7 phong cách nhạc: Happy Kids ×4, Playful Cartoon ×2, Magical Adventure ×2, Funny Comedy ×2, Cute & Sweet ×2, Bouncy Rhythm ×1, Epic Cartoon ×1.
- 12 nhạc cụ hát chính: xylophone ×3, glockenspiel ×1, vibraphone ×1, marimba ×1, sáo ×1, dàn dây spiccato ×1, đàn hạc ×1, dây pizzicato ×1, chuông ×1, kazoo ×1, clarinet ×1, trống thép ×1.
- 13 họ nhạc cụ: bass, bộ gõ, chuông, dàn dây, dây pizzicato, kèn gỗ, kèn đồng, marimba, nhạc cụ hoạt hình, piano, ukulele, xylophone, đàn hạc.
- BPM: 112, 116, 120, 124, 126, 128 (6 mức).
- Chuyển cảnh: viết tay (stinger, khựng, nhạc hiệu) ×4, dâng lấp lánh ×3, trống dồn ×2, nốt mồi của nhạc cụ mới ×2, chuỗi nốt đi xuống ×2, riser + chũm chọe ngược ×1, còi trượt xuống "bwomp" ×1.
- Câu đáp của nhạc giữa các câu thoại: 7.

## Music Timeline

> Task.md mục 8B. Cột Vocal Style lấy từ kiểu hát của từng câu (`sing.mode` trong `timeline.js`); SFX từ `events.json`.

| Thời gian | Cảnh | Background Music | Vocal Style | SFX |
|---|---|---|---|---|
| 0,0–3,0 s | Bông tuyết đậu trúng kính, Miss Loupe rùng mình "brrr", hát hỏi "Where do bugs go when it snows?" (half-sing); vườn vắng tanh | Playful Cartoon: xe trượt tuyết, C, 120 BPM, giai điệu glockenspiel · theo bài hát | L01 loupe: half-sing (nửa hát) | boing + pop từng chữ ×2, whoosh ×2, pop chữ móc, giọt nước, brrr, +3 tiếng khác |
| 3,0–3,8 s | Máy lao vào mặt kính, logo bật lên | Nhạc hiệu kênh | L01 loupe: half-sing (nửa hát) | whoosh lao vào kính, logo lấp lánh, logopop, stingout |
| 3,8–7,0 s | "Let's zoom in!" (hát): tổ ong phủ tuyết; vặn vành kính, cả mặt kính đổi màu nhiệt: quả bóng ong rực cam; "Look! A warm ball of bees!" (half-sing) | Magical Adventure: rải lơ lửng, C, 112 BPM, giai điệu vibraphone · theo bài hát | L02 loupe: half-sing (nửa hát)<br>L03 loupe: half-sing (nửa hát) | twist, warmup, textpop, hum |
| 7,0–12,4 s | Lao sâu vào quả bóng ong: Waggle rung ngực theo từng phách; "Heater bees shake their wing muscles!" (sing-talk) | Bouncy Rhythm: shuffle nhảy chân sáo, C, 112 BPM, giai điệu marimba · theo bài hát | L03 loupe: half-sing (nửa hát)<br>L04 loupe: sing-talk (nói theo nhịp)<br>L05 albie: nói | buzzshake ×9, lao sâu vào kính, beebuzz, textpop, chụp sticker, +1 tiếng khác |
| 12,4–15,4 s | Kính thu về sân khấu; Albie: "Do all butterflies stay?" (nói); "Nope!" (sing-talk, giai điệu cố định của kênh), dấu X | Funny Comedy: nảy lệch phách, C, 126 BPM, giai điệu xylophone · theo bài hát | L05 albie: nói<br>L06 loupe: sing-talk (nói theo nhịp) | sticker vào ô, kính hạ xuống, albiehop, "NOPE!" bất ngờ |
| 15,4–18,4 s | Albie mở trang bản đồ; đàn bướm vua bay theo đường chấm từ miền đông Bắc Mỹ xuống Mexico; "These monarchs fly all the way to Mexico!" (half-sing) | Magical Adventure: phiêu lưu nước kiệu, C, 126 BPM, giai điệu sáo · theo bài hát | L06 loupe: sing-talk (nói theo nhịp)<br>L07 loupe: half-sing (nửa hát) | cánh bướm vỗ ×5, textpop ×2, pageopen, gust, sign, +1 tiếng khác |
| 18,4–21,0 s | Tới Mexico: cả cánh rừng linh sam hoá cam vì hàng triệu bướm bám kín cành; chụp, sticker 2 bay lên ô | Epic Cartoon: cao trào anh hùng, C, 126 BPM, giai điệu dàn dây spiccato · theo bài hát | L07 loupe: half-sing (nửa hát)<br>L08 loupe: hát trọn · điệp khúc 'snow' | cánh bướm vỗ ×2, trees, textpop, chụp sticker, whoosh mỏng, +2 tiếng khác |
| 21,0–24,0 s | Về vườn tuyết: Miss Loupe và Albie nhún nhảy; "Huddle, fly away, or hide!" (hát trọn), ô 1, 2 nảy theo lời, ô 3 còn "?" | Happy Kids: xe trượt tuyết, C, 124 BPM, giai điệu xylophone · theo bài hát | L08 loupe: hát trọn · điệp khúc 'snow' | snowstep ×8, slotbounce ×2, lấp lánh vào điệp khúc, qpop |
| 24,0–27,0 s | Miss Loupe nhảy sang đống lá cạnh hòn đá, hát hỏi (half-sing), kính lớn trên chiếc lá | Cute & Sweet: ragtime piano, C, 116 BPM, giai điệu đàn hạc · theo bài hát | L08 loupe: hát trọn · điệp khúc 'snow'<br>L09 loupe: half-sing (nửa hát) | nhảy sang (boing + whoosh), landsnow, lensup |
| 27,0–33,9 s | Nhấc lá: đám bọ rùa ngủ; Dot bật dậy đếm "One, two, three... so many!" (nói); "Some ladybugs nap together under leaves!" (sing-talk); Dot ngáp, chui lại | Cute & Sweet: pop nảy, C, 116 BPM, giai điệu dây pizzicato · theo bài hát | L09 loupe: half-sing (nửa hát)<br>L10 dot: nói<br>L11 loupe: sing-talk (nói theo nhịp) | đếm "1 2 3" ×3, leaflift, pop bật lên, textpop, yawn, +3 tiếng khác |
| 33,9–38,2 s | Chụp → match cut qua sticker → trang sổ: ba sticker; Albie đếm chân, há miệng, đớp đúng "go!" | Playful Cartoon: xe trượt tuyết, C, 128 BPM, giai điệu chuông | L12 albie: nói | đếm "1 2 3" ×3, lật trang ×2, whoosh lùi ra sổ, dán sticker, ding, +3 tiếng khác |
| 38,2–40,5 s | Dot chui ra, vươn vai ngái ngủ: "Is it spring yet?" (nói) — "Nope!" (nói), dấu X | Funny Comedy: polka, C, 116 BPM, giai điệu kazoo · theo bài hát | L13 dot: nói<br>L14 loupe: nói | pop bật lên, stretch, "NOPE!" bất ngờ |
| 40,5–41,2 s | Dot lặn xuống, kéo chiếc lá trùm kín: "FWUMP!", tuyết trên lá bung ra | Khựng · Funny Comedy | L14 loupe: nói | whee, plop, burrow |
| 41,2–42,2 s | Chỉ còn chấm cam ló ra; Albie cười khúc khích; máy lùi ra hai bạn | Happy Kids: shuffle nhảy chân sáo, C, 116 BPM, giai điệu clarinet · theo bài hát | L15 loupe: hát trọn · điệp khúc 'snow' | tiếng cười |
| 42,2–45,3 s | Điệp khúc lần 2: hai bạn nhảy, ba sticker bật lên trên đầu theo từng từ khoá | Happy Kids: xe trượt tuyết, C, 124 BPM, giai điệu xylophone · theo bài hát | L15 loupe: hát trọn · điệp khúc 'snow' | snowstep ×8, badgepop ×3, lấp lánh vào điệp khúc |
| 45,3–48,0 s | "Can YOU huddle like a bee?" (nói): hai bạn ôm nhau cho ấm; chữ móc trở lại; bông tuyết lớn rơi về phía kính (khung đầu) | Happy Kids: ukulele nắng, C, 120 BPM, giai điệu trống thép | L16 loupe: nói | landsnow ×2, albiehop, hug, nhảy sang (boing + whoosh), chữ móc trở lại, +1 tiếng khác |

## Sing-along Dialogue

> Task.md mục 8C. Nốt do `_shared/song.js` giải từ `sing.notes`; giọng hát do `_shared/sing.py` làm từ chính giọng TTS của nhân vật.

| Câu | Ai | Lời | Kiểu | Giai điệu (nốt · giây) | Điệp khúc | Nhấn |
|---|---|---|---|---|---|---|
| L01 (0,4 s) | loupe | Where do bugs go when it snows? | half-sing (nửa hát) | E3·0.25 F3·0.25 G3·0.25 A3·0.50 G3·0.25 F3·0.25 G3·0.75 |  | bugs, snows |
| L02 (3,9 s) | loupe | Let's zoom in! | half-sing (nửa hát) | F3·0.27 G3·0.27 A3·0.54 |  | zoom |
| L03 (5,8 s) | loupe | Look! A warm ball of bees! | half-sing (nửa hát) | C4·0.54 G3·0.27 A3·0.54 G3·0.27 F3·0.27 E3·0.67 |  | warm, ball, bees |
| L04 (9,0 s) | loupe | Wow! Some bees shake their wing muscles! | sing-talk (nói theo nhịp) | G3·0.27 G3·0.27 E3·0.27 G3·0.27 G3·0.27 A3·0.27 G3·0.27 D3·0.54 |  | bees, shake, muscles |
| L05 (12,2 s) | albie | Do all butterflies stay? | nói | — |  | butterflies |
| L06 (14,7 s) | loupe | Nope! | sing-talk (nói theo nhịp) | G3·0.24 C3·0.48 |  |  |
| L07 (15,9 s) | loupe | These monarchs fly all the way to Mexico! | half-sing (nửa hát) | G3·0.24 C4·0.24 C4·0.24 A3·0.48 G3·0.48 F3·0.24 G3·0.48 F3·0.24 G3·0.48 E3·0.24 E3·0.71 |  | monarchs, fly, Mexico |
| L08 (20,9 s) | loupe | Huddle, fly away, or hide! | hát trọn | G3·0.36 G3·0.12 G3·0.24 A3·0.24 B3·0.48 A3·0.48 G3·0.97 | snow | huddle, fly, hide |
| L09 (24,4 s) | loupe | Who is hiding under here? | half-sing (nửa hát) | E3·0.26 F3·0.26 G3·0.26 A3·0.52 G3·0.26 F3·0.26 G3·0.78 |  | hiding |
| L10 (27,4 s) | dot | One, two, three... so many! | nói | — |  | many |
| L11 (29,8 s) | loupe | Some ladybugs nap together under leaves! | sing-talk (nói theo nhịp) | G3·0.26 E3·0.26 G3·0.26 G3·0.52 C4·0.52 A3·0.26 A3·0.26 G3·0.52 G3·0.26 F3·0.26 E3·0.52 |  | ladybugs, nap, leaves |
| L12 (34,9 s) | albie | Six legs? In you go! | nói | — |  | legs |
| L13 (38,4 s) | dot | Is it spring yet? | nói | — |  | spring |
| L14 (40,1 s) | loupe | Nope! | nói | — |  |  |
| L15 (42,1 s) | loupe | Huddle, fly away, or hide! | hát trọn | G3·0.36 G3·0.12 G3·0.24 A3·0.24 B3·0.48 A3·0.48 G3·0.97 | snow | huddle, fly, hide |
| L16 (45,4 s) | loupe | Can YOU huddle like a bee? | nói | — |  | you, huddle, bee |

Lời có nhịp hoặc giai điệu: **68%** số từ (53/78); nói tự nhiên 32%.

## Sound Effects Timeline

> Task.md mục 8E. Chuỗi nhịp có chủ đích ghi `run` trong `events.json` (qa: không tính là lặp máy móc).

| Giây | Tiếng | Chuỗi |
|---|---|---|
| 0,0 | pop chữ móc |  |
| 0,0 | boing + pop từng chữ |  |
| 0,0 | giọt nước |  |
| 0,1 | brrr |  |
| 0,1 | boing + pop từng chữ |  |
| 0,3 | chatter |  |
| 0,9 | whoosh |  |
| 1,4 | whoosh |  |
| 2,2 | "hử?" |  |
| 2,8 | ô sticker hiện |  |
| 3,0 | whoosh lao vào kính |  |
| 3,1 | logo lấp lánh |  |
| 3,2 | logopop |  |
| 3,6 | stingout |  |
| 5,0 | twist |  |
| 5,2 | warmup |  |
| 5,3 | textpop |  |
| 6,0 | hum |  |
| 9,0 | lao sâu vào kính |  |
| 9,4 | textpop |  |
| 9,4 | beebuzz |  |
| 9,7 | buzzshake | shake |
| 9,9 | buzzshake | shake |
| 10,2 | buzzshake | shake |
| 10,5 | buzzshake | shake |
| 10,7 | buzzshake | shake |
| 11,0 | buzzshake | shake |
| 11,3 | buzzshake | shake |
| 11,5 | buzzshake | shake |
| 11,8 | buzzshake | shake |
| 12,0 | chụp sticker |  |
| 12,1 | whoosh mỏng |  |
| 12,4 | kính hạ xuống |  |
| 12,6 | sticker vào ô |  |
| 12,8 | albiehop |  |
| 14,8 | "NOPE!" bất ngờ |  |
| 15,4 | pageopen |  |
| 16,0 | textpop |  |
| 16,1 | gust |  |
| 16,2 | cánh bướm vỗ | flight |
| 16,6 | sign |  |
| 16,7 | cánh bướm vỗ | flight |
| 17,2 | cánh bướm vỗ | flight |
| 17,6 | cánh bướm vỗ | flight |
| 17,8 | textpop |  |
| 18,1 | cánh bướm vỗ | flight |
| 18,2 | arrive |  |
| 18,4 | trees |  |
| 18,4 | textpop |  |
| 18,6 | cánh bướm vỗ | flight |
| 19,1 | cánh bướm vỗ | flight |
| 19,9 | chụp sticker |  |
| 20,0 | gust |  |
| 20,1 | whoosh mỏng |  |
| 20,6 | sticker vào ô |  |
| 21,0 | lấp lánh vào điệp khúc |  |
| 21,0 | slotbounce |  |
| 21,4 | snowstep | dance1 |
| 21,5 | slotbounce |  |
| 21,6 | snowstep | dance1 |
| 22,1 | snowstep | dance1 |
| 22,3 | snowstep | dance1 |
| 22,6 | snowstep | dance1 |
| 23,0 | qpop |  |
| 23,1 | snowstep | dance1 |
| 23,3 | snowstep | dance1 |
| 23,5 | snowstep | dance1 |
| 24,1 | nhảy sang (boing + whoosh) |  |
| 24,6 | landsnow |  |
| 26,9 | lensup |  |
| 27,0 | leaflift |  |
| 27,4 | pop bật lên |  |
| 27,5 | đếm "1 2 3" | dotcount |
| 27,9 | đếm "1 2 3" | dotcount |
| 28,2 | đếm "1 2 3" | dotcount |
| 28,6 | textpop |  |
| 32,7 | yawn |  |
| 33,2 | burrow |  |
| 33,7 | chụp sticker |  |
| 33,8 | whoosh xuyên kính |  |
| 34,1 | whoosh lùi ra sổ |  |
| 34,5 | lật trang |  |
| 34,5 | whoosh mỏng |  |
| 34,6 | dán sticker |  |
| 34,6 | ding |  |
| 34,9 | sticker vào ô |  |
| 35,1 | đếm "1 2 3" | albiecount |
| 35,4 | đếm "1 2 3" | albiecount |
| 35,6 | đếm "1 2 3" | albiecount |
| 36,8 | ực |  |
| 37,8 | lật trang |  |
| 38,4 | pop bật lên |  |
| 38,7 | stretch |  |
| 40,2 | "NOPE!" bất ngờ |  |
| 40,5 | whee |  |
| 40,7 | burrow |  |
| 40,9 | plop |  |
| 41,2 | tiếng cười |  |
| 42,2 | lấp lánh vào điệp khúc |  |
| 42,2 | badgepop |  |
| 42,4 | snowstep | dance2 |
| 42,7 | snowstep | dance2 |
| 42,7 | badgepop |  |
| 43,2 | snowstep | dance2 |
| 43,4 | snowstep | dance2 |
| 43,7 | snowstep | dance2 |
| 43,7 | badgepop |  |
| 44,1 | snowstep | dance2 |
| 44,4 | snowstep | dance2 |
| 44,6 | snowstep | dance2 |
| 45,3 | albiehop |  |
| 45,4 | hug |  |
| 45,6 | landsnow |  |
| 46,3 | nhảy sang (boing + whoosh) |  |
| 46,6 | snowfall |  |
| 46,8 | chữ móc trở lại |  |
| 47,4 | landsnow |  |

## AI Music Generation Prompts

> Task.md mục 8D. Prompt tiếng Anh cho từng đoạn nhạc, sinh từ đúng thông số của cảnh (phong cách, BPM, giọng, nhạc cụ, năng lượng, cách chuyển).
> Chỉ để tham khảo hoặc làm bản nháp ngoài: nhạc trong phim vẫn tổng hợp bằng code (`groove.py`), giọng hát vẫn là giọng nhân vật.

**0,0–3,0 s · Bông tuyết đậu trúng kính, Miss Loupe rùng mình "brrr", hát hỏi "Where do bugs go when it snows?" (half-sing); vườn vắng tanh**

```
Genre: Playful Cartoon kids' music, sleigh. Mood: cheerful, medium energy, major key (C). BPM: 120.
Instruments: glockenspiel, ukulele, celesta, plucked bass. Vocal style: Miss Loupe (cheerful woman, clear) half-sung: "Where do bugs go when it snows?".
Melody: lead glockenspiel answers in the gaps between lines; backing follows the vocal melody's chords, C G7. Voice stays on top: music ducks under every word.
Energy changes: steady; accent the first beat. Ending: hand over to the next scene with a hand-written stinger. Length: 3.0 s.
```

**3,8–7,0 s · "Let's zoom in!" (hát): tổ ong phủ tuyết; vặn vành kính, cả mặt kính đổi màu nhiệt: quả bóng ong rực cam; "Look! A warm ball of bees!" (half-sing)**

```
Genre: Magical Adventure kids' music, floating arpeggios. Mood: cheerful, medium energy, major key (C). BPM: 112.
Instruments: vibraphone, harp, upright bass, triangle and shaker. Vocal style: Miss Loupe (cheerful woman, clear) half-sung: "Let's zoom in!"; Miss Loupe (cheerful woman, clear) half-sung: "Look! A warm ball of bees!".
Melody: lead vibraphone answers in the gaps between lines; backing follows the vocal melody's chords, C F C G7. Voice stays on top: music ducks under every word.
Energy changes: builds; accent the first beat. Ending: hand over to the next scene with a sparkle swell. Length: 3.2 s.
```

**7,0–12,4 s · Lao sâu vào quả bóng ong: Waggle rung ngực theo từng phách; "Heater bees shake their wing muscles!" (sing-talk)**

```
Genre: Bouncy Rhythm kids' music, skipping shuffle. Mood: cheerful, medium energy, major key (C). BPM: 112.
Instruments: marimba, bright piano, buzzy bass, wood blocks and shaker. Vocal style: Miss Loupe (cheerful woman, clear) half-sung: "Look! A warm ball of bees!"; Miss Loupe (cheerful woman, clear) rhythmic sing-talk: "Wow! Some bees shake their wing muscles!"; Albie (warm low man) spoken: "Do all butterflies stay?".
Melody: lead marimba answers in the gaps between lines; backing follows the vocal melody's chords, F C G7 C. Voice stays on top: music ducks under every word.
Energy changes: builds; accent the first beat. Ending: hand over to the next scene with a drum fill. Length: 5.4 s.
```

**12,4–15,4 s · Kính thu về sân khấu; Albie: "Do all butterflies stay?" (nói); "Nope!" (sing-talk, giai điệu cố định của kênh), dấu X**

```
Genre: Funny Comedy kids' music, hopping off-beat groove. Mood: cheerful, medium energy, major key (C). BPM: 126.
Instruments: xylophone, ukulele, plucked bass, two-tone wood blocks. Vocal style: Albie (warm low man) spoken: "Do all butterflies stay?"; Miss Loupe (cheerful woman, clear) rhythmic sing-talk: "Nope!".
Melody: lead xylophone answers in the gaps between lines; backing follows the vocal melody's chords, F G7 C C. Voice stays on top: music ducks under every word.
Energy changes: builds; accent the first beat. Ending: hand over to the next scene with a sparkle swell. Length: 3.0 s.
```

**15,4–18,4 s · Albie mở trang bản đồ; đàn bướm vua bay theo đường chấm từ miền đông Bắc Mỹ xuống Mexico; "These monarchs fly all the way to Mexico!" (half-sing)**

```
Genre: Magical Adventure kids' music, adventure quest. Mood: cheerful, medium energy, major key (C). BPM: 126.
Instruments: flute, spiccato strings, harp, low pizzicato, bongos and shaker. Vocal style: Miss Loupe (cheerful woman, clear) rhythmic sing-talk: "Nope!"; Miss Loupe (cheerful woman, clear) half-sung: "These monarchs fly all the way to Mexico!".
Melody: lead flute answers in the gaps between lines; backing follows the vocal melody's chords, G7 C C F. Voice stays on top: music ducks under every word.
Energy changes: builds; accent the first beat. Ending: hand over to the next scene with a riser with reverse cymbal. Length: 2.9 s.
```

**18,4–21,0 s · Tới Mexico: cả cánh rừng linh sam hoá cam vì hàng triệu bướm bám kín cành; chụp, sticker 2 bay lên ô**

```
Genre: Epic Cartoon kids' music, heroic fanfare. Mood: cheerful, high energy, major key (C). BPM: 126.
Instruments: spiccato strings, piano, tuba, timpani and snare. Vocal style: Miss Loupe (cheerful woman, clear) half-sung: "These monarchs fly all the way to Mexico!"; Miss Loupe (cheerful woman, clear) fully sung: "Huddle, fly away, or hide!".
Melody: lead spiccato strings answers in the gaps between lines; backing follows the vocal melody's chords, C F G7 C. Voice stays on top: music ducks under every word.
Energy changes: builds; accent the first beat. Ending: hand over to the next scene with pickup notes of the next instrument. Length: 2.6 s.
```

**21,0–24,0 s · Về vườn tuyết: Miss Loupe và Albie nhún nhảy; "Huddle, fly away, or hide!" (hát trọn), ô 1, 2 nảy theo lời, ô 3 còn "?"**

```
Genre: Happy Kids kids' music, sleigh. Mood: cheerful, high energy, major key (C). BPM: 124.
Instruments: xylophone, ukulele, glockenspiel, plucked bass. Vocal style: Miss Loupe (cheerful woman, clear) fully sung: "Huddle, fly away, or hide!".
Melody: lead xylophone answers in the gaps between lines; backing follows the vocal melody's chords, G7 C. Voice stays on top: music ducks under every word.
Energy changes: builds; accent the first beat. Ending: hand over to the next scene with a descending run. Length: 3.0 s.
```

**24,0–27,0 s · Miss Loupe nhảy sang đống lá cạnh hòn đá, hát hỏi (half-sing), kính lớn trên chiếc lá**

```
Genre: Cute & Sweet kids' music, stride piano. Mood: cheerful, medium energy, major key (C). BPM: 116.
Instruments: harp, piano, upright bass, rim clicks. Vocal style: Miss Loupe (cheerful woman, clear) fully sung: "Huddle, fly away, or hide!"; Miss Loupe (cheerful woman, clear) half-sung: "Who is hiding under here?".
Melody: lead harp answers in the gaps between lines; backing follows the vocal melody's chords, C F G7 C. Voice stays on top: music ducks under every word.
Energy changes: builds; accent the first beat. Ending: hand over to the next scene with a sparkle swell. Length: 3.0 s.
```

**27,0–33,9 s · Nhấc lá: đám bọ rùa ngủ; Dot bật dậy đếm "One, two, three... so many!" (nói); "Some ladybugs nap together under leaves!" (sing-talk); Dot ngáp, chui lại**

```
Genre: Cute & Sweet kids' music, bouncy two-step. Mood: cheerful, medium energy, major key (C). BPM: 116.
Instruments: pizzicato strings, vibraphone, upright bass, rim clicks. Vocal style: Miss Loupe (cheerful woman, clear) half-sung: "Who is hiding under here?"; Dot (bright kid voice, British) spoken: "One, two, three... so many!"; Miss Loupe (cheerful woman, clear) rhythmic sing-talk: "Some ladybugs nap together under leaves!".
Melody: lead pizzicato strings answers in the gaps between lines; backing follows the vocal melody's chords, F G7 C C. Voice stays on top: music ducks under every word.
Energy changes: builds; accent the first beat. Ending: hand over to the next scene with a drum fill. Length: 6.9 s.
```

**33,9–38,2 s · Chụp → match cut qua sticker → trang sổ: ba sticker; Albie đếm chân, há miệng, đớp đúng "go!"**

```
Genre: Playful Cartoon kids' music, sleigh. Mood: cheerful, medium energy, major key (C). BPM: 128.
Instruments: bells, accordion, tuba. Vocal style: Albie (warm low man) spoken: "Six legs? In you go!".
Melody: lead bells answers in the gaps between lines. Voice stays on top: music ducks under every word.
Energy changes: builds; accent the first beat. Ending: hand over to the next scene with a slide-whistle drop. Length: 4.3 s.
```

**38,2–40,5 s · Dot chui ra, vươn vai ngái ngủ: "Is it spring yet?" (nói) — "Nope!" (nói), dấu X**

```
Genre: Funny Comedy kids' music, polka. Mood: cheerful, medium energy, major key (C). BPM: 116.
Instruments: kazoo, ukulele, tuba, hand claps and tambourine. Vocal style: Dot (bright kid voice, British) spoken: "Is it spring yet?"; Miss Loupe (cheerful woman, clear) spoken: "Nope!".
Melody: lead kazoo answers in the gaps between lines; backing follows the vocal melody's chords, G7 C C F. Voice stays on top: music ducks under every word.
Energy changes: steady; accent the first beat. Ending: hand over to the next scene with a hand-written stinger. Length: 2.3 s.
```

**40,5–41,2 s · Dot lặn xuống, kéo chiếc lá trùm kín: "FWUMP!", tuyết trên lá bung ra**

```
Genre: comic stop. Mood: cheerful, low energy, major key (C). BPM: —.
Instruments: vibraphone. Vocal style: Miss Loupe (cheerful woman, clear) spoken: "Nope!".
Melody: no lead melody, light accompaniment. Voice stays on top: music ducks under every word.
Energy changes: steady; accent the first beat. Ending: hold a thin vibraphone shimmer, then resume. Length: 0.6 s.
```

**41,2–42,2 s · Chỉ còn chấm cam ló ra; Albie cười khúc khích; máy lùi ra hai bạn**

```
Genre: Happy Kids kids' music, skipping shuffle. Mood: cheerful, medium energy, major key (C). BPM: 116.
Instruments: clarinet, marimba, plucked bass, hand claps, shaker and wood blocks. Vocal style: Miss Loupe (cheerful woman, clear) fully sung: "Huddle, fly away, or hide!".
Melody: lead clarinet answers in the gaps between lines; backing follows the vocal melody's chords, C F G7 C. Voice stays on top: music ducks under every word.
Energy changes: steady; accent the first beat. Ending: hand over to the next scene with pickup notes of the next instrument. Length: 1.0 s.
```

**42,2–45,3 s · Điệp khúc lần 2: hai bạn nhảy, ba sticker bật lên trên đầu theo từng từ khoá**

```
Genre: Happy Kids kids' music, sleigh. Mood: cheerful, high energy, major key (C). BPM: 124.
Instruments: xylophone, ukulele, glockenspiel, plucked bass. Vocal style: Miss Loupe (cheerful woman, clear) fully sung: "Huddle, fly away, or hide!".
Melody: lead xylophone answers in the gaps between lines; backing follows the vocal melody's chords, G7 C. Voice stays on top: music ducks under every word.
Energy changes: steady; accent the first beat. Ending: hand over to the next scene with a descending run. Length: 3.1 s.
```

**45,3–48,0 s · "Can YOU huddle like a bee?" (nói): hai bạn ôm nhau cho ấm; chữ móc trở lại; bông tuyết lớn rơi về phía kính (khung đầu)**

```
Genre: Happy Kids kids' music, sunny ukulele pop. Mood: cheerful, medium energy, major key (C). BPM: 120.
Instruments: steel drum, ukulele, plucked bass, hand claps, shaker and wood blocks. Vocal style: Miss Loupe (cheerful woman, clear) spoken: "Can YOU huddle like a bee?".
Melody: lead steel drum answers in the gaps between lines. Voice stays on top: music ducks under every word.
Energy changes: steady; accent the first beat. Ending: end on the tonic chord so the loop returns to the first frame. Length: 2.7 s.
```

## Final Audio Checklist

> Task.md mục 8F: điền tay khi nghe lại cả phim.

- [ ] Nhạc có sinh động không? · [ ] Có thay đổi theo cảnh không? · [ ] Lời thoại có giai điệu không?
- [ ] Có đoạn nhạc dễ nhớ (điệp khúc, motif) không? · [ ] Giọng hát có rõ không? · [ ] Nhạc nền có lấn át giọng không?
- [ ] SFX có khớp hành động không? · [ ] Âm nhạc có tạo cảm xúc và giữ chân người xem không?

## Chống trùng lặp giữa các tập

So với 15 Short khác (001, 002, 003, 004, 005, 006, 007, 008, 009, 010, 011, 012, 013, 014, 015), từ `music-plan.json` của từng tập.

- **Điệu riêng của tập:** xe trượt tuyết, chiếm 28 % thời lượng.
- **Công thức trùng với Short khác:** không có.
- **Cặp điệu + nhạc cụ hát chính đã có ở Short khác:** rải lơ lửng + vibraphone (010); nảy lệch phách + xylophone (005, 015); phiêu lưu nước kiệu + sáo (012, 014); polka + kazoo (010).
- **Vui nhộn:** hồi hộp + khựng 0 %, cảnh nền giọng thứ 0 % thời lượng (mỗi mục ≤ 20 %).

## Thiết kế âm thanh theo cảnh (4 lớp)

> Task.md 18/11/2026 mục 5: mỗi cảnh 4 lớp Voice · Background Music · Sound Effects · Ambient. Sinh từ `out/scenes.json` (mức năng lượng và lớp nền khai báo ở `SCENES` trong `mix.py`), cảm xúc của câu (`emo` trong `timeline.js`) và `events.json`.

| Cảnh | Năng lượng | Lớp 1 · Voice | Lớp 2 · Music | Lớp 3 · SFX | Lớp 4 · Ambient |
|---|---|---|---|---|---|
| 0,0–3,0 s · hook | mạnh | L01 loupe · curious · half-sing | móc · tuyết rơi trúng kính | brrr, chatter, huh, plip, slots, swish, titlepop, wordpop | vườn tuyết: gió lạnh có cơn, gió rít khẽ, chim mùa đông xa, tuyết lách tách |
| 3,0–3,8 s · title | mạnh | — | logo · nhạc hiệu 0,8 s | logo, logopop, stingout, zoom | vườn tuyết: gió lạnh có cơn, gió rít khẽ, chim mùa đông xa, tuyết lách tách |
| 3,8–9,0 s · bees | êm | L02 loupe · excited · half-sing<br>L03 loupe · surprised · half-sing | kính · tổ ong lặng im → kính ấm<br>quả bóng ấm · Waggle rung ngực | hum, textpop, twist, warmup | trong tổ ong: rì rầm ấm qua vách |
| 9,0–12,4 s · shake | thường | L04 loupe · calm · sing-talk | quả bóng ấm · Waggle rung ngực | beebuzz, buzzshake, deep, snap, swipe, textpop | trong tổ ong: rì rầm ấm qua vách |
| 12,4–15,4 s · nope | thường | L05 albie · curious · speak<br>L06 loupe · playful · sing-talk | Albie hỏi · "Nope!" | albiehop, lensdown, nope, slotstamp | vườn tuyết: gió lạnh có cơn, gió rít khẽ, chim mùa đông xa, tuyết lách tách |
| 15,4–18,4 s · map | thường | L07 loupe · excited · half-sing | bản đồ · bướm vua bay về Mexico | arrive, flutter, gust, pageopen, sign, textpop | trang sổ / bản đồ: phòng yên tĩnh, giấy sột soạt |
| 18,4–20,6 s · forest | cao trào | — | rừng hoá cam · MILLIONS! | flutter, gust, snap, swipe, textpop, trees | trang sổ / bản đồ: phòng yên tĩnh, giấy sột soạt |
| 20,6–24,0 s · chorus1 | mạnh | L08 loupe · happy · sing | rừng hoá cam · MILLIONS!<br>điệp khúc 1 | chorus, qpop, slotbounce, slotstamp, snowstep | vườn tuyết: gió lạnh có cơn, gió rít khẽ, chim mùa đông xa, tuyết lách tách |
| 24,0–27,2 s · leaf | êm | L09 loupe · curious · half-sing | đống lá · "Who is hiding under here?"<br>Dot đếm · bọ rùa ngủ dưới lá | hopL, landsnow, leaflift, lensup | sát đống lá: lá xào xạc, tuyết lách tách |
| 27,2–33,9 s · dot | êm | L10 dot · excited · speak<br>L11 loupe · calm · sing-talk | Dot đếm · bọ rùa ngủ dưới lá | burrow, count, popup, snap, textpop, yawn, zoomin | sát đống lá: lá xào xạc, tuyết lách tách |
| 33,9–38,2 s · album | thường | L12 albie · proud · speak | sổ · "Six legs? In you go!" | count, ding, flip, gulp, page, slotstamp, stamp, swipe, zoomout | trang sổ / bản đồ: phòng yên tĩnh, giấy sột soạt |
| 38,2–42,1 s · gag | thường | L13 dot · curious · speak<br>L14 loupe · playful · speak | gag · "Is it spring yet?" · "Nope!"<br>khựng · Dot kéo lá trùm lên<br>Albie cười khúc khích | burrow, giggle, nope, plop, popup, stretch, whee | vườn tuyết: gió lạnh có cơn, gió rít khẽ, chim mùa đông xa, tuyết lách tách |
| 42,1–45,3 s · chorus2 | mạnh | L15 loupe · happy · sing | Albie cười khúc khích<br>điệp khúc 2 | badgepop, chorus, snowstep | vườn tuyết: gió lạnh có cơn, gió rít khẽ, chim mùa đông xa, tuyết lách tách |
| 45,3–48,0 s · cta | thường | L16 loupe · happy · speak | CTA · ôm nhau · vòng lặp | albiehop, hopL, hug, landsnow, recall, snowfall | vườn tuyết: gió lạnh có cơn, gió rít khẽ, chim mùa đông xa, tuyết lách tách |

## Đồng bộ hình – tiếng

`_shared/tools/av_sync.py` đo trên video: 30 điểm chuyển động mạnh, 100 % có tiếng động hoặc lời trong ± 0.2 s.

Các ngưỡng và kết quả kiểm: `python _shared/qa.py films/short-016` (nhóm "4 Âm thanh", "Sound Design Plan" và "10 Âm thanh theo cảnh").
