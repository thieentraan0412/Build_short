# SHORT-006 · Soundtrack Timeline

## Lượt chống trùng giữa các tập (11/2026, lượt 2) · bản hiện hành

Điệu riêng của tập: **đồng quê** (móc, "tiny cows"), chiếm 31 % thời lượng. SHORT-004 đã bỏ đồng quê, nên điệu này chỉ còn ở tập này.

- **Sổ (12,2–16,1 s):** ukulele nắng + piano đồ chơi (trùng công thức ở 5 tập) → shuffle 112 BPM của sân trại, banjo đáp sau câu cửa miệng.
- **Giọt nảy (16,1–19,3 s):** polka với xylophone hát (trùng 004, 005) → trombone "oom-pah" hát; nốt xylophone viết tay theo mỗi cú nảy giữ nguyên.

Kết quả: không cảnh nào trùng công thức (điệu + nhạc cụ hát chính + đệm + bộ gõ) với một Short khác. Số liệu ở mục "Chống trùng lặp giữa các tập" của [SOUND-PLAN.md](SOUND-PLAN.md); lý do và đề xuất cho cả kênh: [`PHAN-TICH-SHORTS/NHAC-NEN-KENH.md`](../../PHAN-TICH-SHORTS/NHAC-NEN-KENH.md). Hình không đổi: mp4 giữ nguyên luồng hình đã giao, chỉ thay tiếng. Các mục bên dưới mô tả các lượt trước; chỗ nào khác mục này thì theo mục này.

## Lượt Sound Design Plan (11/2026) · bản hiện hành

Nhạc của tập được dựng lại theo Sound Design Plan ([`QUALITY.md`](../../_shared/QUALITY.md) §4, các mục *(SDP)*): mỗi cảnh một phong cách nhạc, một BPM, một nhạc cụ hát chính, một cách chuyển cảnh. **Bảng đầy đủ 7 cột, lý do chọn nhạc từng cảnh và các chỗ chuyển cảnh: [`SOUND-PLAN.md`](SOUND-PLAN.md)** (sinh từ `mix.py` bằng `_shared/tools/soundplan.py`).

- **Phong cách nhạc (4):** Happy Kids ×3, Bouncy Rhythm ×2, Suspense & Surprise ×1, Funny Comedy ×1.
- **BPM (6 mức):** 100, 112, 116, 120, 132, 136. Trước lượt này cả tập chạy 120 BPM. Giữ 120 BPM ở: móc · đồng quê, câu hỏi · về khung đầu (hình nhún theo phách, nốt viết tay theo lưới phim, hoặc nối vòng lặp).
- **Nhạc cụ hát chính (6):** xylophone, trumpet bịt, celesta, kazoo, piano đồ chơi, clarinet. Hai cảnh kề nhau không cùng nhạc cụ.
- **Nhạc cụ và bộ gõ mới của lượt này:** accordion, kazoo, mõ hai cao độ, piano đồ chơi, trumpet bịt, vỗ tay + lục lạc.
- **Giữ nguyên:** màu nhạc và giọng của tập, mô-típ bí mật, nhạc hiệu, các điểm nhấn viết tay, cường độ theo cảnh (`LEVEL`), tiếng động và giọng.

Các bảng cảnh nhạc bên dưới là của các lượt trước, giữ lại để so sánh.

## Màu nhạc của tập: "Barnyard Hoedown"

Tập này kể về một "trại bò" tí hon, nên nhạc là một điệu đồng quê ở Mi trưởng:
- kèn dăm hát giai điệu như harmonica;
- banjo gảy đệm;
- tuba "oom-pah" làm bè trầm;
- phách gỗ gõ như vó ngựa "lóc cóc".

Đây là lần đầu kênh dùng điệu `country` của lớp nhịp theo cảnh.

| | SHORT-003 | SHORT-004 | SHORT-005 | SHORT-006 |
|---|---|---|---|---|
| Giọng | Rê thứ → Fa | Fa | La trưởng | **Mi trưởng**; Đô♯ thứ khi giọt ngọt phồng |
| Điệu | Swing | Diễu hành | Valse 3/4 | **Đồng quê, phi ngựa, polka** (4/4, ô nhịp 2 s) |
| Nhạc cụ đặc trưng | Rhodes, vibraphone, contrabass | Tuba, snare, banjo | Hộp nhạc, pizzicato, đàn hạc | **Kèn dăm như harmonica, banjo gảy đệm, tuba oom-pah, phách gỗ** |
| Bộ gõ đặc biệt | Tiếng gáy | Bước chân | Tiếng chạm râu | **Chuông bò "clonk"** (chỉ ở câu "tiny cows") |

Banjo cũng có ở SHORT-004, nhưng ở đó nó nằm trong điệu diễu hành có snare dẫn. Ở đây banjo gảy đệm cho điệu đồng quê, với tuba và phách gỗ.

**Nhận diện của kênh vẫn giữ:**
- **mô-típ bí mật** đô–mi–sol, ở đây là Mi–Sol♯–Si trên xylophone, đúng lúc giọt ngọt "pop!";
- **marimba** chạy lên khi kính "chụp";
- bảng tiếng động chung.

Không thêm nhạc cụ mới vào `band.py`.

## Bảng cảnh nhạc (lớp nhịp theo cảnh, `_shared/audio/groove.py`) · bản trước Sound Design Plan

`mix.py` gọi `G.sec` cho từng cảnh; `G.save` ghi `out/music.json` để `qa.py` kiểm.

| Thời gian | Cảnh | Điệu | Giọng · hợp âm | Bè trầm · đệm · hát chính | Trống | Năng lượng |
|---|---|---|---|---|---|---|
| 0,0–3,2 | Móc: giọt ngọt bay, Crumb chụp, "My pet does!" | `country` | Mi · Mi Si7 | tuba · banjo · xylophone | gỗ (vó ngựa) | 2 |
| 3,2–4,85 | Miss Loupe nhảy vào, "Let's zoom in!" | `gallop` | Mi · La Mi | tuba · ukulele · kèn dăm | đồ chơi | 3 |
| 4,85–8,5 | Kính lớn: gõ râu, rệp cười, giọt ngọt phồng | `tiptoe` | Đô♯ thứ · Đô♯m La | pizzicato · pizzicato · hộp nhạc | gỗ | 1 |
| 8,5–12,15 | "Pop!", "Like milking tiny cows!", nhịp "ồ" | `country` | Mi · Mi La Si7 | tuba · banjo · kèn dăm | đồ chơi | 3 |
| 12,15–16,05 | Chụp → sổ, Albie, Crumb nhảy vào trang | `skip` | La · La Mi | bass gảy (bỏ dưới giọng Albie) · marimba · xylophone | chổi | 2 |
| 16,05–19,3 | Lật trang, giọt ngọt nảy tưng tưng | `polka` | Mi · Mi Si7 | tuba · ukulele · xylophone | đồ chơi | 3 |
| 19,3–22,0 | Câu hỏi cho trẻ, về khung đầu | `bounce` | Mi · Mi La | bass gảy · (không đệm) · kèn dăm | pop | 2 |

Không có đoạn nào giữ một kiểu quá 3,9 s; 6 điệu khác nhau; hai cảnh kề nhau khác nhau ít nhất 2 điểm (`qa.py`).

## Điểm nhấn viết tay

| Thời điểm | Nhấn | Vì sao |
|---|---|---|
| 0,0 | Hợp âm Mi: tuba + banjo gảy | Nhạc chạy từ giây 0, nối vòng lặp |
| 2,1 | Xylophone "ta-da" ba nốt | Giữa câu móc và câu của Crumb |
| 3,8 | Kèn dăm hai nốt "ực" | Crumb nuốt chửng giọt ngọt |
| 3,2 | Banjo chạy lên | Miss Loupe nhảy vào |
| 4,35 | Riser | Vào kính lớn |
| 6,5–8,45 | Pizzicato đi lên từng nốt, chậm rồi nhanh | Giọt ngọt phồng dần |
| 8,52 | **Mô-típ bí mật** Mi–Sol♯–Si (xylophone) + pad Mi | "Pop!" |
| 9,75 | Banjo bốn nốt vui | Sau tiếng chuông bò |
| 11,5 | Hộp nhạc ba nốt đi xuống | Nhịp "ồ" |
| 12,19 | Marimba chạy lên | Kính "chụp" |
| 15,22 | Xylophone trượt xuống | Crumb nhảy ùm vào trang |
| 17,35 · 17,85 · 18,35 | Xylophone cao dần ở mỗi cú nảy | Giọt ngọt nảy tưng tưng |
| 18,8–19,1 | **Khựng nhạc** (còn một pad mỏng) | Giọt trúng mặt kính "tink!" |
| 19,15 | Pizzicato "hả?" | Miss Loupe giật mình |
| 21,0 | Hợp âm Mi của khung đầu | Chữ móc trở lại |
| 21,75 | Tuba nốt Si dẫn | Về hợp âm Mi ở 0,0 |

## Âm lượng theo cảnh (`LEVEL` trong `mix.py`)

- Nhạc dâng ở "pop!", "clonk!", cú chụp, cú nhảy ùm và cú nảy đầu tiên.
- Nhạc hạ dưới lời, nhất là trong kính lớn (0,74).
- Sau câu hỏi cuối, nhạc dâng lại để dẫn về khung đầu.
