import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useProfile } from "@/lib/profile-store";
import { OPPORTUNITIES, formatPay } from "@/lib/opportunities";
import { rank, roadmap, skillGap } from "@/lib/matching";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Career Assistant — SmartHire" },
      { name: "description", content: "Ask SmartHire's AI assistant which opportunities fit you, what to learn, and how to improve your chances." },
      { property: "og:title", content: "AI Career Assistant — SmartHire" },
      { property: "og:description", content: "Personal career guidance for students and freshers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Assistant,
});

type Msg = { role: "user" | "assistant"; content: string };
const SUGGESTIONS = ["Which opportunities are best for me?", "What skills should I learn?", "Why is my match score low?", "How can I improve my chances?"];

function Assistant() {
  const { profile } = useProfile();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const context = () => {
    const top = rank(profile, OPPORTUNITIES).slice(0, 6);
    return JSON.stringify({
      profile,
      topMatches: top.map(({ opp, score }) => ({ title: opp.title, company: opp.company, score, mode: opp.mode, location: opp.location, pay: formatPay(opp), missingSkills: skillGap(profile, opp).missing.map((m) => m.skill) })),
      roadmap: roadmap(profile, OPPORTUNITIES).map((r) => ({ skill: r.skill, weeks: r.weeks, unlocks: r.unlocks.length })),
      scoring: "skills 40, interest 15, education 10, location 10, experience 10, work mode 10, pay 5",
    });
  };

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: q }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput(""); setBusy(true); setError("");
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next, context: context() }) });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "The assistant is unavailable right now.");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: acc }]);
      }
      if (!acc) throw new Error("The assistant didn't return an answer. Please try again.");
    } catch (e) {
      setMessages(next);
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <PageHeader eyebrow="AI Career Assistant" title="Ask me anything about your career" sub={`I know your profile and your top matches, ${profile.name}. Ask what to learn, why a score is low, or which role to pick.`} />
      <div className="glass flex h-[65vh] min-h-[460px] flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 && (
            <div className="grid h-full place-items-center text-center">
              <div>
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-brand font-display text-xl font-extrabold text-on-brand shadow-brand">S</div>
                <p className="mt-4 font-display text-lg font-bold">Hi {profile.name}, how can I help?</p>
                <div className="mt-5 flex max-w-xl flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => <button key={s} onClick={() => send(s)} className="btn-ghost !py-2 text-xs">{s}</button>)}
                </div>
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "bg-gradient-brand text-on-brand" : "text-ink/90"}`}>
                {m.content || <span className="inline-flex gap-1"><span className="size-1.5 animate-bounce rounded-full bg-ink/50" /><span className="size-1.5 animate-bounce rounded-full bg-ink/50 [animation-delay:.15s]" /><span className="size-1.5 animate-bounce rounded-full bg-ink/50 [animation-delay:.3s]" /></span>}
              </div>
            </div>
          ))}
          {error && <p className="rounded-xl border border-rose/40 bg-rose/10 px-4 py-3 text-sm text-rose">{error}</p>}
          <div ref={endRef} />
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2 border-t border-border p-4">
          <input className="field" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a career question…" disabled={busy} />
          <button className="btn-primary" disabled={busy || !input.trim()}>{busy ? "Thinking…" : "Send"}</button>
        </form>
      </div>
    </AppShell>
  );
}
