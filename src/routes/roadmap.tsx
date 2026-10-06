import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader, Skeleton } from "@/components/AppShell";
import { useProfile } from "@/lib/profile-store";
import { useOpportunities } from "@/lib/use-opportunities";
import { rank, roadmap } from "@/lib/matching";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Improve My Chances — SmartHire roadmap" },
      { name: "description", content: "A personalized learning roadmap built from your skill gaps across your top matches." },
      { property: "og:title", content: "Improve My Chances — SmartHire" },
      { property: "og:description", content: "Week-by-week plan to become a stronger candidate." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Roadmap,
});

function Roadmap() {
  const { profile } = useProfile();
  const { data, isLoading } = useOpportunities();
  if (isLoading || !data) return <AppShell><Skeleton className="h-96" /></AppShell>;

  const steps = roadmap(profile, data);
  const top = rank(profile, data).slice(0, 5);
  let week = 1;
  const totalWeeks = steps.reduce((s, x) => s + x.weeks, 0);

  return (
    <AppShell>
      <PageHeader eyebrow="Step 4 · Improve My Chances" title="Your personal improvement roadmap" sub={`Built from skill gaps across your top ${top.length} matches. Skills that unlock the most roles come first.`}>
        <div className="glass p-4 text-sm"><p className="text-ink/50">Estimated time</p><p className="font-display text-2xl font-bold">{totalWeeks} weeks</p></div>
      </PageHeader>

      {steps.length === 0 ? (
        <div className="glass p-10 text-center">
          <p className="font-display text-xl font-bold">No gaps across your top matches 🎉</p>
          <p className="mt-2 text-sm text-ink/60">Focus on your portfolio, resume and mock interviews — then apply.</p>
          <Link to="/recommendations" className="btn-primary mt-5">Go apply</Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <ol className="relative space-y-4 border-l border-border pl-6">
            {steps.map((s, i) => {
              const from = week; week += s.weeks;
              return (
                <li key={s.skill} className="glass rise relative p-5" style={{ animationDelay: `${i * 50}ms` }}>
                  <span className="absolute -left-[37px] top-5 grid size-6 place-items-center rounded-full bg-gradient-brand text-xs font-bold text-on-brand">{i + 1}</span>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-bold">Learn {s.skill}</h3>
                    <span className="rounded-full bg-glass/60 px-2.5 py-1 text-xs text-ink/65">Week {from}{s.weeks > 1 ? `–${week - 1}` : ""}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink/70">{s.tip}.</p>
                  <p className="mt-3 text-xs text-ink/50">Unlocks: <span className="text-cyan">{s.unlocks.join(", ")}</span></p>
                </li>
              );
            })}
            <li className="glass relative p-5">
              <span className="absolute -left-[37px] top-5 grid size-6 place-items-center rounded-full bg-mint text-xs font-bold text-on-brand">✓</span>
              <h3 className="text-lg font-bold">Update your profile & apply</h3>
              <p className="mt-1 text-sm text-ink/70">Add new skills to your profile — your scores will jump instantly.</p>
              <Link to="/profile" className="btn-primary mt-3 !py-2">Update profile</Link>
            </li>
          </ol>

          <aside className="space-y-4">
            <div className="glass p-5">
              <h2 className="text-sm font-bold">Always-on tips</h2>
              <ul className="mt-3 space-y-2 text-sm text-ink/70">
                <li>• Build 2–3 portfolio projects that use your target skills.</li>
                <li>• Tailor your resume keywords to each listing.</li>
                <li>• Practice 3 mock interviews before applying.</li>
                <li>• Earn one free certificate in your top gap skill.</li>
              </ul>
            </div>
            <div className="glass p-5">
              <h2 className="text-sm font-bold">Have questions?</h2>
              <p className="mt-2 text-sm text-ink/60">Ask the AI Career Assistant for a plan tailored to you.</p>
              <Link to="/assistant" className="btn-ghost mt-3 w-full">Open assistant</Link>
            </div>
          </aside>
        </div>
      )}
    </AppShell>
  );
}
