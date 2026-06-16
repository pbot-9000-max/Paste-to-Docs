# Contributing to paste-to-docs

Thank you for helping fix one of the most common daily frustrations in AI-assisted work.

## Getting started

```bash
git clone https://github.com/yourusername/paste-to-docs.git
cd paste-to-docs
```

Then load the extension in Chrome (Developer mode → Load unpacked → select this folder).

> **Note**: Extension icons are already tracked in git. If you redesign the icon, install dependencies (`npm install`) and run `npm run icons` to regenerate PNGs from `icons/icon.svg`.

## How to contribute

### Improving source detection

The most impactful contributions are better detection signatures for Claude, ChatGPT, Gemini, or new AI sources.

If you find a case where paste-to-docs doesn't detect your source:

1. Open DevTools in the page you're copying from
2. In the Console, run: `navigator.clipboard.read().then(items => items.forEach(item => console.log(item.types)))`
3. Copy the response, then read the HTML: 
   ```javascript
   navigator.clipboard.read().then(items => 
     items[0].getType('text/html').then(blob => blob.text().then(console.log))
   )
   ```
4. Open an issue and paste the HTML structure (redact sensitive content, keep class names and `data-` attributes).

### Adding new formatting elements

Conversion logic lives in `content.js` in two places:

- `walkNode()` — handles HTML input (add a new `case` to the switch)
- `markdownToHtml()` — handles plain-text markdown (add a new block parser or inline pattern)

Please add a test case comment above any new `case` showing the before/after.

### New target platforms

The HTML output from `htmlToClean()` / `markdownToHtml()` is standard semantic HTML. A new platform only requires:

1. Detecting the correct host URL in `manifest.json` host_permissions
2. Injecting `content.js` into the new platform's document
3. Verifying the paste interception works for that platform's input handling

## Code style

- Vanilla JavaScript, no build step required
- ES2020+ (Chrome extension context, no need to target old browsers)
- Single IIFE in `content.js` to avoid global scope pollution
- Descriptive function names; inline comments for non-obvious logic

## Pull request checklist

- [ ] Tested in Chrome with Developer mode
- [ ] Paste works in a Google Doc with at least one AI source
- [ ] No new external dependencies added to `content.js`
- [ ] `popup.js` and `manifest.json` updated if permissions changed

## Reporting bugs

Please include:
- Which AI source you were copying from
- What the formatted output looked like (screenshot welcome)
- Chrome version (`chrome://settings/help`)
- Extension version (popup → bottom-left)
