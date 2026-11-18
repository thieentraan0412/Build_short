"""Tạo lại giọng CHỈ cho câu đã đổi (Task.md 18/11/2026 "AI Vocal & Musical QC" §6, _shared/QUALITY.md §9).
python _shared/tools/voice_regen.py films/<tập> [--force L04,L10] [--all] [--adopt]

Khoá của một câu = lời đưa vào TTS, giọng, tốc độ, pitch, ngôn ngữ, chữ Whisper phải nghe ra và bản nhạc hát (sing). Khoá ghi ở
voice/regen-mark.json. Câu đổi khoá (hoặc thiếu file giọng, hoặc nêu trong --force) đi trọn chuỗi giọng trong thư mục tạm
voice/_regen/:
  core/tts/tts.py → _shared/voicefx.py → [_shared/tools/phones.py] → core/tts/asr_check.py (base.en rồi small.en) → _shared/sing.py
  → _shared/tools/asr_sung.py   (phones.py: mốc âm vị Kokoro cho câu hát, 19/11/2026; khoá câu hát có thêm phiên bản của sing.py)
Đạt hết thì chép file giọng (và bản nói gốc của câu hát) về voice/ và gộp các JSON (dur, words, words.sung, sung, asr-sung,
sing-mark, fx). Câu không đổi giữ nguyên file và số đo cũ: một câu hát lỗi chỉ tạo lại đúng câu đó, không tạo lại cả bài.
Thoát 1 nếu một bước rớt; khoá của các câu trong lượt đó không được ghi, lần sau làm lại; voice/_regen/ để lại để xem.
--adopt: ghi khoá cho mọi câu từ file đang có (không tạo lại), dùng một lần khi chuyển một tập đã dựng sang cách này.
Bước 2 (18/11/2026, Lớp Voice, QUALITY.md §10): câu NÓI có "emo" được _shared/emote.py uốn ngữ điệu theo cảm xúc, từ bản chưa uốn
(voice/plain/<id>.wav, mốc từ voice/words.plain.json), trong voice/_emote/; Whisper base.en + small.en kiểm lại bản đã uốn; đạt mới
gộp. Khoá riêng (voice/emote-mark.json: emo, độ mạnh, từ nhấn, câu cửa miệng, phiên bản của emote.py): đổi cảm xúc chỉ uốn lại câu đó.
"""
import sys, os, json, hashlib, shutil, subprocess, argparse
LIB = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
JSONS = ('dur.json', 'words.json', 'words.sung.json', 'sung.json', 'asr-sung.json', 'sing-mark.json', 'fx.json', 'phones.json')
SUNG_ONLY = ('words.sung.json', 'sung.json', 'asr-sung.json', 'sing-mark.json', 'phones.json')


def ekey(L, base):
    sys.path.insert(0, os.path.join(LIB, '_shared')); import emote
    k = {f: L.get(f) for f in ('emo', 'emo_k', 'kw', 'catch', 'home')}; k['base'] = base; k['v'] = emote.VERSION
    return hashlib.sha1(json.dumps(k, sort_keys=True, ensure_ascii=False).encode()).hexdigest()[:16]


def key(L):
    k = {f: L.get(f) for f in ('text', 'voice', 'speed', 'pitch', 'lang', 'asr', 'sing')}
    if L.get('sing') and L['sing'].get('legato', True):      # (19/11/2026) đổi bộ hát (sing.VERSION: hát liền hơi) thì câu hát tạo lại; câu nói không đổi khoá
        sys.path.insert(0, os.path.join(LIB, '_shared')); import sing
        k['sing_v'] = sing.VERSION
    return hashlib.sha1(json.dumps(k, sort_keys=True, ensure_ascii=False).encode()).hexdigest()[:16]


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('film'); ap.add_argument('--force', default=''); ap.add_argument('--all', action='store_true'); ap.add_argument('--adopt', action='store_true')
    a = ap.parse_args()
    vd = os.path.join(os.path.abspath(a.film), 'voice'); lp = os.path.join(vd, 'lines.json'); mp = os.path.join(vd, 'regen-mark.json')
    lines = json.load(open(lp, encoding='utf-8')); mark = json.load(open(mp, encoding='utf-8')) if os.path.exists(mp) else {}
    rd = lambda p: json.load(open(p, encoding='utf-8')) if os.path.exists(p) else {}
    if a.adopt:
        mark = {L['id']: key(L) for L in lines if os.path.exists(os.path.join(vd, L['id'] + '.wav'))}
        json.dump(mark, open(mp, 'w', encoding='utf-8'), indent=1); print(f'voice_regen: adopted {len(mark)} lines as they are'); return
    force = set(filter(None, a.force.split(',')))
    todo = [L for L in lines if a.all or L['id'] in force or mark.get(L['id']) != key(L) or not os.path.exists(os.path.join(vd, L['id'] + '.wav'))]
    gone = set(mark) - {L['id'] for L in lines}
    if not todo:
        for g in gone: mark.pop(g, None)
        json.dump(mark, open(mp, 'w', encoding='utf-8'), indent=1)
        print(f'voice_regen: {len(lines)} lines unchanged, nothing to regenerate'); emote_stage(vd, lines, mark, set()); return
    print('voice_regen: regenerating', ', '.join(L['id'] for L in todo), f'({len(lines) - len(todo)} unchanged)')
    tmp = os.path.join(vd, '_regen'); shutil.rmtree(tmp, ignore_errors=True); os.makedirs(tmp)
    tl = os.path.join(tmp, 'lines.json'); json.dump(todo, open(tl, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    py = sys.executable; env = dict(os.environ, PYTHONIOENCODING='utf-8')
    steps = [([py, 'core/tts/tts.py', tl, tmp], {}), ([py, '_shared/voicefx.py', tl, tmp], {}),
             ([py, 'core/tts/asr_check.py', tl, tmp, '--lang', 'en'], {'WHISPER_MODEL': 'base.en'}),
             ([py, 'core/tts/asr_check.py', tl, tmp, '--lang', 'en'], {'WHISPER_MODEL': 'small.en'})]   # small.en sau cùng: words.json cho sing.py
    if any(L.get('sing') for L in todo):
        steps.insert(2, ([py, '_shared/tools/phones.py', tl, tmp], {}))   # (19/11/2026) mốc âm vị Kokoro cho sing.py hát liền hơi (trên bản nói, sau voicefx)
        steps += [([py, '_shared/sing.py', tl, tmp], {}), ([py, '_shared/tools/asr_sung.py', tl, tmp], {'WHISPER_MODEL': 'small.en'})]
    for cmd, e in steps:
        r = subprocess.run(cmd, cwd=LIB, env=dict(env, **e))
        if r.returncode:
            print(f'voice_regen: step failed ({os.path.basename(cmd[1])}, exit {r.returncode}); nothing merged, see {tmp}', file=sys.stderr); sys.exit(1)
    # gộp: file giọng, bản nói gốc, JSON (câu không còn hát thì xoá số đo hát cũ)
    os.makedirs(os.path.join(vd, 'spoken'), exist_ok=True)
    for L in todo:
        shutil.copyfile(os.path.join(tmp, L['id'] + '.wav'), os.path.join(vd, L['id'] + '.wav'))
        sp = os.path.join(tmp, 'spoken', L['id'] + '.wav')
        if os.path.exists(sp): shutil.copyfile(sp, os.path.join(vd, 'spoken', L['id'] + '.wav'))
    ids = {L['id'] for L in todo}; sung_ids = {L['id'] for L in todo if L.get('sing')}
    for fn in JSONS:
        old, new = rd(os.path.join(vd, fn)), rd(os.path.join(tmp, fn))
        for i in ids:
            if i in new: old[i] = new[i]
            elif fn in SUNG_ONLY and i not in sung_ids: old.pop(i, None)
        for g in gone: old.pop(g, None)
        json.dump(old, open(os.path.join(vd, fn), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    for L in todo: mark[L['id']] = key(L)
    for g in gone: mark.pop(g, None)
    json.dump(mark, open(mp, 'w', encoding='utf-8'), indent=1)
    shutil.rmtree(tmp, ignore_errors=True)
    print(f'voice_regen: merged {len(todo)} lines')
    # bản nói vừa tạo là bản chưa uốn: lưu làm gốc cho bước cảm xúc
    os.makedirs(os.path.join(vd, 'plain'), exist_ok=True); W = rd(os.path.join(vd, 'words.json')); WP = rd(os.path.join(vd, 'words.plain.json'))
    for L in todo:
        if L.get('sing'): continue
        shutil.copyfile(os.path.join(vd, L['id'] + '.wav'), os.path.join(vd, 'plain', L['id'] + '.wav'))
        if L['id'] in W: WP[L['id']] = W[L['id']]
    json.dump(WP, open(os.path.join(vd, 'words.plain.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    emote_stage(vd, lines, mark, {L['id'] for L in todo})


def emote_stage(vd, lines, mark, fresh):
    """Bước 2: uốn ngữ điệu câu nói theo cảm xúc (_shared/emote.py), kiểm lại bằng Whisper, đạt mới gộp."""
    rd = lambda p: json.load(open(p, encoding='utf-8')) if os.path.exists(p) else {}
    emp = os.path.join(vd, 'emote-mark.json'); EM = rd(emp); WP = rd(os.path.join(vd, 'words.plain.json')); W = rd(os.path.join(vd, 'words.json'))
    os.makedirs(os.path.join(vd, 'plain'), exist_ok=True)
    spoken = [L for L in lines if L.get('emo') and not L.get('sing')]
    for L in spoken:                                       # tập chuyển sang cách này: bản đang có (chưa uốn) làm gốc
        pl = os.path.join(vd, 'plain', L['id'] + '.wav')
        if not os.path.exists(pl) and L['id'] not in EM: shutil.copyfile(os.path.join(vd, L['id'] + '.wav'), pl)
        if L['id'] not in WP and L['id'] in W and L['id'] not in EM: WP[L['id']] = W[L['id']]
    json.dump(WP, open(os.path.join(vd, 'words.plain.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    # câu không còn uốn ngữ điệu (emote: false hoặc thành câu hát): trả bản nói gốc (voice/plain) và mốc từ của nó
    off = [L for L in lines if L['id'] in EM and not L.get('emo') and not L.get('sing') and L['id'] not in fresh
           and os.path.exists(os.path.join(vd, 'plain', L['id'] + '.wav'))]
    if off:
        STv = rd(os.path.join(vd, 'emote.json'))
        for L in off:
            shutil.copyfile(os.path.join(vd, 'plain', L['id'] + '.wav'), os.path.join(vd, L['id'] + '.wav'))
            if L['id'] in WP: W[L['id']] = WP[L['id']]
            EM.pop(L['id'], None); STv.pop(L['id'], None)
        for fn, o in (('words.json', W), ('emote.json', STv), ('emote-mark.json', EM)):
            json.dump(o, open(os.path.join(vd, fn), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
        print('voice_regen: emotion removed, plain take restored for', ', '.join(L['id'] for L in off))
    todo = [L for L in spoken if L['id'] in fresh or EM.get(L['id']) != ekey(L, mark.get(L['id']))]
    if not todo: print(f'voice_regen: emotion unchanged ({len(spoken)} spoken lines)'); return
    print('voice_regen: emotion for', ', '.join(f"{L['id']} {L['emo']}" for L in todo))
    tmp = os.path.join(vd, '_emote'); shutil.rmtree(tmp, ignore_errors=True); os.makedirs(tmp)
    for L in todo: shutil.copyfile(os.path.join(vd, 'plain', L['id'] + '.wav'), os.path.join(tmp, L['id'] + '.wav'))
    json.dump({L['id']: WP[L['id']] for L in todo if L['id'] in WP}, open(os.path.join(tmp, 'words.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    tl = os.path.join(tmp, 'lines.json'); json.dump(todo, open(tl, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    py = sys.executable; env = dict(os.environ, PYTHONIOENCODING='utf-8')
    for cmd, e in (([py, '_shared/emote.py', tl, tmp], {}), ([py, 'core/tts/asr_check.py', tl, tmp, '--lang', 'en'], {'WHISPER_MODEL': 'base.en'}),
                   ([py, 'core/tts/asr_check.py', tl, tmp, '--lang', 'en'], {'WHISPER_MODEL': 'small.en'})):
        r = subprocess.run(cmd, cwd=LIB, env=dict(env, **e))
        if r.returncode: print(f'voice_regen: emotion step failed ({os.path.basename(cmd[1])}); nothing merged, see {tmp}', file=sys.stderr); sys.exit(1)
    W2, ST = rd(os.path.join(tmp, 'words.json')), rd(os.path.join(tmp, 'emote.json')); STv = rd(os.path.join(vd, 'emote.json'))
    for L in todo:
        shutil.copyfile(os.path.join(tmp, L['id'] + '.wav'), os.path.join(vd, L['id'] + '.wav'))
        if L['id'] in W2: W[L['id']] = W2[L['id']]
        if L['id'] in ST: STv[L['id']] = ST[L['id']]
        EM[L['id']] = ekey(L, mark.get(L['id']))
    for fn, o in (('words.json', W), ('emote.json', STv), ('emote-mark.json', EM)):
        json.dump(o, open(os.path.join(vd, fn), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    shutil.rmtree(tmp, ignore_errors=True); print(f'voice_regen: emotion merged {len(todo)} lines')


if __name__ == '__main__':
    main()
