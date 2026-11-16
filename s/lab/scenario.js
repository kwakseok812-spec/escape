/* ============================================================================
 * scenario.js — L3 소재 패키지 「정전된 배양실」 (시험판: 방 1)
 * 소재에 따라 바뀌는 것은 전부 여기(장면·누르는 영역 좌표·글·물건·잠금 연결·힌트)와 art.js 뿐이다.
 * 엔진(core.js·ui.js)과 퍼즐 부품(parts.js)은 소재를 모른다.
 *
 * 좌표: 장면 안 비율(0~1) [x, y, w, h]. 벽 장면은 4:5(논리 800×1000), 확대 장면은 정사각(논리 800×800).
 * 배경 그림 교체: 벽의 bg 를 {svg:'bgDesk'} → {img:'s/lab/img/w1_desk.webp'} 로 바꾸면 된다(ART_SPEC.md).
 *
 * ── 시험판에서 방 1로 닫으려고 끊은 곳 (설계안 v2 대비) ──
 *  · 출입증(P5)·전원 쪽지·스위치 조합(P11) 없음 → 문은 최종 숫자 바퀴 패널로 곧장 열림(방 2로 가는 문).
 *  · 시약장 순서(P10)는 금고 기호(P3)로 대체: 파랑 태그를 금고가 준다.
 *  · 배양실 열쇠 없음(같은 방 안에서 모두 해결). 방 2는 「다음 편에 이어집니다」 화면.
 * ==========================================================================*/
(function (root) {
  'use strict';
  var ESC = root.ESC = root.ESC || {};
  var SYMS = ['동그라미', '세모', '네모', '별', '십자', '물결'];
  function strainKo(id) { var r = ESC.parts.STRAINS.filter(function (s) { return s.id === id; })[0]; return r ? r.ko : id; }
  var DIRKO = { U: '위', D: '아래', L: '왼쪽', R: '오른쪽' };

  var scn = {
    id: 'lab', title: '정전된 배양실', build: function (seed) { return ESC.parts.buildLab(seed); },
    walls: ['w1', 'w2', 'w3', 'w4'], start: 'w1', hintWait: [0, 90, 240],
    /* 기능 스위치(한 줄로 끈다) — easy:false 면 난이도 카드·쉬움 표시 없이 전부 보통, normalFixes:false 면 보통 고침(N1~N7·달력 칸 격자)이 옛 그림으로 */
    features: { easy: true, normalFixes: true },
    /* 힌트 열림 간격(첫 접촉부터 누적). 보통은 그대로, 쉬움은 10초·30초(3단계 개편 때 4단계 60초를 쓰도록 뒤에 60을 미리 둠) */
    hintWaitByDiff: { normal: [0, 90, 240], easy: [0, 10, 30, 60] },
    /* 최종 패널의 색 점 배치(2×2, 읽는 순서 초·빨·파·주): 정답 순서(파·초·주·빨)나 그 역순과 같지 않다 — 검사기가 확인 */
    panelDots: ['green', 'red', 'blue', 'orange'],

    items: {
      pencil: { name: '연필', icon: 'pencil' },
      flashlight_body: { name: '손전등 본체', short: '본체', icon: 'flBody', say: '전지가 없어 켜지지 않습니다.' },
      battery: { name: '건전지', icon: 'battery' },
      flashlight: { name: '손전등', icon: 'flashlight', modes: true },
      strain_table: { name: '균주 번호표', short: '번호표', icon: 'table', examine: 'z_strain' },
      textbook: { name: '교재', icon: 'book', examine: 'z_textbook' },
      tag_violet: { name: '보라 태그', icon: 'tag' }, tag_blue: { name: '파랑 태그', icon: 'tag' }, tag_green: { name: '초록 태그', icon: 'tag' },
      tag_orange: { name: '주황 태그', icon: 'tag' }, tag_red: { name: '빨강 태그', icon: 'tag' },
      coverslip: { name: '커버글라스', icon: 'coverslip' }, chamber: { name: '혈구계수판', short: '계수판', icon: 'chamber' }, chamber_ready: { name: '덮은 계수판', short: '덮은 판', icon: 'chamberReady' },
      tube: { name: '시료 튜브', icon: 'tube' }, trypan: { name: '트립판 블루', short: '트립판', icon: 'trypan' }, tube_stained: { name: '물들인 시료', short: '염색 시료', icon: 'tubeStained' }
    },
    recipes: [
      { a: 'flashlight_body', b: 'battery', give: 'flashlight', say: '불이 들어옵니다. 손전등을 고른 채 한 번 더 누르면 보라색 빛으로 바뀝니다.' },
      { a: 'coverslip', b: 'chamber', give: 'chamber_ready', say: '계수판에 커버글라스를 덮었습니다.' },
      { a: 'tube', b: 'trypan', give: 'tube_stained', say: '시료가 파랗게 섞였습니다.' }
    ],

    scenes: {
      /* ------------------------------ 벽 4개 ------------------------------ */
      w1: { kind: 'wall', name: '책상', bg: { svg: 'bgDesk' }, props: ['pDeskCal', 'pDeskBoard', 'pDeskMemo', 'pDeskPencil'], hs: [
        { id: 'pencil', r: [0.11, 0.455, 0.23, 0.125], kind: 'pick', item: 'pencil', when: ['!flag:got_pencil'], say: '연필을 주웠습니다.' },
        { id: 'cal', r: [0.15, 0.14, 0.20, 0.28], kind: 'zoom', to: 'z_cal' },
        { id: 'board', r: [0.42, 0.14, 0.38, 0.24], kind: 'zoom', to: 'z_board' },
        { id: 'memo', r: [0.36, 0.475, 0.19, 0.12], kind: 'zoom', to: 'z_note' },
        { id: 'drawer', r: [0.54, 0.63, 0.36, 0.22], kind: 'zoom', to: 'z_drawer' },
        { id: 'lamp', r: [0.70, 0.38, 0.10, 0.20], kind: 'say', say: '정전입니다. 스탠드가 켜지지 않습니다.', quiet: true }
      ] },
      w2: { kind: 'wall', name: '책장', bg: { svg: 'bgShelf' }, props: ['pShelfWb', 'pShelfOld'], hs: [
        { id: 'books', r: [0.08, 0.36, 0.42, 0.16], kind: 'zoom', to: 'z_books' },
        { id: 'wb', r: [0.58, 0.10, 0.36, 0.30], kind: 'zoom', to: 'z_wb' },
        { id: 'old', r: [0.60, 0.46, 0.18, 0.22], kind: 'zoom', to: 'z_old' },
        { id: 'safe', r: [0.60, 0.72, 0.30, 0.20], kind: 'zoom', to: 'z_safe' }
      ] },
      w3: { kind: 'wall', name: '실험대', bg: { svg: 'bgBench' }, props: ['pBenchFlasks', 'pBenchItems'], hs: [
        { id: 'shelf', r: [0.10, 0.26, 0.50, 0.20], kind: 'zoom', to: 'z_shelf' },
        { id: 'scope', r: [0.62, 0.38, 0.26, 0.26], kind: 'zoom', to: 'z_scope' },
        { id: 'box', r: [0.08, 0.70, 0.22, 0.16], kind: 'zoom', to: 'z_box' },
        { id: 'chamber', r: [0.355, 0.535, 0.145, 0.105], kind: 'pick', item: 'chamber', when: ['!flag:got_chamber'], say: '혈구계수판을 챙겼습니다.' },
        { id: 'trypan', r: [0.22, 0.495, 0.13, 0.135], kind: 'pick', item: 'trypan', when: ['!flag:got_trypan'], say: '트립판 블루를 챙겼습니다.' },
        { id: 'cover', r: [0.515, 0.535, 0.135, 0.105], kind: 'pick', item: 'coverslip', when: ['!flag:got_coverslip'], say: '커버글라스를 챙겼습니다.' }
      ] },
      w4: { kind: 'wall', name: '문', bg: { svg: 'bgDoor' }, props: ['pDoorFridge', 'pDoorClip', 'pDoorPanel'], hs: [
        { id: 'fridge', r: [0.06, 0.18, 0.28, 0.68], kind: 'zoom', to: 'z_fridge' },
        { id: 'clip', r: [0.35, 0.42, 0.15, 0.19], kind: 'zoom', to: 'z_clip' },
        { id: 'door', r: [0.54, 0.14, 0.38, 0.72], kind: 'zoom', to: 'z_panel' },
        { id: 'pad', r: [0.60, 0.32, 0.12, 0.11], kind: 'zoom', to: 'z_panel' }
      ] },

      /* ---------------------------- 확대 장면 ---------------------------- */
      z_cal: { kind: 'zoom', parent: 'w1', draw: 'zCal', card: { id: 'c_cal', title: '달력' }, hs: [], dyn: function (core) {
        if (core.diff() !== 'easy') return [];
        var cal = core.P.cal, g = ESC.parts.calGeom(cal, 90, 60, 620, 560), out = [];
        [['circle', cal.circle], ['square', cal.square]].forEach(function (m) {
          var c = g.cell(m[1]), w = Math.max(c.w / 800, 0.14), h = Math.max(c.h / 800, 0.14);
          out.push({ id: 'pc_' + m[0], r: [Math.max(0, c.cx / 800 - w / 2), Math.max(0, c.cy / 800 - h / 2), w, h], kind: 'paint', mark: m[0] });
        });
        out.push({ id: 'pl_circle', r: [0.13, 0.795, 0.28, 0.14], kind: 'paint', mark: 'circle' }, { id: 'pl_square', r: [0.44, 0.795, 0.20, 0.14], kind: 'paint', mark: 'square' });
        return out;
      } },
      z_note: { kind: 'zoom', parent: 'w1', draw: 'zNote', card: { id: 'c_note', title: '메모지' }, hs: [
        { id: 'paper', r: [0.12, 0.10, 0.76, 0.80], kind: 'use', doneFlag: 'note_rubbed', say: '글씨는 없고 눌린 자국이 있는 것 같습니다.',
          accepts: [{ item: 'pencil', do: [{ flag: 'note_rubbed' }, { say: '연필로 문지르자 그림이 드러납니다.' }] }] }
      ] },
      z_board: { kind: 'zoom', parent: 'w1', draw: 'zBoard', card: { id: 'c_nA', title: '게시판 쪽지' }, hs: [] },
      z_drawer: { kind: 'zoom', parent: 'w1', draw: 'zDrawer', card: { id: 'c_drawer', title: '서랍' }, lock: { id: 'drawer', r: [0.05, 0.50, 0.90, 0.46] }, hs: [] },
      z_books: { kind: 'zoom', parent: 'w2', draw: 'zBooks', card: { id: 'c_books', title: '책장' }, lock: { id: 'books', r: [0.06, 0.58, 0.88, 0.38] }, hs: [] },
      z_wb: { kind: 'zoom', parent: 'w2', draw: 'zWb', card: { id: 'c_nB', title: '화이트보드 쪽지' }, hs: [] },
      z_old: { kind: 'zoom', parent: 'w2', draw: 'zOld', card: { id: 'c_old', title: '낡은 달력' }, hs: [] },
      z_safe: { kind: 'zoom', parent: 'w2', draw: 'zSafe', card: { id: 'c_safe', title: '금고' }, lock: { id: 'safe', r: [0.08, 0.62, 0.84, 0.34] }, hs: [
        { id: 'keys', r: [0.10, 0.10, 0.52, 0.46], kind: 'use', doneFlag: 'safe_rubbed', say: '키가 여섯 개입니다. 표면이 매끈합니다.',
          accepts: [{ item: 'pencil', do: [{ flag: 'safe_rubbed' }, { say: '연필 가루가 닳은 곳에 묻어납니다.' }] }] }
      ] },
      z_shelf: { kind: 'zoom', parent: 'w3', draw: 'zShelf', card: { id: 'c_shelf', title: '선반' }, lock: { id: 'shelf', r: [0.04, 0.55, 0.92, 0.42] }, hs: [
        { id: 'flasks', r: [0.04, 0.04, 0.92, 0.44], kind: 'use', doneFlag: 'star_seen', say: '병마다 초록 배양액이 들어 있습니다.',
          accepts: [
            { item: 'flashlight', mode: 'uv', do: [{ flag: 'star_seen' }, { say: '한 병에서 형광 표식이 나타납니다.' }] },
            { item: 'flashlight', mode: 'light', do: [{ say: '병마다 초록 배양액이 들어 있습니다.' }] }
          ] }
      ] },
      z_box: { kind: 'zoom', parent: 'w3', draw: 'zBox', card: { id: 'c_box', title: '시료 상자' }, lock: { id: 'box', r: [0.10, 0.60, 0.80, 0.36] }, hs: [] },
      z_scope: { kind: 'zoom', parent: 'w3', draw: 'zScope', card: { id: 'c_scope', title: '현미경' }, lock: { id: 'count', r: [0.06, 0.72, 0.88, 0.26], show: ['flag:chamber_on', 'flag:sample_on'] }, hs: [
        { id: 'stage', r: [0.22, 0.08, 0.56, 0.58], kind: 'use', when: ['!flag:sample_on'], say: '비어 있는 스테이지입니다. 계수판을 올려야 합니다.',
          accepts: [
            { item: 'chamber_ready', when: ['!flag:chamber_on'], do: [{ take: 'chamber_ready' }, { flag: 'chamber_on' }, { say: '계수판을 스테이지에 올렸습니다.' }] },
            { item: 'tube_stained', when: ['flag:chamber_on'], do: [{ take: 'tube_stained' }, { flag: 'sample_on' }, { say: '시료를 계수판에 채웠습니다. 세포가 보입니다.' }] },
            { item: 'tube_stained', when: ['!flag:chamber_on'], do: [{ say: '먼저 계수판을 올려야 합니다.' }] },
            { item: 'chamber', do: [{ say: '커버글라스를 덮어야 합니다.' }] },
            { item: 'tube', do: [{ say: '시료를 트립판 블루로 물들여야 합니다.' }] }
          ] }
      ] },
      z_fridge: { kind: 'zoom', parent: 'w4', draw: 'zFridge', card: { id: 'c_fridge', title: '냉장고' }, lock: { id: 'fridge', r: [0.38, 0.08, 0.60, 0.84] }, hs: [] },
      z_clip: { kind: 'zoom', parent: 'w4', draw: 'zClip', card: { id: 'c_clip', title: '점검표' }, hs: [] },
      z_panel: { kind: 'zoom', parent: 'w4', draw: 'zPanel', card: { id: 'c_panel', title: '출구 패널' }, lock: { id: 'door', r: [0.08, 0.40, 0.84, 0.56] }, hs: [] },
      z_strain: { kind: 'zoom', parent: null, draw: 'zStrain', card: { id: 'c_strain', title: '균주 번호표' }, hs: [] },
      z_textbook: { kind: 'zoom', parent: null, draw: 'zTextbook', card: { id: 'c_text', title: '교재' }, hs: [] }
    },

    /* ------------------------------ 잠금 ------------------------------ */
    locks: {
      drawer: { type: 'digits', n: 4, handle: 'pull', ans: function (P) { return P.cal.code; }, labels: function () { return [{ ic: 'footRing', span: 2 }, { ic: 'footSq', span: 2 }]; },
        on: [{ give: 'flashlight_body' }, { give: 'strain_table' }, { give: 'tag_violet' }, { say: '서랍이 열렸습니다.' }] },
      books: { type: 'direction', n: 4, handle: 'rotate', ans: function (P) { return P.dir.ans; }, labels: function (d) { return d === 'easy' ? [1, 2, 3, 4].map(function (k) { return { ic: 'n' + k, span: 1 }; }) : null; },
        on: [{ give: 'battery' }, { give: 'textbook' }, { say: '책장 뒤 칸이 열렸습니다.' }] },
      safe: { type: 'symbols', n: 3, handle: 'lever', ans: function (P) { return P.sym.ans; }, labels: function (d) { return d === 'easy' ? [{ ic: 'dotL', span: 1 }, { ic: 'dotM', span: 1 }, { ic: 'dotS', span: 1 }] : null; },
        on: [{ give: 'tag_blue' }, { say: '금고가 열렸습니다.' }] },
      shelf: { type: 'order', n: 4, handle: 'slide', ans: function (P) { return P.arr.ans; }, labels: function (d) { return d === 'easy' ? [{ ic: 'flowR', span: 4 }] : null; },
        on: [{ flag: 'flasks_labeled' }, { say: '병에 균주 라벨이 붙었습니다.' }] },
      box: { type: 'digits', n: 2, handle: 'pull', ans: function (P) { return P.boxCode; }, labels: function (d) { return d === 'easy' ? [{ ic: 'bottleN', span: 1 }, { ic: 'tableN', span: 1 }] : null; },
        on: [{ give: 'tag_green' }, { say: '시료 상자가 열렸습니다.' }] },
      fridge: { type: 'dial', handle: 'pullleft', min: 30, max: 50, ans: function (P) { return P.dialAns; }, labels: function (d) { return d === 'easy' ? [{ ic: 'degCF', span: 1 }] : null; },
        on: [{ give: 'tag_orange' }, { give: 'tube' }, { flag: 'fridge_open' }, { say: '냉장고가 열렸습니다.' }] },
      count: { type: 'count', handle: 'slide', ans: function (P) { return P.cnt.total; }, labels: function (d) { return d === 'easy' ? [{ ic: 'greenSum', span: 1 }] : null; },
        on: [{ give: 'tag_red' }, { say: '기록 칸에서 태그가 나왔습니다.' }] },
      door: { type: 'digits', n: 4, handle: 'lever', ans: function (P) { return P.code; }, labels: function (d) { return d === 'easy' ? [{ ic: 'boltFlow', span: 4 }] : null; },
        on: [{ flag: 'door_open' }, { end: true }] }
    },

    /* ------------------------- 힌트 (퍼즐 순서대로) ------------------------- */
    puzzles: [
      { id: 'pz_pencil', scenes: ['w1'], solved: 'has:pencil', avail: [], hints: [
        { text: '책상 위를 살펴보십시오.', hl: ['wall:w1'] },
        { text: '책상 왼쪽 필통 바로 옆에 놓인 작은 연필 그림을 찾아 눌러 보십시오.', hl: ['wall:w1', 'hs:w1.pencil'] },
        { text: '연필을 눌러 주우십시오.', hl: ['hs:w1.pencil'] }] },
      { id: 'pz_note', scenes: ['w1', 'z_note'], solved: 'flag:note_rubbed', avail: ['has:pencil'], hints: [
        { text: '책상의 메모지가 수상합니다.', hl: ['wall:w1', 'hs:w1.memo'] },
        { text: '소지품에서 연필을 고른 채 메모지 확대 화면의 종이를 누르면, 눌려 있던 자국이 연필 가루로 드러납니다.', hl: ['item:pencil', 'hs:w1.memo'] },
        { text: '소지품에서 연필을 누르고, 메모지를 눌러 연 뒤 종이를 누르십시오.', hl: ['item:pencil', 'hs:z_note.paper'] }] },
      { id: 'pz_drawer', scenes: ['w1', 'z_cal', 'z_note', 'z_drawer'], solved: 'solved:drawer', avail: ['flag:note_rubbed'], hints: [
        { text: '달력과 메모지 그림을 함께 보십시오.', hl: ['card:c_cal', 'card:c_note'] },
        { text: '달력의 날짜 숫자가 아니라, 오늘 압정에서 발표(○)와 마감(□)까지 몇 칸 떨어져 있는지를 한 칸씩 세어 두 자리씩(2칸이면 02) 붙여 네 칸에 맞추십시오.', hl: ['card:c_cal', 'card:c_note'] },
        { text: function (P) { return '발표까지 ' + P.cal.code.slice(0, 2) + '칸, 마감까지 ' + P.cal.code.slice(2) + '칸입니다. 붙여서 서랍에 맞추십시오.'; }, hl: ['hs:w1.drawer'] }] },
      { id: 'pz_books', scenes: ['w2', 'z_books', 'z_wb'], solved: 'solved:books', avail: [], hints: [
        { text: '책장 가운데 칸의 책 여섯 권과, 화이트보드의 규칙 그림을 함께 보십시오.', hl: ['wall:w2', 'hs:w2.books', 'hs:w2.wb'] },
        { text: '화이트보드가 알려 준 띠 색(✓)의 책 네 권만 골라, 책등의 둥근 번호가 작은 책부터 차례로 그 책의 화살표 방향을 읽어 네 칸에 넣으십시오.', hl: ['hs:w2.books', 'card:c_nB'] },
        { text: function (P) { return '순서는 ' + P.dir.ans.map(function (d) { return DIRKO[d]; }).join(', ') + '입니다.'; }, hl: ['hs:w2.books'] }] },
      { id: 'pz_flash', scenes: ['w2', 'z_books'], solved: 'has:flashlight', avail: ['has:flashlight_body', 'has:battery'], hints: [
        { text: '손전등에 전지가 필요합니다.', hl: ['item:flashlight_body', 'item:battery'] },
        { text: '소지품에서 손전등 본체를 고른 채, 이어서 건전지 칸을 누르면 하나로 합쳐집니다.', hl: ['item:flashlight_body', 'item:battery'] },
        { text: '손전등 본체와 건전지를 합치십시오.', hl: ['item:flashlight_body', 'item:battery'] }] },
      { id: 'pz_arr', scenes: ['w3', 'w1', 'w2', 'z_shelf', 'z_board', 'z_wb'], solved: 'solved:shelf', avail: [], hints: [
        { text: '선반의 병 네 개와, 세 곳(게시판·화이트보드·선반 옆)의 그림 쪽지를 모으십시오.', hl: ['card:c_nA', 'card:c_nB', 'card:c_shelf'] },
        { text: '세 쪽지(양 끝이 아님·왼쪽에 있음·바로 옆)를 모두 지키는 배열은 하나뿐이니, 선반 네 칸에 균주를 놓아 가며 세 쪽지가 모두 맞는지 확인하십시오.', hl: ['card:c_nA', 'card:c_nB', 'card:c_shelf'] },
        { text: function (P) { return '왼쪽부터 ' + P.arr.ans.map(strainKo).join(', ') + '입니다.'; }, hl: ['hs:w3.shelf'] }] },
      { id: 'pz_star', scenes: ['w3', 'z_shelf', 'z_box', 'z_strain'], solved: 'solved:box', avail: ['solved:shelf', 'has:flashlight'], hints: [
        { text: '손전등의 보라색 빛 모드로 선반 병을 비춰 보십시오.', hl: ['item:flashlight', 'hs:w3.shelf'] },
        { text: '「기준」 스티커 병이 아니라 보라 빛에 표식이 나타난 병을 찾아, 그 병의 자리 번호(왼쪽부터 1~4)와 그 병 균주의 번호표 숫자를 차례로 이어 두 칸에 넣으십시오.', hl: ['card:c_strain'] },
        { text: function (P) { return '상자 번호는 ' + P.boxCode + '입니다.'; }, hl: ['hs:w3.box'] }] },
      { id: 'pz_dial', scenes: ['w4', 'z_fridge', 'z_clip'], solved: 'solved:fridge', avail: [], hints: [
        { text: '문 벽의 점검표와 냉장고를 살펴보십시오.', hl: ['wall:w4', 'hs:w4.clip', 'hs:w4.fridge'] },
        { text: '냉장고에 적힌 호기와 같은 호기의 점검표 온도(°C)를 찾아 「×9÷5+32」로 °F로 바꾼 뒤, 다이얼을 그 눈금에 맞추십시오.', hl: ['card:c_clip', 'card:c_fridge'] },
        { text: function (P) { return '다이얼을 ' + P.dialAns + '에 맞추십시오.'; }, hl: ['hs:w4.fridge'] }] },
      { id: 'pz_safe', scenes: ['w2', 'z_safe'], solved: 'solved:safe', avail: ['has:pencil'], hints: [
        { text: '금고 키패널을 살펴보십시오. 연필이 쓸모 있습니다.', hl: ['wall:w2', 'hs:w2.safe'] },
        { text: '연필로 문지른 뒤 가장 많이 닳은 기호 세 개만 골라, 스티커의 진한 점(많이 닳음)부터 옅은 점 순서대로 한 칸씩 맞추십시오.', hl: ['card:c_safe'] },
        { text: function (P) { return '기호는 ' + P.sym.ans.map(function (i) { return SYMS[i]; }).join(', ') + ' 순서입니다.'; }, hl: ['hs:w2.safe'] }] },
      { id: 'pz_count', scenes: ['w3', 'z_scope'], solved: 'solved:count', avail: ['solved:fridge'], hints: [
        { text: '실험대에서 커버글라스·계수판·트립판 블루를 모으십시오. 시료는 냉장고에 있습니다.', hl: ['wall:w3'] },
        { text: '커버글라스+계수판, 시료+트립판 블루를 각각 합쳐 스테이지에 올린 뒤, 노란 테두리의 네 모서리 큰 칸 안에서 초록(살아 있는) 세포만 세십시오.', hl: ['hs:w3.scope'] },
        { text: '네 칸의 초록(살아 있는) 세포만 세어 합계를 계수기에 맞추십시오. 파란 것은 제외합니다.', hl: ['hs:w3.scope'] }] },
      { id: 'pz_door', scenes: ['w4', 'z_panel', 'z_textbook'], solved: 'flag:door_open', avail: ['solved:count', 'solved:box', 'solved:fridge', 'solved:safe'], hints: [
        { text: '문 옆 패널은 숫자 네 칸입니다. 색 태그 네 개의 숫자를 모으십시오.', hl: ['wall:w4', 'hs:w4.pad'] },
        { text: '교재의 규칙대로 파장이 짧아 에너지가 큰 색부터 왼쪽에서 오른쪽으로 놓고, 각 색 태그의 숫자를 그 순서대로 네 칸에 넣으십시오(보라 태그는 쓰지 않습니다).', hl: ['item:textbook', 'card:c_text'] },
        { text: function (P) { return '왼쪽부터 ' + P.code.split('').join(', ') + '입니다.'; }, hl: ['hs:w4.door'] }] }
    ]
  };

  /* ---------------- 배경 그림(Gemini) 모드 ----------------
   * ART_MODE = 'img' 이면 벽 4면이 s/lab/img/ 의 그림을 쓰고, 덧그림(props)·누르는 자리(r)도 그림 기준 좌표를 쓴다.
   * 아래 한 줄을 'svg' 로 바꾸면 전부 예전 코드 그림으로 되돌아간다. 그림 한 장이 안 읽히면 그 벽만 코드 그림으로 대신한다(ui.js). */
  var ART_MODE = 'img';
  var IMG = {
    w1: { src: 's/lab/img/w1_desk.webp', props: ['iDeskCal', 'iDeskBoard', 'iDeskMemo', 'iDeskPencil'],
      r: { pencil: [0.17, 0.61, 0.25, 0.11], cal: [0.14, 0.24, 0.20, 0.27], board: [0.43, 0.27, 0.44, 0.27], memo: [0.42, 0.60, 0.17, 0.11], drawer: [0.65, 0.71, 0.30, 0.28], lamp: [0.72, 0.54, 0.16, 0.14] } },
    w2: { src: 's/lab/img/w2_shelf.webp', props: ['iShelfWb', 'iShelfOld'],
      r: { books: [0.09, 0.53, 0.40, 0.14], wb: [0.54, 0.24, 0.41, 0.23], old: [0.54, 0.49, 0.18, 0.21], safe: [0.73, 0.52, 0.23, 0.18] } },
    w3: { src: 's/lab/img/w3_bench.webp', props: ['iBenchFlasks', 'iBenchItems'],
      r: { shelf: [0.13, 0.33, 0.45, 0.18], scope: [0.69, 0.47, 0.20, 0.23], box: [0.13, 0.82, 0.28, 0.17], chamber: [0.34, 0.62, 0.15, 0.095], trypan: [0.22, 0.58, 0.11, 0.12], cover: [0.50, 0.62, 0.12, 0.095] } },
    w4: { src: 's/lab/img/w4_door.webp', props: ['iDoorFridge', 'iDoorClip', 'iDoorPanel'],
      r: { fridge: [0.06, 0.29, 0.34, 0.66], clip: [0.44, 0.32, 0.14, 0.19], door: [0.635, 0.24, 0.335, 0.67], pad: [0.485, 0.53, 0.145, 0.12] } }
  };
  /* 벽 하나를 'img' 또는 'svg' 모드로 맞춘다. 원본(코드 그림 기준)은 처음 한 번 보관한다. */
  scn.setArt = function (wallId, mode) {
    var sc = scn.scenes[wallId], im = IMG[wallId]; if (!sc || !im) return;
    if (!sc._svg) { sc._svg = { bg: sc.bg, props: sc.props, r: {} }; sc.hs.forEach(function (h) { sc._svg.r[h.id] = h.r; }); }
    if (mode === 'img') { sc.bg = { img: im.src }; sc.props = im.props; sc.hs.forEach(function (h) { if (im.r[h.id]) h.r = im.r[h.id]; }); sc.artImg = true; }
    else { sc.bg = sc._svg.bg; sc.props = sc._svg.props; sc.hs.forEach(function (h) { if (sc._svg.r[h.id]) h.r = sc._svg.r[h.id]; }); sc.artImg = false; }
  };
  scn.walls.forEach(function (w) { scn.setArt(w, ART_MODE); });

  ESC.scenarios = ESC.scenarios || {}; ESC.scenarios.lab = scn;
  if (typeof module !== 'undefined' && module.exports) module.exports = scn;
})(typeof window !== 'undefined' ? window : globalThis);
