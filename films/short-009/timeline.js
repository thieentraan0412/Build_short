// Một nguồn thời gian duy nhất cho hình, phụ đề, âm thanh. Bản B: lưới phim 4/4 ở 120 BPM, 12 ô nhịp (mỗi ô 2 s) = 24 s, phát vòng lặp liền mạch.
export const BPM = 120, BEAT = 60 / BPM, METER = 4, BAR = BEAT * METER;
export const at = (bar, beat = 0) => (bar * METER + beat) * BEAT;
export const PACE = .85;   // lời dẫn chậm hơn tập A khoảng 15% (kế hoạch §4.3); câu cửa miệng giữ tốc độ chuẩn

// leaf: chiếc lá lúc hoàng hôn (móc → "Nope!" → kính lớn đếm cánh, một cảnh liền); album: sổ của Albie; gag: lại chiếc lá, Fizz bắt chước, vòng lặp
export const DUR = at(12);
export const HIT = {
  words: [0, .12],
  // móc: Fizz vừa đáp cạnh Blink (chạm lá ở 0,08 s; cú bay tới bắt đầu từ cuối phim), cọ chân; Blink bắt chước; Blink nhận "Me! I'm a firefly!"
  land: .08, rub: [.75, 1.5], copy: [1.0, 1.7], claim: 2.0, titleOut: [2.85, 3.2],
  // khựng ≤ 1 s rồi Miss Loupe bật vào đúng câu "Nope!"; Blink xìu
  hush: [3.15, 3.72], hopIn: [3.22, 3.66], deflate: 3.85,
  // "Let's zoom in!" → kính lớn
  zoom: [5.75, 6.25],
  // trong kính: Fizz xoè cánh, đếm 1, 2; lia sang Blink: tấm cánh bật (1, 2), cánh mỏng mở (3, 4)
  spread: 6.45, count2: [7.0, 7.35], pan: [8.5, 9.05], cases: 9.7, count4: [9.75, 10.0, 10.65, 10.9], wings: 10.45, proud: 12.2,
  // chụp → match cut thành sticker → trang sổ
  snap: 13.4, zoomIn: [13.5, 13.8], zoomOut: [13.8, 14.15], stamp: 14.3,
  // sổ: Blink bay vào; Albie đếm chân, "đớp" đúng chữ "go!" khi Blink lao vào trang
  blinkIn: [14.6, 15.2], counts: [14.85, 15.1, 15.35], dive2: [16.45, 16.85], gulp: 16.85, mini: 17.05,
  flip: [17.6, 18.1],
  // gag: Fizz nhấc cánh như tấm cánh, gồng đuôi, "xì"; nhún vai, cọ chân; câu hỏi kết; bay một vòng, đáp về khung đầu
  lift: [18.25, 18.55], strain: [18.55, 19.05], fizzle: 19.08, shrug: 20.35, rub2: [20.6, 21.3],
  takeoff: 22.4, recall: 23.0, exit: [23.45, 23.9], loop: [23.4, at(12)],
};
export const SECS = [
  { id: 'leaf', t0: 0, t1: HIT.zoomIn[0] },
  { id: 'album', t0: HIT.zoomIn[0], t1: HIT.flip[1] },
  { id: 'gag', t0: HIT.flip[1], t1: DUR },
];

// t: lúc bắt đầu nói (giây). dur: độ dài thật (voice/dur.json, sau voicefx.py). who: giọng trong _shared/voices.js.
// say: chữ đưa vào TTS khi khác chữ hiện (phụ đề vẫn là text). L01 là lời dẫn trong 3 s đầu (Miss Loupe chưa vào hình, được phép).
export const LINES = [
  { id: 'L01', who: 'loupe', t: .1, dur: 1.555, card: 1, text: 'Which one is a fly?' },
  { id: 'L02', who: 'blink', t: 2.0, dur: 1.152, card: 1, text: "Me! I'm a firefly!", say: "Me! I'm a fire-fly!", pace: 1 },   // "firefly" liền bị small.en nghe thành "fireside"
  { id: 'L03', who: 'loupe', t: 3.76, dur: .628, card: 2, text: 'Nope!', catch: true },
  { id: 'L04', who: 'loupe', t: 4.75, dur: .999, card: 2, text: "Let's zoom in!", catch: true },
  { id: 'L05', who: 'loupe', t: 6.5, dur: 1.929, card: 3, text: 'A fly has two wings.' },
  { id: 'L06', who: 'loupe', t: 9.1, dur: 2.412, card: 4, text: 'Blink has wing cases on top!' },
  { id: 'L07', who: 'blink', t: 12.2, dur: .945, card: 5, text: "So I'm a beetle!", pace: 1 },
  { id: 'L08', who: 'albie', t: 14.6, dur: 2.297, card: 6, text: 'Six legs? In you go!', catch: true },
  { id: 'L09', who: 'loupe', t: 19.3, dur: 1.574, card: 7, text: 'Nice try, Fizz!' },
  { id: 'L10', who: 'loupe', t: 21.5, dur: 1.903, card: 8, text: 'How many wings does a fly have?', pace: 1 },   // câu hỏi kết cho trẻ: "Two!" (QUALITY.md §6)
];
// Tấm phụ đề: giữ ≥ 1,8 s và ≥ câu cuối + 0,6 s (DIRECTOR.md §7); không được chồng tấm sau. Chữ hiện dần theo câu đã nói.
export const CARDS = [...new Set(LINES.map(l => l.card))].map(k => {
  const ls = LINES.filter(l => l.card === k), t0 = ls[0].t, end = ls.at(-1).t + ls.at(-1).dur;
  return { t0, t1: Math.min(DUR - .3, Math.max(t0 + 1.8, end + .6)), text: ls.map(l => l.text).join(' '), parts: ls.map(l => ({ t: l.t, text: l.text })) };
});
export const CARD_CLASHES = CARDS.filter((c, i) => i + 1 < CARDS.length && c.t1 > CARDS[i + 1].t0).map(c => c.text);

// 10 khung cho storyboard
export const BOARD = [
  { t: 0.3, shot: '1', frame: 'Medium, the leaf at sunset · loop frame', dur: '3.4 s', line: 'Which one is a fly?' },
  { t: 2.5, shot: '1', frame: 'Medium · Blink claims', dur: '3.4 s', line: "Me! I'm a firefly!" },
  { t: 4.0, shot: '2', frame: 'Medium · Miss Loupe hops in', dur: '1.6 s', line: 'Nope!' },
  { t: 7.6, shot: '4', frame: 'Big lens: count the fly\'s wings', dur: '2.2 s', line: 'A fly has two wings.' },
  { t: 11.2, shot: '5', frame: 'Big lens: Blink\'s wing cases', dur: '2.9 s', line: 'Blink has wing cases on top!' },
  { t: 12.7, shot: '6', frame: 'Big lens · proud', dur: '1.2 s', line: "So I'm a beetle!" },
  { t: 15.6, shot: '8', frame: 'Album', dur: '3.4 s', line: 'Six legs? In you go!' },
  { t: 18.9, shot: '10', frame: 'Medium · Fizz copies Blink', dur: '3.0 s', line: '(fizz…)' },
  { t: 20.3, shot: '10', frame: 'Medium', dur: '3.0 s', line: 'Nice try, Fizz!' },
  { t: 22.6, shot: '11', frame: 'Medium → loop', dur: '2.6 s', line: 'How many wings does a fly have?' },
];

// Sự kiện âm thanh, khớp với chuyển động trong film.js (core/render/events.mjs → events.json → mix.py). Bảng cue đầy đủ ở SOUND.md.
export const EV = [
  // móc: chữ bật; Fizz đáp (tiếng vo ve tới từ cuối phim); cọ chân; Blink bắt chước, nhún; Blink nhận
  { t: 0, type: 'titlepop' },
  ...HIT.words.map((t, i) => ({ t, type: 'wordpop', n: i })),
  { t: HIT.land, type: 'land', pan: -.2 },
  { t: .1, type: 'buzzout', pan: -.2 },
  { t: HIT.rub[0], type: 'rub', d: HIT.rub[1] - HIT.rub[0], pan: -.25 },
  { t: HIT.copy[0], type: 'rub', d: HIT.copy[1] - HIT.copy[0], v: .7, pan: .25 },
  { t: 1.55, type: 'hop', pan: -.2 }, { t: 1.75, type: 'hop', pan: .25 },
  { t: HIT.claim, type: 'tadasmall', pan: .25 },
  // khựng, Miss Loupe bật vào, "Nope!", Blink xìu
  { t: HIT.hush[0], type: 'hush', d: HIT.hush[1] - HIT.hush[0] },
  { t: HIT.hopIn[0], type: 'zip', d: .4, pan: -.6 },
  { t: HIT.hopIn[1], type: 'landL', pan: -.5 },
  { t: 4.42, type: 'deflate', pan: .25 },                         // tiếng xì hơi sau chữ "Nope!" (không chồng lời)
  // kính lớn
  { t: HIT.zoom[0], type: 'zoom' },
  // đếm cánh: Fizz xoè cánh, vo ve; 1, 2; lia sang Blink; tấm cánh bật; cánh mỏng mở; 1–4 cao dần
  { t: HIT.spread, type: 'buzz', d: .6, pan: -.2 },
  ...HIT.count2.map((t, i) => ({ t, type: 'count', n: i, pan: [-.3, .1][i] })),
  { t: HIT.pan[0], type: 'swish', d: .5, v: .3, lo: 900, hi: 3600, up: true, pan: .3 },
  { t: HIT.cases, type: 'clack', pan: .2 },
  { t: HIT.wings, type: 'unfold', pan: .2 },
  ...HIT.count4.map((t, i) => ({ t, type: 'count', n: i + 2, pan: [-.2, .2, -.1, .3][i] })),
  { t: HIT.proud, type: 'sparkle', pan: .2 },
  // chụp → sticker → sổ
  { t: HIT.snap, type: 'snap' },
  { t: HIT.zoomIn[0], type: 'zoomin', d: HIT.zoomIn[1] - HIT.zoomIn[0] },
  { t: HIT.zoomOut[0], type: 'zoomout', d: HIT.zoomOut[1] - HIT.zoomOut[0] },
  { t: HIT.zoomOut[1], type: 'page' },
  { t: HIT.stamp - .3, type: 'swipe', d: .3, lo: 1800, hi: 8000, pan: .7 },
  { t: HIT.stamp, type: 'stamp' },
  { t: HIT.stamp + .02, type: 'ding', m: 88 },
  // Blink bay vào, Albie đếm chân, lao vào trang đúng "go!"
  { t: HIT.blinkIn[0], type: 'zip', d: .5, pan: .6 },
  ...HIT.counts.map((t, i) => ({ t, type: 'countA', n: i })),
  { t: HIT.dive2[0], type: 'jump', pan: .2 },
  { t: HIT.gulp, type: 'gulp' },
  { t: HIT.mini, type: 'pops', n: 3, step: .06, m: 91, v: .35 },
  { t: HIT.flip[0], type: 'flip', d: HIT.flip[1] - HIT.flip[0] },
  // gag: Fizz nhấc cánh, gồng, "xì"; nhún vai, cọ chân
  { t: HIT.lift[0], type: 'buzz', d: .3, v: .6, pan: -.2 },
  { t: HIT.strain[0], type: 'strain', d: HIT.strain[1] - HIT.strain[0], pan: -.2 },
  { t: HIT.fizzle, type: 'fizzle', pan: -.2 },
  { t: HIT.shrug, type: 'shrug', pan: -.2 },
  { t: HIT.rub2[0], type: 'rub', d: HIT.rub2[1] - HIT.rub2[0], pan: -.2 },
  // câu hỏi; Fizz cất cánh, bay một vòng, đáp về khung đầu (tiếng đáp ở 0,08 s đầu phim)
  { t: HIT.takeoff, type: 'buzzloop', d: DUR - HIT.takeoff + .1, pan: 0 },
  { t: HIT.recall, type: 'recall' },
  { t: HIT.exit[0], type: 'hopout', pan: -.6 },
];
