# SHORT-016 · Vocal & Musical QC

> Sinh tự động bởi `_shared/tools/vocal_qc.py` ([`QUALITY.md`](../../_shared/QUALITY.md) §9, Task.md 18/11/2026). Không sửa tay: sửa `timeline.js` / `mix.py` rồi chạy lại.
> Nghe lại bằng Whisper small.en và base.en trên từng file giọng cuối (`voice/<id>.wav`); số đo âm thanh trên stem cuối (`out/stem_*.wav`).
> **LỖI** = đã xác nhận bằng số đo; **CẦN NGHE** = mới là dấu hiệu, phải nghe đoạn đó trước khi kết luận. Những gì chỉ nghe được nằm ở mục G.

**Kết quả:** 16 câu · **0 lỗi đã xác nhận** · 12 chỗ cần nghe.

## A. Bảng phân tích lỗi

| Timestamp | Lời thoại | Loại lỗi | Mức độ | Cách sửa |
|---|---|---|---|---|
| 15.85–20.12 (L07) | These monarchs fly all the way to Mexico! | Melody: nốt lướt / nốt ngắn lệch: F3 @18.35s +195 cent (100 ms có thanh) | CẦN NGHE | nghe xem có lạc giọng không; nếu có, nốt dài hơn hoặc đổi nốt |
| 15.85–20.12 (L07) | These monarchs fly all the way to Mexico! | Voice: cao độ dao động / trôi tới 261 cent trên nốt dài | CẦN NGHE | nghe nốt dài: vibrato quá mức hoặc cao độ trôi |
| 20.88–24.00 (L08) | Huddle, fly away, or hide! | Pronunciation: một mô hình: thừa "head" | CẦN NGHE | nghe lại từ này; nếu sai thì tạo lại riêng câu này |
| 20.88–24.00 (L08) | Huddle, fly away, or hide! | Pronunciation: một mô hình: "huddle" → base: "off" | CẦN NGHE | nghe lại từ này; nếu sai thì tạo lại riêng câu này |
| 20.88–24.00 (L08) | Huddle, fly away, or hide! | Pronunciation: một mô hình: "fly" → base: "lie" | CẦN NGHE | nghe lại từ này; nếu sai thì tạo lại riêng câu này |
| 20.88–24.00 (L08) | Huddle, fly away, or hide! | Pronunciation: xác suất thấp ở cả hai mô hình (< 0,5): "huddle" | CẦN NGHE | nghe kỹ các từ này |
| 24.40–27.20 (L09) | Who is hiding under here? | Rhythm: đứt giữa từ (im tuyệt đối): "hiding" (192 ms) | CẦN NGHE | ngân âm tiết cuối của từ, âm tiết có nguyên âm dài; âm tiết đầu / giữa từ để ½ phách |
| 29.83–33.93 (L11) | Some ladybugs nap together under leaves! | Rhythm: đứt giữa từ (im tuyệt đối): "under" (217 ms) | CẦN NGHE | ngân âm tiết cuối của từ, âm tiết có nguyên âm dài; âm tiết đầu / giữa từ để ½ phách |
| 29.83–33.93 (L11) | Some ladybugs nap together under leaves! | Melody: nốt lướt / nốt ngắn lệch: E3 @33.31s +203 cent (130 ms có thanh) | CẦN NGHE | nghe xem có lạc giọng không; nếu có, nốt dài hơn hoặc đổi nốt |
| 42.08–45.20 (L15) | Huddle, fly away, or hide! | Pronunciation: một mô hình: thừa "huh" | CẦN NGHE | nghe lại từ này; nếu sai thì tạo lại riêng câu này |
| 42.08–45.20 (L15) | Huddle, fly away, or hide! | Pronunciation: một mô hình: "huddle" → base: "dont" | CẦN NGHE | nghe lại từ này; nếu sai thì tạo lại riêng câu này |
| 42.08–45.20 (L15) | Huddle, fly away, or hide! | Pronunciation: xác suất thấp ở cả hai mô hình (< 0,5): "huddle" | CẦN NGHE | nghe kỹ các từ này |

## B. Bảng lời thoại sau khi cải thiện

| Timestamp | Original Lyrics | Improved Lyrics | Vocal Style |
|---|---|---|---|
| 0.38–3.10 (L01, loupe) | Where do bugs go when it snows? | (giữ nguyên) — bản nói không ngắt thì "it" chỉ 80 ms, sing.py bỏ mất âm tiết (bản hát còn "when … snows"); dấu phẩy cho TTS giữ đủ 7 chữ (18/11/2026) | Energetic, playful singing · half-sing |
| 3.95–5.24 (L02, loupe) | Let's zoom in! | (giữ nguyên) | Curious, melodic singing · half-sing |
| 5.82–8.86 (L03, loupe) | Look! A warm ball of bees! | (giữ nguyên) | Curious, melodic singing · half-sing |
| 9.04–11.94 (L04, loupe) | Heater bees shake their wing muscles! | Wow! Some bees shake their wing muscles! — hát lên Whisper nghe "Heater" thành "Hear their" / "Keter" / "you derbies"; "Some bees" đúng nguồn, thuật ngữ HEATER BEES! thành chữ trên hình | Clear rhythmic sing-talk · sing-talk |
| 12.20–14.40 (L05, albie) | Do all butterflies stay in the snow? | Do all butterflies stay? — rút cho vừa nhịp trước "Nope!" (giọng Albie chậm: 2,04 s); 18/11/2026 đọc chậm thêm 10 %, uốn ngữ điệu nhẹ hơn (emo_k .3): ở .5 base.en nghe "Do all" thành "Dual" | Natural, clear speech · speak |
| 14.66–15.59 (L06, loupe) | Nope! | (giữ nguyên) | Expressive, short musical reaction · sing-talk |
| 15.85–20.12 (L07, loupe) | These monarchs fly all the way to Mexico! | (giữ nguyên) | Curious, melodic singing · half-sing |
| 20.88–24.00 (L08, loupe) | Huddle, fly away, or hide! | (giữ nguyên) — TTS đọc "Huddle!" (dấu chấm than): "Huddle," bị nghe thành "Cuddle" | Catchy, cheerful singing · sing |
| 24.40–27.20 (L09, loupe) | Who is hiding under here? | (giữ nguyên) | Curious, melodic singing · half-sing |
| 27.45–29.44 (L10, dot) | One, two, three... so many! | (giữ nguyên) — đếm chậm, mỗi số một nhịp, khớp hình Dot đếm (18/11/2026: trước đó 4,2 âm tiết/s, các số cách nhau 0,22 s) | Natural, clear speech · speak |
| 29.83–33.93 (L11, loupe) | Some ladybugs nap together under leaves! | (giữ nguyên) | Clear rhythmic sing-talk · sing-talk |
| 34.85–37.15 (L12, albie) | Six legs? In you go! | (giữ nguyên) | Natural, clear speech · speak |
| 38.40–39.91 (L13, dot) | Is it spring yet? | (giữ nguyên) | Funny voice, comedic timing · speak |
| 40.15–40.78 (L14, loupe) | Nope! | (giữ nguyên) | Funny voice, comedic timing · speak |
| 42.08–45.20 (L15, loupe) | Huddle, fly away, or hide! | (giữ nguyên) — như L08 | Catchy, cheerful singing · sing |
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
| fly | /flˈaɪ/ | 1 | âm tiết 1 | Whisper từng nghe chưa chắc |
| mexico | /mˈɛksɪkˌoʊ/ | 3 | âm tiết 1 | — |
| huddle | /hˈʌdəl/ | 2 | âm tiết 1 | Whisper từng nghe chưa chắc |
| hiding | /hˈaɪdɪŋ/ | 2 | âm tiết 1 | Whisper từng nghe chưa chắc |
| under | /ˈʌndɚ/ | 2 | âm tiết 1 | Whisper từng nghe chưa chắc |
| ladybugs | /lˈeɪdɪbˌʌɡz/ | 3 | âm tiết 1 | giữ rõ âm cuối /ɡz/; tên loài: viết và đọc đúng, không đổi từ để dễ hát |
| together | /təɡˈɛðɚ/ | 3 | âm tiết 2 | — |
| leaves | /lˈiːvz/ | 1 | âm tiết 1 | giữ rõ âm cuối /vz/ |
| six | /sˈɪks/ | 1 | âm tiết 1 | giữ rõ âm cuối /ks/ |
| legs | /lˈɛɡz/ | 1 | âm tiết 1 | giữ rõ âm cuối /ɡz/ |
| bee | /bˈiː/ | 1 | âm tiết 1 | tên loài: viết và đọc đúng, không đổi từ để dễ hát |

**Cách ngắt câu** (‖ = chỗ thở / ngắt; theo dấu câu và nghỉ trong bản nhạc):

- L01 (half-sing): Where do bugs go when it snows?
- L02 (half-sing): Let's zoom in!
- L03 (half-sing): Look! ‖ A warm ball of bees!
- L04 (sing-talk): Wow! ‖ Some bees shake their wing muscles!
- L05 (speak): Do all butterflies stay?
- L06 (sing-talk): Nope!
- L07 (half-sing): These monarchs fly all the way to Mexico!
- L08 (sing): Huddle, ‖ fly away, ‖ or hide!
- L09 (half-sing): Who is hiding under here?
- L10 (speak): One, ‖ two, ‖ three... ‖ so many!
- L11 (sing-talk): Some ladybugs nap together under leaves!
- L12 (speak): Six legs? ‖ In you go!
- L13 (speak): Is it spring yet?
- L14 (speak): Nope!
- L15 (sing): Huddle, ‖ fly away, ‖ or hide!
- L16 (speak): Can YOU huddle like a bee?

## D. Vocal Generation Prompt

Mỗi câu một đoạn riêng (3–8 s), cùng hồ sơ giọng (`PROFILE` trong `_shared/voices.js`). Câu lỗi chỉ tạo lại đúng câu đó. Trong phim, giọng hát là giọng TTS của chính nhân vật được `_shared/sing.py` uốn theo bản nhạc; prompt dưới đây dùng khi tạo bằng công cụ AI khác hoặc khi thu giọng thật.

- **L01** ("Where do bugs go when it snows?"): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 210 Hz (G#3). Style: Energetic, playful singing; half-sung: melodic but close to speech, bright and bouncy. Tempo 120 BPM, key of C major. Melody, note(beats) per syllable: Where E3(0.5) · do F3(0.5) · bugs G3(0.5) · go A3(1) · when G3(0.5) · it F3(0.5) · snows G3(1.5). Pronounce every final consonant clearly; no extra syllables, no repeated words, no robotic or auto-tuned sound; words must be clearer than vocal tricks; keep the same voice as the character's other lines.
- **L02** ("Let's zoom in!"): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 210 Hz (G#3). Style: Curious, melodic singing; half-sung: melodic but close to speech, bright and bouncy. Tempo 112 BPM, key of C major. Melody, note(beats) per syllable: Lets F3(0.5) · zoom G3(0.5) · in A3(1). Pronounce every final consonant clearly; no extra syllables, no repeated words, no robotic or auto-tuned sound; words must be clearer than vocal tricks; keep the same voice as the character's other lines.
- **L03** ("Look! A warm ball of bees!"): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 210 Hz (G#3). Style: Curious, melodic singing; half-sung: melodic but close to speech, bright and bouncy. Tempo 112 BPM, key of C major. Melody, note(beats) per syllable: Look C4(1) · A G3(0.5) · warm A3(1) · ball G3(0.5) · of F3(0.5) · bees E3(1.2). Pronounce every final consonant clearly; no extra syllables, no repeated words, no robotic or auto-tuned sound; words must be clearer than vocal tricks; keep the same voice as the character's other lines.
- **L04** ("Wow! Some bees shake their wing muscles!"): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 210 Hz (G#3). Style: Clear rhythmic sing-talk; rhythmic sing-talk: spoken words riding the beat, light pitch movement. Tempo 112 BPM, key of C major. Melody, note(beats) per syllable: Wow G3(0.5) · Some G3(0.5) · bees E3(0.5) · shake G3(0.5) · their G3(0.5) · wing A3(0.5) · muscles G3(0.5)-D3(1). Pronounce every final consonant clearly; no extra syllables, no repeated words, no robotic or auto-tuned sound; words must be clearer than vocal tricks; keep the same voice as the character's other lines.
- **L05** ("Do all butterflies stay?", spoken): Albie, a polite talking notebook: deep, slow, gentle adult male voice, Standard Southern British English, about 98 Hz. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (2.7 syllables/s), clear final consonants, same voice as the character's other lines.
- **L06** ("Nope!"): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 210 Hz (G#3). Style: Expressive, short musical reaction; rhythmic sing-talk: spoken words riding the beat, light pitch movement. Tempo 126 BPM, key of C major. Melody, note(beats) per syllable: Nope G3(0.5)-C3(1). Pronounce every final consonant clearly; no extra syllables, no repeated words, no robotic or auto-tuned sound; words must be clearer than vocal tricks; keep the same voice as the character's other lines.
- **L07** ("These monarchs fly all the way to Mexico!"): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 210 Hz (G#3). Style: Curious, melodic singing; half-sung: melodic but close to speech, bright and bouncy. Tempo 126 BPM, key of C major. Melody, note(beats) per syllable: These G3(0.5) · monarchs C4(0.5)-C4(0.5) · fly A3(1) · all G3(1) · the F3(0.5) · way G3(1) · to F3(0.5) · Mexico G3(1)-E3(0.5)-E3(1.5). Pronounce every final consonant clearly; no extra syllables, no repeated words, no robotic or auto-tuned sound; words must be clearer than vocal tricks; keep the same voice as the character's other lines.
- **L08** ("Huddle, fly away, or hide!"): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 210 Hz (G#3). Style: Catchy, cheerful singing; fully sung, one clear vowel per note, legato, a light natural vibrato only on the last held note. Tempo 124 BPM, key of C major. Melody, note(beats) per syllable: Huddle G3(0.75)-G3(0.25) · fly G3(0.5) · away A3(0.5)-B3(1) · or A3(1) · hide G3(2). Pronounce every final consonant clearly; no extra syllables, no repeated words, no robotic or auto-tuned sound; words must be clearer than vocal tricks; keep the same voice as the character's other lines.
- **L09** ("Who is hiding under here?"): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 210 Hz (G#3). Style: Curious, melodic singing; half-sung: melodic but close to speech, bright and bouncy. Tempo 116 BPM, key of C major. Melody, note(beats) per syllable: Who E3(0.5) · is F3(0.5) · hiding G3(0.5)-A3(1) · under G3(0.5)-F3(0.5) · here G3(1.5). Pronounce every final consonant clearly; no extra syllables, no repeated words, no robotic or auto-tuned sound; words must be clearer than vocal tricks; keep the same voice as the character's other lines.
- **L10** ("One, two, three... so many!", spoken): Dot, a little ladybug who counts everything like a small teacher: bright, clear child voice, British English, precise consonants, about 255 Hz. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (3.0 syllables/s), clear final consonants, same voice as the character's other lines.
- **L11** ("Some ladybugs nap together under leaves!"): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 210 Hz (G#3). Style: Clear rhythmic sing-talk; rhythmic sing-talk: spoken words riding the beat, light pitch movement. Tempo 116 BPM, key of C major. Melody, note(beats) per syllable: Some G3(0.5) · ladybugs E3(0.5)-G3(0.5)-G3(1) · nap C4(1) · together A3(0.5)-A3(0.5)-G3(1) · under G3(0.5)-F3(0.5) · leaves E3(1). Pronounce every final consonant clearly; no extra syllables, no repeated words, no robotic or auto-tuned sound; words must be clearer than vocal tricks; keep the same voice as the character's other lines.
- **L12** ("Six legs? In you go!", spoken): Albie, a polite talking notebook: deep, slow, gentle adult male voice, Standard Southern British English, about 98 Hz. Style: Natural, clear speech. Natural, expressive speech at a child-friendly pace (2.2 syllables/s), clear final consonants, same voice as the character's other lines.
- **L13** ("Is it spring yet?", spoken): Dot, a little ladybug who counts everything like a small teacher: bright, clear child voice, British English, precise consonants, about 255 Hz. Style: Funny voice, comedic timing. Natural, expressive speech at a child-friendly pace (2.7 syllables/s), clear final consonants, same voice as the character's other lines.
- **L14** ("Nope!", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 210 Hz (G#3). Style: Funny voice, comedic timing. Natural, expressive speech at a child-friendly pace (1.6 syllables/s), clear final consonants, same voice as the character's other lines.
- **L15** ("Huddle, fly away, or hide!"): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 210 Hz (G#3). Style: Catchy, cheerful singing; fully sung, one clear vowel per note, legato, a light natural vibrato only on the last held note. Tempo 124 BPM, key of C major. Melody, note(beats) per syllable: Huddle G3(0.75)-G3(0.25) · fly G3(0.5) · away A3(0.5)-B3(1) · or A3(1) · hide G3(2). Pronounce every final consonant clearly; no extra syllables, no repeated words, no robotic or auto-tuned sound; words must be clearer than vocal tricks; keep the same voice as the character's other lines.
- **L16** ("Can YOU huddle like a bee?", spoken): Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 210 Hz (G#3). Style: Cheerful, inviting question. Natural, expressive speech at a child-friendly pace (3.7 syllables/s), clear final consonants, same voice as the character's other lines.

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
- **27.0–33.9 s · Dot đếm · bọ rùa ngủ dưới lá**: Nursery Rhyme, 116 BPM, C major, instrumental only. Lead pizzicato strings; band: pizzicato strings, vibraphone, upright bass; percussion: rim clicks and brushes. Mood: dễ thương, buồn cười. Leave space for a child's voice; end with a clear change into the next scene.
- **33.9–38.2 s · sổ · "Six legs? In you go!"**: Playful Kids Pop, 128 BPM, C major, instrumental only. Lead small bells; band: small bells, accordion, tuba; percussion: sleigh bells and clip-clop woodblocks. Mood: vui, tự hào. Leave space for a child's voice; end with a clear change into the next scene.
- **38.2–40.5 s · gag · "Is it spring yet?" · "Nope!"**: Cartoon Musical (comedy), 116 BPM, C major, instrumental only. Lead kazoo; band: kazoo, ukulele, tuba; percussion: hand claps and tambourine. Mood: buồn cười, đáng yêu. Leave space for a child's voice; end with a clear change into the next scene.
- **41.2–42.2 s · Albie cười khúc khích**: Catchy Sing-along, 116 BPM, C major, instrumental only. Lead clarinet; band: clarinet, marimba, plucked bass; percussion: hand claps and shaker. Mood: vui. Leave space for a child's voice; end with a clear change into the next scene.
- **42.2–45.3 s · điệp khúc 2**: Catchy Sing-along, 124 BPM, C major, instrumental only. Lead xylophone; band: xylophone, ukulele, glockenspiel, plucked bass; percussion: sleigh bells and clip-clop woodblocks. Mood: vui, hát theo. Leave space for a child's voice; end with a clear change into the next scene.
- **45.3–48.0 s · CTA · ôm nhau · vòng lặp**: Catchy Sing-along, 120 BPM, C major, instrumental only. Lead steel drum; band: steel drum, ukulele, plucked bass; percussion: hand claps and shaker. Mood: ấm áp, mời gọi. Leave space for a child's voice; end with a clear change into the next scene.

## F. Audio Mixing Guide (số đo trên bản trộn cuối)

- **Vocal volume:** giọng -20.6 dBFS RMS khi có lời (bản cuối −14 LUFS).
- **Background music volume:** nhạc -25.8 dBFS dưới lời, -21.6 dBFS ở khoảng trống (toàn dải; nhạc lùi 4.2 dB dưới lời, dải giọng xem qa.py "Nhạc lùi dưới giọng"). Lời hơn nhạc + tiếng động từng câu (300–4000 Hz): L01 12.3 dB, L02 27.6 dB, L03 20.8 dB, L04 14.5 dB, L05 19.2 dB, L06 17.4 dB, L07 12.5 dB, L08 12.9 dB, L09 22.8 dB, L10 30.1 dB, L11 22.4 dB, L12 18.4 dB, L13 22.7 dB, L14 20.4 dB, L15 12.5 dB, L16 18.8 dB.
- **SFX:** tiếng động dưới lời -39.8 dBFS RMS (thấp hơn giọng 19 dB); cue rơi vào giữa câu (gộp theo loại): L01: swish ×2, huh, slots, zoom, L02: twist, L03: hum, L04: deep, beebuzz, textpop, buzzshake ×9, L05: slotstamp, lensdown, albiehop, L06: nope, pageopen, L07: textpop ×3, gust ×2, flutter ×7, sign, arrive, trees, snap, swipe, L08: chorus, slotbounce ×2, qpop, snowstep ×8, L09: landsnow, lensup, leaflift, L10: popup, count ×3, textpop, L11: yawn, burrow, snap, zoomin, L12: slotstamp, count ×3, gulp, L13: popup, stretch, L14: nope, whee, burrow, L15: chorus, snowstep ×8, badgepop ×3, L16: landsnow, hug, hopL, recall, snowfall.
- **Fade in / out:** 20 ms vào ở đầu phim (mix.py); mỗi âm tiết hát nối bằng fade 5 / 8 ms (sing.py); phim lặp liền nên không fade cuối.
- **Audio transition:** 3.0 s tay, 3.8 s tay, 7.0 s swell, 12.4 s fill, 15.4 s swell, 18.4 s riser, 21.0 s pickup, 24.0 s run, 27.0 s swell, 33.9 s fill, 38.2 s drop, 40.5 s tay, 41.2 s tay, 42.2 s pickup, 45.3 s run ("tay" = viết tay; bảng đầy đủ trong SOUND-PLAN.md).

## G. Final Quality Checklist

| Tiêu chí (Task.md §10) | Đo được | Cách đo | Chi tiết |
|---|---|---|---|
| Phát âm rõ ràng | CẦN NGHE | Whisper small.en + base.en nghe từng từ; từ có xác suất < 0,5 ở cả hai mô hình | L08: một mô hình: thừa "head"; L08: một mô hình: "huddle" → base: "off"; L08: một mô hình: "fly" → base: "lie"; L08: xác suất thấp ở cả hai mô hình (< 0,5): "huddle" |
| Không sai từ | ĐẠT | cả hai mô hình nghe ra đúng mọi từ và mọi từ khoá | — |
| Không nuốt âm | ĐẠT | năng lượng xát / bật ở cuối từ (bugs, legs, wings…) so với bản nói gốc | — |
| Không lặp từ ngoài ý muốn | CẦN NGHE | không mô hình nào nghe ra từ thừa | L08: một mô hình: thừa "head"; L15: một mô hình: thừa "huh" |
| Giai điệu tự nhiên | CẦN NGHE | cao độ từng nốt so với bản nhạc (dung sai theo kiểu hát), độ kéo nguyên âm · phần "tự nhiên" chỉ nghe được | L07: nốt lướt / nốt ngắn lệch: F3 @18.35s +195 cent (100 ms có thanh); L11: nốt lướt / nốt ngắn lệch: E3 @33.31s +203 cent (130 ms có thanh) |
| Không bị méo giọng | CẦN NGHE | quá tải, click ở chỗ nối, HNR so với bản nói, cao độ phẳng, vibrato | L07: cao độ dao động / trôi tới 261 cent trên nốt dài |
| Tốc độ giọng vừa tai trẻ | ĐẠT | câu nói ≤ 4.0 âm tiết/s trên đoạn có tiếng; câu hát ≤ 3.2 âm tiết/s theo bản nhạc (trừ điệp khúc) · chậm, liền hơi: chỉ nghe được | — |
| Nhịp hát phù hợp hình ảnh | CẦN NGHE | âm tiết / giây, nốt ngắn nhất, ngắt ở dấu câu, từ dính nhau · khớp hành động chỉ xem được | L09: đứt giữa từ (im tuyệt đối): "hiding" (192 ms); L11: đứt giữa từ (im tuyệt đối): "under" (217 ms) |
| Giọng có cảm xúc, có nhấn nhá | ĐẠT | câu nói: dải cao độ ≥ 4 nửa cung, từ nhấn cao hơn cả câu ≥ 0,5 nửa cung (emote.py uốn theo emo của câu) · cảm xúc có hợp tình huống: chỉ nghe được | — |
| Giữ nhất quán giọng nhân vật | ĐẠT | cao độ trung vị và âm lượng từng câu so với các câu khác của cùng nhân vật | — |
| Không bị nhạc nền che lấp | ĐẠT | lời hơn nhạc + tiếng động ≥ 10 dB ở dải 300–4000 Hz (stem cuối) | — |
| Phụ đề khớp 100% với lời thoại | ĐẠT | chữ trên phụ đề = lời; chữ hiện đúng lúc hát (± 0,3 s); khẩu hình đủ khung | — |

**Chỉ nghe / xem được (điền tay khi duyệt):**

- [ ] Giai điệu tự nhiên, hợp cảm xúc từng cảnh (không chỉ "nghe vui")
- [ ] Giọng không robot, không chuột chip; vibrato vừa phải; không thấy dấu autotune
- [ ] Giọng hát nghe như chính nhân vật, giữ cùng âm sắc giữa các đoạn
- [ ] Lời hát khớp hành động và khẩu hình
- [ ] Nếu một tiêu chí không đạt: chỉ tạo lại đúng câu đó (`sing.py --only <id>`)

