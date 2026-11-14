import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";

// This is evaluated at build time, not when the standalone server starts.
const origin = process.env.SITE_URL ? new URL(process.env.SITE_URL) : null;

// Keystatic's default page has no <head>, so Astro cannot inject editor styles.
const keystaticIntegration = keystatic();
const setupKeystatic = keystaticIntegration.hooks["astro:config:setup"];
keystaticIntegration.hooks["astro:config:setup"] = (options) =>
  setupKeystatic({
    ...options,
    injectRoute(route) {
      options.injectRoute(
        route.pattern === "/keystatic/[...params]"
          ? { ...route, entrypoint: "./keystatic-page.astro" }
          : route,
      );
    },
  });

export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [react(), keystaticIntegration],
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
