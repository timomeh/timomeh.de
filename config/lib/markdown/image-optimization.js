import { visit } from "unist-util-visit";
import { imageoptim } from "../imageoptim.js";

export function optimizeImages(sourceDir) {
  return async (tree) => {
    const images = [];
    visit(tree, "element", (node) => {
      if (node.tagName === "img") images.push(node);
    });
    await Promise.all(images.map(async (node) => {
      node.data ||= {};
      node.data.source = node.properties.src;
      const image = await imageoptim(node.properties.src, sourceDir);
      if (!image) return;
      node.data.optimizedImage = image;
      node.properties.src = image.src;
      if (node.properties["data-src"]) node.properties["data-src"] = image.src;
    }));
  };
}
