# Shopymalls UI Design Specifications

Status: POC design baseline  
Version: 0.1  
Platforms: iPhone-first Expo application, responsive to Android and web previews  
Themes: Dark only for the POC  
Languages: Indonesian (`id-ID`) and English (`en`)  
Currency: Indonesian rupiah (`IDR`)

## 1. Source and Intent

This specification formalizes the visual system already present in the delivered Shopymalls material. It does not introduce a new visual direction.

The decisions below are derived from:

- `docs/briefings/SHOPYMALLS 2.1.pdf`
- The three reference images in `docs/briefings/`
- `docs/briefings/shopymalls_codes_app/Shopymalls_Step_14.17_Booking_Engine/App.js`

The delivered material consistently presents Shopymalls as a premium, high-contrast, technology-forward shopping platform with black surfaces, vivid lime accents, bold typography, image-led discovery, rounded panels, and thin borders. Booking is visually differentiated with purple while remaining inside the same dark system.

## 2. Visual Principles

1. **Dark, premium, and energetic.** Near-black surfaces create a premium retail setting; lime communicates discovery, action, and momentum.
2. **Content first.** Mall, store, deal, event, and product photography should carry the emotional weight of shopper screens.
3. **Clear commercial hierarchy.** Deals, discounts, calls to action, and key metrics must be immediately scannable.
4. **One ecosystem.** Shopper, retailer, mall, and admin experiences use the same tokens and component language.
5. **Booking is related, not separate.** Purple identifies booking flows without replacing the core Shopymalls lime identity.
6. **Dense but controlled.** Dashboards may show more information than shopper screens, but spacing, typography, and borders must remain consistent.

## 3. Color System

### 3.1 Core palette

These colors come directly from the delivered prototype code.

| Token | Hex | Usage |
|---|---:|---|
| `color.canvas` | `#050505` | App background, navigation backdrop, text on lime |
| `color.surface` | `#101010` | Default cards, inputs, floating navigation |
| `color.surfaceRaised` | `#151515` | Raised cards, selected neutral surfaces, overlays |
| `color.surfaceOverlay` | `#1A1A1A` | Menus, modal surfaces, elevated controls |
| `color.border` | `#2A2A2A` | Default 1 px borders and separators |
| `color.textPrimary` | `#F6F6F6` | Titles, body text, primary values |
| `color.textSecondary` | `#A3A3A3` | Supporting copy, metadata, placeholders |
| `color.textTertiary` | `#828282` | Low-emphasis metadata and inactive labels; lifted from the delivered `#6F6F6F` to preserve accessible contrast at small sizes |
| `color.textDisabled` | `#8A8A8A` | Disabled controls only |
| `color.lime` | `#B8F500` | Primary brand accent and primary action |
| `color.onLime` | `#050505` | Text and icons on lime surfaces |

### 3.2 Lime support colors

The delivered dashboards repeatedly use dark olive surfaces and borders around highlighted cards.

| Token | Hex | Usage |
|---|---:|---|
| `color.limeSurface` | `#101400` | Highlighted cards and selected sections |
| `color.limeSurfaceStrong` | `#171C00` | Pressed or stronger highlighted surface |
| `color.limeBorder` | `#3A4B12` | Border around lime-tinted cards |

Lime must remain selective. Use it for primary calls to action, active navigation, deal values, selected states, positive status, and important section icons. Do not use lime as a large page background.

### 3.3 Booking palette

The purple values are sampled from the delivered Shopymalls Booking artwork and consolidated into three roles.

| Token | Hex | Usage |
|---|---:|---|
| `color.booking` | `#A85DD4` | Booking icons, active tabs, highlighted labels |
| `color.bookingStrong` | `#68289E` | Booking buttons and strong filled surfaces |
| `color.bookingSurface` | `#302251` | Booking cards and selected dark surfaces |
| `color.onBooking` | `#F6F6F6` | Text/icons on `bookingStrong` |

Use purple only when the interaction is specifically about reservations, availability, appointments, or My Bookings. General app navigation remains lime.

### 3.4 Status palette

These status colors are taken from the delivered prototype.

| Token | Hex | Usage |
|---|---:|---|
| `color.success` | `#B8F500` | Active, confirmed, ready, successful |
| `color.warning` | `#F6C850` | Pending, expiring, needs attention |
| `color.warningSurface` | `#2B2100` | Warning badge background |
| `color.danger` | `#FF6B6B` | Error, blocked, destructive action |
| `color.dangerSurface` | `#4A2020` | Destructive badge or error background |

Never communicate status by color alone. Pair it with an icon and a localized label.

### 3.5 Image overlays

Image cards in the delivered prototype use black overlays to keep copy readable.

| Token | Value | Usage |
|---|---:|---|
| `overlay.imageSoft` | `rgba(0, 0, 0, 0.34)` | Mall and event photography |
| `overlay.imageStrong` | `rgba(0, 0, 0, 0.44)` | Deal and promotion photography |
| `overlay.imageBottom` | `rgba(0, 0, 0, 0.82)` | Bottom gradient behind multi-line copy |

Prefer a transparent-to-black vertical gradient for hero copy. Use a flat overlay only when the entire image contains UI text.

### 3.6 Contrast requirements

- `#F6F6F6` on `#050505`: 18.86:1
- `#A3A3A3` on `#050505`: 8.08:1
- `#B8F500` on `#050505`: 15.62:1
- `#050505` on `#B8F500`: 15.62:1
- `#A85DD4` on `#050505`: 5.03:1

Primary body text must meet WCAG AA. Never place lime or purple text directly over an unprotected photograph.

## 4. Typography

### 4.1 Typeface

The delivered PDF embeds **Open Sans Regular** and **Open Sans Bold**, so Open Sans is the official POC typeface.

| Role | Typeface | Weight |
|---|---|---:|
| Body and metadata | Open Sans Regular | 400 |
| Titles, labels, actions, and metrics | Open Sans Bold | 700 |
| Wordmark | Supplied Shopymalls logo asset | N/A |

Fallback stack: `Open Sans`, `system-ui`, `sans-serif`.

Do not recreate the Shopymalls wordmark as live text when an approved logo asset is available. Do not synthesize 800 or 900 weights; the bold visual language in the delivered screens maps to Open Sans Bold 700.

### 4.2 Type scale

All measurements are density-independent pixels (`dp` in React Native; equivalent to points for design handoff).

| Token | Size | Line height | Weight | Tracking | Usage |
|---|---:|---:|---:|---:|---|
| `type.display` | 34 | 40 | 700 | -0.6 | Large KPI or campaign value |
| `type.screenTitle` | 30 | 36 | 700 | -0.5 | Home-area and major screen titles |
| `type.heroTitle` | 26 | 32 | 700 | -0.4 | Mall, deal, and campaign hero titles |
| `type.title` | 24 | 30 | 700 | -0.3 | Business dashboard title, store title |
| `type.titleSmall` | 20 | 26 | 700 | -0.2 | Card title and prominent deal brand |
| `type.section` | 17 | 23 | 700 | 0 | Section headings and compact screen headers |
| `type.body` | 15 | 22 | 400 | 0 | Default readable copy |
| `type.bodyStrong` | 15 | 22 | 700 | 0 | Emphasized body text and list titles |
| `type.subhead` | 13 | 18 | 400 | 0 | Supporting descriptions and metadata |
| `type.subheadStrong` | 13 | 18 | 700 | 0 | Compact card headings |
| `type.label` | 12 | 16 | 700 | 0.4 | Buttons, tabs, compact actions |
| `type.caption` | 11 | 15 | 400 | 0 | Dates, mall/store metadata, navigation labels |
| `type.eyebrow` | 10 | 14 | 700 | 1.0 | Uppercase section category or status |
| `type.micro` | 10 | 13 | 700 | 0.5 | Badges only; never long-form text |

No product text may render below 10 dp. Use `fontVariant: ['tabular-nums']` for prices, analytics, times, and other aligned numerical values.

### 4.3 Typography rules

- Use sentence case for page titles, card titles, descriptions, and buttons.
- Uppercase is reserved for eyebrows, short statuses, discount values, and small badges.
- Keep body lines between approximately 35 and 60 characters on mobile.
- Use bold once per information group to establish hierarchy; avoid making every line bold.
- Deal values such as `UP TO 40% OFF` may use `type.screenTitle` or `type.heroTitle` in lime.
- IDR prices use the locale formatter and no decimal digits, for example `Rp1.749.000` in Indonesian.
- English is the default language; Indonesian is the only secondary language. No Dutch copy should appear in the POC.

## 5. Spacing

### 5.1 Base scale

The delivered prototype repeatedly uses values between 8 and 18 dp. These have been normalized into a compact scale while retaining its characteristic 18 dp screen gutter.

| Token | Value | Typical usage |
|---|---:|---|
| `space.none` | 0 | Reset |
| `space.hairline` | 2 | Optical icon/text adjustment only |
| `space.xs` | 4 | Tight label/icon relationship |
| `space.sm` | 8 | Inline icon gap, compact control padding |
| `space.md` | 12 | Card-to-card gap, compact card padding |
| `space.lg` | 16 | Standard card padding |
| `space.screen` | 18 | Horizontal screen edge and major content rhythm |
| `space.xl` | 24 | Section separation |
| `space.2xl` | 32 | Major region separation |
| `space.3xl` | 48 | Empty-state and hero spacing |
| `space.4xl` | 64 | Large modal or onboarding separation |

Do not introduce arbitrary spacing values in screens. The 18 dp screen token is the one intentional exception to the 4-point component grid because it is used throughout the delivered mobile prototype.

### 5.2 Layout rhythm

| Relationship | Spacing |
|---|---:|
| Screen horizontal padding | 18 |
| Screen content above floating tab bar | 112 minimum |
| Major section to major section | 24 |
| Section heading to content | 12 |
| Standard card gap | 12 |
| Compact list-row gap | 8 |
| Card internal padding | 16 |
| Compact card internal padding | 12 |
| Icon to label | 8 |
| Eyebrow to title | 4 |
| Title to supporting copy | 4 or 8 |
| Hero to actions/content | 18 |

Use `gap` for relationships inside components. Use outer margins only to separate screen sections.

### 5.3 Mobile layout

- Design reference width: 390 dp.
- Supported POC width range: 320-480 dp.
- Content is single-column by default.
- Metric and category cards may use two equal columns with a 12 dp gap.
- Horizontal discovery rails intentionally allow the next card to peek into view.
- Respect device safe areas at the top and bottom.
- The main shopper experience is portrait-first.

## 6. Shape, Border, and Elevation

The delivered UI uses continuous rounded shapes, thin borders, and very little shadow.

### 6.1 Radius scale

| Token | Value | Usage |
|---|---:|---|
| `radius.xs` | 4 | Tiny tags and progress fills |
| `radius.sm` | 8 | Status badges and compact controls |
| `radius.control` | 12 | Buttons and input internals |
| `radius.card` | 16 | Default card and list row |
| `radius.feature` | 18 | Hero cards, large panels, search field |
| `radius.navigation` | 24 | Floating bottom navigation |
| `radius.full` | 999 | Pills, circular icons, avatars |

Use `borderCurve: 'continuous'` on iOS for all non-pill rounded rectangles.

### 6.2 Borders

- Default border: 1 dp solid `#2A2A2A`.
- Highlighted border: 1 dp solid `#3A4B12`.
- Booking-highlight border: 1 dp solid `#68289E`.
- Avoid pure-white borders.
- Separators should be used sparingly; prefer card grouping and spacing.

### 6.3 Elevation

The Shopymalls look is panel-based, not shadow-heavy.

- Default cards: no shadow.
- Floating navigation: `0 8px 24px rgba(0, 0, 0, 0.40)`.
- Modal or sheet: `0 12px 32px rgba(0, 0, 0, 0.48)`.
- Photography cards may use an internal gradient, never an outer glow.
- Lime glow is reserved for branded artwork or a singular promotional focal point, not ordinary controls.

## 7. Core Component Metrics

These dimensions preserve the proportions visible in the delivered mobile prototype.

| Component | Height / size | Radius | Notes |
|---|---:|---:|---|
| Primary button | 48 minimum | 12 | Lime fill, dark label |
| Secondary button | 48 minimum | 12 | Surface fill, lime border or label |
| Compact button | 40 minimum | 12 | Use only inside cards |
| Search field | 62 | 18 | Large discovery control from delivered Home screen |
| Text input | 48 minimum | 12 | Surface raised, 1 dp border |
| Icon button | 44 x 44 minimum | Full | Meets touch-target requirement |
| Filter chip | 36 minimum | Full | Selected state uses lime fill |
| Status badge | 24 minimum | Full | Uppercase micro text |
| Standard card | Content-driven | 16 | 16 dp padding |
| Feature/image card | Content-driven | 18 | Clip imagery and overlays |
| Floating bottom navigation | 70 | 24 | 14 dp side inset; 10 dp plus safe-area bottom inset |
| Bottom navigation item | 80 wide minimum | N/A | Icon above caption |

Pressed controls reduce opacity to 0.72 or move to their designated tinted surface. Disabled controls use 40% opacity and must not respond to input.

## 8. Photography and Icons

### 8.1 Photography

- Use premium, warm, editorial retail photography.
- Prioritize malls, storefronts, products, food, fashion, beauty, and events.
- Avoid generic corporate stock imagery on shopper-facing screens.
- Maintain consistent image crops within each rail.
- Always provide an overlay when white, lime, or purple text sits on imagery.

Recommended card ratios based on the delivered prototype:

- Mall discovery card: approximately 1.22:1.
- Deal feature card: approximately 1.40:1.
- Event card: approximately 1.22:1.
- Product card image: square.
- Full-width hero: 16:9 to 4:3 depending on copy density.

### 8.2 Icons

- Use simple outlined icons by default.
- Active or confirmed icons may use a filled treatment.
- Inactive icons use `textSecondary`; active shopper navigation uses lime.
- Booking-specific icons use purple inside booking flows.
- Standard icon sizes: 16, 20, 24, and 28 dp.
- Never use emoji as production UI icons.

## 9. Navigation and Screen Hierarchy

The shopper application uses four primary destinations:

1. Home
2. Explore
3. Saved
4. Profile

The bottom navigation is a floating dark panel with a lime active state, matching the delivered prototype. Detail screens use a compact top bar with a circular back button, centered title, and optional trailing action.

Business, mall, and admin experiences retain the same palette but may use horizontal sub-navigation and denser metric grids. For the POC, they should still feel like parts of one product rather than unrelated dashboards.

## 10. Localization and Data Presentation

- Default locale: `en`.
- Secondary locale: `id-ID`.
- Currency: `IDR` only.
- Timezone: `Asia/Jakarta`.
- Time: 24-hour format.
- Distance: metric.
- Never concatenate translated fragments; use complete localized messages.
- Allow Indonesian strings approximately 20% more horizontal room than their English equivalents.
- Truncate only low-priority metadata. Titles and primary actions should wrap or adapt.
- Use `Rp` for shopper-facing IDR amounts in both supported languages for visual consistency.

Examples:

| Meaning | Indonesian | English |
|---|---|---|
| Explore | Jelajahi | Explore |
| Deals | Promo | Deals |
| Saved | Tersimpan | Saved |
| Get directions | Lihat rute | Get directions |
| Booking | Reservasi | Booking |
| My bookings | Reservasi Saya | My Bookings |
| Confirm booking | Konfirmasi Reservasi | Confirm Booking |

Use `reservasi` for appointments and table/event reservations. Reserve `pesanan` for purchases or product orders.

## 11. Implementation Token Contract

The implementation should expose one theme entry point. The following values are normative:

```ts
export const colors = {
  canvas: '#050505',
  surface: '#101010',
  surfaceRaised: '#151515',
  surfaceOverlay: '#1A1A1A',
  border: '#2A2A2A',
  textPrimary: '#F6F6F6',
  textSecondary: '#A3A3A3',
  textTertiary: '#828282',
  textDisabled: '#8A8A8A',
  lime: '#B8F500',
  onLime: '#050505',
  limeSurface: '#101400',
  limeSurfaceStrong: '#171C00',
  limeBorder: '#3A4B12',
  booking: '#A85DD4',
  bookingStrong: '#68289E',
  bookingSurface: '#302251',
  onBooking: '#F6F6F6',
  success: '#B8F500',
  warning: '#F6C850',
  warningSurface: '#2B2100',
  danger: '#FF6B6B',
  dangerSurface: '#4A2020',
} as const;

export const spacing = {
  none: 0,
  hairline: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  screen: 18,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
} as const;

export const radius = {
  xs: 4,
  sm: 8,
  control: 12,
  card: 16,
  feature: 18,
  navigation: 24,
  full: 999,
} as const;
```

No screen should introduce a new hex color, font size, spacing value, or corner radius without first updating this specification and the central theme.

## 12. POC Acceptance Checklist

A screen conforms to the delivered Shopymalls direction when:

- It uses the dark-only core palette and exact token values above.
- Lime clearly identifies the primary action or active state without overwhelming the screen.
- Booking uses purple only where the reservation context is explicit.
- All live text uses Open Sans Regular or Bold.
- Content follows the defined type scale and spacing rhythm.
- Cards use 1 dp borders and the prescribed radii.
- Shopper screens use meaningful retail photography with readable overlays.
- Touch targets are at least 44 x 44 dp.
- Indonesian and English layouts both fit without clipped primary content.
- Every price is stored numerically and displayed as IDR.
- The result feels visually connected to the delivered deck and screenshots.
