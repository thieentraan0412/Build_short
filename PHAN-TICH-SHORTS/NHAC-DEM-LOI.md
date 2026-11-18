# Nhạc đệm dưới lời, đổi cảnh vui tươi, chủ đề của tập (lượt 16/11/2026)

Yêu cầu trong `Task.md` (16/11/2026): *"Nhạc nền đang đồng điệu, cần vui nhộn và đổi nhạc vui tươi khi chuyển cảnh và đệm nhạc khi nhân vật thoại lời, hãy tổng hợp các kỹ thuật nâng cấp và sửa lại quy trình, sau đó áp dụng vào long 002."*

**Tóm tắt.**
- **Vì sao nhạc nghe "đồng điệu".** Nhân vật nói trong 50–70 % thời lượng mỗi tập. Mỗi khi có lời, bộ máy nhạc tắt giai điệu, bỏ nửa số tiếng đệm, rồi khâu trộn hạ thêm phần nhạc ở dải giọng khoảng 15 dB. Phần lớn phim vì vậy chỉ còn bass + kick, giống nhau ở mọi cảnh, dù bảng cảnh nhạc có 17 điệu khác nhau.
- **Lượt này có 8 kỹ thuật.** Nhạc vẫn đệm hợp âm và có một bè phụ ở dải cao trong lúc nhân vật nói, nhường giọng vừa đủ, và chỉ hạ thêm ở đúng câu nào bị lấn. Mỗi lần đổi cảnh có một dấu nhạc vui, nghe ra ngay, và cả tập có một chủ đề để nhớ.
- **LONG-002:**
  - nhạc ở dải giọng tụt 9,6 dB khi có lời → 6,8 dB;
  - 3,8 nốt đệm mỗi giây lời;
  - chủ đề hát lại 6 lần;
  - lời vẫn rõ: thấp nhất 10,8 dB, trung vị 15,6 dB;
  - `qa.py` 41/41 đạt.
- **Quy trình:** quy tắc *(Đệm lời)* trong [`_shared/QUALITY.md`](../_shared/QUALITY.md) §4, ba mục mới trong `qa.py`, tùy chọn `accomp=True` trong [`groove.py`](../_shared/audio/groove.py), hàm `speech_guard` trong [`toon.py`](../_shared/audio/toon.py).

## 1. Chẩn đoán

Đo trên các stem nhạc. "Tụt" là mức nhạc ở dải 300–4000 Hz (dải mang chữ của giọng nói) lúc không lời so với lúc có lời.

| Tập | Lời chiếm | Nhạc tụt khi có lời | Đổi cảnh "vào mềm / nhẹ dưới lời" |
|---|---|---|---|
| SHORT-001…010 | 42–69 % | 8,5–13,9 dB | 1–4 chỗ / tập (tới 40 % số chỗ đổi) |
| LONG-001 | 53 % | 9,2 dB | — |
| LONG-002 (bản đầu) | 64 % | 9,6 dB | 1 / 33 |

LONG-002 bản đầu, đo riêng lúc có lời:
- phần nhạc còn lại chủ yếu là dải trầm (bass, kick);
- dải giọng thấp hơn lời khoảng 18 dB, dư xa so với mức tối thiểu 10 dB mà `QUALITY.md` yêu cầu.

Như vậy có khoảng 8 dB "đất" để đưa lớp đệm trở lại mà lời vẫn rõ.

Bốn nguyên nhân, cả bốn nằm trong bộ máy dùng chung nên mọi tập đều mắc:
1. **Lớp nhịp tắt giai điệu và bỏ nửa tiếng đệm dưới lời** (`UNDER` trong `groove.py`: comp 0,6, bỏ một nửa số nốt; giai điệu chỉ chen vào khoảng trống). Dưới giọng Albie còn bỏ cả bass.
2. **Khâu trộn nhường giọng quá tay:** `duck(mus, ve, .82, .55)`, tức dải giọng −15 dB và cả phần ngoài dải −7 dB. Tiếng lấp lánh và bass cũng chìm theo.
3. **Đổi cảnh dưới lời bị làm mềm:** cách chuyển `soft` / `tail`, cảnh sau "vào mềm". Lúc cắt cảnh thường có người đang nói, nên chỗ đổi nhạc gần như không nghe ra.
4. **Không có giai điệu để nhớ.** Câu đáp giữa các câu thoại là các câu ngắn sinh theo dáng, khác nhau mỗi lần. Nghe nhiều cảnh vẫn không có "bài" nào.

## 2. Tám kỹ thuật nâng cấp

| # | Kỹ thuật | Làm ở đâu | Tác dụng |
|---|---|---|---|
| K1 | **Đệm đủ dưới lời:** tiếng đệm (comp, arp) giữ đủ nhịp của điệu, chỉ nhỏ lại (`UNDER_A`: comp 0,72, arp 0,8, clap 0,5), vẫn ở dải cao (≥ C5), nốt ngắn | `Groove(..., accomp=True)` | Mỗi cảnh giữ được "nhịp tay" riêng (ska chặn phách lẻ, valse um-pa-pa, swing Charleston…) trong lúc nói |
| K2 | **Bè phụ ở dải cao:** dưới lời, một nhạc cụ sáng rải 3–4 nốt hợp âm mỗi ô ở C6–D7, đi lên rồi đi xuống. Nhịp theo phong cách (`COUNTER`): nảy thì lệch phách, phép thuật thì đều từng phách, hài thì có nốt láy | `accomp=True`; `counter=` của `G.sec` (mặc định: nhạc cụ hát chính nếu sáng, không thì theo phong cách) | Màu nhạc cụ của cảnh nghe ra trên vùng nguyên âm của giọng, không lấn chữ |
| K3 | **Nhường giọng vừa đủ:** `duck(mus, ve, .66, .3)`, tức dải giọng −9 dB, ngoài dải −3 dB | `mix.py` | Bass, kick, lấp lánh dưới lời gần như giữ nguyên; chỉ dải chữ lùi lại |
| K4 | **Vòng bảo vệ lời rõ:** sau khi trộn, đo từng câu như `qa.py`; câu nào lời chưa hơn nền 11 dB thì hạ riêng nhạc trong câu đó đúng phần thiếu | `T.speech_guard(mus, fx, vox, LINES, 11.)` | Lớp đệm dày ở mọi chỗ, chỉ lùi ở vài câu. LONG-002: 9/107 câu, mỗi câu 0,6–2,9 dB |
| K5 | **Điểm nhấn viết tay đặt sau lời:** mô-típ bí mật, "bum-bum", "ta-da" rơi ngay khi câu vừa dứt, không đè lên chữ | `mix.py` (`Lend(...)`) | Câu trả lời của trẻ và câu cửa miệng rõ; điểm nhấn thành tiếng "đáp" vui |
| K6 | **Đổi cảnh nghe ra, vui tươi:** dưới lời không còn "vào mềm"; nếu không cách chuyển nào hợp thì dùng `bump` (nốt mồi + hợp âm "ta!" ở dải cao của cảnh mới), rồi phách đầu được nhấn theo phong cách | `accomp=True` | Mỗi lần cắt cảnh là một lần nhạc "bật" sang màu mới, kể cả giữa câu |
| K7 | **Chủ đề của tập:** một câu 6–8 nốt vui (`G.theme`). Nhạc cụ hát chính của cảnh hát nó ở câu đáp đầu cảnh, theo giọng, điệu, tốc độ của cảnh, cách nhau ≥ 18–20 s | `G.theme(steps, xs, every)` | Phim có một "bài" để nhớ; mỗi cảnh là một biến tấu, không lặp nguyên |
| K8 | **Chừa đỉnh cho bộ mã AAC:** lớp đệm dày hơn thì `T.master(mix, 10.5)` (cũ 11,0). Giữ lọc thấp 8,5 kHz cho giọng và sườn trước 1,5 ms cho tiếng động (đã có từ bản đầu LONG-002) | `mix.py` | Đỉnh thật ≤ −1 dBTP sau khi nén AAC |

Những gì giữ nguyên, vì đã đúng:
- mỗi cảnh một điệu, một BPM, một nhạc cụ hát chính (Sound Design Plan);
- dưới giọng Albie vẫn bỏ bass;
- câu đáp của giai điệu vẫn chen vào khoảng trống;
- khựng hài ≤ 1,2 s;
- mọi cảnh giọng trưởng.

Tùy chọn `accomp=False` (mặc định) cho ra **đúng từng nốt** như trước: đã thử lại trên cùng một kịch bản, cả `plan=False` lẫn `plan=True`. Các tập đã đăng không đổi tiếng nếu chưa bật.

## 3. Áp dụng vào LONG-002

[`films/long-002/mix.py`](../films/long-002/mix.py):
- `Groove(..., plan=True, accomp=True)`.
- Chủ đề "Who snuck in?": đô–mi–sol–la–sol–mi–rê–sol, `G.theme([0, 4, 7, 9, 7, 4, 2, 7], [0, 1, 2, 3, 4, 6, 7, 8], every=18.)`. Hát lại ở 6 cảnh:
  - glockenspiel (ảnh hồi bé của Flutter);
  - marimba (Flutter in 6 dấu);
  - trumpet (hàng nghi phạm);
  - dây pizzicato (đêm bẫy);
  - celesta (thú nhận);
  - piano ragtime ("Did you spot Rollo?").
- Bè phụ dưới lời đổi theo cảnh, 11 nhạc cụ: vibraphone, xylophone, ukulele, celesta, glockenspiel, marimba, dây pizzicato, piano đồ chơi, piano, đàn hạc, trống thép.
- `duck(.66, .3)` và `speech_guard(…, 11.)`; `T.master(mix, 10.5)`.
- Dời ra sau lời: "bum-bum" của bassoon (sau "Rules are rules!"), mô-típ bí mật ở hai thẻ "6 BUG", "8 SPIDER". Câu tựa đè lên nhạc hiệu được nhạc lùi −6 dB như câu cửa miệng.

| Số đo | Trước | Sau |
|---|---|---|
| Nhạc ở dải giọng tụt khi có lời | 9,6 dB | **6,8 dB** |
| Nốt đệm có cao độ dưới lời | (không ghi) | **627 nốt, 3,8 / giây lời** |
| Chủ đề của tập | 0 | **6 lần** |
| Đổi cảnh "vào mềm" có lời ở điểm cắt | 0 (1 chỗ không lời) | 0 (1 chỗ không lời) |
| Lời rõ hơn nhạc + tiếng động, câu thấp nhất (ngưỡng 10 dB) | 11,7 dB | **10,8 dB** (trung vị 15,6 dB) |
| Nhạc có nhịp liền | 96 % | 97 % (trung vị 6 nốt/s) |
| Độ to · đỉnh thật | −14,0 LUFS · −2,3 dBTP | −14,0 LUFS · −1,9 dBTP |
| `qa.py` | 38 đạt | **41 đạt** (thêm 3 mục mới), 0 cảnh báo |

Hình không đổi (không render lại); chỉ thay tiếng, phụ đề giữ nguyên.

## 4. Quy trình mới

| Bước | Thêm gì |
|---|---|
| Treatment | Bảng nhạc ghi thêm **chủ đề của tập** (câu nhạc, ý nghĩa) và bè phụ dự kiến của các cảnh nhiều lời |
| Âm thanh (`mix.py`) | `Groove(..., plan=True, accomp=True)` + `G.theme(...)`; `T.duck(mus, ve, .66, .3)` → `T.speech_guard(mus, fx, vox, LINES, 11.)` → `T.master(mix, 10.5)`; điểm nhấn viết tay đặt sau câu thoại |
| `qa.py` | Ba mục mới (nhóm "4 Âm thanh"): **Nhạc đệm dưới lời** (tụt ≤ 8 dB, ≥ 2 nốt / giây lời), **Đổi cảnh nghe ra** ("vào mềm" ≤ 10 %), **Chủ đề nhạc của tập** (≥ 1 lần / 45 s) |
| Checklist | Nghe một đoạn hội thoại dài: dưới lời vẫn có hợp âm và bè phụ, lời vẫn rõ; đổi cảnh nghe ra nhạc mới; nhận ra chủ đề khi nó quay lại |

## 5. Các tập trước

SHORT-001…015 và LONG-001 chưa bật `accomp`, nên `qa.py` sẽ báo CẢNH BÁO ở các mục mới.

Dựng lại nhạc của một tập chưa đăng chỉ cần sửa `mix.py`:
- thêm `accomp=True` và một `G.theme`;
- đổi tham số `duck`;
- gọi `speech_guard`;
- chạy lại `build.sh`, hoặc chỉ `mix.py` → `soundplan.py` → `mux.sh` → `qa.py`, vì hình không đổi.

Tập đã đăng giữ nguyên (như các lượt trước).

## 6. Giới hạn

- Các số đo chỉ cho biết lớp đệm **có mặt** và lời **vẫn rõ**. Nhạc có vui, có hợp cảnh hay không vẫn phải nghe bằng tai (checklist).
- `speech_guard` đo theo cách của `qa.py` (dải 300–4000 Hz, trung vị theo ô 50 ms), nên không bắt được một nốt ngắn đè đúng một chữ. Nghe lại các câu cửa miệng.
- Bè phụ dùng nốt hợp âm ở C6–D7; với nhạc cụ trầm (bassoon, tuba) làm giai điệu, bè phụ lấy nhạc cụ theo phong cách. Muốn một màu khác thì ghi `counter=` cho cảnh đó.
