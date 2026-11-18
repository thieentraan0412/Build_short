// LONG-003 · Lost at Night! How Do Bugs Find Their Way Home? — một nguồn thời gian duy nhất cho hình, phụ đề, âm thanh.
// 16:9, 1920×1080, 30 fps (QUALITY.md §5). Kịch bản "chảy" như LONG-001/002: mỗi câu và mỗi mốc nối tiếp mục trước một khoảng gap;
// độ dài thật của câu (dur.js, do tools/lines.mjs sinh từ voice/dur.json) tự đẩy mọi thứ phía sau. Trước khi có giọng: ước lượng theo RATE.
import { D as MEASURED } from './dur.js';
export const BPM = 120, BEAT = 60 / BPM, BAR = BEAT * 4, W = 1920, H = 1080;

const RATE = { loupe: [.32, .35], crumb: [.24, .3], albie: [.42, .4], dot: [.36, .35], blink: [.26, .3], rollo: [.46, .45] };   // s/từ, đệm (ước lượng; Rollo già, chậm)
const est = (who, text) => { const n = text.split(/\s+/).length, [a, b] = RATE[who]; return +(n * a + b).toFixed(3); };
const S = [];
const L = (who, text, o = {}) => S.push({ k: 'L', who, text, ...o });     // câu thoại: o.gap (mặc định .35 s sau mục trước), o.catch, o.say, o.off, o.chant, o.cut
const M = (name, gap = 0, d = 0) => S.push({ k: 'M', name, gap, d });      // mốc hành động: HIT[name] = lúc này + gap; rồi chạy tiếp d giây
const Q = (name, dt) => S.push({ k: 'Q', name, dt });                      // mốc đặt theo lúc câu vừa rồi BẮT ĐẦU (không đẩy thời gian)
const P = s => S.push({ k: 'P', s });                                      // nghỉ s giây (trẻ trả lời, hành động không lời)

/* ======================= MÓC: Miss Loupe chạy trên viên tròn của Rollo dưới Dải Ngân Hà (≈ 13 s) ======================= */
M('s_hook'); M('roll', 0);                              // khung 0: Rollo trồng cây chuối đẩy viên tròn; Miss Loupe trên đỉnh viên tròn, chân chạy như người chạy trên khúc gỗ; chữ LOST AT NIGHT! đủ 100%
L('loupe', 'Whoa! Rollo! I can\'t stop!', { gap: .15 });
M('crumbRun', .05, .4);                                 // Crumb chạy theo bên cạnh, râu bay
L('crumb', 'Can I hold the lens?', { gap: 0 });
L('loupe', 'Not NOW!', { gap: .15 });
M('bump', .1, .5);                                      // viên tròn vấp hòn sỏi: "boing", Miss Loupe bay vèo vào bóng tối phía rìa vườn (vạch sao băng nhỏ)
M('s_team', .25);                                       // trên lối đi: cả đội chạy tới, ngó theo
L('albie', 'Miss Loupe is lost... at NIGHT!', { gap: 0 });
L('crumb', 'How do we find her... with no sun?', { gap: .3 });   // câu hỏi xuyên suốt của phim
M('rolloBack', .15, .9);                                // Rollo lăn về, viên tròn có một vết lõm trống
L('rollo', 'Oh my. My ball feels... lighter.', { gap: 0 });
M('s_title', .25); M('jingle');                         // tựa và nhạc hiệu 2 s (video dài; qa.py: cảnh tựa sau móc)
L('loupe', 'Big secrets of tiny bugs!', { gap: .05, cut: true });  // Miss Loupe nhỏ xíu bay ngang bầu trời sao trên tấm tựa
M('titleEnd', -.03);

/* ======================= BẢN ĐỒ VƯỜN · LẬP ĐỘI (≈ 30 s) ======================= */
M('s_map', 0); M('mapOpen', 0, .5);                     // trang "MY GARDEN MAP" của Albie, sao HOME sáng
L('albie', 'My garden map!', { gap: .1 });
L('albie', 'We are here... at home.', { gap: .3 });
L('crumb', 'And Miss Loupe?', { gap: .3 });
M('rolloPoint', .1, .5);
L('rollo', 'She flew off... straight that way.', { gap: 0 });
M('mapArrow', .1, 1.0);                                 // mũi tên chấm chạy thẳng ra khỏi mép bản đồ → dấu "?" to
L('albie', 'Off my map?!', { gap: 0 });                 // các trang của Albie phần phật
M('s_crew', .3);
L('crumb', 'I\'ll lead the way! I\'ll find her!', { gap: 0 });
M('lineUp', .1, 1.0);                                   // cả đội xếp hàng sau Crumb: Dot, Blink, Waggle, Rollo
L('dot', 'Team, count off! One, two, three, four, five!', { gap: 0 });
M('blinkOn', .1, .5);                                   // đèn đuôi Blink bật sáng, soi cả nhóm
L('blink', 'I\'ll be the light!', { gap: 0 });
L('albie', 'I\'ll keep the map. Come home safe!', { gap: .3 });

/* ======================= CÁCH 1 · ONG CHỈ ĐƯỜNG THEO MẶT TRỜI (≈ 30 s) ======================= */
M('s_sun', .3); M('waggleUp', 0, .6);                   // Waggle vọt lên trước đội, lắc mông chuẩn bị nhảy
L('crumb', 'Waggle wants to dance!', { gap: .1 });
M('dance', .1, 2.2);                                    // điệu nhảy số 8, vệt sáng vẽ hình số 8 trong không trung
L('crumb', 'Bees dance to show the way...', { gap: 0 });
L('crumb', 'using the sun!', { gap: .25 });
L('crumb', 'Can you find the sun?', { gap: .4 });
M('tiltUp', .1, 1.2);                                   // máy ngửa lên trời: chỉ có sao (trẻ trả lời)
P(1.0);                                                 // .9: chữ NO SUN? đọc được ≥ 1,9 s (readcheck), trẻ kịp trả lời
L('blink', 'Nope!', { gap: 0, catch: true });
M('dizzy', .1, 1.2);                                    // Waggle xoay vòng chóng mặt (vui), đáp lên viên tròn của Rollo
L('rollo', 'No sun tonight, little bee.', { gap: 0 });
L('crumb', 'Then I\'ll use my antennae!', { gap: .3 });

/* ======================= MISS LOUPE Ở RÌA VƯỜN · lần 1 (≈ 9 s) ======================= */
M('s_lp1', .3); M('lp1', 0, .4);                        // Miss Loupe kẹt trong khe giữa hai phiến đá, vẫn cười, ngắm sao
L('loupe', 'I\'m lost... so I stay put.', { gap: .1 });
L('loupe', 'My friends will find me!', { gap: .3 });     // lời dặn cho trẻ: lạc thì đứng yên chờ

/* ======================= CÁCH 2 · ĐƯỜNG MÙI CỦA KIẾN (≈ 45 s) ======================= */
M('s_ants', .3); M('sniff', 0, .8);                     // Crumb chạm râu xuống đất: khung "ngửi" tròn mở ra, chấm mùi hồng hiện lên
L('crumb', 'Ants follow smell trails!', { gap: .1 });
L('crumb', 'Sniff, sniff... this way!', { gap: .3 });
M('antsCome', .1, 1.4);                                 // gia đình kiến của Crumb bò tới theo đường mùi, chạm râu chào
L('crumb', 'My family! Hi, everyone!', { gap: 0 });
L('dot', 'One, two, three, four, five, six ants!', { gap: .3 });
M('s_march', .3); M('march', 0, 1.0);                   // máy dolly ngang theo hàng kiến: qua cây nấm, dưới chiếc lá, qua hòn sỏi
L('crumb', 'Follow the trail...', { gap: .1 });
M('mush', 0, .6);
L('crumb', 'under the leaf...', { gap: .1 });
M('leafUp', 0, .6);
L('crumb', 'over the pebble!', { gap: .1 });
M('pebble', 0, 1.0);                                    // 1,0 s: chữ OVER! đọc được ≥ 1,9 s (readcheck)
M('s_edge0', .3); M('trailEnd', 0, 1.0);                // đường mùi tắt ở rìa vườn: phiến đá to, cỏ cao, bãi cỏ tối phía trước. Đàn kiến vẫy chào, quay về
L('crumb', 'The trail ends here!', { gap: 0 });
L('rollo', 'The edge of the garden.', { gap: .3 });
M('antsBye', .1, 1.0);

/* ======================= CÁCH 3 · KIẾN SA MẠC ĐẾM BƯỚC (≈ 40 s, chỉ có ở video dài) ======================= */
M('s_think', .3); M('thinkPop', 0, .6);                 // bóng nghĩ của Crumb phình ra
L('crumb', 'No trail? Let me think...', { gap: .1 });
L('crumb', 'My cousins in the desert...', { gap: .3 });
M('s_desert', .1); M('dOut', 0, 1.8);                   // trong bóng nghĩ: sa mạc nắng, một chú kiến sa mạc chân dài đi ra khỏi tổ tìm mồi
L('crumb', 'keep track of their steps!', { gap: .1 });
M('dSeed', .1, .6);                                     // nhặt được một hạt
L('crumb', 'Out... and straight back home!', { gap: .1 });
M('dHome', .1, 2.0);                                    // đi thẳng một mạch về tổ; mỗi bước một vạch nhỏ sáng lên
L('dot', 'I count steps too!', { gap: .1 });
M('s_count', .3); M('steps', 0, .4);                    // về rìa vườn: cả đội bước vào bãi cỏ cao, Dot đếm, số nảy trên từng dấu chân
L('dot', 'One, two, three, four, five...', { gap: .1 });
L('dot', 'six, seven, eight, nine, ten!', { gap: .1 });
L('dot', 'Ten steps from the trail!', { gap: .3 });
L('crumb', 'So we can find our way back!', { gap: .3 });

/* ======================= MISS LOUPE Ở RÌA VƯỜN · lần 2 (≈ 9 s) ======================= */
M('s_lp2', .3); M('lp2', 0, .6);                        // Miss Loupe nghiêng kính nhìn xa: sao nhoè thành chấm to
L('loupe', 'I see close things... not far things!', { gap: .1 });
L('loupe', 'I wish cousin Telly were here!', { gap: .3 });   // gài trước Uncle Telly
M('tellyHint', .1, .6);                                 // xa xa trên cọc hàng rào có một ánh lóe nhỏ (không ai để ý)

/* ======================= CÁCH 4 · ROLLO VÀ DẢI NGÂN HÀ (≈ 50 s) ======================= */
M('s_stars', .3);                                       // giữa bãi cỏ cao: chỗ nào cũng giống chỗ nào
L('crumb', 'Which way is straight? It all looks the same!', { gap: 0 });
L('rollo', 'Leave that to me.', { gap: .3 });
M('climb', .1, 1.0);                                    // Rollo trèo lên đỉnh viên tròn, xoay một vòng, ngước nhìn trời
L('rollo', 'I look up... at the Milky Way.', { gap: 0 });
M('s_sky', .2); M('crane', 0, 1.6);                     // CẢNH ĐẶC TRƯNG 1: máy cẩu vút lên, Dải Ngân Hà rực ngang trời
L('crumb', 'Wow... a river of stars!', { gap: .1 });
L('rollo', 'It keeps me rolling straight.', { gap: .3 });
M('s_track', .3); M('straight', 0, 2.0);                // nhìn thẳng từ trên xuống: Rollo lăn, để lại vệt thẳng tắp; cả đội nối đuôi
L('dot', 'So straight!', { gap: 0 });
M('clouds', .9, 1.6);                                   // bóng mây trôi ngang khung, che sao (máy ngửa lên nửa giây rồi về)
L('crumb', 'Oh! Clouds!', { gap: 0 });
M('wiggle', .1, 2.6);                                   // vệt lăn thành ngoằn ngoèo, cả đội đi vòng vèo theo, va nhẹ vào nhau (vui)
L('rollo', 'Oh my. No stars... no straight!', { gap: 0 });
L('crumb', 'Rollo is rolling in wiggles!', { gap: .3 });
M('clear', .2, 1.2);                                    // mây trôi qua, sao trở lại; vệt lăn thẳng lại
L('rollo', 'Stars are back. Straight on!', { gap: 0 });

/* ======================= CÁCH 5 · ÁNH LÓE CỦA UNCLE TELLY, MẬT MÃ CỦA BLINK (≈ 40 s) ======================= */
M('s_telly', .3); M('tellyLook', 0, 1.2);               // rất xa, trên cọc hàng rào: Uncle Telly ngửa ống nhòm quét khu vườn
M('s_bino', .2); M('binoFind', 0, 1.0);                 // nhìn qua ống nhòm (hai vòng tròn): Miss Loupe trong khe đá, vẫy tay
L('loupe', 'Telly! Over here!', { gap: .1 });
M('tellyFlash', .2, 1.8);                               // Uncle Telly nháy tròng kính ba lần (chậm, ≤ 2 lần/giây)
M('s_signal', .1);                                      // về đội: ba chấm lóe nhỏ phía xa trên nền trời
L('crumb', 'Look! A flash! Far away!', { gap: .1 });
L('dot', 'One, two, three flashes!', { gap: .2 });
L('crumb', 'Uncle Telly! He sees far!', { gap: .3 });
L('crumb', 'Blink! Flash your secret code!', { gap: .3 });
M('blinkCode', .1, .2);                                 // Blink nháy đèn đuôi ba lần
L('blink', 'Blink! Blink! Blink!', { gap: 0 });
M('tellyAns', .2, 1.4);                                 // Uncle Telly nháy đáp, giơ tay chỉ xuống một chỗ trong bãi cỏ
L('crumb', 'She\'s over there! Let\'s go!', { gap: 0 });
M('slot5', .1, 1.2);                                    // ô 5 lấp ngay sau lời (tiếng chuông không lấn câu), giữ 1,2 s trước khi sang rìa vườn

/* ======================= CAO TRÀO · RÌA VƯỜN, THE GIANT (≈ 55 s) ======================= */
M('s_edge', .3);                                        // các phiến đá lớn, khe nứt, cỏ cao; Crumb tự soi kỹ
L('crumb', 'Look closely... look closely...', { gap: .1 });
M('sparkle', .1, .8);                                   // một đốm lấp lánh trong khe đá
L('crumb', 'A sparkle! Miss Loupe!', { gap: 0 });
L('loupe', 'Crumb! You found me!', { gap: .3 });
L('crumb', 'Hold on! We\'ll pull you out!', { gap: .3 });
M('pull', .1, 2.0);                                     // cả đội nối thành chuỗi kéo: "heave!", khe đá không nhúc nhích (vui)
M('thump', .2, .9);                                     // THỊCH: đất rung một nhịp, một bóng khổng lồ phủ lên cả đội
L('crumb', 'Is it a monster?', { gap: 0 });
P(.5);
L('dot', 'Nope!', { gap: 0, catch: true });
L('rollo', 'It\'s the Giant. A gentle friend.', { gap: .3 });
M('hand', .1, 1.4);                                     // bàn tay The Giant hạ xuống nhẹ nhàng; ngón tay nghiêng phiến đá, Miss Loupe bật ra đứng lên lòng bàn tay
M('lift', .1, 1.0);
M('s_pov', .2); M('pov', 0, .8);                        // CẢNH ĐẶC TRƯNG 2: góc nhìn của The Giant qua chính Miss Loupe; trong kính, cả đội phóng to, vẫy chào
L('crumb', 'Hello, Giant! Thank you!', { gap: .2 });
M('waveAll', .1, 1.8);
M('s_place', .3); M('place', 0, 1.2);                   // bàn tay đặt Miss Loupe xuống lối đi, rồi gạt một chiếc lá to mở đường về
M('leafSweep', .2, 1.2);
L('loupe', 'Thank you, friend!', { gap: 0 });
M('handBye', .1, 1.0);                                  // bàn tay vẫy rồi rời khung (cổ tay luôn ngoài khung)
M('s_found', .3);
L('loupe', 'Crumb, you looked closely... all by yourself!', { gap: 0 });
L('crumb', 'Can I hold the lens... NOW?', { gap: .3 });
L('loupe', 'Yes! NOW!', { gap: .2 });
M('hold', .1, 1.3);                                     // Crumb ôm cán kính, ghé mắt nhìn qua kính; Miss Loupe cười

/* ======================= ĐƯỜNG VỀ · ÔN BÀI (≈ 30 s) ======================= */
M('s_way', .3); M('walkHome', 0, .4);                   // cả đội đi về dưới Dải Ngân Hà; Crumb đi đầu, ôm kính
L('loupe', 'Ants follow...?', { gap: .1 });
P(1.2);
L('crumb', 'Smell trails!', { gap: 0 });
L('loupe', 'Rollo follows...?', { gap: .3 });
P(1.2);
L('rollo', 'The stars!', { gap: 0 });
L('loupe', 'And bees dance with...?', { gap: .3 });
P(1.2);
L('dot', 'The sun!', { gap: 0 });

/* ======================= VỀ NHÀ · BẢN ĐỒ SÁNG LÊN (≈ 20 s) ======================= */
M('s_home', .3); M('albieHop', 0, .6);                  // Albie nhảy cẫng, tab dựng đứng
L('albie', 'You\'re home! All of you!', { gap: .1 });
M('s_glow', .3); M('glow', 0, 3.0);                     // trang bản đồ: mọi chỗ của Mùa 1 sáng lần lượt, đường đi đêm nay sáng xuyên qua
L('albie', 'Look! My whole garden is glowing!', { gap: .2 });
M('newCorner', .2, 1.0);                                // Albie dán thêm một mảnh giấy mới: "GARDEN EDGE"
L('albie', 'And a brand new corner!', { gap: 0 });

/* ======================= THE SIX LEGS SONG (≈ 25 s, chant theo nhịp) ======================= */
M('s_song', .4); M('clap', 0, .5);
L('crumb', 'Six legs, six legs, count them with me!', { gap: .1, chant: true });
L('dot', 'Head, thorax, abdomen... one, two, three!', { gap: .3, chant: true });
L('loupe', 'Two little antennae, sniff and see...', { gap: .3, chant: true });
L('albie', 'That\'s a bug! That\'s a bug!', { gap: .3, chant: true });
M('spindleDrop', .1, .6);                               // Spindle thả mình xuống trên sợi tơ, vẫy 8 chân
L('albie', 'BZZT! Not you, Spindle!', { gap: 0, chant: true });
M('songEnd', .1, .8);                                   // Spindle cười khúc khích, kéo tơ lên; cả dàn nhảy

/* ======================= THÔNG ĐIỆP (≈ 8 s) ======================= */
M('s_msg', .3);
L('loupe', 'Look closely...', { gap: .1 });
L('loupe', 'and you\'ll always find your way!', { gap: .2 });

/* ======================= "DID YOU SPOT SPINDLE?" (≈ 11 s) ======================= */
M('s_spot', .4);
L('crumb', 'Wait! Did you spot Spindle?', { gap: 0 });
M('e_spots', .2, 4.6);                                  // ba khung nhỏ: móc (treo trên cành hoa), rìa vườn (trên mạng giữa hai ngọn cỏ), góc nhìn The Giant

/* ======================= GAG CUỐI · gợi lại móc · cài trước Mùa 2 (≈ 16 s) ======================= */
M('s_bye', .3); M('recall', .2, .8);                    // gợi lại móc: Rollo lăn qua, lần này Crumb (ôm kính) đứng chạy trên viên tròn
L('loupe', 'Crumb! Come back!', { gap: 0 });
L('crumb', 'Not NOW! Yippee!', { gap: .2 });                 // "Wheee!" bị Whisper nghe thành "are we?"
M('pageEdge', .2, 1.0);                                 // Rollo lăn thẳng tới mép trang sổ
L('albie', 'Rollo! That\'s the END of the page!', { gap: 0, say: 'Rollo! That\'s the end of the page!' });   // Kokoro đánh vần "END" thành E-N-D
M('flip', .1, .8);                                      // lật trang: "TÕM!", giọt nước bắn lên, trang sau xanh mặt ao (cài trước Mùa 2)
M('splash', 0, .6);
L('rollo', "Oh my. It's a pond!", { gap: 0 });
M('s_end', .2);
L('loupe', 'So... what does Rollo follow?', { gap: 0 });  // câu hỏi kết cho trẻ trả lời to (qa.py: trong 5,5 s cuối)
P(.9);
L('dot', 'The stars!', { gap: 0, catch: true });         // cả nhóm hô cùng trẻ
M('end', 1.0);                                         // .7: chữ THE STARS! đọc được ≥ 2,1 s; "ta-da" vang sau lời; câu hỏi kết vẫn trong 5,5 s cuối

/* ---------- dựng lịch: thời gian tuyệt đối cho câu, mốc, tấm phụ đề ---------- */
export const HIT = {}, LINES = [], CARDS = [];
{
  let t = 0, n = 0, card = null, lastT = 0;
  for (const s of S) {
    if (s.k === 'P') { t += s.s; continue; }
    if (s.k === 'Q') { HIT[s.name] = +(lastT + s.dt).toFixed(3); continue; }
    if (s.k === 'M') { HIT[s.name] = +(t + s.gap).toFixed(3); t = Math.max(t, HIT[s.name] + s.d); continue; }
    const id = 'L' + String(++n).padStart(3, '0'), key = `${s.who}|${s.say || s.text}`, dur = MEASURED[key] ?? est(s.who, s.text);
    let t0 = Math.max(t + (s.gap ?? .35), t - .15);
    if (card && s.cut) { card.t1 = Math.min(card.t1, +(t0 - .05).toFixed(3)); card = null; }   // o.cut: câu này mở tấm phụ đề mới (không ghép vào câu trước)
    if (card && t0 < card.t1) {                                  // tấm phụ đề trước chưa hết giờ: ghép vào, hoặc lùi câu này lại
      if (card.parts.length < 3 && (card.text + ' ' + s.text).length <= 78) { card.parts.push({ t: t0, text: s.text }); card.text += ' ' + s.text; }
      else { t0 = card.t1 + .05; card = null; }
    } else card = null;
    const line = { id, who: s.who, t: +t0.toFixed(3), dur, text: s.text, ...(s.catch && { catch: true }), ...(s.chant && { chant: true }), ...(s.say && { say: s.say }), ...(s.off && { off: s.off }) };
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
// độ dài từng shot (bảng shot ở TREATMENT.md §7, theo mốc hiện tại; cập nhật khi có giọng thật)
const SHOT_DUR = { 1: '5.3 s', 3: '9.5 s', 5: '13.3 s', 8: '9.3 s', 12: '10.0 s', 16: '10.0 s', 20: '6.5 s', 22: '14.5 s', 24: '2.6 s', 28: '8.8 s', 30: '4.1 s', 35: '10.2 s' };
export const BOARD = [
  { t: .05, shot: '1', frame: 'Wide · Loupe on Rollo\'s ball · frame 0', sec: 'hook', line: 'Whoa! Rollo! I can\'t stop! — Can I hold the lens? — Not NOW!' },
  { t: atL('rollo', 'Oh my. My ball feels... lighter.', .8), shot: '3', frame: 'Medium · the team, Rollo returns', sec: 'team', line: 'How do we find her... with no sun? — My ball feels... lighter.' },
  { t: at('mapArrow', .9), shot: '5', frame: 'Insert · the garden map', sec: 'map', line: 'She flew off... straight that way. — Off my map?!' },
  { t: at('dance', 1.3), shot: '8', frame: 'Medium · Waggle\'s figure-8', sec: 'sun', line: 'Bees dance to show the way... using the sun!' },
  { t: at('antsCome', 1.6), shot: '12', frame: 'Low medium · sniff view, ants arrive', sec: 'ants', line: 'Ants follow smell trails! — My family! Hi, everyone!' },
  { t: at('dHome', 1.2), shot: '16', frame: 'Thought bubble · the desert ant', sec: 'desert', line: 'My cousins in the desert keep track of their steps!' },
  { t: atL('crumb', 'Wow... a river of stars!', 1.5), shot: '20', frame: 'Low angle · signature 1: Milky Way', sec: 'sky', line: 'Wow... a river of stars! — It keeps me rolling straight.' },
  { t: at('wiggle', 1.9), shot: '22', frame: 'Top shot · clouds: wiggly track', sec: 'track', line: 'Oh my. No stars... no straight!' },
  { t: at('binoFind', .9), shot: '24', frame: 'Binocular POV · Telly finds Loupe', sec: 'bino', line: 'Telly! Over here!' },
  { t: at('thump', .5), shot: '28', frame: 'Wide · garden edge, giant shadow', sec: 'edge', line: 'Is it a monster? — Nope! It\'s the Giant. A gentle friend.' },
  { t: at('waveAll', .9), shot: '30', frame: 'Giant POV through Loupe · signature 2', sec: 'pov', line: 'Hello, Giant! Thank you!' },
  { t: at('glow', 2.6), shot: '35', frame: 'Insert · the map lights up', sec: 'glow', line: 'Look! My whole garden is glowing!' },
].map(b => ({ ...b, dur: SHOT_DUR[b.shot] }));
