# SHORT-013 · Vocal & Musical QC

> Sinh tự động bởi `_shared/tools/vocal_qc.py` ([`QUALITY.md`](../../_shared/QUALITY.md) §9, Task.md 18/11/2026). Không sửa tay: sửa `timeline.js` / `mix.py` rồi chạy lại.
> Nghe lại bằng Whisper small.en và base.en trên từng file giọng cuối (`voice/<id>.wav`); số đo âm thanh trên stem cuối (`out/stem_*.wav`).
> **LỖI** = đã xác nhận bằng số đo; **CẦN NGHE** = mới là dấu hiệu, phải nghe đoạn đó trước khi kết luận. Những gì chỉ nghe được nằm ở mục G.

**Kết quả:** 18 câu · **0 lỗi đã xác nhận** · 7 chỗ cần nghe.

## A. Bảng phân tích lỗi

| Timestamp | Lời thoại | Loại lỗi | Mức độ | Cách sửa |
|---|---|---|---|---|
| 0.38–2.82 (L01) | Where does a grasshopper hide its ears? | Synchronization: lời hơn nhạc + tiếng động 10.9 dB (sát ngưỡng 10) | CẦN NGHE | nghe xem có bị che không |
| 5.16–6.71 (L03) | Are they on its legs, like Chirp? | Rhythm: nói nhanh: 4.7 âm tiết/s trên đoạn có tiếng (> 4.0) | CẦN NGHE | pace thấp hơn cho câu này (giọng Dot có pitch +3,5 nửa cung nên nhanh hơn speed ~22 %), dời câu sau, hoặc bớt chữ |
| 5.16–6.71 (L03) | Are they on its legs, like Chirp? | Voice: từ nhấn chưa nổi: đỉnh cao độ -0.2 nửa cung so với cả câu | CẦN NGHE | tăng em của emote.py hoặc kiểm từ nhấn |
| 10.60–11.82 (L06) | But WHY on its tummy? | Rhythm: nói nhanh: 5.3 âm tiết/s trên đoạn có tiếng (> 4.0) | CẦN NGHE | pace thấp hơn cho câu này (giọng Dot có pitch +3,5 nửa cung nên nhanh hơn speed ~22 %), dời câu sau, hoặc bớt chữ |
| 24.62–25.63 (L11) | Look at it go! | Rhythm: nói nhanh: 4.3 âm tiết/s trên đoạn có tiếng (> 4.0) | CẦN NGHE | pace thấp hơn cho câu này (giọng Dot có pitch +3,5 nửa cung nên nhanh hơn speed ~22 %), dời câu sau, hoặc bớt chữ |
| 24.62–25.63 (L11) | Look at it go! | Voice: từ nhấn chưa nổi: đỉnh cao độ -1.0 nửa cung so với cả câu | CẦN NGHE | tăng em của emote.py hoặc kiểm từ nhấn |
| 35.15–36.34 (L15) | Play it again! Louder! | Rhythm: nói nhanh: 5.5 âm tiết/s trên đoạn có tiếng (> 4.0) | CẦN NGHE | pace thấp hơn cho câu này (giọng Dot có pitch +3,5 nửa cung nên nhanh hơn speed ~22 %), dời câu sau, hoặc bớt chữ |

## B. Bảng lời thoại sau khi cải thiện

| Timestamp | Original Lyrics | Improved Lyrics | Vocal Style |
|---|---|---|---|
| 0.38–2.82 (L01, loupe) | Where does a grasshopper hide its ears? | (giữ nguyên) | Energetic, playful speech · speak |
| 3.96–4.96 (L02, loupe) | Let's zoom in! | (giữ nguyên) | Natural, clear speech · speak |
| 5.16–6.71 (L03, crumb) | Are they on its legs, like Chirp? | (giữ nguyên) | Natural, clear speech · speak |
| 7.46–8.09 (L04, loupe) | Nope! | (giữ nguyên) | Funny voice, comedic timing · speak |
| 8.29–10.20 (L05, loupe) | Its ears are on its tummy! | (giữ nguyên) | Natural, clear speech · speak |
| 10.60–11.82 (L06, crumb) | But WHY on its tummy? | (giữ nguyên) | Natural, clear speech · speak |
| 12.24–14.46 (L07, loupe) | To hear other grasshoppers sing! | (giữ nguyên) | Natural, clear speech · speak |
| 15.38–17.95 (L08, loupe) | Many grasshoppers sing with their legs! | (giữ nguyên) | Natural, clear speech · speak |
| 18.13–20.30 (L09, loupe) | They rub a back leg on a wing! | (giữ nguyên) — giọng SHORT-015 (.765) đọc câu 8 âm tiết ở 4,2 âm tiết/s (> 4,0 cho trẻ 4–8 tuổi): chậm hơn 2 % (pace .8 thì base.en nghe thêm "So" ở đầu câu) | Natural, clear speech · speak |
| 22.05–24.40 (L10, loupe) | And its back legs are like springs! | (giữ nguyên) | Natural, clear speech · speak |
| 24.62–25.63 (L11, crumb) | Look at it go! | (giữ nguyên) | Natural, clear speech · speak |
| 26.25–27.12 (L12, crumb) | A bug band! | (giữ nguyên) | Natural, clear speech · speak |
| 27.38–29.75 (L13, loupe) | The notes make a heart! | Tummy ears, and legs that sing! — thành điệp khúc (gom hai bí mật, đọc theo được); trái tim nốt nhạc vẫn hiện trên hình. "Tummy ears and singing legs!" bị cả hai Whisper nghe "Tommy": đổi thành "Tummy ears, and legs that sing!" | Natural, clear speech · speak |
| 31.60–33.90 (L14, albie) | Six legs? In you go! | (giữ nguyên) | Natural, clear speech · speak |
| 35.15–36.34 (L15, crumb) | Play it again! Louder! | (giữ nguyên) — giữ ngữ điệu TTS gốc (emote: false): mọi cách uốn (excited 1,1 / .5, happy .5) làm base.en nghe thêm "We will / I will" ở đầu câu | Funny voice, comedic timing · speak |
| 39.25–40.41 (L16, loupe) | Oops! Too loud! | (giữ nguyên) — giữ tốc độ .9 của bản cũ (câu cảm thán ngắn): ở .765 base.en nghe "It oops, too loud" | Funny voice, comedic timing · speak |
| 41.38–43.75 (L17, loupe) | Tummy ears, and legs that sing! | (giữ nguyên) | Natural, clear speech · speak |
| 44.13–45.38 (L18, loupe) | Where are YOUR ears? | (giữ nguyên) | Cheerful, inviting question · speak |

## C. Pronunciation Guide

Từ khó (nhiều âm tiết, tên loài, cụm phụ âm cuối dễ bị nuốt, từ Whisper nghe chưa chắc). IPA lấy từ bộ phiên âm của Kokoro (espeak-ng, en-us); `ˈ` đứng trước âm tiết có trọng âm.

| Từ | IPA | Âm tiết | Trọng âm | Lưu ý |
|---|---|---|---|---|
| grasshopper | /ɡɹˈæshɑːpɚ/ | 3 | âm tiết 1 | tên loài: viết và đọc đúng, không đổi từ để dễ hát |
| its | /ɪts/ | 1 | âm tiết 1 | giữ rõ âm cuối /ts/ |
| let's | /lˈɛts/ | 1 | âm tiết 1 | giữ rõ âm cuối /ts/ |
| legs | /lˈɛɡz/ | 1 | âm tiết 1 | giữ rõ âm cuối /ɡz/ |
| grasshoppers | /ɡɹˈæshɑːpɚz/ | 3 | âm tiết 1 | âm cuối /z/ hoặc /s/ phải nghe ra; tên loài: viết và đọc đúng, không đổi từ để dễ hát |
| springs | /spɹˈɪŋz/ | 1 | âm tiết 1 | giữ rõ âm cuối /ŋz/ |
| six | /sˈɪks/ | 1 | âm tiết 1 | giữ rõ âm cuối /ks/ |
| oops | /ˈuːps/ | 1 | âm tiết 1 | giữ rõ âm cuối /ps/ |

**Cách ngắt câu** (‖ = chỗ thở / ngắt; theo dấu câu và nghỉ trong bản nhạc):

- L01 (speak): Where does a grasshopper hide its ears?
- L02 (speak): Let's zoom in!
- L03 (speak): Are they on its legs, ‖ like Chirp?
- L04 (speak): Nope!
- L05 (speak): Its ears are on its tummy!
- L06 (speak): But WHY on its tummy?
- L07 (speak): To hear other grasshoppers sing!
- L08 (speak): Many grasshoppers sing with their legs!
- L09 (speak): They rub a back leg on a wing!
- L10 (speak): And its back legs are like springs!
- L11 (speak): Look at it go!
- L12 (speak): A bug band!
- L13 (speak): Tummy ears, ‖ and legs that sing!
- L14 (speak): Six legs? ‖ In you go!
- L15 (speak): Play it again! ‖ Louder!
- L16 (speak): Oops! ‖ Too loud!
- L17 (speak): Tummy ears, ‖ and legs that sing!
- L18 (speak): Where are YOUR ears?

## D. Vocal Generation Prompt

Mỗi câu một đoạn riêng (3–8 s), cùng hồ sơ giọng (`PROFILE` trong `_shared/voices.js`). Câu lỗi chỉ tạo lại đúng câu đó. Trong phim, mọi câu là giọng TTS của chính nhân vật, không hát (từ 19/11/2026, QUALITY.md §8.3); prompt dưới đây dùng khi tạo bằng công cụ AI khác hoặc khi thu giọng thật.

- **L01** ("Where does a grasshopper hide its ears?", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Energetic, playful speech. Natural, expressive speech at a child-friendly pace (3.7 syllables/s), clear final consonants, same voice as the character's other lines.
- **L02** ("Let's zoom in!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (3.0 syllables/s), clear final consonants, same voice as the character's other lines.
- **L03** ("Are they on its legs, like Chirp?", spoken): Crumb, a tiny excited ant kid: high, quick, giggly child voice, American English, about 270 Hz. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (4.5 syllables/s), clear final consonants, same voice as the character's other lines.
- **L04** ("Nope!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Funny voice, comedic timing. Natural, expressive speech at a child-friendly pace (1.6 syllables/s), clear final consonants, same voice as the character's other lines.
- **L05** ("Its ears are on its tummy!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (3.7 syllables/s), clear final consonants, same voice as the character's other lines.
- **L06** ("But WHY on its tummy?", spoken): Crumb, a tiny excited ant kid: high, quick, giggly child voice, American English, about 270 Hz. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (4.9 syllables/s), clear final consonants, same voice as the character's other lines.
- **L07** ("To hear other grasshoppers sing!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (3.6 syllables/s), clear final consonants, same voice as the character's other lines.
- **L08** ("Many grasshoppers sing with their legs!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (3.5 syllables/s), clear final consonants, same voice as the character's other lines.
- **L09** ("They rub a back leg on a wing!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (3.7 syllables/s), clear final consonants, same voice as the character's other lines.
- **L10** ("And its back legs are like springs!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (3.0 syllables/s), clear final consonants, same voice as the character's other lines.
- **L11** ("Look at it go!", spoken): Crumb, a tiny excited ant kid: high, quick, giggly child voice, American English, about 270 Hz. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (4.0 syllables/s), clear final consonants, same voice as the character's other lines.
- **L12** ("A bug band!", spoken): Crumb, a tiny excited ant kid: high, quick, giggly child voice, American English, about 270 Hz. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (3.5 syllables/s), clear final consonants, same voice as the character's other lines.
- **L13** ("Tummy ears, and legs that sing!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (3.0 syllables/s), clear final consonants, same voice as the character's other lines.
- **L14** ("Six legs? In you go!", spoken): Albie, a polite talking notebook: deep, slow, gentle adult male voice, Standard Southern British English, about 98 Hz. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (2.2 syllables/s), clear final consonants, same voice as the character's other lines.
- **L15** ("Play it again! Louder!", spoken): Crumb, a tiny excited ant kid: high, quick, giggly child voice, American English, about 270 Hz. Style: Funny voice, comedic timing. Natural, expressive speech at a child-friendly pace (5.1 syllables/s), clear final consonants, same voice as the character's other lines.
- **L16** ("Oops! Too loud!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Funny voice, comedic timing. Natural, expressive speech at a child-friendly pace (2.6 syllables/s), clear final consonants, same voice as the character's other lines.
- **L17** ("Tummy ears, and legs that sing!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (3.0 syllables/s), clear final consonants, same voice as the character's other lines.
- **L18** ("Where are YOUR ears?", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Cheerful, inviting question. Natural, expressive speech at a child-friendly pace (3.2 syllables/s), clear final consonants, same voice as the character's other lines.

## E. Music Generation Prompt

Mỗi cảnh nhạc một prompt (theo `out/music.json`). Chỉ để tham khảo: nhạc trong phim tổng hợp bằng code. Không lấn giọng: dưới lời giữ dải 300–4000 Hz thưa.

- **0.0–3.0 s · móc · còi lá cỏ**: Playful Kids Pop, 120 BPM, Db major, instrumental only. Lead banjo; band: banjo, ukulele, plucked bass; percussion: bongos. Mood: bất ngờ, tò mò. Leave space for a child's voice; end with a clear change into the next scene.
- **3.8–6.8 s · bí mật 1 · tai Chirp ở đầu gối**: Cartoon Musical (magical), 108 BPM, Db major, instrumental only. Lead toy piano; band: toy piano, celesta, upright bass; percussion: triangle and soft shaker. Mood: tò mò, kỳ diệu. Leave space for a child's voice; end with a clear change into the next scene.
- **7.3–10.6 s · "Nope!" · tai ở bụng**: Nursery Rhyme, 108 BPM, Db major, instrumental only. Lead vibraphone; band: vibraphone, harp, plucked bass; percussion: triangle and soft shaker. Mood: bất ngờ, thích thú. Leave space for a child's voice; end with a clear change into the next scene.
- **10.6–15.2 s · Crumb hỏi · châu chấu xa hát**: Cartoon Musical (comedy), 116 BPM, Db major, instrumental only. Lead clarinet; band: clarinet, ukulele, low pizzicato; percussion: cartoon woodblocks. Mood: buồn cười, ngộ ra. Leave space for a child's voice; end with a clear change into the next scene.
- **15.2–21.9 s · bí mật 2 · hát bằng chân**: Bouncy Melody, 120 BPM, Db major, instrumental only. Lead spiccato strings; band: spiccato strings, accordion, plucked bass; percussion: guira. Mood: vui, ngạc nhiên. Leave space for a child's voice; end with a clear change into the next scene.
- **21.9–24.5 s · bí mật 3 · lò xo nén**: Cartoon Musical (comedy), 112 BPM, Db major, instrumental only. Lead trombone; band: trombone, pizzicato strings, tuba; percussion: cartoon woodblocks. Mood: tinh nghịch, chờ cú bật. Leave space for a child's voice; end with a clear change into the next scene.
- **24.5–25.8 s · BOING! ra khỏi kính**: Cartoon Musical (big finish), 132 BPM, Db major, instrumental only. Lead trumpet; band: trumpet, ukulele, plucked bass; percussion: timpani and snare. Mood: phấn khích, choáng ngợp. Leave space for a child's voice; build energy to a big ending.
- **25.8–30.4 s · song tấu · điệp khúc 1**: Catchy Sing-along, 120 BPM, Db major, instrumental only. Lead xylophone; band: xylophone, accordion, celesta, plucked bass; percussion: guira. Mood: vui sướng, tự hào. Leave space for a child's voice; build energy to a big ending.
- **31.2–34.4 s · sổ · cumbia**: Cartoon Musical (big finish), 116 BPM, Db major, instrumental only. Lead toy horn; band: toy horn, marimba, plucked bass; percussion: guira. Mood: tự hào, vui. Leave space for a child's voice; end with a clear change into the next scene.
- **34.4–36.4 s · gag · "Play it again! Louder!"**: Playful Kids Pop, 124 BPM, Gb major, instrumental only. Lead kazoo; band: kazoo, ukulele, plucked bass; percussion: hand claps and tambourine. Mood: háo hức, tinh nghịch. Leave space for a child's voice; end with a clear change into the next scene.
- **36.4–38.1 s · gag · to quá!**: Bouncy Melody, 126 BPM, Db major, instrumental only. Lead steel drum; band: steel drum, accordion, plucked bass; percussion: claps and tambourine. Mood: náo nhiệt, quá đà. Leave space for a child's voice; end with a clear change into the next scene.
- **39.2–41.0 s · "Oops! Too loud!"**: Catchy Sing-along, 112 BPM, Gb major, instrumental only. Lead celesta; band: celesta, ukulele, plucked bass; percussion: brushes. Mood: vui, nhẹ nhõm. Leave space for a child's voice; end with a clear change into the next scene.
- **41.0–44.0 s · điệp khúc 2**: Catchy Sing-along, 120 BPM, Db major, instrumental only. Lead xylophone; band: xylophone, accordion, celesta, plucked bass; percussion: guira. Mood: vui, đọc theo. Leave space for a child's voice; end with a clear change into the next scene.
- **44.0–45.4 s · câu hỏi kết · nhặt lá cỏ**: Catchy Sing-along, 120 BPM, Db major, instrumental only. Lead piano; band: piano, ukulele, tuba; percussion: hand claps and shaker. Mood: tinh nghịch, mời gọi. Leave space for a child's voice; end with a clear change into the next scene.
- **45.4–46.0 s · nối vòng lặp**: Playful Kids Pop, 120 BPM, Db major, instrumental only. Lead banjo; band: banjo, ukulele, plucked bass; percussion: bongos. Mood: tinh nghịch. Leave space for a child's voice; end with a clear change into the next scene.

## F. Audio Mixing Guide (số đo trên bản trộn cuối)

- **Vocal volume:** giọng -19.1 dBFS RMS khi có lời (bản cuối −14 LUFS).
- **Background music volume:** nhạc -28.3 dBFS dưới lời, -20.4 dBFS ở khoảng trống (toàn dải; nhạc lùi 7.9 dB dưới lời, dải giọng xem qa.py "Nhạc lùi dưới giọng"). Lời hơn nhạc + tiếng động từng câu (300–4000 Hz): L01 10.9 dB, L02 21.7 dB, L03 23.6 dB, L04 14.6 dB, L05 16.1 dB, L06 24.2 dB, L07 20.9 dB, L08 21.4 dB, L09 17.2 dB, L10 22.9 dB, L11 17.1 dB, L12 25.4 dB, L13 12.1 dB, L14 13.2 dB, L15 24.9 dB, L16 27.8 dB, L17 16.0 dB, L18 16.9 dB.
- **SFX:** tiếng động dưới lời -38.8 dBFS RMS (thấp hơn giọng 20 dB); cue rơi vào giữa câu (gộp theo loại): L01: startle, chirp, boing, glassring, land, swish, turn, giggle, huh, slots, L03: shine, chirp, L04: nope, tap ×3, textpop, L05: swish, curtain, reveal, textpop, chirp ×2, eardrum, step ×5, L06: pat, L07: farsong, eardrum ×3, L08: swish, rasp ×5, L09: rasp ×4, shine, L10: creak, L11: zoomback, L13: chorus, shape ×2, swish, L14: count ×3, boing, gulp, pops, L17: chorus, L18: pluck, recall.
- **Fade in / out:** 20 ms vào ở đầu phim (mix.py); mỗi âm tiết hát nối bằng fade 5 / 8 ms (sing.py); phim lặp liền nên không fade cuối.
- **Audio transition:** 3.0 s tay, 3.8 s tay, 6.8 s tay, 7.3 s tay, 10.6 s bump, 15.2 s fill, 21.9 s tail, 24.5 s riser, 25.8 s bump, 30.4 s tay, 31.2 s tay, 34.4 s fill, 36.4 s swell, 38.1 s tay, 39.2 s tay, 41.0 s pickup, 44.0 s run, 45.4 s tay ("tay" = viết tay; bảng đầy đủ trong SOUND-PLAN.md).

## G. Final Quality Checklist

| Tiêu chí (Task.md §10) | Đo được | Cách đo | Chi tiết |
|---|---|---|---|
| Phát âm rõ ràng | ĐẠT | Whisper small.en + base.en nghe từng từ; từ có xác suất < 0,5 ở cả hai mô hình | — |
| Không sai từ | ĐẠT | cả hai mô hình nghe ra đúng mọi từ và mọi từ khoá | — |
| Không nuốt âm | ĐẠT | năng lượng xát / bật ở cuối từ (bugs, legs, wings…) so với bản nói gốc | — |
| Không lặp từ ngoài ý muốn | ĐẠT | không mô hình nào nghe ra từ thừa | — |
| Giai điệu tự nhiên | ĐẠT | cao độ từng nốt so với bản nhạc (dung sai theo kiểu hát), độ kéo nguyên âm · phần "tự nhiên" chỉ nghe được | — |
| Không bị méo giọng | ĐẠT | quá tải, click ở chỗ nối, HNR so với bản nói, cao độ phẳng, vibrato | — |
| Tốc độ giọng vừa tai trẻ | CẦN NGHE | câu nói ≤ 4.0 âm tiết/s trên đoạn có tiếng; câu hát ≤ 3.2 âm tiết/s theo bản nhạc (trừ điệp khúc) · chậm, liền hơi: chỉ nghe được | L03: nói nhanh: 4.7 âm tiết/s trên đoạn có tiếng (> 4.0); L06: nói nhanh: 5.3 âm tiết/s trên đoạn có tiếng (> 4.0); L11: nói nhanh: 4.3 âm tiết/s trên đoạn có tiếng (> 4.0); L15: nói nhanh: 5.5 âm tiết/s trên đoạn có tiếng (> 4.0) |
| Nhịp hát phù hợp hình ảnh | ĐẠT | âm tiết / giây, nốt ngắn nhất, ngắt ở dấu câu, từ dính nhau · khớp hành động chỉ xem được | — |
| Giọng có cảm xúc, có nhấn nhá | CẦN NGHE | câu nói: dải cao độ ≥ 4 nửa cung, từ nhấn cao hơn cả câu ≥ 0,5 nửa cung (emote.py uốn theo emo của câu) · cảm xúc có hợp tình huống: chỉ nghe được | L03: từ nhấn chưa nổi: đỉnh cao độ -0.2 nửa cung so với cả câu; L11: từ nhấn chưa nổi: đỉnh cao độ -1.0 nửa cung so với cả câu |
| Giữ nhất quán giọng nhân vật | ĐẠT | cao độ trung vị và âm lượng từng câu so với các câu khác của cùng nhân vật | — |
| Không bị nhạc nền che lấp | CẦN NGHE | lời hơn nhạc + tiếng động ≥ 10 dB ở dải 300–4000 Hz (stem cuối) | L01: lời hơn nhạc + tiếng động 10.9 dB (sát ngưỡng 10) |
| Phụ đề khớp 100% với lời thoại | ĐẠT | chữ trên phụ đề = lời; chữ hiện đúng lúc hát (± 0,3 s); khẩu hình đủ khung | — |

**Chỉ nghe / xem được (điền tay khi duyệt):**

- [ ] Giai điệu tự nhiên, hợp cảm xúc từng cảnh (không chỉ "nghe vui")
- [ ] Giọng không robot, không chuột chip; vibrato vừa phải; không thấy dấu autotune
- [ ] Giọng hát nghe như chính nhân vật, giữ cùng âm sắc giữa các đoạn
- [ ] Lời hát khớp hành động và khẩu hình
- [ ] Nếu một tiêu chí không đạt: chỉ tạo lại đúng câu đó (`sing.py --only <id>`)

