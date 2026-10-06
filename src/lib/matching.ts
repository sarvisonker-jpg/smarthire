import { EDUCATION_LEVELS, LEARNING, type Education, type Opportunity, type WorkMode } from "./opportunities";

export interface Profile {
  name: string;
  education: Education;
  degree: string;
  skills: string[];
  interests: string[];
  location: string;
  experience: number;
  mode: WorkMode | "Any";
  kind: "Internship" | "Job" | "Any";
  /** Minimum expected monthly pay in INR (0 = no preference). */
  expectedPay: number;
}

export const DEFAULT_PROFILE: Profile = {
  name: "Priya",
  education: "Undergraduate",
  degree: "B.Tech",
  skills: ["React", "JavaScript", "Python", "SQL", "Figma"],
  interests: ["Software", "Design"],
  location: "Bengaluru",
  experience: 0,
  mode: "Remote",
  kind: "Any",
  expectedPay: 15000,
};

/** Weighted factors — total 100. */
export const WEIGHTS = { skills: 40, interest: 15, education: 10, location: 10, experience: 10, mode: 10, pay: 5 } as const;

const norm = (s: string) => s.trim().toLowerCase();

export interface SkillGap {
  have: string[];
  missing: { skill: string; tip: string; weeks: number; priority: "High" | "Medium" }[];
  coverage: number;
}

export function skillGap(p: Profile, o: Opportunity): SkillGap {
  const mine = new Set(p.skills.map(norm));
  const have = o.skills.filter((s) => mine.has(norm(s)));
  const missing = o.skills
    .map((skill, i) => ({ skill, i }))
    .filter(({ skill }) => !mine.has(norm(skill)))
    .map(({ skill, i }) => ({
      skill,
      tip: LEARNING[skill]?.tip ?? `Build a small project using ${skill}`,
      weeks: LEARNING[skill]?.weeks ?? 2,
      // skills listed first by employers are core requirements
      priority: (i < 2 ? "High" : "Medium") as "High" | "Medium",
    }))
    .sort((a, b) => (a.priority === b.priority ? a.weeks - b.weeks : a.priority === "High" ? -1 : 1));
  return { have, missing, coverage: o.skills.length ? have.length / o.skills.length : 1 };
}

export interface Factor { key: keyof typeof WEIGHTS; label: string; points: number; max: number; reason: string }

export function explain(p: Profile, o: Opportunity): Factor[] {
  const gap = skillGap(p, o);
  const eduOk = EDUCATION_LEVELS.indexOf(p.education) >= EDUCATION_LEVELS.indexOf(o.minEducation);
  const degreeOk = o.degrees.some((d) => norm(d) === norm(p.degree));
  const edu = eduOk ? (degreeOk ? 10 : 7) : 3;
  const interest = p.interests.includes(o.category) ? 15 : 0;
  const sameCity = norm(o.location) === norm(p.location);
  const loc = o.mode === "Remote" || sameCity ? 10 : 3;
  const exp = p.experience >= o.minExperience ? 10 : Math.round(10 * (p.experience / Math.max(o.minExperience, 1)));
  const mode = p.mode === "Any" || p.mode === o.mode ? 10 : o.mode === "Hybrid" ? 5 : 0;
  const pay = p.expectedPay <= 0 ? 5 : o.payMonthly == null ? 0 : o.payMonthly >= p.expectedPay ? 5 : 2;
  return [
    { key: "skills", label: "Skills", max: 40, points: Math.round(gap.coverage * 40), reason: gap.have.length ? `You have ${gap.have.length} of ${o.skills.length} required skills (${gap.have.join(", ")}).` : `None of the ${o.skills.length} required skills are on your profile yet.` },
    { key: "interest", label: "Career interest", max: 15, points: interest, reason: interest ? `${o.category} is one of your career interests.` : `${o.category} isn't in your selected interests.` },
    { key: "education", label: "Education", max: 10, points: edu, reason: !eduOk ? `Requires ${o.minEducation} level or above.` : degreeOk ? `Your ${p.degree} is a preferred course.` : `Your education level qualifies; preferred courses are ${o.degrees.join(", ")}.` },
    { key: "location", label: "Location", max: 10, points: loc, reason: o.mode === "Remote" ? "Fully remote — location doesn't matter." : sameCity ? `Based in ${o.location}, your preferred city.` : `Based in ${o.location}, not ${p.location}.` },
    { key: "experience", label: "Experience", max: 10, points: exp, reason: o.minExperience === 0 ? "Open to freshers." : p.experience >= o.minExperience ? `You meet the ${o.minExperience}+ year requirement.` : `Asks for ${o.minExperience}+ year of experience.` },
    { key: "mode", label: "Work preference", max: 10, points: mode, reason: mode === 10 ? `${o.mode} fits your preference.` : `${o.mode} — you prefer ${p.mode}.` },
    { key: "pay", label: "Stipend / salary", max: 5, points: pay, reason: p.expectedPay <= 0 ? "No pay preference set." : o.payMonthly == null ? "Unpaid or undisclosed." : o.payMonthly >= p.expectedPay ? "Meets your expected pay." : "Below your expected pay." },
  ];
}

export function matchScore(p: Profile, o: Opportunity): number {
  return explain(p, o).reduce((s, f) => s + f.points, 0);
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
  if (p.degree) s += 6;
  if (p.location) s += 6;
  return Math.min(100, s);
}

/** Aggregates missing skills across the top N matches into an ordered learning roadmap. */
export function roadmap(p: Profile, list: Opportunity[], topN = 5) {
  const top = rank(p, list).slice(0, topN);
  const map = new Map<string, { skill: string; tip: string; weeks: number; unlocks: string[]; high: number }>();
  for (const { opp } of top) {
    for (const m of skillGap(p, opp).missing) {
      const e = map.get(m.skill) ?? { skill: m.skill, tip: m.tip, weeks: m.weeks, unlocks: [], high: 0 };
      e.unlocks.push(opp.title);
      if (m.priority === "High") e.high++;
      map.set(m.skill, e);
    }
  }
  return [...map.values()].sort((a, b) => b.unlocks.length - a.unlocks.length || b.high - a.high || a.weeks - b.weeks);
}

export function scoreLabel(score: number) {
  if (score >= 85) return "Excellent match";
  if (score >= 70) return "Strong match";
  if (score >= 55) return "Fair match";
  return "Stretch role";
}
