import OpenAI from "openai";

const MODEL = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  // OpenAI embeddings API supports batching multiple inputs
  const res = await openai.embeddings.create({ model: MODEL, input: texts });
  // Each data.item.embedding is a number[]
  return res.data.map((d) => d.embedding as number[]);
}

export function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0;
  let a2 = 0;
  let b2 = 0;
  for (let i = 0; i < a.length; i++) {
    const x = a[i] || 0;
    const y = b[i] || 0;
    dot += x * y;
    a2 += x * x;
    b2 += y * y;
  }
  if (!a2 || !b2) return 0;
  return dot / (Math.sqrt(a2) * Math.sqrt(b2));
}
