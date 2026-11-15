// Một nguồn thời gian duy nhất cho hình, phụ đề, âm thanh. Bản B: lưới phim 4/4 ở 120 BPM, 11 ô nhịp (mỗi ô 2 s) = 22 s, phát vòng lặp liền mạch.
export const BPM = 120, BEAT = 60 / BPM, METER = 4, BAR = BEAT * METER;
export const at = (bar, beat = 0) => (bar * METER + beat) * BEAT;
export const PACE = .85;   // lời dẫn chậm hơn tập A khoảng 15% (kế hoạch §4.3); câu cửa miệng giữ tốc độ chuẩn

// stage: sân khấu gốc cây (móc) · lens: kính lớn trên chân sau · macro: cận cảnh hàng gai trong kính · lens2: kính lùi về, "violin bow" · gag: sân khấu, "squeak", câu hỏi, vòng lặp
export const DUR = at(11);
// Lượt kéo chân của Hop: danh sách mốc, đùi đi từ cực này sang cực kia giữa hai mốc liền nhau (mỗi khoảng một tiếng "zzip").
// Móc tính theo "thời gian vòng lặp": mốc âm thuộc cuối phim (t + DUR), nên khung cuối nối đúng khung đầu.
const HOOK_STROKES = [-.6, -.38, -.16, .06, .28, .6, .92, 1.24, 1.56, 1.88, 2.2, 2.34, 2.48, 2.62];
const LENS_STROKES = [3.9, 4.3, 4.7, 5.1, 5.5, 5.9, 6.3, 6.7, 7.1];
const LENS2_STROKES = [13.55, 14.0, 14.45, 14.9, 15.35, 15.8];
export const HIT = {
  words: [0, .12],
  strokes0: HOOK_STROKES, strokes1: LENS_STROKES, strokes2: LENS2_STROKES,
  loud0: [-.6, -.38, -.16, .06, 2.2, 2.34, 2.48],                     // lượt kéo to (ngoài lời): có nốt nhạc bật ra
  // móc: Miss Loupe giật mình; hỏi; ngó chân mình, nhấc giày ngọ nguậy (gài đạo cụ gag); tò mò "?"; nhảy sang Hop; kính bật lên
  startle: [.08, .55], wiggle: [1.15, 2.0], curious: [2.2, 2.75], hopTo: [2.9, 3.35], raise: [3.35, 3.6], titleOut: [2.9, 3.25],
  zoom: [3.6, 4.1],
  // kính lớn trên chân sau → lao sâu vào mặt trong của đùi
  deep: [6.6, 7.15],
  // cận cảnh: đùi nhấc khỏi mép cánh, trượt chậm, hàng gai sáng lần lượt; hạ xuống chạm mép cánh; tách từng gai đi lên, rồi đi xuống
  glint: [7.55, 8.95], touch: 9.38,
  ticksUp: [9.55, 9.8, 10.05, 10.3, 10.55], ticksDown: [10.95, 11.3, 11.65, 12.0, 12.35],
  zzzip: [12.62, 13.4], out: [13.35, 13.72],
  violin: 13.78,
  lensDown: [15.5, 16.0],
  // gag: bước ra giữa, nhấc chân, cọ… "squeak", nhạc khựng; Hop chớp mắt rồi cười; đỏ mặt nhìn chân; câu hỏi; chữ móc trở lại; Hop lại kéo
  step: [16.15, 16.5], legUp: [16.6, 16.95], rub: [17.3, 17.85], squeak: 17.9, hush: [17.9, 18.45], giggle: [18.3, 19.1], shrug: [19.45, 19.95],
  ask: 20.05, ready: [20.85, 21.35], recall: 20.95, home: [21.1, 21.75], loop: [21.4, at(11)],
};
// tách: mỗi gai vấp qua mép cánh (u qua một số nguyên), toạ độ "u" = chỉ số gai đang ở đỉnh gờ mép cánh
export const MACRO_U = [[6.6, -4.2], [9.3, -.55], [9.55, 0], [9.8, 1], [10.05, 2], [10.3, 3], [10.55, 4], [10.7, 4.42], [10.82, 4.35], [10.95, 4], [11.3, 3], [11.65, 2], [12.0, 1], [12.35, 0], [12.5, -.42], [12.62, -.5]];
export const SECS = [
  { id: 'stage', t0: 0, t1: HIT.zoom[0] },
  { id: 'lens', t0: HIT.zoom[0], t1: HIT.deep[0] },
  { id: 'macro', t0: HIT.deep[0], t1: HIT.out[1] },
  { id: 'lens2', t0: HIT.out[1], t1: HIT.lensDown[0] },
  { id: 'gag', t0: HIT.lensDown[0], t1: DUR },
];

// t: lúc bắt đầu nói (giây). dur: độ dài thật (voice/dur.json). who: giọng trong _shared/voices.js. Hop không lời.
export const LINES = [
  { id: 'L01', who: 'loupe', t: .32, dur: 1.851, card: 1, text: 'Could you sing with your legs?' },
  { id: 'L02', who: 'loupe', t: 2.8, dur: .999, card: 2, text: "Let's zoom in!", catch: true },
  { id: 'L03', who: 'loupe', t: 4.15, dur: 1.819, card: 2, text: "Watch Hop's back leg!" },
  { id: 'L04', who: 'loupe', t: 7.0, dur: 2.254, card: 4, text: 'Look! A row of tiny pegs!' },
  { id: 'L05', who: 'loupe', t: 10.72, dur: 1.904, card: 5, text: 'Each peg scrapes the wing!' },
  { id: 'L06', who: 'loupe', t: 13.75, dur: 1.79, card: 6, text: "It's like a violin bow!" },     // "Like a violin bow!" bị cả hai Whisper nghe thành "It's like…": viết luôn "It's"
  { id: 'L07', who: 'loupe', t: 16.15, dur: 1.107, card: 7, text: 'Let me try!' },                // "My turn!" bị nghe thành "It might turn."
  { id: 'L08', who: 'loupe', t: 18.55, dur: 1.43, card: 8, text: 'Oops! No pegs!' },
  { id: 'L09', who: 'loupe', t: 20.05, dur: 1.736, card: 8, text: 'Can YOU make music with your legs?', pace: 1 },   // câu hỏi kết cho trẻ (QUALITY.md §6)
];
// Tấm phụ đề: giữ ≥ 1,8 s và ≥ câu cuối + 0,6 s (DIRECTOR.md §7); không được chồng tấm sau. Chữ hiện dần theo câu đã nói.
export const CARDS = [...new Set(LINES.map(l => l.card))].map(k => {
  const ls = LINES.filter(l => l.card === k), t0 = ls[0].t, end = ls.at(-1).t + ls.at(-1).dur;
  return { t0, t1: Math.min(DUR - .3, Math.max(t0 + 1.8, end + .6)), text: ls.map(l => l.text).join(' '), parts: ls.map(l => ({ t: l.t, text: l.text })) };
});
export const CARD_CLASHES = CARDS.filter((c, i) => i + 1 < CARDS.length && c.t1 > CARDS[i + 1].t0).map(c => c.text);

// 10 khung cho storyboard
export const BOARD = [
  { t: 0.15, shot: '1', frame: 'Medium, stump stage at dusk · loop frame', dur: '2.2 s', line: '(zzip!) Could you sing with your legs?' },
  { t: 1.6, shot: '1', frame: 'Medium · checks her legs', dur: '2.2 s', line: 'Could you sing with your legs?' },
  { t: 3.1, shot: '2', frame: 'Medium · hops to Hop', dur: '1.4 s', line: "Let's zoom in!" },
  { t: 5.2, shot: '3', frame: 'Big lens on the hind leg', dur: '3.0 s', line: "Watch Hop's back leg!" },
  { t: 8.3, shot: '4', frame: 'Macro: the row of pegs', dur: '2.8 s', line: 'Look! A row of tiny pegs!' },
  { t: 10.1, shot: '5', frame: 'Macro: each peg ticks a note', dur: '3.2 s', line: '(tick, tick, tick…)' },
  { t: 13.1, shot: '6', frame: 'Macro: zzzzip!', dur: '0.9 s', line: '(zzzzip!)' },
  { t: 14.8, shot: '7', frame: 'Big lens + violin', dur: '2.1 s', line: "It's like a violin bow!" },
  { t: 18.1, shot: '8', frame: 'Medium · the squeak', dur: '2.8 s', line: 'Let me try! (squeak.)' },
  { t: 20.6, shot: '10', frame: 'Medium → loop', dur: '2.0 s', line: 'Can YOU make music with your legs?' },
];

// Sự kiện âm thanh, khớp với chuyển động trong film.js (core/render/events.mjs → events.json → mix.py). Bảng cue đầy đủ ở SOUND.md.
const speaking = (t, pad = .05) => LINES.some(l => t > l.t - pad && t < l.t + l.dur + pad);
const strokeEv = (list, pan, loudList = null) => list.slice(0, -1).map((t, i) => {
  const d = list[i + 1] - t, tt = t < 0 ? t + DUR : t, loud = loudList ? loudList.includes(t) : !speaking(tt + d / 2, .1);
  return { t: +tt.toFixed(3), type: 'scrape', d: +d.toFixed(3), n: i, v: loud ? 1 : .45, pan };
});
export const EV = [
  // móc: chữ bật; Hop kéo "zzip" (lượt cuối phim nối sang khung đầu), nốt nhạc bật ra; Miss Loupe giật mình rồi đáp; ngó chân, ngọ nguậy giày
  { t: 0, type: 'titlepop' },
  ...HIT.words.map((t, i) => ({ t, type: 'wordpop', n: i })),
  ...strokeEv(HIT.strokes0, -.35, HIT.loud0),
  ...[.06, 2.2, 2.48].map((t, i) => ({ t: t + .05, type: 'notepop', n: i, pan: -.3 })),
  { t: HIT.startle[0], type: 'startle', pan: .4 },
  { t: HIT.startle[1] - .05, type: 'landsoft', pan: .4 },
  { t: HIT.wiggle[0] + .1, type: 'wiggle', d: .7, pan: .4 },
  { t: HIT.curious[0] + .05, type: 'hmm', pan: .35 },
  { t: HIT.hopTo[0], type: 'hopL', pan: .3 },
  { t: HIT.hopTo[1], type: 'landsoft', pan: .15, v: .8 },
  { t: HIT.zoom[0], type: 'zoom' },
  // kính lớn: đùi kéo lên xuống dọc mép cánh
  ...strokeEv(HIT.strokes1, -.1),
  { t: HIT.deep[0], type: 'deep', d: HIT.deep[1] - HIT.deep[0] },
  // cận cảnh: hàng gai sáng lần lượt; đùi hạ xuống chạm mép cánh; tách từng gai (đi lên rồi đi xuống); "zzzzip"; nốt tuôn ra khỏi kính
  { t: HIT.glint[0], type: 'glintrun', d: HIT.glint[1] - HIT.glint[0] },
  { t: HIT.touch, type: 'touch' },
  ...HIT.ticksUp.map((t, i) => ({ t, type: 'tick', n: i, v: 1, pan: -.15 + .08 * i })),
  ...HIT.ticksDown.map((t, i) => ({ t, type: 'tick', n: 4 - i, v: .55, pan: .17 - .08 * i })),
  { t: HIT.zzzip[0], type: 'zzzip', d: HIT.zzzip[1] - HIT.zzzip[0] },
  { t: HIT.zzzip[0] + .38, type: 'notestream', d: .9 },
  { t: HIT.out[0], type: 'deepout', d: HIT.out[1] - HIT.out[0] },
  // kính lùi: vĩ cầm hiện cạnh kính, cây vĩ kéo cùng nhịp với đùi (tiếng kéo nhỏ dưới lời)
  { t: HIT.violin, type: 'violin', pan: .55 },
  ...strokeEv(HIT.strokes2, -.1),
  { t: HIT.lensDown[0], type: 'lensdown', d: HIT.lensDown[1] - HIT.lensDown[0] },
  // gag: bước, nhấc chân, cọ… "squeak"; Hop chớp mắt, cười khúc khích; nhún vai
  { t: HIT.step[0], type: 'step', pan: .3 },
  { t: HIT.legUp[0], type: 'legup', pan: .3 },
  { t: HIT.rub[0], type: 'rubtry', d: HIT.rub[1] - HIT.rub[0], pan: .3 },
  { t: HIT.squeak, type: 'squeak', pan: .3 },
  { t: HIT.hush[0] + .25, type: 'blinkhop', pan: -.3 },
  { t: HIT.giggle[0], type: 'giggle', pan: -.3 },
  { t: HIT.shrug[0] + .1, type: 'shrug', pan: .3 },
  // câu hỏi; chữ móc trở lại; Hop giơ chân sau sẵn sàng; Miss Loupe về chỗ của khung đầu
  { t: HIT.ready[0], type: 'ready', pan: -.35 },
  { t: HIT.recall, type: 'recall' },
];
