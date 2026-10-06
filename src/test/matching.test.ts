import { describe, expect, it } from "vitest";
import { DEFAULT_PROFILE, matchScore, skillGap, WEIGHTS } from "@/lib/matching";
import { OPPORTUNITIES } from "@/lib/opportunities";

const fe = OPPORTUNITIES.find((o) => o.id === "fe-northwind")!;

describe("matching", () => {
  it("weights add up to 100", () => {
    expect(Object.values(WEIGHTS).reduce((a, b) => a + b, 0)).toBe(100);
  });
  it("perfect fit scores 100", () => {
    expect(matchScore({ ...DEFAULT_PROFILE, skills: fe.skills, interests: ["Software"] }, fe)).toBe(100);
  });
  it("lists missing skills with core ones first", () => {
    const g = skillGap({ ...DEFAULT_PROFILE, skills: ["Git"] }, fe);
    expect(g.missing[0]!.priority).toBe("High");
    expect(g.missing.map((m) => m.skill).sort()).toEqual(["JavaScript", "React", "Tailwind", "TypeScript"]);
  });
});
