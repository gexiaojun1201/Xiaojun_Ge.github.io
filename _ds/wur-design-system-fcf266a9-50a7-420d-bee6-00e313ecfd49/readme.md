# WUR Design System (WURDS)

A design system inspired by [Wageningen University & Research's official website](https://www.wur.nl/en/about-wur) — "Modern Organic Academic" style: warm earth tones, organic blob-masked imagery, serif headings, pill-shaped interactions. Built to design a personal academic homepage in this visual language.

**Sources provided:**
- `uploads/WUR_Design_System_Style_Guide.md` — color palette, type scale, component patterns, motion/spacing tokens (written in Chinese, summarized/translated into tokens below).
- `uploads/wur_homepage.md` — actual homepage content/structure of wur.nl/en (nav, hero, news, six strategic themes, footer directory).
- No Figma file, codebase, or logo asset was provided — this system is built entirely from written specs, not live code or design files.

**Font substitution:** the style guide specifies Gelasio (headings). Per direct request, headings instead use **Times New Roman** (system serif, no webfont needed) — "serif fonts, Times if possible, mixed with others is fine." Body/UI keeps the guide's sans, **Commissioner**, loaded from Google Fonts CDN (not self-hosted — flag if you'd rather vendor the binary).

**No logo provided.** Nowhere in the sources is an actual WUR logo file. The brand name is rendered in plain serif type wherever a mark would go (navbar, thumbnail). Do not treat any wordmark here as an official logo recreation.

## Content fundamentals
- **Tone**: mission-driven, plain, declarative. "At WUR, we innovate for a sustainable world." Short sentences, present tense, active voice.
- **Voice**: "we" (institutional), rarely "you" except in student-facing CTAs ("Sign up here").
- **Headlines are short, aspirational, verb-first**: "Shape responsible change", "Study in Wageningen", "Partner up for impact".
- **News/story items**: type label (News / Story / Longread) + factual one-line summary, no editorializing, then "Read full article →".
- **No emoji in body copy.** The source markdown used emoji as link-list bullets (🎓 📅 🔬) — treat those as informal markdown authoring, not brand voice; the live site uses icons/imagery there, not emoji glyphs.
- **Theme names are short noun phrases**: "Sustainable food systems", "Health for all life" — lowercase after the first word, no punctuation.

## Visual foundations
- **Color**: warm sand/oat background (`#F3ECD3`) + ivory card surface (`#FBF6E5`) everywhere — never stark white. Deep forest green (`#153816`) for text instead of black. One brand action color, Active Green (`#008A00`), for every button/link/CTA; darkens to Pine Green (`#004D00`) on hover. Six saturated theme accents are used only as small tags/dots/underlines on content about that theme — never as large fills.
- **Type**: dual-track — serif (Times, here) for all headings/display, sans (Commissioner) for body, UI, nav, meta. See the Type cards for the full scale (Hero 40–72px down to Meta 12–14px).
- **Imagery**: photos and hero imagery are clipped to a **rounded rectangle at the same radius as cards** (`--radius-card`), never a hard 0-radius rectangle. (Note: WUR's real site uses organic blob/cell-shaped bezier masks instead — this system intentionally simplifies to rounded rectangles per direct request; see the "Image Treatment" card.) No full-bleed hero photography by default; hero is typographic with an image aside.
- **Spacing**: 4px-based scale, 4 to 120px.
- **Cards**: ivory surface, 1px `#E9E1C4` border, 20–30px radius (token: 24px), hairline shadow `0 1px 2px rgba(16,24,40,.05)` — no heavy drop shadows, no colored left-border accent strips.
- **Buttons**: full pill radius (9999px). Primary = solid green/white text. Ghost = 1px forest-green outline, transparent fill. No gradients anywhere.
- **Motion**: one signature easing, `cubic-bezier(0.87,0,0.13,1)` (smooth, slightly overshoot-free ease). Hover ~180ms, modal/menu ~300ms, page transition ~500ms. Text links nudge a trailing arrow 4px right on hover.
- **Corners**: large and soft throughout — pill buttons, 24px card radius. No sharp 0-radius rectangles.
- **Transparency/blur**: not documented in the source; not used here.
- **Backgrounds**: flat warm color fields, no gradients, no textures/patterns.

## Iconography
No icon font, SVG sprite, or icon usage is documented in either source file — the homepage content is link-driven, not icon-driven. **No icon assets were substituted or invented.** If a consuming project needs icons, add a documented, licensed set (e.g. Lucide via CDN) rather than inventing marks — this system deliberately ships none rather than guess at WUR's real icon language. Emoji appeared only as informal bullet markers in the source markdown (🎓📚🔬) and are not treated as brand iconography.

## Components
Standard set, sized to a marketing/academic site (no codebase or Figma was provided, so this is an original inventory — not a copied component library):
- **Button** (`components/core/Button.jsx`) — primary/ghost pill button.
- **Pill** (`components/core/Pill.jsx`) — six-theme tag.
- **Card** (`components/content/Card.jsx`) — sandstone news/story card.
- **SectionHeading** (`components/content/SectionHeading.jsx`) — eyebrow + serif H2.
- **Navbar** (`components/navigation/Navbar.jsx`) — top nav with wordmark + pill CTA.
- **Footer** (`components/navigation/Footer.jsx`) — dark institutional directory footer.

## Index
- `styles.css` — root stylesheet, imports everything under `tokens/`.
- `tokens/` — colors, typography, spacing, effects (radius/shadow/motion), fonts.
- `guidelines/` — foundation specimen cards (colors, type, spacing, motion, organic mask, card/radius demo).
- `components/core/`, `components/content/`, `components/navigation/` — the six components above, each with `.jsx` + `.d.ts` + `.prompt.md` + one `.card.html`.
- `ui_kits/personal-academic-homepage/` — full click-through recreation of a personal academic homepage in this style.
- `SKILL.md` — portable skill file for using this system elsewhere (e.g. Claude Code).

## Caveats
- No Figma file, codebase, or real WUR logo/icon assets were supplied — everything here is derived from two markdown briefs, not live source. If you have access to wur.nl's real code or a Figma file, share it and this system can be corrected against ground truth.
- Commissioner is loaded via a Google Fonts CDN `@import`, not vendored as local font binaries.
- The personal-homepage UI kit uses placeholder academic content (fictional researcher) — swap in real bio, publications, and photos.
