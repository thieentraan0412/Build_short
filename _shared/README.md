# _shared — tài nguyên dùng chung cho mọi Short của Big Secrets of Tiny Bugs

Mọi tập sau đều lấy nhân vật, bảng màu và font từ đây. Đừng chép bản riêng vào từng tập: sửa ở đây thì mọi tập cùng cập nhật, và nhân vật không bị lệch giữa các tập.

| Thư mục / file | Là gì |
|---|---|
| [`characters/`](characters/) | Character Design System: rig code của 13 nhân vật, biểu cảm, tư thế, đạo cụ, bảng thiết kế. Crumb có thêm tư thế `reach` (0..1, hoặc `[trái, phải]`): râu nghiêng về phía trước để chạm đầu râu với kiến khác (SHORT-005); mặc định 0 nên các tập cũ không đổi |
| [`characters/CHARACTER-BIBLE.md`](characters/CHARACTER-BIBLE.md) | Tài liệu nhân vật: đặc điểm khóa, bảng màu, prompt cho AI |
| [`characters/out/sheets/`](characters/out/sheets/) | 62 bảng thiết kế có chữ, dành cho người |
| [`characters/out/clean/`](characters/out/clean/) | 61 bảng không chữ, dành cho AI tạo video |
| [`kit.js`](kit.js) | Bảng màu `C` và các hàm vẽ khối phẳng của style "Khối Kẹo Phẳng" |
| [`fonts/`](fonts/) | Baloo 2 và Paytone One, kèm giấy phép OFL |
| [`voices.js`](voices.js) | Giọng Kokoro và tốc độ của từng nhân vật có lời (Miss Loupe `af_heart` 0,9 · Albie `bm_lewis` 0,8), câu cửa miệng viết chuẩn. `tools/lines.mjs` của mỗi tập đọc bảng này |
| [`audio/band.py`](audio/band.py) | Dàn nhạc tổng hợp của kênh (ukulele, marimba, kèn đồ chơi, tiếng dế, tiếng ong…) và **nhạc hiệu 2 s** `jingle()`, giống hệt nhau ở mọi tập. `mix.py` của tập import từ đây Kèm tiếng của nhân vật không lời: `mmm()` (Flutter ngân "Mmm!"). Nhạc cụ cho nhạc nền theo cảnh: `pizz` `xylo` `flute` `reed` `steel` `tuba` `tom` `claves` `brush` `tamb` `celesta` `harp`, màu "Night Band" `rhodes` `vibes` `snap` `upright`, màu "Ant Parade" `snare` `banjo`, hợp âm `triad()` và **mô-típ bí mật** `secret()` (đô–mi–sol đi lên, mỗi tập mỗi cảnh đổi nhạc cụ, giọng và nhịp). Mỗi tập chọn một màu riêng: xem `films/short-00x/MUSIC.md` |
| [`voicefx.py`](voicefx.py) | Hậu kỳ giọng sau `core/tts/tts.py`: nâng cao độ các câu có trường `pitch` trong `voices.js` (Crumb: +5 nửa cung, ≈ 270 Hz, nghe nhỏ, trẻ và nhanh hơn), cập nhật `dur.json`. Chạy lại an toàn (đánh dấu trong `voice/fx.json`). `build.sh` của tập gọi ngay sau `tts.py` |
| [`QUALITY.md`](QUALITY.md) | **Bộ tiêu chí chất lượng của kênh** (7 nhóm: hook 3 s, giữ chân, nội dung, âm thanh, hình ảnh, xem lại, giọng nhân vật): quy tắc, bước nào trong quy trình phải làm, cách kiểm, checklist thủ công. Mọi Short và video phải qua trước khi giao |
| [`qa.py`](qa.py) | Kiểm tự động theo `QUALITY.md`: `python _shared/qa.py films/<tập> [--json]`. Đọc `timeline.json`, `events.json`, các stem trong `out/` và file `.mp4`, in bảng ĐẠT / CẢNH BÁO / CHƯA ĐẠT (với `--json` thì ghi thêm `out/qa.json`), thoát mã 1 nếu còn mục CHƯA ĐẠT. `build.sh` của tập gọi ở bước cuối. Phim lặp được nhận ra khi có một sự kiện tên chứa `iris` trong 1,5 s cuối (`ringiris`, `puffiris`…) hoặc mốc `loop` trong `HIT` |
| [`voice-tests/`](voice-tests/) | Mẫu giọng A/B cho Miss Loupe và Albie (tiêu chí 7), kèm cao độ và kết quả Whisper. Chờ chọn |
| [`audio/toon.py`](audio/toon.py) | Bảng tiếng động hoạt hình của kênh: `swipe` `swish` `zip_` `whistle` (còi trượt) `swirl` `boing` `wobble` `bubble` `pops` `plip` `splat` `sparkle` `gliss` `ding` `tink` `swell` `cymbal` `revcymbal` `paper` `buzzup` `block` `windup` `blip`, mỗi tiếng có tham số để các lần chuyển cảnh không lặp y hệt. Kèm công cụ trộn: `verb()` (vang cho đuôi tiếng), `duck()` (nhạc/tiếng động nhường giọng theo dải 300–4000 Hz), `master()` (đo LUFS, chặn đỉnh thật để `mux.sh` nâng tuyến tính). Bảng cue mẫu: `films/short-00x/SOUND.md` |
| [`episode.js`](episode.js) | Thư viện dựng tập: `loupe()` đặt Miss Loupe theo tâm kính và vẽ cảnh phóng to trong kính, `ex()` biểu cảm có nhép miệng/chớp mắt, `makeTalk()` khẩu hình theo giọng thật, `flutterAt()`, `albieAt()`, `badge()`, `subtitle()` phụ đề hiện dần, máy quay `look()`. Tập mới import từ đây |

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

Tập 1 đã dựng lại theo cách đó: [`films/short-001/`](../films/short-001/) (SHORT-001, dùng `_shared` cho nhân vật, font, giọng và nhạc hiệu). Đây là mẫu tốt nhất để bắt đầu một tập mới: hàm `loupe()` đặt Miss Loupe theo tâm kính và vẽ cảnh phóng to bằng tham số `inside` của rig; `tools/lines.mjs` lấy giọng từ `voices.js`.

Từ SHORT-002 ([`films/short-002/`](../films/short-002/)), các hàm dựng tập nằm trong `episode.js`; SHORT-002 là mẫu nên chép khi bắt đầu một tập mới.

Tập mới chép `build.sh` của SHORT-004 hoặc SHORT-005: nó đã có `voicefx.py`, Whisper hai model và `qa.py` ở cuối. Trước khi giao, đọc [QUALITY.md](QUALITY.md).
