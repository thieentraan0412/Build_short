// LONG-003 · sự kiện âm thanh, khớp với chuyển động trong scenes.js (core/render/events.mjs → events.json → mix.py). Bảng cue: SOUND.md.
// Mọi mốc lấy từ timeline.js (HIT, LINES), nên tự khớp khi giọng thật đổi độ dài câu.
import { HIT as h, LINES, DUR } from './timeline.js';

const Lb = (who, text, nth = 0) => LINES.filter(l => l.who === who && l.text === text)[nth];
const L0 = (who, text, nth) => Lb(who, text, nth).t;
const Lend = (who, text, nth) => { const l = Lb(who, text, nth); return l.t + l.dur; };
const span = (who, text, nth) => { const l = Lb(who, text, nth); return [l.t, l.t + l.dur]; };
const lerp = (a, b, u) => a + (b - a) * u;
const countTimes = (a, b, n) => Array.from({ length: n }, (_, i) => lerp(a + .1, b - .35, n > 1 ? i / (n - 1) : 0));   // như lib16.js
const glow = (name, d = .45) => ({ t: h[name] - d, type: 'glowiris' });      // chuyển cảnh khi Miss Loupe còn lạc: đốm sáng của Blink lớn dần
const lens = name => ({ t: h[name] - .45, type: 'lensiris' });               // khi cô đã về: vòng kính trở lại
const FILL = [h.dizzy + .6, h.trailEnd + .8, h.s_lp2 - .9, h.clear + 1.0, h.slot5];   // năm ô "cách tìm đường" lấp (film.js)
const slot = n => [{ t: FILL[n] - .5, type: 'cluefly' }, { t: FILL[n], type: 'slot', n }];

const hook = () => [
  { t: 0, type: 'titlepop' }, { t: .02, type: 'wordpop', n: 0 }, { t: .14, type: 'wordpop', n: 1 },        // LOST / AT NIGHT! nảy từng dòng
  { t: 0, type: 'roll', d: h.bump, v: .9 },                                                                // viên tròn lăn rì rì
  { t: .05, type: 'patter', d: h.bump - .1 },                                                              // chân Miss Loupe chạy lạch bạch trên đỉnh viên tròn
  { t: h.crumbRun - .4, type: 'scurry', d: .6 },                                                           // Crumb chạy theo
  { t: h.bump, type: 'bump' },                                                                             // vấp sỏi "boing" (đuôi kéo qua cú lia: L-cut)
  { t: h.bump + .05, type: 'whizz', d: .9 },                                                               // Miss Loupe bay vèo vào bóng tối
  { t: h.s_team - .35, type: 'whip' },                                                                     // lia nhanh sang lối đi
  { t: h.bump + .95, type: 'sparkle', v: .7 },                                                             // vệt sao nhỏ ở chỗ cô biến mất (nghe sau cú lia)
  { t: L0('albie', 'Miss Loupe is lost... at NIGHT!'), type: 'tabs' }, { t: L0('albie', 'Miss Loupe is lost... at NIGHT!') + .05, type: 'hop', v: .6 },
  { t: h.s_team, type: 'scurry', d: .6, v: .8 },                                                           // Crumb chạy tới
  { t: L0('crumb', 'How do we find her... with no sun?'), type: 'qpop' },
  { t: h.rolloBack, type: 'roll', d: .9 },                                                                 // Rollo lăn về, viên tròn có vết lõm trống
  { t: Lend('rollo', 'Oh my. My ball feels... lighter.') - .5, type: 'boing', v: .3 },
  { t: h.s_title - .4, type: 'glowiris' },
  { t: h.s_title + .05, type: 'whizz', d: 1.4, v: .45 },                                                   // Miss Loupe nhỏ xíu bay ngang trời sao trên tấm tựa
  { t: h.s_map - .3, type: 'glowiris', v: .7 },
];
const map = () => {
  const off = L0('albie', 'Off my map?!'), [a, b] = span('dot', 'Team, count off! One, two, three, four, five!');
  return [
    { t: h.mapOpen, type: 'page' }, { t: h.mapOpen + .5, type: 'reveal', v: .7 },                          // trang bản đồ mở, sao HOME sáng
    { t: L0('crumb', 'And Miss Loupe?'), type: 'qpop' },
    { t: h.rolloPoint, type: 'blip', m: 79 },                                                              // Rollo giơ chân chỉ
    { t: h.mapArrow, type: 'arrow', d: 1.0 },                                                              // mũi tên chấm chạy ra khỏi mép bản đồ
    { t: h.mapArrow + 1.0, type: 'bigpop', v: .8 },                                                        // dấu "?" to
    { t: off, type: 'tabs' }, { t: off + .1, type: 'flap', d: .9 },                                        // các trang của Albie phần phật
    { t: h.s_crew, type: 'swish', d: .4, v: .25 }, { t: h.s_crew + .1, type: 'hop', v: .7 },
    { t: h.lineUp, type: 'scurry', d: .9 },                                                                // cả đội xếp hàng
    ...countTimes(a + (b - a) * .35, b, 5).map((t, n) => ({ t, type: 'count', n })),                       // điểm danh 1…5
    { t: h.blinkOn, type: 'glowon' },                                                                      // đèn Blink bật: vuốt chuông thủy tinh
    { t: L0('albie', "I'll keep the map. Come home safe!") - .2, type: 'flap', d: .8, v: .7 },
  ];
};
const sun = () => {
  const np = L0('blink', 'Nope!');
  return [
    glow('s_sun'), { t: h.s_sun + .1, type: 'slots' },                                                     // năm ô "1 2 3 4 5" bật ra dưới mép trên
    { t: h.waggleUp, type: 'buzzin', d: .6 },                                                              // Waggle vọt lên
    { t: h.dance, type: 'figure8', d: 2.2 },                                                               // vệt sáng số 8 + vo ve lắc mông
    { t: h.dance + 2.4, type: 'figure8', d: 1.6, v: .6 },
    { t: L0('crumb', 'using the sun!'), type: 'cluepop', n: 1 },                                           // biểu tượng mặt trời có dấu hỏi
    { t: h.tiltUp - .1, type: 'swish', d: .9, v: .35, lo: 300, hi: 2200 },                                 // máy ngửa lên trời
    { t: h.tiltUp + .2, type: 'qpop' },                                                                    // "NO SUN?"
    { t: h.tiltUp + .35, type: 'buzzin', d: .6, v: .5 },                                                   // Blink bay lên
    { t: np - .02, type: 'bigpop' },                                                                       // "NOPE!"
    { t: h.dizzy, type: 'dizzy', d: 1.2 },                                                                 // Waggle xoay vòng chóng mặt
    { t: h.dizzy + 1.2, type: 'land', v: .7 }, { t: h.dizzy + 1.25, type: 'boing', v: .3 },                // đáp lên viên tròn
    ...slot(0),
  ];
};
const lp1 = () => [
  glow('s_lp1'), { t: h.lp1 + .1, type: 'glint' },                                                         // Miss Loupe kẹt trong khe, kính lóe
  { t: Lend('loupe', 'My friends will find me!') + .05, type: 'giggle', v: .45 },                          // Spindle trên mạng nhện (chỗ trốn 2)
];
const ants = () => {
  const [a, b] = span('dot', 'One, two, three, four, five, six ants!');
  return [
    glow('s_ants'),
    { t: h.sniff, type: 'sniff' }, { t: h.sniff + .2, type: 'scent', d: 1.2 },                             // râu chạm đất "tip-tip"; chấm mùi hồng chạy trong khung ngửi
    { t: h.antsCome, type: 'antsteps', d: 2.8 },                                                           // đàn kiến bò tới
    { t: h.antsCome + 2.9, type: 'tap', m: 93 }, { t: h.antsCome + 3.1, type: 'tap', m: 96 },              // chạm râu chào
    ...countTimes(a, b, 6).map((t, n) => ({ t, type: 'count', n })),
    { t: h.s_march, type: 'swish', d: .45, v: .3 },
    { t: h.march, type: 'antsteps', d: h.s_edge0 - h.march - .2, v: .8 },
    { t: h.mush, type: 'blip', m: 84 },
    { t: L0('crumb', 'under the leaf...'), type: 'bigpop', v: .7 }, { t: h.leafUp + .05, type: 'leaf', d: .5, v: .6 },             // "UNDER!"
    { t: L0('crumb', 'over the pebble!'), type: 'bigpop', v: .7 }, { t: h.pebble + .1, type: 'hop', v: .5 },                      // "OVER!"
    { t: h.s_edge0, type: 'swish', d: .45, v: .3, up: false },
    { t: L0('crumb', 'The trail ends here!'), type: 'bigpop', v: .8 },                                     // "THE END?"
    ...slot(1),
    { t: h.antsBye, type: 'blip', m: 91 }, { t: h.antsBye + .1, type: 'antsteps', d: 1.8, v: .7 },         // "bye!", đàn kiến quay về
  ];
};
const steps = () => {
  const [a1, b1] = span('dot', 'One, two, three, four, five...'), [a2, b2] = span('dot', 'six, seven, eight, nine, ten!');
  const ds = L0('dot', 'I count steps too!');
  return [
    { t: h.s_think, type: 'swish', d: .4, v: .25 },
    { t: h.thinkPop, type: 'thinkpop' },                                                                   // bóng nghĩ phình ra
    { t: h.s_desert, type: 'memory' },                                                                     // vào bóng nghĩ: sa mạc nắng
    { t: h.dOut, type: 'antsteps', d: h.dSeed - h.dOut - .1, v: .9, m: 88 },                               // kiến sa mạc đi ngoằn ngoèo
    { t: h.dSeed, type: 'pick' },                                                                          // nhặt hạt
    { t: h.dHome, type: 'ticks', d: Math.min(3.2, h.s_count - h.dHome - .2), n: 12 },                      // về thẳng: mỗi bước một vạch "tick" đi lên
    { t: h.dHome + .6, type: 'bigpop', v: .8 },                                                            // "STRAIGHT HOME!"
    { t: ds - .4, type: 'popup', v: .6 },                                                                  // Dot ló vào
    glow('s_count'),
    ...[...countTimes(a1, b1, 5), ...countTimes(a2, b2, 5)].map((t, n) => ({ t, type: 'step', n })),       // 10 bước: dấu chân + số
    { t: L0('dot', 'Ten steps from the trail!'), type: 'bigpop' },                                         // "10 STEPS!"
    ...slot(2),
  ];
};
const lp2 = () => [
  glow('s_lp2'),
  { t: h.lp2, type: 'swish', d: .5, v: .3 },                                                               // nghiêng kính nhìn xa
  { t: h.lp2 + .5, type: 'blurry' },                                                                       // sao nhoè thành chấm to: "BLURRY!"
  { t: h.tellyHint, type: 'flash', v: .5 },                                                                // ánh lóe nhỏ trên cọc hàng rào
];
const stars = () => [
  glow('s_stars'), { t: h.s_stars + .15, type: 'qpop' },
  { t: h.climb, type: 'scurry', d: .7, v: .7 }, { t: h.climb + .8, type: 'spin', d: .8 },                  // Rollo trèo lên viên tròn, xoay một vòng
  { t: h.s_sky - .1, type: 'crane', d: 2.4 },                                                              // máy ngửa vút lên: dâng lấp lánh
  { t: h.crane + 1.6, type: 'label' },                                                                     // chữ MILKY WAY
  { t: L0('crumb', 'Wow... a river of stars!') + .3, type: 'shimmer', d: 1.4 },
  { t: h.s_track, type: 'swish', d: .4, v: .25, up: false },
  { t: h.straight, type: 'roll', d: h.clouds - h.straight, v: .7 },
  { t: L0('dot', 'So straight!'), type: 'bigpop', v: .8 },                                                 // "STRAIGHT!"
  { t: h.clouds - .3, type: 'cloud', d: 1.8 },                                                             // bóng mây trôi qua: "whoosh" mềm
  { t: h.wiggle, type: 'wiggle', d: 2.6 },                                                                 // vệt ngoằn ngoèo: còi lắc lư
  { t: h.wiggle + .1, type: 'roll', d: h.clear - h.wiggle - .2, v: .6 },
  { t: h.wiggle + 1.0, type: 'bonk', v: .6 }, { t: h.wiggle + 1.9, type: 'bonk', v: .5 },                  // cả đội đi vòng vèo, va nhẹ
  { t: L0('crumb', 'Rollo is rolling in wiggles!'), type: 'bigpop', v: .8 },                               // "WIGGLES!"
  { t: h.clear, type: 'clear' },                                                                           // mây tan, sao trở lại
  { t: h.clear + .2, type: 'roll', d: 1.0, v: .6 },
  ...slot(3),
];
const flash = () => {
  const bt = countTimes(...(([a, b]) => [a, b + .2])(span('blink', 'Blink! Blink! Blink!')), 3);
  return [
    { t: h.s_telly - .5, type: 'flash', v: .7 },                                                           // tiếng lóe của Uncle Telly vào trước hình (J-cut)
    glow('s_telly'),
    { t: h.tellyLook + .1, type: 'scan', d: 1.0 },                                                         // ống nhòm quét khu vườn
    { t: h.s_bino, type: 'bino' },                                                                         // nhìn qua ống nhòm
    { t: h.binoFind + .8, type: 'tink', m: 98 },
    ...[.1, .7, 1.3].map((d, n) => ({ t: h.tellyFlash + d, type: 'flash', n })),                           // nháy tròng kính ba lần
    { t: h.s_signal, type: 'swish', d: .4, v: .25 },
    ...[.15, .75, 1.35].map((d, n) => ({ t: h.s_signal + d, type: 'flash', n, v: .5 })),                   // ba ánh lóe xa
    ...countTimes(...span('dot', 'One, two, three flashes!'), 3).map((t, n) => ({ t, type: 'count', n })),
    ...bt.map((t, n) => ({ t, type: 'bloop', n })),                                                        // Blink nháy mật mã
    ...[.1, .6, 1.1].map((d, n) => ({ t: h.tellyAns + d, type: 'flash', n, v: .8 })),                      // Uncle Telly nháy đáp
    { t: h.tellyAns + 1.2, type: 'beam', d: .8 },                                                          // vệt sáng chỉ chỗ
    ...slot(4),
    { t: L0('crumb', "She's over there! Let's go!") + .1, type: 'hop', v: .7 },
  ];
};
const edge = () => {
  const np = L0('dot', 'Nope!'), q = L0('crumb', 'Can I hold the lens... NOW?'), yes = L0('loupe', 'Yes! NOW!');
  return [
    glow('s_edge'),
    { t: h.s_edge + .1, type: 'pats', n: 10, v: .7 },                                                      // cả đội tới phiến đá
    { t: h.sparkle, type: 'glint' }, { t: h.sparkle + .2, type: 'sparkle' },                               // đốm lấp lánh trong khe đá
    ...[0, 1, 2].map(n => ({ t: h.pull + .15 + n * .45, type: 'heave', n })),                              // cả đội nối chuỗi kéo: "heave!"
    { t: h.thump, type: 'thump' },                                                                         // THỊCH: đất rung một nhịp
    { t: np - .02, type: 'bigpop' },                                                                       // "NOPE!"
    { t: h.hand, type: 'handin', d: .9 },                                                                  // bàn tay The Giant hạ xuống
    { t: h.hand + .75, type: 'stone' },                                                                    // ngón tay nghiêng phiến đá
    { t: h.hand + .9, type: 'popout' },                                                                    // Miss Loupe bật ra
    { t: h.hand + 1.4, type: 'land', v: .6 },
    { t: h.lift, type: 'lift', d: 1.0 },                                                                   // được nâng lên
    { t: h.pov, type: 'zoom' },                                                                            // góc nhìn The Giant: kính mở to
    { t: h.waveAll, type: 'bigpop', v: .8 }, { t: h.waveAll + .15, type: 'cheer', v: .6 },                 // "HELLO!", cả đội vẫy chào
    { t: Lend('crumb', 'Hello, Giant! Thank you!') + .6, type: 'giggle', v: .4 },                          // Spindle ở mép kính (chỗ trốn 3)
    { t: h.s_place, type: 'swish', d: .4, v: .25, up: false },
    { t: h.place, type: 'handin', d: 1.2, v: .8 }, { t: h.place + 1.2, type: 'land', v: .6 },              // đặt Miss Loupe xuống
    { t: h.leafSweep - .3, type: 'handin', d: .4, v: .6 }, { t: h.leafSweep, type: 'leaf', d: 1.2 },       // gạt chiếc lá
    { t: h.leafSweep + .7, type: 'shimmer', d: .9, v: .8 },                                                // sao sáng dọc lối về
    { t: h.handBye, type: 'handin', d: .6, v: .5 },                                                        // bàn tay vẫy, rời khung
    { t: h.s_found, type: 'swish', d: .4, v: .25 },
    { t: q, type: 'qpop' },
    { t: yes - .02, type: 'bigpop' }, { t: yes + .3, type: 'hop', v: .7 },                                 // "NOW!"
    { t: h.hold + .2, type: 'glint' }, { t: h.hold + .5, type: 'sparkle', v: .7 },                         // Crumb ôm kính, mắt to trong kính
  ];
};
const home = () => [
  lens('s_way'),
  { t: h.walkHome, type: 'pats', n: 12, v: .5 },
  ...[['crumb', 'Smell trails!'], ['rollo', 'The stars!'], ['dot', 'The sun!']].map(([w, s], n) => ({ t: L0(w, s) - .05, type: 'cardpop', n })),   // ba biểu tượng ôn bài
  { t: h.s_home, type: 'swish', d: .4, v: .25 },
  { t: h.albieHop, type: 'tabs' }, { t: h.albieHop + .05, type: 'hop' }, { t: h.albieHop + .65, type: 'hop', v: .7 },
  { t: h.s_glow, type: 'page' },
  ...[0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => ({ t: h.glow + n * .28, type: 'mapglow', n })),                  // chín chỗ của Mùa 1 sáng lần lượt
  { t: h.glow + 2.4, type: 'trip', d: 1.2 },                                                               // đường đi đêm nay sáng xuyên qua
  { t: h.newCorner - .3, type: 'flap', d: .4, v: .6 }, { t: h.newCorner + .1, type: 'paste' },             // dán góc GARDEN EDGE
];
const song = () => [
  { t: h.s_song, type: 'swish', d: .4, v: .25 },
  { t: h.spindleDrop, type: 'silkdrop', d: .6 },                                                           // Spindle thả mình xuống
  { t: L0('albie', 'BZZT! Not you, Spindle!') + .05, type: 'bzzt' },
  { t: h.songEnd, type: 'giggle', v: .6 }, { t: h.songEnd + .4, type: 'silkup', d: .8 },                   // khúc khích, kéo tơ lên
  lens('s_msg'),
  { t: L0('loupe', 'Look closely...'), type: 'bigpop', v: .7 }, { t: L0('loupe', 'Look closely...') + .3, type: 'shimmer', d: 1.2, v: .7 },
  lens('s_spot'),
  ...[0, 1, 2].flatMap(n => [{ t: h.e_spots + n * 1.2, type: 'cardpop', n }, { t: h.e_spots + n * 1.2 + .5, type: 'ring', n }]),   // ba khung nhỏ, vòng tròn khoanh Spindle
  { t: h.e_spots + 3.5, type: 'giggle', v: .5 },
];
const bye = () => {
  const st = L0('dot', 'The stars!'), end = L0('albie', "Rollo! That's the END of the page!");
  return [
    lens('s_bye'),
    { t: h.recall, type: 'recall' },                                                                       // gợi lại móc: tiếng chữ móc + viên tròn + chân chạy
    { t: h.recall, type: 'roll', d: h.flip - h.recall, v: .8 }, { t: h.recall + .05, type: 'patter', d: h.pageEdge - h.recall },
    { t: end, type: 'tabs' }, { t: end + .05, type: 'hop', v: .6 },
    { t: h.flip, type: 'pageflip' },                                                                       // lật trang
    { t: h.splash, type: 'splash' }, { t: h.splash + .05, type: 'bigpop', v: .7 },                         // "TÕM!" trang ao
    { t: h.s_end - .4, type: 'popup', v: .6 },                                                             // Miss Loupe và Dot ló vào trên lá súng
    { t: st - .02, type: 'bigpop', v: .7 },                                                                // "THE STARS!"
    { t: Lend('dot', 'The stars!') + .02, type: 'cheer' },                                                 // reo vui ngay sau lời (lời rõ)
  ];
};

export const EV = [...hook(), ...map(), ...sun(), ...lp1(), ...ants(), ...steps(), ...lp2(), ...stars(), ...flash(), ...edge(), ...home(), ...song(), ...bye()]
  .filter(e => e.t >= 0 && e.t < DUR).sort((a, b) => a.t - b.t).map(e => ({ ...e, t: +e.t.toFixed(3) }));
