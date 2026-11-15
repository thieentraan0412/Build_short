# Big Secrets of Tiny Bugs — Character Design System v2

Bộ hình tham chiếu cố định cho cả series: 13 nhân vật định kỳ, mỗi nhân vật 4 bảng (thiết kế, biểu cảm, tư thế, atlas), cộng 12 bảng chung cho cả dàn. Mọi hình đều vẽ bằng code từ **một rig duy nhất cho mỗi nhân vật**, nên mọi góc nhìn, biểu cảm và tư thế đều là cùng một nhân vật, đúng tỷ lệ, đúng màu.

**Từ 11/2026, bảng hình dựng theo phong cách v2 "Kẹo Phẳng Viền"** (mục 10): viền mực đồng nhất, đổ bóng cel mềm, mắt có mống mắt và hai điểm sáng, lông mày, miệng có răng lưỡi. Nhân vật, màu, tỷ lệ, đặc điểm khoá và bố cục mọi bảng giữ nguyên. So sánh trước/sau: [bảng 23](out/sheets/23-before-after-v1-v2.png).

- **Ảnh có chữ** (cho người): [`out/sheets/`](out/sheets/), 64 ảnh PNG, 3840×2160 (lineup và bảng kích thước 5120×2160, bảng đặc điểm khóa 3840×3160, bảng tham chiếu chính và bảng 5 biểu cảm 3840×3840, cảnh dọc 2160×3840, so sánh 5120×2460).
- **Ảnh sạch, không chữ** (cho AI tạo video): [`out/clean/`](out/clean/), 62 ảnh cùng bố cục.
- **Ảnh tham chiếu chính cho AI:** [`out/clean/21-MASTER-CHARACTER-REFERENCE.png`](out/clean/21-MASTER-CHARACTER-REFERENCE.png).
- **Dựng lại toàn bộ** (khoảng 30 giây): `node _shared/characters/tools/render.mjs` từ thư mục gốc của thư viện. Thêm `--look 1` để dựng bản v1 cũ vào `out/v1/`.

---

## 1. Phân tích nguồn tham khảo

### 1.1 Video tham khảo

File video Hey Duggee mà bạn đưa lúc làm pilot **không có trong repo**. Ghi chú trong [`TREATMENT.md`](../../films/bi-mat-ti-hon/TREATMENT.md) của pilot cho biết lúc đó mình chỉ xem được 3 khung hình. Vì vậy bộ này lấy **pilot `tiny-secrets.mp4` và `modelsheet.jpg`** làm nguồn hình ảnh chính: pilot chính là bản chưng cất phong cách của video tham khảo thành ngôn ngữ riêng của kênh ("Khối Kẹo Phẳng"). Những gì học từ video tham khảo (khối phẳng, đọc được ngay trên điện thoại, nhân vật đơn giản) đã nằm sẵn trong pilot; những gì không lấy (nhân vật, tên, bảng màu hồng-cyan, bố cục lưới) vẫn giữ nguyên là không lấy.

### 1.2 Phong cách rút ra từ pilot

| Mặt | Quy chuẩn |
|---|---|
| **Hình khối** | Chỉ 5 loại khối: tròn, viên nang, chữ nhật bo góc, elip, đa giác. Tay chân là ống mảnh ("noodle"), không khớp cứng, không ngón (trừ ngón trỏ khi chỉ). |
| **Tỷ lệ** | Đầu và mắt rất to so với thân (mắt Miss Loupe còn rộng hơn thân). Côn trùng thấp, dài, mặt nằm ở đầu tròn phía trước. |
| **Mắt, miệng** | Tròng trắng tròn + con ngươi mực + một đốm sáng; má hồng hình elip; miệng là một nét mực hoặc một khối mực có lưỡi hồng. Không lông mày. |
| **Viền** | Không có viền. |
| **Ánh sáng, bóng** | Không gradient, không texture, không blur. Chiều sâu bằng **một mảng tối phẳng** ở dưới-phải của khối (ánh sáng từ trên-trái): sọc berryD bên phải thân Miss Loupe, bụng limeD của Chirp. |
| **Chất liệu** | Tô phẳng hoàn toàn. Ngoại lệ duy nhất: mặt kính (xanh rất nhạt, hai vệt sáng trắng), cánh ong (trong), quầng sáng của Blink, Smudge (khói trong suốt). |
| **Bảng màu** | Bảng `C` của [`kit.js`](../kit.js): kẹo tươi, độ bão hòa cao, nền mỗi cảnh một màu và không bao giờ trùng màu nhân vật. |
| **Chuyển động** | Nảy lò xo, ép dẹt khi chạm đất, mọi cú đáp nằm trên phách 120 BPM. |
| **Thủ pháp riêng** | Kính lúp phóng to thật cảnh đang có; chi tiết bí mật chỉ hiện trong kính. |

### 1.3 Đối chiếu kế hoạch kênh

Danh sách lấy từ §2.2–2.3 của [`KE-HOACH-PHAT-TRIEN-KENH.md`](../../KE-HOACH-PHAT-TRIEN-KENH.md): **13 nhân vật định kỳ** — Miss Loupe, Albie, Crumb, Flutter, Chirp, Waggle, Blink, Dot, Spindle, Mr. Rollo, Uncle Telly, The Giant, Smudge. Nhân vật khách mời (Zip, Hop, Fizz, Skip, Glimmer) **chưa thiết kế**: kế hoạch nói mỗi khách được thiết kế khi làm đúng tập đó, và Task yêu cầu không thêm nhân vật chưa được yêu cầu.

## 2. Điểm khác nhau và quyết định thiết kế

| # | Khác nhau | Quyết định |
|---|---|---|
| 1 | **Flutter và Albie cùng màu tím `grape`.** Pilot vẽ cánh trước Flutter bằng grape; kế hoạch giao grape cho bìa Albie và quy định mỗi nhân vật một màu chủ đạo không trùng nhau (§2.5.2). | Albie giữ `grape` (kế hoạch ghi rõ token). Cánh trước Flutter đổi sang tím đậm `night` #3B1F9E — vẫn là "bướm tím cam" như kế hoạch mô tả, chỉ đậm hơn. Muốn làm ngược lại thì chỉ cần đổi một dòng `FLUTTER_COL` trong [`cast/flutter.js`](cast/flutter.js) rồi dựng lại. |
| 2 | **Ong ở pilot là một khối, không có chân.** Kế hoạch: "vẽ đúng số chân" (§2.5.3); tập 8 dạy "ong có 5 mắt: 2 mắt to và 3 mắt nhỏ trên đỉnh đầu". | Waggle có đủ 3 phần thân (ngực xoài), 6 chân mực, 4 cánh, 2 mắt to + 3 mắt đơn. Vẫn giữ thân vàng chanh sọc mực, ngòi và râu của pilot. |
| 3 | **Côn trùng ở pilot chỉ có 2 khối thân.** Tập 6 dạy "côn trùng có 3 phần thân, nhện có 2". | Mọi côn trùng có 3 phần thân nhìn thấy được; Spindle có đúng 2. |
| 4 | **Chirp (`lime`) và Uncle Telly (`leaf`) cùng họ xanh lá.** Cả hai đều do pilot/kế hoạch quy định. | Giữ nguyên: khác token, khác độ sáng, khác hẳn bóng dáng, và Mùa 1 Telly chỉ lóe lên từ xa. Ghi chú trên bảng màu. |
| 5 | **Smudge chưa có tạo hình** (kế hoạch chỉ ghi "vết dấu tay trên kính", nhân vật tùy chọn). | Vết vân tay khói tím xám trong suốt, 5 vòng xoáy, có mắt và miệng theo ngữ pháp chung để trẻ nhận ra là một "phản diện vô hại". Chỉ sống trên mặt kính. |
| 6 | **Cơ chế "bìa hé ra như cái miệng" của Albie.** | Sổ đứng dọc, gáy trái. Khi nói, phần dưới bìa hé thành miệng: thấy mép giấy kem, lòng tối, lưỡi là ruy băng berry. Khi khép, miệng là một nếp bìa. Không tay chân: một trang giấy thò ra từ mép phải làm "tay". |
| 7 | **Chân xúc giác của nhện** dễ làm trẻ đếm thành 10 chân. | Không vẽ chân xúc giác; Spindle luôn đúng 8 chân, 8 mắt, không nanh, không lông. |
| 8 | **The Giant không có mặt**, nên "10 biểu cảm" không áp dụng theo nghĩa thường. | Biểu cảm của The Giant là 10 cử chỉ bàn tay. Không bao giờ bắt, cầm hay đè côn trùng (khớp §12: không khuyến khích trẻ bắt côn trùng). |
| 9 | **Tỷ lệ thật** làm côn trùng quá nhỏ cạnh Miss Loupe. | Hai thang: *thang truyện* (bảng 15, dùng khi cần đúng) và *thang cảnh chung* (côn trùng được phóng to tới khoảng 2,5 lần nhưng luôn giữ thứ tự to–nhỏ). |
| 10 | **Lông mày**: pilot không có. | Giữ không lông mày cho cả dàn; cảm xúc nằm ở mí mắt (khối cùng màu thân cắt vào tròng), con ngươi, miệng và ký hiệu phẳng. |

## 3. Hệ thống chung (xem [bảng 00](out/sheets/00-master-art-style-sheet.png))

- **Phong cách v2 "Kẹo Phẳng Viền"** (chi tiết ở mục 10): khối bo tròn; viền mực `#1E1B3A` đồng nhất trên mọi bộ phận, viền ngoài ≈ 1,7× nét trong; bóng cel mềm 4 tông (gốc, bán tối, tối ở mép khuất, vành sáng mảnh ở trên-trái); mắt tròng trắng có viền, mống mắt theo màu thân, con ngươi mực, hai điểm sáng, bóng mí; lông mày nổi theo cảm xúc; miệng nét thon, miệng mở có răng trên và lưỡi; má hồng có đốm bóng. Không gradient mượt, không texture, không chất liệu 3D.

- **Bảng màu:** bảng `C` của `kit.js`. Các sắc tối/sáng thêm vào (`nightD`, `tangD`, `mintD`, `pinkD`, `grapeD`, `inkL`, `skinL`, `leafL`, `wing`…) chỉ là mảng tối/sáng của chính màu đó, giống `berryD`, `leafD` của pilot. Toàn bộ nằm trong `X` của [`parts.js`](parts.js).
- **Màu chủ đạo, không trùng nhau:** Miss Loupe `berry` · Albie `grape` · Crumb `honey` · Flutter `night` · Chirp `lime` · Waggle `lemon` · Blink `mint` · Dot `tang` · Spindle `pink` · Mr. Rollo `ink` · Uncle Telly `leaf` · The Giant `skin` · Smudge khói trong suốt ([bảng 16](out/sheets/16-character-color-palette.png)).
- **10 biểu cảm chuẩn** (cùng ngữ pháp cho mọi nhân vật): vui vẻ, ngạc nhiên, tò mò, lo lắng, buồn, tự tin, bối rối, phấn khích, đang suy nghĩ, giải thích bí mật; mỗi nhân vật thêm 2 biểu cảm riêng theo tính cách trong kế hoạch.
- **11 tư thế chuẩn + 1 kiểu di chuyển riêng:** đứng, đi, chạy, nhảy, chỉ vào vật, quan sát qua kính lúp, cầm/tương tác đồ vật, phát hiện bất ngờ, giải thích, gag, kết tập/chuyển cảnh. Với côn trùng, tư thế "qua kính lúp" là nhân vật nằm trong vòng kính của Miss Loupe, cho thấy chi tiết chỉ kính mới thấy.
- **Đúng sinh học:** côn trùng 6 chân, 3 phần thân; nhện 8 chân, 2 phần thân, 8 mắt; Dot đúng 7 chấm; Waggle 5 mắt, 4 cánh; tai Chirp ở chân trước; Crumb không cánh.
- **Phụ kiện được phép:** khăn len mùa đông (Dot, Miss Loupe, Albie), kính tí hon của Crumb từ sau tập 12, vụn bánh/đồ vác của Crumb, viên tròn của Mr. Rollo, sợi tơ và đồ cải trang của Spindle (tập 7–10). Ngoài danh sách này thì không thêm.

## 4. Danh mục bảng hình (đối chiếu mục 5 của Task)

| Task | File |
|---|---|
| 1. Master Art Style Sheet | `00-master-art-style-sheet` |
| 2. Character Design Sheet (A + D) | `NN-<tên>-1-design-sheet`: 4 góc nhìn có đường chuẩn tỷ lệ, bảng màu, bóng đen ở 4 cỡ, so kích thước với Miss Loupe, hình dưới kính lúp, đặc điểm khóa |
| 3. Expression Sheet (B) | `NN-<tên>-2-expression-sheet`: 10 biểu cảm chuẩn + 2 biểu cảm riêng |
| 4. Pose & Action Sheet (C) | `NN-<tên>-3-pose-action-sheet`: 11 tư thế + kiểu di chuyển riêng |
| Character Expression & Pose Atlas (E) | `NN-<tên>-4-expression-pose-atlas`: tất cả trên một trang, dùng làm ảnh tham chiếu cho AI |
| 5. Character Lineup | `14-character-lineup` |
| 6. Character Size Comparison | `15-character-size-comparison` |
| 7. Character Color Palette | `16-character-color-palette` |
| 8. Character Silhouette Sheet | `17-character-silhouette-sheet` (gồm cả cỡ 64 px và 32 px) |
| 9. Character Interaction Sheet | `18-character-interaction-sheet`: 12 cặp quan hệ ở §2.4 |
| Nhóm nhân vật trong Backyard Garden (§3 Task) | `19-backyard-garden-group` (16:9) và `19b-…-vertical` (9:16 cho Shorts) |
| Bảng chi tiết không được thay đổi (§3 Task) | `20-locked-features` (chỉ có bản có chữ) |
| 10. Master Character Reference Sheet | `21-MASTER-CHARACTER-REFERENCE` |
| 5 gương mặt thương hiệu (v2, 11/2026) | `22-brand-expressions`: 13 nhân vật × vui vẻ, ngạc nhiên, tò mò, phấn khích, buồn cười |
| So sánh trước / sau (v2, 11/2026) | `23-before-after-v1-v2`: cảnh vườn 19 ở hai phong cách cạnh nhau + cận mặt 6 nhân vật (chỉ có bản có chữ) |

Số thứ tự nhân vật: 01 Miss Loupe, 02 Albie, 03 Crumb, 04 Flutter, 05 Chirp, 06 Waggle, 07 Blink, 08 Dot, 09 Spindle, 10 Mr. Rollo, 11 Uncle Telly, 12 The Giant, 13 Smudge.

## 5. Từng nhân vật

<!-- CAST:START -->

### 01 · Miss Loupe

Nhân vật chính · kính lúp biết đi, người dẫn chuyện.

| | |
|---|---|
| **Loài / vật** | Kính lúp |
| **Giọng** | Nữ, vui, rõ, chậm |
| **Ra mắt** | Pilot / Tập 1 |
| **Kích thước (thang truyện)** | 100% chiều cao Miss Loupe |
| **Phân biệt** | Bóng "vòng tròn trên que" duy nhất trong dàn; chỉ MỘT kính (Uncle Telly có hai). |
| **Kiểu di chuyển** | Đi nảy lò xo, mỗi bước đáp đúng phách; kính nghiêng về phía vật đang soi. |

**Bảng màu**

| Token | Mã | Dùng cho |
|---|---|---|
| `berry` | `#E8336D` | Màu chủ đạo: vành kính, thân |
| `berryD` | `#B71F52` | Mảng tối, tay, chân |
| `mango` | `#FFC32B` | Cổ áo, bàn tay, giày |
| `glass` | `#DFF9FF` | Mặt kính |
| `pink` | `#FF9CC2` | Má |
| `ink` | `#1E1B3A` | Con ngươi, miệng |

**Đặc điểm khóa (không được thay đổi)**

1. Vành kính tròn berry, rỗng giữa (thấy cảnh sau kính), hai vệt sáng trắng ở góc trên-trái.
2. Thân là cán kính hình viên nang berry, mảng tối berryD luôn ở mép phải.
3. Mặt nằm trên thân, không nằm trong kính: 2 mắt to, má hồng, miệng mực.
4. Cổ áo xoài nối kính với thân; bàn tay tròn và giày xoài.
5. Tay chân là ống mảnh berryD, không ngón (chỉ thêm ngón trỏ khi chỉ).
6. Kính chiếm khoảng 54% chiều cao; mắt rộng hơn thân một chút.

**Bộ phận điều khiển được (rig):** tay trái/phải: vai → khuỷu (elbowL/R) → bàn tay tròn (handL/R), ngón trỏ khi chỉ (pointL/R), ngón cái (thumbL/R) · chân: hông → bàn chân (footL/R) + giày · kính: chúc (lensPitch), nghiêng (lensRoll), cảnh trong kính (inside), Smudge trên kính (smudge) · khăn (scarf); cộng phần mặt dùng chung (cuối mục này).

**Bảng hình:** [thiết kế](out/sheets/01-loupe-1-design-sheet.png) · [biểu cảm](out/sheets/01-loupe-2-expression-sheet.png) · [tư thế](out/sheets/01-loupe-3-pose-action-sheet.png) · [atlas](out/sheets/01-loupe-4-expression-pose-atlas.png) · bản sạch cho AI: [atlas](out/clean/01-loupe-4-expression-pose-atlas.png)

**Prompt mô tả (tiếng Anh, dán kèm prompt phong cách):**

> Miss Loupe, a walking magnifying glass: round raspberry-pink (#E8336D) lens rim with clear pale-cyan glass and two white highlight arcs at upper-left; her body is the handle, a raspberry capsule with a darker raspberry (#B71F52) stripe on its right edge; the face sits on the handle (not in the lens): two big round white eyes, pink cheeks, small navy smile; mango-yellow (#FFC32B) collar between lens and handle, mango round mitten hands and oval shoes; thin dark-raspberry noodle arms and legs.

### 02 · Albie

Cuốn sổ sưu tầm biết nói, người giữ luật "6 chân".

| | |
|---|---|
| **Loài / vật** | Sổ sticker |
| **Giọng** | Nam trầm, lịch sự, chậm |
| **Ra mắt** | Tập 1 |
| **Kích thước (thang truyện)** | 55% chiều cao Miss Loupe |
| **Phân biệt** | Khối chữ nhật duy nhất trong dàn; "tóc" sticker nhiều màu. |
| **Kiểu di chuyển** | Lạch bạch trên hai góc đáy, mỗi bước nghiêng sang một bên; nhảy thì các mép sticker bay lên. |

**Bảng màu**

| Token | Mã | Dùng cho |
|---|---|---|
| `grape` | `#5A33D6` | Màu chủ đạo: bìa |
| `grapeD` | `#4424B2` | Gáy, cạnh bìa |
| `cream` | `#FFF8E7` | Ruột giấy, miệng |
| `honey` | `#E8871E` | Góc bọc |
| `berry` | `#E8336D` | Ruy băng = lưỡi |
| `tabs` | `#3CC8FF` | Mép sticker (tóc): sky, lemon, mint, pink |

**Đặc điểm khóa (không được thay đổi)**

1. Sổ đứng dọc, gáy bên trái, bìa trước tím grape.
2. Hai mắt tròn ở nửa trên bìa trước, má hồng.
3. Miệng = bìa hé ra: thấy mép giấy kem, lòng tối, lưỡi là ruy băng berry.
4. Bốn mép sticker xanh trời, vàng chanh, bạc hà, hồng thò lên ở cạnh trên như tóc.
5. Góc bọc vàng mật ở hai góc ngoài; đuôi ruy băng berry thò ra ở đáy.
6. Không tay chân: cử chỉ bằng một trang giấy thò ra từ mép phải; đi bằng cách lắc trên hai góc đáy.

**Bộ phận điều khiển được (rig):** nhún cả quyển (hop), lắc trên góc đáy khi đi (tilt), trang giấy làm tay (page [dài, cao, nghiêng], pageCurl), mép sticker bay (tabsUp), bìa hé = miệng, khóc ướt trang (wet), trang mới (newPage), khăn (scarf); cộng phần mặt dùng chung (cuối mục này).

**Bảng hình:** [thiết kế](out/sheets/02-albie-1-design-sheet.png) · [biểu cảm](out/sheets/02-albie-2-expression-sheet.png) · [tư thế](out/sheets/02-albie-3-pose-action-sheet.png) · [atlas](out/sheets/02-albie-4-expression-pose-atlas.png) · bản sạch cho AI: [atlas](out/clean/02-albie-4-expression-pose-atlas.png)

**Prompt mô tả (tiếng Anh, dán kèm prompt phong cách):**

> Albie, a talking sticker album: an upright purple (#5A33D6) hardcover book with the spine on its left, cream (#FFF8E7) page block visible on the right and top edges, honey-orange (#E8871E) metal corner guards on the two outer corners, four colored sticker tabs (sky blue, lemon, mint, pink) sticking out of the top edge like hair, two big round eyes and pink cheeks on the upper front cover; when it talks the cover gapes open like a mouth showing cream page edges and a raspberry (#E8336D) ribbon bookmark as its tongue. No arms, no legs.

### 03 · Crumb

Kiến con hay hỏi, người xem đại diện.

| | |
|---|---|
| **Loài / vật** | Kiến thợ (con) |
| **Giọng** | Trẻ em, cao, nhanh |
| **Ra mắt** | Tập 2 |
| **Kích thước (thang truyện)** | 12% chiều cao Miss Loupe |
| **Phân biệt** | Bóng "kiến + cục to trên đầu"; hai dấu hỏi trên râu. |
| **Kiểu di chuyển** | Chạy lon ton, bước ngắn và nhanh, đồ trên đầu nảy theo nhịp. |

**Bảng màu**

| Token | Mã | Dùng cho |
|---|---|---|
| `honey` | `#E8871E` | Màu chủ đạo: thân |
| `honeyD` | `#B85C12` | Chân, râu, mảng tối |
| `honeyL` | `#F2A33A` | Vụn bánh |
| `pink` | `#FF9CC2` | Má |
| `ink` | `#1E1B3A` | Mắt, miệng |

**Đặc điểm khóa (không được thay đổi)**

1. Đầu to hơn bụng như em bé, mắt to.
2. Hai râu gập khuỷu, đầu râu cuộn móc; khi hỏi cuộn thành hai dấu "?".
3. Đủ 3 phần thân (đầu, ngực, bụng) với eo nhỏ; KHÔNG có cánh.
4. Đúng 6 chân: 4 chân đứng, 2 chân trước dùng làm tay.
5. Luôn vác một vật to hơn mình (mặc định là vụn bánh).
6. Từ sau tập 12: có kính lúp tí hon riêng.

**Bộ phận điều khiển được (rig):** 4 chân đứng (feet), 2 chân trước làm tay (armL/R), nhấc người (lift), nghiêng thân (bodyLean), râu cuộn dấu hỏi (q 0..1), râu chạm râu (reach), đồ vác (carry, prop); cộng phần mặt dùng chung (cuối mục này).

**Bảng hình:** [thiết kế](out/sheets/03-crumb-1-design-sheet.png) · [biểu cảm](out/sheets/03-crumb-2-expression-sheet.png) · [tư thế](out/sheets/03-crumb-3-pose-action-sheet.png) · [atlas](out/sheets/03-crumb-4-expression-pose-atlas.png) · bản sạch cho AI: [atlas](out/clean/03-crumb-4-expression-pose-atlas.png)

**Prompt mô tả (tiếng Anh, dán kèm prompt phong cách):**

> Crumb, a baby ant: amber-orange (#E8871E) body in three clear parts (big round baby head, small thorax, round abdomen) with a thin waist, no wings, exactly six thin darker-amber (#B85C12) legs (stands on four, uses the front two as arms), two elbowed antennae whose tips curl into question-mark shapes, huge round eyes and pink cheeks; always carries something bigger than itself overhead, by default a golden cookie crumb.

### 04 · Flutter

Bướm ham ăn, nếm mọi thứ bằng chân.

| | |
|---|---|
| **Loài / vật** | Bướm |
| **Giọng** | Không lời ("Mmm!", tiếng cười) |
| **Ra mắt** | Pilot |
| **Kích thước (thang truyện)** | 24% chiều cao Miss Loupe |
| **Phân biệt** | Hai mảng màu tím đậm + cam là nhân vật hai tông duy nhất; bóng cánh lớn. |
| **Kiểu di chuyển** | Bay chập chờn đường zigzag, đáp nhẹ và luôn "nếm" chỗ vừa đáp. |

**Bảng màu**

| Token | Mã | Dùng cho |
|---|---|---|
| `night` | `#3B1F9E` | Màu chủ đạo: cánh trước |
| `tang` | `#FF7A2F` | Cánh sau, vòi |
| `mango` | `#FFC32B` | Đốm cánh, đầu râu |
| `cream` | `#FFF8E7` | Tâm đốm |
| `ink` | `#1E1B3A` | Thân, chân, râu |

**Đặc điểm khóa (không được thay đổi)**

1. Bốn cánh: hai cánh trước tím đậm có đốm xoài tâm kem và một đốm kem nhỏ; hai cánh sau cam có đốm xoài.
2. Thân mực đủ 3 phần, 6 chân mảnh.
3. Vòi cam cuộn ốc dưới mặt, duỗi ra khi nếm.
4. Râu mực, đầu râu tròn xoài.
5. Không vẽ miệng: cảm xúc nằm ở mắt, râu, vòi và cánh.

**Bộ phận điều khiển được (rig):** cánh: vỗ lên xuống (beta), xoè trước sau (alpha) · bay (lift) · 6 chân (feet, legsUp) · râu vểnh/cụp (antL/R) · vòi cuộn ↔ duỗi (tongue 0..1); cộng phần mặt dùng chung (cuối mục này).

**Bảng hình:** [thiết kế](out/sheets/04-flutter-1-design-sheet.png) · [biểu cảm](out/sheets/04-flutter-2-expression-sheet.png) · [tư thế](out/sheets/04-flutter-3-pose-action-sheet.png) · [atlas](out/sheets/04-flutter-4-expression-pose-atlas.png) · bản sạch cho AI: [atlas](out/clean/04-flutter-4-expression-pose-atlas.png)

**Prompt mô tả (tiếng Anh, dán kèm prompt phong cách):**

> Flutter, a butterfly: four wings, the two forewings deep violet (#3B1F9E) with a mango-yellow spot with a cream center and a small cream dot, the two hindwings orange (#FF7A2F) with a mango spot; slim dark-navy body in three parts (head, thorax, abdomen), six thin navy legs, navy antennae ending in round mango tips, an orange curled proboscis under the face, big white eyes on a small navy head, no mouth drawn.

### 05 · Chirp

Dế nhạc công rụt rè, tai rất thính.

| | |
|---|---|
| **Loài / vật** | Dế |
| **Giọng** | Không lời (Mùa 2 tập 5 nói từ đầu tiên) |
| **Ra mắt** | Pilot |
| **Kích thước (thang truyện)** | 20% chiều cao Miss Loupe |
| **Phân biệt** | Bóng dài thấp với đùi sau gập cao và hai râu dài nhất dàn. |
| **Kiểu di chuyển** | Nhảy bật bằng chân sau; khi chơi nhạc cánh nâng lên rung. |

**Bảng màu**

| Token | Mã | Dùng cho |
|---|---|---|
| `lime` | `#B7F04A` | Màu chủ đạo: đầu, thân |
| `limeD` | `#86C72C` | Chân, râu, bụng dưới |
| `leaf` | `#22B866` | Cánh |
| `leafD` | `#169150` | Gân cánh, tai |
| `pink` | `#FF9CC2` | Má |

**Đặc điểm khóa (không được thay đổi)**

1. Thân xanh chanh, cánh xanh lá xếp trên lưng.
2. Đùi sau to gập cao hơn lưng.
3. Râu rất dài vắt ngược ra sau.
4. Đuôi có hai gai.
5. TAI nằm ở ống chân TRƯỚC (đốm tròn chỉ rõ trong kính); trên đầu không có tai.
6. Đủ 3 phần thân (ngực có tấm khiên), 6 chân.

**Bộ phận điều khiển được (rig):** nhảy (lift), rung cánh kêu (chirp), chân trước (frontL/R), tai ở chân trước sáng (earGlow), đùi sau co duỗi (hindUp), râu gợn (ant); cộng phần mặt dùng chung (cuối mục này).

**Bảng hình:** [thiết kế](out/sheets/05-chirp-1-design-sheet.png) · [biểu cảm](out/sheets/05-chirp-2-expression-sheet.png) · [tư thế](out/sheets/05-chirp-3-pose-action-sheet.png) · [atlas](out/sheets/05-chirp-4-expression-pose-atlas.png) · bản sạch cho AI: [atlas](out/clean/05-chirp-4-expression-pose-atlas.png)

**Prompt mô tả (tiếng Anh, dán kèm prompt phong cách):**

> Chirp, a field cricket: lime-green (#B7F04A) body in three parts with a darker lime shield behind the head, leaf-green (#22B866) folded wings on its back, very long thin antennae sweeping back over the body, huge folded hind legs whose knees rise above its back, two tail prongs, six legs; its ears are tiny round spots on the FRONT legs (never on the head); big round eyes, pink cheek, shy smile.

### 06 · Waggle

Ong mật không nói, chỉ nhảy để "nói".

| | |
|---|---|
| **Loài / vật** | Ong mật |
| **Giọng** | Không lời |
| **Ra mắt** | Pilot |
| **Kích thước (thang truyện)** | 15% chiều cao Miss Loupe |
| **Phân biệt** | Khối tròn sọc mực duy nhất trong dàn. |
| **Kiểu di chuyển** | Bay lượn; khi nhảy vẽ hình số 8 và lắc mông ở đoạn thẳng giữa. |

**Bảng màu**

| Token | Mã | Dùng cho |
|---|---|---|
| `lemon` | `#FFE34D` | Màu chủ đạo: đầu, bụng |
| `mango` | `#FFC32B` | Ngực |
| `ink` | `#1E1B3A` | Sọc, ngòi, chân, râu, mắt đơn |
| `wing` | `#EFFFFA` | Cánh |
| `mintL` | `#A9F7E2` | Gân cánh |

**Đặc điểm khóa (không được thay đổi)**

1. Bụng vàng chanh có 2 sọc mực và chóp mực có ngòi.
2. 5 mắt: 2 mắt to + 3 mắt đơn nhỏ xếp tam giác trên đỉnh đầu.
3. 4 cánh trong (2 lớn, 2 nhỏ).
4. Đủ 3 phần thân (ngực xoài), 6 chân mực.
5. Râu mực gãy khúc, đầu tròn.
6. Không lời; "nói" bằng điệu nhảy.

**Bộ phận điều khiển được (rig):** bay (lift), vỗ cánh (wing), lắc mông khi nhảy (wag), chúc đầu (pitch), 6 chân (legsUp), chớp 3 mắt đơn (ocelliBlink); cộng phần mặt dùng chung (cuối mục này).

**Bảng hình:** [thiết kế](out/sheets/06-waggle-1-design-sheet.png) · [biểu cảm](out/sheets/06-waggle-2-expression-sheet.png) · [tư thế](out/sheets/06-waggle-3-pose-action-sheet.png) · [atlas](out/sheets/06-waggle-4-expression-pose-atlas.png) · bản sạch cho AI: [atlas](out/clean/06-waggle-4-expression-pose-atlas.png)

**Prompt mô tả (tiếng Anh, dán kèm prompt phong cách):**

> Waggle, a honeybee: round lemon-yellow (#FFE34D) head and striped lemon abdomen with two navy bands and a navy tip with a small stinger, a mango (#FFC32B) thorax between them (three body parts), four translucent pale-mint wings (two big, two small), six navy legs, elbowed navy antennae with round tips, two big eyes plus three tiny navy simple eyes in a triangle on top of the head (five eyes total), pink cheeks, smile.

### 07 · Blink

Đom đóm vui tính, không giữ nổi bí mật.

| | |
|---|---|
| **Loài / vật** | Đom đóm (bọ cánh cứng) |
| **Giọng** | Nữ, cao, hay cười |
| **Ra mắt** | Tập 3 |
| **Kích thước (thang truyện)** | 10% chiều cao Miss Loupe |
| **Phân biệt** | Nhân vật duy nhất phát sáng; nguồn sáng của mọi cảnh đêm. |
| **Kiểu di chuyển** | Bay lượn sóng, để lại vệt chấm sáng. |

**Bảng màu**

| Token | Mã | Dùng cho |
|---|---|---|
| `mint` | `#7BF0D0` | Màu chủ đạo: thân, áo choàng |
| `mintD` | `#45D3AF` | Khiên ngực, mảng tối |
| `lemon` | `#FFE34D` | Đèn đuôi khi sáng |
| `cream` | `#FFF8E7` | Đèn đuôi khi tắt |
| `ink` | `#1E1B3A` | Chân, râu |

**Đặc điểm khóa (không được thay đổi)**

1. Thân tròn bạc hà, cánh cứng khép như áo choàng.
2. Tấm khiên ngực bạc hà đậm như mũ trùm trên đầu.
3. Đèn đuôi vàng chanh + quầng sáng tròn; sáng lên khi biết bí mật, hồi hộp, xấu hổ (chối thì càng sáng).
4. 6 chân mực ngắn, râu mực đầu tròn.
5. Đom đóm là bọ cánh cứng: không vẽ như ruồi.

**Bộ phận điều khiển được (rig):** độ sáng đèn đuôi (glow), bay: mở áo choàng + cánh trong (fly 0..1), nhấc (lift), chân (legsUp), vểnh đuôi (tailUp); cộng phần mặt dùng chung (cuối mục này).

**Bảng hình:** [thiết kế](out/sheets/07-blink-1-design-sheet.png) · [biểu cảm](out/sheets/07-blink-2-expression-sheet.png) · [tư thế](out/sheets/07-blink-3-pose-action-sheet.png) · [atlas](out/sheets/07-blink-4-expression-pose-atlas.png) · bản sạch cho AI: [atlas](out/clean/07-blink-4-expression-pose-atlas.png)

**Prompt mô tả (tiếng Anh, dán kèm prompt phong cách):**

> Blink, a firefly: small round mint-green (#7BF0D0) beetle with closed wing covers like a little cape, a darker mint hood-like shield over the head, a glowing lemon-yellow (#FFE34D) tail lantern with soft round halo rings, six short navy legs, navy antennae with round tips, big white eyes, pink cheeks, giggly smile.

### 08 · Dot

Bọ rùa lịch sự, đếm to mọi thứ.

| | |
|---|---|
| **Loài / vật** | Bọ rùa 7 chấm |
| **Giọng** | Nữ, rõ, kiểu cô giáo nhí |
| **Ra mắt** | Đặc biệt mùa đông (21/12/2026) |
| **Kích thước (thang truyện)** | 9% chiều cao Miss Loupe |
| **Phân biệt** | Vòm tròn cam có chấm; nhỏ, thấp, tròn nhất dàn. |
| **Kiểu di chuyển** | Bò đều tăm tắp, mỗi bước một nhịp đếm. |

**Bảng màu**

| Token | Mã | Dùng cho |
|---|---|---|
| `tang` | `#FF7A2F` | Màu chủ đạo: vòm cánh |
| `tangD` | `#D65A1E` | Mảng tối |
| `ink` | `#1E1B3A` | 7 chấm, đầu, ngực, chân |
| `cream` | `#FFF8E7` | Mảng trắng ngực, miệng |
| `sky` | `#3CC8FF` | Khăn len (chỉ mùa đông) |

**Đặc điểm khóa (không được thay đổi)**

1. Đúng 7 chấm: 1 chấm giữa ngay sau ngực, 3 chấm mỗi bên.
2. Đường nối hai cánh màu mực chạy giữa lưng.
3. Đầu mực, mắt trắng to, miệng kem.
4. Tấm ngực mực có 2 mảng trắng.
5. 6 chân mực.
6. Khăn len xanh trời chỉ xuất hiện ở tập mùa đông.

**Bộ phận điều khiển được (rig):** nhấc (lift), 6 chân, giơ chân đếm (legsUp), khăn (scarf); cộng phần mặt dùng chung (cuối mục này).

**Bảng hình:** [thiết kế](out/sheets/08-dot-1-design-sheet.png) · [biểu cảm](out/sheets/08-dot-2-expression-sheet.png) · [tư thế](out/sheets/08-dot-3-pose-action-sheet.png) · [atlas](out/sheets/08-dot-4-expression-pose-atlas.png) · bản sạch cho AI: [atlas](out/clean/08-dot-4-expression-pose-atlas.png)

**Prompt mô tả (tiếng Anh, dán kèm prompt phong cách):**

> Dot, a seven-spot ladybug: round orange-red (#FF7A2F) dome with exactly seven navy spots (one in the middle just behind the thorax, three on each side) and a navy center seam, navy head with two big white eyes and a cream smile, navy thorax with two white patches, six short navy legs, short navy antennae with round tips.

### 09 · Spindle

Nhện nghệ sĩ, muốn được vào sổ.

| | |
|---|---|
| **Loài / vật** | Nhện (không phải côn trùng) |
| **Giọng** | Nữ, trầm ấm, hơi kịch |
| **Ra mắt** | Tập 6 (ló mặt từ tập 2) |
| **Kích thước (thang truyện)** | 20% chiều cao Miss Loupe |
| **Phân biệt** | Bóng "bụng tròn + 8 chân gập" duy nhất; nhiều mắt nhất dàn. |
| **Kiểu di chuyển** | Thả mình theo sợi tơ từ trên xuống, nảy nhẹ ở cuối sợi. |

**Bảng màu**

| Token | Mã | Dùng cho |
|---|---|---|
| `pink` | `#FF9CC2` | Màu chủ đạo: thân |
| `pinkD` | `#F27AAE` | Mảng tối, má |
| `grape` | `#5A33D6` | Đốm bụng, 8 chân |
| `cream` | `#FFF8E7` | Sợi tơ |
| `ink` | `#1E1B3A` | Con ngươi, miệng |

**Đặc điểm khóa (không được thay đổi)**

1. 2 phần thân: đầu-ngực nhỏ + bụng tròn lớn có đốm tím.
2. Đúng 8 chân dài mảnh màu tím, gối vồng cao hơn thân.
3. Đúng 8 mắt: hàng dưới 4 (2 mắt giữa to), hàng trên 4 mắt nhỏ.
4. Không lông, không răng nanh, không vẽ chân xúc giác (để trẻ đếm đúng 8).
5. Vào cảnh từ trên xuống, treo trên sợi tơ kem.

**Bộ phận điều khiển được (rig):** 8 chân (legs), giấu 2 chân để giả côn trùng (hidden), nhấc (lift), sợi tơ (thread), cánh giấy (wings), áo len (sweater); cộng phần mặt dùng chung (cuối mục này).

**Bảng hình:** [thiết kế](out/sheets/09-spindle-1-design-sheet.png) · [biểu cảm](out/sheets/09-spindle-2-expression-sheet.png) · [tư thế](out/sheets/09-spindle-3-pose-action-sheet.png) · [atlas](out/sheets/09-spindle-4-expression-pose-atlas.png) · bản sạch cho AI: [atlas](out/clean/09-spindle-4-expression-pose-atlas.png)

**Prompt mô tả (tiếng Anh, dán kèm prompt phong cách):**

> Spindle, a friendly spider: soft pink (#FF9CC2) body in exactly two parts, a small head-body in front and a big round abdomen with purple (#5A33D6) polka dots; exactly eight long thin purple legs with knees arching above the body; exactly eight round eyes in two rows (two big central eyes with pupils, six small eyes), darker pink cheeks, a smile; no hair, no fangs, no extra palps; often hangs from a cream silk thread.

### 10 · Mr. Rollo

Bọ hung già điềm tĩnh, trốn trong mọi tập.

| | |
|---|---|
| **Loài / vật** | Bọ hung |
| **Giọng** | Nam già, trầm, chậm |
| **Ra mắt** | Trốn từ tập 1, ra mắt tập 11 |
| **Kích thước (thang truyện)** | 12% chiều cao Miss Loupe |
| **Phân biệt** | Bọ đen duy nhất, luôn kèm một quả cầu nâu to gần bằng mình. |
| **Kiểu di chuyển** | Trồng cây chuối, đẩy viên tròn bằng chân sau theo đường thẳng. |

**Bảng màu**

| Token | Mã | Dùng cho |
|---|---|---|
| `ink` | `#1E1B3A` | Màu chủ đạo: thân bóng |
| `sky` | `#3CC8FF` | Vệt bóng |
| `inkL` | `#3A3566` | Đường nối cánh |
| `honeyD` | `#B85C12` | Viên tròn |
| `honey` | `#E8871E` | Đốm trên viên tròn |

**Đặc điểm khóa (không được thay đổi)**

1. Thân đen bóng với vệt sáng xanh trời ở phía trên-trái của vòm cánh và ngực.
2. Đầu hình xẻng, mép răng cưa.
3. Mí mắt hơi sụp: già, điềm tĩnh.
4. 6 chân, chân trước có răng.
5. Luôn đi cùng viên tròn nâu; đi thẳng tắp, không bao giờ rẽ.

**Bộ phận điều khiển được (rig):** viên tròn: vị trí (ball), cỡ (ballR), lăn (ballSpin), ẩn/hiện (showBall) · 6 chân (legsUp) · nhấc (lift); cộng phần mặt dùng chung (cuối mục này).

**Bảng hình:** [thiết kế](out/sheets/10-rollo-1-design-sheet.png) · [biểu cảm](out/sheets/10-rollo-2-expression-sheet.png) · [tư thế](out/sheets/10-rollo-3-pose-action-sheet.png) · [atlas](out/sheets/10-rollo-4-expression-pose-atlas.png) · bản sạch cho AI: [atlas](out/clean/10-rollo-4-expression-pose-atlas.png)

**Prompt mô tả (tiếng Anh, dán kèm prompt phong cách):**

> Mr. Rollo, an old dung beetle: glossy navy-black (#1E1B3A) domed body with sky-blue (#3CC8FF) shine streaks on the upper left of the wing cover and thorax, a shovel-shaped head with a serrated front edge, calm half-closed eyelids, six navy legs with small teeth on the front legs; always with a round brown (#B85C12) ball about his own size.

### 11 · Uncle Telly

Ống nhòm, anh họ của Miss Loupe, soi những thứ xa và to.

| | |
|---|---|
| **Loài / vật** | Ống nhòm |
| **Giọng** | Nam, vang, vui |
| **Ra mắt** | Lóe lên ở tập 11; có lời từ Mùa 3 |
| **Kích thước (thang truyện)** | 113% chiều cao Miss Loupe |
| **Phân biệt** | Bóng "hai vòng tròn trên que" — đối xứng với Miss Loupe nhưng không nhầm được. |
| **Kiểu di chuyển** | Bước dài, chắc; khi nhìn xa thì ngửa hai ống kính lên. |

**Bảng màu**

| Token | Mã | Dùng cho |
|---|---|---|
| `leaf` | `#22B866` | Màu chủ đạo: ống, thân |
| `leafD` | `#169150` | Mảng tối, tay chân, cầu nối |
| `lemon` | `#FFE34D` | Tròng kính, tay, giày, cổ áo |
| `leafL` | `#5BD892` | Vành ống |
| `ink` | `#1E1B3A` | Thị kính phía sau |

**Đặc điểm khóa (không được thay đổi)**

1. Hai ống kính xanh lá chĩa về phía trước, tròng vàng chanh ĐẶC (không trong suốt như kính Miss Loupe).
2. Phía sau là hai thị kính màu mực.
3. Cùng cấu trúc với Miss Loupe: kính ở trên, thân là cán, mặt trên thân.
4. Cao hơn Miss Loupe khoảng 13%, thân to hơn, miệng rộng.
5. Bánh xe chỉnh nét vàng chanh trên cầu nối.

**Bộ phận điều khiển được (rig):** tay trái/phải (handL/R, elbowL/R, pointL/R, thumbL/R), chân (footL/R), ngửa hai ống kính (lensPitch), lóe sáng tròng kính (glint); cộng phần mặt dùng chung (cuối mục này).

**Bảng hình:** [thiết kế](out/sheets/11-telly-1-design-sheet.png) · [biểu cảm](out/sheets/11-telly-2-expression-sheet.png) · [tư thế](out/sheets/11-telly-3-pose-action-sheet.png) · [atlas](out/sheets/11-telly-4-expression-pose-atlas.png) · bản sạch cho AI: [atlas](out/clean/11-telly-4-expression-pose-atlas.png)

**Prompt mô tả (tiếng Anh, dán kèm prompt phong cách):**

> Uncle Telly, a walking pair of binoculars: two leaf-green (#22B866) barrels pointing forward with solid lemon-yellow (#FFE34D) lenses, joined by a darker green bridge with a small lemon focus wheel on top, navy eyepieces at the back; his body below is a big leaf-green capsule with a darker green stripe on the right, the face on the body (big eyes, pink cheeks, wide smile), lemon collar, lemon mitten hands and shoes, darker green noodle limbs; about 13% taller than Miss Loupe.

### 12 · The Giant

Bàn tay, bàn chân của một bạn nhỏ — "thời tiết" của khu vườn.

| | |
|---|---|
| **Loài / vật** | Người (trẻ em) |
| **Giọng** | Không lời |
| **Ra mắt** | Pilot (bàn chân) |
| **Kích thước (thang truyện)** | bàn chân dài ≈ chiều cao Miss Loupe; bàn tay ≈ 75% |
| **Phân biệt** | Khối da lớn nhất khung, luôn bị cắt ở mép khung. |
| **Kiểu di chuyển** | Chậm, nhẹ; mỗi cú đặt chân làm cả vườn rung một nhịp. |

**Bảng màu**

| Token | Mã | Dùng cho |
|---|---|---|
| `skin` | `#FFC9A3` | Màu chủ đạo: da |
| `skinD` | `#F2A77C` | Mảng tối, chỉ tay |
| `skinL` | `#FFDCC2` | Móng tay, móng chân |
| `shadow` | `rgba(30,27,58,.22)` | Bóng đổ trên vườn |

**Đặc điểm khóa (không được thay đổi)**

1. Không bao giờ thấy mặt; cổ tay và cổ chân luôn đi ra khỏi khung.
2. Bàn tay mũm mĩm: 4 ngón + ngón cái, ngón ngắn, đầu tròn.
3. Bàn chân 5 ngón tròn, đúng dáng ở pilot.
4. Không bao giờ bắt, cầm hay đè côn trùng: chỉ chỉ, vẫy, đặt nhẹ, mở cửa sổ.
5. Bóng đổ là màu mực trong suốt, mềm, không đáng sợ.

**Bộ phận điều khiển được (rig):** bàn tay hoặc bàn chân (part), 11 cử chỉ tay (gesture: open, point, thumbs, wave, fist, soft, peace, count1, spread, curl, tap), xoay 3 trục (rot), lòng/mu bàn tay (palm), nhón chân (foot), ngọ nguậy ngón chân (toeWiggle).

**Bảng hình:** [thiết kế](out/sheets/12-giant-1-design-sheet.png) · [biểu cảm](out/sheets/12-giant-2-expression-sheet.png) · [tư thế](out/sheets/12-giant-3-pose-action-sheet.png) · [atlas](out/sheets/12-giant-4-expression-pose-atlas.png) · bản sạch cho AI: [atlas](out/clean/12-giant-4-expression-pose-atlas.png)

**Prompt mô tả (tiếng Anh, dán kèm prompt phong cách):**

> The Giant: only the chubby hand or bare foot of a small child entering from the edge of the frame, peach skin (#FFC9A3) with a slightly darker peach (#F2A77C) shade patch, short rounded fingers, light nails; never show the face or the rest of the body; gentle gestures only (pointing, waving, resting near the bugs), never grabbing or squashing insects.

### 13 · Smudge

Vết dấu tay trên kính, phản diện vô hại.

| | |
|---|---|
| **Loài / vật** | Vết vân tay |
| **Giọng** | Không lời |
| **Ra mắt** | Tùy chọn |
| **Kích thước (thang truyện)** | 15% chiều cao Miss Loupe |
| **Phân biệt** | Nhân vật trong suốt duy nhất; không có viền cứng. |
| **Kiểu di chuyển** | Trườn chậm trên mặt kính, loang rộng ra khi gay cấn. |

**Bảng màu**

| Token | Mã | Dùng cho |
|---|---|---|
| `smudge` | `rgba(58,53,102,.30)` | Màu chủ đạo: khói tím xám trong suốt |
| `ridge` | `rgba(58,53,102,.32)` | Vân tay |
| `glass` | `#DFF9FF` | Luôn nằm trên mặt kính |
| `lid` | `#C9CBE0` | Mí mắt |

**Đặc điểm khóa (không được thay đổi)**

1. Chỉ sống trên mặt kính, phẳng như một lớp màng (nhìn nghiêng gần như biến mất).
2. Vân tay xoáy 5 vòng.
3. Màu khói tím xám trong suốt: cảnh sau kính mờ đi chứ không bị che đen.
4. Mắt và miệng theo ngữ pháp chung; nhìn từ sau kính không thấy mặt.
5. Không lời, vô hại; biến mất bằng một cú lau chuyển cảnh.

**Bộ phận điều khiển được (rig):** co giãn (sx, sy), méo mép (wob, ph), vệt bị lau (streak), mờ dần (fade), nhỏ giọt (drip), nâng trên kính (lift), cảnh dưới kính (under); cộng phần mặt dùng chung (cuối mục này).

**Bảng hình:** [thiết kế](out/sheets/13-smudge-1-design-sheet.png) · [biểu cảm](out/sheets/13-smudge-2-expression-sheet.png) · [tư thế](out/sheets/13-smudge-3-pose-action-sheet.png) · [atlas](out/sheets/13-smudge-4-expression-pose-atlas.png) · bản sạch cho AI: [atlas](out/clean/13-smudge-4-expression-pose-atlas.png)

**Prompt mô tả (tiếng Anh, dán kèm prompt phong cách):**

> Smudge, a harmless fingerprint smudge living on a glass lens: a soft rounded translucent smoky-lilac blob with five concentric fingerprint ridge lines, two small round white eyes and a cheeky small smirk; completely flat on the glass, no outline, the scene behind stays visible through it.

#### Prompt phong cách dùng chung (v2, hiện hành)

> Premium 2D vector cartoon for a preschool educational series. Simple rounded shapes (circles, capsules, rounded rectangles, ellipses). Clean, smooth, uniform dark navy (#1E1B3A) outlines on every body part, the outer silhouette line slightly thicker than the inner lines. Soft cel shading: bright flat base color, a narrow mid-tone band and a thin darker rim on the lower-right of each shape, a thin light rim on the upper-left (light from upper-left); hard-edged shade shapes, no smooth gradients, no textures, no 3D or realistic materials. Big glossy eyes: white eyeball with a thin outline, colored iris tinted from the body color, navy pupil, two white catchlights, a soft lid shadow; expressive floating eyebrows; tapered mouth lines, open mouths show top teeth and a pink tongue; small pink cheeks with a tiny shine. Bright, vivid, harmonious candy palette, clean simple background.

#### Prompt phong cách v1 (chỉ cho các tập đã giao trước 11/2026)

> Flat 2D vector cartoon for preschool kids, built only from simple geometric shapes (circles, capsules, rounded rectangles, ellipses). Flat solid colors, NO outlines, NO gradients, NO textures, NO blur. Depth only from one flat darker shade patch on the lower-right of a shape (light from upper-left). Big round white eyes with dark navy (#1E1B3A) pupils and one white glint, pink oval cheeks, no eyebrows. Bright candy palette, clean simple background.

#### Phần mặt dùng chung của rig

Mắt (look hướng nhìn, open nhắm mở, pupil cỡ con ngươi, scale cỡ mắt), mí (lidTop, lidTilt, lidBot), lông mày v2 (brow: lift nhướng, tilt đầu trong lên/xuống, arch độ vồng; browL/browR riêng từng bên), miệng (13 dáng + talk 0..1 khi nói), nghiêng đầu (tilt), ký hiệu cảm xúc (fx).

<!-- CAST:END -->

## 6. Dùng với AI tạo video

1. Luôn đính kèm **`out/clean/21-MASTER-CHARACTER-REFERENCE.png`** và **atlas sạch** của từng nhân vật xuất hiện trong cảnh (`out/clean/NN-<tên>-4-expression-pose-atlas.png`). Cần bối cảnh thì thêm `out/clean/19-backyard-garden-group.png` hoặc bản dọc `19b`.
2. Prompt = **prompt phong cách v2** (cuối mục 5) + prompt mô tả của từng nhân vật có mặt + hành động của cảnh. Prompt mô tả ghi "big round white eyes": với v2 hiểu là mắt trắng có mống mắt màu và hai điểm sáng như bảng 22.
3. Prompt phủ định nên có: *smooth gradients, airbrush, 3D render, realistic, glossy plastic, fur, fangs, extra legs, sketchy or uneven lines, text, watermark*. (Bản v1 cũ còn phủ định thêm *outlines, eyebrows*; v2 thì có cả hai.)
4. Sau khi tạo, so với bảng `20-locked-features`: đếm chân, mắt, chấm, cánh; kiểm tra màu chủ đạo.
5. AI hay sai nhất ở: số chân côn trùng, 8 mắt của Spindle, 7 chấm của Dot, tai của Chirp (hay bị vẽ lên đầu), mặt Miss Loupe (hay bị đặt vào trong kính). Mấy chỗ này nên kiểm tra kỹ từng cảnh.

## 7. Dùng trong pipeline dựng bằng code

Bộ nhân vật nằm ở `_shared/characters/` (ngay dưới thư mục gốc của thư viện), dùng chung cho mọi tập. Các tập mới vẽ nhân vật bằng chính rig này, thay cho `cast.js` của pilot. Từ một thư mục phim `films/<tên-tập>/`, gọi bằng đường dẫn tuyệt đối (công cụ render lấy thư mục gốc của thư viện làm gốc web):

```js
import { drawChar } from '/_shared/characters/stage.js';
import { BY } from '/_shared/characters/cast/index.js';
import { C } from '/_shared/kit.js';   // bảng màu dùng chung
// (x, y) là điểm giữa chân trên mặt đất; yaw 0 = chính diện, .62 = ba phần tư, π/2 = nghiêng, π = phía sau
drawChar(c, BY.crumb, { x: 540, y: 1500, h: 260, yaw: .5, expr: 'curious', pose: { carry: 'crumb' } });
```

- **Phong cách:** mặc định vẫn là v1 để các tập đã giao dựng lại ra y hệt. Tập mới bật v2 một lần ở đầu `film.js`:
  ```js
  import { LOOK } from '/_shared/characters/look.js';
  LOOK.v = 2;   // Kẹo Phẳng Viền: viền, bóng cel mềm, mắt long lanh, lông mày
  ```
  Độ dày viền tự tính theo chiều cao nhân vật trên khung (mũ 0,3 nên nhân vật đứng cạnh nhau có nét gần nhau). Muốn mọi nhân vật trong một cảnh cùng đúng một độ dày thì truyền `line` (px logic, tổng viền ngoài) cho `drawChar`; `LOOK.lineK` nhân cả loạt. Biểu cảm có thể ghi lông mày `brow: { lift, tilt, arch }` (hoặc `browL` / `browR`); không ghi thì lông mày tự suy ra từ mí, cỡ mắt, mắt nhắm. Biểu cảm mới `silly` (nháy mắt, lè lưỡi) và miệng mới `tongue`.
- Tư thế mẫu nằm trong [`poses.js`](poses.js); biểu cảm trong `EXPR` của [`face.js`](face.js); tham số rig ở đầu mỗi file trong [`cast/`](cast/).
- `detail: 1` bật chi tiết chỉ thấy trong kính (tai Chirp, điểm nếm ở chân Flutter).
- Thêm khách mời mới: tạo một file trong `cast/` theo mẫu của nhân vật gần nhất, thêm vào `cast/index.js`, `bible.js`, `poses.js`, rồi chạy lại `tools/render.mjs` và `tools/bible.mjs`.
- Thư mục pilot giữ nguyên `kit.js` và `cast.js` của riêng nó, nên `build.sh` của tập 1 vẫn chạy như cũ.

## 8. Tự kiểm tra (mục 6 của Task)

| Câu hỏi | Kết quả |
|---|---|
| Bám sát file kế hoạch? | Có. Mọi màu, chi tiết và tật trong §2.1–2.3 đều có trên hình: râu dấu hỏi của Crumb, 8 mắt của Spindle, đèn đuôi của Blink, viên tròn và đường thẳng của Rollo, 7 chấm và khăn mùa đông của Dot, hai ống kính tròng chanh của Telly, The Giant không lộ mặt. Ba chỗ lệch có lý do ghi ở mục 2: màu Flutter, cấu tạo Waggle, số phần thân. |
| Giữ được phong cách của video tham khảo? | Giữ phong cách của pilot (bản chưng cất của video tham khảo): khối phẳng, không viền, một mảng tối, bảng màu kẹo. Miss Loupe, Flutter, Chirp dựng lại đúng tỷ lệ của `cast.js`. Chưa đối chiếu được với video gốc vì video không có trong repo. |
| Các góc nhìn là cùng một nhân vật? | Có, theo cách dựng: 4 góc nhìn là cùng một rig xoay quanh trục đứng, cùng một tỷ lệ trên một trang, có đường chuẩn tỷ lệ chạy ngang qua cả 4 góc. |
| Biểu cảm có làm đổi cấu trúc nhận diện? | Không. Biểu cảm chỉ đổi mí, con ngươi, miệng, ký hiệu và cử chỉ; khối, màu, số mắt, số chân giữ nguyên (cùng một hàm vẽ). |
| Các nhân vật phân biệt rõ với nhau? | Có. 13 màu chủ đạo khác token; bảng 17 cho thấy bóng đen nhận ra được ở 64 px. Ở 32 px, Blink và Dot là hai khối tròn nhỏ gần nhau nhất: Blink cao hơn, có hai râu dài; Dot thấp và rộng. |
| Đủ để tái tạo nhân vật ở các tập sau? | Có: bảng hình cho người, bản sạch và prompt cho AI, và rig code dùng trực tiếp trong pipeline. |

## 9. Việc còn mở

- **Khách mời** (Zip, Hop, Fizz, Skip, Glimmer…) thiết kế khi làm tập tương ứng, theo cùng hệ thống. Khách mời nằm trong `GUESTS` của [`cast/index.js`](cast/index.js) (có trong `BY`, không nằm trong 13 nhân vật định kỳ của `CAST`, nên các bảng hình tổng hợp không đổi).
  - **Fizz** (ruồi nhà, không lời) — thiết kế ngày 10/11/2026 cho [SHORT-009](../../films/short-009/TREATMENT.md), rig ở [`cast/fizz.js`](cast/fizz.js), bảng hình ở [`films/short-009/modelsheet.jpg`](../../films/short-009/modelsheet.jpg). Đặc điểm khoá: thân xanh than `#3D4470` có hai sọc xám ở bụng; **hai vòm mắt kép đỏ** (berry) to, mỗi vòm một con mắt hoạt hình; **đúng hai cánh trong** và hai núm thăng bằng màu kem sau cánh (ruồi là "Diptera", một cặp cánh); vòi ngắn; râu cụt; sáu chân mảnh. Tật: cọ hai chân trước (`pose.rub`), hay bắt chước người khác. Khác Blink ở màu (xanh than so với bạc hà), mắt (đỏ so với trắng) và cánh (hai cánh trong so với tấm cánh + đèn đuôi).
  - **Zip** (chuồn chuồn, không lời, chỉ tiếng "zip!") — thiết kế ngày 10/11/2026 cho [SHORT-010](../../films/short-010/TREATMENT.md), rig ở [`cast/zip.js`](cast/zip.js), bảng hình ở [`films/short-010/modelsheet.jpg`](../../films/short-010/modelsheet.jpg). Đặc điểm khoá: thân xanh trời (`sky`) rất dài, đuôi có vòng chanh; **hai vòm mắt kép xanh cốm (lime) khổng lồ chiếm gần hết đầu và chạm nhau ở đỉnh đầu**, mỗi vòm một con mắt hoạt hình; **bốn cánh dài trong suốt xoè ngang**, chấm sẫm ở đầu cánh; sáu chân ngắn gom dưới ngực; miệng nhỏ dưới hai vòm mắt. Dáng riêng: `pose.peek` (hai mắt hoạt hình trượt quanh vòm mắt để cho thấy Zip đang nhìn ra sau), `pose.blur` (cánh mờ nhoè khi đứng yên giữa trời), `pose.curl` (đuôi cong), `pose.beat`/`flap` (đập cánh). Tật: bay lùi, đứng yên giữa trời. Khác Blink (bạc hà, tròn) và Fizz (xanh than, mắt đỏ) ở màu, thân dài và bốn cánh.
  - **Hop** (châu chấu, không lời, chỉ tiếng nảy "boing" và tiếng cọ chân) — thiết kế ngày 14/11/2026 cho SHORT-013 (ra mắt), SHORT-014, SHORT-015; rig ở [`cast/hop.js`](cast/hop.js). Cố ý cùng "họ hình" với Chirp để SHORT-013 mở bằng "trông khá giống nhau", nhưng khác ở hình: **thân xanh lá đậm** (`leaf`) có sọc chanh dọc bụng dưới (Chirp: xanh chanh `lime`); **râu ngắn, dày, chĩa về trước** (Chirp: râu rất dài vắt ra sau); **cánh nâu vàng** `#C9A050` gấp như mái nhà trên lưng (Chirp: cánh xanh lá); **tai là hai màng nghe tròn ở hai bên đốt bụng đầu** (`HOP.ear(sd)` cho vị trí; Chirp: tai ở ống chân trước); **đùi sau có sọc chữ V và một hàng gai nhỏ ở mặt trong** (chỉ rõ khi `detail` hoặc `pose.pegs`), cọ vào mép cánh để "hát"; lưng có tấm yên ngựa sẫm; không có đuôi hai gai. Dáng riêng: `lift` (nhảy: chân sau duỗi ra sau), `crouch` (co chân lấy đà), `fiddle` + `bow` (đùi sau kéo lên xuống như vĩ cầm), `ear` (màng nghe sáng, gợn sóng), `earCover` (hai chân trước bịt hai bên bụng), `hindUp`, `wingOpen`, `ant`, `frontL`/`frontR`.
- **Màu da của The Giant:** pilot dùng `skin` #FFC9A3. Vì tập 12 nói "người khổng lồ chính là bạn", có thể cân nhắc vài tông da thay đổi theo tập. Đây chỉ là đề xuất; bộ này giữ đúng màu pilot.
- **Tra nhãn hiệu tên nhân vật** trước khi làm sản phẩm (§13 kế hoạch).
- **Các tập đã giao** (SHORT-001…010, LONG-001) vẫn ở v1. Chuyển một tập sang v2 chỉ cần `LOOK.v = 2` rồi dựng lại, nhưng phải chạy lại `qa.py` và xem lại khung hình (viền làm nhân vật nhỏ trông đậm hơn, phụ đề và vùng an toàn không đổi).

## 10. Nâng cấp v2 "Kẹo Phẳng Viền" (11/2026)

Yêu cầu: nâng cả dàn lên hoạt hình 2D vector cao cấp cho phim giáo dục thiếu nhi, giữ nguyên nhận diện, dùng lâu dài cho series. Cách làm: nâng **một lần trong rig dùng chung** (`look.js`, `rig.js`, `face.js`, `stage.js`), nên 13 nhân vật định kỳ, 2 khách mời và mọi bảng hình đổi cùng lúc, cùng một độ dày nét, cùng kỹ thuật bóng, cùng mức chi tiết.

| Yêu cầu | Đã làm |
|---|---|
| 1. Giữ nhận diện | Không đổi loài, khối, tỷ lệ, màu chủ đạo, số chân, số mắt, số chấm, phụ kiện. Mọi bảng giữ nguyên bố cục, vị trí nhân vật và bối cảnh (cảnh vườn 19 dựng lại y bố cục, xem bảng 23). Không thêm nhân vật. |
| 2. Ngoại hình | Nét viền mượt đều; mắt to có mống mắt theo màu thân, con ngươi rõ, hai điểm sáng và bóng mí; **thêm lông mày** (mỗi biểu cảm một dáng, tự suy ra nếu không ghi); miệng nét thon, miệng mở có răng trên và lưỡi; má có đốm bóng; biểu cảm mới `silly` (buồn cười: nháy mắt, lè lưỡi). Bảng 22 cho 5 biểu cảm vui vẻ, ngạc nhiên, tò mò, phấn khích, buồn cười của cả dàn. |
| 3. Phong cách | 2D vector, khối bo tròn, viền mực đồng nhất (viền ngoài dày hơn nét trong), bóng cel mềm 4 tông có mép gọn, không gradient mượt, không texture, không 3D. Bảng màu giữ nguyên. |
| 4. Dễ làm hoạt hình | Mỗi bộ phận (tay, chân, râu, cánh, mắt, mí, lông mày, miệng, đồ vác) là một khối riêng có nét riêng và tham số rig riêng (mục 5, dòng "Bộ phận điều khiển được"). Viền vẽ lại mỗi khung từ hình khối nên không vỡ khi đi, chạy, nhảy, nói (bảng 03 của từng nhân vật). Chỗ nối da liền khối (cổ tay The Giant) không kẻ nét để không bị đứt khi xoay. |
| 5. Đồng nhất | Một hàm viền, một hàm bóng, một ngữ pháp mặt cho cả dàn; độ dày viền theo cỡ nhân vật trên khung (mũ 0,3). |

**Cách viền được vẽ:** lượt 1 vẽ một vòng mực rộng quanh mọi khối đặc của nhân vật, nằm dưới cả nhân vật, nên chỉ lộ ra ở mép bóng ngoài (viền ngoài); lượt 2 vẽ từng khối với bóng cel và một nét mực mảnh quanh khối (nét trong, tách các bộ phận). Khối trong suốt (quầng sáng Blink, khói Smudge, bóng mờ cánh) không vào lượt 1; cánh trong của Fizz, Zip chỉ có nét viền, không bị tô mực bên dưới.

**Giới hạn đã biết:** nhân vật rất nhỏ trên khung (dưới khoảng 60 px) trông đậm nét hơn v1; Smudge giữ viền khói mờ thay vì viền mực để vẫn là vết trong suốt; Flutter vẫn không vẽ miệng (biểu cảm nằm ở vòi, râu, mắt, lông mày).
