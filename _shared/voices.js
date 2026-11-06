// Giọng của kênh: mọi tập dùng cùng một giọng và cùng tốc độ cho mỗi nhân vật (kế hoạch §11.2–11.3).
// Engine: Kokoro-82M (Apache 2.0, chạy offline) qua core/tts/tts.py. Không dùng edge-tts cho bản đăng (giấy phép thương mại chưa rõ).
// Đổi giọng một nhân vật ở đây rồi dựng lại các tập: tools/lines.mjs của mỗi tập đọc bảng này.
export const VOICES = {
  loupe: { voice: 'af_heart', speed: .9 },     // nữ, vui, rõ, chậm hơn người lớn nói chuyện
  albie: { voice: 'bm_lewis', speed: .8 },     // nam trầm, lịch sự, chậm (thử A/B ở SHORT-001: films/short-001/TREATMENT.md §9)
  crumb: { voice: 'af_jessica', speed: .85, pitch: 5 },   // kiến con: trẻ em, cao, nhanh. pitch: nâng bao nhiêu nửa cung sau TTS (_shared/voicefx.py) — nghe nhỏ và trẻ hơn, nhanh hơn ~33%. +5 (≈270 Hz) để cách Miss Loupe (≈212 Hz) hơn 4 nửa cung (QA, _shared/QUALITY.md mục 7)
  dot: { voice: 'bf_isabella', speed: .9, pitch: 3.5 },     // bọ rùa "cô giáo nhí": giọng Anh, rõ ràng, ≈ 250 Hz (thử A/B ở LONG-001 TREATMENT §7). Khác Crumb (giọng Mỹ) ở chất giọng, cách Miss Loupe > 3 nửa cung
  blink: { voice: 'bf_lily', speed: 1, pitch: 8 },          // đom đóm: cao, nhanh, hay cười, ≈ 325 Hz, giọng Anh ("glowing" bị nghe thành "going" ở các giọng khác khi nâng cao)
};

// Câu cửa miệng: viết đúng chữ này ở mọi tập để giọng, nhịp và phụ đề giống hệt nhau.
export const CATCH = {
  zoom: "Let's zoom in!",
  nope: 'Nope!',
  unlocked: 'Secret unlocked!',
  look: 'look closely!',
  sixLegs: 'Six legs? In you go!',
  bzzt: 'BZZT! Not a bug!',
};
