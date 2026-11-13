(function () {
  'use strict';

  var A = window.Arcade, R = window.Raycaster, TAU = Math.PI * 2;
  var ID = 'box-fort', W = 38, H = 15;
  var BR = '67,46,28', GOLD = '217,154,78', PALE = '228,192,108', CRM = '246,231,201';
  var INK = '58,42,30', BLUE = '86,105,112';
  function rgba(c, a) { return 'rgba(' + c + ',' + a + ')'; }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function rnd(n) { return A.rng(n >>> 0); }
  function tex(w, h, fn) { return A.gfx.offscreen(w, h, fn); }
  function rr(g, x, y, w, h, r) { A.gfx.rr(g, x, y, w, h, r); }
  function grad(g, x0, y0, x1, y1, stops) { return A.gfx.linear(g, x0, y0, x1, y1, stops); }

  /* ------------------ cardboard: one medium, one palette -------------- */
  function flutes(g, x0, y0, w, h, r) {
    g.fillStyle = grad(g, 0, y0, 0, y0 + h, [[0, '#e0bd85'], [0.45, '#c79d68'], [1, '#8f6639']]);
    g.fillRect(x0, y0, w, h);
    g.strokeStyle = 'rgba(90,58,32,.62)'; g.lineWidth = 1.4;
    g.beginPath();
    for (var x = x0; x < x0 + w; x += 8) {
      g.moveTo(x, y0 + h); g.quadraticCurveTo(x + 4, y0 + h * 0.15, x + 8, y0 + h);
    }
    g.stroke();
    g.strokeStyle = 'rgba(255,232,188,.5)'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(x0, y0 + 1); g.lineTo(x0 + w, y0 + 1); g.stroke();
    for (var i = 0; i < 30; i++) {
      g.fillStyle = rgba(BR, r() * 0.12); g.fillRect(x0 + r() * w, y0 + r() * h, 1, 1);
    }
  }

  function tapeStrip(g, x, y, w, h, r, vertical) {
    g.save();
    g.fillStyle = 'rgba(150,103,55,.62)';
    if (vertical) g.fillRect(x, y, w, h); else g.fillRect(x, y, w, h);
    g.fillStyle = grad(g, x, y, x + (vertical ? w : 0), y + (vertical ? 0 : h),
      [[0, 'rgba(255,224,170,.2)'], [0.25, 'rgba(220,170,105,.52)'], [0.6, 'rgba(126,82,42,.5)'], [1, 'rgba(255,220,166,.16)']]);
    g.fillRect(x, y, w, h);
    /* wrinkles, trapped bubbles, a sharp highlight */
    for (var i = 0; i < 12; i++) {
      var px = vertical ? x + r() * w : x + r() * w, py = vertical ? y + r() * h : y + r() * h;
      g.strokeStyle = r() > 0.5 ? 'rgba(255,230,184,.28)' : 'rgba(72,46,24,.3)';
      g.lineWidth = 0.7 + r();
      g.beginPath();
      if (vertical) { g.moveTo(x, py); g.quadraticCurveTo(x + w * 0.6, py + 6, x + w, py - 3); }
      else { g.moveTo(px, y); g.quadraticCurveTo(px + 6, y + h * 0.6, px - 3, y + h); }
      g.stroke();
    }
    for (i = 0; i < 9; i++) {
      g.fillStyle = 'rgba(255,244,213,.23)';
      g.beginPath(); g.ellipse(x + 2 + r() * (w - 4), y + 2 + r() * (h - 4), 1 + r() * 2.6, 0.6 + r() * 1.6, r(), 0, TAU); g.fill();
    }
    g.fillStyle = 'rgba(255,248,220,.42)';
    if (vertical) g.fillRect(x + w * 0.22, y, 1.6, h); else g.fillRect(x, y + h * 0.22, w, 1.6);
    g.strokeStyle = 'rgba(58,36,20,.32)'; g.lineWidth = 1; g.strokeRect(x, y, w, h);
    g.restore();
  }

  function marker(g, points, color, width, seed) {
    g.save();
    A.gfx.paintStroke(g, points, rgba(color, 0.16), width * 2.3, seed, { passes: 2, jitter: 2.2, alpha: 0.7 });
    A.gfx.paintStroke(g, points, rgba(color, 0.82), width, seed + 41, { passes: 2, jitter: 1.2, alpha: 0.9 });
    g.restore();
  }

  function markerWord(g, s, x, y, size, color, rot) {
    g.save(); g.translate(x, y); g.rotate(rot || 0);
    g.font = 'bold ' + size + 'px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = rgba(color, 0.22); g.fillText(s, 0.7, 0.8);
    g.fillStyle = rgba(color, 0.92); g.fillText(s, 0, 0);
    g.restore();
  }

  function cardBase(g, w, h, r, mode) {
    g.fillStyle = grad(g, 0, 0, w, 0, [[0, '#754d2c'], [0.18, '#b38a58'], [0.45, '#c69d6b'],
      [0.72, '#a97c4c'], [1, '#6b4628']]);
    g.fillRect(0, 0, w, h);
    g.fillStyle = grad(g, 0, 0, 0, h, [[0, 'rgba(255,225,170,.16)'], [0.5, 'rgba(255,225,170,0)'], [1, 'rgba(52,32,18,.3)']]);
    g.fillRect(0, 0, w, h);
    for (var i = 0; i < 380; i++) {
      g.fillStyle = r() > 0.5 ? rgba(CRM, r() * 0.06) : rgba(BR, r() * 0.15);
      var fx = r() * w, fy = r() * h;
      g.fillRect(fx, fy, 1 + r() * 3, 0.7);
    }
    for (i = 0; i < 16; i++) {
      g.strokeStyle = 'rgba(90,58,32,.055)'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(0, r() * h); g.lineTo(w, r() * h); g.stroke();
    }
    /* poster paint patches */
    for (i = 0; i < 3; i++) {
      g.save(); g.globalAlpha = 0.16 + r() * 0.12;
      A.gfx.paintStroke(g, [[r() * w, r() * h], [r() * w, r() * h], [r() * w, r() * h]],
        i === 1 ? rgba(PALE, 1) : rgba(GOLD, 1), 16 + r() * 24, 700 + i * 7,
        { passes: 4, jitter: 14, alpha: 0.6 });
      g.restore();
    }
    /* marker bricks */
    g.save(); g.globalAlpha = 0.5;
    var m = r;
    for (var row = 0; row < 6; row++) {
      for (var col = 0; col < 4; col++) {
        var bx = 4 + col * 31 + (row % 2 ? 12 : 0), by = 26 + row * 26;
        marker(g, [[bx, by], [bx + 27, by], [bx + 27, by + 19]], INK, 1.6, 200 + row * 13 + col);
      }
    }
    g.restore();
    if (mode === 'keep') {
      g.save(); g.translate(w * 0.52, h * 0.42); g.rotate(-0.06);
      g.fillStyle = 'rgba(240,214,166,.85)'; rr(g, -44, -18, 88, 36, 3); g.fill();
      g.strokeStyle = rgba(INK, 0.8); g.lineWidth = 2; rr(g, -44, -18, 88, 36, 3); g.stroke();
      markerWord(g, 'KEEP OUT', 0, -4, 14, INK, -0.04);
      markerWord(g, 'FORT BUTTON', 0, 10, 8, INK, 0.02);
      g.restore();
    } else if (mode === 'arrows') {
      marker(g, [[10, 138], [40, 128], [78, 134], [110, 116]], INK, 2.4, 991);
      marker(g, [[100, 108], [110, 116], [98, 124]], INK, 2.2, 993);
      markerWord(g, 'THIS WAY', 64, 150, 13, INK, -0.04);
    } else if (mode === 'dial') {
      g.save(); g.translate(64, 92);
      g.fillStyle = 'rgba(240,220,180,.72)'; g.beginPath(); g.arc(0, 0, 30, 0, TAU); g.fill();
      g.strokeStyle = rgba(INK, 0.85); g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 30, 0, TAU); g.stroke();
      for (var k = 0; k < 10; k++) {
        var a = k / 10 * TAU;
        g.beginPath(); g.moveTo(Math.cos(a) * 23, Math.sin(a) * 23);
        g.lineTo(Math.cos(a) * 28, Math.sin(a) * 28); g.stroke();
      }
      marker(g, [[0, 0], [14, -12]], INK, 2.4, 771);
      markerWord(g, '3', 0, 38, 12, INK, 0);
      g.restore();
    }
    /* string loops */
    g.strokeStyle = 'rgba(228,204,158,.55)'; g.lineWidth = 1.2;
    g.beginPath(); g.moveTo(-4, 42); g.bezierCurveTo(30, 55, 96, 26, w + 4, 46); g.stroke();
    g.beginPath(); g.moveTo(-4, 162); g.bezierCurveTo(40, 148, 90, 176, w + 4, 158); g.stroke();
    tapeStrip(g, 8, 18, 20, h - 36, r, true);
    tapeStrip(g, 92, 54, 30, 26, r, false);
    flutes(g, 0, 0, w, 12, r);
    flutes(g, 0, h - 12, w, 12, r);
    g.fillStyle = 'rgba(30,18,10,.18)'; g.fillRect(0, 12, w, 3);
  }

  function makeCard(mode, seed) {
    return tex(128, 192, function (g, w, h) { cardBase(g, w, h, rnd(seed), mode); });
  }

  function makeTape() {
    return tex(128, 192, function (g, w, h) {
      var r = rnd(4133), i;
      cardBase(g, w, h, r, 'arrows');
      g.fillStyle = 'rgba(146,98,50,.45)'; g.fillRect(0, 0, w, h);
      tapeStrip(g, 18, 10, 44, h - 20, r, true);
      tapeStrip(g, 68, 10, 44, h - 20, r, true);
      for (i = 0; i < 5; i++) tapeStrip(g, 0, 24 + i * 32, w, 11, r, false);
      markerWord(g, 'SEAMS', 64, 102, 12, INK, 0.03);
      flutes(g, 0, 0, w, 12, r); flutes(g, 0, h - 12, w, 12, r);
    });
  }

  function makeRoll() {
    return tex(128, 192, function (g, w, h) {
      var r = rnd(4217), i, j;
      g.fillStyle = grad(g, 0, 0, 0, h, [[0, '#6b472a'], [0.5, '#a97947'], [1, '#57371f']]);
      g.fillRect(0, 0, w, h);
      for (i = 0; i < 13; i++) {
        var yy = 8 + i * 14;
        g.fillStyle = i % 2 ? 'rgba(232,190,129,.13)' : 'rgba(52,32,18,.2)';
        g.beginPath(); g.moveTo(0, yy);
        for (j = 0; j <= 8; j++) g.quadraticCurveTo(j * 16 + 8, yy + (j % 2 ? -3 : 3), (j + 1) * 16, yy);
        g.lineTo(w, yy + 9); g.lineTo(0, yy + 9); g.fill();
        g.strokeStyle = 'rgba(48,30,16,.35)'; g.lineWidth = 1;
        g.beginPath(); g.moveTo(0, yy); g.lineTo(w, yy); g.stroke();
      }
      /* punched holes with daylight rings */
      for (i = 0; i < 5; i++) {
        var hx = 24 + (i % 2) * 70, hy = 30 + i * 32;
        var hg = g.createRadialGradient(hx, hy, 1, hx, hy, 22);
        hg.addColorStop(0, 'rgba(255,240,196,.95)'); hg.addColorStop(0.35, rgba(PALE, 0.55));
        hg.addColorStop(1, rgba(PALE, 0));
        g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = hg; g.fillRect(hx - 24, hy - 24, 48, 48); g.restore();
        g.fillStyle = '#ffe9b9'; g.beginPath(); g.ellipse(hx, hy, 4 + r() * 2, 3 + r() * 2, r(), 0, TAU); g.fill();
        g.strokeStyle = 'rgba(58,36,20,.7)'; g.lineWidth = 1.5;
        g.beginPath(); g.ellipse(hx, hy, 7, 6, 0, 0, TAU); g.stroke();
      }
      tapeStrip(g, 0, 88, w, 13, r, false);
      markerWord(g, 'TUNNEL', 64, 168, 13, INK, -0.05);
      flutes(g, 0, 0, w, 10, r); flutes(g, 0, h - 10, w, 10, r);
    });
  }

  function makeTower() {
    return tex(128, 192, function (g, w, h) {
      var r = rnd(4301), i;
      cardBase(g, w, h, r, 'dial');
      g.save(); g.globalAlpha = 0.42;
      g.fillStyle = '#8c7048'; g.beginPath(); g.moveTo(14, 30); g.lineTo(112, 22);
      g.lineTo(116, 68); g.lineTo(10, 76); g.closePath(); g.fill();
      g.fillStyle = 'rgba(214,166,96,.6)'; g.beginPath(); g.moveTo(16, 116); g.lineTo(110, 106);
      g.lineTo(114, 160); g.lineTo(12, 168); g.closePath(); g.fill();
      g.restore();
      /* kitchen foil star with sharp highlights */
      var fg = g.createLinearGradient(40, 60, 90, 116);
      fg.addColorStop(0, '#fdf7e6'); fg.addColorStop(0.35, '#b9b2a3');
      fg.addColorStop(0.6, '#eee8d5'); fg.addColorStop(1, '#7d7568');
      g.save(); g.translate(64, 94); g.fillStyle = fg; g.beginPath();
      for (i = 0; i < 10; i++) {
        var a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? 13 : 31;
        if (i === 0) g.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
        else g.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
      }
      g.closePath(); g.fill();
      for (i = 0; i < 6; i++) {
        g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 1;
        g.beginPath(); g.moveTo(-20 + r() * 40, -20 + r() * 40);
        g.lineTo(-20 + r() * 40, -20 + r() * 40); g.stroke();
      }
      g.restore();
      markerWord(g, 'THE TOWER', 64, 150, 14, INK, 0.03);
      marker(g, [[12, 154], [118, 150]], INK, 2, 512);
      tapeStrip(g, 96, 10, 22, h - 20, r, true);
      flutes(g, 0, 0, w, 12, r); flutes(g, 0, h - 12, w, 12, r);
    });
  }

  function makeWindow() {
    return tex(128, 192, function (g, w, h) {
      var r = rnd(4411), i;
      cardBase(g, w, h, r, 'keep');
      /* a hand-cut crooked window: blurred living room beyond */
      var poly = [[24, 30], [104, 24], [110, 130], [20, 138]];
      g.save(); g.beginPath(); g.moveTo(poly[0][0], poly[0][1]);
      for (i = 1; i < poly.length; i++) {
        var p = poly[i], prev = poly[i - 1];
        g.quadraticCurveTo((prev[0] + p[0]) / 2 + (r() - 0.5) * 9, (prev[1] + p[1]) / 2 + (r() - 0.5) * 9, p[0], p[1]);
      }
      g.closePath(); g.clip();
      g.fillStyle = grad(g, 0, 20, 0, 150, [[0, '#fff0c8'], [0.36, '#e8c891'], [0.72, '#c39562'], [1, '#8a633c']]);
      g.fillRect(0, 0, w, h);
      /* tall window, blurred with layered translucent shapes */
      g.fillStyle = 'rgba(255,249,223,.55)'; rr(g, 34, 34, 48, 94, 5); g.fill();
      g.fillStyle = 'rgba(255,255,244,.32)'; rr(g, 39, 38, 38, 86, 4); g.fill();
      g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(56, 34, 5, 94);
      /* sofa leg */
      g.fillStyle = 'rgba(78,56,38,.42)'; rr(g, 12, 104, 17, 52, 6); g.fill();
      g.fillStyle = 'rgba(50,34,23,.5)'; g.beginPath(); g.ellipse(21, 154, 13, 5, 0, 0, TAU); g.fill();
      /* rug */
      g.fillStyle = 'rgba(150,96,56,.34)'; g.beginPath(); g.ellipse(76, 140, 62, 18, -0.08, 0, TAU); g.fill();
      g.strokeStyle = 'rgba(112,70,40,.3)'; g.lineWidth = 3; g.beginPath(); g.ellipse(76, 140, 48, 12, -0.08, 0, TAU); g.stroke();
      /* dust in the beam */
      for (i = 0; i < 60; i++) {
        g.fillStyle = 'rgba(255,250,220,' + (0.1 + r() * 0.35) + ')';
        g.beginPath(); g.arc(20 + r() * 90, 28 + r() * 116, 0.6 + r() * 1.5, 0, TAU); g.fill();
      }
      g.save(); g.globalCompositeOperation = 'lighter';
      var bg = g.createLinearGradient(30, 24, 110, 160);
      bg.addColorStop(0, 'rgba(255,240,190,.42)'); bg.addColorStop(1, 'rgba(255,240,190,0)');
      g.fillStyle = bg; g.beginPath(); g.moveTo(36, 28); g.lineTo(74, 28);
      g.lineTo(128, 158); g.lineTo(60, 158); g.closePath(); g.fill();
      g.restore();
      g.restore();
      /* ragged corrugated cut edge */
      g.strokeStyle = '#d9b27b'; g.lineWidth = 7;
      g.beginPath(); g.moveTo(poly[0][0], poly[0][1]);
      for (i = 1; i < poly.length; i++) g.lineTo(poly[i][0], poly[i][1]);
      g.closePath(); g.stroke();
      g.strokeStyle = 'rgba(80,50,28,.65)'; g.lineWidth = 1.4; g.stroke();
      for (i = 0; i < 22; i++) {
        var t = i / 22;
        g.fillStyle = 'rgba(104,68,36,.55)';
        g.beginPath(); g.arc(24 + t * 80, 27 + t * 2, 1.7, 0, TAU); g.fill();
      }
      marker(g, [[8, 164], [112, 158]], INK, 2, 881);
      markerWord(g, 'WINDOW', 64, 172, 12, INK, -0.03);
      flutes(g, 0, 0, w, 10, r); flutes(g, 0, h - 10, w, 10, r);
    });
  }

  function makeFlapWall() {
    return tex(128, 192, function (g, w, h) {
      var r = rnd(4503);
      cardBase(g, w, h, r, 'arrows');
      g.fillStyle = 'rgba(224,192,138,.32)'; g.fillRect(16, 16, 96, 160);
      g.strokeStyle = rgba(INK, 0.7); g.lineWidth = 2;
      g.beginPath(); g.moveTo(16, 16); g.lineTo(112, 16); g.lineTo(112, 176); g.lineTo(16, 176); g.closePath(); g.stroke();
      tapeStrip(g, 54, 12, 20, 168, r, true);
      markerWord(g, 'FLAP', 64, 92, 13, INK, -0.04);
      marker(g, [[28, 110], [96, 106], [88, 98]], INK, 2.2, 601);
      flutes(g, 0, 0, w, 12, r); flutes(g, 0, h - 12, w, 12, r);
    });
  }

  function makeCorrugation() {
    return tex(128, 192, function (g, w, h) {
      var r = rnd(4617), i;
      g.fillStyle = '#b78c58'; g.fillRect(0, 0, w, h);
      for (i = 0; i < 15; i++) flutes(g, 0, i * 13, w, 12, r);
      g.fillStyle = 'rgba(246,231,201,.2)'; g.fillRect(0, 0, w, h);
      g.fillStyle = 'rgba(93,60,32,.35)'; g.fillRect(0, 0, 12, h);
      g.fillStyle = 'rgba(255,232,190,.35)'; g.fillRect(12, 0, 3, h);
      tapeStrip(g, 92, 0, 22, h, r, true);
      markerWord(g, 'CUT EDGE', 64, 96, 13, INK, -0.05);
    });
  }

  function makeFoil() {
    return tex(128, 192, function (g, w, h) {
      var r = rnd(4701), i;
      cardBase(g, w, h, r, 'dial');
      for (i = 0; i < 40; i++) {
        var x = r() * w, y = r() * h, s = 12 + r() * 26;
        g.fillStyle = grad(g, x, y, x + s, y + s, [[0, '#f8f3e1'], [0.4, '#a9a498'],
          [0.6, '#e6e0cb'], [1, '#77716a']]);
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + s, y - 3); g.lineTo(x + s * 0.8, y + s);
        g.lineTo(x - 3, y + s * 0.8); g.closePath(); g.fill();
        g.strokeStyle = 'rgba(255,255,255,.22)'; g.lineWidth = 1; g.stroke();
      }
      markerWord(g, 'FOIL PANEL', 64, 174, 12, INK, 0.02);
      flutes(g, 0, 0, w, 11, r); flutes(g, 0, h - 11, w, 11, r);
    });
  }

  function makeBridge() {
    return tex(128, 192, function (g, w, h) {
      var r = rnd(4801), i;
      cardBase(g, w, h, r, 'keep');
      g.fillStyle = 'rgba(236,206,156,.2)'; g.fillRect(0, 0, w, h);
      for (i = 0; i < 5; i++) {
        marker(g, [[8, 58 + i * 24], [120, 56 + i * 24]], INK, 1.8, 300 + i);
      }
      g.fillStyle = '#3a2a1c'; g.beginPath(); g.arc(64, 34, 7, 0, TAU); g.fill();
      g.strokeStyle = '#e4cc9e'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(64, 34); g.bezierCurveTo(70, 10, 90, 8, 104, 0); g.stroke();
      markerWord(g, 'PULL', 64, 108, 22, INK, -0.05);
      tapeStrip(g, 0, 150, w, 15, r, false);
      flutes(g, 0, 0, w, 13, r); flutes(g, 0, h - 13, w, 13, r);
    });
  }

  /* ------------------------------ sprite art --------------------------- */
  function capWheel(g, x, y, r) {
    var gr = g.createRadialGradient(x - r * 0.3, y - r * 0.35, 1, x, y, r);
    gr.addColorStop(0, '#f3e4c1'); gr.addColorStop(0.45, '#c1a06a'); gr.addColorStop(1, '#5a3c22');
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(60,38,20,.8)'; g.lineWidth = 1.5; g.beginPath(); g.arc(x, y, r * 0.68, 0, TAU); g.stroke();
    for (var i = 0; i < 8; i++) {
      var a = i / 8 * TAU;
      g.strokeStyle = 'rgba(255,236,196,.3)'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7);
      g.lineTo(x + Math.cos(a) * r * 0.93, y + Math.sin(a) * r * 0.93); g.stroke();
    }
  }

  function makeBot(state) {
    return tex(96, 128, function (g, w, h) {
      var r = rnd(5000 + state * 31), i;
      g.fillStyle = 'rgba(40,26,14,.45)'; g.beginPath(); g.ellipse(48, 118, 38, 7, 0, 0, TAU); g.fill();
      if (state === 3) {
        /* broken down flat: a stack of folded panels with cut flutes */
        g.fillStyle = grad(g, 0, 78, 0, 112, [[0, '#d6ae78'], [0.5, '#b18452'], [1, '#6d4728']]);
        g.beginPath(); g.moveTo(8, 100); g.lineTo(84, 88); g.lineTo(92, 108); g.lineTo(4, 116); g.closePath(); g.fill();
        g.fillStyle = '#e0bd85'; g.fillRect(6, 100, 84, 6);
        g.strokeStyle = 'rgba(90,58,32,.6)'; g.lineWidth = 1;
        for (i = 0; i < 12; i++) { g.beginPath(); g.moveTo(8 + i * 7, 106); g.lineTo(8 + i * 7, 112); g.stroke(); }
        g.fillStyle = 'rgba(150,103,55,.7)'; g.fillRect(34, 88, 16, 26);
        markerWord(g, 'FLAT', 48, 76, 12, INK, -0.04);
        return;
      }
      /* body box */
      g.fillStyle = grad(g, 10, 0, 86, 0, [[0, '#6f4829'], [0.22, '#c39b6b'], [0.55, '#d8b684'], [0.85, '#9c7044'], [1, '#5b3a21']]);
      rr(g, 16, 34, 64, 72, 4); g.fill();
      g.strokeStyle = 'rgba(56,34,18,.65)'; g.lineWidth = 2; rr(g, 16, 34, 64, 72, 4); g.stroke();
      flutes(g, 16, 34, 64, 8, r);
      flutes(g, 16, 100, 64, 8, r);
      tapeStrip(g, 44, 34, 12, 72, r, true);
      /* marker dial and grille, never a face */
      g.fillStyle = 'rgba(242,222,182,.8)'; g.beginPath(); g.arc(36, 62, 12, 0, TAU); g.fill();
      g.strokeStyle = rgba(INK, 0.8); g.lineWidth = 2; g.beginPath(); g.arc(36, 62, 12, 0, TAU); g.stroke();
      for (i = 0; i < 8; i++) {
        var a = i / 8 * TAU;
        g.beginPath(); g.moveTo(36 + Math.cos(a) * 8, 62 + Math.sin(a) * 8);
        g.lineTo(36 + Math.cos(a) * 11, 62 + Math.sin(a) * 11); g.stroke();
      }
      for (i = 0; i < 5; i++) { g.fillStyle = rgba(INK, 0.65); g.fillRect(56, 55 + i * 8, 18, 3); }
      markerWord(g, 'BX-' + (1 + state), 48, 94, 10, INK, 0.02);
      /* folded panels hinged on tape */
      if (state >= 1) {
        g.fillStyle = grad(g, 0, 40, 0, 104, [[0, '#dcb681'], [1, '#8a5c32']]);
        g.beginPath(); g.moveTo(16, 38); g.lineTo(2, 28); g.lineTo(4, 96); g.lineTo(16, 102); g.closePath(); g.fill();
        g.strokeStyle = 'rgba(56,34,18,.7)'; g.lineWidth = 2; g.stroke();
        g.fillStyle = 'rgba(150,103,55,.8)'; g.fillRect(12, 36, 7, 66);
      }
      if (state >= 2) {
        g.fillStyle = grad(g, 0, 40, 0, 104, [[0, '#e2bd87'], [1, '#7d5530']]);
        g.beginPath(); g.moveTo(80, 38); g.lineTo(94, 26); g.lineTo(92, 94); g.lineTo(80, 102); g.closePath(); g.fill();
        g.strokeStyle = 'rgba(56,34,18,.7)'; g.lineWidth = 2; g.stroke();
        g.fillStyle = 'rgba(150,103,55,.8)'; g.fillRect(77, 36, 7, 66);
        g.fillStyle = 'rgba(40,26,14,.3)'; g.fillRect(34, 52, 30, 44);
      }
      capWheel(g, 28, 112, 11); capWheel(g, 68, 112, 11);
    });
  }

  function makeHead() {
    return tex(64, 64, function (g, w, h) {
      var i;
      g.fillStyle = grad(g, 8, 0, 56, 0, [[0, '#70482a'], [0.3, '#d4ad79'], [0.7, '#b48856'], [1, '#5d3c22']]);
      rr(g, 10, 14, 44, 40, 5); g.fill();
      g.fillStyle = '#e2bd85'; g.beginPath(); g.ellipse(32, 16, 22, 7, 0, 0, TAU); g.fill();
      g.strokeStyle = rgba(INK, 0.7); g.lineWidth = 2; g.beginPath(); g.ellipse(32, 16, 22, 7, 0, 0, TAU); g.stroke();
      g.fillStyle = 'rgba(246,231,201,.55)'; g.beginPath(); g.ellipse(32, 16, 15, 4, 0, 0, TAU); g.fill();
      for (i = 0; i < 4; i++) { g.fillStyle = rgba(INK, 0.62); g.fillRect(18, 28 + i * 6, 28, 2); }
      g.strokeStyle = '#cfc6ae'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(46, 18); g.lineTo(56, 2); g.lineTo(60, 8); g.stroke();
      g.fillStyle = '#d9d3c0'; g.beginPath(); g.arc(60, 2, 3, 0, TAU); g.fill();
      g.fillStyle = 'rgba(150,103,55,.85)'; g.fillRect(8, 34, 6, 16);
    });
  }

  function makeCup() {
    return tex(64, 96, function (g, w, h) {
      g.fillStyle = 'rgba(40,26,14,.4)'; g.beginPath(); g.ellipse(32, 88, 22, 5, 0, 0, TAU); g.fill();
      g.fillStyle = grad(g, 14, 0, 50, 0, [[0, '#bcae90'], [0.3, '#fff9e7'], [0.72, '#e5d8b9'], [1, '#a29373']]);
      g.beginPath(); g.moveTo(14, 18); g.lineTo(50, 18); g.lineTo(43, 86); g.lineTo(21, 86); g.closePath(); g.fill();
      g.strokeStyle = 'rgba(84,62,38,.6)'; g.lineWidth = 1.5; g.stroke();
      g.fillStyle = '#f7efd8'; g.beginPath(); g.ellipse(32, 18, 18, 5, 0, 0, TAU); g.fill();
      g.strokeStyle = '#b8a888'; g.lineWidth = 2; g.beginPath(); g.ellipse(32, 18, 18, 5, 0, 0, TAU); g.stroke();
      g.fillStyle = rgba(BLUE, 0.7); g.fillRect(16, 42, 32, 9);
      markerWord(g, 'CUP', 32, 62, 12, INK, -0.04);
      g.strokeStyle = '#e4cc9e'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(32, 14); g.bezierCurveTo(44, 4, 58, 8, 64, 0); g.stroke();
    });
  }

  function makePaper() {
    return tex(32, 32, function (g, w, h) {
      var r = rnd(5401), i;
      g.fillStyle = '#efe6ce'; g.beginPath();
      for (i = 0; i < 9; i++) {
        var a = i / 9 * TAU, rr2 = 11 + r() * 4;
        if (i === 0) g.moveTo(16 + Math.cos(a) * rr2, 16 + Math.sin(a) * rr2);
        else g.lineTo(16 + Math.cos(a) * rr2, 16 + Math.sin(a) * rr2);
      }
      g.closePath(); g.fill();
      g.strokeStyle = 'rgba(110,88,58,.6)'; g.lineWidth = 1;
      for (i = 0; i < 6; i++) {
        g.beginPath(); g.moveTo(8 + r() * 16, 8 + r() * 16); g.lineTo(9 + r() * 16, 8 + r() * 16); g.stroke();
      }
      g.fillStyle = 'rgba(150,120,80,.2)'; g.beginPath(); g.arc(20, 13, 6, 0, TAU); g.fill();
    });
  }

  function makeBand() {
    return tex(32, 32, function (g, w, h) {
      g.save(); g.translate(16, 16); g.rotate(-0.2);
      g.strokeStyle = '#a4602f'; g.lineWidth = 3.2;
      g.beginPath(); g.ellipse(0, 0, 11, 6, 0, 0, TAU); g.stroke();
      g.strokeStyle = 'rgba(255,206,142,.85)'; g.lineWidth = 1.1;
      g.beginPath(); g.ellipse(0, -1, 11, 6, 0, 3.4, 5.9); g.stroke();
      g.strokeStyle = 'rgba(80,42,20,.5)'; g.lineWidth = 1;
      g.beginPath(); g.ellipse(0, 1, 11, 6, 0, 0.2, 2.8); g.stroke();
      g.restore();
    });
  }

  function makeTin() {
    return tex(128, 128, function (g, w, h) {
      var i;
      g.fillStyle = 'rgba(40,26,14,.45)'; g.beginPath(); g.ellipse(64, 116, 48, 8, 0, 0, TAU); g.fill();
      g.fillStyle = grad(g, 14, 0, 114, 0, [[0, '#6b4628'], [0.2, '#d8ad6f'], [0.45, '#f0d59b'],
        [0.7, '#c69555'], [1, '#604027']]);
      rr(g, 12, 34, 104, 78, 7); g.fill();
      g.strokeStyle = 'rgba(74,46,24,.75)'; g.lineWidth = 2; rr(g, 12, 34, 104, 78, 7); g.stroke();
      g.fillStyle = 'rgba(246,231,201,.7)'; rr(g, 24, 48, 80, 44, 4); g.fill();
      g.strokeStyle = rgba(BLUE, 0.7); g.lineWidth = 2; rr(g, 24, 48, 80, 44, 4); g.stroke();
      markerWord(g, 'BISCUITS', 64, 66, 18, INK, -0.03);
      markerWord(g, 'SUNDAY TIN', 64, 86, 10, INK, 0.02);
      g.fillStyle = '#d9d3c0';
      for (i = 0; i < 10; i++) { g.fillRect(16 + i * 10, 106, 5, 4); }
      g.fillStyle = grad(g, 8, 0, 120, 0, [[0, '#8a6137'], [0.3, '#f4e0b2'], [0.7, '#d0a567'], [1, '#7b512d']]);
      rr(g, 8, 22, 112, 20, 6); g.fill();
      g.strokeStyle = 'rgba(74,46,24,.6)'; g.lineWidth = 2; rr(g, 8, 22, 112, 20, 6); g.stroke();
      g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(12, 25, 104, 2);
    });
  }

  function makeTinLid() {
    return tex(128, 40, function (g, w, h) {
      g.fillStyle = grad(g, 0, 0, 0, h, [[0, '#f4e0b2'], [0.5, '#d0a567'], [1, '#7b512d']]);
      rr(g, 4, 4, 120, 30, 7); g.fill();
      g.strokeStyle = 'rgba(74,46,24,.7)'; g.lineWidth = 2; rr(g, 4, 4, 120, 30, 7); g.stroke();
      g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(10, 7, 108, 2);
    });
  }

  function makeShelf() {
    return tex(128, 64, function (g, w, h) {
      var r = rnd(5511);
      g.fillStyle = grad(g, 0, 20, 0, 54, [[0, '#e0bd85'], [0.45, '#bd925d'], [1, '#6e4828']]);
      g.beginPath(); g.moveTo(4, 22); g.lineTo(124, 16); g.lineTo(124, 38); g.lineTo(4, 46); g.closePath(); g.fill();
      flutes(g, 4, 38, 120, 10, r);
      g.fillStyle = 'rgba(50,32,18,.35)'; g.fillRect(10, 50, 108, 8);
      tapeStrip(g, 14, 4, 15, 30, r, true);
      tapeStrip(g, 98, 4, 15, 30, r, true);
    });
  }

  function makeTorch() {
    return tex(64, 96, function (g, w, h) {
      g.strokeStyle = '#e4cc9e'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(32, 0); g.lineTo(32, 22); g.stroke();
      g.fillStyle = grad(g, 18, 0, 46, 0, [[0, '#654326'], [0.4, '#c69b68'], [1, '#6c4829']]);
      rr(g, 20, 22, 24, 46, 4); g.fill();
      g.fillStyle = '#d8d3bc'; g.beginPath(); g.moveTo(16, 66); g.lineTo(48, 66);
      g.lineTo(38, 88); g.lineTo(26, 88); g.closePath(); g.fill();
      var gr = g.createRadialGradient(32, 78, 1, 32, 78, 26);
      gr.addColorStop(0, 'rgba(255,238,186,.9)'); gr.addColorStop(1, 'rgba(255,238,186,0)');
      g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = gr; g.fillRect(6, 56, 52, 40); g.restore();
      g.fillStyle = 'rgba(150,103,55,.85)'; g.fillRect(19, 34, 26, 8);
    });
  }

  function makeBulb() {
    return tex(32, 32, function (g) {
      var gr = g.createRadialGradient(16, 16, 0, 16, 16, 16);
      gr.addColorStop(0, 'rgba(255,244,205,.95)'); gr.addColorStop(0.32, 'rgba(255,206,126,.6)');
      gr.addColorStop(1, 'rgba(255,206,126,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 32, 32);
      g.fillStyle = '#fff2cf'; g.beginPath(); g.arc(16, 16, 4, 0, TAU); g.fill();
      g.fillStyle = '#a57b43'; g.fillRect(14, 8, 4, 4);
    });
  }

  function makeBridgeFlat() {
    return tex(128, 64, function (g, w, h) {
      var r = rnd(5601);
      g.fillStyle = 'rgba(40,26,14,.4)'; g.beginPath(); g.ellipse(64, 52, 60, 8, 0, 0, TAU); g.fill();
      g.fillStyle = grad(g, 0, 8, 0, 48, [[0, '#e0bd85'], [0.6, '#b68954'], [1, '#6b4628']]);
      g.beginPath(); g.moveTo(8, 24); g.lineTo(118, 12); g.lineTo(124, 46); g.lineTo(4, 54); g.closePath(); g.fill();
      flutes(g, 6, 46, 116, 9, r);
      g.strokeStyle = rgba(INK, 0.6); g.lineWidth = 2;
      for (var i = 0; i < 4; i++) { g.beginPath(); g.moveTo(14 + i * 24, 20); g.lineTo(116, 16 + i * 8); g.stroke(); }
      markerWord(g, 'PULL', 64, 34, 14, INK, -0.07);
      g.fillStyle = 'rgba(150,103,55,.75)'; g.fillRect(52, 10, 14, 40);
    });
  }

  function makeMarkerCard() {
    return tex(256, 160, function (g, w, h) {
      var r = rnd(5711), i;
      g.fillStyle = '#efdcb2'; g.fillRect(0, 0, w, h);
      g.fillStyle = grad(g, 0, 0, w, h, [[0, 'rgba(255,246,214,.65)'], [0.6, 'rgba(230,203,156,.2)'], [1, 'rgba(120,82,44,.2)']]);
      g.fillRect(0, 0, w, h);
      for (i = 0; i < 160; i++) { g.fillStyle = rgba(BR, r() * 0.07); g.fillRect(r() * w, r() * h, 1 + r() * 3, 1); }
      g.strokeStyle = rgba(INK, 0.65); g.lineWidth = 3; g.strokeRect(8, 8, w - 16, h - 16);
      markerWord(g, 'THE TIN IS OPEN', 128, 34, 20, INK, -0.02);
      marker(g, [[22, 48], [234, 46]], BLUE, 3, 661);
      markerWord(g, 'TIME', 34, 76, 15, INK, -0.03);
      markerWord(g, 'BANDS', 34, 106, 15, INK, -0.02);
      markerWord(g, 'BOTS FOLDED', 34, 136, 13, INK, -0.02);
      marker(g, [[108, 66], [236, 66]], INK, 1.4, 662);
      marker(g, [[108, 96], [236, 96]], INK, 1.4, 663);
      marker(g, [[108, 126], [236, 126]], INK, 1.4, 664);
      tapeStrip(g, 0, 0, 18, 24, r, true);
      tapeStrip(g, 222, 136, 22, 20, r, false);
    });
  }

  function makeCeiling() {
    return tex(512, 256, function (g, w, h) {
      var r = rnd(5801), i;
      g.fillStyle = grad(g, 0, 0, 0, h, [[0, '#382415'], [0.45, '#624326'], [1, '#3a2716']]);
      g.fillRect(0, 0, w, h);
      for (i = 0; i < 300; i++) { g.fillStyle = rgba(CRM, r() * 0.05); g.fillRect(r() * w, r() * h, 1 + r() * 3, 1); }
      g.strokeStyle = 'rgba(226,198,148,.5)'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(-10, 64);
      for (i = 0; i <= 12; i++) g.quadraticCurveTo(i * 44 + 20, 96 + (i % 2 ? 16 : -10), i * 44 + 44, 64);
      g.stroke();
      for (i = 0; i < 12; i++) {
        var bx = 22 + i * 42, by = 72 + (i % 2) * 9;
        var gr = g.createRadialGradient(bx, by, 0, bx, by, 22);
        gr.addColorStop(0, 'rgba(255,226,157,.55)'); gr.addColorStop(1, 'rgba(255,226,157,0)');
        g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = gr;
        g.fillRect(bx - 22, by - 22, 44, 44); g.restore();
        g.fillStyle = '#fff0c8'; g.beginPath(); g.arc(bx, by, 3.5, 0, TAU); g.fill();
        g.fillStyle = 'rgba(150,103,55,.8)'; g.fillRect(bx - 3, by - 8, 8, 6);
      }
      flutes(g, 0, 0, w, 9, r);
      g.fillStyle = 'rgba(26,16,9,.35)'; g.fillRect(0, h - 24, w, 24);
    });
  }

  function makeFloor() {
    return tex(512, 256, function (g, w, h) {
      var r = rnd(5901), i;
      g.fillStyle = grad(g, 0, 0, 0, h, [[0, '#5c4027'], [0.5, '#7c5934'], [1, '#4a3220']]);
      g.fillRect(0, 0, w, h);
      for (i = 0; i < 2600; i++) {
        var x = r() * w, y = r() * h;
        g.strokeStyle = r() > 0.5 ? rgba(PALE, 0.06 + r() * 0.09) : rgba(BR, 0.1 + r() * 0.15);
        g.lineWidth = 0.8 + r() * 1.2;
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 5, y - 2 - r() * 5); g.stroke();
      }
      for (i = 0; i < 40; i++) {
        g.fillStyle = rgba(CRM, r() * 0.05);
        g.beginPath(); g.ellipse(r() * w, r() * h, 10 + r() * 30, 4 + r() * 10, r(), 0, TAU); g.fill();
      }
    });
  }

  var T = null;
  function buildTextures(seed) {
    var bot = [];
    for (var i = 0; i < 4; i++) bot.push(makeBot(i));
    return {
      card: makeCard('keep', 6101 + seed), card2: makeCard('arrows', 6109 + seed),
      card3: makeCard('dial', 6113 + seed), tape: makeTape(), roll: makeRoll(),
      tower: makeTower(), window: makeWindow(), flap: makeFlapWall(),
      corr: makeCorrugation(), foil: makeFoil(), bridge: makeBridge(),
      ceiling: makeCeiling(), floor: makeFloor(),
      sp: {
        bot: bot, head: makeHead(), cup: makeCup(), paper: makePaper(), band: makeBand(),
        tin: makeTin(), lid: makeTinLid(), shelf: makeShelf(), torch: makeTorch(),
        bulb: makeBulb(), bridgeFlat: makeBridgeFlat(), card: makeMarkerCard(),
        flapStrip: tex(64, 96, function (g, w, h) {
          var r = rnd(6017);
          g.fillStyle = grad(g, 0, 0, w, 0, [[0, '#674426'], [0.35, '#c9a06b'], [1, '#5d3c22']]);
          g.fillRect(0, 0, w, h);
          flutes(g, 0, 0, w, 8, r); flutes(g, 0, h - 8, w, 8, r);
          tapeStrip(g, 24, 6, 18, h - 12, r, true);
          markerWord(g, 'TAPE', 32, 46, 12, INK, -0.05);
          marker(g, [[8, 66], [54, 62], [46, 56]], INK, 2, 622);
        }),
        springFlap: tex(64, 40, function (g, w, h) {
          var r = rnd(6119);
          g.fillStyle = grad(g, 0, 0, 0, h, [[0, '#e1bd86'], [0.6, '#b68954'], [1, '#6d4728']]);
          rr(g, 2, 4, 60, 26, 2); g.fill();
          flutes(g, 2, 26, 60, 8, r);
          tapeStrip(g, 0, 2, 12, 28, r, true);
          g.strokeStyle = '#c9c3ad'; g.lineWidth = 2;
          g.beginPath(); g.moveTo(16, 12); g.bezierCurveTo(26, 2, 34, 22, 44, 10);
          g.bezierCurveTo(50, 4, 56, 16, 60, 8); g.stroke();
          g.fillStyle = rgba(INK, 0.7); g.fillRect(46, 22, 12, 2);
        }),
        glow: tex(128, 128, function (g) {
          var gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
          gr.addColorStop(0, 'rgba(255,228,164,.9)'); gr.addColorStop(0.35, rgba(GOLD, 0.35));
          gr.addColorStop(1, rgba(GOLD, 0));
          g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
        })
      }
    };
  }

  /* -------------------------------- state ----------------------------- */
  var G = {
    env: null, grid: null, wallCache: new Array(W * H * 10), props: [], bands: [], stuck: [],
    papers: [], parts: [], bots: [], windows: [], fairies: [], dust: [],
    cupShot: false, flapOpen: true, stars: 3, area: 1, folded: 0, bandsUsed: 0,
    magazine: 6, reload: 0, done: false, tinOpen: false, endAt: -1, winPending: false,
    flash: 0, invuln: 0, lag: 0, lastAngle: 0, clock: 0, torchSwing: 0,
    start: null, locked: false, route: null, demo: null, demoTotal: 1,
    endLines: [], forceEnd: false, scoreTick: 0, wheelTick: 0,
    deadline: [14, 28, 32, 44, 48]
  };

  function cell(x, y) {
    if (x < 0 || y < 0 || x >= W || y >= H) return 1;
    var ch = G.grid[y].charAt(x);
    return ch ? (+ch) : 0;
  }

  function buildMap() {
    var a = [], x, y;
    for (y = 0; y < H; y++) { a[y] = []; for (x = 0; x < W; x++) a[y][x] = '0'; }
    for (x = 0; x < W; x++) { a[0][x] = '1'; a[H - 1][x] = '1'; }
    for (y = 0; y < H; y++) { a[y][0] = '1'; a[y][W - 1] = '1'; }
    for (y = 1; y < H - 1; y++) a[y][13] = '2';
    [6, 7, 8, 9].forEach(function (y2) { a[y2][13] = '9'; });
    for (y = 1; y < H - 1; y++) a[y][25] = '4';
    a[7][25] = '6'; a[8][25] = '6';
    [3, 4, 10, 11].forEach(function (y2) { a[y2][25] = '0'; });
    for (x = 15; x <= 23; x++) { a[4][x] = '3'; a[10][x] = '3'; }
    function put(px, py, v) { if (px > 0 && px < W - 1 && py > 0 && py < H - 1) a[py][px] = v; }
    [[6, 0], [10, 0], [18, 0], [30, 0], [33, 0], [4, 14], [21, 14], [33, 14]].forEach(function (p) { a[p[1]][p[0]] = '5'; });
    a[7][0] = '5'; a[6][W - 1] = '5';
    [[13, 2], [13, 12], [25, 2], [25, 12], [16, 1], [22, 13], [31, 1]].forEach(function (p) { put(p[0], p[1], '7'); });
    [[9, 2], [33, 4], [33, 10], [29, 13]].forEach(function (p) { put(p[0], p[1], '8'); });
    [[7, 1], [20, 13], [28, 1], [36, 12]].forEach(function (p) { put(p[0], p[1], '2'); });
    [[2, 5], [35, 5]].forEach(function (p) { put(p[0], p[1], '3'); });
    put(2, 9, '7'); put(35, 9, '7');
    G.grid = a.map(function (row) { return row.join(''); });
    return G.grid;
  }

  function info(v, x, y) {
    var idx = (y * W + x) * 10 + v;
    var o = G.wallCache[idx];
    if (!o) o = G.wallCache[idx] = { solid: true, tex: null, height: 1, color: '#8a6139', emissive: null };
    return o;
  }
  function wallFn(v, x, y) { return info(v, x, y); }

  function refreshWalls() {
    var x, y, v, o;
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
      v = cell(x, y); o = info(v, x, y);
      o.solid = v !== 0; o.height = 1; o.emissive = null;
      switch (v) {
        case 0: o.solid = false; o.tex = null; break;
        case 1: o.tex = (x + y) % 3 === 0 ? T.card2 : ((x + y) % 3 === 1 ? T.card3 : T.card); break;
        case 2: o.tex = T.tape; break;
        case 3: o.tex = T.roll; o.emissive = rgba(PALE, 0.10); break;
        case 4: o.tex = T.tower; break;
        case 5: o.tex = T.window; o.emissive = rgba(PALE, 0.18); break;
        case 6: o.solid = x === 25 ? !G.flapOpen : true; o.tex = T.flap; break;
        case 7: o.tex = T.corr; break;
        case 8: o.tex = T.foil; break;
        case 9: o.solid = !G.cupShot; o.tex = T.bridge; break;
        default: o.tex = T.card;
      }
    }
  }

  /* ----------------------------- sound --------------------------------- */
  function snap() { A.sound.tone({ freq: 440, dur: 0.08, type: 'sawtooth', gain: 0.09, slideTo: 150 }); }
  function slap() { A.sound.noise({ dur: 0.07, gain: 0.09, freq: 1100, filter: 'lowpass' }); }
  function knock() {
    A.sound.tone({ freq: 132, dur: 0.16, type: 'triangle', gain: 0.1, slideTo: 72 });
    A.sound.noise({ dur: 0.09, gain: 0.06, freq: 420 });
  }
  function wheels() { A.sound.noise({ dur: 0.11, gain: 0.035, freq: 380 }); }
  function paperSound() { A.sound.noise({ dur: 0.06, gain: 0.06, freq: 3000, filter: 'highpass' }); }
  function reloadSound() {
    A.sound.tone({ freq: 330, dur: 0.12, type: 'triangle', gain: 0.06, slideTo: 520 });
    A.sound.noise({ dur: 0.07, gain: 0.05, freq: 1600 });
  }
  function tinPop() {
    A.sound.noise({ dur: 0.1, gain: 0.1, freq: 900 });
    A.sound.chord([523, 659, 784, 1046], 0.6, 0.08);
  }
  function mutedRoom() {
    A.sound.tone({ freq: 82, dur: 0.5, type: 'sine', gain: 0.018 });
  }

  /* ---------------------------- sprites -------------------------------- */
  function img(g, cx, cy, hh, canvas, alpha, ws, rot) {
    if (!canvas) return;
    var ww = hh * (canvas.width / canvas.height) * (ws === undefined ? 1 : ws);
    g.save(); g.globalAlpha = alpha === undefined ? 1 : clamp(alpha, 0, 1);
    g.translate(cx, cy); if (rot) g.rotate(rot);
    g.drawImage(canvas, -ww / 2, -hh / 2, ww, hh); g.restore();
  }
  function shadow(g, cx, cy, hh, wid) {
    g.save(); g.globalAlpha = 0.35; g.fillStyle = '#241609';
    g.beginPath(); g.ellipse(cx, cy + hh * 0.48, hh * (wid || 0.36), hh * 0.07, 0, 0, TAU); g.fill(); g.restore();
  }
  function glowImg(g, cx, cy, hh, canvas, alpha) {
    g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = alpha;
    g.drawImage(canvas, cx - hh / 2, cy - hh / 2, hh, hh); g.restore();
  }
  function star(g, cx, cy, r, fill) {
    g.save(); g.beginPath();
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5, rr2 = i % 2 ? r * 0.45 : r;
      if (i === 0) g.moveTo(cx + Math.cos(a) * rr2, cy + Math.sin(a) * rr2);
      else g.lineTo(cx + Math.cos(a) * rr2, cy + Math.sin(a) * rr2);
    }
    g.closePath(); g.fillStyle = fill; g.fill(); g.restore();
  }

  function addProp(o) {
    o.hidden = !!o.hidden;
    o.size = o.size || 0.7;
    o.lift = o.lift === undefined ? 0.5 : o.lift;
    o.r = o.r === undefined ? 0.38 : o.r;
    o.flash = 0; o.hits = 0;
    o.draw = function (g, cx, cy, size, dist, sp) {
      switch (o.kind) {
        case 'bot':
          shadow(g, cx, cy, size);
          img(g, cx, cy, size * (o.hits >= 3 ? 0.46 : 1), T.sp.bot[o.hits >= 3 ? 3 : o.hits],
            1, 1, Math.sin(o.stagger || 0) * (o.stagger || 0) * 0.1);
          if (o.hits < 3) {
            g.save(); g.translate(cx, cy - size * 0.38); g.rotate(o.headAngle || 0);
            g.drawImage(T.sp.head, -size * 0.28, -size * 0.28, size * 0.56, size * 0.56); g.restore();
            g.save(); g.translate(cx + size * 0.22, cy + size * 0.26);
            g.rotate(-0.18 - (o.stagger || 0) * 0.75);
            g.drawImage(T.sp.springFlap, -size * 0.22, -size * 0.07, size * 0.44, size * 0.14);
            g.restore();
          }
          if (o.flash > 0) glowImg(g, cx, cy, size * 1.6, T.sp.glow, o.flash * 0.5);
          break;
        case 'cup':
          shadow(g, cx, cy, size);
          img(g, cx, cy, size * (G.cupShot ? 0.7 : 1), T.sp.cup, 1, 1, G.cupShot ? 1.1 : 0);
          break;
        case 'flap':
          if (!G.flapOpen) img(g, cx, cy, size, T.sp.flapStrip, 0.98);
          break;
        case 'torch':
          img(g, cx, cy, size, T.sp.torch, 1, 1, Math.sin(G.torchSwing) * 0.28);
          glowImg(g, cx, cy + size * 0.28, size * 1.9, T.sp.glow, 0.3 + Math.abs(Math.sin(G.torchSwing)) * 0.15);
          break;
        case 'bulb':
          glowImg(g, cx, cy, size * 3.2, T.sp.glow, 0.18 + Math.sin(G.clock * 3 + o.x) * 0.06);
          img(g, cx, cy, size, T.sp.bulb);
          break;
        case 'bridge':
          if (G.cupShot) img(g, cx, cy, size * 0.55, T.sp.bridgeFlat, 0.98);
          break;
        case 'shelf':
          shadow(g, cx, cy, size, 0.5); img(g, cx, cy, size * 0.7, T.sp.shelf);
          break;
        case 'tin':
          shadow(g, cx, cy, size);
          img(g, cx, cy, size * 0.88, T.sp.tin);
          if (G.tinOpen) {
            glowImg(g, cx, cy - size * 0.25, size * 1.6, T.sp.glow, 0.45);
            g.save(); g.translate(cx, cy - size * 0.35); g.rotate(-0.34);
            g.drawImage(T.sp.lid, -size * 0.42, -size * 0.08, size * 0.84, size * 0.26); g.restore();
          }
          break;
        case 'band':
          img(g, cx, cy + Math.sin(o.wob) * size * 0.5, size, T.sp.band, 1, 1, o.wob * 1.4);
          break;
        case 'stuck':
          img(g, cx, cy, size, T.sp.band, 0.9, 1, o.rot);
          break;
        case 'paper':
          img(g, cx, cy + Math.sin(o.wob) * size * 0.7, size, T.sp.paper, 1, 1, o.rot);
          break;
        default:
          img(g, cx, cy, size, T.sp.paper);
      }
    };
    G.props.push(o);
    return o;
  }

  function addShot(o) {
    o.kind = o.kind || 'band'; o.size = o.size || 0.22; o.lift = 0.5; o.wob = 0;
    o.draw = function (g, cx, cy, size, dist, sp) {
      img(g, cx, cy + Math.sin(o.wob) * size * 0.45, size, T.sp.band, 1, 1, o.wob * 1.4);
    };
    G.bands.push(o);
    if (G.bands.length > 18) G.bands.shift();
  }

  function addStuck(x, y, rot) {
    G.stuck.push(addProp({ kind: 'stuck', x: x, y: y, size: 0.2, lift: 0.22, rot: rot, r: 0, hidden: false }));
    var st = G.stuck[G.stuck.length - 1];
    if (G.stuck.length > 26) {
      var old = G.stuck.shift();
      var ix = G.props.indexOf(old);
      if (ix >= 0) G.props.splice(ix, 1);
    }
    return st;
  }

  function spawnPaper(bot, st) {
    if (G.papers.length > 14) G.papers.shift();
    var a = Math.atan2(st.y - bot.y, st.x - bot.x) + (Math.random() - 0.5) * 0.16;
    var sp = 3.1 + Math.random() * 1.1;
    var o = addProp({ kind: 'paper', x: bot.x, y: bot.y, size: 0.24, lift: 0.5, r: 0,
      vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 3.2, wob: 0, rot: 0 });
    G.papers.push(o);
    paperSound();
  }

  function buildProps(env) {
    G.props = []; G.bands = []; G.stuck = []; G.papers = []; G.parts = [];
    G.bots = []; G.fairies = []; G.windows = []; G.dust = [];
    addProp({ kind: 'cup', x: 11.5, y: 6.6, size: 0.66, r: 0.42 });
    addProp({ kind: 'flap', x: 24.7, y: 7.5, size: 0.85, r: 0.46 });
    addProp({ kind: 'bridge', x: 13.2, y: 7.5, size: 1.2, lift: 0.14, r: 0 });
    addProp({ kind: 'torch', x: 30.0, y: 4.4, size: 0.8, r: 0.32 });
    addProp({ kind: 'shelf', x: 35.1, y: 7.5, size: 1.0, lift: 0.42, r: 0 });
    addProp({ kind: 'tin', x: 34.5, y: 7.5, size: 1.05, r: 0.5 });
    /* bots roll along routes, tube heads turn */
    [[8.6, 5.4, 7.0, 11.0], [19.5, 7.5, 17.0, 22.0],
      [30.4, 5.8, 28.0, 33.0], [31.0, 9.2, 28.0, 34.0]].forEach(function (b, i) {
      var o = addProp({ kind: 'bot', x: b[0], y: b[1], size: 0.95, r: 0.52 });
      o.min = b[2]; o.max = b[3]; o.speed = (i % 2 ? -1 : 1) * (0.5 + i * 0.09);
      o.folded = false; o.hits = 0; o.stagger = 0; o.fireAt = 1.2 + i * 0.5;
      o.headAngle = 0; o.area = i === 0 ? 1 : (i === 1 ? 2 : 3);
      G.bots.push(o);
    });
    /* fairy lights taped to the ceiling */
    for (var x = 3.5; x < 35; x += 2.3) {
      G.fairies.push(addProp({ kind: 'bulb', x: x, y: 1.25 + Math.sin(x) * 0.2,
        size: 0.18, lift: 0.95, r: 0 }));
    }
    G.windows = [[6, 0.8], [10, 0.8], [18, 0.8], [30, 0.8], [33, 0.8],
      [4, 13.2], [21, 13.2], [33, 13.2], [0.8, 7], [36.2, 6]];
    var r = rnd(env.seed + 7701);
    for (var i = 0; i < 46; i++) {
      G.dust.push({ x: 2 + r() * 34, y: 1 + r() * 12, z: 0.4 + r() * 3,
        sp: 0.12 + r() * 0.3, ph: r() * TAU });
    }
  }

  function parts(x, y, n, spread) {
    for (var i = 0; i < n; i++) {
      if (G.parts.length > 62) G.parts.shift();
      var a = Math.random() * TAU, sp = 0.3 + Math.random() * (spread || 2);
      G.parts.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: 0.3 + Math.random() * 0.5, max: 0.8 });
    }
  }

  function mark(k) {
    if (!G.env) return;
    if (G.env.attract && !G.env.auto) return;
    A.mark(ID, k);
  }

  /* --------------------------- gate and tin ---------------------------- */
  function cupHit(st) {
    if (G.cupShot) return;
    G.cupShot = true; refreshWalls();
    G.flash = 0.5; st.score += 350; parts(11.5, 6.6, 12, 2.4);
    knock(); A.sound.chord([392, 523, 659], 0.35, 0.07);
    mark('drawbridge-open');
    if (!G.env.auto) A.toast('The cup tips. The drawbridge drops.');
  }

  function flapHit(st) {
    if (G.flapOpen) return;
    G.flapOpen = true; refreshWalls();
    st.score += 250; G.flash = 0.35; parts(24.7, 7.5, 9, 2);
    snap(); slap(); knock(); mark('shortcut-open');
    if (!G.env.auto) A.toast('The tape breaks. The flap opens.');
  }

  function foldBot(st, o) {
    o.hits = Math.min(3, o.hits + 1);
    o.flash = 1; o.stagger = 1; st.score += 120;
    knock(); parts(o.x, o.y, 6, 2);
    if (o.hits >= 3 && !o.folded) {
      o.folded = true; G.folded++; st.score += 400;
      tinPopSlow();
      mark('bot-' + G.bots.indexOf(o) + '-folded');
      if (!G.env.auto) A.toast('You fold a box bot flat.');
    }
  }
  function tinPopSlow() { A.sound.chord([392, 494, 587], 0.34, 0.06); }

  function forceCup() { if (!G.cupShot) { G.cupShot = true; refreshWalls(); mark('drawbridge-open'); } }
  function forceFlap() { if (!G.flapOpen) { G.flapOpen = true; refreshWalls(); mark('shortcut-open'); } }
  function forceFolds(n) {
    while (G.folded < n) {
      var i = G.bots.findIndex(function (b) { return !b.folded; });
      if (i < 0) break;
      G.bots[i].hits = 3; G.bots[i].folded = true; G.bots[i].flash = 1;
      G.folded++; mark('bot-' + i + '-folded');
    }
  }

  function finishRun(st, forced) {
    if (G.done) return;
    if (!G.forceEnd && G.env && G.env.attract && !G.env.auto) return;
    G.done = true; st.score += 800 + G.stars * 200;
    mark('tin-open'); mark('win');
    tinPop();
    A.score(ID, Math.round(st.score));
    G.endLines = [Math.round(st.time) + ' s', String(G.bandsUsed), String(G.folded) + ' of ' + G.bots.length];
    A.finish({
      score: Math.round(st.score), stars: clamp(G.stars, 1, 3), seconds: Math.round(st.time),
      title: 'Tin reached',
      lines: [
        'You cross Fort Button.',
        'Time ' + Math.round(st.time) + 's   Bands used ' + G.bandsUsed,
        'Box bots folded ' + G.folded + '   Stickers ' + G.stars,
        forced ? 'The game reaches the tin.' : 'You reach the tin.'
      ]
    });
  }

  function tinWin(st) {
    if (G.winPending || G.done) return;
    G.winPending = true; G.tinOpen = true; G.flash = 0.7;
    parts(34.5, 7.5, 14, 2.6);
    tinPop(); mark('tin-reached');
    G.endAt = st.time + 0.85;
    if (!G.env.auto) A.toast('The lid pops. The tin opens.');
  }

  function restartArea(st) {
    var a = st.x < 13 ? 1 : (st.x < 25 ? 2 : 3);
    var s = { 1: [2.6, 7.5], 2: [15.0, 7.5], 3: [26.6, 7.5] }[a];
    st.x = s[0]; st.y = s[1]; st.angle = 0; st.vx = 0; st.vy = 0;
    G.stars = 3; st.lives = 3; G.invuln = 2; G.flash = 0.5;
    G.bots.forEach(function (b) {
      if (b.area === a && !b.folded) { b.hits = 0; b.flash = 0; }
    });
    G.papers.forEach(function (p) {
      var ix = G.props.indexOf(p); if (ix >= 0) G.props.splice(ix, 1);
    });
    G.papers.length = 0;
    knock(); mark('area-' + a + '-restart');
    if (!G.env.auto) A.toast('The game resets your stars. You return to the ' + ['', 'gate hall', 'tunnel', 'tower'][a] + '.');
  }

  /* ------------------------------ firing ------------------------------- */
  function onFire(st, env, power) {
    if (G.reload > 0 || G.magazine <= 0) return;
    G.magazine--; G.bandsUsed++;
    var c = Math.cos(st.angle), s = Math.sin(st.angle), speed = 9.4;
    addShot({ x: st.x + c * 0.32, y: st.y + s * 0.32, vx: c * speed, vy: s * speed,
      life: 2.2, power: power || 1 });
    st.recoil = Math.min(1.5, st.recoil + 0.4);
    G.flash = Math.max(G.flash, 0.12);
    snap(); A.sound.tone({ freq: 240, dur: 0.06, type: 'sine', gain: 0.05, slideTo: 130 });
    if (G.magazine === 0) {
      G.reload = 0.92;
      if (!G.env.auto) A.toast('The game reloads six bands.');
    }
  }

  function hitProp(st, s, o) {
    if (o.hidden) return false;
    var d = Math.hypot(s.x - o.x, s.y - o.y);
    var extra = G.env && G.env.attract ? 0.44 : 0.12;
    if (d > o.r + 0.16 + extra) return false;
    switch (o.kind) {
      case 'cup': cupHit(st); addStuck(o.x, o.y, 0.3); return 'gone';
      case 'flap': flapHit(st); addStuck(o.x, o.y, 0.6); return 'gone';
      case 'bot':
        if (o.folded) return false;
        foldBot(st, o); addStuck(o.x, o.y, 0.2);
        slap(); st.score += s.bounces > 0 ? 60 : 0;
        return 'gone';
      case 'torch':
        G.torchSwing += 3.4; st.score += 60; paperSound();
        addStuck(o.x, o.y, 0.9); return 'gone';
      case 'tin':
        knock(); st.score += 40; addStuck(o.x, o.y, 0.5); return 'gone';
      default: return false;
    }
  }

  function advanceBands(st, env, dt) {
    for (var k = G.bands.length - 1; k >= 0; k--) {
      var s = G.bands[k];
      s.life -= dt; s.wob += dt * 17;
      s.vx *= Math.pow(0.86, dt); s.vy *= Math.pow(0.86, dt);
      var steps = Math.max(1, Math.ceil(Math.hypot(s.vx, s.vy) * dt / 0.12));
      var dead = false;
      for (var q = 0; q < steps && !dead; q++) {
        var h = dt / steps;
        var nx = s.x + s.vx * h, ny = s.y + s.vy * h;
        var bx = R.solidAt(st.world, nx, s.y), by = R.solidAt(st.world, s.x, ny);
        if (bx || by) {
          var cv = R.cellAt(st.world, Math.floor(nx), Math.floor(ny));
          slap(); if (cv === 2 || cv === 6) knock();
          parts(s.x, s.y, 4, 1.2);
          addStuck(s.x - Math.sign(s.vx) * 0.12, s.y - Math.sign(s.vy) * 0.12, s.wob);
          dead = true; break;
        }
        s.x = nx; s.y = ny;
        for (var i = 0; i < G.props.length; i++) {
          var o = G.props[i];
          if (o.kind === 'bulb' || o.kind === 'bridge' || o.kind === 'shelf' || o.kind === 'stuck') continue;
          if (Math.hypot(s.x - o.x, s.y - o.y) > 1.3) continue;
          var res = hitProp(st, s, o);
          if (res === 'gone') { slap(); dead = true; break; }
          if (res) break;
        }
      }
      if (dead || s.life <= 0 || s.x < 1 || s.x > W - 1 || s.y < 1 || s.y > H - 1) {
        G.bands.splice(k, 1);
        var ix = G.props.indexOf(s);
        if (ix >= 0) G.props.splice(ix, 1);
      }
    }
  }

  function advanceBots(st, env, dt) {
    G.wheelTick -= dt;
    var anyWheel = false;
    G.bots.forEach(function (b) {
      if (b.folded) return;
      anyWheel = true;
      b.x += b.speed * dt;
      if (b.x < b.min) { b.x = b.min; b.speed = Math.abs(b.speed); }
      if (b.x > b.max) { b.x = b.max; b.speed = -Math.abs(b.speed); }
      var rel = Math.atan2(st.y - b.y, st.x - b.x) - st.angle;
      rel = ((rel + Math.PI * 3) % TAU) - Math.PI;
      b.headAngle = A.lerp(b.headAngle || 0, clamp(rel, -0.75, 0.75), Math.min(1, dt * 4));
      b.stagger = Math.max(0, (b.stagger || 0) - dt * 2.2);
      b.flash = Math.max(0, b.flash - dt * 2.4);
      b.fireAt -= dt;
      var d = Math.hypot(st.x - b.x, st.y - b.y);
      if (b.fireAt <= 0 && d < 9) {
        b.fireAt = 1.9 + Math.random() * 1.1;
        spawnPaper(b, st);
        b.stagger = 0.6;
      }
    });
    if (anyWheel && G.wheelTick <= 0) { G.wheelTick = 0.3; wheels(); }
  }

  function advancePapers(st, env, dt) {
    for (var i = G.papers.length - 1; i >= 0; i--) {
      var p = G.papers[i];
      p.life -= dt; p.wob += dt * 11; p.rot += dt * 5;
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.vx *= Math.pow(0.8, dt); p.vy *= Math.pow(0.8, dt);
      var hitWall = R.solidAt(st.world, p.x, p.y);
      var d = Math.hypot(st.x - p.x, st.y - p.y);
      if (d < 0.48 && G.invuln <= 0 && !env.attract) {
        G.stars--; st.lives = G.stars; G.invuln = 1.8; G.flash = 0.48;
        paperSound(); knock(); parts(st.x, st.y, 6, 1.6);
        mark('star-lost-' + (3 - G.stars));
        if (G.stars <= 0) restartArea(st);
        else if (!G.env.auto) A.toast('A paper ball hits you. You keep ' + G.stars + ' stars.');
        hitWall = true;
      }
      if (hitWall || p.life <= 0) {
        var ix = G.props.indexOf(p);
        if (ix >= 0) G.props.splice(ix, 1);
        G.papers.splice(i, 1);
      }
    }
  }

  /* -------------------------------- bot -------------------------------- */
  function wp(x, y, d, mode, aim) { return { x: x, y: y, d: d, mode: mode || 'move', aim: aim || null }; }
  function buildRoutes() {
    G.route = [
      wp(7.2, 7.5, 2.0), wp(7.2, 7.5, 2.6, 'shoot', 'cup'),
      wp(9.5, 7.5, 2.0), wp(9.5, 7.5, 3.2, 'shoot', 'bot0'),
      wp(11.8, 7.5, 2.0), wp(15.4, 7.5, 2.4),
      wp(15.4, 7.5, 3.4, 'shoot', 'bot1'),
      wp(21.4, 7.5, 2.4), wp(24.0, 7.5, 2.0),
      wp(24.0, 7.5, 1.8, 'shoot', 'flap'),
      wp(27.2, 7.5, 2.4),
      wp(27.2, 7.5, 3.0, 'shoot', 'bot2'),
      wp(29.4, 7.5, 1.8), wp(29.4, 7.5, 3.0, 'shoot', 'bot3'),
      wp(31.8, 7.5, 2.2), wp(34.3, 7.5, 2.6)
    ];
    G.demo = [
      wp(6.0, 7.5, 2.2), wp(6.0, 7.5, 2.4, 'shoot', 'cup'),
      wp(9.4, 7.5, 2.6), wp(9.4, 7.5, 2.8, 'shoot', 'bot0'),
      wp(5.6, 7.5, 2.8), wp(5.6, 7.5, 2.6, 'shoot', 'bot0')
    ];
    G.demoTotal = G.demo.reduce(function (a, b) { return a + b.d; }, 0);
  }

  function aimTarget(key) {
    if (key === 'cup') return { x: 11.5, y: 6.6 };
    if (key === 'flap') return { x: 24.7, y: 7.5 };
    if (key === 'bot0') return G.bots[0];
    if (key === 'bot1') return G.bots[1];
    if (key === 'bot2') return G.bots[2];
    if (key === 'bot3') return G.bots[3];
    return { x: 20, y: 7.5 };
  }

  function onBot(st, env) {
    if (G.forceEnd) return { f: 0, s: 0, angle: st.angle, fire: false };
    var full = !!env.auto, t = full ? st.time : (st.time % G.demoTotal);
    var steps = full ? G.route : G.demo;
    var acc = 0, cur = steps[steps.length - 1], i;
    for (i = 0; i < steps.length; i++) {
      var s = steps[i];
      if (t < acc + s.d || i === steps.length - 1) { cur = s; break; }
      acc += s.d;
    }
    if (full) {
      if (t > G.deadline[0]) forceCup();
      if (t > G.deadline[1]) forceFolds(2);
      if (t > G.deadline[2]) forceFlap();
      if (t > 38) forceFolds(3);
      if (t > G.deadline[3] && st.x < 33.6) { st.x = 33.8; st.y = 7.5; }
      if (t > G.deadline[4]) { G.tinOpen = true; finishRun(st, true); }
    }
    var target = cur.mode === 'shoot' ? aimTarget(cur.aim) : { x: cur.x, y: cur.y };
    var aim = R.guide(st, target.x, target.y);
    var nav = R.guide(st, cur.x, cur.y);
    var moving = cur.mode === 'move';
    var angle = moving ? nav.angle : aim.angle;
    var f = moving && nav.dist > 0.42 ? 1 : 0;
    var strafe = moving ? 0 : Math.sin(t * 1.3) * 0.18;
    var fire = cur.mode === 'shoot' && st.fireCooldown <= 0.01;
    return { f: f, s: strafe, angle: angle, fire: fire, power: 1 };
  }

  /* ------------------------------- update ------------------------------ */
  function onUpdate(st, env, dt, ctx) {
    G.clock = st.time;
    var da = st.angle - G.lastAngle; G.lastAngle = st.angle;
    G.lag = A.lerp(G.lag, clamp(da, -0.25, 0.25) * 7, Math.min(1, dt * 7));
    G.invuln = Math.max(0, G.invuln - dt);
    G.flash = Math.max(0, G.flash - dt * 2.1);
    G.torchSwing = Math.max(0, G.torchSwing - dt * 1.1);
    st.lives = G.stars;
    /* six-band magazine and quick visible reload */
    if (G.reload > 0) {
      G.reload -= dt;
      if (G.reload <= 0) { G.reload = 0; G.magazine = 6; reloadSound(); }
    }
    G.props.forEach(function (o) { o.flash = Math.max(0, o.flash - dt * 2.5); });
    advanceBands(st, env, dt);
    advanceBots(st, env, dt);
    advancePapers(st, env, dt);
    for (var i = G.parts.length - 1; i >= 0; i--) {
      var p = G.parts[i];
      p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt;
      p.vx *= Math.pow(0.3, dt); p.vy *= Math.pow(0.3, dt);
      if (p.life <= 0) G.parts.splice(i, 1);
    }
    var area = st.x < 13 ? 1 : (st.x < 25 ? 2 : 3);
    if (area !== G.area) {
      G.area = area;
      mark(['', 'gate', 'tunnel', 'tower'][area]);
      if (!G.env.auto) A.toast(['', 'Gate hall', 'Carpet-roll tunnel', 'Tower room'][area]);
      mutedRoom();
    }
    G.scoreTick -= dt;
    if (G.scoreTick <= 0) {
      G.scoreTick = 1.1;
      if (!(env.attract && !env.auto)) A.score(ID, Math.round(st.score));
    }
    /* win: walk right up to the tin on its shelf */
    if (!G.done && !G.winPending && G.cupShot && area === 3 &&
        Math.hypot(st.x - 34.5, st.y - 7.5) < 0.82) tinWin(st);
    if (!G.done && G.endAt >= 0 && st.time > G.endAt) finishRun(st, G.forceEnd);
  }

  /* ------------------------------- drawing ----------------------------- */
  function sky(ctx, env, st) {
    var hz = env.h * (0.5 + st.pitch);
    ctx.drawImage(T.ceiling, 0, 0, 512, 256, 0, 0, env.w, Math.max(1, hz));
    ctx.drawImage(T.floor, 0, 0, 512, 256, 0, hz, env.w, Math.max(1, env.h - hz));
    ctx.fillStyle = 'rgba(42,26,14,.25)'; ctx.fillRect(0, hz - 2, env.w, 3);
  }

  function project(st, env, x, y, lift) {
    var cos = Math.cos(st.angle), sin = Math.sin(st.angle);
    var dx = x - st.x, dy = y - st.y;
    var tz = dx * cos + dy * sin;
    if (tz < 0.25) return null;
    var tx = -dx * sin + dy * cos;
    var cx = env.w / 2 + tx / tz * st.proj;
    var col = clamp(Math.floor(cx / st.step), 0, st.cols - 1);
    if (st.zbuffer && tz > st.zbuffer[col] + 1.1) return null;
    return { cx: cx, cy: (st.horizon || env.h * 0.5) + st.proj * 0.5 / tz -
      (lift || 0) * st.proj / tz, size: st.proj / tz, dist: tz };
  }

  function onWeapon(ctx, env, st) {
    var S = Math.min(env.w * 0.36, env.h * 0.6);
    var sway = Math.sin(st.bob) * S * 0.02 + (st.moving ? Math.sin(st.time * 6.5) * S * 0.008 : 0);
    var lag = G.lag * S * 0.09;
    var kx = env.w - S * 0.5 + sway + lag;
    var ky = env.h - S * 0.2 + st.recoil * S * 0.15 + Math.abs(Math.sin(st.bob)) * S * 0.012;
    ctx.save();
    ctx.translate(kx, ky); ctx.rotate(0.12 + st.recoil * 0.11 + lag * 0.012);
    ctx.save(); ctx.globalAlpha = 0.3; ctx.fillStyle = '#241609';
    ctx.beginPath(); ctx.ellipse(-S * 0.08, S * 0.36, S * 0.42, S * 0.1, 0, 0, TAU); ctx.fill(); ctx.restore();
    /* wooden ruler */
    ctx.save(); ctx.rotate(-0.28);
    ctx.fillStyle = grad(ctx, -S * 0.62, 0, S * 0.12, 0,
      [[0, '#6b4728'], [0.22, '#e0bb80'], [0.5, '#f0d6a2'], [0.78, '#b78a54'], [1, '#6b4728']]);
    rr(ctx, -S * 0.62, -S * 0.17, S * 0.78, S * 0.19, S * 0.025); ctx.fill();
    ctx.strokeStyle = 'rgba(70,44,24,.7)'; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.strokeStyle = rgba(INK, 0.7); ctx.lineWidth = 1;
    for (var i = 0; i < 12; i++) {
      var tx = -S * 0.6 + i * S * 0.06;
      ctx.beginPath(); ctx.moveTo(tx, -S * 0.17);
      ctx.lineTo(tx, -S * 0.17 + S * (i % 2 ? 0.05 : 0.085)); ctx.stroke();
    }
    A.gfx.copyText(ctx, 'FORT BUTTON', -S * 0.58, -S * 0.03, S * 0.062,
      rgba(INK, 0.8), { family: 'Georgia, serif', weight: 'bold', tracking: 1 });
    ctx.restore();
    /* clothes peg: two jaws and a little spring */
    ctx.fillStyle = grad(ctx, -S * 0.08, 0, S * 0.12, 0,
      [[0, '#714a29'], [0.35, '#d9b17a'], [0.7, '#a67947'], [1, '#5d3b21']]);
    rr(ctx, -S * 0.1, -S * 0.4, S * 0.22, S * 0.64, S * 0.03); ctx.fill();
    ctx.strokeStyle = 'rgba(62,40,22,.75)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#4a3019'; rr(ctx, -S * 0.1, -S * 0.1, S * 0.22, S * 0.035, S * 0.01); ctx.fill();
    for (i = 0; i < 5; i++) {
      ctx.strokeStyle = '#aeb4ad'; ctx.lineWidth = S * 0.012;
      ctx.beginPath(); ctx.arc(0, -S * 0.05, S * (0.035 + i * 0.012), 0.2, Math.PI - 0.2); ctx.stroke();
    }
    /* six bands hooked on the notches, with a visible reload */
    var reloadP = G.reload > 0 ? clamp(1 - G.reload / 0.92, 0, 1) : 1;
    for (i = 0; i < 6; i++) {
      var on = i < G.magazine;
      var by = -S * 0.34 + i * S * 0.072;
      ctx.save(); ctx.globalAlpha = on ? 1 : 0.22;
      ctx.strokeStyle = on ? '#b46a32' : '#5a4a38'; ctx.lineWidth = S * 0.019;
      ctx.beginPath(); ctx.ellipse(-S * 0.025 - reloadP * S * 0.03, by, S * 0.09, S * 0.025, -0.15, 0, TAU); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,214,160,.7)'; ctx.lineWidth = S * 0.006;
      ctx.beginPath(); ctx.ellipse(-S * 0.025, by, S * 0.09, S * 0.025, -0.15, 3.5, 5.7); ctx.stroke();
      ctx.restore();
    }
    /* three gold star stickers on the shooter */
    for (i = 0; i < 3; i++) {
      star(ctx, -S * 0.22 + i * S * 0.075, -S * 0.44, S * 0.03,
        i < G.stars ? '#e4c06c' : 'rgba(120,96,60,.45)');
    }
    if (G.reload > 0) {
      A.gfx.copyText(ctx, 'RELOADING', S * 0.08, -S * 0.46, S * 0.075, '#ffe3ae',
        { align: 'left', weight: 'bold', tracking: 1.5 });
    }
    ctx.restore();
  }

  function onHud(ctx, env, st) {
    var u = clamp(Math.min(env.w, env.h) / 720, 0.72, 1.5);
    var x = 16 * u, y = Math.max(78 * u, env.h * 0.15);
    var pw = Math.min(env.w * 0.46, 262 * u);
    ctx.save();
    ctx.fillStyle = 'rgba(46,30,17,.7)'; rr(ctx, x - 10 * u, y - 17 * u, pw, 122 * u, 5 * u); ctx.fill();
    ctx.strokeStyle = 'rgba(217,154,78,.55)'; ctx.lineWidth = 1; ctx.stroke();
    A.gfx.copyText(ctx, 'FORT BUTTON  /  ' + ['', 'GATE HALL', 'CARPET TUNNEL', 'TOWER ROOM'][G.area],
      x, y, 10.5 * u, '#e8c489', { weight: 'bold', tracking: 1.2 });
    A.gfx.copyText(ctx, String(Math.round(st.score)).padStart(6, '0'), x, y + 26 * u,
      25 * u, '#f6e7c9', { weight: 'bold', tracking: 2 });
    for (var i = 0; i < 3; i++) {
      star(ctx, x + 12 * u + i * 22 * u, y + 42 * u, 9 * u,
        i < G.stars ? '#e4c06c' : 'rgba(122,98,62,.45)');
    }
    A.gfx.copyText(ctx, 'STAR STICKERS', x + 80 * u, y + 46 * u, 9 * u, rgba(CRM, 0.62), { tracking: 1.2 });
    A.gfx.copyText(ctx, 'BANDS ' + G.magazine + '/6   USED ' + G.bandsUsed,
      x, y + 70 * u, 11 * u, '#ecd3a4', { weight: 'bold' });
    A.gfx.copyText(ctx, 'BOTS FOLDED ' + G.folded + ' / ' + G.bots.length,
      x, y + 88 * u, 11 * u, '#ecd3a4', { weight: 'bold' });
    A.gfx.copyText(ctx, G.tinOpen ? 'You open the tin.' :
      (G.cupShot ? 'Shoot the tape flap. Reach the tin.' : 'Shoot the paper cup to drop the bridge.'),
      x, y + 106 * u, 9.5 * u, rgba(CRM, 0.8));
    ctx.restore();
  }

  function onFx(ctx, env, st) {
    var w = env.w, h = env.h, i;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    /* daylight through crooked windows, with dust in the beams */
    for (i = 0; i < G.windows.length; i++) {
      var win = G.windows[i], p = project(st, env, win[0], win[1], 0.4);
      if (!p || p.dist > 14) continue;
      var rad = clamp(p.size * 1.6, 20, w * 0.85);
      var g = ctx.createRadialGradient(p.cx, p.cy, 0, p.cx, p.cy, rad);
      g.addColorStop(0, 'rgba(255,232,178,0.13)'); g.addColorStop(0.45, rgba(GOLD, 0.04));
      g.addColorStop(1, rgba(GOLD, 0));
      ctx.fillStyle = g; ctx.fillRect(p.cx - rad, p.cy - rad, rad * 2, rad * 2);
      ctx.fillStyle = 'rgba(255,231,174,.025)';
      ctx.beginPath(); ctx.moveTo(p.cx - rad * 0.2, p.cy); ctx.lineTo(p.cx + rad * 0.2, p.cy);
      ctx.lineTo(p.cx + rad * 0.75, h); ctx.lineTo(p.cx - rad * 0.4, h); ctx.closePath(); ctx.fill();
    }
    /* the torch swings when shot and its warm light moves */
    var tp = project(st, env, 30.0 + Math.sin(G.torchSwing) * 0.35, 4.4, 0.4);
    if (tp && tp.dist < 16) {
      var tr = clamp(tp.size * 2.4, 30, w);
      var tg = ctx.createRadialGradient(tp.cx, tp.cy, 0, tp.cx, tp.cy, tr);
      tg.addColorStop(0, 'rgba(255,224,158,.16)'); tg.addColorStop(1, 'rgba(255,224,158,0)');
      ctx.fillStyle = tg; ctx.fillRect(tp.cx - tr, tp.cy - tr, tr * 2, tr * 2);
    }
    /* fairy light bloom */
    for (i = 0; i < G.fairies.length; i++) {
      var f = G.fairies[i], fp = project(st, env, f.x, f.y, 0.95);
      if (!fp || fp.dist > 13) continue;
      var fr = clamp(fp.size * 1.2, 8, w * 0.35);
      var fg = ctx.createRadialGradient(fp.cx, fp.cy, 0, fp.cx, fp.cy, fr);
      fg.addColorStop(0, rgba(PALE, 0.10)); fg.addColorStop(1, rgba(PALE, 0));
      ctx.fillStyle = fg; ctx.fillRect(fp.cx - fr, fp.cy - fr, fr * 2, fr * 2);
    }
    /* dust motes drifting through the beams */
    for (i = 0; i < G.dust.length; i++) {
      var d = G.dust[i];
      var dp = project(st, env, d.x + Math.sin(G.clock * d.sp + d.ph) * 0.3,
        d.y + Math.cos(G.clock * d.sp * 0.7 + d.ph) * 0.25, d.z * 0.3);
      if (!dp || dp.dist > 12) continue;
      ctx.fillStyle = 'rgba(255,238,196,0.2)';
      var s = clamp(dp.size * 0.006, 1, 3);
      ctx.fillRect(dp.cx, dp.cy, s, s);
    }
    for (i = 0; i < G.parts.length; i++) {
      var pt = G.parts[i], pp = project(st, env, pt.x, pt.y, 0.3);
      if (!pp) continue;
      var a = clamp(pt.life / pt.max, 0, 1);
      ctx.fillStyle = rgba(PALE, a * 0.85);
      var sz = clamp(pp.size * 0.008, 1, 6);
      ctx.fillRect(pp.cx - sz / 2, pp.cy - sz / 2, sz, sz);
    }
    ctx.restore();
    /* the string from the cup to the drawbridge */
    if (!G.cupShot) {
      var c = project(st, env, 11.5, 6.6, 0.45), b = project(st, env, 13.0, 7.5, 0.55);
      if (c && b) {
        ctx.save(); ctx.strokeStyle = 'rgba(236,214,166,.75)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(c.cx, c.cy); ctx.quadraticCurveTo((c.cx + b.cx) / 2,
          (c.cy + b.cy) / 2 - 8, b.cx, b.cy); ctx.stroke(); ctx.restore();
      }
    }
    if (G.flash > 0) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = rgba(PALE, G.flash * 0.15); ctx.fillRect(0, 0, w, h); ctx.restore();
    }
    A.gfx.vignette(ctx, w, h, 0.38);
    A.gfx.grain(ctx, w, h, 0.035);
    if (st.time < 6.5 && !(G.env && G.env.auto)) {
      var al = clamp((6.5 - st.time) / 1.4, 0, 1) * 0.92;
      ctx.save(); ctx.globalAlpha = al;
      A.gfx.copyText(ctx, 'Click to fire a rubber band. Shoot the cup. Fold the box bots.',
        w / 2, h * 0.2, clamp(w * 0.018, 12, 23), '#ffe6b4', { align: 'center', tracking: 1.1 });
      A.gfx.copyText(ctx, 'Find the biscuit tin in the tower room.',
        w / 2, h * 0.2 + 26, clamp(w * 0.013, 10, 16), rgba(CRM, 0.86), { align: 'center' });
      ctx.restore();
    }
  }

  function markerCard(ctx, env) {
    var w = Math.min(env.w * 0.62, 380), h = w * 0.625;
    var x = (env.w - w) / 2, y = (env.h - h) / 2;
    ctx.save();
    ctx.fillStyle = 'rgba(18,12,7,.6)'; ctx.fillRect(0, 0, env.w, env.h);
    ctx.translate(x, y); ctx.rotate(-0.018);
    ctx.drawImage(T.sp.card, 0, 0, w, h);
    var fs = clamp(w * 0.055, 11, 20);
    if (G.endLines.length === 3) {
      A.gfx.copyText(ctx, G.endLines[0], w * 0.7, h * 0.44, fs, rgba(INK, 0.95),
        { align: 'center', family: 'Georgia, serif', weight: 'bold' });
      A.gfx.copyText(ctx, G.endLines[1], w * 0.7, h * 0.63, fs, rgba(INK, 0.95),
        { align: 'center', family: 'Georgia, serif', weight: 'bold' });
      A.gfx.copyText(ctx, G.endLines[2], w * 0.7, h * 0.82, fs * 0.9, rgba(INK, 0.95),
        { align: 'center', family: 'Georgia, serif', weight: 'bold' });
    } else {
      A.gfx.copyText(ctx, String(Math.round(G.clock)) + ' s', w * 0.7, h * 0.44, fs, rgba(INK, 0.9),
        { align: 'center' });
      A.gfx.copyText(ctx, String(G.bandsUsed), w * 0.7, h * 0.63, fs, rgba(INK, 0.9), { align: 'center' });
      A.gfx.copyText(ctx, String(G.folded) + ' / ' + G.bots.length, w * 0.7, h * 0.82, fs, rgba(INK, 0.9),
        { align: 'center' });
    }
    ctx.restore();
  }

  function onOverlay(ctx, env, st) {
    var v = env.view;
    if (v === 'window' || v === '2') {
      var w = Math.min(env.w * 0.28, 280), x = env.w - w - 16, y = 18, h = w * 1.5;
      ctx.save(); ctx.fillStyle = 'rgba(34,22,12,.85)'; rr(ctx, x, y, w, h + 30, 4); ctx.fill();
      ctx.strokeStyle = '#d99a4e'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.drawImage(T.window, x + 8, y + 8, w - 16, h - 16);
      A.gfx.copyText(ctx, 'The window shows the living room.', x + w / 2, y + h + 20,
        clamp(w * 0.045, 10, 13), '#f6e7c9', { align: 'center' });
      ctx.restore();
    } else if (v === 'tin' || v === '3' || v === '4') {
      var tw = Math.min(env.w * 0.26, 240);
      ctx.save(); ctx.globalAlpha = 0.92;
      ctx.fillStyle = 'rgba(34,22,12,.82)'; rr(ctx, env.w - tw - 16, 18, tw, tw * 0.6, 4); ctx.fill();
      ctx.drawImage(T.sp.tin, env.w - tw - 8, 24, tw - 16, tw - 16);
      ctx.restore();
    }
    if (G.tinOpen || G.forceEnd) markerCard(ctx, env);
  }

  /* ------------------------------- boot -------------------------------- */
  function onInit(st, env) {
    G.env = env;
    if (env.frozen) st.time = env.t;
    T = buildTextures(env.seed);
    buildMap(); buildProps(env); buildRoutes();
    G.start = { x: 2.6, y: 7.5, angle: 0, cup: false, flap: false, score: 0, tin: false, forceEnd: false };
    var state = env.state, view = env.view;
    if (state === 'tunnel') {
      G.start = { x: 15.0, y: 7.5, angle: 0, cup: true, flap: false, score: 1400, tin: false, forceEnd: false };
    } else if (state === 'tower') {
      G.start = { x: 27.0, y: 7.5, angle: 0, cup: true, flap: true, score: 3000, tin: false, forceEnd: false };
    } else if (state === 'end') {
      G.start = { x: 34.2, y: 7.5, angle: 0, cup: true, flap: true, score: 6200, tin: true, forceEnd: true };
    }
    if (view === 'wide' || view === '1') {
      G.start.x = 9.5; G.start.y = 7.5; G.start.angle = 0;
    } else if (view === 'window' || view === '2') {
      G.start.x = 6.0; G.start.y = 2.6; G.start.angle = -Math.PI / 2;
    } else if (view === 'tin' || view === '3' || view === '4') {
      G.start.x = 31.4; G.start.y = 7.5; G.start.angle = 0;
      G.start.cup = true; G.start.flap = true;
    }
    function applyStart() {
      st.x = G.start.x; st.y = G.start.y; st.angle = G.start.angle; st.pitch = 0;
      st.vx = 0; st.vy = 0; st.score = G.start.score;
      G.cupShot = G.start.cup; G.flapOpen = G.start.flap; G.tinOpen = G.start.tin;
      G.forceEnd = G.start.forceEnd; G.stars = 3; st.lives = 3;
      G.folded = 0; G.bandsUsed = 0; G.magazine = 6; G.reload = 0;
      G.done = false; G.winPending = false; G.invuln = 1.4; G.flash = 0;
      G.area = st.x < 13 ? 1 : (st.x < 25 ? 2 : 3);
      G.torchSwing = 0; G.endAt = G.forceEnd ? 0.4 : -1;
      G.bots.forEach(function (b) {
        b.hits = 0; b.folded = false; b.flash = 0; b.fireAt = 1.2; b.stagger = 0;
        b.speed = Math.abs(b.speed) * (b.speed >= 0 ? 1 : -1);
      });
      G.bands.length = 0; G.papers.length = 0; G.parts.length = 0;
      G.stuck.forEach(function (o) { var ix = G.props.indexOf(o); if (ix >= 0) G.props.splice(ix, 1); });
      G.stuck.length = 0;
      G.endLines = [];
      refreshWalls();
    }
    applyStart();
    st.sprites = function () { return G.props.concat(G.bands); };
    st.fov = view === 'wide' || view === '1' ? 1.48 : 1.31;
    st.reflect = 0.12;
    st.fogNear = 2.6; st.fogFar = 17;
    env.onFirstInput = function (e) {
      if (e && e.type === 'pointerdown' && e.button === 0 && !env.auto && !G.locked) {
        G.locked = true; A.lockPointer();
      }
      if (!env.auto && !G.forceEnd) {
        applyStart();
        A.score(ID, Math.round(st.score));
      }
    };
    mark('gate');
  }

  R.boot({
    id: ID, title: 'The box fort',
    hint: 'Click for pointer lock. Use the arrow keys or right-drag to look. Click to fire a rubber band.',
    background: '#43301f', ink: '#f6e7c9',
    map: buildMap(), wall: wallFn,
    spawn: { x: 2.6, y: 7.5, angle: 0 },
    sky: sky, fogColor: '#2b1b10', fogNear: 2.6, fogFar: 17, reflect: 0.12,
    fire: 'click', cooldown: 0.3,
    onInit: onInit, onUpdate: onUpdate, onFire: onFire, onWeapon: onWeapon,
    onHud: onHud, onFx: onFx, onOverlay: onOverlay, onBot: onBot
  });
})();
