export type Chunk = {
  id: string;
  text: string;
  embedding?: number[]; // OpenAI embedding vector
};

let chunks: Chunk[] = [];

export function setChunks(next: Chunk[]) {
  chunks = next;
}

export function getChunks(): Chunk[] {
  return chunks;
}

export function hasChunks() {
  return chunks.length > 0;
}
