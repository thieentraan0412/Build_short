// LONG-001 · một nguồn thời gian duy nhất cho hình, phụ đề, âm thanh. 16:9, 1920×1080, 30 fps (QUALITY.md §5).
// Kịch bản viết dạng "chảy": mỗi câu thoại và mỗi mốc hành động nối tiếp mục trước một khoảng gap.
// Độ dài thật của từng câu (dur.js, do tools/lines.mjs sinh từ voice/dur.json) tự đẩy mọi thứ phía sau, nên đổi một câu không phải căn lại tay.
import { D as MEASURED } from './dur.js';
export const BPM = 120, BEAT = 60 / BPM, BAR = BEAT * 4, W = 1920, H = 1080;
export const at = (bar, beat = 0) => (bar * 4 + beat) * BEAT;

const RATE = { loupe: [.32, .35], crumb: [.24, .3], albie: [.42, .4], dot: [.36, .35], blink: [.3, .3] };   // ước lượng (s/từ, đệm) trước khi có giọng thật
const est = (who, text) => { const n = text.split(/\s+/).length, [a, b] = RATE[who]; return +(n * a + b).toFixed(3); };
const S = [];
const L = (who, text, o = {}) => S.push({ k: 'L', who, text, ...o });     // câu thoại: o.gap (mặc định .35 s sau mục trước), o.catch, o.say
const M = (name, gap = 0, d = 0) => S.push({ k: 'M', name, gap, d });      // mốc hành động: HIT[name] = lúc này + gap; rồi chạy tiếp d giây
const P = s => S.push({ k: 'P', s });                                      // nghỉ s giây (trẻ trả lời, hành động không lời)

/* ======================= MỞ: bông tuyết, sổ đóng băng (≈ 30 s) ======================= */
M('s_hook'); M('flake', .15);
L('loupe', 'Six arms... is it a bug?', { gap: .25 });
M('pull', .2, 1.0);                                   // kéo xa ra bậu cửa sổ
L('albie', 'BZZT! Not a bug!', { gap: -.2, catch: true });
L('albie', 'Six arms are not six legs.');
M('tryOpen', .25);                                    // Albie cố mở sổ: băng kêu răng rắc
L('albie', 'And my pages are... frozen!', { gap: .25 });
M('crumbPop', .3);                                    // Crumb ló ra sau chậu cây, vác viên đường
L('crumb', 'Frozen? Oh no!', { gap: .35 });
M('tabs', .2);                                        // bốn tab sticker trên đầu Albie phủ băng, sáng lần lượt
L('loupe', 'Each page keeps a secret sense.', { gap: .1 });
L('loupe', 'Remember the secret... and the page melts!', { gap: .5 });
M('yawn', .3);
L('albie', "Hurry... I'm getting so sleepy...", { gap: .3 });
L('crumb', "Let's wake up your pages!", { gap: .3 });
M('s_title', .3); M('jingle');                        // tựa và nhạc hiệu 2 s
L('loupe', 'Big secrets of tiny bugs!', { gap: .05 });
M('titleEnd', -.03);                                  // cảnh tựa ≈ 2 s (QUALITY.md §1; readcheck: chữ SECRETS cần ≥ 1,97 s)

/* ======================= CHƯƠNG 1 · VỊ GIÁC: Flutter chọn món ======================= */
M('s_c1', 0); M('c1_page', 0, .3);
L('loupe', 'Page one... taste!', { gap: .1 });
L('crumb', "I'll warm it up!", { gap: .25 });
M('c1_huff', .15, 1.1); M('c1_dive', 0, 1.0);         // Crumb hà hơi → sương tan một vòng → lặn vào ký ức hè
M('s_c1m');
L('loupe', 'Which one will Flutter pick?', { gap: .3 });
M('c1_lab', .15, 1.4);                                // nhãn Lemon? Leaf? Strawberry? bật lần lượt
M('rollo1', 0); P(1.0);                               // trẻ đoán; Rollo lăn ngang mép bàn (trứng phục sinh)
M('c1_fly', 0, 1.1); M('c1_land1', 0, .5);
L('crumb', "That one's not sweet at all!", { gap: .2 });   // "not sweet!" ở giọng Crumb bị nghe thành "not sweeter"                    // FACTS §2: nguồn chỉ nói chân bướm nếm được vị ngọt
M('c1_off1', .2, 1.1); M('c1_land2', 0, .5);
L('crumb', 'Not yummy!', { gap: .1 });
M('c1_off2', .2, 1.1); M('c1_land3', 0, .45); M('c1_mmm', 0, .9);
L('crumb', 'Flutter picked the sweet one!', { gap: .2 });
L('loupe', 'But how did Flutter know?', { gap: .3 });
L('loupe', 'With its tongue... or its feet?', { gap: .3 });
M('c1_count', .3); L('loupe', 'Three... two... one!', { gap: 0 });
P(.9);                                                // trẻ hét đáp án
M('c1_zoom', 0, .35);
L('loupe', 'Its feet!', { gap: 0 });
L('loupe', 'Butterflies taste with their feet!', { gap: .3 });
M('c1_sip', .25, 1.2);
M('c1_out', 0, .8); M('s_c1s'); M('c1_melt', 0, 1.3); // ra khỏi ký ức, băng nứt và tan, sticker sáng
L('albie', 'Secret unlocked!', { gap: .1, catch: true });
L('albie', 'One page warm... three to go!', { gap: .3 });
L('crumb', 'Ooh, this page smells funny!', { gap: .3 });
M('c1_next', .2, .5);

/* ======================= CHƯƠNG 2 · KHỨU GIÁC: mê cung đường mùi ======================= */
M('s_c2', 0); M('c2_page', 0, .2);
L('loupe', 'Page two... smell!', { gap: .1 });
M('c2_lens', .2);                                     // kính đặt lên trang: trong kính hiện đường mùi bạc hà
L('loupe', 'A maze! The trail only shows in my lens.', { gap: .1 });
M('c2_dive', .2, 1.0); M('s_c2m');
L('crumb', "I'll sniff the way with my antennae!", { gap: .2 });
M('c2_walk1', .1, 1.6);
L('loupe', 'Left or right?', { gap: 0 });
P(1.2); M('c2_sniff1', 0, .5);
L('crumb', 'Left!', { gap: 0 });
M('c2_walk2', .15, 1.9);
L('loupe', 'Up or down?', { gap: 0 });
P(1.0); M('c2_wrong', 0, 1.1); M('c2_bonk', 0, .3);   // Crumb lao xuống mà quên ngửi → đụng ngõ cụt
L('loupe', 'Nope!', { gap: 0, catch: true });
L('crumb', 'Oh no! I forgot to sniff!', { gap: .25 });   // "Oops" bị Whisper nghe thành "noobs"
M('c2_sniff2', .15, .6); M('rollo2', 0); M('c2_walk3', 0, 2.2);
L('loupe', 'Left or right?', { gap: 0 });
P(1.0); M('c2_sniff3', 0, .5);
L('crumb', 'Right!', { gap: 0 });
M('c2_walk4', .15, 1.8); M('c2_meet', 0, .3);
M('c2_tap', 0, 1.0);                                  // chạm râu với chị kiến ở giữa mê cung
L('crumb', 'Tap, tap, hello!', { gap: 0 });
L('loupe', 'Ants sniff with their antennae...', { gap: .3 });
L('loupe', '...and follow smell trails!', { gap: .2 });
M('c2_out', .3, .8); M('s_c2s'); M('c2_melt', 0, 1.3);
L('albie', 'Secret unlocked!', { gap: .1, catch: true });
L('albie', 'Two pages warm!', { gap: .3 });
L('crumb', 'Listen! I hear music!', { gap: .3 });
M('c2_next', .2, .5);

/* ======================= CHƯƠNG 3 · THÍNH GIÁC: trốn tìm cái tai ======================= */
M('s_c3', 0); M('c3_page', 0, .2);
L('loupe', 'Page three... hearing!', { gap: .1 });
M('c3_dive', .2, 1.0); M('s_c3m');
M('rollo3', 0); M('c3_band', 0, 2.4);                 // Chirp và Hop chơi nhạc dưới trăng (không lời); Rollo lăn trên đồi xa
L('loupe', "Let's find their ears!", { gap: 0 });
L('loupe', 'Ears go on heads... right?', { gap: .3 });
M('c3_head1', 0, .4);                                 // kính soi đầu Chirp: không có tai
L('crumb', 'Nope! Not there!', { gap: 0 });                 // "Nope!" một chữ ở giọng Crumb bị nghe thành "nobody"
M('c3_down1', .1, 1.6);                               // kính trượt xuống chân trước, cái tai sáng
L('loupe', "Chirp's ears are on its front legs!", { gap: 0 });
M('c3_chirp', .2, .8);
M('s_c3h', .1); L('loupe', 'And Hop? On its head?', { gap: 0 });
M('c3_head2', 0, .4);
L('crumb', 'Nope! Not there!', { gap: 0 });
M('c3_down2', .1, 1.6);                               // kính trượt dọc thân Hop xuống bụng, dưới cánh
L('loupe', "Hop's ears are on its tummy!", { gap: 0 });
M('c3_fiddle', .2, 2.2);                              // Hop kéo "vĩ cầm" bằng chân sau, Chirp gáy theo: buổi hòa nhạc nhỏ
L('crumb', 'Ears on legs... ears on tummies!', { gap: 0 });
M('c3_out', .3, .8); M('s_c3s'); M('c3_melt', 0, 1.3);
L('albie', 'Secret unlocked!', { gap: .1, catch: true });
L('albie', 'Three pages warm!', { gap: .3 });
M('c3_next', .3, .5);

/* ======================= CHƯƠNG 4 · THỊ GIÁC VÀ TÍN HIỆU: Zip, Blink, Waggle ======================= */
M('s_c4', 0); M('c4_page', 0, .2);
L('loupe', 'Page four... sight and signals!', { gap: .1 });
M('c4_dive', .2, 1.0); M('s_c4m');
L('crumb', "I'll sneak up on the dragonfly!", { gap: .2 });   // tên "Zip" ở giọng Crumb bị nghe thành "Zib"
M('rollo4', .1); M('c4_sneak', 0, 2.6); M('c4_spot', 0, .5); M('c4_zip', 0, .5); M('c4_flop', 0, .4);
L('crumb', 'How did Zip see me?', { gap: .2 });
M('c4_zoom', .1, .4);
L('loupe', 'Its giant eyes cover most of its head!', { gap: 0 });
M('c4_night', .3, 1.0); M('s_c4n');                    // trời tối: đom đóm
L('loupe', 'Blink, do you know a secret?', { gap: .1 });
L('blink', "I'm not glowing!", { gap: .25 });
M('c4_glow', 0, .4);                                  // đuôi sáng rực (càng chối càng sáng)
L('loupe', 'Your tail says you do!', { gap: .1 });
M('c4_code', .2, 3.0);                                // Blink nháy mật mã, một bạn ở xa nháy đúng mã đáp lại
L('loupe', 'Some fireflies flash their own secret code!', { gap: 0 });
M('c4_hive', .3, 1.0); M('s_c4h');                     // sang tổ ong: Waggle nhảy
L('loupe', "And Waggle's dance shows the way...", { gap: .1 });
M('c4_point', .2, 1.2);                               // vạch nhảy kéo dài, chỉ ra mép trang
M('c4_out', 0, .8); M('s_c4s'); M('c4_melt', 0, 1.3);
L('albie', 'Secret unlocked!', { gap: .1, catch: true });
L('albie', 'Four pages warm!', { gap: .3 });
M('c4_arrow', .2, 1.0);                               // mũi tên của điệu nhảy chỉ vào trang cuối

/* ======================= CHƯƠNG 5 · CAO TRÀO: trang trống, vườn tuyết, kính nhiệt ======================= */
M('s_c5', 0); M('c5_page', 0, .5);
L('crumb', 'This page is empty!', { gap: .1 });
L('loupe', 'Where do bugs go in winter?', { gap: .3 });
L('albie', 'No memory... no secret...', { gap: .3 });
M('c5_droop', 0, .8);
L('loupe', "Then I'll find a new one... outside!", { gap: .1 });
L('crumb', "I'll keep Albie warm!", { gap: .3 });
M('c5_hug', 0, .2);
L('crumb', "My family's snug under the ground!", { gap: .2 });
M('c5_ants', 0, 1.6);                                 // bong bóng mặt cắt lòng đất: đàn kiến túm tụm giữ ấm
M('c5_exit', 0, 1.2); M('s_c5o');                      // Miss Loupe lách qua khe cửa sổ ra vườn tuyết
L('loupe', 'Brr! So cold!', { gap: .1 });
M('c5_hiveSeen', .2, .8);
L('loupe', 'Is anyone home?', { gap: 0 });
M('c5_heat', .2, .6);                                 // bật "kính nhiệt": quả bóng ong rực cam
L('loupe', 'Honeybees huddle in a warm ball!', { gap: 0 });
M('s_c5r', .3); M('c5_toRock', 0, 1.4); M('c5_lift', 0, .6);          // tới hòn đá, nhấc chiếc lá khô
L('loupe', 'Some ladybugs nap together under leaves!', { gap: .1 });   // FACTS §12: chỉ một số loài trú đông thành đám
M('c5_dotWake', .2, .4);
L('dot', 'One, two, three... so many!', { gap: 0 });
M('c5_dotSleep', .2, 1.0);
M('s_c5w'); M('c5_toLeaf', 0, 1.2);
L('loupe', 'A woolly bear caterpillar!', { gap: .1 });
L('loupe', 'It freezes all winter...', { gap: .3 });
L('loupe', '...and wakes up in spring!', { gap: .2 });
M('c5_found', .2, 1.0);                               // ba bí mật mùa đông: mô-típ bí mật
M('s_c5f'); M('c5_fog', 0, 1.0);
L('loupe', "Oh no! I can't see!", { gap: 0 });
M('c5_lost', .1, 1.4);
L('loupe', 'Heat lens... on!', { gap: 0 });
M('c5_window', .1, .5);                               // trong kính nhiệt: khung cửa sổ nhà ấm rực cam
L('loupe', 'The warm window! That way!', { gap: 0 });
M('c5_home', .2, 2.6); M('c5_in', 0, 1.0);             // lội tuyết về nhà, lách vào trong

/* ======================= KẾT: sổ ấm lại, đố vui, gag, "Did you spot Rollo?" ======================= */
M('s_end', 0); M('e_page', 0, .3);
L('loupe', 'Three winter secrets!', { gap: .1 });
M('e_stick', .1, 1.2);                                // ba sticker mùa đông bay vào trang cuối
M('e_warm', 0, 1.0);
L('albie', 'Secret unlocked!', { gap: 0, catch: true });
L('albie', 'All my pages are warm!', { gap: .3 });
M('s_quiz', .3);
L('crumb', 'Do you remember?', { gap: 0 });
M('q1', .2); L('loupe', 'Where does a butterfly taste?', { gap: 0 }); M('q1c', .2, 2.4); L('crumb', 'With its feet, of course!', { gap: 0 });
M('s_q2', .4); M('q2'); L('loupe', 'What do ants sniff with?', { gap: 0 }); M('q2c', .2, 2.4); L('crumb', 'With their antennae!', { gap: 0 });
M('q3', .4); L('loupe', 'Where does a grasshopper hear?', { gap: 0 }); M('q3c', .2, 2.4); L('crumb', 'On its tummy!', { gap: 0 });
M('q4', .4); L('loupe', 'And where did the ladybugs sleep?', { gap: 0 }); M('q4c', .2, 2.4); L('crumb', 'Together, under leaves!', { gap: 0 });   // FACTS §12
M('s_bye', .4); M('e_yawn', 0, 1.0);
L('crumb', 'Time for a winter nap?', { gap: 0 });
L('loupe', 'See you in spring!', { gap: .3 });
L('loupe', 'Look closely... even in winter.', { gap: .3 });
M('e_sneeze', .3);
L('albie', 'Ah... ah... CHOO!', { gap: 0 });
M('e_fly', 0, 2.6); M('e_land', 0); M('recall', 0, .6);   // sticker bay như tuyết; một tấm đậu lên kính đúng chỗ bông tuyết đầu phim, chữ móc trở lại (QUALITY.md §6)
L('loupe', "Now THAT'S a bug!", { gap: 0 });
M('s_rollo', .3); M('e_rollo', 0, 1.4);               // sticker Rollo lăn thẳng tắp dọc bậu cửa sổ (bọ mùa hè chỉ là sticker/ký ức, FACTS ghi chú)
L('loupe', 'Did you spot Rollo?', { gap: 0 });
M('e_spots', .2, 6.0);                                // bốn chỗ Rollo đã trốn
L('crumb', 'Can you find him next time?', { gap: 0 });   // câu hỏi kết cho trẻ trả lời to (QUALITY.md §6)
M('e_end', .3, 2.6);
M('end');

/* ---------- dựng lịch: thời gian tuyệt đối cho câu, mốc, tấm phụ đề ---------- */
export const HIT = {}, LINES = [], CARDS = [];
{
  let t = 0, n = 0, card = null;
  for (const s of S) {
    if (s.k === 'P') { t += s.s; continue; }
    if (s.k === 'M') { HIT[s.name] = +(t + s.gap).toFixed(3); t = HIT[s.name] + s.d; continue; }
    const id = 'L' + String(++n).padStart(2, '0'), key = `${s.who}|${s.say || s.text}`, dur = MEASURED[key] ?? est(s.who, s.text);
    let t0 = Math.max(t + (s.gap ?? .35), t - .15);
    if (card && t0 < card.t1) {                                  // tấm phụ đề trước chưa hết giờ: ghép vào, hoặc lùi câu này lại
      if (card.parts.length < 3 && (card.text + ' ' + s.text).length <= 78) { card.parts.push({ t: t0, text: s.text }); card.text += ' ' + s.text; }
      else { t0 = card.t1 + .05; card = null; }
    } else card = null;
    const line = { id, who: s.who, t: +t0.toFixed(3), dur, text: s.text, ...(s.catch && { catch: true }), ...(s.say && { say: s.say }) };
    LINES.push(line);
    if (!card) { card = { t0: line.t, t1: 0, text: s.text, parts: [{ t: line.t, text: s.text }] }; CARDS.push(card); }
    card.t1 = +Math.max(card.t0 + 1.8, line.t + dur + .6).toFixed(3);
    line.card = CARDS.length;
    t = line.t + dur;
  }
  HIT.end = Math.max(HIT.end, t + .5);
}
export const DUR = Math.ceil(HIT.end * 2) / 2;
export const CARD_CLASHES = CARDS.filter((c, i) => i + 1 < CARDS.length && c.t1 > CARDS[i + 1].t0).map(c => c.text);
export const PACE = 1;   // video dài cho 4–8 tuổi: tốc độ chuẩn (bản B mới chậm hơn)

// Cảnh (mỗi mốc s_… mở một cảnh): để kiểm nhịp dựng và độ dài cảnh trung bình (qa.py)
const sk = Object.keys(HIT).filter(k => k.startsWith('s_')).sort((a, b) => HIT[a] - HIT[b]);
export const SECS = sk.map((k, i) => ({ id: k === 's_title' ? 'title' : k.slice(2), t0: HIT[k], t1: i + 1 < sk.length ? HIT[sk[i + 1]] : DUR }));
export const SEC = Object.fromEntries(SECS.map(s => [s.id, s]));

