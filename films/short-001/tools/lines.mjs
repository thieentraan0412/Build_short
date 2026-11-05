// Xuất timeline.js ra JSON cho phần Python: voice/lines.json (tts.py, asr_check.py), timeline.json (mix.py), cards.json (srt.py).
// Giọng và tốc độ của từng nhân vật lấy từ _shared/voices.js, để mọi tập dùng cùng một giọng.
import fs from 'fs'; import path from 'path'; import { fileURLToPath, pathToFileURL } from 'url';
const here = path.dirname(fileURLToPath(import.meta.url)), film = path.resolve(here, '..');
const LIB = process.env.LIB || path.resolve(film, '..', '..');
const T = await import(pathToFileURL(path.join(film, 'timeline.js')).href);
const { VOICES } = await import(pathToFileURL(path.join(LIB, '_shared', 'voices.js')).href);
const w = (f, o) => fs.writeFileSync(path.join(film, f), JSON.stringify(o, null, 1));
fs.mkdirSync(path.join(film, 'voice'), { recursive: true });
const bad = T.LINES.filter(l => !VOICES[l.who]);
if (bad.length) { console.error('no voice for', bad.map(l => `${l.id} (${l.who})`)); process.exit(1); }
w('voice/lines.json', T.LINES.map(({ id, who, text, say, asr }) => ({ id, text: say || text, ...VOICES[who], ...(asr && { asr: asr }), ...(say && { asr: asr || text }) })));
w('timeline.json', { bpm: T.BPM, dur: T.DUR, secs: T.SECS, lines: T.LINES });
w('cards.json', T.CARDS.map(({ t0, t1, text }) => ({ t0, t1, text })));
if (T.CARD_CLASHES.length) { console.error('subtitle cards overlap:', T.CARD_CLASHES); process.exit(1); }
// lời đọc chồng nhau thì không nghe được
const over = T.LINES.filter((l, i) => i + 1 < T.LINES.length && l.t + l.dur > T.LINES[i + 1].t - .05).map(l => l.id);
if (over.length) { console.error('voice lines overlap:', over); process.exit(1); }
console.log(`voice/lines.json ${T.LINES.length} lines · timeline.json · cards.json ${T.CARDS.length} cards`);
