// Bài hát của một tập (Musical Storytelling, _shared/QUALITY.md §8): giọng (key), lưới phách, hợp âm, motif và bản nhạc từng câu hát.
// Một nguồn duy nhất cho hình, tiếng và phụ đề: timeline.js khai báo, hàm ở đây giải ra nốt (MIDI, giây); tools/lines.mjs ghi JSON
// cho phần Python (sing.py, groove.py, qa_musical.py), các phần đó chỉ đọc kết quả đã giải.
//
//   import { song, resolveLines, cardsOf, STANDARD as STD } from '../../_shared/song.js';
//   import { VOICES } from '../../_shared/voices.js';
//   export const STANDARD = STD;
//   export const SONG = song({ key: 'Db', film: 120, motif: "5:.5 6:.5 5:.5 1':1",
//                              parts: [{ t0: 0, bpm: 120, chords: 'Db Ab7' }, { t0: 3.6, bpm: 108, chords: 'Gb Db' }] });
//   export const LINES = resolveLines(SONG, VOICES, [
//     { id: 'L01', who: 'loupe', text: 'Could you sing with your legs?', em: ['legs'],
//       sing: { mode: 'half-sing', at: .44, notes: "5:.5 5:.5 6:.5 5:.5 3:.5 5:1.5" } },          // t, dur: suy ra từ bản nhạc
//     { id: 'L02', who: 'loupe', t: 2.8, dur: .999, text: "Let's zoom in!", catch: true },        // câu nói: t, dur như cũ (voice/dur.json)
//   ]);
//   export const CARDS = cardsOf(LINES, DUR, { max: 7, hide: [0, 3.25] });
//
// Bản nhạc của một câu (sing.notes): các nốt cách nhau bởi dấu cách, mỗi nốt "bậc:phách".
//   bậc 1–7 của gam trưởng của bài; ' lên một quãng tám, , xuống một quãng tám (có thể lặp: 1'' 5,); # / b thăng giáng (4#, 7b)
//   r:phách = nghỉ · ~bậc:phách = luyến (nốt mới trên cùng âm tiết với nốt trước)
//   mỗi âm tiết của lời một nốt (đếm âm tiết tự động; từ đếm sai thì ghi sing.lyr: 'vi-o-lin bow', gạch nối tách âm tiết)
// sing.at: lúc nốt đầu tiên vang (giây), bắt vào lưới móc đơn của phần nhạc chứa nó. Kiểu hát (sing.mode):
//   'speak' nói thường · 'sing-talk' nói theo nhịp, ngữ điệu bám nốt nhẹ · 'half-sing' nửa hát · 'sing' hát trọn (điệp khúc)
// sing.chorus: tên điệp khúc (cùng tên = cùng lời, cùng nốt; qa kiểm số lần lặp) · sing.speed: tốc độ TTS riêng của câu hát
// (19/11/2026, QUALITY.md §8.3) KÊNH KHÔNG HÁT NỮA: viết `tune` thay cho `sing` (cùng at, notes, chorus, lyr). Câu đọc bằng giọng TTS gốc,
// vào đúng phách của bản nhạc; giai điệu thuộc về nhạc nền (groove.py đánh giai điệu điệp khúc). `sing` còn chạy được chỉ để dựng lại bản cũ.
// Kiểm khi giải (lỗi thì dừng build): giọng trưởng, mọi phần ≥ 108 BPM (luôn vui tươi), số nốt = số âm tiết, câu nằm trọn trong một phần,
// mỗi câu trải ≤ 9 nửa cung, nốt ở phách mạnh là nốt của hợp âm (sing, half-sing, điệp khúc), giai điệu quanh `home` của giọng ± 2 nửa cung,
// giọng trẻ em không dưới 240 Hz.

export const STANDARD = '2026-11b';
export const MODES = ['speak', 'sing-talk', 'half-sing', 'sing'];
const PCS = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const MAJOR = [0, 2, 4, 5, 7, 9, 11];
const QUAL = { '': [0, 4, 7], m: [0, 3, 7], '7': [0, 4, 7, 10], m7: [0, 3, 7, 10], maj7: [0, 4, 7, 11], '6': [0, 4, 7, 9],
  sus4: [0, 5, 7], dim: [0, 3, 6], add9: [0, 4, 7, 14], sus2: [0, 2, 7] };   // giống QUAL trong _shared/audio/groove.py
const round = (x, k = 4) => +x.toFixed(k);
export const hzOf = m => 440 * 2 ** ((m - 69) / 12);

export function chordOf(sym) {
  const r = PCS[sym[0]]; let q = sym.slice(1), acc = 0;
  if (r === undefined) throw new Error(`song: bad chord '${sym}'`);
  if (q[0] === '#' || q[0] === 'b') { acc = q[0] === '#' ? 1 : -1; q = q.slice(1); }
  if (!(q in QUAL)) throw new Error(`song: bad chord quality '${sym}' (${Object.keys(QUAL).map(k => k || 'major').join(', ')})`);
  return { root: (r + acc + 12) % 12, iv: QUAL[q] };
}

export function parseNotes(s) {
  return String(s).trim().split(/\s+/).filter(Boolean).map(tok => {
    const m = /^(~)?(r|[1-7])([',]*)([#b]?):(\d*\.?\d+)$/.exec(tok);
    if (!m) throw new Error(`song: bad note '${tok}' (degree:beats, e.g. 5:.5, 1':1, 4#:.5, r:.5, ~6:.5)`);
    const oct = [...m[3]].reduce((a, ch) => a + (ch === "'" ? 1 : -1), 0);
    return { tie: !!m[1], rest: m[2] === 'r', deg: m[2] === 'r' ? 0 : +m[2], oct, acc: m[4] === '#' ? 1 : m[4] === 'b' ? -1 : 0, beats: +m[5] };
  });
}
const rel = n => MAJOR[n.deg - 1] + n.acc + 12 * n.oct;

export function song({ key, film = 120, motif = '', parts }) {
  if (/m$/.test(key)) throw new Error(`song: key ${key} is minor: the channel's songs are major (QUALITY.md, "luôn vui tươi")`);
  const tonic = chordOf(key).root;
  const ps = [...parts].sort((a, b) => a.t0 - b.t0).map((p, i, arr) => {
    const bpm = p.bpm ?? film;
    if (bpm < 108) throw new Error(`song: part at ${p.t0} s is ${bpm} BPM, the channel's songs are ≥ 108 BPM`);
    const chords = p.chords.trim().split(/\s+/); chords.forEach(c => c.split(',').forEach(chordOf));
    return { t0: p.t0, t1: i + 1 < arr.length ? arr[i + 1].t0 : Infinity, bpm, beat: 60 / bpm, meter: p.meter ?? 4,
      origin: Math.abs(bpm - film) < 1e-9 ? 0 : p.t0, chords };
  });
  return { key, tonic, film, motif: motif ? parseNotes(motif) : [], parts: ps };
}

export function partAt(S, t) {
  return S.parts.find(p => t >= p.t0 - 1e-6 && t < p.t1 - 1e-6) || S.parts[S.parts.length - 1];
}
// hợp âm lúc t (cùng cách đếm ô nhịp với Groove._chord_at: hợp âm thứ k thuộc ô nhịp thứ k tính từ ô chứa t0 của phần)
export function chordAt(S, t) {
  const p = partAt(S, t), bar = p.meter * p.beat, u = t - p.origin;
  const b = Math.floor(u / bar + 1e-6), b0 = Math.floor((p.t0 - p.origin) / bar + 1e-6);
  const cs = p.chords[((b - b0) % p.chords.length + p.chords.length) % p.chords.length].split(',');
  const sub = Math.floor((u - b * bar) / (bar / cs.length) + 1e-6);
  return cs[Math.min(sub, cs.length - 1)];
}

// đếm âm tiết tiếng Anh (gần đúng): nhóm nguyên âm, bỏ "e" câm cuối từ. Từ sai thì ghi sing.lyr.
export function syllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  let n = (w.match(/[aeiouy]+/g) || []).length;
  if (/[^aeiouy]e$/.test(w) && !/[^aeiouy]le$/.test(w)) n--;
  if (/[^aeiouy]es$/.test(w) && !/(ses|zes|ches|shes|ges|ces|xes|[^aeiouy]les)$/.test(w)) n--;
  return Math.max(1, n);
}
export const wordsOf = text => text.split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w));
const bare = w => w.toLowerCase().replace(/[^a-z0-9']/g, '');

// một câu hát → { t, dur, sung: { mode, pre, tail, chorus, notes: [{ t (từ đầu câu), d, m, syl, w }], range, speed? } }
// (19/11/2026, QUALITY.md §8.3) câu NÓI theo phách: L.tune thay cho L.sing (cùng cách viết nốt). Giọng đọc thường (TTS gốc, không hát);
// bản nhạc chỉ để đặt câu vào phách (nốt đầu vang ở tune.at, câu bắt đầu sớm hơn pre) và để nhạc nền chơi giai điệu (điệp khúc).
// dur = độ dài thật của bản nói (durs[id], từ voice/dur.json qua voice/dur.js), lần dựng đầu chưa có thì tạm lấy độ dài của bản nhạc.
// → { t, dur, tune: { mode?, pre, chorus, notes } }. Giai điệu của tune không phải giọng hát: không kiểm `home` / giọng trẻ em.
export function resolveLine(L, S, V, durs = null) {
  const isTune = !L.sing && !!L.tune, sg = L.sing || L.tune;
  if (!sg || (!isTune && sg.mode === 'speak')) return null;
  if (!isTune && !MODES.includes(sg.mode)) throw new Error(`song: ${L.id}: mode '${sg.mode}' (${MODES.join(' | ')})`);
  if (isTune && sg.mode && !MODES.includes(sg.mode)) throw new Error(`song: ${L.id}: tune.mode '${sg.mode}' (${MODES.join(' | ')})`);
  if (!V) throw new Error(`song: ${L.id}: no voice '${L.who}' in _shared/voices.js`);
  if (V.home === undefined) throw new Error(`song: ${L.id}: voice '${L.who}' has no home (MIDI) in _shared/voices.js`);
  const words = wordsOf(L.text), lyr = sg.lyr ? sg.lyr.split(/\s+/) : null;
  if (lyr && (lyr.length !== words.length || lyr.some((x, i) => bare(x.replace(/-/g, '')) !== bare(words[i]))))
    throw new Error(`song: ${L.id}: lyr '${sg.lyr}' must be the words of the text with hyphens between syllables`);
  const syl = words.map((w, i) => lyr ? lyr[i].split('-').length : syllables(w)), total = syl.reduce((a, b) => a + b, 0);
  const wordOfSyl = []; syl.forEach((n, w) => { for (let k = 0; k < n; k++) wordOfSyl.push(w); });
  const toks = parseNotes(sg.notes), p = partAt(S, sg.at), grid = p.beat / 2;
  const at = p.origin + Math.round((sg.at - p.origin) / grid) * grid;
  const sung = toks.filter(n => !n.rest).map(rel), mid = [...sung].sort((a, b) => a - b)[sung.length >> 1];
  let base = S.tonic + 12 * 2, best = 1e9;
  for (let k = 2; k <= 7; k++) { const b = S.tonic + 12 * k, d = Math.abs(b + mid - V.home); if (d < best) { best = d; base = b; } }
  const notes = []; let t = at, si = -1;
  for (const n of toks) {
    if (n.rest) { t += n.beats * p.beat; continue; }
    if (!n.tie) si++;
    else if (si < 0) throw new Error(`song: ${L.id}: a tie (~) cannot start the line`);
    notes.push({ abs: t, d: n.beats * p.beat, m: base + rel(n), syl: si, w: wordOfSyl[si] }); t += n.beats * p.beat;
  }
  if (si + 1 !== total) throw new Error(`song: ${L.id}: ${si + 1} syllable notes for ${total} syllables (${words.map((w, i) => `${w}:${syl[i]}`).join(' ')}); fix sing.notes or add sing.lyr`);
  const errs = [], warns = [];
  if (t > p.t1 + 1e-6) errs.push(`ends at ${t.toFixed(2)} s, after its part (${p.t1} s): a sung line stays inside one part of the song`);
  const ms = notes.map(n => n.m), span = Math.max(...ms) - Math.min(...ms);
  if (span > 9) errs.push(`spans ${span} semitones (≤ 9)`);
  const med = [...ms].sort((a, b) => a - b)[ms.length >> 1];
  if (!isTune && Math.abs(med - V.home) > 2) errs.push(`median note ${med} is ${(med - V.home).toFixed(1)} semitones from ${L.who}'s home ${V.home} (± 2)`);
  if (!isTune && V.child && Math.min(...ms) < 58.9) errs.push(`child voice note ${Math.min(...ms)} is below 240 Hz (MIDI 59)`);
  for (const n of notes) {
    const pos = (n.abs - p.origin) / p.beat, beatIn = ((Math.round(pos) % p.meter) + p.meter) % p.meter;
    if (Math.abs(pos - Math.round(pos)) > 1e-3 || beatIn % 2) continue;                 // phách mạnh: 1 và 3 của ô 4/4
    const ch = chordOf(chordAt(S, n.abs)), pc = ((n.m - ch.root) % 12 + 12) % 12;
    if (!ch.iv.map(x => x % 12).includes(pc)) (sg.mode === 'sing-talk' && !sg.chorus ? warns : errs).push(`note ${n.m} at ${n.abs.toFixed(2)} s is not in ${chordAt(S, n.abs)}`);
  }
  if (errs.length) throw new Error(`song: ${L.id} "${L.text}": ` + errs.join('; '));
  const pre = sg.pre ?? .12, tail = sg.tail ?? .1, t0 = at - pre;
  if (isTune) {
    const real = durs && durs[L.id];
    return { t: round(t0, 3), dur: round(real ?? (t - t0 + tail), 3), warns,
      tune: { ...(sg.mode && { mode: sg.mode }), pre, chorus: sg.chorus || null, measured: !!real,
        notes: notes.map(n => ({ t: round(n.abs - t0), d: round(n.d), m: n.m, syl: n.syl, w: n.w })) } };
  }
  return {
    t: round(t0, 3), dur: round(t - t0 + tail, 3), warns,
    sung: { mode: sg.mode, pre, tail, chorus: sg.chorus || null, ...(sg.speed && { speed: sg.speed }), ...(sg.fill && { fill: sg.fill }), ...(sg.glide && { glide: sg.glide }), ...(sg.hi && { hi: sg.hi }), ...(sg.alpha !== undefined && { alpha: sg.alpha }),
      ...(sg.legato === false && { legato: false }), ...(sg.seed !== undefined && { seed: sg.seed }),   // (19/11/2026) sing.py: legato: false = cách cắt âm tiết cũ; seed = chọn bản thu khác
      range: [Math.round(hzOf(V.home - 13)), Math.round(hzOf(V.home + 14))],
      notes: notes.map(n => ({ t: round(n.abs - t0), d: round(n.d), m: n.m, syl: n.syl, w: n.w })) },
  };
}

// giải mọi câu: câu hát lấy t, dur từ bản nhạc và mang thêm `sung`; câu nói theo phách (tune) lấy t từ bản nhạc, dur từ durs và mang
// thêm `tune`; câu nói khác giữ nguyên. durs: { id: giây } độ dài thật của bản nói (voice/dur.js do tools/lines.mjs ghi từ voice/dur.json)
export function resolveLines(S, VOICES, lines, { durs = null } = {}) {
  return lines.map(L => {
    const r = resolveLine(L, S, VOICES[L.who], durs);
    if (!r) { if (L.t === undefined || L.dur === undefined) throw new Error(`song: ${L.id}: a spoken line needs t and dur (or tune)`); return { ...L }; }
    if (r.warns.length && typeof process !== 'undefined' && process.stderr) process.stderr.write(`song: ${L.id}: ${r.warns.join('; ')}\n`);
    const { tune: _t, sing: _s, ...rest } = L;
    return r.tune ? { ...rest, t: r.t, dur: r.dur, tune: r.tune } : { ...L, t: r.t, dur: r.dur, sung: r.sung };
  });
}

// thời điểm của từng từ (giây, tuyệt đối): câu hát theo nốt; câu nói theo mốc từ thật của giọng (times[id], từ voice/words.js do
// _shared/tools/wordtimes.py ghi, 18/11/2026 Vocal QC) khi có và đủ từ, không thì chia theo số âm tiết
function wordTimes(L, times) {
  const words = wordsOf(L.text);
  if (L.sung) return words.map((_, w) => {
    const ns = L.sung.notes.filter(n => n.w === w);
    return ns.length ? [L.t + ns[0].t - .04, L.t + ns.at(-1).t + ns.at(-1).d] : [L.t, L.t + L.dur];
  });
  const real = times && times[L.id];
  if (real && real.length === words.length) return real.map(([a, b]) => [L.t + a, L.t + Math.max(a + .05, b)]);
  const syl = words.map(w => Math.max(1, syllables(w))), tot = syl.reduce((a, b) => a + b, 0); let acc = 0;
  return syl.map(n => { const a = L.t + L.dur * acc / tot; acc += n; return [a, L.t + L.dur * acc / tot]; });
}
// tách một câu thành các cụm ≤ max từ: chỉ tách khi dài hơn max, ưu tiên cuối câu rồi dấu phẩy gần giữa nhất
function chunks(ws, max, at = 0) {
  if (ws.length <= max) return [[at, at + ws.length]];
  const mid = ws.length / 2, score = (i, re) => re.test(ws[i - 1]) ? Math.abs(i - mid) : 1e9;
  let cut = 0, best = 1e9;
  for (const re of [/[.!?]["')]*$/, /[,;:]["')]*$/]) {
    for (let i = 1; i < ws.length; i++) { const s = score(i, re); if (s < best && i <= max && ws.length - i <= max * 3) { best = s; cut = i; } }
    if (cut) break;
  }
  if (!cut) cut = Math.min(max, Math.ceil(ws.length / Math.ceil(ws.length / max)));
  return [...chunks(ws.slice(0, cut), max, at), ...chunks(ws.slice(cut), max, at + cut)];
}
// tấm phụ đề ≤ max từ, mỗi tấm thuộc một câu (không gộp lời hai người); chữ hiện từng từ theo lúc hát / nói (karaoke);
// times: mốc từ thật của câu nói ({ L05: [[a, b], …] }, giây tính từ đầu câu), xem wordTimes;
// em: từ được nhấn (màu + cỡ, _shared/episode.js subtitleEm); hide: [a, b] không có phụ đề (chữ móc đang trên hình)
export function cardsOf(LINES, DUR, { max = 7, hide = null, minHold = 1.2, after = .4, times = null } = {}) {
  const out = [];
  for (const L of LINES) {
    if (L.nosub) continue;
    const ws = wordsOf(L.text), wt = wordTimes(L, times), em = (L.em || []).map(bare);
    const cut = L.split ? [0, ...L.split, ws.length].map((a, i, arr) => i + 1 < arr.length ? [a, arr[i + 1]] : null).filter(Boolean) : chunks(ws, max);
    for (const [a, b] of cut) {
      const part = ws.slice(a, b);
      out.push({ t0: round(wt[a][0], 3), end: wt[b - 1][1], text: part.join(' '), who: L.who, line: L.id,
        em: part.filter(w => em.includes(bare(w))).map(bare), parts: part.map((w, i) => ({ t: round(wt[a + i][0], 3), text: w })) });
    }
  }
  out.sort((x, y) => x.t0 - y.t0);
  let cards = out;
  if (hide) cards = out.filter(c => c.end > hide[1] + .3 || c.t0 >= hide[1]).map(c => c.t0 < hide[1] ? { ...c, t0: round(hide[1], 3), parts: c.parts.map(p => ({ ...p, t: Math.max(p.t, round(hide[1], 3)) })) } : c);
  return cards.map((c, i) => {
    const nx = cards[i + 1], t1 = Math.min(nx ? nx.t0 - .02 : Infinity, Math.max(c.t0 + minHold, c.end + after), DUR - .3);
    const { end, ...rest } = c; return { ...rest, t1: round(t1, 3) };
  });
}
// tấm quá ngắn để đọc (< 0,6 s) hoặc chồng nhau
export const cardClashes = cards => cards.filter((c, i) => c.t1 - c.t0 < .6 || (i + 1 < cards.length && c.t1 > cards[i + 1].t0)).map(c => c.text);

// bài hát đã giải, cho timeline.json (groove.py song mode, qa_musical.py)
export function resolveSong(S, DUR) {
  const parts = S.parts.map(p => ({ t0: p.t0, t1: Math.min(p.t1, DUR), bpm: p.bpm, beat: round(p.beat, 6), origin: p.origin, meter: p.meter, chords: p.chords.join(' ') }));
  const chart = [];
  for (const p of S.parts) {
    const bar = p.meter * p.beat, end = Math.min(p.t1, DUR);
    for (let t = p.t0; t < end - 1e-6;) {
      const b = Math.floor((t - p.origin) / bar + 1e-6), nb = p.origin + (b + 1) * bar, cs = chordAt(S, t + 1e-4).split(',');
      const t1 = Math.min(nb, end); chart.push([round(t, 3), round(t1, 3), cs.length > 1 ? chordAt(S, t + 1e-4) : cs[0]]); t = t1;
    }
  }
  let b = 0; const motif = [];
  for (const n of S.motif) { if (!n.rest) motif.push({ b: round(b, 3), d: n.beats, s: rel(n) }); b += n.beats; }
  return { key: S.key, tonic: S.tonic, film: S.film, parts, chart, motif };
}
