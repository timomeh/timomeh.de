import { visit } from "unist-util-visit";

export function enableImageLightbox(scope) {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "img") return;
      node.properties.loading ||= "lazy";
      node.properties.decoding ||= "async";
      if (!scope || parent?.tagName === "a" || !node.properties.src) return;

      node.properties["data-fancybox"] = `post-${scope}-media`;
      node.properties["data-src"] = node.properties.src;
      node.properties.tabIndex = 0;
      node.properties.role = "button";
      node.properties.ariaLabel = node.properties.alt
        ? `Open image: ${node.properties.alt}`
        : "Open image";
    });
  };
}
