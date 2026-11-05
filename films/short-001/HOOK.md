# SHORT-001 · Thiết kế hook 0–3 giây

Theo `Task.md` (*Thiết kế hook mở đầu thu hút cho YouTube Shorts*). Chỉ đổi phần mở 0–3,5 s. Tựa, ba bí mật, cảnh sổ, gag kết, toàn bộ lời thoại, nhạc và thời lượng 52,0 s giữ nguyên.
Bản trước: `out/short-001-v2.mp4`, `out/film-v2.js`, `out/timeline-v2.js`, `out/mix-v2.py`.

## 1. Phần mở cũ (v2) so với yêu cầu

| Yêu cầu | Bản v2 | Kết luận |
|---|---|---|
| 0–1 s: hình gây chú ý ngay | Cây kem đứng yên giữa khung. Bàn chân chỉ là một mẩu da ở mép trên, nằm sau chữ, khó nhận ra. Chuyển động đầu tiên là chữ FEET?! bật ra ở 0,55 s | Yếu |
| 1–2 s: nhân vật phản ứng | Cú giẫm ở 1,5 s rất tốt, nhưng chưa ai phản ứng. Miss Loupe đến 2,2 s mới ló ra ở góc | Thiếu |
| 2–3 s: câu hỏi hoặc bí mật chưa giải | "Butterflies can!" nói luôn đáp án. Flutter chỉ là một chấm nhỏ bay ngang ở 2,9 s; không có gì gợi "bằng cách nào?" | Yếu |
| Câu hỏi về chính cơ thể trẻ (quy hoạch §4.2) | "Can you taste with your feet?" từ 0 s | Đạt |
| SFX theo hành động, nhạc tò mò | Đã có từ lượt sound design ([SOUND.md](SOUND.md)) | Đạt |

## 2. Ba phương án

### Phương án A · "Bàn chân đi nếm kem" (chọn)

| | |
|---|---|
| **1. Ý tưởng** | Giữ gag của kế hoạch (bàn chân The Giant giẫm kem) nhưng kể thành chuyện ba nhịp: đánh hơi → chạm thử → giẫm bẹp. Trẻ thấy ngay "cái chân định ăn kem" và bật cười, rồi thấy con bướm làm được thật. |
| **2. Hình và hành động** | Khung đầu: bàn chân to lơ lửng ngay trên cây kem, ngón ngọ nguậy như đang đánh hơi. Ngón chân chạm thử "boop", kem rung rinh. Chân vút lên lấy đà rồi giẫm bẹp: màn hình rung, kem văng. Miss Loupe bật lên từ dưới khung, mắt tròn xoe, miệng chữ O. Chân rút đi, Flutter sà xuống đúng chỗ kem bẹp và dậm chân hai cái. Trong kính, dưới bàn chân bướm lóe một vệt sáng. |
| **3. Timeline** | **0,00** chân lơ lửng, ngón ngọ nguậy · **0,55** FEET?! bật ra · **0,62** chạm thử "boop" · **0,9–1,3** lấy đà · **1,50** giẫm bẹp · **1,60** Miss Loupe bật lên, sững sờ · **1,95–2,40** chân vút đi · **2,00–2,60** Flutter sà xuống, đậu · **2,88 · 3,12** dậm chân, chân lóe sáng trong kính · **3,50** kính nở thành tựa |
| **4. Lời** | Miss Loupe: *"Can you taste with your feet?"* (0,0 s). Khoảng trống 0,7 s để trẻ kịp hét "No!". Rồi *"Butterflies can!"* (2,25 s). Giữ hai câu cũ, đã qua kiểm tra Whisper. |
| **5. SFX và nhạc** | Bass "rình" đi lên từng nửa cung kèm mõ gỗ (0–1,5 s) · bong bóng theo từng chữ FEET?! · "boop" bong bóng trầm khi chạm thử · lên dây cót · gió vút · thump, bẹp kem, cả ban nhạc đánh cùng lúc · boing khi chữ lắc · giọt kem · swipe khi Miss Loupe bật lên · zíp khi chân rút · cánh vỗ, tiếng đậu · hai tiếng tink lấp lánh khi chân lóe sáng · glock dâng và chũm chọe ngược vào nhạc hiệu |
| **6. Chuyển vào nội dung chính** | Như cũ: kính của Miss Loupe nở thành cảnh tựa, chạm nhạc hiệu đúng 4,0 s. Vệt sáng dưới chân bướm chỉ được giải thích ở bí mật 1 ("Let's zoom in!", "Tiny taste spots on its feet…"). |
| **7. Đánh giá** | **Thu hút 9/10:** chuyển động từ khung đầu; một gag ai cũng hiểu; cao trào ở 1,5 s; có phản ứng rõ; để lại một bí ẩn bằng hình. **Phù hợp trẻ 4–8 tuổi 10/10:** hài, không đáng sợ, đúng câu hỏi của tập, không thêm lời, giữ quy chuẩn hình. Rủi ro thấp vì phần sau không đổi. |

### Phương án B · "Cái gì trong kính?"

| | |
|---|---|
| **1. Ý tưởng** | Mở bằng một hình bí ẩn: cực cận trong kính, một vật lạ màu đen gõ "tap tap" lên mặt hồng có đốm sáng (thật ra là chân bướm trên kem). |
| **2. Hình và hành động** | Mắt Miss Loupe khổng lồ chớp sau kính. Cô giật mình, kính lùi lại, máy kéo xa: Flutter đang đứng trên cây kem bị giẫm bẹp. |
| **3. Timeline** | **0,0** cực cận, chân gõ, đốm sáng · **1,0** mắt Miss Loupe mở to, kính giật lùi · **2,0** kéo xa · **3,0** Flutter vẫy chân |
| **4. Lời** | *"Wait… WHAT is that?"* · *"Can you taste with your feet?"* |
| **5. SFX và nhạc** | Tap-tap, lấp lánh, whoosh lùi, pad bí ẩn |
| **6. Chuyển vào nội dung chính** | Kính nở thành tựa |
| **7. Đánh giá** | **Thu hút 7/10.** Tò mò cao, nhưng trẻ 4 tuổi khó đọc một hình cực cận trong giây đầu. Lộ hình đáp án trước bí mật 1 và dùng trước cú "Let's zoom in!" của kênh. Câu hỏi về cơ thể trẻ bị đẩy sau 2 s (trái quy hoạch). Phải dựng cảnh mới và thu giọng mới. |

### Phương án C · "Cuộc đua tới cây kem"

| | |
|---|---|
| **1. Ý tưởng** | Flutter và bàn chân khổng lồ cùng lao tới một cây kem: ai tới trước? |
| **2. Hình và hành động** | Flutter phóng vào từ trái, bóng bàn chân lớn dần trên kem. Bàn chân giẫm trước, Flutter đâm vào ngón chân và choáng váng. Rồi Flutter đậu lên ngón chân, dậm thử; Miss Loupe bật cười. |
| **3. Timeline** | **0,0** Flutter lao vào · **0,5** bóng chân lớn dần · **1,2** giẫm · **1,4** Flutter va vào ngón chân · **2,2** Flutter đậu, dậm thử |
| **4. Lời** | *"Can you taste with your feet?"* · *"Butterflies can!"* |
| **5. SFX và nhạc** | Whoosh, còi rơi, splat, boing va chạm, sao choáng xoay vòng |
| **6. Chuyển vào nội dung chính** | Kính nở thành tựa |
| **7. Đánh giá** | **Thu hút 8/10.** Nhiều chuyển động, nhưng ba chủ thể trong 3 s là rối với trẻ 4–5 tuổi. Gag va đập làm nhân vật bị đau, không hợp tính cách hiền của kênh. Câu hỏi bị chen giữa hành động nên khó nghe. |

## 3. Vì sao chọn A

- Đủ ba nhịp của Task trong đúng 3 giây: hình lạ ngay khung đầu → phản ứng (cú giẫm, Miss Loupe sững sờ) → bí ẩn chưa giải (vệt sáng dưới chân bướm).
- Giữ đúng đề cương: *bàn chân The Giant giẫm bẹp cây kem*, chữ TASTE WITH FEET?!, câu móc là câu hỏi về cơ thể trẻ.
- "Butterflies can!" vẫn nói đáp án *có*, nhưng *bằng cách nào* thì để mở: hình chỉ cho thấy chân bướm lóe sáng. Phần giải thích nằm ở bí mật 1, đúng yêu cầu "không tiết lộ toàn bộ kiến thức".
- Không đổi lời, nhạc, tính cách hay phần sau 3,5 s.

## 4. Đã triển khai

| File | Thay đổi |
|---|---|
| [film.js](film.js) | `sHook`: bàn chân lơ lửng và ngọ nguậy từ khung đầu, chạm thử "boop", kem rung. Miss Loupe bật lên ở 1,6 s với biểu cảm sững sờ (`shockedLoupe`, cùng nét với ảnh bìa), rồi cười và ngước nhìn vào kính. Chân rút đi sớm hơn (1,95–2,4 s). `flutterHook`: Flutter to hơn (k 118 thay vì 78), sà xuống đậu đúng chỗ kem bẹp, dậm hai cái. Trong kính: vệt sáng phẳng màu chanh dưới sáu bàn chân và đốm sao nháy. |
| [timeline.js](timeline.js) | `HIT.hook` (mốc của nhịp móc). Khối `EV` của phần mở: thêm `boop`, dời swipe, zíp, cánh vỗ; thêm tiếng đậu và hai tiếng tink. |
| [mix.py](mix.py) | Thêm tiếng `boop` (bong bóng trầm và giọt nhỏ, từ `toon.py`). Nhạc không đổi: cú giẫm vẫn đúng 1,5 s. |
| [SOUND.md](SOUND.md) | Cập nhật bảng 3 giây đầu. |

Kết quả kiểm tra của bản mới: xem mục cuối trong [SOUND.md](SOUND.md).
