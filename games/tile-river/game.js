(function () {
  'use strict';
  var A = window.Arcade;
  var TAU = Math.PI * 2;
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(a, b, x) { var t = clamp((x - a) / (b - a || 1), 0, 1); return t * t * (3 - 2 * t); }

  var P = { bg: '#f2eee4', ink: '#173d6b', accent: '#2f6cb0', accent2: '#d8b46a', grout: '#cfc9b8', tile: '#f6f2e8' };

  /* PUZZLE CORE START */
  var DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  var MOVE = { E: 1, W: 3, N: 0, S: 2 };
  var LEVELS = [
    { name: 'The first cut', idea: 'Turn the tiles to join the river.', cols: 5, rows: 4, spring: [0, 1],
      moves: ['E', 'E', 'S', 'S', 'E', 'E'], specials: {} },
    { name: 'The crossing', idea: 'One channel crosses over another. They do not join.', cols: 6, rows: 4, spring: [0, 2],
      moves: ['E', 'E', 'N', 'E', 'E', 'S', 'S', 'E'], specials: { 1: 'bridge' } },
    { name: 'The lock', idea: 'A closed gate stops the river.', cols: 6, rows: 5, spring: [0, 2],
      moves: ['E', 'E', 'N', 'N', 'E', 'E', 'S', 'S', 'S', 'E'], specials: { 3: 'lock' } },
    { name: 'The whirlpool', idea: 'One tile joins four channels at once.', cols: 6, rows: 5, spring: [0, 3],
      moves: ['E', 'E', 'N', 'E', 'N', 'E', 'S', 'S', 'E'], specials: { 6: 'whirlpool' } },
    { name: 'Two faces', idea: 'One tile holds two patterns. Only one reaches the sea.', cols: 7, rows: 5, spring: [0, 1],
      moves: ['E', 'E', 'S', 'E', 'E', 'N', 'N', 'E', 'S', 'S', 'E'], specials: { 4: 'twoface' } },
    { name: 'The full wall', idea: 'One wall holds all four special tiles.', cols: 8, rows: 5, spring: [0, 2],
      moves: ['E', 'E', 'N', 'E', 'E', 'S', 'S', 'E', 'N', 'E', 'S', 'E'],
      specials: { 1: 'bridge', 6: 'lock', 8: 'whirlpool', 10: 'twoface' } }
  ];

  function prng(seed) {
    var s = (seed >>> 0) || 1;
    return function () {
      s += 0x6D2B79F5; var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function rotGroups(base, rot) {
    var out = [];
    for (var i = 0; i < base.length; i++) {
      var g = [], grp = base[i];
      for (var j = 0; j < grp.length; j++) g.push((grp[j] + rot) & 3);
      out.push(g);
    }
    return out;
  }
  function tileGroups(cell) {
    if (cell.type === 'lock' && (cell.rot & 1)) return [];
    return rotGroups(cell.base, cell.rot);
  }
  function step(cell, d) { return [cell[0] + DIRS[d][0], cell[1] + DIRS[d][1]]; }
  function dirBetween(a, b) {
    if (b[0] > a[0]) return 1;
    if (b[0] < a[0]) return 3;
    if (b[1] < a[1]) return 0;
    return 2;
  }
  function isGood(cell, rot) {
    if (!cell.req) return true;
    if (cell.type === 'lock' && (rot & 1)) return false;
    var gs = rotGroups(cell.base, rot);
    for (var i = 0; i < gs.length; i++) {
      var ok = true;
      for (var j = 0; j < cell.req.length; j++) if (gs[i].indexOf(cell.req[j]) < 0) ok = false;
      if (ok) return true;
    }
    return false;
  }
  function buildLevel(index, seed) {
    var L = LEVELS[index % LEVELS.length];
    var cols = L.cols, rows = L.rows, rand = prng((seed >>> 0) * 7919 + (index % LEVELS.length) * 104729 + 17);
    var cells = [], y, x, i;
    for (y = 0; y < rows; y++) for (x = 0; x < cols; x++) {
      cells.push({ x: x, y: y, type: 'motif', base: [], rot: 0, solRot: 0, fixed: false,
        motif: Math.floor(rand() * 5), seedv: Math.floor(rand() * 100000), req: null, routeIndex: -1 });
    }
    var at = function (p) { return p[1] * cols + p[0]; };
    var route = [L.spring.slice()], cur = L.spring.slice();
    for (i = 0; i < L.moves.length; i++) { cur = step(cur, MOVE[L.moves[i]]); route.push(cur.slice()); }
    var used = {}, ri;
    for (ri = 0; ri < route.length; ri++) used[at(route[ri])] = ri;
    for (ri = 0; ri < route.length; ri++) {
      var p = route[ri], cell = cells[at(p)];
      cell.routeIndex = ri;
      cell.type = 'channel';
      cell.seedv = Math.floor(rand() * 100000);
      var inDir, outDir, main;
      if (ri === 0) {
        outDir = dirBetween(p, route[1]);
        cell.type = 'spring'; cell.base = [[outDir]]; cell.req = [outDir]; cell.fixed = true; cell.rot = 0; cell.solRot = 0;
      } else if (ri === route.length - 1) {
        inDir = dirBetween(p, route[ri - 1]);
        cell.type = 'sea'; cell.base = [[inDir]]; cell.req = [inDir]; cell.fixed = true; cell.rot = 0; cell.solRot = 0;
      } else {
        inDir = dirBetween(p, route[ri - 1]);
        outDir = dirBetween(p, route[ri + 1]);
        main = [inDir, outDir];
        var kind = L.specials[ri] || '';
        var remaining = [0, 1, 2, 3].filter(function (d) { return main.indexOf(d) < 0; });
        if (kind === 'bridge') { cell.type = 'bridge'; cell.base = [main, remaining]; }
        else if (kind === 'lock') { cell.type = 'lock'; cell.base = [main]; }
        else if (kind === 'whirlpool') { cell.type = 'whirlpool'; cell.base = [[0, 1, 2, 3]]; }
        else if (kind === 'twoface') { cell.type = 'twoface'; cell.base = [main, [remaining[0]], [remaining[1]]]; }
        else { cell.type = 'channel'; cell.base = [main]; }
        cell.req = main;
        cell.solRot = 0;
      }
    }
    // Decorative dead-end creeks framing the special tiles.
    var extraPorts = [];
    for (ri = 1; ri < route.length - 1; ri++) {
      var sp = cells[at(route[ri])], extra = [];
      if (sp.type === 'whirlpool') extra = [0, 1, 2, 3];
      else if (sp.type === 'bridge' || sp.type === 'twoface') {
        for (var q = 1; q < sp.base.length; q++) extra = extra.concat(sp.base[q]);
      }
      if (!extra.length) continue;
      for (var e = 0; e < extra.length; e++) {
        var np = step(route[ri], extra[e]);
        if (np[0] < 0 || np[0] >= cols || np[1] < 0 || np[1] >= rows || used[at(np)] !== undefined) continue;
        var nid = at(np);
        if (cells[nid].type !== 'motif') continue;
        extraPorts.push({ id: nid, dir: (extra[e] + 2) & 3 });
      }
    }
    for (i = 0; i < extraPorts.length; i++) {
      var ep = extraPorts[i], stub = cells[ep.id];
      stub.type = 'stub'; stub.base = [[ep.dir]]; stub.rot = 0; stub.solRot = 0;
    }
    var board = { index: index % LEVELS.length, name: L.name, idea: L.idea, cols: cols, rows: rows,
      cells: cells, route: route, spring: route[0], sea: route[route.length - 1], rev: 0, rand: rand };
    function scramble() {
      for (var k = 0; k < cells.length; k++) {
        var c = cells[k];
        if (c.fixed) continue;
        if (c.routeIndex >= 0) {
          var bad = [];
          for (var r = 0; r < 4; r++) if (!isGood(c, r)) bad.push(r);
          c.rot = bad.length ? bad[Math.floor(rand() * bad.length)] : Math.floor(rand() * 4);
        } else c.rot = Math.floor(rand() * 4);
      }
    }
    scramble();
    var guard = 0;
    while (isSolved(board).ok && guard++ < 24) scramble();
    if (isSolved(board).ok) {
      for (var rr = 1; rr < route.length - 1 && isSolved(board).ok; rr++) {
        var c2 = cells[at(route[rr])];
        for (var rot = 0; rot < 4; rot++) { c2.rot = rot; if (!isSolved(board).ok) break; }
      }
    }
    return board;
  }
  function groupWith(groups, d) {
    for (var i = 0; i < groups.length; i++) if (groups[i].indexOf(d) >= 0) return i;
    return -1;
  }
  function isSolved(board) {
    var cells = board.cells, cols = board.cols, rows = board.rows;
    var groups = [], i;
    for (i = 0; i < cells.length; i++) groups.push(tileGroups(cells[i]));
    var sId = board.spring[1] * cols + board.spring[0];
    var eId = board.sea[1] * cols + board.sea[0];
    var sG = groupWith(groups[sId], 1), eG = groupWith(groups[eId], 3);
    if (sG < 0 || eG < 0) return { ok: false, path: [] };
    var nodes = [], seen = {}, queue = [], head = 0;
    function add(ci, gi, prev) {
      var key = ci * 8 + gi;
      if (seen[key] !== undefined) return;
      seen[key] = prev;
      nodes.push({ i: ci, g: gi, prev: prev });
      queue.push(nodes.length - 1);
    }
    add(sId, sG, -1);
    var found = -1;
    while (head < queue.length) {
      var n = nodes[queue[head++]];
      if (n.i === eId && n.g === eG) { found = queue[head - 1]; break; }
      var dirs = groups[n.i][n.g];
      for (var k = 0; k < dirs.length; k++) {
        var d = dirs[k], nx = (n.i % cols) + DIRS[d][0], ny = Math.floor(n.i / cols) + DIRS[d][1];
        if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
        var ni = ny * cols + nx, ng = groupWith(groups[ni], (d + 2) & 3);
        if (ng >= 0) add(ni, ng, queue[head - 1]);
      }
    }
    if (found < 0) return { ok: false, path: [] };
    var path = [], cur = found, steps = 0;
    while (cur >= 0 && steps++ < 200) { path.push(nodes[cur].i); cur = nodes[cur].prev; }
    path.reverse();
    return { ok: true, path: path };
  }
  /* PUZZLE CORE END */

  var st = {
    levelIndex: 0, board: null, rev: 0, moves: 0, hints: 0, par: 0,
    undo: [], sailing: false, sailStart: 0, sailPath: [], sailDur: 4, nextAt: 1e9,
    levelsDone: 0, finished: false, botNextAt: 0.6, wasAttract: true, humanInit: false,
    note: 'Click a tile to turn it. Press U to undo. Press H for a hint.',
    hintIdx: -1, hintUntil: 0, wall: null, anim: null, wallSig: '', animFrame: -1,
    layout: null, tapPulse: 0, tapIdx: -1
  };

  var env = A.boot({
    id: 'tile-river',
    title: 'The tile river',
    hint: 'Click a tile to turn it. Press U to undo. Press H for a hint.',
    background: P.bg,
    ink: P.ink,
    scroll: false,
    sections: 1,
    onFrame: frame
  });

  var stateMatch = /^level([1-6])$/.exec(env.state);
  if (stateMatch) st.levelIndex = parseInt(stateMatch[1], 10) - 1;
  if (env.view === 'boat' && !stateMatch) st.levelIndex = 2;

  (function () {
    var total = 0;
    for (var li = 0; li < LEVELS.length; li++) total += (LEVELS[li].moves.length - 1) * 1.4;
    st.par = total;
  })();

  function loadLevel(index, fresh) {
    st.levelIndex = clamp(index, 0, LEVELS.length - 1);
    st.board = buildLevel(st.levelIndex, env.seed);
    st.board.rev = ++st.rev;
    st.undo = [];
    st.sailing = false;
    st.sailPath = [];
    st.hintIdx = -1;
    st.sailMarked = false;
    st.note = st.board.idea;
    st.botNextAt = env.t + (env.auto ? 0.15 : 0.9);
    void fresh;
  }

  loadLevel(st.levelIndex, true);
  if (env.view === 'boat') {
    var cells = st.board.cells;
    for (var ci = 0; ci < cells.length; ci++) if (!cells[ci].fixed) cells[ci].rot = cells[ci].solRot;
    st.board.rev = ++st.rev;
    var res = isSolved(st.board);
    if (res.ok) { st.sailing = true; st.sailPath = res.path; st.sailStart = 0; st.sailDur = Math.max(3.2, res.path.length * 0.36); st.nextAt = 1e9; }
    st.note = 'The boat sails on the joined river to the sea.';
  }
  if (env.state === 'end') { finishRun(); }

  function progressAllowed() { return env.auto || !env.attract; }

  function startSail(path, preview) {
    st.sailing = true;
    st.sailStart = env.t;
    st.sailPath = path;
    st.sailDur = Math.max(1.8, path.length * 0.24);
    st.nextAt = env.t + st.sailDur + (env.auto ? 0.2 : 1.5);
    if (!preview && progressAllowed() && !st.sailMarked) {
      st.sailMarked = true;
      st.levelsDone++;
      A.mark('tile-river', 'level-' + (st.levelIndex + 1));
      A.score('tile-river', Math.max(0, st.levelsDone * 900 - st.moves * 4));
      A.sound.chord([196, 247, 294, 392], 0.75, 0.055);
      st.note = 'You join wall ' + (st.levelIndex + 1) + '. The boat sails.';
    }
  }

  function checkSolved() {
    if (st.sailing || st.finished) return;
    var res = isSolved(st.board);
    if (res.ok) startSail(res.path, false);
  }

  function finishRun() {
    if (st.finished) return;
    st.finished = true;
    var score = Math.max(250, Math.round(7200 - st.moves * 48 - st.hints * 340));
    var stars = (st.hints === 0 && st.moves <= st.par * 1.35) ? 3 : ((st.hints <= 2 && st.moves <= st.par * 2.4) ? 2 : 1);
    A.finish({
      score: score, stars: stars,
      title: 'The river reaches the sea',
      lines: ['You join six walls.', 'Turns ' + st.moves + ', hints ' + st.hints, 'Score ' + score]
    });
  }

  function advance() {
    if (st.finished) return;
    if (st.levelIndex >= LEVELS.length - 1) { finishRun(); return; }
    st.sailMarked = false;
    loadLevel(st.levelIndex + 1, true);
  }

  function rotateCell(idx, byBot) {
    var cell = st.board.cells[idx];
    if (!cell || cell.fixed) { st.tapPulse = env.t + 0.35; st.tapIdx = idx; return; }
    st.undo.push({ idx: idx, rot: cell.rot });
    if (st.undo.length > 80) st.undo.shift();
    cell.rot = (cell.rot + (byBot ? 0 : 1)) & 3;
    if (byBot) cell.rot = cell.solRot;
    st.moves++;
    st.board.rev = ++st.rev;
    A.sound.tone({ freq: 620 + (idx % 5) * 36, dur: 0.07, gain: 0.045, type: 'triangle' });
    checkSolved();
  }

  function botFix() {
    var route = st.board.route, cols = st.board.cols;
    for (var i = 1; i < route.length - 1; i++) {
      var idx = route[i][1] * cols + route[i][0], cell = st.board.cells[idx];
      if (cell.rot !== cell.solRot) { rotateCell(idx, true); return true; }
    }
    return false;
  }

  function doHint() {
    if (st.sailing) return;
    var route = st.board.route, cols = st.board.cols;
    for (var i = 1; i < route.length - 1; i++) {
      var idx = route[i][1] * cols + route[i][0], cell = st.board.cells[idx];
      if (!isGood(cell, cell.rot)) {
        st.undo.push({ idx: idx, rot: cell.rot });
        cell.rot = cell.solRot;
        st.hints++;
        st.board.rev = ++st.rev;
        st.hintIdx = idx; st.hintUntil = env.t + 2.2;
        st.note = 'We set one tile right. That counts as a hint.';
        A.sound.tone({ freq: 784, dur: 0.2, gain: 0.055 });
        checkSolved();
        return;
      }
    }
    st.note = 'Every tile is already in place.';
  }

  function handleInput(L) {
    var clicks = env.input.consumeClicks();
    for (var i = 0; i < clicks.length; i++) {
      var c = clicks[i];
      if (c.released || c.right) continue;
      if (c.x >= L.bx && c.x < L.bx + L.bw && c.y >= L.by && c.y < L.by + L.bh) {
        var gx = Math.floor((c.x - L.bx) / L.tile), gy = Math.floor((c.y - L.by) / L.tile);
        if (gx >= 0 && gx < st.board.cols && gy >= 0 && gy < st.board.rows) rotateCell(gy * st.board.cols + gx, false);
      }
    }
    if (env.input.justPressed('KeyU') && st.undo.length && !st.sailing) {
      var u = st.undo.pop();
      st.board.cells[u.idx].rot = u.rot;
      st.moves++;
      st.board.rev = ++st.rev;
      st.note = 'You undo the last turn.';
      A.sound.tone({ freq: 340, dur: 0.09, gain: 0.045 });
      checkSolved();
    }
    if (env.input.justPressed('KeyH') && progressAllowed()) doHint();
    if (env.input.justPressed('KeyR') && progressAllowed() && !st.sailing) {
      st.sailMarked = false;
      loadLevel(st.levelIndex, true);
      st.note = 'We lay out the wall again.';
    }
  }

  function tickBots() {
    if (env.frozen || st.finished) return;
    if (st.wasAttract && !env.attract && !env.auto && !st.humanInit) {
      st.humanInit = true;
      st.sailMarked = false;
      loadLevel(st.levelIndex, true);
      st.note = 'The wall is ready. Click a tile to turn it.';
    }
    st.wasAttract = env.attract;
    if (st.sailing) {
      if (env.t > st.nextAt) {
        if (env.attract && !env.auto) {
          st.sailMarked = false;
          loadLevel(st.levelIndex, true);
          st.botNextAt = env.t + 1.2;
        } else advance();
      }
      return;
    }
    if (env.auto) {
      if (env.t > st.botNextAt) {
        if (!botFix()) { var rr = isSolved(st.board); if (rr.ok) startSail(rr.path, false); else loadLevel(st.levelIndex, true); }
        st.botNextAt = env.t + 0.10;
      }
      if (env.t > 95) finishRun();
    } else if (env.attract) {
      if (env.t > st.botNextAt) {
        if (!botFix()) {
          var res = isSolved(st.board);
          if (res.ok) startSail(res.path, true);
        }
        st.botNextAt = env.t + 0.8;
      }
    }
  }

  function geometry() {
    var W = env.w, H = env.h, pad = clamp(W * 0.045, 12, 60);
    var top = clamp(H * 0.155, 74, 132), bottom = clamp(H * 0.10, 54, 96);
    var availW = W - 2 * pad, availH = Math.max(120, H - top - bottom);
    var tile = Math.floor(Math.min(availW / st.board.cols, availH / st.board.rows));
    tile = clamp(tile, 22, 132);
    var bw = tile * st.board.cols, bh = tile * st.board.rows;
    return {
      W: W, H: H, pad: pad, top: top, tile: tile, bw: bw, bh: bh,
      bx: (W - bw) / 2, by: top + (availH - bh) / 2,
      K: clamp(tile / 100, 0.32, 1.4)
    };
  }

  function ensureCanvases(L) {
    if (!st.wall) st.wall = A.gfx.offscreen(4, 4, function () {});
    if (!st.anim) st.anim = A.gfx.offscreen(4, 4, function () {});
    if (st.wall.width !== L.bw || st.wall.height !== L.bh) { st.wall.width = L.bw; st.wall.height = L.bh; st.wallSig = ''; }
    if (st.anim.width !== L.bw || st.anim.height !== L.bh) { st.anim.width = L.bw; st.anim.height = L.bh; st.animFrame = -1; }
  }

  function edgePoint(d, x, y, tw, th) {
    if (d === 0) return [x + tw / 2, y];
    if (d === 1) return [x + tw, y + th / 2];
    if (d === 2) return [x + tw / 2, y + th];
    return [x, y + th / 2];
  }
  function water(c, pts, width, color, seed) {
    A.gfx.paintStroke(c, pts, color, width, seed, { passes: 4, jitter: width * 0.22, alpha: 0.62 });
    A.gfx.paintStroke(c, pts, 'rgba(240,247,255,.30)', width * 0.26, seed + 733, { passes: 2, jitter: width * 0.12, alpha: 0.55 });
  }

  function drawTileGlaze(c, cell, x, y, tw, th, r) {
    var K = tw / 100;
    A.gfx.rr(c, x, y, tw, th, 1.4 * K);
    c.fillStyle = A.gfx.linear(c, x, y, x + tw * 0.35, y + th,
      [[0, '#fdfaf2'], [0.42, '#f5f1e6'], [0.82, '#ece7d9'], [1, '#dedacb']]);
    c.fill();
    c.save(); c.clip();
    c.fillStyle = 'rgba(210,218,220,' + (0.03 + r() * 0.05) + ')';
    c.fillRect(x, y, tw, th);
    // Craze lines in the glaze.
    for (var i = 0; i < 5; i++) {
      var ax = x + r() * tw, ay = y + r() * th, pts = [];
      for (var k = 0; k < 4; k++) pts.push([ax + (r() - 0.5) * tw * 0.36, ay + k * th * 0.16]);
      A.gfx.paintStroke(c, pts, 'rgba(70,80,92,.10)', 0.8 * K, cell.seedv + i * 37, { passes: 1, jitter: 1.6 * K, alpha: 0.65 });
    }
    // Pinholes.
    for (var p = 0; p < 7; p++) {
      var px = x + (0.08 + r() * 0.84) * tw, py = y + (0.08 + r() * 0.84) * th;
      c.fillStyle = 'rgba(35,52,76,' + (0.07 + r() * 0.13) + ')';
      c.beginPath(); c.arc(px, py, (0.4 + r() * 0.9) * K, 0, TAU); c.fill();
    }
    // Corner brush marks, after old border tiles.
    for (var q = 0; q < 4; q++) {
      var sx = q % 2 === 0 ? 1 : -1, sy = q < 2 ? 1 : -1;
      var ox = q % 2 === 0 ? x + 3 * K : x + tw - 3 * K;
      var oy = q < 2 ? y + 3 * K : y + th - 3 * K;
      A.gfx.paintStroke(c, [[ox, oy + sy * 11 * K], [ox + sx * 4 * K, oy + sy * 4 * K], [ox + sx * 11 * K, oy]],
        'rgba(23,61,107,.52)', 2.1 * K, cell.seedv + 500 + q, { passes: 2, jitter: 0.7 * K, alpha: 0.7 });
    }
    c.restore();
    // Bevel and grout shadow.
    c.strokeStyle = 'rgba(255,255,255,.75)'; c.lineWidth = 1;
    c.beginPath(); c.moveTo(x + 1, y + th - 1); c.lineTo(x + 1, y + 1); c.lineTo(x + tw - 1, y + 1); c.stroke();
    c.strokeStyle = 'rgba(105,100,86,.28)';
    c.beginPath(); c.moveTo(x + tw - 1, y + 1); c.lineTo(x + tw - 1, y + th - 1); c.lineTo(x + 1, y + th - 1); c.stroke();
  }

  function drawChannels(c, cell, x, y, tw, th) {
    var K = tw / 100, cx = x + tw / 2, cy = y + th / 2;
    var groups = tileGroups(cell), sd = env.seed * 11 + cell.y * 97 + cell.x * 31 + 7919;
    for (var gi = 0; gi < groups.length; gi++) {
      var dirs = groups[gi];
      var col = gi === 0 ? '#173d6b' : (gi === 1 ? '#2f6cb0' : '#4a83bb');
      if (dirs.length > 1) {
        c.fillStyle = 'rgba(23,61,107,.16)';
        c.beginPath(); c.ellipse(cx, cy, tw * 0.115, th * 0.09, 0, 0, TAU); c.fill();
      }
      for (var k = 0; k < dirs.length; k++) {
        var p = edgePoint(dirs[k], x, y, tw, th), pts;
        if (dirs.length === 1) {
          pts = [[p[0], p[1]], [lerp(p[0], cx, 0.34) + (k - 0.5) * 2, lerp(p[1], cy, 0.34)],
            [lerp(p[0], cx, 0.58), lerp(p[1], cy, 0.58)]];
        } else {
          pts = [[p[0], p[1]], [lerp(p[0], cx, 0.52), lerp(p[1], cy, 0.52)], [cx, cy]];
        }
        water(c, pts, tw * 0.19, col, sd + gi * 131 + k * 17);
        c.fillStyle = 'rgba(12,40,78,.32)';
        c.beginPath(); c.ellipse(p[0], p[1], tw * 0.055, th * 0.04, 0, 0, TAU); c.fill();
      }
    }
    if (cell.type === 'bridge') {
      c.fillStyle = 'rgba(246,242,232,.92)';
      c.beginPath(); c.ellipse(cx, cy, tw * 0.16, th * 0.085, 0, 0, TAU); c.fill();
      A.gfx.paintStroke(c, [[cx - tw * 0.17, cy], [cx, cy - th * 0.055], [cx + tw * 0.17, cy]],
        '#173d6b', 3 * K, sd + 91, { passes: 3, jitter: 1.1 * K, alpha: 0.85 });
      A.gfx.paintStroke(c, [[cx - tw * 0.15, cy + th * 0.035], [cx + tw * 0.15, cy + th * 0.035]],
        '#2f6cb0', 2 * K, sd + 92, { passes: 2, jitter: 0.8 * K, alpha: 0.7 });
    }
    if (cell.type === 'lock' && (cell.rot & 1)) {
      for (var b = -2; b <= 2; b++) {
        A.gfx.paintStroke(c, [[cx + b * tw * 0.08, cy - th * 0.16], [cx + b * tw * 0.08, cy + th * 0.16]],
          'rgba(23,61,107,.85)', 2.4 * K, sd + 200 + b, { passes: 2, jitter: 0.8 * K, alpha: 0.8 });
      }
      c.fillStyle = 'rgba(216,180,106,.9)';
      c.beginPath(); c.arc(cx, cy - th * 0.19, 2.2 * K, 0, TAU); c.fill();
    } else if (cell.type === 'lock') {
      A.gfx.paintStroke(c, [[cx - tw * 0.18, cy - th * 0.24], [cx + tw * 0.18, cy - th * 0.24]],
        '#173d6b', 2.4 * K, sd + 210, { passes: 2, jitter: 0.9 * K, alpha: 0.75 });
      A.gfx.paintStroke(c, [[cx - tw * 0.18, cy + th * 0.24], [cx + tw * 0.18, cy + th * 0.24]],
        '#173d6b', 2.4 * K, sd + 211, { passes: 2, jitter: 0.9 * K, alpha: 0.75 });
    }
    if (cell.type === 'whirlpool') {
      for (var w = 1; w <= 4; w++) {
        var pts2 = [];
        for (var a = 0; a <= 16; a++) {
          var ang = a / 16 * Math.PI * 2.1 + w * 0.4 + cell.rot * 0.4;
          var rad = tw * (0.045 + w * 0.045);
          pts2.push([cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad * 0.82]);
        }
        A.gfx.paintStroke(c, pts2, w % 2 ? 'rgba(47,108,176,.7)' : 'rgba(23,61,107,.75)', 1.8 * K,
          sd + 300 + w, { passes: 2, jitter: 1.2 * K, alpha: 0.65 });
      }
    }
    if (cell.type === 'twoface') {
      c.fillStyle = 'rgba(216,180,106,.75)';
      c.beginPath(); c.arc(cx + tw * 0.2, cy - th * 0.2, 3.2 * K, 0, TAU); c.fill();
      A.gfx.paintStroke(c, [[cx - tw * 0.2, cy + th * 0.18], [cx, cy + th * 0.09], [cx + tw * 0.2, cy + th * 0.18]],
        'rgba(23,61,107,.7)', 1.8 * K, sd + 400, { passes: 2, jitter: 1 * K, alpha: 0.7 });
    }
    if (cell.type === 'spring') {
      c.fillStyle = 'rgba(216,180,106,.75)';
      c.beginPath(); c.ellipse(cx, cy, tw * 0.15, th * 0.12, 0, 0, TAU); c.fill();
      for (var s = 0; s < 3; s++) {
        A.gfx.paintStroke(c, [[cx - tw * 0.08, cy + th * (0.02 + s * 0.075)], [cx, cy - th * 0.01 + th * s * 0.06],
          [cx + tw * 0.08, cy + th * (0.02 + s * 0.075)]], 'rgba(23,61,107,.55)', 1.6 * K,
          sd + 500 + s, { passes: 2, jitter: 0.8 * K, alpha: 0.7 });
      }
      A.gfx.copyText(c, 'SPRING', cx, y + th * 0.86, clamp(8 * K, 6, 11), 'rgba(23,61,107,.8)',
        { family: 'Georgia, serif', align: 'center', tracking: 1 });
    }
    if (cell.type === 'sea') {
      for (var v = 0; v < 3; v++) {
        A.gfx.paintStroke(c, [[x + tw * 0.14, cy + th * (v * 0.12 - 0.1)],
          [cx, cy + th * (v * 0.12 - 0.14)], [x + tw * 0.86, cy + th * (v * 0.12 - 0.1)]],
          'rgba(47,108,176,.8)', 2.2 * K, sd + 600 + v, { passes: 2, jitter: 1.1 * K, alpha: 0.75 });
      }
      A.gfx.copyText(c, 'SEA', cx, y + th * 0.86, clamp(8 * K, 6, 11), 'rgba(216,180,106,.95)',
        { family: 'Georgia, serif', align: 'center', tracking: 1.4 });
    }
  }

  function drawMotif(c, cell, x, y, tw, th) {
    var K = tw / 100, cx = x + tw / 2, cy = y + th / 2, sd = cell.seedv + 900;
    if (cell.motif === 0) {
      // Windmill tower; its blades are painted in the moving layer.
      c.fillStyle = 'rgba(23,61,107,.55)';
      c.beginPath(); c.moveTo(cx - tw * 0.11, y + th * 0.82); c.lineTo(cx - tw * 0.06, cy - th * 0.08);
      c.lineTo(cx + tw * 0.06, cy - th * 0.08); c.lineTo(cx + tw * 0.11, y + th * 0.82); c.closePath(); c.fill();
      c.strokeStyle = 'rgba(23,61,107,.8)'; c.lineWidth = 1.2 * K;
      c.beginPath(); c.moveTo(cx - tw * 0.08, cy + th * 0.18); c.lineTo(cx + tw * 0.08, cy + th * 0.18); c.stroke();
      c.fillStyle = 'rgba(216,180,106,.85)';
      c.beginPath(); c.arc(cx, cy - th * 0.09, 2.4 * K, 0, TAU); c.fill();
    } else if (cell.motif === 1) {
      A.gfx.paintStroke(c, [[cx - tw * 0.19, cy], [cx - tw * 0.04, cy - th * 0.08], [cx + tw * 0.12, cy]],
        'rgba(23,61,107,.65)', 3.2 * K, sd, { passes: 3, jitter: 1.2 * K, alpha: 0.7 });
      A.gfx.paintStroke(c, [[cx + tw * 0.12, cy], [cx + tw * 0.23, cy - th * 0.09], [cx + tw * 0.23, cy + th * 0.09],
        [cx + tw * 0.12, cy]], 'rgba(47,108,176,.6)', 2 * K, sd + 1, { passes: 2, jitter: 1 * K, alpha: 0.65 });
    } else if (cell.motif === 2) {
      for (var i = 0; i < 3; i++) {
        var bx = cx + (i - 1) * tw * 0.13;
        A.gfx.paintStroke(c, [[bx - tw * 0.07, cy + th * 0.06], [bx, cy - th * 0.06], [bx + tw * 0.07, cy + th * 0.06]],
          'rgba(23,61,107,.55)', 1.8 * K, sd + i, { passes: 2, jitter: 0.8 * K, alpha: 0.65 });
      }
    } else if (cell.motif === 3) {
      for (var r = 0; r < 4; r++) {
        var rx = cx + (r - 1.5) * tw * 0.11;
        A.gfx.paintStroke(c, [[rx, y + th * 0.8], [rx + tw * 0.02, cy + th * 0.05], [rx - tw * 0.01, cy - th * 0.12]],
          'rgba(47,108,176,.55)', 1.7 * K, sd + r, { passes: 2, jitter: 1.1 * K, alpha: 0.65 });
      }
    } else {
      for (var d = 0; d < 5; d++) {
        A.gfx.paintStroke(c, [[cx - tw * 0.2, cy + d * th * 0.06 - th * 0.12],
          [cx, cy + d * th * 0.06 - th * 0.16], [cx + tw * 0.2, cy + d * th * 0.06 - th * 0.12]],
          'rgba(47,108,176,.34)', 1.6 * K, sd + d, { passes: 2, jitter: 1 * K, alpha: 0.55 });
      }
    }
  }

  function drawWall(L) {
    var sig = st.board.index + '|' + st.rev + '|' + L.tile + '|' + L.bw + '|' + env.seed;
    if (sig === st.wallSig) return;
    st.wallSig = sig;
    var c = st.wall.getContext('2d'), bw = L.bw, bh = L.bh, tile = L.tile;
    var r = prng(env.seed * 31 + st.board.index * 977 + 5);
    c.clearRect(0, 0, bw, bh);
    c.fillStyle = P.grout; c.fillRect(0, 0, bw, bh);
    for (var i = 0; i < 900; i++) {
      c.fillStyle = 'rgba(90,84,68,' + (0.02 + r() * 0.06) + ')';
      c.fillRect(r() * bw, r() * bh, 1 + r() * 2, 1 + r() * 2);
    }
    var cells = st.board.cells;
    for (var k = 0; k < cells.length; k++) {
      var cell = cells[k];
      var inset = 1.1 + r() * 1.4;
      var jitterX = (r() - 0.5) * 1.4, jitterY = (r() - 0.5) * 1.4;
      var x = cell.x * tile + inset + jitterX, y = cell.y * tile + inset + jitterY;
      var tw = tile - inset * 2 - Math.abs(jitterX), th = tile - inset * 2 - Math.abs(jitterY);
      drawTileGlaze(c, cell, x, y, tw, th, r);
      c.save();
      A.gfx.rr(c, x, y, tw, th, 1.4 * (tw / 100)); c.clip();
      if (cell.type !== 'motif') drawChannels(c, cell, x, y, tw, th);
      else drawMotif(c, cell, x, y, tw, th);
      c.restore();
      if (r() < 0.11) {
        var corner = Math.floor(r() * 4), side = corner % 2 === 0 ? 1 : -1, vert = corner < 2 ? 1 : -1;
        var cxp = corner % 2 === 0 ? x : x + tw, cyp = corner < 2 ? y : y + th;
        c.fillStyle = P.grout;
        c.beginPath(); c.moveTo(cxp, cyp); c.lineTo(cxp + side * tile * 0.12, cyp);
        c.lineTo(cxp, cyp + vert * tile * 0.10); c.closePath(); c.fill();
        c.strokeStyle = 'rgba(120,112,96,.45)'; c.lineWidth = 0.7; c.stroke();
      }
    }
    // Contact shadow around the whole wall.
    c.strokeStyle = 'rgba(60,56,44,.22)'; c.lineWidth = 2;
    c.strokeRect(1, 1, bw - 2, bh - 2);
  }

  function drawAnim(L, animFrame, p) {
    if (animFrame === st.animFrame && st.animSig === st.board.index + '|' + st.rev + '|' + L.tile) return;
    st.animFrame = animFrame;
    st.animSig = st.board.index + '|' + st.rev + '|' + L.tile;
    var c = st.anim.getContext('2d'), bw = L.bw, bh = L.bh, tile = L.tile, K = tile / 100;
    c.clearRect(0, 0, bw, bh);
    var cells = st.board.cells, i, cell;
    for (i = 0; i < cells.length; i++) {
      cell = cells[i];
      if (cell.type !== 'motif' || cell.motif !== 0) continue;
      var cx = cell.x * tile + tile / 2, cy = cell.y * tile + tile * 0.41;
      var ang = animFrame * 0.19 + cell.x * 0.7 + (st.sailing ? 0.16 : 0.045);
      for (var b = 0; b < 4; b++) {
        var a = ang + b * Math.PI / 2;
        var ex = cx + Math.cos(a) * tile * 0.31, ey = cy + Math.sin(a) * tile * 0.31;
        A.gfx.paintStroke(c, [[cx, cy], [cx + Math.cos(a + 0.09) * tile * 0.2, cy + Math.sin(a + 0.09) * tile * 0.2], [ex, ey]],
          'rgba(23,61,107,.72)', 2.5 * K, 4000 + i * 13 + b, { passes: 2, jitter: 0.9 * K, alpha: 0.7 });
      }
    }
    if (!st.sailing) {
      // Slow ripples on the glaze keep the still wall alive.
      for (var q = 0; q < 4; q++) {
        var rx = (0.16 + q * 0.22) * bw + Math.sin(animFrame * 0.06 + q) * tile * 0.12;
        var ry = (0.2 + 0.17 * (q % 3)) * bh;
        A.gfx.paintStroke(c, [[rx - tile * 0.14, ry], [rx, ry - tile * 0.035], [rx + tile * 0.14, ry]],
          'rgba(47,108,176,.22)', 1.6 * K, 7000 + q, { passes: 2, jitter: 0.8 * K, alpha: 0.5 });
      }
      return;
    }
    var path = st.sailPath;
    if (!path.length) return;
    var f = clamp(p, 0, 1) * (path.length - 1), i0 = Math.floor(f), fr = f - i0;
    var a = path[Math.min(i0, path.length - 1)], b2 = path[Math.min(i0 + 1, path.length - 1)];
    var ax = (a % st.board.cols + 0.5) * tile, ay = (Math.floor(a / st.board.cols) + 0.5) * tile;
    var bx2 = (b2 % st.board.cols + 0.5) * tile, by2 = (Math.floor(b2 / st.board.cols) + 0.5) * tile;
    var px = lerp(ax, bx2, fr), py = lerp(ay, by2, fr) + Math.sin(animFrame * 0.7) * 1.3;
    // Wake behind the hull.
    for (var w = 0; w < 3; w++) {
      A.gfx.paintStroke(c, [[px - tile * (0.24 + w * 0.09), py + 5 * K + w * 3 * K],
        [px - tile * 0.12, py + 8 * K + w * 3 * K], [px, py + 6 * K + w * 3 * K]],
        'rgba(216,180,106,.55)', 1.8 * K, 8100 + w, { passes: 2, jitter: 0.9 * K, alpha: 0.65 });
    }
    // Painted hull, mast, sail and flag.
    A.gfx.paintStroke(c, [[px - tile * 0.22, py + tile * 0.07], [px, py + tile * 0.13], [px + tile * 0.24, py + tile * 0.07],
      [px + tile * 0.16, py + tile * 0.02], [px - tile * 0.17, py + tile * 0.02], [px - tile * 0.22, py + tile * 0.07]],
      '#173d6b', 3.2 * K, 8200, { passes: 3, jitter: 1.1 * K, alpha: 0.82 });
    A.gfx.paintStroke(c, [[px, py + tile * 0.02], [px, py - tile * 0.3]], 'rgba(23,61,107,.85)', 2.4 * K,
      8210, { passes: 2, jitter: 0.7 * K, alpha: 0.8 });
    for (var s = 0; s < 5; s++) {
      var sy = py - tile * (0.28 - s * 0.055);
      A.gfx.paintStroke(c, [[px + 1, sy], [px + tile * (0.10 + s * 0.023), sy + tile * 0.03]],
        s % 2 ? 'rgba(47,108,176,.75)' : 'rgba(240,244,250,.85)', 2.6 * K, 8230 + s,
        { passes: 2, jitter: 0.8 * K, alpha: 0.7 });
    }
    A.gfx.paintStroke(c, [[px, py - tile * 0.3], [px + tile * 0.12, py - tile * 0.27], [px, py - tile * 0.24]],
      '#d8b46a', 2 * K, 8260, { passes: 2, jitter: 0.6 * K, alpha: 0.85 });
    // Fish jump out of the water the boat has just crossed.
    for (var fi = 0; fi < 4; fi++) {
      var step2 = Math.max(0, Math.floor(f) - fi * 2);
      var fcell = path[Math.min(step2, path.length - 1)];
      var fx = (fcell % st.board.cols + 0.5) * tile + tile * 0.22;
      var fy = (Math.floor(fcell / st.board.cols) + 0.5) * tile;
      var jump = Math.max(0, Math.sin(animFrame * 0.28 + fi * 1.7)) * tile * 0.24;
      A.gfx.paintStroke(c, [[fx - tile * 0.07, fy - jump], [fx, fy - jump - tile * 0.05], [fx + tile * 0.07, fy - jump]],
        'rgba(23,61,107,.75)', 2.2 * K, 8400 + fi, { passes: 2, jitter: 0.7 * K, alpha: 0.7 });
    }
    // Birds lift above the wall.
    for (var bi = 0; bi < 3; bi++) {
      var bxx = bw * (0.18 + 0.36 * p) + bi * tile * 0.28;
      var byy = bh * 0.13 - p * tile * 0.7 + Math.sin(animFrame * 0.22 + bi) * 3;
      A.gfx.paintStroke(c, [[bxx - tile * 0.09, byy], [bxx, byy - tile * 0.05], [bxx + tile * 0.09, byy]],
        'rgba(23,61,107,.65)', 1.7 * K, 8500 + bi, { passes: 2, jitter: 0.6 * K, alpha: 0.65 });
    }
    // A sea creature rolls along the top border.
    var roll = bw * (0.1 + 0.78 * p);
    A.gfx.paintStroke(c, [[roll - tile * 0.32, tile * 0.12], [roll - tile * 0.12, tile * 0.03],
      [roll + tile * 0.14, tile * 0.05], [roll + tile * 0.34, tile * 0.14]],
      'rgba(23,61,107,.35)', 3 * K, 8600, { passes: 3, jitter: 1.2 * K, alpha: 0.55 });
  }

  function drawWindowReflection(ctx, L) {
    var m = env.input.mouse;
    var mx = m.inside ? m.x : L.W * 0.5;
    var my = m.inside ? m.y : L.H * 0.35;
    var wx = L.bx + clamp((mx / L.W) * L.bw * 0.7, -L.bw * 0.15, L.bw * 0.8) - L.bw * 0.14;
    var wy = L.by + clamp((my / L.H) * L.bh * 0.4, -L.bh * 0.1, L.bh * 0.6) - L.bh * 0.2;
    ctx.save();
    ctx.beginPath(); ctx.rect(L.bx, L.by, L.bw, L.bh); ctx.clip();
    ctx.globalCompositeOperation = 'screen';
    var paneW = L.bw * 0.26, paneH = L.bh * 0.72;
    for (var i = 0; i < 2; i++) {
      var px = wx + i * paneW * 1.1;
      A.gfx.rr(ctx, px, wy, paneW, paneH, L.tile * 0.12);
      ctx.fillStyle = A.gfx.linear(ctx, px, wy, px + paneW, wy + paneH,
        [[0, 'rgba(255,255,255,0)'], [0.42, 'rgba(255,255,255,.075)'], [0.62, 'rgba(255,255,255,.11)'], [1, 'rgba(255,255,255,0)']]);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();
  }

  function drawChrome(ctx, L, p) {
    var W = L.W, H = L.H, K = L.K;
    A.gfx.copyText(ctx, 'WALL ' + (st.levelIndex + 1) + ' OF 6  /  ' + st.board.name.toUpperCase(),
      L.pad, clamp(H * 0.075, 48, 86), clamp(12 * K + 6, 12, 19), P.ink,
      { family: 'Georgia, serif', weight: '600', tracking: 1.1 });
    A.gfx.copyText(ctx, st.board.idea, L.pad, clamp(H * 0.075, 48, 86) + clamp(19 * K + 8, 18, 28),
      clamp(11 * K + 3, 11, 16), 'rgba(23,61,107,.78)', { family: 'Georgia, serif' });
    var right = W - L.pad;
    A.gfx.copyText(ctx, 'TURNS ' + st.moves + '   HINTS ' + st.hints, right, clamp(H * 0.075, 48, 86),
      clamp(10 * K + 3, 10, 14), 'rgba(23,61,107,.8)', { family: '"IBM Plex Mono", monospace', align: 'right' });
    // Six quiet progress marks.
    for (var i = 0; i < 6; i++) {
      var x = right - (5 - i) * clamp(17 * K + 6, 15, 26), y = clamp(H * 0.075, 48, 86) + 22;
      ctx.fillStyle = i < st.levelsDone ? P.accent2 : 'rgba(23,61,107,.22)';
      ctx.fillRect(x, y, clamp(10 * K + 3, 9, 15), 3);
    }
    A.gfx.copyText(ctx, st.note, L.pad, H - clamp(20 * K + 18, 30, 52), clamp(11 * K + 3, 11, 16),
      'rgba(23,61,107,.8)', { family: 'Georgia, serif' });
    if (st.sailing) {
      var label = p >= 1 ? 'The boat reaches the sea.' : 'The boat sails on the joined river.';
      A.gfx.copyText(ctx, label, W - L.pad, H - clamp(20 * K + 18, 30, 52), clamp(11 * K + 3, 11, 16),
        P.accent2, { family: 'Georgia, serif', align: 'right' });
    }
    // A hinted tile keeps a restrained gold frame for a moment.
    if (st.hintIdx >= 0 && env.t < st.hintUntil) {
      var hx = L.bx + (st.hintIdx % st.board.cols) * L.tile;
      var hy = L.by + Math.floor(st.hintIdx / st.board.cols) * L.tile;
      ctx.strokeStyle = 'rgba(216,180,106,.95)'; ctx.lineWidth = 2.4;
      ctx.strokeRect(hx + 2, hy + 2, L.tile - 4, L.tile - 4);
    }
    if (env.t < st.tapPulse && st.tapIdx >= 0) {
      var tx = L.bx + (st.tapIdx % st.board.cols) * L.tile + L.tile / 2;
      var ty = L.by + Math.floor(st.tapIdx / st.board.cols) * L.tile + L.tile / 2;
      A.gfx.glow(ctx, tx, ty, L.tile * 0.5, 'rgba(216,180,106,.18)');
    }
  }

  function frame(ctx) {
    var L = geometry();
    st.layout = L;
    ensureCanvases(L);
    tickBots();
    handleInput(L);
    drawWall(L);
    var p = st.sailing ? clamp((env.t - st.sailStart) / st.sailDur, 0, 1) : 0;
    var animFrame = Math.floor(env.t * 10);
    drawAnim(L, animFrame, p);
    // Ground and wall shadow.
    ctx.fillStyle = A.gfx.radial(ctx, L.W * 0.5, L.H * 0.36, 10, L.W * 0.5, L.H * 0.36, Math.max(L.W, L.H) * 0.8,
      [[0, 'rgba(255,255,255,.32)'], [0.7, 'rgba(255,255,255,0)'], [1, 'rgba(80,74,58,.13)']]);
    ctx.fillRect(0, 0, L.W, L.H);
    ctx.save();
    ctx.shadowColor = 'rgba(52,48,38,.35)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 12;
    ctx.fillStyle = '#cfc9b8'; ctx.fillRect(L.bx, L.by, L.bw, L.bh);
    ctx.restore();
    ctx.drawImage(st.wall, L.bx, L.by);
    ctx.drawImage(st.anim, L.bx, L.by);
    drawWindowReflection(ctx, L);
    A.gfx.vignette(ctx, L.W, L.H, 0.13);
    drawChrome(ctx, L, p);
  }
})();
