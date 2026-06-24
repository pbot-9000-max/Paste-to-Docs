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
    TextRun: Item, Paragraph: Item, Table: Item, TableCell: Item, TableRow: Item,
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
  window.alert = () => {};
  window.docx = docxStub();
  window.URL.createObjectURL = () => 'blob:test';
  window.URL.revokeObjectURL = () => {};
  window.HTMLAnchorElement.prototype.click = function () { window.__download = this.download; };
  const source = expose(fs.readFileSync(path.join(root, 'app.js'), 'utf8'),
    ['markdownToHtml', 'buildDocx', 'extractRuns', 'buildDocxTable']);
  window.eval(source);
  return dom;
}

function extensionApp() {
  const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://docs.google.com/document/d/test', runScripts: 'outside-only' });
  const { window } = dom;
  let pasteHandler;
  const originalAdd = window.document.addEventListener.bind(window.document);
  window.document.addEventListener = (type, handler, options) => {
    if (type === 'paste') pasteHandler = handler;
    return originalAdd(type, handler, options);
  };
  window.chrome = {
    storage: { sync: { get: (_defaults, callback) => callback({ enabled: true, count: 0 }), set: () => {} } },
    runtime: { onMessage: { addListener: () => {} } },
  };
  window.navigator.clipboard = { write: async () => {} };
  window.ClipboardItem = class { constructor(value) { this.value = value; } };
  window.document.execCommand = () => true;
  const source = expose(fs.readFileSync(path.join(root, 'extension/content.js'), 'utf8'),
    ['detectSource', 'htmlToClean', 'walkNode', 'markdownToHtml', 'inline', 'buildTable', 'onPaste']);
  window.eval(source);
  return { dom, pasteHandler };
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
  await check('WEB-023/024 successful conversion', async () => {
    button.click(); await new Promise(resolve => setTimeout(resolve));
    assert.equal(w.__download, 'converted.docx'); assert.equal(button.disabled, false);
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
    assert.equal(children[0].children[0].href, 'https://e.test');
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
    assert.ok(calls >= 2);
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
