# SHORT-014 · Soundtrack Timeline

## Màu nhạc của tập: "Tummy-Rumble Funk"

Tập này là chuyện **cái bụng**: tai của Hop ở bụng, còn bụng của Crumb thì sôi "ục ục". Nhạc là một bản **funk** vui, và tiếng bụng nằm ngay trong tiếng bass:
- **Giọng Fa♯ trưởng**, lần đầu kênh dùng làm giọng chính (001 Đô, 002 Sol, 003 Rê thứ → Fa, 004 Fa, 005 La, 006 Mi, 007 Si♭, 008 La♭, 009 Rê, 010 Mi♭). Funk dùng **hợp âm bảy** (Fa♯7, Si7, Mi7, Đô♯7), nghe "lắc hông" mà vẫn sáng; cảnh kính đổi sang Si trưởng (bậc IV) cho màu phép thuật. Không cảnh nào ở giọng thứ.
- **Điệu riêng của tập: funk** (`SIGNATURE` trong `groove.py` gán cho short-014): bass "slap" lệch phách, snare có nốt ma, hi-hat móc kép, vỗ tay. Funk chiếm **38 %** thời lượng, ở ba chỗ quan trọng: móc (0–2 s), cao trào màng nhĩ rung (8,2–12,2 s) và gag bụng sôi (16,3–18,5 s). Ba cảnh funk khác nhau ở nhạc cụ hát chính, tiếng đệm và BPM (120 / 120 / 100), nên không cảnh nào là cảnh khác đổi tốc độ.
- **Guitar "gà cục tác"** (chicken-scratch): dây bị chặn, tiếng "chk" + nốt gảy cực ngắn qua bộ lọc wah. Thư viện chung chưa có guitar, nên guitar được tổng hợp trong `mix.py` và đăng ký tạm vào lớp nhịp lúc chạy (không sửa `groove.py`).
- **Bass slap = tiếng bụng.** Mỗi tiếng "ục ục" của Crumb được bass slap đáp lại ngay bằng ba nốt lướt (viết tay), như bụng và ban nhạc nói chuyện với nhau.
- **Màng nhĩ rung theo phách.** Ở cao trào, kick của funk rơi đúng lưới 120 BPM của phim; trong kính, màng nhĩ của Hop nảy lên đúng các phách kick (`KICKS` trong `film.js`), nên trẻ "thấy" âm thanh làm màng rung.
- Dựng theo **Sound Design Plan** (`Groove(..., plan=True)`): 9 cảnh nhạc, 6 phong cách, 8 nhạc cụ hát chính, BPM 100–132. Bảng 7 cột, lý do từng cảnh và các chỗ chuyển: **[SOUND-PLAN.md](SOUND-PLAN.md)**.

| | 008 | 009 | **014** |
|---|---|---|---|
| Giọng | La♭ trưởng | Rê trưởng | **Fa♯ trưởng (cảnh kính: Si)** |
| Điệu riêng | disco | ska | **funk** |
| Điểm riêng | Mỗi cú pha trộn là một nốt glockenspiel | Mỗi số đếm là một nốt marimba cao dần | **Bass slap đáp tiếng bụng; màng nhĩ nảy theo kick** |
| Nhạc cụ của nhân vật | Bassoon = cái lạnh | Kazoo = Fizz | **Trống thép + kazoo = cú nảy của Hop; trumpet bịt = tiếng cười** |

## Bảng cảnh nhạc

| Giây | Cảnh | Điệu · BPM | Hát chính | Đệm · bộ gõ | Cung bậc |
|---|---|---|---|---|---|
| 0,0–2,0 | Móc: tai ở bụng? | funk · 120 | trumpet bịt | guitar "gà cục tác" · funk | mở đầu |
| 2,0–5,0 | Miss Loupe bật vào | phi ngựa (nhịp kép) · 132 | xylophone | ukulele · đồ chơi | mở đầu |
| 5,0–8,2 | Kính lớn: tai ở bên bụng | phiêu lưu · 108 | sáo | đàn hạc, celesta rải · tom | diễn biến |
| 8,2–12,2 | "Hello in there!" · màng nhĩ rung | funk · 120 | trumpet | kèn đồ chơi chặn · funk | **cao trào** |
| 12,2–13,2 | Chụp → sổ | khựng (viết tay) | đàn hạc | marimba | kết |
| 13,2–16,3 | Sổ · Albie | ragtime · 112 | piano đồ chơi | piano · chổi | kết |
| 16,3–18,5 | Gag: bụng sôi | funk · 100 | trombone | phím điện "clav" · funk | kết |
| 18,5–21,0 | Hop vọt khỏi khung · câu hỏi | pop nảy · 126 | trống thép | ukulele · pop | kết |
| 21,0–22,0 | Hop rơi về · vòng lặp | nảy lệch phách · 120 | kazoo | marimba · vỗ tay | kết |

## Điểm nhấn viết tay (`mix.py`)

| Giây | Điểm nhấn |
|---|---|
| 0,0 | Fa♯7 (bass slap + guitar chặn hai cú) đúng khung 0; nối với nốt Đô♯ ở 21,75 s (vòng lặp) |
| 1,5 | Trumpet bịt "wah-wah" đáp sau câu hỏi của Crumb, cùng lúc Hop khúc khích |
| 5,0 | Kính bật về phía máy: đàn hạc vuốt lên |
| 6,35 | Màng nhĩ sáng: **mô-típ bí mật đô–mi–sol** (celesta, giọng Si, dải cao) + nốt quãng tám |
| 8,45 · 8,72 · 8,99 | Mỗi vòng sóng "Hello in there!" chạm màng nhĩ: một nốt vibraphone cao dần |
| 12,25 | "Chụp": marimba chạy lên; đàn hạc vuốt qua mặt kính; sticker: đàn hạc rải + hộp nhạc |
| 15,65 | Hop lao vào trang: xylophone trượt xuống |
| 17,5 · 17,84 | **Bass slap đáp tiếng "ục ục"** (ba nốt lướt lên, bật dây) |
| 18,3 | Hop giật mình: trombone "wah" trượt xuống |
| 18,55 | Hop vọt lên: trumpet bốn nốt vút lên |
| 21,0 | Chữ móc trở lại: guitar chặn Fa♯7 |
| 21,75 | Bass Đô♯ dẫn về Fa♯ ở 0,0 |

## Cường độ theo cảnh (`LEVEL`)

Dâng ở khung 0, sau câu hỏi của Crumb, cú kính bật về phía máy, ngay sau "Hello in there!", cú "chụp", cú Hop lao vào trang, cú máy lao vào màng nhĩ và cú vọt. Hạ dưới lời giải thích trong kính, dưới "Sorry! My tummy!" và dưới câu hỏi kết. Nhạc còn nhường giọng bằng `toon.duck` (dải chữ).

## Nhạc cụ

Mọi nốt là nhạc cụ tổng hợp của `_shared/audio/band.py` (bass gảy, trumpet, trumpet bịt, trombone, kèn đồ chơi, piano, piano đồ chơi, phím điện, ukulele, xylophone, marimba, đàn hạc, celesta, vibraphone, trống thép, kazoo, contrabass, sáo, bộ gõ funk) và guitar "gà cục tác" tổng hợp trong `mix.py`. Không có giọng hát trong nhạc nền.
