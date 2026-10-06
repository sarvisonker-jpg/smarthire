import { EDUCATION_LEVELS, LEARNING, type Education, type Opportunity, type WorkMode } from "./opportunities";

export interface Profile {
  name: string;
  education: Education;
  field: string;
  skills: string[];
  interests: string[]; // categories
  location: string;
  experience: number; // years
  mode: WorkMode | "Any";
  kind: "Internship" | "Job" | "Any";
}

export const DEFAULT_PROFILE: Profile = {
  name: "Priya",
  education: "Undergraduate",
  field: "Computer Science",
  skills: ["React", "TypeScript", "Python", "SQL", "Figma"],
  interests: ["Front-end", "Design"],
  location: "Bengaluru",
  experience: 0,
  mode: "Remote",
  kind: "Any",
};

const norm = (s: string) => s.trim().toLowerCase();

export interface SkillGap { have: string[]; missing: { skill: string; tip: string }[]; coverage: number }

export function skillGap(p: Profile, o: Opportunity): SkillGap {
  const mine = new Set(p.skills.map(norm));
  const have = o.skills.filter((s) => mine.has(norm(s)));
  const missing = o.skills
    .filter((s) => !mine.has(norm(s)))
    .map((skill) => ({ skill, tip: LEARNING[skill] ?? `Build a small project using ${skill}` }));
  return { have, missing, coverage: o.skills.length ? have.length / o.skills.length : 1 };
}

/** Weights: skills 50, interest 15, location/mode 15, experience 10, education 10. */
export function matchScore(p: Profile, o: Opportunity): number {
  const skills = skillGap(p, o).coverage * 50;
  const interest = p.interests.includes(o.category) ? 15 : 0;
  const place =
    o.mode === "Remote" || norm(o.location) === norm(p.location)
      ? 15
      : p.mode === o.mode || p.mode === "Any"
        ? 7
        : 0;
  const exp = p.experience >= o.minExperience ? 10 : 10 * (p.experience / Math.max(o.minExperience, 1));
  const edu = EDUCATION_LEVELS.indexOf(p.education) >= EDUCATION_LEVELS.indexOf(o.minEducation) ? 10 : 4;
  return Math.round(skills + interest + place + exp + edu);
}

export function rank(p: Profile, list: Opportunity[]) {
  return list
    .filter((o) => p.kind === "Any" || o.kind === p.kind)
    .map((o) => ({ opp: o, score: matchScore(p, o) }))
    .sort((a, b) => b.score - a.score);
}

export function profileStrength(p: Profile): number {
  let s = 20;
  s += Math.min(p.skills.length, 8) * 6;
  s += Math.min(p.interests.length, 3) * 4;
  if (p.field) s += 6;
  if (p.location) s += 6;
  return Math.min(100, s);
}

export function guidance(p: Profile, o: Opportunity, score: number): string {
  const gap = skillGap(p, o);
  if (gap.missing.length === 0) return `You already cover every core skill for ${o.title}. Polish your portfolio and apply this week — you're a strong fit.`;
  const top = gap.missing[0]!;
  const strong = gap.have.slice(0, 2).join(" and ") || "your fundamentals";
  const lift = Math.min(100, score + Math.round(50 / o.skills.length));
  return `Your ${strong} ${gap.have.length > 1 ? "are" : "is"} solid. ${top.tip} to close the ${top.skill} gap and lift this match from ${score}% to about ${lift}%.`;
}
