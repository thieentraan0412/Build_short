// LONG-002 · Who Snuck Into the Bug Book? A Tiny Detective Mystery — mọi khung hình là hàm thuần của t (16:9, 1920×1080).
// Ráp các cảnh: móc → tựa → hiện trường → 3 manh mối (tơ, dấu chân, cánh giấy) → tóm tắt → hàng nghi phạm LEG-O-METER → bẫy ban đêm
// → thú nhận → Albie một mình → kết vụ án, ôn bài → "Did you spot Rollo?" → gag cuối, gợi lại móc. Cảnh ở scenes.js, đạo cụ ở props.js.
import { LOOK } from '/_shared/characters/look.js';
LOOK.v = 2;          // (11/2026) nhân vật v2 "Kẹo Phẳng Viền"
LOOK.cheer = true;   // (14/11/2026) mặt nhân vật luôn vui tươi (QUALITY.md, "Vui tươi")
import { C, clamp, lerp, seg, ss, ei, H, DUR, cardAt, subtitle16, lensIris, BY, ex, loupe, ARM, talkAt, setEnv as _setEnv } from './lib16.js';
import { sHook, sTitle, sScene, sC1, sC2, sC3, sSum, sLine, sTrap, sConf, sAlone, sRecap, sRollo, sBye, dustTop, lineupWorld, AL, LP, WIDE } from './scenes.js';
import { clueSlots, clueIcon } from './props.js';
export const setEnv = _setEnv;

// chuyển cảnh trong ngữ pháp của kênh: kính của Miss Loupe lớn dần, cảnh sau nằm sẵn trong kính (0,45 s trước mốc cảnh)
const IRIS = [['s_c2', sC1, sC2, 1400, 760], ['s_c3', sC2, sC3, 760, 520], ['s_line', sSum, sLine, 1640, 650], ['s_trap', sLine, sTrap, 260, 600], ['s_recap', sAlone, sRecap, 1100, 560], ['s_bye', sRollo, sBye, 960, 560]];
const SCENES = [['s_scene', sScene], ['s_c1', sC1], ['s_c2', sC2], ['s_c3', sC3], ['s_sum', sSum], ['s_line', sLine], ['s_trap', sTrap], ['s_conf', sConf], ['s_alone', sAlone], ['s_recap', sRecap], ['s_rollo', null], ['s_bye', sBye]];

// ba khung nhỏ cho "Did you spot Rollo?" (rx, ry: chỗ Rollo trong khung 1920×1080)
const MINIS = [
  { draw: c => dustTop(c, H.rollo1 + .7), rx: 975, ry: 870 },
  { draw: c => { c.fillStyle = C.grape; lineupWorld(c, H.rollo2 + 2.0); }, rx: 1680, ry: 700 },
  { draw: c => sTrap(c, H.t_hide + 1.2), rx: 1330, ry: 740 },
];
const rollo = (c, t) => sRollo(c, t, MINIS);

function scene(c, t) {
  if (t < H.s_title - .35) return sHook(c, t);
  if (t < H.s_title) return lensIris(c, t, H.s_title - .35, H.s_title, 643, 484, 110, cc => sHook(cc, t), cc => sTitle(cc, t));
  if (t < H.s_scene - .3) return sTitle(c, t);
  if (t < H.s_scene) return lensIris(c, t, H.s_scene - .3, H.s_scene, 960, 560, 160, cc => sTitle(cc, t), cc => sScene(cc, H.s_scene));
  for (const [name, from, to, x, y] of IRIS) if (t >= H[name] - .45 && t < H[name]) return lensIris(c, t, H[name] - .45, H[name], x, y, 120, cc => (from === sRollo ? rollo : from)(cc, t), cc => (to === sRollo ? rollo : to)(cc, H[name]));
  let fn = sScene;
  for (const [name, f] of SCENES) if (t >= H[name]) fn = f || rollo;
  fn(c, t);
}

// ô manh mối "1 2 3": hiện từ khi Miss Loupe nói "Every intruder leaves clues", lấp dần, rời đi khi vào hàng nghi phạm
const FILL = () => [H.c1_slot + .6, H.c2_slot + .6, H.c3_slot + .6];
function clueHud(c, t) {
  if (t < H.slots || t >= H.s_line - .45) return;
  if (t >= H.s_c1a + .2 && t < H.s_c1b) return;                     // trang "Baby pictures" là ký ức: không có ô manh mối
  const a = ss(seg(t, H.slots, H.slots + .4)) * (1 - ss(seg(t, H.s_line - .9, H.s_line - .45)));
  clueSlots(c, t, FILL(), { a });
  FILL().forEach((tf, i) => {                                       // biểu tượng bay từ giữa khung lên ô của nó
    const u = seg(t, tf - .6, tf); if (u <= 0 || u >= 1) return;
    const e = ei(u), x = lerp(960, 790 + i * 170, e), y = lerp(540, 86, e) - Math.sin(Math.PI * u) * 120, s = lerp(150, 40, e);
    c.save(); c.translate(x, y); c.rotate((1 - e) * .6); clueIcon(c, i, 0, 0, s, t); c.restore();
  });
}

export function drawFilm(c, t, o = {}) {
  t = clamp(t, 0, DUR - .001);
  c.save();
  scene(c, t);
  clueHud(c, t);
  const card = cardAt(t); if (card && !o.noSub) subtitle16(c, card, t);
  c.restore();
}
