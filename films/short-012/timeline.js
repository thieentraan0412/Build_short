// Một nguồn thời gian duy nhất cho hình, phụ đề, âm thanh. Bản B: lưới phim 4/4 ở 120 BPM, 12 ô nhịp (mỗi ô 2 s) = 24 s, phát vòng lặp liền mạch.
export const BPM = 120, BEAT = 60 / BPM, METER = 4, BAR = BEAT * METER;
export const at = (bar, beat = 0) => (bar * METER + beat) * BEAT;
export const PACE = .85;   // lời giải thích chậm hơn tập A khoảng 15% (kế hoạch §4.3); câu cửa miệng giữ tốc độ chuẩn

// garden: vườn nhiệt đới (móc → "Let's zoom in!" → kính lớn: bay lùi, đứng yên, soi chậm bốn cánh, một cảnh liền);
// album: sổ của Albie; gag: lại vườn, Miss Loupe đi lùi đụng Albie, câu hỏi, Zip lao tới lại như khung đầu (vòng lặp)
export const DUR = at(12);
// đỉnh "cánh trước lên cao nhất" trong soi chậm: chu kỳ 1,25 s (hai phách ở 96 BPM), trùng chữ "up" và "down" của L05
export const SLOW = { t0: 8.85, cyc: 1.25 };
export const HIT = {
  words: [0, .12],
  // móc: Zip lao tới (từ cuối phim), phanh kít trước kính; bay lùi; đứng yên; lao tới, phanh, lùi lần nữa; Miss Loupe hoa mắt
  brake: .42, back1: [.62, 1.45], dash2: [1.95, 2.2], brake2: 2.2, back2: [2.32, 2.78], dizzy: [2.45, 3.15], titleOut: [2.85, 3.2],
  // "Let's zoom in!" → kính lớn
  zoom: [4.25, 4.75],
  // trong kính: bay lùi; phanh; đứng yên (STILL!); quay mặt ra; soi chậm bốn cánh (mỗi nửa nhịp cánh một tiếng)
  lback: [5.55, 6.95], lbrake: 6.95, still: 7.15, turn: [7.3, 7.9], slow: [SLOW.t0, SLOW.t0 + .3],
  strokes: [0, 1, 2, 3, 4, 5].map(i => +(SLOW.t0 + .625 + i * .625).toFixed(3)).filter(t => t < 12.4), happy: 12.0,
  // chụp → match cut thành sticker → trang sổ
  snap: 12.55, zoomIn: [12.65, 12.95], zoomOut: [12.95, 13.3], stamp: 13.45,
  // sổ: Zip bay vào, đứng yên cho Albie đếm chân; lùi đuôi vào trang đúng chữ "go!"
  zipIn: [13.5, 14.0], counts: [14.0, 14.25, 14.5], reverse: [15.1, 15.55], gulp: 15.55, mini: 15.75,
  flip: [16.35, 16.85],
  // gag: "I can go backwards too!"; bước lùi "bíp bíp"; Albie trợn mắt; "bộp" vào góc sách; góc sách lấp lánh; cười đỏ mặt
  stepsBack: [18.75, 19.8], beeps: [18.85, 19.17, 19.49], notice: 18.95, bump: 19.8, glint: 20.75, giggle: 21.55,
  // câu hỏi kết; Albie nhảy ra; Zip bay lùi ngang khung ra phải; chữ móc trở lại; "rewind", Zip lao tới lại từ bên phải (khung đầu)
  albieOut: [21.7, 22.45], zipBack: [21.75, 23.15], recall: 22.95, spin: 23.45, loop: [23.45, at(12)],
};
export const SECS = [
  { id: 'garden', t0: 0, t1: HIT.zoomIn[0] },
  { id: 'album', t0: HIT.zoomIn[0], t1: HIT.flip[1] },
  { id: 'gag', t0: HIT.flip[1], t1: DUR },
];

// t: lúc bắt đầu nói (giây). dur: độ dài thật (voice/dur.json). who: giọng trong _shared/voices.js.
// L01 là câu móc trong 3 s đầu. asr: chữ Whisper viết (khác chữ hiện chỉ ở dấu gạch nối).
export const LINES = [
  { id: 'L01', who: 'loupe', t: .1, dur: 1.362, card: 1, text: 'Could you fly backwards?', pace: 1 },
  { id: 'L02', who: 'loupe', t: 3.3, dur: .999, card: 2, text: "Let's zoom in!", catch: true },
  { id: 'L03', who: 'loupe', t: 4.85, dur: 2.005, card: 3, text: 'Dragonflies can fly backwards!', pace: 1 },
  { id: 'L04', who: 'loupe', t: 7.05, dur: 1.782, card: 4, text: 'And stay still in the air!' },
  { id: 'L05', who: 'loupe', t: 9.35, dur: 2.507, card: 5, text: 'Front wings up, back wings down!' },
  { id: 'L06', who: 'albie', t: 13.75, dur: 2.297, card: 6, text: 'Six legs? In you go!', catch: true },
  { id: 'L07', who: 'loupe', t: 16.95, dur: 1.849, card: 7, text: 'I can go backwards too!' },
  { id: 'L08', who: 'albie', t: 20.0, dur: 1.537, card: 8, text: 'Watch the corners!', pace: 1 },
  { id: 'L09', who: 'loupe', t: 21.9, dur: 1.511, card: 9, text: 'Which way is Zip flying?', pace: 1 },   // câu hỏi kết cho trẻ: "Backwards!" (QUALITY.md §6)
];
// Tấm phụ đề: giữ ≥ 1,8 s và ≥ câu cuối + 0,6 s (DIRECTOR.md §7); không được chồng tấm sau. Chữ hiện dần theo câu đã nói.
export const CARDS = [...new Set(LINES.map(l => l.card))].map((k, i, ks) => {
  const ls = LINES.filter(l => l.card === k), t0 = ls[0].t, end = ls.at(-1).t + ls.at(-1).dur;
  const next = i + 1 < ks.length ? LINES.find(l => l.card === ks[i + 1]).t - .05 : DUR - .3;
  return { t0, t1: Math.min(next, DUR - .3, Math.max(t0 + 1.8, end + .6)), text: ls.map(l => l.text).join(' '), parts: ls.map(l => ({ t: l.t, text: l.text })) };
});
export const CARD_CLASHES = CARDS.filter((c, i) => i + 1 < CARDS.length && c.t1 > CARDS[i + 1].t0).map(c => c.text);

// 10 khung cho storyboard
export const BOARD = [
  { t: 0.0, shot: '1', frame: 'Medium, the garden path · loop frame', dur: '3.3 s', line: 'Could you fly backwards?' },
  { t: 1.0, shot: '1', frame: 'Medium · Zip flies tail first', dur: '3.3 s', line: '(zip! … rewind)' },
  { t: 2.8, shot: '1', frame: 'Medium · dizzy', dur: '3.3 s', line: '(again!)' },
  { t: 6.3, shot: '3', frame: 'Big lens: backwards', dur: '2.3 s', line: 'Dragonflies can fly backwards!' },
  { t: 8.2, shot: '4', frame: 'Big lens: still in mid-air', dur: '1.8 s', line: 'And stay still in the air!' },
  { t: 10.1, shot: '5', frame: 'Big lens: slow-mo, four wings', dur: '3.7 s', line: 'Front wings up, back wings down!' },
  { t: 14.4, shot: '7', frame: 'Album', dur: '2.9 s', line: 'Six legs? In you go!' },
  { t: 19.3, shot: '9', frame: 'Medium · walking backwards', dur: '3.0 s', line: 'I can go backwards too! (beep, beep)' },
  { t: 20.6, shot: '10', frame: 'Medium · bonk', dur: '1.8 s', line: 'Watch the corners!' },
  { t: 22.5, shot: '11', frame: 'Medium → loop', dur: '2.4 s', line: 'Which way is Zip flying?' },
];

// Sự kiện âm thanh, khớp với chuyển động trong film.js (core/render/events.mjs → events.json → mix.py). Bảng cue đầy đủ ở SOUND.md.
export const EV = [
  // móc: chữ bật; Zip lao tới (tiếng tới từ cuối phim, gấp về đầu), phanh kít; Miss Loupe giật mình; bay lùi; đứng yên; lần hai
  { t: 0, type: 'titlepop' },
  ...HIT.words.map((t, i) => ({ t, type: 'wordpop', n: i })),
  { t: HIT.brake - .02, type: 'brake', pan: .1 },
  { t: HIT.brake + .03, type: 'startle', pan: -.35 },
  { t: HIT.back1[0], type: 'reverse', d: HIT.back1[1] - HIT.back1[0], pan: .3 },
  { t: HIT.back1[1], type: 'hum', d: .5, pan: .45 },
  { t: HIT.dash2[0], type: 'dash', d: HIT.dash2[1] - HIT.dash2[0], pan: .3 },
  { t: HIT.brake2 - .02, type: 'brake', v: .7, pan: .1 },
  { t: HIT.back2[0], type: 'reverse', d: HIT.back2[1] - HIT.back2[0], v: .8, pan: .35 },
  { t: HIT.dizzy[0], type: 'dizzy', d: HIT.dizzy[1] - HIT.dizzy[0], pan: -.35 },
  // kính lớn
  { t: HIT.zoom[0], type: 'zoom' },
  // trong kính: bay lùi; chữ BACKWARDS!; phanh; đứng yên (STILL!); cánh rì rì; soi chậm; từng nhịp cánh
  { t: HIT.lback[0], type: 'reverse', d: HIT.lback[1] - HIT.lback[0], v: .55, pan: .2 },
  { t: 4.95, type: 'textpop', m: 79 },
  { t: HIT.lbrake, type: 'brake', v: .45, pan: .2 },
  { t: HIT.lbrake + .04, type: 'still', pan: .1 },
  { t: HIT.slow[0], type: 'slowmo', d: .5 },
  ...HIT.strokes.map((t, i) => ({ t, type: 'stroke', n: i, pan: i % 2 ? -.2 : .2 })),
  { t: HIT.happy, type: 'sparkle', pan: .2 },
  // chụp → sticker → sổ
  { t: HIT.snap, type: 'snap' },
  { t: HIT.zoomIn[0], type: 'zoomin', d: HIT.zoomIn[1] - HIT.zoomIn[0] },
  { t: HIT.zoomOut[0], type: 'zoomout', d: HIT.zoomOut[1] - HIT.zoomOut[0] },
  { t: HIT.zoomOut[1], type: 'page' },
  { t: HIT.stamp - .3, type: 'swipe', d: .3, lo: 1800, hi: 8000, pan: .7 },
  { t: HIT.stamp, type: 'stamp' },
  { t: HIT.stamp + .02, type: 'ding', m: 85 },
  // Zip bay vào, đứng yên; Albie đếm chân; Zip lùi đuôi vào trang đúng "go!"
  { t: HIT.zipIn[0], type: 'zip', d: .5, pan: .6 },
  ...HIT.counts.map((t, i) => ({ t, type: 'countA', n: i })),
  { t: HIT.reverse[0] - .08, type: 'reverse', d: HIT.reverse[1] - HIT.reverse[0] + .08, v: .45, pan: .3 },
  { t: HIT.gulp, type: 'gulp' },
  { t: HIT.mini, type: 'pops', n: 3, step: .06, m: 92, v: .35 },
  { t: HIT.flip[0], type: 'flip', d: HIT.flip[1] - HIT.flip[0] },
  // gag: bước lùi "bíp bíp"; Albie trợn mắt; "bộp"; sao nhỏ; góc sách lấp lánh; cười khúc khích
  { t: HIT.stepsBack[0], type: 'steps', d: HIT.stepsBack[1] - HIT.stepsBack[0], pan: -.2 },
  ...HIT.beeps.map((t, i) => ({ t, type: 'beep', n: i, pan: -.25 + .1 * i })),
  { t: HIT.notice, type: 'notice', pan: .3 },
  { t: HIT.bump, type: 'bonk', pan: .05 },
  { t: HIT.bump + .08, type: 'stars', pan: .1 },
  { t: HIT.glint, type: 'glint', pan: .3 },
  { t: HIT.giggle, type: 'giggle', pan: -.2 },
  // câu hỏi; Albie nhảy ra; Zip bay lùi ra phải; chữ móc trở lại; "rewind" và Zip lao tới (nối sang đầu phim)
  { t: HIT.albieOut[0], type: 'hop', pan: .4 }, { t: HIT.albieOut[0] + .38, type: 'hop', pan: .7 },
  { t: HIT.zipBack[0], type: 'reverse', d: HIT.zipBack[1] - HIT.zipBack[0], v: .5, pan: 0 },
  { t: HIT.recall, type: 'recall' },
  { t: HIT.spin, type: 'zipin', d: DUR - HIT.spin + .45, pan: .5 },
];
