import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { setChunks, type Chunk } from "@/lib/agent/state";
import { readTextFromPath } from "@/lib/agent/text";
import { saveChunksToDisk, getIndexPath } from "@/lib/agent/storage";
import { embedTexts } from "@/lib/agent/embeddings";

export const runtime = "nodejs";

type BuildBody =
  | { paths: string[] }
  | { text: string }
  | { sources: Array<{ path?: string; text?: string }> };

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as BuildBody;

    let combined = "";

    if ("paths" in body && Array.isArray(body.paths)) {
      for (const p of body.paths) {
        const t = await readTextFromPath(p);
        combined += `\n\n# Source: ${p}\n` + t;
      }
    } else if ("text" in body && typeof body.text === "string") {
      combined = body.text;
    } else if ("sources" in body && Array.isArray(body.sources)) {
      for (const s of body.sources) {
        if (s.text) {
          combined += `\n\n` + s.text;
        } else if (s.path) {
          const t = await readTextFromPath(s.path);
          combined += `\n\n# Source: ${s.path}\n` + t;
        }
      }
    } else {
      return NextResponse.json(
        {
          error:
            "Provide { paths: string[] } or { text: string } or { sources: {path|text}[] }",
        },
        { status: 400 }
      );
    }

    if (!combined.trim()) {
      return NextResponse.json(
        { error: "No content to index" },
        { status: 400 }
      );
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 120,
    });

    const docs = await splitter.createDocuments([combined]);
    const baseChunks: Chunk[] = docs.map((d) => ({
      id: randomUUID(),
      text: d.pageContent,
    }));

    // Compute OpenAI embeddings for all chunks
    const embeddings = await embedTexts(baseChunks.map((c) => c.text));
    const chunks: Chunk[] = baseChunks.map((c, i) => ({
      ...c,
      embedding: embeddings[i],
    }));

    setChunks(chunks);
    await saveChunksToDisk(chunks);

    return NextResponse.json({
      ok: true,
      chunks: chunks.length,
      storedAt: getIndexPath(),
      embeddingModel:
        process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
    });
  } catch (err: any) {
    console.error("/api/agent/build error", err);
    return NextResponse.json(
      { error: err?.message || "Failed to build index" },
      { status: 500 }
    );
  }
}
