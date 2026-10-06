import { createFileRoute } from "@tanstack/react-router";

type Msg = { role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return Response.json({ error: "AI is not configured." }, { status: 500 });
        const body = (await request.json()) as { messages: Msg[]; context: string };
        const messages = (body.messages ?? []).slice(-12).map((m) => ({ role: m.role, content: String(m.content).slice(0, 4000) }));

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
          method: "POST",
          signal: request.signal,
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}`, "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "fetch" },
          body: JSON.stringify({
            model: "openai/gpt-6-astra",
            stream: true,
            store: false,
            reasoning: { effort: "low", summary: "auto" },
            include: ["reasoning.encrypted_content"],
            instructions: `You are SmartHire's friendly AI Career Assistant for students and freshers in India. Be concise (under 180 words), practical and encouraging. Use short bullet points. Base answers on this student's data:\n${String(body.context ?? "").slice(0, 6000)}`,
            input: messages,
          }),
        });

        if (!upstream.ok || !upstream.body) {
          const status = upstream.status;
          const msg = status === 429 ? "Too many requests — please wait a moment and try again." : status === 402 ? "AI credits have run out for this workspace." : "The assistant is unavailable right now.";
          return Response.json({ error: msg }, { status });
        }

        const reader = upstream.body.getReader();
        const dec = new TextDecoder();
        const enc = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            let buf = "";
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buf += dec.decode(value, { stream: true });
                const lines = buf.split("\n");
                buf = lines.pop() ?? "";
                for (const line of lines) {
                  if (!line.startsWith("data:")) continue;
                  const d = line.slice(5).trim();
                  if (!d || d === "[DONE]") continue;
                  try {
                    const ev = JSON.parse(d);
                    if (ev.type === "response.output_text.delta" && ev.delta) controller.enqueue(enc.encode(ev.delta));
                  } catch {}
                }
              }
            } catch {}
            controller.close();
          },
          cancel() { reader.cancel(); },
        });
        const headers = new Headers({ "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" });
        upstream.headers.forEach((v, k) => { if (k.toLowerCase().startsWith("x-lovable-aig-")) headers.set(k, v); });
        return new Response(stream, { headers });
      },
    },
  },
});
