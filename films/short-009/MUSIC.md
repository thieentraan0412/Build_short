# SHORT-009 · Soundtrack Timeline

## Màu nhạc của tập: "Sunset Counting Song"

Tập này là một trò **đếm cánh** lúc hoàng hôn, nên nhạc là một bài đếm số:
- **Giọng Rê trưởng**, lần đầu kênh dùng làm giọng chính. Gag ở **Si thứ** (giọng thứ cùng hoá biểu) cho cú "xì" buồn cười; hợp âm La ở cuối dẫn về Rê của khung đầu nên vòng lặp liền.
- **Mỗi số đếm là một nốt marimba cao dần**: cánh ruồi "1, 2" là Rê–Mi; tấm cánh và cánh mỏng của Blink "1, 2, 3, 4" đi tiếp Fa♯–La–Si–Rê. Bốn nốt của Blink nối tiếp và cao hơn hai nốt của ruồi, nên "4 nhiều hơn 2" nghe ra được. Các nốt ở dải cao (trên 1 kHz), nằm trên dải giọng.
- **Fizz có kazoo "vè vè"** (nhạc cụ hoạt hình), Blink có glockenspiel; cú vỡ lẽ "So I'm a beetle!" là kèn trumpet ba nốt đi lên.
- Dựng theo **Sound Design Plan** (`Groove(..., plan=True)`): 11 cảnh nhạc, mỗi cảnh một phong cách, một BPM (100–132), một nhạc cụ hát chính. Bảng đầy đủ 7 cột, lý do từng cảnh và các chỗ chuyển: **[SOUND-PLAN.md](SOUND-PLAN.md)**.

| | 007 | 008 | **009** |
|---|---|---|---|
| Giọng | Si giáng trưởng | La giáng trưởng | **Rê trưởng (gag Si thứ)** |
| Điểm riêng | Mật mã ánh sáng là câu nhạc | Mỗi cú pha trộn là một nốt glockenspiel | **Mỗi số đếm là một nốt marimba cao dần** |
| Nhạc cụ của nhân vật | Glockenspiel = ánh sáng | Bassoon = cái lạnh | **Kazoo = Fizz** |

## Điểm nhấn viết tay (`mix.py`)

| Giây | Điểm nhấn |
|---|---|
| 0,0 | Hợp âm Rê (bass gảy + ukulele) đúng khung 0; nối với nốt La ở 23,75 s (vòng lặp) |
| 1,7 | Kazoo "vè vè" của Fizz trong khoảng trống sau câu hỏi |
| 4,41 | Trombone "wah-wah" đi xuống khi Blink xìu (ngay sau "Nope!") |
| 5,75 · 6,45 | Kính bật về phía máy: đàn hạc vuốt lên; Fizz xoè cánh: glockenspiel rung |
| 7,0 · 7,35 | Đếm cánh ruồi "1, 2": marimba Rê, Mi |
| 9,75–10,9 | Đếm cánh Blink "1–4": marimba Fa♯, La, Si, Rê; cánh mỏng mở: đàn hạc vuốt lên |
| 11,6 | Trumpet Rê–Fa♯–La đi lên ngay trước "So I'm a beetle!" |
| 13,4 | "Chụp": marimba chạy lên; đàn hạc vuốt qua mặt kính; sticker: đàn hạc rải + hộp nhạc |
| 16,85 | Blink lao vào trang: xylophone trượt xuống |
| 18,25 | Fizz nhấc cánh: kazoo vút lên |
| 19,1 | "Xì": còi trượt xuống + tuba "bwomp" |
| 23,0 | Chữ móc trở lại: hợp âm Rê nhỏ |

## Cường độ theo cảnh (`LEVEL`)

Dâng ở "Nope!", cú bật kính, cú tấm cánh bật, ngay sau câu giải thích, cú "chụp", cú Blink lao vào trang và cú "xì". Hạ ở chỗ khựng trước "Nope!" (0,5), dưới lời giải thích trong kính, dưới "Nice try, Fizz!" và dưới câu hỏi kết. Nhạc còn nhường giọng bằng `toon.duck` (dải chữ −15 dB).
