(function () {
  'use strict';

  var G = Arcade.gfx;
  var cl = Arcade.clamp, lp = Arcade.lerp, sm = Arcade.smooth;
  var ID = 'comb';
  var P = {
    bg: '#f6ecd8', cream: '#fbf5e8', ink: '#3a2a17', soft: 'rgba(58,42,23,.56)',
    gold: '#c78518', deep: '#8a4d09', pale: '#f7dfa2', bright: '#fff4cf',
    green: '#7a8b56', line: 'rgba(58,42,23,.20)', glass: 'rgba(255,250,232,.42)'
  };
  var SERIF = 'Georgia, "Times New Roman", serif';
  var SANS = '"Helvetica Neue", Arial, sans-serif';

  var st = {
    sx: 0, sx2: 0, ready: false, fill: 0.30, poured: 0, spill: 0,
    marks: [false, false, false], done: false, hoverDot: -1, lastPour: 0, lastScore: 0
  };
  var caches = null;
  var E = Arcade.boot({
    id: ID,
    title: 'Comb, raw honey',
    hint: 'Drag to guide the stream into the jar. Scroll to change chapter. Press 1 to 6 for a chapter.',
    background: P.bg, ink: P.ink, scroll: true, sections: 6,
    onFrame: onFrame
  });

  var views = { hero: 0, apiaries: 0.2, harvest: 0.4, tasting: 0.6, season: 0.8, footer: 1 };
  if (Object.prototype.hasOwnProperty.call(views, E.view)) E.sTarget = views[E.view];
  else if (/^[1-6]$/.test(E.view)) E.sTarget = (parseInt(E.view, 10) - 1) / 5;
  if (E.state === 'filled' || E.state === 'end') { st.fill = 0.82; st.done = true; }

  function T(ctx, s, x, y, size, color, o) {
    o = o || {};
    G.copyText(ctx, s, x, y, size, color, o);
  }
  function eyebrow(ctx, b, s, y, a) {
    T(ctx, s.toUpperCase(), b.x, y, cl(b.w * 0.026, 10, 14), P.green || '#7a8b56',
      { family: SANS, weight: '600', tracking: 2.4, align: 'left' });
  }
  function rule(ctx, x, y, w, alpha) {
    ctx.save();
    ctx.fillStyle = 'rgba(58,42,23,' + (alpha === undefined ? 0.20 : alpha) + ')';
    ctx.fillRect(x, y, w, 1);
    ctx.restore();
  }
  function line(ctx, s, x, y, w, size, color, o) {
    o = o || {};
    var family = o.family || SERIF;
    ctx.save();
    ctx.font = (o.weight || '') + ' ' + size + 'px ' + family;
    var words = String(s).split(' '), out = '', rows = [];
    for (var i = 0; i < words.length; i++) {
      var test = out ? out + ' ' + words[i] : words[i];
      if (ctx.measureText(test).width > w && out) { rows.push(out); out = words[i]; }
      else out = test;
    }
    if (out) rows.push(out);
    ctx.restore();
    for (var j = 0; j < rows.length; j++) {
      T(ctx, rows[j], x, y + j * size * 1.48, size, color, { family: family, align: o.align || 'left', weight: o.weight, tracking: o.tracking });
    }
    return rows.length;
  }

  function initCaches() {
    var r = Arcade.rng(E.seed);
    caches = {};
    caches.paper = G.offscreen(256, 256, function (c, w, h) {
      c.fillStyle = '#f6ecd8'; c.fillRect(0, 0, w, h);
      for (var i = 0; i < 4200; i++) {
        var x = r() * w, y = r() * h;
        c.fillStyle = r() < 0.55 ? 'rgba(120,86,40,.045)' : 'rgba(255,255,255,.28)';
        c.fillRect(x, y, 1 + r() * 2, 1 + r() * 1.4);
      }
      c.lineWidth = 0.6;
      for (var k = 0; k < 90; k++) {
        c.strokeStyle = 'rgba(138,101,53,.045)';
        var px = r() * w, py = r() * h;
        c.beginPath(); c.moveTo(px, py); c.lineTo(px + 8 + r() * 20, py + (r() - 0.5) * 3); c.stroke();
      }
    });
    caches.cork = G.offscreen(260, 96, function (c, w, h) {
      var g = G.linear(c, 0, 0, 0, h, [[0, '#d8ac72'], [0.42, '#bb8750'], [1, '#8d6036']]);
      c.fillStyle = g; c.fillRect(0, 0, w, h);
      for (var i = 0; i < 1500; i++) {
        var x = r() * w, y = r() * h, v = r();
        c.fillStyle = v < 0.45 ? 'rgba(67,40,18,.22)' : (v < 0.8 ? 'rgba(255,228,182,.28)' : 'rgba(70,44,22,.09)');
        c.fillRect(x, y, 1 + r() * 4, 1 + r() * 2.2);
      }
      for (var j = 0; j < 9; j++) {
        c.strokeStyle = 'rgba(88,56,28,.13)'; c.lineWidth = 1 + r() * 2;
        c.beginPath(); c.moveTo(0, r() * h); c.bezierCurveTo(w * 0.3, r() * h, w * 0.6, r() * h, w, r() * h); c.stroke();
      }
    });
    caches.label = G.offscreen(420, 220, function (c, w, h) {
      c.fillStyle = '#f2e7cf'; c.fillRect(0, 0, w, h);
      var vg = G.radial(c, w * 0.5, h * 0.4, 10, w * 0.5, h * 0.5, w * 0.7,
        [[0, 'rgba(255,255,255,.55)'], [1, 'rgba(174,140,88,.22)']]);
      c.fillStyle = vg; c.fillRect(0, 0, w, h);
      for (var i = 0; i < 900; i++) {
        c.fillStyle = r() < 0.5 ? 'rgba(120,92,52,.055)' : 'rgba(255,255,255,.22)';
        c.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r());
      }
      c.strokeStyle = 'rgba(84,58,26,.45)'; c.lineWidth = 2; c.strokeRect(14, 14, w - 28, h - 28);
      c.strokeStyle = 'rgba(84,58,26,.22)'; c.lineWidth = 1; c.strokeRect(20, 20, w - 40, h - 40);
      var press = function (txt, x, y, size, color, tracking) {
        G.copyText(c, txt, x + 1.4, y + 1.6, size, 'rgba(255,252,235,.85)', { family: SERIF, tracking: tracking, align: 'center' });
        G.copyText(c, txt, x, y, size, color, { family: SERIF, tracking: tracking, align: 'center' });
      };
      press('COMB', w / 2, 91, 57, '#3a2a17', 7);
      G.copyText(c, 'R A W   H O N E Y', w / 2, 126, 17, '#6b4f2c', { family: SERIF, align: 'center' });
      c.fillStyle = '#7a8b56'; c.fillRect(w / 2 - 34, 141, 68, 2);
      G.copyText(c, 'FIRST EXTRACTION', w / 2, 167, 15, '#6b4f2c', { family: SERIF, align: 'center', tracking: 1 });
      G.copyText(c, 'MILL HOLLOW', w / 2, 188, 13, '#8a7150', { family: SERIF, align: 'center', tracking: 2.4 });
    });
    caches.comb = G.offscreen(680, 460, function (c, w, h) {
      c.clearRect(0, 0, w, h);
      var R = 27, dx = R * 1.5, dy = R * 0.866 * 2;
      for (var col = 0; col < 17; col++) {
        for (var row = 0; row < 11; row++) {
          var cx = 18 + col * dx, cy = 18 + (row + (col % 2) * 0.5) * dy;
          if (cx > w - 14 || cy > h - 14) continue;
          var edge = 2.4;
          c.beginPath();
          for (var k = 0; k < 6; k++) {
            var ang = Math.PI / 3 * k;
            var px = cx + Math.cos(ang) * (R - edge), py = cy + Math.sin(ang) * (R - edge);
            if (k === 0) c.moveTo(px, py); else c.lineTo(px, py);
          }
          c.closePath();
          var wall = G.linear(c, cx - R, cy - R, cx + R, cy + R,
            [[0, '#fff0c2'], [0.45, '#e5bb6a'], [1, '#b5822f']]);
          c.fillStyle = wall; c.fill();
          c.lineWidth = 1.2; c.strokeStyle = 'rgba(122,78,20,.5)'; c.stroke();
          c.beginPath();
          for (var q = 0; q < 6; q++) {
            var a2 = Math.PI / 3 * q, ix = cx + Math.cos(a2) * (R - 10), iy = cy + Math.sin(a2) * (R - 10);
            if (q === 0) c.moveTo(ix, iy); else c.lineTo(ix, iy);
          }
          c.closePath();
          var v = r();
          if (v < 0.44) {
            var hg = G.radial(c, cx - 5, cy - 6, 2, cx, cy, R,
              [[0, '#f8d579'], [0.55, '#d38c17'], [1, '#8a4d09']]);
            c.fillStyle = hg; c.fill();
            c.strokeStyle = 'rgba(255,238,178,.5)'; c.lineWidth = 1.5; c.stroke();
            c.beginPath(); c.arc(cx - R * 0.28, cy - R * 0.3, R * 0.16, 0, Math.PI * 2);
            c.fillStyle = 'rgba(255,248,211,.55)'; c.fill();
          } else if (v < 0.78) {
            c.fillStyle = G.linear(c, cx - R, cy - R, cx + R, cy + R,
              [[0, '#fff3d2'], [0.6, '#e8c889'], [1, '#c59b58']]);
            c.fill();
            c.strokeStyle = 'rgba(255,255,238,.55)'; c.lineWidth = 1; c.stroke();
            c.beginPath(); c.moveTo(cx - R * 0.4, cy); c.lineTo(cx + R * 0.4, cy);
            c.strokeStyle = 'rgba(150,108,54,.28)'; c.stroke();
          } else {
            c.fillStyle = '#a56c15'; c.fill();
            c.strokeStyle = 'rgba(56,32,8,.45)'; c.lineWidth = 1; c.stroke();
          }
        }
      }
      // a torn wax edge
      c.globalCompositeOperation = 'destination-out';
      for (var n = 0; n < 680; n++) {
        var ex = r() * w, ey = r() * h;
        if (ex < 26 || ex > w - 26 || ey < 26 || ey > h - 26) {
          c.beginPath(); c.arc(ex, ey, 2 + r() * 9, 0, Math.PI * 2); c.fill();
        }
      }
      c.globalCompositeOperation = 'source-over';
    });
  }

  function layout() {
    var w = E.w, h = E.h, narrow = w < 720;
    var m = cl(w * 0.055, 18, 96);
    var art = narrow
      ? { x: 0, y: 0, w: w, h: Math.min(h * 0.44, 350) }
      : { x: w * 0.49, y: 0, w: w * 0.51, h: h };
    var box = narrow
      ? { x: m, y: art.h + 22, w: w - 2 * m, h: h - art.h - 88 }
      : { x: m, y: h * 0.19, w: Math.min(w * 0.43, 640), h: h * 0.68 };
    var jh = narrow ? Math.min(art.h * 0.58, 200) : Math.min(h * 0.40, 360);
    var jw = jh * 0.78;
    var jarX = narrow ? w * 0.70 : art.x + art.w * 0.53;
    var jarY = narrow ? art.h - jh * 0.56 : h * 0.60;
    var rail = [], i;
    if (narrow) {
      for (i = 0; i < 6; i++) rail.push({ x: w * 0.5 + (i - 2.5) * 19, y: art.h - 12, r: 4, i: i });
    } else {
      for (i = 0; i < 6; i++) rail.push({ x: w - 26, y: h * 0.22 + i * (h * 0.54 / 5), r: 4.5, i: i });
    }
    return {
      w: w, h: h, narrow: narrow, m: m, art: art, box: box, jh: jh, jw: jw,
      jarX: jarX, jarY: jarY, rx: jw * 0.5, ry: jw * 0.16,
      topY: jarY - jh * 0.5, botY: jarY + jh * 0.5,
      mouthW: jw * 0.56, rail: rail
    };
  }
  function hyFor(L, f) { return L.topY + L.jh * (0.94 - f * 0.78); }

  function bg(ctx, L) {
    var g = G.linear(ctx, 0, 0, L.w * 0.7, L.h,
      [[0, '#fdf7ea'], [0.48, P.bg], [1, '#e9d9bd']]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, L.w, L.h);
    var light = G.radial(ctx, L.w * 0.78, L.h * 0.12, 10, L.w * 0.78, L.h * 0.12, L.w * 0.9,
      [[0, 'rgba(255,247,216,.85)'], [0.55, 'rgba(255,232,186,.18)'], [1, 'rgba(255,232,186,0)']]);
    ctx.fillStyle = light; ctx.fillRect(0, 0, L.w, L.h);
    ctx.save(); ctx.globalAlpha = 0.42;
    ctx.fillStyle = ctx.createPattern(caches.paper, 'repeat');
    ctx.fillRect(0, 0, L.w, L.h); ctx.restore();
    var floor = G.linear(ctx, 0, L.h * 0.66, 0, L.h,
      [[0, 'rgba(214,183,131,0)'], [1, 'rgba(191,150,91,.16)']]);
    ctx.fillStyle = floor; ctx.fillRect(0, L.h * 0.66, L.w, L.h * 0.34);
  }
  function ribbon(ctx, L) {
    var x = L.box.x, y = L.box.y + L.box.h * 0.24, w = L.box.w + 30;
    ctx.save(); ctx.globalAlpha = 0.12;
    var g = G.linear(ctx, x, y, x + w, y + 130,
      [[0, 'rgba(199,133,24,0)'], [0.5, 'rgba(199,133,24,.9)'], [1, 'rgba(199,133,24,0)']]);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x, y + Math.sin(E.t * 0.32) * 12);
    ctx.bezierCurveTo(x + w * 0.3, y - 50 + Math.sin(E.t * 0.4) * 18,
      x + w * 0.7, y + 90 + Math.cos(E.t * 0.31) * 18, x + w, y + 20);
    ctx.lineTo(x + w, y + 54);
    ctx.bezierCurveTo(x + w * 0.7, y + 120, x + w * 0.3, y - 20, x, y + 44);
    ctx.closePath(); ctx.fill(); ctx.restore();
  }

  function caustics(ctx, L, landX, landY, strength) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    var g = G.radial(ctx, landX, landY + 6, 4, landX, landY + 6, L.jw * 1.9,
      [[0, 'rgba(255,208,112,' + (0.32 * strength) + ')'], [0.4, 'rgba(248,184,74,' + (0.15 * strength) + ')'],
       [1, 'rgba(248,184,74,0)']]);
    ctx.fillStyle = g; ctx.fillRect(landX - L.jw * 2, landY - L.jw * 1.6, L.jw * 4, L.jw * 3.6);
    ctx.strokeStyle = 'rgba(255,224,146,' + (0.18 * strength) + ')';
    ctx.lineWidth = 1.6;
    for (var i = 0; i < 4; i++) {
      var rr = L.jw * (0.46 + i * 0.28) + Math.sin(E.t * 0.8 + i) * 4;
      ctx.beginPath();
      ctx.ellipse(landX, landY + 10, rr, rr * 0.22, 0, 0.15, Math.PI - 0.15);
      ctx.stroke();
    }
    ctx.restore();
  }

  function pool(ctx, L, landX, landY, guided) {
    var rx = L.jw * (guided ? 0.40 : 0.58), ry = rx * 0.28;
    ctx.save();
    ctx.fillStyle = 'rgba(112,65,12,.20)';
    ctx.beginPath(); ctx.ellipse(landX, landY + 12, rx * 1.15, ry * 1.1, 0, 0, Math.PI * 2); ctx.fill();
    var g = G.radial(ctx, landX - rx * 0.2, landY - 2, 2, landX, landY, rx * 1.3,
      [[0, '#ffe5a0'], [0.42, '#d9931b'], [0.8, '#a35d0c'], [1, 'rgba(120,68,10,.85)']]);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(landX, landY, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
    // the rope folds over itself as it sinks
    ctx.lineCap = 'round';
    for (var k = 0; k < 3; k++) {
      ctx.beginPath();
      var turns = 7 + k;
      for (var i = 0; i <= 70; i++) {
        var u = i / 70, a = u * Math.PI * turns + E.t * 0.45 + k * 1.9;
        var r2 = rx * (0.88 - u * 0.78);
        var px = landX + Math.cos(a) * r2, py = landY + Math.sin(a) * r2 * 0.27 - u * 3;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = k === 1 ? 'rgba(255,232,157,.75)' : 'rgba(158,94,15,.65)';
      ctx.lineWidth = k === 1 ? 2.4 : 4.2; ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255,246,209,.55)'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.ellipse(landX - rx * 0.2, landY - ry * 0.28, rx * 0.62, ry * 0.44, -0.12, Math.PI * 1.05, Math.PI * 1.9); ctx.stroke();
    ctx.restore();
  }

  function heroWord(ctx, L, alpha) {
    if (alpha <= 0.005) return;
    var size = cl(L.art.w * 0.34, 78, 260);
    var x = L.art.x + L.art.w * 0.5, y = L.art.y + L.art.h * (L.narrow ? 0.40 : 0.44);
    ctx.save(); ctx.globalAlpha = alpha;
    T(ctx, 'Comb', x + 3, y + 4, size, 'rgba(255,247,222,.60)', { family: SERIF, align: 'center', baseline: 'middle' });
    T(ctx, 'Comb', x, y, size, 'rgba(67,45,22,.90)', { family: SERIF, align: 'center', baseline: 'middle', tracking: -2 });
    ctx.restore();
  }
  function heroWordLens(ctx, L, alpha, pts, stripPath) {
    if (alpha <= 0.005) return;
    var size = cl(L.art.w * 0.34, 78, 260);
    var y = L.art.y + L.art.h * (L.narrow ? 0.40 : 0.44);
    var cx = L.art.x + L.art.w * 0.5;
    ctx.save();
    stripPath(ctx, pts, 0); ctx.clip();
    ctx.globalAlpha = alpha * 0.52;
    ctx.translate(cx, 0); ctx.transform(1.38, 0.04 * Math.sin(E.t * 0.4), 0, 1.03, 0, 0); ctx.translate(-cx, 0);
    T(ctx, 'Comb', cx, y, size, '#fff1c4', { family: SERIF, align: 'center', baseline: 'middle', tracking: -2 });
    ctx.restore();
  }

  function drawJar(ctx, L, rot) {
    var cx = L.jarX, jh = L.jh, jw = L.jw, topY = L.topY;
    var rx = L.rx, ry = L.ry;
    var verts = [], i;
    for (i = 0; i < 6; i++) {
      var a = rot + i * Math.PI / 3;
      verts.push({ x: cx + Math.cos(a) * rx, y: topY + Math.sin(a) * ry });
    }
    var faces = [];
    for (i = 0; i < 6; i++) {
      var p1 = verts[i], p2 = verts[(i + 1) % 6];
      var d = Math.sin(rot + (i + 0.5) * Math.PI / 3);
      if (d > -0.08) faces.push({ p1: p1, p2: p2, d: d, i: i });
    }
    faces.sort(function (a, b) { return a.d - b.d; });
    // contact shadow
    ctx.save();
    ctx.fillStyle = G.radial(ctx, cx, L.botY + L.jh * 0.16, 4, cx, L.botY + L.jh * 0.16, jw * 0.95,
      [[0, 'rgba(94,58,20,.34)'], [1, 'rgba(94,58,20,0)']]);
    ctx.beginPath(); ctx.ellipse(cx, L.botY + jh * 0.14, jw * 0.86, jh * 0.065, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    var hy = hyFor(L, st.fill);
    for (var f = 0; f < faces.length; f++) {
      var fc = faces[f], a1 = fc.p1, a2 = fc.p2;
      var shade = 0.52 + 0.38 * fc.d;
      ctx.beginPath();
      ctx.moveTo(a1.x, a1.y); ctx.lineTo(a2.x, a2.y);
      ctx.lineTo(a2.x, a2.y + jh); ctx.lineTo(a1.x, a1.y + jh); ctx.closePath();
      ctx.fillStyle = G.linear(ctx, Math.min(a1.x, a2.x), 0, Math.max(a1.x, a2.x), 0,
        [[0, 'rgba(255,252,236,' + (0.16 + shade * 0.25) + ')'],
         [0.35, 'rgba(244,224,184,' + (0.18 + shade * 0.24) + ')'],
         [1, 'rgba(158,116,62,' + (0.14 + (1 - shade) * 0.20) + ')']]);
      ctx.fill();
      // honey inside this face; the surface lags the turn of the glass
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(a1.x, a1.y); ctx.lineTo(a2.x, a2.y);
      ctx.lineTo(a2.x, a2.y + jh); ctx.lineTo(a1.x, a1.y + jh); ctx.closePath();
      ctx.clip();
      var tilt = Math.sin(rot - 0.42) * rx * 0.09 + Math.sin(E.t * 0.35) * 2;
      var s1 = hy + (a1.x - cx) / rx * tilt, s2 = hy + (a2.x - cx) / rx * tilt;
      ctx.beginPath();
      ctx.moveTo(a1.x, s1); ctx.lineTo(a2.x, s2);
      ctx.lineTo(a2.x, a2.y + jh); ctx.lineTo(a1.x, a1.y + jh); ctx.closePath();
      ctx.fillStyle = G.linear(ctx, 0, hy - 6, 0, L.botY + ry,
        [[0, '#edb53c'], [0.28, '#cf8616'], [0.8, '#a05a08'], [1, '#864807']]);
      ctx.fill();
      var shine = G.linear(ctx, Math.min(a1.x, a2.x), 0, Math.max(a1.x, a2.x), 0,
        [[0, 'rgba(255,220,124,.10)'], [0.24, 'rgba(255,236,167,.30)'], [0.44, 'rgba(255,236,167,0)'], [1, 'rgba(255,236,167,.08)']]);
      ctx.fillStyle = shine; ctx.fill();
      ctx.restore();
      ctx.strokeStyle = 'rgba(80,49,17,.35)'; ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.moveTo(a1.x, a1.y); ctx.lineTo(a2.x, a2.y);
      ctx.lineTo(a2.x, a2.y + jh); ctx.lineTo(a1.x, a1.y + jh); ctx.closePath(); ctx.stroke();
    }
    // honey top surface through the glass
    ctx.save();
    ctx.globalAlpha = 0.84;
    ctx.beginPath(); ctx.ellipse(cx, hy - ry * 0.06, rx * 0.9, ry * 0.86, Math.sin(rot - 0.42) * 0.06, 0, Math.PI * 2);
    ctx.fillStyle = G.linear(ctx, cx - rx, hy - ry, cx + rx, hy + ry,
      [[0, '#f8cf68'], [0.55, '#d18d18'], [1, '#925005']]); ctx.fill();
    ctx.strokeStyle = 'rgba(255,240,185,.55)'; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx - rx * 0.22, hy - ry * 0.22, rx * 0.36, ry * 0.3, -0.2, Math.PI * 1.06, Math.PI * 1.86);
    ctx.strokeStyle = 'rgba(255,248,214,.62)'; ctx.lineWidth = 1.6; ctx.stroke();
    ctx.restore();
    // one slow air bubble in the jar
    var bY = hy + jh * 0.10 + Math.sin(E.t * 0.55) * jh * 0.03;
    ctx.save(); ctx.globalAlpha = 0.7;
    ctx.beginPath(); ctx.arc(cx + Math.sin(E.t * 0.28) * rx * 0.28, bY, 3.4 + Math.sin(E.t * 0.7) * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,240,194,.5)'; ctx.fill();
    ctx.strokeStyle = 'rgba(255,249,222,.85)'; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();

    // glass rims and vertical edges
    ctx.beginPath();
    for (i = 0; i < 6; i++) {
      var v = verts[i];
      if (i === 0) ctx.moveTo(v.x, v.y); else ctx.lineTo(v.x, v.y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,250,226,.62)'; ctx.lineWidth = 2.4; ctx.stroke();
    ctx.strokeStyle = 'rgba(72,45,18,.48)'; ctx.lineWidth = 1; ctx.stroke();
    for (i = 0; i < 6; i++) {
      var vv = verts[i];
      ctx.beginPath(); ctx.moveTo(vv.x, vv.y); ctx.lineTo(vv.x, vv.y + jh);
      ctx.strokeStyle = Math.sin(rot + i * Math.PI / 3) > 0 ? 'rgba(255,248,220,.42)' : 'rgba(88,55,20,.28)';
      ctx.lineWidth = 1.5; ctx.stroke();
    }

    // fill marks on the right of the front face, the green one is the line
    var marks = [0.44, 0.60, 0.80];
    for (i = 0; i < marks.length; i++) {
      var my = hyFor(L, marks[i]), isLine = i === 2;
      ctx.beginPath(); ctx.moveTo(cx + rx * 0.72, my); ctx.lineTo(cx + rx * 1.08, my);
      ctx.strokeStyle = isLine ? P.green : 'rgba(96,61,24,.65)';
      ctx.lineWidth = isLine ? 2.2 : 1.4; ctx.stroke();
      if (isLine) {
        T(ctx, 'LINE', cx + rx * 1.14, my + 4, cl(jh * 0.035, 9, 12), P.green,
          { family: SANS, weight: '600', tracking: 1, align: 'left' });
      } else if (st.marks[i]) {
        ctx.beginPath(); ctx.arc(cx + rx * 0.68, my, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = P.gold; ctx.fill();
      }
    }

    // letterpress label rides the front face
    var front = faces[faces.length - 1];
    if (front) {
      var f1 = front.p1, f2 = front.p2;
      var lw = Math.max(28, Math.abs(f2.x - f1.x) * 0.84), lh = jh * 0.29;
      var slant = (f2.y - f1.y) / ((f2.x - f1.x) || 1);
      ctx.save();
      ctx.globalAlpha = cl(0.52 + front.d * 0.5, 0.4, 0.98);
      ctx.translate((f1.x + f2.x) / 2, topY + jh * 0.53);
      ctx.transform(1, slant, 0, 1, 0, 0);
      ctx.drawImage(caches.label, -lw / 2, -lh / 2, lw, lh);
      ctx.restore();
    }

    // cork lid
    var lidW = jw * 0.72, lidH = jh * 0.115, lidY = topY - ry * 0.34 - lidH * 0.5;
    ctx.save();
    ctx.beginPath(); G.rr(ctx, cx - lidW / 2, lidY, lidW, lidH, lidH * 0.28); ctx.clip();
    ctx.drawImage(caches.cork, cx - lidW / 2, lidY, lidW, lidH * 2.1);
    ctx.restore();
    ctx.beginPath(); G.rr(ctx, cx - lidW / 2, lidY, lidW, lidH, lidH * 0.28);
    ctx.strokeStyle = 'rgba(70,42,18,.65)'; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx, lidY + lidH * 0.20, lidW * 0.46, lidH * 0.26, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,226,173,.28)'; ctx.fill();
    ctx.strokeStyle = 'rgba(88,54,22,.35)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = 'rgba(122,139,86,.9)'; ctx.fillRect(cx - lidW / 2, lidY + lidH * 0.82, lidW, 2.2);
  }

  function threadPts(L, landX, landY) {
    var N = 56, sy = L.art.y - L.h * 0.045, base = cl(L.jw * 0.105, 8, 23);
    var pts = [];
    for (var i = 0; i <= N; i++) {
      var u = i / N;
      var x = lp(st.sx, landX, sm(0, 0.76, u));
      x += Math.sin(u * 15 - E.t * 1.55) * base * 0.62 * Math.pow(u, 3);
      x += Math.sin(u * 35 - E.t * 1.08) * base * 0.42 * Math.pow(u, 6);
      var y = lp(sy, landY, u) + Math.sin(u * 9 - E.t * 0.72) * base * 0.22 * u * u;
      var w = base * (1 - 0.70 * u) + 1.6;
      pts.push({ x: x, y: y, w: w, u: u });
    }
    return pts;
  }
  function stripPath(ctx, pts, inset) {
    ctx.beginPath();
    for (var i = 0; i < pts.length; i++) ctx.lineTo(pts[i].x - pts[i].w / 2 - inset, pts[i].y);
    for (var j = pts.length - 1; j >= 0; j--) ctx.lineTo(pts[j].x + pts[j].w / 2 + inset, pts[j].y);
    ctx.closePath();
  }
  function stream(ctx, L, pts, heroAlpha) {
    var sy = L.art.y - L.h * 0.045, ey = pts[pts.length - 1].y;
    ctx.save();
    stripPath(ctx, pts, 0);
    ctx.fillStyle = G.linear(ctx, 0, sy, 0, ey,
      [[0, '#b36b10'], [0.20, '#d18a18'], [0.55, '#e9ad31'], [1, '#f4d277']]);
    ctx.fill();
    ctx.save();
    stripPath(ctx, pts, -pts[0].w * 0.20); ctx.clip();
    var core = G.linear(ctx, 0, sy, 0, ey,
      [[0, 'rgba(122,64,6,.72)'], [0.35, 'rgba(150,81,8,.48)'], [0.78, 'rgba(176,103,14,.30)'], [1, 'rgba(255,222,135,.2)']]);
    ctx.fillStyle = core; ctx.fillRect(L.art.x, L.art.y, L.art.w, L.art.h);
    // slow rising air bubbles inside the honey
    var count = 14 + Math.floor(st.fill * 10);
    for (var b = 0; b < count; b++) {
      var u = 1 - ((E.t * 0.055 + b * 0.137) % 1);
      var idx = Math.min(pts.length - 1, Math.floor(u * (pts.length - 1)));
      var p = pts[idx];
      var bx = p.x + Math.sin(b * 3.3 + E.t * 0.3) * p.w * 0.22, by = p.y;
      var br = cl(p.w * (0.13 + (b % 3) * 0.035), 1.1, 4.2);
      ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,240,189,.30)'; ctx.fill();
      ctx.strokeStyle = 'rgba(255,249,220,.72)'; ctx.lineWidth = 0.9; ctx.stroke();
    }
    ctx.restore();
    // pale gold edges, one bright refraction line, one absorption line
    stripPath(ctx, pts, 0);
    ctx.strokeStyle = 'rgba(255,236,168,.85)'; ctx.lineWidth = 2.2; ctx.stroke();
    ctx.beginPath();
    for (var i = 0; i < pts.length; i++) {
      var q = pts[i];
      ctx.lineTo(q.x - q.w * 0.24, q.y);
    }
    ctx.strokeStyle = 'rgba(255,250,222,.88)'; ctx.lineWidth = cl(pts[0].w * 0.17, 1.4, 4); ctx.stroke();
    ctx.beginPath();
    for (var k = 0; k < pts.length; k++) {
      var q2 = pts[k]; ctx.lineTo(q2.x + q2.w * 0.33, q2.y);
    }
    ctx.strokeStyle = 'rgba(104,56,6,.42)'; ctx.lineWidth = cl(pts[0].w * 0.12, 1, 3); ctx.stroke();
    ctx.restore();
    heroWordLens(ctx, L, heroAlpha, pts, stripPath);
  }

  function extras(ctx, L, p) {
    var combAmt = cl(1 - Math.abs(p - 3) * 1.35, 0, 1);
    var dipAmt = cl(1 - Math.abs(p - 2) * 1.35, 0, 1);
    if (combAmt > 0.01) {
      var cw = Math.min(L.art.w * 0.50, 320), ch = cw * 0.676;
      var cx = L.narrow ? L.art.w * 0.26 : L.jarX - L.jw * 1.45;
      var cy = L.art.y + L.art.h * (L.narrow ? 0.44 : 0.40);
      ctx.save(); ctx.globalAlpha = combAmt;
      ctx.translate(cx, cy); ctx.rotate(-0.12 + Math.sin(E.t * 0.22) * 0.035);
      ctx.shadowColor = 'rgba(96,58,14,.35)'; ctx.shadowBlur = 22; ctx.shadowOffsetY = 12;
      ctx.drawImage(caches.comb, -cw / 2, -ch / 2, cw, ch);
      ctx.shadowColor = 'transparent';
      ctx.restore();
    }
    if (dipAmt > 0.01) {
      var hx = L.jarX + L.jw * 0.22, hy = L.topY + L.jh * 0.10;
      var tx = L.jarX + L.jw * 1.14, ty = L.topY - L.jh * 0.22 + Math.sin(E.t * 0.5) * 4;
      ctx.save(); ctx.globalAlpha = dipAmt;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(tx, ty);
      ctx.strokeStyle = 'rgba(72,44,20,.45)'; ctx.lineWidth = L.jh * 0.045; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(tx, ty);
      ctx.strokeStyle = '#a9753e'; ctx.lineWidth = L.jh * 0.032; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(tx, ty);
      ctx.strokeStyle = 'rgba(232,184,119,.55)'; ctx.lineWidth = L.jh * 0.008; ctx.stroke();
      ctx.save(); ctx.translate(hx, hy); ctx.rotate(-0.5);
      ctx.beginPath(); ctx.ellipse(0, 0, L.jw * 0.16, L.jh * 0.085, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#b07d43'; ctx.fill();
      ctx.strokeStyle = 'rgba(64,38,16,.6)'; ctx.lineWidth = 1.5; ctx.stroke();
      for (var i = -2; i <= 2; i++) {
        ctx.beginPath(); ctx.ellipse(i * L.jw * 0.05, 0, L.jw * 0.018, L.jh * 0.076, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(69,41,17,.42)'; ctx.lineWidth = 1.1; ctx.stroke();
      }
      ctx.restore();
      var surf = hyFor(L, st.fill);
      var tg = G.linear(ctx, hx, hy, hx + 3, surf,
        [[0, '#f0c257'], [0.5, '#d38b18'], [1, '#a75c09']]);
      ctx.beginPath();
      ctx.moveTo(hx - 5, hy + 4);
      ctx.bezierCurveTo(hx + 14 + Math.sin(E.t) * 4, hy + L.jh * 0.14,
        hx - 12 + Math.sin(E.t * 0.9) * 4, surf - L.jh * 0.12, hx + 2, surf);
      ctx.lineTo(hx + 8, surf);
      ctx.bezierCurveTo(hx - 4, surf - L.jh * 0.12, hx + 20, hy + L.jh * 0.14, hx + 5, hy + 4);
      ctx.closePath(); ctx.fillStyle = tg; ctx.fill();
      ctx.restore();
    }
  }

  function chapter0(ctx, b, f) {
    eyebrow(ctx, b, 'We sell raw honey by season', b.y);
    var y = b.y + 34 * f;
    var size = cl(b.w * 0.115, 34, 76);
    T(ctx, 'We work slowly.', b.x, y + size, size, P.ink, { family: SERIF, tracking: -1 });
    y += size * 1.42;
    rule(ctx, b.x, y, Math.min(b.w, 320), 0.28); y += 22 * f;
    y += line(ctx, 'We keep three small apiaries. We extract once a season. We strain it cold. We do not heat it.',
      b.x, y + 18, b.w * 0.82, cl(b.w * 0.035, 14, 20), P.soft, {}) * cl(b.w * 0.035, 14, 20) * 1.48;
    y += 24 * f;
    T(ctx, 'MILL HOLLOW  /  BRACKEN STEPS  /  SALT ORCHARD', b.x, y + 18, cl(b.w * 0.021, 9, 12), P.green,
      { family: SANS, tracking: 1.6 });
    T(ctx, 'Scroll to read the chapters.', b.x, b.y + b.h - 8, cl(b.w * 0.024, 11, 14), P.soft,
      { family: SANS, tracking: 1.8 });
  }
  function chapter1(ctx, b, f) {
    var apiaries = [
      { n: 'Mill Hollow', p: 'Linden, white clover, bramble', h: '90 m above the river', s: 'Late spring', note: 'The honey is pale. It tastes clean.' },
      { n: 'Bracken Steps', p: 'Heather, wild thyme, bellflower', h: '340 m on the south shelf', s: 'High summer', note: 'It is dark and thick.' },
      { n: 'Salt Orchard', p: 'Black locust, sea lavender', h: '20 m behind the dune', s: 'Early autumn', note: 'It is amber and slightly salty.' }
    ];
    eyebrow(ctx, b, 'Chapter one - three apiaries', b.y);
    T(ctx, 'We keep the apiaries small.', b.x, b.y + 34 * f + cl(b.w * 0.058, 24, 42), cl(b.w * 0.058, 24, 42), P.ink,
      { family: SERIF });
    var top = b.y + 86 * f, cols = b.w > 500 ? 3 : 1, gap = 18;
    var cw = cols === 3 ? (b.w - gap * 2) / 3 : b.w;
    for (var i = 0; i < apiaries.length; i++) {
      var a = apiaries[i];
      var x = b.x + (cols === 3 ? i * (cw + gap) : 0);
      var y = top + (cols === 1 ? i * 96 * f : 0);
      rule(ctx, x, y, cw, 0.34);
      ctx.fillStyle = P.green; ctx.fillRect(x, y - 2, 12, 3);
      T(ctx, a.n, x, y + 28 * f, cl(cw * 0.095, 16, 23), P.ink, { family: SERIF });
      var yy = y + 50 * f;
      yy += line(ctx, a.p, x, yy, cw - 4, cl(cw * 0.062, 11, 14), P.soft, { family: SANS }) * cl(cw * 0.062, 11, 14) * 1.42;
      yy += 8 * f;
      T(ctx, a.h, x, yy + 12, cl(cw * 0.06, 10, 13), P.soft, { family: SANS });
      T(ctx, a.s, x, yy + 30 * f, cl(cw * 0.06, 10, 13), P.green, { family: SANS, weight: '600' });
      if (cols === 3) {
        yy += 48 * f;
        line(ctx, a.note, x, yy + 12, cw - 4, cl(cw * 0.062, 11, 14), P.soft, {});
      }
    }
  }
  function chapter2(ctx, b, f) {
    eyebrow(ctx, b, 'Chapter two - the harvest table', b.y);
    T(ctx, 'This season.', b.x, b.y + 34 * f + cl(b.w * 0.058, 24, 42), cl(b.w * 0.058, 24, 42), P.ink,
      { family: SERIF });
    var rows = [
      ['Moisture', '17.8 per cent'],
      ['Colour grade', 'Amber, 62 on a glass scale'],
      ['Pollen sources', 'Linden, clover, bramble'],
      ['Extraction', 'The fourteenth of September, before eight']
    ];
    var y = b.y + 104 * f, fs = cl(b.w * 0.030, 12, 17), step = cl(40 * f, 30, 48);
    for (var i = 0; i < rows.length; i++) {
      T(ctx, rows[i][0].toUpperCase(), b.x, y, fs * 0.72, P.green, { family: SANS, tracking: 1.6, weight: '600' });
      T(ctx, rows[i][1], b.x, y + fs * 1.5, fs, P.ink, { family: SERIF });
      rule(ctx, b.x, y + step * 0.82, b.w * 0.94, 0.16);
      y += step;
    }
    y += 10 * f;
    line(ctx, 'We lift the frames in the morning. We spin them slowly. We strain the honey once. We do nothing else.',
      b.x, y + 14, b.w * 0.86, cl(b.w * 0.030, 12, 16), P.soft, {});
  }
  function chapter3(ctx, b, f) {
    eyebrow(ctx, b, 'Chapter three - tasting card', b.y);
    T(ctx, 'Read the tasting notes.', b.x, b.y + 34 * f + cl(b.w * 0.058, 24, 42), cl(b.w * 0.058, 24, 42), P.ink,
      { family: SERIF });
    var y = b.y + 102 * f, fs = cl(b.w * 0.032, 13, 18);
    var notes = [
      ['Nose', 'It smells of wax, pear and hay.'],
      ['Palate', 'It tastes of dried apricot and salt.'],
      ['Finish', 'The taste stays. It ends slightly bitter.']
    ];
    ctx.save(); ctx.fillStyle = 'rgba(199,133,24,.12)'; ctx.fillRect(b.x, y - 18 * f, 3, 3 * 52 * f); ctx.restore();
    for (var i = 0; i < notes.length; i++) {
      T(ctx, notes[i][0].toUpperCase(), b.x + 14, y, fs * 0.68, P.green,
        { family: SANS, tracking: 2, weight: '600' });
      line(ctx, notes[i][1], b.x + 14, y + fs * 1.8, b.w * 0.78, fs, P.ink, {});
      y += 58 * f;
    }
    y += 4 * f;
    line(ctx, 'Eat it on curd. Stir it into warm water. Use a spoon at four.',
      b.x, y + 12, b.w * 0.86, cl(b.w * 0.027, 11, 15), P.soft, {});
  }
  function chapter4(ctx, b, f) {
    eyebrow(ctx, b, 'Chapter four - by the season', b.y);
    T(ctx, 'You get one jar each season.', b.x, b.y + 34 * f + cl(b.w * 0.052, 22, 38), cl(b.w * 0.052, 22, 38), P.ink,
      { family: SERIF });
    var sizes = [
      { n: 'A spoon', q: '250 g, one jar', p: 'Twelve. We post in season.' },
      { n: 'A jar', q: '500 g, one jar', p: 'Twenty-one. We post in season.' },
      { n: 'A shelf', q: 'Three jars of 500 g', p: 'Fifty-four. One jar per extraction.' }
    ];
    var y = b.y + 100 * f, step = cl(66 * f, 48, 76);
    for (var i = 0; i < sizes.length; i++) {
      var s = sizes[i];
      rule(ctx, b.x, y - 14 * f, b.w * 0.94, 0.22);
      T(ctx, String(i + 1).padStart(2, '0'), b.x, y + 8, cl(b.w * 0.026, 11, 14), P.green,
        { family: SANS, tracking: 1.4 });
      T(ctx, s.n, b.x + b.w * 0.10, y + 10, cl(b.w * 0.046, 17, 25), P.ink, { family: SERIF });
      T(ctx, s.q, b.x + b.w * 0.52, y + 8, cl(b.w * 0.026, 11, 14), P.soft, { family: SANS });
      T(ctx, s.p, b.x + b.w * 0.10, y + 34 * f, cl(b.w * 0.026, 11, 14), P.soft, { family: SANS });
      y += step;
    }
    T(ctx, 'No renewals. We write when we extract again.', b.x, b.y + b.h - 4,
      cl(b.w * 0.026, 11, 14), P.green, { family: SANS, tracking: 0.4 });
  }
  function chapter5(ctx, b, f) {
    eyebrow(ctx, b, 'Comb - a note at the end', b.y);
    T(ctx, 'Comb', b.x, b.y + 42 * f + cl(b.w * 0.14, 42, 88), cl(b.w * 0.14, 42, 88), P.ink,
      { family: SERIF, tracking: -2 });
    var y = b.y + 120 * f;
    line(ctx, 'Raw honey from three small apiaries. We sell it by season.',
      b.x, y, b.w * 0.84, cl(b.w * 0.034, 13, 19), P.soft, {});
    y += 66 * f;
    rule(ctx, b.x, y, b.w * 0.94, 0.25); y += 24 * f;
    T(ctx, 'Letters: the packing room, Mill Hollow', b.x, y + 12, cl(b.w * 0.027, 11, 15), P.soft, { family: SANS });
    T(ctx, 'We label the jars by hand. We label them in filling order.', b.x, y + 36 * f,
      cl(b.w * 0.027, 11, 15), P.soft, { family: SANS });
    y += 76 * f;
    T(ctx, 'We close the season when we label the last jar.', b.x, y + 12,
      cl(b.w * 0.030, 12, 17), P.ink, { family: SERIF });
    T(ctx, 'MILL HOLLOW  /  BRACKEN STEPS  /  SALT ORCHARD', b.x, b.y + b.h - 4,
      cl(b.w * 0.021, 9, 12), P.green, { family: SANS, tracking: 1.6 });
  }
  var CHAPTERS = [chapter0, chapter1, chapter2, chapter3, chapter4, chapter5];
  var CHAP_NAMES = ['Raw honey', 'Three apiaries', 'Harvest table', 'Tasting card', 'By the season', 'Footer'];

  function sections(ctx, L) {
    var p = cl(E.s, 0, 1) * 5;
    var i0 = Math.min(5, Math.floor(p)), fr = p - i0;
    var e = sm(0.60, 0.98, fr);
    var f = cl(L.box.h / 560, 0.56, 1.28);
    if (1 - e > 0.002) {
      ctx.save(); ctx.globalAlpha = 1 - e;
      CHAPTERS[i0](ctx, L.box, f); ctx.restore();
    }
    if (e > 0.002 && i0 < 5) {
      ctx.save(); ctx.globalAlpha = e;
      CHAPTERS[i0 + 1](ctx, L.box, f); ctx.restore();
    }
  }

  function chrome(ctx, L) {
    var i, d;
    for (i = 0; i < L.rail.length; i++) {
      d = L.rail[i];
      var on = Math.round(cl(E.s, 0, 1) * 5) === i;
      ctx.beginPath(); ctx.arc(d.x, d.y, on ? d.r + 1.5 : d.r, 0, Math.PI * 2);
      ctx.fillStyle = on ? P.green : 'rgba(58,42,23,.22)'; ctx.fill();
      if (on && !L.narrow) {
        T(ctx, CHAP_NAMES[i], d.x - 16, d.y + 4, 11, P.soft,
          { family: SANS, align: 'right', tracking: 1.2 });
      }
    }
    var y = L.h - 40;
    ctx.save();
    ctx.fillStyle = 'rgba(250,242,225,.92)'; ctx.fillRect(0, y - 6, L.w, 46);
    ctx.fillStyle = P.line; ctx.fillRect(0, y - 6, L.w, 1);
    var fs = cl(L.w * 0.012, 10, 12);
    var label = st.done ? 'The jar reaches the line.'
      : (E.started || E.auto ? 'Drag to keep the stream in the jar mouth.' : 'Drag to guide the stream into the jar mouth.');
    T(ctx, label.toUpperCase(), L.m, y + 16, fs, P.ink, { family: SANS, tracking: 1.2, weight: '600' });
    var bx = L.narrow ? L.m : L.w * 0.44;
    var bw = L.narrow ? L.w - 2 * L.m : Math.min(L.w * 0.34, 420);
    var by = y + 9;
    ctx.fillStyle = 'rgba(58,42,23,.13)'; G.rr(ctx, bx, by, bw, 8, 4); ctx.fill();
    var frac = cl((st.fill - 0.30) / 0.52, 0, 1);
    ctx.fillStyle = G.linear(ctx, bx, 0, bx + bw, 0, [[0, '#b46c12'], [1, '#e9b945']]);
    G.rr(ctx, bx, by, Math.max(2, bw * frac), 8, 4); ctx.fill();
    var markX = bx + bw * ((0.80 - 0.30) / 0.52);
    ctx.fillStyle = P.green; ctx.fillRect(markX, by - 3, 2, 14);
    var acc = st.poured + st.spill > 0 ? st.poured / (st.poured + st.spill) : 1;
    T(ctx, Math.round(acc * 100) + '% IN THE JAR', L.w - L.m, y + 16, fs, P.green,
      { family: SANS, align: 'right', tracking: 1.2, weight: '600' });
    ctx.restore();
  }

  function accuracy() { return st.poured + st.spill > 0 ? st.poured / (st.poured + st.spill) : 1; }

  function update(L) {
    var dt = E.dt || 0;
    if (E.frozen) {
      st.sx = L.jarX + Math.sin(E.t * 0.55) * L.jw * 0.9;
      st.sx2 = L.jarX + Math.sin(E.t * 0.55 - 0.75) * L.jw * 0.7;
      st.ready = true;
    } else {
      var target;
      if (E.auto) target = L.jarX;
      else if (E.input.mouse.inside || E.input.mouse.left) target = E.input.mouse.x;
      else target = L.jarX + Math.sin(E.t * 0.36) * L.jw * 1.6;
      if (!st.ready) { st.sx = target; st.sx2 = target; st.ready = true; }
      st.sx = lp(st.sx, target, 1 - Math.exp(-dt * 3.0));
      st.sx2 = lp(st.sx2, st.sx, 1 - Math.exp(-dt * 1.05));
    }

    // chapter keys and dots
    var clicks = E.input.consumeClicks();
    for (var c = 0; c < clicks.length; c++) {
      if (clicks[c].released) continue;
      for (var i = 0; i < L.rail.length; i++) {
        var d = L.rail[i];
        if (Math.abs(clicks[c].x - d.x) < 13 && Math.abs(clicks[c].y - d.y) < 13) {
          E.sTarget = i / 5; Arcade.sound.tone({ freq: 330 + i * 55, dur: 0.08, gain: 0.05 });
        }
      }
    }
    for (var k = 1; k <= 6; k++) {
      if (E.input.justPressed('Digit' + k)) E.sTarget = (k - 1) / 5;
    }
    if (E.input.justPressed('ArrowRight')) E.sTarget = cl(E.sTarget + 0.2, 0, 1);
    if (E.input.justPressed('ArrowLeft')) E.sTarget = cl(E.sTarget - 0.2, 0, 1);
    if (E.auto && !E.frozen && !E.params.has('s')) E.sTarget = cl((E.t - 1) / 22, 0, 1);

    var drag = !E.frozen && (E.auto || (E.started && E.input.mouse.left));
    var guided = drag && Math.abs(st.sx2 - L.jarX) < L.mouthW * 0.5;
    if (E.auto && !E.frozen) {
      st.fill = cl(0.30 + Math.max(0, E.t - 2) * 0.043, 0, 0.84);
      st.poured = st.fill - 0.30; st.spill = st.poured * 0.02;
    } else if (drag && !st.done) {
      if (guided) {
        var rate = 0.145 * (1 - Math.abs(st.sx2 - L.jarX) / L.mouthW * 0.5);
        st.fill = cl(st.fill + rate * dt, 0, 0.86);
        st.poured += rate * dt;
      } else {
        st.spill += 0.125 * dt;
      }
      if (E.t - st.lastPour > 0.55 && Arcade.sound.enabled) {
        st.lastPour = E.t;
        Arcade.sound.noise({ dur: 0.16, gain: 0.018, freq: guided ? 780 : 1800, filter: 'lowpass' });
      }
      if (E.t - st.lastScore > 0.5 && st.poured + st.spill > 0.01) {
        st.lastScore = E.t;
        Arcade.score(ID, Math.round(accuracy() * st.fill * 1000));
      }
    }

    var thresholds = [0.44, 0.60, 0.78];
    for (var m = 0; m < thresholds.length; m++) {
      if (st.fill >= thresholds[m] && !st.marks[m] && !st.done && !E.frozen) {
        st.marks[m] = true;
        Arcade.mark(ID, 'fill-' + (m + 1));
        Arcade.sound.tone({ freq: 330 + m * 110, dur: 0.22, gain: 0.06, type: 'sine' });
        Arcade.toast('You reach mark ' + (m + 1) + ' of 3.');
      }
    }
    if (st.fill >= 0.82 && !st.done && !E.frozen) {
      st.done = true;
      var acc = accuracy(), stars = acc >= 0.88 ? 3 : (acc >= 0.60 ? 2 : 1);
      Arcade.finish({
        score: Math.round(acc * 1000 + st.fill * 200), stars: stars,
        title: 'Jar at the line',
        lines: ['Accuracy ' + Math.round(acc * 100) + '%',
          'Spill ' + Math.round((1 - acc) * 100) + '%',
          'First extraction, Mill Hollow']
      });
      Arcade.sound.chord([262, 330, 392], 0.9, 0.07);
    }
    return guided;
  }

  function onFrame(ctx, env) {
    E = env;
    if (E.frozen) E.s = E.sTarget;
    if (!caches) initCaches();
    var L = layout();
    var guided = update(L);
    var p = cl(E.s, 0, 1) * 5;
    var heroAlpha = cl(1 - p * 1.2, 0, 1);
    var rot = cl(E.s, 0, 1) * Math.PI * 1.55 + Math.sin(E.t * 0.24) * 0.05;
    var landY = guided ? hyFor(L, st.fill) - L.jh * 0.015 : L.art.y + L.art.h - (L.narrow ? 10 : 14);
    var landX = guided ? L.jarX : st.sx2;
    var pts = threadPts(L, landX, landY);

    bg(ctx, L);
    ribbon(ctx, L);
    ctx.save();
    ctx.beginPath(); ctx.rect(L.art.x, L.art.y, L.art.w, L.art.h); ctx.clip();
    caustics(ctx, L, landX, guided ? L.art.y + L.art.h - 10 : landY, guided ? 1.25 + st.fill * 0.5 : 0.85);
    heroWord(ctx, L, heroAlpha);
    if (!guided) pool(ctx, L, landX, landY, false);
    else pool(ctx, L, L.jarX, L.art.y + L.art.h - 10, true);
    extras(ctx, L, p);
    drawJar(ctx, L, rot);
    stream(ctx, L, pts, heroAlpha);
    // a warm drop at the end of the falling thread
    ctx.beginPath(); ctx.arc(landX, landY, Math.max(2, pts[pts.length - 1].w * 0.5), 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(246,205,105,.75)'; ctx.fill();
    ctx.restore();

    sections(ctx, L);
    chrome(ctx, L);
    G.grain(ctx, E.w, E.h, 0.032);
    G.vignette(ctx, E.w, E.h, 0.07);
  }
})();
