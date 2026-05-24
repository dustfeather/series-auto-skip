# CLAUDE.md

MV3 browser extension auto-clicking "Skip Intro" / "Skip Credits" / "Skip Recap" on Netflix + Plex. Ships to CWS + AMO from single build.

## Architecture

Whole extension = one content script (`src/content.ts`) — no background/SW, no popup. `build.mjs` bundles.

- `getPlatform()` detects Netflix vs Plex from hostname; `MutationObserver` on `document.body` clicks skip buttons as they appear.
- Netflix: CSS selectors (`button[data-uia=...]`). Plex: buttons by visible text. Plex "Skip Credits" dispatches synthetic Shift+RightArrow keydown instead of clicking.

## Project rules

- Content scripts cannot use ES modules — esbuild MUST output `format: "iife"`.
- `npm run typecheck` only checks; esbuild does compilation. No local tests; CI runs tests via shared `node-test.yml`.
- `content_scripts.matches` in `src/manifest.json` AND hostname checks in `getPlatform()` MUST stay in sync — changing one breaks platform detection.
- Hostname checks use exact `===`, never `.includes()` — avoids CodeQL `js/incomplete-url-substring-sanitization`.
- Plex default local port = `32400`; `127.0.0.1`/`localhost` match requires `location.port === "32400"`.
- `src/manifest.json` keeps `version: "0.0.0"` in repo. Release workflow derives next version from latest `v*` git tag, injects at build, pushes tag only — never commits to `main`.
