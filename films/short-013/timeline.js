// SHORT-013 · Grasshoppers Hide Their Ears in a Funny Place! — timeline (chuẩn 11/2026b, _shared/QUALITY.md §8; dựng lại theo SHORT-016,
// Task.md 19/11/2026). Một nguồn thời gian duy nhất cho hình, phụ đề, giọng nói, nhạc. Tập A: lưới phim 4/4 ở 120 BPM, 23 ô nhịp = 46 s,
// phát vòng lặp: móc và gag là cùng một sân khấu gốc cây giữa bãi cỏ; cuối phim mọi thứ về đúng khung đầu.
// Thử nghiệm của tập (KE-HOACH-PHAT-TRIEN-KENH.md §10): "Nope!" đặt ở bí mật 1 (thay vì bí mật 2).
// Bài hát của tập "Meadow Cumbia" (Rê giáng trưởng). Ba bí mật: tai ở bụng, hát bằng chân, chân như lò xo → điệp khúc
// "Tummy ears, and legs that sing!" (lần 1 trong song tấu của Chirp và Hop, thay câu "The notes make a heart!"; lần 2 sau gag "TOO LOUD!",
// ngay trước câu hỏi kết "Where are YOUR ears?").
// KHÔNG AI HÁT (QUALITY.md §8.3): mọi câu là giọng TTS gốc; câu theo phách viết `tune`; giai điệu điệp khúc do nhạc cụ chơi.
// Miss Loupe luôn như SHORT-015 (§9.10: af_heart, lời dẫn .765 — bản 44 s cũ đọc .9 —, câu cửa miệng .9, ngữ điệu TTS gốc).
import { song, resolveLines, cardsOf, cardClashes, resolveSong, STANDARD as STD } from '../../_shared/song.js';
import { VOICES, CATCH_TUNE } from '../../_shared/voices.js';
export const STANDARD = STD;
// mốc từ thật của câu nói (voice/words.js, _shared/tools/wordtimes.py ghi sau bước giọng): phụ đề chạy chữ đúng lúc nói
const WORDT = await import('./voice/words.js').then(m => m.default).catch(() => ({}));
// độ dài thật của từng câu (voice/dur.js, tools/lines.mjs ghi từ voice/dur.json): câu theo phách lấy dur ở đây
const DURS = await import('./voice/dur.js').then(m => m.default).catch(() => ({}));
export const BPM = 120, BEAT = 60 / BPM, METER = 4, BAR = BEAT * METER;
export const at = (bar, beat = 0) => (bar * METER + beat) * BEAT;
export const PACE = 1;                                        // tập A: câu nói ở tốc độ chuẩn của giọng (Miss Loupe: pace .85 của voices.js)
export const DUR = at(23);
// phần của bài hát (mỗi phần một BPM ≥ 108): t0 và phách
const B108 = 60 / 108, B116 = 60 / 116, B112 = 60 / 112;
const P_EARS = 3.8, P_NOPE = 7.3, P_FAR = 10.55, P_SING = 15.2, P_SPRING = 21.9, P_DUET = 25.8, P_CH2 = 41.0;
const hb = (t0, b, k) => +(t0 + k * b).toFixed(4);            // phách thứ k (có thể lẻ .5) của phần bắt đầu ở t0

export const HIT = {
  words: [0, .12],
  // móc: Crumb thổi còi lá cỏ "PWEEET!"; vòng âm bay tới; cả ba giật mình, mỗi người "nghe" ở một chỗ: Chirp ở đầu gối, Hop ở bụng, Miss Loupe ở... kính
  whistle: [0, .34], rings: [.04, .5], startle: .4, hopUp: [.4, .82], lensRing: [.4, 1.35],
  chirpLeg: [1.0, 1.4], hopTurn: [1.15, 1.6], giggle: 1.75, puzzle: [2.05, 2.7],
  titleOut: [2.55, 2.85], slots: 2.75, raise: 2.7,
  // logo 0,8 s lồng vào cú lao vào kính (titleSting)
  sting: [3.0, 3.8],
  // bí mật 1, có "Nope!": tai Chirp ở chân trước sáng lên; kính trượt sang chân trước của Hop: không có gì; khựng; "Nope!" (dấu X);
  // kính quét dọc sườn Hop, cánh nhấc lên như tấm rèm, lộ màng nghe tròn bên bụng; Chirp gáy, vòng âm chạm màng nghe, màng rung
  kneeGlow: [5.1, 6.7], slide: [6.75, 7.35], hush: [6.8, 7.4], xmark: 7.45, footWag: [7.5, 8.15],
  sweep: [8.25, 9.15], wing: [8.6, 9.15], earOn: 9.15, chirps: [9.82, 10.15], walk: [8.5, 10.4],
  tummyPat: [10.7, 11.8], far: [12.2, 14.05], farRings: [12.55, 13.15, 13.65],
  snap1: 14.55, fly1: [14.65, 15.15], stamp1: 15.2,
  // bí mật 2: nhiều loài châu chấu hát bằng chân: đùi sau kéo lên xuống dọc mép cánh, mỗi lần kéo một tiếng "rè" và một vòng âm
  legUp: [15.4, 15.85], saw: [15.9, 21.15], edge: [18.13, 19.83], solo: [20.3, 20.55, 20.8, 21.05],
  snap2: 21.25, fly2: [21.35, 21.85], stamp2: 21.9,
  // bí mật 3: chân sau như lò xo: co chân (lò xo nén) — BOING! Hop nhảy vọt lên, ra khỏi mặt kính; máy lùi ra bãi cỏ; Hop đáp xuống cạnh Chirp
  crouch: [22.85, 24.4], launch: 24.48, exit: [24.48, 25.8], pull: [24.8, 25.35], land: 25.8,
  // cảnh đặc trưng: Chirp và Hop song tấu (bắt đầu đúng ô nhịp 13 của phim), điệp khúc lần 1; nốt nhạc bay lên xếp thành trái tim, ngôi sao, mặt cười
  duet: [26.0, 30.3], heart: [27.3, 28.4], star: [28.4, 29.2], smile: [29.2, 30.05], finale: 29.85, lensUp: [29.75, 30.3],
  snap3: 30.35, zoomIn: [30.45, 30.75], zoomOut: [30.75, 31.1], stamp3: 31.25,
  // sổ: ô 1, 2 bay xuống trang; Hop nhảy tưng tưng vào; Albie đếm chân, há miệng; Hop nhảy vào trang đúng "go!"
  slotsDown: [31.1, 31.5], hopIn: [31.35, 31.95], counts: [32.05, 32.25, 32.45], plunge: [33.1, 33.55], gulp: 33.55, mini: 33.7,
  flip: [34.4, 34.9],
  // gag: "Play it again! Louder!" — song tấu to hơn, kính của Miss Loupe rung; khựng: Chirp bịt đầu gối, Hop bịt bụng, Miss Loupe bịt... kính
  encore: [36.4, 38.05], lensRing2: [36.85, 38.1], loud: [37.25, 38.05],
  chirpCover: 38.1, hopCover: 38.45, loupeCover: 38.85, giggle2: 40.55,
  uncover: [40.85, 41.05, 41.25],
  // điệp khúc 2: bỏ tay ra, Chirp và Hop chơi lại khe khẽ, cả nhóm nhún theo; câu hỏi kết; Crumb nhặt lá cỏ mới, chữ móc trở lại (khung đầu)
  ch2: [41.38, 43.8], home: [43.8, 45.4], recall: 45.1, loop: [45.4, at(23)],
  // trứng phục sinh ở gag: Mr. Rollo lăn viên tròn trên bãi cỏ xa
  rollo: [38.6, 43.2],
};
// Cảnh của tập A (qa.py đọc 'title' để nhận ra tập A và 'album' để đo cảnh sổ)
export const SECS = [
  { id: 'hook', t0: 0, t1: HIT.sting[0] },
  { id: 'title', t0: HIT.sting[0], t1: HIT.sting[1] },      // logo 0,8 s lồng vào cú lao vào kính
  { id: 'ears', t0: HIT.sting[1], t1: HIT.stamp1 },          // bí mật 1, có "Nope!"
  { id: 'sing', t0: HIT.stamp1, t1: HIT.stamp2 },            // bí mật 2
  { id: 'springs', t0: HIT.stamp2, t1: HIT.zoomIn[0] },      // bí mật 3 và cảnh đặc trưng (song tấu, điệp khúc 1)
  { id: 'album', t0: HIT.zoomIn[0], t1: HIT.flip[1] },
  { id: 'gag', t0: HIT.flip[1], t1: DUR },                   // gag, điệp khúc 2, câu hỏi kết, vòng lặp
];

// ---------- bài hát của tập: "Meadow Cumbia", Rê giáng trưởng; mỗi phần một BPM và một vòng hợp âm ----------
export const SONG = song({
  key: 'Db', film: BPM,
  motif: "5:.5 6:.5 7:1 6:.5 5:.5 3:.5 1':1",                 // câu điệp khúc "TUM-my EARS, and LEGS that SING!": leo tới Đô, đáp lên Rê giáng cao
  parts: [
    { t0: 0, bpm: 120, chords: 'Db Gb,Ab' },                   // A · móc: còi lá cỏ, "Where does a grasshopper hide its ears?"
    { t0: P_EARS, bpm: 108, chords: 'Db Bbm Gb Ab' },          // B · kính: tai Chirp ở đầu gối, "Let's zoom in!"
    { t0: P_NOPE, bpm: 108, chords: 'Db Gb Db Ab' },           // C · "Nope!", tai ở bụng
    { t0: P_FAR, bpm: 116, chords: 'Gb Db Ab Db' },            // D · Crumb hỏi, châu chấu xa hát
    { t0: P_SING, bpm: 120, chords: 'Db Ab Gb Ab' },           // E · bí mật 2: hát bằng chân (cumbia)
    { t0: P_SPRING, bpm: 112, chords: 'Db Ab' },               // F · bí mật 3: lò xo nén
    { t0: P_DUET, bpm: 120, chords: 'Ab,Db Db,Gb' },           // G · song tấu, điệp khúc lần 1 (mỗi hợp âm 2 phách: Rê giáng · Sol giáng | La giáng · Rê giáng)
    { t0: P_CH2, bpm: 120, chords: 'Db,Gb Ab,Db' },            // H · điệp khúc lần 2 và câu hỏi kết (cùng lưới, cùng hợp âm ở ô của điệp khúc)
  ],
});
const CHORUS = { mode: 'sing', chorus: 'tummy', notes: "5:.5 6:.5 7:1 6:.5 5:.5 3:.5 1':1" };

// t, dur của câu nói thường: độ dài thật (voice/dur.json). Câu theo phách (tune): t từ bản nhạc, dur từ voice/dur.js.
// em: từ nhấn trên phụ đề; cta: câu kêu gọi cuối (≤ 2 s, cụ thể, Made for Kids). emo: cảm xúc của câu (Lớp Voice; Miss Loupe không uốn).
// Crumb giữ tốc độ chuẩn .85 của voices.js (SHORT-011: chậm hơn thì Kokoro af_jessica sinh tiếng "uh" đầu câu, Whisper nghe sai).
export const LINES = resolveLines(SONG, VOICES, [
  { id: 'L01', emo: 'curious', who: 'loupe', text: 'Where does a grasshopper hide its ears?', em: ['grasshopper', 'ears'],   // "Where are a grasshopper's ears?" bị nghe thành "Wear a grasshopper's ears"
    tune: { mode: 'half-sing', at: .5, notes: "3:.5 4:.5 5:.5 5:.5 6:.5 5:.5 6:.5 5:.5 1':1" } },
  { id: 'L02', emo: 'excited', who: 'loupe', text: "Let's zoom in!", em: ['zoom'], catch: true, tune: { ...CATCH_TUNE.zoom, at: hb(P_EARS, B108, .5) } },
  { id: 'L03', emo: 'curious', emo_k: 1.4, who: 'crumb', t: 5.16, dur: 1.551, text: 'Are they on its legs, like Chirp?', em: ['legs', 'chirp'] },   // "On its legs, like Chirp's?" bị nghe thành "like cherubs"
  { id: 'L04', emo: 'playful', who: 'loupe', text: 'Nope!', catch: true, tune: { ...CATCH_TUNE.nope, at: hb(P_NOPE, B108, .5) } },
  { id: 'L05', emo: 'surprised', who: 'loupe', text: 'Its ears are on its tummy!', em: ['ears', 'tummy'],
    tune: { mode: 'half-sing', at: hb(P_NOPE, B108, 2), notes: '5:.5 6:.5 5:.5 4:.5 4:.5 6:.5 5:.5' } },
  { id: 'L06', emo: 'curious', who: 'crumb', t: 10.6, dur: 1.219, text: 'But WHY on its tummy?', em: ['why', 'tummy'] },
  { id: 'L07', emo: 'calm', who: 'loupe', text: 'To hear other grasshoppers sing!', em: ['hear', 'sing'],
    tune: { mode: 'sing-talk', at: hb(P_FAR, B116, 3.5), notes: '3:.5 5:.5 5:.5 4:.5 3:.5 3:.5 2:.5 1:1.5' } },
  { id: 'L08', emo: 'excited', who: 'loupe', text: 'Many grasshoppers sing with their legs!', em: ['sing', 'legs'],
    tune: { mode: 'sing-talk', at: 15.5, notes: '5:.5 3:.5 5:.5 6:.5 5:.5 6:.5 7:.5 6:.5 5:1' } },
  { id: 'L09', emo: 'calm', who: 'loupe', text: 'They rub a back leg on a wing!', em: ['rub', 'leg', 'wing'], pace: .83,
    why: 'giọng SHORT-015 (.765) đọc câu 8 âm tiết ở 4,2 âm tiết/s (> 4,0 cho trẻ 4–8 tuổi): chậm hơn 2 % (pace .8 thì base.en nghe thêm "So" ở đầu câu)',
    tune: { mode: 'sing-talk', at: 18.25, notes: '5:.5 4:.5 4:.5 4:.5 6:.5 5:.5 4:.5 5:1' } },
  { id: 'L10', emo: 'excited', who: 'loupe', text: 'And its back legs are like springs!', em: ['legs', 'springs'],
    tune: { mode: 'half-sing', at: hb(P_SPRING, B112, .5), notes: "3:.5 4:.5 5:.5 5:.5 6:.5 7:.5 1':1.5" } },   // "springs": bật lên Rê giáng cao
  { id: 'L11', emo: 'excited', emo_k: 1.4, who: 'crumb', t: 24.62, dur: 1.011, text: 'Look at it go!', em: ['go'] },   // "Wow! What a jump!" bị nghe thành "Well, what a jumper"
  { id: 'L12', emo: 'happy', who: 'crumb', t: 26.25, dur: .867, text: 'A bug band!', em: ['band'] },
  { id: 'L13', emo: 'happy', who: 'loupe', text: 'Tummy ears, and legs that sing!', em: ['tummy', 'ears', 'legs', 'sing'], tune: { ...CHORUS, at: 27.5 },
    was: 'The notes make a heart!', why: 'thành điệp khúc (gom hai bí mật, đọc theo được); trái tim nốt nhạc vẫn hiện trên hình. "Tummy ears and singing legs!" bị cả hai Whisper nghe "Tommy": đổi thành "Tummy ears, and legs that sing!"' },
  { id: 'L14', emo: 'proud', who: 'albie', t: 31.6, dur: 2.297, text: 'Six legs? In you go!', em: ['legs'], catch: true },
  { id: 'L15', emo: 'excited', emote: false, who: 'crumb', t: 35.15, dur: 1.185, text: 'Play it again! Louder!', em: ['louder'], why: 'giữ ngữ điệu TTS gốc (emote: false): mọi cách uốn (excited 1,1 / .5, happy .5) làm base.en nghe thêm "We will / I will" ở đầu câu' },   // "Again! Louder!" bị nghe thành "And again louder"
  { id: 'L16', emo: 'startled', who: 'loupe', t: 39.25, dur: 1.162, pace: 1, text: 'Oops! Too loud!', em: ['loud'],
    why: 'giữ tốc độ .9 của bản cũ (câu cảm thán ngắn): ở .765 base.en nghe "It oops, too loud"' },
  { id: 'L17', emo: 'happy', who: 'loupe', text: 'Tummy ears, and legs that sing!', em: ['tummy', 'ears', 'legs', 'sing'], tune: { ...CHORUS, at: 41.5 } },
  { id: 'L18', emo: 'happy', who: 'loupe', text: 'Where are YOUR ears?', em: ['your', 'ears'], cta: true,
    tune: { mode: 'half-sing', at: 44.25, notes: '3:.5 4:.5 5:.5 6:1' } },   // câu hỏi kết cho trẻ: trẻ chỉ vào tai mình
], { durs: DURS });
export const SECRET = { kw: ['ears', 'tummy', 'legs', 'sing', 'springs'] };   // từ khoá của bí mật: phụ đề nhấn, CTA nhắc lại
// Tấm phụ đề ≤ 7 từ, mỗi tấm một câu, chữ hiện từng từ theo lúc nói; không có phụ đề khi chữ móc đang trên hình.
export const CARDS = cardsOf(LINES, DUR, { max: 7, hide: [0, HIT.titleOut[1]], times: WORDT });
export const CARD_CLASHES = cardClashes(CARDS);
const L = id => LINES.find(l => l.id === id);
// hết đoạn nhạc của câu id (nốt cuối của tune): hình nhảy theo điệp khúc chạy hết đoạn nhạc, không dừng khi lời hết
export const spanEnd = id => { const l = L(id), ns = (l.sung || l.tune || {}).notes; return ns && ns.length ? l.t + Math.max(...ns.map(n => n.t + n.d)) + .1 : l.t + l.dur; };
// ranh giới giữa nửa đầu (móc, kính, song tấu) và gag của sân khấu gốc cây (bản 44 s cũ: 30 s)
export const MID = +(HIT.stamp3 + .5).toFixed(3);

// 6 nhịp kể chuyện (Task.md mục C): hook ≤ 3 s
export const BEATS = [
  { id: 'hook', t0: 0, t1: HIT.titleOut[0], what: 'Crumb thổi còi lá cỏ PWEEET!, cả ba giật mình, mỗi người "nghe" ở một chỗ; "Where does a grasshopper hide its ears?"' },
  { id: 'setup', t0: HIT.titleOut[0], t1: HIT.kneeGlow[0], what: 'Ba ô sticker trống; logo lao vào kính; "Let\'s zoom in!"' },
  { id: 'discovery', t0: HIT.kneeGlow[0], t1: HIT.flip[1], what: 'Tai Chirp ở đầu gối · "Nope!": tai châu chấu ở bụng · hát bằng chân (đùi kéo dọc mép cánh) · chân như lò xo, BOING! · song tấu, điệp khúc lần 1 · sổ: "Six legs? In you go!"' },
  { id: 'surprise', t0: HIT.flip[1], t1: L('L17').t, what: '"Play it again! Louder!": TOO LOUD! Chirp bịt đầu gối, Hop bịt bụng, Miss Loupe bịt... kính; "Oops! Too loud!"' },
  { id: 'payoff', t0: L('L17').t, t1: L('L18').t, what: 'Điệp khúc lần 2: bỏ tay ra, Chirp và Hop chơi khe khẽ, cả nhóm nhún theo (nhạc cụ chơi giai điệu)' },
  { id: 'cta', t0: L('L18').t, t1: DUR, what: '"Where are YOUR ears?": trẻ chỉ vào tai mình; Crumb nhặt lá cỏ mới, chữ móc trở lại, về khung đầu' },
];
// cú máy / thay đổi hình có mục đích, mỗi 2–4 s (Task.md mục B); qa_musical.py so với thay đổi đo được
export const SHOTS = [
  { t: 0, kind: 'trung, sân khấu gốc cây; chữ móc ở trời', why: 'hành động ở khung 0: Crumb thổi còi lá cỏ' },
  { t: HIT.startle, kind: 'rung máy, vòng âm bay tới', why: 'phản ứng: cả ba giật mình, mỗi người "nghe" ở một chỗ' },
  { t: HIT.puzzle[0], kind: 'đẩy nhẹ, hai dấu hỏi', why: 'bí ẩn chưa giải: tai ở đâu?' },
  { t: HIT.sting[0], kind: 'logo lao vào kính → kính lớn', why: 'nhận diện kênh ≤ 0,8 s, vào bí mật 1' },
  { t: HIT.kneeGlow[0], kind: 'phóng trong kính vào đầu gối Chirp', why: 'tai của dế ở chân: gài cho câu hỏi của Crumb' },
  { t: HIT.slide[0], kind: 'kính trượt sang chân trước của Hop', why: 'không có gì → "Nope!"' },
  { t: HIT.sweep[0], kind: 'quét dọc sườn Hop, cánh nhấc như rèm', why: 'bí mật 1 xảy ra: lộ màng nghe ở bụng' },
  { t: L('L06').t, kind: 'lùi trong kính, Crumb vỗ bụng hỏi', why: '"But WHY on its tummy?"' },
  { t: HIT.far[0], kind: 'lia trong kính sang châu chấu xa hát', why: 'nghe bạn hát: vòng âm chạm màng nghe' },
  { t: HIT.snap1, kind: 'chụp, sticker 1 bay lên ô', why: 'lấp ô 1 "Tummy ears!"' },
  { t: HIT.legUp[0], kind: 'đẩy vào đùi sau của Hop', why: 'bí mật 2: hát bằng chân' },
  { t: HIT.edge[0], kind: 'phóng sát mép cánh, đường kéo sáng', why: '"They rub a back leg on a wing!"' },
  { t: HIT.solo[0], kind: 'lùi nhẹ: Hop độc tấu', why: 'nghe tiếng hát bằng chân' },
  { t: HIT.snap2, kind: 'chụp, sticker 2 bay lên ô', why: 'lấp ô 2 "Leg song!"' },
  { t: HIT.crouch[0], kind: 'đẩy vào chân sau co lại, lò xo nén', why: 'bí mật 3: chân như lò xo' },
  { t: HIT.launch, kind: 'BOING! máy ngước theo Hop lên trời', why: 'khoảnh khắc wow: nhảy ra khỏi kính' },
  { t: HIT.land, kind: 'cảnh rộng sân khấu, Hop đáp cạnh Chirp', why: 'nối vào song tấu' },
  { t: HIT.heart[0], kind: 'nốt nhạc xếp thành trái tim', why: 'điệp khúc lần 1: "Tummy ears, and legs that sing!"' },
  { t: HIT.star[0], kind: 'nốt thành ngôi sao, rồi mặt cười', why: 'giữ nhịp đổi hình trong song tấu' },
  { t: HIT.snap3, kind: 'kính giơ lên chụp → match cut qua sticker → trang sổ', why: 'chuyển cảnh kính → sổ có chuyển động nối' },
  { t: HIT.counts[0], kind: 'Hop nhún, Albie đếm chân', why: '"Six legs? In you go!" nói trong lúc có hành động' },
  { t: HIT.plunge[0], kind: 'đẩy nhẹ: Hop nhảy vào trang', why: 'câu cửa miệng có hành động' },
  { t: HIT.flip[0], kind: 'lật trang về sân khấu', why: 'mở gag' },
  { t: HIT.encore[0], kind: 'máy rung theo song tấu to dần', why: 'gag: "Louder!"' },
  { t: HIT.chirpCover, kind: 'đẩy nhanh từng người bịt "tai"', why: 'bất ngờ: mỗi người bịt một chỗ, Miss Loupe bịt... kính' },
  { t: L('L16').t, kind: 'lùi ra, Miss Loupe cười ngượng', why: '"Oops! Too loud!"' },
  { t: L('L17').t, kind: 'lùi ra cả nhóm nhún theo nhạc khe khẽ', why: 'điệp khúc lần 2: trẻ đọc theo, nhạc chơi giai điệu' },
  { t: L('L18').t, kind: 'đẩy vào Miss Loupe hỏi; chữ móc trở lại, về khung 0', why: 'CTA và vòng lặp liền' },
];

// 10 khung cho storyboard
export const BOARD = [
  { t: 0.2, shot: '1', frame: 'Medium · loop frame', dur: '2.5 s', line: '(PWEEET!) ♪ Where does a grasshopper hide its ears?' },
  { t: 1.5, shot: '2', frame: 'Medium · knee / tummy / lens', dur: '1.6 s', line: '♪ Where does a grasshopper hide its ears?' },
  { t: 3.45, shot: '4', frame: 'Logo in the lens', dur: '0.8 s', line: '(BIG SECRETS of tiny bugs)' },
  { t: 7.7, shot: '6', frame: 'Big lens · Nope!', dur: '0.8 s', line: 'Are they on its legs, like Chirp? ♪ Nope!' },
  { t: 10.1, shot: '7', frame: 'Big lens · tummy ear', dur: '1.5 s', line: '♪ Its ears are on its tummy!' },
  { t: 19.0, shot: '12', frame: 'Big lens · leg on wing', dur: '2.2 s', line: '♪ They rub a back leg on a wing!' },
  { t: 23.8, shot: '15', frame: 'Big lens · spring', dur: '1.6 s', line: '♪ And its back legs are like springs!' },
  { t: 28.0, shot: '18', frame: 'Wide · duet, heart (chorus 1)', dur: '1.1 s', line: '♪ Tummy ears, and legs that sing!' },
  { t: 32.6, shot: '21', frame: 'Album', dur: '1.1 s', line: 'Six legs? In you go!' },
  { t: 39.6, shot: '26', frame: 'Wide · too loud!', dur: '2.1 s', line: 'Oops! Too loud!' },
];

// Sự kiện âm thanh, khớp với chuyển động trong film.js (core/render/events.mjs → events.json → mix.py). Bảng cue đầy đủ ở SOUND.md.
// Tiếng nằm dưới lời thì ở dải cao và nhỏ (hoặc dải trầm); mỗi chuyển cảnh một tiếng riêng. run: chuỗi nhịp có chủ đích.
const TICKS = (t0, t1, step) => { const o = []; for (let t = t0; t < t1 - .01; t += step) o.push(+t.toFixed(3)); return o; };
// mỗi nhát kéo chân của Hop (bí mật 2): thưa dưới lời, dày hơn ở câu "They rub…", rồi độc tấu
export const SAWS = [...TICKS(HIT.saw[0], HIT.edge[0] - .1, .5), ...TICKS(HIT.edge[0] + .1, HIT.edge[1], .4), ...HIT.solo];
export const DUET = { hop: TICKS(HIT.duet[0] + .05, HIT.duet[1] - .1, .5), chirp: TICKS(HIT.duet[0] + .3, HIT.duet[1] - .1, .5) };
export const ENCORE = { hop: TICKS(HIT.encore[0], HIT.encore[1], .5), chirp: TICKS(HIT.encore[0] + .25, HIT.encore[1], .5) };
// điệp khúc 2: Chirp và Hop chơi lại khe khẽ, mỗi phách một nhát
export const DUET2 = { hop: TICKS(HIT.ch2[0] + .12, HIT.ch2[1] - .1, .5), chirp: TICKS(HIT.ch2[0] + .37, HIT.ch2[1] - .1, .5) };
export const EV = [
  // móc
  { t: 0, type: 'titlepop' },
  ...HIT.words.map((t, i) => ({ t, type: 'wordpop', n: i })),
  { t: HIT.whistle[0], type: 'whistle', d: HIT.whistle[1] - HIT.whistle[0], pan: -.2 },
  { t: HIT.startle, type: 'startle', pan: .1 },
  { t: HIT.startle + .02, type: 'chirp', pan: 0 },
  { t: HIT.hopUp[0] + .02, type: 'boing', v: .7, pan: .3 },
  { t: HIT.lensRing[0] + .05, type: 'glassring', d: HIT.lensRing[1] - HIT.lensRing[0], pan: -.4 },
  { t: HIT.hopUp[1], type: 'land', pan: .3 },
  { t: HIT.chirpLeg[0], type: 'swish', d: .3, v: .22, lo: 1200, hi: 4200, up: true, pan: 0 },
  { t: HIT.hopTurn[0], type: 'turn', pan: .3 },
  { t: HIT.giggle, type: 'giggle', v: .8, pan: -.3 },
  { t: HIT.puzzle[0], type: 'huh', pan: .1 },
  { t: HIT.slots, type: 'slots' },
  // logo
  { t: HIT.sting[0], type: 'zoom' },
  { t: HIT.sting[0] + .1, type: 'logo' },
  { t: HIT.sting[0] + .24, type: 'logopop' },                                    // chữ "of tiny bugs" của logo bật lên
  { t: HIT.sting[1] - .2, type: 'stingout' },                                   // máy xuyên qua mặt kính (cuối logo)
  // bí mật 1
  { t: HIT.kneeGlow[0] + .1, type: 'shine', pan: -.3 },
  { t: HIT.kneeGlow[0] + .35, type: 'chirp', v: .6, pan: -.3 },
  { t: HIT.slide[0], type: 'swipe', d: HIT.slide[1] - HIT.slide[0], lo: 900, hi: 3500, pan: .2 },
  { t: HIT.hush[0], type: 'hush', d: HIT.hush[1] - HIT.hush[0] },
  { t: HIT.xmark, type: 'nope', pan: .1 },
  ...[.15, .35, .55].map((d, i) => ({ t: +(HIT.xmark + d).toFixed(3), type: 'tap', n: i, run: 'footwag', pan: .2 })),
  { t: HIT.xmark + .05, type: 'textpop', n: 0, pan: -.3 },                       // chữ NOPE!
  { t: HIT.sweep[0] + .05, type: 'swish', d: HIT.sweep[1] - HIT.sweep[0], v: .25, lo: 600, hi: 3000, up: false, pan: .2 },
  { t: HIT.wing[0], type: 'curtain', d: HIT.wing[1] - HIT.wing[0], pan: .2 },
  { t: HIT.earOn, type: 'reveal', pan: .2 },
  { t: HIT.earOn + .05, type: 'textpop', n: 1, pan: .3 },                        // chữ TUMMY!
  ...HIT.chirps.map((t, i) => ({ t, type: 'chirp', n: i, run: 'chirps', pan: -.5 })),
  ...HIT.chirps.map((t, i) => ({ t: t + .18, type: 'eardrum', n: i, run: 'chirps', pan: .2 })),
  ...TICKS(HIT.walk[0], HIT.walk[1] - .2, .38).map((t, i) => ({ t, type: 'step', n: i, run: 'walk', pan: -.2 + i * .08, v: .5 })),
  { t: HIT.tummyPat[0] + .45, type: 'pat', pan: .3 },
  { t: HIT.far[0] + .1, type: 'farsong', d: HIT.far[1] - HIT.far[0] - .2, pan: .6 },
  ...HIT.farRings.map((t, i) => ({ t: t + .35, type: 'eardrum', n: i, v: .5, run: 'farrings', pan: .3 })),
  { t: HIT.snap1, type: 'snap' },
  { t: HIT.fly1[0], type: 'swipe', d: HIT.fly1[1] - HIT.fly1[0], lo: 1800, hi: 7000, pan: -.4 },
  { t: HIT.stamp1, type: 'slotstamp', n: 0, pan: -.3 },
  // bí mật 2
  { t: HIT.legUp[0], type: 'swish', d: .4, v: .2, lo: 900, hi: 3200, up: true, pan: .2 },
  ...SAWS.map((t, i) => ({ t, type: 'rasp', n: i, v: t < HIT.edge[1] ? .45 : 1, run: t < HIT.edge[0] ? 'saw1' : t < HIT.solo[0] - .05 ? 'saw2' : 'solo', pan: .2 })),
  { t: HIT.edge[0] + .05, type: 'shine', pan: .2 },
  { t: HIT.snap2, type: 'snap' },
  { t: HIT.fly2[0], type: 'swipe', d: HIT.fly2[1] - HIT.fly2[0], lo: 1800, hi: 7000, pan: 0 },
  { t: HIT.stamp2, type: 'slotstamp', n: 1, pan: 0 },
  // bí mật 3
  { t: HIT.crouch[0], type: 'creak', d: HIT.crouch[1] - HIT.crouch[0], pan: .2 },
  { t: HIT.launch, type: 'boing', v: 1.2, pan: .1 },
  { t: HIT.launch + .03, type: 'swish', d: .5, v: .35, lo: 700, hi: 4500, up: true, pan: 0 },
  { t: HIT.pull[0], type: 'zoomback', d: HIT.pull[1] - HIT.pull[0] },
  { t: HIT.land, type: 'land', v: 1.3, pan: .3 },
  // song tấu: nốt của Hop (kéo chân) và Chirp (gáy) là phần nhạc viết tay trong mix.py, không lặp lại ở đây
  { t: L('L13').t + .05, type: 'chorus', pan: 0 },
  ...['heart', 'star', 'smile'].map((k, i) => ({ t: HIT[k][0], type: 'shape', n: i, pan: 0 })),
  { t: HIT.finale, type: 'boing', v: .7, pan: .3 },
  { t: HIT.lensUp[0], type: 'swish', d: .35, v: .25, lo: 900, hi: 4000, up: true, pan: -.4 },
  { t: HIT.snap3, type: 'snap' },
  { t: HIT.zoomIn[0], type: 'zoomin', d: HIT.zoomIn[1] - HIT.zoomIn[0] },
  { t: HIT.zoomOut[0], type: 'zoomout', d: HIT.zoomOut[1] - HIT.zoomOut[0] },
  { t: HIT.zoomOut[1], type: 'page' },
  { t: HIT.stamp3, type: 'stamp' }, { t: HIT.stamp3 + .02, type: 'ding', m: 85 },
  // sổ
  { t: HIT.slotsDown[0], type: 'swipe', d: .4, lo: 1500, hi: 6000, pan: 0 },
  { t: HIT.slotsDown[1], type: 'slotstamp', n: 2, pan: -.2 },
  { t: HIT.hopIn[0], type: 'hopjoy', pan: .5 },                                  // Hop nhảy tưng tưng vào (hai boing nhỏ trong một cue)
  ...HIT.counts.map((t, i) => ({ t, type: 'count', n: i, run: 'albiecount', pan: .1 })),
  { t: HIT.plunge[0], type: 'boing', v: .9, pan: .2 },
  { t: HIT.gulp, type: 'gulp', pan: -.2 },
  { t: HIT.mini, type: 'pops', n: 3, step: .06, m: 89, v: .35 },
  { t: HIT.flip[0], type: 'flip', d: HIT.flip[1] - HIT.flip[0] },
  // gag
  { t: HIT.flip[1] + .1, type: 'hopjoy', pan: -.3 },
  ...ENCORE.hop.map((t, i) => ({ t, type: 'rasp', n: i, v: .9, run: 'encore', pan: .3 })),
  ...ENCORE.chirp.map((t, i) => ({ t, type: 'chirp', n: i, v: .9, run: 'encore', pan: -.3 })),
  { t: HIT.lensRing2[0], type: 'glassring', d: HIT.lensRing2[1] - HIT.lensRing2[0], pan: -.4 },
  { t: HIT.rollo[0], type: 'roll', d: HIT.rollo[1] - HIT.rollo[0], pan: .5 },   // trứng phục sinh: Rollo lăn trên bãi cỏ xa
  { t: HIT.chirpCover, type: 'cover', n: 0, run: 'covers', pan: -.1 },
  { t: HIT.chirpCover + .05, type: 'textpop', n: 2, pan: 0 },                    // chữ TOO LOUD!
  { t: HIT.hopCover, type: 'cover', n: 1, run: 'covers', pan: .3 },
  { t: HIT.loupeCover, type: 'cover', n: 2, run: 'covers', pan: -.4 },
  { t: HIT.loupeCover + .2, type: 'bonk', pan: -.4 },
  { t: HIT.giggle2, type: 'giggle', pan: -.2 },
  ...HIT.uncover.map((t, i) => ({ t, type: 'unpop', n: i, run: 'uncover', pan: [-.1, .3, -.4][i] })),
  // điệp khúc 2: Chirp và Hop chơi khe khẽ (phần nhạc viết tay trong mix.py), cả nhóm nhún
  { t: L('L17').t + .05, type: 'chorus', pan: 0 },
  // câu hỏi kết, nhặt lá cỏ, chữ móc trở lại
  { t: HIT.home[0], type: 'scurry', d: 1.0, pan: -.2 },
  { t: HIT.home[0] + 1.1, type: 'pluck', pan: -.2 },
  { t: HIT.recall, type: 'recall' },
];
export const SONG_JSON = resolveSong(SONG, DUR);              // tools/lines.mjs ghi vào timeline.json (groove.py song mode, qa)
