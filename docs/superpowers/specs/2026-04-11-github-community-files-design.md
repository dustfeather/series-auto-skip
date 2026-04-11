# GitHub Community Files

## Overview

Add three GitHub community files to the series-auto-skip repo: a contributing guide, a security policy, and a pull request template.

## Files

### CONTRIBUTING.md (repo root)

- Dev setup: clone, `npm install`
- Project structure: `src/` (TypeScript source) → `dist/` (build output)
- Build commands: `npm run build`, `npm run watch`, `npm run typecheck`
- Testing locally: load `dist/` as unpacked extension in Chrome
- PR guidelines: run typecheck, keep changes focused

### SECURITY.md (repo root)

- Primary channel: GitHub Security Advisories (repo Security tab → "Report a vulnerability")
- Fallback: dustfeather@gmail.com
- Reporters should include: description, repro steps, affected versions
- Response commitment: 48 hours acknowledgment

### .github/PULL_REQUEST_TEMPLATE.md

- Lightweight checklist: what changed, tested locally, typecheck passes
