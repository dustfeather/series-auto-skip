# Auto Skip for Plex & Netflix

Browser extension that automatically clicks "Skip Intro", "Skip Credits", and "Skip Recap" buttons on Plex and Netflix.

## Build from source

### Requirements

- **OS:** Any (Linux, macOS, Windows)
- **Node.js:** v20 or later — [nodejs.org](https://nodejs.org/)
- **npm:** Included with Node.js

### Steps

```bash
git clone https://github.com/dustfeather/series-auto-skip.git
cd series-auto-skip
npm install
npm run build
```

This compiles `src/content.ts` to `dist/content.js` using esbuild (IIFE format) and copies the manifest and icons into `dist/`.

### Load the extension

- **Chrome / Edge / Brave:** Go to `chrome://extensions`, enable Developer Mode, click "Load unpacked", select the `dist/` folder.
- **Firefox:** Go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", select `dist/manifest.json`.
