# SHORT-014 · Hearing With Your Tummy?! 👂 — Treatment

**Tựa đăng YouTube:** *Hearing With Your Tummy?! 👂 | Big Secrets of Tiny Bugs* (tiếng Việt tham khảo: *Nghe bằng bụng?!*)

**Thông số:**
- Bản **B** của tuần 6, lên sóng Thứ Tư 16/12/2026. Tập A cùng tuần là SHORT-013 (Hop ra mắt), bản B còn lại là SHORT-015.
- Short dọc 1080×1920, 30 fps, **22 giây**, lưới phim 4/4 ở 120 BPM (11 ô nhịp, mỗi ô 2 s). Đề cương ghi 20 s; khung bản B là 15–25 s. Như 006 và 008 (đề cương 20 s, dựng 22 s), hai giây thêm để lời giải đọc chậm 15 %, có nhịp "ồ" sau đáp án và tấm phụ đề không chồng nhau.
- Tiếng Anh cho lời, chữ trên hình và phụ đề. Khán giả 4–8 tuổi. Made for Kids: không kêu gọi bình luận hay đăng ký.

**Căn cứ:**
- Đề cương: [DE-CUONG-CAC-BO.md](../../DE-CUONG-CAC-BO.md), SHORT-014: Crumb áp tai vào bụng Hop, *"Could you hear with your tummy?"*; kính vào bên bụng: màng nghe; bụng Crumb sôi "ục ục", Hop giật mình nhảy vọt khỏi khung; vòng lặp: Hop đáp xuống đúng chỗ cũ.
- Khung bản B: [kế hoạch §4.3](../../KE-HOACH-PHAT-TRIEN-KENH.md) và [kế hoạch nâng cấp §4](../../PHAN-TICH-SHORTS/KE-HOACH-NANG-CAP.md#4-bản-b-2024-s).
- Bộ tiêu chí kênh: [`_shared/QUALITY.md`](../../_shared/QUALITY.md), gồm các mục *(11/2026)*, *(SDP)* và *(Kênh)*.
- Dữ kiện và nguồn: [FACTS.md](FACTS.md).

**Nhân vật.** Miss Loupe (lời), Crumb (lời), Albie (câu cửa miệng ở sổ), **Hop** (khách mời, không lời: tiếng khúc khích "xè-xè" và cú nảy "boing"). Hop vẽ bằng rig dùng chung [`_shared/characters/cast/hop.js`](../../_shared/characters/cast/hop.js), không sửa. Màng nhĩ của Hop được vẽ to hơn và "sống" hơn bằng `drawChar(..., extra)` (hàm `drumExtra` trong [props.js](props.js)): đúng chỗ màng nghe của rig, thêm vòng gợn, độ sáng và tâm màng nảy. Cả tập dùng phong cách nhân vật v2 "Kẹo Phẳng Viền" (`LOOK.v = 2`).

**Không trùng với SHORT-001, 013, 015.**
- 001 (dế Chirp, tai ở đầu gối) và 013 (Hop ra mắt: Chirp và Hop trông giống nhau, "Nope!" tai ở bụng, song tấu, gag bịt tai): tập này không có Chirp, không so tai đầu gối với tai bụng, không song tấu, không ai bịt tai.
- 015 (gai trên chân sau cọ cánh như vĩ cầm): tập này không soi chân sau, không kéo "vĩ cầm", không cho thấy hàng gai.
- **Góc riêng của 014: chính cái màng nhĩ phản ứng với âm thanh.** Khoảnh khắc wow là kính lớn r ≈ 322 px soi màng tròn bên bụng: vòng sóng âm bay tới, màng gợn và nảy theo từng vòng, rồi rung theo giọng nói và theo phách nhạc. Gag là cận cảnh toàn khung màng nhĩ rung mạnh vì tiếng bụng sôi.
- Bối cảnh mới: **khoảng trống bồ công anh lúc chiều vàng** (trời xanh hoa ngô, dải vàng ở chân trời, mặt trời thấp, bông bồ công anh và hạt bay), nhân vật đứng trên **một hòn đá phẳng màu oải hương**. Khác lá hoàng hôn của 009, bờ ao của 010, lá trời xanh của 006, vườn đêm của 007, trại đêm của 008.

## 1. Ba cấu trúc đã cân nhắc

| | Cấu trúc | Ưu | Nhược |
|---|---|---|---|
| A | **Đúng dàn ý đề cương, kính nhỏ:** Crumb áp tai, câu hỏi, kính vào bên bụng, gag bụng sôi, Hop nhảy khỏi khung, vòng lặp | Bám kế hoạch, ít việc dựng | Bí mật chỉ là một hình tĩnh trong kính (lỗi kính đứng của 002–005). Không thấy *vì sao* màng là tai. Gag không gắn với màng nhĩ, chỉ là cú nhảy |
| B | **Đố vui "tai ở đâu?":** ba ô đoán (đầu, chân, bụng), Hop bật lên ở ô đúng | Trẻ được đoán | Trùng nhịp "Nope!" và câu đố tai của 013 ra mắt hai ngày trước; câu móc chữ nhiều |
| C | **Màng nhĩ biết nghe:** khung 0 Crumb áp tai vào bụng Hop: *"Could you hear with your tummy?"*. Giọng Crumb làm bụng Hop gợn, Hop nhột khúc khích, nảy lên hất Crumb ra. Miss Loupe bật vào: *"Well, Hop can!"* Kính lớn lướt xuống bên bụng, màng nhĩ sáng lên (EAR!). Crumb khum tay *"Hello in there!"*: ba vòng sóng bay tới, màng gợn theo từng vòng (EARDRUM!). Sổ. Gag: Crumb nhìn vụn bánh (có từ khung 0), bụng sôi "ục ục", máy lao vào màng nhĩ đang rung mạnh, Hop giật mình vọt khỏi khung. *"Sorry! My tummy!"* Câu hỏi: *"Can YOUR tummy hear things?"* Hop rơi về đúng chỗ cũ, Crumb chạy lại áp tai | Móc bằng hành động và câu hỏi về chính trẻ. Bí mật "xảy ra" thành chuyển động: âm thanh làm màng rung. Gag dùng đúng bí mật (tai ở bụng nghe được tiếng bụng). Đạo cụ gag có từ khung 0. Vòng lặp tự nhiên | Phải dựng màng nhĩ vẽ to, vòng sóng âm, cận cảnh gag |

**Chọn C.**
- Giữ của đề cương: nhân vật, câu móc, kính vào bên bụng, gag bụng sôi, Hop vọt khỏi khung, vòng lặp Hop đáp xuống chỗ cũ.
- Thêm: màng nhĩ phản ứng thành chuyển động (quy tắc kính ≤ 3 s, QUALITY §2), Crumb vừa là người hỏi vừa là nguồn âm thanh, vụn bánh gài từ khung 0.

## 2. Logline và mạch truyện

**Logline:** Crumb áp tai vào bụng Hop và hỏi trẻ có nghe bằng bụng được không. Hop thì được: kính lớn của Miss Loupe tìm ra màng nhĩ tròn ở bên bụng Hop, rung lên mỗi khi có tiếng động, đến cả tiếng bụng sôi của Crumb.

- **Mở (0–5 s):**
  - Khung 0: Hop vừa đáp xuống hòn đá (cú đáp ở cuối phim), Crumb chạy tới áp đầu vào bên bụng Hop; vụn bánh của Crumb nằm trên đá. Chữ TUMMY / EARS?! đủ ở khung 0.
  - Crumb (có trên hình): *"Could you hear with your tummy?"* Giọng sát bụng làm màng nhĩ gợn: vòng xanh bạc hà toả ra quanh đầu Crumb.
  - 1,05 s: Hop nhột, khúc khích, nảy lên hất Crumb bật ra; Crumb đáp xuống, râu cuộn thành hai dấu "?".
  - Miss Loupe bật vào từ bên trái: *"Well, Hop can!"* · *"Let's zoom in!"* (Crumb nhún háo hức).
- **Giữa (5–12,2 s):**
  - Kính lớn r ≈ 322 px bật về phía máy, lướt từ mặt Hop xuống bên bụng; màng tròn sáng lên, mô-típ bí mật đô–mi–sol, chữ EAR! có mũi tên. *"Hop's ears are on its tummy!"*
  - Crumb bước lại, khum tay: *"Hello in there!"*. Ba vòng sóng âm vàng viền mực bay từ miệng Crumb tới màng; mỗi vòng chạm là màng gợn, nảy, có tiếng "dum" và một nốt vibraphone cao dần. Hop giật râu (**khoảnh khắc wow**).
  - Chữ EARDRUM!. Miss Loupe: *"It's an eardrum. Sound makes it wiggle!"* Màng rung theo giọng cô (vòng sóng nhỏ bay lên từ phía dưới) và nảy theo phách kick của funk; kính đẩy vào dần.
- **Kết (12,2–22 s):**
  - Kính "chụp" màng nhĩ → sticker "Tummy ears! · they wiggle with sound" vào sổ.
  - Albie: *"Six legs? In you go!"*, đếm chân Hop bằng trang giấy, "đớp" đúng chữ "go!" khi Hop lao vào trang.
  - Trang lật về hòn đá. Crumb nhìn vụn bánh, liếm môi. Bụng sôi "ục ục" hai lần (chữ RUMBLE!). Máy lao vào màng nhĩ: sóng cam lượn chạm màng, màng rung mạnh, bass slap đáp tiếng bụng. Hop giật mình, co chân sau, vọt thẳng lên khỏi khung.
  - Crumb đỏ mặt, ôm bụng: *"Sorry! My tummy!"* Miss Loupe giơ hai tay hỏi trẻ: *"Can YOUR tummy hear things?"* (trẻ: "No!").
  - Chữ móc trở lại; Hop rơi về đúng chỗ cũ ("boing"), Crumb chạy lại áp tai: khung cuối mở về khung đầu.

**Thông điệp (bài học thấy được):** tai không phải lúc nào cũng ở trên đầu. Châu chấu nghe bằng hai màng mỏng ở hai bên bụng, và âm thanh làm màng rung. Câu hỏi cuối mời trẻ so với chính mình.

## 3. Benchmark

| Tác phẩm | Học | Không lấy |
|---|---|---|
| SHORT-006–010 của chính kênh | Khung bản B, kính lớn có máy trôi, `albumGulp()`, phụ đề ở `SAFE.subY`, vòng lặp nhân vật bay/đáp về khung đầu (009) | Lá hoàng hôn, đếm cánh, ska, mọi câu thoại |
| Phim khoa học mầm non dạng "sóng âm thấy được" | Vòng sóng nhìn thấy, chạm vật là vật rung, mỗi cú chạm một tiếng | Nhân vật, hình, nhạc, lời |
| Gag "bụng sôi" của hoạt hình hài | Khựng, nhìn đồ ăn, tiếng bụng, cận cảnh phóng đại, nhân vật khác giật mình | Nhân vật, thiết kế, câu thoại cụ thể |

## 4. Danh sách cảnh

Thời gian là bản cuối (lời đo trên giọng thật, khớp trong `timeline.js`). Mỗi 3–5 s có một chuyện mới.

| # | Thời gian | Khung hình | Máy quay | Chuyện xảy ra | Chuyện mới |
|---|---|---|---|---|---|
| 1 | 0:00–0:01,9 | Trung, hòn đá | Đẩy vào; rung nhẹ khi Crumb đáp | Hop vừa đáp, Crumb áp tai, chữ TUMMY / EARS?!; "Could you hear with your tummy?"; màng gợn; Hop khúc khích, hất Crumb ra | Hành động ở khung 0, câu hỏi về chính trẻ |
| 2 | 0:01,9–0:05,0 | Trung → rộng hơn | Lùi nhẹ cho Miss Loupe vào | Râu Crumb thành "?"; Miss Loupe bật vào: "Well, Hop can!"; "Let's zoom in!" | Câu trả lời bất ngờ |
| 3 | 0:05,0–0:08,2 | **Kính lớn** lướt mặt Hop → bên bụng | Kính trôi | Màng nhĩ sáng, EAR!, mô-típ bí mật: "Hop's ears are on its tummy!" | Bí mật lộ ra |
| 4 | 0:08,2–0:09,2 | Kính lớn, lùi để thấy cả Crumb | Kính trôi, rung khi vòng sóng chạm | "Hello in there!": ba vòng sóng, màng gợn ba lần | **Khoảnh khắc wow** |
| 5 | 0:09,2–0:12,2 | Kính lớn đẩy vào màng nhĩ | Đẩy chậm | EARDRUM!; "It's an eardrum. Sound makes it wiggle!"; màng rung theo giọng và phách | Lời giải gọi đúng tên |
| 6 | 0:12,2–0:13,2 | — | Lao xuyên mặt kính | Kính "chụp" → sticker → trang sổ | Chuyển cảnh qua kính |
| 7 | 0:13,2–0:16,3 | Toàn, trang sổ | Khoá, đẩy nhẹ khi Hop lao vào | Albie: "Six legs? In you go!"; Hop lao vào trang đúng "go!" | Câu cửa miệng có hành động |
| 8 | 0:16,3–0:16,8 | — | Lật trang | Trang sổ lật về hòn đá | Chuyển cảnh |
| 9 | 0:16,8–0:18,3 | Trung → **cận toàn khung màng nhĩ** | Lao vào màng nhĩ, rung, lùi ra | Crumb nhìn vụn bánh, liếm môi; "ục ục" ×2, RUMBLE!; màng rung mạnh | Gag dùng chính bí mật |
| 10 | 0:18,3–0:19,0 | Trung | Ngóc lên theo cú vọt | Hop giật mình, co chân, vọt khỏi khung | Bất ngờ |
| 11 | 0:19,0–0:22,0 | Trung → khung đầu | Về bố cục khung 1 | "Sorry! My tummy!"; "Can YOUR tummy hear things?"; chữ móc trở lại; Hop rơi về, Crumb áp tai | Câu hỏi cho trẻ, vòng lặp |

## 5. Lời thoại

| # | Ai | Lời | Người nói trên hình | Ghi chú |
|---|---|---|---|---|
| L01 | Crumb | Could you hear with your tummy? | Có (áp tai vào bụng Hop, cận mặt) | Câu móc, hỏi chính trẻ; nói nhanh hơn một chút (`pace: 1.06`) |
| L02 | Miss Loupe | Well, Hop can! | Có (vừa bật vào) | Câu trả lời bất ngờ |
| L03 | Miss Loupe | Let's zoom in! | Có | Câu cửa miệng |
| L04 | Miss Loupe | Hop's ears are on its tummy! | Có, cầm kính lớn | "tummy" = bụng côn trùng, thấy bằng hình (FACTS §1) |
| L05 | Crumb | Hello in there! | Có (trong kính và ngoài kính) | Crumb là nguồn âm thanh của khoảnh khắc wow |
| L06 | Miss Loupe | It's an eardrum. Sound makes it wiggle! | Có, cầm kính lớn | "wiggle" = vibrate (FACTS §2) |
| L07 | Albie | Six legs? In you go! | Có | Câu cửa miệng, có hành động |
| L08 | Crumb | Sorry! My tummy! | Có (đỏ mặt, ôm bụng) | Câu gag |
| L09 | Miss Loupe | Can YOUR tummy hear things? | Có (giơ hai tay về phía máy) | Câu hỏi kết; trẻ hô "No!" |

**Tốc độ:** bản B đọc chậm hơn tập A 15 % (`PACE = .85`); câu cửa miệng giữ tốc độ chuẩn; câu của Crumb ở tốc độ chuẩn (`pace: 1`), câu móc `pace: 1.06`; câu hỏi cuối `pace: 1`.

## 6. Nhạc, tiếng động, chữ

- **Màu nhạc riêng: "Tummy-Rumble Funk"** (Fa♯ trưởng, lần đầu kênh dùng): funk hợp âm bảy, bass slap lệch phách, guitar "gà cục tác", snare nốt ma. **Bass slap là tiếng bụng**: mỗi "ục ục" được bass đáp lại; ở cao trào màng nhĩ nảy đúng phách kick. Chi tiết: [MUSIC.md](MUSIC.md).
  - **Điệu riêng của tập (11/2026 lượt 2): funk**, 38 % thời lượng, ở móc, cao trào và gag. Không dùng điệu riêng của tập khác.
- **Phác Sound Design Plan** (bản cuối do `soundplan.py` sinh ra: [SOUND-PLAN.md](SOUND-PLAN.md)):

| Giây | Cảnh | Phong cách · BPM | Nhạc cụ hát chính | Cung bậc |
|---|---|---|---|---|
| 0–2 | Móc: tai ở bụng? | Funny Comedy · funk 120 | trumpet bịt | mở đầu |
| 2–5 | Miss Loupe bật vào | Bouncy Rhythm · phi ngựa 132 | xylophone | mở đầu |
| 5–8,2 | Kính lớn: tai ở bên bụng | Magical Adventure · phiêu lưu 108 | sáo (+ mô-típ đô–mi–sol celesta) | diễn biến |
| 8,2–12,2 | "Hello in there!" · màng nhĩ rung | Epic Cartoon · funk 120 | trumpet | **cao trào** |
| 12,2–13,2 | Chụp → sổ | khựng viết tay | marimba + đàn hạc (tiếng của kênh) | kết |
| 13,2–16,3 | Sổ · Albie | Playful Cartoon · ragtime 112 | piano đồ chơi | kết |
| 16,3–18,5 | Gag: bụng sôi | Funny Comedy · funk 100 | trombone | kết |
| 18,5–21 | Hop vọt · câu hỏi | Happy Kids · pop nảy 126 | trống thép | kết |
| 21–22 | Hop rơi về · vòng lặp | Bouncy Rhythm · nảy lệch phách 120 | kazoo | kết |

- **Tiếng động riêng:** Hop khúc khích "xè-xè", Crumb bật ra "boing", râu "?" hai blip, Miss Loupe bật vào, kính bật, lướt, màng nhĩ sáng, ba tiếng "dum" khi vòng sóng chạm màng, bụng sôi "ục ục", sóng chạm màng "thùm", Hop giật mình, lên dây cót, cú vọt boing + còi vút, cú rơi về còi trượt xuống + "bộp". Bảng cue: [SOUND.md](SOUND.md).
- **Chữ trên hình:** TUMMY / EARS?! (móc), EAR!, EARDRUM!, sticker "Tummy ears! · they wiggle with sound", RUMBLE!.

## 7. Ghi chú sản xuất

- **Hook 0–3 s:**
  - 0–1 s gây chú ý: Hop vừa đáp (co người nảy lại), Crumb chạy tới áp tai, máy đẩy vào, chữ móc nảy có tiếng, nhạc funk chạy từ giây 0. Câu móc bắt đầu ở 0,1 s.
  - 1–2 s nhân vật phản ứng bằng hành động: Hop nhột khúc khích, nảy lên hất Crumb bật ra; Crumb đáp xuống, máy rung.
  - 2–3 s bí ẩn chưa giải: râu Crumb cuộn thành hai dấu "?"; Miss Loupe bật vào ngay trước câu trả lời.
- **Khoảnh khắc wow:** kính lớn r ≈ 322 px; màng nhĩ trong kính rộng 160–270 px (15–25 % bề ngang khung); bí mật xảy ra thành chuyển động: vòng sóng bay tới → màng gợn, nảy, có tiếng; sau đó màng rung theo giọng nói và phách nhạc. Ở gag: cận toàn khung (máy z ≈ 4,6), màng rộng khoảng 260 px rung mạnh.
- **Người nói có trên hình** từ giây 3: Miss Loupe bật vào ở 1,98–2,38 s, trước câu của cô; trong kính, mặt cô ở dưới kính và Crumb có trong kính khi nói "Hello in there!".
- **Đạo cụ của gag gài trước:** vụn bánh của Crumb nằm trên hòn đá từ khung 0 và ở mọi cảnh rộng; bí mật "tai ở bụng" được dạy trước khi bụng Crumb sôi, nên trẻ hiểu vì sao Hop giật mình.
- **Nhân vật cần phân biệt khác nhau ở hình:** Hop xanh lá, dài, chân sau gập cao; Crumb hổ phách, đứng thẳng, râu dấu hỏi; nền hòn đá oải hương tương phản với cả hai.
- **Vùng an toàn:** phụ đề ở `SAFE.subY`, tâm x 495; mặt nhân vật trên 1250 px khi có phụ đề; chữ móc từ 156 px.
- **Giọng:** Miss Loupe `af_heart`, Albie `bm_lewis`, Crumb `af_jessica` +5 nửa cung (`voices.js`). Hop không lời.
- **Đổi chữ để Whisper nghe đúng** (thử nhiều cách nói cùng giọng, giữ ý; cả hai model `small.en` và `base.en` phải qua):
  - Câu móc "Could you hear with your tummy?" ở tốc độ .85 bị `small.en` nghe thành "Or could you…" → đọc ở `pace: 1.06`.
  - "Hop can!" bị nghe thành "A hop can" / "Hopcan" → "Well, Hop can!".
  - "Hello, Hop!" bị nghe thành "Hello, hot" → "Hello in there!" (nói vào "tai", vui hơn).
  - "Oops! My tummy!" bị nghe thành "Loops, my tummy" → "Sorry! My tummy!".
  - "Can your tummy hear?" bị nghe thành "…here?" → "Can YOUR tummy hear things?" (TTS đọc chữ thường).
- **Hop trong sản xuất** (rig dùng chung `cast/hop.js`, không sửa):
  - Rig chạy ngay với `LOOK.v = 2` (viền mực, bóng cel, lông mày). Dùng các dáng `crouch` (lấy đà, đáp xuống nảy lại), `lift` + `wingOpen` (cú vọt, chân sau duỗi), `ant` (râu ngọ nguậy, dựng râu khi giật mình), `frontR` (giơ chân trước), `hindUp` (đếm chân ở sổ) và biểu cảm `laugh`, `surprised`, `curious`, `excited`.
  - Màng nghe mặc định của rig nhỏ (bán kính khoảng 0,16 đơn vị rig) và ở góc nghiêng hẳn (yaw −1,2 đến −1,57) bị đùi sau che. Tập này đặt Hop ở góc ba phần tư (yaw −0,9) để màng quay về máy, và vẽ đè một màng to hơn có vòng gợn, độ sáng, tâm nảy bằng `drawChar(..., extra)` (`drumExtra` trong `props.js`), đúng chỗ decal của rig.
  - `HOP.ear(sd)` trả về `[±.36, −.86, −.08]`, còn tâm decal màng nghe trên elip bụng nằm ở khoảng `[±.353, −.819, −.264]` (lệch 0,18 đơn vị theo trục z). Để kính nhắm đúng tâm màng, `film.js` tự tính vị trí decal (`drumRig`). Ghi lại để thư viện xem xét, không sửa ở tập này.
  - `lift` duỗi chân sau nhưng chỉ nâng thân một chút; cú vọt khỏi khung do `film.js` dời điểm chân (`y`) theo đường cong, cộng `lean` ngóc đầu.
  - Biểu cảm truyền vào bằng `ex()` (đối tượng) nên `exprPose` của rig không tự áp; dáng chân, râu được đặt tay theo từng nhịp.
- **Sửa trong quá trình (soi khung tĩnh trước khi render):**
  - Nhân vật quá nhỏ ở cảnh rộng → Hop k 115 → 130, Crumb 68 → 76, máy móc z 1,7–1,8.
  - Đầu Crumb che kín màng nhĩ ở khung 0 → Crumb áp tai sát mép màng, thêm vòng gợn xanh quanh màng (thấy được quanh đầu Crumb).
  - Vòng sóng "Hello in there!" màu trắng không thấy trên mặt kính và đi quá nhanh (0,13 s) → vàng có viền mực, Crumb đứng xa hơn, tốc độ 280 px/s (mỗi vòng bay khoảng 0,3 s).
  - Miss Loupe bị cắt mép trái ở gag, bàn tay chỉ che mặt Hop ở móc → dời cô sang trái, máy gag lùi ít hơn.
  - `qa.py` lần 1: mặt Crumb nằm trong cột nút phải ở cận cảnh màng nhĩ (17,5–18,2 s) → máy dừng ở z 4,2 và lệch tâm để mặt Crumb ở x ≈ 890.
  - Chữ RUMBLE! nằm trên đường cú vọt của Hop → dời sang phải, trên đầu Crumb.
  - Độ rực màu 0,38 (sát ngưỡng 0,35) → trời, đồi và hòn đá đậm hơn một chút, nền vẫn dịu hơn nhân vật.

- **Kiểm tra cuối (14/11/2026):**
  - Whisper `small.en` và `base.en`: 9/9 câu đúng trên cả hai model.
  - Readcheck: 8/8 chữ đủ thời gian đọc (RUMBLE! 2,04 s, cần 1,97 s).
  - −14,0 LUFS, đỉnh thật −2,6 dBTP, 22,0 s, 1080×1920, 30 fps.
  - `safesheet.py`: không mặt, chữ hay phụ đề nào trong vùng giao diện Shorts (vụn bánh, là đạo cụ, chạm mép cột nút phải ở cảnh rộng).
  - `_shared/qa.py`: **53/53 đạt, 0 cảnh báo, 0 chưa đạt**, gồm cả 11 mục Sound Design Plan và chống trùng giữa các tập (so với 14 Short).

## 8. Báo cáo giao

### Bảng `qa.py` (`out/qa.json`)

| Nhóm | Mục | Kết quả | Giá trị |
|---|---|---|---|
| 1 Hook | Lời đầu tiên | ĐẠT | 0.10 s |
| 1 Hook | Chuyển động trong giây đầu | ĐẠT | 4.94 |
| 1 Hook | Chuyển động 1–2,5 s | ĐẠT | 8.80 |
| 1 Hook | Nhạc ngay từ giây 0 | ĐẠT | -18 dBFS (0–0,5 s) |
| 1 Hook | Tiếng động ở khung đầu | ĐẠT | 4 tiếng ≤ 0,3 s |
| 1 Hook | Mật độ tiếng động 0–3 s | ĐẠT | 12 |
| 1 Hook | Cảnh tựa / logo | ĐẠT | không có |
| 2 Giữ chân | Đoạn hình đứng yên ≥ 2,5 s | ĐẠT | không có |
| 2 Giữ chân | Khoảng "chết" ≥ 1,8 s | ĐẠT | không có |
| 2 Giữ chân | Độ dài trung bình mỗi cảnh | ĐẠT | 7.3 s (3 cảnh, 10 chuyển cảnh mạnh) |
| 2 Giữ chân | Tốc độ lời | ĐẠT | 1.86 từ/s (41 từ) |
| 2 Giữ chân | Đoạn không lời dài | ĐẠT | không có |
| 2 Giữ chân | Hình gần đứng yên kéo dài (kể cả khi có lời) | ĐẠT | không có |
| 2 Giữ chân | Câu cửa miệng có hành động | ĐẠT | 13.4 s: 3.33 |
| 3 Nội dung | Người nói có trên hình | ĐẠT | mọi câu sau 3 s |
| 4 Âm thanh | Độ to | ĐẠT | -14.0 LUFS |
| 4 Âm thanh | Đỉnh thật | ĐẠT | -2.6 dBTP |
| 4 Âm thanh | Lời rõ hơn nhạc + tiếng động | ĐẠT | thấp nhất 16.8 dB (L02) |
| 4 Âm thanh | Mật độ tiếng động | ĐẠT | 25.0 cue / 10 s (55 cue) |
| 4 Âm thanh | Tiếng động không lạm dụng, không lấn lời | ĐẠT | dày nhất 8 cue / 1 s (sau 3 s); lời hơn tiếng động thấp nhất 19.4 dB (L07) |
| 4 Âm thanh | Độ chói (năng lượng > 6 kHz) | ĐẠT | 1.9 % |
| 4 Âm thanh | Tiếng tụt đột ngột | ĐẠT | 0 |
| 4 Âm thanh | Lỗ im của nhạc nền | ĐẠT | 0 giây dưới −45 dB |
| 4 Âm thanh | Âm lượng nhạc đổi theo cảnh | ĐẠT | 26 dB |
| 4 Âm thanh | Nhạc đổi theo cảnh: đoạn dài nhất cùng một kiểu | ĐẠT | 4.1 s ("Hello in there!" · màng nhĩ rung theo funk, 8.2–12.2 s); 9 cảnh nhạc |
| 4 Âm thanh | Số điệu nhạc khác nhau | ĐẠT | 6: bounce, funk, gallop, hop, quest, stride |
| 4 Âm thanh | Hai cảnh nhạc kề nhau khác rõ | ĐẠT | mọi cặp khác nhau ≥ 2 điểm |
| 4 Âm thanh | Câu đáp của nhạc giữa các câu thoại | ĐẠT | 8 câu đáp (3 tự động, 5 viết tay) |
| 4 Âm thanh | Nhạc có nhịp liền | ĐẠT | 100 % số giây có ≥ 3 nốt (trung vị 9 nốt/s) |
| Sound Design Plan | Phong cách nhạc theo cảnh | ĐẠT | 6: Bouncy Rhythm, Epic Cartoon, Funny Comedy, Happy Kids, Magical Adventure, Playful Cartoon |
| Sound Design Plan | Nhạc cụ hát chính luân phiên | ĐẠT | 8 nhạc cụ; nhiều nhất 1/8 cảnh |
| Sound Design Plan | Luân phiên họ nhạc cụ | ĐẠT | 10: bộ gõ, chuông, kèn gỗ, kèn đồng, marimba, nhạc cụ hoạt hình, piano, ukulele, xylophone, đàn hạc |
| Sound Design Plan | BPM đổi theo nội dung | ĐẠT | 6 mức: 100, 108, 112, 120, 126, 132 (chênh 32) |
| Sound Design Plan | Không lặp một bản nhạc | ĐẠT | điệu dùng nhiều nhất: funk 3/8 cảnh |
| Sound Design Plan | Mở đầu · diễn biến · cao trào · kết | ĐẠT | open 0.0–5.0 s, build 5.0–8.2 s, peak 8.2–12.2 s, end 13.2–22.0 s |
| Sound Design Plan | Chuyển cảnh âm thanh mềm, đa dạng | ĐẠT | 8 chỗ chuyển: fill ×3, tail ×2, swell ×1, viết tay ×2 |
| Sound Design Plan | Bảng Sound Design Plan | ĐẠT | SOUND-PLAN.md 9/9 cảnh |
| Sound Design Plan | Điệu riêng của tập | ĐẠT | funk · 38 % thời lượng |
| Sound Design Plan | Không trùng cảnh nhạc của Short khác | ĐẠT | so với 14 Short; không cảnh nào trùng |
| Sound Design Plan | Nhạc vui nhộn (hồi hộp, giọng thứ) | ĐẠT | hồi hộp + khựng 0 %, giọng thứ 0 % |
| 5 Hình ảnh | Khung trống / đen | ĐẠT | 0 khung |
| 5 Hình ảnh | Khung hình và tốc độ | ĐẠT | 1080×1920, 30 fps |
| 5 Hình ảnh | Vùng giao diện Shorts | ĐẠT | không chạm |
| 5 Hình ảnh | Phụ đề che mặt nhân vật | ĐẠT | không có |
| 5 Hình ảnh | Chớp sáng mạnh | ĐẠT | tối đa 0 lần/giây |
| 5 Hình ảnh | Độ rực màu | ĐẠT | 0.40 |
| 6 Xem lại | Khung cuối nối khung đầu | ĐẠT | chênh 10.5/255 |
| 6 Xem lại | Câu hỏi kết cho trẻ | ĐẠT | "Can YOUR tummy hear things?" ở 20.1 s |
| 6 Xem lại | Cảnh cuối gợi lại câu móc | ĐẠT | có (chữ móc trở lại) |
| 6 Xem lại | Vòng lặp của bản B | ĐẠT | có |
| 7 Giọng | Cao độ từng nhân vật | ĐẠT | crumb 267 Hz, loupe 211 Hz, albie 97 Hz |
| 7 Giọng | Các giọng khác nhau rõ | ĐẠT | gần nhất 4.1 nửa cung |
| 7 Giọng | Giọng trẻ em: crumb | ĐẠT | 267 Hz |

### Checklist thủ công (`_shared/QUALITY.md`)

- [x] 0–1 s gây chú ý: Hop vừa đáp, Crumb áp tai, máy đẩy vào, chữ móc nảy có tiếng. 1–2 s nhân vật phản ứng: Hop nhột khúc khích, hất Crumb bật ra. 2–3 s bí ẩn: râu Crumb thành hai dấu "?", Miss Loupe bật vào.
- [x] Mỗi 3–5 s có chuyện mới (bảng cảnh, mục 4).
- [x] Có gag và bất ngờ: Hop nhột hất Crumb ra; bụng Crumb sôi, Hop "nghe" bằng bụng và vọt khỏi khung. Nhân vật đúng tính cách: Crumb tò mò, hay đói, lễ phép xin lỗi; Miss Loupe vui; Hop nhảy nhót.
- [x] Nội dung đúng `FACTS.md` (màng nghe ở hai bên đốt bụng đầu, "simple eardrums vibrate in response to sound waves"); gag ghi rõ là hư cấu; hợp 4–8 tuổi, không đáng sợ, không ai đau (Crumb bật ra rồi đáp mềm).
- [x] Có bài học thấy được: tai châu chấu ở bụng, âm thanh làm màng rung; câu hỏi cuối để trẻ so với mình.
- [x] Biểu cảm đọc được ở cỡ điện thoại; không che mặt, không cắt mép, không lơ lửng (đã soi khung tĩnh và `safesheet.py`).
- [x] Nhạc đổi theo cảnh (9 cảnh nhạc, 6 phong cách, BPM 100–132); màu "Tummy-Rumble Funk", giọng Fa♯, khác các tập trước.
- [ ] *(Kênh)* **Nghe tập này ngay sau tập đăng trước**: mình không nghe trực tiếp được. Đã kiểm bằng số đo: funk là điệu riêng (38 %), cảnh sổ là ragtime + piano đồ chơi (009: shuffle + accordion), gag và cao trào phối funk, 0 % giọng thứ. Cảm nhận khi nghe cần chủ kênh nghe lại.
- [ ] **Nghe lại cả phim**: như trên, cần chủ kênh nghe. Số đo: nhịp liền 100 %, 8 câu đáp, mọi cặp cảnh kề nhau khác ≥ 2 điểm.
- [x] *(SDP)* `SOUND-PLAN.md` đủ 9 cảnh; mở đầu, diễn biến, cao trào, kết khác nhau; đổi BPM có trống dồn, ngân đuôi hoặc dâng lấp lánh; nhạc không lời, vui.
- [x] Kết có điểm nhấn (Hop vọt khỏi khung, rơi về "boing") và nối về đầu: Hop đáp đúng chỗ cũ, Crumb áp tai như khung 0 (chênh 10,5/255).
- [x] Không kêu gọi bình luận hay đăng ký; câu hỏi kết trẻ trả lời to ("No!").
- [x] Tựa móc nảy ở khung đầu có tiếng; nhân vật phản ứng bất ngờ trong 1,05 s.
- [x] Chuyển cảnh kính → sổ: "chụp" và match cut qua sticker.
- [x] Cảnh cuối gợi lại câu móc: chữ TUMMY / EARS?! trở lại, câu hỏi gợi lại "Could you hear with your tummy?".
- [x] Mỗi nhân vật có lời một giọng riêng; Crumb giọng trẻ em 267 Hz; Hop không lời, có tiếng riêng.
- [x] *(11/2026)* Kính lớn r ≈ 322 px, màng nhĩ rộng 15–25 % khung; gag cận toàn khung. Bí mật xảy ra thành chuyển động (vòng sóng → màng gợn); kính luôn trôi, không đứng quá 3 s (`qa.py`: không có đoạn gần đứng yên).
- [x] *(11/2026)* "Six legs? In you go!" có hành động (Albie đếm chân Hop, "đớp" đúng "go!" khi Hop lao vào trang; 3,33).
- [x] *(11/2026)* Người nói có trên hình từ giây 3; đạo cụ gag (vụn bánh) có từ khung 0; nghĩa từ "tummy", "wiggle" được nói rõ bằng hình (FACTS §1–2).
- [x] *(11/2026)* Phụ đề, chữ và mặt nhân vật ngoài vùng giao diện Shorts; phụ đề không che mặt; chữ có viền hoặc bóng đậm; nền hòn đá oải hương tương phản với Hop xanh lá và Crumb hổ phách.

## Cập nhật 14/11/2026: mặt luôn vui, nhạc luôn tươi

Theo yêu cầu "hãy luôn làm khuôn mặt của các nhân vật và nhạc vui tươi" (QUALITY.md, mục *Vui tươi*).
- **Mặt:** bật `LOOK.cheer = true`; rig dùng chung đổi biểu cảm buồn, lo, cáu, nhăn, hét, lác mắt sang dạng vui, bất ngờ thành mắt to miệng cười, lúc nói miệng cười há.
- **Nhạc:** funk của gag 100 → 108.
- **qa.py sau khi dựng lại:** 55 ĐẠT · 0 CẢNH BÁO · 0 CHƯA ĐẠT (gồm hai mục mới "Mặt nhân vật vui tươi" và "Nhạc vui tươi"). Bảng qa ở trên là của lần dựng trước.
