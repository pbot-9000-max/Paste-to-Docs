import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';

const PORT = 3333;
const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

const serverStart = Date.now();

async function serve(port) {
  const srv = createServer((req, res) => {
    let file = req.url === '/' ? '/index.html' : req.url.split('?')[0];
    const path = join(process.cwd(), file);
    if (!existsSync(path)) { res.writeHead(404); res.end(); return; }
    const ext = extname(path);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-store, no-cache' });
    res.end(readFileSync(path));
  });
  await new Promise(r => srv.listen(port, r));
  return srv;
}

async function measurePage(url, label) {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'load', timeout: 30000 });

    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoadedEventEnd: nav ? nav.domContentLoadedEventEnd : -1,
        loadEventEnd:             nav ? nav.loadEventEnd : -1,
        domInteractive:           nav ? nav.domInteractive : -1,
        domComplete:              nav ? nav.domComplete : -1,
        responseEnd:              nav ? nav.responseEnd : -1,
        transferSize:             nav ? nav.transferSize : -1,
        encodedBodySize:          nav ? nav.encodedBodySize : -1,
        decodedBodySize:          nav ? nav.decodedBodySize : -1,
      };
    });

    const total = metrics.loadEventEnd;
    console.log(`  ${label}: ${total.toFixed(1)} ms  (DCL: ${metrics.domContentLoadedEventEnd.toFixed(1)} ms, Int: ${metrics.domInteractive.toFixed(1)} ms)`);

    return metrics;
  } finally {
    await browser.close();
  }
}

async function run(iterations = 5) {
  const pages = [
    { url: `http://localhost:${PORT}/`,        label: 'index.html' },
    { url: `http://localhost:${PORT}/extension/popup.html`, label: 'popup.html' },
  ];

  const server = await serve(PORT);
  console.log(`Server running on :${PORT} (startup: ${Date.now() - serverStart}ms)\n`);

  for (const { url, label } of pages) {
    const results = [];
    const all = [];
    for (let i = 0; i < iterations; i++) {
      const m = await measurePage(url, `[${i + 1}/${iterations}] ${label}`);
      results.push(m.loadEventEnd);
      all.push(m);
    }
    const avg = results.reduce((a, b) => a + b, 0) / results.length;
    const min = Math.min(...results);
    const max = Math.max(...results);
    const pass = avg <= 50;
    const status = pass ? '✓ PASS' : '✗ FAIL';
    const note = pass ? '' : ` (need ${(avg - 50).toFixed(1)} ms improvement)`;
    console.log(`\n  === ${label} (${iterations} runs, avg) ===`);
    console.log(`    Load: ${avg.toFixed(1)} ms  [min: ${min.toFixed(1)}, max: ${max.toFixed(1)}]  ${status}${note}`);
    console.log(`    DOMContentLoaded (avg): ${(all.reduce((a, m) => a + m.domContentLoadedEventEnd, 0) / all.length).toFixed(1)} ms`);
    console.log(`    DOM Interactive (avg):  ${(all.reduce((a, m) => a + m.domInteractive, 0) / all.length).toFixed(1)} ms`);
  }

  server.close();
}

run(parseInt(process.argv[2]) || 5).catch(e => { console.error(e); process.exit(1); });
