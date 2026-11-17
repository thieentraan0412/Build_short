"""Nhóm kiểm "Chuẩn 11/2026b" (Task.md 17/11/2026: chuẩn sản xuất mới + Musical Storytelling, _shared/QUALITY.md §8).
Gọi từ _shared/qa.py khi timeline.json có "standard" ≥ "2026-11b" (tập dựng theo _shared/template/). Tập cũ không chạy nhóm này.
Đọc: timeline.json (standard, song, beats, shots, secret, lines có sung / cta), cards.json, events.json, out/music.json,
out/safezone.json (máy quay, kính, chữ móc, biểu cảm: _shared/tools/safezone.mjs --step 0.1), voice/sung.json, voice/asr-sung.json,
out/stem_mus.wav, out/stem_vox.wav. Mục nào cần hiệu chỉnh trên tập thật (CALIBRATING) thì tối đa là CẢNH BÁO cho tới khi ghi ngưỡng vào
bảng hiệu chỉnh của QUALITY.md."""
import os, re, json, glob, collections
import numpy as np

STD = '2026-11b'
CALIBRATING = {'cadence', 'duck'}                     # đo mới, chưa hiệu chỉnh trên tập thật: CHƯA ĐẠT hạ thành CẢNH BÁO
INTERJ = {'oops', 'wow', 'hey', 'look', 'yeah', 'nope', 'yes', 'no', 'tada', 'hooray', 'whoa', 'uhoh', 'huh', 'ooh', 'aha', 'yay', 'bzzt', 'oh', 'hi', 'hello', 'boo', 'squeak'}
ACTION = {'look', 'listen', 'find', 'try', 'count', 'watch', 'spot', 'rub', 'wiggle', 'go', 'say', 'sing', 'clap', 'jump', 'hop', 'point', 'touch', 'tap', 'draw', 'ask', 'search'}
BANNED = re.compile(r'comment|subscribe|bell|notification|\blink\b|follow|share|hit like|\blike button', re.I)
MODES = ('sing-talk', 'half-sing', 'sing'); LOCK = {'sing-talk': .3, 'half-sing': .45, 'sing': .6}
BEATS = ('hook', 'setup', 'discovery', 'surprise', 'payoff', 'cta')
HEADINGS = ('Đánh giá ý tưởng', 'Hook', 'Kịch bản', 'Storyboard', 'Chuyển động', 'phụ đề', 'Voiceover', 'SFX', 'CTA', 'Checklist',
            'Music Direction', 'Music Timeline', 'Sing-along', 'AI Music Generation Prompts', 'Sound Effects Timeline', 'Final Audio Checklist')
bare = lambda w: re.sub(r"[^a-z0-9]", '', w.lower())


def voice_homes(lib):
    try: s = open(os.path.join(lib, '_shared', 'voices.js'), encoding='utf-8').read()
    except OSError: return {}
    return {m.group(1): float(m.group(2)) for m in re.finditer(r'(\w+):\s*\{[^}]*?home:\s*([\d.]+)', s)}


def run(C):
    row, OK, WARN, FAIL = C['row'], C['OK'], C['WARN'], C['FAIL']
    TL, EV, LINES, DUR, LONG = C['TL'], C['EV'], C['LINES'], C['DUR'], C['LONG']
    FILM, OUT, LIB, diff, FPS, SZ = C['FILM'], C['OUT'], C['LIB'], C['diff'], C['FPS'], C.get('SZ')
    title = C.get('title'); A_EP = bool(title)
    def cap(key, st): return WARN if (st == FAIL and key in CALIBRATING) else st
    GV, GT, GS, GA = '8a Chuẩn mới · Hình', '8b Chuẩn mới · Chữ và lời', '8c Chuẩn mới · Bài hát', '8d Chuẩn mới · Âm thanh'
    rd = lambda p, d=None: json.load(open(p, encoding='utf-8')) if os.path.exists(p) else d

    # ---------- độ dài ----------
    if not LONG:
        lim = (0, 48) if A_EP else (15, 25)
        row(GV, 'Độ dài', OK if lim[0] <= DUR <= lim[1] else FAIL, f'{DUR:.1f} s ({"tập A" if A_EP else "bản B"})', 'bản B 15–25 s, tập A ≤ 48 s (hát dài hơn nói: lines.mjs in quỹ thời gian)')

    # ---------- 6 nhịp kể chuyện ----------
    B = TL.get('beats') or []
    ids = [b['id'] for b in B]
    if not B: row(GV, '6 nhịp kể chuyện', FAIL, 'thiếu BEATS trong timeline.js', ' → '.join(BEATS))
    else:
        first = [ids.index(k) if k in ids else -1 for k in BEATS]; missing = [k for k, i in zip(BEATS, first) if i < 0]
        order = [i for i in first if i >= 0] == sorted(i for i in first if i >= 0) and ids[0] == 'hook' and ids[-1] == 'cta'
        hook = next(b for b in B if b['id'] == 'hook') if 'hook' in ids else None
        hook_ok = hook is not None and (LONG or hook['t1'] <= 3.0 + 1e-6)
        st = FAIL if missing or not order else (OK if hook_ok else WARN)
        row(GV, '6 nhịp kể chuyện', st, ' · '.join(f"{b['id']} {b['t0']:.1f}–{b['t1']:.1f}" for b in B) + (f"; thiếu {', '.join(missing)}" if missing else ''),
            'Hook → Setup → Discovery → Surprise → Payoff → CTA, đúng thứ tự; hook ≤ 3 s (video dài: mỗi chương có mở, khám phá, kết)')

    # ---------- danh sách cú máy (SHOTS) ----------
    SH = sorted(TL.get('shots') or [], key=lambda s: s['t'])
    lim_ok, lim_fail = (5, 6) if LONG else (4, 4.5)
    if not SH: row(GV, 'Danh sách cú máy (SHOTS)', FAIL, 'thiếu SHOTS trong timeline.js', f'mỗi ≤ {lim_ok} s một cú máy / thay đổi hình có mục đích')
    else:
        ts = [0.] + [s['t'] for s in SH if 0 < s['t'] < DUR] + [DUR]; gaps = np.diff(ts); worst = float(gaps.max()); at = ts[int(np.argmax(gaps))]
        nowhy = [s for s in SH if not s.get('why')]; short = float((gaps < 1.0).mean())
        st = FAIL if worst > lim_fail else OK if worst <= lim_ok else WARN
        if st == OK and (nowhy or short > .3): st = WARN
        row(GV, 'Danh sách cú máy (SHOTS)', st, f'{len(SH)} cú, khoảng dài nhất {worst:.1f} s (từ {at:.1f} s)' + (f'; {len(nowhy)} cú thiếu why' if nowhy else '') + (f'; {short:.0%} khoảng < 1 s' if short > .3 else ''),
            f'≤ {lim_ok} s (Task.md: mỗi 2–4 s một thay đổi đáng chú ý), mỗi cú có why (mục đích), không cắt vụn (≤ 30 % khoảng < 1 s)')

    # ---------- nhịp đổi hình đo được ----------
    evs = [i / FPS for i in range(1, len(diff)) if diff[i] > 18]                       # cắt cảnh
    evs += [i / FPS for i in range(1, len(diff)) if diff[i] > 8]                        # hành động lớn
    frames = (SZ or {}).get('frames') or []
    step = float((SZ or {}).get('step') or .25)
    if frames:
        T = np.array([F['t'] for F in frames]); k = max(1, int(round(.6 / step)))
        cam = [F.get('cam') for F in frames]
        if sum(c is not None for c in cam) > len(cam) * .5:
            z = np.array([c['z'] if c else np.nan for c in cam]); cx = np.array([c['cx'] if c else np.nan for c in cam]); cy = np.array([c['cy'] if c else np.nan for c in cam])
            sm = lambda a: np.convolve(np.nan_to_num(a, nan=np.nanmean(a)), np.ones(3) / 3, 'same')
            z, cx, cy = sm(z), sm(cx), sm(cy)
            for i in range(k, len(T)):
                if abs(np.log(z[i] / z[i - k])) >= np.log(1.05) or abs(cx[i] - cx[i - k]) * z[i] >= 45 or abs(cy[i] - cy[i - k]) * z[i] >= 45: evs.append(float(T[i]))
        for i in range(1, len(frames)):
            a, b = frames[i - 1].get('lens') or [], frames[i].get('lens') or []
            if len(a) != len(b): evs.append(float(T[i])); continue
            if a and b and (abs(b[0]['r'] / a[0]['r'] - 1) > .15 / k or np.hypot(b[0]['x'] - a[0]['x'], b[0]['y'] - a[0]['y']) > 60 / k): evs.append(float(T[i]))
            if i >= k and a and b:                                         # độ phóng / lia trong kính (loupe(..., { mag, pan })) so với 0,6 s trước
                c0 = (frames[i - k].get('lens') or [{}])[0]
                if 'mag' in b[0] and 'mag' in c0 and c0['mag'] and abs(np.log(b[0]['mag'] / c0['mag'])) >= np.log(1.08): evs.append(float(T[i]))
                if 'pan' in b[0] and 'pan' in c0 and abs(b[0]['pan'] - c0['pan']) >= 25: evs.append(float(T[i]))
            ea = {(f['who'], f.get('ex')) for f in frames[i - 1]['faces'] if f['r'] >= 30}; eb = {(f['who'], f.get('ex')) for f in frames[i]['faces'] if f['r'] >= 30}
            if ea and eb and ea != eb and {w for w, _ in ea} == {w for w, _ in eb}: evs.append(float(T[i]))
    evs = sorted(set(round(t, 2) for t in evs))
    ts = [0.] + evs + [DUR]; gaps = np.diff(ts); worst = float(gaps.max()); at = ts[int(np.argmax(gaps))]
    okL, warnL = (5, 7) if LONG else (4, 5)
    st = OK if worst <= okL else WARN if worst <= warnL else FAIL
    conf = [s for s in SH if any(abs(e - s['t']) <= .35 for e in evs)]
    note = f'; {len(conf)}/{len(SH)} cú trong SHOTS đo thấy' if SH else ''
    if st == OK and SH and len(conf) < .8 * len(SH): st = WARN
    row(GV, 'Nhịp đổi hình đo được', cap('cadence', st), f'khoảng dài nhất {worst:.1f} s (từ {at:.1f} s){note}' + ('' if frames else '; không có safezone.json: chỉ đo cắt cảnh / hành động lớn'),
        f'≤ {okL} s giữa hai thay đổi (zoom ≥ 5 %, lia ≥ 45 px, cắt, kính hiện / đổi cỡ, đổi biểu cảm, hành động lớn); đang hiệu chỉnh: tối đa CẢNH BÁO')
    # ---------- đoạn giải thích đứng hình ----------
    bad = []
    for l in LINES:
        if l['dur'] < 2.5: continue
        a, b = l['t'], l['t'] + l['dur']; i0, i1 = int(a * FPS) + 1, int(b * FPS) + 1
        if not any(a < e < b for e in evs) and (float(np.median(diff[i0:i1])) if i1 > i0 else 0) < 1.5: bad.append(l)
    row(GV, 'Đoạn giải thích không đứng hình', OK if not bad else FAIL, '; '.join(f"{l['t']:.1f} s \"{l['text']}\"" for l in bad) or 'không có',
        'câu ≥ 2,5 s phải có ít nhất một thay đổi hình (máy, kính, biểu cảm, hành động) hoặc chuyển động liên tục')

    # ---------- chữ móc ----------
    h0 = next((F.get('hook') for F in frames if F['t'] <= .05), None) if frames else None
    if h0 is None: row(GV, 'Vị trí chữ móc', WARN, 'không đo được (dùng hookTitle + hookStack của _shared/episode.js)', 'tâm ở giữa / giữa phía trên')
    else:
        c_y, c_x = (h0['y0'] + h0['y1']) / 2, (h0['x0'] + h0['x1']) / 2
        if LONG: st = OK if 380 <= c_y <= 620 else WARN if h0['y0'] >= 150 and h0['y1'] <= 900 else FAIL
        else:
            st = OK if h0['y0'] >= 380 and h0['y1'] <= 1150 and 560 <= c_y <= 1000 and abs(c_x - 540) <= 60 else \
                 WARN if h0['y0'] >= 300 and h0['y1'] <= 1250 else FAIL
        f0 = next((F for F in frames if F['t'] <= .05), None)
        cover = [f['who'] for f in (f0['faces'] if f0 else []) if f['r'] >= 30 and h0['x0'] < f['x'] < h0['x1'] and h0['y0'] < f['y'] < h0['y1']]
        if cover and st == OK: st = WARN
        row(GV, 'Vị trí chữ móc', st, f"y {h0['y0']:.0f}–{h0['y1']:.0f} (tâm {c_y:.0f}), x tâm {c_x:.0f}" + (f"; che mặt {', '.join(cover)}" if cover else ''),
            ('tâm y 380–620 (khung 1080)' if LONG else 'khung chữ trong y 380–1150, tâm y 560–1000, giữa ngang (hookStack "mid" / "center"); không sát mép, không che mặt'))

    # ---------- phụ đề ----------
    cards = rd(os.path.join(FILM, 'cards.json'), [])
    if cards:
        wc = [len([w for w in c['text'].split() if re.search(r'[A-Za-z0-9]', w)]) for c in cards]
        over = [c['text'] for c, n in zip(cards, wc) if n > 7]
        tiny = [c['text'] for c, n in zip(cards, wc) if n <= 2 and not all(bare(w) in INTERJ for w in c['text'].split())]
        st = FAIL if over else WARN if (tiny or sum(n <= 2 for n in wc) > .25 * len(wc)) else OK
        row(GT, 'Số từ mỗi tấm phụ đề', st, f'{min(wc)}–{max(wc)} từ (trung vị {int(np.median(wc))}), {len(cards)} tấm' + (f"; quá dài: {over}" if over else '') + (f"; quá ngắn: {tiny}" if tiny else ''),
            '3–7 từ mỗi cụm (1–2 từ chỉ khi là thán từ: Wow!, Oops!…); mỗi tấm thuộc một câu (_shared/song.js cardsOf)')
        kw = [bare(k) for k in (TL.get('secret') or {}).get('kw', [])]
        emc = [c for c in cards if c.get('em')]; ems = {bare(w) for c in emc for w in c['em']}
        hit = [k for k in kw if k in ems or k.rstrip('s') in {e.rstrip('s') for e in ems}]
        st = OK if len(emc) >= .5 * len(cards) and (not kw or hit) else WARN
        row(GT, 'Từ khoá được nhấn', st, f'{len(emc)}/{len(cards)} tấm có từ nhấn; từ khoá của bí mật: ' + (', '.join(hit) if hit else ('chưa nhấn ' + ', '.join(kw) if kw else 'chưa khai báo SECRET.kw')),
            '≥ 50 % số tấm có từ nhấn (màu + cỡ, subtitleEm), từ khoá của bí mật được nhấn ít nhất một lần')
        rep = [cards[i]['text'] for i in range(1, len(cards)) if bare(cards[i]['text']) == bare(cards[i - 1]['text'])]
        hookB = next((b for b in B if b['id'] == 'hook'), None) if B else None
        during = [c['text'] for c in cards if hookB and c['t0'] < hookB['t1'] - .3 and c['t1'] > .3 and not LONG]
        row(GT, 'Không lặp chữ thừa', OK if not rep and not during else WARN, '; '.join(([f'tấm lặp: {rep}'] if rep else []) + ([f'phụ đề trong lúc chữ móc trên hình: {during}'] if during else [])) or 'không có',
            'không hai tấm liền nhau giống nhau; không phụ đề khi chữ móc đang trên hình (cardsOf hide)')
    else: row(GT, 'Số từ mỗi tấm phụ đề', FAIL, 'thiếu cards.json', '3–7 từ')

    # ---------- CTA ----------
    ctas = [l for l in LINES if l.get('cta')]
    if not ctas: row(GT, 'CTA cụ thể', FAIL, 'không có câu nào ghi cta: true', 'một câu kêu gọi cụ thể, ngắn, hợp Made for Kids')
    else:
        l = ctas[-1]; t_lim, d_ok, d_warn = (10, 3, 3.3) if LONG else (4, 2.0, 2.3)
        banned = BANNED.search(l['text']); words = {bare(w) for w in l['text'].split()}
        kw = {bare(k) for k in (TL.get('secret') or {}).get('kw', [])}
        has_kw = bool(kw & words) or any(k.rstrip('s') in {w.rstrip('s') for w in words} for k in kw)
        act = '?' in l['text'] or bool(words & ACTION)
        st = FAIL if banned or l['dur'] > d_warn or l['t'] < DUR - t_lim - 1e-6 else (OK if l['dur'] <= d_ok and act and has_kw else WARN)
        row(GT, 'CTA cụ thể', st, f"\"{l['text']}\" ở {l['t']:.1f} s, {l['dur']:.2f} s" + ('; có lời kêu gọi bình luận / đăng ký (cấm, Made for Kids)' if banned else '') + ('' if act else '; thiếu "?" hoặc động từ hành động') + ('' if has_kw else '; chưa có từ khoá của bí mật'),
            f'trong {t_lim} s cuối, ≤ {d_ok:g} s, là câu hỏi hoặc một việc làm cụ thể gắn với bí mật; không comment / subscribe / like / share (CLAUDE.md, Made for Kids)')

    # ---------- bài hát ----------
    words = lambda l: len([w for w in l['text'].split() if re.search(r'[A-Za-z0-9]', w)])
    tot = sum(words(l) for l in LINES) or 1
    sungw = sum(words(l) for l in LINES if (l.get('sung') or {}).get('mode') in MODES)
    full = sum(words(l) for l in LINES if (l.get('sung') or {}).get('mode') == 'sing')
    sh = sungw / tot; st = OK if .6 <= sh <= .8 else WARN if .5 <= sh <= .9 else FAIL
    if st == OK and LONG and full / tot > .3: st = WARN
    by = collections.Counter((l.get('sung') or {}).get('mode', 'speak') for l in LINES)
    row(GS, 'Lời có nhịp hoặc giai điệu', st, f'{sh:.0%} số từ ({sungw}/{tot}); hát trọn {full / tot:.0%}; ' + ', '.join(f'{k} ×{n}' for k, n in by.most_common()),
        '60–80 % số từ ở sing-talk / half-sing / sing, 20–40 % nói tự nhiên' + ('; hát trọn ≤ 30 %' if LONG else ''))
    SJ = rd(os.path.join(FILM, 'voice', 'sung.json'))
    sl = [l for l in LINES if (l.get('sung') or {}).get('mode') in MODES]
    if sl:
        if SJ is None or any(l['id'] not in SJ for l in sl): row(GS, 'Thật sự hát (bám nốt)', FAIL, 'thiếu voice/sung.json (chạy _shared/sing.py)', 'lock theo kiểu hát')
        else:
            low = [f"{l['id']} {SJ[l['id']]['lock']:.2f}" for l in sl if SJ[l['id']]['lock'] < LOCK[l['sung']['mode']]]
            row(GS, 'Thật sự hát (bám nốt)', OK if not low else WARN, ('thấp: ' + ', '.join(low)) if low else ', '.join(f"{l['id']} {SJ[l['id']]['lock']:.2f}" for l in sl),
                'phần khung có thanh nằm trong ± 50–70 cent của nốt: sing ≥ 0,6 · half-sing ≥ 0,45 · sing-talk ≥ 0,3')
            homes = voice_homes(LIB); off = []
            for l in sl:
                hz = SJ[l['id']].get('med_hz') or 0; h = homes.get(l['who'])
                if hz and h is not None and abs(69 + 12 * np.log2(hz / 440) - h) > 2.5: off.append(f"{l['id']} {hz:.0f} Hz")
            row(GS, 'Giọng hát giữ chất giọng nhân vật', OK if not off else WARN, ('lệch: ' + ', '.join(off)) if off else 'mọi câu hát quanh home ± 2,5 nửa cung',
                'cao độ trung vị của câu hát gần home của giọng (_shared/voices.js): giọng nhất quán giữa các tập')
        AS = rd(os.path.join(FILM, 'voice', 'asr-sung.json'))
        if AS is None or any(l['id'] not in AS for l in sl): row(GS, 'Lời hát nghe rõ (Whisper)', FAIL, 'thiếu voice/asr-sung.json (chạy _shared/tools/asr_sung.py)', 'WER ≤ 0,15 (điệp khúc, sing-talk, half-sing) / 0,25 (sing)')
        else:
            badA = [f"{k}: {v['heard']}" for k, v in AS.items() if not v['ok']]
            row(GS, 'Lời hát nghe rõ (Whisper)', OK if not badA else FAIL, '; '.join(badA) or ', '.join(f"{k} {v['wer']:.2f}" for k, v in AS.items()),
                'WER ≤ 0,15 (điệp khúc, sing-talk, half-sing) / 0,25 (sing); mọi từ khoá nghe đúng')
    ch = collections.defaultdict(list)
    for l in sl:
        if l['sung'].get('chorus'): ch[l['sung']['chorus']].append(l)
    need = 3 if LONG else 2; tail = 30 if LONG else 6; best = None
    for name, ls in ch.items():
        same = len({(l['text'], tuple((n['m'], round(n['d'], 3)) for n in l['sung']['notes'])) for l in ls}) == 1
        late = any(l['t'] >= DUR - tail for l in ls); short_ = all(l['dur'] <= 3.4 and words(l) <= 8 for l in ls)
        cand = (len(ls) >= need, same, late, short_, name, ls)
        if best is None or cand[:4] > best[:4]: best = cand
    if best is None: row(GS, 'Điệp khúc hát theo được', FAIL, 'không có câu nào ghi sing.chorus', f'≥ {need} lần, cùng lời cùng nốt, một lần trong {tail} s cuối, ≤ 8 từ')
    else:
        n_ok, same, late, short_, name, ls = best
        st = OK if all(best[:4]) else FAIL if not n_ok else WARN
        row(GS, 'Điệp khúc hát theo được', st, f"'{name}' ×{len(ls)} ở " + ', '.join(f"{l['t']:.1f}" for l in ls) + f" s: \"{ls[0]['text']}\"" + ('' if same else '; lời / nốt khác nhau') + ('' if late else f'; chưa có lần nào trong {tail} s cuối') + ('' if short_ else '; dài quá'),
            f'≥ {need} lần, cùng lời cùng nốt, một lần trong {tail} s cuối (nhắc lại trước CTA), mỗi lần ≤ 8 từ và ≤ 3,4 s')
    MJ = rd(os.path.join(OUT, 'music.json'), {}) or {}
    song = TL.get('song') or {}
    mot = song.get('motif') or []; used = list(MJ.get('motifs') or [])
    if mot:                                                                # câu hát mở bằng đúng motif (cùng quãng, cùng tỉ lệ trường độ) cũng tính là một lần dùng
        ms_, ds_ = [n['s'] - mot[0]['s'] for n in mot], [n['d'] / mot[0]['d'] for n in mot]
        for l in sl:
            ns = l['sung']['notes'][:len(mot)]
            if len(ns) == len(mot) and [n['m'] - ns[0]['m'] for n in ns] == ms_ and all(abs(n['d'] / ns[0]['d'] - d) < .02 for n, d in zip(ns, ds_)):
                used.append({'t': l['t'], 'inst': f"giọng hát {l['id']}"})
    sig = tuple((n['s'] - mot[0]['s'], n['d']) for n in mot) if mot else ()
    dup = []
    for p in glob.glob(os.path.join(os.path.dirname(FILM), '*', 'timeline.json')):
        if os.path.dirname(p) == FILM: continue
        try: o = json.load(open(p, encoding='utf-8'))
        except Exception: continue
        om = ((o.get('song') or {}).get('motif')) or []
        if om and tuple((n['s'] - om[0]['s'], n['d']) for n in om) == sig: dup.append(os.path.basename(os.path.dirname(p)))
    st = OK if mot and len(used) >= 2 and not dup else WARN
    row(GS, 'Giai điệu đặc trưng (motif)', st, (f"{len(mot)} nốt, đặt {len(used)} lần (" + ', '.join(f"{m['t']:.1f} s {m['inst']}" for m in used) + ')') if mot else 'chưa khai báo SONG.motif',
        'mỗi tập một motif riêng (không trùng tập khác' + (f': trùng {", ".join(dup)}' if dup else '') + '), đặt ≥ 2 lần (mở đầu và trước CTA) bằng G.motif')

    # ---------- âm thanh: duck, SFX ----------
    try:
        from scipy.signal import butter, sosfiltfilt
        sr, vox, mus = C['sr'], C['vox'], C['mus']
        sos = butter(4, [300, 4000], 'bandpass', fs=sr, output='sos'); mb = sosfiltfilt(sos, mus)
        busy = np.zeros(len(mb), bool)
        for l in LINES: busy[int(l['t'] * sr):int((l['t'] + l['dur']) * sr)] = True
        res = {'speak': [], 'sung': []}
        for l in LINES:
            a, b = int(l['t'] * sr), int((l['t'] + l['dur']) * sr); w0, w1 = max(0, a - int(1.5 * sr)), min(len(mb), b + int(1.5 * sr))
            gap = ~busy[w0:w1]
            if gap.sum() < .25 * sr: continue
            g = float(np.sqrt(np.mean(mb[w0:w1][gap] ** 2)) + 1e-9); d = float(np.sqrt(np.mean(mb[a:b] ** 2)) + 1e-9)
            res['sung' if (l.get('sung') or {}).get('mode') in MODES else 'speak'].append(20 * np.log10(g / d))
        sp, sg_ = (float(np.median(res[k])) if res[k] else None for k in ('speak', 'sung'))
        st = OK
        if sp is not None: st = OK if sp >= 8 else WARN if sp >= 5 else FAIL
        if sg_ is not None:
            s2 = OK if 6 <= sg_ <= 14 else WARN if 4 <= sg_ <= 20 else FAIL
            st = max((st, s2), key=[OK, WARN, FAIL].index)
        row(GA, 'Nhạc lùi dưới giọng (duck)', cap('duck', st), f"dưới câu nói {sp:.1f} dB" if sp is not None else 'không đo được dưới câu nói' + '', 'dưới câu nói ≥ 8 dB, dưới câu hát 6–14 dB (nhạc ở dải 300–4000 Hz, so với khoảng trống ±1,5 s)')
        if sg_ is not None: rows_last = C['rows'][-1]; rows_last['value'] += f'; dưới câu hát {sg_:.1f} dB'
    except Exception as e:
        row(GA, 'Nhạc lùi dưới giọng (duck)', WARN, f'không đo được ({type(e).__name__})', 'dưới câu nói ≥ 8 dB, dưới câu hát 6–14 dB')
    runs = collections.defaultdict(list); free = collections.Counter(); seq = collections.defaultdict(list)
    for e in EV:
        if e.get('run'): runs[e['run']].append(e)
        else: free[e['type']] += 1; seq[e['type']].append(e['t'])
    lim = max(3, DUR / 60 * 3) if LONG else max(3, DUR / 7)
    much = [f'{k} ×{n}' for k, n in free.most_common() if n > lim]
    burst = sorted({k for k, ts in seq.items() for i in range(len(ts) - 2) if sorted(ts)[i + 2] - sorted(ts)[i] < 1.0})
    longrun = [f"{k} ({len(v)} cue, {max(e['t'] for e in v) - min(e['t'] for e in v):.1f} s)" for k, v in runs.items() if len(v) > 16 or max(e['t'] for e in v) - min(e['t'] for e in v) > 4.2]
    share = sum(len(v) for v in runs.values()) / max(1, len(EV)); types = len({e['type'] for e in EV})
    need_t = 20 if LONG else 16 if A_EP else 10
    probs = ([f'lặp nhiều: {", ".join(much)}'] if much else []) + ([f'≥ 3 lần trong 1 s ngoài chuỗi: {", ".join(burst)}'] if burst else []) + \
            ([f'chuỗi dài: {", ".join(longrun)}'] if longrun else []) + ([f'chuỗi chiếm {share:.0%} số cue'] if share > .4 else []) + ([f'chỉ {types} loại tiếng'] if types < need_t else [])
    row(GA, 'Tiếng động đa dạng, không lặp máy móc', OK if not probs else WARN, '; '.join(probs) or f'{types} loại tiếng, {len(EV)} cue, {len(runs)} chuỗi có chủ đích',
        f'một loại tiếng ≤ {lim:.0f} lần (chuỗi nhịp có chủ đích ghi run: "<id>" trong events, ≤ 16 cue và ≤ 4 s), ≥ {need_t} loại tiếng')

    # ---------- treatment ----------
    try: tr = open(os.path.join(FILM, 'TREATMENT.md'), encoding='utf-8').read()
    except OSError: tr = ''
    miss = [h for h in HEADINGS if h.lower() not in tr.lower()]
    row(GT, 'TREATMENT.md đủ các mục', OK if not miss else WARN, ('thiếu: ' + ', '.join(miss)) if miss else 'đủ 10 mục + Music Direction A–F', '_shared/TREATMENT-TEMPLATE.md (Task.md mục 6 và 8)')
