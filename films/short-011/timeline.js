// SHORT-011 · Sneaking Up on a Dragonfly... Oops! — timeline (chuẩn 11/2026b, _shared/QUALITY.md §8; dựng lại theo SHORT-016, Task.md 19/11/2026).
// Một nguồn thời gian duy nhất cho hình, phụ đề, giọng nói, nhạc. Bản B: lưới phim 4/4 ở 120 BPM, 25 s, phát vòng lặp liền:
// khung cuối là đúng khung đầu (Crumb giơ biển BOO! rón rén sau lưng Zip).
// Bài hát của tập "Tiptoe Cha-Cha" (Si trưởng). Bí mật: đôi mắt to của chuồn chuồn thấy gần trọn vòng → điệp khúc "Big eyes see almost all around!"
// (lần 1 ở cảnh mắt Zip sáng lên trong khung chia đôi, lần 2 sau gag, ngay trước câu hỏi kết).
// KHÔNG AI HÁT (QUALITY.md §8.3): mọi câu là giọng TTS gốc; câu theo phách viết `tune`; giai điệu điệp khúc do nhạc cụ chơi.
// Miss Loupe luôn như SHORT-015 (§9.10: af_heart, lời dẫn .765, ngữ điệu TTS gốc).
import { song, resolveLines, cardsOf, cardClashes, resolveSong, STANDARD as STD } from '../../_shared/song.js';
import { VOICES, CATCH_TUNE } from '../../_shared/voices.js';
export const STANDARD = STD;
// mốc từ thật của câu nói (voice/words.js, _shared/tools/wordtimes.py ghi sau bước giọng): phụ đề chạy chữ đúng lúc nói
const WORDT = await import('./voice/words.js').then(m => m.default).catch(() => ({}));
// độ dài thật của từng câu (voice/dur.js, tools/lines.mjs ghi từ voice/dur.json): câu theo phách lấy dur ở đây
const DURS = await import('./voice/dur.js').then(m => m.default).catch(() => ({}));
export const BPM = 120, BEAT = 60 / BPM, METER = 4, BAR = BEAT * METER;
export const at = (bar, beat = 0) => (bar * METER + beat) * BEAT;
export const PACE = .85;                                      // bản B: lời dẫn chậm hơn ~15 % (Miss Loupe dùng pace .85 của voices.js)
export const DUR = 25;                                        // bản B 15–25 s: điệp khúc lần 2 và câu hỏi kết đọc chậm cần thêm 3 s so với bản 22 s cũ
const SP = 4.35;                                               // khoá kéo bắt đầu tách khung (khi Crumb vừa nói xong "...see me!")
// phần của bài hát (mỗi phần một BPM ≥ 108): t0 và phách
const B108 = 60 / 108, B132 = 60 / 132;
const P_CRUMB = SP + .5, P_EYES = 7.05, P_AROUND = 10.2, P_CH2 = 19.9, P_CTA = 23.0;
const hb = (t0, b, k) => +(t0 + k * b).toFixed(4);            // phách thứ k (có thể lẻ .5) của phần bắt đầu ở t0

export const HIT = {
  words: [0, .12],
  // móc: Crumb rón rén (mỗi bước một phách), giẫm lá khô "rắc" → đứng sững một chân, lắc lư; Zip vẫn đậu yên (đuôi giật nhẹ: chi tiết xem lại)
  steps: [.25, .75, 1.25, 1.75], crunch: 1.98, wobble: [1.98, 2.7], grin: 2.25, titleOut: [2.85, 3.2], tilt: [3.05, 4.2],
  // khoá kéo tách khung: "CRUMB SEES" | "ZIP SEES"
  split: [SP, SP + .5],
  // mắt Zip mở, tầm nhìn nở rộng ra gần trọn vòng, Crumb trượt vào khung bên phải; vòng "bị thấy rồi!"
  open: [P_EYES, P_EYES + .35], wide: [P_EYES + .3, P_EYES + 1.3], spot: 8.6,
  // "Oh no!" → Crumb nấp sau tấm biển (vẫn bị thấy); điệp khúc 1: hai vòm mắt sáng, vệt sáng chạy quanh tầm nhìn
  hide: [P_AROUND - .3, P_AROUND], glow: [10.55, 13.0], sweep: [11.05, 12.55], peek: 12.85,
  // chụp → match cut thành sticker → trang sổ
  snap: 13.15, zoomIn: [13.25, 13.55], zoomOut: [13.55, 13.9], stamp: 14.05,
  // sổ: Zip bay vào; Albie đếm chân, "đớp" đúng chữ "go!" khi Zip lao vào trang
  zipIn: [14.15, 14.65], counts: [14.5, 14.75, 15.0], dive: [16.1, 16.5], gulp: 16.5, mini: 16.7,
  flip: [16.8, 17.25],
  // gag: Crumb rón rén lại gần, hít hơi; Zip quay lại TRƯỚC; Crumb giật mình nhảy bật, tấm biển bay vèo (mặt sau "hi!"), ngã ngồi lên đệm cỏ ba lá, biển đáp lên đầu như mũ
  sneak2: [17.25, 17.75], tip2: [17.32, 17.56], inhale: 17.75, turn: [17.8, 18.05], jump: 18.15, land: 18.63, hat: 18.87, giggle: 19.5,
  // điệp khúc 2: Zip quay về, đôi mắt sáng lên lần nữa, vòng sáng chạy quanh cả khu vườn; Crumb đứng dậy, nhún theo
  glow2: [P_CH2 + .45, P_CH2 + 2.9], ring2: [P_CH2 + .9, P_CH2 + 2.6], getUp: [20.6, 21.1],
  // câu hỏi kết; vòng lặp: Zip quay lưng lại, Crumb giơ biển, rón rén về đúng khung đầu, máy ngẩng lên về khung 0
  turnBack: [22.95, 23.35], recall: 23.75, tip3: 24.45, loop: [23.95, DUR],
};
export const SECS = [
  { id: 'garden', t0: 0, t1: HIT.split[0] },
  { id: 'split', t0: HIT.split[0], t1: HIT.zoomIn[0] },
  { id: 'album', t0: HIT.zoomIn[0], t1: HIT.flip[1] },
  { id: 'gag', t0: HIT.flip[1], t1: DUR },
];

// ---------- bài hát của tập: "Tiptoe Cha-Cha", Si trưởng; mỗi phần một BPM và một vòng hợp âm ----------
export const SONG = song({
  key: 'B', film: BPM,
  motif: "5:.5 1':1 6:.5 5:.5",                                // câu mở của điệp khúc ("Big EYES see AL-"): bật lên quãng bốn rồi đi xuống
  parts: [
    { t0: 0, bpm: 120, chords: 'B F#' },                       // A · móc: "Can you sneak up on a dragonfly?" (cha-cha rón rén)
    { t0: P_CRUMB, bpm: 108, chords: 'E C#m B' },              // B · khung chia đôi: CRUMB SEES
    { t0: P_EYES, bpm: 108, chords: 'B E' },                   // C · mắt Zip mở: ZIP SEES
    { t0: P_AROUND, bpm: 132, chords: 'E F# B' },              // D · điệp khúc lần 1: hai vòm mắt sáng (sổ, gag không có câu theo phách)
    { t0: P_CH2, bpm: 132, chords: 'E F# B' },                 // E · điệp khúc lần 2 (cùng nhịp, cùng hợp âm với D)
    { t0: P_CTA, bpm: 120, chords: 'B F#' },                   // F · câu hỏi kết, nối vòng lặp (lưới của phim)
  ],
});
// "BIG EYES see AL-most ALL a-ROUND!": bật lên Si cao rồi đi xuống, chạm La thăng ở phách mạnh (hợp âm Fa thăng), đáp về Fa thăng
const CHORUS = { mode: 'sing', chorus: 'eyes', notes: "5:.5 1':1 6:.5 5:.5 6:.5 7:.5 6:.5 5:1.25" };

// t, dur của câu nói thường: độ dài thật (voice/dur.json). Câu theo phách (tune): t từ bản nhạc, dur từ voice/dur.js.
// em: từ nhấn trên phụ đề; cta: câu kêu gọi cuối (≤ 2 s, cụ thể, Made for Kids). emo: cảm xúc của câu (Lớp Voice; Miss Loupe không uốn).
// Crumb giữ tốc độ chuẩn .85 của voices.js (chậm hơn thì Kokoro af_jessica sinh tiếng "uh" đầu câu, Whisper nghe sai), trừ "Oh no!" (.68: qua cả hai Whisper).
export const LINES = resolveLines(SONG, VOICES, [
  { id: 'L01', emo: 'curious', who: 'loupe', text: 'Can you sneak up on a dragonfly?', em: ['sneak', 'dragonfly'],
    tune: { mode: 'half-sing', at: .5, notes: "3:.5 4:.5 5:1 6:.5 5:.5 5:.5 6:.5 7:.5 1':1.5" } },        // câu móc: hỏi, leo dần lên Si cao
  { id: 'L02', emo: 'proud', who: 'crumb', t: 3.0, dur: 1.495, pace: 1, text: "From behind, it can't see me!", em: ['behind', 'see'],   // niềm tin sai để phim sửa: nói
    why: 'giữ tốc độ chuẩn của Crumb (.85): Kokoro af_jessica đọc chậm hơn (.68–.8) sinh tiếng "uh" ở đầu câu, base.en và small.en nghe thành "But / Or from behind" (thử 8 cách viết, 19/11/2026)' },
  { id: 'L03', emo: 'calm', who: 'loupe', text: 'Crumb only sees its back.', em: ['back'],
    tune: { mode: 'sing-talk', at: hb(P_CRUMB, B108, .5), notes: '5:.5 3:.5 3:.5 4:.5 3:.5 1:.75' } },         // giải thích: rõ từ
  { id: 'L04', emo: 'surprised', who: 'loupe', text: 'But Zip can see Crumb!', em: ['zip', 'see'],
    tune: { mode: 'half-sing', at: hb(P_EYES, B108, .5), notes: "3:.5 4:.5 5:.5 1':1 6:1.5" } },               // bất ngờ: bật lên ở "see"
  { id: 'L05', emo: 'startled', emo_k: .5, who: 'crumb', t: 9.18, dur: .845, pace: .8, text: 'Oh no!', why: 'uốn ngữ điệu giật mình đủ mạnh (1,1) thì base.en nghe "Oh no!" thành "Although, no": độ uốn .5' },                  // giật mình vui: nói
  { id: 'L06', emo: 'happy', who: 'loupe', text: 'Big eyes see almost all around!', em: ['eyes', 'around'], tune: { ...CHORUS, at: hb(P_AROUND, B132, 1) },
    was: 'Its big eyes see almost all around!', why: 'thành điệp khúc (≤ 8 từ, nhắc lại trước câu hỏi kết); giữ "almost" đúng nguồn (FACTS.md §2)' },
  { id: 'L07', emo: 'proud', who: 'albie', t: 14.25, dur: 2.297, text: 'Six legs? In you go!', em: ['legs'], catch: true },
  { id: 'L08', emo: 'playful', who: 'crumb', t: 18.6, dur: 1.289, pace: 1, text: 'Oh! I scared myself!', em: ['scared'],   // gag: nói (cười ngượng)
    why: 'tốc độ chuẩn của Crumb (.85): đọc chậm (.68, .72) thì small.en nghe "Oh! I" thành "Although I"' },
  { id: 'L09', emo: 'happy', who: 'loupe', text: 'Big eyes see almost all around!', em: ['eyes', 'around'], tune: { ...CHORUS, at: hb(P_CH2, B132, 1) } },
  { id: 'L10', emo: 'happy', who: 'loupe', text: 'Can YOU sneak up on Zip?', em: ['you', 'sneak', 'zip'], cta: true, pace: .85,
    tune: { mode: 'half-sing', at: P_CTA, notes: "5:.5 1':1 7:.5 5:.5 6:.5 2':.5" },
    why: 'câu hỏi kết cho trẻ trả lời to ("No!"); đọc chậm hơn tốc độ chuẩn .9 của bản 22 s (4,2 âm tiết/s là nhanh với trẻ 4–8 tuổi), vẫn ≤ 2 s' },
], { durs: DURS });
export const SECRET = { kw: ['eyes', 'around', 'sneak'] };   // từ khoá của bí mật: phụ đề nhấn, CTA nhắc lại
// Tấm phụ đề ≤ 7 từ, mỗi tấm một câu, chữ hiện từng từ theo lúc nói; không có phụ đề khi chữ móc đang trên hình.
export const CARDS = cardsOf(LINES, DUR, { max: 7, hide: [0, HIT.titleOut[1]], times: WORDT });
export const CARD_CLASHES = cardClashes(CARDS);
const L = id => LINES.find(l => l.id === id);
// hết đoạn nhạc của câu id (nốt cuối của tune): hình nhảy theo điệp khúc chạy hết đoạn nhạc, không dừng khi lời hết
export const spanEnd = id => { const l = L(id), ns = (l.sung || l.tune || {}).notes; return ns && ns.length ? l.t + Math.max(...ns.map(n => n.t + n.d)) + .1 : l.t + l.dur; };
// lúc từ thứ w của câu id vang (giây, tuyệt đối): mốc từ thật của bản nói (voice/words.js); chưa có thì theo nốt của tune
export const wordAt = (id, w) => {
  const l = L(id), r = WORDT[id]; if (r && r[w]) return l.t + r[w][0];
  const n = ((l.sung || l.tune || {}).notes || []).find(n => n.w === w); return n ? l.t + n.t : l.t;
};

// 6 nhịp kể chuyện (Task.md mục C): hook ≤ 3 s
export const BEATS = [
  { id: 'hook', t0: 0, t1: HIT.titleOut[0], what: 'Crumb rón rén giơ biển BOO! sau lưng Zip; "Can you sneak up on a dragonfly?"; lá khô "rắc", Crumb đứng sững một chân' },
  { id: 'setup', t0: HIT.titleOut[0], t1: HIT.open[0], what: 'Crumb chắc mẩm "From behind, it can\'t see me!"; khoá kéo tách khung; CRUMB SEES: chỉ thấy lưng Zip' },
  { id: 'discovery', t0: HIT.open[0], t1: HIT.flip[1], what: 'ZIP SEES: mắt Zip mở, tầm nhìn nở rộng, Crumb bị thấy · "Oh no!" · điệp khúc lần 1 "Big eyes see almost all around!" · sổ: "Six legs? In you go!"' },
  { id: 'surprise', t0: HIT.flip[1], t1: L('L09').t, what: 'Gag: Crumb rình lần nữa, Zip quay lại trước, Crumb tự giật mình ngã lên đệm cỏ, biển đội đầu: "Oh! I scared myself!"' },
  { id: 'payoff', t0: L('L09').t, t1: L('L10').t, what: 'Điệp khúc lần 2: đôi mắt Zip sáng lên, vòng sáng chạy quanh cả khu vườn (nhạc cụ chơi giai điệu)' },
  { id: 'cta', t0: L('L10').t, t1: DUR, what: '"Can YOU sneak up on Zip?" (trẻ đáp "No!"); chữ móc trở lại; Crumb giơ biển, rón rén về khung đầu' },
];
// cú máy / thay đổi hình có mục đích, mỗi 2–4 s (Task.md mục B); qa_musical.py so với thay đổi đo được
export const SHOTS = [
  { t: 0, kind: 'trung, khu vườn, máy đẩy chậm; chữ móc ở trời', why: 'hành động ở khung 0: Crumb nhón chân giơ biển BOO! sau lưng Zip' },
  { t: HIT.crunch, kind: 'rung máy, đẩy nhanh: lá khô "rắc"', why: 'phản ứng bằng hành động: Crumb đứng sững một chân' },
  { t: HIT.tilt[0], kind: 'máy hạ xuống ngang tầm Crumb', why: 'Crumb cười trừ, nói câu sai "it can\'t see me!"' },
  { t: HIT.split[0], kind: 'khoá kéo tách khung từ trên xuống', why: 'chuyển sang khung chia đôi: ai thấy ai?' },
  { t: HIT.split[1] + .3, kind: 'đẩy vào nửa trái CRUMB SEES', why: '"Crumb only sees its back": chỉ thấy lưng Zip' },
  { t: HIT.open[0], kind: 'lia sang nửa phải ZIP SEES, mắt Zip mở', why: 'bí mật xảy ra: tầm nhìn nở rộng gần trọn vòng' },
  { t: HIT.spot, kind: 'rung nhẹ, vòng "bị thấy rồi!" quanh Crumb', why: '"But Zip can see Crumb!"' },
  { t: HIT.hide[0], kind: 'đẩy vào Crumb nấp sau biển', why: 'gag nhỏ: nấp rồi vẫn bị thấy' },
  { t: HIT.glow[0], kind: 'lùi ra cả hai khung, hai vòm mắt sáng', why: 'điệp khúc lần 1: vệt sáng chạy quanh tầm nhìn' },
  { t: HIT.peek, kind: 'Crumb ló ra vẫy (khung phải)', why: 'biểu cảm: Crumb chịu thua, cười' },
  { t: HIT.zoomIn[0], kind: 'chụp → match cut qua sticker → trang sổ', why: 'chuyển cảnh kính → sổ có chuyển động nối' },
  { t: HIT.counts[1], kind: 'Albie đếm chân, Zip bay vòng', why: '"Six legs? In you go!" nói trong lúc có hành động' },
  { t: HIT.dive[0], kind: 'đẩy nhẹ: Zip lao vào trang, Albie đớp', why: 'câu cửa miệng có hành động' },
  { t: HIT.flip[0], kind: 'lật trang về khu vườn', why: 'mở gag' },
  { t: HIT.jump, kind: 'đẩy nhanh, rung: Zip quay lại trước, EEK!', why: 'bất ngờ: Crumb tự giật mình' },
  { t: HIT.hat, kind: 'biển đáp lên đầu như mũ', why: 'gag kết, đạo cụ (tấm biển, đệm cỏ) có từ khung 0' },
  { t: HIT.glow2[0], kind: 'lùi ra khu vườn, mắt Zip sáng, vòng sáng chạy quanh', why: 'điệp khúc lần 2: trẻ đọc theo, nhạc chơi giai điệu' },
  { t: L('L10').t, kind: 'đẩy vào Crumb và Zip, chữ móc trở lại, máy ngẩng về khung 0', why: 'CTA và vòng lặp liền' },
];

// 10 khung cho storyboard
export const BOARD = [
  { t: 0.3, shot: '1', frame: 'Medium, the garden · loop frame', dur: '2.0 s', line: '♪ Can you sneak up on a dragonfly?' },
  { t: 2.3, shot: '2', frame: 'Medium · crunch! Crumb freezes', dur: '1.0 s', line: "From behind, it can't see me!" },
  { t: 4.6, shot: '4', frame: 'Zipper splits the frame', dur: '0.5 s', line: '(zzzip!)' },
  { t: 6.2, shot: '5', frame: 'Split · CRUMB SEES (Zip\'s back)', dur: '1.9 s', line: '♪ Crumb only sees its back.' },
  { t: 8.7, shot: '7', frame: 'ZIP SEES: eye opens, widens', dur: '1.3 s', line: '♪ But Zip can see Crumb!' },
  { t: 11.8, shot: '9', frame: 'Split · eyes glow, sweep (chorus 1)', dur: '2.3 s', line: '♪ Big eyes see almost all around!' },
  { t: 15.4, shot: '12', frame: 'Album', dur: '1.6 s', line: 'Six legs? In you go!' },
  { t: 18.6, shot: '15', frame: 'Zip turns first · EEK!', dur: '0.7 s', line: '(boing!)' },
  { t: 21.6, shot: '17', frame: 'Garden · Zip\'s eyes glow (chorus 2)', dur: '2.9 s', line: '♪ Big eyes see almost all around!' },
  { t: 23.9, shot: '18', frame: 'Medium → loop', dur: '1.9 s', line: '♪ Can YOU sneak up on Zip?' },
];

// Sự kiện âm thanh, khớp với chuyển động trong film.js (core/render/events.mjs → events.json → mix.py). Bảng cue đầy đủ ở SOUND.md.
// run: chuỗi nhịp có chủ đích (bước nhón chân theo phách, Albie đếm) — qa_musical.py không tính là lặp máy móc.
export const EV = [
  // móc: chữ bật; Crumb nhón từng bước; giẫm lá khô "rắc"; lắc lư; Zip giật đuôi; cười trừ
  { t: 0, type: 'titlepop' },
  ...HIT.words.map((t, i) => ({ t, type: 'wordpop', n: i })),
  ...[.02, ...HIT.steps].map((t, i) => ({ t, type: 'tiptoe', n: i, run: 'sneak1', pan: -.35 })),
  { t: HIT.crunch, type: 'crunch', pan: -.3 },
  { t: HIT.crunch + .06, type: 'wobble', d: .6, pan: -.3 },
  { t: HIT.crunch + .12, type: 'twitch', pan: .05 },
  { t: HIT.grin, type: 'sheepish', pan: -.3 },
  { t: HIT.titleOut[0], type: 'titleout' },
  { t: HIT.tilt[0] + .05, type: 'tiltdown', d: HIT.tilt[1] - HIT.tilt[0] - .1, pan: 0 },
  // khoá kéo tách khung
  { t: HIT.split[0], type: 'zipper', d: HIT.split[1] - HIT.split[0] },
  { t: HIT.split[1], type: 'panels' },
  { t: HIT.split[1] + .3, type: 'pushL', pan: -.4 },
  // mắt Zip mở, tầm nhìn nở rộng, Crumb trượt vào; bị thấy rồi!
  { t: HIT.open[0], type: 'eyeopen', pan: .4 },
  { t: HIT.wide[0], type: 'widen', d: HIT.wide[1] - HIT.wide[0], pan: .4 },
  { t: HIT.spot, type: 'spot', pan: .2 },
  // "Oh no!" → nấp sau biển; điệp khúc 1: hai vòm mắt sáng; vệt sáng chạy quanh; Crumb ló ra vẫy
  { t: HIT.hide[0], type: 'hide', d: HIT.hide[1] - HIT.hide[0] + .1, pan: .2 },          // Crumb nấp sau biển (cả động tác)
  { t: P_AROUND + .02, type: 'chorus', pan: 0 },
  { t: HIT.glow[0], type: 'glow', pan: -.4 },
  { t: HIT.sweep[0] + .02, type: 'sweep', d: HIT.sweep[1] - HIT.sweep[0], pan: .4 },
  { t: HIT.peek, type: 'peek', pan: .2 },
  // chụp → sticker → sổ
  { t: HIT.snap, type: 'snap' },
  { t: HIT.zoomIn[0], type: 'zoomin', d: HIT.zoomIn[1] - HIT.zoomIn[0] },
  { t: HIT.zoomOut[0], type: 'zoomout', d: HIT.zoomOut[1] - HIT.zoomOut[0] },
  { t: HIT.zoomOut[1], type: 'page' },
  { t: HIT.stamp - .3, type: 'swipe', d: .3, lo: 1800, hi: 8000, pan: .7 },
  { t: HIT.stamp, type: 'stamp' },
  { t: HIT.stamp + .02, type: 'ding', m: 87 },
  { t: HIT.stamp + .2, type: 'textpop', n: 0, pan: .2 },                         // chữ "No sneaking!" trên trang
  // Zip bay vào, Albie đếm chân, lao vào trang đúng "go!"
  { t: HIT.zipIn[0], type: 'zip', d: .5, pan: .6 },
  ...HIT.counts.map((t, i) => ({ t, type: 'countA', n: i, run: 'albiecount' })),
  { t: HIT.dive[0], type: 'jump', pan: .2 },
  { t: HIT.gulp, type: 'gulp' },
  { t: HIT.mini, type: 'pops', n: 3, step: .06, m: 90, v: .35 },
  { t: HIT.flip[0], type: 'flip', d: HIT.flip[1] - HIT.flip[0] },
  // gag: rón rén lần nữa; hít hơi; Zip quay lại trước "zip!"; Crumb giật mình nhảy bật; biển bay vèo; ngã ngồi lên đệm cỏ; biển đáp lên đầu
  ...HIT.tip2.map((t, i) => ({ t, type: 'tiptoe', n: i + 5, run: 'sneak2', pan: -.3 })),
  { t: HIT.inhale, type: 'inhale', pan: -.25 },
  { t: HIT.turn[0], type: 'zipturn', d: HIT.turn[1] - HIT.turn[0], pan: 0 },
  { t: HIT.jump, type: 'startle', pan: -.25 },
  { t: HIT.jump + .04, type: 'signfly', d: HIT.hat - HIT.jump - .04, pan: -.3 },
  { t: HIT.jump + .05, type: 'textpop', n: 1, pan: .3 },                          // chữ EEK!
  { t: HIT.land, type: 'plop', pan: -.4 },
  { t: HIT.hat, type: 'hat', pan: -.4 },
  { t: HIT.giggle, type: 'giggle', pan: .05 },
  // điệp khúc 2: mắt Zip sáng lên, vòng sáng chạy quanh khu vườn; Crumb đứng dậy
  { t: P_CH2 + .02, type: 'chorus', pan: 0 },
  { t: HIT.glow2[0], type: 'glow', pan: .1 },
  { t: HIT.ring2[0], type: 'sweep', d: HIT.ring2[1] - HIT.ring2[0], pan: -.2 },
  { t: HIT.getUp[0] + .1, type: 'getup', pan: -.4 },
  // câu hỏi; vòng lặp: Zip quay lưng, chữ móc trở lại, Crumb giơ biển rón rén về khung đầu
  { t: HIT.turnBack[0], type: 'zipturn', d: HIT.turnBack[1] - HIT.turnBack[0], v: .6, pan: 0 },
  { t: HIT.recall, type: 'recall' },
  { t: HIT.loop[0] + .02, type: 'tiltup', d: .8, pan: 0 },                       // máy ngẩng lên về khung 0
  { t: HIT.tip3, type: 'tiptoe', n: 7, pan: -.4 },
];
export const SONG_JSON = resolveSong(SONG, DUR);              // tools/lines.mjs ghi vào timeline.json (groove.py song mode, qa)
