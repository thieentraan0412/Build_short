# Đánh giá SHORT-001 → SHORT-004 theo 7 nhóm tiêu chí

Ngày 06/11/2026. Bộ tiêu chí viết thành quy tắc ở [`_shared/QUALITY.md`](_shared/QUALITY.md). Phần đo được do [`_shared/qa.py`](_shared/qa.py) kiểm; phần còn lại đánh giá theo checklist thủ công cuối `QUALITY.md`.

## Kết quả tổng

| | SHORT-001 | SHORT-002 | SHORT-003 | SHORT-004 |
|---|---|---|---|---|
| Loại | Tập A, 52 s | Bản B, 22 s, lặp | Bản B, 24 s, lặp | Tập A, 52 s, lặp |
| Đề tài | Giác quan ở chân (3 bí mật) | Bướm nếm bằng chân | Dế có tai ở chân | Kiến ngửi bằng râu (Crumb ra mắt) |
| `qa.py` trước lượt này | chưa có công cụ | **1 CHƯA ĐẠT** (lời L05 bị che) | đạt | **2 CẢNH BÁO** (khoảng chết) · giọng Crumb sát Miss Loupe |
| `qa.py` bây giờ | 23/23 | 23/23 | 23/23 | 24/24 |
| Tiêu chí 7 (giọng trẻ em) | Chưa: chỉ có giọng người lớn | Chưa: chỉ có giọng người lớn | Chưa: chỉ có giọng người lớn | Một phần: Crumb là giọng trẻ em |

## 1. Hook: 3 giây đầu

| | 001 | 002 | 003 | 004 |
|---|---|---|---|---|
| Lời đầu tiên | 0,0 s | 0,1 s | 0,1 s | 0,1 s |
| Câu móc | "Can you taste with your feet?" | "What if your socks could taste your snack?" | "What if your ears were on your knees?" | "Could you smell with your fingers?" + Crumb "Ants can! Well, sort of!" |
| Chuyển động giây đầu (≥ 1,2) | 3,0 | 13,5 | 5,2 | 3,1 |
| Cue tiếng động 0–3 s (≥ 5) | 16 | 11 | 16 | 7 |
| Logo / lời chào | Nhạc hiệu 2 s ở 4–6 s, sau móc | không có | không có | Nhạc hiệu 2 s ở 4–6 s, sau móc |

**Đạt cả bốn.** Mỗi tập mở bằng một câu hỏi về chính cơ thể trẻ, có hình động và tiếng động ngay khung đầu. Nhịp 0–1 / 1–2 / 2–3 s ghi trong `HOOK.md` (001, 002) và `TREATMENT.md` §7 (003, 004).

## 2. Giữ chân người xem

| | 001 | 002 | 003 | 004 |
|---|---|---|---|---|
| Hình đứng yên ≥ 2,5 s khi không có lời | không | không | không | không |
| Khoảng chết ≥ 1,8 s | không | không | không | **2 chỗ → đã sửa** |
| Độ dài trung bình mỗi cảnh (≤ 12 s) | 6,5 s | 11,0 s | 12,0 s | 7,4 s |
| Tốc độ lời (0,8–2,2 từ/s) | 1,62 | 1,55 | 1,67 | 1,23 |

- **Đạt sau khi sửa.** SHORT-004 có hai đoạn chỉ có nhạc, không lời và không tiếng động:
  - 21,6–24,1 s: kính trượt dọc đường mùi. Đã thêm bước chân cả đàn kiến và tiếng lấp lánh theo hạt mùi bốc lên.
  - 33,4–35,5 s: cuối cảnh trại rệp. Đã thêm một gag: giọt ngọt thứ hai rơi trúng vụn bánh, Crumb nhảy cẫng.
- Cảnh trung bình 12 s ở 003 nằm đúng ngưỡng. Đó là bản B chỉ có hai cảnh, và trong cảnh luôn có kính hoặc máy quay di chuyển.

## 3. Nội dung và câu chuyện

| | 001 | 002 | 003 | 004 |
|---|---|---|---|---|
| Mở · giữa · kết | Câu hỏi → 3 bí mật → kết nối câu móc ("Hey... is it tasting me?") | Câu hỏi → bí mật → gag rồi lặp | Câu hỏi → bí mật → gag rồi lặp | Câu hỏi → 3 bí mật → gag rồi lặp |
| Bất ngờ / hài | "On its head?" → "Nope!"; bướm nếm thử Miss Loupe | Flutter hút góc trang sổ: "NOT my pages!" | "NOPE!" to quá, Chirp bịt... đầu gối: "Oops! Sorry!" | Bản đồ → "Nope!"; Rollo lăn qua, đàn kiến khựng; giọt ngọt rơi lên vụn bánh; Crumb vác kính, ngã vào cây kem |
| Thông điệp | "Go outside with a grown-up, and look closely!" | Một bí mật thấy được trong kính | Một bí mật thấy được trong kính | Ba bí mật thấy được; tính tò mò và kiên nhẫn của Crumb ("Not yet!") |
| Dữ kiện | `FACTS.md` có nguồn | có | có | có ("Some ants…": đúng phạm vi nguồn) |

**Đạt.** Lời ngắn, mỗi ý một câu, hợp trẻ 4–8 tuổi; không có cảnh đáng sợ. Bản B chỉ mang một bí mật, đúng khung kế hoạch §4.3.

## 4. Âm thanh và nhạc nền

| | 001 | 002 | 003 | 004 |
|---|---|---|---|---|
| Màu nhạc riêng (`MUSIC.md`) | "Tổ khúc khu vườn" | Calypso, steel pan | "Night Band" swing | "Ant Parade" diễu hành |
| Độ to (−14 ± 1 LUFS) | −14,0 | −13,9 | −13,9 | −13,9 |
| Đỉnh thật (≤ −1 dBTP) | −1,5 | −1,4 | −1,5 | **−0,9 → −1,7** |
| Lời rõ nhất / kém nhất (≥ 10 dB) | kém nhất 10,7 (L07) | **4,0 (L05) → 10,1 (L01)** | kém nhất 14,5 | kém nhất 12,0 |
| Tiếng động / 10 s (≥ 4) | 16,2 | 18,6 | 20,0 | 11,7 |

- **Đạt sau khi sửa.** SHORT-002: câu "So out comes its curly straw!" bị còi trượt và nốt sáo dài ở giữa dải giọng che mất. Đã dời còi lên dải cao, dời sáo ra sau câu, hạ vài lớp tiếng. Câu này lên 11,2 dB. Chi tiết: [`films/short-002/MUSIC.md`](films/short-002/MUSIC.md), mục *Lượt QA*.
- SHORT-004: đỉnh thật vượt sau khi nén AAC. Đã chừa thêm 0,7 dB đỉnh ở khâu master.
- Nhạc đổi theo cảnh: có khựng nhạc cho gag, khoảng lặng trước đáp án và mô-típ bí mật đô–mi–sol ở mỗi phát hiện. Bảng Soundtrack Timeline của từng tập nằm trong `MUSIC.md`.

## 5. Hình ảnh và chuyển động

| | 001 | 002 | 003 | 004 |
|---|---|---|---|---|
| Khung đen / trống | 0 | 0 | 0 | 0 |
| Chớp sáng mạnh (≤ 3/s) | ≤ 1/s | ≤ 1/s | ≤ 1/s | ≤ 1/s |
| Độ rực màu (≥ 0,35) | 0,65 | 0,60 | 0,65 | 0,60 |

**Đạt.**
- Biểu cảm dùng bộ biểu cảm chung (`ex()`, nhép miệng theo giọng thật, chớp mắt), với tư thế ngạc nhiên rõ ở mỗi phát hiện.
- Lỗi che khuất, lơ lửng và cắt mép đã soi bằng khung tĩnh và sửa trong lúc dựng; danh sách nằm trong `TREATMENT.md` §7 của từng tập. Ví dụ ở 004: vụn bánh che râu, người Miss Loupe che lá rệp, cây kem bị che.

## 6. Tương tác và khả năng xem lại

| | 001 | 002 | 003 | 004 |
|---|---|---|---|---|
| Khung cuối nối khung đầu | Không lặp hình; câu cuối nối câu móc | lặp liền (chênh 15,9/255) | lặp liền (7,7) | lặp liền (6,8) |
| Chi tiết để tìm lại | Rollo trốn | (bản B: vòng lặp) | (bản B: vòng lặp) | Rollo lăn qua + Spindle ló ra |
| Kết có điểm nhấn | có | có | có | có |

**Đạt, với một lưu ý.** Kênh đăng dạng **Made for Kids**: YouTube tắt bình luận, nên phim không kêu gọi bình luận hay đăng ký. Tương tác đến từ:
- câu hỏi để trẻ trả lời to ("On its head?" → "Nope!");
- trò tìm Rollo;
- vòng lặp liền và gag cuối.

## 7. Giọng nhân vật

| Nhân vật | Giọng | Cao độ | Kiểu |
|---|---|---|---|
| Miss Loupe | `af_heart` 0,9 | 211–218 Hz | Người lớn, nữ, vui |
| Albie | `bm_lewis` 0,8 | 97–102 Hz | Người lớn, nam trầm |
| Crumb (004) | `af_jessica` 0,85, +5 nửa cung | 270 Hz | **Trẻ em** |
| Flutter, Chirp | Không lời | | Tiếng riêng: "Mmm!", gáy |

- **Đạt:** mỗi nhân vật có giọng riêng, không nhầm lẫn được. Hai giọng gần nhau nhất (Crumb và Miss Loupe) cách 4,1 nửa cung. Bản đầu Crumb chỉ cách 3,2, đã nâng từ +4 lên +5.
- **Chưa đạt hết ý "giọng trẻ em, ngộ nghĩnh":**
  - Miss Loupe và Albie là giọng người lớn, đúng phân vai trong kế hoạch §11.3, nên 001–003 không có giọng trẻ em nào.
  - Đổi hai giọng này sẽ đổi giọng của mọi tập và mọi câu cửa miệng, nên cần chủ kênh nghe và chọn. Mẫu A/B và gợi ý (Miss Loupe B, Albie C): [`_shared/voice-tests/`](_shared/voice-tests/).

## Đã bổ sung vào quy trình

| Chỗ | Thêm gì |
|---|---|
| [`_shared/QUALITY.md`](_shared/QUALITY.md) | 7 nhóm tiêu chí thành quy tắc có ngưỡng, bước nào phải làm, cách kiểm, checklist thủ công |
| [`_shared/qa.py`](_shared/qa.py) | Kiểm tự động 23–24 mục, in bảng ĐẠT / CẢNH BÁO / CHƯA ĐẠT, ghi `out/qa.json` |
| `films/short-00x/build.sh` | Bước cuối chạy `qa.py` |
| [`CLAUDE.md`](CLAUDE.md) | Mọi Short và video của kênh phải theo `QUALITY.md`, không giao khi còn CHƯA ĐẠT |
| [`KE-HOACH-PHAT-TRIEN-KENH.md`](KE-HOACH-PHAT-TRIEN-KENH.md) §11.1, §11.3 | Bước "Tự kiểm tra" dùng `qa.py` + checklist; quy tắc giọng (≥ 3 nửa cung giữa hai nhân vật, nhân vật trẻ em ≥ 240 Hz) |
| [`_shared/voices.js`](_shared/voices.js) | Crumb +5 nửa cung |
