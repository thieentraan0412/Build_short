// Một nguồn thời gian duy nhất cho hình, phụ đề, âm thanh. 120 BPM, 26 ô nhịp = 52 s.
export const BPM = 120, BEAT = 60 / BPM, BAR = BEAT * 4;
export const at = (bar, beat = 0) => (bar * 4 + beat) * BEAT;
export const WAGGLE_DEG = 12;   // góc vạch nhảy so với trục đứng = góc đường bay so với hướng mặt trời (FACTS.md)

export const SECS = [
  { id: 'hook', bar: 0, bars: 2 },
  { id: 'title', bar: 2, bars: 1 },        // nhạc hiệu 2 s
  { id: 'butterfly', bar: 3, bars: 6 },
  { id: 'cricket', bar: 9, bars: 5 },
  { id: 'bee', bar: 14, bars: 3 },
  { id: 'map', bar: 17, bars: 3 },         // cảnh đặc trưng + Rollo trốn
  { id: 'album', bar: 20, bars: 4 },       // Albie ra mắt
  { id: 'gag', bar: 24, bars: 2 },
].map(s => ({ ...s, t0: at(s.bar), t1: at(s.bar + s.bars) }));
export const DUR = at(26);

// lens iris: kính lớn dần, cảnh sau đã nằm sẵn trong kính. r0 = bán kính kính lúc bắt đầu.
export const IRIS = [
  { t0: at(1, 3), t1: at(2), from: 'hook', to: 'title' },
  { t0: at(2, 3), t1: at(3), from: 'title', to: 'butterfly' },
  { t0: at(8, 2), t1: at(9), from: 'butterfly', to: 'cricket' },
  { t0: at(13, 2), t1: at(14), from: 'cricket', to: 'bee' },
  { t0: at(19, 2), t1: at(20), from: 'map', to: 'album', kind: 'flower' },
  { t0: at(23, 3), t1: at(24), from: 'album', to: 'gag', kind: 'albumLens' },
];

// Mốc hành động dùng chung cho hình và tiếng (giây tuyệt đối)
export const HIT = {
  stomp: at(0, 3),
  // nhịp móc 0–3,5 s (HOOK.md): chạm thử kem, Miss Loupe bật lên, chân rút đi, Flutter sà xuống và dậm chân
  hook: { boop: .62, lupIn: 1.6, footOut: 1.95, bfIn: 2.0, bfLand: 2.6, taps: [2.88, 3.12], bf: { x: 590, y: 948, k: 118 }, hover: { x: 185, y: 1150, k: 125 } },   // hover: Flutter lơ lửng từ khung đầu
  bfLand: at(4), bfZoom: 9.6, bfGlow: 10.4, sweet: at(7, .5),
  ckHead: 21.1, ckNope: 22.3, ckSilence: at(11, 2), ckEar: at(12), ckLift: 26,
  dance: at(15),
  rolloIn: at(18, .4), rolloOut: at(19, 3.6),
  albieWake: at(20, 1), stamp: [at(20, 1), at(20, 2), at(20, 3)], albieIn: at(21) + 1.46,   // sticker đầu tiên đánh thức Albie
  gagLand: at(24, 2), gagSlurp: at(24, 2) + 1.1, gagLaugh: at(25, 1), recall: at(25, 1.4),   // recall: chữ móc trở lại ở cuối (QUALITY.md §6)
};

// t: lúc bắt đầu nói (giây). dur: độ dài thật của giọng (voice/dur.json). who: giọng trong _shared/voices.js. card: các câu chung một tấm phụ đề.
export const LINES = [
  { id: 'L01', who: 'loupe', t: 0, dur: 1.526, card: 1, text: 'Can you taste with your feet?' },
  { id: 'L02', who: 'loupe', t: 2.25, dur: 1.178, card: 2, text: 'Butterflies can!' },
  { id: 'L03', who: 'loupe', t: 4.125, dur: 1.707, card: 3, text: 'Big secrets of tiny bugs!' },
  { id: 'L04', who: 'loupe', t: 6.5, dur: 1.772, card: 4, text: 'A butterfly lands on a flower.' },
  { id: 'L05', who: 'loupe', t: 8.6, dur: .999, card: 4, text: "Let's zoom in!" },
  { id: 'L06', who: 'loupe', t: 10.3, dur: 2.699, card: 5, text: 'Tiny taste spots on its feet tell it right away:' },
  { id: 'L07', who: 'loupe', t: at(7, .5), dur: 1.34, card: 6, text: 'Sweet! Time to eat!' },
  { id: 'L08', who: 'loupe', t: at(9), dur: 1.155, card: 7, text: 'What about crickets?' },
  { id: 'L09', who: 'loupe', t: 19.35, dur: 1.361, card: 7, text: 'Where are its ears?', say: 'Where... are its ears?' },   // Kokoro đọc liền "where are" thành "wear"
  { id: 'L10', who: 'loupe', t: 21.35, dur: .859, card: 8, text: 'On its head?' },
  { id: 'L11', who: 'loupe', t: 22.32, dur: .628, card: 8, text: 'Nope!' },
  { id: 'L12', who: 'loupe', t: at(12), dur: 2.044, card: 9, text: "A cricket's ears are on its front legs!" },
  { id: 'L13', who: 'loupe', t: at(14), dur: 1.359, card: 10, text: "Honeybees can't talk," },
  { id: 'L14', who: 'loupe', t: at(15), dur: .971, card: 10, text: 'so they dance!' },
  { id: 'L15', who: 'loupe', t: at(16), dur: 1.315, card: 11, text: 'The dance shows the way!' },
  { id: 'L16', who: 'albie', t: at(21), dur: 2.297, card: 12, text: 'Six legs? In you go!' },
  { id: 'L17', who: 'loupe', t: 44.95, dur: 2.651, card: 13, text: 'Go outside with a grown-up, and look closely!' },
  { id: 'L18', who: 'loupe', t: at(24, 2), dur: 1.519, card: 14, text: 'Hey... is it tasting me?' },
];
// Tấm phụ đề: giữ ≥ 1,8 s và ≥ câu cuối + 0,6 s (DIRECTOR.md §7); không được chồng tấm sau. Chữ hiện dần theo câu đã nói.
export const CARDS = [...new Set(LINES.map(l => l.card))].map(k => {
  const ls = LINES.filter(l => l.card === k), t0 = ls[0].t, end = ls.at(-1).t + ls.at(-1).dur;
  return { t0, t1: Math.max(t0 + 1.8, end + .6), text: ls.map(l => l.text).join(' '), parts: ls.map(l => ({ t: l.t, text: l.text })) };
});
export const CARD_CLASHES = CARDS.filter((c, i) => i + 1 < CARDS.length && c.t1 > CARDS[i + 1].t0).map(c => c.text);

// 9 khung cho storyboard: thời điểm, số cảnh, khung hình, độ dài cảnh, lời
export const BOARD = [
  { t: 1.62, shot: '1', frame: 'Wide', dur: '4 s', line: 'Can you taste with your feet?' },
  { t: 5.45, shot: '2', frame: 'Medium · jingle', dur: '2 s', line: 'Big secrets of tiny bugs!' },
  { t: 9.1, shot: '4', frame: 'Medium', dur: '2 s', line: "Let's zoom in!" },
  { t: 11.6, shot: '5', frame: 'Close-up in lens', dur: '3 s', line: 'Tiny taste spots on its feet...' },
  { t: 22.3, shot: '9', frame: 'Medium', dur: '2 s', line: 'On its head? Nope!' },
  { t: 25.0, shot: '11', frame: 'Close-up in lens', dur: '2 s', line: "A cricket's ears are on its front legs!" },
  { t: 31.6, shot: '14', frame: 'Wide', dur: '4 s', line: 'so they dance!' },
  { t: 38.6, shot: '15', frame: 'Extreme wide · Find Rollo!', dur: '6 s', line: '(no voice: signature shot)' },
  { t: 43.4, shot: '16', frame: 'Wide, held', dur: '7 s', line: 'Six legs? In you go!' },
];

// Sự kiện âm thanh, khớp với chuyển động trong film.js. Bộ trộn đọc chúng qua events.json (core/render/events.mjs).
// Bảng cue đầy đủ (hình ↔ tiếng) ở SOUND.md. Sáu lần chuyển cảnh qua kính, mỗi lần một tiếng riêng; tiếng nằm dưới lời thì ở dải cao và nhỏ.
export const EV = [
  // mở (0–3,5 s, HOOK.md): chân lơ lửng trên kem → FEET?! bật ra, ngón chân chạm thử "boop" → lấy đà → giẫm bẹp kem → giọt kem văng, chữ lắc
  // → Miss Loupe bật lên sững sờ → chân vút đi → Flutter sà xuống chỗ kem bẹp, dậm chân → lóe sáng trong kính
  { t: 0, type: 'titlepop' },                                      // khung đầu: chữ TASTE WITH bật ra (bong bóng cao + phím glock, trên dải giọng)
  { t: 0, type: 'flutter', d: .45, v: .45, pan: -.6 },             // Flutter lơ lửng bên trái, tròn mắt (cánh vỗ nhỏ)
  { t: .55, type: 'pops', n: 6, step: .035, m: 91, v: .4 },        // FEET?! hiện từng ký tự (.55 + i·.035)
  { t: .02, type: 'wordpop', n: 0 }, { t: .56, type: 'wordpop', n: 1 },   // v3: mỗi dòng chữ móc nảy một tiếng
  { t: HIT.hook.boop, type: 'boop' },                               // ngón chân chạm thử kem, ngay sau chữ "taste"
  { t: .9, type: 'windup', d: .4 },                                 // chân nhấc lên lấy đà .9–1,3: tách-tách lên dây cót (tiếng ngắn, không che chữ "feet")
  { t: 1.32, type: 'drop', d: .18 },                                // chân rơi 1,3–1,5: gió vút ở dải cao
  { t: HIT.stomp, type: 'stomp' },
  { t: HIT.stomp, type: 'splat' },                                  // kem bẹp
  { t: HIT.stomp + .03, type: 'wobble' },                           // chữ còn lắc sau cú giẫm
  { t: 1.62, type: 'plip', f: 1300 }, { t: 1.78, type: 'plip', f: 1650 }, { t: 1.94, type: 'plip', f: 1100 },   // giọt kem văng
  { t: HIT.hook.lupIn, type: 'swipe', d: .28, pan: .5 },            // Miss Loupe bật lên từ góc dưới-phải (khoảng trống giữa hai câu)
  { t: HIT.hook.footOut + .05, type: 'zip', pan: -.2 },             // chân vút khỏi khung 2,0–2,4, xong trước chữ "Butterflies"
  { t: HIT.hook.bfIn, type: 'flutter', d: .6, pan: -.4 },           // Flutter sà vào từ trái
  { t: HIT.hook.bfLand, type: 'land' },                             // đậu lên chỗ kem bẹp
  { t: 3.25, type: 'tink', f: 4200, v: .22 }, { t: 3.37, type: 'tink', f: 4800, v: .18 },   // bàn chân lóe sáng trong kính, sau chữ "can"
  { t: at(1, 3), type: 'swell' },                                   // kính nở thành tựa, chạm nhạc hiệu đúng 4,0
  // tựa (nhạc hiệu nằm trong phần nhạc)
  { t: at(2), type: 'swish', d: .6, v: .3, pan: -.6 },              // Miss Loupe trượt vào từ trái
  { t: at(2, 3), type: 'swirl', d: .5 },                            // kính có bông hoa nở ra thành khu vườn
  // bướm
  { t: at(3), type: 'badge', n: 1 },
  { t: at(3), type: 'flutter', d: 2, pan: -.5 },
  { t: HIT.bfLand, type: 'land' },
  { t: HIT.bfLand + .02, type: 'boing', f0: 210, v: .28, rise: 1.4, rate: 7 },   // bông hoa nhún khi bướm đậu
  { t: 8.2, type: 'swipe', d: .4, lo: 900, hi: 4500, pan: .6 },     // Miss Loupe trượt vào
  { t: HIT.bfZoom, type: 'zoom' },
  { t: HIT.bfGlow, type: 'sparkle' },
  { t: 10.5, type: 'bubbles', d: 1.2 },
  { t: 13.0, type: 'swish', d: .5, v: .35, up: false, pan: -.5 },   // kính lùi về góc trái
  { t: 13.8, type: 'slide', d: 1.2 },
  { t: HIT.sweet, type: 'chime' },
  { t: 16.4, type: 'swish', d: .45, v: .32, lo: 500, hi: 3000, pan: .2 },   // kính về giữa khung
  { t: at(8, 2), type: 'nightfall' },                               // ngày → đêm: gliss rơi xuống + gió dâng, chạm 18,0
  // dế
  { t: at(9), type: 'badge', n: 2 },
  { t: at(9, 2), type: 'pops', n: 5, step: .03, m: 84, v: .45 }, { t: at(9, 2) + .3, type: 'pops', n: 5, step: .03, m: 88, v: .35 },   // WHERE ARE / ITS EARS?
  { t: 20.0, type: 'swipe', d: .5, lo: 800, hi: 5000, pan: .6 },    // Miss Loupe vào từ phải
  { t: HIT.ckNope, type: 'buzzer' },
  { t: 22.6, type: 'swish', d: .7, v: .3, up: false, pan: -.3 },    // kính trôi từ đầu xuống chân
  { t: 23.1, type: 'block', m: 79 }, { t: 23.6, type: 'block', m: 74 },   // cô đang nghĩ: tích… tắc (dế im lặng)
  { t: 23.88, type: 'punch' },                                      // kính phóng to vào tai 23,9–24,1
  { t: HIT.ckEar, type: 'reveal' },
  { t: HIT.ckEar, type: 'pop', v: .6 }, { t: HIT.ckEar + .3, type: 'pop', v: .5 },
  { t: 25.9, type: 'swish', d: .45, v: .35, up: false, pan: -.6 },
  { t: HIT.ckLift, type: 'slide', d: .6 },
  { t: 26.8, type: 'swipe', d: .25 },
  { t: at(13, 2), type: 'buzzin' },                                 // đêm → tổ ong: tiếng ong dâng lên, chạm 28,0
  // ong
  { t: at(14), type: 'badge', n: 3 },
  { t: 28.2, type: 'pop', v: .5 },                                  // bóng thoại rỗng bật ra
  ...[28.54, 28.74, 28.94, 29.17, 29.37, 29.57].map((t, i) => ({ t, type: 'blip', m: [88, 86, 84][i % 3] })),   // ba chấm nảy lần lượt: ong không nói được
  { t: HIT.dance, type: 'stamp' },
  // bản đồ
  { t: at(17), type: 'pullback' },
  { t: 34.8, type: 'buzzby', d: 1.8 },
  { t: 36.2, type: 'bloom' },                                       // bông hoa đích nở 36,2–36,6
  { t: 36.6, type: 'pops', n: 7, step: .03, m: 84, v: .45 }, { t: 36.8, type: 'pops', n: 9, step: .03, m: 88, v: .4 },   // THE DANCE / SHOWS THE WAY!
  { t: HIT.rolloIn, type: 'roll', d: HIT.rolloOut - HIT.rolloIn },
  { t: at(19, 2), type: 'petals' },                                 // hoa nở trùm màn hình → sổ
  // sổ: Albie tỉnh dậy, ba sticker bay vào
  { t: at(20), type: 'page' },
  ...HIT.stamp.map((t, i) => ({ t: t - .3, type: 'swipe', d: .3, lo: 1600 + i * 300, hi: 6000 + i * 800, pan: .7 })),
  { t: HIT.albieWake, type: 'boing', v: .55 },
  { t: HIT.albieWake + .05, type: 'pages', d: .35 },
  ...HIT.stamp.map((t, i) => ({ t, type: 'stamp', n: i })),
  { t: at(23, 3), type: 'lensiris' },                               // kính của Miss Loupe nở thành cảnh cuối
  // kết
  { t: at(24), type: 'flutter', d: 1, pan: .7 },
  { t: HIT.gagLand, type: 'tap' }, { t: HIT.gagLand, type: 'tink', f: 3800 },   // đậu lên mặt kính
  { t: HIT.gagLand + .25, type: 'tink', f: 4300, v: .22 }, { t: HIT.gagLand + .5, type: 'tink', f: 3600, v: .22 }, { t: HIT.gagLand + .75, type: 'tink', f: 4100, v: .22 },   // chân nếm thử trên kính
  { t: HIT.gagSlurp, type: 'slurp' },
  { t: HIT.gagLaugh, type: 'boing', v: .5 },
  { t: HIT.recall, type: 'recall' },                               // v3: chữ TASTE WITH FEET?! trở lại trên khung cuối
];
