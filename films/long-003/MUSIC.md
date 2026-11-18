# LONG-003 · Soundtrack Timeline

## Màu nhạc của tập: "Starlight Shuffle"

Video dài thứ ba là một cuộc giải cứu ban đêm vui, nên màu nhạc là **diễu hành đêm sao giọng trưởng, nhún kiểu shuffle**. Đây là điệu riêng mới của tập, `starwalk` (`STYLES` và `SIGNATURE` trong [`_shared/audio/groove.py`](../../_shared/audio/groove.py), bộ gõ `star`):
- ukulele gảy ở phách lẻ;
- celesta (hoặc vibraphone, đàn hạc) rải 3+3+2 như sao lấp lánh;
- chổi trống ở phách 2 và 4, shaker, vỗ tay nhẹ;
- bass pizzicato có nốt dẫn nửa cung vào gốc của ô sau.

Điệu này chiếm **60,0 s / 256,0 s = 23,5 %** thời lượng, ở năm chỗ:
- móc;
- chặng ánh lóe (Uncle Telly, mật mã của Blink): cố ý quay lại khi cuộc tìm kiếm tới gần;
- đường về, ôn bài (banjo hát chính);
- gag cuối, đủ ban, nối về móc;
- trang ao (màu nước: glockenspiel, vibraphone, đàn hạc).

Nhạc không gợi giai điệu của nhạc phim hay bài hát nào. *The Six Legs Song* là bài đọc theo nhịp của kênh (đọc, không hát).

## Luôn vui tươi (QUALITY.md §4, 14/11/2026)

- 34 cảnh có điệu, đều ở giọng trưởng (Đô, Rê, Mi giáng, Fa, Sol, La, Si giáng).
- BPM thấp nhất 108, năng lượng thấp nhất 2.
- Không `mood='suspense'`, không điệu `sneak` / `tiptoe` / `tension` / `hush` / `stab`.
- Cảnh đêm và cảnh lạc đường không dùng nhạc ru hay nhạc buồn: Miss Loupe kẹt trong khe đá có đàn hạc đung đưa 108 BPM và hộp nhạc lấp lánh.
- Ba chỗ khựng hài đều ≤ 1,2 s và vẫn còn một lớp mỏng (vibraphone hoặc celesta run run, pad):
  - máy ngửa lên trời, trước "Nope!" của Blink (1,0 s);
  - ngay sau tiếng THỊCH, trước "Is it a monster?" (0,8 s);
  - trước "Yes! NOW!" (0,65 s).

## Bảng cảnh nhạc

Bảng đầy đủ 38 cảnh (nội dung, cảm xúc, phong cách, nhạc cụ, BPM, tiếng động, lý do, các chỗ chuyển cảnh) ở [`SOUND-PLAN.md`](SOUND-PLAN.md), sinh từ `G.sec` / `G.mark` trong [`mix.py`](mix.py). Tóm tắt theo chương:

| Chương | Phong cách | Điệu | Nhạc cụ hát chính | BPM | Arc |
|---|---|---|---|---|---|
| Móc | Playful Cartoon | shuffle đêm sao | celesta | 120 | mở |
| Tựa | nhạc hiệu kênh 2 s | — | kèn, marimba, chuông | — | mở |
| Bản đồ · "Off my map?!" | Funny Comedy | polka | clarinet | 112 | diễn biến |
| Lập đội · điểm danh | Bouncy Rhythm | nhịp kép | xylophone | 124 | diễn biến |
| Cách 1 · Waggle nhảy · "Nope!" | Happy → Funny | nảy lệch phách (2 biến thể) | marimba → trombone "wah" | 120 | diễn biến |
| Miss Loupe lần 1 | Cute & Sweet | nửa nhịp đung đưa | đàn hạc | 108 | diễn biến |
| Cách 2 · đường mùi, hàng kiến | Bouncy Rhythm | shuffle chân sáo (2 biến thể) | dây pizzicato → xylophone | 116 | diễn biến |
| "THE END?" | Funny Comedy | pop nảy | bassoon | 112 | diễn biến |
| Cách 3 · bóng nghĩ sa mạc | Magical Adventure | phiêu lưu nước kiệu | sáo | 112 | diễn biến |
| Dot đếm 10 bước | Happy Kids | pop nảy | piano đồ chơi | 118 | diễn biến |
| Miss Loupe lần 2 · "BLURRY!" | Cute & Sweet | hộp nhạc lấp lánh | vibraphone | 108 | diễn biến |
| "It all looks the same!" | Playful Cartoon | nảy lệch phách | clarinet | 116 | diễn biến |
| **Dải Ngân Hà** | **Magical Adventure** | **rải lơ lửng** | **celesta + dàn dây** | **110** | diễn biến |
| Vệt lăn · mây che · mây tan | Funny Comedy | ragtime (3 biến thể) | piano → kazoo → xylophone | 116 | diễn biến |
| Cách 5 · ánh lóe · mật mã | Playful Cartoon | shuffle đêm sao (quay lại) | glockenspiel → kèn đồ chơi | 120 | diễn biến |
| Crumb tự soi kỹ | Happy Kids | pop nảy | sáo | 116 | diễn biến |
| **"HEAVE!" · THỊCH · The Giant** | **Epic Cartoon** | **cao trào anh hùng** | **trumpet → kèn đồ chơi, dàn dây, timpani** | **132** | **cao trào** |
| Góc nhìn The Giant · mở đường về | Magical Adventure | rải lơ lửng (quay lại) | đàn hạc | 112 | cao trào |
| Crumb cầm kính · "Yes! NOW!" | Happy Kids | ukulele nắng | marimba → xylophone | 120 | kết |
| Đường về · ôn bài | Bouncy Rhythm | shuffle đêm sao | banjo | 120 | kết |
| Về nhà | Funny Comedy | polka | accordion | 120 | kết |
| Bản đồ sáng lên | Magical Adventure | hộp nhạc lấp lánh | glockenspiel | 112 | kết |
| The Six Legs Song | Playful Cartoon | pop nảy đúng phách của phim (2 nửa) | kazoo → kèn đồ chơi | 120 | kết |
| Thông điệp | Cute & Sweet | nửa nhịp đung đưa | piano | 108 | kết |
| Did you spot Spindle? | Funny Comedy | ragtime piano | piano | 126 | kết |
| Gag cuối · trang ao | Playful Cartoon | shuffle đêm sao đủ ban → màu nước | kèn đồ chơi → glockenspiel | 124 → 120 | kết |

Toàn tập dùng:
- 13 điệu, 7 phong cách, 18 nhạc cụ hát chính;
- BPM 108–132, 9 mức;
- 63 câu đáp (51 tự động, 12 viết tay).

`qa.py`: đoạn dài nhất cùng một kiểu 13,9 s (≤ 15 s), mọi cặp cảnh kề nhau khác nhau ≥ 2 điểm.

So với bảng dự kiến ở TREATMENT §9, bản dựng đổi ba chỗ:
- *The Six Legs Song* dùng `bounce` 120 BPM có vỗ tay thay cho `break`: `break` dài 15 s sẽ thành một "lỗ" nhạc, trái quy tắc khựng ≤ 1,2 s.
- Đường về dùng điệu riêng `starwalk` (banjo vẫn hát chính) thay cho `bounce`, để điệu riêng đạt ≥ 20 %.
- Các cảnh dài hơn 15 s (vệt lăn, cao trào, bài chant, gag cuối) tách thành 2–3 cảnh nhạc khác hoà âm và nhạc cụ.

## Điểm nhấn viết tay (`mix.py`)

| Mốc | Điểm nhấn |
|---|---|
| 0,0 s | Hợp âm Fa trên celesta + contrabass; xylophone "da-da-DA" theo chữ móc (nhạc chạy từ giây 0) |
| Tựa | Nhạc hiệu 2 s của kênh, giống hệt mọi tập |
| Năm ô "cách tìm đường" lấp | **Mô-típ bí mật đô–mi–sol** trên celesta + chuông, mỗi ô cao hơn một bậc |
| "Nope!" của Blink | Xylophone ba nốt đi xuống ngay sau lời |
| Máy ngửa lên Dải Ngân Hà | Vuốt đàn hạc đi lên 1,6 s, celesta rải bảy nốt, chuông và hợp âm dàn dây ở đỉnh |
| Vệt ngoằn ngoèo | Kazoo tám nốt lắc lư |
| Uncle Telly nháy · nháy đáp | Triangle ba tiếng · glockenspiel ba nốt đi lên |
| THỊCH | Một nhịp timpani trầm |
| Miss Loupe bật ra, được nâng lên | Vuốt đàn hạc; sáo bốn nốt đi lên |
| Góc nhìn The Giant | Hợp âm đàn hạc rải + chũm chọe nhẹ |
| "Yes! NOW!" | "Ta-da" ngay sau lời |
| Ba đáp án ôn bài | Mô-típ bí mật ngay sau mỗi đáp án |
| Chín chỗ của Mùa 1 sáng lên | Chín nốt glockenspiel đi lên; đàn hạc rải khi đường đi đêm nay sáng |
| Góc GARDEN EDGE | "Ta-da" sau tiếng dán giấy (không chồng đỉnh) |
| "BZZT! Not you, Spindle!" | Trombone "bwa-bwa" |
| Ba khung "Find Spindle" | Mỗi khung một nốt piano |
| Crumb trên viên tròn (gợi móc) | Xylophone "da-da-DA" của móc trở lại |
| Lật trang → "tõm" | Glockenspiel mười nốt chạy xuống, timpani mềm ở tiếng "tõm" |
| "The stars!" cuối | "Ta-da" Fa trưởng ngay sau lời, hợp âm vibraphone kết |
| Nhịp chờ trẻ trả lời (6 chỗ) | Mõ gỗ "tích–tắc" rất nhỏ, giai điệu nhường chỗ |

## Nhạc đệm dưới lời, đổi cảnh, chủ đề (QUALITY.md §4 *(Đệm lời)*)

- **Đệm đủ dưới lời** (`Groove(..., accomp=True)`): 672 nốt đệm có cao độ, 4,5 nốt mỗi giây lời. Nhạc ở dải giọng chỉ tụt 7,9 dB khi có lời.
- **Chủ đề "Find the way home"**: sol–mi–đô–mi–sol–đô'–la–sol (`G.theme`, cách nhau ≥ 10 s). Nhạc cụ hát chính của cảnh hát lại theo giọng và điệu của cảnh, 6 lần.
- **Đổi cảnh nghe ra:** 37 chỗ đổi cảnh, chỉ 3 chỗ vào mềm dưới lời.
- **Điểm nhấn sau lời:** mô-típ bí mật, "ta-da", xylophone của "Nope!" đều rơi ngay sau câu thoại. Ô 5 lấp ngay sau câu "She's over there! Let's go!".

## Trộn

- **Cường độ theo cảnh** (`LEVEL`): dâng ở chỗ phát hiện (Dải Ngân Hà, đốm lấp lánh, góc nhìn The Giant, bản đồ sáng lên, "tõm"), hạ dưới lời và ở các nhịp chờ. Chênh 19 dB giữa giây to nhất và nhỏ nhất.
- **Nhường giọng vừa đủ:** `T.duck(mus, ve, .66, .3)`.
- **Vòng bảo vệ lời rõ:** `T.speech_guard(mus, fx, vox, LINES, 11.)` hạ nhạc ở 12/97 câu, mỗi câu 0,5–6,5 dB. Lời hơn nhạc + tiếng động thấp nhất 10,7 dB.
- **Dưới câu cửa miệng** ("Nope!", "The stars!" cuối), câu tựa, "Yes! NOW!" và hai câu mở móc: nhạc lùi thêm 4–6 dB.
- **Giọng qua bộ lọc thấp 8,5 kHz** (giọng Dot và Blink nâng cao độ có tiếng rít khoảng 9,5 kHz).
- Mỗi tiếng động có sườn trước 1,5 ms (không vọt đỉnh khi mã hoá).
- Bản cuối: −14,0 LUFS, đỉnh thật −2,6 dBTP (`core/render/mux.sh`).
