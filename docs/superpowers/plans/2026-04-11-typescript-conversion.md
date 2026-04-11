# TypeScript Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the series-auto-skip Chrome extension from JavaScript to TypeScript with esbuild, and add a Jekyll/Markdown docs site.

**Architecture:** Source TypeScript lives in `src/`, esbuild compiles to `dist/` which becomes the extension package. A `build.mjs` script handles compilation and static file copying. Jekyll docs in `docs/` serve via GitHub Pages.

**Tech Stack:** TypeScript, esbuild, Node.js, Jekyll/Markdown

---

### Task 1: Initialize npm project and install dependencies

**Files:**
- Create: `package.json`

- [ ] **Step 1: Initialize package.json**

Run:
```bash
cd /home/dustfeather/projects/series-auto-skip
npm init -y
```

Then edit `package.json` to clean it up — set the name, remove the `main` field (not needed for a browser extension), and mark it private:

```json
{
  "name": "series-auto-skip",
  "version": "1.0.0",
  "private": true,
  "scripts": {},
  "devDependencies": {}
}
```

- [ ] **Step 2: Install dev dependencies**

Run:
```bash
npm install --save-dev esbuild typescript
```

Expected: `node_modules/` created, `package-lock.json` generated, `devDependencies` updated in `package.json`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: initialize npm project with esbuild and typescript"
```

---

### Task 2: Add TypeScript configuration

**Files:**
- Create: `tsconfig.json`

- [ ] **Step 1: Create tsconfig.json**

Create `tsconfig.json` in the project root with this exact content:

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "noEmit": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*.ts"]
}
```

Key decisions:
- `noEmit: true` — esbuild handles output, tsc is only for type checking
- `moduleResolution: "bundler"` — matches esbuild's resolution behavior
- `lib` includes `DOM` and `DOM.Iterable` for browser APIs and `Array.from`

- [ ] **Step 2: Commit**

```bash
git add tsconfig.json
git commit -m "chore: add tsconfig.json with strict mode"
```

---

### Task 3: Create build script and npm scripts

**Files:**
- Create: `build.mjs`
- Modify: `package.json` (add scripts)

- [ ] **Step 1: Create build.mjs**

Create `build.mjs` in the project root:

```javascript
import * as esbuild from "esbuild";
import { cpSync, mkdirSync } from "fs";

mkdirSync("dist", { recursive: true });

for (const file of [
  "manifest.json",
  "icon16.png",
  "icon48.png",
  "icon128.png",
]) {
  cpSync(`src/${file}`, `dist/${file}`);
}

await esbuild.build({
  entryPoints: ["src/content.ts"],
  bundle: true,
  outfile: "dist/content.js",
  format: "iife",
  target: ["es2020"],
});

console.log("Build complete");
```

This script:
1. Creates `dist/` if it doesn't exist
2. Copies static files (manifest, icons) from `src/` to `dist/`
3. Compiles `src/content.ts` → `dist/content.js` as an IIFE (content scripts can't use modules)

- [ ] **Step 2: Add npm scripts to package.json**

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "build": "node build.mjs",
    "watch": "esbuild src/content.ts --bundle --outfile=dist/content.js --format=iife --target=es2020 --watch",
    "typecheck": "tsc --noEmit"
  }
}
```

- `build` — full build (compile + copy static files)
- `watch` — esbuild watch mode for fast TS iteration (static files only change on full build)
- `typecheck` — type checking only, no output

- [ ] **Step 3: Commit**

```bash
git add build.mjs package.json
git commit -m "chore: add esbuild build script and npm scripts"
```

---

### Task 4: Convert content.js to content.ts

**Files:**
- Create: `src/content.ts`
- Delete: `src/content.js`

- [ ] **Step 1: Create src/content.ts**

Create `src/content.ts` with the typed version of the content script. This is a direct conversion — same logic, added types:

```typescript
type Platform = "netflix" | "plex";

interface EnabledOptions {
  skipIntro: boolean;
  skipCredits: boolean;
}

interface SkipSelectors {
  intro: string;
  credits: string;
}

const skipSelectors: Record<string, SkipSelectors> = {
  netflix: {
    intro: 'button[data-uia="player-skip-intro"]',
    credits: 'button[data-uia="player-skip-recap"]',
  },
};

function getPlatform(): Platform | null {
  if (location.hostname.includes("netflix.com")) return "netflix";
  if (
    location.hostname.includes("plex.tv") ||
    location.hostname === "127.0.0.1"
  )
    return "plex";
  return null;
}

function autoSkip(platform: Platform, enabledOptions: EnabledOptions): void {
  const observer = new MutationObserver(() => {
    if (platform === "netflix") {
      if (enabledOptions.skipIntro) {
        const introBtn =
          document.querySelector<HTMLButtonElement>(
            skipSelectors.netflix.intro,
          );
        if (introBtn) introBtn.click();
      }
      if (enabledOptions.skipCredits) {
        const creditsBtn =
          document.querySelector<HTMLButtonElement>(
            skipSelectors.netflix.credits,
          );
        if (creditsBtn) creditsBtn.click();
      }
    } else if (platform === "plex") {
      if (enabledOptions.skipIntro) {
        const btn = findButtonByText("Skip Intro");
        if (btn) btn.click();
      }
      if (enabledOptions.skipCredits) {
        const creditsBtn = findButtonByText("Skip Credits");
        if (creditsBtn && !creditsBtn.dataset.autoskipped) {
          simulateShiftRightArrow();
          creditsBtn.dataset.autoskipped = "true";
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function simulateShiftRightArrow(): void {
  const event = new KeyboardEvent("keydown", {
    key: "ArrowRight",
    code: "ArrowRight",
    keyCode: 39,
    which: 39,
    shiftKey: true,
    bubbles: true,
    cancelable: true,
  } as KeyboardEventInit);

  console.log("[AutoSkip] Dispatching Shift + Right Arrow keydown");
  document.dispatchEvent(event);
}

function waitForBodyAndInit(
  platform: Platform,
  enabledOptions: EnabledOptions,
): void {
  if (document.body) {
    autoSkip(platform, enabledOptions);
  } else {
    const checkReady = setInterval(() => {
      if (document.body) {
        clearInterval(checkReady);
        autoSkip(platform, enabledOptions);
      }
    }, 100);
  }
}

function findButtonByText(text: string): HTMLButtonElement | undefined {
  const buttons = Array.from(
    document.querySelectorAll<HTMLButtonElement>("button"),
  );
  return buttons.find(
    (btn) => btn.textContent?.trim().toLowerCase() === text.toLowerCase(),
  );
}

const platform = getPlatform();
if (platform) {
  waitForBodyAndInit(platform, {
    skipIntro: true,
    skipCredits: true,
  });
}
```

Key type changes from the original JS:
- `KeyboardEvent` constructor uses `as KeyboardEventInit` cast because `keyCode`/`which` are deprecated and not in the TS DOM types, but Plex may need them
- `document.querySelector` calls use generic `<HTMLButtonElement>` for typed returns
- `btn.textContent?.trim()` uses optional chaining (textContent can be null)

- [ ] **Step 2: Delete src/content.js**

```bash
rm src/content.js
```

- [ ] **Step 3: Run typecheck to verify**

Run:
```bash
npm run typecheck
```

Expected: exits with code 0, no errors.

- [ ] **Step 4: Run build to verify output**

Run:
```bash
npm run build
```

Expected: prints "Build complete". Verify `dist/` contains:
```bash
ls dist/
```

Expected output:
```
content.js  icon128.png  icon16.png  icon48.png  manifest.json
```

- [ ] **Step 5: Commit**

```bash
git rm src/content.js
git add src/content.ts
git commit -m "feat: convert content script to TypeScript"
```

---

### Task 5: Update CI workflow

**Files:**
- Modify: `.github/workflows/bump-and-release.yml`

- [ ] **Step 1: Update the workflow**

Replace the full contents of `.github/workflows/bump-and-release.yml` with:

```yaml
name: Bump, Build, and Release Extension

on:
  workflow_dispatch:
  push:
    branches: [ main ]

jobs:
  bump-build-release:
    runs-on: ubuntu-latest

    permissions:
      contents: write  # Required for commits, tags, and releases

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Needed to create tags

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Bump patch version in manifest.json
        id: bump
        run: |
          file="src/manifest.json"
          version=$(jq -r .version "$file")
          echo "Current version: $version"

          IFS='.' read -r major minor patch <<< "$version"
          patch=$((patch + 1))
          new_version="$major.$minor.$patch"
          echo "New version: $new_version"

          jq --arg v "$new_version" '.version = $v' "$file" > tmp && mv tmp "$file"
          echo "new_tag=v$new_version" >> $GITHUB_OUTPUT

      - name: Build extension
        run: npm run build

      - name: Commit and tag new version
        run: |
          git config user.name "github-actions"
          git config user.email "github-actions@github.com"
          git commit -am "ci: bump version to ${{ steps.bump.outputs.new_tag }}"
          git tag ${{ steps.bump.outputs.new_tag }}
          git push origin HEAD
          git push origin ${{ steps.bump.outputs.new_tag }}

      - name: Pack Chrome extension
        run: |
          mkdir -p release
          cd dist
          zip -r ../release/extension-chrome.zip . -x '*.DS_Store'

      - name: Pack Firefox extension (.xpi)
        run: |
          cd dist
          zip -r ../release/extension-firefox.xpi . -x '*.DS_Store'

      - name: Wait for GitHub to recognize the tag
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          tag=${{ steps.bump.outputs.new_tag }}
          echo "Waiting for tag $tag to be available in GitHub API..."

          for i in {1..10}; do
            if gh release view "$tag" > /dev/null 2>&1; then
              echo "Tag $tag is ready."
              break
            fi
            echo "Retrying in 3s... ($i/10)"
            sleep 3
          done

      - name: Create GitHub Release and upload zips
        uses: softprops/action-gh-release@v2
        with:
          tag_name: ${{ steps.bump.outputs.new_tag }}
          name: Release ${{ steps.bump.outputs.new_tag }}
          files: |
            release/extension-chrome.zip
            release/extension-firefox.xpi
```

Changes from original:
1. Added `actions/setup-node@v4` step with Node.js 20 and npm cache
2. Added `npm ci` step to install dependencies
3. Added `npm run build` step after version bump (so bumped manifest gets built into dist)
4. Changed zip commands to package `dist/` instead of `src/`
5. Changed output dir from `dist/` to `release/` for zips (avoids conflict with build output dir)
6. Removed the redundant `cp -r src src-firefox` step — Firefox uses the same built output
7. Bumped `actions/checkout` from v3 to v4

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/bump-and-release.yml
git commit -m "ci: update workflow for TypeScript build pipeline"
```

---

### Task 6: Add GitHub Pages documentation

**Files:**
- Create: `docs/_config.yml`
- Create: `docs/index.md`

- [ ] **Step 1: Create docs/_config.yml**

Create `docs/_config.yml`:

```yaml
title: Auto Skip for Plex & Netflix
description: Browser extension that automatically skips intros and credits on Plex and Netflix
theme: jekyll-theme-cayman
```

- [ ] **Step 2: Create docs/index.md**

Create `docs/index.md`:

```markdown
---
layout: default
title: Auto Skip for Plex & Netflix
---

# Auto Skip for Plex & Netflix

Automatically skips intros and credits on Plex and Netflix so you never have to reach for the remote.

## Supported Platforms

| Platform | Skip Intro | Skip Credits |
|----------|-----------|-------------|
| Netflix  | Yes       | Yes         |
| Plex     | Yes       | Yes         |

Plex support includes local servers at `127.0.0.1:32400` and `localhost:32400`.

## Install

### Chrome / Edge / Brave

1. Download the latest `extension-chrome.zip` from [Releases](https://github.com/dustfeather/series-auto-skip/releases)
2. Unzip the file
3. Open `chrome://extensions` in your browser
4. Enable **Developer mode** (top right)
5. Click **Load unpacked** and select the unzipped folder

### Firefox

1. Download the latest `extension-firefox.xpi` from [Releases](https://github.com/dustfeather/series-auto-skip/releases)
2. Open Firefox and go to `about:addons`
3. Click the gear icon and select **Install Add-on From File**
4. Select the downloaded `.xpi` file

## How It Works

The extension watches for skip buttons to appear on the page and clicks them automatically. On Netflix, it targets the built-in skip intro and skip recap buttons. On Plex, it finds buttons by their text label.

No configuration needed. Install it and forget about it.
```

- [ ] **Step 3: Commit**

```bash
git add docs/_config.yml docs/index.md
git commit -m "docs: add GitHub Pages site with install and usage guide"
```

---

### Task 7: Clean up and final verification

**Files:**
- Modify: `.gitignore` (add dist/ confirmation — already present)

- [ ] **Step 1: Verify .gitignore covers dist/**

Run:
```bash
grep -n "^dist" .gitignore
```

Expected: line showing `dist` is gitignored. Already present in the existing `.gitignore`.

- [ ] **Step 2: Run full build and typecheck**

Run:
```bash
npm run typecheck && npm run build
```

Expected: both pass with no errors. `dist/` contains `content.js`, `manifest.json`, and all three icons.

- [ ] **Step 3: Verify dist/content.js is valid**

Run:
```bash
head -5 dist/content.js
```

Expected: see an IIFE wrapper — something like `"use strict";` or `(() => {` at the top.

- [ ] **Step 4: Verify no source files are missing**

Run:
```bash
ls src/
```

Expected: `content.ts`, `manifest.json`, `icon16.png`, `icon48.png`, `icon128.png`. No `content.js`.
