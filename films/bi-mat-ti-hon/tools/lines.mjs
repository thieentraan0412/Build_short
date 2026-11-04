// Xuất timeline.js ra JSON cho phần Python: voice/lines.json (tts_zh.py, asr_check.py), timeline.json (mix.py), cards.json (srt.py).
// Một nguồn duy nhất cho chữ, giọng và nhạc.
import fs from 'fs'; import path from 'path'; import { fileURLToPath, pathToFileURL } from 'url';
const here = path.dirname(fileURLToPath(import.meta.url)), film = path.resolve(here, '..');
const T = await import(pathToFileURL(path.join(film, 'timeline.js')).href);
const w = (f, o) => fs.writeFileSync(path.join(film, f), JSON.stringify(o, null, 1));
fs.mkdirSync(path.join(film, 'voice'), { recursive: true });
w('voice/lines.json', T.LINES.map(({ id, text, say, asr }) => ({ id, text, ...(say && { say }), ...(asr && { asr }) })));
w('timeline.json', { bpm: T.BPM, dur: T.DUR, secs: T.SECS, lines: T.LINES });
w('cards.json', T.CARDS);
if (T.CARD_CLASHES.length) { console.error('subtitle cards overlap:', T.CARD_CLASHES); process.exit(1); }
console.log(`voice/lines.json ${T.LINES.length} lines · timeline.json · cards.json ${T.CARDS.length} cards`);
