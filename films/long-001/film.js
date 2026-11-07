// LONG-001 · How Do Bugs Taste, Smell & Hear? A Snowy Adventure — mọi khung hình là hàm thuần của t (16:9, 1920×1080).
// Ráp các cảnh: móc → tựa → 4 chương (trang đóng băng → lặn vào ký ức → ra → trang tan → "Secret unlocked!" → lật trang) → chương 5 (vườn tuyết)
// → kết → đố vui → tạm biệt → "Did you spot Rollo?". Cảnh ở sill.js, memories.js, winter.js; công cụ 16:9 ở lib16.js.
import { C, REC, clamp, lerp, seg, TAU, H, lineOf, ss, ei, cam, subtitle16, cardAt, lensIris, holeDive, holeOut, pulse, hold, big, breath, setEnv as _setEnv, DUR } from './lib16.js';
import { sHook, sTitle, pageView, pageCast, sillWide, pageFlip, HOLE, PL, LP, TAB } from './sill.js';
import { sC1m, sC2m, sC3m, sC4m, sC4n, sC4h, c1World, mazeWorld, c3World, c4World } from './memories.js';
import { sC5, sC5o, sEnd, sQuiz, sBye, sRollo, pageSticker } from './winter.js';
import { memoryFrame } from './props.js';
export const setEnv = _setEnv;

const muted = fn => c => { REC.mute++; fn(c); REC.mute--; };
const framed = (n, fn) => c => { fn(c); memoryFrame(c, 1920, 1080, { tab: TAB[n] }); };
const MEM = [
  { n: 0, s: 's_c1m', out: 'c1_out', melt: 'c1_melt', next: 'c1_next', un: 'L22', page: 's_c1', dive: 'c1_dive', huff: 'c1_huff', draw: (c, t) => sC1m(c, t) },
  { n: 1, s: 's_c2m', out: 'c2_out', melt: 'c2_melt', next: 'c2_next', un: 'L38', page: 's_c2', dive: 'c2_dive', lens: 'c2_lens', draw: (c, t) => sC2m(c, t) },
  { n: 2, s: 's_c3m', out: 'c3_out', melt: 'c3_melt', next: 'c3_next', un: 'L50', page: 's_c3', dive: 'c3_dive', draw: (c, t) => sC3m(c, t) },
  { n: 3, s: 's_c4m', out: 'c4_out', melt: 'c4_melt', next: 'c4_arrow', un: 'L61', page: 's_c4', dive: 'c4_dive', draw: (c, t) => c4Memory(c, t) },
];
function c4Memory(c, t) {                                         // mép ao → đêm đom đóm → tổ ong (đổi bằng hoà mờ)
  if (t < H.c4_night) return sC4m(c, t);
  if (t < H.s_c4n) { sC4m(c, t); c.save(); c.globalAlpha = ss(seg(t, H.c4_night, H.s_c4n)); sC4n(c, t); c.restore(); return; }
  if (t < H.c4_hive) return sC4n(c, t);
  if (t < H.s_c4h) { sC4n(c, t); c.save(); c.globalAlpha = ss(seg(t, H.c4_hive, H.s_c4h)); sC4h(c, t); c.restore(); return; }
  sC4h(c, t);
}
const warmBefore = n => [0, 1, 2, 3].map(i => i < n ? 1 : 0);

function chapter(c, t, m) {
  const n = m.n, mem = framed(n, cc => m.draw(cc, Math.max(t, H[m.s])));
  const page = (cc, tt, o = {}) => pageView(cc, tt, n, { t0: H[m.page], tabsIce: warmBefore(n).map(w => 1 - w), ...o });
  // 1 · trang đóng băng; Crumb hà hơi (chương 1) hoặc kính soi (chương 2) mở ra một lỗ nhìn vào ký ức
  if (t < H[m.dive]) {
    const hole = m.huff ? ss(seg(t, H[m.huff] + .2, H[m.huff] + 1.1)) : m.lens ? 0 : ss(seg(t, H[m.dive] - 1.2, H[m.dive]));
    page(c, t, { hole, mem: muted(cc => framed(n, c2 => m.draw(c2, H[m.s]))(cc)) });
    const huff = m.huff ? seg(t, H[m.huff], H[m.huff] + 1.1) : !m.lens ? seg(t, H[m.dive] - 1.3, H[m.dive] - .1) : 0;
    if (m.lens) {
      const u = ss(seg(t, H[m.lens], H[m.lens] + .6));
      pageCast(c, t, { lx: lerp(PL.x, HOLE.x, u), ly: lerp(PL.y, HOLE.y, u), lr: lerp(PL.r, 210, u), lname: u > .5 ? 'surprised' : 'happy', lpose: u > .5 ? { handR: [.6, -1.62, .3], elbowR: [.7, -1.25, .1] } : {},
        inside: u > .02 ? muted(cc => { cc.save(); cc.beginPath(); cc.rect(0, 0, 1920, 1080); cc.clip(); mazeWorld(cc, H[m.s], { trail: true }); cc.restore(); }) : null });
    } else pageCast(c, t, { huff });
    return;
  }
  // 2 · lặn vào ký ức
  if (t < H[m.s]) {
    if (m.lens) return lensIris(c, t, H[m.dive], H[m.s], HOLE.x, HOLE.y, 210, cc => page(cc, t), mem);
    return holeDive(c, t, H[m.dive], H[m.s], { ...HOLE, r: 250 }, cc => { page(cc, t, { hole: 1, mem: muted(mem) }); pageCast(cc, t, {}); }, mem);
  }
  // 3 · trong ký ức
  if (t < H[m.out]) return mem(c);
  // 4 · ra khỏi ký ức về trang sổ
  if (t < H[m.out] + .8) return holeOut(c, t, H[m.out], H[m.out] + .8, { ...HOLE, r: 250 }, mem, cc => { page(cc, t, { hole: 1, mem: muted(mem) }); pageCast(cc, t, {}); });
  // 5 · băng nứt và tan, hình của trang hiện ra
  const un = lineOf(m.un);
  if (t < un.t - .1) {
    const crack = seg(t, H[m.melt], H[m.melt] + .4), melt = ss(seg(t, H[m.melt] + .3, H[m.melt] + 1.3)), hole = 1 - ss(seg(t, H[m.out] + .8, H[m.melt] + .2));
    page(c, t, { crack, melt, hole, mem: muted(mem), sticker: pageSticker(n, t, H[m.melt] + .6, 1e9), tabsIce: warmBefore(n + 1).map((w, i) => i === n ? 1 - melt : 1 - w) });
    pageCast(c, t, { cname: melt > .5 ? 'excited' : 'surprised', lname: melt > .5 ? 'laugh' : 'surprised', hop: .25 * pulse(t, H[m.melt] + 1.0, .4) });
    return;
  }
  // 6 · bậu cửa sổ: "Secret unlocked!", Albie ấm dần; trò chuyện; lật sang trang sau
  const wide = cc => sillWide(cc, Math.min(t, H[m.next] + 2), { warm: warmBefore(n + 1), unlock: true, t0u: un.t, glowI: n, pages: n + 1, pagesT: un.t,
    cname: n === 0 && t > lineOf('L24').t ? 'curious' : n === 1 && t > lineOf('L40').t ? 'surprised' : 'excited', clook: [.7, -.3], lname: 'laugh',
    chop: .25 * pulse(t, un.t, .4), extra: n === 3 ? cc2 => danceArrow(cc2, t) : null });
  const nextPage = n < 3 ? MEM[n + 1].page : 's_c5';
  if (t < H[m.next] + (n === 3 ? .4 : 0)) return wide(c);
  const t0 = H[m.next] + (n === 3 ? .4 : 0), t1 = H[nextPage];
  pageFlip(c, t, t0, t1, wide, cc => n < 3 ? pageView(cc, t, n + 1, { t0: t1, tabsIce: warmBefore(n + 1).map(w => 1 - w) }) : pageView(cc, t, 4, { empty: true, tabsIce: [0, 0, 0, 0] }));
}
function danceArrow(c, t) {                                       // mũi tên của điệu nhảy chỉ về trang cuối
  const p = ss(seg(t, H.c4_arrow, H.c4_arrow + .6)); if (p <= 0) return;
  const x0 = 1180, y = 330, x1 = lerp(x0, 1700, p);
  c.lineCap = 'round'; c.strokeStyle = C.cream; c.lineWidth = 26; c.setLineDash([30, 26]); c.lineDashOffset = -t * 120; c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke(); c.setLineDash([]);
  c.fillStyle = C.cream; c.beginPath(); c.moveTo(x1 + 60, y); c.lineTo(x1 - 10, y - 50); c.lineTo(x1 - 10, y + 50); c.fill();
}

// bốn khung nhỏ cho "Did you spot Rollo?" (vẽ ký ức đúng lúc Rollo đi qua; rx, ry: chỗ Rollo trong khung 1920×1080)
const MINIS = [
  { draw: c => c1World(c, H.rollo1 + .9, { cast: false }), rx: 1000, ry: 740 },
  { draw: c => mazeWorld(c, H.rollo2 + 1.0), rx: 1000, ry: 1040 },
  { draw: c => c3World(c, H.rollo3 + 1.2), rx: 500, ry: 740 },
  { draw: c => c4World(c, H.rollo4 + 1.1, { cast: false }), rx: 500, ry: 690 },
];

export function drawFilm(c, t, o = {}) {
  t = clamp(t, 0, DUR - .001);
  c.save();
  if (t < H.s_title - .35) sHook(c, t);
  else if (t < H.s_title) lensIris(c, t, H.s_title - .35, H.s_title, LP.x, LP.y, LP.r, cc => sHook(cc, t, { noLup: true }), cc => sTitle(cc, t));
  else if (t < H.s_c1 - .3) sTitle(c, t);
  else if (t < H.s_c1) lensIris(c, t, H.s_c1 - .3, H.s_c1, 960, 560, 200, cc => sTitle(cc, t), cc => pageView(cc, H.s_c1, 0, { t0: H.s_c1 }));
  else if (t < H.s_c2) chapter(c, t, MEM[0]);
  else if (t < H.s_c3) chapter(c, t, MEM[1]);
  else if (t < H.s_c4) chapter(c, t, MEM[2]);
  else if (t < H.s_c5) chapter(c, t, MEM[3]);
  else if (t < H.s_c5o) sC5(c, t);
  else if (t < H.s_end) sC5o(c, t);
  else if (t < H.s_quiz) sEnd(c, t);
  else if (t < H.s_bye) sQuiz(c, t);
  else if (t < H.s_rollo) sBye(c, t);
  else sRollo(c, t, MINIS);
  const card = cardAt(t); if (card && !o.noSub) subtitle16(c, card, t);
  c.restore();
}
