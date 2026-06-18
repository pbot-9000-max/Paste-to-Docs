# Paste → Docs

> Paste from Claude, ChatGPT, or Gemini — download a clean `.docx` file in one click.

**paste-to-docs** converts AI-formatted responses (headings, bold, lists, tables, code blocks, links) into a properly structured Word document. No reformatting. No manual cleanup. All in your browser.

**[→ Open the web app](https://paste-to-docs.vercel.app)**

---

## Features

- **One-click conversion** — paste AI output, download a `.docx`
- **100% private** — everything runs in your browser, nothing leaves your machine
- **No sign-up, no ads, no limits**
- **Supports all major AI sources** — Claude, ChatGPT, Gemini, and any markdown content
- **Full markdown support** — headings, tables, lists, code blocks, blockquotes, links, inline formatting

### What gets converted

| Element | Markdown | Word Output |
|---------|----------|-------------|
| Headings | `## Heading` | Native Word heading style |
| Bold | `**bold**` | Bold |
| Italic | `*italic*` | Italic |
| Inline code | `` `code` `` | Monospace + shaded background |
| Code blocks | Fenced with ` ``` ` | Styled block with monospace + shading |
| Tables | `\| A \| B \|` | Real editable Word table with borders |
| Links | `[text](url)` | Clickable hyperlink |
| Lists | `- item` | Properly indented bulleted/numbered lists |
| Blockquotes | `> quote` | Indented blockquote |
| Horizontal rules | `---` | Thematic break |

---

## How it works

```
1. Copy from AI ──→ 2. Paste here ──→ 3. Download .docx
```

Open **[paste-to-docs](https://paste-to-docs.vercel.app)**, paste your AI response, and click download. Open the `.docx` in Word, Google Docs, or Pages — everything is already formatted.

---

## Project structure

```
├── index.html            Web app (paste → download .docx)
├── app.js                Markdown → HTML → docx conversion
├── style.css             Design system and layout
├── extension/            Chrome extension (paste interception in Google Docs)
│   ├── manifest.json
│   ├── content.js
│   ├── popup.html / popup.js
│   └── icons/
├── Tests/
│   └── test.md           Test fixture sample
├── Outputs/
│   ├── test.docx         Generated output for inspection
│   └── test.html         Intermediate HTML for debugging
├── package.json          Dev tooling
├── AGENTS.md             Dev instructions for AI coding assistants
└── CONTRIBUTING.md
```

---

## Quick start (development)

```bash
git clone https://github.com/pbot-9000-max/Paste-to-Docs.git
cd Paste-to-Docs
npm start        # serves at http://localhost:3000
```

No build step — open `index.html` directly or use the local server.

---

## Chrome extension

A companion Chrome extension lives in `extension/` for intercepting pastes directly into Google Docs. The extension shares the same `markdownToHtml()` engine as the web app. See `extension/` for details.

---

## License

MIT — see [LICENSE](./LICENSE).
