// LONG-002 · Who Snuck Into the Bug Book? A Tiny Detective Mystery — một nguồn thời gian duy nhất cho hình, phụ đề, âm thanh.
// 16:9, 1920×1080, 30 fps (QUALITY.md §5). Kịch bản "chảy" như LONG-001: mỗi câu và mỗi mốc nối tiếp mục trước một khoảng gap;
// độ dài thật của câu (dur.js, do tools/lines.mjs sinh từ voice/dur.json) tự đẩy mọi thứ phía sau. Trước khi có giọng: ước lượng theo RATE.
import { D as MEASURED } from './dur.js';
export const BPM = 120, BEAT = 60 / BPM, BAR = BEAT * 4, W = 1920, H = 1080;

const RATE = { loupe: [.32, .35], crumb: [.24, .3], albie: [.42, .4], dot: [.36, .35], spindle: [.34, .35] };   // s/từ, đệm (ước lượng)
const est = (who, text) => { const n = text.split(/\s+/).length, [a, b] = RATE[who]; return +(n * a + b).toFixed(3); };
const S = [];
const L = (who, text, o = {}) => S.push({ k: 'L', who, text, ...o });     // câu thoại: o.gap (mặc định .35 s sau mục trước), o.catch, o.say, o.off
const M = (name, gap = 0, d = 0) => S.push({ k: 'M', name, gap, d });      // mốc hành động: HIT[name] = lúc này + gap; rồi chạy tiếp d giây
const Q = (name, dt) => S.push({ k: 'Q', name, dt });                      // mốc đặt theo lúc câu vừa rồi BẮT ĐẦU (không đẩy thời gian)
const P = s => S.push({ k: 'P', s });                                      // nghỉ s giây (trẻ trả lời, hành động không lời)

/* ======================= MÓC: sợi tơ bạc, sticker 8 chân (≈ 12 s) ======================= */
M('s_hook'); M('zing', 0); M('wiggle', .12);            // khung 0: sợi tơ lóe ngang trang, sticker lạ ngọ nguậy 8 chân; chữ WHO SNUCK IN?! đủ 100%
L('albie', 'An intruder! In MY pages!', { gap: .18, off: 'Albie nói từ ngoài khung 1 s đầu, máy lia sang ngay' });
Q('whip', .9);                                          // máy lia nhanh từ trang sổ sang Albie đứng trên bàn, tab bật dựng
M('loupeIn', .15, .5);                                  // Miss Loupe trượt vào khung, kính lóe dưới đèn bàn
L('loupe', 'Who snuck into the Bug Book?', { gap: 0 });
M('dotPop', .2, .3);                                    // Dot ló ra sau hũ bút
L('dot', "I'll count the clues!", { gap: 0 });
M('crumbPop', .2, .3);                                  // Crumb nhảy lên cục tẩy
L('crumb', 'Can I help? Can I?', { gap: 0 });
L('loupe', 'Every detective needs a lens!', { gap: .3 });
M('lensFlip', -.6, .6);                                 // kính xoay một vòng, lóe sáng
M('s_title', .25); M('jingle');                         // tựa và nhạc hiệu 2 s (qa.py: video dài, cảnh tựa ≤ 2 s, sau móc)
L('loupe', 'Big secrets of tiny bugs!', { gap: .05 });
M('titleEnd', -.03);

/* ======================= HIỆN TRƯỜNG: trang Insects (≈ 30 s) ======================= */
M('s_scene', 0); M('page', 0, .4);
L('loupe', 'The Insects page...', { gap: .1 });
L('loupe', "and a sticker that doesn't belong!", { gap: .2 });
M('dotClimb', .2, .5);                                  // Dot leo lên mép sticker, đếm chân: số nảy trên từng chân
L('dot', 'One, two, three, four...', { gap: 0 });
L('dot', 'five, six, seven, eight!', { gap: .1 });
M('eight', .1, .6);                                     // số 8 to nảy giữa khung
M('s_rule', .1);
L('albie', 'Eight legs?! Insects have SIX!', { gap: .1 });
L('albie', 'This page is for insects only.', { gap: .3 });
L('crumb', 'But WHY?', { gap: .3 });                     // gài trước câu "But WHY can't she?" ở cao trào
L('albie', 'Rules are rules!', { gap: .2 });
M('s_clues', .3); M('slots', 0, .6);                    // ba ô manh mối "1 2 3" (hình kính lúp) hiện dưới mép trên: vòng mở của phim
L('loupe', 'Every intruder leaves clues.', { gap: .1 });
L('dot', 'Three clues! I counted!', { gap: .3 });
L('loupe', "Let's zoom in!", { gap: .2, catch: true });

/* ======================= MANH MỐI 1 · SỢI TƠ (≈ 50 s) ======================= */
M('s_c1', .2); M('c1_find', .2, .6);                    // kính lướt dọc trang, sợi tơ bạc lấp lánh
L('crumb', 'A shiny string!', { gap: .1 });
M('c1_twang', .15, .5);                                 // Crumb gảy sợi tơ: "boing" như dây đàn
L('loupe', "It's silk!", { gap: .15 });
L('crumb', 'Silk? Only spiders make silk!', { gap: .3 });
L('loupe', 'Only spiders?', { gap: .3 });
M('c1_beat', .1, .6);                                   // khựng hài ≤ 1 s
L('loupe', 'Nope!', { gap: 0, catch: true });
M('s_c1a', .2);
L('albie', 'Look! My baby pictures!', { gap: 0 });
M('c1_flip', .1, .8);                                   // Albie lật ngược trang: trang "Baby pictures"
M('s_c1m', 0);                                          // ký ức: Flutter lúc còn là sâu, gặm lá
L('loupe', 'Before Flutter was a butterfly...', { gap: .1 });
L('loupe', 'Flutter was a caterpillar!', { gap: .2 });
M('c1_munch', .1, .8);                                  // sâu Flutter gặm lá, cười
L('loupe', 'And caterpillars make silk too!', { gap: 0 });
M('s_c1n', .1); M('c1_spin', 0, 1.2);                                  // nhả tơ: những chấm trắng xếp thành nệm tơ nhỏ trên cành
L('crumb', 'Ooh! To make a cocoon?', { gap: .1 });
L('loupe', 'Nope!', { gap: .2, catch: true });
L('loupe', 'A tiny silk pad... to hang on while it changes!', { gap: .3 });
M('c1_hang', .1, 2.6);                                  // sâu treo mình chữ J → nhộng → bướm bung cánh
M('s_c1b', .2); M('flutterIn', 0, .8);                  // về bàn: Flutter bay vào, "Mmm?"
L('crumb', 'Flutter made silk once...', { gap: .1 });
L('crumb', 'So Flutter is a suspect!', { gap: .3 });
M('c1_mmm', .1, .9);                                    // Flutter "Mmm?!" ngạc nhiên mà vẫn cười, quạt cánh
M('c1_slot', .1, .8);                                   // biểu tượng sợi tơ bay vào ô 1
L('dot', 'Clue number one!', { gap: 0 });

/* ======================= MANH MỐI 2 · DẤU CHÂN TRONG BỤI TẨY (≈ 40 s) ======================= */
M('s_c2', .3); M('c2_pan', 0, .8);                      // máy lia tới đống vụn tẩy cạnh cục tẩy hồng của The Giant
L('loupe', 'Look! Tiny footprints in the eraser dust!', { gap: 0 });
L('dot', 'Count them with me!', { gap: .3 });
M('c2_count', .2); M('s_c2a', 0);                     // máy nhìn thẳng từ trên xuống; từng dấu chân sáng lên kèm số
L('dot', 'One, two, three, four...', { gap: 0 });
L('dot', 'five, six, seven, eight!', { gap: .1 });
L('dot', 'Eight feet in every step!', { gap: .3 });
M('rollo1', .2, 1.4);                                   // trứng phục sinh: Rollo lăn viên tròn ngang đống bụi, để lại một rãnh thẳng tắp
M('s_c2b', .1);
L('crumb', 'Flutter has six feet...', { gap: .1 });
M('c2_flutter', .1, 1.0);                               // Flutter đáp xuống bụi: in đúng 6 dấu
L('crumb', 'so it was NOT Flutter!', { gap: .1 });
L('loupe', 'Then who has eight legs?', { gap: .3 });
P(1.3);                                                 // trẻ trả lời
M('c2_shadow', 0, 1.0);                                 // bóng 8 chân lướt qua tường dưới đèn bàn: bóng có nơ, vẫy chân chào (vui, không doạ)
L('crumb', 'Did you see that?', { gap: 0 });
M('c2_slot', .2, .8);
L('dot', 'Clue number two!', { gap: 0 });

/* ======================= MANH MỐI 3 · CÁNH GIẤY (≈ 35 s) ======================= */
M('s_c3', .3); M('c3_flap', 0, .8);                     // dưới góc một sticker có gì phập phồng: một chiếc cánh!
L('crumb', 'A wing! A butterfly wing!', { gap: 0 });
M('c3_compare', .2, 1.0);                               // Flutter đứng cạnh, xoè cánh so
L('loupe', 'Hmm. Let me take a closer look.', { gap: 0 });
M('s_c3b', .2); M('c3_lens', 0, .8);                                   // kính lớn: vân giấy, nét bút chì, mép kéo cắt răng cưa, miếng băng dính
L('loupe', "It's paper! With sticky tape!", { gap: .1 });
L('crumb', 'A paper wing? But WHY?', { gap: .3 });
L('loupe', 'Somebody wanted to LOOK like a bug!', { gap: .3 });
L('albie', 'A disguise! In MY book!', { gap: .3 });
M('c3_slot', .2, .8);
L('dot', 'Clue number three!', { gap: 0 });
M('s_sum', .3); M('sum', 0, 1.0);                       // ba manh mối xếp hàng, mũi tên chỉ về một bóng dấu hỏi
L('loupe', 'Silk... eight feet... a paper wing.', { gap: 0 });
L('loupe', 'Time for a lineup!', { gap: .3 });

/* ======================= HÀNG NGHI PHẠM · "LEG-O-METER" (≈ 85 s, cảnh đặc trưng) ======================= */
M('s_line', .3);
L('albie', 'Suspects! Step in line!', { gap: .1 });
M('in_w', .1, .6); M('in_f', 0, .6); M('in_c', 0, .6);  // Waggle vo ve vào, Flutter bay vào, Chirp nhảy vào (gáy một tiếng)
M('in_s', 0, 1.0);                                      // Spindle thả mình xuống trên sợi tơ: áo len sọc ong, hai râu giấy, giấu 2 chân
M('rollo2', .1, .6);                                    // Rollo lăn vào đứng cuối hàng; không ai để ý ("Find Rollo")
L('loupe', 'Count the legs with Dot!', { gap: 0 });
M('s_lw', .2);
L('dot', 'Waggle... one, two, three, four, five, six!', { gap: 0 });
M('m_w', .1, .5);                                       // vạch đo trên thước chân trượt lên số 6: "ding"
L('albie', 'Six legs! A bug!', { gap: 0 });
M('s_lf', .2);
L('dot', 'Flutter... six!', { gap: 0 });
M('m_f', .05, .4);
L('dot', 'Chirp... six!', { gap: .1 });
M('m_c', .05, .4);
L('albie', 'Bug! Bug!', { gap: .1 });
M('s_ls', .3);
L('dot', 'And you... one, two, three, four, five, six!', { gap: 0 });
M('m_s6', .05, .4);
L('spindle', 'Six! See? I am a bug!', { gap: .1 });
L('albie', 'Hmm...', { gap: .3 });
L('loupe', "Let's zoom in!", { gap: .2, catch: true });
M('s_llens', .1); M('l_lens', 0, .8);                   // kính lớn ra sau lưng Spindle: hai chân giấu đang vẫy
L('dot', 'Seven... eight!', { gap: 0 });
M('l_pop', .1, .5);                                     // hai chân bật ra, vạch đo vọt lên số 8: "boing"
L('dot', 'EIGHT legs!', { gap: 0 });
L('spindle', 'Oopsie!', { gap: .2 });
M('s_body', .3);
L('loupe', 'Now count the body parts!', { gap: .1 });
M('b_w', .1, .3);                                       // kính lướt trên Waggle: đầu, ngực, bụng sáng lần lượt
L('dot', 'Waggle: one, two, three!', { gap: 0 });
M('b_s', .1, .3);
L('dot', 'Spindle: one, two!', { gap: 0 });
L('loupe', 'Bugs have three body parts. Spiders have two!', { gap: .3 });
M('s_ant', .3);
L('loupe', 'And one more secret...', { gap: .1 });
M('a_boing', .1, .6);                                   // râu Waggle, Flutter, Chirp nảy lên lần lượt, mỗi cái một tiếng
L('loupe', 'Bugs have two antennae.', { gap: 0 });
M('a_droop', .1, .9);                                   // râu giấy của Spindle rủ xuống... rơi lả tả
L('loupe', 'Spiders have none!', { gap: 0 });
L('spindle', 'Oh! Those were paper.', { gap: .3 });
L('albie', 'BZZT! Not a bug!', { gap: .2, catch: true });
M('l_up', .1);                                          // Spindle kéo tơ vọt lên khỏi khung, vẫy chân chào
L('spindle', 'Is it my turn yet?', { gap: 0 });
M('s_lq', .3);
L('crumb', "But did she sneak in? We didn't SEE her!", { gap: 0 });
L('loupe', "Then let's catch the intruder... in the act!", { gap: .3 });
M('rollo', .1, 1.2);                                    // hàng trống, chỉ còn Rollo đứng cuối, ngó quanh, lăn đi (mốc 'rollo' cho qa.py)

/* ======================= BẪY BAN ĐÊM (≈ 50 s) ======================= */
M('s_trap', .3); M('t_bait', 0, .8);                    // Crumb đặt mồi: khung sticker vàng lấp lánh "YOUR STICKER HERE"
L('crumb', 'My trap! A shiny empty spot!', { gap: 0 });
L('crumb', 'Every intruder wants a spot!', { gap: .3 });
M('t_hide', .2, 1.2);                                   // cả đội nấp: Dot sau cục tẩy, Miss Loupe trong hũ bút, Crumb dưới góc sticker
M('t_lamp0', 0, .4);                                    // đèn bàn tắt "tách": ánh trăng xanh, sao lấp lánh
L('albie', 'Zzz... I am totally asleep...', { gap: .1 });
M('s_wait', .3);
L('dot', 'Shh... one, two, three...', { gap: 0 });
M('t_come', .3, 1.2);                                   // một "con bọ" lạ bước dọc sợi tơ: cánh giấy, áo sọc, râu giấy, đi lắc lư
L('crumb', 'A bug! With wings and stripes!', { gap: 0 });
L('dot', 'One, two... six legs!', { gap: .2 });
L('loupe', 'Hmm... are you sure?', { gap: .3 });
M('s_snap', .2); M('t_step', 0, .8);                    // nó rón rén tới mồi, trượt chân trên chính sợi tơ của mình
M('t_tangle', 0, 1.6);                                  // xoay tròn, cuộn thành cục tơ, nảy bật trên sợi tơ như bạt nhún (khoảnh khắc đặc trưng)
M('t_pop', 0, .8);                                      // đồ cải trang bung ra; 8 chân bật khỏi cục tơ
M('t_lamp1', .05, .4);                                  // đèn bàn bật "tách", cả đội nhảy ra
L('crumb', 'Gotcha!', { gap: 0 });
L('dot', 'Eight legs!', { gap: .1 });
L('albie', 'BZZT! Not a bug!', { gap: .2, catch: true });

/* ======================= THÚ NHẬN (≈ 35 s) ======================= */
M('s_conf', .3);
L('spindle', 'You caught me!', { gap: 0 });
L('spindle', 'I only wanted one page.', { gap: .3 });
M('c_sticker', .1, 1.0);                                // Spindle giơ sticker tự dệt bằng tơ: chân dung của chính cô, lấp lánh
L('crumb', "But WHY can't she?", { gap: .2 }); Q('s_confb', 0);
L('albie', 'Rules are rules.', { gap: .3 });
L('albie', 'This book is for insects.', { gap: .3 });
L('spindle', 'Okay! Maybe one day?', { gap: .3 });       // Spindle cười hy vọng, đặt sticker tơ vào "tay" trang của Albie
M('c_give', .1, .8); M('c_up', 0, 1.2);                 // vẫy chân chào, kéo tơ lên khỏi khung (vui, không buồn: LOOK.cheer)
M('s_alone', .3); M('a_look', 0, 1.6);                  // Albie một mình dưới đèn bàn, ngắm sticker tơ lấp lánh
L('albie', "...I'll think about it.", { gap: 0 });
M('a_tuck', .1, 1.2);                                   // giấu sticker dưới dải ruy băng; ruy băng nảy

/* ======================= KẾT VỤ ÁN, ÔN BÀI, THÔNG ĐIỆP (≈ 30 s) ======================= */
M('s_recap', .3); M('stamp', 0, .6);                    // con dấu CASE CLOSED! đóng lên trang
L('loupe', 'Case closed!', { gap: 0 });
L('loupe', 'Little detectives, remember...', { gap: .3 });
M('r_q1', .2);
L('loupe', 'How many legs does a bug have?', { gap: 0 });
P(1.2);
L('dot', 'Six!', { gap: 0 });
M('r_q2', .3);
L('loupe', 'And a spider?', { gap: 0 });
P(1.0);
L('dot', 'Eight!', { gap: 0 });
M('r_msg', .3);
L('loupe', 'Count carefully... before you decide!', { gap: 0 });

/* ======================= "DID YOU SPOT ROLLO?" (≈ 12 s) ======================= */
M('s_rollo', .4);
L('crumb', 'Wait! Did you spot Rollo?', { gap: 0 });
M('e_spots', .2, 4.6);                                  // ba khung nhỏ: rãnh trong bụi tẩy, cuối hàng nghi phạm, sau hũ bút lúc đặt bẫy

/* ======================= TẠM BIỆT · GAG CUỐI (≈ 12 s) ======================= */
M('s_bye', .3); M('dotTurn', 0, .5);                    // Dot quay sang người xem, giơ chân đếm
L('dot', 'Now let me count YOU!', { gap: 0 });
L('dot', 'One, two... Two legs! Not a bug either!', { gap: .2 });
M('recall', .2, .4);                                    // sợi tơ lóe ngang khung đúng như khung 0 ("zing"), Spindle thả mình xuống giữa khung
M('spindle', 0);
L('spindle', 'Is it my turn yet?', { gap: 0 });
M('s_end', .2);
L('loupe', 'So... is a spider a bug?', { gap: 0 });       // câu hỏi kết cho trẻ trả lời to (qa.py: trong 5,5 s cuối)
P(1.0);
L('crumb', 'Nope!', { gap: 0, catch: true });            // cả nhóm hô "Nope!" cùng trẻ, Spindle cười khúc khích treo ngược
M('end', .6);

/* ---------- dựng lịch: thời gian tuyệt đối cho câu, mốc, tấm phụ đề ---------- */
export const HIT = {}, LINES = [], CARDS = [];
{
  let t = 0, n = 0, card = null, lastT = 0;
  for (const s of S) {
    if (s.k === 'P') { t += s.s; continue; }
    if (s.k === 'Q') { HIT[s.name] = +(lastT + s.dt).toFixed(3); continue; }
    if (s.k === 'M') { HIT[s.name] = +(t + s.gap).toFixed(3); t = Math.max(t, HIT[s.name] + s.d); continue; }
    const id = 'L' + String(++n).padStart(2, '0'), key = `${s.who}|${s.say || s.text}`, dur = MEASURED[key] ?? est(s.who, s.text);
    let t0 = Math.max(t + (s.gap ?? .35), t - .15);
    if (card && t0 < card.t1) {                                  // tấm phụ đề trước chưa hết giờ: ghép vào, hoặc lùi câu này lại
      if (card.parts.length < 3 && (card.text + ' ' + s.text).length <= 78) { card.parts.push({ t: t0, text: s.text }); card.text += ' ' + s.text; }
      else { t0 = card.t1 + .05; card = null; }
    } else card = null;
    const line = { id, who: s.who, t: +t0.toFixed(3), dur, text: s.text, ...(s.catch && { catch: true }), ...(s.say && { say: s.say }), ...(s.off && { off: s.off }) };
    LINES.push(line); lastT = line.t;
    if (!card) { card = { t0: line.t, t1: 0, text: s.text, parts: [{ t: line.t, text: s.text }] }; CARDS.push(card); }
    card.t1 = +Math.max(card.t0 + 1.8, line.t + dur + .6).toFixed(3);
    line.card = CARDS.length;
    t = line.t + dur;
  }
  HIT.end = Math.max(HIT.end, t + .5);
}
export const DUR = Math.ceil(HIT.end * 2) / 2;
export const CARD_CLASHES = CARDS.filter((c, i) => i + 1 < CARDS.length && c.t1 > CARDS[i + 1].t0).map(c => c.text);
export const PACE = 1;
// Cảnh (mỗi mốc s_… mở một cảnh): để kiểm nhịp dựng và độ dài cảnh trung bình (qa.py)
const sk = Object.keys(HIT).filter(k => k.startsWith('s_')).sort((a, b) => HIT[a] - HIT[b]);
export const SECS = sk.map((k, i) => ({ id: k === 's_title' ? 'title' : k.slice(2), t0: HIT[k], t1: i + 1 < sk.length ? HIT[sk[i + 1]] : DUR }));
export const SEC = Object.fromEntries(SECS.map(s => [s.id, s]));
const lineAt0 = (who, text) => LINES.find(l => l.who === who && l.text === text);

/* ---------- 12 khung storyboard: đặt theo mốc, nên tự đúng chỗ khi giọng thật đổi độ dài câu ---------- */
const at = (name, dt = 0) => +(HIT[name] + dt).toFixed(2);
const atL = (who, text, dt = 0) => +(lineAt0(who, text).t + dt).toFixed(2);
export const BOARD = [
  { t: .05, shot: '1', frame: 'Insert · Insects page at night · frame 0', dur: '1.2 s', line: '(zing!) An intruder! In MY pages!' },
  { t: atL('loupe', 'Who snuck into the Bug Book?', .6), shot: '2', frame: 'Wide · whip-pan to the desk', dur: '4.8 s', line: 'Who snuck into the Bug Book?' },
  { t: atL('dot', 'five, six, seven, eight!', 1.2), shot: '5', frame: 'Push-in · Dot counts the sticker', dur: '9.9 s', line: 'five, six, seven, eight!' },
  { t: atL('crumb', 'Silk? Only spiders make silk!', .8), shot: '8', frame: 'Medium · lens on the silver thread', dur: '8.4 s', line: 'Silk? Only spiders make silk!' },
  { t: at('c1_spin', .9), shot: '10', frame: 'Memory · baby Flutter spins silk', dur: '17 s', line: 'And caterpillars make silk too!' },
  { t: atL('dot', 'Eight feet in every step!', .8), shot: '13', frame: 'Top shot · footprints in eraser dust', dur: '8.3 s', line: 'Eight feet in every step!' },
  { t: at('c3_lens', 1.0), shot: '17', frame: 'Big lens · the paper wing', dur: '9.5 s', line: "It's paper! With sticky tape!" },
  { t: at('rollo2', .9), shot: '20', frame: 'Wide · the LEG-O-METER lineup', dur: '5.7 s', line: 'Count the legs with Dot!' },
  { t: atL('dot', 'Seven... eight!', .9), shot: '23', frame: 'Lens POV · two hidden legs', dur: '4.7 s', line: 'Seven... eight! EIGHT legs!' },
  { t: at('t_tangle', 1.0), shot: '30', frame: 'Medium · the trap: silk trampoline', dur: '3.2 s', line: '(boing! boing!) — signature shot' },
  { t: at('a_look', 1.2), shot: '34', frame: 'Close · Albie and the silk sticker', dur: '5.2 s', line: "...I'll think about it." },
  { t: at('recall', .5), shot: '38', frame: 'Medium · hook recall: the thread returns', dur: '8.0 s', line: 'Is it my turn yet? — So... is a spider a bug?' },
];
