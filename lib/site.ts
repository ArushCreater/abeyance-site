/** Where the console lives. Set NEXT_PUBLIC_CONSOLE_URL per deployment. */
export const CONSOLE_URL = (process.env.NEXT_PUBLIC_CONSOLE_URL?.trim() || "http://localhost:3001").replace(/\/$/, "");
export const SIGN_IN_URL = `${CONSOLE_URL}/login`;
/** The documentation site. */
export const DOCS_URL = (process.env.NEXT_PUBLIC_DOCS_URL?.trim() || "https://abeyance-docs.vercel.app").replace(/\/$/, "");
