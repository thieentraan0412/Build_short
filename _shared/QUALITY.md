# Big Secrets of Tiny Bugs · Bộ tiêu chí chất lượng cho mọi Short và video

Áp dụng cho **mọi** Short (tập A, bản B) và video dài của kênh. Mỗi tiêu chí gồm ba phần:
- quy tắc cụ thể;
- bước trong quy trình phải làm nó;
- cách kiểm: đo tự động bằng [`qa.py`](qa.py) hoặc theo checklist thủ công ở cuối file.

Một video chỉ được giao khi:
- `qa.py` không còn mục **CHƯA ĐẠT**;
- mọi mục **CẢNH BÁO** đã sửa hoặc có lý do ghi trong báo cáo;
- checklist thủ công đã điền.

**Lượt nâng cấp 11/2026.** Các quy tắc ghi *(11/2026)* đến từ [bản phân tích 5 Short đầu](../PHAN-TICH-SHORTS/README.md). Lý do và cách áp dụng ở [kế hoạch nâng cấp](../PHAN-TICH-SHORTS/KE-HOACH-NANG-CAP.md).
- Quy tắc áp dụng từ SHORT-006.
- SHORT-001 đến 005 giữ nguyên làm mốc so sánh, nên `qa.py` vẫn báo CẢNH BÁO ở các tập này.

**Lượt Sound Design Plan 11/2026.** Các quy tắc ghi *(SDP)* ở §4 đến từ yêu cầu phân tích và đề xuất nhạc nền theo từng phân cảnh (`Task.md`, 10/11/2026): mỗi cảnh một phong cách nhạc, một BPM, một nhạc cụ hát chính, một cách chuyển; chống trùng lặp; bảng Sound Design Plan 7 cột.
- Áp dụng cho mọi Short, kể cả SHORT-001 đến 007 (đã dựng lại nhạc theo quy tắc này).
- Video dài chưa áp dụng (LONG-001 giữ lớp nhịp cũ, `plan=False`); `qa.py` chỉ đo nhóm "Sound Design Plan" ở Short.

**Lượt "luôn vui tươi" 14/11/2026.** Các quy tắc ghi *(Vui tươi)* ở §4 và §5 đến từ yêu cầu "hãy luôn làm khuôn mặt của các nhân vật và nhạc vui tươi" (`Task.md`, 14/11/2026).
- Bắt buộc từ SHORT-011: `qa.py` báo **CHƯA ĐẠT** nếu có mặt không vui hoặc cảnh nhạc không vui; các tập trước chỉ CẢNH BÁO.
- Mặt: bật `LOOK.cheer = true` ngay sau `LOOK.v = 2` ở đầu `film.js` (và `poster.js`, `sheets.js` nếu các file này tự đặt `LOOK`). Rig dùng chung tự đổi biểu cảm buồn, lo, cáu, nhăn sang dạng vui (`cheerExpr` trong `characters/stage.js`); đang nói thì miệng cười há.

**Lượt chống trùng giữa các tập 11/2026 (lượt 2).** Các quy tắc ghi *(Kênh)* ở §4 đến từ yêu cầu "kiểm tra nhạc nền, đề xuất nhạc nền vui nhộn, tránh trùng lặp các short" (`Task.md`, 10/11/2026). Kết quả kiểm tra và đề xuất từng tập: [`PHAN-TICH-SHORTS/NHAC-NEN-KENH.md`](../PHAN-TICH-SHORTS/NHAC-NEN-KENH.md).
- Áp dụng cho mọi Short dựng hoặc dựng lại nhạc từ nay. SHORT-001, 004, 006–010 đã dựng lại nhạc theo các quy tắc này.
- SHORT-002, 003, 005 đã đăng nên giữ nguyên; chạy lại `qa.py` ở các tập này thì các mục *(Kênh)* có thể là CẢNH BÁO.

**Lượt "Chuẩn mới + Musical Storytelling" 11/2026b (17/11/2026).** Các quy tắc ở [§8](#8-chuẩn-112026b-chuẩn-sản-xuất-mới-và-musical-storytelling) đến từ [`Task.md`](../Task.md) ngày 17/11/2026 (hai phần: nâng cấp quy trình sản xuất Shorts; Musical Storytelling).
- Áp dụng cho **Short từ SHORT-016 và video dài từ LONG-002**. Tập theo chuẩn này khai báo `export const STANDARD = '2026-11b'` trong `timeline.js` (chép từ [`template/`](template/)); `qa.py` thấy `standard` trong timeline.json thì chạy thêm nhóm 8 ([`qa_musical.py`](qa_musical.py)).
- SHORT-010 đến 015 giữ nguyên như đã dựng (mốc so sánh "công thức cũ" với "công thức mới"); `qa.py` không chạy nhóm 8 ở các tập này.
- Ở tập theo chuẩn mới, một số quy tắc cũ được viết lại cho lời hát (đánh dấu *11/2026b* ở §4 và §7); phần còn lại của §1–§7 vẫn giữ nguyên.

## Quy trình

| Bước | Việc phải làm theo bộ tiêu chí này |
|---|---|
| 1. Treatment (`TREATMENT.md`) | *(11/2026b)* Chép [`TREATMENT-TEMPLATE.md`](TREATMENT-TEMPLATE.md): đủ 10 đầu ra và Music Direction A–F của Task.md (6 nhịp, storyboard 2–4 s, Sing-along, AI prompts…). Viết rõ: nhịp móc 0–1 / 1–2 / 2–3 s; ba cấu trúc và lựa chọn; mỗi 3–5 s có chuyện gì mới (bảng cảnh); gag hoặc bất ngờ; thông điệp; chi tiết để xem lại (trứng phục sinh, vòng lặp); màu nhạc riêng của tập. *(SDP)* Phác **bảng Sound Design Plan** theo bảng cảnh: phong cách nhạc, BPM, nhạc cụ hát chính của từng cảnh, đâu là mở đầu / diễn biến / cao trào / kết. *(11/2026)* Thêm: **khoảnh khắc wow** (bí mật xảy ra thành chuyển động gì, kính cỡ nào); **người nói của từng câu** có trên hình không; **đạo cụ của gag** được gài ở đâu; tập A theo khung 45 s ([kế hoạch nâng cấp](../PHAN-TICH-SHORTS/KE-HOACH-NANG-CAP.md#3-công-thức-mới-của-tập-a-khoảng-45-s)) |
| 2. Giọng | Mỗi nhân vật có lời phải có trong [`voices.js`](voices.js). Nhân vật mới phải thử A/B. Mọi câu qua Whisper `small.en` và `base.en` (`build.sh` chạy cả hai). *(11/2026b)* Câu hát: bản nói qua Whisper khớp từng chữ, rồi [`sing.py`](sing.py) hát bằng chính giọng đó và [`tools/asr_sung.py`](tools/asr_sung.py) kiểm lời hát. Nhân vật hát lần đầu: chốt duyệt nghe thử với chủ kênh |
| 3. Hình | Dựng khung tĩnh của mọi cảnh trước khi render; soi lỗi che khuất, chữ đè, nhân vật lơ lửng, cắt mép. *(11/2026)* Soi cả vùng giao diện Shorts: `node _shared/tools/safezone.mjs films/<tập>` (số đo) và `python _shared/tools/safesheet.py films/<tập>` (khung có phủ vùng che) |
| 4. Âm thanh | Bảng Soundtrack Timeline (`MUSIC.md`: màu nhạc, nhạc cụ, điểm nhấn viết tay) và bảng cue (`SOUND.md`) trước khi trộn. *(SDP)* Bảng cảnh nhạc khai báo trong `mix.py`: `Groove(..., plan=True)`, mỗi cảnh một `G.sec` / `G.mark` có `mood`, `arc`, `bpm`, `what`, `emo`, `why` ([`audio/groove.py`](audio/groove.py)); `python _shared/tools/soundplan.py films/<tập>` viết **`SOUND-PLAN.md`** (bảng 7 cột) |
| 5. Dựng | `build.sh` chạy readcheck, Whisper, `soundplan.py` ngay sau `mix.py`, và **`qa.py`** ở cuối (`qa.py` tự chạy `safezone.mjs` với Short 1080×1920) |
| 6. Giao | Báo cáo gồm bảng `qa.py` (hoặc `out/qa.json`) và checklist thủ công, ghi rõ mục nào chưa đạt và lý do |

## 1. Hook: 3 giây đầu

| Quy tắc | Kiểm |
|---|---|
| Khung đầu đã có hành động hoặc biểu cảm bất ngờ của nhân vật, không có cảnh tĩnh | `qa.py`: chuyển động giây đầu ≥ 1,2 |
| Câu móc có cả hình và lời, bắt đầu ≤ 0,5 s, là câu hỏi về chính trẻ hoặc một bí ẩn đọc được bằng mắt | `qa.py`: lời đầu tiên ≤ 0,5 s |
| Nhạc chạy từ giây 0; chữ móc và nhân vật xuất hiện có tiếng (pop, whoosh, boing, sparkle) | `qa.py`: nhạc 0–0,5 s; tiếng động ≤ 0,3 s; ≥ 5 cue trong 0–3 s |
| Nhịp móc: 0–1 s gây chú ý · 1–2 s nhân vật phản ứng · 2–3 s câu hỏi / bí ẩn chưa giải | Treatment + checklist |
| Không logo, không lời chào. *(11/2026)* Tập A: logo và nhạc hiệu **≤ 0,8 s, lồng vào cú lao vào kính** ngay sau móc, không có khung tựa đứng riêng (khai báo cảnh `title` dài 0,8 s để `qa.py` nhận ra tập A). Bản B không có cảnh tựa. Video dài giữ nhạc hiệu 2 s | `qa.py`: cảnh tựa ≤ 0,85 s, bắt đầu ≥ 2,5 s (nhạc hiệu 2 s của các tập trước 11/2026 là CẢNH BÁO) |
| Chữ móc to, 2–4 từ, đọc được ngay ở khung đầu, không bị nhân vật che | readcheck + khung tĩnh |
| **Tựa móc dùng `hookTitle`** (`_shared/episode.js`): chữ ≥ 180 px, màu tương phản cao với nền, hiện đủ 100% ở khung 0 (để khung cuối của vòng lặp khớp), từng dòng nảy lên 1 → 1,17 → 1 kèm một tiếng `wordpop` | khung tĩnh 0 s và 0,15 s + `events.json` |
| Trong 1 s đầu nhân vật có **một phản ứng bất ngờ gắn với câu hỏi khoa học** (ví dụ: cái đầu gối "nghe" trước, Chirp ngó xuống đầu gối mình), và máy có chuyển động (lao vào, đẩy nhanh) | checklist + `qa.py` chuyển động giây đầu |
| *(11/2026)* **Móc bằng hình, không chỉ bằng chữ**: 1–2,5 s nhân vật phản ứng bằng hành động (giật mình, nhảy, va chạm), không đứng nhìn chữ. Nhân vật chính không bị che trong 3 s đầu | `qa.py`: chuyển động 1–2,5 s ≥ 2,0 + khung tĩnh |

## 2. Giữ chân người xem

| Quy tắc | Kiểm |
|---|---|
| Không có đoạn hình đứng yên ≥ 2,5 s khi không có lời (trang sổ đứng yên chỉ khi đang có lời) | `qa.py` |
| Không có "khoảng chết" ≥ 1,8 s (không lời, không tiếng động). Khoảng lặng có chủ đích (trước đáp án, khựng cho gag) ≤ 1 s | `qa.py` |
| Mỗi cảnh trung bình ≤ 12 s; trong cảnh dài phải có máy quay hoặc kính di chuyển | `qa.py` + bảng cảnh |
| Tốc độ lời 0,8–2,2 từ/s; câu ngắn, mỗi ý một câu | `qa.py` |
| Chuyển cảnh theo ngữ pháp kênh (qua kính, vòng sóng, đốm mắt…), mỗi chuyển cảnh một tiếng riêng | `SOUND.md` + checklist |
| **Kính → sổ phải có chuyển động nối**, không iris trơn sang cảnh không liên quan: kính "chụp" (`snapFlash`) → máy lao xuyên qua mặt kính, hình trong kính hoá thành sticker → máy lùi ra từ chính sticker, lộ trang sổ (`stickerMatchCut`). Cả chuyển cảnh ≤ 0,8 s; câu đầu tiên của cảnh sau bắt đầu ≤ 0,5 s sau khi sticker dán | khung tĩnh + checklist |
| Mỗi 3–5 s có một chuyện mới: hành động, câu hỏi, phát hiện, gag | Treatment (bảng cảnh) + checklist |
| *(11/2026)* **Không có đoạn không lời dài hơn 4 s** (video dài: 8 s). Nhạc và vài tiếng động không đủ giữ trẻ. Nếu cố ý (điệu nhảy, cảnh đặc trưng) thì phải có chữ trên hình hoặc hành động mới mỗi 2 s, và ghi lý do trong báo cáo | `qa.py` |
| *(11/2026)* **Hình không đứng gần yên quá 3 s, kể cả khi đang có lời.** Lời nói không thay được hình: cảnh kính, cảnh sổ phải có hành động hoặc máy trôi | `qa.py`: trung vị chuyển động trong 1,5 s dưới 1,5 không quá 3 s (chỉ Short) |
| *(11/2026)* **Kính soi đứng ≤ 3 s**: trong kính, bí mật phải "xảy ra" (chân bước thì điểm nếm sáng theo bước, tiếng gáy thì màng nhĩ rung, mây mùi hoà vào nhau), mỗi nhịp một tiếng | `qa.py` (mục trên) + khung tĩnh |
| *(11/2026)* **"Six legs? In you go!" nói trong lúc có hành động**: Albie đớp sticker, nhân vật nhảy vào sổ đúng lúc nói. Không đọc trên trang sổ đứng yên | `qa.py`: chuyển động trong câu ≥ 2,0 (chỉ Short) |
| *(11/2026)* **Tập A: cảnh sổ ≤ 4,5 s.** Trang đủ 3 sticker vẫn đứng ≥ 3 s để chụp màn hình, nhưng nhân vật trên trang vẫn chuyển động | `qa.py` (cảnh `album`) |
| *(11/2026)* **Không có cảnh giới thiệu lặp lại** điều móc vừa cho thấy (ví dụ "A butterfly lands on a flower" ngay sau khi móc đã cho thấy bướm) | Treatment + checklist |
| *(11/2026)* **Tập A có vòng mở**: ba ô sticker trống "1 2 3" hiện khi chữ móc rời đi, lấp dần theo từng bí mật. Đây là lý do để xem hết | Treatment + khung tĩnh |

## 3. Nội dung và câu chuyện

| Quy tắc | Kiểm |
|---|---|
| Dữ kiện có nguồn trích nguyên văn (`FACTS.md`); đúng phạm vi ("some ants"…); không nói điều nguồn không nói | `FACTS.md` |
| Có mở (câu hỏi), giữa (phát hiện), kết (gag nối về câu móc) | Treatment |
| Mỗi tập ít nhất một gag hoặc bất ngờ hợp tính cách nhân vật | Treatment + checklist |
| Phù hợp trẻ 4–8 tuổi: không đáng sợ, không làm nhân vật bị đau, không nói sai | checklist |
| Một thông điệp rõ (ví dụ "Go outside with a grown-up, and look closely!") hoặc một bài học nhỏ thấy được bằng mắt | checklist |
| Không trùng nhịp hoặc cảnh của tập khác (kế hoạch §4.3, §12) | Treatment (benchmark) |
| *(11/2026)* **Người nói có trên hình** (kể cả trong kính) từ giây 3 trở đi, nhất là câu phản ứng và gag ("NOPE!", "Oops! Sorry!"). Lời dẫn ngoài hình có chủ đích thì ghi `off: '<lý do>'` vào câu trong `timeline.js` | `qa.py`: mặt người nói hiện ≥ 50 % thời gian câu |
| *(11/2026)* **Gài trước đạo cụ của gag**: thứ làm nên gag kết (cây kem, con ruồi, ánh lóe trên kính) phải xuất hiện ít nhất một lần trước đó | Treatment + checklist |
| *(11/2026)* **Nói rõ nghĩa ẩn dụ** cho trẻ 4–8 tuổi: "tiny cows" phải đi kèm "they tap them for sweet drops, like milk!" | Treatment + `FACTS.md` |
| *(11/2026)* **Nhân vật cần phân biệt phải khác nhau ở hình** (màu, phụ kiện, dáng), không chỉ khác ở hiệu ứng trong kính (bài học từ hai con kiến nâu ở SHORT-005) | khung tĩnh + checklist |

## 4. Âm thanh và nhạc nền

| Quy tắc | Kiểm |
|---|---|
| Mỗi tập một màu nhạc riêng (giọng, điệu, nhạc cụ), đổi theo cảnh; giữ nhạc hiệu và mô-típ bí mật đô–mi–sol | `MUSIC.md` |
| Điểm nhấn nhạc khớp hành động, biểu cảm và phát hiện; khựng nhạc cho gag | `MUSIC.md` + `SOUND.md` |
| Mật độ tiếng động ≥ 4 cue / 10 s | `qa.py` |
| Độ to −14 ± 1 LUFS, đỉnh ≤ −1 dBTP | `qa.py` |
| Lời rõ: mỗi câu hơn nhạc + tiếng động ≥ 10 dB (dải 300–4000 Hz). Dưới lời không đặt nốt dài, hợp âm, còi trượt hay tiếng xì nằm giữa dải giọng. *(11/2026b: tập theo chuẩn mới xem §8)* Dưới câu HÁT: hợp âm của bài được phép, ở dải cao hơn nốt hát ≥ 3 nửa cung | `qa.py` |
| Không chói (năng lượng > 6 kHz ≤ 6 %), không tụt tiếng đột ngột | `qa.py` |
| **Tự động hoá âm lượng theo cảnh** (`LEVEL` trong `mix.py`): dâng ở chỗ khám phá và bất ngờ (phát hiện, chụp sticker, "NOPE!", chữ móc trở lại), hạ dưới lời; chênh giữa giây to nhất và nhỏ nhất ≥ 6 dB | `qa.py` |
| **Không có lỗ im của nhạc**: nhạc không dưới −45 dB quá 1 giây. Chỗ "khựng" cho gag thì vẫn còn một lớp mỏng (vibraphone run run, pad), không im hẳn | `qa.py` |
| **Nhạc nền sinh động, đổi theo cảnh** (lượt 11/2026): không có đoạn nào quá 8 s (video dài: 15 s) mà nhạc giữ nguyên một kiểu. Hai cảnh nhạc kề nhau khác nhau ở ít nhất 2 trong 5 thứ: điệu, vòng hoà âm, bộ nhạc cụ, bộ trống, mức năng lượng. Một Short có ≥ 3 điệu (dưới 20 s: ≥ 2). Dựng bằng lớp nhịp theo cảnh [`audio/groove.py`](audio/groove.py) (`G.sec`); đoạn viết tay (nhạc hiệu, stinger, tổ khúc) ghi bằng `G.mark`; `G.save` ghi `out/music.json` | `qa.py` (`out/music.json`) + bảng cảnh nhạc trong `MUSIC.md` |
| **Nhạc có nhịp liền, kể cả dưới lời**: dưới lời còn bass, kick, hat/shaker và tiếng đệm ngắn ở dải cao (giai điệu im); dưới giọng trầm (Albie) bỏ bass. Không để nhạc đứng thành pad ngân dài: chỗ khám phá dùng điệu rải (`float`), không dùng pad trơn. *(11/2026b: tập theo chuẩn mới xem §8)* Dưới câu hát: hợp âm đủ nhịp (`UNDER_SUNG` của `groove.py`), không arp, không giai điệu phụ; câu `sing` có nhạc cụ hát chính đánh đôi cao một quãng tám | `qa.py`: ≥ 85 % số giây có ≥ 3 nốt |
| **Nhạc đáp lời**: khoảng không lời giữa hai câu có một câu đáp ngắn của nhạc cụ hát chính (lớp nhịp tự chen; câu đáp viết tay ghi bằng `G.answer`), ≥ 1 câu / 10 s. *(11/2026b: tập theo chuẩn mới xem §8)* Câu hát không tính là khoảng trống (đã có giai điệu) | `qa.py` |
| **Đổi cảnh nhạc có dấu**: trước cảnh mạnh hơn có trống dồn, trước cảnh nhẹ hơn có chuỗi nốt đi xuống; phách đầu cảnh mới có kick + chũm chọe mềm (lớp nhịp tự làm); chỗ khựng, stinger viết tay | `MUSIC.md` + nghe lại |
| *(SDP)* **Bảng Sound Design Plan** (`SOUND-PLAN.md`, sinh từ `out/music.json`): mỗi cảnh nhạc một dòng `Thời gian · Nội dung cảnh · Cảm xúc (kèm nhịp độ chậm / vừa / nhanh / cao trào) · Phong cách nhạc · Nhạc cụ · BPM · SFX`, kèm lý do chọn nhạc, các chỗ chuyển cảnh và tóm tắt chống trùng lặp. Không sửa tay: sửa `G.sec` trong `mix.py` rồi chạy lại | `qa.py`: đủ mọi cảnh, mỗi cảnh có `what`, `emo`, `why` |
| *(SDP)* **Mỗi cảnh một phong cách nhạc** trong 8 phong cách: Playful Cartoon, Happy Kids, Funny Comedy, Magical Adventure, Cute & Sweet, Bouncy Rhythm, Suspense & Surprise, Epic Cartoon (`MOODS` trong `groove.py`). Một Short có ≥ 4 phong cách (dưới 25 s: ≥ 3) | `qa.py` |
| *(SDP)* **Luân phiên nhạc cụ**: hai cảnh kề nhau khác nhạc cụ hát chính; không nhạc cụ nào hát chính quá 40 % số cảnh; ≥ 4 nhạc cụ hát chính (dưới 25 s: ≥ 3); ≥ 6 họ nhạc cụ trong cả tập (dưới 25 s: ≥ 5) xoay giữa piano, ukulele, marimba, xylophone, dây pizzicato, kèn gỗ, kèn đồng, bộ gõ và nhạc cụ hoạt hình (kazoo, accordion, trống thép…) | `qa.py` |
| *(SDP)* **BPM đổi theo nội dung** (`bpm=` của `G.sec`): ≥ 3 mức (dưới 25 s: ≥ 2), cảnh chậm nhất và nhanh nhất chênh ≥ 16 BPM. Gợi ý: hồi hộp, rón rén 96–104 · phép thuật, dễ thương 100–112 · vui, tinh nghịch 112–128 · nảy, cao trào 126–138. Giữ BPM của phim (120) ở cảnh mà hình nhún theo phách, cảnh có nốt viết tay theo lưới phim và cảnh nối vòng lặp | `qa.py` |
| *(SDP)* **Không lặp một bản nhạc**: không cảnh nào lặp nguyên điệu + hoà âm + nhạc cụ + bộ gõ của cảnh khác; không cảnh nào nghe như cảnh khác chỉ đổi tốc độ (cùng điệu, cùng nhạc cụ, khác BPM); một điệu ≤ 40 % số cảnh. Chỉ giữ lại nhạc của một cảnh trước khi cùng mạch cảm xúc hoặc để nối vòng lặp, và ghi `reprise=True` | `qa.py` |
| *(SDP)* **Mở đầu · diễn biến · cao trào · kết** khác nhau rõ (`arc=`): có đủ bốn phần; cao trào năng lượng 3 và khác điệu hoặc nhạc cụ của mở đầu; cảnh kết khác cảnh mở đầu ≥ 2 điểm (điệu, nhạc cụ, đệm, bộ gõ, năng lượng, BPM), kể cả khi kết nối vòng lặp về hoà âm của móc | `qa.py` |
| *(SDP)* **Chuyển cảnh âm thanh tự nhiên** (`plan=True` tự làm, ghi vào `music.json`): mỗi chỗ đổi cảnh một cách chuyển (trống dồn, riser, nốt mồi của nhạc cụ mới, chuỗi nốt đi xuống, vuốt đàn hạc, dâng lấp lánh, còi trượt "bwomp", ngân đuôi để cảnh sau vào mềm), không cách nào quá 50 % số chỗ chuyển tự động; khi có lời ở điểm cắt thì chỉ dùng cách không chạm dải giọng; phách đầu cảnh mới được nhấn theo phong cách (timpani cho cao trào, triangle cho dễ thương, mõ cho hài) | `qa.py` + nghe lại |
| *(SDP)* **Nhạc không lời, tích cực**: không có giọng hát trong nhạc nền; hồi hộp chỉ ở mức hoạt hình (rón rén, nhịp tim), không nhạc buồn hay đáng sợ; nhạc đỡ câu chuyện, không giành chú ý với lời. *(11/2026b: tập theo chuẩn mới xem §8)* Nhạc nền vẫn không có ca sĩ hay bè hát; chỉ nhân vật hát lời của mình bằng giọng TTS của nhân vật đó | checklist |
| *(Kênh)* **Điệu riêng của tập**: mỗi Short có ≥ 1 điệu chỉ tập đó dùng (`SIGNATURE` trong [`audio/groove.py`](audio/groove.py)), chiếm ≥ 20 % thời lượng, tính cả đoạn viết tay ghi bằng `G.mark`. Không dùng điệu riêng của tập khác. Tập mới thì thêm một điệu mới vào `STYLES` rồi ghi vào `SIGNATURE` | `qa.py` (`music-plan.json`) |
| *(Kênh)* **Không trùng cảnh nhạc của Short khác**: không cảnh nào cùng điệu + nhạc cụ hát chính + đệm + bộ gõ với một cảnh của Short khác. Một cặp điệu + nhạc cụ hát chính đã có ở ≥ 3 Short khác là quá quen. Tập đăng trước được giữ công thức; tập sau đổi nhạc cụ hoặc điệu. Các cảnh lặp lại ở mọi tập (sổ, gag rình rập, cao trào, phép thuật trong kính) phối theo thể loại riêng của tập, không dùng cách phối mặc định. Tiếng "chụp" (marimba chạy lên + đàn hạc vuốt) và nhạc hiệu là tiếng của kênh, cố ý giống nhau. `soundplan.py` ghi `<tập>/music-plan.json` (được commit) để các tập so với nhau | `qa.py` + mục "Chống trùng lặp giữa các tập" trong `SOUND-PLAN.md` |
| *(Kênh)* **Nhạc vui nhộn**: hồi hộp + khựng ≤ 20 % thời lượng; cảnh nhạc ở giọng thứ ≤ 20 % thời lượng. Cảnh rình rập, rón rén ưu tiên giọng trưởng và phong cách hài (`mood='funny'`) | `qa.py` |
| *(Vui tươi)* **Nhạc luôn vui tươi** (từ SHORT-011, thay cho mục trên): mọi cảnh nhạc ở **giọng trưởng**; **không** phong cách hồi hộp (`mood='suspense'`), **không** điệu rình rập / rón rén / nhịp tim / lắng nghe / dừng nhịp (`sneak`, `tiptoe`, `tension`, `hush`, `stab`); mọi cảnh có điệu **≥ 108 BPM, năng lượng ≥ 2**. Chỗ khựng cho gag là khựng hài ≤ 1,2 s, giọng trưởng. Cảnh rình rập dùng điệu nảy, vui (`skip`, `hop`, `stride`, điệu riêng của tập); cảnh khám phá trong kính dùng `float` / `twinkle` ≥ 108 BPM; cảnh kết luôn vui (không bài ru) | `qa.py`: "Nhạc vui tươi" |
| Có tiếng động cho mọi chuyển động chính: nhân vật (nhảy, giật mình, khoe), kính (chụp, lao vào, lùi ra), sổ (lật, dán), gag. *(SDP)* Bảng tiếng động theo hành động trong [`audio/toon.py`](audio/toon.py): boing, pop, whoosh (`swish`, `zip_`), va chạm nhẹ (`bonk`), bước chân (`footsteps`), chạy (`scurry`), nhảy (`boing` + `swish`), cười (`giggle`), ngạc nhiên (`surprise`), reo vui (`cheer`), chuyển cảnh (`swirl`, `revcymbal`), "ta-da" (`band.tada`) | `SOUND.md` + cột SFX của `SOUND-PLAN.md` |
| *(SDP)* **Tiếng động không lạm dụng, không lấn lời**: ≤ 8 cue trong 1 s bất kỳ sau móc; mỗi câu lời hơn riêng tiếng động ≥ 11 dB (dải 300–4000 Hz) | `qa.py` |
| Nền (ambience) theo bối cảnh: đêm (gió, dế xa), vườn (chim xa, gió lá)…, nhường giọng như nhạc | `mix.py` |

## 5. Hình ảnh và chuyển động

| Quy tắc | Kiểm |
|---|---|
| Không khung trống hoặc đen | `qa.py` |
| Không chớp sáng mạnh quá 3 lần/giây (an toàn cho trẻ) | `qa.py` |
| Màu rực, đúng bảng màu của phong cách (độ rực ≥ 0,35) | `qa.py` |
| Biểu cảm rõ ở cỡ điện thoại: mắt to khi ngạc nhiên, phản ứng kéo dài ≥ 0,4 s | khung tĩnh + checklist |
| *(Vui tươi)* **Mặt nhân vật luôn vui tươi** (từ SHORT-011): không mếu, không hét, không nhắm buồn / nhắm nhăn, không mí xếch lo âu hay cau có, không nước mắt, mồ hôi. Bất ngờ = mắt to + miệng cười (không miệng tròn sợ hãi); bị giật mình, va chạm, "too loud" vẫn cười. Đang nói thì miệng cười há. Làm bằng `LOOK.cheer = true` (đổi tên biểu cảm: worried → curious, sad → hopeful, cry → laugh, strain / shout → excited, annoyed / sleepy → happy, confused → curious, crosseyed → silly; và đổi miệng, mắt, lông mày, ký hiệu của biểu cảm tự viết) | `qa.py`: "Mặt nhân vật vui tươi" (đo mọi mặt vẽ bằng `drawChar`, qua `tools/safezone.mjs`) + khung tĩnh |
| Không biến dạng nhân vật, không che mặt hay chữ, không lơ lửng, không cắt mép | khung tĩnh (bước 3) + checklist |
| Chuyển động có keyframe mượt (ease), có nhún hoặc vọt nhẹ khi dừng | checklist |
| Máy quay có zoom, lia hoặc rung nhẹ ở các điểm nhấn (móc, tiếng chạm, phát hiện, gag, chữ móc trở lại); cảnh dài có máy trôi chậm | khung tĩnh + `qa.py` (đoạn đứng yên) |
| Có chiều sâu: nền trôi chậm hơn máy, tiền cảnh trôi nhanh hơn, chi tiết nhỏ chuyển động nhẹ (bụi sáng, cỏ lắc) nhưng không che nhân vật hay chữ | khung tĩnh |
| *(11/2026)* **Khoảnh khắc bí mật to và rõ**: kính r ≥ 300 px (khoảng 55 % chiều rộng khung) hoặc cận cảnh toàn khung. Chi tiết chính (vòi bướm, tai dế) rộng ≥ 10 % khung, không phải một nét mảnh | khung tĩnh ở cỡ điện thoại |
| *(11/2026)* **Vùng giao diện YouTube Shorts** (ước lượng trên khung 1080×1920; `SAFE` trong [`episode.js`](episode.js)): đáy tấm phụ đề trên 1500 px (tập mới gọi `subtitle(c, card, t, 510, SAFE.subY)`). Chữ và mặt nhân vật ngoài thanh trên (150 px), vùng tên kênh/tiêu đề/nhạc (từ 1530 px) và cột nút phải (x > 940, y 880–1780) | `qa.py` (qua `tools/safezone.mjs`) + `tools/safesheet.py` |
| *(11/2026)* **Phụ đề không che mặt nhân vật**: khi có phụ đề, mặt đứng trên 1250 px hoặc lệch hẳn sang bên | `qa.py` (qua `tools/safezone.mjs`) |
| *(11/2026)* **Chữ đọc được trên mọi nền**: chữ trên nền sáng có viền tối hoặc nền đặc; chữ nằm trên lớp mây, khói, hiệu ứng | khung tĩnh + checklist |
| *(11/2026)* **Nền tương phản với nhân vật chính** (không hồng trên hồng như nền của SHORT-005) | khung tĩnh + checklist |
| **Kỹ thuật:** Short 1080×1920, video dài 1920×1080; **30 fps** (`video.mjs --fps 30`, `mux.sh … 30`); không watermark | `qa.py` |

## 6. Tương tác và khả năng xem lại

| Quy tắc | Kiểm |
|---|---|
| **3–5 s cuối: một câu hỏi ngắn cho trẻ trả lời to** (≤ 1,5 s, ví dụ *"Where are YOUR ears?"*), gắn với chính bí mật của tập. Không kêu gọi bình luận: video cho trẻ em bị YouTube tắt bình luận. *(11/2026b: tập theo chuẩn mới xem §8)* CTA cụ thể ghi `cta: true`: câu hỏi hoặc một việc làm thật gắn với bí mật, ≤ 2 s (video dài ≤ 3 s), không comment / subscribe / like / share | `qa.py` |
| **Cảnh cuối gợi lại câu móc**: chữ móc trở lại đúng chỗ, đúng cỡ của khung 0 (`hookTitle`, mốc `HIT.recall`), hoặc âm thanh/hành động của câu móc trở lại; không để màn hình trống hay kết cụt | `qa.py` |
| Bản B phát vòng lặp liền (khung cuối mở về khung đầu); tập A có câu cuối nối câu móc. Phim lặp kết bằng một sự kiện tên chứa `iris` trong 1,5 s cuối (hoặc khai báo mốc `loop` trong `HIT`) để `qa.py` đo khung nối | `qa.py` |
| Tập A có ít nhất một chi tiết để tìm lại (Rollo, Spindle, một chi tiết chỉ thấy trong kính) | `qa.py` + Treatment |
| Kết vui, có điểm nhấn (gag hoặc "ta-da"), không bỏ lửng | checklist |
| **Made for Kids:** không kêu gọi bình luận hay đăng ký trong phim (YouTube tắt bình luận với video cho trẻ em). Tương tác bằng câu hỏi cho trẻ trả lời to, trò tìm đồ vật, vòng lặp | checklist |

## 7. Giọng nhân vật

| Quy tắc | Kiểm |
|---|---|
| Mỗi nhân vật có lời một giọng riêng trong `voices.js`, dùng y hệt ở mọi tập; câu cửa miệng giữ đúng tốc độ. *(11/2026b: tập theo chuẩn mới xem §8)* Câu cửa miệng nói đúng tốc độ, hoặc hát đúng giai điệu cố định của kênh (`CATCH_TUNE` trong `voices.js`); câu hát của một nhân vật nằm quanh `home` của giọng ± 2 nửa cung | `voices.js` |
| Hai nhân vật bất kỳ cách nhau ≥ 3 nửa cung (cao độ trung vị), hoặc khác hẳn chất giọng Anh/Mỹ (khi dàn nhân vật đông, ví dụ Dot và Blink giọng Anh cạnh Crumb giọng Mỹ). *(11/2026b: tập theo chuẩn mới xem §8)* Đo trên bản cuối (đã hát) | `qa.py` |
| Nhân vật trẻ em (Crumb, Blink, Dot) có giọng trẻ em: ≥ 240 Hz, nhanh, ngộ nghĩnh (`pitch` trong `voices.js`, xử lý bằng `voicefx.py`) | `qa.py` |
| Nhân vật người lớn (Miss Loupe, Albie…) vui, giàu cảm xúc, không đọc kiểu thuyết minh. Nếu đổi giọng thì đổi cho mọi tập; mẫu A/B ở [`voice-tests/`](voice-tests/) | checklist + A/B |
| Nhân vật không lời có tiếng đặc trưng riêng (Flutter "Mmm!", Chirp gáy, Waggle vo ve…) | `SOUND.md` |
| Nhân vật mới: thử A/B nhiều giọng, chọn giọng qua cả hai Whisper và cách các giọng khác ≥ 3 nửa cung | Treatment (ghi chú sản xuất) |

## 8. Chuẩn 11/2026b: chuẩn sản xuất mới và Musical Storytelling

Áp dụng cho tập có `STANDARD = '2026-11b'` (Short từ SHORT-016, video dài từ LONG-002). Nguồn: [`Task.md`](../Task.md) ngày 17/11/2026. Đo bằng [`qa_musical.py`](qa_musical.py) (nhóm "8a–8d Chuẩn mới" của `qa.py`). Mục ghi *(hiệu chỉnh)* đang ở mức tối đa CẢNH BÁO cho tới khi có số liệu của vài tập thật.

**Công cụ** (đều chỉ bật khi tập dùng tới; tập cũ dựng lại khớp từng byte):

| Công cụ | Làm gì |
|---|---|
| [`song.js`](song.js) | Bài hát của tập: giọng (trưởng), các phần (BPM ≥ 108, vòng hợp âm), motif; bản nhạc từng câu hát → nốt và thời gian (`resolveLines`); phụ đề ≤ 7 từ có từ nhấn, chữ hiện theo lúc hát (`cardsOf`) |
| [`sing.py`](sing.py) | Hát bằng chính giọng TTS của nhân vật (PSOLA của Praat qua `praat-parselmouth`): sing-talk, half-sing, sing |
| [`tools/asr_sung.py`](tools/asr_sung.py) | Lời hát còn nghe rõ: WER ≤ 0,15 (điệp khúc, sing-talk, half-sing) / 0,25 (sing), mọi từ khoá nghe đúng |
| [`audio/groove.py`](audio/groove.py) `song=` | Nhạc nền theo bài hát: cảnh có câu hát dùng hợp âm và lưới phách của bài (`chords='song'`), `G.motif` đặt giai điệu đặc trưng |
| [`episode.js`](episode.js) | `hookStack(…, 'mid' / 'center' / 'wide')` đặt chữ móc ở giữa phía trên; `subtitleEm` (tự gọi khi tấm có `em`); bộ ghi `CAM`, `HOOK` cho `safezone.mjs` |
| [`tools/soundplan.py`](tools/soundplan.py) | `SOUND-PLAN.md` thêm Music Timeline (có cột Vocal Style), Sing-along Dialogue, SFX Timeline, AI Music Generation Prompts (tiếng Anh), Final Audio Checklist |
| [`template/`](template/), [`TREATMENT-TEMPLATE.md`](TREATMENT-TEMPLATE.md) | Khung của tập mới: `timeline.js`, `tools/lines.mjs`, `build.sh`, `mix.py` mẫu; treatment đủ 10 đầu ra và A–F |

### 8.1 Hình: hook, nhịp đổi hình, giải thích không đứng hình

| Quy tắc | Kiểm |
|---|---|
| **6 nhịp kể chuyện** khai báo trong `BEATS`: Hook → Setup → Discovery → Surprise → Payoff → CTA, đúng thứ tự; hook ≤ 3 s. Video dài: cả video theo 6 nhịp, mỗi chương có mở, khám phá, kết | `qa_musical.py` |
| **Chữ móc to, ở giữa hoặc giữa phía trên**, không sát mép trên / dưới, không che mặt: Short khung chữ trong y 380–1150, tâm y 560–1000 (`hookStack('mid')` cho khoảng 490–910); video dài tâm y 380–620. Trong 3 s đầu mặt nhân vật đứng dưới chữ (y 1000–1350) và không có phụ đề | `qa_musical.py` (khung chữ ở t = 0) |
| **Mỗi 2–4 s một thay đổi đáng chú ý** (góc máy, zoom, lia, cận cảnh, biểu cảm, hành động, thông tin), có mục đích: danh sách `SHOTS` (t, kind, why), khoảng ≤ 4 s (video dài ≤ 5 s), không cắt vụn (> 30 % khoảng < 1,2 s là CẢNH BÁO) | `qa_musical.py` |
| *(hiệu chỉnh)* **Nhịp đổi hình đo được** ≤ 4 s (video dài ≤ 5 s): zoom ≥ 5 % hoặc lia ≥ 45 px trong 0,6 s, cắt cảnh, kính hiện / đổi cỡ / phóng trong kính (`loupe(…, { mag, pan })`), đổi biểu cảm, hành động lớn; ≥ 80 % cú trong `SHOTS` đo thấy | `qa_musical.py` (safezone `--step 0.1` + khung hình) |
| **Đoạn giải thích không đứng hình**: câu ≥ 2,5 s phải có ít nhất một thay đổi hình hoặc chuyển động liên tục. Mục cũ "Hình gần đứng yên kéo dài" (§2) thành CHƯA ĐẠT | `qa_musical.py`, `qa.py` |
| **Độ dài**: bản B 15–25 s, tập A ≤ 48 s (lời hát dài hơn lời nói; `lines.mjs` in quỹ thời gian và dừng nếu vượt) | `qa_musical.py`, `lines.mjs` |

### 8.2 Chữ, phụ đề, CTA

| Quy tắc | Kiểm |
|---|---|
| **Phụ đề 3–7 từ mỗi cụm** (`cardsOf(…, { max: 7 })`): mỗi tấm thuộc một câu (không gộp lời hai người); 1–2 từ chỉ khi là thán từ (Wow!, Oops!…). Tấm cắt nhỏ giữ ≥ 1,2 s (ngoại lệ của mức 1,8 s ở DIRECTOR.md §7, vì chữ hiện theo từng từ) | `qa_musical.py` (cards.json) |
| **Nhấn từ khoá** bằng màu và cỡ (`em` của câu → `subtitleEm`: 64 px, `C.berry`): ≥ 50 % số tấm, từ khoá của bí mật (`SECRET.kw`) được nhấn ít nhất một lần. Giữ font, màu, kiểu tấm của kênh | `qa_musical.py` |
| **Không lặp chữ thừa**: không hai tấm liền nhau giống nhau (trừ điệp khúc); không phụ đề khi chữ móc đang trên hình (`hide`) | `qa_musical.py` |
| **CTA cụ thể, ngắn, tự nhiên** (`cta: true`): trong 4 s cuối (video dài 10 s), ≤ 2 s (video dài ≤ 3 s), là câu hỏi cho trẻ trả lời to hoặc một việc làm thật ("Listen for…", "Count…", "Watch again: find…"), có từ khoá của bí mật. **Made for Kids: không comment / subscribe / like / share / bell** (CLAUDE.md) | `qa_musical.py` (CHƯA ĐẠT nếu có các từ đó) |
| `TREATMENT.md` đủ các mục của [`TREATMENT-TEMPLATE.md`](TREATMENT-TEMPLATE.md) | `qa_musical.py` |

### 8.3 Bài hát và lời hát

| Quy tắc | Kiểm |
|---|---|
| **60–80 % số từ có nhịp hoặc giai điệu** (sing-talk, half-sing, sing), 20–40 % nói tự nhiên để tương phản và dễ hiểu. Video dài: hát trọn (`sing`) ≤ 30 % số từ; phần giải thích dài dùng nói hoặc sing-talk | `qa_musical.py` |
| **Chọn kiểu theo câu** (Task.md Musical §3): câu hỏi gây tò mò → half-sing, giai điệu cao, vui; câu khám phá → half-sing nhẹ, có nhịp; câu giải thích khoa học → sing-talk, rõ từ; câu bất ngờ → nhấn bằng giai điệu + tiếng hài; câu kết luận / điệp khúc → sing, dễ nhớ; câu cửa miệng, gag, CTA → nói (hoặc `CATCH_TUNE`) | Treatment (Sing-along Dialogue) |
| **Thật sự hát**: độ bám nốt (`lock` trong `voice/sung.json`): sing ≥ 0,6 · half-sing ≥ 0,45 · sing-talk ≥ 0,3 | `sing.py` (dừng build), `qa_musical.py` |
| **Lời hát nghe rõ**: WER ≤ 0,15 (điệp khúc, sing-talk, half-sing) / 0,25 (sing), mọi từ khoá nghe đúng; không hát quá nhanh, không kéo dài từ khó hiểu (sing.py giới hạn độ kéo: sing ≤ 3×). Rớt thì hạ kiểu hát của câu, đổi `sing.speed` hoặc đổi lời | `asr_sung.py` (dừng build) |
| **Giọng nhất quán**: câu hát nằm quanh `home` của giọng ± 2 nửa cung (`song.js` kiểm khi giải, `qa_musical.py` đo trên bản hát); giọng trẻ em không dưới 240 Hz; cùng giọng TTS như khi nói | `song.js`, `qa_musical.py` |
| **Điệp khúc hát theo được**: ≥ 2 lần (video dài ≥ 3: mở đầu, cuối các chương, kết), cùng lời cùng nốt (`sing.chorus`), một lần trong 6 s cuối (video dài 30 s) nhắc lại trước CTA; mỗi lần ≤ 8 từ, ≤ 3,4 s. Lần lặp của điệp khúc không tính vào "Tốc độ lời" của §2 (không phải lời mới) | `qa_musical.py`, `qa.py` |
| **Giai điệu đặc trưng của tập** (`SONG.motif`): không trùng tập khác, dùng ≥ 2 lần (đặt bằng `G.motif` hoặc là câu mở của điệp khúc) | `qa_musical.py` |
| **Giọng trưởng, ≥ 108 BPM** ở mọi phần của bài (luôn vui tươi); nốt ở phách mạnh là nốt của hợp âm (sing, half-sing, điệp khúc); mỗi câu trải ≤ 9 nửa cung | `song.js` (dừng build) |

### 8.4 Âm thanh

| Quy tắc | Kiểm |
|---|---|
| *(hiệu chỉnh)* **Nhạc lùi dưới giọng**: nhạc ở dải 300–4000 Hz thấp hơn khoảng trống kề bên ≥ 8 dB dưới câu nói, 6–14 dB dưới câu hát (mẫu `mix.py`: `ve_m` lùi ít hơn dưới câu hát, `LEVEL` ≈ 0,8) | `qa_musical.py` |
| **Nhạc đổi theo từng cảnh và đi theo bài hát**: cảnh có câu hát dùng `chords='song'` và BPM của phần bài hát; dừng đột ngột, tăng / giảm tốc theo tình huống (các quy tắc SDP của §4 giữ nguyên) | `groove.py` (dừng build nếu sai), `qa.py` |
| **SFX khớp hành động, không lặp máy móc**: một loại tiếng không đánh dấu ≤ max(3, DUR/7) lần (video dài ≤ 3 lần / phút); chuỗi nhịp có chủ đích (Hop kéo chân theo phách, các tiếng tách) ghi `run: '<id>'` trong events, mỗi chuỗi ≤ 16 cue và ≤ 4 s, các chuỗi ≤ 40 % số cue; ≥ 10 loại tiếng (bản B) / 16 (tập A) / 20 (video dài) | `qa_musical.py` |
| **Bảng âm thanh của Task.md** (A–F): Music Direction viết tay trong `TREATMENT.md`; Music Timeline, Sing-along Dialogue, SFX Timeline, AI Music Generation Prompts sinh tự động vào `SOUND-PLAN.md` (không sửa tay); Final Audio Checklist điền tay | `soundplan.py`, checklist |

### 8.5 Checklist thủ công thêm (điền vào báo cáo giao)

- [ ] Nghe lại cả phim: nhạc sinh động, đổi theo cảnh; lời thoại có giai điệu; có đoạn dễ nhớ (điệp khúc, motif); giọng hát rõ, không bị nhạc lấn; SFX khớp hành động; âm nhạc tạo cảm xúc và giữ chân (Final Audio Checklist của Task.md)
- [ ] Giọng hát nghe như chính nhân vật (không "robot", không chuột chip), điệp khúc trẻ hát theo được ngay lần nghe thứ hai
- [ ] Xem ở cỡ điện thoại: chữ móc to, giữa phía trên, đọc được ngay; mỗi 2–4 s có thay đổi có mục đích, không chuyển cảnh máy móc
- [ ] CTA cụ thể, tự nhiên, không làm gián đoạn câu chuyện; không comment / subscribe (Made for Kids)
- [ ] Không có kiến thức nào bị đổi sai để vần hoặc để hát (đối chiếu `FACTS.md`)

### 8.6 Bảng hiệu chỉnh (11/2026b)

| Tập | Ngày | Kết quả | Ghi chú |
|---|---|---|---|
| `films/lab-musical` (bản thử từ SHORT-015, không đăng) | 17/11/2026 | 67 đạt · 4 cảnh báo · 0 chưa đạt ([báo cáo](../films/lab-musical/TREATMENT.md#báo-cáo)) | Nhịp đổi hình đo được: khoảng dài nhất 1,3 s; 14/15 cú của `SHOTS` đo thấy. Ngưỡng "cắt vụn" đổi từ < 1,2 s sang < 1 s (hook đúng chuẩn có 3 nhịp trong 3 s). Duck: tập cũ 14–16 dB dưới câu nói (SHORT-006…015), lab 7,9 dB dưới câu nói (câu nói cạnh chỗ khựng) và 11,6 dB dưới câu hát: giữ ngưỡng, còn hiệu chỉnh. Tốc độ lời: lần lặp của điệp khúc không tính là lời mới (53 → 45 từ, 1,88 từ/s). Motif: câu hát mở bằng đúng motif tính là một lần dùng |

## Hiệu chỉnh các mục đo mới (11/2026)

Ngưỡng các mục mới của `qa.py` được chọn sao cho trên 5 Short đầu, các mục này bắt đúng những gì [bản phân tích](../PHAN-TICH-SHORTS/README.md) đã thấy bằng mắt.

| Mục | 001 | 002 | 003 | 004 | 005 |
|---|---|---|---|---|---|
| Chuyển động 1–2,5 s (≥ 2,0) | 5,11 | 2,99 | **1,30** | 2,64 | **1,18** |
| Đoạn không lời > 4 s | **33,3–42,0** | — | — | **21,6–30,3; 32,0–38,0** | — |
| Hình gần đứng yên > 3 s | **41,8–47,8** (sổ) | **4,2–7,9** (kính) | **5,8–9,0** (kính); **16,4–22,8** (kết) | **29,0–35,0; 36,5–46,0** (sổ); **46,6–50,2** | **1,5–11,0** (móc nhẹ và kính) |
| Câu cửa miệng (≥ 2,0) | **0,27** | **0,57** | **1,21** | **0,29** | **0,63** |
| Cảnh sổ tập A (≤ 4,5 s) | **8,0 s** | — | — | **10,0 s** | — |
| Người nói vắng | **6 câu dẫn** của Loupe | **20,4 s** | **17,7; 19,3; 20,7 s** | **6,5 s** | — |
| Vùng giao diện | chữ móc trở lại ở thanh trên; phụ đề riêng, không đo được | phụ đề 19 s; chữ móc 1,2–2,8 s | phụ đề 20 s | phụ đề 28,5 s; **mặt Loupe 20,0–27,5 s** | phụ đề 21,5 s; **mặt Loupe 4,0–5,8 s** |
| Phụ đề che mặt | không đo được | — | — | **Loupe 9,5–10,0; 20,5–22,5 s** | — |

Không báo nhầm ở những đoạn bản phân tích đánh giá tốt:
- móc của 002;
- đoạn kính trượt dọc đường mùi của 004 (22–27 s);
- gag của 005.

LONG-001 không có mục mới nào bị CẢNH BÁO. Hai mục "hình gần đứng yên" và "câu cửa miệng" chưa hiệu chỉnh cho video dài nên chỉ đo ở Short.

**Giới hạn:**
- Đo chuyển động bằng độ khác trung bình giữa hai khung, nên một chuyển động nhỏ lặp lại vẫn tính là "có chuyển động". Ví dụ, kính đứng ở 9–13 s của SHORT-001 lọt qua vì có nhịp nháy ngắn; hạ ngưỡng để bắt nó thì sẽ báo nhầm ở chỗ khác. Vì vậy vẫn phải soi khung tĩnh.
- Vùng giao diện là ước lượng, khác theo máy và phiên bản ứng dụng YouTube.
- "Người nói có trên hình" chỉ nhận ra mặt nhân vật vẽ bằng rig dùng chung (`drawChar`).
- Sau khi đăng, đối chiếu với biểu đồ giữ chân thật rồi chỉnh ngưỡng ([kế hoạch nâng cấp, mục 9](../PHAN-TICH-SHORTS/KE-HOACH-NANG-CAP.md#9-đo-sau-khi-đăng)).

### Hiệu chỉnh nhóm "Sound Design Plan" (11/2026)

Trước lượt này (nhạc dựng bằng lớp nhịp cũ), cả 7 Short đều chạy 120 BPM suốt phim, nên mục "BPM đổi theo nội dung" không đạt ở mọi tập, và một nhạc cụ hát chính thường giữ 3–5 cảnh (sáo ở SHORT-007: 5/12 cảnh; glockenspiel ở SHORT-004: 9/16). Hai mục tiếng động mới đã đạt sẵn ở cả 7 tập (dày nhất 5–8 cue / 1 s sau móc; lời hơn riêng tiếng động 11,6–22,1 dB), nên chúng chỉ chặn việc thêm tiếng động quá tay ở các tập sau. Tiếng động dùng nhiễu ngẫu nhiên, nên số đo lời / tiếng động lệch khoảng ±1 dB mỗi lần dựng lại; ngưỡng 11 dB chừa phần đó.

## Checklist thủ công (điền vào báo cáo giao)

- [ ] 0–1 s gây chú ý · 1–2 s nhân vật phản ứng · 2–3 s câu hỏi hoặc bí ẩn chưa giải
- [ ] Mỗi 3–5 s có chuyện mới; không có cảnh nào kéo dài mà không có lý do
- [ ] Có ít nhất một gag hoặc bất ngờ; nhân vật đúng tính cách
- [ ] Nội dung đúng `FACTS.md`, phù hợp 4–8 tuổi, không đáng sợ
- [ ] Có thông điệp hoặc bài học nhỏ thấy được
- [ ] Biểu cảm đọc được ở cỡ điện thoại; không che, không cắt mép, không lơ lửng
- [ ] *(Vui tươi)* Xem lướt cả phim: mọi mặt nhân vật đều vui (kể cả lúc giật mình, va chạm, gag); nhạc nghe tươi từ đầu đến cuối, không đoạn nào chậm, buồn hay hồi hộp
- [ ] Nhạc đổi theo cảnh, khớp hành động; màu nhạc khác các tập trước
- [ ] *(Kênh)* Nghe tập này ngay sau tập đăng trước: điệu riêng nghe ra ngay; cảnh sổ, gag và cao trào không nghe như của tập trước; nhạc vui, phần lớn ở giọng trưởng
- [ ] Nghe lại cả phim: mỗi cảnh nhạc nghe ra khác cảnh trước; dưới lời vẫn còn nhịp; có câu đáp giữa các câu; không đoạn nào nghe như một vòng lặp đều
- [ ] *(SDP)* Đọc `SOUND-PLAN.md`: phong cách, nhạc cụ và BPM của từng cảnh hợp với hành động và cảm xúc; mở đầu, diễn biến, cao trào, kết nghe khác nhau; chỗ đổi tốc độ không bị giật (có cầu nối); không cảnh nào nghe như cảnh khác chỉ đổi tốc độ; nhạc không lời (tập 11/2026b: chỉ nhân vật hát), vui, không buồn hay đáng sợ
- [ ] Kết có điểm nhấn và nối về đầu (vòng lặp hoặc câu cuối)
- [ ] Không kêu gọi bình luận hay đăng ký (Made for Kids); câu hỏi kết là câu trẻ trả lời to
- [ ] Tựa móc nảy ở khung đầu có tiếng; nhân vật phản ứng bất ngờ trong 1 s
- [ ] Chuyển cảnh kính → sổ có chuyển động nối (chụp sticker, match cut), không iris trơn
- [ ] Cảnh cuối gợi lại câu móc (chữ móc trở lại / âm thanh mở đầu); không màn hình trống
- [ ] Mỗi nhân vật có lời một giọng riêng; giọng trẻ em cho nhân vật trẻ em
- [ ] *(11/2026)* Khoảnh khắc bí mật to (kính r ≥ 300 px hoặc cận toàn khung) và bí mật "xảy ra" thành chuyển động; kính không đứng quá 3 s
- [ ] *(11/2026)* "Six legs? In you go!" nói trong lúc có hành động; tập A: cảnh sổ ≤ 4,5 s, có vòng mở "1 2 3"
- [ ] *(11/2026)* Người nói có trên hình; đạo cụ của gag đã gài trước; nghĩa ẩn dụ được nói rõ
- [ ] *(11/2026)* Phụ đề, chữ và mặt nhân vật ngoài vùng giao diện Shorts (`safesheet.py`); phụ đề không che mặt; chữ có viền hoặc nền đặc; nền tương phản với nhân vật chính
