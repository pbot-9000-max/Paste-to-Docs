const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');

function docxStub() {
  class Item { constructor(options) { Object.assign(this, options); } }
  return {
    HeadingLevel: Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`HEADING_${i + 1}`, `h${i + 1}`])),
    ShadingType: { CLEAR: 'clear' }, UnderlineType: { SINGLE: 'single' },
    WidthType: { PERCENTAGE: 'pct' }, BorderStyle: { SINGLE: 'single' },
    TextRun: Item, ExternalHyperlink: Item, Paragraph: Item, Table: Item, TableCell: Item, TableRow: Item,
    Document: Item, Packer: { toBlob: async () => new Blob(['docx']) },
  };
}

function expose(source, names) {
  return source.replace(/\}\)\(\);\s*$/, `globalThis.__test = { ${names.join(', ')} };\n})();`);
}

function webApp() {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const dom = new JSDOM(html, { url: 'http://localhost/', runScripts: 'outside-only' });
  const { window } = dom;
  window.matchMedia = () => ({ matches: false });
  window.alert = message => { window.__alert = message; };
  window.docx = docxStub();
  window.docx.Packer.toBlob = async document => { window.__document = document; return new Blob(['docx']); };
  window.URL.createObjectURL = () => 'blob:test';
  window.URL.revokeObjectURL = () => {};
  window.HTMLAnchorElement.prototype.click = function () { window.__download = this.download; };
  window.__clipboardWrites = [];
  window.__clipboardTextWrites = [];
  Object.defineProperty(window.navigator, 'clipboard', {
    configurable: true,
    value: {
      write: async items => { window.__clipboardWrites.push(items); },
      writeText: async text => { window.__clipboardTextWrites.push(text); },
    },
  });
  window.ClipboardItem = class { constructor(value) { this.value = value; } };
  const source = expose(fs.readFileSync(path.join(root, 'app.js'), 'utf8'),
    ['markdownToHtml', 'buildDocx', 'extractRuns', 'buildDocxTable']);
  window.eval(source);
  return dom;
}

function extensionApp() {
  const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://docs.google.com/document/d/test', runScripts: 'outside-only' });
  const { window } = dom;
  let pasteHandler, messageHandler;
  const writes = [];
  const originalAdd = window.document.addEventListener.bind(window.document);
  window.document.addEventListener = (type, handler, options) => {
    if (type === 'paste') pasteHandler = handler;
    return originalAdd(type, handler, options);
  };
  window.chrome = {
    storage: { sync: { get: (_defaults, callback) => callback({ enabled: true, count: 0 }), set: value => writes.push(value) } },
    runtime: { onMessage: { addListener: handler => { messageHandler = handler; } } },
  };
  window.navigator.clipboard = { write: async () => {} };
  window.ClipboardItem = class { constructor(value) { this.value = value; } };
  window.document.execCommand = () => true;
  const source = expose(fs.readFileSync(path.join(root, 'extension/content.js'), 'utf8'),
    ['detectSource', 'htmlToClean', 'walkNode', 'markdownToHtml', 'inline', 'buildTable', 'onPaste']);
  window.eval(source);
  return { dom, pasteHandler, messageHandler, writes };
}

async function popupApp() {
  const html = fs.readFileSync(path.join(root, 'extension/popup.html'), 'utf8');
  const dom = new JSDOM(html, { url: 'chrome-extension://test/popup.html', runScripts: 'outside-only' });
  const { window } = dom;
  const sets = [], messages = [], created = [];
  window.chrome = {
    runtime: { getManifest: () => ({ version: '1.2.3' }) },
    storage: { sync: {
      get: async () => ({ enabled: false, count: 1234, lastSource: 'chatgpt' }),
      set: async value => { sets.push(value); },
    } },
    tabs: {
      query: async () => [{ id: 7 }, { id: 8 }],
      sendMessage: async (id, message) => { messages.push([id, message]); },
      create: value => { created.push(value); },
    },
  };
  window.eval(fs.readFileSync(path.join(root, 'extension/popup.js'), 'utf8'));
  await new Promise(resolve => setTimeout(resolve));
  return { dom, sets, messages, created };
}

async function run() {
  let checks = 0;
  const failures = [];
  const check = async (name, fn) => {
    try { await fn(); checks++; process.stdout.write(`✓ ${name}\n`); }
    catch (error) { failures.push([name, error.message]); process.stdout.write(`✗ ${name}: ${error.message.split('\n')[0]}\n`); }
  };

  const web = webApp();
  const w = web.window;
  const input = w.document.getElementById('input');
  const button = w.document.getElementById('downloadBtn');
  const preview = w.document.getElementById('preview');

  await check('WEB-001 initial empty state', () => {
    assert.equal(button.disabled, true); assert.equal(preview.innerHTML, '');
  });
  await check('WEB-002/003 typed and whitespace state', () => {
    input.value = '   '; input.dispatchEvent(new w.Event('input')); assert.equal(button.disabled, true);
    input.value = '# Hello'; input.dispatchEvent(new w.Event('input'));
    assert.equal(button.disabled, false); assert.equal(w.document.getElementById('charCount').textContent, '7');
  });
  await check('WEB-004/011/012 live block preview', () => {
    assert.match(preview.innerHTML, /<h1>Hello<\/h1>/);
    assert.match(w.__test.markdownToHtml('text', false), /<p>text<\/p>/);
  });
  await check('WEB-013/014/015 inline formatting', () => {
    const out = w.__test.markdownToHtml('**b** *i* ~~s~~ `c` [l](https://e.test)', false);
    for (const tag of ['strong', 'em', 'del', 'code', 'a']) assert.match(out, new RegExp(`<${tag}`));
  });
  await check('WEB-016/017 fenced code and quote', () => {
    assert.match(w.__test.markdownToHtml('```js\n<x>\n```', true), />js<[\s\S]*&lt;x&gt;/);
    assert.match(w.__test.markdownToHtml('> a\n> b', false), /<blockquote>a<br>b<\/blockquote>/);
  });
  await check('WEB-018/019 lists', () => {
    assert.match(w.__test.markdownToHtml('- a\n- b\n\n1. c\n2. d', false), /<ul>[\s\S]*<ol>/);
  });
  await check('WEB-020 table and escaped pipe', () => {
    const out = w.__test.markdownToHtml('| A | B |\n|---|---|\n| x \\| y | z |', false);
    assert.match(out, /<table/); assert.match(out, /x \| y/);
  });
  await check('WEB table cell br bullets become list items', () => {
    const out = w.__test.markdownToHtml('| Tasks |\n|---|\n| - one<br>- two |', false);
    assert.match(out, /<td><ul><li>one<\/li><li>two<\/li><\/ul><\/td>/);
    assert.doesNotMatch(out, /&lt;br/);
  });
  await check('WEB DOCX table cells use 0.1in padding', () => {
    const expected = { top: 144, bottom: 144, left: 144, right: 144 };
    const plain = w.__test.buildDocx(w.__test.markdownToHtml('| A |\n|---|\n| B |', false), false)[0];
    const styledTable = w.__test.buildDocx(w.__test.markdownToHtml('| A |\n|---|\n| B |', true), true)[0];
    assert.equal(JSON.stringify(plain.rows[1].children[0].margins), JSON.stringify(expected));
    assert.equal(JSON.stringify(styledTable.rows[1].children[0].margins), JSON.stringify(expected));
  });
  await check('WEB DOCX table cell bullets become separate paragraphs', () => {
    const html = w.__test.markdownToHtml('| Tasks |\n|---|\n| - one<br>- two |', false);
    const table = w.__test.buildDocx(html, false)[0];
    const cell = table.rows[1].children[0];
    assert.equal(cell.children.length, 2);
    assert.equal(cell.children[0].children[0].text, '\u2022 ');
    assert.equal(cell.children[0].children[1].text, 'one');
    assert.equal(cell.children[1].children[1].text, 'two');
  });
  await check('WEB-021/022 rule and escapes', () => {
    assert.match(w.__test.markdownToHtml('---', false), /<hr/);
    assert.match(w.__test.markdownToHtml('\\*literal\\*', false), /<p>\*literal\*<\/p>/);
  });
  await check('WEB-005 beautify toggle', () => {
    const toggle = w.document.getElementById('styleToggle'); toggle.checked = true;
    toggle.dispatchEvent(new w.Event('change')); assert.match(preview.innerHTML, /style=/);
  });
  await check('WEB-006/007 theme persistence', () => {
    w.document.getElementById('themeToggle').click();
    assert.equal(w.document.documentElement.getAttribute('data-theme'), 'dark');
    assert.equal(w.localStorage.getItem('theme'), 'dark');
  });
  await check('WEB-008 file picker upload', async () => {
    const picker = w.document.getElementById('fileInput');
    Object.defineProperty(picker, 'files', { configurable: true, value: [new w.File(['# Uploaded'], 'test.md', { type: 'text/markdown' })] });
    picker.dispatchEvent(new w.Event('change'));
    await new Promise(resolve => setTimeout(resolve, 50));
    assert.equal(input.value, '# Uploaded'); assert.equal(button.disabled, false);
  });
  await check('WEB-009/010 drag feedback and unsupported file rejection', async () => {
    const editor = w.document.querySelector('.editor-body');
    editor.dispatchEvent(new w.Event('dragenter', { bubbles: true })); assert.equal(editor.classList.contains('dragging'), true);
    const drop = new w.Event('drop', { bubbles: true });
    Object.defineProperty(drop, 'dataTransfer', { value: { files: [new w.File(['bad'], 'image.png', { type: 'image/png' })] } });
    editor.dispatchEvent(drop); await new Promise(resolve => setTimeout(resolve, 50));
    assert.equal(editor.classList.contains('dragging'), false); assert.notEqual(input.value, 'bad');
  });
  await check('WEB-023/024 successful conversion', async () => {
    button.click(); await new Promise(resolve => setTimeout(resolve));
    assert.equal(w.__download, 'converted.docx'); assert.equal(button.disabled, false);
  });
  await check('WEB-025 conversion failure recovery', async () => {
    w.docx.Packer.toBlob = async () => { throw new Error('boom'); };
    button.click(); await new Promise(resolve => setTimeout(resolve));
    assert.equal(w.__alert, 'Conversion failed: boom'); assert.equal(button.textContent.includes('Convert'), true); assert.equal(button.disabled, false);
  });
  await check('WEB-026 dark preview exports light styling', async () => {
    w.docx.Packer.toBlob = async document => { w.__document = document; return new Blob(['docx']); };
    input.value = '## Heading'; input.dispatchEvent(new w.Event('input')); button.click(); await new Promise(resolve => setTimeout(resolve));
    const heading = w.__document.sections[0].children[0].children[0]; assert.equal(heading.color, '1D4ED8');
  });
  await check('WEB-027 GitHub link is isolated', () => {
    const link = w.document.querySelector('.github-link'); assert.equal(link.target, '_blank'); assert.match(link.rel, /noopener/);
  });
  await check('WEB copy preview writes rich clipboard output', async () => {
    input.value = '| A |\n|---|\n| **B** |';
    input.dispatchEvent(new w.Event('input'));
    w.document.getElementById('copyBtn').click();
    await new Promise(resolve => setTimeout(resolve));
    const item = w.__clipboardWrites[0][0];
    const html = await item.value['text/html'].text();
    const plain = await item.value['text/plain'].text();
    assert.match(html, /<table/);
    assert.match(html, /<strong[^>]*>B<\/strong>/);
    assert.doesNotMatch(html, /#1E293B/);
    assert.equal(plain.includes('B'), true);
    assert.equal(w.document.querySelector('.copy-btn-text').textContent, 'Copied');
  });
  await check('WEB-029 Chrome extension CTA opens installation instructions', () => {
    const link = [...w.document.querySelectorAll('a')].find(node => node.textContent === 'Chrome extension');
    assert.equal(link.href, 'https://github.com/pbot-9000-max/Paste-to-Docs#chrome-extension');
  });
  await check('WEB copy does not promise unsupported nested lists', () => {
    const card = [...w.document.querySelectorAll('.feature-card')].find(node => node.textContent.includes('No flat text'));
    assert.doesNotMatch(card.textContent, /Nested/);
  });
  await check('WEB security boundary escapes raw HTML', () => {
    assert.match(w.__test.markdownToHtml('<img src=x onerror=alert(1)>', false), /&lt;img/);
  });
  await check('WEB styled DOCX preserves inline emphasis', () => {
    const children = w.__test.buildDocx('<p><strong>bold</strong></p>', true);
    assert.equal(children[0].children[0].bold, true);
  });
  await check('WEB DOCX creates a real hyperlink', () => {
    const children = w.__test.buildDocx('<p><a href="https://e.test">link</a></p>', false);
    assert.equal(children[0].children[0].link, 'https://e.test');
  });

  const ext = extensionApp();
  const e = ext.dom.window.__test;
  await check('EXT-001/002 source detection', () => {
    assert.equal(e.detectSource('<div data-message-author-role="assistant">x</div>', ''), 'chatgpt');
    assert.equal(e.detectSource('', '# heading'), 'markdown'); assert.equal(e.detectSource('', 'plain text'), null);
  });
  await check('EXT-004/005 HTML cleaning', () => {
    const clean = e.htmlToClean('<script>x</script><h2>Hi</h2><a href="#x">local</a><a href="https://e.test">external</a>', '');
    assert.doesNotMatch(clean, /script|#x/); assert.match(clean, /<h2>Hi<\/h2>/); assert.match(clean, /https:\/\/e.test/);
  });
  await check('EXT-006 markdown conversion', () => {
    const out = e.markdownToHtml('# H\n\n- a\n\n| A |\n|---|\n| B |');
    assert.match(out, /<h1>H<\/h1>/); assert.match(out, /<ul>/); assert.match(out, /<table/);
  });
  await check('EXT security boundary escapes raw HTML', () => {
    assert.match(e.markdownToHtml('<img src=x onerror=alert(1)>'), /&lt;img/);
  });
  await check('EXT-003 ordinary plain paste passes through', async () => {
    let prevented = false;
    await ext.pasteHandler({ clipboardData: { getData: type => type === 'text/plain' ? 'plain' : '' }, preventDefault: () => { prevented = true; }, stopImmediatePropagation() {} });
    assert.equal(prevented, false);
  });
  await check('EXT-007/008 only reports paste when execCommand succeeds', async () => {
    ext.dom.window.document.execCommand = () => false;
    let calls = 0; ext.dom.window.navigator.clipboard.write = async () => { calls++; };
    await ext.pasteHandler({ clipboardData: { getData: type => type === 'text/plain' ? '# H' : '' }, preventDefault() {}, stopImmediatePropagation() {} });
    assert.ok(calls >= 2); assert.match(ext.dom.window.document.body.textContent, /press Ctrl\+V/);
  });
  await new Promise(resolve => setTimeout(resolve, 170));
  await check('EXT-011 usage stats', async () => {
    ext.dom.window.document.execCommand = () => true;
    await ext.pasteHandler({ clipboardData: { getData: type => type === 'text/plain' ? '# Stats' : '' }, preventDefault() {}, stopImmediatePropagation() {} });
    assert.equal(JSON.stringify(ext.writes.at(-1)), JSON.stringify({ count: 1, lastSource: 'markdown' }));
  });
  await check('EXT-010/014 debounce and runtime disable', async () => {
    const isolated = extensionApp();
    const event = { clipboardData: { getData: type => type === 'text/plain' ? '# Once' : '' }, preventDefault() {}, stopImmediatePropagation() {} };
    await Promise.all([isolated.pasteHandler(event), isolated.pasteHandler(event)]);
    assert.equal(isolated.writes.length, 1);
    isolated.messageHandler({ type: 'SET_ENABLED', enabled: false });
    await new Promise(resolve => setTimeout(resolve, 170));
    await isolated.pasteHandler(event); assert.equal(isolated.writes.length, 1);
  });

  const popup = await popupApp();
  const p = popup.dom.window.document;
  await check('EXT-012 popup state', () => {
    assert.equal(p.getElementById('toggle').checked, false); assert.equal(p.getElementById('statusText').textContent, 'Paused');
    assert.equal(p.getElementById('countVal').textContent, '1,234'); assert.equal(p.getElementById('lastSourceVal').textContent, 'ChatGPT');
    assert.equal(p.getElementById('version').textContent, 'v1.2.3');
  });
  await check('EXT-013 popup enable broadcast', async () => {
    const toggle = p.getElementById('toggle'); toggle.checked = true; toggle.dispatchEvent(new popup.dom.window.Event('change'));
    await new Promise(resolve => setTimeout(resolve));
    assert.equal(JSON.stringify(popup.sets), JSON.stringify([{ enabled: true }])); assert.equal(popup.messages.length, 2); assert.equal(p.getElementById('statusText').textContent, 'Active');
  });
  await check('EXT-015 popup GitHub navigation', () => {
    p.getElementById('ghLink').click(); assert.equal(JSON.stringify(popup.created), JSON.stringify([{ url: 'https://github.com/pbot-9000-max/Paste-to-Docs' }]));
  });

  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'extension/manifest.json')));
  await check('EXT-016 manifest scope', () => {
    assert.deepEqual(manifest.content_scripts[0].matches, ['https://docs.google.com/document/*']);
    assert.deepEqual(manifest.host_permissions, ['https://docs.google.com/*']);
  });
  console.log(`\n${checks} checks passed; ${failures.length} failed`);
  if (failures.length) throw new Error(failures.map(([name, message]) => `${name}: ${message}`).join('\n'));
}

run().catch(error => { console.error(`✗ ${error.message}`); process.exitCode = 1; });
