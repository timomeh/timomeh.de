import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";

export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [react(), keystatic()],
});
