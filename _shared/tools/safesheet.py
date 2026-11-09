"""Bảng khung hình có phủ vùng giao diện YouTube Shorts (QUALITY.md §5), để soi bằng mắt: phụ đề, chữ, mặt nhân vật có bị che không.
    python _shared/tools/safesheet.py films/<tập>                     # mỗi 2 s một khung → <tập>/out/safezone.jpg
    python _shared/tools/safesheet.py films/<tập> 2.6 11.5 24 --out x.jpg
Lấy khung từ <tập>/<tên>.mp4 bằng ffmpeg. Vùng đỏ là ước lượng (giống SAFE trong _shared/episode.js và _shared/tools/safezone.mjs):
thanh trên 150 px; vùng tên kênh, tiêu đề, nhạc từ 1530 px; cột nút bên phải x ≥ 940, y 880–1780. Vạch vàng: đáy phụ đề phải ở trên 1500 px.
Số đo tự động nằm ở safezone.mjs và qa.py; bảng này chỉ để nhìn."""
import io, os, sys, json, subprocess
from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1920
TOP, BOTTOM, SUB_BOTTOM, RIGHT, RIGHT_Y0, RIGHT_Y1 = 150, 1530, 1500, 940, 880, 1780
args = sys.argv[1:]
out = None
if '--out' in args: i = args.index('--out'); out = args[i + 1]; del args[i:i + 2]
film = os.path.abspath(args[0]); name = os.path.basename(film); mp4 = os.path.join(film, name + '.mp4')
dur = json.load(open(os.path.join(film, 'timeline.json'), encoding='utf-8'))['dur']
times = [float(t) for t in args[1:]] or [t / 1 for t in range(0, int(dur), 2)]
out = out or os.path.join(film, 'out', 'safezone.jpg')
here = os.path.dirname(os.path.abspath(__file__))
try: font = ImageFont.truetype(os.path.join(here, '..', 'fonts', 'Baloo2-VF.ttf'), 30)
except Exception: font = ImageFont.load_default()

tw = 270; th = tw * H // W
ims = []
for t in times:
    r = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t}', '-i', mp4, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True)
    if not r.stdout: continue
    im = Image.open(io.BytesIO(r.stdout)).convert('RGBA').resize((W, H))
    ov = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov); red = (255, 0, 0, 90)
    d.rectangle([0, 0, W, TOP], fill=red); d.rectangle([0, BOTTOM, W, H], fill=red); d.rectangle([RIGHT, RIGHT_Y0, W, RIGHT_Y1], fill=red)
    d.line([0, SUB_BOTTOM, W, SUB_BOTTOM], fill=(255, 220, 0, 220), width=6)
    im = Image.alpha_composite(im, ov).convert('RGB').resize((tw, th))
    d = ImageDraw.Draw(im); d.rectangle([0, 0, tw, 34], fill=(0, 0, 0)); d.text((6, -2), f'{t:.1f} s', fill=(255, 255, 0), font=font)
    ims.append(im)
cols = min(len(ims), 8); rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (tw + 4), rows * (th + 4)), (30, 30, 30))
for i, im in enumerate(ims): sheet.paste(im, ((i % cols) * (tw + 4), (i // cols) * (th + 4)))
os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
sheet.save(out, quality=85)
print(f'safesheet · {name} · {len(ims)} khung → {out}')
