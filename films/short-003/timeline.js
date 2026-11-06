// Một nguồn thời gian duy nhất cho hình, phụ đề, âm thanh. Bản B: 120 BPM, 12 ô nhịp = 24 s, phát vòng lặp liền mạch.
export const BPM = 120, BEAT = 60 / BPM, BAR = BEAT * 4;
export const at = (bar, beat = 0) => (bar * 4 + beat) * BEAT;
export const PACE = .85;   // lời dẫn chậm hơn tập A khoảng 15% (kế hoạch §4.3); câu cửa miệng giữ tốc độ chuẩn

// night: sân khấu nấm dưới trăng → kéo xa → soi trong kính → nhịp "ồ" (một cảnh liền, máy quay theo keyframe); album: sổ của Albie, gag, vòng lặp
// Bản v3 (RETENSIS.md): tựa móc nảy to ở khung đầu, cái đầu gối "nghe" trước; kính → sổ bằng cú zoom xuyên qua mặt kính, hình trong kính hoá thành sticker (match cut);
// kết: "Where are YOUR ears?" → Chirp khoe cái tai ở đầu gối → chữ EARS ON KNEES?! trở lại đúng chỗ của khung đầu → vòng lặp liền
export const SECS = [
  { id: 'night', t0: 0, t1: 12.55 },
  { id: 'album', t0: 12.55, t1: at(12) },
];
export const DUR = at(12);

// Mốc hành động dùng chung cho hình và tiếng (giây tuyệt đối)
export const HIT = {
  crash: [0, .45], words: [0, .12], hear: at(0, 1), kneeLook: [.52, .8], answer: .8, answerEnd: 1.7, listen2: 1.75, pull: 2.45, lensIn: 2.6, zoom: 3.6,
  glow: at(2, 1), drumIn: 7.3, drumHit: [8.0, 8.5, 9.3], drumText: 8.45, lensOut: 9.6, push: 9.6, bend: 9.7, giggle: 11.75, laugh: 11.95,
  snap: 12.1, zoomIn: [12.2, 12.55], zoomOut: [12.55, 12.9], irisA: 12.2, irisB: 12.55,
  stamp: 12.9, hop: 15.4, hopLand: 15.85, nope: 17.7, cover: 17.8, peek: 20.35, show: 21.85, recall: 22.2, listen3: 22.6, far3: [22.75, 23.05, 23.6], ring: 23.2, loop: at(12),
};

// t: lúc bắt đầu nói (giây). dur: độ dài thật (voice/dur.json). who: giọng trong _shared/voices.js.
// catch: câu cửa miệng (tốc độ chuẩn). pace: ghi đè hệ số chậm của bản B cho câu đó.
export const LINES = [
  { id: 'L01', who: 'loupe', t: .1, dur: 2.145, card: 1, text: 'What if your ears were on your knees?' },
  { id: 'L02', who: 'loupe', t: 2.75, dur: .999, card: 1, text: "Let's zoom in!", catch: true },
  { id: 'L03', who: 'loupe', t: 4.4, dur: 2.17, card: 2, text: 'Its ears are on its front legs!' },   // "its" thay cho "cricket's" (Whisper nghe "Cricut's")
  { id: 'L04', who: 'loupe', t: 7.3, dur: 2.316, card: 3, text: 'Each one is like a tiny drum!' },
  { id: 'L05', who: 'loupe', t: 10.25, dur: 1.444, card: 4, text: 'Hello, little ears!' },
  { id: 'L06', who: 'albie', t: 13.1, dur: 2.297, card: 5, text: 'Six legs? In you go!', catch: true },
  { id: 'L07', who: 'albie', t: 16.1, dur: 1.483, card: 6, text: 'Ears on its head?', pace: 1 },
  { id: 'L08', who: 'loupe', t: HIT.nope, dur: .628, card: 6, text: 'NOPE!', pace: 1 },
  { id: 'L09', who: 'loupe', t: 19.3, dur: 1.013, card: 7, text: 'Oops! Sorry!', pace: 1 },
  { id: 'L10', who: 'loupe', t: 20.7, dur: 1.0, card: 7, text: 'Where are YOUR ears?', pace: 1 },   // câu hỏi kết (RETENSIS.md v3): trẻ chỉ vào tai mình, Chirp khoe tai ở đầu gối
];
// Tấm phụ đề: giữ ≥ 1,8 s và ≥ câu cuối + 0,6 s (DIRECTOR.md §7); không được chồng tấm sau. Chữ hiện dần theo câu đã nói.
export const CARDS = [...new Set(LINES.map(l => l.card))].map(k => {
  const ls = LINES.filter(l => l.card === k), t0 = ls[0].t, end = ls.at(-1).t + ls.at(-1).dur;
  return { t0, t1: Math.max(t0 + 1.8, end + .6), text: ls.map(l => l.text).join(' '), parts: ls.map(l => ({ t: l.t, text: l.text })) };
});
export const CARD_CLASHES = CARDS.filter((c, i) => i + 1 < CARDS.length && c.t1 > CARDS[i + 1].t0).map(c => c.text);

// 9 khung cho storyboard
export const BOARD = [
  { t: 0, shot: '1', frame: 'Medium, low · loop frame', dur: '2.5 s', line: 'What if your ears were on your knees?' },
  { t: 1.2, shot: '1', frame: 'Medium', dur: '2.5 s', line: '(Chirp chirps back)' },
  { t: 3.0, shot: '2', frame: 'Wide, pull back', dur: '1.5 s', line: "Let's zoom in!" },
  { t: 5.4, shot: '3', frame: 'Close-up in lens', dur: '3.3 s', line: 'Its ears are on its front legs!' },
  { t: 9.35, shot: '4', frame: 'Lens: the wave arrives', dur: '2.5 s', line: 'Each one is like a tiny drum!' },
  { t: 10.6, shot: '5', frame: 'Medium, push', dur: '2.4 s', line: 'Hello, little ears!' },
  { t: 12.45, shot: '6', frame: 'Zoom through the lens → sticker', dur: '0.8 s', line: '(match cut: lens = sticker)' },
  { t: 14.2, shot: '7', frame: 'Wide, drifting', dur: '2.7 s', line: 'Six legs? In you go!' },
  { t: 18.0, shot: '8', frame: 'Wide, shake', dur: '4.9 s', line: 'Ears on its head? NOPE!' },
  { t: 22.4, shot: '9', frame: 'Wide, title returns', dur: '1.8 s', line: 'Where are YOUR ears? EARS ON KNEES?!' },
];

// Sự kiện âm thanh, khớp với chuyển động trong film.js (core/render/events.mjs → events.json → mix.py). Bảng cue đầy đủ ở SOUND.md.
// Tiếng nằm dưới lời thì ở dải cao và nhỏ (hoặc dải trầm); mỗi chuyển cảnh một tiếng riêng.
export const EV = [
  // mở (0–2,6 s): con dế xa gáy → vòng sóng chạm tai Chirp → Chirp gáy đáp, nốt nhạc bật → lại vểnh chân → kéo xa, chữ móc thu lại → Miss Loupe vào
  { t: 0, type: 'titlepop' },                                    // chữ EARS ON / KNEES?! bật ra ở khung đầu
  { t: 0, type: 'crash', d: .45 },                               // máy lao vào Chirp (cú zoom nhanh của hook, v2)
  ...HIT.words.map((t, i) => ({ t, type: 'wordpop', n: i })),     // v3: mỗi dòng chữ móc nảy lên một tiếng (boing · pop)
  { t: 0, type: 'farchirp', pan: .75 },                          // tiếng gáy xa (tiếng trước đó ở 23,75 cuối phim: vòng lặp)
  { t: HIT.hear, type: 'hear' },                                 // vòng sóng chạm tai: "ping", mắt Chirp tròn xoe
  { t: HIT.hear + .02, type: 'twitch', pan: .1 },                // v3: cái đầu gối giật lên trước cả cái đầu; Chirp ngó xuống đầu gối mình
  ...[0, 1, 2, 3].map(i => ({ t: HIT.answer + i * .25, type: 'chirp', pan: -.15 })),   // Chirp gáy đáp lại
  ...[0, 1, 2].map(i => ({ t: HIT.answer + .08 + i * .3, type: 'notepop', m: [84, 88, 91][i] })),   // nốt nhạc bật lên
  { t: HIT.listen2, type: 'legup' },                             // vểnh chân lên nghe
  { t: 2.0, type: 'farchirp', pan: .75 }, { t: 2.25, type: 'farchirp', pan: .75 },
  { t: HIT.pull, type: 'pullback' },
  { t: 2.55, type: 'shrink' },                                   // chữ móc thu nhỏ biến mất 2,55–2,9
  { t: HIT.lensIn, type: 'swipe', d: .45, pan: .6 },             // Miss Loupe và kính trượt vào từ phải
  { t: 3.4, type: 'tink', pan: .1 },                             // mặt kính dừng trên ống chân
  // soi
  { t: HIT.zoom, type: 'zoom' },
  { t: HIT.glow, type: 'sparkle' },                              // cái tai sáng lên
  { t: HIT.drumIn, type: 'swish', d: .5, v: .25, lo: 1200, hi: 5000, up: false, pan: .3 },   // kính lùi theo sóng âm
  ...HIT.drumHit.map((t, i) => ({ t: t - .45, type: 'farchirp', pan: .6, v: .7 })),          // mỗi vòng sóng: tiếng gáy xa…
  ...HIT.drumHit.map((t, i) => ({ t, type: 'drum', v: i === 2 ? 1 : .7 })),                  // …chạm mặt tai: "bum" (dải trầm, dưới lời)
  { t: HIT.lensOut, type: 'swishout', pan: .4 },                 // kính rời chân; máy đẩy vào và cô nhảy lên mép mũ nấm cùng lúc (v2)
  { t: HIT.push, type: 'push' },
  // nhịp "ồ" (ngắn lại)
  { t: HIT.bend, type: 'swish', d: .35, v: .18, lo: 300, hi: 1500, up: false, pan: .3 },
  { t: HIT.giggle, type: 'giggle', pan: -.2 },                   // Chirp khúc khích, tai lóe sáng
  { t: HIT.giggle + .05, type: 'sparkle', v: .4 },
  { t: HIT.laugh, type: 'boing', v: .35 },
  // chuyển cảnh mới: kính "chụp" cái tai thành sticker → sticker bay ra → máy lia theo sang sổ
  { t: HIT.snap, type: 'snap' },
  { t: HIT.zoomIn[0], type: 'zoomin', d: HIT.zoomIn[1] - HIT.zoomIn[0] },     // v3: máy lao xuyên qua mặt kính
  { t: HIT.zoomOut[0], type: 'zoomout', d: HIT.zoomOut[1] - HIT.zoomOut[0] },  // hình trong kính hoá thành sticker, máy lùi ra: trang sổ của Albie
  // sổ và gag
  { t: HIT.irisB + .05, type: 'page' },
  { t: HIT.stamp, type: 'stamp' },
  { t: HIT.stamp + .02, type: 'ding', m: 89 },
  { t: HIT.hop, type: 'hop', pan: .5 },                          // Chirp nhảy tới cạnh sổ
  { t: HIT.hopLand, type: 'land', pan: .3 },
  { t: HIT.nope - .04, type: 'nope', pan: .6 },                  // chữ NOPE! bay vào, màn hình rung
  { t: HIT.nope + .05, type: 'pages', d: .4, pan: -.3 },         // trang Albie phần phật
  { t: HIT.cover, type: 'squeeze', pan: .2 },                    // Chirp bịt chặt đầu gối
  { t: HIT.peek, type: 'blip', m: 88, pan: .2 },                 // hé mắt
  { t: HIT.show, type: 'show', pan: .2 },                        // v3: Chirp khoe cái tai ở đầu gối (ta-da)
  { t: HIT.recall, type: 'recall' },                             // chữ EARS ON KNEES?! trở lại đúng chỗ của khung đầu
  { t: HIT.listen3, type: 'legup' },                             // quay chân về phía tiếng gáy xa (đúng tư thế khung đầu)
  ...HIT.far3.map((t, i) => ({ t, type: 'farchirp', pan: .75, v: [.8, .9, 1][i] })),   // tiếng gáy xa của khung đầu: câu trả lời cho câu hỏi, nối sang 0,0
  { t: HIT.ring, type: 'ringiris' },                             // vòng sóng âm mở ra khung đầu, dâng đến đúng điểm lặp
];
