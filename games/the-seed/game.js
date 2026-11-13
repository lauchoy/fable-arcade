(function () {
  'use strict';

  var G = Arcade.gfx;
  var cl = Arcade.clamp, lp = Arcade.lerp, sm = Arcade.smooth;
  var ID = 'the-seed';
  var D = 72;
  var SERIF = 'Georgia, "Times New Roman", serif';
  var SANS = '"Helvetica Neue", Arial, sans-serif';
  var P = {
    ink: '#f6ead6', coral: '#ee7b55', coralLight: '#f9a47c', coralDark: '#c2583d',
    outline: '#24252b', night: '#1a2c3d', green: '#8ec0a4', seed: '#7a5235'
  };
  /* One continuous place, one year. Shot list, in seconds of the 72 s loop.
     0-11   Golden evening: a seed is found, rolled, planted and patted.
     11-25  Blue night with stars, then grey rain: a leaf is held over the soil.
     25-38  Hard summer sun: the hero measures itself against a growing tree and loses.
     38-49  Autumn storm: four legs braced against the bending trunk.
     49-60  White winter: snow settles; a woven-grass scarf goes around the tree.
     60-72  Pink spring: blossom, fruit lanterns, birds, one new seed, the bare islands. */
  var SEASONS = [
    { t: 0, n: 'Golden evening', top: '#eda768', mid: '#e9ab80', bot: '#f6dca9', light: '#ffd79a', cloud: '#f4cfae', land: '#7b8b58', grass: '#8ca168', wood: '#5c4632' },
    { t: 11, n: 'Night and rain', top: '#162d4e', mid: '#2b4260', bot: '#5b6a7a', light: '#a8bdd0', cloud: '#67788a', land: '#4e6058', grass: '#5e7564', wood: '#3f3c3a' },
    { t: 25, n: 'Hard summer', top: '#63aecb', mid: '#a6d3dd', bot: '#f3e6bd', light: '#fff3bb', cloud: '#f6f3dc', land: '#8a8052', grass: '#9aab5f', wood: '#62513a' },
    { t: 38, n: 'Autumn storm', top: '#414652', mid: '#6b5a58', bot: '#a2866d', light: '#d9a97a', cloud: '#8e7b74', land: '#665c48', grass: '#8b7a4a', wood: '#4d3f30' },
    { t: 49, n: 'White winter', top: '#a9becb', mid: '#d6e1e5', bot: '#f1f1ea', light: '#ffffff', cloud: '#ffffff', land: '#9aa6a6', grass: '#cdd7cf', wood: '#605a54' },
    { t: 60, n: 'Pink spring', top: '#eeb0c2', mid: '#f8d1ce', bot: '#fff1dc', light: '#ffe0b3', cloud: '#fde7e2', land: '#7c8d61', grass: '#93b273', wood: '#5b4b38' }
  ];
  var CARE = [
    { a: 3.5, b: 9, verb: 'plant', label: 'plant the seed' },
    { a: 15, b: 23, verb: 'leaf', label: 'hold the leaf' },
    { a: 40, b: 47, verb: 'brace', label: 'brace the trunk' },
    { a: 51, b: 58, verb: 'scarf', label: 'wrap the scarf' },
    { a: 64, b: 70, verb: 'seed', label: 'pick up the seed' }
  ];
  var BOT = [6, 19, 43, 54, 66];
  var TOAST = ['You plant the seed.', 'You hold the leaf.', 'You brace the trunk.', 'You wrap the scarf.', 'You pick up one more seed.'];

  var st = {
    clock: 0, botPause: 0, paused: false, hover: 0, lastBeat: -1, done: false,
    care: [false, false, false, false, false],
    missed: [false, false, false, false, false],
    careAt: [0, 0, 0, 0, 0], finishAt: null,
    react: null
  };
  var caches = { key: '' };
  var E = Arcade.boot({
    id: ID, title: 'The seed',
    hint: 'Press Space or click to help the tree. Press P to pause. Hover to show the scrub bar.',
    background: P.night, ink: P.ink, scroll: false, sections: 1,
    onFrame: onFrame
  });

  var views = {
    evening: 2, night: 13, rain: 19, summer: 29, measure: 33, storm: 41,
    autumn: 41, winter: 51, snow: 54, spring: 62, blossom: 67, end: 70
  };
  var vkey = E.view || E.state;
  if (Object.prototype.hasOwnProperty.call(views, vkey)) st.clock = views[vkey];
  else if (/^[1-4]$/.test(vkey)) st.clock = [2, 19, 34, 67][parseInt(vkey, 10) - 1];
  if (E.state === 'end') st.clock = 70;

  function T(ctx, s, x, y, size, color, o) { G.copyText(ctx, s, x, y, size, color, o || {}); }
  function rgbOf(c) {
    if (String(c).charAt(0) === '#') {
      var h = c.replace('#', '');
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    }
    // Palette() already returns rgb(...) strings; mixHex must accept both forms.
    var m = String(c).match(/\d+(\.\d+)?/g);
    return m && m.length >= 3 ? [Number(m[0]), Number(m[1]), Number(m[2])] : [0, 0, 0];
  }
  function mixHex(a, b, t) {
    var A = rgbOf(a), B = rgbOf(b);
    return 'rgb(' + Math.round(lp(A[0], B[0], t)) + ',' + Math.round(lp(A[1], B[1], t)) + ',' + Math.round(lp(A[2], B[2], t)) + ')';
  }
  function win(T, a, b, fade) {
    fade = fade === undefined ? 1.5 : fade;
    return sm(a, a + fade, T) * (1 - sm(b - fade, b, T));
  }
  function palette(t) {
    var i = 0;
    for (var k = 0; k < SEASONS.length; k++) if (t >= SEASONS[k].t) i = k;
    var s = SEASONS[i], nx = SEASONS[(i + 1) % SEASONS.length];
    var end = i === SEASONS.length - 1 ? D : nx.t;
    var f = i === SEASONS.length - 1 ? sm(69, D, t) : sm(end - 3, end, t);
    var out = { name: s.n, i: i };
    var keys = ['top', 'mid', 'bot', 'light', 'cloud', 'land', 'grass', 'wood'];
    for (var q = 0; q < keys.length; q++) out[keys[q]] = mixHex(s[keys[q]], nx[keys[q]], f);
    return out;
  }
  function amounts(t) {
    return {
      evening: win(t, 0, 11, 2),
      stars: sm(11, 14, t) * (1 - sm(22, 25, t)),
      rain: win(t, 13, 24, 2),
      summer: win(t, 25, 38, 3),
      storm: win(t, 38, 49, 2),
      snow: win(t, 49, 60, 2),
      spring: win(t, 60, 72, 3),
      blossom: sm(60.5, 64, t),
      fruit: sm(63, 67, t)
    };
  }

  function stage() {
    var k = Math.min(E.w / 1280, E.h / 720);
    if (!(k > 0) || !isFinite(k)) k = 1;
    var VW = E.w / k, VH = E.h / k, tall = VH > 1000, u = tall ? 1.5 : 1;
    var cx = VW / 2, iw = Math.min(VW * 0.66, 860 * u), ih = Math.min(VH * 0.22, 250 * u);
    var iy = VH * (tall ? 0.62 : 0.66);
    return {
      k: k, VW: VW, VH: VH, cx: cx, u: u, tall: tall,
      island: { x: cx, y: iy, w: iw, h: ih },
      hero: { x: cx - iw * 0.17, y: iy - 8 * u },
      tree: { x: cx + iw * 0.22, y: iy + 5 * u },
      soil: { x: cx + iw * 0.03, y: iy + 3 * u },
      textV: cl(12 / k, 15, 44), titleV: cl(36 / k, 46, 132)
    };
  }

  function buildCaches(L) {
    var key = Math.round(L.VW) + 'x' + Math.round(L.VH);
    if (caches.key === key) return;
    caches.key = key;
    var r = Arcade.rng(E.seed);
    caches.cloud = G.offscreen(1280, 340, function (c, w, h) {
      c.clearRect(0, 0, w, h);
      var bands = ['rgba(255,255,255,.14)', 'rgba(255,255,255,.20)', 'rgba(255,255,255,.11)', 'rgba(255,255,255,.22)'];
      for (var band = 0; band < 4; band++) {
        c.fillStyle = bands[band];
        var base = h * (0.18 + band * 0.21);
        c.beginPath(); c.moveTo(0, base);
        for (var x = 0; x <= w; x += 40) {
          var y = base + Math.sin(x * 0.013 + band) * 13 + Math.sin(x * 0.037 + band * 2) * 7;
          c.lineTo(x, y);
        }
        c.lineTo(w, h); c.lineTo(0, h); c.closePath(); c.fill();
      }
      for (var i = 0; i < 160; i++) {
        var px = r() * w, py = r() * h;
        c.fillStyle = 'rgba(255,255,255,' + (0.06 + r() * 0.2).toFixed(3) + ')';
        c.beginPath(); c.ellipse(px, py, 12 + r() * 62, 3 + r() * 9, 0, 0, Math.PI * 2); c.fill();
      }
      for (var g = 0; g < 40; g++) {
        c.fillStyle = 'rgba(255,255,255,.6)';
        c.fillRect(r() * w, r() * h, 2 + r() * 5, 1);
      }
    });
    caches.rock = G.offscreen(900, 400, function (c, w, h) {
      c.clearRect(0, 0, w, h);
      var rock = G.linear(c, 0, 0, 0, h, [[0, '#8a7359'], [0.45, '#6c5b4a'], [1, '#3d3a38']]);
      c.fillStyle = rock;
      c.beginPath();
      c.moveTo(0, 6); c.lineTo(w, 6);
      c.bezierCurveTo(w * 0.86, h * 0.42, w * 0.68, h * 0.76, w * 0.52, h);
      c.lineTo(w * 0.40, h * 0.78); c.lineTo(w * 0.26, h * 0.55);
      c.bezierCurveTo(w * 0.13, h * 0.36, w * 0.06, h * 0.20, 0, 6);
      c.closePath(); c.fill();
      c.save(); c.beginPath();
      c.moveTo(0, 6); c.lineTo(w, 6);
      c.bezierCurveTo(w * 0.86, h * 0.42, w * 0.68, h * 0.76, w * 0.52, h);
      c.lineTo(w * 0.40, h * 0.78); c.lineTo(w * 0.26, h * 0.55);
      c.bezierCurveTo(w * 0.13, h * 0.36, w * 0.06, h * 0.20, 0, 6);
      c.closePath(); c.clip();
      for (var i = 0; i < 240; i++) {
        c.strokeStyle = r() < 0.5 ? 'rgba(28,24,26,.13)' : 'rgba(240,220,190,.10)';
        c.lineWidth = 1 + r() * 3;
        var y = 20 + r() * (h - 30);
        c.beginPath(); c.moveTo(r() * w * 0.3, y);
        c.bezierCurveTo(w * 0.3, y + (r() - 0.5) * 20, w * 0.6, y + (r() - 0.5) * 20, w * (0.6 + r() * 0.4), y + (r() - 0.5) * 12);
        c.stroke();
      }
      c.restore();
      c.strokeStyle = 'rgba(30,26,28,.55)'; c.lineWidth = 4;
      c.beginPath(); c.moveTo(0, 6); c.lineTo(w, 6); c.stroke();
    });
    caches.blossom = G.offscreen(80, 80, function (c, w, h) {
      c.clearRect(0, 0, w, h);
      for (var i = 0; i < 5; i++) {
        var a = i * Math.PI * 2 / 5;
        c.save(); c.translate(w / 2, h / 2); c.rotate(a);
        c.beginPath(); c.ellipse(0, -17, 10, 15, 0, 0, Math.PI * 2);
        c.fillStyle = i % 2 ? '#f8cddd' : '#ffe6ec'; c.fill();
        c.strokeStyle = 'rgba(150,88,110,.35)'; c.lineWidth = 1.2; c.stroke();
        c.restore();
      }
      c.beginPath(); c.arc(w / 2, h / 2, 6, 0, Math.PI * 2);
      c.fillStyle = '#f6d88f'; c.fill();
    });
  }

  function sky(ctx, L, t, pal, A) {
    var g = G.linear(ctx, 0, 0, 0, L.VH * 0.8,
      [[0, pal.top], [0.48, pal.mid], [1, pal.bot]]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, L.VW, L.VH);
    // large painted soft shapes in the sky
    ctx.save(); ctx.globalAlpha = 0.10;
    for (var i = 0; i < 6; i++) {
      var x = L.VW * Arcade.hash(i, 5), y = L.VH * (0.08 + Arcade.hash(i, 6) * 0.34);
      ctx.fillStyle = i % 2 ? '#ffffff' : '#2b2f48';
      ctx.beginPath(); ctx.ellipse(x, y, 140 * L.u + Arcade.hash(i, 2) * 260 * L.u,
        34 * L.u + Arcade.hash(i, 9) * 58 * L.u, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    // stars at night
    if (A.stars > 0.01) {
      ctx.save(); ctx.globalAlpha = A.stars;
      for (var s = 0; s < 90; s++) {
        var sx = Arcade.hash(s, 11) * L.VW, sy = Arcade.hash(s, 13) * L.VH * 0.56;
        var tw = 0.45 + 0.55 * Math.sin(t * 1.1 + s * 2.7);
        ctx.globalAlpha = A.stars * tw;
        ctx.fillStyle = '#fbf4dc';
        ctx.beginPath(); ctx.arc(sx, sy, 1 + Arcade.hash(s, 17) * 2, 0, Math.PI * 2); ctx.fill();
      }
      // a small moon
      ctx.globalAlpha = A.stars * 0.9;
      ctx.fillStyle = '#f2e9cd';
      ctx.beginPath(); ctx.arc(L.VW * 0.76, L.VH * 0.14, 30 * L.u, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = pal.top;
      ctx.beginPath(); ctx.arc(L.VW * 0.76 + 12 * L.u, L.VH * 0.14 - 8 * L.u, 27 * L.u, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    // the light of each time of day
    var sunX = A.summer > 0.3 ? L.VW * 0.72 : (A.evening > 0.3 ? L.VW * 0.82 : L.VW * 0.24);
    var sunY = A.summer > 0.3 ? L.VH * 0.11 : (A.evening > 0.3 ? L.VH * 0.29 : L.VH * 0.17);
    var vis = cl(A.evening + A.summer + A.spring * 0.8 + A.snow * 0.35, 0, 1);
    ctx.save(); ctx.globalAlpha = vis * 0.95;
    G.glow(ctx, sunX, sunY, 150 * L.u, pal.light);
    ctx.fillStyle = pal.light;
    ctx.beginPath(); ctx.arc(sunX, sunY, 34 * L.u, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    // hard summer haze and autumn low cloud
    if (A.storm > 0.02) {
      ctx.save(); ctx.globalAlpha = A.storm * 0.32;
      for (var c2 = 0; c2 < 7; c2++) {
        ctx.fillStyle = '#45414a';
        var cx2 = (c2 * 230 + t * 22) % (L.VW + 400) - 200;
        ctx.beginPath(); ctx.ellipse(cx2, L.VH * (0.14 + (c2 % 3) * 0.07), 180 * L.u, 34 * L.u, 0, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
  }

  function cloudSea(ctx, L, t, pal, A) {
    var y = L.island.y + L.island.h * 0.68;
    ctx.save();
    ctx.beginPath(); ctx.rect(0, y, L.VW, L.VH - y); ctx.clip();
    var wash = G.linear(ctx, 0, y, 0, L.VH, [[0, pal.cloud], [1, pal.bot]]);
    ctx.fillStyle = wash; ctx.fillRect(0, y, L.VW, L.VH - y);
    ctx.globalAlpha = 0.55;
    var off = (t * 9 * L.u) % L.VW;
    ctx.drawImage(caches.cloud, -off, y + 8 * L.u, L.VW, (L.VH - y) * 0.9);
    ctx.drawImage(caches.cloud, L.VW - off, y + 8 * L.u, L.VW, (L.VH - y) * 0.9);
    ctx.globalAlpha = 0.32;
    for (var i = 0; i < 9; i++) {
      var cx = ((i * 197 + t * 4) % (L.VW + 260)) - 130;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.ellipse(cx, y + (L.VH - y) * (0.12 + (i % 4) * 0.18), 70 * L.u, 9 * L.u, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  function island(ctx, L, t, pal, A) {
    var I = L.island, u = L.u;
    ctx.save();
    // soft shadow under the floating rock
    ctx.fillStyle = 'rgba(30,28,34,.16)';
    ctx.beginPath(); ctx.ellipse(I.x, I.y + I.h * 1.24, I.w * 0.44, 22 * u, 0, 0, Math.PI * 2); ctx.fill();
    ctx.drawImage(caches.rock, I.x - I.w / 2, I.y, I.w, I.h * 1.18);
    // grass cap
    var cap = G.linear(ctx, 0, I.y - 18 * u, 0, I.y + 26 * u,
      [[0, mixHex(pal.grass, '#ffffff', 0.18)], [1, pal.land]]);
    ctx.beginPath();
    ctx.moveTo(I.x - I.w / 2, I.y + 4 * u);
    ctx.bezierCurveTo(I.x - I.w * 0.3, I.y - 18 * u, I.x + I.w * 0.3, I.y - 18 * u, I.x + I.w / 2, I.y + 4 * u);
    ctx.bezierCurveTo(I.x + I.w * 0.32, I.y + 22 * u, I.x - I.w * 0.32, I.y + 22 * u, I.x - I.w / 2, I.y + 4 * u);
    ctx.closePath(); ctx.fillStyle = cap; ctx.fill();
    ctx.strokeStyle = 'rgba(36,34,34,.5)'; ctx.lineWidth = 2.4 * u; ctx.stroke();
    // grass blades, wind in them, stronger in the storm
    var wind = A.storm * 0.9 + A.rain * 0.25 + 0.12;
    var mx = E.input.mouse.inside ? E.input.mouse.x / L.k : -9999;
    for (var b = 0; b < 110; b++) {
      var fx = -I.w / 2 + 8 * u + Arcade.hash(b, 21) * (I.w - 16 * u);
      var x = I.x + fx, y = I.y + 2 * u - Arcade.hash(b, 22) * 11 * u;
      var hgt = (7 + Arcade.hash(b, 23) * 13) * u;
      var near = cl(1 - Math.abs(x - mx) / (90 * u), 0, 1);
      var bend = Math.sin(t * 1.4 + b * 0.7) * (3 + wind * 13) * u + near * 9 * u * Math.sin(t * 5 + b);
      ctx.beginPath(); ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + bend * 0.4, y - hgt * 0.6, x + bend, y - hgt);
      ctx.strokeStyle = b % 3 === 0 ? 'rgba(255,255,235,.45)' : pal.grass;
      ctx.lineWidth = Math.max(1, 1.6 * u); ctx.stroke();
    }
    // the planted soil patch
    ctx.beginPath(); ctx.ellipse(L.soil.x, L.soil.y, 34 * u, 9 * u, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(62,44,32,.55)'; ctx.fill();
    ctx.restore();
  }

  function settledSnow(ctx, L, t, pal, A) {
    var amt = A.snow * (1 - sm(60, 64, t));
    if (amt <= 0.01) return;
    var I = L.island, u = L.u;
    ctx.save(); ctx.globalAlpha = amt;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(I.x - I.w / 2, I.y + 4 * u);
    ctx.bezierCurveTo(I.x - I.w * 0.3, I.y - 15 * u, I.x + I.w * 0.3, I.y - 15 * u, I.x + I.w / 2, I.y + 4 * u);
    ctx.bezierCurveTo(I.x + I.w * 0.3, I.y + 7 * u, I.x - I.w * 0.3, I.y + 7 * u, I.x - I.w / 2, I.y + 4 * u);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(150,170,180,.55)'; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.restore();
  }

  function tree(ctx, L, t, pal, A) {
    var growth = sm(12, 46, t) * 0.80 + sm(59, 64, t) * 0.20;
    if (growth <= 0.001) return;
    var leafAmt = sm(24, 32, t) * (1 - sm(44, 50, t));
    var blossom = A.blossom, fruit = A.fruit;
    var snowAmt = A.snow * (1 - sm(60, 64, t));
    var u = L.u, base = L.tree;
    var H = Math.min(L.VH * 0.38, 350 * u) * (0.16 + 0.84 * growth);
    var wind = (A.storm * Math.sin(t * 2.1) * 0.09 + A.rain * 0.015);

    function branch(x, y, len, ang, depth, id) {
      var local = cl((growth - depth * 0.10) / 0.30, 0, 1);
      var l = len * (0.22 + 0.78 * local);
      if (l < 1.5) return;
      var nx = x + Math.cos(ang + wind * (depth + 1)) * l;
      var ny = y + Math.sin(ang + wind * (depth + 1)) * l;
      var midX = (x + nx) / 2 + Math.sin(id * 2.1) * l * 0.06;
      var midY = (y + ny) / 2 - l * 0.05;
      var w = Math.max(1.2, (15 - depth * 2.7) * u * (0.28 + 0.72 * local));
      ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(midX, midY, nx, ny);
      ctx.strokeStyle = 'rgba(34,28,28,.7)'; ctx.lineWidth = w + 2.4 * u; ctx.lineCap = 'round'; ctx.stroke();
      ctx.strokeStyle = pal.wood; ctx.lineWidth = w; ctx.stroke();
      if (snowAmt > 0.02) {
        ctx.beginPath(); ctx.moveTo(x, y - w * 0.32); ctx.quadraticCurveTo(midX, midY - w * 0.32, nx, ny - w * 0.32);
        ctx.strokeStyle = 'rgba(255,255,255,' + (snowAmt * 0.62).toFixed(3) + ')';
        ctx.lineWidth = Math.max(1, w * 0.34); ctx.stroke();
      }
      if (depth >= 3) {
        var leaves = Math.round(leafAmt * 4);
        for (var q = 0; q < leaves; q++) {
          var a2 = ang + (q - (leaves - 1) / 2) * 0.5 + (Arcade.hash(id, q) - 0.5) * 0.4;
          var rr = (8 + Arcade.hash(q, id) * 12) * u;
          ctx.save(); ctx.translate(nx + Math.cos(a2) * rr, ny + Math.sin(a2) * rr); ctx.rotate(a2);
          ctx.beginPath(); ctx.ellipse(0, 0, 10 * u, 4.4 * u, 0, 0, Math.PI * 2);
          ctx.fillStyle = q % 2 ? mixHex(pal.grass, '#ffffff', 0.12) : P.green; ctx.fill();
          ctx.strokeStyle = 'rgba(38,48,34,.4)'; ctx.lineWidth = 0.9; ctx.stroke();
          ctx.restore();
        }
        if (blossom > 0.01) {
          var nBl = Math.round(blossom * 3);
          for (var f = 0; f < nBl; f++) {
            var bx = nx + (Arcade.hash(id * 7, f) - 0.5) * 34 * u;
            var by = ny + (Arcade.hash(f, id * 3) - 0.5) * 26 * u;
            ctx.save(); ctx.globalAlpha = cl(blossom, 0, 1);
            ctx.drawImage(caches.blossom, bx - 13 * u, by - 13 * u, 26 * u, 26 * u);
            ctx.restore();
          }
        }
        if (fruit > 0.01) {
          var nFr = Math.round(fruit * 2);
          for (var g = 0; g < nFr; g++) {
            var fx = nx + (Arcade.hash(id + 31, g) - 0.5) * 24 * u;
            var fy = ny + 14 * u + (Arcade.hash(g + 9, id) - 0.5) * 10 * u;
            G.glow(ctx, fx, fy, 26 * u, 'rgba(255,203,115,' + (0.35 * fruit).toFixed(3) + ')');
            ctx.beginPath(); ctx.arc(fx, fy, 6.5 * u, 0, Math.PI * 2);
            ctx.fillStyle = '#ffcf7d'; ctx.fill();
            ctx.strokeStyle = 'rgba(130,82,30,.6)'; ctx.lineWidth = 1.2; ctx.stroke();
            ctx.beginPath(); ctx.arc(fx - 2 * u, fy - 2 * u, 1.7 * u, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,230,.85)'; ctx.fill();
          }
        }
        return;
      }
      var spread = 0.36 + Arcade.hash(id, 5) * 0.20;
      branch(nx, ny, l * (0.68 + Arcade.hash(id, 3) * 0.10), ang - spread + wind, depth + 1, id * 2 + 1);
      branch(nx, ny, l * (0.66 + Arcade.hash(id, 8) * 0.12), ang + spread + wind, depth + 1, id * 2 + 2);
    }

    ctx.save();
    branch(base.x, base.y, H, -Math.PI / 2, 0, 1);
    // a quiet pool of light under the spring tree
    if (A.spring > 0.2) {
      G.glow(ctx, base.x, base.y - H * 0.55, H * 0.85, 'rgba(255,222,182,' + (0.14 * A.spring).toFixed(3) + ')');
    }
    ctx.restore();
  }

  function scarf(ctx, L, t, A) {
    var amt = sm(52, 55, t) * (1 - sm(60, 63, t) * 0.35);
    if (amt <= 0.01) return;
    var u = L.u, x = L.tree.x, y = L.tree.y - 26 * u;
    ctx.save(); ctx.globalAlpha = amt;
    for (var row = 0; row < 4; row++) {
      ctx.beginPath(); G.rr(ctx, x - 19 * u, y - row * 9 * u, 38 * u, 10 * u, 3 * u);
      ctx.fillStyle = row % 2 ? '#b6a267' : '#c9b57c'; ctx.fill();
      ctx.strokeStyle = 'rgba(70,54,30,.6)'; ctx.lineWidth = 1.1; ctx.stroke();
      for (var k = 0; k < 5; k++) {
        ctx.beginPath(); ctx.moveTo(x - 15 * u + k * 8 * u, y - row * 9 * u);
        ctx.lineTo(x - 15 * u + k * 8 * u + 4 * u, y - row * 9 * u + 10 * u);
        ctx.strokeStyle = 'rgba(88,68,36,.35)'; ctx.lineWidth = 0.8; ctx.stroke();
      }
    }
    ctx.restore();
  }

  function claude(ctx, x, y, s, o) {
    o = o || {};
    var h = s * 0.72, r = s * 0.24, dark = P.outline;
    var walk = o.walk ? Math.sin((o.time || 0) * 9) : 0;
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.tilt || 0); ctx.scale(o.sx || 1, o.sy || 1);
    ctx.beginPath(); ctx.ellipse(0, h * 0.5 + s * 0.13, s * 0.46, s * 0.10, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(26,28,36,.30)'; ctx.fill();
    for (var l = 0; l < 4; l++) {
      var lx = (-0.33 + l * 0.22) * s;
      var ly = h * 0.42 + (walk ? Math.sin((o.time || 0) * 9 + l * 1.8) * s * 0.03 : 0);
      ctx.beginPath(); G.rr(ctx, lx - s * 0.065, ly, s * 0.13, s * 0.20, s * 0.06);
      ctx.fillStyle = P.coralDark; ctx.fill();
      ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, s * 0.022); ctx.stroke();
    }
    for (var a = 0; a < 2; a++) {
      var side = a ? 1 : -1;
      ctx.save(); ctx.translate(side * s * 0.46, h * 0.02);
      ctx.rotate(side * (a === 0 ? (o.armL || 0.3) : -(o.armR || 0.3)));
      ctx.beginPath(); G.rr(ctx, -s * 0.075, -s * 0.01, s * 0.26, s * 0.135, s * 0.065);
      ctx.fillStyle = P.coral; ctx.fill();
      ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, s * 0.022); ctx.stroke();
      ctx.restore();
    }
    ctx.beginPath(); G.rr(ctx, -s / 2, -h / 2, s, h, r);
    ctx.fillStyle = G.linear(ctx, -s / 2, -h / 2, s * 0.3, h / 2,
      [[0, '#fbb08a'], [0.42, P.coralLight], [0.7, P.coral], [1, '#d86645']]);
    ctx.fill();
    ctx.save(); ctx.beginPath(); G.rr(ctx, -s / 2, -h / 2, s, h, r); ctx.clip();
    ctx.fillStyle = 'rgba(138,52,40,.28)'; ctx.fillRect(-s / 2, h * 0.10, s, h * 0.42);
    ctx.fillStyle = 'rgba(255,226,178,.24)'; ctx.fillRect(-s / 2, -h / 2, s, h * 0.17);
    ctx.fillStyle = 'rgba(255,220,160,.18)';
    ctx.beginPath(); ctx.ellipse(s * 0.34, h * 0.02, s * 0.13, h * 0.46, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.beginPath(); G.rr(ctx, -s / 2, -h / 2, s, h, r);
    ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1.4, s * 0.032); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s * 0.42, -h * 0.3); ctx.quadraticCurveTo(s * 0.5, 0, s * 0.40, h * 0.3);
    ctx.strokeStyle = 'rgba(255,222,163,.65)'; ctx.lineWidth = Math.max(1, s * 0.026); ctx.stroke();
    var ex = s * 0.215, ey = -h * 0.07, blink = o.blink ? 0.12 : 1;
    ctx.fillStyle = 'rgba(255,142,140,.36)';
    ctx.beginPath(); ctx.ellipse(-ex - s * 0.03, ey + h * 0.20, s * 0.105, s * 0.055, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(ex + s * 0.03, ey + h * 0.20, s * 0.105, s * 0.055, 0, 0, Math.PI * 2); ctx.fill();
    ctx.lineCap = 'round'; ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1.2, s * 0.038);
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
        ctx.fillStyle = 'rgba(255,250,231,.9)'; ctx.fill();
      }
    }
    ctx.restore();
  }

  function seedSprite(ctx, x, y, s, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0);
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.62, s, 0.25, 0, Math.PI * 2);
    ctx.fillStyle = P.seed; ctx.fill();
    ctx.strokeStyle = 'rgba(36,28,24,.7)'; ctx.lineWidth = Math.max(1, s * 0.12); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(-s * 0.2, -s * 0.3, s * 0.14, s * 0.3, 0.25, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,229,178,.55)'; ctx.fill();
    ctx.restore();
  }

  function hero(ctx, L, t, pal, A) {
    var u = L.u, H = L.hero;
    var plant = win(t, 3.0, 8.0, 1.0);
    var leaf = win(t, 14, 23.5, 2.0);
    var measure = win(t, 27, 37, 2.0);
    var brace = win(t, 39, 48, 1.5);
    var wrap = win(t, 51, 58, 1.5);
    var wake = win(t, 60, 62.5, 0.8);
    var last = sm(66, 68, t);
    var pose = {
      time: t, tilt: 0,
      armL: 0.28 + plant * 1.0 + leaf * 1.15 + brace * 1.05 + wrap * 0.9 + measure * 1.3,
      armR: 0.28 + plant * 0.7 + leaf * 0.9 + brace * 1.15 + wrap * 1.0 + measure * 1.1,
      happy: last > 0.4 || (A.spring > 0.6 && t < 63),
      sleep: wake > 0.5 && t < 61.7,
      blink: Math.sin(t * 0.8) > 0.99,
      tilt: (measure ? -0.05 : 0) + (brace ? -0.24 * brace : 0) + (wrap ? 0.10 : 0) + Math.sin(t * 0.35) * 0.02,
      sx: 1 + wake * 0.08 - plant * 0.05, sy: 1 - wake * 0.08 + plant * 0.05
    };
    var x = H.x + measure * 18 * u + brace * 18 * u + wrap * 12 * u;
    var y = H.y - measure * 2 * u;
    // the found seed, before planting
    if (t < 5.4) {
      var roll = sm(1, 5, t);
      seedSprite(ctx, lp(L.island.x - L.island.w * 0.36, L.soil.x, roll),
        L.soil.y - 9 * u - Math.sin(roll * Math.PI) * 6 * u, 11 * u, t * 2.2);
    }
    // the leaf held over the soil, never over the hero
    if (leaf > 0.01) {
      ctx.save(); ctx.globalAlpha = leaf;
      ctx.translate(L.soil.x - 4 * u, L.soil.y - 52 * u);
      ctx.rotate(-0.45 + Math.sin(t * 0.9) * 0.05);
      ctx.beginPath(); ctx.moveTo(-46 * u, 0);
      ctx.bezierCurveTo(-18 * u, -30 * u, 24 * u, -24 * u, 48 * u, 0);
      ctx.bezierCurveTo(24 * u, 22 * u, -18 * u, 24 * u, -46 * u, 0);
      ctx.closePath();
      ctx.fillStyle = mixHex(pal.grass, '#ffffff', 0.15); ctx.fill();
      ctx.strokeStyle = 'rgba(36,46,34,.6)'; ctx.lineWidth = 2 * u; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-42 * u, 0); ctx.lineTo(44 * u, 0);
      ctx.strokeStyle = 'rgba(255,255,220,.45)'; ctx.lineWidth = 1.4 * u; ctx.stroke();
      ctx.restore();
    }
    // a measuring stake in the hard sun
    if (measure > 0.01) {
      ctx.save(); ctx.globalAlpha = measure;
      ctx.fillStyle = '#7c5c3c'; ctx.fillRect(L.tree.x + 46 * u, L.island.y - 96 * u, 5 * u, 96 * u);
      ctx.strokeStyle = 'rgba(40,30,22,.6)'; ctx.lineWidth = 1;
      for (var m = 0; m < 6; m++) {
        ctx.beginPath(); ctx.moveTo(L.tree.x + 46 * u, L.island.y - (20 + m * 14) * u);
        ctx.lineTo(L.tree.x + 57 * u, L.island.y - (20 + m * 14) * u); ctx.stroke();
      }
      ctx.restore();
    }
    // the new seed under blossom
    var newSeed = sm(63.5, 65, t);
    if (newSeed > 0 && last < 0.55) {
      seedSprite(ctx, L.island.x + L.island.w * 0.06, L.island.y - 7 * u, 10 * u * newSeed, 0.4);
    }
    claude(ctx, x, y, 94 * u, pose);
    if (last > 0.35) {
      ctx.save(); ctx.globalAlpha = last;
      seedSprite(ctx, x + 62 * u, y - 6 * u, 10 * u, 0.2 + t * 0.3);
      ctx.restore();
    }
    // acknowledgement ring, a soft reaction rather than a badge
    for (var c = 0; c < 5; c++) {
      if (!st.care[c]) continue;
      var age = st.clock - st.careAt[c];
      if (E.frozen || age < 0 || age > 1.4) continue;
      var p = age / 1.4;
      ctx.save(); ctx.globalAlpha = (1 - p) * 0.55 * (c === 4 ? 1.4 : 1);
      ctx.strokeStyle = '#fff0c9'; ctx.lineWidth = 2.4 * (1 - p) + 0.8;
      ctx.beginPath(); ctx.ellipse(x, y, 40 * u + p * 80 * u, 24 * u + p * 46 * u, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
  }

  function weather(ctx, L, t, pal, A) {
    var u = L.u, VW = L.VW, VH = L.VH;
    // rain and splashes
    var rainAmt = cl(A.rain + A.storm * 0.85, 0, 1);
    if (rainAmt > 0.02) {
      ctx.save(); ctx.globalAlpha = rainAmt * 0.55;
      ctx.strokeStyle = A.storm > 0.4 ? '#d2d9dc' : '#cbdbe5'; ctx.lineWidth = 1.4 * u;
      var slant = A.storm * 12 * u;
      for (var i = 0; i < 90; i++) {
        var hx = Arcade.hash(i, 31) * (VW + 120 * u);
        var hy = (Arcade.hash(i, 32) * VH + t * (360 + Arcade.hash(i, 33) * 160) * u) % VH;
        ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx - slant, hy + 13 * u); ctx.stroke();
      }
      ctx.restore();
      ctx.save(); ctx.globalAlpha = rainAmt * 0.5;
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.3 * u;
      for (var s = 0; s < 18; s++) {
        var px = L.island.x - L.island.w * 0.45 + Arcade.hash(s, 41) * L.island.w * 0.9;
        var phase = (t * 2.4 + s * 0.63) % 1;
        ctx.globalAlpha = rainAmt * (1 - phase) * 0.55;
        ctx.beginPath(); ctx.ellipse(px, L.island.y + 3 * u, (4 + phase * 10) * u, (1.5 + phase * 2) * u, 0, Math.PI, Math.PI * 2); ctx.stroke();
      }
      ctx.restore();
    }
    // snow that settles, cap the flake count
    if (A.snow > 0.02) {
      ctx.save(); ctx.globalAlpha = A.snow * 0.9;
      for (var f = 0; f < 110; f++) {
        var fx = Arcade.hash(f, 51) * VW + Math.sin(t * 0.7 + f) * 12 * u;
        var fy = (Arcade.hash(f, 52) * VH + t * (16 + Arcade.hash(f, 53) * 22) * u) % VH;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(fx, fy, (1.2 + Arcade.hash(f, 54) * 2.1) * u, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
    // wind strokes at the edge of the frame during the storm
    if (A.storm > 0.05) {
      ctx.save(); ctx.globalAlpha = A.storm * 0.22;
      ctx.strokeStyle = '#e9e2d2'; ctx.lineWidth = 2 * u;
      for (var w = 0; w < 7; w++) {
        var wy = VH * (0.18 + w * 0.09), wx = (t * 90 * u + w * 260) % (VW + 400) - 200;
        ctx.beginPath(); ctx.moveTo(wx, wy);
        ctx.bezierCurveTo(wx + 90 * u, wy - 22 * u, wx + 160 * u, wy + 22 * u, wx + 260 * u, wy);
        ctx.stroke();
      }
      ctx.restore();
    }
    // petals only in spring
    if (A.spring > 0.05) {
      ctx.save(); ctx.globalAlpha = A.spring * 0.8;
      for (var p = 0; p < 40; p++) {
        var px2 = (Arcade.hash(p, 61) * VW + Math.sin(t * 0.5 + p) * 22 * u + t * 7 * u) % VW;
        var py2 = (Arcade.hash(p, 62) * VH + t * 17 * u) % VH;
        ctx.fillStyle = p % 2 ? '#ffdce8' : '#fff0f0';
        ctx.beginPath(); ctx.ellipse(px2, py2, 3.6 * u, 1.7 * u, t * 0.4 + p, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
  }

  function edgeEvents(ctx, L, t, pal, A) {
    var u = L.u;
    // a second island drifting past, far away and unnoticed
    ctx.save(); ctx.globalAlpha = 0.24;
    var ix = ((t * 7 + 60) * u) % (L.VW + 300 * u) - 150 * u;
    var iy = L.island.y - L.VH * 0.27;
    ctx.fillStyle = pal.land;
    ctx.beginPath(); ctx.ellipse(ix, iy, 54 * u, 12 * u, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ix - 50 * u, iy);
    ctx.bezierCurveTo(ix - 24 * u, iy + 26 * u, ix + 20 * u, iy + 36 * u, ix + 34 * u, iy + 46 * u);
    ctx.lineTo(ix + 46 * u, iy); ctx.closePath(); ctx.fill();
    ctx.restore();
    // a bird at the edge of frame, in the evening and under blossom
    var birdAmt = cl(A.evening + A.spring, 0, 1);
    if (birdAmt > 0.05) {
      ctx.save(); ctx.globalAlpha = birdAmt * 0.55;
      var bx = (t * 22 * u) % (L.VW + 160 * u) - 80 * u, by = L.VH * 0.16 + Math.sin(t * 0.6) * 10 * u;
      var flap = Math.sin(t * 6) * 7 * u;
      ctx.strokeStyle = '#3b3a42'; ctx.lineWidth = 2 * u; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(bx - 12 * u, by); ctx.quadraticCurveTo(bx - 5 * u, by - flap, bx, by);
      ctx.quadraticCurveTo(bx + 5 * u, by - flap, bx + 12 * u, by); ctx.stroke();
      ctx.restore();
    }
    // birds living in the spring tree
    if (A.spring > 0.4) {
      ctx.save(); ctx.globalAlpha = cl((A.spring - 0.4) / 0.6, 0, 1) * 0.8;
      for (var b = 0; b < 3; b++) {
        var px = L.tree.x + (b - 1) * 52 * u, py = L.tree.y - (150 + b * 24) * u + Math.sin(t * 1.2 + b) * 3 * u;
        ctx.strokeStyle = '#3b3a42'; ctx.lineWidth = 1.8 * u; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(px - 8 * u, py); ctx.quadraticCurveTo(px - 4 * u, py - 5 * u, px, py);
        ctx.quadraticCurveTo(px + 4 * u, py - 5 * u, px + 8 * u, py); ctx.stroke();
        ctx.fillStyle = '#3b3a42'; ctx.beginPath(); ctx.ellipse(px, py + 3 * u, 5 * u, 3 * u, 0, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
    // a single leaf falling in autumn, off to one side
    if (A.storm > 0.1) {
      ctx.save(); ctx.globalAlpha = A.storm * 0.6;
      var lx = L.VW * 0.06 + Math.sin(t * 1.1) * 34 * u;
      var ly = (t * 34 * u) % (L.VH * 0.7);
      ctx.translate(lx, ly); ctx.rotate(t * 1.7);
      ctx.beginPath(); ctx.ellipse(0, 0, 8 * u, 3.4 * u, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#c99a5c'; ctx.fill(); ctx.restore();
    }
  }

  function cue(ctx, L, t) {
    var active = activeCare(t);
    if (active < 0) return;
    var u = L.u, x = L.hero.x, y = L.hero.y;
    var breathe = 0.35 + 0.25 * Math.sin(t * 2.1);
    ctx.save();
    ctx.globalAlpha = breathe * 0.55;
    ctx.strokeStyle = '#2b3440'; ctx.lineWidth = 4.4 * u;
    ctx.beginPath(); ctx.ellipse(x, y, 70 * u, 46 * u, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = breathe;
    ctx.strokeStyle = '#fff2d3'; ctx.lineWidth = 2.2 * u;
    ctx.beginPath(); ctx.ellipse(x, y, 70 * u, 46 * u, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
    var fs = L.textV, label = 'Press Space or click to ' + CARE[active].label;
    var pill = Math.min(L.VW * 0.92, fs * (label.length * 0.60 + 4));
    var py = L.island.y + L.island.h * 0.52;
    ctx.save();
    ctx.fillStyle = 'rgba(24,32,40,.52)';
    G.rr(ctx, L.cx - pill / 2, py - fs * 1.25, pill, fs * 1.7, 8 * u); ctx.fill();
    ctx.globalAlpha = 0.92;
    T(ctx, label, L.cx, py, fs, '#fff6e2', { family: SANS, align: 'center', tracking: 0.6 });
    ctx.restore();
  }

  function reaction(ctx, L) {
    if (!st.react || E.frozen) return;
    var age = st.clock - st.react.t;
    if (age < 0 || age > 1.2) return;
    var p = age / 1.2;
    ctx.save(); ctx.globalAlpha = (1 - p) * 0.5;
    ctx.strokeStyle = '#fff2d3'; ctx.lineWidth = 2 * (1 - p) + 0.6;
    ctx.beginPath(); ctx.arc(st.react.x, st.react.y, 10 * L.u + p * 90 * L.u, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  function title(ctx, L, t, pal) {
    var a = 1 - sm(2.2, 3.6, t);
    if (a > 0.005) {
      ctx.save(); ctx.globalAlpha = a * 0.75;
      T(ctx, 'The seed', L.cx, L.VH * 0.20, L.titleV, '#3a3038',
        { family: SERIF, align: 'center', baseline: 'middle' });
      T(ctx, 'A tree grows for one year.', L.cx, L.VH * 0.20 + L.titleV * 0.7,
        Math.max(14, L.titleV * 0.22), '#4b4048', { family: SANS, align: 'center', tracking: 2.4 });
      ctx.restore();
    }
    var endA = sm(68.6, 69.6, t) * (1 - sm(70.4, 71.2, t));
    if (endA > 0.005) {
      ctx.save(); ctx.globalAlpha = endA * 0.8;
      T(ctx, 'You find one more seed.', L.cx, L.VH * 0.87, L.textV * 0.95, '#4c3844',
        { family: SERIF, align: 'center' });
      ctx.restore();
    }
    // a soft light wash hides the cut when the year loops
    var wash = Math.max(sm(70.8, 72, t), (1 - sm(0, 1.2, t)) * 0.45);
    if (wash > 0.005) {
      ctx.save(); ctx.globalAlpha = wash * 0.88;
      ctx.fillStyle = '#fff1dc'; ctx.fillRect(0, 0, L.VW, L.VH); ctx.restore();
    }
  }

  function activeCare(t) {
    for (var i = 0; i < 5; i++) {
      if (!st.care[i] && t >= CARE[i].a && t <= CARE[i].b) return i;
    }
    return -1;
  }
  function firstMissed() {
    for (var i = 0; i < 5; i++) if (st.missed[i] && !st.care[i]) return i;
    return -1;
  }
  function allCare() { return st.care[0] && st.care[1] && st.care[2] && st.care[3] && st.care[4]; }
  function doCare(i, progress) {
    if (i < 0 || i > 4 || st.care[i]) return;
    st.care[i] = true; st.missed[i] = false; st.careAt[i] = st.clock;
    if (progress && !E.frozen) {
      Arcade.mark(ID, 'care-' + (i + 1));
      Arcade.toast(TOAST[i]);
      Arcade.sound.tone({ freq: 392 + i * 58, dur: 0.5, gain: 0.05, type: 'sine' });
      Arcade.sound.tone({ freq: 587 + i * 58, dur: 0.4, gain: 0.03, type: 'sine', delay: 0.1 });
    }
    if (allCare() && st.finishAt === null) st.finishAt = st.clock + 2.2;
  }

  function audioTick(t, A) {
    if (E.frozen || st.paused) return;
    var beat = Math.floor(st.clock / 0.9);
    if (beat === st.lastBeat) return;
    st.lastBeat = beat;
    if (!Arcade.sound.enabled) return;
    var b = ((beat % 24) + 24) % 24;
    var chords = [
      [174.61, 220.00, 261.63, 329.63],
      [130.81, 196.00, 246.94, 293.66],
      [146.83, 220.00, 261.63, 349.23],
      [164.81, 246.94, 293.66, 392.00]
    ];
    if (b % 8 === 0) {
      Arcade.sound.chord(chords[Math.floor(b / 8) % 4], 4.5, 0.042);
      Arcade.sound.tone({ freq: chords[Math.floor(b / 8) % 4][0] / 2, dur: 3.4, gain: 0.045, type: 'sine' });
    }
    var melody = [523.25, 587.33, 659.25, 783.99, 659.25, 587.33];
    if (b % 4 === 2) Arcade.sound.tone({ freq: melody[(b / 4) % melody.length | 0], dur: 1.7, gain: 0.032, type: 'sine' });
    if ((A.rain > 0.2 || A.storm > 0.2) && b % 2 === 0) {
      Arcade.sound.noise({ dur: 0.5, gain: 0.012, freq: A.storm > 0.4 ? 700 : 1300, filter: 'lowpass' });
    }
    if (A.snow > 0.2 && b % 8 === 4) {
      Arcade.sound.tone({ freq: 1046.5, dur: 1.2, gain: 0.016, type: 'sine' });
    }
  }

  function update(L) {
    var dt = E.dt || 0;
    if (E.frozen) st.clock = E.t;
    else if (E.auto) {
      if (st.paused) st.botPause += dt;
      st.clock = Math.max(0, E.t - st.botPause);
    } else if (!st.paused) st.clock += dt;
    var t;
    if (E.frozen) t = ((E.t % D) + D) % D;
    else if (E.auto) t = cl(st.clock, 0, D);
    else t = ((st.clock % D) + D) % D;

    // caretaker state is a pure function of time for ?t= and for the bot
    if (E.auto || E.frozen) {
      for (var i = 0; i < 5; i++) {
        var reached = E.frozen ? t >= BOT[i] : st.clock >= BOT[i];
        if (reached && !st.care[i]) doCare(i, E.auto && !E.frozen);
      }
    } else {
      for (var m = 0; m < 5; m++) {
        if (!st.care[m] && t > CARE[m].b) st.missed[m] = true;
      }
    }

    var m2 = E.input.mouse;
    if (m2.inside && (Math.abs(m2.dragX) + Math.abs(m2.dragY) > 0 || E.h - m2.y < 76)) st.hover = 1.5;
    else if (!E.frozen) st.hover = Math.max(0, st.hover - dt);

    var active = activeCare(t);
    if (!E.frozen && !E.auto) {
      if (E.input.justPressed('KeyP')) st.paused = !st.paused;
      if (E.input.justPressed('Space')) {
        if (st.paused) st.paused = false;
        else if (active >= 0) doCare(active, true);
        else {
          var miss = firstMissed();
          if (miss >= 0) doCare(miss, true);
          else st.paused = true;
        }
      }
    } else if (!E.frozen && E.auto && E.input.justPressed('Space')) st.paused = !st.paused;

    var clicks = E.input.consumeClicks();
    for (var c = 0; c < clicks.length; c++) {
      var click = clicks[c];
      if (click.released) continue;
      st.react = { x: click.x / L.k, y: click.y / L.k, t: st.clock };
      if (E.frozen || E.auto) continue;
      if (click.y > E.h - 48 && st.hover > 0) {
        var bx = cl(E.w * 0.06, 20, 120), bw = E.w - 2 * bx;
        var want = cl((click.x - bx) / bw, 0, 1) * D;
        st.clock = D * Math.floor(st.clock / D) + want;
        continue;
      }
      if (active >= 0) doCare(active, true);
      else {
        var missed = firstMissed();
        if (missed >= 0) doCare(missed, true);
      }
    }

    var A = amounts(t);
    audioTick(t, A);
    if (!E.frozen && !st.done && allCare() &&
        ((E.auto && st.clock >= 68.2) || (!E.auto && st.finishAt !== null && st.clock >= st.finishAt) || st.clock >= 78)) {
      st.done = true;
      Arcade.finish({
        score: 500, stars: 3, title: 'Tree grown',
        lines: ['You care for the tree for one year.', 'The tree grows on a small island.',
          'Other islands have no trees.']
      });
    }
    return { t: t, A: A, pal: palette(t) };
  }

  function missedLine(ctx) {
    var names = [];
    for (var i = 0; i < 5; i++) if (st.missed[i] && !st.care[i]) names.push(CARE[i].verb);
    if (!names.length || E.frozen || E.auto) return;
    var label = 'Missed: ' + names.join(', ') + '. Press Space or click.';
    ctx.save();
    ctx.fillStyle = 'rgba(24,32,40,.6)';
    ctx.fillRect(10, E.h - 70, Math.min(E.w - 20, label.length * 6.4 + 20), 22);
    T(ctx, label, 18, E.h - 55, 11, P.ink, { family: SANS, tracking: 0.6 });
    ctx.restore();
  }

  function scrub(ctx, t) {
    if (st.hover <= 0) return;
    var alpha = cl(st.hover / 0.5, 0, 1) * 0.9;
    var bx = cl(E.w * 0.06, 20, 120), bw = E.w - 2 * bx, by = E.h - 24;
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(20,28,36,.68)'; ctx.fillRect(bx - 8, by - 18, bw + 16, 36);
    ctx.fillStyle = 'rgba(246,234,214,.30)'; ctx.fillRect(bx, by, bw, 2);
    ctx.fillStyle = P.green; ctx.fillRect(bx, by, bw * cl(t / D, 0, 1), 2);
    for (var i = 0; i < SEASONS.length; i++) {
      var x = bx + bw * (SEASONS[i].t / D);
      ctx.fillStyle = 'rgba(246,234,214,.55)'; ctx.fillRect(x, by - 5, 1.5, 12);
    }
    var px = bx + bw * cl(t / D, 0, 1);
    ctx.beginPath(); ctx.arc(px, by + 1, 5, 0, Math.PI * 2);
    ctx.fillStyle = P.coral; ctx.fill(); ctx.strokeStyle = '#1a2c3d'; ctx.lineWidth = 1.4; ctx.stroke();
    var season = SEASONS[0].n;
    for (var s = 0; s < SEASONS.length; s++) if (t >= SEASONS[s].t) season = SEASONS[s].n;
    T(ctx, season.toUpperCase(), bx, by - 7, 11, P.ink, { family: SANS, tracking: 1.6 });
    T(ctx, Math.round(t) + ' / ' + D, bx + bw, by - 7, 11, P.ink,
      { family: SANS, align: 'right', tracking: 1 });
    if (st.paused) T(ctx, 'PAUSED', E.w / 2, by - 7, 11, '#ffe0b3',
      { family: SANS, align: 'center', tracking: 2 });
    ctx.restore();
  }

  function onFrame(ctx, env) {
    E = env;
    var L = stage();
    buildCaches(L);
    var v = update(L);
    var t = v.t, A = v.A, pal = v.pal;
    ctx.save();
    ctx.scale(L.k, L.k);
    sky(ctx, L, t, pal, A);
    cloudSea(ctx, L, t, pal, A);
    edgeEvents(ctx, L, t, pal, A);
    island(ctx, L, t, pal, A);
    settledSnow(ctx, L, t, pal, A);
    tree(ctx, L, t, pal, A);
    scarf(ctx, L, t, A);
    hero(ctx, L, t, pal, A);
    weather(ctx, L, t, pal, A);
    cue(ctx, L, t);
    reaction(ctx, L);
    title(ctx, L, t, pal);
    ctx.restore();
    missedLine(ctx);
    scrub(ctx, t);
    G.grain(ctx, E.w, E.h, 0.042);
    G.vignette(ctx, E.w, E.h, 0.18);
  }
})();
