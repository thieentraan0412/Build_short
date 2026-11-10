// Một nguồn thời gian duy nhất cho hình, phụ đề, âm thanh. Tập A theo công thức 45 s (PHAN-TICH-SHORTS/KE-HOACH-NANG-CAP.md §3):
// lưới 4/4 ở 120 BPM, 22 ô nhịp (mỗi ô 2 s) = 44 s, phát vòng lặp: cả phim là một sân khấu bờ ao, cuối phim mọi thứ về đúng khung đầu.
export const BPM = 120, BEAT = 60 / BPM, METER = 4, BAR = BEAT * METER;
export const at = (bar, beat = 0) => (bar * METER + beat) * BEAT;
export const PACE = 1;

export const DUR = at(22);
export const HIT = {
  words: [0, .12],
  // móc: Crumb rón rén sau lưng Miss Loupe; con ngươi của Zip trượt ra sau vòm mắt; Zip vụt lên; Crumb giật mình ngã ngồi
  tip: [-.4, 0, .4, .8], peek: 1.0, zipUp: [1.38, 1.85], startle: 1.42, sit: 1.72, turn: [1.95, 2.3],
  titleOut: [2.55, 2.85], slots: 2.75, raise: 2.7,
  // logo 0,8 s lồng vào cú lao vào kính (titleSting)
  sting: [3.0, 3.8],
  // bí mật 1: hai vòm mắt chiếm gần hết đầu; vòng nhìn; Crumb đi một vòng, con ngươi theo mãi
  eyesGlow: [5.15, 6.7], seam: [6.0, 6.6], ring: [7.2, 7.95], walk: [7.45, 9.45], caught: 9.5,
  snap1: 9.95, fly1: [10.05, 10.55], stamp1: 10.6,
  // bí mật 2: "Can I sneak up on it?" rón rén, khựng, vồ — "Nope!" — Zip bay lùi; bay tới, bay lùi, đứng yên giữa trời
  sneak: [10.7, 12.1], hush: [12.15, 12.8], pounce: 12.75, back1: [12.85, 13.35], flop: 13.1,
  fwd: [14.05, 14.5], back2: [14.65, 15.1], hover: [15.35, 17.1], reach: 16.2, settle: [17.15, 17.6],
  snap2: 16.95, fly2: [17.05, 17.6], stamp2: 17.7,
  // bí mật 3 và cảnh đặc trưng: kính đẩy vào vòm mắt, phình ra phủ cả khung; tổ ong; Crumb ló vào; hình phản chiếu ở mỗi ô
  dive: [17.85, 19.6], grid: [18.5, 19.4], k1000: [19.25, 21.3], crumbUp: [20.2, 20.75], refl: [20.4, 21.4],
  wave: [21.4, 23.3], side: [23.35, 24.55], tongue: [24.55, 25.35], out: [25.15, 26.1],
  laugh: [26.9, 28.1], snap3: 28.3, zoomIn: [28.4, 28.7], zoomOut: [28.7, 29.05], stamp3: 29.2,
  // sổ: ô 1, 2 bay xuống trang; Zip bay lùi vào; Albie đếm chân, há miệng; Zip lao vào trang đúng "go!"
  slotsDown: [29.05, 29.45], zipIn: [29.45, 30.0], counts: [30.0, 30.2, 30.4], plunge: [31.05, 31.5], gulp: 31.5, mini: 31.65,
  flip: [32.35, 32.85],
  // gag: "Can I hold the lens now?" — "Not yet!"; rón rén tới cỏ nến; Zip bay lùi ra khung phải; "One, two, three, boo!"; Zip vào lại từ khung trái
  lensUp: [34.75, 35.1], pout: [35.6, 36.3], notice: 36.3, tiptoe: [36.5, 38.0], zipOut: [37.7, 38.2], puzzled: [38.2, 38.8],
  count3: [38.9, 39.25, 39.55], boo: 39.8, zipBack: [39.3, 39.8], tap: 40.02, jump: 40.08, fall: 40.5, giggle: [40.6, 41.3],
  // về khung đầu: Crumb chạy ra sau lưng Miss Loupe rồi lại rón rén; Zip đáp lên vành kính
  home: [41.2, 42.85], land: [42.6, 43.45], recall: 42.9, loop: [43.3, at(22)],
  // trứng phục sinh ở gag: Waggle bay ngang trời, Mr. Rollo lăn viên tròn trên bờ ao xa
  waggle: [33.0, 37.4], rollo: [36.4, 39.2],
};
// Cảnh của tập A (qa.py đọc 'title' để nhận ra tập A và 'album' để đo cảnh sổ)
export const SECS = [
  { id: 'hook', t0: 0, t1: HIT.sting[0] },
  { id: 'title', t0: HIT.sting[0], t1: HIT.sting[1] },      // logo 0,8 s lồng vào cú lao vào kính
  { id: 'eyes', t0: HIT.sting[1], t1: HIT.stamp1 },          // bí mật 1
  { id: 'backwards', t0: HIT.stamp1, t1: HIT.stamp2 },       // bí mật 2, có "Nope!"
  { id: 'facets', t0: HIT.stamp2, t1: HIT.zoomIn[0] },       // bí mật 3 và cảnh đặc trưng
  { id: 'album', t0: HIT.zoomIn[0], t1: HIT.flip[1] },
  { id: 'gag', t0: HIT.flip[1], t1: DUR },
];

// t: lúc bắt đầu nói (giây). dur: độ dài thật (voice/dur.json, sau voicefx.py). who: giọng trong _shared/voices.js. catch: câu cửa miệng.
export const LINES = [
  { id: 'L01', who: 'loupe', t: 0.05, dur: 1.541, card: 1, text: 'Could you see behind your head?' },
  { id: 'L02', who: 'crumb', t: 1.66, dur: 1.269, card: 1, text: 'Hey! How did it see me?' },   // "It saw me!" bị nghe thành "And it's all me" / "And it's on me"
  { id: 'L03', who: 'loupe', t: 3.9, dur: 0.999, card: 2, text: "Let's zoom in!", catch: true },
  { id: 'L04', who: 'loupe', t: 5.1, dur: 1.884, card: 3, text: 'Its eyes cover most of its head!' },
  { id: 'L05', who: 'loupe', t: 7.3, dur: 1.751, card: 4, text: 'So it sees almost all around!' },
  { id: 'L06', who: 'crumb', t: 10.75, dur: 1.368, card: 5, text: 'Can I sneak up on it?' },
  { id: 'L07', who: 'loupe', t: 12.85, dur: 0.628, card: 5, text: 'Nope!', catch: true },
  { id: 'L08', who: 'loupe', t: 13.95, dur: 1.678, card: 6, text: 'It can even fly backwards!' },
  { id: 'L09', who: 'loupe', t: 17.85, dur: 2.222, card: 7, text: 'Each eye has thousands of tiny eyes!' },
  { id: 'L10', who: 'crumb', t: 21.4, dur: 1.094, card: 8, text: 'Hi, everybody!' },
  { id: 'L11', who: 'loupe', t: 25.55, dur: 1.343, card: 9, text: "That's a lot of Crumbs!" },
  { id: 'L12', who: 'albie', t: 29.55, dur: 2.297, card: 10, text: 'Six legs? In you go!', catch: true },
  { id: 'L13', who: 'crumb', t: 33.1, dur: 1.478, card: 11, text: 'Can I hold the lens now?' },
  { id: 'L14', who: 'loupe', t: 34.8, dur: 0.828, card: 11, text: 'Not yet!' },
  { id: 'L15', who: 'crumb', t: 38.85, dur: 1.172, card: 12, text: 'One, two, three, boo!' },   // "Boo!" một mình bị nghe thành "A-boo" / "Hello"
  { id: 'L16', who: 'loupe', t: 41.45, dur: 1.592, card: 13, text: "Can YOU see who's behind me?" },   // câu hỏi kết cho trẻ (QUALITY.md §6)
];
// Tấm phụ đề: giữ ≥ 1,8 s và ≥ câu cuối + 0,6 s (DIRECTOR.md §7); không chồng tấm sau; tấm cuối tắt trước điểm lặp. Chữ hiện dần theo câu đã nói.
export const CARDS = [...new Set(LINES.map(l => l.card))].map((k, i, ks) => {
  const ls = LINES.filter(l => l.card === k), t0 = ls[0].t, end = ls.at(-1).t + ls.at(-1).dur;
  const next = i + 1 < ks.length ? LINES.find(l => l.card === ks[i + 1]).t : DUR - .3;
  return { t0, t1: Math.min(DUR - .3, next, Math.max(t0 + 1.8, end + .6)), text: ls.map(l => l.text).join(' '), parts: ls.map(l => ({ t: l.t, text: l.text })) };
});
export const CARD_CLASHES = CARDS.filter((c, i) => i + 1 < CARDS.length && c.t1 > CARDS[i + 1].t0).map(c => c.text);

// 10 khung cho storyboard
export const BOARD = [
  { t: 0.3, shot: '1', frame: 'Medium · loop frame', dur: '3.0 s', line: 'Could you see behind your head?' },
  { t: 2.3, shot: '1', frame: 'Medium · Zip saw Crumb', dur: '3.0 s', line: 'Hey! How did it see me?' },
  { t: 3.5, shot: '2', frame: 'Logo in the lens', dur: '0.8 s', line: '(BIG SECRETS of tiny bugs)' },
  { t: 8.6, shot: '4', frame: 'Big lens · eyes all around', dur: '3.4 s', line: 'So it sees almost all around!' },
  { t: 13.3, shot: '5', frame: 'Big lens · Nope! backwards', dur: '3.0 s', line: 'Can I sneak up on it? Nope!' },
  { t: 16.0, shot: '6', frame: 'Big lens · hovering', dur: '4.1 s', line: 'It can even fly backwards!' },
  { t: 22.2, shot: '8', frame: 'Full frame · 1000s of eyes', dur: '3.4 s', line: 'Hi, everybody!' },
  { t: 31.2, shot: '12', frame: 'Album', dur: '3.9 s', line: 'Six legs? In you go!' },
  { t: 37.8, shot: '15', frame: 'Medium · Zip backs out', dur: '4.3 s', line: '(tiptoe)' },
  { t: 40.25, shot: '15', frame: 'Medium · BOO!', dur: '4.3 s', line: 'One, two, three, boo!' },
];

// Sự kiện âm thanh, khớp với chuyển động trong film.js (core/render/events.mjs → events.json → mix.py). Bảng cue đầy đủ ở SOUND.md.
// Tiếng nằm dưới lời thì ở dải cao và nhỏ (hoặc dải trầm); mỗi chuyển cảnh một tiếng riêng.
const TIPS = (t0, t1, step) => { const o = []; for (let t = t0; t < t1 - .01; t += step) o.push(+t.toFixed(3)); return o; };
export const STEPS = {
  hook: [0, .4, .8, 1.2],
  walk: TIPS(HIT.walk[0], HIT.walk[1], .4), sneak: TIPS(HIT.sneak[0] + .1, HIT.sneak[1], .45),
  tiptoe: TIPS(HIT.tiptoe[0], HIT.tiptoe[1], .375), home: TIPS(42.95, DUR, .4),
};
export const EV = [
  // móc
  { t: 0, type: 'titlepop' },
  ...HIT.words.map((t, i) => ({ t, type: 'wordpop', n: i })),
  ...STEPS.hook.map((t, i) => ({ t, type: 'tiptoe', n: i, pan: -.3 })),
  { t: HIT.peek, type: 'peek', pan: .1 },
  { t: HIT.zipUp[0], type: 'zip', d: .5, up: 1, pan: .1 },
  { t: HIT.startle, type: 'startle', pan: -.3 },
  { t: HIT.sit, type: 'bump', pan: -.3 },
  { t: HIT.turn[0], type: 'turn', pan: .1 },
  { t: HIT.slots, type: 'slots' },
  // logo
  { t: HIT.sting[0], type: 'zoom' },
  { t: HIT.sting[0] + .1, type: 'logo' },
  // bí mật 1
  { t: HIT.eyesGlow[0] + .3, type: 'shine', pan: .2 },
  { t: HIT.seam[0], type: 'sparkle', pan: .2 },
  { t: HIT.ring[0], type: 'ring', d: HIT.ring[1] - HIT.ring[0] },
  ...STEPS.walk.map((t, i) => ({ t, type: 'tiptoe', n: i, pan: Math.sin(i * .9) * .5, v: .7 })),
  ...[8.05, 8.65, 9.25].map((t, i) => ({ t, type: 'peek', n: i, pan: .2 })),
  { t: HIT.caught, type: 'giggle', pan: .1 },
  { t: HIT.snap1, type: 'snap' },
  { t: HIT.fly1[0], type: 'swipe', d: HIT.fly1[1] - HIT.fly1[0], lo: 1800, hi: 7000, pan: -.4 },
  { t: HIT.stamp1, type: 'slotstamp', n: 0, pan: -.3 },
  // bí mật 2
  ...STEPS.sneak.map((t, i) => ({ t, type: 'tiptoe', n: i, pan: -.3, v: .55 })),
  { t: HIT.hush[0], type: 'hush', d: HIT.hush[1] - HIT.hush[0] },
  { t: HIT.pounce, type: 'jump', pan: -.2 },
  { t: HIT.back1[0] + .02, type: 'zip', d: .45, up: 0, pan: .4 },
  { t: HIT.flop, type: 'flop', pan: -.1 },
  { t: HIT.fwd[0], type: 'zip', d: .4, up: 1, pan: -.2 },
  { t: HIT.back2[0], type: 'zip', d: .4, up: 0, pan: .3 },
  { t: HIT.hover[0], type: 'hover', d: HIT.hover[1] - HIT.hover[0], pan: .1 },
  { t: HIT.reach, type: 'hop', pan: 0 },
  { t: HIT.snap2, type: 'snap' },
  { t: HIT.fly2[0], type: 'swipe', d: HIT.fly2[1] - HIT.fly2[0], lo: 1800, hi: 7000, pan: 0 },
  { t: HIT.stamp2, type: 'slotstamp', n: 1, pan: 0 },
  // bí mật 3
  { t: HIT.dive[0], type: 'dive', d: HIT.dive[1] - HIT.dive[0] },
  { t: HIT.grid[0], type: 'facets', d: HIT.grid[1] - HIT.grid[0] },
  { t: HIT.k1000[0], type: 'pop', pan: .3 },
  { t: HIT.crumbUp[0], type: 'popup', pan: -.4 },
  { t: HIT.refl[0], type: 'reflect', d: HIT.refl[1] - HIT.refl[0] },
  { t: HIT.wave[0] + .55, type: 'wave', d: 1.4 },
  { t: 22.75, type: 'giggle', m: 98, v: .7, pan: .2 },                            // nghìn Crumb tí hon cười khúc khích (tiếng nhỏ, cao)
  ...TIPS(HIT.side[0], HIT.side[1], .4).map((t, i) => ({ t, type: 'tiptoe', n: i, pan: .2, v: 1.1 })),
  { t: HIT.tongue[0], type: 'raspberry', pan: -.2 },
  { t: HIT.out[0], type: 'zoomback', d: HIT.out[1] - HIT.out[0] },
  { t: HIT.laugh[0], type: 'giggle', pan: .1 },
  { t: HIT.snap3, type: 'snap' },
  { t: HIT.zoomIn[0], type: 'zoomin', d: HIT.zoomIn[1] - HIT.zoomIn[0] },
  { t: HIT.zoomOut[0], type: 'zoomout', d: HIT.zoomOut[1] - HIT.zoomOut[0] },
  { t: HIT.zoomOut[1], type: 'page' },
  { t: HIT.stamp3, type: 'stamp' }, { t: HIT.stamp3 + .02, type: 'ding', m: 87 },
  // sổ
  { t: HIT.slotsDown[0], type: 'swipe', d: .4, lo: 1500, hi: 6000, pan: 0 },
  { t: HIT.slotsDown[1], type: 'slotstamp', n: 2, pan: -.2 },
  { t: HIT.zipIn[0], type: 'zip', d: .5, up: 0, pan: .6 },
  ...HIT.counts.map((t, i) => ({ t, type: 'count', n: i, pan: .1 })),
  { t: HIT.plunge[0], type: 'jump', pan: .2 },
  { t: HIT.gulp, type: 'gulp', pan: -.2 },
  { t: HIT.mini, type: 'pops', n: 3, step: .06, m: 91, v: .35 },
  { t: HIT.flip[0], type: 'flip', d: HIT.flip[1] - HIT.flip[0] },
  // gag
  { t: HIT.lensUp[0], type: 'swish', d: .35, v: .25, lo: 900, hi: 4000, up: true },
  { t: HIT.rollo[0], type: 'roll', d: HIT.rollo[1] - HIT.rollo[0], pan: .4 },   // trứng phục sinh: Rollo lăn trên bờ xa
  { t: HIT.pout[0], type: 'deflate', pan: -.2 },
  { t: HIT.notice, type: 'ding', m: 96, v: .3, pan: -.1 },
  ...STEPS.tiptoe.map((t, i) => ({ t, type: 'tiptoe', n: i, pan: -.1 + i * .08, v: .8 })),
  { t: HIT.zipOut[0], type: 'zip', d: .5, up: 0, pan: .8 },
  { t: HIT.puzzled[0], type: 'huh', pan: .2 },
  { t: HIT.zipBack[0], type: 'zip', d: .45, up: 0, pan: -.8 },
  { t: HIT.tap, type: 'tap', pan: .1 },
  { t: HIT.jump, type: 'boing', pan: .2 },
  { t: HIT.fall, type: 'bump', pan: .2 },
  { t: HIT.giggle[0], type: 'giggle', pan: .1 },
  { t: HIT.home[0], type: 'scurry', d: 1.6, pan: -.3 },
  ...STEPS.home.map((t, i) => ({ t, type: 'tiptoe', n: i, pan: -.3, v: .7 })),
  { t: HIT.land[0], type: 'zip', d: .45, up: 1, pan: .1 },
  { t: HIT.land[1], type: 'land', pan: .1 },
  { t: HIT.recall, type: 'recall' },
];
