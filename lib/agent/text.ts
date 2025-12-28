import path from "node:path";
import { readFile } from "node:fs/promises";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

// Extracted and adapted from resume-agent/src/buildIndex.ts
export async function readTextFromPath(p: string): Promise<string> {
  const ext = path.extname(p).toLowerCase();
  if (ext === ".pdf") {
    const buf = await readFile(p);
    const parsed = await pdfParse(buf);
    return parsed.text || "";
  } else if (ext === ".docx") {
    const buf = await readFile(p);
    const res = await mammoth.extractRawText({ buffer: buf });
    return res.value || "";
  } else if (ext === ".md" || ext === ".txt") {
    return await readFile(p, "utf8");
  }
  throw new Error(`Unsupported file type: ${ext}`);
}
