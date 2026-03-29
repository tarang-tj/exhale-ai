import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const SYSTEM = `You are Exhale, a calm, direct assistant. The user describes stress: situations, decisions, waiting, rejection, work, relationships, or spirals.

Respond ONLY with valid JSON matching this exact shape (no markdown, no code fences):
{"inYourControl":"string","reframe":"string","nextSteps":["string","string","string"]}

Rules:
- inYourControl: 2-4 short sentences listing only concrete actions or attitudes they can actually influence. No empty positivity.
- reframe: 2-4 sentences that are rational and grounding—not clinical "therapy speak," not dismissive.
- nextSteps: exactly 3 specific, doable items for the next hours or days. Imperative mood. No numbering inside the strings.

If the input is empty, harmful toward self or others, or not in good faith, still return valid JSON with safe, brief content declining to engage in detail.`;

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server missing ANTHROPIC_API_KEY. Add it to .env.local." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const message =
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof (body as { message: unknown }).message === "string"
      ? (body as { message: string }).message.trim()
      : "";

  if (!message) {
    return NextResponse.json(
      { error: "Missing or empty \"message\" field." },
      { status: 400 },
    );
  }

  const client = new Anthropic({ apiKey });

  let text = "";
  try {
    const model =
      process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-20241022";

    const resp = await client.messages.create({
      model,
      max_tokens: 1024,
      system: SYSTEM,
      messages: [{ role: "user", content: message }],
    });

    const block = resp.content[0];
    if (block?.type === "text") {
      text = block.text;
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Anthropic request failed.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return NextResponse.json(
      { error: "Model returned invalid JSON. Try again." },
      { status: 502 },
    );
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as { inYourControl?: unknown }).inYourControl !==
      "string" ||
    typeof (parsed as { reframe?: unknown }).reframe !== "string" ||
    !Array.isArray((parsed as { nextSteps?: unknown }).nextSteps)
  ) {
    return NextResponse.json(
      { error: "Model response had unexpected shape. Try again." },
      { status: 502 },
    );
  }

  const nextSteps = (parsed as { nextSteps: unknown[] }).nextSteps.filter(
    (s): s is string => typeof s === "string",
  );

  return NextResponse.json({
    inYourControl: (parsed as { inYourControl: string }).inYourControl,
    reframe: (parsed as { reframe: string }).reframe,
    nextSteps: nextSteps.slice(0, 5),
  });
}
