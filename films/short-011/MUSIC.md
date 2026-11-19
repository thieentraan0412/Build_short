# SHORT-011 · Soundtrack Timeline

> **Cập nhật 19/11/2026 (dựng lại theo chuẩn 11/2026b, như SHORT-016):** phần dưới đây mô tả bản 14/11/2026. "Tiptoe Cha-Cha" giờ là một bài hát (Si trưởng, 6 phần 108–132 BPM): 6/10 câu đọc vào phách, điệp khúc "Big eyes see almost all around!" ×2 (trumpet chơi giai điệu), chủ đề ở gag (bassoon); thêm cảnh nhạc "điệp khúc 2" và lớp nền / năng lượng theo cảnh. Phim 25 s. Bảng hiện hành: [`SOUND-PLAN.md`](SOUND-PLAN.md) (sinh từ `out/music.json`, `events.json`, `out/scenes.json`), [`TREATMENT.md`](TREATMENT.md) mục 7, 8, A và H.

## Màu nhạc của tập: "Tiptoe Cha-Cha"

Tập này là một trò **rình rập**: Crumb nhón chân giơ biển BOO! sau lưng Zip. Nhạc là một bài cha-cha-chá rón rén:
- **Điệu riêng của tập: cha-cha-chá** (`chacha`, `SIGNATURE` → short-011) với bộ gõ riêng `cha` (chuông bò, guiro, phách). "Một, hai, ba, **cha-cha**": mỗi bước nhón chân của Crumb rơi đúng phách 120 BPM của phim ở móc. Điệu này xuất hiện ở ba chỗ, mỗi chỗ một cách phối: móc (clarinet + marimba, 120 BPM), cao trào "almost all around!" (trumpet + piano chặn, 132 BPM, timpani), gag rình lần hai (bassoon + tuba, 112 BPM). Chiếm khoảng 31 % thời lượng.
- **Giọng Si trưởng**, kênh chưa dùng làm giọng chính (001 Đô · 002 Sol · 003 Rê thứ/Fa · 004 Fa · 005 La · 006 Mi · 007 Si giáng · 008 La giáng · 009 Rê · 010 Mi giáng). Cả tập ở giọng trưởng (Si, Mi), không có cảnh giọng thứ.
- **Nhạc cụ của nhân vật:** Crumb = **clarinet** rón rén (và bassoon khi rình lần hai); mắt Zip = **trống thép** lấp lánh; cú "bị thấy rồi!" là **mô-típ bí mật đô–mi–sol** của kênh (ở đây Si–Rê thăng–Fa thăng–Si) trên trống thép, có celesta lót.
- **Khoá kéo tách khung là một câu nhạc:** xylophone chạy nửa cung đi lên đúng theo con chạy của khoá kéo (13 nốt trong 0,5 s), đàn hạc vuốt khi hai khung mở ra.
- Dựng theo **Sound Design Plan** (`Groove(..., plan=True)`): 13 cảnh nhạc (9 cảnh lớp nhịp + 4 đoạn viết tay), 6 phong cách, 9 nhạc cụ hát chính, BPM 100–132. Bảng 7 cột, lý do từng cảnh và các chỗ chuyển: **[SOUND-PLAN.md](SOUND-PLAN.md)**.

| | 009 | 010 | **011** |
|---|---|---|---|
| Giọng | Rê trưởng | Mi giáng trưởng | **Si trưởng** |
| Điệu riêng | ska | samba | **cha-cha-chá** |
| Điểm riêng | Mỗi số đếm là một nốt marimba cao dần | Bay lùi là nhạc chạy lùi | **Khoá kéo là xylophone chạy lên; mắt Zip là trống thép** |
| Nhạc cụ của nhân vật | Kazoo = Fizz | Pizzicato = rón rén | **Clarinet = Crumb rón rén · trống thép = mắt Zip** |

**Chống trùng giữa các tập** (so với `music-plan.json` của 14 Short khác trong `films/`, kể cả 012–015 đang dựng song song): không cảnh nào trùng công thức (điệu + nhạc cụ hát chính + đệm + bộ gõ). Cảnh "Crumb thấy lưng Zip" ban đầu dùng phiêu lưu + sáo, nhưng 012 và 014 đã có cặp này, nên đổi sang vibraphone. Cảnh sổ là polka + accordion (kênh chưa có cặp này), cảnh gag và cao trào theo điệu riêng của tập.

## Điểm nhấn viết tay (`mix.py`)

| Giây | Điểm nhấn |
|---|---|
| 0,0 | Hợp âm Si (bass gảy + marimba rải) đúng khung 0; nối với nốt Fa thăng ở 21,75 s (vòng lặp) |
| 1,96 | Lá khô "rắc": clarinet kêu ba nốt chệch rồi một nốt cao "í" (Crumb đứng sững) |
| 3,70 | Ngay sau câu của Crumb: pizzicato nhón ba nốt + guiro (shaker) nối vào tiếng khoá kéo (không để tụt tiếng) |
| 3,87–4,35 | Khoá kéo: xylophone nửa cung đi lên 13 nốt; đàn hạc vuốt + triangle khi hai khung mở |
| 6,6 · 6,9 | Mắt Zip mở: trống thép rải Si trưởng đi lên; tầm nhìn nở rộng: đàn hạc vuốt chậm |
| 8,23 | Bị thấy rồi! Mô-típ bí mật trên trống thép (Si–Rê♯–Fa♯–Si), celesta lót |
| 9,66 | "Oh no!" → trombone "wah-wah" đi xuống; guiro (mõ) cạo nhỏ giữ nhịp khi Crumb nấp |
| 10,3 · 10,8 | Hai vòm mắt sáng: celesta lấp lánh; vệt sáng chạy quanh: đàn hạc vuốt dài |
| 12,9 | "Ồ!" sau câu giải thích: trống thép bốn nốt đi lên + trumpet hai nốt |
| 13,25 | "Chụp": marimba chạy lên (tiếng của kênh); đàn hạc vuốt qua mặt sticker; sticker: đàn hạc rải + celesta |
| 16,65 | Zip lao vào trang: xylophone trượt xuống |
| 18,3 | Zip quay lại: trống thép "ping" |
| 18,4 | Crumb tự giật mình: timpani + trumpet "ta!" |
| 18,9 | Ngã ngồi lên đệm cỏ: tuba "bwomp" đi xuống |
| 19,22 | Biển đáp lên đầu: xylophone "plink" hai nốt |
| 20,95 | Chữ móc trở lại: hợp âm Si nhỏ (ukulele) |

## Cường độ theo cảnh (`LEVEL`)

Dâng ở cú "rắc", lúc khoá kéo tách khung, lúc mắt Zip mở, cú "bị thấy rồi!", ngay sau câu giải thích, cú "chụp", cú Zip lao vào trang và cú giật mình. Hạ dưới mọi câu thoại (0,6–0,76) và ở chỗ khựng "Oh no!". Nhạc còn nhường giọng bằng `toon.duck` (dải chữ).
