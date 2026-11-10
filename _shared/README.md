# _shared — tài nguyên dùng chung cho mọi Short của Big Secrets of Tiny Bugs

Mọi tập sau đều lấy nhân vật, bảng màu và font từ đây. Đừng chép bản riêng vào từng tập: sửa ở đây thì mọi tập cùng cập nhật, và nhân vật không bị lệch giữa các tập.

| Thư mục / file | Là gì |
|---|---|
| [`characters/`](characters/) | Character Design System: rig code của 13 nhân vật định kỳ và khách mời (`GUESTS` trong `cast/index.js`: Fizz, ruồi, từ SHORT-009), biểu cảm, tư thế, đạo cụ, bảng thiết kế. Crumb có thêm tư thế `reach` (0..1, hoặc `[trái, phải]`): râu nghiêng về phía trước để chạm đầu râu với kiến khác (SHORT-005); mặc định 0 nên các tập cũ không đổi |
| [`characters/CHARACTER-BIBLE.md`](characters/CHARACTER-BIBLE.md) | Tài liệu nhân vật: đặc điểm khóa, bảng màu, prompt cho AI |
| [`characters/out/sheets/`](characters/out/sheets/) | 62 bảng thiết kế có chữ, dành cho người |
| [`characters/out/clean/`](characters/out/clean/) | 61 bảng không chữ, dành cho AI tạo video |
| [`kit.js`](kit.js) | Bảng màu `C` và các hàm vẽ khối phẳng của style "Khối Kẹo Phẳng" |
| [`fonts/`](fonts/) | Baloo 2 và Paytone One, kèm giấy phép OFL |
| [`voices.js`](voices.js) | Giọng Kokoro và tốc độ của từng nhân vật có lời (Miss Loupe `af_heart` 0,9 · Albie `bm_lewis` 0,8), câu cửa miệng viết chuẩn. `tools/lines.mjs` của mỗi tập đọc bảng này |
| [`audio/band.py`](audio/band.py) | Dàn nhạc tổng hợp của kênh (ukulele, marimba, kèn đồ chơi, tiếng dế, tiếng ong…) và **nhạc hiệu 2 s** `jingle()`, giống hệt nhau ở mọi tập. **Nhạc hiệu 0,8 s** `sting(v, root)` (11/2026, tập A từ SHORT-007): logo lồng vào cú lao vào kính; `root` đổi nốt chủ theo giọng của tập, trả về stereo (cộng thẳng vào bus nhạc). `mix.py` của tập import từ đây Kèm tiếng của nhân vật không lời: `mmm()` (Flutter ngân "Mmm!"). Nhạc cụ cho nhạc nền theo cảnh: `pizz` `xylo` `flute` `reed` `steel` `tuba` `tom` `claves` `brush` `tamb` `celesta` `harp`, màu "Night Band" `rhodes` `vibes` `snap` `upright`, màu "Ant Parade" `snare` `banjo`, hợp âm `triad()` và **mô-típ bí mật** `secret()` (đô–mi–sol đi lên, mỗi tập mỗi cảnh đổi nhạc cụ, giọng và nhịp). Mỗi tập chọn một màu riêng: xem `films/short-00x/MUSIC.md`. **Lượt Sound Design Plan (11/2026):** `piano` `toypiano` `trumpet` (`mute=` kèn bịt) `trombone` (`bend=` "wah-wah") `bassoon` `kazoo` `accordion` `strings` (dây spiccato) `timpani` `bongo` `triangle` và `tada(root)` ("ta-da!" kèn đồng, stereo) |
| [`voicefx.py`](voicefx.py) | Hậu kỳ giọng sau `core/tts/tts.py`: nâng cao độ các câu có trường `pitch` trong `voices.js` (Crumb: +5 nửa cung, ≈ 270 Hz, nghe nhỏ, trẻ và nhanh hơn), cập nhật `dur.json`. Chạy lại an toàn (đánh dấu trong `voice/fx.json`). `build.sh` của tập gọi ngay sau `tts.py` |
| [`QUALITY.md`](QUALITY.md) | **Bộ tiêu chí chất lượng của kênh** (7 nhóm: hook 3 s, giữ chân, nội dung, âm thanh, hình ảnh, xem lại, giọng nhân vật): quy tắc, bước nào trong quy trình phải làm, cách kiểm, checklist thủ công. Mọi Short và video phải qua trước khi giao |
| [`qa.py`](qa.py) | Kiểm tự động theo `QUALITY.md`: `python _shared/qa.py films/<tập> [--json]`. Đọc `timeline.json`, `events.json`, các stem trong `out/` và file `.mp4`, in bảng ĐẠT / CẢNH BÁO / CHƯA ĐẠT (với `--json` thì ghi thêm `out/qa.json`), thoát mã 1 nếu còn mục CHƯA ĐẠT. `build.sh` của tập gọi ở bước cuối. Phim lặp được nhận ra khi có một sự kiện tên chứa `iris` trong 1,5 s cuối (`ringiris`, `puffiris`…) hoặc mốc `loop` trong `HIT` |
| [`voice-tests/`](voice-tests/) | Mẫu giọng A/B cho Miss Loupe và Albie (tiêu chí 7), kèm cao độ và kết quả Whisper. Chờ chọn |
| [`audio/groove.py`](audio/groove.py) | **Lớp nhịp theo cảnh** (lượt nhạc nền sinh động 11/2026; quy tắc ở [QUALITY.md](QUALITY.md) §4). **Từ lượt Sound Design Plan (11/2026), mọi Short dùng `Groove(..., plan=True)`** và khai báo cho mỗi cảnh `bpm=` (BPM riêng, lưới bắt đầu ở điểm cắt), `mood=` (một trong 8 phong cách `MOODS`), `arc=` (`open` / `build` / `peak` / `end`), `what=`, `emo=`, `why=` (cho bảng `SOUND-PLAN.md`), `reprise=True` khi cố ý lặp nhạc của một cảnh trước; `tr=` để ép một cách chuyển. Thêm 8 điệu (`stride` ragtime, `hero` cao trào, `quest` phiêu lưu, `sneak` rình rập hài, `sunny` ukulele quạt, `hop` nảy lệch phách, `twinkle` hộp nhạc, `stab` dừng nhịp) và 5 bộ gõ (`epic` timpani, `bongo`, `clap`, `tri` triangle, `comic` mõ). Với `plan=True`, chỗ đổi cảnh tự chọn một cách chuyển không lặp lần trước (`TRANS`), câu đáp theo phong cách nhạc (`MOOD_FILL`); `plan=False` (LONG-001) cho kết quả y hệt bản cũ. Cũ: `G = Groove(M, BEAT, LINES, meter, seed, avoid)`, rồi mỗi cảnh một `G.sec(tên, t0, t1, điệu, giọng, hợp âm, bass=, comp=, arp=, lead=, kit=, energy=)`. Có 16 điệu: `bounce`, `skip`, `march`, `polka`, `calypso`, `swing`, `sway` (nửa nhịp), `gallop` (nhịp kép), `tiptoe`, `float`, `country`, `tension`, `hush`, `waltz`, `waltzfloat`, `break`. Nhạc cụ lấy từ `band.py`. Lớp nhịp tự thưa dưới lời (dưới giọng Albie bỏ bass), tự chen câu đáp vào khoảng trống, tự đặt trống dồn / chũm chọe ở chỗ đổi cảnh. `avoid` là các vùng điểm nhấn viết tay mà giai điệu của lớp nhịp nhường chỗ. Đoạn viết tay ghi bằng `G.mark`, câu đáp viết tay bằng `G.answer`; `G.save('out/music.json')` để `qa.py` kiểm. Mẫu: `films/short-003/mix.py` |
| [`audio/toon.py`](audio/toon.py) | Bảng tiếng động hoạt hình của kênh: `swipe` `swish` `zip_` `whistle` (còi trượt) `swirl` `boing` `wobble` `bubble` `pops` `plip` `splat` `sparkle` `gliss` `ding` `tink` `swell` `cymbal` `revcymbal` `paper` `buzzup` `block` `windup` `blip`, và (lượt Sound Design Plan) `bonk` (va chạm nhẹ) `footsteps` (bước chân tí hon) `scurry` (chạy lon ton) `giggle` (cười khúc khích) `surprise` (ngạc nhiên) `cheer` (reo vui, không giọng người), mỗi tiếng có tham số để các lần chuyển cảnh không lặp y hệt. Kèm công cụ trộn: `verb()` (vang cho đuôi tiếng), `duck()` (nhạc/tiếng động nhường giọng theo dải 300–4000 Hz), `master()` (đo LUFS, chặn đỉnh thật để `mux.sh` nâng tuyến tính). Bảng cue mẫu: `films/short-00x/SOUND.md` |
| [`episode.js`](episode.js) | Thư viện dựng tập: `loupe()` đặt Miss Loupe theo tâm kính và vẽ cảnh phóng to trong kính, `ex()` biểu cảm có nhép miệng/chớp mắt, `makeTalk()` khẩu hình theo giọng thật, `flutterAt()`, `albieAt()`, `badge()`, `subtitle()` phụ đề hiện dần, máy quay `look()`. **`SAFE`** (11/2026): vùng giao diện YouTube Shorts; tập mới đặt phụ đề ở `SAFE.subY`. `SUB` ghi khung phụ đề cho `tools/safezone.mjs`. **Tập A 45 s** (11/2026, dựng cùng SHORT-007): `titleSting()` logo 0,8 s trong mặt kính khi máy lao vào; `stickerSlots()` ba ô "1 2 3" dưới thanh trên, lấp dần theo từng bí mật rồi bay xuống trang sổ; `flyBadge()` sticker bay từ kính lên ô; `albumGulp()` Albie nói câu cửa miệng có hành động (đếm, há miệng, "đớp" đúng mốc). Tập mới import từ đây |
| [`tools/safezone.mjs`](tools/safezone.mjs) | (11/2026) Đo vùng an toàn của Shorts: `node _shared/tools/safezone.mjs films/<tập> [--out file]`. Vẽ lại phim mỗi 0,25 s, gom chữ (`REC`), mặt nhân vật (`FACES` trong `characters/stage.js`) và tấm phụ đề (`SUB`), rồi ghi `out/safezone.json`. File gồm các đoạn chữ, mặt hoặc phụ đề nằm trong vùng che, phụ đề che mặt, và mặt từng nhân vật theo thời gian. `qa.py` tự gọi công cụ này cho mục "Vùng giao diện Shorts" và "Người nói có trên hình". Chỉ đo, không đổi hình |
| [`tools/soundplan.py`](tools/soundplan.py) | (Sound Design Plan, 11/2026) Viết `SOUND-PLAN.md` của tập từ `out/music.json` và `events.json`: `python _shared/tools/soundplan.py films/<tập>`. Bảng 7 cột (Thời gian · Nội dung cảnh · Cảm xúc · Phong cách nhạc · Nhạc cụ · BPM · SFX), lý do chọn nhạc từng cảnh, các chỗ chuyển cảnh, tóm tắt chống trùng lặp. `build.sh` gọi ngay sau `mix.py`; `qa.py` kiểm file này có đủ cảnh |
| [`tools/safesheet.py`](tools/safesheet.py) | (11/2026) Bảng khung từ `.mp4` có phủ vùng giao diện Shorts, để soi bằng mắt: `python _shared/tools/safesheet.py films/<tập> [t …] [--out file]` |

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

**Từ SHORT-006 (nâng cấp 11/2026):** làm theo [kế hoạch nâng cấp](../PHAN-TICH-SHORTS/KE-HOACH-NANG-CAP.md).
- Tập A dài khoảng 45 s, logo ≤ 0,8 s.
- Kính lớn, câu cửa miệng có hành động, người nói có trên hình.
- Phụ đề đặt ở `subtitle(c, card, t, 510, SAFE.subY)`.
- Lời dẫn ngoài hình có chủ đích ghi `off: 'lời dẫn'` trong `LINES`.

Tập A từ SHORT-007 dùng `titleSting()`, `stickerSlots()`, `flyBadge()`, `albumGulp()` (`episode.js`) và `sting()` (`audio/band.py`), đã kiểm bằng khung tĩnh và `qa.py` của [SHORT-007](../films/short-007/TREATMENT.md). Cách dùng mẫu: `films/short-007/film.js` (`drawFilm`, `sAlbum`) và `mix.py`. Hàm cũ giữ nguyên: SHORT-001 đến 005 là mốc so sánh, dựng lại phải ra y hệt.

Nhạc nền của tập mới dựng bằng lớp nhịp theo cảnh [`audio/groove.py`](audio/groove.py), theo Sound Design Plan ([QUALITY.md](QUALITY.md) §4):
1. `G = Groove(M, BEAT, LINES, ..., plan=True)`. Mỗi cảnh một `G.sec`: điệu, nhạc cụ theo màu nhạc của tập, và `bpm`, `mood`, `arc`, `what`, `emo`, `why`. Hai cảnh kề nhau khác nhạc cụ hát chính; giữ 120 BPM ở cảnh nhún theo phách của hình và cảnh nối vòng lặp.
2. Đặt tay các điểm nhấn lên trên (mô-típ bí mật, stinger, khựng), khai báo vùng của chúng trong `avoid`, và ghi các đoạn viết tay bằng `G.mark` (cũng có `mood`, `arc`, `what`…).
3. Gọi `G.save(path, color='<màu nhạc>')` để ghi `out/music.json`, rồi `python _shared/tools/soundplan.py films/<tập>` để có `SOUND-PLAN.md`.

Mẫu: `mix.py` của SHORT-007 (44 s, tập A, 12 cảnh nhạc, 7 phong cách, BPM 96–132) và SHORT-003 (24 s, vòng lặp).

**Video dài 16:9** chép từ [`films/long-001/`](../films/long-001/):
- `lib16.js`: bản 16:9 của `episode.js` (máy quay, phụ đề, nhân vật mùa đông, chuyển cảnh qua lỗ băng và qua kính);
- kịch bản "chảy" theo giọng thật (`timeline.js` + `tools/lines.mjs`);
- danh sách sự kiện âm thanh tách riêng (`events.js`);
- `mix.py` có khoảng 50 cảnh nhạc và nhịp chờ trẻ trả lời;
- `build.sh` với khung 1920×1080.
