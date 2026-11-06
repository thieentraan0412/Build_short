@AGENTS.md

## Kênh Big Secrets of Tiny Bugs: bộ tiêu chí bắt buộc

Mọi Short và video của kênh trong `films/` phải theo [`_shared/QUALITY.md`](_shared/QUALITY.md) (hook 3 s, giữ chân, nội dung, âm thanh, hình ảnh, xem lại, giọng nhân vật):
- Viết `TREATMENT.md` có đủ các mục mà `QUALITY.md` yêu cầu: nhịp móc 0–1 / 1–2 / 2–3 s, bảng cảnh "mỗi 3–5 s một chuyện mới", gag, thông điệp, chi tiết để xem lại, màu nhạc riêng.
- `build.sh` của tập chạy `_shared/qa.py <thư mục tập> --json` ở bước cuối (chép từ `films/short-004/build.sh`).
- Không giao khi `qa.py` còn mục CHƯA ĐẠT. Mục CẢNH BÁO phải sửa hoặc ghi lý do.
- Báo cáo giao gồm bảng `qa.py` và checklist thủ công cuối `QUALITY.md`.
- Nội dung Made for Kids: không kêu gọi bình luận hay đăng ký trong phim.
