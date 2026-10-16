import { CONSOLE_URL, DOCS_URL } from "@/lib/site";
import { AgreementFigure } from "./AgreementFigure";
import { ApprovalFigure } from "./ApprovalFigure";
import { Figure, Prose, Section } from "./Essay";
import { InstallFigure } from "./InstallFigure";
import { InstallLine } from "./InstallLine";
import { LedgerFigure } from "./LedgerFigure";
import { RulesFigure } from "./RulesFigure";

export function Story() {
  return (
    <div id="story" className="scroll-mt-16">
      <Section>
        <Prose>
          <p className="!text-[clamp(1.25rem,1.8vw,1.45rem)] !leading-[1.5] !text-ink">
            AI agents are starting to do real things. They pay invoices, email customers, change records and delete files. Most of that is routine. A few actions
            can’t be taken back.
          </p>
          <p>
            Abeyance sits between your agent and its tools. Before a tool call runs, it’s checked against rules you write. Routine actions go straight through.
            Sensitive ones wait for a person to approve them in Slack. The rest never happen. Every decision is written to a log that shows if anyone has touched
            it since.
          </p>
        </Prose>
      </Section>

      <Section id="install" title="Five minutes to install">
        <Prose>
          <p>
            Run one command in your project. It adds the SDK, for TypeScript or Python, or a proxy that sits in front of your MCP server. Then wrap the tools that
            matter. Your agent, its framework and its tools stay as they are: LangChain, the OpenAI Agents SDK, CrewAI, or anything that calls a function.
          </p>
        </Prose>
        <Figure n={1} caption={<>Wrapping an existing <code className="font-mono text-[12px]">send_payment</code> tool. The function runs only after the action is allowed or approved. If Abeyance can’t be reached, it doesn’t run at all.</>}>
          <InstallFigure />
        </Figure>
      </Section>

      <Section id="rules" title="Rules make the decision">
        <Prose>
          <p>
            Rules live in a YAML file in your repository, or in the dashboard. Each one gives an action one of three answers: allow it, hold it for approval, or
            block it. Templates cover payments, email, database writes, file deletes and CRM edits, so you start with something sensible and change what you
            disagree with.
          </p>
          <p>The same action and the same policy always produce the same decision. There’s no model in this step, and nothing to guess.</p>
        </Prose>
        <Figure n={2} wide caption="The starter policy. Change the action and watch which rule answers. Nothing here runs.">
          <RulesFigure />
        </Figure>
      </Section>

      <Section id="approvals" title="A hold waits for one tap">
        <Prose>
          <p>
            When a rule holds an action, the tool call pauses and a card arrives in Slack. It shows what the agent wants to do, its arguments with personal data
            redacted, the rule that held it, and the risk score. Approve, and the agent carries on. Deny, and it gets the reason instead.
          </p>
          <p>If nobody answers, the rule’s timeout decides, and by default that means no. Teams, email and a mobile link are on the way.</p>
        </Prose>
        <Figure n={3} caption="The approval card. Try both buttons.">
          <ApprovalFigure />
        </Figure>
      </Section>

      <Section id="audit" title="A record that shows tampering">
        <Prose>
          <p>
            Every decision is appended to an audit log: the action, the policy version that judged it, the score, the outcome, who approved it and when. Each entry
            carries the hash of the one before it, so changing an old record breaks every link after it.
          </p>
          <p>Search it in the dashboard, export it as CSV, or produce a signed PDF evidence report for one agent or a date range when compliance asks.</p>
        </Prose>
        <Figure n={4} caption="Four entries from an audit log, each sealed to the one before.">
          <LedgerFigure />
        </Figure>
      </Section>

      <Section id="scoring" title="Smart scoring, in the shadows">
        <Prose>
          <p>
            Alongside your rules, Jev gives every action a risk score between 0 and 1, a confidence, and its reasons in plain English: irreversible, a new payee,
            personal data, an unusual amount for this agent.
          </p>
          <p>
            At first it changes nothing. You see the score beside the rule’s decision, and Abeyance tracks how often it agrees with what your reviewers actually
            decide. Every approval and denial becomes a label for your workspace.
          </p>
          <p>
            When agreement is high enough, you can turn on assisted mode, one action type at a time. Low-risk actions it’s confident about go straight through, and
            high-risk ones are held even if a rule allowed them. Blocks you’ve written always stand.
          </p>
        </Prose>
        <Figure n={5} caption="Illustrative. Agreement between Jev and reviewers on payments, week by week. Assisted mode can be turned on once it stays above 95%.">
          <AgreementFigure />
        </Figure>
      </Section>

      <Section id="pricing" title="Free to start">
        <Prose>
          <p>
            One agent, 1,000 actions a month, Slack approvals and shadow scoring cost nothing. Pay when you need more agents, a longer memory or signed evidence.{" "}
            <a href="/pricing">See pricing</a>.
          </p>
        </Prose>
      </Section>

      <Section id="questions" title="Questions">
        <div className="mx-auto max-w-[660px] px-5">
          {FAQ.map((f) => (
            <details key={f.q} className="group border-b border-line py-5 first:border-t">
              <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 font-serif text-[1.2rem] leading-snug text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden className="font-sans text-[18px] text-ink-4 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-[58ch] font-serif text-[1.07rem] leading-relaxed text-ink-2">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <section className="px-5 pb-28 pt-16 text-center sm:pt-24">
        <p className="mx-auto max-w-[20ch] text-balance font-serif text-[clamp(2rem,4.4vw,3.4rem)] font-[380] leading-[1.08] tracking-[-0.02em] text-ink">
          Install it before your agent does something it can’t take back.
        </p>
        <div className="mt-9 flex flex-col items-center gap-4">
          <InstallLine />
          <div className="flex items-center gap-6 text-[14px]">
            <a href={`${CONSOLE_URL}/login?mode=signup`} className="font-medium text-ink underline decoration-ink/25 underline-offset-[5px] hover:decoration-ink">
              Start free
            </a>
            <a href={`${DOCS_URL}/quickstart`} className="text-ink-2 underline decoration-ink/15 underline-offset-[5px] hover:text-ink">
              Read the quickstart
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

const FAQ = [
  { q: "Does Abeyance change how my agent works?", a: "No. Your agent keeps its framework and its tools. The SDK wraps a tool function, or the MCP proxy sits in front of your MCP server, and the check happens before the wrapped call runs." },
  { q: "What happens while an action is held?", a: "The guarded call waits, on a webhook or by polling, while someone approves or denies it in Slack. Approval releases the function; denial stops it and returns the reason. Each rule sets its own timeout, and the default is to deny." },
  { q: "Does the risk score make the decision?", a: "Not unless you ask it to. In shadow mode your rules decide and Jev only adds a score and reasons. Assisted mode is a separate switch for each action type, available once Jev agrees with your reviewers often enough." },
  { q: "What if Abeyance is unavailable?", a: "The SDK fails closed. If it can’t get a final answer, it returns an error and your function doesn’t run. Your agent can retry, or ask for help." },
  { q: "Where does my data go?", a: "Action arguments are redacted before they reach an approval card, and the audit log stores what you need for evidence. The security overview has the details, including subprocessors." },
];
