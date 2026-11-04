# Khối Kẹo Phẳng (Flat Candy Shapes) — bản nháp cho phim này

Style riêng của phim, chưa lưu vào `~/lemo-my-styles/`. Nền kỹ thuật: Game Show Flat (nhịp, thẻ, chữ lớn).

## 1. Bản chất

Đồ họa phẳng dựng hoàn toàn từ khối hình học, không viền, cho khung dọc. Không phải gameshow: không viền đen, không bóng cứng kiểu sticker, không judgement word. Không phải bản sao của phim hoạt hình nào: bảng màu, nhân vật, bố cục đều riêng.

## 2. Chất liệu

- Canvas 2D, chỉ tô phẳng: tròn, viên nang, chữ nhật bo góc, bán nguyệt, đa giác.
- **Không viền, không gradient, không blur, không texture.**
- Chiều sâu bằng xếp lớp và một mảng tối phẳng bên trong khối.
- Chi tiết siêu nhỏ chỉ được vẽ trong kính lúp, ở chế độ `detail`.

## 3. Màu

- Nền mỗi cảnh một màu; nhân vật không bao giờ trùng màu nền.
- Bảng màu "vườn kẹo": xoài `#FFC32B`, cam `#FF7A2F`, mâm xôi `#E8336D`, nho `#5A33D6`, lá `#22B866`, chanh `#B7F04A`, bạc hà `#7BF0D0`, trời `#3CC8FF`, mật `#E8871E`, kem `#FFF8E7`, mực `#1E1B3A`.

## 4. Chữ

Paytone One cho chữ lớn, Baloo 2 ExtraBold cho phụ đề và nhãn. Cả hai đều có đủ dấu tiếng Việt.

## 5. Chuyển động

Nhảy lò xo khi xuất hiện (back-ease), ép dẹt khi chạm đất, mọi cú đáp nằm trên phách, 120 BPM.

## 6. Máy quay

Chính diện, phẳng. Kính lúp là máy quay thứ hai: khung trong khung, thu phóng thật cảnh đang có.

## 7. Âm thanh

Tổng hợp hoàn toàn: pluck kiểu ukulele, marimba, vỗ tay, chuông; tiếng côn trùng được đưa vào làm nhạc cụ.

## 8. Thủ pháp đặc trưng

- **Kính lộ điều mắt thường không thấy.** Chỉ trong kính mới có điểm nếm, tai dế.
- **Chuyển cảnh qua kính.** Kính lớn dần, cảnh sau đã ở sẵn trong kính.
- **Cảnh kéo xa dọc khung.** Tilt theo đường dài, chỉ khung dọc mới có.
