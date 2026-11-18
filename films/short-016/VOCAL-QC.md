# SHORT-016 · Vocal & Musical QC

> Sinh tự động bởi `_shared/tools/vocal_qc.py` ([`QUALITY.md`](../../_shared/QUALITY.md) §9, Task.md 18/11/2026). Không sửa tay: sửa `timeline.js` / `mix.py` rồi chạy lại.
> Nghe lại bằng Whisper small.en và base.en trên từng file giọng cuối (`voice/<id>.wav`); số đo âm thanh trên stem cuối (`out/stem_*.wav`).
> **LỖI** = đã xác nhận bằng số đo; **CẦN NGHE** = mới là dấu hiệu, phải nghe đoạn đó trước khi kết luận. Những gì chỉ nghe được nằm ở mục G.

**Kết quả:** 16 câu · **0 lỗi đã xác nhận** · 3 chỗ cần nghe.

## A. Bảng phân tích lỗi

| Timestamp | Lời thoại | Loại lỗi | Mức độ | Cách sửa |
|---|---|---|---|---|
| 0.38–2.52 (L01) | Where do bugs go when it snows? | Synchronization: lời hơn nhạc + tiếng động 11.2 dB (sát ngưỡng 10) | CẦN NGHE | nghe xem có bị che không |
| 9.04–11.84 (L04) | Wow! Some bees shake their wing muscles! | Synchronization: lời hơn nhạc + tiếng động 11.5 dB (sát ngưỡng 10) | CẦN NGHE | nghe xem có bị che không |
| 20.88–23.09 (L08) | Huddle, fly away, or hide! | Synchronization: lời hơn nhạc + tiếng động 11.9 dB (sát ngưỡng 10) | CẦN NGHE | nghe xem có bị che không |

## B. Bảng lời thoại sau khi cải thiện

| Timestamp | Original Lyrics | Improved Lyrics | Vocal Style |
|---|---|---|---|
| 0.38–2.52 (L01, loupe) | Where do bugs go when it snows? | (giữ nguyên) | Energetic, playful speech · speak |
| 3.95–4.95 (L02, loupe) | Let's zoom in! | (giữ nguyên) | Natural, clear speech · speak |
| 5.82–8.02 (L03, loupe) | Look! A warm ball of bees! | (giữ nguyên) | Natural, clear speech · speak |
| 9.04–11.84 (L04, loupe) | Heater bees shake their wing muscles! | Wow! Some bees shake their wing muscles! — hát lên Whisper nghe "Heater" thành "Hear their" / "Keter" / "you derbies"; "Some bees" đúng nguồn, thuật ngữ HEATER BEES! thành chữ trên hình | Natural, clear speech · speak |
| 12.20–14.40 (L05, albie) | Do all butterflies stay in the snow? | Do all butterflies stay? — rút cho vừa nhịp trước "Nope!" (giọng Albie chậm: 2,04 s); 18/11/2026 đọc chậm thêm 10 %, uốn ngữ điệu nhẹ hơn (emo_k .3): ở .5 base.en nghe "Do all" thành "Dual" | Natural, clear speech · speak |
| 14.66–15.29 (L06, loupe) | Nope! | (giữ nguyên) | Funny voice, comedic timing · speak |
| 15.85–19.08 (L07, loupe) | These monarchs fly all the way to Mexico! | (giữ nguyên) | Natural, clear speech · speak |
| 20.88–23.09 (L08, loupe) | Huddle, fly away, or hide! | (giữ nguyên) — TTS đọc "Huddle!" (dấu chấm than): "Huddle," bị nghe thành "Cuddle" | Natural, clear speech · speak |
| 24.40–26.41 (L09, loupe) | Who is hiding under here? | (giữ nguyên) — giọng SHORT-015 (.765) đọc câu 7 âm tiết ở 4,4 âm tiết/s (> 4,0 cho trẻ 4–8 tuổi): chậm hơn 10 % | Natural, clear speech · speak |
| 27.45–29.44 (L10, dot) | One, two, three... so many! | (giữ nguyên) — đếm chậm, mỗi số một nhịp, khớp hình Dot đếm (18/11/2026: trước đó 4,2 âm tiết/s, các số cách nhau 0,22 s) | Natural, clear speech · speak |
| 29.83–32.85 (L11, loupe) | Some ladybugs nap together under leaves! | (giữ nguyên) | Natural, clear speech · speak |
| 34.85–37.15 (L12, albie) | Six legs? In you go! | (giữ nguyên) | Natural, clear speech · speak |
| 38.40–39.91 (L13, dot) | Is it spring yet? | (giữ nguyên) | Funny voice, comedic timing · speak |
| 40.15–40.78 (L14, loupe) | Nope! | (giữ nguyên) | Funny voice, comedic timing · speak |
| 42.08–44.29 (L15, loupe) | Huddle, fly away, or hide! | (giữ nguyên) — như L08 | Natural, clear speech · speak |
| 45.35–47.26 (L16, loupe) | Can YOU huddle like a bee? | (giữ nguyên) — đọc chậm hơn 22 % (Vocal QC: 5,0 âm tiết/s là nhanh với trẻ 4–8 tuổi; 18/11/2026 chủ kênh: giọng còn nhanh), vẫn ≤ 2 s | Cheerful, inviting question · speak |

## C. Pronunciation Guide

Từ khó (nhiều âm tiết, tên loài, cụm phụ âm cuối dễ bị nuốt, từ Whisper nghe chưa chắc). IPA lấy từ bộ phiên âm của Kokoro (espeak-ng, en-us); `ˈ` đứng trước âm tiết có trọng âm.

| Từ | IPA | Âm tiết | Trọng âm | Lưu ý |
|---|---|---|---|---|
| bugs | /bˈʌɡz/ | 1 | âm tiết 1 | giữ rõ âm cuối /ɡz/ |
| let's | /lˈɛts/ | 1 | âm tiết 1 | giữ rõ âm cuối /ts/ |
| bees | /bˈiːz/ | 1 | âm tiết 1 | âm cuối /z/ hoặc /s/ phải nghe ra; tên loài: viết và đọc đúng, không đổi từ để dễ hát |
| muscles | /mˈʌsəlz/ | 2 | âm tiết 1 | giữ rõ âm cuối /lz/ |
| butterflies | /bˈʌɾɚflˌaɪz/ | 3 | âm tiết 1 | âm cuối /z/ hoặc /s/ phải nghe ra; tên loài: viết và đọc đúng, không đổi từ để dễ hát |
| monarchs | /mˈɑːnɚkz/ | 2 | âm tiết 1 | giữ rõ âm cuối /kz/; tên loài: viết và đọc đúng, không đổi từ để dễ hát |
| mexico | /mˈɛksɪkˌoʊ/ | 3 | âm tiết 1 | — |
| ladybugs | /lˈeɪdɪbˌʌɡz/ | 3 | âm tiết 1 | giữ rõ âm cuối /ɡz/; tên loài: viết và đọc đúng, không đổi từ để dễ hát |
| together | /təɡˈɛðɚ/ | 3 | âm tiết 2 | — |
| leaves | /lˈiːvz/ | 1 | âm tiết 1 | giữ rõ âm cuối /vz/ |
| six | /sˈɪks/ | 1 | âm tiết 1 | giữ rõ âm cuối /ks/ |
| legs | /lˈɛɡz/ | 1 | âm tiết 1 | giữ rõ âm cuối /ɡz/ |
| bee | /bˈiː/ | 1 | âm tiết 1 | tên loài: viết và đọc đúng, không đổi từ để dễ hát |

**Cách ngắt câu** (‖ = chỗ thở / ngắt; theo dấu câu và nghỉ trong bản nhạc):

- L01 (speak): Where do bugs go when it snows?
- L02 (speak): Let's zoom in!
- L03 (speak): Look! ‖ A warm ball of bees!
- L04 (speak): Wow! ‖ Some bees shake their wing muscles!
- L05 (speak): Do all butterflies stay?
- L06 (speak): Nope!
- L07 (speak): These monarchs fly all the way to Mexico!
- L08 (speak): Huddle, ‖ fly away, ‖ or hide!
- L09 (speak): Who is hiding under here?
- L10 (speak): One, ‖ two, ‖ three... ‖ so many!
- L11 (speak): Some ladybugs nap together under leaves!
- L12 (speak): Six legs? ‖ In you go!
- L13 (speak): Is it spring yet?
- L14 (speak): Nope!
- L15 (speak): Huddle, ‖ fly away, ‖ or hide!
- L16 (speak): Can YOU huddle like a bee?

## D. Vocal Generation Prompt

Mỗi câu một đoạn riêng (3–8 s), cùng hồ sơ giọng (`PROFILE` trong `_shared/voices.js`). Câu lỗi chỉ tạo lại đúng câu đó. Trong phim, mọi câu là giọng TTS của chính nhân vật, không hát (từ 19/11/2026, QUALITY.md §8.3); prompt dưới đây dùng khi tạo bằng công cụ AI khác hoặc khi thu giọng thật.

- **L01** ("Where do bugs go when it snows?", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Energetic, playful speech. Natural, expressive speech at a child-friendly pace (3.3 syllables/s), clear final consonants, same voice as the character's other lines.
- **L02** ("Let's zoom in!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (3.0 syllables/s), clear final consonants, same voice as the character's other lines.
- **L03** ("Look! A warm ball of bees!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (2.7 syllables/s), clear final consonants, same voice as the character's other lines.
- **L04** ("Wow! Some bees shake their wing muscles!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (2.9 syllables/s), clear final consonants, same voice as the character's other lines.
- **L05** ("Do all butterflies stay?", spoken): Albie, a polite talking notebook: deep, slow, gentle adult male voice, Standard Southern British English, about 98 Hz. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (2.7 syllables/s), clear final consonants, same voice as the character's other lines.
- **L06** ("Nope!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Funny voice, comedic timing. Natural, expressive speech at a child-friendly pace (1.6 syllables/s), clear final consonants, same voice as the character's other lines.
- **L07** ("These monarchs fly all the way to Mexico!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (3.4 syllables/s), clear final consonants, same voice as the character's other lines.
- **L08** ("Huddle, fly away, or hide!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (3.2 syllables/s), clear final consonants, same voice as the character's other lines.
- **L09** ("Who is hiding under here?", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (3.5 syllables/s), clear final consonants, same voice as the character's other lines.
- **L10** ("One, two, three... so many!", spoken): Dot, a little ladybug who counts everything like a small teacher: bright, clear child voice, British English, precise consonants, about 255 Hz. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (3.0 syllables/s), clear final consonants, same voice as the character's other lines.
- **L11** ("Some ladybugs nap together under leaves!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (3.6 syllables/s), clear final consonants, same voice as the character's other lines.
- **L12** ("Six legs? In you go!", spoken): Albie, a polite talking notebook: deep, slow, gentle adult male voice, Standard Southern British English, about 98 Hz. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (2.2 syllables/s), clear final consonants, same voice as the character's other lines.
- **L13** ("Is it spring yet?", spoken): Dot, a little ladybug who counts everything like a small teacher: bright, clear child voice, British English, precise consonants, about 255 Hz. Style: Funny voice, comedic timing. Natural, expressive speech at a child-friendly pace (2.7 syllables/s), clear final consonants, same voice as the character's other lines.
- **L14** ("Nope!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Funny voice, comedic timing. Natural, expressive speech at a child-friendly pace (1.6 syllables/s), clear final consonants, same voice as the character's other lines.
- **L15** ("Huddle, fly away, or hide!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (3.2 syllables/s), clear final consonants, same voice as the character's other lines.
- **L16** ("Can YOU huddle like a bee?", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 202 Hz (G3), natural speech intonation as in SHORT-015, never sung. Style: Cheerful, inviting question. Natural, expressive speech at a child-friendly pace (3.7 syllables/s), clear final consonants, same voice as the character's other lines.

## E. Music Generation Prompt

Mỗi cảnh nhạc một prompt (theo `out/music.json`). Chỉ để tham khảo: nhạc trong phim tổng hợp bằng code. Không lấn giọng: dưới lời giữ dải 300–4000 Hz thưa.

- **0.0–3.0 s · móc · tuyết rơi trúng kính**: Playful Kids Pop, 120 BPM, C major, instrumental only. Lead glockenspiel; band: glockenspiel, ukulele, celesta, plucked bass; percussion: sleigh bells and clip-clop woodblocks. Mood: bất ngờ, tò mò. Leave space for a child's voice; end with a clear change into the next scene.
- **3.8–7.0 s · kính · tổ ong lặng im → kính ấm**: Cartoon Musical (magical), 112 BPM, C major, instrumental only. Lead vibraphone; band: vibraphone, harp, upright bass; percussion: triangle and soft shaker. Mood: tò mò, kỳ diệu. Leave space for a child's voice; end with a clear change into the next scene.
- **7.0–12.4 s · quả bóng ấm · Waggle rung ngực**: Bouncy Melody, 112 BPM, C major, instrumental only. Lead marimba; band: marimba, high piano, buzzy bass; percussion: woodblock and shaker. Mood: thích thú. Leave space for a child's voice; end with a clear change into the next scene.
- **12.4–15.4 s · Albie hỏi · "Nope!"**: Cartoon Musical (comedy), 126 BPM, C major, instrumental only. Lead xylophone; band: xylophone, ukulele, plucked bass; percussion: cartoon woodblocks. Mood: buồn cười, bất ngờ. Leave space for a child's voice; end with a clear change into the next scene.
- **15.4–18.4 s · bản đồ · bướm vua bay về Mexico**: Cartoon Musical (magical), 126 BPM, C major, instrumental only. Lead flute; band: flute, spiccato strings, harp, low pizzicato; percussion: bongos. Mood: phiêu lưu, háo hức. Leave space for a child's voice; end with a clear change into the next scene.
- **18.4–21.0 s · rừng hoá cam · MILLIONS!**: Cartoon Musical (big finish), 126 BPM, C major, instrumental only. Lead spiccato strings; band: spiccato strings, piano, tuba; percussion: timpani and snare. Mood: choáng ngợp, vui. Leave space for a child's voice; build energy to a big ending.
- **21.0–24.0 s · điệp khúc 1**: Catchy Sing-along, 124 BPM, C major, instrumental only. Lead xylophone; band: xylophone, ukulele, glockenspiel, plucked bass; percussion: sleigh bells and clip-clop woodblocks. Mood: vui, hát theo. Leave space for a child's voice; end with a clear change into the next scene.
- **24.0–27.0 s · đống lá · "Who is hiding under here?"**: Nursery Rhyme, 116 BPM, C major, instrumental only. Lead harp; band: harp, piano, upright bass; percussion: rim clicks and brushes. Mood: tò mò, nhẹ nhàng. Leave space for a child's voice; end with a clear change into the next scene.
- **27.0–33.8 s · Dot đếm · bọ rùa ngủ dưới lá**: Nursery Rhyme, 116 BPM, C major, instrumental only. Lead pizzicato strings; band: pizzicato strings, vibraphone, upright bass; percussion: rim clicks and brushes. Mood: dễ thương, buồn cười. Leave space for a child's voice; end with a clear change into the next scene.
- **33.8–38.2 s · sổ · "Six legs? In you go!"**: Playful Kids Pop, 128 BPM, C major, instrumental only. Lead small bells; band: small bells, accordion, tuba; percussion: sleigh bells and clip-clop woodblocks. Mood: vui, tự hào. Leave space for a child's voice; end with a clear change into the next scene.
- **38.2–40.5 s · gag · "Is it spring yet?" · "Nope!"**: Cartoon Musical (comedy), 116 BPM, C major, instrumental only. Lead kazoo; band: kazoo, ukulele, tuba; percussion: hand claps and tambourine. Mood: buồn cười, đáng yêu. Leave space for a child's voice; end with a clear change into the next scene.
- **41.2–42.2 s · Albie cười khúc khích**: Catchy Sing-along, 116 BPM, C major, instrumental only. Lead clarinet; band: clarinet, marimba, plucked bass; percussion: hand claps and shaker. Mood: vui. Leave space for a child's voice; end with a clear change into the next scene.
- **42.2–45.3 s · điệp khúc 2**: Catchy Sing-along, 124 BPM, C major, instrumental only. Lead xylophone; band: xylophone, ukulele, glockenspiel, plucked bass; percussion: sleigh bells and clip-clop woodblocks. Mood: vui, hát theo. Leave space for a child's voice; end with a clear change into the next scene.
- **45.3–48.0 s · CTA · ôm nhau · vòng lặp**: Catchy Sing-along, 120 BPM, C major, instrumental only. Lead steel drum; band: steel drum, ukulele, plucked bass; percussion: hand claps and shaker. Mood: ấm áp, mời gọi. Leave space for a child's voice; end with a clear change into the next scene.

## F. Audio Mixing Guide (số đo trên bản trộn cuối)

- **Vocal volume:** giọng -20.5 dBFS RMS khi có lời (bản cuối −14 LUFS).
- **Background music volume:** nhạc -27.1 dBFS dưới lời, -21.5 dBFS ở khoảng trống (toàn dải; nhạc lùi 5.6 dB dưới lời, dải giọng xem qa.py "Nhạc lùi dưới giọng"). Lời hơn nhạc + tiếng động từng câu (300–4000 Hz): L01 11.2 dB, L02 19.7 dB, L03 20.5 dB, L04 11.5 dB, L05 19.3 dB, L06 15.9 dB, L07 13.0 dB, L08 11.9 dB, L09 17.3 dB, L10 29.9 dB, L11 21.7 dB, L12 16.0 dB, L13 22.6 dB, L14 20.0 dB, L15 12.0 dB, L16 18.4 dB.
- **SFX:** tiếng động dưới lời -38.2 dBFS RMS (thấp hơn giọng 18 dB); cue rơi vào giữa câu (gộp theo loại): L01: swish ×2, huh, L03: hum, L04: deep, beebuzz, textpop, buzzshake ×9, L05: slotstamp, lensdown, albiehop, L06: nope, L07: textpop ×3, gust, flutter ×7, sign, arrive, trees, L08: chorus, slotbounce ×2, qpop, snowstep ×6, L09: landsnow, L10: popup, count ×3, textpop, L11: yawn, L12: slotstamp, count ×3, gulp, L13: popup, stretch, L14: nope, whee, burrow, L15: chorus, snowstep ×6, badgepop ×3, L16: landsnow, hug, hopL, recall, snowfall.
- **Fade in / out:** 20 ms vào ở đầu phim (mix.py); mỗi âm tiết hát nối bằng fade 5 / 8 ms (sing.py); phim lặp liền nên không fade cuối.
- **Audio transition:** 3.0 s tay, 3.8 s tay, 7.0 s swell, 12.4 s fill, 15.4 s swell, 18.4 s riser, 21.0 s pickup, 24.0 s run, 27.0 s tail, 33.8 s fill, 38.2 s drop, 40.5 s tay, 41.2 s tay, 42.2 s pickup, 45.3 s run ("tay" = viết tay; bảng đầy đủ trong SOUND-PLAN.md).

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
| Không bị nhạc nền che lấp | CẦN NGHE | lời hơn nhạc + tiếng động ≥ 10 dB ở dải 300–4000 Hz (stem cuối) | L01: lời hơn nhạc + tiếng động 11.2 dB (sát ngưỡng 10); L04: lời hơn nhạc + tiếng động 11.5 dB (sát ngưỡng 10); L08: lời hơn nhạc + tiếng động 11.9 dB (sát ngưỡng 10) |
| Phụ đề khớp 100% với lời thoại | ĐẠT | chữ trên phụ đề = lời; chữ hiện đúng lúc hát (± 0,3 s); khẩu hình đủ khung | — |

**Chỉ nghe / xem được (điền tay khi duyệt):**

- [ ] Giai điệu tự nhiên, hợp cảm xúc từng cảnh (không chỉ "nghe vui")
- [ ] Giọng không robot, không chuột chip; vibrato vừa phải; không thấy dấu autotune
- [ ] Giọng hát nghe như chính nhân vật, giữ cùng âm sắc giữa các đoạn
- [ ] Lời hát khớp hành động và khẩu hình
- [ ] Nếu một tiêu chí không đạt: chỉ tạo lại đúng câu đó (`sing.py --only <id>`)

