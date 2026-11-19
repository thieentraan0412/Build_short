# SHORT-011 · Vocal & Musical QC

> Sinh tự động bởi `_shared/tools/vocal_qc.py` ([`QUALITY.md`](../../_shared/QUALITY.md) §9, Task.md 18/11/2026). Không sửa tay: sửa `timeline.js` / `mix.py` rồi chạy lại.
> Nghe lại bằng Whisper small.en và base.en trên từng file giọng cuối (`voice/<id>.wav`); số đo âm thanh trên stem cuối (`out/stem_*.wav`).
> **LỖI** = đã xác nhận bằng số đo; **CẦN NGHE** = mới là dấu hiệu, phải nghe đoạn đó trước khi kết luận. Những gì chỉ nghe được nằm ở mục G.

**Kết quả:** 10 câu · **0 lỗi đã xác nhận** · 5 chỗ cần nghe.

## A. Bảng phân tích lỗi

| Timestamp | Lời thoại | Loại lỗi | Mức độ | Cách sửa |
|---|---|---|---|---|
| 3.00–4.50 (L02) | From behind, it can't see me! | Rhythm: nói nhanh: 5.0 âm tiết/s trên đoạn có tiếng (> 4.0) | CẦN NGHE | pace thấp hơn cho câu này (giọng Dot có pitch +3,5 nửa cung nên nhanh hơn speed ~22 %), dời câu sau, hoặc bớt chữ |
| 7.21–8.97 (L04) | But Zip can see Crumb! | Synchronization: lời hơn nhạc + tiếng động 11.1 dB (sát ngưỡng 10) | CẦN NGHE | nghe xem có bị che không |
| 10.54–12.91 (L06) | Big eyes see almost all around! | Synchronization: lời hơn nhạc + tiếng động 11.4 dB (sát ngưỡng 10) | CẦN NGHE | nghe xem có bị che không |
| 18.60–19.89 (L08) | Oh! I scared myself! | Rhythm: nói nhanh: 5.0 âm tiết/s trên đoạn có tiếng (> 4.0) | CẦN NGHE | pace thấp hơn cho câu này (giọng Dot có pitch +3,5 nửa cung nên nhanh hơn speed ~22 %), dời câu sau, hoặc bớt chữ |
| 20.23–22.61 (L09) | Big eyes see almost all around! | Synchronization: lời hơn nhạc + tiếng động 11.2 dB (sát ngưỡng 10) | CẦN NGHE | nghe xem có bị che không |

## B. Bảng lời thoại sau khi cải thiện

| Timestamp | Original Lyrics | Improved Lyrics | Vocal Style |
|---|---|---|---|
| 0.38–2.79 (L01, loupe) | Can you sneak up on a dragonfly? | (giữ nguyên) | Energetic, playful speech · speak |
| 3.00–4.50 (L02, crumb) | From behind, it can't see me! | (giữ nguyên) — giữ tốc độ chuẩn của Crumb (.85): Kokoro af_jessica đọc chậm hơn (.68–.8) sinh tiếng "uh" ở đầu câu, base.en và small.en nghe thành "But / Or from behind" (thử 8 cách viết, 19/11/2026) | Natural, clear speech · speak |
| 5.01–7.00 (L03, loupe) | Crumb only sees its back. | (giữ nguyên) | Natural, clear speech · speak |
| 7.21–8.97 (L04, loupe) | But Zip can see Crumb! | (giữ nguyên) | Natural, clear speech · speak |
| 9.18–10.03 (L05, crumb) | Oh no! | (giữ nguyên) — uốn ngữ điệu giật mình đủ mạnh (1,1) thì base.en nghe "Oh no!" thành "Although, no": độ uốn .5 | Funny voice, comedic timing · speak |
| 10.54–12.91 (L06, loupe) | Its big eyes see almost all around! | Big eyes see almost all around! — thành điệp khúc (≤ 8 từ, nhắc lại trước câu hỏi kết); giữ "almost" đúng nguồn (FACTS.md §2) | Natural, clear speech · speak |
| 14.25–16.55 (L07, albie) | Six legs? In you go! | (giữ nguyên) | Natural, clear speech · speak |
| 18.60–19.89 (L08, crumb) | Oh! I scared myself! | (giữ nguyên) — tốc độ chuẩn của Crumb (.85): đọc chậm (.68, .72) thì small.en nghe "Oh! I" thành "Although I" | Funny voice, comedic timing · speak |
| 20.23–22.61 (L09, loupe) | Big eyes see almost all around! | (giữ nguyên) | Natural, clear speech · speak |
| 22.88–24.67 (L10, loupe) | Can YOU sneak up on Zip? | (giữ nguyên) — câu hỏi kết cho trẻ trả lời to ("No!"); đọc chậm hơn tốc độ chuẩn .9 của bản 22 s (4,2 âm tiết/s là nhanh với trẻ 4–8 tuổi), vẫn ≤ 2 s | Cheerful, inviting question · speak |

## C. Pronunciation Guide

Từ khó (nhiều âm tiết, tên loài, cụm phụ âm cuối dễ bị nuốt, từ Whisper nghe chưa chắc). IPA lấy từ bộ phiên âm của Kokoro (espeak-ng, en-us); `ˈ` đứng trước âm tiết có trọng âm.

| Từ | IPA | Âm tiết | Trọng âm | Lưu ý |
|---|---|---|---|---|
| dragonfly | /dɹˈæɡənflˌaɪ/ | 3 | âm tiết 1 | tên loài: viết và đọc đúng, không đổi từ để dễ hát |
| its | /ɪts/ | 1 | âm tiết 1 | giữ rõ âm cuối /ts/ |
| six | /sˈɪks/ | 1 | âm tiết 1 | giữ rõ âm cuối /ks/ |
| legs | /lˈɛɡz/ | 1 | âm tiết 1 | giữ rõ âm cuối /ɡz/ |

**Cách ngắt câu** (‖ = chỗ thở / ngắt; theo dấu câu và nghỉ trong bản nhạc):

- L01 (speak): Can you sneak up on a dragonfly?
- L02 (speak): From behind, ‖ it can't see me!
- L03 (speak): Crumb only sees its back.
- L04 (speak): But Zip can see Crumb!
- L05 (speak): Oh no!
- L06 (speak): Big eyes see almost all around!
- L07 (speak): Six legs? ‖ In you go!
- L08 (speak): Oh! ‖ I scared myself!
- L09 (speak): Big eyes see almost all around!
- L10 (speak): Can YOU sneak up on Zip?

## D. Vocal Generation Prompt

Mỗi câu một đoạn riêng (3–8 s), cùng hồ sơ giọng (`PROFILE` trong `_shared/voices.js`). Câu lỗi chỉ tạo lại đúng câu đó. Trong phim, mọi câu là giọng TTS của chính nhân vật, không hát (từ 19/11/2026, QUALITY.md §8.3); prompt dưới đây dùng khi tạo bằng công cụ AI khác hoặc khi thu giọng thật.

- **L01** ("Can you sneak up on a dragonfly?", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Energetic, playful speech. Natural, expressive speech at a child-friendly pace (3.7 syllables/s), clear final consonants, same voice as the character's other lines.
- **L02** ("From behind, it can't see me!", spoken): Crumb, a tiny excited ant kid: high, quick, giggly child voice, American English, about 270 Hz. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (4.7 syllables/s), clear final consonants, same voice as the character's other lines.
- **L03** ("Crumb only sees its back.", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (3.0 syllables/s), clear final consonants, same voice as the character's other lines.
- **L04** ("But Zip can see Crumb!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (2.8 syllables/s), clear final consonants, same voice as the character's other lines.
- **L05** ("Oh no!", spoken): Crumb, a tiny excited ant kid: high, quick, giggly child voice, American English, about 270 Hz. Style: Funny voice, comedic timing. Natural, expressive speech at a child-friendly pace (2.4 syllables/s), clear final consonants, same voice as the character's other lines.
- **L06** ("Big eyes see almost all around!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (3.4 syllables/s), clear final consonants, same voice as the character's other lines.
- **L07** ("Six legs? In you go!", spoken): Albie, a polite talking notebook: deep, slow, gentle adult male voice, Standard Southern British English, about 98 Hz. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (2.2 syllables/s), clear final consonants, same voice as the character's other lines.
- **L08** ("Oh! I scared myself!", spoken): Crumb, a tiny excited ant kid: high, quick, giggly child voice, American English, about 270 Hz. Style: Funny voice, comedic timing. Natural, expressive speech at a child-friendly pace (4.7 syllables/s), clear final consonants, same voice as the character's other lines.
- **L09** ("Big eyes see almost all around!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (3.4 syllables/s), clear final consonants, same voice as the character's other lines.
- **L10** ("Can YOU sneak up on Zip?", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Cheerful, inviting question. Natural, expressive speech at a child-friendly pace (3.4 syllables/s), clear final consonants, same voice as the character's other lines.

## E. Music Generation Prompt

Mỗi cảnh nhạc một prompt (theo `out/music.json`). Chỉ để tham khảo: nhạc trong phim tổng hợp bằng code. Không lấn giọng: dưới lời giữ dải 300–4000 Hz thưa.

- **0.0–2.9 s · móc · rón rén cha-cha**: Cartoon Musical (comedy), 120 BPM, B major, instrumental only. Lead clarinet; band: clarinet, marimba, plucked bass; percussion: cha. Mood: tinh nghịch, tò mò. Leave space for a child's voice; end with a clear change into the next scene.
- **2.9–4.3 s · "From behind, it can't see me!"**: Cartoon Musical (comedy), 116 BPM, B major, instrumental only. Lead muted trumpet; band: muted trumpet, pizzicato strings, plucked bass; percussion: woodblock and shaker. Mood: tự tin, buồn cười. Leave space for a child's voice; end with a clear change into the next scene.
- **4.8–7.0 s · Crumb thấy lưng Zip**: Playful Kids Pop, 108 BPM, B major, instrumental only. Lead vibraphone; band: vibraphone, harp, upright bass; percussion: hand claps and shaker. Mood: tò mò, chờ đợi. Leave space for a child's voice; end with a clear change into the next scene.
- **7.0–9.2 s · mắt Zip mở · tầm nhìn nở rộng**: Cartoon Musical (magical), 108 BPM, B major, instrumental only. Lead steel drum; band: steel drum, celesta, plucked bass; percussion: triangle and soft shaker. Mood: kỳ diệu, bất ngờ. Leave space for a child's voice; end with a clear change into the next scene.
- **10.2–13.2 s · điệp khúc 1 · "Big eyes see almost all around!"**: Cartoon Musical (big finish), 132 BPM, B major, instrumental only. Lead trumpet; band: trumpet, piano, plucked bass; percussion: cha. Mood: vỡ lẽ, phấn khích. Leave space for a child's voice; build energy to a big ending.
- **14.1–16.8 s · sổ · Albie**: Playful Kids Pop, 116 BPM, E major, instrumental only. Lead accordion; band: accordion, ukulele, plucked bass; percussion: hand claps and tambourine. Mood: vui, tự hào. Leave space for a child's voice; end with a clear change into the next scene.
- **16.8–18.1 s · gag · rón rén lần nữa**: Cartoon Musical (comedy), 124 BPM, B major, instrumental only. Lead bassoon; band: bassoon, pizzicato strings, tuba; percussion: cha. Mood: tinh nghịch, nín thở. Leave space for a child's voice; end with a clear change into the next scene.
- **18.6–19.9 s · "Oh! I scared myself!"**: Catchy Sing-along, 124 BPM, E major, instrumental only. Lead xylophone; band: xylophone, ukulele, plucked bass; percussion: claps and tambourine. Mood: vui, nhẹ nhõm. Leave space for a child's voice; end with a clear change into the next scene.
- **19.9–23.0 s · điệp khúc 2**: Catchy Sing-along, 132 BPM, B major, instrumental only. Lead trumpet; band: trumpet, piano, plucked bass; percussion: cha. Mood: vui, đọc theo. Leave space for a child's voice; end with a clear change into the next scene.
- **23.0–25.0 s · câu hỏi · vòng lặp**: Bouncy Melody, 120 BPM, B major, instrumental only. Lead marimba; band: marimba, ukulele, plucked bass; percussion: bongos. Mood: mời gọi, háo hức. Leave space for a child's voice; end with a clear change into the next scene.

## F. Audio Mixing Guide (số đo trên bản trộn cuối)

- **Vocal volume:** giọng -20.9 dBFS RMS khi có lời (bản cuối −14 LUFS).
- **Background music volume:** nhạc -28.1 dBFS dưới lời, -21.0 dBFS ở khoảng trống (toàn dải; nhạc lùi 7.1 dB dưới lời, dải giọng xem qa.py "Nhạc lùi dưới giọng"). Lời hơn nhạc + tiếng động từng câu (300–4000 Hz): L01 12.2 dB, L02 15.1 dB, L03 17.4 dB, L04 11.1 dB, L05 33.3 dB, L06 11.4 dB, L07 14.7 dB, L08 17.5 dB, L09 11.2 dB, L10 12.7 dB.
- **SFX:** tiếng động dưới lời -37.5 dBFS RMS (thấp hơn giọng 17 dB); cue rơi vào giữa câu (gộp theo loại): L01: tiptoe ×3, crunch, wobble, twitch, sheepish, L02: tiltdown, zipper, L03: pushL, L04: widen, spot, L05: hide, L06: glow, sweep, peek, L07: textpop, countA ×3, jump, gulp, L08: plop, hat, giggle, L09: glow, sweep, getup, L10: zipturn, recall, tiltup, tiptoe.
- **Fade in / out:** 20 ms vào ở đầu phim (mix.py); mỗi âm tiết hát nối bằng fade 5 / 8 ms (sing.py); phim lặp liền nên không fade cuối.
- **Audio transition:** 2.9 s fill, 4.3 s tay, 4.8 s tay, 7.0 s swell, 9.2 s tay, 10.2 s tay, 13.2 s tay, 14.1 s tay, 16.8 s gliss, 18.1 s tay, 18.6 s tay, 19.9 s pickup, 23.0 s fill ("tay" = viết tay; bảng đầy đủ trong SOUND-PLAN.md).

## G. Final Quality Checklist

| Tiêu chí (Task.md §10) | Đo được | Cách đo | Chi tiết |
|---|---|---|---|
| Phát âm rõ ràng | ĐẠT | Whisper small.en + base.en nghe từng từ; từ có xác suất < 0,5 ở cả hai mô hình | — |
| Không sai từ | ĐẠT | cả hai mô hình nghe ra đúng mọi từ và mọi từ khoá | — |
| Không nuốt âm | ĐẠT | năng lượng xát / bật ở cuối từ (bugs, legs, wings…) so với bản nói gốc | — |
| Không lặp từ ngoài ý muốn | ĐẠT | không mô hình nào nghe ra từ thừa | — |
| Giai điệu tự nhiên | ĐẠT | cao độ từng nốt so với bản nhạc (dung sai theo kiểu hát), độ kéo nguyên âm · phần "tự nhiên" chỉ nghe được | — |
| Không bị méo giọng | ĐẠT | quá tải, click ở chỗ nối, HNR so với bản nói, cao độ phẳng, vibrato | — |
| Tốc độ giọng vừa tai trẻ | CẦN NGHE | câu nói ≤ 4.0 âm tiết/s trên đoạn có tiếng; câu hát ≤ 3.2 âm tiết/s theo bản nhạc (trừ điệp khúc) · chậm, liền hơi: chỉ nghe được | L02: nói nhanh: 5.0 âm tiết/s trên đoạn có tiếng (> 4.0); L08: nói nhanh: 5.0 âm tiết/s trên đoạn có tiếng (> 4.0) |
| Nhịp hát phù hợp hình ảnh | ĐẠT | âm tiết / giây, nốt ngắn nhất, ngắt ở dấu câu, từ dính nhau · khớp hành động chỉ xem được | — |
| Giọng có cảm xúc, có nhấn nhá | ĐẠT | câu nói: dải cao độ ≥ 4 nửa cung, từ nhấn cao hơn cả câu ≥ 0,5 nửa cung (emote.py uốn theo emo của câu) · cảm xúc có hợp tình huống: chỉ nghe được | — |
| Giữ nhất quán giọng nhân vật | ĐẠT | cao độ trung vị và âm lượng từng câu so với các câu khác của cùng nhân vật | — |
| Không bị nhạc nền che lấp | CẦN NGHE | lời hơn nhạc + tiếng động ≥ 10 dB ở dải 300–4000 Hz (stem cuối) | L04: lời hơn nhạc + tiếng động 11.1 dB (sát ngưỡng 10); L06: lời hơn nhạc + tiếng động 11.4 dB (sát ngưỡng 10); L09: lời hơn nhạc + tiếng động 11.2 dB (sát ngưỡng 10) |
| Phụ đề khớp 100% với lời thoại | ĐẠT | chữ trên phụ đề = lời; chữ hiện đúng lúc hát (± 0,3 s); khẩu hình đủ khung | — |

**Chỉ nghe / xem được (điền tay khi duyệt):**

- [ ] Giai điệu tự nhiên, hợp cảm xúc từng cảnh (không chỉ "nghe vui")
- [ ] Giọng không robot, không chuột chip; vibrato vừa phải; không thấy dấu autotune
- [ ] Giọng hát nghe như chính nhân vật, giữ cùng âm sắc giữa các đoạn
- [ ] Lời hát khớp hành động và khẩu hình
- [ ] Nếu một tiêu chí không đạt: chỉ tạo lại đúng câu đó (`sing.py --only <id>`)

