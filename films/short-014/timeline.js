// Một nguồn thời gian duy nhất cho hình, phụ đề, âm thanh. Bản B: lưới phim 4/4 ở 120 BPM, 11 ô nhịp (mỗi ô 2 s) = 22 s, phát vòng lặp liền mạch.
export const BPM = 120, BEAT = 60 / BPM, METER = 4, BAR = BEAT * METER;
export const at = (bar, beat = 0) => (bar * METER + beat) * BEAT;
export const PACE = .85;   // lời dẫn chậm hơn tập A khoảng 15% (kế hoạch §4.3); câu cửa miệng giữ tốc độ chuẩn

// stone: hòn đá lúc chiều vàng (móc → "Well, Hop can!" → kính lớn soi màng nhĩ, một cảnh liền); album: sổ của Albie; gag: lại hòn đá, bụng Crumb sôi, Hop vọt khỏi khung, vòng lặp
export const DUR = at(11);
export const HIT = {
  words: [0, .12],
  // móc: Hop vừa đáp về (cú đáp ở cuối phim), Crumb áp tai vào bụng Hop; giọng Crumb làm màng nhĩ gợn; Hop nhột, khúc khích, nảy lên hất Crumb ra
  press: [-.4, .1], tickle: 1.05, jiggle: [1.05, 1.6], bump: [1.18, 1.68], qmark: 1.9, titleOut: [2.35, 2.7],
  // Miss Loupe bật vào đúng câu "Well, Hop can!"; "Let's zoom in!" → kính lớn
  hopIn: [1.98, 2.38], raise: 3.93, zoom: [5.0, 5.45],
  // trong kính: lướt từ mặt Hop xuống bên bụng → màng nhĩ sáng ("EAR!"); Crumb ghé sát: "Hello in there!", ba vòng sóng làm màng nhĩ gợn; "EARDRUM!"
  glide: [5.45, 6.4], glow: 6.35, tag: 6.4, lean: [7.75, 8.15], hello: [8.25, 8.52, 8.79], tag2: 9.15,
  // chụp → match cut thành sticker → trang sổ
  snap: 12.25, zoomIn: [12.35, 12.65], zoomOut: [12.65, 13.0], stamp: 13.15,
  // sổ: Hop nhảy vào; Albie đếm chân, "đớp" đúng chữ "go!" khi Hop lao vào trang
  hopIn2: [13.4, 13.9], counts: [13.65, 13.9, 14.15], dive2: [15.25, 15.65], gulp: 15.65, mini: 15.85,
  flip: [16.3, 16.8],
  // gag: Crumb nhìn vụn bánh, liếm môi; bụng sôi "ục ục" (hai lần) → máy lao vào màng nhĩ: màng nhĩ rung mạnh → Hop giật mình, co chân, vọt khỏi khung
  glance: 16.9, lick: [17.05, 17.3], rumble: [17.33, 17.67], crashIn: [17.43, 17.57], crashOut: [18.13, 18.29],
  startle: 18.29, crouch: [18.33, 18.51], leap: [18.51, 18.87],
  // "Sorry! My tummy!" · câu hỏi kết; chữ móc trở lại; Hop rơi về đúng chỗ cũ (đáp ngay trước khung nối), Crumb chạy lại áp tai (vòng lặp)
  recall: 21.0, fall: [21.45, 21.95], back: [21.5, DUR + .1], exit: [21.55, 21.95], loop: [21.3, DUR],
};
export const SECS = [
  { id: 'stone', t0: 0, t1: HIT.zoomIn[0] },
  { id: 'album', t0: HIT.zoomIn[0], t1: HIT.flip[1] },
  { id: 'gag', t0: HIT.flip[1], t1: DUR },
];

// t: lúc bắt đầu nói (giây). dur: độ dài thật (voice/dur.json, sau voicefx.py). who: giọng trong _shared/voices.js.
// say: chữ đưa vào TTS khi khác chữ hiện (phụ đề vẫn là text). pace: nhân tốc độ của nhân vật (bản B mặc định PACE).
export const LINES = [
  { id: 'L01', who: 'crumb', t: .1, dur: 1.319, card: 1, text: 'Could you hear with your tummy?', pace: 1.06 },   // ở tốc độ .85 small.en nghe thành "Or could you…"
  { id: 'L02', who: 'loupe', t: 2.45, dur: 1.358, card: 2, text: 'Well, Hop can!' },                                // "Hop can!" một mình bị nghe thành "A hop can" / "Hopcan"
  { id: 'L03', who: 'loupe', t: 3.88, dur: .999, card: 2, text: "Let's zoom in!", catch: true },
  { id: 'L04', who: 'loupe', t: 5.5, dur: 2.093, card: 3, text: "Hop's ears are on its tummy!" },
  { id: 'L05', who: 'crumb', t: 8.2, dur: .913, card: 4, text: 'Hello in there!', pace: 1 },                     // "Hello, Hop!" bị nghe thành "Hello, hot"
  { id: 'L06', who: 'loupe', t: 9.25, dur: 2.865, card: 4, text: "It's an eardrum. Sound makes it wiggle!" },
  { id: 'L07', who: 'albie', t: 13.4, dur: 2.297, card: 5, text: 'Six legs? In you go!', catch: true },
  { id: 'L08', who: 'crumb', t: 18.95, dur: 1.044, card: 6, text: 'Sorry! My tummy!', pace: 1 },                   // "Oops! My tummy!" bị nghe thành "Loops, my tummy"
  { id: 'L09', who: 'loupe', t: 20.1, dur: 1.464, card: 6, text: 'Can YOUR tummy hear things?', say: 'Can your tummy hear things?', pace: 1 },   // câu hỏi kết cho trẻ: "No!" (QUALITY.md §6)
];
// Tấm phụ đề: giữ ≥ 1,8 s và ≥ câu cuối + 0,6 s (DIRECTOR.md §7); không được chồng tấm sau. Chữ hiện dần theo câu đã nói.
export const CARDS = [...new Set(LINES.map(l => l.card))].map(k => {
  const ls = LINES.filter(l => l.card === k), t0 = ls[0].t, end = ls.at(-1).t + ls.at(-1).dur;
  return { t0, t1: Math.min(DUR - .3, Math.max(t0 + 1.8, end + .6)), text: ls.map(l => l.text).join(' '), parts: ls.map(l => ({ t: l.t, text: l.text })) };
});
export const CARD_CLASHES = CARDS.filter((c, i) => i + 1 < CARDS.length && c.t1 > CARDS[i + 1].t0).map(c => c.text);

// 10 khung cho storyboard
export const BOARD = [
  { t: 0.4, shot: '1', frame: 'Stone · loop frame', dur: '2.0 s', line: 'Could you hear with your tummy?' },
  { t: 1.45, shot: '1', frame: 'Hop giggles', dur: '2.0 s', line: '(giggle)' },
  { t: 3.2, shot: '2', frame: 'Loupe hops in', dur: '3.0 s', line: 'Well, Hop can!' },
  { t: 6.9, shot: '3', frame: 'Lens: tummy ear', dur: '2.5 s', line: "Hop's ears are on its tummy!" },
  { t: 8.5, shot: '4', frame: 'Lens: sound rings', dur: '1.1 s', line: 'Hello in there!' },
  { t: 10.6, shot: '5', frame: 'Lens: it wiggles', dur: '3.1 s', line: "It's an eardrum. Sound makes it wiggle!" },
  { t: 14.4, shot: '7', frame: 'Album', dur: '3.3 s', line: 'Six legs? In you go!' },
  { t: 17.75, shot: '9', frame: 'Crash zoom: rumble', dur: '0.9 s', line: '(rumble rumble)' },
  { t: 18.62, shot: '10', frame: 'Hop leaps out', dur: '0.6 s', line: '(boing!)' },
  { t: 20.6, shot: '11', frame: 'Question → loop', dur: '2.8 s', line: 'Sorry! My tummy! Can YOUR tummy hear things?' },
];

// Sự kiện âm thanh, khớp với chuyển động trong film.js (core/render/events.mjs → events.json → mix.py). Bảng cue đầy đủ ở SOUND.md.
export const EV = [
  // móc: chữ bật; Crumb áp tai; Hop khúc khích, nảy; Crumb bật ra, ngồi phịch; dấu "?"
  { t: 0, type: 'titlepop' },
  ...HIT.words.map((t, i) => ({ t, type: 'wordpop', n: i })),
  { t: .05, type: 'press', pan: .1 },
  { t: HIT.tickle, type: 'giggle', pan: -.1 },
  { t: HIT.jiggle[0] + .1, type: 'hop', pan: -.1 },
  { t: HIT.bump[0], type: 'bump', d: HIT.bump[1] - HIT.bump[0], pan: .3 },
  { t: HIT.bump[1], type: 'plop', pan: .35 },
  { t: HIT.qmark, type: 'qq', pan: .35 },
  // Miss Loupe bật vào
  { t: HIT.hopIn[0], type: 'zip', d: .4, pan: -.6 },
  { t: HIT.hopIn[1], type: 'landL', pan: -.5 },
  { t: HIT.titleOut[0], type: 'titleout', pan: 0 },
  // kính lớn: bật về phía máy, lướt xuống bên bụng, màng nhĩ sáng, chữ "EAR!"
  { t: HIT.zoom[0], type: 'zoom' },
  { t: HIT.glide[0] - .05, type: 'glide', d: HIT.glide[1] - HIT.glide[0] },
  { t: HIT.glow, type: 'glowup', pan: -.1 },
  { t: HIT.tag, type: 'tag', pan: 0 },
  // Crumb ghé sát; "Hello in there!": ba vòng sóng chạm màng nhĩ; "EARDRUM!"; màng nhĩ rung theo giọng
  { t: HIT.lean[0], type: 'steps', pan: .3 },
  ...HIT.hello.map((t, i) => ({ t: t + .2, type: 'ripple', n: i, pan: -.15 })),
  { t: HIT.tag2, type: 'tag', n: 1, pan: 0 },
  { t: 10.45, type: 'wiggle', pan: -.1 }, { t: 11.5, type: 'wiggle', n: 1, pan: -.1 },
  // chụp → sticker → sổ
  { t: HIT.snap, type: 'snap' },
  { t: HIT.zoomIn[0], type: 'zoomin', d: HIT.zoomIn[1] - HIT.zoomIn[0] },
  { t: HIT.zoomOut[0], type: 'zoomout', d: HIT.zoomOut[1] - HIT.zoomOut[0] },
  { t: HIT.zoomOut[1], type: 'page' },
  { t: HIT.stamp - .3, type: 'swipe', d: .3, lo: 1800, hi: 8000, pan: .7 },
  { t: HIT.stamp, type: 'stamp' },
  { t: HIT.stamp + .02, type: 'ding', m: 90 },
  // Hop nhảy vào; Albie đếm chân; lao vào trang đúng "go!"
  { t: HIT.hopIn2[0], type: 'hopin', pan: .6 },
  ...HIT.counts.map((t, i) => ({ t, type: 'countA', n: i })),
  { t: HIT.dive2[0], type: 'jump', pan: .2 },
  { t: HIT.gulp, type: 'gulp' },
  { t: HIT.mini, type: 'pops', n: 3, step: .06, m: 91, v: .35 },
  { t: HIT.flip[0], type: 'flip', d: HIT.flip[1] - HIT.flip[0] },
  // gag: Crumb nhìn vụn bánh, liếm môi; bụng "ục ục"; máy lao vào màng nhĩ, sóng chạm màng; Hop giật mình, co chân, vọt lên
  { t: HIT.glance, type: 'glance', pan: .4 },
  { t: HIT.lick[0], type: 'lick', pan: .4 },
  ...HIT.rumble.map((t, i) => ({ t, type: 'rumble', n: i, pan: .3 })),
  { t: HIT.crashIn[0], type: 'crash', d: HIT.crashIn[1] - HIT.crashIn[0] },
  ...HIT.rumble.map((t, i) => ({ t: t + .3, type: 'thrum', n: i, pan: -.1 })),
  { t: HIT.crashOut[0], type: 'crashout', d: HIT.crashOut[1] - HIT.crashOut[0] },
  { t: HIT.startle, type: 'startle', pan: -.1 },
  { t: HIT.crouch[0], type: 'crouch', pan: -.1 },
  { t: HIT.leap[0], type: 'leap', pan: -.2 },
  { t: HIT.leap[0] + .05, type: 'dust', pan: -.1 },
  // câu hỏi; chữ móc trở lại; Hop rơi về, đáp; Crumb chạy lại; Miss Loupe nhảy ra
  { t: HIT.recall, type: 'recall' },
  { t: HIT.fall[0], type: 'fall', d: HIT.fall[1] - HIT.fall[0], pan: -.1 },
  { t: HIT.fall[1], type: 'landing', pan: -.05 },
  { t: HIT.back[0], type: 'scurry', d: .32, pan: .25 },
  { t: HIT.exit[0], type: 'hopout', pan: -.6 },
];
