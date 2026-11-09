# SHORT-003 · Soundtrack Timeline

> **Bản hiện hành:** lượt nhạc nền sinh động (11/2026), ở [mục cuối](#lượt-nhạc-nền-sinh-động-112026--bản-hiện-hành). Lớp đệm của các bảng dưới đây đã được thay bằng lớp nhịp theo cảnh; các điểm nhấn viết tay giữ nguyên.

## Màu nhạc của tập: "Night Band swing"

Chirp là nhạc công của kênh, nên tập về cái tai của nó được viết như một ban nhạc đêm nhỏ chơi swing. Màu này khác hai tập cùng tuần:

| | SHORT-001 | SHORT-002 | SHORT-003 |
|---|---|---|---|
| Giọng | C, đổi giọng theo từng bí mật | Sol | **Rê thứ → Fa trưởng** khi cái tai sáng lên |
| Điệu | Rón rén, polka, lơi, swing, chạy móc đơn | Calypso | **Swing**: móc đơn lệch về 2/3 phách |
| Nhạc cụ đặc trưng | Pizzicato, sáo, celesta, tuba, kèn | Steel pan, phách gỗ | **Phím điện kiểu Rhodes, vibraphone, contrabass gảy đi bộ, búng tay, hat swing** |
| Bộ gõ đặc biệt | Tiếng dế trong cảnh đêm | — | Tiếng gáy của Chirp và của con dế xa (tiếng động) chen vào giữa nhịp |

Nhận diện của kênh vẫn giữ:
- **Mô-típ bí mật** đô–mi–sol (Fa–La–Đô trên vibraphone) đúng lúc cái tai sáng lên.
- **Marimba** chạy lên khi kính nở sang sổ.
- Bảng tiếng động chung.

Bốn nhạc cụ mới được thêm vào [band.py](../../_shared/audio/band.py): `rhodes`, `vibes`, `snap`, `upright`. Cả bốn đều tổng hợp bằng code.

## Timeline

| Thời gian | Cảnh | Phong cách | Nhạc | SFX đi kèm | Chuyển nhạc |
|---|---|---|---|---|---|
| 0,0 | Chirp vểnh chân nghe, dế xa gáy (nối từ cuối phim) | Hook, có nhịp từ giây 0 | Rê: bass, vibraphone, glock, kick nhẹ | chữ bật, tiếng gáy xa | Nối vòng lặp |
| 0,5–1,75 | Nghe thấy, gáy đáp, lại vểnh chân | Funny, hỏi–đáp | Bass đi bộ Rê–Fa–La dưới câu hỏi; vibraphone "ping" khi sóng chạm tai; phím điện chen giữa các tiếng gáy của Chirp; bass chạy lên khi vểnh chân | ping, tiếng gáy, nốt bật, boing | Stop-time theo hành động |
| 2,0–4,0 | Kéo xa, "Let's zoom in!", kính phóng | Exploration, đầy nhịp | Swing đủ: bass, búng tay 2–4, hat, phím điện Rê thứ · Si♭; riser vào cú phóng | whoosh, swipe, tink, zoom | Riser |
| 4,5 | Cái tai sáng lên | Scientific reveal | Mô-típ bí mật Fa–La–Đô trên vibraphone, pad Fa trưởng | lấp lánh | Sang Fa trưởng |
| 5,0–7,3 | "Its ears are on its front legs!" | Exploration nhẹ | Swing thưa (không búng tay), Fa · Rê thứ | | |
| 8,0 · 8,5 · 9,3 | Mặt tai rung như mặt trống | Scientific reveal, đồng bộ hành động | Mỗi cú "bum": nốt bass + tom; hai nốt vibraphone đáp | tiếng gáy xa, "bum" | |
| 9,3 | TINY DRUM! | Stinger | Trống dồn nhỏ + hợp âm Fa trên phím điện + vibraphone | | Stinger |
| 9,8–12,3 | Kính rời đi; "Hello, little ears!" | Emotional, ấm | Bỏ trống; pad Si♭, bass thưa, vibraphone giữ nốt dài | swish, gió | Crossfade, nửa nhịp |
| 12,35–13,5 | Chirp khúc khích, cả hai bật cười | Funny | Vibraphone láy; hợp âm Fa, bass | tiếng khúc khích, lấp lánh, boing | |
| 13,5–14,0 | Kính nở thành sổ | Transition | Marimba chạy lên → kick, chũm chọe, hợp âm Fa | xoáy, glock | Riser |
| 14,5–17,3 | Sticker; Albie: "Six legs? In you go!" | Ấm, thưa | Vibraphone + ukulele ở tiếng dán; dưới câu của Albie chỉ búng tay | dán, ding | |
| 17,35–19,5 | Chirp nhảy tới; "Ears on its head?" | Funny | Bass chạy lên theo cú nhảy; swing nhẹ dưới câu hỏi | boing, đậu | |
| 19,6 | "NOPE!" | Cartoon impact | Cả ban nhạc khựng một phát (hợp âm Rê thứ, bass, kick) | chữ bay vào, rung | Stinger |
| 19,7–21,15 | Chirp bịt chặt đầu gối, run run | Brief pause | Ngắt nhạc | "chụt", run run, giấy | Ngắt nhạc |
| 22,2–24,0 | Hé mắt, lại vểnh chân; vòng sóng âm mở về khung đầu | Ending / Loop | Một nốt vibraphone; bass đi bộ quay lại; vibraphone rải lên; bass dẫn Mi → Rê ở 0,0 | blip, boing, tiếng gáy xa, xoáy, chũm chọe ngược | Vòng lặp liền |

## Cường độ theo cảnh

Nhạc được nhân một đường cường độ (chuyển mềm 0,3 s), rồi mới nhường giọng (`toon.duck`):

| Mở | Kéo xa | Trong kính | Mặt trống | "Ồ" | Khúc khích | Kính nở | Sổ | Nhảy tới | Câu hỏi | Lặp |
|---|---|---|---|---|---|---|---|---|---|---|
| 0,85 | 0,95 | 0,8 | 0,85 | 0,7 | 0,85 | 0,9 | 0,8 | 0,9 | 0,7 | 0,9 |

## Bản v2 (tối ưu theo Retensis, [RETENSIS.md](RETENSIS.md))

Soundtrack Timeline đầy đủ của bản mới nằm ở mục C của RETENSIS.md. Những gì đổi so với bảng trên:

- **Mỗi cảnh một cảm xúc:**
  - hook: hồi hộp, lắng nghe (vibraphone rung ở dải cao);
  - soi: khám phá;
  - mặt trống: nhịp theo hành động;
  - nhịp "ồ": đáng yêu (thêm hộp nhạc);
  - sổ: vui, nhẹ;
  - trước "NOPE!": hồi hộp nhẹ (pizzicato rón rén);
  - "NOPE!": bất ngờ;
  - cuối phim: lắng nghe (pad Rê thứ mỏng).
- **Không còn lỗ im:**
  - dưới câu của Albie có búng tay, chổi trống, bass gảy thưa và lấp lánh hộp nhạc dải cao (trước đó −56 / −67 dB);
  - sau "NOPE!" ban nhạc khựng nhưng vibraphone vẫn run run, rồi bass + pad nối sang "Oops! Sorry!" (trước đó im hẳn 1,5 s).
- **Chuyển cảnh mới:** marimba chạy lên ở cú "chụp" sticker; đàn hạc vuốt lên theo cú lia máy; kick + chũm chọe ở cú dán.
- **Nền đêm:** gió trầm dâng hạ chậm, dàn dế xa từng tràng ngắn nhiều hướng, vài tiếng ếch mềm ở chỗ không có lời. Nền cũng nhường giọng.
- **Cường độ theo cảnh:** 0,85 · 0,95 · 0,8 · 0,85 · 0,72 · 0,85 · 0,9 (chụp) · 0,82 (dán) · 0,9 · 0,72 · 0,85 · 0,55 (lắng nghe) · 0,9 (vòng lặp).
- **Bản cuối:** −13,9 LUFS, đỉnh thật −1,5 dBTP; giọng so với nhạc + tiếng động thấp nhất 11,5 dB.

## Lượt nhạc nền sinh động (11/2026) · bản hiện hành

Theo `Task.md`: *"Cần thêm nhiều nhạc nền sinh động, trong 1 short nhạc nền đang không có sự thay đổi."* Hình, lời, tiếng động và các điểm nhấn nhạc viết tay (mô-típ bí mật, stinger, khựng, nhạc hiệu, nối vòng lặp) giữ nguyên. Lớp đệm đứng yên được thay bằng **lớp nhịp theo cảnh** ([`_shared/audio/groove.py`](../../_shared/audio/groove.py)):
- **Mỗi cảnh một điệu.** Mỗi cảnh có điệu, vòng hoà âm, bộ nhạc cụ, bộ trống và mức năng lượng riêng. Hai cảnh kề nhau khác nhau ở ít nhất hai trong năm thứ đó.
- **Dưới lời nhạc vẫn chạy.** Dưới lời còn bass, kick, hat/shaker và tiếng đệm ngắn ở dải cao. Dưới giọng trầm của Albie thì bỏ bass.
- **Nhạc đáp lời.** Khoảng không lời giữa hai câu có một câu đáp ngắn của nhạc cụ hát chính.
- **Đổi cảnh có dấu.** Trước cảnh mạnh hơn có trống dồn, trước cảnh nhẹ hơn có chuỗi nốt đi xuống. Phách đầu cảnh mới có kick và chũm chọe mềm.

**Bản trước:** v3 (`out/short-003-v3.mp4`, `out/mix-v3.py`, `out/MUSIC-v3.md`, `out/stem_mus-v3.wav`).

**Vì sao nghe như không đổi.** Swing Night Band từ đầu đến cuối: cùng contrabass đi bộ, búng tay, hat và phím điện. Chỉ nhịp "ồ" bỏ trống. Phần lớn thời gian lớp swing chạy ở mức 0,5–0,7, nên tai nghe một nền đều.

**Bản mới.** Mười một cảnh nhạc, bảy điệu:
- **Đầu phim:** nhịp tim hồi hộp (kick "thình-thịch", pizzicato) lúc lắng nghe, swing đầy khi kéo xa.
- **Trong kính:** đàn hạc rải khi cái tai sáng lên, nhịp trống tom khi mặt tai rung.
- **"Hello, little ears!":** nửa nhịp đung đưa.
- **Sổ:** shuffle ukulele dưới câu của Albie.
- **Cuối phim:** rón rén trước "NOPE!", nửa nhịp "aww", swing đầy khi chữ móc trở lại.

### Bảng cảnh nhạc

Sinh từ `out/music.json`. Cột *Nguồn*: "lớp nhịp" là phần `groove.py` dựng; "viết tay" là đoạn có sẵn trong `mix.py` (điểm nhấn, tổ khúc, nhạc hiệu). Các điểm nhấn viết tay ở bảng Timeline phía trên vẫn nằm trên lớp nhịp.

| Thời gian | Cảnh nhạc | Điệu | Hoà âm | Nhạc cụ | Trống | Năng lượng | Nguồn |
|---|---|---|---|---|---|---|---|
| 0–2,45 | móc · hồi hộp | nhịp tim hồi hộp | Dm | contrabass, pizzicato | kick, hat | nhẹ | lớp nhịp |
| 2,45–4,5 | kéo xa · swing đầy | swing | Dm · B♭ | contrabass, phím điện, vibraphone | kick, búng tay, hat | đầy | lớp nhịp |
| 4,5–7,3 | soi · khám phá | rải lơ lửng | F · Dm | contrabass, đàn hạc, vibraphone | hat | vừa | lớp nhịp |
| 7,3–9,6 | mặt trống | pop nảy | Dm · F | contrabass, ukulele, xylophone | kick, trống tom, shaker | vừa | lớp nhịp |
| 9,6–12,1 | ồ · đáng yêu | nửa nhịp đung đưa | B♭ · F | contrabass, vibraphone, hộp nhạc | kick, chổi trống, hat | nhẹ | lớp nhịp |
| 12,1–12,9 | chụp sticker | khựng / điểm nhấn viết tay | — | — | — | — | viết tay |
| 12,9–15,4 | sổ · shuffle vui | shuffle nhún nhảy | F · B♭ | contrabass, ukulele, vibraphone | kick, búng tay, hat | vừa | lớp nhịp |
| 15,4–17,7 | rón rén | rón rén | Dm · Gm | pizzicato trầm, pizzicato | mõ gỗ, shaker | nhẹ | lớp nhịp |
| 17,7–19,3 | NOPE! · khựng | khựng / điểm nhấn viết tay | — | — | — | — | viết tay |
| 19,3–22,2 | aww · câu hỏi | nửa nhịp đung đưa | Dm · B♭ | contrabass, phím điện, vibraphone | kick, chổi trống, hat | vừa | lớp nhịp |
| 22,2–24 | chữ móc trở lại | swing | Dm | contrabass, phím điện, vibraphone | kick, búng tay, hat | đầy | lớp nhịp |

### Số đo trước / sau

| | Bản trước | Bản mới |
|---|---|---|
| Số điệu trong phim | 1 (swing) + nửa nhịp | 7, 11 cảnh nhạc |
| Đoạn dài nhất cùng một kiểu | ≈ 7 s (swing 0,5–7,3 s) | 2,9 s |
| Nốt nhạc mỗi giây (trung vị) dưới lời / khoảng trống | 10 / 8 | 14 / 22 |
| Câu đáp giữa các câu thoại | — | 8 (3 tự động, 5 viết tay) |
| Lời rõ hơn nhạc + tiếng động, câu thấp nhất | 13,5 dB ("Let's zoom in!") | 15,9 dB ("Its ears are on its front legs!") |

Nốt mỗi giây được đếm từ các lệnh đặt nốt của `mix.py`; một hợp âm tính mỗi nốt một lần. Độ rõ lời đo theo `qa.py` (dải 300–4000 Hz, trung vị theo câu), trên cùng một stem giọng và tiếng động.

**`_shared/qa.py`: 33/33 đạt**, không còn cảnh báo. Độ to −13,9 LUFS, đỉnh thật −2,2 dBTP (`T.master(mix, 11.6)`).
