# Paste-to-Docs

## What this codebase does

Paste-to-Docs is a static browser app plus a Chrome extension for converting AI-chat Markdown/HTML into clean preview HTML, clipboard HTML, and Word `.docx` output. The primary app is `index.html`, `app.js`, and `style.css` with no build step; `docx` v9 is loaded in the browser. The extension under `extension/` intercepts paste events in Google Docs, detects AI/Markdown clipboard content, cleans or converts it, writes sanitized rich HTML back to the clipboard, and pastes it into the active document.

## Auth shape

There is no application authentication, backend session, server API, database, or user account model in this repo. Chrome extension state is local extension storage only (`chrome.storage.sync`) for enable/disable and stats. The meaningful trust boundaries are browser DOM parsing/rendering, clipboard reads/writes, Chrome extension permissions, and third-party CDN script loading.

## Threat model

Primary attacker-controlled input is Markdown or rich HTML pasted into the web app or Google Docs extension from AI tools, web pages, or files. Highest-impact issues are script/event-handler injection into generated preview/clipboard HTML, unsafe link schemes that survive conversion, document-generation paths that preserve hostile URLs, and extension permission misuse that broadens access beyond Google Docs. Supply-chain risk matters because the web app runs CDN JavaScript directly in the page.

## Project-specific patterns to flag

- Any string-built HTML in `markdownToHtml()`, `inline()`, `buildTable()`, or `htmlToClean()` must escape text and attributes separately.
- Link generation should go through `safeHref()` / `renderSafeLink()` and allow only `http:`, `https:`, and `mailto:` targets.
- Extension clipboard HTML handling in `onPaste()`, `writeClipboard()`, and `htmlToClean()` should never preserve scripts, event handlers, images, iframes, SVG, or unsafe URL schemes.
- DOCX hyperlink creation in `extractRuns()` consumes generated `<a href>` values; unsafe links should be removed before this stage rather than trusted there.
- CDN references in `index.html` should be pinned to exact versions or vendored locally.

## Known false-positives

- `Outputs/` contains generated `.docx`/`.html` inspection artifacts and should not be treated as source behavior.
- `Tests/*.md` and `Tests/user-stories.test.js` intentionally include fixture Markdown/HTML and security regression payloads.
- `extension/icons/*.png` are tracked generated assets; `extension/icons/generate-icons.js` reads the local SVG and writes icons.
- `extension/manifest.json` clipboard permissions are product-critical for paste conversion; `tabs` is used by the popup to query open Google Docs tabs and broadcast the enabled state.
- `index.html` static GitHub and Google Fonts links are public navigation/resource links, not user-controlled redirects.
