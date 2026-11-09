// Một nguồn thời gian duy nhất cho hình, phụ đề, âm thanh. Tập A theo công thức 45 s (PHAN-TICH-SHORTS/KE-HOACH-NANG-CAP.md §3):
// 4/4 ở 120 BPM, 22 ô nhịp (mỗi ô 2 s) = 44 s, phát vòng lặp (khung cuối mở về khung đầu).
export const BPM = 120, BEAT = 60 / BPM, METER = 4, BAR = BEAT * METER;
export const at = (bar, beat = 0) => (bar * METER + beat) * BEAT;
export const PACE = 1;

export const DUR = at(22);
export const HIT = {
  words: [0, .12],
  // móc: Blink vụt qua sát mặt kính (đuôi nháy chùm), Miss Loupe giật nảy; Blink đáp xuống cỏ ba lá, quay ra máy, đuôi bùng sáng
  zip: [-.35, 1.15], burst: [-.05, .2, .45], startle: -.1, land: 1.15, turn: 1.45, flare: [2.1, 2.7], glint0: 2.45,
  titleOut: [2.55, 2.85], slots: 2.75, raise: 2.7,
  // logo 0,8 s lồng vào cú lao vào kính (titleSting)
  sting: [3.0, 3.8],
  // bí mật 1: kẹo dẻo trong ánh đèn đuôi không chín
  mallowIn: [4.6, 5.5], hold: [5.9, 8.0], ticks: [6.5, 6.9, 7.3], ask: 7.6, munch: 9.35,
  snap1: 9.9, fly1: [10.0, 10.55], stamp1: 10.6,
  // bí mật 2: bong bóng nghĩ con ruồi, khựng, "Nope!", Blink và Dot bật cánh
  bubble: [11.15, 11.45], hush: [12.35, 12.95], bubblePop: 12.97, dotIn: [13.3, 13.75], clack: [14.75, 15.5, 16.0, 16.6],
  snap2: 17.0, fly2: [17.1, 17.65], stamp2: 17.7,
  // bí mật 3: "No!" nhưng đuôi tự nháy; mật mã; đốm xa nháy đáp; cả vườn nháy theo nhịp dế
  away: 19.85, tattle: [20.5, 20.75, 21.0], code: [23.0, 23.3, 23.9], codeLong: .5, reply: [25.05, 25.5],
  wide: [25.2, 26.0], chirp: [26.0, 30.25], sync: [28.0, 28.5, 29.0, 29.5, 30.0], rollo: [27.0, 29.8],
  snap3: 30.35, zoomIn: [30.45, 30.75], zoomOut: [30.75, 31.1], stamp3: 31.25,
  // sổ: ô 1, 2 bay xuống trang; Blink bay vào; Albie đếm chân, há miệng; Blink lao vào trang đúng "go!"
  slotsDown: [31.1, 31.5], blinkIn: [31.55, 32.15], counts: [32.0, 32.2, 32.4], dive: [33.05, 33.5], gulp: 33.5, mini: 33.65,
  flip: [34.4, 34.9],
  // gag: ánh lóe trên kính, đốm sáng dưới cỏ nháy đáp
  glint1: 35.45, reply1: [35.85], glint2: 36.35, reply2: [36.75, 37.0], wink: 38.8, glint3: [38.85, 39.15, 39.45], reply3: [39.75, 40.0, 40.25], joy: [40.3, 41.0],
  recall: 42.3, lift: 42.4, loop: [43.1, at(22)],
};
// Cảnh của tập A (qa.py đọc 'title' để nhận ra tập A và 'album' để đo cảnh sổ)
export const SECS = [
  { id: 'hook', t0: 0, t1: HIT.sting[0] },
  { id: 'title', t0: HIT.sting[0], t1: HIT.sting[1] },      // logo 0,8 s lồng vào cú lao vào kính
  { id: 'cold', t0: HIT.sting[1], t1: HIT.stamp1 },          // bí mật 1
  { id: 'beetle', t0: HIT.stamp1, t1: HIT.stamp2 },          // bí mật 2, có "Nope!"
  { id: 'code', t0: HIT.stamp2, t1: HIT.zoomIn[0] },         // bí mật 3 và cảnh đặc trưng
  { id: 'album', t0: HIT.zoomIn[0], t1: HIT.flip[1] },
  { id: 'gag', t0: HIT.flip[1], t1: DUR },
];

// t: lúc bắt đầu nói (giây). dur: độ dài thật (voice/dur.json, sau voicefx.py). who: giọng trong _shared/voices.js. catch: câu cửa miệng.
export const LINES = [
  { id: 'L01', who: 'loupe', t: 0.1, dur: 1.163, card: 1, text: 'Could your tummy glow?' },
  { id: 'L02', who: 'blink', t: 1.5, dur: 0.931, card: 1, text: 'My tummy can!' },   // "Mine can!" bị nghe thành "Mine can't" / "Mine tends",
  { id: 'L03', who: 'loupe', t: 3.9, dur: 0.999, card: 2, text: "Let's zoom in!", catch: true },
  { id: 'L04', who: 'loupe', t: 5.35, dur: 1.712, card: 3, text: 'Fireflies make cold light!' },
  { id: 'L05', who: 'blink', t: 8.05, dur: 0.876, card: 4, text: 'Look! No fire!' },   // "No fire at all!" bị base.en nghe thành "No fire owls",
  { id: 'L06', who: 'loupe', t: 10.85, dur: 1.505, card: 5, text: 'Is a firefly a fly?' },
  { id: 'L07', who: 'loupe', t: 12.95, dur: 0.628, card: 5, text: 'Nope!', catch: true },
  { id: 'L08', who: 'blink', t: 13.7, dur: 0.962, card: 6, text: "I'm a little beetle!" },   // "I'm a beetle!" bị nghe thành "Beatles",
  { id: 'L09', who: 'loupe', t: 15.0, dur: 1.825, card: 6, text: 'See? Beetle wing cases!' },   // "Beetles have…" bị nghe thành "Beatles"; không nói "All beetles" (có con cái không cánh),
  { id: 'L10', who: 'loupe', t: 18.0, dur: 1.587, card: 7, text: 'Blink, any more secrets?' },
  { id: 'L11', who: 'blink', t: 19.85, dur: 0.51, card: 7, text: 'No!' },
  { id: 'L12', who: 'blink', t: 21.45, dur: 0.886, card: 8, text: 'Okay, yes.' },
  { id: 'L13', who: 'loupe', t: 22.6, dur: 2.292, card: 9, text: 'Some fireflies flash a secret code!' },
  { id: 'L14', who: 'blink', t: 27.0, dur: 0.929, card: 10, text: 'Light up, everyone!' },   // "All together now!" bị base.en nghe sai hẳn,
  { id: 'L15', who: 'albie', t: 31.55, dur: 2.297, card: 11, text: 'Six legs? In you go!', catch: true },
  { id: 'L16', who: 'loupe', t: 37.2, dur: 1.231, card: 12, text: 'Is it winking at me?' },
  { id: 'L17', who: 'loupe', t: 40.5, dur: 1.601, card: 13, text: 'Can YOU blink a secret code?' },   // câu hỏi kết cho trẻ (QUALITY.md §6)
];
// Tấm phụ đề: giữ ≥ 1,8 s và ≥ câu cuối + 0,6 s (DIRECTOR.md §7); không được chồng tấm sau. Chữ hiện dần theo câu đã nói.
export const CARDS = [...new Set(LINES.map(l => l.card))].map((k, i, ks) => {
  const ls = LINES.filter(l => l.card === k), t0 = ls[0].t, end = ls.at(-1).t + ls.at(-1).dur;
  const next = i + 1 < ks.length ? LINES.find(l => l.card === ks[i + 1]).t : DUR;
  return { t0, t1: Math.min(DUR, next, Math.max(t0 + 1.8, end + .6)), text: ls.map(l => l.text).join(' '), parts: ls.map(l => ({ t: l.t, text: l.text })) };
});
export const CARD_CLASHES = CARDS.filter((c, i) => i + 1 < CARDS.length && c.t1 > CARDS[i + 1].t0).map(c => c.text);

// 10 khung cho storyboard
export const BOARD = [
  { t: 0.3, shot: '1', frame: 'Medium · loop frame', dur: '3.0 s', line: 'Could your tummy glow?' },
  { t: 2.2, shot: '1', frame: 'Medium · tail flare', dur: '3.0 s', line: 'My tummy can!' },
  { t: 3.5, shot: '2', frame: 'Logo in the lens', dur: '0.8 s', line: '(BIG SECRETS of tiny bugs)' },
  { t: 7.2, shot: '4', frame: 'Big lens · marshmallow', dur: '3.6 s', line: 'Fireflies make cold light!' },
  { t: 12.0, shot: '5', frame: 'Big lens · thought bubble', dur: '2.9 s', line: 'Is a firefly a fly? Nope!' },
  { t: 14.7, shot: '6', frame: 'Big lens · wing cases', dur: '4.2 s', line: "I'm a little beetle! See? Beetle wing cases!" },
  { t: 20.8, shot: '7', frame: 'Big lens · the tail tells', dur: '4.7 s', line: 'No! … Okay, yes.' },
  { t: 28.6, shot: '9', frame: 'Wide · the garden flashes', dur: '5.2 s', line: 'Light up, everyone!' },
  { t: 33.6, shot: '11', frame: 'Album', dur: '3.8 s', line: 'Six legs? In you go!' },
  { t: 39.9, shot: '13', frame: 'Medium · the wink', dur: '4.6 s', line: 'Is it winking at me?' },
];

// Sự kiện âm thanh, khớp với chuyển động trong film.js (core/render/events.mjs → events.json → mix.py). Bảng cue đầy đủ ở SOUND.md.
// Tiếng nằm dưới lời thì ở dải cao và nhỏ (hoặc dải trầm); mỗi chuyển cảnh một tiếng riêng.
export const EV = [
  // móc
  { t: 0, type: 'titlepop' },
  ...HIT.words.map((t, i) => ({ t, type: 'wordpop', n: i })),
  { t: 0, type: 'zip', d: .6, pan: .5 },
  ...HIT.burst.filter(t => t >= 0).map((t, i) => ({ t, type: 'flash', m: [91, 94, 98][i + 1] || 91, v: .5, pan: .3 })),
  { t: .05, type: 'startle', pan: -.3 },
  { t: HIT.land, type: 'land', pan: .2 },
  { t: HIT.turn, type: 'turn', pan: .2 },
  { t: HIT.flare[0], type: 'flare', pan: .2 },
  { t: HIT.glint0, type: 'glint', pan: -.4 },
  { t: HIT.slots, type: 'slots' },
  // logo
  { t: HIT.sting[0], type: 'zoom' },
  { t: HIT.sting[0] + .1, type: 'logo' },
  // bí mật 1
  { t: HIT.mallowIn[0], type: 'steps', d: HIT.mallowIn[1] - HIT.mallowIn[0], n: 7, pan: -.5 },
  ...HIT.ticks.map((t, i) => ({ t, type: 'tick', n: i, pan: -.1 })),
  { t: HIT.ask, type: 'huh', pan: -.3 },
  { t: HIT.munch, type: 'munch', pan: -.3 },
  { t: HIT.snap1, type: 'snap' }, { t: HIT.snap1 + .03, type: 'glint', pan: -.2 },
  { t: HIT.fly1[0], type: 'swipe', d: HIT.fly1[1] - HIT.fly1[0], lo: 1800, hi: 7000, pan: -.4 },
  { t: HIT.stamp1, type: 'slotstamp', n: 0, pan: -.3 },
  // bí mật 2
  { t: HIT.bubble[0], type: 'bubble', pan: -.3 },
  { t: HIT.hush[0], type: 'hush', d: HIT.hush[1] - HIT.hush[0] },
  { t: HIT.bubblePop, type: 'pop', pan: -.3 },
  { t: HIT.dotIn[0], type: 'hop', pan: -.4 },
  { t: HIT.dotIn[1], type: 'land', pan: -.3 },
  ...HIT.clack.map((t, i) => ({ t, type: 'clack', n: i, pan: [.3, -.3][i % 2] * .5 })),
  { t: HIT.snap2, type: 'snap' }, { t: HIT.snap2 + .03, type: 'glint', pan: -.2 },
  { t: HIT.fly2[0], type: 'swipe', d: HIT.fly2[1] - HIT.fly2[0], lo: 1800, hi: 7000, pan: 0 },
  { t: HIT.stamp2, type: 'slotstamp', n: 1, pan: 0 },
  // bí mật 3
  { t: HIT.away, type: 'turn', pan: .2 },
  ...HIT.tattle.map((t, i) => ({ t, type: 'flash', m: 96 + 2 * i, v: .6, pan: .2 })),
  { t: HIT.tattle[2] + .3, type: 'blush', pan: .2 },
  ...HIT.code.map((t, i) => ({ t, type: 'code', m: i < 2 ? 93 : 89, d: i < 2 ? .18 : HIT.codeLong, pan: .2 })),
  ...HIT.reply.map((t, i) => ({ t, type: 'reply', m: [84, 86][i], pan: .6 })),
  { t: HIT.wide[0], type: 'swish', d: .7, v: .3, lo: 500, hi: 3000, up: false },
  { t: HIT.rollo[0], type: 'roll', d: HIT.rollo[1] - HIT.rollo[0], pan: .5 },   // trứng phục sinh: Rollo lăn ngang mặt trăng
  ...HIT.sync.map((t, i) => ({ t, type: 'sync', n: i })),
  { t: HIT.snap3, type: 'snap' },
  { t: HIT.zoomIn[0], type: 'zoomin', d: HIT.zoomIn[1] - HIT.zoomIn[0] },
  { t: HIT.zoomOut[0], type: 'zoomout', d: HIT.zoomOut[1] - HIT.zoomOut[0] },
  { t: HIT.zoomOut[1], type: 'page' },
  { t: HIT.stamp3, type: 'stamp' }, { t: HIT.stamp3 + .02, type: 'ding', m: 89 },
  // sổ
  { t: HIT.slotsDown[0], type: 'swipe', d: .4, lo: 1500, hi: 6000, pan: 0 },
  { t: HIT.slotsDown[1], type: 'slotstamp', n: 2, pan: -.2 },
  { t: HIT.blinkIn[0], type: 'zip', d: .5, pan: .6 },
  ...HIT.counts.map((t, i) => ({ t, type: 'count', n: i, pan: .1 })),
  { t: HIT.dive[0], type: 'jump', pan: .2 },
  { t: HIT.gulp, type: 'gulp', pan: -.2 },
  { t: HIT.mini, type: 'pops', n: 3, step: .06, m: 91, v: .35 },
  { t: HIT.flip[0], type: 'flip', d: HIT.flip[1] - HIT.flip[0] },
  // gag
  ...[HIT.glint1, HIT.glint2, ...HIT.glint3].map((t, i) => ({ t, type: 'glint', n: i, pan: -.3 })),
  ...[...HIT.reply1, ...HIT.reply2, ...HIT.reply3].map((t, i) => ({ t, type: 'reply', m: 86 + (i % 3) * 2, pan: .5 })),
  { t: HIT.wink - .05, type: 'wink', pan: -.3 },
  { t: HIT.joy[0], type: 'zip', d: .5, pan: .4 },
  { t: HIT.recall, type: 'recall' },
  { t: HIT.lift, type: 'flash', m: 98, v: .5, pan: .2 },
  { t: HIT.loop[0], type: 'glowiris' },                        // đốm sáng phình thành vòng tròn, mở về khung đầu đúng điểm lặp
];
