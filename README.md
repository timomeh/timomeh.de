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

CSS uses custom elements as UI components, together with some global utilities. Custom elements have only have scoped styling and by default cannot leak into other components. The custom elements work without JavaScript, and most of them have no interactivity anyways.

```html
<div class="u-someUtility">
  <link rel="stylesheet" href="src/components/some-component.css" />
  <blog-some-component data-component>
    <h2>Foo bar!</h2>

    <link rel="stylesheet" href="src/components/nested-component.css" />
    <blog-nested-component data-component>...</blog-nested-component>
  </blog-some-component>
</div>
```

```css
@layer components {
  @scope (blog-some-component) to ([data-component]) {
    :scope {
      /* Styles for the component root. */
    }

    h2 {
      /* Any selectors within the component. */
      /* These styles are scoped to this component. */
      /* It will not leak into nested components who also have a h2,
         due to the `to ([data-component])` scope limit. */

      @container style(--some-component-size: large) {
        /* Allows you to use CSS variables as an interface for variants */
      }
    }
  }
}
```

- Custom components have no semantic roles: they don't replace a button or a section. Instead, any semantic elements are wrapped outside of the component, or used inside it (depending on what makes sense).
- All custom element components have a `data-component` attribute. In combination with the `to (<scope-end>)` scope limit, this effectively results in style isolation.
- Each component ships its own css file.
- Each component has a `<link>` element to load its CSS. This effectively causes that CSS is only loaded when it's actually needed. 11ty automatically puts them into the `<head>` of the page.
- Use CSS variables and `@container style()` queries to define variants of a component. CSS variables inherit into the scoped component. So it's basically an interface into a scoped component.
- Because we ship many CSS files instead of one large CSS file, changing the styling of one component doesn't invalidate the cache of all other CSS files.

### JavaScript

There's no module bundler or compiler. Just plain unminified vanilla JS modules, and a few vendored libraries as umd.

In theory, I could only load these files when they're actually used. In practice, I currently don't have any interactivity that's only used on certain pages.

## Repo Structure

- `src/` is the actual Eleventy blog (templates, CSS, JS, assets)
- `config/` contains Eleventy plugins and shared build code in `config/lib/`
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
