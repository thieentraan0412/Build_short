// Giọng của kênh: mọi tập dùng cùng một giọng và cùng tốc độ cho mỗi nhân vật (kế hoạch §11.2–11.3).
// Engine: Kokoro-82M (Apache 2.0, chạy offline) qua core/tts/tts.py. Không dùng edge-tts cho bản đăng (giấy phép thương mại chưa rõ).
// Đổi giọng một nhân vật ở đây rồi dựng lại các tập: tools/lines.mjs của mỗi tập đọc bảng này.
// home (MIDI): chỗ đứng của giọng khi hát (Musical Storytelling, _shared/song.js đặt giai điệu quanh home ± 2 nửa cung, _shared/sing.py hát
// bằng chính giọng này). Đo bằng parselmouth trên các câu đã dựng (17/11/2026): loupe 197 Hz (55,1) khi nói, hát sáng hơn một chút ở 208 Hz;
// albie 84 Hz (40,4); crumb 273 Hz (60,7); dot 253 Hz (59,4); blink 320 Hz (63,5). child: giọng trẻ em, nốt hát không dưới 240 Hz (MIDI 59).
// Các trường home, child chỉ được đọc khi tập có câu hát; tập cũ không đổi.
export const VOICES = {
  loupe: { voice: 'af_heart', speed: .9, home: 56 },     // nữ, vui, rõ, chậm hơn người lớn nói chuyện
  albie: { voice: 'bm_lewis', speed: .8, home: 41 },     // nam trầm, lịch sự, chậm (thử A/B ở SHORT-001: films/short-001/TREATMENT.md §9)
  crumb: { voice: 'af_jessica', speed: .85, pitch: 5, home: 61, child: true },   // kiến con: trẻ em, cao, nhanh. pitch: nâng bao nhiêu nửa cung sau TTS (_shared/voicefx.py) — nghe nhỏ và trẻ hơn, nhanh hơn ~33%. +5 (≈270 Hz) để cách Miss Loupe (≈212 Hz) hơn 4 nửa cung (QA, _shared/QUALITY.md mục 7)
  dot: { voice: 'bf_isabella', speed: .9, pitch: 3.5, home: 60, child: true },     // bọ rùa "cô giáo nhí": giọng Anh, rõ ràng, ≈ 250 Hz (thử A/B ở LONG-001 TREATMENT §7). Khác Crumb (giọng Mỹ) ở chất giọng, cách Miss Loupe > 3 nửa cung
  blink: { voice: 'bf_lily', speed: 1, pitch: 8, home: 64, child: true },          // đom đóm: cao, nhanh, hay cười, ≈ 325 Hz, giọng Anh ("glowing" bị nghe thành "going" ở các giọng khác khi nâng cao)
  spindle: { voice: 'af_kore', speed: .95, pitch: -1 },     // nhện nhỏ (LONG-002): nữ, trầm ấm, hơi kịch, ≈ 157 Hz. A/B 5 giọng ở _shared/voice-tests/ (README): qua cả hai Whisper,
                                                            // cách Miss Loupe (205–218 Hz) 4,5–5,8 nửa cung; pitch −1 hạ nhẹ cao độ và âm sắc (voicefx.py), chậm hơn ~6 % nên speed .95
  rollo: { voice: 'am_michael', speed: .88, pitch: -2 },    // bọ hung già điềm tĩnh (LONG-003): nam già, trầm, chậm, ≈ 110 Hz, giọng Mỹ (Albie: giọng Anh, ≈ 97 Hz). A/B 7 giọng ở
                                                            // _shared/voice-tests/ (README): 0 / 1 lỗi Whisper trên 12 câu; pitch −2 hạ cao độ và làm chậm ~12 % (voicefx.py), nên speed .88
};

// Hồ sơ giọng của từng nhân vật (tiếng Anh), cho prompt tạo giọng hát / lồng tiếng (_shared/tools/vocal_qc.py, mục D của VOCAL-QC.md,
// Task.md 18/11/2026 "AI Vocal & Musical Quality Control"). Nhân vật mới: thêm một dòng khi chọn giọng.
export const PROFILE = {
  loupe: 'Miss Loupe, a cheerful adult female cartoon host (a walking magnifying glass): clear General American English, warm, bright and smiling, never breathy; speaking pitch about 210 Hz (G#3)',
  albie: 'Albie, a polite talking notebook: deep, slow, gentle adult male voice, Standard Southern British English, about 98 Hz',
  crumb: 'Crumb, a tiny excited ant kid: high, quick, giggly child voice, American English, about 270 Hz',
  dot: 'Dot, a little ladybug who counts everything like a small teacher: bright, clear child voice, British English, precise consonants, about 255 Hz',
  blink: 'Blink, a giggly firefly kid: very high, fast, laughing child voice, British English, about 325 Hz',
  spindle: 'Spindle, a small spider: warm, low, slightly dramatic female voice, American English, about 157 Hz',
  rollo: 'Mr. Rollo, a calm old dung beetle: slow, deep, kind male voice, American English, about 110 Hz',
};

// (18/11/2026, Lớp Voice, QUALITY.md §10) độ mạnh của cảm xúc khi _shared/emote.py uốn ngữ điệu câu nói (1 = mặc định):
// Albie và Mr. Rollo lịch sự, điềm tĩnh nên dải hẹp; trẻ con nảy hơn.
export const EMO_RANGE = { loupe: 1, albie: .5, crumb: 1.1, dot: .9, blink: 1.1, spindle: .9, rollo: .5 };

// Câu cửa miệng: viết đúng chữ này ở mọi tập để giọng, nhịp và phụ đề giống hệt nhau.
export const CATCH = {
  zoom: "Let's zoom in!",
  nope: 'Nope!',
  unlocked: 'Secret unlocked!',
  look: 'look closely!',
  sixLegs: 'Six legs? In you go!',
  bzzt: 'BZZT! Not a bug!',
};
// Câu cửa miệng khi được hát (Musical Storytelling): mỗi câu một giai điệu cố định của kênh, giống nhau ở mọi tập (bậc theo giọng của bài
// đang chơi). Không có ở đây thì câu cửa miệng nói đúng tốc độ chuẩn (QUALITY.md §7). Dùng: sing: { ...CATCH_TUNE.zoom, at: … }
export const CATCH_TUNE = {
  zoom: { mode: 'half-sing', notes: "5:.5 6:.5 1':1" },                  // "Let's zoom in!": đi lên, mở ra như ống kính
  nope: { mode: 'sing-talk', notes: '5:.5 ~1:1' },                       // "No-o-pe!": một âm tiết luyến rơi xuống quãng năm, hài
  sixLegs: { mode: 'half-sing', notes: "3:.5 3:.5 r:.5 3:.5 5:.5 1':1" },  // "Six legs? In you go!"
};
