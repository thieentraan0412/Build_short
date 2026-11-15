// Một nguồn thời gian duy nhất cho hình, phụ đề, âm thanh. Tập A theo công thức 45 s (PHAN-TICH-SHORTS/KE-HOACH-NANG-CAP.md §3):
// lưới 4/4 ở 120 BPM, 22 ô nhịp (mỗi ô 2 s) = 44 s, phát vòng lặp: móc và gag là cùng một sân khấu gốc cây giữa bãi cỏ; cuối phim mọi thứ về đúng khung đầu.
// Thử nghiệm của tập (KE-HOACH-PHAT-TRIEN-KENH.md §10): "Nope!" đặt ở bí mật 1 (thay vì bí mật 2). Chỉ đổi biến số đó.
export const BPM = 120, BEAT = 60 / BPM, METER = 4, BAR = BEAT * METER;
export const at = (bar, beat = 0) => (bar * METER + beat) * BEAT;
export const PACE = 1;

export const DUR = at(22);
export const HIT = {
  words: [0, .12],
  // móc: Crumb thổi còi lá cỏ "PWEEET!"; vòng âm bay tới; cả ba giật mình, mỗi người "nghe" ở một chỗ: Chirp ở đầu gối, Hop ở bụng, Miss Loupe ở... kính
  whistle: [0, .34], rings: [.04, .5], startle: .4, hopUp: [.4, .82], lensRing: [.4, 1.35],
  chirpLeg: [1.0, 1.4], hopTurn: [1.15, 1.6], giggle: 1.75, puzzle: [2.05, 2.7],
  titleOut: [2.55, 2.85], slots: 2.75, raise: 2.7,
  // logo 0,8 s lồng vào cú lao vào kính (titleSting)
  sting: [3.0, 3.8],
  // bí mật 1, có "Nope!": tai Chirp ở chân trước sáng lên; kính trượt sang chân trước của Hop: không có gì; khựng; "Nope!" (dấu X);
  // kính quét dọc sườn Hop, cánh nhấc lên như tấm rèm, lộ màng nghe tròn bên bụng; Chirp gáy, vòng âm chạm màng nghe, màng rung
  kneeGlow: [4.95, 6.5], slide: [6.55, 7.15], hush: [6.6, 7.2], xmark: 7.25, footWag: [7.3, 7.95],
  sweep: [8.05, 8.95], wing: [8.4, 8.95], earOn: 8.95, chirps: [9.62, 9.95], walk: [8.3, 10.2],
  tummyPat: [10.5, 11.6], far: [12.0, 13.85], farRings: [12.35, 12.95, 13.45],
  snap1: 13.85, fly1: [13.95, 14.45], stamp1: 14.5,
  // bí mật 2: nhiều loài châu chấu hát bằng chân: đùi sau kéo lên xuống dọc mép cánh, mỗi lần kéo một tiếng "rè" và một vòng âm
  legUp: [15.0, 15.45], saw: [15.5, 19.55], edge: [16.9, 18.6], solo: [18.7, 18.95, 19.2, 19.45],
  snap2: 19.65, fly2: [19.75, 20.25], stamp2: 20.3,
  // bí mật 3: chân sau như lò xo: co chân (lò xo nén) — BOING! Hop nhảy vọt lên, ra khỏi mặt kính; máy lùi ra bãi cỏ; Hop đáp xuống cạnh Chirp
  crouch: [21.2, 22.35], launch: 22.4, exit: [22.4, 24.1], pull: [22.75, 23.35], land: 24.1,
  // cảnh đặc trưng: Chirp và Hop song tấu, nốt nhạc bay lên xếp thành trái tim, ngôi sao, mặt cười
  duet: [24.35, 28.4], heart: [25.55, 26.75], star: [26.75, 27.6], smile: [27.6, 28.45], finale: 28.05, lensUp: [27.9, 28.45],
  snap3: 28.55, zoomIn: [28.65, 28.95], zoomOut: [28.95, 29.3], stamp3: 29.45,
  // sổ: ô 1, 2 bay xuống trang; Hop nhảy tưng tưng vào; Albie đếm chân, há miệng; Hop nhảy vào trang đúng "go!"
  slotsDown: [29.3, 29.7], hopIn: [29.55, 30.15], counts: [30.25, 30.45, 30.65], plunge: [31.3, 31.75], gulp: 31.75, mini: 31.9,
  flip: [32.6, 33.1],
  // gag: "Play it again! Louder!" — song tấu to hơn, kính của Miss Loupe rung; khựng: Chirp bịt đầu gối, Hop bịt bụng, Miss Loupe bịt... kính
  encore: [34.6, 36.25], lensRing2: [35.05, 36.3], loud: [35.45, 36.25],
  chirpCover: 36.3, hopCover: 36.65, loupeCover: 37.05, giggle2: 38.75,
  uncover: [40.55, 40.75, 40.95], home: [41.2, 42.85], recall: 42.6, loop: [43.1, at(22)],
  // trứng phục sinh ở gag: Mr. Rollo lăn viên tròn trên bãi cỏ xa
  rollo: [36.8, 41.4],
};
// Cảnh của tập A (qa.py đọc 'title' để nhận ra tập A và 'album' để đo cảnh sổ)
export const SECS = [
  { id: 'hook', t0: 0, t1: HIT.sting[0] },
  { id: 'title', t0: HIT.sting[0], t1: HIT.sting[1] },      // logo 0,8 s lồng vào cú lao vào kính
  { id: 'ears', t0: HIT.sting[1], t1: HIT.stamp1 },          // bí mật 1, có "Nope!"
  { id: 'sing', t0: HIT.stamp1, t1: HIT.stamp2 },            // bí mật 2
  { id: 'springs', t0: HIT.stamp2, t1: HIT.zoomIn[0] },      // bí mật 3 và cảnh đặc trưng (song tấu)
  { id: 'album', t0: HIT.zoomIn[0], t1: HIT.flip[1] },
  { id: 'gag', t0: HIT.flip[1], t1: DUR },
];

// t: lúc bắt đầu nói (giây). dur: độ dài thật (voice/dur.json, sau voicefx.py). who: giọng trong _shared/voices.js. catch: câu cửa miệng.
export const LINES = [
  { id: 'L01', who: 'loupe', t: 0.45, dur: 1.968, card: 1, text: 'Where does a grasshopper hide its ears?' },   // "Where are a grasshopper's ears?" bị nghe thành "Wear a grasshopper's ears"
  { id: 'L02', who: 'loupe', t: 3.9, dur: 0.999, card: 2, text: "Let's zoom in!", catch: true },
  { id: 'L03', who: 'crumb', t: 4.95, dur: 1.551, card: 3, text: 'Are they on its legs, like Chirp?' },   // "On its legs, like Chirp's?" bị nghe thành "like cherubs"
  { id: 'L04', who: 'loupe', t: 7.25, dur: 0.628, card: 3, text: 'Nope!', catch: true },
  { id: 'L05', who: 'loupe', t: 8.05, dur: 1.517, card: 4, text: 'Its ears are on its tummy!' },
  { id: 'L06', who: 'crumb', t: 10.4, dur: 1.219, card: 5, text: 'But WHY on its tummy?' },
  { id: 'L07', who: 'loupe', t: 12.0, dur: 1.72, card: 6, text: 'To hear other grasshoppers sing!' },
  { id: 'L08', who: 'loupe', t: 14.65, dur: 2.129, card: 7, text: 'Many grasshoppers sing with their legs!' },
  { id: 'L09', who: 'loupe', t: 16.9, dur: 1.641, card: 8, text: 'They rub a back leg on a wing!' },
  { id: 'L10', who: 'loupe', t: 20.4, dur: 1.916, card: 9, text: 'And its back legs are like springs!' },
  { id: 'L11', who: 'crumb', t: 23.05, dur: 1.011, card: 10, text: 'Look at it go!' },   // "Wow! What a jump!" bị nghe thành "Well, what a jumper"
  { id: 'L12', who: 'crumb', t: 24.6, dur: 0.867, card: 11, text: 'A bug band!' },
  { id: 'L13', who: 'loupe', t: 25.75, dur: 1.351, card: 12, text: 'The notes make a heart!' },
  { id: 'L14', who: 'albie', t: 29.8, dur: 2.297, card: 13, text: 'Six legs? In you go!', catch: true },
  { id: 'L15', who: 'crumb', t: 33.35, dur: 1.185, card: 14, text: 'Play it again! Louder!' },   // "Again! Louder!" bị nghe thành "And again louder"
  { id: 'L16', who: 'loupe', t: 37.45, dur: 1.162, card: 15, text: 'Oops! Too loud!' },
  { id: 'L17', who: 'loupe', t: 39.35, dur: 1.0, card: 16, text: 'Where are YOUR ears?' },   // câu hỏi kết cho trẻ (QUALITY.md §6)
];
// Tấm phụ đề: giữ ≥ 1,8 s và ≥ câu cuối + 0,6 s (DIRECTOR.md §7); không chồng tấm sau; tấm cuối tắt trước điểm lặp. Chữ hiện dần theo câu đã nói.
export const CARDS = [...new Set(LINES.map(l => l.card))].map((k, i, ks) => {
  const ls = LINES.filter(l => l.card === k), t0 = ls[0].t, end = ls.at(-1).t + ls.at(-1).dur;
  const next = i + 1 < ks.length ? LINES.find(l => l.card === ks[i + 1]).t : DUR - .3;
  return { t0, t1: Math.min(DUR - .3, next, Math.max(t0 + 1.8, end + .6)), text: ls.map(l => l.text).join(' '), parts: ls.map(l => ({ t: l.t, text: l.text })) };
});
export const CARD_CLASHES = CARDS.filter((c, i) => i + 1 < CARDS.length && c.t1 > CARDS[i + 1].t0).map(c => c.text);

// 10 khung cho storyboard
export const BOARD = [
  { t: 0.2, shot: '1', frame: 'Medium · loop frame', dur: '3.0 s', line: '(PWEEET!) Where does a grasshopper hide its ears?' },
  { t: 1.5, shot: '1', frame: 'Medium · knee / tummy / lens', dur: '3.0 s', line: 'Where does a grasshopper hide its ears?' },
  { t: 3.45, shot: '2', frame: 'Logo in the lens', dur: '0.8 s', line: '(BIG SECRETS of tiny bugs)' },
  { t: 7.5, shot: '4', frame: 'Big lens · Nope!', dur: '1.4 s', line: 'Are they on its legs, like Chirp? Nope!' },
  { t: 9.9, shot: '5', frame: 'Big lens · tummy ear', dur: '2.4 s', line: 'Its ears are on its tummy!' },
  { t: 17.6, shot: '8', frame: 'Big lens · leg on wing', dur: '1.7 s', line: 'They rub a back leg on a wing!' },
  { t: 22.0, shot: '9', frame: 'Big lens · spring', dur: '2.0 s', line: 'And its back legs are like springs!' },
  { t: 26.2, shot: '11', frame: 'Wide · duet, heart', dur: '4.3 s', line: 'The notes make a heart!' },
  { t: 31.2, shot: '13', frame: 'Album', dur: '3.3 s', line: 'Six legs? In you go!' },
  { t: 37.6, shot: '15', frame: 'Wide · too loud!', dur: '2.1 s', line: 'Oops! Too loud!' },
];

// Sự kiện âm thanh, khớp với chuyển động trong film.js (core/render/events.mjs → events.json → mix.py). Bảng cue đầy đủ ở SOUND.md.
// Tiếng nằm dưới lời thì ở dải cao và nhỏ (hoặc dải trầm); mỗi chuyển cảnh một tiếng riêng.
const TICKS = (t0, t1, step) => { const o = []; for (let t = t0; t < t1 - .01; t += step) o.push(+t.toFixed(3)); return o; };
// mỗi nhát kéo chân của Hop (bí mật 2): thưa dưới lời, dày ở đoạn độc tấu
export const SAWS = [...TICKS(HIT.saw[0], 16.8, .5), ...TICKS(17.0, 18.6, .4), ...HIT.solo];
export const DUET = { hop: TICKS(24.4, 28.3, .5), chirp: TICKS(24.65, 28.3, .5) };
export const ENCORE = { hop: TICKS(HIT.encore[0], HIT.encore[1], .5), chirp: TICKS(HIT.encore[0] + .25, HIT.encore[1], .5) };
export const EV = [
  // móc
  { t: 0, type: 'titlepop' },
  ...HIT.words.map((t, i) => ({ t, type: 'wordpop', n: i })),
  { t: HIT.whistle[0], type: 'whistle', d: HIT.whistle[1] - HIT.whistle[0], pan: -.2 },
  { t: HIT.startle, type: 'startle', pan: .1 },
  { t: HIT.startle + .02, type: 'chirp', pan: 0 },
  { t: HIT.hopUp[0] + .02, type: 'boing', v: .7, pan: .3 },
  { t: HIT.lensRing[0] + .05, type: 'glassring', d: HIT.lensRing[1] - HIT.lensRing[0], pan: -.4 },
  { t: HIT.hopUp[1], type: 'land', pan: .3 },
  { t: HIT.chirpLeg[0], type: 'swish', d: .3, v: .22, lo: 1200, hi: 4200, up: true, pan: 0 },
  { t: HIT.hopTurn[0], type: 'turn', pan: .3 },
  { t: HIT.giggle, type: 'giggle', v: .8, pan: -.3 },
  { t: HIT.puzzle[0], type: 'huh', pan: .1 },
  { t: HIT.slots, type: 'slots' },
  // logo
  { t: HIT.sting[0], type: 'zoom' },
  { t: HIT.sting[0] + .1, type: 'logo' },
  // bí mật 1
  { t: HIT.kneeGlow[0] + .1, type: 'shine', pan: -.3 },
  { t: HIT.kneeGlow[0] + .35, type: 'chirp', v: .6, pan: -.3 },
  { t: HIT.slide[0], type: 'swipe', d: HIT.slide[1] - HIT.slide[0], lo: 900, hi: 3500, pan: .2 },
  { t: HIT.hush[0], type: 'hush', d: HIT.hush[1] - HIT.hush[0] },
  { t: HIT.xmark, type: 'nope', pan: .1 },
  ...[7.4, 7.6, 7.8].map((t, i) => ({ t, type: 'tap', n: i, pan: .2 })),
  { t: HIT.sweep[0] + .05, type: 'swish', d: HIT.sweep[1] - HIT.sweep[0], v: .25, lo: 600, hi: 3000, up: false, pan: .2 },
  { t: HIT.wing[0], type: 'curtain', d: HIT.wing[1] - HIT.wing[0], pan: .2 },
  { t: HIT.earOn, type: 'reveal', pan: .2 },
  ...HIT.chirps.map((t, i) => ({ t, type: 'chirp', n: i, pan: -.5 })),
  ...HIT.chirps.map((t, i) => ({ t: t + .18, type: 'eardrum', n: i, pan: .2 })),
  ...TICKS(8.3, 10.2, .38).map((t, i) => ({ t, type: 'step', n: i, pan: -.2 + i * .08, v: .5 })),
  { t: HIT.tummyPat[0] + .45, type: 'pat', pan: .3 },
  { t: HIT.far[0] + .1, type: 'farsong', d: HIT.far[1] - HIT.far[0] - .2, pan: .6 },
  ...HIT.farRings.map((t, i) => ({ t: t + .35, type: 'eardrum', n: i, v: .5, pan: .3 })),
  { t: HIT.snap1, type: 'snap' },
  { t: HIT.fly1[0], type: 'swipe', d: HIT.fly1[1] - HIT.fly1[0], lo: 1800, hi: 7000, pan: -.4 },
  { t: HIT.stamp1, type: 'slotstamp', n: 0, pan: -.3 },
  // bí mật 2
  { t: HIT.legUp[0], type: 'swish', d: .4, v: .2, lo: 900, hi: 3200, up: true, pan: .2 },
  ...SAWS.map((t, i) => ({ t, type: 'rasp', n: i, v: t < 18.6 ? .45 : 1, pan: .2 })),
  { t: HIT.edge[0] + .05, type: 'shine', pan: .2 },
  { t: HIT.snap2, type: 'snap' },
  { t: HIT.fly2[0], type: 'swipe', d: HIT.fly2[1] - HIT.fly2[0], lo: 1800, hi: 7000, pan: 0 },
  { t: HIT.stamp2, type: 'slotstamp', n: 1, pan: 0 },
  // bí mật 3
  { t: HIT.crouch[0], type: 'creak', d: HIT.crouch[1] - HIT.crouch[0], pan: .2 },
  { t: HIT.launch, type: 'boing', v: 1.2, pan: .1 },
  { t: HIT.launch + .03, type: 'swish', d: .5, v: .35, lo: 700, hi: 4500, up: true, pan: 0 },
  { t: HIT.pull[0], type: 'zoomback', d: HIT.pull[1] - HIT.pull[0] },
  { t: HIT.land, type: 'land', v: 1.3, pan: .3 },
  // song tấu: nốt của Hop (kéo chân) và Chirp (gáy) là phần nhạc viết tay trong mix.py (G.mark), không lặp lại ở đây
  ...['heart', 'star', 'smile'].map((k, i) => ({ t: HIT[k][0], type: 'shape', n: i, pan: 0 })),
  { t: HIT.finale, type: 'boing', v: .7, pan: .3 },
  { t: HIT.lensUp[0], type: 'swish', d: .35, v: .25, lo: 900, hi: 4000, up: true, pan: -.4 },
  { t: HIT.snap3, type: 'snap' },
  { t: HIT.zoomIn[0], type: 'zoomin', d: HIT.zoomIn[1] - HIT.zoomIn[0] },
  { t: HIT.zoomOut[0], type: 'zoomout', d: HIT.zoomOut[1] - HIT.zoomOut[0] },
  { t: HIT.zoomOut[1], type: 'page' },
  { t: HIT.stamp3, type: 'stamp' }, { t: HIT.stamp3 + .02, type: 'ding', m: 85 },
  // sổ
  { t: HIT.slotsDown[0], type: 'swipe', d: .4, lo: 1500, hi: 6000, pan: 0 },
  { t: HIT.slotsDown[1], type: 'slotstamp', n: 2, pan: -.2 },
  { t: HIT.hopIn[0], type: 'hopjoy', pan: .5 },                                  // Hop nhảy tưng tưng vào (hai boing nhỏ trong một cue)
  ...HIT.counts.map((t, i) => ({ t, type: 'count', n: i, pan: .1 })),
  { t: HIT.plunge[0], type: 'boing', v: .9, pan: .2 },
  { t: HIT.gulp, type: 'gulp', pan: -.2 },
  { t: HIT.mini, type: 'pops', n: 3, step: .06, m: 89, v: .35 },
  { t: HIT.flip[0], type: 'flip', d: HIT.flip[1] - HIT.flip[0] },
  // gag
  { t: HIT.flip[1] + .1, type: 'hopjoy', pan: -.3 },
  ...ENCORE.hop.map((t, i) => ({ t, type: 'rasp', n: i, v: .9, pan: .3 })),
  ...ENCORE.chirp.map((t, i) => ({ t, type: 'chirp', n: i, v: .9, pan: -.3 })),
  { t: HIT.lensRing2[0], type: 'glassring', d: HIT.lensRing2[1] - HIT.lensRing2[0], pan: -.4 },
  { t: HIT.rollo[0], type: 'roll', d: HIT.rollo[1] - HIT.rollo[0], pan: .5 },   // trứng phục sinh: Rollo lăn trên bãi cỏ xa
  { t: HIT.chirpCover, type: 'cover', n: 0, pan: -.1 },
  { t: HIT.hopCover, type: 'cover', n: 1, pan: .3 },
  { t: HIT.loupeCover, type: 'cover', n: 2, pan: -.4 },
  { t: HIT.loupeCover + .2, type: 'bonk', pan: -.4 },
  { t: HIT.giggle2, type: 'giggle', pan: -.2 },
  ...HIT.uncover.map((t, i) => ({ t, type: 'unpop', n: i, pan: [-.1, .3, -.4][i] })),
  { t: HIT.home[0], type: 'scurry', d: 1.2, pan: -.2 },
  { t: HIT.home[0] + 1.3, type: 'pluck', pan: -.2 },
  { t: HIT.recall, type: 'recall' },
];
