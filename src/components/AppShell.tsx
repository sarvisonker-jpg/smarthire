import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/profile", label: "Profile" },
  { to: "/recommendations", label: "Recommendations" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/assistant", label: "AI Assistant" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <div className="grid size-9 place-items-center rounded-xl bg-gradient-brand shadow-brand">
        <span className="font-display text-[15px] font-extrabold text-on-brand">S</span>
      </div>
      <span className="font-display text-lg font-bold tracking-tight">Smart<span className="text-gradient-brand">Hire</span></span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative min-h-screen overflow-x-hidden text-ink">
      <div className="pointer-events-none fixed -top-40 -left-24 h-[520px] w-[520px] rounded-full bg-brand/20 blur-3xl drift" />
      <div className="pointer-events-none fixed top-1/3 -right-40 h-[520px] w-[520px] rounded-full bg-cyan/15 blur-3xl drift-2" />

      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="glass sticky top-4 z-30 px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Logo />
            <nav className="hidden items-center gap-6 text-sm font-medium text-ink/65 lg:flex">
              {links.map((l) => (
                <Link key={l.to} to={l.to} activeOptions={{ exact: l.to === "/" }} activeProps={{ className: "text-ink" }} className="transition hover:text-ink">{l.label}</Link>
              ))}
            </nav>
            <Link to="/profile" className="btn-primary hidden !py-2 lg:inline-flex">Find My Opportunities</Link>
            <button onClick={() => setOpen(!open)} className="btn-ghost !px-3 !py-2 lg:hidden" aria-label="Menu">{open ? "✕" : "☰"}</button>
          </div>
          {open && (
            <nav className="mt-3 grid gap-1 border-t border-border pt-3 lg:hidden">
              {links.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} activeOptions={{ exact: l.to === "/" }} activeProps={{ className: "bg-glass/60 text-ink" }} className="rounded-lg px-3 py-2 text-sm text-ink/70">{l.label}</Link>
              ))}
            </nav>
          )}
        </header>
        <main className="rise mt-8">{children}</main>
        <footer className="mt-16 border-t border-border py-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <Logo />
              <p className="mt-2 text-xs text-ink/50">AI-based internship & job recommendations for students and freshers.</p>
            </div>
            <div className="flex flex-wrap gap-5 text-xs text-ink/55">
              {links.slice(1).map((l) => <Link key={l.to} to={l.to} className="hover:text-ink">{l.label}</Link>)}
            </div>
          </div>
          <p className="mt-6 text-xs text-ink/35">© 2026 SmartHire · Sample listings shown for demonstration.</p>
        </footer>
      </div>
    </div>
  );
}

export function scoreTone(score: number) {
  if (score >= 85) return "text-mint";
  if (score >= 70) return "text-cyan";
  if (score >= 55) return "text-amber";
  return "text-rose";
}

export function ScoreRing({ score, size = 64 }: { score: number; size?: number }) {
  const r = 20, c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" className="size-full -rotate-90">
        <circle cx="24" cy="24" r={r} fill="none" stroke="currentColor" strokeWidth="4" className="text-glass" />
        <circle cx="24" cy="24" r={r} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} className={`${scoreTone(score)} transition-all duration-700`} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-display text-sm font-extrabold">{score}%</span>
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, sub, children }: { eyebrow: string; title: string; sub?: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h1>
        {sub && <p className="mt-2 max-w-2xl text-sm text-ink/60">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-glass/50 ${className}`} />;
}
