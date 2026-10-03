/**
 * A gap in a draft document, such as [ABN]. Visible on purpose so nobody
 * mistakes a draft for a finished one. Never amber: amber means a person is
 * needed in the product, and this is only an unfinished sentence.
 */
export function Placeholder({ children }: { children: string }) {
  return (
    <span className="font-mono text-[0.84em] text-ink-2 underline decoration-ink-3 decoration-dotted decoration-1 underline-offset-[5px]">
      [{children}]
    </span>
  );
}

/* The gaps that recur across documents. */
export const COMPANY = <Placeholder>COMPANY LEGAL NAME</Placeholder>;
export const ABN = <Placeholder>ABN</Placeholder>;
export const ADDRESS = <Placeholder>ADDRESS</Placeholder>;
export const CONTACT_EMAIL = <Placeholder>CONTACT EMAIL</Placeholder>;
export const PRIVACY_EMAIL = <Placeholder>PRIVACY CONTACT EMAIL</Placeholder>;
export const SECURITY_EMAIL = <Placeholder>SECURITY CONTACT EMAIL</Placeholder>;
export const GOVERNING_LAW = <Placeholder>GOVERNING LAW STATE, e.g. New South Wales</Placeholder>;
export const EU_REP = <Placeholder>EU REPRESENTATIVE</Placeholder>;
