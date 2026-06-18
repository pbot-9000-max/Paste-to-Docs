(function () {
  'use strict';

  // ── Markdown → HTML ──────────────────────────────────────────────────────

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ── Style constants ─────────────────────────────────────────────────────

  var S_light = {
    h1: "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:28px;font-weight:700;color:#111827;letter-spacing:-0.025em;line-height:1.25;margin:40px 0 16px 0;border-bottom:2px solid #E2E8F0;padding-bottom:12px",
    h2: "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:22px;font-weight:700;color:#1D4ED8;letter-spacing:-0.015em;line-height:1.3;margin:32px 0 12px 0",
    h3: "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:17px;font-weight:600;color:#374151;letter-spacing:-0.01em;line-height:1.4;margin:24px 0 10px 0",
    h4: "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;font-weight:600;color:#6B7280;line-height:1.4;margin:20px 0 8px 0",
    p: "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;color:#374151;line-height:1.75;margin:0 0 16px 0",
    inlineCode: "font-family:monospace;font-size:13.5px;background:#F8FAFC;color:#1E293B;padding:2px 6px;border-radius:4px;border:1px solid #E2E8F0",
    codeBlock: "font-family:monospace;font-size:13.5px;color:#1E293B;background:#F8FAFC;border:1px solid #E2E8F0;border-left:3px solid #6366F1;border-radius:0 6px 6px 0;padding:16px 20px;margin:20px 0;display:block;white-space:pre;overflow-x:auto;line-height:1.6",
    codeLang: "font-family:monospace;font-size:10px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;display:block",
    blockquote: "border-left:3px solid #6366F1;background:#F5F3FF;margin:16px 0;padding:12px 18px;border-radius:0 6px 6px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;color:#374151;line-height:1.75",
    ul: "margin:0 0 16px 0;padding-left:24px",
    ol: "margin:0 0 16px 0;padding-left:24px",
    li: "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;color:#374151;line-height:1.75;margin:0 0 6px 0",
    a: "color:#2563EB;text-decoration:underline",
    table: "border-collapse:collapse;margin:20px 0;width:100%;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px",
    th: "background:#F1F5F9;color:#0F172A;font-weight:600;text-align:left;padding:10px 14px;border:1px solid #E2E8F0;letter-spacing:-0.01em",
    td: "color:#374151;padding:9px 14px;border:1px solid #E2E8F0;vertical-align:top;line-height:1.6",
    tdAlt: "color:#374151;padding:9px 14px;border:1px solid #E2E8F0;vertical-align:top;line-height:1.6;background:#FAFBFC",
    hr: "border:none;border-top:1px solid #E2E8F0;margin:32px 0",
  };

  var S_dark = {
    h1: "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:28px;font-weight:700;color:#F8FAFC;letter-spacing:-0.025em;line-height:1.25;margin:40px 0 16px 0;border-bottom:2px solid #334155;padding-bottom:12px",
    h2: "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:22px;font-weight:700;color:#60A5FA;letter-spacing:-0.015em;line-height:1.3;margin:32px 0 12px 0",
    h3: "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:17px;font-weight:600;color:#D1D5DB;letter-spacing:-0.01em;line-height:1.4;margin:24px 0 10px 0",
    h4: "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;font-weight:600;color:#9CA3AF;line-height:1.4;margin:20px 0 8px 0",
    p: "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;color:#D1D5DB;line-height:1.75;margin:0 0 16px 0",
    inlineCode: "font-family:monospace;font-size:13.5px;background:#1E293B;color:#E2E8F0;padding:2px 6px;border-radius:4px;border:1px solid #334155",
    codeBlock: "font-family:monospace;font-size:13.5px;color:#E2E8F0;background:#1E293B;border:1px solid #334155;border-left:3px solid #818CF8;border-radius:0 6px 6px 0;padding:16px 20px;margin:20px 0;display:block;white-space:pre;overflow-x:auto;line-height:1.6",
    codeLang: "font-family:monospace;font-size:10px;color:#6B7280;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;display:block",
    blockquote: "border-left:3px solid #818CF8;background:#1E1B4B;margin:16px 0;padding:12px 18px;border-radius:0 6px 6px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;color:#D1D5DB;line-height:1.75",
    ul: "margin:0 0 16px 0;padding-left:24px",
    ol: "margin:0 0 16px 0;padding-left:24px",
    li: "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;color:#D1D5DB;line-height:1.75;margin:0 0 6px 0",
    a: "color:#60A5FA;text-decoration:underline",
    table: "border-collapse:collapse;margin:20px 0;width:100%;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px",
    th: "background:#1E293B;color:#F1F5F9;font-weight:600;text-align:left;padding:10px 14px;border:1px solid #374151;letter-spacing:-0.01em",
    td: "color:#D1D5DB;padding:9px 14px;border:1px solid #374151;vertical-align:top;line-height:1.6",
    tdAlt: "color:#D1D5DB;padding:9px 14px;border:1px solid #374151;vertical-align:top;line-height:1.6;background:#1E293B",
    hr: "border:none;border-top:1px solid #334155;margin:32px 0",
  };

  var S = S_light;

  function inline(text, styled) {
    var codeStyle = styled ? ' style="' + S.inlineCode + '"' : '';
    var aStyle = styled ? ' style="' + S.a + '"' : '';
    var ss = styled ? ' style="color:inherit"' : '';
    return text
      .replace(/\\([\\`*_{}[\]()#+.!-])/g, '$1')
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong' + ss + '><em' + ss + '>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong' + ss + '>$1</strong>')
      .replace(/__(.+?)__/g, '<strong' + ss + '>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em' + ss + '>$1</em>')
      .replace(/_([^_]+)_/g, '<em' + ss + '>$1</em>')
      .replace(/~~(.+?)~~/g, '<del>$1</del>')
      .replace(/`([^`]+)`/g, '<code' + codeStyle + '>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2"' + aStyle + '>$1</a>');
  }

  function buildTable(lines, styled) {
    const rows = lines.filter(function (l) { return !/^\|[-:| ]+\|$/.test(l.trim()); });
    if (!rows.length) return '';
    var cells = function (r) { return r.split('\\|').join('\x00').split('|').map(function (c) { return c.trim().replace(/\x00/g, '|'); }).filter(Boolean); };
    var head = rows[0];
    var body = rows.slice(1);
    var tableStyle = styled ? ' style="' + S.table + '"' : '';
    var thStyle = styled ? ' style="' + S.th + '"' : '';
    var tdStyle = styled ? ' style="' + S.td + '"' : '';
    var tdAltStyle = styled ? ' style="' + S.tdAlt + '"' : '';
    var ths = cells(head).map(function (c) { return '<th' + thStyle + '>' + inline(c, styled) + '</th>'; }).join('');
    var trs = body.map(function (r, idx) {
      var cellStyle = (idx % 2 === 1) ? tdAltStyle : tdStyle;
      return '<tr>' + cells(r).map(function (c) { return '<td' + cellStyle + '>' + inline(c, styled) + '</td>'; }).join('') + '</tr>';
    }).join('');
    return '<table' + tableStyle + '><thead><tr>' + ths + '</tr></thead><tbody>' + trs + '</tbody></table>';
  }

  function markdownToHtml(text, styled) {
    if (!text) return '';
    var blocks = [];
    var lines = text.split('\n');
    var i = 0;
    var isFirst = true;

    var hStyles = {};
    if (styled) {
      hStyles[1] = ' style="margin:0 0 16px 0;' + S.h1.replace(/margin:[^;]+;/, '') + '"';
      hStyles[2] = ' style="' + S.h2 + '"';
      hStyles[3] = ' style="' + S.h3 + '"';
      hStyles[4] = ' style="' + S.h4 + '"';
      hStyles[5] = '';
      hStyles[6] = '';
    }
    var pStyle = styled ? ' style="' + S.p + '"' : '';
    var bqStyle = styled ? ' style="' + S.blockquote + '"' : '';
    var ulStyle = styled ? ' style="' + S.ul + '"' : '';
    var olStyle = styled ? ' style="' + S.ol + '"' : '';
    var liStyle = styled ? ' style="' + S.li + '"' : '';
    var hrStyle = styled ? ' style="' + S.hr + '"' : '';

    while (i < lines.length) {
      var line = lines[i];

      // Fenced code block
      var fenceM = line.match(/^```(\w*)$/);
      if (fenceM) {
        var lang = fenceM[1];
        var code = [];
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++]);
        if (styled) {
          var langLabel = lang ? '<div style="' + S.codeLang + '">' + esc(lang) + '</div>' : '';
          blocks.push('<div style="position:relative">' + langLabel + '<pre style="' + S.codeBlock + '"><code>' + esc(code.join('\n')) + '</code></pre></div>');
        } else {
          blocks.push('<pre><code>' + esc(code.join('\n')) + '</code></pre>');
        }
        i++;
        isFirst = false;
        continue;
      }

      // ATX heading
      var hM = line.match(/^(#{1,6})\s+(.+)$/);
      if (hM) {
        var lvl = hM[1].length;
        var hStyle = styled ? (hStyles[lvl] || '') : '';
        blocks.push('<h' + lvl + hStyle + '>' + inline(hM[2], styled) + '</h' + lvl + '>');
        i++; isFirst = false; continue;
      }

      // Blockquote
      if (line.startsWith('> ')) {
        var qLines = [];
        while (i < lines.length && lines[i].startsWith('> ')) qLines.push(lines[i++].slice(2));
        blocks.push('<blockquote' + bqStyle + '>' + inline(qLines.join('<br>'), styled) + '</blockquote>');
        isFirst = false;
        continue;
      }

      // Unordered list
      if (/^[ \t]*[-*+] /.test(line)) {
        var items = [];
        while (i < lines.length && /^[ \t]*[-*+] /.test(lines[i]))
          items.push('<li' + liStyle + '>' + inline(lines[i++].replace(/^[ \t]*[-*+] /, ''), styled) + '</li>');
        blocks.push('<ul' + ulStyle + '>' + items.join('') + '</ul>');
        isFirst = false;
        continue;
      }

      // Ordered list
      if (/^[ \t]*\d+\. /.test(line)) {
        items = [];
        while (i < lines.length && /^[ \t]*\d+\. /.test(lines[i]))
          items.push('<li' + liStyle + '>' + inline(lines[i++].replace(/^[ \t]*\d+\. /, ''), styled) + '</li>');
        blocks.push('<ol' + olStyle + '>' + items.join('') + '</ol>');
        isFirst = false;
        continue;
      }

      // Table
      if (line.includes('|') && (lines[i + 1] || '').match(/^\|[-:| ]+\|$/)) {
        var tLines = [];
        while (i < lines.length && lines[i].includes('|')) tLines.push(lines[i++]);
        blocks.push(buildTable(tLines, styled));
        isFirst = false;
        continue;
      }

      // Horizontal rule
      if (/^[-*_]{3,}\s*$/.test(line)) { blocks.push('<hr' + hrStyle + '>'); i++; isFirst = false; continue; }

      // Paragraph
      if (line.trim()) blocks.push('<p' + pStyle + '>' + inline(line, styled) + '</p>');
      i++;
      isFirst = false;
    }
    return blocks.join('');
  }

  // ── HTML → docx ──────────────────────────────────────────────────────────

  var h = docx.HeadingLevel;
  var st = docx.ShadingType;
  var ut = docx.UnderlineType;
  var wt = docx.WidthType;
  var bs = docx.BorderStyle;

  function buildDocx(html, styled) {
    var parser = new DOMParser();
    var dom = parser.parseFromString(html, 'text/html');
    var children = [];
    var isFirstBlock = true;

    for (var el = dom.body.firstElementChild; el; el = el.nextElementSibling) {
      var tag = el.tagName.toLowerCase();
      switch (tag) {
        case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6': {
          var level = parseInt(tag[1]);
          var headingLevel = { 1: h.HEADING_1, 2: h.HEADING_2, 3: h.HEADING_3, 4: h.HEADING_4, 5: h.HEADING_5, 6: h.HEADING_6 }[level];
          var spacing = styled
            ? { before: isFirstBlock && level === 1 ? 0 : 480, after: 240 }
            : { before: 240, after: 120 };
          var headingChildren;
          if (styled) {
            var sizes = { 1: 56, 2: 44, 3: 34, 4: 30, 5: 24, 6: 20 };
            var colors = { 1: '111827', 2: '1D4ED8', 3: '374151', 4: '6B7280', 5: '374151', 6: '374151' };
            headingChildren = [new docx.TextRun({
              text: el.textContent,
              font: 'Calibri',
              size: sizes[level],
              color: colors[level],
              bold: level <= 4,
            })];
          } else {
            headingChildren = extractRuns(el);
          }
          var parOpts = {
            heading: headingLevel,
            spacing: spacing,
            children: headingChildren,
          };
          if (styled && level === 1) {
            parOpts.borders = {
              bottom: { style: bs.SINGLE, size: 4, color: 'E2E8F0' },
            };
          }
          children.push(new docx.Paragraph(parOpts));
          isFirstBlock = false;
          break;
        }
        case 'p':
          if (styled) {
            children.push(new docx.Paragraph({
              spacing: { after: 200 },
              children: [new docx.TextRun({
                text: el.textContent,
                font: 'Calibri',
                size: 22,
                color: '374151',
              })],
            }));
          } else {
            children.push(new docx.Paragraph({
              spacing: { after: 120 },
              children: extractRuns(el),
            }));
          }
          break;
        case 'ul': {
          var lis = el.querySelectorAll(':scope > li');
          for (var j = 0; j < lis.length; j++) {
            if (styled) {
              children.push(new docx.Paragraph({
                spacing: { after: 80 },
                indent: { left: 720, hanging: 360 },
                children: [
                  new docx.TextRun({ text: '\u2022 ', font: 'Symbol', size: 22, color: '374151' }),
                  new docx.TextRun({ text: lis[j].textContent, font: 'Calibri', size: 22, color: '374151' }),
                ],
              }));
            } else {
              children.push(new docx.Paragraph({
                spacing: { after: 60 },
                indent: { left: 720, hanging: 360 },
                children: [new docx.TextRun({ text: '\u2022 ', font: 'Symbol' })].concat(extractRuns(lis[j])),
              }));
            }
          }
          break;
        }
        case 'ol': {
          lis = el.querySelectorAll(':scope > li');
          for (var k = 0; k < lis.length; k++) {
            if (styled) {
              children.push(new docx.Paragraph({
                spacing: { after: 80 },
                indent: { left: 720, hanging: 360 },
                children: [
                  new docx.TextRun({ text: (k + 1) + '. ', font: 'Calibri', size: 22, color: '374151' }),
                  new docx.TextRun({ text: lis[k].textContent, font: 'Calibri', size: 22, color: '374151' }),
                ],
              }));
            } else {
              children.push(new docx.Paragraph({
                spacing: { after: 60 },
                indent: { left: 720, hanging: 360 },
                children: [new docx.TextRun({ text: (k + 1) + '. ' })].concat(extractRuns(lis[k])),
              }));
            }
          }
          break;
        }
        case 'pre': {
          var codeEl = el.tagName === 'PRE' ? el : el.querySelector('pre') || el;
          var code = codeEl.textContent;
          var lines = code.split('\n');
          if (lines[lines.length - 1] === '') lines.pop();
          var codeShading = { type: st.CLEAR, fill: 'F8FAFC' };
          for (var l = 0; l < lines.length; l++) {
            if (styled) {
              children.push(new docx.Paragraph({
                spacing: { before: l === 0 ? 0 : 0, after: l === lines.length - 1 ? 0 : 0, line: 240 },
                indent: { left: 430 },
                shading: codeShading,
                borders: l === 0 ? { left: { style: bs.SINGLE, size: 12, color: '6366F1' } } : { left: { style: bs.SINGLE, size: 12, color: '6366F1' } },
                children: [new docx.TextRun({ text: lines[l], font: 'Consolas', size: 22, color: '1E293B' })],
              }));
            } else {
              children.push(new docx.Paragraph({
                spacing: { before: l === 0 ? 120 : 0, after: l === lines.length - 1 ? 120 : 0, line: 240 },
                indent: { left: 430 },
                shading: { type: st.CLEAR, fill: 'F1F3F4' },
                children: [new docx.TextRun({ text: lines[l], font: 'Consolas', size: 20 })],
              }));
            }
          }
          break;
        }
        case 'blockquote':
          if (styled) {
            children.push(new docx.Paragraph({
              spacing: { before: 160, after: 160 },
              indent: { left: 720, right: 720 },
              shading: { type: st.CLEAR, fill: 'F5F3FF' },
              borders: {
                left: { style: bs.SINGLE, size: 12, color: '6366F1' },
              },
              children: [new docx.TextRun({
                text: el.textContent,
                font: 'Calibri',
                size: 22,
                color: '374151',
              })],
            }));
          } else {
            children.push(new docx.Paragraph({
              spacing: { before: 120, after: 120 },
              indent: { left: 720, right: 720 },
              children: extractRuns(el),
            }));
          }
          break;
        case 'table': {
          var tbl = buildDocxTable(el, styled);
          if (tbl) children.push(tbl);
          break;
        }
        case 'hr':
          if (styled) {
            children.push(new docx.Paragraph({
              spacing: { before: 320, after: 320 },
              borders: {
                bottom: { style: bs.SINGLE, size: 4, color: 'E2E8F0' },
              },
            }));
          } else {
            children.push(new docx.Paragraph({
              spacing: { before: 120, after: 120 },
              thematicBreak: true,
            }));
          }
          break;
        case 'div':
          // styled code block wrapper — unwrap and process child pre
          var pre = el.querySelector('pre');
          if (pre) {
            var code = pre.textContent;
            var lines = code.split('\n');
            if (lines[lines.length - 1] === '') lines.pop();
            for (var m = 0; m < lines.length; m++) {
              children.push(new docx.Paragraph({
                spacing: { before: m === 0 ? 0 : 0, after: m === lines.length - 1 ? 0 : 0, line: 240 },
                indent: { left: 430 },
                shading: { type: st.CLEAR, fill: 'F8FAFC' },
                borders: { left: { style: bs.SINGLE, size: 12, color: '6366F1' } },
                children: [new docx.TextRun({ text: lines[m], font: 'Consolas', size: 22, color: '1E293B' })],
              }));
            }
          }
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

  function buildDocxTable(tableEl, styled) {
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

    var borderColor = styled ? 'E2E8F0' : '999999';
    var rows = rawRows.map(function(tr) { return buildRow(tr, colWidth, styled); });

    return new docx.Table({
      rows: rows,
      width: { size: 100, type: wt.PERCENTAGE },
      columnWidths: Array(numCols).fill(colWidth),
      borders: {
        top:    { style: bs.SINGLE, size: 4, color: borderColor },
        bottom: { style: bs.SINGLE, size: 4, color: borderColor },
        left:   { style: bs.SINGLE, size: 4, color: borderColor },
        right:  { style: bs.SINGLE, size: 4, color: borderColor },
        insideHorizontal: { style: bs.SINGLE, size: 4, color: borderColor },
        insideVertical:   { style: bs.SINGLE, size: 4, color: borderColor },
      },
    });
  }

  function buildRow(tr, colWidth, styled) {
    var cells = [];
    var isHeader = tr.parentElement && (tr.parentElement.tagName === 'THEAD');
    var rowIdx = Array.prototype.indexOf.call(tr.parentElement.children, tr);
    var isAlt = !isHeader && rowIdx % 2 === 1;
    for (var td = tr.firstElementChild; td; td = td.nextElementSibling) {
      var cellIsHeader = td.tagName === 'TH';
      if (styled) {
        cells.push(new docx.TableCell({
          children: [new docx.Paragraph({
            spacing: { before: 40, after: 40 },
            children: [new docx.TextRun({
              text: td.textContent,
              font: 'Calibri',
              size: 22,
              color: cellIsHeader ? '0F172A' : '374151',
              bold: !!cellIsHeader,
            })],
          })],
          shading: cellIsHeader
            ? { type: st.CLEAR, fill: 'F1F5F9' }
            : isAlt
              ? { type: st.CLEAR, fill: 'FAFBFC' }
              : undefined,
        }));
      } else {
        cells.push(new docx.TableCell({
          children: [new docx.Paragraph({
            spacing: { before: 40, after: 40 },
            children: extractRuns(td),
          })],
          shading: cellIsHeader ? { type: st.CLEAR, fill: 'F8F9FA' } : undefined,
        }));
      }
    }
    return new docx.TableRow({ children: cells });
  }

  // ── UI ───────────────────────────────────────────────────────────────────

  var input = document.getElementById('input');
  var btn = document.getElementById('downloadBtn');
  var btnText = btn.querySelector('.btn-text');
  var charCount = document.getElementById('charCount');
  var editorBody = document.querySelector('.editor-body');
  var dropOverlay = document.getElementById('dropOverlay');
  var fileInput = document.getElementById('fileInput');
  var styleToggle = document.getElementById('styleToggle');
  var preview = document.getElementById('preview');
  var previewArea = document.querySelector('.Preview-area');

  var styled = false;

  // ── Theme toggle ─────────────────────────────────────────────────────────

  var themeToggle = document.getElementById('themeToggle');
  var savedTheme = localStorage.getItem('theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var isDarkMode = savedTheme ? savedTheme === 'dark' : prefersDark;
  var html = document.documentElement;
  if (isDarkMode) html.setAttribute('data-theme', 'dark');

  S = isDarkMode ? S_dark : S_light;

  themeToggle.addEventListener('click', function () {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
    S = isDarkMode ? S_dark : S_light;
    updatePreview();
  });

  function updatePreview() {
    var text = input.value.trim();
    if (!text) { preview.innerHTML = ''; preview.className = 'preview-panel'; previewArea.style.display = 'none'; return; }
    S = isDarkMode ? S_dark : S_light;
    preview.className = 'preview-panel' + (styled ? '' : ' doc-preview');
    var html = markdownToHtml(text, styled);
    preview.innerHTML = html;
    previewArea.style.display = 'block';
  }

  function readFile(file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      input.value = e.target.result;
      var len = input.value.length;
      charCount.textContent = len;
      btn.disabled = false;
      dropOverlay.textContent = '';
      dropOverlay.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg><p>Drop .md or .txt file here</p>';
      updatePreview();
    };
    reader.readAsText(file);
  }

  // ── Drag and drop ──────────────────────────────────────

  editorBody.addEventListener('dragenter', function (e) {
    e.preventDefault();
    e.stopPropagation();
    editorBody.classList.add('dragging');
  });

  editorBody.addEventListener('dragover', function (e) {
    e.preventDefault();
    e.stopPropagation();
  });

  editorBody.addEventListener('dragleave', function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.relatedTarget && editorBody.contains(e.relatedTarget)) return;
    editorBody.classList.remove('dragging');
  });

  editorBody.addEventListener('drop', function (e) {
    e.preventDefault();
    e.stopPropagation();
    editorBody.classList.remove('dragging');
    var file = e.dataTransfer.files[0];
    if (!file) return;
    readFile(file);
  });

  // ── File input ─────────────────────────────────────────

  fileInput.addEventListener('change', function () {
    if (!fileInput.files[0]) return;
    readFile(fileInput.files[0]);
    fileInput.value = '';
  });

  // ── Style toggle ───────────────────────────────────────

  styleToggle.addEventListener('change', function () {
    styled = styleToggle.checked;
    updatePreview();
  });

  // ── Input / conversion ─────────────────────────────────

  input.addEventListener('input', function () {
    var len = input.value.length;
    charCount.textContent = len;
    btn.disabled = !input.value.trim();
    btnText.textContent = 'Convert';
    btn.classList.remove('loading');
    updatePreview();
  });

  btn.addEventListener('click', async function () {
    S = S_light; // always produce light-themed docx
    var text = input.value.trim();
    if (!text) return;

    btn.classList.add('loading');
    btnText.textContent = 'Converting\u2026';
    btn.disabled = true;

    try {
      var html = markdownToHtml(text, styled);
      var children = buildDocx(html, styled);

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
      btnText.textContent = 'Download';
    } catch (err) {
      btnText.textContent = 'Convert';
      alert('Conversion failed: ' + err.message);
    } finally {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  });
})();
