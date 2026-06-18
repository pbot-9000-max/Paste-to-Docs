# Contributing

## Web app

The web app (`index.html`, `app.js`, `style.css`) has no build step — open `index.html` in a browser or run the dev server.

```bash
git clone https://github.com/pbot-9000-max/Paste-to-Docs.git
cd Paste-to-Docs
npm start     # serves at http://localhost:3000
```

### How it works

1. **`index.html`** — page structure with converter card, feature grid, and steps workflow
2. **`style.css`** — design system with CSS custom properties (violet/amber palette, Inter typography, responsive layout)
3. **`app.js`** — single IIFE containing:
   - `markdownToHtml()` — parses AI markdown to clean HTML
   - `buildDocx()` — walks HTML DOM and maps each element to `docx` library primitives
   - `buildDocxTable()` / `buildRow()` / `extractRuns()` — helpers for tables and inline text

The `docx` library (v9) is loaded from CDN in `index.html` — no `npm install` needed to use the web app.

### Developer commands

| Command | What it does |
|---|---|
| `npm start` | Serve the web app locally via `serve` |
| `npm run icons` | Regenerate PNG icons from `extension/icons/icon.svg` |
| `npm run lint` | ESLint on `extension/content.js` and `extension/popup.js` |
| `npm run pack` | Bundle extension into a release zip |

### Verifying docx XML

```bash
npm start
# Open http://localhost:3000, paste a test markdown, download the .docx
unzip -o ~/Downloads/converted.docx word/document.xml
grep -oE 'w:tbl[^>]*>|w:tblW[^/]*/|w:tblGrid[^>]*>|w:gridCol[^/]*/|w:tr[^>]*>|w:tc[^>]*>' word/document.xml
```

Note: `w:tc[^>]*>` matches both `<w:tc>` (open cell) and `</w:tc>` (close cell) — 6 matches = 3 cells.

### Adding new formatting

Two places to touch:

- **`markdownToHtml()`** in `app.js` — add a new block parser or inline pattern for the markdown syntax
- **`buildDocx()`** in `app.js` — add a case for the new HTML element, mapping it to the corresponding `docx` library class

### Code style

- Vanilla JS, ES2020+, no build step
- Single IIFE in `app.js` to avoid global scope
- Descriptive function names; comments for non-obvious logic (but we prefer clean code over comments)
- CSS custom properties in `style.css` for consistent theming

## Chrome extension

The Chrome extension lives in `extension/`. It shares the same `markdownToHtml()` engine. Key differences:

- Paste interception via `onPaste()` with 3-tier fallback strategy
- Source detection via `detectSource()` (HTML signatures + markdown patterns)
- `htmlToClean()` — DOM walker that strips AI-specific wrappers
- Popup UI for toggle and stats (`popup.html` / `popup.js`)

### Extension gotchas

- **`generate-icons.js` path quirk**: script lives in `extension/icons/`, so `__dirname` already points there. Use `path.join(__dirname, 'icon.svg')`, NOT `path.join(__dirname, 'icons', 'icon.svg')`.
- **Paste interception**: 3-tier fallback — (1) clipboard write + `execCommand('paste')`, (2) `execCommand('insertHTML')`, (3) clipboard write + user nudge.
- **Extension PNG icons are tracked in git** — no build step needed to load the extension.

## Pull requests

- [ ] Tested locally — paste a test markdown in the web app and verify the output
- [ ] Checked the web app — open `index.html` (or `npm start`) and verify conversion
- [ ] No new external dependencies (CDN-loaded libraries go in `index.html`)
- [ ] If changing the extension, verify in Chrome Developer mode
- [ ] If changing the UI, verify responsive layout at mobile/tablet/desktop breakpoints
