# LONG-002 · Soundtrack Timeline

## Màu nhạc của tập: "Tiny Detective Swing"

Video dài thứ hai là một vụ án trinh thám vui, nên màu nhạc là **swing trinh thám giọng trưởng**. Đây là điệu riêng mới của tập, `sleuth` (`STYLES` và `SIGNATURE` trong [`_shared/audio/groove.py`](../../_shared/audio/groove.py)):
- bass pizzicato đi bộ, có nốt dẫn nửa cung vào gốc của ô sau;
- búng tay ở phách 2 và 4, chổi (shaker), mõ nhỏ "tích" như nhón chân;
- trumpet bịt chặn "wah" ở phách lẻ "và";
- vibraphone, piano đồ chơi.

Điệu này chiếm **65,5 s / 256,5 s = 25,5 %** thời lượng, ở bốn chỗ:
- móc;
- hiện trường, luật, ba ô manh mối;
- manh mối 3 (cố ý quay lại khi cuộc điều tra tới gần);
- tạm biệt, đủ ban, nối về móc.

Không gợi giai điệu của nhạc thám tử, điệp viên nổi tiếng nào.

Các nghi phạm và manh mối mang lại màu nhạc của tập Short mà họ thuộc về. Đó là các lời gọi lại cố ý của một video khép SERIES-002, đều dựng lại, không chép:
- Flutter: calypso và valse;
- dấu chân: diễu hành;
- hàng nghi phạm: ska game show.

Quy tắc "điệu riêng không mượn" chỉ áp cho Short (`channel.py` chỉ so `music-plan.json` của `short-*`), nhưng mỗi cảnh ở đây đổi nhạc cụ hát chính so với tập gốc.

## Luôn vui tươi (QUALITY.md §4, 14/11/2026)

- 30 cảnh có điệu, đều ở giọng trưởng.
- BPM thấp nhất 108, năng lượng thấp nhất 2.
- Không `mood='suspense'`, không điệu `sneak` / `tiptoe` / `tension` / `hush` / `stab`.
- Cảnh rình rập (đặt bẫy, chờ trong đêm) dùng shuffle nhảy chân sáo (`skip`, 112 BPM), bassoon và dây pizzicato "nhón chân mà vui".
- Ba chỗ khựng hài đều ≤ 1,2 s và vẫn còn một lớp mỏng (vibraphone hoặc celesta run run, pad):
  - trước "Nope!" ở manh mối 1 (0,6 s);
  - ngay sau tiếng đèn tắt (1,0 s);
  - trước "...I'll think about it." (0,7 s).

## Bảng cảnh nhạc

Bảng đầy đủ 34 cảnh (nội dung, cảm xúc, phong cách, nhạc cụ, BPM, tiếng động, lý do, các chỗ chuyển cảnh) ở [`SOUND-PLAN.md`](SOUND-PLAN.md), sinh từ `G.sec` / `G.mark` trong [`mix.py`](mix.py). Tóm tắt theo chương:

| Chương | Phong cách | Điệu | Nhạc cụ hát chính | BPM | Arc |
|---|---|---|---|---|---|
| Móc | Playful Cartoon | swing trinh thám | trumpet bịt | 120 | mở |
| Tựa | nhạc hiệu kênh 2 s | — | kèn, marimba, chuông | — | mở |
| Hiện trường · luật · ba ô | Funny / Playful | swing trinh thám (3 biến thể) | vibraphone → bassoon → xylophone | 116–120 | diễn biến |
| Manh mối 1 · sợi tơ | Magical Adventure | hộp nhạc lấp lánh | celesta (đàn hạc rải) | 112 | diễn biến |
| Ảnh hồi bé · nệm tơ | Cute & Sweet → Magical | valse → rải lơ lửng | glockenspiel → sáo | 112 | diễn biến |
| Flutter nghi phạm | Happy Kids | calypso | trống thép | 120 | diễn biến |
| Manh mối 2 · dấu chân | Bouncy → Happy → Funny | diễu hành → pop nảy → shuffle | xylophone → marimba → trombone "wah" | 118–124 | diễn biến |
| Manh mối 3 · cánh giấy | Funny Comedy | swing trinh thám (quay lại) | clarinet → vibraphone | 116 | diễn biến |
| Tóm tắt "LINEUP!" | Epic Cartoon | phiêu lưu nước kiệu | trumpet | 120 | diễn biến |
| Hàng nghi phạm | Bouncy → Funny → Bouncy | ska → ragtime → nhịp kép | trumpet → xylophone → kazoo → glockenspiel | 120–126 | diễn biến |
| Phần thân · râu | Happy Kids | polka → nảy lệch phách | accordion → marimba | 120–122 | diễn biến |
| Đặt bẫy · chờ | Funny Comedy | shuffle (2 biến thể) | bassoon → dây pizzicato | 112 | diễn biến |
| **Bẫy sập** | **Epic Cartoon** | **cao trào anh hùng** | **trumpet + dàn dây, timpani** | **132** | **cao trào** |
| Thú nhận · Albie một mình | Cute & Sweet | nửa nhịp đung đưa → hộp nhạc | celesta → piano đồ chơi | 108 | kết |
| Kết vụ án · ôn bài | Happy Kids | ukulele nắng | sáo | 120 | kết |
| Did you spot Rollo? | Funny Comedy | ragtime piano | piano | 126 | kết |
| Tạm biệt | Playful Cartoon | swing trinh thám đủ ban | trumpet mở | 124 | kết |

Toàn tập dùng:
- 17 điệu, 7 phong cách, 17 nhạc cụ hát chính, 13 họ nhạc cụ;
- BPM 108–132, 9 mức;
- 64 câu đáp (53 tự động, 11 viết tay).

`qa.py`: đoạn dài nhất cùng một kiểu 13,8 s (≤ 15 s), mọi cặp cảnh kề nhau khác nhau ≥ 2 điểm.

## Điểm nhấn viết tay (`mix.py`)

| Mốc | Điểm nhấn |
|---|---|
| 0,0 s | Hợp âm Fa trên vibraphone + contrabass; trumpet bịt "da-da-DA" theo chữ móc (nhạc chạy từ giây 0) |
| Tựa | Nhạc hiệu 2 s của kênh, giống hệt mọi tập |
| "8 LEGS?!" | Chuỗi tám nốt glockenspiel đi lên |
| "Rules are rules!" | Bassoon "bum-bum" |
| Bướm bay ra (wow 1) | Celesta (nhộng), sáo đi lên + đàn hạc vuốt |
| Ba ô manh mối lấp | **Mô-típ bí mật đô–mi–sol** trên celesta + chuông, mỗi ô một cao độ |
| "Time for a lineup!" | Trống snare dồn vào hàng nghi phạm (J-cut), timpani + chũm chọe ở phách đầu |
| Cột đo dâng tới 6 | Kèn "ta!" (ba lần) |
| Hai chân giấu (wow 2) | Glockenspiel đi lên ở số 7 và 8; chân bật ra: hợp âm kèn + chũm chọe |
| "BZZT! Not a bug!" | Trombone "bwa-bwa" |
| Bạt nhún tơ | Mỗi cú nảy một nốt timpani đi lên; đèn bật: "ta-da" |
| CASE CLOSED! | "Ta-da" ngay sau tiếng con dấu |
| Thẻ "6 BUG", "8 SPIDER" | Mô-típ bí mật đô–mi–sol |
| Ba khung "Find Rollo" | Mỗi khung một nốt piano |
| Sợi tơ lóe lại (gợi móc) | Glockenspiel đi lên |
| "Nope!" cuối | "Ta-da" Fa trưởng ngay sau lời, hợp âm vibraphone kết |
| Nhịp chờ trẻ trả lời | Mõ gỗ "tích–tắc" rất nhỏ, giai điệu nhường chỗ (sau "Then who has eight legs?", hai câu ôn bài, câu hỏi kết) |

## Nhạc đệm dưới lời, đổi cảnh, chủ đề (lượt 16/11/2026)

Bản đầu nghe "đồng điệu". Lời chiếm 64 % thời lượng, mà dưới lời nhạc chỉ còn bass + kick, giống nhau ở mọi cảnh. Lượt này ([`PHAN-TICH-SHORTS/NHAC-DEM-LOI.md`](../../PHAN-TICH-SHORTS/NHAC-DEM-LOI.md), QUALITY.md §4 *(Đệm lời)*) sửa như sau:
- **Đệm đủ dưới lời** (`Groove(..., accomp=True)`):
  - tiếng đệm giữ đủ nhịp của điệu, chỉ nhỏ lại;
  - thêm một **bè phụ ở dải cao** (C6–D7) bằng nhạc cụ sáng của từng cảnh. 11 màu: vibraphone, xylophone, ukulele, celesta, glockenspiel, marimba, dây pizzicato, piano đồ chơi, piano, đàn hạc, trống thép.
  - Tổng cộng 627 nốt đệm, 3,8 nốt mỗi giây lời.
- **Chủ đề "Who snuck in?"**: đô–mi–sol–la–sol–mi–rê–sol (`G.theme`). Nhạc cụ hát chính của cảnh hát lại ở câu đáp đầu cảnh, theo giọng và điệu của cảnh, 6 lần:
  - glockenspiel (valse ảnh hồi bé);
  - marimba (Flutter in 6 dấu);
  - trumpet (ska hàng nghi phạm);
  - dây pizzicato (đêm bẫy);
  - celesta (thú nhận);
  - piano ragtime (Rollo).
- **Đổi cảnh nghe ra:** dưới lời không còn "vào mềm"; mỗi chỗ đổi cảnh có trống dồn, nốt mồi, còi "bwomp", riser hoặc "ta!" ở dải cao.
- **Điểm nhấn sau lời:** "bum-bum" của bassoon rơi ngay sau "Rules are rules!"; mô-típ bí mật ngay sau "Six legs!" / "Eight legs!".
- Kết quả: nhạc ở dải giọng chỉ tụt 6,8 dB khi có lời (bản đầu 9,6 dB). Lời vẫn rõ: thấp nhất 10,8 dB, trung vị 15,6 dB.

## Trộn

- **Cường độ theo cảnh** (`LEVEL`): dâng ở chỗ phát hiện (8 chân, nệm tơ, chân giấu, bẫy sập, con dấu, sợi tơ lóe lại), hạ dưới lời và ở các nhịp chờ. Chênh 18 dB giữa giây to nhất và nhỏ nhất.
- **Nhường giọng vừa đủ:** `T.duck(mus, ve, .66, .3)`, tức dải giọng −9 dB, ngoài dải −3 dB (bản đầu −15 / −7 dB).
- **Vòng bảo vệ lời rõ:** `T.speech_guard(mus, fx, vox, LINES, 11.)` chỉ hạ nhạc ở 9/107 câu, mỗi câu 0,6–2,9 dB.
- **Dưới câu cửa miệng** ("Let's zoom in!", "Nope!", "BZZT!"), câu tựa và "Gotcha!": nhạc lùi thêm 4–6 dB để lời hơn nhạc + tiếng động ≥ 10 dB.
- **Giọng qua bộ lọc thấp 8,5 kHz.** Giọng Dot nâng cao độ có một tiếng rít khoảng 9,5 kHz ("Now let me count YOU!"), làm bộ mã AAC vọt đỉnh +1,9 dBTP. Lọc xong đỉnh thật còn −2,3 dBTP.
- Mỗi tiếng động có sườn trước 1,5 ms (không vọt đỉnh khi mã hoá).
- Bản cuối: −14,0 LUFS, đỉnh −1,9 dBTP (`core/render/mux.sh`).
