// <TẬP> · film (chuẩn 11/2026b) — mọi khung hình là hàm thuần của t. Khung tối thiểu: thay bằng cảnh, nhân vật, đạo cụ của tập.
// Giữ các điểm của chuẩn mới (QUALITY.md §8): nhân vật v2 + mặt luôn vui; chữ móc hookStack ở giữa phía trên; nhân vật đứng dưới chữ trong 3 s đầu;
// mỗi 2–4 s một thay đổi hình có mục đích (máy quay qua look(), kính qua loupe(…, { mag, pan }) để qa đo được); phụ đề có từ nhấn (subtitle tự gọi
// subtitleEm khi tấm có em); biểu cảm theo kiểu hát (hát trọn: excited · nửa hát: happy · sing-talk / nói: explaining).
import { LOOK } from '/_shared/characters/look.js';
LOOK.v = 2;            // phong cách nhân vật v2
LOOK.cheer = true;     // mặt nhân vật luôn vui tươi
import { C, ground, seg, lerp } from '/_shared/kit.js';
import { BY } from '/_shared/characters/cast/index.js';
import { makeTalk, blinkAt, ex, look, loupe, ARM, shadow, subtitle, hookTitle, hookStack, SAFE } from '/_shared/episode.js';
import { LINES, CARDS, DUR, HIT } from './timeline.js';
import { ss } from '/core/lib.js';

const T = makeTalk(LINES);
export const setEnv = T.setEnv;
const HOOK = hookStack([{ text: '<CHỮ>', px: 172, fill: C.lemon, shadow: C.ink, t0: HIT.words[0] }, { text: '<MÓC?!>', px: 210, fill: C.cream, shadow: C.berryD, t0: HIT.words[1] }], 'mid');
const lineAt = t => LINES.find(l => t >= l.t && t < l.t + l.dur);
const exprFor = t => { const l = lineAt(t), m = l && l.sung ? l.sung.mode : 'speak'; return m === 'sing' ? 'excited' : m === 'half-sing' ? 'happy' : 'explaining'; };

function cam(t) {   // máy quay: thay bằng các cú máy của SHOTS (đẩy, lùi, lia, cận); trong móc hạ cảnh để nhân vật đứng dưới chữ
  const dy = 95 * (1 - ss(seg(t, HIT.titleOut[0], HIT.titleOut[1] + .5)));
  return { cx: 540, cy: 1000 - dy + 20 * Math.sin(t * .4), z: 1.25 + .02 * Math.sin(t * .3) };
}
function world(c, t) {
  ground(c, C.skyL);
  const talk = T.talkAt(t), lx = 640, ly = 900;
  shadow(c, lx, 1240, 110);
  loupe(c, lx, ly, 108, { E: ex(BY.loupe, talk ? exprFor(t) : 'happy', { talk, blink: blinkAt(t) }), pose: talk ? ARM.point : {} });
}
export function drawFilm(c, t) {
  t = Math.max(0, Math.min(t, DUR - .001));
  c.save();
  look(c, cam(t), () => world(c, t));
  hookTitle(c, HOOK.lines, t, { gone: ss(seg(t, HIT.titleOut[0], HIT.titleOut[1])), cy: HOOK.cy });
  if (t >= HIT.recall) hookTitle(c, HOOK.lines, -1, { gone: 1 - ss(seg(t, HIT.recall, HIT.recall + .32)), cy: HOOK.cy });
  const card = CARDS.find(x => t >= x.t0 && t < x.t1);
  if (card) subtitle(c, card, t, 500, SAFE.subY);
  c.restore();
}
