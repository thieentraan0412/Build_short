// Một nguồn thời gian duy nhất cho hình, phụ đề, âm thanh. Tập A: 120 BPM, 26 ô nhịp = 52 s, phát vòng lặp (khung cuối mở về khung đầu).
export const BPM = 120, BEAT = 60 / BPM, BAR = BEAT * 4;
export const at = (bar, beat = 0) => (bar * 4 + beat) * BEAT;
export const PACE = 1;

export const SECS = [
  { id: 'hook', bar: 0, bars: 2 },
  { id: 'title', bar: 2, bars: 1 },        // nhạc hiệu 2 s
  { id: 'meet', bar: 3, bars: 5 },         // bí mật 1: Crumb ra mắt, râu ngửi, "Tap, tap, hello!"
  { id: 'trail', bar: 8, bars: 6 },        // bí mật 2: "Nope!" → đường mùi (cảnh đặc trưng) + Rollo
  { id: 'farm', bar: 14, bars: 4 },        // bí mật 3: kiến chăn rệp + Spindle ló ra
  { id: 'album', bar: 18, bars: 5 },       // sổ, mạch mùa "Can I hold the lens?"
  { id: 'gag', bar: 23, bars: 3 },         // cây kem của tập 1, vòng lặp
].map(s => ({ ...s, t0: at(s.bar), t1: at(s.bar + s.bars) }));
export const DUR = at(26);

// chuyển cảnh qua kính: kính lớn dần, cảnh sau đã nằm sẵn trong kính
export const IRIS = [
  { t0: at(1, 3), t1: at(2), from: 'hook', to: 'title' },
  { t0: at(2, 3), t1: at(3), from: 'title', to: 'meet' },
  { t0: at(7, 3), t1: at(8), from: 'meet', to: 'trail' },
  { t0: at(13, 3), t1: at(14), from: 'trail', to: 'farm' },
  { t0: at(17, 3), t1: at(18), from: 'farm', to: 'album' },
  { t0: at(22, 3), t1: at(23), from: 'album', to: 'gag' },
];

// Mốc hành động dùng chung cho hình và tiếng (giây tuyệt đối)
export const HIT = {
  words: [0, .12], sniff: [1.0, 1.3], pop: 1.75, lensHook: 2.9,
  walk1: [6.0, 7.6], lupIn: 7.6, zoom: 9.35, scent: 9.6, lensOut: 12.0, ant2: [12.0, 12.9], taps: [13.0, 13.25], ant2Out: [14.8, 15.5],
  map: 16.6, nope: 18.6, rest: [19.4, 20.0], trail: 20.0, slide: [22.0, 27.0], rollo: [24.4, 26.2], freeze: [25.0, 25.7],
  aphidTap: [29.0, 29.2], drop: 29.6, sip: 30.0, cows: 31.65, spindle: [33.3, 33.8], drop2: [33.9, 34.35],
  aim: [34.85, 35.2], snap: 35.3, zoomIn: [35.4, 35.7], zoomOut: [35.7, 36.05], irisB: 35.7,   // v2: kính soi lại chú rệp, "chụp" → match cut thành sticker thứ ba
  stamp: [36.5, 37.0, 37.5], sayIn: 39.4,
  gagWalk: [46.0, 47.3], gagSniff: 46.6, lift: [48.6, 49.2], topple: 49.4, splat: 49.75, laugh: 50.2, finger: [50.6, 51.3], recall: 51.0, loopIris: [51.3, 52.0],
};

// t: lúc bắt đầu nói (giây). dur: độ dài thật (voice/dur.json, sau voicefx.py). who: giọng trong _shared/voices.js. catch: câu cửa miệng.
export const LINES = [
  { id: 'L01', who: 'loupe', t: .1, dur: 1.604, card: 1, text: 'Could you smell with your fingers?' },
  { id: 'L02', who: 'crumb', t: 2.0, dur: 1.354, card: 1, text: 'Ants can! Well, sort of!' },
  { id: 'L03', who: 'loupe', t: at(2, .25), dur: 1.707, card: 2, text: 'Big secrets of tiny bugs!' },
  { id: 'L04', who: 'loupe', t: 6.5, dur: 1.417, card: 3, text: 'This is Crumb, the ant!' },          // "Meet Crumb" bị Whisper nghe thành "Meat"/"Krom"
  { id: 'L05', who: 'loupe', t: 8.3, dur: .999, card: 3, text: "Let's zoom in!", catch: true },
  { id: 'L06', who: 'loupe', t: 10.0, dur: 1.592, card: 4, text: 'Ants sniff with their antennae!' },  // "smell" ở đây bị nghe thành "Ant smell"
  { id: 'L07', who: 'crumb', t: 13.5, dur: 1.077, card: 5, text: 'Tap, tap, hello!' },
  { id: 'L08', who: 'crumb', t: 17.0, dur: 1.261, card: 6, text: 'So, they follow a map?' },
  { id: 'L09', who: 'loupe', t: HIT.nope, dur: .628, card: 6, text: 'Nope!', catch: true },
  { id: 'L10', who: 'loupe', t: 20.2, dur: 1.49, card: 7, text: 'They follow a smell trail!' },
  { id: 'L11', who: 'loupe', t: 30.3, dur: 1.736, card: 8, text: 'Some ants keep tiny cows!' },
  { id: 'L12', who: 'albie', t: at(19), dur: 2.297, card: 9, text: 'Six legs? In you go!', catch: true },
  { id: 'L13', who: 'crumb', t: 41.2, dur: 1.343, card: 10, text: 'Can I hold the lens?' },
  { id: 'L14', who: 'loupe', t: 42.9, dur: .828, card: 10, text: 'Not yet!' },
  { id: 'L15', who: 'crumb', t: 47.5, dur: 1.042, card: 11, text: 'I can carry it!' },
  { id: 'L16', who: 'loupe', t: 50.55, dur: 1.396, card: 12, text: 'What can YOU smell right now?', pace: 1 },   // v2: câu hỏi kết cho trẻ (QUALITY.md §6)
];
// Tấm phụ đề: giữ ≥ 1,8 s và ≥ câu cuối + 0,6 s (DIRECTOR.md §7); không được chồng tấm sau. Chữ hiện dần theo câu đã nói.
export const CARDS = [...new Set(LINES.map(l => l.card))].map(k => {
  const ls = LINES.filter(l => l.card === k), t0 = ls[0].t, end = ls.at(-1).t + ls.at(-1).dur;
  return { t0, t1: Math.min(DUR, Math.max(t0 + 1.8, end + .6)), text: ls.map(l => l.text).join(' '), parts: ls.map(l => ({ t: l.t, text: l.text })) };
});
export const CARD_CLASHES = CARDS.filter((c, i) => i + 1 < CARDS.length && c.t1 > CARDS[i + 1].t0).map(c => c.text);

// 10 khung cho storyboard
export const BOARD = [
  { t: 0, shot: '1', frame: 'Medium, ground level', dur: '3.5 s', line: 'Could you smell with your fingers?' },
  { t: 2.6, shot: '1', frame: 'Medium · Crumb pops up', dur: '3.5 s', line: 'Ants can! Well, sort of!' },
  { t: 5.0, shot: '2', frame: 'Title · jingle', dur: '2 s', line: 'Big secrets of tiny bugs!' },
  { t: 10.8, shot: '4', frame: 'Close-up in lens', dur: '3 s', line: 'Ants sniff with their antennae!' },
  { t: 13.6, shot: '5', frame: 'Medium', dur: '3.5 s', line: 'Tap, tap, hello!' },
  { t: 18.9, shot: '6', frame: 'Medium', dur: '3.5 s', line: 'So, they follow a map? Nope!' },
  { t: 24.0, shot: '7', frame: 'Lens slides along the trail', dur: '7 s', line: 'They follow a smell trail!' },
  { t: 30.8, shot: '8', frame: 'Leaf with aphids', dur: '8 s', line: 'Some ants keep tiny cows!' },
  { t: 42.0, shot: '9', frame: 'Album, held', dur: '9.5 s', line: 'Six legs? In you go! · Can I hold the lens? Not yet!' },
  { t: 49.9, shot: '10', frame: 'Medium · ice cream on the lens', dur: '6 s', line: 'I can carry it!' },
];

// Sự kiện âm thanh, khớp với chuyển động trong film.js (core/render/events.mjs → events.json → mix.py). Bảng cue đầy đủ ở SOUND.md.
export const EV = [
  ...HIT.words.map((t, k) => ({ t, type: 'wordpop', n: k })),   // v2: mỗi dòng chữ móc nảy một tiếng
  // mở: vụn bánh bước đi → ngón tay "ngửi" → Crumb bật lên → Miss Loupe trượt vào → kính nở thành tựa
  { t: 0, type: 'titlepop' },
  { t: 0, type: 'steps', d: 1.0, n: 10, pan: -.2 },
  ...HIT.sniff.map(t => ({ t, type: 'sniff', pan: .3 })),
  { t: HIT.pop, type: 'popup' }, { t: HIT.pop + .1, type: 'blip', m: 91, pan: -.1 },
  { t: HIT.lensHook, type: 'swipe', d: .3, pan: .6 },
  { t: at(1, 3), type: 'swell' },
  // tựa
  { t: at(2), type: 'swish', d: .6, v: .3, pan: -.6 },
  { t: at(2, 3), type: 'swirl', d: .5 },
  // bí mật 1
  { t: at(3), type: 'badge', n: 1 },
  { t: HIT.walk1[0], type: 'steps', d: 1.6, n: 14, pan: -.3 },
  { t: HIT.lupIn, type: 'swipe', d: .4, lo: 900, hi: 4500, pan: .6 },
  { t: HIT.zoom, type: 'zoom' },
  { t: HIT.scent, type: 'scent', d: 2.0 },                     // hạt mùi bay vào đầu râu
  { t: HIT.lensOut, type: 'swishout', pan: .4 },
  { t: HIT.ant2[0], type: 'steps', d: .9, n: 8, pan: .5 },
  ...HIT.taps.map((t, i) => ({ t, type: 'tap', m: [91, 95][i] })),
  { t: HIT.ant2Out[0], type: 'steps', d: .7, n: 6, pan: .6 },
  { t: at(7, 3), type: 'whoosh', d: .5, v: .45 },
  // bí mật 2
  { t: at(8), type: 'badge', n: 2 },
  { t: HIT.map, type: 'paper' },
  { t: HIT.nope, type: 'buzzer' },
  { t: HIT.trail, type: 'reveal' },                            // đáp án là tiếng đầu tiên sau khoảng lặng
  { t: HIT.slide[0], type: 'glide', d: HIT.slide[1] - HIT.slide[0] },
  { t: 21.75, type: 'steps', d: HIT.freeze[0] - 21.75, n: 30, v: 2.4, pan: .1 },   // bước chân của đàn kiến, nối ngay sau L10 (QA: không để khoảng chết)
  { t: 21.75, type: 'scent', d: 3.0 },                                              // mùi bốc lên dọc đường (hạt bạc hà trên hình)
  { t: HIT.rollo[0], type: 'roll', d: HIT.rollo[1] - HIT.rollo[0] },
  { t: HIT.freeze[0], type: 'freeze' }, { t: HIT.freeze[1], type: 'steps', d: 1.3, n: 13, pan: .2 },
  { t: at(13, 3), type: 'climb' },                             // đường mùi bò lên thân cây
  // bí mật 3
  { t: at(14), type: 'badge', n: 3 },
  ...HIT.aphidTap.map(t => ({ t, type: 'tap', m: 88 })),
  { t: HIT.drop, type: 'drop' }, { t: HIT.sip, type: 'sip' },
  { t: HIT.cows, type: 'pops', n: 10, step: .03, m: 84, v: .4 },
  { t: HIT.spindle[0], type: 'blip', m: 79, pan: .7 },
  { t: HIT.drop2[0], type: 'fall', d: .45 }, { t: HIT.drop2[1], type: 'drop' }, { t: HIT.drop2[1] + .05, type: 'boing', v: .4 },   // giọt ngọt thứ hai rơi lên vụn bánh, Crumb nhảy cẫng
  { t: HIT.aim[0], type: 'swish', d: .35, v: .2, lo: 1500, hi: 4800, up: true, pan: .4 },   // v2: kính soi lại chú rệp
  { t: HIT.snap, type: 'snap' },
  { t: HIT.zoomIn[0], type: 'zoomin', d: HIT.zoomIn[1] - HIT.zoomIn[0] },
  { t: HIT.zoomOut[0], type: 'zoomout', d: HIT.zoomOut[1] - HIT.zoomOut[0] },
  // sổ
  { t: HIT.irisB + .05, type: 'page' },
  ...HIT.stamp.map((t, i) => ({ t: t - .3, type: 'swipe', d: .3, lo: 1600 + i * 300, hi: 6000 + i * 800, pan: .7 })),
  ...HIT.stamp.map((t, i) => ({ t, type: 'stamp', n: i })),
  { t: at(22, 3), type: 'lensiris' },
  // kết: cây kem đổ ụp lên kính → ngón tay → vòng lặp
  { t: HIT.gagWalk[0], type: 'steps', d: 1.3, n: 12, pan: -.2 },
  { t: HIT.gagSniff, type: 'sniff', pan: -.2, v: .6 },
  { t: HIT.lift[0], type: 'windup', d: .6 },
  { t: HIT.lift[1] - .1, type: 'wobble' },
  { t: HIT.topple, type: 'fall', d: .35 },
  { t: HIT.splat, type: 'splat' }, { t: HIT.splat + .02, type: 'tink' },
  { t: HIT.laugh, type: 'boing', v: .45 },
  { t: HIT.finger[0] + .2, type: 'squeak' },
  { t: HIT.recall, type: 'recall' },                           // v2: chữ SMELL WITH FINGERS?! trở lại đúng chỗ của khung đầu
  { t: HIT.loopIris[0], type: 'ringiris' },
];
