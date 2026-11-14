/* ============================================================================
 * parts.js — L2 퍼즐 부품: 소재와 무관한 「퍼즐 틀」의 생성기와 풀이기 (방탈출 엔진)
 * 생성기(gen*) = 씨앗값으로 한 판의 값을 뽑는다(그림에 굽지 않고 코드로 얹는다).
 * 풀이기(solve*) = 화면에 보이는 단서(생성된 자료)만 읽고 답을 계산한다 → 생성기의 정답과 같아야 하고, 유일해여야 한다(검사기가 확인).
 * 브라우저와 node 양쪽에서 쓴다.
 * ==========================================================================*/
(function (root) {
  'use strict';
  var ESC = root.ESC = root.ESC || {};

  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function RNG(seed) {
    var f = mulberry32(seed >>> 0);
    return {
      f: f,
      int: function (lo, hi) { return lo + Math.floor(f() * (hi - lo + 1)); },
      pick: function (a) { return a[Math.floor(f() * a.length)]; },
      shuffle: function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(f() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    };
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  /* 실제 미세조류 6종(남세균 제외) */
  var STRAINS = [
    { id: 'chlorella', ko: '클로렐라' }, { id: 'chlamydomonas', ko: '클라미도모나스' }, { id: 'haematococcus', ko: '헤마토코쿠스' },
    { id: 'dunaliella', ko: '두날리엘라' }, { id: 'nannochloropsis', ko: '나노클로롭시스' }, { id: 'scenedesmus', ko: '세네데스무스' }
  ];
  var DIM = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];   // 평년 기준(윤년·2월 29일 문제 제거)

  /* ---------- 1. 달력: 오늘 · 발표일 · 마감일 ---------- */
  function monthInfo(m) { return { dim: DIM[m], first: new Date(Date.UTC(2026, m, 1)).getUTCDay() }; }   // first: 0=일요일 … 실제 요일 배열
  function genCalendar(R) {
    var m = R.int(0, 11), mi = monthInfo(m), a = R.int(3, 9), b = R.int(a + 3, a + 12);
    var T = R.int(3, mi.dim - b);
    var xs = []; for (var d = 1; d < T; d++) xs.push(d);
    var m2 = (m + R.int(1, 11)) % 12, mi2 = monthInfo(m2), xs2 = []; for (var e = 1; e <= mi2.dim; e++) xs2.push(e);   // 속임: 지난 학기 달력(전부 X)
    return { month: m, dim: mi.dim, first: mi.first, xs: xs, pin: T, circle: T + a, square: T + b, code: pad2(a) + pad2(b),
      old: { month: m2, dim: mi2.dim, first: mi2.first, xs: xs2, circle: R.int(2, mi2.dim - 2), square: R.int(2, mi2.dim - 2) } };
  }
  function solveCalendar(c) {
    if (!c || c.pin == null || c.circle == null || c.square == null) return null;
    if (!(c.circle > c.pin && c.square > c.pin && c.circle !== c.square)) return null;
    var maxX = 0, i; for (i = 0; i < c.xs.length; i++) { if (c.xs[i] !== i + 1) return null; maxX = c.xs[i]; }
    if (maxX !== c.pin - 1) return null;                          // X 표시는 어제까지, 오늘 압정은 그 다음 칸
    var a = c.circle - c.pin, b = c.square - c.pin;
    if (a > 99 || b > 99) return null;
    return pad2(a) + pad2(b);                                     // 나란히 붙여 쓴다
  }

  /* ---------- 2. 배열 논리: 균주 4종을 선반 1~4번에 ---------- */
  function perms(a) { if (a.length <= 1) return [a.slice()]; var out = []; for (var i = 0; i < a.length; i++) { var rest = a.slice(0, i).concat(a.slice(i + 1)); perms(rest).forEach(function (p) { out.push([a[i]].concat(p)); }); } return out; }
  function satisfies(p, c) {
    var ia = p.indexOf(c.a), ib = p.indexOf(c.b), is = p.indexOf(c.s);
    if (c.t === 'notEnd') return is > 0 && is < p.length - 1;
    if (c.t === 'leftOf') return ia < ib;
    if (c.t === 'adj') return ib === ia + 1;
    return false;
  }
  function solveArrangement(ids, cons) {
    var ok = perms(ids).filter(function (p) { return cons.every(function (c) { return satisfies(p, c); }); });
    return ok.length === 1 ? ok[0] : null;
  }
  function genArrangement(R) {
    var pool = R.shuffle(STRAINS.map(function (s) { return s.id; })), ids = pool.slice(0, 4), ans = R.shuffle(ids);
    var cand = [], i, j;
    for (i = 0; i < 4; i++) {
      if (i > 0 && i < 3) cand.push({ t: 'notEnd', s: ans[i] });
      for (j = i + 1; j < 4; j++) { cand.push({ t: 'leftOf', a: ans[i], b: ans[j] }); if (j === i + 1) cand.push({ t: 'adj', a: ans[i], b: ans[j] }); }
    }
    var cons = null;
    for (var tries = 0; tries < 600 && !cons; tries++) {
      var pick = R.shuffle(cand).slice(0, 3), types = {}; pick.forEach(function (c) { types[c.t] = 1; });
      if (Object.keys(types).length < 2) continue;                // 같은 종류 세 장은 단조로우니 피한다
      var sol = solveArrangement(ids, pick);
      if (sol && sol.join() === ans.join()) cons = pick;
    }
    if (!cons) { ans = ids.slice(); cons = [{ t: 'notEnd', s: ans[1] }, { t: 'leftOf', a: ans[0], b: ans[1] }, { t: 'adj', a: ans[2], b: ans[3] }]; if (solveArrangement(ids, cons) === null) throw new Error('arrangement fallback not unique'); }
    var nums = R.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]), table = {};
    STRAINS.forEach(function (s, k) { table[s.id] = nums[k]; });
    var star = R.int(0, 3), q = R.int(0, 2); if (q >= star) q++;
    return { ids: ids, ans: ans, cons: cons, table: table, star: star, decoy: q };
  }

  /* ---------- 3. 방향: 뒤섞인 책의 권수 순서대로 화살표 ---------- */
  var DIRS = ['U', 'D', 'L', 'R'];
  function genDirection(R) {
    var vols = R.shuffle([1, 2, 3, 4]), arrows, tries = 0;
    do { arrows = [R.pick(DIRS), R.pick(DIRS), R.pick(DIRS), R.pick(DIRS)]; tries++; } while (tries < 50 && (new Set(arrows).size < 3));
    var books = vols.map(function (v, i) { return { vol: v, arrow: arrows[i] }; });
    return { books: books, ans: solveDirection({ books: books }) };
  }
  function solveDirection(d) {
    var vs = d.books.map(function (b) { return b.vol; }).slice().sort(); for (var i = 0; i < vs.length; i++) if (vs[i] !== i + 1) return null;
    return d.books.slice().sort(function (a, b) { return a.vol - b.vol; }).map(function (b) { return b.arrow; });
  }

  /* ---------- 4. 기호: 금고판의 닳은 정도로 세 기호와 순서 ---------- */
  function genSymbols(R) {
    var order = R.shuffle([0, 1, 2, 3, 4, 5]), ans = order.slice(0, 3), wear = [];
    for (var s = 0; s < 6; s++) wear.push(0.03 + R.f() * 0.07);
    wear[ans[0]] = 0.92; wear[ans[1]] = 0.62; wear[ans[2]] = 0.36;
    return { ans: ans, wear: wear };
  }
  function solveSymbols(s) {
    var idx = s.wear.map(function (w, i) { return { w: w, i: i }; }).filter(function (o) { return o.w > 0.2; }).sort(function (a, b) { return b.w - a.w; });
    if (idx.length !== 3) return null;
    return idx.map(function (o) { return o.i; });                // 많이 닳은 것부터
  }

  /* ---------- 5. 세기: 혈구계수판 네 모서리 칸의 살아 있는 세포 ---------- */
  function genCounting(R) {
    var squares = [], total = 0;
    for (var q = 0; q < 4; q++) {
      var live = R.int(1, 2), dead = R.int(0, 3), cells = R.shuffle(Array.apply(null, Array(25)).map(function (_, k) { return k; })).slice(0, live + dead), objs = [];
      cells.forEach(function (c, k) { objs.push({ x: ((c % 5) + 0.5 + (R.f() - 0.5) * 0.4) / 5, y: (Math.floor(c / 5) + 0.5 + (R.f() - 0.5) * 0.4) / 5, dead: k >= live }); });
      squares.push(objs); total += live;
    }
    return { squares: squares, total: total };
  }
  function solveCounting(c) { var t = 0; c.squares.forEach(function (sq) { sq.forEach(function (o) { if (!o.dead) t++; }); }); return t; }

  /* ---------- 6. 다이얼: ℃ → ℉ 환산 ---------- */
  function genDial(R) {
    var t1 = R.int(2, 8), t2; do { t2 = R.int(2, 8); } while (t2 === t1);
    var no = R.int(1, 2);
    return { no: no, t1: t1, t2: t2 };
  }
  function solveDial(d) { var t = d.no === 1 ? d.t1 : d.t2; return Math.round(t * 9 / 5 + 32); }

  /* ---------- 7. 태그 숫자와 최종 번호 ---------- */
  var ENERGY_ORDER = ['blue', 'green', 'orange', 'red'];            // 에너지가 큰 색부터(파장 470·530·600·650 nm)
  function genTags(R, red, green) {
    var rest = R.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9].filter(function (d) { return d !== red && d !== green; }));
    return { red: red, green: green, orange: rest[0], blue: rest[1], violet: rest[2] };
  }
  function finalCode(tags) { return ENERGY_ORDER.map(function (c) { return String(tags[c]); }).join(''); }

  /* ---------- 한 판 전체 ---------- */
  function buildLab(seed) {
    var R = RNG(seed), cal = genCalendar(R), arr = genArrangement(R), dir = genDirection(R), sym = genSymbols(R), dial = genDial(R);
    var green = arr.table[arr.ans[arr.star]], cnt = genCounting(R);
    for (var k = 0; k < 60 && cnt.total === green; k++) cnt = genCounting(R);   // 태그 숫자는 서로 달라야 한다(빨강=세기 합계, 초록=균주 번호)
    var tags = genTags(R, cnt.total, green);
    return { seed: seed, cal: cal, arr: arr, dir: dir, sym: sym, cnt: cnt, dial: dial, tags: tags, code: finalCode(tags),
      dialAns: solveDial(dial), boxCode: String(arr.star + 1) + String(green) };
  }

  ESC.parts = { mulberry32: mulberry32, RNG: RNG, pad2: pad2, STRAINS: STRAINS, DIM: DIM, DIRS: DIRS, ENERGY_ORDER: ENERGY_ORDER,
    monthInfo: monthInfo, genCalendar: genCalendar, solveCalendar: solveCalendar, genArrangement: genArrangement, solveArrangement: solveArrangement, satisfies: satisfies, perms: perms,
    genDirection: genDirection, solveDirection: solveDirection, genSymbols: genSymbols, solveSymbols: solveSymbols, genCounting: genCounting, solveCounting: solveCounting,
    genDial: genDial, solveDial: solveDial, genTags: genTags, finalCode: finalCode, buildLab: buildLab };
  if (typeof module !== 'undefined' && module.exports) module.exports = ESC.parts;
})(typeof window !== 'undefined' ? window : globalThis);
