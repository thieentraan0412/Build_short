# LONG-002 · Bảng cue âm thanh

Nguồn tiếng động:
- [`_shared/audio/toon.py`](../../_shared/audio/toon.py);
- các hàm riêng trong `mix.py`: sợi tơ "zing", chân sticker ngọ nguậy, gặm lá, nhả tơ, tơ kẽo kẹt, cánh giấy phập phồng, kéo cắt, bút chì, băng dính, đèn bàn "tách", con dấu.

Danh sách sự kiện đầy đủ (212 cue, 8,3 cue / 10 s, dày nhất 5 cue trong 1 s) ở [`events.js`](events.js) → `events.json`. Mọi mốc lấy từ `timeline.js`, nên tự khớp khi giọng đổi độ dài. Nhạc: [MUSIC.md](MUSIC.md). Không dùng mẫu âm thanh của bên thứ ba.

## 3 giây đầu (hook)

| Thời điểm | Hình | Tiếng |
|---|---|---|
| 0,00 | Trang Insects nửa đêm; chữ WHO SNUCK / IN?! hiện đủ, từng dòng nảy | Chữ bật (bong bóng + ting) và hai tiếng "nảy chữ"; nhạc từ giây 0 |
| 0,00–1,60 | Sợi tơ bạc lóe ngang trang | "Zing" (vuốt chuông thủy tinh) + lấp lánh; đuôi kéo qua cú lia (L-cut) |
| 0,12 | Sticker tơ ngọ nguậy 8 chân | Chuỗi "lách tách" tí hon |
| 0,30 | | Lời (Albie, ngoài khung): "An intruder! In MY pages!" |
| 1,20 | Lia nhanh sang bàn học; chữ móc thu nhỏ đậu ở góc | Whoosh lia |
| 1,45 | Albie bật dậy, bốn tab dựng đứng (mắt tròn, vẫn cười) | Boing + bốn tiếng pop của tab |
| 3,2–3,7 | Miss Loupe trượt vào, kính lóe | Swish trượt + ting lóe |

## Chuyển cảnh

| Kiểu | Tiếng |
|---|---|
| Vòng kính lớn dần (6 lần: tựa, giữa các manh mối, vào hàng nghi phạm, vào bẫy, vào kết, vào tạm biệt) | Swish đi lên + lấp lánh |
| Lật trang (vào ký ức "Baby pictures") | Giấy lật + swish |
| Lia nhanh (móc) | Whoosh |
| Vào hàng nghi phạm | Trống dồn từ câu "Time for a lineup!" (J-cut) |
| Đèn tắt | Tiếng "tách" vào trước hình 0,08 s (J-cut), rồi khựng 1 s |

## Cue theo chương

| Chương | Hình | Tiếng |
|---|---|---|
| Hiện trường | Dot leo lên sticker; số 1…8 nảy trên từng chân | Chạy lon ton, đáp; mỗi số một tiếng "blip + ting", cao dần |
| | "8 LEGS?!" | Chữ nảy + chuông "phát hiện" |
| | Huy hiệu 6; "But WHY?" | Ding; "hử?" hai nốt |
| | Ba ô manh mối bật ra | Ba tiếng pop + lấp lánh |
| Manh mối 1 | Kính lướt dọc sợi tơ; Crumb gảy | Whoosh + lấp lánh; **"boing" như dây đàn** |
| | Trang "Baby pictures": sâu gặm lá | Gặm lá "nhóp nhép" |
| | Nhả nệm tơ → treo chữ J → nhộng → bướm | Chuỗi giọt nhỏ đi lên; còi cong; bong bóng; giấy mở; cánh vỗ + lấp lánh |
| | Flutter bay vào; "Mmm?!" | Cánh vỗ, đáp; **"Mmm!" của Flutter** |
| Manh mối 2 | Máy lia tới bụi tẩy; nhìn thẳng từ trên | Whoosh trầm; whoosh nhẹ đổi góc |
| | 8 dấu chân sáng theo lời đếm | Mỗi dấu một tiếng "pat" + ting, cao dần |
| | Rollo lăn qua để lại rãnh | Tiếng lăn (trứng phục sinh) |
| | Flutter in 6 dấu, bong bóng "6" | Sáu bước "pat" + bong bóng |
| | Bóng 8 chân có nơ lướt trên tường | Swish dài + bước tí hon; Crumb giật mình (vẫn cười); khúc khích |
| Manh mối 3 | Cánh giấy phập phồng | Giấy phập phồng (3 lần) |
| | Nhãn trong kính | Mỗi nhãn một tiếng nảy; kéo "xoẹt xoẹt", bút chì sột soạt, băng dính "xoẹt" |
| Ba ô manh mối lấp | Biểu tượng bay lên ô | Swish đi lên → chuông + lấp lánh (mỗi ô một cao độ) |
| Hàng nghi phạm | Từng nghi phạm vào | Waggle vo ve, Flutter cánh vỗ, **Chirp gáy**, Spindle thả tơ (còi đi xuống + lấp lánh), Rollo lăn |
| | Cột đo dâng tới 6 (bốn lần) | Còi đi lên + "ding" |
| | Kính POV: hai chân giấu vẫy; 7, 8 | Lách tách; hai số đếm; **cột vọt lên 8: "boing!"** |
| | Phần thân 1-2-3 / 1-2 | Bong bóng + blip |
| | Râu nảy "2" | Boing nhỏ + "tink" (ba lần) |
| | Râu giấy rủ, rơi lả tả | Còi rủ xuống; giấy rơi |
| | "BZZT! Not a bug!" (hai lần) | Buzzer "bzzt" |
| | Spindle kéo tơ lên | Còi đi lên + zip |
| | Rollo ngó quanh, lăn đi | "Hửm?" ba nốt; tiếng lăn |
| Bẫy | Mồi "YOUR STICKER HERE!" | Nảy + lấp lánh |
| | Cả đội nấp | Swish + chạy lon ton |
| | Đèn tắt (ánh trăng) | "Tách" + dâng nhẹ đi xuống; dế rõ hơn, đồng hồ tích tắc |
| | "Con bọ" đi lắc lư trên tơ | Bước nhón (mõ gỗ) + tơ kẽo kẹt |
| | Trượt chân; cuộn thành cục tơ | Còi trượt + lắc lư; xoáy + zip |
| | **Nảy như bạt nhún** (ba lần) | **Ba tiếng "boing" to dần** |
| | Đồ cải trang bung; đèn bật | Pop pop + giấy + lấp lánh; "tách"; nhảy ra |
| Thú nhận | Sticker tơ lấp lánh; tặng; Spindle kéo tơ lên | Ting + lấp lánh; swish + gõ nhẹ; còi đi lên |
| Albie một mình | Ngắm sticker; giấu dưới ruy băng | Lấp lánh nhỏ; swish + boing nhỏ của ruy băng |
| Kết | Con dấu CASE CLOSED! | "Thụp" con dấu, rồi "ta-da" (nhạc) |
| | Thẻ "6 BUG", "8 SPIDER" | Thẻ nảy + mô-típ bí mật |
| | Ba khung "Find Rollo", vòng tròn khoanh | Thẻ nảy + xoáy nhỏ; Rollo lăn ngang khung |
| | Dot đếm chân người xem 1, 2; "2 LEGS!" | Hai số đếm; chữ nảy |
| | **Sợi tơ lóe lại như khung 0** (gợi móc) | **"Zing" của móc trở lại** |
| | Spindle thả xuống; "Nope!" | Còi đi xuống; khúc khích; chữ nảy; reo vui và "ta-da" ngay sau lời |

## Nền theo bối cảnh

| Bối cảnh | Nền |
|---|---|
| Bàn học nửa đêm | Phòng tối + ù đèn bàn 120 Hz rất nhỏ; dế xa ngoài cửa sổ |
| Trang "Baby pictures" (ký ức ban ngày) | Gió nhẹ + chim xa (không đặt lúc có lời) |
| Hàng nghi phạm | Phòng yên |
| Bẫy ban đêm | Phòng tối, dế rõ hơn; đồng hồ tích tắc khẽ sau khi đèn tắt |

## Nhân vật không lời

| Nhân vật | Tiếng riêng |
|---|---|
| Flutter | "Mmm?!" (`band.mmm`) |
| Chirp | Gáy (`band.chirp`) |
| Waggle | Vo ve (`toon.buzzup`) |
| Rollo | Lăn viên tròn |

## Giọng: kiểm bằng Whisper

`build.sh` chạy `small.en` và `base.en` trên cả 107 câu. Các câu còn báo lệch đều không phải lỗi phát âm:
- **Số đếm viết bằng chữ số:** "One, two, three, four…" → "1,2,3,4".
- **"BZZT!"** → "B-Z-Z-T": câu cửa miệng của kênh, mọi tập đều vậy.
- **Đồng âm và dấu câu:** "once" / "ones", "line-up", "Who's snuck".
- **Tên riêng ở đầu câu:** "Flutter…" → "A flutter…".
- **Một tiếng thừa ở đầu câu:** "and…", "I gotcha".
- **Hơi thở cuối câu cảm thán của Dot:** "six legs in", "Eight legses". Đây là đuôi hơi thở của Kokoro sau "!", qua `voicefx.py` +3,5 nửa cung.

Các câu đã viết lại sau lần kiểm đầu, vì máy đọc sai nghĩa:

| Câu cũ | Lỗi | Câu mới |
|---|---|---|
| "Six! See? I am a bug!" (Spindle) | "6C" | "Six legs! See? I am a bug!" |
| "Silk? Only spiders make silk!" | "silky" | "Silk? Only spiders make silk, right?" |
| "Ooh! To make a cocoon?" | "Who / Blue to make" | "Oh! To make a cocoon?" |
| "A wing! A butterfly wing!" | "a wing of butterfly wings" | "A wing! It's a butterfly wing!" |
| "Hmm. Let me take a closer look." · "Hmm…" · "Hmm… are you sure?" | "hem", "HEMD", "Hymn" | "Wait… let me take a closer look." · "Really? Six?" · "Hold on… are you sure?" |
| "Flutter… six!" · "Chirp… six!" | "Flood 060", "Chopper Sixes" | "Flutter… six legs!" · "Chirp… six legs!" |
| "Zzz… I am totally asleep…" | "As easy as easy" | "Snore… snore… I am totally asleep…" (chữ zzz vẫn bay trên hình) |
| "But WHY can't she?" | "can't see" | "But WHY can't she join?" |
| "Six!" · "Eight!" (ôn bài) | "Zixxer", "later" | "Six legs!" · "Eight legs!" |
| "Nope!" cuối (Crumb, +5 nửa cung) | "nobody" | "Nope!" do Dot nói |
