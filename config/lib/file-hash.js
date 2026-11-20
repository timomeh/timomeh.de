import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const hashes = new Map();

export function clearFileHashes() {
  hashes.clear();
}

export function hashFile(file) {
  if (!hashes.has(file)) {
    const result = readFile(file).then((contents) => createHash("sha256").update(contents).digest("hex"));
    hashes.set(file, result);
    result.catch(() => {
      if (hashes.get(file) === result) hashes.delete(file);
    });
  }
  return hashes.get(file);
}
