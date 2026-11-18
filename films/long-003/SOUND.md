# LONG-003 · Bảng cue âm thanh

Nguồn tiếng động:
- [`_shared/audio/toon.py`](../../_shared/audio/toon.py);
- các hàm riêng trong `mix.py`: viên tròn lăn, chân Miss Loupe lạch bạch, bước kiến tí tách, lá sột soạt, ánh lóe của Uncle Telly, "bloop" của Blink, "THỊCH", bàn tay The Giant lướt, "tõm".

Danh sách sự kiện đầy đủ (232 cue, 9,1 cue / 10 s, dày nhất 7 cue trong 1 s) ở [`events.js`](events.js) → `events.json`. Mọi mốc lấy từ `timeline.js`, nên tự khớp khi giọng đổi độ dài. Nhạc: [MUSIC.md](MUSIC.md). Không dùng mẫu âm thanh của bên thứ ba.

## 3 giây đầu (hook)

| Thời điểm | Hình | Tiếng |
|---|---|---|
| 0,00 | Vườn đêm dưới Dải Ngân Hà; chữ LOST / AT NIGHT! hiện đủ, từng dòng nảy | Chữ bật (bong bóng + ting) và hai tiếng "nảy chữ"; nhạc từ giây 0 |
| 0,00–4,6 | Rollo đẩy viên tròn, Miss Loupe chạy trên đỉnh | Viên tròn lăn rì rì + chân chạy lạch bạch (mõ nhỏ hai cao độ) |
| 0,15 | | Lời (Miss Loupe, trên hình): "Whoa! Rollo! I can't stop!" |
| ≈ 1,6 | Crumb chạy theo bên cạnh, râu bay | Chạy lon ton |
| ≈ 1,9 | | "Can I hold the lens?" – "Not NOW!" |
| ≈ 4,6 | Viên tròn vấp hòn sỏi; Miss Loupe bay vèo vào bóng tối | **"Boing"** + còi vút lên + lấp lánh; đuôi tiếng kéo qua cú lia (L-cut) |
| ≈ 5,0 | Lia nhanh sang lối đi | Whoosh lia |

## Chuyển cảnh

| Kiểu | Tiếng |
|---|---|
| Đốm sáng của Blink lớn dần (10 lần, khi Miss Loupe còn lạc) | Dâng lấp lánh + một tiếng chuông thủy tinh |
| Vòng kính trở lại (4 lần, từ lúc Miss Loupe đã về) | Swish đi lên + "ting" kính |
| Lia nhanh (móc) | Whoosh |
| Vào chặng ánh lóe | Tiếng lóe "ting" của Uncle Telly vào trước hình 0,5 s (J-cut) |
| Vào bóng nghĩ sa mạc | Vuốt đàn hạc + lấp lánh |
| Lật trang (gag cuối) | Giấy lật + glockenspiel chạy xuống → "tõm" |

## Cue theo chương

| Chương | Hình | Tiếng |
|---|---|---|
| Cả đội | Albie nhảy, tab dựng; Crumb chạy tới hỏi; Rollo lăn về | Bốn tiếng pop của tab; chạy lon ton; "hử?" hai nốt; tiếng lăn |
| Tựa | Miss Loupe nhỏ xíu bay ngang trời sao | Còi vút nhỏ + lấp lánh (dưới nhạc hiệu) |
| Bản đồ | Trang mở, sao HOME sáng; Rollo chỉ | Giấy; chuông "phát hiện"; blip |
| | Mũi tên chấm chạy ra khỏi mép, dấu "?" to | Chín blip đi lên + còi; chữ nảy |
| | Các trang của Albie phần phật | Pop của tab + giấy phập phồng |
| Lập đội | Cả đội xếp hàng; số 1–5 nảy | Chạy lon ton; mỗi số một "blip + ting" cao dần |
| | Đèn Blink bật | **Vuốt chuông thủy tinh** |
| Cách 1 | Năm ô "1 2 3 4 5" bật ra | Năm tiếng pop |
| | Waggle vọt lên, nhảy số 8 | Vo ve; xoáy + vo ve lắc mông + lấp lánh |
| | Máy ngửa lên trời; "NO SUN?"; "NOPE!" | Swish trầm; "hử?"; chữ nảy (sau khựng 1 s) |
| | Waggle chóng mặt, đáp lên viên tròn | Xoáy + còi đi xuống; đáp + boing nhỏ |
| Miss Loupe 1 | Kẹt trong khe, kính lóe; Spindle trên mạng | Ting lóe; khúc khích (sau lời) |
| Cách 2 | Crumb chạm râu; khung ngửi, chấm mùi hồng | "Sniff, sniff" + râu "tip-tip"; tám blip |
| | Đàn kiến bò tới, chạm râu; số 1–6 | Bước kiến tí tách; hai tiếng gõ nhẹ; số đếm |
| | Dolly: "UNDER!", "OVER!" | Bước kiến; chữ nảy; lá sột soạt; nhảy |
| | "THE END?"; đàn kiến "bye!" | Chữ nảy; blip; bước kiến xa dần |
| Cách 3 | Bóng nghĩ phình ra | Ba pop + bong bóng |
| | Kiến sa mạc đi ra, nhặt hạt | Bước kiến (trầm hơn); "plip" |
| | Đi thẳng về, vạch bước sáng dần | **Mười hai "tick" đi lên** |
| | Dot đếm 10 bước | Mỗi bước một tiếng chân + ting, cao dần; "10 STEPS!" nảy |
| Miss Loupe 2 | Nghiêng kính nhìn xa: "BLURRY!" | Swish; lắc lư + chữ nảy |
| | Ánh lóe nhỏ trên cọc | "Ting" thủy tinh nhỏ (gài trước Uncle Telly) |
| Cách 4 | Rollo trèo lên viên tròn, xoay một vòng | Chạy lon ton; xoáy + dâng |
| | **Máy ngửa vút lên Dải Ngân Hà** | **Dâng lấp lánh 2,4 s** (cùng vuốt đàn hạc của nhạc) |
| | Vệt thẳng; "STRAIGHT!" | Tiếng lăn; chữ nảy |
| | Bóng mây trôi qua | "Whoosh" mềm, trầm |
| | Vệt ngoằn ngoèo; cả đội đi vòng vèo | **Còi lắc lư** + tiếng lăn + hai tiếng "bonk" nhẹ; "WIGGLES!" |
| | Mây tan | Dâng + lấp lánh |
| Cách 5 | Uncle Telly quét ống nhòm; nhìn qua ống nhòm | Còi nhỏ lên xuống; hai tiếng "cạch" |
| | Tròng kính nháy ba lần; ba ánh lóe xa; nháy đáp | **"Ting" thủy tinh, mỗi lần cao hơn** (xa thì nhỏ) |
| | Blink nháy mật mã | **Ba tiếng "bloop"** |
| | Vệt sáng chỉ chỗ | Còi đi xuống + blip |
| Năm ô lấp | Biểu tượng bay lên ô | Swish đi lên → chuông + lấp lánh (mỗi ô một cao độ); ô 5 lấp ngay sau câu "She's over there! Let's go!" |
| Cao trào | Cả đội tới phiến đá; đốm lấp lánh | Mười bước chân nhỏ; ting + lấp lánh |
| | Nối chuỗi kéo "HEAVE!" | Ba tiếng "heave" (boing trầm, cao dần) |
| | **THỊCH**: đất rung, bóng lớn | **Tiếng thụp trầm mềm** + một nhịp timpani (nhạc), rồi khựng 0,8 s |
| | "NOPE!" | Chữ nảy |
| | Bàn tay hạ xuống, nghiêng phiến đá | "Whoosh" mềm trầm; đá "rộp" |
| | Miss Loupe bật ra, đứng lên tay, được nâng lên | **"Pop"** + còi lên + lấp lánh; đáp; dâng |
| | Góc nhìn The Giant: kính mở to, "HELLO!" | Riser + còi; chữ nảy + reo vui; Spindle khúc khích (sau lời) |
| | Đặt xuống; gạt lá; sao sáng dọc lối về; vẫy | Whoosh; đáp; **lá sột soạt**; lấp lánh; whoosh nhỏ |
| Crumb cầm kính | "NOW!"; Crumb ôm kính | "Hử?"; chữ nảy; nhảy; ting + lấp lánh |
| Đường về | Ba biểu tượng ôn bài | Thẻ nảy (và mô-típ bí mật của nhạc ngay sau đáp án) |
| Về nhà | Albie nhảy cẫng | Pop của tab + hai cú nhảy |
| Bản đồ sáng | Chín chỗ sáng lần lượt; đường đi đêm nay | Chín bong bóng + lấp lánh, cao dần; swish + mười blip |
| | Dán góc GARDEN EDGE | Giấy + "thụp" nhẹ, rồi "ta-da" (nhạc) |
| Six Legs Song | Spindle thả xuống; "BZZT!"; kéo tơ lên | Còi đi xuống; buzzer; khúc khích; còi đi lên + zip |
| Tìm Spindle | Ba khung nhỏ, vòng tròn khoanh | Thẻ nảy + xoáy nhỏ; khúc khích |
| Gag cuối | **Crumb chạy trên viên tròn** (gợi móc) | **Tiếng chữ móc + viên tròn lăn + chân lạch bạch trở lại** |
| | Lật trang; "SPLASH!" | Giấy lật; **"tõm"** (nước bắn + giọt rơi) |
| | "THE STARS!" | Chữ nảy; reo vui và "ta-da" ngay sau lời |

## Nền theo bối cảnh

| Bối cảnh | Nền |
|---|---|
| Vườn đêm, lối đi | Gió nhẹ trong cỏ; dế xa |
| Rìa vườn, cỏ cao, cọc hàng rào | Gió qua cỏ cao (to hơn), dế rõ hơn |
| Bóng nghĩ sa mạc (ban ngày) | Gió cát nhẹ, không dế |
| Tựa, trang bản đồ, trang ao | Gió rất nhỏ, dế thưa |

## Nhân vật không lời

| Nhân vật | Tiếng riêng |
|---|---|
| Waggle | Vo ve (`toon.buzzup`) |
| Uncle Telly | Ánh lóe "ting" thủy tinh |
| The Giant | Đất rung mềm ("THỊCH"), bàn tay lướt "whoosh" trầm |
| Spindle | Cười khúc khích (`toon.giggle`), còi tơ |
| Đàn kiến, kiến sa mạc | Bước tí tách |

## Giọng: kiểm bằng Whisper

`build.sh` chạy `small.en` và `base.en` trên cả 97 câu. Các câu còn báo lệch đều không phải lỗi phát âm:
- **Tên riêng:** "Rollo" → "Rolo", "Miss Loupe" → "Miss Loop / Lupe / Luba".
- **Số đếm viết bằng chữ số:** "six, seven, eight, nine, ten!" → "678-910".
- **"BZZT!"** → "B-Z-Z-T": câu cửa miệng của kênh, mọi tập đều vậy.
- **Đồng âm và dấu câu:** "sun" / "sons", "too" / "two", "Two" / "Too", "bees" / "B's", "You're" / "Your", "Wow" / "Well".
- **Một tiếng thừa ở đầu câu:** "By using…", "A sniff…", "The smell trails", "and look closely".
- **Hơi thở cuối câu cảm thán của Dot và Crumb** (Kokoro, sau `voicefx.py`): "So straighter", "The Sunny", "The star, is it?", "find hers".
- **Blink (+8 nửa cung):** "Nope!" → "Note that" (chỉ `base.en`), "light" → "knight" (chỉ `small.en`). Mỗi câu qua một trong hai mô hình; chữ NOPE! hiện trên hình cùng lúc.

Các câu đã viết lại sau lần kiểm đầu, vì máy đọc sai:

| Câu cũ | Lỗi | Câu mới |
|---|---|---|
| "Hmm. My ball feels... lighter." (Rollo) | Kokoro đọc "Hmm" thành "hem" | "Oh my. My ball feels... lighter." |
| "No trail? Hmm..." (Crumb) | như trên | "No trail? Let me think..." |
| "Oh my. A pond!" (Rollo) | "upon" | "Oh my. It's a pond!" |
| "Not NOW! Wheee!" (Crumb) | "are we?" | "Not NOW! Yippee!" |
| "Rollo! That's the END of the page!" (Albie) | Kokoro đánh vần "E-N-D" | Chữ trên phụ đề giữ nguyên; máy đọc bản viết thường (`say`) |

Giọng Mr. Rollo (lần đầu có nhiều lời): thử A/B bảy giọng, chọn `am_michael` −2 nửa cung (≈ 110 Hz). Bảng so sánh ở [`_shared/voice-tests/README.md`](../../_shared/voice-tests/README.md).
