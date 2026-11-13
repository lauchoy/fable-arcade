(function () {
  'use strict';

  var ID = 'crystal-tumbler';
  var G = Arcade.gfx;
  var cl = Arcade.clamp, lp = Arcade.lerp, sm = Arcade.smooth;
  var MONO = '"IBM Plex Mono", ui-monospace, Menlo, monospace';
  var TAU = Math.PI * 2;
  var P = {
    bg: '#11100e', ink: '#efe7d6', amber: '#c98a35', cool: '#8ba9bb',
    pale: '#f3e5c8', deep: '#5a2f12', green: '#9ec8a4', violet: '#ad8bc0',
    stone: '#191713', bright: '#fff0cf'
  };
  var MARKS = [35 * Math.PI / 180, 150 * Math.PI / 180, 265 * Math.PI / 180];
  var TOL = 8.5 * Math.PI / 180;
  var ICE_MARK = 90 * Math.PI / 180, ICE_TOL = 18 * Math.PI / 180;
  var FACETS = 20;

  var st = {
    inited: false, light: 0.25, ice: 0.22, view: 1, urlView: 0,
    dragging: false, spin: false, matched: [false, false, false, false],
    finished: false, lastFlash: -1, lastChime: -1, forceDone: false
  };

  var E = Arcade.boot({
    id: ID,
    title: 'The crystal tumbler',
    hint: 'Drag or press the arrow keys to move the key light. Press Space to turn the ice. Press 1 to 4 to set the view.',
    background: P.bg, ink: P.ink,
    onFrame: onFrame
  });

  var VIEWS = { hero: 1, low: 2, liquid: 2, top: 3, star: 3, macro: 4, detail: 4 };
  function viewParam(v) {
    if (VIEWS[v]) return VIEWS[v];
    var n = parseInt(v, 10);
    return (n >= 1 && n <= 4) ? n : 0;
  }
  st.urlView = viewParam(E.view);
  if (st.urlView) st.view = st.urlView;
  if (E.state === 'low') st.view = 2;
  if (E.state === 'top' || E.state === 'star') st.view = 3;
  if (E.state === 'macro') st.view = 4;
  if (E.state === 'end' || E.state === 'complete') st.forceDone = true;

  var rnd = Arcade.rng(61207);
  var stoneTile = G.offscreen(512, 512, function (g, w, h) {
    var r = Arcade.rng(3371);
    g.fillStyle = '#171613'; g.fillRect(0, 0, w, h);
    var i, x, y;
    for (i = 0; i < 150; i++) {
      x = r() * w; y = r() * h;
      g.strokeStyle = 'rgba(190,178,150,' + (0.008 + r() * 0.018).toFixed(3) + ')';
      g.lineWidth = 0.6 + r() * 2.2;
      g.beginPath(); g.moveTo(x, y);
      g.bezierCurveTo(x + 40 + r() * 90, y - 8, x + 90 + r() * 150, y + 12, x + 130 + r() * 180, y + r() * 9);
      g.stroke();
    }
    for (i = 0; i < 11000; i++) {
      x = r() * w; y = r() * h;
      g.fillStyle = r() > 0.48 ? 'rgba(215,203,176,0.030)' : 'rgba(0,0,0,0.070)';
      g.fillRect(x, y, 1, 1);
    }
  });
  var beadTile = G.offscreen(48, 64, function (c, w, h) {
    c.clearRect(0, 0, w, h);
    var bg = c.createRadialGradient(w * 0.34, h * 0.30, w * 0.04, w * 0.5, h * 0.5, w * 0.60);
    bg.addColorStop(0, 'rgba(250,255,252,0.86)');
    bg.addColorStop(0.36, 'rgba(160,194,202,0.42)');
    bg.addColorStop(0.78, 'rgba(26,40,44,0.40)');
    bg.addColorStop(1, 'rgba(8,14,16,0.10)');
    c.fillStyle = bg;
    c.beginPath(); c.ellipse(w * 0.5, h * 0.5, w * 0.40, h * 0.42, 0, 0, TAU); c.fill();
    c.strokeStyle = 'rgba(235,248,246,0.55)'; c.lineWidth = 1.2; c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.78)';
    c.beginPath(); c.ellipse(w * 0.34, h * 0.32, w * 0.09, h * 0.045, -0.35, 0, TAU); c.fill();
  });
  var beads = [];
  for (var bi = 0; bi < 34; bi++) {
    beads.push({ u: rnd() * 1.8 - 0.9, f: 0.63 + rnd() * 0.34, r: 0.8 + rnd() * 2.6, a: 0.3 + rnd() * 0.55 });
  }
  var bubbles = [];
  for (var qi = 0; qi < 13; qi++) {
    bubbles.push({ x: (rnd() - 0.5) * 0.10, y: (rnd() - 0.5) * 0.62, r: 0.6 + rnd() * 1.6 });
  }
  var stonePat = null;

  function T(ctx, s, x, y, size, color, o) { G.copyText(ctx, s, x, y, size, color, o || {}); }
  function rgba(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function wrap(a) { return ((a % TAU) + TAU) % TAU; }
  function angDiff(a, b) {
    var d = Math.abs(wrap(a) - wrap(b));
    return Math.min(d, TAU - d);
  }
  function deg(a) { return Math.round(wrap(a) * 180 / Math.PI); }

  /* ---------------- geometry ---------------- */
  function geometry(env) {
    var w = env.w, h = env.h;
    var low = st.view === 2;
    var narrow = w < 620;
    var R = Math.min(w * (narrow ? 0.34 : (low ? 0.31 : 0.29)), h * 0.31);
    var GH = Math.min(h * (low ? 0.45 : 0.50), R * (narrow ? 2.55 : (low ? 1.85 : 2.32)));
    var base = h * (narrow ? 0.72 : (low ? 0.78 : 0.77));
    return {
      w: w, h: h, low: low, cx: w * 0.5, R: R, GH: GH, base: base,
      top: base - GH,
      ryTop: R * (low ? 0.085 : 0.265),
      ryBot: R * 0.205,
      fLiq: low ? 0.47 : 0.605,
      iceR: R * (low ? 0.72 : 0.665)
    };
  }
  function edgeY(g, u, f) {
    return g.top + f * g.GH + ((1 - f) * g.ryTop + f * g.ryBot) * Math.sqrt(Math.max(0, 1 - u * u));
  }
  function point(g, u, f) { return [g.cx + u * g.R, edgeY(g, u, f)]; }
  function pathUF(ctx, g, pts) {
    ctx.beginPath();
    for (var i = 0; i < pts.length; i++) {
      var p = point(g, pts[i][0], pts[i][1]);
      if (i === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]);
    }
    ctx.closePath();
  }
  function glassOutline(ctx, g) {
    ctx.beginPath();
    ctx.moveTo(g.cx - g.R, g.top);
    ctx.ellipse(g.cx, g.top, g.R, g.ryTop, 0, Math.PI, TAU);
    ctx.lineTo(g.cx + g.R * 0.985, g.base);
    ctx.ellipse(g.cx, g.base, g.R * 0.985, g.ryBot, 0, 0, Math.PI);
    ctx.closePath();
  }

  /* ---------------- refracted light through the cut facets -------------- */
  function norm3(v) { var l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
  function dot3(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function refract3(d, N, eta) {
    var n = N.slice();
    if (dot3(n, d) > 0) n = [-n[0], -n[1], -n[2]];
    var ci = -dot3(n, d);
    var k = 1 - eta * eta * (1 - ci * ci);
    if (k < 0) return null;
    var f = eta * ci - Math.sqrt(k);
    return norm3([eta * d[0] + f * n[0], eta * d[1] + f * n[1], eta * d[2] + f * n[2]]);
  }
  /* Two Snell boundaries per facet (air to lead crystal, crystal to air or
     liquid), then the exit ray is projected onto the stone plane. Three
     wavelengths give each facet a small real spectrum. */
  function facetRay(theta, a, tilt, skew, height, n2, hN) {
    var beta = 1.0;
    var d = [-Math.cos(theta) * Math.cos(beta), -Math.sin(theta) * Math.cos(beta), -Math.sin(beta)];
    var N1 = norm3([Math.sin(a), Math.cos(a), tilt]);
    var d1 = refract3(d, N1, 1 / (1.52 + hN));
    if (!d1) return null;
    var N2 = norm3([Math.sin(a + skew), Math.cos(a + skew), -0.80]);
    var d2 = refract3(d1, N2, (1.52 + hN) / n2);
    if (!d2 || d2[2] > -0.035) return null;
    var s = Math.min(1.55, height / (-d2[2]));
    return {
      qx: Math.sin(a) * 1.02 + s * d2[0],
      qy: Math.cos(a) * 1.02 + s * d2[1],
      vx: d2[0], vy: d2[1]
    };
  }
  function caustics(env, g) {
    var out = [], j, a, tilt, skew, h, n2, flash, main, cols, ci, k;
    var wl = [-0.014, 0, 0.016];
    var colors = ['rgba(226,120,88,', 'rgba(226,214,168,', 'rgba(130,180,214,'];
    for (j = 0; j < FACETS; j++) {
      a = -Math.PI + TAU * j / FACETS;
      tilt = [-0.62, -0.34, 0.34, 0.62][j % 4] + 0.04 * Math.sin(j * 2.1);
      skew = 0.30 + 0.12 * Math.sin(j * 1.7);
      h = 0.42 + 0.13 * (j % 3);
      n2 = (j % 3 === 0) ? 1.33 : 1.0;
      flash = Math.pow(Math.max(0, Math.sin(a + st.light)), 8);
      cols = [];
      main = null;
      for (ci = 0; ci < 3; ci++) {
        var r = facetRay(st.light, a, tilt, skew, h, n2, wl[ci]);
        if (!r) continue;
        cols.push({ qx: r.qx, qy: r.qy, vx: r.vx, vy: r.vy, color: colors[ci] });
        if (ci === 1) main = r;
      }
      if (!cols.length) continue;
      if (!main) main = cols[0];
      out.push({
        a: a, flash: flash, cols: cols, main: main,
        sx: g.cx + Math.sin(a) * g.R * 1.01,
        sy: g.base + Math.cos(a) * g.R * 0.30 - h * g.R * 1.55
      });
    }
    return out;
  }
  function drawCaustics(ctx, env, g, rays) {
    var i, j, r, ex, ey, alpha;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (i = 0; i < rays.length; i++) {
      r = rays[i];
      alpha = 0.26 + 0.62 * r.flash;
      for (j = 0; j < r.cols.length; j++) {
        var c = r.cols[j];
        ex = g.cx + c.qx * g.R; ey = g.base + c.qy * g.R * 0.30;
        var lateral = Math.hypot(c.vx, c.vy) || 1;
        var nx = -c.vy / lateral, ny = c.vx / lateral;
        var off = (j - 1) * Math.max(1.4, g.R * 0.006);
        if (j === 1) {
          ctx.beginPath(); ctx.moveTo(r.sx, r.sy); ctx.lineTo(ex, ey);
          ctx.strokeStyle = c.color + (alpha * 0.18).toFixed(3) + ')';
          ctx.lineWidth = Math.max(0.6, g.R * 0.0022); ctx.stroke();
        }
        var sl = Math.max(11, g.R * (0.30 + 0.16 * r.flash));
        ctx.beginPath();
        ctx.moveTo(ex - c.vx * sl + nx * off, ey - c.vy * sl * 0.3 + ny * off);
        ctx.lineTo(ex + c.vx * sl + nx * off, ey + c.vy * sl * 0.3 + ny * off);
        ctx.strokeStyle = c.color + (alpha * (j === 1 ? 1.35 : 0.92)).toFixed(3) + ')';
        ctx.lineWidth = j === 1 ? Math.max(1.1, g.R * 0.006) : Math.max(0.8, g.R * 0.003);
        ctx.stroke();
      }
      var mx = g.cx + r.main.qx * g.R, my = g.base + r.main.qy * g.R * 0.30;
      ctx.beginPath();
      ctx.moveTo(mx - g.R * 0.055, my); ctx.lineTo(mx + g.R * 0.055, my);
      ctx.strokeStyle = rgba(P.bright, 0.28 + 0.55 * r.flash);
      ctx.lineWidth = Math.max(1, g.R * 0.004); ctx.stroke();
      if (r.flash > 0.10) {
        G.glow(ctx, mx, my, g.R * (0.08 + 0.15 * r.flash), rgba(P.bright, 0.12 + 0.28 * r.flash));
      }
    }
    ctx.restore();
  }

  /* ---------------- stone ---------------- */
  var stoneCache = null;
  function drawStone(ctx, env, g) {
    var w = env.w, h = env.h;
    var key = w + 'x' + h + '|' + st.view + '|' + g.cx.toFixed(1) + '|' + g.base.toFixed(1) +
      '|' + g.R.toFixed(1) + '|' + g.GH.toFixed(1);
    if (!stoneCache || stoneCache.key !== key) {
      var art = G.offscreen(Math.ceil(w), Math.ceil(h), function (c, cw, ch) {
        var vg = c.createLinearGradient(0, 0, 0, ch);
        vg.addColorStop(0, '#1b1915'); vg.addColorStop(0.45, '#11100e'); vg.addColorStop(1, '#080807');
        c.fillStyle = vg; c.fillRect(0, 0, cw, ch);
        var pool = c.createRadialGradient(g.cx - g.R * 0.3, g.base - g.GH * 0.5, 0,
          g.cx - g.R * 0.3, g.base - g.GH * 0.5, Math.max(cw, ch) * 0.70);
        pool.addColorStop(0, 'rgba(198,152,82,0.10)'); pool.addColorStop(0.45, 'rgba(90,87,73,0.05)');
        pool.addColorStop(1, 'rgba(0,0,0,0)');
        c.fillStyle = pool; c.fillRect(0, 0, cw, ch);
        c.save(); c.globalAlpha = 0.40;
        c.fillStyle = c.createPattern(stoneTile, 'repeat'); c.fillRect(0, 0, cw, ch); c.restore();
        c.fillStyle = G.radial(c, g.cx, g.base + 4, g.R * 0.10, g.cx, g.base + 4, g.R * 1.8,
          [[0, 'rgba(0,0,0,0.74)'], [0.44, 'rgba(0,0,0,0.30)'], [1, 'rgba(0,0,0,0)']]);
        c.beginPath(); c.ellipse(g.cx, g.base + 6, g.R * 1.35, g.R * 0.38, 0, 0, TAU); c.fill();
        c.save(); c.globalCompositeOperation = 'lighter';
        c.fillStyle = G.radial(c, g.cx, g.base + g.R * 0.12, g.R * 0.05, g.cx, g.base + g.R * 0.12, g.R * 1.75,
          [[0, 'rgba(201,138,53,0.20)'], [0.5, 'rgba(150,86,28,0.08)'], [1, 'rgba(0,0,0,0)']]);
        c.beginPath(); c.ellipse(g.cx, g.base + g.R * 0.12, g.R * 1.75, g.R * 0.5, 0, 0, TAU); c.fill();
        c.restore();
      });
      stoneCache = { key: key, art: art };
    }
    ctx.drawImage(stoneCache.art, 0, 0, w, h);
  }

  /* ---------------- faceted glass ---------------- */
  function facetFill(ctx, g, pts, a, alpha) {
    var p0 = point(g, pts[0][0], pts[0][1]);
    var lx = g.cx + Math.cos(st.light) * g.R * 2, ly = g.base + Math.sin(st.light) * g.R * 0.8;
    var light = Math.max(0, Math.sin(a + st.light));
    var gr = ctx.createLinearGradient(lx, ly, g.cx - Math.cos(st.light) * g.R, g.base - Math.sin(st.light) * g.R * 0.4);
    gr.addColorStop(0, rgba(P.bright, (0.16 + 0.56 * light) * alpha));
    gr.addColorStop(0.34, rgba(P.cool, (0.12 + 0.22 * (1 - light)) * alpha));
    gr.addColorStop(0.70, rgba(P.amber, (0.07 + 0.18 * light) * alpha));
    gr.addColorStop(1, 'rgba(5,9,11,0.34)');
    ctx.fillStyle = gr;
    pathUF(ctx, g, pts); ctx.fill();
    var edge = 0.16 + 0.70 * Math.pow(light, 5);
    pathUF(ctx, g, pts);
    ctx.strokeStyle = rgba(P.pale, edge * alpha);
    ctx.lineWidth = Math.max(0.7, g.R * 0.0032); ctx.stroke();
    void p0;
    return light;
  }
  function drawFlutes(ctx, g, rays) {
    var N = 14, i, u0, u1, um, a, flash;
    for (i = 0; i < N; i++) {
      u0 = -1 + 2 * i / N; u1 = -1 + 2 * (i + 1) / N; um = (u0 + u1) * 0.5;
      a = Math.asin(cl(um, -1, 1));
      flash = facetFill(ctx, g, [[u0, 0.015], [u1, 0.015], [u1, 0.44], [u0, 0.44]], a, 0.62);
      var rib = ctx.createLinearGradient(g.cx + u0 * g.R, 0, g.cx + u1 * g.R, 0);
      rib.addColorStop(0, 'rgba(4,10,12,0.34)');
      rib.addColorStop(0.34, rgba(P.pale, 0.10 + 0.24 * flash));
      rib.addColorStop(0.58, 'rgba(226,240,242,0.10)');
      rib.addColorStop(1, 'rgba(4,10,12,0.34)');
      ctx.fillStyle = rib;
      pathUF(ctx, g, [[u0, 0.015], [u1, 0.015], [u1, 0.44], [u0, 0.44]]); ctx.fill();
      ctx.beginPath();
      var pA = point(g, um, 0.035), pB = point(g, um, 0.425);
      ctx.moveTo(pA[0], pA[1]); ctx.lineTo(pB[0], pB[1]);
      ctx.strokeStyle = rgba(P.pale, 0.10 + 0.55 * Math.pow(flash, 4));
      ctx.lineWidth = Math.max(0.7, g.R * 0.003); ctx.stroke();
      var pC = point(g, u0, 0.03), pD = point(g, u0, 0.43);
      ctx.beginPath(); ctx.moveTo(pC[0], pC[1]); ctx.lineTo(pD[0], pD[1]);
      ctx.strokeStyle = rgba(P.cool, 0.20); ctx.lineWidth = Math.max(0.5, g.R * 0.002); ctx.stroke();
    }
    void rays;
  }
  function drawDiamonds(ctx, g) {
    var N = 10, i, u0, u1, um, a, mid, tris;
    for (i = 0; i < N; i++) {
      u0 = -1 + 2 * i / N; u1 = -1 + 2 * (i + 1) / N; um = (u0 + u1) * 0.5;
      mid = 0.615;
      a = Math.asin(cl(um, -1, 1));
      tris = [
        [[u0, mid], [um, 0.465], [u1, mid]],
        [[u0, mid], [u1, mid], [um, 0.775]]
      ];
      for (var k = 0; k < tris.length; k++) {
        facetFill(ctx, g, tris[k], a + (k === 1 ? 0.40 : -0.35), 0.50);
      }
      pathUF(ctx, g, [[u0, mid], [um, 0.465], [u1, mid], [um, 0.775]]);
      ctx.strokeStyle = rgba(P.bright, 0.46);
      ctx.lineWidth = Math.max(0.7, g.R * 0.0026); ctx.stroke();
      var pT = point(g, um, 0.465), pB = point(g, um, 0.775);
      ctx.beginPath(); ctx.moveTo(pT[0], pT[1]); ctx.lineTo(pB[0], pB[1]);
      ctx.strokeStyle = rgba(P.pale, 0.22); ctx.lineWidth = Math.max(0.6, g.R * 0.0022); ctx.stroke();
    }
  }
  function drawBase(ctx, g) {
    var i, u0, u1;
    for (i = 0; i < 10; i++) {
      u0 = -1 + 2 * i / 10; u1 = -1 + 2 * (i + 1) / 10;
      var a = Math.asin(cl((u0 + u1) * 0.5, -1, 1));
      facetFill(ctx, g, [[u0, 0.785], [u1, 0.785], [u1, 0.985], [u0, 0.985]], a, 0.72);
    }
    /* star cut under the thick base, seen as refracted rays through the floor */
    ctx.save();
    ctx.beginPath(); ctx.ellipse(g.cx, g.base, g.R * 0.98, g.ryBot, 0, 0, TAU); ctx.clip();
    for (i = 0; i < 12; i++) {
      var ang = TAU * i / 12 + st.ice * 0.10;
      ctx.beginPath();
      ctx.moveTo(g.cx, g.base); ctx.lineTo(g.cx + Math.cos(ang) * g.R * 0.94, g.base + Math.sin(ang) * g.ryBot * 0.9);
      ctx.strokeStyle = rgba(P.pale, 0.14 + 0.08 * Math.sin(st.light * 2 + i));
      ctx.lineWidth = Math.max(0.7, g.R * 0.0025); ctx.stroke();
    }
    var by0 = edgeY(g, 0, 0.80), by1 = edgeY(g, 0, 1.0);
    var thick = ctx.createLinearGradient(0, by0, 0, by1);
    thick.addColorStop(0, 'rgba(244,230,190,0.10)');
    thick.addColorStop(0.50, 'rgba(54,28,10,0.30)');
    thick.addColorStop(1, 'rgba(190,214,218,0.22)');
    ctx.fillStyle = thick; ctx.fillRect(g.cx - g.R, by0, g.R * 2, by1 - by0);
    ctx.restore();
  }

  /* ---------------- liquid and ice ---------------- */
  function drawLiquid(ctx, env, g) {
    var f = g.fLiq;
    var wob = (st.spin ? 0.025 : 0.006) * Math.sin(env.t * 2.15);
    ctx.save(); glassOutline(ctx, g); ctx.clip();
    ctx.beginPath();
    var i, u, p;
    for (i = 0; i <= 40; i++) {
      u = -1 + 2 * i / 40;
      var ff = f + wob * Math.sin(u * 3 + env.t * 1.3);
      p = point(g, u, ff);
      if (i === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]);
    }
    ctx.lineTo(g.cx + g.R, g.base + g.ryBot + 4);
    ctx.lineTo(g.cx - g.R, g.base + g.ryBot + 4);
    ctx.closePath();
    var horiz = ctx.createLinearGradient(g.cx - g.R, 0, g.cx + g.R, 0);
    horiz.addColorStop(0, rgba(P.bright, 0.32));
    horiz.addColorStop(0.10, rgba(P.amber, 0.56));
    horiz.addColorStop(0.50, rgba(P.deep, 0.92));
    horiz.addColorStop(0.90, rgba(P.amber, 0.56));
    horiz.addColorStop(1, rgba(P.bright, 0.32));
    ctx.fillStyle = horiz; ctx.fill();
    var vert = ctx.createLinearGradient(0, point(g, 0, f)[1], 0, g.base + g.ryBot);
    vert.addColorStop(0, 'rgba(255,224,160,0.10)');
    vert.addColorStop(0.40, 'rgba(120,62,20,0.22)');
    vert.addColorStop(1, 'rgba(48,22,8,0.70)');
    ctx.fillStyle = vert; ctx.fill();
    /* meniscus at the glass and the water line */
    ctx.beginPath();
    for (i = 0; i <= 40; i++) {
      u = -1 + 2 * i / 40;
      var edgeLift = Math.pow(Math.abs(u), 7) * g.R * 0.055;
      p = point(g, u, f + wob * Math.sin(u * 3 + env.t * 1.3));
      if (i === 0) ctx.moveTo(p[0], p[1] - edgeLift); else ctx.lineTo(p[0], p[1] - edgeLift);
    }
    ctx.strokeStyle = rgba(P.bright, 0.52); ctx.lineWidth = Math.max(1, g.R * 0.006); ctx.stroke();
    ctx.strokeStyle = rgba(P.deep, 0.55); ctx.lineWidth = Math.max(1, g.R * 0.003);
    ctx.beginPath();
    p = point(g, -0.98, f + 0.008); ctx.moveTo(p[0], p[1]);
    p = point(g, 0.98, f + 0.008); ctx.lineTo(p[0], p[1]);
    ctx.stroke();
    ctx.restore();
    return wob;
  }
  function drawIce(ctx, env, g, wob) {
    var Ri = g.iceR;
    var cx = g.cx + Math.sin(env.t * 0.45) * g.R * 0.006;
    var cy = point(g, 0, g.fLiq)[1] - Ri * 0.30 + wob * g.GH;
    ctx.save();
    /* clear ice: a weak body, strong Fresnel edge */
    ctx.beginPath(); ctx.arc(cx, cy, Ri, 0, TAU);
    var body = ctx.createRadialGradient(cx - Ri * 0.28, cy - Ri * 0.32, Ri * 0.05, cx, cy, Ri * 1.03);
    body.addColorStop(0, 'rgba(206,230,236,0.10)');
    body.addColorStop(0.55, 'rgba(110,158,174,0.07)');
    body.addColorStop(0.86, 'rgba(150,196,208,0.14)');
    body.addColorStop(1, rgba(P.cool, 0.52));
    ctx.fillStyle = body; ctx.fill();
    ctx.save(); ctx.clip();
    /* fracture planes, turned by Space */
    var i, x0, y0, x1, y1;
    var planes = [[-0.72, -0.38, 0.50, 0.62], [-0.30, -0.82, 0.72, 0.30], [-0.88, 0.22, 0.28, -0.66],
                  [0.12, -0.92, -0.44, 0.72], [-0.55, 0.70, 0.82, -0.18]];
    for (i = 0; i < planes.length; i++) {
      var pl = planes[i], c = Math.cos(st.ice), s = Math.sin(st.ice);
      var rot = function (x, y) { return [cx + (x * c - y * s) * Ri, cy + (x * s + y * c) * Ri]; };
      var A = rot(pl[0], pl[1]), B = rot(pl[2], pl[3]);
      ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]);
      ctx.strokeStyle = rgba(P.bright, 0.11 + 0.06 * (i % 2)); ctx.lineWidth = Math.max(1, Ri * 0.012); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]);
      ctx.lineTo(B[0] + Ri * 0.10, B[1] - Ri * 0.07); ctx.closePath();
      ctx.fillStyle = rgba(P.cool, 0.055); ctx.fill();
    }
    /* a thread of fine bubbles at the core */
    for (i = 0; i < bubbles.length; i++) {
      var bb = bubbles[i], c2 = Math.cos(st.ice), s2 = Math.sin(st.ice);
      var bx = cx + (bb.x * c2 - bb.y * s2) * Ri;
      var by = cy + (bb.x * s2 + bb.y * c2) * Ri;
      ctx.fillStyle = 'rgba(238,248,250,0.34)';
      ctx.beginPath(); ctx.arc(bx, by, Math.max(0.7, bb.r * Ri / 150), 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 0.7; ctx.stroke();
    }
    /* the part under the liquid takes the amber of a long path */
    var ly = point(g, 0, g.fLiq)[1];
    ctx.fillStyle = rgba(P.amber, 0.20);
    ctx.fillRect(cx - Ri, ly, Ri * 2, Ri * 2);
    ctx.restore();
    /* wet film and the moving water line */
    ctx.strokeStyle = rgba(P.bright, 0.62); ctx.lineWidth = Math.max(1, Ri * 0.014);
    ctx.beginPath(); ctx.arc(cx, cy, Ri * 0.97, -2.55 + Math.sin(st.light) * 0.22, -1.08 + Math.sin(st.light) * 0.18); ctx.stroke();
    ctx.strokeStyle = rgba(P.cool, 0.30); ctx.lineWidth = Math.max(1, Ri * 0.009);
    ctx.beginPath(); ctx.arc(cx, cy, Ri * 1.005, 0.30, 2.15); ctx.stroke();
    ctx.strokeStyle = rgba(P.bright, 0.30); ctx.lineWidth = Math.max(1, Ri * 0.006);
    ctx.beginPath(); ctx.arc(cx, cy + Ri * 0.02, Ri * 0.92, -2.15, -0.95); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, Ri, 0, TAU);
    ctx.strokeStyle = rgba(P.bright, 0.52); ctx.lineWidth = Math.max(1, Ri * 0.010); ctx.stroke();
    /* water line where the sphere meets the liquid */
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, Ri, 0, TAU); ctx.clip();
    ctx.strokeStyle = rgba(P.bright, 0.42); ctx.lineWidth = Math.max(1, Ri * 0.010);
    ctx.beginPath(); ctx.ellipse(cx, ly, Ri * 0.99, Ri * 0.10, 0, 0, TAU); ctx.stroke();
    ctx.restore();
    ctx.restore();
  }
  function drawCondensation(ctx, g, wob) {
    var i, b, p, r;
    ctx.save();
    for (i = 0; i < beads.length; i++) {
      b = beads[i];
      p = point(g, b.u, b.f + wob * 0.4);
      r = Math.max(0.8, b.r * g.R / 230);
      ctx.fillStyle = 'rgba(18,24,26,0.42)';
      ctx.beginPath(); ctx.ellipse(p[0] + r * 0.3, p[1] + r * 0.4, r, r * 1.25, 0, 0, TAU); ctx.fill();
      ctx.globalAlpha = 0.55 + b.a * 0.45;
      ctx.drawImage(beadTile, p[0] - r * 1.6, p[1] - r * 2.0, r * 3.2, r * 4.0);
      ctx.globalAlpha = 1;
    }
    /* one bead has run down and left a track */
    var tu = 0.34, pT = point(g, tu, 0.635), pB = point(g, tu - 0.012, 0.965);
    ctx.strokeStyle = 'rgba(210,226,226,0.30)'; ctx.lineWidth = Math.max(1.5, g.R * 0.010);
    ctx.beginPath();
    ctx.moveTo(pT[0], pT[1]);
    ctx.bezierCurveTo(pT[0] + g.R * 0.02, (pT[1] + pB[1]) * 0.5, pT[0] - g.R * 0.015, (pT[1] + pB[1]) * 0.7, pB[0], pB[1]);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.20)'; ctx.lineWidth = Math.max(0.6, g.R * 0.003);
    ctx.beginPath(); ctx.moveTo(pT[0] - 1, pT[1]); ctx.lineTo(pB[0] - 1, pB[1]); ctx.stroke();
    ctx.fillStyle = 'rgba(232,244,244,0.62)';
    ctx.beginPath(); ctx.ellipse(pB[0], pB[1], g.R * 0.018, g.R * 0.026, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawTumbler(ctx, env, g, rays) {
    drawStone(ctx, env, g);
    drawCaustics(ctx, env, g, rays);
    ctx.save();
    glassOutline(ctx, g); ctx.clip();
    var shell = ctx.createLinearGradient(g.cx - g.R, 0, g.cx + g.R, 0);
    shell.addColorStop(0, 'rgba(180,208,216,0.22)');
    shell.addColorStop(0.18, 'rgba(30,44,50,0.34)');
    shell.addColorStop(0.50, 'rgba(12,20,24,0.50)');
    shell.addColorStop(0.82, 'rgba(36,52,58,0.32)');
    shell.addColorStop(1, 'rgba(196,220,226,0.24)');
    ctx.fillStyle = shell; ctx.fillRect(g.cx - g.R, g.top - g.ryTop, g.R * 2, g.GH + g.ryTop + g.ryBot);
    drawFlutes(ctx, g, rays);
    drawDiamonds(ctx, g);
    drawBase(ctx, g);
    var wob = drawLiquid(ctx, env, g);
    drawIce(ctx, env, g, wob);
    drawCondensation(ctx, g, wob);
    /* one long soft box and one thin rim, reflected in the glass */
    var lx = g.cx + Math.cos(st.light + Math.PI) * g.R * 0.60;
    var box = ctx.createLinearGradient(lx - g.R * 0.30, 0, lx + g.R * 0.30, 0);
    box.addColorStop(0, 'rgba(244,240,224,0)');
    box.addColorStop(0.5, 'rgba(244,240,224,0.33)');
    box.addColorStop(1, 'rgba(244,240,224,0)');
    ctx.fillStyle = box; ctx.fillRect(lx - g.R * 0.30, g.top - g.ryTop, g.R * 0.60, g.GH + g.ryTop + g.ryBot);
    var core = ctx.createLinearGradient(lx - g.R * 0.055, 0, lx + g.R * 0.055, 0);
    core.addColorStop(0, 'rgba(255,250,232,0)'); core.addColorStop(0.5, 'rgba(255,250,232,0.20)');
    core.addColorStop(1, 'rgba(255,250,232,0)');
    ctx.fillStyle = core; ctx.fillRect(lx - g.R * 0.055, g.top - g.ryTop, g.R * 0.11, g.GH + g.ryTop + g.ryBot);
    var rim = ctx.createLinearGradient(g.cx + g.R * 0.82, 0, g.cx + g.R, 0);
    rim.addColorStop(0, 'rgba(139,169,187,0)'); rim.addColorStop(1, rgba(P.cool, 0.60));
    ctx.fillStyle = rim; ctx.fillRect(g.cx + g.R * 0.82, g.top - g.ryTop, g.R * 0.18, g.GH + g.ryTop + g.ryBot);
    ctx.restore();
    /* outer rim, inner rim: real glass thickness */
    ctx.save();
    ctx.strokeStyle = rgba(P.pale, 0.55); ctx.lineWidth = Math.max(1.2, g.R * 0.008);
    ctx.beginPath(); ctx.ellipse(g.cx, g.top, g.R, g.ryTop, 0, 0, TAU); ctx.stroke();
    ctx.strokeStyle = rgba(P.cool, 0.32); ctx.lineWidth = Math.max(1, g.R * 0.005);
    ctx.beginPath(); ctx.ellipse(g.cx, g.top + g.ryTop * 0.10, g.R * 0.925, g.ryTop * 0.90, 0, 0, TAU); ctx.stroke();
    ctx.strokeStyle = rgba(P.pale, 0.28); ctx.lineWidth = Math.max(1, g.R * 0.005);
    ctx.beginPath(); ctx.ellipse(g.cx, g.base, g.R * 0.985, g.ryBot, 0, 0, TAU); ctx.stroke();
    ctx.strokeStyle = rgba(P.amber, 0.30); ctx.lineWidth = Math.max(1, g.R * 0.004);
    ctx.beginPath(); ctx.ellipse(g.cx, g.base - g.R * 0.055, g.R * 0.90, g.ryBot * 0.78, 0, 0, TAU); ctx.stroke();
    /* thickness at the two vertical edges */
    ctx.strokeStyle = rgba(P.cool, 0.24); ctx.lineWidth = Math.max(1, g.R * 0.012);
    ctx.beginPath(); ctx.moveTo(g.cx - g.R * 0.945, g.top + g.ryTop * 0.3);
    ctx.lineTo(g.cx - g.R * 0.94, g.base); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(g.cx + g.R * 0.945, g.top + g.ryTop * 0.3);
    ctx.lineTo(g.cx + g.R * 0.94, g.base); ctx.stroke();
    ctx.restore();
    if (g.low) {
      /* low view: the liquid bends the cut lines behind it */
      ctx.save(); glassOutline(ctx, g); ctx.clip();
      for (var i = 0; i < 9; i++) {
        var y = point(g, 0, g.fLiq)[1] + (i + 1) * (g.base - point(g, 0, g.fLiq)[1]) / 10;
        ctx.strokeStyle = rgba(i % 2 ? P.pale : P.amber, 0.06);
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(g.cx - g.R, y);
        ctx.quadraticCurveTo(g.cx, y + Math.sin(st.light + i) * g.R * 0.035, g.cx + g.R, y);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  /* ---------------- view 3: top, down into the star cut ---------------- */
  function drawTop(ctx, env, rays) {
    var w = env.w, h = env.h, cx = w * 0.5, cy = h * 0.51;
    var R = Math.min(w * 0.355, h * 0.425);
    drawStone(ctx, env, { cx: cx, base: cy + R * 0.9, R: R, GH: R * 1.8, top: cy - R });
    ctx.save(); ctx.globalAlpha = 0.42; drawCaustics(ctx, env, { cx: cx, base: cy + R * 0.9, R: R }, rays); ctx.restore();
    /* thick base with the star cut seen from above */
    var base = ctx.createRadialGradient(cx, cy, R * 0.05, cx, cy, R);
    base.addColorStop(0, 'rgba(206,174,118,0.30)');
    base.addColorStop(0.55, 'rgba(86,62,34,0.30)');
    base.addColorStop(0.86, 'rgba(36,44,46,0.46)');
    base.addColorStop(1, 'rgba(176,204,212,0.35)');
    ctx.fillStyle = base; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
    var N = 12, i, a0, a1, am, r0, r1, flash;
    for (i = 0; i < N; i++) {
      a0 = TAU * i / N; a1 = TAU * (i + 1) / N; am = (a0 + a1) * 0.5;
      r0 = R * 0.18; r1 = R * (i % 2 ? 0.62 : 0.92);
      flash = Math.pow(Math.max(0, Math.sin(am + st.light)), 5);
      var pA = [cx + Math.cos(a0) * r0, cy + Math.sin(a0) * r0];
      var pB = [cx + Math.cos(am) * r1, cy + Math.sin(am) * r1];
      var pC = [cx + Math.cos(a1) * r0, cy + Math.sin(a1) * r0];
      ctx.beginPath(); ctx.moveTo(pA[0], pA[1]); ctx.lineTo(pB[0], pB[1]); ctx.lineTo(pC[0], pC[1]); ctx.closePath();
      var fg = ctx.createLinearGradient(pA[0], pA[1], pB[0], pB[1]);
      fg.addColorStop(0, rgba(P.cool, 0.10));
      fg.addColorStop(1, rgba(P.bright, 0.08 + 0.38 * flash));
      ctx.fillStyle = fg; ctx.fill();
      ctx.strokeStyle = rgba(P.pale, 0.18 + 0.55 * flash); ctx.lineWidth = Math.max(0.8, R * 0.004); ctx.stroke();
    }
    ctx.strokeStyle = rgba(P.pale, 0.55); ctx.lineWidth = Math.max(1.2, R * 0.008);
    ctx.beginPath(); ctx.arc(cx, cy, R * 0.96, 0, TAU); ctx.stroke();
    ctx.strokeStyle = rgba(P.cool, 0.34); ctx.lineWidth = Math.max(1, R * 0.005);
    ctx.beginPath(); ctx.arc(cx, cy, R * 0.88, 0, TAU); ctx.stroke();
    /* amber liquid ring between the wall and the ice */
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R * 0.84, 0, TAU); ctx.clip();
    var liq = ctx.createRadialGradient(cx, cy, R * 0.20, cx, cy, R * 0.86);
    liq.addColorStop(0, rgba(P.amber, 0.30));
    liq.addColorStop(0.55, rgba(P.deep, 0.52));
    liq.addColorStop(1, rgba(P.amber, 0.32));
    ctx.fillStyle = liq; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    ctx.restore();
    /* clear ice sphere, fracture planes and bubble thread */
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R * 0.42, 0, TAU);
    ctx.fillStyle = G.radial(ctx, cx - R * 0.12, cy - R * 0.14, R * 0.02, cx, cy, R * 0.45,
      [[0, 'rgba(226,242,244,0.20)'], [0.7, 'rgba(126,174,190,0.13)'], [1, rgba(P.cool, 0.35)]]);
    ctx.fill();
    ctx.save(); ctx.clip();
    for (i = 0; i < 7; i++) {
      var aa = st.ice + i * 0.86;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(aa) * R * 0.40, cy + Math.sin(aa) * R * 0.40);
      ctx.lineTo(cx + Math.cos(aa + 1.2) * R * 0.34, cy + Math.sin(aa + 1.2) * R * 0.34);
      ctx.strokeStyle = rgba(P.bright, 0.17); ctx.lineWidth = Math.max(1, R * 0.007); ctx.stroke();
    }
    for (i = 0; i < 12; i++) {
      var qa = st.ice + 0.35, qy = (i - 5.5) * R * 0.032;
      var bx = cx + (qy * Math.sin(qa) + Math.cos(qa) * R * 0.01);
      var by = cy + (qy * Math.cos(qa));
      ctx.fillStyle = 'rgba(240,250,250,0.55)';
      ctx.beginPath(); ctx.arc(bx, by, Math.max(0.7, R * 0.005), 0, TAU); ctx.fill();
    }
    ctx.restore();
    ctx.strokeStyle = rgba(P.bright, 0.55); ctx.lineWidth = Math.max(1, R * 0.008);
    ctx.beginPath(); ctx.arc(cx, cy, R * 0.42, -2.5, -0.9); ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = rgba(P.amber, 0.42); ctx.lineWidth = Math.max(1, R * 0.005);
    ctx.beginPath(); ctx.arc(cx, cy, R * 0.845, 0, TAU); ctx.stroke();
  }

  /* ---------------- view 4: one cut edge and its spectrum --------------- */
  function drawMacro(ctx, env, rays) {
    var w = env.w, h = env.h;
    var bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#182126'); bg.addColorStop(0.45, '#0a1115'); bg.addColorStop(1, '#050809');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    var S = Math.min(w, h);
    ctx.save();
    ctx.translate(w * 0.5, h * 0.5); ctx.rotate(-0.62);
    /* a single diamond cut: two polished faces meeting on a sharp edge */
    var A = [-S * 0.95, -S * 0.18], B = [S * 0.95, S * 0.02], C = [S * 0.95, -S * 0.70], D = [-S * 0.95, -S * 1.0];
    var E2 = [-S * 0.95, S * 0.85], F = [S * 0.95, S * 0.95];
    var g1 = ctx.createLinearGradient(0, -S * 0.7, 0, S * 0.1);
    g1.addColorStop(0, 'rgba(76,112,126,0.68)');
    g1.addColorStop(0.48, 'rgba(226,242,244,0.30)');
    g1.addColorStop(1, 'rgba(8,14,18,0.78)');
    ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.lineTo(C[0], C[1]); ctx.lineTo(D[0], D[1]); ctx.closePath();
    ctx.fillStyle = g1; ctx.fill();
    var g2 = ctx.createLinearGradient(0, S * 0.0, 0, S * 0.9);
    g2.addColorStop(0, 'rgba(226,242,244,0.32)');
    g2.addColorStop(0.52, rgba(P.amber, 0.22));
    g2.addColorStop(1, 'rgba(6,10,12,0.82)');
    ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.lineTo(F[0], F[1]); ctx.lineTo(E2[0], E2[1]); ctx.closePath();
    ctx.fillStyle = g2; ctx.fill();
    var flash = 0.35 + 0.65 * Math.pow(Math.max(0, Math.sin(0.8 + st.light)), 4);
    ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]);
    ctx.strokeStyle = rgba(P.bright, 0.42 + 0.45 * flash);
    ctx.lineWidth = Math.max(2, S * 0.006); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(A[0] + 1, A[1] - 2); ctx.lineTo(B[0] + 1, B[1] - 2);
    ctx.strokeStyle = rgba(P.cool, 0.32); ctx.lineWidth = Math.max(1, S * 0.002); ctx.stroke();
    /* neighbouring cuts, sharp parallel edges */
    for (var fi = 1; fi < 5; fi++) {
      var fy = A[1] - S * 0.075 * fi;
      ctx.beginPath(); ctx.moveTo(A[0], fy); ctx.lineTo(B[0], fy + S * 0.18);
      ctx.strokeStyle = rgba(fi % 2 ? P.cool : P.pale, 0.10 + 0.16 * flash / fi);
      ctx.lineWidth = Math.max(0.7, S * 0.0016); ctx.stroke();
    }
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (var si = 0; si < 3; si++) {
      ctx.beginPath();
      ctx.ellipse(-S * 0.06 + si * S * 0.05, -S * 0.30 - si * S * 0.04,
        S * (0.55 - si * 0.06), S * (0.078 - si * 0.008), -0.18, 0, TAU);
      ctx.fillStyle = rgba(si === 1 ? P.bright : P.cool, si === 1 ? 0.23 : 0.10);
      ctx.fill();
    }
    ctx.restore();
    /* small spectrum: real refraction angles for the three wavelengths */
    var cr = rays.length ? rays[Math.floor(rays.length / 2)] : null;
    var bend = cr && cr.cols.length > 1 ? Math.abs(cr.cols[2].vx - cr.cols[0].vx) : 0;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    var spectrum = [P.amber, '#e0a65a', P.bright, P.cool, P.violet];
    for (var i = 0; i < 5; i++) {
      var off = (i - 2) * Math.max(1.6, S * (0.0035 + bend * 0.02));
      var reach = (i === 2 ? 1 : 0.76 + 0.05 * i) * (0.86 + bend * 0.5);
      ctx.beginPath();
      ctx.moveTo(-S * 0.55 * reach, S * 0.03 + off);
      ctx.lineTo(S * 0.62 * reach, S * 0.03 + off + (i - 2) * S * 0.002);
      ctx.strokeStyle = rgba(spectrum[i], 0.18 + 0.38 * flash);
      ctx.lineWidth = Math.max(1, S * 0.0035); ctx.stroke();
    }
    ctx.restore();
    ctx.restore();
    /* bead of water on the cut face, with an internal caustic */
    var bx = w * 0.31, by = h * 0.70, br = Math.max(12, S * 0.075);
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.beginPath(); ctx.ellipse(bx + br * 0.12, by + br * 0.18, br * 1.1, br * 1.25, 0, 0, TAU); ctx.fill();
    var dg = ctx.createRadialGradient(bx - br * 0.35, by - br * 0.45, br * 0.05, bx, by, br * 1.25);
    dg.addColorStop(0, 'rgba(255,255,255,0.82)');
    dg.addColorStop(0.30, 'rgba(174,208,216,0.38)');
    dg.addColorStop(0.74, 'rgba(30,52,58,0.24)');
    dg.addColorStop(1, 'rgba(8,14,16,0.62)');
    ctx.fillStyle = dg;
    ctx.beginPath(); ctx.ellipse(bx, by, br, br * 1.18, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba(P.bright, 0.55); ctx.lineWidth = Math.max(1, br * 0.06);
    ctx.beginPath(); ctx.ellipse(bx, by, br, br * 1.18, 0, 0, TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.70)';
    ctx.beginPath(); ctx.ellipse(bx - br * 0.36, by - br * 0.46, br * 0.18, br * 0.10, -0.4, 0, TAU); ctx.fill();
    ctx.fillStyle = rgba(P.amber, 0.30);
    ctx.beginPath(); ctx.arc(bx + br * 0.26, by + br * 0.30, br * 0.20, 0, TAU); ctx.fill();
    ctx.restore();
    /* condensation beads and the run track, very close */
    ctx.save();
    ctx.strokeStyle = 'rgba(222,236,236,0.24)'; ctx.lineWidth = Math.max(1, S * 0.005);
    ctx.beginPath();
    ctx.moveTo(w * 0.76, h * 0.18);
    ctx.bezierCurveTo(w * 0.775, h * 0.36, w * 0.755, h * 0.52, w * 0.77, h * 0.66);
    ctx.stroke();
    ctx.fillStyle = 'rgba(238,250,248,0.52)';
    ctx.beginPath(); ctx.ellipse(w * 0.77, h * 0.66, S * 0.012, S * 0.019, 0, 0, TAU); ctx.fill();
    for (var j = 0; j < 18; j++) {
      var px = w * (0.56 + 0.39 * ((j * 0.37) % 1)), py = h * (0.14 + 0.72 * ((j * 0.61) % 1));
      var rr = Math.max(1.2, S * 0.004) * (0.55 + (j % 4) * 0.55);
      ctx.fillStyle = 'rgba(240,248,246,0.40)';
      ctx.beginPath(); ctx.arc(px, py, rr, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      ctx.beginPath(); ctx.arc(px - rr * 0.3, py - rr * 0.35, rr * 0.24, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }

  /* ---------------- brief, dial with tolerance rings ---------------- */
  function drawBrief(ctx, env) {
    var w = env.w, h = env.h;
    var size = cl(Math.min(w, h) * 0.0122, 9, 13);
    var x = w - Math.max(18, w * 0.026);
    var y = Math.max(98, h * 0.14);
    var names = ['035', '150', '265'];
    ctx.save();
    T(ctx, "KEY LIGHT MARKS", x, y, size, rgba(P.cool, 0.76), { family: MONO, align: 'right', tracking: 1.3 });
    for (var i = 0; i < 3; i++) {
      T(ctx, 'Key ' + names[i] + ' deg  +/- 8  ' + (st.matched[i] ? 'SET' : 'open'),
        x, y + size * (1.9 + i * 1.55), size * 0.96,
        st.matched[i] ? rgba(P.green, 0.85) : rgba(P.ink, 0.70), { family: MONO, align: 'right' });
    }
    T(ctx, 'Ice seam 090 deg, key 265  ' + (st.matched[3] ? 'SET' : 'open'),
      x, y + size * 6.55, size * 0.96,
      st.matched[3] ? rgba(P.green, 0.85) : rgba(P.ink, 0.70), { family: MONO, align: 'right' });
    ctx.fillStyle = rgba(P.amber, 0.36); ctx.fillRect(x - size * 10.5, y + size * 0.5, size * 10.5, 1);
    ctx.restore();
    /* dial */
    var dr = cl(Math.min(w, h) * 0.065, 30, 58);
    var dx = w - dr - Math.max(20, w * 0.035);
    var dy = h - dr - Math.max(58, h * 0.075);
    ctx.save();
    ctx.strokeStyle = rgba(P.ink, 0.20); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(dx, dy, dr, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.arc(dx, dy, dr * 0.72, 0, TAU); ctx.stroke();
    for (i = 0; i < 3; i++) {
      var a = MARKS[i];
      var col = st.matched[i] ? P.green : P.amber;
      ctx.strokeStyle = rgba(col, 0.72); ctx.lineWidth = Math.max(2, dr * 0.10);
      ctx.beginPath(); ctx.arc(dx, dy, dr, a - TOL, a + TOL); ctx.stroke();
      ctx.strokeStyle = rgba(col, 0.38); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(dx, dy, dr * 1.12, a - TOL, a + TOL); ctx.stroke();
      ctx.beginPath(); ctx.arc(dx, dy, dr * 0.88, a - TOL, a + TOL); ctx.stroke();
      var mx = dx + Math.cos(a) * dr, my = dy + Math.sin(a) * dr;
      ctx.fillStyle = rgba(col, 0.92);
      ctx.beginPath(); ctx.arc(mx, my, st.matched[i] ? 3.5 : 2.4, 0, TAU); ctx.fill();
    }
    /* key light needle and ice needle */
    var lx = dx + Math.cos(st.light) * dr * 0.94, ly = dy + Math.sin(st.light) * dr * 0.94;
    ctx.strokeStyle = rgba(P.bright, 0.88); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(dx, dy); ctx.lineTo(lx, ly); ctx.stroke();
    ctx.fillStyle = rgba(P.bright, 0.95);
    ctx.beginPath(); ctx.arc(lx, ly, 3.2, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba(P.cool, 0.70); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(dx, dy, dr * 0.52, ICE_MARK - ICE_TOL, ICE_MARK + ICE_TOL); ctx.stroke();
    var ix = dx + Math.cos(st.ice) * dr * 0.52, iy = dy + Math.sin(st.ice) * dr * 0.52;
    ctx.strokeStyle = rgba(P.cool, 0.78); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(dx, dy); ctx.lineTo(ix, iy); ctx.stroke();
    T(ctx, deg(st.light) + ' deg', dx, dy - dr - 9, Math.max(8, dr * 0.20), rgba(P.ink, 0.66),
      { family: MONO, align: 'center' });
    ctx.restore();
  }
  function viewDots(ctx, env) {
    var w = env.w, h = env.h, i;
    var gap = Math.max(14, Math.min(w, h) * 0.022);
    for (i = 1; i <= 4; i++) {
      var x = w * 0.5 + (i - 2.5) * gap;
      ctx.beginPath(); ctx.arc(x, h - Math.max(22, h * 0.038), i === st.view ? 3.4 : 2.1, 0, TAU);
      ctx.fillStyle = i === st.view ? rgba(P.amber, 0.92) : 'rgba(239,231,214,0.28)'; ctx.fill();
    }
  }

  /* ---------------- state, bot, progress ---------------- */
  function bot(t) {
    if (t < 3.5) {
      st.light = lp(0.08, MARKS[0], sm(0, 3.5, t)); st.view = st.urlView || 1;
    } else if (t < 5.2) {
      st.light = MARKS[0]; st.view = 2;
    } else if (t < 8.2) {
      st.light = lp(MARKS[0], MARKS[1], sm(5.2, 8.2, t)); st.view = st.urlView || 1;
    } else if (t < 9.6) {
      st.light = MARKS[1]; st.view = 4;
    } else if (t < 12.6) {
      st.light = lp(MARKS[1], MARKS[2], sm(9.6, 12.6, t)); st.view = 1;
    } else if (t < 13.6) {
      st.light = MARKS[2]; st.view = 1;
    } else {
      st.light = MARKS[2];
      st.ice = lp(0.22, ICE_MARK, sm(13.6, 16.6, t));
      st.view = 3;
    }
    /* progress is a pure function of the frozen time as well */
    st.matched[0] = t >= 3.5;
    st.matched[1] = t >= 8.2;
    st.matched[2] = t >= 12.6;
    st.matched[3] = t >= 16.6;
  }
  function attract(t) {
    st.light = wrap(2.55 + 2.10 * Math.sin(t * 0.28));
    st.ice = 0.22 + 0.05 * Math.sin(t * 0.11);
    st.view = st.urlView || 1;
    st.spin = false;
  }
  function update(env) {
    var inp = env.input, t = env.t, dt = env.frozen ? 0 : env.dt;
    var manual = !env.auto && env.started;
    if (env.auto) bot(t);
    else if (!manual) attract(t);
    else {
      var i;
      for (i = 1; i <= 4; i++) {
        if (inp.justPressed('Digit' + i) || inp.justPressed('Numpad' + i)) st.view = i;
      }
      if (inp.isDown('ArrowLeft')) st.light = wrap(st.light - dt * 0.95);
      if (inp.isDown('ArrowRight')) st.light = wrap(st.light + dt * 0.95);
      if (inp.justPressed('ArrowLeft')) st.light = wrap(st.light - 0.06);
      if (inp.justPressed('ArrowRight')) st.light = wrap(st.light + 0.06);
      st.spin = inp.isDown('Space');
      if (inp.justPressed('Space')) st.ice = wrap(st.ice + 0.07);
      if (st.spin) st.ice = wrap(st.ice + dt * 0.72);
      var clicks = inp.consumeClicks();
      for (i = 0; i < clicks.length; i++) {
        if (clicks[i].released) st.dragging = false;
        else st.dragging = true;
      }
      if (inp.mouse.left && st.dragging) st.light = wrap(st.light + inp.mouse.dragX * 0.0065);
      var look = inp.consumeLook();
      if (look.x) st.light = wrap(st.light + look.x * 0.006);
    }
    st.light = wrap(st.light);
    st.ice = wrap(st.ice);
    return manual || env.auto;
  }
  function progress(env, rays) {
    var live = env.started || env.auto || st.forceDone;
    if (!live) return;
    var i;
    if (!env.auto && !st.forceDone) {
      for (i = 0; i < 3; i++) {
        if (angDiff(st.light, MARKS[i]) <= TOL) st.matched[i] = true;
      }
      if (angDiff(st.ice, ICE_MARK) <= ICE_TOL && angDiff(st.light, MARKS[2]) <= 0.30) st.matched[3] = true;
    } else if (st.forceDone) {
      for (i = 0; i < 4; i++) st.matched[i] = true;
    }
    for (i = 0; i < 4; i++) {
      var key = i < 3 ? 'light-mark-' + (i + 1) : 'ice-orientation';
      if (st.matched[i] && !st['mark_' + key]) {
        st['mark_' + key] = 1;
        Arcade.mark(ID, key);
        Arcade.sound.chord([660, 880, 1100], 0.32, 0.035);
      }
    }
    /* which facet is flashing; a quiet glass chime when the flash moves on */
    var best = -1, bestV = -1;
    for (i = 0; i < rays.length; i++) {
      if (rays[i].flash > bestV) { bestV = rays[i].flash; best = i; }
    }
    if (best >= 0 && best !== st.lastFlash && bestV > 0.30 && env.t - st.lastChime > 0.32) {
      st.lastFlash = best; st.lastChime = env.t;
      Arcade.sound.tone({ freq: 720 + best * 24, dur: 0.22, gain: 0.032, type: 'sine' });
      Arcade.sound.noise({ dur: 0.05, gain: 0.018, freq: 4200 });
    }
    var all = st.matched[0] && st.matched[1] && st.matched[2] && st.matched[3];
    if (all && !st.finished && (!env.auto || env.t >= 16.9)) {
      st.finished = true;
      var score = 1350;
      Arcade.score(ID, score);
      Arcade.finish({
        score: score, stars: 3,
        title: 'You set key light',
        lines: ['You match three key-light marks.', 'Ice seam: 090 degrees.', 'Lead crystal and clear ice.'],
        seconds: Math.round(env.t)
      });
    }
  }

  function onFrame(ctx, env) {
    var g = geometry(env);
    var playing = update(env);
    var rays = caustics(env, g);
    if (st.view === 1 || st.view === 2) drawTumbler(ctx, env, g, rays);
    else if (st.view === 3) drawTop(ctx, env, rays);
    else drawMacro(ctx, env, rays);
    drawBrief(ctx, env);
    viewDots(ctx, env);
    if (playing) progress(env, rays);
    G.vignette(ctx, env.w, env.h, 0.50);
    G.grain(ctx, env.w, env.h, 0.052);
    var tone = ctx.createLinearGradient(0, 0, env.w, env.h);
    tone.addColorStop(0, 'rgba(38,32,20,0.10)'); tone.addColorStop(0.55, 'rgba(0,0,0,0)');
    tone.addColorStop(1, rgba(P.amber, 0.035));
    ctx.fillStyle = tone; ctx.fillRect(0, 0, env.w, env.h);
  }
})();
