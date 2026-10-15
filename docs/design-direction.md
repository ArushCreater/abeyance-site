# Abeyance visual direction

A light identity across the marketing site, console and docs: paper surfaces, forest ink, cobalt for the product story and restrained orange. HOLD/ALLOW/BLOCK use separate accessible semantic colours. Text colours used for decisions meet 4.5:1 on the main surface.

The outlined uppercase wordmark in `lib/brand.ts` is custom geometry, shared with `components/brand/Logo.tsx` and the printing on the 3D receipt. `public/brand/abeyance-wordmark.svg` is the standalone master. Match its paths in the console and docs when changing the identity; these are separate repositories.

The marketing navigation is one floating glass surface. It keeps the full wordmark visible. Mobile navigation retains Escape handling and page scroll locking.

The hero is a continuous paper trail. `Hero.tsx` owns the four narrative panels and scroll progress. `ActionSculpture.tsx` lazy-loads Three.js, prints the receipt with a canvas texture, and deforms a perforated mesh. The ribbon travels between both sides of the page, folds at HOLD, opens with a seal after approval and becomes a folded audit record. Scroll and pointer input use frame-rate-independent damping. Offscreen/hidden rendering pauses; reduced motion produces a still scene; WebGL failures leave an HTML receipt. There are no external models or texture downloads.

GitHub Universe informed the stronger typography and more expressive composition. Abeyance uses its own wordmark, palette, layout, content and motion concept.

Browser visual QA was unavailable in this environment. Review desktop, portrait, phone landscape and reduced-motion behaviour in a permitted browser before claiming a visual sign-off.
