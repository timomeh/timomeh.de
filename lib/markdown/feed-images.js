import { visit } from "unist-util-visit";
import { imageoptim } from "../imageoptim.js";

export function prepareFeedContent(sourceDir) {
  return async (tree) => {
    const images = [];
    visit(tree, "element", (node, index, parent) => {
      if ((node.properties?.dataImageTheme || node.properties?.["data-image-theme"]) === "dark") {
        parent.children.splice(index, 1);
        return [visit.CONTINUE, index];
      }
      if (node.tagName === "h1") {
        parent.children.splice(index, 1);
        return [visit.CONTINUE, index];
      }
      if (node.tagName === "img") images.push(node);
    });
    await Promise.all(images.map(async (node) => {
      const image = await imageoptim(node.properties.src, sourceDir);
      if (image) node.properties.src = image.feed;
      node.properties = { src: node.properties.src, alt: node.properties.alt || "" };
    }));
  };
}
