// LONG-003 · bối cảnh và đạo cụ của SERIES-003 "Finding the Way": vườn đêm dưới Dải Ngân Hà (không trăng), mây che sao,
// lối đi về nhà, rìa vườn (phiến đá, khe nứt, cỏ cao, cọc hàng rào của Uncle Telly), bản đồ vườn của Albie, viên tròn của Rollo,
// đường mùi và khung "ngửi" của Crumb, đàn kiến, bóng nghĩ sa mạc với kiến sa mạc chân dài, nhìn từ trên xuống (vệt lăn),
// khung ống nhòm, trang mặt ao (cài trước Mùa 2). Đạo cụ có viền mực để đồng bộ với nhân vật v2.
import { C, circle, ell, capsule, rrect, poly, popText, subFont, clamp, lerp, seg, back, eo, TAU, star, ss, ei, inked, hash, glints } from './lib16.js';

export const N = {                                   // bảng màu đêm: trời tím chàm rực, cỏ xanh ngọc, đá tím xám (độ rực ≥ 0,35)
  sky0: '#24177A', sky1: '#30209A', sky2: '#4128B4', horizon: '#5A3BC8',
  hill: '#2C7FA0', hillD: '#22688A', hedge: '#1E8C76', hedgeD: '#167060',
  grass: '#1FAF7E', grassD: '#168F66', grassL: '#3CCB92', grassN: '#127A58', tall: '#2BB98C', tallD: '#1A936E',
  stone: '#A79BE0', stoneL: '#C3B9F2', stoneD: '#7F72C2', crack: '#3A2C8C', path: '#E6B97A', pathD: '#C9955A',
  wood: '#B8652B', woodL: '#D98A45', woodD: '#8E4A1D', window: '#FFD35F',
  sand: '#FFD35F', sandL: '#FFE58A', sandD: '#F2B33A', desertSky: '#7EDCFF',
  paper: '#FFF8E7', paperD: '#EBDDBC', line: '#BFD7F2', scent: '#FF9CC2', pond: '#3CC8FF', pondD: '#1FA3DB',
  cloud: '#7466C8', cloudL: '#8C7FDA', ballD: '#8E430B',
};
export const HZ = 560;                               // đường chân trời trong cảnh vườn (toạ độ thế giới)
export const GY = 860;                               // mặt đất chỗ nhân vật đứng ở cảnh vừa

/* ================= bầu trời sao + Dải Ngân Hà (không trăng: bọ hung lăn thẳng nhờ dải sao) ================= */
// vẽ trong toạ độ đang có; o.x0..x1, o.y0..y1 vùng trời; o.cloud 0..1 mây che; o.cx độ trôi của mây; o.band độ sáng của dải
const BAND = { a: [-500, 760], b: [2500, -260] };
export const bandPt = u => [lerp(BAND.a[0], BAND.b[0], u), lerp(BAND.a[1], BAND.b[1], u) + Math.sin(u * 5.3) * 40];
export function starSky(c, t, o = {}) {
  const x0 = o.x0 ?? -1400, x1 = o.x1 ?? 3400, y0 = o.y0 ?? -1400, y1 = o.y1 ?? HZ + 40, band = o.band ?? 1;
  c.fillStyle = N.sky1; c.fillRect(x0, y0, x1 - x0, y1 - y0);
  c.fillStyle = N.sky0; c.fillRect(x0, y0, x1 - x0, Math.max(0, 120 - y0));
  c.fillStyle = N.sky2; c.fillRect(x0, y1 - 230, x1 - x0, 230); c.fillStyle = N.horizon; c.fillRect(x0, y1 - 90, x1 - x0, 90);
  // Dải Ngân Hà: các mảng trong mờ chồng lên nhau dọc một đường chéo, dày hạt sao
  if (band > 0) {
    c.save(); c.globalAlpha = band;
    for (let i = 0; i < 26; i++) { const u = i / 25, p = bandPt(u), w = 260 + 120 * Math.sin(i * 1.7); ell(c, p[0], p[1], w, w * .42, -.33, i % 3 === 0 ? 'rgba(169,247,226,.10)' : i % 3 === 1 ? 'rgba(255,156,194,.09)' : 'rgba(255,248,231,.12)'); }
    for (let i = 0; i < 26; i++) { const u = (i + .5) / 26, p = bandPt(u); ell(c, p[0], p[1], 150, 54, -.33, 'rgba(255,248,231,.13)'); }
    for (let i = 0; i < 420; i++) { const u = hash(i), p = bandPt(u), d = (hash(i + 7) - .5) * 300, tw = .55 + .45 * Math.sin(t * 2.3 + i);
      circle(c, p[0] + d * .33, p[1] + d, 1.4 + 2.4 * hash(i + 3) * tw, i % 9 ? C.cream : C.mintL); }
    c.restore();
  }
  // sao rải khắp trời, lấp lánh
  for (let i = 0; i < 160; i++) { const x = x0 + hash(i + 50) * (x1 - x0), y = y0 + hash(i + 90) * (y1 - y0 - 160), tw = .5 + .5 * Math.sin(t * 2 + i * 1.3);
    if (i % 11 === 0) star(c, x, y, 7 + 7 * tw, `rgba(255,248,231,${.55 + .45 * tw})`); else circle(c, x, y, 1.6 + 2.2 * tw * hash(i), C.cream); }
  if (o.cloud > 0) clouds(c, t, o.cloud, o.cx || 0, y0, y1);
}
// mây: những khối tím xám tròn trịa có viền mực, trôi ngang; cover 0..1 (1: che kín dải sao)
export function clouds(c, t, cover, dx = 0, y0 = -600, y1 = HZ) {
  const L = [[-200, 120, 1.2], [420, 40, 1.4], [980, 160, 1.3], [1520, 60, 1.5], [2050, 180, 1.2], [200, 330, 1.1], [1250, 360, 1.25], [1900, 400, 1.1]];
  L.forEach(([x, y, s], i) => {
    const sh = (1 - cover) * (i % 2 ? 1 : -1) * 2600, cx = x + dx + sh;
    c.save(); c.translate(cx, y); c.scale(s, s);
    inked(c, cc => { cc.ellipse(0, 0, 230, 92, 0, 0, TAU); }, N.cloud, 6);
    inked(c, cc => { cc.arc(-90, -40, 90, 0, TAU); }, N.cloud, 6); inked(c, cc => { cc.arc(60, -60, 110, 0, TAU); }, N.cloud, 6);
    ell(c, 0, 4, 222, 84, 0, N.cloud); circle(c, -90, -36, 82, N.cloud); circle(c, 60, -56, 102, N.cloud);
    ell(c, 20, -90, 70, 24, -.2, N.cloudL);
    c.restore();
  });
}

/* ================= vườn đêm (toạ độ thế giới; trời vẽ riêng bằng starSky) ================= */
// o.house: nhà của The Giant xa xa (cửa sổ vàng ấm); o.fence: hàng rào xa; o.tufts: số bụi cỏ; o.seed; o.path: lối đi kem; o.home: phiến đá nhà của Albie
export function garden(c, t, o = {}) {
  const x0 = o.x0 ?? -1400, x1 = o.x1 ?? 3400, seed = o.seed || 0;
  // đồi xa, hàng rào, nhà xa
  for (let i = -2; i < 9; i++) { const x = i * 520 + (seed * 97) % 300; ell(c, x, HZ + 40, 420, 150, 0, i % 2 ? N.hill : N.hillD); }
  if (o.house !== false) farHouse(c, o.houseX ?? 1450, HZ - 10, t);
  if (o.fence !== false) for (let x = Math.floor(x0 / 150) * 150; x < x1; x += 150) { rrect(c, x, HZ - 70, 22, 110, 6, N.woodD); }
  if (o.fence !== false) { rrect(c, x0, HZ - 52, x1 - x0, 14, 4, N.woodD); rrect(c, x0, HZ - 14, x1 - x0, 14, 4, N.woodD); }
  for (let i = -3; i < 12; i++) { const x = i * 330 + (seed * 53) % 200; ell(c, x, HZ + 70, 220, 90, 0, i % 2 ? N.hedge : N.hedgeD); }
  // mặt đất
  c.fillStyle = N.grass; c.fillRect(x0, HZ + 60, x1 - x0, 2400);
  c.fillStyle = N.grassD; for (let i = 0; i < 7; i++) c.fillRect(x0, HZ + 120 + i * 120, x1 - x0, 46);
  if (o.path !== false) gardenPath(c, o.pathY ?? GY + 10);
  // hoa ngủ, nấm, sỏi rải rác phía sau
  for (let i = 0; i < (o.flowers ?? 9); i++) { const x = x0 + 200 + hash(i + seed) * (x1 - x0 - 400), y = HZ + 130 + hash(i + seed + 20) * 110; flowerBud(c, x, y, .7 + .4 * hash(i + 3), [C.pink, C.lemon, C.mint, C.skyL][i % 4], t + i); }
  if (o.home) homeStone(c, o.home[0], o.home[1], t);
  for (let i = 0; i < (o.tufts ?? 26); i++) { const x = x0 + hash(i + seed + 40) * (x1 - x0), y = HZ + 170 + hash(i + seed + 60) * 520; tuft(c, x, y, .8 + .6 * hash(i + 5), t + i * .7, i % 3 ? N.grassL : N.tall); }
}
export function gardenPath(c, y) { c.fillStyle = N.pathD; c.fillRect(-2000, y - 46, 6000, 120); c.fillStyle = N.path; c.fillRect(-2000, y - 56, 6000, 112); for (let i = 0; i < 60; i++) ell(c, -1800 + i * 97 + (i % 3) * 21, y - 30 + (i % 4) * 22, 16 + (i % 3) * 6, 9, i, i % 2 ? N.pathD : '#F2CC92'); }
export function farHouse(c, x, y, t) {
  inked(c, cc => { cc.moveTo(x - 210, y); cc.lineTo(x - 210, y - 230); cc.lineTo(x, y - 380); cc.lineTo(x + 210, y - 230); cc.lineTo(x + 210, y); cc.closePath(); }, '#4A3AA8', 6);
  inked(c, cc => { cc.moveTo(x - 250, y - 220); cc.lineTo(x, y - 400); cc.lineTo(x + 250, y - 220); cc.lineTo(x + 230, y - 200); cc.lineTo(x, y - 365); cc.lineTo(x - 230, y - 200); cc.closePath(); }, C.berryD, 6);
  for (const [wx, wy] of [[-110, -170], [70, -170], [-20, -300]]) { circle(c, x + wx + 30, y + wy + 40, 70, 'rgba(255,211,95,.16)'); inked(c, cc => cc.roundRect(x + wx, y + wy, 70, 80, 10), N.window, 5); capsule(c, x + wx + 35, y + wy + 4, x + wx + 35, y + wy + 76, 5, C.ink); capsule(c, x + wx + 4, y + wy + 40, x + wx + 66, y + wy + 40, 5, C.ink); }
}
export function tuft(c, x, y, s, t, col = N.grassL) { const sw = Math.sin(t * 1.6) * 6 * s; for (let i = -2; i <= 2; i++) poly(c, [[x + i * 9 * s - 6 * s, y], [x + i * 9 * s + 6 * s, y], [x + i * 16 * s + sw, y - (34 + 14 * (2 - Math.abs(i))) * s]], i % 2 ? col : N.grassD); }
export function flowerBud(c, x, y, s, col, t) {
  c.save(); c.translate(x, y); c.scale(s, s); c.rotate(Math.sin(t * .9) * .04);
  capsule(c, 0, 0, 0, -110, 8, N.grassN);
  ell(c, -24, -50, 22, 9, -.5, N.grassL); ell(c, 24, -70, 22, 9, .5, N.grassL);
  inked(c, cc => { cc.moveTo(0, -112); cc.quadraticCurveTo(-30, -140, -4, -176); cc.quadraticCurveTo(0, -180, 4, -176); cc.quadraticCurveTo(30, -140, 0, -112); cc.closePath(); }, col, 5);
  capsule(c, 0, -118, 0, -168, 4, 'rgba(30,27,58,.25)');
  c.restore();
}
export function mushroom(c, x, y, s) {
  c.save(); c.translate(x, y); c.scale(s, s);
  inked(c, cc => cc.roundRect(-26, -90, 52, 92, 18), C.cream, 6);
  inked(c, cc => { cc.moveTo(-110, -80); cc.quadraticCurveTo(-100, -190, 0, -196); cc.quadraticCurveTo(100, -190, 110, -80); cc.closePath(); }, C.berry, 6);
  [[-55, -120, 18], [10, -160, 14], [55, -110, 16]].forEach(([a, b, r]) => circle(c, a, b, r, C.cream));
  c.restore();
}
export function pebble(c, x, y, s, col = N.stone) { c.save(); c.translate(x, y); c.scale(s, s); inked(c, cc => cc.ellipse(0, -36, 90, 40, 0, 0, TAU), col, 6); ell(c, -26, -52, 34, 12, -.2, N.stoneL); c.restore(); }
export function bigLeaf(c, x, y, s, rot = 0, col = C.leaf) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  inked(c, cc => { cc.moveTo(-180, 0); cc.quadraticCurveTo(0, -140, 180, 0); cc.quadraticCurveTo(0, 140, -180, 0); cc.closePath(); }, col, 7);
  capsule(c, -170, 0, 170, 0, 8, C.leafD); for (const k of [-100, -35, 30, 95]) { capsule(c, k, 0, k + 46, -46, 6, C.leafD); capsule(c, k, 0, k + 46, 46, 6, C.leafD); }
  c.restore();
}
// nhà của Albie: phiến đá phẳng bên khóm cúc, có lá cờ nhỏ
export const HOME = { x: 420, y: GY };
export function homeStone(c, x, y, t) {
  inked(c, cc => cc.ellipse(x, y - 30, 240, 70, 0, 0, TAU), N.stone, 7); ell(c, x - 60, y - 58, 110, 24, -.05, N.stoneL);
  capsule(c, x + 180, y - 50, x + 180, y - 260, 7, C.ink);
  inked(c, cc => { cc.moveTo(x + 182, y - 258); cc.lineTo(x + 280, y - 230 + Math.sin(t * 4) * 6); cc.lineTo(x + 182, y - 200); cc.closePath(); }, C.lemon, 5);
  for (const [dx, col] of [[-250, C.cream], [-200, C.pink]]) { capsule(c, x + dx, y - 20, x + dx + 10, y - 150, 6, N.grassN); for (let i = 0; i < 8; i++) { const a = i * TAU / 8 + t * .1; ell(c, x + dx + 10 + Math.cos(a) * 26, y - 150 + Math.sin(a) * 26, 18, 9, a, col); } circle(c, x + dx + 10, y - 150, 14, C.mango); }
}

/* ================= rìa vườn: phiến đá lát lớn, khe nứt, cỏ cao, cọc hàng rào ================= */
export const CRACK = { x: 1160, y: 760, w: 46 };          // khe giữa hai phiến đá (Miss Loupe kẹt ở đây)
export function edgeStones(c, t, o = {}) {
  // bãi cỏ tối phía sau, cọc hàng rào của Uncle Telly
  c.fillStyle = N.grassN; c.fillRect(-1400, HZ + 40, 4800, 2400);
  if (o.post !== false) fencePost(c, o.postX ?? 1660, HZ + 120, 520);
  // cỏ cao phía sau
  for (let i = 0; i < 40; i++) { const x = -600 + i * 80 + (i % 3) * 17, h = 220 + hash(i + 9) * 160, sw = Math.sin(t * 1.3 + i) * 10; inked(c, cc => { cc.moveTo(x - 14, HZ + 260); cc.quadraticCurveTo(x + sw, HZ + 260 - h * .6, x + sw * 2 + 6, HZ + 260 - h); cc.quadraticCurveTo(x + 6, HZ + 260 - h * .5, x + 14, HZ + 260); cc.closePath(); }, i % 2 ? N.tall : N.tallD, 4); }
  // hai phiến đá lớn, khe ở giữa
  const X = CRACK.x, Y = CRACK.y, w = CRACK.w;
  inked(c, cc => { cc.moveTo(-700, Y - 150); cc.lineTo(X - w / 2 - 10, Y - 170); cc.lineTo(X - w / 2, Y + 400); cc.lineTo(-700, Y + 400); cc.closePath(); }, N.stone, 7);
  inked(c, cc => { cc.moveTo(X + w / 2, Y - 175); cc.lineTo(2600, Y - 140); cc.lineTo(2600, Y + 400); cc.lineTo(X + w / 2 + 8, Y + 400); cc.closePath(); }, N.stone, 7);
  rrect(c, -700, Y - 165, X - w / 2 + 690, 26, 10, N.stoneL); rrect(c, X + w / 2 + 6, Y - 170, 1600, 26, 10, N.stoneL);
  c.fillStyle = N.crack; c.beginPath(); c.moveTo(X - w / 2 - 4, Y - 172); for (let i = 0; i <= 8; i++) c.lineTo(X - w / 2 + (i % 2 ? 10 : -4) + i * 1.5, Y - 172 + i * 70); c.lineTo(X + w / 2 + 6, Y + 420); for (let i = 8; i >= 0; i--) c.lineTo(X + w / 2 + (i % 2 ? -8 : 6) - i * 1.5, Y - 172 + i * 70); c.closePath(); c.fill();
  for (let i = 0; i < 8; i++) { ell(c, -400 + i * 340, Y + 30 + (i % 2) * 90, 60, 18, .2, N.stoneD); }
  if (o.front) o.front(c);
}
export function fencePost(c, x, y, h) {
  inked(c, cc => cc.roundRect(x - 50, y - h, 100, h + 40, 12), N.wood, 7);
  inked(c, cc => { cc.moveTo(x - 58, y - h + 6); cc.lineTo(x, y - h - 50); cc.lineTo(x + 58, y - h + 6); cc.closePath(); }, N.woodL, 7);
  for (let i = 1; i < 5; i++) capsule(c, x - 30, y - h + i * h / 5, x + 30, y - h + i * h / 5 + 10, 5, N.woodD);
  inked(c, cc => cc.roundRect(x - 360, y - h * .55, 310, 34, 8), N.wood, 6);   // thanh ngang của hàng rào
}
// mạng nhện nhỏ giữa hai ngọn cỏ (chỗ trốn của Spindle ở rìa vườn)
export function tinyWeb(c, x, y, r, t) { c.save(); c.globalAlpha = .75; c.strokeStyle = C.cream; c.lineWidth = 2.5; for (let i = 0; i < 8; i++) { const a = i * TAU / 8; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); c.stroke(); } for (let k = 1; k <= 3; k++) { c.beginPath(); for (let i = 0; i <= 8; i++) { const a = i * TAU / 8, rr = r * k / 3.4; i ? c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : c.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.stroke(); } c.restore(); glints(c, x, y, r * .8, t, 3, C.cream, 8); }

/* ================= viên tròn (vẽ tay, khi không đi kèm rig của Rollo) ================= */
export function ballProp(c, x, y, R, spin = 0, o = {}) {
  inked(c, cc => cc.arc(x, y, R, 0, TAU), C.honeyD, Math.max(4, R * .06));
  ell(c, x - R * .1, y + R * .18, R * .8, R * .55, 0, 'rgba(142,67,11,.35)');
  [[.3, -.4, .3], [-.45, .1, .2], [.1, .45, .24], [-.15, -.62, .16]].forEach(([a, b, s], i) => { const an = spin + i * 1.7, px = Math.cos(an) * a - Math.sin(an) * b, py = Math.sin(an) * a + Math.cos(an) * b; circle(c, x + px * R, y + py * R, s * R * .45, C.honey); });
  if (o.dent) { ell(c, x + R * .05, y - R * .78, R * .32, R * .14, 0, N.ballD); }
}

/* ================= đường mùi, khung "ngửi" của Crumb ================= */
// chấm mùi hồng dọc một đường (pts), hiện dần theo p (0..1), rung nhẹ
export function scentTrail(c, pts, t, p = 1, o = {}) {
  const n = pts.length; if (n < 2 || p <= 0) return;
  const tot = []; let L = 0; for (let i = 1; i < n; i++) { L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); tot.push(L); }
  const step = o.step || 34, show = L * p;
  for (let d = 0; d < show; d += step) {
    let i = tot.findIndex(v => v >= d); if (i < 0) i = tot.length - 1; const a = i ? tot[i - 1] : 0, u = (d - a) / (tot[i] - a || 1);
    const x = lerp(pts[i][0], pts[i + 1][0], u), y = lerp(pts[i][1], pts[i + 1][1], u), w = Math.sin(t * 3 + d * .05);
    circle(c, x, y + w * 3, (o.r || 9) * (1 + .25 * w), `rgba(255,156,194,${(o.a ?? .85)})`); circle(c, x - 2, y - 3 + w * 3, (o.r || 9) * .4, 'rgba(255,248,231,.8)');
  }
}
// khung "ngửi": vòng tròn viền mật ong có hai chiếc râu ở trên (không phải kính: Crumb ngửi bằng râu); inside vẽ trong vòng
export function sniffFrame(c, x, y, r, t, inside, a = 1) {
  if (a <= 0) return; const R = r * back(clamp(a), 1.6);
  c.save(); c.beginPath(); c.arc(x, y, R, 0, TAU); c.clip(); inside(c); c.restore();
  c.lineWidth = 22; c.strokeStyle = C.honey; c.beginPath(); c.arc(x, y, R + 11, 0, TAU); c.stroke();
  c.lineWidth = 6; c.strokeStyle = C.ink; c.beginPath(); c.arc(x, y, R + 24, 0, TAU); c.stroke(); c.beginPath(); c.arc(x, y, R, 0, TAU); c.stroke();
  for (const sd of [-1, 1]) { const bx = x + sd * R * .35, by = y - R - 18, wig = Math.sin(t * 6 + sd) * 8; c.lineCap = 'round'; c.strokeStyle = C.ink; c.lineWidth = 12; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + sd * 30, by - 60); c.lineTo(bx + sd * 70 + wig, by - 70); c.stroke(); circle(c, bx + sd * 70 + wig, by - 70, 14, C.ink); }
}

/* ================= kiến thợ (gia đình Crumb), kiến sa mạc (chân dài, màu cát) ================= */
export function workerAnt(c, x, y, s, ph = 0, o = {}) {
  const dir = o.dir ?? 1, col = o.col || '#7A3A10', dark = o.dark || '#4E2408', tap = o.tap || 0, lg = o.long || 1;
  c.save(); c.translate(x, y); c.scale(dir, 1); if (o.lift) c.translate(0, -o.lift * s);
  for (let i = 0; i < 3; i++) for (const sd of [-1, 1]) {
    const a = Math.sin(ph * TAU + i * 2.1 + (sd > 0 ? Math.PI : 0)), hx = (-.32 + i * .32) * s, fx = hx + ((i - 1) * .2 * s + a * .16 * s) * lg;
    capsule(c, hx, -.42 * s * lg, (hx + fx) / 2 + .08 * s, -.62 * s * lg + Math.max(0, a) * -.1 * s, .07 * s, sd > 0 ? dark : col);
    capsule(c, (hx + fx) / 2 + .08 * s, -.62 * s * lg, fx, -Math.max(0, -a) * .08 * s, .06 * s, sd > 0 ? dark : col);
  }
  const by = -.42 * s * lg - .14 * s;
  ell(c, -.72 * s, by - .02 * s, .42 * s, .3 * s, -.2, col); ell(c, -.08 * s, by - .05 * s, .26 * s, .17 * s, 0, col);
  const hy = by - .12 * s; circle(c, .38 * s, hy, .22 * s, col);
  circle(c, .46 * s, hy - .04 * s, .07 * s, C.white); circle(c, .48 * s, hy - .05 * s, .04 * s, C.ink);
  ell(c, .3 * s, hy + .07 * s, .05 * s, .03 * s, 0, 'rgba(255,156,194,.8)');
  for (const [k, dy] of [[0, 0], [1, .03]]) {
    const t2 = k === 0 ? tap : tap * .6, ex = .62 * s, ey = hy - .38 * s + dy * s, tipx = ex + lerp(.32, .44, t2) * s, tipy = ey + lerp(-.12, .36, t2) * s;
    capsule(c, .44 * s, hy - .14 * s, ex, ey, .045 * s, dark); capsule(c, ex, ey, tipx, tipy, .04 * s, dark);
  }
  c.restore();
}
export const desertAnt = (c, x, y, s, ph, o = {}) => workerAnt(c, x, y, s, ph, { col: '#E89A45', dark: '#B86A22', long: 1.7, ...o });

/* ================= bóng nghĩ của Crumb: sa mạc nắng, tổ kiến, kiến sa mạc đi ra rồi đi thẳng về ================= */
export function thoughtBubble(c, x, y, r, p, from) {
  if (p <= 0) return; const R = r * back(clamp(p), 1.5);
  if (from) for (let i = 0; i < 3; i++) { const u = (i + 1) / 4; inked(c, cc => cc.arc(lerp(from[0], x - R * .6, u), lerp(from[1], y + R * .7, u), 14 + i * 12, 0, TAU), C.cream, 5); }
  inked(c, cc => { for (let i = 0; i < 12; i++) { const a = i * TAU / 12; cc.moveTo(x + Math.cos(a) * R + R * .22, y + Math.sin(a) * R * .8); cc.arc(x + Math.cos(a) * R, y + Math.sin(a) * R * .8, R * .22, 0, TAU); } }, C.cream, 6);
  ell(c, x, y, R, R * .8, 0, C.cream);
}
export const NEST = { x: 380, y: 760 };
// đường đi tìm mồi của kiến sa mạc (ngoằn ngoèo) và đường về (thẳng)
export const OUTWARD = [[380, 760], [520, 690], [600, 780], [760, 700], [860, 790], [1010, 720], [1130, 800], [1260, 730], [1400, 760]];
export function desertScene(c, t, o = {}) {
  c.fillStyle = N.desertSky; c.fillRect(-400, -400, 2800, 1900);
  const sx = 1560, sy = 200; for (let i = 0; i < 12; i++) { const a = i * TAU / 12 + t * .2; capsule(c, sx + Math.cos(a) * 130, sy + Math.sin(a) * 130, sx + Math.cos(a) * 175, sy + Math.sin(a) * 175, 16, C.mango); }
  inked(c, cc => cc.arc(sx, sy, 105, 0, TAU), C.lemon, 7);
  ell(c, 500, 640, 760, 180, 0, N.sandD); ell(c, 1500, 660, 820, 200, 0, N.sandD);
  c.fillStyle = N.sand; c.fillRect(-400, 640, 2800, 900); ell(c, 900, 660, 1300, 110, 0, N.sand);
  for (let i = 0; i < 18; i++) capsule(c, -200 + i * 140, 880 + (i % 3) * 60, -150 + i * 140, 878 + (i % 3) * 60, 6, N.sandD);
  // tổ: miệng lỗ trên cát
  inked(c, cc => cc.ellipse(NEST.x, NEST.y, 70, 26, 0, 0, TAU), N.sandD, 6); ell(c, NEST.x, NEST.y + 2, 46, 15, 0, '#8E4A1D');
  if (o.path) o.path(c);
}

/* ================= bản đồ vườn của Albie (trang sổ) ================= */
export const MAP = { x: 150, y: 70, w: 1620, h: 860 };
// các chỗ của Mùa 1 trên bản đồ: [x, y, biểu tượng, nhãn]
export const SPOTS = [
  [430, 330, 'flower', 'flowers'], [640, 230, 'hive', 'hive'], [860, 360, 'ant', 'ant hill'], [600, 520, 'grass', 'tall grass'],
  [1080, 250, 'window', 'window'], [1200, 470, 'lamp', 'fireflies'], [900, 650, 'web', 'web'], [1350, 330, 'desk', 'desk'], [1150, 700, 'rollo', 'Rollo\'s hill'],
];
export const MHOME = [330, 640];
export function mapPage(c, t, o = {}) {
  const P = MAP, G = P.x + P.w / 2;
  rrect(c, P.x + 14, P.y + 22, P.w, P.h, 34, 'rgba(30,27,58,.35)');
  inked(c, cc => cc.roundRect(P.x - 30, P.y - 24, P.w + 60, P.h + 48, 40), C.grape, 7);
  inked(c, cc => cc.roundRect(P.x, P.y, P.w, P.h, 26), N.paper, 5);
  c.fillStyle = N.paperD; c.fillRect(G - 8, P.y + 4, 16, P.h - 8);
  c.save(); c.beginPath(); c.roundRect(P.x, P.y, P.w, P.h, 26); c.clip();
  for (let y = P.y + 60; y < P.y + P.h; y += 56) capsule(c, P.x + 30, y, P.x + P.w - 30, y, 2, N.line);
  // vườn vẽ bằng bút sáp: bãi cỏ, ao, lối đi
  inked(c, cc => cc.ellipse(860, 470, 640, 330, -.05, 0, TAU), 'rgba(183,240,74,.45)', 0);
  inked(c, cc => cc.ellipse(1500, 760, 150, 70, 0, 0, TAU), 'rgba(60,200,255,.45)', 4);
  c.setLineDash([18, 16]); c.lineWidth = 8; c.strokeStyle = N.pathD; c.lineCap = 'round';
  c.beginPath(); c.moveTo(MHOME[0], MHOME[1]); c.bezierCurveTo(500, 520, 700, 440, 860, 400); c.bezierCurveTo(1050, 340, 1250, 420, 1350, 360); c.stroke(); c.setLineDash([]);
  c.restore();
  popText(c, o.title || 'MY GARDEN MAP', P.x + 330, P.y + 92, 70, C.grape, null, -1, 0, { font: subFont });
  // các chỗ
  SPOTS.forEach(([x, y, ic, lab], i) => {
    const g = o.glow ? o.glow(i) : 0;
    if (g > 0) { circle(c, x, y, 70 + 16 * g, `rgba(255,227,77,${.35 * g})`); }
    inked(c, cc => cc.arc(x, y, 44, 0, TAU), g > .5 ? C.lemon : C.cream, 5);
    mapIcon(c, ic, x, y, 30, t);
    if (o.labels !== false) popText(c, lab, x, y + 78, 26, C.ink, null, -1, 0, { font: subFont, read: false });
    if (g > 0 && g < 1) star(c, x + 40, y - 40, 20 * Math.sin(Math.PI * g), C.lemon);
  });
  // nhà (ngôi sao HOME)
  const hp = o.home ?? 1; star(c, MHOME[0], MHOME[1], 46 * (1 + .12 * Math.sin(t * 4) * hp), C.mango); popText(c, 'HOME', MHOME[0], MHOME[1] + 82, 34, C.berry, null, -1, 0, { font: subFont, read: false });
  if (o.arrow > 0) mapArrow(c, t, o.arrow);
  if (o.trip > 0) tripPath(c, t, o.trip);
  if (o.corner > 0) newCorner(c, t, o.corner);
}
export function mapIcon(c, ic, x, y, s, t) {
  c.save(); c.translate(x, y); const k = s / 30; c.scale(k, k);
  if (ic === 'flower') { for (let i = 0; i < 5; i++) { const a = i * TAU / 5; circle(c, Math.cos(a) * 14, Math.sin(a) * 14, 11, C.pink); } circle(c, 0, 0, 9, C.mango); }
  else if (ic === 'hive') { inked(c, cc => cc.ellipse(0, 2, 20, 24, 0, 0, TAU), C.mango, 3); for (const yy of [-8, 4, 14]) capsule(c, -16, yy, 16, yy, 3, C.honeyD); }
  else if (ic === 'ant') { poly(c, [[-24, 18], [0, -18], [24, 18]], C.honeyL); circle(c, 0, 8, 5, C.ink); }
  else if (ic === 'grass') { for (let i = -2; i <= 2; i++) poly(c, [[i * 9 - 5, 20], [i * 9 + 5, 20], [i * 12, -22]], C.leaf); }
  else if (ic === 'window') { inked(c, cc => cc.roundRect(-20, -20, 40, 40, 6), C.skyL, 3); capsule(c, 0, -20, 0, 20, 3, C.ink); capsule(c, -20, 0, 20, 0, 3, C.ink); }
  else if (ic === 'lamp') { circle(c, 0, 0, 20, 'rgba(255,227,77,.5)'); circle(c, 0, 0, 10, C.lemon); }
  else if (ic === 'web') { c.strokeStyle = C.grape; c.lineWidth = 3; for (let i = 0; i < 6; i++) { const a = i * TAU / 6; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * 22, Math.sin(a) * 22); c.stroke(); } c.beginPath(); c.arc(0, 0, 12, 0, TAU); c.stroke(); }
  else if (ic === 'desk') { rrect(c, -22, -6, 44, 10, 3, C.honeyD); capsule(c, -16, 4, -16, 22, 5, C.honeyD); capsule(c, 16, 4, 16, 22, 5, C.honeyD); circle(c, 8, -16, 8, C.mint); }
  else if (ic === 'rollo') { circle(c, -6, 4, 16, C.honeyD); ell(c, 14, 8, 12, 9, 0, C.ink); }
  c.restore();
}
// mũi tên chấm từ nhà chạy thẳng ra mép phải bản đồ, rồi dấu "?" to
export function mapArrow(c, t, p) {
  const a = [MHOME[0] + 60, MHOME[1] - 30], b = [MAP.x + MAP.w + 40, MHOME[1] - 120], u = clamp(p * 1.25);
  c.setLineDash([22, 18]); c.lineDashOffset = -t * 60; c.lineWidth = 12; c.lineCap = 'round'; c.strokeStyle = C.berry;
  c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(lerp(a[0], b[0], u), lerp(a[1], b[1], u)); c.stroke(); c.setLineDash([]);
  if (p > .8) { const q = back(seg(p, .8, 1), 2.2); c.save(); c.translate(MAP.x + MAP.w - 30, MHOME[1] - 230); c.scale(q, q); inked(c, cc => cc.arc(0, 0, 80, 0, TAU), C.lemon, 7); popText(c, '?', 0, 40, 120, C.berry, null, -1, 0, { read: false }); c.restore(); }
}
// đường đi đêm nay (nhà → rìa vườn) sáng dần
export const TRIP = [[MHOME[0], MHOME[1]], [560, 600], [800, 560], [1040, 600], [1300, 560], [1560, 520], [1830, 470]];
export function tripPath(c, t, p) {
  const n = TRIP.length - 1, u = clamp(p) * n;
  c.lineWidth = 16; c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = 'rgba(255,227,77,.9)';
  c.beginPath(); c.moveTo(TRIP[0][0], TRIP[0][1]);
  for (let i = 1; i <= n; i++) { if (i - 1 >= u) break; const f = clamp(u - (i - 1)); c.lineTo(lerp(TRIP[i - 1][0], TRIP[i][0], f), lerp(TRIP[i - 1][1], TRIP[i][1], f)); }
  c.stroke();
}
// mảnh bản đồ mới Albie dán thêm ở mép phải: "GARDEN EDGE"
export function newCorner(c, t, p) {
  const s = back(clamp(p), 1.8), x = MAP.x + MAP.w + 30, y = 470;
  c.save(); c.translate(x, y); c.rotate(.06); c.scale(s, s);
  inked(c, cc => cc.roundRect(-150, -150, 300, 300, 18), N.paper, 6);
  for (let i = 0; i < 4; i++) rrect(c, -110 + i * 60, 20, 44, 60, 6, N.stone);
  for (let i = 0; i < 7; i++) poly(c, [[-130 + i * 40, 20], [-115 + i * 40, 20], [-122 + i * 40, -40 - (i % 2) * 20]], N.tall);
  circle(c, 60, -80, 26, 'rgba(255,227,77,.5)'); star(c, 60, -80, 20, C.lemon);
  popText(c, 'GARDEN EDGE', 0, 128, 32, C.grape, null, -1, 0, { font: subFont });
  rrect(c, -170, -168, 90, 34, 6, 'rgba(255,227,77,.75)'); rrect(c, 80, -168, 90, 34, 6, 'rgba(255,227,77,.75)');
  c.restore();
}

/* ================= nhìn thẳng từ trên xuống: bãi cỏ ban đêm, vệt lăn của Rollo ================= */
export function topGrass(c, t) {
  c.fillStyle = N.grassN; c.fillRect(-400, -400, 2800, 1900);
  for (let i = 0; i < 260; i++) { const x = hash(i + 300) * 2400 - 240, y = hash(i + 700) * 1300 - 110, a = hash(i) * TAU; capsule(c, x, y, x + Math.cos(a) * 26, y + Math.sin(a) * 26, 7, i % 2 ? N.grassD : N.grass); }
  for (let i = 0; i < 9; i++) { const x = hash(i + 40) * 1900, y = hash(i + 41) * 1000; ell(c, x, y, 60, 40, i, N.stoneD); }
}
// vệt lăn: chuỗi điểm (pts) vẽ thành rãnh mờ
export function trackLine(c, pts, w = 30) { if (pts.length < 2) return; c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = 'rgba(30,27,58,.35)'; c.lineWidth = w; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.strokeStyle = 'rgba(255,248,231,.25)'; c.lineWidth = w * .25; c.stroke(); }
// bóng mây phủ lên mặt đất (nhìn từ trên)
export function cloudShadow(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = 'rgba(30,27,58,.28)'; c.beginPath(); c.ellipse(0, 0, 420, 200, 0, 0, TAU); c.arc(-160, -90, 170, 0, TAU); c.arc(150, -110, 200, 0, TAU); c.fill(); c.restore(); }

/* ================= khung ống nhòm (hai vòng tròn chồng nhau) ================= */
export function binoMask(c, t, a, draw) {
  const R = 400, cx = 960, cy = 520, d = 290;
  c.fillStyle = '#16133A'; c.fillRect(-10, -10, 1940, 1100);                          // ngoài hai vòng kính: tối (nhưng không đen kịt)
  c.save(); c.beginPath(); c.arc(cx - d, cy, R, 0, TAU); c.moveTo(cx + d + R, cy); c.arc(cx + d, cy, R, 0, TAU); c.clip(); draw(c); c.restore();
  c.lineWidth = 26; c.strokeStyle = C.leaf; for (const s of [-1, 1]) { c.beginPath(); c.arc(cx + s * d, cy, R + 13, 0, TAU); c.stroke(); }
  c.lineWidth = 6; c.strokeStyle = C.ink; for (const s of [-1, 1]) { c.beginPath(); c.arc(cx + s * d, cy, R + 28, 0, TAU); c.stroke(); }
  c.save(); c.globalAlpha = .4; c.lineWidth = 16; c.strokeStyle = C.white; for (const s of [-1, 1]) { c.beginPath(); c.arc(cx + s * d, cy, R - 50, -2.7, -2.1); c.stroke(); } c.restore();
}

// lá súng nhìn nghiêng (elip dẹt), một khía hẹp và gân lá
export function lilyPad(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); inked(c, cc => { cc.moveTo(0, 0); cc.ellipse(0, 0, 200, 64, 0, -Math.PI / 2 + .12, -Math.PI / 2 - .12 + TAU); cc.closePath(); }, C.leaf, 7); for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + .5 + i * .8; capsule(c, 0, 0, Math.cos(a) * 170, Math.sin(a) * 52, 4, C.leafD); } c.restore(); }
/* ================= trang mặt ao (lật trang ở gag cuối: cài trước Mùa 2) ================= */
export function pondPage(c, t, o = {}) {
  c.fillStyle = N.pond; c.fillRect(-400, -400, 2800, 1900);
  for (let i = 0; i < 7; i++) { const r = ((t * 60 + i * 90) % 600); c.lineWidth = 8; c.strokeStyle = `rgba(255,248,231,${.5 * (1 - r / 600)})`; c.beginPath(); c.ellipse(o.rx ?? 960, o.ry ?? 640, r * 1.6, r * .5, 0, 0, TAU); c.stroke(); }
  for (const [x, y, s] of [[340, 900, 1.3], [1640, 860, .9], [1380, 420, .7]]) lilyPad(c, x, y, s);
  for (let i = 0; i < 12; i++) capsule(c, -100 + i * 180, 120 + (i % 3) * 30, -40 + i * 180, 120 + (i % 3) * 30, 6, N.pondD);
}
