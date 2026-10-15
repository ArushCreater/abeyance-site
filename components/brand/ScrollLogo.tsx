import { Logo } from "./Logo";

/** Keep the complete wordmark visible while the navigation floats. */
export function ScrollLogo({ className = "" }: { className?: string }) {
  return <Logo className={className} />;
}
