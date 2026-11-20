export function readingTime(content, override) {
  if (override) {
    return Number.isFinite(Number(override)) ? `${override} minute read` : String(override);
  }
  const minutes = Math.max(1, Math.round(content.trim().split(/\s+/).length / 200));
  return `${minutes} minute read`;
}
