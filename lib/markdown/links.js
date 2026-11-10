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

      node.properties.target = "_blank";
      node.properties.rel = ["noopener", "noreferrer"];
      if (
        !node.children.some((child) =>
          child.type === "text" ? child.value.trim() : child.tagName !== "img",
        )
      )
        return;

      node.properties.className = [...(node.properties.className || []), "ExternalLink"];
      const icon = {
        type: "element",
        tagName: "svg",
        properties: {
          viewBox: "0 0 24 24",
          fill: "none",
          className: ["ExternalLink-icon"],
          role: "img",
          ariaLabel: "External link",
        },
        children: [
          iconPath("M10 6V8H6V18H16V14H18V20H4V6H10Z"),
          {
            type: "element",
            tagName: "g",
            properties: { className: ["ExternalLink-arrow"] },
            children: [
              iconPath("M12 14H10V12H12V14Z"),
              iconPath("M14 12H12V10H14V12Z"),
              iconPath("M16 10H14V8H16V10Z"),
              iconPath("M20 4V12H18V8H16V6H12V4H20Z"),
            ],
          },
        ],
      };
      appendIcon(node, icon);
    });
  };
}

const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" });

// Keep the icon attached to the final character without making long words unbreakable.
function appendIcon(node, icon) {
  const children = node.children;
  let index = children.length - 1;
  while (index >= 0 && children[index].type === "text" && !children[index].value.trim()) index--;
  const last = children[index];
  if (last?.type === "text") {
    const match = last.value.match(/^(.*?)(\S+)(\s*)$/su);
    if (match) {
      const [, prefix, word, suffix] = match;
      const segments = [...graphemes.segment(word)];
      const lastCharacter = segments[segments.length - 1];
      const replacement = [];
      const text = prefix + word.slice(0, lastCharacter.index);
      if (text) replacement.push({ type: "text", value: text });
      replacement.push({
        type: "element",
        tagName: "span",
        properties: { className: ["ExternalLink-end"] },
        children: [{ type: "text", value: lastCharacter.segment }, icon],
      });
      if (suffix) replacement.push({ type: "text", value: suffix });
      children.splice(index, 1, ...replacement);
      return;
    }
  }
  if (last?.type === "element" && last.children?.length) {
    appendIcon(last, icon);
    return;
  }
  if (last) {
    children.splice(index, 1, {
      type: "element",
      tagName: "span",
      properties: { className: ["ExternalLink-end"] },
      children: [last, icon],
    });
  } else {
    children.push(icon);
  }
}

const iconPath = (d) => ({
  type: "element",
  tagName: "path",
  properties: { d, fill: "currentColor" },
  children: [],
});
