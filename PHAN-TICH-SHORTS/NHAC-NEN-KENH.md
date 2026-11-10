# Nhạc nền của kênh: kiểm tra, đề xuất nhạc vui nhộn, chống trùng lặp giữa các Short

Yêu cầu trong `Task.md` (10/11/2026): *"Hãy kiểm tra nhạc nền, hãy đề xuất nhạc nền vui nhộn, tránh trùng lặp các short."*

**Tóm tắt.**
- Lượt Sound Design Plan trước đã chống trùng trong từng tập. Giữa các tập thì nhạc vẫn lặp lại nhiều: **31/109 cảnh nền (28 %)** có công thức giống hệt một cảnh của tập khác.
- Lượt này giữ màu nhạc của từng tập và cho mỗi tập **một điệu riêng chỉ tập đó dùng**. Các cảnh đang trùng được phối lại theo thể loại của tập.
- Đã dựng lại nhạc cho 7 tập chưa đăng (001, 004, 006–010). Hình giữ nguyên, chỉ thay tiếng.
- Sau lượt này còn **4/109** cảnh trùng, cả 4 nằm trong 002, 003, 005 (đã đăng, không đụng tới).
- `qa.py` có thêm 3 mục kiểm để các tập sau không lặp lại.

Quy tắc: [`_shared/QUALITY.md` §4](../_shared/QUALITY.md#4-âm-thanh-và-nhạc-nền), các dòng *(Kênh)*.

## 1. Kiểm tra (trước lượt này)

Đọc bảng cảnh nhạc trong `SOUND-PLAN.md` của 10 Short. "Công thức" của một cảnh gồm: điệu, nhạc cụ hát chính, đệm và bộ gõ.

**Công thức trùng giữa các tập:**

| Cảnh lặp lại | Công thức | Ở các tập |
|---|---|---|
| Sổ (Albie dán sticker) | ukulele nắng + piano đồ chơi + ukulele + vỗ tay lục lạc | 002, 005, 006, 007, 008 |
| Cao trào | cao trào anh hùng + trumpet + piano + timpani | 003, 007, 008, 009 |
| Gag rình rập | rình rập hài + bassoon + pizzicato (mõ gỗ hoặc mõ hai cao độ) | 002, 003, 004, 005, 008, 009 |
| Câu đùa | ragtime + trumpet bịt + piano + snare diễu hành | 004, 009, 010 |
| Phép thuật trong kính | hộp nhạc lấp lánh + celesta + glockenspiel + triangle | 003, 004, 007 |
| Phép thuật trong kính | phiêu lưu nước kiệu + celesta + pizzicato + trống tom | 008, 009 (giống hệt) |
| Rón rén của nhân vật | rón rén + bassoon + pizzicato + mõ gỗ | 007, 010 |

Cùng điệu và nhạc cụ chính (khác đệm) lặp còn nhiều hơn: ukulele nắng + piano đồ chơi ở 6 tập, rình rập hài + bassoon ở 6 tập.

**Điệu "riêng" mà dùng chung:**
- calypso (màu nhạc của 002) có cả ở 007 và 010;
- swing (003) có ở 001;
- đồng quê (006) có ở 004;
- diễu hành (004) có ở 010.
- 007 tên "Glow-Code Bossa" nhưng không có cảnh bossa nào, vì bộ máy nhạc chưa có điệu này.

**Mức vui nhộn** (theo thời lượng):

| Tập | 001 | 002 | 003 | 004 | 005 | 006 | 007 | 008 | 009 | 010 |
|---|---|---|---|---|---|---|---|---|---|---|
| Hồi hộp + khựng | 20 % | 11 % | **30 %** | 15 % | **30 %** | 17 % | 17 % | 7 % | 3 % | **21 %** |
| Giọng thứ | 10 % | 13 % | **48 %** | 18 % | **21 %** | 17 % | **23 %** | 11 % | 16 % | 15 % |

**Không cần sửa:**
- Giọng chủ của 10 tập đã khác nhau (C, G, Dm→F, F, A, E, B♭, A♭, D, E♭).
- Motif viết tay của từng tập đã riêng (Zip tua ngược, đếm marimba, mô-típ bí mật đô–mi–sol…).

## 2. Quy tắc mới

| Quy tắc | Ngưỡng | Kiểm |
|---|---|---|
| **Điệu riêng của tập** | ≥ 1 điệu trong `SIGNATURE` (groove.py), chiếm ≥ 20 % thời lượng (tính cả đoạn viết tay); không mượn điệu riêng của tập khác | `qa.py` |
| **Không trùng cảnh nhạc của Short khác** | không cảnh nào cùng điệu + nhạc cụ hát chính + đệm + bộ gõ với một cảnh của Short khác; một cặp điệu + nhạc cụ chính ở < 3 Short khác | `qa.py`, mục "Chống trùng lặp giữa các tập" của `SOUND-PLAN.md` |
| **Nhạc vui nhộn** | hồi hộp + khựng ≤ 20 %; giọng thứ ≤ 20 % thời lượng; cảnh rình rập ưu tiên giọng trưởng, phong cách hài | `qa.py` |

- Khi hai tập trùng nhau, tập đăng trước được giữ công thức, tập sau đổi.
- `soundplan.py` ghi `films/<tập>/music-plan.json` (bản rút gọn của `out/music.json`, được commit) để các tập so với nhau. Phần so nằm ở [`_shared/audio/channel.py`](../_shared/audio/channel.py).
- **Tiếng của kênh giữ giống nhau ở mọi tập, có chủ đích:** nhạc hiệu, tiếng "chụp" (marimba chạy lên + đàn hạc vuốt) và mô-típ bí mật. Đây là các đoạn viết tay (`G.mark`), không bị so.

## 3. Điệu riêng của từng tập

Thêm 6 điệu mới vào [`_shared/audio/groove.py`](../_shared/audio/groove.py), cùng 6 bộ gõ, hi-hat mở và chuông agogô trong `band.py`. Tất cả tổng hợp bằng code, không dùng mẫu của bên thứ ba.

| Tập | Màu nhạc (giữ) | Điệu riêng | Vì sao hợp đề tài | Thời lượng |
|---|---|---|---|---|
| 001 Chân có giác quan | Tổ khúc khu vườn (C) | **jig 12/8** (mới): sáo, accordion, trống bodhrán | Chân nhảy step-dance; chia ba mỗi phách nên hình vẫn nhún đúng 120 BPM | 24 % |
| 002 Bướm nếm bằng chân | Calypso picnic (G) | calypso + trống thép | (giữ nguyên) | 27 % |
| 003 Dế có tai ở chân | Night Band (Dm→F) | swing + bộ jazz | (giữ nguyên) | 16 % |
| 004 Kiến ngửi bằng râu | Ant Parade (F) | diễu hành + **second-line** (mới): tuba, trombone, snare lệch phách | Đoàn kiến diễu phố kiểu New Orleans | 27 % |
| 005 Kiến chào Tap-Tap | Tap-Tap Waltz (A) | valse 3/4 | (giữ nguyên) | 39 % |
| 006 Trại bò tí hon | Barnyard Hoedown (E) | đồng quê + banjo | Sân trại; nay chỉ tập này dùng | 31 % |
| 007 Mã ánh sáng | Glow-Code Bossa (B♭) | **bossa nova** (mới): rim clave, phím điện | Đêm vườn lấp lánh; làm đúng tên màu nhạc | 24 % |
| 008 Ánh sáng không nóng | Campfire Glow (A♭) | **disco** (mới): kick bốn phách, hi-hat mở, dàn dây | Ánh sáng mà không nóng = tiệc que phát sáng | 25 % |
| 009 Đom đóm là bọ cánh cứng | Sunset Counting Song (D) | **ska** (mới): đệm chặn mọi phách lẻ, kèn đồng | Bài đếm "one, two…" theo phách lẻ | 23 % |
| 010 Chuồn chuồn nhìn ra sau | Rewind Pond Hop (E♭) | **samba** (mới): surdo, tamborim, agogô, ganzá | "Hàng nghìn Crumb" là một lễ hội | 24 % |

## 4. Thay đổi và đề xuất từng tập

Bảng đầy đủ từng cảnh nằm trong `SOUND-PLAN.md` của mỗi tập, sinh từ `mix.py`. Lý do từng chỗ đổi nằm trong `MUSIC.md` của tập, mục "Lượt chống trùng giữa các tập".

### Đã dựng lại (chưa đăng)

| Tập | Đã đổi |
|---|---|
| **001** | Ong nhảy: swing → jig (bass vo ve của ong, accordion, bodhrán; mô-típ bí mật chia ba trên sáo). Bản đồ: pizzicato chạy chia ba (jig phiêu lưu). Albie: shuffle + piano đồ chơi → jig ukulele, accordion đáp. Giữ cảnh dế La thứ bừng sang Đô trưởng vì đó là cách kể của tập. |
| **004** | Trại rệp: đồng quê → second-line, clarinet hát kiểu New Orleans. Sổ: ukulele nắng → second-line, trumpet đáp. Thám tử: bassoon → trombone "wah". Đường mùi sáng: celesta → đàn hạc. |
| **006** | Sổ: ukulele nắng + piano đồ chơi → shuffle, banjo đáp. Giọt nảy: polka, xylophone → trombone "oom-pah". |
| **007** | Móc, sổ, nháy đáp: bossa nova (nháy đáp bỏ calypso). Ánh sáng lạnh: Sol thứ → Si giáng trưởng maj7. Đồng diễn: trumpet bịt + marimba. Mật mã: celesta trên phím điện. Cao trào: kèn đồ chơi hát thay trumpet. |
| **008** | Giơ kính, sổ, cao trào "bùng chói": disco. Móc: rón rén hài, marimba "run cầm cập" (bassoon vẫn là cái lạnh). |
| **009** | "Me!", đếm cánh ruồi, cao trào: ska. Tấm cánh: đàn hạc hát. Sổ: accordion. Gag: kazoo của Fizz. |
| **010** | "Nope!" bay lùi, nghìn Crumb (bỏ calypso), sổ (bỏ diễu hành): samba. Rón rén của Crumb: pizzicato hát, bassoon đệm, phong cách hài. Crumb đi một vòng: Đô thứ → Mi giáng trưởng. Câu đùa: trombone. |

### Đề xuất nếu dựng lại (đã đăng, giữ nguyên)

| Tập | Vấn đề còn lại | Đề xuất |
|---|---|---|
| **002** | Sổ trùng công thức với 005 (ukulele nắng + piano đồ chơi) | Sổ chơi calypso của tập, trống thép hát (nghe ra ngay là tập picnic) |
| | Gag: rình rập hài + bassoon (cặp này đã có ở 003, 005) | Rón rén giọng Sol trưởng, xylophone hát, mõ hai cao độ |
| **003** | Swing chỉ chiếm 16 % (< 20 %) | Đổi cảnh shuffle (12,9–15,4 s) sang swing, vibraphone đáp |
| | Giọng thứ 48 %, hồi hộp + khựng 30 % (nhiều nhất kênh) | Móc (nhịp tim, 0–2,5 s), hộp nhạc (19,3–22,2 s) và cảnh kết (22,2–24 s) chuyển sang Fa trưởng; giữ một cảnh Rê thứ cho bóng đêm. Ước tính giọng thứ còn khoảng 15 % |
| | Gag trùng công thức với 005 (rình rập + bassoon + pizzicato + mõ gỗ) | Rình rập hài với contrabass đi bộ, phím điện hát, bộ jazz (đúng màu Night Band) |
| **005** | Sổ trùng với 002 | Valse 3/4 với accordion hát (valse musette), ukulele đệm |
| | Gag trùng với 003 | Rón rén giọng La trưởng, pizzicato hát, mõ hai cao độ |
| | Hồi hộp 30 % | Cảnh "lắng nghe" (20,5–22,9 s, Si thứ) đổi sang valse lơ lửng La trưởng, glockenspiel; khựng ngắn lại |

## 5. Kết quả (sau lượt này)

| Tập | Điệu riêng | Trùng công thức với Short khác | Hồi hộp + khựng | Giọng thứ | `qa.py` |
|---|---|---|---|---|---|
| 001 | jig 12/8 · 24 % | 0 | 20 % | 10 % | 46 đạt · 7 cảnh báo · 0 chưa đạt |
| 004 | diễu hành + second-line · 27 % | 0 | 15 % | 18 % | 46 đạt · 8 cảnh báo · 0 chưa đạt |
| 006 | đồng quê · 31 % | 0 | 17 % | 17 % | 53 đạt · 0 cảnh báo · 0 chưa đạt |
| 007 | bossa nova · 24 % | 0 | 17 % | 16 % | 54 đạt · 0 cảnh báo · 0 chưa đạt |
| 008 | disco · 25 % | 0 | 7 % | 11 % | 53 đạt · 0 cảnh báo · 0 chưa đạt |
| 009 | ska · 23 % | 0 | 3 % | 16 % | 53 đạt · 0 cảnh báo · 0 chưa đạt |
| 010 | samba · 24 % | 0 | 9 % | 8 % | 54 đạt · 0 cảnh báo · 0 chưa đạt |

- Toàn kênh: công thức trùng giữa các tập **31/109 → 4/109**. 4 cảnh còn lại là 002 ↔ 005 (sổ) và 003 ↔ 005 (gag), đều là tập đã đăng.
- Độ to của 7 tập: −13,9 đến −14,1 LUFS. Lời rõ hơn nhạc + tiếng động ≥ 10,2 dB ở mọi câu.
- Cảnh báo của 001 và 004 là hình và định dạng của công thức cũ (nhạc hiệu 2 s, cảnh sổ dài, đoạn không lời dài, phụ đề vùng dưới). Không mục nào là nhạc; lượt này không đổi hình.
- Hình của cả 7 mp4 trùng từng bit với bản đã giao (mux lại: luồng hình chép thẳng, tiếng mới đã chuẩn hoá −14 LUFS).

## 6. Tập mới (011 trở đi)

1. Chọn một điệu mới hợp đề tài, thêm vào `STYLES` và ghi vào `SIGNATURE` trong `groove.py`. Gợi ý, đều làm được bằng nhạc cụ đã có:
   - cha-cha-chá (bước chân côn trùng): piano montuno, mõ;
   - cumbia (accordion);
   - boogie-woogie (piano);
   - tarantella 12/8 (accordion, mandolin bằng banjo rung);
   - hula đảo nhỏ (ukulele + còi trượt);
   - sea shanty bên ao (accordion, tuba);
   - chiptune 8-bit (cần thêm một tiếng sóng vuông vào `band.py`).
2. Cảnh sổ, gag và cao trào phối theo điệu hoặc thể loại của tập.
3. Chạy `mix.py` → `soundplan.py` → `qa.py`. Nếu mục "Không trùng cảnh nhạc của Short khác" là CẢNH BÁO thì đổi nhạc cụ hát chính hoặc điệu của cảnh đó.

## 7. Còn phải nghe lại

Máy không nghe được. Trước khi đăng, nghe lại 7 tập trên loa điện thoại:
- Jig ở đoạn ong nhảy (001) có khớp từng bước nhảy không.
- Disco ở cao trào 008 có lấn câu "I'm not glowing!" không.
- Samba ở cảnh nghìn Crumb (010) có che làn mưa toy piano không.
- Chỗ chuyển giữa điệu riêng và các cảnh còn lại có tự nhiên không.

Checklist: cuối [`_shared/QUALITY.md`](../_shared/QUALITY.md).
