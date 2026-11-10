// Dàn nhân vật định kỳ, theo thứ tự chuẩn của series (dùng cho mọi bảng tổng hợp)
import { LOUPE } from './loupe.js';
import { ALBIE } from './albie.js';
import { CRUMB } from './crumb.js';
import { FLUTTER } from './flutter.js';
import { CHIRP } from './chirp.js';
import { WAGGLE } from './waggle.js';
import { BLINK } from './blink.js';
import { DOT } from './dot.js';
import { SPINDLE } from './spindle.js';
import { ROLLO } from './rollo.js';
import { TELLY } from './telly.js';
import { GIANT } from './giant.js';
import { SMUDGE } from './smudge.js';
import { FIZZ } from './fizz.js';
import { ZIP } from './zip.js';
export const CAST = [LOUPE, ALBIE, CRUMB, FLUTTER, CHIRP, WAGGLE, BLINK, DOT, SPINDLE, ROLLO, TELLY, GIANT, SMUDGE];
// Khách mời (CHARACTER-BIBLE §9): thiết kế khi làm tập của họ, dùng lại làm vai phụ; không nằm trong 13 nhân vật định kỳ của CAST
export const GUESTS = [FIZZ, ZIP];
export const BY = Object.fromEntries([...CAST, ...GUESTS].map(c => [c.id, c]));
export { LOUPE, ALBIE, CRUMB, FLUTTER, CHIRP, WAGGLE, BLINK, DOT, SPINDLE, ROLLO, TELLY, GIANT, SMUDGE, FIZZ, ZIP };
