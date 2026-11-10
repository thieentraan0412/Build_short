# SHORT-007 · Soundtrack Timeline

## Lượt Sound Design Plan (11/2026) · bản hiện hành

Nhạc của tập được dựng lại theo Sound Design Plan ([`QUALITY.md`](../../_shared/QUALITY.md) §4, các mục *(SDP)*): mỗi cảnh một phong cách nhạc, một BPM, một nhạc cụ hát chính, một cách chuyển cảnh. **Bảng đầy đủ 7 cột, lý do chọn nhạc từng cảnh và các chỗ chuyển cảnh: [`SOUND-PLAN.md`](SOUND-PLAN.md)** (sinh từ `mix.py` bằng `_shared/tools/soundplan.py`).

- **Phong cách nhạc (7):** Magical Adventure ×2, Funny Comedy ×2, Suspense & Surprise ×2, Bouncy Rhythm ×2, Happy Kids ×2, Playful Cartoon ×1, Epic Cartoon ×1.
- **BPM (9 mức):** 96, 100, 104, 108, 112, 116, 120, 126, 132. Trước lượt này cả tập chạy 120 BPM. Giữ 120 BPM ở: móc · đêm lấp lánh, cả vườn · ban nhạc đêm, câu hỏi · về khung đầu (hình nhún theo phách, nốt viết tay theo lưới phim, hoặc nối vòng lặp).
- **Nhạc cụ hát chính (11):** glockenspiel, sáo, bassoon, vibraphone, xylophone, kazoo, celesta, trumpet, piano đồ chơi, clarinet, trống thép. Hai cảnh kề nhau không cùng nhạc cụ.
- **Nhạc cụ và bộ gõ mới của lượt này:** accordion, bassoon, bongo, dàn dây spiccato, kazoo, mõ hai cao độ, piano, piano đồ chơi, timpani, triangle, trumpet, vỗ tay + lục lạc.
- **Giữ nguyên:** màu nhạc và giọng của tập, mô-típ bí mật, nhạc hiệu, các điểm nhấn viết tay, cường độ theo cảnh (`LEVEL`), tiếng động và giọng.

Các bảng cảnh nhạc bên dưới là của các lượt trước, giữ lại để so sánh.

## Màu nhạc của tập: "Glow-Code Bossa"

Tập này kể về những con đom đóm "nói chuyện" bằng ánh sáng, nên mỗi cú nháy là một nốt nhạc:
- **Giọng Si giáng trưởng**, lần đầu kênh dùng (Si giáng là giọng của đèn đêm; các cảnh tò mò đi sang Sol thứ, cảnh "No!" sang Mi giáng).
- **Sáo** hát giai điệu; **đàn hạc** và **marimba** rải; **bass gảy** (contrabass ở cảnh lơ lửng); bộ gõ **latin** (phách gỗ, shaker).
- **Glockenspiel là tiếng của ánh sáng:** mỗi cú nháy của đom đóm (`flash`, `code`, `reply`, `sync` trong `SOUND.md`) là một nốt glockenspiel. Mẫu nháy của Blink (ngắn, ngắn, nghỉ, dài) vì vậy cũng là một câu nhạc nhỏ.
- **Cảnh đặc trưng:** tiếng dế của Chirp (`band.chirp`) gõ đúng từng phách, rồi cả ban nhạc vào: Night Band chơi lần đầu.
- **Mô-típ bí mật** (Si giáng–Rê–Fa) ở ba khoảnh khắc lời giải: kẹo dẻo không chín, tấm cánh bật, mẫu nháy dài.
- **Nhạc hiệu 0,8 s mới** (`band.sting`, nốt chủ Si giáng) đi với logo trong cú lao vào kính. `jingle()` 2 s giữ nguyên cho video dài.

| | 003 | 006 | **007** |
|---|---|---|---|
| Giọng | Rê thứ → Fa | Mi trưởng | **Si giáng trưởng** |
| Điệu chính | Swing | Đồng quê | **Nảy latin, rải lơ lửng, nhảy chân sáo, phi ngựa** |
| Giai điệu | Vibraphone | Kèn dăm | **Sáo, glockenspiel** |
| Bộ gõ | Jazz (búng tay, chổi) | Gỗ, đồ chơi | **Latin (phách gỗ, shaker), tiếng dế** |

## Bảng cảnh nhạc · bản trước Sound Design Plan

Dựng bằng lớp nhịp theo cảnh [`_shared/audio/groove.py`](../../_shared/audio/groove.py) (`G.sec`); nhạc hiệu ghi bằng `G.mark`. `out/music.json` là bảng `qa.py` đọc.

| # | Cảnh | Giây | Điệu | Giọng, hoà âm | Bass · đệm · giai điệu | Bộ gõ | Năng lượng |
|---|---|---|---|---|---|---|---|
| 1 | Móc · đêm lấp lánh | 0–3,0 | `bounce` | Si giáng · Bb F | bassn · marimba · glock | latin | 2 |
| 2 | Logo · nhạc hiệu | 3,0–3,8 | nhạc hiệu (`sting`) | Si giáng | kèn đồ chơi, marimba, chuông | — | 3 |
| 3 | Bí mật 1 · ánh sáng lạnh | 3,8–7,0 | `float` | Sol thứ · Gm7 Ebmaj7 | upright · đàn hạc rải · sáo | — | 1 |
| 4 | Kẹo dẻo · tíc tắc | 7,0–9,9 | `tiptoe` | Si giáng · Bb Gm | pizz trầm · pizz · celesta | gỗ | 1 |
| 5 | Đom đóm là ruồi? · hồi hộp | 9,9–12,35 | `tension` | Sol thứ · Gm D7 | upright · pizz · sáo | tom | 2 |
| — | Khựng | 12,35–12,95 | (lớp mỏng: hợp âm rất nhỏ + trống lăn) | | | | |
| 6 | Họ bọ cánh cứng · đồng diễn | 12,95–17,0 | `skip` | Si giáng · Bb Eb F Bb | bassn · marimba · xylophone | latin | 3 |
| 7 | "No!" · lén lút | 17,0–22,5 | `sway` (nửa nhịp) | Mi giáng · Eb Cm | upright · đàn hạc · sáo | chổi | 1 |
| 8 | Mật mã · rải | 22,5–25,2 | `float` | Si giáng · Bbmaj7 Gm7 | bassn · glock rải · celesta | — | 1 |
| 9 | Cả vườn · ban nhạc đêm | 25,2–30,35 | `bounce` + tiếng dế mỗi phách | Si giáng · Bb F Gm Eb | bassn · marimba · sáo, glock | latin | 3 |
| 10 | Sổ · nhảy chân sáo | 30,35–34,4 | `skip` | Fa · F Bb | bassn · đàn hạc · xylophone | chổi | 2 |
| 11 | Gag · đêm thì thầm | 34,4–38,8 | `tiptoe` | Sol thứ · Gm Cm | pizz trầm · pizz · glock | gỗ | 1 |
| 12 | Nháy đáp · vui | 38,8–42,3 | `gallop` (nhịp kép) | Si giáng · Bb Eb | bassn · marimba · sáo | đồ chơi | 3 |
| 13 | Câu hỏi · về khung đầu | 42,3–44,0 | `bounce` | Si giáng · Bb F | bassn · đàn hạc · glock | pop | 2 |

Không cảnh nào dài quá 5,5 s. Hai cảnh kề nhau luôn khác ít nhất hai trong năm thứ: điệu, hoà âm, nhạc cụ, bộ gõ, năng lượng.

## Điểm nhấn viết tay (`mix.py`)

| Giây | Điểm nhấn |
|---|---|
| 0,0 | Hợp âm Si giáng (bass gảy + marimba rải) đúng khung 0; nối với nốt Fa ở 43,75 s (vòng lặp) |
| 2,1 | Đuôi bùng sáng: marimba chạy lên bốn nốt |
| 3,0–3,8 | Nhạc hiệu 0,8 s (`sting`, nốt chủ Si giáng): ba nốt kèn "BIG SE-CRETS", bốn nốt marimba tí hon, hợp âm + chuông |
| 7,6 | Kẹo dẻo không chín: mô-típ bí mật (celesta) |
| 8,95 | Câu đáp "ha-ha" (xylophone) sau "Look! No fire!" |
| 9,9 · 17,0 · 30,35 | "Chụp": marimba chạy lên (ban nhạc kênh) |
| 12,35–12,95 | Khựng: hợp âm rất nhỏ, trống lăn thì thầm (`hush`) |
| 13,6 | Tuba "bwomp" đi xuống sau "Nope!" |
| 14,75 | Tấm cánh bật: mô-típ bí mật (xylophone) |
| 22,4 | Câu đáp "hì" (celesta) sau "Okay, yes." |
| 23,9 | Mẫu nháy dài: mô-típ bí mật (celesta) |
| 26,0–30,25 | Tiếng dế của Chirp mỗi phách |
| 30,45–31,1 | Đàn hạc vuốt lên rồi xuống (lao xuyên kính → sổ) |
| 33,5 | Blink lao vào trang: xylophone trượt xuống |
| 38,8 | Miss Loupe nháy mắt: celesta ba nốt |
| 42,3 | Chữ móc trở lại: hợp âm Si giáng của khung đầu |

## Cường độ theo cảnh (`LEVEL`)

Dâng ở logo, ở ba lời giải, ở mỗi cú "chụp", ở cảnh cả vườn nháy, ở cú Blink lao vào trang và khi chữ móc trở lại. Hạ ở khựng trước "Nope!" (0,6), dưới lời và ở đầu gag. Nhạc còn nhường giọng bằng `toon.duck` (dải chữ −15 dB).
