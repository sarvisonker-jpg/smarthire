import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useProfile } from "@/lib/profile-store";

const links = [
  { to: "/", label: "Discover" },
  { to: "/profile", label: "My profile" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { profile } = useProfile();
  return (
    <div className="relative min-h-screen overflow-hidden text-ink">
      <div className="pointer-events-none absolute -top-28 -left-24 h-[520px] w-[520px] rounded-full bg-brand/30 blur-3xl drift" />
      <div className="pointer-events-none absolute top-1/3 -right-28 h-[560px] w-[560px] rounded-full bg-cyan/30 blur-3xl drift-2" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-[460px] w-[460px] rounded-full bg-mint/25 blur-3xl drift" />
      <div className="pointer-events-none absolute top-24 left-1/2 h-72 w-72 rounded-full bg-rose/20 blur-3xl glow" />

      <div className="relative mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-10">
        <header className="glass flex flex-wrap items-center justify-between gap-4 px-5 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-gradient-brand shadow-brand">
              <span className="font-display text-[15px] font-extrabold text-on-brand">L</span>
            </div>
            <span className="font-display text-lg font-bold tracking-tight">Ladder</span>
          </Link>
          <nav className="flex items-center gap-7 text-sm font-medium text-ink/70">
            {links.map((l) => (
              <Link key={l.to} to={l.to} activeOptions={{ exact: true }} activeProps={{ className: "text-brand" }} className="hover:text-brand">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-glass/70 bg-glass/60 px-3 py-1.5 text-xs sm:flex">
              <span className="size-1.5 rounded-full bg-mint" />
              <span className="font-medium text-ink/70">{profile.name} · {profile.education}, {profile.field}</span>
            </div>
            <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-rose to-amber text-sm font-semibold text-on-brand">
              {profile.name.charAt(0).toUpperCase() || "?"}
            </div>
          </div>
        </header>
        {children}
        <footer className="glass mt-6 flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-xs text-ink/50">
          <span className="font-display font-semibold text-ink/70">Ladder — career-focused matching for students &amp; freshers</span>
          <span>Scores update instantly as you edit your profile</span>
        </footer>
      </div>
    </div>
  );
}

export function scoreTone(score: number) {
  if (score >= 85) return "bg-mint/15 text-mint";
  if (score >= 65) return "bg-cyan/15 text-cyan";
  return "bg-amber/15 text-amber";
}
