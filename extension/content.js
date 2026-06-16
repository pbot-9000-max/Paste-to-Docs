/**
 * paste-to-docs — content.js
 *
 * Intercepts paste events in Google Docs and converts AI assistant responses
 * (Claude, ChatGPT, Gemini) into properly formatted Google Docs content.
 *
 * Architecture:
 *   1. detectSource()   — identifies whether clipboard content is from an AI
 *   2. htmlToClean()    — strips AI-specific HTML, rebuilds clean semantic HTML
 *   3. markdownToHtml() — fallback for plain-text markdown
 *   4. onPaste()        — intercepts, converts, re-injects
 */

(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────────────────────────

  let enabled    = true;
  let processing = false; // debounce guard across frames

  chrome.storage.sync.get({ enabled: true }, ({ enabled: e }) => { enabled = e; });
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'SET_ENABLED') enabled = msg.enabled;
  });

  // ── Styles (Google Docs renders these inline styles reliably) ──────────────

  const S = {
    inlineCode: 'font-family:monospace;background:#f1f3f4;padding:2px 4px;border-radius:3px;font-size:.875em',
    codeWrap:   'background:#f1f3f4;border-radius:6px;padding:12px 16px;margin:8px 0;display:block',
    codePre:    'font-family:monospace;font-size:.875em;margin:0;white-space:pre;overflow-x:auto',
    codeLang:   'font-family:monospace;font-size:.7em;color:#80868b;margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em',
    th:         'border:1px solid #dadce0;padding:8px 12px;background:#f8f9fa;font-weight:600;text-align:left',
    td:         'border:1px solid #dadce0;padding:8px 12px;text-align:left',
    blockquote: 'border-left:3px solid #dadce0;margin:0;padding:0 0 0 16px;color:#5f6368',
  };

  // ── Source Detection ───────────────────────────────────────────────────────

  /**
   * HTML signatures that identify each AI source.
   * Checked against the raw text/html clipboard string before parsing.
   */
  const SIGNATURES = {
    claude: [
      /anthropic/i,
      /claude/i,
      /prose[\s-]invert/i,
      /gap-y-prose/i,
      /font-claude/i,
      /AnthropicMarkdown/i,
    ],
    chatgpt: [
      /data-message-author-role/i,
      /chatgpt/i,
      /openai/i,
      /markdown prose/i,
      /result-streaming/i,
    ],
    gemini: [
      /gemini/i,
      /model-response/i,
      /bard-mode/i,
    ],
  };

  /**
   * Returns the source label if clipboard content is from an AI, otherwise null.
   * Checks HTML signatures first, then falls back to markdown pattern detection.
   */
  function detectSource(html, text) {
    if (html) {
      for (const [source, patterns] of Object.entries(SIGNATURES)) {
        if (patterns.some((p) => p.test(html))) return source;
      }
      // Generic structured HTML (has semantic tags from any source)
      if (/<(h[1-6]|pre|code|table|blockquote|article|section)/i.test(html)) return 'html';
    }
    // Markdown in plain text — broad check for common patterns
    if (text && (
      /^#{1,6}\s/m.test(text) ||           // ATX heading
      /^```/m.test(text) ||                 // code fence
      /\*\*[^*]+\*\*/.test(text) ||         // bold
      /^\s*[-*+]\s/m.test(text) ||          // unordered list
      /^\s*\d+\.\s/m.test(text) ||          // ordered list
      /\|.+\|/.test(text) ||                // table row
      /^>/m.test(text)                      // blockquote
    )) {
      return 'markdown';
    }
    return null;
  }

  // ── HTML → Clean HTML ──────────────────────────────────────────────────────

  /**
   * Parses the raw HTML clipboard string, walks the DOM, and rebuilds clean
   * semantic HTML that Google Docs renders faithfully.
   */
  function htmlToClean(html, fallbackText) {
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const out = walkNode(doc.body);
      if (out.trim()) return `<meta charset="utf-8">${out}`;
    } catch (_) {
      // Parsing failed — fall through to markdown conversion
    }
    return markdownToHtml(fallbackText);
  }

  function walkNode(node) {
    if (node.nodeType === Node.TEXT_NODE)    return esc(node.textContent);
    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    const tag = node.tagName.toLowerCase();
    const ch  = () => [...node.childNodes].map(walkNode).join('');

    // Headings H1–H6
    if (/^h[1-6]$/.test(tag)) return `<${tag}>${ch()}</${tag}>`;

    switch (tag) {
      // Block text
      case 'p':    return `<p>${ch()}</p>`;
      case 'br':   return '<br>';
      case 'hr':   return '<hr>';
      case 'blockquote':
        return `<blockquote style="${S.blockquote}">${ch()}</blockquote>`;

      // Inline formatting
      case 'strong': case 'b':  return `<strong>${ch()}</strong>`;
      case 'em':     case 'i':  return `<em>${ch()}</em>`;
      case 'del':    case 's':  return `<del>${ch()}</del>`;
      case 'sup':               return `<sup>${ch()}</sup>`;
      case 'sub':               return `<sub>${ch()}</sub>`;
      case 'mark':              return `<mark>${ch()}</mark>`;

      // Lists
      case 'ul': return `<ul>${ch()}</ul>`;
      case 'ol': return `<ol>${ch()}</ol>`;
      case 'li': return `<li>${ch()}</li>`;

      // Links — skip internal anchors
      case 'a': {
        const href = node.getAttribute('href') ?? '';
        if (!href || href.startsWith('#')) return ch();
        return `<a href="${escAttr(href)}">${ch()}</a>`;
      }

      // Inline code vs. code block
      case 'code': {
        if (node.closest('pre')) return esc(node.textContent); // handled by pre
        return `<code style="${S.inlineCode}">${esc(node.textContent)}</code>`;
      }

      // Code blocks — preserve raw text, strip inner markup
      case 'pre': {
        const codeEl = node.querySelector('code');
        const raw    = codeEl?.textContent ?? node.textContent;
        const lang   = (codeEl?.className ?? '').replace(/.*language-/, '').trim();
        const header = lang ? `<div style="${S.codeLang}">${esc(lang)}</div>` : '';
        return (
          `<div style="${S.codeWrap}">${header}` +
          `<pre style="${S.codePre}">${esc(raw)}</pre></div>`
        );
      }

      // Tables
      case 'table':
        return `<table style="border-collapse:collapse;margin:8px 0">${ch()}</table>`;
      case 'thead': case 'tbody': case 'tfoot':
        return ch();
      case 'tr': return `<tr>${ch()}</tr>`;
      case 'th': return `<th style="${S.th}">${ch()}</th>`;
      case 'td': return `<td style="${S.td}">${ch()}</td>`;

      // Non-content tags — drop entirely
      case 'script': case 'style':  case 'noscript':
      case 'button': case 'input':  case 'textarea':
      case 'svg':    case 'img':    case 'canvas':
      case 'iframe': case 'object': case 'embed':
        return '';

      // Everything else (div, span, section, etc.) — transparent pass-through
      default:
        return ch();
    }
  }

  // ── Markdown → HTML ────────────────────────────────────────────────────────

  /**
   * Converts a plain-text markdown string to clean HTML.
   * Used when clipboard only contains text/plain (e.g. pasted via keyboard shortcut
   * from sources that don't add text/html to the clipboard).
   */
  function markdownToHtml(text) {
    if (!text) return '';

    const blocks = [];
    const lines  = text.split('\n');
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Fenced code block
      const fenceM = line.match(/^```(\w*)$/);
      if (fenceM) {
        const lang  = fenceM[1];
        const code  = [];
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++]);
        const header = lang ? `<div style="${S.codeLang}">${esc(lang)}</div>` : '';
        blocks.push(
          `<div style="${S.codeWrap}">${header}` +
          `<pre style="${S.codePre}">${esc(code.join('\n'))}</pre></div>`
        );
        i++; // skip closing ```
        continue;
      }

      // ATX headings (#, ##, ###…)
      const hM = line.match(/^(#{1,6})\s+(.+)$/);
      if (hM) {
        const lvl = hM[1].length;
        blocks.push(`<h${lvl}>${inline(hM[2])}</h${lvl}>`);
        i++; continue;
      }

      // Blockquote
      if (line.startsWith('> ')) {
        const qLines = [];
        while (i < lines.length && lines[i].startsWith('> ')) {
          qLines.push(lines[i++].slice(2));
        }
        blocks.push(
          `<blockquote style="${S.blockquote}">${inline(qLines.join('<br>'))}</blockquote>`
        );
        continue;
      }

      // Unordered list
      if (/^[ \t]*[-*+] /.test(line)) {
        const items = [];
        while (i < lines.length && /^[ \t]*[-*+] /.test(lines[i])) {
          items.push(`<li>${inline(lines[i++].replace(/^[ \t]*[-*+] /, ''))}</li>`);
        }
        blocks.push(`<ul>${items.join('')}</ul>`);
        continue;
      }

      // Ordered list
      if (/^[ \t]*\d+\. /.test(line)) {
        const items = [];
        while (i < lines.length && /^[ \t]*\d+\. /.test(lines[i])) {
          items.push(`<li>${inline(lines[i++].replace(/^[ \t]*\d+\. /, ''))}</li>`);
        }
        blocks.push(`<ol>${items.join('')}</ol>`);
        continue;
      }

      // Table (header row | divider | body rows)
      if (line.includes('|') && (lines[i + 1] ?? '').match(/^\|[-:| ]+\|$/)) {
        const tLines = [];
        while (i < lines.length && lines[i].includes('|')) tLines.push(lines[i++]);
        blocks.push(buildTable(tLines));
        continue;
      }

      // Horizontal rule
      if (/^[-*_]{3,}\s*$/.test(line)) { blocks.push('<hr>'); i++; continue; }

      // Paragraph
      if (line.trim()) blocks.push(`<p>${inline(line)}</p>`);

      i++;
    }

    return blocks.join('');
  }

  /** Process inline markdown within a line of text. */
  function inline(text) {
    return text
      .replace(/\*\*\*(.+?)\*\*\*/g,           '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g,                '<strong>$1</strong>')
      .replace(/__(.+?)__/g,                    '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,                    '<em>$1</em>')
      .replace(/_([^_]+)_/g,                    '<em>$1</em>')
      .replace(/~~(.+?)~~/g,                    '<del>$1</del>')
      .replace(/`([^`]+)`/g,                    `<code style="${S.inlineCode}">$1</code>`)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g,      '<a href="$2">$1</a>');
  }

  /** Build an HTML table from markdown pipe-table lines. */
  function buildTable(lines) {
    // Filter out the divider row (e.g. | --- | --- |)
    const rows = lines.filter((l) => !/^\|[-:| ]+\|$/.test(l.trim()));
    if (!rows.length) return '';

    const cells = (r) => r.split('|').map((c) => c.trim()).filter(Boolean);
    const [head, ...body] = rows;

    const ths = cells(head)
      .map((c) => `<th style="${S.th}">${inline(c)}</th>`)
      .join('');
    const trs = body
      .map((r) =>
        `<tr>${cells(r).map((c) => `<td style="${S.td}">${inline(c)}</td>`).join('')}</tr>`
      )
      .join('');

    return (
      `<table style="border-collapse:collapse;margin:8px 0">` +
      `<thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`
    );
  }

  // ── Paste Interceptor ──────────────────────────────────────────────────────

  document.addEventListener('paste', onPaste, true /* capture phase */);

  async function onPaste(e) {
    if (!enabled || processing) return;

    const html = e.clipboardData?.getData('text/html')  ?? '';
    const text = e.clipboardData?.getData('text/plain') ?? '';
    if (!html && !text) return;

    const source = detectSource(html, text);
    if (!source) return;

    // Stop Google Docs from processing the original clipboard content
    e.preventDefault();
    e.stopImmediatePropagation();

    processing = true;
    try {
      const cleanHtml = source === 'markdown'
        ? markdownToHtml(text)
        : htmlToClean(html, text);

      let pasted = false;

      // Strategy 1: write clean HTML to clipboard → trigger native paste
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html':  new Blob([cleanHtml], { type: 'text/html' }),
            'text/plain': new Blob([text],      { type: 'text/plain' }),
          }),
        ]);
        document.execCommand('paste');
        pasted = true;
      } catch (_) { /* fall through */ }

      // Strategy 2: execCommand insertHTML (older fallback)
      if (!pasted) {
        try {
          document.execCommand('insertHTML', false, cleanHtml);
          pasted = true;
        } catch (_) { /* fall through */ }
      }

      // Strategy 3: write to clipboard + show nudge for a second paste
      if (!pasted) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'text/html':  new Blob([cleanHtml], { type: 'text/html' }),
              'text/plain': new Blob([text],      { type: 'text/plain' }),
            }),
          ]);
        } catch (_) { /* nothing more we can do */ }
        showNudge('Formatted ✓ — press Ctrl+V to paste');
      }

      // Persist stats
      chrome.storage.sync.get({ count: 0 }, ({ count }) => {
        chrome.storage.sync.set({ count: count + 1, lastSource: source });
      });

    } finally {
      // Brief lock to prevent duplicate fires across frames
      setTimeout(() => { processing = false; }, 150);
    }
  }

  // ── UI helpers ─────────────────────────────────────────────────────────────

  function showNudge(msg) {
    const el = Object.assign(document.createElement('div'), { textContent: msg });
    Object.assign(el.style, {
      position:   'fixed',
      top:        '16px',
      right:      '16px',
      background: '#1a73e8',
      color:      '#fff',
      padding:    '10px 16px',
      borderRadius: '8px',
      fontSize:   '13px',
      fontFamily: 'Google Sans, sans-serif',
      zIndex:     '2147483647',
      boxShadow:  '0 4px 12px rgba(0,0,0,.25)',
      transition: 'opacity .3s ease',
      opacity:    '1',
    });
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 300);
    }, 3000);
  }

  // ── Utilities ──────────────────────────────────────────────────────────────

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function escAttr(s) {
    return String(s)
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

})();
