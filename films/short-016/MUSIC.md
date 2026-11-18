# SHORT-016 · Soundtrack Timeline

## Màu nhạc của tập: "Snowy Sleigh Song"

Tập mùa đông, câu hỏi "Where do bugs go when it snows?" có ba câu trả lời, nên nhạc là **một bài hát ba khổ** đi qua ba "căn phòng" mùa đông: tổ ong ấm, bản đồ đường bay, đống lá ngủ.
- **Giọng Đô trưởng** (giai điệu quanh bậc 5–6 nằm đúng `home` 56 của Miss Loupe). Nốt Sol ở cuối phim dẫn về hợp âm Đô của khung đầu, nên vòng lặp liền.
- **Điệu riêng của tập: `sleigh`** (xe trượt tuyết; bộ gõ `sleigh`: chuông xe trượt `band.sleighbell` mới của tập, mõ trầm / mõ cao như vó ngựa "lộc cộc", kick nhẹ). Dùng ở móc, điệp khúc 1, sổ, điệp khúc 2: khoảng 28 % thời lượng.
- **Bài hát** (`SONG` trong `timeline.js`, giải bằng `_shared/song.js`): 6 phần, BPM 112–126. Miss Loupe hát 10/16 câu (68 % số từ): half-sing cho câu hỏi và khám phá, sing-talk cho câu giải thích, hát trọn cho điệp khúc. Dot và Albie nói (chưa hát lần nào ở kênh).
- **Điệp khúc** "Huddle, fly away, or hide!" (sol sol sol la si la sol): ba nốt đứng cho ba từ đầu, leo lên Si ở "a-WAY", đáp về Sol ở "HIDE" (ngân hai phách, gần `home` của giọng). Hai lần (20,9 s; 42,1 s); xylophone đánh đôi cao một quãng tám.
- **Motif** = câu mở điệp khúc `5 5 5 6 7` (celesta chơi lại lúc chụp sticker 3). **Chủ đề của tập** (`G.theme`) = cả câu điệp khúc theo đúng nhịp của nó: nhạc cụ hát chính của cảnh hát lại ở câu đáp đầu cảnh.
- **Nhạc dưới lời** (`accomp=True`): dưới câu nói vẫn đủ đệm hợp âm + bè phụ ở dải cao; dưới câu hát hợp âm của bài đủ nhịp, không arp, không bè phụ.
- **Điểm nhấn viết tay:** hợp âm Đô + "ting" bông tuyết ở giây 0; celesta lên / xuống theo hai lần ngó quanh; nhạc hiệu 0,8 s ở cú lao vào kính; đàn hạc vuốt lên + hợp âm vibraphone lúc bật kính ấm; "ta-da" lúc rừng hoá cam; celesta rơi như tuyết lúc nhấc lá; vibraphone run run ở chỗ khựng của gag; hợp âm Đô nhỏ khi chữ móc trở lại.
- **Năng lượng theo cảnh** (18/11/2026, `SCENES` trong `mix.py`): êm −8 dB (hai cảnh kính) · thường −3 · mạnh +1,5 (móc, điệp khúc) · cao trào +3 (rừng hoá cam) cho nhạc và nền; giọng đi theo nhẹ hơn (−2 … +1,5 dB). LRA 2,7 → 6,9 LU.
- **Điểm nhấn thêm:** rừng hoá cam: riser → chũm chọe + kèn trumpet chặn hai hợp âm + timpani; điệp khúc: vỗ tay phách 2 và 4; "Nope!": trombone "wah-wah"; Dot lặn: đàn hạc vuốt xuống.
- Bảng cảnh nhạc 7 cột, lý do từng cảnh, các chỗ chuyển, Music Timeline, Sing-along, SFX Timeline và AI prompts: **[SOUND-PLAN.md](SOUND-PLAN.md)** (sinh từ `out/music.json`, không sửa tay).

| Cảnh | Thời gian | Điệu · BPM | Nhạc cụ hát chính |
|---|---|---|---|
| móc | 0–3,0 | xe trượt tuyết · 120 | glockenspiel |
| logo | 3,0–3,8 | nhạc hiệu | kèn đồ chơi |
| kính ấm | 3,8–7,0 | rải lơ lửng · 112 | vibraphone |
| Waggle rung ngực | 7,0–12,4 | shuffle · 112 | marimba |
| "Nope!" | 12,4–15,45 | nảy lệch phách · 126 | xylophone |
| bản đồ | 15,45–18,35 | phiêu lưu · 126 | sáo |
| rừng hoá cam | 18,35–21,0 | cao trào · 126 | dàn dây spiccato |
| điệp khúc 1 | 21,0–24,0 | xe trượt tuyết · 124 | xylophone |
| đống lá | 24,0–27,0 | ragtime nhẹ · 116 | đàn hạc |
| Dot đếm | 27,0–33,8 | pop nảy · 116 | pizzicato |
| sổ | 33,8–38,2 | xe trượt tuyết · 128 | chuông |
| gag | 38,2–40,55 | polka · 116 | kazoo |
| khựng | 40,55–41,2 | khựng | vibraphone |
| Albie cười | 41,2–42,2 | shuffle · 116 | clarinet |
| điệp khúc 2 | 42,2–45,3 | xe trượt tuyết · 124 (reprise) | xylophone |
| CTA · vòng lặp | 45,3–48 | ukulele nắng · 120 | trống thép |
