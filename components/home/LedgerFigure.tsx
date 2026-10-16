import { Plate } from "./Essay";

const ROWS = [
  { seq: 2041, at: "10:41:58", agent: "support-bot", action: "ticket.reply", outcome: "ALLOW", by: "rule", prev: "c09e1f", hash: "7a21d4" },
  { seq: 2042, at: "10:42:01", agent: "accounts-payable", action: "payment.send", outcome: "HOLD", by: "large_payment", prev: "7a21d4", hash: "f82a3c" },
  { seq: 2043, at: "10:42:18", agent: "accounts-payable", action: "payment.send", outcome: "APPROVED", by: "alex@acme.com", prev: "f82a3c", hash: "b71d4a" },
  { seq: 2044, at: "10:43:40", agent: "data-hygiene", action: "file.delete", outcome: "BLOCK", by: "production_delete", prev: "b71d4a", hash: "0e9b52" },
];
const TONE: Record<string, string> = { ALLOW: "text-allow", HOLD: "text-ember", APPROVED: "text-allow", BLOCK: "text-block" };

/** The audit log: each entry carries the hash of the one before it. */
export function LedgerFigure() {
  return (
    <Plate>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3 text-[13px]">
        <span className="font-medium text-ink">Audit log</span>
        <span className="flex gap-4 text-ink-3">
          <span>Export CSV</span>
          <span>Evidence report (PDF)</span>
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] font-mono text-[12.5px]">
          <thead>
            <tr className="text-left text-[11.5px] text-ink-4 [&>th]:px-5 [&>th]:py-2.5 [&>th]:font-normal">
              <th>#</th>
              <th>Time</th>
              <th>Agent</th>
              <th>Action</th>
              <th>Decision</th>
              <th>By</th>
              <th className="text-right">Chain</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.seq} className="whitespace-nowrap border-t border-line text-ink-2 [&>td]:px-5 [&>td]:py-3">
                <td className="text-ink-4">{r.seq}</td>
                <td>{r.at}</td>
                <td className="text-ink">{r.agent}</td>
                <td>{r.action}</td>
                <td className={TONE[r.outcome]}>{r.outcome}</td>
                <td>{r.by}</td>
                <td className="whitespace-nowrap text-right text-ink-4">
                  {r.prev}… → <span className="text-ink-2">{r.hash}…</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Plate>
  );
}
