import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, ScoreRing } from "@/components/AppShell";
import northwind from "@/assets/co-northwind.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartHire — AI internship & job recommendations" },
      { name: "description", content: "SmartHire matches students and freshers with internships and entry-level jobs based on skills, education, interests, location and work preferences." },
      { property: "og:title", content: "SmartHire — AI internship & job recommendations" },
      { property: "og:description", content: "Personalized match scores, skill-gap analysis and an AI career assistant for students and freshers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const STEPS = [
  { n: "01", t: "Build your profile", d: "Add your course, skills, interests, city, experience and work preference. Takes 2 minutes." },
  { n: "02", t: "Get ranked matches", d: "Every opportunity is scored out of 100 with a clear breakdown of why it fits." },
  { n: "03", t: "Close your skill gaps", d: "See exactly which skills you have, which you're missing, and what to learn first." },
  { n: "04", t: "Follow your roadmap", d: "A week-by-week plan and an AI assistant help you become the obvious pick." },
];

const FEATURES = [
  { t: "Match percentage", d: "A transparent weighted score — skills, interest, education, location, experience, work mode and pay." },
  { t: "Why this matches you", d: "Plain-language reasons for every factor, so you know where you stand." },
  { t: "Skill Gap Analyzer", d: "Have vs missing skills, with the high-priority ones flagged first." },
  { t: "Improve My Chances", d: "A personal learning roadmap built from gaps across your top matches." },
  { t: "AI Career Assistant", d: "Ask anything — what to learn, why a score is low, which role to pick." },
  { t: "Smart filters", d: "Search by role, category, city, work mode, experience, skills and stipend." },
];

function Home() {
  return (
    <AppShell>
      <section className="grid items-center gap-12 py-8 lg:grid-cols-2 lg:py-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-glass/40 px-3 py-1 text-xs font-medium text-ink/70">
            <span className="size-1.5 rounded-full bg-mint" /> Built for students & freshers
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Find internships & jobs that actually <span className="text-gradient-brand">fit you</span>.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/65 sm:text-lg">
            SmartHire reads your skills, education, interests and preferences, ranks every opportunity by how well it matches — and shows you exactly how to improve your chances.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/profile" className="btn-primary !px-6 !py-3 text-base">Find My Opportunities →</Link>
            <Link to="/recommendations" className="btn-ghost !px-6 !py-3 text-base">Browse matches</Link>
          </div>
          <div className="mt-10 flex gap-8 text-sm">
            {[["12+", "sample roles"], ["7", "match factors"], ["100", "point score"]].map(([a, b]) => (
              <div key={b}><p className="font-display text-2xl font-bold">{a}</p><p className="text-ink/50">{b}</p></div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="float absolute -top-6 -right-4 size-32 rounded-full bg-cyan/25 blur-3xl" />
          <div className="glass relative p-5">
            <div className="flex items-start gap-4">
              <img src={northwind} alt="Northwind Labs team" width={816} height={816} className="size-14 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-display font-bold">Front-end Developer Intern</p>
                <p className="text-sm text-ink/55">Northwind Labs · Remote · ₹22k/mo</p>
              </div>
              <ScoreRing score={94} />
            </div>
            <div className="mt-5 space-y-2.5">
              {[["Skills", 36, 40], ["Career interest", 15, 15], ["Work preference", 10, 10], ["Education", 10, 10]].map(([l, p, m]) => (
                <div key={l as string}>
                  <div className="flex justify-between text-xs"><span className="text-ink/60">{l}</span><span className="font-medium">{p}/{m}</span></div>
                  <div className="mt-1 h-1.5 rounded-full bg-glass"><div className="h-1.5 rounded-full bg-gradient-brand" style={{ width: `${((p as number) / (m as number)) * 100}%` }} /></div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-border bg-glass/30 p-3 text-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-rose">1 skill gap</p>
              <p className="mt-1 text-ink/75">Learn <b>Tailwind</b> in ~1 week to reach 100%.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">How it works</p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight">From profile to offer, in four steps</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="glass p-5">
              <p className="font-display text-sm font-bold text-gradient-brand">{s.n}</p>
              <h3 className="mt-3 font-bold">{s.t}</h3>
              <p className="mt-2 text-sm text-ink/60">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Features</p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Everything you need to get selected</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.t} className="glass p-6 transition hover:-translate-y-0.5">
              <div className="size-2 rounded-full bg-gradient-brand" />
              <h3 className="mt-4 font-bold">{f.t}</h3>
              <p className="mt-2 text-sm text-ink/60">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="glass relative overflow-hidden p-10 text-center">
          <div className="absolute inset-0 bg-gradient-brand opacity-15" />
          <h2 className="relative text-3xl font-extrabold tracking-tight">Ready to see your matches?</h2>
          <p className="relative mx-auto mt-3 max-w-md text-ink/65">Fill in your profile and get ranked recommendations instantly.</p>
          <Link to="/profile" className="btn-primary relative mt-6 !px-6 !py-3">Find My Opportunities →</Link>
        </div>
      </section>
    </AppShell>
  );
}
