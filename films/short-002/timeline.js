// Một nguồn thời gian duy nhất cho hình, phụ đề, âm thanh. Bản B: 120 BPM, 11 ô nhịp = 22 s, phát vòng lặp liền mạch.
export const BPM = 120, BEAT = 60 / BPM, BAR = BEAT * 4;
export const at = (bar, beat = 0) => (bar * 4 + beat) * BEAT;
export const PACE = .85;   // lời dẫn chậm hơn tập A khoảng 15% (kế hoạch §4.3); câu cửa miệng giữ tốc độ chuẩn

// picnic: cận chân → kéo xa → soi trong kính → nhịp "ồ" (một cảnh liền, máy quay chạy theo keyframe)
// v4 (quy tắc chung từ SHORT-003, _shared/QUALITY.md): tựa móc nảy có tiếng; kính quay lại "chụp" Flutter → match cut thành sticker; câu hỏi kết + chữ móc trở lại
// v5 (quy tắc câu hỏi kết, 06/11/2026): câu hỏi kết hiện to trên hình (askTitle, HIT.ask) đủ 2,2 s, chừa nhịp chờ trẻ trả lời, rồi chữ móc trở lại đúng chỗ đó
export const SECS = [
  { id: 'picnic', t0: 0, t1: 13.8 },
  { id: 'album', t0: 13.8, t1: at(11) },
];
export const DUR = at(11);

// Mốc hành động dùng chung cho hình và tiếng (giây tuyệt đối)
export const HIT = {
  words: [0, .12], stomp: at(0, 1), sproing: at(0, 1.75), curl: 1.9, pull: 2.45,
  lensIn: 2.6, zoom: 3.6, tap: at(2, 1), sweet: at(3, 2),
  sigA: 8.0, sigB: 8.9, straw: 9.2, sip: 10.2, lensOut: 10.3, push: 10.6,
  wow: 11.75, shoe: [at(6, 1), at(6, 1.5)], shrug: 13.0,
  aim: [13.0, 13.35], snap: 13.4, zoomIn: [13.5, 13.8], zoomOut: [13.8, 14.15], irisA: 13.5, irisB: 13.8,
  stamp: 14.3, fly: 16.8, land: 17.6, shout: 17.7, sipPage: 18.4, mmm: 19.42, ask: [19.4, 21.6], wait: 21.42, recall: 21.6,   // v5: gag sớm hơn 0,15–0,25 s để câu hỏi kết có chỗ
  takeoff: 21.4, spot: 21.6, loop: at(11),
};

// t: lúc bắt đầu nói (giây). dur: độ dài thật (voice/dur.json). who: giọng trong _shared/voices.js.
// catch: câu cửa miệng (tốc độ chuẩn). pace: ghi đè hệ số chậm của bản B cho câu đó.
export const LINES = [
  { id: 'L01', who: 'loupe', t: .1, dur: 2.511, card: 1, text: 'What if your socks could taste your snack?' },
  { id: 'L02', who: 'loupe', t: 2.75, dur: .999, card: 1, text: "Let's zoom in!", catch: true },
  { id: 'L03', who: 'loupe', t: 4.4, dur: 2.503, card: 2, text: 'Its feet have tiny taste spots.' },
  { id: 'L04', who: 'loupe', t: HIT.sweet, dur: 1.083, card: 2, text: "It's sweet!" },   // "Sweet!" đứng một mình bị Whisper nghe thành "as we eat"
  { id: 'L05', who: 'loupe', t: 8.75, dur: 2.306, card: 3, text: 'So out comes its curly straw!' },
  { id: 'L06', who: 'loupe', t: HIT.wow, dur: .574, card: 4, text: 'Wow!', pace: 1 },
  { id: 'L07', who: 'albie', t: 14.6, dur: 2.297, card: 5, text: 'Six legs? In you go!', catch: true },
  { id: 'L08', who: 'albie', t: HIT.shout, dur: 1.718, card: 6, text: 'Not my pages!', say: 'NOT my pages!', pace: 1 },
  { id: 'L09', who: 'loupe', t: 20.05, dur: 1.314, card: 7, text: 'What would YOUR feet taste?', pace: 1 },   // v4: câu hỏi kết cho trẻ (sau tiếng "Mmm!" của Flutter). v5: sớm 0,4 s, chữ to trên hình (HIT.ask)
];
// Tấm phụ đề: giữ ≥ 1,8 s và ≥ câu cuối + 0,6 s (DIRECTOR.md §7); không được chồng tấm sau. Chữ hiện dần theo câu đã nói.
export const CARDS = [...new Set(LINES.map(l => l.card))].map(k => {
  const ls = LINES.filter(l => l.card === k), t0 = ls[0].t, end = ls.at(-1).t + ls.at(-1).dur;
  return { t0, t1: Math.min(DUR, Math.max(t0 + 1.8, end + .6)), text: ls.map(l => l.text).join(' '), parts: ls.map(l => ({ t: l.t, text: l.text })) };
});
export const CARD_CLASHES = CARDS.filter((c, i) => i + 1 < CARDS.length && c.t1 > CARDS[i + 1].t0).map(c => c.text);

// 10 khung cho storyboard
export const BOARD = [
  { t: 0, shot: '1', frame: 'Close-up · cover frame', dur: '2.5 s', line: 'What if your socks could taste your snack?' },
  { t: 1.2, shot: '1', frame: 'Close-up', dur: '2.5 s', line: '(the straw pops out by itself)' },
  { t: 3.3, shot: '2', frame: 'Medium, pull back', dur: '1.5 s', line: "Let's zoom in!" },
  { t: 5.6, shot: '3', frame: 'Close-up in lens', dur: '3.3 s', line: 'Its feet have tiny taste spots.' },
  { t: 7.6, shot: '3', frame: 'Close-up in lens', dur: '3.3 s', line: "It's sweet!" },
  { t: 9.6, shot: '4', frame: 'Lens tracks the signal', dur: '2.3 s', line: 'So out comes its curly straw!' },
  { t: 12.6, shot: '5', frame: 'Medium, push + tilt', dur: '2.4 s', line: 'Wow! (taps her shoes)' },
  { t: 16.4, shot: '7', frame: 'Wide, held', dur: '4 s', line: 'Six legs? In you go!' },
  { t: 19.2, shot: '8', frame: 'Wide', dur: '2 s', line: 'NOT my pages! · "Mmm!"' },
  { t: 20.9, shot: '9', frame: 'Wide, big question', dur: '2.2 s', line: 'What would YOUR feet taste?' },
];

// Sự kiện âm thanh, khớp với chuyển động trong film.js (core/render/events.mjs → events.json → mix.py).
// Bảng cue đầy đủ (hình ↔ tiếng) ở SOUND.md. Mỗi chuyển cảnh một tiếng riêng; tiếng nằm dưới lời thì ở dải cao và nhỏ.
export const EV = [
  ...HIT.words.map((t, k) => ({ t, type: 'wordpop', n: k })),   // v4: mỗi dòng chữ móc nảy một tiếng
  // mở (0–3,4 s): Flutter hạ xuống → dậm chân → máy đẩy cận, vòi bung → máy kéo xa, chữ móc thu lại → Miss Loupe trượt vào
  { t: 0, type: 'titlepop' },                                 // chữ TASTY SOCKS?! bật ra ở khung đầu (bong bóng cao + phím glock), xong trước chữ đầu câu
  { t: 0, type: 'flutter', d: .5 },                            // cánh vỗ khi đang hạ xuống (còi rơi nối từ cuối phim: 'descend')
  { t: HIT.stomp, type: 'squish' },
  { t: HIT.stomp + .05, type: 'splash' },
  { t: HIT.sproing - .2, type: 'punch' },                      // máy đẩy cận .755–1.075
  { t: HIT.sproing, type: 'sproing' },
  { t: HIT.curl + .38, type: 'curl', d: .4 },                  // sau chữ "snack" để không che đuôi câu
  { t: 2.36, type: 'tink', pan: -.1 },                         // đốm sáng gợi ý nháy ở bàn chân (HOOK.md), sau chữ "snack"
  { t: HIT.pull, type: 'pullback' },
  { t: 2.55, type: 'shrink' },                                 // chữ TASTY SOCKS?! thu nhỏ biến mất 2,55–2,9
  { t: HIT.lensIn, type: 'swipe', d: .45, pan: .6 },           // Miss Loupe và kính trượt vào từ phải 2,6–3,4
  { t: 3.4, type: 'tink', pan: .1 },                           // mặt kính dừng trên bàn chân
  // soi
  { t: HIT.zoom, type: 'zoom' },
  { t: HIT.tap, type: 'tap' },
  { t: HIT.tap + .05, type: 'sparkle' },
  { t: HIT.tap + .2, type: 'bubbles', d: 1.4 },
  { t: HIT.sweet, type: 'chime' },
  { t: HIT.sigA, type: 'signal', d: HIT.sigB - HIT.sigA },
  { t: HIT.straw, type: 'slide', d: .8 },
  { t: HIT.sip, type: 'slurp' },
  { t: HIT.lensOut, type: 'swishout', pan: .4 },               // kính rời bướm, lùi về tay cô
  { t: HIT.push, type: 'push' },                               // máy đẩy vào Miss Loupe 10,6–11,4
  // nhịp "ồ": lấp lánh sau chữ "Wow!", gõ giày, nhún vai
  { t: HIT.wow + .45, type: 'wonder' },
  ...HIT.shoe.map((t, i) => ({ t, type: 'squeak', v: i ? .45 : .55 })),
  { t: HIT.shrug, type: 'boing', v: .4 },
  { t: HIT.aim[0], type: 'swish', d: .35, v: .22, lo: 1400, hi: 4500, up: true, pan: -.3 },   // v4: kính quay lại phía Flutter
  { t: HIT.snap, type: 'snap' },                               // "chụp" Flutter
  { t: HIT.zoomIn[0], type: 'zoomin', d: HIT.zoomIn[1] - HIT.zoomIn[0] },
  { t: HIT.zoomOut[0], type: 'zoomout', d: HIT.zoomOut[1] - HIT.zoomOut[0] },
  // sổ và gag
  { t: HIT.irisB + .05, type: 'page' },
  { t: HIT.stamp, type: 'stamp' },
  { t: HIT.stamp + .02, type: 'ding', m: 91 },
  { t: HIT.fly, type: 'flutter', d: .9, pan: .6 },
  { t: HIT.land, type: 'land' },
  { t: HIT.land, type: 'paper', pan: -.2 },                    // đậu lên mép trang giấy
  { t: HIT.land + .1, type: 'boing', v: .5 },
  { t: HIT.sipPage, type: 'slurp' },
  { t: HIT.mmm, type: 'mmm' },
  { t: HIT.ask[0], type: 'ask' },                              // v5: chữ câu hỏi kết bật ra (nhỏ, trước lời 0,5 s)
  { t: HIT.ask[0] + .3, type: 'askq' },                        // hai dấu "?" nhún (dải cao, nhỏ)
  { t: HIT.recall, type: 'recall' },                          // v4: chữ TASTY SOCKS?! trở lại đúng chỗ của khung đầu (v5: sau câu hỏi, đúng chỗ chữ câu hỏi)
  { t: HIT.takeoff, type: 'flutter', d: .7, pan: 0 },
  { t: HIT.takeoff + .02, type: 'flyby' },                     // bay thẳng vào ống kính 21,25–21,65
  { t: HIT.spot, type: 'spot' },                               // vòng đốm mắt mở ra, dâng lên đến điểm lặp
  { t: 21.65, type: 'descend', d: .45 },                       // còi rơi qua điểm lặp: Flutter hạ xuống miếng dưa (tắt trước chữ đầu câu)
];
