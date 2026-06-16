# paste-to-docs

> Paste from Claude, ChatGPT, or Gemini — download a clean .docx file.

**paste-to-docs** converts AI-formatted responses (headings, bold, lists, tables, code blocks) into a properly structured `.docx` file you can open in Google Docs, Word, or any document editor.

No reformatting. No manual cleanup. Just paste and download.

---

## How it works

1. Copy a response from Claude, ChatGPT, or Gemini
2. Paste into the textarea at **[paste-to-docs](https://pbot-9000-max.github.io/Paste-to-Docs)**
3. Click **Download .docx**
4. Import into Google Docs (File → Open → Upload)

All conversion happens in your browser — nothing is sent to a server.

### What gets converted

| Element | Before | After |
|---------|--------|-------|
| `## Heading` | Literal `##` text | Heading 2 |
| `**bold**` | Literal asterisks | Bold |
| `` `code` `` | Backtick-wrapped text | Monospace, shaded |
| Code block | Fenced with `` ``` `` | Styled code block |
| `\| Table \|` | Pipe characters | Rendered table |
| `[Link](url)` | Literal markdown | Clickable hyperlink |

---

## Usage

Open **[paste-to-docs](https://pbot-9000-max.github.io/Paste-to-Docs)** in any browser, paste your AI response, and download.

For the fastest workflow, use the companion Chrome extension (see `extension/`).

---

## Project structure

```
├── index.html            Web app (paste → download .docx)
├── app.js                Markdown → HTML → docx conversion
├── style.css             Web app styling
├── extension/            Chrome extension (paste interception in Google Docs)
│   ├── manifest.json
│   ├── content.js
│   ├── popup.html / popup.js
│   └── icons/
├── package.json          Dev tooling (eslint, sharp for extension icons)
├── AGENTS.md             Dev instructions for AI coding assistants
├── CONTRIBUTING.md
├── LICENSE
└── .gitignore
```

---

## License

MIT — see [LICENSE](./LICENSE).
