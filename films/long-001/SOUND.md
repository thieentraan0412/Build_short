# LONG-001 · Bảng cue âm thanh

Tiếng động lấy từ [`_shared/audio/toon.py`](../../_shared/audio/toon.py) và các hàm riêng trong `mix.py` (bước chân lún tuyết, gió tuyết, răng lập cập, băng nứt, băng tan, hà hơi, giấy bay). Danh sách sự kiện đầy đủ (256 cue, khớp từng chuyển động) nằm ở [`events.js`](events.js) → `events.json`. Nhạc: [MUSIC.md](MUSIC.md). Không dùng mẫu âm thanh của bên thứ ba.

## 3 giây đầu (hook)

| Thời điểm | Hình | Tiếng |
|---|---|---|
| 0,00 | Mặt kính cửa sổ cận cảnh, tuyết rơi; chữ IS IT / A BUG?! hiện đủ, từng dòng nảy | Chữ bật (bong bóng + ting) và hai tiếng "nảy chữ"; hộp nhạc chạy từ giây 0 |
| 0,00–0,45 | Bông tuyết xoay rơi từ bên trái | Còi trượt rất cao + lấp lánh đi xuống |
| 0,45 | Bông tuyết đậu lên kính, lóe sáng | Ting + lấp lánh đi lên |
| 0,40 | | Lời: "Six arms... is it a bug?" |
| 0,55 | Miss Loupe trồi lên, kính đặt ngay trên bông tuyết | Boing nhỏ + swipe |
| 0,90–1,80 | Sáu cánh bông tuyết sáng lần lượt trong kính | Sáu tiếng ting đi lên |
| 2,35 | Kéo xa ra bậu cửa sổ | Whoosh lùi |

## Nhịp chung của mỗi chương

| Mốc | Hình | Tiếng |
|---|---|---|
| Mở trang | Trang sổ đóng băng, tab của chương nảy lên | Giấy + ding của tab (mỗi tab một nốt) |
| Hà hơi | Crumb hà hơi "haaa", lỗ băng tan một vòng | Hơi thở ấm + giọt nước rơi |
| Lặn vào ký ức | Lỗ băng lớn thành cả khung | Whoosh dài + lấp lánh đi lên |
| Ra khỏi ký ức | Ký ức thu về lại lỗ băng | Whoosh lùi + lấp lánh đi xuống |
| Băng nứt, tan | Vân nứt toả ra, băng tan, hình của trang hiện ra | Băng nứt giòn + giọt nước + dán sticker |
| "Secret unlocked!" | Tab của Albie sáng, ô trang ở góc nảy | Hai tiếng chuông + lấp lánh; mô-típ bí mật trên hộp nhạc |
| Lật trang | Trang cuộn sang trái | Giấy lật + swish |

## Điểm nhấn trong các ký ức

| Chương | Hình | Tiếng |
|---|---|---|
| 1 | Nhãn LEMON? LEAF? STRAWBERRY? bật lên | Chuỗi bong bóng (mỗi nhãn một cao độ) |
| 1 | Flutter bay, đậu chanh → lá → dâu | Cánh vỗ; tiếng đậu; "ừm" chua (wobble), "chậc" (còi trượt xuống); **"Mmm!"** của Flutter |
| 1 | TONGUE? FEET? → 3, 2, 1 → kính soi chân | Bong bóng ×2; tích tắc ×3; zoom; còi sai + chuông đúng |
| 2 | Crumb đi trong mê cung, ngửi ở mỗi ngả rẽ | Bước chân tí tách; "khịt"; lấp lánh của đường mùi |
| 2 | Lao nhầm xuống ngõ cụt | Bước chân dồn + còi rơi; **bonk**; còi "Nope!" |
| 2 | Chạm râu với chị kiến | "Tách" ×2 |
| 3 | Chirp gáy, Hop kéo "vĩ cầm" | Tiếng dế (ba xung 4,6 kHz); tiếng cọ chân xào xạc |
| 3 | Kính trượt xuống chân, xuống bụng; tai sáng | Đàn hạc vuốt xuống; chuông "tìm thấy" |
| 4 | Crumb rón rén; Zip liếc; Zip vụt đi; Crumb ngã sấp | Mõ gỗ nhón chân; blip; "zíp"; bịch + wobble |
| 4 | Đêm xuống; Blink sáng đuôi; mật mã ● ● ━; bạn trong cỏ đáp | Swell đi xuống; swell đi lên; ting dài ngắn ×3; ting đáp (bên phải, sau một nhịp) |
| 4 | Tổ ong: Waggle nhảy, vạch nhảy kéo thành mũi tên | Vo ve; swipe |

## Chương 5 · vườn tuyết

| Hình | Tiếng |
|---|---|
| Trang trống | Blip; chuỗi bong bóng ở câu hỏi lớn |
| Albie xìu xuống; Crumb ôm ủ ấm; bong bóng nghĩ: kiến túm tụm dưới đất | Còi trượt xuống; bong bóng ấm + lấp lánh; bong bóng nghĩ |
| Miss Loupe lách qua khe cửa sổ | Còi đi lên + pop; gió ùa vào |
| Ngoài vườn: run, răng lập cập; đi tới tổ ong | Gió tuyết; lập cập; bước chân lún tuyết |
| Bật kính nhiệt: quả bóng ong rực cam | Swell + lên dây cót |
| Nhấc lá: bọ rùa ngủ thành đám; Dot thức dậy đếm "1, 2, 3" | Lá khô xào xạc; blip; tích tắc ×3; ngáp nhỏ |
| Sâu gấu len đông cứng; bong bóng mùa xuân | Lấp lánh; bong bóng |
| Ba bí mật mùa đông | Chuông "tìm thấy" + dán ×3 + mô-típ bí mật |
| Kính mờ, bão tuyết, lạc đường | Swish mờ + swell đi xuống; gió mạnh; còi rơi |
| Kính nhiệt bật lại → thấy khung cửa ấm → lội tuyết về | Swell + lên dây cót; chuông; bước chân lún tuyết; lách vào nhà |

## Kết, đố vui, tạm biệt, Rollo

| Hình | Tiếng |
|---|---|
| Ba sticker mùa đông bay vào trang cuối; cả trang tan | Swipe ×3 + dán; băng nứt + giọt nước |
| Bốn câu đố: tấm che "?" chờ trẻ trả lời rồi bật ra | Giấy; tích tắc ×3 trong lúc chờ; chuông khi lộ đáp án |
| Cả nhóm ngáp | Còi trượt xuống ×2 |
| Albie hắt xì, sticker bay như tuyết | Lên dây cót; **"CHOO!"**; giấy bay lả tả |
| Sticker đậu đúng chỗ bông tuyết đầu phim; chữ móc trở lại | Dán; chữ bật + hai tiếng nảy chữ (đúng tiếng của khung đầu) |
| Sticker Rollo lăn dọc bậu cửa sổ; bốn chỗ Rollo đã trốn | Lăn lộc cộc; bong bóng + ding ở mỗi khung |
| Thẻ kết "See you in spring!" | Swell; ting bông tuyết |
