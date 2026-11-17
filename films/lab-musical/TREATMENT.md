# LAB · Musical Storytelling · "Grasshoppers Play Their Legs Like a Violin!" dựng lại theo chuẩn 11/2026b — Treatment

> **Bản thử quy trình, không đăng.** Dựng lại SHORT-015 (bản B) theo [`Task.md`](../../Task.md) ngày 17/11/2026 để chạy thử toàn bộ quy trình mới: [`_shared/song.js`](../../_shared/song.js), [`sing.py`](../../_shared/sing.py), [`asr_sung.py`](../../_shared/tools/asr_sung.py), `groove.py` (song mode), `subtitleEm` / `hookStack`, [`qa_musical.py`](../../_shared/qa_musical.py). SHORT-015 gốc giữ nguyên.
> Theo khung [`_shared/TREATMENT-TEMPLATE.md`](../../_shared/TREATMENT-TEMPLATE.md). Dữ kiện: [FACTS.md](FACTS.md) (của SHORT-015). Âm thanh sinh tự động: [SOUND-PLAN.md](SOUND-PLAN.md).

**Loại:** bản B, 24 s (12 ô nhịp ở 120 BPM), phát vòng lặp · **Nhân vật:** Miss Loupe (người duy nhất có lời, hát và nói), Hop (không lời) · **Made for Kids:** không kêu gọi bình luận, đăng ký.

## 1. Đánh giá ý tưởng

- **Bí mật khoa học:** Hop "hát" bằng cách cọ một hàng gai nhỏ trên chân sau vào mép cánh; mỗi gai một tiếng tách, kéo nhanh thì thành bài hát. Lời chỉ nói về Hop (nguồn: "those species that make easily heard noises usually…", FACTS §1–2).
- **Vì sao trẻ tò mò:** câu hỏi về chính cơ thể trẻ (*"Could you sing with your legs?"*); câu trả lời thấy được và nghe được (gai → tiếng).
- **Khoảnh khắc wow:** kính lao sâu vào hàng gai, mỗi gai vấp qua mép cánh là một tiếng tách và một nốt nhạc; điệp khúc đầu tiên vang đúng lúc đó.
- **Điểm mới so với SHORT-015** (Task.md: "cảnh quay kéo dài, giải thích tĩnh, chữ móc cao, phụ đề dài, CTA chưa cụ thể"):

  | SHORT-015 | Bản lab |
  |---|---|
  | Chữ móc ở y 155–561 (cao) | `hookStack('mid')`: y khoảng 490–910, sân khấu hạ 95 px để nhân vật đứng dưới chữ |
  | Cận cảnh đứng ở độ phóng 7× trong 6,2 s | Lia dọc hàng gai (8,05 s), đẩy vào đỉnh gờ lúc hát (10,75 s); kính trượt dọc đùi (5,45 s) |
  | Lời nói thường | 70 % số từ được hát (sing-talk, half-sing, sing), điệp khúc *"Pegs on the leg, scrape on the wing!"* hai lần |
  | Phụ đề tới 10 từ, gộp hai câu | Mỗi tấm ≤ 7 từ, một câu, chữ hiện theo lúc hát, từ khoá tô màu |
  | `scrape` ×26 không phân biệt | Mỗi chuỗi kéo chân ghi `run` (có chủ đích, theo phách) |
  | Gag rồi câu hỏi | Gag → điệp khúc lần 2 (Hop kéo theo từng phách) → CTA |

- **Ba cấu trúc đã cân nhắc:**

  | | Cấu trúc | Ưu | Nhược |
  |---|---|---|---|
  | A | Giữ nguyên 015, chỉ hát vài câu | Ít việc | Không có điệp khúc lặp lại, không đạt 60–80 % |
  | B | Cả phim là một bài hát | Rất "musical" | Kiến thức bị lu mờ (Task.md: không biến video thành bài hát dài); câu gag mất duyên |
  | C | **Hát phần khám phá và giải thích, nói ở câu cửa miệng / gag / CTA; điệp khúc lần 1 ở khoảnh khắc wow, lần 2 trước CTA** | Đúng 60–80 %, tương phản rõ, trẻ nghe điệp khúc hai lần | Phải kéo phim từ 22 lên 24 s để có chỗ cho lần 2 |

  **Chọn C.**
- **Rủi ro:** giọng hát PSOLA nghe "robot" ở nốt ngân dài → ngân ≤ 3×, câu hát dùng tốc độ TTS chuẩn; Whisper nghe sai lời hát → `asr_sung.py` trên hai model.

## 2. Hook tối ưu (0–3 s)

| Nhịp | Hình | Lời / chữ | Tiếng |
|---|---|---|---|
| 0–1 s | Hop kéo đùi "zzip!", nốt bật ra; Miss Loupe giật mình nảy lên; máy đẩy vào | Chữ SINGING / LEGS?! đủ ở khung 0, giữa phía trên, nảy từng dòng | Tango 120 BPM từ giây 0, `titlepop`, `wordpop`, "zzip" |
| 1–2 s | Miss Loupe ngó chân mình, nhấc giày ngọ nguậy (gài đạo cụ gag) | ♪ *"Could you sing with your legs?"* (half-sing, đi lên, kết ở Rê giáng cao) | ngọ nguậy giày |
| 2–3 s | Hop kéo một tràng, Miss Loupe nghiêng đầu "?" | (chưa có lời giải) | "zzip-zzip-zzip", "hử?" |

Không phụ đề tới 3,25 s (chữ móc thay cho phụ đề của câu móc).

## 3. Kịch bản hoàn chỉnh (6 nhịp)

| Nhịp | Thời gian | Chuyện xảy ra | Lời |
|---|---|---|---|
| Hook | 0–2,9 s | như mục 2 | ♪ L01 *Could you sing with your legs?* |
| Setup | 2,9–6,6 s | Miss Loupe nhảy sang Hop, kính lớn bật lên trên chân sau, kính trượt dọc đùi | L02 *Let's zoom in!* (nói) · ♪ L03 *Watch Hop's back leg!* |
| Discovery | 6,6–13,7 s | Lao sâu vào hàng gai, lia dọc hàng gai; đùi chạm mép cánh, mỗi gai một tiếng tách; điệp khúc lần 1; "zzzzip!" | ♪ L04 *Look! A row of tiny pegs!* · ♪ L05 *Pegs on the leg, scrape on the wing!* |
| Surprise | 13,7–19,9 s | Vĩ cầm hiện bên kính; Miss Loupe thử cọ chân… "squeak." bé tí, Hop bật cười | ♪ L06 *It's like a violin bow!* · L07 *Let me try!* · L08 *Oops! No pegs!* (nói) |
| Payoff | 19,9–22,1 s | Điệp khúc lần 2: Miss Loupe nhún nhảy, Hop kéo "vĩ cầm" theo từng phách | ♪ L10 *Pegs on the leg, scrape on the wing!* |
| CTA | 22,1–24 s | Miss Loupe nhìn người xem, chữ móc trở lại, về khung 0 | L09 *Can YOU make music with your legs?* (nói) |

**Thông điệp:** nhìn thật gần thì thấy bí mật: Hop có gai nên hát được, ta không có gai nên chỉ ra "squeak".

## 4. Storyboard chi tiết theo timeline

Khớp `SHOTS` trong [`timeline.js`](timeline.js) (15 cú, khoảng dài nhất ≤ 2,4 s). Storyboard 10 khung: `BOARD`.

| # | Thời gian | Khung hình | Máy quay | Chuyện xảy ra | Vì sao |
|---|---|---|---|---|---|
| 1 | 0–1,15 | trung, sân khấu | đẩy vào, rung ở "zzip" | Hop kéo, Miss Loupe giật mình, chữ móc | hành động ở khung 0 |
| 2 | 1,15–2,2 | trung | đẩy nhẹ vào Miss Loupe | ngó chân, nhấc giày | gài đạo cụ gag |
| 3 | 2,2–3,6 | trung | lia theo cú nhảy | tràng "zzip", "?", nhảy sang Hop | bí ẩn, câu cửa miệng có hành động |
| 4 | 3,6–5,45 | kính lớn r 340 | kính bật lên, trôi | đùi kéo dọc mép cánh | bắt đầu khám phá |
| 5 | 5,45–6,6 | kính lớn | kính trượt dọc đùi, to lên r 370 | | kính không đứng quá 3 s |
| 6 | 6,6–8,05 | cận toàn mặt kính | lao sâu (vòng sáng) | hàng gai sáng lần lượt | wow |
| 7 | 8,05–9,38 | cận cảnh | lia dọc hàng gai, đẩy 10 % | | đếm gai bằng mắt khi hát |
| 8 | 9,38–10,75 | cận cảnh | về khung, rung theo tiếng tách | đùi chạm mép cánh, tách đi lên | bí mật xảy ra |
| 9 | 10,75–12,62 | cận cảnh | đẩy vào đỉnh gờ 1,34× | tách đi xuống, điệp khúc lần 1 | thấy gai cào mép cánh đúng lúc hát |
| 10 | 12,62–15,5 | cận → kính lùi | rung mạnh, kính lùi sang trái | "zzzzip", nốt tuôn ra; vĩ cầm | cao trào, ẩn dụ nói rõ bằng hình |
| 11 | 15,5–16,6 | trung | kính hạ, về sân khấu | "Let me try!" | mở gag |
| 12 | 16,6–17,9 | trung gần | đẩy vào Miss Loupe (z 1,62) | đứng một chân, cọ chân | gag |
| 13 | 17,9–19,9 | trung | khựng, rung nhẹ, mở ra hai nhân vật | "squeak.", Hop cười, "Oops! No pegs!" | bất ngờ hài |
| 14 | 19,9–22,1 | hai nhân vật gần (z 1,48) | đẩy vào | điệp khúc lần 2, cùng biểu diễn | trẻ hát theo |
| 15 | 22,1–24 | trung → khung 0 | về bố cục khung đầu | CTA, chữ móc trở lại | vòng lặp |

## 5. Chuyển động và góc quay

- Máy: `hookCam` (hạ sân khấu 95 px trong móc), `lensCam` (trôi chậm), `macroCam` trong cận cảnh (lia `x`, đẩy `z` quanh đỉnh gờ), `gagCam` (đẩy vào gag, đẩy vào điệp khúc lần 2, về khung 0). Kính truyền `mag`, `pan` cho `loupe()` để `qa_musical.py` đo được thay đổi trong kính.
- Biểu cảm Miss Loupe theo kiểu hát: hát trọn → `excited`, nửa hát → `happy`, sing-talk / nói → `explaining`; điệp khúc lần 2: nhún theo phách, hai tay vung, `laugh` ở phách mạnh. Hop: nhắm mắt cười ở mỗi lượt kéo theo phách.
- Mặt luôn vui (`LOOK.cheer = true`), nhân vật v2.

## 6. Text và phụ đề

- Chữ trên hình: SINGING / LEGS?! (móc, trở lại lúc 22,95 s), "squeak." (gag).
- Phụ đề: `cardsOf(LINES, DUR, { max: 7, hide: [0, 3.25] })`: 11 tấm 2–7 từ, mỗi tấm một câu, chữ hiện theo lúc hát / nói; từ nhấn (`em`): zoom, leg, pegs, wing, violin, bow, try, you, legs. Từ khoá của bí mật: pegs, leg, wing.

## 7. Voiceover (và Sing-along Dialogue)

Miss Loupe `af_heart` (`home` 56 = La giáng 3). 70 % số từ hát, 30 % nói.

| Câu | Lời | Kiểu | Giai điệu (bậc:phách, Rê giáng trưởng) | Ghi chú |
|---|---|---|---|---|
| L01 | Could you sing with your legs? | half-sing | `5:.5 5:.5 3:.5 5:.5 6:.5 1':1` | câu hỏi tò mò: đi lên, kết cao |
| L02 | Let's zoom in! | nói | | câu cửa miệng, tốc độ chuẩn |
| L03 | Watch Hop's back leg! | sing-talk | `5:.5 5:.5 6:.5 5:1` | chỉ dẫn, rõ từ |
| L04 | Look! A row of tiny pegs! | half-sing | `5:.5 3:.5 3:.5 5:.5 6:.5 5:.5 6:1` | khám phá: nhẹ, có nhịp |
| L05, L10 | Pegs on the leg, scrape on the wing! | sing · điệp khúc `pegs` | `3:.5 3:.25 5:.25 6:1 5:.5 3:.25 5:.25 1':.75` | phách đà, LEG ở phách 1, WING ở phách 3 |
| L06 | It's like a violin bow! | half-sing (`lyr: vi-o-lin`) | `5:.5 5:.5 5:.5 6:.5 5:.5 3:.5 5:.5` | ẩn dụ, nói rõ bằng hình |
| L07 | Let me try! | nói | | mở gag |
| L08 | Oops! No pegs! | nói | | gag nối về bí mật |
| L09 | Can YOU make music with your legs? | nói (CTA) | | câu hỏi trẻ trả lời to |

## 8. SFX và nhạc nền

- Nhạc: bài "Leg-Violin Tango" có lời (mục A); mỗi cảnh một phong cách (tango, nảy lệch phách, phiêu lưu nhẹ, pop nảy có vỗ tay cho điệp khúc, ragtime hài, khựng, polka, ukulele nắng).
- Tiếng động: "zzip" kéo chân (chuỗi `hook`, `lens`, `lens2`, `reprise`, theo phách), tách từng gai (chuỗi `ticks`), whoosh lao sâu / trượt kính / lia, lấp lánh khi vào điệp khúc (`chorus`), "squeak", Hop cười. Bảng đầy đủ: `SOUND-PLAN.md` mục Sound Effects Timeline.

## 9. CTA

*"Can YOU make music with your legs?"* (22,1 s, 1,74 s, câu hỏi, có từ khoá "legs"): trẻ trả lời to ("No!") hoặc thử cọ chân rồi cười. Không comment / subscribe.

## 10. Checklist trước khi xuất bản

Bản lab không xuất bản; checklist dùng để thử quy trình: xem mục Báo cáo.

## A. Music Direction

- **Phong cách:** Cartoon Musical + Playful Kids Pop: tango hoạt hình cho "vĩ cầm chân", điệp khúc pop nảy có vỗ tay để hát theo.
- **Giọng:** Rê giáng trưởng. **Bài hát** (`SONG`): A 0 s 120 BPM `Db Ab7` · C 3,6 s 108 BPM `Gb Db` · D 9,38 s 126 BPM `Db Gb Ab7 Db` · E 12,62 s 132 BPM `Db Gb Ab Db` · F 18,6 s 126 BPM `Db Gb Ab7 Db`.
- **Motif:** câu mở điệp khúc `3:.5 3:.25 5:.25 6:1` ("Pegs on the LEG"): hát hai lần, dàn dây chơi lại lúc "zzzzip!".
- **Nhạc cụ chính:** accordion, piano, dây pizzicato, celesta, ukulele, xylophone, dàn dây spiccato, trombone, clarinet, sáo; vỗ tay, chổi tango, timpani.
- **Cảm xúc:** tò mò (mở) → kỳ diệu (khám phá) → hát theo vui (điệp khúc) → phấn khích (cao trào) → buồn cười (gag) → vui, mời gọi (kết).

## B. Music Timeline · C. Sing-along Dialogue · D. AI Music Generation Prompts · E. Sound Effects Timeline

Sinh tự động trong [SOUND-PLAN.md](SOUND-PLAN.md) (từ `out/music.json`, `timeline.json`, `events.json`).

## F. Final Audio Checklist

Chờ chủ kênh nghe: nhạc sinh động? đổi theo cảnh? lời có giai điệu? có đoạn dễ nhớ? giọng hát rõ? nhạc không lấn giọng? SFX khớp hành động? giữ chân người xem?

## Ghi chú sản xuất

- **Thời gian:** phim 22 → 24 s; các mốc từ CTA trở đi dời 2,05 s (giữ đúng khoảng cách tới cuối phim như 015); L08 dời từ 18,55 lên 18,4 s để có chỗ cho điệp khúc lần 2.
- **Bài hát:** lần đầu viết điệp khúc cho LEG rơi vào phách 4 (`song.js` không báo vì đúng nốt của hợp âm, nhưng nghe lệch nhấn) → đổi thành phách đà 1 phách, LEG ở phách 1; nốt WING rút còn 3/4 phách để điệp khúc kết thúc trước "zzzzip!" (12,62 s). `song.js` bắt được câu móc bản đầu có nốt Si giáng ở phách mạnh trên hợp âm Rê giáng.
- **Giọng hát:** câu hát dùng tốc độ TTS chuẩn (0,9): đọc chậm (0,765) làm cụm "scr" dài, đè âm tiết trước. Kết quả `sing.py`: lock 0,79–1,00; `asr_sung.py`: WER 0 trên `small.en` và `base.en`.
- **Hình:** chữ móc `hookStack('mid')` lần đầu đè mặt kính của Miss Loupe → hạ sân khấu 95 px trong móc (`hookCam`), trở về khi kính bật lên; khung cuối nối khung đầu.

## Báo cáo

**Dựng ngày 17/11/2026** (`sh films/lab-musical/build.sh` chạy trọn, rồi trộn lại sau khi hạ nhạc dưới câu nói): **67 đạt · 4 cảnh báo · 0 chưa đạt**.
- Giọng hát (`sing.py`): lock 0,79–1,00; Hz trung vị 202–210 (home của Miss Loupe 208 Hz). Lời hát (`asr_sung.py`): WER 0 trên `small.en` và `base.en`.
- Readcheck: 3/3 chữ đủ thời gian đọc. −14 LUFS (mux), 24,0 s, 1080×1920, 30 fps.

**Cảnh báo còn lại và lý do:**
- *Nhạc lùi dưới giọng (duck)*, dưới câu nói 7,9 dB (ngưỡng 8, đang hiệu chỉnh): bốn câu còn nói (câu cửa miệng, "Let me try!", "Oops! No pegs!", CTA) đứng cạnh chỗ khựng nhạc và đoạn kết vốn nhỏ, nên chênh lệch với khoảng trống kề bên thấp; các tập cũ đo được 14–16 dB vì câu giải thích (nay được hát) nằm giữa nhạc dày. Dưới câu hát 11,6 dB, trong khoảng 6–14 dB.
- *Tiếng động đa dạng*: các chuỗi có chủ đích chiếm 59 % số cue (ngưỡng 40 %). Chủ đề của tập là Hop kéo chân thành nhạc: mỗi lượt kéo theo phách là một tiếng "zzip" (chuỗi `hook`, `lens`, `lens2`, `reprise`), mỗi gai một tiếng tách (`ticks`); mỗi chuỗi ≤ 16 cue và ≤ 4 s.
- *Điệu riêng của tập* và *Không trùng cảnh nhạc của Short khác*: bản lab dựng lại chính SHORT-015 nên giữ điệu tango và nhiều cảnh nhạc của 015. Một Short mới theo `template/` sẽ có điệu riêng của mình (thêm vào `SIGNATURE`).

### Bảng `qa.py` (`out/qa.json`)

| Nhóm | Mục | Kết quả | Giá trị |
|---|---|---|---|
| 1 Hook | Lời đầu tiên | ĐẠT | 0.38 s |
| 1 Hook | Chuyển động trong giây đầu | ĐẠT | 6.52 |
| 1 Hook | Chuyển động 1–2,5 s | ĐẠT | 2.61 |
| 1 Hook | Nhạc ngay từ giây 0 | ĐẠT | -16 dBFS (0–0,5 s) |
| 1 Hook | Tiếng động ở khung đầu | ĐẠT | 7 tiếng ≤ 0,3 s |
| 1 Hook | Mật độ tiếng động 0–3 s | ĐẠT | 21 |
| 1 Hook | Cảnh tựa / logo | ĐẠT | không có |
| 2 Giữ chân | Đoạn hình đứng yên ≥ 2,5 s | ĐẠT | không có |
| 2 Giữ chân | Khoảng "chết" (không lời, không tiếng động) ≥ 1,8 s | ĐẠT | không có |
| 2 Giữ chân | Độ dài trung bình mỗi cảnh | ĐẠT | 4.8 s (5 cảnh, 5 chuyển cảnh mạnh) |
| 2 Giữ chân | Tốc độ lời | ĐẠT | 1.88 từ/s (45 từ, không tính 1 lần lặp điệp khúc) |
| 2 Giữ chân | Đoạn không lời dài | ĐẠT | không có |
| 2 Giữ chân | Hình gần đứng yên kéo dài (kể cả khi có lời) | ĐẠT | không có |
| 4 Âm thanh | Độ to | ĐẠT | -14.0 LUFS |
| 4 Âm thanh | Đỉnh thật | ĐẠT | -2.6 dBTP |
| 4 Âm thanh | Lời rõ hơn nhạc + tiếng động | ĐẠT | thấp nhất 14.6 dB (L05) |
| 4 Âm thanh | Mật độ tiếng động | ĐẠT | 31.7 cue / 10 s (76 cue) |
| 4 Âm thanh | Tiếng động không lạm dụng, không lấn lời | ĐẠT | dày nhất 5 cue / 1 s (sau 3 s); lời hơn tiếng động thấp nhất 20.1 dB (L04) |
| 4 Âm thanh | Độ chói (năng lượng > 6 kHz) | ĐẠT | 3.0 % |
| 4 Âm thanh | Tiếng tụt đột ngột | ĐẠT | 0 |
| 4 Âm thanh | Lỗ im của nhạc nền | ĐẠT | 0 giây dưới −45 dB |
| 4 Âm thanh | Âm lượng nhạc đổi theo cảnh | ĐẠT | 18 dB giữa giây to nhất và nhỏ nhất |
| 4 Âm thanh | Nhạc đổi theo cảnh: đoạn dài nhất cùng một kiểu | ĐẠT | 3.2 s (tách từng gai · điệp khúc, 9.4–12.6 s); 11 cảnh nhạc |
| 4 Âm thanh | Số điệu nhạc khác nhau | ĐẠT | 7: bounce, hop, polka, quest, stride, sunny, tango |
| 4 Âm thanh | Hai cảnh nhạc kề nhau khác rõ | ĐẠT | mọi cặp khác nhau ≥ 2 điểm |
| 4 Âm thanh | Câu đáp của nhạc giữa các câu thoại | ĐẠT | 5 câu đáp (1 tự động, 4 viết tay) |
| Sound Design Plan | Phong cách nhạc theo cảnh | ĐẠT | 6: Bouncy Rhythm, Epic Cartoon, Funny Comedy, Happy Kids, Magical Adventure, Playful Cartoon |
| Sound Design Plan | Nhạc cụ hát chính luân phiên | ĐẠT | 8 nhạc cụ; nhiều nhất xylo 3/10 cảnh |
| Sound Design Plan | Luân phiên họ nhạc cụ | ĐẠT | 11: bộ gõ, chuông, dàn dây, dây pizzicato, kèn gỗ, kèn đồng, nhạc cụ hoạt hình, piano, ukulele, xylophone, đàn hạc |
| Sound Design Plan | BPM đổi theo nội dung | ĐẠT | 6 mức: 108, 112, 116, 120, 126, 132 (chênh 24) |
| Sound Design Plan | Không lặp một bản nhạc | ĐẠT | điệu dùng nhiều nhất: tango 3/10 cảnh |
| Sound Design Plan | Mở đầu · diễn biến · cao trào · kết | ĐẠT | open 0.0–3.6 s, build 3.6–12.6 s, peak 12.6–15.5 s, end 15.5–24.0 s |
| Sound Design Plan | Chuyển cảnh âm thanh mềm, đa dạng | ĐẠT | 10 chỗ chuyển: tail ×3, fill ×2, pickup ×1, riser ×1, swell ×1, viết tay ×2 |
| Sound Design Plan | Bảng Sound Design Plan | ĐẠT | SOUND-PLAN.md 11/11 cảnh |
| Sound Design Plan | Điệu riêng của tập | CẢNH BÁO | chưa có điệu nào trong SIGNATURE · 0% thời lượng; mượn điệu riêng của: tango (short-015), tango (short-015), tango (short-015) |
| Sound Design Plan | Không trùng cảnh nhạc của Short khác | CẢNH BÁO | so với 15 Short; trùng công thức: móc · vĩ cầm chân = 015 móc · vĩ cầm chân, Hop kéo một tràng · "Let's zoom in!" = 015 Hop kéo một tràng · "Let's zoom in!", kí |
| Sound Design Plan | Nhạc vui nhộn (hồi hộp, giọng thứ) | ĐẠT | hồi hộp + khựng 0%, giọng thứ 0% thời lượng |
| Sound Design Plan | Nhạc vui tươi | ĐẠT | mọi cảnh |
| 4 Âm thanh | Nhạc có nhịp liền | ĐẠT | 100% số giây có ≥ 3 nốt (trung vị 8 nốt/s) |
| 5 Hình ảnh | Khung trống / đen | ĐẠT | 0 khung |
| 5 Hình ảnh | Khung hình và tốc độ | ĐẠT | 1080×1920, 30 fps |
| 5 Hình ảnh | Vùng giao diện Shorts | ĐẠT | không chạm |
| 5 Hình ảnh | Phụ đề che mặt nhân vật | ĐẠT | không có |
| 3 Nội dung | Người nói có trên hình | ĐẠT | mọi câu sau 3 s |
| 5 Hình ảnh | Mặt nhân vật vui tươi | ĐẠT | mọi khung |
| 5 Hình ảnh | Chớp sáng mạnh | ĐẠT | tối đa 0 lần/giây |
| 5 Hình ảnh | Độ rực màu | ĐẠT | 0.63 |
| 6 Xem lại | Khung cuối nối khung đầu | ĐẠT | chênh 5.4/255 |
| 6 Xem lại | Câu hỏi kết cho trẻ | ĐẠT | "Can YOU make music with your legs?" ở 22.1 s |
| 6 Xem lại | Cảnh cuối gợi lại câu móc | ĐẠT | có (chữ móc trở lại) |
| 6 Xem lại | Vòng lặp của bản B | ĐẠT | có |
| 7 Giọng | Cao độ từng nhân vật | ĐẠT | loupe 209 Hz |
| 8a Chuẩn mới · Hình | Độ dài | ĐẠT | 24.0 s (bản B) |
| 8a Chuẩn mới · Hình | 6 nhịp kể chuyện | ĐẠT | hook 0.0–2.9 · setup 2.9–6.6 · discovery 6.6–13.7 · surprise 13.7–19.9 · payoff 19.9–22.1 · cta 22.1–24.0 |
| 8a Chuẩn mới · Hình | Danh sách cú máy (SHOTS) | ĐẠT | 15 cú, khoảng dài nhất 2.9 s (từ 12.6 s) |
| 8a Chuẩn mới · Hình | Nhịp đổi hình đo được | ĐẠT | khoảng dài nhất 1.3 s (từ 14.3 s); 14/15 cú trong SHOTS đo thấy |
| 8a Chuẩn mới · Hình | Đoạn giải thích không đứng hình | ĐẠT | không có |
| 8a Chuẩn mới · Hình | Vị trí chữ móc | ĐẠT | y 479–920 (tâm 700), x tâm 536 |
| 8b Chuẩn mới · Chữ và lời | Số từ mỗi tấm phụ đề | ĐẠT | 3–7 từ (trung vị 4), 11 tấm |
| 8b Chuẩn mới · Chữ và lời | Từ khoá được nhấn | ĐẠT | 11/11 tấm có từ nhấn; từ khoá của bí mật: pegs, leg, wing |
| 8b Chuẩn mới · Chữ và lời | Không lặp chữ thừa | ĐẠT | không có |
| 8b Chuẩn mới · Chữ và lời | CTA cụ thể | ĐẠT | "Can YOU make music with your legs?" ở 22.1 s, 1.74 s |
| 8c Chuẩn mới · Bài hát | Lời có nhịp hoặc giai điệu | ĐẠT | 70% số từ (37/53); hát trọn 30%; speak ×4, half-sing ×3, sing ×2, sing-talk ×1 |
| 8c Chuẩn mới · Bài hát | Thật sự hát (bám nốt) | ĐẠT | L01 1.00, L03 0.87, L04 1.00, L05 0.79, L06 0.89, L10 0.81 |
| 8c Chuẩn mới · Bài hát | Giọng hát giữ chất giọng nhân vật | ĐẠT | mọi câu hát quanh home ± 2,5 nửa cung |
| 8c Chuẩn mới · Bài hát | Lời hát nghe rõ (Whisper) | ĐẠT | L01 0.00, L03 0.00, L04 0.00, L05 0.00, L06 0.00, L10 0.00 |
| 8c Chuẩn mới · Bài hát | Điệp khúc hát theo được | ĐẠT | 'pegs' ×2 ở 10.7, 19.9 s: "Pegs on the leg, scrape on the wing!" |
| 8c Chuẩn mới · Bài hát | Giai điệu đặc trưng (motif) | ĐẠT | 4 nốt, đặt 3 lần (12.7 s strings, 10.7 s giọng hát L05, 19.9 s giọng hát L10) |
| 8d Chuẩn mới · Âm thanh | Nhạc lùi dưới giọng (duck) | CẢNH BÁO | dưới câu nói 7.9 dB; dưới câu hát 11.6 dB |
| 8d Chuẩn mới · Âm thanh | Tiếng động đa dạng, không lặp máy móc | CẢNH BÁO | chuỗi chiếm 59% số cue |
| 8b Chuẩn mới · Chữ và lời | TREATMENT.md đủ các mục | ĐẠT | đủ 10 mục + Music Direction A–F |

### Checklist thủ công

- [x] 0–1 s gây chú ý (Hop kéo "zzip!", chữ móc nảy) · 1–2 s phản ứng (Miss Loupe ngó chân) · 2–3 s bí ẩn ("?").
- [x] Mỗi 2–4 s có thay đổi có mục đích (`SHOTS` 15 cú; đo được: khoảng dài nhất 1,3 s).
- [x] Gag và bất ngờ: "squeak." bé tí, Hop bật cười; nhân vật đúng tính cách.
- [x] Nội dung đúng `FACTS.md`; lời hát chỉ nói về Hop; hợp 4–8 tuổi.
- [x] Chữ móc giữa phía trên, đọc được ngay; phụ đề ≤ 7 từ, từ khoá tô màu; vùng an toàn Shorts không chạm.
- [x] CTA cụ thể, không comment / subscribe (Made for Kids).
- [ ] **Chủ kênh nghe và xem** (chốt duyệt 2): giọng hát có nghe như Miss Loupe không, điệp khúc có dễ hát theo không, nhạc có lấn giọng không (Final Audio Checklist, mục F). Mình không tự nghe được.
