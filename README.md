# paste-to-docs

> Paste from Claude, ChatGPT, or Gemini into Google Docs — perfectly formatted, zero clicks.

**paste-to-docs** is a Chrome extension that intercepts your paste event, detects AI-generated content, strips broken HTML, and rebuilds clean semantic structure that Google Docs actually understands.

No reformatting. No extra paste. No copy-to-markdown-converter. Just Ctrl+V.

---

## The Problem

Every knowledge worker using an AI assistant hits this wall dozens of times a day.

You ask Claude or ChatGPT for a structured analysis. It comes back beautifully formatted — headers, numbered lists, code blocks, a table. You copy it. You paste it into Google Docs.

And it looks like this:

```
## Key Findings

**Revenue** grew 23% YoY, driven by:
- Expansion in APAC
  - India +40%
  - SEA +28%

| Quarter | Revenue | Growth |
|---------|---------|--------|
| Q1      | $12M    | +18%   |
```

Markdown syntax. Literal asterisks. Raw pipe characters. A document that now needs 20 minutes of manual cleanup before it can go to anyone.

This is not a niche problem. An estimated 3 billion Google Docs users overlap with the explosive growth of AI assistant usage. The formatting gap between AI output and document tools is one of the highest-friction points in modern knowledge work — and there is no maintained open-source solution for it.

---

## How It Works

```
User copies from Claude/ChatGPT/Gemini
         │
         ▼
    Chrome intercepts paste event (capture phase)
         │
         ▼
    detectSource()  ──── checks HTML signatures for Claude, ChatGPT, Gemini
         │                then falls back to markdown pattern detection
         ▼
    htmlToClean()   ──── walks DOM tree, strips AI-specific classes/wrappers,
         │                rebuilds clean semantic HTML
         ▼
    [fallback]      ──── markdownToHtml() for plain-text clipboard content
         │
         ▼
    Clean HTML written to clipboard → native paste triggered
         │
         ▼
    Google Docs receives properly structured content ✓
```

### What gets converted

| Element | Before | After |
|---------|--------|-------|
| `## Heading` | Literal `##` text | Google Docs Heading 2 |
| `**bold**` | Literal asterisks | Bold |
| `` `inline code` `` | Backtick-wrapped text | Monospace, shaded |
| Code block | Plain text with ` ``` ` fences | Styled `<pre>` block |
| `\| Table \| ... \|` | Pipe characters | Rendered table |
| `[Link](url)` | Literal markdown | Clickable hyperlink |
| Nested lists | Flattened / broken | Proper indented lists |

---

## Installation

### From source (developer mode)

```bash
git clone https://github.com/yourusername/paste-to-docs.git
cd paste-to-docs
```

Then in Chrome:
1. Go to `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked** → select the `paste-to-docs` folder

### Chrome Web Store

Coming soon — [follow the repo](https://github.com/yourusername/paste-to-docs) for release notifications.

---

## Usage

1. Install the extension
2. Open any Google Doc
3. Copy a response from Claude, ChatGPT, or Gemini
4. Paste normally with **Ctrl+V** (or **⌘+V**)

That's it. The extension works silently in the background. A small popup (click the toolbar icon) shows how many pastes have been formatted and lets you toggle the extension on/off.

### Supported sources

| Source | Detection method |
|--------|-----------------|
| Claude (claude.ai) | HTML class signatures |
| ChatGPT (chatgpt.com) | `data-message-author-role` attribute |
| Gemini (gemini.google.com) | `model-response` element structure |
| Generic Markdown | Pattern matching on plain-text clipboard |

---

## Roadmap

- [ ] **v0.2** — Google Slides support
- [ ] **v0.3** — Notion support
- [ ] **v0.4** — Source-specific formatting profiles (e.g. apply a "report" style for Claude, "chat" style for ChatGPT)
- [ ] **v0.5** — User-defined style templates (map headings to your org's doc styles)
- [ ] **v1.0** — Chrome Web Store release
- [ ] **Future** — Firefox extension, Google Workspace Add-on parity

---

## Contributing

Contributions are welcome — especially for:

- **Improving source detection**: If you find a case where your AI source isn't detected, open an issue with the clipboard HTML (redact content, keep the class names and structure).
- **New formatting elements**: Anything in the "what gets converted" table that isn't handled yet.
- **New target platforms**: Notion, Confluence, Office 365 Web — the converter is modular.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup and PR guidelines.

---

## Architecture

The extension is intentionally dependency-free — no bundler required to load or modify it.

```
paste-to-docs/
├── manifest.json         Chrome MV3 manifest
├── content.js            Injected into docs.google.com — all core logic lives here
│   ├── detectSource()    HTML signature + markdown pattern detection
│   ├── htmlToClean()     DOM walker, rebuilds semantic HTML
│   ├── markdownToHtml()  Plain-text markdown → HTML fallback
│   └── onPaste()         Paste interceptor with 3-tier fallback strategy
├── popup.html            Extension popup UI
├── popup.js              Popup state management
└── icons/                Extension icons (SVG source + PNG targets)
```

All conversion logic is in `content.js`. The three paste strategies are tried in sequence:

1. `navigator.clipboard.write()` → `document.execCommand('paste')` *(preferred)*
2. `document.execCommand('insertHTML')` *(older fallback)*
3. Write to clipboard + show nudge to paste again *(last resort)*

---

## Why This Matters for the Ecosystem

Google Docs is used by an estimated 3 billion people. AI assistant adoption is growing at ~40% year-over-year. The overlap — people who both write in Google Docs and use AI assistants — is enormous and expanding rapidly.

The formatting gap is currently solved individually by millions of users through manual workarounds: re-typing, using paid tools like Notion AI (which only works within Notion), or simply not using AI for document work. This project removes that barrier entirely, for free, for everyone.

There is no maintained open-source Chrome extension solving this problem today.

---

## License

MIT — see [LICENSE](./LICENSE).
