# SHORT-003 · Soundtrack Timeline

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
