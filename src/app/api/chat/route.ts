import Anthropic from "@anthropic-ai/sdk";
import { buildFaveAiKnowledgeBase, buildModeInstruction } from "@/lib/faveai-system-prompt";
import { extractClientIp, hashVisitorIp } from "@/lib/visitor-hash";
import { checkChatRateLimit } from "@/lib/chat-rate-limit";
import type { ChatMode } from "@/lib/chatbot-content";

const MODES: ChatMode[] = ["recruiter", "designer", "general"];
const MAX_HISTORY = 12;
const MAX_MESSAGE_LENGTH = 1500;

type IncomingMessage = { role: "bot" | "user"; text: string };

function isValidBody(body: unknown): body is { mode: ChatMode; messages: IncomingMessage[] } {
  if (!body || typeof body !== "object") return false;
  const { mode, messages } = body as Record<string, unknown>;
  if (typeof mode !== "string" || !MODES.includes(mode as ChatMode)) return false;
  if (!Array.isArray(messages) || messages.length === 0) return false;
  return messages.every(
    (m) =>
      m &&
      typeof m === "object" &&
      (m.role === "bot" || m.role === "user") &&
      typeof m.text === "string" &&
      m.text.length > 0 &&
      m.text.length <= MAX_MESSAGE_LENGTH,
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!isValidBody(body)) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const ip = extractClientIp(request.headers);
  const visitorHash = hashVisitorIp(ip ?? "unknown");
  const { allowed } = checkChatRateLimit(visitorHash);
  if (!allowed) {
    return Response.json(
      { error: "You've hit the hourly limit for FaveAI messages — try again later, or email directly." },
      { status: 429 },
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("FaveAI request failed: ANTHROPIC_API_KEY is unset.");
    return Response.json({ error: "Currently not available — kindly try again later." }, { status: 503 });
  }

  const knowledgeBase = await buildFaveAiKnowledgeBase();
  const history = body.messages.slice(-MAX_HISTORY);

  const client = new Anthropic({ apiKey });

  let stream: ReturnType<Anthropic["messages"]["stream"]>;
  try {
    stream = client.messages.stream({
      model: "claude-opus-5",
      max_tokens: 1024,
      system: [
        { type: "text", text: knowledgeBase, cache_control: { type: "ephemeral" } },
        { type: "text", text: buildModeInstruction(body.mode) },
      ],
      messages: history.map((m) => ({
        role: m.role === "bot" ? "assistant" : "user",
        content: m.text,
      })),
    });
  } catch (err) {
    console.error("FaveAI request setup failed:", err);
    return Response.json({ error: "Currently not available — kindly try again later." }, { status: 502 });
  }

  const encoder = new TextEncoder();
  const body_ = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        console.error("FaveAI stream error:", err);
        const isCapacityError = err instanceof Anthropic.APIError && (err.status === 429 || err.status === 529);
        controller.enqueue(
          encoder.encode(
            isCapacityError
              ? "Currently not available — kindly try again later."
              : "\n\n(Something went wrong on my end — try again in a moment.)",
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body_, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
