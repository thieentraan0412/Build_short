# SHORT-016 · Where Do Bugs Go When It Snows? ❄️ — Treatment (chuẩn 11/2026b)

> Khung: [`_shared/TREATMENT-TEMPLATE.md`](../../_shared/TREATMENT-TEMPLATE.md). Quy tắc và ngưỡng: [`QUALITY.md`](../../_shared/QUALITY.md) §1–§8. Mã của tập chép từ [`_shared/template/`](../../_shared/template/).

**Tựa đăng YouTube:** *Where Do Bugs Go When It Snows? ❄️ | Big Secrets of Tiny Bugs* · **Loại:** tập A, đặc biệt mùa đông (48,0 s) · **Ngày đăng:** Thứ Hai 21/12/2026
**Căn cứ:** đề cương ([`DE-CUONG-CAC-BO.md`](../../DE-CUONG-CAC-BO.md), SHORT-016), dữ kiện và nguồn [`FACTS.md`](FACTS.md), LONG-001 Ch.5 (ong và bọ rùa mùa đông: không lặp dàn cảnh, chỉ học kỹ thuật vẽ).
**Made for Kids:** không kêu gọi bình luận, đăng ký, like, share trong phim.

## 1. Đánh giá ý tưởng

- **Bí mật khoa học** (đúng phạm vi nguồn): tuyết rơi thì mỗi loài một cách: ong mật **túm lại** thành quả bóng ấm trong tổ (một số con, "heater bees", rung cơ bay để tạo nhiệt); bướm vua **miền đông Bắc Mỹ** **bay đi** tận Mexico; **một số** loài bọ rùa **trốn** dưới lá ngủ thành đám.
- **Vì sao trẻ 4–8 tuổi tò mò:** trẻ thấy tuyết thì côn trùng "biến mất"; câu hỏi "chúng đi đâu?" là câu trẻ tự hỏi. Ba câu trả lời khác nhau, dễ nhớ thành ba động từ: *huddle, fly away, hide*.
- **Khoảnh khắc wow:** (1) Miss Loupe vặn vành kính, cả mặt kính đổi sang "kính ấm": tổ ong lạnh tím, giữa tổ một quả bóng rực cam; lao sâu thấy Waggle rung ngực, mỗi nhịp toả một vòng hơi ấm (kính r 330 px, cận cảnh toàn mặt kính). (2) Bản đồ: đàn bướm vua bay theo đường chấm xuống Mexico, cả cánh rừng linh sam hoá cam ("MILLIONS!").
- **Không trùng** các tập trước: lần đầu có tuyết, ong mật, bướm vua và bọ rùa ở Short; Dot ra mắt kênh. Gag mới (chiếc lá làm chăn). Điệu riêng mới `sleigh` (xe trượt tuyết). Bài hát mới ở Đô trưởng, motif mới.
- **Ba cấu trúc đã cân nhắc:**

| Cấu trúc | Ưu | Nhược |
|---|---|---|
| A. Một con bọ, một bí mật (chỉ quả bóng ong, như SHORT-017) | Gọn, sâu | Trùng SHORT-017 (ong run người giữ ấm); không trả lời được câu "bugs" số nhiều |
| B. Ba bí mật = ba câu trả lời của một điệp khúc ("Huddle, fly away, or hide!"), ô sticker "1 2 3" lấp dần | Câu hỏi móc có ba đáp án thấy được; điệp khúc tóm cả tập; vòng mở "1 2 3" tự nhiên | Dài: phải giữ mỗi bí mật ≤ 9 s |
| C. Đi dạo vườn tuyết, gặp từng bạn trong lúc tuyết rơi, kết bằng tiệc mùa xuân | Ấm áp | Bí mật bị chia vụn, không có cao trào; "mùa xuân" vượt phạm vi |

  **Chọn B**: đúng câu hỏi số nhiều của tựa, ba từ khoá của điệp khúc chính là ba ô sticker, trẻ hát được câu trả lời.
- **Rủi ro và cách xử lý:** kính nhiệt có thể tối → giữ tím sáng (`coldB`), quả bóng cam vàng tương phản mạnh; Dot nhỏ (9 % chiều cao Miss Loupe) → trong kính và ở gag máy đẩy gần (Dot ≥ 200 px); bản đồ dễ thành "bài địa lý" → chỉ hai nhãn, một biển "up to 3,000 miles!", đàn bướm bay liên tục; chữ "Huddle," đầu câu bị Whisper nghe thành "Cuddle" → TTS đọc "Huddle!" (`say`), lời và phụ đề giữ nguyên.

## 2. Hook tối ưu (0–3 s)

| Nhịp | Hình | Lời / chữ | Tiếng |
|---|---|---|---|
| 0–1 s gây chú ý | Bông tuyết lớn (rơi từ cuối phim) đậu trúng kính, Miss Loupe rùng mình ôm người, khăn xanh; Albie run cầm cập | Chữ móc **BUGS IN / SNOW?!** (2 dòng, 3 từ) nảy ở giữa phía trên (`hookStack('mid')`) | chuông xe trượt + hợp âm Đô từ giây 0, "ting" bông tuyết, "brrr" lập cập, pop chữ |
| 1–2 s nhân vật phản ứng | Miss Loupe ngó trái, ngó phải bằng kính: vườn vắng tanh, không một con bọ | ♪ *"Where do bugs go when it snows?"* (half-sing, đi lên, treo ở nốt dẫn) | swish trái, swish phải, celesta lên / xuống |
| 2–3 s bí ẩn chưa giải | Hai dấu hỏi trên Miss Loupe và Albie; ba ô sticker trống "1 2 3"; chấm cam của Dot ló cạnh chiếc lá (trứng phục sinh) | — | "huh?" + ba tiếng pop của ô |

Mặt hai nhân vật đứng dưới chữ móc (y ≈ 1 200–1 280); không có phụ đề khi chữ móc trên hình.

## 3. Kịch bản hoàn chỉnh (6 nhịp)

| Nhịp | Thời gian | Chuyện xảy ra | Lời (ai nói / hát) |
|---|---|---|---|
| Hook | 0–2,55 s | Bông tuyết trúng kính, rùng mình, ngó quanh: vườn vắng | Loupe ♪ "Where do bugs go when it snows?" |
| Setup | 2,55–5,2 s | Ô "1 2 3"; logo lao vào kính; kính lớn trên tổ ong phủ tuyết, lặng im | Loupe ♪ "Let's zoom in!" |
| Discovery | 5,2–38,2 s | (1) Kính ấm: quả bóng ong, Waggle rung ngực → sticker 1. (2) Albie hỏi; "Nope!"; bản đồ: bướm vua bay về Mexico, rừng hoá cam → sticker 2. Điệp khúc 1. (3) Nhấc lá: đám bọ rùa ngủ, Dot đếm, ngáp, chui lại → sticker 3. Sổ: "Six legs? In you go!" | Loupe ♪ "Look! A warm ball of bees!" · ♪ "Wow! Some bees shake their wing muscles!" · Albie "Do all butterflies stay?" · Loupe ♪ "Nope!" · ♪ "These monarchs fly all the way to Mexico!" · ♪ "Huddle, fly away, or hide!" · ♪ "Who is hiding under here?" · Dot "One, two, three... so many!" · Loupe ♪ "Some ladybugs nap together under leaves!" · Albie "Six legs? In you go!" |
| Surprise | 38,2–42,1 s | Dot chui ra, vươn vai: hỏi mùa xuân chưa; "Nope!"; Dot kéo chiếc lá trùm lên, FWUMP, tuyết bung, chỉ còn chấm cam | Dot "Is it spring yet?" · Loupe "Nope!" |
| Payoff | 42,1–45,35 s | Điệp khúc lần 2, ba sticker bật lên theo từng từ khoá | Loupe ♪ "Huddle, fly away, or hide!" |
| CTA | 45,35–48 s | Hai bạn ôm nhau cho ấm; chữ móc trở lại; bông tuyết lớn rơi về khung đầu | Loupe "Can YOU huddle like a bee?" |

Khai báo trong `BEATS` của `timeline.js`. **Thông điệp:** mỗi con bọ có một cách qua mùa đông; trẻ cũng "huddle" được cho ấm như đàn ong.

## 4. Storyboard chi tiết theo timeline

Khớp với `SHOTS` trong `timeline.js` (25 cú, khoảng dài nhất ≤ 4 s).

| # | Thời gian | Khung hình | Máy quay | Chuyện xảy ra | Vì sao (mục đích) |
|---|---|---|---|---|---|
| 1 | 0:00 | Trung, vườn tuyết | đẩy vào, rung nhẹ | bông tuyết trúng kính, rùng mình, chữ móc nảy | hành động ở khung 0 |
| 2 | 0:00,95 | Trung | kính lia trái rồi phải | ngó quanh: vườn vắng | phản ứng bằng hành động |
| 3 | 0:02,0 | Trung | đẩy nhẹ | hai dấu hỏi, ô "1 2 3" | bí ẩn chưa giải |
| 4 | 0:03,0 | Logo trong kính | lao vào kính | logo 0,8 s → kính lớn trên tổ ong | nhận diện kênh, vào thẳng bí mật 1 |
| 5 | 0:05,0 | Kính lớn | vặn vành kính | cả mặt kính đổi màu nhiệt | wow: quả bóng ong rực cam |
| 6 | 0:07,2 | Kính lớn | phóng trong kính | đẩy vào tâm quả bóng | "a warm ball" |
| 7 | 0:09,0 | Cận toàn mặt kính | lao sâu | Waggle rung ngực theo phách, vòng hơi ấm | bí mật xảy ra |
| 8 | 0:11,0 | Cận | lia trong kính | theo vòng hơi ấm | kính không đứng quá 3 s |
| 9 | 0:12,4 | Kính → sân khấu | lùi ra từ chính kính | sticker 1 bay lên ô; Albie vào khung | lấp ô 1 |
| 10 | 0:14,8 | Hai bạn | đẩy nhanh | "Nope!", dấu X | bất ngờ |
| 11 | 0:15,45 | Albie mở trang | lao vào trang | bản đồ hiện ra | chuyển cảnh có chuyển động nối |
| 12 | 0:16,6 | Bản đồ toàn khung | lia xuống theo đàn bướm | đường chấm, nhãn "EASTERN NORTH AMERICA", biển "up to 3,000 miles!" | theo chuyến bay |
| 13 | 0:18,7 | Bản đồ, rừng linh sam | đẩy vào, rung nhẹ | rừng hoá cam, "MILLIONS!" | wow thứ hai |
| 14 | 0:20,6 | Rộng, vườn tuyết | lùi ra | hai bạn nhảy, ô 1, 2 nảy, ô 3 "?" | điệp khúc 1 |
| 15 | 0:24,05 | Trung | lia sang đống lá | Miss Loupe nhảy sang | đúng chỗ chấm cam ló ra từ khung 0 |
| 16 | 0:26,85 | Kính lớn | lao vào kính | lá nhấc lên: đám bọ rùa | lộ bí mật 3 |
| 17 | 0:27,7 | Kính lớn | phóng trong kính | Dot bật dậy, số 1 2 3 | Dot ra mắt, đếm |
| 18 | 0:30,6 | Kính lớn | lia dọc đám bọ rùa | "nap together" | thấy cả đám |
| 19 | 0:32,7 | Kính lớn | đẩy nhẹ | Dot ngáp, chui lại | gài đạo cụ gag |
| 20 | 0:33,8 | Sticker → trang sổ | match cut | ba sticker trên trang | chuyển cảnh kính → sổ |
| 21 | 0:36,4 | Sổ | đẩy vào | Albie há miệng, đớp đúng "go!" | câu cửa miệng có hành động |
| 22 | 0:37,75 | Lật trang | — | về vườn tuyết, Dot chui ra | mở gag |
| 23 | 0:40,1 | Cận Miss Loupe + Dot | đẩy nhanh, rung | "Nope!", Dot kéo lá trùm lên, FWUMP | gag |
| 24 | 0:42,1 | Rộng | lùi ra | hai bạn nhảy, ba sticker bật lên | điệp khúc 2 |
| 25 | 0:45,35 | Trung → khung 0 | đẩy vào rồi về bố cục khung đầu | ôm nhau, chữ móc trở lại, bông tuyết rơi | CTA và vòng lặp |

**Không làm** (lỗi đã gặp ở SHORT-010…015): không có khung đứng quá 3 s; mọi câu giải thích đều có chuyển động (rung ngực theo phách, đàn bướm bay, Dot đếm).

## 5. Chuyển động và góc quay

- **Sân khấu vườn tuyết:** máy đặt Albie bên trái, Miss Loupe ở giữa phải, đống lá và hòn đá bên phải, tổ ong ở mép trái (đạo cụ của bí mật 1 có từ khung 0). Máy trôi chậm, đẩy ở điểm nhấn (móc, "Nope!", gag, CTA), rung ở bông tuyết trúng kính, rừng hoá cam, FWUMP.
- **Kính:** `loupe(…, { mag, pan })` để qa đo. Kính lớn r 330 ở (540, 760). Bí mật 1: phóng 1,45 → 2,7 → 6,5, lia theo vòng hơi ấm. Bí mật 3: phóng 2,3 → 3,1, lia dọc đám bọ rùa. Vào / ra kính bằng máy lao vào (hoặc lùi ra từ) chính kính của Miss Loupe trên sân khấu, kính đặt đúng chỗ kính lớn.
- **Bản đồ:** máy lia dọc đường bay theo con bướm dẫn đầu, rồi đẩy vào rừng linh sam (z 1 → 1,66).
- **Nhân vật:** luôn vui (`LOOK.cheer`). Miss Loupe: rùng mình ôm người (`HUG`), ngó trái phải bằng kính, lắc kính khi "Nope!", nhún nhảy theo phách điệp khúc, ôm người ở CTA. Albie: run cầm cập, nhảy, mở trang, nhảy theo điệp khúc, ôm Miss Loupe. Dot: bật dậy, đếm (giơ chân), ngáp (giơ hai chân), vươn vai, lặn xuống. Waggle: đứng yên trong quả bóng, ngực rung theo phách, cánh khép.
- **Biểu cảm theo kiểu hát:** hát trọn → excited; nửa hát → happy; sing-talk / nói → explaining (`singExpr`).
- **Chuyển cảnh:** logo lao vào kính (`titleSting`); kính → sổ bằng chụp + match cut qua sticker; sổ → vườn bằng lật trang; sân khấu ↔ bản đồ bằng lao vào / gập về trang của Albie. Mỗi chuyển cảnh một tiếng riêng.

## 6. Text và phụ đề

- **Chữ trên hình:** chữ móc **BUGS IN / SNOW?!**; **WARM VIEW!** (lúc bật kính ấm), **HEATER BEES!** (thuật ngữ của nguồn, lúc Waggle rung ngực), nhãn bản đồ **EASTERN NORTH AMERICA**, **MEXICO**, biển **up to 3,000 miles!**, **MILLIONS!**, số **1 2 3** của Dot, **SO MANY!**; nhãn sticker **Huddle! · Fly away! · Hide!**.
- **Phụ đề:** `cardsOf(…, { max: 7 })`, mỗi tấm một câu, chữ hiện theo từng từ khi hát / nói; L07 tách ở chỗ tự nhiên ("These monarchs fly" / "all the way to Mexico!"). **Từ nhấn** (`em`, màu berry, cỡ 64): bugs, snows, zoom, warm, ball, bees, shake, wing, muscles, butterflies, monarchs, fly, Mexico, huddle, hide, hiding, many, ladybugs, nap, leaves, legs, spring, you, bee. Từ khoá của bí mật (`SECRET.kw`): huddle, fly, hide, bees, monarchs, ladybugs.
- **Vùng an toàn Shorts:** phụ đề ở `SAFE.subY`; chữ to trong y 300–1 300, x < 940; mặt nhân vật trên 1 250 px khi có phụ đề.

## 7. Voiceover (và Sing-along Dialogue)

Giọng giữ nguyên `voices.js`: Miss Loupe `af_heart` (home 56), Albie `bm_lewis`, Dot `bf_isabella` +3,5 nửa cung. **Chỉ Miss Loupe hát** (đã hát ở bản thử lab-musical); Dot và Albie nói, vì nhân vật hát lần đầu phải được chủ kênh nghe duyệt trước khi dựng hình (KE-HOACH §11.1). 68 % số từ có giai điệu (53/78).

| Câu | Ai | Lời | Kiểu | Giai điệu (`sing.notes`) | Điệp khúc | Nhấn | Ghi chú |
|---|---|---|---|---|---|---|---|
| L01 | Loupe | Where do bugs go when it snows? | half-sing | `3:.5 4:.5 5:.5 6:1 5:.5 4:.5 5:1.5` | | bugs, snows | câu hỏi: leo lên, hỏi lại ở Sol; GO, SNOWS ngân (lượt 3: 4 → 5 phách; lượt 4: giọng như SHORT-015) |
| L02 | Loupe | Let's zoom in! | half-sing | `CATCH_TUNE.zoom` (`4:.5 5:.5 6:1`) | | zoom | câu cửa miệng hát đúng giai điệu của kênh (lượt 4: Fa–Sol–La thay Sol–La–Đô) |
| L03 | Loupe | Look! A warm ball of bees! | half-sing | `1':1 r:.5 5:.5 6:1 5:.75 4:.25 3:1.25` | | warm, ball, bees | khám phá: reo lên rồi đi xuống nhẹ; liền hơi (`fill .85`); "BALL-of" chấm dôi (19/11/2026) |
| L04 | Loupe | Wow! Some bees shake their wing muscles! | sing-talk | `5:.5 r:.25 5:.5 3:.5 r:.25 5:.5 5:.5 6:.5 5:.5 2:1` | | bees, shake, muscles | giải thích: rõ từ; TTS chậm hơn (`speed .85`); liền hơi (`fill .75, hi 2`); thuật ngữ "HEATER BEES!" là chữ trên hình |
| L05 | Albie | Do all butterflies stay? | nói | | | butterflies | giọng trầm tương phản; lượt 3: `pace .9`, uốn ngữ điệu nhẹ (`emo_k .3`) |
| L06 | Loupe | Nope! | sing-talk | `CATCH_TUNE.nope` | | | "No-o-pe!" rơi xuống quãng năm, hài |
| L07 | Loupe | These monarchs fly all the way to Mexico! | half-sing | `5:.5 1':.5 1':.5 6:1 5:1 4:.5 5:1 4:.5 5:1 3:.5 3:1.5` | | monarchs, fly, Mexico | từ trên cao bay xuống như đường bay; FLY, ALL, WAY, MEX ngân (lượt 3: 7,5 → 8,5 phách; lượt 4: nốt ngân ở Sol / La) |
| L08 | Loupe | Huddle, fly away, or hide! | sing | `5:.75 5:.25 5:.5 6:.5 7:1 6:1 5:2` | snow ×1 | huddle, fly, hide | ba nốt đứng rồi leo lên Si, đáp về Sol (gần `home`) |
| L09 | Loupe | Who is hiding under here? | half-sing | `3:.5 4:.5 5:.5 6:1 5:.5 4:.5 5:1.5` | | hiding | câu hỏi tò mò: leo lên, hỏi lại ở Sol; hi-DING ngân (lượt 3: 4,5 → 5 phách; lượt 4: giọng như SHORT-015) |
| L10 | Dot | One, two, three... so many! | nói | | | many | Dot ra mắt: đếm to; lượt 3: `pace .8`, TTS đọc "One... two... three..." (mỗi số cách ~0,4 s), hình bật số theo mốc giọng |
| L11 | Loupe | Some ladybugs nap together under leaves! | sing-talk | `5:.5 3:.5 5:.5 5:1 1':1 6:.5 6:.5 5:1 5:.5 4:.5 3:1` | | ladybugs, nap, leaves | "NAP" nhảy lên; lady-BUGS, NAP, toge-THER, LEAVES ngân (lượt 3: 6,5 → 7,5 phách) |
| L12 | Albie | Six legs? In you go! | nói | | | legs | câu cửa miệng, tốc độ chuẩn; lượt 3: vào sớm 0,15 s (34,85 s) để chủ đề nhạc vừa khoảng trống trước khi lật trang |
| L13 | Dot | Is it spring yet? | nói | | | spring | gag; lượt 3: `pace .82`, ngái ngủ |
| L14 | Loupe | Nope! | nói | | | | gag, tương phản với lần hát; lượt 4: không uốn ngữ điệu |
| L15 | Loupe | Huddle, fly away, or hide! | sing | như L08 | snow ×2 | huddle, fly, hide | trước CTA, trẻ hát theo |
| L16 | Loupe | Can YOU huddle like a bee? | nói | | | you, huddle, bee | CTA 1,9 s (`pace .78`, ≤ 2 s); lượt 4: không uốn ngữ điệu |

## 8. SFX và nhạc nền

Phác theo cảnh (bảng đầy đủ ở A–E và `SOUND-PLAN.md`): bông tuyết "ting", rùng mình "brrr" (mõ lập cập), Albie sột soạt; ngó quanh: swish; kính ấm: tiếng click vặn vành + "vù" ấm đi lên + lách tách; Waggle rung ngực: mỗi phách một tiếng "brr" vo ve (chuỗi `run: 'shake'`); "Nope!": bonk; mở trang: giấy + swish; đàn bướm: "phập phập" (chuỗi `run: 'flight'`); rừng hoá cam: swell + pop + "ta-da"; Dot bật dậy: boing; đếm: blip + xylophone đi lên (chuỗi `run: 'dotcount'`); ngáp: còi trượt; lặn: giấy + còi xuống; sổ: chụp, match cut, dán, đớp; gag: vươn vai, còi trượt xuống, FWUMP + tuyết bung; ôm: wobble + lấp lánh; gió tuyết và bông tuyết rơi ở cuối. Nền: gió nhẹ dải trầm, tiếng tuyết lác đác ở chỗ không có lời.

## 9. CTA

*"Can YOU huddle like a bee?"* (45,35 s, 1,4 s): việc làm thật, trẻ tự ôm mình hoặc ôm người bên cạnh, gắn đúng bí mật 1; có từ khoá "huddle"; Miss Loupe và Albie làm mẫu (ôm nhau). Không comment / subscribe / like / share.

## 10. Checklist trước khi xuất bản

- [ ] `sh films/short-016/build.sh` chạy trọn; `qa.py` không còn CHƯA ĐẠT; mọi CẢNH BÁO đã sửa hoặc ghi lý do
- [ ] Checklist thủ công cuối [`QUALITY.md`](../../_shared/QUALITY.md) và §8.5
- [ ] Final Audio Checklist (mục F) đã nghe và điền
- [ ] Dữ kiện đúng `FACTS.md`; không nói quá nguồn, kể cả trong lời hát ("Some ladybugs", "These monarchs", "Heater bees")

## A. Music Direction

- **Phong cách tổng thể:** Cartoon Musical mùa đông + Funny Educational Song: bài hát vui, nảy, có chuông xe trượt tuyết, mỗi cảnh một màu nhạc khác.
- **Giọng (key):** Đô trưởng (giai điệu quanh bậc 5–6 nằm đúng `home` 56 của Miss Loupe) · **BPM** theo phần: móc 120 · kính ấm 112 · bản đồ 126 · điệp khúc 124 · bọ rùa 116 · sổ 128 (không có câu hát) · **Điệu riêng của tập** (`SIGNATURE`): `sleigh` (xe trượt tuyết: chuông xủng xẻng móc đơn, vó ngựa "lộc cộc" bằng mõ phách lẻ, bass gốc – năm, đệm chặn phách lẻ), dùng ở móc, điệp khúc 1, sổ, điệp khúc 2 (≈ 28 % thời lượng).
- **Nhạc cụ chính:** ukulele, xylophone, glockenspiel, vibraphone, celesta, đàn hạc, marimba, sáo, dàn dây spiccato, trống thép, kazoo, accordion, tuba, chuông xe trượt (mới, `band.sleighbell`).
- **Cảm xúc âm nhạc:** mở đầu tò mò, lạnh mà vui (chuông xe trượt) · diễn biến kỳ diệu → phiêu lưu (kính ấm, bản đồ) · cao trào choáng ngợp (rừng hoá cam, dàn dây + timpani + "ta-da") · kết ấm áp, hát theo (điệp khúc 2, ôm nhau).
- **Bài hát của tập** (`SONG`): 6 phần A 0 s 120 `C G7` · B 3,8 s 112 `C F C G7` · C 12,4 s 126 `F G7 C C` · D 21,0 s 124 `G7 C` · E 24,0 s 116 `C F G7 C` · F 42,2 s 124 `G7 C`. **Motif** `5:.75 5:.25 5:.5 6:.5 7:1` (sol sol sol la si) = câu mở điệp khúc; nhạc cụ chơi lại trên celesta lúc chụp sticker 3; là chủ đề của tập (`G.theme`). **Điệp khúc** "Huddle, fly away, or hide!" (sol sol sol la si la sol; 5 từ, 3,1 s) ×2: 20,9 s và 42,1 s (trước CTA).

## B. Music Timeline *(sinh tự động: `SOUND-PLAN.md`)*

| Thời gian | Cảnh | Background Music | Vocal Style | SFX |
|---|---|---|---|---|
| 0–3,0 | móc | xe trượt tuyết 120, ukulele + glockenspiel | half-sing | ting, brrr, swish |
| 3,0–3,8 | logo | nhạc hiệu | — | zoom, lấp lánh |
| 3,8–7,0 | kính ấm | rải lơ lửng 112, vibraphone + đàn hạc | half-sing | click, vù ấm |
| 7,0–12,4 | Waggle rung | shuffle 112, marimba + bass vo ve | sing-talk | brr theo phách |
| 12,4–15,45 | "Nope!" | nảy lệch phách 126, xylophone | nói / sing-talk | bonk |
| 15,45–18,35 | bản đồ | phiêu lưu 126, sáo + dây spiccato | half-sing | phập phập |
| 18,35–21,0 | rừng hoá cam | cao trào 126, dàn dây spiccato + piano + timpani | — | ta-da |
| 21,0–24,0 | điệp khúc 1 | xe trượt tuyết 124 | sing | lấp lánh |
| 24,0–27,0 | đống lá | ragtime nhẹ 116, đàn hạc + piano + mõ nhỏ | half-sing | boing, giấy |
| 27,0–33,8 | Dot đếm | pop nảy 116, pizzicato | nói / sing-talk | đếm, ngáp |
| 33,8–38,2 | sổ | xe trượt tuyết 128, accordion + tuba | nói | dán, đớp |
| 38,2–42,2 | gag | polka 116, kazoo · khựng | nói | còi trượt, FWUMP |
| 42,2–45,3 | điệp khúc 2 | xe trượt tuyết 124 (reprise) | sing | lấp lánh |
| 45,3–48 | CTA | ukulele nắng 120, trống thép | nói | ôm, gió tuyết |

## C. Sing-along Dialogue

Bản phác ở mục 7; bản cuối *(sinh tự động)* trong `SOUND-PLAN.md`. **Nhịp điệu và cách nhấn từ:** điệp khúc "HUD-dle, fly a-WAY, or HIDE!" — "Hud" ở phách 1 (Sol trên G7), "way" ở phách 3 (Si), "hide" ở phách 1 ô sau (Sol trên C), giữ hai phách cho trẻ kịp hát theo. Câu hỏi (L01, L09) kết ở nốt cao, câu giải thích (L04, L11) bám nhịp lời nói, nốt đứng nhiều.

## D. AI Music Generation Prompts *(sinh tự động: `SOUND-PLAN.md`)*

Prompt tiếng Anh cho từng đoạn sinh từ đúng thông số của cảnh trong `mix.py`. Chỉ để tham khảo: nhạc trong phim tổng hợp bằng code, giọng hát là giọng TTS của Miss Loupe.

## E. Sound Effects Timeline *(sinh tự động: `SOUND-PLAN.md`)*

Phác: 0,02 ting · 0,05 brrr · 0,95 / 1,4 swish · 2,0 huh · 3,0 zoom/logo · 5,0 click · 5,25 vù ấm · 9,0 lao sâu · 9,66–11,8 brr ×9 mỗi nửa phách (chuỗi) · 11,98 chụp · 14,8 bonk · 15,45 giấy · 16,2–19,1 phập phập ×7 (chuỗi) · 18,7 ta-da · 21,0 lấp lánh · 24,05 boing · 27,0 giấy · 27,45 boing · 27,65–28,62 đếm ×3 (chuỗi) · 32,7 ngáp · 33,7 chụp · 34,6 dán · 36,95 đớp · 37,75 lật trang · 40,15 bonk · 40,55 còi trượt · 40,9 FWUMP · 41,25 cười · 42,2 lấp lánh · 45,4 ôm · 46,75 chữ móc · 46,6–48 gió tuyết. Bảng đầy đủ từ `events.json`.

## F. Final Audio Checklist

- [ ] Nhạc có sinh động không? · [ ] Có thay đổi theo cảnh không? · [ ] Lời thoại có giai điệu không?
- [ ] Có đoạn nhạc dễ nhớ không? · [ ] Giọng hát có rõ không? · [ ] Nhạc nền có lấn át giọng không?
- [ ] SFX có khớp hành động không? · [ ] Âm nhạc có tạo cảm xúc và giữ chân người xem không?

## Ghi chú sản xuất · Báo cáo giao

- **Lệch đề cương có chủ đích:** đề cương ghi Flutter (không lời) trong cảnh "Do all butterflies stay in the snow?". Flutter không phải bướm vua (bible: tím đậm + cam), nên cho Flutter bay về Mexico là sai loài; tập dùng một đàn bướm vua vẽ riêng (cam, gân đen, chấm trắng) và không có Flutter. Câu hỏi của Albie rút còn "Do all butterflies stay?" (2,04 s) để vừa nhịp. Gag cục tuyết trên cành đổi thành Dot kéo chiếc lá trùm lên như chăn, để khung cuối khớp khung đầu khi phát vòng lặp.
- **Giọng:** "Huddle," đầu câu bị Whisper `small.en` nghe thành "Cuddle" (cả TTS tốc độ .8); "Huddle!" qua cả hai Whisper → `say: 'Huddle! Fly away, or hide!'`. Một lần dựng, điệp khúc lần 2 khi hát vẫn bị nghe "Cuddle" → điệp khúc `speed .85`, "Hud-" dài ¾ phách (motif đổi theo): lock 1,00, WER 0,00 cả hai lần. L04 "Heater bees shake…" khi hát bị nghe "Hear their bees", "Keter bees", "Wow, you derbies" qua ba lần sửa → đổi lời thành "Wow! Some bees shake their wing muscles!" (đúng phạm vi nguồn), thuật ngữ "HEATER BEES!" thành chữ to trên hình; "bees" cần đủ nửa phách + một nghỉ ¼ phách, nếu không bị dính vào "shake" (từ khoá thiếu).
- **Âm thanh:** điệu `sleigh` lúc đầu toàn nốt ngắn, để lỗ im 0,1 s giữa hai phách → bass, đệm và chuông ngân dài hơn. Cảnh "đống lá" dùng `twinkle` quá thưa dưới câu hát (lỗ im ở 25,1 s) → `stride`. Chủ đề nhạc (`G.theme`) không phát lần nào vì phim hát gần như liền, không có khoảng 1,6 s → chủ đề theo đúng nhịp móc đơn của điệp khúc, vừa khoảng ≈ 0,8 s. Bốn cảnh trùng công thức với SHORT-007/010/015 → đổi nhạc cụ hát chính (vibraphone, dàn dây, đàn hạc, trống thép). Điệp khúc kết ở Đô cao làm cao độ hát trung vị 246 Hz (lệch `home` 3 nửa cung) → kết ở Sol.
- **Hình:** kính lớn dời lên 60 px để mặt Miss Loupe không nằm dưới tấm phụ đề hai dòng; nền tuyết và trời rực hơn (độ rực 0,30 → 0,38); chữ trôi theo bản đồ không qua readcheck → nhãn đứng yên trên khung; Dot và đám bọ rùa to hơn trong kính và ở gag.
- **`_shared/` được thêm (không đổi tập cũ):** `band.sleighbell` (chuông xe trượt), điệu `sleigh` + bộ gõ `sleigh` trong `groove.py`, `SIGNATURE['sleigh'] = 'short-016'`.

### Giọng Miss Loupe như SHORT-015, không ai hát (Task.md 19/11/2026 lượt 6, QUALITY.md §8.3, §9.10)

Chủ kênh: "đưa lại giọng của kính lúp về giống SHORT-015, sửa lại quy tắc cho các short sau và video sau". Hai lượt trước (hạ nốt về cao độ nói, hát liền hơi) vẫn giữ cô hát, nên ngữ điệu bám nốt. Chủ kênh chọn: cô **nói hẳn** như SHORT-015, **không nhân vật nào hát**, bài hát nằm ở nhạc nền, lời đọc vào phách.

| Đo trên file giọng cuối (12 câu của Miss Loupe) | SHORT-015 | SHORT-016 khi hát | SHORT-016 nay |
|---|---|---|---|
| Cách tạo | `af_heart`, TTS gốc | `af_heart` + `sing.py` | **`af_heart`, TTS gốc** |
| Tốc độ | .765 / câu cửa miệng .9 | .765–.9 rồi kéo theo nốt | **.765 / .9** (L09 .684, L16 .702 cho ≤ 4 âm tiết/s) |
| Cao độ trung vị | 202 Hz | 196 Hz | **203 Hz** (+0,1 nửa cung) |
| Dải ngữ điệu | 7,9 nửa cung | 4,1–4,8 (hát), 7,5 (hát-nói) | **7,9 nửa cung** |
| Uốn ngữ điệu, vang, lọc | không | không | **không** |

- **Lời:** 10 câu trước đây hát nay là câu nói theo phách (`tune`). Lời giữ nguyên, nốt đầu của bản nhạc rơi đúng phách cũ nên hình và mốc hành động không dời. Bỏ dấu phẩy chèn thêm cho bộ hát ở L01 ("…go, when it snows?"). 68 % số từ đọc vào phách.
- **Nhạc:** điệp khúc "Huddle, fly away, or hide!" do nhạc cụ hát chính chơi giai điệu dưới câu (`groove.py`, `TUNE_G`) và ở các khoảng trống (`G.theme`); motif đặt 3 lần (celesta 33,9 s, nhạc cụ dưới L08 và L15).
- **Mix:**
  - Các mốc "nhạc dâng sau câu" (`LEVEL`) theo hết đoạn nhạc của câu (`endm`), không theo lúc lời hết (lời nói ngắn hơn ô của bài).
  - Nhạc dưới câu theo phách ≈ 0,8 (L03, L04, L07) và lùi nông hơn (dải lời .45). Kết quả: nhạc đệm dưới lời 10,3 → 7,1 dB.
  - Bỏ L01 +2 dB (dành cho nốt hát thấp).
- **Hình:** sticker ở điệp khúc 1 nảy theo mốc từ thật của giọng nói (`wordAt`). Điệu nhảy điệp khúc 2 chạy hết đoạn nhạc (`spanEnd`), không dừng khi lời hết. Tiếng "burrow" sớm 0,15 s vì Dot bắt đầu chui ở 33,0 s (trước đây L11 đang hát ở đó nên không lộ).
- **Kiểm (mới):** "Không ai bị biến thành giọng hát", "Lời đọc theo phách", "Giọng Miss Loupe như SHORT-015", "Điệp khúc nhắc lại, giai điệu ở nhạc nền" (`qa_musical.py`). `qa.py` "Nhạc đệm dưới lời" không tính 0,8 s nhạc hiệu logo là khoảng trống: 40 % năng lượng khoảng trống nằm ở đó (8,8 dB; bỏ logo 7,0 dB).
- **Kết quả:** `qa.py` **92 đạt · 2 cảnh báo · 0 chưa đạt**. `VOCAL-QC.md` **0 lỗi · 3 cần nghe**: L01, L04, L08 lời hơn nhạc 11,2 / 11,5 / 11,9 dB (ngưỡng 10; báo khi < 12). Đã thử +1 dB cho ba câu: "Nope!" L02 lệch −4,2 dB so với các câu khác của cô, nên bỏ.
- **Chờ chủ kênh nghe:** giọng cô đã đúng như SHORT-015 chưa; điệp khúc đọc trên giai điệu của nhạc cụ có dễ đọc theo không; L01, L04, L08 có bị nhạc lấn không.

### Giọng liền hơi, không ngập ngừng (Task.md 19/11/2026 lượt 5, QUALITY.md §9.9; thay bằng lượt 6 ở trên: không hát nữa)

Chủ kênh: "giọng nói của nhân vật bị ngập ngừng, không trơn tru". Đo trên file giọng cuối (khung 5 ms dưới đỉnh câu 35 dB): các câu hát im 10–31 % thời gian ở giữa các chữ, bản nói gốc của chính câu đó gần như liền. Câu nói chỉ ngắt ở dấu câu ("Six legs? / In you go!") và ở chỗ Dot đếm có chủ ý, nên giữ nguyên.

| Câu hát | Im giữa các chữ trước | Sau | Độ khớp nốt trước → sau | Whisper small.en / base.en (sau) |
|---|---|---|---|---|
| L01 "Where do bugs go…" | 0,27 s (11 %) | **0** | 0,97 → 0,96 | đúng / đúng |
| L02 "Let's zoom in!" | 0 | **0** | 0,80 → 1,00 | đúng / đúng |
| L03 "Look! A warm ball of bees!" | 0,51 s (19 %) | **0,07 s** (+ 0,33 s dấu nghỉ có chủ ý sau "Look!") | 0,98 → 0,98 | đúng / đúng |
| L04 "Wow! Some bees…" | 0,28 s (11 %) | **0,10 s** (sau "Wow!", có dấu nghỉ ¼ phách) | 0,77 → 0,78 | đúng / đúng |
| L06 "Nope!" | 0 | **0** | 0,49 → 0,33 (ngưỡng 0,3) | đúng / đúng |
| L07 "These monarchs fly…" | 0,58 s (18 %) | **0** | 0,89 → 0,97 | đúng / đúng |
| L08 / L15 điệp khúc | 0,28 s (10 %) | **0** | 1,00 → 0,99 | đúng / "Huddle" → "I'll" (như bản trước) |
| L09 "Who is hiding under here?" | 0,68 s (31 %) | **0** | 0,85 → 0,85 | đúng / đúng |
| L11 "Some ladybugs nap…" | 0,97 s (25 %) | **0** | 0,72 → 0,81 | đúng / đúng |

Đo trên `voice/<id>.wav` của bản dựng cuối, khung 5 ms dưới đỉnh câu 35 dB. "Nope!" bám nốt thấp hơn vì nay nguyên âm mới thật sự ngân sang nốt Đô thứ hai (trước đó gần như chỉ có nốt Sol); câu này là hát-nói, giữ 35 % ngữ điệu nói.

- **Cách sửa (dùng chung, `_shared/sing.py` VERSION 2):**
  - Hát liền hơi: cả câu kéo giãn một mạch, nguyên âm vào đúng phách, chỉ ngắt ở dấu nghỉ của bản nhạc.
  - Mốc âm tiết lấy từ Kokoro (`_shared/tools/phones.py`) thay cho mốc từ của Whisper.
  - Hạt giống cho PSOLA: dựng lại ra đúng bản đó.
- **Ba chỗ đổi nhịp trong bản nhạc** (cùng nốt, cùng tổng số phách, cùng thời điểm câu; nên hình, phụ đề, nhạc không lệch). Mục đích: từ phụ có nguyên âm rất ngắn không phải ngân 6–7×.
  - L03 "BALL-of" chấm dôi `5:.75 4:.25` (trước `5:.5 4:.5`). Nguyên âm của "of" Kokoro đọc chỉ 25 ms; ở ½ phách phải kéo 7,5× và Whisper nghe "ball of" thành "bottle of".
  - L07 "ALL-the WAY-to" chấm dôi `5:1.25 4:.25 5:1.25 4:.25` (trước `5:1 4:.5 5:1 4:.5`): kéo lớn nhất 7,2× → 4,4×.
  - L09 "HII-ding": ngân nguyên âm đôi của "hi" 1 phách, "-ding" ½ phách (trước "hi" ½, "-ding" 1): kéo lớn nhất 6,2× → 3,2×.
- **Mix:** giọng hát nay vang liền, nhạc bị lùi suốt câu: nhạc ở dải giọng tụt 8,5 dB khi có lời (> 8, `qa.py` "Nhạc đệm dưới lời"). 5,3 dB trong đó là của chính nhạc (đo khi tắt duck). Đã sửa: dưới câu hát dải lời lùi nông hơn (`mid_m` .66 → .45), L01 +1 dB (`VOX_TRIM`, vì nhạc móc dưới câu này to nhất phim). Kết quả: 7,9 dB · nhạc vẫn lùi 6,8 dB dưới câu hát (6–14), 8,9 dB dưới câu nói (≥ 8) · lời rõ thấp nhất 11,2 dB (L01).
- **Kết quả kiểm:** `qa.py` **91 đạt · 4 cảnh báo · 0 chưa đạt** (trước 89 · 6 · 0). `VOCAL-QC.md`: **0 lỗi · 7 cần nghe** (trước 12), phép đo mới "hát ngắt quãng trong cụm" không bắt câu nào.
- **Chờ chủ kênh nghe:** câu hát nay liền hơi, có trơn tai không; các nguyên âm ngắn được ngân dài ("-ther" của L11, "or" của điệp khúc) có bị rè / máy không; "Huddle" ở điệp khúc (base.en vẫn nghe sai như bản trước, small.en đúng).

### Giọng Miss Loupe trả lại như SHORT-015 (Task.md 18/11/2026 lượt 4, QUALITY.md §9.8)

Chủ kênh chọn: vẫn hát, nhưng giọng phải như SHORT-015.

Ba chỗ làm giọng Miss Loupe khác SHORT-015:
- **Cao độ:** câu hát treo ở Đô / Si cao, nên cao hơn giọng nói của cô 1–2,5 nửa cung.
- **Ngữ điệu:** hai câu nói bị `emote.py` uốn lên cao.
- **Xử lý trong mix:** thêm vang phòng và lọc cắt trên 8,5 kHz (đặt cho Dot nhưng áp cả Loupe).

| Đo (giọng `af_heart`, từng câu) | SHORT-015 (nói) | SHORT-016 trước | SHORT-016 sau |
|---|---|---|---|
| Cao độ trung vị của các câu | 202 Hz (187–213) | 216 Hz (196–245) | **197 Hz (194–224)** |
| L01 · L02 · L07 · L09 (hát) | | 220 · 230 · 219 · 220 Hz | **195 · 205 · 197 · 197 Hz** |
| L14 "Nope!" · L16 CTA (nói) | | 245 · 225 Hz, uốn ngữ điệu | **224 · 194 Hz**, ngữ điệu TTS gốc |
| Vang phòng / lọc 8,5 kHz | không / không | có / có | **không / không** (Dot, Albie giữ như cũ) |

- **Giai điệu:** nốt ngân của L01, L07, L09 về Sol / La, gần giọng nói của cô; nốt cao Đô chỉ còn ở âm tiết ngắn ("mon-archs").
- **Câu cửa miệng "Let's zoom in!"** (`CATCH_TUNE.zoom`, dùng chung) đổi Sol–La–Đô thành Fa–Sol–La: vẫn đi lên như ống kính mở. Các tập sau cũng hát như vậy.
- **Kiểm:** cả hai Whisper vẫn nghe đúng cả bốn câu; độ khớp nốt 0,80–0,96.
- **Đã thử và bỏ:** giữ nhiều ngữ điệu nói hơn khi hát (`alpha` .15 → .3). Dải cao độ gần như không đổi mà độ khớp nốt tụt (L07 0,89 → 0,70).
- **Mix:** L01 hát thấp lại thì nằm gần dải của nhạc móc, lời chỉ hơn nhạc 11,5 dB. Đã sửa:
  - giọng L01 +1 dB (`VOX_TRIM`);
  - nhạc lùi ít hơn dưới câu của Albie, Dot (vốn rõ hơn nhạc 18–30 dB), để nhạc đệm chung không tụt quá 8 dB.
  - Kết quả: lời L01 12,3 dB, nhạc đệm dưới lời 8,0 dB.

### Giọng chậm lại, hài hoà hơn (Task.md 18/11/2026 lượt 3, QUALITY.md §9.7)

Chủ kênh: "giọng đang nhanh". Phim vẫn 48 s; câu hát chậm lại bằng nốt dài hơn ở chỗ trống sẵn có (không hạ BPM), câu nói bằng `pace` riêng từng câu.

| Câu | Ai · kiểu | Trước | Sau | Cách làm |
|---|---|---|---|---|
| L01 | Loupe · nửa hát | 3,5 âm tiết/s (4 phách) | **2,8** (5 phách) | GO, SNOWS ngân; TTS đọc "…go, when it snows?" (trước đó chữ "it" bị mất hẳn khi hát) |
| L05 | Albie · nói | 3,1 | **2,9** | `pace .9`, vào sớm 0,15 s; uốn ngữ điệu nhẹ hơn (`emo_k .3`) |
| L07 | Loupe · nửa hát | 3,1 (7,5 phách) | **2,7** (8,5 phách) | FLY, ALL, WAY, MEX ngân; câu kết 0,5 s muộn hơn |
| L09 | Loupe · nửa hát | 3,0 (4,5 phách) | **2,7** (5 phách) | hi-DING ngân |
| L10 | Dot · nói | 4,2; các số cách nhau 0,22 s | **3,4**; các số cách nhau ~0,4 s | `pace .8`, TTS đọc "One... two... three..."; hình bật số 1-2-3 theo mốc giọng |
| L11 | Loupe · hát-nói | 3,3 (6,5 phách) | **2,8** (7,5 phách) | lady-BUGS, NAP, toge-THER, LEAVES ngân; nhạc cảnh sổ vào sau nốt cuối |
| L13 | Dot · nói | 3,9 | **2,9** | `pace .82` (ngái ngủ), vào sớm 0,35 s |
| L16 | Loupe · CTA | 4,2 (1,79 s) | **3,9** (1,91 s) | `pace .78`; CTA vẫn ≤ 2 s |

Câu nói đo trên đoạn có tiếng; câu hát đo theo bản nhạc. Giọng Dot có `pitch` +3,5 nửa cung, được nâng bằng cách đổi mẫu nên nhanh hơn `speed` khoảng 22 %. Vì vậy Dot cần `pace` thấp nhất.

**Hài hoà hơn:**
- Câu nửa hát `fill .85, glide .08`: âm tiết vang liền nhau hơn, luyến mềm hơn.
- Câu hát-nói `fill .75, glide .05, hi 2`; riêng L04 `fill .68`, vì ở `.75` base.en nghe "bees" thành "beads".
- Giọng có vang phòng nhỏ (gửi −18 dB, 0,6 s): đuôi câu không rơi về im tuyệt đối, giọng ngồi cùng không gian với nhạc.
- Nốt dài chỉ đặt vào âm tiết cuối từ: ngân "hi-", "la-", "un-" thì giữa từ im 0,3–0,45 s.

**Đã thử và bỏ:**
- Đọc nguồn chậm (`sing.speed .85`) cho câu nửa hát: Whisper nghe "monarchs fly" thành "men lie", "Who is" thành "Who was".
- Kéo nguyên âm tới 3×: cao độ kém chuẩn hơn (độ khớp nốt 0,91 → 0,78).

**Ăn theo:**
- Chủ đề nhạc mất chỗ sau "Mexico!" → `G.theme(…, first=False)`; L12 vào sớm 0,15 s, chủ đề vang trước khi lật trang. Mốc đếm chân và đớp của Albie đi theo L12.
- L07 dài hơn, nằm trên cao trào → giọng L07 +1,5 dB (`VOX_TRIM`), nhạc giữ nguyên.
- Số đếm của Dot đổi sang ba con bọ cách xa nhau, vì trước đó số 3 nằm sát số 1 (đọc thành "13").

**Chờ chủ kênh nghe:** tốc độ đã vừa tai chưa; L09 "hiding" và L11 "under" còn đứt 0,19 / 0,22 s giữa từ (có từ bản trước); vang phòng của giọng có vừa không.

### Âm thanh theo cảnh, 4 lớp (Task.md 18/11/2026 lượt 2, QUALITY.md §10)

Bảng 4 lớp từng cảnh: [`SOUND-PLAN.md`](SOUND-PLAN.md) mục "Thiết kế âm thanh theo cảnh (4 lớp)" (sinh tự động từ `out/scenes.json`).

| Số đo | Trước | Sau |
|---|---|---|
| LRA (ffmpeg ebur128) | 2,7 LU | **6,9 LU** |
| Cao trào – cảnh êm (độ to ngắn hạn) | +1,8 LU | **+4,4 LU** |
| Điểm chuyển động mạnh có tiếng (± 0,2 s, đo trên video) | 97 % (thiếu ở cuối logo) | **100 %**, không tiếng nào lệch > 0,15 s |
| Âm thanh môi trường | một lớp nhiễu trầm + "tink" lác đác | **4 lớp nền theo cảnh**, có ở 100 % số giây |
| Lời hơn nhạc + tiếng động (thấp nhất) | 11,6 dB | **12,1 dB** |
| Khoảng nghỉ L05 → L06 | 70 ms | 270 ms |
| Câu nói (dải cao độ p10–p90) | L05 8,6 · L10 5,8 · L12 8,2 · L13 5,6 · L14 6,4 · L16 8,4 nửa cung | 9,0 · 7,1 · 9,3 · 5,0 · 8,0 · 11,3; từ nhấn cao hơn cả câu 0,8–4,7 nửa cung |

- **Voice:** mỗi câu một `emo`. Sáu câu nói được `emote.py` uốn ngữ điệu: L05 curious, L10 excited, L12 proud, L13 curious, L14 playful, L16 happy. Whisper base và small vẫn nghe đúng cả sáu câu. Độ to theo cảm xúc và theo cảnh (giải thích nhẹ hơn, điệp khúc to hơn); nhấn từ khoá trong câu hát. "Sợ hãi" làm thành giật mình vui (luật luôn vui tươi); tập này không có câu giật mình.
- **Music:** mức năng lượng theo cảnh (hai cảnh kính êm, móc và điệp khúc mạnh, rừng hoá cam là cao trào). Rừng hoá cam có riser, chũm chọe, kèn chặn, timpani. Điệp khúc có vỗ tay phách 2–4. Thêm stinger: trombone "wah-wah" ở "Nope!", đàn hạc vuốt xuống khi Dot lặn.
- **SFX:** thêm 9 loại tiếng:
  - bước giẫm tuyết khi nhún nhảy ở hai điệp khúc;
  - nhảy tới ôm, nhảy về chỗ cũ (có tiếng đáp);
  - tiếng pop cho 6 chữ to và cho chữ cuối của logo;
  - ba sticker bật lên ở điệp khúc 2;
  - ô sticker nảy theo lời ở điệp khúc 1;
  - ong vo ve khi máy lao vào quả bóng;
  - gió vút theo đàn bướm và khi bản đồ gập lại;
  - tiếng máy xuyên qua mặt kính ở cuối logo.
- **Ambient:** vườn tuyết (gió lạnh có cơn, gió rít khẽ, chim mùa đông xa, tuyết lách tách) · trong tổ ong (rì rầm ấm) · trang sổ / bản đồ (phòng yên tĩnh, giấy) · sát đống lá (lá xào xạc, tuyết lách tách).
- **Chờ chủ kênh nghe:** cảm xúc của từng câu có hợp tình huống không; bước chân trên tuyết có khớp nhịp nhún không; cao trào rừng hoá cam có "đã" không.

### Vocal & Musical QC (Task.md 18/11/2026, QUALITY.md §9)

Đầu ra A–G ở [`VOCAL-QC.md`](VOCAL-QC.md) (sinh tự động). Kết quả: **0 lỗi đã xác nhận · 14 chỗ cần nghe** ở 6/16 câu. Đã sửa trong lượt này (chỉ tạo lại đúng các câu đó bằng `voice_regen.py`): L04 thêm nghỉ ¼ phách sau "Wow!"; L16 (CTA) đọc chậm 15 % (1,79 s); L10, L13 (Dot) tạo lại sau khi `voicefx.py` chặn đỉnh (hết quá tải); phụ đề câu nói chạy theo mốc từ thật (L05 lệch 0,55 s → khớp); hai "Nope!" cân về độ to chung của Miss Loupe; nhạc dưới L12 hạ thêm. Thử điệp khúc ở TTS 0,8: chính bản nói bị nghe "Suddle", `voice_regen.py` không gộp, giữ bản 0,85. **Chờ chủ kênh nghe** các dòng CẦN NGHE trong mục A (điệp khúc "Huddle", nốt lướt L07 / L09 / L11, nốt dài L07, phụ đề L12) và điền checklist G.

### Bảng `qa.py` (out/qa.json, 18/11/2026, sau Vocal QC)

**89 đạt · 6 cảnh báo · 0 chưa đạt** (sau lượt 4 "giọng Miss Loupe như SHORT-015"; nhóm "10 Âm thanh theo cảnh" đạt cả 5 mục; "Tốc độ giọng vừa tai trẻ" và "Giọng hát giữ chất giọng nhân vật" đạt). LRA 6,0 LU · cao trào – cảnh êm +3,8 LU · lời rõ thấp nhất 12,3 dB (L01) · −13,9 LUFS, đỉnh −2,7 dBFS. Năm cảnh báo của nhóm "9 Vocal QC" là các dòng CẦN NGHE (chưa nghe bằng tai): điệp khúc base.en ("huddle", từ thừa), nốt lướt L07 / L11, cao độ trôi trên nốt dài L07, đứt giữa từ L09 "hiding" / L11 "under" (phép đo mới, hiện tượng có từ bản trước); cảnh báo còn lại là "Chi tiết để tìm lại" (lý do bên dưới). Bảng dưới là lượt trước Vocal QC (77 đạt · 1 cảnh báo).

| Nhóm | Kết quả | Số đo chính |
|---|---|---|
| 1 Hook | 7/7 đạt | lời đầu 0,38 s; chuyển động giây đầu 4,6; 1–2,5 s 2,2; logo 0,8 s |
| 2 Giữ chân | 8/8 đạt | tốc độ lời 1,52 từ/s; câu cửa miệng có hành động 4,22; cảnh sổ 4,4 s |
| 3 Nội dung | 1/1 đạt | người nói có trên hình ở mọi câu sau 3 s |
| 4 Âm thanh | 17/17 đạt | −14,0 LUFS, −3,1 dBTP; lời rõ thấp nhất 11,6 dB (L08); nhạc đệm dưới lời tụt 7,2 dB, 2,3 nốt / giây lời; chủ đề 1 lần |
| 5 Hình ảnh | 7/7 đạt | không chạm vùng giao diện; phụ đề không che mặt; độ rực 0,38; mặt luôn vui |
| 6 Xem lại | 3/4 đạt | khung cuối – khung đầu chênh 2,2/255; CTA 45,4 s; chữ móc trở lại · **CẢNH BÁO: Chi tiết để tìm lại** (lý do bên dưới) |
| 7 Giọng | 3/3 đạt | Loupe 219 Hz, Albie 98 Hz, Dot 258 Hz |
| 8a–8d Chuẩn mới | 19/19 đạt | 6 nhịp; 25 cú máy, đo thấy 25/25, khoảng dài nhất 3,2 s; 68 % số từ có giai điệu; lock 0,49–1,00; WER 0,00 mọi câu hát; điệp khúc ×2; motif đặt 3 lần; duck 10,8 dB dưới câu nói, 6,6 dB dưới câu hát |
| Sound Design Plan | 12/12 đạt | 7 phong cách, 12 nhạc cụ chính, BPM 112–128; điệu riêng `sleigh` 28 % |

**Lý do của mục CẢNH BÁO "Chi tiết để tìm lại":** `qa.py` chỉ nhận Rollo hoặc Spindle. Tập có hai chi tiết để tìm lại: vòm lưng cam của Dot ló trên mép chiếc lá từ khung đầu (cô ở đó suốt phim), và người tuyết hình Miss Loupe quàng khăn trên đồi. Không đưa Rollo vào: bọ hung ngoài tuyết trái luật của kênh (films/long-001/FACTS.md, phần Rollo lăn quả cầu tuyết: côn trùng mùa hè chỉ có trong ký ức, theo TREATMENT §7 của LONG-001).

### Checklist thủ công (QUALITY.md, cuối file và §8.5)

Đã soi khung tĩnh và khung trích từ `short-016.mp4` (mỗi 2 s và các cú chuyển cảnh). Phần âm thanh chỉ kiểm bằng số đo; **chưa nghe bằng tai**, các mục cần nghe để trống cho chủ kênh.

- [x] 0–1 s gây chú ý · 1–2 s nhân vật phản ứng · 2–3 s câu hỏi / bí ẩn chưa giải
- [x] Mỗi 3–5 s có chuyện mới; không cảnh nào kéo dài không lý do
- [x] Có gag (chiếc lá làm chăn, "Is it spring yet?" — "Nope!"); nhân vật đúng tính cách (Dot đếm, Albie đớp sticker)
- [x] Nội dung đúng `FACTS.md`, phù hợp 4–8 tuổi, không đáng sợ
- [x] Thông điệp thấy được: mỗi con bọ một cách qua đông; trẻ "huddle" như đàn ong
- [x] Biểu cảm đọc được ở cỡ điện thoại; không che, không cắt mép, không lơ lửng
- [x] *(Vui tươi)* mặt nhân vật luôn vui (qa đo mọi khung) · [ ] nhạc nghe tươi từ đầu đến cuối (chưa nghe)
- [ ] Nhạc đổi theo cảnh, khớp hành động; màu nhạc khác các tập trước (số đo đạt; chưa nghe)
- [ ] *(Kênh)* nghe ngay sau tập đăng trước (chưa nghe)
- [ ] Nghe lại cả phim: mỗi cảnh nhạc khác cảnh trước, có câu đáp, không vòng lặp đều (chưa nghe)
- [ ] *(Đệm lời)* nghe một đoạn hội thoại dài: có đệm và bè phụ mà lời vẫn rõ (số đo đạt; chưa nghe)
- [ ] *(SDP)* đọc `SOUND-PLAN.md` và nghe đối chiếu (đã đọc; chưa nghe)
- [x] Kết có điểm nhấn và nối về đầu (khung cuối chênh 2,2/255)
- [x] Không kêu gọi bình luận / đăng ký; câu kết là việc trẻ làm được ngay
- [x] Tựa móc nảy ở khung đầu có tiếng; nhân vật phản ứng trong 1 s
- [x] Chuyển cảnh kính → sổ bằng chụp + match cut qua sticker
- [x] Cảnh cuối gợi lại câu móc (chữ móc trở lại)
- [x] Mỗi nhân vật có lời một giọng riêng; giọng trẻ em cho Dot (258 Hz)
- [x] *(11/2026)* khoảnh khắc bí mật to (kính r 330, cận toàn mặt kính) và "xảy ra" thành chuyển động; kính không đứng quá 3 s
- [x] *(11/2026)* "Six legs? In you go!" có hành động; cảnh sổ 4,4 s; vòng mở "1 2 3"
- [x] *(11/2026)* người nói có trên hình; đạo cụ gag (chiếc lá, Dot) gài từ khung đầu; ẩn dụ "warm ball" có hình
- [x] *(11/2026)* phụ đề, chữ, mặt ngoài vùng giao diện Shorts; chữ có viền hoặc nền đặc; nền tương phản
- [ ] §8.5 nghe lại cả phim (Final Audio Checklist) · [ ] giọng hát nghe như chính Miss Loupe, điệp khúc hát theo được (chưa nghe; số đo: lock 1,00, WER 0,00)
- [x] §8.5 chữ móc to, giữa phía trên; mỗi 2–4 s có thay đổi có mục đích
- [x] §8.5 CTA cụ thể, tự nhiên, không comment / subscribe
- [x] §8.5 không kiến thức nào bị đổi sai để vần ("Some bees", "These monarchs", "Some ladybugs")
