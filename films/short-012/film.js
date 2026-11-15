// SHORT-012 · This Bug Can Fly Backwards! — mọi khung hình là hàm thuần của t. Phim phát vòng lặp: Zip bay lùi ra phải rồi lao tới lại đúng khung đầu.
// Bản B theo lượt nâng cấp 11/2026 (PHAN-TICH-SHORTS/KE-HOACH-NANG-CAP.md §4): kính lớn có máy trôi, bí mật xảy ra thành chuyển động
// (bay lùi, đứng yên, soi chậm bốn cánh so le), câu cửa miệng có hành động (albumGulp), người nói có trên hình, phụ đề ở vùng an toàn.
// Nhân vật phong cách v2 "Kẹo Phẳng Viền" (CHARACTER-BIBLE §7, §10): bật trước mọi lần vẽ.
import { LOOK } from '/_shared/characters/look.js';
import { C, circle, ell, rrect, ground, popText, subFont, clamp, lerp, seg, back, eo, TAU } from '/_shared/kit.js';
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { star } from '/_shared/characters/face.js';
import { makeTalk, blinkAt, ex, rigPt, look, toScreen, loupe, ARM, badge, shadow, subtitle, LENS_UP, hookTitle, stickerMatchCut, snapFlash, SAFE, albumGulp, albieAt } from '/_shared/episode.js';
import { D, garden, lensBackdrop, GY, ZIP12, windLines, brakePuff, strokeArrow, bumpStars, levelLine } from './props.js';
import { LINES, CARDS, DUR, HIT, SLOW } from './timeline.js';
import { track, ss, ei } from '/core/lib.js';
LOOK.v = 2;
LOOK.cheer = true;   // (11/2026) mặt nhân vật luôn vui tươi (QUALITY.md §5, stage.js cheerExpr)

const K = keys => track(keys);
const T = makeTalk(LINES);
export const setEnv = T.setEnv;
const talkAt = T.talkAt;
const decay = (t, list, k = 6) => list.reduce((s, h) => s + (t >= h ? Math.exp(-(t - h) * k) : 0), 0);
const arc = (a, b, u, h) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - h * 4 * u * (1 - u)];
const line = id => LINES.find(l => l.id === id);
const eio = u => { u = clamp(u); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };

/* ================= nhân vật ================= */
const ML = { x: 360, r: 95 }, AB = { x: 510, k: 95 }, ZK = 66;
const mlLens = (x = ML.x) => [x, GY - LENS_UP * ML.r];
const zipE = (name, t, o = {}) => ex(BY.zip, name, { blink: blinkAt(t, .2), ...o });
// Zip: s = { x, y (điểm chân), k, yaw, lean, lift, fly (đập nhanh), blur, cs, amp, tint, flap, peek, curl, E, wind: [độ hiện, hướng bay], puff }
function zipPose(s, t) {
  const fast = s.fly ? t * 46 : 0;
  return { lift: s.lift ?? .3, flap: s.flap ?? fast, beat: s.beat ?? (s.fly ? 1 : 0), blur: s.blur || 0, cs: s.cs || 0, amp: s.amp ?? .35, tint: s.tint || 0, wtilt: s.wtilt || 0, peek: s.peek || 0, curl: s.curl || 0 };
}
function drawZip(c, s, t) {
  const k = s.k || ZK;
  if (s.wind && s.wind[0] > .02) {                           // vệt gió phía sau hướng bay: bay lùi thì vệt nằm trước đầu
    const lead = s.wind[1] > 0 ? rigPt(s.x, s.y, k, s.yaw, s.lean || 0, [0, -.62 - (s.lift ?? .3), .95]) : rigPt(s.x, s.y, k, s.yaw, s.lean || 0, [0, -.62 - (s.lift ?? .3), -2.35]);
    windLines(c, lead[0], lead[1], s.wind[1], k * 2.2, s.wind[0], t, 4);
  }
  drawChar(c, ZIP12, { x: s.x, y: s.y, k, yaw: s.yaw, lean: s.lean || 0, showFx: false, expr: s.E, pose: zipPose(s, t) });
  if (s.puff > 0) { const n = rigPt(s.x, s.y, k, s.yaw, s.lean || 0, [0, -.75 - (s.lift ?? .3), 1.1]); brakePuff(c, n[0], n[1], -1, s.puff); }
}
// tâm hình của Zip: nhìn nghiêng thì lệch về đuôi, nhìn thẳng thì ở ngực
const zipCenter = s => rigPt(s.x, s.y, s.k || ZK, s.yaw, s.lean || 0, [0, -.66 - (s.lift ?? .3), lerp(-.1, -.72, clamp(Math.abs(Math.sin(s.yaw)) * 1.25 - .25))]);

/* ---------- Zip ở vườn: móc (dùng cả cuối phim với t − DUR), kính, gag ---------- */
const ZY = 1045, HOV = [740, 1015];
function zipHook(t) {
  const s = { x: 0, y: ZY, k: ZK, yaw: -1.25, lean: 0, lift: .3, fly: 1, blur: 0, E: null, wind: null, puff: 0 };
  if (t < HIT.brake) {                                       // lao tới thẳng, phanh trong 0,12 s cuối
    const tb = HIT.brake - .12;
    if (t < tb) { const u = (t + .55) / (tb + .55); s.x = lerp(1000, 575, u); s.y = lerp(985, ZY, u); s.wind = [1, -1]; }   // lao tới hơi chếch xuống: mặt Zip vào khung ở trên cột nút phải
    else { const v = seg(t, tb, HIT.brake); s.x = 575 - 42 * (1 - (1 - v) * (1 - v)); s.wind = [1 - v, -1]; s.lean = -.25 * v; }
    s.E = zipE('excited', t, { look: [-.6, 0] }); return s;
  }
  if (t < HIT.back1[0]) {                                    // phanh kít: ngóc mũi, nảy nhẹ, "phụt" gió
    const v = seg(t, HIT.brake, HIT.back1[0]); s.x = 533 + 6 * Math.sin(Math.PI * v); s.lean = -.32 * (1 - v) + .05 * Math.sin(t * 60) * (1 - v);
    s.puff = seg(t, HIT.brake, HIT.brake + .35); s.E = zipE('surprised', t, { look: [-.9, 0] }); return s;
  }
  if (t < HIT.back1[1]) {                                    // bay giật lùi (đuôi đi trước)
    const v = eio(seg(t, HIT.back1[0], HIT.back1[1])); s.x = lerp(533, HOV[0] + 40, v); s.y = lerp(ZY, HOV[1], v); s.lean = .12 * Math.sin(Math.PI * v);
    s.wind = [Math.sin(Math.PI * v), 1]; s.puff = seg(t, HIT.brake, HIT.brake + .35); s.E = zipE('happy', t, { look: [-.8, 0] }); return s;
  }
  if (t < HIT.dash2[0]) { s.x = HOV[0] + 40; s.y = HOV[1] + 5 * Math.sin(t * 9); s.blur = 1; s.E = zipE('confident', t, { look: [-.8, .1] }); return s; }
  if (t < HIT.brake2) { const v = ei(seg(t, HIT.dash2[0], HIT.brake2)); s.x = lerp(HOV[0] + 40, 548, v); s.y = lerp(HOV[1], ZY, v); s.wind = [v, -1]; s.E = zipE('excited', t, { look: [-.9, 0] }); return s; }
  if (t < HIT.back2[0]) { const v = seg(t, HIT.brake2, HIT.back2[0]); s.x = 548; s.lean = -.3 * (1 - v); s.puff = seg(t, HIT.brake2, HIT.brake2 + .3); s.E = zipE('laugh', t); return s; }
  if (t < HIT.back2[1]) { const v = eio(seg(t, HIT.back2[0], HIT.back2[1])); s.x = lerp(548, HOV[0], v); s.y = lerp(ZY, HOV[1], v); s.wind = [Math.sin(Math.PI * v), 1]; s.puff = seg(t, HIT.brake2, HIT.brake2 + .3); s.E = zipE('happy', t, { look: [-.8, 0] }); return s; }
  s.x = HOV[0]; s.y = HOV[1] + 5 * Math.sin(t * 8); s.blur = 1; s.E = zipE('happy', t, { look: [-.85, .1] });
  return s;
}
// trong kính: chuẩn bị, bay lùi, phanh, đứng yên, quay mặt ra, soi chậm (cánh so le, tô hai màu)
const LZ = [890, 1000];
function slowFlap(t) { return Math.PI / 2 + TAU * (t - SLOW.t0) / SLOW.cyc; }   // đỉnh "cánh trước lên" ở SLOW.t0 + n·cyc
function zipLens(t) {
  const s = zipHook(Math.min(t, HIT.zoom[0]));
  if (t < HIT.zoom[0]) return s;
  s.k = lerp(ZK, 60, ss(seg(t, HIT.zoom[0], HIT.zoom[1])));   // trong kính: cỡ đã căn cho mặt kính
  s.y = HOV[1] + 5 * Math.sin(t * 8);
  const pre = ss(seg(t, 5.0, HIT.lback[0])), v = eio(seg(t, HIT.lback[0], HIT.lback[1]));
  s.x = HOV[0] - 25 * pre * (1 - v) + (LZ[0] - HOV[0]) * v; s.y = lerp(s.y, LZ[1], v);
  if (t < HIT.lback[1]) { s.blur = t < HIT.lback[0] ? 1 : 0; s.wind = t >= HIT.lback[0] ? [Math.sin(Math.PI * v), 1] : null; s.lean = -.08 * pre * (1 - v) + .1 * Math.sin(Math.PI * v); s.E = zipE(t < HIT.lback[0] ? 'confident' : 'excited', t, { look: [-.85, 0] }); return s; }
  // phanh, rồi đứng yên trên đường chấm chấm (thân không nhúc nhích), quay mặt ra
  const b = seg(t, HIT.lbrake, HIT.still + .1); s.x = LZ[0] + 8 * Math.sin(Math.PI * b); s.y = LZ[1]; s.lean = .18 * Math.sin(Math.PI * b);
  s.blur = 1; s.yaw = lerp(-1.25, -.2, ss(seg(t, HIT.turn[0], HIT.turn[1])));
  const sl = ss(seg(t, HIT.slow[0], HIT.slow[1]));
  if (sl > 0) { s.blur = 1 - sl; s.fly = 0; s.beat = 1; s.flap = slowFlap(t); s.cs = 1; s.amp = lerp(.35, .62, sl); s.tint = sl; s.wtilt = .8 * sl; }
  s.E = t > HIT.happy ? zipE('excited', t, { look: [.1, .15] }) : t > HIT.turn[0] ? zipE('happy', t, { look: [.15, .1] }) : zipE('surprised', t, { look: [-.6, 0] });
  return s;
}
// gag: Zip đứng yên trên cao bên trái, mắt ngó ra sau nhìn Miss Loupe (peek); câu hỏi: bay lùi ngang khung ra phải
const GZ = [255, 820];
function zipGag(t) {
  if (t >= HIT.spin) return zipHook(t - DUR);
  const s = { x: GZ[0], y: GZ[1] + 5 * Math.sin(t * 8), k: ZK, yaw: -1.25, lean: 0, lift: .3, fly: 1, blur: 1, peek: -.95, E: null, wind: null };
  const watch = t > HIT.notice && t < HIT.bump + 1.2;
  s.E = t > HIT.bump && t < HIT.bump + 1.4 ? zipE('laugh', t) : watch ? zipE('surprised', t, { look: [.9, .3] }) : zipE('happy', t, { look: [.9, .35] });
  if (t >= HIT.zipBack[0]) {
    const u = seg(t, HIT.zipBack[0], HIT.zipBack[1]), v = u < .25 ? ei(u / .25) * .25 : u;
    s.x = lerp(GZ[0], 1010, v); s.y = lerp(GZ[1], 960, v) + 4 * Math.sin(t * 8); s.blur = 0; s.peek = lerp(-.95, 0, ss(seg(u, 0, .2))); s.wind = [ss(seg(u, 0, .2)), 1];
    s.E = zipE('excited', t, { look: [-.8, 0] });
  }
  return s;
}

/* ---------- Miss Loupe (cỡ trung, toạ độ cảnh): đặt theo tâm kính ---------- */
function loupeHook(t) {
  const [wx, wy] = mlLens(), talk = talkAt(t);
  const st1 = Math.sin(Math.PI * seg(t, HIT.brake, HIT.brake + .4)), st2 = Math.sin(Math.PI * seg(t, HIT.brake2, HIT.brake2 + .32));
  const dz = seg(t, HIT.dizzy[0], HIT.dizzy[1]) > 0 && t < HIT.dizzy[1] ? 1 : 0, raise = ss(seg(t, line('L02').t, line('L02').t + .5));
  const lean = -.2 * Math.sin(Math.PI * seg(t, HIT.brake, HIT.brake + .9)) - .12 * st2;
  let name = 'happy', look_ = [.9, 0], pose = ARM.peer;
  if (t >= HIT.brake && t < HIT.back1[0] + .1) { name = 'surprised'; pose = ARM.up; }
  else if (t >= HIT.back1[0] && t < HIT.dash2[0]) { name = talk ? 'surprised' : 'curious'; pose = ARM.point; look_ = [.95, -.1]; }
  else if (t >= HIT.brake2 && t < HIT.brake2 + .3) { name = 'surprised'; pose = ARM.up; }
  else if (dz) { name = 'crosseyed'; pose = ARM.shrug; }
  else if (t >= HIT.dizzy[1] && t < line('L02').t) { name = 'curious'; look_ = [.85, -.2]; }
  else if (t >= line('L02').t) { name = talk ? 'explaining' : 'excited'; look_ = [.2, .1]; }
  else if (talk) name = 'surprised';
  const E = ex(BY.loupe, name, { talk, look: name === 'crosseyed' ? undefined : look_, blink: talk || name === 'crosseyed' ? 0 : blinkAt(t), fx: name === 'curious' && t > HIT.dizzy[1] });
  return { x: wx + 5 * Math.sin(t * 40) * st1, y: wy - 34 * st1 - 18 * st2 - 50 * raise, r: ML.r, rot: -.08 + lean + .12 * Math.sin(t * 9) * dz, pose: raise > .3 ? ARM.peer : pose, E };
}
function drawLoupe(c, L) { if (!L) return; shadow(c, L.x + 8, GY + 2, 120, .2); loupe(c, L.x, L.y, L.r, { E: L.E, rot: L.rot, pose: L.pose, fx: L.E.fx }); }

/* ================= VƯỜN: thế giới (toạ độ cảnh) ================= */
function gardenWorld(c, t, o = {}) {
  garden(c, t);
  if (o.ab) drawAlbie(c, o.ab, t);
  if (o.ls) drawLoupe(c, o.ls);
  if (o.zs) drawZip(c, o.zs, t);
  if (o.after) o.after(c);
}
function hookCam(t) {
  const [cx, cy, z] = K([[-1, [530, 1046, 1.82]], [0, [530, 1046, 1.82]], [HIT.brake, [522, 1042, 1.9]], [1.45, [545, 1040, 1.88]], [HIT.brake2, [528, 1040, 1.92]], [3.0, [520, 1044, 1.88]],
    [line('L02').t, [500, 1046, 1.85]], [HIT.zoom[0], [490, 1046, 1.8]], [HIT.zoom[0] + 1, [490, 1046, 1.8]]])(t);
  const sh = decay(t, [HIT.brake], 9) + .7 * decay(t, [HIT.brake2], 9);
  return { cx: cx + 7 * Math.sin(t * 47) * sh, cy: cy + 5 * Math.sin(t * 39) * sh, z };
}
const TITLE = [{ text: 'TAIL', y: 330, px: 220, fill: C.lemon, shadow: C.ink, t0: HIT.words[0] }, { text: 'FIRST?!', y: 545, px: 200, fill: C.cream, shadow: C.berryD, t0: HIT.words[1] }];
function sHook(c, t, o = {}) {
  look(c, hookCam(t), () => gardenWorld(c, t, { ls: loupeHook(t), zs: zipHook(t) }));
  const wob = [HIT.brake, HIT.brake2].reduce((a, h) => a + (t > h ? Math.sin((t - h) * 16) * Math.exp(-(t - h) * 5) * .06 : 0), 0);
  if (!o.noTitle) hookTitle(c, TITLE, t, { gone: ss(seg(t, HIT.titleOut[0], HIT.titleOut[1])), cy: 430, wob });
}

/* ================= KÍNH LỚN (4,25–12,65 s): bay lùi, đứng yên, soi chậm ================= */
function lensBig(t) {
  const big = ss(seg(t, HIT.zoom[0], HIT.zoom[1])), cam = hookCam(t), L0 = loupeHook(Math.min(t, HIT.zoom[0])), st = toScreen(cam, L0.x, L0.y);
  const sh = decay(t, [HIT.lbrake], 9) * 4;
  const bx = 540 + 12 * Math.sin(t * 1.3) + sh * Math.sin(t * 50), by = 700 + 10 * Math.sin(t * 1.7), br = 312 + 6 * Math.sin(t * 2.1);
  const hop = Math.sin(Math.PI * seg(t, HIT.zoom[0], HIT.zoom[1])) * 120;
  return { x: lerp(st[0], bx, big), y: lerp(st[1], by, big) - hop, r: lerp(ML.r * cam.z, br, big), big };
}
// độ phóng trong kính: thân Zip nghiêng (bay lùi) → đứng yên, quay mặt ra → soi chậm (sải cánh to)
const MAG = K([[HIT.zoom[0], [1.0]], [HIT.zoom[1], [1.1]], [HIT.lback[1], [1.1]], [HIT.turn[1], [1.26]], [HIT.slow[0], [1.28]], [HIT.slow[1] + .3, [1.35]], [HIT.snap, [1.39]]]);
function lensFocus(t, zs) {
  const p = zipCenter(zs), x0 = zipCenter(zipLens(HIT.lback[0]))[0];
  const g = t < HIT.lback[0] ? 0 : (p[0] - x0) * .45 * (1 - ss(seg(t, HIT.lback[1], HIT.lback[1] + .7)));   // kính theo chậm hơn Zip khi bay lùi
  return [p[0] - g, p[1], MAG(t)[0]];
}
function lensMap(t, L, zs) { const [fx, fy, mag] = lensFocus(t, zs), S = lerp(1, mag, L.big) * hookCam(HIT.zoom[0]).z; return { S, fx, fy, map: p => [L.x + S * (p[0] - fx), L.y + S * (p[1] - fy)] }; }
// đầu cánh (toạ độ rig) theo đúng công thức của ZIP12 trong props.js
function wingPt(zs, t, sd, front, f = .8) {
  const P = zipPose(zs, t), a = P.amp * P.beat * Math.sin(P.flap + (front ? 0 : Math.PI * P.cs));
  const u = [sd * Math.cos(a), -Math.sin(a) * .9 - .16, front ? .12 : -.18], n = Math.hypot(...u), base = [sd * .14, -.72 - P.lift, front ? .22 : -.02];
  return [base[0] + u[0] / n * 1.55 * f, base[1] + u[1] / n * 1.55 * f + (front ? 0 : 0), base[2] + u[2] / n * 1.55 * f + (front ? .15 : -.15)];
}
function sLens(c, t) {
  const L = lensBig(t), zs = zipLens(t), ls = loupeHook(Math.min(t, HIT.zoom[0] - .01)), M = lensMap(t, L, zs), sl = ss(seg(t, HIT.slow[0], HIT.slow[1]));
  look(c, hookCam(t), () => gardenWorld(c, t, { zs: L.big < .3 ? zs : null }));   // kính lớn đã che: Zip chỉ còn trong kính
  const talk = talkAt(t), name = t > HIT.lbrake && t < HIT.lbrake + .45 ? 'surprised' : talk ? 'explaining' : t > HIT.happy ? 'laugh' : 'happy';
  loupe(c, L.x, L.y, L.r, {
    E: ex(BY.loupe, name, { talk, look: L.big > .5 ? [.15, -.35] : [.75, .1], blink: talk ? 0 : blinkAt(t) }), rot: lerp(ls.rot, -.05, L.big), pose: ARM.peer,
    inside: L.big > .02 ? cc => {
      cc.translate(L.x, L.y); cc.scale(M.S, M.S); cc.translate(-M.fx, -M.fy);
      lensBackdrop(cc, t, M.fx, M.fy);
      if (sl > 0) { cc.fillStyle = `rgba(12,74,92,${.5 * sl})`; cc.fillRect(M.fx - 2000, M.fy - 2000, 4000, 4000); }   // soi chậm: mặt kính tối lại cho cánh nổi
      drawZip(cc, zs, t);
    } : null,
  });
  if (L.big < .9) return;
  const R = L.r * .86;
  c.save(); c.beginPath(); c.arc(L.x, L.y, R, 0, TAU); c.clip();
  // đứng yên: đường chấm chấm ngang qua thân, không nhúc nhích
  const st = ss(seg(t, HIT.still, HIT.still + .3)) * (1 - ss(seg(t, HIT.slow[0], HIT.slow[1] + .2)));
  if (st > 0) { const p = M.map(zipCenter(zs)); levelLine(c, L.x - R, L.x + R, p[1] + 6, st, t); }
  // soi chậm: mũi tên trên đầu cánh, đổi chiều mỗi nửa nhịp cánh
  if (sl > .5) {
    // mũi tên chỉ VỊ TRÍ của cánh: quanh đỉnh "cánh trước lên" (ph = 0) thì ▲ chanh trên cánh trước, ▼ hồng trên cánh sau; đổi khi cánh qua ngang (ph = .25, .75)
    const ph = ((t - SLOW.t0) / SLOW.cyc % 1 + 1) % 1, frontUp = ph < .25 || ph >= .75;
    const q4 = (t - SLOW.t0 + SLOW.cyc / 4) / (SLOW.cyc / 2), u = q4 - Math.floor(q4), pop = back(clamp(u / .3), 2.4), a = (sl - .5) * 2;
    for (const sd of [-1, 1]) for (const front of [true, false]) {
      const up = front ? frontUp : !frontUp, q = M.map(rigPt(zs.x, zs.y, zs.k || ZK, zs.yaw, zs.lean || 0, wingPt(zs, t, sd, front, .72)));
      strokeArrow(c, q[0] + sd * 10, q[1] + (up ? -58 : 58), up, 46 * pop, front ? D.front : D.back, a);
    }
  }
  c.restore();
  // chữ trên kính (toạ độ khung, phía trên mặt kính)
  // chữ đủ lâu để đọc (readcheck): BACKWARDS! 4,95–7,18 · STILL! 7,15–9,15 · SLOW-MO từ 9,13
  if (t > 4.93 && t < 7.18) popText(c, 'BACKWARDS!', 540, 300, 128, C.lemon, C.ink, t, 4.95, { step: .025, sh: 9 });
  if (t > 7.15 && t < 9.15) popText(c, 'STILL!', 540, 300, 150, C.cream, C.berryD, t, 7.17, { step: .04, sh: 10 });
  if (t > 9.11) {
    const p = back(seg(t, 9.13, 9.43), 2);
    c.save(); c.translate(540, 262); c.scale(p, p); c.rotate(-.04);
    rrect(c, -190, -58, 380, 116, 58, 'rgba(30,27,58,.35)'); rrect(c, -196, -66, 380, 116, 58, D.ink);
    c.restore();
    popText(c, 'SLOW-MO', 534, 262 + 30, 84, C.mint, null, t, 9.15, { step: .02 });
  }
}

/* ================= SỔ (13,3–16,35 s) ================= */
const SLOT = { x: 270, y: 470, r: 140 }, PAGE = { x: 84, y: 200, w: 890, h: 650 }, DIVE = { x: 770, y: 760 }, MINI = { x: 870, y: 745, r: 74 }, AL = { x: 250, y: 1450, k: 240 };
function stickerArt(cc) { cc.fillStyle = '#BFE07A'; cc.fillRect(-120, -120, 240, 240); drawChar(cc, ZIP12, { x: 25, y: 60, k: 58, yaw: -.5, showFx: false, expr: ex(BY.zip, 'excited'), pose: { lift: .25, beat: 1, flap: 2, blur: 1 } }); }
function miniArt(cc) { drawChar(cc, ZIP12, { x: 25, y: 44, k: 40, yaw: -1.2, showFx: false, expr: ex(BY.zip, 'laugh'), pose: { lift: .2, blur: 1 } }); }
function albumZip(t) {
  if (t < HIT.zipIn[0] || t >= HIT.reverse[1]) return null;
  const s = { x: 650, y: 1085, k: 96, yaw: -1.2, lean: 0, lift: .3, fly: 1, blur: 1, E: zipE('happy', t, { look: [-.8, .2] }), wind: null };
  if (t < HIT.zipIn[1]) { const u = eo(seg(t, HIT.zipIn[0], HIT.zipIn[1])), p = arc([1250, 960], [650, 1085], u, 80); s.x = p[0]; s.y = p[1]; s.blur = 0; s.wind = [1 - u, -1]; s.E = zipE('excited', t, { look: [-.8, .1] }); return s; }
  if (t < HIT.reverse[0]) { s.y = 1085 + 3 * Math.sin(t * 9); s.peek = -.8 * ss(seg(t, HIT.reverse[0] - .45, HIT.reverse[0] - .1)); return s; }   // đứng yên cho Albie đếm chân; ngó ra sau trước khi lùi
  const u = eio(seg(t, HIT.reverse[0], HIT.reverse[1])); s.x = lerp(650, DIVE.x, u); s.y = lerp(1085, DIVE.y + 40, u) - 60 * Math.sin(Math.PI * u); s.k = lerp(96, 26, u);
  s.lean = -.55 * ss(u * 2); s.blur = 0; s.peek = -.8; s.wind = [Math.sin(Math.PI * u), 1]; s.E = zipE('laugh', t);
  return s;
}
function sAlbum(c, t) {
  const push = 1 + .05 * Math.sin(Math.PI * seg(t, HIT.gulp - .05, HIT.gulp + .6));
  c.save(); c.translate(540, 700); c.scale(push, push); c.translate(-540, -700);
  ground(c, C.mint); ell(c, 200, 1760, 900, 420, 0, C.mintL); ell(c, 540, 1730, 980, 330, 0, C.leaf); ell(c, 540, 1770, 900, 280, 0, C.leafD);
  rrect(c, PAGE.x + 12, PAGE.y + 18, PAGE.w, PAGE.h, 54, C.grape); rrect(c, PAGE.x, PAGE.y, PAGE.w, PAGE.h, 54, C.cream);
  const t0 = HIT.stamp;
  circle(c, SLOT.x, SLOT.y, 142, '#EBDDBC');
  if (t >= HIT.zoomOut[0]) {
    const p = t >= t0 ? back(seg(t, t0, t0 + .22), 2.6) : 1;
    badge(c, SLOT.x, SLOT.y, SLOT.r, C.skyL, cc => { const k = SLOT.r / 100; cc.scale(k, k); stickerArt(cc); }, -.05, t >= t0 ? lerp(1.2, 1, p) : 1);
    popText(c, 'Flies', 455, 395, 104, C.berry, null, t, t0 + .1, { align: 'left', step: .02 });
    popText(c, 'backwards!', 455, 500, 84, C.berry, null, t, t0 + .16, { align: 'left', step: .016 });
    popText(c, 'and hovers', 455, 585, 56, C.ink, null, t, t0 + .26, { align: 'left', step: .012, font: subFont });
  }
  const rq = seg(t, HIT.gulp, HIT.gulp + .8);
  if (rq > 0 && rq < 1) for (let k = 0; k < 3; k++) { const q = clamp(rq * 1.4 - k * .2); if (q > 0 && q < 1) { c.strokeStyle = `rgba(60,200,255,${.9 * (1 - q)})`; c.lineWidth = 12 * (1 - q) + 2; c.beginPath(); c.ellipse(DIVE.x, DIVE.y, 60 + 230 * q, 26 + 80 * q, 0, 0, TAU); c.stroke(); } }
  if (t >= HIT.mini) badge(c, MINI.x, MINI.y, MINI.r, '#BFE07A', miniArt, .06, back(seg(t, HIT.mini, HIT.mini + .3), 2.6));
  const talk = talkAt(t, 'albie'), z = albumZip(t);
  shadow(c, AL.x + 18, AL.y + 4, 220, .18);
  albumGulp(c, t, { x: AL.x, y: AL.y, k: AL.k, talk, line: line('L06'), counts: HIT.counts, tg: HIT.gulp, look: z ? [.8, -.3] : [.6, -.6], blink: talk ? 0 : blinkAt(t, .4) });
  if (z) drawZip(c, z, t);
  c.restore();
}

/* ================= GAG (16,85–24 s): Miss Loupe đi lùi, đụng Albie; câu hỏi; vòng lặp ================= */
function albieGag(t) {
  if (t >= HIT.albieOut[1]) return null;
  const s = { x: AB.x + 24 * ss(seg(t, HIT.bump, HIT.bump + .2)), k: AB.k, yaw: -.42, hop: 0, tilt: 0, tabsUp: 0, page: null, curl: .3, E: null };   // bị đụng: nảy sang phải một chút
  const talk = talkAt(t, 'albie'), seen = ss(seg(t, HIT.notice, HIT.notice + .2)), bump = t > HIT.bump ? Math.exp(-(t - HIT.bump) * 3.2) : 0;
  s.hop = .04 * Math.abs(Math.sin(t * 2.4)) + .15 * Math.sin(Math.PI * seg(t, HIT.notice, HIT.notice + .3)) + .3 * Math.sin(Math.PI * seg(t, HIT.bump, HIT.bump + .35));
  s.tilt = .16 * Math.sin((t - HIT.bump) * 13) * bump + .08 * Math.sin(Math.PI * seg(t, HIT.bump, HIT.bump + .25));
  if (t > HIT.notice && t < HIT.bump + .1) { s.page = [.75, -1.75, -.55]; s.tabsUp = seen; }
  if (talk) s.page = [.85, -1.45 + .1 * Math.sin(t * 9), -.5];
  const name = t < HIT.notice ? 'happy' : t < HIT.bump + .2 ? 'surprised' : talk ? 'explaining' : t < HIT.albieOut[0] ? 'laugh' : 'excited';
  s.E = ex(BY.albie, name, { talk, look: t < HIT.notice ? [-.7, -.4] : t < line('L09').t ? [-.8, -.1] : [.2, 0], blink: talk ? 0 : blinkAt(t, .4) });
  if (t >= HIT.albieOut[0]) {                                // nhảy ra khỏi khung bên phải, hai bước
    const u = seg(t, HIT.albieOut[0], HIT.albieOut[1]), h = u < .5 ? Math.sin(Math.PI * u * 2) : Math.sin(Math.PI * (u - .5) * 2);
    s.x = lerp(AB.x + 24, 1010, eio(u)); s.hop = .55 * h; s.tilt = .1 * h; s.yaw = lerp(-.42, .5, ss(u * 3));
  }
  return s;
}
function drawAlbie(c, s, t) {
  shadow(c, s.x + 10, GY + 2, 95, .2);
  albieAt(c, s.x, GY, s.k, { yaw: s.yaw, E: s.E, hop: s.hop, tilt: s.tilt, tabsUp: s.tabsUp, page: s.page, curl: s.curl });
  // góc sách bọc vàng lấp lánh đúng chữ "corners"
  const g = seg(t, HIT.glint, HIT.glint + .7);
  if (g > 0 && g < 1) for (const cp of [[.75, -2.0, .22], [.75, -.02, .22], [-.75, -2.0, .22], [-.75, -.02, .22]]) {
    const p = rigPt(s.x, GY - s.hop * s.k, s.k, s.yaw, 0, cp), a = Math.sin(Math.PI * g);
    star(c, p[0], p[1], 26 * a, C.lemon); circle(c, p[0], p[1], 6 * a, C.white);
  }
}
function loupeGag(t) {
  const L9 = line('L09'), talk = talkAt(t), sb = seg(t, HIT.stepsBack[0], HIT.stepsBack[1]);
  // bước lùi: ba bước theo tiếng "bíp" (mỗi bước nhích một đoạn), rồi bước cuối chạm Albie
  const steps = [HIT.stepsBack[0], ...HIT.beeps.slice(1), HIT.bump - .12], nStep = steps.filter(s => t >= s).length;
  const stepU = nStep ? seg(t, steps[nStep - 1], steps[nStep - 1] + .22) : 0;
  let x = 230 + (ML.x - 230) * Math.min(1, ((nStep ? nStep - 1 : 0) + ss(stepU)) / steps.length);
  if (sb <= 0) x = 230;
  const bump = t > HIT.bump ? Math.exp(-(t - HIT.bump) * 4) : 0, kick = Math.sin(Math.PI * seg(t, HIT.bump, HIT.bump + .3));
  x -= 34 * ss(seg(t, HIT.bump, HIT.bump + .2)) * (1 - ss(seg(t, HIT.albieOut[0] + .1, HIT.albieOut[1] + .2)));   // nảy ra, đứng cách Albie; về chỗ cũ khi Albie đi
  const lift = nStep && sb < 1 ? Math.sin(Math.PI * stepU) : 0;
  const [, wy] = mlLens(x), raise = 0;
  let name = 'happy', look_ = [-.75, -.6], pose = ARM.peer, rot = -.06 + .03 * Math.sin(t * 1.7);
  if (t < line('L07').t + line('L07').dur) { name = talk ? 'excited' : 'happy'; pose = talk ? (t > line('L07').t + 1.2 ? ARM.up : ARM.wave) : ARM.peer; }
  else if (t < HIT.bump) { name = 'confident'; look_ = [-.8, -.5]; rot = .05 * Math.sin(t * 14) * lift + .06; pose = ARM.shrug; }
  else if (t < HIT.bump + .45) { name = 'surprised'; look_ = [.9, -.1]; pose = ARM.up; rot = -.18 * kick; }
  else if (t < L9.t - .1) { name = 'shy'; look_ = [.85, .2]; pose = ARM.shrug; }
  else if (t < L9.t + L9.dur + .2) { name = talk ? 'explaining' : 'happy'; look_ = [.1, .1]; pose = ARM.point; }
  else { name = 'happy'; look_ = [.9, 0]; pose = ARM.peer; }
  const E = ex(BY.loupe, name, { talk, look: look_, blink: talk ? 0 : blinkAt(t), fx: name === 'shy' });
  const o = { x: x + 4 * Math.sin(t * 40) * bump, y: wy - 16 * lift - 22 * kick, r: ML.r, rot, pose, E };
  // về đúng dáng của khung đầu
  const k = ss(seg(t, DUR - 1.0, DUR - .5));
  if (k > 0) { const h = loupeHook(t - DUR); o.x = lerp(o.x, h.x, k); o.y = lerp(o.y, h.y, k); o.rot = lerp(o.rot, h.rot, k); if (k > .5) { o.E = h.E; o.pose = h.pose; } }
  return o;
}
function gagCam(t) {
  const d = seg(t, HIT.flip[1], DUR), toBump = ss(seg(t, HIT.stepsBack[0] - .3, HIT.bump)), q = ss(seg(t, line('L09').t - .3, line('L09').t + .5));
  const shake = decay(t, [HIT.bump], 8);
  const cx = 395 + 25 * toBump + 10 * Math.sin(d * 2.4) + 40 * q, cy = 1046 - 4 * d - 10 * toBump, z = 1.76 + .08 * toBump - .04 * q;
  const k = ss(seg(t, DUR - 1.3, DUR - .5)), h = hookCam(t - DUR);
  return { cx: lerp(cx, h.cx, k) + 7 * Math.sin(t * 47) * shake, cy: lerp(cy, h.cy, k) + 5 * Math.sin(t * 41) * shake, z: lerp(z, h.z, k) };
}
function sGag(c, t, o = {}) {
  const cm = gagCam(t), ls = loupeGag(t), ab = albieGag(t), zs = zipGag(t);
  look(c, cm, () => gardenWorld(c, t, {
    ab, ls, zs,
    after: cc => {
      const p = toScreen(cm, 0, 0);
      if (t > HIT.bump && t < HIT.bump + 1) { const L = ls; bumpStars(cc, L.x + 70, L.y + 150, seg(t, HIT.bump, HIT.bump + 1)); }
    },
  }));
  if (!o.noText && t > HIT.bump - .02 && t < HIT.bump + 2.05) {
    const pu = 1 + .14 * Math.sin(Math.PI * seg(t, HIT.bump, HIT.bump + .25));
    c.save(); c.translate(640, 250); c.scale(pu, pu); c.rotate(.06 * Math.sin((t - HIT.bump) * 25) * Math.exp(-(t - HIT.bump) * 3)); c.translate(-640, -250);
    popText(c, 'BONK!', 640, 300, 150, C.lemon, C.ink, t, HIT.bump, { step: .03, sh: 10 }); c.restore();
  }
}

/* ---------- chuyển cảnh ---------- */
function matchCut(c, t) {
  stickerMatchCut(c, t, { t0: HIT.zoomIn[0], t1: HIT.zoomOut[0], t2: HIT.zoomOut[1], lens: lensBig(HIT.zoomIn[0]), from: cc => sLens(cc, HIT.zoomIn[0]), to: (cc, tt) => sAlbum(cc, tt), slot: SLOT, fill: C.skyL, draw: cc => { cc.scale(SLOT.r / 100, SLOT.r / 100); stickerArt(cc); } });
}
function recallTitle(c, t) { hookTitle(c, TITLE, -1, { gone: 1 - back(seg(t, HIT.recall, HIT.recall + .32), 2.4), cy: 430 }); }
function pageFlip(c, t) {
  const u = ss(seg(t, HIT.flip[0], HIT.flip[1])), w = 1080 * (1 - u);
  sGag(c, Math.max(t, HIT.flip[1]));
  c.save(); c.beginPath(); c.rect(0, 0, w, 1920); c.clip(); sAlbum(c, t); c.restore();
  c.fillStyle = 'rgba(30,27,58,.22)'; c.fillRect(w, 0, 34 * (1 - u), 1920);
  rrect(c, w - 60 * Math.sin(Math.PI * u), 0, 60 * Math.sin(Math.PI * u) + 2, 1920, 0, C.cream);
}

export function drawFilm(c, t) {
  t = clamp(t, 0, DUR - .001);
  c.save();
  if (t >= HIT.flip[1]) sGag(c, t);
  else if (t >= HIT.flip[0]) pageFlip(c, t);
  else if (t >= HIT.zoomOut[1]) sAlbum(c, t);
  else if (t >= HIT.zoomIn[0]) matchCut(c, t);
  else if (t >= HIT.zoom[0]) { sLens(c, t); if (t >= HIT.snap) snapFlash(c, t, HIT.snap, lensBig(t)); }
  else sHook(c, t);
  if (t >= HIT.recall) recallTitle(c, t);
  const l = CARDS.find(x => t >= x.t0 && t < x.t1);
  if (l) subtitle(c, l, t, 495, SAFE.subY);                       // tâm 495: tấm hai dòng rộng nhất vẫn dừng trước cột nút phải (x 940)
  c.restore();
}
// cho poster.js và sheets.js
export { zipHook, zipLens, drawZip, gardenWorld, hookCam, loupeHook, TITLE };
