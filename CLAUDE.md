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

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
| ------ | ---------- |
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
