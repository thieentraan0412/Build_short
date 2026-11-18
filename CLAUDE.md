@AGENTS.md

## Kênh Big Secrets of Tiny Bugs: bộ tiêu chí bắt buộc

Mọi Short và video của kênh trong `films/` phải theo [`_shared/QUALITY.md`](_shared/QUALITY.md) (hook 3 s, giữ chân, nội dung, âm thanh, hình ảnh, xem lại, giọng nhân vật):
- Viết `TREATMENT.md` có đủ các mục mà `QUALITY.md` yêu cầu: nhịp móc 0–1 / 1–2 / 2–3 s, bảng cảnh "mỗi 3–5 s một chuyện mới", gag, thông điệp, chi tiết để xem lại, màu nhạc riêng.
- `build.sh` của tập chạy `_shared/qa.py <thư mục tập> --json` ở bước cuối (chép từ `films/short-004/build.sh`).
- Không giao khi `qa.py` còn mục CHƯA ĐẠT. Mục CẢNH BÁO phải sửa hoặc ghi lý do.
- Báo cáo giao gồm bảng `qa.py` và checklist thủ công cuối `QUALITY.md`.
- Nội dung Made for Kids: không kêu gọi bình luận hay đăng ký trong phim.

### Chuẩn 11/2026b: Short từ SHORT-016, video dài từ LONG-002

Chuẩn sản xuất mới và Musical Storytelling ([`Task.md`](Task.md) 17/11/2026, [`QUALITY.md`](_shared/QUALITY.md) §8). SHORT-010 đến 015 giữ nguyên như đã dựng.
- Treatment chép từ [`_shared/TREATMENT-TEMPLATE.md`](_shared/TREATMENT-TEMPLATE.md): đủ 10 đầu ra (đánh giá ý tưởng, hook, kịch bản 6 nhịp, storyboard mỗi 2–4 s, chuyển động và góc quay, chữ và phụ đề, voiceover, SFX và nhạc nền, CTA, checklist) và Music Direction A–F. Khi chủ kênh giao nội dung một tập mới, trả về các mục này trước khi dựng.
- Mã của tập chép từ [`_shared/template/`](_shared/template/) (thay cho `films/short-004/build.sh`): `timeline.js` khai báo `STANDARD`, bài hát (`SONG`), câu hát (`sing`), `BEATS`, `SHOTS`, `SECRET`, CTA (`cta: true`); `build.sh` có thêm `_shared/sing.py` và `_shared/tools/asr_sung.py`.
- 60–80 % số từ được hát (sing-talk, half-sing, sing) bằng chính giọng TTS của nhân vật; điệp khúc hát theo được; phụ đề ≤ 7 từ có từ nhấn; chữ móc ở giữa phía trên.
- CTA cụ thể và ngắn nhưng vẫn Made for Kids: câu hỏi cho trẻ trả lời to hoặc một việc làm thật, không comment / subscribe / like / share.
- Vocal & Musical QC ([`Task.md`](Task.md) 18/11/2026, [`QUALITY.md`](_shared/QUALITY.md) §9): `build.sh` tạo lại giọng chỉ cho câu đã đổi (`_shared/tools/voice_regen.py`) và chạy `_shared/tools/vocal_qc.py` → `VOCAL-QC.md` (A bảng lỗi … G checklist). LỖI (đã xác nhận bằng số đo) phải sửa bằng cách tạo lại đúng câu đó; CẦN NGHE phải nghe rồi ghi kết luận. Báo cáo giao gồm thêm mục A và G của `VOCAL-QC.md`.
- Âm thanh theo cảnh 4 lớp ([`QUALITY.md`](_shared/QUALITY.md) §10): mỗi cảnh có Voice (câu có `emo`, `emote.py` uốn ngữ điệu), Music (`SCENES` trong `mix.py`: mức năng lượng calm / normal / high / peak), SFX cho mọi hành động (`av_sync.py` đo trên video), Ambient (`ambience.py`). "Sợ hãi" làm thành giật mình vui. Báo cáo giao gồm LRA, độ chênh cao trào – cảnh êm và bảng 4 lớp trong `SOUND-PLAN.md`.
