# TỔNG HỢP TOÀN BỘ PROMPT — Thiệp Cưới "Lễ Dạm Ngõ"

---

## 1. Prompt code layout (đưa cho Antigravity)

### 1.1 Khung thiệp full-screen
```
Thiệp phải chiếm TOÀN BỘ viewport (full screen):
- html, body: margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden.
- .card-container: width: 100vw; height: 100dvh; position: relative.
- Không dùng aspect-ratio cố định 16:10 — thiệp = toàn bộ màn hình.
- .card-front / .card-back: position: absolute; inset: 0; 3D flip (perspective ở
  container cha, transform: rotateY(180deg), backface-visibility: hidden,
  transition: transform 0.8s ease-in-out).
- Padding an toàn: padding: 3vh 4vw.
- Tự lật qua lại mỗi 4-5s (setInterval), có hàm flipCard() gọi khi click.
- Toàn bộ font-size/kích thước ảnh dùng clamp(), không dùng vw/px thuần.
```

### 1.2 Hệ thống theme (CSS variables — không cần nút switch, chỉ sửa code)
```css
:root {
  /* THEME PINK (mặc định) */
  --color-bg-primary: #FAF0EC;
  --color-bg-secondary: #F5E2DA;
  --color-text-title: #2A2A2A;
  --color-text-script: #8B2C42;
  --color-text-script-light: #A85A6E;
  --color-heart-accent: #E8879F;
  --color-watermark: rgba(232, 135, 159, 0.14);
  --color-border: #E8D5CC;
  --color-groom-outfit: #8B2C42;
  --color-bride-outfit: #E491B5;
  --color-gold-accent: #D4AF37;
  --asset-folder: 'pink';
  --font-title: 'Playfair Display', serif;
  --font-script: 'Sacramento', 'Great Vibes', cursive;
}

/* THEME GREEN-GOLD — uncomment để đổi, comment khối trên lại
:root {
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #FAFAF7;
  --color-text-title: #2E4433;
  --color-text-script: #2C4536;
  --color-text-script-light: #3B5A45;
  --color-heart-accent: #D4AF37;
  --color-watermark: rgba(212, 175, 55, 0.18);
  --color-border: #D4AF37;
  --color-leaf: #4A6B44;
  --color-groom-outfit: #3F5C3C;
  --color-bride-outfit: #F7F3E8;
  --color-gold-accent: #D4AF37;
  --asset-folder: 'green-gold';
}
*/
```
```javascript
// script.js — 1 dòng duy nhất để đổi theme
const THEME_FOLDER = 'pink'; // đổi thành 'green-gold' khi cần
```
> Rà soát toàn bộ CSS: không để sót màu hardcode, tất cả dùng `var(--color-xxx)`.

### 1.3 Cấu trúc thư mục asset (song song 2 theme, không đè lên nhau)
```
assets/
├── pink/        (lotus-bottom-left.png, lotus-top-right.png, lotus-top-left.png,
│                  lotus-bottom-right.png, double-happiness-watermark.png,
│                  divider-ornament.png, couple-thank-you.gif)
└── green-gold/  (cùng tên file, nội dung khác)
```

### 1.4 Bố cục 4 góc hoa sen (hướng vào tâm, bao quanh thiệp)
```css
.lotus--bottom-left  { position:absolute; bottom:0; left:0;  width:clamp(180px,34vw,420px); }
.lotus--bottom-right { position:absolute; bottom:0; right:0; width:clamp(190px,36vw,440px); }
.lotus--top-right    { position:absolute; top:0;   right:0; width:clamp(160px,30vw,380px); }
.lotus--top-left     { position:absolute; top:0;   left:0;  width:clamp(160px,30vw,380px); opacity:0.55; }
```
Text content z-index cao hơn lớp hoa (z-index:10 vs z-index:1) để không bị che.

### 1.5 Ảnh cặp đôi cảm ơn (thay watermark chữ Hỉ ở mặt sau)
```css
.watermark--couple {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -55%);
  width: clamp(90px, 16vw, 160px);
  opacity: 0.9; z-index: 2;
}
```
Dùng file `.gif` thật (đổi theo THEME_FOLDER), không cần CSS animation giả lập.

### 1.6 QA checklist (fix lỗi viền xanh, kiểm tra tổng thể)
```
1. img { border: none; outline: none; display: block; } — reset đầu file CSS.
2. Kiểm tra path ảnh khớp chính xác giữa assets/pink/ và assets/green-gold/.
3. Kiểm tra PNG asset có nền trong suốt sạch, không viền alpha-matting.
4. Test 3D flip trên Chrome/Safari/Firefox.
5. Test responsive ở 375px / 768px / 1440px+.
6. Test đổi THEME_FOLDER pink ↔ green-gold, xác nhận đồng bộ toàn bộ màu + ảnh.
```

---

## 2. Prompt ảnh — Hoa sen 4 góc

### THEME PINK

**Asset A — góc dưới-trái (bản mới nhất, xum xuê, giữ cấu trúc gốc)**
```
A hand-painted watercolor lotus flower illustration in soft pink and blush tones,
two to three large blooming lotus flowers clustered together with layered petals,
two lotus leaves in muted sage green, delicate thin black outline linework in
traditional Vietnamese wedding invitation style, flat vector-watercolor hybrid,
no shadows, no gradients other than soft petal shading, isolated on transparent
background, PNG, high resolution, corner decoration composition (flower cluster
positioned bottom-left, leaves extending outward), wedding invitation card asset,
elegant and minimal
```

**Asset B — góc trên-phải (một bông sen to, chúi chéo vào tâm)**
```
Botanical illustration artwork, NOT a photograph: a single large fully-blooming
lotus flower, viewed from a three-quarter angle, layered soft pink petals with
delicate watercolor shading, one lotus leaf and a short stem in muted sage green,
thin black ink outline linework, flat vector-watercolor hybrid, hand-painted
look, traditional Vietnamese wedding invitation aesthetic, no shadows, isolated
on fully transparent background, PNG, corner decoration composition anchored
top-right, flower angled diagonally inward toward the bottom-left.

Strict style constraints: pure illustration only, no photorealism, no 3D
rendering. Absolutely no human elements — no hands, no fingers, no people.
```

**Asset D — góc trên-trái (line-art, lật gương của Asset B)**
```
Botanical line-art illustration, NOT a photograph: the exact same single lotus
flower composition as its colored counterpart (top-right) — one large
fully-blooming lotus flower with one leaf and short stem — rendered purely as
thin single-weight outline sketch, no fill, no color, pale cream/off-white line
only, traditional Vietnamese wedding invitation watermark style, isolated on
fully transparent background, PNG, corner decoration composition anchored
top-left, flower mirrored/flipped horizontally so it angles diagonally inward
toward the bottom-right.

Strict style constraints: pure line-art only, no shading, no color fill.
Absolutely no human elements — no hands, no fingers, no people.
```

**Asset C — góc dưới-phải (cụm to, hướng phải→trái, đối xứng với A)**
```
A hand-painted watercolor cluster of lotus flowers, one large fully-blooming
lotus flower (focal bloom, larger and more prominent) plus one smaller bud and
two lotus leaves in muted sage green, soft pink and rose watercolor tones with
thin black ink outline, same style as Asset A, isolated on fully transparent
background PNG, anchored bottom-right, cluster oriented horizontally facing and
leaning toward the left (mirroring bottom-left cluster so both frame the card).

Absolutely no human elements — no hands, no fingers, no people.
```

### THEME GREEN-GOLD (trắng + vàng gold + xanh rêu, thanh thoát theo dáng bên Pink)

**Asset A (green-gold) — góc dưới-trái (bản mới nhất, học hỏi bố cục thoáng & thanh thoát từ bên Pink)**
```
Botanical illustration artwork, NOT a photograph: an ELEGANT, BALANCED cluster of
lotus flowers directly learning from the layout and composition of Asset A (Pink) —
two to three fully-blooming lotus flowers nestled closely at the bottom-left corner
with layered petals and prominent warm gold stamen centers (#D4AF37), soft warm white
and ivory/cream watercolor petal shading (#FFFFFF–#F7F3E8) with delicate thin black ink
outline linework.

Graceful slender curving vines and stems extending outward from the corner: one vine
trailing upward along the left margin with delicate small leaves and a slender bud, and
one vine trailing horizontally along the bottom margin with small leaves and subtle
gold sparkle dots.

Only one or two gentle lotus leaves resting at the bottom base beneath the blossoms
in rich forest green (#4A6B44–#3F5C3C) — airy, elegant, spacious, NOT crowded with
heavy masses of leaves. Flat vector-watercolor hybrid, traditional Vietnamese wedding
invitation aesthetic, isolated on fully transparent background, PNG, corner decoration
composition anchored bottom-left.

Color palette: petals white to cream (#FFFFFF–#F7F3E8), bud/stamen gold (#D4AF37),
leaves/vines forest green (#4A6B44–#3F5C3C). No pink, no burgundy, no heavy dark foliage.

Strict style constraints: pure illustration only, no photorealism.
Absolutely no human elements — no hands, no fingers, no people.
```

**Asset B (green-gold) — góc trên-phải**
```
Botanical illustration artwork, NOT a photograph: a single large fully-blooming
lotus flower, three-quarter angle, layered soft white and cream petals, warm
gold-yellow stamen/center detail, one lotus leaf and short stem in rich forest
green, thin black ink outline linework, same art style as reference, isolated on
fully transparent background, PNG, anchored top-right, angled diagonally inward
toward bottom-left.

Color palette: white-cream petals, gold stamen (#D4AF37), forest green leaf
(#4A6B44). No pink, no burgundy, no brown.

Absolutely no human elements — no hands, no fingers, no people.
```

**Asset D (green-gold) — góc trên-trái (line-art, lật gương của B)**
```
Botanical line-art illustration, NOT a photograph: exact same lotus composition
as top-right colored version, rendered purely as thin outline sketch, no fill,
no color, pale sage-green/off-white line only, isolated on fully transparent
background, PNG, anchored top-left, mirrored/flipped horizontally, angled
diagonally inward toward bottom-right.

Absolutely no human elements — no hands, no fingers, no people.
```

**Asset C (green-gold) — góc dưới-phải (lật gương đối xứng hoàn hảo với Asset A)**
```
Botanical illustration artwork, NOT a photograph: exact same elegant cluster as
Asset A (green-gold) bottom-left, mirrored/flipped horizontally so it is anchored
at the bottom-right corner.

Two to three blooming lotus flowers in soft white and cream watercolor tones with
warm gold stamens and thin black ink outline, delicate vines extending upward along
the right border and leftward along the bottom border toward center, one or two
gentle forest green lotus leaves at the base. Balanced matched pair with bottom-left,
framing the bottom of the card symmetrically.

Isolated on fully transparent background, PNG, anchored bottom-right.

Color palette: petals white to cream (#FFFFFF–#F7F3E8), bud/stamen gold (#D4AF37),
leaves forest green (#4A6B44–#3F5C3C). No pink, no burgundy, no brown.

Strict style constraints: pure illustration only, no photorealism.
Absolutely no human elements — no hands, no fingers, no people.
```

---

## 3. Prompt ảnh — Cặp đôi Việt phục cúi đầu (mặt sau, thay chữ Hỉ)

**Cách ghép GIF:** 3 ảnh gốc (Frame 1-2-3) → ghép thứ tự `1→2→3→2→1`, lặp vô hạn, timing `500ms–250ms–400ms–250ms`.

### THEME PINK

**Frame 1 — Đứng thẳng**
```
Groom wearing authentic traditional Vietnamese wedding attire (Việt phục), NOT
Chinese hanfu, NOT Korean hanbok — "áo the/áo dài gấm cưới": long deep red/maroon
brocade tunic below the knee, mandarin collar, diagonal front closure with
fabric-covered frog buttons, woven dragon-and-cloud motif (rồng mây) tone-on-tone,
gold silk trim on collar/cuffs/closure, wide-leg white/cream trousers, fabric sash
at waist, traditional khăn đóng turban in matching maroon with gold trim line, no
hanging ends. Black cloth shoes.

Bride wearing traditional Vietnamese "áo Nhật Bình" bridal robe: wide-sleeved
long outer robe in soft blush pink silk brocade, square embroidered collar panel
with gold thread phoenix and lotus motifs, wide bell sleeves with gold cuff trim,
worn over inner tunic and pleated skirt in ivory/cream, decorative sash with
hanging ends center-front, ornate headpiece (mấn/khăn vành dây) in soft pink
fabric bands with gold floral hairpins and gold forehead ornament. Gold drop
earrings, hair pulled back beneath headpiece.

Both: hand-painted watercolor illustration style, warm light skin tone, soft
rounded youthful features, gentle closed-mouth smile, thin black ink outline,
soft watercolor shading with visible brush texture, flat vector-watercolor
hybrid, no harsh shadows. Standing side by side, groom left, bride right, facing
camera at three-quarter angle. Camera slightly above eye level looking down
~10-15°. Isolated on fully transparent background, PNG, no background/props,
full-body composition with generous padding.

POSE: Both standing fully upright, spine straight, chin level, hands clasped in
front of chest at sternum height, elbows slightly bent, shoulders level and
square to camera, weight balanced, feet together.

[FRAME 1 of 3 — UPRIGHT, 0° forward tilt — PINK]
```

**Frame 2 — Cúi 15°**
```
[Chèn nguyên khối mô tả trang phục/khuôn mặt/phong cách/camera angle ở Frame 1 —
giữ nguyên không đổi]

POSE: Both beginning to bow, upper body (head, neck, shoulders, torso from waist
up) inclining FORWARD AND DOWNWARD toward camera ~15° from vertical, bending at
hips toward viewer — NOT sideways lean, NOT turning body, shoulders level and
square to camera. Hands clasped, slightly lower/forward as torso tilts. Head
tilts down proportionally, eyes lowering. Hips/legs/feet stationary upright.

[FRAME 2 of 3 — FORWARD BOW, ~15° — PINK]
```

**Frame 3 — Cúi 40° (đỉnh)**
```
[Chèn nguyên khối mô tả trang phục/khuôn mặt/phong cách/camera angle ở Frame 1 —
giữ nguyên không đổi]

POSE: Both at deepest point of bow, upper body inclined FORWARD AND DOWNWARD
toward camera ~40° from vertical — clear respectful deep bow, hinging at waist
toward viewer, NOT sideways lean, shoulders level and square to camera. Hands
clasped, lower near waist height. Head tilted furthest down, eyes closed/looking
down, chin tucked. Hips/legs/feet stationary upright — only upper body hinged to
max angle. Lowest point of the bowing gesture.

[FRAME 3 of 3 — DEEP FORWARD BOW, ~40°, LOWEST POINT — PINK]
```

### THEME GREEN-GOLD
```
[Dùng nguyên 3 frame ở trên, chỉ đổi đoạn trang phục thành:]

Groom: same áo the/khăn đóng structure, rendered in deep forest green brocade
with dragon-and-cloud motif tone-on-tone, gold silk trim, matching green khăn
đóng with gold trim line.

Bride: same áo Nhật Bình structure, rendered in ivory/white silk brocade with
gold thread phoenix and lotus embroidery on collar panel, ivory headpiece with
gold floral hairpins, gold forehead ornament.

[Toàn bộ phần POSE, camera angle, art style, facial description giữ nguyên
không đổi ở cả 3 frame]
```