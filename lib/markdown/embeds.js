import { SKIP, visit } from "unist-util-visit";

export function embedMedia() {
  return (tree) => {
    visit(tree, "paragraph", (node, index, parent) => {
      if (!parent || index === undefined || node.children.length !== 1) return;
      const child = node.children[0];
      const url =
        child.type === "text"
          ? child.value.trim()
          : child.type === "link" &&
              child.children.length === 1 &&
              child.children[0].type === "text" &&
              child.children[0].value === child.url
            ? child.url
            : null;
      let parsedUrl;
      try {
        parsedUrl = new URL(url);
      } catch {
        return;
      }
      if (
        !["http:", "https:"].includes(parsedUrl.protocol) ||
        parsedUrl.username ||
        parsedUrl.password
      )
        return;

      let embed;
      switch (detectPlatform(parsedUrl)) {
        case "youtube":
          embed = youtubeEmbed(parsedUrl);
          break;
        case "spotify":
          embed = spotifyEmbed(parsedUrl);
          break;
        case "vimeo":
          embed = vimeoEmbed(parsedUrl);
          break;
        case "soundcloud":
          embed = soundcloudEmbed(parsedUrl);
          break;
        default:
          return;
      }
      if (!embed) return;

      const iframe = element("iframe", [], {
        src: embed.src,
        title: `${embed.provider} embed`,
        loading: "lazy",
        allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
        allowFullScreen: true,
        referrerPolicy: "strict-origin-when-cross-origin",
        className: "Embed-iframe",
        "data-embed-kind": embed.kind,
      });
      parent.children[index] = element("div", [iframe], {
        className: ["Embed", "embed"],
        "data-embed-kind": embed.kind,
      });
      return SKIP;
    });
  };
}

const element = (name, children = [], properties = {}) => ({
  type: "blogElement",
  data: { hName: name, hProperties: properties },
  children,
});

function detectPlatform(url) {
  const host = url.hostname;
  if (
    ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtu.be"].includes(host)
  )
    return "youtube";

  if (host === "open.spotify.com") return "spotify";

  if (["vimeo.com", "www.vimeo.com", "player.vimeo.com"].includes(host)) return "vimeo";

  if (["soundcloud.com", "www.soundcloud.com"].includes(host)) return "soundcloud";

  return null;
}

function youtubeEmbed(url) {
  const [path, pathId] = url.pathname.split("/").filter(Boolean);
  let id;
  if (url.hostname.endsWith("youtu.be")) id = path;
  else if (path === "watch") id = url.searchParams.get("v");
  else if (["shorts", "embed", "live"].includes(path)) id = pathId;
  if (!id || !/^[\w-]{11}$/.test(id)) return null;

  const params = new URLSearchParams();
  const time = url.searchParams.get("t") || url.searchParams.get("start");
  const duration = time?.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (time && /^\d+$/.test(time)) params.set("start", time);
  else if (duration) {
    const [, hours = 0, minutes = 0, seconds = 0] = duration;
    params.set("start", String(hours * 3600 + minutes * 60 + Number(seconds)));
  }
  const list = url.searchParams.get("list");
  if (list && /^[\w-]+$/.test(list)) params.set("list", list);

  return {
    provider: "YouTube",
    kind: "video",
    src: `https://www.youtube-nocookie.com/embed/${id}${params.size ? `?${params}` : ""}`,
  };
}

function spotifyEmbed(url) {
  const parts = url.pathname.split("/").filter(Boolean);
  if (/^intl-[a-z]{2}(?:-[a-z]{2})?$/i.test(parts[0] || "")) parts.shift();
  const [type, id] = parts;
  if (
    !["track", "album", "artist", "playlist", "episode", "show"].includes(type) ||
    !/^[a-zA-Z0-9]{22}$/.test(id || "") ||
    parts.length !== 2
  )
    return null;

  return {
    provider: "Spotify",
    kind: type === "track" || type === "episode" ? "compact" : "audio",
    src: `https://open.spotify.com/embed/${type}/${id}`,
  };
}

function vimeoEmbed(url) {
  const [path, pathId] = url.pathname.split("/").filter(Boolean);
  const id = url.hostname === "player.vimeo.com" && path === "video" ? pathId : path;
  if (!/^\d+$/.test(id || "")) return null;
  return { provider: "Vimeo", kind: "video", src: `https://player.vimeo.com/video/${id}?dnt=1` };
}

function soundcloudEmbed(url) {
  if (url.pathname.split("/").filter(Boolean).length < 2) return null;
  const source = `https://soundcloud.com${url.pathname}`;
  return {
    provider: "SoundCloud",
    kind: "compact",
    src: `https://w.soundcloud.com/player/?${new URLSearchParams({ url: source })}`,
  };
}
