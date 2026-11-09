import { visit } from "unist-util-visit";

// Marks external links by adding an icon to it
export function addExternalLinkIcons() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName !== "a" || typeof node.properties.href !== "string") return;
      let url;
      try {
        url = new URL(node.properties.href, "https://timomeh.de");
      } catch {
        return;
      }
      if (
        !["http:", "https:"].includes(url.protocol) ||
        ["timomeh.de", "www.timomeh.de"].includes(url.hostname)
      )
        return;
      if (
        !node.children.some((child) =>
          child.type === "text" ? child.value.trim() : child.tagName !== "img",
        )
      )
        return;

      node.properties.className = [...(node.properties.className || []), "u-externalLink"];
      node.children.push({
        type: "element",
        tagName: "svg",
        properties: {
          viewBox: "0 0 24 24",
          fill: "none",
          className: ["u-externalLink-icon"],
          role: "img",
          ariaLabel: "External link",
        },
        children: [
          iconPath("M10 6V8H6V18H16V14H18V20H4V6H10Z"),
          {
            type: "element",
            tagName: "g",
            properties: { className: ["u-externalLink-arrow"] },
            children: [
              iconPath("M12 14H10V12H12V14Z"),
              iconPath("M14 12H12V10H14V12Z"),
              iconPath("M16 10H14V8H16V10Z"),
              iconPath("M20 4V12H18V8H16V6H12V4H20Z"),
            ],
          },
        ],
      });
    });
  };
}

const iconPath = (d) => ({
  type: "element",
  tagName: "path",
  properties: { d, fill: "currentColor" },
  children: [],
});
