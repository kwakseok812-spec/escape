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
    var g = ESC.parts.calGeom(c, x, y, w, h), hh = g.hh, cw = g.cw, ch = g.ch, s = '';
    var nsz = Math.min(cw, ch) * (opt.easyDim ? 0.30 : (opt.fix ? 0.36 : 0.46));      // 보통 고침: 숫자를 조금 줄여 칸 격자가 먼저 보이게 / 쉬움: 더 흐리고 작게
    var tgt = opt.paint === 'circle' ? c.circle : (opt.paint === 'square' ? c.square : null);
    s += rect(x, y, w, h, opt.paper || '#f3f0e6', 'rx="6" stroke="#b8b09c" stroke-width="2"') + rect(x, y, w, hh, opt.head || '#4a6a8a', 'rx="6"');
    s += txt(x + w / 2, y + hh * 0.72, (c.month + 1) + '월', hh * 0.6, '#fff', 'text-anchor="middle" font-weight="800"');
    for (var i = 0; i < 7; i++) s += txt(x + cw * (i + 0.5), y + hh + h * 0.055, WD[i], h * 0.05, i === 0 ? '#c0392b' : (i === 6 ? '#2c6ea8' : '#5a5448'), 'text-anchor="middle" font-weight="700"');
    var xs = {}; (c.xs || []).forEach(function (d) { xs[d] = 1; });
    for (var d = 1; d <= c.dim; d++) {
      var q = g.cell(d), col = (c.first + d - 1) % 7, cx = q.cx, cy = q.cy;
      if (opt.fix) s += rect(q.x + 1, q.y + 1, cw - 2, ch - 2, 'none', 'stroke="#b8b09c" stroke-width="2" rx="3"');
      if (tgt && d > c.pin && d <= tgt) s += rect(q.x + 2.5, q.y + 2.5, cw - 5, ch - 5, '#ffd54a', 'rx="4" opacity=".78" data-paint="1"');
      s += txt(cx, cy + h * 0.022, d, nsz, col === 0 ? '#c0392b' : (col === 6 ? '#2c6ea8' : '#3a362e'), 'text-anchor="middle" font-weight="700"' + (opt.easyDim ? ' fill-opacity=".4"' : ''));
      if (xs[d]) s += '<path d="M' + (cx - cw * 0.32) + ' ' + (cy - ch * 0.32) + ' L' + (cx + cw * 0.32) + ' ' + (cy + ch * 0.32) + ' M' + (cx + cw * 0.32) + ' ' + (cy - ch * 0.32) + ' L' + (cx - cw * 0.32) + ' ' + (cy + ch * 0.32) + '" stroke="#3a362e" stroke-width="' + Math.max(2, cw * 0.06) + '" stroke-linecap="round" opacity=".75"/>';
      if (c.circle === d) s += ringIcon(cx, cy, Math.min(cw, ch) * 0.46);
      if (c.square === d) s += sqIcon(cx, cy, Math.min(cw, ch) * 0.42);
      if (c.pin === d) s += pin(cx + cw * 0.18, cy - ch * 0.22, Math.min(cw, ch) / 48);
    }
    return s;
  }
  /* 그림 쪽지: 균주 배열 조건 — notEnd = 양 끝칸에 ✕ · leftOf = 사이에 … (떨어져 있어도 됨) · adj = 두 칸이 맞닿음 */
  function consPic(c, x, y, w) {
    var s = '', cell = w / 4.6, gap = cell * 0.2, name = function (id) { return ESC.parts.STRAINS.filter(function (q) { return q.id === id; })[0].ko; };
    var tx = function (cx, cy, id) { return txt(cx, cy, name(id), cell * 0.3, '#3a362e', 'text-anchor="middle" font-weight="700"'); };
    if (c.t === 'notEnd') {
      for (var i = 0; i < 4; i++) s += rect(x + i * (cell + gap), y, cell, cell, '#fffdf2', 'rx="8" stroke="#b9ad8a" stroke-width="3"');
      [0, 3].forEach(function (i) { var cx = x + i * (cell + gap) + cell / 2, cy = y + cell / 2; s += strainIcon(c.s, cx, cy, cell * 0.28) + '<path d="M' + (cx - cell * 0.36) + ' ' + (cy - cell * 0.36) + ' L' + (cx + cell * 0.36) + ' ' + (cy + cell * 0.36) + ' M' + (cx + cell * 0.36) + ' ' + (cy - cell * 0.36) + ' L' + (cx - cell * 0.36) + ' ' + (cy + cell * 0.36) + '" stroke="#d8392c" stroke-width="7" stroke-linecap="round"/>'; });
      s += tx(x + w / 2, y + cell + cell * 0.45, c.s);
    } else if (c.t === 'leftOf') {
      var ax = x + cell * 0.55, bx = x + w - cell * 0.55, cy = y + cell / 2, mid = (ax + bx) / 2;
      s += strainIcon(c.a, ax, cy, cell * 0.36) + strainIcon(c.b, bx, cy, cell * 0.36);
      [-1, 0, 1].forEach(function (k) { s += '<circle cx="' + (mid + k * cell * 0.34) + '" cy="' + cy + '" r="' + cell * 0.055 + '" fill="#3a362e"/>'; });
      s += arrow(mid + cell * 0.62, cy, bx - cell * 0.62, cy, '#3a362e', 5);
      s += tx(ax, y + cell + cell * 0.3, c.a) + tx(bx, y + cell + cell * 0.3, c.b);
    } else {
      var mx = x + w / 2 - cell * 0.55, cy2 = y + cell / 2;
      s += rect(mx - cell * 0.55, y, cell * 1.1, cell, '#fffdf2', 'rx="8" stroke="#3a362e" stroke-width="4"') + rect(mx + cell * 0.55, y, cell * 1.1, cell, '#fffdf2', 'rx="8" stroke="#3a362e" stroke-width="4"');
      s += strainIcon(c.a, mx, cy2, cell * 0.3) + strainIcon(c.b, mx + cell * 1.1, cy2, cell * 0.3) + arrow(mx - cell * 0.4, y + cell * 1.18, mx + cell * 1.6, y + cell * 1.18, '#3a362e', 5);
      s += tx(mx, y + cell + cell * 0.72, c.a) + tx(mx + cell * 1.1, y + cell + cell * 0.72, c.b);
    }
    return s;
  }
  function paperNote(x, y, w, h, rot, fill) { return '<g transform="rotate(' + (rot || 0) + ' ' + (x + w / 2) + ' ' + (y + h / 2) + ')"><rect x="' + (x + 4) + '" y="' + (y + 6) + '" width="' + w + '" height="' + h + '" fill="#000" opacity=".3" rx="4"/>' + rect(x, y, w, h, fill || '#fff6b8', 'rx="4"') + '</g>'; }

  /* ---- 난이도·기능 스위치 읽기: 그림은 난이도를 「보이는 것」에만 쓰고 정답·잠금값은 읽지 않는다 ---- */
  function isFix(c) { return !!(c && c.scn && c.scn.features && c.scn.features.normalFixes); }
  function ez(c) { return !!(c && c.diff && c.diff() === 'easy'); }
  function copt(c, o) { o = o || {}; o.fix = isFix(c); if (ez(c) && !o.old) o.easyDim = true; return o; }
  function numChip(cx, cy, n, r) { return '<g data-ref="numchip"><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#f3e9d8" stroke="#2a1f14" stroke-width="3"/>' + txt(cx, cy + r * 0.38, n, r * 1.2, '#2a1f14', 'text-anchor="middle" font-weight="900"') + '</g>'; }
  function foot(cx, cy, k, col, rot) { return '<g transform="translate(' + cx + ' ' + cy + ') rotate(' + (rot || 0) + ') scale(' + k + ')" fill="' + col + '"><ellipse cx="0" cy="-4" rx="7" ry="10"/><ellipse cx="0" cy="12" rx="5" ry="5.5"/><circle cx="-5" cy="-17" r="2.4"/><circle cx="0" cy="-19" r="2.6"/><circle cx="5" cy="-17" r="2.4"/></g>'; }
  function bolt(cx, cy, sc, fill) { return '<path transform="translate(' + cx + ' ' + cy + ') scale(' + sc + ')" d="M-14 24 L6 -26 L10 -4 L26 -4 L-6 32 L-2 8 Z" fill="' + fill + '"/>'; }
  function flaskIcon(cx, cy, k) { return '<g transform="translate(' + cx + ' ' + cy + ') scale(' + k + ')"><path d="M-8 -24 V-6 L-22 22 H22 L8 -6 V-24 Z" fill="#cfe9ec" fill-opacity=".5" stroke="#6aa0aa" stroke-width="3"/><path d="M-17 8 L-22 22 H22 L17 8 Z" fill="#4fae5a"/></g>'; }
  function bookIcon(cx, cy, k) { return '<g transform="translate(' + cx + ' ' + cy + ') scale(' + k + ')"><rect x="-18" y="-24" width="36" height="48" rx="4" fill="#2a4a6a"/><rect x="-18" y="-10" width="36" height="12" fill="#2b6fe0"/><circle cx="0" cy="12" r="7" fill="#f3e9d8"/></g>'; }
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
    s += rect(40, 700, 190, 130, '#4a545b', 'rx="8" stroke="#2b3338" stroke-width="4"') + rect(40, 700, 190, 34, '#5c6870', 'rx="8"') + rect(100, 722, 70, 16, '#2b3338', 'rx="6"') +
      [0, 1, 2, 3].map(function (i) { return '<circle cx="' + (62 + i * 36) + '" cy="772" r="11" fill="#1c2327"/><circle cx="' + (62 + i * 36) + '" cy="772" r="7" fill="#9fd4ff" opacity=".35"/>'; }).join('') + rect(100, 800, 70, 14, '#a7b2bb', 'rx="5"') + '<circle cx="135" cy="807" r="3" fill="#333"/>';   // 시료 상자(시험관 보관함)
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
  A.pDeskCal = function (c) { return calendar(c.P.cal, 118, 136, 164, 284, copt(c, { head: '#4a6a8a' })); };
  A.pDeskBoard = function (c) {
    return paperNote(380, 190, 190, 150, -3, '#fff6b8') + consPic(c.P.arr.cons[0], 392, 214, 168).replace(/<text[^>]*>[^<]*<\/text>/g, '') + pin(474, 196, 0.6);
  };
  A.pDeskMemo = function (c) { return c.st.flags.note_rubbed ? '' : '<g stroke="#bdb79c" stroke-width="1.5" opacity=".7"><path d="M312 536 H428 M312 546 H428"/></g>'; };
  A.pDeskPencil = function (c) { return c.st.flags.got_pencil ? '' : '<g transform="translate(116 506) rotate(-12)"><rect width="96" height="10" fill="#e3b04b" rx="3"/><path d="M96 0 L116 5 L96 10 Z" fill="#e8c9a0"/><path d="M110 3 L116 5 L110 7 Z" fill="#333"/><rect width="14" height="10" fill="#d8392c" rx="3"/></g>'; };
  A.pShelfWb = function (c) { return paperNote(586, 130, 160, 100, 0, '#ffffff').replace(/<rect x="[^"]*" y="[^"]*" width="160" height="100" fill="#000"[^>]*\/>/, '') + consPic(c.P.arr.cons[1], 596, 140, 140).replace(/<text[^>]*>[^<]*<\/text>/g, '') + '<g stroke="#2c6ea8" stroke-width="4" fill="none" opacity=".7"><path d="M600 300 q40 -40 80 0 t80 0"/></g>'; };
  A.pShelfOld = function (c) { return calendar(c.P.cal.old, 472, 454, 142, 182, copt(c, { paper: '#e6dcb8', head: '#8a7a5a', old: true })); };
  A.pBenchFlasks = function (c) {
    var s = '', P = c.P;
    for (var i = 0; i < 4; i++) {
      var cx = 128 + i * 96;
      if (c.st.flags.flasks_labeled) { s += rect(cx - 30, 352, 60, 38, '#fffdf2', 'rx="4"') + strainIcon(P.arr.ans[i], cx, 371, 13); }
      if (i === P.arr.decoy) s += '<g transform="rotate(-8 ' + cx + ' 372)">' + rect(cx - 28, 356, 56, 28, '#ffb347', 'rx="4"') + txt(cx, 376, '기준', 17, '#4a2a00', 'text-anchor="middle" font-weight="800"') + '</g>';
      if (ez(c)) s += numChip(cx, 468, i + 1, 14);
    }
    return s;
  };
  A.pBenchItems = function (c) {
    var s = '';
    if (!c.st.flags.got_trypan) s += '<g transform="translate(200 506)"><rect width="56" height="96" rx="9" fill="#1d4f8a"/><rect x="14" y="-14" width="28" height="20" fill="#222" rx="4"/><rect x="6" y="34" width="44" height="38" fill="#e9eef0" rx="3"/><circle cx="28" cy="53" r="9" fill="#2a4fb8"/></g>';
    if (!c.st.flags.got_chamber) s += '<g transform="translate(290 568)"><rect width="108" height="52" rx="8" fill="#23303a"/><rect x="10" y="12" width="88" height="26" fill="#8e99a3" rx="3"/><g stroke="#2b3338" stroke-width="2" fill="none"><rect x="24" y="16" width="20" height="18"/><rect x="60" y="16" width="20" height="18"/></g></g>';
    if (!c.st.flags.got_coverslip) s += '<g transform="translate(420 566)"><rect width="96" height="62" rx="6" fill="#cfe9ec" opacity=".35" stroke="#9fd4e0" stroke-width="3"/><rect x="12" y="22" width="52" height="30" fill="#e9fbff" opacity=".75" stroke="#8fc8d0" stroke-width="2"/><rect x="22" y="14" width="52" height="30" fill="#e9fbff" opacity=".6" stroke="#8fc8d0" stroke-width="2"/><rect x="32" y="6" width="52" height="30" fill="#e9fbff" opacity=".5" stroke="#8fc8d0" stroke-width="2"/></g>';
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


  /* ===================== 배경 그림(Gemini) 위에 얹는 층 — ART_MODE 'img' 용 (좌표는 그림 기준) =====================
   * 그림에 없는 것(달력 숫자·쪽지·글·호수판·패널·줍는 물건)만 코드로 얹는다. 실사풍 그림에 겉돌지 않게
   * 종이는 어두운 톤으로, 위에 약한 그늘(dim)과 오른쪽 위 비상등의 붉은 기운(glow)을 한 겹 덮는다. */
  function dim(x, y, w, h, k) { return rect(x, y, w, h, '#06101a', 'rx="3" opacity="' + k + '"'); }
  function glow(x, y, w, h, k) { return rect(x, y, w, h, '#ff6a3d', 'rx="3" opacity="' + k + '"'); }
  function shadowE(cx, cy, rx) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + Math.max(4, rx * 0.12) + '" fill="#000" opacity=".38"/>'; }
  A.iDeskCal = function (c) { return calendar(c.P.cal, 121, 297, 145, 199, copt(c, { paper: '#a3b2bf', head: '#3f5d7c' })) + dim(121, 297, 145, 199, 0.16); };
  A.iDeskBoard = function (c) {
    return paperNote(420, 318, 190, 150, -3, '#d8cc94') + consPic(c.P.arr.cons[0], 432, 342, 168).replace(/<text[^>]*>[^<]*<\/text>/g, '') + pin(514, 324, 0.6) + dim(420, 318, 190, 150, 0.12) + glow(420, 318, 190, 150, 0.06);
  };
  A.iDeskMemo = function (c) { return c.st.flags.note_rubbed ? '' : '<g stroke="#6f7480" stroke-width="1.5" opacity=".7"><path d="M372 652 H432 M370 658 H434"/></g>'; };
  A.iDeskPencil = function (c) {
    return c.st.flags.got_pencil ? '' : shadowE(236, 683, 54) + '<g transform="translate(184 668) rotate(-3)"><rect width="96" height="10" fill="#c99a3f" rx="3"/><path d="M96 0 L116 5 L96 10 Z" fill="#cdb08a"/><path d="M110 3 L116 5 L110 7 Z" fill="#222"/><rect width="14" height="10" fill="#b8352b" rx="3"/><rect y="0" width="116" height="4" fill="#fff" opacity=".12"/></g>';
  };
  A.iShelfWb = function (c) {
    return paperNote(486, 282, 160, 100, 0, '#d4d5d9').replace(/<rect x="[^"]*" y="[^"]*" width="160" height="100" fill="#000"[^>]*\/>/, '') + consPic(c.P.arr.cons[1], 496, 292, 140).replace(/<text[^>]*>[^<]*<\/text>/g, '') + '<g stroke="#2c6ea8" stroke-width="4" fill="none" opacity=".6"><path d="M480 425 q40 -35 80 0 t80 0"/></g>' + dim(486, 282, 160, 100, 0.12) + glow(486, 282, 160, 100, 0.07);
  };
  A.iShelfOld = function (c) { return calendar(c.P.cal.old, 447, 537, 108, 156, copt(c, { paper: '#b7b299', head: '#6f6448', old: true })) + dim(447, 537, 108, 156, 0.14); };
  A.iBenchFlasks = function (c) {
    var s = '', P = c.P;
    [152, 236, 320, 405].forEach(function (cx, i) {
      if (c.st.flags.flasks_labeled) { s += rect(cx - 27, 397, 54, 36, '#d9d6c6', 'rx="4" opacity=".94"') + strainIcon(P.arr.ans[i], cx, 415, 12) + dim(cx - 27, 397, 54, 36, 0.1); }
      if (i === P.arr.decoy) s += '<g transform="rotate(-8 ' + cx + ' 415)">' + rect(cx - 27, 401, 54, 28, '#e0963a', 'rx="4"') + txt(cx, 421, '기준', 17, '#3a2200', 'text-anchor="middle" font-weight="800"') + '</g>';
      if (ez(c)) s += numChip(cx, 474, i + 1, 14);
    });
    return s;
  };
  A.iBenchItems = function (c) {
    var s = '';
    if (!c.st.flags.got_trypan) s += shadowE(212, 686, 36) + '<g transform="translate(190 604) scale(.85)"><rect width="56" height="96" rx="9" fill="#1d4f8a"/><rect x="14" y="-14" width="28" height="20" fill="#222" rx="4"/><rect x="6" y="34" width="44" height="38" fill="#cfd8dc" rx="3"/><circle cx="28" cy="53" r="9" fill="#2a4fb8"/><rect width="56" height="96" rx="9" fill="#fff" opacity=".06"/></g>';
    if (!c.st.flags.got_chamber) s += shadowE(332, 692, 56) + '<g transform="translate(278 642) scale(.92)"><rect width="108" height="52" rx="8" fill="#23303a"/><rect x="10" y="12" width="88" height="26" fill="#8e99a3" rx="3"/><g stroke="#2b3338" stroke-width="2" fill="none"><rect x="24" y="16" width="20" height="18"/><rect x="60" y="16" width="20" height="18"/></g></g>';
    if (!c.st.flags.got_coverslip) s += shadowE(452, 690, 50) + '<g transform="translate(404 632) scale(.9)"><rect width="96" height="62" rx="6" fill="#cfe9ec" opacity=".35" stroke="#9fd4e0" stroke-width="3"/><rect x="12" y="22" width="52" height="30" fill="#e9fbff" opacity=".7" stroke="#8fc8d0" stroke-width="2"/><rect x="22" y="14" width="52" height="30" fill="#e9fbff" opacity=".55" stroke="#8fc8d0" stroke-width="2"/><rect x="32" y="6" width="52" height="30" fill="#e9fbff" opacity=".45" stroke="#8fc8d0" stroke-width="2"/></g>';
    return s;
  };
  A.iDoorFridge = function (c) {
    return rect(137, 436, 73, 40, '#c4cbd2', 'rx="2"') + txt(173, 464, c.P.dial.no + '호기', 24, '#23282c', 'text-anchor="middle" font-weight="800"') + '<path d="M172 383 L185 370" stroke="#d8392c" stroke-width="5" stroke-linecap="round"/><circle cx="172" cy="383" r="3.5" fill="#222"/>';
  };
  A.iDoorClip = function (c) { return rect(368, 380, 84, 110, '#b9b5a2', 'rx="2"') + '<g stroke="#6a6652" stroke-width="3"><path d="M376 404 H444 M376 424 H444 M376 444 H444 M376 464 H444"/></g>' + dim(368, 380, 84, 110, 0.12) + glow(368, 380, 84, 110, 0.05); };
  A.iDoorPanel = function (c) {
    var open = c.st.flags.door_open, s = rect(415, 541, 64, 94, '#141a1f', 'rx="5" stroke="#59646d" stroke-width="3"');
    s += '<circle cx="447" cy="561" r="7" fill="' + (open ? '#4fe08a' : '#d8392c') + '"/><circle cx="447" cy="561" r="12" fill="' + (open ? '#4fe08a' : '#d8392c') + '" opacity=".18"/>' + '<g fill="#59646d">' + [0, 1, 2, 3].map(function (i) { return '<rect x="' + (421 + i * 14) + '" y="592" width="11" height="28" rx="2.5"/>'; }).join('') + '</g>';
    if (open) s += '<rect x="520" y="262" width="232" height="640" fill="#fff4c8" opacity=".5"/>';
    return s;
  };

  /* ===================== 확대 장면 ===================== */
  A.zCal = function (c) {
    var easy = ez(c), pt = easy ? (c.view && c.view.calPaint) : null;
    var s = zbg() + calendar(c.P.cal, 90, 60, 620, 560, copt(c, { paint: pt })) + '<g transform="translate(0 640)">';
    if (pt === 'circle') s += rect(104, -4, 224, 112, '#ffd54a', 'rx="16" opacity=".4"'); else if (pt === 'square') s += rect(352, -4, 160, 112, '#ffd54a', 'rx="16" opacity=".4"');
    s += ringIcon(150, 40, 22) + txt(190, 50, '발표', 30, '#f3e9d8', 'font-weight="700"') + sqIcon(390, 40, 20) + txt(428, 50, '마감', 30, '#f3e9d8', 'font-weight="700"') + pin(590, 36, 1) + txt(620, 50, '오늘', 30, '#f3e9d8', 'font-weight="700"') + '</g>';
    return s + zfin();
  };
  /* 메모 예시(발표까지 2칸·마감까지 5칸). 실제 판에서는 발표까지 3~9칸이라 이 값은 정답이 될 수 없다(검사기가 확인) */
  A.NOTE_EX = { a: 2, b: 5 };
  A.zNote = function (c) {
    var s = zbg() + paperNote(90, 70, 620, 650, -1, '#f4efdc'), rub = c.st.flags.note_rubbed;
    if (!rub) { s += '<g stroke="#d8d2bc" stroke-width="3" opacity=".7">' + Array.apply(null, Array(14)).map(function (_, i) { return '<path d="M120 ' + (140 + i * 38) + ' q' + (60 + (i * 17) % 40) + ' ' + (-8 + (i * 13) % 16) + ' ' + (200 + (i * 31) % 160) + ' 0"/>'; }).join('') + '</g>' + txt(400, 700, '눌린 자국이 있는 것 같습니다', 26, '#8a8470', 'text-anchor="middle"'); return s + zfin(); }
    if (!isFix(c)) return zNoteOld(c, s);
    var ink = '#3a3a3a', EX = A.NOTE_EX;
    // 위: 발표(○)→두 칸, 마감(□)→두 칸
    s += '<g stroke="' + ink + '" stroke-width="5" fill="none" opacity=".85">';
    s += ringIcon(170, 140, 34).replace('#e0483c', ink) + arrow(232, 140, 296, 140, ink, 5) + rect(330, 102, 80, 76, 'none', 'stroke="' + ink + '" stroke-width="5" rx="6"') + rect(420, 102, 80, 76, 'none', 'stroke="' + ink + '" stroke-width="5" rx="6"');
    s += sqIcon(170, 232, 32).replace('#4f9cf0', ink) + arrow(232, 232, 296, 232, ink, 5) + rect(330, 194, 80, 76, 'none', 'stroke="' + ink + '" stroke-width="5" rx="6"') + rect(420, 194, 80, 76, 'none', 'stroke="' + ink + '" stroke-width="5" rx="6"');
    s += '<path d="M210 286 Q400 330 590 286"/></g>';
    [0, 1, 2, 3].forEach(function (i) { s += rect(160 + i * 108, 326, 90, 84, i < 2 ? '#f9d9d4' : '#d6e6fa', 'rx="8" stroke="' + ink + '" stroke-width="5"'); });
    s += '<g transform="translate(640 372)" stroke="' + ink + '" stroke-width="6" fill="none"><rect x="-26" y="-6" width="52" height="42" rx="6"/><path d="M-14 -6 V-24 a14 14 0 0 1 28 0 V-6"/></g>';
    // 아래: 「예」 — 달력 한 줄에서 칸을 세는 법 (날짜 숫자는 ✕, 압정 다음 칸부터 발자국 번호)
    s += rect(110, 432, 580, 272, '#fbf7e6', 'rx="14" stroke="#b8b09c" stroke-width="3" stroke-dasharray="8 6"') + rect(124, 424, 54, 34, '#e3b04b', 'rx="10"') + txt(151, 449, '예', 24, '#2a1c08', 'text-anchor="middle" font-weight="900"');
    var X0 = 134, CW = 76, Y0 = 486, CH = 56, ccx = function (i) { return X0 + CW * (i + 0.5); }, i;
    for (i = 0; i < 7; i++) s += rect(X0 + CW * i + 1, Y0, CW - 2, CH, '#fffdf2', 'rx="4" stroke="#b8b09c" stroke-width="2.5"');
    s += pin(ccx(0) + 12, Y0 + 20, 0.9) + ringIcon(ccx(EX.a), Y0 + CH / 2, 21) + sqIcon(ccx(EX.b), Y0 + CH / 2, 19);
    [EX.a, EX.b].forEach(function (k, j) {   // 날짜 숫자 말풍선에 ✕: 이 숫자를 쓰는 게 아님
      var bx = ccx(k) - 28;
      s += '<g data-ref="notex"><rect x="' + bx + '" y="444" width="56" height="30" rx="8" fill="#fff" stroke="#9a948a" stroke-width="2"/>' + txt(bx + 28, 467, 12 + k * 1 + 2, 21, '#8a8470', 'text-anchor="middle" font-weight="700"') + '<path d="M' + (bx + 6) + ' 449 L' + (bx + 50) + ' 470 M' + (bx + 50) + ' 449 L' + (bx + 6) + ' 470" stroke="#d8392c" stroke-width="4" stroke-linecap="round"/></g>';
    });
    for (i = 1; i <= 5; i++) {   // 발자국 번호: 한 칸 = 한 발자국
      var hot = i === EX.a ? '#f9d9d4' : (i === EX.b ? '#d6e6fa' : '#fff'), edge = i === EX.a ? '#d8392c' : (i === EX.b ? '#2c6ea8' : '#8a8470');
      s += '<path d="M' + ccx(i) + ' ' + (Y0 + CH + 2) + ' V' + (Y0 + CH + 18) + '" stroke="' + edge + '" stroke-width="3" stroke-dasharray="3 4"/>';
      s += '<ellipse cx="' + ccx(i) + '" cy="' + (Y0 + CH + 40) + '" rx="19" ry="21" fill="' + hot + '" stroke="' + edge + '" stroke-width="3.5" stroke-dasharray="' + (hot === '#fff' ? '5 4' : '0') + '"/>' + foot(ccx(i), Y0 + CH + 25, 0.34, edge, 0) + txt(ccx(i), Y0 + CH + 50, i, 21, '#2a1f14', 'text-anchor="middle" font-weight="900"');
    }
    // 결과: 두 칸씩 붙여 쓴다 — 한 자리 수는 앞에 0 (2 → 02, 5 → 05)
    var digs = ['0', String(EX.a), '0', String(EX.b)], sx = [237, 317, 397, 477], sy = 612;
    digs.forEach(function (d, k) { s += rect(sx[k], sy, 70, 56, k < 2 ? '#f9d9d4' : '#d6e6fa', 'rx="8" stroke="' + ink + '" stroke-width="4"' + (d === '0' ? ' data-ref="lead0"' : '')) + txt(sx[k] + 35, sy + 42, d, 38, d === '0' ? '#9a948a' : ink, 'text-anchor="middle" font-weight="900"'); });
    s += '<path d="M' + ccx(EX.a) + ' ' + (Y0 + CH + 64) + ' V' + (sy - 10) + ' H' + (sx[0] + 75) + ' V' + (sy - 2) + '" stroke="#d8392c" stroke-width="3.5" fill="none"/><path d="M' + ccx(EX.b) + ' ' + (Y0 + CH + 64) + ' V' + (sy - 10) + ' H' + (sx[2] + 75) + ' V' + (sy - 2) + '" stroke="#2c6ea8" stroke-width="3.5" fill="none"/>';
    s += txt(400, 696, '두 칸씩 · 한 자리 수는 앞에 0', 22, '#6a6454', 'text-anchor="middle" font-weight="700"');
    return s + zfin();
  };
  /* 옛 그림(기능 스위치 normalFixes 가 꺼졌을 때) */
  function zNoteOld(c, s) {
    s += '<g stroke="#3a3a3a" stroke-width="5" fill="none" opacity=".85">';
    s += ringIcon(170, 190, 36).replace('#e0483c', '#3a3a3a') + arrow(235, 190, 300, 190, '#3a3a3a', 5) + rect(330, 150, 80, 80, 'none', 'stroke="#3a3a3a" stroke-width="5" rx="6"') + rect(420, 150, 80, 80, 'none', 'stroke="#3a3a3a" stroke-width="5" rx="6"');
    s += sqIcon(170, 330, 34).replace('#4f9cf0', '#3a3a3a') + arrow(235, 330, 300, 330, '#3a3a3a', 5) + rect(330, 290, 80, 80, 'none', 'stroke="#3a3a3a" stroke-width="5" rx="6"') + rect(420, 290, 80, 80, 'none', 'stroke="#3a3a3a" stroke-width="5" rx="6"');
    s += '</g>';
    s += '<g stroke="#3a3a3a" stroke-width="5" fill="none" opacity=".85"><path d="M210 440 Q400 520 590 440" /></g>';
    [0, 1, 2, 3].forEach(function (i) { s += rect(150 + i * 108, 500, 90, 90, i < 2 ? '#f9d9d4' : '#d6e6fa', 'rx="8" stroke="#3a3a3a" stroke-width="5"'); });
    s += '<g transform="translate(610 545)" stroke="#3a3a3a" stroke-width="6" fill="none"><rect x="-26" y="-6" width="52" height="42" rx="6"/><path d="M-14 -6 V-24 a14 14 0 0 1 28 0 V-6"/></g>';
    s += '<g transform="translate(0 640)">' + pin(170, 26, 0.9) + arrow(205, 30, 290, 30, '#3a3a3a', 5) + rect(300, 4, 54, 54, 'none', 'stroke="#3a3a3a" stroke-width="5" rx="6"') + txt(327, 44, '1', 34, '#3a3a3a', 'text-anchor="middle" font-weight="800"') + '</g>';
    return s + zfin();
  }
  A.zBoard = function (c) {
    var s = zbg() + rect(50, 60, 700, 680, '#2a1f14', 'rx="14"') + rect(66, 76, 668, 648, '#a37a4a', 'rx="8"');
    for (var i = 0; i < 120; i++) s += '<circle cx="' + (80 + (i * 61) % 640) + '" cy="' + (90 + (i * 43) % 620) + '" r="4" fill="#8b6538" opacity=".55"/>';
    s += paperNote(150, 170, 500, 400, -2, '#fff6b8') + consPic(c.P.arr.cons[0], 190, 250, 420) + pin(400, 190, 1.4);
    return s + zfin();
  };
  A.zWb = function (c) {
    var P = c.P, acc = ESC.parts.BANDS.indexOf(P.dir.accept) >= 0 ? P.dir.accept : 'blue', oth = acc === 'blue' ? 'orange' : 'blue';
    var s = zbg() + rect(40, 70, 720, 640, '#1b2327', 'rx="10"') + rect(54, 84, 692, 612, '#eef1f2', 'rx="6"') + rect(54, 680, 692, 16, '#8e99a3');
    s += '<g stroke="#e8e4dc" stroke-width="22" opacity=".45"><path d="M90 640 L300 620 M520 120 L700 150"/></g>';
    s += consPic(P.arr.cons[1], 90, 120, 330).replace(/#3a362e/g, '#1f4f8a').replace(/#fffdf2/g, 'none');
    s += '<path d="M440 110 V420" stroke="#c9d3d9" stroke-width="3" stroke-dasharray="4 10"/>';
    // 책 읽는 규칙: 띠 색 ✓ 만 읽고, 번호 작은 것부터
    s += '<g transform="translate(560 160)">' + rect(-80, -26, 150, 52, COL[acc], 'rx="8"') + '<g transform="translate(110 0)" stroke="#2b9a55" stroke-width="9" fill="none" stroke-linecap="round"><path d="M-18 2 L-6 16 L20 -16"/></g></g>';
    s += '<g transform="translate(560 270)">' + rect(-80, -26, 150, 52, COL[oth], 'rx="8" opacity=".7"') + '<g transform="translate(110 0)" stroke="#d8392c" stroke-width="9" fill="none" stroke-linecap="round"><path d="M-16 -16 L16 16 M16 -16 L-16 16"/></g></g>';
    if (isFix(c)) {   // 보통 고침: 「눈」 대신 책등(띠+둥근 번호) 그림, 번호 원은 읽을 책 수(4)만큼
      s += '<g transform="translate(560 380)"><rect x="-26" y="-48" width="52" height="96" rx="7" fill="#6a2a2a"/><rect x="-26" y="-22" width="52" height="24" fill="' + COL[acc] + '"/><circle cx="0" cy="20" r="15" fill="#f3e9d8"/>' + txt(0, 30, 'n', 26, '#2a1f14', 'text-anchor="middle" font-weight="900"') + '</g>';
      s += '<g transform="translate(410 520)">' + [0, 1, 2, 3].map(function (k) { return '<circle data-ref="wbnum" cx="' + (k * 82 + 30) + '" cy="0" r="27" fill="none" stroke="#1f4f8a" stroke-width="5"/>' + '<text x="' + (k * 82 + 30) + '" y="13" font-size="34" font-weight="900" text-anchor="middle" fill="#1f4f8a" ' + F + '>' + (k + 1) + '</text>' + (k < 3 ? arrow(k * 82 + 62, 0, k * 82 + 78, 0, '#1f4f8a', 4) : ''); }).join('') + '</g>';
    } else {
      s += '<g transform="translate(560 380)" stroke="#1f4f8a" stroke-width="5" fill="none"><ellipse rx="52" ry="30"/><circle r="14" fill="#1f4f8a"/></g>';
      s += '<g transform="translate(470 480)">' + [0, 1, 2].map(function (k) { return '<circle cx="' + (k * 90 + 40) + '" cy="0" r="28" fill="none" stroke="#1f4f8a" stroke-width="5"/>' + '<text x="' + (k * 90 + 40) + '" y="13" font-size="34" font-weight="900" text-anchor="middle" fill="#1f4f8a" ' + F + '>' + (k + 1) + '</text>' + (k < 2 ? arrow(k * 90 + 72, 0, k * 90 + 100, 0, '#1f4f8a', 5) : ''); }).join('') + '</g>';
    }
    if (ez(c)) s += flaskIcon(80, 106, 1.15) + bookIcon(480, 104, 1.15);   // 쉬움: 왼쪽은 병 쪽지, 오른쪽은 책 규칙
    return s + zfin();
  };
  A.zDrawer = function (c) {
    var open = c.st.solved.drawer, s = zbg() + rect(60, 70, 680, 640, '#4b3520', 'rx="14"') + rect(90, 100, 620, 280, 'url(#gWood)', 'rx="10" stroke="#2d1f12" stroke-width="6"');
    s += rect(330, 190, 140, 24, '#b9b9b9', 'rx="12"') + (open ? rect(130, 140, 540, 220, '#10171b', 'rx="8"') + '<g opacity=".7">' + rect(170, 200, 120, 40, '#556b7f', 'rx="6"') + rect(330, 200, 110, 90, '#8a2a2a', 'rx="6"') + rect(480, 210, 150, 30, '#c9c3a8', 'rx="4"') + '</g>' : '<circle cx="400" cy="300" r="12" fill="#222"/><rect x="396" y="300" width="8" height="26" fill="#222"/>');
    s += rect(90, 400, 620, 96, '#3a2816', 'rx="8"') + rect(90, 520, 620, 96, '#3a2816', 'rx="8"') + (open ? '' : txt(400, 760, '번호를 맞추고 당기면 열립니다', 28, '#b9a88f', 'text-anchor="middle"'));
    return s + zfin();
  };
  A.zBooks = function (c) {
    var s = zbg() + rect(30, 60, 740, 470, '#3a2816', 'rx="10"') + rect(44, 74, 712, 442, '#1c130b') + rect(44, 480, 712, 14, '#6a4a2a'), P = c.P;
    var fill = ['#6a2a2a', '#2a4a6a', '#3a5a3a', '#7a6a2a', '#5a3a6a', '#2a5a5a'];
    for (var i = 0; i < 6; i++) {
      var b = P.dir.books[i], bx = 62 + i * 114, h = 340 - (i * 17) % 40;
      s += rect(bx, 480 - h, 100, h, fill[i], 'rx="4" stroke="#0e0905" stroke-width="3"') + rect(bx, 480 - h + 52, 100, 34, COL[b.band], 'opacity=".95"');
      s += '<circle cx="' + (bx + 50) + '" cy="' + (480 - h + 130) + '" r="30" fill="#f3e9d8"/>' + txt(bx + 50, 480 - h + 143, b.vol, 40, '#2a1f14', 'text-anchor="middle" font-weight="900"');
      s += '<circle cx="' + (bx + 50) + '" cy="' + (480 - h + 215) + '" r="30" fill="#2a1f14" stroke="#f3e9d8" stroke-width="3"/>' + dirArrow(b.arrow, bx + 50, 480 - h + 215, 16, '#f3e9d8');
    }
    s += c.st.solved.books ? txt(400, 570, '책장 뒤 칸이 열렸습니다', 28, '#b9a88f', 'text-anchor="middle"') : '';
    return s + zfin();
  };
  A.zOld = function (c) {
    var s = zbg() + calendar(c.P.cal.old, 90, 90, 620, 560, copt(c, { paper: '#e6dcb8', head: '#8a7a5a', old: true })) + '<g transform="rotate(-8 400 70)">' + rect(260, 30, 280, 60, '#fff6b8', 'rx="6" stroke="#b9a85a" stroke-width="3"') + txt(400, 72, '지난 학기', 36, '#5a4a1a', 'text-anchor="middle" font-weight="800"') + '</g>';
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
    if (ez(c)) for (var n = 0; n < 4; n++) s += numChip(130 + n * 180, 301, n + 1, 14);   // 쉬움: 선반 병 자리 1~4
    s += rect(20, 330, 760, 100, '#fff6b8', 'rx="8" opacity=".0"') + paperNote(30, 322, 400, 104, 0, '#fff6b8') + consPic(P.arr.cons[2], 44, 334, 270).replace(/<text[^>]*>[^<]*<\/text>/g, '');
    s += '<g transform="translate(560 376)">' + rect(-110, -44, 220, 88, '#e9eef0', 'rx="8"') + '<g transform="translate(-60 0)" fill="none" stroke="#e0483c" stroke-width="6"><rect x="-22" y="-14" width="44" height="28" rx="4" fill="#ffb347" stroke="none"/><path d="M-26 -22 L26 22 M26 -22 L-26 22"/></g>' + '<g transform="translate(40 0)"><rect x="-34" y="-8" width="68" height="16" rx="8" fill="#9b6cf0"/><path d="M-20 -20 q20 -26 40 0" stroke="#9b6cf0" stroke-width="5" fill="none"/></g><g transform="translate(96 -6)" stroke="#2b9a55" stroke-width="7" fill="none"><path d="M-14 4 L-4 14 L16 -12"/></g></g>';
    return s + zfin();
  };
  /* 상자 도해의 예시 별 자리: 판마다 달라지고 실제 별 병과는 늘 다르다(실제 자리를 알려 주지 않음) */
  A.boxExStar = function (P) { return (P.arr.star + 1 + (P.seed % 3)) % 4; };
  A.zBox = function (c) {
    var s = zbg() + rect(50, 40, 700, 440, '#4a545b', 'rx="18" stroke="#2b3338" stroke-width="8"') + rect(50, 40, 700, 70, '#5c6870', 'rx="18"') + rect(330, 70, 140, 26, '#2b3338', 'rx="10"') + rect(360, 456, 80, 18, '#a7b2bb', 'rx="6"');
    s += rect(86, 124, 628, 300, '#f2efe3', 'rx="12"');
    // 왼쪽: 병 자리 칸 그림(병 네 개 중 ★ 표시 병의 자리 번호) → 숫자 칸
    for (var i = 0; i < 4; i++) { var fx = 128 + i * 64; s += '<path d="M' + (fx - 8) + ' 168 L' + (fx - 8) + ' 190 L' + (fx - 26) + ' 226 L' + (fx + 26) + ' 226 L' + (fx + 8) + ' 190 L' + (fx + 8) + ' 168 Z" fill="#cfe9ec" stroke="#6aa0aa" stroke-width="3"/><path d="M' + (fx - 20) + ' 208 L' + (fx - 26) + ' 224 L' + (fx + 26) + ' 224 L' + (fx + 20) + ' 208 Z" fill="#4fae5a"/>'; }
    if (isFix(c)) {   // 보통 고침: 병마다 자리 번호 1~4, 별은 「이 병 자리」를 보이는 점선 예시(자리는 판마다 달라지며 실제 별 병은 절대 아님)
      var ex = A.boxExStar(c.P), ex_x = 128 + ex * 64;
      for (var q = 0; q < 4; q++) s += txt(128 + q * 64, 254, q + 1, 26, '#3a362e', 'text-anchor="middle" font-weight="800"');
      s += '<g data-ref="boxstar" stroke-dasharray="5 4">' + symbol(3, ex_x, 146, 17, '#9b6cf0') + '</g><path d="M' + (ex_x - 22) + ' 160 H' + (ex_x + 22) + ' V232 H' + (ex_x - 22) + ' Z" fill="none" stroke="#9b6cf0" stroke-width="3" stroke-dasharray="5 4" rx="8"/>';
      s += arrow(224, 264, 224, 298, '#3a362e', 6) + rect(186, 304, 76, 76, '#fffdf2', 'rx="10" stroke="#3a362e" stroke-width="5"');
    } else {
      s += symbol(3, 128 + 64, 146, 17, '#9b6cf0') + '<path d="M192 160 V166" stroke="#9b6cf0" stroke-width="3"/>';
      s += arrow(224, 240, 224, 296, '#3a362e', 6) + rect(186, 304, 76, 76, '#fffdf2', 'rx="10" stroke="#3a362e" stroke-width="5"');
    }
    // 오른쪽: 균주 번호표 그림 → 숫자 칸
    s += '<g transform="translate(560 190)"><rect x="-44" y="-50" width="88" height="110" rx="8" fill="#f4efdc" stroke="#b8b09c" stroke-width="3"/>' + [0, 1, 2, 3].map(function (k) { return '<circle cx="-22" cy="' + (-26 + k * 24) + '" r="7" fill="#6aa86a"/><rect x="-8" y="' + (-31 + k * 24) + '" width="34" height="10" rx="3" fill="#3a362e"/>'; }).join('') + '</g>';
    s += arrow(560, 262, 560, 296, '#3a362e', 6) + rect(522, 304, 76, 76, '#fffdf2', 'rx="10" stroke="#3a362e" stroke-width="5"');
    // 두 칸을 붙여 쓴다(괄호+자물쇠)
    s += '<path d="M190 396 Q392 440 594 396" stroke="#3a362e" stroke-width="5" fill="none"/><g transform="translate(392 410)" stroke="#3a362e" stroke-width="5" fill="none"><rect x="-22" y="0" width="44" height="34" rx="6"/><path d="M-12 0 V-14 a12 12 0 0 1 24 0 V0"/></g>';
    return s + zfin();
  };
  A.zScope = function (c) {
    var f = c.st.flags, P = c.P, X0 = 223, Y0 = 56, L = 118, s = zbg() + rect(X0 - 18, Y0 - 18, L * 3 + 36, L * 3 + 36, '#0c1215', 'rx="22" stroke="#59646d" stroke-width="8"');
    if (!f.chamber_on) { s += rect(X0, Y0, L * 3, L * 3, '#9fb4b8', 'rx="10"') + rect(X0 + 40, Y0 + 130, L * 3 - 80, 94, '#7b8c91', 'rx="10"') + txt(400, Y0 + 190, '빈 스테이지', 32, '#e9eef0', 'text-anchor="middle" font-weight="700"'); }
    else {
      s += rect(X0, Y0, L * 3, L * 3, '#dff0f1', 'rx="6"');
      for (var q = 0; q < 9; q++) {
        var ox = X0 + (q % 3) * L, oy = Y0 + Math.floor(q / 3) * L, corner = ESC.parts.CORNERS.indexOf(q) >= 0;
        s += rect(ox, oy, L, L, corner ? '#eaf6f4' : '#e3ebec', 'stroke="' + (corner ? '#d4a52c' : '#7d8e92') + '" stroke-width="' + (corner ? 5 : 2) + '"');
        s += '<g stroke="#a9c1c4" stroke-width="1.2">' + [1, 2, 3].map(function (k) { return '<path d="M' + (ox + k * L / 4) + ' ' + oy + ' V' + (oy + L) + ' M' + ox + ' ' + (oy + k * L / 4) + ' H' + (ox + L) + '"/>'; }).join('') + '</g>';
        if (f.sample_on) P.cnt.squares[q].forEach(function (o) { var cx = ox + o.x * L, cy = oy + o.y * L; s += o.dead ? '<circle cx="' + cx + '" cy="' + cy + '" r="9" fill="#2a4fb8" stroke="#16307a" stroke-width="2.5"/>' : '<circle cx="' + cx + '" cy="' + cy + '" r="9" fill="#6fd06a" stroke="#2c8a3a" stroke-width="2.5"/><circle cx="' + (cx - 2.5) + '" cy="' + (cy - 2.5) + '" r="3" fill="#bff0b8"/>'; });
      }
      if (!f.sample_on) s += txt(400, Y0 + L * 1.5 + 10, '시료를 채우세요', 28, '#506670', 'text-anchor="middle" font-weight="700"');
    }
    // 안내 카드(그림): 모서리 큰 칸 네 개만 센다 · 초록 ○ 세기 · 파랑 ● 제외
    s += rect(110, 464, 580, 82, '#f4efdc', 'rx="12"');
    s += '<g transform="translate(150 476)">' + [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (q) { var corner = ESC.parts.CORNERS.indexOf(q) >= 0; return rect((q % 3) * 20, Math.floor(q / 3) * 20, 18, 18, corner ? '#d4a52c' : '#b9c3c6', 'rx="2"'); }).join('') + '</g>';
    s += '<g transform="translate(260 505)"><circle r="15" fill="#6fd06a" stroke="#2c8a3a" stroke-width="3"/><path d="M28 4 L40 16 L62 -12" stroke="#2b9a55" stroke-width="8" fill="none" stroke-linecap="round"/></g>';
    s += '<g transform="translate(430 505)"><circle r="15" fill="#2a4fb8" stroke="#16307a" stroke-width="3"/><path d="M28 -14 L56 14 M56 -14 L28 14" stroke="#d8392c" stroke-width="8" stroke-linecap="round"/></g>';
    if (isFix(c)) {   // 보통 고침: 준비 순서 3칸 — ① 커버글라스→계수판 ② 시료→트립판 ③ 시료가 채워진 계수판을 스테이지에. 한 일은 ✓
      var inv = c.st.inv, d1 = inv.indexOf('chamber_ready') >= 0 || !!f.chamber_on, d2 = inv.indexOf('tube_stained') >= 0 || !!f.sample_on, d3 = !!f.sample_on;
      var icon = function (id, x, y, k) { return A.ico(id, c).replace('<svg viewBox="0 0 100 100">', '<svg x="' + x + '" y="' + y + '" width="' + k + '" height="' + k + '" viewBox="0 0 100 100">'); };
      var cell = function (x, done) { return '<g data-ref="prep">' + rect(x, 560, 180, 92, done ? '#d9efdc' : '#f4efdc', 'rx="12" stroke="' + (done ? '#2b9a55' : '#b8b09c') + '" stroke-width="3"/>') + (done ? '<circle cx="' + (x + 160) + '" cy="580" r="14" fill="#2b9a55"/><path d="M' + (x + 153) + ' 580 l5 6 l9 -11" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' : '') + '</g>'; };
      s += cell(110, d1) + icon('coverslip', 116, 574, 62) + arrow(180, 606, 198, 606, '#3a362e', 4) + icon('chamber', 196, 574, 62);
      s += cell(310, d2) + icon('tube', 316, 574, 62) + arrow(380, 606, 398, 606, '#3a362e', 4) + icon('trypan', 396, 574, 62);
      s += cell(510, d3);
      var gx = 540, gy = 578; s += rect(gx, gy, 66, 66, '#dff0f1', 'rx="4" stroke="#7d8e92" stroke-width="2.5"') + '<g stroke="#a9c1c4" stroke-width="1.5"><path d="M' + (gx + 22) + ' ' + gy + ' V' + (gy + 66) + ' M' + (gx + 44) + ' ' + gy + ' V' + (gy + 66) + ' M' + gx + ' ' + (gy + 22) + ' H' + (gx + 66) + ' M' + gx + ' ' + (gy + 44) + ' H' + (gx + 66) + '"/></g>';
      [[10, 10], [33, 14], [54, 8], [12, 34], [38, 36], [56, 30], [8, 56], [30, 54], [52, 54]].forEach(function (o, k) { s += '<circle cx="' + (gx + o[0]) + '" cy="' + (gy + o[1]) + '" r="5" fill="' + (k % 4 === 3 ? '#2a4fb8' : '#6fd06a') + '" stroke="' + (k % 4 === 3 ? '#16307a' : '#2c8a3a') + '" stroke-width="1.5"/>'; });
      s += arrow(616, 612, 640, 612, '#3a362e', 4);
    }
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
    var open = c.st.flags.door_open, dots = (ESC.scenarios && ESC.scenarios.lab && ESC.scenarios.lab.panelDots) || ['green', 'red', 'blue', 'orange'];
    var s = zbg() + rect(40, 40, 720, 720, 'url(#gMetal)', 'rx="22" stroke="#3b444b" stroke-width="8"') + rect(70, 70, 660, 660, '#2b3338', 'rx="14"');
    s += '<circle cx="130" cy="124" r="20" fill="' + (open ? '#4fe08a' : '#d8392c') + '"/>';
    // 색 점 4개: 순서 단서가 되지 않게 2×2로 흩어 놓는다
    dots.forEach(function (k, i) { s += '<circle cx="' + (214 + (i % 2) * 46) + '" cy="' + (112 + Math.floor(i / 2) * 46) + '" r="17" fill="' + COL[k] + '" stroke="#10171b" stroke-width="3"/>'; });
    // 큰 번개 → 작은 번개(에너지가 큰 쪽부터 왼쪽)
    function bolt(cx, cy, sc, fill) { return '<path transform="translate(' + cx + ' ' + cy + ') scale(' + sc + ')" d="M-14 24 L6 -26 L10 -4 L26 -4 L-6 32 L-2 8 Z" fill="' + fill + '"/>'; }
    s += bolt(400, 140, 1.7, '#ffd54a') + arrow(450, 140, 560, 140, '#f3e9d8', 8) + bolt(620, 140, 0.8, '#a58f36');
    s += rect(110, 226, 580, 6, '#59646d', 'rx="3" opacity=".6"');
    return s + zfin();
  };
  A.zStrain = function (c) {
    var P = c.P, s = zbg() + paperNote(100, 40, 600, 720, 0, '#f4efdc') + txt(400, 110, '균주 번호표', 40, '#3a362e', 'text-anchor="middle" font-weight="800"');
    ESC.parts.STRAINS.forEach(function (st, i) { var y = 190 + i * 100; s += rect(140, y - 40, 520, 84, 'none', 'stroke="#b8b09c" stroke-width="3" rx="8"') + strainIcon(st.id, 210, y, 28) + txt(330, y + 12, st.ko, 30, '#3a362e', 'font-weight="700"') + '<circle cx="600" cy="' + y + '" r="30" fill="#2a1f14"/>' + txt(600, y + 14, P.arr.table[st.id], 40, '#f3e9d8', 'text-anchor="middle" font-weight="900"'); });
    return s + zfin();
  };
  A.zTextbook = function (c) {
    var s = zbg() + paperNote(60, 40, 680, 720, 0, '#f4efdc') + txt(400, 110, '빛의 색과 에너지', 38, '#3a362e', 'text-anchor="middle" font-weight="800"'), F2 = isFix(c);
    var cols = [['#7a3fd0', '보라', 410], ['#2b6fe0', '파랑', 470], ['#3fbf5a', '초록', 530], ['#f0a020', '주황', 600], ['#e03a2a', '빨강', 650]];
    cols.forEach(function (k, i) {
      var x = 110 + i * 116, dimV = F2 && i === 0;   // 보통 고침: 이 방에서 안 쓰는 보라 칸은 흐리게
      s += (dimV ? '<g opacity=".3">' : '') + rect(x, 170, 112, 110, k[0], 'rx="6"') + txt(x + 56, 232, k[1], 30, '#fff', 'text-anchor="middle" font-weight="800"') + txt(x + 56, 316, '약 ' + k[2], 26, '#3a362e', 'text-anchor="middle" font-weight="700"');
      if (F2) s += bolt(x + 56, 372, [1.5, 1.28, 1.06, 0.84, 0.62][i], '#e8b92c');   // 파장이 짧을수록 번개가 큼 = 최종 패널의 「큰 번개→작은 번개」
      s += (dimV ? '</g>' : '');
    });
    var ay = F2 ? 452 : 360;
    s += arrow(120, ay, 680, ay, '#3a362e', 5) + txt(120, ay + 36, '파장 짧음', 24, '#3a362e', 'font-weight="700"') + txt(680, ay + 36, '파장 긺', 24, '#3a362e', 'text-anchor="end" font-weight="700"');
    var oy = F2 ? 540 : 480;
    s += txt(400, oy, '파장(nm)이 짧을수록 빛의 에너지가 큽니다.', 30, '#2a1f14', 'text-anchor="middle" font-weight="700"') + txt(400, oy + 100, '엽록소는 주로 빨강과 파랑 빛을 흡수하고', 28, '#3a362e', 'text-anchor="middle"') + txt(400, oy + 142, '초록 빛은 반사합니다.', 28, '#3a362e', 'text-anchor="middle"');
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
    else if (k === 'coverslip') s = '<rect x="12" y="58" width="76" height="26" rx="5" fill="#cfe9ec" opacity=".3" stroke="#9fd4e0" stroke-width="3"/><rect x="20" y="42" width="46" height="26" fill="#e9fbff" opacity=".85" stroke="#8fc8d0" stroke-width="2.5"/><rect x="30" y="32" width="46" height="26" fill="#e9fbff" opacity=".7" stroke="#8fc8d0" stroke-width="2.5"/><rect x="40" y="22" width="46" height="26" fill="#e9fbff" opacity=".6" stroke="#8fc8d0" stroke-width="2.5"/>';
    else if (k === 'chamber') s = '<rect x="14" y="34" width="72" height="34" rx="4" fill="#9aa5ad"/><g stroke="#2b3338" stroke-width="2" fill="none"><rect x="30" y="40" width="16" height="22"/><rect x="54" y="40" width="16" height="22"/></g>';
    else if (k === 'chamberReady') s = '<rect x="14" y="38" width="72" height="34" rx="4" fill="#9aa5ad"/><rect x="26" y="30" width="48" height="28" rx="2" fill="#cfe9ec" opacity=".75" stroke="#8fc8d0" stroke-width="3"/>';
    else if (k === 'tube' || k === 'tubeStained') s = '<path d="M38 16 H62 V68 L50 86 L38 68 Z" fill="url(#gGlass)" stroke="#b7e6ea" stroke-width="3"/><path d="M40 48 H60 V66 L50 82 L40 66 Z" fill="' + (k === 'tube' ? '#58b862' : '#2f6fa8') + '"/><rect x="34" y="10" width="32" height="10" rx="3" fill="#e0483c"/>';
    else if (k === 'trypan') s = '<rect x="32" y="30" width="36" height="56" rx="6" fill="#1d4f8a"/><rect x="40" y="16" width="20" height="16" rx="3" fill="#222"/><rect x="36" y="50" width="28" height="22" rx="2" fill="#e9eef0"/><circle cx="50" cy="61" r="6" fill="#2a4fb8"/>';
    return '<svg viewBox="0 0 100 100">' + s + '</svg>';
  };
  /* 태그 고리: 모은 색 태그를 한 칸에 */
  var TAGS = ['red', 'orange', 'green', 'blue', 'violet'];
  var oldIco = A.ico;
  A.ico = function (id, c) {
    if (id !== 'tag_ring') return oldIco(id, c);
    var have = TAGS.filter(function (k) { return c.st.inv.indexOf('tag_' + k) >= 0; }), s = '<circle cx="50" cy="46" r="26" fill="none" stroke="#c9d3d9" stroke-width="5"/>';
    have.forEach(function (k, i) { var a = -2.4 + i * 0.95; s += '<g transform="translate(' + (50 + Math.cos(a) * 30) + ' ' + (46 + Math.sin(a) * 30 + 14) + ') rotate(' + (a * 57 + 90) + ')"><rect x="-9" y="-6" width="18" height="30" rx="5" fill="' + COL[k] + '" stroke="#fff" stroke-width="2"/></g>'; });
    return '<svg viewBox="0 0 100 100">' + s + '</svg>';
  };
  A.tagRingBig = function (c) {
    var s = '', P = c.P;
    TAGS.forEach(function (k, i) {
      var x = 20 + i * 100, has = c.st.inv.indexOf('tag_' + k) >= 0;
      s += has ? '<path d="M' + x + ' 20 H' + (x + 62) + ' L' + (x + 86) + ' 60 L' + (x + 62) + ' 100 H' + x + ' Z" fill="' + COL[k] + '" stroke="#fff" stroke-width="4"/><circle cx="' + (x + 14) + '" cy="60" r="7" fill="#1c1611"/><text x="' + (x + 52) + '" y="76" font-size="52" font-weight="900" text-anchor="middle" fill="#fff" ' + F + '>' + P.tags[k] + '</text>' : '<path d="M' + x + ' 20 H' + (x + 62) + ' L' + (x + 86) + ' 60 L' + (x + 62) + ' 100 H' + x + ' Z" fill="none" stroke="#59646d" stroke-width="3" stroke-dasharray="6 6"/>';
    });
    return '<svg viewBox="0 0 520 120">' + s + '</svg>';
  };

  /* 잠금 자리 이름표 그림(쉬움 전체 · 서랍은 보통도). span = 차지하는 칸 수. 칸 폭에 맞춰 늘어나는 한 줄 그림 */
  A.labIcon = function (ic, span) {
    var W = 60 * (span || 1), g = '', m = ic.match(/^n(\d)$/), PA = '#f3e9d8';
    if (ic === 'footRing') g = ringIcon(28, 20, 11) + foot(70, 24, 0.7, PA, -12) + foot(96, 15, 0.7, PA, 12);
    else if (ic === 'footSq') g = sqIcon(28, 20, 10) + foot(70, 24, 0.7, PA, -12) + foot(96, 15, 0.7, PA, 12);
    else if (m) g = '<circle cx="30" cy="20" r="15" fill="' + PA + '"/>' + txt(30, 28, m[1], 22, '#2a1f14', 'text-anchor="middle" font-weight="900"');
    else if (ic === 'dotL' || ic === 'dotM' || ic === 'dotS') g = rect(12, 4, 36, 32, '#fff6b8', 'rx="5"') + '<circle cx="30" cy="20" r="' + { dotL: 12, dotM: 8, dotS: 4.5 }[ic] + '" fill="#3a3a3a" opacity="' + { dotL: 1, dotM: 0.7, dotS: 0.45 }[ic] + '"/>';
    else if (ic === 'flowR') g = arrow(14, 20, 226, 20, PA, 4) + [30, 85, 140, 195].map(function (x) { return '<circle cx="' + x + '" cy="20" r="5" fill="' + PA + '"/>'; }).join('');
    else if (ic === 'bottleN') g = flaskIcon(30, 24, 0.55) + symbol(3, 30, 8, 7, '#b99aff');
    else if (ic === 'tableN') g = rect(14, 3, 32, 34, '#f4efdc', 'rx="3"') + [0, 1, 2, 3].map(function (k) { return '<circle cx="23" cy="' + (10 + k * 8) + '" r="2.6" fill="#6aa86a"/><rect x="30" y="' + (8 + k * 8) + '" width="12" height="4" rx="1.5" fill="#3a362e"/>'; }).join('');
    else if (ic === 'degCF') g = txt(30, 26, '°C→°F', 16, '#ffd54a', 'text-anchor="middle" font-weight="800"');
    else if (ic === 'greenSum') g = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (q) { var cor = [0, 2, 6, 8].indexOf(q) >= 0; return rect(6 + (q % 3) * 9, 7 + Math.floor(q / 3) * 9, 8, 8, cor ? '#d4a52c' : '#59646d', 'rx="1.5"'); }).join('') + '<circle cx="46" cy="20" r="8" fill="#6fd06a" stroke="#2c8a3a" stroke-width="2.5"/>';
    else if (ic === 'boltFlow') g = bolt(34, 20, 0.62, '#ffd54a') + arrow(70, 20, 168, 20, PA, 4) + bolt(206, 20, 0.3, '#a58f36');
    return '<svg viewBox="0 0 ' + W + ' 40" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' + g + '</svg>';
  };
  A.strainIcon = strainIcon; A.symbol = symbol; A.dirArrow = dirArrow; A.arrow = arrow; A.COL = COL; A.SYMKO = SYMKO; A.defs = defs;

  ESC.art = A;
  if (typeof module !== 'undefined' && module.exports) module.exports = A;
})(typeof window !== 'undefined' ? window : globalThis);
