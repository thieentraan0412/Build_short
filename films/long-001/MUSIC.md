# LONG-001 · Soundtrack Timeline

## Màu nhạc của tập: "Winter Album Suite"

Video dài đầu tiên của kênh, nên nhạc là một tổ khúc. **Chủ đề hộp nhạc mùa đông** (celesta, đàn hạc, chuông) vang ở bậu cửa sổ. Mỗi trang ký ức mang lại màu nhạc mùa hè của tập Short tương ứng, nhưng dựng lại, không chép:

| Phần | Màu nhạc | Nhạc cụ chính |
|---|---|---|
| Bậu cửa sổ, trang sổ đóng băng | Valse rải hộp nhạc, nhịp tim hồi hộp | Celesta, đàn hạc, pizzicato |
| Ký ức 1 · vị giác | Calypso nhẹ → pop nảy → đếm ngược → calypso đầy | Trống thép, xylophone, sáo |
| Ký ức 2 · khứu giác | Valse "Tap-Tap" → rón rén → khựng ở ngõ cụt → polka khi chạm râu | Đàn hạc, hộp nhạc, pizzicato, kèn dăm |
| Ký ức 3 · thính giác | Night Band swing → rón rén tìm tai → swing hoà nhạc | Contrabass, phím điện, vibraphone |
| Ký ức 4 · thị giác và tín hiệu | Rón rén → diễu hành nhỏ → đêm lặng → rải vibraphone (mật mã) → pop nảy (điệu nhảy) | Glockenspiel, tuba, snare, vibraphone, marimba |
| Vườn tuyết | Nhịp tim lạnh → rải ấm (bóng ong) → rón rén (bọ rùa) → valse hộp nhạc (sâu gấu len) → nhịp tim lạc đường → **diễu hành về nhà** | Contrabass, pizzicato, đàn hạc, tuba |
| Kết · đố vui · tạm biệt | Valse đầy → bốn câu đố bốn điệu → ru ngủ → polka "Find Rollo!" → hộp nhạc | Toàn bộ |

Nhận diện của kênh giữ nguyên:
- **Nhạc hiệu 2 s:** đúng ô nhịp của cảnh tựa.
- **Mô-típ bí mật đô–mi–sol:** chơi trên hộp nhạc ở mỗi lần "Secret unlocked!", khi tìm ra ba bí mật mùa đông, và trên kèn khi chữ móc trở lại.
- **Marimba và ukulele:** nhạc cụ của ban nhạc kênh.

## Cách dựng

- **Lớp nhịp theo cảnh** ([`_shared/audio/groove.py`](../../_shared/audio/groove.py)), theo quy tắc QUALITY.md §4:
  - mỗi cảnh một điệu;
  - dưới lời chỉ còn bass, kick và hat (dưới giọng Albie bỏ bass);
  - câu đáp chen vào khoảng trống giữa hai câu thoại;
  - có trống dồn hoặc chũm chọe ở chỗ đổi cảnh.
- **Các nhịp chờ trẻ trả lời** (đoán món, "3… 2… 1!", chọn ngả rẽ, bốn câu đố) nằm trong `avoid`: giai điệu nhường chỗ, chỉ còn trống và bass "đang nghĩ".
- **Điểm nhấn viết tay** trong `mix.py`:
  - nhạc hiệu;
  - mô-típ bí mật;
  - hợp âm trống thép khi "Its feet!";
  - tuba "bwomp" ở ngõ cụt;
  - vibraphone khi tai sáng lên;
  - glockenspiel khi soi mắt Zip;
  - ting của mật mã ánh sáng;
  - đàn hạc ấm khi bật kính nhiệt và khi thấy khung cửa ấm;
  - "ta-da" khi chữ móc trở lại;
  - chủ đề hộp nhạc ở cảnh kết.
- **Nhịp chờ trẻ trả lời** có mõ gỗ "tích–tắc" rất nhỏ. Các chỗ khựng (ngõ cụt, lúc lách ra ngoài, trước "CHOO!") vẫn còn pad và hộp nhạc mỏng. Mỗi cảnh nhạc có một nền trầm rất mỏng (nốt gốc + quãng năm, dưới 250 Hz), để nhạc không đứt giữa hai nốt ngắn.
- **Nâng nhẹ các đoạn nhạc quá nhỏ** (tối đa +12 dB, nửa đường tới mức chung) trước khi chuẩn hoá, để không có lỗ im dưới lời.
- **Cường độ theo cảnh** (`LEVEL`): dâng ở mỗi lần mở khoá, đáp án, tìm thấy, thấy đường về; hạ ở trang trống, ở nhạc hiệu (dưới câu tựa) và lúc ru ngủ.

## Bảng cảnh nhạc

Sinh từ `out/music.json`. Cột *Nguồn*: "lớp nhịp" là phần `groove.py` dựng; "viết tay" là đoạn khựng, stinger hoặc nhạc hiệu trong `mix.py`.

| Thời gian | Cảnh nhạc | Điệu | Hoà âm | Nhạc cụ | Trống | Năng lượng | Nguồn |
|---|---|---|---|---|---|---|---|
| 0–2,35 | móc · hộp nhạc rơi | rải lơ lửng | C | pizzicato trầm, hộp nhạc, đàn hạc | — | vừa | lớp nhịp |
| 2,35–9,04 | BZZT · run lập cập | shuffle nhún nhảy | C · F | bass gảy, ukulele, xylophone | kick, chổi trống, hat | vừa | lớp nhịp |
| 9,04–12,34 | trang đóng băng | nhịp tim hồi hộp | Am | contrabass, pizzicato | kick, hat | nhẹ | lớp nhịp |
| 12,34–19,42 | Crumb · luật của truyện | pop nảy | C · Am · F · G | bass gảy, ukulele, marimba | kick, clap, shaker | vừa | lớp nhịp |
| 19,42–22,43 | ngáp · buồn ngủ | nửa nhịp đung đưa | F · C | pizzicato trầm, đàn hạc, hộp nhạc | kick, chổi trống, hat | nhẹ | lớp nhịp |
| 22,43–24,26 | đánh thức các trang | diễu hành | C · G | tuba, pizzicato, glockenspiel | kick, snare, lục lạc | đầy | lớp nhịp |
| 24,26–26,28 | nhạc hiệu | nhạc hiệu | C | kèn đồ chơi, chuông, marimba | — | vừa | viết tay |
| 26,28–31,7 | trang 1 · hộp nhạc | valse rải hộp nhạc | C · F | pizzicato trầm, hộp nhạc, đàn hạc | — | nhẹ | lớp nhịp |
| 31,7–35,97 | ký ức 1 · đoán món | calypso | G · C | bass gảy, trống thép, xylophone | kick, shaker, phách gỗ | vừa | lớp nhịp |
| 35,97–46,36 | Flutter chọn món | pop nảy | G · C · D · G | bass gảy, trống thép, xylophone | kick, clap, shaker | đầy | lớp nhịp |
| 46,36–50,51 | lưỡi hay chân? | nửa nhịp đung đưa | Em · C | bass gảy, ukulele, sáo | kick, chổi trống, hat | nhẹ | lớp nhịp |
| 50,51–52,87 | đếm ngược | nhịp tim hồi hộp | D | bass gảy, trống thép | kick, hat | nhẹ | lớp nhịp |
| 52,87–58,42 | nếm bằng chân! | calypso | G · C · G · D | bass gảy, trống thép, sáo | kick, shaker, phách gỗ | đầy | lớp nhịp |
| 58,42–67,2 | trang 1 tan · valse hộp nhạc | valse "um-pa-pa" | C · F · G · C | pizzicato trầm, đàn hạc, hộp nhạc | kick, phách gỗ | vừa | lớp nhịp |
| 67,2–73,15 | trang 2 · hộp nhạc | valse rải hộp nhạc | F · B♭ | pizzicato trầm, hộp nhạc, đàn hạc | — | nhẹ | lớp nhịp |
| 73,15–80,25 | mê cung · valse | valse "um-pa-pa" | A · E7 | pizzicato trầm, đàn hạc, hộp nhạc | kick, phách gỗ | vừa | lớp nhịp |
| 80,25–84,05 | lên hay xuống? | rón rén | A · D | pizzicato trầm, pizzicato, kèn dăm | mõ gỗ, shaker | nhẹ | lớp nhịp |
| 84,05–87,86 | lao nhầm · ngõ cụt | khựng / điểm nhấn viết tay | — | — | — | — | viết tay |
| 87,86–95,63 | ngửi lại · valse | valse "um-pa-pa" | D · A7 | pizzicato trầm, ukulele, xylophone | kick, chổi trống | vừa | lớp nhịp |
| 95,63–102,71 | Tap, tap, hello! · polka | polka | A · E7 | pizzicato trầm, pizzicato, xylophone | kick, clap | đầy | lớp nhịp |
| 102,71–110,31 | trang 2 tan | shuffle nhún nhảy | F · C | bass gảy, ukulele, glockenspiel | kick, clap, shaker | vừa | lớp nhịp |
| 110,31–113,32 | trang 3 · hộp nhạc | valse rải hộp nhạc | Dm · B♭ | pizzicato trầm, hộp nhạc, đàn hạc | — | nhẹ | lớp nhịp |
| 113,32–115,62 | ban nhạc đêm | swing | Dm · B♭ | contrabass, phím điện, vibraphone | kick, búng tay, hat | đầy | lớp nhịp |
| 115,62–125,17 | tai Chirp ở đâu? | rón rén | Dm · Gm | pizzicato trầm, pizzicato, vibraphone | mõ gỗ, shaker | nhẹ | lớp nhịp |
| 125,17–131,37 | còn Hop? | nửa nhịp đung đưa | F · Dm | contrabass, vibraphone, hộp nhạc | kick, chổi trống, hat | nhẹ | lớp nhịp |
| 131,37–136,41 | hoà nhạc chân và bụng | swing | F · B♭ · C · F | contrabass, phím điện, vibraphone | kick, búng tay, hat | đầy | lớp nhịp |
| 136,41–142,56 | trang 3 tan | pop nảy | F · C | bass gảy, ukulele, marimba | kick, clap, shaker | vừa | lớp nhịp |
| 142,56–146,07 | trang 4 · hộp nhạc | valse rải hộp nhạc | G · C | pizzicato trầm, hộp nhạc, đàn hạc | — | nhẹ | lớp nhịp |
| 146,07–151,07 | rón rén tới Zip | rón rén | G · D | pizzicato trầm, pizzicato, kèn dăm | mõ gỗ, shaker | nhẹ | lớp nhịp |
| 151,07–156,51 | mắt khổng lồ · diễu hành | diễu hành | G · D · G · C | tuba, pizzicato, glockenspiel | kick, snare, lục lạc | vừa | lớp nhịp |
| 156,51–162,38 | đêm hè · Blink | rải lơ lửng | Em · C | pizzicato trầm, hộp nhạc, vibraphone | — | nhẹ | lớp nhịp |
| 162,38–168,33 | mật mã ánh sáng | rải lơ lửng | C · G | pizzicato trầm, vibraphone, hộp nhạc | — | vừa | lớp nhịp |
| 168,33–173,39 | điệu nhảy của Waggle | pop nảy | C · F | bass gảy, marimba, xylophone | kick, clap, shaker | đầy | lớp nhịp |
| 173,39–179,99 | trang 4 tan · chỉ đường | diễu hành | C · G | tuba, pizzicato, glockenspiel | kick, snare, lục lạc | vừa | lớp nhịp |
| 179,99–187,18 | trang trống | nhịp tim hồi hộp | Am · F | contrabass, hộp nhạc | kick, hat | nhẹ | lớp nhịp |
| 187,18–194,9 | tìm bí mật mới · ủ ấm Albie | nửa nhịp đung đưa | C · Am · F · G | pizzicato trầm, ukulele, sáo | kick, chổi trống, hat | vừa | lớp nhịp |
| 194,9–196,1 | lách ra ngoài | khựng / điểm nhấn viết tay | — | — | — | — | viết tay |
| 196,1–199,96 | lạnh quá! | nhịp tim hồi hộp | Am | contrabass, pizzicato | kick, hat | nhẹ | lớp nhịp |
| 199,96–202,73 | quả bóng ong ấm | rải lơ lửng | C · F | contrabass, đàn hạc, hộp nhạc | — | vừa | lớp nhịp |
| 202,73–210,69 | bọ rùa dưới lá · Dot đếm | rón rén | F · C | pizzicato trầm, pizzicato, xylophone | mõ gỗ, shaker | nhẹ | lớp nhịp |
| 210,69–217,93 | sâu gấu len · mùa xuân | valse rải hộp nhạc | C · F · C · G | pizzicato trầm, hộp nhạc, sáo | — | nhẹ | lớp nhịp |
| 217,93–222,39 | kính mờ · lạc đường | nhịp tim hồi hộp | Am · Dm | contrabass, pizzicato | kick, shaker | nhẹ | lớp nhịp |
| 222,39–229,46 | kính nhiệt · về nhà | diễu hành | C · G · C · F | tuba, pizzicato, glockenspiel | kick, snare, lục lạc | đầy | lớp nhịp |
| 229,46–238,45 | sổ ấm lại · valse đầy | valse "um-pa-pa" | C · F · G · C | pizzicato trầm, đàn hạc, hộp nhạc | kick, phách gỗ | đầy | lớp nhịp |
| 238,45–245,81 | đố 1 | shuffle nhún nhảy | C · F | bass gảy, ukulele, xylophone | kick, clap, shaker | vừa | lớp nhịp |
| 245,81–250,96 | đố 2 | pop nảy | F · C | bass gảy, marimba, glockenspiel | kick, clap, hat | vừa | lớp nhịp |
| 250,96–256,25 | đố 3 | calypso | G · C | bass gảy, trống thép, xylophone | kick, shaker, phách gỗ | vừa | lớp nhịp |
| 256,25–262,56 | đố 4 | swing | C · F | contrabass, phím điện, vibraphone | kick, búng tay, hat | vừa | lớp nhịp |
| 262,56–268,94 | ngáp · ru ngủ | valse rải hộp nhạc | C · F · G · C | pizzicato trầm, hộp nhạc, đàn hạc | — | nhẹ | lớp nhịp |
| 268,94–271,12 | hắt xì | khựng / điểm nhấn viết tay | — | — | — | — | viết tay |
| 271,12–273,72 | sticker bay như tuyết | rải lơ lửng | C · F | pizzicato trầm, hộp nhạc, glockenspiel | — | vừa | lớp nhịp |
| 273,72–275,72 | chữ móc trở lại | khựng / điểm nhấn viết tay | — | — | — | — | viết tay |
| 275,72–286,31 | Did you spot Rollo? | polka | C · G | tuba, pizzicato, xylophone | kick, snare | vừa | lớp nhịp |
| 286,31–289,5 | hẹn mùa xuân | valse rải hộp nhạc | C · F · C | pizzicato trầm, hộp nhạc, đàn hạc | — | nhẹ | lớp nhịp |

## Nền (ambience)

| Bối cảnh | Nền |
|---|---|
| Bậu cửa sổ | Tiếng phòng ấm rất nhỏ, gió xa ngoài cửa kính |
| Ký ức ban ngày (hoa quả, mê cung, mép ao) | Gió lá, chim xa ở chỗ không có lời |
| Ký ức đêm (đồng cỏ, đom đóm) | Dàn dế xa nhiều hướng |
| Tổ ong | Tiếng vo ve trầm |
| Vườn tuyết | Gió tuyết dâng hạ; bão tuyết khi kính mờ |

Mọi nền đều nhường giọng (`toon.duck`).

## Kiểm tra bản cuối

- **Độ to:** −14,0 LUFS; đỉnh thật −2,1 dBTP (`T.master(mix, 11.0)`).
- **Tiếng băng nứt** có sườn trước 1 ms. Bản đầu nhảy bậc trong một mẫu, nên bộ mã AAC vọt đỉnh +3,6 dBTP ở 136,5 s.
- **Lời so với nhạc + tiếng động** (dải 300–4000 Hz, trung vị theo câu): thấp nhất 10,0 dB ("Big secrets of tiny bugs!", đọc trên nhạc hiệu; vừa đủ ngưỡng 10 dB).
- **Nhạc nền:** không giây nào dưới −45 dB.
- **`qa.py`:** 36/36 đạt.
  - 54 cảnh nhạc, 12 điệu.
  - Đoạn dài nhất cùng một kiểu: 10,6 s (giới hạn của video dài: 15 s).
  - 58 câu đáp (51 tự động, 7 viết tay).
  - Nhạc có nhịp liền: 99 % số giây.
