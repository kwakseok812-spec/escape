/* ============================================================================
 * art.js — L3 소재 패키지의 그림(전부 코드 SVG). 시험판은 코드 그림, 나중에 배경만 그림 파일로 갈아 끼운다.
 *   bgXxx(core)   : 벽 배경(800×1000). 그림 파일로 바뀌는 대상(ART_SPEC.md)
 *   pXxx(core)    : 벽 위에 얹는 층(달력 숫자·쪽지·줍는 물건 등, 상태에 따라 바뀜) — 배경이 그림이어도 그대로 얹힘
 *   zXxx(core)    : 확대 장면(800×800), 전부 코드
 *   ico(id,core)  : 소지품 아이콘(100×100)
 * ==========================================================================*/
(function (root) {
  'use strict';
  var ESC = root.ESC = root.ESC || {};
  var A = {}, F = 'font-family="Pretendard,Noto Sans KR,Malgun Gothic,sans-serif"', SERIF = 'font-family="Noto Serif KR,Batang,serif"';
  var COL = { red: '#e0483c', orange: '#ec8a3c', green: '#4fbf7a', blue: '#4f9cf0', violet: '#9b6cf0' };
  var SYM = ['circle', 'tri', 'square', 'star', 'cross', 'wave'], SYMKO = ['동그라미', '세모', '네모', '별', '십자', '물결'];
  var WD = ['일', '월', '화', '수', '목', '금', '토'];

  function rect(x, y, w, h, fill, extra) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + fill + '" ' + (extra || '') + '/>'; }
  function txt(x, y, s, size, fill, extra) { return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + fill + '" ' + F + ' ' + (extra || '') + '>' + s + '</text>'; }
  function defs() {
    return '<defs>' +
      '<linearGradient id="gW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34454d"/><stop offset="1" stop-color="#232f35"/></linearGradient>' +
      '<linearGradient id="gF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2327"/><stop offset="1" stop-color="#0e1214"/></linearGradient>' +
      '<linearGradient id="gWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a5632"/><stop offset="1" stop-color="#4d3520"/></linearGradient>' +
      '<linearGradient id="gMetal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a7b2bb"/><stop offset="1" stop-color="#6c7882"/></linearGradient>' +
      '<linearGradient id="gGlass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#bfe6ea" stop-opacity=".55"/><stop offset=".5" stop-color="#e9fbff" stop-opacity=".25"/><stop offset="1" stop-color="#8fc8d0" stop-opacity=".5"/></linearGradient>' +
      '<linearGradient id="gCult" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#58b862"/><stop offset="1" stop-color="#2b7a3a"/></linearGradient>' +
      '<radialGradient id="gLamp" cx=".85" cy=".02" r=".9"><stop offset="0" stop-color="#ff6a3d" stop-opacity=".55"/><stop offset=".45" stop-color="#ff6a3d" stop-opacity=".12"/><stop offset="1" stop-color="#ff6a3d" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="gVig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".62"/></radialGradient>' +
      '<radialGradient id="gZ" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="#2c3a42"/><stop offset="1" stop-color="#10171b"/></radialGradient>' +
      '</defs>';
  }
  function shell(wallFill) {
    return rect(0, 0, 800, 700, wallFill || 'url(#gW)') + rect(0, 700, 800, 300, 'url(#gF)') + rect(0, 688, 800, 16, '#141b1f') +
      '<path d="M0 704 L800 704" stroke="#3b4a52" stroke-width="2"/>' +
      '<g stroke="#1b2327" stroke-width="2" opacity=".6"><path d="M400 704 L-200 1000 M400 704 L180 1000 M400 704 L620 1000 M400 704 L1000 1000"/></g>';
  }
  function lampLight(x) { x = x || 640; return rect(x, 14, 112, 46, '#10171b', 'rx="8"') + rect(x + 8, 22, 96, 30, '#ff7a4a', 'rx="6" opacity=".92"') + '<ellipse cx="' + (x + 56) + '" cy="36" rx="150" ry="120" fill="url(#gLamp)"/>'; }
  function finish() { return '<rect width="800" height="1000" fill="url(#gVig)"/><rect width="800" height="1000" fill="#04080c" opacity=".16"/>'; }

  /* ================= 도형 부품 ================= */
  function strainIcon(id, cx, cy, r) {
    var s = '<g transform="translate(' + cx + ' ' + cy + ')">';
    if (id === 'chlorella') s += '<circle r="' + r + '" fill="#4fae5a" stroke="#2c7a3a" stroke-width="3"/><circle r="' + r * 0.35 + '" fill="#2c7a3a"/>';
    else if (id === 'chlamydomonas') s += '<ellipse rx="' + r + '" ry="' + r * 0.8 + '" fill="#58b862" stroke="#2c7a3a" stroke-width="3"/><circle cx="' + -r * 0.35 + '" cy="' + -r * 0.1 + '" r="' + r * 0.14 + '" fill="#d8392c"/><path d="M' + r + ' 0 q' + r * 0.6 + ' -' + r * 0.7 + ' ' + r * 0.9 + ' -' + r * 0.2 + ' M' + r + ' 0 q' + r * 0.6 + ' ' + r * 0.5 + ' ' + r * 0.9 + ' ' + r * 0.3 + '" stroke="#2c7a3a" stroke-width="3" fill="none"/>';
    else if (id === 'haematococcus') s += '<circle r="' + r + '" fill="#8a9a45" stroke="#5a6b2a" stroke-width="3"/><circle cx="' + -r * 0.3 + '" cy="' + -r * 0.2 + '" r="' + r * 0.2 + '" fill="#c0392b"/><circle cx="' + r * 0.3 + '" cy="' + r * 0.25 + '" r="' + r * 0.18 + '" fill="#c0392b"/><circle cx="' + r * 0.1 + '" cy="' + -r * 0.4 + '" r="' + r * 0.12 + '" fill="#c0392b"/>';
    else if (id === 'dunaliella') s += '<ellipse rx="' + r * 0.8 + '" ry="' + r + '" fill="#6dbf5a" stroke="#2c7a3a" stroke-width="3"/><path d="M0 ' + -r + ' q-' + r * 0.4 + ' -' + r * 0.6 + ' -' + r * 0.2 + ' -' + r * 0.9 + ' M0 ' + -r + ' q' + r * 0.4 + ' -' + r * 0.6 + ' ' + r * 0.2 + ' -' + r * 0.9 + '" stroke="#2c7a3a" stroke-width="3" fill="none"/>';
    else if (id === 'nannochloropsis') s += '<ellipse rx="' + r * 0.7 + '" ry="' + r * 0.45 + '" fill="#2f7d4f" stroke="#1c5a36" stroke-width="3"/><circle cx="' + r * 0.2 + '" r="' + r * 0.16 + '" fill="#d6c24a"/>';
    else s += [-1.5, -0.5, 0.5, 1.5].map(function (k) { return '<ellipse cx="' + k * r * 0.62 + '" rx="' + r * 0.28 + '" ry="' + r * 0.6 + '" fill="#5cb85c" stroke="#2c7a3a" stroke-width="2.5"/>'; }).join('');
    return s + '</g>';
  }
  function symbol(i, cx, cy, r, fill) {
    var f = fill || '#e9eef1', s = '<g transform="translate(' + cx + ' ' + cy + ')" fill="none" stroke="' + f + '" stroke-width="' + Math.max(3, r * 0.16) + '" stroke-linecap="round" stroke-linejoin="round">';
    if (i === 0) s += '<circle r="' + r + '"/>'; else if (i === 1) s += '<path d="M0 ' + -r + ' L' + r + ' ' + r * 0.8 + ' L' + -r + ' ' + r * 0.8 + ' Z"/>';
    else if (i === 2) s += '<rect x="' + -r * 0.9 + '" y="' + -r * 0.9 + '" width="' + r * 1.8 + '" height="' + r * 1.8 + '"/>';
    else if (i === 3) { var p = []; for (var k = 0; k < 10; k++) { var a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * 0.45 : r; p.push((Math.cos(a) * rr).toFixed(1) + ' ' + (Math.sin(a) * rr).toFixed(1)); } s += '<path d="M' + p.join(' L') + ' Z"/>'; }
    else if (i === 4) s += '<path d="M' + -r + ' 0 H' + r + ' M0 ' + -r + ' V' + r + '"/>'; else s += '<path d="M' + -r + ' 0 q' + r * 0.5 + ' ' + -r * 0.8 + ' ' + r + ' 0 t' + r + ' 0"/>';
    return s + '</g>';
  }
  function pin(cx, cy, s) { return '<g transform="translate(' + cx + ' ' + cy + ') scale(' + (s || 1) + ')"><circle r="15" fill="#d8392c" stroke="#7a1a12" stroke-width="2.5"/><circle cx="-4" cy="-4" r="4" fill="#ff9b8e"/><path d="M0 14 L0 30" stroke="#7a7a7a" stroke-width="4"/></g>'; }
  function ringIcon(cx, cy, r) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#e0483c" stroke-width="' + Math.max(3, r / 5) + '"/>'; }
  function sqIcon(cx, cy, r) { return '<rect x="' + (cx - r) + '" y="' + (cy - r) + '" width="' + r * 2 + '" height="' + r * 2 + '" fill="none" stroke="#4f9cf0" stroke-width="' + Math.max(3, r / 5) + '"/>'; }
  function arrow(x1, y1, x2, y2, col, w, dash) {
    var a = Math.atan2(y2 - y1, x2 - x1), h = 12 + (w || 4) * 1.5, p1 = [x2 - h * Math.cos(a - 0.45), y2 - h * Math.sin(a - 0.45)], p2 = [x2 - h * Math.cos(a + 0.45), y2 - h * Math.sin(a + 0.45)];
    return '<g stroke="' + col + '" stroke-width="' + (w || 4) + '" stroke-linecap="round" fill="none"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + '><path d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + '"/></g><path d="M' + x2 + ' ' + y2 + ' L' + p1[0] + ' ' + p1[1] + ' L' + p2[0] + ' ' + p2[1] + ' Z" fill="' + col + '"/>';
  }
  function dirArrow(d, cx, cy, s, col) {
    var v = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] }[d]; return arrow(cx - v[0] * s, cy - v[1] * s, cx + v[0] * s, cy + v[1] * s, col || '#f3e9d8', Math.max(4, s / 3));
  }

  /* 달력 그림(실제 요일 배열) — x,y,w,h 안에 그린다 */
  function calendar(c, x, y, w, h, opt) {
    opt = opt || {};
    var rows = Math.ceil((c.first + c.dim) / 7), hh = h * 0.16, top = y + hh + h * 0.07, cw = w / 7, ch = (h - (top - y) - h * 0.02) / rows, s = '';
    s += rect(x, y, w, h, opt.paper || '#f3f0e6', 'rx="6" stroke="#b8b09c" stroke-width="2"') + rect(x, y, w, hh, opt.head || '#4a6a8a', 'rx="6"');
    s += txt(x + w / 2, y + hh * 0.72, (c.month + 1) + '월', hh * 0.6, '#fff', 'text-anchor="middle" font-weight="800"');
    for (var i = 0; i < 7; i++) s += txt(x + cw * (i + 0.5), y + hh + h * 0.055, WD[i], h * 0.05, i === 0 ? '#c0392b' : (i === 6 ? '#2c6ea8' : '#5a5448'), 'text-anchor="middle" font-weight="700"');
    var xs = {}; (c.xs || []).forEach(function (d) { xs[d] = 1; });
    for (var d = 1; d <= c.dim; d++) {
      var idx = c.first + d - 1, col = idx % 7, row = Math.floor(idx / 7), cx = x + cw * (col + 0.5), cy = top + ch * (row + 0.5);
      s += txt(cx, cy + h * 0.022, d, Math.min(cw, ch) * 0.46, col === 0 ? '#c0392b' : (col === 6 ? '#2c6ea8' : '#3a362e'), 'text-anchor="middle" font-weight="700"');
      if (xs[d]) s += '<path d="M' + (cx - cw * 0.32) + ' ' + (cy - ch * 0.32) + ' L' + (cx + cw * 0.32) + ' ' + (cy + ch * 0.32) + ' M' + (cx + cw * 0.32) + ' ' + (cy - ch * 0.32) + ' L' + (cx - cw * 0.32) + ' ' + (cy + ch * 0.32) + '" stroke="#3a362e" stroke-width="' + Math.max(2, cw * 0.06) + '" stroke-linecap="round" opacity=".75"/>';
      if (c.circle === d) s += ringIcon(cx, cy, Math.min(cw, ch) * 0.46);
      if (c.square === d) s += sqIcon(cx, cy, Math.min(cw, ch) * 0.42);
      if (c.pin === d) s += pin(cx + cw * 0.18, cy - ch * 0.22, Math.min(cw, ch) / 48);
    }
    return s;
  }
  /* 그림 쪽지: 균주 배열 조건 */
  function consPic(c, x, y, w) {
    var s = '', cell = w / 4.6, gap = cell * 0.2, name = function (id) { return ESC.parts.STRAINS.filter(function (q) { return q.id === id; })[0].ko; };
    if (c.t === 'notEnd') {
      for (var i = 0; i < 4; i++) s += rect(x + i * (cell + gap), y, cell, cell, '#fffdf2', 'rx="8" stroke="#b9ad8a" stroke-width="3"');
      [0, 3].forEach(function (i) { var cx = x + i * (cell + gap) + cell / 2, cy = y + cell / 2; s += strainIcon(c.s, cx, cy, cell * 0.28) + '<path d="M' + (cx - cell * 0.36) + ' ' + (cy - cell * 0.36) + ' L' + (cx + cell * 0.36) + ' ' + (cy + cell * 0.36) + ' M' + (cx + cell * 0.36) + ' ' + (cy - cell * 0.36) + ' L' + (cx - cell * 0.36) + ' ' + (cy + cell * 0.36) + '" stroke="#d8392c" stroke-width="7" stroke-linecap="round"/>'; });
      s += txt(x + w / 2, y + cell + cell * 0.45, name(c.s), cell * 0.32, '#3a362e', 'text-anchor="middle" font-weight="700"');
    } else if (c.t === 'leftOf') {
      var ax = x + cell * 0.6, bx = x + w - cell * 0.6, cy = y + cell / 2;
      s += strainIcon(c.a, ax, cy, cell * 0.36) + strainIcon(c.b, bx, cy, cell * 0.36) + arrow(ax + cell * 0.55, cy, bx - cell * 0.6, cy, '#3a362e', 6, '2 14');
      s += txt(ax, y + cell + cell * 0.3, name(c.a), cell * 0.3, '#3a362e', 'text-anchor="middle" font-weight="700"') + txt(bx, y + cell + cell * 0.3, name(c.b), cell * 0.3, '#3a362e', 'text-anchor="middle" font-weight="700"');
    } else {
      var mx = x + w / 2 - cell * 0.5, cy2 = y + cell / 2;
      s += rect(mx - cell * 0.55, y, cell * 1.1, cell, '#fffdf2', 'rx="8" stroke="#b9ad8a" stroke-width="3"') + rect(mx + cell * 0.55, y, cell * 1.1, cell, '#fffdf2', 'rx="8" stroke="#b9ad8a" stroke-width="3"');
      s += strainIcon(c.a, mx, cy2, cell * 0.3) + strainIcon(c.b, mx + cell * 1.1, cy2, cell * 0.3) + arrow(mx + cell * 0.18, y + cell * 1.2, mx + cell * 1.0, y + cell * 1.2, '#3a362e', 6);
      s += txt(mx, y + cell + cell * 0.7, name(c.a), cell * 0.3, '#3a362e', 'text-anchor="middle" font-weight="700"') + txt(mx + cell * 1.1, y + cell + cell * 0.7, name(c.b), cell * 0.3, '#3a362e', 'text-anchor="middle" font-weight="700"');
    }
    return s;
  }
  function paperNote(x, y, w, h, rot, fill) { return '<g transform="rotate(' + (rot || 0) + ' ' + (x + w / 2) + ' ' + (y + h / 2) + ')"><rect x="' + (x + 4) + '" y="' + (y + 6) + '" width="' + w + '" height="' + h + '" fill="#000" opacity=".3" rx="4"/>' + rect(x, y, w, h, fill || '#fff6b8', 'rx="4"') + '</g>'; }
  function zbg() { return rect(0, 0, 800, 800, 'url(#gZ)'); }
  function zfin() { return '<rect width="800" height="800" fill="url(#gVig)" opacity=".7"/>'; }

  /* ===================== 벽 배경 ===================== */
  A.bgDesk = function () {
    var s = shell();
    s += rect(330, 130, 320, 262, '#2a1f14', 'rx="8"') + rect(340, 140, 300, 242, '#a37a4a', 'rx="4"');                        // 코르크판
    for (var i = 0; i < 60; i++) s += '<circle cx="' + (345 + (i * 53) % 290) + '" cy="' + (145 + (i * 37) % 230) + '" r="3" fill="#8b6538" opacity=".6"/>';
    s += rect(112, 130, 176, 300, '#1a1a1a', 'rx="4" opacity=".4"') + rect(118, 150, 164, 270, '#e9e5d6', 'rx="3"') + rect(118, 136, 164, 30, '#4a6a8a', 'rx="3"') + '<circle cx="200" cy="130" r="6" fill="#555"/>';   // 빈 달력
    s += '<path d="M70 590 L730 590 L742 566 L58 566 Z" fill="url(#gWood)"/>' + rect(58, 566, 684, 16, '#8a6238') + rect(70, 590, 660, 8, '#3a2816');           // 책상 상판
    s += rect(88, 598, 26, 272, '#3a2816') + rect(440, 598, 292, 280, '#4b3520') + rect(440, 598, 292, 8, '#2d1f12');
    [606, 696, 786].forEach(function (y, k) { s += rect(450, y, 272, 80, 'url(#gWood)', 'rx="4" stroke="#2d1f12" stroke-width="3"') + rect(560, y + 30, 52, 12, '#b9b9b9', 'rx="6"'); if (k === 1) s += '<circle cx="586" cy="' + (y + 56) + '" r="6" fill="#222"/><rect x="583" y="' + (y + 56) + '" width="6" height="12" fill="#222"/>'; });
    s += rect(110, 500, 120, 66, '#3a4a5a', 'rx="8"') + rect(110, 500, 120, 14, '#556b7f', 'rx="6"');                                        // 필통
    s += rect(300, 520, 140, 46, '#efe9d2', 'rx="3"') + rect(300, 560, 140, 6, '#c9c3a8');                                                        // 메모지(빈)
    s += rect(578, 540, 84, 26, '#2b3338', 'rx="6"') + '<path d="M620 540 L600 440 L676 410" stroke="#3d484e" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M650 400 L700 430 L690 460 L640 430 Z" fill="#3d484e"/>';  // 꺼진 스탠드
    s += lampLight();
    return s + finish();
  };
  A.bgShelf = function () {
    var s = shell('#2f3b3f');
    s += rect(48, 90, 380, 800, '#3a2816', 'rx="6"') + rect(58, 100, 360, 780, '#241a10');
    for (var r = 0; r < 5; r++) { s += rect(58, 100 + 156 * r + 148, 360, 12, '#6a4a2a'); var x = 70, k = 0; while (x < 400) { var w = 22 + (r * 7 + k * 5) % 18, h = 90 + (r * 13 + k * 11) % 40, hue = ['#6a2a2a', '#2a4a6a', '#3a5a3a', '#7a6a2a', '#5a3a6a'][(r + k) % 5]; s += rect(x, 100 + 156 * r + 148 - h, w, h, hue, 'rx="2"') + rect(x + 3, 100 + 156 * r + 148 - h + 8, w - 6, 4, '#e3b04b', 'opacity=".5"'); x += w + 3; k++; } }
    s += rect(560, 100, 240, 310, '#1b2327', 'rx="6"') + rect(572, 112, 216, 286, '#e9eef0', 'rx="3"') + rect(572, 392, 216, 10, '#8e99a3');                      // 화이트보드
    s += rect(468, 450, 150, 190, '#d9d2bc', 'rx="3"') + rect(468, 450, 150, 28, '#8a7a5a', 'rx="3"') + '<circle cx="543" cy="444" r="5" fill="#555"/>';        // 지난 달력(빈)
    s += rect(468, 690, 270, 190, 'url(#gMetal)', 'rx="10" stroke="#3b444b" stroke-width="5"') + rect(600, 740, 100, 90, '#1f272c', 'rx="6"') + '<circle cx="520" cy="790" r="22" fill="#59646d" stroke="#2b3338" stroke-width="4"/>';  // 금고
    s += lampLight();
    return s + finish();
  };
  A.bgBench = function () {
    var s = shell('#33444b');
    s += '<g opacity=".3">' + Array.apply(null, Array(9)).map(function (_, i) { return '<path d="M' + (i * 100) + ' 0 V700" stroke="#506670" stroke-width="2"/>'; }).join('') + '</g>';
    s += rect(60, 424, 540, 20, 'url(#gWood)') + rect(60, 444, 540, 6, '#2d1f12');
    for (var i = 0; i < 4; i++) {                                                                                                               // 플라스크 4개(라벨 없음)
      var cx = 0.16 * 800 + i * 96;
      s += '<path d="M' + (cx - 14) + ' 270 L' + (cx - 14) + ' 330 L' + (cx - 54) + ' 424 L' + (cx + 54) + ' 424 L' + (cx + 14) + ' 330 L' + (cx + 14) + ' 270 Z" fill="url(#gGlass)" stroke="#b7e6ea" stroke-width="3"/>';
      s += '<path d="M' + (cx - 34) + ' 372 L' + (cx - 52) + ' 420 L' + (cx + 52) + ' 420 L' + (cx + 34) + ' 372 Z" fill="url(#gCult)" opacity=".95"/>' + rect(cx - 18, 262, 36, 12, '#cfe9ec', 'rx="3" opacity=".8"');
    }
    s += rect(32, 620, 740, 36, '#586067') + rect(32, 656, 740, 20, '#2b3338') + rect(40, 676, 8, 24, '#2b3338') + rect(752, 676, 8, 24, '#2b3338');   // 실험대
    s += rect(40, 700, 190, 130, '#4a545b', 'rx="6" stroke="#2b3338" stroke-width="4"') + '<circle cx="135" cy="770" r="14" fill="#a7b2bb"/>';        // 시료 상자
    s += '<g transform="translate(560 320)"><rect x="40" y="226" width="160" height="14" fill="#1c2327" rx="4"/><path d="M110 226 L130 60 L170 60 L180 226 Z" fill="#c9d1d6"/><rect x="95" y="150" width="110" height="26" fill="#9aa5ad" rx="4"/><rect x="60" y="176" width="140" height="10" fill="#222"/><circle cx="150" cy="40" r="22" fill="#2b3338"/><path d="M60 226 H190" stroke="#8e99a3" stroke-width="10"/></g>';
    s += rect(40, 460, 80, 110, '#8e99a3', 'rx="4" opacity=".7"') + rect(48, 470, 64, 8, '#e9eef0', 'opacity=".5"');                              // 싱크대
    s += lampLight();
    return s + finish();
  };
  A.bgDoor = function () {
    var s = shell('#2c3a41');
    s += rect(48, 140, 230, 740, 'url(#gMetal)', 'rx="10" stroke="#3b444b" stroke-width="6"') + rect(62, 160, 202, 340, '#c3ccd2', 'rx="6"') + rect(62, 520, 202, 340, '#b6c0c6', 'rx="6"') + rect(236, 280, 14, 160, '#4a545b', 'rx="6"');
    s += '<circle cx="152" cy="230" r="52" fill="#2b3338" stroke="#59646d" stroke-width="6"/><circle cx="152" cy="230" r="40" fill="#39434a"/>';                    // 온도 다이얼 자리
    s += rect(96, 330, 90, 40, '#3a444b', 'rx="4" opacity=".0"');
    s += rect(318, 340, 90, 160, '#4a3a2a', 'rx="4"') + rect(328, 356, 70, 130, '#cfc9b4', 'rx="2" opacity=".0"') + rect(348, 330, 30, 14, '#999', 'rx="3"');   // 클립보드(빈)
    s += rect(430, 120, 300, 740, 'url(#gMetal)', 'rx="8" stroke="#3b444b" stroke-width="8"') + rect(444, 134, 272, 712, '#7f8a93', 'rx="4"') + rect(690, 450, 14, 60, '#2b3338', 'rx="6"');
    s += rect(480, 320, 96, 112, '#161d21', 'rx="6" opacity="0"');
    s += lampLight(560);
    return s + finish();
  };

  /* ===================== 벽 위에 얹는 층 ===================== */
  A.pDeskCal = function (c) { return calendar(c.P.cal, 118, 136, 164, 284, { head: '#4a6a8a' }); };
  A.pDeskBoard = function (c) {
    return paperNote(352, 160, 96, 80, -4, '#fff6b8') + paperNote(470, 168, 84, 70, 5, '#cfe8ff') + paperNote(380, 270, 110, 84, 3, '#ffd9d9') + paperNote(520, 262, 96, 90, -6, '#e6f5d0') +
      consPic(c.P.arr.cons[0], 358, 172, 84) .replace(/<text[^>]*>[^<]*<\/text>/g, '') + '<g opacity=".55">' + '<circle cx="415" cy="318" r="14" fill="none" stroke="#7a5a4a" stroke-width="3"/><path d="M415 318 V306 M415 318 H424" stroke="#7a5a4a" stroke-width="3"/><path d="M548 285 q20 -20 40 0 t0 40" stroke="#4a6a3a" stroke-width="3" fill="none"/></g>' +
      pin(400, 166, 0.5) + pin(512, 172, 0.5) + pin(432, 276, 0.5) + pin(570, 268, 0.5);
  };
  A.pDeskMemo = function (c) { return c.st.flags.note_rubbed ? '' : '<g stroke="#bdb79c" stroke-width="1.5" opacity=".7"><path d="M312 536 H428 M312 546 H428"/></g>'; };
  A.pDeskPencil = function (c) { return c.st.flags.got_pencil ? '' : '<g transform="translate(116 506) rotate(-12)"><rect width="96" height="10" fill="#e3b04b" rx="3"/><path d="M96 0 L116 5 L96 10 Z" fill="#e8c9a0"/><path d="M110 3 L116 5 L110 7 Z" fill="#333"/><rect width="14" height="10" fill="#d8392c" rx="3"/></g>'; };
  A.pShelfWb = function (c) { return paperNote(586, 130, 160, 100, 0, '#ffffff').replace(/<rect x="[^"]*" y="[^"]*" width="160" height="100" fill="#000"[^>]*\/>/, '') + consPic(c.P.arr.cons[1], 596, 140, 140).replace(/<text[^>]*>[^<]*<\/text>/g, '') + '<g stroke="#2c6ea8" stroke-width="4" fill="none" opacity=".7"><path d="M600 300 q40 -40 80 0 t80 0"/></g>'; };
  A.pShelfOld = function (c) { return calendar(c.P.cal.old, 472, 454, 142, 182, { paper: '#e6dcb8', head: '#8a7a5a' }); };
  A.pBenchFlasks = function (c) {
    var s = '', P = c.P;
    for (var i = 0; i < 4; i++) {
      var cx = 128 + i * 96;
      if (c.st.flags.flasks_labeled) { s += rect(cx - 30, 352, 60, 38, '#fffdf2', 'rx="4"') + strainIcon(P.arr.ans[i], cx, 371, 13); }
      if (i === P.arr.decoy) s += '<g transform="rotate(-8 ' + cx + ' 372)">' + rect(cx - 28, 356, 56, 28, '#ffb347', 'rx="4"') + txt(cx, 376, '기준', 17, '#4a2a00', 'text-anchor="middle" font-weight="800"') + '</g>';
    }
    return s;
  };
  A.pBenchItems = function (c) {
    var s = '';
    if (!c.st.flags.got_trypan) s += '<g transform="translate(236 540)"><rect width="38" height="68" rx="6" fill="#1d4f8a"/><rect x="10" y="-10" width="18" height="14" fill="#222" rx="3"/><rect x="4" y="22" width="30" height="26" fill="#e9eef0" rx="2"/></g>';
    if (!c.st.flags.got_chamber) s += '<g transform="translate(290 576)"><rect width="104" height="40" rx="6" fill="#23303a"/><rect x="10" y="10" width="84" height="20" fill="#8e99a3" rx="3"/></g>';
    if (!c.st.flags.got_coverslip) s += '<g transform="translate(414 580)"><rect width="72" height="38" rx="4" fill="#d6c9a0"/><rect x="8" y="8" width="56" height="8" fill="#e9eef0" opacity=".8"/></g>';
    return s;
  };
  A.pDoorFridge = function (c) {
    var s = rect(104, 322, 88, 36, '#e9eef0', 'rx="3"') + txt(148, 348, c.P.dial.no + '호기', 24, '#222', 'text-anchor="middle" font-weight="800"');
    return s + '<g transform="translate(152 230)"><circle r="38" fill="#e9eef0"/><path d="M0 0 L22 -22" stroke="#d8392c" stroke-width="6" stroke-linecap="round"/><circle r="5" fill="#333"/></g>';
  };
  A.pDoorClip = function (c) { return rect(326, 356, 74, 134, '#f4f1e4', 'rx="2"') + '<g stroke="#8a8470" stroke-width="3"><path d="M334 380 H392 M334 400 H392 M334 420 H392 M334 440 H392"/></g>'; };
  A.pDoorPanel = function (c) {
    var open = c.st.flags.door_open, s = rect(480, 320, 96, 112, '#161d21', 'rx="8" stroke="#59646d" stroke-width="4"');
    s += '<circle cx="528" cy="350" r="9" fill="' + (open ? '#4fe08a' : '#d8392c') + '"/>' + '<g fill="#59646d">' + [0, 1, 2, 3].map(function (i) { return '<rect x="' + (494 + i * 20) + '" y="376" width="14" height="34" rx="3"/>'; }).join('') + '</g>';
    if (open) s += '<rect x="444" y="134" width="272" height="712" fill="#fff4c8" opacity=".55"/>';
    return s;
  };

  /* ===================== 확대 장면 ===================== */
  A.zCal = function (c) {
    var s = zbg() + calendar(c.P.cal, 90, 60, 620, 560, {}) + '<g transform="translate(0 640)">' + ringIcon(150, 40, 22) + txt(190, 50, '발표', 30, '#f3e9d8', 'font-weight="700"') + sqIcon(390, 40, 20) + txt(428, 50, '마감', 30, '#f3e9d8', 'font-weight="700"') + pin(590, 36, 1) + txt(620, 50, '오늘', 30, '#f3e9d8', 'font-weight="700"') + '</g>';
    return s + zfin();
  };
  A.zNote = function (c) {
    var s = zbg() + paperNote(90, 70, 620, 650, -1, '#f4efdc'), rub = c.st.flags.note_rubbed;
    if (!rub) { s += '<g stroke="#d8d2bc" stroke-width="3" opacity=".7">' + Array.apply(null, Array(14)).map(function (_, i) { return '<path d="M120 ' + (140 + i * 38) + ' q' + (60 + (i * 17) % 40) + ' ' + (-8 + (i * 13) % 16) + ' ' + (200 + (i * 31) % 160) + ' 0"/>'; }).join('') + '</g>' + txt(400, 700, '눌린 자국이 있는 것 같습니다', 26, '#8a8470', 'text-anchor="middle"'); return s + zfin(); }
    s += '<g stroke="#3a3a3a" stroke-width="5" fill="none" opacity=".85">';
    s += ringIcon(170, 190, 36).replace('#e0483c', '#3a3a3a') + arrow(235, 190, 300, 190, '#3a3a3a', 5) + rect(330, 150, 80, 80, 'none', 'stroke="#3a3a3a" stroke-width="5" rx="6"') + rect(420, 150, 80, 80, 'none', 'stroke="#3a3a3a" stroke-width="5" rx="6"');
    s += sqIcon(170, 330, 34).replace('#4f9cf0', '#3a3a3a') + arrow(235, 330, 300, 330, '#3a3a3a', 5) + rect(330, 290, 80, 80, 'none', 'stroke="#3a3a3a" stroke-width="5" rx="6"') + rect(420, 290, 80, 80, 'none', 'stroke="#3a3a3a" stroke-width="5" rx="6"');
    s += '</g>';
    s += '<g stroke="#3a3a3a" stroke-width="5" fill="none" opacity=".85"><path d="M210 440 Q400 520 590 440" /></g>';
    [0, 1, 2, 3].forEach(function (i) { s += rect(150 + i * 108, 500, 90, 90, i < 2 ? '#f9d9d4' : '#d6e6fa', 'rx="8" stroke="#3a3a3a" stroke-width="5"'); });
    s += '<g transform="translate(610 545)" stroke="#3a3a3a" stroke-width="6" fill="none"><rect x="-26" y="-6" width="52" height="42" rx="6"/><path d="M-14 -6 V-24 a14 14 0 0 1 28 0 V-6"/></g>';
    s += '<g transform="translate(0 640)">' + pin(170, 26, 0.9) + arrow(205, 30, 290, 30, '#3a3a3a', 5) + rect(300, 4, 54, 54, 'none', 'stroke="#3a3a3a" stroke-width="5" rx="6"') + txt(327, 44, '1', 34, '#3a3a3a', 'text-anchor="middle" font-weight="800"') + '</g>';
    return s + zfin();
  };
  A.zBoard = function (c) {
    var s = zbg() + rect(50, 60, 700, 680, '#2a1f14', 'rx="14"') + rect(66, 76, 668, 648, '#a37a4a', 'rx="8"');
    for (var i = 0; i < 120; i++) s += '<circle cx="' + (80 + (i * 61) % 640) + '" cy="' + (90 + (i * 43) % 620) + '" r="4" fill="#8b6538" opacity=".55"/>';
    s += paperNote(110, 110, 300, 250, -3, '#fff6b8') + consPic(c.P.arr.cons[0], 128, 160, 260) + pin(250, 124, 1.1);
    s += paperNote(450, 130, 230, 170, 4, '#cfe8ff') + '<g stroke="#2c6ea8" stroke-width="5" fill="none"><circle cx="565" cy="215" r="48"/><path d="M565 215 V180 M565 215 H590"/></g>' + pin(565, 144, 1);
    s += paperNote(130, 420, 250, 260, 3, '#ffd9d9') + '<g stroke="#a04a4a" stroke-width="5" fill="none"><path d="M200 520 h110 M215 560 h80 M200 600 h110"/><circle cx="255" cy="640" r="12"/></g>' + pin(255, 434, 1);
    s += paperNote(450, 380, 250, 300, -5, '#e6f5d0') + '<g stroke="#4a6a3a" stroke-width="5" fill="none"><path d="M500 640 q40 -120 80 0 q40 -120 80 0"/><path d="M510 470 h140 M510 510 h100"/></g>' + pin(575, 396, 1);
    return s + zfin();
  };
  A.zWb = function (c) {
    var s = zbg() + rect(40, 70, 720, 600, '#1b2327', 'rx="10"') + rect(54, 84, 692, 572, '#eef1f2', 'rx="6"') + rect(54, 640, 692, 16, '#8e99a3');
    s += '<g stroke="#e8e4dc" stroke-width="22" opacity=".5"><path d="M90 560 L300 540 M450 120 L600 150"/></g>';
    s += consPic(c.P.arr.cons[1], 90, 150, 360).replace(/#3a362e/g, '#1f4f8a').replace(/#fffdf2/g, 'none') + '<g stroke="#c0392b" stroke-width="6" fill="none" opacity=".8"><path d="M520 140 h160 M520 190 h120 M520 240 h140"/><circle cx="600" cy="400" r="70"/><path d="M600 400 L650 360"/></g>';
    s += '<g stroke="#2c6ea8" stroke-width="5" fill="none" opacity=".7"><path d="M100 520 q60 -90 120 0 t120 0 t120 0"/></g>';
    return s + zfin();
  };
  A.zDrawer = function (c) {
    var open = c.st.solved.drawer, s = zbg() + rect(60, 70, 680, 640, '#4b3520', 'rx="14"') + rect(90, 100, 620, 280, 'url(#gWood)', 'rx="10" stroke="#2d1f12" stroke-width="6"');
    s += rect(330, 190, 140, 24, '#b9b9b9', 'rx="12"') + (open ? rect(130, 140, 540, 220, '#10171b', 'rx="8"') + '<g opacity=".7">' + rect(170, 200, 120, 40, '#556b7f', 'rx="6"') + rect(330, 200, 110, 90, '#8a2a2a', 'rx="6"') + rect(480, 210, 150, 30, '#c9c3a8', 'rx="4"') + '</g>' : '<circle cx="400" cy="300" r="12" fill="#222"/><rect x="396" y="300" width="8" height="26" fill="#222"/>');
    s += rect(90, 400, 620, 96, '#3a2816', 'rx="8"') + rect(90, 520, 620, 96, '#3a2816', 'rx="8"') + (open ? '' : txt(400, 760, '번호를 맞추고 당기면 열립니다', 28, '#b9a88f', 'text-anchor="middle"'));
    return s + zfin();
  };
  A.zBooks = function (c) {
    var s = zbg() + rect(30, 60, 740, 470, '#3a2816', 'rx="10"') + rect(44, 74, 712, 442, '#1c130b') + rect(44, 480, 712, 14, '#6a4a2a'), P = c.P, x = 60;
    var fill = ['#6a2a2a', '#2a4a6a', '#3a5a3a', '#7a6a2a'], dec = [0, 1, 2, 3, 4, 5];
    for (var i = 0; i < 4; i++) {
      var b = P.dir.books[i], bx = 110 + i * 150, h = 330 - i * 14 % 40;
      s += rect(bx, 480 - h, 112, h, fill[(i + 1) % 4], 'rx="4" stroke="#0e0905" stroke-width="3"') + rect(bx + 8, 480 - h + 14, 96, 10, '#e3b04b', 'opacity=".55"');
      s += '<circle cx="' + (bx + 56) + '" cy="' + (480 - h + 80) + '" r="34" fill="#f3e9d8"/>' + txt(bx + 56, 480 - h + 94, b.vol, 44, '#2a1f14', 'text-anchor="middle" font-weight="900"');
      s += '<circle cx="' + (bx + 56) + '" cy="' + (480 - h + 200) + '" r="34" fill="#2a1f14" stroke="#f3e9d8" stroke-width="3"/>' + dirArrow(b.arrow, bx + 56, 480 - h + 200, 18, '#f3e9d8');
    }
    for (var k = 0; k < 7; k++) if (k % 2 === 0) s += rect(60 + k * 4, 100 + k * 8, 20, 60, '#4a3a2a', 'rx="3" opacity=".7"');
    s += c.st.solved.books ? txt(400, 570, '책장 뒤 칸이 열렸습니다', 28, '#b9a88f', 'text-anchor="middle"') : '';
    return s + zfin();
  };
  A.zOld = function (c) {
    var s = zbg() + calendar(c.P.cal.old, 90, 90, 620, 560, { paper: '#e6dcb8', head: '#8a7a5a' }) + '<g transform="rotate(-8 400 70)">' + rect(260, 30, 280, 60, '#fff6b8', 'rx="6" stroke="#b9a85a" stroke-width="3"') + txt(400, 72, '지난 학기', 36, '#5a4a1a', 'text-anchor="middle" font-weight="800"') + '</g>';
    return s + zfin();
  };
  A.zSafe = function (c) {
    var P = c.P, rub = c.st.flags.safe_rubbed, s = zbg() + rect(40, 50, 720, 700, 'url(#gMetal)', 'rx="22" stroke="#3b444b" stroke-width="8"') + rect(70, 80, 660, 640, '#6c7882', 'rx="14"');
    s += rect(100, 100, 420, 380, '#1f272c', 'rx="14"');
    for (var i = 0; i < 6; i++) { var cx = 160 + (i % 3) * 130, cy = 180 + Math.floor(i / 3) * 170; s += rect(cx - 52, cy - 62, 104, 124, '#59646d', 'rx="12" stroke="#2b3338" stroke-width="4"') + (rub ? rect(cx - 52, cy - 62, 104, 124, '#111', 'rx="12" opacity="' + (P.sym.wear[i] * 0.85).toFixed(2) + '"') : rect(cx - 52, cy - 62, 104, 124, '#111', 'rx="12" opacity=".04"')) + symbol(i, cx, cy, 32, '#e9eef0'); }
    s += rect(550, 120, 160, 240, '#fff6b8', 'rx="8"') + '<g transform="translate(630 170)">' + '<circle cx="-40" cy="0" r="26" fill="#3a3a3a"/><circle cx="12" cy="0" r="17" fill="#3a3a3a" opacity=".7"/><circle cx="52" cy="0" r="9" fill="#3a3a3a" opacity=".45"/></g>' + arrow(580, 250, 690, 250, '#3a3a3a', 6) + '<g transform="translate(630 310)" fill="none" stroke="#3a3a3a" stroke-width="4">' + [-50, 0, 50].map(function (dx) { return '<rect x="' + (dx - 14) + '" y="-14" width="28" height="28" rx="5"/>'; }).join('') + '</g>';
    return s + zfin();
  };
  A.zShelf = function (c) {
    var P = c.P, s = zbg() + rect(20, 30, 760, 290, '#1b2a30', 'rx="12"') + rect(30, 292, 740, 16, 'url(#gWood)');
    for (var i = 0; i < 4; i++) {
      var cx = 130 + i * 180;
      s += '<path d="M' + (cx - 24) + ' 50 L' + (cx - 24) + ' 140 L' + (cx - 84) + ' 290 L' + (cx + 84) + ' 290 L' + (cx + 24) + ' 140 L' + (cx + 24) + ' 50 Z" fill="url(#gGlass)" stroke="#b7e6ea" stroke-width="4"/>' + '<path d="M' + (cx - 58) + ' 190 L' + (cx - 84) + ' 286 L' + (cx + 84) + ' 286 L' + (cx + 58) + ' 190 Z" fill="url(#gCult)"/>' + rect(cx - 28, 38, 56, 18, '#cfe9ec', 'rx="4" opacity=".85"');
      s += '<circle cx="' + cx + '" cy="316" r="0"/>';
      if (c.st.flags.flasks_labeled) s += rect(cx - 52, 200, 104, 70, '#fffdf2', 'rx="6"') + strainIcon(P.arr.ans[i], cx, 228, 22) + txt(cx, 262, ESC.parts.STRAINS.filter(function (q) { return q.id === P.arr.ans[i]; })[0].ko, 15, '#2a2a2a', 'text-anchor="middle" font-weight="700"');
      if (i === P.arr.decoy) s += '<g transform="rotate(-8 ' + cx + ' 160)">' + rect(cx - 44, 140, 88, 40, '#ffb347', 'rx="6"') + txt(cx, 169, '기준', 26, '#4a2a00', 'text-anchor="middle" font-weight="800"') + '</g>';
      if (c.st.flags.star_seen && i === P.arr.star) s += '<g transform="translate(' + cx + ' 110)"><circle r="40" fill="#9b6cf0" opacity=".28"/>' + symbol(3, 0, 0, 30, '#d7c2ff') + '</g>';
    }
    s += rect(20, 330, 760, 100, '#fff6b8', 'rx="8" opacity=".0"') + paperNote(30, 322, 400, 104, 0, '#fff6b8') + consPic(P.arr.cons[2], 44, 334, 270).replace(/<text[^>]*>[^<]*<\/text>/g, '');
    s += '<g transform="translate(560 376)">' + rect(-110, -44, 220, 88, '#e9eef0', 'rx="8"') + '<g transform="translate(-60 0)" fill="none" stroke="#e0483c" stroke-width="6"><rect x="-22" y="-14" width="44" height="28" rx="4" fill="#ffb347" stroke="none"/><path d="M-26 -22 L26 22 M26 -22 L-26 22"/></g>' + '<g transform="translate(40 0)"><rect x="-34" y="-8" width="68" height="16" rx="8" fill="#9b6cf0"/><path d="M-20 -20 q20 -26 40 0" stroke="#9b6cf0" stroke-width="5" fill="none"/></g><g transform="translate(96 -6)" stroke="#2b9a55" stroke-width="7" fill="none"><path d="M-14 4 L-4 14 L16 -12"/></g></g>';
    return s + zfin();
  };
  A.zBox = function (c) {
    var s = zbg() + rect(70, 80, 660, 600, '#4a545b', 'rx="16" stroke="#2b3338" stroke-width="8"') + rect(110, 120, 580, 270, '#3a444b', 'rx="12"') + '<circle cx="400" cy="250" r="70" fill="#a7b2bb" stroke="#59646d" stroke-width="8"/>';
    s += '<g transform="translate(250 450)"><path d="M-20 -30 L-20 -10 L-50 40 L50 40 L20 -10 L20 -30 Z" fill="url(#gGlass)" stroke="#b7e6ea" stroke-width="3"/><path d="M-36 14 L-50 38 L50 38 L36 14 Z" fill="url(#gCult)"/></g>';
    s += '<g transform="translate(560 452)"><path d="M-44 -30 H22 L48 0 L22 30 H-44 Z" fill="#e9eef0" stroke="#59646d" stroke-width="4"/><circle cx="26" cy="0" r="7" fill="#3a444b"/></g>';
    return s + zfin();
  };
  A.zScope = function (c) {
    var f = c.st.flags, P = c.P, s = zbg() + '<circle cx="400" cy="300" r="278" fill="#0c1215" stroke="#59646d" stroke-width="12"/><circle cx="400" cy="300" r="262" fill="#cfe8ea"/>';
    if (!f.chamber_on) { s += '<circle cx="400" cy="300" r="262" fill="#9fb4b8"/>' + rect(250, 250, 300, 100, '#7b8c91', 'rx="10"') + txt(400, 310, '빈 스테이지', 34, '#e9eef0', 'text-anchor="middle" font-weight="700"'); }
    else {
      s += '<g>';
      for (var q = 0; q < 4; q++) {
        var ox = 400 + (q % 2 ? 12 : -192), oy = 300 + (q < 2 ? -192 : 12), L = 180;
        s += rect(ox, oy, L, L, '#e8f6f6', 'stroke="#2b3338" stroke-width="3"');
        s += '<g stroke="#9bb5b8" stroke-width="1">' + [1, 2, 3, 4].map(function (k) { return '<path d="M' + (ox + k * L / 5) + ' ' + oy + ' V' + (oy + L) + ' M' + ox + ' ' + (oy + k * L / 5) + ' H' + (ox + L) + '"/>'; }).join('') + '</g>';
        if (f.sample_on) P.cnt.squares[q].forEach(function (o) { s += o.dead ? '<circle cx="' + (ox + o.x * L) + '" cy="' + (oy + o.y * L) + '" r="13" fill="#2a4fb8" stroke="#16307a" stroke-width="3"/>' : '<circle cx="' + (ox + o.x * L) + '" cy="' + (oy + o.y * L) + '" r="13" fill="#6fd06a" stroke="#2c8a3a" stroke-width="3"/><circle cx="' + (ox + o.x * L - 3) + '" cy="' + (oy + o.y * L - 3) + '" r="4" fill="#bff0b8"/>'; });
      }
      s += '</g>';
      if (!f.sample_on) s += txt(400, 300, '시료를 채우세요', 32, '#506670', 'text-anchor="middle" font-weight="700"');
    }
    s += '<g transform="translate(0 598)">' + '<circle cx="190" cy="0" r="14" fill="#6fd06a" stroke="#2c8a3a" stroke-width="3"/><path d="M214 4 L224 14 L244 -12" stroke="#4fe08a" stroke-width="7" fill="none" stroke-linecap="round"/>' + '<circle cx="470" cy="0" r="14" fill="#2a4fb8" stroke="#16307a" stroke-width="3"/><path d="M494 -10 L520 12 M520 -10 L494 12" stroke="#e0483c" stroke-width="7" stroke-linecap="round"/></g>';
    return s + zfin();
  };
  A.zFridge = function (c) {
    var open = c.st.flags.fridge_open, P = c.P, s = zbg() + rect(20, 40, 340, 720, 'url(#gMetal)', 'rx="16" stroke="#3b444b" stroke-width="8"') + rect(40, 70, 300, 300, '#c3ccd2', 'rx="8"') + rect(40, 390, 300, 340, '#b6c0c6', 'rx="8"');
    s += rect(60, 200, 130, 56, '#e9eef0', 'rx="4"') + txt(125, 240, P.dial.no + '호기', 34, '#222', 'text-anchor="middle" font-weight="800"');
    s += paperNote(40, 440, 300, 250, -2, '#fff6b8') + txt(190, 500, '환산', 28, '#5a4a1a', 'text-anchor="middle" font-weight="800"') + txt(190, 556, '°F = °C × 9/5 + 32', 28, '#3a3a3a', 'text-anchor="middle" font-weight="700"') + txt(190, 604, '눈금은 정수로 반올림', 24, '#5a4a1a', 'text-anchor="middle"') + '<g transform="translate(190 650)" fill="none" stroke="#3a3a3a" stroke-width="5"><path d="M-70 0 H70"/><path d="M-70 -14 V14 M70 -14 V14"/></g>';
    if (open) s += rect(420, 60, 360, 680, '#0f171b', 'rx="12" stroke="#59646d" stroke-width="6"') + [140, 300, 460].map(function (y) { return rect(430, y, 340, 12, '#59646d'); }).join('') + rect(430, 70, 340, 40, '#9fd4ff', 'opacity=".12"');
    return s + zfin();
  };
  A.zClip = function (c) {
    var P = c.P, s = zbg() + rect(160, 40, 480, 720, '#4a3a2a', 'rx="14"') + rect(190, 110, 420, 620, '#f4f1e4', 'rx="4"') + rect(310, 60, 180, 70, '#999', 'rx="10"') + '<circle cx="400" cy="92" r="9" fill="#555"/>';
    s += txt(400, 190, '냉장고 설정', 36, '#3a362e', 'text-anchor="middle" font-weight="800"') + '<path d="M230 215 H570" stroke="#b8b09c" stroke-width="3"/>';
    [[1, P.dial.t1], [2, P.dial.t2]].forEach(function (r, i) {
      var y = 290 + i * 150; s += rect(230, y - 40, 340, 110, 'none', 'stroke="#b8b09c" stroke-width="3" rx="6"') + txt(300, y + 24, r[0] + '호기', 40, '#3a362e', 'text-anchor="middle" font-weight="800"') + txt(470, y + 24, r[1] + ' °C', 52, '#2c6ea8', 'text-anchor="middle" font-weight="800"');
    });
    s += '<g stroke="#b8b09c" stroke-width="3"><path d="M230 600 H570 M230 640 H500"/></g>';
    return s + zfin();
  };
  A.zPanel = function (c) {
    var open = c.st.flags.door_open, s = zbg() + rect(40, 40, 720, 720, 'url(#gMetal)', 'rx="22" stroke="#3b444b" stroke-width="8"') + rect(70, 70, 660, 660, '#2b3338', 'rx="14"');
    s += '<circle cx="140" cy="130" r="22" fill="' + (open ? '#4fe08a' : '#d8392c') + '"/>';
    ['red', 'orange', 'green', 'blue'].forEach(function (k, i) { s += '<circle cx="' + (300 + i * 100) + '" cy="130" r="20" fill="' + COL[k] + '"/>'; });
    s += '<g transform="translate(400 250)">' + '<path d="M-60 20 L-20 -34 L-10 -4 L20 -4 L-20 40 L-12 10 Z" fill="#ffd54a"/>' + arrow(40, 4, 230, 4, '#f3e9d8', 7) + '<g opacity=".95"><path d="M-250 4 H-80" stroke="#f3e9d8" stroke-width="2" opacity="0"/></g></g>';
    s += '<g transform="translate(120 300)" fill="#f3e9d8" opacity=".85"><rect x="0" y="0" width="120" height="20" rx="6" fill="#59646d"/><rect x="0" y="0" width="120" height="20" rx="6" fill="url(#gGlass)"/></g>';
    s += rect(110, 330, 80, 8, '#ffd54a', 'rx="4"') + rect(210, 334, 60, 6, '#ffd54a', 'rx="3" opacity=".75"') + rect(290, 336, 40, 4, '#ffd54a', 'rx="2" opacity=".5"');
    s += txt(400, 380, '', 1, '#fff');
    return s + zfin();
  };
  A.zStrain = function (c) {
    var P = c.P, s = zbg() + paperNote(100, 40, 600, 720, 0, '#f4efdc') + txt(400, 110, '균주 번호표', 40, '#3a362e', 'text-anchor="middle" font-weight="800"');
    ESC.parts.STRAINS.forEach(function (st, i) { var y = 190 + i * 100; s += rect(140, y - 40, 520, 84, 'none', 'stroke="#b8b09c" stroke-width="3" rx="8"') + strainIcon(st.id, 210, y, 28) + txt(330, y + 12, st.ko, 30, '#3a362e', 'font-weight="700"') + '<circle cx="600" cy="' + y + '" r="30" fill="#2a1f14"/>' + txt(600, y + 14, P.arr.table[st.id], 40, '#f3e9d8', 'text-anchor="middle" font-weight="900"'); });
    return s + zfin();
  };
  A.zTextbook = function (c) {
    var s = zbg() + paperNote(60, 40, 680, 720, 0, '#f4efdc') + txt(400, 110, '빛의 색과 에너지', 38, '#3a362e', 'text-anchor="middle" font-weight="800"');
    var cols = [['#7a3fd0', '보라', 410], ['#2b6fe0', '파랑', 470], ['#3fbf5a', '초록', 530], ['#f0a020', '주황', 600], ['#e03a2a', '빨강', 650]];
    cols.forEach(function (k, i) { var x = 110 + i * 116; s += rect(x, 170, 112, 110, k[0], 'rx="6"') + txt(x + 56, 232, k[1], 30, '#fff', 'text-anchor="middle" font-weight="800"') + txt(x + 56, 316, k[2] + ' nm', 28, '#3a362e', 'text-anchor="middle" font-weight="700"'); });
    s += arrow(120, 360, 680, 360, '#3a362e', 5) + txt(120, 396, '파장 짧음', 24, '#3a362e', 'font-weight="700"') + txt(680, 396, '파장 긺', 24, '#3a362e', 'text-anchor="end" font-weight="700"');
    s += txt(400, 500, '파장이 짧을수록 빛의 에너지가 큽니다.', 30, '#2a1f14', 'text-anchor="middle" font-weight="700"') + txt(400, 580, '엽록소는 빨강과 파랑 빛을 흡수하고', 28, '#3a362e', 'text-anchor="middle"') + txt(400, 622, '초록 빛은 반사합니다.', 28, '#3a362e', 'text-anchor="middle"');
    return s + zfin();
  };

  /* ===================== 소지품 아이콘 (100×100) ===================== */
  A.ico = function (id, c) {
    var it = c.scn.items[id], k = it.icon, s = '';
    if (k === 'pencil') s = '<g transform="rotate(-35 50 50)"><rect x="10" y="42" width="66" height="16" fill="#e3b04b" rx="3"/><path d="M76 42 L96 50 L76 58 Z" fill="#e8c9a0"/><path d="M88 46 L96 50 L88 54 Z" fill="#333"/><rect x="10" y="42" width="12" height="16" fill="#d8392c" rx="3"/></g>';
    else if (k === 'flBody' || k === 'flashlight') { var on = k === 'flashlight', uv = c.st.flags.fl_mode === 'uv'; s = '<g transform="rotate(-40 50 50)"><rect x="14" y="40" width="50" height="20" rx="5" fill="#3d4a54"/><rect x="60" y="34" width="26" height="32" rx="4" fill="#59646d"/><rect x="82" y="38" width="8" height="24" rx="2" fill="' + (on ? (uv ? '#c9a8ff' : '#fff2a8') : '#222') + '"/></g>' + (on ? '<circle cx="82" cy="24" r="14" fill="' + (uv ? '#9b6cf0' : '#ffe27a') + '" opacity=".35"/>' : ''); }
    else if (k === 'battery') s = '<g transform="rotate(-20 50 50)"><rect x="24" y="34" width="52" height="32" rx="5" fill="#2f7d4f"/><rect x="76" y="42" width="8" height="16" rx="2" fill="#a7b2bb"/><rect x="24" y="34" width="14" height="32" fill="#e3b04b"/></g>';
    else if (k === 'table') s = '<rect x="22" y="14" width="56" height="72" rx="5" fill="#f4efdc" stroke="#b8b09c" stroke-width="3"/><g fill="#6aa86a">' + [0, 1, 2, 3].map(function (i) { return '<circle cx="36" cy="' + (30 + i * 15) + '" r="5"/>'; }).join('') + '</g><g fill="#3a362e">' + [0, 1, 2, 3].map(function (i) { return '<rect x="48" y="' + (27 + i * 15) + '" width="20" height="6" rx="2"/>'; }).join('') + '</g>';
    else if (k === 'book') s = '<rect x="20" y="16" width="60" height="70" rx="4" fill="#2a4a6a"/><rect x="26" y="16" width="6" height="70" fill="#1c3550"/><rect x="40" y="30" width="30" height="8" rx="2" fill="#f3e9d8"/><g><rect x="40" y="48" width="8" height="12" fill="#7a3fd0"/><rect x="48" y="48" width="8" height="12" fill="#2b6fe0"/><rect x="56" y="48" width="8" height="12" fill="#3fbf5a"/><rect x="64" y="48" width="8" height="12" fill="#e03a2a"/></g>';
    else if (k === 'tag') { var col = id.split('_')[1]; s = '<path d="M20 22 H66 L84 50 L66 78 H20 Z" fill="' + COL[col] + '" stroke="#fff" stroke-width="3"/><circle cx="30" cy="50" r="5" fill="#1c1611"/><text x="58" y="62" font-size="34" font-weight="900" text-anchor="middle" fill="#fff" ' + F + '>' + c.P.tags[col] + '</text>'; }
    else if (k === 'coverslip') s = '<rect x="24" y="40" width="52" height="30" rx="2" fill="#cfe9ec" opacity=".8" stroke="#8fc8d0" stroke-width="3"/><rect x="24" y="40" width="52" height="8" fill="#fff" opacity=".5"/>';
    else if (k === 'chamber') s = '<rect x="14" y="34" width="72" height="34" rx="4" fill="#9aa5ad"/><g stroke="#2b3338" stroke-width="2" fill="none"><rect x="30" y="40" width="16" height="22"/><rect x="54" y="40" width="16" height="22"/></g>';
    else if (k === 'chamberReady') s = '<rect x="14" y="38" width="72" height="34" rx="4" fill="#9aa5ad"/><rect x="26" y="30" width="48" height="28" rx="2" fill="#cfe9ec" opacity=".75" stroke="#8fc8d0" stroke-width="3"/>';
    else if (k === 'tube' || k === 'tubeStained') s = '<path d="M38 16 H62 V68 L50 86 L38 68 Z" fill="url(#gGlass)" stroke="#b7e6ea" stroke-width="3"/><path d="M40 48 H60 V66 L50 82 L40 66 Z" fill="' + (k === 'tube' ? '#58b862' : '#2f6fa8') + '"/><rect x="34" y="10" width="32" height="10" rx="3" fill="#e0483c"/>';
    else if (k === 'trypan') s = '<rect x="32" y="30" width="36" height="56" rx="6" fill="#1d4f8a"/><rect x="40" y="16" width="20" height="16" rx="3" fill="#222"/><rect x="36" y="50" width="28" height="22" rx="2" fill="#e9eef0"/><circle cx="50" cy="61" r="6" fill="#2a4fb8"/>';
    return '<svg viewBox="0 0 100 100">' + s + '</svg>';
  };
  A.strainIcon = strainIcon; A.symbol = symbol; A.dirArrow = dirArrow; A.arrow = arrow; A.COL = COL; A.SYMKO = SYMKO; A.defs = defs;

  ESC.art = A;
  if (typeof module !== 'undefined' && module.exports) module.exports = A;
})(typeof window !== 'undefined' ? window : globalThis);
