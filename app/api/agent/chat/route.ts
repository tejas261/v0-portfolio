import { NextRequest, NextResponse } from "next/server";
import { getChunks, hasChunks, setChunks } from "@/lib/agent/state";
import { loadChunksFromDisk, saveChunksToDisk } from "@/lib/agent/storage";
import { embedTexts, cosineSimilarity } from "@/lib/agent/embeddings";

export const runtime = "nodejs";

function scoreChunkKeyword(question: string, chunk: string): number {
  const qTokens = new Set(
    question
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
  );
  const cTokens = chunk
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  let score = 0;
  for (const t of cTokens) if (qTokens.has(t)) score += 1;
  return score + Math.min(chunk.length / 1000, 1);
}

export async function POST(req: NextRequest) {
  try {
    const { question } = (await req.json()) as { question?: string };
    if (!question || !question.trim()) {
      return NextResponse.json({ error: "Missing question" }, { status: 400 });
    }

    const q = question.toLowerCase();
    if (/\b(resume|cv)\b/.test(q) || /\b(link|download|pdf)\b/.test(q)) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return NextResponse.json({
        answer: "Here you go — [Download my resume](/resume.pdf).",
      });
    }

    if (!hasChunks()) {
      const disk = await loadChunksFromDisk();
      if (disk && disk.length) {
        setChunks(disk);
      }
    }

    if (!hasChunks()) {
      return NextResponse.json(
        {
          error:
            "Index not built. POST /api/agent/build first with { paths: string[] } or { text: string }.",
        },
        { status: 400 }
      );
    }

    let chunks = getChunks();

    // If embeddings are missing (e.g., old index), upgrade in place
    if (!chunks.some((c) => Array.isArray(c.embedding))) {
      const embs = await embedTexts(chunks.map((c) => c.text));
      chunks = chunks.map((c, i) => ({ ...c, embedding: embs[i] }));
      setChunks(chunks);
      await saveChunksToDisk(chunks); // persist upgraded index
    }

    let ranked: { text: string; s: number }[];
    const firstWithEmb = chunks.find((c) => Array.isArray(c.embedding));
    if (firstWithEmb && firstWithEmb.embedding) {
      const [qVec] = await embedTexts([question]);
      ranked = chunks
        .map((c) => ({
          text: c.text,
          s: c.embedding ? cosineSimilarity(qVec, c.embedding) : 0,
        }))
        .sort((a, b) => b.s - a.s)
        .slice(0, 8);
    } else {
      ranked = chunks
        .map((c) => ({ text: c.text, s: scoreChunkKeyword(question, c.text) }))
        .sort((a, b) => b.s - a.s)
        .slice(0, 8);
    }

    const context = ranked
      .map((r, i) => `[[Chunk ${i + 1}]]\n${r.text}`)
      .join("\n\n");

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing MISTRAL_API_KEY in environment" },
        { status: 500 }
      );
    }

    const prompt = `You are a helpful assistant answering questions about a resume/profile.
Use only the provided context. If the answer isn't in the context, say you don't know. Respond in FPP as if you are the person answering the question. Do not include any words which sound like a text that an LLM has sent while answering the question. Don't get into too much detail. Answer in max 3-4 sentences. Answer straight to the point.

Question: ${question}
\nContext:\n${context}`;

    const mistralRes = await fetch(
      "https://api.mistral.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.MISTRAL_CHAT_MODEL || "mistral-small-latest",
          messages: [
            {
              role: "system",
              content: "You are a concise and accurate assistant.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.5,
        }),
      }
    );

    if (!mistralRes.ok) {
      const errText = await mistralRes.text();
      throw new Error(`Mistral API error ${mistralRes.status}: ${errText}`);
    }

    const completion: any = await mistralRes.json();
    const answer =
      completion?.choices?.[0]?.message?.content ||
      "I couldn't generate an answer.";

    return NextResponse.json({ answer });
  } catch (err: any) {
    console.error("/api/agent/chat error", err);
    return NextResponse.json(
      { error: err?.message || "Failed to answer" },
      { status: 500 }
    );
  }
}
