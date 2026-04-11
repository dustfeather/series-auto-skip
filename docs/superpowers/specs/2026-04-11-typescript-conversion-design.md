# TypeScript Conversion + Docs

## Overview

Convert the series-auto-skip Chrome extension from JavaScript to TypeScript, adding a build pipeline with esbuild and a Jekyll/Markdown documentation site for GitHub Pages.

## Directory Structure

```
series-auto-skip/
├── src/
│   ├── content.ts          # TypeScript source (replaces content.js)
│   ├── manifest.json       # copied to dist during build
│   ├── icon16.png          # copied to dist during build
│   ├── icon48.png
│   └── icon128.png
├── dist/                   # build output (gitignored)
├── docs/                   # GitHub Pages site (Jekyll/Markdown)
│   ├── _config.yml         # Jekyll config
│   └── index.md            # Main page: install, usage, supported platforms
├── tsconfig.json
├── package.json
└── ...
```

## Build Pipeline

**Dependencies:** `esbuild` (bundler), `typescript` (type checking only).

**Scripts:**

- `npm run build` — esbuild compiles `src/content.ts` → `dist/content.js`, then copies `manifest.json` and icons to `dist/`.
- `npm run watch` — esbuild in watch mode for development.
- `npm run typecheck` — `tsc --noEmit` for type checking (esbuild does not type-check).

## TypeScript Configuration

- `strict: true`
- Target: ES2020 (modern browser baseline)
- Lib: ES2020 + DOM
- esbuild handles emit; `tsc` is used only for type checking (`noEmit: true`)

## Code Changes

Rename `content.js` → `content.ts` and add types. No logic changes.

- Platform type: `type Platform = "netflix" | "plex"`
- Options interface: `interface EnabledOptions { skipIntro: boolean; skipCredits: boolean; }`
- Typed selectors map with `Record` or interface
- DOM query results handled with null checks (already present in existing code)

## CI Workflow Changes

Update `.github/workflows/bump-and-release.yml`:

- Add Node.js setup step (`actions/setup-node`)
- Add `npm ci` to install dependencies
- Add `npm run build` before packaging
- Change zip commands to package `dist/` instead of `src/`

## Documentation (GitHub Pages)

- Jekyll/Markdown site in `docs/` folder
- `_config.yml` with project name and theme
- `index.md` with: what the extension does, install instructions, supported platforms, usage notes
- GitHub Pages serves from `docs/` on `main` branch

## .gitignore

Already covers `dist/` and `node_modules/`. No changes needed.
