// LONG-002 · sự kiện âm thanh, khớp với chuyển động trong scenes.js (core/render/events.mjs → events.json → mix.py). Bảng cue: SOUND.md.
// Mọi mốc lấy từ timeline.js (HIT, LINES), nên tự khớp khi giọng thật đổi độ dài câu.
import { HIT as h, LINES, DUR } from './timeline.js';

const Lb = (who, text, nth = 0) => LINES.filter(l => l.who === who && l.text === text)[nth];
const L0 = (who, text, nth) => Lb(who, text, nth).t;
const span = (who, text, nth) => { const l = Lb(who, text, nth); return [l.t, l.t + l.dur]; };
const lerp = (a, b, u) => a + (b - a) * u;
// số đếm nảy theo lời Dot: 4 số trải trên câu thứ nhất, 4 số trên câu thứ hai (khớp countPop ở scenes.js)
const count8 = (a, b, type, o = {}) => [0, 1, 2, 3, 4, 5, 6, 7].map(i => ({ t: i < 4 ? lerp(a[0], a[1] - .3, i / 3) : lerp(b[0], b[1] - .3, (i - 4) / 3), type, n: i, ...o }));
const slot = (name, n) => [{ t: h[name], type: 'cluefly' }, { t: h[name] + .6, type: 'slot', n }];   // biểu tượng bay lên ô manh mối (0,6 s) rồi lấp ô
const iris = name => ({ t: h[name] - .45, type: 'lensiris' });                                     // chuyển cảnh: kính lớn dần (film.js IRIS)

const hook = () => [
  { t: 0, type: 'titlepop' }, { t: .02, type: 'wordpop', n: 0 }, { t: .14, type: 'wordpop', n: 1 },          // WHO SNUCK / IN?! nảy từng dòng
  { t: 0, type: 'zing', d: 1.6 },                                                                         // sợi tơ lóe ngang trang; đuôi "zing" kéo qua cú lia (L-cut)
  { t: h.wiggle, type: 'wiggle', d: 1.0 },                                                                // sticker tơ ngọ nguậy 8 chân
  { t: .7, type: 'tink', m: 100 },
  { t: h.whip, type: 'whip' },                                                                            // lia nhanh sang bàn học
  { t: h.whip + .25, type: 'popup' }, { t: h.whip + .3, type: 'tabs' },                                  // Albie bật dậy, bốn tab dựng đứng
  { t: h.loupeIn, type: 'slidein' }, { t: h.loupeIn + .45, type: 'glint' },                               // Miss Loupe trượt vào, kính lóe
  { t: h.dotPop, type: 'popup', v: .5 }, { t: h.dotPop + .05, type: 'blip', m: 88 },                      // Dot ló ra sau hũ bút
  { t: h.crumbPop, type: 'hop' }, { t: h.crumbPop + .45, type: 'land' },                                  // Crumb nhảy lên cục tẩy
  { t: L0('crumb', 'Can I help? Can I?') + .2, type: 'boing', v: .35 },
  { t: h.lensFlip, type: 'spin', d: .6 }, { t: h.lensFlip + .3, type: 'sparkle' },                        // kính xoay một vòng, lóe
  { t: h.s_title - .35, type: 'lensiris' },
  { t: h.jingle + .05, type: 'zing', d: .7, v: .45 },                                                     // sợi tơ giăng dưới logo
  { t: h.s_scene - .3, type: 'lensiris' },
];
const scene = () => [
  { t: h.page, type: 'page' },
  { t: h.dotClimb, type: 'scurry', d: .5 }, { t: h.dotClimb + .5, type: 'land', v: .6 },
  ...count8(span('dot', 'One, two, three, four...', 0), span('dot', 'five, six, seven, eight!', 0), 'count'),
  { t: h.eight, type: 'bigpop' }, { t: h.eight + .1, type: 'reveal' },                                   // "8 LEGS?!"
  { t: L0('albie', 'Eight legs?! Insects have SIX!') + 1.2, type: 'badge' },                              // huy hiệu 6 trên "tay" trang
  { t: L0('crumb', 'But WHY?'), type: 'qpop' },
  { t: L0('albie', 'Rules are rules!'), type: 'boing', v: .3 },
  { t: h.slots, type: 'slots' },                                                                          // ba ô manh mối "1 2 3" bật ra
  { t: L0('dot', 'Three clues! I counted!') + .2, type: 'tap', m: 91 },
  { t: L0('loupe', "Let's zoom in!", 0) - .3, type: 'lensup' },
];
const c1 = () => [
  { t: h.c1_find, type: 'swish', d: .6, v: .3 }, { t: h.c1_find + .3, type: 'shimmer', d: 1.6 },          // kính lướt dọc sợi tơ
  { t: h.c1_twang, type: 'twang' },                                                                       // Crumb gảy tơ "boing"
  { t: L0('loupe', 'Nope!', 0), type: 'bigpop', v: .8 },
  { t: h.c1_flip, type: 'pageflip' },                                                                     // lật trang → "Baby pictures"
  { t: h.s_c1m + .1, type: 'memory' },
  { t: h.c1_munch, type: 'munch', d: .9 }, { t: h.c1_munch + 1.6, type: 'munch', d: .6, v: .6 },
  { t: h.c1_spin, type: 'silkspin', d: 1.4 },                                                             // nhả nệm tơ (chấm trắng)
  { t: L0('loupe', 'Nope!', 1) + .05, type: 'tink', m: 98 },
  { t: h.c1_hang, type: 'curl' },                                                                         // treo mình chữ J
  { t: h.c1_hang + .9, type: 'pupa' },                                                                    // thành nhộng
  { t: h.c1_hang + 1.3, type: 'unwrap' },                                                                 // nhộng mở
  { t: h.c1_hang + 1.7, type: 'wings', d: .9 }, { t: h.c1_hang + 1.8, type: 'sparkle' },                 // bướm bay ra
  { t: h.flutterIn, type: 'wings', d: .9 }, { t: h.flutterIn + .9, type: 'land', v: .6 },
  { t: L0('crumb', 'So Flutter is a suspect!') + .2, type: 'tap', m: 88 },
  { t: h.c1_mmm, type: 'mmm' }, { t: h.c1_mmm + .02, type: 'bubblepop' },                                // Flutter "Mmm?!"
  ...slot('c1_slot', 0),
];
const c2 = () => [
  iris('s_c2'),
  { t: h.c2_pan, type: 'swish', d: .8, v: .35, lo: 300, hi: 1800 },                                      // máy lia tới bụi tẩy
  { t: L0('loupe', 'Look! Tiny footprints in the eraser dust!') + .3, type: 'tap', m: 86 },
  { t: h.s_c2a, type: 'swish', d: .4, v: .25, up: false },                                                // đổi góc: nhìn thẳng từ trên
  ...count8(span('dot', 'One, two, three, four...', 1), span('dot', 'five, six, seven, eight!', 1), 'print'),   // dấu chân sáng lần lượt
  { t: L0('dot', 'Eight feet in every step!'), type: 'bigpop', v: .8 },
  { t: h.rollo1, type: 'roll', d: 1.4 },                                                                  // Rollo lăn qua (trứng phục sinh)
  { t: h.c2_flutter, type: 'wings', d: .6 }, { t: h.c2_flutter + .6, type: 'pats', n: 6 }, { t: h.c2_flutter + .65, type: 'bubblepop' },
  { t: h.c2_shadow, type: 'shadow', d: 1.4 }, { t: h.c2_shadow + .05, type: 'surprise' },                 // bóng 8 chân có nơ lướt trên tường
  { t: h.c2_shadow + .9, type: 'giggle', v: .5 },                                                         // bóng vẫy chân chào: khúc khích
  ...slot('c2_slot', 1),
];
const c3 = () => [
  iris('s_c3'),
  { t: h.c3_flap, type: 'flap', d: .8 }, { t: h.c3_flap + .15, type: 'surprise', v: .6 },                 // cánh giấy phập phồng dưới sticker
  { t: h.c3_flap + 1.6, type: 'flap', d: .5, v: .5 },
  { t: h.c3_compare, type: 'wings', d: .7 },                                                              // Flutter bay vào, xoè cánh so
  { t: h.c3_compare + 1.2, type: 'flap', d: .5, v: .5 },
  { t: h.c3_lens, type: 'zoom' },                                                                         // kính lớn trên cánh giấy
  { t: h.c3_lens + .7, type: 'label' }, { t: h.c3_lens + .75, type: 'snip' },                             // "scissor zigzag!"
  { t: h.c3_lens + 1.2, type: 'label', v: .8 }, { t: h.c3_lens + 1.25, type: 'scribble' },                // "pencil lines"
  { t: L0('loupe', "It's paper! With sticky tape!") + .9, type: 'label' }, { t: L0('loupe', "It's paper! With sticky tape!") + .95, type: 'tape' },
  { t: L0('crumb', 'A paper wing? But WHY?'), type: 'qpop' },
  { t: L0('albie', 'A disguise! In MY book!') - .2, type: 'slidein', v: .7 }, { t: L0('albie', 'A disguise! In MY book!') + .2, type: 'tabs', v: .6 },
  { t: h.c3_slot - .6, type: 'scurry', d: .5 },                                                           // Dot chạy vào
  ...slot('c3_slot', 2),
];
const summary = () => {
  const [a, b] = span('loupe', 'Silk... eight feet... a paper wing.');
  return [
    ...[0, 1, 2].map(i => ({ t: lerp(a, b - .4, i / 2), type: 'cluepop', n: i })),                       // ba biểu tượng manh mối nảy lần lượt
    { t: L0('loupe', 'Time for a lineup!'), type: 'bigpop' },                                             // "LINEUP!"
    iris('s_line'),
  ];
};
const lineup = () => [
  { t: h.s_line + .3, type: 'boing', v: .3 },
  { t: h.in_w, type: 'buzzin', d: .7 },                                                                   // Waggle vo ve vào
  { t: h.in_f, type: 'wings', d: .6 },                                                                    // Flutter bay vào
  { t: h.in_c, type: 'hop', v: .8 }, { t: h.in_c + .5, type: 'chirp' },                                   // Chirp nhảy vào, gáy
  { t: h.in_s, type: 'silkdrop', d: .9 },                                                                 // Spindle thả tơ xuống
  { t: h.rollo2, type: 'roll', d: .7 },                                                                   // Rollo lăn vào cuối hàng
  { t: h.s_lw - .5, type: 'tiptoe', d: .5 },                                                              // Dot đi dọc hàng
  { t: h.m_w, type: 'meter', n: 0 }, { t: h.m_f, type: 'meter', n: 1 }, { t: h.m_c, type: 'meter', n: 2 },   // cột đo dâng tới 6: "ding"
  { t: h.s_lf - .5, type: 'tiptoe', d: .5 }, { t: h.m_f - .2, type: 'tiptoe', d: .4 }, { t: h.s_ls - .5, type: 'tiptoe', d: .5 },
  { t: h.m_s6, type: 'meter', n: 3 },
  { t: L0('spindle', 'Six legs! See? I am a bug!') + .3, type: 'wiggle', d: .5, v: .5 },
  { t: L0('loupe', "Let's zoom in!", 1) - .3, type: 'lensup' },
  { t: h.l_lens, type: 'zoom' }, { t: h.l_lens + .3, type: 'wiggle', d: .9, v: .7 },                      // POV: hai chân giấu đang vẫy
  ...[0, 1].map(i => ({ t: L0('dot', 'Seven... eight!') + i * .55, type: 'count', n: 6 + i })),
  { t: h.l_pop, type: 'meterboing' }, { t: h.l_pop + .3, type: 'sparkle' },                               // hai chân bật ra, cột vọt lên 8
  { t: L0('dot', 'EIGHT legs!'), type: 'bigpop', v: .6 },
  { t: L0('spindle', 'Oopsie!') + .05, type: 'giggle', v: .5 },
  { t: h.s_body - .5, type: 'tiptoe', d: .5 },
  ...[0, 1, 2].map(i => ({ t: h.b_w + .25 + i * .45, type: 'bodypop', n: i })),                          // đầu · ngực · bụng của Waggle
  ...[0, 1].map(i => ({ t: h.b_s + .25 + i * .45, type: 'bodypop', n: i, v: .9 })),                      // đầu-ngực · bụng của Spindle
  ...[0, 1, 2].map(i => ({ t: h.a_boing + i * .3, type: 'antboing', n: i })),                            // râu thật nảy "tink"
  { t: h.a_droop, type: 'droop' }, { t: h.a_droop + .7, type: 'paperfall', d: .8 },                       // râu giấy rủ … rơi lả tả
  { t: L0('albie', 'BZZT! Not a bug!', 0) + .05, type: 'bzzt' },
  { t: h.l_up, type: 'silkup', d: 1.2 },                                                                  // Spindle kéo tơ vọt lên
  { t: h.s_lq - .4, type: 'scurry', d: .5 },                                                              // Crumb chạy vào
  { t: L0('crumb', "But did she sneak in? We didn't SEE her!") + .2, type: 'qpop', v: .7 },
  { t: h.rollo + .05, type: 'hmm' }, { t: h.rollo + .6, type: 'roll', d: .8 },                            // Rollo ngó quanh rồi lăn đi
  iris('s_trap'),
];
const trap = () => [
  { t: h.t_bait, type: 'baitpop' },                                                                       // mồi "YOUR STICKER HERE!" lấp lánh
  { t: h.t_bait + .9, type: 'shimmer', d: 1.0, v: .7 },
  { t: h.t_hide, type: 'hide' }, { t: h.t_hide + .3, type: 'scurry', d: .4, v: .7 }, { t: h.t_hide + .6, type: 'swish', d: .35, v: .3 },   // cả đội nấp
  { t: h.t_lamp0 - .08, type: 'lampclick' }, { t: h.t_lamp0 + .05, type: 'night', d: .9 },                // đèn tắt "tách" (J-cut, tiếng vào trước hình)
  { t: L0('dot', 'Shh... one, two, three...') + .1, type: 'tick', m: 84 },
  { t: h.t_come, type: 'tiptoe', d: 2.2, v: .7 }, { t: h.t_come + .5, type: 'creak' },                    // "con bọ" lạ bước dọc sợi tơ, lắc lư
  { t: h.t_come + 2.6, type: 'creak', v: .7 }, { t: h.t_come + 3.6, type: 'tiptoe', d: 2.0, v: .6 },
  { t: L0('dot', 'One, two... six legs!'), type: 'bigpop', v: .5 },                                       // "6?"
  { t: h.t_step, type: 'slip' },                                                                          // trượt chân trên chính sợi tơ
  { t: h.t_tangle, type: 'wrap', d: .5 },                                                                 // cuộn thành cục tơ
  ...[1, 2, 3].map(k => ({ t: h.t_tangle + k * Math.PI / 7, type: 'trampoline', n: k })),                 // nảy như bạt nhún: mỗi lần chạm tơ một "boing", to dần
  { t: h.t_pop, type: 'burst' }, { t: h.t_pop + .1, type: 'sparkle' },                                    // đồ cải trang bung, 8 chân bật ra
  { t: h.t_lamp1 - .05, type: 'lampclick', v: .9 }, { t: h.t_lamp1 + .05, type: 'hop', v: .7 },           // đèn bật, cả đội nhảy ra
  { t: L0('crumb', 'Gotcha!'), type: 'bigpop' },
  { t: L0('dot', 'Eight legs!', 0) + .05, type: 'tap', m: 93 },
  { t: L0('albie', 'BZZT! Not a bug!', 1) + .05, type: 'bzzt' },
];
const confess = () => [
  { t: h.s_conf + .1, type: 'swish', d: .4, v: .25 },
  { t: h.c_sticker, type: 'stickerglow' },                                                                // Spindle giơ sticker tơ lấp lánh
  { t: L0('crumb', "But WHY can't she join?"), type: 'qpop' },
  { t: L0('spindle', 'Okay! Maybe one day?') + 1.5, type: 'tink', m: 96 },
  { t: h.c_give, type: 'swish', d: .6, v: .3 }, { t: h.c_give + .7, type: 'tap', m: 91 },                 // sticker bay sang "tay" trang của Albie
  { t: h.c_up, type: 'silkup', d: 1.2 },                                                                  // Spindle vẫy chân, kéo tơ lên
  { t: h.a_look, type: 'shimmer', d: 1.5, v: .6 },                                                        // Albie một mình ngắm sticker tơ
  { t: h.a_tuck, type: 'swish', d: .5, v: .2 }, { t: h.a_tuck + .9, type: 'ribbon' },                     // giấu dưới ruy băng; ruy băng nảy
  iris('s_recap'),
];
const recap = () => [
  { t: h.stamp + .35, type: 'stamp' },                                                                    // con dấu CASE CLOSED! (chạm trang lúc t0 + .25)
  { t: h.r_q1 + .1, type: 'swish', d: .3, v: .2 },
  { t: L0('dot', 'Six legs!') - .05, type: 'cardpop', n: 0 },                                             // thẻ "6 BUG"
  { t: L0('dot', 'Eight legs!', 1) - .05, type: 'cardpop', n: 1 },                                        // thẻ "8 SPIDER"
  { t: h.r_msg + .1, type: 'sparkle', v: .6 },
  { t: h.s_rollo, type: 'swish', d: .45, v: .3 },
  { t: h.s_rollo + .1, type: 'roll', d: 6.4, v: .5 },                                                     // Rollo lăn ngang khung
  ...[0, 1, 2].flatMap(i => [{ t: h.e_spots + i * 1.2, type: 'cardpop', n: i }, { t: h.e_spots + i * 1.2 + .5, type: 'ring', n: i }]),   // ba khung nhỏ, vòng tròn khoanh Rollo
  iris('s_bye'),
];
const bye = () => {
  const cnt = L0('dot', 'One, two... Two legs! Not a bug either!');
  return [
    { t: h.dotTurn, type: 'swish', d: .4, v: .25 }, { t: h.dotTurn + .1, type: 'popup', v: .4 },          // Dot quay sang người xem
    ...[0, 1].map(i => ({ t: cnt + .1 + i * .55, type: 'count', n: i })),
    { t: cnt + 1.2, type: 'bigpop' },                                                                     // "2 LEGS!"
    { t: h.recall, type: 'recall' },                                                                      // sợi tơ lóe ngang khung đúng như khung 0
    { t: h.spindle, type: 'silkdrop', d: .5, v: .7 },                                                     // Spindle thả xuống
    { t: L0('spindle', 'Is it my turn yet?', 1) + .3, type: 'giggle', v: .5 },
    { t: L0('dot', 'Nope!') - .02, type: 'bigpop', v: .6 },                                              // "NOPE!" cả nhóm
    { t: L0('dot', 'Nope!') + Lb('dot', 'Nope!').dur + .02, type: 'cheer' },                              // reo vui ngay sau lời (lời rõ)
    { t: L0('dot', 'Nope!') + Lb('dot', 'Nope!').dur + .1, type: 'boing', v: .3 },
  ];
};

export const EV = [...hook(), ...scene(), ...c1(), ...c2(), ...c3(), ...summary(), ...lineup(), ...trap(), ...confess(), ...recap(), ...bye()]
  .filter(e => e.t >= 0 && e.t < DUR).sort((a, b) => a.t - b.t).map(e => ({ ...e, t: +e.t.toFixed(3) }));
