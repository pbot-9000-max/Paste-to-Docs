# AGENTS.md — paste-to-docs

## Structure

- All core logic lives in `content.js` (single IIFE, no modules, no bundler)
- `popup.html` / `popup.js` are the toolbar popup (state via `chrome.storage.sync`)
- `manifest.json` v3, matches `https://docs.google.com/document/*`, all frames
- No build step required — load as unpacked extension directly

## Developer Commands

| Command | What it does |
|---|---|
| `npm run icons` | Regenerate PNG icons from `icons/icon.svg` via sharp (only needed if editing SVG) |
| `npm run lint` | ESLint on `content.js` and `popup.js` |
| `npm run pack` | Bundle release zip (uses `zip`, macOS/Linux CLI only) |

## Gotchas

- **PNG icons are tracked in git** — no build step needed to use the extension. `generate-icons.js` and `sharp` are kept as optional dev tooling for future icon redesigns.
- **`generate-icons.js` path quirk**: the script lives in `icons/`, so `__dirname` already points there. Use `path.join(__dirname, 'icon.svg')`, NOT `path.join(__dirname, 'icons', 'icon.svg')`.
- **Paste interception**: 3-tier fallback in `content.js` — (1) `navigator.clipboard.write()` + `execCommand('paste')`, (2) `execCommand('insertHTML')`, (3) write to clipboard + user nudge.
- **Vanilla JS, ES2020+** — Chrome extension context, no transpilation needed.
