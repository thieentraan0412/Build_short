// Đạo cụ và khách mời của LONG-001 (Khối Kẹo Phẳng: khối phẳng, không viền, không gradient).
// Khách mời mới vẽ phẳng ở đây (TREATMENT §5): Hop (châu chấu), Zip (chuồn chuồn), sâu gấu len. Bối cảnh: bậu cửa sổ mùa đông,
// trang sổ đóng băng, các ký ức mùa hè (bàn tiệc hoa quả, mê cung cỏ, đồng cỏ đêm, mép ao, tổ ong), vườn tuyết.
import { C, circle, ell, capsule, rrect, poly, path, lerp, clamp, TAU } from '/_shared/kit.js';

export const W = { snow: '#F4FBFF', snowS: '#D3E9F7', ice: '#BFE6FA', iceD: '#8CCDEE', frost: 'rgba(214,240,255,.92)', wall: '#FFE2B8', wallD: '#F6C98C',
  wood: '#C9773A', woodD: '#9E5426', woodL: '#E39652', pane: '#5B8FD6', paneD: '#476FB8', dusk: '#2C3E8F', coldA: '#3B2D8F', coldB: '#5A4FD0', warmA: '#FF8A2F', warmB: '#FFD34D' };
const hash = n => { n = Math.sin(n * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); };

/* ---------- bông tuyết sáu cánh: arms[i] 0..1 làm cánh thứ i sáng lên ---------- */
export function snowflake(c, x, y, r, rot = 0, o = {}) {
  const arms = o.arms || [0, 0, 0, 0, 0, 0], col = o.col || C.white, glow = o.glow ?? 0;
  c.save(); c.translate(x, y); c.rotate(rot);
  if (glow > 0) circle(c, 0, 0, r * (1.25 + .15 * glow), `rgba(255,255,255,${.25 * glow})`);
  for (let i = 0; i < 6; i++) {
    c.save(); c.rotate(i * TAU / 6);
    const g = arms[i] || 0, f = g > .05 ? C.lemon : col, w = r * .13;
    capsule(c, 0, 0, 0, -r, w, f);
    for (const [d, l] of [[.42, .32], [.7, .24]]) { capsule(c, 0, -r * d, -r * l, -r * (d + l * .7), w * .8, f); capsule(c, 0, -r * d, r * l, -r * (d + l * .7), w * .8, f); }
    if (g > .05) circle(c, 0, -r, w * (1 + g), C.cream);
    c.restore();
  }
  circle(c, 0, 0, r * .2, col); circle(c, 0, 0, r * .1, W.ice);
  c.restore();
}

/* ---------- bậu cửa sổ trong nhà The Giant: tường ấm, khung gỗ, ô kính xanh lạnh có tuyết rơi ngoài trời ---------- */
// win: {x, y, w, h} khung cửa sổ; sillY: mặt bậu. dusk 0..1: ngoài trời tối dần (cuối phim)
export function windowRoom(c, t, o = {}) {
  const win = o.win || { x: 360, y: 60, w: 1200, h: 640 }, sillY = o.sillY ?? 760, dusk = o.dusk || 0;
  c.fillStyle = W.wall; c.fillRect(-2000, -2000, 6000, 6000);
  for (let i = -6; i < 16; i++) rrect(c, i * 180 + 40, -200, 70, 2000, 35, 'rgba(246,201,140,.35)');     // sọc giấy dán tường
  rrect(c, win.x - 40, win.y - 40, win.w + 80, win.h + 80, 30, W.woodD);
  rrect(c, win.x - 26, win.y - 26, win.w + 52, win.h + 52, 24, W.wood);
  c.save(); c.beginPath(); c.roundRect(win.x, win.y, win.w, win.h, 14); c.clip();
  const sky = dusk > 0 ? lerpCol(W.pane, W.dusk, dusk) : W.pane; c.fillStyle = sky; c.fillRect(win.x, win.y, win.w, win.h);
  outsideView(c, t, win, o);
  c.restore();
  // song cửa (chữ thập)
  rrect(c, win.x + win.w / 2 - 16, win.y, 32, win.h, 10, W.wood); rrect(c, win.x, win.y + win.h * .5 - 14, win.w, 28, 10, W.wood);
  // sương đọng ở góc kính
  for (const [cx, cy, s] of [[win.x, win.y + win.h, 1], [win.x + win.w, win.y + win.h, -1]]) for (let i = 0; i < 5; i++) ell(c, cx + s * (40 + i * 46), cy - 18 - (i % 2) * 10, 60 - i * 8, 34 - i * 4, 0, 'rgba(244,251,255,.75)');
  // bậu gỗ
  rrect(c, -400, sillY - 10, 2800, 64, 18, W.woodL); rrect(c, -400, sillY + 40, 2800, 1000, 0, W.wood);
  rrect(c, -400, sillY + 40, 2800, 18, 0, W.woodD);
}
function outsideView(c, t, win, o) {
  const x0 = win.x, x1 = win.x + win.w, yb = win.y + win.h;
  ell(c, x0 + win.w * .25, yb + 60, win.w * .5, 190, 0, W.snowS); ell(c, x0 + win.w * .8, yb + 40, win.w * .45, 170, 0, W.snow);
  for (const [fx, h] of [[.18, 230], [.62, 300], [.86, 200]]) { const bx = x0 + win.w * fx; rrect(c, bx - 10, yb - h, 20, h, 10, '#6B4A8F'); capsule(c, bx, yb - h * .6, bx + 60, yb - h * .85, 10, '#6B4A8F'); capsule(c, bx, yb - h * .45, bx - 50, yb - h * .7, 9, '#6B4A8F'); ell(c, bx + 50, yb - h * .87, 30, 10, -.4, W.snow); }   // cây trụi lá có tuyết
  if (o.rollo != null) o.rollo(c);
  const n = 46;
  for (let i = 0; i < n; i++) {                                   // tuyết rơi
    const sx = x0 + hash(i) * win.w + Math.sin(t * .8 + i) * 24, sy = win.y - 20 + ((hash(i + 9) * win.h + t * (40 + hash(i + 3) * 50)) % (win.h + 40)), r = 4 + hash(i + 5) * 7;
    circle(c, sx, sy, r, 'rgba(255,255,255,.9)');
  }
}
function lerpCol(a, b, u) { const p = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)); const A = p(a), B = p(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], u))).join(',')})`; }
export { lerpCol };

// chậu cây trên bậu (Crumb ló ra từ sau chậu)
export function plantPot(c, x, y, s, t = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const [a, l, col] of [[-.5, 1.2, C.leafD], [-.15, 1.5, C.leaf], [.25, 1.35, C.leafD], [.6, 1.1, C.leaf]]) {
    const sw = Math.sin(t * 1.3 + a * 4) * .03;
    c.save(); c.rotate(a + sw); ell(c, 0, -120 * l, 46, 120 * l * .55, 0, col); c.restore();
  }
  poly(c, [[-110, -40], [110, -40], [84, 120], [-84, 120]], '#D9643A'); rrect(c, -124, -64, 248, 48, 16, '#EF7A47');
  c.restore();
}

/* ---------- lớp băng phủ một vùng (trang sổ, tab): melt 0..1 tan từ tâm (mx, my); có vân nứt, nhỏ giọt khi đang tan ---------- */
export function frost(c, x, y, w, h, o = {}) {
  const melt = clamp(o.melt || 0), mx = o.mx ?? x + w / 2, my = o.my ?? y + h / 2, R = melt * Math.hypot(w, h) * .62, crack = o.crack || 0, t = o.t || 0;
  if (melt >= .999) return;
  c.save(); c.beginPath(); c.roundRect(x, y, w, h, o.r ?? 18);
  const cutR = Math.max(R, o.cut || 0);                          // lỗ tan (melt) hoặc lỗ hà hơi (cut)
  if (cutR > 1) { c.moveTo(mx + cutR, my); c.arc(mx, my, cutR, 0, TAU, true); }
  c.fillStyle = W.frost; c.fill('evenodd'); c.clip('evenodd');
  for (let i = 0; i < 14; i++) { const px = x + hash(i * 3.1) * w, py = y + hash(i * 7.7) * h; ell(c, px, py, 40 + hash(i) * 70, 20 + hash(i + 1) * 30, hash(i + 2) * 3, 'rgba(255,255,255,.55)'); }
  c.strokeStyle = W.iceD; c.lineCap = 'round'; c.lineWidth = 4;
  for (let k = 0; k < 5; k++) {                                   // vân nứt toả từ một điểm
    const ox = x + w * (.25 + .5 * hash(k + 40)), oy = y + h * (.3 + .4 * hash(k + 41)); c.beginPath(); c.moveTo(ox, oy);
    let px = ox, py = oy; for (let j = 0; j < 4; j++) { px += (hash(k * 9 + j) - .5) * w * .28; py += (hash(k * 5 + j + 3) - .3) * h * .2; c.lineTo(px, py); } c.stroke();
  }
  if (crack > 0) { c.lineWidth = 7 * crack; c.strokeStyle = C.white; for (let k = 0; k < 7; k++) { const a = k * TAU / 7 + .3; c.beginPath(); c.moveTo(mx, my); c.lineTo(mx + Math.cos(a) * w * .5 * crack, my + Math.sin(a) * h * .5 * crack); c.stroke(); } }
  c.restore();
  if (melt > .02 && melt < .98) for (let i = 0; i < 6; i++) {   // giọt nước nhỏ xuống từ mép băng đang tan
    const a = i * TAU / 6 + .5, px = mx + Math.cos(a) * R, py = my + Math.sin(a) * R + ((t * 160 + i * 40) % 60);
    if (px > x && px < x + w && py > y && py < y + h) ell(c, px, py, 7, 11, 0, W.iceD);
  }
}

/* ---------- ký ức mùa hè: khung viền trang sổ (để biết đây là trang ký ức), mép giấy kem + gáy tím ---------- */
export function memoryFrame(c, w, h, o = {}) {
  const b = o.b ?? 34, col = o.col || C.cream;
  c.save(); c.beginPath(); c.rect(-10, -10, w + 20, h + 20); c.roundRect(b, b, w - 2 * b, h - 2 * b, 26); c.fillStyle = col; c.fill('evenodd'); c.restore();
  rrect(c, w / 2 - 6, -10, 12, b + 12, 4, 'rgba(90,51,214,.35)');
  if (o.tab) rrect(c, w - b - 150, -12, 110, b + 30, 18, o.tab);
}

/* ---------- vị giác: bàn tiệc hoa quả ---------- */
export function lemon(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); ell(c, 0, 0, 120, 86, -.15, C.lemon); ell(c, 118, -18, 22, 16, -.15, C.mango); ell(c, -40, -30, 34, 16, -.4, '#FFF3A0'); c.restore(); }
export function leafBig(c, x, y, s, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.fillStyle = C.leaf; c.beginPath(); c.moveTo(-150, 0); c.quadraticCurveTo(0, -110, 150, 0); c.quadraticCurveTo(0, 110, -150, 0); c.fill(); capsule(c, -150, 0, 150, 0, 9, C.leafD); for (const k of [-90, -30, 30, 90]) { capsule(c, k, 0, k + 40, -40, 6, C.leafD); capsule(c, k, 0, k + 40, 40, 6, C.leafD); } c.restore(); }
export function strawberry(c, x, y, s, sq = 0) {
  c.save(); c.translate(x, y); c.scale(s * (1 + sq * .08), s * (1 - sq * .06));
  c.fillStyle = C.berry; c.beginPath(); c.moveTo(-110, -60); c.quadraticCurveTo(-120, 60, 0, 130); c.quadraticCurveTo(120, 60, 110, -60); c.quadraticCurveTo(0, -110, -110, -60); c.fill();
  for (let i = 0; i < 12; i++) ell(c, -70 + (i % 4) * 46 + (Math.floor(i / 4) % 2) * 20, -30 + Math.floor(i / 4) * 44, 6, 10, 0, C.lemon);
  for (const a of [-1.2, -.6, 0, .6, 1.2]) { c.save(); c.translate(0, -78); c.rotate(a); ell(c, 0, -26, 16, 40, 0, C.leaf); c.restore(); }
  c.restore();
}
export function tableCloth(c, y, w = 2400) { rrect(c, -200, y, w, 600, 0, C.pink); for (let i = 0; i < 26; i++) for (let j = 0; j < 6; j++) if ((i + j) % 2) rrect(c, -200 + i * 100, y + j * 100, 100, 100, 0, C.cream); }

/* ---------- Hop, châu chấu (khách mời): xanh lá đậm, râu NGẮN (khác Chirp râu dài), đùi sau to, "tai" là mặt trống ở bụng dưới cánh ----------
   pose: { fiddle 0..1 chân sau kéo lên xuống, ear 0..1 tai sáng, look [x,y], blink, hop 0..1 } — nhìn nghiêng, mặt quay sang phải (dir) */
export function hop(c, x, y, s, o = {}) {
  const dir = o.dir ?? 1, fid = o.fiddle || 0, lift = (o.hop || 0) * .6;
  const body = '#3FAE4A', dark = '#2B7F36', light = '#8BD86A', belly = '#C9EE8A';
  c.save(); c.translate(x, y - lift * s); c.scale(dir * s, s);
  // chân bên xa
  capsule(c, -.1, -.5, -.2, 0, .07, dark); capsule(c, .3, -.52, .38, 0, .07, dark);
  // bụng dài
  ell(c, -.75, -.62, .78, .3, .08, body);
  for (let i = 0; i < 5; i++) capsule(c, -1.32 + i * .26, -.42, -1.3 + i * .26, -.8, .03, dark);   // đốt bụng
  // cánh khép trên lưng
  c.save(); c.translate(-.6, -.86); c.rotate(-.06 - fid * .03); ell(c, 0, 0, .78, .13, 0, dark); ell(c, .05, -.02, .6, .07, 0, '#4FC25A'); c.restore();
  // ngực + khiên
  ell(c, .12, -.78, .3, .28, 0, body); ell(c, .14, -.9, .28, .14, 0, dark);
  // đùi sau to (bên gần) kéo như cây vĩ
  const a = -.35 - fid * .35;
  c.save(); c.translate(-.1, -.68); c.rotate(a); ell(c, -.45, 0, .55, .17, 0, light); for (let i = 0; i < 4; i++) capsule(c, -.8 + i * .2, -.08, -.75 + i * .2, .08, .025, dark);
  capsule(c, -.95, .02, -.4, .72, .06, dark); c.restore();
  // tai (mặt trống) ở bên hông đốt bụng đầu, ngay sau ngực, dưới mép cánh (FACTS §5); vẽ sau cùng để không bị đùi che
  const ear = o.ear || 0; ell(c, -.22, -.6, .13, .11, 0, ear > .05 ? C.mint : light); if (ear > .05) { c.strokeStyle = `rgba(255,255,255,${.8 * ear})`; c.lineWidth = .025; for (let k = 1; k <= 2; k++) { c.beginPath(); c.arc(-.22, -.6, .13 + k * .08 * ear, 0, TAU); c.stroke(); } }
  // chân trước, giữa (bên gần)
  capsule(c, .3, -.6, .52, -.25, .065, body); capsule(c, .52, -.25, .5, 0, .055, body);
  capsule(c, .02, -.58, .08, -.25, .065, body); capsule(c, .08, -.25, -.02, 0, .055, body);
  // đầu
  ell(c, .5, -1.02, .3, .32, .25, body); ell(c, .6, -.8, .14, .1, 0, belly);
  // mắt to
  const lk = o.look || [.3, 0], bl = o.blink || 0;
  ell(c, .58, -1.12, .14, .15 * (1 - bl * .9), 0, C.white); circle(c, .6 + lk[0] * .05, -1.12 + lk[1] * .05, .075 * (1 - bl), C.ink); circle(c, .62 + lk[0] * .05, -1.15, .025 * (1 - bl), C.white);
  ell(c, .7, -.92, .05, .03, 0, C.pink);
  if (o.smile !== false) { c.strokeStyle = C.ink; c.lineWidth = .03; c.beginPath(); c.arc(.7, -.95, .07, .3, 1.6); c.stroke(); }
  // râu NGẮN, chỉ dài bằng nửa thân
  capsule(c, .5, -1.3, .78, -1.62, .035, dark); capsule(c, .44, -1.3, .64, -1.66, .035, dark);
  c.restore();
}

/* ---------- Zip, chuồn chuồn (khách mời): thân dài xanh trời, đôi mắt kép khổng lồ phủ gần hết đầu, bốn cánh trong ----------
   pose: { wing pha vỗ cánh, look, eyeGlow 0..1 (trong kính: mắt kép có ô lục giác sáng), blink } */
export function zip(c, x, y, s, o = {}) {
  const dir = o.dir ?? 1, ph = o.wing ?? 0, eg = o.eyeGlow || 0;
  c.save(); c.translate(x, y); c.scale(dir * s, s); c.rotate(o.rot || 0);
  // bốn cánh trong (vỗ)
  for (const [bx, len, k] of [[-.05, 1.25, 0], [-.25, 1.15, 1]]) for (const sd of [-1, 1]) {
    const flap = Math.sin(ph * TAU + k * .8) * .35 * sd;
    c.save(); c.translate(bx, -.12); c.rotate(sd * (1.25 + flap) - Math.PI / 2 * 0); ell(c, 0, -len * .52 * sd * 0 - len * .5, .17, len * .5, 0, 'rgba(203,240,255,.62)'); ell(c, 0, -len * .5, .07, len * .4, 0, 'rgba(255,255,255,.5)'); c.restore();
  }
  // bụng dài, nhiều đốt
  for (let i = 0; i < 9; i++) { const bx = -.35 - i * .21; ell(c, bx, -.1 + i * .006, .13 - i * .005, .08 - i * .003, 0, i % 2 ? C.sky : '#2A9EE0'); }
  ell(c, -2.25, -.07, .07, .04, 0, C.ink);
  // ngực
  ell(c, -.08, -.12, .26, .2, 0, '#2A9EE0'); ell(c, -.04, -.2, .16, .07, 0, C.skyL);
  // chân (gập dưới ngực)
  for (const fx of [-.15, -.02, .1]) { capsule(c, fx, -.02, fx + .06, .16, .03, C.ink); capsule(c, fx + .06, .16, fx + .14, .2, .025, C.ink); }
  // đầu: hai mắt kép to phủ gần hết đầu
  circle(c, .27, -.13, .17, '#2A9EE0');
  const eyeC = eg > .05 ? C.mint : '#5BE0C8';
  ell(c, .31, -.24, .2, .19, -.2, eyeC); ell(c, .4, -.08, .17, .16, .2, '#3FC4AF');
  if (eg > .05) {                                               // ô mắt kép (trong kính)
    c.save(); c.beginPath(); c.ellipse(.31, -.24, .2, .19, -.2, 0, TAU); c.clip();
    c.strokeStyle = `rgba(255,255,255,${.7 * eg})`; c.lineWidth = .012;
    for (let i = -6; i < 7; i++) for (let j = -6; j < 7; j++) { const hx = .31 + i * .045 + (j % 2) * .022, hy = -.24 + j * .04; c.beginPath(); for (let k = 0; k < 6; k++) { const a = k * TAU / 6; k ? c.lineTo(hx + Math.cos(a) * .022, hy + Math.sin(a) * .022) : c.moveTo(hx + Math.cos(a) * .022, hy + Math.sin(a) * .022); } c.closePath(); c.stroke(); }
    c.restore();
  }
  // con ngươi to hướng nhìn, ánh sáng phẳng
  const lk = o.look || [.4, 0], bl = o.blink || 0;
  ell(c, .34 + lk[0] * .06, -.24 + lk[1] * .05, .08, .09 * (1 - bl), 0, C.ink); circle(c, .37 + lk[0] * .06, -.28, .025 * (1 - bl), C.white);
  ell(c, .44, -.03, .04, .025, 0, C.pink); c.strokeStyle = C.ink; c.lineWidth = .022; c.beginPath(); c.arc(.42, -.04, .05, .5, 1.9); c.stroke();
  c.restore();
}

/* ---------- sâu gấu len (khách mời): lông xù, hai đầu đen, khúc giữa nâu cam; freeze 0..1 phủ băng, cuộn tròn ---------- */
export function woollyBear(c, x, y, s, o = {}) {
  const fz = o.freeze || 0, curl = o.curl ?? .9, t = o.t || 0, wake = o.wake || 0;
  c.save(); c.translate(x, y); c.scale(s, s);
  const n = 11, segs = [];
  for (let i = 0; i < n; i++) { const u = i / (n - 1), a = Math.PI * .9 + u * TAU * .8 * curl, R = lerp(.95, .4, u * curl); segs.push([Math.cos(a) * R * curl + (1 - curl) * lerp(-1.4, 1.4, u), Math.sin(a) * R * curl * .8 - .45 + (1 - curl) * .45 - Math.abs(Math.sin(t * 3 + i * .6)) * .05 * wake]); }
  segs.forEach(([px, py], i) => {
    const col = i < 3 || i > n - 3 ? '#2A2233' : '#C9692A', r = .3;
    for (let k = 0; k < 12; k++) { const a = k * TAU / 12; capsule(c, px, py, px + Math.cos(a) * r * 1.25, py + Math.sin(a) * r * 1.25, .06, col); }   // lông xù
    circle(c, px, py, r, col);
  });
  const [hx, hy] = segs[n - 1]; circle(c, hx, hy, .26, '#1E1B3A');
  const sl = o.sleep ?? 1;
  if (sl > .5) { c.strokeStyle = C.cream; c.lineWidth = .04; c.lineCap = 'round'; for (const dx of [-.08, .1]) { c.beginPath(); c.arc(hx + dx, hy - .02, .05, .2, Math.PI - .2); c.stroke(); } }
  else { circle(c, hx - .07, hy - .04, .06, C.white); circle(c, hx + .1, hy - .04, .06, C.white); circle(c, hx - .06, hy - .04, .03, C.ink); circle(c, hx + .11, hy - .04, .03, C.ink); }
  if (fz > .02) {                                                 // lớp băng mỏng + tinh thể
    segs.forEach(([px, py], i) => { circle(c, px, py, .42, `rgba(214,240,255,${.55 * fz})`); });
    for (let i = 0; i < 6; i++) { const [px, py] = segs[(i * 2) % n]; c.save(); c.globalAlpha = fz; snowflakeTiny(c, px + .2, py - .3, .12); c.restore(); }
  }
  c.restore();
}
function snowflakeTiny(c, x, y, r) { c.strokeStyle = C.white; c.lineWidth = r * .25; c.lineCap = 'round'; for (let i = 0; i < 3; i++) { const a = i * Math.PI / 3; c.beginPath(); c.moveTo(x - Math.cos(a) * r, y - Math.sin(a) * r); c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); c.stroke(); } }

/* ---------- kiến thợ (giống films/short-004/props.js) và phòng trú đông dưới đất ---------- */
export function workerAnt(c, x, y, s, ph = 0, o = {}) {
  const dir = o.dir ?? 1, col = o.col || '#7A3A10', dark = o.dark || '#4E2408', tap = o.tap || 0;
  c.save(); c.translate(x, y); c.scale(dir, 1);
  for (let i = 0; i < 3; i++) for (const sd of [-1, 1]) {
    const a = Math.sin(ph * TAU + i * 2.1 + (sd > 0 ? Math.PI : 0)), hx = (-.32 + i * .32) * s, fx = hx + (i - 1) * .2 * s + a * .16 * s;
    capsule(c, hx, -.42 * s, (hx + fx) / 2 + .08 * s, -.62 * s + Math.max(0, a) * -.1 * s, .07 * s, sd > 0 ? dark : col);
    capsule(c, (hx + fx) / 2 + .08 * s, -.62 * s, fx, -Math.max(0, -a) * .08 * s, .06 * s, sd > 0 ? dark : col);
  }
  ell(c, -.72 * s, -.55 * s, .42 * s, .3 * s, -.2, col); ell(c, -.08 * s, -.58 * s, .26 * s, .17 * s, 0, col);
  const hy = -.66 * s; circle(c, .38 * s, hy, .22 * s, col);
  if (o.sleep) { c.strokeStyle = C.cream; c.lineWidth = .03 * s; c.beginPath(); c.arc(.47 * s, hy - .04 * s, .05 * s, .2, Math.PI - .2); c.stroke(); }
  else { circle(c, .46 * s, hy - .04 * s, .055 * s, C.ink); circle(c, .48 * s, hy - .06 * s, .02 * s, C.cream); }
  for (const [k, dy] of [[0, 0], [1, .03]]) {
    const t2 = k === 0 ? tap : tap * .6, ex = .62 * s, ey = hy - .38 * s + dy * s, tipx = ex + lerp(.32, .44, t2) * s, tipy = ey + lerp(-.12, .36, t2) * s;
    capsule(c, .44 * s, hy - .14 * s, ex, ey, .045 * s, dark); capsule(c, ex, ey, tipx, tipy, .04 * s, dark);
  }
  c.restore();
}
export const antTip = (x, y, s, o = {}) => { const dir = o.dir ?? 1, tap = o.tap || 0, hy = -.66 * s; return [x + dir * (.62 + lerp(.32, .44, tap)) * s, y + hy - .38 * s + lerp(-.12, .36, tap) * s]; };
// bong bóng mặt cắt lòng đất: đàn kiến túm tụm giữ ấm (p 0..1 mở bong bóng)
export function antChamber(c, x, y, r, p, t) {
  if (p <= 0) return; const R = r * p;
  c.save(); c.beginPath(); c.arc(x, y, R, 0, TAU); c.clip();
  c.fillStyle = '#8A4A1E'; c.fillRect(x - R, y - R, 2 * R, 2 * R);
  for (let i = 0; i < 18; i++) circle(c, x + (hash(i) - .5) * 2 * R, y + (hash(i + 7) - .5) * 2 * R, 10 + hash(i + 3) * 18, '#9E5A28');
  ell(c, x, y + R * .15, R * .72, R * .42, 0, '#5A2A0C');
  circle(c, x, y + R * .12, R * .36, 'rgba(255,138,47,.25)');
  const pts = [[-.3, .2], [-.1, .28], [.12, .24], [.32, .2], [-.2, .05], [.02, .1], [.22, .04], [-.05, -.06], [.12, -.08]];
  pts.forEach(([dx, dy], i) => workerAnt(c, x + dx * R, y + dy * R + R * .14, R * .17, 0, { dir: i % 2 ? -1 : 1, sleep: true }));
  c.restore();
  c.strokeStyle = W.snow; c.lineWidth = 12; c.beginPath(); c.arc(x, y, R, 0, TAU); c.stroke();
}

/* ---------- vườn tuyết ---------- */
export function snowGarden(c, t, o = {}) {
  const sky = o.sky || '#9FD3F2', y0 = o.y0 ?? 760, fog = o.fog || 0;
  c.fillStyle = sky; c.fillRect(-3000, -2000, 9000, 6000);
  ell(c, 400, y0 + 30, 900, 260, 0, W.snowS); ell(c, 1700, y0 + 10, 1100, 300, 0, W.snowS);
  for (const [fx, h] of [[180, 420], [1100, 520], [2300, 460], [3200, 400]]) { rrect(c, fx - 14, y0 - h, 28, h + 40, 14, '#6B4A8F'); capsule(c, fx, y0 - h * .6, fx + 90, y0 - h * .9, 14, '#6B4A8F'); capsule(c, fx, y0 - h * .4, fx - 80, y0 - h * .72, 12, '#6B4A8F'); ell(c, fx + 80, y0 - h * .92, 46, 14, -.4, W.snow); ell(c, fx - 72, y0 - h * .74, 40, 12, .4, W.snow); }
  c.fillStyle = W.snow; c.fillRect(-3000, y0 + 40, 9000, 3000);
  for (let i = -10; i < 40; i++) ell(c, i * 160, y0 + 44 + (i % 3) * 8, 130, 40, 0, W.snow);
  for (let i = 0; i < 70; i++) { const sx = -1000 + hash(i) * 5000 + Math.sin(t * .7 + i) * 30, sy = -200 + ((hash(i + 9) * 1400 + t * (50 + hash(i + 2) * 40)) % 1400); circle(c, sx, sy, 3 + hash(i + 4) * 6, 'rgba(255,255,255,.95)'); }
}
// hộp tổ ong gỗ phủ tuyết; heat 0..1: trong "kính nhiệt" thấy quả bóng ong rực cam bên trong
export function hiveBox(c, x, y, s, heat = 0, t = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  rrect(c, -160, -20, 320, 40, 8, W.woodD);
  for (let i = 0; i < 3; i++) rrect(c, -140, -150 - i * 130, 280, 128, 8, i % 2 ? W.wood : W.woodL);
  rrect(c, -170, -540, 340, 60, 10, W.woodD); ell(c, 0, -548, 180, 40, 0, W.snow);
  rrect(c, -50, -36, 100, 16, 8, '#3A1E0A');
  if (heat > 0) {
    c.save(); c.globalAlpha = heat; rrect(c, -140, -410, 280, 388, 8, W.coldA);
    const pulse = 1 + .04 * Math.sin(t * 4);
    circle(c, 0, -220, 120 * pulse, '#FF5A2F'); circle(c, 0, -220, 88 * pulse, W.warmA); circle(c, 0, -220, 52 * pulse, W.warmB);
    for (let i = 0; i < 26; i++) { const a = i * 2.4, rr = 30 + (i % 5) * 18; ell(c, Math.cos(a) * rr, -220 + Math.sin(a) * rr, 12, 8, a, '#FFE9A0'); }
    c.restore();
  }
  c.restore();
}
export function rock(c, x, y, s, snow = true) { c.save(); c.translate(x, y); c.scale(s, s); ell(c, 0, -60, 170, 90, 0, '#8E86A8'); ell(c, -30, -84, 110, 50, 0, '#A79FC0'); if (snow) ell(c, -10, -130, 130, 34, 0, W.snow); c.restore(); }
// đống lá khô (nhấc lên: lift 0..1)
export function leafPile(c, x, y, s, lift = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  const cols = ['#C9692A', '#E8871E', '#9E5426', '#D9643A'];
  for (let i = 0; i < 9; i++) { const a = (hash(i) - .5) * 1.2, lx = -150 + i * 38, ly = -30 - (i % 3) * 14 - lift * (120 + hash(i + 3) * 80), r = .4 + hash(i + 1) * .3 + lift * (hash(i) - .5); c.save(); c.translate(lx + lift * (hash(i + 5) - .5) * 160, ly); c.rotate(a + r); ell(c, 0, 0, 62, 28, 0, cols[i % 4]); capsule(c, -60, 0, 60, 0, 5, '#7A3A10'); c.restore(); }
  c.restore();
}
// bọ rùa ngủ đông (không phải Dot): cỡ nhỏ, nhắm mắt
export function sleepyLadybug(c, x, y, s, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  ell(c, 0, 0, 1, .78, 0, C.tang); capsule(c, 0, -.76, 0, .76, .05, C.ink);
  for (const [dx, dy, r] of [[-.45, -.2, .17], [.45, -.2, .17], [-.4, .32, .14], [.4, .32, .14]]) circle(c, dx, dy, r, C.ink);
  ell(c, 0, -.82, .42, .26, 0, C.ink); c.strokeStyle = C.cream; c.lineWidth = .06; for (const dx of [-.16, .16]) { c.beginPath(); c.arc(dx, -.86, .08, .2, Math.PI - .2); c.stroke(); }
  c.restore();
}
// cửa sổ nhà nhìn từ ngoài vườn: khung ấm (glow 0..1)
export function warmWindow(c, x, y, w, h, glow = 0) {
  rrect(c, x - 30, y - 30, w + 60, h + 60, 20, W.woodD); rrect(c, x, y, w, h, 12, glow > 0 ? lerpCol('#FFC35A', '#FFE07A', glow) : '#FFC35A');
  rrect(c, x + w / 2 - 10, y, 20, h, 6, W.woodD); rrect(c, x, y + h / 2 - 10, w, 20, 6, W.woodD);
  ell(c, x + w / 2, y - 26, w * .6, 26, 0, W.snow);
}

/* ---------- ký ức: đồng cỏ đêm, mép ao, tổ ong ---------- */
export function nightMeadow(c, t, o = {}) {
  c.fillStyle = C.night; c.fillRect(-2000, -2000, 6000, 6000);
  for (let i = 0; i < 60; i++) { const tw = .5 + .5 * Math.sin(t * 2 + i); circle(c, hash(i) * 2000, hash(i + 3) * 620, 2 + 3 * hash(i + 6) * tw, C.cream); }
  circle(c, o.moonX ?? 1560, o.moonY ?? 220, 120, '#FFF3B8'); circle(c, (o.moonX ?? 1560) - 30, (o.moonY ?? 220) - 30, 26, '#FFE58A');
  ell(c, 500, 900, 1100, 260, 0, '#2E6B3A'); ell(c, 1600, 940, 1000, 240, 0, '#25603A');
  c.fillStyle = '#1F4E2E'; c.fillRect(-2000, 940, 6000, 2000);
  for (let i = 0; i < 40; i++) { const gx = -100 + i * 56, h = 60 + hash(i) * 70, sw = Math.sin(t * 1.5 + i) * 8; poly(c, [[gx - 12, 1080], [gx + 12, 1080], [gx + sw, 1080 - h]], i % 2 ? '#2E7A40' : '#246236'); }
}
export function pond(c, t, o = {}) {
  c.fillStyle = C.sky; c.fillRect(-2000, -2000, 6000, 6000);
  ell(c, 300, 300, 160, 70, 0, C.cream); ell(c, 1500, 220, 200, 80, 0, C.cream);
  ell(c, 960, 840, 1400, 320, 0, C.leaf); ell(c, 960, 880, 1200, 230, 0, '#2E8FD6');
  for (let i = 0; i < 6; i++) { const rx = 600 + i * 160, ry = 880 + (i % 2) * 40, p = (t * .4 + i * .3) % 1; c.strokeStyle = `rgba(255,255,255,${.5 * (1 - p)})`; c.lineWidth = 5; c.beginPath(); c.ellipse(rx, ry, 30 + p * 60, 8 + p * 16, 0, 0, TAU); c.stroke(); }
  for (const [rx, h] of [[180, 520], [260, 420], [1700, 560], [1790, 440], [1620, 380]]) { capsule(c, rx, 1080, rx + 8, 1080 - h, 14, C.leafD); ell(c, rx + 8, 1080 - h - 30, 16, 50, 0, W.woodD); }
  ell(c, 820, 760, 150, 40, 0, C.leafD);                                   // lá súng
}
