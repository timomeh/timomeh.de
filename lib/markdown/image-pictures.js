import { visit } from "unist-util-visit";

const sizes = "(max-width: 640px) 100vw, 680px";

export function renderResponsiveImages() {
  return (tree) => {
    visit(tree, (parent) => {
      if (!parent.children) return;
      for (let index = 0; index < parent.children.length; index++) {
        const paragraph = parent.children[index];
        const image = paragraphImage(paragraph);
        if (!image) continue;

        const darkParagraph = paragraph.data?.darkParagraph;
        const darkImage = paragraphImage(darkParagraph);
        const light = image.data?.optimizedImage;
        const dark = darkImage?.data?.optimizedImage;
        if (!light || (darkParagraph && !dark)) continue;

        const styles = [
          `--image-placeholder: url('${light.placeholder}')`,
          `--image-width: ${light.width}px`,
        ];
        if (dark) {
          styles.push(
            `--image-placeholder-dark: url('${dark.placeholder}')`,
            `--image-width-dark: ${dark.width}px`,
          );
        }
        const properties = {
          ...paragraph.properties,
          className: ["ContentImage content-image"],
          style: styles.join("; "),
        };
        if (dark) delete properties["data-image-theme"];

        parent.children[index] = {
          type: "element",
          tagName: "div",
          properties,
          children: dark
            ? [pictureElement(image, light, "light"), pictureElement(darkImage, dark, "dark")]
            : [pictureElement(image, light)],
        };
        if (dark) {
          const next = parent.children.indexOf(darkParagraph, index + 1);
          parent.children.splice(index + 1, next - index);
        }
      }
    });
  };
}

export function paragraphImage(node) {
  return node?.type === "element" &&
    node.tagName === "p" &&
    node.children.length === 1 &&
    node.children[0].type === "element" &&
    node.children[0].tagName === "img"
    ? node.children[0]
    : null;
}

function pictureElement(image, info, theme) {
  const properties = {
    ...image.properties,
    src: info.src,
    ...(image.properties["data-src"] ? { "data-src": info.src } : {}),
    srcSet: info.srcset,
    sizes,
    width: info.width,
    height: info.height,
    loading: "lazy",
    decoding: "async",
    className: ["ContentImage-image"],
  };
  delete properties["data-image-theme"];
  return {
    type: "element",
    tagName: "picture",
    properties: theme
      ? { "data-image-theme": theme, className: ["ContentImage-picture"] }
      : { className: ["ContentImage-picture"] },
    children: [...(info.webp ? [sourceElement(info)] : []), { ...image, properties }],
  };
}

function sourceElement(info) {
  return {
    type: "element",
    tagName: "source",
    properties: {
      type: "image/webp",
      srcSet: info.webp,
      sizes,
      width: info.width,
      height: info.height,
    },
    children: [],
  };
}
