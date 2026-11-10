import { AsyncLocalStorage } from "node:async_hooks";
import { createHash } from "node:crypto";
import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const activeRender = new AsyncLocalStorage();
const cacheDir = ".cache/markdown";

function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function fileHash(file) {
  return hash(await readFile(file));
}

async function libraryFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const file = path.join(dir, entry.name);
      return entry.isDirectory() ? libraryFiles(file) : [file];
    }),
  );
  return files.flat();
}

async function pipelineHash() {
  const files = [...(await libraryFiles("lib")), "package-lock.json", "eleventy.config.js"].sort();
  const hashes = await Promise.all(files.map(async (file) => [file, await fileHash(file)]));
  return hash(JSON.stringify(hashes));
}

export function recordMarkdownImage(source, outputs) {
  activeRender.getStore()?.set(source, outputs);
}

async function readCachedMarkdown(file) {
  try {
    const cached = JSON.parse(await readFile(file, "utf8"));
    const valid = await Promise.all(
      cached.images.map(async ({ source, digest, outputs }) => {
        if ((await fileHash(source)) !== digest) return false;
        await Promise.all(outputs.map((output) => access(output)));
        return true;
      }),
    );
    return valid.every(Boolean) ? cached.result : null;
  } catch {
    return null;
  }
}

export async function createMarkdownCache() {
  const pipeline = await pipelineHash();
  const outputDir = path.resolve(process.env.OUTPUT_DIR || "_site");

  return async function cachedMarkdown({ content, kind, slug, sourceDir }, render) {
    const key = hash(JSON.stringify([pipeline, content, kind, slug, sourceDir, outputDir]));
    const file = path.join(cacheDir, `${key}.json`);
    const cached = await readCachedMarkdown(file);
    if (cached) return cached;

    const images = new Map();
    const result = await activeRender.run(images, render);
    const dependencies = await Promise.all(
      [...images].map(async ([source, outputs]) => ({
        source,
        digest: await fileHash(source),
        outputs,
      })),
    );
    await mkdir(cacheDir, { recursive: true });
    await writeFile(file, JSON.stringify({ result, images: dependencies }));
    return result;
  };
}
