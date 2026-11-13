/* The cork gallery - a travelling fair shooting stall at dusk.
   Everything is painted in Canvas2D, from the sign-writing to the corks. */
(function () {
  'use strict';

  var G = Arcade.gfx;
  var ID = 'cork-gallery';
  var TARGET = 1200;

  var P = {
    ink: '#f6e6c8', gold: '#e8a13c', red: '#c9534c', cream: '#efe0bd',
    wood: '#4a2b20', wood2: '#8b5a38', brass: '#c99a4c', brassHi: '#f6dc9d',
    dark: '#191623', green: '#294744', blue: '#263257', glass: '#ffe7ae'
  };

  var ROWS = [
    { z: 6.0, y: 0.45, size: 0.58, gap: 1.15 },
    { z: 10.0, y: 0.88, size: 0.85, gap: 1.55 },
    { z: 15.0, y: 2.12, size: 1.22, gap: 2.05 }
  ];
  var TYPES = [
    ['moon', 'teapot', 'bell', 'pipe', 'star', 'moon'],
    ['bottle', 'moon', 'spinner', 'travel', 'bell', 'pipe'],
    ['star', 'bottle', 'shutter', 'pendulum', 'moon']
  ];

  var Z0 = 3.2, VZ = 15.5, GRAV = 8.0, ZREF = 10.0, BOARD = 17.2;

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function s01(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }

  function geom() {
    var w = env.w, h = env.h;
    var f = Math.max(w * 0.70, h * 1.15);
    return { w: w, h: h, f: f, hz: h * 0.40, camY: 1.65,
      xs: clamp((w / Math.max(1, h)) / 1.45, 0.30, 1) };
  }
  function proj(g, x, y, z) {
    var s = g.f / Math.max(0.5, z);
    return { x: g.w / 2 + x * s, y: g.hz - (y - g.camY) * s, s: s };
  }
  function launchY(g) { return g.camY + (g.hz - g.h * 0.83) * Z0 / g.f; }

  function velocityFromPointer(px, py, g, wind) {
    var tr = (ZREF - Z0) / VZ;
    var ax = (px - g.w / 2) * ZREF / g.f;
    var ay = g.camY + (g.hz - py) * ZREF / g.f;
    var y0 = launchY(g);
    return {
      vx: (ax - 0 - 0.5 * wind * tr * tr) / tr,
      vy: (ay - y0) / tr,
      tr: tr
    };
  }
  function pointerForTarget(tx, ty, tz, g, wind) {
    var th = (tz - Z0) / VZ;
    var vx = (tx - 0.5 * wind * th * th) / th;
    var vy = (ty - launchY(g) + 0.5 * GRAV * th * th) / th;
    var tr = (ZREF - Z0) / VZ;
    var ax = vx * tr + 0.5 * wind * tr * tr;
    var ay = launchY(g) + vy * tr;
    return { x: g.w / 2 + ax * g.f / ZREF, y: g.hz - (ay - g.camY) * g.f / ZREF };
  }

  /* ---------------- state ---------------- */
  var S, cache = null, hadInput = false, bootFrame = true;

  function freshState(real) {
    var R = Arcade.rng(env.seed + 7717);
    var st = {
      t: 0, r: R, wind: (R() * 2 - 1) * 0.55,
      ph: [], spin: [], spinV: [], down: [], downT: [],
      corks: [], rest: [], parts: [], floaters: [],
      score: 0, combo: 0, bestCombo: 0, hits: 0, posted: 0,
      round: 1, roundTime: 0, real: real, finished: false, marked: {},
      chase: 0, flipT: -9, shownScore: 0, bannerT: -9,
      gun: { yaw: 0, pitch: 0, vy: 0, vq: 0, lever: 0, kick: 0 },
      pointer: { x: env.w * 0.5, y: env.h * 0.5 },
      bot: { px: env.w * 0.5, py: env.h * 0.5, aim: null, r: 0, i: 0,
        nextFire: 0.35, retarget: 0, hump: -9 },
      frozenDone: false
    };
    for (var r = 0; r < 3; r++) {
      st.ph[r] = []; st.spin[r] = []; st.spinV[r] = []; st.down[r] = []; st.downT[r] = [];
      for (var i = 0; i < TYPES[r].length; i++) {
        st.ph[r][i] = R() * 6.28;
        st.spin[r][i] = R() * 6.28;
        st.spinV[r][i] = 0;
        st.down[r][i] = false;
        st.downT[r][i] = -9;
      }
    }
    st.dur = (env.state === 'short' || env.auto) ? 8 : 25;
    if (env.state === 'last') { st.round = 3; st.score = Math.round(TARGET * 0.62); }
    if (env.state === 'end') { st.score = 1780; st.finished = false; }
    S = st;
  }

  function resetTargets() {
    for (var r = 0; r < 3; r++) for (var i = 0; i < TYPES[r].length; i++) S.down[r][i] = false;
    S.rest.length = 0;
    S.corks.length = 0;
    S.combo = 0;
  }

  /* ---------------- sound ---------------- */
  function sFire() {
    Arcade.sound.tone({ freq: 96, dur: 0.19, type: 'triangle', gain: 0.17, slideTo: 44 });
    Arcade.sound.noise({ dur: 0.10, gain: 0.075, freq: 1100 });
    Arcade.sound.tone({ freq: 240, dur: 0.07, type: 'square', gain: 0.035, slideTo: 120 });
  }
  function sClack() {
    Arcade.sound.noise({ dur: 0.075, gain: 0.13, freq: 2700, filter: 'bandpass' });
    Arcade.sound.tone({ freq: 330, dur: 0.075, type: 'square', gain: 0.05, slideTo: 160 });
  }
  function sBell() {
    Arcade.sound.chord([880, 1320, 1760], 0.46, 0.075);
    Arcade.sound.tone({ freq: 1760, dur: 0.5, gain: 0.04, slideTo: 1690 });
  }
  function sTick() { Arcade.sound.tone({ freq: 620, dur: 0.045, type: 'square', gain: 0.022 }); }
  function sHum() {
    if (!Arcade.sound.enabled) return;
    Arcade.sound.tone({ freq: 55, dur: 1.25, gain: 0.012, type: 'sine' });
    Arcade.sound.tone({ freq: 110, dur: 1.25, gain: 0.008, type: 'sine' });
  }

  /* ---------------- simulation ---------------- */
  function targetWorld(r, i, t) {
    var row = ROWS[r], n = TYPES[r].length, g = geom();
    var x = (i - (n - 1) / 2) * row.gap * g.xs;
    var y = row.y, type = TYPES[r][i], ph = S.ph[r][i];
    var open = 1, rot = 0;
    if (r === 1) x += Math.sin(t * 0.5 + ph * 0.35) * 0.85 * g.xs;
    if (type === 'travel') x += Math.sin(t * 1.0 + ph) * 0.7 * g.xs;
    if (type === 'pendulum') {
      x += Math.sin(t * 1.15 + ph) * 1.25 * g.xs;
      y += 0.15 * Math.cos(t * 1.15 + ph);
      rot = Math.sin(t * 1.15 + ph) * 0.55;
    }
    if (type === 'shutter') open = s01((Math.sin(t * 1.65 + ph) + 0.34) * 1.3);
    if (type === 'spinner') rot = t * 1.7 + S.spin[r][i];
    if (type === 'bell') y += 0.03 * Math.sin(t * 2.1 + ph);
    return { x: x, y: y, s: row.size, type: type, open: open, rot: rot,
      hit: row.size * 0.80 * (type === 'shutter' ? Math.max(0.3, open) : 1) };
  }

  function spawnParts(x, y, n, col) {
    for (var k = 0; k < n && S.parts.length < 130; k++) {
      S.parts.push({ x: x, y: y, vx: (S.r() - 0.5) * 160, vy: -30 - S.r() * 130,
        life: 0.5 + S.r() * 0.5, t: S.t, col: col, r: 1 + S.r() * 2.2 });
    }
  }

  function fire(px, py) {
    if (S.gun.lever > 0 || S.corks.length > 34 || S.finished) return;
    var g = geom(), v = velocityFromPointer(px, py, g, S.wind);
    var c = { x: 0, y: launchY(g), z: Z0, vx: v.vx, vy: v.vy, vz: VZ,
      spin: S.r() * 6.28, spinV: (S.r() * 2 - 1) * 22, age: 0,
      ric: false, bounces: 0, trail: [] };
    S.corks.push(c);
    S.gun.lever = 0.52;
    S.gun.kick = 1;
    var m = proj(g, 0, c.y, Z0);
    spawnParts(m.x, m.y, 6, P.cream);
    sFire();
    if (S.real && !S.marked['first-shot']) { S.marked['first-shot'] = true; Arcade.mark(ID, 'first-shot'); }
  }

  function hitTarget(r, i, c) {
    if (S.down[r][i] || S.finished) return;
    var tw = targetWorld(r, i, S.t);
    var ric = !!c.ric;
    var pts = Math.round(([45, 80, 130][r] + Math.min(S.combo, 10) * 9) * (ric ? 1.7 : 1));
    S.score += pts;
    S.combo++;
    S.hits++;
    S.bestCombo = Math.max(S.bestCombo, S.combo);
    S.down[r][i] = true;
    S.downT[r][i] = S.t;
    S.spinV[r][i] += 9;
    S.chase = 1.8;
    S.flipT = S.t;
    var g = geom(), sp = proj(g, tw.x, tw.y, ROWS[r].z);
    S.floaters.push({ x: sp.x, y: sp.y, text: '+' + pts + (ric ? ' ricochet' : ''), t: S.t });
    spawnParts(sp.x, sp.y, 11, tw.type === 'bell' ? P.gold : P.cream);
    if (tw.type === 'bell') sBell(); else sClack();
    if (S.real) {
      if (!S.marked['first-hit']) { S.marked['first-hit'] = true; Arcade.mark(ID, 'first-hit'); }
      if (S.combo >= 5 && !S.marked['combo-5']) { S.marked['combo-5'] = true; Arcade.mark(ID, 'combo-5'); }
      if (ric && !S.marked['ricochet']) { S.marked['ricochet'] = true; Arcade.mark(ID, 'ricochet'); }
      if (S.score - S.posted > 120) { S.posted = S.score; Arcade.score(ID, S.score); }
    }
  }

  function restCork(x, y, z) {
    if (S.rest.length > 46) S.rest.shift();
    S.rest.push({ x: x, y: Math.max(0.05, y), z: Math.min(BOARD - 0.1, Math.max(2.4, z)), rot: S.r() * 6.28 });
  }

  function stepCork(c, dt) {
    var px = c.x, py = c.y, pz = c.z;
    var nx = c.x + c.vx * dt + 0.5 * S.wind * dt * dt;
    var ny = c.y + c.vy * dt - 0.5 * GRAV * dt * dt;
    var nz = c.z + c.vz * dt;
    c.vx += S.wind * dt; c.vy -= GRAV * dt;
    c.age += dt; c.spin += c.spinV * dt;
    c.trail.push({ x: nx, y: ny, z: nz });
    if (c.trail.length > 5) c.trail.shift();

    for (var r = 0; r < 3; r++) {
      var zr = ROWS[r].z;
      if ((pz - zr) * (nz - zr) <= 0 && Math.abs(nz - pz) > 0.00001) {
        var u = (zr - pz) / (nz - pz);
        var cx = px + (nx - px) * u, cy = py + (ny - py) * u;
        for (var i = 0; i < TYPES[r].length; i++) {
          if (S.down[r][i]) continue;
          var tw = targetWorld(r, i, S.t);
          if (tw.type === 'shutter' && tw.open < 0.42) continue;
          var dx = (cx - tw.x) / tw.hit, dy = (cy - tw.y) / (tw.hit * 0.92);
          if (dx * dx + dy * dy < 1) {
            hitTarget(r, i, c);
            c.vz = -Math.abs(c.vz) * 0.38;
            c.vy += 1.1 + S.r() * 1.7;
            c.vx += (S.r() - 0.5) * 3.4;
            c.ric = true; c.bounces++;
            break;
          }
        }
      }
    }
    if (nz >= BOARD && c.vz > 0) {
      c.vz = -Math.abs(c.vz) * 0.32;
      c.vx += (S.r() - 0.5) * 2.2;
      c.vy += 0.7;
      c.ric = true; c.bounces++;
      sTick();
      var bp = proj(geom(), nx, ny, BOARD);
      spawnParts(bp.x, bp.y, 3, P.wood2);
      nz = BOARD - 0.02;
    }
    if (ny <= 0.06 || (nz <= Z0 - 0.9 && c.vz < 0) || c.age > 4.2 || Math.abs(nx) > 26) {
      restCork(nx, ny, nz);
      return false;
    }
    c.x = nx; c.y = ny; c.z = nz;
    return true;
  }

  function pickBotTarget(g) {
    var best = null;
    for (var k = 0; k < 9; k++) {
      var r = Math.floor(S.r() * 3), i = Math.floor(S.r() * TYPES[r].length);
      var tw = targetWorld(r, i, S.t + 0.55);
      if (S.down[r][i]) continue;
      if (tw.type === 'shutter' && tw.open < 0.55) continue;
      best = { r: r, i: i, p: pointerForTarget(tw.x, tw.y, ROWS[r].z, g, S.wind) };
      if (r === 2 || r === 1) break;
    }
    if (!best) best = { r: 0, i: 2, p: pointerForTarget(0, ROWS[0].y, ROWS[0].z, g, S.wind) };
    return best;
  }

  function botStep(dt, g) {
    var b = S.bot;
    if (!b.aim || S.t > b.retarget || (S.down[b.r] && S.down[b.r][b.i])) {
      b.aim = pickBotTarget(g);
      b.retarget = S.t + 1.05;
    }
    var k = Math.min(1, dt * 9);
    b.px += (b.aim.p.x - b.px) * k;
    b.py += (b.aim.p.y - b.py) * k;
    S.pointer = { x: b.px, y: b.py };
    var dx = Math.abs(b.px - b.aim.p.x), dy = Math.abs(b.py - b.aim.p.y);
    if (S.gun.lever <= 0 && S.t >= b.nextFire && dx < 10 && dy < 12) {
      fire(b.px, b.py);
      b.nextFire = S.t + 0.56;
      b.retarget = S.t + 0.85;
    }
  }

  function gunStep(dt) {
    var p = S.pointer, gun = S.gun, w = env.w, h = env.h;
    var ty = clamp((p.x - w / 2) / w, -0.6, 0.6);
    var tq = clamp((p.y - h * 0.72) / h, -0.6, 0.6);
    gun.vy += (ty * 0.30 - gun.yaw) * 34 * dt;
    gun.vy *= Math.exp(-8 * dt);
    gun.yaw += gun.vy * dt;
    gun.vq += (tq * 0.16 - gun.pitch) * 30 * dt;
    gun.vq *= Math.exp(-9 * dt);
    gun.pitch += gun.vq * dt;
    gun.lever = Math.max(0, gun.lever - dt);
    gun.kick = Math.max(0, gun.kick - dt * 4.2);
  }

  function endRound() {
    S.roundTime = 0;
    if (!S.real) {
      S.round = S.round % 3 + 1;
      resetTargets();
      return;
    }
    var key = 'round' + S.round;
    if (!S.marked[key]) { S.marked[key] = true; Arcade.mark(ID, key); }
    Arcade.score(ID, S.score);
    if (S.round >= 3) { finishRun(); return; }
    S.round++;
    S.bannerT = S.t;
    resetTargets();
    Arcade.toast('Round ' + S.round + ' of 3');
  }

  function finishRun(forced) {
    if (S.finished) return;
    S.finished = true;
    var margin = (S.score - TARGET) / TARGET;
    var stars = margin >= 0.45 ? 3 : (margin >= 0 ? 2 : 1);
    Arcade.score(ID, S.score);
    Arcade.finish({
      score: S.score, stars: stars,
      seconds: Math.round(S.t),
      title: margin >= 0 ? 'You beat the stall' : 'You miss the target',
      lines: ['Score ' + S.score + '  /  target ' + TARGET,
        'Best combo x' + S.bestCombo + (S.hits ? '  /  ' + S.hits + ' hits' : '  /  no hits'),
        forced ? 'You leave the gallery' : 'Vell & Marrow give you bulbs'],
      note: 'gallery'
    });
  }

  function step(dt) {
    if (dt <= 0) return;
    S.t += dt;
    var g = geom();
    var botActive = env.auto || (!env.started && !S.real);
    var clicks = env.input.consumeClicks();
    var keys = env.input;

    if (!env.auto && !hadInput && env.started) {
      hadInput = true;
      freshState(true);
      g = geom();
      S.pointer = { x: env.input.mouse.x, y: env.input.mouse.y };
    }
    if (botActive) botStep(dt, g);
    else {
      var m = env.input.mouse;
      if (m.inside || m.left) S.pointer = toLocal(m.x, m.y);
    }

    if (!botActive) {
      for (var ci = 0; ci < clicks.length; ci++) {
        var c = clicks[ci];
        if (!c.released && !c.right) {
          var p = toLocal(c.x, c.y);
          S.pointer = p;
          fire(p.x, p.y);
        }
      }
      if (keys.justPressed('Space')) fire(S.pointer.x, S.pointer.y);
      if (keys.justPressed('KeyR')) { freshState(true); Arcade.toast('Fresh round'); }
    }

    gunStep(dt);
    for (var i = S.corks.length - 1; i >= 0; i--) if (!stepCork(S.corks[i], dt)) S.corks.splice(i, 1);

    for (var pi = S.parts.length - 1; pi >= 0; pi--) {
      var q = S.parts[pi];
      q.life -= dt;
      q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 300 * dt;
      if (q.life <= 0) S.parts.splice(pi, 1);
    }
    for (var fi = S.floaters.length - 1; fi >= 0; fi--) if (S.t - S.floaters[fi].t > 1.15) S.floaters.splice(fi, 1);
    for (var r = 0; r < 3; r++) for (var j = 0; j < TYPES[r].length; j++) {
      S.spin[r][j] += S.spinV[r][j] * dt;
      S.spinV[r][j] = Math.max(0, S.spinV[r][j] - dt * 3.4);
      var lift = Math.sin(S.t * 0.85 + r * 1.7) > 0.955;
      if (S.down[r][j] && (S.t - S.downT[r][j] > 2.7 || (lift && S.t - S.downT[r][j] > 0.4))) {
        S.down[r][j] = false;
      }
    }
    S.chase = Math.max(0, S.chase - dt);
    S.shownScore += (S.score - S.shownScore) * Math.min(1, dt * 7);
    S.roundTime += dt;
    if (S.roundTime >= S.dur) endRound();
    if (env.auto && !env.frozen && S.t > 45 && !S.finished) finishRun(true);
    if (!env.frozen && Math.floor(S.t / 1.4) !== Math.floor((S.t - dt) / 1.4)) sHum();
  }

  /* ---------------- view transform ---------------- */
  function viewParams() {
    var w = env.w, h = env.h, v = env.view;
    if (v === 'rows' || v === '2') return { k: 1.13, dx: 0, dy: h * 0.06 };
    if (v === 'prizes' || v === '3') return { k: 1.22, dx: -w * 0.10, dy: -h * 0.10 };
    if (v === 'score' || v === '4') return { k: 1.20, dx: w * 0.10, dy: h * 0.10 };
    if (v === 'stall' || v === '1') return { k: 1.06, dx: 0, dy: h * 0.02 };
    return { k: 1, dx: 0, dy: 0 };
  }
  function toLocal(px, py) {
    var vp = viewParams(), w = env.w, h = env.h;
    return { x: (px - w / 2 - vp.dx) / vp.k + w / 2, y: (py - h / 2 - vp.dy) / vp.k + h / 2 };
  }

  /* ---------------- cached art ---------------- */
  function woodBox(c, x, y, w, h, R, dark) {
    var g = G.linear(c, x, y, x + w * 0.25, y + h,
      [[0, dark || '#543424'], [0.35, '#74472c'], [0.7, '#3d251c'], [1, '#24161a']]);
    c.fillStyle = g; c.fillRect(x, y, w, h);
    c.save();
    for (var i = 0; i < 9; i++) {
      var yy = y + R() * h;
      G.paintStroke(c, [[x, yy], [x + w * 0.35, yy - 2 + R() * 5], [x + w, yy + (R() - 0.5) * 6]],
        'rgba(26,14,12,' + (0.10 + R() * 0.14).toFixed(3) + ')', 1 + R() * 3, 100 + i, { passes: 1, jitter: 3, alpha: 0.7 });
    }
    for (var k = 0; k < 14; k++) {
      c.fillStyle = 'rgba(238,214,170,' + (0.05 + R() * 0.09).toFixed(3) + ')';
      c.beginPath(); c.ellipse(x + R() * w, y + R() * h, 1 + R() * 3, 0.6 + R() * 1.4, R() * 3, 0, 6.283); c.fill();
    }
    c.restore();
  }
  function goldLine(c, x1, y1, x2, y2, w, a) {
    c.save();
    c.strokeStyle = 'rgba(20,14,10,.65)'; c.lineWidth = w + 2;
    c.beginPath(); c.moveTo(x1, y1 + 2); c.lineTo(x2, y2 + 2); c.stroke();
    c.strokeStyle = 'rgba(232,161,60,' + (a || 0.9) + ')'; c.lineWidth = w;
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
    c.strokeStyle = 'rgba(255,231,172,.5)'; c.lineWidth = Math.max(0.6, w * 0.3);
    c.beginPath(); c.moveTo(x1, y1 - w * 0.22); c.lineTo(x2, y2 - w * 0.22); c.stroke();
    c.restore();
  }
  function brassRing(c, x, y, r, R) {
    var g = G.radial(c, x - r * 0.3, y - r * 0.35, r * 0.05, x, y, r,
      [[0, '#ffe9b0'], [0.4, P.brass], [0.78, '#8d622c'], [1, '#3d2917']]);
    c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 6.283); c.fill();
    c.strokeStyle = 'rgba(35,22,14,.7)'; c.lineWidth = Math.max(0.8, r * 0.08); c.stroke();
    c.strokeStyle = 'rgba(255,236,180,.35)'; c.lineWidth = Math.max(0.6, r * 0.05);
    c.beginPath(); c.arc(x, y, r * 0.72, 3.4, 5.3); c.stroke();
    for (var k = 0; k < 6; k++) {
      var a = k / 6 * 6.283 + (R ? R() : 0);
      c.fillStyle = 'rgba(60,36,18,.55)';
      c.beginPath(); c.arc(x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55, Math.max(0.6, r * 0.055), 0, 6.283); c.fill();
    }
  }
  function lettering(c, text, x, y, size, align, alpha) {
    var grd = G.linear(c, x - size * 3, y - size, x + size * 3, y,
      [[0, '#f8dfa8'], [0.45, '#e8a13c'], [1, '#a46625']]);
    G.copyText(c, text, x + 2, y + 2, size, 'rgba(18,12,10,.72)', { family: 'Georgia, serif', align: align || 'center', tracking: Math.max(1, size * 0.09) });
    c.save(); c.globalAlpha = alpha === undefined ? 1 : alpha;
    G.copyText(c, text, x, y, size, grd, { family: 'Georgia, serif', align: align || 'center', tracking: Math.max(1, size * 0.09) });
    c.restore();
  }

  function drawSky(c, w, h, R) {
    var g = G.linear(c, 0, 0, 0, h * 0.7,
      [[0, '#101730'], [0.14, '#222c54'], [0.28, '#4a5278'], [0.42, '#6b5770'], [1, '#3b3350']]);
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    var glow = G.radial(c, w * 0.5, h * 0.18, 0, w * 0.5, h * 0.18, w * 0.62,
      [[0, 'rgba(232,161,60,.20)'], [0.5, 'rgba(120,90,110,.08)'], [1, 'rgba(0,0,0,0)']]);
    c.fillStyle = glow; c.fillRect(0, 0, w, h);
    for (var i = 0; i < 46; i++) {
      var x = R() * w, y = h * (0.105 + R() * 0.078), r = 2 + R() * 7;
      var gg = G.radial(c, x, y, 0, x, y, r * 3.2,
        [[0, 'rgba(255,214,140,' + (0.24 + R() * 0.3).toFixed(2) + ')'], [0.35, 'rgba(232,161,60,.14)'], [1, 'rgba(232,161,60,0)']]);
      c.fillStyle = gg; c.beginPath(); c.arc(x, y, r * 3.2, 0, 6.283); c.fill();
      c.fillStyle = 'rgba(255,231,180,.42)'; c.beginPath(); c.arc(x, y, r * 0.35, 0, 6.283); c.fill();
    }
    c.save();
    c.strokeStyle = 'rgba(226,178,104,.18)'; c.lineWidth = Math.max(1, w * 0.0012);
    var cx = w * 0.86, cy = h * 0.155, rr = Math.min(w, h) * 0.070;
    c.beginPath(); c.arc(cx, cy, rr, 3.4, 6.0); c.stroke();
    for (var s = 0; s < 12; s++) {
      var a = s / 12 * 6.283;
      c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); c.stroke();
    }
    c.restore();
    for (var k = 0; k < 12; k++) {
      var bx = R() * w, bh = h * (0.014 + R() * 0.032);
      c.fillStyle = 'rgba(18,22,40,.55)';
      c.beginPath(); c.moveTo(bx - bh * 1.4, h * 0.185); c.lineTo(bx, h * 0.185 - bh); c.lineTo(bx + bh * 1.4, h * 0.185); c.closePath(); c.fill();
    }
    for (var cl = 0; cl < 9; cl++) {
      var yy = h * (0.095 + R() * 0.09);
      G.paintStroke(c, [[R() * w * 0.3, yy], [w * 0.4 + R() * w * 0.2, yy - 5], [w, yy + 4]],
        'rgba(190,190,220,.055)', h * 0.02, 30 + cl, { passes: 2, jitter: h * 0.01 });
    }
  }

  function drawStall(c, w, h, R) {
    var bx = w * 0.085, by = h * 0.185, bw = w * 0.83, bh = h * 0.590;
    var board = G.linear(c, bx, by, bx + bw * 0.2, by + bh,
      [[0, '#36514d'], [0.28, '#2b4544'], [0.6, '#223837'], [1, '#162626']]);
    c.fillStyle = board; c.fillRect(bx, by, bw, bh);
    c.save();
    c.beginPath(); c.rect(bx, by, bw, bh); c.clip();
    for (var v = 0; v < 46; v++) {
      var xx = bx + R() * bw, yy = by + R() * bh;
      G.paintStroke(c, [[xx, yy], [xx + bw * 0.06, yy - 2], [xx + bw * 0.12, yy + 1]],
        'rgba(12,26,26,.09)', 2 + R() * 5, 200 + v, { passes: 1, jitter: 4 });
    }
    for (var d = 0; d < 74; d++) {
      var dx = bx + R() * bw, dy = by + R() * bh, dr = 1.5 + R() * 5;
      c.fillStyle = 'rgba(8,16,18,.42)'; c.beginPath(); c.ellipse(dx, dy, dr, dr * 0.55, R(), 0, 6.283); c.fill();
      c.strokeStyle = 'rgba(210,190,140,.20)'; c.lineWidth = 1;
      c.beginPath(); c.arc(dx, dy, dr, 3.4, 5.9); c.stroke();
    }
    for (var ch = 0; ch < 90; ch++) {
      c.fillStyle = 'rgba(238,220,176,' + (0.05 + R() * 0.13).toFixed(2) + ')';
      c.fillRect(bx + R() * bw, by + R() * bh, 1 + R() * 4, 1 + R() * 2.5);
    }
    c.restore();

    var sx = bx + bw * 0.5, sy = by + h * 0.075;
    c.fillStyle = 'rgba(12,20,26,.38)';
    G.rr(c, sx - bw * 0.30, sy - h * 0.075, bw * 0.60, h * 0.135, h * 0.012); c.fill();
    goldLine(c, sx - bw * 0.30, sy - h * 0.075, sx + bw * 0.30, sy - h * 0.075, Math.max(1.5, h * 0.003));
    goldLine(c, sx - bw * 0.30, sy + h * 0.06, sx + bw * 0.30, sy + h * 0.06, Math.max(1.5, h * 0.003));
    lettering(c, 'VELL & MARROW', sx, sy - h * 0.012, Math.max(11, h * 0.028));
    lettering(c, 'THE CORK GALLERY', sx, sy + h * 0.027, Math.max(14, h * 0.041));
    G.copyText(c, 'THREE ROUNDS  /  ONE SPRING  /  BEAT ' + TARGET,
      sx, sy + h * 0.053, Math.max(8, h * 0.016), 'rgba(246,230,200,.66)',
      { family: 'Georgia, serif', align: 'center', tracking: 2 });

    goldLine(c, bx, by, bx + bw, by, Math.max(2, h * 0.005));
    goldLine(c, bx, by + bh, bx + bw, by + bh, Math.max(2, h * 0.005));
    goldLine(c, bx, by, bx, by + bh, Math.max(2, h * 0.004));
    goldLine(c, bx + bw, by, bx + bw, by + bh, Math.max(2, h * 0.004));
    for (var p = 0; p < 3; p++) {
      var rowY = proj({ w: w, h: h, f: Math.max(w * 0.70, h * 1.15), hz: h * 0.40, camY: 1.65 },
        0, ROWS[2 - p].y, ROWS[2 - p].z).y;
      goldLine(c, bx + bw * 0.03, rowY + h * 0.07, bx + bw * 0.97, rowY + h * 0.07, 1, 0.28);
    }

    var px = bx + bw * 0.015, py = by + h * 0.018;
    woodBox(c, px, py, bw * 0.215, h * 0.135, R, '#5c3c26');
    G.copyText(c, 'BEST OF THE DAY', px + bw * 0.107, py + h * 0.026, Math.max(8, h * 0.017),
      P.cream, { family: 'Georgia, serif', align: 'center', tracking: 1 });
    var names = ['V. Ash', 'M. Pell', 'D. Roo'];
    var nums = [1460, 1210, 980];
    for (var n = 0; n < 3; n++) {
      G.copyText(c, (n + 1) + '  ' + names[n], px + bw * 0.025, py + h * (0.055 + n * 0.026),
        Math.max(8, h * 0.017), 'rgba(246,230,200,.8)', { family: 'Georgia, serif' });
      G.copyText(c, '' + nums[n], px + bw * 0.19, py + h * (0.055 + n * 0.026),
        Math.max(8, h * 0.017), P.gold, { family: 'Georgia, serif', align: 'right' });
    }
    brassRing(c, px + bw * 0.012, py + h * 0.012, Math.max(3, h * 0.006), R);

    var cx0 = bx + bw * 0.755, cy0 = by + h * 0.018, cw0 = bw * 0.23, ch0 = h * 0.115;
    woodBox(c, cx0, cy0, cw0, ch0, R, '#4c2d20');
    c.fillStyle = 'rgba(12,10,14,.85)';
    G.rr(c, cx0 + cw0 * 0.05, cy0 + ch0 * 0.28, cw0 * 0.90, ch0 * 0.52, 2); c.fill();
    G.copyText(c, 'SCORE', cx0 + cw0 * 0.5, cy0 + ch0 * 0.22, Math.max(8, h * 0.016),
      P.gold, { family: 'Georgia, serif', align: 'center', tracking: 2 });
    for (var dg = 0; dg < 5; dg++) {
      var dx0 = cx0 + cw0 * (0.075 + dg * 0.18);
      c.fillStyle = 'rgba(240,224,189,.07)';
      c.fillRect(dx0, cy0 + ch0 * 0.30, cw0 * 0.155, ch0 * 0.48);
      c.strokeStyle = 'rgba(0,0,0,.55)'; c.lineWidth = 1;
      c.beginPath(); c.moveTo(dx0, cy0 + ch0 * 0.54); c.lineTo(dx0 + cw0 * 0.155, cy0 + ch0 * 0.54); c.stroke();
    }

    var ah = h * 0.098;
    c.save();
    c.beginPath(); c.moveTo(0, 0); c.lineTo(w, 0); c.lineTo(w, ah * 0.78); c.lineTo(0, ah * 0.78); c.closePath();
    c.clip();
    var stripes = 16;
    for (var s2 = 0; s2 < stripes; s2++) {
      c.fillStyle = s2 % 2 ? '#e8d6ac' : '#a8463f';
      c.beginPath();
      c.moveTo(w * s2 / stripes, 0); c.lineTo(w * (s2 + 1) / stripes, 0);
      c.lineTo(w * (s2 + 1) / stripes + w * 0.012, ah * 0.9); c.lineTo(w * s2 / stripes + w * 0.012, ah * 0.9);
      c.closePath(); c.fill();
      c.fillStyle = 'rgba(30,18,20,.14)';
      c.fillRect(w * s2 / stripes + w * 0.006, 0, w * 0.004, ah);
    }
    var sh = G.linear(c, 0, 0, 0, ah, [[0, 'rgba(0,0,0,.30)'], [0.55, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.35)']]);
    c.fillStyle = sh; c.fillRect(0, 0, w, ah);
    for (var st = 0; st < 22; st++) {
      G.paintStroke(c, [[R() * w, 0], [R() * w, ah * 0.4]], 'rgba(255,246,220,.05)', 3 + R() * 6, 500 + st, { passes: 1 });
    }
    c.restore();
    c.fillStyle = '#7d2f2c';
    c.beginPath();
    c.moveTo(0, ah * 0.75);
    for (var sc = 0; sc <= stripes; sc++) {
      var xx2 = w * sc / stripes;
      c.quadraticCurveTo(xx2 - w / stripes * 0.5, ah * 1.10, xx2, ah * 0.75);
    }
    c.lineTo(w, ah * 0.62); c.lineTo(0, ah * 0.62); c.closePath(); c.fill();
    goldLine(c, 0, ah * 0.62, w, ah * 0.62, Math.max(1.5, h * 0.0035));

    c.strokeStyle = 'rgba(18,16,20,.8)'; c.lineWidth = Math.max(1, h * 0.0022);
    c.beginPath(); c.moveTo(0, ah * 0.22);
    for (var fw = 0; fw <= 24; fw++) {
      var u = fw / 24;
      c.lineTo(w * u, ah * (0.22 + Math.sin(u * Math.PI * 3.0) * 0.30 + u * 0.02));
    }
    c.stroke();

    var pw = w * 0.085;
    woodBox(c, 0, 0, pw, h * 0.88, R, '#4d2e1f');
    woodBox(c, w - pw, 0, pw, h * 0.88, R, '#4d2e1f');
    for (var side = 0; side < 2; side++) {
      var px2 = side ? w - pw : 0;
      c.save();
      c.beginPath(); c.rect(px2, 0, pw, h * 0.88); c.clip();
      for (var carve = 0; carve < 5; carve++) {
        var yy3 = h * (0.12 + carve * 0.15);
        c.strokeStyle = 'rgba(246,220,170,.16)'; c.lineWidth = Math.max(1, h * 0.0025);
        c.beginPath(); c.moveTo(px2 + pw * 0.18, yy3);
        c.bezierCurveTo(px2 + pw * 0.8, yy3 - h * 0.01, px2 + pw * 0.2, yy3 + h * 0.02, px2 + pw * 0.85, yy3 + h * 0.01);
        c.stroke();
      }
      for (var col = 0; col < 5; col++) {
        var cyc = h * (0.10 + col * 0.17);
        c.fillStyle = G.linear(c, px2 + pw * 0.05, 0, px2 + pw * 0.95, 0,
          [[0, '#6b4124'], [0.5, '#f3d18a'], [1, '#6b4124']]);
        c.fillRect(px2 + pw * 0.04, cyc, pw * 0.92, h * 0.009);
      }
      c.restore();
    }

    for (var sp = 0; sp < 3; sp++) {
      var sY = proj({ w: w, h: h, f: Math.max(w * 0.70, h * 1.15), hz: h * 0.40, camY: 1.65 },
        0, ROWS[sp].y, ROWS[sp].z).y + h * (0.075 - sp * 0.004);
      brassRing(c, bx + bw * 0.035, sY, h * 0.022, R);
      brassRing(c, bx + bw * 0.965, sY, h * 0.022, R);
    }

    var shY = h * 0.715;
    woodBox(c, bx, shY, bw, h * 0.10, R, '#3f271d');
    c.fillStyle = G.linear(c, 0, shY, 0, shY + h * 0.10,
      [[0, 'rgba(255,230,180,.12)'], [0.4, 'rgba(180,210,220,.05)'], [1, 'rgba(0,0,0,.35)']]);
    c.fillRect(bx, shY, bw, h * 0.10);
    goldLine(c, bx, shY, bx + bw, shY, Math.max(1.5, h * 0.0035));
    goldLine(c, bx, shY + h * 0.10, bx + bw, shY + h * 0.10, Math.max(1.5, h * 0.0035));
    for (var pr = 0; pr < 8; pr++) {
      var tx = bx + bw * (0.10 + pr * 0.112), ty = shY + h * 0.058;
      c.save(); c.translate(tx, ty);
      c.fillStyle = 'rgba(0,0,0,.3)';
      c.beginPath(); c.ellipse(0, h * 0.026, h * 0.020, h * 0.006, 0, 0, 6.283); c.fill();
      if (pr % 3 === 0) {
        c.fillStyle = '#a8463f'; c.beginPath(); c.arc(0, 0, h * 0.018, 0, 6.283); c.fill();
        c.strokeStyle = '#f0dfbb'; c.lineWidth = 1.5;
        c.beginPath(); c.arc(0, 0, h * 0.011, 0, 6.283); c.stroke();
      } else if (pr % 3 === 1) {
        c.fillStyle = '#3d6a63'; c.beginPath();
        c.moveTo(0, -h * 0.022); c.lineTo(h * 0.014, h * 0.014); c.lineTo(-h * 0.014, h * 0.014); c.closePath(); c.fill();
      } else {
        c.fillStyle = '#d9b0c0'; c.beginPath(); c.ellipse(0, 0, h * 0.015, h * 0.021, 0.4, 0, 6.283); c.fill();
      }
      c.restore();
    }

    var cY = h * 0.815;
    woodBox(c, 0, cY, w, h - cY, R, '#4a2c1e');
    c.fillStyle = G.linear(c, 0, cY, 0, h,
      [[0, 'rgba(255,224,170,.16)'], [0.15, 'rgba(0,0,0,0)'], [1, 'rgba(10,8,12,.6)']]);
    c.fillRect(0, cY, w, h - cY);
    goldLine(c, 0, cY, w, cY, Math.max(2, h * 0.005));
    for (var pl = 1; pl < 4; pl++) {
      c.strokeStyle = 'rgba(20,12,10,.35)'; c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(0, cY + (h - cY) * pl / 4); c.lineTo(w, cY + (h - cY) * pl / 4); c.stroke();
    }
    for (var cork = 0; cork < 26; cork++) {
      var ddx = R() * w, ddy = cY + R() * (h - cY);
      c.fillStyle = 'rgba(14,10,10,.32)';
      c.beginPath(); c.ellipse(ddx, ddy, 1 + R() * 3, 0.8 + R() * 1.5, R() * 3, 0, 6.283); c.fill();
    }
  }

  function buildCache(w, h) {
    var R = Arcade.rng(env.seed * 7 + 331);
    var sky = G.offscreen(Math.max(2, w | 0), Math.max(2, h | 0), function (c, cw, ch) { drawSky(c, cw, ch, R); });
    var stall = G.offscreen(Math.max(2, w | 0), Math.max(2, h | 0), function (c, cw, ch) { drawStall(c, cw, ch, R); });
    var glow = G.offscreen(128, 128, function (c) {
      var gg = c.createRadialGradient(64, 64, 0, 64, 64, 64);
      gg.addColorStop(0, 'rgba(255,238,190,.95)');
      gg.addColorStop(0.22, 'rgba(255,205,120,.55)');
      gg.addColorStop(0.6, 'rgba(226,140,55,.13)');
      gg.addColorStop(1, 'rgba(226,140,55,0)');
      c.fillStyle = gg; c.fillRect(0, 0, 128, 128);
    });
    var bulbs = [], R2 = Arcade.rng(env.seed + 991);
    var nTop = 20, nSide = 9, nBot = 16;
    for (var i = 0; i < nTop; i++) bulbs.push({ x: w * 0.095 + w * 0.81 * i / (nTop - 1), y: h * 0.148, k: 'frame' });
    for (var j = 0; j < nSide; j++) {
      var yy = h * (0.18 + j * 0.062);
      bulbs.push({ x: w * 0.098, y: yy, k: 'frame' });
      bulbs.push({ x: w * 0.902, y: yy, k: 'frame' });
    }
    for (var b = 0; b < nBot; b++) bulbs.push({ x: w * 0.10 + w * 0.80 * b / (nBot - 1), y: h * 0.805, k: 'frame' });
    for (var f2 = 0; f2 < 22; f2++) {
      var u = f2 / 21;
      bulbs.push({ x: w * 0.03 + w * 0.94 * u,
        y: h * (0.030 + Math.sin(u * Math.PI * 3.0) * 0.038), k: 'festoon' });
    }
    var prizes = [];
    for (var q = 0; q < 8; q++) prizes.push({ x: w * (0.085 + 0.83 * (0.10 + q * 0.112)), y: h * 0.735 });
    var moths = [];
    for (var m = 0; m < 9; m++) {
      moths.push({ b: Math.floor(R2() * Math.min(bulbs.length, 42)), ph: R2() * 6.28, sp: 0.6 + R2() * 1.2, rad: 8 + R2() * 18 });
    }
    cache = { w: w, h: h, sky: sky, stall: stall, glow: glow, bulbs: bulbs, prizes: prizes, moths: moths };
  }

  function bulb(c, x, y, r, lit, glass) {
    c.save();
    c.globalCompositeOperation = 'lighter';
    c.globalAlpha = 0.16 + 0.72 * clamp(lit, 0, 1);
    c.drawImage(cache.glow, x - r * 3.4, y - r * 3.4, r * 6.8, r * 6.8);
    c.restore();
    c.save();
    c.fillStyle = G.radial(c, x - r * 0.3, y - r * 0.4, 0, x, y, r,
      [[0, lit > 0.25 ? '#fff6d8' : '#c6bda0'], [0.45, lit > 0.25 ? P.gold : '#7d746a'], [1, '#4a3427']]);
    c.globalAlpha = 0.55 + 0.45 * clamp(lit, 0, 1);
    c.beginPath(); c.arc(x, y, r, 0, 6.283); c.fill();
    c.globalAlpha = 0.18 + 0.7 * clamp(lit, 0, 1);
    c.strokeStyle = glass || '#fff2c8'; c.lineWidth = Math.max(0.7, r * 0.16);
    c.beginPath(); c.moveTo(x - r * 0.35, y + r * 0.12);
    c.quadraticCurveTo(x, y - r * 0.18, x + r * 0.32, y + r * 0.10); c.stroke();
    c.restore();
    c.fillStyle = 'rgba(30,22,18,.75)'; c.fillRect(x - r * 0.45, y + r * 0.85, r * 0.9, r * 0.55);
  }

  function drawBulbs(c, g) {
    var t = S.t, bs = cache.bulbs, chase = S.chase > 0;
    var head = Math.floor(t * 17);
    for (var i = 0; i < bs.length; i++) {
      var b = bs[i];
      var flick = 0.62 + 0.24 * Math.sin(t * 3.1 + i * 1.7);
      if (chase) {
        var d = ((i - head) % bs.length + bs.length) % bs.length;
        if (d < 4) flick = 1.15 - d * 0.12;
      }
      var r = Math.max(2.4, g.h * (b.k === 'festoon' ? 0.0072 : 0.0062));
      bulb(c, b.x, b.y, r, flick);
    }
    var litCount = Math.floor(clamp(S.score / TARGET, 0, 1) * cache.prizes.length);
    for (var p = 0; p < cache.prizes.length; p++) {
      var q = cache.prizes[p];
      var on = p < litCount;
      bulb(c, q.x, q.y, Math.max(2.5, g.h * 0.008), on ? 0.9 + 0.1 * Math.sin(t * 4 + p) : 0.12);
    }
  }

  function drawMoths(c, g) {
    var t = S.t;
    for (var i = 0; i < cache.moths.length; i++) {
      var m = cache.moths[i], b = cache.bulbs[m.b];
      if (!b) continue;
      var a = t * m.sp + m.ph;
      var x = b.x + Math.cos(a) * m.rad, y = b.y + Math.sin(a * 1.3) * m.rad * 0.6;
      var f = Math.sin(t * 24 + m.ph) > 0 ? 1 : 0.45;
      c.save(); c.translate(x, y); c.rotate(a);
      c.fillStyle = 'rgba(240,226,196,.42)';
      c.beginPath(); c.ellipse(-2.2, 0, 2.6, 1.5 * f, -0.5, 0, 6.283); c.fill();
      c.beginPath(); c.ellipse(2.2, 0, 2.6, 1.5 * f, 0.5, 0, 6.283); c.fill();
      c.restore();
    }
  }

  function drawMechanism(c, g) {
    var t = S.t;
    for (var r = 0; r < 3; r++) {
      var row = ROWS[r], s = g.f / row.z;
      var y = proj(g, 0, row.y, row.z).y + row.size * 0.62 * s;
      var x0 = g.w * 0.10, x1 = g.w * 0.90;
      c.strokeStyle = 'rgba(20,16,18,.75)'; c.lineWidth = Math.max(1.5, g.h * 0.004);
      c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
      var stepPx = Math.max(7, g.w * 0.009);
      var off = ((t * 26 + r * 11) % stepPx);
      for (var x = x0 + off; x < x1; x += stepPx) {
        c.save(); c.translate(x, y); c.rotate(t * 0.9 + x * 0.003);
        c.strokeStyle = 'rgba(201,154,76,.85)'; c.lineWidth = Math.max(1, g.h * 0.0022);
        c.beginPath(); c.ellipse(0, 0, stepPx * 0.32, Math.max(1.8, g.h * 0.0045), 0, 0, 6.283); c.stroke();
        c.restore();
      }
      for (var e = 0; e < 2; e++) {
        var sx = e ? x1 : x0, sr = Math.max(8, g.h * 0.022);
        c.save(); c.translate(sx, y); c.rotate(t * (e ? -0.8 : 0.8));
        c.fillStyle = '#8d622c';
        c.beginPath(); c.arc(0, 0, sr, 0, 6.283); c.fill();
        c.fillStyle = '#c99a4c';
        for (var k = 0; k < 10; k++) {
          var aa = k / 10 * 6.283;
          c.save(); c.rotate(aa); c.fillRect(sr * 0.86, -sr * 0.12, sr * 0.35, sr * 0.24); c.restore();
        }
        c.fillStyle = '#43301d'; c.beginPath(); c.arc(0, 0, sr * 0.35, 0, 6.283); c.fill();
        c.fillStyle = '#f6dc9d'; c.beginPath(); c.arc(-sr * 0.12, -sr * 0.12, sr * 0.12, 0, 6.283); c.fill();
        c.restore();
      }
      var cam = Math.sin(t * 0.85 + r * 1.7);
      var cy = y + Math.max(5, g.h * 0.012) * (0.4 - cam * 0.6);
      c.fillStyle = G.linear(c, 0, cy - 3, 0, cy + 5, [[0, '#f1d18a'], [0.5, '#9d6c30'], [1, '#3d2817']]);
      c.fillRect(x0, cy, x1 - x0, Math.max(3, g.h * 0.007));
      for (var cm = 0; cm < TYPES[r].length; cm++) {
        var xx = x0 + (x1 - x0) * (cm + 0.5) / TYPES[r].length;
        c.fillStyle = '#c99a4c';
        c.beginPath(); c.ellipse(xx, cy - g.h * 0.004, g.w * 0.007, g.h * 0.006, 0, 0, 6.283); c.fill();
      }
      var wx = x1 + g.w * 0.012, wy = y + Math.sin(t * 0.85 + r * 1.7) * g.h * 0.02;
      c.strokeStyle = 'rgba(201,154,76,.7)'; c.lineWidth = 2;
      c.beginPath(); c.moveTo(x1, y); c.lineTo(wx, wy); c.stroke();
      c.fillStyle = '#8d622c'; c.fillRect(wx - 4, wy, 8, g.h * 0.02);
    }
  }

  function drawPlate(c, R, type, rot, open) {
    var pg = G.linear(c, -R, -R, R * 0.4, R,
      [[0, '#f6e8c8'], [0.42, '#d7bd8d'], [0.8, '#927042'], [1, '#5c402b']]);
    c.fillStyle = 'rgba(6,10,12,.42)';
    c.beginPath(); c.ellipse(0, R * 1.06, R * 0.92, R * 0.15, 0, 0, 6.283); c.fill();
    c.fillStyle = pg;
    c.beginPath();
    c.moveTo(-R * 0.86, R * 0.82);
    c.lineTo(-R, -R * 0.55); c.quadraticCurveTo(0, -R * 1.12, R, -R * 0.55);
    c.lineTo(R * 0.86, R * 0.82); c.quadraticCurveTo(0, R * 1.02, -R * 0.86, R * 0.82);
    c.fill();
    c.strokeStyle = 'rgba(53,33,22,.75)'; c.lineWidth = Math.max(1, R * 0.07); c.stroke();
    c.strokeStyle = 'rgba(255,240,205,.55)'; c.lineWidth = Math.max(0.7, R * 0.035);
    c.beginPath(); c.moveTo(-R * 0.75, -R * 0.55); c.quadraticCurveTo(0, -R * 0.92, R * 0.75, -R * 0.55); c.stroke();
    for (var i = 0; i < 4; i++) {
      var a = i / 4 * 6.283 + 0.6;
      c.fillStyle = '#8d622c';
      c.beginPath(); c.arc(Math.cos(a) * R * 0.78, Math.sin(a) * R * 0.74 + R * 0.1, Math.max(1, R * 0.055), 0, 6.283); c.fill();
    }
    function crescent() {
      c.fillStyle = G.radial(c, -R * 0.2, -R * 0.3, R * 0.05, 0, 0, R * 0.8,
        [[0, '#fff6d8'], [0.6, '#e8c879'], [1, '#a87733']]);
      c.beginPath();
      c.arc(0, 0, R * 0.66, 0.6, 5.68);
      c.arc(R * 0.28, -R * 0.06, R * 0.55, 5.2, 0.9, true);
      c.closePath(); c.fill();
      c.strokeStyle = 'rgba(96,62,25,.55)'; c.lineWidth = 1; c.stroke();
      c.fillStyle = 'rgba(150,110,50,.35)';
      c.beginPath(); c.arc(-R * 0.36, -R * 0.18, R * 0.09, 0, 6.283); c.fill();
    }
    function star() {
      c.fillStyle = G.linear(c, 0, -R * 0.7, 0, R * 0.7, [[0, '#ffe9a8'], [0.5, '#e8a13c'], [1, '#a05e26']]);
      c.beginPath();
      for (var q = 0; q < 10; q++) {
        var ra = q % 2 ? R * 0.31 : R * 0.70, aa = -1.57 + q * 0.628;
        var xx = Math.cos(aa) * ra, yy = Math.sin(aa) * ra;
        if (!q) c.moveTo(xx, yy); else c.lineTo(xx, yy);
      }
      c.closePath(); c.fill();
      c.strokeStyle = 'rgba(88,52,20,.6)'; c.lineWidth = Math.max(1, R * 0.05); c.stroke();
    }
    if (type === 'moon') crescent();
    else if (type === 'star') star();
    else if (type === 'teapot') {
      c.fillStyle = G.radial(c, -R * 0.2, -R * 0.3, R * 0.05, 0, 0, R * 0.7,
        [[0, '#f2a08e'], [0.55, '#b74b43'], [1, '#6e2829']]);
      c.beginPath(); c.ellipse(0, R * 0.12, R * 0.5, R * 0.4, 0, 0, 6.283); c.fill();
      c.beginPath(); c.moveTo(R * 0.42, -R * 0.05); c.quadraticCurveTo(R * 0.85, -R * 0.25, R * 0.72, R * 0.35);
      c.lineTo(R * 0.5, R * 0.3); c.quadraticCurveTo(R * 0.6, -R * 0.08, R * 0.32, R * 0.06); c.closePath(); c.fill();
      c.strokeStyle = '#b74b43'; c.lineWidth = Math.max(2, R * 0.13);
      c.beginPath(); c.arc(-R * 0.52, R * 0.06, R * 0.23, -1.2, 1.2); c.stroke();
      c.fillStyle = '#f0dfbb'; c.beginPath(); c.ellipse(0, -R * 0.28, R * 0.30, R * 0.08, 0, 0, 6.283); c.fill();
      c.fillStyle = '#e8a13c'; c.beginPath(); c.arc(0, -R * 0.38, R * 0.07, 0, 6.283); c.fill();
      c.strokeStyle = 'rgba(255,235,210,.55)'; c.lineWidth = Math.max(1, R * 0.05);
      c.beginPath(); c.arc(-R * 0.12, R * 0.02, R * 0.3, 3.5, 4.6); c.stroke();
    } else if (type === 'bottle') {
      c.fillStyle = G.linear(c, -R * 0.4, 0, R * 0.4, 0,
        [[0, '#1d4a43'], [0.35, '#4d8c7a'], [0.6, '#2c6157'], [1, '#153a36']]);
      c.beginPath();
      c.moveTo(-R * 0.16, -R * 0.66); c.lineTo(-R * 0.16, -R * 0.23);
      c.quadraticCurveTo(-R * 0.5, -R * 0.05, -R * 0.42, R * 0.62);
      c.quadraticCurveTo(0, R * 0.78, R * 0.42, R * 0.62);
      c.quadraticCurveTo(R * 0.5, -R * 0.05, R * 0.16, -R * 0.23);
      c.lineTo(R * 0.16, -R * 0.66); c.closePath(); c.fill();
      c.strokeStyle = 'rgba(10,30,28,.7)'; c.lineWidth = Math.max(1, R * 0.05); c.stroke();
      c.fillStyle = '#e0c08a'; c.fillRect(-R * 0.19, -R * 0.73, R * 0.38, R * 0.12);
      c.fillStyle = 'rgba(230,255,245,.55)'; c.fillRect(-R * 0.28, -R * 0.02, R * 0.08, R * 0.48);
      c.fillStyle = '#f0dfbb'; c.fillRect(-R * 0.3, R * 0.12, R * 0.6, R * 0.22);
      c.fillStyle = '#a8463f'; c.fillRect(-R * 0.22, R * 0.16, R * 0.44, R * 0.05);
    } else if (type === 'pipe') {
      c.save(); c.rotate(-0.28);
      c.fillStyle = G.linear(c, 0, -R * 0.4, 0, R * 0.6, [[0, '#e2b77b'], [0.6, '#a66b3a'], [1, '#5f3a22']]);
      c.beginPath(); c.ellipse(-R * 0.42, -R * 0.18, R * 0.24, R * 0.34, 0.2, 0, 6.283); c.fill();
      c.strokeStyle = '#8b5a38'; c.lineWidth = Math.max(3, R * 0.16); c.lineCap = 'round';
      c.beginPath(); c.moveTo(-R * 0.30, R * 0.03); c.quadraticCurveTo(R * 0.2, R * 0.35, R * 0.74, R * 0.48); c.stroke();
      c.fillStyle = '#2e2622'; c.fillRect(R * 0.65, R * 0.40, R * 0.22, R * 0.16);
      c.strokeStyle = 'rgba(255,235,200,.5)'; c.lineWidth = Math.max(1, R * 0.04);
      c.beginPath(); c.moveTo(-R * 0.5, -R * 0.34); c.arc(-R * 0.42, -R * 0.18, R * 0.12, 3.6, 5.1); c.stroke();
      c.restore();
    } else if (type === 'bell') {
      c.fillStyle = '#a8463f'; c.beginPath(); c.arc(0, 0, R * 0.72, 0, 6.283); c.fill();
      c.fillStyle = '#f0dfbb'; c.beginPath(); c.arc(0, 0, R * 0.54, 0, 6.283); c.fill();
      c.fillStyle = '#a8463f'; c.beginPath(); c.arc(0, 0, R * 0.36, 0, 6.283); c.fill();
      c.fillStyle = '#e8a13c'; c.beginPath(); c.arc(0, 0, R * 0.18, 0, 6.283); c.fill();
      c.strokeStyle = 'rgba(60,32,22,.5)'; c.lineWidth = Math.max(1, R * 0.04);
      for (var rr = 1; rr <= 3; rr++) { c.beginPath(); c.arc(0, 0, R * (0.18 + rr * 0.18), 0, 6.283); c.stroke(); }
      c.fillStyle = '#f6e6c8';
      c.beginPath(); c.arc(0, R * 0.02, R * 0.055, 0, 6.283); c.fill();
      c.strokeStyle = '#e8a13c'; c.lineWidth = Math.max(1, R * 0.05);
      c.beginPath(); c.moveTo(-R * 0.1, -R * 0.62); c.quadraticCurveTo(0, -R * 0.78, R * 0.1, -R * 0.62); c.stroke();
    } else if (type === 'spinner') {
      c.save(); c.rotate(rot);
      for (var k = 0; k < 8; k++) {
        c.fillStyle = k % 2 ? '#a8463f' : '#f0dfbb';
        c.beginPath(); c.moveTo(0, 0);
        c.arc(0, 0, R * 0.65, k * 0.785, (k + 1) * 0.785); c.closePath(); c.fill();
      }
      c.restore();
      c.strokeStyle = '#8d622c'; c.lineWidth = Math.max(1, R * 0.06);
      c.beginPath(); c.arc(0, 0, R * 0.65, 0, 6.283); c.stroke();
      c.fillStyle = '#e8a13c'; c.beginPath(); c.arc(0, 0, R * 0.12, 0, 6.283); c.fill();
    } else if (type === 'pendulum') {
      c.strokeStyle = '#c99a4c'; c.lineWidth = Math.max(1, R * 0.07);
      c.beginPath(); c.moveTo(0, -R * 0.95); c.lineTo(Math.sin(rot) * R * 0.4, 0); c.stroke();
      c.save(); c.translate(Math.sin(rot) * R * 0.4, 0);
      c.fillStyle = G.radial(c, -R * 0.15, -R * 0.15, 0, 0, 0, R * 0.5,
        [[0, '#f6e6c8'], [0.6, '#3d6a63'], [1, '#1b3b3a']]);
      c.beginPath(); c.arc(0, 0, R * 0.42, 0, 6.283); c.fill();
      c.strokeStyle = '#e8a13c'; c.lineWidth = Math.max(1, R * 0.06);
      c.beginPath(); c.arc(0, 0, R * 0.27, 0, 6.283); c.stroke();
      c.restore();
    } else if (type === 'shutter') {
      star();
      c.fillStyle = G.linear(c, -R, 0, R, 0, [[0, '#3d2817'], [0.5, '#8b5a38'], [1, '#3d2817']]);
      var gap = R * 0.72 * open;
      c.fillRect(-R * 0.78, -R * 0.78, R * 0.78 - gap, R * 1.56);
      c.fillRect(gap, -R * 0.78, R * 0.78 - gap, R * 1.56);
      c.strokeStyle = '#e8a13c'; c.lineWidth = Math.max(0.8, R * 0.04);
      c.beginPath(); c.moveTo(-R * 0.78, 0); c.lineTo(-gap, 0); c.moveTo(gap, 0); c.lineTo(R * 0.78, 0); c.stroke();
    } else if (type === 'travel') {
      crescent();
      c.fillStyle = '#c99a4c';
      c.beginPath(); c.arc(-R * 0.42, R * 0.92, R * 0.12, 0, 6.283); c.fill();
      c.beginPath(); c.arc(R * 0.42, R * 0.92, R * 0.12, 0, 6.283); c.fill();
    }
    c.fillStyle = '#8d622c'; c.fillRect(-R * 0.24, R * 0.82, R * 0.48, R * 0.14);
    c.strokeStyle = 'rgba(255,230,175,.5)'; c.lineWidth = Math.max(0.7, R * 0.03);
    c.beginPath(); c.moveTo(-R * 0.24, R * 0.86); c.lineTo(R * 0.24, R * 0.86); c.stroke();
  }

  function aimedRow(g) {
    var py = S.pointer.y, best = 0, bd = 1e9;
    for (var r = 0; r < 3; r++) {
      var y = proj(g, 0, ROWS[r].y, ROWS[r].z).y;
      var d = Math.abs(py - y);
      if (d < bd) { bd = d; best = r; }
    }
    return best;
  }

  function drawFocus(c, g) {
    var r = aimedRow(g), s = proj(g, 0, ROWS[r].y, ROWS[r].z);
    c.save(); c.globalCompositeOperation = 'lighter';
    c.globalAlpha = 0.22;
    c.drawImage(cache.glow, s.x - g.w * 0.48, s.y - g.h * 0.24, g.w * 0.96, g.h * 0.48);
    c.restore();
    c.save();
    c.fillStyle = 'rgba(8,10,22,.24)';
    for (var k = 0; k < 3; k++) {
      if (k === r) continue;
      var yy = proj(g, 0, ROWS[k].y, ROWS[k].z).y;
      c.fillRect(g.w * 0.09, yy - g.h * 0.085, g.w * 0.82, g.h * 0.17);
    }
    c.restore();
    c.fillStyle = 'rgba(12,10,14,.6)';
    c.fillRect(g.w * 0.073, g.h * 0.20, g.w * 0.010, g.h * 0.55);
    var ry = g.h * (0.20 + r * 0.22) + Math.sin(S.t * 6) * 1.5;
    c.fillStyle = P.brassHi;
    c.fillRect(g.w * 0.068, ry, g.w * 0.020, g.h * 0.012);
    c.strokeStyle = 'rgba(0,0,0,.6)'; c.lineWidth = 1;
    c.strokeRect(g.w * 0.068, ry, g.w * 0.020, g.h * 0.012);
  }

  function drawRow(c, g, r) {
    var focused = aimedRow(g) === r;
    c.save();
    c.globalAlpha = focused ? 1 : 0.84;
    var s = g.f / ROWS[r].z;
    for (var i = 0; i < TYPES[r].length; i++) {
      var tw = targetWorld(r, i, S.t), sp = proj(g, tw.x, tw.y, ROWS[r].z);
      var R = tw.s * 0.5 * s;
      var downAge = S.down[r][i] ? S.t - S.downT[r][i] : 0;
      var fall = S.down[r][i] ? s01(downAge / 0.22) : 0;
      c.save();
      c.translate(sp.x, sp.y + R * 0.85 * fall);
      c.rotate(-1.25 * fall + tw.rot * 0.07);
      c.scale(1, 1 - 0.28 * fall);
      drawPlate(c, R, tw.type, tw.rot, tw.open);
      c.restore();
    }
    c.restore();
  }

  function drawCork(c, g, cork) {
    var s = g.f / Math.max(0.5, cork.z), p = proj(g, cork.x, cork.y, cork.z);
    var r = Math.max(1.6, 0.058 * s * 0.5);
    for (var i = 0; i < cork.trail.length; i++) {
      var tp = proj(g, cork.trail[i].x, cork.trail[i].y, cork.trail[i].z);
      c.save(); c.globalAlpha = 0.04 + i * 0.035;
      c.fillStyle = P.cream; c.beginPath(); c.arc(tp.x, tp.y, r * (0.4 + i * 0.09), 0, 6.283); c.fill(); c.restore();
    }
    c.save(); c.translate(p.x, p.y); c.rotate(cork.spin);
    var cg = G.linear(c, -r, -r, r, r, [[0, '#e8c894'], [0.5, '#b78450'], [1, '#6d4528']]);
    c.fillStyle = cg;
    c.beginPath();
    c.moveTo(-r * 0.78, -r); c.lineTo(r * 0.78, -r); c.lineTo(r, r); c.lineTo(-r, r); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(50,30,18,.7)'; c.lineWidth = Math.max(0.5, r * 0.13); c.stroke();
    c.fillStyle = 'rgba(255,236,196,.8)';
    c.beginPath(); c.ellipse(0, -r, r * 0.78, r * 0.32, 0, 0, 6.283); c.fill();
    c.restore();
  }

  function drawRest(c, g) {
    for (var i = 0; i < S.rest.length; i++) {
      var q = S.rest[i], p = proj(g, q.x, q.y, q.z), r = Math.max(1.3, 0.05 * p.s);
      c.save(); c.translate(p.x, p.y); c.rotate(q.rot);
      c.fillStyle = 'rgba(8,8,14,.4)'; c.beginPath(); c.ellipse(1, r * 0.8, r * 1.2, r * 0.4, 0, 0, 6.283); c.fill();
      c.fillStyle = '#a87845'; c.fillRect(-r, -r * 0.6, r * 2, r * 1.2);
      c.fillStyle = 'rgba(240,214,166,.7)'; c.fillRect(-r, -r * 0.6, r * 2, r * 0.3);
      c.restore();
    }
  }

  function drawCounter(c, g) {
    var bx = g.w * 0.085, bw = g.w * 0.83;
    var cx0 = bx + bw * 0.755, cy0 = g.h * 0.185 + g.h * 0.018, cw0 = bw * 0.23, ch0 = g.h * 0.115;
    var str = String(Math.max(0, Math.round(Math.min(99999, S.shownScore))));
    while (str.length < 5) str = '0' + str;
    var flip = clamp(1 - (S.t - S.flipT) / 0.34, 0, 1);
    for (var d = 0; d < 5; d++) {
      var x = cx0 + cw0 * (0.075 + d * 0.18), y = cy0 + ch0 * 0.32;
      var wgt = cw0 * 0.155, hgt = ch0 * 0.44;
      c.save(); c.translate(x + wgt / 2, y + hgt / 2);
      c.scale(1, 1 - 0.9 * flip);
      G.copyText(c, str.charAt(d), 0, hgt * 0.36, hgt * 0.82, P.cream,
        { family: 'Georgia, serif', align: 'center', weight: 'bold' });
      c.restore();
      c.strokeStyle = 'rgba(0,0,0,.7)'; c.lineWidth = 1;
      c.beginPath(); c.moveTo(x, y + hgt / 2); c.lineTo(x + wgt, y + hgt / 2); c.stroke();
    }
    var dx = g.w * 0.935, dy = g.h * 0.875;
    var rad = Math.max(9, g.h * 0.022);
    c.fillStyle = 'rgba(20,14,16,.55)'; c.beginPath(); c.arc(dx, dy, rad * 1.15, 0, 6.283); c.fill();
    brassRing(c, dx, dy, rad, null);
    var frac = clamp(S.roundTime / S.dur, 0, 1);
    c.strokeStyle = P.red; c.lineWidth = Math.max(1.5, rad * 0.13);
    c.beginPath(); c.moveTo(dx, dy);
    c.lineTo(dx + Math.sin(frac * 6.283) * rad * 0.72, dy - Math.cos(frac * 6.283) * rad * 0.72); c.stroke();
    G.copyText(c, 'ROUND ' + S.round, dx, dy - rad * 1.6, Math.max(9, g.h * 0.018), P.cream,
      { family: 'Georgia, serif', align: 'center', tracking: 2 });
  }

  function drawParticles(c, g) {
    for (var i = 0; i < S.parts.length; i++) {
      var p = S.parts[i];
      c.save(); c.globalAlpha = clamp(p.life * 1.4, 0, 1);
      c.fillStyle = p.col; c.beginPath(); c.arc(p.x, p.y, p.r, 0, 6.283); c.fill(); c.restore();
    }
    for (var j = 0; j < S.floaters.length; j++) {
      var f = S.floaters[j], age = S.t - f.t;
      c.save(); c.globalAlpha = clamp(1 - age / 1.15, 0, 1);
      G.copyText(c, f.text, f.x, f.y - age * 34, Math.max(11, g.h * 0.022), P.gold,
        { family: 'Georgia, serif', align: 'center', weight: 'bold' });
      c.restore();
    }
  }

  function drawGhost(c, g) {
    var p = S.pointer;
    var v = velocityFromPointer(p.x, p.y, g, S.wind);
    var y0 = launchY(g);
    c.save();
    for (var k = 1; k <= 17; k++) {
      var tau = k * 0.055;
      var z = Z0 + VZ * tau;
      var x = v.vx * tau + 0.5 * S.wind * tau * tau;
      var y = y0 + v.vy * tau - 0.5 * GRAV * tau * tau;
      if (z > BOARD || y < -1) break;
      var sp = proj(g, x, y, z);
      c.globalAlpha = 0.24 * (1 - k / 19);
      c.fillStyle = P.cream;
      c.beginPath(); c.arc(sp.x, sp.y, Math.max(1, g.h * 0.0025), 0, 6.283); c.fill();
    }
    c.globalAlpha = 0.75;
    c.strokeStyle = 'rgba(246,230,200,.7)'; c.lineWidth = 1;
    c.beginPath(); c.arc(p.x, p.y, Math.max(5, g.h * 0.012), 0, 6.283); c.stroke();
    c.beginPath(); c.moveTo(p.x - 9, p.y); c.lineTo(p.x - 4, p.y);
    c.moveTo(p.x + 4, p.y); c.lineTo(p.x + 9, p.y);
    c.moveTo(p.x, p.y - 9); c.lineTo(p.x, p.y - 4);
    c.moveTo(p.x, p.y + 4); c.lineTo(p.x, p.y + 9); c.stroke();
    var crossing = (ZREF - Z0) / VZ;
    var cy = y0 + v.vy * crossing - 0.5 * GRAV * crossing * crossing;
    var cxp = v.vx * crossing + 0.5 * S.wind * crossing * crossing;
    var land = proj(g, cxp, cy, ZREF);
    c.globalAlpha = 0.55;
    c.strokeStyle = P.gold; c.lineWidth = 1.5;
    c.beginPath(); c.arc(land.x, land.y, Math.max(4, g.h * 0.010), 0, 6.283); c.stroke();
    c.restore();
  }

  function drawGun(c, g) {
    var m = proj(g, 0, launchY(g), Z0);
    var w = g.w, h = g.h;
    var bw = clamp(w * 0.05, 18, 68);
    var L = Math.max(58, (h * 1.02 - m.y) / 1.85);
    var sway = Math.sin(S.t * 1.15) * w * 0.002;
    c.save();
    c.translate(m.x + sway + S.gun.yaw * w * 0.05, m.y + S.gun.kick * h * 0.022);
    c.rotate(S.gun.yaw * 0.22 + S.gun.pitch * 0.10);
    c.fillStyle = 'rgba(4,4,10,.35)';
    c.beginPath(); c.ellipse(0, L * 1.4, bw * 1.9, h * 0.025, 0, 0, 6.283); c.fill();
    var wg = G.linear(c, -bw * 1.5, 0, bw * 1.5, 0,
      [[0, '#2b160f'], [0.18, '#7d4a2a'], [0.42, '#c08a4d'], [0.62, '#754222'], [1, '#25140f']]);
    c.fillStyle = wg;
    c.beginPath();
    c.moveTo(-bw * 0.62, L * 0.52);
    c.bezierCurveTo(-bw * 1.35, L * 0.72, -bw * 1.05, L * 1.7, -bw * 0.45, L * 1.85);
    c.lineTo(bw * 0.45, L * 1.85);
    c.bezierCurveTo(bw * 1.05, L * 1.7, bw * 1.35, L * 0.72, bw * 0.62, L * 0.52);
    c.closePath(); c.fill();
    c.strokeStyle = 'rgba(25,12,8,.75)'; c.lineWidth = 2; c.stroke();
    for (var ring = 0; ring < 6; ring++) {
      var yy = L * (0.68 + ring * 0.19);
      c.strokeStyle = ring % 2 ? 'rgba(255,220,160,.20)' : 'rgba(35,18,12,.35)';
      c.lineWidth = Math.max(1, bw * 0.06);
      c.beginPath();
      c.moveTo(-bw * (1.05 - ring * 0.06), yy); c.quadraticCurveTo(0, yy + bw * 0.16, bw * (1.05 - ring * 0.06), yy);
      c.stroke();
    }
    var bg = G.linear(c, -bw * 0.55, 0, bw * 0.55, 0,
      [[0, '#4d3319'], [0.2, '#b2823c'], [0.42, '#ffe6a4'], [0.6, '#c99a4c'], [0.85, '#6e4820'], [1, '#33210f']]);
    c.fillStyle = bg;
    c.beginPath();
    c.moveTo(-bw * 0.55, L * 0.66); c.lineTo(-bw * 0.55, -bw * 0.15);
    c.quadraticCurveTo(0, -bw * 0.55, bw * 0.55, -bw * 0.15);
    c.lineTo(bw * 0.55, L * 0.66); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(40,24,10,.8)'; c.lineWidth = 1.5; c.stroke();
    for (var k = 0; k < 4; k++) {
      var ry = L * (0.12 + k * 0.16);
      c.fillStyle = 'rgba(255,232,168,.35)'; c.fillRect(-bw * 0.55, ry, bw * 1.1, Math.max(1, bw * 0.035));
      c.fillStyle = 'rgba(50,30,12,.4)'; c.fillRect(-bw * 0.55, ry + bw * 0.045, bw * 1.1, Math.max(1, bw * 0.025));
    }
    c.fillStyle = '#2a1a10';
    c.beginPath(); c.ellipse(0, -bw * 0.2, bw * 0.55, bw * 0.20, 0, 0, 6.283); c.fill();
    c.strokeStyle = '#e8c07a'; c.lineWidth = Math.max(1, bw * 0.075);
    c.beginPath(); c.ellipse(0, -bw * 0.2, bw * 0.55, bw * 0.20, 0, 0, 6.283); c.stroke();
    c.fillStyle = '#0d0a0a';
    c.beginPath(); c.ellipse(0, -bw * 0.2, bw * 0.34, bw * 0.11, 0, 0, 6.283); c.fill();
    c.strokeStyle = '#e8c07a'; c.lineWidth = Math.max(1, bw * 0.06);
    c.beginPath(); c.moveTo(0, -bw * 0.4); c.lineTo(0, -bw * 0.85); c.stroke();
    c.fillStyle = '#f6dc9d'; c.beginPath(); c.arc(0, -bw * 0.9, Math.max(1.5, bw * 0.09), 0, 6.283); c.fill();
    var lv = 1 - S.gun.lever / 0.52;
    c.save(); c.translate(bw * 0.72, L * 0.72); c.rotate(-0.5 + lv * 0.85);
    c.fillStyle = '#8d622c'; c.fillRect(-bw * 0.06, 0, bw * 0.16, L * 0.42);
    c.fillStyle = '#f6dc9d'; c.fillRect(-bw * 0.08, L * 0.38, bw * 0.20, L * 0.05);
    c.restore();
    c.fillStyle = '#c99a4c'; c.beginPath(); c.arc(bw * 0.72, L * 0.7, Math.max(3, bw * 0.14), 0, 6.283); c.fill();
    c.strokeStyle = '#6e4820'; c.lineWidth = Math.max(2, bw * 0.12);
    c.beginPath(); c.arc(0, L * 0.66, bw * 0.45, 0.2, 2.9); c.stroke();
    c.restore();
    if (S.gun.kick > 0.55) {
      c.save(); c.globalCompositeOperation = 'lighter';
      c.globalAlpha = (S.gun.kick - 0.55) * 1.6;
      c.drawImage(cache.glow, m.x - bw * 2.2, m.y - bw * 2.2, bw * 4.4, bw * 4.4);
      c.restore();
    }
  }

  function drawHUD(c, g) {
    var x = g.w * 0.022, y = g.h * 0.955;
    var lines = [
      'ROUND ' + S.round + ' OF 3   /   BEAT ' + TARGET,
      'COMBO x' + Math.max(1, S.combo) + (S.chase > 0 ? '   /   FAR ROW: HIGHER SCORE' : '')
    ];
    for (var i = 0; i < lines.length; i++) {
      G.copyText(c, lines[i], x, y - (1 - i) * g.h * 0.022, Math.max(9, g.h * 0.016),
        'rgba(246,230,200,.85)', { family: 'Georgia, serif', tracking: 1.5 });
    }
    if (S.t - S.bannerT < 2.2 && S.real) {
      c.save(); c.globalAlpha = clamp((2.2 - (S.t - S.bannerT)) / 0.6, 0, 1);
      G.copyText(c, 'ROUND ' + S.round, g.w / 2, g.h * 0.30, Math.max(20, g.h * 0.055), P.gold,
        { family: 'Georgia, serif', align: 'center', tracking: 6 });
      c.restore();
    }
  }

  function draw(ctx) {
    var g = geom();
    ctx.save();
    ctx.fillStyle = '#141830'; ctx.fillRect(-g.w, -g.h, g.w * 3, g.h * 3);
    ctx.drawImage(cache.sky, 0, 0, g.w, g.h);
    ctx.drawImage(cache.stall, 0, 0, g.w, g.h);
    drawFocus(ctx, g);
    drawMechanism(ctx, g);

    var items = [];
    for (var r = 0; r < 3; r++) items.push({ z: ROWS[r].z, row: r, cork: null });
    for (var i = 0; i < S.corks.length; i++) items.push({ z: S.corks[i].z, row: -1, cork: S.corks[i] });
    items.sort(function (a, b) { return b.z - a.z; });
    for (var k = 0; k < items.length; k++) {
      if (items[k].row >= 0) drawRow(ctx, g, items[k].row);
      else drawCork(ctx, g, items[k].cork);
    }
    drawRest(ctx, g);
    drawBulbs(ctx, g);
    drawMoths(ctx, g);
    drawCounter(ctx, g);
    drawParticles(ctx, g);
    drawGhost(ctx, g);
    drawGun(ctx, g);
    drawHUD(ctx, g);
    G.grain(ctx, g.w, g.h, 0.045);
    G.vignette(ctx, g.w, g.h, 0.38);
    ctx.restore();
  }

  function onFrame(ctx) {
    var w = env.w, h = env.h;
    if (!cache || cache.w !== w || cache.h !== h) buildCache(w, h);
    if (bootFrame) {
      bootFrame = false;
      freshState(!!(env.auto || env.state === 'end') && !env.frozen);
      if (env.state === 'end') {
        hadInput = true;
        S.frozenDone = true;
        finishRun(false);
      }
    }
    if (env.frozen) {
      if (!S.frozenDone) {
        var n = Math.min(5400, Math.max(0, Math.floor(env.t * 60)));
        for (var f = 0; f < n; f++) step(1 / 60);
        S.frozenDone = true;
      }
    } else step(env.dt);

    var vp = viewParams();
    ctx.save();
    ctx.translate(w / 2 + vp.dx, h / 2 + vp.dy);
    ctx.scale(vp.k, vp.k);
    ctx.translate(-w / 2, -h / 2);
    draw(ctx);
    ctx.restore();
  }

  var env = Arcade.boot({
    id: ID,
    title: 'The cork gallery',
    hint: 'Move the pointer to aim. Click to fire. Aim higher for the far row.',
    background: '#22253f',
    ink: '#f6e6c8',
    onFrame: onFrame
  });
})();
