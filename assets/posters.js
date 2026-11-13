/* The Thirteen - procedural card pictures. One small painting per game,
   drawn once into a 480x300 canvas. No image files, no network requests. */
(function (root) {
  'use strict';
  var A = root.Arcade;
  var W = 480, H = 300;

  function poly(ctx, pts, fill, stroke, lw) {
    ctx.beginPath();
    for (var i = 0; i < pts.length; i++) { if (i) ctx.lineTo(pts[i][0], pts[i][1]); else ctx.moveTo(pts[i][0], pts[i][1]); }
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); }
  }
  function circle(ctx, x, y, r, fill) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); }
  function line(ctx, x0, y0, x1, y1, color, lw) {
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.strokeStyle = color; ctx.lineWidth = lw || 1; ctx.stroke();
  }
  function rect(ctx, x, y, w, h, fill) { ctx.fillStyle = fill; ctx.fillRect(x, y, w, h); }

  function draw(canvas, g) {
    var ctx = canvas.getContext('2d');
    canvas.width = W; canvas.height = H;
    var r = A.rng(g.original * 7919 + 41);
    var p = g.palette;
    // base wash
    ctx.fillStyle = A.gfx.linear(ctx, 0, 0, W, H, [[0, p.bg], [1, p.bg]]);
    ctx.fillRect(0, 0, W, H);

    switch (g.id) {
      case 'delphi': {
        rect(ctx, 0, 0, W, H, '#e9e1cf');
        ctx.fillStyle = A.gfx.radial(ctx, 230, 130, 20, 230, 130, 300, [[0, '#fffaf0'], [1, '#c9c1ae']]);
        ctx.fillRect(0, 0, W, H);
        // marble bust
        ctx.save(); ctx.translate(226, 150);
        ctx.beginPath();
        ctx.moveTo(-64, 116); ctx.bezierCurveTo(-72, 60, -52, 18, -36, -14);
        ctx.bezierCurveTo(-32, -72, 32, -72, 38, -12);
        ctx.bezierCurveTo(54, 20, 70, 62, 66, 116); ctx.closePath();
        ctx.fillStyle = A.gfx.linear(ctx, -70, 0, 70, 0, [[0, '#a9a9a0'], [.35, '#f9f6ee'], [.7, '#dcd8cd'], [1, '#989a94']]);
        ctx.fill();
        ctx.strokeStyle = 'rgba(60,70,76,.35)'; ctx.lineWidth = 1.4; ctx.stroke();
        for (var i = 0; i < 16; i++) line(ctx, -60 + r() * 120, -60 + r() * 160, -25 + r() * 50, -50 + r() * 150, 'rgba(95,115,125,' + (0.04 + r() * 0.07) + ')', 0.6 + r());
        ctx.restore();
        // hologram scan
        var sy = 92 + Math.sin(Date.now() / 2000) * 4;
        rect(ctx, 24, sy, W - 48, 2, 'rgba(70,130,145,.75)');
        for (var s = 0; s < 9; s++) line(ctx, 165 + s * 16, sy - 52, 165 + s * 16, sy + 92, 'rgba(60,130,145,.16)', 1);
        for (var q = 0; q < 7; q++) line(ctx, 160, sy - 50 + q * 22, 310, sy - 42 + q * 22, 'rgba(60,130,145,.13)', 1);
        // greek key border
        ctx.strokeStyle = '#b08436'; ctx.lineWidth = 2;
        for (var k = 0; k < 14; k++) {
          var x = 12 + k * 33; ctx.strokeRect(x, 8, 22, 8); ctx.strokeRect(x, 284, 22, 8);
        }
        line(ctx, 10, 20, 470, 20, 'rgba(176,132,54,.35)', 1); line(ctx, 10, 280, 470, 280, 'rgba(176,132,54,.35)', 1);
        break;
      }
      case 'tile-river': {
        rect(ctx, 0, 0, W, H, '#eae5d9');
        var tw = 80, th = 60;
        for (var y = 0; y < 5; y++) for (var x = 0; x < 6; x++) {
          var px = x * tw, py = y * th;
          rect(ctx, px + 1.5, py + 1.5, tw - 3, th - 3, '#f6f3e9');
          ctx.strokeStyle = 'rgba(40,60,80,.08)'; ctx.strokeRect(px + 1.5, py + 1.5, tw - 3, th - 3);
          for (var c = 0; c < 3; c++) line(ctx, px + r() * tw, py + r() * th, px + r() * tw, py + r() * th, 'rgba(60,80,100,.045)', .5);
          // a blue sweep crossing the wall
          var cx = px + tw / 2, cy = py + th / 2;
          var wave = Math.sin((x * 0.9 + y * 0.65)) * 22 + 150;
          if (Math.abs(cy - wave) < 34) {
            A.gfx.paintStroke(ctx, [[px, cy - 12], [px + 20, cy - 4], [px + 45, cy + 8], [px + tw, cy + 2]], '#24508f', 15, x * 31 + y * 7 + 1, { passes: 4, jitter: 5, alpha: .6 });
            A.gfx.paintStroke(ctx, [[px, cy - 12], [px + 20, cy - 4], [px + 45, cy + 8], [px + tw, cy + 2]], '#6fa0cf', 5, x * 13 + y * 3 + 2, { passes: 2, jitter: 3, alpha: .8 });
          }
        }
        for (var g2 = 0; g2 < 6; g2++) line(ctx, g2 * tw, 0, g2 * tw, H, 'rgba(70,65,55,.28)', 2);
        for (var g3 = 0; g3 < 5; g3++) line(ctx, 0, g3 * th, W, g3 * th, 'rgba(70,65,55,.28)', 2);
        circle(ctx, 54, 150, 9, '#255a9c'); circle(ctx, 54, 150, 4, '#dce9f3');
        break;
      }
      case 'tarn': {
        rect(ctx, 0, 0, W, H, '#0a0b0c');
        ctx.fillStyle = A.gfx.radial(ctx, 230, 110, 10, 230, 110, 340, [[0, '#252726'], [1, '#08090a']]); ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = A.gfx.linear(ctx, 80, 40, 400, 70, [[0, 'rgba(255,255,255,0)'], [.5, 'rgba(226,229,226,.18)'], [1, 'rgba(255,255,255,0)']]);
        ctx.fillRect(50, 48, 380, 22);
        // cylinder
        ctx.fillStyle = A.gfx.linear(ctx, 90, 0, 390, 0, [[0, '#171819'], [.35, '#35383a'], [.62, '#101112'], [1, '#282b2c']]);
        A.gfx.rr(ctx, 88, 176, 304, 88, 14); ctx.fill();
        for (var h = 0; h < 46; h++) circle(ctx, 102 + h * 6.3, 190, 1.1, 'rgba(190,200,200,.32)');
        ctx.strokeStyle = 'rgba(200,210,210,.25)'; A.gfx.rr(ctx, 88, 176, 304, 88, 14); ctx.stroke();
        // ferrofluid crown
        ctx.save(); ctx.beginPath(); ctx.ellipse(240, 168, 104, 24, 0, 0, Math.PI * 2); ctx.clip();
        rect(ctx, 130, 140, 220, 50, '#090a0b');
        for (var sp = -4; sp <= 4; sp++) {
          var sx = 240 + sp * 24, hh = 22 + Math.max(0, 44 - Math.abs(sp) * 10);
          poly(ctx, [[sx - 11, 172], [sx, 172 - hh], [sx + 11, 172]],
            A.gfx.linear(ctx, sx - 12, 0, sx + 12, 0, [[0, '#0b0c0d'], [.5, '#3b3e40'], [1, '#08090a']]));
          line(ctx, sx, 172 - hh, sx + 3, 172 - hh + 16, 'rgba(230,235,232,.55)', 1.5);
        }
        ctx.restore();
        ctx.strokeStyle = 'rgba(220,226,222,.3)'; ctx.beginPath(); ctx.ellipse(240, 168, 104, 24, 0, 0, Math.PI * 2); ctx.stroke();
        circle(ctx, 390, 214, 15, '#2b2e2f'); circle(ctx, 390, 214, 12, '#161819');
        break;
      }
      case 'comb': {
        rect(ctx, 0, 0, W, H, '#f5e8cc');
        ctx.fillStyle = A.gfx.radial(ctx, 240, 120, 10, 240, 120, 330, [[0, '#fff4d9'], [1, '#e5cfa3']]); ctx.fillRect(0, 0, W, H);
        // honeycomb
        for (var hy = 0; hy < 6; hy++) for (var hx = 0; hx < 9; hx++) {
          var hxx = 30 + hx * 52 + (hy % 2) * 26, hyy = 24 + hy * 46;
          var pts = [];
          for (var a = 0; a < 6; a++) pts.push([hxx + Math.cos(a * Math.PI / 3) * 22, hyy + Math.sin(a * Math.PI / 3) * 22]);
          poly(ctx, pts, null, 'rgba(160,110,30,.12)', 1);
        }
        // six-faced jar
        poly(ctx, [[178, 122], [212, 108], [268, 108], [302, 122], [296, 268], [184, 268]], 'rgba(255,236,180,.34)', 'rgba(116,74,20,.4)', 2);
        poly(ctx, [[184, 176], [296, 176], [296, 266], [184, 266]], 'rgba(196,128,23,.72)');
        rect(ctx, 205, 96, 70, 15, '#8c6232');
        rect(ctx, 214, 138, 52, 28, 'rgba(250,242,220,.85)');
        // thread + coils
        A.gfx.paintStroke(ctx, [[240, -8], [239, 40], [242, 80], [240, 116]], '#d89a25', 12, 31, { passes: 4, jitter: 2, alpha: .9 });
        A.gfx.paintStroke(ctx, [[240, -8], [239, 40], [242, 80], [240, 116]], '#f5d47b', 4, 17, { passes: 2, jitter: 1, alpha: .9 });
        for (var co = 0; co < 5; co++) {
          ctx.beginPath(); ctx.ellipse(240, 258 - co * 6, 46 - co * 5, 10, 0, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(215,152,35,.7)'; ctx.lineWidth = 7; ctx.stroke();
        }
        for (var b = 0; b < 9; b++) circle(ctx, 196 + r() * 88, 190 + r() * 68, 1 + r() * 2.5, 'rgba(255,240,195,.6)');
        break;
      }
      case 'many-hands': {
        rect(ctx, 0, 0, W, H, '#22203a');
        ctx.fillStyle = A.gfx.radial(ctx, 230, 90, 10, 230, 90, 270, [[0, '#5b463c'], [1, '#1a1930']]); ctx.fillRect(0, 0, W, H);
        rect(ctx, 0, 214, W, 86, '#3b2d35'); line(ctx, 0, 214, W, 214, '#e9b45f', 3);
        // board of notes
        rect(ctx, 40, 42, 140, 116, '#2b2942');
        for (var n = 0; n < 12; n++) rect(ctx, 48 + (n % 4) * 33, 50 + Math.floor(n / 4) * 36, 26, 28, n % 3 ? '#f0e4c8' : '#e8c487');
        // lamp glow
        A.gfx.glow(ctx, 350, 54, 90, 'rgba(239,180,95,.5)');
        // eight little Claudes
        for (var c2 = 0; c2 < 8; c2++) {
          var xx = 218 + (c2 % 4) * 62, yy = 122 + Math.floor(c2 / 4) * 74, sc = .58 + (c2 % 3) * .06;
          ctx.save(); ctx.translate(xx, yy); ctx.scale(sc, sc);
          A.gfx.rr(ctx, -34, -28, 68, 52, 11); ctx.fillStyle = '#ee7b55'; ctx.fill();
          ctx.strokeStyle = 'rgba(40,22,30,.6)'; ctx.lineWidth = 2; ctx.stroke();
          circle(ctx, -13, -6, 4, '#2a2030'); circle(ctx, 13, -6, 4, '#2a2030');
          circle(ctx, -22, 4, 5, 'rgba(255,150,140,.6)'); circle(ctx, 22, 4, 5, 'rgba(255,150,140,.6)');
          rect(ctx, -26, 26, 10, 9, '#d96347'); rect(ctx, 16, 26, 10, 9, '#d96347');
          ctx.restore();
        }
        break;
      }
      case 'the-seed': {
        ctx.fillStyle = A.gfx.linear(ctx, 0, 0, 0, H, [[0, '#2a3f63'], [.45, '#6d7893'], [.72, '#dba68d'], [1, '#f0c4ab']]); ctx.fillRect(0, 0, W, H);
        for (var st = 0; st < 80; st++) circle(ctx, r() * W, r() * 150, .5 + r(), 'rgba(255,244,220,' + (.15 + r() * .5) + ')');
        rect(ctx, 0, 240, W, 60, 'rgba(230,190,175,.28)');
        // floating island
        poly(ctx, [[110, 218], [150, 196], [330, 196], [376, 218], [320, 254], [160, 254]], '#4a5546', '#2b3540', 2);
        ctx.fillStyle = '#6d8a5c'; A.gfx.rr(ctx, 150, 188, 186, 14, 7); ctx.fill();
        // tree with animated-looking canopy
        line(ctx, 246, 194, 246, 96, '#574332', 8);
        for (var br = 0; br < 7; br++) {
          var ang = -Math.PI / 2 + (br - 3) * .42;
          line(ctx, 246, 120 + (br % 3) * 16, 246 + Math.cos(ang) * 54, 120 + (br % 3) * 16 + Math.sin(ang) * 54, '#574332', 3);
        }
        for (var bl = 0; bl < 38; bl++) circle(ctx, 198 + r() * 96, 46 + r() * 72, 5 + r() * 9, bl % 4 ? 'rgba(238,174,186,.82)' : 'rgba(255,231,200,.75)');
        for (var fr = 0; fr < 9; fr++) { A.gfx.glow(ctx, 204 + r() * 86, 70 + r() * 50, 14, 'rgba(255,214,130,.65)'); circle(ctx, 204 + r() * 86, 70 + r() * 50, 3, '#ffe1a0'); }
        // hero
        A.gfx.rr(ctx, 172, 168, 32, 25, 6); ctx.fillStyle = '#ee7b55'; ctx.fill();
        circle(ctx, 181, 178, 2.3, '#292231'); circle(ctx, 195, 178, 2.3, '#292231');
        line(ctx, 178, 193, 178, 198, '#d96347', 3); line(ctx, 197, 193, 197, 198, '#d96347', 3);
        break;
      }
      case 'fast-lens': {
        rect(ctx, 0, 0, W, H, '#0d0f11');
        ctx.fillStyle = A.gfx.radial(ctx, 240, 140, 10, 240, 140, 300, [[0, '#303438'], [1, '#0a0b0c']]); ctx.fillRect(0, 0, W, H);
        ctx.save(); ctx.translate(250, 152); ctx.rotate(-.28);
        // barrel
        ctx.fillStyle = A.gfx.linear(ctx, 0, -100, 0, 100, [[0, '#4b4d4e'], [.25, '#181a1b'], [.7, '#2c2e2f'], [1, '#0d0e0f']]);
        A.gfx.rr(ctx, -150, -100, 250, 200, 22); ctx.fill();
        for (var kn = 0; kn < 42; kn++) line(ctx, -120 + kn * 5, -96, -118 + kn * 5, -68, 'rgba(180,180,175,.16)', 1);
        // brass ring, glass, iris
        circle(ctx, 60, 0, 88, '#151719'); circle(ctx, 60, 0, 80, '#8d7140');
        circle(ctx, 60, 0, 72, A.gfx.radial(ctx, 40, -20, 4, 60, 0, 76, [[0, '#496d78'], [.45, '#19262c'], [1, '#090d0f']]));
        var ir = []; for (var ib = 0; ib < 9; ib++) ir.push([60 + Math.cos(ib * Math.PI * 2 / 9) * 32, Math.sin(ib * Math.PI * 2 / 9) * 32]);
        poly(ctx, ir, 'rgba(8,11,13,.9)', 'rgba(210,180,110,.45)', 1);
        for (var cf = 0; cf < 5; cf++) {
          ctx.beginPath(); ctx.arc(60, 0, 20 + cf * 11, -1.1, .5); ctx.strokeStyle = ['#6fae8d', '#b57ba8', '#d8a14a', '#7fb0c4', '#c98a6a'][cf]; ctx.globalAlpha = .5; ctx.lineWidth = 2; ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.restore();
        // section rays
        for (var ry = 0; ry < 9; ry++) {
          var yy = 60 + ry * 22;
          line(ctx, 20, yy, 170, yy, 'rgba(127,176,196,.16)', 1);
          line(ctx, 170, yy, 300, 152 + (yy - 152) * .25, 'rgba(216,161,74,.28)', 1);
        }
        circle(ctx, 300, 152, 5, 'rgba(255,220,150,.85)');
        A.gfx.glow(ctx, 300, 152, 24, 'rgba(216,161,74,.5)');
        break;
      }
      case 'crystal-tumbler': {
        rect(ctx, 0, 0, W, H, '#0c0c0b');
        // caustic fan on stone
        for (var cf2 = 0; cf2 < 34; cf2++) {
          var ca = Math.PI * (0.12 + cf2 / 34 * .76);
          line(ctx, 240, 248, 240 + Math.cos(ca) * 260, 248 - Math.sin(ca) * 150, 'rgba(214,168,86,' + (.06 + r() * .2) + ')', 1 + r() * 2);
          if (cf2 % 6 === 0) line(ctx, 240, 248, 240 + Math.cos(ca) * 250, 248 - Math.sin(ca) * 145, 'rgba(130,180,215,.18)', 1);
        }
        // glass body
        poly(ctx, [[174, 72], [306, 72], [296, 246], [184, 246]], 'rgba(210,225,230,.10)', 'rgba(220,235,240,.55)', 2);
        poly(ctx, [[184, 164], [296, 164], [294, 240], [186, 240]], 'rgba(190,112,30,.62)');
        // facets
        for (var fx = 0; fx < 6; fx++) {
          var x0 = 180 + fx * 20;
          poly(ctx, [[x0, 78], [x0 + 10, 130], [x0, 162], [x0 - 10, 130]], 'rgba(255,255,255,' + (.035 + r() * .06) + ')', 'rgba(220,240,245,.28)', 1);
        }
        for (var dy = 0; dy < 4; dy++) line(ctx, 178, 84 + dy * 20, 302, 84 + dy * 20, 'rgba(235,245,245,.12)', 1);
        // ice sphere
        circle(ctx, 240, 146, 48, 'rgba(190,220,230,.16)');
        ctx.strokeStyle = 'rgba(225,245,250,.65)'; ctx.beginPath(); ctx.arc(240, 146, 48, 0, Math.PI * 2); ctx.stroke();
        for (var fq = 0; fq < 5; fq++) line(ctx, 210 + r() * 40, 118 + r() * 50, 220 + r() * 40, 120 + r() * 50, 'rgba(255,255,255,.4)', 1);
        A.gfx.glow(ctx, 216, 128, 26, 'rgba(230,245,255,.35)');
        // condensation
        for (var cb = 0; cb < 22; cb++) circle(ctx, 182 + r() * 116, 172 + r() * 70, .7 + r() * 1.8, 'rgba(240,250,250,.5)');
        line(ctx, 196, 188, 196, 232, 'rgba(240,250,250,.35)', 2);
        break;
      }
      case 'cork-gallery': {
        ctx.fillStyle = A.gfx.linear(ctx, 0, 0, 0, H, [[0, '#263054'], [.52, '#4c3b55'], [1, '#201a2b']]); ctx.fillRect(0, 0, W, H);
        for (var fb = 0; fb < 22; fb++) { A.gfx.glow(ctx, 22 + fb * 22, 38 + Math.sin(fb * .8) * 9, 13, 'rgba(232,161,60,.45)'); circle(ctx, 22 + fb * 22, 38 + Math.sin(fb * .8) * 9, 3, '#ffdba0'); }
        line(ctx, 0, 40, W, 40, 'rgba(255,220,160,.25)', 1);
        // three depth rows
        for (var row = 0; row < 3; row++) {
          var sc = 1 - row * .22, base = 130 + row * 44, count = 7 - row;
          for (var t = 0; t < count; t++) {
            var tx = 46 + t * (390 / count) + row * 16, ty = base - (18 + row * 3) * sc;
            var col = t % 3 === 0 ? '#d8b77a' : (t % 3 === 1 ? '#c9604c' : '#e6d7b7');
            circle(ctx, tx, ty, (12 + row * 2) * sc, col);
            circle(ctx, tx, ty, 6 * sc, '#2b2530');
            line(ctx, tx, ty + 14 * sc, tx, ty + 30 * sc, 'rgba(210,180,120,.6)', 2);
          }
          line(ctx, 0, base + 26, W, base + 26, 'rgba(240,210,150,.25)', 2);
        }
        // counter + gun
        poly(ctx, [[0, 274], [W, 274], [W, H], [0, H]], '#3f2b28');
        line(ctx, 0, 274, W, 274, '#c9954f', 3);
        poly(ctx, [[60, 286], [170, 286], [190, 276], [110, 268], [60, 276]], '#6b422b');
        rect(ctx, 160, 262, 130, 9, '#a58342');
        circle(ctx, 300, 266, 5, '#e8c06a');
        for (var co2 = 0; co2 < 4; co2++) { var px2 = 200 + co2 * 60; line(ctx, px2, 150 + co2 * 12, px2 + 22, 118 + co2 * 8, 'rgba(245,220,170,.5)', 2); }
        break;
      }
      case 'shareware-1996': {
        rect(ctx, 0, 0, W, H, '#171920');
        ctx.fillStyle = A.gfx.radial(ctx, 300, 120, 10, 300, 120, 320, [[0, '#3a3026'], [1, '#121319']]); ctx.fillRect(0, 0, W, H);
        // window with rain + blinds
        rect(ctx, 22, 26, 104, 154, '#24313a');
        for (var bl2 = 0; bl2 < 9; bl2++) rect(ctx, 22, 30 + bl2 * 17, 104, 5, 'rgba(200,190,160,.22)');
        for (var rn = 0; rn < 26; rn++) line(ctx, 26 + r() * 96, 28 + r() * 148, 22 + r() * 96, 44 + r() * 148, 'rgba(180,210,220,.18)', 1);
        // desk
        poly(ctx, [[0, 224], [W, 224], [W, H], [0, H]], '#40312c');
        // monitor
        A.gfx.rr(ctx, 168, 68, 190, 152, 14); ctx.fillStyle = '#c5bda9'; ctx.fill();
        A.gfx.rr(ctx, 180, 80, 166, 118, 10); ctx.fillStyle = '#172a26'; ctx.fill();
        ctx.save(); ctx.beginPath(); A.gfx.rr(ctx, 180, 80, 166, 118, 10); ctx.clip();
        for (var py = 0; py < 16; py++) for (var px3 = 0; px3 < 22; px3++) {
          if (r() > .76) rect(ctx, 184 + px3 * 7.4, 84 + py * 7, 6, 6, r() > .5 ? '#7fd1a0' : '#d6a84b');
        }
        for (var sl = 0; sl < 60; sl++) line(ctx, 180, 82 + sl * 2, 346, 82 + sl * 2, 'rgba(0,0,0,.16)', 1);
        ctx.restore();
        A.gfx.rr(ctx, 180, 80, 166, 118, 10); ctx.strokeStyle = 'rgba(180,220,210,.3)'; ctx.lineWidth = 2; ctx.stroke();
        // keyboard + floppies
        A.gfx.rr(ctx, 162, 232, 200, 26, 4); ctx.fillStyle = '#bdb5a3'; ctx.fill();
        for (var ky = 0; ky < 22; ky++) rect(ctx, 168 + ky * 8.6, 238, 6, 8, 'rgba(60,58,52,.45)');
        for (var fd = 0; fd < 3; fd++) { A.gfx.rr(ctx, 392 + fd * 22, 200 - fd * 4, 26, 34, 2); ctx.fillStyle = fd % 2 ? '#45474f' : '#33363d'; ctx.fill(); rect(ctx, 396 + fd * 22, 204 - fd * 4, 18, 8, '#cfc6b1'); }
        A.gfx.glow(ctx, 263, 140, 110, 'rgba(120,190,150,.18)');
        break;
      }
      case 'under-the-glass': {
        rect(ctx, 0, 0, W, H, '#160f16');
        ctx.fillStyle = A.gfx.linear(ctx, 0, 0, 0, H, [[0, '#2b1c27'], [.6, '#3a211e'], [1, '#160f14']]); ctx.fillRect(0, 0, W, H);
        // backglass
        rect(ctx, 24, 16, 432, 74, '#2c1c30');
        for (var sk = 0; sk < 14; sk++) rect(ctx, 30 + sk * 31, 28 + (sk % 3) * 9, 20, 44 - (sk % 3) * 9, ['#e0692f', '#54b3c4', '#ead07a', '#b74d6a'][sk % 4]);
        // playfield with lamp inserts
        poly(ctx, [[16, 96], [464, 96], [420, H], [60, H]], '#47301f');
        for (var li = 0; li < 12; li++) {
          var lx = 60 + (li % 6) * 72, ly = 130 + Math.floor(li / 6) * 86;
          A.gfx.glow(ctx, lx, ly, 30, 'rgba(224,105,47,.45)'); circle(ctx, lx, ly, 9, '#f2b45c'); circle(ctx, lx, ly, 4, '#fff0c8');
        }
        // rails + rubber
        for (var rr = 0; rr < 3; rr++) {
          ctx.strokeStyle = 'rgba(220,220,215,.4)'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(240, 214, 58 + rr * 42, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
        }
        // drop targets
        for (var dt = 0; dt < 6; dt++) { A.gfx.rr(ctx, 110 + dt * 45, 214, 28, 40, 3); ctx.fillStyle = dt % 2 ? '#d7c8a5' : '#b2bbae'; ctx.fill(); }
        // chrome ball
        circle(ctx, 330, 244, 36, A.gfx.radial(ctx, 316, 228, 3, 330, 244, 38, [[0, '#f9f6ec'], [.35, '#8b9aa0'], [.7, '#2a2c33'], [1, '#b5b0a4']]));
        A.gfx.glow(ctx, 316, 228, 16, 'rgba(255,255,255,.4)');
        // flippers
        line(ctx, 150, 288, 210, 270, '#d8d2c2', 9); line(ctx, 330, 270, 390, 288, '#d8d2c2', 9);
        break;
      }
      case 'box-fort': {
        rect(ctx, 0, 0, W, H, '#2a1e16');
        ctx.fillStyle = A.gfx.radial(ctx, 250, 130, 10, 250, 130, 340, [[0, '#8a6238'], [1, '#2a1e16']]); ctx.fillRect(0, 0, W, H);
        // boxes
        for (var bx = 0; bx < 5; bx++) {
          var bxx = -20 + bx * 108, byy = 54 + (bx % 2) * 22;
          rect(ctx, bxx, byy, 116, 190, bx % 2 ? '#ad7c46' : '#bf8a50');
          line(ctx, bxx, byy + 14, bxx + 116, byy + 14, 'rgba(80,50,24,.35)', 2);
          for (var cr = 0; cr < 22; cr++) line(ctx, bxx, byy + 18 + cr * 8, bxx + 116, byy + 18 + cr * 8, 'rgba(110,70,35,.10)', 1);
          // tape
          ctx.save(); ctx.translate(bxx + 58, byy); ctx.rotate(-.05 + bx * .02);
          rect(ctx, -13, 0, 26, 190, 'rgba(196,158,102,.75)');
          for (var wr = 0; wr < 10; wr++) line(ctx, -13, wr * 19, 13, wr * 19 + 4, 'rgba(255,240,200,.3)', 1);
          ctx.restore();
        }
        // crooked window with daylight
        poly(ctx, [[196, 82], [306, 74], [312, 172], [202, 180]], '#e6cf94', '#67482a', 5);
        for (var dr = 0; dr < 5; dr++) line(ctx, 206 + dr * 22, 84, 208 + dr * 22, 176, 'rgba(255,246,208,.35)', 3);
        // marker scribbles
        ctx.strokeStyle = 'rgba(38,50,90,.7)'; ctx.lineWidth = 2;
        for (var mk = 0; mk < 7; mk++) { ctx.beginPath(); ctx.arc(50 + mk * 64, 218 + (mk % 2) * 12, 9 + mk, .2, 2.4); ctx.stroke(); }
        // box bot
        A.gfx.rr(ctx, 340, 196, 60, 46, 3); ctx.fillStyle = '#c99a5e'; ctx.fill(); ctx.strokeStyle = '#5b3a1e'; ctx.lineWidth = 2; ctx.stroke();
        circle(ctx, 356, 210, 3, '#2d3a55'); circle(ctx, 384, 210, 3, '#2d3a55');
        circle(ctx, 350, 245, 10, '#8d8f8c'); circle(ctx, 390, 245, 10, '#8d8f8c');
        line(ctx, 370, 196, 370, 180, '#7d7f7a', 2); circle(ctx, 370, 178, 4, '#d9d4c0');
        break;
      }
      case 'breakwater': {
        ctx.fillStyle = A.gfx.linear(ctx, 0, 0, 0, H, [[0, '#6a7a84'], [.42, '#b2a083'], [.5, '#5a6264'], [1, '#22282c']]); ctx.fillRect(0, 0, W, H);
        circle(ctx, 380, 104, 30, 'rgba(245,214,164,.85)'); A.gfx.glow(ctx, 380, 104, 80, 'rgba(230,190,130,.5)');
        // far cranes
        for (var cn = 0; cn < 4; cn++) {
          var cxx = 30 + cn * 48;
          line(ctx, cxx, 132, cxx, 70, 'rgba(40,48,52,.55)', 3);
          line(ctx, cxx - 20, 78, cxx + 34, 70, 'rgba(40,48,52,.55)', 3);
        }
        // buildings
        for (var bu = 0; bu < 8; bu++) {
          var bxx2 = bu * 66 - 10, hgt = 70 + (bu * 37 % 62);
          rect(ctx, bxx2, 152 - hgt, 58, hgt, bu % 2 ? 'rgba(58,62,62,.88)' : 'rgba(75,72,66,.9)');
          for (var wi = 0; wi < 6; wi++) rect(ctx, bxx2 + 8 + (wi % 3) * 18, 160 - hgt + Math.floor(wi / 3) * 22, 8, 12, 'rgba(220,196,150,.35)');
        }
        // smoke
        for (var sm = 0; sm < 9; sm++) { A.gfx.glow(ctx, 70 + sm * 8, 60 - sm * 5 + Math.sin(sm) * 6, 26, 'rgba(120,120,118,.22)'); }
        // wet street
        rect(ctx, 0, 152, W, H - 152, '#333c40');
        for (var rf = 0; rf < 46; rf++) {
          var rx = r() * W, ry = 158 + r() * 130;
          line(ctx, rx, ry, rx + 12 + r() * 28, ry, 'rgba(215,190,145,' + (.06 + r() * .22) + ')', 1 + r() * 2);
        }
        for (var tr = 0; tr < 3; tr++) line(ctx, 40 + tr * 30, 180 + tr * 14, 320 + tr * 40, 158 + tr * 8, 'rgba(255,206,130,.6)', 1.5);
        // aircraft
        poly(ctx, [[300, 42], [344, 38], [352, 44], [306, 49]], 'rgba(30,36,40,.8)');
        break;
      }
    }
    A.gfx.vignette(ctx, W, H, .5);
    A.gfx.grain(ctx, W, H, .075, g.original * 31);
    // brass hairline
    ctx.strokeStyle = 'rgba(201,162,91,.35)'; ctx.lineWidth = 1; ctx.strokeRect(7.5, 7.5, W - 15, H - 15);
  }

  root.Posters = { draw: draw };
})(window);
