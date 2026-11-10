const enabled = process.env.BUILD_TIMING === "1";
const measurements = new Map();

export async function timeBuildStage(name, run) {
  if (!enabled) return run();

  const start = performance.now();
  try {
    return await run();
  } finally {
    const measurement = measurements.get(name) || { count: 0, ms: 0 };
    measurement.count++;
    measurement.ms += performance.now() - start;
    measurements.set(name, measurement);
  }
}

export function reportBuildTiming() {
  if (!enabled || measurements.size === 0) return;

  console.log("\nBuild timings (summed elapsed time; concurrent and nested stages overlap):");
  for (const [name, { count, ms }] of measurements) {
    console.log(`  ${name}: ${(ms / 1000).toFixed(2)}s (${count} calls)`);
  }
  measurements.clear();
}
