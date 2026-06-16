# paste-to-docs
 
> Paste from Claude, ChatGPT, or Gemini — download a clean .docx file, perfectly formatted.
 
**paste-to-docs** converts AI-formatted responses into a clean `.docx` file you can open in any document editor. Use the web app at [paste-to-docs](https://pbot-9000-max.github.io/Paste-to-Docs) or the companion Chrome extension.
 
No reformatting. No manual cleanup. Just paste and download.
 
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
   Opens paste-to-docs web app
        │
        ▼
   Pastes into the editor
        │
        ▼
   markdownToHtml() ──── parses markdown into clean HTML
        │
        ▼
   buildDocx()     ──── maps HTML elements to docx primitives
        │
        ▼
   Downloads a .docx file ✓
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