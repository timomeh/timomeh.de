import { visit } from "unist-util-visit";
import { paragraphImage } from "./image-pictures.js";

export function markImageThemes() {
  return (tree) => {
    visit(tree, "image", (node, index, parent) => {
      const filename = node.url.split(/[?#]/)[0].split("/").pop();
      const theme = filename.startsWith("darkmode-")
        ? "dark"
        : filename.startsWith("lightmode-")
          ? "light"
          : null;
      if (!theme) return;

      node.data ||= {};
      node.data.hProperties = { ...node.data.hProperties, "data-image-theme": theme };
      if (parent?.type === "paragraph" && parent.children.length === 1) {
        parent.data ||= {};
        parent.data.hProperties = { ...parent.data.hProperties, "data-image-theme": theme };
      }
    });
  };
}

export function pairThemeImages() {
  return (tree) => {
    visit(tree, (parent) => {
      if (!parent.children) return;
      for (let index = 0; index < parent.children.length; index++) {
        const paragraph = parent.children[index];
        const light = paragraphImage(paragraph);
        if (!light) continue;

        let next = index + 1;
        while (parent.children[next]?.type === "text" && !parent.children[next].value.trim()) next++;
        const dark = paragraphImage(parent.children[next]);
        const lightSrc = light.data?.source;
        const darkSrc = dark?.data?.source;
        if (
          light.properties.alt === dark?.properties.alt &&
          typeof lightSrc === "string" &&
          /(^|\/)lightmode-/.test(lightSrc) &&
          lightSrc.replace(/(^|\/)lightmode-/, "$1darkmode-") === darkSrc
        ) {
          paragraph.data ||= {};
          paragraph.data.darkParagraph = parent.children[next];
        }
      }
    });
  };
}
