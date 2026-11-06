// Một nguồn thời gian duy nhất cho hình, phụ đề, âm thanh. Bản B: valse 3/4 ở 120 BPM, 16 ô nhịp (mỗi ô 1,5 s) = 24 s, phát vòng lặp liền mạch.
export const BPM = 120, BEAT = 60 / BPM, METER = 3, BAR = BEAT * METER;
export const at = (bar, beat = 0) => (bar * METER + beat) * BEAT;
export const PACE = .85;   // lời dẫn chậm hơn tập A khoảng 15% (kế hoạch §4.3); câu cửa miệng giữ tốc độ chuẩn

// twig: cành cây (móc → soi → "ồ" → chú kiến lạ, một cảnh liền); album: sổ của Albie; gag: lại cành cây, Crumb chào cái kính, vòng lặp
export const SECS = [
  { id: 'twig', t0: 0, t1: 15.3 },
  { id: 'album', t0: 15.3, t1: 18.8 },
  { id: 'gag', t0: 18.8, t1: at(16) },
];
export const DUR = at(16);

// Mốc hành động dùng chung cho hình và tiếng (giây tuyệt đối). Cú chạm râu rơi đúng hai phách "pa-pa" của điệu valse.
export const HIT = {
  words: [0, .12], crash: [0, .4],
  tap0: [at(0, 1), at(0, 2)], sniff0: [at(1), at(1, .6)], turn0: 2.3, turnBack: 3.95, lensIn: 3.6,
  zoom: 5.55, clouds: 5.75, tapZ: [at(4, 1), at(4, 2)], wisp: [7.6, 8.3], match: 8.35, same: 8.45,
  nuzzle: [10.9, 11.3], hearts: 11.0, stranger: [10.8, 11.7], turn1: [11.3, 11.65], lensSlide: [11.7, 12.25],
  tapS: [at(8, 1), at(8, 2)], wispS: [13.0, 13.4], clash: 13.4, nope: 13.6, shrug: 14.05, leave: [14.35, 15.3],
  back: [14.3, 14.6], tapB: 14.62, snap: 14.66, irisA: 14.76, irisB: 15.06, zoomIn: [14.76, 15.06], zoomOut: [15.06, 15.4], stamp: 15.55,   // v2: kính quay lại chỗ Crumb và chị kiến, "chụp" cú chạm râu → match cut thành sticker
  // v3 (quy tắc câu hỏi kết): gag dồn sớm một phách để câu hỏi kết có tấm phụ đề riêng, chữ to 2,25 s và một nhịp chờ trẻ trả lời
  flip: [18.3, 18.8], walkG: [18.8, 19.0], glass: [at(12, 2), at(13)], curl: [19.55, 21.1], laugh: 21.2, ask: [21.2, 23.45], wait: 23.22, recall: 23.45, lift: [23.25, 23.6], turnG: 23.4,
  puff: [23.55, at(16)],
};

// t: lúc bắt đầu nói (giây). dur: độ dài thật (voice/dur.json, sau voicefx.py). who: giọng trong _shared/voices.js.
// catch: câu cửa miệng (tốc độ chuẩn). pace: ghi đè hệ số chậm của bản B cho câu đó.
export const LINES = [
  { id: 'L01', who: 'loupe', t: .1, dur: 2.176, card: 1, text: 'What if you said hello with a sniff?' },
  // Crumb nói ở tốc độ chuẩn (pace 1): nhân vật "trẻ em, cao, nhanh" (kế hoạch §11.3); ở tốc độ bản B, Whisper nghe thêm "Well/Oh" ở đầu câu
  { id: 'L02', who: 'crumb', t: 2.6, dur: 1.235, card: 1, text: "That's how I say hi!", pace: 1 },
  { id: 'L03', who: 'loupe', t: 4.5, dur: .999, card: 2, text: "Let's zoom in!", catch: true },
  { id: 'L04', who: 'loupe', t: 6.0, dur: 2.308, card: 2, text: 'Their antennae are like noses!' },   // "Antennae are…" bị base.en nghe thành "Antony"
  { id: 'L05', who: 'loupe', t: 8.95, dur: 2.156, card: 3, text: 'Same smell? Same home!' },
  { id: 'L06', who: 'crumb', t: 11.4, dur: 1.002, card: 3, text: "Hey, who's that?", pace: 1 },   // "Who's that?" bị nghe thành "Oh, who's that?"
  { id: 'L07', who: 'loupe', t: HIT.nope, dur: .628, card: 4, text: 'Nope!', catch: true },
  { id: 'L08', who: 'albie', t: 16.0, dur: 2.297, card: 5, text: 'Six legs? In you go!', catch: true },
  { id: 'L09', who: 'crumb', t: 18.95, dur: .989, card: 6, text: 'Hello, lens!', pace: 1 },   // v3: sớm 0,35 s (lúc trang sổ lật, Crumb chạy tới chào cái kính)
  { id: 'L10', who: 'crumb', t: 20.1, dur: 1.288, card: 6, text: "You don't smell like home!", pace: 1 },   // "Not from my nest!": "nest" bị nghe thành "master"/"nasty"; câu mới nối lại "Same smell? Same home!"
  { id: 'L11', who: 'loupe', t: 22.0, dur: 1.193, card: 7, text: 'How do YOU say hi?', pace: 1 },   // câu hỏi kết cho trẻ (QUALITY.md §6). v3: tấm phụ đề riêng + chữ to (HIT.ask), nhịp chờ 23,19–23,4, rồi chữ móc trở lại
];
// Tấm phụ đề: giữ ≥ 1,8 s và ≥ câu cuối + 0,6 s (DIRECTOR.md §7); không được chồng tấm sau. Chữ hiện dần theo câu đã nói.
export const CARDS = [...new Set(LINES.map(l => l.card))].map(k => {
  const ls = LINES.filter(l => l.card === k), t0 = ls[0].t, end = ls.at(-1).t + ls.at(-1).dur;
  return { t0, t1: Math.min(DUR, Math.max(t0 + 1.8, end + .6)), text: ls.map(l => l.text).join(' '), parts: ls.map(l => ({ t: l.t, text: l.text })) };
});
export const CARD_CLASHES = CARDS.filter((c, i) => i + 1 < CARDS.length && c.t1 > CARDS[i + 1].t0).map(c => c.text);

// 10 khung cho storyboard
export const BOARD = [
  { t: 0.5, shot: '1', frame: 'Medium, ant height · loop frame', dur: '3 s', line: 'What if you said hello with a sniff?' },
  { t: 2.9, shot: '1', frame: 'Medium', dur: '3 s', line: "That's how I say hi!" },
  { t: 4.7, shot: '2', frame: 'Medium', dur: '1.5 s', line: "Let's zoom in!" },
  { t: 7.6, shot: '3', frame: 'Lens: smell clouds', dur: '3.5 s', line: 'Their antennae are like noses!' },
  { t: 8.9, shot: '3', frame: 'Lens: match', dur: '2 s', line: 'Same smell? Same home!' },
  { t: 11.0, shot: '4', frame: 'Lens: nuzzle', dur: '1 s', line: '(hearts)' },
  { t: 13.65, shot: '5', frame: 'Lens: the stranger', dur: '3 s', line: "Hey, who's that? Nope!" },
  { t: 17.0, shot: '7', frame: 'Album, held', dur: '3.3 s', line: 'Six legs? In you go!' },
  { t: 20.6, shot: '9', frame: 'Medium, push', dur: '2.1 s', line: "Hello, lens! You don't smell like home!" },
  { t: 22.6, shot: '10', frame: 'Medium, big question → title returns', dur: '2.4 s', line: 'How do YOU say hi? (SNIFF HELLO?! returns, smell-cloud iris)' },
];

// Sự kiện âm thanh, khớp với chuyển động trong film.js (core/render/events.mjs → events.json → mix.py). Bảng cue đầy đủ ở SOUND.md.
// Tiếng nằm dưới lời thì ở dải cao và nhỏ (hoặc dải trầm); mỗi chuyển cảnh một tiếng riêng.
export const EV = [
  // mở: chữ móc bật ra, hai đầu râu chạm "tách, tách", hít hít, Crumb quay ra phía người xem
  { t: 0, type: 'titlepop' },
  { t: 0, type: 'crash', d: .4 },                                // v2: máy đẩy nhanh vào hai chú kiến
  ...HIT.words.map((t, i) => ({ t, type: 'wordpop', n: i })),     // v2: mỗi dòng chữ móc nảy một tiếng
  ...HIT.tap0.map((t, i) => ({ t, type: 'tap', m: [91, 95][i], pan: .05 })),
  ...HIT.sniff0.map(t => ({ t, type: 'sniff', pan: .1 })),
  { t: HIT.turn0, type: 'turn', pan: -.2 },
  { t: HIT.lensIn, type: 'swipe', d: .45, pan: .6 },             // Miss Loupe và kính trượt vào từ phải
  { t: HIT.turnBack, type: 'blip', m: 86, pan: -.2 },            // Crumb quay lại phía chị kiến
  // soi: mây mùi hiện, chạm râu, làn mùi bay vào đầu râu, "ding-dong"
  { t: HIT.zoom, type: 'zoom' },
  { t: HIT.clouds, type: 'puffin', pan: .1 },
  ...HIT.tapZ.map((t, i) => ({ t, type: 'tap', m: [93, 96][i], v: .8, pan: .05 })),
  { t: HIT.wisp[0], type: 'wisp', d: HIT.wisp[1] - HIT.wisp[0], pan: .2 },
  { t: HIT.match, type: 'dingdong' },
  { t: HIT.same, type: 'pops', n: 6, step: .035, m: 86, v: .35 },   // chữ SAME SMELL! bật ra
  // nhịp "ồ": dụi đầu, tim nhỏ
  { t: HIT.nuzzle[0], type: 'nuzzle', pan: .05 },
  { t: HIT.hearts, type: 'hearts' },
  // chú kiến lạ
  { t: HIT.stranger[0], type: 'steps', d: HIT.stranger[1] - HIT.stranger[0], n: 10, pan: -.6 },
  { t: HIT.turn1[0], type: 'turn', pan: -.3 },
  { t: HIT.lensSlide[0], type: 'swish', d: .5, v: .22, lo: 1800, hi: 5200, up: false, pan: -.3 },
  ...HIT.tapS.map((t, i) => ({ t, type: 'tap', m: [93, 96][i], v: .8, pan: -.3 })),
  { t: HIT.wispS[0], type: 'wisp', d: HIT.wispS[1] - HIT.wispS[0], pan: -.4 },
  { t: HIT.clash, type: 'bonk', pan: -.3 },                      // đầu râu lóe cam, dấu X
  { t: HIT.shrug, type: 'shrug', pan: -.4 },
  { t: HIT.leave[0], type: 'steps', d: HIT.leave[1] - HIT.leave[0], n: 9, pan: -.7 },
  { t: HIT.back[0], type: 'swish', d: .3, v: .2, lo: 1500, hi: 4800, up: true, pan: .3 },   // v2: kính quay lại chỗ chị kiến
  { t: HIT.tapB, type: 'tap', m: 96, v: .8, pan: .05 },
  { t: HIT.snap, type: 'snap' },                                 // "chụp" cú chạm râu
  { t: HIT.zoomIn[0], type: 'zoomin', d: HIT.zoomIn[1] - HIT.zoomIn[0] },
  { t: HIT.zoomOut[0], type: 'zoomout', d: HIT.zoomOut[1] - HIT.zoomOut[0] },
  // sổ
  { t: HIT.irisB, type: 'page' },
  { t: HIT.stamp - .3, type: 'swipe', d: .3, lo: 1800, hi: 8000, pan: .7 },
  { t: HIT.stamp, type: 'stamp' },
  { t: HIT.stamp + .02, type: 'ding', m: 88 },
  { t: HIT.flip[0], type: 'flip', d: HIT.flip[1] - HIT.flip[0] },   // trang sổ lật sang cành cây
  // gag: Crumb chào cái kính
  { t: HIT.walkG[0], type: 'steps', d: HIT.walkG[1] - HIT.walkG[0], n: 6, pan: -.3 },
  ...HIT.glass.map((t, i) => ({ t, type: 'squeak', v: [.8, 1][i], pan: .1 })),
  { t: HIT.glass[1] + .08, type: 'boing', f0: 300, v: .4, pan: -.1 },   // râu xoăn tít
  { t: HIT.curl[0] + .7, type: 'sniff', v: .7, pan: -.1 },
  { t: HIT.ask[0], type: 'ask' },                                // v3: chữ câu hỏi kết bật ra (hai tiếng nảy nhỏ, trước lời 0,8 s: chữ ở trên hình đủ 2,25 s để đọc)
  { t: HIT.ask[0] + .3, type: 'askq' },                          // hai dấu "?" nhún (tiếng ở dải cao, nhỏ)
  { t: HIT.recall, type: 'recall' },                            // v2: chữ SNIFF HELLO?! trở lại đúng chỗ của khung đầu
  { t: HIT.lift[0], type: 'swish', d: .45, v: .25, lo: 1500, hi: 4800, up: true, pan: .4 },
  { t: HIT.turnG, type: 'turn', pan: -.1 },
  { t: HIT.puff[0], type: 'puffiris' },                          // mây mùi phồng ra, mở về khung đầu đúng điểm lặp
];
