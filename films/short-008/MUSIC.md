# SHORT-008 · Soundtrack Timeline

## Lượt chống trùng giữa các tập (11/2026, lượt 2) · bản hiện hành

Điệu riêng của tập: **disco** ("tiệc que phát sáng": ánh sáng mà không nóng), chiếm 25 % thời lượng.

- **Móc:** rình rập + bassoon (quá quen ở 002, 003, 005) → rón rén hài, marimba gõ "run cầm cập"; bassoon vẫn là cái lạnh.
- **"Let's zoom in!":** nảy lệch phách → disco 128 BPM, dàn dây chặn, marimba đáp.
- **Sổ:** ukulele nắng + piano đồ chơi (trùng công thức ở 5 tập) → disco 116 BPM, xylophone đáp.
- **"I'm not glowing!":** cao trào anh hùng + trumpet (trùng 003, 007, 009) → disco 132 BPM, trumpet hát, dàn dây chặn, timpani nhấn phách đầu.
- **Giữ nguyên:** phiêu lưu nước kiệu + celesta ở buồng sáng (SHORT-009 đã đổi); tiếng "chụp" của kênh.

Kết quả: không cảnh nào trùng công thức (điệu + nhạc cụ hát chính + đệm + bộ gõ) với một Short khác. Số liệu ở mục "Chống trùng lặp giữa các tập" của [SOUND-PLAN.md](SOUND-PLAN.md); lý do và đề xuất cho cả kênh: [`PHAN-TICH-SHORTS/NHAC-NEN-KENH.md`](../../PHAN-TICH-SHORTS/NHAC-NEN-KENH.md). Hình không đổi: mp4 giữ nguyên luồng hình đã giao, chỉ thay tiếng. Các mục bên dưới mô tả các lượt trước; chỗ nào khác mục này thì theo mục này.

## Màu nhạc của tập: "Campfire Glow"

Tập này là một đêm "cắm trại" lạnh, Blink làm lửa trại, nên nhạc là bài hát quanh lửa trại, và bí mật cũng là một câu nhạc:
- **Giọng La giáng trưởng**, lần đầu kênh dùng. Móc ở **Fa thứ** (giọng thứ cùng hoá biểu) cho cái lạnh; hợp âm Đô bảy ở cuối phim dẫn về Fa thứ của khung đầu nên vòng lặp liền.
- **Mỗi cú "pop" trong buồng sáng là một nốt glockenspiel**, đi lên theo thang ngũ cung La giáng, nhanh dần tới lúc bừng sáng: "các hạt trộn lại thành ánh sáng" nghe thành một câu nhạc đi lên.
- **Cái lạnh** là bassoon và pizzicato "run cầm cập", mõ hai cao độ gõ như răng va.
- **Cao trào gag** là "ta-da" kèn trumpet (`band.tada`) đặt **ngay sau** câu "I'm not glowing!", không đè lên chữ "glowing".
- Dựng theo **Sound Design Plan** (`Groove(..., plan=True)`): mỗi cảnh một phong cách nhạc, một BPM, một nhạc cụ hát chính, một cách chuyển. Bảng đầy đủ 7 cột, lý do từng cảnh và các chỗ chuyển cảnh: **[SOUND-PLAN.md](SOUND-PLAN.md)**.

| | 006 | 007 | **008** |
|---|---|---|---|
| Giọng | Mi trưởng | Si giáng trưởng | **La giáng trưởng (móc Fa thứ)** |
| Điệu | Đồng quê | Bossa, nảy latin | **10 điệu, 96–132 BPM (rình rập, dừng nhịp, nảy, phiêu lưu, rón rén, hộp nhạc, ukulele nắng, nửa nhịp, cao trào, shuffle)** |
| Giai điệu | Kèn dăm | Sáo, glockenspiel | **10 nhạc cụ hát chính, mỗi cảnh một: bassoon, xylophone, marimba, celesta, clarinet, vibraphone, piano đồ chơi, sáo, trumpet, glockenspiel** |
| Điểm riêng | Giọt ngọt "pop" | Mật mã ánh sáng là câu nhạc | **Mỗi cú pha trộn là một nốt glockenspiel đi lên** |

## Điểm nhấn viết tay (`mix.py`)

| Giây | Điểm nhấn |
|---|---|
| 0,0 | Hợp âm Fa thứ (bass gảy + pizzicato rải) đúng khung 0; nối với nốt Đô ở 21,75 s (vòng lặp) |
| 0,7–1,15 | Băng mọc trên tay: glockenspiel rơi xuống lạnh |
| 1,2 | Giật nảy "BRRR!": pizzicato chặn + bassoon trầm |
| 3,2 | Bùng sáng: kèn trumpet đi lên ba nốt + đàn hạc vuốt lên |
| 4,95 · 5,45 | Kính bật về phía máy: đàn hạc vuốt lên; lao vào đèn đuôi: dâng lấp lánh |
| 6,35–8,42 | Tám cú "pop": tám nốt glockenspiel đi lên (La giáng ngũ cung), kèm celesta nhỏ |
| 8,6 | Bừng sáng: đàn hạc rải hợp âm La giáng + chuông + bass |
| 10,25 | Nhiệt kế nhích một nấc: xylophone "tích" + mõ |
| 11,4 | Blink nháy mắt: celesta ba nốt |
| 11,9 | "Chụp": marimba chạy lên (ban nhạc kênh); đàn hạc vuốt lên rồi xuống qua mặt kính |
| 12,6 · 12,8 | Sticker: đàn hạc rải + hộp nhạc |
| 15,15 | Blink lao vào trang: xylophone trượt xuống |
| 15,85 | Lật trang: đàn hạc vuốt lên |
| 19,34 | "Ta-da!" kèn trumpet + timpani ngay sau "I'm not glowing!" |
| 19,75 | Ánh sáng dịu lại: glockenspiel đi xuống |
| 21,3 | Chữ móc trở lại: hợp âm La giáng của ukulele + celesta |

## Cường độ theo cảnh (`LEVEL`)

Dâng ở cú giật nảy, cú bùng sáng, cú bật kính, lúc bừng sáng, cú "chụp", cú Blink lao vào trang và ngay sau câu chối. Hạ dưới câu móc, dưới lời giải thích trong kính, dưới lời khen và câu hỏi kết. Nhạc còn nhường giọng bằng `toon.duck` (dải chữ −15 dB).
