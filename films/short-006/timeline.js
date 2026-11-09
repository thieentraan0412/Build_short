// Một nguồn thời gian duy nhất cho hình, phụ đề, âm thanh. Bản B: 4/4 ở 120 BPM, 11 ô nhịp (mỗi ô 2 s) = 22 s, phát vòng lặp liền mạch.
export const BPM = 120, BEAT = 60 / BPM, METER = 4, BAR = BEAT * METER;
export const at = (bar, beat = 0) => (bar * METER + beat) * BEAT;
export const PACE = .85;   // lời dẫn chậm hơn tập A khoảng 15% (kế hoạch §4.3); câu cửa miệng giữ tốc độ chuẩn

// stem: chiếc lá (móc → kính lớn → "bò tí hon" → nhịp "ồ", một cảnh liền); album: sổ của Albie; gag: lại chiếc lá, giọt ngọt nảy, vòng lặp
export const DUR = at(11);
export const HIT = {
  words: [0, .12], crash: [0, .4],
  // móc: giọt ngọt đã bật lên ở khung 0 (cú gõ ở −0,4 s, cuối phim nối về đây), bay vòng qua lưng rệp vào tay Crumb; Crumb ôm, quay ra máy, rồi nuốt chửng
  tap0: -.4, pop0: -.3, catch0: 1.05, hug0: [1.3, 1.6], turn0: 2.15, turnBack: 3.3, gulp: [3.4, 3.75],
  // Miss Loupe nhảy vào giữa đàn rệp bên phải, rồi bật về phía máy với kính lớn
  lensIn: [3.2, 3.6], zoom: [4.85, 5.35],
  // trong kính: râu gõ lên trán rệp, rệp cười, giọt ngọt phồng ở đuôi, "pop!", giọt bay vòng qua lưng rệp vào tay Crumb, ôm; kính lùi ra
  taps: [5.7, 6.1], giggle: [5.75, 6.5], swell: [6.5, 8.45], pop: 8.5, fly: [8.5, 9.05], merge: 9.05, hug2: [9.25, 9.55], pull: [9.0, 9.5],
  // "Like milking tiny cows!": đốm bò và chuông bật lên, rồi tắt
  cow: [9.35, 9.85], clonk: 9.5, cowOff: [11.35, 11.65],
  // nhịp "ồ": Crumb ôm giọt ngọt, nhắm mắt lấp lánh; rệp nháy mắt
  aww: [11.45, 11.95], wink: [11.8, 12.1],
  // chụp → match cut thành sticker → trang sổ
  snap: 12.15, zoomIn: [12.25, 12.55], zoomOut: [12.55, 12.9], stamp: 13.05,
  // sổ: Albie nói câu cửa miệng; Crumb chạy vào, nhảy ùm vào trang đúng chữ "go!"
  run: [13.7, 14.4], crouch: [14.4, 14.7], jump: [14.7, 15.2], splash: 15.2, mini: 15.6,
  flip: [16.05, 16.55],
  // gag: Crumb đội giọt ngọt; giọt trượt, nảy tưng tưng, trúng kính, nảy về lưng rệp
  walkG: [16.55, 17.3], slip: 17.35, bounce: [17.85, 18.35], hitLens: 18.8, home: 19.3, laugh: 19.3,
  recall: 21.0, lift: 21.05, loop: [21.25, at(11)],
};
export const SECS = [
  { id: 'stem', t0: 0, t1: HIT.zoomIn[0] },
  { id: 'album', t0: HIT.zoomIn[0], t1: HIT.flip[1] },
  { id: 'gag', t0: HIT.flip[1], t1: DUR },
];

// t: lúc bắt đầu nói (giây). dur: độ dài thật (voice/dur.json, sau voicefx.py). who: giọng trong _shared/voices.js.
// catch: câu cửa miệng (tốc độ chuẩn). pace: ghi đè hệ số chậm của bản B cho câu đó.
// L01 là lời dẫn trong 3 s đầu (Miss Loupe chưa vào hình, được phép); từ giây 3 mọi câu có người nói trên hình (QUALITY.md §3).
export const LINES = [
  { id: 'L01', who: 'loupe', t: .1, dur: 1.984, card: 1, text: 'What if your pet made you sweets?' },
  { id: 'L02', who: 'crumb', t: 2.25, dur: .903, card: 1, text: 'My pet does!', pace: 1 },               // "Mine does!" bị base.en nghe thành "Mind us"
  { id: 'L03', who: 'loupe', t: 3.8, dur: .999, card: 2, text: "Let's zoom in!", catch: true },
  { id: 'L04', who: 'loupe', t: 5.45, dur: 2.95, card: 2, text: 'Some ants tap aphids for sweet drops!' },
  { id: 'L05', who: 'loupe', t: 9.15, dur: 2.159, card: 3, text: 'Like milking tiny cows!' },
  { id: 'L06', who: 'albie', t: 13.35, dur: 2.297, card: 4, text: 'Six legs? In you go!', catch: true },
  { id: 'L07', who: 'crumb', t: 17.6, dur: .857, card: 5, text: 'Wait! Come back!', pace: 1 },           // "Hey! Come back!" bị nghe thành "Okay, come back"
  { id: 'L08', who: 'loupe', t: 19.75, dur: 1.137, card: 6, text: 'What would YOUR pet make?', pace: 1 },   // câu hỏi kết cho trẻ (QUALITY.md §6)
];
// Tấm phụ đề: giữ ≥ 1,8 s và ≥ câu cuối + 0,6 s (DIRECTOR.md §7); không được chồng tấm sau. Chữ hiện dần theo câu đã nói.
export const CARDS = [...new Set(LINES.map(l => l.card))].map(k => {
  const ls = LINES.filter(l => l.card === k), t0 = ls[0].t, end = ls.at(-1).t + ls.at(-1).dur;
  return { t0, t1: Math.min(DUR, Math.max(t0 + 1.8, end + .6)), text: ls.map(l => l.text).join(' '), parts: ls.map(l => ({ t: l.t, text: l.text })) };
});
export const CARD_CLASHES = CARDS.filter((c, i) => i + 1 < CARDS.length && c.t1 > CARDS[i + 1].t0).map(c => c.text);

// 10 khung cho storyboard
export const BOARD = [
  { t: 0.3, shot: '1', frame: 'Medium, leaf height · loop frame', dur: '3.2 s', line: 'What if your pet made you sweets?' },
  { t: 2.6, shot: '1', frame: 'Medium', dur: '3.2 s', line: 'My pet does!' },
  { t: 4.1, shot: '2', frame: 'Medium · Miss Loupe hops in', dur: '1.4 s', line: "Let's zoom in!" },
  { t: 6.0, shot: '3', frame: 'Big lens: tap, tap', dur: '3.7 s', line: 'Some ants tap aphids…' },
  { t: 8.3, shot: '3', frame: 'Big lens: the drop swells', dur: '3.7 s', line: '…for sweet drops! POP!' },
  { t: 10.0, shot: '4', frame: 'Big lens: tiny cow', dur: '2.9 s', line: 'Like milking tiny cows!' },
  { t: 14.0, shot: '7', frame: 'Album', dur: '3.3 s', line: 'Six legs? In you go!' },
  { t: 15.45, shot: '7', frame: 'Album · splash', dur: '3.3 s', line: '(Crumb jumps in)' },
  { t: 18.0, shot: '9', frame: 'Medium · the drop bounces', dur: '3.1 s', line: 'Wait! Come back!' },
  { t: 20.3, shot: '10', frame: 'Medium → loop', dur: '2.4 s', line: 'What would YOUR pet make?' },
];

// Sự kiện âm thanh, khớp với chuyển động trong film.js (core/render/events.mjs → events.json → mix.py). Bảng cue đầy đủ ở SOUND.md.
// Tiếng nằm dưới lời thì ở dải cao và nhỏ (hoặc dải trầm); mỗi chuyển cảnh một tiếng riêng.
export const EV = [
  // móc: chữ bật, giọt ngọt bay lên rồi rơi vào tay Crumb
  { t: 0, type: 'titlepop' },
  { t: 0, type: 'crash', d: .4 },
  ...HIT.words.map((t, i) => ({ t, type: 'wordpop', n: i })),
  { t: 0, type: 'boing', f0: 260, v: .45, pan: -.1 },              // giọt ngọt bật lên (cú "pop" ở −0,12 s nằm cuối phim)
  { t: HIT.catch0, type: 'plip', pan: -.2 },
  { t: HIT.hug0[0], type: 'squish', pan: -.2 },
  { t: HIT.turn0, type: 'turn', pan: -.2 },
  { t: HIT.gulp[0], type: 'slurp', pan: -.2 },
  // Miss Loupe nhảy vào, rồi bật về phía máy với kính lớn
  { t: HIT.lensIn[0], type: 'hop', pan: .6 },
  { t: HIT.lensIn[1], type: 'land', pan: .5 },
  { t: HIT.turnBack, type: 'blip', m: 86, pan: -.2 },
  { t: HIT.zoom[0], type: 'zoom' },
  // trong kính: gõ, cười khúc khích, giọt phồng, "pop!", giọt bay và nhập vào giọt của Crumb
  ...HIT.taps.map((t, i) => ({ t, type: 'tap', m: [91, 95][i], pan: -.05 })),
  { t: HIT.giggle[0] + .1, type: 'giggle', pan: .1 },
  { t: HIT.swell[0], type: 'swell', d: HIT.swell[1] - HIT.swell[0], pan: -.1 },
  { t: HIT.pop, type: 'pop', pan: -.1 },
  { t: HIT.merge, type: 'plip', pan: -.3 },
  { t: HIT.hug2[0], type: 'squish', pan: -.3 },
  { t: HIT.pull[0], type: 'swish', d: .5, v: .2, lo: 1500, hi: 4600, up: false, pan: 0 },
  // "Like milking tiny cows!"
  { t: HIT.cow[0], type: 'pops', n: 5, step: .07, m: 84, v: .35 },
  { t: HIT.clonk, type: 'clonk', pan: .15 },
  { t: HIT.cowOff[0], type: 'poof', pan: .1 },
  // nhịp "ồ"
  { t: HIT.aww[0] + .05, type: 'aww', pan: -.2 },
  { t: HIT.wink[0], type: 'wink', pan: .2 },
  // chụp → sticker → sổ
  { t: HIT.snap, type: 'snap' },
  { t: HIT.zoomIn[0], type: 'zoomin', d: HIT.zoomIn[1] - HIT.zoomIn[0] },
  { t: HIT.zoomOut[0], type: 'zoomout', d: HIT.zoomOut[1] - HIT.zoomOut[0] },
  { t: HIT.zoomOut[1], type: 'page' },
  { t: HIT.stamp - .3, type: 'swipe', d: .3, lo: 1800, hi: 8000, pan: .7 },
  { t: HIT.stamp, type: 'stamp' },
  { t: HIT.stamp + .02, type: 'ding', m: 88 },
  // Crumb chạy vào, nhảy ùm vào trang sổ
  { t: HIT.run[0], type: 'steps', d: HIT.run[1] - HIT.run[0], n: 10, pan: .6 },
  { t: HIT.jump[0], type: 'jump', pan: .3 },
  { t: HIT.splash, type: 'splash', pan: .1 },
  { t: HIT.mini, type: 'pops', n: 3, step: .06, m: 91, v: .35 },
  { t: HIT.flip[0], type: 'flip', d: HIT.flip[1] - HIT.flip[0] },
  // gag: giọt ngọt nảy tưng tưng
  { t: HIT.walkG[0], type: 'steps', d: HIT.walkG[1] - HIT.walkG[0], n: 7, pan: -.4 },
  { t: HIT.slip, type: 'boing', f0: 180, v: .6, pan: -.2 },
  ...HIT.bounce.map((t, i) => ({ t, type: 'boing', f0: [230, 300][i], v: .5, pan: [0, .3][i] })),
  { t: HIT.hitLens, type: 'tink', pan: .5 },
  { t: HIT.home, type: 'plip', pan: .1 },
  { t: HIT.laugh + .05, type: 'giggle', pan: .4 },
  { t: HIT.recall, type: 'recall' },
  { t: HIT.lift, type: 'boing', f0: 340, v: .45, pan: 0 },
  { t: HIT.loop[0], type: 'dropiris' },                          // giọt ngọt phình thành vòng tròn vàng mật, mở về khung đầu đúng điểm lặp
];
