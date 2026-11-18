# Khung tập mới (chuẩn 11/2026b)

Khung mã cho mọi Short từ SHORT-016 và video dài từ LONG-002 của *Big Secrets of Tiny Bugs*: chuẩn sản xuất mới và Musical Storytelling ([`Task.md`](../../Task.md) ngày 17/11/2026, [`QUALITY.md`](../QUALITY.md) §8). Ví dụ đã dựng trọn và qua `qa.py`: bản thử `films/lab-musical/` (SHORT-015 dựng lại theo chuẩn này), đã xoá khỏi thư mục; xem lại trong lịch sử git: `git show 137d621:films/lab-musical/timeline.js` (tương tự với `film.js`, `mix.py`, `TREATMENT.md`).

## Bắt đầu một tập

```sh
cp -r _shared/template films/short-0XX            # rồi xoá README.md trong thư mục tập
cp _shared/TREATMENT-TEMPLATE.md films/short-0XX/TREATMENT.md
```

1. **Treatment** (`TREATMENT.md`): điền đủ 10 đầu ra và Music Direction A–F, gồm bản phác Sing-along (câu nào đọc vào phách nào, điệp khúc) và `SHOTS`. **Không ai hát** (QUALITY.md §8.3); Miss Loupe luôn như SHORT-015 (§9.10).
2. **`timeline.js`**: `SONG` (giọng trưởng, các phần ≥ 108 BPM, vòng hợp âm, motif); `LINES` (câu nói: `t`, `dur`; câu theo phách: `tune: { mode?, at, notes, chorus?, lyr? }`, độ dài thật lấy từ `voice/dur.js`); `em`; CTA `cta: true`; `SECRET.kw`; `BEATS` (6 nhịp); `SHOTS` (mỗi 2–4 s); `EV` (chuỗi nhịp có chủ đích ghi `run`).
   `node films/short-0XX/tools/lines.mjs` giải bài hát (`_shared/song.js`), in quỹ thời gian, dừng nếu nốt không khớp âm tiết, nốt ngoài hợp âm ở phách mạnh, lời chồng nhau, phim dài quá.
3. **Nghe thử giọng trước khi dựng hình**: `python _shared/tools/voice_regen.py films/short-0XX` (tts → voicefx → Whisper base + small → `emote.py` cho câu có `emo`, chỉ cho câu đã đổi); nhân vật mới thì chủ kênh nghe duyệt. Câu lỗi: sửa `timeline.js` rồi chạy lại, chỉ câu đó được tạo lại (QUALITY.md §9).
4. **`film.js`**: cảnh, nhân vật, đạo cụ của tập. Giữ: `LOOK.v = 2`, `LOOK.cheer = true`; chữ móc `hookStack(…, 'mid')` (video dài: `'wide'`), nhân vật dưới chữ trong 3 s đầu; máy quay qua `look()`, kính qua `loupe(…, { mag, pan })`; phụ đề `subtitle(c, card, t, 500, SAFE.subY)`.
5. **`mix.py`**: `Groove(…, song=TL['song'])`, cảnh chồng câu theo phách dùng `chords='song'` và BPM của phần; điệp khúc (`tune.chorus`) được nhạc cụ chơi giai điệu; `G.theme` dùng đúng các bậc của điệp khúc; `G.motif`; `LEVEL`; bảng `SFX` cho mọi loại sự kiện. *(Âm thanh 4 lớp, QUALITY.md §10)* `SCENES` (mức năng lượng và lớp nền của từng cảnh), `EMO_DB`, `ambience.beds`, ghi `out/scenes.json` và stem nền.
6. **`sh films/short-0XX/build.sh`**: dựng trọn; sau `mix.py` chạy `tools/vocal_qc.py` (→ `VOCAL-QC.md`, mục A–G); cuối cùng `qa.py` gồm nhóm "8 Chuẩn mới" và "9 Vocal QC". Không giao khi còn CHƯA ĐẠT; CẢNH BÁO sửa hoặc ghi lý do (dòng CẦN NGHE: nghe rồi ghi kết luận); báo cáo gồm bảng `qa.py`, checklist cuối `QUALITY.md`, §8.5 và mục A, G của `VOCAL-QC.md`.

## Các file

| File | Vai trò |
|---|---|
| `timeline.js` | Một nguồn thời gian: bài hát, câu thoại / câu theo phách, phụ đề (`cardsOf`), 6 nhịp, cú máy, sự kiện âm thanh |
| `tools/lines.mjs` | `voice/dur.json` → `voice/dur.js`; timeline.js → `voice/lines.json` (tốc độ theo `voices.js`: `pace`, `emote`), `timeline.json`, `cards.json`; quỹ thời gian |
| `tools/env.py` | khẩu hình theo bản giọng cuối |
| `build.sh` | toàn bộ quy trình: `voice_regen.py` (giọng chỉ cho câu đã đổi), `wordtimes.py` (phụ đề câu nói theo mốc từ thật), `soundplan.py` (bảng âm thanh A–F), `vocal_qc.py` (Vocal QC A–G) và `qa.py` |
| `film.js`, `sheets.js`, `poster.js`, `index.html` | khung hình tối thiểu, thay bằng của tập |
| `mix.py` | khung âm thanh tối thiểu theo song mode |
