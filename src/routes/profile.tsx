import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useProfile } from "@/lib/profile-store";
import { ALL_SKILLS, CATEGORIES, EDUCATION_LEVELS, EXPERIENCE_LEVELS, type Education } from "@/lib/opportunities";
import { profileStrength, type Profile } from "@/lib/matching";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Student profile — SmartHire" },
      { name: "description", content: "Enter your degree, skills, interests, location, experience and work preferences to get personalized matches." },
      { property: "og:title", content: "Student profile — SmartHire" },
      { property: "og:description", content: "Tell SmartHire about yourself to get ranked internship and job matches." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

const label = "text-xs font-semibold uppercase tracking-wider text-ink/50";
const DEGREES = ["B.Tech", "BCA", "B.Sc", "B.Com", "BBA", "BA", "B.Des", "MCA", "MBA", "M.Tech", "M.Sc", "Diploma"];

function ProfilePage() {
  const { profile, setProfile } = useProfile();
  const [draft, setDraft] = useState<Profile>(profile);
  const [skillInput, setSkillInput] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => setDraft(profile), [profile]);

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setDraft({ ...draft, [k]: v });
  const toggle = (k: "skills" | "interests", v: string) => set(k, draft[k].includes(v) ? draft[k].filter((x) => x !== v) : [...draft[k], v]);
  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !draft.skills.some((x) => x.toLowerCase() === s.toLowerCase())) set("skills", [...draft.skills, s]);
    setSkillInput("");
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (draft.skills.length === 0) return setError("Add at least one skill so we can match you.");
    if (draft.interests.length === 0) return setError("Pick at least one career interest.");
    setError("");
    setProfile(draft);
    navigate({ to: "/recommendations" });
  };
  const strength = profileStrength(draft);

  return (
    <AppShell>
      <PageHeader eyebrow="Step 1 · Your profile" title="Tell us about yourself" sub="The more you share, the sharper your match scores. Your profile stays on this device.">
        <div className="glass w-full p-4 md:w-56">
          <p className="text-[11px] uppercase tracking-widest text-ink/50">Profile strength</p>
          <p className="font-display text-2xl font-extrabold">{strength}%</p>
          <div className="mt-2 h-1.5 rounded-full bg-glass"><div className="h-1.5 rounded-full bg-gradient-brand transition-all" style={{ width: `${strength}%` }} /></div>
        </div>
      </PageHeader>

      <form onSubmit={submit} className="glass space-y-8 p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <label className="space-y-1.5"><span className={label}>Name</span><input className="field" value={draft.name} onChange={(e) => set("name", e.target.value)} required /></label>
          <label className="space-y-1.5"><span className={label}>Degree / course</span>
            <select className="field" value={draft.degree} onChange={(e) => set("degree", e.target.value)}>{DEGREES.map((d) => <option key={d}>{d}</option>)}</select>
          </label>
          <label className="space-y-1.5"><span className={label}>Education level</span>
            <select className="field" value={draft.education} onChange={(e) => set("education", e.target.value as Education)}>{EDUCATION_LEVELS.map((l) => <option key={l}>{l}</option>)}</select>
          </label>
          <label className="space-y-1.5"><span className={label}>Preferred location</span><input className="field" value={draft.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Bengaluru" /></label>
          <label className="space-y-1.5"><span className={label}>Experience level</span>
            <select className="field" value={draft.experience} onChange={(e) => set("experience", Number(e.target.value))}>{EXPERIENCE_LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}</select>
          </label>
          <label className="space-y-1.5"><span className={label}>Looking for</span>
            <select className="field" value={draft.kind} onChange={(e) => set("kind", e.target.value as Profile["kind"])}>{["Any", "Internship", "Job"].map((m) => <option key={m}>{m}</option>)}</select>
          </label>
          <label className="space-y-1.5"><span className={label}>Expected pay (₹ / month)</span><input type="number" min={0} step={1000} className="field" value={draft.expectedPay} onChange={(e) => set("expectedPay", Math.max(0, Number(e.target.value)))} /></label>
        </div>

        <div className="space-y-2">
          <span className={label}>Work preference</span>
          <div className="flex flex-wrap gap-2">
            {(["Remote", "Hybrid", "On-site", "Any"] as const).map((m) => (
              <button type="button" key={m} onClick={() => set("mode", m)} className={draft.mode === m ? "btn-primary !py-2" : "btn-ghost !py-2"}>{m}</button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <span className={label}>Career interests</span>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button type="button" key={c} onClick={() => toggle("interests", c)} className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${draft.interests.includes(c) ? "border-brand bg-brand/20 text-ink" : "border-border text-ink/60 hover:text-ink"}`}>{c}</button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <span className={label}>Skills</span>
          <div className="flex gap-2">
            <input className="field" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} placeholder="Type a skill and press Enter" />
            <button type="button" onClick={addSkill} className="btn-ghost">Add</button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[...new Set([...ALL_SKILLS, ...draft.skills])].map((s) => {
              const on = draft.skills.includes(s);
              return <button type="button" key={s} onClick={() => toggle("skills", s)} className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${on ? "bg-gradient-brand text-on-brand" : "bg-glass/40 text-ink/55 hover:text-ink"}`}>{on ? "✓ " : "+ "}{s}</button>;
            })}
          </div>
        </div>

        {error && <p className="rounded-xl border border-rose/40 bg-rose/10 px-4 py-3 text-sm text-rose">{error}</p>}
        <button className="btn-primary w-full !py-3 text-base">Show my recommendations →</button>
      </form>
    </AppShell>
  );
}
