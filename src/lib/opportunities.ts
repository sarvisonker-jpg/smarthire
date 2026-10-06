import northwind from "@/assets/co-northwind.jpg";
import meridian from "@/assets/co-meridian.jpg";
import lumen from "@/assets/co-lumen.jpg";

/**
 * Sample data source. Replace `fetchOpportunities` with a database or job-API call later;
 * the rest of the app only depends on the `Opportunity` shape.
 */
export type WorkMode = "Remote" | "Hybrid" | "On-site";
export type Kind = "Internship" | "Job";
export type Education = "High school" | "Diploma" | "Undergraduate" | "Graduate" | "Postgraduate";
export const EDUCATION_LEVELS: Education[] = ["High school", "Diploma", "Undergraduate", "Graduate", "Postgraduate"];
export const CATEGORIES = ["Software", "Data", "Design", "Product", "Marketing", "Business"] as const;
export const EXPERIENCE_LEVELS = [
  { value: 0, label: "Fresher (0 yrs)" },
  { value: 1, label: "Under 1 yr" },
  { value: 2, label: "1–2 yrs" },
] as const;

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  image?: string;
  kind: Kind;
  category: (typeof CATEGORIES)[number];
  location: string;
  mode: WorkMode;
  /** Monthly pay in INR; null when unpaid/undisclosed. */
  payMonthly: number | null;
  minExperience: number;
  minEducation: Education;
  degrees: string[]; // preferred courses
  skills: string[];
  description: string;
}

export const OPPORTUNITIES: Opportunity[] = [
  { id: "fe-northwind", title: "Front-end Developer Intern", company: "Northwind Labs", image: northwind, kind: "Internship", category: "Software", location: "Bengaluru", mode: "Remote", payMonthly: 22000, minExperience: 0, minEducation: "Undergraduate", degrees: ["B.Tech", "BCA", "B.Sc"], skills: ["React", "JavaScript", "TypeScript", "Tailwind", "Git"], description: "Build customer-facing dashboards for a fintech product used by 2M+ people." },
  { id: "da-meridian", title: "Data Analyst Intern", company: "Meridian Analytics", image: meridian, kind: "Internship", category: "Data", location: "Pune", mode: "Hybrid", payMonthly: 18000, minExperience: 0, minEducation: "Undergraduate", degrees: ["B.Tech", "B.Sc", "B.Com", "BCA"], skills: ["SQL", "Python", "Excel", "Tableau"], description: "Turn sales data into weekly insight reports for retail clients." },
  { id: "ux-lumen", title: "UI/UX Design Intern", company: "Lumen Studio", image: lumen, kind: "Internship", category: "Design", location: "Mumbai", mode: "Remote", payMonthly: 20000, minExperience: 0, minEducation: "Undergraduate", degrees: ["B.Des", "B.Tech", "BCA", "BA"], skills: ["Figma", "Prototyping", "User research", "Design systems"], description: "Design onboarding flows for consumer apps with a senior mentor." },
  { id: "pm-kestrel", title: "Product Management Intern", company: "Kestrel", kind: "Internship", category: "Product", location: "Bengaluru", mode: "On-site", payMonthly: 25000, minExperience: 0, minEducation: "Undergraduate", degrees: ["B.Tech", "BBA", "MBA"], skills: ["Communication", "SQL", "User research", "Figma"], description: "Own a small feature from discovery to launch inside a growth team." },
  { id: "fe-solstice", title: "Junior Software Engineer", company: "Solstice Tech", kind: "Job", category: "Software", location: "Hyderabad", mode: "Hybrid", payMonthly: 55000, minExperience: 1, minEducation: "Graduate", degrees: ["B.Tech", "MCA"], skills: ["JavaScript", "React", "Node.js", "SQL", "Git"], description: "Full-stack role on an internal tools team. Strong mentorship." },
  { id: "be-cobalt", title: "Backend Developer Intern", company: "Cobalt Systems", kind: "Internship", category: "Software", location: "Chennai", mode: "Remote", payMonthly: 24000, minExperience: 0, minEducation: "Undergraduate", degrees: ["B.Tech", "BCA", "MCA"], skills: ["Node.js", "SQL", "Python", "Git", "APIs"], description: "Build and test REST APIs for logistics software." },
  { id: "mk-halcyon", title: "Digital Marketing Intern", company: "Halcyon Retail", kind: "Internship", category: "Marketing", location: "Pune", mode: "On-site", payMonthly: 12000, minExperience: 0, minEducation: "Undergraduate", degrees: ["BBA", "BA", "B.Com"], skills: ["SEO", "Copywriting", "Social media", "Excel"], description: "Run campaigns and track results for a growing D2C brand." },
  { id: "ds-orbit", title: "Associate Data Scientist", company: "Orbit AI", kind: "Job", category: "Data", location: "Bengaluru", mode: "Hybrid", payMonthly: 70000, minExperience: 1, minEducation: "Graduate", degrees: ["B.Tech", "M.Sc", "M.Tech"], skills: ["Python", "Machine learning", "SQL", "Statistics"], description: "Train and ship ML models for demand forecasting." },
  { id: "ba-vertex", title: "Business Analyst Trainee", company: "Vertex Consulting", kind: "Job", category: "Business", location: "Gurugram", mode: "On-site", payMonthly: 40000, minExperience: 0, minEducation: "Graduate", degrees: ["BBA", "B.Com", "MBA", "B.Tech"], skills: ["Excel", "Communication", "SQL", "PowerPoint"], description: "Support client projects with research, models and decks." },
  { id: "qa-pebble", title: "QA Testing Intern", company: "Pebble Apps", kind: "Internship", category: "Software", location: "Noida", mode: "Hybrid", payMonthly: 10000, minExperience: 0, minEducation: "Diploma", degrees: ["Diploma", "BCA", "B.Tech"], skills: ["Testing", "JavaScript", "Git"], description: "Test mobile apps and write automated test scripts." },
  { id: "gd-canvas", title: "Graphic Design Intern", company: "Canvas Collective", kind: "Internship", category: "Design", location: "Delhi", mode: "Remote", payMonthly: null, minExperience: 0, minEducation: "High school", degrees: ["B.Des", "BA", "BFA"], skills: ["Figma", "Illustrator", "Branding"], description: "Create social and brand visuals for non-profits. Certificate provided." },
  { id: "ca-nimbus", title: "Cloud Support Associate", company: "Nimbus Cloud", kind: "Job", category: "Software", location: "Bengaluru", mode: "Remote", payMonthly: 45000, minExperience: 0, minEducation: "Graduate", degrees: ["B.Tech", "BCA", "B.Sc"], skills: ["Linux", "Networking", "Python", "Communication"], description: "Help customers solve cloud issues; full AWS training included." },
];

/** Simulates an async data source so loading/error states are real. */
export async function fetchOpportunities(): Promise<Opportunity[]> {
  await new Promise((r) => setTimeout(r, 350));
  return OPPORTUNITIES;
}

export function formatPay(o: Opportunity) {
  if (o.payMonthly == null) return "Unpaid / certificate";
  return o.kind === "Job" ? `₹${((o.payMonthly * 12) / 100000).toFixed(1)} LPA` : `₹${Math.round(o.payMonthly / 1000)}k/mo`;
}

export const LEARNING: Record<string, { tip: string; weeks: number }> = {
  React: { tip: "Ship a small React app to the web", weeks: 3 },
  JavaScript: { tip: "Build three vanilla JS mini-projects", weeks: 3 },
  TypeScript: { tip: "Take a free intro TypeScript course and convert one project", weeks: 2 },
  Tailwind: { tip: "Rebuild a landing page with Tailwind", weeks: 1 },
  Git: { tip: "Contribute one PR to an open-source repo", weeks: 1 },
  SQL: { tip: "Solve 30 SQL practice problems", weeks: 2 },
  Python: { tip: "Complete a Python data-wrangling project", weeks: 3 },
  Excel: { tip: "Practice pivot tables, lookups and charts", weeks: 1 },
  Tableau: { tip: "Publish one Tableau Public dashboard", weeks: 2 },
  Figma: { tip: "Redesign one app screen in Figma", weeks: 2 },
  Prototyping: { tip: "Prototype a clickable flow in Figma", weeks: 1 },
  "User research": { tip: "Run 3 user interviews and summarize findings", weeks: 2 },
  "Design systems": { tip: "Document a small component library", weeks: 2 },
  Communication: { tip: "Write and present a 5-minute product teardown", weeks: 1 },
  "Node.js": { tip: "Build a REST API with Node.js and Express", weeks: 3 },
  APIs: { tip: "Consume and document two public APIs", weeks: 1 },
  "Machine learning": { tip: "Finish one Kaggle starter competition", weeks: 4 },
  Statistics: { tip: "Review intro stats and hypothesis testing", weeks: 2 },
  SEO: { tip: "Audit a website and write SEO fixes", weeks: 1 },
  Copywriting: { tip: "Write 5 sample ad and email variants", weeks: 1 },
  "Social media": { tip: "Plan and run a 2-week content calendar", weeks: 2 },
  PowerPoint: { tip: "Build a 10-slide case-study deck", weeks: 1 },
  Testing: { tip: "Write automated tests for one portfolio app", weeks: 2 },
  Illustrator: { tip: "Complete 5 vector illustration exercises", weeks: 2 },
  Branding: { tip: "Create a brand kit for a fictional company", weeks: 2 },
  Linux: { tip: "Learn 40 core Linux commands with a home lab", weeks: 2 },
  Networking: { tip: "Study TCP/IP, DNS and HTTP basics", weeks: 2 },
};

export const ALL_SKILLS = Object.keys(LEARNING);
