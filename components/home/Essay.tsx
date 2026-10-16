import type { ReactNode } from "react";

/** A section of the essay: a plain heading, prose in a reading column, figures that break wider. */
export function Section({ id, title, children }: { id?: string; title?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={id && title ? `${id}-h` : undefined} className="scroll-mt-20 py-10 sm:py-14">
      {title && (
        <div className="mx-auto max-w-[660px] px-5">
          <h2 id={id ? `${id}-h` : undefined} className="text-[1.375rem] font-medium tracking-[-0.015em] text-ink">
            {title}
          </h2>
        </div>
      )}
      {children}
    </section>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="prose-col mx-auto max-w-[660px] px-5">{children}</div>;
}

export function Figure({ n, caption, wide = false, children }: { n: number; caption: ReactNode; wide?: boolean; children: ReactNode }) {
  return (
    <figure className={`mx-auto mb-4 mt-9 px-5 sm:mt-12 ${wide ? "max-w-[1080px]" : "max-w-[900px]"}`}>
      {children}
      <figcaption className="mx-auto mt-4 max-w-[660px] text-[13.5px] leading-relaxed text-ink-3">
        <span className="font-medium text-ink-2">Figure {n}.</span> {caption}
      </figcaption>
    </figure>
  );
}

/** The frame every figure sits in: paper, a hairline, nothing else. */
export function Plate({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`overflow-hidden rounded-[14px] border border-line bg-white shadow-[0_1px_0_rgb(21_23_28/0.03),0_24px_60px_-32px_rgb(21_23_28/0.18)] ${className}`}>{children}</div>;
}
