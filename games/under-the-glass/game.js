(function () {
  'use strict';

  var A = window.Arcade, R = window.Raycaster, TAU = Math.PI * 2;
  var ID = 'under-the-glass', W = 40, H = 15, WORD = 'ZIMO', FRAMES = 6;
  var OR = '224,105,47', CY = '84,179,196', WARM = '255,196,110', CRM = '243,227,196';
  function rgba(c, a) { return 'rgba(' + c + ',' + a + ')'; }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function rnd(n) { return A.rng(n >>> 0); }
  function tex(w, h, fn) { return A.gfx.offscreen(w, h, fn); }
  function rr(g, x, y, w, h, r) { A.gfx.rr(g, x, y, w, h, r); }
  function grad(g, x0, y0, x1, y1, stops) { return A.gfx.linear(g, x0, y0, x1, y1, stops); }

  function screw(g, x, y, r) {
    var gr = g.createRadialGradient(x - r * 0.35, y - r * 0.4, 0, x, y, r);
    gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.28, '#d5dee1');
    gr.addColorStop(0.68, '#6c757b'); gr.addColorStop(1, '#24282d');
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(12,10,14,.8)'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(x - r * 0.62, y + r * 0.1); g.lineTo(x + r * 0.62, y - r * 0.1); g.stroke();
  }

  /* ------------------------- hand-made wall textures ------------------- */
  function basePly(g, w, h, r, level) {
    g.fillStyle = grad(g, 0, 0, 0, h, [[0, '#170b10'], [0.16, '#3d1d16'], [0.52, '#4e2618'],
      [0.83, '#281212'], [1, '#11090d']]);
    g.fillRect(0, 0, w, h);
    g.save(); g.translate(w * 0.48, h * 0.78);
    for (var i = 0; i < 13; i++) {
      var a = -3.05 + i * 0.205;
      g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * 190, Math.sin(a) * 190);
      g.strokeStyle = rgba(CRM, 0.035 + r() * 0.035); g.lineWidth = 0.8 + r() * 1.6; g.stroke();
    }
    for (var j = 0; j < 4; j++) {
      g.beginPath(); g.arc(0, 0, 34 + j * 29, -2.75, -0.45);
      g.strokeStyle = rgba(OR, 0.10 + j * 0.015); g.lineWidth = 1.2 + r(); g.stroke();
    }
    g.restore();
    /* ball tracks worn into the lacquer */
    for (i = 0; i < 3; i++) {
      var off = 34 + i * 46;
      g.beginPath(); g.moveTo(-8, off);
      g.bezierCurveTo(w * 0.28, off - 22, w * 0.6, off + 26, w + 8, off - 9);
      g.strokeStyle = 'rgba(18,7,10,.46)'; g.lineWidth = 4.6; g.stroke();
      g.strokeStyle = rgba(CRM, 0.11); g.lineWidth = 1.1; g.stroke();
    }
    /* printed star field and mylar patches */
    for (i = 0; i < 26; i++) {
      var sx = r() * w, sy = r() * h;
      A.gfx.spark(g, sx, sy, 1 + r() * 2.4, rgba(CY, 0.09 + r() * 0.13), r() * 3);
    }
    g.save(); g.globalAlpha = 0.5;
    for (i = 0; i < 2; i++) {
      g.save(); g.translate(18 + i * 66, 30 + i * 82); g.rotate(-0.06 + i * 0.12);
      g.fillStyle = 'rgba(238,232,208,.085)'; g.fillRect(0, 0, 48, 26);
      g.strokeStyle = 'rgba(255,248,224,.13)'; g.lineWidth = 1; g.strokeRect(0, 0, 48, 26);
      g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(1, 1, 46, 3);
      g.restore();
    }
    g.restore();
    /* scuffs, dust and lacquer gloss */
    for (i = 0; i < 240; i++) {
      g.fillStyle = r() > 0.5 ? rgba(CRM, r() * 0.09) : 'rgba(8,4,6,' + (r() * 0.3) + ')';
      g.fillRect(r() * w, r() * h, 1 + r(), 1);
    }
    g.fillStyle = grad(g, 0, 0, w, 0, [[0, 'rgba(255,255,255,0)'], [0.3, rgba(CRM, 0.06)],
      [0.46, 'rgba(255,255,255,0)'], [0.85, 'rgba(0,0,0,.12)'], [1, 'rgba(0,0,0,.26)']]);
    g.fillRect(0, 0, w, h);
    if (level > 0) {
      /* baked local lamp spill: a genuinely different light state, not a tint */
      g.save(); g.globalCompositeOperation = 'lighter';
      var amp = level / 3;
      var cols = [OR, CY, WARM], xs = [26, 102, 60], ys = [58, 132, 172];
      for (i = 0; i < 3; i++) {
        var rg = g.createRadialGradient(xs[i], ys[i], 0, xs[i], ys[i], 58 + i * 8);
        rg.addColorStop(0, rgba(cols[i], 0.06 + amp * 0.33));
        rg.addColorStop(0.45, rgba(cols[i], 0.02 + amp * 0.13));
        rg.addColorStop(1, rgba(cols[i], 0));
        g.fillStyle = rg; g.fillRect(0, 0, w, h);
      }
      g.fillStyle = rgba(WARM, 0.012 + amp * 0.045); g.fillRect(0, 0, w, h);
      g.restore();
    }
  }

  function chromeRail(g, w, h, y0, hh) {
    g.fillStyle = grad(g, 0, y0, 0, y0 + hh, [[0, '#191d22'], [0.12, '#6e7b83'], [0.32, '#f0f5f6'],
      [0.48, '#a9b4b9'], [0.68, '#4d575f'], [0.88, '#c3cccf'], [1, '#1b1e22']]);
    g.fillRect(0, y0, w, hh);
    g.fillStyle = 'rgba(255,255,255,.32)'; g.fillRect(0, y0 + 2, w, 1.5);
    g.fillStyle = 'rgba(0,0,0,.34)'; g.fillRect(0, y0 + hh - 3, w, 3);
  }

  function makePly(level) {
    return tex(128, 192, function (g, w, h) {
      var r = rnd(7100 + level * 97);
      basePly(g, w, h, r, level);
      screw(g, 11, 24, 4.2); screw(g, w - 11, 24, 4.2);
      screw(g, 11, h - 26, 4.2); screw(g, w - 11, h - 26, 4.2);
      chromeRail(g, w, h, h - 18, 18);
    });
  }

  function makeRail() {
    return tex(128, 192, function (g, w, h) {
      var r = rnd(7331), i;
      basePly(g, w, h, r, 1);
      chromeRail(g, w, h, 78, 26);
      for (i = 0; i < 3; i++) {
        g.beginPath(); g.moveTo(-4, 42 + i * 12);
        g.bezierCurveTo(w * 0.35, 12 + i * 12, w * 0.65, 68 + i * 12, w + 4, 34 + i * 12);
        g.strokeStyle = 'rgba(18,20,24,.55)'; g.lineWidth = 5; g.stroke();
        g.strokeStyle = 'rgba(225,236,240,.72)'; g.lineWidth = 2; g.stroke();
      }
      screw(g, 12, 68, 3.4); screw(g, w - 12, 68, 3.4);
      screw(g, 12, 122, 3.4); screw(g, w - 12, 122, 3.4);
    });
  }

  function makeRubber() {
    return tex(128, 192, function (g, w, h) {
      var r = rnd(7712);
      basePly(g, w, h, r, 0);
      for (var i = 0; i < 2; i++) {
        var px = i ? w - 20 : 20;
        var pg = g.createRadialGradient(px - 4, 88, 1, px, 96, 16);
        pg.addColorStop(0, '#fff0c9'); pg.addColorStop(0.35, '#c9a15a');
        pg.addColorStop(0.8, '#6d4d22'); pg.addColorStop(1, '#291c0e');
        g.fillStyle = pg; g.beginPath(); g.arc(px, 96, 14, 0, TAU); g.fill();
        g.strokeStyle = 'rgba(255,236,186,.5)'; g.lineWidth = 1.4; g.stroke();
      }
      g.fillStyle = grad(g, 0, 83, 0, 111, [[0, '#6d6f70'], [0.18, '#fffdf6'], [0.5, '#f0eee7'],
        [0.82, '#b9bcc0'], [1, '#5b5e62']]);
      rr(g, 20, 84, 88, 26, 12); g.fill();
      g.fillStyle = 'rgba(255,255,255,.72)'; rr(g, 24, 87, 80, 5, 3); g.fill();
      g.strokeStyle = 'rgba(30,20,18,.45)'; g.lineWidth = 2; rr(g, 20, 84, 88, 26, 12); g.stroke();
      g.fillStyle = rgba(OR, 0.10); g.fillRect(0, 126, w, 40);
      screw(g, 64, 148, 3.6);
    });
  }

  function makeSteel() {
    return tex(128, 192, function (g, w, h) {
      var r = rnd(7903), i;
      basePly(g, w, h, r, 1);
      g.fillStyle = grad(g, 40, 0, 88, 0, [[0, '#262b31'], [0.18, '#8d9aa2'], [0.42, '#e2eaed'],
        [0.6, '#7b858d'], [0.85, '#333b42'], [1, '#16191d']]);
      g.fillRect(40, 0, 48, h);
      for (i = 0; i < 46; i++) {
        g.fillStyle = i % 2 ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.09)';
        g.fillRect(42 + r() * 44, r() * h, 1, 10 + r() * 60);
      }
      chromeRail(g, w, h, 52, 9);
      chromeRail(g, w, h, 146, 9);
      screw(g, 64, 32, 4); screw(g, 64, 164, 4);
      g.fillStyle = rgba(CY, 0.09); g.fillRect(0, 0, 38, h);
    });
  }

  function makeWire() {
    return tex(128, 192, function (g, w, h) {
      var r = rnd(8123), i;
      basePly(g, w, h, r, 0);
      for (i = 0; i < 3; i++) {
        g.beginPath(); g.moveTo(-4, 26 + i * 44);
        g.bezierCurveTo(30, 4 + i * 44, 94, 88 + i * 44, w + 4, 44 + i * 44);
        g.strokeStyle = 'rgba(10,12,16,.6)'; g.lineWidth = 6; g.stroke();
        g.strokeStyle = '#cdd9de'; g.lineWidth = 2.4; g.stroke();
        g.strokeStyle = 'rgba(255,255,255,.65)'; g.lineWidth = 0.8; g.stroke();
      }
      for (i = 0; i < 3; i++) {
        var lg = g.createRadialGradient(64, 44, 0, 64, 44, 26);
        lg.addColorStop(0, rgba(CY, 0.55)); lg.addColorStop(1, rgba(CY, 0));
        g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = lg;
        g.fillRect(30, 18, 68, 54); g.restore();
      }
      screw(g, 10, 12, 3.4); screw(g, w - 10, h - 12, 3.4);
    });
  }

  function makeBumperWall() {
    return tex(128, 192, function (g, w, h) {
      var r = rnd(8361), i;
      basePly(g, w, h, r, 0);
      var halo = g.createRadialGradient(64, 96, 4, 64, 96, 76);
      halo.addColorStop(0, rgba(OR, 0.5)); halo.addColorStop(0.5, rgba(OR, 0.13));
      halo.addColorStop(1, rgba(OR, 0));
      g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = halo; g.fillRect(0, 0, w, h); g.restore();
      var cg = g.createRadialGradient(52, 70, 2, 64, 96, 46);
      cg.addColorStop(0, '#ffe1ad'); cg.addColorStop(0.3, '#e0692f');
      cg.addColorStop(0.72, '#8f3218'); cg.addColorStop(1, '#33130e');
      g.fillStyle = '#20242a'; g.beginPath(); g.ellipse(64, 100, 50, 44, 0, 0, TAU); g.fill();
      g.fillStyle = cg; g.beginPath(); g.ellipse(64, 96, 44, 38, 0, 0, TAU); g.fill();
      for (i = 0; i < 4; i++) {
        g.strokeStyle = 'rgba(255,224,178,' + (0.4 - i * 0.07) + ')'; g.lineWidth = 2;
        g.beginPath(); g.ellipse(64, 96, 12 + i * 9, 10 + i * 8, 0, 0, TAU); g.stroke();
      }
      g.fillStyle = grad(g, 0, 128, 0, 156, [[0, '#f7f4e9'], [0.5, '#d6d6d0'], [1, '#6e6e6c']]);
      rr(g, 10, 130, 108, 24, 11); g.fill();
      screw(g, 22, 142, 3.4); screw(g, 106, 142, 3.4);
    });
  }

  function makeLamp(rgb, level) {
    return tex(128, 192, function (g, w, h) {
      var r = rnd(8500 + level * 53 + (rgb === CY ? 300 : 0)), i;
      basePly(g, w, h, r, 0);
      var amp = level / 3;
      if (level > 0) {
        g.save(); g.globalCompositeOperation = 'lighter';
        var halo = g.createRadialGradient(64, 88, 2, 64, 88, 96);
        halo.addColorStop(0, rgba(rgb, 0.12 + amp * 0.62));
        halo.addColorStop(0.3, rgba(rgb, 0.05 + amp * 0.28));
        halo.addColorStop(1, rgba(rgb, 0));
        g.fillStyle = halo; g.fillRect(0, 0, w, h);
        /* a wedge of lamp light spilled down the lacquer */
        g.fillStyle = grad(g, 0, 88, 0, h, [[0, rgba(rgb, 0.08 + amp * 0.24)], [1, rgba(rgb, 0)]]);
        g.beginPath(); g.moveTo(24, 96); g.lineTo(104, 96); g.lineTo(128, h); g.lineTo(0, h); g.fill();
        g.restore();
      }
      var bg = g.createRadialGradient(64, 88, 6, 64, 88, 40);
      bg.addColorStop(0, '#1c1a1c'); bg.addColorStop(0.72, '#5a6066'); bg.addColorStop(1, '#17191d');
      g.fillStyle = bg; g.beginPath(); g.arc(64, 88, 38, 0, TAU); g.fill();
      g.strokeStyle = '#c9d2d6'; g.lineWidth = 3; g.beginPath(); g.arc(64, 88, 35, 0, TAU); g.stroke();
      var lens = g.createRadialGradient(54, 76, 1, 64, 88, 33);
      lens.addColorStop(0, level ? 'rgba(255,250,232,.96)' : rgba(rgb, 0.55));
      lens.addColorStop(0.35, rgba(rgb, 0.28 + amp * 0.7));
      lens.addColorStop(0.82, rgba(rgb, 0.14 + amp * 0.45));
      lens.addColorStop(1, 'rgba(26,16,16,.9)');
      g.fillStyle = lens; g.beginPath(); g.arc(64, 88, 31, 0, TAU); g.fill();
      g.strokeStyle = 'rgba(255,255,255,' + (0.18 + amp * 0.5) + ')'; g.lineWidth = 2;
      g.beginPath(); g.arc(64, 88, 30, -2.5, -0.9); g.stroke();
      for (i = 0; i < 4; i++) screw(g, 20 + (i % 2) * 88, 30 + Math.floor(i / 2) * 118, 3.2);
      /* socket and solder visible below the insert */
      g.strokeStyle = 'rgba(190,160,110,.45)'; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(64, 126); g.bezierCurveTo(48, 146, 84, 156, 64, h - 18); g.stroke();
      g.fillStyle = '#9c7b45'; g.fillRect(58, 138, 12, 7);
    });
  }

  function makeBackglass(level, frame) {
    return tex(256, 160, function (g, w, h) {
      var r = rnd(9100 + level * 71 + frame * 13), i, j;
      g.fillStyle = grad(g, 0, 0, 0, h, [[0, '#160e1e'], [0.42, '#301730'], [0.72, '#4a2030'], [1, '#170d14']]);
      g.fillRect(0, 0, w, h);
      for (i = 0; i < 90; i++) {
        g.fillStyle = rgba(CRM, 0.06 + r() * 0.3); g.fillRect(r() * w, r() * h * 0.75, 1, 1);
      }
      /* invented skyline of lamp-lit rooftops */
      for (i = 0; i < 16; i++) {
        var bw = 12 + r() * 18, bx = i * 17 - 4, bh = 24 + r() * 46, by = h - bh - 16;
        g.fillStyle = i % 2 ? '#20101c' : '#25121e'; g.fillRect(bx, by, bw, bh);
        g.fillStyle = rgba(CY, 0.16); g.fillRect(bx + 1, by, bw - 2, 1);
        for (j = 0; j < 4; j++) {
          g.fillStyle = r() > 0.45 ? rgba(WARM, 0.22 + r() * 0.5) : rgba(CY, 0.14 + r() * 0.4);
          g.fillRect(bx + 3 + r() * (bw - 7), by + 5 + r() * (bh - 10), 3, 3);
        }
      }
      var moon = g.createRadialGradient(190, 42, 2, 190, 42, 46);
      moon.addColorStop(0, rgba(WARM, 0.85)); moon.addColorStop(0.35, rgba(OR, 0.34));
      moon.addColorStop(1, rgba(OR, 0));
      g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = moon; g.fillRect(130, 0, w, 100); g.restore();
      g.fillStyle = '#f6dfb6'; g.beginPath(); g.arc(190, 42, 14, 0, TAU); g.fill();
      g.fillStyle = 'rgba(60,22,26,.36)'; g.beginPath(); g.arc(196, 38, 12, 0, TAU); g.fill();
      /* chase bulbs around the border */
      for (i = 0; i < 26; i++) {
        var on = (i + frame * 2) % 5 < 2;
        var bx2 = 6 + (i % 13) * 19.6, by2 = i < 13 ? 6 : h - 6;
        g.fillStyle = on ? rgba(WARM, 0.9) : 'rgba(120,84,62,.5)';
        g.beginPath(); g.arc(bx2, by2, on ? 3.4 : 2.2, 0, TAU); g.fill();
        if (on) {
          var bgl = g.createRadialGradient(bx2, by2, 0, bx2, by2, 11);
          bgl.addColorStop(0, rgba(WARM, 0.4)); bgl.addColorStop(1, rgba(WARM, 0));
          g.fillStyle = bgl; g.fillRect(bx2 - 11, by2 - 11, 22, 22);
        }
      }
      A.gfx.copyText(g, 'MARBELLE', 128, 41, 27, '#f3e3c4', { align: 'center', family: 'Georgia, serif', weight: 'bold', tracking: 4 });
      A.gfx.copyText(g, 'night game', 128, 57, 9, rgba(CRM, 0.72), { align: 'center', tracking: 2 });
      /* ZIMO letter lamps */
      for (i = 0; i < 4; i++) {
        var lx = 58 + i * 47, lit = i < level;
        if (lit) {
          g.save(); g.globalCompositeOperation = 'lighter';
          var lgl = g.createRadialGradient(lx, 80, 0, lx, 80, 30);
          lgl.addColorStop(0, rgba(OR, 0.6)); lgl.addColorStop(1, rgba(OR, 0));
          g.fillStyle = lgl; g.fillRect(lx - 30, 50, 60, 60); g.restore();
        }
        g.fillStyle = lit ? rgba(WARM, 0.95) : '#4a3240';
        g.beginPath(); g.arc(lx, 80, 15, 0, TAU); g.fill();
        g.strokeStyle = lit ? '#fff1cf' : '#735a58'; g.lineWidth = 2; g.stroke();
        A.gfx.copyText(g, WORD.charAt(i), lx, 86, 17, lit ? '#3b160e' : '#b49a8d',
          { align: 'center', family: 'Georgia, serif', weight: 'bold' });
      }
      /* mechanical score-reel drums, turning */
      g.fillStyle = '#24131a'; rr(g, 30, 108, 196, 38, 4); g.fill();
      g.fillStyle = 'rgba(255,214,160,.18)'; g.fillRect(30, 108, 196, 2);
      for (i = 0; i < 5; i++) {
        var dx = 38 + i * 38;
        g.fillStyle = '#0d0a0c'; g.fillRect(dx, 113, 32, 27);
        var num = (level * 3 + frame * 2 + i * 7 + (i === 4 ? 1 : 0)) % 10;
        g.fillStyle = '#e9d8b4';
        g.font = 'bold 18px monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillText(String(num), dx + 16, 126 + (frame % 3) * 1.2);
        g.fillStyle = rgba(CRM, 0.35); g.fillText(String((num + 1) % 10), dx + 16, 106 + (frame % 3) * 2);
        g.fillStyle = grad(g, dx, 113, dx, 140, [[0, 'rgba(0,0,0,.65)'], [0.45, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.7)']]);
        g.fillRect(dx, 113, 32, 27);
      }
      g.fillStyle = grad(g, 0, 148, 0, h, [[0, '#c9a15a'], [0.4, '#78502f'], [1, '#2a1712']]);
      g.fillRect(0, 148, w, 12);
      g.fillStyle = 'rgba(255,255,255,.22)'; g.fillRect(0, 149, w, 1);
    });
  }

  function makeGate() {
    return tex(128, 192, function (g, w, h) {
      var r = rnd(9401), i;
      basePly(g, w, h, r, 0);
      g.fillStyle = '#18171b'; g.fillRect(14, 16, 100, 160);
      for (i = 0; i < 6; i++) {
        var bx = 20 + i * 16;
        g.fillStyle = grad(g, bx, 0, bx + 9, 0, [[0, '#343a40'], [0.4, '#c4ced2'], [0.7, '#6d7780'], [1, '#20252a']]);
        g.fillRect(bx, 22, 9, 148);
      }
      chromeRail(g, w, h, 28, 7); chromeRail(g, w, h, 158, 7);
      g.fillStyle = '#5b2d1c'; rr(g, 30, 84, 68, 26, 4); g.fill();
      g.strokeStyle = rgba(WARM, 0.7); g.lineWidth = 1.5; rr(g, 30, 84, 68, 26, 4); g.stroke();
      A.gfx.copyText(g, 'SPECIAL', 64, 102, 11, '#ffe1ab', { align: 'center', weight: 'bold', tracking: 2 });
    });
  }

  /* ----------------------------- sprite art --------------------------- */
  function makeDrop(up) {
    return tex(64, 96, function (g, w, h) {
      if (up) {
        g.fillStyle = grad(g, 8, 0, 56, 0, [[0, '#4a5056'], [0.2, '#e6edf0'], [0.5, '#a8b1b6'], [0.8, '#4d545a'], [1, '#20242a']]);
        rr(g, 9, 8, 46, 78, 4); g.fill();
        g.fillStyle = '#efe2c3'; rr(g, 14, 13, 36, 60, 2); g.fill();
        g.fillStyle = grad(g, 0, 13, 0, 73, [[0, rgba(OR, 0.85)], [0.5, '#b94a20'], [1, '#5a2112']]);
        g.fillRect(14, 30, 36, 13);
        g.fillStyle = rgba(CRM, 0.75); g.font = 'bold 14px Georgia, serif'; g.textAlign = 'center';
        g.fillText('M', 32, 26);
        g.fillStyle = '#24303a';
        for (var i = 0; i < 3; i++) g.fillRect(18, 52 + i * 7, 28 - i * 6, 3);
        screw(g, 16, 17, 2.4); screw(g, 48, 17, 2.4);
        g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(11, 10, 2, 74);
      } else {
        g.fillStyle = 'rgba(10,6,8,.55)'; g.beginPath(); g.ellipse(32, 78, 27, 9, 0, 0, TAU); g.fill();
        g.fillStyle = '#2a2e33'; g.beginPath(); g.moveTo(8, 76); g.lineTo(18, 46);
        g.lineTo(50, 46); g.lineTo(58, 76); g.closePath(); g.fill();
        g.fillStyle = '#8d979d'; g.beginPath(); g.moveTo(18, 46); g.lineTo(50, 46); g.lineTo(54, 54); g.lineTo(15, 54); g.closePath(); g.fill();
        g.strokeStyle = rgba(WARM, 0.35); g.lineWidth = 1.5; g.stroke();
      }
    });
  }

  function makeStand() {
    return tex(64, 96, function (g, w, h) {
      g.fillStyle = '#2b2f35'; g.fillRect(29, 66, 6, 26);
      g.fillStyle = grad(g, 0, 0, 64, 0, [[0, '#40484e'], [0.35, '#e2eaed'], [0.7, '#7d868c'], [1, '#282d32']]);
      rr(g, 8, 8, 48, 64, 8); g.fill();
      g.fillStyle = '#f0dfbb'; g.beginPath(); g.arc(32, 38, 22, 0, TAU); g.fill();
      g.fillStyle = '#d0692f'; g.beginPath(); g.arc(32, 38, 15, 0, TAU); g.fill();
      g.fillStyle = '#f6e9c9'; g.beginPath(); g.arc(32, 38, 8, 0, TAU); g.fill();
      g.fillStyle = '#27333b'; g.beginPath(); g.arc(32, 38, 3, 0, TAU); g.fill();
      g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 1.5; g.beginPath(); g.arc(32, 38, 21, -2.3, -0.7); g.stroke();
      screw(g, 13, 14, 2.2); screw(g, 51, 14, 2.2);
    });
  }

  function makeSpinner() {
    return tex(64, 96, function (g, w, h) {
      g.fillStyle = '#272c32'; g.fillRect(29, 0, 6, 96);
      g.fillStyle = grad(g, 6, 0, 58, 0, [[0, '#556068'], [0.25, '#f0f4f5'], [0.55, '#a4afb4'], [1, '#3d454c']]);
      rr(g, 8, 18, 48, 60, 3); g.fill();
      g.fillStyle = '#b34c22'; g.fillRect(10, 42, 44, 9);
      g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(10, 20, 44, 2);
      screw(g, 16, 26, 2.6); screw(g, 48, 70, 2.6);
    });
  }

  function makeRollover() {
    return tex(96, 48, function (g, w, h) {
      g.fillStyle = 'rgba(12,7,10,.5)'; g.beginPath(); g.ellipse(48, 30, 40, 14, 0, 0, TAU); g.fill();
      g.fillStyle = grad(g, 0, 14, 0, 34, [[0, '#d7dfe2'], [0.5, '#7c858b'], [1, '#282d33']]);
      g.beginPath(); g.ellipse(48, 24, 34, 11, 0, 0, TAU); g.fill();
      g.fillStyle = '#f4e7c9'; g.beginPath(); g.ellipse(48, 23, 25, 7, 0, 0, TAU); g.fill();
      g.strokeStyle = rgba(OR, 0.8); g.lineWidth = 2; g.beginPath(); g.ellipse(48, 23, 29, 9, 0, 0, TAU); g.stroke();
    });
  }

  function makePost() {
    return tex(48, 96, function (g, w, h) {
      g.fillStyle = 'rgba(10,6,8,.5)'; g.beginPath(); g.ellipse(24, 90, 17, 5, 0, 0, TAU); g.fill();
      g.fillStyle = grad(g, 14, 0, 34, 0, [[0, '#343a40'], [0.35, '#eef3f5'], [0.7, '#818a90'], [1, '#2a3036']]);
      g.fillRect(16, 14, 16, 76);
      g.fillStyle = '#f5f2e8'; g.beginPath(); g.ellipse(24, 50, 20, 9, 0, 0, TAU); g.fill();
      g.fillStyle = 'rgba(255,255,255,.8)'; g.beginPath(); g.ellipse(24, 47, 16, 4, 0, 0, TAU); g.fill();
      g.fillStyle = '#c9a15a'; g.beginPath(); g.arc(24, 14, 8, 0, TAU); g.fill();
    });
  }

  function makeBumperCap() {
    return tex(128, 128, function (g, w, h) {
      var i;
      g.fillStyle = 'rgba(8,5,8,.55)'; g.beginPath(); g.ellipse(64, 116, 48, 9, 0, 0, TAU); g.fill();
      var halo = g.createRadialGradient(64, 84, 3, 64, 84, 58);
      halo.addColorStop(0, rgba(OR, 0.55)); halo.addColorStop(1, rgba(OR, 0));
      g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = halo; g.fillRect(0, 20, 128, 108); g.restore();
      g.fillStyle = '#2a2f34'; g.beginPath(); g.ellipse(64, 98, 52, 24, 0, 0, TAU); g.fill();
      g.fillStyle = grad(g, 0, 96, 0, 116, [[0, '#f9f6ec'], [0.55, '#dedbd1'], [1, '#73716d']]);
      rr(g, 12, 96, 104, 18, 9); g.fill();
      var cg = g.createRadialGradient(48, 46, 2, 64, 66, 50);
      cg.addColorStop(0, '#ffe7b8'); cg.addColorStop(0.28, '#e0692f');
      cg.addColorStop(0.75, '#8d3219'); cg.addColorStop(1, '#30120e');
      g.fillStyle = cg; g.beginPath(); g.ellipse(64, 68, 46, 38, 0, 0, TAU); g.fill();
      for (i = 0; i < 4; i++) {
        g.strokeStyle = 'rgba(255,226,178,' + (0.45 - i * 0.08) + ')'; g.lineWidth = 2;
        g.beginPath(); g.ellipse(64, 68, 10 + i * 9, 8 + i * 7.5, 0, 0, TAU); g.stroke();
      }
      g.fillStyle = '#c9d2d6'; g.beginPath(); g.arc(64, 68, 7, 0, TAU); g.fill();
      g.fillStyle = 'rgba(255,255,255,.6)'; g.beginPath(); g.ellipse(44, 44, 13, 6, -0.6, 0, TAU); g.fill();
    });
  }

  function makeSling() {
    return tex(128, 72, function (g, w, h) {
      for (var i = 0; i < 2; i++) {
        var px = i ? 108 : 20;
        var pg = g.createRadialGradient(px - 4, 30, 1, px, 36, 13);
        pg.addColorStop(0, '#fff0c9'); pg.addColorStop(0.5, '#c9a15a'); pg.addColorStop(1, '#2c1d0e');
        g.fillStyle = pg; g.beginPath(); g.arc(px, 36, 12, 0, TAU); g.fill();
      }
      g.beginPath(); g.moveTo(20, 26); g.lineTo(108, 26); g.lineTo(108, 48); g.lineTo(20, 48); g.closePath();
      g.fillStyle = grad(g, 0, 26, 0, 48, [[0, '#f9f7ef'], [0.55, '#e8e5db'], [1, '#9a9a96']]); g.fill();
      g.strokeStyle = 'rgba(40,28,22,.5)'; g.lineWidth = 3; g.stroke();
      g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(24, 28, 80, 3);
    });
  }

  function makeFlipper() {
    return tex(160, 56, function (g, w, h) {
      g.fillStyle = 'rgba(8,5,8,.4)'; g.beginPath(); g.ellipse(80, 46, 70, 8, 0, 0, TAU); g.fill();
      var pg = g.createRadialGradient(18, 24, 2, 22, 28, 24);
      pg.addColorStop(0, '#f4f7f8'); pg.addColorStop(0.5, '#8c969c'); pg.addColorStop(1, '#2a3035');
      g.fillStyle = pg; g.beginPath(); g.arc(22, 28, 22, 0, TAU); g.fill();
      g.beginPath(); g.moveTo(22, 12); g.quadraticCurveTo(88, 6, 154, 20);
      g.lineTo(154, 36); g.quadraticCurveTo(88, 50, 22, 44); g.closePath();
      g.fillStyle = grad(g, 0, 12, 0, 46, [[0, '#ffffff'], [0.35, '#f1efe7'], [0.75, '#c5c4bd'], [1, '#6f6e69']]); g.fill();
      g.strokeStyle = 'rgba(40,30,24,.55)'; g.lineWidth = 3; g.stroke();
      g.fillStyle = 'rgba(255,255,255,.75)'; g.beginPath(); g.moveTo(28, 16);
      g.quadraticCurveTo(88, 11, 148, 22); g.lineTo(148, 24);
      g.quadraticCurveTo(88, 14, 28, 19); g.closePath(); g.fill();
      g.fillStyle = '#d0692f'; g.fillRect(60, 24, 34, 6);
    });
  }

  function makeHole(open) {
    return tex(128, 64, function (g, w, h) {
      var gr = g.createRadialGradient(64, 32, 3, 64, 32, 62);
      gr.addColorStop(0, '#050406'); gr.addColorStop(0.6, '#100b12'); gr.addColorStop(1, 'rgba(30,18,20,0)');
      g.fillStyle = gr; g.beginPath(); g.ellipse(64, 32, 60, 27, 0, 0, TAU); g.fill();
      g.strokeStyle = open ? rgba(WARM, 0.95) : '#7e6c53'; g.lineWidth = open ? 5 : 3;
      g.beginPath(); g.ellipse(64, 32, 48, 20, 0, 0, TAU); g.stroke();
      if (open) {
        g.save(); g.globalCompositeOperation = 'lighter';
        var hl = g.createRadialGradient(64, 32, 4, 64, 32, 60);
        hl.addColorStop(0, rgba(WARM, 0.5)); hl.addColorStop(1, rgba(WARM, 0));
        g.fillStyle = hl; g.fillRect(0, 0, 128, 64); g.restore();
      }
      g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 1;
      g.beginPath(); g.ellipse(64, 32, 54, 23, 0, Math.PI, TAU); g.stroke();
    });
  }

  function makeBall() {
    return tex(48, 48, function (g, w, h) {
      g.save(); g.beginPath(); g.arc(24, 24, 22, 0, TAU); g.clip();
      var gr = g.createRadialGradient(15, 11, 1, 24, 26, 27);
      gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.2, '#eef3f5');
      gr.addColorStop(0.48, '#9ba6ad'); gr.addColorStop(0.78, '#3b434b'); gr.addColorStop(1, '#0e1116');
      g.fillStyle = gr; g.fillRect(0, 0, 48, 48);
      g.fillStyle = rgba(OR, 0.28); g.fillRect(0, 22, 48, 5);
      g.fillStyle = rgba(CY, 0.3); g.fillRect(0, 29, 48, 3);
      g.restore();
      g.strokeStyle = 'rgba(230,240,245,.5)'; g.lineWidth = 1; g.beginPath(); g.arc(24, 24, 22, 0, TAU); g.stroke();
    });
  }

  function makeBigBall() {
    return tex(160, 160, function (g, w, h) {
      g.save(); g.beginPath(); g.arc(80, 80, 76, 0, TAU); g.clip();
      var gr = g.createRadialGradient(50, 32, 3, 80, 88, 92);
      gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.14, '#dfe9ed');
      gr.addColorStop(0.42, '#7d8a92'); gr.addColorStop(0.72, '#2a313a'); gr.addColorStop(1, '#0b0e13');
      g.fillStyle = gr; g.fillRect(0, 0, 160, 160);
      /* a whole little skyline folded across the chrome */
      g.fillStyle = 'rgba(18,12,18,.5)'; g.fillRect(0, 74, 160, 34);
      for (var i = 0; i < 12; i++) {
        g.fillStyle = i % 3 ? rgba(WARM, 0.5) : rgba(OR, 0.42);
        g.fillRect(i * 14, 82 - (i % 4) * 4, 7 + (i % 3) * 4, 20 + (i % 4) * 4);
      }
      g.fillStyle = rgba(CY, 0.3); g.fillRect(0, 108, 160, 9);
      g.fillStyle = 'rgba(255,255,255,.22)'; g.beginPath(); g.ellipse(54, 38, 24, 10, -0.6, 0, TAU); g.fill();
      g.restore();
      g.strokeStyle = 'rgba(230,240,245,.45)'; g.lineWidth = 2; g.beginPath(); g.arc(80, 80, 76, 0, TAU); g.stroke();
      g.strokeStyle = 'rgba(255,255,255,.3)'; g.lineWidth = 3;
      g.beginPath(); g.arc(80, 80, 72, 3.4, 4.7); g.stroke();
    });
  }

  function makeGlow(rgb) {
    return tex(128, 128, function (g, w, h) {
      var gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, rgba(rgb, 0.85)); gr.addColorStop(0.22, rgba(rgb, 0.42));
      gr.addColorStop(0.58, rgba(rgb, 0.12)); gr.addColorStop(1, rgba(rgb, 0));
      g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    });
  }

  function makeCeiling() {
    return tex(512, 256, function (g, w, h) {
      var r = rnd(9600), i;
      g.fillStyle = grad(g, 0, 0, 0, h, [[0, '#08070b'], [0.42, '#1b0f18'], [0.82, '#2c1620'], [1, '#160d14']]);
      g.fillRect(0, 0, w, h);
      for (i = 0; i < 7; i++) {
        var cx = 30 + i * 76, cy = 60 + (i % 3) * 34, col = i % 2 ? CY : OR;
        var gr = g.createRadialGradient(cx, cy, 0, cx, cy, 58);
        gr.addColorStop(0, rgba(col, 0.2)); gr.addColorStop(1, rgba(col, 0));
        g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = gr;
        g.fillRect(cx - 60, cy - 60, 120, 120); g.restore();
        g.fillStyle = rgba(col, 0.16); g.beginPath(); g.ellipse(cx, cy, 18, 5, 0, 0, TAU); g.fill();
      }
      g.strokeStyle = 'rgba(243,227,196,.055)'; g.lineWidth = 1;
      for (i = 0; i < 9; i++) {
        g.beginPath(); g.arc(410, 210, 12 + i * 7, 2.8, 4.7); g.stroke();
      }
      for (i = 0; i < 5; i++) {
        g.strokeStyle = 'rgba(255,255,255,.035)'; g.lineWidth = 2 + i;
        g.beginPath(); g.moveTo(-20, 30 + i * 42); g.lineTo(w + 20, 6 + i * 42); g.stroke();
      }
      g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(0, h - 18, w, 18);
    });
  }

  function makeFloor() {
    return tex(512, 256, function (g, w, h) {
      var r = rnd(9700), i;
      g.fillStyle = grad(g, 0, 0, 0, h, [[0, '#1a0e13'], [0.35, '#3a1a17'], [0.8, '#231013'], [1, '#100a0d']]);
      g.fillRect(0, 0, w, h);
      for (i = 0; i < 11; i++) {
        g.beginPath(); g.moveTo(256 + (i - 5) * 12, 0); g.lineTo(256 + (i - 5) * 128, h);
        g.strokeStyle = 'rgba(243,227,196,.035)'; g.lineWidth = 1 + (i % 3); g.stroke();
      }
      for (i = 0; i < 4; i++) {
        g.beginPath(); g.moveTo(-10, 40 + i * 52);
        g.bezierCurveTo(180, 10 + i * 52, 330, 80 + i * 52, w + 10, 30 + i * 52);
        g.strokeStyle = 'rgba(14,6,8,.35)'; g.lineWidth = 5; g.stroke();
        g.strokeStyle = rgba(CRM, 0.08); g.lineWidth = 1; g.stroke();
      }
      for (i = 0; i < 300; i++) {
        g.fillStyle = rgba(CRM, r() * 0.07); g.fillRect(r() * w, r() * h, 1, 1);
      }
    });
  }

  var T = null;
  function buildTextures(seed) {
    var i, j, ply = [], lampA = [], lampB = [], bg = [];
    for (i = 0; i < 4; i++) ply.push(makePly(i));
    for (i = 0; i < 4; i++) { lampA.push(makeLamp(OR, i)); lampB.push(makeLamp(CY, i)); }
    for (i = 0; i < 4; i++) {
      var frames = [];
      for (j = 0; j < FRAMES; j++) frames.push(makeBackglass(i, j));
      bg.push(frames);
    }
    return {
      ply: ply, rail: makeRail(), rubber: makeRubber(), steel: makeSteel(),
      wire: makeWire(), bumper: makeBumperWall(), lampA: lampA, lampB: lampB,
      bg: bg, gate: makeGate(), ceiling: makeCeiling(), floor: makeFloor(),
      skyHint: tex(256, 96, function (g, w, h) {
        A.gfx.copyText(g, 'MARBELLE', 128, 46, 30, '#f3e3c4', { align: 'center', tracking: 5 });
      }),
      sp: {
        drop: [makeDrop(true), makeDrop(false)], stand: makeStand(), spinner: makeSpinner(),
        rollover: makeRollover(), post: makePost(), bumper: makeBumperCap(),
        sling: makeSling(), flipper: makeFlipper(), hole: [makeHole(false), makeHole(true)],
        ball: makeBall(), bigBall: makeBigBall(), glowO: makeGlow(OR), glowC: makeGlow(CY),
        lensO: tex(64, 64, function (g) {
          var gr = g.createRadialGradient(26, 22, 1, 32, 32, 30);
          gr.addColorStop(0, '#fff3d4'); gr.addColorStop(0.4, '#e0692f'); gr.addColorStop(1, '#451a12');
          g.fillStyle = gr; g.beginPath(); g.arc(32, 32, 29, 0, TAU); g.fill();
        }),
        lensC: tex(64, 64, function (g) {
          var gr = g.createRadialGradient(26, 22, 1, 32, 32, 30);
          gr.addColorStop(0, '#e8ffff'); gr.addColorStop(0.4, '#54b3c4'); gr.addColorStop(1, '#15383e');
          g.fillStyle = gr; g.beginPath(); g.arc(32, 32, 29, 0, TAU); g.fill();
        })
      }
    };
  }

  /* -------------------------------- state ----------------------------- */
  var G = {
    env: null, grid: null, wallCache: new Array(W * H * 10), props: [], shots: [], parts: [],
    lamps: [], banks: [], bankById: {}, gates: [false, false, false], letters: 0,
    credits: 3, area: 1, done: false, endAt: -1, frame: -1, flash: 0, invuln: 0,
    lag: 0, lastAngle: 0, reelSpin: 0, shotsFired: 0, hole: null, hazard: null,
    flippers: [], started: null, start: null, full: false, scoreTick: 0, rumbleTick: 0,
    locked: false, route: null, demo: null, demoTotal: 1, deadline: [12, 26, 36, 48],
    forceEnd: false
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
    for (y = 0; y < H; y++) { a[y][0] = '1'; a[y][W - 1] = '3'; }
    [13, 25, 35].forEach(function (dx) {
      for (y = 1; y < H - 1; y++) a[y][dx] = '6';
      a[7][dx] = '9'; a[8][dx] = '9';
    });
    function put(x2, y2, v) { if (x2 > 0 && x2 < W - 1 && y2 > 0 && y2 < H - 1) a[y2][x2] = v; }
    /* slingshot cheeks and chrome lane guides */
    [4, 5, 10, 11].forEach(function (x2) {
      put(x2, 3, '4'); put(x2, 11, '4'); put(x2, 2, '5'); put(x2, 12, '5');
    });
    [17, 21].forEach(function (x2) {
      put(x2, 4, '8'); put(x2, 10, '8'); put(x2, 2, '5'); put(x2, 12, '5');
    });
    [29, 33].forEach(function (x2) { put(x2, 2, '5'); put(x2, 12, '5'); });
    for (x = 28; x <= 33; x++) { put(x, 5, '6'); put(x, 9, '6'); }
    put(7, 1, '7'); put(19, 1, '7'); put(31, 1, '7');
    put(7, 13, '7'); put(19, 13, '7'); put(31, 13, '7');
    put(2, 4, '2'); put(2, 10, '2'); put(16, 3, '2'); put(23, 11, '2');
    put(38, 5, '5'); put(38, 9, '5');
    put(13, 4, '5'); put(13, 10, '5'); put(25, 4, '5'); put(25, 10, '5');
    put(35, 4, '5'); put(35, 10, '5');
    G.grid = a.map(function (row) { return row.join(''); });
    return G.grid;
  }

  function gateIndex(x) { return x === 13 ? 0 : (x === 25 ? 1 : (x === 35 ? 2 : -1)); }

  function info(v, x, y) {
    var idx = (y * W + x) * 10 + v;
    var o = G.wallCache[idx];
    if (!o) o = G.wallCache[idx] = { solid: true, tex: null, height: 1, color: '#3b211b', emissive: null };
    return o;
  }
  function wallFn(v, x, y) { return info(v, x, y); }

  function refreshWalls() {
    var lit = Math.min(3, G.letters), x, y, v, o;
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
      v = cell(x, y); o = info(v, x, y);
      o.solid = v !== 0; o.height = 1; o.emissive = null;
      switch (v) {
        case 0: o.solid = false; o.tex = null; break;
        case 1: o.tex = T.ply[lit]; if (lit >= 2) o.emissive = rgba(OR, 0.1); break;
        case 2: o.tex = T.rail; break;
        case 3: o.tex = T.bg[lit][Math.max(0, G.frame)]; o.height = 1.15;
          o.emissive = rgba(WARM, 0.1 + lit * 0.05); break;
        case 4: o.tex = T.rubber; break;
        case 5: o.tex = ((x + y) % 2 ? T.lampA : T.lampB)[lit];
          o.emissive = lit > 0 ? rgba((x + y) % 2 ? OR : CY, 0.08 + lit * 0.07) : null; break;
        case 6: o.tex = T.steel; break;
        case 7: o.tex = T.wire; o.emissive = rgba(CY, 0.08); break;
        case 8: o.tex = T.bumper; o.emissive = rgba(OR, 0.09); break;
        case 9:
          var gi = gateIndex(x);
          o.solid = gi < 0 || !G.gates[gi]; o.tex = T.gate;
          o.emissive = !o.solid ? null : rgba(WARM, 0.12); break;
        default: o.tex = T.ply[lit];
      }
    }
  }

  function updateReels() {
    var f = Math.floor(stTime() * 3 + (G.start ? 0 : 0)) % FRAMES;
    if (G.frame === f) return;
    G.frame = f;
    var lit = Math.min(3, G.letters), y;
    for (y = 0; y < H; y++) info(3, W - 1, y).tex = T.bg[lit][f];
  }
  function stTime() { return G.clock || 0; }

  /* ---------------------------- sound --------------------------------- */
  function clack() { A.sound.noise({ dur: 0.06, gain: 0.11, freq: 2400, filter: 'highpass' }); }
  function thump() {
    A.sound.tone({ freq: 96, dur: 0.2, type: 'sine', gain: 0.13, slideTo: 44 });
    A.sound.noise({ dur: 0.11, gain: 0.07, freq: 340 });
  }
  function chime() { A.sound.chord([784, 988, 1318], 0.34, 0.075); }
  function bell(f) { A.sound.tone({ freq: f || 880, dur: 0.28, type: 'sine', gain: 0.09 }); }
  function ring() {
    A.sound.tone({ freq: 1680, dur: 0.24, type: 'sine', gain: 0.07 });
    A.sound.tone({ freq: 2380, dur: 0.15, type: 'sine', gain: 0.035, delay: 0.02 });
  }
  function click() { A.sound.noise({ dur: 0.045, gain: 0.09, freq: 3200, filter: 'highpass' }); }
  function twang(freq) { A.sound.tone({ freq: freq || 210, dur: 0.14, type: 'triangle', gain: 0.09, slideTo: 130 }); }

  /* ---------------------------- sprites -------------------------------- */
  function spriteImg(g, cx, cy, hh, canvas, alpha, ws, rot) {
    if (!canvas) return;
    var ww = hh * (canvas.width / canvas.height) * (ws === undefined ? 1 : ws);
    g.save(); g.globalAlpha = alpha === undefined ? 1 : clamp(alpha, 0, 1);
    g.translate(cx, cy); if (rot) g.rotate(rot);
    g.drawImage(canvas, -ww / 2, -hh / 2, ww, hh); g.restore();
  }
  function shadow(g, cx, cy, hh, wid) {
    g.save(); g.globalAlpha = 0.42; g.fillStyle = '#090508';
    g.beginPath(); g.ellipse(cx, cy + hh * 0.48, hh * (wid || 0.34), hh * 0.075, 0, 0, TAU); g.fill(); g.restore();
  }
  function glowImg(g, cx, cy, hh, canvas, alpha) {
    g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = alpha;
    g.drawImage(canvas, cx - hh / 2, cy - hh / 2, hh, hh); g.restore();
  }

  function addProp(o) {
    o.hidden = !!o.hidden;
    o.size = o.size || 0.7;
    o.lift = o.lift === undefined ? 0.5 : o.lift;
    o.r = o.r === undefined ? 0.38 : o.r;
    o.flash = 0; o.spin = 0; o.ring = 0; o.press = 0; o.down = false; o.roll = 0;
    o.draw = function (g, cx, cy, size, dist, sp) {
      var lit = Math.min(3, G.letters);
      switch (o.kind) {
        case 'drop':
          shadow(g, cx, cy, size);
          spriteImg(g, cx, cy, o.down ? size * 0.58 : size, T.sp.drop[o.down ? 1 : 0], 1, 1,
            Math.sin(o.ring * 24) * o.ring * 0.14);
          if (o.flash > 0) glowImg(g, cx, cy, size * 1.7, T.sp.glowO, o.flash * 0.7);
          break;
        case 'stand':
          shadow(g, cx, cy, size);
          spriteImg(g, cx, cy, size, T.sp.stand, 1, 1, Math.sin(o.ring * 22) * o.ring * 0.22);
          if (o.flash > 0) glowImg(g, cx, cy, size * 1.4, T.sp.glowC, o.flash * 0.6);
          break;
        case 'spinner':
          shadow(g, cx, cy, size);
          spriteImg(g, cx, cy, size, T.sp.spinner, 1, 0.16 + 0.84 * Math.abs(Math.cos(o.spin)));
          break;
        case 'rollover':
          spriteImg(g, cx, cy, size, T.sp.rollover, 1, 1 - o.press * 0.08);
          if (o.flash > 0) glowImg(g, cx, cy, size * 2, T.sp.glowO, o.flash * 0.45);
          break;
        case 'post':
          shadow(g, cx, cy, size); spriteImg(g, cx, cy, size, T.sp.post);
          if (o.flash > 0) glowImg(g, cx, cy, size * 1.5, T.sp.glowC, o.flash * 0.5);
          break;
        case 'bumper':
          shadow(g, cx, cy, size);
          glowImg(g, cx, cy, size * 1.8, T.sp.glowO, 0.18 + o.flash * 0.6 + lit * 0.05);
          spriteImg(g, cx, cy, size * (1 + o.flash * 0.14), T.sp.bumper);
          break;
        case 'sling':
          shadow(g, cx, cy, size); spriteImg(g, cx, cy, size, T.sp.sling, 1, 1 + o.flash * 0.1);
          if (o.flash > 0) glowImg(g, cx, cy, size * 1.8, T.sp.glowO, o.flash * 0.5);
          break;
        case 'flipper':
          shadow(g, cx, cy, size * 0.7, 0.5);
          spriteImg(g, cx, cy, size * 0.7, T.sp.flipper, 1, 1, o.ang || 0);
          break;
        case 'bigball':
          shadow(g, cx, cy, size, 0.4);
          spriteImg(g, cx, cy, size, T.sp.bigBall, 1, 1, o.roll * 0.2);
          break;
        case 'ball':
          spriteImg(g, cx, cy, size, T.sp.ball, 1, 1, o.roll * 0.3);
          break;
        case 'hole':
          spriteImg(g, cx, cy, size * 0.7, T.sp.hole[G.letters >= 4 ? 1 : 0]);
          if (G.letters >= 4) glowImg(g, cx, cy, size * 2.2, T.sp.glowO, 0.34 + Math.sin(G.clock * 3) * 0.08);
          break;
        case 'sink':
          spriteImg(g, cx, cy, size * 0.5, T.sp.hole[0], 0.85);
          break;
        case 'lamp':
          glowImg(g, cx, cy, size * (3 + lit * 1.3), o.col === 'c' ? T.sp.glowC : T.sp.glowO,
            0.07 + lit * 0.14 + Math.sin(G.clock * 2 + o.x) * 0.025);
          spriteImg(g, cx, cy, size * 0.55, o.col === 'c' ? T.sp.lensC : T.sp.lensO, 0.55 + lit * 0.15);
          break;
        default:
          spriteImg(g, cx, cy, size, T.sp.post);
      }
    };
    G.props.push(o);
    return o;
  }

  function addShot(s) {
    s.kind = 'ball'; s.size = 0.19; s.lift = 0.5; s.roll = 0;
    s.draw = function (g, cx, cy, size) { spriteImg(g, cx, cy, size, T.sp.ball, 1, 1, s.roll * 0.3); };
    G.shots.push(s);
    if (G.shots.length > 24) G.shots.shift();
  }

  function buildProps() {
    G.props = []; G.shots = []; G.parts = []; G.lamps = []; G.banks = []; G.bankById = {};
    var banks = [
      { id: 'Z', area: 1, letter: 'Z', pts: [[7.2, 6.0], [8.1, 6.2], [9.0, 6.5]] },
      { id: 'I', area: 1, letter: 'I', pts: [[10.7, 8.9], [11.5, 8.6], [12.0, 8.0]] },
      { id: 'M', area: 2, letter: 'M', pts: [[18.4, 6.8], [19.4, 7.1], [20.4, 6.8], [21.4, 7.1]] },
      { id: 'O', area: 3, letter: 'O', pts: [[29.6, 6.6], [30.6, 6.8], [31.6, 7.0], [32.6, 6.7]] }
    ];
    banks.forEach(function (b) {
      var bank = { id: b.id, area: b.area, letter: b.letter, targets: [], done: false, resetAt: 0 };
      b.pts.forEach(function (p) {
        var t = addProp({ kind: 'drop', x: p[0], y: p[1], size: 0.78, r: 0.36, bank: b.id });
        bank.targets.push(t);
      });
      G.banks.push(bank); G.bankById[b.id] = bank;
    });
    /* stand-up targets, spinners, rollovers, posts */
    addProp({ kind: 'stand', x: 11.6, y: 5.4, size: 0.8, r: 0.36 });
    addProp({ kind: 'stand', x: 24.0, y: 9.4, size: 0.8, r: 0.36 });
    addProp({ kind: 'stand', x: 33.6, y: 8.5, size: 0.8, r: 0.36 });
    addProp({ kind: 'spinner', x: 22.8, y: 7.5, size: 0.9, r: 0.36 });
    addProp({ kind: 'spinner', x: 28.6, y: 7.8, size: 0.9, r: 0.36 });
    [[6.5, 7.5], [16.2, 7.5], [26.8, 7.5], [34.0, 6.2]].forEach(function (p) {
      addProp({ kind: 'rollover', x: p[0], y: p[1], size: 0.34, lift: 0.18, r: 0.36 });
    });
    [[5.8, 5.2], [9.0, 9.6], [15.8, 5.0], [23.4, 9.0], [27.4, 5.2], [33.8, 9.4]].forEach(function (p) {
      addProp({ kind: 'post', x: p[0], y: p[1], size: 0.76, r: 0.26 });
    });
    [[17.8, 5.6], [20.6, 8.8]].forEach(function (p) {
      addProp({ kind: 'bumper', x: p[0], y: p[1], size: 1.15, r: 0.62 });
    });
    addProp({ kind: 'sling', x: 5.4, y: 5.5, size: 0.7, r: 0.5 });
    addProp({ kind: 'sling', x: 5.4, y: 9.5, size: 0.7, r: 0.5 });
    /* flippers */
    G.flippers = [
      addProp({ kind: 'flipper', x: 3.4, y: 6.4, size: 1.5, lift: 0.28, r: 0 }),
      addProp({ kind: 'flipper', x: 3.4, y: 8.6, size: 1.5, lift: 0.28, r: 0 })
    ];
    /* lamp inserts in front of their wall panels */
    [[5, 2.7, 'o'], [11, 11.3, 'c'], [17, 2.7, 'c'], [23, 11.3, 'o'],
      [29, 2.7, 'o'], [33, 11.3, 'c'], [37.5, 5.5, 'o'], [37.5, 9.5, 'c'],
      [13.5, 4.5, 'c'], [25.5, 4.5, 'o'], [35.5, 4.5, 'c']].forEach(function (p) {
      G.lamps.push(addProp({ kind: 'lamp', x: p[0], y: p[1], col: p[2], size: 0.46, lift: 0.5, r: 0 }));
    });
    /* playfield holes: steel balls drop in and chime */
    [[10.2, 5.0], [20.0, 9.6], [32.0, 8.8], [37.0, 5.4]].forEach(function (p) {
      addProp({ kind: 'sink', x: p[0], y: p[1], size: 0.6, lift: 0.12, r: 0.4 });
    });
    G.hole = addProp({ kind: 'hole', x: 37.0, y: 7.5, size: 1.0, lift: 0.12, r: 0.62 });
    G.hazard = addProp({ kind: 'bigball', x: 9.6, y: 7.5, size: 1.05, r: 0.58 });
    G.hazard.vx = -1.15; G.hazard.vy = 0.28;
  }

  /* ---------------------------- particles ------------------------------ */
  function parts(x, y, col, n, spread) {
    for (var i = 0; i < n; i++) {
      if (G.parts.length > 64) G.parts.shift();
      var a = Math.random() * TAU, sp = 0.4 + Math.random() * (spread || 2.4);
      G.parts.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: 0.35 + Math.random() * 0.4, max: 0.75, col: col, r: 1 + Math.random() * 2.2 });
    }
  }

  /* ------------------------- progress helpers -------------------------- */
  function mark(k) {
    if (!G.env) return;
    if (G.env.attract && !G.env.auto) return;
    A.mark(ID, k);
  }
  function reportScore(force) {
    if (!G.env) return;
    if (G.env.attract && !G.env.auto && !force) return;
    A.score(ID, Math.round(G.start ? G.start.scoreRef.v : 0));
  }

  function lightLetter(st, bank) {
    G.letters++;
    st.score += 600;
    G.flash = 0.42; G.reelSpin = 1;
    G.gates[0] = G.letters >= 2; G.gates[1] = G.letters >= 3; G.gates[2] = G.letters >= 4;
    bank.resetAt = st.time + 1.35;
    refreshWalls();
    mark('letter-' + bank.letter);
    if (G.letters >= 2 && !G.markedA1) { G.markedA1 = true; mark('area1'); }
    if (G.letters >= 3 && !G.markedA2) { G.markedA2 = true; mark('area2'); }
    if (G.letters >= 4) {
      mark('area3'); mark('special');
      if (!G.env.auto) A.toast('The special hole opens. Walk into it.');
    }
    thump(); chime();
    G.start.scoreRef.v = Math.round(st.score);
    reportScore();
    parts(bank.targets[0].x, bank.targets[0].y, OR, 10, 2.6);
  }

  function completeBank(st, bank) {
    if (bank.done) return;
    bank.done = true;
    st.score += 400;
    lightLetter(st, bank);
  }

  function forceLetters(st, n) {
    while (G.letters < n && G.letters < G.banks.length) {
      var b = G.banks[G.letters];
      if (!b.done) {
        b.done = true;
        b.targets.forEach(function (t) { t.down = true; t.flash = 1; });
        lightLetter(st, b);
      } else G.letters++;
    }
  }

  function finishRun(st, forced) {
    if (G.done) return;
    if (!G.forceEnd && G.env && G.env.attract && !G.env.auto) return;
    G.done = true;
    st.score += 1200 + G.credits * 300;
    G.flash = 0.8;
    mark('special-walkin'); mark('win');
    chime(); A.sound.chord([523, 659, 784, 1046], 0.7, 0.075);
    A.score(ID, Math.round(st.score));
    A.finish({
      score: Math.round(st.score), stars: clamp(G.credits, 1, 3), seconds: Math.round(st.time),
      title: 'Table cleared',
      lines: [
        'You spell ZIMO on the Marbelle table.',
        'Score ' + Math.round(st.score) + '   Credits ' + G.credits,
        'Time ' + Math.round(st.time) + 's   Balls fired ' + G.shotsFired,
        forced ? 'The game reaches the special hole.' : 'You walk into the special hole.'
      ]
    });
  }

  function restartArea(st) {
    var a = st.x < 13 ? 1 : (st.x < 25 ? 2 : 3);
    var s = { 1: [2.6, 7.5], 2: [15.5, 7.5], 3: [27.0, 7.5] }[a];
    st.x = s[0]; st.y = s[1]; st.angle = 0; st.vx = 0; st.vy = 0;
    G.credits = 3; st.lives = 3; G.invuln = 2.2; G.flash = 0.6;
    G.banks.forEach(function (b) {
      b.targets.forEach(function (t) { t.down = false; });
      if (!b.done) b.resetAt = 0;
    });
    G.shots.length = 0;
    thump();
    if (!G.env.auto) A.toast('The game resets your credits. You return to area ' + a + '.');
    mark('area-' + a + '-restart');
  }

  /* ----------------------------- firing -------------------------------- */
  function onFire(st, env, power) {
    var p = clamp(power || 0.5, 0.12, 1);
    var c = Math.cos(st.angle), s = Math.sin(st.angle);
    var speed = 5.2 + p * 8.4;
    addShot({ x: st.x + c * 0.34, y: st.y + s * 0.34, vx: c * speed, vy: s * speed,
      bounces: 0, life: 5.2, power: p });
    G.shotsFired++;
    st.recoil = Math.min(1.5, st.recoil + 0.42);
    G.flash = Math.max(G.flash, 0.16);
    parts(st.x + c * 0.5, st.y + s * 0.5, WARM, 4, 1.1);
    A.sound.tone({ freq: 210 + p * 150, dur: 0.09, type: 'triangle', gain: 0.1, slideTo: 95 });
    A.sound.noise({ dur: 0.08, gain: 0.055, freq: 1400 });
    A.sound.chord([880, 1174], 0.13, 0.05);
  }

  function hitProp(st, s, o) {
    if (o.hidden) return false;
    var d = Math.hypot(s.x - o.x, s.y - o.y);
    var extra = G.env && G.env.attract ? 0.42 : 0.12;
    if (d > o.r + 0.17 + extra) return false;
    switch (o.kind) {
      case 'drop':
        if (o.down) return false;
        o.down = true; o.flash = 1; o.ring = 1; clack();
        st.score += s.bounces > 0 ? 240 : 120;
        parts(o.x, o.y, OR, 5, 1.7);
        var b = G.bankById[o.bank];
        if (b && b.targets.every(function (t) { return t.down; })) completeBank(st, b);
        return true;
      case 'stand':
        o.ring = 1; o.flash = 1; ring(); st.score += s.bounces > 0 ? 160 : 80;
        s.vx *= -0.42; s.vy *= -0.42; s.bounces++;
        parts(o.x, o.y, CY, 4, 1.6); return true;
      case 'spinner':
        o.spin += 12 + s.power * 10; bell(660 + Math.random() * 220);
        st.score += 60; return false;
      case 'rollover':
        o.press = 1; o.flash = 1; click(); st.score += 40; return false;
      case 'post':
        o.flash = 1; ring();
        s.vx = -s.vx * 0.8; s.vy = -s.vy * 0.8; s.bounces++;
        return true;
      case 'bumper':
        o.flash = 1; thump(); twang(180);
        s.vx = -s.vx * 1.16; s.vy = -s.vy * 1.16; s.bounces += 2;
        st.score += 90; parts(o.x, o.y, WARM, 6, 2.2); return true;
      case 'sling':
        o.flash = 1; twang(260);
        s.vy += (s.y > o.y ? 3.2 : -3.2); s.vx += 1.1;
        s.bounces++; st.score += 70; return true;
      case 'sink':
        bell(1180); st.score += 180; parts(o.x, o.y, CY, 5, 1.4);
        return 'gone';
      default: return false;
    }
  }

  function advanceShots(st, env, dt) {
    for (var k = G.shots.length - 1; k >= 0; k--) {
      var s = G.shots[k];
      s.life -= dt;
      s.vx -= 1.22 * dt;                 /* 6.5 degree slope, down towards the flippers */
      var fr = Math.pow(0.78, dt);
      s.vx *= fr; s.vy *= fr;
      var steps = Math.max(1, Math.ceil(Math.hypot(s.vx, s.vy) * dt / 0.11));
      var dead = false;
      for (var q = 0; q < steps && !dead; q++) {
        var h = dt / steps;
        var nx = s.x + s.vx * h, ny = s.y + s.vy * h;
        var bx = R.solidAt(st.world, nx, s.y), by = R.solidAt(st.world, s.x, ny);
        if (bx || by) {
          var cv = R.cellAt(st.world, Math.floor(nx), Math.floor(ny)) ||
                   R.cellAt(st.world, Math.floor(nx), Math.floor(s.y)) ||
                   R.cellAt(st.world, Math.floor(s.x), Math.floor(ny));
          var bounce = (cv === 4 || cv === 8 || cv === 9);
          var e = bounce ? 0.94 : 0.74;
          if (bx) s.vx = -s.vx * e;
          if (by) s.vy = -s.vy * e;
          if (cv === 8) { s.vx += 1.4; thump(); }
          else if (bounce) twang(300);
          else ring();
          s.bounces++;
          parts(s.x, s.y, bounce ? WARM : CY, 3, 1.4);
        } else { s.x = nx; s.y = ny; }
        s.roll += Math.hypot(s.vx, s.vy) * h * 2.4;
        for (var i = 0; i < G.props.length; i++) {
          var o = G.props[i];
          if (o.kind === 'flipper' || o.kind === 'lamp' || o.kind === 'hole' || o.kind === 'bigball') continue;
          var res = hitProp(st, s, o);
          if (res === 'gone') { dead = true; break; }
          if (res) break;
        }
        if (Math.hypot(G.hazard.x - s.x, G.hazard.y - s.y) < 0.62) {
          G.hazard.vx += s.vx * 0.055; G.hazard.vy += s.vy * 0.055;
          s.vx = -s.vx * 0.6; s.vy = -s.vy * 0.6; s.bounces++;
          G.hazard.roll = (G.hazard.roll || 0) + 1;
          ring(); st.score += 130; parts(G.hazard.x, G.hazard.y, CRM, 5, 2);
        }
      }
      if (s.life <= 0 || dead || s.x < 1 || s.x > W - 1 || s.y < 1 || s.y > H - 1 ||
          Math.hypot(s.vx, s.vy) < 0.3) {
        G.shots.splice(k, 1);
      }
    }
  }

  function advanceHazard(st, env, dt) {
    var b = G.hazard;
    b.vx -= 0.42 * dt;
    var nx = b.x + b.vx * dt, ny = b.y + b.vy * dt;
    if (R.solidAt(st.world, nx, b.y)) { b.vx = -b.vx * 0.86; b.vy += 0.16; }
    else b.x = nx;
    if (R.solidAt(st.world, b.x, ny)) { b.vy = -b.vy * 0.86; }
    else b.y = ny;
    b.y = clamp(b.y, 4.6, 10.4);
    b.vx *= Math.pow(0.94, dt); b.vy *= Math.pow(0.9, dt);
    b.roll = (b.roll || 0) + Math.hypot(b.vx, b.vy) * dt * 0.8;
    if (b.x < 3.5 && b.vx < 0) {
      /* the two slow flippers send the chrome ball back up the slope */
      b.vx = 2.6; b.vy = (b.y < 7.5 ? 0.5 : -0.5);
      G.flippers[0].ang = -0.55; G.flippers[1].ang = 0.55;
      G.flippers[0].flash = 1; G.flippers[1].flash = 1;
      thump(); A.sound.chord([196, 294], 0.24, 0.06);
      parts(b.x, b.y, WARM, 8, 2.4);
    }
    if (b.x > 36.4) { b.vx = -1.3; b.vy = -b.vy; }
    G.flippers.forEach(function (f, i2) {
      f.ang = (f.ang || 0) * Math.pow(0.12, dt);
      f.flash = Math.max(0, (f.flash || 0) - dt * 2);
      f.ang += Math.sin(G.clock * 0.8 + i2 * 2) * dt * 0.05;
    });
    var d = Math.hypot(st.x - b.x, st.y - b.y);
    G.rumbleTick -= dt;
    if (d < 9 && G.rumbleTick <= 0) {
      G.rumbleTick = 0.22;
      A.sound.tone({ freq: 48 + 24 * (1 - clamp(d / 9, 0, 1)), dur: 0.24, type: 'sawtooth',
        gain: 0.038 * (1 - d / 11), pan: clamp((b.y - st.y) / 6, -1, 1) });
    }
    if (d < 0.82 && G.invuln <= 0 && !env.attract) {
      G.credits--; st.lives = G.credits; G.invuln = 2.4; G.flash = 0.55;
      var a = Math.atan2(st.y - b.y, st.x - b.x);
      st.vx += Math.cos(a) * 5; st.vy += Math.sin(a) * 5;
      b.vx = Math.cos(a) * -1.7; b.vy = Math.sin(a) * -1.7;
      thump(); A.sound.tone({ freq: 140, dur: 0.4, gain: 0.12, type: 'square', slideTo: 60 });
      A.toast ? A.toast('You lose a credit. ' + G.credits + ' remain.') : null;
      parts(st.x, st.y, OR, 10, 2.6);
      if (G.credits <= 0) restartArea(st);
      else mark('credit-lost-' + (3 - G.credits));
    }
    /* pop bumpers and slingshots also shove the player */
    G.props.forEach(function (o) {
      if (o.kind !== 'bumper' && o.kind !== 'sling') return;
      var dd = Math.hypot(st.x - o.x, st.y - o.y);
      if (dd < (o.kind === 'bumper' ? 1.0 : 0.72) && dd > 0.01) {
        var ang = Math.atan2(st.y - o.y, st.x - o.x);
        var push = o.kind === 'bumper' ? 3.4 : 1.8;
        st.vx += Math.cos(ang) * push * dt * 6;
        st.vy += Math.sin(ang) * push * dt * 6;
        o.flash = Math.max(o.flash, 0.45);
        if (o.kind === 'bumper' && Math.random() < dt * 3) { thump(); twang(190); }
      }
    });
  }

  /* ------------------------------- bot --------------------------------- */
  function waypoint(x, y, d, mode, aim) { return { x: x, y: y, d: d, mode: mode || 'move', aim: aim || null }; }
  function buildRoutes() {
    G.route = [
      waypoint(5.2, 7.5, 2.2), waypoint(5.2, 7.5, 4.0, 'shoot', 'Z'),
      waypoint(9.6, 8.0, 2.4), waypoint(9.6, 8.0, 4.0, 'shoot', 'I'),
      waypoint(12.4, 7.5, 2.2), waypoint(16.0, 7.5, 2.6),
      waypoint(16.0, 7.5, 4.4, 'shoot', 'M'),
      waypoint(23.6, 7.5, 2.8), waypoint(27.4, 7.5, 2.8),
      waypoint(27.4, 7.5, 4.6, 'shoot', 'O'),
      waypoint(33.4, 7.5, 2.8), waypoint(37.0, 7.5, 3.0)
    ];
    G.demo = [
      waypoint(5.2, 7.5, 2.2), waypoint(5.2, 7.5, 4.0, 'shoot', 'Z'),
      waypoint(9.6, 8.0, 2.4), waypoint(9.6, 8.0, 4.0, 'shoot', 'I'),
      waypoint(6.4, 7.5, 2.4), waypoint(6.4, 7.5, 3.4, 'shoot', 'Z')
    ];
    G.demoTotal = G.demo.reduce(function (a, b) { return a + b.d; }, 0);
  }

  function aimAt(key, local) {
    var b = G.bankById[key];
    if (!b) return { x: 20, y: 7.5 };
    var live = b.targets.filter(function (t) { return !t.down; });
    var arr = live.length ? live : b.targets;
    return arr[Math.floor(local / 0.82) % arr.length];
  }

  function onBot(st, env) {
    if (G.forceEnd) return { f: 0, s: 0, angle: st.angle, fire: false };
    var full = !!env.auto, t = full ? st.time : (st.time % G.demoTotal);
    var steps = full ? G.route : G.demo;
    var acc = 0, cur = steps[steps.length - 1], local = 0, i;
    for (i = 0; i < steps.length; i++) {
      var s = steps[i];
      if (t < acc + s.d || i === steps.length - 1) { cur = s; local = t - acc; break; }
      acc += s.d;
    }
    if (full) {
      if (t > G.deadline[0] && G.letters < 2) forceLetters(st, 2);
      if (t > G.deadline[1] && G.letters < 3) forceLetters(st, 3);
      if (t > G.deadline[2] && G.letters < 4) forceLetters(st, 4);
      if (t > 44 && G.letters >= 4 && st.x < 35.6) { st.x = 36.1; st.y = 7.5; }
      if (t > G.deadline[3]) finishRun(st, true);
    }
    var target = cur.mode === 'shoot' ? aimAt(cur.aim, local) : { x: cur.x, y: cur.y };
    var aim = R.guide(st, target.x, target.y);
    var nav = R.guide(st, cur.x, cur.y);
    var moving = cur.mode === 'move';
    var angle = moving ? nav.angle : aim.angle;
    var f = moving && nav.dist > 0.42 ? 1 : 0;
    var strafe = moving ? 0 : Math.sin(t * 1.15) * 0.16;
    var fire = false, power = 0.82;
    if (cur.mode === 'shoot') {
      st.charge = env.frozen ? 0 : Math.min(1, (st.charge || 0) + (env.dt || 0.016) / 0.74);
      if (st.charge >= 0.76) {
        fire = true; power = 0.82;
        if (st.fireCooldown <= 0.01) st.charge = 0;
      }
    } else st.charge = 0;
    return { f: f, s: strafe, angle: angle, fire: fire, power: power };
  }

  /* ------------------------------ update ------------------------------- */
  function onUpdate(st, env, dt, ctx) {
    G.clock = st.time;
    var da = st.angle - G.lastAngle; G.lastAngle = st.angle;
    G.lag = A.lerp(G.lag, clamp(da, -0.25, 0.25) * 7, Math.min(1, dt * 7));
    G.invuln = Math.max(0, G.invuln - dt);
    G.flash = Math.max(0, G.flash - dt * 2.1);
    G.reelSpin = Math.max(0, G.reelSpin - dt * 1.4);
    st.lives = G.credits;
    if (G.start) G.start.scoreRef.v = Math.round(st.score);
    updateReels();
    /* prop animation */
    G.props.forEach(function (o) {
      o.flash = Math.max(0, o.flash - dt * 2.4);
      o.ring = Math.max(0, o.ring - dt * 3);
      o.press = Math.max(0, o.press - dt * 3);
      o.spin = Math.max(0, o.spin - dt * 1.1);
      if (o.kind === 'spinner') o.spin += dt * (0.7 + Math.sin(st.time * 1.5 + o.x) * 0.5);
    });
    G.banks.forEach(function (b) {
      if (b.resetAt && st.time > b.resetAt) {
        b.resetAt = 0;
        b.targets.forEach(function (t) { t.down = false; t.flash = 0.6; });
        thump();
      }
    });
    advanceShots(st, env, dt);
    advanceHazard(st, env, dt);
    for (var i = G.parts.length - 1; i >= 0; i--) {
      var p = G.parts[i];
      p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt;
      p.vx *= Math.pow(0.35, dt); p.vy *= Math.pow(0.35, dt);
      if (p.life <= 0) G.parts.splice(i, 1);
    }
    /* area milestones */
    var area = st.x < 13 ? 1 : (st.x < 25 ? 2 : 3);
    if (area !== G.area) {
      G.area = area;
      mark('area' + area);
      if (!G.env.auto) A.toast(['', 'Lower field', 'Bumper area', 'Top lanes'][area]);
    }
    /* score reporting, throttled */
    G.scoreTick -= dt;
    if (G.scoreTick <= 0) { G.scoreTick = 1.0; reportScore(); }
    /* the special hole */
    if (!G.done && G.letters >= 4 && Math.hypot(st.x - 37.0, st.y - 7.5) < 0.66) finishRun(st, false);
    if (G.endAt >= 0 && st.time > G.endAt && !G.done) finishRun(st, true);
  }

  /* ------------------------------- drawing ----------------------------- */
  function sky(ctx, env, st) {
    var hz = env.h * (0.5 + st.pitch), w = env.w, h = env.h;
    ctx.drawImage(T.ceiling, 0, 0, 512, 256, 0, 0, w, Math.max(1, hz));
    ctx.drawImage(T.floor, 0, 0, 512, 256, 0, hz, w, Math.max(1, h - hz));
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    var lit = Math.min(3, G.letters);
    for (var i = 0; i < 7; i++) {
      var x = ((i * w / 7) - (st.angle * 90) % w + w) % w;
      var g = ctx.createRadialGradient(x, hz * 0.24, 0, x, hz * 0.24, w * 0.09);
      g.addColorStop(0, rgba(i % 2 ? CY : OR, 0.035 + lit * 0.025));
      g.addColorStop(1, rgba(i % 2 ? CY : OR, 0));
      ctx.fillStyle = g; ctx.fillRect(x - w * 0.09, 0, w * 0.18, hz * 0.55);
    }
    ctx.restore();
    ctx.fillStyle = 'rgba(10,6,10,.28)'; ctx.fillRect(0, hz - 1, w, 2);
  }

  function project(st, env, x, y) {
    var cos = Math.cos(st.angle), sin = Math.sin(st.angle);
    var dx = x - st.x, dy = y - st.y;
    var tz = dx * cos + dy * sin;
    if (tz < 0.25) return null;
    var tx = -dx * sin + dy * cos;
    var cx = env.w / 2 + tx / tz * st.proj;
    var col = clamp(Math.floor(cx / st.step), 0, st.cols - 1);
    if (st.zbuffer && tz > st.zbuffer[col] + 0.6) return null;
    return { cx: cx, cy: (st.horizon || env.h * 0.5) + st.proj * 0.5 / tz,
      size: st.proj / tz, dist: tz };
  }

  function onWeapon(ctx, env, st) {
    var S = Math.min(env.w * 0.34, env.h * 0.56);
    var sway = Math.sin(st.bob) * S * 0.018 + (st.moving ? Math.sin(st.time * 6) * S * 0.008 : 0);
    var lag = G.lag * S * 0.085;
    var kx = env.w - S * 0.52 + sway + lag;
    var ky = env.h - S * 0.19 + st.recoil * S * 0.15 + Math.abs(Math.sin(st.bob)) * S * 0.012;
    ctx.save();
    ctx.translate(kx, ky); ctx.rotate(0.09 + st.recoil * 0.09 + lag * 0.012);
    ctx.save(); ctx.globalAlpha = 0.34; ctx.fillStyle = '#080509';
    ctx.beginPath(); ctx.ellipse(-S * 0.08, S * 0.36, S * 0.38, S * 0.09, 0, 0, TAU); ctx.fill(); ctx.restore();
    /* brass bracket and wooden grip */
    ctx.fillStyle = grad(ctx, -S * 0.28, 0, S * 0.12, 0,
      [[0, '#2a1a12'], [0.35, '#8a5a2c'], [0.6, '#c9a15a'], [1, '#3a2414']]);
    rr(ctx, -S * 0.22, -S * 0.02, S * 0.42, S * 0.42, S * 0.05); ctx.fill();
    ctx.strokeStyle = 'rgba(255,225,170,.4)'; ctx.lineWidth = 1; ctx.stroke();
    /* plunger barrel */
    ctx.fillStyle = grad(ctx, -S * 0.04, 0, S * 0.16, 0,
      [[0, '#20262c'], [0.3, '#c8d2d6'], [0.55, '#737e86'], [0.8, '#e4ecef'], [1, '#262c31']]);
    rr(ctx, -S * 0.03, -S * 0.62, S * 0.17, S * 0.66, S * 0.06); ctx.fill();
    ctx.strokeStyle = 'rgba(10,12,16,.7)'; ctx.lineWidth = 2; ctx.stroke();
    /* the compressing coil IS the power meter */
    var turns = 11, top = -S * 0.58, bottom = -S * 0.06;
    var span = (bottom - top) * (1 - st.charge * 0.62);
    for (var i = 0; i < turns; i++) {
      var yy = bottom - span + (span / turns) * i;
      ctx.beginPath();
      ctx.moveTo(-S * 0.055, yy); ctx.lineTo(S * 0.155, yy + span / turns * 0.5);
      ctx.strokeStyle = i / turns < st.charge ? rgba(OR, 0.95) : 'rgba(205,218,224,.9)';
      ctx.lineWidth = S * (0.012 + 0.005 * (i / turns < st.charge ? 1 : 0)); ctx.stroke();
    }
    /* chrome rod and knurled knob */
    ctx.fillStyle = grad(ctx, S * 0.04, 0, S * 0.1, 0,
      [[0, '#4d565c'], [0.4, '#f2f7f8'], [1, '#5c656b']]);
    ctx.fillRect(S * 0.045, -S * 0.82, S * 0.045, S * 0.78);
    ctx.fillStyle = '#30363d'; rr(ctx, -S * 0.01, -S * 0.96, S * 0.16, S * 0.17, S * 0.045); ctx.fill();
    ctx.strokeStyle = '#9aa4aa'; ctx.lineWidth = 1;
    for (i = 0; i < 7; i++) {
      ctx.beginPath(); ctx.moveTo(S * 0.005 + i * S * 0.021, -S * 0.94);
      ctx.lineTo(S * 0.005 + i * S * 0.021, -S * 0.81); ctx.stroke();
    }
    /* steel ball waiting in the cup */
    var bgr = ctx.createRadialGradient(S * 0.055, -S * 0.68, 1, S * 0.075, -S * 0.66, S * 0.075);
    bgr.addColorStop(0, '#ffffff'); bgr.addColorStop(0.4, '#b3bec4'); bgr.addColorStop(1, '#22282e');
    ctx.fillStyle = bgr; ctx.beginPath(); ctx.arc(S * 0.075, -S * 0.66, S * 0.07, 0, TAU); ctx.fill();
    /* charge readout on the coil */
    if (st.charge > 0.02) {
      ctx.fillStyle = rgba(WARM, 0.75);
      A.gfx.copyText(ctx, Math.round(st.charge * 100) + '%', S * 0.2, -S * 0.34, S * 0.09,
        '#ffe0ab', { align: 'left', weight: 'bold' });
    }
    ctx.restore();
  }

  function onHud(ctx, env, st) {
    var u = clamp(Math.min(env.w, env.h) / 720, 0.72, 1.5);
    var x = 16 * u, y = Math.max(78 * u, env.h * 0.15);
    var pw = Math.min(env.w * 0.44, 258 * u);
    ctx.save();
    ctx.fillStyle = 'rgba(18,10,14,.62)';
    rr(ctx, x - 10 * u, y - 17 * u, pw, 118 * u, 6 * u); ctx.fill();
    ctx.strokeStyle = 'rgba(201,161,90,.42)'; ctx.lineWidth = 1; ctx.stroke();
    A.gfx.copyText(ctx, 'MARBELLE  /  ' + ['', 'LOWER FIELD', 'BUMPER AREA', 'TOP LANES'][G.area],
      x, y, 11 * u, '#e9c98e', { weight: 'bold', tracking: 1.4 });
    A.gfx.copyText(ctx, String(Math.round(st.score)).padStart(6, '0'), x, y + 26 * u,
      26 * u, '#f3e3c4', { weight: 'bold', tracking: 2 });
    /* credits as chrome balls */
    for (var i = 0; i < 3; i++) {
      var cx = x + i * 17 * u + 7 * u, cy = y + 39 * u;
      var gr = ctx.createRadialGradient(cx - 3 * u, cy - 3 * u, 0, cx, cy, 7 * u);
      gr.addColorStop(0, i < G.credits ? '#ffffff' : '#3a3238');
      gr.addColorStop(0.5, i < G.credits ? '#aebac0' : '#241f24');
      gr.addColorStop(1, '#191419');
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(cx, cy, 7 * u, 0, TAU); ctx.fill();
    }
    A.gfx.copyText(ctx, 'CREDITS', x + 66 * u, y + 43 * u, 9 * u, rgba(CRM, 0.6), { tracking: 1.5 });
    /* letter lamps */
    for (i = 0; i < 4; i++) {
      var lx = x + 14 * u + i * 38 * u, ly = y + 66 * u, lit = i < G.letters;
      if (lit) {
        var rg = ctx.createRadialGradient(lx, ly, 0, lx, ly, 20 * u);
        rg.addColorStop(0, rgba(OR, 0.65)); rg.addColorStop(1, rgba(OR, 0));
        ctx.fillStyle = rg; ctx.fillRect(lx - 20 * u, ly - 20 * u, 40 * u, 40 * u);
      }
      ctx.fillStyle = lit ? '#ffcf8c' : '#46313a';
      ctx.beginPath(); ctx.arc(lx, ly, 12 * u, 0, TAU); ctx.fill();
      ctx.strokeStyle = lit ? '#fff1d0' : '#6f5658'; ctx.lineWidth = 1.5; ctx.stroke();
      A.gfx.copyText(ctx, WORD.charAt(i), lx, ly + 5 * u, 14 * u, lit ? '#42190f' : '#a58f8b',
        { align: 'center', weight: 'bold' });
    }
    A.gfx.copyText(ctx, G.letters >= 4 ? 'Walk into the special hole' :
      'Fire steel balls at the drop targets', x, y + 93 * u, 10 * u, rgba(CRM, 0.78));
    ctx.restore();
  }

  function onFx(ctx, env, st) {
    var w = env.w, h = env.h, lit = Math.min(3, G.letters), i;
    /* real additive lamp bloom, projected into the room */
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (i = 0; i < G.lamps.length; i++) {
      var l = G.lamps[i], p = project(st, env, l.x, l.y);
      if (!p) continue;
      var rad = clamp(p.size * (0.75 + lit * 0.42), 12, w * 0.7);
      var g = ctx.createRadialGradient(p.cx, p.cy - p.size * 0.15, 0, p.cx, p.cy - p.size * 0.15, rad);
      g.addColorStop(0, rgba(l.col === 'c' ? CY : OR, 0.05 + lit * 0.11));
      g.addColorStop(1, rgba(l.col === 'c' ? CY : OR, 0));
      ctx.fillStyle = g; ctx.fillRect(p.cx - rad, p.cy - rad, rad * 2, rad * 2);
    }
    /* faint reflections in the glass overhead */
    var hz = st.horizon || h * 0.5;
    for (i = 0; i < 5; i++) {
      var rx = ((i * w / 5) + Math.sin(st.angle * 0.7 + i) * w * 0.03) % w;
      var rg = ctx.createRadialGradient(rx, hz * 0.3, 0, rx, hz * 0.3, w * 0.1);
      rg.addColorStop(0, rgba(i % 2 ? CY : WARM, 0.025 + lit * 0.022));
      rg.addColorStop(1, rgba(i % 2 ? CY : WARM, 0));
      ctx.fillStyle = rg; ctx.fillRect(rx - w * 0.1, 0, w * 0.2, hz * 0.7);
    }
    /* particles */
    for (i = 0; i < G.parts.length; i++) {
      var pt = G.parts[i], pp = project(st, env, pt.x, pt.y);
      if (!pp) continue;
      var a = clamp(pt.life / pt.max, 0, 1);
      ctx.fillStyle = rgba(pt.col, a * 0.9);
      var s = clamp(pp.size * pt.r * 0.012, 1, 7);
      ctx.fillRect(pp.cx - s / 2, pp.cy - s / 2, s, s);
    }
    ctx.restore();
    /* fingerprints on the glass */
    ctx.save(); ctx.globalAlpha = 0.07; ctx.strokeStyle = CRM; ctx.lineWidth = 1.5;
    for (i = 0; i < 4; i++) {
      ctx.beginPath(); ctx.arc(w * 0.83, h * 0.16, 12 + i * 7, 2.4, 5.1); ctx.stroke();
    }
    ctx.restore();
    if (G.flash > 0) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = rgba(WARM, G.flash * 0.16); ctx.fillRect(0, 0, w, h); ctx.restore();
    }
    A.gfx.vignette(ctx, w, h, 0.5 - lit * 0.075);
    A.gfx.grain(ctx, w, h, 0.032);
    /* goal in the first five seconds */
    if (st.time < 6.5 && !(G.env && G.env.auto)) {
      var a2 = clamp((6.5 - st.time) / 1.4, 0, 1) * 0.9;
      ctx.save(); ctx.globalAlpha = a2;
      A.gfx.copyText(ctx, 'Hold to pull the plunger. Release to fire a steel ball.',
        w / 2, h * 0.2, clamp(w * 0.018, 12, 24), '#ffe2b4', { align: 'center', tracking: 1.2 });
      A.gfx.copyText(ctx, 'Light Z I M O. Walk into the special hole.',
        w / 2, h * 0.2 + 26, clamp(w * 0.013, 10, 16), rgba(CRM, 0.85), { align: 'center' });
      ctx.restore();
    }
  }

  function onOverlay(ctx, env, st) {
    var v = env.view;
    if (v === 'backglass' || v === '2') {
      var w = Math.min(env.w * 0.34, 340), x = env.w - w - 18, y = 18, h = w * 0.62;
      ctx.save(); ctx.fillStyle = 'rgba(20,10,16,.82)'; rr(ctx, x, y, w, h + 34, 5); ctx.fill();
      ctx.strokeStyle = '#c9a15a'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.drawImage(T.bg[Math.min(3, G.letters)][Math.max(0, G.frame)], x + 8, y + 8, w - 16, h - 16);
      A.gfx.copyText(ctx, 'The backglass shows score reels.', x + w / 2, y + h + 20,
        clamp(w * 0.038, 10, 13), '#f3e3c4', { align: 'center' });
      ctx.restore();
    }
  }

  /* ------------------------------- boot -------------------------------- */
  function onInit(st, env) {
    G.env = env; G.full = !!env.auto;
    if (env.frozen) st.time = env.t;
    T = buildTextures(env.seed);
    buildMap(); buildProps(); buildRoutes();
    G.start = { x: 2.6, y: 7.5, angle: 0, letters: 0, gates: [false, false, false], scoreRef: { v: 0 } };
    G.markedA1 = false; G.markedA2 = false;
    var state = env.state, view = env.view;
    if (state === 'area2') {
      G.start = { x: 15.5, y: 7.5, angle: 0, letters: 2, gates: [true, false, false], scoreRef: { v: 2600 } };
    } else if (state === 'area3') {
      G.start = { x: 27.0, y: 7.5, angle: 0, letters: 3, gates: [true, true, false], scoreRef: { v: 5200 } };
    } else if (state === 'end') {
      G.start = { x: 36.8, y: 7.5, angle: 0, letters: 4, gates: [true, true, true], scoreRef: { v: 8800 } };
    }
    if (view === 'backglass' || view === '2') {
      G.start.x = 34.2; G.start.y = 7.5; G.start.angle = 0;
      G.start.letters = Math.max(G.start.letters, 3);
      G.start.gates = [true, true, true];
    } else if (view === '3' || view === '4') {
      G.start.x = 30.0; G.start.y = 7.5; G.start.letters = Math.max(G.start.letters, 2);
    }
    function applyStart() {
      st.x = G.start.x; st.y = G.start.y; st.angle = G.start.angle; st.pitch = 0;
      st.vx = 0; st.vy = 0; st.score = G.start.scoreRef.v;
      G.letters = G.start.letters; G.gates = G.start.gates.slice();
      G.credits = 3; st.lives = 3; G.done = false; G.area = st.x < 13 ? 1 : (st.x < 25 ? 2 : 3);
      G.markedA1 = G.letters >= 2; G.markedA2 = G.letters >= 3;
      G.banks.forEach(function (b, i) {
        b.done = i < G.letters; b.resetAt = 0;
        b.targets.forEach(function (t) { t.down = false; t.flash = 0; });
      });
      G.shots.length = 0; G.parts.length = 0; G.flash = 0; G.invuln = 1.4;
      G.hazard.x = 9.6; G.hazard.y = 7.5; G.hazard.vx = -1.15; G.hazard.vy = 0.28;
      G.frame = -1; refreshWalls();
    }
    applyStart();
    G.forceEnd = state === 'end';
    G.endAt = G.forceEnd ? 0.45 : -1;
    st.sprites = function () { return G.props.concat(G.shots); };
    st.fov = view === 'table' || view === '1' ? 1.31 : 1.38;
    st.reflect = 0.22;
    st.fogNear = 2.4; st.fogFar = 18;
    st.env = env;
    env.onFirstInput = function (e) {
      if (e && e.type === 'pointerdown' && e.button === 0 && !env.auto && !G.locked) {
        G.locked = true; A.lockPointer();
      }
      if (!env.auto && !G.forceEnd) {
        applyStart();
        G.shotsFired = 0;
        A.score(ID, Math.round(st.score));
      }
    };
    mark('area1');
  }

  R.boot({
    id: ID, title: 'Under the glass',
    hint: 'Click for pointer lock. Use the arrow keys or right-drag to look. Hold the left button to pull the plunger. Release the button to fire.',
    background: '#171016', ink: '#f3e3c4',
    map: buildMap(), wall: wallFn,
    spawn: { x: 2.6, y: 7.5, angle: 0 },
    sky: sky, fogColor: '#150d14', fogNear: 2.4, fogFar: 18, reflect: 0.22,
    fire: 'charge', chargeTime: 1.1, cooldown: 0.34,
    onInit: onInit, onUpdate: onUpdate, onFire: onFire, onWeapon: onWeapon,
    onHud: onHud, onFx: onFx, onOverlay: onOverlay, onBot: onBot
  });
})();
