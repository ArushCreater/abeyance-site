# Abeyance visual direction

Editorial and quiet: the site reads like a well-set essay about the product, with precise figures, rather than a stack of feature cards.

## Type

- **Newsreader** (variable, optical sizing) carries the voice: the hero sentence, prose, pricing figures, questions.
- **Geist** for interface text: navigation, section headings, labels, captions, buttons.
- **Geist Mono** for code, rule names and audit data.

The name is set in Geist beside the aperture mark (`Logo` in `components/brand/Logo.tsx`). The drawn wordmark is no longer used on the site.

## Colour

Light paper (`--color-bg: #fbfbf9`), near-black ink, cobalt only for the mark and data, and a warm ember (`--color-ember`) for HOLD. ALLOW and BLOCK keep their semantic green and red. No gradients on interface elements; the only gradients are the hero's field of light.

## Layout

- A quiet header: mark and name left; Docs, Pricing, Security, Sign in and one dark "Start free" right. Transparent over the hero, a hairline and frost after scrolling. On phones, a "Menu" word opens a full-screen list set in the serif.
- The hero is full-bleed: a field of soft light (a cobalt bloom and an ember streak that travels, all but stops, then carries on) with film grain, and one centred sentence.
- Below it, sections are a 660px reading column with a plain Geist heading. Figures break out to 900–1080px, sit on white "plates" with a hairline, and carry a numbered caption (`components/home/Essay.tsx`).

## Figures

1. Install: the `guard()` wrapper in TypeScript, Python, or the MCP proxy.
2. Rules: the starter YAML; testing an action lights the rule that decides it (`lib/policy-demo.mjs`, tested in `tests/policy-demo.test.mjs`).
3. Approval: the Slack card, with working Approve and Deny.
4. Audit: hash-chained entries.
5. Shadow scoring: agreement with reviewers by week, one cobalt series, a dashed opt-in threshold, a hover readout and a screen-reader table.

Every figure is illustrative and says so where it matters; nothing on the page executes a tool or sends a message.

## Motion

Little, and slow. The hero light drifts (CSS only, off with reduced motion). Figures change state when you use them, not on scroll.
