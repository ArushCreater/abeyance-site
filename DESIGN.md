# Abeyance design system

Calm, precise, a little uncanny. A control system, not a SaaS template.

## Logo

- **Wordmark:** lowercase "abeyance" in Newsreader Medium (optical size 72), tracked −0.02em, with three hand-kerned pairs (e–y, y–a, n–c). Outlined to SVG paths so it never depends on a font loading.
- **Why a serif:** a control system for banks and insurers should read as established and calm. It's also distinct from the sans-serif wordmarks every AI developer tool uses.
- **Monogram:** the same double-storey "a", for the favicon and tight spaces.
- **Use:** one colour (ink on dark, near-black on light), never recoloured, outlined or animated. Clear space at least the height of the "a" on every side. Minimum size 15 px tall.
- Lives in `components/brand/Logo.tsx` (`Logo`, `LogoWordmark`, `LogoMark`); favicon in `app/icon.svg`.

## Colour (dark only)

| Token | Value | Use |
|---|---|---|
| `bg` | `#0b0b0c` | Near-black ground (never `#000`) |
| `raised` / `sunken` | `#111113` / `#080809` | Panels, payload wells |
| `line` / `line-strong` | ink at 7% / 14% | Hairlines, the only borders |
| `ink` → `ink-4` | `#ece8e1` → `#4d4a45` | Warm off-white text scale (`ink-3` is the smallest text allowed, 4.9:1) |
| `hold` | `#eba43f` | **The one accent.** Only for HOLD, suspension and the approval moment |
| `allow` | `#8fa096` | Quiet sage-grey |
| `block` | `#c9766b` | Muted brick, never alarming |
| `chart-base` / `chart-hold` | `#77716a` / `#c4862c` | Chart pair, checked with the dataviz validator for colour-blind separation on the dark surface |

Rule: if something is amber, a person is (or was) needed. Brick is for stopping: blocks, the emergency brake, a paused agent.

### The agent map

A force-directed canvas (d3-force), in the spirit of Obsidian's graph view. Agents are ink dots sized by volume; action types are hollow rings; teams are small grey dots; reviewers sage; customers the faintest. Amber halos breathe around anything with a hold waiting; a dashed brick ring marks a paused agent; edges turn amber when that relationship is often held. Hover lights a node's neighbourhood and fades the rest; labels appear as you zoom, like a map. New decisions ripple from the agent and travel the edge to the action type. Under reduced motion the layout is computed up front and drawn still, with no ripples. A list view carries the same information.

## Type

- **Bricolage Grotesque** (variable: `wght` 200–800, `wdth` 75–100, `opsz` 12–96) for display and UI. Display settings: `wdth 82`, `opsz 96`, weight ~280–300, tracking −0.026em.
- **IBM Plex Mono** for payloads, ledger lines, numbers, labels (uppercase, +0.14em tracking).
- Expressive moment: `SuspendedText`. Letters arrive on springs, the held word lifts off its baseline, turns amber and floats, one letter lags, then it settles. The hero also narrows and lightens (`wdth` 75, `wght` 200) while held and widens back as it settles. That is the single deliberate non-transform animation.

## Motion

1. **Springs, never linear.** Tokens in `lib/motion.ts`: `settle`, `release`, `ui`, `drift`, plus a `dissolve` curve.
2. **Suspension.** Held things float on a slow sine (±4px, 5.2s) and breathe. On the landing page, time slows (×2.4) while you look at the held column.
3. **Resolution.** Approved: an amber line sweeps, the item lands for a beat, then releases forward. Denied: it dissolves (opacity + scale).
4. **Only transform and opacity**, with the one exception above. Reveals use scaleX covers, not width or clip.
5. **Reduced motion:** `MotionConfig reducedMotion="user"`, CSS animations collapse, type components render at rest with identical markup (no hydration mismatch).

## Space and layout

4px base unit. Max width 1200px. Section rhythm 112–160px vertically. Body copy is capped around 48–60ch. No bento grids: lists with hairlines, generous negative space, and one focal element per section.

## Footer and long-form pages

- **Footer:** one calm display line ("Nothing irreversible without a reason."), then the threshold: a hairline scale from allow to block with a gap in it, and one amber dot suspended in the gap (springs to draw in, then the CSS float and breathe). That dot is the footer's only amber. Links sit in hairline lists. The example ledger line carries an `ExampleTag`.
- **Legal and trust pages:** a reading column of about 40rem, a sticky hairline contents list on desktop (a `<details>` on mobile), numbered section headings in the display face, and a dashed draft banner. Placeholders are mono `ink-2` with a dotted underline, never amber.

## Accessibility

Skip link, landmarks, visible amber focus rings, `aria-live` for new holds and receipts, keyboard approval (A / D / J / K), a table view for the chart, labelled sliders, and a `role=switch` for policy enforcement. Every animated text has a screen-reader copy. The emergency stop confirms with press-and-hold (pointer, Enter or Space; ⇧⌘. opens it anywhere). The agent map has a described canvas plus a list view; charts on agent pages have hidden data tables.
