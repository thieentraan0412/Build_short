# SHORT-001 · Sound Design Plan

> Sinh tự động bằng `python _shared/tools/soundplan.py films/short-001` từ `out/music.json` (bảng cảnh nhạc khai báo trong `mix.py` bằng `G.sec` / `G.mark`) và `events.json`.
> Đừng sửa tay: sửa `what=`, `emo=`, `why=`, `mood=`, `arc=`, `bpm=`, `sfx=` trong `mix.py`, dựng lại rồi chạy lại công cụ. Quy tắc: [`QUALITY.md` §4](../../_shared/QUALITY.md#4-âm-thanh-và-nhạc-nền).

**Màu nhạc của tập:** "Tổ khúc khu vườn" (Đô trưởng, mỗi cảnh một giọng). Chi tiết nhạc cụ, giọng và điểm nhấn viết tay: [`MUSIC.md`](MUSIC.md); bảng cue hình ↔ tiếng: [`SOUND.md`](SOUND.md).

## Cung bậc

- **Mở đầu** 0,0–6,0 s: Suspense & Surprise, Funny Comedy; 120 BPM; xylophone, dây pizzicato
- **Diễn biến** 6,0–34,0 s: Magical Adventure, Happy Kids, Suspense & Surprise, Playful Cartoon; 104–126 BPM; sáo, celesta, marimba, clarinet
- **Cao trào** 34,0–40,0 s: Epic Cartoon; 120 BPM; kèn đồ chơi
- **Kết** 40,0–52,0 s: Happy Kids, Cute & Sweet, Suspense & Surprise; 112–120 BPM; accordion, sáo, clarinet

## Bảng thiết kế âm thanh

| Thời gian | Nội dung cảnh | Cảm xúc | Phong cách nhạc | Nhạc cụ | BPM | SFX |
|---|---|---|---|---|---|---|
| 0,0–1,5 s<br>*Mở đầu* | Bàn chân rình trên hoa: "Can you taste with your feet?" | tò mò, hồi hộp · nhịp vừa | Suspense & Surprise<br>rón rén, C | **xylophone** (giai điệu) · dây pizzicato | 120 | boing + pop từng chữ ×2, pop chữ móc, cánh bướm vỗ, chuỗi pop, boop, +2 tiếng khác |
| 1,5–4,0 s<br>*Mở đầu* | Bàn chân giẫm "bẹp!", bướm bay ra: "Butterflies can!" | bất ngờ, hài hước · nhịp nhanh | Funny Comedy<br>polka, C | **dây pizzicato** (giai điệu) · tuba · xylophone | 120 | giọt nước ×3, tink kính ×2, giẫm, bẹp!, lò xo rung, +5 tiếng khác |
| 4,0–6,0 s<br>*Mở đầu* | "Big secrets of tiny bugs!" – logo | phấn khích · nhịp bừng lên | Nhạc hiệu kênh | **marimba** (giai điệu) · kèn đồ chơi · chuông | 120 | whoosh, xoáy phép thuật |
| 6,0–9,6 s<br>*Diễn biến* | "A butterfly lands on a flower." – "Let's zoom in!" | nhẹ nhàng, kỳ diệu · nhịp vừa | Magical Adventure<br>lơi 3+3+2, F | **sáo** (giai điệu) · đàn hạc · dây pizzicato | 120 | huy hiệu ding, cánh bướm vỗ, đáp xuống, boing, whoosh mỏng |
| 9,6–13,0 s<br>*Diễn biến* | Kính phóng to bàn chân bướm: "Tiny taste spots on its feet tell it right away:" | kỳ diệu, tập trung · nhịp chậm | Magical Adventure<br>rải lơ lửng, F | **celesta** (giai điệu) · marimba · pizzicato trầm | 104 | whoosh lao vào kính, lấp lánh, bong bóng |
| 13,0–14,2 s<br>*Diễn biến* | Chờ đáp án | nín thở · nhịp khựng | Khựng (Suspense & Surprise) | dây pizzicato | — | whoosh, trượt |
| 14,2–17,0 s<br>*Diễn biến* | "Sweet! Time to eat!" – Flutter cuộn vòi | vui sướng · nhịp nhanh | Happy Kids<br>pop nảy, F | **marimba** (giai điệu) · ukulele · bass gảy · đồ chơi (vỗ tay, shaker, phách gỗ) | 126 | chuông, whoosh |
| 17,0–18,0 s<br>*Diễn biến* | Trời tối dần, sang khu cỏ đêm | lắng lại · nhịp khựng | Khựng · Magical Adventure | **clarinet** (giai điệu) · đàn hạc | — | ngày → đêm |
| 18,0–23,0 s<br>*Diễn biến* | Chirp trong cỏ đêm: "What about crickets?" – "Where are its ears?" – "On its head?" – "Nope!" | tò mò, hồi hộp · nhịp chậm | Suspense & Surprise<br>rón rén, Am | **clarinet** (giai điệu) · dây pizzicato | 120 | chuỗi pop ×2, huy hiệu ding, whoosh mỏng, còi sai, whoosh |
| 23,0–24,0 s<br>*Diễn biến* | Khựng một nhịp trước đáp án | nín thở · nhịp khựng | Khựng (Suspense & Surprise) | lớp mỏng (khoảng lặng có chủ đích) | — | mõ ×2, cartoon hit |
| 24,0–28,0 s<br>*Diễn biến* | "A cricket's ears are on its front legs!" – Chirp nhấc chân "nghe" | ngạc nhiên, vui · nhịp nhanh | Magical Adventure<br>rón rén, C | **celesta** (giai điệu) · dây pizzicato | 120 | pop ×2, lộ ra (bất ngờ), whoosh, trượt, whoosh mỏng, +1 tiếng khác |
| 28,0–30,0 s<br>*Diễn biến* | "Honeybees can't talk," – Waggle ú ớ | buồn cười · nhịp khựng | Khựng · Funny Comedy | bass vo ve | — | blip "…" ×6, huy hiệu ding, pop |
| 30,0–34,0 s<br>*Diễn biến* | "so they dance!" – Waggle nhảy điệu lắc | vui nhộn · nhịp nhanh | Playful Cartoon<br>jig 12/8, F | **sáo** (giai điệu) · accordion · bass vo ve · trống bodhrán + shaker | 120 | dán sticker |
| 34,0–40,0 s<br>*Cao trào* | Bản đồ điệu nhảy: đường bay dẫn tới bông hoa đích nở trùm màn hình; Rollo lăn qua | phiêu lưu, vỡ oà · nhịp cao trào | Epic Cartoon<br>jig 12/8, C | **kèn đồ chơi** (giai điệu) · dây pizzicato · chuông | 120 | chuỗi pop ×2, whoosh kéo xa, ong bay vụt, hoa nở, Rollo lăn, +1 tiếng khác |
| 40,0–42,0 s<br>*Kết* | Albie còn ngủ; ba sticker dán lên trang | hài lòng · nhịp khựng | Khựng · Happy Kids | **xylophone** (giai điệu) · dây pizzicato | — | whoosh mỏng ×3, dán sticker ×3, lật trang ×2, boing |
| 42,0–44,3 s<br>*Kết* | Albie: "Six legs? In you go!" | vui, tự hào · nhịp vừa | Happy Kids<br>jig 12/8, C | **accordion** (giai điệu) · ukulele · bass gảy · trống bodhrán + shaker | 112 | — |
| 44,3–47,5 s<br>*Kết* | "Go outside with a grown-up, and look closely!" | ấm áp, dặn dò · nhịp chậm | Cute & Sweet<br>nửa nhịp đung đưa, C | **sáo** (giai điệu) · ukulele · pizzicato trầm · triangle + shaker | 112 (cảm giác 56) | — |
| 47,5–49,0 s<br>*Kết* | Kính nở, Flutter nhón chân bước vào | tò mò · nhịp chậm | Suspense & Surprise<br>rón rén, C | **clarinet** (giai điệu) · dây pizzicato · xylophone | 120 | chuyển cảnh qua kính, cánh bướm vỗ |
| 49,0–52,0 s<br>*Kết* | Flutter đậu lên kính: "Hey... is it tasting me?" – cười, chữ móc trở lại | bất ngờ, buồn cười · nhịp khựng | Khựng · Funny Comedy | **chuông** (giai điệu) · kèn đồ chơi · ukulele | — | tink kính ×4, gõ nhẹ, hút sột, boing, chữ móc trở lại |

## Vì sao chọn nhạc này

1. **0,0–1,5 s · Bàn chân rình trên hoa: "Can you taste with your feet?"** (Suspense & Surprise, 120 BPM): Pizzicato trầm đi lên từng nửa cung như bàn chân đang rình, kick mỗi phách, trống dồn khi chân lấy đà; xylophone "hỏi" đi lên.
2. **1,5–4,0 s · Bàn chân giẫm "bẹp!", bướm bay ra: "Butterflies can!"** (Funny Comedy, 120 BPM): Cú giẫm là cú đánh của cả dàn (tuba, pizzicato, kèn đồ chơi, chũm chọe), rồi polka "oom-pah" nảy; xylophone tíu tít sau chữ "can". *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
3. **4,0–6,0 s · "Big secrets of tiny bugs!" – logo** (Nhạc hiệu kênh, 120 BPM): Nhạc hiệu 2 s của kênh (tập trước 11/2026), giống hệt mọi tập. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
4. **6,0–9,6 s · "A butterfly lands on a flower." – "Let's zoom in!"** (Magical Adventure, 120 BPM): Sang Fa, đàn hạc rải lơi 3+3+2 như cánh bướm, sáo láy vỗ cánh khi Flutter bay vào và đáp khi đậu lên hoa. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
5. **9,6–13,0 s · Kính phóng to bàn chân bướm: "Tiny taste spots on its feet tell it right away:"** (Magical Adventure, 104 BPM): Chậm lại 104 BPM, marimba rải bí ẩn; mô-típ bí mật lơ lửng trên celesta (viết tay) đúng lúc điểm nếm sáng. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
6. **13,0–14,2 s · Chờ đáp án** (Khựng (Suspense & Surprise), — BPM): Pizzicato dồn đi lên tám nốt, to dần vào chữ SWEET. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
7. **14,2–17,0 s · "Sweet! Time to eat!" – Flutter cuộn vòi** (Happy Kids, 126 BPM): Đáp án bừng lên thành pop nảy 126 BPM ở màu ban nhạc kênh (ukulele, marimba, kick, vỗ tay); marimba đáp sau câu. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
8. **17,0–18,0 s · Trời tối dần, sang khu cỏ đêm** (Khựng · Magical Adventure, — BPM): Đàn hạc rơi xuống chậm dần, kèn dăm trầm: chuyển sang đêm không cắt cụt. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
9. **18,0–23,0 s · Chirp trong cỏ đêm: "What about crickets?" – "Where are its ears?" – "On its head?" – "Nope!"** (Suspense & Surprise, 120 BPM): La thứ, pizzicato staccato rón rén, tiếng dế làm bộ gõ đúng phách của hình; kèn dăm "hử?" sau câu hỏi, tuba "bwomp" sau "Nope!". *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
10. **23,0–24,0 s · Khựng một nhịp trước đáp án** (Khựng (Suspense & Surprise), — BPM): Khoảng lặng có chủ đích ≤ 1 s để đáp án bật ra. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
11. **24,0–28,0 s · "A cricket's ears are on its front legs!" – Chirp nhấc chân "nghe"** (Magical Adventure, 120 BPM): La thứ bừng sang Đô trưởng, mô-típ bí mật trên celesta, chuông; pizzicato hỏi – đáp với tiếng dế khi Chirp nhấc chân. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
12. **28,0–30,0 s · "Honeybees can't talk," – Waggle ú ớ** (Khựng · Funny Comedy, — BPM): Gần như ngắt nhạc: chỉ còn ong vo ve trầm và hợp âm mỏng chờ "so they dance!". *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
13. **30,0–34,0 s · "so they dance!" – Waggle nhảy điệu lắc** (Playful Cartoon, 120 BPM): Điệu riêng của tập: jig 12/8 trên đúng phách của hình (mỗi phách chia ba), bass vo ve của ong, accordion "oom-cha-cha", trống bodhrán; sáo chơi mô-típ bí mật chia ba giữa hai câu, xylophone đáp đi xuống. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
14. **34,0–40,0 s · Bản đồ điệu nhảy: đường bay dẫn tới bông hoa đích nở trùm màn hình; Rollo lăn qua** (Epic Cartoon, 120 BPM): Cao trào của tập (cảnh không lời): jig phiêu lưu, pizzicato chia ba chạy liên tục, tom và kick, mô-típ bí mật dãn dài trên kèn, chuông rải khi hoa nở, riser vào sổ. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
15. **40,0–42,0 s · Albie còn ngủ; ba sticker dán lên trang** (Khựng · Happy Kids, — BPM): Hộp nhạc cho Albie ngủ, ba hợp âm Đô – Fa – Sol cao dần theo ba sticker. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
16. **42,0–44,3 s · Albie: "Six legs? In you go!"** (Happy Kids, 112 BPM): Jig ukulele 112 BPM (điệu riêng của tập trở lại ở sổ), không bè trầm dưới giọng trầm của Albie; accordion đáp sau câu cửa miệng. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
17. **44,3–47,5 s · "Go outside with a grown-up, and look closely!"** (Cute & Sweet, 112 (cảm giác 56) BPM): Nửa nhịp ấm 112 BPM (cảm giác 56) dưới lời dặn, triangle ở phách ba; sáo chơi mô-típ bí mật ngay trước câu (viết tay). *Vào cảnh:* ngân đuôi, cảnh sau vào mềm.
18. **47,5–49,0 s · Kính nở, Flutter nhón chân bước vào** (Suspense & Surprise, 120 BPM): Bốn nốt xylophone đi xuống như nhón chân bước vào, pizzicato và kèn dăm nhỏ dần. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
19. **49,0–52,0 s · Flutter đậu lên kính: "Hey... is it tasting me?" – cười, chữ móc trở lại** (Khựng · Funny Comedy, — BPM): Ngắt nhạc cho gag (chỉ còn hộp nhạc rón rén), rồi "ta-da": kèn chơi mô-típ bí mật, ukulele, chuông, chũm chọe. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).

## Chuyển cảnh âm thanh

| Giây | Từ → sang | Cách chuyển | BPM |
|---|---|---|---|
| 1,5 | rình · rón rén → giẫm · polka | viết tay (stinger, khựng, nhạc hiệu) | 120 |
| 4,0 | giẫm · polka → nhạc hiệu | viết tay (stinger, khựng, nhạc hiệu) | 120 |
| 6,0 | nhạc hiệu → bướm bay · đàn hạc 3+3+2 | viết tay (stinger, khựng, nhạc hiệu) | 120 |
| 9,6 | bướm bay · đàn hạc 3+3+2 → kính phóng to · marimba rải | viết tay (stinger, khựng, nhạc hiệu) | 120 → 104 |
| 13,0 | kính phóng to · marimba rải → dồn vào SWEET | viết tay (stinger, khựng, nhạc hiệu) | 104 → 120 |
| 14,2 | dồn vào SWEET → SWEET · pop nảy | viết tay (stinger, khựng, nhạc hiệu) | 120 → 126 |
| 17,0 | SWEET · pop nảy → ngày → đêm | viết tay (stinger, khựng, nhạc hiệu) | 126 → 120 |
| 18,0 | ngày → đêm → dế · rón rén trong đêm | viết tay (stinger, khựng, nhạc hiệu) | 120 |
| 23,0 | dế · rón rén trong đêm → khựng trước đáp án | viết tay (stinger, khựng, nhạc hiệu) | 120 |
| 24,0 | khựng trước đáp án → tai ở chân · bừng sáng | viết tay (stinger, khựng, nhạc hiệu) | 120 |
| 28,0 | tai ở chân · bừng sáng → ong · ú ớ | viết tay (stinger, khựng, nhạc hiệu) | 120 |
| 30,0 | ong · ú ớ → ong · jig "bee hop" | viết tay (stinger, khựng, nhạc hiệu) | 120 |
| 34,0 | ong · jig "bee hop" → bản đồ · jig phiêu lưu | viết tay (stinger, khựng, nhạc hiệu) | 120 |
| 40,0 | bản đồ · jig phiêu lưu → sổ · ba sticker | viết tay (stinger, khựng, nhạc hiệu) | 120 |
| 42,0 | sổ · ba sticker → Albie · jig ukulele | viết tay (stinger, khựng, nhạc hiệu) | 120 → 112 |
| 44,3 | Albie · jig ukulele → lời dặn · nửa nhịp ấm | ngân đuôi, cảnh sau vào mềm | 112 |
| 47,5 | lời dặn · nửa nhịp ấm → nhón chân | viết tay (stinger, khựng, nhạc hiệu) | 112 → 120 |
| 49,0 | nhón chân → khựng · ta-da | viết tay (stinger, khựng, nhạc hiệu) | 120 |

## Chống trùng lặp

- 19 cảnh nhạc (12 cảnh có điệu, còn lại là khựng / nhạc hiệu viết tay).
- 7 phong cách nhạc: Suspense & Surprise ×3, Magical Adventure ×3, Happy Kids ×2, Funny Comedy ×1, Playful Cartoon ×1, Epic Cartoon ×1, Cute & Sweet ×1.
- 8 nhạc cụ hát chính: sáo ×3, celesta ×2, clarinet ×2, xylophone ×1, dây pizzicato ×1, marimba ×1, kèn đồ chơi ×1, accordion ×1.
- 11 họ nhạc cụ: bass, bộ gõ, chuông, dây pizzicato, kèn gỗ, kèn đồng, marimba, nhạc cụ hoạt hình, ukulele, xylophone, đàn hạc.
- BPM: 104, 112, 120, 126 (4 mức).
- Chuyển cảnh: viết tay (stinger, khựng, nhạc hiệu) ×17, ngân đuôi, cảnh sau vào mềm ×1.
- Câu đáp của nhạc giữa các câu thoại: 11.

## Chống trùng lặp giữa các tập

So với 9 Short khác (002, 003, 004, 005, 006, 007, 008, 009, 010), từ `music-plan.json` của từng tập.

- **Điệu riêng của tập:** jig 12/8, chiếm 24 % thời lượng.
- **Công thức trùng với Short khác:** không có.
- **Cặp điệu + nhạc cụ hát chính đã có ở Short khác:** rải lơ lửng + celesta (002, 003); nửa nhịp đung đưa + sáo (008).
- **Vui nhộn:** hồi hộp + khựng 20 %, cảnh nền giọng thứ 10 % thời lượng (mỗi mục ≤ 20 %).

Các ngưỡng và kết quả kiểm: `python _shared/qa.py films/short-001` (nhóm "4 Âm thanh" và "Sound Design Plan").
