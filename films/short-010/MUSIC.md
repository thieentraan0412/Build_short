# SHORT-010 · Soundtrack Timeline

## Màu nhạc của tập: "Rewind Pond Hop"

Tập này kể về một chú chuồn chuồn **nhìn được ra sau** và **bay lùi được**, nên nhạc biết "tua ngược":
- **Giọng Mi giáng trưởng**, lần đầu kênh dùng làm giọng chính. Ba cảnh "rình" (nhịp tim hồi hộp, Crumb đi một vòng, "One, two, three, boo!") xuống **Đô thứ**, giọng thứ cùng hoá biểu. Cảnh đứng yên giữa trời và cảnh nũng nịu lên **La giáng**. Nốt Si giáng ở cuối dẫn về hợp âm Mi giáng của khung đầu nên vòng lặp liền.
- **Motif bốn nốt của Zip: Mi♭–Sol–Si♭–Mi♭.** Khi Zip bay tới, motif đi lên. Khi Zip **bay lùi**, đúng bốn nốt ấy chạy **ngược thứ tự**, đi xuống. Trẻ nghe được "tua ngược" mỗi lần Zip lùi (móc, "Nope!", bay tới – bay lùi, gag).
- **Rón rén là pizzicato và bassoon.** Bản rón rén của móc trở lại y nguyên ở gag và ở 1,2 s cuối (reprise, cùng 112 BPM): cùng mạch "Crumb đi rình", và nối vòng lặp liền.
- **Hàng nghìn ô mắt là một làn mưa nốt toy piano** rất cao, lan từ giữa ra đúng lúc các hình phản chiếu hiện lên. Cao trào là **calypso có trống thép** như một bữa tiệc nghìn Crumb.
- Dựng theo **Sound Design Plan** (`Groove(..., plan=True)`): mỗi cảnh một phong cách, một BPM (96–132), một nhạc cụ hát chính. Bảng đầy đủ 7 cột, lý do từng cảnh và các chỗ chuyển: **[SOUND-PLAN.md](SOUND-PLAN.md)**.

| | 008 | 009 | **010** |
|---|---|---|---|
| Giọng | La giáng trưởng | Rê trưởng | **Mi giáng trưởng (rình: Đô thứ)** |
| Điểm riêng | Mỗi cú pha trộn là một nốt glockenspiel | Mỗi số đếm là một nốt marimba cao dần | **Bay lùi = motif chạy ngược** |
| Nhạc cụ của nhân vật | Bassoon = cái lạnh | Kazoo = Fizz | **Sáo / xylophone = Zip; pizzicato + bassoon = Crumb rón rén** |

## Điểm nhấn viết tay (`mix.py`)

| Giây | Điểm nhấn |
|---|---|
| 0,0 | Hợp âm Mi giáng (bass gảy + ukulele) đúng khung 0; nối với nốt Si giáng ở 43,75 s (vòng lặp) |
| 1,0 | Con ngươi của Zip trượt ra sau: hai nốt celesta |
| 1,38 | Zip vụt lên: motif đi lên (glockenspiel) |
| 3,0–3,8 | Nhạc hiệu 0,8 s của kênh (`band.sting`, `root=75`) |
| 5,45 · 6,0 | Vòm mắt sáng viền: đàn hạc vuốt lên; tia lấp lánh trên đỉnh đầu: celesta ba nốt |
| 8,05 · 8,65 · 9,25 | Con ngươi trượt theo Crumb: marimba cao dần |
| 9,55 | Crumb bị bắt quả tang: trumpet bịt hai nốt đi xuống |
| 12,87 | "Nope!", Zip bay lùi: motif **ngược** (xylophone) |
| 14,05 · 14,65 | Bay tới (motif đi lên) · bay lùi (motif ngược), glockenspiel nhỏ ở dải cao, dưới lời |
| 17,85 | Kính đẩy vào mắt: đàn hạc vuốt lên dài 1,75 s |
| 19,28 | "1000s!": celesta rải |
| 20,4–21,4 | Hình phản chiếu hiện ra: làn mưa 26 nốt toy piano lan từ giữa ra; làn sóng vẫy tay: 10 nốt nữa |
| 25,15 | Kính lùi ra: đàn hạc vuốt xuống |
| 28,3 | "Chụp": marimba chạy lên; đàn hạc vuốt qua mặt kính; sticker: đàn hạc rải + celesta |
| 31,5 | Zip lao vào trang: xylophone trượt xuống |
| 35,6 | Crumb xìu: trombone "wah-wah" đi xuống |
| 37,7 | Zip bay lùi ra khỏi khung phải: motif ngược |
| 39,8 | "Boo!": cú chặn cả dàn (trumpet Đô thứ + trombone) |
| 40,08 | Crumb giật bắn: còi trượt lên |
| 42,9 | Chữ móc trở lại: hợp âm Mi giáng nhỏ |

## Cường độ theo cảnh (`LEVEL`)

Dâng ở cú vụt của Zip, logo, cú bắt quả tang, "Nope!", ngay sau câu "thousands", cú "chụp", cú Zip lao vào trang và "boo!". Hạ ở chỗ khựng trước "Nope!" (0,5), dưới các câu giải thích, dưới "Hi, everybody!", dưới "Can I hold the lens now?" và dưới câu hỏi kết (0,7). Nhạc còn nhường giọng bằng `toon.duck` (dải chữ −15 dB).
