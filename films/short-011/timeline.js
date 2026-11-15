// Một nguồn thời gian duy nhất cho hình, phụ đề, âm thanh. Bản B: lưới phim 4/4 ở 120 BPM, 11 ô nhịp (mỗi ô 2 s) = 22 s, phát vòng lặp liền mạch.
export const BPM = 120, BEAT = 60 / BPM, METER = 4, BAR = BEAT * METER;
export const at = (bar, beat = 0) => (bar * METER + beat) * BEAT;
export const PACE = .85;   // lời dẫn chậm hơn tập A khoảng 15% (kế hoạch §4.3); câu móc, câu hỏi cuối và câu của Crumb giữ tốc độ chuẩn (pace: 1)

// garden: khu vườn buổi chiều (móc: Crumb rón rén giơ biển BOO! sau lưng Zip) · split: khung chia đôi "Crumb thấy" | "Zip thấy"
// album: sổ của Albie · gag: lại khu vườn, Zip quay lại trước, Crumb tự giật mình, câu hỏi, vòng lặp
export const DUR = at(11);
export const HIT = {
  words: [0, .12],
  // móc: Crumb rón rén (mỗi bước một phách), giẫm lá khô "rắc" → đứng sững một chân, lắc lư; Zip vẫn đậu yên (đuôi giật nhẹ: chi tiết xem lại)
  steps: [.25, .75, 1.25, 1.75], crunch: 1.98, wobble: [1.98, 2.7], grin: 2.25, titleOut: [3.0, 3.35],
  // khoá kéo tách khung: "CRUMB SEES" | "ZIP SEES"
  split: [3.85, 4.35],
  // mắt Zip mở, tầm nhìn nở rộng ra gần trọn vòng, Crumb trượt vào khung bên phải; vòng "bị thấy rồi!"
  open: [6.6, 6.95], wide: [6.9, 7.9], spot: 8.2,
  // "Oh no!" → Crumb nấp sau tấm biển (vẫn bị thấy); hai vòm mắt sáng, vệt sáng chạy quanh tầm nhìn
  hide: [9.65, 9.95], glow: [10.3, 12.9], sweep: [10.8, 12.3], peek: 12.55,
  // chụp → match cut thành sticker → trang sổ
  snap: 13.25, zoomIn: [13.35, 13.65], zoomOut: [13.65, 14.0], stamp: 14.15,
  // sổ: Zip bay vào; Albie đếm chân, "đớp" đúng chữ "go!" khi Zip lao vào trang
  zipIn: [14.25, 14.75], counts: [14.65, 14.9, 15.15], dive: [16.25, 16.65], gulp: 16.65, mini: 16.85,
  flip: [17.0, 17.45],
  // gag: Crumb rón rén lại gần, hít hơi; Zip quay lại TRƯỚC; Crumb giật mình nhảy bật, tấm biển bay vèo (mặt sau "hi!"), ngã ngồi lên đệm cỏ ba lá, biển đáp lên đầu như mũ
  sneak2: [17.45, 18.0], inhale: 18.0, turn: [18.05, 18.3], jump: 18.4, land: 18.88, hat: 19.12,
  // câu hỏi kết; vòng lặp: Zip quay lưng lại, Crumb đứng dậy, giơ biển, rón rén về đúng khung đầu
  turnBack: [20.55, 20.95], getUp: [20.5, 21.0], recall: 20.95, loop: [21.1, at(11)],
};
export const SECS = [
  { id: 'garden', t0: 0, t1: HIT.split[0] },
  { id: 'split', t0: HIT.split[0], t1: HIT.zoomIn[0] },
  { id: 'album', t0: HIT.zoomIn[0], t1: HIT.flip[1] },
  { id: 'gag', t0: HIT.flip[1], t1: DUR },
];

// t: lúc bắt đầu nói (giây). dur: độ dài thật (voice/dur.json, sau voicefx.py). who: giọng trong _shared/voices.js.
export const LINES = [
  { id: 'L01', who: 'loupe', t: .1, dur: 1.832, card: 1, text: 'Can you sneak up on a dragonfly?', pace: 1 },
  { id: 'L02', who: 'crumb', t: 2.25, dur: 1.495, card: 1, text: "From behind, it can't see me!", pace: 1 },
  { id: 'L03', who: 'loupe', t: 4.45, dur: 1.988, card: 2, text: 'Crumb only sees its back.' },
  { id: 'L04', who: 'loupe', t: 7.05, dur: 1.765, card: 3, text: 'But Zip can see Crumb!' },
  { id: 'L05', who: 'crumb', t: 8.95, dur: .679, card: 3, text: 'Oh no!', pace: 1 },
  { id: 'L06', who: 'loupe', t: 10.25, dur: 2.607, card: 4, text: 'Its big eyes see almost all around!' },
  { id: 'L07', who: 'albie', t: 14.4, dur: 2.297, card: 5, text: 'Six legs? In you go!', catch: true },
  { id: 'L08', who: 'crumb', t: 19.05, dur: 1.289, card: 6, text: 'Oh! I scared myself!', pace: 1 },
  { id: 'L09', who: 'loupe', t: 20.45, dur: 1.425, card: 6, text: 'Can YOU sneak up on Zip?', pace: 1 },   // câu hỏi kết cho trẻ: "No!" (QUALITY.md §6)
];
// Tấm phụ đề: giữ ≥ 1,8 s và ≥ câu cuối + 0,6 s (DIRECTOR.md §7); không được chồng tấm sau. Chữ hiện dần theo câu đã nói.
export const CARDS = [...new Set(LINES.map(l => l.card))].map(k => {
  const ls = LINES.filter(l => l.card === k), t0 = ls[0].t, end = ls.at(-1).t + ls.at(-1).dur;
  const cap = k === 1 ? HIT.split[0] + .35 : DUR - .3;   // tấm 1 (ba dòng) tắt trước khi khoá kéo mở tới đáy khung: không đè đường chia
  return { t0, t1: Math.min(cap, Math.max(t0 + 1.8, end + .6)), text: ls.map(l => l.text).join(' '), parts: ls.map(l => ({ t: l.t, text: l.text })) };
});
export const CARD_CLASHES = CARDS.filter((c, i) => i + 1 < CARDS.length && c.t1 > CARDS[i + 1].t0).map(c => c.text);

// 10 khung cho storyboard
export const BOARD = [
  { t: 0.3, shot: '1', frame: 'Medium, the garden · loop frame', dur: '3.85 s', line: 'Can you sneak up on a dragonfly?' },
  { t: 2.3, shot: '1', frame: 'Medium · crunch! Crumb freezes', dur: '3.85 s', line: "From behind, it can't see me!" },
  { t: 4.1, shot: '2', frame: 'Zipper splits the frame', dur: '0.5 s', line: '(zzzip!)' },
  { t: 5.6, shot: '3', frame: 'Split · CRUMB SEES (Zip\'s back)', dur: '2.2 s', line: 'Crumb only sees its back.' },
  { t: 8.5, shot: '4', frame: 'ZIP SEES: eye opens, widens', dur: '2.4 s', line: 'But Zip can see Crumb!' },
  { t: 11.6, shot: '5', frame: 'Split · eyes glow, sweep', dur: '3.3 s', line: 'Its big eyes see almost all around!' },
  { t: 15.4, shot: '7', frame: 'Album', dur: '3.0 s', line: 'Six legs? In you go!' },
  { t: 18.55, shot: '9', frame: 'Zip turns first · EEK!', dur: '1.4 s', line: '(boing!)' },
  { t: 19.6, shot: '9', frame: 'Sign lands like a hat', dur: '1.4 s', line: 'Oh! I scared myself!' },
  { t: 21.2, shot: '10', frame: 'Medium → loop', dur: '1.5 s', line: 'Can YOU sneak up on Zip?' },
];

// Sự kiện âm thanh, khớp với chuyển động trong film.js (core/render/events.mjs → events.json → mix.py). Bảng cue đầy đủ ở SOUND.md.
export const EV = [
  // móc: chữ bật; Crumb nhón từng bước; giẫm lá khô "rắc"; lắc lư; Zip giật đuôi; cười trừ
  { t: 0, type: 'titlepop' },
  ...HIT.words.map((t, i) => ({ t, type: 'wordpop', n: i })),
  { t: .02, type: 'tiptoe', pan: -.4 },
  ...HIT.steps.map((t, i) => ({ t, type: 'tiptoe', n: i, pan: -.35 })),
  { t: HIT.crunch, type: 'crunch', pan: -.3 },
  { t: HIT.crunch + .06, type: 'wobble', d: .6, pan: -.3 },
  { t: HIT.crunch + .12, type: 'twitch', pan: .05 },
  { t: HIT.grin, type: 'sheepish', pan: -.3 },
  { t: HIT.titleOut[0], type: 'titleout' },
  // khoá kéo tách khung
  { t: HIT.split[0], type: 'zipper', d: HIT.split[1] - HIT.split[0] },
  { t: HIT.split[1], type: 'panels' },
  // mắt Zip mở, tầm nhìn nở rộng, Crumb trượt vào; bị thấy rồi!
  { t: HIT.open[0], type: 'eyeopen', pan: .4 },
  { t: HIT.wide[0], type: 'widen', d: HIT.wide[1] - HIT.wide[0], pan: .4 },
  { t: HIT.spot, type: 'spot', pan: .2 },
  // "Oh no!" → nấp sau biển; hai vòm mắt sáng; vệt sáng chạy quanh; Crumb ló ra vẫy
  { t: HIT.hide[0], type: 'hide', pan: .2 },
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
  // Zip bay vào, Albie đếm chân, lao vào trang đúng "go!"
  { t: HIT.zipIn[0], type: 'zip', d: .5, pan: .6 },
  ...HIT.counts.map((t, i) => ({ t, type: 'countA', n: i })),
  { t: HIT.dive[0], type: 'jump', pan: .2 },
  { t: HIT.gulp, type: 'gulp' },
  { t: HIT.mini, type: 'pops', n: 3, step: .06, m: 90, v: .35 },
  { t: HIT.flip[0], type: 'flip', d: HIT.flip[1] - HIT.flip[0] },
  // gag: rón rén lần nữa; hít hơi; Zip quay lại trước "zip!"; Crumb giật mình nhảy bật; biển bay vèo; ngã ngồi lên đệm cỏ; biển đáp lên đầu
  ...[17.55, 17.8].map((t, i) => ({ t, type: 'tiptoe', n: i + 4, pan: -.3 })),
  { t: HIT.inhale, type: 'inhale', pan: -.25 },
  { t: HIT.turn[0], type: 'zipturn', d: HIT.turn[1] - HIT.turn[0], pan: 0 },
  { t: HIT.jump, type: 'startle', pan: -.25 },
  { t: HIT.jump + .04, type: 'signfly', d: HIT.hat - HIT.jump - .04, pan: -.3 },
  { t: HIT.land, type: 'plop', pan: -.4 },
  { t: HIT.hat, type: 'hat', pan: -.4 },
  { t: 19.75, type: 'giggle', pan: .05 },
  // câu hỏi; vòng lặp: Zip quay lưng, Crumb đứng dậy, chữ móc trở lại, rón rén về khung đầu
  { t: HIT.turnBack[0], type: 'zipturn', d: HIT.turnBack[1] - HIT.turnBack[0], v: .6, pan: 0 },
  { t: HIT.getUp[0] + .1, type: 'getup', pan: -.4 },
  { t: HIT.recall, type: 'recall' },
  { t: 21.5, type: 'tiptoe', n: 6, pan: -.4 },
];
