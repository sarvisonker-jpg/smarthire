import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, scoreTone } from "@/components/AppShell";
import { useProfile } from "@/lib/profile-store";
import { OPPORTUNITIES } from "@/lib/opportunities";
import { guidance, profileStrength, rank, skillGap } from "@/lib/matching";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ladder — Internships & jobs matched to you" },
      { name: "description", content: "Personalized internship and job matches for students and freshers, with match scores, skill-gap analysis and guidance." },
      { property: "og:title", content: "Ladder — Internships & jobs matched to you" },
      { property: "og:description", content: "Match scores, skill-gap analysis and career guidance for students and freshers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Discover,
});

const CHIPS = ["UI/UX", "Data", "Product", "Remote"];

function Discover() {
  const { profile } = useProfile();
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const ranked = useMemo(() => rank(profile, OPPORTUNITIES), [profile]);
  const filtered = ranked.filter(({ opp }) => {
    if (!query.trim()) return true;
    const hay = `${opp.title} ${opp.company} ${opp.category} ${opp.mode} ${opp.location} ${opp.skills.join(" ")}`.toLowerCase();
    return query.toLowerCase().split(/[\s,]+/).filter(Boolean).every((w) => hay.includes(w) || (w === "ui/ux" && hay.includes("design")));
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = filtered.find((r) => r.opp.id === selectedId) ?? filtered[0] ?? ranked[0];
  const gap = selected ? skillGap(profile, selected.opp) : null;
  const strength = profileStrength(profile);

  return (
    <AppShell>
      <main className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <div className="glass p-5">
            <h2 className="text-sm font-bold">Your profile</h2>
            <p className="mt-1 text-xs text-ink/50">Used to score every match</p>
            <div className="mt-4 rounded-xl bg-gradient-brand p-4 text-on-brand shadow-brand">
              <p className="text-[10px] uppercase tracking-widest opacity-70">Profile strength</p>
              <p className="font-display text-3xl font-extrabold">{strength}%</p>
              <div className="mt-2 h-1.5 rounded-full bg-on-brand/25"><div className="h-1.5 rounded-full bg-on-brand" style={{ width: `${strength}%` }} /></div>
            </div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-ink/45">Skills</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {profile.skills.map((s) => <span key={s} className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">{s}</span>)}
            </div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-ink/45">Preferences</p>
            <div className="mt-2 space-y-1.5 text-sm">
              {[["Work mode", profile.mode], ["Location", profile.location], ["Experience", `${profile.experience} yr`], ["Looking for", profile.kind], ["Interests", profile.interests.join(", ") || "—"]].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3"><span className="text-ink/55">{k}</span><span className="text-right font-medium">{v}</span></div>
              ))}
            </div>
            <Link to="/profile" className="mt-5 block w-full rounded-xl bg-ink py-2.5 text-center text-sm font-semibold text-on-brand transition hover:bg-brand">Update profile</Link>
          </div>
        </aside>

        <section className="space-y-6 lg:col-span-6">
          <div className="glass p-7">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-cyan">
              <span className="size-1.5 rounded-full bg-cyan" /> Tuned to your profile
            </span>
            <h1 className="mt-3 text-[34px] font-extrabold leading-[1.05] tracking-tight">
              Find the internship that fits <span className="text-gradient-brand">you</span>, not just the board.
            </h1>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-ink/60">
              We read your skills, education, interests, location and experience to score every opening — then show you exactly what to fix to get selected.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-5 flex items-center gap-2 rounded-xl border border-glass/70 bg-glass/70 p-2">
              <span className="ml-2 size-2 rounded-full bg-brand/50" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink/40" placeholder="Try “front-end remote” or “data pune”" />
              <button className="rounded-lg bg-gradient-brand px-5 py-2 text-sm font-semibold text-on-brand shadow-brand">Match me</button>
            </form>
            <div className="mt-3 flex flex-wrap gap-2">
              {CHIPS.map((c) => (
                <button key={c} onClick={() => setQuery(query === c ? "" : c)} className={`rounded-full border border-glass/70 px-3 py-1 text-xs ${query === c ? "bg-brand text-on-brand" : "bg-glass/50 text-ink/60"}`}>{c}</button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Your top matches</h2>
            <span className="text-xs font-medium text-ink/50">{filtered.length} of {ranked.length} scored</span>
          </div>

          {filtered.length === 0 && <div className="glass p-6 text-sm text-ink/60">No matches for “{query}”. Try a broader search.</div>}

          {filtered.map(({ opp, score }, i) => {
            const mine = new Set(profile.skills.map((s) => s.toLowerCase()));
            const isSel = selected?.opp.id === opp.id;
            return (
              <div key={opp.id} onClick={() => setSelectedId(opp.id)} className={`glass cursor-pointer p-5 transition ${isSel ? "ring-2 ring-brand/40" : ""}`}>
                <div className="flex items-start gap-4">
                  {opp.image ? (
                    <img src={opp.image} alt={opp.company} loading="lazy" width={816} height={816} className="size-14 shrink-0 rounded-xl object-cover" />
                  ) : (
                    <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-brand/10 font-display text-lg font-bold text-brand">{opp.company.charAt(0)}</div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold">{opp.title}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${scoreTone(score)}`}>{score}% match</span>
                      <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[11px] text-ink/60">{opp.kind}</span>
                    </div>
                    <p className="text-sm text-ink/55">{opp.company} · {opp.location} · {opp.mode} · {opp.pay}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {opp.skills.map((s) => (
                        <span key={s} className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${mine.has(s.toLowerCase()) ? "bg-brand/10 text-brand" : "bg-amber/15 text-amber"}`}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setApplied(new Set(applied).add(opp.id)); }}
                    disabled={applied.has(opp.id)}
                    className={i === 0 && !applied.has(opp.id) ? "rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-on-brand shadow-brand" : "rounded-xl border border-glass/70 bg-glass/70 px-4 py-2 text-sm font-semibold transition hover:bg-glass disabled:text-mint"}
                  >
                    {applied.has(opp.id) ? "Applied ✓" : "Apply"}
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        {selected && gap && (
          <aside className="space-y-6 lg:col-span-3">
            <div className="glass relative overflow-hidden p-5 lg:sticky lg:top-6">
              <div className="float absolute -right-6 -top-6 size-20 rounded-full bg-cyan/20 blur-2xl" />
              <h2 className="relative text-sm font-bold">Skill-gap analysis</h2>
              <p className="relative mt-1 text-xs text-ink/50">For “{selected.opp.title}” · {selected.score}% match</p>
              <div className="relative mt-4 flex items-center gap-3">
                <div className="grid size-16 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(var(--brand) 0%, var(--cyan) ${gap.coverage * 60}%, var(--mint) ${gap.coverage * 100}%, color-mix(in oklab, var(--brand) 12%, transparent) ${gap.coverage * 100}%)` }}>
                  <div className="grid size-12 place-items-center rounded-full bg-glass"><span className="font-display text-sm font-extrabold">{Math.round(gap.coverage * 100)}%</span></div>
                </div>
                <p className="text-xs leading-snug text-ink/60">You meet {gap.have.length} of {selected.opp.skills.length} core skills.{gap.missing.length ? ` ${gap.missing.length} gap${gap.missing.length > 1 ? "s" : ""} to close.` : " No gaps!"}</p>
              </div>
              <div className="relative mt-4 space-y-2.5">
                {gap.have.map((s) => (
                  <div key={s} className="flex items-center justify-between text-sm"><span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-mint" />{s}</span><span className="text-[11px] font-semibold text-mint">Ready</span></div>
                ))}
                {gap.missing.map((m) => (
                  <div key={m.skill} className="text-sm">
                    <div className="flex items-center justify-between"><span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-rose" />{m.skill}</span><span className="text-[11px] font-semibold text-rose">Gap</span></div>
                    <p className="ml-3 mt-0.5 text-xs text-ink/50">→ {m.tip}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass relative overflow-hidden bg-gradient-to-br from-brand/10 to-cyan/10 p-5">
              <div className="float absolute -left-6 -bottom-6 size-20 rounded-full bg-brand/20 blur-2xl" />
              <span className="relative inline-flex items-center gap-1.5 rounded-full bg-glass/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand"><span className="size-1.5 rounded-full bg-brand" />Guidance</span>
              <p className="relative mt-3 text-sm font-medium leading-snug">“{guidance(profile, selected.opp, selected.score)}”</p>
              <div className="relative mt-3 flex flex-wrap gap-1.5">
                {["Portfolio review", "Cover letter", "Mock interview"].map((t) => <span key={t} className="rounded-full bg-glass/70 px-2.5 py-1 text-[11px] font-medium text-ink/70">{t}</span>)}
              </div>
            </div>
          </aside>
        )}
      </main>
    </AppShell>
  );
}
