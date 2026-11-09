import path from "node:path";

export const contentDir = path.resolve(process.env.CONTENT_DIR || "../timomeh.de-content");
export const site = process.env.SITE_URL || "https://timomeh.de";
