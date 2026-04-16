# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Full agent instructions are in [AGENTS.md](./AGENTS.md). This file adds Claude Code-specific context on top of it.

## Commands

```bash
npm install                                                        # install deps
npx -y @adobe/aem-cli up --no-open --forward-browser-logs        # dev server (run in background)
npm run lint                                                       # lint JS + CSS
npm run lint:fix                                                   # auto-fix lint issues
```

Dev server at `http://localhost:3000`. Use `--html-folder drafts` to serve local test HTML:
```bash
npx -y @adobe/aem-cli up --no-open --forward-browser-logs --html-folder drafts
```

## Project-Specific Architecture

This site has diverged from the boilerplate baseline in these ways:

### Themes system (`styles/themes/`)
Pages opt into a theme via page metadata (`theme: careers`). `scripts.js:loadTheme()` loads the matching CSS file. One themes exist: `careers.css`. Theme CSS overrides `:root` CSS custom properties and can target `body.{theme}` for block-level overrides (e.g. `body.careers .hero`).

### Button decoration (`scripts.js:decorateButtons`)
This project uses a **custom** `decorateButtons` — not the boilerplate version. Links are only promoted to buttons when wrapped in `**strong**` or `*em*` formatting:
- `**bold link**` → `.button.primary`
- `*italic link*` → `.button.secondary`
- `***bold+italic link***` → `.button.accent` (high-impact CTA)

Plain links are never auto-buttonized.

### Hero block (`blocks/hero/`)
Auto-blocked via `buildHeroBlock()` in `scripts.js` when a `<picture>` precedes an `<h1>`. The block separates the picture (full-bleed background, `position: absolute`) from text content (`.hero-content`). The `careers` theme overrides this with a split-screen layout (image right 58.4%, text left 41.6% with a gradient bleed).

### Columns block (`blocks/columns/`)
Detects a **card pattern** automatically: if every column in every row starts with an image `<p>` and has additional content, it adds `.columns-cards` and restructures into `.columns-card-image`, `.columns-card-body`, `.columns-card-action` divs. No author opt-in required.

### Fragment auto-blocking (`scripts.js:buildAutoBlocks`)
Links matching `/fragments/` are auto-replaced inline with the fragment content — authors don't need to use an explicit Fragment block.

## CSS Conventions

- Breakpoints: `600px` (tablet), `900px` (desktop), `1200px` (wide) — mobile-first `min-width`
- All block selectors scoped: `.blockname .child`, never bare `.child`
- Do not use `.blockname-container` or `.blockname-wrapper` (reserved by AEM section decoration)
- CSS custom properties for tokens defined in `:root` in `styles/styles.css`; themes override these on `body`

## Repo identity

```bash
gh repo view --json nameWithOwner   # → owner/repo for constructing preview URLs
```

Preview URL pattern: `https://{branch}--{repo}--{owner}.aem.page/`
