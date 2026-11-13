(function () {
  'use strict';

  var G = Arcade.gfx;
  var cl = Arcade.clamp, lp = Arcade.lerp, sm = Arcade.smooth;
  var ID = 'many-hands';
  var D = 68;
  var P = {
    night: '#25203a', wall: '#312845', wall2: '#3a2c48', ink: '#f7e9d2',
    coral: '#ee7b55', coralLight: '#f9a47c', coralDark: '#c2583d', outline: '#241a30',
    gold: '#e9b45f', paper: '#f2e4c9', wood: '#6a4634', woodDark: '#3e2925',
    green: '#8fae7c', shadow: 'rgba(14,10,24,.42)'
  };
  var SERIF = 'Georgia, "Times New Roman", serif';
  var SANS = '"Helvetica Neue", Arial, sans-serif';

  /* Shot list. Time in seconds of one 68 s loop.
     0-8   The board: too many notes. Hero looks at its two arms, taps its head.
     8-17  The split: soft pops into 2, 4 and 8 smaller copies, each with a ring of light.
     17-41 Eight jobs: on the beat, one note at a time leaves the board. Work begins.
     41-54 The music box: the eight parts arrive in a chain, the lid opens, it plays.
     54-62 The merge: pop by pop back into one tired body; the sleepy copy comes last.
     62-68 Dawn, a yawn, the last note torn off to find another, a look at camera. */
  var SCENES = [
    { t: 0, n: 'The board' }, { t: 8, n: 'The split' }, { t: 17, n: 'Eight jobs' },
    { t: 41, n: 'The music box' }, { t: 54, n: 'The merge' }, { t: 62, n: 'Dawn' }
  ];
  var JOB = [
    { short: 'WATER', full: 'water the fern' },
    { short: 'CLOCK', full: 'wind the clock' },
    { short: 'PENCIL', full: 'carry the pencil' },
    { short: 'PLAN', full: 'draw the plan' },
    { short: 'PAINT', full: 'paint the dial' },
    { short: 'SCREWS', full: 'sort the screws' },
    { short: 'MANUAL', full: 'read the manual' },
    { short: 'REST', full: 'rest a moment' }
  ];
  var st = {
    clock: 0, paused: false, hover: 0, lastBeat: -1,
    assigned: [false, false, false, false, false, false, false, false],
    assignAt: [0, 0, 0, 0, 0, 0, 0, 0],
    playStart: null, finaleStart: null, done: false, mode: 'attract', hoverNote: -1
  };
  var caches = { key: '' };
  var E = Arcade.boot({
    id: ID, title: 'Many hands',
    hint: 'Click the eight notes or press 1-8. Press Space to pause. Hover to show the scrub bar.',
    background: P.night, ink: P.ink, scroll: false, sections: 1,
    onFrame: onFrame
  });

  var viewMap = { board: 1, split: 10, jobs: 22, box: 46, build: 46, merge: 58, dawn: 64, end: 67.4 };
  var vkey = E.view || E.state;
  if (Object.prototype.hasOwnProperty.call(viewMap, vkey)) st.clock = viewMap[vkey];
  else if (/^[1-4]$/.test(vkey)) st.clock = [0, 10, 30, 51][parseInt(vkey, 10) - 1];
  if (E.state === 'end') st.clock = 67.4;

  function pulse(x, a, b) { return Math.max(0, 1 - Math.abs(x - (a + b) / 2) / ((b - a) / 2 || 1)); }
  function ring(ctx, x, y, p, s, alpha) {
    if (p <= 0 || p >= 1) return;
    ctx.save();
    ctx.globalAlpha = (1 - p) * (alpha === undefined ? 0.7 : alpha);
    ctx.strokeStyle = '#ffe0a0'; ctx.lineWidth = 3 * (1 - p) + 1;
    ctx.beginPath(); ctx.ellipse(x, y, s * (0.3 + p * 1.5), s * (0.22 + p * 1.1), 0, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
  function T(ctx, s, x, y, size, color, o) { G.copyText(ctx, s, x, y, size, color, o || {}); }

  function stage() {
    var k = Math.min(E.w / 1280, E.h / 720);
    if (!(k > 0) || !isFinite(k)) k = 1;
    var VW = E.w / k, VH = E.h / k, tall = VH > 1000, u = tall ? 1.5 : 1;
    var cx = VW / 2, ground = VH * 0.78;
    var bw = Math.min(VW * 0.46, 620 * u);
    var bh = Math.min(VH * 0.20, 620 * u);
    var board = { x: tall ? (VW - bw) / 2 : VW * 0.12, y: VH * 0.10, w: bw, h: bh };
    return {
      k: k, VW: VW, VH: VH, cx: cx, ground: ground, u: u, tall: tall, board: board,
      textV: cl(11 / k, 13, 42), titleV: cl(34 / k, 46, 130),
      hero: { x: tall ? cx : cx - VW * 0.20, y: ground - 58 * u },
      box: { x: cx + VW * 0.17, y: ground - 50 * u },
      lamp: { x: tall ? VW * 0.18 : VW * 0.14, y: VH * 0.18 }
    };
  }
  function station(L, i) {
    if (L.tall) {
      var col = i % 2, row = Math.floor(i / 2);
      return { x: L.cx + (col - 0.5) * L.VW * 0.46, y: L.ground - (3.5 - row) * L.VH * 0.105 };
    }
    return { x: L.cx + (i - 3.5) * L.VW * 0.143, y: L.ground - 22 * L.u + (i % 2) * -14 * L.u };
  }
  function noteRects(L) {
    var cols = L.tall ? 2 : 4, rows = 8 / cols, pad = 11 * L.u;
    var nw = (L.board.w - pad * (cols + 1)) / cols;
    var nh = (L.board.h - pad * (rows + 1)) / rows;
    var out = [];
    for (var i = 0; i < 8; i++) {
      var c = i % cols, r = Math.floor(i / cols);
      out.push({ x: L.board.x + pad + c * (nw + pad), y: L.board.y + pad + r * (nh + pad), w: nw, h: nh, i: i });
    }
    return out;
  }
  function noteAt(L, x, y) {
    var a = noteRects(L);
    for (var i = 0; i < a.length; i++) {
      if (x >= a[i].x && x <= a[i].x + a[i].w && y >= a[i].y && y <= a[i].y + a[i].h) return i;
    }
    return -1;
  }

  function buildCaches(L) {
    var key = Math.round(L.VW) + 'x' + Math.round(L.VH);
    if (caches.key === key) return;
    caches.key = key;
    var r = Arcade.rng(E.seed);
    var cw = Math.ceil(L.VW / 2), ch = Math.ceil(L.VH / 2);
    caches.wall = G.offscreen(cw, ch, function (c, w, h) {
      var g = G.linear(c, 0, 0, w * 0.3, h,
        [[0, '#1d1930'], [0.45, '#312845'], [0.8, '#3a2b45'], [1, '#271e34']]);
      c.fillStyle = g; c.fillRect(0, 0, w, h);
      // painted flat bands on the workshop wall
      c.fillStyle = 'rgba(255,213,151,.045)'; c.fillRect(0, h * 0.14, w, h * 0.10);
      c.fillStyle = 'rgba(20,14,34,.18)'; c.fillRect(0, h * 0.24, w, h * 0.05);
      c.fillStyle = 'rgba(255,213,151,.03)'; c.fillRect(0, h * 0.44, w, h * 0.11);
      for (var i = 0; i < 26; i++) {
        c.fillStyle = r() < 0.5 ? 'rgba(255,232,190,.022)' : 'rgba(12,8,24,.04)';
        c.beginPath(); c.ellipse(r() * w, r() * h * 0.6, 30 + r() * 190, 18 + r() * 70, 0, 0, Math.PI * 2); c.fill();
      }
      // planks on the far wall
      c.strokeStyle = 'rgba(14,10,24,.18)'; c.lineWidth = 2;
      for (var j = 1; j < 9; j++) { c.beginPath(); c.moveTo(0, h * j / 9); c.lineTo(w, h * j / 9); c.stroke(); }
    });
    caches.wood = G.offscreen(1024, 256, function (c, w, h) {
      var g = G.linear(c, 0, 0, 0, h, [[0, '#7b5138'], [0.3, P.wood], [1, P.woodDark]]);
      c.fillStyle = g; c.fillRect(0, 0, w, h);
      for (var i = 0; i < 260; i++) {
        c.strokeStyle = r() < 0.5 ? 'rgba(30,17,14,.13)' : 'rgba(255,208,150,.07)';
        c.lineWidth = 0.6 + r() * 2.2;
        var y = r() * h;
        c.beginPath(); c.moveTo(0, y);
        c.bezierCurveTo(w * 0.3, y + (r() - 0.5) * 9, w * 0.7, y + (r() - 0.5) * 9, w, y + (r() - 0.5) * 6);
        c.stroke();
      }
      for (var k = 0; k < 9; k++) {
        var x = r() * w, yy = r() * h;
        c.strokeStyle = 'rgba(35,20,16,.18)'; c.lineWidth = 1.5;
        c.beginPath(); c.ellipse(x, yy, 13 + r() * 20, 4 + r() * 5, 0, 0, Math.PI * 2); c.stroke();
      }
    });
    caches.paper = G.offscreen(180, 120, function (c, w, h) {
      c.fillStyle = P.paper; c.fillRect(0, 0, w, h);
      var g = G.radial(c, w * 0.4, h * 0.3, 5, w * 0.5, h * 0.6, w,
        [[0, 'rgba(255,255,255,.45)'], [1, 'rgba(130,96,58,.18)']]);
      c.fillStyle = g; c.fillRect(0, 0, w, h);
      for (var i = 0; i < 340; i++) {
        c.fillStyle = r() < 0.5 ? 'rgba(120,86,48,.08)' : 'rgba(255,255,255,.20)';
        c.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r());
      }
      c.strokeStyle = 'rgba(60,38,26,.25)'; c.lineWidth = 1;
      c.strokeRect(5, 5, w - 10, h - 10);
    });
  }

  function workshop(ctx, L, t) {
    var dawn = sm(61, 66.5, t);
    ctx.drawImage(caches.wall, 0, 0, L.VW, L.VH);
    // window: painted night sky, stars, then dawn
    var wx = L.tall ? L.VW * 0.62 : L.VW * 0.78, wy = L.VH * 0.08;
    var ww = L.tall ? L.VW * 0.32 : L.VW * 0.18, wh = Math.min(L.VH * 0.28, 290 * L.u);
    ctx.save();
    ctx.fillStyle = '#1a1730'; G.rr(ctx, wx - 9, wy - 9, ww + 18, wh + 18, 8); ctx.fill();
    var sky = G.linear(ctx, 0, wy, 0, wy + wh,
      [[0, '#293152'], [0.55, '#342d50'], [1, '#46365a']]);
    ctx.fillStyle = sky; ctx.fillRect(wx, wy, ww, wh);
    ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip();
    for (var i = 0; i < 46; i++) {
      var sx = wx + Arcade.hash(i, 3) * ww, sy = wy + Arcade.hash(i, 9) * wh * 0.8;
      var tw = 0.4 + 0.6 * Math.sin(t * 1.7 + i * 2.3);
      ctx.globalAlpha = (1 - dawn) * tw;
      ctx.fillStyle = '#f9efce';
      ctx.beginPath(); ctx.arc(sx, sy, 1 + Arcade.hash(i, 17) * 1.8, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = dawn;
    ctx.fillStyle = G.linear(ctx, 0, wy, 0, wy + wh, [[0, '#f4a97c'], [1, '#f7d5a0']]);
    ctx.fillRect(wx, wy, ww, wh);
    G.glow(ctx, wx + ww * 0.74, wy + wh * 0.62, ww * 0.6, 'rgba(255,199,128,.55)');
    ctx.restore();
    ctx.strokeStyle = '#1a1428'; ctx.lineWidth = 7; ctx.strokeRect(wx, wy, ww, wh);
    ctx.strokeStyle = 'rgba(233,180,95,.55)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh);
    ctx.moveTo(wx, wy + wh / 2); ctx.lineTo(wx + ww, wy + wh / 2); ctx.stroke();
    ctx.restore();

    // desk and its front edge
    var dy = L.ground - 34 * L.u;
    ctx.drawImage(caches.wood, 0, dy, L.VW, L.VH - dy);
    ctx.fillStyle = 'rgba(233,180,95,.18)'; ctx.fillRect(0, dy, L.VW, 3);
    ctx.fillStyle = 'rgba(14,10,20,.36)'; ctx.fillRect(0, L.VH - 22 * L.u, L.VW, 22 * L.u);
    // long soft shadows from the lamp
    ctx.save(); ctx.globalAlpha = 0.28 * (1 - dawn * 0.6);
    ctx.fillStyle = '#140e20';
    ctx.beginPath(); ctx.ellipse(L.cx + L.VW * 0.19, dy + 26 * L.u, L.VW * 0.34, 18 * L.u, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    // the warm lamp
    var lx = L.lamp.x, ly = L.lamp.y;
    ctx.save();
    ctx.fillStyle = '#20182f'; ctx.fillRect(lx - 4, ly, 8, dy - ly);
    ctx.beginPath();
    ctx.moveTo(lx - 52 * L.u, ly + 38 * L.u); ctx.lineTo(lx + 52 * L.u, ly + 38 * L.u);
    ctx.lineTo(lx + 28 * L.u, ly - 22 * L.u); ctx.lineTo(lx - 28 * L.u, ly - 22 * L.u); ctx.closePath();
    ctx.fillStyle = '#d39b53'; ctx.fill();
    ctx.strokeStyle = P.outline; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = 'rgba(255,231,170,.85)';
    ctx.beginPath(); ctx.ellipse(lx, ly + 38 * L.u, 40 * L.u, 8 * L.u, 0, 0, Math.PI * 2); ctx.fill();
    G.glow(ctx, lx, ly + 52 * L.u, 300 * L.u * (1 - dawn * 0.45), 'rgba(255,196,104,.42)');
    var cone = G.linear(ctx, lx, ly + 40 * L.u, lx + L.VW * 0.18, dy,
      [[0, 'rgba(255,214,140,.22)'], [1, 'rgba(255,214,140,0)']]);
    ctx.fillStyle = cone;
    ctx.beginPath(); ctx.moveTo(lx - 50 * L.u, ly + 48 * L.u); ctx.lineTo(lx + 50 * L.u, ly + 48 * L.u);
    ctx.lineTo(lx + L.VW * 0.26, dy); ctx.lineTo(lx - L.VW * 0.10, dy); ctx.closePath(); ctx.fill();
    ctx.restore();

    // soft depth haze in front of the far wall
    ctx.save();
    var haze = G.linear(ctx, 0, L.VH * 0.22, 0, L.ground,
      [[0, 'rgba(31,24,50,0)'], [1, 'rgba(31,24,50,.30)']]);
    ctx.fillStyle = haze; ctx.fillRect(0, L.VH * 0.22, L.VW, L.ground - L.VH * 0.22);
    ctx.restore();
  }

  function board(ctx, L, t, assigned, hoverNote, notes) {
    var b = L.board;
    ctx.save();
    ctx.fillStyle = 'rgba(12,8,20,.35)';
    G.rr(ctx, b.x + 8 * L.u, b.y + 10 * L.u, b.w, b.h, 8); ctx.fill();
    var cork = G.linear(ctx, b.x, b.y, b.x, b.y + b.h,
      [[0, '#8c5f3d'], [0.5, '#70492f'], [1, '#593822']]);
    ctx.fillStyle = cork; G.rr(ctx, b.x, b.y, b.w, b.h, 7); ctx.fill();
    ctx.save(); G.rr(ctx, b.x, b.y, b.w, b.h, 7); ctx.clip();
    for (var i = 0; i < 90; i++) {
      ctx.fillStyle = Arcade.hash(i, 4) > 0.5 ? 'rgba(255,220,166,.08)' : 'rgba(31,18,12,.10)';
      ctx.fillRect(b.x + Arcade.hash(i, 1) * b.w, b.y + Arcade.hash(i, 2) * b.h,
        3 + Arcade.hash(i, 7) * 12, 2 + Arcade.hash(i, 8) * 5);
    }
    ctx.restore();
    ctx.strokeStyle = '#2a1c24'; ctx.lineWidth = 6 * L.u; G.rr(ctx, b.x, b.y, b.w, b.h, 7); ctx.stroke();
    ctx.strokeStyle = 'rgba(233,180,95,.4)'; ctx.lineWidth = 1.6 * L.u; G.rr(ctx, b.x + 4, b.y + 4, b.w - 8, b.h - 8, 5); ctx.stroke();
    for (var n = 0; n < notes.length; n++) {
      var q = notes[n], idx = q.i;
      var rot = (Arcade.hash(idx, 12) - 0.5) * 0.10;
      var lift = assigned[idx] ? 0 : Math.sin(t * 1.2 + idx) * 1.5 * L.u;
      ctx.save();
      ctx.translate(q.x + q.w / 2, q.y + q.h / 2 + lift);
      ctx.rotate(rot);
      ctx.globalAlpha = assigned[idx] ? 0.28 : 1;
      ctx.drawImage(caches.paper, -q.w / 2, -q.h / 2, q.w, q.h);
      ctx.strokeStyle = hoverNote === idx && !assigned[idx] ? '#e9b45f' : 'rgba(58,38,26,.34)';
      ctx.lineWidth = hoverNote === idx ? 3 * L.u : 1.2 * L.u;
      ctx.strokeRect(-q.w / 2, -q.h / 2, q.w, q.h);
      ctx.fillStyle = '#b5533c';
      ctx.beginPath(); ctx.arc(0, -q.h / 2 + 4 * L.u, 3.2 * L.u, 0, Math.PI * 2); ctx.fill();
      var fs = Math.min(q.h * 0.38, L.textV * 1.15);
      T(ctx, String(idx + 1), -q.w / 2 + q.w * 0.09, -q.h / 2 + fs * 1.1, fs * 0.72, '#9b7047',
        { family: SANS, weight: '600', align: 'left' });
      T(ctx, JOB[idx].short, 0, q.h * 0.16 + fs * 0.3, fs, '#3d2b23',
        { family: SANS, weight: '600', align: 'center', tracking: 0.6 });
      ctx.restore();
    }
    // one more note hidden under the last one, revealed at dawn
    if (t > 64) {
      ctx.save(); ctx.translate(L.board.x + L.board.w * 0.5, L.board.y + L.board.h + 10 * L.u);
      ctx.rotate(-0.06); ctx.globalAlpha = sm(64.4, 65.4, t) * 0.96;
      ctx.drawImage(caches.paper, -58 * L.u, -26 * L.u, 116 * L.u, 52 * L.u);
      ctx.strokeStyle = 'rgba(58,38,26,.4)'; ctx.lineWidth = 1; ctx.strokeRect(-58 * L.u, -26 * L.u, 116 * L.u, 52 * L.u);
      T(ctx, '9', 0, 10 * L.u, Math.min(28 * L.u, L.textV), '#9b7047', { family: SERIF, align: 'center' });
      ctx.restore();
    }
    ctx.restore();
  }

  function claude(ctx, x, y, s, o) {
    o = o || {};
    var h = s * 0.72, r = s * 0.24, dark = P.outline;
    var walk = o.walk ? Math.sin((o.time || 0) * 13 + (o.phase || 0)) : 0;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(o.tilt || 0);
    ctx.scale(o.sx || 1, o.sy || 1);
    ctx.beginPath(); ctx.ellipse(0, h * 0.5 + s * 0.13, s * 0.46, s * 0.10, 0, 0, Math.PI * 2);
    ctx.fillStyle = P.shadow; ctx.fill();
    // four short legs in a row
    for (var l = 0; l < 4; l++) {
      var lx = (-0.33 + l * 0.22) * s;
      var ly = h * 0.42 + (walk ? Math.sin((o.time || 0) * 13 + l * 1.9) * s * 0.035 : 0);
      ctx.beginPath(); G.rr(ctx, lx - s * 0.065, ly, s * 0.13, s * 0.20, s * 0.06);
      ctx.fillStyle = P.coralDark; ctx.fill();
      ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, s * 0.022); ctx.stroke();
    }
    // two stub arms
    for (var a = 0; a < 2; a++) {
      var side = a === 0 ? -1 : 1;
      ctx.save(); ctx.translate(side * s * 0.46, h * 0.02);
      ctx.rotate(side * (a === 0 ? (o.armL || 0.35) : -(o.armR || 0.35)));
      ctx.beginPath(); G.rr(ctx, -s * 0.075, -s * 0.01, s * 0.26, s * 0.135, s * 0.065);
      ctx.fillStyle = P.coral; ctx.fill();
      ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, s * 0.022); ctx.stroke();
      ctx.restore();
    }
    // body with three flat toon bands
    var body = G.linear(ctx, -s / 2, -h / 2, s * 0.3, h / 2,
      [[0, '#fbb08a'], [0.42, P.coralLight], [0.7, P.coral], [1, '#d86645']]);
    ctx.beginPath(); G.rr(ctx, -s / 2, -h / 2, s, h, r);
    ctx.fillStyle = body; ctx.fill();
    ctx.save();
    ctx.beginPath(); G.rr(ctx, -s / 2, -h / 2, s, h, r); ctx.clip();
    ctx.fillStyle = 'rgba(138,52,40,.30)'; ctx.fillRect(-s / 2, h * 0.10, s, h * 0.42);
    ctx.fillStyle = 'rgba(255,226,178,.26)'; ctx.fillRect(-s / 2, -h / 2, s, h * 0.17);
    ctx.fillStyle = 'rgba(255,220,160,.20)';
    ctx.beginPath(); ctx.ellipse(s * 0.34, h * 0.02, s * 0.13, h * 0.46, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.beginPath(); G.rr(ctx, -s / 2, -h / 2, s, h, r);
    ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1.4, s * 0.032); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s * 0.42, -h * 0.30); ctx.quadraticCurveTo(s * 0.50, 0, s * 0.40, h * 0.30);
    ctx.strokeStyle = 'rgba(255,222,163,.72)'; ctx.lineWidth = Math.max(1, s * 0.026); ctx.stroke();
    // eyes, blush, no mouth or nose
    var ex = s * 0.215, ey = -h * 0.07, blink = o.blink ? 0.12 : 1;
    ctx.fillStyle = 'rgba(255,142,140,.38)';
    ctx.beginPath(); ctx.ellipse(-ex - s * 0.03, ey + h * 0.20, s * 0.105, s * 0.055, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(ex + s * 0.03, ey + h * 0.20, s * 0.105, s * 0.055, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1.2, s * 0.038); ctx.lineCap = 'round';
    if (o.sleep) {
      for (var q = 0; q < 2; q++) {
        var sx = (q ? 1 : -1) * ex;
        ctx.beginPath(); ctx.moveTo(sx - s * 0.085, ey + s * 0.02);
        ctx.quadraticCurveTo(sx, ey + s * 0.075, sx + s * 0.085, ey + s * 0.02); ctx.stroke();
      }
    } else if (o.happy) {
      for (var k = 0; k < 2; k++) {
        var hx = (k ? 1 : -1) * ex;
        ctx.beginPath(); ctx.moveTo(hx - s * 0.08, ey + s * 0.05);
        ctx.quadraticCurveTo(hx, ey - s * 0.10, hx + s * 0.08, ey + s * 0.05); ctx.stroke();
      }
    } else {
      for (var e = 0; e < 2; e++) {
        var px = (e ? 1 : -1) * ex;
        ctx.beginPath(); ctx.ellipse(px, ey, s * 0.075, s * 0.108 * blink, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#281b30'; ctx.fill();
        ctx.beginPath(); ctx.ellipse(px - s * 0.022, ey - s * 0.035 * blink, s * 0.023, s * 0.030 * blink, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,250,231,.92)'; ctx.fill();
      }
    }
    ctx.restore();
  }

  function prop(ctx, L, i, t, active) {
    var p = station(L, i), u = L.u;
    ctx.save(); ctx.translate(p.x, p.y);
    ctx.beginPath(); ctx.ellipse(0, 4 * u, 52 * u, 10 * u, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(14,10,22,.32)'; ctx.fill();
    if (i === 0) { // fern in a pot, taller than three Claudes
      ctx.beginPath(); ctx.moveTo(-19 * u, 0); ctx.lineTo(19 * u, 0);
      ctx.lineTo(14 * u, -28 * u); ctx.lineTo(-14 * u, -28 * u); ctx.closePath();
      ctx.fillStyle = '#b76a49'; ctx.fill(); ctx.strokeStyle = P.outline; ctx.lineWidth = 2; ctx.stroke();
      for (var f = 0; f < 5; f++) {
        var a = -Math.PI / 2 + (f - 2) * 0.34 + Math.sin(t * 1.3 + f) * 0.05;
        ctx.beginPath(); ctx.moveTo(0, -28 * u);
        ctx.quadraticCurveTo(Math.cos(a) * 26 * u, -70 * u, Math.cos(a) * 58 * u, -108 * u);
        ctx.strokeStyle = '#4e7b57'; ctx.lineWidth = 5 * u; ctx.stroke();
        for (var lf = 1; lf <= 3; lf++) {
          var fx = Math.cos(a) * (16 + lf * 14) * u, fy = -28 * u - lf * 27 * u;
          ctx.beginPath(); ctx.ellipse(fx, fy, 10 * u, 4 * u, a + 0.5, 0, Math.PI * 2);
          ctx.fillStyle = '#75a578'; ctx.fill();
        }
      }
      if (active) {
        for (var d = 0; d < 5; d++) {
          var dy = (t * 36 + d * 23) % 95;
          ctx.beginPath(); ctx.arc(-8 * u + Math.sin(d * 2.3) * 12 * u, -120 * u + dy * u,
            2.2 * u, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(174,214,225,.8)'; ctx.fill();
        }
      }
    } else if (i === 1) { // clock, wound from inside
      ctx.beginPath(); ctx.arc(0, -32 * u, 30 * u, 0, Math.PI * 2);
      ctx.fillStyle = '#e1bd82'; ctx.fill(); ctx.strokeStyle = P.outline; ctx.lineWidth = 3; ctx.stroke();
      ctx.beginPath(); ctx.arc(0, -32 * u, 23 * u, 0, Math.PI * 2);
      ctx.fillStyle = '#f5e5c6'; ctx.fill(); ctx.stroke();
      var hand = active ? t * 2.4 : 0.6;
      ctx.beginPath(); ctx.moveTo(0, -32 * u); ctx.lineTo(Math.cos(hand) * 16 * u, -32 * u + Math.sin(hand) * 16 * u);
      ctx.moveTo(0, -32 * u); ctx.lineTo(Math.cos(hand * 0.2) * 11 * u, -32 * u + Math.sin(hand * 0.2) * 11 * u);
      ctx.strokeStyle = '#3d2b2c'; ctx.lineWidth = 2.6 * u; ctx.stroke();
      ctx.fillStyle = '#3d2b2c'; ctx.beginPath(); ctx.arc(0, -32 * u, 3 * u, 0, Math.PI * 2); ctx.fill();
    } else if (i === 2 || i === 3) { // one pencil carried like a log, and the plan drawn under it
      ctx.save(); ctx.rotate(-0.08 + Math.sin(t * 1.6) * 0.015);
      ctx.beginPath(); G.rr(ctx, -60 * u, -12 * u, 120 * u, 13 * u, 3 * u);
      ctx.fillStyle = '#e5b756'; ctx.fill(); ctx.strokeStyle = P.outline; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#d88e4a'; ctx.fillRect(-60 * u, -12 * u, 12 * u, 13 * u);
      ctx.beginPath(); ctx.moveTo(60 * u, -12 * u); ctx.lineTo(72 * u, -5.5 * u); ctx.lineTo(60 * u, 1 * u); ctx.closePath();
      ctx.fillStyle = '#d9bc93'; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(68 * u, -8 * u); ctx.lineTo(72 * u, -5.5 * u); ctx.lineTo(68 * u, -3 * u); ctx.closePath();
      ctx.fillStyle = '#3b343a'; ctx.fill();
      ctx.restore();
      if (i === 3) {
        ctx.beginPath(); ctx.moveTo(-42 * u, 3 * u); ctx.lineTo(42 * u, 3 * u); ctx.lineTo(42 * u, 28 * u); ctx.lineTo(-42 * u, 28 * u); ctx.closePath();
        ctx.fillStyle = '#eee0c3'; ctx.fill(); ctx.strokeStyle = P.outline; ctx.lineWidth = 1.6; ctx.stroke();
        for (var r = 0; r < 3; r++) {
          ctx.beginPath(); ctx.moveTo(-34 * u, (10 + r * 6) * u);
          ctx.lineTo((active ? 10 + Math.sin(t * 3 + r) * 20 : -12) * u, (10 + r * 6) * u);
          ctx.strokeStyle = 'rgba(70,50,42,.5)'; ctx.lineWidth = 1.2; ctx.stroke();
        }
      }
    } else if (i === 4) { // paint
      ctx.beginPath(); G.rr(ctx, -16 * u, -26 * u, 32 * u, 26 * u, 5 * u);
      ctx.fillStyle = '#7d9bb3'; ctx.fill(); ctx.strokeStyle = P.outline; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, -26 * u, 16 * u, 5 * u, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#c98f4e'; ctx.fill();
      ctx.save(); ctx.rotate(-0.7 + (active ? Math.sin(t * 5) * 0.25 : 0));
      ctx.fillStyle = '#a9764a'; ctx.fillRect(-3 * u, -56 * u, 6 * u, 34 * u);
      ctx.fillStyle = '#8b6d62'; ctx.fillRect(-4 * u, -66 * u, 8 * u, 12 * u);
      ctx.restore();
    } else if (i === 5) { // screws in a dish
      ctx.beginPath(); ctx.ellipse(0, -6 * u, 40 * u, 13 * u, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#9ca7ad'; ctx.fill(); ctx.strokeStyle = P.outline; ctx.lineWidth = 2; ctx.stroke();
      for (var q = 0; q < 7; q++) {
        var xx = -30 * u + (q * 10 + (active ? Math.sin(t * 2 + q) * 2 : 0)) * u;
        ctx.save(); ctx.translate(xx, -9 * u - (q % 3) * 3 * u); ctx.rotate(q * 0.8);
        ctx.fillStyle = '#d8d0bd'; ctx.fillRect(-4 * u, -2 * u, 9 * u, 3 * u);
        ctx.strokeStyle = '#4b4040'; ctx.lineWidth = 1; ctx.strokeRect(-4 * u, -2 * u, 9 * u, 3 * u);
        ctx.restore();
      }
    } else if (i === 6) { // manual, upside down
      ctx.save(); ctx.rotate(Math.PI + 0.12);
      ctx.beginPath(); G.rr(ctx, -28 * u, -22 * u, 56 * u, 40 * u, 3 * u);
      ctx.fillStyle = '#d9c79b'; ctx.fill(); ctx.strokeStyle = P.outline; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#f2e6c9'; ctx.fillRect(-24 * u, -18 * u, 48 * u, 32 * u);
      for (var m = 0; m < 4; m++) {
        ctx.fillStyle = 'rgba(70,52,40,.42)';
        ctx.fillRect(-18 * u, (-10 + m * 7) * u, (28 + (m % 2) * 9) * u, 2 * u);
      }
      ctx.restore();
    } else { // a cushion for the sleepy copy
      ctx.beginPath(); ctx.ellipse(0, -6 * u, 42 * u, 16 * u, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#8e6c8e'; ctx.fill(); ctx.strokeStyle = P.outline; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, -10 * u, 34 * u, 10 * u, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(233,180,95,.35)'; ctx.fill();
      ctx.beginPath(); ctx.moveTo(-40 * u, 4 * u); ctx.quadraticCurveTo(0, -18 * u, 40 * u, 4 * u);
      ctx.strokeStyle = 'rgba(40,26,40,.5)'; ctx.lineWidth = 2; ctx.stroke();
    }
    ctx.restore();
  }

  function musicBox(ctx, L, t) {
    var b = L.box, u = L.u;
    var build = sm(41, 51.5, t), glowOn = sm(49, 53, t), dawn = sm(61, 66, t);
    if (build <= 0.001) return;
    var w = 150 * u, h = 58 * u;
    ctx.save();
    ctx.globalAlpha = build;
    ctx.beginPath(); ctx.ellipse(b.x, b.y + h * 0.6, w * 0.72, 14 * u, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(12,8,20,.4)'; ctx.fill();
    G.glow(ctx, b.x, b.y - 6 * u, 190 * u * (0.5 + glowOn), 'rgba(255,198,104,' + (0.30 + glowOn * 0.55) + ')');
    // lid
    ctx.save(); ctx.translate(b.x - w / 2, b.y - h / 2); ctx.rotate(-0.55 * build);
    ctx.beginPath(); G.rr(ctx, -w * 0.9, -h * 0.34, w * 0.94, h * 0.38, 5 * u);
    ctx.fillStyle = '#8d5738'; ctx.fill(); ctx.strokeStyle = P.outline; ctx.lineWidth = 2.6 * u; ctx.stroke();
    ctx.beginPath(); G.rr(ctx, -w * 0.84, -h * 0.28, w * 0.82, h * 0.24, 3 * u);
    ctx.fillStyle = '#c79356'; ctx.fill(); ctx.stroke();
    ctx.restore();
    // case
    ctx.beginPath(); G.rr(ctx, b.x - w / 2, b.y - h / 2, w, h, 6 * u);
    var wood = G.linear(ctx, b.x - w / 2, b.y - h / 2, b.x + w / 2, b.y + h / 2,
      [[0, '#b87948'], [0.5, '#8d5738'], [1, '#5d362a']]);
    ctx.fillStyle = wood; ctx.fill(); ctx.strokeStyle = P.outline; ctx.lineWidth = 3 * u; ctx.stroke();
    ctx.fillStyle = '#f3cf80'; G.rr(ctx, b.x - w * 0.43, b.y - h * 0.36, w * 0.86, h * 0.72, 4 * u); ctx.fill();
    // pinned cylinder and comb teeth
    ctx.save(); ctx.globalAlpha = 0.5 + glowOn * 0.5;
    var spin = t * 2.6 * glowOn;
    ctx.beginPath(); ctx.ellipse(b.x - w * 0.12, b.y - h * 0.05, 23 * u, 16 * u, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#d6ad5c'; ctx.fill(); ctx.strokeStyle = '#5d3d26'; ctx.lineWidth = 1.6 * u; ctx.stroke();
    for (var p = 0; p < 9; p++) {
      var a = spin + p * Math.PI * 2 / 9;
      ctx.beginPath(); ctx.arc(b.x - w * 0.12 + Math.cos(a) * 17 * u, b.y - h * 0.05 + Math.sin(a) * 11 * u, 2 * u, 0, Math.PI * 2);
      ctx.fillStyle = '#fff0bb'; ctx.fill();
    }
    for (var q = 0; q < 8; q++) {
      ctx.fillStyle = '#8a5c3a'; ctx.fillRect(b.x + 10 * u + q * 6 * u, b.y - 10 * u, 3 * u, (14 + q % 3 * 3) * u);
    }
    ctx.restore();
    // crank
    ctx.beginPath(); ctx.moveTo(b.x + w / 2, b.y); ctx.lineTo(b.x + w / 2 + 20 * u, b.y);
    ctx.lineTo(b.x + w / 2 + 20 * u, b.y - 12 * u);
    ctx.strokeStyle = '#d7aa62'; ctx.lineWidth = 4 * u; ctx.stroke();
    // light beams on the beat
    if (glowOn > 0.01) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (var k = 0; k < 8; k++) {
        var ang = -Math.PI * 0.9 + k * Math.PI * 0.22 + Math.sin(t * 2 + k) * 0.06;
        ctx.globalAlpha = glowOn * 0.16 * (1 - dawn * 0.6);
        ctx.beginPath(); ctx.moveTo(b.x, b.y - 12 * u);
        ctx.lineTo(b.x + Math.cos(ang) * 300 * u, b.y - 12 * u + Math.sin(ang) * 300 * u);
        ctx.lineTo(b.x + Math.cos(ang + 0.09) * 300 * u, b.y - 12 * u + Math.sin(ang + 0.09) * 300 * u);
        ctx.closePath(); ctx.fillStyle = '#ffd489'; ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();
  }

  function queuePos(L, i) {
    var b = L.board;
    return { x: b.x + b.w * (0.18 + (i % 4) * 0.21), y: L.ground - 24 * L.u + Math.floor(i / 4) * 16 * L.u };
  }

  function drawCast(ctx, L, t, assigned, assignAt, clock) {
    var u = L.u, hero = L.hero;
    var split = sm(8.2, 15.5, t), merge = sm(54, 61.5, t);
    var dawn = sm(61, 66, t);
    var small = 66 * u;

    if (t < 8.2 || t > 61.5) {
      var alone = claude;
      var thinking = t < 8.2 ? (t > 6.2 ? sm(6.2, 7.6, t) : 0) : 0;
      var yawn = t > 61.5 ? pulse(t, 61.8, 63.4) : 0;
      alone(ctx, hero.x, hero.y - Math.sin(t * 1.6) * 2 * u, 96 * u, {
        time: t, tilt: Math.sin(t * 0.8) * 0.03 + thinking * 0.07,
        armL: 0.3 + thinking * 0.9, armR: 0.3 + thinking * 0.5,
        blink: Math.sin(t * 1.4) > 0.985, happy: dawn > 0.82 && t < 65.5,
        sx: 1 + yawn * 0.12, sy: 1 - yawn * 0.10,
        sleep: t > 64.8 && t < 65.4
      });
      if (t > 62 && t < 66) {
        // the last note in the hero's hand
        ctx.save(); ctx.translate(hero.x + 70 * u, hero.y - 6 * u); ctx.rotate(0.16);
        ctx.drawImage(caches.paper, -16 * u, -11 * u, 32 * u, 22 * u); ctx.restore();
      }
      return;
    }

    if (t < 17) {
      // splitting: anticipation, squash, then soft pops and rings
      var n = Math.min(8, Math.pow(2, Math.floor(1 + (t - 8.2) / 2.4)));
      if (n < 2) n = 2;
      var sizes = [1, 0.78, 0.62, 0.48];
      var gen = cl(Math.floor((t - 8.2) / 2.4), 0, 3);
      var sz = 96 * u * sizes[Math.min(3, gen)];
      for (var g2 = 0; g2 < 4; g2++) {
        if (g2 === gen) ring(ctx, hero.x, hero.y, (t - 8.2 - g2 * 2.4) / 1.2, sz, 0.65);
      }
      var spread = 26 * u + split * 58 * u;
      for (var c = 0; c < n; c++) {
        var a = Math.PI * 2 * c / n - Math.PI / 2;
        var sx = hero.x + Math.cos(a) * spread * (0.6 + (c % 2) * 0.3);
        var sy = hero.y + Math.sin(a) * spread * 0.48;
        var pop = pulse(t, 8.2 + Math.floor(c / 2) * 2.4, 8.2 + Math.floor(c / 2) * 2.4 + 0.7);
        claude(ctx, sx, sy, sz * (1 + pop * 0.12), {
          time: t + c, tilt: Math.cos(a) * 0.16, sx: 1 - pop * 0.13, sy: 1 + pop * 0.18,
          armL: 0.4 + Math.sin(t * 5 + c) * 0.25, armR: 0.4, happy: c % 3 === 0
        });
      }
      return;
    }

    if (t < 41) {
      for (var i = 0; i < 8; i++) {
        var p = station(L, i);
        var q = cl((t - (17 + i * 1.15)) / 1.35, 0, 1);
        var qp = queuePos(L, i);
        var xx = lp(qp.x, p.x - 34 * u, sm(0, 1, q));
        var yy = lp(qp.y, p.y - 18 * u, sm(0, 1, q)) - Math.sin(q * Math.PI) * 30 * u;
        var work = q >= 1;
        var bob = Math.sin(t * (3.2 + i * 0.24) + i) * (work ? 3 * u : 1.5 * u);
        // the eighth copy is asleep on the cushion from the moment it arrives
        var pose = {
          time: t, phase: i, walk: !work && q > 0.05, tilt: work ? Math.sin(t * 2 + i) * 0.07 : 0.04,
          armL: work ? 0.5 + Math.sin(t * 4 + i) * 0.4 : 0.3,
          armR: work ? 0.5 + Math.cos(t * 4 + i) * 0.4 : 0.3,
          sleep: i === 7, happy: work && i !== 7 && Math.sin(t * 1.1 + i) > 0.6,
          blink: Math.sin(t * 1.6 + i * 2) > 0.98
        };
        claude(ctx, xx, yy + bob, small, pose);
      }
      return;
    }

    if (t < 54) {
      // the chorus: parts arrive in a chain and the box comes together
      var b = L.box;
      for (var j = 0; j < 8; j++) {
        var from = station(L, j);
        var prog = cl((t - (41 + j * 0.75)) / 2.3, 0, 1);
        var ang = -Math.PI / 2 + (j - 3.5) * 0.46;
        var tx = b.x + Math.cos(ang) * 118 * u, ty = b.y + Math.sin(ang) * 74 * u - 8 * u;
        var x2 = lp(from.x - 34 * u, tx, sm(0, 1, prog));
        var y2 = lp(from.y - 18 * u, ty, sm(0, 1, prog)) - Math.sin(prog * Math.PI) * 60 * u;
        var beat = Math.max(0, Math.sin(t * 6.28 + j));
        claude(ctx, x2, y2, small * (0.9 + beat * 0.04), {
          time: t, phase: j, walk: prog < 1, tilt: Math.sin(t * 5 + j) * 0.1,
          armL: 0.9, armR: 0.9, happy: prog > 0.8
        });
        if (prog > 0.2 && prog < 1) ring(ctx, x2, y2, prog, 20 * u, 0.18);
      }
      return;
    }

    // merge, pop by pop; the sleepy one is last
    var count = t < 56 ? 8 : (t < 58.3 ? 4 : (t < 60.4 ? 2 : 1));
    var lastSleep = t > 60.4 && t < 61.6;
    for (var m2 = 0; m2 < count; m2++) {
      var a2 = Math.PI * 2 * m2 / count - Math.PI / 2;
      var rr = (1 - merge) * 150 * u + 20 * u;
      var mx = hero.x + Math.cos(a2) * rr, my = hero.y + Math.sin(a2) * rr * 0.55;
      claude(ctx, mx, my, small + merge * 26 * u, {
        time: t, phase: m2, walk: merge < 0.8, tilt: Math.sin(t * 6 + m2) * 0.09,
        armL: 0.8, armR: 0.8, sleep: lastSleep, happy: merge > 0.6 && !lastSleep
      });
      ring(ctx, mx, my, (t - 54 - Math.floor(m2 / 2) * 1.2) / 1.0, small * 0.8, 0.35);
    }
  }

  function drawPlayCast(ctx, L, t, assigned, assignAt, clock) {
    var u = L.u, small = 66 * u;
    for (var i = 0; i < 8; i++) {
      var q = assigned[i] ? cl((clock - assignAt[i]) / 1.15, 0, 1) : 0;
      var p = station(L, i), qp = queuePos(L, i);
      var xx = lp(qp.x, p.x - 34 * u, sm(0, 1, q));
      var yy = lp(qp.y, p.y - 18 * u, sm(0, 1, q)) - Math.sin(q * Math.PI) * 30 * u;
      if (q >= 1) yy += Math.sin(t * (3.2 + i * 0.24) + i) * 3 * u;
      else yy += Math.sin(t * 1.4 + i) * 1.6 * u;
      claude(ctx, xx, yy, small * (1 + (assigned[i] ? pulse(clock - assignAt[i], 0, 0.35) * 0.12 : 0)), {
        time: t, phase: i, walk: q > 0.02 && q < 1,
        tilt: assigned[i] ? Math.sin(t * 2 + i) * 0.07 : Math.sin(t * 0.8 + i) * 0.03,
        armL: q >= 1 ? 0.5 + Math.sin(t * 4 + i) * 0.4 : 0.28,
        armR: q >= 1 ? 0.5 + Math.cos(t * 4 + i) * 0.4 : 0.28,
        sleep: i === 7 && assigned[i],
        happy: q >= 1 && i !== 7,
        sx: 1 - pulse(clock - assignAt[i], 0, 0.35) * 0.1,
        sy: 1 + pulse(clock - assignAt[i], 0, 0.35) * 0.14
      });
      if (assigned[i] && clock - assignAt[i] < 0.65) {
        ring(ctx, qp.x, qp.y, (clock - assignAt[i]) / 0.65, 24 * u, 0.55);
      }
    }
  }

  function titleCard(ctx, L, t, end) {
    var alpha = end ? sm(66.2, 67.2, t) : 1 - sm(2.4, 3.6, t);
    if (alpha <= 0.005) return;
    ctx.save();
    ctx.globalAlpha = alpha * (end ? 0.88 : 0.72);
    ctx.fillStyle = '#1b1729'; ctx.fillRect(0, 0, L.VW, L.VH);
    ctx.globalAlpha = alpha;
    T(ctx, 'Many hands', L.cx, L.VH * 0.45, L.titleV, P.ink,
      { family: SERIF, align: 'center', baseline: 'middle' });
    T(ctx, end ? 'You find one more note.' : 'You watch a short film.', L.cx, L.VH * 0.45 + L.titleV * 0.72,
      Math.max(15, L.titleV * 0.24), P.gold,
      { family: SANS, align: 'center', tracking: 3 });
    ctx.restore();
  }

  function audioTick() {
    if (E.frozen || st.paused) return;
    var beat = Math.floor(st.clock / 0.5);
    if (beat === st.lastBeat) return;
    st.lastBeat = beat;
    if (!Arcade.sound.enabled) return;
    var b = ((beat % 32) + 32) % 32;
    var chords = [
      [293.66, 369.99, 440.00], [220.00, 277.18, 329.63],
      [246.94, 293.66, 369.99], [196.00, 246.94, 293.66]
    ];
    var bass = [73.42, 55.00, 61.74, 49.00];
    var bar = Math.floor(b / 8) % 4;
    if (b % 8 === 0) {
      Arcade.sound.chord(chords[bar], 1.9, 0.075);
      Arcade.sound.tone({ freq: bass[bar], dur: 1.1, gain: 0.085, type: 'sine' });
    }
    if (b % 8 === 4) Arcade.sound.tone({ freq: bass[bar] * 2, dur: 0.5, gain: 0.045, type: 'triangle' });
    var scale = [587.33, 659.25, 739.99, 880.00, 987.77, 1174.66, 987.77, 880.00];
    var motif = [0, -1, 2, -1, 1, -1, 3, -1, 4, -1, 2, -1, 3, -1, 1, -1,
      0, -1, 2, -1, 3, -1, 5, -1, 4, -1, 3, -1, 1, -1, 0, -1];
    var note = motif[b];
    if (note >= 0) {
      Arcade.sound.tone({ freq: scale[note], dur: 0.27, gain: 0.06, type: 'triangle' });
      Arcade.sound.tone({ freq: scale[note] * 2, dur: 0.12, gain: 0.018, type: 'sine', delay: 0.06 });
    }
    if (b % 2 === 1) Arcade.sound.noise({ dur: 0.055, gain: 0.018, freq: 4200, filter: 'highpass' });
    if (b % 8 === 0) Arcade.sound.noise({ dur: 0.09, gain: 0.035, freq: 220, filter: 'lowpass' });
  }

  function assign(i) {
    if (i < 0 || i > 7 || st.assigned[i]) return;
    st.assigned[i] = true;
    st.assignAt[i] = st.clock;
    Arcade.mark(ID, 'job-' + (i + 1));
    Arcade.sound.tone({ freq: 420 + i * 36, dur: 0.10, gain: 0.075, type: 'sine', slideTo: 900 + i * 40 });
    Arcade.sound.noise({ dur: 0.07, gain: 0.035, freq: 2600, filter: 'bandpass' });
    var n = st.assigned.filter(Boolean).length;
    if (n === 8 && st.finaleStart === null) {
      st.finaleStart = st.clock;
      Arcade.toast('You start all eight jobs.');
      Arcade.sound.chord([293.66, 440, 587.33], 1.2, 0.09);
    }
  }

  function countAssigned() { var n = 0; for (var i = 0; i < 8; i++) if (st.assigned[i]) n++; return n; }

  function update(L) {
    var dt = E.dt || 0;
    if (E.frozen) st.clock = E.t;
    else if (E.auto) st.clock = E.t;
    else if (!st.paused) st.clock += dt;

    if (!E.frozen && !E.auto && E.input.justPressed('Space')) st.paused = !st.paused;
    if (E.started && st.playStart === null) st.playStart = st.clock;

    var m = E.input.mouse;
    if (m.inside && (Math.abs(m.dragX) + Math.abs(m.dragY) > 0 || E.h - m.y < 76)) st.hover = 1.5;
    else if (!E.frozen) st.hover = Math.max(0, st.hover - dt);
    st.hoverNote = m.inside ? noteAt(L, m.x / L.k, m.y / L.k) : -1;

    var clicks = E.input.consumeClicks();
    for (var c = 0; c < clicks.length; c++) {
      var click = clicks[c];
      if (click.released) continue;
      if (!E.frozen && !E.auto && click.y > E.h - 48 && st.hover > 0) {
        var bx = cl(E.w * 0.06, 20, 120), bw = E.w - 2 * bx;
        var frac = cl((click.x - bx) / bw, 0, 1);
        var want = frac * D;
        if (st.mode === 'play' && st.playStart !== null) st.playStart = st.clock - (want - 15);
        else st.clock = want;
        continue;
      }
      var i = noteAt(L, click.x / L.k, click.y / L.k);
      if (i >= 0 && !E.frozen && !E.auto && !st.done) assign(i);
    }
    if (!E.frozen && !E.auto) {
      for (var k = 1; k <= 8; k++) {
        if (E.input.justPressed('Digit' + k)) assign(k - 1);
      }
    }
    if (E.auto && !E.frozen) {
      for (var j = 0; j < 8; j++) {
        if (E.t >= 3 + j * 1.8 && !st.assigned[j]) assign(j);
      }
    }

    var n = countAssigned();
    if (E.frozen) st.mode = 'attract';
    else if (E.auto) st.mode = n === 8 ? 'finale' : 'bot';
    else if (n === 8 && st.finaleStart !== null) st.mode = 'finale';
    else if (E.started) st.mode = 'play';
    else st.mode = 'attract';

    var time;
    if (E.frozen) time = ((E.t % D) + D) % D;
    else if (st.mode === 'finale') time = Math.min(D, 41 + (st.clock - st.finaleStart) * (D - 41) / 20);
    else if (st.mode === 'play' && st.playStart !== null) time = 15 + ((st.clock - st.playStart) % 26);
    else if (st.mode === 'bot') time = Math.min(17, E.t);
    else time = ((st.clock % D) + D) % D;

    audioTick();
    if (!E.frozen && ((st.mode === 'finale' && time >= D - 0.02) || (E.auto && E.t > 45)) && n === 8 && !st.done) {
      st.done = true;
      Arcade.finish({
        score: 800 + Math.round(cl(60 - E.t, 0, 60) * 10), stars: 3,
        title: 'Music box plays',
        lines: ['You start eight jobs', 'The sleepy copy arrives last',
          'You find one more note under the board']
      });
    }
    return time;
  }

  function scrub(ctx, L, time) {
    if (st.hover <= 0) return;
    var alpha = cl(st.hover / 0.5, 0, 1) * 0.92;
    var bx = cl(E.w * 0.06, 20, 120), bw = E.w - 2 * bx, by = E.h - 24;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(18,14,28,.72)'; ctx.fillRect(bx - 8, by - 18, bw + 16, 36);
    ctx.fillStyle = 'rgba(247,233,210,.32)'; ctx.fillRect(bx, by, bw, 2);
    ctx.fillStyle = P.gold; ctx.fillRect(bx, by, bw * cl(time / D, 0, 1), 2);
    for (var i = 0; i < SCENES.length; i++) {
      var x = bx + bw * (SCENES[i].t / D);
      ctx.fillStyle = 'rgba(247,233,210,.55)'; ctx.fillRect(x, by - 5, 1.5, 12);
    }
    var px = bx + bw * cl(time / D, 0, 1);
    ctx.beginPath(); ctx.arc(px, by + 1, 5, 0, Math.PI * 2);
    ctx.fillStyle = P.coral; ctx.fill();
    ctx.strokeStyle = '#1b1729'; ctx.lineWidth = 1.5; ctx.stroke();
    var scene = SCENES[0].n;
    for (var s = 0; s < SCENES.length; s++) if (time >= SCENES[s].t) scene = SCENES[s].n;
    T(ctx, scene.toUpperCase(), bx, by - 7, 11, P.ink, { family: SANS, tracking: 1.6 });
    T(ctx, Math.round(time) + ' / ' + D, bx + bw, by - 7, 11, P.ink,
      { family: SANS, align: 'right', tracking: 1 });
    if (st.paused) T(ctx, 'PAUSED', E.w / 2, by - 7, 11, P.gold,
      { family: SANS, align: 'center', tracking: 2 });
    ctx.restore();
  }

  function onFrame(ctx, env) {
    E = env;
    var L = stage();
    buildCaches(L);
    var time = update(L);
    var notes = noteRects(L);
    var canonical = st.mode === 'attract' || st.mode === 'finale';

    ctx.save();
    ctx.scale(L.k, L.k);
    workshop(ctx, L, time);
    board(ctx, L, time, canonical ? canonicalBoard(time) : st.assigned, st.hoverNote, notes);
    // props and the work itself
    var canonicalActive = canonical ? (time > 17 && time < 54) : false;
    for (var i = 0; i < 8; i++) {
      var active = canonical ? canonicalActive : st.assigned[i];
      prop(ctx, L, i, time, active);
    }
    musicBox(ctx, L, time);
    if (canonical) drawCast(ctx, L, time, st.assigned, st.assignAt, st.clock);
    else if (st.mode === 'bot') {
      drawPlayCast(ctx, L, time, st.assigned, st.assignAt, st.clock);
      for (var pr = 0; pr < 3; pr++) {
        ring(ctx, L.hero.x, L.hero.y, (time - 7 - pr * 2.1) / 1.2, 70 * L.u, 0.4);
      }
    } else drawPlayCast(ctx, L, time, st.assigned, st.assignAt, st.clock);
    // warm rim light over the whole picture and a little contact haze
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    var rim = G.radial(ctx, L.lamp.x, L.lamp.y + 60 * L.u, 20, L.lamp.x, L.lamp.y + 60 * L.u, L.VW * 0.5,
      [[0, 'rgba(255,192,102,.10)'], [1, 'rgba(255,192,102,0)']]);
    ctx.fillStyle = rim; ctx.fillRect(0, 0, L.VW, L.VH);
    ctx.restore();
    titleCard(ctx, L, time, false);
    titleCard(ctx, L, time, true);
    ctx.restore();

    scrub(ctx, L, time);
    G.grain(ctx, E.w, E.h, 0.05);
    G.vignette(ctx, E.w, E.h, 0.26);
  }

  function canonicalBoard(t) {
    var a = [false, false, false, false, false, false, false, false];
    if (t >= 62) return [true, true, true, true, true, true, true, true];
    for (var i = 0; i < 8; i++) a[i] = t > 17 + i * 1.8;
    if (t > 53) for (var j = 0; j < 8; j++) a[j] = true;
    return a;
  }
})();
