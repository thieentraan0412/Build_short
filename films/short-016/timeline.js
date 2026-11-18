// SHORT-016 · Where Do Bugs Go When It Snows? — timeline (chuẩn 11/2026b, _shared/QUALITY.md §8). Một nguồn thời gian duy nhất
// cho hình, phụ đề, giọng nói, nhạc. Tập A đặc biệt mùa đông: lưới phim 4/4 ở 120 BPM, 24 ô nhịp = 48 s, phát vòng lặp:
// khung cuối là đúng khung đầu (vườn tuyết, bông tuyết rơi trúng kính, chấm đỏ của Dot ló dưới chiếc lá).
// Giọng Đô trưởng: giai điệu quanh bậc 5–6. Ba bí mật = ba câu trả lời của điệp khúc "Huddle, fly away, or hide!": ong mật túm lại
// (kính ấm), bướm vua miền đông bay về Mexico (bản đồ trong trang của Albie), một số loài bọ rùa ngủ dưới lá (Dot đếm).
// (19/11/2026, Task.md "giọng kính lúp như SHORT-015", QUALITY.md §8.3, §9.10) KHÔNG AI HÁT: Miss Loupe nói bằng giọng SHORT-015
// (af_heart, lời dẫn .765, câu cửa miệng .9, ngữ điệu TTS gốc). Câu của cô vào đúng phách của bài (tune); bài hát nằm ở nhạc nền:
// giai điệu điệp khúc do nhạc cụ chơi dưới câu điệp khúc và ở khoảng trống (G.theme).
import { song, resolveLines, cardsOf, cardClashes, resolveSong, STANDARD as STD } from '../../_shared/song.js';
import { VOICES, CATCH_TUNE } from '../../_shared/voices.js';
export const STANDARD = STD;
// mốc từ thật của câu nói (voice/words.js, _shared/tools/wordtimes.py ghi sau bước giọng): phụ đề chạy chữ đúng lúc nói (Vocal QC 18/11/2026)
const WORDT = await import('./voice/words.js').then(m => m.default).catch(() => ({}));
// độ dài thật của từng câu (voice/dur.js, tools/lines.mjs ghi từ voice/dur.json): câu theo phách lấy dur ở đây (19/11/2026)
const DURS = await import('./voice/dur.js').then(m => m.default).catch(() => ({}));
export const BPM = 120, BEAT = 60 / BPM, METER = 4, BAR = BEAT * METER;
export const at = (bar, beat = 0) => (bar * METER + beat) * BEAT;
export const PACE = 1;                                        // tập A: câu nói ở tốc độ chuẩn của giọng

export const DUR = at(24);
// phần của bài hát (mỗi phần một BPM, ≥ 108): t0 và phách
const B112 = 60 / 112, B126 = 60 / 126, B124 = 60 / 124, B116 = 60 / 116;
const P_BEES = 3.8, P_MAP = 12.4, P_CH1 = 21.0, P_LADY = 24.0, P_CH2 = 42.2;
const hb = (t0, b, k) => +(t0 + k * b).toFixed(3);            // phách thứ k (có thể lẻ .5) của phần bắt đầu ở t0

// mốc hành động: hình (film.js), tiếng (EV, mix.py) và nhạc cùng đọc
export const HIT = {
  words: [0, .12],
  // móc: bông tuyết (rơi từ cuối phim) đậu trúng kính → Miss Loupe rùng mình "brrr", khăn bay; ngó trái, ngó phải: vườn vắng tanh;
  // Albie run cầm cập; hai dấu hỏi; ba ô sticker trống hiện ra
  plip: .02, brrr: [.05, .7], lookL: [.95, 1.4], lookR: [1.4, 1.9], albieShiver: [.3, 1.0], puzzle: [2.25, 2.95],
  titleOut: [2.55, 2.85], slots: 2.75, raise: 2.7,
  sting: [3.0, 3.8],                                          // logo 0,8 s lồng vào cú lao vào kính (titleSting)
  // bí mật 1: kính lớn trên tổ ong phủ tuyết (lặng im) → vặn vành kính "kính ấm": quả bóng ong rực cam → lao sâu: Waggle rung ngực
  heatTwist: [5.0, 5.35], heatOn: [5.2, 5.75], ballPulse: 6.0, deep: [9.0, 9.45],
  shakes: [0, 1, 2, 3, 4, 5, 6, 7, 8].map(k => hb(9.66, B112 / 2, k)),   // mỗi nửa phách một nhịp rung ngực của Waggle, gọn trong câu L04 (chuỗi có chủ đích)
  snap1: 11.98, fly1: [12.05, 12.5], stamp1: 12.55,
  // bí mật 2: kính thu về sân khấu; Albie hỏi; "Nope!" (dấu X); Albie mở trang bản đồ; kính lớn lướt theo đàn bướm vua xuống Mexico;
  // cả cánh rừng linh sam hoá cam
  lensDown: [12.4, 12.85], xmark: 14.8, mapOpen: [15.45, 16.0], flight: [16.0, 19.3], arrive: 18.25, trees: [18.35, 19.4],
  snap2: 19.95, fly2: [20.05, 20.55], stamp2: 20.6,
  // điệp khúc lần 1: về sân khấu, Miss Loupe và Albie nhún nhảy; mỗi từ khoá một ô sticker nảy (ô 3 còn "?")
  back: [20.0, 20.6],
  // bí mật 3: Miss Loupe nhảy sang đống lá cạnh hòn đá; hỏi; kính lớn: nhấc chiếc lá, lộ đám bọ rùa ngủ; Dot bật dậy đếm; ngáp, chui lại
  hopTo: [24.05, 24.55], lensUp: [26.85, 27.2], lift: [27.0, 27.45], dotUp: [27.4, 27.75], yawn: [32.7, 33.35], burrow: [33.2, 33.6],
  snap3: 33.7, zoomIn: [33.8, 34.1], zoomOut: [34.1, 34.45], stamp3: 34.6,
  // sổ: ô 1, 2 bay xuống trang; Albie đếm chân ("Six legs?"), há miệng, đớp đúng "go!"
  slotsDown: [34.45, 34.85], flip: [37.75, 38.2],
  // gag: Dot chui ra, vươn vai ngái ngủ "Is it spring yet?" — "Nope!" — cục tuyết trên cành rơi PLỘP xuống đống lá, Dot lặn mất,
  // chỉ còn chấm đỏ ló ra (như khung đầu); Albie cười khúc khích
  dotOut: [38.35, 38.75], stretch: [38.7, 39.5], plop: [40.55, 40.9], dive: [40.6, 41.1], giggle: 41.25,
  // điệp khúc lần 2 → CTA: hai bạn ôm nhau "huddle" như đàn ong → chữ móc trở lại, tuyết rơi, bông tuyết lớn rơi về phía kính (khung đầu)
  hug: [45.3, 46.5], recall: 46.75, home: [46.3, 47.4], flakeFall: [46.6, 48.0], loop: [47.4, at(24)],
};
export const SECS = [
  { id: 'hook', t0: 0, t1: HIT.sting[0] },
  { id: 'title', t0: HIT.sting[0], t1: HIT.sting[1] },      // logo 0,8 s lồng vào cú lao vào kính (qa.py nhận ra tập A)
  { id: 'bees', t0: HIT.sting[1], t1: HIT.stamp1 },          // bí mật 1: kính ấm
  { id: 'monarchs', t0: HIT.stamp1, t1: HIT.stamp2 },        // bí mật 2: bản đồ
  { id: 'chorus', t0: HIT.stamp2, t1: P_LADY },              // điệp khúc lần 1
  { id: 'ladybugs', t0: P_LADY, t1: HIT.zoomIn[0] },         // bí mật 3: Dot đếm
  { id: 'album', t0: HIT.zoomIn[0], t1: HIT.flip[1] },
  { id: 'gag', t0: HIT.flip[1], t1: DUR },                   // gag, điệp khúc lần 2, CTA, vòng lặp
];

// ---------- bài hát của tập: "Snowy Sleigh Song", Đô trưởng; mỗi phần một BPM và một vòng hợp âm ----------
export const SONG = song({
  key: 'C', film: BPM,
  motif: '5:.75 5:.25 5:.5 6:.5 7:1',                          // câu mở của điệp khúc ("Huddle, fly a-WAY"): ba nốt đứng rồi leo lên
  parts: [
    { t0: 0, bpm: 120, chords: 'C G7' },                       // A · móc (câu hỏi)
    { t0: P_BEES, bpm: 112, chords: 'C F C G7' },              // B · kính ấm, quả bóng ong
    { t0: P_MAP, bpm: 126, chords: 'F G7 C C' },              // C · "Nope!", bản đồ bướm vua
    { t0: P_CH1, bpm: 124, chords: 'G7 C' },                   // D · điệp khúc lần 1
    { t0: P_LADY, bpm: 116, chords: 'C F G7 C' },              // E · bọ rùa dưới lá (sổ và gag không có câu theo phách)
    { t0: P_CH2, bpm: 124, chords: 'G7 C' },                   // F · điệp khúc lần 2 (cùng nhịp, cùng hợp âm với D)
  ],
});
// (19/11/2026, Task.md "giọng kính lúp như SHORT-015") các câu trước đây hát nay là câu NÓI theo phách (tune): cùng lời, cùng chỗ trong bài
// (nốt đầu của bản nhạc rơi đúng phách cũ, câu bắt đầu sớm hơn 0,12 s), nên hình, mốc hành động và nhạc không dời. Bỏ mọi tham số của bộ hát
// (fill, glide, hi, sing.speed); tốc độ là của nhân vật (voices.js: Miss Loupe .9 × pace .85, câu cửa miệng .9). tune.mode chỉ còn là màu
// biểu cảm (film.js singExpr). Bản nhạc của điệp khúc (CHORUS) nhạc cụ chơi dưới câu điệp khúc (groove.py _double) và ở khoảng trống (G.theme).
const CHORUS = { mode: 'sing', chorus: 'snow', notes: '5:.75 5:.25 5:.5 6:.5 7:1 6:1 5:2' };   // "HUD-dle, fly a-WAY, or HIDE!": leo lên rồi đáp về Sol

// t, dur của câu nói thường: độ dài thật (voice/dur.json). Câu theo phách (tune): t từ bản nhạc, dur từ voice/dur.js. say: chữ đưa vào TTS
// khi chữ gốc bị Whisper nghe sai ("Huddle," → "Cuddle"; "Huddle!" thì qua cả hai Whisper), phụ đề vẫn là text.
// em: từ nhấn trên phụ đề; cta: câu kêu gọi cuối (≤ 2 s, cụ thể, Made for Kids).
export const LINES = resolveLines(SONG, VOICES, [
  { id: 'L01', emo: 'curious', who: 'loupe', text: 'Where do bugs go when it snows?', em: ['bugs', 'snows'],
    tune: { mode: 'half-sing', at: .5, notes: "3:.5 4:.5 5:.5 6:1 5:.5 4:.5 5:1.5" } },           // câu móc: hỏi, leo lên rồi hỏi lại ở Sol
  { id: 'L02', emo: 'excited', who: 'loupe', text: "Let's zoom in!", em: ['zoom'], catch: true, tune: { ...CATCH_TUNE.zoom, at: hb(P_BEES, B112, .5) } },
  { id: 'L03', emo: 'surprised', who: 'loupe', text: 'Look! A warm ball of bees!', em: ['warm', 'ball', 'bees'],
    tune: { mode: 'half-sing', at: hb(P_BEES, B112, 4), notes: "1':1 r:.5 5:.5 6:1 5:.75 4:.25 3:1.25" } },     // khám phá: reo lên rồi đi xuống nhẹ
  { id: 'L04', emo: 'calm', who: 'loupe', text: 'Wow! Some bees shake their wing muscles!', em: ['bees', 'shake', 'muscles'],
    tune: { mode: 'sing-talk', at: hb(P_BEES, B112, 10), notes: '5:.5 r:.25 5:.5 3:.5 r:.25 5:.5 5:.5 6:.5 5:.5 2:1' },
    was: 'Heater bees shake their wing muscles!', why: 'hát lên Whisper nghe "Heater" thành "Hear their" / "Keter" / "you derbies"; "Some bees" đúng nguồn, thuật ngữ HEATER BEES! thành chữ trên hình' },   // giải thích: rõ từ; thuật ngữ HEATER BEES! là chữ trên hình
  { id: 'L05', emo: 'curious', who: 'albie', t: 12.2, dur: 2.2, pace: .9, emo_k: .3, text: 'Do all butterflies stay?', em: ['butterflies'],
    was: 'Do all butterflies stay in the snow?', why: 'rút cho vừa nhịp trước "Nope!" (giọng Albie chậm: 2,04 s); 18/11/2026 đọc chậm thêm 10 %, uốn ngữ điệu nhẹ hơn (emo_k .3): ở .5 base.en nghe "Do all" thành "Dual"' },     // Albie hỏi: nói (giọng trầm, tương phản)
  { id: 'L06', emo: 'playful', who: 'loupe', text: 'Nope!', catch: true, tune: { ...CATCH_TUNE.nope, at: hb(P_MAP, B126, 5) } },
  { id: 'L07', emo: 'excited', who: 'loupe', text: 'These monarchs fly all the way to Mexico!', em: ['monarchs', 'fly', 'Mexico'], split: [3],
    tune: { mode: 'half-sing', at: hb(P_MAP, B126, 7.5), notes: "5:.5 1':.5 1':.5 6:1 5:1.25 4:.25 5:1.25 4:.25 5:1 3:.5 3:1.5" } },   // từ trên cao bay xuống phương nam
  { id: 'L08', emo: 'happy', who: 'loupe', text: 'Huddle, fly away, or hide!', say: 'Huddle! Fly away, or hide!', why: 'TTS đọc "Huddle!" (dấu chấm than): "Huddle," bị nghe thành "Cuddle"', em: ['huddle', 'fly', 'hide'], tune: { ...CHORUS, at: P_CH1 } },
  { id: 'L09', emo: 'curious', who: 'loupe', text: 'Who is hiding under here?', em: ['hiding'], pace: .76, why: 'giọng SHORT-015 (.765) đọc câu 7 âm tiết ở 4,4 âm tiết/s (> 4,0 cho trẻ 4–8 tuổi): chậm hơn 10 %',
    tune: { mode: 'half-sing', at: hb(P_LADY, B116, 1), notes: "3:.5 4:.5 5:1 6:.5 5:.5 4:.5 5:1.5" } },    // câu hỏi tò mò: leo lên, hỏi lại ở Sol
  { id: 'L10', emo: 'excited', who: 'dot', t: 27.45, dur: 1.99, pace: .8, text: 'One, two, three... so many!', say: 'One... two... three... so many!', em: ['many'],
    why: 'đếm chậm, mỗi số một nhịp, khớp hình Dot đếm (18/11/2026: trước đó 4,2 âm tiết/s, các số cách nhau 0,22 s)' },               // Dot đếm: nói
  { id: 'L11', emo: 'calm', who: 'loupe', text: 'Some ladybugs nap together under leaves!', em: ['ladybugs', 'nap', 'leaves'],
    tune: { mode: 'sing-talk', at: hb(P_LADY, B116, 11.5), notes: "5:.5 3:.5 5:.5 5:1 1':1 6:.5 6:.5 5:1 5:.5 4:.5 3:1" } },   // giải thích: rõ từ
  { id: 'L12', emo: 'proud', who: 'albie', t: 34.85, dur: 2.297, text: 'Six legs? In you go!', em: ['legs'], catch: true },
  { id: 'L13', emo: 'curious', who: 'dot', t: 38.4, dur: 1.506, pace: .82, text: 'Is it spring yet?', em: ['spring'] },             // gag: nói (ngái ngủ, chậm)
  { id: 'L14', emo: 'playful', who: 'loupe', t: 40.15, dur: .628, text: 'Nope!', catch: true },                                    // gag: nói
  { id: 'L15', emo: 'happy', who: 'loupe', text: 'Huddle, fly away, or hide!', say: 'Huddle! Fly away, or hide!', why: 'như L08', em: ['huddle', 'fly', 'hide'], tune: { ...CHORUS, at: P_CH2 } },
  { id: 'L16', emo: 'happy', who: 'loupe', t: 45.35, dur: 1.907, text: 'Can YOU huddle like a bee?', em: ['you', 'huddle', 'bee'], cta: true, pace: .78,
    why: 'đọc chậm hơn 22 % (Vocal QC: 5,0 âm tiết/s là nhanh với trẻ 4–8 tuổi; 18/11/2026 chủ kênh: giọng còn nhanh), vẫn ≤ 2 s' },   // CTA: việc làm thật
], { durs: DURS });
export const SECRET = { kw: ['huddle', 'fly', 'hide', 'bees', 'monarchs', 'ladybugs'] };   // từ khoá của bí mật: phụ đề nhấn, CTA nhắc lại
// Tấm phụ đề ≤ 7 từ, mỗi tấm một câu, chữ hiện từng từ theo lúc nói; không có phụ đề khi chữ móc đang trên hình.
export const CARDS = cardsOf(LINES, DUR, { max: 7, hide: [0, HIT.titleOut[1]], times: WORDT });
export const CARD_CLASHES = cardClashes(CARDS);
const L = id => LINES.find(l => l.id === id);
// (19/11/2026) hết đoạn nhạc của câu id (nốt cuối của tune / bản hát): hình nhảy theo điệp khúc chạy hết đoạn nhạc, không dừng khi lời hết
export const spanEnd = id => { const l = L(id), ns = (l.sung || l.tune || {}).notes; return ns && ns.length ? l.t + Math.max(...ns.map(n => n.t + n.d)) + .1 : l.t + l.dur; };
// (19/11/2026) lúc từ thứ w của câu id vang (giây, tuyệt đối): mốc từ thật của bản nói (voice/words.js); chưa có thì theo nốt của tune
export const wordAt = (id, w) => {
  const l = L(id), r = WORDT[id]; if (r && r[w]) return l.t + r[w][0];
  const n = ((l.sung || l.tune || {}).notes || []).find(n => n.w === w); return n ? l.t + n.t : l.t;
};

// 6 nhịp kể chuyện (Task.md mục C)
export const BEATS = [
  { id: 'hook', t0: 0, t1: HIT.titleOut[0], what: 'Bông tuyết đậu trúng kính, Miss Loupe rùng mình, hỏi "Where do bugs go when it snows?"; ngó quanh: vườn vắng tanh' },
  { id: 'setup', t0: HIT.titleOut[0], t1: HIT.heatOn[0], what: 'Ba ô sticker trống; logo lao vào kính; "Let\'s zoom in!": tổ ong phủ tuyết, lặng im' },
  { id: 'discovery', t0: HIT.heatOn[0], t1: HIT.flip[1], what: 'Kính ấm: quả bóng ong, Waggle rung ngực · "Nope!": bướm vua bay về Mexico, rừng hoá cam · điệp khúc lần 1 · bọ rùa ngủ dưới lá, Dot đếm · sổ: "Six legs? In you go!"' },
  { id: 'surprise', t0: HIT.flip[1], t1: L('L15').t, what: 'Dot ngái ngủ: "Is it spring yet?" — "Nope!" — cục tuyết rơi PLỘP, Dot lặn mất dưới lá' },
  { id: 'payoff', t0: L('L15').t, t1: L('L16').t, what: 'Điệp khúc lần 2: ba câu trả lời thành câu điệp khúc để nhớ (nhạc cụ chơi giai điệu)' },
  { id: 'cta', t0: L('L16').t, t1: DUR, what: '"Can YOU huddle like a bee?": hai bạn ôm nhau cho ấm; chữ móc trở lại; bông tuyết rơi về khung đầu' },
];
// cú máy / thay đổi hình có mục đích, mỗi 2–4 s (Task.md mục B); qa_musical.py so với thay đổi đo được
export const SHOTS = [
  { t: 0, kind: 'trung, vườn tuyết, máy đẩy vào; bông tuyết trúng kính', why: 'hành động ở khung 0: Miss Loupe rùng mình, chữ móc nảy' },
  { t: HIT.lookL[0], kind: 'kính lia trái rồi phải (ngó quanh)', why: 'phản ứng bằng hành động: vườn vắng tanh, không một con bọ' },
  { t: HIT.puzzle[0], kind: 'đẩy nhẹ, hai dấu hỏi; ba ô sticker trống', why: 'bí ẩn chưa giải: lý do để xem hết' },
  { t: HIT.sting[0], kind: 'logo lao vào kính → kính lớn trên tổ ong', why: 'nhận diện kênh ≤ 0,8 s, vào thẳng bí mật 1' },
  { t: HIT.heatTwist[0], kind: 'vặn vành kính: cả mặt kính đổi sang màu nhiệt', why: 'khoảnh khắc wow: quả bóng ong rực cam giữa tổ lạnh' },
  { t: 7.2, kind: 'đẩy vào tâm quả bóng (phóng trong kính)', why: '"a warm ball": tâm ấm nhất' },
  { t: HIT.deep[0], kind: 'lao sâu: cận cảnh toàn mặt kính, Waggle ở giữa', why: 'bí mật xảy ra: ngực rung, hơi ấm toả ra theo phách' },
  { t: 11.0, kind: 'lia trong kính theo vòng hơi ấm', why: 'kính không đứng quá 3 s trong câu giải thích' },
  { t: HIT.lensDown[0], kind: 'chụp, sticker 1 bay lên ô; kính thu về sân khấu', why: 'lấp ô 1 "HUDDLE"; Albie vào khung để hỏi' },
  { t: HIT.xmark, kind: 'đẩy vào Miss Loupe, dấu X "Nope!"', why: 'bất ngờ: không phải bướm nào cũng ở lại' },
  { t: HIT.mapOpen[0], kind: 'Albie mở trang; máy lao vào trang bản đồ', why: 'chuyển sang bản đồ có chuyển động nối' },
  { t: HIT.flight[0] + .6, kind: 'kính lớn lướt theo đàn bướm xuống phương nam', why: 'theo chuyến bay: "fly all the way to Mexico"' },
  { t: HIT.trees[0], kind: 'kính dừng ở Mexico, rừng hoá cam, rung nhẹ', why: 'khoảnh khắc wow thứ hai: hàng triệu bướm bám kín cây' },
  { t: HIT.back[0] + .6, kind: 'về sân khấu rộng, hai bạn nhún nhảy', why: 'điệp khúc lần 1: ô 1, 2 nảy theo lời, ô 3 còn "?"' },
  { t: HIT.hopTo[0], kind: 'lia sang đống lá cạnh hòn đá', why: 'bí mật 3 ở chỗ chấm đỏ đã ló ra từ khung đầu' },
  { t: HIT.lensUp[0], kind: 'kính lớn trên chiếc lá, lá nhấc lên', why: 'lộ đám bọ rùa ngủ' },
  { t: HIT.dotUp[0] + .3, kind: 'Dot bật dậy, số 1 2 3 hiện', why: 'nhân vật mới có lời: Dot đếm' },
  { t: 30.6, kind: 'lia dọc đám bọ rùa (phóng trong kính)', why: '"nap together": thấy cả đám ngủ sát nhau' },
  { t: HIT.yawn[0], kind: 'Dot ngáp, chui lại vào đám', why: 'gài đạo cụ của gag kết' },
  { t: HIT.zoomIn[0], kind: 'chụp → match cut qua sticker → trang sổ', why: 'chuyển cảnh kính → sổ có chuyển động nối' },
  { t: +(L('L12').t + 1.4).toFixed(3), kind: 'đẩy vào Albie há miệng', why: '"Six legs? In you go!" nói trong lúc có hành động' },
  { t: HIT.flip[0], kind: 'lật trang về vườn tuyết, Dot chui ra', why: 'mở gag' },
  { t: L('L14').t, kind: 'đẩy nhanh, dấu X, cục tuyết rơi PLỘP', why: 'gag: "Nope!" và Dot lặn mất' },
  { t: L('L15').t, kind: 'lùi ra hai bạn nhảy, ba sticker nảy', why: 'điệp khúc lần 2: trẻ đọc theo, nhạc chơi giai điệu' },
  { t: L('L16').t, kind: 'đẩy vào hai bạn ôm nhau, chữ móc trở lại, về bố cục khung 0', why: 'CTA và vòng lặp liền' },
];

// 10 khung cho storyboard
export const BOARD = [
  { t: .3, shot: '1', frame: 'Medium, snowy garden · loop frame', dur: '3.0 s', line: '♪ Where do bugs go when it snows?' },
  { t: 1.6, shot: '2', frame: 'Medium · empty garden', dur: '1.0 s', line: '♪ …when it snows?' },
  { t: 6.6, shot: '4', frame: 'Big lens · warm view', dur: '2.0 s', line: '♪ Look! A warm ball of bees!' },
  { t: 10.4, shot: '6', frame: 'Macro · Waggle shakes', dur: '2.0 s', line: '♪ Heater bees shake their wing muscles!' },
  { t: 14.9, shot: '9', frame: 'Two-shot · Nope!', dur: '0.7 s', line: 'Do all butterflies stay? ♪ Nope!' },
  { t: 19.2, shot: '12', frame: 'Lens on the map · Mexico', dur: '1.2 s', line: '♪ …all the way to Mexico!' },
  { t: 22.3, shot: '13', frame: 'Wide · chorus 1', dur: '3.4 s', line: '♪ Huddle, fly away, or hide!' },
  { t: 28.6, shot: '16', frame: 'Big lens · Dot counts', dur: '2.0 s', line: 'One, two, three... so many!' },
  { t: 36.2, shot: '20', frame: 'Album', dur: '4.4 s', line: 'Six legs? In you go!' },
  { t: 40.75, shot: '22', frame: 'Medium · PLOP', dur: '1.0 s', line: 'Is it spring yet? Nope!' },
];

// sự kiện âm thanh, khớp với chuyển động trong film.js (core/render/events.mjs → events.json → mix.py). Bảng cue đầy đủ ở SOUND.md.
// run: chuỗi nhịp có chủ đích (Waggle rung ngực theo phách, đàn bướm vỗ cánh, đếm) — qa_musical.py không tính là lặp máy móc.
const FLAPS = [0, 1, 2, 3, 4, 5, 6].map(k => hb(HIT.flight[0] + .2, B126, k));
// Dot đếm: hình bật số đúng lúc giọng đọc số (mốc từ thật trong voice/words.js; chưa có thì theo nhịp 0,5 s)
export const DOTCOUNT = [0, 1, 2].map(i => +(L('L10').t + .03 + (WORDT.L10?.[i]?.[0] ?? [.02, .52, 1.0][i])).toFixed(3));
// Albie đếm chân và đớp theo câu L12 (18/11/2026: L12 vào sớm 0,15 s để chủ đề nhạc vừa khoảng trống trước khi lật trang)
export const ALBCOUNT = [.25, .5, .75].map(k => +(L('L12').t + k).toFixed(3));
export const GULP = +(L('L12').t + 1.95).toFixed(3);
// lúc chân chạm tuyết khi hai bạn nhún nhảy ở điệp khúc (124 BPM, film.js: |sin(phách·π)|): Miss Loupe mỗi phách, Albie lệch nửa phách mỗi hai phách
const DANCE = t0 => [...[1, 2, 3, 4, 5].map(k => t0 + .12 + k * B124), ...[1, 3, 5].map(k => t0 + .12 + (k - .5) * B124)].map(x => +x.toFixed(3)).sort((a, b) => a - b);
export const EV = [
  // móc
  { t: 0, type: 'titlepop' },
  ...HIT.words.map((t, i) => ({ t, type: 'wordpop', n: i })),
  { t: HIT.plip, type: 'plip', pan: -.2 },
  { t: HIT.brrr[0], type: 'brrr', d: HIT.brrr[1] - HIT.brrr[0], pan: -.2 },
  { t: HIT.albieShiver[0], type: 'chatter', d: HIT.albieShiver[1] - HIT.albieShiver[0], pan: .35 },
  { t: HIT.lookL[0], type: 'swish', d: .4, v: .25, lo: 900, hi: 3200, up: true, pan: -.5 },
  { t: HIT.lookR[0], type: 'swish', d: .4, v: .25, lo: 900, hi: 3200, up: false, pan: .5 },
  { t: HIT.puzzle[0], type: 'huh', pan: .1 },
  { t: HIT.slots, type: 'slots' },
  // logo, bí mật 1
  { t: HIT.sting[0], type: 'zoom' },
  { t: HIT.sting[0] + .1, type: 'logo' },
  { t: HIT.sting[0] + .24, type: 'logopop' },                                    // chữ "of tiny bugs" của logo bật lên
  { t: HIT.sting[1] - .2, type: 'stingout' },                                   // máy xuyên qua mặt kính (cuối logo)
  { t: HIT.heatTwist[0], type: 'twist', d: HIT.heatTwist[1] - HIT.heatTwist[0], pan: -.2 },
  { t: HIT.heatOn[0] + .05, type: 'warmup', d: HIT.heatOn[1] - HIT.heatOn[0], pan: 0 },
  { t: HIT.heatOn[0] + .1, type: 'textpop', n: 0, pan: 0 },                      // chữ WARM VIEW!
  { t: HIT.ballPulse, type: 'hum', d: 2.6, pan: 0 },
  { t: HIT.deep[0], type: 'deep', d: HIT.deep[1] - HIT.deep[0] },
  { t: HIT.deep[1], type: 'beebuzz', d: HIT.snap1 - HIT.deep[1], pan: 0 },      // Waggle và cả đàn vo ve khi máy lao vào quả bóng
  { t: HIT.shakes[0] - .25, type: 'textpop', n: 1, pan: 0 },                     // chữ HEATER BEES!
  ...HIT.shakes.map((t, i) => ({ t, type: 'buzzshake', n: i, run: 'shake', pan: -.1 + .025 * i })),
  { t: HIT.snap1, type: 'snap' },
  { t: HIT.fly1[0], type: 'swipe', d: HIT.fly1[1] - HIT.fly1[0], lo: 1800, hi: 7000, pan: -.4 },
  { t: HIT.stamp1, type: 'slotstamp', n: 0, pan: -.3 },
  // bí mật 2
  { t: HIT.lensDown[0], type: 'lensdown', d: HIT.lensDown[1] - HIT.lensDown[0] },
  { t: HIT.lensDown[1] - .05, type: 'albiehop', pan: .3 },
  { t: HIT.xmark, type: 'nope', pan: -.1 },
  { t: HIT.mapOpen[0], type: 'pageopen', d: HIT.mapOpen[1] - HIT.mapOpen[0], pan: .2 },
  { t: HIT.mapOpen[1], type: 'textpop', n: 2, pan: .1 },                        // nhãn EASTERN NORTH AMERICA
  { t: HIT.flight[0] + .1, type: 'gust', d: 2.2, up: false, pan: .3 },           // gió vút theo đàn bướm bay xuống
  ...FLAPS.map((t, i) => ({ t, type: 'flutter', n: i, run: 'flight', pan: .4 - .12 * i })),
  { t: 16.55, type: 'sign', pan: .1 },
  { t: 17.75, type: 'textpop', n: 3, pan: -.2 },                                // nhãn MEXICO
  { t: HIT.arrive, type: 'arrive', pan: -.2 },
  { t: HIT.trees[0], type: 'trees', d: HIT.trees[1] - HIT.trees[0], pan: -.2 },
  { t: HIT.trees[0] + .05, type: 'textpop', n: 4, pan: 0 },                     // chữ MILLIONS!
  { t: HIT.snap2, type: 'snap' },
  { t: HIT.fly2[0], type: 'swipe', d: HIT.fly2[1] - HIT.fly2[0], lo: 1800, hi: 7000, pan: 0 },
  { t: HIT.stamp2, type: 'slotstamp', n: 1, pan: 0 },
  // điệp khúc lần 1
  { t: HIT.back[0], type: 'gust', d: .6, up: true, pan: -.2 },                    // bản đồ gập về trang của Albie
  { t: P_CH1, type: 'chorus', pan: 0 },
  ...[0, 1].map(i => ({ t: +(P_CH1 + i * .484).toFixed(3), type: 'slotbounce', n: i, pan: -.3 + .3 * i })),   // ô 1, 2 nảy theo "Huddle", "fly"
  { t: 23.0, type: 'qpop', pan: .3 },
  ...DANCE(P_CH1).map((t, i) => ({ t, type: 'snowstep', n: i, run: 'dance1', pan: i % 2 ? -.3 : .3 })),   // nhún nhảy trên tuyết theo phách
  // bí mật 3
  { t: HIT.hopTo[0], type: 'hopL', pan: .3 },
  { t: HIT.hopTo[1], type: 'landsnow', pan: .35 },
  { t: HIT.lensUp[0], type: 'lensup', d: .35, pan: .3 },
  { t: HIT.lift[0], type: 'leaflift', d: HIT.lift[1] - HIT.lift[0], pan: .3 },
  { t: HIT.dotUp[0] + .05, type: 'popup', pan: 0 },
  ...DOTCOUNT.map((t, i) => ({ t, type: 'count', n: i, run: 'dotcount', pan: -.3 + .3 * i })),
  { t: DOTCOUNT[2] + .45, type: 'textpop', n: 5, pan: 0 },                      // chữ SO MANY!
  { t: HIT.yawn[0], type: 'yawn', pan: 0 },
  { t: HIT.burrow[0] - .15, type: 'burrow', d: HIT.burrow[1] - HIT.burrow[0] + .15, pan: 0 },   // (19/11/2026) Dot bắt đầu chui ở 33,0 s (av_sync); trước đây L11 còn đang hát ở đó nên không lộ
  { t: HIT.snap3, type: 'snap' },
  { t: HIT.zoomIn[0], type: 'zoomin', d: HIT.zoomIn[1] - HIT.zoomIn[0] },
  { t: HIT.zoomOut[0], type: 'zoomout', d: HIT.zoomOut[1] - HIT.zoomOut[0] },
  { t: HIT.zoomOut[1], type: 'page' },
  { t: HIT.stamp3, type: 'stamp' }, { t: HIT.stamp3 + .02, type: 'ding', m: 89 },
  // sổ
  { t: HIT.slotsDown[0], type: 'swipe', d: .4, lo: 1500, hi: 6000, pan: 0 },
  { t: HIT.slotsDown[1], type: 'slotstamp', n: 2, pan: -.2 },
  ...ALBCOUNT.map((t, i) => ({ t, type: 'count', n: 3 + i, run: 'albiecount', pan: -.2 + .15 * i })),
  { t: GULP, type: 'gulp', pan: -.2 },
  { t: HIT.flip[0], type: 'flip', d: HIT.flip[1] - HIT.flip[0] },
  // gag
  { t: HIT.dotOut[0], type: 'popup', pan: .3 },
  { t: HIT.stretch[0], type: 'stretch', d: HIT.stretch[1] - HIT.stretch[0], pan: .3 },
  { t: L('L14').t + .05, type: 'nope', pan: -.2 },
  { t: HIT.plop[0], type: 'whee', d: HIT.plop[1] - HIT.plop[0], pan: .3 },
  { t: HIT.plop[1], type: 'plop', pan: .3 },
  { t: HIT.dive[0] + .1, type: 'burrow', d: .45, pan: .3 },
  { t: HIT.giggle, type: 'giggle', pan: .1 },
  // điệp khúc lần 2, CTA, vòng lặp
  { t: P_CH2, type: 'chorus', pan: 0 },
  ...DANCE(P_CH2 - .12).map((t, i) => ({ t, type: 'snowstep', n: i, run: 'dance2', pan: i % 2 ? -.3 : .3 })),
  ...[0, 1, 2].map(i => ({ t: +(P_CH2 + [0, .484, 1.452][i]).toFixed(3), type: 'badgepop', n: i, pan: -.4 + .4 * i })),   // ba sticker bật lên theo từ khoá
  { t: HIT.hug[0], type: 'albiehop', pan: -.1 },                                 // Albie nhảy tới ôm
  { t: HIT.hug[0] + .35, type: 'landsnow', pan: 0 },
  { t: HIT.hug[0] + .1, type: 'hug', pan: 0 },
  { t: HIT.home[0], type: 'hopL', pan: -.1 },                                    // hai bạn nhảy về chỗ của khung đầu
  { t: HIT.home[1] - .05, type: 'landsnow', v: .7, pan: .1 },
  { t: HIT.recall, type: 'recall' },
  { t: HIT.flakeFall[0], type: 'snowfall', d: DUR - HIT.flakeFall[0], pan: -.2 },
];
export const SONG_JSON = resolveSong(SONG, DUR);              // tools/lines.mjs ghi vào timeline.json (groove.py song mode, qa)
