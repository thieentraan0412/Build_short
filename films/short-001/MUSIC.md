# SHORT-001 · Soundtrack Timeline

## Lượt chống trùng giữa các tập (11/2026, lượt 2) · bản hiện hành

Điệu riêng của tập: **jig 12/8** (chân nhảy step-dance), chiếm 24 % thời lượng. Jig chia ba mỗi phách của phim, nên hình vẫn nhún đúng 120 BPM.

- **Ong nhảy (30–34 s):** swing "bee bop" viết tay (swing là điệu riêng của SHORT-003) → lớp nhịp jig: bass vo ve của ong, accordion "oom-cha-cha", trống bodhrán. Mô-típ bí mật chia ba trên sáo ở 31,0 s, xylophone đáp đi xuống ở 33,32 s.
- **Bản đồ (34–40 s):** pizzicato viết tay chạy chia ba (jig phiêu lưu) thay cho phi ngựa; kèn, chuông, riser giữ nguyên.
- **Albie (42–44,3 s):** shuffle + piano đồ chơi (trùng công thức với SHORT-009) → jig ukulele, accordion đáp.
- **Giữ nguyên:** giọng từng cảnh, mô-típ bí mật, cảnh dế ở La thứ bừng sang Đô trưởng (cách kể của tập), các đoạn tổ khúc viết tay khác.
- **Vui nhộn:** hồi hộp + khựng 20 %, giọng thứ 10 % thời lượng.

Kết quả: không cảnh nào trùng công thức (điệu + nhạc cụ hát chính + đệm + bộ gõ) với một Short khác. Số liệu ở mục "Chống trùng lặp giữa các tập" của [SOUND-PLAN.md](SOUND-PLAN.md); lý do và đề xuất cho cả kênh: [`PHAN-TICH-SHORTS/NHAC-NEN-KENH.md`](../../PHAN-TICH-SHORTS/NHAC-NEN-KENH.md). Hình không đổi: mp4 giữ nguyên luồng hình đã giao, chỉ thay tiếng. Các mục bên dưới mô tả các lượt trước; chỗ nào khác mục này thì theo mục này.

> **Bản hiện hành:** lượt Sound Design Plan (11/2026), ngay bên dưới; bảng đầy đủ ở [`SOUND-PLAN.md`](SOUND-PLAN.md). Lượt nhạc nền sinh động (11/2026, [mục cuối](#lượt-nhạc-nền-sinh-động-112026--bản-trước-sound-design-plan)) và các bảng cũ hơn giữ lại để so sánh; các điểm nhấn viết tay vẫn dùng.

Lượt nhạc nền theo `Task.md` (*Điều chỉnh nhạc nền sinh động*). Hình, lời, thời lượng 52,0 s và tiếng động giữ nguyên. Chỉ phần nhạc trong [mix.py](mix.py) được viết lại.
Bản trước: `out/short-001-v3.mp4`, `out/mix-v3.py`.

## Lượt Sound Design Plan (11/2026) · bản hiện hành

Nhạc của tập được dựng lại theo Sound Design Plan ([`QUALITY.md`](../../_shared/QUALITY.md) §4, các mục *(SDP)*): mỗi cảnh một phong cách nhạc, một BPM, một nhạc cụ hát chính, một cách chuyển cảnh. **Bảng đầy đủ 7 cột, lý do chọn nhạc từng cảnh và các chỗ chuyển cảnh: [`SOUND-PLAN.md`](SOUND-PLAN.md)** (sinh từ `mix.py` bằng `_shared/tools/soundplan.py`).

- **Phong cách nhạc (7):** Suspense & Surprise ×3, Magical Adventure ×3, Happy Kids ×2, Funny Comedy ×1, Playful Cartoon ×1, Epic Cartoon ×1, Cute & Sweet ×1.
- **BPM (4 mức):** 104, 112, 120, 126. Trước lượt này cả tập chạy 120 BPM. Giữ 120 BPM ở: rình · rón rén, giẫm · polka, bướm bay · đàn hạc 3+3+2, dế · rón rén trong đêm, tai ở chân · bừng sáng, ong · swing "bee bop", bản đồ · phiêu lưu, nhón chân (hình nhún theo phách, nốt viết tay theo lưới phim, hoặc nối vòng lặp).
- **Nhạc cụ hát chính (8):** xylophone, dây pizzicato, sáo, celesta, marimba, clarinet, kèn đồ chơi, piano đồ chơi. Hai cảnh kề nhau không cùng nhạc cụ.
- **Nhạc cụ và bộ gõ mới của lượt này:** piano đồ chơi, triangle.
- **Giữ nguyên:** màu nhạc và giọng của tập, mô-típ bí mật, nhạc hiệu, các điểm nhấn viết tay, cường độ theo cảnh (`LEVEL`), tiếng động và giọng.

Các bảng cảnh nhạc bên dưới là của các lượt trước, giữ lại để so sánh.

## Màu nhạc của tập: "Tổ khúc khu vườn"

Ba bí mật là ba bản nhạc nhỏ, mỗi bản một giọng, một điệu và một nhóm nhạc cụ, nối với nhau bằng chuyển cảnh qua kính:

| Cảnh | Giọng | Điệu | Nhạc cụ chính |
|---|---|---|---|
| Hook | C | Rón rén → cú giẫm → polka nảy | Pizzicato, xylophone, tuba, kèn |
| Bướm | F | Bay bổng, rải hợp âm lơi | Đàn hạc, sáo, celesta, ukulele |
| Dế | La thứ → C | Đêm rón rén, đáp án bừng sáng | Pizzicato staccato, kèn dăm trầm, tiếng dế làm bộ gõ |
| Ong | F | Jig 12/8 "bee hop" (trước: swing) | Bass vo ve, accordion "oom-cha-cha", bodhrán; sáo chơi mô-típ chia ba |
| Bản đồ | C | Phiêu lưu, chuyển động liên tục | Pizzicato chạy móc đơn, tom, kèn chơi mô-típ dãn dài |
| Sổ | C | Ấm áp, ăn mừng nhỏ | Hộp nhạc, ukulele, sáo |
| Kết | C | Nhón chân → ngắt nhạc → "ta-da" | Pizzicato, kèn, chuông |

Nhận diện của kênh vẫn giữ: nhạc hiệu 2 s không đổi; tiếng ukulele và marimba của ban nhạc kênh; và **mô-típ bí mật** đô–mi–sol đi lên (như "BIG SE-CRETS"). Mô-típ này xuất hiện ở mỗi phát hiện nhưng mỗi lần một cách chơi: celesta lơ lửng (bướm), celesta bừng sáng (tai dế), xylophone swing (ong), kèn dãn dài (bản đồ), sáo ấm (lời dặn cuối), kèn "ta-da" (kết).

## Timeline

| Thời gian | Cảnh | Phong cách | Nhạc | SFX đi kèm | Chuyển nhạc |
|---|---|---|---|---|---|
| 0,0–1,5 | Bàn chân rình cây kem, Flutter tròn mắt nhìn | Hook vui, có nhịp từ giây 0 | Kick mỗi phách, pizzicato trầm đi lên từng nửa cung, mõ gỗ phách lẻ; xylophone "hỏi" G–A–B; phím glock và bong bóng khi chữ bật ra ở khung đầu; tom dồn khi chân lấy đà | chữ bật, cánh, boop, lên dây cót, gió vút | Dồn vào cú giẫm |
| 1,5 | Giẫm bẹp | Cartoon impact | Cả dàn đánh C: kick, tuba, hợp âm pizzicato, kèn, chũm chọe | thump, bẹp kem, boing | Stinger |
| 1,5–2,0 | Miss Loupe sững sờ | Funny: ngắt nhạc | Chỉ còn hợp âm ngân | swipe, giọt kem | Khoảng ngắt nửa ô |
| 2,0–3,5 | "Butterflies can!", Flutter đậu | Funny bounce | Polka: tuba "oom", pizzicato "pah"; xylophone tíu tít sau chữ "can" | zíp, cánh vỗ, đậu, tink | |
| 3,5–4,0 | Kính nở thành tựa | Riser | Xylophone chạy lên | swell, chũm chọe ngược | Vào nhạc hiệu |
| 4,0–6,0 | Tựa | Nhạc hiệu kênh | Giữ nguyên | | Nhạc nền im |
| 6,0–9,6 | Flutter bay vào, đậu, "Let's zoom in!" | Exploration bay bổng | F: đàn hạc rải 3+3+2, pizzicato bass; sáo láy "vỗ cánh" ở các chỗ nghỉ lời | badge, cánh, đậu, swipe | Vào bằng chũm chọe mềm |
| 9,6–10,4 | Kính phóng to | Build | Pad dâng dưới riser | zoom | |
| 10,4–13,0 | Điểm nếm sáng | Scientific reveal | Mô-típ bí mật trên celesta (F–A–C), pad mở; nhịp thưa dưới lời dài | sparkle, bong bóng | |
| 13,0–14,25 | Kính lùi, chờ | Build | Pizzicato móc đơn đi lên | swish, trượt | Dồn vào SWEET! |
| 14,25–17,0 | SWEET! Time to eat! | Vui, nảy | F: ukulele, marimba (màu ban nhạc kênh), kick, clap; xylophone điểm | chime | Stinger ở 14,25 |
| 17,0–18,0 | Ngày → đêm | Transition | Hợp âm ngân, đàn hạc rơi xuống, chậm dần; kèn dăm trầm vào | nightfall | Crossfade sang La thứ |
| 18,0–21,3 | Đêm: "Where are its ears?" | Exploration bí ẩn | La thứ: pizzicato staccato rón rén, kèn dăm giữ nốt dài, tiếng dế làm bộ gõ; kèn dăm "hử?" sau câu hỏi | badge, chữ bật, swipe | |
| 21,3–23,0 | "On its head?" "Nope!" | Funny | Nhạc rút còn pizzicato; tuba "bwomp" trượt xuống ngay sau "Nope!" | buzzer | |
| 23,0–24,0 | Cô đang nghĩ | Brief pause | Khoảng lặng giữ nguyên | tích–tắc | Ngắt nhạc |
| 24,0–26,0 | Tai ở chân! | Scientific reveal | La thứ bừng sang C trưởng: celesta mô-típ bí mật, pad, chuông, bass C | reveal, pop | Đáp án là tiếng đầu tiên |
| 26,0–27,0 | Chirp nâng chân "nghe" | Funny | Pizzicato hỏi, tiếng dế đáp (hỏi–đáp) | trượt, swish | |
| 27,0–28,0 | Đêm → tổ ong | Transition | Pizzicato rung dồn, bass vo ve trượt vào | buzzin | |
| 28,0–30,0 | Waggle ú ớ | Funny, khựng | Một nốt bass vo ve; khoảng lặng 29–30 s giữ nguyên | pop, blip ×6 | |
| 30,0–34,0 | DANCE! | Funny / Action | F swing: bass vo ve đi bộ, chổi trống, clap 2–4, xylophone swing (mô-típ ở giữa câu) | dán | Stinger "DANCE!" |
| 34,0–39,0 | Kéo xa thành bản đồ, Rollo lăn | Action / phiêu lưu | C: pizzicato chạy móc đơn liên tục, tom, kèn chơi mô-típ dãn dài (đỉnh khi hoa đích nở 36,2 s), chuông rải; kèn dăm "Rollo" đi theo Rollo từ phải sang trái | pullback, ong bay, hoa nở, lăn | Cảnh không lời: nhạc đầy nhất |
| 39,0–40,0 | Hoa nở trùm màn hình | Transition | Riser, chổi trống cuộn | petals | |
| 40,0–40,5 | Albie ngủ | Emotional, ru | Hộp nhạc hai nốt | lật trang | |
| 40,5–42,0 | Ba sticker | Funny stingers | Mỗi sticker một hợp âm pizzicato cao dần C–F–G | dán ×3, boing | |
| 42,0–44,3 | "Six legs? In you go!" | Ấm, thưa | Ukulele phách 2–4, không bè trầm dưới giọng Albie | | |
| 44,3–47,5 | "Go outside with a grown-up…" | Emotional, ấm | Sáo chơi mô-típ ở chỗ nghỉ; ukulele C–Am–F–G, pad mỏng | | |
| 47,5–48,0 | Kính nở | Transition | Bốn nốt xylophone đi xuống | lensiris | |
| 48,0–49,0 | Flutter rón rén | Funny tiptoe | Pizzicato nhón chân, kèn dăm staccato | cánh | |
| 49,0–50,25 | Đậu lên kính: "Hey… is it tasting me?" | Brief pause | Ngắt nhạc | tap, tink ×4, slurp | Ngắt nhạc |
| 50,25–52,0 | Miss Loupe bật cười | Ending | Hai nốt dẫn → "ta-da": hợp âm C, kèn chơi mô-típ, chuông, chũm chọe; ngân hết tự nhiên | boing | Kết |

## Cường độ theo cảnh

Nhạc được nhân một đường cường độ (chuyển mềm 0,3 s), rồi mới nhường giọng (`toon.duck`). Nhạc hiệu giữ nguyên nốt và âm sắc, chỉ nhỏ hơn để câu "Big secrets of tiny bugs!" đọc cùng lúc vẫn rõ.

| Hook | Nhạc hiệu | Bướm | SWEET | Ngày → đêm | Dế | Đáp án | Sau đáp án | Ong khựng | DANCE | Bản đồ | Sổ | Lời dặn | Nhón chân | Ta-da |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0,75 | 0,52 | 0,9 | 1,0 | 0,9 | 0,85 | 1,0 | 0,9 | 0,7 | 0,95 | 0,9 | 1,0 | 0,95 | 0,9 | 0,85 |

Cảnh bản đồ không có lời nên nhạc đầy nhất ở đó; các cảnh có lời dài (bướm, dế, sổ) để nhạc thưa hơn dưới giọng.

## Kiểm tra bản cuối

- **Âm lượng:** −14,0 LUFS, đỉnh −1,6 dBFS, 52,0 s.
- **Whisper:** `small.en` 85/85 từ. `base.en` 84/85, vẫn là chỗ "In" → "and" ở câu của Albie như mọi bản trước.
- **Giọng so với nhạc** (dải 300–4000 Hz, trung vị theo câu): 12,5–35 dB. Câu mở đầu 15,5 dB, bằng bản trước.
- **Giọng so với mọi thứ còn lại** (nhạc + tiếng động + nền):
  - Rõ hơn bản trước ở tám câu, nhiều nhất là "Hey… is it tasting me?" (27,4 dB, trước 19,9), "Let's zoom in!" (19,9 / 14,2) và câu của Albie (18,3 / 15,1).
  - Kém hơn tối đa 2,5 dB ở các câu có stinger hoặc nhịp nhảy: "so they dance!" 14,5 (17,0), "The dance shows the way!" 15,6 (17,6), "Tiny taste spots…" 13,6 (15,2), câu mở 13,4 (14,7).
  - Thấp nhất là "Sweet! Time to eat!" 10,8 dB (trước 11,7) và "A cricket's ears…" 11,1 dB (trước 11,6). Whisper vẫn nghe đúng cả hai.
- **Chỗ hụt tiếng:** không có chỗ tụt quá 24 dB trong 50 ms.
- **Phổ:** phần trên 6 kHz chiếm 3,7% năng lượng (bản trước 3,5%), không chói hơn.

## Lượt nhạc nền sinh động (11/2026) · bản trước Sound Design Plan

Theo `Task.md`: *"Cần thêm nhiều nhạc nền sinh động, trong 1 short nhạc nền đang không có sự thay đổi."* Hình, lời, tiếng động và các điểm nhấn nhạc viết tay (mô-típ bí mật, stinger, khựng, nhạc hiệu, nối vòng lặp) giữ nguyên. Lớp đệm đứng yên được thay bằng **lớp nhịp theo cảnh** ([`_shared/audio/groove.py`](../../_shared/audio/groove.py)):
- **Mỗi cảnh một điệu.** Mỗi cảnh có điệu, vòng hoà âm, bộ nhạc cụ, bộ trống và mức năng lượng riêng. Hai cảnh kề nhau khác nhau ở ít nhất hai trong năm thứ đó.
- **Dưới lời nhạc vẫn chạy.** Dưới lời còn bass, kick, hat/shaker và tiếng đệm ngắn ở dải cao. Dưới giọng trầm của Albie thì bỏ bass.
- **Nhạc đáp lời.** Khoảng không lời giữa hai câu có một câu đáp ngắn của nhạc cụ hát chính.
- **Đổi cảnh có dấu.** Trước cảnh mạnh hơn có trống dồn, trước cảnh nhẹ hơn có chuỗi nốt đi xuống. Phách đầu cảnh mới có kick và chũm chọe mềm.

**Bản trước:** v5 (`out/mix-v5.py`, `out/MUSIC-v5.md`, `out/stem_mus-v4.wav`; video trước: `out/short-001-v2pre.mp4`, giống hệt bản đã giao).

**Vì sao nghe như không đổi.** Tổ khúc đã đổi giọng và điệu theo từng bí mật. Còn ba lớp đệm đứng yên: đàn hạc 3+3+2 chạy liền 8 s (6–14 s, kể cả lúc kính phóng to); "Time to eat!" chỉ có kick, clap, ukulele lặp một mẫu; cảnh sổ chỉ có vài tiếng ukulele và pad dưới lời của Albie và lời dặn.

**Bản mới.** Ba chỗ đó thành ba cảnh nhạc riêng:
- **Kính phóng to:** marimba rải lơ lửng, không trống, sáo đáp lời.
- **SWEET:** pop nảy theo màu ban nhạc kênh, marimba đáp sau câu.
- **Sổ:** shuffle ukulele dưới câu của Albie (không bass), rồi nửa nhịp ấm C · Am · F · G dưới lời dặn.

Các đoạn tổ khúc viết tay khác giữ nguyên và được ghi vào bảng cảnh bằng `G.mark`.

Bản này cũng là lần đầu SHORT-001 được dựng lại từ mã nguồn hiện tại. `film.js` và `timeline.js` đã sửa lúc 16:58 ngày 06/11 (chữ móc `hookTitle`, Flutter lơ lửng từ khung đầu, chữ móc trở lại `recall`), nhưng `short-001.mp4` vẫn là bản 09:08. Hình đã được render lại (`out/video.mp4`); readcheck đạt.

### Bảng cảnh nhạc

Sinh từ `out/music.json`. Cột *Nguồn*: "lớp nhịp" là phần `groove.py` dựng; "viết tay" là đoạn có sẵn trong `mix.py` (điểm nhấn, tổ khúc, nhạc hiệu). Các điểm nhấn viết tay ở bảng Timeline phía trên vẫn nằm trên lớp nhịp.

| Thời gian | Cảnh nhạc | Điệu | Hoà âm | Nhạc cụ | Trống | Năng lượng | Nguồn |
|---|---|---|---|---|---|---|---|
| 0–1,5 | rình · rón rén | rón rén | C | pizzicato, trống tom, xylophone | — | vừa | viết tay |
| 1,5–4 | giẫm · polka | polka | C | tuba, xylophone, pizzicato | — | đầy | viết tay |
| 4–6 | nhạc hiệu | nhạc hiệu | C | kèn đồ chơi, chuông, marimba | — | vừa | viết tay |
| 6–9,6 | bướm bay · đàn hạc 3+3+2 | đàn hạc lơi 3+3+2 | F | đàn hạc, pizzicato, sáo | — | vừa | viết tay |
| 9,6–13 | kính phóng to · marimba rải | rải lơ lửng | C · Dm · B♭ | pizzicato trầm, marimba, sáo | — | nhẹ | lớp nhịp |
| 13–14,25 | dồn vào SWEET | khựng / điểm nhấn viết tay | — | pizzicato | — | — | viết tay |
| 14,25–17 | SWEET · pop nảy | pop nảy | F · C | bass gảy, ukulele, marimba | kick, clap, shaker | đầy | lớp nhịp |
| 17–18 | ngày → đêm | khựng / điểm nhấn viết tay | — | đàn hạc, kèn dăm | — | — | viết tay |
| 18–23 | dế · rón rén trong đêm | rón rén | Am | pizzicato, tiếng dế, kèn dăm | — | nhẹ | viết tay |
| 23–24 | khựng trước đáp án | khựng / điểm nhấn viết tay | — | — | — | — | viết tay |
| 24–28 | tai ở chân · bừng sáng | rón rén | C | pizzicato, tiếng dế, hộp nhạc | — | đầy | viết tay |
| 28–30 | ong · ú ớ | khựng / điểm nhấn viết tay | — | bass vo ve | — | — | viết tay |
| 30–34 | ong · swing "bee bop" | swing | F | bass vo ve, xylophone, ukulele | — | đầy | viết tay |
| 34–40 | bản đồ · phiêu lưu | phi nước kiệu (nhịp kép) | C | pizzicato, chuông, kèn đồ chơi | — | đầy | viết tay |
| 40–42 | sổ · ba sticker | khựng / điểm nhấn viết tay | — | pizzicato, xylophone | — | — | viết tay |
| 42–44,3 | Albie · shuffle ukulele | shuffle nhún nhảy | C→Am | bass gảy, ukulele, xylophone | kick, clap, shaker | vừa | lớp nhịp |
| 44,3–47,5 | lời dặn · nửa nhịp ấm | nửa nhịp đung đưa | C→Am · F→G | pizzicato trầm, ukulele, sáo | kick, chổi trống, hat | vừa | lớp nhịp |
| 47,5–49 | nhón chân | rón rén | C | pizzicato, xylophone, kèn dăm | — | nhẹ | viết tay |
| 49–52 | khựng · ta-da | khựng / điểm nhấn viết tay | — | kèn đồ chơi, ukulele, chuông | — | — | viết tay |

### Số đo trước / sau

| | Bản trước | Bản mới |
|---|---|---|
| Số điệu trong phim | 7 cảnh tổ khúc | 9 điệu, 19 cảnh nhạc |
| Đoạn dài nhất cùng một kiểu | ≈ 8 s (đàn hạc 6–14 s) | 6,0 s (bản đồ, viết tay) |
| Câu đáp giữa các câu thoại | — | 11 (2 tự động, 9 viết tay) |
| Lời rõ hơn nhạc + tiếng động, câu thấp nhất | 10,8 dB ("Sweet! Time to eat!") | 10,7 dB ("A cricket's ears…", đoạn viết tay không đổi); "Sweet!" lên 11,7 dB |

Nốt mỗi giây được đếm từ các lệnh đặt nốt của `mix.py`; một hợp âm tính mỗi nốt một lần. Độ rõ lời đo theo `qa.py` (dải 300–4000 Hz, trung vị theo câu), trên cùng một stem giọng và tiếng động.

**`_shared/qa.py`: 33/33 đạt**, không còn cảnh báo. Độ to −14,1 LUFS, đỉnh thật −2,1 dBTP (`T.master(mix, 11.6)`, như SHORT-004: lần mux đầu đỉnh thật vọt lên −0,5 dBTP).
