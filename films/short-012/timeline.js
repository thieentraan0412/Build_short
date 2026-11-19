// SHORT-012 · This Bug Can Fly Backwards! — timeline (chuẩn 11/2026b, _shared/QUALITY.md §8; dựng lại theo SHORT-016, Task.md 19/11/2026).
// Một nguồn thời gian duy nhất cho hình, phụ đề, giọng nói, nhạc. Bản B: lưới phim 4/4 ở 120 BPM, 12 ô nhịp (mỗi ô 2 s) = 24 s, phát vòng lặp
// liền mạch: Zip bay lùi ra phải rồi lao tới lại đúng khung đầu.
// Bài hát của tập "Reverse-Gear Reggae" (Rê giáng trưởng). Bí mật: chuồn chuồn bay lùi được và đứng yên giữa trời nhờ hai cặp cánh đập so le →
// điệp khúc "Front wings up, back wings down!" (lần 1 ở cảnh soi chậm bốn cánh trong kính, lần 2 sau cú "BONK!", ngay trước câu hỏi kết).
// KHÔNG AI HÁT (QUALITY.md §8.3): mọi câu là giọng TTS gốc; câu theo phách viết `tune`; giai điệu điệp khúc do nhạc cụ chơi.
// Miss Loupe luôn như SHORT-015 (§9.10: af_heart, lời dẫn .765, câu cửa miệng .9, ngữ điệu TTS gốc).
// (19/11/2026) Để điệp khúc lần 2 vừa 24 s, câu "I can go backwards too!" của gag thành hành động: Miss Loupe dang tay làm cánh, đi lùi "bíp bíp".
import { song, resolveLines, cardsOf, cardClashes, resolveSong, STANDARD as STD } from '../../_shared/song.js';
import { VOICES, CATCH_TUNE } from '../../_shared/voices.js';
export const STANDARD = STD;
// mốc từ thật của câu nói (voice/words.js, _shared/tools/wordtimes.py ghi sau bước giọng): phụ đề chạy chữ đúng lúc nói
const WORDT = await import('./voice/words.js').then(m => m.default).catch(() => ({}));
// độ dài thật của từng câu (voice/dur.js, tools/lines.mjs ghi từ voice/dur.json): câu theo phách lấy dur ở đây
const DURS = await import('./voice/dur.js').then(m => m.default).catch(() => ({}));
export const BPM = 120, BEAT = 60 / BPM, METER = 4, BAR = BEAT * METER;
export const at = (bar, beat = 0) => (bar * METER + beat) * BEAT;
export const PACE = .85;                                      // bản B: lời dẫn chậm hơn ~15 % (Miss Loupe dùng pace .85 của voices.js)
export const DUR = at(12);
// đỉnh "cánh trước lên cao nhất" trong soi chậm: chu kỳ 1,25 s (hai lần rưỡi phách ở 120 BPM)
export const SLOW = { t0: 8.85, cyc: 1.25 };
// phần của bài hát (mỗi phần một BPM ≥ 108): t0 và phách
const B126 = 60 / 126, B108 = 60 / 108;
const P_ZOOM = 3.25, P_BACK = 4.5, P_STILL = 7.0, P_SLOW = 9.1, P_CH2 = 19.0;
const hb = (t0, b, k) => +(t0 + k * b).toFixed(4);            // phách thứ k (có thể lẻ .5) của phần bắt đầu ở t0

export const HIT = {
  words: [0, .12],
  // móc: Zip lao tới (từ cuối phim), phanh kít trước kính; bay lùi; đứng yên; lao tới, phanh, lùi lần nữa; Miss Loupe hoa mắt
  brake: .42, back1: [.62, 1.45], dash2: [1.95, 2.2], brake2: 2.2, back2: [2.32, 2.78], dizzy: [2.45, 3.15], titleOut: [2.85, 3.2],
  // "Let's zoom in!" → kính lớn
  zoom: [4.25, 4.75],
  // trong kính: bay lùi; phanh; đứng yên (STILL!); quay mặt ra; soi chậm bốn cánh (mỗi nửa nhịp cánh một tiếng)
  lback: [5.45, 6.85], lbrake: 6.85, still: 7.05, turn: [7.2, 7.8], slow: [SLOW.t0, SLOW.t0 + .3],
  strokes: [0, 1, 2, 3, 4, 5].map(i => +(SLOW.t0 + .625 + i * .625).toFixed(3)).filter(t => t < 12.1), happy: 11.9,
  // chụp → match cut thành sticker → trang sổ
  snap: 12.2, zoomIn: [12.3, 12.6], zoomOut: [12.6, 12.95], stamp: 13.1,
  // sổ: Zip bay vào, đứng yên cho Albie đếm chân; lùi đuôi vào trang đúng chữ "go!"
  zipIn: [13.15, 13.65], counts: [13.6, 13.85, 14.1], reverse: [14.7, 15.15], gulp: 15.15, mini: 15.35,
  flip: [15.85, 16.3],
  // gag: Miss Loupe dang tay làm cánh, đi lùi "bíp bíp"; Albie trợn mắt; "bộp" vào góc sách; "Watch the corners!", góc sách lấp lánh
  wings: [16.3, 16.6], stepsBack: [16.5, 17.5], beeps: [16.6, 16.92, 17.24], notice: 16.7, bump: 17.5, glint: 18.5,
  // điệp khúc 2: Zip trên cao đập cánh so le (tô hai màu, mũi tên lên/xuống), Miss Loupe vỗ tay theo như cánh
  ch2: [P_CH2 + .38, P_CH2 + 2.95],
  // câu hỏi kết; Albie nhảy ra; Zip bay lùi ngang khung ra phải; chữ móc trở lại; "rewind", Zip lao tới lại từ bên phải (khung đầu)
  albieOut: [22.0, 22.75], zipBack: [22.2, 23.3], recall: 23.0, spin: 23.45, loop: [23.45, at(12)],
};
export const SECS = [
  { id: 'garden', t0: 0, t1: HIT.zoomIn[0] },
  { id: 'album', t0: HIT.zoomIn[0], t1: HIT.flip[1] },
  { id: 'gag', t0: HIT.flip[1], t1: DUR },
];

// ---------- bài hát của tập: "Reverse-Gear Reggae", Rê giáng trưởng; mỗi phần một BPM và một vòng hợp âm ----------
export const SONG = song({
  key: 'Db', film: BPM,
  motif: '3:.5 4:.5 5:1 r:.5 4:.5 2:.5 1:1.5',                // câu điệp khúc: leo lên "UP", rơi xuống "DOWN" như hai cặp cánh
  parts: [
    { t0: 0, bpm: 120, chords: 'Db Gb' },                      // A · móc: "Could you fly backwards?" (reggae one-drop)
    { t0: P_ZOOM, bpm: 126, chords: 'Gb Ab' },                 // B · "Let's zoom in!"
    { t0: P_BACK, bpm: 108, chords: 'Db Bbm Gb Ab' },          // C · trong kính: bay lùi
    { t0: P_STILL, bpm: 108, chords: 'Gb Db' },                // D · trong kính: đứng yên giữa trời
    { t0: P_SLOW, bpm: 120, chords: 'Db Ab Bbm Gb' },          // E · soi chậm bốn cánh: điệp khúc lần 1 (sổ, gag không có câu theo phách)
    { t0: P_CH2, bpm: 120, chords: 'Db Ab Db Gb' },            // F · điệp khúc lần 2 và câu hỏi kết (cùng lưới, cùng hợp âm ở ô của điệp khúc)
  ],
});
// "Front wings UP, back wings DOWN!": leo lên La giáng ở "UP" (phách mạnh, hợp âm La giáng), rơi về Rê giáng ở "DOWN"
const CHORUS = { mode: 'sing', chorus: 'wings', notes: '3:.5 4:.5 5:1 r:.5 4:.5 2:.5 1:1.5' };

// t, dur của câu nói thường: độ dài thật (voice/dur.json). Câu theo phách (tune): t từ bản nhạc, dur từ voice/dur.js.
// em: từ nhấn trên phụ đề; cta: câu kêu gọi cuối (≤ 2 s, cụ thể, Made for Kids). emo: cảm xúc của câu (Lớp Voice; Miss Loupe không uốn).
export const LINES = resolveLines(SONG, VOICES, [
  { id: 'L01', emo: 'curious', who: 'loupe', text: 'Could you fly backwards?', em: ['fly', 'backwards'],
    tune: { mode: 'half-sing', at: .5, notes: "3:.5 4:.5 5:1 6:.5 1':1.5" } },                               // câu móc: hỏi, leo lên Rê giáng cao
  { id: 'L02', emo: 'excited', who: 'loupe', text: "Let's zoom in!", em: ['zoom'], catch: true, tune: { ...CATCH_TUNE.zoom, at: hb(P_ZOOM, B126, .5) } },
  { id: 'L03', emo: 'surprised', who: 'loupe', text: 'Dragonflies can fly backwards!', em: ['dragonflies', 'backwards'], pace: 1,
    why: 'giữ tốc độ .9 của bản 24 s cũ (3,9 âm tiết/s): ở .765 câu dài 2,67 s, đè lên "And stay still in the air!"',
    tune: { mode: 'sing-talk', at: hb(P_BACK, B108, .5), notes: '5:.5 3:.5 5:.5 5:.5 6:.5 5:.5 3:.75' } },   // khám phá: rõ từ
  { id: 'L04', emo: 'calm', who: 'loupe', text: 'And stay still in the air!', em: ['still', 'air'],
    tune: { mode: 'half-sing', at: hb(P_STILL, B108, .5), notes: "5:.5 5:.5 1':.75 6:.25 5:.5 3:.75" } },      // đứng yên: treo ở Rê giáng cao
  { id: 'L05', emo: 'happy', who: 'loupe', text: 'Front wings up, back wings down!', em: ['front', 'up', 'back', 'down'], tune: { ...CHORUS, at: 9.5 } },
  { id: 'L06', emo: 'proud', who: 'albie', t: 13.35, dur: 2.297, text: 'Six legs? In you go!', em: ['legs'], catch: true },
  { id: 'L08', emo: 'playful', who: 'albie', t: 17.62, dur: 1.537, pace: 1, text: 'Watch the corners!', em: ['corners'] },   // gag: nói (lịch sự, buồn cười)
  { id: 'L09', emo: 'happy', who: 'loupe', text: 'Front wings up, back wings down!', em: ['front', 'up', 'back', 'down'], tune: { ...CHORUS, at: 19.5 } },
  { id: 'L10', emo: 'happy', who: 'loupe', text: 'Which way is Zip flying?', em: ['zip', 'flying'], cta: true,
    tune: { mode: 'half-sing', at: 22.25, notes: "5:.5 5:.5 6:.5 1':1 6:.5 2':.5", lyr: 'Which way is Zip fly-ing' },
    was: 'Which way is Zip flying? (tốc độ .9)', why: 'câu hỏi kết cho trẻ trả lời to ("Backwards!"); đọc ở tốc độ lời dẫn .765 thay .9 (4,0 âm tiết/s là nhanh với trẻ 4–8 tuổi), vẫn ≤ 2 s' },
], { durs: DURS });
export const SECRET = { kw: ['backwards', 'still', 'wings', 'flying'] };   // từ khoá của bí mật: phụ đề nhấn, CTA nhắc lại
// Tấm phụ đề ≤ 7 từ, mỗi tấm một câu, chữ hiện từng từ theo lúc nói; không có phụ đề khi chữ móc đang trên hình.
export const CARDS = cardsOf(LINES, DUR, { max: 7, hide: [0, HIT.titleOut[1]], times: WORDT });
export const CARD_CLASHES = cardClashes(CARDS);
const L = id => LINES.find(l => l.id === id);
// hết đoạn nhạc của câu id (nốt cuối của tune): hình nhảy theo điệp khúc chạy hết đoạn nhạc, không dừng khi lời hết
export const spanEnd = id => { const l = L(id), ns = (l.sung || l.tune || {}).notes; return ns && ns.length ? l.t + Math.max(...ns.map(n => n.t + n.d)) + .1 : l.t + l.dur; };
// lúc từ thứ w của câu id vang (giây, tuyệt đối): mốc từ thật của bản nói (voice/words.js); chưa có thì theo nốt của tune
export const wordAt = (id, w) => {
  const l = L(id), r = WORDT[id]; if (r && r[w]) return l.t + r[w][0];
  const n = ((l.sung || l.tune || {}).notes || []).find(n => n.w === w); return n ? l.t + n.t : l.t;
};

// 6 nhịp kể chuyện (Task.md mục C): hook ≤ 3 s
export const BEATS = [
  { id: 'hook', t0: 0, t1: HIT.titleOut[0], what: 'Zip lao tới, phanh kít, bay giật lùi trước mặt Miss Loupe; "Could you fly backwards?"; lần hai, Miss Loupe hoa mắt' },
  { id: 'setup', t0: HIT.titleOut[0], t1: HIT.lback[0], what: '"Let\'s zoom in!": kính lớn bật lên trên Zip' },
  { id: 'discovery', t0: HIT.lback[0], t1: HIT.flip[1], what: 'Trong kính: Zip bay lùi (BACKWARDS!) · phanh, đứng yên giữa trời (STILL!) · soi chậm bốn cánh: điệp khúc lần 1 · sổ: "Six legs? In you go!", Zip lùi đuôi vào trang' },
  { id: 'surprise', t0: HIT.flip[1], t1: L('L09').t, what: 'Gag: Miss Loupe dang tay làm cánh, đi lùi "bíp bíp", BONK vào góc sách: "Watch the corners!"' },
  { id: 'payoff', t0: L('L09').t, t1: L('L10').t, what: 'Điệp khúc lần 2: Zip trên cao đập cánh so le (tô hai màu), Miss Loupe vỗ tay theo; nhạc chơi giai điệu' },
  { id: 'cta', t0: L('L10').t, t1: DUR, what: '"Which way is Zip flying?" (trẻ đáp "Backwards!"): Zip bay lùi ra phải; chữ móc trở lại; Zip lao tới lại như khung đầu' },
];
// cú máy / thay đổi hình có mục đích, mỗi 2–4 s (Task.md mục B); qa_musical.py so với thay đổi đo được
export const SHOTS = [
  { t: 0, kind: 'trung, lối cỏ nhiệt đới; Zip lao vào khung, phanh kít', why: 'hành động ở khung 0, chữ móc nảy' },
  { t: HIT.back1[0], kind: 'rung máy, Zip bay giật lùi (đuôi đi trước)', why: 'phản ứng: Miss Loupe giật mình' },
  { t: HIT.dash2[0], kind: 'lần hai: lao tới, phanh, lùi; Miss Loupe hoa mắt', why: 'bí ẩn chưa giải: bay lùi thế nào?' },
  { t: HIT.zoom[0], kind: 'kính lớn bật lên, máy lùi', why: '"Let\'s zoom in!": vào bí mật' },
  { t: HIT.lback[0], kind: 'trong kính: theo Zip bay lùi (lia trong kính), chữ BACKWARDS!', why: 'bí mật 1 xảy ra thành chuyển động' },
  { t: HIT.lbrake, kind: 'rung nhẹ, phanh; chữ STILL!, đường chấm ngang', why: 'bí mật 2: đứng yên giữa trời' },
  { t: HIT.turn[0] + .3, kind: 'phóng trong kính: Zip quay mặt ra', why: 'chuẩn bị soi chậm' },
  { t: HIT.slow[0] + .2, kind: 'soi chậm: kính tối lại, cánh tô hai màu', why: 'điệp khúc lần 1: cánh trước lên, cánh sau xuống' },
  { t: 11.2, kind: 'phóng sát hơn vào bốn cánh, mũi tên đổi chiều', why: 'thấy rõ hai cặp cánh so le' },
  { t: HIT.zoomIn[0], kind: 'chụp → match cut qua sticker → trang sổ', why: 'chuyển cảnh kính → sổ có chuyển động nối' },
  { t: HIT.counts[1], kind: 'Zip đứng yên giữa trời cho Albie đếm chân', why: 'đứng yên thì mới đếm được' },
  { t: HIT.reverse[0], kind: 'đẩy nhẹ: Zip lùi đuôi vào trang đúng "go!"', why: 'câu cửa miệng có hành động' },
  { t: HIT.flip[0], kind: 'lật trang về lối cỏ', why: 'mở gag' },
  { t: HIT.stepsBack[0], kind: 'máy theo Miss Loupe đi lùi, dang tay', why: 'gag: bắt chước Zip' },
  { t: HIT.bump, kind: 'rung máy, BONK!', why: 'bất ngờ: đụng góc sách của Albie' },
  { t: L('L09').t + .2, kind: 'lùi ra, ngẩng lên Zip đập cánh so le', why: 'điệp khúc lần 2: trẻ đọc theo, nhạc chơi giai điệu' },
  { t: L('L10').t, kind: 'máy lia theo Zip bay lùi ra phải; chữ móc trở lại', why: 'CTA và vòng lặp liền' },
];

// 10 khung cho storyboard
export const BOARD = [
  { t: 0.0, shot: '1', frame: 'Medium, the garden path · loop frame', dur: '1.5 s', line: '♪ Could you fly backwards?' },
  { t: 1.0, shot: '2', frame: 'Medium · Zip flies tail first', dur: '1.3 s', line: '(zip! … rewind)' },
  { t: 2.8, shot: '3', frame: 'Medium · dizzy', dur: '1.4 s', line: '(again!)' },
  { t: 6.3, shot: '5', frame: 'Big lens: backwards', dur: '1.4 s', line: '♪ Dragonflies can fly backwards!' },
  { t: 8.2, shot: '7', frame: 'Big lens: still in the air', dur: '1.4 s', line: '♪ And stay still in the air!' },
  { t: 10.1, shot: '8', frame: 'Big lens: slow-mo, four wings', dur: '2.3 s', line: '♪ Front wings up, back wings down!' },
  { t: 14.4, shot: '11', frame: 'Album', dur: '1.1 s', line: 'Six legs? In you go!' },
  { t: 17.0, shot: '14', frame: 'Medium · walking backwards', dur: '1.0 s', line: '(beep, beep, beep)' },
  { t: 18.2, shot: '15', frame: 'Medium · bonk', dur: '1.9 s', line: 'Watch the corners!' },
  { t: 20.6, shot: '16', frame: 'Medium · Zip counter-strokes (chorus 2)', dur: '2.7 s', line: '♪ Front wings up, back wings down!' },
];

// Sự kiện âm thanh, khớp với chuyển động trong film.js (core/render/events.mjs → events.json → mix.py). Bảng cue đầy đủ ở SOUND.md.
// run: chuỗi nhịp có chủ đích (nhịp cánh trong soi chậm, tiếng "bíp" lùi, Albie đếm) — qa_musical.py không tính là lặp máy móc.
const CH2_FLAPS = [0, 1, 2, 3].map(k => +(SLOW.t0 + Math.ceil((HIT.ch2[0] - SLOW.t0) / .625) * .625 + k * .625).toFixed(3)).filter(t => t < HIT.ch2[1]);
export const EV = [
  // móc: chữ bật; Zip lao tới (tiếng tới từ cuối phim, gấp về đầu), phanh kít; Miss Loupe giật mình; bay lùi; đứng yên; lần hai
  { t: 0, type: 'titlepop' },
  ...HIT.words.map((t, i) => ({ t, type: 'wordpop', n: i })),
  { t: HIT.brake - .02, type: 'brake', pan: .1 },
  { t: HIT.brake + .03, type: 'startle', pan: -.35 },
  { t: HIT.back1[0], type: 'reverse', d: HIT.back1[1] - HIT.back1[0], pan: .3 },
  { t: HIT.back1[1], type: 'hum', d: .5, pan: .45 },
  { t: HIT.dash2[0], type: 'dash', d: HIT.dash2[1] - HIT.dash2[0], pan: .3 },
  { t: HIT.brake2 - .02, type: 'brake', v: .7, pan: .1 },
  { t: HIT.back2[0], type: 'reverse', d: HIT.back2[1] - HIT.back2[0], v: .8, pan: .35 },
  { t: HIT.dizzy[0], type: 'dizzy', d: HIT.dizzy[1] - HIT.dizzy[0], pan: -.35 },
  // kính lớn
  { t: HIT.zoom[0], type: 'zoom', d: HIT.zoom[1] - HIT.zoom[0] },                 // kính lớn bật lên (cả động tác)
  // trong kính: bay lùi; chữ BACKWARDS!; phanh; đứng yên (STILL!); soi chậm; từng nhịp cánh
  { t: HIT.lback[0], type: 'lensback', d: HIT.lback[1] - HIT.lback[0], pan: .2 },
  { t: 4.87, type: 'textpop', n: 0, m: 79 },
  { t: HIT.lbrake, type: 'brake', v: .45, pan: .2 },
  { t: HIT.lbrake + .04, type: 'still', pan: .1 },
  { t: HIT.still + .02, type: 'textpop', n: 1, m: 84 },
  { t: HIT.slow[0], type: 'slowmo', d: .5 },
  { t: P_SLOW + .03, type: 'textpop', n: 2, m: 88 },
  { t: L('L05').t + .1, type: 'chorus', pan: 0 },
  ...HIT.strokes.map((t, i) => ({ t, type: 'stroke', n: i, run: 'strokes', pan: i % 2 ? -.2 : .2 })),
  { t: HIT.happy, type: 'sparkle', pan: .2 },
  // chụp → sticker → sổ
  { t: HIT.snap, type: 'snap' },
  { t: HIT.zoomIn[0], type: 'zoomin', d: HIT.zoomIn[1] - HIT.zoomIn[0] },
  { t: HIT.zoomOut[0], type: 'zoomout', d: HIT.zoomOut[1] - HIT.zoomOut[0] },
  { t: HIT.zoomOut[1], type: 'page' },
  { t: HIT.stamp - .3, type: 'swipe', d: .3, lo: 1800, hi: 8000, pan: .7 },
  { t: HIT.stamp, type: 'stamp' },
  { t: HIT.stamp + .02, type: 'ding', m: 85 },
  // Zip bay vào, đứng yên; Albie đếm chân; Zip lùi đuôi vào trang đúng "go!"
  { t: HIT.zipIn[0], type: 'zip', d: .5, pan: .6 },
  ...HIT.counts.map((t, i) => ({ t, type: 'countA', n: i, run: 'albiecount' })),
  { t: HIT.reverse[0] - .08, type: 'tailin', d: HIT.reverse[1] - HIT.reverse[0] + .08, pan: .3 },
  { t: HIT.gulp, type: 'gulp' },
  { t: HIT.mini, type: 'pops', n: 3, step: .06, m: 92, v: .35 },
  { t: HIT.flip[0], type: 'flip', d: HIT.flip[1] - HIT.flip[0] },
  // gag: dang tay làm cánh; bước lùi "bíp bíp"; Albie trợn mắt; "bộp"; sao nhỏ; góc sách lấp lánh
  { t: HIT.wings[0], type: 'wingsup', pan: -.2 },
  { t: HIT.stepsBack[0], type: 'steps', d: HIT.stepsBack[1] - HIT.stepsBack[0], pan: -.2 },
  ...HIT.beeps.map((t, i) => ({ t, type: 'beep', n: i, run: 'beeps', pan: -.25 + .1 * i })),
  { t: HIT.notice, type: 'notice', pan: .3 },
  { t: HIT.bump, type: 'bonk', pan: .05 },
  { t: HIT.bump + .08, type: 'stars', pan: .1 },
  { t: HIT.glint, type: 'glint', pan: .3 },
  // điệp khúc 2: Zip đập cánh so le, Miss Loupe vỗ tay như cánh
  { t: L('L09').t + .1, type: 'chorus', pan: 0 },
  ...CH2_FLAPS.map((t, i) => ({ t, type: 'flap', n: i, run: 'flaps2', pan: i % 2 ? -.25 : .25 })),
  // câu hỏi; Albie nhảy ra; Zip bay lùi ra phải; chữ móc trở lại; "rewind" và Zip lao tới (nối sang đầu phim)
  { t: HIT.albieOut[0], type: 'hop', pan: .4 }, { t: HIT.albieOut[0] + .38, type: 'hop', pan: .7 },
  { t: HIT.zipBack[0], type: 'reverseout', d: HIT.zipBack[1] - HIT.zipBack[0], pan: 0 },
  { t: HIT.recall, type: 'recall' },
  { t: HIT.spin, type: 'zipin', d: DUR - HIT.spin + .45, pan: .5 },
];
export const SONG_JSON = resolveSong(SONG, DUR);              // tools/lines.mjs ghi vào timeline.json (groove.py song mode, qa)
