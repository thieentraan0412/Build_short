// Xuất timeline.js ra JSON cho phần Python: voice/lines.json (tts.py, asr_check.py), timeline.json (mix.py), cards.json (srt.py).
// Có voice/dur.json (sau tts.py + voicefx.py) thì ghi độ dài thật vào dur.js trước, rồi mới dựng lịch: kịch bản "chảy" theo giọng thật.
import fs from 'fs'; import path from 'path'; import { fileURLToPath, pathToFileURL } from 'url';
const here = path.dirname(fileURLToPath(import.meta.url)), film = path.resolve(here, '..');
const LIB = process.env.LIB || path.resolve(film, '..', '..');
const { VOICES } = await import(pathToFileURL(path.join(LIB, '_shared', 'voices.js')).href);
const durP = path.join(film, 'voice', 'dur.json'), linesP = path.join(film, 'voice', 'lines.json');
if (fs.existsSync(durP) && fs.existsSync(linesP)) {                      // id → "nhân vật|lời" theo lines.json cũ, rồi gộp vào dur.js
  const old = JSON.parse(fs.readFileSync(linesP, 'utf8')), dur = JSON.parse(fs.readFileSync(durP, 'utf8'));
  const prev = (await import(pathToFileURL(path.join(film, 'dur.js')).href + '?v=' + Date.now())).D, D = { ...prev };
  for (const l of old) if (dur[l.id] != null && l.who) D[`${l.who}|${l.text}`] = dur[l.id];
  fs.writeFileSync(path.join(film, 'dur.js'), '// Độ dài thật của từng câu (giây), khoá "nhân vật|lời". Sinh tự động bởi tools/lines.mjs từ voice/dur.json, đừng sửa tay.\nexport const D = ' + JSON.stringify(D, null, 1) + ';\n');
}
const T = await import(pathToFileURL(path.join(film, 'timeline.js')).href + '?v=' + Date.now());
const w = (f, o) => fs.writeFileSync(path.join(film, f), JSON.stringify(o, null, 1));
fs.mkdirSync(path.join(film, 'voice'), { recursive: true });
const bad = T.LINES.filter(l => !VOICES[l.who]);
if (bad.length) { console.error('no voice for', bad.map(l => `${l.id} (${l.who})`)); process.exit(1); }
const speedOf = l => +(VOICES[l.who].speed * (l.catch ? 1 : (l.pace ?? T.PACE ?? 1))).toFixed(3);
w('voice/lines.json', T.LINES.map(l => ({ id: l.id, who: l.who, text: l.say || l.text, voice: VOICES[l.who].voice, speed: speedOf(l), ...(VOICES[l.who].pitch && { pitch: VOICES[l.who].pitch }), ...((l.asr || l.say) && { asr: l.asr || l.text }) })));
w('timeline.json', { bpm: T.BPM, dur: T.DUR, secs: T.SECS, lines: T.LINES, hit: T.HIT });
w('cards.json', T.CARDS.map(({ t0, t1, text }) => ({ t0, t1, text })));
if (T.CARD_CLASHES.length) { console.error('subtitle cards overlap:', T.CARD_CLASHES); process.exit(1); }
const over = T.LINES.filter((l, i) => i + 1 < T.LINES.length && l.t + l.dur > T.LINES[i + 1].t - .05).map(l => l.id);
if (over.length) { console.error('voice lines overlap:', over); process.exit(1); }
console.log(`voice/lines.json ${T.LINES.length} lines · ${T.DUR.toFixed(1)} s · ${T.CARDS.length} cards · ${T.SECS.length} scenes`);
