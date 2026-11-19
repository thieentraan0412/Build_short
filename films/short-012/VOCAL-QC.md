# SHORT-012 · Vocal & Musical QC

> Sinh tự động bởi `_shared/tools/vocal_qc.py` ([`QUALITY.md`](../../_shared/QUALITY.md) §9, Task.md 18/11/2026). Không sửa tay: sửa `timeline.js` / `mix.py` rồi chạy lại.
> Nghe lại bằng Whisper small.en và base.en trên từng file giọng cuối (`voice/<id>.wav`); số đo âm thanh trên stem cuối (`out/stem_*.wav`).
> **LỖI** = đã xác nhận bằng số đo; **CẦN NGHE** = mới là dấu hiệu, phải nghe đoạn đó trước khi kết luận. Những gì chỉ nghe được nằm ở mục G.

**Kết quả:** 9 câu · **0 lỗi đã xác nhận** · 1 chỗ cần nghe.

## A. Bảng phân tích lỗi

| Timestamp | Lời thoại | Loại lỗi | Mức độ | Cách sửa |
|---|---|---|---|---|
| 9.38–11.89 (L05) | Front wings up, back wings down! | Synchronization: lời hơn nhạc + tiếng động 11.5 dB (sát ngưỡng 10) | CẦN NGHE | nghe xem có bị che không |

## B. Bảng lời thoại sau khi cải thiện

| Timestamp | Original Lyrics | Improved Lyrics | Vocal Style |
|---|---|---|---|
| 0.38–2.13 (L01, loupe) | Could you fly backwards? | (giữ nguyên) | Energetic, playful speech · speak |
| 3.37–4.37 (L02, loupe) | Let's zoom in! | (giữ nguyên) | Natural, clear speech · speak |
| 4.66–6.66 (L03, loupe) | Dragonflies can fly backwards! | (giữ nguyên) — giữ tốc độ .9 của bản 24 s cũ (3,9 âm tiết/s): ở .765 câu dài 2,67 s, đè lên "And stay still in the air!" | Natural, clear speech · speak |
| 7.16–8.94 (L04, loupe) | And stay still in the air! | (giữ nguyên) | Natural, clear speech · speak |
| 9.38–11.89 (L05, loupe) | Front wings up, back wings down! | (giữ nguyên) | Natural, clear speech · speak |
| 13.35–15.65 (L06, albie) | Six legs? In you go! | (giữ nguyên) | Natural, clear speech · speak |
| 17.62–19.16 (L08, albie) | Watch the corners! | (giữ nguyên) | Funny voice, comedic timing · speak |
| 19.38–21.89 (L09, loupe) | Front wings up, back wings down! | (giữ nguyên) | Natural, clear speech · speak |
| 22.13–23.97 (L10, loupe) | Which way is Zip flying? (tốc độ .9) | Which way is Zip flying? — câu hỏi kết cho trẻ trả lời to ("Backwards!"); đọc ở tốc độ lời dẫn .765 thay .9 (4,0 âm tiết/s là nhanh với trẻ 4–8 tuổi), vẫn ≤ 2 s | Cheerful, inviting question · speak |

## C. Pronunciation Guide

Từ khó (nhiều âm tiết, tên loài, cụm phụ âm cuối dễ bị nuốt, từ Whisper nghe chưa chắc). IPA lấy từ bộ phiên âm của Kokoro (espeak-ng, en-us); `ˈ` đứng trước âm tiết có trọng âm.

| Từ | IPA | Âm tiết | Trọng âm | Lưu ý |
|---|---|---|---|---|
| backwards | /bˈækwɚdz/ | 2 | âm tiết 1 | giữ rõ âm cuối /dz/ |
| let's | /lˈɛts/ | 1 | âm tiết 1 | giữ rõ âm cuối /ts/ |
| dragonflies | /dɹˈæɡənflˌaɪz/ | 3 | âm tiết 1 | âm cuối /z/ hoặc /s/ phải nghe ra; tên loài: viết và đọc đúng, không đổi từ để dễ hát |
| wings | /wˈɪŋz/ | 1 | âm tiết 1 | giữ rõ âm cuối /ŋz/ |
| six | /sˈɪks/ | 1 | âm tiết 1 | giữ rõ âm cuối /ks/ |
| legs | /lˈɛɡz/ | 1 | âm tiết 1 | giữ rõ âm cuối /ɡz/ |
| watch | /wˈɑːtʃ/ | 1 | âm tiết 1 | giữ rõ âm cuối /tʃ/ |
| which | /wˈɪtʃ/ | 1 | âm tiết 1 | giữ rõ âm cuối /tʃ/ |

**Cách ngắt câu** (‖ = chỗ thở / ngắt; theo dấu câu và nghỉ trong bản nhạc):

- L01 (speak): Could you fly backwards?
- L02 (speak): Let's zoom in!
- L03 (speak): Dragonflies can fly backwards!
- L04 (speak): And stay still in the air!
- L05 (speak): Front wings up, ‖ back wings down!
- L06 (speak): Six legs? ‖ In you go!
- L08 (speak): Watch the corners!
- L09 (speak): Front wings up, ‖ back wings down!
- L10 (speak): Which way is Zip flying?

## D. Vocal Generation Prompt

Mỗi câu một đoạn riêng (3–8 s), cùng hồ sơ giọng (`PROFILE` trong `_shared/voices.js`). Câu lỗi chỉ tạo lại đúng câu đó. Trong phim, mọi câu là giọng TTS của chính nhân vật, không hát (từ 19/11/2026, QUALITY.md §8.3); prompt dưới đây dùng khi tạo bằng công cụ AI khác hoặc khi thu giọng thật.

- **L01** ("Could you fly backwards?", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Energetic, playful speech. Natural, expressive speech at a child-friendly pace (2.9 syllables/s), clear final consonants, same voice as the character's other lines.
- **L02** ("Let's zoom in!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (3.0 syllables/s), clear final consonants, same voice as the character's other lines.
- **L03** ("Dragonflies can fly backwards!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (3.5 syllables/s), clear final consonants, same voice as the character's other lines.
- **L04** ("And stay still in the air!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (3.4 syllables/s), clear final consonants, same voice as the character's other lines.
- **L05** ("Front wings up, back wings down!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (2.4 syllables/s), clear final consonants, same voice as the character's other lines.
- **L06** ("Six legs? In you go!", spoken): Albie, a polite talking notebook: deep, slow, gentle adult male voice, Standard Southern British English, about 98 Hz. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (2.2 syllables/s), clear final consonants, same voice as the character's other lines.
- **L08** ("Watch the corners!", spoken): Albie, a polite talking notebook: deep, slow, gentle adult male voice, Standard Southern British English, about 98 Hz. Style: Funny voice, comedic timing. Natural, expressive speech at a child-friendly pace (2.6 syllables/s), clear final consonants, same voice as the character's other lines.
- **L09** ("Front wings up, back wings down!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (2.4 syllables/s), clear final consonants, same voice as the character's other lines.
- **L10** ("Which way is Zip flying?", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Cheerful, inviting question. Natural, expressive speech at a child-friendly pace (2.7 syllables/s), clear final consonants, same voice as the character's other lines.

## E. Music Generation Prompt

Mỗi cảnh nhạc một prompt (theo `out/music.json`). Chỉ để tham khảo: nhạc trong phim tổng hợp bằng code. Không lấn giọng: dưới lời giữ dải 300–4000 Hz thưa.

- **0.0–3.2 s · móc · phanh kít, bay lùi**: Playful Kids Pop, 120 BPM, Db major, instrumental only. Lead steel drum; band: steel drum, electric piano, plucked bass; percussion: dub. Mood: bất ngờ, buồn cười. Leave space for a child's voice; end with a clear change into the next scene.
- **3.2–4.5 s · "Let's zoom in!"**: Catchy Sing-along, 126 BPM, Db major, instrumental only. Lead vibraphone; band: vibraphone, ukulele, plucked bass; percussion: claps and tambourine. Mood: háo hức. Leave space for a child's voice; end with a clear change into the next scene.
- **4.5–7.0 s · kính · bay lùi**: Cartoon Musical (magical), 108 BPM, Db major, instrumental only. Lead flute; band: flute, pizzicato strings, celesta, upright bass; percussion: tom. Mood: kỳ diệu. Leave space for a child's voice; end with a clear change into the next scene.
- **7.0–9.1 s · kính · đứng yên**: Nursery Rhyme, 108 BPM, Db major, instrumental only. Lead glockenspiel; band: glockenspiel, harp, upright bass; percussion: triangle and soft shaker. Mood: ngạc nhiên, nín thở vui. Leave space for a child's voice; end with a clear change into the next scene.
- **9.1–12.2 s · soi chậm · điệp khúc 1**: Cartoon Musical (big finish), 120 BPM, Db major, instrumental only. Lead trumpet; band: trumpet, piano, plucked bass; percussion: dub. Mood: wow, vỡ lẽ. Leave space for a child's voice; build energy to a big ending.
- **13.1–15.8 s · sổ · Albie**: Playful Kids Pop, 112 BPM, Db major, instrumental only. Lead kazoo; band: kazoo, ukulele, plucked bass; percussion: dub. Mood: vui, tự hào. Leave space for a child's voice; end with a clear change into the next scene.
- **15.8–17.5 s · gag · dang tay đi lùi "bíp bíp"**: Cartoon Musical (comedy), 112 BPM, Db major, instrumental only. Lead accordion; band: accordion, pizzicato strings, tuba; percussion: cartoon woodblocks. Mood: buồn cười, tinh nghịch. Leave space for a child's voice; end with a clear change into the next scene.
- **17.5–19.0 s · "Watch the corners!"**: Cartoon Musical (comedy), 116 BPM, Db major, instrumental only. Lead bassoon; band: bassoon, marimba, plucked bass; percussion: hand claps and tambourine. Mood: buồn cười, nhẹ nhõm. Leave space for a child's voice; end with a clear change into the next scene.
- **19.0–22.0 s · điệp khúc 2**: Catchy Sing-along, 120 BPM, Db major, instrumental only. Lead trumpet; band: trumpet, piano, plucked bass; percussion: dub. Mood: vui, đọc theo. Leave space for a child's voice; end with a clear change into the next scene.
- **22.0–24.0 s · câu hỏi · vòng lặp**: Bouncy Melody, 120 BPM, Db major, instrumental only. Lead xylophone; band: xylophone, marimba, plucked bass; percussion: hand claps and shaker. Mood: háo hức, mời gọi. Leave space for a child's voice; end with a clear change into the next scene.

## F. Audio Mixing Guide (số đo trên bản trộn cuối)

- **Vocal volume:** giọng -19.2 dBFS RMS khi có lời (bản cuối −14 LUFS).
- **Background music volume:** nhạc -26.9 dBFS dưới lời, -21.0 dBFS ở khoảng trống (toàn dải; nhạc lùi 5.9 dB dưới lời, dải giọng xem qa.py "Nhạc lùi dưới giọng"). Lời hơn nhạc + tiếng động từng câu (300–4000 Hz): L01 14.7 dB, L02 22.3 dB, L03 18.9 dB, L04 19.4 dB, L05 11.5 dB, L06 16.8 dB, L08 22.2 dB, L09 12.9 dB, L10 19.9 dB.
- **SFX:** tiếng động dưới lời -34.4 dBFS RMS (thấp hơn giọng 15 dB); cue rơi vào giữa câu (gộp theo loại): L01: brake, startle, reverse, hum, dash, L02: zoom, L03: lensback, textpop, L04: slowmo, L05: chorus, stroke ×4, L06: countA ×3, tailin, gulp, pops, L08: stars, glint, L09: chorus, flap ×4, L10: hop, reverseout, recall, zipin.
- **Fade in / out:** 20 ms vào ở đầu phim (mix.py); mỗi âm tiết hát nối bằng fade 5 / 8 ms (sing.py); phim lặp liền nên không fade cuối.
- **Audio transition:** 3.2 s fill, 4.5 s fill, 7.0 s gliss, 9.1 s riser, 12.2 s tay, 13.1 s tay, 15.8 s drop, 17.5 s bump, 19.0 s pickup, 22.0 s fill ("tay" = viết tay; bảng đầy đủ trong SOUND-PLAN.md).

## G. Final Quality Checklist

| Tiêu chí (Task.md §10) | Đo được | Cách đo | Chi tiết |
|---|---|---|---|
| Phát âm rõ ràng | ĐẠT | Whisper small.en + base.en nghe từng từ; từ có xác suất < 0,5 ở cả hai mô hình | — |
| Không sai từ | ĐẠT | cả hai mô hình nghe ra đúng mọi từ và mọi từ khoá | — |
| Không nuốt âm | ĐẠT | năng lượng xát / bật ở cuối từ (bugs, legs, wings…) so với bản nói gốc | — |
| Không lặp từ ngoài ý muốn | ĐẠT | không mô hình nào nghe ra từ thừa | — |
| Giai điệu tự nhiên | ĐẠT | cao độ từng nốt so với bản nhạc (dung sai theo kiểu hát), độ kéo nguyên âm · phần "tự nhiên" chỉ nghe được | — |
| Không bị méo giọng | ĐẠT | quá tải, click ở chỗ nối, HNR so với bản nói, cao độ phẳng, vibrato | — |
| Tốc độ giọng vừa tai trẻ | ĐẠT | câu nói ≤ 4.0 âm tiết/s trên đoạn có tiếng; câu hát ≤ 3.2 âm tiết/s theo bản nhạc (trừ điệp khúc) · chậm, liền hơi: chỉ nghe được | — |
| Nhịp hát phù hợp hình ảnh | ĐẠT | âm tiết / giây, nốt ngắn nhất, ngắt ở dấu câu, từ dính nhau · khớp hành động chỉ xem được | — |
| Giọng có cảm xúc, có nhấn nhá | ĐẠT | câu nói: dải cao độ ≥ 4 nửa cung, từ nhấn cao hơn cả câu ≥ 0,5 nửa cung (emote.py uốn theo emo của câu) · cảm xúc có hợp tình huống: chỉ nghe được | — |
| Giữ nhất quán giọng nhân vật | ĐẠT | cao độ trung vị và âm lượng từng câu so với các câu khác của cùng nhân vật | — |
| Không bị nhạc nền che lấp | CẦN NGHE | lời hơn nhạc + tiếng động ≥ 10 dB ở dải 300–4000 Hz (stem cuối) | L05: lời hơn nhạc + tiếng động 11.5 dB (sát ngưỡng 10) |
| Phụ đề khớp 100% với lời thoại | ĐẠT | chữ trên phụ đề = lời; chữ hiện đúng lúc hát (± 0,3 s); khẩu hình đủ khung | — |

**Chỉ nghe / xem được (điền tay khi duyệt):**

- [ ] Giai điệu tự nhiên, hợp cảm xúc từng cảnh (không chỉ "nghe vui")
- [ ] Giọng không robot, không chuột chip; vibrato vừa phải; không thấy dấu autotune
- [ ] Giọng hát nghe như chính nhân vật, giữ cùng âm sắc giữa các đoạn
- [ ] Lời hát khớp hành động và khẩu hình
- [ ] Nếu một tiêu chí không đạt: chỉ tạo lại đúng câu đó (`sing.py --only <id>`)

