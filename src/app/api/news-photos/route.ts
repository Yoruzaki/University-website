import { auth } from "@/auth";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return new Response(null, { status: 401 });
  if (!["SUPER_ADMIN", "EDITOR"].includes((session.user as { role?: string }).role ?? "")) return new Response(null, { status: 403 });
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) return new Response(null, { status: 403 });
  const limit = 8 * 1024 * 1024;
  if (Number(request.headers.get("content-length")) > limit) return new Response(null, { status: 413 });
  if (!request.body) return new Response(null, { status: 400 });
  const chunks: Uint8Array[] = [];
  const reader = request.body.getReader();
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > limit) {
      await reader.cancel();
      return new Response(null, { status: 413 });
    }
    chunks.push(value);
  }
  const input = Buffer.concat(chunks);
  let photo: Buffer;
  try {
    const decoder = sharp(input, { limitInputPixels: 50000000 });
    const { format } = await decoder.metadata();
    if (!["jpeg", "png", "webp"].includes(format ?? "")) return new Response(null, { status: 415 });
    photo = await decoder.rotate().resize({ width: 2000, withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
  } catch {
    return new Response(null, { status: 415 });
  }
  const name = randomUUID() + ".webp";
  const directory = path.join(process.cwd(), "data", "news-photos");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, name), photo);
  return Response.json({ url: "/api/news-photos/" + name });
}
