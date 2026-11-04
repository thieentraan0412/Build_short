// Một nguồn thời gian duy nhất cho hình, phụ đề, âm thanh. Dài lời dự kiến sẽ thay bằng số đo thật sau khi có giọng đọc.
export const BPM = 120, BEAT = 60 / BPM, BAR = BEAT * 4;
export const at = (bar, beat = 0) => (bar * 4 + beat) * BEAT;
export const WAGGLE_DEG = 12;   // góc vạch nhảy so với trục đứng = góc đường bay so với hướng mặt trời (FACTS.md)

export const SECS = [
  { id: 'hook', bar: 0, bars: 2 },
  { id: 'title', bar: 2, bars: 1 },
  { id: 'butterfly', bar: 3, bars: 5 },
  { id: 'cricket', bar: 8, bars: 5 },
  { id: 'bee', bar: 13, bars: 3 },
  { id: 'map', bar: 16, bars: 3 },
  { id: 'album', bar: 19, bars: 2 },
  { id: 'gag', bar: 21, bars: 2 },
].map(s => ({ ...s, t0: at(s.bar), t1: at(s.bar + s.bars) }));
export const DUR = at(23);

// lens iris: kính lớn dần, cảnh sau đã nằm sẵn trong kính
export const IRIS = [
  { t0: at(2, 3), t1: at(3), from: 'title', to: 'butterfly', x: 540, y: 860 },
  { t0: at(7, 2), t1: at(8), from: 'butterfly', to: 'cricket', x: 540, y: 860 },
  { t0: at(12, 2), t1: at(13), from: 'cricket', to: 'bee', x: 540, y: 860 },
  { t0: at(18, 2), t1: at(19), from: 'map', to: 'album', x: 540, y: 860 },
];

// t: lúc bắt đầu nói (giây). dur: độ dài thật của giọng (voice/dur.json, en-US-EmmaNeural). card: các câu chung một tấm phụ đề.
export const LINES = [
  { id: 'L01', t: 0, dur: 1.585, card: 1, text: 'Can you taste with your feet?' },
  { id: 'L02', t: 2.25, dur: 1.245, card: 2, text: 'Butterflies can!' },
  { id: 'L03', t: 4.125, dur: 1.79, card: 3, text: 'Big secrets of tiny bugs!' },
  { id: 'L04', t: 6.52, dur: 1.946, card: 4, text: 'A butterfly lands on a flower,' },
  { id: 'L05', t: 8.6, dur: 3.019, card: 4, text: 'and tiny taste spots on its feet tell it right away:' },
  { id: 'L06', t: at(6, .5), dur: 1.759, card: 5, text: 'Sweet! Time to eat!' },
  { id: 'L07', t: at(8), dur: 1.246, card: 6, text: 'What about crickets?' },
  { id: 'L08', t: 17.4, dur: 1.136, card: 6, text: 'Where are its ears?' },
  { id: 'L09', t: 19.5, dur: 1.346, card: 7, text: 'Nope, not on its head!' },
  { id: 'L10', t: at(11), dur: 2.197, card: 8, text: "A cricket's ears are on its front legs!" },
  { id: 'L11', t: at(13), dur: 1.383, card: 9, text: "Honeybees can't talk," },
  { id: 'L12', t: at(14), dur: 1.015, card: 9, text: 'so they dance!' },
  { id: 'L13', t: at(15), dur: 3.598, card: 10, text: 'The dance tells the hive which way the flowers are, and how far.' },
  { id: 'L14', t: at(19), dur: 2.143, card: 11, text: "Next time you're outside, look closely!" },
  { id: 'L15', t: at(21.5), dur: 1.97, card: 12, text: 'Hey... is it tasting me?' },
];
// Tấm phụ đề: giữ ≥ 1,8 s và ≥ câu cuối + 0,6 s (DIRECTOR.md §7); không được chồng tấm sau.
export const CARDS = [...new Set(LINES.map(l => l.card))].map(k => {
  const ls = LINES.filter(l => l.card === k), t0 = ls[0].t, end = ls.at(-1).t + ls.at(-1).dur;
  return { t0, t1: Math.max(t0 + 1.8, end + .6), text: ls.map(l => l.text).join(' ') };
});
export const CARD_CLASHES = CARDS.filter((c, i) => i + 1 < CARDS.length && c.t1 > CARDS[i + 1].t0).map(c => c.text);

// 9 khung cho storyboard: thời điểm, số cảnh, khung hình, độ dài cảnh, lời
export const BOARD = [
  { t: 1.62, shot: '1', frame: 'Wide', dur: '4 s', line: 'Can you taste with your feet?' },
  { t: 5.45, shot: '2', frame: 'Medium', dur: '2 s', line: 'Big secrets of tiny bugs!' },
  { t: 10.6, shot: '4', frame: 'Close-up in lens', dur: '3 s', line: 'and tiny taste spots on its feet...' },
  { t: 13.0, shot: '5', frame: 'Medium', dur: '3 s', line: 'Sweet! Time to eat!' },
  { t: 19.7, shot: '8', frame: 'Medium', dur: '3 s', line: 'Nope, not on its head!' },
  { t: 23.0, shot: '10', frame: 'Close-up in lens', dur: '2 s', line: "A cricket's ears are on its front legs!" },
  { t: 29.6, shot: '13', frame: 'Wide', dur: '4 s', line: 'so they dance!' },
  { t: 36.4, shot: '14', frame: 'Extreme wide, tilt', dur: '6 s', line: '(no voice: signature shot)' },
  { t: 44.5, shot: '16', frame: 'Close-up', dur: '4 s', line: 'Hey... is it tasting me?' },
];

// Sự kiện âm thanh, khớp với chuyển động trong film.js. Bộ trộn đọc chúng qua events.json (core/render/events.mjs).
export const EV = [
  // mở
  { t: .55, type: 'pop', v: .7 },
  { t: at(0, 3), type: 'stomp' },
  { t: 1.62, type: 'tick', v: .4 }, { t: 1.78, type: 'tick', v: .4 }, { t: 1.94, type: 'tick', v: .4 },
  { t: 2.2, type: 'whoosh', v: .5, pan: .6 },
  { t: 2.6, type: 'whoosh', v: .35, d: .5 },
  { t: 2.9, type: 'flutter', d: .7, pan: -.4 },
  { t: at(1, 3), type: 'iris' },
  // tựa
  { t: at(2), type: 'pop', v: .8 }, { t: at(2) + .12, type: 'pop', v: .6 },
  { t: at(2), type: 'whoosh', v: .4, pan: -.6 },
  { t: at(2, 1), type: 'sparkle', v: .5 },
  { t: at(2, 3), type: 'iris' },
  // bướm
  { t: at(3), type: 'sticker' },
  { t: at(3), type: 'flutter', d: 2, pan: -.5 },
  { t: at(4), type: 'land' },
  { t: 8.2, type: 'whoosh', v: .45, pan: .6 },
  { t: 8.6, type: 'zoom' },
  { t: 9.4, type: 'sparkle' },
  { t: 9.5, type: 'bubbles', d: 1.2 },
  { t: 11.6, type: 'whoosh', v: .35, pan: -.5 },
  { t: 12.0, type: 'slide', d: 1.2 },
  { t: at(6, .5), type: 'chime' },
  { t: 14.6, type: 'whoosh', v: .5, d: .35 },
  { t: at(7, 2), type: 'iris' },
  // dế
  { t: at(8), type: 'sticker' },
  { t: at(8, 2), type: 'pop', v: .6 }, { t: at(8, 2) + .3, type: 'pop', v: .5 },
  { t: 18.0, type: 'whoosh', v: .45, pan: .6 },
  { t: 19.4, type: 'buzzer' },
  { t: 19.9, type: 'whoosh', v: .4, d: .25, pan: -.4 },
  { t: 20.5, type: 'buzzer' },
  { t: at(11), type: 'reveal' },
  { t: at(11), type: 'pop', v: .6 }, { t: at(11) + .3, type: 'pop', v: .5 },
  { t: 23.9, type: 'whoosh', v: .4, pan: -.6 },
  { t: 24.0, type: 'slide', d: .6 },
  { t: 24.8, type: 'whoosh', v: .45, d: .25 },
  { t: at(12, 2), type: 'iris' },
  // ong
  { t: at(13), type: 'sticker' },
  { t: 26.2, type: 'pop', v: .5 },
  { t: 26.5, type: 'tick', v: .3 }, { t: 26.75, type: 'tick', v: .3 }, { t: 27.0, type: 'tick', v: .3 },
  { t: at(14), type: 'stamp' },
  // bản đồ
  { t: at(16), type: 'pullback' },
  { t: 32.8, type: 'buzzby', d: 1.8 },
  { t: 34.2, type: 'pop', v: .7 },
  { t: at(16, 6.4), type: 'pop', v: .55 }, { t: at(16, 6.8), type: 'pop', v: .5 },
  { t: at(18, 2), type: 'iris' },
  // sổ sưu tầm
  { t: at(19, 1), type: 'stamp' }, { t: at(19, 2), type: 'stamp' }, { t: at(19, 3), type: 'stamp' },
  // kết
  { t: at(21), type: 'flutter', d: 1, pan: .7 },
  { t: 43.0, type: 'tap' }, { t: 43.25, type: 'tick', v: .35 }, { t: 43.5, type: 'tick', v: .35 }, { t: 43.75, type: 'tick', v: .35 },
  { t: 44.1, type: 'slurp' },
  { t: at(22, 1), type: 'boing', v: .5 },
];
