# Abeyance visual direction

Light surfaces, forest ink, cobalt and restrained orange across the marketing site, console and docs. HOLD, ALLOW and BLOCK use accessible semantic colours.

The wordmark is lowercase Archivo Black, converted to outlines in `lib/brand.ts` to keep it bold and prevent font-loading layout shifts. `public/brand/abeyance-wordmark.svg` is the standalone master; its OFL licence is beside it. Update the console and docs copies together; these are separate repositories.

The floating glass navigation is capped at 1080px and 54px tall, with a 50px mobile variant. Remove ornamental folios, section numbers and captions. Keep product explanations, useful field labels and the example-data disclosure.

## Hero

`Hero.tsx` keeps one message at a fixed position. Only opacity changes between chapters; the heading, paragraph and calls to action keep their space. `lib/hero-motion.mjs` adds a dead band around chapter boundaries to prevent trackpad jitter from repeatedly changing the text. A single spring supplies the scroll progress.

`AgentMascot.tsx` lazy-loads Three.js through `mascot-scene.ts`. The agent carries a payment token, pauses with an amber expression and raised hand, sends the token after approval, then presents a verified record. Its eyes follow the pointer and its head nods during release.

Geometry is created once: 42 meshes, about 11,400 triangles. Each frame updates joints and prop transforms. There are no mesh rebuilds, normal recalculations, downloaded models or shadow maps. Pixel ratio is capped at 1.25, rendering stops offscreen or when the tab is hidden, and reduced motion shows a still pose. A native SVG illustration remains available without WebGL.

Run `npm run test:hero` on Node 22.18+ or 24 to check chapter hysteresis, rapid/reverse scrolling, immutable geometry and pose continuity. Static poses were inspected through offline renders of the actual geometry. Browser scroll and frame-rate QA remains unavailable because browser access was denied in this environment.
