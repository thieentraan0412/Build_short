# SHORT-004 · Soundtrack Timeline

> **Bản hiện hành:** lượt Sound Design Plan (11/2026), ngay bên dưới; bảng đầy đủ ở [`SOUND-PLAN.md`](SOUND-PLAN.md). Lượt nhạc nền sinh động (11/2026, [mục cuối](#lượt-nhạc-nền-sinh-động-112026--bản-trước-sound-design-plan)) và các bảng cũ hơn giữ lại để so sánh; các điểm nhấn viết tay vẫn dùng.

## Lượt Sound Design Plan (11/2026) · bản hiện hành

Nhạc của tập được dựng lại theo Sound Design Plan ([`QUALITY.md`](../../_shared/QUALITY.md) §4, các mục *(SDP)*): mỗi cảnh một phong cách nhạc, một BPM, một nhạc cụ hát chính, một cách chuyển cảnh. **Bảng đầy đủ 7 cột, lý do chọn nhạc từng cảnh và các chỗ chuyển cảnh: [`SOUND-PLAN.md`](SOUND-PLAN.md)** (sinh từ `mix.py` bằng `_shared/tools/soundplan.py`).

- **Phong cách nhạc (7):** Playful Cartoon ×3, Funny Comedy ×3, Magical Adventure ×3, Happy Kids ×3, Suspense & Surprise ×2, Epic Cartoon ×1, Cute & Sweet ×1.
- **BPM (8 mức):** 96, 100, 104, 108, 112, 116, 120, 132. Trước lượt này cả tập chạy 120 BPM. Giữ 120 BPM ở: móc · diễu hành, Ants can! · polka, theo đường mùi · phiêu lưu, về khung đầu · diễu hành (hình nhún theo phách, nốt viết tay theo lưới phim, hoặc nối vòng lặp).
- **Nhạc cụ hát chính (10):** glockenspiel, xylophone, trumpet, sáo, bassoon, celesta, clarinet, piano đồ chơi, vibraphone, trumpet bịt. Hai cảnh kề nhau không cùng nhạc cụ.
- **Nhạc cụ và bộ gõ mới của lượt này:** accordion, bassoon, bassoon trầm, dàn dây spiccato, piano, piano đồ chơi, triangle, trumpet, trumpet bịt, vỗ tay + lục lạc.
- **Giữ nguyên:** màu nhạc và giọng của tập, mô-típ bí mật, nhạc hiệu, các điểm nhấn viết tay, cường độ theo cảnh (`LEVEL`), tiếng động và giọng.

Các bảng cảnh nhạc bên dưới là của các lượt trước, giữ lại để so sánh.

## Màu nhạc của tập: "Ant Parade"

Đàn kiến đi thành hàng, nên tập này được viết như một **ban kèn diễu hành đồ chơi**. Ba bí mật đổi màu theo cảnh:

| | Giọng | Điệu | Nhạc cụ |
|---|---|---|---|
| Hook, bí mật 1, sổ | Fa trưởng | Diễu hành 2/4 | Trống snare, tuba "oom", pizzicato "pah", glockenspiel, kèn đồ chơi |
| Bí mật 2: "Nope!" | Rê thứ | Thám tử rón rén | Pizzicato, snare chổi; tuba "bwomp" |
| Bí mật 2: đi theo đường mùi | Rê thứ → Fa | Diễu hành dồn (cảnh đặc trưng) | Snare, tuba, pizzicato, glockenspiel |
| Bí mật 3: trại rệp | Đô trưởng | Đồng quê "boom-chick" | Banjo, tuba; tuba "moo" |

Khác ba tập trước:
- SHORT-001: tổ khúc nhiều giọng.
- SHORT-002: calypso.
- SHORT-003: swing đêm.

Nhận diện của kênh vẫn giữ:
- Nhạc hiệu 2 s.
- **Mô-típ bí mật** đô–mi–sol ở ba lần phát hiện: glockenspiel Fa–La–Đô khi hạt mùi vào râu, glockenspiel khi đường mùi sáng lên, xylophone Đô–Mi–Sol–Đô khi giọt ngọt hiện ra.
- Marimba khi kính nở sang sổ.
- Kèn chơi mô-típ khi bật cười ở cuối.

Hai nhạc cụ mới trong [band.py](../../_shared/audio/band.py): `snare`, `banjo`.

## Timeline

| Thời gian | Cảnh | Phong cách | Nhạc | SFX đi kèm | Chuyển nhạc |
|---|---|---|---|---|---|
| 0,0–1,75 | Vụn bánh bước đi, ngón tay "ngửi" | Hook, có nhịp từ giây 0 | Diễu hành nhẹ (tuba, snare, kick); pizzicato nhón chân; kèn dăm "khịt khịt" theo ngón tay | chữ bật, bước chân, khịt | |
| 1,75 | Crumb bật lên, nhấc bổng vụn bánh | Cartoon impact | Cả ban đánh Fa: kick, tuba, xylophone, kèn, chũm chọe | boing + pop, blip | Stinger |
| 2,0–3,5 | "Ants can! Well, sort of!" | Vui, nảy | Diễu hành Fa–Đô, glockenspiel đi lên | swipe | |
| 3,5–6,0 | Kính nở → tựa | Nhạc hiệu | Glock chạy lên → nhạc hiệu 2 s | swell, swish, swirl | |
| 6,0–9,3 | Crumb ra mắt, Miss Loupe vào | Exploration | Diễu hành nhẹ Fa · Si♭ · Đô · Fa, glockenspiel điểm | badge, bước chân, swipe | |
| 9,35–12 | Hạt mùi bay vào râu | Scientific reveal | Riser → mô-típ bí mật Fa–La–Đô, pad | zoom, lấp lánh | |
| 13,0 · 13,25 | Tap, tap! | Funny | Hai nốt glockenspiel + xylophone đúng hai cú chạm | tap ×2 | |
| 16,0–18,6 | "So, they follow a map?" | Thám tử | Rê thứ: pizzicato rón rén, snare chổi | giấy | |
| 18,6–19,4 | "Nope!" | Funny | Tuba "bwomp" trượt xuống | buzzer | |
| 19,4–20,0 | | Brief pause | Khoảng lặng | | Ngắt nhạc |
| 20,0 | Đường mùi sáng lên trong kính | Scientific reveal | Mô-típ bí mật trên glockenspiel, pad Rê thứ, chuông | chuông + lấp lánh (đáp án là tiếng đầu tiên sau khoảng lặng) | |
| 22,0–27,0 | Kính trượt dọc đường mùi | Action | Diễu hành dồn Rê thứ · Si♭ · Đô · Fa, glockenspiel hát | bước chân cả đàn và lấp lánh hạt mùi từ 21,75; lướt dài | |
| 25,0–25,7 | Rollo lăn ngang, đàn kiến khựng | Funny, stop-time | Nhạc khựng | tiếng lăn, hai blip | Khựng rồi chạy tiếp |
| 27,0–28,0 | Đường mùi bò lên thân cây | Transition | Glockenspiel chạy lên, riser | đàn hạc vuốt lên | |
| 28,0–35,5 | Trại rệp | Đồng quê | Đô: tuba boom, banjo chick; giọt ngọt = mô-típ trên xylophone; "TINY COWS!" = tuba "moo"; Spindle ló ra = hai nốt celesta | tap ×2, giọt, sip, chữ bật; giọt thứ hai rơi lên vụn bánh (rơi, giọt, boing) | |
| 35,5–36,0 | Kính nở → sổ | Transition | Marimba chạy lên | đàn hạc + xoáy | |
| 36,0–45,5 | Sổ | Ấm, nhẹ | Ba sticker: hợp âm pizzicato + glockenspiel; ukulele dưới câu của Albie (không bè trầm); dấu hỏi glockenspiel đi lên sau "Can I hold the lens?"; tuba xìu xuống sau "Not yet!" | trang sổ, dán ×3 | |
| 45,5–46,0 | Kính nở → kết | Transition | | lensiris | |
| 46,0–48,6 | Crumb theo mùi tới cây kem | Funny tiptoe | Pizzicato nhón chân | bước chân, khịt | |
| 48,6–49,4 | "I can carry it!", nhấc bổng cây kem | Action | Trống dồn, kèn đồ chơi "ta-da" | lên dây cót, lắc lư | |
| 49,4–50,2 | Kem đổ ụp lên kính | Brief pause | Ngắt nhạc | còi rơi, bẹp, tink | Ngắt nhạc |
| 50,2 | Miss Loupe bật cười | Ending | Hợp âm Fa, tuba, kick, chũm chọe; kèn chơi mô-típ | boing | Stinger |
| 51,3–52,0 | Kính nở ra khung đầu | Loop | Nhịp diễu hành chạy lại, riser | xoáy + chũm chọe ngược | Vòng lặp |

## Cường độ theo cảnh

| Mở | Nhạc hiệu | Bí mật 1 | Hạt mùi | Tap | Thám tử | Đường mùi | Trại rệp | Sổ | Sổ (giữ) | Kết | Lặp |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0,62 | 0,45 | 0,85 | 0,8 | 0,85 | 0,8 | 1,0 | 0,85 | 0,8 | 0,7 | 0,85 | 0,85 |

Nhạc hiệu giữ nguyên nốt và âm sắc, chỉ nhỏ hơn để câu "Big secrets of tiny bugs!" đọc cùng lúc vẫn rõ.

## Lượt nhạc nền sinh động (11/2026) · bản trước Sound Design Plan

Theo `Task.md`: *"Cần thêm nhiều nhạc nền sinh động, trong 1 short nhạc nền đang không có sự thay đổi."* Hình, lời, tiếng động và các điểm nhấn nhạc viết tay (mô-típ bí mật, stinger, khựng, nhạc hiệu, nối vòng lặp) giữ nguyên. Lớp đệm đứng yên được thay bằng **lớp nhịp theo cảnh** ([`_shared/audio/groove.py`](../../_shared/audio/groove.py)):
- **Mỗi cảnh một điệu.** Mỗi cảnh có điệu, vòng hoà âm, bộ nhạc cụ, bộ trống và mức năng lượng riêng. Hai cảnh kề nhau khác nhau ở ít nhất hai trong năm thứ đó.
- **Dưới lời nhạc vẫn chạy.** Dưới lời còn bass, kick, hat/shaker và tiếng đệm ngắn ở dải cao. Dưới giọng trầm của Albie thì bỏ bass.
- **Nhạc đáp lời.** Khoảng không lời giữa hai câu có một câu đáp ngắn của nhạc cụ hát chính.
- **Đổi cảnh có dấu.** Trước cảnh mạnh hơn có trống dồn, trước cảnh nhẹ hơn có chuỗi nốt đi xuống. Phách đầu cảnh mới có kick và chũm chọe mềm.

**Bản trước:** v2 (`out/short-004-v2.mp4`, `out/mix-v2.py`, `out/MUSIC-v2.md`, `out/stem_mus-v2.wav`).

**Vì sao nghe như không đổi.** Diễu hành Fa chạy liền 6–16 s rồi 22–27 s, cùng tuba, snare và pizzicato. Hai chỗ khám phá (hạt mùi, đường mùi) chỉ là pad ngân dài đứng yên. Cảnh sổ 36–46 s gần như chỉ có vài nốt ukulele và glockenspiel.

**Bản mới.** Hai mươi hai cảnh nhạc, bảy điệu. Diễu hành vẫn là màu chính nhưng không còn chạy liền:
- **Đầu phim:** diễu hành rồi polka khi Crumb bật lên; sau nhạc hiệu là diễu hành ra mắt.
- **Bí mật 1:** đàn hạc rải khi hạt mùi bay vào, shuffle "tap, tap".
- **Bí mật 2:** thám tử rón rén, glockenspiel rải khi đường mùi sáng, diễu hành dồn theo đường mùi.
- **Bí mật 3:** đồng quê "boom-chick" ở trại rệp, polka "TINY COWS".
- **Sổ:** shuffle dưới câu của Albie, nửa nhịp "Can I hold the lens?", diễu hành.
- **Kết:** rón rén theo mùi tới cây kem, nửa nhịp dưới câu hỏi kết, diễu hành về khung đầu.

Lớp nhịp làm nhạc chung đầy hơn, nên khâu chuẩn hoá đẩy nhạc hiệu nhỏ đi khoảng 4 dB. `LEVEL` của nhạc hiệu được nâng từ 0,45 lên 0,68 để giữ gần đúng độ to cũ (chênh 1–2 dB). Câu "Big secrets of tiny bugs!" đọc chồng lên nhạc hiệu vẫn rõ: 13,1 dB, bản trước 12,1.

### Bảng cảnh nhạc

Sinh từ `out/music.json`. Cột *Nguồn*: "lớp nhịp" là phần `groove.py` dựng; "viết tay" là đoạn có sẵn trong `mix.py` (điểm nhấn, tổ khúc, nhạc hiệu). Các điểm nhấn viết tay ở bảng Timeline phía trên vẫn nằm trên lớp nhịp.

| Thời gian | Cảnh nhạc | Điệu | Hoà âm | Nhạc cụ | Trống | Năng lượng | Nguồn |
|---|---|---|---|---|---|---|---|
| 0–1,75 | móc · diễu hành | diễu hành | F | tuba, pizzicato, glockenspiel | kick, snare, lục lạc | vừa | lớp nhịp |
| 1,75–3,5 | Ants can! · polka | polka | F · F→C | tuba, pizzicato, xylophone | kick, snare | đầy | lớp nhịp |
| 3,5–4 | kính nở | khựng / điểm nhấn viết tay | — | glockenspiel | — | — | viết tay |
| 4–6 | nhạc hiệu | nhạc hiệu | C | kèn đồ chơi, chuông, marimba | — | vừa | viết tay |
| 6–9,35 | Crumb ra mắt · diễu hành | diễu hành | F→B♭ · C→F | tuba, pizzicato, glockenspiel | kick, snare, lục lạc | vừa | lớp nhịp |
| 9,35–12 | hạt mùi · rải đàn hạc | rải lơ lửng | F | tuba, đàn hạc, glockenspiel | — | nhẹ | lớp nhịp |
| 12–16 | tap, tap · shuffle | shuffle nhún nhảy | F · C | tuba, ukulele, xylophone | kick, clap, shaker | vừa | lớp nhịp |
| 16–18,6 | thám tử · rón rén | rón rén | Dm · A7 | pizzicato trầm, pizzicato, kèn dăm | mõ gỗ, shaker | nhẹ | lớp nhịp |
| 18,6–20 | Nope · lặng | khựng / điểm nhấn viết tay | — | — | — | — | viết tay |
| 20–22 | đường mùi sáng · rải glockenspiel | rải lơ lửng | Dm | tuba, glockenspiel, hộp nhạc | — | nhẹ | lớp nhịp |
| 22–27 | theo đường mùi · diễu hành dồn | diễu hành | Dm→B♭ · C→F | tuba, pizzicato, glockenspiel | kick, snare, lục lạc | đầy | lớp nhịp |
| 27–28 | bò lên thân cây | khựng / điểm nhấn viết tay | — | glockenspiel | — | — | viết tay |
| 28–31,65 | trại rệp · đồng quê | đồng quê "boom-chick" | C · G | tuba, banjo, xylophone | kick, clap | vừa | lớp nhịp |
| 31,65–35,3 | TINY COWS · polka | polka | G · C · G | tuba, banjo, xylophone | kick, snare | đầy | lớp nhịp |
| 35,3–36,5 | chụp sticker | khựng / điểm nhấn viết tay | — | — | — | — | viết tay |
| 36,5–41,2 | sổ · shuffle | shuffle nhún nhảy | F · F→B♭ · F | tuba, ukulele, glockenspiel | kick, clap, shaker | vừa | lớp nhịp |
| 41,2–44 | Can I hold the lens? · nửa nhịp | nửa nhịp đung đưa | F · B♭ | tuba, marimba, glockenspiel | kick, chổi trống, hat | nhẹ | lớp nhịp |
| 44–46 | về kết · diễu hành | diễu hành | F→C | tuba, pizzicato, glockenspiel | kick, snare, lục lạc | vừa | lớp nhịp |
| 46–48,6 | theo mùi tới cây kem · rón rén | rón rén | F · C | pizzicato trầm, pizzicato, kèn dăm | mõ gỗ, shaker | nhẹ | lớp nhịp |
| 48,6–50,2 | nhấc · đổ · khựng | khựng / điểm nhấn viết tay | — | — | — | — | viết tay |
| 50,2–51,3 | cười · câu hỏi kết | nửa nhịp đung đưa | F | tuba, marimba, glockenspiel | kick, chổi trống, hat | nhẹ | lớp nhịp |
| 51,3–52 | về khung đầu · diễu hành | diễu hành | F | tuba, pizzicato, glockenspiel | kick, snare, lục lạc | vừa | lớp nhịp |

### Số đo trước / sau

| | Bản trước | Bản mới |
|---|---|---|
| Số điệu trong phim | 3 (diễu hành, rón rén, đồng quê) + pad | 7, 22 cảnh nhạc |
| Đoạn dài nhất cùng một kiểu | ≈ 7,3 s (đồng quê 28–35,3 s) | 5,0 s (diễu hành dồn theo đường mùi) |
| Nốt nhạc mỗi giây (trung vị) dưới lời / khoảng trống | 6 / 6 | 10 / 14 |
| Câu đáp giữa các câu thoại | — | 19 (11 tự động, 8 viết tay) |
| Lời rõ hơn nhạc + tiếng động, câu thấp nhất | 12,1 dB (câu đọc trên nhạc hiệu) | 13,1 dB (cùng câu) |

Nốt mỗi giây được đếm từ các lệnh đặt nốt của `mix.py`; một hợp âm tính mỗi nốt một lần. Độ rõ lời đo theo `qa.py` (dải 300–4000 Hz, trung vị theo câu), trên cùng một stem giọng và tiếng động.

**`_shared/qa.py`: 34/34 đạt**, không còn cảnh báo. Độ to −14,0 LUFS, đỉnh thật −2,0 dBTP.
