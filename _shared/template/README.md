# Khung tập mới (chuẩn 11/2026b)

Khung mã cho mọi Short từ SHORT-016 và video dài từ LONG-002 của *Big Secrets of Tiny Bugs*: chuẩn sản xuất mới và Musical Storytelling ([`Task.md`](../../Task.md) ngày 17/11/2026, [`QUALITY.md`](../QUALITY.md) §8). Ví dụ đã dựng trọn và qua `qa.py`: [`films/lab-musical/`](../../films/lab-musical/), bản thử dựng lại từ SHORT-015.

## Bắt đầu một tập

```sh
cp -r _shared/template films/short-0XX            # rồi xoá README.md trong thư mục tập
cp _shared/TREATMENT-TEMPLATE.md films/short-0XX/TREATMENT.md
```

1. **Treatment** (`TREATMENT.md`): điền đủ 10 đầu ra và Music Direction A–F, gồm bản phác Sing-along (kiểu hát, giai điệu từng câu) và `SHOTS`.
2. **`timeline.js`**: `SONG` (giọng trưởng, các phần ≥ 108 BPM, vòng hợp âm, motif); `LINES` (câu nói: `t`, `dur`; câu hát: `sing: { mode, at, notes, chorus?, lyr?, speed? }`); `em`; CTA `cta: true`; `SECRET.kw`; `BEATS` (6 nhịp); `SHOTS` (mỗi 2–4 s); `EV` (chuỗi nhịp có chủ đích ghi `run`).
   `node films/short-0XX/tools/lines.mjs` giải bài hát (`_shared/song.js`), in quỹ thời gian, dừng nếu nốt không khớp âm tiết, nốt ngoài hợp âm ở phách mạnh, giọng lệch `home`, lời chồng nhau, phim dài quá.
3. **Nghe thử giọng hát trước khi dựng hình**: chạy năm bước giọng của `build.sh` (tts → voicefx → Whisper → `sing.py` → `asr_sung.py`); nhân vật hát lần đầu thì chủ kênh nghe duyệt.
4. **`film.js`**: cảnh, nhân vật, đạo cụ của tập. Giữ: `LOOK.v = 2`, `LOOK.cheer = true`; chữ móc `hookStack(…, 'mid')` (video dài: `'wide'`), nhân vật dưới chữ trong 3 s đầu; máy quay qua `look()`, kính qua `loupe(…, { mag, pan })`; phụ đề `subtitle(c, card, t, 500, SAFE.subY)`.
5. **`mix.py`**: `Groove(…, song=TL['song'])`, cảnh chồng câu hát dùng `chords='song'` và BPM của phần; `G.motif`; `LEVEL`; `ve_m` (nhạc lùi ít hơn dưới câu hát); bảng `SFX` cho mọi loại sự kiện.
6. **`sh films/short-0XX/build.sh`**: dựng trọn, cuối cùng `qa.py` gồm nhóm "8 Chuẩn mới". Không giao khi còn CHƯA ĐẠT; CẢNH BÁO sửa hoặc ghi lý do; báo cáo gồm bảng `qa.py`, checklist cuối `QUALITY.md` và §8.5.

## Các file

| File | Vai trò |
|---|---|
| `timeline.js` | Một nguồn thời gian: bài hát, câu thoại / câu hát, phụ đề (`cardsOf`), 6 nhịp, cú máy, sự kiện âm thanh |
| `tools/lines.mjs` | timeline.js → `voice/lines.json` (có bản nhạc đã giải cho `sing.py`), `timeline.json`, `cards.json`; quỹ thời gian |
| `tools/env.py` | khẩu hình theo bản giọng cuối (đã hát) |
| `build.sh` | toàn bộ quy trình, gồm `sing.py`, `asr_sung.py`, `soundplan.py` (bảng âm thanh A–F) và `qa.py` |
| `film.js`, `sheets.js`, `poster.js`, `index.html` | khung hình tối thiểu, thay bằng của tập |
| `mix.py` | khung âm thanh tối thiểu theo song mode |
