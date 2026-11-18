// <TẬP> · timeline (chuẩn 11/2026b, _shared/QUALITY.md §8). Một nguồn thời gian duy nhất cho hình, phụ đề, giọng hát, nhạc.
// Chép _shared/template/ thành films/<tập>/, rồi thay mọi chỗ ghi <…> và các ví dụ bên dưới bằng nội dung của tập (TREATMENT.md).
// Ví dụ ở đây chạy được ngay với tools/lines.mjs (một câu hát, một câu nói, một CTA) để kiểm tra khung.
import { song, resolveLines, cardsOf, cardClashes, resolveSong, STANDARD as STD } from '../../_shared/song.js';
import { VOICES, CATCH_TUNE } from '../../_shared/voices.js';
export const STANDARD = STD;                                  // bật nhóm kiểm "Chuẩn mới" của qa.py (_shared/qa_musical.py)
// (Vocal QC 18/11/2026) mốc từ thật của câu nói (voice/words.js do _shared/tools/wordtimes.py ghi sau bước giọng): phụ đề chạy chữ đúng lúc nói
const WORDT = await import('./voice/words.js').then(m => m.default).catch(() => ({}));
export const BPM = 120, BEAT = 60 / BPM, METER = 4, BAR = BEAT * METER;
export const at = (bar, beat = 0) => (bar * METER + beat) * BEAT;
export const PACE = .85;                                      // câu NÓI của bản B chậm hơn tập A ~15 % (câu hát theo nhịp của bài, câu cửa miệng giữ tốc độ chuẩn)
export const DUR = at(11);                                    // bản B 15–25 s, tập A ≤ 48 s (tập A: thêm cảnh { id: 'title', … } dài 0,8 s vào SECS)

// mốc hành động: hình (film.js), tiếng (EV, mix.py) và nhạc cùng đọc
export const HIT = {
  words: [0, .12],                                            // chữ móc nảy từng dòng
  titleOut: [2.9, 3.25],                                      // chữ móc rời đi (phụ đề bắt đầu sau mốc này)
  recall: DUR - 1.1,                                          // chữ móc trở lại ở cuối
  loop: [DUR - .6, DUR],                                      // bản B: vòng lặp liền (khung cuối mở về khung đầu)
};
export const SECS = [{ id: 'stage', t0: 0, t1: DUR }];

// ---------- bài hát của tập: giọng trưởng, mỗi phần một BPM (≥ 108) và một vòng hợp âm, motif (giai điệu đặc trưng) ----------
// Câu hát phải nằm trọn trong một phần; cảnh nhạc nào trong mix.py chồng lên câu hát dùng chords='song' và đúng BPM của phần đó.
export const SONG = song({
  key: 'C', film: BPM,
  motif: '3:.5 3:.25 5:.25 6:1',                              // nên là câu mở của điệp khúc: trẻ nghe hai, ba lần là nhớ
  parts: [
    { t0: 0, bpm: 120, chords: 'C G7' },                      // <phần 1 · móc>
    { t0: 8, bpm: 126, chords: 'C F G7 C' },                  // <phần 2 · khám phá + điệp khúc>
  ],
});
const CHORUS = { mode: 'sing', chorus: '<tên>', notes: "3:.5 3:.25 5:.25 6:1 5:.5 3:.25 5:.25 1':.75" };   // cùng lời, cùng nốt ở mọi lần

// t, dur của câu NÓI: độ dài thật (voice/dur.json sau lần dựng đầu). Câu HÁT: song.js suy ra từ sing.at và sing.notes.
// Kiểu hát: câu hỏi tò mò → half-sing cao · khám phá → half-sing · giải thích → sing-talk · kết luận / điệp khúc → sing · câu cửa miệng, gag, CTA → nói.
// Tốc độ (QUALITY.md §9.7): câu hát ≤ 3,0 âm tiết/s (từ nhấn, nốt cuối 1–1,5 phách); liền hơi: half-sing ...LEGATO, sing-talk ...LEGATO_TALK.
// Câu nói ≤ 3,5 âm tiết/s trên đoạn có tiếng: `pace` riêng (Dot thường .8); uốn ngữ điệu làm Whisper nghe sai thì `emo_k` nhỏ hơn cho câu đó.
// Chỉ ngân dài âm tiết cuối từ có nguyên âm dài (ngân âm tiết đầu / giữa từ → im giữa từ; vocal_qc.py báo "đứt giữa từ").
const LEGATO = { fill: .85, glide: .08 }, LEGATO_TALK = { speed: .85, fill: .75, glide: .05, hi: 2 };
// em: từ nhấn trên phụ đề; cta: câu kêu gọi cuối (≤ 2 s, cụ thể, Made for Kids: không comment / subscribe).
// (Vocal QC) câu đã sửa lời ghi was: '<lời cũ>' và why: '<lý do>'; style: '<vocal direction>' nếu khác mặc định (VOCAL-QC.md mục B).
// (Âm thanh 4 lớp) emo: cảm xúc của câu (happy · surprised · curious · excited · startled · calm · proud · playful); câu nói được
// _shared/emote.py uốn ngữ điệu theo emo; không ghi thì lines.mjs suy ra (câu cửa miệng → playful, CTA → happy, ? → curious, ! → excited).
export const LINES = resolveLines(SONG, VOICES, [
  { id: 'L01', who: 'loupe', text: 'Could you sing with your legs?', em: ['sing', 'legs'],
    sing: { mode: 'half-sing', at: .5, ...LEGATO, notes: "5:.5 5:.5 3:.5 5:.5 6:.5 1':1" } },
  { id: 'L02', who: 'loupe', t: 3.3, dur: 1.0, text: "Let's zoom in!", em: ['zoom'], catch: true },   // hoặc sing: { ...CATCH_TUNE.zoom, at: … }
  { id: 'L03', who: 'loupe', text: 'Pegs on the leg, scrape on the wing!', em: ['pegs', 'leg', 'wing'], sing: { ...CHORUS, at: 8 + 3 * 60 / 126 } },
  { id: 'L04', who: 'loupe', text: 'Pegs on the leg, scrape on the wing!', em: ['pegs', 'leg', 'wing'], sing: { ...CHORUS, at: 8 + (4 * 4 + 3) * 60 / 126 } },   // cùng vị trí trong ô nhịp như lần 1 (phách 4, bốn ô sau)
  { id: 'L05', who: 'loupe', t: DUR - 2.0, dur: 1.74, text: 'Can YOU make music with your legs?', em: ['you', 'legs'], pace: 1, cta: true },
]);
export const SECRET = { kw: ['pegs', 'leg', 'wing'] };       // từ khoá của bí mật: phụ đề nhấn, CTA nhắc lại
export const CARDS = cardsOf(LINES, DUR, { max: 7, hide: [0, HIT.titleOut[1]], times: WORDT });
export const CARD_CLASHES = cardClashes(CARDS);

// 6 nhịp kể chuyện (Task.md mục C): hook ≤ 3 s
export const BEATS = [
  { id: 'hook', t0: 0, t1: 2.9, what: '<hành động ở khung 0, câu móc>' },
  { id: 'setup', t0: 2.9, t1: 6, what: '<nhân vật và vấn đề>' },
  { id: 'discovery', t0: 6, t1: 12, what: '<bí mật xảy ra thành chuyển động; điệp khúc lần 1>' },
  { id: 'surprise', t0: 12, t1: 16, what: '<bất ngờ / gag, đạo cụ đã gài trước>' },
  { id: 'payoff', t0: 16, t1: DUR - 2, what: '<giải thích; điệp khúc lần 2>' },
  { id: 'cta', t0: DUR - 2, t1: DUR, what: '<CTA, chữ móc trở lại, vòng lặp>' },
];
// cú máy / thay đổi hình có mục đích, mỗi 2–4 s (Task.md mục B); qa_musical.py so với thay đổi đo được
export const SHOTS = [
  { t: 0, kind: '<khung>', why: '<mục đích>' }, { t: 2.9, kind: '…', why: '…' }, { t: 6, kind: '…', why: '…' }, { t: 9, kind: '…', why: '…' },
  { t: 12, kind: '…', why: '…' }, { t: 14.5, kind: '…', why: '…' }, { t: 16, kind: '…', why: '…' }, { t: 19, kind: '…', why: '…' },
];
export const BOARD = [{ t: .15, shot: '1', frame: '<khung>', dur: '2.9 s', line: '♪ Could you sing with your legs?' }];

// sự kiện âm thanh (core/render/events.mjs → events.json → mix.py); chuỗi nhịp có chủ đích ghi run: '<id>' (≤ 16 cue, ≤ 4 s)
export const EV = [
  { t: 0, type: 'titlepop' },
  ...HIT.words.map((t, i) => ({ t, type: 'wordpop', n: i })),
  { t: 8.2, type: 'chorus' },
  { t: HIT.recall, type: 'recall' },
];
export const SONG_JSON = resolveSong(SONG, DUR);              // tools/lines.mjs ghi vào timeline.json (groove.py song mode, qa)
