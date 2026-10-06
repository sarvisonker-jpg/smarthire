import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, ScoreRing, scoreTone } from "@/components/AppShell";
import { useProfile } from "@/lib/profile-store";
import { OPPORTUNITIES, formatPay } from "@/lib/opportunities";
import { explain, matchScore, scoreLabel, skillGap } from "@/lib/matching";

export const Route = createFileRoute("/opportunities/$id")({
  loader: ({ params }) => {
    const opp = OPPORTUNITIES.find((o) => o.id === params.id);
    if (!opp) throw notFound();
    return { opp };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Opportunity not found — SmartHire" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.opp.title} at ${loaderData.opp.company} — SmartHire`;
    return {
      meta: [
        { title: t },
        { name: "description", content: loaderData.opp.description },
        { property: "og:title", content: t },
        { property: "og:description", content: loaderData.opp.description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: OppNotFound,
  component: Detail,
});

function OppNotFound() {
  return (
    <AppShell>
      <div className="glass p-10 text-center">
        <h1 className="text-2xl font-bold">This opportunity isn't available</h1>
        <Link to="/recommendations" className="btn-primary mt-5">Back to recommendations</Link>
      </div>
    </AppShell>
  );
}

function Detail() {
  const { opp } = Route.useLoaderData();
  const { profile } = useProfile();
  const [applied, setApplied] = useState(false);
  const factors = explain(profile, opp);
  const score = matchScore(profile, opp);
  const gap = skillGap(profile, opp);
  const potential = Math.min(100, score + (40 - factors[0]!.points));

  return (
    <AppShell>
      <Link to="/recommendations" className="text-sm text-ink/55 hover:text-ink">← All recommendations</Link>

      <div className="glass mt-4 flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
        {opp.image ? <img src={opp.image} alt={opp.company} width={816} height={816} className="size-20 rounded-2xl object-cover" /> : <div className="grid size-20 place-items-center rounded-2xl bg-brand/20 font-display text-2xl font-bold">{opp.company[0]}</div>}
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Step 3 · Opportunity details</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">{opp.title}</h1>
          <p className="mt-1 text-ink/60">{opp.company} · {opp.location} · {opp.mode} · {opp.kind} · {opp.minExperience === 0 ? "Open to freshers" : `${opp.minExperience}+ yr experience`}</p>
          <p className="mt-3 max-w-2xl text-sm text-ink/70">{opp.description}</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <ScoreRing score={score} size={96} />
          <span className={`text-sm font-semibold ${scoreTone(score)}`}>{scoreLabel(score)}</span>
          <p className="font-display font-bold">{formatPay(opp)}</p>
          <button onClick={() => setApplied(true)} disabled={applied} className="btn-primary w-full">{applied ? "Applied ✓" : "Apply now"}</button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="glass p-6">
          <h2 className="text-lg font-bold">Why this matches you</h2>
          <p className="mt-1 text-xs text-ink/50">Weighted score out of 100 — each factor below adds points.</p>
          <div className="mt-5 space-y-4">
            {factors.map((fx) => (
              <div key={fx.key}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{fx.label}</span>
                  <span className={fx.points === fx.max ? "text-mint" : fx.points === 0 ? "text-rose" : "text-amber"}>{fx.points}/{fx.max}</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-glass"><div className="h-1.5 rounded-full bg-gradient-brand transition-all duration-700" style={{ width: `${(fx.points / fx.max) * 100}%` }} /></div>
                <p className="mt-1 text-xs text-ink/55">{fx.reason}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass p-6">
          <h2 className="text-lg font-bold">Skill Gap Analyzer</h2>
          <p className="mt-1 text-xs text-ink/50">You cover {gap.have.length} of {opp.skills.length} required skills ({Math.round(gap.coverage * 100)}%).</p>
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-mint">Skills you already have</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {gap.have.length ? gap.have.map((s) => <span key={s} className="rounded-md bg-mint/15 px-2.5 py-1 text-xs font-medium text-mint">✓ {s}</span>) : <span className="text-sm text-ink/50">None yet — that's okay, start below.</span>}
            </div>
          </div>
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-rose">Missing skills · improve these first</p>
            {gap.missing.length === 0 ? (
              <p className="mt-2 rounded-xl bg-mint/10 p-3 text-sm text-mint">You have every required skill. Polish your portfolio and apply!</p>
            ) : (
              <ol className="mt-2 space-y-2">
                {gap.missing.map((m, i) => (
                  <li key={m.skill} className="flex items-start gap-3 rounded-xl border border-border bg-glass/25 p-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gradient-brand text-xs font-bold text-on-brand">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2"><span className="font-medium">{m.skill}</span><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${m.priority === "High" ? "bg-rose/15 text-rose" : "bg-amber/15 text-amber"}`}>{m.priority} priority</span><span className="text-[11px] text-ink/45">~{m.weeks} wk</span></div>
                      <p className="mt-0.5 text-xs text-ink/60">{m.tip}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
          {gap.missing.length > 0 && (
            <div className="mt-5 rounded-xl bg-gradient-brand/10 border border-brand/30 p-4 text-sm">
              Closing these gaps could lift your match from <b>{score}%</b> to about <b className="text-mint">{potential}%</b>.
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/roadmap" className="btn-primary">See my improvement roadmap →</Link>
            <Link to="/assistant" className="btn-ghost">Ask the AI assistant</Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
