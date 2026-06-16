(function () {
  'use strict';

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
    const rows = lines.filter(function (l) { return !/^\|[-:| ]+\|$/.test(l.trim()); });
    if (!rows.length) return '';
    var cells = function (r) { return r.split('\\|').join('\x00').split('|').map(function (c) { return c.trim().replace(/\x00/g, '|'); }).filter(Boolean); };
    var head = rows[0];
    var body = rows.slice(1);
    var ths = cells(head).map(function (c) { return '<th>' + inline(c) + '</th>'; }).join('');
    var trs = body.map(function (r) {
      return '<tr>' + cells(r).map(function (c) { return '<td>' + inline(c) + '</td>'; }).join('') + '</tr>';
    }).join('');
    return '<table><thead><tr>' + ths + '</tr></thead><tbody>' + trs + '</tbody></table>';
  }

  function markdownToHtml(text) {
    if (!text) return '';
    var blocks = [];
    var lines = text.split('\n');
    var i = 0;
    while (i < lines.length) {
      var line = lines[i];

      // Fenced code block
      var fenceM = line.match(/^```(\w*)$/);
      if (fenceM) {
        var lang = fenceM[1];
        var code = [];
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++]);
        blocks.push('<pre><code>' + esc(code.join('\n')) + '</code></pre>');
        i++;
        continue;
      }

      // ATX heading
      var hM = line.match(/^(#{1,6})\s+(.+)$/);
      if (hM) {
        var lvl = hM[1].length;
        blocks.push('<h' + lvl + '>' + inline(hM[2]) + '</h' + lvl + '>');
        i++; continue;
      }

      // Blockquote
      if (line.startsWith('> ')) {
        var qLines = [];
        while (i < lines.length && lines[i].startsWith('> ')) qLines.push(lines[i++].slice(2));
        blocks.push('<blockquote>' + inline(qLines.join('<br>')) + '</blockquote>');
        continue;
      }

      // Unordered list
      if (/^[ \t]*[-*+] /.test(line)) {
        var items = [];
        while (i < lines.length && /^[ \t]*[-*+] /.test(lines[i]))
          items.push('<li>' + inline(lines[i++].replace(/^[ \t]*[-*+] /, '')) + '</li>');
        blocks.push('<ul>' + items.join('') + '</ul>');
        continue;
      }

      // Ordered list
      if (/^[ \t]*\d+\. /.test(line)) {
        items = [];
        while (i < lines.length && /^[ \t]*\d+\. /.test(lines[i]))
          items.push('<li>' + inline(lines[i++].replace(/^[ \t]*\d+\. /, '')) + '</li>');
        blocks.push('<ol>' + items.join('') + '</ol>');
        continue;
      }

      // Table
      if (line.includes('|') && (lines[i + 1] || '').match(/^\|[-:| ]+\|$/)) {
        var tLines = [];
        while (i < lines.length && lines[i].includes('|')) tLines.push(lines[i++]);
        blocks.push(buildTable(tLines));
        continue;
      }

      // Horizontal rule
      if (/^[-*_]{3,}\s*$/.test(line)) { blocks.push('<hr>'); i++; continue; }

      // Paragraph
      if (line.trim()) blocks.push('<p>' + inline(line) + '</p>');
      i++;
    }
    return blocks.join('');
  }

  // ── HTML → docx ──────────────────────────────────────────────────────────

  var h = docx.HeadingLevel;
  var st = docx.ShadingType;
  var ut = docx.UnderlineType;
  var wt = docx.WidthType;
  var bs = docx.BorderStyle;

  function buildDocx(html) {
    var parser = new DOMParser();
    var dom = parser.parseFromString(html, 'text/html');
    var children = [];

    for (var el = dom.body.firstElementChild; el; el = el.nextElementSibling) {
      var tag = el.tagName.toLowerCase();
      switch (tag) {
        case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6': {
          var level = parseInt(tag[1]);
          var headingLevel = { 1: h.HEADING_1, 2: h.HEADING_2, 3: h.HEADING_3, 4: h.HEADING_4, 5: h.HEADING_5, 6: h.HEADING_6 }[level];
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
              shading: { type: st.CLEAR, fill: 'F1F3F4' },
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

  // ── docx helpers ─────────────────────────────────────────────────────────

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
              shading: { type: st.CLEAR, fill: 'F1F3F4' },
            }));
            break;
          case 'a':
            runs.push(new docx.TextRun({
              text: node.textContent,
              color: '1A73E8',
              underline: { type: ut.SINGLE },
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
              shading: { type: st.CLEAR, fill: 'FEEFC0' },
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
    var rawRows = [];
    for (var tr = tableEl.firstElementChild; tr; tr = tr.nextElementSibling) {
      if (tr.tagName === 'THEAD' || tr.tagName === 'TBODY' || tr.tagName === 'TFOOT') {
        for (var row = tr.firstElementChild; row; row = row.nextElementSibling) {
          if (row.tagName === 'TR') rawRows.push(row);
        }
      } else if (tr.tagName === 'TR') {
        rawRows.push(tr);
      }
    }
    if (!rawRows.length) return null;

    var pageWidth = 9360;
    var numCols = rawRows[0].children.length;
    var colWidth = Math.floor(pageWidth / numCols);

    var rows = rawRows.map(function(tr) { return buildRow(tr, colWidth); });

    return new docx.Table({
      rows: rows,
      width: { size: 100, type: wt.PERCENTAGE },
      columnWidths: Array(numCols).fill(colWidth),
      borders: {
        top:    { style: bs.SINGLE, size: 1, color: '999999' },
        bottom: { style: bs.SINGLE, size: 1, color: '999999' },
        left:   { style: bs.SINGLE, size: 1, color: '999999' },
        right:  { style: bs.SINGLE, size: 1, color: '999999' },
        insideHorizontal: { style: bs.SINGLE, size: 1, color: '999999' },
        insideVertical:   { style: bs.SINGLE, size: 1, color: '999999' },
      },
    });
  }

  function buildRow(tr, colWidth) {
    var cells = [];
    for (var td = tr.firstElementChild; td; td = td.nextElementSibling) {
      var isHeader = td.tagName === 'TH';
      cells.push(new docx.TableCell({
        children: [new docx.Paragraph({
          spacing: { before: 40, after: 40 },
          children: extractRuns(td),
        })],
        shading: isHeader ? { type: st.CLEAR, fill: 'F8F9FA' } : undefined,
      }));
    }
    return new docx.TableRow({ children: cells });
  }

  // ── UI ───────────────────────────────────────────────────────────────────

  var input = document.getElementById('input');
  var btn = document.getElementById('downloadBtn');

  input.addEventListener('input', function () {
    btn.disabled = !input.value.trim();
  });

  btn.addEventListener('click', async function () {
    var text = input.value.trim();
    if (!text) return;

    btn.textContent = 'Converting...';
    btn.disabled = true;

    try {
      var html = markdownToHtml(text);
      var children = buildDocx(html);

      var doc = new docx.Document({
        sections: [{ properties: {}, children: children }],
      });

      var blob = await docx.Packer.toBlob(doc);
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'converted.docx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Conversion failed: ' + err.message);
    } finally {
      btn.textContent = 'Download .docx';
      btn.disabled = false;
    }
  });
})();
