# _shared — tài nguyên dùng chung cho mọi Short của Big Secrets of Tiny Bugs

Mọi tập sau đều lấy nhân vật, bảng màu và font từ đây. Đừng chép bản riêng vào từng tập: sửa ở đây thì mọi tập cùng cập nhật, và nhân vật không bị lệch giữa các tập.

| Thư mục / file | Là gì |
|---|---|
| [`characters/`](characters/) | Character Design System: rig code của 13 nhân vật, biểu cảm, tư thế, đạo cụ, bảng thiết kế |
| [`characters/CHARACTER-BIBLE.md`](characters/CHARACTER-BIBLE.md) | Tài liệu nhân vật: đặc điểm khóa, bảng màu, prompt cho AI |
| [`characters/out/sheets/`](characters/out/sheets/) | 62 bảng thiết kế có chữ, dành cho người |
| [`characters/out/clean/`](characters/out/clean/) | 61 bảng không chữ, dành cho AI tạo video |
| [`kit.js`](kit.js) | Bảng màu `C` và các hàm vẽ khối phẳng của style "Khối Kẹo Phẳng" |
| [`fonts/`](fonts/) | Baloo 2 và Paytone One, kèm giấy phép OFL |

## Dùng trong một tập mới

Tập mới đặt ở `films/<tên-tập>/`. Công cụ render lấy thư mục gốc của thư viện làm gốc web, nên tập mới gọi `_shared` bằng đường dẫn tuyệt đối bắt đầu bằng `/`: trang `index.html` lấy font từ `/_shared/fonts/`, còn code JS import như sau:

```js
import { C } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';

drawChar(c, BY.loupe, { x: 540, y: 1600, h: 600, yaw: .35, expr: 'explaining' });
```

Tham số `drawChar`, biểu cảm, tư thế mẫu và cách thêm khách mời: xem mục 7 của [CHARACTER-BIBLE.md](characters/CHARACTER-BIBLE.md).

## Khi sửa nhân vật

1. Sửa trong `characters/cast/`, hoặc trong `characters/bible.js` nếu đổi chữ và đặc điểm khóa.
2. Dựng lại bảng hình, chạy từ thư mục gốc của thư viện:
   `node _shared/characters/tools/render.mjs`
3. Nếu đã sửa `bible.js`, cập nhật tài liệu: `node _shared/characters/tools/bible.mjs`
4. Dựng lại các tập đang làm dở để thấy thay đổi.

## Pilot

Thư mục `films/bi-mat-ti-hon/` là tập pilot đã giao. Nó giữ `kit.js` và `cast.js` riêng, nên `build.sh` của pilot vẫn chạy như cũ. Khi dựng lại tập 1 theo kế hoạch, hãy làm thành một tập mới dùng `_shared`.
