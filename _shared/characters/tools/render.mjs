// Xuất mọi bảng thiết kế ra PNG: node _shared/characters/tools/render.mjs [id-lọc ...] [--scale 2] [--only-labeled] [--look 1]
// Chạy từ thư mục gốc của thư viện. Bản có chữ vào out/sheets/, bản không chữ (cho AI) vào out/clean/.
// Mặc định dựng phong cách v2 (look.js); --look 1 dựng bản v1 cũ vào out/v1/sheets, out/v1/clean.
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
import { openDemo, closeServer } from '../../../core/render/page.mjs';
const here = path.dirname(fileURLToPath(import.meta.url)), dir = path.resolve(here, '..');
const args = process.argv.slice(2);
const take = k => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : null; };
const look = take('--look'), scale = +(take('--scale') || 2), onlyLabeled = args.includes('--only-labeled'), filters = args.filter(a => !a.startsWith('--'));
const { browser, page } = await openDemo(dir, { w: 1280, h: 720, q: look === '1' ? 'look=1' : '' });
const outDir = path.join(dir, 'out', look === '1' ? 'v1' : '');
const list = (await page.evaluate(() => window.SHEETS)).filter(s => !filters.length || filters.some(f => s.id.includes(f)));
for (const sub of ['sheets', 'clean']) fs.mkdirSync(path.join(outDir, sub), { recursive: true });
for (const s of list) {
  for (const clean of onlyLabeled || !s.clean ? [false] : [false, true]) {
    const t0 = Date.now();
    const data = await page.evaluate(([id, cl, sc]) => window.renderSheet(id, cl, sc), [s.id, clean, scale]);
    const f = path.join(outDir, clean ? 'clean' : 'sheets', s.file + '.png');
    fs.writeFileSync(f, Buffer.from(data.split(',')[1], 'base64'));
    console.log(path.relative(process.cwd(), f), `${s.w * scale}x${s.h * scale}`, Date.now() - t0 + 'ms');
  }
}
await browser.close(); closeServer();
