/** A deliberately small highlighter: comments recede, strings carry the colour, the rest is ink. */
export function Code({ source }: { source: string }) {
  return (
    <code>
      {source.split("\n").map((line, i) => (
        <span key={i} className="block min-h-[1.6em]">
          {tokens(line).map((t, k) => (
            <span key={k} className={t.kind === "comment" ? "text-ink-4" : t.kind === "string" ? "text-[#2f55c8]" : t.kind === "key" ? "text-ink-3" : ""}>
              {t.text}
            </span>
          ))}
        </span>
      ))}
    </code>
  );
}

function tokens(line: string): { text: string; kind?: "comment" | "string" | "key" }[] {
  const out: { text: string; kind?: "comment" | "string" | "key" }[] = [];
  const re = /(\/\/.*$|#.*$)|("[^"]*"|'[^']*'|`[^`]*`)|(^\s*[\w-]+(?=:\s))/g;
  let at = 0;
  for (const m of line.matchAll(re)) {
    if (m.index! > at) out.push({ text: line.slice(at, m.index) });
    out.push({ text: m[0], kind: m[1] ? "comment" : m[2] ? "string" : "key" });
    at = m.index! + m[0].length;
  }
  if (at < line.length) out.push({ text: line.slice(at) });
  return out;
}
