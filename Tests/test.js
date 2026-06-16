const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const docx = require('docx');

const window = new JSDOM('', { contentType: 'text/html' }).window;
const { HeadingLevel, ShadingType, UnderlineType, WidthType, BorderStyle } = docx;

// ── Markdown → HTML ──────────────────────────────────────────────────────

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inline(text) {
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_([^_]+)_/g, '<em>$1</em>')
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function buildTable(lines) {
  const rows = lines.filter(l => !/^\|[-:| ]+\|$/.test(l.trim()));
  if (!rows.length) return '';
    var cells = r => r.split('\\|').join('\x00').split('|').map(c => c.trim().replace(/\x00/g, '|')).filter(Boolean);
  var head = rows[0];
  var body = rows.slice(1);
  var ths = cells(head).map(c => '<th>' + inline(c) + '</th>').join('');
  var trs = body.map(r =>
    '<tr>' + cells(r).map(c => '<td>' + inline(c) + '</td>').join('') + '</tr>'
  ).join('');
  return '<table><thead><tr>' + ths + '</tr></thead><tbody>' + trs + '</tbody></table>';
}

function markdownToHtml(text) {
  if (!text) return '';
  var blocks = [];
  var lines = text.split('\n');
  var i = 0;
  while (i < lines.length) {
    var line = lines[i];

    var fenceM = line.match(/^```(\w*)$/);
    if (fenceM) {
      var code = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++]);
      blocks.push('<pre><code>' + esc(code.join('\n')) + '</code></pre>');
      i++;
      continue;
    }

    var hM = line.match(/^(#{1,6})\s+(.+)$/);
    if (hM) {
      var lvl = hM[1].length;
      blocks.push('<h' + lvl + '>' + inline(hM[2]) + '</h' + lvl + '>');
      i++; continue;
    }

    if (line.startsWith('> ')) {
      var qLines = [];
      while (i < lines.length && lines[i].startsWith('> ')) qLines.push(lines[i++].slice(2));
      blocks.push('<blockquote>' + inline(qLines.join('<br>')) + '</blockquote>');
      continue;
    }

    if (/^[ \t]*[-*+] /.test(line)) {
      var items = [];
      while (i < lines.length && /^[ \t]*[-*+] /.test(lines[i]))
        items.push('<li>' + inline(lines[i++].replace(/^[ \t]*[-*+] /, '')) + '</li>');
      blocks.push('<ul>' + items.join('') + '</ul>');
      continue;
    }

    if (/^[ \t]*\d+\. /.test(line)) {
      items = [];
      while (i < lines.length && /^[ \t]*\d+\. /.test(lines[i]))
        items.push('<li>' + inline(lines[i++].replace(/^[ \t]*\d+\. /, '')) + '</li>');
      blocks.push('<ol>' + items.join('') + '</ol>');
      continue;
    }

    if (line.includes('|') && (lines[i + 1] || '').match(/^\|[-:| ]+\|$/)) {
      var tLines = [];
      while (i < lines.length && lines[i].includes('|')) tLines.push(lines[i++]);
      blocks.push(buildTable(tLines));
      continue;
    }

    if (/^[-*_]{3,}\s*$/.test(line)) { blocks.push('<hr>'); i++; continue; }

    if (line.trim()) blocks.push('<p>' + inline(line) + '</p>');
    i++;
  }
  return blocks.join('');
}

// ── HTML → docx ──────────────────────────────────────────────────────────

function buildDocx(html) {
  var parser = new window.DOMParser();
  var dom = parser.parseFromString(html, 'text/html');
  var children = [];

  for (var el = dom.body.firstElementChild; el; el = el.nextElementSibling) {
    var tag = el.tagName.toLowerCase();
    switch (tag) {
      case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6': {
        var level = parseInt(tag[1]);
        var headingLevel = { 1: HeadingLevel.HEADING_1, 2: HeadingLevel.HEADING_2, 3: HeadingLevel.HEADING_3, 4: HeadingLevel.HEADING_4, 5: HeadingLevel.HEADING_5, 6: HeadingLevel.HEADING_6 }[level];
        children.push(new docx.Paragraph({
          heading: headingLevel,
          spacing: { before: 240, after: 120 },
          children: extractRuns(el),
        }));
        break;
      }
      case 'p':
        children.push(new docx.Paragraph({
          spacing: { after: 120 },
          children: extractRuns(el),
        }));
        break;
      case 'ul': {
        var lis = el.querySelectorAll(':scope > li');
        for (var j = 0; j < lis.length; j++) {
          children.push(new docx.Paragraph({
            spacing: { after: 60 },
            indent: { left: 720, hanging: 360 },
            children: [new docx.TextRun({ text: '\u2022 ', font: 'Symbol' })].concat(extractRuns(lis[j])),
          }));
        }
        break;
      }
      case 'ol': {
        lis = el.querySelectorAll(':scope > li');
        for (var k = 0; k < lis.length; k++) {
          children.push(new docx.Paragraph({
            spacing: { after: 60 },
            indent: { left: 720, hanging: 360 },
            children: [new docx.TextRun({ text: (k + 1) + '. ' })].concat(extractRuns(lis[k])),
          }));
        }
        break;
      }
      case 'pre': {
        var code = el.textContent;
        var lines = code.split('\n');
        if (lines[lines.length - 1] === '') lines.pop();
        for (var l = 0; l < lines.length; l++) {
          children.push(new docx.Paragraph({
            spacing: {
              before: l === 0 ? 120 : 0,
              after:  l === lines.length - 1 ? 120 : 0,
              line: 240,
            },
            indent: { left: 430 },
            shading: { type: ShadingType.CLEAR, fill: 'F1F3F4' },
            children: [new docx.TextRun({ text: lines[l], font: 'Consolas', size: 20 })],
          }));
        }
        break;
      }
      case 'blockquote':
        children.push(new docx.Paragraph({
          spacing: { before: 120, after: 120 },
          indent: { left: 720, right: 720 },
          children: extractRuns(el),
        }));
        break;
      case 'table': {
        var tbl = buildDocxTable(el);
        if (tbl) children.push(tbl);
        break;
      }
      case 'hr':
        children.push(new docx.Paragraph({
          spacing: { before: 120, after: 120 },
          thematicBreak: true,
        }));
        break;
    }
  }
  return children;
}

function extractRuns(parent) {
  var runs = [];
  for (var node = parent.firstChild; node; node = node.nextSibling) {
    if (node.nodeType === 3) {
      runs.push(new docx.TextRun({ text: node.textContent }));
    } else if (node.nodeType === 1) {
      var tag = node.tagName.toLowerCase();
      switch (tag) {
        case 'strong': case 'b':
          runs.push(new docx.TextRun({ text: node.textContent, bold: true }));
          break;
        case 'em': case 'i':
          runs.push(new docx.TextRun({ text: node.textContent, italics: true }));
          break;
        case 'code':
          runs.push(new docx.TextRun({
            text: node.textContent,
            font: 'Consolas',
            shading: { type: ShadingType.CLEAR, fill: 'F1F3F4' },
          }));
          break;
        case 'a':
          runs.push(new docx.TextRun({
            text: node.textContent,
            color: '1A73E8',
            underline: { type: UnderlineType.SINGLE },
          }));
          break;
        case 'del': case 's':
          runs.push(new docx.TextRun({ text: node.textContent, strike: true }));
          break;
        case 'sup':
          runs.push(new docx.TextRun({ text: node.textContent, superScript: true }));
          break;
        case 'sub':
          runs.push(new docx.TextRun({ text: node.textContent, subScript: true }));
          break;
        case 'mark':
          runs.push(new docx.TextRun({
            text: node.textContent,
            shading: { type: ShadingType.CLEAR, fill: 'FEEFC0' },
          }));
          break;
        default:
          runs.push(new docx.TextRun({ text: node.textContent }));
      }
    }
  }
  return runs;
}

function buildDocxTable(tableEl) {
  var rows = [];
  for (var tr = tableEl.firstElementChild; tr; tr = tr.nextElementSibling) {
    if (tr.tagName === 'THEAD' || tr.tagName === 'TBODY' || tr.tagName === 'TFOOT') {
      for (var row = tr.firstElementChild; row; row = row.nextElementSibling) {
        if (row.tagName === 'TR') rows.push(row);
      }
    } else if (tr.tagName === 'TR') {
      rows.push(tr);
    }
  }
  if (!rows.length) return null;

  var numCols = rows[0].children.length;
  var pageWidth = 9360;
  var colWidth = Math.floor(pageWidth / numCols);

  var tblRows = rows.map(function(tr) {
    var cells = [];
    for (var td = tr.firstElementChild; td; td = td.nextElementSibling) {
      var isHeader = td.tagName === 'TH';
      cells.push(new docx.TableCell({
        children: [new docx.Paragraph({
          spacing: { before: 40, after: 40 },
          children: extractRuns(td),
        })],
        shading: isHeader ? { type: ShadingType.CLEAR, fill: 'F8F9FA' } : undefined,
      }));
    }
    return new docx.TableRow({ children: cells });
  });

  return new docx.Table({
    rows: tblRows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: Array(numCols).fill(colWidth),
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 4, color: '999999' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: '999999' },
      left:   { style: BorderStyle.SINGLE, size: 4, color: '999999' },
      right:  { style: BorderStyle.SINGLE, size: 4, color: '999999' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: '999999' },
      insideVertical:   { style: BorderStyle.SINGLE, size: 4, color: '999999' },
    },
  });
}

// ── Main ─────────────────────────────────────────────────────────────────

async function main() {
  var mdPath = path.join(__dirname, 'test.md');
  var outputDir = path.join(__dirname, '..', 'Outputs');
  var outputPath = path.join(outputDir, 'test.docx');

  var markdown = fs.readFileSync(mdPath, 'utf8');
  var html = markdownToHtml(markdown);
  fs.writeFileSync(path.join(outputDir, 'test.html'), html);
  var children = buildDocx(html);

  var doc = new docx.Document({
    sections: [{ properties: {}, children }],
  });

  var buffer = await docx.Packer.toBuffer(doc);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, Buffer.from(buffer));
  console.log('✓ Generated ' + outputPath);
}

main().catch(function(err) {
  console.error('Error:', err.message);
  process.exit(1);
});
