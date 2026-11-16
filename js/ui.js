/* ============================================================================
 * ui.js — L1 엔진의 화면: 장면 보기·누르는 영역·확대·소지품·잠금 위젯 5종·메모장·힌트·저장·끝 화면
 * 소재를 모른다: 장면·그림은 ESC.scenarios.lab / ESC.art 에서 받는다.
 * ==========================================================================*/
(function () {
  'use strict';
  var ESC = window.ESC, $ = function (id) { return document.getElementById(id); };
  var scn = ESC.scenarios.lab, art = ESC.art, P = ESC.parts;
  var KEY = 'escape.lab.v1', BEST = 'escape.best.v1', DKEY = 'escape.diff.v1';
  function lsGet(k) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {} }

  var calm = false;
  try { calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  try { var pr = parent && parent !== window && parent.document.getElementById('gameRoot'); if (pr && pr.classList.contains('calm')) calm = true; } catch (e) {}
  if (calm) document.documentElement.classList.add('calm');

  var core = null, sel = null, zoomId = null, zoomFrom = null, hl = { t: [], until: 0 }, ended = false, lastTick = 0, saveT = 0, toastT = 0, urlFast = /[?&]fast=1/.test(location.search);
  var ICON = {
    note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0012 3z"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z" fill="currentColor"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>',
    uv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 4v8a7 7 0 0014 0V4"/></svg>'
  };

  /* ---------------- 시작 · 저장 ---------------- */
  function newSeed() { return ((Date.now() ^ (Math.random() * 4294967296)) >>> 0) || 1; }
  /* 난이도: 새 판을 시작할 때 카드 두 장으로 고르고(마지막 선택이 미리 강조, 처음엔 쉬움), 「다시 하기」·「처음부터 다시」는 카드 없이 마지막 선택으로 바로 시작한다. 이어하기는 저장된 난이도(없으면 보통) 그대로 */
  function diffOn() { return !!(scn.features && scn.features.easy); }
  function lastDiff() { var v = lsGet(DKEY); return v && (v.d === 'easy' || v.d === 'normal') ? v.d : 'easy'; }
  function setLastDiff(d) { lsSet(DKEY, { d: d }); }
  var diffParam = (location.search.match(/[?&]diff=(easy|normal)/) || [])[1], pendingSeed = 0;
  function syncDiff() { document.documentElement.classList.toggle('easy', !!core && core.diff() === 'easy'); renderSwitch(); }
  function renderSwitch() {
    var d = core ? core.diff() : 'normal', h = diffOn() ? '<span class="dswl">난이도</span><button type="button" data-diff="easy" class="' + (d === 'easy' ? 'on' : '') + '">쉬움</button><button type="button" data-diff="normal" class="' + (d === 'normal' ? 'on' : '') + '">보통</button>' : '';
    ['hintSw', 'nbSw'].forEach(function (id) { var e = $(id); if (e) e.innerHTML = h; });
  }
  function showDiffCards(seed) {
    pendingSeed = seed || 0; core = null; ended = false; sel = null; zoomId = null; document.documentElement.classList.remove('easy');
    ['endBox', 'zoom', 'notebook', 'hintBox'].forEach(function (id) { $(id).hidden = true; });
    var pre = lastDiff(); document.querySelectorAll('#diffBox .dcard').forEach(function (b) { b.classList.toggle('pre', b.dataset.pick === pre); });
    $('diffBox').hidden = false;
  }
  function startGame(seed, diff) {
    var saved = lsGet(KEY), cont = !!(saved && saved.v === 1 && saved.st && !saved.st.flags.ended && (!seed || saved.seed === seed));
    if (!cont && diffOn() && !diff) { showDiffCards(seed); return; }
    $('diffBox').hidden = true;
    if (cont) { core = new ESC.Core(scn, saved.seed, saved); }
    else core = new ESC.Core(scn, seed || newSeed(), null, { diff: diffOn() ? diff : 'normal' });
    if (urlFast) core.hintWaitOverride = [0, 2, 4];
    ended = false; sel = null; zoomId = null;
    $('endBox').hidden = true; $('zoom').hidden = true; $('notebook').hidden = true; $('hintBox').hidden = true;
    core.enter(core.st.wall); core.drain();
    syncDiff(); renderAll(); save();
  }
  document.addEventListener('click', function (e) {
    var pk = e.target.closest ? e.target.closest('[data-pick]') : null;
    if (pk) { var d = pk.dataset.pick; setLastDiff(d); startGame(pendingSeed, d); return; }
    var b = e.target.closest ? e.target.closest('[data-diff]') : null; if (!b || !core) return;
    var nd = b.dataset.diff; if (core.diff() === nd) return;
    core.setDiff(nd); setLastDiff(nd); syncDiff(); renderAll(); if (zoomId && zoomId.indexOf('__') !== 0) renderZoom(); if (!$('notebook').hidden) renderNotebook(); refreshWait(); save();
  });
  function save() { if (core && !ended) lsSet(KEY, core.serialize()); }

  /* ---------------- 장면 그리기 ---------------- */
  function wallSvg(id) {
    var sc = scn.scenes[id], bg = sc.bg.img ? '<rect width="800" height="1000" fill="#10171b"/><image href="' + sc.bg.img + '" x="0" y="0" width="800" height="1000" preserveAspectRatio="xMidYMid slice"/>' : art[sc.bg.svg](core);
    var props = (sc.props || []).map(function (p) { return art[p](core); }).join('');
    return '<svg viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid meet">' + bg + props + '</svg>';
  }
  function renderWall() {
    var id = core.st.wall, sc = scn.scenes[id];
    $('sceneSvg').innerHTML = wallSvg(id);
    var h = '';
    core.visibleHs(id).forEach(function (hs) { h += hsHtml(id, hs); });
    $('hsLayer').innerHTML = h;
    var dots = ''; scn.walls.forEach(function (w) { dots += '<button class="dot' + (w === id ? ' on' : '') + '" data-wall="' + w + '">' + scn.scenes[w].name + '</button>'; });
    $('wallDots').innerHTML = dots;
    applyHl();
  }
  function isNewHs(hs) {
    if (!core || hs.quiet || core.diff() !== 'easy') return false;
    if (hs.kind === 'pick' || hs.kind === 'paint') return true;
    if (hs.kind === 'zoom') { var t = scn.scenes[hs.to], cd = t && t.card; return !!(cd && core.st.notebook.indexOf(cd.id) < 0); }
    if (hs.doneFlag) return !core.st.flags[hs.doneFlag];
    return false;
  }
  function hsHtml(sceneId, hs) {
    var r = hs.r, q = (hs.quiet ? ' quiet' : '') + (isNewHs(hs) ? ' new' : '');
    return '<button class="hs' + q + '" data-hs="' + sceneId + '.' + hs.id + '" aria-label="' + (hs.id) + '" style="left:' + r[0] * 100 + '%;top:' + r[1] * 100 + '%;width:' + r[2] * 100 + '%;height:' + r[3] * 100 + '%"></button>';
  }
  function invIds() { var ids = [], tags = false; core.st.inv.forEach(function (id) { if (id.indexOf('tag_') === 0) { if (!tags) { ids.push('tag_ring'); tags = true; } } else ids.push(id); }); return ids; }
  function itemName(id) { return id === 'tag_ring' ? '태그 고리' : scn.items[id].name; }
  function itemShort(id) { return id === 'tag_ring' ? '태그 고리' : (scn.items[id].short || scn.items[id].name); }
  function updateTip() {
    var t = '물건을 눌러 살펴보고, 소지품을 골라 누르면 쓸 수 있습니다.';
    if (sel) t = '「' + itemName(sel) + '」을 골랐습니다. ' + (scn.items[sel].modes ? '한 번 더 누르면 ' + (core.st.flags.fl_mode === 'uv' ? '일반 빛' : '보라색 빛') + '으로 바뀝니다. 쓸 곳을 누르십시오.' : '쓸 곳이나 합칠 물건을 누르십시오.');
    else if (core.cond('has:flashlight') && !core.st.flags.star_seen) t = '손전등을 고른 채 한 번 더 누르면 보라색 빛으로 바뀝니다.';
    $('tip').textContent = t;
  }
  function renderInv() {
    var h = '', ids = invIds();
    ids.forEach(function (id) {
      var it = id === 'tag_ring' ? { modes: false } : scn.items[id];
      h += '<button class="slot' + (sel === id ? ' sel' : '') + '" data-item="' + id + '" aria-label="' + itemName(id) + '">' + art.ico(id, core) + '<span class="nm">' + itemShort(id) + '</span>' +
        (it.modes ? '<span class="modei' + (core.st.flags.fl_mode === 'uv' ? ' uv' : '') + '">' + (core.st.flags.fl_mode === 'uv' ? ICON.uv : ICON.sun) + '</span>' : '') + '</button>';
    });
    for (var i = ids.length; i < 12; i++) h += '<div class="slot blank"></div>';
    $('inv').innerHTML = h; updateTip();
    applyHl();
  }
  function renderAll() { renderWall(); renderInv(); updateTop(); }
  function updateTop() { $('bNote').classList.toggle('has', core.st.notebook.length > 0); }

  /* ---------------- 말풍선 ---------------- */
  function say(t) {
    var el = $('toast'); el.textContent = t; el.classList.remove('on'); void el.offsetWidth; el.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('on'); }, 3000);
  }
  function shake(el) { if (calm || !el) return; el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }

  /* ---------------- 이벤트 처리 ---------------- */
  function flush() {
    var evs = core.drain(), after = [];
    evs.forEach(function (e) {
      if (e.t === 'say') say(e.text);
      else if (e.t === 'no') { say(e.text); shake($('view')); }
      else if (e.t === 'goto') after.push(e);
      else if (e.t === 'give') { pulseItem(e.item); }
      else if (e.t === 'card') { var b = $('bNote'); b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse'); }
      else if (e.t === 'solved') { solvedFx(e.lock); }
      else if (e.t === 'wrong') { say(e.cd ? '자물쇠가 뜨거워졌습니다. 잠시 기다려 주십시오.' : '달칵, 열리지 않습니다.'); shake($('zlock')); }
      else if (e.t === 'end') { setTimeout(showEnd, calm ? 200 : 1400); }
    });
    after.forEach(function (e) { openZoom(e.to); });
    renderWall(); renderInv(); if (zoomId) renderZoom(); updateTop(); save();
  }
  function pulseItem(id) {
    var sid = id.indexOf('tag_') === 0 ? 'tag_ring' : id;
    setTimeout(function () {
      var slot = document.querySelector('.slot[data-item="' + sid + '"]'); if (!slot) return;
      try { slot.scrollIntoView({ inline: 'center', block: 'nearest', behavior: calm ? 'auto' : 'smooth' }); } catch (e) {}
      if (calm) return;
      var base = ($('zoom').hidden ? $('view') : $('zsvgw')).getBoundingClientRect(), r = slot.getBoundingClientRect(), el = document.createElement('div');
      el.className = 'fly'; el.innerHTML = art.ico(sid, core); document.body.appendChild(el);
      var sx = base.left + base.width / 2 - 36, sy = base.top + base.height / 2 - 36; el.style.left = sx + 'px'; el.style.top = sy + 'px';
      var a = el.animate([{ transform: 'scale(.4)', opacity: 0 }, { transform: 'scale(1.9)', opacity: 1, offset: 0.3 }, { transform: 'scale(1.9)', opacity: 1, offset: 0.55 }, { transform: 'translate(' + (r.left + r.width / 2 - 36 - sx) + 'px,' + (r.top + r.height / 2 - 36 - sy) + 'px) scale(.7)', opacity: 1 }], { duration: 950, easing: 'ease-in-out' });
      slot.style.visibility = 'hidden';
      a.onfinish = function () { el.remove(); slot.style.visibility = ''; slot.classList.add('new'); setTimeout(function () { slot.classList.remove('new'); }, 900); };
    }, 40);
  }
  function solvedFx(lockId) { var z = $('zbox'); if (!calm && z) { z.classList.remove('flash'); void z.offsetWidth; z.classList.add('flash'); } }

  /* ---------------- 누르기 ---------------- */
  function tapHs(key) {
    var i = key.indexOf('.'), sc = key.slice(0, i), id = key.slice(i + 1), s = sel;
    var ok = core.tap(sc, id, s); if (s && ok) sel = null;
    flush();
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-hs],[data-item],[data-wall]') : null; if (!t) return;
    if (t.dataset.hs) { tapHs(t.dataset.hs); return; }
    if (t.dataset.wall) { goWall(t.dataset.wall); return; }
    if (t.dataset.item) { tapItem(t.dataset.item); }
  });
  function tapItem(id) {
    if (sel && sel !== id) {
      var a = sel; sel = null; core.combine(a, id); flush(); return;
    }
    if (id === 'tag_ring') { examine('tag_ring'); return; }
    if (sel === id) {
      if (scn.items[id].modes) { core.toggleMode(); say(core.st.flags.fl_mode === 'uv' ? '보라색 빛으로 바꿨습니다.' : '일반 빛으로 바꿨습니다.'); flush(); return; }
      sel = null; renderInv(); examine(id); return;
    }
    sel = id; renderInv();
    if (scn.items[id].modes) say(core.st.flags.fl_mode === 'uv' ? '보라색 빛입니다. 한 번 더 누르면 일반 빛으로 바뀝니다.' : '일반 빛입니다. 한 번 더 누르면 보라색 빛으로 바뀝니다.');
  }
  function goWall(w) { if (zoomId) closeZoom(); core.enter(w); core.drain(); sel = sel; renderWall(); if (!calm) { var v = $('sceneSvg'); v.classList.remove('swap'); void v.offsetWidth; v.classList.add('swap'); } save(); }
  function nav(d) { var i = scn.walls.indexOf(core.st.wall); goWall(scn.walls[(i + d + scn.walls.length) % scn.walls.length]); }
  $('navL').addEventListener('click', function () { nav(-1); });
  $('navR').addEventListener('click', function () { nav(1); });
  (function swipe() {
    var v = $('view'), x0 = null, y0 = 0;
    v.addEventListener('pointerdown', function (e) { x0 = e.clientX; y0 = e.clientY; });
    v.addEventListener('pointerup', function (e) { if (x0 === null) return; var dx = e.clientX - x0, dy = e.clientY - y0; x0 = null; if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6) nav(dx < 0 ? 1 : -1); });
    v.addEventListener('pointercancel', function () { x0 = null; });
  })();
  $('view').addEventListener('click', function (e) { if (!e.target.closest('[data-hs],.nav,.dot') && sel) { sel = null; renderInv(); } });

  /* ---------------- 확대 장면 ---------------- */
  function sceneZoomSvg(id) { return '<svg viewBox="0 0 800 800">' + art[scn.scenes[id].draw](core) + '</svg>'; }
  function openZoom(id) {
    if (!scn.scenes[id]) return;
    zoomId = id; core.enter(id); core.drain();
    $('zoom').hidden = false; $('notebook').hidden = true; renderZoom(); updateTop(); save();
  }
  function examine(itemId) {
    if (itemId === 'tag_ring') {
      zoomId = '__item:tag_ring'; $('zoom').hidden = false;
      $('zsvg').innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;background:radial-gradient(circle,#2c3a42,#10171b)">' + art.tagRingBig(core).replace('<svg ', '<svg style="width:100%" ') + '</div>';
      $('zhs').innerHTML = ''; $('zlock').innerHTML = ''; $('zlock').style.display = 'none'; $('ztitle').textContent = '태그 고리'; return;
    }
    var it = scn.items[itemId];
    if (it.examine) { openZoom(it.examine); return; }
    zoomId = '__item:' + itemId; $('zoom').hidden = false;
    $('zsvg').innerHTML = '<svg viewBox="-10 -10 120 120" style="background:radial-gradient(circle,#2c3a42,#10171b)">' + art.ico(itemId, core).replace(/^<svg[^>]*>|<\/svg>$/g, '') + '</svg>';
    $('zhs').innerHTML = ''; $('zlock').innerHTML = ''; $('zlock').style.display = 'none'; $('ztitle').textContent = it.name;
  }
  function renderZoom() {
    if (!zoomId || zoomId.indexOf('__item:') === 0) return;
    var sc = scn.scenes[zoomId];
    $('zsvg').innerHTML = sceneZoomSvg(zoomId); $('ztitle').textContent = sc.card ? sc.card.title : '';
    var h = ''; core.visibleHs(zoomId).forEach(function (hs) { h += hsHtml(zoomId, hs); }); $('zhs').innerHTML = h;
    var lk = $('zlock'); lk.innerHTML = ''; lk.style.display = 'none';
    if (sc.lock && !core.st.solved[sc.lock.id] && core.cond(sc.lock.show)) { var r = sc.lock.r; lk.style.cssText = 'display:block;left:' + r[0] * 100 + '%;top:' + r[1] * 100 + '%;width:' + r[2] * 100 + '%;height:' + r[3] * 100 + '%'; buildLock(sc.lock.id, lk); }
    applyHl();
  }
  function closeZoom() { zoomId = null; $('zoom').hidden = true; $('zlock').innerHTML = ''; stopCd(); if (core) renderWall(); }
  $('zclose').addEventListener('click', closeZoom);
  $('zoom').addEventListener('click', function (e) { if (e.target === $('zoom')) closeZoom(); });

  /* ================= 잠금 위젯 ================= */
  var cdTimer = 0;
  function stopCd() { clearInterval(cdTimer); cdTimer = 0; }
  function handleHtml(l) {
    var ar = { pull: ICON.down, lever: ICON.down, slide: ICON.right, pullleft: ICON.left, rotate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 11-2.6-5.9M20 4v5h-5"/></svg>' }[l.handle];
    return '<div class="handle h-' + l.handle + '" data-handle="' + l.handle + '"><div class="track"><div class="knob">' + ar + '</div></div><div class="hint">' + ({ pull: '아래로 당기기', lever: '레버 내리기', slide: '오른쪽으로 밀기', pullleft: '왼쪽으로 당기기', rotate: '돌리기' }[l.handle]) + '</div></div>';
  }
  /* 잠금 자리 이름표: 칸 위에 붙는 작은 그림(서랍은 보통도, 나머지는 쉬움) */
  function labelGroups(id) { var l = scn.locks[id], g = l.labels ? l.labels(core.diff()) : null; return g && g.length ? g : null; }
  function labelsHtml(g, cls, n) { return '<div class="wlabs ' + cls + '" style="--n:' + n + '">' + g.map(function (x) { return '<div class="lab" data-ic="' + x.ic + '" style="grid-column:span ' + (x.span || 1) + '">' + art.labIcon(x.ic, x.span || 1) + '</div>'; }).join('') + '</div>'; }
  function addLabels(id, ctl, l) {
    var g = labelGroups(id); if (!g) return;
    var row = { digits: '.wheels', direction: '.dshow', symbols: '.syrow', order: '.oslots' }[l.type], el = row ? ctl.querySelector(row) : null;
    if (el) { el.insertAdjacentHTML('afterbegin', labelsHtml(g, 'c-' + l.type, l.n)); return; }
    if (l.type === 'dial') ctl.insertAdjacentHTML('afterbegin', '<div class="lab solo" data-ic="' + g[0].ic + '">' + art.labIcon(g[0].ic, 1) + '</div>');
    else if (l.type === 'count') ctl.parentNode.insertAdjacentHTML('afterbegin', '<div class="lab solo tab" data-ic="' + g[0].ic + '">' + art.labIcon(g[0].ic, 1) + '</div>');   // 칸이 좁아 판 위쪽에 붙는 이름표로
  }
  function buildLock(id, host) {
    var l = scn.locks[id], val = core.getLock(id), h = '<div class="lk t-' + l.type + '" data-lock="' + id + '"><div class="ctl"></div>' + handleHtml(l) + '</div>';
    host.innerHTML = h; var ctl = host.querySelector('.ctl'), hd = host.querySelector('.handle');
    function set(v) { core.setLock(id, v); val = v; save(); }
    if (l.type === 'digits') buildDigits(ctl, l, val, set);
    else if (l.type === 'direction') buildDirection(ctl, l, val, set);
    else if (l.type === 'symbols') buildSymbols(ctl, l, val, set);
    else if (l.type === 'order') buildOrder(ctl, l, val, set);
    else if (l.type === 'dial') buildDial(ctl, l, val, set);
    else if (l.type === 'count') buildCount(ctl, l, val, set);
    if (l.type !== 'order') addLabels(id, ctl, l);   // 순서 잠금은 그릴 때마다 위젯을 새로 만들어 그 안에서 붙인다
    bindHandle(hd, l, function () { core.tryOpen(id); flush(); });   // flush 가 위젯을 새로 그리며 대기 표시(cooldownUi)를 새 손잡이에 건다
    cooldownUi(id, hd);
  }
  function cooldownUi(id, hd) {
    stopCd(); var hint = hd.querySelector('.hint');
    function upd() { var c = core.cooldown(id); hd.classList.toggle('hot', c > 0); if (c > 0) hint.textContent = '뜨거워서 움직이지 않습니다 (' + Math.ceil(c) + ')'; else if (hint.dataset.t) hint.textContent = hint.dataset.t; if (c <= 0) stopCd(); }
    hint.dataset.t = hint.textContent; if (core.cooldown(id) > 0) { cdTimer = setInterval(upd, 200); upd(); }
  }
  function bindHandle(hd, l, onOpen) {
    var knob = hd.querySelector('.knob'), track = hd.querySelector('.track'), kind = l.handle, x0, y0, drag = false, accum = 0, last = 0;
    function reset() { knob.style.transform = ''; knob.style.transition = calm ? 'none' : 'transform .18s'; drag = false; }
    knob.addEventListener('pointerdown', function (e) {
      if (hd.classList.contains('hot')) { say('자물쇠가 뜨거워서 움직이지 않습니다.'); return; }
      e.preventDefault(); drag = true; x0 = e.clientX; y0 = e.clientY; accum = 0; knob.style.transition = 'none';
      var r = knob.getBoundingClientRect(); last = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)); knob.dataset.cx = r.left + r.width / 2; knob.dataset.cy = r.top + r.height / 2;
      try { knob.setPointerCapture(e.pointerId); } catch (er) {}
    });
    knob.addEventListener('pointermove', function (e) {
      if (!drag) return; var dx = e.clientX - x0, dy = e.clientY - y0;
      if (kind === 'rotate') { var a = Math.atan2(e.clientY - +knob.dataset.cy, e.clientX - +knob.dataset.cx), d = a - last; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; accum += d; last = a; knob.style.transform = 'rotate(' + (accum * 57.3) + 'deg)'; if (Math.abs(accum) > 2.6) { drag = false; reset(); onOpen(); } return; }
      var tr = track.getBoundingClientRect(), kr = knob.getBoundingClientRect(), vertical = (kind === 'pull' || kind === 'lever'), travel = Math.max(20, (vertical ? tr.height - kr.height : tr.width - kr.width) - 8);
      var p = vertical ? Math.max(0, Math.min(travel, dy)) : (kind === 'slide' ? Math.max(0, Math.min(travel, dx)) : -Math.max(0, Math.min(travel, -dx)));
      knob.style.transform = vertical ? 'translateY(' + p + 'px)' : 'translateX(' + p + 'px)';
      if (Math.abs(p) >= travel * 0.85) { drag = false; reset(); onOpen(); }
    });
    function end() { if (drag) reset(); } knob.addEventListener('pointerup', end); knob.addEventListener('pointercancel', end);
  }
  function wheelDrag(el, step) {
    var y0 = null, acc = 0;
    el.addEventListener('pointerdown', function (e) { y0 = e.clientY; acc = 0; try { el.setPointerCapture(e.pointerId); } catch (er) {} });
    el.addEventListener('pointermove', function (e) { if (y0 === null) return; var d = e.clientY - y0; if (Math.abs(d) >= 22) { step(d < 0 ? 1 : -1); y0 = e.clientY; } });
    el.addEventListener('pointerup', function () { y0 = null; }); el.addEventListener('pointercancel', function () { y0 = null; });
  }
  function buildDigits(ctl, l, val, set) {
    var h = '<div class="wheels">'; for (var i = 0; i < l.n; i++) h += '<div class="wheel" data-i="' + i + '"><button class="up" aria-label="올리기">' + ICON.up + '</button><div class="dig">' + val.charAt(i) + '</div><button class="dn" aria-label="내리기">' + ICON.down + '</button></div>'; h += '</div>';
    ctl.innerHTML = h;
    ctl.querySelectorAll('.wheel').forEach(function (w) {
      var i = +w.dataset.i;
      function step(d) { var cur = core.getLock(l.id || ctl.parentNode.dataset.lock).split(''); cur[i] = String((+cur[i] + d + 10) % 10); var v = cur.join(''); set(v); w.querySelector('.dig').textContent = cur[i]; }
      w.querySelector('.up').addEventListener('click', function () { step(1); }); w.querySelector('.dn').addEventListener('click', function () { step(-1); });
      wheelDrag(w.querySelector('.dig'), step);
    });
  }
  function buildDirection(ctl, l, val, set) {
    var lockId = ctl.parentNode.dataset.lock;
    function draw() { var cur = core.getLock(lockId), h = ''; for (var i = 0; i < l.n; i++) h += '<div class="dslot">' + (cur[i] ? '<svg viewBox="-20 -20 40 40">' + art.dirArrow(cur[i], 0, 0, 13, '#f3e9d8') + '</svg>' : '') + '</div>'; ctl.querySelector('.dshow .dsl').innerHTML = h; }
    ctl.innerHTML = '<div class="dshow"><div class="dsl"></div></div><div class="dpad">' + [['U', 'u'], ['L', 'l'], ['R', 'r'], ['D', 'd']].map(function (d) { return '<button class="d d-' + d[1] + '" data-d="' + d[0] + '"><svg viewBox="-20 -20 40 40">' + art.dirArrow(d[0], 0, 0, 12, '#f3e9d8') + '</svg></button>'; }).join('') + '<button class="dclr" aria-label="지우기">' + ICON.close + '</button></div>';
    draw();
    ctl.querySelectorAll('.d').forEach(function (b) { b.addEventListener('click', function () { var cur = core.getLock(lockId).slice(); cur.push(b.dataset.d); while (cur.length > l.n) cur.shift(); set(cur); draw(); }); });
    ctl.querySelector('.dclr').addEventListener('click', function () { set([]); draw(); });
  }
  function buildSymbols(ctl, l, val, set) {
    var lockId = ctl.parentNode.dataset.lock;
    function draw() { var cur = core.getLock(lockId); ctl.querySelectorAll('.sy').forEach(function (b, i) { b.innerHTML = '<svg viewBox="-50 -50 100 100">' + art.symbol(cur[i], 0, 0, 30, '#f3e9d8') + '</svg>'; }); }
    var h = '<div class="syrow">'; for (var i = 0; i < l.n; i++) h += '<button class="sy" data-i="' + i + '"></button>'; ctl.innerHTML = h + '</div>';
    draw(); ctl.querySelectorAll('.sy').forEach(function (b) { b.addEventListener('click', function () { var cur = core.getLock(lockId).slice(), i = +b.dataset.i; cur[i] = (cur[i] + 1) % 6; set(cur); draw(); }); });
  }
  function buildOrder(ctl, l, val, set) {
    var lockId = ctl.parentNode.dataset.lock, pool = core.P.arr.ids.slice().sort(), selCard = null;
    function name(id) { return P.STRAINS.filter(function (q) { return q.id === id; })[0].ko; }
    function card(id, cls) { return '<div class="ocard ' + (cls || '') + '" data-id="' + id + '"><svg viewBox="-34 -34 68 68">' + art.strainIcon(id, 0, 0, 24) + '</svg><span>' + name(id) + '</span></div>'; }
    function draw() {
      var cur = core.getLock(lockId), h = '<div class="oslots">';
      for (var i = 0; i < l.n; i++) h += '<div class="oslot' + (cur[i] ? ' full' : '') + '" data-i="' + i + '">' + (cur[i] ? card(cur[i]) : '<b>' + (i + 1) + '</b>') + '</div>';
      h += '</div><div class="opool">'; pool.forEach(function (id) { h += cur.indexOf(id) >= 0 ? '<div class="ocard used"></div>' : card(id, selCard === id ? 'sel' : ''); }); ctl.innerHTML = h + '</div>'; addLabels(lockId, ctl, l);
      ctl.querySelectorAll('.oslot').forEach(function (s) { s.addEventListener('click', function () { var i = +s.dataset.i, c = core.getLock(lockId).slice(); if (selCard) { c[i] = selCard; selCard = null; } else c[i] = null; set(c); draw(); }); });
      ctl.querySelectorAll('.opool .ocard:not(.used)').forEach(function (c) {
        var x0, y0, ghost = null, moved = false;
        c.addEventListener('pointerdown', function (e) { x0 = e.clientX; y0 = e.clientY; moved = false; try { c.setPointerCapture(e.pointerId); } catch (er) {} });
        c.addEventListener('pointermove', function (e) {
          if (x0 === undefined) return; if (!moved && Math.hypot(e.clientX - x0, e.clientY - y0) > 8) { moved = true; ghost = c.cloneNode(true); ghost.classList.add('ghost'); document.body.appendChild(ghost); }
          if (ghost) { ghost.style.left = e.clientX - 40 + 'px'; ghost.style.top = e.clientY - 40 + 'px'; }
        });
        c.addEventListener('pointerup', function (e) {
          var id = c.dataset.id; if (ghost) { ghost.remove(); ghost = null; }
          if (moved) { c.style.visibility = 'hidden'; var el = document.elementFromPoint(e.clientX, e.clientY); c.style.visibility = ''; var s = el && el.closest ? el.closest('.oslot') : null; if (s) { var cc = core.getLock(lockId).slice(); cc[+s.dataset.i] = id; set(cc); selCard = null; } draw(); }
          else { selCard = selCard === id ? null : id; draw(); }
          x0 = undefined;
        });
        c.addEventListener('pointercancel', function () { if (ghost) { ghost.remove(); ghost = null; } x0 = undefined; });
      });
    }
    draw();
  }
  function buildDial(ctl, l, val, set) {
    var lockId = ctl.parentNode.dataset.lock, span = l.max - l.min, SW = 240;
    var ticks = ''; for (var v = l.min; v <= l.max; v += 5) { var a = ((v - l.min) / span * SW - SW / 2 - 90) * Math.PI / 180; ticks += '<text x="' + (110 + Math.cos(a) * 92).toFixed(1) + '" y="' + (112 + Math.sin(a) * 92).toFixed(1) + '" font-size="20" fill="#e9eef0" text-anchor="middle" font-weight="800">' + v + '</text>'; }
    for (var t = l.min; t <= l.max; t++) { var b = ((t - l.min) / span * SW - SW / 2 - 90) * Math.PI / 180; ticks += '<path d="M' + (110 + Math.cos(b) * 74).toFixed(1) + ' ' + (110 + Math.sin(b) * 74).toFixed(1) + ' L' + (110 + Math.cos(b) * (t % 5 ? 79 : 84)).toFixed(1) + ' ' + (110 + Math.sin(b) * (t % 5 ? 79 : 84)).toFixed(1) + '" stroke="#8e99a3" stroke-width="2"/>'; }
    ticks += '<text x="110" y="176" font-size="22" fill="#ffd54a" text-anchor="middle" font-weight="900">°F</text>';
    ctl.innerHTML = '<div class="dialw"><button class="dm" aria-label="내리기">' + ICON.left + '</button><svg class="dial" viewBox="0 0 220 220"><circle cx="110" cy="110" r="104" fill="#2b3338" stroke="#59646d" stroke-width="6"/>' + ticks + '<g class="needle"><circle cx="110" cy="110" r="46" fill="#e9eef0" stroke="#9aa5ad" stroke-width="4"/><path d="M110 110 L110 70" stroke="#d8392c" stroke-width="7" stroke-linecap="round"/><circle cx="110" cy="110" r="8" fill="#333"/></g></svg><button class="dp" aria-label="올리기">' + ICON.right + '</button></div><div class="dval"></div>';
    function draw() { var v = core.getLock(lockId), ang = (v - l.min) / span * SW - SW / 2; ctl.querySelector('.needle').setAttribute('transform', 'rotate(' + ang + ' 110 110)'); ctl.querySelector('.dval').textContent = v + ' °F'; }
    function setv(v) { v = Math.max(l.min, Math.min(l.max, v)); set(v); draw(); }
    draw(); ctl.querySelector('.dm').addEventListener('click', function () { setv(core.getLock(lockId) - 1); }); ctl.querySelector('.dp').addEventListener('click', function () { setv(core.getLock(lockId) + 1); });
    var svg = ctl.querySelector('.dial'), a0 = null, v0 = 0, acc = 0, lastA = 0;
    function ang(e) { var r = svg.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)); }
    svg.addEventListener('pointerdown', function (e) { a0 = 1; lastA = ang(e); acc = 0; v0 = core.getLock(lockId); try { svg.setPointerCapture(e.pointerId); } catch (er) {} });
    svg.addEventListener('pointermove', function (e) { if (a0 === null) return; var a = ang(e), d = a - lastA; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; acc += d; lastA = a; setv(v0 + Math.round(acc * 57.3 / (SW / span))); });
    svg.addEventListener('pointerup', function () { a0 = null; }); svg.addEventListener('pointercancel', function () { a0 = null; });
  }
  function buildCount(ctl, l, val, set) {
    var lockId = ctl.parentNode.dataset.lock;
    ctl.innerHTML = '<div class="tally"><button class="tz" aria-label="처음으로">0</button><div class="tn">' + val + '</div><button class="tp" aria-label="하나 세기">+1</button></div>';
    var tn = ctl.querySelector('.tn');
    ctl.querySelector('.tp').addEventListener('click', function () { var v = (core.getLock(lockId) + 1) % 100; set(v); tn.textContent = v; });
    ctl.querySelector('.tz').addEventListener('click', function () { set(0); tn.textContent = 0; });
  }

  /* ---------------- 메모장 ---------------- */
  function renderNotebook() {
    var h = '', cards = core.st.notebook;
    if (!cards.length) h = '<p class="empty">아직 기록한 단서가 없습니다. 물건을 눌러 확대해 보십시오.</p>';
    cards.forEach(function (cid) {
      var sid = core.cardScene(cid); if (!sid) return; var sc = scn.scenes[sid];
      h += '<div class="card' + (hl.t.indexOf('card:' + cid) >= 0 && Date.now() < hl.until ? ' hl' : '') + '" data-card="' + cid + '" data-scene="' + sid + '"><div class="thumb">' + sceneZoomSvg(sid) + '</div><div class="ct"><span>' + sc.card.title + '</span><button class="star' + (core.st.stars[cid] ? ' on' : '') + '" data-star="' + cid + '" aria-label="중요 표시">' + ICON.star + '</button></div></div>';
    });
    var done = core.solvedList(); if (done.length) { h += '<div class="done"><b>푼 것</b>' + done.map(function (l) { var z = Object.keys(scn.scenes).filter(function (k) { return scn.scenes[k].lock && scn.scenes[k].lock.id === l; })[0]; return '<span>' + (z ? scn.scenes[z].card.title : l) + '</span>'; }).join('') + '</div>'; }
    $('nbList').innerHTML = h;
  }
  $('bNote').addEventListener('click', function () { renderNotebook(); $('notebook').hidden = false; $('bNote').classList.remove('pulse'); });
  $('nbClose').addEventListener('click', function () { $('notebook').hidden = true; });
  $('nbList').addEventListener('click', function (e) {
    var st = e.target.closest('[data-star]'); if (st) { core.toggleStar(st.dataset.star); renderNotebook(); save(); return; }
    var c = e.target.closest('[data-card]'); if (c) { $('notebook').hidden = true; openZoom(c.dataset.scene); }
  });
  var rst = 0;
  $('nbRestart').addEventListener('click', function () {
    if (!rst) { $('nbRestart').textContent = '한 번 더 누르면 처음부터 합니다'; rst = setTimeout(function () { rst = 0; $('nbRestart').textContent = '처음부터 다시'; }, 3500); return; }
    clearTimeout(rst); rst = 0; $('nbRestart').textContent = '처음부터 다시'; lsDel(KEY); $('notebook').hidden = true; startGame(newSeed(), lastDiff());
  });

  /* ---------------- 힌트 ---------------- */
  var hintScene = null;
  function curScene() { return (zoomId && zoomId.indexOf('__') !== 0) ? zoomId : core.st.wall; }
  function hintUi() {
    hintScene = curScene(); var r = core.requestHint({ scene: hintScene }), b = $('hintBox'), h = '';
    if (r.none) h = '<p class="ht">지금은 풀 퍼즐이 없습니다.</p>';
    else if (r.wait !== undefined) h = '<p class="ht">잠시 후 힌트를 볼 수 있습니다.</p>';
    else {
      h = '<div class="lvl">' + [1, 2, 3].map(function (i) { return '<i class="' + (i <= r.lvl ? 'on' : '') + '"></i>'; }).join('') + '</div><p class="ht">' + r.text + '</p>';
      var rem = r.fresh ? r.next : r.remain;
      if (rem > 0) h += '<p class="wt" data-remain="' + rem + '">다음 힌트까지 ' + fmtRemain(rem) + '</p>'; else if (r.lvl < 3) h += '<p class="wt">다음 힌트를 바로 볼 수 있습니다.</p>';
      hl = { t: r.hl || [], until: Date.now() + 7000 }; applyHl(); setTimeout(applyHl, 7100);
    }
    $('hintBody').innerHTML = h; b.hidden = false; save();
  }
  function refreshWait() {
    if (!core || $('hintBox').hidden) return;
    var w = $('hintBody').querySelector('.wt'), hs = core.hintState({ scene: hintScene }); if (!w || !hs) return;
    if (hs.remain > 0) { w.textContent = '다음 힌트까지 ' + fmtRemain(hs.remain); w.setAttribute('data-remain', Math.ceil(hs.remain)); } else { w.textContent = '다음 힌트를 바로 볼 수 있습니다.'; w.removeAttribute('data-remain'); }
  }
  function fmtRemain(s) { s = Math.ceil(s); return s >= 60 ? Math.floor(s / 60) + '분 ' + (s % 60) + '초' : s + '초'; }
  $('bHint').addEventListener('click', hintUi);
  $('hintClose').addEventListener('click', function () { $('hintBox').hidden = true; });
  $('hintBox').addEventListener('click', function (e) { if (e.target === $('hintBox')) $('hintBox').hidden = true; });
  function applyHl() {
    var on = Date.now() < hl.until, t = hl.t || [];
    document.querySelectorAll('.hl').forEach(function (e) { e.classList.remove('hl'); });
    if (!on) return;
    t.forEach(function (k) {
      if (k.indexOf('wall:') === 0) { var d = document.querySelector('.dot[data-wall="' + k.slice(5) + '"]'); if (d) d.classList.add('hl'); }
      else if (k.indexOf('hs:') === 0) { var e = document.querySelector('[data-hs="' + k.slice(3) + '"]'); if (e) e.classList.add('hl'); }
      else if (k.indexOf('item:') === 0) { var s = document.querySelector('.slot[data-item="' + k.slice(5) + '"]'); if (s) s.classList.add('hl'); }
      else if (k.indexOf('card:') === 0) { $('bNote').classList.add('hl'); }
    });
  }
  $('bGlint').addEventListener('click', function () { var v = $('view'); v.classList.add('glint'); $('zoom').classList.add('glint'); setTimeout(function () { v.classList.remove('glint'); $('zoom').classList.remove('glint'); }, 2200); });

  /* ---------------- 끝 ---------------- */
  function fmtT(s) { s = Math.floor(s); return Math.floor(s / 60) + '분 ' + (s % 60) + '초'; }
  function showEnd() {
    ended = true; var st = core.st, tries = 0; for (var k in st.tries) tries += st.tries[k];
    var best = lsGet(BEST) || {}, t = Math.floor(st.elapsed), isBest = !best.t || t < best.t; if (isBest) { best.t = t; lsSet(BEST, best); }
    lsDel(KEY);
    $('endBody').innerHTML = '<h2>비상 문이 열렸습니다</h2><p class="sub"><b>다음 편에 이어집니다</b></p><dl><div><dt>걸린 시간</dt><dd>' + fmtT(st.elapsed) + '</dd></div><div><dt>힌트</dt><dd>' + st.hintsUsed + '번</dd></div><div><dt>여는 시도</dt><dd>' + tries + '번</dd></div><div><dt>최고 기록</dt><dd>' + fmtT(best.t) + (isBest ? ' (새 기록)' : '') + '</dd></div></dl>';
    $('endBox').hidden = false; $('zoom').hidden = true; zoomId = null;
  }
  $('endAgain').addEventListener('click', function () { startGame(newSeed(), lastDiff()); });

  /* ---------------- 시간 · 뒤로 가기 ---------------- */
  setInterval(function () {
    if (!core || ended || document.hidden) { lastTick = 0; return; }
    var n = performance.now(); if (lastTick) { var dt = Math.min((n - lastTick) / 1000, 2); core.tick(dt); saveT += dt; if (saveT > 5) { saveT = 0; save(); } }
    lastTick = n;
    var w = document.querySelector('.wt[data-remain]'); if (w && !$('hintBox').hidden) { var hs = core.hintState({ scene: hintScene }); if (hs && hs.remain > 0) w.textContent = '다음 힌트까지 ' + fmtRemain(hs.remain); else if (hs) { w.textContent = '다음 힌트를 바로 볼 수 있습니다.'; w.removeAttribute('data-remain'); } }
  }, 500);
  document.addEventListener('visibilitychange', function () { if (document.hidden) save(); lastTick = 0; });
  window.addEventListener('pagehide', save);
  window.__gameBack = function () {
    if (!$('diffBox').hidden) return false;
    if (!$('hintBox').hidden) { $('hintBox').hidden = true; return true; }
    if (!$('notebook').hidden) { $('notebook').hidden = true; return true; }
    if (zoomId) { closeZoom(); return true; }
    if (sel) { sel = null; renderInv(); return true; }
    save(); return false;
  };

  /* 장면 상자를 4:5로 맞춘다(남는 자리 안에서 가장 크게) */
  function fitView() {
    var st = $('stage'), v = $('view'), wide = window.matchMedia('(min-aspect-ratio: 6/5)').matches;
    if (wide) st.style.height = ''; else {
      var availH = $('app').clientHeight - $('top').offsetHeight - $('side').offsetHeight - 24;
      st.style.height = Math.max(120, Math.min(st.clientWidth / 0.8, availH)) + 'px';
    }
    var W = st.clientWidth, H = st.clientHeight; if (!W || !H) return;
    var w = Math.min(W, H * 0.8), h = w / 0.8; v.style.width = w + 'px'; v.style.height = h + 'px';
    // 확대 장면 덮개: 장면 상자 영역만 덮고(소지품·도구는 눌림), 정사각 상자는 그 안에서 가장 크게
    var r = v.getBoundingClientRect(), z = $('zoom');
    z.style.left = r.left + 'px'; z.style.top = r.top + 'px'; z.style.right = 'auto'; z.style.bottom = 'auto'; z.style.width = r.width + 'px'; z.style.height = r.height + 'px';
    var side = Math.max(200, Math.floor(Math.min(r.width, r.height) - 4)); document.documentElement.style.setProperty('--zbw', side + 'px');
  }
  window.addEventListener('resize', fitView); window.addEventListener('orientationchange', function () { setTimeout(fitView, 120); }); setInterval(fitView, 700);

  /* ---------------- 시작 ---------------- */
  document.body.insertAdjacentHTML('beforeend', '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' + art.defs() + '</svg>');
  $('bNote').insertAdjacentHTML('afterbegin', ICON.note); $('bHint').insertAdjacentHTML('afterbegin', ICON.bulb); $('bGlint').insertAdjacentHTML('afterbegin', ICON.spark);
  $('navL').innerHTML = ICON.left; $('navR').innerHTML = ICON.right; $('zclose').innerHTML = ICON.close; $('nbClose').innerHTML = ICON.close; $('hintClose').innerHTML = ICON.close;
  fitView();
  var seedParam = (location.search.match(/[?&]seed=(\d+)/) || [])[1];
  /* 벽 그림 읽기: 다 읽거나(최대 4초) 실패가 정해진 뒤에 시작한다. 한 장이 안 읽히면 그 벽만 코드 그림으로 대신한다. */
  function preloadWalls(done) {
    var list = scn.walls.filter(function (w) { return scn.scenes[w].artImg; }), left = list.length, fin = false;
    function end() { if (!fin) { fin = true; done(); } }
    if (!left) return end();
    setTimeout(end, 4000);
    list.forEach(function (w) {
      var im = new Image();
      im.onload = function () { if (--left === 0) end(); };
      im.onerror = function () { scn.setArt(w, 'svg'); if (core) renderAll(); if (--left === 0) end(); };
      im.src = scn.scenes[w].bg.img;
    });
  }
  preloadWalls(function () {
    var boot = $('boot'); if (boot) boot.remove();
    startGame(seedParam ? +seedParam : 0, diffParam);
    window.__escape = { get core() { return core; }, lastDiff: lastDiff, get pendingSeed() { return pendingSeed; }, get zoomId() { return zoomId; }, startGame: startGame, openZoom: openZoom, closeZoom: closeZoom, flush: flush, get ended() { return ended; }, renderAll: renderAll };
  });
})();
