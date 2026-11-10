# SHORT-007 · Sound Design Plan

> Sinh tự động bằng `python _shared/tools/soundplan.py films/short-007` từ `out/music.json` (bảng cảnh nhạc khai báo trong `mix.py` bằng `G.sec` / `G.mark`) và `events.json`.
> Đừng sửa tay: sửa `what=`, `emo=`, `why=`, `mood=`, `arc=`, `bpm=`, `sfx=` trong `mix.py`, dựng lại rồi chạy lại công cụ. Quy tắc: [`QUALITY.md` §4](../../_shared/QUALITY.md#4-âm-thanh-và-nhạc-nền).

**Màu nhạc của tập:** "Glow-Code Bossa" (Si giáng trưởng). Chi tiết nhạc cụ, giọng và điểm nhấn viết tay: [`MUSIC.md`](MUSIC.md); bảng cue hình ↔ tiếng: [`SOUND.md`](SOUND.md).

## Cung bậc

- **Mở đầu** 0,0–3,8 s: Playful Cartoon; 120 BPM; glockenspiel
- **Diễn biến** 3,8–25,2 s: Magical Adventure, Funny Comedy, Suspense & Surprise, Bouncy Rhythm; 96–126 BPM; sáo, bassoon, vibraphone, trumpet bịt, kazoo, celesta
- **Cao trào** 25,2–30,4 s: Epic Cartoon; 120 BPM; kèn đồ chơi
- **Kết** 30,4–44,0 s: Happy Kids, Suspense & Surprise, Bouncy Rhythm; 100–132 BPM; sáo, clarinet, marimba, glockenspiel

## Bảng thiết kế âm thanh

| Thời gian | Nội dung cảnh | Cảm xúc | Phong cách nhạc | Nhạc cụ | BPM | SFX |
|---|---|---|---|---|---|---|
| 0,0–3,0 s<br>*Mở đầu* | Blink vụt qua kính, Miss Loupe giật nảy; "Could your tummy glow?" – "My tummy can!", đuôi bùng sáng | bất ngờ, tò mò · nhịp vừa | Playful Cartoon<br>bossa nova, Bb | **glockenspiel** (giai điệu) · phím điện · bass gảy · rim click + shaker | 120 | boing + pop từng chữ ×2, nháy sáng (glock) ×2, pop chữ móc, zip vút, giật mình, +5 tiếng khác |
| 3,0–3,8 s<br>*Mở đầu* | Máy lao vào mặt kính, logo bật lên | phấn khích · nhịp bừng lên | Nhạc hiệu kênh | **marimba** (giai điệu) · kèn đồ chơi · chuông | 120 | whoosh lao vào kính, logo lấp lánh |
| 3,8–7,0 s<br>*Diễn biến* | "Let's zoom in!" Trong kính lớn, đèn đuôi của Blink sáng nhịp nhàng: "Fireflies make cold light!" | kỳ diệu, tò mò · nhịp chậm | Magical Adventure<br>rải lơ lửng, Bb | **sáo** (giai điệu) · celesta · contrabass | 100 | tíc tắc ×2, bước chân |
| 7,0–9,9 s<br>*Diễn biến* | Crumb hơ kẹo dẻo lên bụng Blink, chờ tíc tắc… "Look! No fire!" rồi nhồm nhoàm ăn | hài hước, chờ đợi · nhịp chậm | Funny Comedy<br>rón rén, Bb | **bassoon** (giai điệu) · dây pizzicato · pizzicato trầm · gỗ (mõ, shaker) | 108 | tíc tắc, "hử?", nhồm nhoàm |
| 9,9–12,3 s<br>*Diễn biến* | Sticker 1 bay lên ô; "Is a firefly a fly?" – bong bóng nghĩ hình con ruồi | hồi hộp, thắc mắc · nhịp chậm | Suspense & Surprise<br>nhịp tim hồi hộp, Gm | **vibraphone** (giai điệu) · dây pizzicato · contrabass · trống tom | 96 | chụp sticker, loé sáng, whoosh mỏng, sticker vào ô, bong bóng |
| 12,3–12,9 s<br>*Diễn biến* | Bong bóng nghĩ phồng lên… khựng | nín thở · nhịp khựng | Khựng (Suspense & Surprise) | lớp mỏng (khoảng lặng có chủ đích) | — | trống lăn thì thầm |
| 12,9–17,0 s<br>*Diễn biến* | "Nope!" Dot lăn vào: "I'm a little beetle!" – Blink và Dot cùng bật tấm cánh tách tách | bất ngờ, vui · nhịp nhanh | Bouncy Rhythm<br>nảy lệch phách, Bb | **trumpet bịt** (giai điệu) · marimba · bass gảy · bongo + shaker | 126 | tách tách (cánh) ×4, pop, nhảy (boing + whoosh), đáp xuống |
| 17,0–22,5 s<br>*Diễn biến* | "Blink, any more secrets?" – "No!" nhưng đuôi nháy lộ… "Okay, yes." | tinh nghịch, hài · nhịp chậm | Funny Comedy<br>rình rập hài, Eb | **kazoo** (giai điệu) · accordion · tuba · jazz (búng tay, hi-hat, chổi) | 104 | nháy sáng (glock) ×3, chụp sticker, loé sáng, whoosh mỏng, sticker vào ô, +2 tiếng khác |
| 22,5–25,2 s<br>*Diễn biến* | "Some fireflies flash a secret code!" Blink nháy ngắn-ngắn-dài, một bạn ở xa nháy đáp | kỳ diệu, bí ẩn · nhịp chậm | Magical Adventure<br>hộp nhạc lấp lánh, Bb | **celesta** (giai điệu) · phím điện · bass gảy · rim click + shaker | 112 | mật mã ánh sáng ×3, nháy đáp |
| 25,2–30,4 s<br>*Cao trào* | "Light up, everyone!" Cả vườn nháy theo nhịp dế của Chirp; Rollo lăn trên mặt trăng | phấn khích, vỡ oà · nhịp cao trào | Epic Cartoon<br>cao trào anh hùng, Bb | **kèn đồ chơi** (giai điệu) · piano · dàn dây spiccato · tuba · timpani + snare | 120 | nháy đồng loạt ×5, nháy đáp, whoosh, Rollo lăn |
| 30,4–34,4 s<br>*Kết* | Sticker thứ ba dán vào sổ; Albie đếm "1 2 3": "Six legs? In you go!", Blink lao vào trang | vui, thoả mãn · nhịp vừa | Happy Kids<br>bossa nova, F | **sáo** (giai điệu) · ukulele · bass gảy · rim click + shaker | 116 | đếm "1 2 3" ×3, chụp sticker, whoosh xuyên kính, whoosh lùi ra sổ, lật trang, +8 tiếng khác |
| 34,4–38,8 s<br>*Kết* | Ánh lóe trên kính nháy… "Is it winking at me?" | ngờ vực, buồn cười · nhịp chậm | Suspense & Surprise<br>rón rén, Gm | **clarinet** (giai điệu) · dây pizzicato · pizzicato trầm · mõ hai cao độ | 100 | nháy đáp ×3, loé sáng ×2, lật trang, nháy mắt |
| 38,8–42,3 s<br>*Kết* | Miss Loupe nháy mắt, đốm sáng nhỏ nháy đáp ba lần; Blink vui sướng | vui, ấm áp · nhịp nhanh | Bouncy Rhythm<br>bossa nova, Bb | **marimba** (giai điệu) · phím điện · bass gảy · rim click + shaker | 132 | loé sáng ×3, nháy đáp ×3, zip vút |
| 42,3–44,0 s<br>*Kết* | Chữ móc trở lại: "Can YOU blink a secret code?" rồi về khung đầu | háo hức, mời gọi · nhịp vừa | Happy Kids<br>pop nảy, Bb | **glockenspiel** (giai điệu) · đàn hạc · bass gảy · pop (kick, vỗ tay, hi-hat) | 120 | chữ móc trở lại, nháy sáng (glock), chuyển cảnh ánh sáng |

## Vì sao chọn nhạc này

1. **0,0–3,0 s · Blink vụt qua kính, Miss Loupe giật nảy; "Could your tummy glow?" – "My tummy can!", đuôi bùng sáng** (Playful Cartoon, 120 BPM): Điệu riêng của tập: bossa nova vào ngay giây 0 (rim clave, phím điện, bass gốc – năm) cho đêm vườn lấp lánh; glockenspiel là "tiếng của ánh sáng" xuyên suốt tập, nên móc giới thiệu nó trước.
2. **3,0–3,8 s · Máy lao vào mặt kính, logo bật lên** (Nhạc hiệu kênh, 120 BPM): Nhạc hiệu 0,8 s của kênh (kèn đồ chơi, marimba tí hon, chuông) ở nốt chủ Si giáng, nối thẳng vào cảnh sau. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
3. **3,8–7,0 s · "Let's zoom in!" Trong kính lớn, đèn đuôi của Blink sáng nhịp nhàng: "Fireflies make cold light!"** (Magical Adventure, 100 BPM): Lần đầu nhìn vào trong kính: chậm lại 100 BPM, celesta rải lơ lửng như ánh sáng lạnh, sáo hát trong khoảng nghỉ lời; Si giáng trưởng màu maj7 cho đêm kỳ diệu mà vẫn vui. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
4. **7,0–9,9 s · Crumb hơ kẹo dẻo lên bụng Blink, chờ tíc tắc… "Look! No fire!" rồi nhồm nhoàm ăn** (Funny Comedy, 108 BPM): Trò thử kẹo dẻo là gag nhỏ: pizzicato rón rén theo tiếng tíc tắc, bassoon trầm "bùm-bùm" đáp sau "No fire!", mõ gỗ giữ nhịp chờ. *Vào cảnh:* dâng lấp lánh.
5. **9,9–12,3 s · Sticker 1 bay lên ô; "Is a firefly a fly?" – bong bóng nghĩ hình con ruồi** (Suspense & Surprise, 96 BPM): Câu hỏi đánh đố: nhịp tim 96 BPM, trống tom và vibraphone run run giữ hồi hộp tới chỗ khựng ngay trước đáp án. *Vào cảnh:* ngân đuôi, cảnh sau vào mềm.
6. **12,3–12,9 s · Bong bóng nghĩ phồng lên… khựng** (Khựng (Suspense & Surprise), — BPM): Khoảng lặng có chủ đích 0,6 s (chỉ còn hợp âm rất nhỏ và trống lăn thì thầm) để "Nope!" bật ra rõ. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
7. **12,9–17,0 s · "Nope!" Dot lăn vào: "I'm a little beetle!" – Blink và Dot cùng bật tấm cánh tách tách** (Bouncy Rhythm, 126 BPM): Đáp án bật ra thành màn đồng diễn: nhảy lệch phách 126 BPM, marimba chặn hợp âm, bongo, trumpet bịt "wah" đáp theo mỗi cú bật cánh. *Vào cảnh:* viết tay (stinger, khựng, nhạc hiệu).
8. **17,0–22,5 s · "Blink, any more secrets?" – "No!" nhưng đuôi nháy lộ… "Okay, yes."** (Funny Comedy, 104 BPM): Tật chối "No!… okay, yes" là gag tính cách: điệu rình rập 104 BPM, tuba staccato, accordion búng nhẹ, kazoo "vè vè" như cười trộm. *Vào cảnh:* trống dồn.
9. **22,5–25,2 s · "Some fireflies flash a secret code!" Blink nháy ngắn-ngắn-dài, một bạn ở xa nháy đáp** (Magical Adventure, 112 BPM): Mật mã ánh sáng là một câu nhạc: hộp nhạc 3+3+2 trên phím điện, rim click của bossa, celesta đáp đúng lúc bạn ở xa nháy lại. *Vào cảnh:* dâng lấp lánh.
10. **25,2–30,4 s · "Light up, everyone!" Cả vườn nháy theo nhịp dế của Chirp; Rollo lăn trên mặt trăng** (Epic Cartoon, 120 BPM): Cao trào duy nhất của tập: dàn dây spiccato, kèn đồ chơi hát (không dùng trumpet như cao trào của 003), timpani và tiếng dế mỗi phách. Giữ 120 BPM vì mọi người nhún đúng phách của hình. *Vào cảnh:* trống dồn.
11. **30,4–34,4 s · Sticker thứ ba dán vào sổ; Albie đếm "1 2 3": "Six legs? In you go!", Blink lao vào trang** (Happy Kids, 116 BPM): Sau cao trào là niềm vui thu hoạch: bossa nova của tập trở lại, ukulele gảy kiểu guitar bossa, sáo đáp sau câu cửa miệng; dưới giọng trầm của Albie lớp nhịp tự bỏ bass. *Vào cảnh:* ngân đuôi, cảnh sau vào mềm.
12. **34,4–38,8 s · Ánh lóe trên kính nháy… "Is it winking at me?"** (Suspense & Surprise, 100 BPM): Gag cần im để nghe từng cú lóe: rón rén 100 BPM, mõ hai cao độ, clarinet hỏi "hử?" giữa các cú lóe. *Vào cảnh:* trống dồn.
13. **38,8–42,3 s · Miss Loupe nháy mắt, đốm sáng nhỏ nháy đáp ba lần; Blink vui sướng** (Bouncy Rhythm, 132 BPM): Gag được giải: bossa nhanh nhất tập (132 BPM), marimba reo theo ba cú nháy đáp, màu bossa của tập trở lại. (11/2026 lượt 2: thay calypso, điệu riêng của 002.) *Vào cảnh:* dâng lấp lánh.
14. **42,3–44,0 s · Chữ móc trở lại: "Can YOU blink a secret code?" rồi về khung đầu** (Happy Kids, 120 BPM): Lặp có chủ đích hoà âm Si giáng của móc ở 120 BPM để vòng lặp liền, nhưng đổi đệm sang đàn hạc và bộ gõ pop cho khác mở đầu. *Vào cảnh:* ngân đuôi, cảnh sau vào mềm.

## Chuyển cảnh âm thanh

| Giây | Từ → sang | Cách chuyển | BPM |
|---|---|---|---|
| 3,0 | móc · bossa lấp lánh → logo · nhạc hiệu 0,8 s | viết tay (stinger, khựng, nhạc hiệu) | 120 |
| 3,8 | logo · nhạc hiệu 0,8 s → bí mật 1 · ánh sáng lạnh | viết tay (stinger, khựng, nhạc hiệu) | 120 → 100 |
| 7,0 | bí mật 1 · ánh sáng lạnh → kẹo dẻo · tíc tắc | dâng lấp lánh | 100 → 108 |
| 9,9 | kẹo dẻo · tíc tắc → đom đóm là ruồi? · hồi hộp | ngân đuôi, cảnh sau vào mềm | 108 → 96 |
| 12,3 | đom đóm là ruồi? · hồi hộp → khựng trước "Nope!" | viết tay (stinger, khựng, nhạc hiệu) | 96 → 120 |
| 12,9 | khựng trước "Nope!" → họ bọ cánh cứng · đồng diễn | viết tay (stinger, khựng, nhạc hiệu) | 120 → 126 |
| 17,0 | họ bọ cánh cứng · đồng diễn → "No!" · lén lút | trống dồn | 126 → 104 |
| 22,5 | "No!" · lén lút → mật mã · lấp lánh | dâng lấp lánh | 104 → 112 |
| 25,2 | mật mã · lấp lánh → cả vườn · ban nhạc đêm | trống dồn | 112 → 120 |
| 30,4 | cả vườn · ban nhạc đêm → sổ · bossa sáo | ngân đuôi, cảnh sau vào mềm | 120 → 116 |
| 34,4 | sổ · bossa sáo → gag · đêm thì thầm | trống dồn | 116 → 100 |
| 38,8 | gag · đêm thì thầm → nháy đáp · vui | dâng lấp lánh | 100 → 132 |
| 42,3 | nháy đáp · vui → câu hỏi · về khung đầu | ngân đuôi, cảnh sau vào mềm | 132 → 120 |

## Chống trùng lặp

- 14 cảnh nhạc (12 cảnh có điệu, còn lại là khựng / nhạc hiệu viết tay).
- 7 phong cách nhạc: Magical Adventure ×2, Funny Comedy ×2, Suspense & Surprise ×2, Bouncy Rhythm ×2, Happy Kids ×2, Playful Cartoon ×1, Epic Cartoon ×1.
- 10 nhạc cụ hát chính: glockenspiel ×2, sáo ×2, bassoon ×1, vibraphone ×1, trumpet bịt ×1, kazoo ×1, celesta ×1, kèn đồ chơi ×1, clarinet ×1, marimba ×1.
- 12 họ nhạc cụ: bass, bộ gõ, chuông, dàn dây, dây pizzicato, kèn gỗ, kèn đồng, marimba, nhạc cụ hoạt hình, piano, ukulele, đàn hạc.
- BPM: 96, 100, 104, 108, 112, 116, 120, 126, 132 (9 mức).
- Chuyển cảnh: viết tay (stinger, khựng, nhạc hiệu) ×4, dâng lấp lánh ×3, ngân đuôi, cảnh sau vào mềm ×3, trống dồn ×3.
- Câu đáp của nhạc giữa các câu thoại: 16.

## Chống trùng lặp giữa các tập

So với 9 Short khác (001, 002, 003, 004, 005, 006, 008, 009, 010), từ `music-plan.json` của từng tập.

- **Điệu riêng của tập:** bossa nova, chiếm 24 % thời lượng.
- **Công thức trùng với Short khác:** không có.
- **Cặp điệu + nhạc cụ hát chính đã có ở Short khác:** rải lơ lửng + sáo (004); rón rén + bassoon (008); rình rập hài + kazoo (009); hộp nhạc lấp lánh + celesta (003); rón rén + clarinet (008).
- **Vui nhộn:** hồi hộp + khựng 17 %, cảnh nền giọng thứ 16 % thời lượng (mỗi mục ≤ 20 %).

Các ngưỡng và kết quả kiểm: `python _shared/qa.py films/short-007` (nhóm "4 Âm thanh" và "Sound Design Plan").
