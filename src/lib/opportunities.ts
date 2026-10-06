import northwind from "@/assets/co-northwind.jpg";
import meridian from "@/assets/co-meridian.jpg";
import lumen from "@/assets/co-lumen.jpg";

export type WorkMode = "Remote" | "Hybrid" | "On-site";
export type Kind = "Internship" | "Job";

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  image?: string;
  kind: Kind;
  category: string;
  location: string;
  mode: WorkMode;
  pay: string;
  minExperience: number; // years
  minEducation: Education;
  skills: string[];
}

export type Education = "High school" | "Diploma" | "Undergraduate" | "Graduate" | "Postgraduate";
export const EDUCATION_LEVELS: Education[] = ["High school", "Diploma", "Undergraduate", "Graduate", "Postgraduate"];

export const CATEGORIES = ["Front-end", "Data", "Design", "Product", "Marketing", "Back-end"];

export const OPPORTUNITIES: Opportunity[] = [
  { id: "fe-northwind", title: "Front-end Intern", company: "Northwind Labs", image: northwind, kind: "Internship", category: "Front-end", location: "Bengaluru", mode: "Remote", pay: "₹22k/mo", minExperience: 0, minEducation: "Undergraduate", skills: ["React", "TypeScript", "Tailwind", "Testing"] },
  { id: "da-meridian", title: "Data Analyst Intern", company: "Meridian Analytics", image: meridian, kind: "Internship", category: "Data", location: "Pune", mode: "Hybrid", pay: "₹18k/mo", minExperience: 0, minEducation: "Undergraduate", skills: ["SQL", "Python", "Tableau", "Excel"] },
  { id: "ux-lumen", title: "UI/UX Design Intern", company: "Lumen Studio", image: lumen, kind: "Internship", category: "Design", location: "Mumbai", mode: "Remote", pay: "₹20k/mo", minExperience: 0, minEducation: "Undergraduate", skills: ["Figma", "Prototyping", "Design systems"] },
  { id: "pm-kestrel", title: "Product Intern", company: "Kestrel", kind: "Internship", category: "Product", location: "Bengaluru", mode: "On-site", pay: "₹25k/mo", minExperience: 0, minEducation: "Undergraduate", skills: ["Communication", "SQL", "Figma", "Research"] },
  { id: "fe-solstice", title: "Junior Front-end Developer", company: "Solstice", kind: "Job", category: "Front-end", location: "Hyderabad", mode: "Hybrid", pay: "₹6 LPA", minExperience: 1, minEducation: "Graduate", skills: ["React", "JavaScript", "CSS", "Git"] },
  { id: "be-cobalt", title: "Backend Developer Intern", company: "Cobalt Systems", kind: "Internship", category: "Back-end", location: "Remote", mode: "Remote", pay: "₹24k/mo", minExperience: 0, minEducation: "Undergraduate", skills: ["Node.js", "SQL", "Python", "Git"] },
  { id: "mk-halcyon", title: "Marketing Analyst Intern", company: "Halcyon Retail", kind: "Internship", category: "Marketing", location: "Pune", mode: "On-site", pay: "₹15k/mo", minExperience: 0, minEducation: "Undergraduate", skills: ["Excel", "Copywriting", "SEO", "Analytics"] },
  { id: "ds-orbit", title: "Associate Data Scientist", company: "Orbit AI", kind: "Job", category: "Data", location: "Bengaluru", mode: "Hybrid", pay: "₹8 LPA", minExperience: 1, minEducation: "Graduate", skills: ["Python", "Machine learning", "SQL", "Statistics"] },
];

export const LEARNING: Record<string, string> = {
  Tailwind: "Build a 2-week Tailwind mini-project",
  TypeScript: "Take a free intro to TypeScript course",
  Testing: "Write unit tests for one portfolio app",
  Tableau: "Publish one Tableau Public dashboard",
  Excel: "Practice pivot tables & lookups",
  Figma: "Redesign one app screen in Figma",
  Prototyping: "Prototype a clickable flow in Figma",
  "Design systems": "Document a small component library",
  SQL: "Solve 30 SQL practice problems",
  Python: "Complete a Python data-wrangling project",
  React: "Ship a small React app to the web",
  JavaScript: "Build three vanilla JS mini-projects",
  CSS: "Recreate two landing pages from scratch",
  Git: "Contribute a PR to an open-source repo",
  "Node.js": "Build a REST API with Node.js",
  "Machine learning": "Finish one Kaggle starter competition",
  Statistics: "Review intro stats & hypothesis testing",
  Communication: "Write and present a product teardown",
  Research: "Run 3 user interviews and summarize them",
  Copywriting: "Write 5 sample ad and email variants",
  SEO: "Audit a website and write SEO fixes",
  Analytics: "Earn a free Google Analytics certificate",
};
