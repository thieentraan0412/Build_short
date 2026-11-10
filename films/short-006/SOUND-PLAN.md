# SHORT-006 · Sound Design Plan

> Sinh tự động bằng `python _shared/tools/soundplan.py films/short-006` từ `out/music.json` (bảng cảnh nhạc khai báo trong `mix.py` bằng `G.sec` / `G.mark`) và `events.json`.
> Đừng sửa tay: sửa `what=`, `emo=`, `why=`, `mood=`, `arc=`, `bpm=`, `sfx=` trong `mix.py`, dựng lại rồi chạy lại công cụ. Quy tắc: [`QUALITY.md` §4](../../_shared/QUALITY.md#4-âm-thanh-và-nhạc-nền).

**Màu nhạc của tập:** "Barnyard Hoedown" (Mi trưởng). Chi tiết nhạc cụ, giọng và điểm nhấn viết tay: [`MUSIC.md`](MUSIC.md); bảng cue hình ↔ tiếng: [`SOUND.md`](SOUND.md).

## Cung bậc

- **Mở đầu** 0,0–4,8 s: Happy Kids, Bouncy Rhythm; 116–120 BPM; xylophone, trumpet bịt
- **Diễn biến** 4,8–8,5 s: Suspense & Surprise; 100 BPM; celesta
- **Cao trào** 8,5–12,2 s: Funny Comedy; 132 BPM; kazoo
- **Kết** 12,2–22,0 s: Happy Kids, Bouncy Rhythm; 112–136 BPM; piano đồ chơi, xylophone, clarinet

## Bảng thiết kế âm thanh

| Thời gian | Nội dung cảnh | Cảm xúc | Phong cách nhạc | Nhạc cụ | BPM | SFX |
|---|---|---|---|---|---|---|
| 0,0–3,2 s<br>*Mở đầu* | Crumb ôm con rệp: "What if your pet made you sweets?" – "My pet does!" | tò mò, vui · nhịp vừa | Happy Kids<br>đồng quê, E | **xylophone** (giai điệu) · banjo · tuba · gỗ (mõ, shaker) | 120 | boing + pop từng chữ ×2, pop chữ móc, va chạm hoạt hình, boing, giọt nước, +2 tiếng khác |
| 3,2–4,8 s<br>*Mở đầu* | Miss Loupe nhảy vào: "Let's zoom in!" | háo hức · nhịp nhanh | Bouncy Rhythm<br>phi ngựa (nhịp kép), E | **trumpet bịt** (giai điệu) · ukulele · tuba · đồ chơi (vỗ tay, shaker, phách gỗ) | 116 (cảm giác 232) | hút sột, nhảy (boing + whoosh), đáp xuống, blip "…" |
| 4,8–8,5 s<br>*Diễn biến* | Trong kính: Crumb gõ nhẹ con rệp, giọt ngọt phồng dần: "Some ants tap aphids for sweet drops!" | hồi hộp, chờ đợi · nhịp chậm | Suspense & Surprise<br>rón rén, C#m | **celesta** (giai điệu) · dây pizzicato · pizzicato trầm · gỗ (mõ, shaker) | 100 | gõ nhẹ ×2, whoosh lao vào kính, tiếng cười, dâng phép thuật |
| 8,5–12,2 s<br>*Cao trào* | Giọt ngọt "pop!", Crumb uống: "Like milking tiny cows!" – con rệp "clonk" | phấn khích, buồn cười · nhịp cao trào | Funny Comedy<br>đồng quê, E | **kazoo** (giai điệu) · banjo · tuba · mõ hai cao độ | 132 | pop, giọt nước, bẹp mềm, whoosh, chuỗi pop, +4 tiếng khác |
| 12,2–16,1 s<br>*Kết* | Sticker dán vào sổ; Albie: "Six legs? In you go!" – Crumb nhảy ùm vào trang | vui, tự hào · nhịp vừa | Happy Kids<br>ukulele nắng, A | **piano đồ chơi** (giai điệu) · ukulele · bass gảy · vỗ tay + lục lạc | 112 | chụp sticker, whoosh xuyên kính, whoosh lùi ra sổ, lật trang, whoosh mỏng, +6 tiếng khác |
| 16,1–19,3 s<br>*Kết* | Giọt ngọt nảy khỏi trang, Crumb đuổi theo: "Wait! Come back!" – giọt trúng mặt kính | tinh nghịch, náo nhiệt · nhịp nhanh | Bouncy Rhythm<br>polka, E | **xylophone** (giai điệu) · accordion · tuba · đồ chơi (vỗ tay, shaker, phách gỗ) | 136 | boing ×3, lật trang, bước chân, tink kính |
| 19,3–22,0 s<br>*Kết* | Mọi người cười: "What would YOUR pet make?" – về khung đầu | vui, mời gọi · nhịp vừa | Happy Kids<br>pop nảy, E | **clarinet** (giai điệu) · banjo · bass gảy · pop (kick, vỗ tay, hi-hat) | 120 | giọt nước, tiếng cười, chữ móc trở lại, boing, chuyển cảnh giọt |

## Vì sao chọn nhạc này

1. **0,0–3,2 s · Crumb ôm con rệp: "What if your pet made you sweets?" – "My pet does!"** (Happy Kids, 120 BPM): "Barnyard Hoedown": banjo, tuba "oom-pah", phách gỗ như vó ngựa; xylophone "ta-da" giữa hai câu.
2. **3,2–4,8 s · Miss Loupe nhảy vào: "Let's zoom in!"** (Bouncy Rhythm, 116 (cảm giác 232) BPM): Phi ngựa (nhịp kép) cho cú nhảy vào, banjo chạy lên (viết tay), trumpet bịt "wah" đáp sau "zoom in". *Vào cảnh:* trống dồn.
3. **4,8–8,5 s · Trong kính: Crumb gõ nhẹ con rệp, giọt ngọt phồng dần: "Some ants tap aphids for sweet drops!"** (Suspense & Surprise, 100 BPM): Rón rén 100 BPM ở Đô♯ thứ, pizzicato đi lên từng nốt theo giọt ngọt phồng (viết tay), celesta chờ. *Vào cảnh:* ngân đuôi, cảnh sau vào mềm.
4. **8,5–12,2 s · Giọt ngọt "pop!", Crumb uống: "Like milking tiny cows!" – con rệp "clonk"** (Funny Comedy, 132 BPM): Cao trào: đồng quê nhanh 132 BPM, kazoo "vè vè" như tiếng cười, mõ hai cao độ cho tiếng "clonk"; "pop!" là mô-típ bí mật Mi–Sol♯–Si (viết tay). *Vào cảnh:* trống dồn.
5. **12,2–16,1 s · Sticker dán vào sổ; Albie: "Six legs? In you go!" – Crumb nhảy ùm vào trang** (Happy Kids, 112 BPM): Ukulele quạt 112 BPM, vỗ tay, piano đồ chơi; xylophone trượt xuống khi Crumb nhảy ùm (viết tay). *Vào cảnh:* chuỗi nốt đi xuống.
6. **16,1–19,3 s · Giọt ngọt nảy khỏi trang, Crumb đuổi theo: "Wait! Come back!" – giọt trúng mặt kính** (Bouncy Rhythm, 136 BPM): Polka 136 BPM, accordion, mỗi cú nảy một nốt xylophone cao dần (viết tay), khựng khi giọt trúng kính. *Vào cảnh:* trống dồn.
7. **19,3–22,0 s · Mọi người cười: "What would YOUR pet make?" – về khung đầu** (Happy Kids, 120 BPM): Pop nảy nhẹ ở 120 BPM dẫn về hợp âm Mi của khung đầu; bỏ đệm để câu hỏi kết rõ, clarinet đáp. *Vào cảnh:* ngân đuôi, cảnh sau vào mềm.

## Chuyển cảnh âm thanh

| Giây | Từ → sang | Cách chuyển | BPM |
|---|---|---|---|
| 3,2 | móc · đồng quê → Miss Loupe vào · phi ngựa | trống dồn | 120 → 116 |
| 4,8 | Miss Loupe vào · phi ngựa → kính lớn · rón rén | ngân đuôi, cảnh sau vào mềm | 116 → 100 |
| 8,5 | kính lớn · rón rén → pop · tiny cows | trống dồn | 100 → 132 |
| 12,2 | pop · tiny cows → sổ · ukulele nắng | chuỗi nốt đi xuống | 132 → 112 |
| 16,1 | sổ · ukulele nắng → giọt nảy · polka | trống dồn | 112 → 136 |
| 19,3 | giọt nảy · polka → câu hỏi · về khung đầu | ngân đuôi, cảnh sau vào mềm | 136 → 120 |

## Chống trùng lặp

- 7 cảnh nhạc (7 cảnh có điệu, còn lại là khựng / nhạc hiệu viết tay).
- 4 phong cách nhạc: Happy Kids ×3, Bouncy Rhythm ×2, Suspense & Surprise ×1, Funny Comedy ×1.
- 6 nhạc cụ hát chính: xylophone ×2, trumpet bịt ×1, celesta ×1, kazoo ×1, piano đồ chơi ×1, clarinet ×1.
- 10 họ nhạc cụ: bass, bộ gõ, chuông, dây pizzicato, kèn gỗ, kèn đồng, nhạc cụ hoạt hình, piano, ukulele, xylophone.
- BPM: 100, 112, 116, 120, 132, 136 (6 mức).
- Chuyển cảnh: trống dồn ×3, ngân đuôi, cảnh sau vào mềm ×2, chuỗi nốt đi xuống ×1.
- Câu đáp của nhạc giữa các câu thoại: 8.

Các ngưỡng và kết quả kiểm: `python _shared/qa.py films/short-006` (nhóm "4 Âm thanh").
