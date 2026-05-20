# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

MV3 browser extension that auto-clicks "Skip Intro" / "Skip Credits" / "Skip Recap" on Netflix and Plex. Ships to both Chrome Web Store and Firefox Add-ons (AMO) from a single build.

## Architecture

The whole extension is one content script (`src/content.ts`) — no background/service worker, no popup. `build.mjs` bundles it.

- `getPlatform()` detects Netflix vs Plex from hostname; a `MutationObserver` on `document.body` then clicks skip buttons as they appear.
- Netflix uses CSS selectors (`button[data-uia=...]`); Plex finds buttons by visible text. Plex "Skip Credits" dispatches a synthetic Shift+RightArrow keydown instead of clicking.

## Project-specific rules

- Content scripts cannot use ES modules — esbuild MUST output `format: "iife"`.
- `npm run typecheck` only checks; esbuild does the actual compilation. There is no test suite locally; CI runs tests via the shared `node-test.yml` workflow.
- The `content_scripts.matches` list in `src/manifest.json` and the hostname checks in `getPlatform()` MUST stay in sync — changing one without the other breaks platform detection.
- Hostname checks use exact `===` matching, never `.includes()`, to avoid the CodeQL `js/incomplete-url-substring-sanitization` finding.
- Plex's default local port is `32400`; the `127.0.0.1`/`localhost` match requires `location.port === "32400"`.
- `src/manifest.json` keeps `version: "0.0.0"` in the repo. The Release workflow derives the next version from the latest `v*` git tag, injects it at build time, and pushes only a tag back — it never commits to `main`.
