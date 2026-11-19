# SHORT-012 · Sound Design Plan

> Sinh tự động bằng `python _shared/tools/soundplan.py films/short-012` từ `out/music.json` (bảng cảnh nhạc khai báo trong `mix.py` bằng `G.sec` / `G.mark`) và `events.json`.
> Đừng sửa tay: sửa `what=`, `emo=`, `why=`, `mood=`, `arc=`, `bpm=`, `sfx=` trong `mix.py`, dựng lại rồi chạy lại công cụ. Quy tắc: [`QUALITY.md` §4](../../_shared/QUALITY.md#4-âm-thanh-và-nhạc-nền).

**Màu nhạc của tập:** "Reverse-Gear Reggae" (Rê giáng trưởng, reggae one-drop, mỗi cú bay lùi là một cú "rewind" của DJ; điệp khúc "Front wings up, back wings down!" ở trumpet). Chi tiết nhạc cụ, giọng và điểm nhấn viết tay: [`MUSIC.md`](MUSIC.md); bảng cue hình ↔ tiếng: [`SOUND.md`](SOUND.md).

## Cung bậc

- **Mở đầu** 0,0–4,5 s: Playful Cartoon, Happy Kids; 120–126 BPM; trống thép, vibraphone
- **Diễn biến** 4,5–9,1 s: Magical Adventure, Cute & Sweet; 108 BPM; sáo, glockenspiel
- **Cao trào** 9,1–12,2 s: Epic Cartoon; 120 BPM; trumpet
- **Kết** 12,2–24,0 s: Playful Cartoon, Funny Comedy, Happy Kids, Bouncy Rhythm; 112–120 BPM; kazoo, accordion, bassoon, trumpet, xylophone

## Bảng thiết kế âm thanh

| Thời gian | Nội dung cảnh | Cảm xúc | Phong cách nhạc | Nhạc cụ | BPM | SFX |
|---|---|---|---|---|---|---|
| 0,0–3,2 s<br>*Mở đầu* | Zip lao tới, phanh kít trước kính rồi bay giật lùi, hai lần; "Could you fly backwards?" (đọc vào phách); Miss Loupe hoa mắt | bất ngờ, buồn cười · nhịp vừa | Playful Cartoon<br>reggae one-drop, Db | **trống thép** (giai điệu) · phím điện · bass gảy · reggae one-drop (kick + rim phách 3) | 120 | boing + pop từng chữ ×2, brake ×2, reverse ×2, pop chữ móc, giật mình, +3 tiếng khác |
| 3,2–4,5 s<br>*Mở đầu* | Máy hạ xuống, Miss Loupe lắc đầu cho hết hoa mắt: "Let's zoom in!" (câu cửa miệng, vào phách), kính bật về phía máy | háo hức · nhịp nhanh | Happy Kids<br>pop nảy, Db | **vibraphone** (giai điệu) · ukulele · bass gảy · pop (kick, vỗ tay, hi-hat) | 126 | whoosh lao vào kính |
| 4,5–7,0 s<br>*Diễn biến* | Trong kính lớn Zip bay lùi, đuôi đi trước: "Dragonflies can fly backwards!" (sing-talk); chữ BACKWARDS! | kỳ diệu · nhịp vừa | Magical Adventure<br>phiêu lưu nước kiệu, Db | **sáo** (giai điệu) · dây pizzicato · celesta · contrabass · trống tom | 108 | lensback, textpop, brake, still |
| 7,0–9,1 s<br>*Diễn biến* | Zip phanh, đứng yên giữa trời trên đường chấm chấm, quay mặt ra: "And stay still in the air!" (đọc vào phách); chữ STILL! | ngạc nhiên, nín thở vui · nhịp vừa | Cute & Sweet<br>rải lơ lửng, Db | **glockenspiel** (giai điệu) · đàn hạc · contrabass · triangle + shaker | 108 | textpop, slowmo |
| 9,1–12,2 s<br>*Cao trào* | Soi chậm: cánh trước (chanh) lên khi cánh sau (hồng) xuống, mũi tên bật theo nhịp; điệp khúc lần 1 "Front wings up, back wings down!" | wow, vỡ lẽ · nhịp cao trào | Epic Cartoon<br>reggae one-drop, Db | **trumpet** (giai điệu) · piano · bass gảy · reggae one-drop (kick + rim phách 3) | 120 | stroke ×5, textpop, lấp lánh vào điệp khúc, lấp lánh |
| 12,2–13,1 s<br>*Kết* | Kính "chụp" Zip đang đứng yên, sticker hiện trên trang sổ | háo hức · nhịp khựng | Khựng · Happy Kids | **đàn hạc** (giai điệu) · marimba | — | chụp sticker, whoosh xuyên kính, whoosh lùi ra sổ, lật trang, whoosh mỏng |
| 13,1–15,8 s<br>*Kết* | Sticker "Flies backwards!" dán vào sổ; Zip đứng yên cho Albie đếm chân: "Six legs? In you go!", Zip lùi đuôi vào trang đúng "go!" | vui, tự hào · nhịp vừa | Playful Cartoon<br>reggae one-drop, Db | **kazoo** (giai điệu) · ukulele · bass gảy · reggae one-drop (kick + rim phách 3) | 112 | countA ×3, dán sticker, ding, zip vút, tailin, +2 tiếng khác |
| 15,8–17,5 s<br>*Kết* | Lật trang về lối cỏ: Miss Loupe dang tay làm cánh, bước lùi kêu "bíp bíp", không thấy Albie sau lưng; accordion thổi chủ đề của tập | buồn cười, tinh nghịch · nhịp vừa | Funny Comedy<br>nảy lệch phách, Db | **accordion** (giai điệu) · dây pizzicato · tuba · mõ hai cao độ | 112 | beep ×3, lật trang, wingsup, bước chân, notice |
| 17,5–19,0 s<br>*Kết* | Bộp! Lưng Miss Loupe chạm góc sách của Albie: "Watch the corners!" (nói); góc sách lấp lánh, Miss Loupe đỏ mặt cười | buồn cười, nhẹ nhõm · nhịp vừa | Funny Comedy<br>polka, Db | **bassoon** (giai điệu) · marimba · bass gảy · vỗ tay + lục lạc | 116 | bonk (va nhẹ), stars, loé sáng |
| 19,0–22,0 s<br>*Kết* | Điệp khúc lần 2: Zip trôi vào giữa, đập cánh so le (tô hai màu, mũi tên lên / xuống); Miss Loupe vỗ tay như cánh, Albie nhún | vui, đọc theo · nhịp nhanh | Happy Kids<br>reggae one-drop, Db | **trumpet** (giai điệu) · piano · bass gảy · reggae one-drop (kick + rim phách 3) | 120 | flap ×4, lấp lánh vào điệp khúc |
| 22,0–24,0 s<br>*Kết* | "Which way is Zip flying?" (đọc vào phách) – Zip bay lùi ngang khung ra phải; chữ móc trở lại; "rewind", Zip lao tới lại như khung đầu | háo hức, mời gọi · nhịp nhanh | Bouncy Rhythm<br>phi ngựa (nhịp kép), Db | **xylophone** (giai điệu) · marimba · bass gảy · đồ chơi (vỗ tay, shaker, phách gỗ) | 120 (cảm giác 240) | nhảy (boing + whoosh) ×2, reverseout, chữ móc trở lại, zipin |

## Vì sao chọn nhạc này

1. **0,0–3,2 s · Zip lao tới, phanh kít trước kính rồi bay giật lùi, hai lần; "Could you fly backwards?" (đọc vào phách); Miss Loupe hoa mắt** (Playful Cartoon, 120 BPM): Điệu riêng của tập: reggae one-drop (trống chỉ rơi ở phách 3, đàn phím điện "skank" phách 2 và 4); trống thép là giọng của Zip. Cú lùi thứ hai là một cú "rewind" của DJ: nhạc quay ngược rồi chơi tiếp.
2. **3,2–4,5 s · Máy hạ xuống, Miss Loupe lắc đầu cho hết hoa mắt: "Let's zoom in!" (câu cửa miệng, vào phách), kính bật về phía máy** (Happy Kids, 126 BPM): Pop nảy 126 BPM, ukulele chặn hợp âm của bài; vibraphone đáp sau câu cửa miệng; đàn hạc vuốt lên khi kính bật (viết tay). *Vào cảnh:* trống dồn.
3. **4,5–7,0 s · Trong kính lớn Zip bay lùi, đuôi đi trước: "Dragonflies can fly backwards!" (sing-talk); chữ BACKWARDS!** (Magical Adventure, 108 BPM): Phiêu lưu nước kiệu 108 BPM: pizzicato và celesta rải theo chuyến bay, sáo hát. *Vào cảnh:* trống dồn.
4. **7,0–9,1 s · Zip phanh, đứng yên giữa trời trên đường chấm chấm, quay mặt ra: "And stay still in the air!" (đọc vào phách); chữ STILL!** (Cute & Sweet, 108 BPM): Rải lơ lửng 108 BPM (vẫn tươi), đàn hạc rải và glockenspiel: nhạc cũng "đứng yên" lơ lửng như Zip; triangle ở phách đầu. *Vào cảnh:* vuốt đàn hạc.
5. **9,1–12,2 s · Soi chậm: cánh trước (chanh) lên khi cánh sau (hồng) xuống, mũi tên bật theo nhịp; điệp khúc lần 1 "Front wings up, back wings down!"** (Epic Cartoon, 120 BPM): Cao trào: reggae 120 BPM, một chu kỳ cánh 1,25 s bằng đúng 5 móc đơn nên mỗi đỉnh cánh rơi trên lưới nhịp; trumpet chơi giai điệu điệp khúc dưới câu (leo lên ở "UP", rơi xuống ở "DOWN"); cánh trước lên = xylophone đi lên (dải cao), cánh sau xuống = tuba đi xuống (dải trầm); vỗ tay phách 2 và 4. *Vào cảnh:* riser + chũm chọe ngược.
6. **12,2–13,1 s · Kính "chụp" Zip đang đứng yên, sticker hiện trên trang sổ** (Khựng · Happy Kids, — BPM): Marimba chạy lên (tiếng "chụp" của ban nhạc kênh), đàn hạc vuốt qua mặt kính. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
7. **13,1–15,8 s · Sticker "Flies backwards!" dán vào sổ; Zip đứng yên cho Albie đếm chân: "Six legs? In you go!", Zip lùi đuôi vào trang đúng "go!"** (Playful Cartoon, 112 BPM): Cảnh sổ phối theo điệu của tập: reggae 112 BPM, ukulele "skank", kazoo đáp sau câu cửa miệng; dưới giọng trầm của Albie lớp nhịp tự bỏ bass. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
8. **15,8–17,5 s · Lật trang về lối cỏ: Miss Loupe dang tay làm cánh, bước lùi kêu "bíp bíp", không thấy Albie sau lưng; accordion thổi chủ đề của tập** (Funny Comedy, 112 BPM): Nảy lệch phách 112 BPM: tuba và pizzicato nảy theo từng bước lùi; câu đáp đầu cảnh là chủ đề của tập (giai điệu điệp khúc) trên accordion, như Miss Loupe tự ngân lại bài. *Vào cảnh:* còi trượt xuống "bwomp".
9. **17,5–19,0 s · Bộp! Lưng Miss Loupe chạm góc sách của Albie: "Watch the corners!" (nói); góc sách lấp lánh, Miss Loupe đỏ mặt cười** (Funny Comedy, 116 BPM): Polka hài 116 BPM bật ra ngay sau cú "bộp" (tuba "bwomp" viết tay); bassoon "hô hô" đáp khi Miss Loupe cười. *Vào cảnh:* nhấn "ta!" ở dải cao (đổi cảnh dưới lời).
10. **19,0–22,0 s · Điệp khúc lần 2: Zip trôi vào giữa, đập cánh so le (tô hai màu, mũi tên lên / xuống); Miss Loupe vỗ tay như cánh, Albie nhún** (Happy Kids, 120 BPM): Nhắc lại đúng nhạc của điệp khúc lần 1 (reprise): trumpet chơi lại giai điệu điệp khúc để trẻ nhận ra và đọc theo. *Vào cảnh:* nốt mồi của nhạc cụ mới.
11. **22,0–24,0 s · "Which way is Zip flying?" (đọc vào phách) – Zip bay lùi ngang khung ra phải; chữ móc trở lại; "rewind", Zip lao tới lại như khung đầu** (Bouncy Rhythm, 120 (cảm giác 240) BPM): Phi ngựa (nhịp kép) 120 BPM theo chuyến bay ngang khung; cú "rewind" cuối kéo nhạc về hợp âm Rê giáng của khung đầu nên vòng lặp liền. *Vào cảnh:* trống dồn.

## Chuyển cảnh âm thanh

| Giây | Từ → sang | Cách chuyển | BPM |
|---|---|---|---|
| 3,2 | móc · phanh kít, bay lùi → "Let's zoom in!" | trống dồn | 120 → 126 |
| 4,5 | "Let's zoom in!" → kính · bay lùi | trống dồn | 126 → 108 |
| 7,0 | kính · bay lùi → kính · đứng yên | vuốt đàn hạc | 108 |
| 9,1 | kính · đứng yên → soi chậm · điệp khúc 1 | riser + chũm chọe ngược | 108 → 120 |
| 12,2 | soi chậm · điệp khúc 1 → chụp → sổ | viết tay (stinger, khựng, nhạc hiệu) | 120 |
| 13,1 | chụp → sổ → sổ · Albie | viết tay (stinger, khựng, nhạc hiệu) | 120 → 112 |
| 15,8 | sổ · Albie → gag · dang tay đi lùi "bíp bíp" | còi trượt xuống "bwomp" | 112 |
| 17,5 | gag · dang tay đi lùi "bíp bíp" → "Watch the corners!" | nhấn "ta!" ở dải cao (đổi cảnh dưới lời) | 112 → 116 |
| 19,0 | "Watch the corners!" → điệp khúc 2 | nốt mồi của nhạc cụ mới | 116 → 120 |
| 22,0 | điệp khúc 2 → câu hỏi · vòng lặp | trống dồn | 120 |

## Chống trùng lặp

- 11 cảnh nhạc (10 cảnh có điệu, còn lại là khựng / nhạc hiệu viết tay).
- 7 phong cách nhạc: Playful Cartoon ×2, Happy Kids ×2, Funny Comedy ×2, Magical Adventure ×1, Cute & Sweet ×1, Epic Cartoon ×1, Bouncy Rhythm ×1.
- 9 nhạc cụ hát chính: trumpet ×2, trống thép ×1, vibraphone ×1, sáo ×1, glockenspiel ×1, kazoo ×1, accordion ×1, bassoon ×1, xylophone ×1.
- 12 họ nhạc cụ: bass, bộ gõ, chuông, dây pizzicato, kèn gỗ, kèn đồng, marimba, nhạc cụ hoạt hình, piano, ukulele, xylophone, đàn hạc.
- BPM: 108, 112, 116, 120, 126 (5 mức).
- Chuyển cảnh: trống dồn ×3, viết tay (stinger, khựng, nhạc hiệu) ×2, vuốt đàn hạc ×1, riser + chũm chọe ngược ×1, còi trượt xuống "bwomp" ×1, nhấn "ta!" ở dải cao (đổi cảnh dưới lời) ×1, nốt mồi của nhạc cụ mới ×1.
- Câu đáp của nhạc giữa các câu thoại: 6.

## Music Timeline

> Task.md mục 8B. Cột Vocal Style lấy từ kiểu hát của từng câu (`sing.mode` trong `timeline.js`); SFX từ `events.json`.

| Thời gian | Cảnh | Background Music | Vocal Style | SFX |
|---|---|---|---|---|
| 0,0–3,2 s | Zip lao tới, phanh kít trước kính rồi bay giật lùi, hai lần; "Could you fly backwards?" (đọc vào phách); Miss Loupe hoa mắt | Playful Cartoon: reggae one-drop, Db, 120 BPM, giai điệu trống thép · theo bài hát | L01 loupe: nói | boing + pop từng chữ ×2, brake ×2, reverse ×2, pop chữ móc, giật mình, +3 tiếng khác |
| 3,2–4,5 s | Máy hạ xuống, Miss Loupe lắc đầu cho hết hoa mắt: "Let's zoom in!" (câu cửa miệng, vào phách), kính bật về phía máy | Happy Kids: pop nảy, Db, 126 BPM, giai điệu vibraphone · theo bài hát | L02 loupe: nói | whoosh lao vào kính |
| 4,5–7,0 s | Trong kính lớn Zip bay lùi, đuôi đi trước: "Dragonflies can fly backwards!" (sing-talk); chữ BACKWARDS! | Magical Adventure: phiêu lưu nước kiệu, Db, 108 BPM, giai điệu sáo · theo bài hát | L03 loupe: nói | lensback, textpop, brake, still |
| 7,0–9,1 s | Zip phanh, đứng yên giữa trời trên đường chấm chấm, quay mặt ra: "And stay still in the air!" (đọc vào phách); chữ STILL! | Cute & Sweet: rải lơ lửng, Db, 108 BPM, giai điệu glockenspiel · theo bài hát | L04 loupe: nói | textpop, slowmo |
| 9,1–12,2 s | Soi chậm: cánh trước (chanh) lên khi cánh sau (hồng) xuống, mũi tên bật theo nhịp; điệp khúc lần 1 "Front wings up, back wings down!" | Epic Cartoon: reggae one-drop, Db, 120 BPM, giai điệu trumpet · theo bài hát | L05 loupe: nói | stroke ×5, textpop, lấp lánh vào điệp khúc, lấp lánh |
| 12,2–13,1 s | Kính "chụp" Zip đang đứng yên, sticker hiện trên trang sổ | Khựng · Happy Kids | không lời | chụp sticker, whoosh xuyên kính, whoosh lùi ra sổ, lật trang, whoosh mỏng |
| 13,1–15,8 s | Sticker "Flies backwards!" dán vào sổ; Zip đứng yên cho Albie đếm chân: "Six legs? In you go!", Zip lùi đuôi vào trang đúng "go!" | Playful Cartoon: reggae one-drop, Db, 112 BPM, giai điệu kazoo | L06 albie: nói | countA ×3, dán sticker, ding, zip vút, tailin, +2 tiếng khác |
| 15,8–17,5 s | Lật trang về lối cỏ: Miss Loupe dang tay làm cánh, bước lùi kêu "bíp bíp", không thấy Albie sau lưng; accordion thổi chủ đề của tập | Funny Comedy: nảy lệch phách, Db, 112 BPM, giai điệu accordion | không lời | beep ×3, lật trang, wingsup, bước chân, notice |
| 17,5–19,0 s | Bộp! Lưng Miss Loupe chạm góc sách của Albie: "Watch the corners!" (nói); góc sách lấp lánh, Miss Loupe đỏ mặt cười | Funny Comedy: polka, Db, 116 BPM, giai điệu bassoon | L08 albie: nói | bonk (va nhẹ), stars, loé sáng |
| 19,0–22,0 s | Điệp khúc lần 2: Zip trôi vào giữa, đập cánh so le (tô hai màu, mũi tên lên / xuống); Miss Loupe vỗ tay như cánh, Albie nhún | Happy Kids: reggae one-drop, Db, 120 BPM, giai điệu trumpet · theo bài hát | L08 albie: nói<br>L09 loupe: nói | flap ×4, lấp lánh vào điệp khúc |
| 22,0–24,0 s | "Which way is Zip flying?" (đọc vào phách) – Zip bay lùi ngang khung ra phải; chữ móc trở lại; "rewind", Zip lao tới lại như khung đầu | Bouncy Rhythm: phi ngựa (nhịp kép), Db, 120 (cảm giác 240) BPM, giai điệu xylophone · theo bài hát | L10 loupe: nói | nhảy (boing + whoosh) ×2, reverseout, chữ móc trở lại, zipin |

## Sing-along Dialogue

> Task.md mục 8C. Nốt do `_shared/song.js` giải từ `sing.notes`; giọng hát do `_shared/sing.py` làm từ chính giọng TTS của nhân vật.

| Câu | Ai | Lời | Kiểu | Giai điệu (nốt · giây) | Điệp khúc | Nhấn |
|---|---|---|---|---|---|---|
| L01 (0,4 s) | loupe | Could you fly backwards? | nói | — |  | fly, backwards |
| L02 (3,4 s) | loupe | Let's zoom in! | nói | — |  | zoom |
| L03 (4,7 s) | loupe | Dragonflies can fly backwards! | nói | — |  | dragonflies, backwards |
| L04 (7,2 s) | loupe | And stay still in the air! | nói | — |  | still, air |
| L05 (9,4 s) | loupe | Front wings up, back wings down! | nói | — |  | front, up, back, down |
| L06 (13,3 s) | albie | Six legs? In you go! | nói | — |  | legs |
| L08 (17,6 s) | albie | Watch the corners! | nói | — |  | corners |
| L09 (19,4 s) | loupe | Front wings up, back wings down! | nói | — |  | front, up, back, down |
| L10 (22,1 s) | loupe | Which way is Zip flying? | nói | — |  | zip, flying |

Lời có nhịp hoặc giai điệu: **0%** số từ (0/42); nói tự nhiên 100%.

## Sound Effects Timeline

> Task.md mục 8E. Chuỗi nhịp có chủ đích ghi `run` trong `events.json` (qa: không tính là lặp máy móc).

| Giây | Tiếng | Chuỗi |
|---|---|---|
| 0,0 | pop chữ móc |  |
| 0,0 | boing + pop từng chữ |  |
| 0,1 | boing + pop từng chữ |  |
| 0,4 | brake |  |
| 0,4 | giật mình |  |
| 0,6 | reverse |  |
| 1,4 | hum |  |
| 1,9 | dash |  |
| 2,2 | brake |  |
| 2,3 | reverse |  |
| 2,5 | dizzy |  |
| 4,2 | whoosh lao vào kính |  |
| 4,9 | textpop |  |
| 5,5 | lensback |  |
| 6,8 | brake |  |
| 6,9 | still |  |
| 7,1 | textpop |  |
| 8,8 | slowmo |  |
| 9,1 | textpop |  |
| 9,5 | stroke | strokes |
| 9,5 | lấp lánh vào điệp khúc |  |
| 10,1 | stroke | strokes |
| 10,7 | stroke | strokes |
| 11,3 | stroke | strokes |
| 11,9 | lấp lánh |  |
| 12,0 | stroke | strokes |
| 12,2 | chụp sticker |  |
| 12,3 | whoosh xuyên kính |  |
| 12,6 | whoosh lùi ra sổ |  |
| 12,8 | whoosh mỏng |  |
| 12,9 | lật trang |  |
| 13,1 | dán sticker |  |
| 13,1 | ding |  |
| 13,2 | zip vút |  |
| 13,6 | countA | albiecount |
| 13,8 | countA | albiecount |
| 14,1 | countA | albiecount |
| 14,6 | tailin |  |
| 15,2 | ực |  |
| 15,3 | chuỗi pop |  |
| 15,8 | lật trang |  |
| 16,3 | wingsup |  |
| 16,5 | bước chân |  |
| 16,6 | beep | beeps |
| 16,7 | notice |  |
| 16,9 | beep | beeps |
| 17,2 | beep | beeps |
| 17,5 | bonk (va nhẹ) |  |
| 17,6 | stars |  |
| 18,5 | loé sáng |  |
| 19,5 | flap | flaps2 |
| 19,5 | lấp lánh vào điệp khúc |  |
| 20,1 | flap | flaps2 |
| 20,7 | flap | flaps2 |
| 21,4 | flap | flaps2 |
| 22,0 | nhảy (boing + whoosh) |  |
| 22,2 | reverseout |  |
| 22,4 | nhảy (boing + whoosh) |  |
| 23,0 | chữ móc trở lại |  |
| 23,4 | zipin |  |

## AI Music Generation Prompts

> Task.md mục 8D. Prompt tiếng Anh cho từng đoạn nhạc, sinh từ đúng thông số của cảnh (phong cách, BPM, giọng, nhạc cụ, năng lượng, cách chuyển).
> Chỉ để tham khảo hoặc làm bản nháp ngoài: nhạc trong phim vẫn tổng hợp bằng code (`groove.py`), giọng hát vẫn là giọng nhân vật.

**0,0–3,2 s · Zip lao tới, phanh kít trước kính rồi bay giật lùi, hai lần; "Could you fly backwards?" (đọc vào phách); Miss Loupe hoa mắt**

```
Genre: Playful Cartoon kids' music, reggae one-drop. Mood: cheerful, medium energy, major key (Db). BPM: 120.
Instruments: steel drum, electric piano, plucked bass, one-drop drums. Vocal style: Miss Loupe (cheerful woman, clear) spoken: "Could you fly backwards?".
Melody: lead steel drum answers in the gaps between lines; backing follows the vocal melody's chords, Db Gb. Voice stays on top: music ducks under every word.
Energy changes: steady; accent the first beat. Ending: hand over to the next scene with a drum fill. Length: 3.2 s.
```

**3,2–4,5 s · Máy hạ xuống, Miss Loupe lắc đầu cho hết hoa mắt: "Let's zoom in!" (câu cửa miệng, vào phách), kính bật về phía máy**

```
Genre: Happy Kids kids' music, bouncy two-step. Mood: cheerful, medium energy, major key (Db). BPM: 126.
Instruments: vibraphone, ukulele, plucked bass, kick, claps and hi-hat. Vocal style: Miss Loupe (cheerful woman, clear) spoken: "Let's zoom in!".
Melody: lead vibraphone answers in the gaps between lines; backing follows the vocal melody's chords, Gb Ab. Voice stays on top: music ducks under every word.
Energy changes: steady; accent the first beat. Ending: hand over to the next scene with a drum fill. Length: 1.2 s.
```

**4,5–7,0 s · Trong kính lớn Zip bay lùi, đuôi đi trước: "Dragonflies can fly backwards!" (sing-talk); chữ BACKWARDS!**

```
Genre: Magical Adventure kids' music, adventure quest. Mood: cheerful, medium energy, major key (Db). BPM: 108.
Instruments: flute, pizzicato strings, celesta, upright bass, soft toms. Vocal style: Miss Loupe (cheerful woman, clear) spoken: "Dragonflies can fly backwards!".
Melody: lead flute answers in the gaps between lines; backing follows the vocal melody's chords, Db Bbm Gb Ab. Voice stays on top: music ducks under every word.
Energy changes: builds; accent the first beat. Ending: hand over to the next scene with a harp glissando. Length: 2.5 s.
```

**7,0–9,1 s · Zip phanh, đứng yên giữa trời trên đường chấm chấm, quay mặt ra: "And stay still in the air!" (đọc vào phách); chữ STILL!**

```
Genre: Cute & Sweet kids' music, floating arpeggios. Mood: cheerful, medium energy, major key (Db). BPM: 108.
Instruments: glockenspiel, harp, upright bass, triangle and shaker. Vocal style: Miss Loupe (cheerful woman, clear) spoken: "And stay still in the air!".
Melody: lead glockenspiel answers in the gaps between lines; backing follows the vocal melody's chords, Gb Db. Voice stays on top: music ducks under every word.
Energy changes: builds; accent the first beat. Ending: hand over to the next scene with a riser with reverse cymbal. Length: 2.1 s.
```

**9,1–12,2 s · Soi chậm: cánh trước (chanh) lên khi cánh sau (hồng) xuống, mũi tên bật theo nhịp; điệp khúc lần 1 "Front wings up, back wings down!"**

```
Genre: Epic Cartoon kids' music, reggae one-drop. Mood: cheerful, high energy, major key (Db). BPM: 120.
Instruments: trumpet, piano, plucked bass, one-drop drums. Vocal style: Miss Loupe (cheerful woman, clear) spoken: "Front wings up, back wings down!".
Melody: lead trumpet answers in the gaps between lines; backing follows the vocal melody's chords, Db Ab Bbm Gb. Voice stays on top: music ducks under every word.
Energy changes: builds; accent the first beat. Ending: hand over to the next scene with a hand-written stinger. Length: 3.1 s.
```

**12,2–13,1 s · Kính "chụp" Zip đang đứng yên, sticker hiện trên trang sổ**

```
Genre: comic stop. Mood: cheerful, medium energy, major key (Db). BPM: —.
Instruments: harp, marimba. Vocal style: instrumental only (no vocals).
Melody: lead harp answers in the gaps between lines. Voice stays on top: music ducks under every word.
Energy changes: steady; accent the first beat. Ending: hold a thin vibraphone shimmer, then resume. Length: 0.9 s.
```

**13,1–15,8 s · Sticker "Flies backwards!" dán vào sổ; Zip đứng yên cho Albie đếm chân: "Six legs? In you go!", Zip lùi đuôi vào trang đúng "go!"**

```
Genre: Playful Cartoon kids' music, reggae one-drop. Mood: cheerful, medium energy, major key (Db). BPM: 112.
Instruments: kazoo, ukulele, plucked bass, one-drop drums. Vocal style: Albie (warm low man) spoken: "Six legs? In you go!".
Melody: lead kazoo answers in the gaps between lines. Voice stays on top: music ducks under every word.
Energy changes: steady; accent the first beat. Ending: hand over to the next scene with a slide-whistle drop. Length: 2.8 s.
```

**15,8–17,5 s · Lật trang về lối cỏ: Miss Loupe dang tay làm cánh, bước lùi kêu "bíp bíp", không thấy Albie sau lưng; accordion thổi chủ đề của tập**

```
Genre: Funny Comedy kids' music, hopping off-beat groove. Mood: cheerful, medium energy, major key (Db). BPM: 112.
Instruments: accordion, pizzicato strings, tuba, two-tone wood blocks. Vocal style: instrumental only (no vocals).
Melody: lead accordion answers in the gaps between lines. Voice stays on top: music ducks under every word.
Energy changes: steady; accent the first beat. Ending: hand over to the next scene with bump. Length: 1.7 s.
```

**17,5–19,0 s · Bộp! Lưng Miss Loupe chạm góc sách của Albie: "Watch the corners!" (nói); góc sách lấp lánh, Miss Loupe đỏ mặt cười**

```
Genre: Funny Comedy kids' music, polka. Mood: cheerful, medium energy, major key (Db). BPM: 116.
Instruments: bassoon, marimba, plucked bass, hand claps and tambourine. Vocal style: Albie (warm low man) spoken: "Watch the corners!".
Melody: lead bassoon answers in the gaps between lines. Voice stays on top: music ducks under every word.
Energy changes: steady; accent the first beat. Ending: hand over to the next scene with pickup notes of the next instrument. Length: 1.5 s.
```

**19,0–22,0 s · Điệp khúc lần 2: Zip trôi vào giữa, đập cánh so le (tô hai màu, mũi tên lên / xuống); Miss Loupe vỗ tay như cánh, Albie nhún**

```
Genre: Happy Kids kids' music, reggae one-drop. Mood: cheerful, high energy, major key (Db). BPM: 120.
Instruments: trumpet, piano, plucked bass, one-drop drums. Vocal style: Albie (warm low man) spoken: "Watch the corners!"; Miss Loupe (cheerful woman, clear) spoken: "Front wings up, back wings down!".
Melody: lead trumpet answers in the gaps between lines; backing follows the vocal melody's chords, Db Ab Db Gb. Voice stays on top: music ducks under every word.
Energy changes: steady; accent the first beat. Ending: hand over to the next scene with a drum fill. Length: 3.0 s.
```

**22,0–24,0 s · "Which way is Zip flying?" (đọc vào phách) – Zip bay lùi ngang khung ra phải; chữ móc trở lại; "rewind", Zip lao tới lại như khung đầu**

```
Genre: Bouncy Rhythm kids' music, gallop. Mood: cheerful, medium energy, major key (Db). BPM: 120 (cảm giác 240).
Instruments: xylophone, marimba, plucked bass, hand claps, shaker and wood blocks. Vocal style: Miss Loupe (cheerful woman, clear) spoken: "Which way is Zip flying?".
Melody: lead xylophone answers in the gaps between lines; backing follows the vocal melody's chords, Db Gb Db Ab. Voice stays on top: music ducks under every word.
Energy changes: steady; accent the first beat. Ending: end on the tonic chord so the loop returns to the first frame. Length: 2.0 s.
```

## Final Audio Checklist

> Task.md mục 8F: điền tay khi nghe lại cả phim.

- [ ] Nhạc có sinh động không? · [ ] Có thay đổi theo cảnh không? · [ ] Lời thoại có giai điệu không?
- [ ] Có đoạn nhạc dễ nhớ (điệp khúc, motif) không? · [ ] Giọng hát có rõ không? · [ ] Nhạc nền có lấn át giọng không?
- [ ] SFX có khớp hành động không? · [ ] Âm nhạc có tạo cảm xúc và giữ chân người xem không?

## Chống trùng lặp giữa các tập

So với 15 Short khác (001, 002, 003, 004, 005, 006, 007, 008, 009, 010, 011, 013, 014, 015, 016), từ `music-plan.json` của từng tập.

- **Điệu riêng của tập:** reggae one-drop, chiếm 50 % thời lượng.
- **Công thức trùng với Short khác:** không có.
- **Cặp điệu + nhạc cụ hát chính đã có ở Short khác:** phiêu lưu nước kiệu + sáo (014, 016); rải lơ lửng + glockenspiel (015); phi ngựa (nhịp kép) + xylophone (014).
- **Vui nhộn:** hồi hộp + khựng 0 %, cảnh nền giọng thứ 0 % thời lượng (mỗi mục ≤ 20 %).

## Thiết kế âm thanh theo cảnh (4 lớp)

> Task.md 18/11/2026 mục 5: mỗi cảnh 4 lớp Voice · Background Music · Sound Effects · Ambient. Sinh từ `out/scenes.json` (mức năng lượng và lớp nền khai báo ở `SCENES` trong `mix.py`), cảm xúc của câu (`emo` trong `timeline.js`) và `events.json`.

| Cảnh | Năng lượng | Lớp 1 · Voice | Lớp 2 · Music | Lớp 3 · SFX | Lớp 4 · Ambient |
|---|---|---|---|---|---|
| 0,0–3,2 s · hook | mạnh | L01 loupe · curious · half-sing | móc · phanh kít, bay lùi | brake, dash, dizzy, hum, reverse, startle, titlepop, wordpop | bãi cỏ: gió nhẹ, chim líu lo |
| 3,2–4,5 s · zoom | thường | L02 loupe · excited · half-sing | "Let's zoom in!" | zoom | bãi cỏ: gió nhẹ, chim líu lo |
| 4,5–7,0 s · backwards | thường | L03 loupe · surprised · sing-talk | kính · bay lùi | brake, lensback, still, textpop | bãi cỏ: gió nhẹ, chim líu lo |
| 7,0–9,1 s · still | êm | L04 loupe · calm · half-sing | kính · đứng yên | slowmo, textpop | bãi cỏ: gió nhẹ, chim líu lo |
| 9,1–12,3 s · slowmo | cao trào | L05 loupe · happy · sing | soi chậm · điệp khúc 1<br>chụp → sổ | chorus, snap, sparkle, stroke, textpop | bãi cỏ: gió nhẹ, chim líu lo |
| 12,3–16,3 s · album | thường | L06 albie · proud · speak | chụp → sổ<br>sổ · Albie<br>gag · dang tay đi lùi "bíp bíp" | countA, ding, flip, gulp, page, pops, stamp, swipe, tailin, zip, zoomin, zoomout | trang sổ / bản đồ: phòng yên tĩnh, giấy sột soạt |
| 16,3–19,0 s · gag | thường | L08 albie · playful · speak | gag · dang tay đi lùi "bíp bíp"<br>"Watch the corners!" | beep, bonk, glint, notice, stars, steps, wingsup | bãi cỏ: gió nhẹ, chim líu lo |
| 19,0–22,0 s · chorus2 | mạnh | L09 loupe · happy · sing | điệp khúc 2 | chorus, flap | bãi cỏ: gió nhẹ, chim líu lo |
| 22,0–24,0 s · cta | thường | L10 loupe · happy · half-sing | câu hỏi · vòng lặp | hop, recall, reverseout, zipin | bãi cỏ: gió nhẹ, chim líu lo |

## Đồng bộ hình – tiếng

`_shared/tools/av_sync.py` đo trên video: 17 điểm chuyển động mạnh, 100 % có tiếng động hoặc lời trong ± 0.2 s.

Các ngưỡng và kết quả kiểm: `python _shared/qa.py films/short-012` (nhóm "4 Âm thanh", "Sound Design Plan" và "10 Âm thanh theo cảnh").
