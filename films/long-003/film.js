// LONG-003 · Lost at Night! How Do Bugs Find Their Way Home? — mọi khung hình là hàm thuần của t (16:9, 1920×1080).
// Ráp các cảnh: móc (Miss Loupe trên viên tròn) → cả đội → tựa → bản đồ, lập đội → 5 cách tìm đường (mặt trời · đường mùi · đếm bước ·
// Dải Ngân Hà · ánh lóe và mật mã) xen hai lần cắt sang Miss Loupe → rìa vườn, The Giant → đường về, bản đồ sáng → Six Legs Song →
// thông điệp → "Did you spot Spindle?" → gag cuối, gợi lại móc, lật sang trang ao. Cảnh ở scenes.js, đạo cụ ở props.js.
import { LOOK } from '/_shared/characters/look.js';
LOOK.v = 2;          // (11/2026) nhân vật v2 "Kẹo Phẳng Viền"
LOOK.cheer = true;   // (14/11/2026) mặt nhân vật luôn vui tươi (QUALITY.md, "Vui tươi")
import { C, clamp, lerp, seg, ss, ei, back, H, DUR, cardAt, subtitle16, lensIris, glowIris, whip, inked, TAU, setEnv as _setEnv } from './lib16.js';
import { hookScene, sTeam, sTitle, sMap, sCrew, sSun, sLp1, sAnts, sMarch, sEdge0, sThink, sDesert, sCount, sLp2, sStars, sSky, sTrack, sTelly, sBino, sSignal,
  sEdge, sPov, sPlace, sFound, sWay, sHome, sGlow, sSong, sMsg, sSpot, sBye, quizIcon, hookSpindleScreen, lp1Cam, SP_EDGE, SP_POV } from './scenes.js';
export const setEnv = _setEnv;

// ba khung nhỏ cho "Did you spot Spindle?" (rx, ry: chỗ Spindle trong khung 1920×1080)
const T_HOOK = 1.0, T_EDGE = () => H.s_lp1 + 2, T_POV = () => H.waveAll + .5;
const MINIS = () => {
  const k = lp1Cam(T_EDGE()), [hx, hy] = hookSpindleScreen(T_HOOK);
  return [
    { draw: c => hookScene(c, T_HOOK, { noTitle: true }), rx: hx, ry: hy },
    { draw: c => sLp1(c, T_EDGE()), rx: 960 + (SP_EDGE.x - k.cx) * k.z, ry: 540 + (SP_EDGE.y - k.cy) * k.z },
    { draw: c => sPov(c, T_POV()), rx: SP_POV.x, ry: SP_POV.y + 40 },
  ];
};
let minis = null;
const spot = (c, t) => sSpot(c, t, minis || (minis = MINIS()));

// chuyển cảnh: khi Miss Loupe còn lạc, cửa sổ là đốm sáng của Blink lớn dần (glowIris); khi cô đã về, kính của cô trở lại (lensIris)
const GLOW = [['s_sun', sCrew, sSun, 1000, 600], ['s_lp1', sSun, sLp1, 760, 700], ['s_ants', sLp1, sAnts, 1180, 420], ['s_count', sDesert, sCount, 960, 540],
  ['s_lp2', sCount, sLp2, 1300, 600], ['s_stars', sLp2, sStars, 960, 420], ['s_telly', sTrack, sTelly, 1700, 220], ['s_edge', sSignal, sEdge, 1200, 560]];
const LENS = [['s_way', sFound, sWay, 1200, 300], ['s_msg', sSong, sMsg, 1140, 520], ['s_spot', sMsg, spot, 1060, 360], ['s_bye', spot, sBye, 960, 520]];
const SCENES = [['s_team', sTeam], ['s_title', sTitle], ['s_map', sMap], ['s_crew', sCrew], ['s_sun', sSun], ['s_lp1', sLp1], ['s_ants', sAnts], ['s_march', sMarch], ['s_edge0', sEdge0],
  ['s_think', sThink], ['s_desert', sDesert], ['s_count', sCount], ['s_lp2', sLp2], ['s_stars', sStars], ['s_sky', sSky], ['s_track', sTrack], ['s_telly', sTelly], ['s_bino', sBino],
  ['s_signal', sSignal], ['s_edge', sEdge], ['s_pov', sPov], ['s_place', sPlace], ['s_found', sFound], ['s_way', sWay], ['s_home', sHome], ['s_glow', sGlow], ['s_song', sSong],
  ['s_msg', sMsg], ['s_spot', spot], ['s_bye', sBye]];

function scene(c, t) {
  if (t < H.s_team - .35) return hookScene(c, t);
  if (t < H.s_team) return whip(c, t, H.s_team - .35, H.s_team, cc => hookScene(cc, t), cc => sTeam(cc, H.s_team));
  if (t >= H.s_title - .4 && t < H.s_title) return glowIris(c, t, H.s_title - .4, H.s_title, 1040, 640, cc => sTeam(cc, t), cc => sTitle(cc, H.s_title));
  if (t >= H.s_map - .3 && t < H.s_map) return glowIris(c, t, H.s_map - .3, H.s_map, 960, 540, cc => sTitle(cc, t), cc => sMap(cc, H.s_map));
  for (const [name, from, to, x, y] of GLOW) if (t >= H[name] - .45 && t < H[name]) return glowIris(c, t, H[name] - .45, H[name], x, y, cc => from(cc, t), cc => to(cc, H[name]));
  for (const [name, from, to, x, y] of LENS) if (t >= H[name] - .45 && t < H[name]) return lensIris(c, t, H[name] - .45, H[name], x, y, 120, cc => from(cc, t), cc => to(cc, H[name]));
  let fn = sTeam;
  for (const [name, f] of SCENES) if (t >= H[name]) fn = f;
  fn(c, t);
}

// vòng mở cho trẻ: 5 ô "cách tìm đường" ở mép trên (mặt trời · đường mùi · đếm bước · sao · ánh lóe), lấp dần theo từng chương.
// Chỉ hiện ở các chương của đội; ẩn khi cắt sang Miss Loupe, trong bóng nghĩ, khi nhìn từ phía Uncle Telly và từ cao trào trở đi.
export const WAYS = ['sun', 'trail', 'steps', 'stars', 'flash'];
const FILL = () => [H.dizzy + .6, H.trailEnd + .8, H.s_lp2 - .9, H.clear + 1.0, H.slot5];
const HIDE = () => [[H.s_lp1 - .45, H.s_ants], [H.s_think, H.s_count], [H.s_lp2 - .45, H.s_stars], [H.s_sky, H.s_track], [H.s_telly - .45, H.s_signal]];
function wayHud(c, t) {
  if (t < H.s_sun || t >= H.s_edge - .45) return;
  if (HIDE().some(([a, b]) => t >= a && t < b)) return;
  const a = ss(seg(t, H.s_sun, H.s_sun + .4)) * (1 - ss(seg(t, H.s_edge - .9, H.s_edge - .45)));
  c.save(); c.globalAlpha = a;
  const x0 = 960 - 2 * 116, y = 84;
  inked(c, cc => cc.roundRect(x0 - 76, y - 58, 4 * 116 + 152, 116, 58), 'rgba(30,27,58,.55)', 0);
  FILL().forEach((tf, i) => {
    const x = x0 + i * 116, on = t >= tf, p = on ? back(seg(t, tf, tf + .35), 2.4) : 1;
    c.save(); c.translate(x, y); c.scale(p, p);
    if (on) quizIcon(c, WAYS[i], 0, 0, 44, t);
    else { inked(c, cc => cc.arc(0, 0, 44, 0, TAU), 'rgba(255,248,231,.18)', 4); c.fillStyle = 'rgba(255,248,231,.7)'; c.font = '800 44px "Baloo 2"'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(i + 1), 0, 4); }
    c.restore();
  });
  c.restore();
}

export function drawFilm(c, t, o = {}) {
  t = clamp(t, 0, DUR - .001);
  c.save();
  scene(c, t);
  wayHud(c, t);
  const card = cardAt(t); if (card && !o.noSub) subtitle16(c, card, t);
  c.restore();
}
