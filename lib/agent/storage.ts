import path from "node:path";
import { promises as fs } from "node:fs";
import type { Chunk } from "./state";

const DATA_DIR = path.resolve(process.cwd(), ".agent");
const INDEX_PATH = path.join(DATA_DIR, "index.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export function getIndexPath() {
  return INDEX_PATH;
}

export async function saveChunksToDisk(chunks: Chunk[]) {
  await ensureDir();
  const payload = { version: 1, savedAt: new Date().toISOString(), chunks };
  await fs.writeFile(INDEX_PATH, JSON.stringify(payload, null, 2), "utf8");
}

export async function loadChunksFromDisk(): Promise<Chunk[] | null> {
  try {
    const raw = await fs.readFile(INDEX_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed?.chunks)) return parsed.chunks as Chunk[];
    return null;
  } catch (e) {
    return null;
  }
}

export async function clearIndexOnDisk() {
  try {
    await fs.rm(INDEX_PATH, { force: true });
  } catch {}
}
