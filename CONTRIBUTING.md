# Contributing

Thanks for your interest in contributing to Auto Skip for Plex & Netflix!

## Dev Setup

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```

## Project Structure

- `src/` — TypeScript source files and static assets (manifest, icons)
- `dist/` — Build output (gitignored). This is the actual extension package.
- `docs/` — GitHub Pages documentation site

## Build Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript and copy static files to `dist/` |
| `npm run watch` | Rebuild on file changes (TypeScript only) |
| `npm run typecheck` | Run the TypeScript type checker |

## Testing Locally

1. Run `npm run build`
2. Open `chrome://extensions` in Chrome
3. Enable **Developer mode**
4. Click **Load unpacked** and select the `dist/` folder
5. Navigate to Netflix or Plex to test

After making changes, run `npm run build` again and click the refresh icon on the extension card in `chrome://extensions`.

## Submitting a PR

- Run `npm run typecheck` before submitting — it must pass with no errors
- Keep changes focused. One feature or fix per PR.
- Describe what you changed and why in the PR description
