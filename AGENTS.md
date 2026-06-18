# AGENTS.md — paste-to-docs

## Project structure

- **`index.html`** / **`app.js`** / **`style.css`** — web app (primary). No build step, open `index.html` directly or `npm start` to serve locally.
- **`extension/`** — Chrome extension (secondary, moved here from root). All extension files live here.
- **`Tests/`** — test fixture (`test.md`) for manual verification
- **`Outputs/`** — generated `.docx` and `.html` for inspection

## Developer commands

| Command | What it does |
|---|---|
| `npm start` | Serve the web app locally via `serve` |
| `npm run icons` | Regenerate PNG icons from `extension/icons/icon.svg` |
| `npm run lint` | ESLint on `extension/content.js` and `extension/popup.js` |
| `npm run pack` | Bundle extension into a release zip |

## Web app architecture

`app.js` has all conversion logic in a single IIFE:
1. **`markdownToHtml()`** — parses markdown (headings, lists, tables, code, bold, etc.) into clean HTML
2. **`buildDocx()`** — walks the HTML DOM and maps each element to `docx` library primitives
3. **`buildDocxTable()`** / **`extractRuns()`** / **`buildRow()`** — helpers for table and inline-text conversion

The `docx` library (v9) is loaded from CDN in `index.html` — no npm install needed to use the web app.

To add new formatting: add a block parser in `markdownToHtml()` + a corresponding case in `buildDocx()`.

### Table rendering (known patterns)

- Markdown tables are parsed in `buildTable()` then built into docx in `buildDocxTable()`
- `numCols` is derived from `rows[0].children.length` (first row), NOT from `Math.max` across all rows
- Table width: `{ size: 100, type: WidthType.PERCENTAGE }` — writes `<w:tblW w:type="pct" w:w="100%"/>`
- Column widths: `columnWidths: Array(numCols).fill(Math.floor(9360 / numCols))` — writes `<w:gridCol>` with DXA values
- Cell widths are NOT set per-cell — the gridCol defines column widths
- Escaped pipes (`\|`) in markdown are handled by replacing with `\x00` placeholder before `split('|')`, then restoring to `|` after: `r.split('\\|').join('\x00').split('|').map(c => c.trim().replace(/\x00/g, '|')).filter(Boolean)`

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
- **Verifying docx XML**: `grep -oE 'w:tc[^>]*>' word/document.xml` — this pattern matches BOTH `<w:tc>` (open cell) and `</w:tc>` (close cell), so 6 matches = 3 cells, not 6.
- **`agent-browser eval` gotcha**: In batch mode, `#` is treated as shell comment start. Use simple eval strings or avoid special characters.

## Design system (style.css)

- **Palette**: Violet (#7C3AED → #6D28D9) + Amber (#F59E0B) on warm cream (#FAFAF9)
- **Fonts**: Inter (Google Fonts, loaded via `<link>`) for headings, system stack for body, mono for code
- **Layout**: Flexbox-based responsive design with 3 breakpoints (default, 768px, 480px)
- **Component patterns**: glass card with window chrome, source badges, feature grid cards, numbered steps workflow, animated download button
- **States**: hover lift on cards/button, focus ring on converter card, disabled + spinner on button during conversion
- **CSS architecture**: custom properties (`--violet-*`, `--gray-*`, `--radius-*`, `--shadow-*`, `--font-*`) for consistent theming
