// LAB · Musical Storytelling (chuẩn 11/2026b) dựng lại từ SHORT-015. Một nguồn thời gian duy nhất cho hình, phụ đề, giọng hát, nhạc.
// Bản B, lưới phim 4/4 ở 120 BPM, 12 ô nhịp = 24 s, phát vòng lặp liền. Không đăng: bản thử toàn quy trình mới (_shared/template/).
import { song, resolveLines, cardsOf, cardClashes, resolveSong, STANDARD as STD } from '../../_shared/song.js';
import { VOICES } from '../../_shared/voices.js';
export const STANDARD = STD;
export const BPM = 120, BEAT = 60 / BPM, METER = 4, BAR = BEAT * METER;
export const at = (bar, beat = 0) => (bar * METER + beat) * BEAT;
export const PACE = .85;   // câu NÓI của bản B chậm hơn tập A khoảng 15%; câu hát theo nhịp của bài, câu cửa miệng giữ tốc độ chuẩn

export const DUR = at(12);
// Lượt kéo chân của Hop: danh sách mốc, đùi đi từ cực này sang cực kia giữa hai mốc liền nhau (mỗi khoảng một tiếng "zzip").
// Móc tính theo "thời gian vòng lặp": mốc âm thuộc cuối phim (t + DUR), nên khung cuối nối đúng khung đầu.
const HOOK_STROKES = [-.6, -.38, -.16, .06, .28, .6, .92, 1.24, 1.56, 1.88, 2.2, 2.34, 2.48, 2.62];
const LENS_STROKES = [3.9, 4.3, 4.7, 5.1, 5.5, 5.9, 6.3, 6.7, 7.1];
const LENS2_STROKES = [13.55, 14.0, 14.45, 14.9, 15.35, 15.8];
const B126 = 60 / 126;                                                     // phách của điệp khúc (phần D và F của bài)
const PART_F = 18.6, REP0 = PART_F + 3 * B126;                             // điệp khúc lần 2 vào ở phách 4 của ô đầu phần F (một phách đà)
const REPRISE_STROKES = [0, 1, 2, 3, 4].map(k => +(REP0 + k * B126).toFixed(3));   // Hop kéo "vĩ cầm" theo từng phách
export const HIT = {
  words: [0, .12],
  strokes0: HOOK_STROKES, strokes1: LENS_STROKES, strokes2: LENS2_STROKES, strokes3: REPRISE_STROKES,
  loud0: [-.6, -.38, -.16, .06, 2.2, 2.34, 2.48],                     // lượt kéo to (ngoài lời): có nốt nhạc bật ra
  // móc: Miss Loupe giật mình; hỏi (nửa hát); ngó chân mình, nhấc giày ngọ nguậy (gài đạo cụ gag); tò mò "?"; nhảy sang Hop; kính bật lên
  startle: [.08, .55], wiggle: [1.15, 2.0], curious: [2.2, 2.75], hopTo: [2.9, 3.35], raise: [3.35, 3.6], titleOut: [2.9, 3.25],
  zoom: [3.6, 4.1],
  lensSlide: [5.45, 6.2],                                              // (lab) kính trượt dọc đùi, to thêm: cú máy mới trước khi lao sâu
  deep: [6.6, 7.15],
  // cận cảnh: hàng gai sáng lần lượt; (lab) lia dọc hàng gai; đùi hạ xuống chạm mép cánh; tách từng gai đi lên; điệp khúc: đẩy vào đỉnh gờ
  glint: [7.55, 8.95], pan: [8.05, 9.15], touch: 9.38,
  ticksUp: [9.55, 9.8, 10.05, 10.3, 10.55], ticksDown: [10.95, 11.3, 11.65, 12.0, 12.35],
  chorusIn: [10.75, 11.25], chorusOut: [12.0, 12.45],
  zzzip: [12.62, 13.4], out: [13.35, 13.72],
  violin: 13.78,
  lensDown: [15.5, 16.0],
  // gag: bước ra giữa, nhấc chân, cọ… "squeak", nhạc khựng; Hop chớp mắt rồi cười; "Oops! No pegs!"; điệp khúc lần 2 (Hop kéo theo, Miss Loupe nhún nhảy)
  step: [16.15, 16.5], legUp: [16.6, 16.95], rub: [17.3, 17.85], squeak: 17.9, hush: [17.9, 18.45], giggle: [18.3, 19.1], shrug: [19.3, 19.8],
  reprise: [19.9, 21.95],
  // CTA; chữ móc trở lại; Hop giơ chân sau sẵn sàng; Miss Loupe về chỗ của khung đầu (giữ đúng khoảng cách tới cuối phim như SHORT-015)
  ask: 22.1, ready: [22.85, 23.35], recall: 22.95, home: [23.1, 23.75], loop: [23.4, at(12)],
};
// tách: mỗi gai vấp qua mép cánh (u qua một số nguyên), toạ độ "u" = chỉ số gai đang ở đỉnh gờ mép cánh
export const MACRO_U = [[6.6, -4.2], [9.3, -.55], [9.55, 0], [9.8, 1], [10.05, 2], [10.3, 3], [10.55, 4], [10.7, 4.42], [10.82, 4.35], [10.95, 4], [11.3, 3], [11.65, 2], [12.0, 1], [12.35, 0], [12.5, -.42], [12.62, -.5]];
export const SECS = [
  { id: 'stage', t0: 0, t1: HIT.zoom[0] },
  { id: 'lens', t0: HIT.zoom[0], t1: HIT.deep[0] },
  { id: 'macro', t0: HIT.deep[0], t1: HIT.out[1] },
  { id: 'lens2', t0: HIT.out[1], t1: HIT.lensDown[0] },
  { id: 'gag', t0: HIT.lensDown[0], t1: DUR },
];

// ---------- bài hát của tập (Rê giáng trưởng, "Leg-Violin Tango"): mỗi phần một BPM và một vòng hợp âm; câu hát theo đúng phần chứa nó ----------
export const SONG = song({
  key: 'Db', film: BPM,
  motif: '3:.5 3:.25 5:.25 6:1',                                           // giai điệu đặc trưng = câu mở của điệp khúc ("Pegs on the LEG"): nhạc cụ chơi lại lúc "zzzzip!"
  parts: [
    { t0: 0, bpm: 120, chords: 'Db Ab7' },                                 // A · móc (câu hỏi nửa hát)
    { t0: HIT.zoom[0], bpm: 108, chords: 'Gb Db' },                        // C · kính và cận cảnh hàng gai
    { t0: HIT.touch, bpm: 126, chords: 'Db Gb Ab7 Db' },                   // D · tách từng gai + điệp khúc lần 1
    { t0: HIT.zzzip[0], bpm: 132, chords: 'Db Gb Ab Db' },                 // E · "zzzzip!" và vĩ cầm (cao trào)
    { t0: PART_F, bpm: 126, chords: 'Db Gb Ab7 Db' },                      // F · điệp khúc lần 2 (cùng nhịp với D, vào ở phách 4 như lần 1)
  ],
});
const CHORUS = { mode: 'sing', chorus: 'pegs', notes: "3:.5 3:.25 5:.25 6:1 5:.5 3:.25 5:.25 1':.75" };   // "Pegs on the | LEG, scrape on the WING!": phách đà, LEG ở phách 1, WING ở phách 3

// t, dur của câu NÓI: độ dài thật (voice/dur.json). Câu HÁT: song.js suy ra từ bản nhạc (sing.at = lúc nốt đầu vang).
// em: từ nhấn trên phụ đề (màu + cỡ); cta: câu kêu gọi cuối (ngắn, cụ thể, hợp Made for Kids). Hop không lời.
export const LINES = resolveLines(SONG, VOICES, [
  { id: 'L01', who: 'loupe', text: 'Could you sing with your legs?', em: ['sing', 'legs'], card: 1,
    sing: { mode: 'half-sing', at: .5, notes: "5:.5 5:.5 3:.5 5:.5 6:.5 1':1" } },                           // câu móc: hỏi, đi lên, vui
  { id: 'L02', who: 'loupe', t: 2.8, dur: .999, text: "Let's zoom in!", em: ['zoom'], catch: true },        // câu cửa miệng: nói, tương phản
  { id: 'L03', who: 'loupe', text: "Watch Hop's back leg!", em: ['leg'],
    sing: { mode: 'sing-talk', at: 4.156, notes: '5:.5 5:.5 6:.5 5:1' } },
  { id: 'L04', who: 'loupe', text: 'Look! A row of tiny pegs!', em: ['pegs'],
    sing: { mode: 'half-sing', at: 6.933, notes: '5:.5 3:.5 3:.5 5:.5 6:.5 5:.5 6:1' } },                    // khám phá: nhẹ, có nhịp
  { id: 'L05', who: 'loupe', text: 'Pegs on the leg, scrape on the wing!', em: ['pegs', 'leg', 'wing'],
    sing: { ...CHORUS, at: HIT.touch + 3 * B126 } },                                                         // điệp khúc lần 1 (phách 4 của ô đầu phần D)
  { id: 'L06', who: 'loupe', text: "It's like a violin bow!", em: ['violin', 'bow'],
    sing: { mode: 'half-sing', at: 13.756, lyr: "It's like a vi-o-lin bow", notes: '5:.5 5:.5 5:.5 6:.5 5:.5 3:.5 5:.5' } },   // ẩn dụ, nói rõ bằng hình
  { id: 'L07', who: 'loupe', t: 16.15, dur: 1.107, text: 'Let me try!', em: ['try'] },                     // mở gag: nói
  { id: 'L08', who: 'loupe', t: 18.4, dur: 1.43, text: 'Oops! No pegs!', em: ['pegs'] },                   // gag nối về bí mật: nói
  { id: 'L10', who: 'loupe', text: 'Pegs on the leg, scrape on the wing!', em: ['pegs', 'leg', 'wing'],
    sing: { ...CHORUS, at: REP0 } },                                                                         // điệp khúc lần 2: trẻ hát theo
  { id: 'L09', who: 'loupe', t: HIT.ask, dur: 1.736, text: 'Can YOU make music with your legs?', em: ['you', 'legs'], pace: 1, cta: true },   // CTA: câu hỏi cho trẻ trả lời to
]);
export const SECRET = { kw: ['pegs', 'leg', 'wing'] };                       // từ khoá của bí mật: phụ đề nhấn, CTA nhắc lại
// Tấm phụ đề ≤ 7 từ, mỗi tấm một câu, chữ hiện từng từ theo lúc hát / nói; không có phụ đề khi chữ móc đang trên hình.
export const CARDS = cardsOf(LINES, DUR, { max: 7, hide: [0, HIT.titleOut[1]] });
export const CARD_CLASHES = cardClashes(CARDS);

// 6 nhịp kể chuyện (Task.md mục C)
export const BEATS = [
  { id: 'hook', t0: 0, t1: HIT.titleOut[0], what: 'Hop kéo "zzip!", nốt bật ra; Miss Loupe giật mình, hát hỏi "Could you sing with your legs?", ngó chân mình' },
  { id: 'setup', t0: HIT.titleOut[0], t1: HIT.deep[0], what: '"Let\'s zoom in!": kính lớn trên chân sau của Hop, kính trượt dọc đùi' },
  { id: 'discovery', t0: HIT.deep[0], t1: HIT.out[1], what: 'Cận cảnh hàng gai, lia dọc hàng gai, mỗi gai một tiếng tách; điệp khúc lần 1; "zzzzip!"' },
  { id: 'surprise', t0: HIT.out[1], t1: HIT.reprise[0], what: 'Vĩ cầm hiện ra; "Let me try!" → "squeak." bé tí, Hop bật cười, "Oops! No pegs!"' },
  { id: 'payoff', t0: HIT.reprise[0], t1: HIT.ask, what: 'Điệp khúc lần 2: Miss Loupe hát, Hop kéo theo từng phách: bí mật thành câu hát dễ nhớ' },
  { id: 'cta', t0: HIT.ask, t1: DUR, what: '"Can YOU make music with your legs?": chữ móc trở lại, vòng lặp' },
];
// Cú máy / thay đổi hình có mục đích, mỗi 2–4 s (Task.md mục B). qa_musical.py so với thay đổi đo được trên hình.
export const SHOTS = [
  { t: 0, kind: 'trung, sân khấu, máy đẩy vào', why: 'hành động ở khung 0: Hop kéo chân, chữ móc nảy, Miss Loupe giật mình' },
  { t: 1.15, kind: 'đẩy nhẹ vào Miss Loupe', why: 'gài đạo cụ gag: cô ngó chân mình, nhấc giày' },
  { t: 2.2, kind: 'Hop kéo một tràng, Miss Loupe nghiêng đầu "?" rồi nhảy sang', why: 'bí ẩn chưa giải; câu cửa miệng có hành động' },
  { t: HIT.zoom[0], kind: 'kính lớn bật lên trên chân sau', why: 'bắt đầu khám phá' },
  { t: HIT.lensSlide[0], kind: 'kính trượt dọc đùi, to thêm', why: 'kính không đứng quá 3 s; chuẩn bị lao sâu' },
  { t: HIT.deep[0], kind: 'lao sâu: cận cảnh toàn mặt kính', why: 'khoảnh khắc wow: hàng gai' },
  { t: HIT.pan[0], kind: 'lia dọc hàng gai', why: 'đếm gai bằng mắt trong lúc hát "a row of tiny pegs"' },
  { t: HIT.touch, kind: 'đùi chạm mép cánh, rung', why: 'bí mật xảy ra: tiếng tách đầu tiên' },
  { t: HIT.chorusIn[0], kind: 'đẩy vào đỉnh gờ mép cánh', why: 'điệp khúc lần 1: thấy gai cào qua mép cánh đúng lúc hát' },
  { t: HIT.zzzip[0], kind: 'rung mạnh, nốt tuôn ra; kính lùi, vĩ cầm hiện bên cạnh', why: 'cao trào "zzzzip!" rồi ẩn dụ "violin bow" nói rõ bằng hình' },
  { t: HIT.lensDown[0], kind: 'kính hạ, về sân khấu', why: 'mở gag' },
  { t: HIT.legUp[0], kind: 'đẩy vào Miss Loupe đứng một chân', why: 'gag: cô bắt chước Hop' },
  { t: HIT.squeak, kind: 'khựng, rung nhẹ; hai nhân vật, Hop cười', why: '"squeak." bé tí: bất ngờ hài và phản ứng' },
  { t: HIT.reprise[0], kind: 'đẩy vào hai nhân vật cùng biểu diễn', why: 'điệp khúc lần 2: trẻ hát theo' },
  { t: HIT.ask, kind: 'Miss Loupe nhìn người xem, chữ móc trở lại, về bố cục khung 0', why: 'CTA và vòng lặp liền' },
];

// 10 khung cho storyboard
export const BOARD = [
  { t: 0.15, shot: '1', frame: 'Medium, stump stage at dusk · loop frame', dur: '2.9 s', line: '(zzip!) ♪ Could you sing with your legs?' },
  { t: 3.1, shot: '2', frame: 'Medium · hops to Hop', dur: '0.7 s', line: "Let's zoom in!" },
  { t: 5.0, shot: '3', frame: 'Big lens on the hind leg', dur: '1.9 s', line: "♪ Watch Hop's back leg!" },
  { t: 8.5, shot: '4', frame: 'Macro: pan along the pegs', dur: '1.1 s', line: '♪ Look! A row of tiny pegs!' },
  { t: 11.2, shot: '5', frame: 'Macro: push to the wing edge', dur: '1.6 s', line: '♪ Pegs on the leg, scrape on the wing!' },
  { t: 13.1, shot: '6', frame: 'Macro: zzzzip!', dur: '0.7 s', line: '(zzzzip!)' },
  { t: 14.8, shot: '7', frame: 'Big lens + violin', dur: '1.8 s', line: "♪ It's like a violin bow!" },
  { t: 18.1, shot: '8', frame: 'Medium · the squeak', dur: '0.4 s', line: 'Let me try! (squeak.)' },
  { t: 21.0, shot: '9', frame: 'Two-shot · they perform', dur: '2.2 s', line: '♪ Pegs on the leg, scrape on the wing!' },
  { t: 22.6, shot: '10', frame: 'Medium → loop', dur: '1.9 s', line: 'Can YOU make music with your legs?' },
];

// Sự kiện âm thanh, khớp với chuyển động trong film.js (core/render/events.mjs → events.json → mix.py). Bảng cue đầy đủ ở SOUND.md.
// run: chuỗi nhịp có chủ đích (Hop kéo chân theo phách, các tiếng tách): qa_musical.py không tính là lặp máy móc.
const speaking = (t, pad = .05) => LINES.some(l => t > l.t - pad && t < l.t + l.dur + pad);
const strokeEv = (list, pan, run, loudList = null) => list.slice(0, -1).map((t, i) => {
  const d = list[i + 1] - t, tt = t < 0 ? t + DUR : t, loud = loudList ? loudList.includes(t) : !speaking(tt + d / 2, .1);
  return { t: +tt.toFixed(3), type: 'scrape', d: +d.toFixed(3), n: i, v: loud ? 1 : .45, pan, run: t < 0 ? run + '-loop' : run };   // lượt kéo cuối phim (vòng lặp) là chuỗi riêng
});
export const EV = [
  // móc: chữ bật; Hop kéo "zzip" (lượt cuối phim nối sang khung đầu), nốt nhạc bật ra; Miss Loupe giật mình rồi đáp; ngó chân, ngọ nguậy giày
  { t: 0, type: 'titlepop' },
  ...HIT.words.map((t, i) => ({ t, type: 'wordpop', n: i })),
  ...strokeEv(HIT.strokes0, -.35, 'hook', HIT.loud0),
  ...[.06, 2.2, 2.48].map((t, i) => ({ t: t + .05, type: 'notepop', n: i, pan: -.3, run: 'hook' })),
  { t: HIT.startle[0], type: 'startle', pan: .4 },
  { t: HIT.startle[1] - .05, type: 'landsoft', pan: .4 },
  { t: HIT.wiggle[0] + .1, type: 'wiggle', d: .7, pan: .4 },
  { t: HIT.curious[0] + .05, type: 'hmm', pan: .35 },
  { t: HIT.hopTo[0], type: 'hopL', pan: .3 },
  { t: HIT.hopTo[1], type: 'landsoft', pan: .15, v: .8 },
  { t: HIT.zoom[0], type: 'zoom' },
  // kính lớn: đùi kéo lên xuống dọc mép cánh; kính trượt dọc đùi
  ...strokeEv(HIT.strokes1, -.1, 'lens'),
  { t: HIT.lensSlide[0], type: 'slide', d: HIT.lensSlide[1] - HIT.lensSlide[0], pan: .2 },
  { t: HIT.deep[0], type: 'deep', d: HIT.deep[1] - HIT.deep[0] },
  // cận cảnh: hàng gai sáng lần lượt; lia dọc hàng gai; đùi hạ xuống chạm mép cánh; tách từng gai; điệp khúc; "zzzzip"; nốt tuôn ra khỏi kính
  { t: HIT.glint[0], type: 'glintrun', d: HIT.glint[1] - HIT.glint[0] },
  { t: HIT.pan[0], type: 'pan', d: HIT.pan[1] - HIT.pan[0], pan: -.2 },
  { t: HIT.touch, type: 'touch' },
  ...HIT.ticksUp.map((t, i) => ({ t, type: 'tick', n: i, v: 1, pan: -.15 + .08 * i, run: 'ticks' })),
  ...HIT.ticksDown.map((t, i) => ({ t, type: 'tick', n: 4 - i, v: .55, pan: .17 - .08 * i, run: 'ticks' })),
  { t: HIT.chorusIn[0], type: 'chorus', pan: 0 },
  { t: HIT.zzzip[0], type: 'zzzip', d: HIT.zzzip[1] - HIT.zzzip[0] },
  { t: HIT.zzzip[0] + .38, type: 'notestream', d: .9 },
  { t: HIT.out[0], type: 'deepout', d: HIT.out[1] - HIT.out[0] },
  // kính lùi: vĩ cầm hiện cạnh kính, cây vĩ kéo cùng nhịp với đùi (tiếng kéo nhỏ dưới lời)
  { t: HIT.violin, type: 'violin', pan: .55 },
  ...strokeEv(HIT.strokes2, -.1, 'lens2'),
  { t: HIT.lensDown[0], type: 'lensdown', d: HIT.lensDown[1] - HIT.lensDown[0] },
  // gag: bước, nhấc chân, cọ… "squeak"; Hop chớp mắt, cười khúc khích; nhún vai
  { t: HIT.step[0], type: 'step', pan: .3 },
  { t: HIT.legUp[0], type: 'legup', pan: .3 },
  { t: HIT.rub[0], type: 'rubtry', d: HIT.rub[1] - HIT.rub[0], pan: .3 },
  { t: HIT.squeak, type: 'squeak', pan: .3 },
  { t: HIT.hush[0] + .25, type: 'blinkhop', pan: -.3 },
  { t: HIT.giggle[0], type: 'giggle', pan: -.3 },
  { t: HIT.shrug[0] + .1, type: 'shrug', pan: .3 },
  // điệp khúc lần 2: Hop kéo "vĩ cầm" theo từng phách, Miss Loupe nhún nhảy; nốt bật ra ở phách đầu và phách cuối
  { t: HIT.reprise[0] + .05, type: 'chorus', pan: 0 },
  ...strokeEv(HIT.strokes3, -.35, 'reprise').map(e => ({ ...e, v: .5 })),
  ...[0, 4].map((k, i) => ({ t: +(HIT.strokes3[k] + .05).toFixed(3), type: 'notepop', n: 3 + i, pan: -.3, run: 'reprise' })),
  // CTA; chữ móc trở lại; Hop giơ chân sau sẵn sàng; Miss Loupe về chỗ của khung đầu
  { t: HIT.ready[0], type: 'ready', pan: -.35 },
  { t: HIT.recall, type: 'recall' },
];
export const SONG_JSON = resolveSong(SONG, DUR);
