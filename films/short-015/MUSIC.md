# SHORT-015 · Soundtrack Timeline

## Màu nhạc của tập: "Leg-Violin Tango"

Tập này là một bản **tango hoạt hình cho cây "vĩ cầm chân"** của Hop: châu chấu kéo đùi qua mép cánh như kéo vĩ, nên nhạc là một điệu khiêu vũ của vĩ cầm và bandoneon (accordion).
- **Giọng Rê giáng trưởng**, lần đầu kênh dùng làm giọng chính (các tập trước: Đô, Sol, Rê thứ/Fa, Fa, La, Mi, Si giáng, La giáng, Rê, Mi giáng). Cả tập ở giọng trưởng; hợp âm La giáng (bậc năm) ở cuối dẫn về Rê giáng của khung đầu nên vòng lặp liền.
- **Điệu riêng của tập: tango** (`SIGNATURE` → short-015; habanera 3+3+2, bốn phách marcato, chổi "kéo" vào phách 1, bộ gõ `tango`), chiếm **37 %** thời lượng ở ba cảnh: móc (accordion hát, piano chặn), kính soi chân sau (dây pizzicato hát, accordion đệm), cao trào "zzzzip" (dàn dây spiccato hát, piano chặn, timpani).
- **Hop có một phần viết tay đúng giọng:** mỗi lượt kéo to là một nốt **pizzicato** đi trên thang ngũ cung Rê giáng (Rê♭ Mi♭ Fa La♭ Si♭); trong cận cảnh, **mỗi gai vấp qua mép cánh là một nốt**: năm nốt đi lên ở khoảng không lời (to), năm nốt đi xuống ở quãng tám trên dưới lời (nhỏ); kéo nhanh thì thành một tràng 22 nốt nhanh dần nối vào dây vuốt lên và hợp âm Rê giáng của dàn dây. Tiếng rè "zzip" (chuỗi tiếng cạo, mỗi gai một tiếng) nằm ở bus tiếng động.
- **Gag:** trombone "ta-daa" giả nghiêm túc khi Miss Loupe nhấc chân; một tiếng "squeak" bé tí (tiếng động) rồi **nhạc khựng 0,55 s** (còn vibraphone run run, không im hẳn); kazoo "hi-hi" là tiếng cười của Hop; polka cho "Oops! No pegs!".
- Dựng theo **Sound Design Plan** (`Groove(..., plan=True)`): 10 cảnh nhạc, 6 phong cách, 9 nhạc cụ hát chính, BPM 100–132. Bảng đầy đủ 7 cột, lý do từng cảnh và các chỗ chuyển: **[SOUND-PLAN.md](SOUND-PLAN.md)**.

| | 009 | 010 | **015** |
|---|---|---|---|
| Giọng | Rê trưởng | Mi giáng trưởng | **Rê giáng trưởng** |
| Điệu riêng | ska | samba | **tango** |
| Điểm riêng | Mỗi số đếm là một nốt marimba cao dần | Lễ hội samba nghìn Crumb | **Mỗi gai vấp qua mép cánh là một nốt pizzicato** |
| Nhạc cụ của nhân vật | Kazoo = Fizz | — | **Pizzicato = cây vĩ cầm chân của Hop** |

**Chống trùng giữa các tập** (`music-plan.json`, mục cuối của [SOUND-PLAN.md](SOUND-PLAN.md)): không cảnh nào trùng công thức (điệu + nhạc cụ hát chính + đệm + bộ gõ) với một Short khác. Lượt dựng đầu có cảnh "hàng gai" trùng công thức của SHORT-010 (rải lơ lửng + vibraphone + đàn hạc) → đổi nhạc cụ hát chính sang glockenspiel; polka + kazoo (đã có ở 010) → clarinet hát, kazoo chỉ là tiếng cười viết tay của Hop. Còn một cặp điệu + nhạc cụ chính đã có ở một tập khác (nảy lệch phách + xylophone, 005), dưới ngưỡng "quá quen" (≥ 3 tập).

## Điểm nhấn viết tay (`mix.py`)

| Giây | Điểm nhấn |
|---|---|
| 0,0 | Hợp âm Rê giáng (contrabass + accordion) đúng khung 0; nối với nốt La giáng ở 21,75 s (vòng lặp) |
| 21,4 · 21,62 · 21,84 · 0,06 | Bốn lượt kéo to cuối phim → đầu phim: pizzicato La♭–Si♭–Rê♭–Mi♭ đi lên (nốt cuối rơi đúng khung đầu sau khi gấp đuôi) |
| 2,2 · 2,34 · 2,48 · 2,62 | Tràng kéo của Hop: pizzicato Fa–Mi♭–Rê♭ rồi bật lên La♭ |
| 3,6 | Kính bật lên: đàn hạc vuốt lên |
| 3,9–7,1 | Mỗi lượt kéo trong kính một nốt pizzicato Rê♭/La♭ (dưới lời: quãng tám trên, nhỏ) |
| 6,6 | Kính lao sâu: đàn hạc vuốt lên dài |
| 7,6–8,6 | Hàng gai sáng lần lượt: bốn nốt celesta khẽ |
| 9,38 | Đùi chạm mép cánh: một nốt contrabass |
| 9,55–10,55 | Năm gai vấp qua mép cánh: pizzicato Rê♭–Mi♭–Fa–La♭–Si♭ (to, ngoài lời) + glockenspiel hai quãng tám trên |
| 10,95–12,35 | Kéo ngược lại: năm nốt đi xuống ở quãng tám trên, nhỏ (dưới lời) |
| 12,62–13,4 | "Zzzzip": 22 nốt pizzicato nhanh dần; dây spiccato vuốt lên; hợp âm Rê giáng của dàn dây |
| 13,78 | Vĩ cầm hiện cạnh kính: một nốt chuông cao, rất nhỏ (dưới lời) |
| 16,6 | Miss Loupe nhấc chân: trombone "ta-daa" |
| 17,9–18,45 | Khựng: vibraphone run run (Rê♭–Fa) |
| 18,3 | Hop cười: kazoo "hi-hi-hi-hi" |
| 20,95 | Chữ móc trở lại: hợp âm Rê giáng nhỏ ở dải cao |

## Cường độ theo cảnh (`LEVEL`)

Dâng ở móc, ở tràng kéo của Hop, ở cú kính bật lên, ở năm tiếng tách đầu tiên (1,0), ở "zzzzip" (1,0), ở lúc kính hạ xuống và sau câu hỏi kết. Hạ dưới mọi câu lời (0,70–0,78) và ở chỗ khựng sau "squeak" (0,5). Nhạc còn nhường giọng bằng `toon.duck` (dải chữ −15 dB).
