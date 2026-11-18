# <TẬP> · <Tựa tiếng Anh> — Treatment (chuẩn 11/2026b)

> Khung treatment cho mọi Short (từ SHORT-016) và video dài (từ LONG-002) của *Big Secrets of Tiny Bugs*. Chép file này thành `films/<tập>/TREATMENT.md` và điền từng mục.
> Đủ **10 đầu ra** của [`Task.md`](../Task.md) phần 1 mục 6 và **Music Direction A–F** của phần 2 mục 8. Quy tắc và ngưỡng: [`QUALITY.md`](QUALITY.md) §1–§8. Mã của tập chép từ [`template/`](template/).
> Phần ghi *(sinh tự động)* do `_shared/tools/soundplan.py` viết vào `SOUND-PLAN.md` sau khi dựng; ở treatment chỉ cần bản phác.
> Khi chủ kênh **giao nội dung một Short mới**, trả về đúng các mục dưới đây (bản phác trước khi dựng), rồi dựng theo `template/`.

**Tựa đăng YouTube:** *… | Big Secrets of Tiny Bugs* · **Loại:** tập A (≤ 48 s) / bản B (15–25 s) / video dài · **Ngày đăng:** …
**Căn cứ:** đề cương ([`DE-CUONG-CAC-BO.md`](../DE-CUONG-CAC-BO.md)), dữ kiện và nguồn [`FACTS.md`](FACTS.md), các tập trước cần tránh trùng.
**Made for Kids:** không kêu gọi bình luận, đăng ký, like, share trong phim.

## 1. Đánh giá ý tưởng

- **Bí mật khoa học** (một câu, đúng phạm vi nguồn): …
- **Vì sao trẻ 4–8 tuổi tò mò:** …
- **Khoảnh khắc wow** (bí mật xảy ra thành chuyển động gì, to cỡ nào): …
- **Không trùng** các tập trước (côn trùng, bối cảnh, gag, nhạc): …
- **Ba cấu trúc đã cân nhắc** (bảng: cấu trúc · ưu · nhược) và **lựa chọn**, kèm lý do.
- **Rủi ro** (khung tối, cảnh khó đọc ở cỡ điện thoại, lời khó hát…) và cách xử lý.

## 2. Hook tối ưu (0–3 s)

| Nhịp | Hình | Lời / chữ | Tiếng |
|---|---|---|---|
| 0–1 s gây chú ý | hành động hoặc bất ngờ ở khung 0 | chữ móc 2–4 từ, to, **giữa phía trên** (`hookStack('mid')`) | nhạc từ giây 0, pop / whoosh / boing |
| 1–2 s nhân vật phản ứng | phản ứng bằng hành động (giật mình, nhảy, va chạm) | câu móc (câu hỏi bất ngờ, tình huống hài, sự thật thú vị), **half-sing** giai điệu cao | … |
| 2–3 s bí ẩn chưa giải | … | … | … |

Không mở bằng giới thiệu dài; mặt nhân vật đứng dưới chữ móc (y 1000–1350), không phụ đề khi chữ móc trên hình.

## 3. Kịch bản hoàn chỉnh (6 nhịp)

| Nhịp | Thời gian | Chuyện xảy ra | Lời (ai nói / hát) |
|---|---|---|---|
| Hook | 0–3 s | … | … |
| Setup | … | giới thiệu nhân vật và vấn đề | … |
| Discovery | … | khám phá kiến thức, kể bằng hình và hành động | … |
| Surprise | … | bất ngờ hoặc gag (đạo cụ đã gài trước) | … |
| Payoff | … | giải thích / giải quyết, điệp khúc nhắc lại | … |
| CTA | 4 s cuối | lời kêu gọi cụ thể | … |

Khai báo đúng các mốc này trong `BEATS` của `timeline.js`. Thông điệp: …

## 4. Storyboard chi tiết theo timeline

Mỗi 2–4 s một thay đổi đáng chú ý có mục đích (góc máy, zoom, lia, cận cảnh, biểu cảm, hành động, thông tin). Khớp với `SHOTS` trong `timeline.js`.

| # | Thời gian | Khung hình | Máy quay | Chuyện xảy ra | Vì sao (mục đích) |
|---|---|---|---|---|---|
| 1 | 0:00–… | … | … | … | … |

**Không làm** (lỗi đã gặp ở SHORT-010…015): cận cảnh đứng một khung 6,2 s (015); chia đôi khung không đổi 9 s (011); một bố cục kính 18,6 s (013); đoạn giải thích chỉ có lời trên một khung.

## 5. Chuyển động và góc quay

- Máy quay từng cảnh (đẩy, lùi, lia, rung ở điểm nhấn; cảnh dài có máy trôi); kính: cỡ, vị trí, độ phóng, lia trong kính (`loupe(…, { mag, pan })` để qa đo được).
- Nhân vật: dáng, biểu cảm (luôn vui: `LOOK.cheer`), biểu cảm đổi theo kiểu hát (hát trọn: phấn khích; nửa hát: vui; sing-talk: giảng giải).
- Chuyển cảnh theo ngữ pháp kênh, mỗi chuyển cảnh một tiếng riêng.

## 6. Text và phụ đề

- Chữ trên hình (chữ móc, chữ gag): …
- Phụ đề: ≤ 7 từ mỗi tấm (`cardsOf`), mỗi tấm một câu, chữ hiện theo lúc hát / nói; **từ nhấn** (`em`) bằng màu và cỡ; từ khoá của bí mật (`SECRET.kw`): …
- Vùng an toàn Shorts: phụ đề ở `SAFE.subY`, chữ và mặt ngoài vùng che.

## 7. Voiceover (và Sing-along Dialogue)

Giữ giọng của từng nhân vật ([`voices.js`](voices.js)). 60–80 % số từ có nhịp hoặc giai điệu, 20–40 % nói tự nhiên.

| Câu | Ai | Lời | Kiểu (nói / sing-talk / half-sing / sing) | Giai điệu (`sing.notes`, bậc:phách) | Điệp khúc | Nhấn | Ghi chú |
|---|---|---|---|---|---|---|---|
| L01 | … | … | half-sing | `5:.5 5:.5 3:.5 …` | | … | câu hỏi: giai điệu cao, vui |

Tốc độ (QUALITY.md §9.7): câu nói ≤ 3,5 âm tiết/s trên đoạn có tiếng, câu hát ≤ 3,0 âm tiết/s theo bản nhạc. Từ nhấn và nốt cuối 1–1,5 phách, từ phụ ½ phách; câu nửa hát `fill .85, glide .08` cho liền hơi. Tính trước câu nào cần chỗ trống để chậm lại.

Chọn kiểu theo câu: câu hỏi tò mò → half-sing cao; khám phá → half-sing nhẹ có nhịp; giải thích khoa học → sing-talk rõ từ; bất ngờ → nhấn bằng giai điệu + tiếng hài; kết luận / điệp khúc → sing; câu cửa miệng, gag, CTA → nói (hoặc `CATCH_TUNE`). Có thể thêm Wow!, Hey!, Oops!, Look!, Yeah!. Không đổi kiến thức để vần.

## 8. SFX và nhạc nền

Phác theo cảnh: tiếng nào cho hành động nào (boing khi nhảy, ding khi phát hiện, whoosh khi zoom, comedic sting khi bất ngờ, squeak / sad-trombone vui khi thất bại, sparkle / chime khi vui mừng), chuỗi nhịp có chủ đích ghi `run`; nhạc nền từng cảnh (phong cách, BPM, nhạc cụ). Bảng đầy đủ ở mục A–E.

## 9. CTA

Một câu cụ thể, tự nhiên, ≤ 2 s, trong 4 s cuối, gắn với bí mật, hợp Made for Kids: câu hỏi cho trẻ trả lời to (*"Can YOU…?"*), một việc làm thật (*"Listen for … outside!"*, *"Count …!"*), hoặc trò xem lại (*"Watch again: find Rollo!"*). Không comment / subscribe / like / share.

## 10. Checklist trước khi xuất bản

- [ ] `sh films/<tập>/build.sh` chạy trọn; `qa.py` không còn CHƯA ĐẠT; mọi CẢNH BÁO đã sửa hoặc ghi lý do
- [ ] Checklist thủ công cuối [`QUALITY.md`](QUALITY.md) và §8.5
- [ ] Final Audio Checklist (mục F) đã nghe và điền
- [ ] Dữ kiện đúng `FACTS.md`; không nói quá nguồn, kể cả trong lời hát

## A. Music Direction

- **Phong cách tổng thể** (kết hợp Playful Kids Pop, Cartoon Musical, Nursery Rhyme, Funny Educational Song, Bouncy & Catchy): …
- **Giọng (key):** … trưởng · **BPM** theo phần: … (≥ 108) · **Điệu riêng của tập** (`SIGNATURE`): …
- **Nhạc cụ chính:** ukulele, xylophone, marimba, pizzicato, piano, vỗ tay, bộ gõ vui…
- **Cảm xúc âm nhạc** theo phần: mở đầu · diễn biến · cao trào · kết.
- **Bài hát của tập** (`SONG` trong `timeline.js`): các phần (t0, BPM, vòng hợp âm), **motif** (giai điệu đặc trưng), **điệp khúc** (lời, giai điệu, số lần, vị trí).

## B. Music Timeline *(sinh tự động: `SOUND-PLAN.md`)*

| Thời gian | Cảnh | Background Music | Vocal Style | SFX |
|---|---|---|---|---|
| … | … | … | … | … |

## C. Sing-along Dialogue

Bản phác ở mục 7; bản cuối *(sinh tự động)* trong `SOUND-PLAN.md` (nốt thật, kiểu hát, điệp khúc, từ nhấn). Nhịp điệu và cách nhấn từ: …

## D. AI Music Generation Prompts *(sinh tự động: `SOUND-PLAN.md`)*

Prompt tiếng Anh cho từng đoạn (genre, mood, BPM, instruments, vocal style, melody, energy changes, ending), sinh từ đúng thông số của cảnh. Chỉ để tham khảo: nhạc trong phim tổng hợp bằng code, giọng hát là giọng nhân vật.

## E. Sound Effects Timeline *(sinh tự động: `SOUND-PLAN.md`)*

Phác các tiếng chính và thời điểm; bảng đầy đủ từ `events.json`.

## F. Final Audio Checklist

- [ ] Nhạc có sinh động không? · [ ] Có thay đổi theo cảnh không? · [ ] Lời thoại có giai điệu không?
- [ ] Có đoạn nhạc dễ nhớ không? · [ ] Giọng hát có rõ không? · [ ] Nhạc nền có lấn át giọng không?
- [ ] SFX có khớp hành động không? · [ ] Âm nhạc có tạo cảm xúc và giữ chân người xem không?

## G. Vocal & Musical QC ([`QUALITY.md`](QUALITY.md) §9, Task.md 18/11/2026)

- **Trước khi dựng:** từ khó trong lời (tên loài, từ ≥ 3 âm tiết, phụ âm cuối như bugs, legs, wings) và cách hát chúng; câu có dấu câu giữa câu thì chừa nghỉ; kiểu hát (vocal direction) của từng câu theo nhịp kể chuyện.
- **Sau khi dựng:** `VOCAL-QC.md` *(sinh tự động bởi `tools/vocal_qc.py`)*: A bảng lỗi (LỖI / CẦN NGHE, timestamp, cách sửa) · B lời trước / sau sửa (trường `was`, `why` trong `timeline.js`) · C hướng dẫn phát âm (IPA, trọng âm, ngắt câu) · D prompt tạo giọng hát · E prompt tạo nhạc · F hướng dẫn trộn · G checklist. Câu LỖI: sửa rồi tạo lại đúng câu đó (`voice_regen.py`); câu CẦN NGHE: nghe và ghi kết luận vào báo cáo giao.

## H. Thiết kế âm thanh theo cảnh, 4 lớp ([`QUALITY.md`](QUALITY.md) §10, Task.md 18/11/2026 lượt 2)

Mỗi cảnh một dòng (khai báo ở `SCENES` trong `mix.py`; bảng cuối sinh tự động vào `SOUND-PLAN.md`):

| Cảnh | Năng lượng (calm / normal / high / peak) | Voice (câu · `emo`) | Music | SFX (hành động → tiếng) | Ambient |
|---|---|---|---|---|---|
| … | … | … | … | … | … |

Cảm xúc của từng câu (`emo`), "sợ hãi" làm thành giật mình vui (`startled`); hành động nào cần tiếng (bước, bay, xuất hiện, va chạm, bất ngờ, chuyển cảnh); lớp nền của từng bối cảnh.

## Video dài (chỉ điền khi là video dài)

- **Bài hát chủ đề** (điệp khúc ≥ 3 lần: mở đầu, cuối mỗi chương, kết) và motif của video; mỗi chương một phần của bài (BPM, vòng hợp âm riêng).
- Hát trọn ≤ 30 % số từ; phần giải thích dài dùng nói hoặc sing-talk; mỗi chương có mở, khám phá, kết (ghi trong `BEATS`).
- `SHOTS` ≤ 5 s; CTA trong 10 s cuối, ≤ 3 s; chữ móc khung 1920×1080 ở `hookStack(…, 'wide')`.

## Ghi chú sản xuất · Báo cáo giao

Ghi lại những gì sửa trong lúc dựng (khung tĩnh, Whisper, độ bám nốt), rồi dán bảng `qa.py` (`out/qa.json`) và checklist thủ công.
