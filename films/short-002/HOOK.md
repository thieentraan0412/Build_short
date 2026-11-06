# SHORT-002 · Thiết kế hook 0–3 giây

Theo `Task.md` (*Thiết kế hook mở đầu thu hút cho YouTube Shorts*). Chỉ đổi phần mở 0,75–2,95 s. Phần soi kính, nhịp "ồ", sổ, gag, lời thoại, nhạc, thời lượng 22,0 s và **vòng lặp** (khung cuối nối vào khung đầu) giữ nguyên.
Bản trước: `out/short-002-v2.mp4`, `out/film-v2.js`, `out/timeline-v2.js`, `out/mix-v2.py`.

## 1. Phần mở cũ (v2) so với yêu cầu

| Yêu cầu | Bản v2 | Kết luận |
|---|---|---|
| 0–1 s: hình gây chú ý ngay | Flutter đang hạ xuống từ khung đầu, dậm chân lên miếng dưa ở 0,5 s, nước dưa bắn | Đạt |
| 1–2 s: nhân vật phản ứng | Vòi bung ra ở 0,875 s, nhưng chỉ là một nét cam mảnh, khó thấy trên điện thoại. Nét mặt Flutter gần như không đổi. Từ 0,9 đến 2,5 s, cánh che mất chữ TASTY SOCKS?! | Yếu |
| 2–3 s: câu hỏi hoặc bí mật chưa giải | Chưa có gì cho thấy "vì sao vòi bung ra?". Máy kéo xa, Miss Loupe vào nói "Let's zoom in!": đúng hướng, nhưng chưa có gợi ý nào chỉ xuống bàn chân | Thiếu |
| Câu hỏi về chính trẻ (quy hoạch §4.2) | *"What if your socks could taste your snack?"* từ 0,1 s | Đạt |
| Vòng lặp liền | Khung cuối (đốm mắt trên cánh mở ra) nối đúng khung đầu | Đạt, phải giữ |

## 2. Ba phương án

### Phương án A · "Vòi lò xo" (chọn)

| | |
|---|---|
| **1. Ý tưởng** | Biến khoảnh khắc vòi tự bung ra thành cú "giật mình" thật to: vòi bật ra như lò xo, Flutter tròn mắt, cúi nhìn cái vòi của chính mình, rồi quay ra nhìn người xem như hỏi "hả?". Ngay sau đó, hai đốm sáng nháy lên ở bàn chân: câu trả lời nằm dưới đó. |
| **2. Hình và hành động** | Khung đầu giữ nguyên (vòng lặp): Flutter hạ xuống và dậm lên miếng dưa, nước bắn. Máy đẩy cận vào đầu. Chữ móc nhỏ lại và nhích lên để cánh không che. Vòi bật ra, một vệt "bung" phẳng màu chanh lóe sau đầu vòi kèm năm vạch hành động; vòi nảy co–duỗi rồi đứng lại. Mắt Flutter phồng to. Flutter cúi nhìn cái vòi, vòi cuộn lại "vèo", Flutter quay ra phía người xem. Hai đốm sao nháy ở bàn chân. Máy kéo xa, Miss Loupe trượt vào. |
| **3. Timeline** | **0,00** Flutter hạ xuống, chữ TASTY SOCKS?! · **0,50** dậm chân, nước dưa bắn · **0,76–1,08** máy đẩy cận, chữ nhỏ lại · **0,875** vòi bật ra, vệt bung, mắt phồng to · **1,45** cúi nhìn cái vòi đang nảy · **1,90** vòi cuộn lại, Flutter quay ra người xem · **2,30** đốm sao nháy ở bàn chân · **2,45** kéo xa · **2,60** Miss Loupe trượt vào · **2,75** *"Let's zoom in!"* |
| **4. Lời** | Giữ hai câu cũ, đã qua kiểm tra Whisper: *"What if your socks could taste your snack?"* (0,1 s) và *"Let's zoom in!"* (2,75 s). Flutter không lời, nên phản ứng của nó là nét mặt. |
| **5. SFX và nhạc** | Cánh vỗ và còi rơi nối từ cuối phim · bẹp mọng nước, giọt bắn, ban nhạc đánh cùng · swish đẩy cận · sproing và pop · còi trượt xuống khi vòi cuộn (sau chữ "snack") · tink khi đốm sáng nháy · whoosh kéo xa · swipe khi Miss Loupe vào · tink mặt kính · nhạc "nhón chân" (bass gảy ngắn, mõ gỗ) |
| **6. Chuyển vào nội dung chính** | "Let's zoom in!": kính phóng vào đúng bàn chân vừa nháy sáng, điểm nếm sáng lên, *"It's sweet!"*, rồi *"So out comes its curly straw!"* trả lời bí ẩn của hook. |
| **7. Đánh giá** | **Thu hút 9/10:** hành động ở khung đầu, một cú "bung" thấy rõ ở 1 s, nhân vật phản ứng hài, có gợi ý dẫn vào phần soi. **Phù hợp trẻ 4–8 tuổi 10/10:** vui, không đáng sợ, nguyên nhân–kết quả đúng thí nghiệm thật (chân chạm đường thì vòi duỗi ra). Vòng lặp và lời giữ nguyên. |

### Phương án B · "Đôi tất biết nếm"

| | |
|---|---|
| **1. Ý tưởng** | Vẽ đúng câu hỏi: một đôi tất sọc nhảy lên miếng dưa và "nếm". |
| **2. Hình và hành động** | Đôi tất dậm lên dưa, "Mmm?" rồi biến mất trong làn khói, lộ ra sáu bàn chân của Flutter; vòi bung. |
| **3. Timeline** | **0,0** đôi tất xuất hiện · **0,8** dậm lên dưa · **1,5** khói, lộ Flutter · **2,4** vòi bung |
| **4. Lời** | *"What if your socks could taste your snack?"* |
| **5. SFX và nhạc** | Pop, khói "phụt", sproing |
| **6. Chuyển vào nội dung chính** | Miss Loupe trượt vào, "Let's zoom in!" |
| **7. Đánh giá** | **Thu hút 7/10.** Buồn cười, nhưng thêm một đạo cụ không có trong dàn nhân vật. Dễ khiến trẻ nghĩ đôi tất thật sự nếm được. Bí ẩn chính (vòi bung) bị đẩy sau 2 s. Phá vòng lặp vì khung đầu phải đổi. |

### Phương án C · "Ai đang nếm miếng dưa?"

| | |
|---|---|
| **1. Ý tưởng** | Cực cận mặt dưa: sáu "cây gậy" đen gõ xuống "tap-tap-tap", nước dưa sáng lên. Ai thế nhỉ? |
| **2. Hình và hành động** | Máy kéo xa: là một con bướm! Vòi của nó bung ra. |
| **3. Timeline** | **0,0** cực cận sáu chân gõ · **1,0** nước dưa sáng lên · **2,0** kéo xa, lộ Flutter · **2,6** vòi bung |
| **4. Lời** | *"Wait… who's tasting the watermelon?"* |
| **5. SFX và nhạc** | Tap-tap, lấp lánh, whoosh lùi, sproing |
| **6. Chuyển vào nội dung chính** | Miss Loupe trượt vào, "Let's zoom in!" |
| **7. Đánh giá** | **Thu hút 7/10.** Tò mò, nhưng trẻ nhỏ khó đọc cực cận. Lộ trước hình điểm nếm của phần soi. Bỏ câu hỏi về chính trẻ (trái quy hoạch). Phải thu giọng mới và làm lại khung đầu, nên phá vòng lặp. |

## 3. Vì sao chọn A

- Đủ ba nhịp trong 3 giây: dậm chân (0,5 s) → vòi bung và Flutter giật mình (0,9–1,9 s) → "hả?" và đốm sáng ở bàn chân (1,9–2,5 s).
- Sửa đúng ba lỗi đo được trên bản v2: chữ móc bị che, cái vòi khó thấy, Flutter không phản ứng.
- Khung đầu, lời, nhạc và vòng lặp giữ nguyên. Đốm sáng chỉ *gợi*, không *giải thích*: phần soi kính mới giải thích.

## 4. Đã triển khai

| File | Thay đổi |
|---|---|
| [film.js](film.js) | `cam`: cú đẩy cận nhắm vào đầu và cái vòi (z 2,3–2,35 thay vì 2,9), đỉnh cánh nằm dưới chữ móc. Chữ TASTY SOCKS?! thu còn 70% và nhích lên khi máy đẩy cận. `sproingTongue`: vòi bật ra rồi nảy co–duỗi nhỏ dần. Vệt "bung" phẳng màu chanh sau đầu vòi, năm vạch hành động dày hơn. Flutter: mắt phồng to (×1,45) → cúi nhìn cái vòi → quay ra người xem → bình thường. Hai đốm sao nháy ở bàn chân ở 2,3 s. Hằng số của nhịp móc: `HOOK`. |
| [timeline.js](timeline.js) | Khối `EV`: thêm tiếng tink ở 2,36 s cho đốm sáng (sau chữ "snack"). |
| [SOUND.md](SOUND.md) | Cập nhật bảng 3 giây đầu. |

Khung từ 0 đến 0,5 s và khung cuối không đổi, nên vòng lặp vẫn liền. Kết quả kiểm tra của bản mới: xem mục cuối trong [SOUND.md](SOUND.md).

## 5. Lượt tối ưu phần mở đầu (Task.md "Tối ưu phần mở đầu")

Bản trước lượt này: `out/short-002-v4.mp4`, `out/film-v4.js`, `out/timeline-v4.js`, `out/mix-v4.py`.

| Yêu cầu | Trong phim bây giờ |
|---|---|
| Nhạc vui, sôi động từ giây 0 | 0,0 s: phách D (kick, bass, steel pan, glock) nối từ cuối phim. **Từ 0,6 s nhịp calypso chạy liền** (bass tresillo, son clave, kick) thay cho đoạn nhón chân (**mới**). Khoảng khựng khi mắt Flutter phồng to rút từ 0,45 s xuống 0,2 s |
| Khung đầu: nhân vật có hành động hoặc biểu cảm bất ngờ | Flutter dang cánh lao xuống miếng dưa, **mắt to phấn khích (×1,3) nhìn xuống chỗ sắp dậm (mới)**. Nhịp vỗ cánh lệch nửa chu kỳ để khung đầu bắt đúng lúc cánh mở ngang |
| Một câu ngắn giới thiệu nội dung, gây tò mò | *"What if your socks could taste your snack?"* (0,1–2,6 s) |
| Tiêu đề chữ lớn, dễ đọc, màu thiếu nhi | TASTY SOCKS?! (vàng chanh / hồng berry) **bật ra ở khung đầu (mới)**: 85% → 100% trong 0,22 s. Ở khung 0 không còn bị cánh che, vì máy hạ thấp một chút và cánh đang mở |
| SFX khi nhân vật xuất hiện và tiêu đề hiện | 0,0 s: bong bóng cao + phím glock cho chữ (**mới**), cánh vỗ. 0,5 s: bẹp mọng nước + nước bắn. 0,875 s: sproing. 2,6 s: swipe khi Miss Loupe trượt vào |
| Không intro logo dài, không cảnh tĩnh | Bản B không có cảnh tựa: vào thẳng hook |
| Vào chuyện chính trong 3 s | 2,75 s: *"Let's zoom in!"*, kính tiến vào bàn chân |
| Nhạc khớp chuyển động, biểu cảm, nhịp dựng | Phách D ở 0,0 s giải về G đúng cú dậm 0,5 s. Xylophone vút lên theo vòi bung. Khựng một móc đơn khi mắt phồng to. Pizzicato đi xuống theo vòi cuộn. Nhịp đầy khi máy kéo xa |
| Giữ nhân vật, phong cách, cốt truyện, thông điệp | Lời, cốt truyện, thời lượng 22,0 s không đổi. Vòng lặp vẫn liền: khung cuối vẽ lại đúng khung đầu (cùng biểu cảm, cỡ chữ, góc máy) |

Kiểm tra:
- −13,9 LUFS, đỉnh −1,4 dBFS.
- Whisper `small.en` (VAD) 34/34 từ; `base.en` 32/34, hai chỗ lệch vẫn là "its" ↔ "it's".
- Câu mở đầu so với nhạc: 12,8 dB (bản trước 13,5). Nhịp calypso dưới câu hỏi đã được hạ để giữ lời rõ.
- Readcheck đạt; không có chỗ tụt tiếng.
