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
