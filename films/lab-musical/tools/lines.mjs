// Xuất timeline.js ra JSON cho phần Python (chuẩn 11/2026b, _shared/template/tools/lines.mjs):
//   voice/lines.json (tts.py, voicefx.py, asr_check.py, sing.py, asr_sung.py), timeline.json (mix.py, qa.py), cards.json (srt.py, qa.py).
// Giọng và tốc độ của từng nhân vật lấy từ _shared/voices.js. Câu hát (sing) đã được _shared/song.js giải trong timeline.js:
// lines.json mang bản nhạc đã giải (nốt MIDI, giây) cho sing.py; câu hát dùng tốc độ chuẩn của giọng (hoặc sing.speed), không dùng PACE.
// In quỹ thời gian và dừng nếu: phim dài quá giới hạn của loại tập, lời chồng nhau, tấm phụ đề chồng nhau hoặc quá ngắn.
import fs from 'fs'; import path from 'path'; import { fileURLToPath, pathToFileURL } from 'url';
const here = path.dirname(fileURLToPath(import.meta.url)), film = path.resolve(here, '..');
const LIB = process.env.LIB || path.resolve(film, '..', '..');
const T = await import(pathToFileURL(path.join(film, 'timeline.js')).href);
const { VOICES } = await import(pathToFileURL(path.join(LIB, '_shared', 'voices.js')).href);
const w = (f, o) => fs.writeFileSync(path.join(film, f), JSON.stringify(o, null, 1));
fs.mkdirSync(path.join(film, 'voice'), { recursive: true });
const bad = T.LINES.filter(l => !VOICES[l.who]);
if (bad.length) { console.error('no voice for', bad.map(l => `${l.id} (${l.who})`)); process.exit(1); }
// câu nói của bản B đọc chậm hơn (T.PACE); câu cửa miệng (catch: true) giữ tốc độ chuẩn; câu hát: tốc độ chuẩn hoặc sing.speed
const speedOf = l => +(VOICES[l.who].speed * (l.sung ? (l.sung.speed ?? 1) : l.catch ? 1 : (l.pace ?? T.PACE ?? 1))).toFixed(3);
w('voice/lines.json', T.LINES.map(l => ({
  id: l.id, text: l.say || l.text, voice: VOICES[l.who].voice, speed: speedOf(l), ...(VOICES[l.who].pitch && { pitch: VOICES[l.who].pitch }),
  ...((l.asr || l.say) && { asr: l.asr || l.text }), ...(l.sung && { sing: l.sung }), ...(l.em && { kw: l.em }),
})));
w('timeline.json', {
  bpm: T.BPM, dur: T.DUR, secs: T.SECS, lines: T.LINES, hit: T.HIT,                       // hit: mốc hành động, để nhạc khớp với hình
  ...(T.STANDARD && { standard: T.STANDARD }), ...(T.SONG_JSON && { song: T.SONG_JSON }),
  ...(T.BEATS && { beats: T.BEATS }), ...(T.SHOTS && { shots: T.SHOTS }), ...(T.SECRET && { secret: T.SECRET }),
});
w('cards.json', T.CARDS.map(({ t0, t1, text, em }) => ({ t0, t1, text, ...(em && em.length && { em }) })));
if (T.CARD_CLASHES.length) { console.error('subtitle cards overlap or are too short to read:', T.CARD_CLASHES); process.exit(1); }
// lời đọc chồng nhau thì không nghe được
const over = T.LINES.filter((l, i) => i + 1 < T.LINES.length && l.t + l.dur > T.LINES[i + 1].t - .05).map(l => l.id);
if (over.length) { console.error('voice lines overlap:', over); process.exit(1); }
// quỹ thời gian (QUALITY.md §8: bản B 15–25 s, tập A ≤ 48 s; hát dài hơn nói)
const A = (T.SECS || []).some(s => s.id === 'title'), LONG = T.DUR > 90, lim = LONG ? null : A ? [0, 48] : [15, 25];
const words = l => l.text.split(/\s+/).filter(x => /[A-Za-z0-9]/.test(x)).length, tot = T.LINES.reduce((a, l) => a + words(l), 0);
const sung = T.LINES.filter(l => l.sung).reduce((a, l) => a + words(l), 0);
console.log(`voice/lines.json ${T.LINES.length} lines (${T.LINES.filter(l => l.sung).length} sung, ${Math.round(100 * sung / Math.max(1, tot))} % of words) · timeline.json · cards.json ${T.CARDS.length} cards · ${T.DUR.toFixed(1)} s`);
if (lim && (T.DUR < lim[0] || T.DUR > lim[1])) { console.error(`film is ${T.DUR.toFixed(1)} s, outside ${lim[0]}–${lim[1]} s for a${A ? 'n A episode' : ' B version'}`); process.exit(1); }
