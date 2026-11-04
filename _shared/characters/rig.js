// Rig phẳng 3D: mỗi nhân vật dựng một lần bằng khối phẳng đặt trong không gian 3D,
// chiếu vuông góc theo góc xoay (yaw) nên mọi góc nhìn giữ đúng tỷ lệ. Không viền, không gradient.
// Toạ độ nhân vật: x sang phải, y xuống dưới (mặt đất y = 0), z hướng về người xem. yaw > 0: quay sang phải khung.
const TAU = Math.PI * 2;
export const V = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  mul: (a, k) => [a[0] * k, a[1] * k, a[2] * k],
  len: a => Math.hypot(a[0], a[1], a[2]),
  norm: a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; },
  cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  lerp: (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t],
};
// ma trận quay cục bộ (hàng), dùng cho khối elip nghiêng
export const rotX = a => { const c = Math.cos(a), s = Math.sin(a); return [[1, 0, 0], [0, c, -s], [0, s, c]]; };
export const rotY = a => { const c = Math.cos(a), s = Math.sin(a); return [[c, 0, s], [0, 1, 0], [-s, 0, c]]; };
export const rotZ = a => { const c = Math.cos(a), s = Math.sin(a); return [[c, -s, 0], [s, c, 0], [0, 0, 1]]; };
export const mmul = (A, B) => A.map(r => [0, 1, 2].map(j => r[0] * B[0][j] + r[1] * B[1][j] + r[2] * B[2][j]));
export const mvec = (M, v) => M.map(r => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);
const I3 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

// bao lồi 2D (chuỗi đơn điệu)
export function hull2(pts) {
  pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = [];
  for (const p of pts) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}

// ---- vẽ 2D phẳng ----
function ellPath(c, x, y, rx, ry, a) { c.beginPath(); c.ellipse(x, y, Math.max(0, rx), Math.max(0, ry), a, 0, TAU); }
function capPath(c, A, B, w) {
  const r = w / 2, a = Math.atan2(B[1] - A[1], B[0] - A[0]);
  c.beginPath(); c.arc(B[0], B[1], r, a - Math.PI / 2, a + Math.PI / 2); c.arc(A[0], A[1], r, a + Math.PI / 2, a + Math.PI * 1.5); c.closePath();
}
// mảng tối phẳng: tô màu tối rồi phủ màu gốc lệch lên trên-trái, chỉ còn một vành tối ở dưới-phải (ánh sáng từ trên-trái)
function shaded(c, pathFn, col, sh, size) {
  c.save(); pathFn(0, 0); c.fillStyle = col; c.fill();
  if (sh && sh.col) {
    const k = (sh.k ?? .22) * size, dx = (sh.dx ?? -.7) * k, dy = (sh.dy ?? -.7) * k;
    pathFn(0, 0); c.clip(); c.fillStyle = sh.col; c.fill(); pathFn(dx, dy); c.fillStyle = col; c.fill();
  }
  c.restore();
}

export class Rig {
  constructor(yaw = 0, o = {}) {
    this.yaw = yaw; this.cs = Math.cos(yaw); this.sn = Math.sin(yaw); this.items = []; this.detail = o.detail || 0;
    this.Yaw = [[this.cs, 0, this.sn], [0, 1, 0], [-this.sn, 0, this.cs]];
  }
  X(p) { return p[0] * this.cs + p[2] * this.sn; }
  Z(p) { return -p[0] * this.sn + p[2] * this.cs; }
  P(p) { return [this.X(p), p[1], this.Z(p)]; }
  add(z, fn) { this.items.push({ z, fn, i: this.items.length }); return this; }
  // khối cầu
  ball(p, r, col, o = {}) { const [x, y, z] = this.P(p); return this.add(z + (o.bias || 0), c => shaded(c, (dx, dy) => ellPath(c, x + dx, y + dy, r, r, 0), col, o.shade, r)); }
  // khối elip với bán trục rad = [a, b, c] theo trục cục bộ, có thể nghiêng bằng o.rot (ma trận cục bộ)
  ell(p, rad, col, o = {}) {
    const M = mmul(this.Yaw, o.rot || I3), D = rad.map(r => 1 / (r * r));
    const A = [0, 1, 2].map(i => [0, 1, 2].map(j => M[i][0] * D[0] * M[j][0] + M[i][1] * D[1] * M[j][1] + M[i][2] * D[2] * M[j][2]));
    const q00 = A[0][0] - A[0][2] * A[0][2] / A[2][2], q01 = A[0][1] - A[0][2] * A[1][2] / A[2][2], q11 = A[1][1] - A[1][2] * A[1][2] / A[2][2];
    const phi = .5 * Math.atan2(2 * q01, q00 - q11), m = (q00 + q11) / 2, d = Math.sqrt(((q00 - q11) / 2) ** 2 + q01 * q01);
    const r1 = 1 / Math.sqrt(m + d), r2 = 1 / Math.sqrt(Math.max(1e-9, m - d));
    const [x, y, z] = this.P(p);
    return this.add(z + (o.bias || 0), c => shaded(c, (dx, dy) => ellPath(c, x + dx, y + dy, r1, r2, phi), col, o.shade, Math.min(r1, r2)));
  }
  // viên nang (thân, chi) bề rộng w
  cap(a, b, w, col, o = {}) {
    const A = this.P(a), B = this.P(b);
    return this.add((o.z ?? (A[2] + B[2]) / 2) + (o.bias || 0), c => shaded(c, (dx, dy) => capPath(c, [A[0] + dx, A[1] + dy], [B[0] + dx, B[1] + dy], w), col, o.shade, w / 2));
  }
  // chi mềm nhiều khớp (nét tròn đầu, tròn khớp)
  limb(pts, w, col, o = {}) {
    const Q = pts.map(p => this.P(p)), z = o.z ?? Q.reduce((s, q) => s + q[2], 0) / Q.length;
    return this.add(z + (o.bias || 0), c => {
      c.strokeStyle = col; c.lineWidth = w; c.lineCap = c.lineJoin = 'round'; c.beginPath();
      if (o.smooth && Q.length > 2) { c.moveTo(Q[0][0], Q[0][1]); for (let i = 1; i < Q.length - 1; i++) { const mx = (Q[i][0] + Q[i + 1][0]) / 2, my = (Q[i][1] + Q[i + 1][1]) / 2; c.quadraticCurveTo(Q[i][0], Q[i][1], i === Q.length - 2 ? Q[i + 1][0] : mx, i === Q.length - 2 ? Q[i + 1][1] : my); } }
      else Q.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]));
      c.stroke();
    });
  }
  // mặt phẳng: fn vẽ trong toạ độ (u, v) của mặt; U, V là hai véc-tơ 3D. o.cull bỏ mặt quay lưng.
  plane(O, U, V2, fn, o = {}) {
    const N = V.cross(U, V2), f = this.Z(N) / (V.len(N) || 1);
    if (o.cull && f <= (o.cullAt ?? .01)) return this;
    const Op = this.P(O);
    return this.add(Op[2] + (o.bias || 0), c => { c.transform(this.X(U), U[1], this.X(V2), V2[1], Op[0], Op[1]); fn(c, f); });
  }
  // chi tiết dán trên mặt khối (mắt, miệng, má): luôn đứng thẳng, bẹt ngang theo độ quay, mất khi quay đi
  feat(center, R, dir, size, fn, o = {}) {
    const d = V.norm(dir), pos = V.add(center, V.mul(d, R)), dz = this.Z(d);
    if (dz < (o.cullAt ?? .06)) return this;
    const sq = o.flat ? Math.max(.08, dz) : .5 + .5 * Math.min(1, dz / .8), x = this.X(pos);
    return this.add(this.Z(pos) + (o.bias ?? .002), c => { c.translate(x, pos[1]); c.scale(size * sq, size); fn(c, dz); });
  }
  // hình dán phối cảnh thật trên mặt elip (chấm bọ rùa, sọc ong)
  decal(center, rad, dir, size, fn, o = {}) {
    const d = V.norm(dir), t = 1 / Math.hypot(d[0] / rad[0], d[1] / rad[1], d[2] / rad[2]), pos = V.add(center, V.mul(d, t));
    const n = V.norm([pos[0] - center[0], pos[1] - center[1], pos[2] - center[2]].map((v, i) => v / (rad[i] * rad[i])));
    const ref = Math.abs(n[1]) > .95 ? [1, 0, 0] : [0, -1, 0];
    const U = V.norm(V.cross(n, ref)), W = V.norm(V.cross(n, U));
    const s = o.flip ? -1 : 1;
    return this.plane(pos, V.mul(U, size * s * (Math.abs(n[1]) > .95 ? -1 : 1)), V.mul(W, size), fn, { cull: true, cullAt: o.cullAt ?? .02, bias: o.bias ?? .003 });
  }
  // khối tròn xoay theo trục cục bộ (sọc ong, đốt bụng): xếp các lát cắt từ xa tới gần, mỗi lát một màu theo colFn(t), t ∈ [-1, 1]
  lathe(center, axis, half, rx, ry, colFn, o = {}) {
    const a = V.norm(axis), e1 = Math.abs(a[1]) > .9 ? [1, 0, 0] : V.norm(V.cross([0, 1, 0], a)), e2 = V.norm(V.cross(a, e1));
    const n = o.n || 36, slices = [];
    for (let i = 0; i <= n; i++) {
      const t = -1 + 2 * i / n, k = o.profile ? o.profile(t) : Math.sqrt(Math.max(0, 1 - t * t)) * (o.taper ? o.taper(t) : 1), c0 = V.add(center, V.mul(a, t * half));
      const pts = []; for (let j = 0; j < 28; j++) { const th = j * TAU / 28, p = V.add(c0, V.add(V.mul(e1, Math.cos(th) * rx * k), V.mul(e2, Math.sin(th) * ry * k))); pts.push([this.X(p), p[1]]); }
      slices.push({ t, z: this.Z(c0), pts });
    }
    const segs = []; for (let i = 0; i < n; i++) segs.push({ z: (slices[i].z + slices[i + 1].z) / 2, pts: slices[i].pts.concat(slices[i + 1].pts), col: colFn((slices[i].t + slices[i + 1].t) / 2) });
    segs.sort((p, q) => p.z - q.z);
    const zc = this.Z(center) + (o.bias || 0);
    return this.add(zc, c => { for (const s of segs) { const H = hull2(s.pts); c.fillStyle = c.strokeStyle = s.col; c.lineWidth = .012; c.lineJoin = 'round'; c.beginPath(); H.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.stroke(); } });
  }
  // vẽ 2D tự do ở độ sâu z (toạ độ đã chiếu)
  flat(z, fn) { return this.add(z, fn); }
  draw(c) { this.items.sort((a, b) => a.z - b.z || a.i - b.i); for (const it of this.items) { c.save(); it.fn(c); c.restore(); } }
}
