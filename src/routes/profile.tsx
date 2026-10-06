import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useProfile } from "@/lib/profile-store";
import { CATEGORIES, EDUCATION_LEVELS, LEARNING, type Education } from "@/lib/opportunities";
import type { Profile } from "@/lib/matching";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — Ladder" },
      { name: "description", content: "Tell Ladder your skills, education, interests and work preferences to get personalized match scores." },
      { property: "og:title", content: "Your profile — Ladder" },
      { property: "og:description", content: "Set your skills and preferences to get matched with the right internships and jobs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

const SUGGESTED = Object.keys(LEARNING);
const field = "w-full rounded-xl border border-input bg-glass/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/40";
const label = "text-[11px] font-semibold uppercase tracking-wider text-ink/45";

function ProfilePage() {
  const { profile, setProfile } = useProfile();
  const [draft, setDraft] = useState<Profile>(profile);
  const [skillInput, setSkillInput] = useState("");
  const navigate = useNavigate();
  useEffect(() => setDraft(profile), [profile]);

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setDraft({ ...draft, [k]: v });
  const toggle = (k: "skills" | "interests", v: string) =>
    set(k, draft[k].includes(v) ? draft[k].filter((x) => x !== v) : [...draft[k], v]);
  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !draft.skills.some((x) => x.toLowerCase() === s.toLowerCase())) set("skills", [...draft.skills, s]);
    setSkillInput("");
  };

  return (
    <AppShell>
      <main className="mx-auto mt-6 max-w-3xl">
        <form
          className="glass space-y-6 p-7"
          onSubmit={(e) => { e.preventDefault(); setProfile(draft); navigate({ to: "/" }); }}
        >
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Your profile</h1>
            <p className="mt-1 text-sm text-ink/60">The more you share, the sharper your match scores.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5"><span className={label}>Name</span><input className={field} value={draft.name} onChange={(e) => set("name", e.target.value)} required /></label>
            <label className="space-y-1.5"><span className={label}>Field of study</span><input className={field} value={draft.field} onChange={(e) => set("field", e.target.value)} /></label>
            <label className="space-y-1.5"><span className={label}>Education</span>
              <select className={field} value={draft.education} onChange={(e) => set("education", e.target.value as Education)}>
                {EDUCATION_LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </label>
            <label className="space-y-1.5"><span className={label}>Preferred city</span><input className={field} value={draft.location} onChange={(e) => set("location", e.target.value)} /></label>
            <label className="space-y-1.5"><span className={label}>Experience (years)</span><input type="number" min={0} max={10} className={field} value={draft.experience} onChange={(e) => set("experience", Math.max(0, Number(e.target.value)))} /></label>
            <label className="space-y-1.5"><span className={label}>Work mode</span>
              <select className={field} value={draft.mode} onChange={(e) => set("mode", e.target.value as Profile["mode"])}>
                {["Any", "Remote", "Hybrid", "On-site"].map((m) => <option key={m}>{m}</option>)}
              </select>
            </label>
            <label className="space-y-1.5"><span className={label}>Looking for</span>
              <select className={field} value={draft.kind} onChange={(e) => set("kind", e.target.value as Profile["kind"])}>
                {["Any", "Internship", "Job"].map((m) => <option key={m}>{m}</option>)}
              </select>
            </label>
          </div>

          <div className="space-y-2">
            <span className={label}>Career interests</span>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button type="button" key={c} onClick={() => toggle("interests", c)} className={`rounded-full px-3 py-1.5 text-xs font-medium ${draft.interests.includes(c) ? "bg-gradient-brand text-on-brand shadow-brand" : "bg-glass/60 text-ink/60"}`}>{c}</button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className={label}>Skills</span>
            <div className="flex gap-2">
              <input className={field} value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} placeholder="Add a skill and press Enter" />
              <button type="button" onClick={addSkill} className="rounded-xl bg-ink px-4 text-sm font-semibold text-on-brand">Add</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED.map((s) => (
                <button type="button" key={s} onClick={() => toggle("skills", s)} className={`rounded-full px-2.5 py-1 text-xs font-medium ${draft.skills.includes(s) ? "bg-brand/15 text-brand" : "bg-glass/50 text-ink/50"}`}>{draft.skills.includes(s) ? "✓ " : "+ "}{s}</button>
              ))}
              {draft.skills.filter((s) => !SUGGESTED.includes(s)).map((s) => (
                <button type="button" key={s} onClick={() => toggle("skills", s)} className="rounded-full bg-brand/15 px-2.5 py-1 text-xs font-medium text-brand">✓ {s}</button>
              ))}
            </div>
          </div>

          <button className="w-full rounded-xl bg-gradient-brand py-3 text-sm font-semibold text-on-brand shadow-brand">Save & see my matches</button>
        </form>
      </main>
    </AppShell>
  );
}
