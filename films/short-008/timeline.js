// Một nguồn thời gian duy nhất cho hình, phụ đề, âm thanh. Bản B: lưới phim 4/4 ở 120 BPM, 11 ô nhịp (mỗi ô 2 s) = 22 s, phát vòng lặp liền mạch.
export const BPM = 120, BEAT = 60 / BPM, METER = 4, BAR = BEAT * METER;
export const at = (bar, beat = 0) => (bar * METER + beat) * BEAT;
export const PACE = .85;   // lời dẫn chậm hơn tập A khoảng 15% (kế hoạch §4.3); câu cửa miệng giữ tốc độ chuẩn

// camp: "lửa trại Blink" (móc → kính lớn → buồng sáng → nhiệt kế → nhịp "ồ", một cảnh liền); album: sổ của Albie; gag: lại trại, đuôi bùng chói, vòng lặp
export const DUR = at(11);
export const HIT = {
  words: [0, .12],
  // móc: Miss Loupe hơ tay, run; băng mọc trên tay, cô giật nảy, vẩy tay; Blink khúc khích; "Watch this!", đuôi bùng sáng
  frost: [.7, 1.15], jolt: 1.2, shake: [1.25, 1.9], giggle0: 1.35, flare: [3.2, 3.8], titleOut: [2.55, 2.9],
  // "Let's zoom in!": giơ kính → bật về phía máy với kính lớn → lao vào trong đèn đuôi
  raise: [3.85, 4.4], zoom: [4.95, 5.45], dive: [5.45, 6.0],
  // buồng sáng: mỗi lần giọt vàng + bong bóng xanh gặp cánh quạt hồng là một tia sáng "pop!" (nhanh dần), rồi buồng sáng bừng lên
  pops: [6.35, 6.8, 7.2, 7.55, 7.85, 8.08, 8.27, 8.42], bloom: 8.6,
  // nhiệt kế trượt vào, run; vạch đỏ chỉ nhích một nấc ở chữ "heat"
  therm: [8.75, 9.2], tick: 10.25,
  // lùi ra khỏi đèn đuôi: Blink nháy mắt (nhịp "ồ")
  out: [10.95, 11.45], wink: [11.4, 11.7],
  // chụp → match cut thành sticker → trang sổ
  snap: 11.88, zoomIn: [11.98, 12.28], zoomOut: [12.28, 12.62], stamp: 12.78,
  // sổ: Blink bay vào; Albie đếm chân bằng trang giấy, há miệng, "đớp" đúng chữ "go!" khi Blink lao vào trang
  blinkIn: [13.0, 13.6], counts: [13.25, 13.5, 13.75], dive2: [14.75, 15.15], gulp: 15.15, mini: 15.35,
  flip: [15.85, 16.35],
  // gag: "You're so bright, Blink!" → Blink ngượng che mặt → "I'm not glowing!" → đuôi bùng chói, Miss Loupe nheo mắt
  shy: [17.5, 17.85], blaze: [18.6, 19.75], squint: 18.75,
  // câu hỏi kết; chữ móc trở lại; Miss Loupe lại chìa tay hơ; vòng sáng mở về khung đầu
  recall: 21.3, warm: [21.3, 21.6], loop: [21.45, at(11)],
};
export const SECS = [
  { id: 'camp', t0: 0, t1: HIT.zoomIn[0] },
  { id: 'album', t0: HIT.zoomIn[0], t1: HIT.flip[1] },
  { id: 'gag', t0: HIT.flip[1], t1: DUR },
];

// t: lúc bắt đầu nói (giây). dur: độ dài thật (voice/dur.json, sau voicefx.py). who: giọng trong _shared/voices.js.
// catch: câu cửa miệng (tốc độ chuẩn). pace: ghi đè hệ số chậm của bản B cho câu đó. Mọi câu có người nói trên hình (QUALITY.md §3).
export const LINES = [
  { id: 'L01', who: 'loupe', t: .1, dur: 2.326, card: 1, text: 'Could you glow without getting hot?' },
  { id: 'L02', who: 'blink', t: 2.5, dur: .73, card: 1, text: 'Watch this!', pace: 1 },
  { id: 'L03', who: 'loupe', t: 3.9, dur: .999, card: 2, text: "Let's zoom in!", catch: true },
  { id: 'L04', who: 'loupe', t: 5.6, dur: 2.751, card: 2, text: 'Tiny bits mix together and make light!' },
  { id: 'L05', who: 'loupe', t: 9.0, dur: 2.025, card: 3, text: 'Light with almost no heat!' },
  { id: 'L06', who: 'albie', t: 13.0, dur: 2.297, card: 4, text: 'Six legs? In you go!', catch: true },
  { id: 'L07', who: 'loupe', t: 16.5, dur: 1.728, card: 5, text: "You're so bright, Blink!" },
  { id: 'L08', who: 'blink', t: 18.4, dur: .909, card: 5, text: "I'm not glowing!", pace: 1 },
  { id: 'L09', who: 'loupe', t: 20.2, dur: 1.131, card: 6, text: 'What would YOU light up?', pace: 1 },   // câu hỏi kết cho trẻ (QUALITY.md §6)
];
// Tấm phụ đề: giữ ≥ 1,8 s và ≥ câu cuối + 0,6 s (DIRECTOR.md §7); không được chồng tấm sau. Chữ hiện dần theo câu đã nói.
export const CARDS = [...new Set(LINES.map(l => l.card))].map(k => {
  const ls = LINES.filter(l => l.card === k), t0 = ls[0].t, end = ls.at(-1).t + ls.at(-1).dur;
  return { t0, t1: Math.min(DUR, Math.max(t0 + 1.8, end + .6)), text: ls.map(l => l.text).join(' '), parts: ls.map(l => ({ t: l.t, text: l.text })) };
});
export const CARD_CLASHES = CARDS.filter((c, i) => i + 1 < CARDS.length && c.t1 > CARDS[i + 1].t0).map(c => c.text);

// 10 khung cho storyboard
export const BOARD = [
  { t: 0.3, shot: '1', frame: 'Medium, campfire ring · loop frame', dur: '3.9 s', line: 'Could you glow without getting hot?' },
  { t: 1.5, shot: '1', frame: 'Medium · frozen hands, jolt', dur: '3.9 s', line: '(brrr!)' },
  { t: 3.45, shot: '1', frame: 'Medium · the tail flares', dur: '3.9 s', line: 'Watch this!' },
  { t: 4.4, shot: '2', frame: 'Medium · lens up', dur: '1.0 s', line: "Let's zoom in!" },
  { t: 7.6, shot: '3', frame: 'Big lens: inside the lamp', dur: '3.3 s', line: 'Tiny bits mix together and make light!' },
  { t: 10.3, shot: '4', frame: 'Big lens: the thermometer', dur: '2.2 s', line: 'Light with almost no heat!' },
  { t: 14.0, shot: '7', frame: 'Album', dur: '3.2 s', line: 'Six legs? In you go!' },
  { t: 17.7, shot: '9', frame: 'Medium · Blink is shy', dur: '3.5 s', line: "You're so bright, Blink!" },
  { t: 19.0, shot: '9', frame: 'Medium · BLAZE', dur: '3.5 s', line: "I'm not glowing!" },
  { t: 20.8, shot: '10', frame: 'Medium → loop', dur: '2.3 s', line: 'What would YOU light up?' },
];

// Sự kiện âm thanh, khớp với chuyển động trong film.js (core/render/events.mjs → events.json → mix.py). Bảng cue đầy đủ ở SOUND.md.
// Tiếng nằm dưới lời thì ở dải cao và nhỏ (hoặc dải trầm); mỗi chuyển cảnh một tiếng riêng.
export const EV = [
  // móc: chữ bật, răng va lập cập, hơi thở; băng mọc, giật nảy, vẩy tay; Blink khúc khích; bùng sáng
  { t: 0, type: 'titlepop' },
  ...HIT.words.map((t, i) => ({ t, type: 'wordpop', n: i })),
  { t: 0, type: 'chatter', d: .9, pan: -.3 },
  { t: .05, type: 'glowhum', pan: .3 },
  { t: .45, type: 'breath', pan: -.3 },
  { t: HIT.frost[0], type: 'frost', d: HIT.frost[1] - HIT.frost[0], pan: -.15 },
  { t: HIT.jolt, type: 'startle', pan: -.3 },
  { t: HIT.shake[0], type: 'brrr', d: HIT.shake[1] - HIT.shake[0], pan: -.3 },
  { t: HIT.giggle0, type: 'giggle', pan: .35 },
  { t: 2.15, type: 'breath', pan: -.3 },
  { t: HIT.flare[0], type: 'flare', pan: .3 },
  // kính: giơ lên, bật về phía máy, lao vào trong đèn đuôi
  { t: HIT.raise[0], type: 'swish', d: .4, v: .3, lo: 900, hi: 3800, up: true, pan: -.2 },
  { t: HIT.zoom[0], type: 'zoom' },
  { t: HIT.dive[0], type: 'dive', d: HIT.dive[1] - HIT.dive[0] },
  // buồng sáng: bong bóng xanh lùa vào; mỗi cú pha trộn một tiếng "pop" + ting đi lên; bừng sáng
  { t: 5.95, type: 'bubbles', pan: -.5 }, { t: 6.95, type: 'bubbles', pan: -.5 },
  ...HIT.pops.map((t, i) => ({ t, type: 'mix', n: i, pan: [-.3, .2, -.1, .3, -.2, .1, 0, .2][i] })),
  { t: HIT.bloom, type: 'bloom' },
  // nhiệt kế: trượt vào, run lập cập, nhích một nấc
  { t: HIT.therm[0], type: 'swipe', d: .4, lo: 1500, hi: 6000, pan: .6 },
  { t: HIT.therm[1], type: 'chatter', d: .5, v: .5, pan: .5 },
  { t: HIT.tick, type: 'tick', pan: .5 },
  // lùi ra, Blink nháy mắt
  { t: HIT.out[0], type: 'swish', d: .5, v: .2, lo: 1500, hi: 4600, up: false, pan: 0 },
  { t: HIT.wink[0], type: 'wink', pan: .2 },
  // chụp → sticker → sổ
  { t: HIT.snap, type: 'snap' },
  { t: HIT.zoomIn[0], type: 'zoomin', d: HIT.zoomIn[1] - HIT.zoomIn[0] },
  { t: HIT.zoomOut[0], type: 'zoomout', d: HIT.zoomOut[1] - HIT.zoomOut[0] },
  { t: HIT.zoomOut[1], type: 'page' },
  { t: HIT.stamp - .3, type: 'swipe', d: .3, lo: 1800, hi: 8000, pan: .7 },
  { t: HIT.stamp, type: 'stamp' },
  { t: HIT.stamp + .02, type: 'ding', m: 88 },
  // Blink bay vào, Albie đếm chân, lao vào trang đúng "go!"
  { t: HIT.blinkIn[0], type: 'zip', d: .5, pan: .6 },
  ...HIT.counts.map((t, i) => ({ t, type: 'count', n: i })),
  { t: HIT.dive2[0], type: 'jump', pan: .2 },
  { t: HIT.gulp, type: 'gulp' },
  { t: HIT.mini, type: 'pops', n: 3, step: .06, m: 91, v: .35 },
  { t: HIT.flip[0], type: 'flip', d: HIT.flip[1] - HIT.flip[0] },
  // gag: ngượng, bùng chói, nheo mắt, dịu lại
  { t: HIT.shy[0], type: 'blush', pan: .3 },
  { t: HIT.blaze[0], type: 'blaze', d: HIT.blaze[1] - HIT.blaze[0], pan: .2 },
  { t: HIT.squint, type: 'huh', pan: -.3 },
  { t: HIT.blaze[1], type: 'dim', pan: .2 },
  { t: HIT.recall, type: 'recall' },
  { t: HIT.warm[0], type: 'rub', pan: -.3 },
  { t: HIT.loop[0], type: 'glowiris' },                          // ánh sáng đuôi nở thành vòng tròn, mở về khung đầu đúng điểm lặp
];
