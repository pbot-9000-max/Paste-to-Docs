# Contributing

## Web app

The web app (`index.html`, `app.js`, `style.css`) has no build step — open `index.html` in a browser to run it.

```bash
git clone https://github.com/pbot-9000-max/Paste-to-Docs.git
cd Paste-to-Docs
npm start     # serves at http://localhost:3000
```

### How it works

1. `index.html` — provides a paste textarea and download button
2. `app.js` — `markdownToHtml()` converts AI markdown to clean HTML, then `buildDocx()` maps each HTML element to a `docx` library primitive (paragraph, heading, table, etc.)
3. `style.css` — minimal styling, nothing framework-specific

### Adding new formatting

Two places to touch:

- **`markdownToHtml()`** in `app.js` — add a new block parser or inline pattern for the markdown syntax
- **`buildDocx()`** in `app.js` — add a case for the new HTML element, mapping it to the corresponding `docx` library class

### Code style

- Vanilla JS, ES2020+, no build step
- Single IIFE in `app.js` to avoid global scope
- Descriptive function names; comments for non-obvious logic

## Chrome extension

The Chrome extension lives in `extension/`. See `extension/` README for details.

## Pull requests

- [ ] Tested locally — open `index.html` and verify conversion
- [ ] No new external dependencies (CDN-loaded libraries go in `index.html`)
- [ ] If changing the extension, verify in Chrome Developer mode
