// Sinh phần "từng nhân vật" của CHARACTER-BIBLE.md từ bible.js (cùng nguồn với chữ trên các bảng hình).
// node _shared/characters/tools/bible.mjs  → thay nội dung giữa <!-- CAST:START --> và <!-- CAST:END -->
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
import { BIBLE, STYLE_PROMPT } from '../bible.js';
const here = path.dirname(fileURLToPath(import.meta.url)), dir = path.resolve(here, '..');
const ORDER = [['loupe', 'Miss Loupe', 1.0], ['albie', 'Albie', .55], ['crumb', 'Crumb', .12], ['flutter', 'Flutter', .24], ['chirp', 'Chirp', .2], ['waggle', 'Waggle', .15], ['blink', 'Blink', .1],
  ['dot', 'Dot', .09], ['spindle', 'Spindle', .2], ['rollo', 'Mr. Rollo', .12], ['telly', 'Uncle Telly', 1.13], ['giant', 'The Giant', null], ['smudge', 'Smudge', .15]];
const SHEET = ['1-design-sheet', '2-expression-sheet', '3-pose-action-sheet', '4-expression-pose-atlas'];
let md = '';
ORDER.forEach(([id, name, h], i) => {
  const B = BIBLE[id], n = String(i + 1).padStart(2, '0');
  md += `### ${n} · ${name}\n\n`;
  md += `${B.vi[0].toUpperCase() + B.vi.slice(1)}.\n\n`;
  md += `| | |\n|---|---|\n| **Loài / vật** | ${B.species} |\n| **Giọng** | ${B.voice} |\n| **Ra mắt** | ${B.debut} |\n`;
  md += `| **Kích thước (thang truyện)** | ${h ? `${Math.round(h * 100)}% chiều cao Miss Loupe` : 'bàn chân dài ≈ chiều cao Miss Loupe; bàn tay ≈ 75%'} |\n`;
  md += `| **Phân biệt** | ${B.distinct} |\n| **Kiểu di chuyển** | ${B.move} |\n\n`;
  md += `**Bảng màu**\n\n| Token | Mã | Dùng cho |\n|---|---|---|\n` + B.pal.map(([t, hex, u]) => `| \`${t}\` | \`${hex}\` | ${u} |`).join('\n') + '\n\n';
  md += `**Đặc điểm khóa (không được thay đổi)**\n\n` + B.locked.map((s, j) => `${j + 1}. ${s}.`).join('\n') + '\n\n';
  md += `**Bảng hình:** ` + SHEET.map((s, j) => `[${['thiết kế', 'biểu cảm', 'tư thế', 'atlas'][j]}](out/sheets/${n}-${id}-${s}.png)`).join(' · ') + ` · bản sạch cho AI: [atlas](out/clean/${n}-${id}-4-expression-pose-atlas.png)\n\n`;
  md += `**Prompt mô tả (tiếng Anh, dán kèm prompt phong cách):**\n\n> ${B.prompt}\n\n`;
});
md += `#### Prompt phong cách dùng chung\n\n> ${STYLE_PROMPT}\n`;
const f = path.join(dir, 'CHARACTER-BIBLE.md'), t = fs.readFileSync(f, 'utf8');
const a = t.indexOf('<!-- CAST:START -->'), b = t.indexOf('<!-- CAST:END -->');
if (a < 0 || b < 0) { console.error('thiếu dấu CAST:START / CAST:END'); process.exit(1); }
fs.writeFileSync(f, t.slice(0, a + 19) + '\n\n' + md + '\n' + t.slice(b));
console.log('updated', path.relative(process.cwd(), f));
