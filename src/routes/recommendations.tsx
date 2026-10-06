import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader, ScoreRing, Skeleton } from "@/components/AppShell";
import { useProfile } from "@/lib/profile-store";
import { useOpportunities } from "@/lib/use-opportunities";
import { CATEGORIES, formatPay } from "@/lib/opportunities";
import { explain, rank, scoreLabel } from "@/lib/matching";

export const Route = createFileRoute("/recommendations")({
  head: () => ({
    meta: [
      { title: "Your recommendations — SmartHire" },
      { name: "description", content: "Internships and jobs ranked by match percentage, with search and filters." },
      { property: "og:title", content: "Your recommendations — SmartHire" },
      { property: "og:description", content: "Ranked opportunities with match scores and reasons." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Recommendations,
});

const initial = { q: "", category: "All", location: "", mode: "All", exp: "All", skill: "", minPay: 0 };

function Recommendations() {
  const { profile } = useProfile();
  const { data, isLoading, isError, refetch } = useOpportunities();
  const [f, setF] = useState(initial);
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const ranked = useMemo(() => (data ? rank(profile, data) : []), [profile, data]);
  const list = ranked.filter(({ opp }) => {
    const q = f.q.toLowerCase();
    if (q && !`${opp.title} ${opp.company}`.toLowerCase().includes(q)) return false;
    if (f.category !== "All" && opp.category !== f.category) return false;
    if (f.location && !opp.location.toLowerCase().includes(f.location.toLowerCase())) return false;
    if (f.mode !== "All" && opp.mode !== f.mode) return false;
    if (f.exp === "Fresher" && opp.minExperience > 0) return false;
    if (f.exp === "Experienced" && opp.minExperience === 0) return false;
    if (f.skill && !opp.skills.some((s) => s.toLowerCase().includes(f.skill.toLowerCase()))) return false;
    if (f.minPay && (opp.payMonthly ?? 0) < f.minPay) return false;
    return true;
  });
  const set = (k: keyof typeof initial, v: string | number) => setF({ ...f, [k]: v });
  const mine = new Set(profile.skills.map((s) => s.toLowerCase()));

  return (
    <AppShell>
      <PageHeader eyebrow="Step 2 · Recommendations" title={`Top matches for ${profile.name}`} sub="Ranked from best to lowest match. Open any card to see why it fits, your skill gaps and how to improve.">
        <Link to="/profile" className="btn-ghost">Edit profile</Link>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="glass h-fit space-y-4 p-5 lg:sticky lg:top-28">
          <div className="flex items-center justify-between"><h2 className="text-sm font-bold">Search & filters</h2><button onClick={() => setF(initial)} className="text-xs text-cyan hover:underline">Reset</button></div>
          <input className="field" placeholder="Role or company" value={f.q} onChange={(e) => set("q", e.target.value)} />
          <select className="field" value={f.category} onChange={(e) => set("category", e.target.value)}><option>All</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
          <input className="field" placeholder="Location" value={f.location} onChange={(e) => set("location", e.target.value)} />
          <select className="field" value={f.mode} onChange={(e) => set("mode", e.target.value)}>{["All", "Remote", "Hybrid", "On-site"].map((m) => <option key={m} value={m}>{m === "All" ? "Any work mode" : m}</option>)}</select>
          <select className="field" value={f.exp} onChange={(e) => set("exp", e.target.value)}><option value="All">Any experience</option><option>Fresher</option><option value="Experienced">1+ year</option></select>
          <input className="field" placeholder="Skill (e.g. Python)" value={f.skill} onChange={(e) => set("skill", e.target.value)} />
          <div>
            <div className="flex justify-between text-xs text-ink/55"><span>Min pay / month</span><span className="font-medium text-ink">₹{f.minPay.toLocaleString("en-IN")}</span></div>
            <input type="range" min={0} max={60000} step={5000} value={f.minPay} onChange={(e) => set("minPay", Number(e.target.value))} className="mt-2 w-full accent-brand" />
          </div>
        </aside>

        <section className="space-y-4">
          {isLoading && [0, 1, 2].map((i) => <Skeleton key={i} className="h-40" />)}
          {isError && (
            <div className="glass p-8 text-center">
              <p className="font-bold">We couldn't load opportunities.</p>
              <button onClick={() => refetch()} className="btn-primary mt-4">Try again</button>
            </div>
          )}
          {data && <p className="text-sm text-ink/50">{list.length} of {ranked.length} opportunities</p>}
          {data && list.length === 0 && (
            <div className="glass p-10 text-center">
              <p className="font-display text-lg font-bold">No opportunities match these filters</p>
              <p className="mt-1 text-sm text-ink/55">Try widening your location, work mode or pay range.</p>
              <button onClick={() => setF(initial)} className="btn-ghost mt-4">Clear filters</button>
            </div>
          )}
          {list.map(({ opp, score }, i) => {
            const top = explain(profile, opp).filter((x) => x.points === x.max).slice(0, 2);
            return (
              <article key={opp.id} className="glass rise p-5 transition hover:border-brand/40" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="flex flex-col gap-5 sm:flex-row">
                  <div className="flex flex-1 gap-4">
                    {opp.image ? <img src={opp.image} alt={opp.company} loading="lazy" width={816} height={816} className="size-14 shrink-0 rounded-xl object-cover" /> : <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-brand/20 font-display text-lg font-bold">{opp.company[0]}</div>}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-ink/40">#{i + 1}</span>
                        <h3 className="text-lg font-bold">{opp.title}</h3>
                        <span className="rounded-full bg-glass/60 px-2 py-0.5 text-[11px] text-ink/65">{opp.kind}</span>
                      </div>
                      <p className="text-sm text-ink/60">{opp.company} · {opp.location} · {opp.mode} · {opp.minExperience === 0 ? "Fresher" : `${opp.minExperience}+ yr`} · <span className="text-ink">{formatPay(opp)}</span></p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {opp.skills.map((s) => <span key={s} className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${mine.has(s.toLowerCase()) ? "bg-mint/15 text-mint" : "bg-rose/10 text-rose"}`}>{mine.has(s.toLowerCase()) ? "✓" : "✗"} {s}</span>)}
                      </div>
                      {top.length > 0 && <p className="mt-3 text-xs text-ink/55"><span className="text-cyan">Why: </span>{top.map((t) => t.reason).join(" ")}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:justify-between">
                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <ScoreRing score={score} />
                      <span className="text-[11px] text-ink/50">{scoreLabel(score)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link to="/opportunities/$id" params={{ id: opp.id }} className="btn-ghost !px-4 !py-2">Details</Link>
                      <button onClick={() => setApplied(new Set(applied).add(opp.id))} disabled={applied.has(opp.id)} className="btn-primary !px-4 !py-2">{applied.has(opp.id) ? "Applied ✓" : "Apply"}</button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}
