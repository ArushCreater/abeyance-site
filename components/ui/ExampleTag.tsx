/** Every number in the product is mock. Say so, visibly. */
export function ExampleTag({ children = "Example data", className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <span
      className={`label inline-flex items-center gap-1.5 rounded-full border border-dashed border-line-strong px-2 py-0.5 !text-ink-3 ${className}`}
    >
      <span aria-hidden className="h-1 w-1 rounded-full bg-ink-3" />
      {children}
    </span>
  );
}
