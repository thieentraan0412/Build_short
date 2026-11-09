// Vùng an toàn của YouTube Shorts (QUALITY.md §5) và "người nói có trên hình" (QUALITY.md §3).
//   node _shared/tools/safezone.mjs films/<tập> [--out <file>] [--step 0.25]
// Mở trang của tập (khung 1080×1920), ở mỗi bước thời gian vẽ lại phim một lần và gom:
//   - chữ trên hình: REC của _shared/kit.js (giống window.TEXTS; chữ trong kính không tính);
//   - mặt nhân vật: FACES của _shared/characters/stage.js (tâm, bán kính, tên nhân vật);
//   - tấm phụ đề: SUB của _shared/episode.js (tập có hàm phụ đề riêng, như SHORT-001, thì không đo được).
// Ghi <film>/out/safezone.json (hoặc --out): mỗi bước một dòng { t, texts, faces, sub }, cùng các đoạn vi phạm đã gộp.
// _shared/qa.py đọc file này. Chỉ đo, không đổi hình. Vùng che là ước lượng: thật sự khác theo máy và phiên bản ứng dụng.
import fs from 'fs'; import path from 'path';
import { openDemo, closeServer, requireDemo } from '../../core/render/page.mjs';

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const dir = args[0]; requireDemo(dir);
const OUT = opt('--out', path.join(dir, 'out', 'safezone.json')), STEP = +opt('--step', .25);
const SAFE = { top: 150, bottom: 1530, subBottom: 1500, right: 940, rightY: [880, 1780] };   // giống SAFE trong _shared/episode.js

const { browser, page } = await openDemo(dir, { w: 1080, h: 1920 });
const frames = await page.evaluate(async ({ STEP }) => {
  const K = await import('/_shared/kit.js'), S = await import('/_shared/characters/stage.js');
  let E = null; try { E = await import('/_shared/episode.js'); } catch (e) { }
  const out = [], r1 = v => Math.round(v * 10) / 10;
  for (let t = 0; t < window.DUR - 1e-6; t += STEP) {
    S.FACES.on = true; S.FACES.list = []; if (E) { E.SUB.on = true; E.SUB.box = null; }
    const texts = (window.TEXTS ? window.TEXTS(t) : (window.render(t), [])) || [];
    S.FACES.on = false; if (E) E.SUB.on = false;
    out.push({
      t: Math.round(t * 1000) / 1000,
      texts: texts.map(b => ({ text: String(b.text).slice(0, 40), x0: r1(b.x0), y0: r1(b.y0), x1: r1(b.x1), y1: r1(b.y1) })),
      faces: S.FACES.list.filter(f => f.r >= 12 && f.x > -f.r && f.x < 1080 + f.r && f.y > -f.r && f.y < 1920 + f.r).map(f => ({ who: f.who, x: r1(f.x), y: r1(f.y), r: r1(f.r), ...(f.clip && { clip: true }) })),
      sub: E && E.SUB.box ? { x0: r1(E.SUB.box.x0), y0: r1(E.SUB.box.y0), x1: r1(E.SUB.box.x1), y1: r1(E.SUB.box.y1) } : null,
    });
  }
  return out;
}, { STEP });
await browser.close(); closeServer();

// ---------- vùng che ----------
const inRightCol = (x, y) => x > SAFE.right && y > SAFE.rightY[0] && y < SAFE.rightY[1];
const faceZone = f => f.y < SAFE.top ? 'trên' : f.y > SAFE.bottom ? 'dưới' : inRightCol(f.x, f.y) ? 'cột nút phải' : null;
const area = (a) => Math.max(0, a.x1 - a.x0) * Math.max(0, a.y1 - a.y0);
const inter = (a, b) => area({ x0: Math.max(a.x0, b.x0), y0: Math.max(a.y0, b.y0), x1: Math.min(a.x1, b.x1), y1: Math.min(a.y1, b.y1) });
const ZONES = { 'trên': { x0: 0, y0: 0, x1: 1080, y1: SAFE.top }, 'dưới': { x0: 0, y0: SAFE.bottom, x1: 1080, y1: 1920 }, 'cột nút phải': { x0: SAFE.right, y0: SAFE.rightY[0], x1: 1080, y1: SAFE.rightY[1] } };
const textZone = b => { const A = area(b) || 1; for (const [k, z] of Object.entries(ZONES)) if (inter(b, z) / A > .5) return k; return null; };   // > 50 % khung chữ nằm trong vùng che (chữ to ở giữa phía trên vẫn đọc được: biểu tượng của thanh trên nằm ở góc phải)
const subZone = s => s.y1 > SAFE.subBottom ? 'dưới' : (s.x1 > SAFE.right && s.y1 > SAFE.rightY[0] && s.y0 < SAFE.rightY[1]) ? 'cột nút phải' : null;
const covers = (s, f) => f.x > s.x0 - .5 * f.r && f.x < s.x1 + .5 * f.r && f.y > s.y0 - .5 * f.r && f.y < s.y1 + .5 * f.r;   // tâm mặt nằm dưới tấm phụ đề

// gộp các bước liên tiếp có cùng khoá thành đoạn [t0, t1]
function spans(hits) {
  const by = {}; for (const h of hits) (by[h.key] ??= { ...h, ts: [] }).ts.push(h.t);
  const out = [];
  for (const g of Object.values(by)) {
    let a = g.ts[0], b = a;
    for (const t of g.ts.slice(1).concat([Infinity])) { if (t - b > STEP * 1.5) { out.push({ kind: g.kind, who: g.who, zone: g.zone, t0: a, t1: Math.round((b + STEP) * 1000) / 1000 }); a = t; } b = t; }
  }
  return out.sort((x, y) => x.t0 - y.t0);
}
const hits = [];
for (const F of frames) {
  const big = F.faces.filter(f => !f.clip && f.r >= 30);   // mặt đủ lớn để đọc biểu cảm, vẽ thẳng trên cảnh (mặt phóng to trong kính bị mặt kính cắt)
  for (const f of big) { const z = faceZone(f); if (z) hits.push({ key: `face|${f.who}|${z}`, kind: 'mặt', who: f.who, zone: z, t: F.t }); }
  for (const b of F.texts) { const z = textZone(b); if (z) hits.push({ key: `text|${b.text}|${z}`, kind: 'chữ', who: b.text, zone: z, t: F.t }); }
  if (F.sub) {
    const z = subZone(F.sub); if (z) hits.push({ key: `sub|${z}`, kind: 'phụ đề', who: '', zone: z, t: F.t });
    for (const f of big) if (covers(F.sub, f)) hits.push({ key: `cover|${f.who}`, kind: 'phụ đề che mặt', who: f.who, zone: '', t: F.t });
  }
}
const issues = spans(hits);
const res = { film: path.basename(path.resolve(dir)), step: STEP, safe: SAFE, subMeasured: frames.some(F => F.sub), issues, frames };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(res));
const long = issues.filter(i => i.t1 - i.t0 >= .5);
console.log(`safezone · ${res.film} · ${frames.length} bước · ${long.length} đoạn ≥ 0,5 s trong vùng che${res.subMeasured ? '' : ' · phụ đề: không đo được (hàm phụ đề riêng)'} → ${OUT}`);
for (const i of long) console.log(`  ${i.t0.toFixed(2)}–${i.t1.toFixed(2)} s  ${i.kind}${i.who ? ' ' + i.who : ''}${i.zone ? ' · vùng ' + i.zone : ''}`);
