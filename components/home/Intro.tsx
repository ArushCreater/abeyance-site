import { SYMBOL_PATHS, SYMBOL_VIEWBOX } from "@/lib/symbol";
import { IntroController } from "./IntroController";

/**
 * The launch intro, once per session: the mark folds together over a vivid,
 * moving field of the hero's colours, then everything
 * drains to paper and the page shows through. About five seconds; any click,
 * key or scroll skips it; reduced motion skips it entirely.
 *
 * The inline script runs before first paint, so a repeat visit never sees
 * a flash of the intro, and a first visit never sees a flash of the page.
 */
const DECIDE = `try{var s=sessionStorage.getItem("abey-intro"),r=matchMedia("(prefers-reduced-motion: reduce)").matches;if(s||r){document.documentElement.classList.add("intro-seen")}else{document.documentElement.classList.add("intro-playing")}}catch(e){document.documentElement.classList.add("intro-seen")}`;

export function Intro() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: DECIDE }} />
      <div className="intro" aria-hidden>
        <div className="intro-field">
          <span className="intro-blob intro-cobalt" />
          <span className="intro-blob intro-ember" />
          <span className="intro-blob intro-amber" />
          <span className="intro-blob intro-sky" />
          <span className="field-grain" />
        </div>
        <div className="intro-lockup">
          <svg viewBox={SYMBOL_VIEWBOX} className="intro-mark">
            {SYMBOL_PATHS.map((d, i) => (
              <path key={i} d={d} className={`intro-piece intro-piece-${i}`} />
            ))}
          </svg>
        </div>
      </div>
      <IntroController />
    </>
  );
}
