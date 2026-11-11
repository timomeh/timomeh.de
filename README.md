# [timomeh.de](https://timomeh.de)

Source code for [timomeh.de](https://timomeh.de). Stack:

- [Eleventy](https://www.11ty.dev/)
- Content stored in a separate (private) GitHub Repo
- no compilers, no bundlers, no 3rd party package managers

I'm sick of taming dependencies, security issues, and upgrade paths to maintain a blog. So I'm using plain CSS, vanilla JavaScript, and only a few dependencies.

> **Philosophy:** While I like technology like TypeScript, TailwindCSS, oxlint, oxfmt, pnpm, and so on, you don't always need them. My code editor has linting and formatting built-in, npm does the job just as well for the few dependencies I have, and for the few JavaScript islands that I have, I don't need a compiler or bundler.

- [Development](#development)
- [Code Guidelines](#code-guidelines)
  - [CSS](#css)
  - [JavaScript](#javascript)
- [Repo Structure](#repo-structure)
  - [CMS](#cms)
  - [Deployer](#deployer)
- [Deploy manually](#deploy-manually)

## Development

- Requires Node.js (`mise install`)
- Requires the content repository to be checked out at `../timomeh.de-content`

```sh
npm install
npm start
```

## Code Guidelines

There are no linters and formatters. I've got a linter and formatter in my code editor.

### CSS

CSS uses my own flavor of [SUIT CSS](https://suitcss.github.io/).

- UI components are built as CSS classes.
- UI components should behave like they're isolated. One component shouldn't affect another component.
- There should be a blank line between each declaration block.
- No dynamic class concatenation in HTML (like `classNames()` or `clsx()` does in JSX). For variants, I'm using data attributes, which removes the need for class concatenation.
- I don't always follow these rules strictly, but try to.

```css
/* Components, one per file */
.MyComponent {
}
.MyComponent--staticVariant {
}
.MyComponent-someElement {
}
.MyComponent-someElement--staticVariant {
}
.MyComponent-someElement[data-dynamic-variant="something"] {
}
.MyComponent-someElement:pseudo {
}

/* Utilities, all in one _utilities.css file */
.u-someThing {
}
.u-someThing--staticVariant {
}
.u-someThing[data-dynamic-variant="something"] {
}
.u-someThing:pseudo {
}

/* Example anti-patterns, do not do these: */
.MyComponent .SomeOtherComponent {
}
.MyComponent-someElement .SomeOtherComponent {
}
.MyComponent-someElement.SomeOtherComponent {
}
.MyComponent-someElement .MyComponent-anotherElement {
}
.MyComponent .u-someThing {
}
.u-someThing-element {
}
.u-someThing .MyComponent {
}
```

### JavaScript

There's no module bundler or compiler. Just plain unminified vanilla JS. All client-side JS files are concatenated into a single file. To make sure there are no overspill between files, each file is wrapped into an IIFE.

- Use Custom Elements wherever possible
- Use modern web tech where possible

## Repo Structure

- `src/` is the actual Eleventy blog (templates, CSS, JS, assets)
- `lib/` are eleventy-related libs (TODO: probably should be inside src)
- `cms/` is the standalone CMS
- `deployer/` is a small service that watches for content changes, then rebuilds and deploys them

### CMS

I'm using [Keystatic](https://keystatic.com) as a CMS. I like editing content visually in a browser, also on the go, and not in an editor.

Inside `cms/`, I'm hosting Keystatic separately as a small astro server. I chose astro because its footprint in my codebase is the smallest. It's dependencies are fully separate, and won't be installed when you run `npm install` in the root directory. To run it locally:

```sh
cd cms
npm install
npm run dev
```

> **Philosophy:** If I don't want this CMS anymore, I could just delete the `cms/` folder and nothing would change, other than the fact that I don't have this CMS anymore. I could still change content in the repo, and it would still auto-deploy.

### Deployer

The small service under `deployer/` is watching for content changes, rebuilds and uploads the static site.

I don't want to wait for a whole CI run after I fix a typo. Waiting for a worker, installing dependencies, and doing a fresh build... it all takes way too long just to fix a typo. I want it to be refreshed in 5 seconds, not 5 minutes.

> **Philosophy:** If I don't want this builder/deployer anymore, I could just delete the `deployer/` folder and nothing would change, other than the fact that I don't have the same auto-deploy behavior anymore. I could still manually trigegr a build and deploy, or use another way.

#### Getting rid of old output

The deployer keeps the `_site` folder (the generated site) between builds in the container to speed up image generator. But old pages and images can remain publicly available until a fresh build.

To get rid of those leftovers, trigger a fresh build inside the deployer:

```sh
/bin/sh /app/deployer/fresh-build.sh
```

This removes `_site`, rebuilds, and publishes the site. I also run it in a cron so it eventually cleans up leftover artifacts.

## Deploy manually

Make sure the checked out content repo is up-to-date.

```sh
rm -rf _site
npm run build
SITE_URL=https://timomeh.de GIT_PAGES_PASSWORD=... bash scripts/deploy.sh
```
