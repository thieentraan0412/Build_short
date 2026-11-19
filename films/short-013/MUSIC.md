# SHORT-013 · Soundtrack Timeline

> **Cập nhật 19/11/2026 (dựng lại theo chuẩn 11/2026b, như SHORT-016):** phần dưới đây mô tả bản 14/11/2026. "Meadow Cumbia" giờ là một bài hát (Rê giáng trưởng, 8 phần 108–120 BPM): 11/18 câu đọc vào phách, điệp khúc "Tummy ears, and legs that sing!" ×2 (xylophone chơi giai điệu); song tấu thành cảnh nhạc theo bài hát (bắt đầu ô nhịp 13), thêm "điệp khúc 2", câu hỏi kết dời ra sau; lớp nền / năng lượng theo cảnh. Phim 46 s, mọi mốc dời theo giọng Miss Loupe chậm lại. Bảng hiện hành: [`SOUND-PLAN.md`](SOUND-PLAN.md) (sinh từ `out/music.json`, `events.json`, `out/scenes.json`), [`TREATMENT.md`](TREATMENT.md) mục 7, 8, A và H.

## Màu nhạc của tập: "Meadow Cumbia Duet"

Tập này kể về những chú côn trùng **nghe ở chỗ lạ** và **hát bằng cách cạo**, nên nhạc là một ban nhạc cạo và gõ giữa bãi cỏ trưa hè:
- **Giọng Rê giáng trưởng**, lần đầu kênh dùng làm giọng chính (001 Đô, 002 Sol, 003 Rê thứ/Fa, 004 Fa, 005 La, 006 Mi, 007 Si giáng, 008 La giáng, 009 Rê, 010 Mi giáng). Câu hỏi "WHY?" và gag ồn ào lên Sol giáng (bậc bốn); phần đung đưa cuối có Mi giáng thứ. Nốt La giáng ở cuối dẫn về hợp âm Rê giáng của khung đầu, nên vòng lặp liền.
- **Điệu riêng của tập: cumbia** (`STYLES['cumbia']`, bộ gõ `guira`: tambora phách 1–3, güira cạo móc kép, bongo). Güira là một nhạc cụ **cạo**, như chính cái chân của Hop. Dùng ở ba chỗ: bí mật 2 (hát bằng chân, 5,8 s), song tấu (viết tay, 4,45 s), sổ (3,15 s): khoảng 30 % thời lượng.
- **Nhạc cụ của nhân vật:** dây spiccato và tiếng `rasp` = vĩ cầm chân của Hop; "chuông dế" `chirpn` (ba xung có cao độ) = Chirp; phong cầm = sân khấu cumbia; còi lá cỏ = Crumb.
- **Motif lò xo của Hop: Rê♭–Fa–La♭–Rê♭** đi lên, mỗi lần Hop bật (trumpet ở BOING, ở cú nảy kết song tấu). **Mô-típ bí mật đô–mi–sol** của kênh (ở Rê giáng, celesta) đúng lúc màng nghe lộ ra.
- **Song tấu là một cặp hỏi – đáp thật:** Hop "kéo vĩ" ở mỗi phách (giai điệu Rê giáng ngũ cung đi lên, xuống), Chirp gáy đáp ở nửa phách sau, cao hơn một quãng tám rưỡi. Mỗi hình nốt hiện lên (tim, sao, mặt cười) là một hợp âm celesta: Rê giáng, Sol giáng, La giáng.
- Dựng theo **Sound Design Plan** (`Groove(..., plan=True)`): mỗi cảnh một phong cách, một BPM (100–132), một nhạc cụ hát chính. Bảng đầy đủ 7 cột, lý do từng cảnh và các chỗ chuyển: **[SOUND-PLAN.md](SOUND-PLAN.md)**.

| | 009 | 010 | **013** |
|---|---|---|---|
| Giọng | Rê trưởng | Mi giáng trưởng | **Rê giáng trưởng** |
| Điệu riêng | ska | samba | **cumbia (güira cạo)** |
| Điểm riêng | Mỗi số đếm là một nốt marimba | Bay lùi = motif chạy ngược | **Côn trùng hát bằng cạo = nhạc cụ cạo; song tấu hỏi – đáp viết tay** |
| Nhạc cụ của nhân vật | Kazoo = Fizz | Sáo / xylophone = Zip | **Vĩ "rè" + dây spiccato = Hop; chuông dế = Chirp** |

**Chống trùng giữa các tập** (so với `music-plan.json` của 14 Short khác, kể cả 011, 012, 014, 015 đang dựng song song): không cảnh nào trùng công thức điệu + nhạc cụ hát chính + đệm + bộ gõ. Bản đầu có cảnh "lò xo nén" = rình rập hài + bassoon + pizzicato + mõ gỗ, trùng 003 và 005 và là cặp quá quen (3 tập), nên đổi sang trombone + mõ hai cao độ. Ba cặp điệu + nhạc cụ đã có ở hai Short khác (shuffle + xylophone, phiêu lưu + sáo, đung đưa + vibraphone / sáo) cũng đổi (banjo, piano đồ chơi, celesta), để không thành "quá quen" khi các tập song song đăng. Mỗi cặp còn lại chỉ có ở tối đa một Short khác (mục "Chống trùng lặp giữa các tập" của SOUND-PLAN.md).

## Điểm nhấn viết tay (`mix.py`)

| Giây | Điểm nhấn |
|---|---|
| 0,0 | Hợp âm Rê giáng (bass gảy + ukulele) đúng khung 0; nối với nốt La giáng ở 43,75 s (vòng lặp) |
| 0,4 | Cả ba giật mình: xylophone chạy lên năm nốt |
| 1,05 · 1,2 | Chirp giơ chân: hai nốt celesta · Hop xoay sườn: hai nốt marimba |
| 2,05 | Hai bạn nhìn nhau "?": bassoon hai nốt đi lên như câu hỏi |
| 3,0–3,8 | Nhạc hiệu 0,8 s của kênh (`band.sting`, `root=73`) |
| 5,0 | Tai Chirp sáng: đàn hạc vuốt lên |
| 6,6–7,25 | Khựng (`G.mark` 'break'): trống lăn thì thầm |
| 7,87 · 8,17 | Sau "Nope!": trombone "wah-wah" đi xuống |
| 8,9 · 9,0 | Màng nghe lộ ra: đàn hạc vuốt lên; **mô-típ bí mật đô–mi–sol** (celesta, Rê giáng) |
| 9,81 · 10,14 | Vòng âm chạm màng nghe: marimba cao dần |
| 12,35–13,45 | Hai châu chấu xa hát: ba nốt "rè" rất nhỏ, bên phải |
| 13,89 · 19,69 · 28,59 | "Chụp": marimba chạy lên + đàn hạc |
| 15,5–19,45 | Mỗi nhát kéo chân là một nốt "rè" (nhỏ dưới lời); độc tấu Rê giáng–Fa–La giáng–Rê giáng ở 18,7–19,45 |
| 21,2–22,1 | Lò xo nén: trombone trượt xuống năm bậc; riser ngắn |
| 22,4 | BOING: trumpet motif lò xo đi lên + timpani |
| 24,1 | Hop đáp xuống gốc cây: timpani + hợp âm Rê giáng |
| 24,35–28,4 | **Song tấu viết tay** (cumbia: tambora, güira, bongo, bass, phong cầm; Hop hỏi, Chirp đáp) |
| 25,55 · 26,75 · 27,6 | Tim · sao · mặt cười: hợp âm celesta + đàn hạc vuốt |
| 28,05 | Hop nảy kết: trumpet motif lò xo |
| 31,77 | Hop nhảy vào trang: xylophone trượt xuống |
| 34,6–36,1 | Chơi lại: nốt "rè" to dần |
| 36,3–37,45 | Khựng: vibraphone run run; ba cú bịt là ba nốt (celesta · marimba · "keng" thuỷ tinh) |
| 42,6 | Chữ móc trở lại: hợp âm Rê giáng nhỏ |

## Cường độ theo cảnh (`LEVEL`)

Dâng ở cú giật mình, logo, "Nope!", lúc màng nghe lộ ra, các cú "chụp", BOING, sau mỗi câu của song tấu, cú Hop nhảy vào trang và đoạn "to quá". Hạ ở chỗ khựng trước "Nope!" (0,5), dưới các câu giải thích (0,72–0,74), ở cú khựng bịt tai (0,55) và dưới câu hỏi kết (0,66). Nhạc còn nhường giọng bằng `toon.duck` (dải chữ). Trong song tấu, nốt của Hop và Chirp nhỏ lại dưới hai câu thoại và to lên ở khoảng trống.
