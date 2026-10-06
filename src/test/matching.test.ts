import { describe, expect, it } from "vitest";
import { DEFAULT_PROFILE, matchScore, skillGap } from "@/lib/matching";
import { OPPORTUNITIES } from "@/lib/opportunities";

const fe = OPPORTUNITIES.find((o) => o.id === "fe-northwind")!;

describe("matching", () => {
  it("full fit scores 100", () => {
    expect(matchScore({ ...DEFAULT_PROFILE, skills: fe.skills }, fe)).toBe(100);
  });
  it("lists missing skills", () => {
    const g = skillGap({ ...DEFAULT_PROFILE, skills: ["React"] }, fe);
    expect(g.missing.map((m) => m.skill)).toEqual(["TypeScript", "Tailwind", "Testing"]);
  });
});
