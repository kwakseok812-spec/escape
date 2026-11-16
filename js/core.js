/* ============================================================================
 * core.js — L1 엔진의 두뇌: 화면 없는 게임 규칙(상태·조건·효과·소지품·합치기·잠금·힌트·저장)
 * 화면(ui.js)과 검사기(_dev\check.js)가 같은 코드를 쓴다 → 검사기가 푸는 길 = 실제 게임이 허용하는 길.
 * 브라우저와 node 양쪽에서 쓴다.
 * ==========================================================================*/
(function (root) {
  'use strict';
  var ESC = root.ESC = root.ESC || {};
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

  /* opts.diff = 'easy' | 'normal' (새 판에만 쓴다. 저장된 판은 저장에 든 st.diff 를 따르고, 없으면 보통) */
  function Core(scn, seed, saved, opts) {
    this.scn = scn; this.seed = seed >>> 0; this.P = scn.build(this.seed); this.ev = [];
    this.view = {};          // 화면 임시 상태(저장하지 않음): 달력 칠하기 등
    this.hintWaitOverride = null;
    this.st = (saved && saved.st) ? clone(saved.st) : { solved: {}, flags: { fl_mode: 'light' }, inv: [], notebook: [], stars: {}, lockVal: {}, tries: {}, cons: {}, cd: {}, hint: {}, hintsUsed: 0, elapsed: 0, wall: scn.start };
    if (!(saved && saved.st) && opts && (opts.diff === 'easy' || opts.diff === 'normal')) this.st.diff = opts.diff;
  }
  var C = Core.prototype;
  C.push = function (e) { this.ev.push(e); };
  C.drain = function () { var e = this.ev; this.ev = []; return e; };

  /* 조건: 'flag:x' 'has:item' 'solved:lock' 'mode:uv' 앞에 ! 는 부정. 배열은 모두 참이어야 함 */
  C.cond = function (c) {
    if (!c || (Array.isArray(c) && !c.length)) return true;
    if (Array.isArray(c)) { for (var i = 0; i < c.length; i++) if (!this.cond(c[i])) return false; return true; }
    var neg = false; if (c.charAt(0) === '!') { neg = true; c = c.slice(1); }
    var k = c.slice(0, c.indexOf(':')), v = c.slice(c.indexOf(':') + 1), r = false;
    if (k === 'flag') r = !!this.st.flags[v]; else if (k === 'has') r = this.st.inv.indexOf(v) >= 0;
    else if (k === 'solved') r = !!this.st.solved[v]; else if (k === 'seen') r = this.st.notebook.indexOf(v) >= 0;
    else if (k === 'mode') r = this.st.flags.fl_mode === v;
    return neg ? !r : r;
  };
  C.scene = function (id) { return this.scn.scenes[id]; };
  /* 난이도: 기능 스위치(scn.features.easy)가 꺼져 있으면 저장에 쉬움이 있어도 전부 보통. 난이도는 보이는 것·힌트 대기만 바꾸고 정답·잠금은 읽지 않는다 */
  C.diff = function () { var f = this.scn.features || {}; return (f.easy && this.st.diff === 'easy') ? 'easy' : 'normal'; };
  C.setDiff = function (d) { if (d === 'easy' || d === 'normal') this.st.diff = d; };
  C.allHs = function (sceneId) { var sc = this.scn.scenes[sceneId]; return (sc.hs || []).concat(sc.dyn ? (sc.dyn(this) || []) : []); };
  C.visibleHs = function (sceneId) { var self = this; return this.allHs(sceneId).filter(function (h) { return self.cond(h.when); }); };

  C.give = function (id) { if (this.st.inv.indexOf(id) < 0) { this.st.inv.push(id); this.st.flags['got_' + id] = true; this.push({ t: 'give', item: id }); } };
  C.take = function (id) { var i = this.st.inv.indexOf(id); if (i >= 0) { this.st.inv.splice(i, 1); this.push({ t: 'take', item: id }); } };
  C.eff = function (list) {
    var self = this;
    (list || []).forEach(function (e) {
      if (e.flag) self.st.flags[e.flag] = true;
      if (e.unflag) delete self.st.flags[e.unflag];
      if (e.give) self.give(e.give);
      if (e.take) self.take(e.take);
      if (e.say) self.push({ t: 'say', text: typeof e.say === 'function' ? e.say(self.P) : e.say });
      if (e.goto) self.push({ t: 'goto', to: e.goto });
      if (e.end) { self.st.flags.ended = true; self.push({ t: 'end' }); }
    });
  };

  /* 장면에 들어갔을 때: 단서 그림 카드를 메모장에 자동 기록 */
  C.enter = function (sceneId) {
    var sc = this.scn.scenes[sceneId]; if (!sc) return;
    if (sc.kind === 'wall') this.st.wall = sceneId;
    this.touchScene(sceneId);
    if (sc.card && this.st.notebook.indexOf(sc.card.id) < 0) { this.st.notebook.push(sc.card.id); this.push({ t: 'card', id: sc.card.id, scene: sceneId }); }
    if (sc.onEnter) this.eff(sc.onEnter);
  };
  C.cardScene = function (cardId) { var s = this.scn.scenes; for (var k in s) if (s[k].card && s[k].card.id === cardId) return k; return null; };

  /* 누르기. sel = 선택해 둔 소지품(있으면 「쓰기」) */
  C.tap = function (sceneId, hsId, sel) {
    var sc = this.scn.scenes[sceneId], hs = this.allHs(sceneId).filter(function (h) { return h.id === hsId; })[0];
    if (!hs || !this.cond(hs.when)) return false;
    if (hs.kind === 'paint' && !sel) { this.view.calPaint = this.view.calPaint === hs.mark ? null : hs.mark; return true; }   // 쉬움 달력: ○ 또는 □ 를 누르면 압정 다음 칸부터 그 칸까지 칠함(저장하지 않음)
    if (sel) {
      var self = this, list = (hs.accepts || []).filter(function (a) { return a.item === sel; }), acc = list.filter(function (a) { return (!a.mode || self.st.flags.fl_mode === a.mode) && self.cond(a.when); })[0];
      if (acc) { this.eff(acc.do); this.push({ t: 'used', item: sel, hs: hsId }); return true; }
      if (list.length) { this.push({ t: 'no', text: this.scn.items[sel].modes ? '손전등의 빛 모드를 바꿔 보십시오.' : '지금은 소용이 없습니다.' }); return false; }
      this.push({ t: 'no', text: '이건 여기에 쓸 수 없습니다.' }); return false;
    }
    if (hs.kind === 'zoom') { this.push({ t: 'goto', to: hs.to }); return true; }
    if (hs.kind === 'pick') { this.give(hs.item); if (hs.say) this.push({ t: 'say', text: hs.say }); this.eff(hs.do); return true; }
    if (hs.say) this.push({ t: 'say', text: hs.say });
    this.eff(hs.do); return true;
  };

  C.combine = function (a, b) {
    var r = this.scn.recipes.filter(function (x) { return (x.a === a && x.b === b) || (x.a === b && x.b === a); })[0];
    if (!r) { this.push({ t: 'no', text: '합쳐지지 않습니다.' }); return false; }
    this.take(r.a); this.take(r.b); this.give(r.give); if (r.say) this.push({ t: 'say', text: r.say }); this.push({ t: 'combined', give: r.give });
    return true;
  };
  C.toggleMode = function () { this.st.flags.fl_mode = this.st.flags.fl_mode === 'uv' ? 'light' : 'uv'; this.push({ t: 'mode', mode: this.st.flags.fl_mode }); };

  /* ---------------- 잠금 ---------------- */
  C.lock = function (id) { return this.scn.locks[id]; };
  C.lockAnswer = function (id) { return this.scn.locks[id].ans(this.P); };
  C.lockDefault = function (id) {
    var l = this.scn.locks[id];
    if (l.type === 'digits') return Array(l.n + 1).join('0'); if (l.type === 'direction') return [];
    if (l.type === 'symbols') return Array.apply(null, Array(l.n)).map(function () { return 0; }); if (l.type === 'order') return Array.apply(null, Array(l.n)).map(function () { return null; });
    if (l.type === 'dial') return l.min; if (l.type === 'count') return 0;
  };
  C.getLock = function (id) { if (this.st.lockVal[id] === undefined) this.st.lockVal[id] = this.lockDefault(id); return this.st.lockVal[id]; };
  C.setLock = function (id, v) { this.st.lockVal[id] = v; var self = this; Object.keys(this.scn.scenes).forEach(function (k) { if (self.scn.scenes[k].lock && self.scn.scenes[k].lock.id === id) self.touchScene(k); }); };
  C.cooldown = function (id) { var c = this.st.cd[id]; return c && c > this.st.elapsed ? c - this.st.elapsed : 0; };
  /* 여는 동작 한 번 = 시도 1회 */
  C.tryOpen = function (id) {
    var l = this.scn.locks[id]; if (this.st.solved[id]) return { ok: true, already: true };
    if (this.cooldown(id) > 0) return { cd: this.cooldown(id) };
    this.st.tries[id] = (this.st.tries[id] || 0) + 1;
    var ok = same(this.getLock(id), this.lockAnswer(id));
    if (ok) { this.st.solved[id] = true; this.st.cons[id] = 0; this.eff(l.on); this.push({ t: 'solved', lock: id }); return { ok: true }; }
    this.st.cons[id] = (this.st.cons[id] || 0) + 1;
    if (this.st.cons[id] >= 5) { this.st.cons[id] = 0; this.st.cd[id] = this.st.elapsed + 3; this.push({ t: 'wrong', lock: id, cd: 3 }); return { ok: false, cd: 3 }; }
    this.push({ t: 'wrong', lock: id }); return { ok: false };
  };
  C.lockVisible = function (id) { var sc = this.scn.scenes, k, z; for (k in sc) if (sc[k].lock && sc[k].lock.id === id) { z = sc[k].lock; return this.cond(z.show); } return true; };

  /* ---------------- 힌트: 지금 보고 있는 장면·최근에 만진 퍼즐 기준 ---------------- */
  C.availPuzzles = function () { var self = this; return this.scn.puzzles.filter(function (p) { return !self.cond(p.solved) && self.cond(p.avail); }); };
  /* 장면·잠금을 만지면 그 장면이 속한 퍼즐에 「첫 접촉 시각」을 적고 「최근 만진 퍼즐」로 둔다 */
  C.touchScene = function (sceneId) {
    var self = this, st = this.st, hit = []; st.first = st.first || {}; st.recent = st.recent || [];
    this.scn.puzzles.forEach(function (p) {
      if (self.cond(p.solved) || !self.cond(p.avail) || !p.scenes || p.scenes.indexOf(sceneId) < 0) return;
      if (st.first[p.id] === undefined) st.first[p.id] = st.elapsed;
      hit.push(p.id);
    });
    if (hit.length) st.recent = hit.concat(st.recent.filter(function (x) { return hit.indexOf(x) < 0; })).slice(0, 8);   // 목록에서 앞선 퍼즐이 맨 앞
  };
  C.currentPuzzle = function (ctx) {
    var av = this.availPuzzles(); if (!av.length) return null;
    var scene = ctx && ctx.scene, st = this.st, wall = scene && this.scn.scenes[scene] ? (this.scn.scenes[scene].parent || scene) : null, best = null, bs = -1;
    av.forEach(function (p, i) {
      var sc = 0;
      if (scene && p.scenes && p.scenes.indexOf(scene) >= 0) sc = 30;                         // 지금 보고 있는 장면
      else if (wall && p.scenes && p.scenes.indexOf(wall) >= 0) sc = 20;                      // 그 벽의 퍼즐
      var r = (st.recent || []).indexOf(p.id); if (r >= 0) sc += 10 - r;                      // 최근에 만진 퍼즐
      sc += (av.length - i) * 0.01;                                                           // 같으면 목록 순서
      if (sc > bs) { bs = sc; best = p; }
    });
    return best;
  };
  /* 단계 열림 시각(첫 접촉부터 누적): 보통 — 1단계 즉시, 2단계 90초, 3단계 330초(90+240) / 쉬움 — 1단계 즉시, 2단계 10초, 3단계 40초(10+30) */
  C.waits = function () { return this.hintWaitOverride || ((this.scn.hintWaitByDiff || {})[this.diff()]) || this.scn.hintWait; };
  C.hintAt = function (lvl) { var w = this.waits(), s = 0; for (var i = 0; i < lvl; i++) s += w[i]; return s; };
  C.hintState = function (ctx) {
    var pz = this.currentPuzzle(ctx); if (!pz) return null;
    var st = this.st; st.first = st.first || {}; if (st.first[pz.id] === undefined) st.first[pz.id] = st.elapsed;
    var h = st.hint[pz.id] || { lvl: 0 }, remain = h.lvl >= 3 ? 0 : Math.max(0, this.hintAt(h.lvl + 1) - (st.elapsed - st.first[pz.id]));
    return { pz: pz, lvl: h.lvl, remain: remain, max: 3 };
  };
  C.hintText = function (pz, lvl) { var t = pz.hints[lvl - 1].text; return typeof t === 'function' ? t(this.P) : t; };
  C.requestHint = function (ctx) {
    var hs = this.hintState(ctx); if (!hs) return { none: true };
    var pz = hs.pz, h = this.st.hint[pz.id] || (this.st.hint[pz.id] = { lvl: 0 });
    if (h.lvl >= 3 || hs.remain > 0) {
      if (h.lvl === 0) return { wait: hs.remain, pz: pz };
      return { again: true, lvl: h.lvl, remain: hs.remain, pz: pz, text: this.hintText(pz, h.lvl), hl: pz.hints[h.lvl - 1].hl };
    }
    h.lvl++; this.st.hintsUsed++;
    return { lvl: h.lvl, remain: 0, pz: pz, text: this.hintText(pz, h.lvl), hl: pz.hints[h.lvl - 1].hl, fresh: true, next: h.lvl < 3 ? this.hintAt(h.lvl + 1) - (this.st.elapsed - this.st.first[pz.id]) : 0 };
  };

  C.tick = function (dt) { this.st.elapsed += dt; };
  C.toggleStar = function (cardId) { this.st.stars[cardId] = !this.st.stars[cardId]; };
  C.solvedList = function () { return Object.keys(this.st.solved); };
  C.serialize = function () { return { v: 1, seed: this.seed, st: clone(this.st), moves: this.solvedList().concat(this.st.notebook.length ? ['n'] : []) }; };

  ESC.Core = Core;
  if (typeof module !== 'undefined' && module.exports) module.exports = Core;
})(typeof window !== 'undefined' ? window : globalThis);
