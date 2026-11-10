import { createHash } from "node:crypto";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { hashFile } from "./file-hash.js";

const cacheDir = ".cache/content-images";

export async function cachedImage(source, generate) {
  const keyData = await Promise.all([
    hashFile(source),
    hashFile("lib/imageoptim.js"),
    hashFile("lib/image-cache.js"),
    hashFile("package-lock.json"),
  ]);
  const key = createHash("sha256")
    .update(JSON.stringify([source, path.resolve(process.env.OUTPUT_DIR || "_site"), process.version, keyData]))
    .digest("hex");
  const file = path.join(cacheDir, `${key}.json`);
  try {
    const cached = JSON.parse(await readFile(file, "utf8"));
    await Promise.all(cached.outputs.map((output) => access(output)));
    return cached;
  } catch {
    const result = await generate();
    await mkdir(cacheDir, { recursive: true });
    await writeFile(file, JSON.stringify(result));
    return result;
  }
}
