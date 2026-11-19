# SHORT-012 · Soundtrack Timeline

> **Cập nhật 19/11/2026 (dựng lại theo chuẩn 11/2026b, như SHORT-016):** phần dưới đây mô tả bản 14/11/2026. "Reverse-Gear Reggae" giờ là một bài hát (Rê giáng trưởng, 6 phần 108–126 BPM): 7/9 câu đọc vào phách, điệp khúc "Front wings up, back wings down!" ×2 (trumpet chơi giai điệu), chủ đề ở gag (accordion); gag không còn câu "I can go backwards too!"; thêm cảnh nhạc "điệp khúc 2" và lớp nền / năng lượng theo cảnh. Bảng hiện hành: [`SOUND-PLAN.md`](SOUND-PLAN.md) (sinh từ `out/music.json`, `events.json`, `out/scenes.json`), [`TREATMENT.md`](TREATMENT.md) mục 7, 8, A và H.

## Màu nhạc của tập: "Reverse-Gear Reggae"

Tập này nói về **bay lùi** và **đứng yên giữa trời**, nên nhạc mượn văn hoá "rewind" của reggae sound-system: khi đám đông thích một đoạn, DJ kéo đĩa quay ngược rồi chơi lại từ đầu.
- **Giọng Rê giáng trưởng** (kênh chưa dùng làm giọng chính: 001 Đô, 002 Sol, 003 Rê thứ/Fa, 004 Fa, 005 La, 006 Mi, 007 Si giáng, 008 La giáng, 009 Rê, 010 Mi giáng). Mọi cảnh đều ở giọng trưởng.
- **Điệu riêng của tập: reggae one-drop** (`'reggae'`, bộ gõ `'dub'`; `SIGNATURE` trong `groove.py` ghi cho short-012): trống chỉ rơi ở phách 3, đàn "skank" ở phách 2 và 4. Ba cảnh dùng điệu này (móc, cao trào soi chậm, sổ), khoảng 41 % thời lượng; mỗi cảnh một nhạc cụ hát chính và một đệm khác nhau.
- **Bay lùi là "rewind":** mỗi cú bay lùi lớn ở chỗ không có lời (cú lùi thứ hai ở 2,32 s, và cú lao tới lại ở cuối phim) là một cú `spinback()` viết riêng trong `mix.py`: lấy khoảng một giây nhạc vừa chơi, phát ngược, tốc độ đọc tăng từ 1 lên 4,2 lần (cao độ trượt lên như kéo đĩa), giữ một lớp mờ của nhạc gốc để không có lỗ im. Cú ở cuối phim "kéo" nhạc về hợp âm Rê giáng của khung đầu: vòng lặp là một cú rewind.
- **Trống thép (steel pan) là giọng của Zip**, như một nhạc cụ đảo nhiệt đới: "ting-ting-ting" đi lên khi Zip đứng yên, đi xuống lảo đảo khi Miss Loupe hoa mắt.
- **Soi chậm bốn cánh là kèn so le:** một chu kỳ cánh bằng đúng hai phách ở 96 BPM. Mỗi đỉnh "cánh trước lên, cánh sau xuống" có xylophone đi lên (dải cao) cùng lúc với tuba trượt xuống (dải trầm); nửa nhịp kia ngược lại, nhỏ hơn. Hai giọng đi ngược chiều nhau như hai cặp cánh, và đều nằm ngoài dải giọng của lời.
- Dựng theo **Sound Design Plan** (`Groove(..., plan=True)`): 10 cảnh nhạc (9 cảnh lớp nhịp + 1 đoạn "chụp" viết tay), 7 phong cách, BPM 96–126, 9 nhạc cụ hát chính. Bảng đầy đủ 7 cột, lý do từng cảnh và các chỗ chuyển: **[SOUND-PLAN.md](SOUND-PLAN.md)**.

| | 009 | 010 | **012** |
|---|---|---|---|
| Giọng | Rê trưởng | Mi giáng trưởng | **Rê giáng trưởng** |
| Điệu riêng | ska | samba | **reggae one-drop** |
| Điểm riêng | Mỗi số đếm là một nốt marimba cao dần | Bay lùi là motif chạy ngược | **Bay lùi là cú "rewind" của DJ; cánh so le là xylophone lên + tuba xuống** |
| Nhạc cụ của nhân vật | Kazoo = Fizz | — | **Trống thép = Zip** |

**Chống trùng với các Short khác (QUALITY §4 "Kênh"):** mọi cặp điệu + nhạc cụ hát chính của tập đều mới so với `music-plan.json` của 001–010 (reggae + trống thép / trumpet / kazoo; pop nảy + vibraphone; phiêu lưu + sáo; rải lơ lửng + glockenspiel; rình rập hài + accordion; polka + bassoon; phi ngựa + xylophone). Cảnh sổ và cao trào phối theo điệu của tập; cảnh rình rập (đi lùi) ở giọng trưởng, phong cách hài.

## Điểm nhấn viết tay (`mix.py`)

| Giây | Điểm nhấn |
|---|---|
| 0,0 | Hợp âm Rê giáng (bass gảy + phím điện) và một tiếng trống thép, đúng khung 0; nối với nốt La giáng ở 23,75 s (vòng lặp) |
| 1,5 | Trống thép "ting-ting-ting" đi lên khi Zip đứng yên sau cú lùi đầu (ngay sau câu hỏi) |
| 2,32–2,74 | **"Rewind" 1:** nhạc quay ngược, nhanh dần, đúng cú bay lùi thứ hai |
| 2,6 | Trống thép đi xuống lảo đảo khi Miss Loupe hoa mắt |
| 4,25 | Kính bật về phía máy: đàn hạc vuốt lên |
| 6,98 | Zip phanh, đứng yên: triangle + celesta, ngay trước "And stay still…" |
| 8,85 | Soi chậm: timpani mở cảnh |
| 8,85 · 10,1 · 11,35 | Cánh trước lên, cánh sau xuống: xylophone đi lên + tuba trượt xuống, cùng lúc |
| 9,48 · 10,73 · 11,98 | Nửa nhịp kia: xylophone đi xuống + tuba trượt lên, nhỏ hơn |
| 11,92 | Trumpet Rê giáng–Fa–La giáng–Rê giáng đi lên ngay sau lời giải thích |
| 12,55 | "Chụp": marimba chạy lên; đàn hạc vuốt qua mặt kính; sticker: đàn hạc rải + hộp nhạc |
| 15,57 | Zip lùi đuôi vào trang: xylophone trượt xuống |
| 19,82 | "Bộp": tuba "bwomp" đi xuống + vỗ tay |
| 21,58 | Miss Loupe cười: bassoon "hô hô" |
| 23,45 | Chữ móc trở lại: hợp âm Rê giáng nhỏ; **"rewind" 2** kéo nhạc về khung đầu |

## Cường độ theo cảnh (`LEVEL`)

Dâng ở khung 0, cú phanh, khoảng trống sau câu móc, cú "rewind", cú bật kính, khoảng trống trước "And stay still", hai khoảng trống quanh câu soi chậm, cú "chụp", cú Zip lùi vào trang, cú "bộp" và cú "rewind" cuối. Hạ dưới mọi câu thoại (0,70–0,78). Nhạc còn nhường giọng bằng `toon.duck` (dải chữ −15 dB).
