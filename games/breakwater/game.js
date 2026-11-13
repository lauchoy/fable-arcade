/* Breakwater - a harbour town, street by street.
   A first-person infantry action in an invented port, one hour after dawn.
   All picture and sound are made in code. Classic script, no modules. */
(function () {
  'use strict';

  var A = window.Arcade, R = window.Raycaster;
  var clamp = A.clamp, lerp = A.lerp, G = A.gfx;
  var PI = Math.PI, TAU = PI * 2;
  var params = new URLSearchParams(window.location.search);
  var ID = 'breakwater';
  var SEED = (parseInt(params.get('seed'), 10) || 2026) >>> 0;
  var RN = A.rng((SEED ^ 0x4b1d77) >>> 0);
  function rr(a, b) { return a + RN() * (b - a); }
  function RND() { return RN(); }
  function wrap(a) { a = (a + PI) % TAU; if (a < 0) a += TAU; return a - PI; }
  function d2(ax, ay, bx, by) { return Math.hypot(ax - bx, ay - by); }
  function pick(a, i) { return a[(i % a.length + a.length) % a.length]; }
  function add(arr, o, n) { arr.push(o); if (arr.length > n) arr.shift(); }

  var C = {
    sky0: '#17222b', sky1: '#33434e', sky2: '#8b8b80', haze: '#a9a394',
    sun: '#f6dfb4', gold: '#c8a06a', steel: '#79a2ad', ink: '#e6e4dd',
    bg: '#262b30', dark: '#10161b', blue: '#4b5c67', olive: '#5b5d49',
    warm: '#e2b976', cold: '#8fa7b0', red: '#d0805c'
  };

  /* ------------------------------------------------------------------ *
   * Procedural materials. Every wall texture is drawn on an offscreen
   * canvas no more than 256 px tall, with chipped edges, soot and rust.
   * ------------------------------------------------------------------ */
  function grime(ctx, w, h, r, n, alpha) {
    for (var i = 0; i < n; i++) {
      ctx.fillStyle = r() < 0.5 ? 'rgba(12,16,19,' + (0.02 + r() * alpha) + ')'
        : 'rgba(226,220,200,' + (0.01 + r() * alpha * 0.6) + ')';
      ctx.fillRect(r() * w, r() * h, 1 + r() * 5, 1 + r() * 3);
    }
  }
  function soot(ctx, w, r, y0, a) {
    var g = ctx.createLinearGradient(0, y0, 0, y0 + 76);
    g.addColorStop(0, 'rgba(14,17,19,' + a + ')');
    g.addColorStop(1, 'rgba(14,17,19,0)');
    ctx.fillStyle = g; ctx.fillRect(0, y0, w, 80);
  }
  function rust(ctx, w, h, r, n) {
    for (var i = 0; i < n; i++) {
      var x = r() * w, y = r() * h * 0.6, len = 20 + r() * 90;
      ctx.strokeStyle = 'rgba(122,74,42,' + (0.05 + r() * 0.13) + ')';
      ctx.lineWidth = 1 + r() * 3;
      ctx.beginPath(); ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + (r() - 0.5) * 5, y + len * 0.5, x + (r() - 0.5) * 7, y + len);
      ctx.stroke();
    }
  }
  function pocks(ctx, w, h, r, n) {
    for (var i = 0; i < n; i++) {
      var x = r() * w, y = r() * h, rad = 1 + r() * 2.4;
      ctx.fillStyle = 'rgba(10,13,15,.7)';
      ctx.beginPath(); ctx.arc(x, y, rad, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(210,205,188,.22)'; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.arc(x, y, rad + 1, 0, TAU); ctx.stroke();
    }
  }
  function edges(ctx, w, h, r) {
    ctx.fillStyle = 'rgba(220,214,196,.10)'; ctx.fillRect(0, 0, 2, h); ctx.fillRect(w - 2, 0, 2, h);
    for (var i = 0; i < 22; i++) {
      ctx.fillStyle = 'rgba(225,218,198,' + (0.03 + r() * 0.1) + ')';
      ctx.fillRect(r() * w, r() * h, 3 + r() * 9, 1);
    }
    var g = ctx.createLinearGradient(0, h - 70, 0, h);
    g.addColorStop(0, 'rgba(22,30,34,0)'); g.addColorStop(1, 'rgba(16,24,30,.55)');
    ctx.fillStyle = g; ctx.fillRect(0, h - 70, w, 70);
  }
  function drawWindow(ctx, x, y, w, h, o, r) {
    ctx.fillStyle = 'rgba(20,24,27,.85)'; ctx.fillRect(x - 4, y - 4, w + 8, h + 8);
    ctx.fillStyle = o.frame || '#73736a'; ctx.fillRect(x - 4, y - 4, w + 8, 4); ctx.fillRect(x - 4, y + h, w + 8, 5);
    ctx.fillStyle = 'rgba(8,12,15,.95)'; ctx.fillRect(x, y, w, h);
    if (o.lit) {
      var g2 = ctx.createRadialGradient(x + w * 0.3, y + h * 0.2, 1, x + w * 0.5, y + h * 0.5, w);
      g2.addColorStop(0, 'rgba(226,166,88,.55)'); g2.addColorStop(1, 'rgba(60,40,24,0)');
      ctx.fillStyle = g2; ctx.fillRect(x, y, w, h);
    }
    if (o.broken) {
      ctx.strokeStyle = 'rgba(190,205,210,.5)'; ctx.lineWidth = 0.8;
      for (var i = 0; i < 5; i++) {
        ctx.beginPath(); ctx.moveTo(x + w * 0.5, y + h * 0.5);
        ctx.lineTo(x + r() * w, y + r() * h); ctx.stroke();
      }
      ctx.fillStyle = 'rgba(120,145,155,.18)'; ctx.fillRect(x, y, w, h);
    } else {
      ctx.fillStyle = 'rgba(120,150,165,.10)';
      ctx.beginPath(); ctx.moveTo(x, y + h * 0.15); ctx.lineTo(x + w, y);
      ctx.lineTo(x + w, y + h * 0.22); ctx.lineTo(x, y + h * 0.45); ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = '#2d3234'; ctx.fillRect(x + w / 2 - 1, y, 2, h); ctx.fillRect(x, y + h * 0.45, w, 2);
    if (o.shutter) {
      var pw = w * 0.48;
      for (var s = 0; s < 2; s++) {
        var sx = s === 0 ? x - w * 0.52 : x + w * 1.04;
        ctx.fillStyle = s === 0 ? '#4c6772' : '#3f5964'; ctx.fillRect(sx, y - 3, pw, h + 6);
        ctx.strokeStyle = 'rgba(16,22,24,.55)'; ctx.lineWidth = 1;
        for (var k = 0; k < 8; k++) {
          ctx.beginPath(); ctx.moveTo(sx + 2, y - 2 + k * (h + 4) / 8);
          ctx.lineTo(sx + pw - 2, y - 2 + k * (h + 4) / 8); ctx.stroke();
        }
        ctx.fillStyle = 'rgba(150,92,50,.55)'; ctx.fillRect(sx, y + 3, 3, 7); ctx.fillRect(sx, y + h - 12, 3, 7);
      }
    }
    if (o.board) {
      ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate((r() - 0.5) * 0.14);
      ctx.fillStyle = '#6b5842'; ctx.fillRect(-w / 2, -5, w, 10); ctx.restore();
      ctx.strokeStyle = 'rgba(20,18,14,.6)';
      ctx.beginPath(); ctx.moveTo(x + w / 2, y - h * 0.1); ctx.lineTo(x + w / 2, y + h * 1.1); ctx.stroke();
    }
  }

  function makeFacade(kind, salt, sign) {
    return G.offscreen(128, 256, function (ctx, w, h) {
      var r = A.rng((SEED ^ (salt * 2654435761)) >>> 0);
      ctx.clearRect(0, 0, w, h);
      if (kind === 'section') {
        for (var f = 0; f < 3; f++) {
          var yy = 12 + f * 82;
          ctx.fillStyle = '#5b5347'; ctx.fillRect(0, yy, w, 15);
          ctx.fillStyle = 'rgba(228,214,186,.30)'; ctx.fillRect(0, yy, w, 3);
          ctx.fillStyle = 'rgba(16,20,22,.55)'; ctx.fillRect(0, yy + 12, w, 4);
          ctx.fillStyle = f === 1 ? '#8d8a76' : '#6f6b5c'; ctx.fillRect(0, yy - 30, w * (0.35 + r() * 0.4), 28);
          ctx.strokeStyle = 'rgba(30,28,22,.5)';
          for (var v = 0; v < 6; v++) { ctx.beginPath(); ctx.moveTo(v * 22, yy - 30); ctx.lineTo(v * 22, yy - 2); ctx.stroke(); }
          ctx.fillStyle = '#4a3c2e';
          for (var b = 0; b < 3; b++) ctx.fillRect(10 + b * 44 + r() * 8, yy + 15, 6, 14 + r() * 20);
          ctx.strokeStyle = 'rgba(30,24,18,.8)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(w * 0.6, yy + 15); ctx.lineTo(w * 0.75, yy + 48); ctx.stroke();
        }
        for (var i = 0; i < 14; i++) {
          var lx = r() * w, ly = r() * h;
          ctx.strokeStyle = 'rgba(60,52,40,.5)'; ctx.beginPath();
          ctx.moveTo(lx, ly); ctx.lineTo(lx + 4, ly + 10 + r() * 18); ctx.stroke();
        }
        pocks(ctx, w, h, r, 12); return;
      }
      if (kind === 'cover') {
        var yy0 = h - 84;
        for (var row = 0; row < 3; row++) {
          var by = yy0 + row * 27;
          for (var b2 = 0; b2 < 5; b2++) {
            var bx = -10 + b2 * 30 + (row % 2 ? 14 : 0), bw = 30, bh = 24;
            var g = ctx.createLinearGradient(bx, by, bx, by + bh);
            g.addColorStop(0, '#8b8670'); g.addColorStop(1, '#555447');
            ctx.fillStyle = g; G.rr(ctx, bx, by, bw, bh, 9); ctx.fill();
            ctx.strokeStyle = 'rgba(30,30,24,.5)'; ctx.lineWidth = 1; ctx.stroke();
            ctx.strokeStyle = 'rgba(220,214,190,.18)';
            ctx.beginPath(); ctx.moveTo(bx + 6, by + 5); ctx.lineTo(bx + bw - 6, by + 5); ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(18,24,26,.4)'; ctx.fillRect(0, h - 8, w, 8);
        return;
      }
      if (kind === 'water') {
        var g3 = ctx.createLinearGradient(0, h - 52, 0, h);
        g3.addColorStop(0, 'rgba(64,86,94,0)'); g3.addColorStop(0.4, 'rgba(48,68,78,.75)');
        g3.addColorStop(1, 'rgba(20,32,38,.95)');
        ctx.fillStyle = g3; ctx.fillRect(0, h - 52, w, 52);
        ctx.strokeStyle = 'rgba(178,196,198,.35)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, h - 48);
        for (var q = 0; q <= w; q += 8) ctx.lineTo(q, h - 48 + Math.sin(q * 0.2) * 1.6);
        ctx.stroke();
        ctx.fillStyle = 'rgba(198,178,138,.10)'; ctx.fillRect(0, h - 30, w, 3);
        return;
      }
      var top, bot;
      if (kind === 'stucco') { top = '#ada691'; bot = '#82806f'; }
      else if (kind === 'shop') { top = '#6a6a5d'; bot = '#41484a'; }
      else if (kind === 'steel') { top = '#4c575c'; bot = '#2e3a3e'; }
      else if (kind === 'tower') { top = '#7a786c'; bot = '#565b58'; }
      else if (kind === 'rubble') { top = '#6b6254'; bot = '#474439'; }
      else { top = '#565f64'; bot = '#3a4449'; }
      var bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, top); bg.addColorStop(0.58, bot); bg.addColorStop(1, '#232a2e');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      if (kind === 'stone' || kind === 'tower' || kind === 'rubble') {
        var ch = kind === 'tower' ? 34 : 30;
        for (var cy2 = 0; cy2 < h; cy2 += ch) {
          ctx.fillStyle = 'rgba(18,22,24,.55)'; ctx.fillRect(0, cy2, w, 2);
          var off = (Math.floor(cy2 / ch) % 2) ? 18 : 0;
          for (var bx2 = -off; bx2 < w; bx2 += 34) {
            ctx.fillStyle = 'rgba(18,22,24,.42)'; ctx.fillRect(bx2, cy2, 2, ch);
            ctx.fillStyle = 'rgba(226,220,200,' + (0.02 + r() * 0.05) + ')'; ctx.fillRect(bx2 + 2, cy2 + 2, 30, 1);
          }
        }
      }
      if (kind === 'stucco') {
        grime(ctx, w, h, r, 260, 0.10);
        G.paintStroke(ctx, [[10, 40], [36, 76], [29, 120], [58, 168], [44, 220]], 'rgba(40,38,32,.45)', 1.3, salt, { passes: 2, jitter: 6 });
        G.paintStroke(ctx, [[100, 0], [92, 54], [108, 96], [96, 150]], 'rgba(40,38,32,.35)', 1.2, salt + 3, { passes: 2, jitter: 5 });
        for (var p = 0; p < 5; p++) {
          var px = r() * w, py = 30 + r() * 170, pw = 14 + r() * 22, ph = 10 + r() * 18;
          ctx.fillStyle = '#7a5445'; ctx.fillRect(px, py, pw, ph);
          ctx.strokeStyle = 'rgba(30,24,20,.5)'; ctx.lineWidth = 1;
          for (var y2 = py; y2 < py + ph; y2 += 6) { ctx.beginPath(); ctx.moveTo(px, y2); ctx.lineTo(px + pw, y2); ctx.stroke(); }
        }
      }
      if (kind === 'steel') {
        for (var sy = 0; sy < h; sy += 44) {
          ctx.fillStyle = 'rgba(16,22,24,.35)'; ctx.fillRect(0, sy, w, 3);
          ctx.fillStyle = 'rgba(200,206,202,.10)'; ctx.fillRect(0, sy + 3, w, 2);
          for (var rx = 8; rx < w; rx += 22) {
            ctx.fillStyle = 'rgba(18,22,24,.55)'; ctx.beginPath(); ctx.arc(rx, sy + 20, 2, 0, TAU); ctx.fill();
            ctx.fillStyle = 'rgba(210,208,196,.22)'; ctx.beginPath(); ctx.arc(rx - 0.5, sy + 19, 1, 0, TAU); ctx.fill();
          }
        }
        rust(ctx, w, h, r, 16);
      }
      ctx.fillStyle = 'rgba(20,24,26,.35)'; ctx.fillRect(0, 24, w, 4); ctx.fillRect(0, 128, w, 4);
      ctx.fillStyle = 'rgba(226,220,200,.12)'; ctx.fillRect(0, 26, w, 1); ctx.fillRect(0, 130, w, 1);
      if (kind === 'shop') {
        ctx.fillStyle = '#26302f'; ctx.fillRect(4, 30, w - 8, 34);
        ctx.fillStyle = '#8a7f5f'; ctx.fillRect(4, 30, w - 8, 2); ctx.fillRect(4, 62, w - 8, 2);
        ctx.fillStyle = 'rgba(226,214,180,.92)'; ctx.font = 'bold 11px Georgia, serif'; ctx.textAlign = 'center';
        ctx.fillText(sign || 'VEYR PROVISIONS', w / 2, 52);
        ctx.font = '7px monospace'; ctx.fillStyle = 'rgba(200,190,160,.6)';
        ctx.fillText('OPEN AT LOW TIDE', w / 2, 60);
        for (var gp = 0; gp < 3; gp++) {
          var gx = 8 + gp * 39;
          ctx.fillStyle = 'rgba(10,16,18,.95)'; ctx.fillRect(gx, 70, 34, 168);
          var lg = ctx.createLinearGradient(gx, 70, gx + 34, 238);
          lg.addColorStop(0, 'rgba(214,164,96,.20)'); lg.addColorStop(1, 'rgba(24,34,38,0)');
          ctx.fillStyle = lg; ctx.fillRect(gx, 70, 34, 168);
          ctx.fillStyle = 'rgba(150,180,190,.10)'; ctx.fillRect(gx + 2, 72, 30, 50);
          ctx.strokeStyle = 'rgba(226,222,204,.55)'; ctx.lineWidth = 0.9;
          ctx.beginPath(); ctx.moveTo(gx + 17, 70); ctx.lineTo(gx + 17, 238);
          ctx.moveTo(gx, 160); ctx.lineTo(gx + 34, 160); ctx.stroke();
          if (r() < 0.55) {
            var cxp = gx + 10 + r() * 14, cyp = 90 + r() * 120;
            ctx.strokeStyle = 'rgba(214,226,228,.6)';
            for (var a2 = 0; a2 < 6; a2++) {
              var an = a2 * TAU / 6; ctx.beginPath(); ctx.moveTo(cxp, cyp);
              ctx.lineTo(cxp + Math.cos(an) * 14, cyp + Math.sin(an) * 14); ctx.stroke();
            }
            ctx.fillStyle = 'rgba(12,18,20,.75)'; ctx.beginPath(); ctx.arc(cxp, cyp, 3, 0, TAU); ctx.fill();
          }
        }
        ctx.fillStyle = '#28302f'; ctx.fillRect(4, 238, w - 8, 14);
        ctx.fillStyle = 'rgba(200,190,160,.25)'; ctx.fillRect(4, 238, w - 8, 2);
      } else {
        var lit = (salt % 3 === 0);
        var frame = kind === 'stucco' ? '#9a937c' : '#7c7d73';
        drawWindow(ctx, 34, 44, 44, 62, { frame: frame, lit: lit, shutter: kind === 'shutter', board: kind === 'rubble', broken: kind === 'rubble' && r() < 0.5 }, r);
        drawWindow(ctx, 34, 146, 44, 62, { frame: frame, lit: false, shutter: kind === 'shutter', board: kind === 'rubble', broken: kind === 'rubble' && r() < 0.5 }, r);
        ctx.fillStyle = 'rgba(12,16,18,.9)'; ctx.fillRect(92, 190, 26, 64);
        ctx.fillStyle = '#5a5142'; ctx.fillRect(90, 186, 30, 5);
        ctx.fillStyle = 'rgba(200,190,160,.25)'; ctx.fillRect(97, 196, 1, 52);
        ctx.fillStyle = '#a3905f'; ctx.beginPath(); ctx.arc(113, 224, 1.8, 0, TAU); ctx.fill();
      }
      if (kind === 'tower') {
        ctx.fillStyle = '#262c2d'; ctx.beginPath(); ctx.arc(w / 2, 72, 30, 0, TAU); ctx.fill();
        ctx.fillStyle = '#c9c3ad'; ctx.beginPath(); ctx.arc(w / 2, 72, 26, 0, TAU); ctx.fill();
        ctx.fillStyle = '#3a3d39'; ctx.beginPath(); ctx.arc(w / 2, 72, 22, 0, TAU); ctx.fill();
        ctx.strokeStyle = '#c8a06a'; ctx.lineWidth = 1.5;
        for (var tm = 0; tm < 12; tm++) {
          var ta = tm * TAU / 12; ctx.beginPath();
          ctx.moveTo(w / 2 + Math.cos(ta) * 18, 72 + Math.sin(ta) * 18);
          ctx.lineTo(w / 2 + Math.cos(ta) * 21, 72 + Math.sin(ta) * 21); ctx.stroke();
        }
        ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(w / 2, 72);
        ctx.lineTo(w / 2 + Math.cos(-1) * 13, 72 + Math.sin(-1) * 13);
        ctx.moveTo(w / 2, 72); ctx.lineTo(w / 2 + Math.cos(1.9) * 9, 72 + Math.sin(1.9) * 9); ctx.stroke();
      }
      soot(ctx, w, r, 0, 0.35); soot(ctx, w, r, 120, 0.22);
      rust(ctx, w, h, r, 7); pocks(ctx, w, h, r, kind === 'rubble' ? 16 : 8);
      grime(ctx, w, h, r, 160, 0.07); edges(ctx, w, h, r);
    });
  }

  var SIGNS = ['VEYR PROVISIONS', 'KESTREL & QUAY', 'SALTMARCH BOOKS', 'TALLOW & ROPE', 'THE GREY LAMP', 'NORTHLIGHT SUPPLY'];
  var TEX = {
    stone: [makeFacade('stone', 11), makeFacade('stone', 29)],
    stucco: [makeFacade('stucco', 37), makeFacade('stucco', 53)],
    shutter: [makeFacade('shutter', 61), makeFacade('shutter', 79)],
    shop: [makeFacade('shop', 97, SIGNS[0]), makeFacade('shop', 101, SIGNS[1]), makeFacade('shop', 103, SIGNS[3])],
    rubble: [makeFacade('rubble', 109), makeFacade('rubble', 127)],
    cover: makeFacade('cover', 137), water: makeFacade('water', 139),
    section: makeFacade('section', 149), tower: makeFacade('tower', 151),
    steel: [makeFacade('steel', 163), makeFacade('steel', 179)]
  };

  /* ---------- cached sky, distance and soft particle art ---------------- */
  var CLOUD = G.offscreen(512, 256, function (ctx, w, h) {
    var r = A.rng(SEED + 771);
    function blob(x, y, rad, warm) {
      var g = ctx.createRadialGradient(x, y, 2, x, y, rad);
      g.addColorStop(0, warm ? 'rgba(214,190,150,.20)' : 'rgba(52,62,70,.30)');
      g.addColorStop(0.55, 'rgba(40,50,58,.17)');
      g.addColorStop(1, 'rgba(30,40,48,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rad, 0, TAU); ctx.fill();
    }
    for (var i = 0; i < 62; i++) {
      var x = r() * w, y = 20 + r() * h * 0.75, rad = 25 + r() * 90, warm = r() < 0.4;
      blob(x - w, y, rad, warm); blob(x, y, rad, warm); blob(x + w, y, rad, warm);
    }
    for (var j = 0; j < 18; j++) {
      var ex = r() * w, ey = r() * h, ew = 60 + r() * 60, eh = 8 + r() * 12;
      ctx.fillStyle = 'rgba(18,26,32,.13)';
      for (var rep = -1; rep <= 1; rep++) {
        ctx.beginPath(); ctx.ellipse(ex + rep * w, ey, ew, eh, 0, 0, TAU); ctx.fill();
      }
    }
  });
  var SKYLINE = G.offscreen(1024, 200, function (ctx, w, h) {
    var r = A.rng(SEED + 883);
    function roof(x, bw, rh, col) {
      ctx.fillStyle = col; ctx.fillRect(x, h - rh, bw, rh);
      ctx.beginPath(); ctx.moveTo(x - 3, h - rh); ctx.lineTo(x + bw / 2, h - rh - 12 - r() * 14);
      ctx.lineTo(x + bw + 3, h - rh); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(198,186,160,.12)'; ctx.fillRect(x, h - rh, bw, 2);
      ctx.fillStyle = 'rgba(10,16,20,.35)';
      for (var i = 0; i < 5; i++) ctx.fillRect(x + 5 + i * 13, h - rh + 12 + (i % 2) * 16, 5, 9);
    }
    var i;
    for (i = 0; i < 46; i++) roof(i * 23 + r() * 8, 16 + r() * 18, 20 + r() * 42, i % 2 ? 'rgba(35,45,52,.72)' : 'rgba(44,54,61,.78)');
    // harbour cranes behind the roofs
    function crane(x, ht) {
      ctx.strokeStyle = 'rgba(28,38,44,.88)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x, h - 2); ctx.lineTo(x, h - ht); ctx.lineTo(x + 70, h - ht + 8);
      ctx.moveTo(x - 26, h - ht + 12); ctx.lineTo(x + 46, h - ht + 8); ctx.stroke();
      ctx.lineWidth = 1;
      for (var k = 8; k < ht; k += 12) {
        ctx.beginPath(); ctx.moveTo(x - 5, h - k); ctx.lineTo(x + 5, h - k - 12); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + 5, h - k - 12); ctx.lineTo(x - 5, h - k - 24); ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(x + 58, h - ht + 9); ctx.lineTo(x + 58, h - ht + 45); ctx.stroke();
      ctx.fillStyle = 'rgba(28,38,44,.9)'; ctx.fillRect(x + 54, h - ht + 45, 8, 5);
      ctx.beginPath(); ctx.moveTo(x, h - ht); ctx.lineTo(x + 26, h - ht - 22); ctx.stroke();
    }
    crane(120, 104); crane(490, 128); crane(820, 92);
    // pylons
    for (i = 0; i < 6; i++) {
      var px = 300 + i * 118 + r() * 20;
      ctx.strokeStyle = 'rgba(30,40,46,.65)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px, h - 24); ctx.lineTo(px + 7, h - 96); ctx.lineTo(px + 14, h - 24);
      ctx.moveTo(px + 3, h - 70); ctx.lineTo(px + 11, h - 70); ctx.moveTo(px, h - 82); ctx.lineTo(px + 14, h - 82); ctx.stroke();
    }
    // distant smoke plumes
    for (i = 0; i < 4; i++) {
      var sx = 60 + i * 260 + r() * 50;
      var g = ctx.createLinearGradient(0, h - 130, 0, h - 20);
      g.addColorStop(0, 'rgba(150,152,146,0)'); g.addColorStop(1, 'rgba(96,102,102,.32)');
      ctx.fillStyle = g; ctx.beginPath();
      ctx.moveTo(sx - 12, h - 20); ctx.quadraticCurveTo(sx + 20, h - 80, sx + 6, h - 132);
      ctx.quadraticCurveTo(sx - 26, h - 70, sx - 12, h - 20); ctx.fill();
    }
    ctx.fillStyle = 'rgba(16,24,28,.55)'; ctx.fillRect(0, h - 12, w, 12);
  });
  var PUDDLE = G.offscreen(128, 64, function (ctx, w, h) {
    var g = ctx.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2);
    g.addColorStop(0, 'rgba(166,186,192,.34)'); g.addColorStop(0.6, 'rgba(96,124,136,.20)');
    g.addColorStop(1, 'rgba(40,60,70,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(w / 2, h / 2, w / 2, h / 2, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(224,214,186,.16)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(w / 2, h / 2, w / 2 - 6, h / 2 - 5, 0, 0, TAU); ctx.stroke();
  });
  var PUFF = G.offscreen(96, 96, function (ctx, w, h) {
    var g = ctx.createRadialGradient(w / 2, h / 2, 3, w / 2, h / 2, w / 2);
    g.addColorStop(0, 'rgba(196,198,190,.85)'); g.addColorStop(0.45, 'rgba(150,154,150,.55)');
    g.addColorStop(1, 'rgba(90,98,100,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(w / 2, h / 2, w / 2, 0, TAU); ctx.fill();
  });
  var MUZZLE = G.offscreen(128, 128, function (ctx, w, h) {
    ctx.translate(w / 2, h / 2);
    var g = ctx.createRadialGradient(0, 0, 2, 0, 0, 60);
    g.addColorStop(0, 'rgba(255,246,214,1)'); g.addColorStop(0.25, 'rgba(255,204,126,.8)');
    g.addColorStop(1, 'rgba(240,140,60,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 60, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,242,206,.95)';
    for (var i = 0; i < 7; i++) {
      ctx.save(); ctx.rotate(i * TAU / 7);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(7, -6); ctx.lineTo(52 + (i % 3) * 8, 0); ctx.lineTo(7, 6); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
  });
  var FIREC = G.offscreen(96, 96, function (ctx, w, h) {
    var r = A.rng(SEED + 991);
    var g = ctx.createRadialGradient(w / 2, h * 0.7, 2, w / 2, h * 0.7, w / 2);
    g.addColorStop(0, 'rgba(255,214,132,.85)'); g.addColorStop(0.35, 'rgba(232,142,62,.5)');
    g.addColorStop(1, 'rgba(120,50,20,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(w / 2, h * 0.7, w / 2, 0, TAU); ctx.fill();
    for (var i = 0; i < 12; i++) {
      ctx.fillStyle = 'rgba(255,' + (150 + Math.floor(r() * 90)) + ',80,' + (0.2 + r() * 0.5) + ')';
      ctx.beginPath(); ctx.moveTo(w / 2 + (r() - 0.5) * 30, h * 0.85);
      ctx.quadraticCurveTo(w / 2 + (r() - 0.5) * 50, h * 0.4, w / 2 + (r() - 0.5) * 24, 10 + r() * 30);
      ctx.quadraticCurveTo(w / 2 + (r() - 0.5) * 30, h * 0.55, w / 2 + (r() - 0.5) * 30, h * 0.85);
      ctx.fill();
    }
  });

  /* ---------- soldiers: full kit, two silhouettes, six poses ----------- */
  var POSES = ['stand', 'run', 'kneel', 'aim', 'fall', 'signal'];
  function soldierArt(side, pose) {
    return G.offscreen(96, 160, function (ctx, w, h) {
      var r = A.rng((SEED + (side === 'pal' ? 311 : 419) + POSES.indexOf(pose) * 37) >>> 0);
      var pal = side === 'pal';
      var cloth = pal ? ['#4c5e69', '#36454f', '#6a7c86'] : ['#5c5e4a', '#3d4335', '#828063'];
      var helm = pal ? '#3b4a53' : '#494b46';
      var run = pose === 'run', kneel = pose === 'kneel', aim = pose === 'aim' || pose === 'signal';
      ctx.save();
      if (pose === 'fall') { ctx.translate(48, 130); ctx.rotate(1.16); ctx.translate(-48, -80); }
      ctx.fillStyle = 'rgba(10,14,18,.26)'; ctx.beginPath(); ctx.ellipse(48, 152, 25, 5, 0, 0, TAU); ctx.fill();
      // legs, with a running stride and a kneeling bend
      function leg(x0, x1, swing) {
        ctx.fillStyle = cloth[1];
        ctx.beginPath(); ctx.moveTo(x0 - 8, 92); ctx.lineTo(x0 + 9, 92);
        ctx.lineTo(x1 + 7 + swing, kneel ? 128 : 144); ctx.lineTo(x1 - 9 + swing, kneel ? 128 : 144);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = cloth[0]; ctx.fillRect(x1 - 10 + swing, kneel ? 124 : 138, 18, 12);
        ctx.fillStyle = '#21282b'; ctx.fillRect(x1 - 11 + swing, 148, 20, 6);
      }
      leg(36, 34, run ? 8 : 0); leg(60, 62, run ? -8 : (kneel ? 6 : 0));
      // pack
      ctx.fillStyle = pal ? '#394a4e' : '#444635'; G.rr(ctx, 26, 56, 20, 40, 5); ctx.fill();
      ctx.fillStyle = 'rgba(210,200,170,.16)'; ctx.fillRect(28, 62, 16, 3);
      ctx.fillStyle = '#2a3234'; ctx.fillRect(24, 88, 24, 6);
      ctx.strokeStyle = 'rgba(12,16,18,.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(31, 55); ctx.lineTo(31, 40); ctx.stroke();
      // torso
      ctx.fillStyle = cloth[0];
      ctx.beginPath(); ctx.moveTo(30, 52); ctx.lineTo(66, 52); ctx.lineTo(70, 96); ctx.lineTo(26, 96); ctx.closePath(); ctx.fill();
      // vest plate and pouches
      ctx.fillStyle = cloth[1]; G.rr(ctx, 32, 56, 32, 34, 4); ctx.fill();
      ctx.strokeStyle = 'rgba(15,20,22,.65)'; ctx.lineWidth = 1;
      for (var i = 0; i < 3; i++) { ctx.strokeRect(34 + i * 10, 80, 8, 8); }
      ctx.fillStyle = pal ? '#c8a06a' : '#8d8a6c'; ctx.fillRect(34, 59, 28, 3);
      ctx.fillStyle = cloth[2]; ctx.fillRect(28, 70, 6, 18); ctx.fillRect(62, 70, 6, 18);
      // sling and rifle across the chest
      ctx.strokeStyle = '#29302f'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(30, 60); ctx.quadraticCurveTo(48, 96, 74, 82); ctx.stroke();
      ctx.save(); ctx.translate(52, 78); ctx.rotate(aim ? -0.12 : -0.32);
      ctx.fillStyle = '#20272a'; ctx.fillRect(-24, -4, 50, 8);
      ctx.fillStyle = '#3c4547'; ctx.fillRect(-22, -6, 20, 3);
      ctx.fillStyle = '#1d2325'; ctx.fillRect(6, -2, 20, 5);
      ctx.fillStyle = '#2b3233'; ctx.fillRect(-6, 3, 9, 12);
      ctx.restore();
      // arms and gloves
      ctx.fillStyle = cloth[0];
      ctx.beginPath(); ctx.moveTo(30, 56); ctx.lineTo(22, 60); ctx.lineTo(28, 88); ctx.lineTo(38, 84); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(66, 56); ctx.lineTo(74, 62); ctx.lineTo(68, 86); ctx.lineTo(58, 82); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#262f30'; G.rr(ctx, 26, 80, 12, 10, 3); ctx.fill(); G.rr(ctx, 60, 78, 12, 10, 3); ctx.fill();
      if (pose === 'signal') {
        ctx.fillStyle = cloth[0]; ctx.beginPath(); ctx.moveTo(66, 58); ctx.lineTo(80, 36); ctx.lineTo(86, 40); ctx.lineTo(72, 66); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#262f30'; ctx.beginPath(); ctx.arc(84, 34, 5, 0, TAU); ctx.fill();
      }
      // helmet, goggles, face wrap. No bare faces.
      ctx.fillStyle = '#2b3234'; G.rr(ctx, 37, 26, 22, 28, 7); ctx.fill();
      ctx.fillStyle = '#22292b'; ctx.fillRect(38, 38, 20, 8);
      ctx.fillStyle = 'rgba(120,158,170,.5)'; G.rr(ctx, 39, 39, 8, 5, 2); ctx.fill(); G.rr(ctx, 49, 39, 8, 5, 2); ctx.fill();
      ctx.fillStyle = pal ? '#5a6a70' : '#65665a';
      ctx.beginPath(); ctx.moveTo(36, 32); ctx.quadraticCurveTo(48, 14, 60, 32); ctx.lineTo(62, 34);
      ctx.lineTo(34, 34); ctx.closePath(); ctx.fill();
      ctx.fillStyle = helm;
      ctx.beginPath(); ctx.moveTo(34, 32); ctx.quadraticCurveTo(48, 12, 62, 32); ctx.lineTo(64, 36);
      ctx.lineTo(32, 36); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(220,214,190,.18)'; ctx.fillRect(35, 32, 26, 2);
      if (pal) { ctx.fillStyle = '#c8a06a'; ctx.fillRect(33, 34, 30, 2); }
      else { ctx.fillStyle = '#3b3e3a'; ctx.fillRect(30, 35, 36, 3); }
      // face wrap folds
      ctx.fillStyle = pal ? '#46565c' : '#545644';
      ctx.beginPath(); ctx.moveTo(38, 44); ctx.lineTo(58, 44); ctx.lineTo(56, 54); ctx.lineTo(40, 54); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(15,20,22,.4)'; ctx.lineWidth = 1;
      for (var f = 0; f < 3; f++) { ctx.beginPath(); ctx.moveTo(39, 46 + f * 3); ctx.lineTo(57, 46 + f * 3); ctx.stroke(); }
      // warm rim light from the low sun
      var g = ctx.createLinearGradient(20, 0, 50, 0);
      g.addColorStop(0, 'rgba(240,200,140,.20)'); g.addColorStop(1, 'rgba(240,200,140,0)');
      ctx.fillStyle = g; ctx.fillRect(20, 12, 40, 140);
      ctx.restore();
    });
  }
  var SOL = { pal: {}, foe: {} };
  ['pal', 'foe'].forEach(function (side) {
    POSES.forEach(function (pose) { SOL[side][pose] = soldierArt(side, pose); });
  });

  /* ---------- vehicles, tower, props ----------------------------------- */
  function vehicleArt(kind) {
    return G.offscreen(256, 150, function (ctx, w, h) {
      var r = A.rng(SEED + (kind === 'av' ? 1301 : kind === 'wreck' ? 1409 : 1201));
      var wreck = kind === 'wreck', av = kind === 'av';
      var hull = wreck ? '#2b2c29' : av ? '#4a5b62' : '#565b49';
      var dark = wreck ? '#171a1a' : av ? '#2f3e45' : '#343a2c';
      ctx.fillStyle = 'rgba(8,12,16,.3)'; ctx.beginPath(); ctx.ellipse(128, 132, 108, 10, 0, 0, TAU); ctx.fill();
      // wheels or tracks
      function wheel(x, rad) {
        ctx.fillStyle = '#1c2224'; ctx.beginPath(); ctx.arc(x, 116, rad, 0, TAU); ctx.fill();
        ctx.fillStyle = '#394043'; ctx.beginPath(); ctx.arc(x, 116, rad * 0.55, 0, TAU); ctx.fill();
        ctx.fillStyle = '#69716f'; ctx.beginPath(); ctx.arc(x, 116, rad * 0.2, 0, TAU); ctx.fill();
      }
      if (av) { for (var i = 0; i < 6; i++) wheel(38 + i * 36, 13); }
      else { wheel(48, 19); wheel(102, 19); wheel(158, 19); wheel(212, 19); }
      // hull
      ctx.fillStyle = dark;
      ctx.beginPath(); ctx.moveTo(22, 96); ctx.lineTo(234, 96); ctx.lineTo(226, 66); ctx.lineTo(176, 54);
      ctx.lineTo(84, 54); ctx.lineTo(30, 70); ctx.closePath(); ctx.fill();
      ctx.fillStyle = hull;
      ctx.beginPath(); ctx.moveTo(26, 90); ctx.lineTo(230, 90); ctx.lineTo(222, 66); ctx.lineTo(174, 56);
      ctx.lineTo(86, 56); ctx.lineTo(36, 70); ctx.closePath(); ctx.fill();
      var g = ctx.createLinearGradient(0, 54, 0, 100);
      g.addColorStop(0, 'rgba(226,220,196,.14)'); g.addColorStop(1, 'rgba(10,14,16,.35)');
      ctx.fillStyle = g; ctx.fillRect(30, 56, 198, 42);
      // panel lines, hatches, stowage
      ctx.strokeStyle = 'rgba(14,18,20,.6)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(36, 74); ctx.lineTo(222, 74); ctx.moveTo(96, 56); ctx.lineTo(96, 92);
      ctx.moveTo(176, 56); ctx.lineTo(176, 92); ctx.stroke();
      ctx.fillStyle = dark; G.rr(ctx, 108, 60, 46, 14, 3); ctx.fill();
      ctx.fillStyle = 'rgba(190,180,150,.18)'; ctx.fillRect(110, 62, 42, 2);
      ctx.fillStyle = '#3d4034'; G.rr(ctx, 190, 62, 32, 12, 2); ctx.fill();
      ctx.fillStyle = av ? '#79a2ad' : '#8a7a58'; ctx.fillRect(36, 78, 16, 5);
      // turret and gun
      if (!wreck) {
        ctx.fillStyle = dark; G.rr(ctx, 92, 34, 74, 26, 6); ctx.fill();
        ctx.fillStyle = hull; G.rr(ctx, 96, 37, 66, 19, 5); ctx.fill();
        ctx.fillStyle = '#22282a'; ctx.fillRect(160, 44, 62, 7);
        ctx.fillStyle = '#3c4445'; ctx.fillRect(214, 42, 12, 11);
        ctx.strokeStyle = 'rgba(10,14,16,.5)'; ctx.beginPath(); ctx.moveTo(96, 45); ctx.lineTo(158, 45); ctx.stroke();
      } else {
        ctx.fillStyle = '#191d1d'; G.rr(ctx, 96, 30, 70, 24, 5); ctx.fill();
        ctx.fillStyle = 'rgba(226,132,62,.35)'; ctx.fillRect(104, 32, 40, 8);
        for (var k = 0; k < 7; k++) { ctx.fillStyle = 'rgba(250,170,80,' + (0.1 + r() * 0.3) + ')'; ctx.fillRect(100 + r() * 150, 50 + r() * 40, 3, 16 + r() * 20); }
      }
      // antenna and lamp
      ctx.strokeStyle = 'rgba(20,26,28,.75)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(48, 56); ctx.lineTo(44, 6); ctx.stroke();
      ctx.fillStyle = '#c8a06a'; ctx.beginPath(); ctx.arc(214, 66, 3, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(240,214,160,.25)'; ctx.beginPath(); ctx.arc(214, 66, 8, 0, TAU); ctx.fill();
    });
  }
  var CAR = vehicleArt('car'), WRECK = vehicleArt('wreck'), AV = vehicleArt('av');
  var TOWER = G.offscreen(200, 250, function (ctx, w, h) {
    var r = A.rng(SEED + 1501);
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#8c897a'); g.addColorStop(0.6, '#666a63'); g.addColorStop(1, '#3e4646');
    ctx.fillStyle = g; ctx.fillRect(14, 8, w - 28, h - 8);
    for (var yy = 8; yy < h; yy += 26) {
      ctx.fillStyle = 'rgba(20,24,26,.45)'; ctx.fillRect(14, yy, w - 28, 2);
      for (var xx = 14; xx < w - 14; xx += 30) { ctx.fillStyle = 'rgba(20,24,26,.3)'; ctx.fillRect(xx, yy, 2, 26); }
    }
    // clock dial, plain, without religious marks
    ctx.fillStyle = '#29302f'; ctx.beginPath(); ctx.arc(w / 2, 76, 42, 0, TAU); ctx.fill();
    ctx.fillStyle = '#d3cdb6'; ctx.beginPath(); ctx.arc(w / 2, 76, 37, 0, TAU); ctx.fill();
    ctx.fillStyle = '#3a403c'; ctx.beginPath(); ctx.arc(w / 2, 76, 32, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#c8a06a'; ctx.lineWidth = 2;
    for (var m = 0; m < 12; m++) {
      var a = m * TAU / 12; ctx.beginPath();
      ctx.moveTo(w / 2 + Math.cos(a) * 26, 76 + Math.sin(a) * 26);
      ctx.lineTo(w / 2 + Math.cos(a) * 30, 76 + Math.sin(a) * 30); ctx.stroke();
    }
    ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(w / 2, 76); ctx.lineTo(w / 2 + 16, 64);
    ctx.moveTo(w / 2, 76); ctx.lineTo(w / 2 - 8, 56); ctx.stroke();
    // narrow windows and the gun slit
    for (var i = 0; i < 3; i++) {
      ctx.fillStyle = 'rgba(10,16,18,.9)'; G.rr(ctx, 34 + i * 48, 136, 22, 34, 9); ctx.fill();
      ctx.fillStyle = 'rgba(120,150,160,.15)'; ctx.fillRect(36 + i * 48, 138, 18, 8);
      ctx.fillStyle = '#8b8674'; ctx.fillRect(30 + i * 48, 170, 30, 5);
    }
    ctx.fillStyle = '#101619'; ctx.fillRect(52, 200, 96, 26);
    ctx.fillStyle = 'rgba(226,166,88,.35)'; ctx.fillRect(76, 204, 48, 4);
    ctx.fillStyle = '#2c3231'; ctx.fillRect(12, 0, w - 24, 12); ctx.fillRect(4, h - 16, w - 8, 16);
    // cornice, chipped corners, soot and weathering
    ctx.fillStyle = 'rgba(226,220,200,.15)'; ctx.fillRect(14, 8, w - 28, 3);
    ctx.fillStyle = 'rgba(18,22,24,.5)'; ctx.fillRect(14, 0, w - 28, 8);
    soot(ctx, w, r, 0, 0.30); rust(ctx, w, h, r, 10); pocks(ctx, w, h, r, 22);
    for (var c = 0; c < 8; c++) {
      ctx.fillStyle = 'rgba(24,28,28,.7)';
      ctx.fillRect(r() < 0.5 ? 14 + r() * 12 : w - 14 - r() * 12, r() * h, 8, 10);
    }
  });
  var RUIN = G.offscreen(200, 250, function (ctx, w, h) {
    var r = A.rng(SEED + 1601);
    ctx.fillStyle = '#2b302f'; ctx.fillRect(18, 30, w - 36, h - 30);
    ctx.fillStyle = '#10171a'; ctx.fillRect(42, 34, w - 84, 132);
    ctx.fillStyle = '#4b4e47';
    for (var i = 0; i < 9; i++) ctx.fillRect(20 + r() * (w - 40), 20 + r() * (h - 20), 12 + r() * 26, 8 + r() * 12);
    ctx.fillStyle = '#5a5647'; ctx.fillRect(18, 162, w - 36, 12); ctx.fillRect(18, 214, w - 36, 14);
    ctx.strokeStyle = 'rgba(20,24,24,.8)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(42, 34); ctx.lineTo(70, 8); ctx.moveTo(w - 42, 34); ctx.lineTo(w - 66, 8); ctx.stroke();
    ctx.fillStyle = 'rgba(226,166,88,.30)'; ctx.fillRect(52, 196, 96, 6);
  });
  var CRATE = G.offscreen(96, 84, function (ctx, w, h) {
    ctx.fillStyle = '#4a5449'; ctx.fillRect(6, 20, w - 12, h - 22);
    ctx.fillStyle = '#5f6856'; ctx.fillRect(6, 20, w - 12, 8);
    ctx.strokeStyle = 'rgba(16,22,20,.7)'; ctx.lineWidth = 2;
    ctx.strokeRect(6, 20, w - 12, h - 22);
    ctx.beginPath(); ctx.moveTo(6, 20); ctx.lineTo(w - 6, h - 2); ctx.moveTo(w - 6, 20); ctx.lineTo(6, h - 2); ctx.stroke();
    ctx.fillStyle = '#c8a06a'; ctx.fillRect(30, 12, 36, 10);
    ctx.fillStyle = '#20292a'; ctx.font = 'bold 8px monospace'; ctx.textAlign = 'center';
    ctx.fillText('LW-2', w / 2, 20);
    ctx.fillStyle = 'rgba(226,214,180,.55)'; ctx.font = '7px monospace'; ctx.fillText('SUPPLY', w / 2, 50);
  });
  var RUBBLEC = G.offscreen(96, 64, function (ctx, w, h) {
    var r = A.rng(SEED + 1701);
    ctx.fillStyle = 'rgba(10,14,16,.28)'; ctx.beginPath(); ctx.ellipse(w / 2, h - 8, w / 2, 7, 0, 0, TAU); ctx.fill();
    for (var i = 0; i < 42; i++) {
      var x = r() * w, y = h - 8 - r() * 34, s = 4 + r() * 12;
      ctx.fillStyle = ['#6a6659', '#555954', '#7a6c58', '#454b4b'][Math.floor(r() * 4)];
      ctx.save(); ctx.translate(x, y); ctx.rotate(r() * 1.2); ctx.fillRect(-s / 2, -s / 3, s, s * 0.65); ctx.restore();
    }
    ctx.strokeStyle = 'rgba(90,60,40,.7)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(20, 30); ctx.lineTo(38, 8); ctx.moveTo(66, 34); ctx.lineTo(80, 16); ctx.stroke();
  });
  var SAND = G.offscreen(96, 56, function (ctx, w, h) {
    for (var row = 0; row < 3; row++) {
      for (var i = 0; i < 5; i++) {
        var x = -6 + i * 22 + (row % 2 ? 10 : 0), y = h - 16 - row * 17;
        var g = ctx.createLinearGradient(x, y, x, y + 16);
        g.addColorStop(0, '#8b8670'); g.addColorStop(1, '#545447');
        ctx.fillStyle = g; G.rr(ctx, x, y, 21, 15, 6); ctx.fill();
        ctx.strokeStyle = 'rgba(30,30,24,.5)'; ctx.lineWidth = 1; ctx.stroke();
      }
    }
  });
  var FOUNTAIN = G.offscreen(128, 80, function (ctx, w, h) {
    ctx.fillStyle = 'rgba(10,14,16,.3)'; ctx.beginPath(); ctx.ellipse(w / 2, h - 10, w / 2, 9, 0, 0, TAU); ctx.fill();
    var g = ctx.createLinearGradient(0, 20, 0, h);
    g.addColorStop(0, '#8b8f88'); g.addColorStop(1, '#4c5554');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(w / 2, h - 24, 52, 18, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#2b3a40'; ctx.beginPath(); ctx.ellipse(w / 2, h - 27, 44, 13, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(150,180,190,.28)'; ctx.beginPath(); ctx.ellipse(w / 2 - 10, h - 30, 22, 5, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#7e837a'; G.rr(ctx, w / 2 - 7, 14, 14, 34, 4); ctx.fill();
    ctx.fillStyle = '#9a9c8e'; ctx.beginPath(); ctx.ellipse(w / 2, 16, 14, 5, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(190,205,208,.45)';
    for (var i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(w / 2 + (i - 2.5) * 7, 12 - (i % 2) * 6, 1.5, 0, TAU); ctx.fill(); }
  });
  var BARREL = G.offscreen(64, 72, function (ctx, w, h) {
    var g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, '#3e4a48'); g.addColorStop(0.5, '#66706a'); g.addColorStop(1, '#333d3d');
    ctx.fillStyle = g; G.rr(ctx, 10, 8, w - 20, h - 12, 6); ctx.fill();
    ctx.strokeStyle = 'rgba(16,22,22,.6)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(12, 22); ctx.lineTo(w - 12, 22); ctx.moveTo(12, 52); ctx.lineTo(w - 12, 52); ctx.stroke();
    ctx.fillStyle = 'rgba(122,74,42,.4)'; ctx.fillRect(18, 24, 4, 28);
    ctx.fillStyle = 'rgba(200,196,176,.2)'; ctx.fillRect(w - 18, 8, 4, h - 12);
  });
  var POLE = G.offscreen(32, 200, function (ctx, w, h) {
    ctx.fillStyle = '#39413f'; ctx.fillRect(w / 2 - 3, 8, 6, h - 8);
    ctx.fillStyle = 'rgba(210,204,180,.22)'; ctx.fillRect(w / 2 - 3, 8, 2, h - 8);
    ctx.fillStyle = '#333b3a'; ctx.fillRect(2, 16, w - 4, 5);
    ctx.fillStyle = 'rgba(122,74,42,.5)'; ctx.fillRect(w / 2 - 3, 80, 6, 40);
    ctx.fillStyle = '#4a514b'; ctx.fillRect(0, h - 8, w, 8);
  });
  var MGNEST = G.offscreen(128, 80, function (ctx, w, h) {
    var r = A.rng(SEED + 1801);
    for (var row = 0; row < 2; row++) for (var i = 0; i < 5; i++) {
      var x = -6 + i * 28 + (row % 2 ? 12 : 0), y = h - 18 - row * 16;
      ctx.fillStyle = '#7e7b68'; G.rr(ctx, x, y, 26, 15, 6); ctx.fill();
      ctx.strokeStyle = 'rgba(30,30,24,.5)'; ctx.stroke();
    }
    ctx.fillStyle = '#22292a'; ctx.fillRect(48, 22, 32, 12); ctx.fillRect(88, 20, 30, 5);
    ctx.fillStyle = '#3c4445'; ctx.fillRect(56, 34, 8, 16);
    ctx.fillStyle = 'rgba(250,200,130,.2)'; ctx.beginPath(); ctx.arc(118, 20, 8, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(226,220,200,.15)'; ctx.fillRect(0, h - 6, w, 2);
    void r;
  });

  /* ------------------------------------------------------------------ *
   * The town. Digits: 1 stone, 2 stucco, 3 shutters, 4 shop glass,
   * 5 rubble, 6 low sandbag / canal water, 7 collapsed section,
   * 8 clock tower stone, 9 riveted steel. 0 is open ground.
   * ------------------------------------------------------------------ */
  var MW = 58, MH = 46, grid = [];
  (function buildMap() {
    var y, x;
    for (y = 0; y < MH; y++) { var row = []; for (x = 0; x < MW; x++) row.push('1'); grid.push(row); }
    function carve(x0, y0, x1, y1, ch) {
      for (var yy = y0; yy <= y1; yy++) for (var xx = x0; xx <= x1; xx++)
        if (xx >= 0 && yy >= 0 && xx < MW && yy < MH) grid[yy][xx] = ch;
    }
    carve(25, 1, 32, 44, '0');       // the long avenue, a clear sight line to the tower
    carve(1, 30, 56, 33, '0');       // market approach
    carve(1, 21, 56, 23, '0');       // south bank of the canal
    carve(1, 12, 56, 14, '0');       // street below Orra Yard
    carve(10, 1, 12, 44, '0');       // west street
    carve(44, 1, 46, 44, '0');       // east street
    carve(1, 39, 56, 43, '0');       // sea wall promenade
    carve(1, 36, 56, 37, '0');
    carve(19, 24, 37, 33, '0');      // Kettle Square
    carve(24, 15, 33, 22, '0');      // Trambridge yard
    carve(21, 4, 37, 12, '0');       // Orra Yard
    carve(13, 22, 23, 26, '0');      // wrecked bookshop, the flank route
    carve(20, 22, 25, 23, '0');
    carve(12, 22, 13, 26, '0');
    carve(1, 18, 23, 19, '6');       // the Vell canal
    carve(34, 56, 18, 19, '6');
    for (x = 1; x <= 23; x++) { grid[17][x] = '9'; grid[20][x] = '9'; }
    for (x = 34; x <= 56; x++) { grid[17][x] = '9'; grid[20][x] = '9'; }
    for (x = 20; x <= 36; x++) grid[23][x] = '4';
    for (y = 24; y <= 32; y++) { grid[y][18] = '3'; grid[y][38] = '3'; }
    for (y = 25; y <= 30; y++) for (x = 13; x <= 17; x++) grid[y][x] = '7';
    for (y = 1; y <= 3; y++) grid[y][30] = '8';
    carve(29, 2, 31, 3, '8');
    for (x = 1; x <= 56; x++) grid[45][x] = '9';
    for (y = 1; y < MH - 1; y++) for (x = 1; x < MW - 1; x++) {
      if (grid[y][x] !== '1') continue;
      if (!(grid[y - 1][x] === '0' || grid[y + 1][x] === '0' || grid[y][x - 1] === '0' || grid[y][x + 1] === '0')) continue;
      var q = A.hash(x * 1.7 + 0.3, y * 2.1 + SEED * 0.001);
      grid[y][x] = q < 0.16 ? '2' : (q < 0.28 ? '3' : (q < 0.34 ? '5' : (q < 0.42 ? '9' : '1')));
    }
  })();
  var MAPROWS = grid.map(function (row) { return row.join(''); });
  function openCell(x, y) {
    var ix = Math.floor(x), iy = Math.floor(y);
    return ix >= 0 && iy >= 0 && ix < MW && iy < MH && grid[iy][ix] === '0';
  }
  function wallFor(v, x, y) {
    var t;
    if (v === 1) t = pick(TEX.stone, x * 3 + y * 7);
    else if (v === 2) t = pick(TEX.stucco, x + y * 5);
    else if (v === 3) t = pick(TEX.shutter, x + y);
    else if (v === 4) t = pick(TEX.shop, x + Math.floor(y / 2));
    else if (v === 5) t = pick(TEX.rubble, x * 2 + y);
    else if (v === 6) t = (y === 18 || y === 19) ? TEX.water : TEX.cover;
    else if (v === 7) t = TEX.section;
    else if (v === 8) t = M.tower.broken ? RUIN_TEX : TEX.tower;
    else if (v === 9) t = pick(TEX.steel, x + y * 3);
    else t = TEX.stone[0];
    return { solid: true, tex: t, height: 1 };
  }
  var RUIN_TEX = makeFacade('rubble', 191);

  /* ---------------------------- world state ----------------------------- */
  var OBJDEF = [
    { id: 'A', name: 'Kettle Square', sub: 'Clear the arcade and the fountain yard', x: 28, y: 29, r: 6.4, hold: 0, held: false,
      foes: [[22, 26], [34, 26], [24, 31], [33, 31], [28, 25]], cover: [[21, 27], [35, 27], [26, 32], [31, 32]] },
    { id: 'B', name: 'Trambridge', sub: 'Stop the armoured car or flank the bookshop', x: 28, y: 17.5, r: 5.8, hold: 0, held: false,
      foes: [[24, 16], [33, 16], [26, 15], [31, 15]], cover: [[24, 21], [32, 21], [26, 22], [31, 22]] },
    { id: 'C', name: 'Orra Yard', sub: 'Mark the tower gun, then hold the yard', x: 28, y: 9.5, r: 6.4, hold: 0, held: false,
      foes: [[24, 8], [34, 8], [26, 6], [33, 6], [28, 5]], cover: [[22, 11], [35, 11], [26, 12], [32, 12]] }
  ];
  var RADIO_NAMES = ['Pike', 'Renn', 'Sable', 'Corin', 'Mott'];
  var VIEWS = {
    wide: { x: 28, y: 41.5, a: -PI / 2 - 0.22, p: -0.10, fov: 1.31 },
    street: { x: 27, y: 28.2, a: -PI / 2 + 0.14, p: 0.01, fov: 1.31 },
    vehicle: { x: 23.5, y: 21.6, a: -0.72, p: -0.02, fov: 1.18 },
    soldier: { x: 23.0, y: 30.8, a: -0.354, p: 0.02, fov: 1.02 },
    weapon: { x: 28, y: 34.5, a: -PI / 2, p: 0.04, fov: 1.0 }
  };
  var VIEW_ALIAS = { '1': 'wide', '2': 'street', '3': 'vehicle', '4': 'soldier', '5': 'weapon' };
  var VIEW_NAME = VIEW_ALIAS[params.get('view')] || params.get('view') || '';
  var HINT = 'Press W A S D to move. Click for pointer lock. Press the left button to fire. Hold Shift to sprint. Press G for smoke.';

  var gun = {
    ammo: 30, mag: 30, reserve: 180, mode: 'rifle', rockets: 0, smoke: 3,
    reload: 0, reloadT: 0, ads: 0, kick: 0, kickV: 0, flash: 0, bolt: 0, burst: 0,
    heat: 0, lean: 0, lower: 0, sway: 0, hitMark: 0, lock: 0, shots: 0, hits: 0, vault: 0
  };
  var M = {
    objs: OBJDEF, cur: 0, phase: 'play', outroT: 0, finished: false,
    score: 0, kills: 0, deaths: 0, hp: 100, lastHit: -9, cover: false, respawn: { x: 28, y: 41.5 },
    radio: [], msg: '', msgT: 0, supp: 0, flashWorld: 0, interior: 0,
    car: { x: 28, y: 17.2, hp: 2, dead: false },
    mg: { x: 30, y: 8.2, dead: false, marked: false },
    tower: { x: 30, y: 5.6, broken: false },
    av: { x: 18, y: 11, active: false, t: 0, fired: false },
    crate: { x: 26.5, y: 22.4, taken: false },
    flank: false, smokeThrown: false, adsTarget: 0,
    foes: [], squad: [], props: [], _sprites: [],
    tracers: [], impacts: [], holes: [], cases: [], parts: [], rockets: [], grenades: [], clouds: [], pieces: [],
    bed: 0, lastAir: -1, turn: 0, prevAngle: 0, st: null, env: null,
    bot: { i: 0, t0: 0 }, photo: VIEWS[VIEW_NAME] || null,
    openBoom: false, gunScreen: null, demo: false, forceEndEarly: false
  };

  /* -------------------------- tiny utilities ---------------------------- */
  function pushRadio(text) { add(M.radio, { text: text, t: M.st ? M.st.time : 0 }, 5); }
  function message(text, secs) { M.msg = text; M.msgT = secs || 3; }
  function proj(st, env, cam) {
    var fov = st.fov || 1.31;
    return { p: cam ? cam.p : (st.proj || (env.w / 2) / Math.tan(fov / 2)),
      h: cam ? cam.h : (st.horizon || env.h * 0.5) };
  }
  function point(st, env, wx, wy, wz, cam) {
    var q = proj(st, env, cam), dx = wx - st.x, dy = wy - st.y;
    var c = Math.cos(st.angle), s = Math.sin(st.angle);
    var tz = dx * c + dy * s, tx = -dx * s + dy * c;
    if (tz < 0.25) return null;
    return { x: env.w / 2 + tx / tz * q.p, y: q.h + q.p * (0.5 - (wz || 0)) / tz, z: tz, P: q.p / tz };
  }
  function groundQuad(ctx, st, env, cam, x0, y0, x1, y1) {
    var a = point(st, env, x0, y0, 0, cam), b = point(st, env, x1, y0, 0, cam),
      c = point(st, env, x1, y1, 0, cam), d = point(st, env, x0, y1, 0, cam);
    if (!a || !b || !c || !d) return false;
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.lineTo(d.x, d.y); ctx.closePath();
    return true;
  }
  function lineClear(st, x0, y0, x1, y1) {
    var n = Math.ceil(d2(x0, y0, x1, y1) * 3);
    for (var i = 1; i < n; i++) {
      var t = i / n;
      if (R.solidAt(st.world, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t)) return false;
    }
    return true;
  }
  function castRay(st, ang, maxD) {
    var cx = Math.cos(ang), sy = Math.sin(ang);
    var mx = Math.floor(st.x), my = Math.floor(st.y);
    var ddx = Math.abs(1 / (cx || 1e-9)), ddy = Math.abs(1 / (sy || 1e-9));
    var stX, stY, sideX, sideY;
    if (cx < 0) { stX = -1; sideX = (st.x - mx) * ddx; } else { stX = 1; sideX = (mx + 1 - st.x) * ddx; }
    if (sy < 0) { stY = -1; sideY = (st.y - my) * ddy; } else { stY = 1; sideY = (my + 1 - st.y) * ddy; }
    var side = 0, t = 0, v = 0, guard = 0;
    while (guard++ < 140) {
      if (sideX < sideY) { sideX += ddx; mx += stX; side = 0; t = sideX - ddx; }
      else { sideY += ddy; my += stY; side = 1; t = sideY - ddy; }
      if (t > maxD) return { t: maxD, v: 0 };
      v = R.cellAt(st.world, mx + 0.5, my + 0.5);
      if (v && R.solidAt(st.world, mx + 0.5, my + 0.5)) return { t: t, v: v, side: side, mx: mx, my: my };
      if (mx < -2 || my < -2 || mx > st.world.w + 2 || my > st.world.h + 2) break;
    }
    return { t: maxD, v: 0 };
  }
  function surfaceOf(v) {
    if (v === 9) return 'steel';
    if (v === 4) return 'glass';
    if (v === 3 || v === 7) return 'wood';
    if (v === 6) return 'water';
    return 'concrete';
  }

  /* ------------------------------ sound -------------------------------- */
  function tone(o) { A.sound.tone(o); }
  function noise(o) { A.sound.noise(o); }
  function sfxRifle() {
    tone({ freq: 138, dur: 0.12, type: 'square', gain: 0.085, slideTo: 62 });
    noise({ dur: 0.09, gain: 0.13, freq: 3400, filter: 'highpass' });
    noise({ dur: 0.34, gain: 0.055, freq: 520, filter: 'lowpass', delay: 0.04 });
    tone({ freq: 210, dur: 0.28, gain: 0.03, type: 'triangle', slideTo: 90, delay: 0.07 });
    noise({ dur: 0.05, gain: 0.05, freq: 2600, filter: 'highpass', delay: 0.11 });
  }
  function sfxDistant(dist) {
    var d = 0.14 + Math.min(0.55, dist * 0.016);
    noise({ dur: 0.09, gain: 0.045, freq: 1900, filter: 'lowpass', delay: d });
    tone({ freq: 96, dur: 0.30, gain: 0.035, type: 'triangle', slideTo: 48, delay: d + 0.07 });
  }
  function sfxExplosion() {
    tone({ freq: 62, dur: 0.85, gain: 0.26, type: 'sine', slideTo: 26 });
    noise({ dur: 0.75, gain: 0.26, freq: 300, filter: 'lowpass' });
    noise({ dur: 0.5, gain: 0.07, freq: 2400, filter: 'highpass', delay: 0.34 });
    noise({ dur: 0.4, gain: 0.05, freq: 1600, filter: 'highpass', delay: 0.52 });
    tone({ freq: 4300, dur: 1.5, gain: 0.018, type: 'sine', delay: 0.06 });
  }
  function sfxEngine() {
    tone({ freq: 58, dur: 2.6, gain: 0.05, type: 'sawtooth', slideTo: 42, pan: -0.8 });
    tone({ freq: 62, dur: 2.2, gain: 0.04, type: 'sawtooth', slideTo: 48, pan: 0.7, delay: 0.6 });
    noise({ dur: 2.4, gain: 0.035, freq: 200, filter: 'lowpass' });
  }
  function sfxBed() {
    noise({ dur: 1.4, gain: 0.018, freq: 240, filter: 'lowpass', delay: 0.15 });
    tone({ freq: 48, dur: 1.7, gain: 0.015, type: 'sine' });
  }
  function sfxImpact(kind) {
    if (kind === 'steel') { tone({ freq: 1500, dur: 0.16, gain: 0.05, type: 'square', slideTo: 460 }); noise({ dur: 0.07, gain: 0.05, freq: 4200, filter: 'highpass' }); }
    else if (kind === 'wood') noise({ dur: 0.12, gain: 0.045, freq: 1200, filter: 'bandpass' });
    else if (kind === 'water') noise({ dur: 0.18, gain: 0.04, freq: 900, filter: 'highpass' });
    else noise({ dur: 0.13, gain: 0.045, freq: 700, filter: 'lowpass' });
  }
  function sfxReload() {
    noise({ dur: 0.06, gain: 0.05, freq: 2200, filter: 'highpass', delay: 0.05 });
    tone({ freq: 320, dur: 0.05, gain: 0.04, type: 'square', delay: 0.95 });
    noise({ dur: 0.05, gain: 0.05, freq: 1800, filter: 'highpass', delay: 1.5 });
  }
  function sfxWhine() {
    tone({ freq: 180, dur: 2.0, gain: 0.035, type: 'sawtooth', slideTo: 300, pan: -0.5 });
    noise({ dur: 1.8, gain: 0.02, freq: 700, filter: 'bandpass' });
  }
  function sfxObjective() { A.sound.chord([196, 262, 330], 0.55, 0.055); }

  /* --------------------------- entity setup ---------------------------- */
  function initEntities(st, env) {
    M.foes = []; M.squad = []; M.props = [];
    for (var k = 0; k < 3; k++) {
      for (var i = 0; i < OBJDEF[k].foes.length; i++) {
        var p = OBJDEF[k].foes[i];
        M.foes.push({ x: p[0], y: p[1], k: k, side: 'foe', hp: env.auto ? 1 : 2,
          dead: false, fade: 0, flash: 0, pose: 'stand', timer: 0.9 + i * 0.37,
          coverI: i, index: i, fall: 0, name: 'garrison' });
      }
      for (var j = 0; j < OBJDEF[k].cover.length; j++) {
        var c = OBJDEF[k].cover[j];
        M.props.push({ x: c[0], y: c[1], wz: (j % 2 ? 0.18 : 0.2), k: j % 2 ? 'sand' : 'rubble', d: {} });
      }
    }
    var burnt = [[23, 35], [34.5, 28], [24, 12.5], [35.5, 16], [20, 31]];
    for (i = 0; i < burnt.length; i++) M.props.push({ x: burnt[i][0], y: burnt[i][1], wz: 0.38, k: 'wreck', d: { small: true } });
    var barrels = [[22, 29], [35, 25], [24, 21], [34, 10], [21, 40], [36, 40]];
    for (i = 0; i < barrels.length; i++) M.props.push({ x: barrels[i][0], y: barrels[i][1], wz: 0.32, k: 'barrel', d: {} });
    var rubble = [[26, 36], [30, 34], [23, 27], [33, 30], [26, 20], [31, 13], [22, 9], [35, 7], [29, 39]];
    for (i = 0; i < rubble.length; i++) M.props.push({ x: rubble[i][0], y: rubble[i][1], wz: 0.2, k: 'rubble', d: {} });
    M.props.push({ x: 28, y: 27.3, wz: 0.36, k: 'fountain', d: {} });
    M.props.push({ x: 26.5, y: 22.4, wz: 0.36, k: 'crate', d: {} });
    var fires = [];
    [[21, 25], [36, 30], [23, 16], [34, 7], [30, 33]].forEach(function (f) {
      fires.push(f); M.props.push({ x: f[0], y: f[1], wz: 0.38, k: 'fire', d: { seed: f[0] + f[1] } });
    });
    M.fires = fires;
    for (i = 0; i < 7; i++) {
      var py = 13.5 + i * 4.2;
      M.props.push({ x: 24.4, y: py, wz: 0.68, k: 'pole', d: {} });
      M.props.push({ x: 32.6, y: py, wz: 0.68, k: 'pole', d: {} });
    }
    M.props.push({ x: 25.7, y: 29.8, wz: 0.31, k: 'soldier', d: { side: 'pal', pose: 'aim', flash: 0, alpha: 1, static: true } });
    M.props.push({ x: 31.2, y: 27.6, wz: 0.31, k: 'soldier', d: { side: 'pal', pose: 'kneel', flash: 0, alpha: 1, static: true } });
    for (i = 0; i < 5; i++) {
      M.squad.push({ x: st.x - 1.4 + i * 0.7, y: st.y + 1.4 + (i % 2) * 0.8, side: 'pal',
        name: RADIO_NAMES[i], flash: 0, pose: 'run', timer: 0.6 + i * 0.31,
        dead: false, fade: 0, index: i });
    }
    // puddles on open cells, for the wet ground
    M.puddles = [];
    var pr = A.rng(SEED + 2213);
    for (i = 0; i < 120; i++) {
      var px = 2 + pr() * (MW - 4), py = 2 + pr() * (MH - 4);
      if (openCell(px, py)) M.puddles.push({ x: px, y: py, rx: 0.35 + pr() * 0.85, ry: 0.12 + pr() * 0.24 });
    }
  }

  /* ----------------------------- sprites -------------------------------- */
  function spriteDraw(ctx, cx, cy, P, dist, sp) {
    var d = sp.d || {}, k = sp.k;
    if (k === 'soldier') {
      var H = 0.62, Wd = 0.38;
      ctx.save();
      if (d.alpha !== undefined) ctx.globalAlpha *= clamp(d.alpha, 0, 1);
      ctx.drawImage(SOL[d.side || 'pal'][d.pose || 'stand'], cx - Wd * P / 2, cy - H * P / 2, Wd * P, H * P);
      if (d.flash > 0) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha *= clamp(d.flash, 0, 1);
        ctx.drawImage(MUZZLE, cx + 0.10 * P - 26 * P * 0.005, cy - 0.02 * P - 26 * P * 0.005, 52 * P * 0.005, 52 * P * 0.005);
      }
      ctx.restore(); return;
    }
    if (k === 'fall') { // dust from cloth on the drop
      ctx.save(); ctx.globalAlpha *= 0.6 * clamp(1 - d.fade, 0, 1);
      ctx.drawImage(PUFF, cx - 0.5 * P, cy - 0.35 * P, P, P); ctx.restore(); return;
    }
    if (k === 'puff') {
      ctx.save(); ctx.globalAlpha = ctx.globalAlpha * clamp(d.a, 0, 1);
      if (d.tint === 'dark') { ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none'; }
      ctx.drawImage(PUFF, cx - d.r * P, cy - d.r * P, d.r * 2 * P, d.r * 2 * P);
      ctx.restore(); return;
    }
    if (k === 'hole') {
      ctx.save(); ctx.fillStyle = 'rgba(8,11,13,.85)';
      ctx.beginPath(); ctx.arc(cx, cy, Math.max(1, 0.045 * P), 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(214,208,188,.45)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, Math.max(1.5, 0.058 * P), 0, TAU); ctx.stroke();
      ctx.restore(); return;
    }
    if (k === 'piece') {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(d.rot || 0);
      var ps = P * 0.014;
      ctx.drawImage(TOWER, d.sx, d.sy, d.sw, d.sh, -d.sw * ps / 2, -d.sh * ps / 2, d.sw * ps, d.sh * ps);
      ctx.restore(); return;
    }
    if (k === 'marker') {
      ctx.save(); ctx.globalAlpha *= 0.85;
      ctx.strokeStyle = C.gold; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, 0.13 * P, 0, TAU); ctx.stroke();
      ctx.fillStyle = 'rgba(16,22,24,.72)'; ctx.beginPath(); ctx.arc(cx, cy, 0.115 * P, 0, TAU); ctx.fill();
      ctx.fillStyle = C.ink; ctx.font = 'bold ' + Math.max(9, 0.12 * P) + 'px Georgia, serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(d.letter || 'A', cx, cy);
      ctx.restore(); return;
    }
    var art, wU, hU;
    if (k === 'car' || k === 'wreck' || k === 'av' || k === 'mgn' || k === 'tower' || k === 'ruin' ||
        k === 'crate' || k === 'rubble' || k === 'sand' || k === 'fountain' || k === 'barrel' || k === 'pole' || k === 'fire') {
      var table = {
        car: [CAR, 2.2, 0.82], wreck: [WRECK, 2.2, 0.82], av: [AV, 2.3, 0.86],
        mgn: [MGNEST, 1.5, 0.62], tower: [TOWER, 2.88, 3.6], ruin: [RUIN, 2.88, 3.6],
        crate: [CRATE, 0.7, 0.62], rubble: [RUBBLEC, 0.62, 0.41], sand: [SAND, 0.62, 0.36],
        fountain: [FOUNTAIN, 1.5, 0.94], barrel: [BARREL, 0.42, 0.5], pole: [POLE, 0.2, 1.36], fire: [FIREC, 0.85, 0.85]
      };
      var e = table[k]; art = e[0]; wU = e[1]; hU = e[2];
      if (k === 'wreck' && d.small) { wU *= 0.75; hU *= 0.75; }
      ctx.save();
      if (d.alpha !== undefined) ctx.globalAlpha *= d.alpha;
      if (k === 'fire') {
        var fl = 0.86 + 0.14 * Math.sin((d.t || 0) * 9 + (d.seed || 0));
        ctx.globalAlpha *= fl;
      }
      ctx.drawImage(art, cx - wU * P / 2, cy - hU * P / 2, wU * P, hU * P);
      ctx.restore(); return;
    }
    ctx.fillStyle = '#888'; ctx.fillRect(cx - 4, cy - 4, 8, 8);
  }

  function buildSprites(st, env) {
    var list = [], demo = M.demo;
    function put(x, y, wz, k, d) {
      list.push({ x: x, y: y, size: 1, lift: wz, k: k, d: d, hidden: false, draw: spriteDraw });
    }
    var i, p;
    for (i = 0; i < M.props.length; i++) {
      p = M.props[i];
      if (p.k === 'crate' && M.crate.taken) continue;
      if (p.k === 'fire') p.d.t = env.t;
      put(p.x, p.y, p.wz, p.k, p.d);
    }
    // machine gun nest, armoured car, tower, friendly armour
    if (!M.mg.dead) put(M.mg.x, M.mg.y, 0.31, 'mgn', {});
    put(M.car.x, M.car.y, 0.4, M.car.dead ? 'wreck' : 'car', {});
    put(M.tower.x, M.tower.y, 1.8, M.tower.broken ? 'ruin' : 'tower', {});
    if (M.av.active || M.phase !== 'play') put(M.av.x, M.av.y, 0.43, 'av', {});
    // squad: in the opening they run past up the avenue; later they follow the player
    for (i = 0; i < M.squad.length; i++) {
      var s = M.squad[i];
      if (demo) {
        var yy = 39.4 - ((env.t * 2.3 + i * 2.6) % 25) + Math.sin(env.t * 3 + i) * 0.08;
        put(25.6 + i * 1.15, yy, 0.31, 'soldier',
          { side: 'pal', pose: 'run', flash: (Math.sin(env.t * 11 + i * 2.7) > 0.96 ? 1 : 0), alpha: 1 });
      } else if (!s.hidden) {
        put(s.x, s.y, 0.31, 'soldier', { side: 'pal', pose: s.pose, flash: s.flash, alpha: s.dead ? clamp(1 - s.fade / 4, 0, 1) : 1 });
      }
    }
    // opponents
    for (i = 0; i < M.foes.length; i++) {
      var f = M.foes[i];
      if (f.hidden) continue;
      if (f.dead) {
        put(f.x, f.y, 0.31, 'soldier', { side: 'foe', pose: 'fall', flash: 0, alpha: clamp(1 - f.fade / 4.2, 0, 1) });
        if (f.fade < 1.4) put(f.x, f.y, 0.1, 'fall', { fade: f.fade });
      } else if (demo) {
        put(f.x, f.y, 0.31, 'soldier',
          { side: 'foe', pose: (Math.floor(env.t * 0.7 + i) % 3 === 0 ? 'kneel' : 'aim'),
            flash: (Math.sin(env.t * 8 + i * 1.9) > 0.95 ? 1 : 0), alpha: 1 });
      } else {
        put(f.x, f.y, 0.31, 'soldier', { side: 'foe', pose: f.pose, flash: f.flash, alpha: 1 });
      }
    }
    // tower pieces, smoke puffs, bullet holes
    for (i = 0; i < M.pieces.length; i++) { var q = M.pieces[i]; if (!q.done) put(q.x, q.y, q.wz, 'piece', q); }
    for (i = 0; i < M.holes.length; i++) { var h = M.holes[i]; put(h.x, h.y, h.wz, 'hole', {}); }
    // drifting harbour smoke, bent by wind, alive from the first frame
    var wind = 0.16;
    function column(bx, by, seed) {
      for (var j = 0; j < 7; j++) {
        var ph = (env.t * 0.28 + j * 0.16 + seed) % 1;
        var rise = ph * 2.6;
        put(bx + rise * wind + Math.sin(env.t * 0.6 + j + seed) * 0.22, by - ph * 0.7,
          0.3 + rise, 'puff', { r: 0.42 + ph * 0.85, a: (1 - ph) * 0.42, tint: 'grey' });
      }
    }
    column(12, 8, 0.1); column(48, 6, 0.5); column(38, 2, 0.8); column(6, 24, 0.3);
    for (i = 0; i < M.clouds.length; i++) {
      var c = M.clouds[i], age = c.age;
      if (age > c.life) continue;
      for (var j2 = 0; j2 < 9; j2++) {
        var a = j2 * 1.7;
        var px = c.x + Math.cos(a) * (0.35 + j2 * 0.12) + wind * age * (0.4 + j2 * 0.06);
        var py = c.y + Math.sin(a) * (0.35 + j2 * 0.1);
        var wz = 0.18 + j2 * 0.13 + Math.min(1.2, age * 0.13);
        put(px, py, wz, 'puff', { r: 0.42 + age * 0.16 + j2 * 0.03, a: clamp((1 - age / c.life) * 0.62, 0, 1) });
      }
    }
    // objective ring marker floats above the current point
    if (M.phase === 'play' && M.cur < 3) {
      var o = M.objs[M.cur];
      put(o.x, o.y, 1.15 + Math.sin(env.t * 1.6) * 0.05, 'marker', { letter: o.id });
    }
    return list;
  }

  /* -------------------------------- sky --------------------------------- */
  var SUN_A = -1.72;
  function applyCamera(st, env) {
    var cam = null;
    if (M.phase === 'outro' || M.phase === 'end') cam = VIEWS.wide;
    else if (M.photo && !env.auto) cam = M.photo;
    if (cam) {
      st.x = cam.x; st.y = cam.y; st.angle = cam.a; st.pitch = cam.p; st.fov = cam.fov || 1.31;
    } else st.fov = lerp(1.31, 0.86, gun.ads);
  }
  function sky(ctx, env, st) {
    applyCamera(st, env);
    var w = env.w, h = env.h, t = env.t, i;
    var P = (w / 2) / Math.tan((st.fov || 1.31) / 2), HZ = h * (0.5 + (st.pitch || 0));
    var cam = { p: P, h: HZ };
    // physical sky: cold blue overhead, warm broken light along the horizon
    ctx.fillStyle = G.linear(ctx, 0, 0, 0, HZ, [[0, C.sky0], [0.42, C.sky1], [0.82, '#6c726f'], [1, C.sky2]]);
    ctx.fillRect(0, 0, w, HZ + 2);
    // broken cloud deck, drifting with the wind and parallax with the view
    var shift = -(t * 3.2 + (st.angle * P * 0.36)) % (w * 1.3);
    ctx.save(); ctx.globalAlpha = 0.9;
    ctx.drawImage(CLOUD, shift, -h * 0.06, w * 1.3, h * 0.52);
    ctx.drawImage(CLOUD, shift + w * 1.3, -h * 0.06, w * 1.3, h * 0.52);
    ctx.restore();
    // low sun, sun scatter and light shafts
    var sd = wrap(SUN_A - st.angle);
    if (Math.abs(sd) < 1.45) {
      var sx = w / 2 + Math.tan(clamp(sd, -1.3, 1.3)) * P;
      var sy = HZ - h * 0.055;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      var hg = ctx.createRadialGradient(sx, sy, 2, sx, sy, Math.max(w, h) * 0.55);
      hg.addColorStop(0, 'rgba(255,231,180,.72)'); hg.addColorStop(0.13, 'rgba(232,190,124,.30)');
      hg.addColorStop(0.45, 'rgba(190,164,124,.10)'); hg.addColorStop(1, 'rgba(160,150,130,0)');
      ctx.fillStyle = hg; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(255,244,214,.92)'; ctx.beginPath(); ctx.arc(sx, sy, Math.max(7, h * 0.021), 0, TAU); ctx.fill();
      for (var s = 0; s < 6; s++) {
        var ang = -0.55 + s * 0.22 + Math.sin(t * 0.2 + s) * 0.03;
        ctx.fillStyle = 'rgba(248,220,164,' + (0.025 + 0.01 * Math.sin(t + s)) + ')';
        ctx.beginPath(); ctx.moveTo(sx, sy);
        ctx.lineTo(sx + Math.cos(ang) * w * 0.9, sy + Math.sin(ang) * h * 0.2 - h * 0.18);
        ctx.lineTo(sx + Math.cos(ang + 0.06) * w * 0.9, sy + Math.sin(ang + 0.06) * h * 0.2 - h * 0.18);
        ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }
    // haze with sun scatter at the horizon
    ctx.fillStyle = G.linear(ctx, 0, HZ - h * 0.14, 0, HZ + h * 0.05,
      [[0, 'rgba(190,186,168,0)'], [0.65, 'rgba(196,188,164,.28)'], [1, 'rgba(150,158,158,.10)']]);
    ctx.fillRect(0, HZ - h * 0.14, w, h * 0.19);
    // far silhouette: roofs, harbour cranes, pylons, distant smoke
    var sh = clamp(h * 0.23, 92, 236), sw = Math.max(w * 1.35, 900);
    var par = -(st.angle * P * 0.15) % sw;
    ctx.save(); ctx.globalAlpha = 0.62; ctx.filter = 'none';
    ctx.drawImage(SKYLINE, par, HZ - sh * 0.9, sw, sh);
    ctx.drawImage(SKYLINE, par + sw, HZ - sh * 0.9, sw, sh);
    ctx.globalAlpha = 0.28;
    ctx.drawImage(SKYLINE, par * 1.4 - 120, HZ - sh * 1.12, sw * 1.1, sh * 1.12);
    ctx.restore();
    // two low aircraft crossing the fight, deterministic from absolute time
    drawAircraft(ctx, env, st, P, HZ, 4.0, 0, 1);
    drawAircraft(ctx, env, st, P, HZ, 19.5, 1, -1);
    // artillery flashes walking along the far quay
    for (var a = 0; a < 3; a++) {
      var step = Math.floor(t / 2.35), ph = (t / 2.35) % 1;
      var fx = w * (0.15 + A.hash(step * 3 + a, SEED * 0.01) * 0.72);
      var fy = HZ - sh * (0.45 + a * 0.14);
      var fa = Math.max(0, (1 - ph * 4)) * 0.55;
      if (fa > 0.01) {
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        var fg = ctx.createRadialGradient(fx, fy, 1, fx, fy, 34);
        fg.addColorStop(0, 'rgba(255,224,164,' + fa + ')'); fg.addColorStop(1, 'rgba(255,180,100,0)');
        ctx.fillStyle = fg; ctx.fillRect(fx - 34, fy - 34, 68, 68); ctx.restore();
      }
    }
    // wet ground: mirrored sky, a warm path under the sun, dark asphalt at the feet
    ctx.fillStyle = G.linear(ctx, 0, HZ, 0, h,
      [[0, '#5c6569'], [0.08, '#39464c'], [0.4, '#2a343a'], [1, '#141b20']]);
    ctx.fillRect(0, HZ, w, h - HZ);
    ctx.save(); ctx.globalAlpha = 0.16;
    ctx.translate(0, HZ); ctx.scale(1, -0.42);
    ctx.drawImage(CLOUD, shift, -h * 0.06, w * 1.3, h * 0.5);
    ctx.restore();
    if (Math.abs(sd) < 1.5) {
      var gx = w / 2 + Math.tan(clamp(sd, -1.3, 1.3)) * P;
      // a soft reflected sun on the wet street, elongated with no hard edge
      ctx.save(); ctx.translate(gx, HZ + h * 0.02); ctx.scale(1, 2.7);
      var sr = Math.max(90, h * 0.19);
      var sg = ctx.createRadialGradient(0, 0, 2, 0, 0, sr);
      sg.addColorStop(0, 'rgba(238,198,132,.30)');
      sg.addColorStop(0.32, 'rgba(214,170,108,.12)');
      sg.addColorStop(1, 'rgba(200,160,100,0)');
      ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(0, 0, sr, 0, TAU); ctx.fill();
      ctx.restore();
      ctx.save(); ctx.globalAlpha = 0.16;
      for (var shimmer = 0; shimmer < 5; shimmer++) {
        var sy2 = HZ + h * (0.06 + shimmer * 0.075);
        var half = w * (0.02 + shimmer * 0.022);
        ctx.strokeStyle = shimmer % 2 ? 'rgba(232,198,144,.5)' : 'rgba(160,184,192,.4)';
        ctx.lineWidth = 1 + shimmer * 0.3;
        ctx.beginPath(); ctx.moveTo(gx - half, sy2); ctx.lineTo(gx + half, sy2); ctx.stroke();
      }
      ctx.restore();
    }
    // canal water and the steel tram bridge, drawn as proper floor polygons
    for (var cx = 1; cx < 24; cx += 3) {
      if (groundQuad(ctx, st, env, cam, cx, 18, cx + 3, 20)) {
        ctx.fillStyle = 'rgba(22,40,48,.86)'; ctx.fill();
        ctx.strokeStyle = 'rgba(150,180,190,.12)'; ctx.lineWidth = 1; ctx.stroke();
      }
    }
    for (cx = 34; cx < 56; cx += 3) {
      if (groundQuad(ctx, st, env, cam, cx, 18, cx + 3, 20)) {
        ctx.fillStyle = 'rgba(22,40,48,.86)'; ctx.fill();
        ctx.strokeStyle = 'rgba(150,180,190,.12)'; ctx.lineWidth = 1; ctx.stroke();
      }
    }
    for (cx = 24; cx < 33; cx += 1) {
      if (groundQuad(ctx, st, env, cam, cx, 18, cx + 1, 20)) {
        ctx.fillStyle = ((cx % 2) ? '#3b4342' : '#333b3a'); ctx.fill();
        ctx.strokeStyle = 'rgba(150,160,155,.12)'; ctx.lineWidth = 1; ctx.stroke();
      }
    }
    // puddles with a sky highlight and a slow shimmer
    for (i = 0; i < M.puddles.length; i++) {
      var pu = M.puddles[i];
      var pp = point(st, env, pu.x, pu.y, 0, cam);
      if (!pp || pp.z > 30 || pp.x < -200 || pp.x > w + 200) continue;
      var pw = pu.rx * 2 * pp.P, ph = pu.ry * 2 * pp.P;
      if (pw < 3) continue;
      ctx.save(); ctx.globalAlpha = 0.34 + 0.07 * Math.sin(t * 1.4 + i);
      ctx.drawImage(PUDDLE, pp.x - pw / 2, pp.y - ph / 2, pw, ph);
      ctx.restore();
    }
    // the active capture ring on the cobbles
    if (M.phase === 'play' && M.cur < 3) {
      var o = M.objs[M.cur];
      ctx.save(); ctx.strokeStyle = 'rgba(200,160,106,' + (0.35 + 0.12 * Math.sin(t * 2)) + ')';
      ctx.lineWidth = 2; ctx.setLineDash([7, 9]); ctx.beginPath();
      var started = false;
      for (var ri = 0; ri <= 48; ri++) {
        var ra = ri * TAU / 48;
        var rp = point(st, env, o.x + Math.cos(ra) * o.r, o.y + Math.sin(ra) * o.r, 0.02, cam);
        if (!rp) { started = false; continue; }
        if (!started) { ctx.moveTo(rp.x, rp.y); started = true; } else ctx.lineTo(rp.x, rp.y);
      }
      ctx.stroke(); ctx.setLineDash([]); ctx.restore();
    }
  }
  function drawAircraft(ctx, env, st, P, HZ, t0, kind, dir) {
    var period = 26, ph = ((env.t - t0) % period + period) % period;
    if (ph > 7.5) return;
    var u = ph / 7.5, w = env.w, h = env.h;
    var x = dir > 0 ? -w * 0.2 + u * w * 1.4 : w * 1.2 - u * w * 1.4;
    var y = HZ - h * (0.26 + kind * 0.055) - Math.sin(t0) * 8;
    var sz = (0.082 + kind * 0.009) * h;
    ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1);
    ctx.strokeStyle = 'rgba(226,222,208,.13)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-sz * 4.2, -sz * 0.5); ctx.lineTo(-sz * 0.8, -sz * 0.05); ctx.stroke();
    ctx.fillStyle = 'rgba(44,52,58,.94)';
    ctx.beginPath();
    ctx.moveTo(-sz * 0.85, -sz * 0.09); ctx.lineTo(sz * 0.2, -sz * 0.13);
    ctx.lineTo(sz * 0.75, -sz * 0.04); ctx.lineTo(sz * 0.9, sz * 0.04);
    ctx.lineTo(sz * 0.15, sz * 0.13); ctx.lineTo(-sz * 0.85, sz * 0.09); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(152,150,138,.26)';
    ctx.beginPath(); ctx.moveTo(-sz * 0.85, sz * 0.055); ctx.lineTo(sz * 0.82, sz * 0.03);
    ctx.lineTo(sz * 0.15, sz * 0.13); ctx.lineTo(-sz * 0.85, sz * 0.09); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(44,52,58,.94)';
    ctx.beginPath(); ctx.moveTo(-sz * 0.1, -sz * 0.1); ctx.lineTo(-sz * 0.5, -sz * 0.72);
    ctx.lineTo(-sz * 0.12, -sz * 0.72); ctx.lineTo(sz * 0.3, -sz * 0.1); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-sz * 0.1, sz * 0.1); ctx.lineTo(-sz * 0.5, sz * 0.6);
    ctx.lineTo(-sz * 0.06, sz * 0.6); ctx.lineTo(sz * 0.25, sz * 0.1); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-sz * 0.72, -sz * 0.07); ctx.lineTo(-sz * 0.95, -sz * 0.42);
    ctx.lineTo(-sz * 0.7, -sz * 0.4); ctx.lineTo(-sz * 0.56, -sz * 0.07); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(226,190,132,.38)'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(-sz * 0.8, -sz * 0.09); ctx.lineTo(sz * 0.85, -sz * 0.02); ctx.stroke();
    ctx.strokeStyle = 'rgba(16,22,26,.5)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-sz * 0.1, -sz * 0.58); ctx.lineTo(sz * 0.28, -sz * 0.1); ctx.stroke();
    ctx.fillStyle = 'rgba(240,190,120,.7)'; ctx.beginPath(); ctx.arc(sz * 0.84, 0, sz * 0.055, 0, TAU); ctx.fill();
    ctx.restore();
  }

  /* ---------------------------- gun & rules ----------------------------- */
  function startReload() {
    if (gun.mode !== 'rifle' || gun.reload > 0 || gun.ammo >= gun.mag || gun.reserve <= 0) return;
    gun.reload = 1; gun.reloadT = 0; sfxReload();
    pushRadio(RADIO_NAMES[1] + ': I reload. Cover me.');
  }
  function pickupLauncher() {
    if (M.crate.taken) { gun.mode = gun.mode === 'launcher' ? 'rifle' : 'launcher'; return; }
    M.crate.taken = true; gun.mode = 'launcher'; gun.rockets = 2; gun.reload = 0;
    message('You pick up the shoulder launcher LW-2. It has two rounds. Press the left button to fire.', 4);
    pushRadio(RADIO_NAMES[0] + ': You have the launcher. Hit the turret ring.');
    M.score += 100;
  }
  function throwSmoke(st, auto) {
    if (gun.smoke <= 0) return;
    gun.smoke--;
    var ang = st.angle, dist = auto ? 6.5 : 7;
    if (auto && M.cur === 2) {
      var g = R.guide(st, M.mg.x, M.mg.y);
      ang = g.angle; dist = Math.min(9, g.dist);
      M.mg.marked = true; M.av.active = true; M.smokeThrown = true;
      message('Smoke marks the tower gun. Veyr armour moves forward.', 4);
      pushRadio(RADIO_NAMES[3] + ': Smoke marks the gun position in Orra Yard.');
      pushRadio('Veyr armour: We move to the smoke mark.');
    } else message('You throw smoke.', 2);
    var tx = st.x + Math.cos(ang) * dist, ty = st.y + Math.sin(ang) * dist;
    add(M.grenades, { x: st.x, y: st.y, tx: tx, ty: ty, t: 0, dur: 0.62 }, 4);
    noise({ dur: 0.09, gain: 0.035, freq: 1400, filter: 'highpass' });
  }
  function killFoe(f, byPlayer) {
    if (f.dead) return;
    f.dead = true; f.fade = 0; f.pose = 'fall'; f.flash = 0;
    M.kills++; M.score += byPlayer ? 40 : 20;
    add(M.impacts, { x: f.x, y: f.y, wz: 0.35, t: 0, life: 0.9, kind: 'dust', n: 7 }, 40);
    noise({ dur: 0.2, gain: 0.035, freq: 500, filter: 'lowpass', delay: 0.06 });
  }
  function completeObjective(k, st, env) {
    var o = M.objs[k];
    if (!o || o.held || k !== M.cur) return;
    o.held = true; o.hold = 1; M.cur = k + 1;
    M.score += 500 + k * 250;
    A.mark(ID, 'point-' + o.id);
    A.score(ID, Math.round(M.score));
    M.respawn = { x: st.x, y: st.y };
    message('You hold point ' + o.id + '. ' + (k < 2 ? 'Move to the next capture point.' : 'Hold Orra Yard.'), 4);
    pushRadio(RADIO_NAMES[0] + ': You hold ' + o.name + '. We move up.');
    sfxObjective();
    M.flashWorld = Math.max(M.flashWorld, 0.5);
    if (k === 2) { M.phase = 'outro'; M.outroT = 0; }
  }
  function forceComplete(k, st, env) {
    for (var i = 0; i < M.foes.length; i++) if (M.foes[i].k <= k && !M.foes[i].dead) killFoe(M.foes[i], false);
    if (k >= 1) M.car.dead = true;
    if (k >= 2) { M.mg.dead = true; M.tower.broken = true; }
    while (M.cur <= k && M.cur < 3) completeObjective(M.cur, st, env);
  }
  function breakTower() {
    if (M.tower.broken) return;
    M.tower.broken = true; M.mg.dead = true; M.flashWorld = 1;
    var r = A.rng(SEED + 3301);
    for (var i = 0; i < 16; i++) {
      var sw = 26 + r() * 42, sh = 24 + r() * 40;
      M.pieces.push({ x: M.tower.x + (r() - 0.5) * 1.6, y: M.tower.y + (r() - 0.5) * 0.4,
        wz: 1.1 + r() * 2.2, vx: (r() - 0.5) * 1.3, vy: (r() - 0.2) * 0.5,
        sx: Math.floor(r() * (200 - sw)), sy: Math.floor(r() * (250 - sh)),
        sw: sw, sh: sh, rot: (r() - 0.5) * 0.6, vr: (r() - 0.5) * 2.2,
        vz: r() * 0.6, done: false, t: 0 });
    }
    add(M.impacts, { x: M.tower.x, y: M.tower.y + 0.8, wz: 1.2, t: 0, life: 1.6, kind: 'dust', n: 18 }, 40);
    sfxExplosion();
    pushRadio(RADIO_NAMES[4] + ': The tower face falls. Keep low.');
    message('The tower gun stops firing.', 3.5);
  }
  function explode(x, y, wz, carHit) {
    M.flashWorld = 1; M.supp = Math.max(M.supp, 0.6);
    add(M.impacts, { x: x, y: y, wz: wz, t: 0, life: 1.1, kind: 'blast', n: 16 }, 40);
    sfxExplosion();
    if (carHit && !M.car.dead) {
      M.car.hp--;
      if (M.car.hp <= 0) {
        M.car.dead = true; M.score += 300;
        pushRadio(RADIO_NAMES[2] + ': The armoured car burns. You can cross the bridge.');
        message('You stop the armoured car.', 3);
        add(M.impacts, { x: M.car.x, y: M.car.y, wz: 0.5, t: 0, life: 1.5, kind: 'blast', n: 12 }, 40);
      } else pushRadio(RADIO_NAMES[2] + ': You hit the turret. Fire one more round.');
    }
  }
  function cosmeticFire(st, env) {
    gun.flash = 1; gun.kick = Math.min(1, gun.kick + 0.7); gun.bolt = 1;
    var a = st.angle + rr(-0.02, 0.02);
    var hit = castRay(st, a, 34);
    add(M.tracers, { ax: st.x, ay: st.y, az: 0.55, bx: st.x + Math.cos(a) * hit.t, by: st.y + Math.sin(a) * hit.t,
      bz: 0.6 + rr(-0.2, 0.4), p: 0, speed: 3.2, col: '#e8b878', player: true }, 60);
  }

  function updateGun(st, env, dt) {
    if (!M.demo && !env.auto) M.adsTarget = env.input.mouse.right ? 1 : 0;
    gun.ads = lerp(gun.ads, M.adsTarget, Math.min(1, dt * 9));
    gun.kickV += (-gun.kick * 46 - gun.kickV * 11) * dt;
    gun.kick += gun.kickV * dt;
    gun.flash = Math.max(0, gun.flash - dt * 12);
    gun.bolt = Math.max(0, gun.bolt - dt * 6);
    gun.burst = Math.max(0, gun.burst - dt * 5);
    gun.hitMark = Math.max(0, gun.hitMark - dt * 3.4);
    gun.lock = Math.max(0, gun.lock - dt);
    gun.vault = Math.max(0, gun.vault - dt);
    gun.sway += dt;
    M.turn = wrap(st.angle - M.prevAngle); M.prevAngle = st.angle;
    gun.lean = lerp(gun.lean, clamp(M.turn * 12 + (st.vx * -Math.sin(st.angle) + st.vy * Math.cos(st.angle)) * 0.012, -0.10, 0.10), Math.min(1, dt * 8));
    gun.lower = lerp(gun.lower, st.sprinting ? 1 : (st.crouching ? 0.3 : 0), Math.min(1, dt * 8));
    if (gun.reload > 0) {
      gun.reloadT += dt;
      if (gun.reloadT > 1.5 && gun.ammo < gun.mag) {
        var need = gun.mag - gun.ammo, take = Math.min(need, gun.reserve);
        gun.ammo += take; gun.reserve -= take;
      }
      if (gun.reloadT > 2.15) gun.reload = 0;
    }
    if (!env.attract || env.auto) {
      var inp = env.input;
      if (inp.justPressed('KeyR')) startReload();
      if (inp.justPressed('KeyG')) throwSmoke(st, env.auto);
      if (inp.justPressed('KeyE')) {
        if (d2(st.x, st.y, M.crate.x, M.crate.y) < 2.4 || M.crate.taken) pickupLauncher();
      }
      if (inp.justPressed('Space')) { gun.vault = 0.42; st.bob += 0.8; }
    }
  }

  /* ------------------------------ firing -------------------------------- */
  function onFire(st, env, power) {
    if (env.frozen) return;
    if (env.attract && !env.auto) { cosmeticFire(st, env); return; }
    if (gun.reload > 0 || gun.lock > 0) return;
    var ang = st.angle;
    if (gun.mode === 'launcher') {
      if (gun.rockets <= 0) { gun.mode = 'rifle'; return; }
      gun.rockets--; gun.lock = 1.05; gun.kick = 1; gun.flash = 1;
      var ray = castRay(st, ang, 38);
      M.rockets.push({ x: st.x + Math.cos(ang) * 0.4, y: st.y + Math.sin(ang) * 0.4,
        dx: Math.cos(ang), dy: Math.sin(ang), p: 0, max: Math.max(1, ray.t), wz: 0.6,
        targetCar: Math.abs(wrap(R.guide(st, M.car.x, M.car.y).diff)) < 0.35 && d2(st.x, st.y, M.car.x, M.car.y) < ray.t + 1 });
      noise({ dur: 0.5, gain: 0.12, freq: 900, filter: 'lowpass' });
      tone({ freq: 180, dur: 0.4, gain: 0.08, type: 'sawtooth', slideTo: 60 });
      pushRadio(RADIO_NAMES[2] + ': You fire a rocket.');
      if (gun.rockets <= 0) setTimeout(function () { if (gun.mode === 'launcher' && gun.rockets <= 0) gun.mode = 'rifle'; }, 1600);
      return;
    }
    if (gun.ammo <= 0) { gun.ammo = 0; startReload(); return; }
    gun.ammo--; gun.shots++; M.shots = gun.shots;
    gun.kick = Math.min(1.3, gun.kick + 0.85); gun.kickV = 4.4;
    gun.flash = 1; gun.bolt = 1; gun.burst = Math.min(24, gun.burst + 1.4);
    sfxRifle();
    // ejected case with a small arc, capped
    add(M.cases, { x: 0, y: 0, t: 0, vx: 0.6 + rr(0, 0.5), vy: -0.7 - rr(0, 0.4) }, 14);
    // a tracer every fourth round, with real travel time at range
    var ray = castRay(st, ang + rr(-0.012, 0.012), 44);
    var bx = st.x + Math.cos(ang) * ray.t, by = st.y + Math.sin(ang) * ray.t;
    if (gun.shots % 4 === 0 || ray.t > 12) {
      add(M.tracers, { ax: st.x, ay: st.y, az: 0.55, bx: bx, by: by, bz: 0.55 + rr(-0.2, 0.5),
        p: 0, speed: clamp(28 / Math.max(6, ray.t), 1.3, 4.5), col: C.warm, player: true }, 60);
    }
    // pick the nearest living thing inside the aim cone, then resolve the surface
    var best = null, bt = 1e9;
    function consider(ent, rad, kind) {
      var dx = ent.x - st.x, dy = ent.y - st.y;
      var tz = dx * Math.cos(ang) + dy * Math.sin(ang);
      var perp = Math.abs(-dx * Math.sin(ang) + dy * Math.cos(ang));
      if (tz > 0.5 && tz < ray.t + 0.35 && perp < rad && tz < bt) { best = { ent: ent, kind: kind, t: tz }; bt = tz; }
    }
    for (var i = 0; i < M.foes.length; i++) if (!M.foes[i].dead && M.foes[i].k >= M.cur - 1) consider(M.foes[i], env.auto ? 0.42 : 0.3, 'foe');
    if (!M.car.dead) consider(M.car, 1.0, 'car');
    if (!M.mg.dead) consider(M.mg, 0.6, 'mg');
    if (!best && env.auto) {
      for (var ai = 0; ai < M.foes.length; ai++) {
        var ef = M.foes[ai];
        if (ef.dead || ef.k < M.cur - 1) continue;
        var gd = Math.abs(wrap(Math.atan2(ef.y - st.y, ef.x - st.x) - ang));
        var tz2 = d2(st.x, st.y, ef.x, ef.y);
        if (gd < 0.15 && tz2 < 34 && lineClear(st, st.x, st.y, ef.x, ef.y)) {
          if (!best || tz2 < best.t) best = { ent: ef, kind: 'foe', t: tz2 };
        }
      }
    }
    if (best && lineClear(st, st.x, st.y, best.ent.x, best.ent.y)) {
      if (best.kind === 'foe') {
        best.ent.hp--;
        gun.hits++; M.hits = gun.hits; gun.hitMark = 1;
        add(M.impacts, { x: best.ent.x, y: best.ent.y, wz: 0.4, t: 0, life: 0.7, kind: 'dust', n: 5 }, 40);
        noise({ dur: 0.09, gain: 0.035, freq: 600, filter: 'lowpass', delay: 0.04 });
        if (best.ent.hp <= 0) killFoe(best.ent, true);
      } else {
        gun.hitMark = 0.5;
        add(M.impacts, { x: best.ent.x, y: best.ent.y, wz: 0.5, t: 0, life: 0.5, kind: 'steel', n: 6 }, 40);
      }
      return;
    }
    if (ray.v) {
      var kind = surfaceOf(ray.v);
      var hx = st.x + Math.cos(ang) * ray.t - Math.cos(ang) * 0.05;
      var hy = st.y + Math.sin(ang) * ray.t - Math.sin(ang) * 0.05;
      var wz = clamp(0.35 + rr(-0.25, 0.45), 0.08, 0.9);
      add(M.holes, { x: hx, y: hy, wz: wz }, 46);
      add(M.impacts, { x: hx, y: hy, wz: wz, t: 0, life: 0.65, kind: kind, n: 6 }, 40);
      sfxImpact(kind);
    } else {
      add(M.impacts, { x: st.x + Math.cos(ang) * 8, y: st.y + Math.sin(ang) * 8, wz: 0.1,
        t: 0, life: 0.5, kind: 'water', n: 5 }, 40);
    }
  }

  /* --------------------------- world update ----------------------------- */
  function enemyFire(st, env, f) {
    var dist = d2(f.x, f.y, st.x, st.y);
    if (dist > 30 || !lineClear(st, f.x, f.y, st.x, st.y)) return;
    f.flash = 1; f.pose = 'aim';
    var smokeHere = false;
    for (var i = 0; i < M.clouds.length; i++) if (d2(M.clouds[i].x, M.clouds[i].y, st.x, st.y) < 7 && M.clouds[i].age < M.clouds[i].life) smokeHere = true;
    var acc = (env.auto ? 0.14 : 0.34) * (smokeHere ? 0.35 : 1);
    var a = R.guide(f, st.x, st.y).angle + rr(-0.09, 0.09);
    var missX = st.x + Math.cos(a + PI / 2) * rr(-1.4, 1.4);
    var missY = st.y + Math.sin(a + PI / 2) * rr(-1.4, 1.4);
    add(M.tracers, { ax: f.x, ay: f.y, az: 0.52, bx: missX, by: missY, bz: 0.5,
      p: 0, speed: clamp(26 / Math.max(6, dist), 1.2, 4.2), col: C.red, player: false }, 60);
    sfxDistant(dist);
    if (RND() < acc) {
      M.hp -= env.auto ? 6 : 12; M.lastHit = st.time;
      M.supp = Math.min(1.2, M.supp + 0.55);
      noise({ dur: 0.05, gain: 0.06, freq: 5200, filter: 'highpass' });
      if (M.hp <= 0) {
        M.deaths++; M.hp = 100; st.x = M.respawn.x; st.y = M.respawn.y;
        st.vx = 0; st.vy = 0; M.supp = 0;
        message('You return to the last capture point.', 2.5);
        pushRadio(RADIO_NAMES[1] + ': You return to the squad. Keep moving.');
      }
    } else if (dist < 22) M.supp = Math.min(1, M.supp + 0.18);
  }
  function squadFire(st, env, s) {
    var target = null, td = 24;
    for (var i = 0; i < M.foes.length; i++) {
      var f = M.foes[i];
      if (f.dead || !lineClear(st, s.x, s.y, f.x, f.y)) continue;
      var d = d2(s.x, s.y, f.x, f.y);
      if (d < td) { td = d; target = f; }
    }
    if (!target) return;
    s.flash = 1; s.pose = 'aim';
    add(M.tracers, { ax: s.x, ay: s.y, az: 0.5, bx: target.x, by: target.y, bz: 0.45,
      p: 0, speed: 3.4, col: C.warm, player: true }, 60);
    sfxDistant(td);
    if (RND() < 0.24) { target.hp--; if (target.hp <= 0) killFoe(target, false); }
  }
  function missionWorld(st, env, dt) {
    var i, s, f, o;
    // exposure changes in the wrecked bookshop
    var inside = st.x > 13 && st.x < 23 && st.y > 22 && st.y < 27;
    M.interior = lerp(M.interior, inside ? 1 : 0, Math.min(1, dt * 3));
    st.fogNear = lerp(3.2, 1.4, M.interior);
    st.fogFar = lerp(41, 19, M.interior);
    // the flank route through the bookshop bypasses the armoured car
    if (M.cur === 1 && st.x > 13 && st.x < 20 && st.y > 23 && st.y < 27 && !M.flank) {
      M.flank = true; message('You can flank through the bookshop. You can bypass the armoured car.', 3.5);
      pushRadio(RADIO_NAMES[4] + ': Follow me through the bookshop.');
    }
    // squad follows in loose formation, uses cover, fires, sends short radio text
    for (i = 0; i < M.squad.length; i++) {
      s = M.squad[i];
      s.flash = Math.max(0, s.flash - dt * 9);
      s.timer -= dt;
      var ox = [-1.6, 1.7, -2.9, 2.9, 0][i], oy = [1.6, 1.4, 3.0, 2.8, 3.8][i];
      var tx = st.x + Math.cos(st.angle) * (-oy) + Math.sin(st.angle) * ox;
      var ty = st.y + Math.sin(st.angle) * (-oy) - Math.cos(st.angle) * ox;
      var nearFoe = false;
      for (var j = 0; j < M.foes.length; j++) if (!M.foes[j].dead && d2(s.x, s.y, M.foes[j].x, M.foes[j].y) < 9) nearFoe = true;
      var spd = (nearFoe ? 1.1 : 2.6) * dt;
      var dx = tx - s.x, dy = ty - s.y, dl = Math.hypot(dx, dy) || 1;
      var nx = s.x + dx / dl * Math.min(spd, dl), ny = s.y + dy / dl * Math.min(spd, dl);
      if (!R.solidAt(st.world, nx, s.y)) s.x = nx;
      if (!R.solidAt(st.world, s.x, ny)) s.y = ny;
      s.pose = nearFoe ? (i % 2 ? 'kneel' : 'aim') : (dl > 1.2 ? 'run' : 'stand');
      if (s.timer <= 0) { s.timer = 0.9 + i * 0.23 + RND() * 0.7; if (nearFoe) squadFire(st, env, s); }
      if (i === 0 && RND() < dt * 0.10) pushRadio(pick(['Pike: We hold the square.', 'Pike: Watch the upper windows.', 'Pike: Stay off the open cobbles.'], Math.floor(st.time / 9)));
    }
    // opponents hold, shift between cover points, and suppress
    for (i = 0; i < M.foes.length; i++) {
      f = M.foes[i];
      if (f.dead) { f.fade += dt; if (f.fade > 4.2) f.hidden = true; continue; }
      f.flash = Math.max(0, f.flash - dt * 9);
      f.timer -= dt;
      var cv = OBJDEF[f.k].cover[f.coverI % OBJDEF[f.k].cover.length];
      var move = Math.hypot(cv[0] - f.x, cv[1] - f.y);
      if (move > 0.4 && dt > 0) {
        var fx = f.x + (cv[0] - f.x) / (move || 1) * Math.min(1.7 * dt, move);
        var fy = f.y + (cv[1] - f.y) / (move || 1) * Math.min(1.7 * dt, move);
        if (!R.solidAt(st.world, fx, f.y)) f.x = fx;
        if (!R.solidAt(st.world, f.x, fy)) f.y = fy;
        f.pose = 'run';
      } else f.pose = (Math.floor(st.time + i) % 2 ? 'kneel' : 'aim');
      if (f.timer <= 0) {
        f.timer = 0.75 + RND() * 0.9 + (f.k >= M.cur ? 1.4 : 0);
        f.coverI = (f.coverI + 1 + Math.floor(RND() * 2)) % OBJDEF[f.k].cover.length;
        if (f.k <= M.cur && d2(f.x, f.y, st.x, st.y) < 34) enemyFire(st, env, f);
      }
    }
    // health returns in cover, out of immediate fire
    var covered = false;
    for (i = 0; i < M.props.length; i++) {
      var p = M.props[i];
      if ((p.k === 'sand' || p.k === 'rubble' || p.k === 'barrel') && d2(p.x, p.y, st.x, st.y) < 1.8) { covered = true; break; }
    }
    M.cover = covered;
    if (st.time - M.lastHit > 2.4 && (covered || M.supp < 0.2)) M.hp = Math.min(100, M.hp + dt * (covered ? 11 : 5));
    M.supp = Math.max(0, M.supp - dt * 0.55);
    // the friendly armoured vehicle answers the smoke marker
    if (M.mg.marked && !M.av.fired) {
      M.av.t += dt;
      var u = clamp(M.av.t / 3.1, 0, 1);
      M.av.x = lerp(18, 24.6, u); M.av.y = lerp(11, 10, u);
      if (M.av.t > 2.5 && !M.av.fired) {
        M.av.fired = true;
        add(M.tracers, { ax: M.av.x, ay: M.av.y, az: 0.6, bx: M.tower.x, by: M.tower.y, bz: 1.5,
          p: 0, speed: 5.5, col: '#ffdca0', player: true }, 60);
        sfxExplosion(); sfxEngine();
        pushRadio('Veyr armour: We fire on the marked face.');
      }
      if (M.av.t > 3.3) breakTower();
    }
    // capture ring
    o = M.objs[M.cur];
    if (o && M.phase === 'play') {
      var friendly = d2(st.x, st.y, o.x, o.y) < o.r ? 1 : 0, enemies = 0;
      for (i = 0; i < M.squad.length; i++) if (!M.squad[i].dead && d2(M.squad[i].x, M.squad[i].y, o.x, o.y) < o.r) friendly++;
      for (i = 0; i < M.foes.length; i++) if (!M.foes[i].dead && M.foes[i].k === M.cur && d2(M.foes[i].x, M.foes[i].y, o.x, o.y) < o.r * 1.15) enemies++;
      var block = (M.cur === 1 && !M.car.dead && !M.flank) || (M.cur === 2 && !M.mg.dead);
      if (friendly > 0 && !block) o.hold = clamp(o.hold + dt * (env.auto ? 0.22 : 0.15) * (1 - Math.min(0.65, enemies * 0.16)), 0, 1);
      else if (enemies > 0) o.hold = clamp(o.hold - dt * 0.045, 0, 1);
      if (o.hold >= 1) completeObjective(M.cur, st, env);
      if (o.hold > 0.02) A.score(ID, Math.round(M.score + o.hold * 80));
    }
    if (M.msgT > 0) M.msgT -= dt;
    M.flashWorld = Math.max(0, M.flashWorld - dt * 2.2);
    // distant battle bed and aircraft pass-by, never a music cue
    M.bed -= dt;
    if (M.bed <= 0) { M.bed = 1.45; sfxBed(); if (RND() < 0.6) sfxDistant(28); }
    var airStep = Math.floor(env.t / 26);
    if (airStep !== M.lastAir && env.t > 1) { M.lastAir = airStep; sfxWhine(); }
    // opening set piece: something big goes off ahead during the first seconds
    if (env.auto && st.time > 1.15 && !M.openBoom) {
      M.openBoom = true; explode(29.5, 31, 0.5, false);
      pushRadio(RADIO_NAMES[0] + ': We see foes at the quay. Follow me, Lantern squad.');
    }
    if (M.phase === 'outro') {
      M.outroT += dt;
      if (M.outroT > (env.auto ? 3.4 : (M.forceEndEarly ? 0.9 : 5.2))) finishRun(env);
    }
    if (env.auto && st.time > 116) finishRun(env);
  }
  function attractWorld(st, env, dt) {
    M.interior = 0;
    M.flashWorld = Math.max(0, M.flashWorld - dt * 2.2);
    M.bed -= dt;
    if (M.bed <= 0) { M.bed = 1.5; sfxBed(); sfxDistant(26); }
    var airStep = Math.floor(env.t / 26);
    if (airStep !== M.lastAir && env.t > 1) { M.lastAir = airStep; sfxWhine(); }
  }
  function updateParticles(st, env, dt) {
    var i, q;
    for (i = M.tracers.length - 1; i >= 0; i--) {
      q = M.tracers[i]; q.p += dt * q.speed;
      if (q.p >= 1) M.tracers.splice(i, 1);
    }
    for (i = M.impacts.length - 1; i >= 0; i--) {
      q = M.impacts[i]; q.t += dt; if (q.t > q.life) M.impacts.splice(i, 1);
    }
    for (i = M.cases.length - 1; i >= 0; i--) {
      q = M.cases[i]; q.t += dt; if (q.t > 1.7) M.cases.splice(i, 1);
    }
    for (i = M.rockets.length - 1; i >= 0; i--) {
      q = M.rockets[i]; q.p += dt * 14;
      if (q.p >= q.max) {
        var ex = q.x + q.dx * q.max, ey = q.y + q.dy * q.max;
        var carHit = q.targetCar && !M.car.dead && d2(ex, ey, M.car.x, M.car.y) < 2.4;
        explode(ex, ey, q.wz, carHit);
        M.rockets.splice(i, 1);
      }
    }
    for (i = M.grenades.length - 1; i >= 0; i--) {
      q = M.grenades[i]; q.t += dt;
      if (q.t >= q.dur) {
        M.clouds.push({ x: q.tx, y: q.ty, age: 0, life: 12 });
        if (M.clouds.length > 5) M.clouds.shift();
        noise({ dur: 0.5, gain: 0.06, freq: 700, filter: 'lowpass' });
        M.grenades.splice(i, 1);
      }
    }
    for (i = M.clouds.length - 1; i >= 0; i--) { M.clouds[i].age += dt; if (M.clouds[i].age > M.clouds[i].life + 1) M.clouds.splice(i, 1); }
    for (i = M.pieces.length - 1; i >= 0; i--) {
      q = M.pieces[i]; q.t += dt; q.wz += q.vz * dt - 3.2 * q.t * dt * 0.5;
      q.vz -= dt * 4.4; q.x += q.vx * dt; q.y += q.vy * dt; q.rot += q.vr * dt;
      if (q.wz < 0.1) { q.wz = 0.1; q.vx *= 0.82; q.vy *= 0.82; q.vr *= 0.8; }
      if (q.t > 6) q.done = true;
      if (q.t > 9) M.pieces.splice(i, 1);
    }
  }
  function finishRun(env) {
    if (M.finished) return;
    M.finished = true; M.phase = 'end';
    var standing = 0;
    for (var i = 0; i < M.squad.length; i++) if (!M.squad[i].dead) standing++;
    var sc = Math.round(M.score + M.hits * 8 + Math.max(0, 300 - M.deaths * 60));
    A.mark(ID, 'mission-complete');
    A.score(ID, sc);
    A.finish({
      score: sc, stars: M.cur >= 3 ? 3 : (M.cur >= 2 ? 2 : 1),
      title: 'You hold Veyr at dawn',
      lines: [
        'Time ' + Math.round(M.st ? M.st.time : 0) + ' s',
        'Captures ' + (M.cur >= 1 ? 'A' : '-') + ' ' + (M.cur >= 2 ? 'B' : '-') + ' ' + (M.cur >= 3 ? 'C' : '-'),
        'Shots ' + gun.shots + ' · hits ' + gun.hits + ' · downs ' + M.kills,
        'Squad ' + standing + ' of 5 standing · returns ' + M.deaths
      ]
    });
  }

  /* ------------------------------ onUpdate ------------------------------ */
  function onUpdate(st, env, dt) {
    M.st = st; M.env = env;
    if (env.frozen) dt = 0;
    M.demo = env.attract && !env.auto;
    st.reflect = 0.35;
    st.fogColor = '#39434a';
    if (!M.demo) {
      st.fogNear = lerp(3.2, 1.4, M.interior);
      st.fogFar = lerp(41, 19, M.interior);
    } else { st.fogNear = 3.2; st.fogFar = 41; }
    updateGun(st, env, dt);
    if (M.demo) attractWorld(st, env, dt);
    else missionWorld(st, env, dt);
    updateParticles(st, env, dt);
    applyCamera(st, env);
    M._sprites = buildSprites(st, env);
  }

  /* --------------------------- world effects ---------------------------- */
  function onWorld(ctx, env, st) {
    var w = env.w, h = env.h, t = env.t, i;
    // tram wires strung between the poles, sagging in the damp air
    ctx.save(); ctx.strokeStyle = 'rgba(28,34,36,.55)'; ctx.lineWidth = 1;
    for (var side = 0; side < 2; side++) {
      var px = side === 0 ? 24.4 : 32.6;
      for (var py = 13.5; py < 39; py += 4.2) {
        var a = point(st, env, px, py, 1.22), b = point(st, env, px, py + 4.2, 1.22);
        if (a && b && a.z < 42 && b.z < 42) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y);
          ctx.quadraticCurveTo((a.x + b.x) / 2, (a.y + b.y) / 2 + Math.min(14, 90 / Math.max(1, a.z)), b.x, b.y);
          ctx.stroke();
        }
      }
    }
    ctx.restore();
    // distant fire between the stone walls: always alive, also on a frozen frame
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (var at = 0; at < 8; at++) {
      var phase = (t * (0.55 + at * 0.05) + at * 0.173) % 1;
      var fx0 = 22 + (at % 4) * 2.6, fy0 = 30 - (at % 3) * 5;
      var tx0 = fx0 + Math.sin(at * 2.1) * 7, ty0 = fy0 - 6 - (at % 4) * 3;
      var u0 = Math.max(0, phase - 0.075), u1 = Math.min(1, phase);
      var wz0 = 0.5 + (at % 3) * 0.2;
      var pa = point(st, env, lerp(fx0, tx0, u0), lerp(fy0, ty0, u0), wz0);
      var pb = point(st, env, lerp(fx0, tx0, u1), lerp(fy0, ty0, u1), wz0);
      if (!pa || !pb || pa.z > 38) continue;
      ctx.globalAlpha = 0.26;
      ctx.strokeStyle = at % 2 ? '#d9a066' : '#edc58a';
      ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
    }
    ctx.restore();
    // tracers with travel time, drawn as short bright streaks in the haze
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (i = 0; i < M.tracers.length; i++) {
      var q = M.tracers[i];
      var p0 = Math.max(0, q.p - 0.075), p1 = Math.min(1, q.p);
      var ax = lerp(q.ax, q.bx, p0), ay = lerp(q.ay, q.by, p0), az = lerp(q.az, q.bz, p0);
      var bx = lerp(q.ax, q.bx, p1), by = lerp(q.ay, q.by, p1), bz = lerp(q.az, q.bz, p1);
      var A0 = point(st, env, ax, ay, az), A1 = point(st, env, bx, by, bz);
      if (!A0 || !A1) continue;
      ctx.strokeStyle = q.col; ctx.lineWidth = Math.max(1, 2.4 * Math.min(2, 14 / Math.max(2, A0.z)));
      ctx.globalAlpha = 0.8;
      ctx.beginPath(); ctx.moveTo(A0.x, A0.y); ctx.lineTo(A1.x, A1.y); ctx.stroke();
      ctx.globalAlpha = 0.22; ctx.lineWidth += 3;
      ctx.beginPath(); ctx.moveTo(A0.x, A0.y); ctx.lineTo(A1.x, A1.y); ctx.stroke();
    }
    ctx.restore();
    // surface answers: chips, sparks, splinters, sprays
    for (i = 0; i < M.impacts.length; i++) {
      var im = M.impacts[i], u = im.t / im.life;
      var col = im.kind === 'steel' ? '#ffd58a' : im.kind === 'wood' ? '#c8a878' :
        im.kind === 'water' ? '#a9c8d0' : im.kind === 'glass' ? '#c8dce0' :
          im.kind === 'blast' ? '#f0b46a' : '#b8b4a4';
      for (var j = 0; j < im.n; j++) {
        var a2 = j * 2.399 + j * 0.3;
        var sp = (im.kind === 'blast' ? 1.7 : 0.85) * (0.5 + (j % 5) * 0.16);
        var pp = point(st, env, im.x + Math.cos(a2) * u * sp, im.y + Math.sin(a2) * u * sp,
          im.wz + (u * 0.6 - u * u * 0.9) * sp, null);
        if (!pp) continue;
        ctx.save(); ctx.globalAlpha = clamp((1 - u) * 0.85, 0, 1);
        if (im.kind === 'steel' || im.kind === 'blast') {
          ctx.strokeStyle = col; ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.moveTo(pp.x, pp.y);
          ctx.lineTo(pp.x + Math.cos(a2) * (5 + 8 * u), pp.y + Math.sin(a2) * (5 + 8 * u)); ctx.stroke();
        } else {
          ctx.fillStyle = col; ctx.beginPath(); ctx.arc(pp.x, pp.y, Math.max(0.6, 2.2 * (1 - u)), 0, TAU); ctx.fill();
        }
        ctx.restore();
      }
    }
    // embers and paper above the fires, deterministic so a frozen frame lives
    if (M.fires) {
      for (i = 0; i < 42; i++) {
        var f = M.fires[i % M.fires.length];
        var ph = (t * 0.33 + i * 0.137) % 1;
        var ex = f[0] + Math.sin(i * 12.3 + t * 0.6) * (0.4 + ph), ey = f[1] + Math.cos(i * 7.1 + t * 0.4) * (0.3 + ph);
        var ep = point(st, env, ex, ey, 0.15 + ph * 1.9);
        if (!ep || ep.z > 34) continue;
        ctx.save(); ctx.globalAlpha = (1 - ph) * 0.75;
        ctx.fillStyle = ph < 0.6 ? '#f0b56a' : '#d8c6a4';
        ctx.fillRect(ep.x, ep.y, Math.max(1, 2.2 - ep.z * 0.02), Math.max(1, 2.2 - ep.z * 0.02));
        ctx.restore();
      }
    }
    // thick smoke screen from a grenade, alive around the aim point
    for (i = 0; i < M.clouds.length; i++) {
      var c = M.clouds[i];
      if (c.age > c.life) continue;
      var cp = point(st, env, c.x, c.y, 0.8);
      if (!cp) continue;
      ctx.save(); ctx.globalAlpha = clamp((1 - c.age / c.life) * 0.18, 0, 1);
      ctx.fillStyle = '#b3b8b4';
      ctx.beginPath(); ctx.arc(cp.x, cp.y, Math.max(20, cp.P * 1.4), 0, TAU); ctx.fill();
      ctx.restore();
    }
    // rocket in flight with a smoke trail
    for (i = 0; i < M.rockets.length; i++) {
      var rk = M.rockets[i];
      var rp = point(st, env, rk.x + rk.dx * rk.p, rk.y + rk.dy * rk.p, rk.wz);
      if (!rp) continue;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      var rg = ctx.createRadialGradient(rp.x, rp.y, 1, rp.x, rp.y, Math.max(6, rp.P * 0.35));
      rg.addColorStop(0, 'rgba(255,226,164,.9)'); rg.addColorStop(1, 'rgba(240,150,60,0)');
      ctx.fillStyle = rg; ctx.fillRect(rp.x - 40, rp.y - 40, 80, 80);
      ctx.restore();
    }
    // one-frame light on the world from the muzzle and explosions
    if (gun.flash > 0.6 || M.flashWorld > 0.2) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = clamp(gun.flash * 0.10 + M.flashWorld * 0.16, 0, 0.28);
      var fg = ctx.createRadialGradient(w / 2, h * 0.62, 2, w / 2, h * 0.62, h);
      fg.addColorStop(0, 'rgba(255,214,150,1)'); fg.addColorStop(1, 'rgba(255,180,100,0)');
      ctx.fillStyle = fg; ctx.fillRect(0, 0, w, h); ctx.restore();
    }
  }

  /* ----------------------- first-person weapon -------------------------- */
  function poly(ctx, pts, fill, stroke, lw) {
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); }
  }
  function onWeapon(ctx, env, st) {
    var w = env.w, h = env.h;
    var sc = clamp(Math.min(w / 1500, h / 820), 0.29, 1.35);
    if (M.photo && M.photo.fov && M.photo.fov <= 1.02 && !env.auto) sc *= 1.14;
    var ads = gun.ads;
    var hipX = w * 0.88 - 720 * sc, hipY = h * 0.99 - 420 * sc;
    var sightX = w / 2 - 400 * sc, sightY = h * (0.5 + st.pitch) - 155 * sc;
    var tx = lerp(hipX, sightX, ads), ty = lerp(hipY, sightY, ads);
    tx += Math.sin(gun.sway * 1.6) * 3 * (1 - ads) + gun.lean * 48;
    ty += Math.sin(gun.sway * 1.1 + 1) * 2.5 * (1 - ads) + gun.kick * 30 + gun.lower * 130 + gun.vault * 42;
    var rot = -gun.lean * 0.45 + gun.lower * 0.12 + gun.kick * 0.035 + (st.sprinting ? Math.sin(gun.sway * 7) * 0.015 : 0);
    ctx.save();
    ctx.translate(tx + 400 * sc, ty + 300 * sc); ctx.rotate(rot); ctx.scale(sc, sc); ctx.translate(-400, -300);
    M.gunScreen = { tx: tx, ty: ty, sc: sc, ads: ads, rot: rot };

    // sling behind the weapon
    ctx.strokeStyle = '#2b302e'; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(150, 205); ctx.quadraticCurveTo(360, 348, 600, 262); ctx.stroke();
    ctx.strokeStyle = 'rgba(190,180,150,.18)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(150, 202); ctx.quadraticCurveTo(360, 344, 600, 259); ctx.stroke();

    // far sleeve and gloved hand on the handguard
    var sleeve = G.linear(ctx, 150, 250, 250, 420, [[0, '#47555b'], [0.45, '#2b363c'], [1, '#1a2227']]);
    poly(ctx, [[128, 420], [232, 420], [252, 292], [208, 258], [176, 272]], sleeve, 'rgba(12,16,18,.8)', 2);
    ctx.strokeStyle = 'rgba(186,196,196,.10)'; ctx.lineWidth = 3;
    for (var fold = 0; fold < 3; fold++) {
      ctx.beginPath(); ctx.moveTo(150 + fold * 22, 414);
      ctx.quadraticCurveTo(180 + fold * 18, 350, 202 + fold * 12, 282); ctx.stroke();
    }
    ctx.fillStyle = '#263034'; ctx.fillRect(178, 258, 64, 15);
    ctx.strokeStyle = 'rgba(198,190,166,.2)'; ctx.lineWidth = 1;
    for (var f1 = 0; f1 < 3; f1++) { ctx.beginPath(); ctx.moveTo(186, 266 + f1 * 4); ctx.lineTo(238, 266 + f1 * 4); ctx.stroke(); }
    poly(ctx, [[186, 245], [246, 240], [256, 270], [196, 278]], '#252d2f', 'rgba(140,150,148,.3)', 1);
    for (f1 = 0; f1 < 4; f1++) { ctx.fillStyle = '#303a3b'; G.rr(ctx, 192 + f1 * 14, 240, 12, 22, 5); ctx.fill(); }

    // barrel, handguard, rail, front sight and muzzle brake
    ctx.save();
    if (ads > 0.35) ctx.globalAlpha = 1 - ads * 0.42;
    var metal = G.linear(ctx, 0, 160, 0, 215, [[0, '#78817f'], [0.32, '#3d4748'], [0.7, '#252e30'], [1, '#151c1e']]);
    poly(ctx, [[70, 176], [296, 190], [300, 212], [72, 202]], metal, 'rgba(12,16,18,.8)', 1.5);
    ctx.fillStyle = '#242c2e';
    for (var rib = 0; rib < 9; rib++) ctx.fillRect(96 + rib * 22, 184 + rib * 1.2, 8, 21);
    ctx.fillStyle = 'rgba(200,206,200,.14)'; ctx.fillRect(72, 177, 224, 2);
    ctx.fillStyle = '#1e2628'; ctx.fillRect(40, 182, 34, 14);
    ctx.fillStyle = '#3b4446'; ctx.fillRect(28, 179, 16, 20);
    ctx.fillStyle = '#151b1d'; ctx.fillRect(30, 184, 4, 4); ctx.fillRect(30, 190, 4, 4);
    ctx.fillStyle = '#2c3436'; ctx.fillRect(72, 166, 382, 9);
    for (var notch = 0; notch < 24; notch++) { ctx.fillStyle = 'rgba(12,16,18,.75)'; ctx.fillRect(80 + notch * 15, 166, 4, 9); }
    ctx.fillStyle = '#3a4244'; ctx.fillRect(104, 138, 6, 30); ctx.fillRect(94, 134, 26, 7);
    ctx.fillStyle = '#c8a06a'; ctx.fillRect(106, 140, 2, 22);
    ctx.restore();

    // receiver, ejection port, bolt, charging handle, serial plate
    var body = G.linear(ctx, 0, 168, 0, 258, [[0, '#697473'], [0.28, '#3b4547'], [0.72, '#242d2f'], [1, '#151c1e']]);
    poly(ctx, [[288, 170], [438, 168], [452, 192], [446, 248], [292, 252], [282, 210]], body, 'rgba(10,14,16,.85)', 2);
    ctx.fillStyle = 'rgba(220,214,196,.13)'; ctx.fillRect(292, 172, 146, 3);
    ctx.fillStyle = '#151b1d'; ctx.fillRect(322, 184, 66, 19);
    ctx.fillStyle = '#525b5b'; ctx.fillRect(326 + gun.bolt * 26, 187, 26, 13);
    ctx.fillStyle = 'rgba(210,206,186,.25)'; ctx.fillRect(326 + gun.bolt * 26, 187, 26, 2);
    ctx.fillStyle = '#394244'; ctx.fillRect(418, 176, 26, 9);
    ctx.fillStyle = '#1d2527'; ctx.fillRect(444, 180, 10, 18);
    ctx.fillStyle = '#646b69'; ctx.beginPath(); ctx.arc(302, 232, 5, 0, TAU); ctx.fill();
    ctx.fillStyle = '#c8a06a'; ctx.beginPath(); ctx.arc(302, 232, 2, 0, TAU); ctx.fill();
    ctx.fillStyle = '#20282a'; ctx.fillRect(396, 246, 18, 12);
    ctx.fillStyle = '#333c3e';
    poly(ctx, [[370, 250], [416, 250], [428, 322], [386, 330]], '#2b3436', 'rgba(10,14,16,.8)', 2);
    for (var gr = 0; gr < 6; gr++) { ctx.fillStyle = 'rgba(190,186,166,.12)'; ctx.fillRect(376 + gr * 4, 262, 2, 58); }
    ctx.fillStyle = '#6f756e'; ctx.fillRect(300, 212, 74, 22);
    ctx.strokeStyle = 'rgba(20,24,24,.7)'; ctx.strokeRect(300, 212, 74, 22);
    ctx.fillStyle = '#20282a'; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'left';
    ctx.fillText('VEYR 09', 305, 225);
    ctx.fillStyle = '#8b8d7e'; ctx.font = '7px monospace'; ctx.fillText('A-4471  KESTREL', 305, 232);

    // rear sight aperture (lines up with the aim point when aiming)
    ctx.fillStyle = '#20282a'; ctx.beginPath(); ctx.arc(400, 148, 20, 0, TAU); ctx.fill();
    ctx.fillStyle = '#4a5354'; ctx.beginPath(); ctx.arc(400, 148, 16, 0, TAU); ctx.fill();
    ctx.fillStyle = '#0d1416'; ctx.beginPath(); ctx.arc(400, 148, 9, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(210,204,180,.35)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(400, 148, 20, 0, TAU); ctx.stroke();

    // magazine, dropped and replaced during a full reload
    var magDrop = gun.reload > 0 ? clamp((gun.reloadT - 0.35) / 0.6, 0, 1) : 0;
    var magIn = gun.reload > 0 ? clamp((gun.reloadT - 0.85) / 0.6, 0, 1) : 1;
    if (gun.reload > 0 && magDrop > 0 && magDrop < 1) {
      ctx.save(); ctx.translate(352, 270 + magDrop * 210); ctx.rotate(magDrop * 0.8);
      ctx.fillStyle = '#2c3436'; G.rr(ctx, -26, 0, 52, 92, 5); ctx.fill(); ctx.restore();
    }
    if (magIn > 0) {
      ctx.save(); ctx.translate(0, (1 - magIn) * 120);
      ctx.fillStyle = G.linear(ctx, 330, 240, 390, 360, [[0, '#3c4547'], [1, '#202829']]);
      poly(ctx, [[332, 246], [390, 246], [396, 352], [340, 360]], ctx.fillStyle, 'rgba(10,14,16,.8)', 2);
      for (var mr = 0; mr < 6; mr++) { ctx.fillStyle = 'rgba(190,186,166,.14)'; ctx.fillRect(336 + mr * 2, 262 + mr * 15, 56, 2); }
      ctx.fillStyle = '#4b5454'; ctx.fillRect(336, 350, 62, 12);
      ctx.fillStyle = '#151b1d';
      for (var wh = 0; wh < 3; wh++) { ctx.beginPath(); ctx.arc(346 + wh * 22, 300, 2.5, 0, TAU); ctx.fill(); }
      ctx.restore();
    }
    // stock, butt pad, sling loops
    var stock = G.linear(ctx, 440, 190, 640, 260, [[0, '#515c5d'], [0.5, '#303a3c'], [1, '#1a2224']]);
    poly(ctx, [[446, 188], [622, 196], [650, 226], [636, 264], [446, 246]], stock, 'rgba(10,14,16,.8)', 2);
    ctx.fillStyle = '#171d1f'; ctx.fillRect(636, 202, 16, 62);
    ctx.fillStyle = 'rgba(200,196,176,.14)'; ctx.fillRect(450, 194, 170, 3);
    ctx.strokeStyle = '#5b6463'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(150, 207, 7, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.arc(614, 210, 7, 0, TAU); ctx.stroke();

    // near sleeve, cuff and gloved hand on the grip
    var sleeve2 = G.linear(ctx, 470, 250, 660, 420, [[0, '#465359'], [0.45, '#2c373d'], [1, '#1a2227']]);
    poly(ctx, [[470, 420], [700, 420], [632, 292], [560, 258], [500, 290]], sleeve2, 'rgba(12,16,18,.8)', 2);
    ctx.strokeStyle = 'rgba(186,196,196,.10)'; ctx.lineWidth = 3;
    for (var fold2 = 0; fold2 < 3; fold2++) {
      ctx.beginPath(); ctx.moveTo(690 - fold2 * 22, 414);
      ctx.quadraticCurveTo(640 - fold2 * 18, 348, 596 - fold2 * 12, 284); ctx.stroke();
    }
    ctx.fillStyle = '#263034'; ctx.fillRect(552, 256, 82, 16);
    ctx.strokeStyle = 'rgba(198,190,166,.2)';
    for (f1 = 0; f1 < 3; f1++) { ctx.beginPath(); ctx.moveTo(558, 264 + f1 * 4); ctx.lineTo(628, 264 + f1 * 4); ctx.stroke(); }
    poly(ctx, [[386, 258], [436, 250], [452, 292], [398, 306]], '#273033', 'rgba(140,150,148,.3)', 1);
    for (f1 = 0; f1 < 4; f1++) { ctx.fillStyle = '#333d3f'; G.rr(ctx, 392 + f1 * 13, 258, 12, 26, 5); ctx.fill(); }
    // edge wear, scratches, soot near the muzzle
    ctx.strokeStyle = 'rgba(232,208,158,.55)'; ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.moveTo(290, 170); ctx.lineTo(438, 168); ctx.moveTo(72, 178); ctx.lineTo(296, 190);
    ctx.moveTo(446, 190); ctx.lineTo(622, 196); ctx.stroke();
    ctx.fillStyle = 'rgba(12,16,18,.35)'; ctx.fillRect(28, 178, 30, 22);
    for (var scr = 0; scr < 7; scr++) {
      ctx.strokeStyle = 'rgba(210,204,184,' + (0.04 + scr * 0.012) + ')';
      ctx.beginPath(); ctx.moveTo(300 + scr * 19, 176 + scr * 9); ctx.lineTo(318 + scr * 19, 180 + scr * 9); ctx.stroke();
    }
    // heat haze after a long burst
    if (gun.burst > 9) {
      ctx.save(); ctx.globalAlpha = clamp((gun.burst - 9) / 15, 0, 0.35);
      ctx.strokeStyle = 'rgba(226,220,200,.6)'; ctx.lineWidth = 2;
      for (var hz = 0; hz < 5; hz++) {
        ctx.beginPath(); ctx.moveTo(78 + hz * 8, 168 - hz * 3);
        ctx.quadraticCurveTo(96 + hz * 8, 150 + Math.sin(gun.sway * 6 + hz) * 5, 114 + hz * 8, 134 - hz * 3);
        ctx.stroke();
      }
      ctx.restore();
    }
    // reload hand reaches for a fresh magazine, then returns
    if (gun.reload > 0) {
      var u = clamp(gun.reloadT / 2.15, 0, 1);
      var hx = 520 - Math.sin(u * PI) * 150, hy = 400 - Math.sin(u * PI) * 150;
      ctx.fillStyle = '#2f3a3e'; G.rr(ctx, hx - 34, hy - 24, 68, 48, 16); ctx.fill();
      ctx.fillStyle = '#465457'; G.rr(ctx, hx - 30, hy - 20, 60, 16, 8); ctx.fill();
    }
    ctx.restore();
    // in the sight the front goes soft, the target stays sharp
    if (ads > 0.45 && M.gunScreen) {
      ctx.save(); ctx.globalAlpha = (ads - 0.45) * 0.28;
      var bg = ctx.createRadialGradient(w * 0.42, h * 0.66, 5, w * 0.42, h * 0.66, h * 0.5);
      bg.addColorStop(0, 'rgba(18,24,26,0)'); bg.addColorStop(1, 'rgba(12,18,20,1)');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h); ctx.restore();
    }
  }

  /* ---------------------------- frame fx -------------------------------- */
  function onFx(ctx, env, st) {
    var w = env.w, h = env.h;
    // near-miss suppression: dim the frame edges, never heave the horizon
    if (M.supp > 0.02) {
      ctx.save();
      G.vignette(ctx, w, h, clamp(M.supp * 0.55, 0, 0.7));
      ctx.globalAlpha = clamp(M.supp * 0.3, 0, 0.4);
      ctx.strokeStyle = '#e6dcc4'; ctx.lineWidth = 1;
      for (var i = 0; i < 4; i++) {
        var yy = h * (0.2 + i * 0.2) + Math.sin(env.t * 3 + i) * 10;
        ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(14 + Math.sin(i * 3 + env.t) * 9, yy + 5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w, yy + 30); ctx.lineTo(w - 14, yy + 35); ctx.stroke();
      }
      ctx.restore();
    }
    if (M.hp < 45) {
      ctx.save(); G.vignette(ctx, w, h, (45 - M.hp) / 190); ctx.restore();
    }
    // one-frame muzzle flash at the barrel tip
    if (gun.flash > 0.55 && M.gunScreen) {
      var gs = M.gunScreen;
      var mx = gs.tx + 72 * gs.sc, my = gs.ty + 188 * gs.sc;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      var sz = 150 * gs.sc * (0.7 + gun.flash * 0.5);
      ctx.drawImage(MUZZLE, mx - sz / 2, my - sz / 2, sz, sz);
      ctx.restore();
      ctx.save(); ctx.fillStyle = 'rgba(255,224,168,' + (gun.flash * 0.055) + ')'; ctx.fillRect(0, 0, w, h); ctx.restore();
    }
    // ejected cases that arc away and land
    for (var c = 0; c < M.cases.length; c++) {
      var q = M.cases[c];
      if (!M.gunScreen) break;
      var ox = (M.gunScreen.tx + 400 * M.gunScreen.sc) + q.vx * q.t * 110 * M.gunScreen.sc + Math.sin(q.t * 9 + c) * 8;
      var oy = (M.gunScreen.ty + 214 * M.gunScreen.sc) + q.vy * q.t * 90 + 150 * q.t * q.t;
      ctx.save(); ctx.translate(ox, oy); ctx.rotate(q.t * 7 + c);
      ctx.globalAlpha = clamp(1 - q.t / 1.7, 0, 1);
      ctx.fillStyle = '#c9a35c'; G.rr(ctx, -3, -6, 6, 12, 2); ctx.fill();
      ctx.fillStyle = '#efd093'; ctx.fillRect(-3, -6, 6, 2);
      ctx.restore();
    }
    // quiet hit mark at the aim point
    if (gun.hitMark > 0.01) {
      var ax = w / 2, ay = h * (0.5 + st.pitch);
      ctx.save(); ctx.globalAlpha = clamp(gun.hitMark, 0, 0.85);
      ctx.strokeStyle = '#f0e8d4'; ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(ax - 10, ay - 10); ctx.lineTo(ax - 4, ay - 4); ctx.moveTo(ax + 10, ay - 10); ctx.lineTo(ax + 4, ay - 4);
      ctx.moveTo(ax - 10, ay + 10); ctx.lineTo(ax - 4, ay + 4); ctx.moveTo(ax + 10, ay + 10); ctx.lineTo(ax + 4, ay + 4);
      ctx.stroke(); ctx.restore();
    }
    // interior exposure, lens dirt against the sun, fine grain
    if (M.interior > 0.01) {
      ctx.save(); ctx.fillStyle = 'rgba(8,12,14,' + (M.interior * 0.32) + ')'; ctx.fillRect(0, 0, w, h); ctx.restore();
    }
    var sd = wrap(SUN_A - st.angle);
    if (Math.abs(sd) < 0.8) {
      ctx.save(); ctx.globalAlpha = 0.12;
      ctx.fillStyle = '#e6dcc0';
      for (var d = 0; d < 9; d++) {
        var dx = w / 2 + Math.tan(sd) * (w / 2) / Math.tan((st.fov || 1.31) / 2) + Math.sin(d * 3.1) * w * 0.16;
        ctx.beginPath(); ctx.arc(dx, h * (0.3 + d * 0.045), 1 + (d % 3), 0, TAU); ctx.fill();
      }
      ctx.restore();
    }
    G.grain(ctx, w, h, 0.032);
    G.vignette(ctx, w, h, 0.28);
  }

  /* -------------------------------- HUD --------------------------------- */
  function onHud(ctx, env, st) {
    var w = env.w, h = env.h;
    var S = clamp(Math.min(w / 1100, h / 700), 0.62, 1.3);
    var left = Math.max(14, w * 0.016);
    var mono = 'ui-monospace, "SFMono-Regular", Menlo, monospace';
    if (M.photo && !env.auto && M.phase === 'play') { drawPhotoLabel(ctx, env, S, mono); return; }
    // compass strip, top centre. Bearings from an invented survey datum.
    var cw = Math.min(330, w * 0.36), cx = w / 2, cy = 22;
    ctx.save();
    ctx.fillStyle = 'rgba(10,16,18,.34)'; G.rr(ctx, cx - cw / 2, cy - 8, cw, 26, 3); ctx.fill();
    ctx.strokeStyle = 'rgba(230,228,221,.22)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx - cw / 2 + 6, cy + 13); ctx.lineTo(cx + cw / 2 - 6, cy + 13); ctx.stroke();
    var heading = ((-st.angle - PI / 2) * 180 / PI % 360 + 360) % 360;
    for (var k = -6; k <= 6; k++) {
      var deg = heading + k * 5, px = cx + k * (cw / 14);
      ctx.strokeStyle = 'rgba(230,228,221,' + (k === 0 ? 0.9 : 0.35) + ')';
      ctx.lineWidth = k === 0 ? 2 : 1;
      ctx.beginPath(); ctx.moveTo(px, cy + 13); ctx.lineTo(px, cy + (k % 2 === 0 ? 4 : 8)); ctx.stroke();
      if (k % 2 === 0) {
        ctx.fillStyle = 'rgba(230,228,221,.5)'; ctx.font = Math.max(8, 8 * S) + 'px ' + mono;
        ctx.textAlign = 'center';
        ctx.fillText(('00' + Math.round(((deg % 360) + 360) % 360)).slice(-3), px, cy + 1);
      }
    }
    ctx.fillStyle = C.gold; ctx.beginPath(); ctx.moveTo(cx, cy - 9); ctx.lineTo(cx - 4, cy - 15); ctx.lineTo(cx + 4, cy - 15); ctx.closePath(); ctx.fill();
    ctx.restore();

    // objective and capture progress, top left below the SDK title
    var oy = Math.max(84, h * 0.135);
    ctx.save();
    ctx.fillStyle = 'rgba(10,16,18,.42)'; G.rr(ctx, left - 6, oy - 22, Math.min(330, w * 0.44), 86, 3); ctx.fill();
    G.copyText(ctx, 'OBJECTIVE', left, oy - 6, 10 * S, 'rgba(230,228,221,.62)', { family: mono, weight: '600', tracking: 2 });
    if (M.cur < 3) {
      var o = M.objs[M.cur];
      G.copyText(ctx, o.id + ' · ' + o.name, left, oy + 15, 16 * S, C.ink, { family: 'Georgia, serif' });
      G.copyText(ctx, o.sub, left, oy + 32, Math.max(9, 10 * S), 'rgba(230,228,221,.68)', { family: mono });
      var bw = Math.min(300, w * 0.4), by = oy + 42;
      ctx.fillStyle = 'rgba(230,228,221,.16)'; ctx.fillRect(left, by, bw, 5);
      ctx.fillStyle = o.hold >= 1 ? '#9fbd9d' : C.gold; ctx.fillRect(left, by, bw * o.hold, 5);
      ctx.strokeStyle = 'rgba(230,228,221,.3)'; ctx.lineWidth = 1; ctx.strokeRect(left, by, bw, 5);
      var contested = false;
      for (var i = 0; i < M.foes.length; i++) if (!M.foes[i].dead && M.foes[i].k === M.cur && d2(M.foes[i].x, M.foes[i].y, o.x, o.y) < o.r * 1.15) contested = true;
      var blocked = (M.cur === 1 && !M.car.dead && !M.flank) || (M.cur === 2 && !M.mg.dead);
      G.copyText(ctx, blocked ? (M.cur === 1 ? 'The car blocks the bridge. Find the launcher or flank.' : 'The tower gun stops us. Press G to mark it with smoke.')
        : (contested ? 'The garrison contests the point.' : 'Lantern squad holds the point.'),
        left, by + 18, Math.max(9, 9.5 * S), blocked ? '#d0a06a' : 'rgba(230,228,221,.65)', { family: mono });
    } else G.copyText(ctx, 'You hold three points.', left, oy + 15, 16 * S, C.ink, { family: 'Georgia, serif' });
    ctx.restore();

    // radio text under the objective. Short lines, no speech audio.
    var ry = oy + 88;
    for (i = Math.max(0, M.radio.length - 3); i < M.radio.length; i++) {
      var age = (M.st ? M.st.time : 0) - M.radio[i].t;
      ctx.save(); ctx.globalAlpha = clamp(1 - Math.max(0, age - 7) / 4, 0.15, 0.85);
      G.copyText(ctx, M.radio[i].text, left, ry, Math.max(9, 10 * S), 'rgba(180,206,210,.92)', { family: mono });
      ctx.restore(); ry += 15 * S;
    }

    // ammunition, round count and kit, bottom left
    var by2 = h - Math.max(26, 30 * S);
    ctx.save();
    G.copyText(ctx, gun.mode === 'rifle'
      ? ('0' + gun.ammo).slice(-2) + ' / ' + gun.mag
      : 'LW-2  ' + gun.rockets + ' / 2', left, by2 - 16 * S, 30 * S, C.ink, { family: mono, weight: '600', tracking: 1 });
    G.copyText(ctx, gun.mode === 'rifle' ? 'VEYR 09 ASSAULT RIFLE' : 'KESTREL SHOULDER LAUNCHER',
      left, by2, Math.max(9, 9.5 * S), 'rgba(230,228,221,.6)', { family: mono, tracking: 1.5 });
    var tickN = gun.mode === 'rifle' ? gun.mag : 2;
    var tickW = Math.min(7, (Math.min(240, w * 0.3)) / tickN);
    for (i = 0; i < tickN; i++) {
      ctx.fillStyle = i < (gun.mode === 'rifle' ? gun.ammo : gun.rockets) ? 'rgba(200,160,106,.9)' : 'rgba(230,228,221,.16)';
      ctx.fillRect(left + i * (tickW + 1), by2 + 7, Math.max(2, tickW - 2), 5);
    }
    G.copyText(ctx, 'SMOKE ' + gun.smoke + '   R ' + Math.max(0, gun.reserve) + (gun.mode === 'launcher' ? '   E STOW' : ''),
      left, by2 + 26, Math.max(9, 9 * S), 'rgba(230,228,221,.55)', { family: mono });
    if (gun.reload > 0) {
      ctx.fillStyle = 'rgba(200,160,106,.85)'; ctx.fillRect(left, by2 + 32, 150 * clamp(gun.reloadT / 2.15, 0, 1), 3);
      G.copyText(ctx, 'RELOADING', left, by2 + 46, 9 * S, C.gold, { family: mono, tracking: 2 });
    }
    ctx.restore();

    // health and squad status, bottom right, quiet
    ctx.save();
    var hx = w - Math.min(220, w * 0.3) - left;
    ctx.fillStyle = 'rgba(230,228,221,.16)'; ctx.fillRect(hx, h - 60, Math.min(180, w * 0.24), 4);
    ctx.fillStyle = M.hp > 45 ? '#9fbd9d' : '#d0805c'; ctx.fillRect(hx, h - 60, Math.min(180, w * 0.24) * M.hp / 100, 4);
    var standing = 0;
    for (i = 0; i < M.squad.length; i++) if (!M.squad[i].dead) standing++;
    G.copyText(ctx, 'LANTERN SQUAD  ' + standing + '/5   ' + (M.cover ? 'IN COVER' : 'MOVING'),
      w - left, h - 68, Math.max(9, 9.5 * S), 'rgba(230,228,221,.62)', { family: mono, align: 'right' });
    ctx.restore();

    // short centre message
    if (M.msgT > 0 && M.msg) {
      ctx.save(); ctx.globalAlpha = clamp(M.msgT, 0, 1);
      G.copyText(ctx, M.msg, w / 2, h * 0.19, 14 * S, C.ink, { family: 'Georgia, serif', align: 'center' });
      ctx.restore();
    }
    // first-second opening line
    if (st.time < 5.5 && !env.auto) {
      ctx.save(); ctx.globalAlpha = clamp((5.5 - st.time) / 2, 0, 0.8);
      G.copyText(ctx, 'Veyr, one hour after dawn. Lantern squad, capture A, then B, then C.', w / 2, h * 0.84,
        Math.max(10, 12 * S), 'rgba(230,228,221,.85)', { family: 'Georgia, serif', align: 'center' });
      ctx.restore();
    }
  }
  function drawPhotoLabel(ctx, env, S, mono) {
    var w = env.w, h = env.h;
    ctx.save(); ctx.fillStyle = 'rgba(10,16,18,.4)';
    G.rr(ctx, w / 2 - 130, h - 46, 260, 26, 3); ctx.fill();
    G.copyText(ctx, 'VEYR · ONE HOUR AFTER DAWN · ' + (VIEW_NAME || 'wide').toUpperCase(),
      w / 2, h - 28, Math.max(9, 10 * S), 'rgba(230,228,221,.8)', { family: mono, align: 'center', tracking: 1.5 });
    ctx.restore();
  }

  /* -------------------------- end / overlay ----------------------------- */
  function onOverlay(ctx, env, st) {
    if (M.phase !== 'outro' && M.phase !== 'end') return;
    var w = env.w, h = env.h, S = clamp(Math.min(w / 1100, h / 700), 0.62, 1.3);
    var cw = Math.min(430, w * 0.86), ch = Math.min(250, h * 0.42);
    var cx = w / 2, cy = h * 0.52;
    ctx.save();
    ctx.fillStyle = 'rgba(10,15,18,.80)'; G.rr(ctx, cx - cw / 2, cy - ch / 2, cw, ch, 3); ctx.fill();
    ctx.strokeStyle = 'rgba(230,228,221,.36)'; ctx.lineWidth = 1;
    G.rr(ctx, cx - cw / 2, cy - ch / 2, cw, ch, 3); ctx.stroke();
    ctx.fillStyle = C.gold; ctx.fillRect(cx - cw / 2 + 24, cy - ch / 2 + 26, 36, 2);
    G.copyText(ctx, 'VEYR · ONE HOUR AFTER DAWN', cx - cw / 2 + 24, cy - ch / 2 + 48, 10 * S,
      'rgba(200,160,106,.9)', { family: 'ui-monospace, Menlo, monospace', tracking: 2 });
    G.copyText(ctx, 'You hold three points.', cx - cw / 2 + 24, cy - ch / 2 + 82, 28 * S, C.ink, { family: 'Georgia, serif' });
    var standing = 0;
    for (var i = 0; i < M.squad.length; i++) if (!M.squad[i].dead) standing++;
    var lines = [
      'Time ' + Math.round(st.time) + ' s',
      'Captures A · B · C',
      'Shots ' + gun.shots + ' · hits ' + gun.hits + ' · downs ' + M.kills,
      'Squad ' + standing + ' of 5 standing · returns ' + M.deaths
    ];
    for (i = 0; i < lines.length; i++) {
      G.copyText(ctx, lines[i], cx - cw / 2 + 24, cy - ch / 2 + 112 + i * 22 * S,
        Math.max(10, 11 * S), 'rgba(230,228,221,.78)', { family: 'ui-monospace, Menlo, monospace' });
    }
    G.copyText(ctx, 'You hold the harbour. The town is clear.', cx - cw / 2 + 24, cy + ch / 2 - 18,
      Math.max(9, 10 * S), 'rgba(200,160,106,.8)', { family: 'Georgia, serif' });
    ctx.restore();
  }

  /* ------------------------------- bot ---------------------------------- */
  var BOT = [
    { n: 'open', max: 3.5 }, { n: 'toA', max: 13 }, { n: 'clearA', max: 15 },
    { n: 'toB', max: 12 }, { n: 'rockets', max: 9 }, { n: 'clearB', max: 14 },
    { n: 'toC', max: 13 }, { n: 'markC', max: 11 }, { n: 'clearC', max: 14 },
    { n: 'outro', max: 6 }
  ];
  function nearestFoe(k) {
    var best = null, bd = 1e9;
    for (var i = 0; i < M.foes.length; i++) {
      var f = M.foes[i];
      if (f.dead || f.k !== k || !M.st) continue;
      var d = d2(f.x, f.y, M.st.x, M.st.y);
      if (d < bd) { bd = d; best = f; }
    }
    return best;
  }
  function advance(st) { M.bot.i++; M.bot.t0 = st.time; M.adsTarget = 0; }
  function cinematic(st, env) {
    M.adsTarget = 0;
    return { f: 0.14 + 0.10 * Math.sin(env.t * 0.45), s: Math.sin(env.t * 0.3) * 0.12,
      angle: -PI / 2 + 0.18 * Math.sin(env.t * 0.16),
      fire: Math.sin(env.t * 3.1) > 0.93, power: 1 };
  }
  function onBot(st, env) {
    if (!env.auto) return cinematic(st, env);
    var b = M.bot, bt = st.time - b.t0;
    if (b.i >= BOT.length) { finishRun(env); return { f: 0, s: 0, angle: st.angle, fire: false }; }
    var ph = BOT[b.i];
    var wp = { x: st.x, y: st.y }, aim = { x: 28, y: 30 }, f = 0, s = 0, fire = false, near = 1.2;
    var i, g;
    function travel(x, y, n) { wp = { x: x, y: y }; near = n || 1.2; return R.guide(st, x, y); }
    function aimAt(x, y) { aim = { x: x, y: y }; fire = true; }
    switch (b.i) {
      case 0:
        travel(28, 39.2, 1.0); aimAt(29, 30);
        fire = fire && st.time > 0.65 && Math.sin(st.time * 8.4) > 0.1;
        if (bt > ph.max) advance(st);
        break;
      case 1:
        g = travel(28, 30, 1.3); aimAt(28, 26);
        fire = Math.sin(st.time * 5.5) > 0.72;
        if (g.dist < 1.6 || bt > ph.max) advance(st);
        break;
      case 2: {
        var fa = nearestFoe(0);
        if (fa) aimAt(fa.x, fa.y); else aimAt(28, 25);
        f = 0; s = Math.sin(st.time * 1.2) * 0.22;
        M.adsTarget = 0.65;
        if (bt > ph.max) { forceComplete(0, st, env); advance(st); }
        else if (M.cur > 0) advance(st);
        break;
      }
      case 3:
        if (!M.crate.taken) {
          g = travel(M.crate.x, M.crate.y, 1.1);
          if (g.dist < 1.5) pickupLauncher();
          fire = false;
        } else {
          g = travel(28, 20.6, 1.0);
          if (g.dist < 1.6) advance(st);
        }
        if (bt > ph.max) { if (!M.crate.taken) pickupLauncher(); advance(st); }
        break;
      case 4:
        aimAt(M.car.x, M.car.y); M.adsTarget = 0.75;
        fire = gun.mode === 'launcher' && gun.rockets > 0;
        if (M.car.dead || bt > ph.max) {
          if (!M.car.dead) { M.car.dead = true; explode(M.car.x, M.car.y, 0.5, false); }
          gun.mode = 'rifle'; advance(st);
        }
        break;
      case 5: {
        var fb = nearestFoe(1);
        if (fb) aimAt(fb.x, fb.y); else aimAt(28, 15);
        s = Math.sin(st.time * 1.3) * 0.2; M.adsTarget = 0.5;
        if (bt > ph.max) { forceComplete(1, st, env); advance(st); }
        else if (M.cur > 1) advance(st);
        break;
      }
      case 6:
        g = travel(28, 11.4, 1.3); aimAt(30, 8);
        fire = Math.sin(st.time * 4.6) > 0.75;
        if (g.dist < 1.6 || bt > ph.max) advance(st);
        break;
      case 7:
        aimAt(M.mg.x, M.mg.y); M.adsTarget = 0.55;
        if (bt > 0.6 && !M.smokeThrown) throwSmoke(st, true);
        fire = Math.sin(st.time * 5.2) > 0.6;
        if (bt > 3.0) { M.av.active = true; M.av.fired = false; M.av.t = 3.2; }
        if (bt > 3.6 && !M.tower.broken) breakTower();
        if (bt > ph.max) { M.mg.dead = true; M.tower.broken = true; breakTower(); advance(st); }
        else if (M.mg.dead && bt > 4.2) advance(st);
        break;
      case 8: {
        var fc = nearestFoe(2);
        if (fc) aimAt(fc.x, fc.y); else aimAt(30, 7);
        s = Math.sin(st.time * 1.1) * 0.18; M.adsTarget = 0.5;
        if (bt > ph.max) { forceComplete(2, st, env); advance(st); }
        else if (M.phase === 'outro') advance(st);
        break;
      }
      case 9:
        aimAt(30, 6); fire = false; M.adsTarget = 0;
        if (bt > 2.4 || bt > ph.max) finishRun(env);
        break;
    }
    // travel uses the movement bearing; holding phases use the aim bearing
    var bearing;
    if (f > 0 || (ph.n === 'toA' || ph.n === 'toB' || ph.n === 'toC' || ph.n === 'open')) {
      var mv = R.guide(st, wp.x, wp.y);
      bearing = mv.angle;
      f = mv.dist > near ? 1 : 0;
      s = clamp(-mv.diff * 0.25, -0.35, 0.35);
    } else {
      bearing = R.guide(st, aim.x, aim.y).angle;
      f = 0;
    }
    void i; void g;
    return { f: f, s: s, angle: bearing, fire: fire, power: 1 };
  }

  /* -------------------------------- boot -------------------------------- */
  function onInit(st, env) {
    M.st = st; M.env = env;
    st.fogNear = 3.2; st.fogFar = 41; st.fogColor = '#39434a'; st.reflect = 0.35;
    st.sprites = function () { return M._sprites; };
    st.cols = 0; st.step = 2;
    initEntities(st, env);
    // Space is vault, never fire. The shared raycaster treats Space as a fire key.
    var origDown = env.input.isDown;
    env.input.isDown = function (code) { return code === 'Space' ? false : origDown.call(this, code); };
    env.onFirstInput = function () {
      if (!env.auto && !env.frozen && !M.photo && Arcade.lockPointer) Arcade.lockPointer();
    };
    // URL states: start at an objective, or at the end screen
    var state = (params.get('state') || '').toUpperCase();
    if (state === 'B' || state === 'C' || state === 'END') {
      OBJDEF[0].hold = 1; OBJDEF[0].held = true; M.cur = 1;
      forceCompleteSilent(0);
      if (state === 'C' || state === 'END') { OBJDEF[1].hold = 1; M.cur = 2; forceCompleteSilent(1); }
      var sp = state === 'B' ? { x: 28, y: 22.5 } : { x: 28, y: 12.5 };
      st.x = sp.x; st.y = sp.y; st.angle = -PI / 2;
      M.respawn = { x: sp.x, y: sp.y };
      if (state === 'END') {
        OBJDEF[1].held = true; OBJDEF[2].hold = 1; OBJDEF[2].held = true;
        M.cur = 3; M.phase = 'outro'; M.outroT = 0; M.forceEndEarly = true;
        forceCompleteSilent(2);
        M.car.dead = true; M.mg.dead = true; M.tower.broken = true;
        for (var i = 0; i < M.foes.length; i++) M.foes[i].dead = true;
      }
    }
    if (M.photo) { st.x = M.photo.x; st.y = M.photo.y; st.angle = M.photo.a; st.pitch = M.photo.p; }
    M._sprites = buildSprites(st, env);
    pushRadio('Lantern squad, land at the sea wall. Point A is Kettle Square.');
    message('Capture A, then B, then C. Hold each capture point.', 5);
  }
  function forceCompleteSilent(k) {
    for (var i = 0; i < M.foes.length; i++) if (M.foes[i].k === k) M.foes[i].dead = true;
    if (k === 1) M.car.dead = true;
    if (k === 2) { M.mg.dead = true; M.tower.broken = true; }
    A.mark(ID, 'point-' + OBJDEF[k].id);
  }

  R.boot({
    id: ID,
    title: 'Breakwater',
    hint: HINT,
    background: '#141a1f',
    ink: '#e6e4dd',
    map: MAPROWS,
    wall: wallFor,
    spawn: { x: 28, y: 41.5, angle: -PI / 2 },
    sky: sky,
    fogColor: '#39434a', fogNear: 3.2, fogFar: 41,
    reflect: 0.35,
    fire: 'auto', cooldown: 0.12,
    onInit: onInit,
    onUpdate: onUpdate,
    onFire: onFire,
    onWorld: onWorld,
    onWeapon: onWeapon,
    onFx: onFx,
    onHud: onHud,
    onOverlay: onOverlay,
    onBot: onBot
  });
})();
