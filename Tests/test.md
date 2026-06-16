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