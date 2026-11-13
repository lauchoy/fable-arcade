(function () {
  'use strict';

  var ID = 'fast-lens';
  var G = Arcade.gfx;
  var cl = Arcade.clamp, lp = Arcade.lerp, sm = Arcade.smooth;
  var MONO = '"IBM Plex Mono", ui-monospace, Menlo, monospace';
  var P = {
    bg: '#0e1012', ink: '#e8e4dc', amber: '#d8a14a', cool: '#7fb0c4',
    green: '#8fc9a4', magenta: '#c887a6', brass: '#a97c3e',
    slate: '#15191d', steel: '#2a3137', white: '#dfd8c9'
  };
  var TAU = Math.PI * 2;

  /* Seven elements in six groups: surface list (z, signed radius, n before,
     n after, clear semi-aperture). Group three is a cemented doublet, so its
     middle surface is glass to glass. The first two groups ride the helicoid. */
  var SURF = [
    { z: 0.00, r: 0.868, n1: 1, n2: 1.52, ca: 0.300, front: 1 },
    { z: 0.10, r: 3.640, n1: 1.52, n2: 1, ca: 0.300, front: 1 },
    { z: 0.19, r: 1.190, n1: 1, n2: 1.52, ca: 0.290, front: 1 },
    { z: 0.27, r: 3.640, n1: 1.52, n2: 1, ca: 0.280, front: 1 },
    { z: 0.38, r: 1.820, n1: 1, n2: 1.62, ca: 0.270 },
    { z: 0.44, r: -2.660, n1: 1.62, n2: 1.52, ca: 0.260 },
    { z: 0.48, r: -3.360, n1: 1.52, n2: 1, ca: 0.260 },
    { z: 0.61, r: -3.360, n1: 1, n2: 1.52, ca: 0.260 },
    { z: 0.67, r: 2.660, n1: 1.52, n2: 1, ca: 0.270 },
    { z: 0.76, r: -1.820, n1: 1, n2: 1.52, ca: 0.280 },
    { z: 0.84, r: -3.640, n1: 1.52, n2: 1, ca: 0.290 },
    { z: 0.91, r: -5.600, n1: 1, n2: 1.52, ca: 0.300 },
    { z: 0.99, r: -1.330, n1: 1.52, n2: 1, ca: 0.300 }
  ];
  var ELEMENTS = [[0, 1], [2, 3], [4, 5], [5, 6], [7, 8], [9, 10], [11, 12]];
  var IRIS_Z = 0.555, FILM_Z = 1.238, MARK_R = 0.014, FAN_Y = 0.25, RAYS = 13;

  var st = {
    inited: false, ap: 0.10, focus: 0.18, yaw: 0, pitch: 0,
    view: 1, cut: false, cutAt: null, cutBase: 0, urlView: 0,
    draggingRing: false, dragOrbit: false,
    lastDetent: -1, marks: {}, finished: false, lastFlash: -1
  };

  var E = Arcade.boot({
    id: ID,
    title: 'The fast lens',
    hint: 'Drag to orbit the lens. Press A or S to set the iris. Press F to set focus. Press X to cut the barrel. Press 1 to 4 to set the view.',
    background: P.bg, ink: P.ink,
    onFrame: onFrame
  });

  var VIEWS = { hero: 1, axis: 2, section: 3, cutaway: 3, macro: 4, detail: 4 };
  function viewParam(v) {
    if (VIEWS[v]) return VIEWS[v];
    var n = parseInt(v, 10);
    return (n >= 1 && n <= 4) ? n : 0;
  }
  st.urlView = viewParam(E.view);
  if (st.urlView) st.view = st.urlView;
  if (E.state === 'section' || E.state === 'cutaway') { st.view = 3; st.cut = true; }
  if (E.state === 'axis') st.view = 2;
  if (E.state === 'macro') st.view = 4;
  if (st.view === 3) { st.cut = true; st.cutAt = -100; }

  /* ---------------- cached textures ---------------- */
  var rnd = Arcade.rng(42917);
  var slateTile = G.offscreen(512, 512, function (g, w, h) {
    var r = Arcade.rng(8813);
    g.fillStyle = '#171b1f'; g.fillRect(0, 0, w, h);
    var i, x, y;
    for (i = 0; i < 140; i++) {
      x = r() * w; y = r() * h;
      g.strokeStyle = 'rgba(150,168,178,' + (0.012 + r() * 0.025).toFixed(3) + ')';
      g.lineWidth = 0.5 + r() * 1.5;
      g.beginPath(); g.moveTo(x, y);
      g.bezierCurveTo(x + 18 + r() * 70, y - 5, x + 60 + r() * 100, y + 8, x + 110 + r() * 150, y + r() * 6);
      g.stroke();
    }
    for (i = 0; i < 9000; i++) {
      x = r() * w; y = r() * h;
      g.fillStyle = r() > 0.5 ? 'rgba(205,215,220,0.035)' : 'rgba(0,0,0,0.055)';
      g.fillRect(x, y, 1, 1);
    }
  });
  var knurlTile = G.offscreen(256, 160, function (g, w, h) {
    g.fillStyle = '#171a1c'; g.fillRect(0, 0, w, h);
    for (var x = 0; x < w; x += 8) {
      var lg = g.createLinearGradient(x, 0, x + 8, 0);
      lg.addColorStop(0, 'rgba(0,0,0,0.55)');
      lg.addColorStop(0.42, 'rgba(96,104,108,0.30)');
      lg.addColorStop(0.65, 'rgba(190,196,192,0.12)');
      lg.addColorStop(1, 'rgba(0,0,0,0.60)');
      g.fillStyle = lg; g.fillRect(x, 0, 8, h);
      g.fillStyle = 'rgba(0,0,0,0.17)'; g.fillRect(x + 3.5, 0, 1, h);
    }
    g.strokeStyle = 'rgba(8,10,11,0.22)'; g.lineWidth = 1;
    for (var y = 3; y < h; y += 9) {
      g.beginPath(); g.moveTo(0, y);
      for (var xx = 0; xx <= w; xx += 8) g.lineTo(xx, y + ((xx / 8) % 2 ? 4 : -3));
      g.stroke();
    }
  });
  var hatchTile = G.offscreen(72, 72, function (g, w, h) {
    g.clearRect(0, 0, w, h);
    g.strokeStyle = 'rgba(205,213,216,0.20)'; g.lineWidth = 1;
    for (var i = -h; i < w + h; i += 8) {
      g.beginPath(); g.moveTo(i, 0); g.lineTo(i + h, h); g.stroke();
    }
    g.strokeStyle = 'rgba(0,0,0,0.22)';
    for (i = -h; i < w + h; i += 8) {
      g.beginPath(); g.moveTo(i + 2, 0); g.lineTo(i + h + 2, h); g.stroke();
    }
  });
  var dust = [];
  for (var di = 0; di < 46; di++) {
    dust.push({ u: rnd() * 2 - 1, v: rnd() * 2 - 1, r: 0.4 + rnd() * 1.8, a: 0.12 + rnd() * 0.42 });
  }
  var patterns = { slate: null, hatch: null };

  function T(ctx, s, x, y, size, color, o) {
    G.copyText(ctx, s, x, y, size, color, o || { family: MONO });
  }
  function rgba(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  /* ---------------- optics: real Snell's law at circular surfaces -------- */
  function surfZ(s, i, focus, y) {
    var z0 = s.z - (i < 4 ? focus * 0.20 : 0);
    var c = z0 + s.r;
    var q = Math.sqrt(Math.max(0, s.r * s.r - y * y));
    return c - (s.r > 0 ? q : -q);
  }
  function apertureRadius(ap) { return 0.030 + (1 - ap) * 0.225; }

  function refract(dx, dy, nx, ny, eta) {
    if (nx * dx + ny * dy > 0) { nx = -nx; ny = -ny; }
    var ci = -(nx * dx + ny * dy);
    var k = 1 - eta * eta * (1 - ci * ci);
    if (k < 0) return null;
    var f = eta * ci - Math.sqrt(k);
    var rx = eta * dx + f * nx, ry = eta * dy + f * ny;
    var l = Math.hypot(rx, ry) || 1;
    return [rx / l, ry / l];
  }

  function traceRay(y, focus, ap) {
    var pz = -0.35, py = y, dx = 1, dy = 0;
    var pts = [[pz, py]], rad = apertureRadius(ap);
    var i, s, z0, cx, R2, b, c, disc, sq, t0, t1, ts, hit, best, k, qz, qy, nx, ny, nl, u;
    for (i = 0; i < SURF.length; i++) {
      s = SURF[i];
      z0 = s.z - (i < 4 ? focus * 0.20 : 0);
      if (IRIS_Z > pz + 1e-6 && IRIS_Z <= z0 + 1e-6 && dx > 1e-6) {
        var ti = (IRIS_Z - pz) / dx;
        if (ti > 1e-6) {
          var yi = py + ti * dy;
          if (Math.abs(yi) > rad) {
            pts.push([IRIS_Z, yi]);
            return { pts: pts, blocked: true, stop: [IRIS_Z, yi] };
          }
        }
      }
      cx = z0 + s.r; R2 = s.r * s.r;
      b = (pz - cx) * dx + py * dy;
      c = (pz - cx) * (pz - cx) + py * py - R2;
      disc = b * b - c;
      if (disc < 0) return { pts: pts, blocked: true, fail: 1 };
      sq = Math.sqrt(disc);
      t0 = -b - sq; t1 = -b + sq;
      ts = [t0, t1].filter(function (t) { return t > 1e-6; }).sort(function (a, b2) { return a - b2; });
      if (!ts.length) return { pts: pts, blocked: true, fail: 1 };
      best = null;
      for (k = 0; k < ts.length; k++) {
        qz = pz + ts[k] * dx; qy = py + ts[k] * dy;
        if (Math.abs(qy) <= s.ca + 0.002 && (!best || ts[k] < best[0])) best = [ts[k], qz, qy];
      }
      if (!best) return { pts: pts, blocked: true, fail: 1 };
      pz = best[1]; py = best[2]; pts.push([pz, py]);
      nx = (cx - pz) / s.r; ny = -py / s.r;
      nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl;
      u = refract(dx, dy, nx, ny, s.n1 / s.n2);
      if (!u) return { pts: pts, blocked: true, fail: 1 };
      dx = u[0]; dy = u[1];
    }
    var filmY = py + (FILM_Z - pz) * dy / dx;
    var beyond = py + (FILM_Z + 0.075 - pz) * dy / dx;
    pts.push([FILM_Z, filmY], [FILM_Z + 0.075, beyond]);
    var zc = Math.abs(dy) > 1e-6 ? pz + (-py / dy) * dx : 99;
    return { pts: pts, blocked: false, filmY: filmY, zc: zc, dy: dy, dx: dx };
  }

  function optics(focus, ap) {
    var rays = [], ys = [], zs = [], blocked = 0, i, y, r;
    for (i = 0; i < RAYS; i++) {
      y = -FAN_Y + 2 * FAN_Y * i / (RAYS - 1);
      r = traceRay(y, focus, ap);
      rays.push(r);
      if (r.blocked) blocked++;
      else {
        ys.push(r.filmY);
        if (r.zc < 90) zs.push(r.zc);
      }
    }
    var mean = 0, j;
    for (j = 0; j < ys.length; j++) mean += ys[j];
    mean /= (ys.length || 1);
    var blur = 0;
    for (j = 0; j < ys.length; j++) blur = Math.max(blur, Math.abs(ys[j] - mean));
    var zmean = 0;
    for (j = 0; j < zs.length; j++) zmean += zs[j];
    zmean /= (zs.length || 1);
    var inside = blur <= MARK_R && Math.abs(zmean - FILM_Z) <= 0.035 && ys.length >= 3 && blocked >= 3;
    return { rays: rays, blocked: blocked, live: ys.length, blur: blur, zmean: zmean, inside: inside, mean: mean };
  }

  /* ---------------- interaction ---------------- */
  function cutAmount(t) {
    if (st.cutAt !== null) return cl((t - st.cutAt) / 0.8, 0, 1);
    return st.cutBase;
  }
  function setCut(t, on, animate) {
    st.cut = on;
    if (on) { st.cutAt = animate ? t : -100; st.cutBase = 1; }
    else { st.cutAt = null; st.cutBase = 0; }
  }
  function init() {
    if (st.inited) return;
    st.inited = true;
    var v = viewParam(E.view);
    if (v) st.view = v;
    if (E.state === 'section' || E.state === 'cutaway' || st.view === 3) {
      st.view = 3; st.cut = true; st.cutAt = -100; st.cutBase = 1;
    }
    st.lastDetent = Math.round(st.ap * 9);
  }
  function bot(t) {
    if (t < 2.6) {
      st.view = st.urlView || 1;
      st.ap = 0.16 + 0.30 * (0.5 + 0.5 * Math.sin(t * 0.9));
      st.focus = 0.16;
      st.yaw = 0.30 * Math.sin(t * 0.5);
    } else if (t < 4.8) {
      st.view = 2;
      st.ap = lp(0.18, 0.86, sm(2.6, 4.8, t));
      st.focus = 0.16;
    } else if (t < 7.4) {
      st.view = 2;
      st.ap = 0.78;
      st.focus = lp(0.16, 0.50, sm(4.8, 7.4, t));
    } else if (t < 9.2) {
      st.view = 1; st.ap = 0.78; st.focus = 0.50;
      st.yaw = 0.24 * Math.sin(t * 0.7);
    } else {
      st.view = 3; st.ap = 0.78; st.focus = 0.50;
      if (st.cutAt !== 9.2) st.cutAt = 9.2;
      st.cut = true; st.cutBase = 1;
    }
  }
  function attract(t) {
    st.view = st.urlView || 1;
    st.ap = 0.14 + 0.31 * (0.5 + 0.5 * Math.sin(t * 0.42));
    st.focus = 0.44 + 0.06 * Math.sin(t * 0.19);
    st.yaw = 0.32 * Math.sin(t * 0.20);
    st.pitch = 0.02 * Math.sin(t * 0.13);
  }

  function update(env) {
    init();
    var inp = env.input, t = env.t, dt = env.frozen ? 0 : env.dt;
    var manual = !env.auto && env.started;
    if (env.auto) bot(t);
    else if (!manual) attract(t);
    else {
      var i, n;
      for (i = 1; i <= 4; i++) {
        if (inp.justPressed('Digit' + i) || inp.justPressed('Numpad' + i)) {
          st.view = i;
          if (i === 3) setCut(t, true, true);
          else if (st.cut) setCut(t, false, false);
        }
      }
      if (inp.justPressed('KeyX')) {
        setCut(t, !st.cut, true);
        if (st.cut) st.view = 3;
      }
      if (inp.justPressed('KeyA')) st.ap = cl(st.ap + 0.10, 0, 1);
      if (inp.justPressed('KeyS')) st.ap = cl(st.ap - 0.10, 0, 1);
      if (inp.justPressed('KeyF')) st.focus = (st.focus + 0.09) % 1;
      if (inp.isDown('KeyA')) st.ap = cl(st.ap + dt * 0.32, 0, 1);
      if (inp.isDown('KeyS')) st.ap = cl(st.ap - dt * 0.32, 0, 1);
      if (inp.isDown('KeyF')) st.focus = (st.focus + dt * 0.16) % 1;
      var wheel = inp.consumeWheel();
      if (wheel) st.ap = cl(st.ap - Math.sign(wheel) * 0.05, 0, 1);
      var look = inp.consumeLook();
      var clicks = inp.consumeClicks();
      for (i = 0; i < clicks.length; i++) {
        var c = clicks[i];
        if (c.released) { st.draggingRing = false; st.dragOrbit = false; continue; }
        st.dragOrbit = true;
        if (c.y > env.h * 0.52 && c.y < env.h * 0.76 && !c.right) st.draggingRing = true;
      }
      var dx = inp.mouse.dragX, dy = inp.mouse.dragY;
      if (inp.mouse.left) {
        if (st.draggingRing) st.ap = cl(st.ap + dx * 0.004, 0, 1);
        else { st.yaw += dx * 0.006; st.pitch = cl(st.pitch + dy * 0.0024, -0.13, 0.20); }
      }
      if (look.x || look.y) { st.yaw += look.x * 0.006; st.pitch = cl(st.pitch + look.y * 0.0024, -0.13, 0.20); }
    }
    st.ap = cl(st.ap, 0, 1);
    st.focus = cl(st.focus, 0, 1);
    return manual || env.auto;
  }

  function progress(env, op) {
    var live = env.started || env.auto;
    if (!live) return;
    if (st.ap >= 0.62 && !st.marks.aperture) { st.marks.aperture = 1; Arcade.mark(ID, 'aperture-set'); }
    if (Math.abs(st.focus - 0.5) < 0.15 && !st.marks.focus) { st.marks.focus = 1; Arcade.mark(ID, 'focus-set'); }
    if (st.cut && !st.marks.section) { st.marks.section = 1; Arcade.mark(ID, 'section-cut'); }
    if (env.auto && env.t < 9.6) return;
    if (op.inside && !st.finished) {
      st.finished = true;
      var stars = (op.blur < 0.004 && Math.abs(op.zmean - FILM_Z) < 0.012) ? 3 :
                  (op.blur < 0.008 && Math.abs(op.zmean - FILM_Z) < 0.022) ? 2 : 1;
      var score = 900 + Math.round((1 - cl(op.blur / MARK_R, 0, 1)) * 500) + stars * 180;
      Arcade.score(ID, score);
      Arcade.finish({
        score: score, stars: stars,
        title: 'You set focus',
        lines: ['Spot spans ' + (op.blur * 1000).toFixed(1) + ' micron.',
                (RAYS - op.blocked) + ' of ' + RAYS + ' rays pass the iris.',
                'ORVELL Lumen 50 bench card'],
        seconds: Math.round(env.t)
      });
    }
    var det = Math.round(st.ap * 9);
    if (det !== st.lastDetent) {
      st.lastDetent = det;
      Arcade.sound.noise({ dur: 0.045, gain: 0.045, freq: 2600 });
      Arcade.sound.tone({ freq: 520 + det * 28, dur: 0.055, gain: 0.035, type: 'triangle' });
    }
  }

  /* ---------------- slate / studio ---------------- */
  function layout(w, h) {
    var narrow = w < 620;
    var base = h * (narrow ? 0.76 : 0.80);
    var R = Math.min(w * (narrow ? 0.315 : 0.275), h * 0.295);
    var HH = Math.min(h * 0.55, R * (narrow ? 3.30 : 2.62));
    return {
      w: w, h: h, cx: w * 0.5, base: base, R: R, HH: HH,
      top: base - HH, ry: R * (0.235 + st.pitch)
    };
  }
  var slateCache = null;
  function drawSlate(ctx, env, L) {
    var w = env.w, h = env.h;
    var key = w + 'x' + h + '|' + L.R.toFixed(2) + '|' + L.base.toFixed(2);
    if (!slateCache || slateCache.key !== key) {
      var art = G.offscreen(Math.ceil(w), Math.ceil(h), function (g, cw, ch) {
        var lg = g.createLinearGradient(0, 0, 0, ch);
        lg.addColorStop(0, '#171c20'); lg.addColorStop(0.46, '#101316'); lg.addColorStop(1, '#07090b');
        g.fillStyle = lg; g.fillRect(0, 0, cw, ch);
        var pool = g.createRadialGradient(cw * 0.42, ch * 0.55, 0, cw * 0.42, ch * 0.55, Math.max(cw, ch) * 0.72);
        pool.addColorStop(0, 'rgba(83,103,116,0.16)');
        pool.addColorStop(0.45, 'rgba(45,55,62,0.07)');
        pool.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = pool; g.fillRect(0, 0, cw, ch);
        g.save(); g.globalAlpha = 0.32;
        g.fillStyle = g.createPattern(slateTile, 'repeat'); g.fillRect(0, 0, cw, ch); g.restore();
        var soft = g.createRadialGradient(L.cx - L.R * 0.65, L.base - L.HH * 0.7, 0,
          L.cx - L.R * 0.65, L.base - L.HH * 0.7, L.R * 3.2);
        soft.addColorStop(0, 'rgba(213,225,232,0.09)'); soft.addColorStop(1, 'rgba(213,225,232,0)');
        g.fillStyle = soft; g.fillRect(0, 0, cw, ch);
      });
      slateCache = { key: key, art: art };
    }
    ctx.drawImage(slateCache.art, 0, 0, w, h);
  }
  function contact(ctx, L) {
    ctx.save();
    ctx.fillStyle = G.radial(ctx, L.cx, L.base + 6, L.R * 0.12, L.cx, L.base + 6, L.R * 1.85,
      [[0, 'rgba(0,0,0,0.74)'], [0.42, 'rgba(0,0,0,0.32)'], [1, 'rgba(0,0,0,0)']]);
    ctx.beginPath(); ctx.ellipse(L.cx, L.base + 7, L.R * 1.35, L.R * 0.38, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }

  /* ---------------- iris ---------------- */
  function openingRadius(theta, ap) {
    var sector = TAU / 9;
    var m = ((theta % sector) + sector) % sector - sector * 0.5;
    var r0 = 0.17 + (1 - ap) * 0.70;
    var rp = r0 * 0.94 / Math.cos(m);
    return lp(r0, rp, ap);
  }
  function irisPath(ctx, cx, cy, R, ry, ap, rot) {
    ctx.beginPath();
    var n = 108, i, a, r;
    for (i = 0; i <= n; i++) {
      a = TAU * i / n; r = openingRadius(a + rot, ap) + 0.013 * ap;
      var x = cx + Math.cos(a) * R * r, y = cy + Math.sin(a) * ry * r;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }
  function drawIris(ctx, cx, cy, R, ry, ap, rot, scale) {
    scale = scale || 1;
    ctx.save();
    ctx.beginPath(); ctx.ellipse(cx, cy, R, ry, 0, 0, TAU); ctx.clip();
    var well = ctx.createRadialGradient(cx - R * 0.16, cy - ry * 0.18, R * 0.03, cx, cy, R * 1.1);
    well.addColorStop(0, '#182b33'); well.addColorStop(0.55, '#0b151b'); well.addColorStop(1, '#030709');
    ctx.fillStyle = well; ctx.fillRect(cx - R, cy - ry, R * 2, ry * 2);
    var sector = TAU / 9, j, k, a0, a1, a, r, x, y;
    for (j = 0; j < 9; j++) {
      a0 = rot + j * sector - sector * 0.22;
      a1 = rot + (j + 1) * sector + sector * 0.22;
      ctx.beginPath();
      for (k = 0; k <= 12; k++) {
        a = lp(a0, a1, k / 12); r = 1.08;
        x = cx + Math.cos(a) * R * r; y = cy + Math.sin(a) * ry * r;
        if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      for (k = 12; k >= 0; k--) {
        a = lp(a0, a1, k / 12);
        r = openingRadius(a, ap) + 0.016 * Math.sin(Math.PI * k / 12) + 0.004;
        x = cx + Math.cos(a) * R * r; y = cy + Math.sin(a) * ry * r;
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      var bg = ctx.createLinearGradient(cx - R, cy - ry, cx + R, cy + ry);
      bg.addColorStop(0, 'rgba(52,60,63,0.96)');
      bg.addColorStop(0.52, 'rgba(35,41,44,0.97)');
      bg.addColorStop(1, 'rgba(40,46,48,0.94)');
      ctx.fillStyle = bg; ctx.fill();
      ctx.beginPath();
      for (k = 0; k <= 12; k++) {
        a = lp(a0, a1, k / 12);
        r = openingRadius(a, ap) + 0.016 * Math.sin(Math.PI * k / 12) + 0.004;
        x = cx + Math.cos(a) * R * r; y = cy + Math.sin(a) * ry * r;
        if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(212,220,222,0.48)'; ctx.lineWidth = Math.max(0.6, 1.05 * scale); ctx.stroke();
    }
    /* the opening: dark, with the far side of the set inverted inside */
    irisPath(ctx, cx, cy, R, ry, ap, rot);
    ctx.fillStyle = '#05090c'; ctx.fill();
    ctx.save(); ctx.clip();
    var inv = ctx.createLinearGradient(cx, cy - ry, cx, cy + ry);
    inv.addColorStop(0, 'rgba(126,164,180,0.075)'); inv.addColorStop(0.5, 'rgba(9,14,18,0.01)');
    inv.addColorStop(1, 'rgba(216,161,74,0.055)');
    ctx.fillStyle = inv; ctx.fillRect(cx - R, cy - ry, R * 2, ry * 2);
    ctx.fillStyle = 'rgba(222,234,238,0.055)';
    ctx.beginPath(); ctx.ellipse(cx + R * 0.06, cy + ry * 0.5, R * 0.48, ry * 0.16, 0.10, 0, TAU); ctx.fill();
    ctx.restore();
    irisPath(ctx, cx, cy, R, ry, ap, rot);
    ctx.strokeStyle = 'rgba(12,16,18,0.90)'; ctx.lineWidth = Math.max(1, 2.0 * scale); ctx.stroke();
    ctx.restore();
  }
  function coatings(ctx, cx, cy, R, ry, scale, alpha) {
    var cols = [P.green, P.magenta, P.amber, P.cool, P.green, P.magenta, P.amber];
    var i, rr, g;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (i = 0; i < 7; i++) {
      rr = 0.88 - i * 0.088;
      g = G.radial(ctx, cx - R * 0.22, cy - ry * 0.20, R * 0.02, cx, cy, R * rr,
        [[0, rgba(cols[i], 0.020 * alpha)], [0.72, rgba(cols[i], 0.012 * alpha)], [1, rgba(cols[i], 0)]])
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(cx - R * 0.02 * i, cy - ry * 0.015 * i, R * rr, ry * rr, -0.10, 0, TAU); ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx, cy, R * rr, ry * rr, -0.10, 3.42 + i * 0.03, 4.68 - i * 0.02);
      ctx.strokeStyle = rgba(cols[i], 0.46 * alpha); ctx.lineWidth = Math.max(0.7, 1.3 * scale); ctx.stroke();
    }
    ctx.restore();
  }
  function dustMarks(ctx, cx, cy, R, ry, scale, alpha) {
    var i, d;
    ctx.save();
    for (i = 0; i < dust.length; i++) {
      d = dust[i];
      if (d.u * d.u + d.v * d.v > 0.93) continue;
      ctx.fillStyle = 'rgba(226,232,228,' + (d.a * alpha).toFixed(3) + ')';
      ctx.beginPath();
      ctx.ellipse(cx + d.u * R * 0.94, cy + d.v * ry * 0.94, d.r * scale, d.r * scale * 0.72, 0, 0, TAU);
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(222,229,226,0.13)';
    ctx.lineWidth = Math.max(1, 2.4 * scale);
    ctx.beginPath();
    ctx.moveTo(cx - R * 0.44, cy - ry * 0.32);
    ctx.bezierCurveTo(cx - R * 0.12, cy - ry * 0.55, cx + R * 0.18, cy + ry * 0.06, cx + R * 0.42, cy - ry * 0.18);
    ctx.stroke();
    ctx.restore();
  }

  /* ---------------- hero: standing lens ---------------- */
  function cylinderPath(ctx, L) {
    ctx.beginPath();
    ctx.moveTo(L.cx - L.R, L.top);
    ctx.ellipse(L.cx, L.top, L.R, L.ry, 0, Math.PI, TAU);
    ctx.lineTo(L.cx + L.R, L.base);
    ctx.ellipse(L.cx, L.base, L.R, L.ry, 0, 0, Math.PI);
    ctx.closePath();
  }
  function arcText(ctx, str, L, y0, size, color, from, to, weight) {
    var ch = String(str).split(''), n = ch.length, i, phi, x, y;
    for (i = 0; i < n; i++) {
      phi = lp(from, to, (i + 0.5) / n);
      x = L.cx + Math.sin(phi) * L.R * 0.985;
      y = y0 + Math.cos(phi) * L.ry;
      ctx.save(); ctx.translate(x, y); ctx.rotate(phi * 0.58); ctx.scale(1, 0.92);
      G.copyText(ctx, ch[i], 0, 0, size, color,
        { family: MONO, weight: weight || '500', align: 'center', baseline: 'middle', tracking: 0 });
      ctx.restore();
    }
  }
  function bandY(L, f) { return L.base - f * L.HH; }

  function drawHero(ctx, env, L, op) {
    var cx = L.cx, R = L.R, HH = L.HH, ry = L.ry;
    var ext = st.focus * R * 0.11, fy = L.top - ext;
    contact(ctx, L);
    ctx.save();
    cylinderPath(ctx, L); ctx.clip();
    var metal = ctx.createLinearGradient(cx - R, 0, cx + R, 0);
    metal.addColorStop(0, '#080b0e');
    metal.addColorStop(0.10, '#1b2228');
    metal.addColorStop(0.26, '#333c41');
    metal.addColorStop(0.42, '#151b20');
    metal.addColorStop(0.62, '#272e33');
    metal.addColorStop(0.78, '#101418');
    metal.addColorStop(0.93, '#3a4246');
    metal.addColorStop(1, '#6d7779');
    ctx.fillStyle = metal; ctx.fillRect(cx - R, L.top - ry, R * 2, HH + ry * 2);

    var bands = [
      [0.00, 0.085, 'mount'], [0.085, 0.215, 'aperture'], [0.215, 0.325, 'scale'],
      [0.325, 0.595, 'knurl'], [0.595, 0.785, 'barrel'], [0.785, 0.915, 'front'], [0.915, 1.0, 'rim']
    ];
    var i, b, y0, y1, vg;
    for (i = 0; i < bands.length; i++) {
      b = bands[i]; y0 = bandY(L, b[1]); y1 = bandY(L, b[0]);
      vg = ctx.createLinearGradient(0, y0, 0, y1);
      vg.addColorStop(0, 'rgba(255,255,255,0.075)');
      vg.addColorStop(0.16, 'rgba(0,0,0,0.16)');
      vg.addColorStop(0.78, 'rgba(0,0,0,0.10)');
      vg.addColorStop(1, 'rgba(0,0,0,0.44)');
      ctx.fillStyle = vg; ctx.fillRect(cx - R, y0, R * 2, y1 - y0);
    }
    /* knurled rubber focus ring */
    var ky0 = bandY(L, 0.595), ky1 = bandY(L, 0.325);
    ctx.drawImage(knurlTile, cx - R, ky0, R * 2, ky1 - ky0);
    for (i = 0; i < 2; i++) {
      var yy = i ? ky1 : ky0;
      ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(cx - R, yy - 2, R * 2, 4);
      ctx.fillStyle = rgba(P.brass, 0.42); ctx.fillRect(cx - R, yy + 2, R * 2, 1.2);
    }
    /* engraved rings: marks, numbers, paint in the cuts */
    var ay = bandY(L, 0.155), sy = bandY(L, 0.268);
    ctx.strokeStyle = 'rgba(232,228,220,0.62)'; ctx.lineWidth = 1.1;
    var fnums = ['1.2', '2', '2.8', '4', '5.6', '8', '11', '16'];
    for (i = 0; i < 8; i++) {
      var phi = -1.05 + i * 0.30;
      var xx = cx + Math.sin(phi) * R * 0.99;
      var yy2 = ay + Math.cos(phi) * ry;
      ctx.beginPath(); ctx.moveTo(xx, yy2 - 5); ctx.lineTo(xx, yy2 + 5); ctx.stroke();
      G.copyText(ctx, fnums[i], xx, ay + 15, Math.max(7, R * 0.040), rgba(P.white, 0.70),
        { family: MONO, align: 'center', baseline: 'middle' });
    }
    ctx.fillStyle = rgba(P.amber, 0.95);
    ctx.beginPath(); ctx.moveTo(cx, ay - 13); ctx.lineTo(cx - 3.5, ay - 20); ctx.lineTo(cx + 3.5, ay - 20); ctx.fill();
    arcText(ctx, '0.7  1  1.5  2  3  5  INF', L, sy - 6, Math.max(8, R * 0.043), rgba(P.white, 0.80), -1.08, 1.08);
    arcText(ctx, '2  3  5  7  10  16 FT', L, sy + 9, Math.max(7, R * 0.037), rgba(P.white, 0.55), -1.02, 1.02);
    ctx.strokeStyle = rgba(P.amber, 0.78); ctx.lineWidth = 1.4;
    for (i = 0; i < 11; i++) {
      var p2 = -1.0 + i * 0.20;
      var x2 = cx + Math.sin(p2) * R * 0.99;
      var y2 = sy + 17 + Math.cos(p2) * ry * 0.35;
      ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 + (i % 2 ? 4 : -4), y2 + 5); ctx.stroke();
    }
    arcText(ctx, 'O R V E L L   L U M E N   5 0', L, bandY(L, 0.700), Math.max(9, R * 0.055), rgba(P.white, 0.86), -0.98, 0.98, '600');
    arcText(ctx, '1:1.2  ·  50 mm  ·  SER. 0742-6183', L, bandY(L, 0.640), Math.max(7, R * 0.038), rgba(P.white, 0.54), -0.95, 0.95);
    /* brassing at the ring edges */
    for (i = 0; i < bands.length; i++) {
      var be = bandY(L, bands[i][1]);
      ctx.fillStyle = rgba(P.brass, 0.26); ctx.fillRect(cx - R * 0.92, be - 1, R * 1.8, 1);
    }
    /* long soft box reflected in the anodising, plus a thin cool rim */
    var lx = cx - R * 0.52 + Math.sin(st.yaw) * R * 0.42;
    var box = ctx.createLinearGradient(lx - R * 0.34, 0, lx + R * 0.34, 0);
    box.addColorStop(0, 'rgba(228,240,246,0)');
    box.addColorStop(0.5, 'rgba(228,240,246,0.15)');
    box.addColorStop(1, 'rgba(228,240,246,0)');
    ctx.fillStyle = box; ctx.fillRect(lx - R * 0.34, L.top - ry, R * 0.68, HH + ry * 2);
    var core = ctx.createLinearGradient(lx - R * 0.07, 0, lx + R * 0.07, 0);
    core.addColorStop(0, 'rgba(255,255,255,0)'); core.addColorStop(0.5, 'rgba(242,249,250,0.13)');
    core.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = core; ctx.fillRect(lx - R * 0.07, L.top - ry, R * 0.14, HH + ry * 2);
    ctx.fillStyle = G.linear(ctx, cx + R * 0.88, 0, cx + R, 0,
      [[0, 'rgba(127,176,196,0)'], [1, 'rgba(186,222,232,0.50)']]);
    ctx.fillRect(cx + R * 0.88, L.top - ry, R * 0.12, HH + ry * 2);
    ctx.restore();

    /* rear mount: only the near half of the bottom rim catches the eye */
    ctx.save();
    cylinderPath(ctx, L); ctx.clip();
    var rear = ctx.createLinearGradient(0, L.base - ry, 0, L.base + ry);
    rear.addColorStop(0, 'rgba(0,0,0,0.05)');
    rear.addColorStop(1, 'rgba(0,0,0,0.62)');
    ctx.fillStyle = rear;
    ctx.beginPath();
    ctx.ellipse(cx, L.base, R * 0.98, ry * 1.02, 0, 0, Math.PI);
    ctx.lineTo(cx - R * 0.98, L.base); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(P.brass, 0.34); ctx.lineWidth = Math.max(1, R * 0.006);
    ctx.beginPath(); ctx.ellipse(cx, L.base, R * 0.98, ry * 1.02, 0, 0, Math.PI); ctx.stroke();
    ctx.restore();

    /* the front group rides out on its helicoid as the focus turns */
    if (ext > 1) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx - R * 0.93, fy);
      ctx.ellipse(cx, fy, R * 0.93, ry, 0, Math.PI, TAU);
      ctx.lineTo(cx + R * 0.93, L.top);
      ctx.ellipse(cx, L.top, R * 0.93, ry, 0, 0, Math.PI);
      ctx.closePath();
      var collar = ctx.createLinearGradient(cx - R, 0, cx + R, 0);
      collar.addColorStop(0, '#0a0e11'); collar.addColorStop(0.30, '#303a40');
      collar.addColorStop(0.62, '#141a1e'); collar.addColorStop(1, '#697477');
      ctx.fillStyle = collar; ctx.fill();
      ctx.strokeStyle = rgba(P.brass, 0.36); ctx.lineWidth = Math.max(1, R * 0.006); ctx.stroke();
      for (var hi = 0; hi < 3; hi++) {
        var hy = fy + ext * (hi + 1) / 4;
        ctx.beginPath(); ctx.moveTo(cx - R * 0.92, hy + ry * 0.12);
        ctx.lineTo(cx + R * 0.92, hy - ry * 0.12);
        ctx.strokeStyle = rgba(P.brass, 0.20); ctx.lineWidth = 1; ctx.stroke();
      }
      ctx.restore();
    }
    /* front ring and glass seen from above */
    var rot = st.yaw * 0.34;
    ctx.save();
    var ring = ctx.createLinearGradient(cx - R, fy - ry, cx + R, fy + ry);
    ring.addColorStop(0, '#5d6669'); ring.addColorStop(0.28, '#12181c');
    ring.addColorStop(0.60, '#3b4448'); ring.addColorStop(1, '#8b8d85');
    ctx.fillStyle = ring;
    ctx.beginPath(); ctx.ellipse(cx, fy, R * 1.02, ry * 1.02, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#070b0d';
    ctx.beginPath(); ctx.ellipse(cx, fy, R * 0.88, ry * 0.88, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba(P.brass, 0.60); ctx.lineWidth = Math.max(1, R * 0.010);
    ctx.beginPath(); ctx.ellipse(cx, fy, R * 0.94, ry * 0.94, 0, 0, TAU); ctx.stroke();
    for (i = 0; i < 60; i++) {
      var a = TAU * i / 60;
      ctx.strokeStyle = i % 5 === 0 ? rgba(P.white, 0.55) : 'rgba(205,213,212,0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * R * 0.965, fy + Math.sin(a) * ry * 0.965);
      ctx.lineTo(cx + Math.cos(a) * R * 1.01, fy + Math.sin(a) * ry * 1.01);
      ctx.stroke();
    }
    drawIris(ctx, cx, fy, R * 0.865, ry * 0.865, st.ap, rot, Math.max(0.7, R / 230));
    coatings(ctx, cx, fy, R * 0.855, ry * 0.855, Math.max(0.7, R / 230), 0.85);
    dustMarks(ctx, cx, fy, R * 0.84, ry * 0.84, Math.max(0.7, R / 230), 0.75);
    /* front ring engraving */
    arcText(ctx, 'ORVELL   LUMEN 50   1:1.2', L, fy - ry * 0.72, Math.max(9, R * 0.052), rgba(P.white, 0.88), -0.75, 0.75, '600');
    ctx.restore();
  }

  /* ---------------- view 2: straight down the axis ---------------- */
  function ringText(ctx, str, cx, cy, R, size, color, from, to) {
    var ch = String(str).split(''), n = ch.length, i, a, x, y;
    for (i = 0; i < n; i++) {
      a = lp(from, to, (i + 0.5) / n);
      x = cx + Math.sin(a) * R; y = cy - Math.cos(a) * R;
      ctx.save(); ctx.translate(x, y); ctx.rotate(a);
      G.copyText(ctx, ch[i], 0, 0, size, color,
        { family: MONO, align: 'center', baseline: 'middle', weight: '600' });
      ctx.restore();
    }
  }
  function drawAxis(ctx, env, op) {
    var w = env.w, h = env.h, cx = w * 0.5, cy = h * 0.53;
    var R = Math.min(w * 0.355, h * 0.415);
    contactEllipse(ctx, cx, cy + R * 1.08, R * 1.35, R * 0.20);
    var outer = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
    outer.addColorStop(0, '#596267'); outer.addColorStop(0.24, '#141a1e');
    outer.addColorStop(0.55, '#394246'); outer.addColorStop(0.78, '#0c1114'); outer.addColorStop(1, '#717976');
    ctx.fillStyle = outer; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba(P.brass, 0.44); ctx.lineWidth = R * 0.012; ctx.stroke();
    ctx.fillStyle = '#080c0f'; ctx.beginPath(); ctx.arc(cx, cy, R * 0.855, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(220,229,230,0.16)'; ctx.lineWidth = 1; ctx.stroke();
    ringText(ctx, 'O R V E L L   ·   L U M E N   5 0   ·   1 : 1 . 2   ·   S E R .   0 7 4 2 - 6 1 8 3',
      cx, cy, R * 0.945, Math.max(9, R * 0.049), rgba(P.white, 0.83), -1.28, 1.28);
    var i;
    for (i = 0; i < 9; i++) {
      var a = -Math.PI * 0.76 + i * (Math.PI * 1.52 / 8);
      var x = cx + Math.sin(a) * R * 0.895, y = cy - Math.cos(a) * R * 0.895;
      ctx.strokeStyle = rgba(P.white, 0.60); ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(cx + Math.sin(a) * R * 0.84, cy - Math.cos(a) * R * 0.84); ctx.stroke();
      G.copyText(ctx, ['1.2', '2', '2.8', '4', '5.6', '8', '11', '16', '22'][i],
        cx + Math.sin(a) * R * 0.79, cy - Math.cos(a) * R * 0.79, Math.max(8, R * 0.038), rgba(P.white, 0.70),
        { family: MONO, align: 'center', baseline: 'middle' });
    }
    ctx.fillStyle = rgba(P.amber, 0.95);
    ctx.beginPath(); ctx.moveTo(cx, cy - R * 0.98); ctx.lineTo(cx - R * 0.016, cy - R * 0.90);
    ctx.lineTo(cx + R * 0.016, cy - R * 0.90); ctx.fill();
    drawIris(ctx, cx, cy, R * 0.80, R * 0.80, st.ap, st.yaw * 0.34, Math.max(0.8, R / 260));
    coatings(ctx, cx, cy, R * 0.79, R * 0.79, Math.max(0.8, R / 260), 1.0);
    dustMarks(ctx, cx, cy, R * 0.77, R * 0.77, Math.max(0.8, R / 260), 0.9);
    /* coatings repeated in depth, one small ghost per air-to-glass surface */
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    var cols = [P.green, P.magenta, P.amber, P.cool, P.green, P.magenta, P.amber];
    for (i = 0; i < 7; i++) {
      var rr = 0.70 - i * 0.075;
      ctx.strokeStyle = rgba(cols[i], 0.17);
      ctx.lineWidth = Math.max(1, R * 0.004);
      ctx.beginPath(); ctx.arc(cx + R * 0.02 * i, cy - R * 0.015 * i, R * rr, 2.9, 4.5); ctx.stroke();
    }
    ctx.restore();
    var glare = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
    glare.addColorStop(0, 'rgba(235,245,248,0.045)'); glare.addColorStop(0.42, 'rgba(255,255,255,0)');
    glare.addColorStop(1, 'rgba(127,176,196,0.04)');
    ctx.fillStyle = glare; ctx.beginPath(); ctx.arc(cx, cy, R * 0.80, 0, TAU); ctx.fill();
  }
  function contactEllipse(ctx, cx, cy, rx, ry) {
    ctx.save();
    ctx.fillStyle = G.radial(ctx, cx, cy, 0, cx, cy, rx,
      [[0, 'rgba(0,0,0,0.8)'], [0.5, 'rgba(0,0,0,0.32)'], [1, 'rgba(0,0,0,0)']]);
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }

  /* ---------------- view 3: optical section ---------------- */
  function hatchFill(ctx) {
    if (!patterns.hatch) patterns.hatch = ctx.createPattern(hatchTile, 'repeat');
    return patterns.hatch;
  }
  function elementPath(ctx, a, b, focus, zx, zy) {
    var sa = SURF[a], sb = SURF[b], ca = Math.min(sa.ca, sb.ca);
    var n = 26, i, y, z;
    ctx.beginPath();
    for (i = 0; i <= n; i++) {
      y = -ca + 2 * ca * i / n; z = surfZ(sa, a, focus, y);
      if (i === 0) ctx.moveTo(zx(z), zy(y)); else ctx.lineTo(zx(z), zy(y));
    }
    for (i = n; i >= 0; i--) {
      y = -ca + 2 * ca * i / n; z = surfZ(sb, b, focus, y);
      ctx.lineTo(zx(z), zy(y));
    }
    ctx.closePath();
  }
  function drawSection(ctx, env, op, cut) {
    var w = env.w, h = env.h;
    var os = Math.min(w * 0.86 / 1.9, h * 0.92);
    var mid = h * 0.54;
    var zx = function (z) { return w * 0.07 + (z + 0.35) * os; };
    var zy = function (y) { return mid - y * os; };
    var slide = cut * 0.155 * os;
    var i, j, z0, s, y, z;

    /* stone and bench light */
    ctx.save();
    var bench = ctx.createLinearGradient(0, mid - os * 0.45, 0, mid + os * 0.45);
    bench.addColorStop(0, 'rgba(20,27,32,0.42)'); bench.addColorStop(0.5, 'rgba(8,11,13,0.72)');
    bench.addColorStop(1, 'rgba(12,16,19,0.35)');
    ctx.fillStyle = bench; ctx.fillRect(0, mid - os * 0.48, w, os * 0.96);
    ctx.restore();

    /* film plane and the marked focal target */
    var fx = zx(FILM_Z), fy = zy(0);
    ctx.save();
    ctx.setLineDash([4, 5]);
    ctx.strokeStyle = 'rgba(127,176,196,0.36)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(fx, zy(0.38)); ctx.lineTo(fx, zy(-0.38)); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(10,14,17,0.85)'; ctx.fillRect(fx - 2, zy(0.35), 4, zy(-0.35) - zy(0.35));
    var markPx = Math.max(7, MARK_R * os);
    ctx.strokeStyle = rgba(P.amber, 0.85); ctx.lineWidth = Math.max(1, os * 0.0022);
    ctx.beginPath(); ctx.arc(fx, fy, markPx, 0, TAU); ctx.stroke();
    ctx.setLineDash([2, 4]); ctx.strokeStyle = rgba(P.amber, 0.34);
    ctx.beginPath(); ctx.arc(fx, fy, markPx * 2.1, 0, TAU); ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = rgba(P.amber, 0.55);
    ctx.beginPath(); ctx.moveTo(fx - markPx * 2.7, fy); ctx.lineTo(fx - markPx * 1.35, fy);
    ctx.moveTo(fx + markPx * 1.35, fy); ctx.lineTo(fx + markPx * 2.7, fy);
    ctx.moveTo(fx, fy - markPx * 2.7); ctx.lineTo(fx, fy - markPx * 1.35);
    ctx.moveTo(fx, fy + markPx * 1.35); ctx.lineTo(fx, fy + markPx * 2.7); ctx.stroke();
    T(ctx, 'FILM 50 mm', fx + markPx * 2.1, zy(0.35), Math.max(9, os * 0.017), rgba(P.cool, 0.72),
      { align: 'right' });
    ctx.restore();

    /* elements: seven glass bodies, blackened edges, retaining rings */
    for (i = 0; i < ELEMENTS.length; i++) {
      var e = ELEMENTS[i], sa = SURF[e[0]], sb = SURF[e[1]];
      elementPath(ctx, e[0], e[1], st.focus, zx, zy);
      var gx0 = zx(surfZ(sa, e[0], st.focus, 0)), gx1 = zx(surfZ(sb, e[1], st.focus, 0));
      var gg = ctx.createLinearGradient(gx0, 0, gx1, 0);
      gg.addColorStop(0, 'rgba(150,202,214,0.26)');
      gg.addColorStop(0.42, 'rgba(78,132,150,0.11)');
      gg.addColorStop(0.75, 'rgba(216,161,74,0.09)');
      gg.addColorStop(1, 'rgba(168,214,224,0.23)');
      ctx.fillStyle = gg; ctx.fill();
      ctx.strokeStyle = 'rgba(6,10,12,0.95)'; ctx.lineWidth = Math.max(1.6, os * 0.007); ctx.stroke();
      /* polished spherical edges */
      for (j = 0; j < 2; j++) {
        var si = e[j], ss = SURF[si];
        ctx.beginPath();
        for (var k = 0; k <= 28; k++) {
          y = -ss.ca + 2 * ss.ca * k / 28; z = surfZ(ss, si, st.focus, y);
          if (k === 0) ctx.moveTo(zx(z), zy(y)); else ctx.lineTo(zx(z), zy(y));
        }
        ctx.strokeStyle = rgba(j === 0 ? P.cool : P.amber, 0.34);
        ctx.lineWidth = Math.max(0.8, os * 0.0018); ctx.stroke();
      }
      /* retaining ring with spanner slots at the element rim */
      var ca = Math.min(sa.ca, sb.ca);
      for (j = 0; j < 2; j++) {
        var ry = j ? -ca : ca;
        var rx = zx(surfZ(sa, e[0], st.focus, ry * 0.88));
        ctx.fillStyle = '#262d31';
        ctx.fillRect(rx - os * 0.012, zy(ry) - os * 0.016, os * 0.024, os * 0.032);
        ctx.fillStyle = hatchFill(ctx);
        ctx.fillRect(rx - os * 0.012, zy(ry) - os * 0.016, os * 0.024, os * 0.032);
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(rx - os * 0.002, zy(ry) - os * 0.010, os * 0.004, os * 0.020);
      }
    }

    /* hatched metal barrel, top half slides away on the cut */
    var wz0 = zx(-0.02), wz1 = zx(1.03);
    for (i = 0; i < 2; i++) {
      var yTop = i ? zy(-0.305) : zy(0.395);
      var yBot = i ? zy(-0.395) : zy(0.305);
      var off = i ? 0 : -slide;
      ctx.save();
      ctx.fillStyle = '#1c2226'; ctx.fillRect(wz0, yTop + off, wz1 - wz0, yBot - yTop);
      ctx.fillStyle = hatchFill(ctx);
      ctx.globalAlpha = 0.75; ctx.fillRect(wz0, yTop + off, wz1 - wz0, yBot - yTop); ctx.globalAlpha = 1;
      var vg = ctx.createLinearGradient(0, yTop + off, 0, yBot + off);
      vg.addColorStop(0, 'rgba(220,230,232,0.24)'); vg.addColorStop(0.35, 'rgba(0,0,0,0.32)');
      vg.addColorStop(1, 'rgba(0,0,0,0.58)');
      ctx.fillStyle = vg; ctx.fillRect(wz0, yTop + off, wz1 - wz0, yBot - yTop);
      ctx.strokeStyle = rgba(P.brass, 0.55); ctx.lineWidth = Math.max(1, os * 0.002);
      ctx.beginPath(); ctx.moveTo(wz0, (i ? yTop : yBot) + off); ctx.lineTo(wz1, (i ? yTop : yBot) + off); ctx.stroke();
      for (j = 0; j < 7; j++) {
        var rx2 = wz0 + (j + 0.5) * (wz1 - wz0) / 7;
        ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(rx2, yTop + off, os * 0.004, yBot - yTop);
      }
      ctx.restore();
    }

    /* nine-blade iris, drawn as the two cut stubs that stop the outer rays */
    var rad = apertureRadius(st.ap), ix = zx(IRIS_Z);
    for (i = 0; i < 2; i++) {
      var sign = i ? -1 : 1;
      var yWall = zy(sign * 0.395), yTip = zy(sign * rad);
      var halfW = os * 0.030;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(ix - halfW, yWall);
      ctx.lineTo(ix + halfW, yWall);
      ctx.lineTo(ix + halfW, yTip + sign * os * 0.022);
      ctx.quadraticCurveTo(ix, yTip - sign * os * 0.028, ix - halfW, yTip);
      ctx.closePath();
      ctx.fillStyle = '#11161a'; ctx.fill();
      ctx.fillStyle = hatchFill(ctx); ctx.globalAlpha = 0.28; ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = rgba(P.white, 0.40); ctx.lineWidth = Math.max(1, os * 0.002); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ix + halfW, yTip + sign * os * 0.022);
      ctx.quadraticCurveTo(ix, yTip - sign * os * 0.028, ix - halfW, yTip);
      ctx.strokeStyle = rgba(P.brass, 0.60); ctx.lineWidth = Math.max(1, os * 0.0024); ctx.stroke();
      ctx.restore();
    }

    /* the traced fan: every segment comes from a ray/circle intersection and Snell */
    ctx.save();
    var lw = Math.max(0.8, os * 0.0017);
    for (i = 0; i < op.rays.length; i++) {
      var ray = op.rays[i], pts = ray.pts;
      var col = i % 2 ? 'rgba(216,161,74,' : 'rgba(158,204,222,';
      ctx.beginPath();
      for (j = 0; j < pts.length; j++) {
        var px = zx(pts[j][0]), py = zy(pts[j][1]);
        if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.lineWidth = lw;
      ctx.strokeStyle = ray.blocked ? col + '0.30)' : col + '0.78)';
      ctx.stroke();
      if (!ray.blocked) {
        for (j = 1; j < pts.length - 2; j++) {
          ctx.fillStyle = 'rgba(230,240,243,0.44)';
          ctx.beginPath(); ctx.arc(zx(pts[j][0]), zy(pts[j][1]), Math.max(0.8, os * 0.002), 0, TAU); ctx.fill();
        }
      } else if (ray.stop) {
        ctx.fillStyle = rgba(P.amber, 0.75);
        ctx.beginPath(); ctx.arc(zx(ray.stop[0]), zy(ray.stop[1]), Math.max(1.2, os * 0.003), 0, TAU); ctx.fill();
      }
    }
    ctx.restore();
    /* focal point: the axial crossing of the surviving rays */
    var zc = op.zmean < 90 ? op.zmean : FILM_Z;
    var focusX = zx(cl(zc, 1.05, 1.52));
    var good = cl(1 - op.blur / (MARK_R * 2.4), 0, 1);
    G.glow(ctx, focusX, fy, os * (0.025 + 0.055 * good), rgba(P.white, 0.16 + 0.30 * good));
    ctx.fillStyle = rgba(P.white, 0.65 + 0.30 * good);
    ctx.beginPath(); ctx.arc(focusX, fy, Math.max(1.5, os * 0.004), 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba(P.cool, 0.35); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(focusX, fy - os * 0.05); ctx.lineTo(focusX, fy + os * 0.05); ctx.stroke();

    /* bench note */
    brief(ctx, env, op, os);
  }
  function brief(ctx, env, op, os) {
    var w = env.w, h = env.h;
    var x = w - Math.max(18, w * 0.028), y = Math.max(96, h * 0.135);
    var size = cl(Math.min(w, h) * 0.0125, 9, 13);
    var lines = [
      'Bench note  ·  ORVELL LUMEN 50',
      'You set rays inside the film mark.',
      'Blades ' + Math.round(st.ap * 100) + '%   Focus ' + st.focus.toFixed(2),
      'Iris stops ' + op.blocked + ' of ' + RAYS + '. Blur ' + op.blur.toFixed(3),
      op.inside ? 'Spot in mark' : 'You set aperture. You set focus.'
    ];
    ctx.save();
    ctx.textAlign = 'right';
    T(ctx, lines[0], x, y, size, rgba(P.cool, 0.75), { align: 'right', tracking: 1.2 });
    T(ctx, lines[1], x, y + size * 1.8, size, rgba(P.ink, 0.78), { align: 'right' });
    for (var i = 2; i < lines.length; i++) {
      T(ctx, lines[i], x, y + size * (1.8 + (i - 1) * 1.55), size * 0.94,
        i === 4 ? rgba(op.inside ? P.green : P.amber, 0.92) : rgba(P.ink, 0.55), { align: 'right' });
    }
    ctx.fillStyle = rgba(op.inside ? P.green : P.amber, 0.55);
    ctx.fillRect(x - size * 9.5, y + size * 2.35, size * 9.5, 1);
    ctx.restore();
  }

  /* ---------------- view 4: macro of the front coating ---------------- */
  function drawMacro(ctx, env) {
    var w = env.w, h = env.h, cx = w * 0.5, cy = h * 0.52;
    var R = Math.min(w * 0.72, h * 0.86);
    var ry = R * (0.56 + st.pitch * 0.4);
    var glass = ctx.createRadialGradient(cx - R * 0.22, cy - ry * 0.20, R * 0.02, cx, cy, R * 1.2);
    glass.addColorStop(0, '#17323b'); glass.addColorStop(0.36, '#0c202a');
    glass.addColorStop(0.76, '#07151b'); glass.addColorStop(1, '#03090c');
    ctx.fillStyle = glass; ctx.beginPath(); ctx.ellipse(cx, cy, R, ry, -0.05, 0, TAU); ctx.fill();
    /* soft boxes repeated in depth: green, magenta, amber coatings */
    var cols = [P.green, P.magenta, P.amber, P.cool, P.green, P.magenta, P.amber];
    var i, rr, bx;
    ctx.save();
    ctx.beginPath(); ctx.ellipse(cx, cy, R, ry, -0.05, 0, TAU); ctx.clip();
    for (i = 0; i < 7; i++) {
      rr = 0.94 - i * 0.105;
      var bx0 = cx - R * 0.42 * rr, bxx = cx + R * 0.30 * rr;
      var sg = ctx.createLinearGradient(bx0, cy - ry * 0.7, bxx, cy + ry * 0.6);
      sg.addColorStop(0, rgba(cols[i], 0.01));
      sg.addColorStop(0.48, rgba(cols[i], 0.10 + 0.03 * Math.sin(env.t * 0.35 + i)));
      sg.addColorStop(1, rgba(cols[i], 0.0));
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.ellipse(cx - R * 0.04 * rr, cy - ry * 0.10 * rr, R * 0.74 * rr, ry * 0.26 * rr, -0.26, 0, TAU);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx, cy, R * rr, ry * rr, -0.05, 3.50 + i * 0.02, 4.58 - i * 0.01);
      ctx.strokeStyle = rgba(cols[i], 0.26);
      ctx.lineWidth = Math.max(1, R * 0.0035); ctx.stroke();
    }
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    var sb = ctx.createLinearGradient(cx - R * 0.85, cy - ry * 0.7, cx + R * 0.45, cy + ry * 0.6);
    sb.addColorStop(0, 'rgba(232,244,248,0)'); sb.addColorStop(0.38, 'rgba(240,250,252,0.34)');
    sb.addColorStop(0.62, 'rgba(232,244,248,0.14)'); sb.addColorStop(1, 'rgba(232,244,248,0)');
    for (var sbI = 0; sbI < 3; sbI++) {
      ctx.fillStyle = sb;
      ctx.beginPath();
      ctx.ellipse(cx - R * (0.26 - sbI * 0.035), cy - ry * (0.22 + sbI * 0.045),
        R * (0.56 - sbI * 0.060), ry * (0.175 - sbI * 0.012), -0.25, 0, TAU);
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(245,252,252,0.23)'; ctx.lineWidth = Math.max(1, R * 0.004);
    ctx.beginPath(); ctx.ellipse(cx - R * 0.26, cy - ry * 0.24, R * 0.56, ry * 0.175, -0.25, 3.45, 5.05); ctx.stroke();
    ctx.restore();
    /* dust and one cleaning wipe */
    dustMarks(ctx, cx, cy, R * 0.94, ry * 0.94, Math.max(1.5, R / 250), 1.4);
    ctx.restore();
    /* black-painted element edge and retaining ring with a spanner slot */
    ctx.strokeStyle = '#05090b'; ctx.lineWidth = Math.max(7, R * 0.035);
    ctx.beginPath(); ctx.ellipse(cx, cy, R, ry, -0.05, 0, TAU); ctx.stroke();
    ctx.strokeStyle = rgba(P.cool, 0.28); ctx.lineWidth = Math.max(1, R * 0.004);
    ctx.beginPath(); ctx.ellipse(cx, cy, R * 0.985, ry * 0.985, -0.05, 0.15, 1.35); ctx.stroke();
    ctx.save();
    ctx.translate(cx + R * 0.74, cy + ry * 0.64); ctx.rotate(-0.35);
    ctx.fillStyle = '#262e31'; ctx.fillRect(-R * 0.06, -R * 0.025, R * 0.14, R * 0.05);
    ctx.fillStyle = hatchFill(ctx); ctx.globalAlpha = 0.7; ctx.fillRect(-R * 0.06, -R * 0.025, R * 0.14, R * 0.05);
    ctx.globalAlpha = 1; ctx.fillStyle = 'rgba(0,0,0,0.9)'; ctx.fillRect(-R * 0.012, -R * 0.015, R * 0.008, R * 0.03);
    ctx.restore();
  }

  function viewDots(ctx, env) {
    var w = env.w, h = env.h, i;
    var gap = Math.max(14, Math.min(w, h) * 0.022);
    for (i = 1; i <= 4; i++) {
      var x = w * 0.5 + (i - 2.5) * gap;
      ctx.beginPath(); ctx.arc(x, h - Math.max(22, h * 0.038), i === st.view ? 3.4 : 2.1, 0, TAU);
      ctx.fillStyle = i === st.view ? rgba(P.amber, 0.92) : 'rgba(232,228,220,0.28)'; ctx.fill();
    }
  }

  function onFrame(ctx, env) {
    var L = layout(env.w, env.h);
    var playing = update(env);
    var op = optics(st.focus, st.ap);
    drawSlate(ctx, env, L);
    var cut = st.view === 3 ? 1 : cutAmount(env.t);
    if (st.view === 1) drawHero(ctx, env, L, op);
    else if (st.view === 2) drawAxis(ctx, env, op);
    else if (st.view === 3) drawSection(ctx, env, op, cutAmount(env.t));
    else drawMacro(ctx, env);
    if (st.view !== 3) {
      var w = env.w, h = env.h;
      var px = env.auto ? w - 22 : w - 22;
      var size = cl(Math.min(w, h) * 0.0125, 9, 13);
      T(ctx, 'BENCH  ·  APERTURE AND FOCUS', px, Math.max(94, h * 0.135), size,
        rgba(P.cool, 0.68), { align: 'right', tracking: 1.1 });
      T(ctx, 'You press X to cut the barrel.', px, Math.max(94, h * 0.135) + size * 1.9, size,
        rgba(P.ink, 0.68), { align: 'right' });
      T(ctx, 'Blades ' + Math.round(st.ap * 100) + '%   Focus ' + st.focus.toFixed(2),
        px, Math.max(94, h * 0.135) + size * 3.4, size * 0.94, rgba(P.amber, 0.72), { align: 'right' });
    }
    viewDots(ctx, env);
    if (playing) progress(env, op);
    G.vignette(ctx, env.w, env.h, 0.52);
    G.grain(ctx, env.w, env.h, 0.05);
    /* film tone curve: cool shadows, warm highlights */
    var tone = ctx.createLinearGradient(0, 0, env.w, env.h);
    tone.addColorStop(0, 'rgba(16,34,44,0.10)'); tone.addColorStop(0.55, 'rgba(0,0,0,0)');
    tone.addColorStop(1, 'rgba(216,161,74,0.035)');
    ctx.fillStyle = tone; ctx.fillRect(0, 0, env.w, env.h);
  }
})();
