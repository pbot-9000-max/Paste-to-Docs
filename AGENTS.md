# AGENTS.md — paste-to-docs

## Project structure

- **`index.html`** / **`app.js`** / **`style.css`** — web app (primary). No build step, open `index.html` directly or `npm start` to serve locally.
- **`extension/`** — Chrome extension (secondary, moved here from root). All extension files live here.

## Developer commands

| Command | What it does |
|---|---|---|
| `npm start` | Serve the web app locally via `serve` |
| `npm run icons` | Regenerate PNG icons from `extension/icons/icon.svg` |
| `npm run lint` | ESLint on `extension/content.js` and `extension/popup.js` |
| `npm run pack` | Bundle extension into a release zip |
| `npm run test-convert` | Run `Tests/test.md` through conversion → `Outputs/test.docx` + `Outputs/test.html` |

## Web app architecture

`app.js` has all conversion logic in a single IIFE:
1. **`markdownToHtml()`** — parses markdown (headings, lists, tables, code, bold, etc.) into clean HTML
2. **`buildDocx()`** — walks the HTML DOM and maps each element to `docx` library primitives
3. **`buildDocxTable()`** / **`extractRuns()`** / **`buildRow()`** — helpers for table and inline-text conversion

The `docx` library (v9) is loaded from CDN in `index.html` — no npm install needed to use the web app.

To add new formatting: add a block parser in `markdownToHtml()` + a corresponding case in `buildDocx()`.

## Chrome extension

See `extension/content.js`. Same `markdownToHtml()` logic is duplicated there (MIT, same author). Key differences from the web app:
- Paste interception via `onPaste()` with 3-tier fallback strategy
- Source detection via `detectSource()` (HTML signatures + markdown patterns)
- `htmlToClean()` — DOM walker that strips AI-specific wrappers
- Popup UI for toggle and stats (`popup.html` / `popup.js`)

### Gotchas

- **`generate-icons.js` path quirk**: script lives in `extension/icons/`, so `__dirname` already points there. Use `path.join(__dirname, 'icon.svg')`, NOT `path.join(__dirname, 'icons', 'icon.svg')`.
- **Paste interception**: 3-tier fallback — (1) clipboard write + `execCommand('paste')`, (2) `execCommand('insertHTML')`, (3) clipboard write + user nudge.
- **Extension PNG icons are tracked in git** — no build step needed to load the extension.
