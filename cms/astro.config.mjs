import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";

// This is evaluated at build time, not when the standalone server starts.
const origin = process.env.SITE_URL ? new URL(process.env.SITE_URL) : null;

export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [react(), keystatic()],
  security: {
    allowedDomains: [
      { hostname: "127.0.0.1", protocol: "http" },
      { hostname: "localhost", protocol: "http" },
      ...(origin
        ? [
            {
              hostname: origin.hostname,
              protocol: origin.protocol.slice(0, -1),
              ...(origin.port ? { port: origin.port } : {}),
            },
          ]
        : []),
    ],
  },
});
