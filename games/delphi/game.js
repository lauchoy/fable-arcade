(function () {
  'use strict';
  var A = window.Arcade;
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(a, b, x) { var t = clamp((x - a) / (b - a || 1), 0, 1); return t * t * (3 - 2 * t); }
  function hashText(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; } return h >>> 0; }

  var P = { bg: '#efe9dc', ink: '#1d2730', accent: '#b08436', accent2: '#6f8a96', stone: '#f9f5ea', dim: '#8a8374' };

  var APHORISMS = [
    'A question must state what you want to measure.',
    'We do not forecast. We count the measurements.',
    'We give short answers that use few sources.',
    'We measure uncertainty as a number.',
    'We give no answer without a named source.',
    'A model that agrees with all measures nothing.',
    'Check the date before you read the answer.',
    'The oracle files each answer with its source.',
    'We give the exact measured numbers.',
    'We keep the ledger. We do not guess.',
    'We do not change a question to fit an answer.',
    'We take three measurements instead of one guess.'
  ];
  var BOT_QUESTIONS = ['What is a forecast?', 'How is a source kept?', 'When should a model refuse?'];

  var COPY = [
    {
      eyebrow: 'Institute / Kifissia / since 2016',
      head: 'DELPHI',
      lead: 'We build models from measurements.',
      body: [
        'We build models that answer measured questions. We read the records. We weigh each source. We keep the source next to the claim.',
        'We have forty-one people in one workshop. We never rewrite the ledger.'
      ]
    },
    {
      eyebrow: 'Research / 01',
      head: 'RESEARCH',
      lead: 'Three programmes. One method.',
      body: [
        'Provenance. We add a source to each answer. We give a date and a page.',
        'Calibration. We count the wrong answers first. Then we count the right answers.',
        'Limits. We list every question a model declines. We give the reason.'
      ]
    },
    {
      eyebrow: 'Models / 02',
      head: 'MODELS',
      lead: 'We name each model for its limit.',
      body: ['We publish each model with its failures. We list more failures than features.'],
      models: [
        ['KLEIO 3', 'Retrieval. We give the passage and page. We add no words.', '4.1 B parameters / 2025'],
        ['THEMIS 2', 'Calibration. We report confidence from held-out sets.', '0.8 B parameters / 2024'],
        ['AEON 1', 'Long records. We read a century of ledgers. We keep the gaps.', '2.2 B parameters / 2026']
      ]
    },
    {
      eyebrow: 'Principles / 03',
      head: 'PRINCIPLES',
      lead: 'Four rules on the wall.',
      body: [],
      principles: [
        ['01', 'A measurement counts more than a guess.'],
        ['02', 'We give no answer without a named source.'],
        ['03', 'We treat a refusal as a result.'],
        ['04', 'We keep the ledger longer.']
      ]
    },
    {
      eyebrow: 'The oracle / 04',
      head: 'ASK THE ORACLE',
      lead: 'It gives short answers, not forecasts.',
      body: ['Type your question. Press Enter. Ask three questions. We do not save your question.']
    },
    {
      eyebrow: 'Letters / 05',
      head: 'DELPHI',
      lead: 'The Institute for Oracular Systems',
      body: [
        '12 Kifissias, Athenai 151 25. We open on Thursdays. Book a time first.',
        'Letters: registry@delphi.institute. We reply in writing once a month.'
      ],
      footer: [
        'We do not forecast markets, wars, or feelings.',
        'We draw the bust. We measure it ourselves.',
        'We carve the capitals in the workshop. We copy the border from an old vase.'
      ]
    }
  ];

  var st = {
    marks: [false, false, false],
    accuracy: [],
    qCount: 0,
    asked: [],
    answer: '',
    lastQ: '',
    used: [],
    note: 'Click a mark when the scan line reaches it.',
    finished: false,
    botQ: 0,
    art: null,
    geo: null,
    fieldRect: null,
    lastCss: ''
  };

  var field = document.createElement('input');
  field.type = 'text';
  field.maxLength = 72;
  field.placeholder = 'Type a question';
  field.setAttribute('aria-label', 'Ask the oracle');
  field.style.cssText = 'position:fixed;z-index:24;display:none;box-sizing:border-box;padding:8px 11px;' +
    'font:14px Georgia,"Times New Roman",serif;color:#1d2730;background:#f7f2e6;' +
    'border:1px solid rgba(29,39,48,.42);border-radius:0;outline:none;';
  document.body.appendChild(field);

  var askBtn = document.createElement('button');
  askBtn.type = 'button';
  askBtn.textContent = 'Ask';
  askBtn.style.cssText = 'position:fixed;z-index:24;display:none;box-sizing:border-box;height:34px;padding:0 16px;' +
    'font:11px "IBM Plex Mono",ui-monospace,monospace;letter-spacing:.16em;text-transform:uppercase;' +
    'color:#f4efe4;background:#1d2730;border:1px solid #1d2730;cursor:pointer;';
  document.body.appendChild(askBtn);

  var env = A.boot({
    id: 'delphi',
    title: 'Delphi - marble and hologram',
    hint: 'Click each mark when the scan line reaches it. Ask three questions.',
    background: P.bg,
    ink: P.ink,
    scroll: true,
    sections: 6,
    onFrame: frame
  });

  if (env.view === 'oracle') { env.s = env.sTarget = 0.8; }
  else if (env.view === 'scan' || env.view === 'wide') { env.s = env.sTarget = 0; }

  // The SDK's wheel handler writes to its input object; keep env.sTarget moving too.
  (function installScroll() {
    var c = env.canvas, lastY = null;
    c.addEventListener('wheel', function (e) {
      env.sTarget = clamp(env.sTarget + Math.sign(e.deltaY || 0) * 0.085, 0, 1);
      e.preventDefault();
    }, { passive: false });
    c.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') lastY = e.clientY; });
    c.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'mouse' || lastY === null) return;
      var dy = e.clientY - lastY; lastY = e.clientY;
      env.sTarget = clamp(env.sTarget - dy / Math.max(220, env.h), 0, 1);
    });
    c.addEventListener('pointerup', function () { lastY = null; });
    window.addEventListener('keydown', function (e) {
      if (e.code === 'PageDown' || e.code === 'ArrowDown') env.sTarget = clamp(env.sTarget + 0.2, 0, 1);
      else if (e.code === 'PageUp' || e.code === 'ArrowUp') env.sTarget = clamp(env.sTarget - 0.2, 0, 1);
      else if (e.code === 'Home') env.sTarget = 0;
      else if (e.code === 'End') env.sTarget = 1;
    });
  })();


  function noticeInput() {
    if (!env.started) { env.started = true; env.attract = !!env.auto; }
  }
  field.addEventListener('pointerdown', noticeInput);
  field.addEventListener('keydown', function (e) {
    e.stopPropagation();
    noticeInput();
    if (e.key === 'Enter') { e.preventDefault(); ask(field.value); }
    if (e.key === 'Escape') field.blur();
  });
  askBtn.addEventListener('pointerdown', noticeInput);
  askBtn.addEventListener('click', function (e) { e.stopPropagation(); noticeInput(); ask(field.value); });

  function ask(text) {
    text = String(text || '').trim().replace(/\s+/g, ' ').slice(0, 72);
    if (!text) { st.answer = 'Type a question first.'; return; }
    var idx = (hashText(text.toLowerCase()) + st.asked.length * 5) % APHORISMS.length;
    for (var guard = 0; guard < APHORISMS.length && st.used.indexOf(idx) >= 0; guard++) idx = (idx + 1) % APHORISMS.length;
    st.used.push(idx);
    st.answer = APHORISMS[idx];
    st.lastQ = text;
    st.asked.push(text);
    if (st.qCount < 3) {
      st.qCount++;
      A.mark('delphi', 'oracle-' + st.qCount);
    }
    st.note = 'You have ' + st.qCount + ' of 3 answers.';
    field.value = '';
    A.sound.tone({ freq: 392, dur: 0.3, gain: 0.06, type: 'sine' });
    A.sound.tone({ freq: 588, dur: 0.42, gain: 0.045, delay: 0.09 });
    checkDone();
  }

  function lightMark(i, acc) {
    if (st.marks[i]) return;
    st.marks[i] = true;
    st.accuracy.push(clamp(acc, 0.05, 1));
    A.mark('delphi', 'scan-' + (i + 1));
    A.sound.tone({ freq: 494 + i * 82, dur: 0.22, gain: 0.08, type: 'sine' });
    st.note = 'We record mark ' + (i + 1) + '.';
    checkDone();
  }
  function attemptMark(i) {
    if (st.marks[i] || !st.geo) return;
    var d = Math.abs(st.geo.scanY - st.geo.marks[i].y);
    if (d > st.geo.win) { st.note = 'Wait until the scan line reaches it.'; return; }
    lightMark(i, clamp(1 - d / st.geo.win, 0.05, 1));
  }
  function checkDone() {
    var n = 0;
    for (var i = 0; i < 3; i++) if (st.marks[i]) n++;
    if (st.finished || n < 3 || st.qCount < 3) return;
    st.finished = true;
    var sum = 0;
    for (var j = 0; j < st.accuracy.length; j++) sum += st.accuracy[j];
    var avg = sum / Math.max(1, st.accuracy.length);
    var stars = avg > 0.72 ? 3 : (avg > 0.38 ? 2 : 1);
    var score = Math.round(600 + avg * 900);
    A.score('delphi', score);
    A.sound.chord([294, 370, 440, 587], 0.9, 0.05);
    A.finish({
      score: score, stars: stars,
      title: 'All tasks complete',
      lines: ['Marks: 3 of 3', 'You asked 3 questions.', 'Timing accuracy ' + Math.round(avg * 100) + '%']
    });
  }

  function layout() {
    var W = env.w, H = env.h;
    var narrow = W < 760;
    var pad = clamp(W * 0.055, 16, 92);
    var K = clamp(Math.min(W / 1180, H / 780), 0.5, 1.7);
    var art = narrow
      ? { x: pad, y: H * 0.085, w: W - 2 * pad, h: H * 0.29 }
      : { x: W * 0.54, y: H * 0.13, w: W * 0.41, h: H * 0.74 };
    var copy = narrow
      ? { x: pad, y: H * 0.40, w: W - 2 * pad, h: H * 0.55 }
      : { x: pad, y: H * 0.19, w: W * 0.43, h: H * 0.67 };
    if (env.view === 'wide' && !narrow) {
      art = { x: W * 0.45, y: H * 0.10, w: W * 0.51, h: H * 0.80 };
      copy = { x: pad, y: H * 0.20, w: W * 0.33, h: H * 0.64 };
    }
    return { W: W, H: H, narrow: narrow, pad: pad, K: K, art: art, copy: copy };
  }

  function bustGeom(L) {
    var R = L.art;
    var sc = Math.min(R.w * 0.78 / 360, R.h * 0.92 / 480);
    var iw = 360 * sc, ih = 480 * sc;
    var ix = R.x + (R.w - iw) / 2, iy = R.y + (R.h - ih) / 2;
    var scanView = env.view === 'scan';
    var phase = ((env.t * 0.16) % 1 + 1) % 1;
    var fx = [0.37, 0.63, 0.50], fy = [0.29, 0.51, 0.73];
    var marks = [];
    for (var k = 0; k < 3; k++) marks.push({ x: ix + iw * fx[k], y: iy + ih * fy[k] });
    return {
      ix: ix, iy: iy, iw: iw, ih: ih, phase: phase,
      scanY: iy + ih * (0.10 + 0.82 * phase),
      bandH: ih * (scanView ? 0.20 : 0.145), win: ih * (scanView ? 0.14 : 0.115), marks: marks,
      hit: Math.max(20 * L.K, 17)
    };
  }

  function ensureArt() {
    if (st.art) return;
    var marble = A.gfx.offscreen(360, 480, function (c, w, h) { drawMarble(c, w, h, env.rng(env.seed * 13 + 71)); });
    var wire = A.gfx.offscreen(360, 480, function (c, w, h) { drawWire(c, w, h, env.rng(env.seed * 17 + 29)); });
    var paper = A.gfx.offscreen(220, 220, function (c, w, h) {
      var r = env.rng(env.seed * 7 + 401);
      c.clearRect(0, 0, w, h);
      for (var i = 0; i < 2200; i++) {
        c.fillStyle = 'rgba(96,84,62,' + (0.015 + r() * 0.05) + ')';
        c.fillRect(r() * w, r() * h, 0.7 + r() * 1.4, 0.7 + r() * 1.4);
      }
      for (var j = 0; j < 90; j++) {
        c.strokeStyle = 'rgba(120,108,86,' + (0.02 + r() * 0.04) + ')';
        c.lineWidth = 0.6;
        c.beginPath(); var x = r() * w, y = r() * h;
        c.moveTo(x, y); c.lineTo(x + 6 + r() * 20, y + (r() - 0.5) * 4); c.stroke();
      }
    });
    st.art = { marble: marble, wire: wire, paper: paper };
  }

  function bustPath(c) {
    c.beginPath();
    c.moveTo(50, 472);
    c.bezierCurveTo(54, 384, 106, 362, 138, 330);
    c.bezierCurveTo(150, 318, 150, 300, 144, 286);
    c.bezierCurveTo(112, 276, 100, 248, 100, 208);
    c.bezierCurveTo(98, 138, 124, 86, 180, 84);
    c.bezierCurveTo(236, 86, 262, 138, 260, 208);
    c.bezierCurveTo(260, 248, 248, 276, 216, 286);
    c.bezierCurveTo(210, 300, 210, 318, 222, 330);
    c.bezierCurveTo(254, 362, 306, 384, 310, 472);
    c.closePath();
  }

  function drawMarble(c, w, h, r) {
    c.clearRect(0, 0, w, h);
    // Cast shadow under the plinth.
    c.fillStyle = A.gfx.radial(c, 180, 468, 4, 180, 468, 150, [[0, 'rgba(30,34,38,.34)'], [1, 'rgba(30,34,38,0)']]);
    c.fillRect(20, 420, 320, 60);
    c.save();
    bustPath(c);
    c.fillStyle = A.gfx.linear(c, 70, 60, 300, 430, [
      [0, '#fcf9ef'], [0.26, '#eee9dc'], [0.55, '#cfcabd'], [0.79, '#a6a8a5'], [1, '#727c82']
    ]);
    c.fill();
    c.clip();
    // Mottled stone.
    for (var i = 0; i < 22; i++) {
      var x = 90 + r() * 190, y = 90 + r() * 360, rad = 20 + r() * 70;
      c.fillStyle = A.gfx.radial(c, x, y, 2, x, y, rad, [[0, 'rgba(120,132,138,' + (0.04 + r() * 0.07) + ')'], [1, 'rgba(120,132,138,0)']]);
      c.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
    // Veins, laid down like pigment in the stone.
    for (var v = 0; v < 15; v++) {
      var pts = [], y0 = 90 + r() * 350, x0 = 70 + r() * 60;
      for (var k = 0; k < 7; k++) pts.push([x0 + k * 35, y0 + Math.sin(k * 0.9 + v) * 22 + (r() - 0.5) * 16]);
      A.gfx.paintStroke(c, pts, v % 4 === 0 ? 'rgba(88,112,126,.19)' : 'rgba(116,110,96,.14)', 1.4 + r() * 1.6, env.seed + v * 31, { passes: 2, jitter: 4, alpha: 0.55 });
    }
    // Directional studio shade on the right.
    c.fillStyle = A.gfx.linear(c, 150, 0, 310, 0, [[0, 'rgba(24,34,42,0)'], [0.7, 'rgba(24,34,42,.05)'], [1, 'rgba(24,34,42,.34)']]);
    c.fillRect(0, 0, w, h);
    // Carved hair, brow, eye sockets, nose and mouth: kept quiet.
    var dark = 'rgba(58,64,68,.24)';
    for (var q = 0; q < 9; q++) {
      var hx = 120 + q * 15, hy = 100 + Math.sin(q * 1.6) * 9;
      A.gfx.paintStroke(c, [[hx, hy], [hx + 8, hy - 12], [hx + 18, hy - 5]], dark, 3.2, 800 + q, { passes: 2, jitter: 2, alpha: 0.5 });
    }
    A.gfx.paintStroke(c, [[133, 190], [155, 184], [172, 190]], 'rgba(52,58,62,.28)', 2.2, 91, { passes: 2, jitter: 1.5 });
    A.gfx.paintStroke(c, [[192, 190], [208, 184], [228, 190]], 'rgba(52,58,62,.28)', 2.2, 92, { passes: 2, jitter: 1.5 });
    A.gfx.paintStroke(c, [[180, 192], [176, 228], [186, 236]], 'rgba(52,58,62,.16)', 3, 93, { passes: 2, jitter: 1.5 });
    A.gfx.paintStroke(c, [[163, 258], [180, 262], [198, 258]], 'rgba(52,58,62,.21)', 2, 94, { passes: 2, jitter: 1 });
    A.gfx.paintStroke(c, [[140, 300], [180, 312], [220, 300]], 'rgba(52,58,62,.12)', 4, 95, { passes: 2, jitter: 2 });
    c.restore();
    // Rim light along the left contour.
    c.save(); bustPath(c);
    c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 2.2; c.stroke();
    c.restore();
    // Plinth with a carved line.
    c.fillStyle = A.gfx.linear(c, 60, 444, 300, 478, [[0, '#e7e1d3'], [0.5, '#c9c3b4'], [1, '#8d8f8c']]);
    c.fillRect(58, 444, 244, 30);
    c.fillStyle = 'rgba(255,255,255,.5)'; c.fillRect(58, 445, 244, 1.5);
    c.fillStyle = 'rgba(40,46,50,.32)'; c.fillRect(58, 471, 244, 3);
    c.font = '9px Georgia, serif'; c.fillStyle = 'rgba(29,39,48,.6)';
    c.textAlign = 'center'; c.fillText('SPECIMEN 01 / CARRARA SUBSTITUTE', 180, 462);
  }

  function drawWire(c, w, h, r) {
    c.clearRect(0, 0, w, h);
    c.save();
    bustPath(c);
    c.fillStyle = 'rgba(20,32,40,.93)'; c.fill();
    c.clip();
    var thin = 'rgba(111,160,178,.52)', hot = 'rgba(200,166,92,.72)';
    // Latitudes across the head and shoulders.
    for (var i = 1; i <= 12; i++) {
      var y = 78 + i * 33, pts = [];
      var half = 42 + 68 * Math.sin(Math.min(1, (y - 78) / 400) * Math.PI * 0.75);
      for (var k = 0; k <= 10; k++) pts.push([180 - half + (2 * half) * k / 10, y + Math.sin(k / 10 * Math.PI) * (7 + r() * 5)]);
      A.gfx.paintStroke(c, pts, i % 4 === 0 ? hot : thin, 1, 1200 + i, { passes: 1, jitter: 1.4, alpha: 0.75 });
    }
    // Meridians.
    for (var m = -3; m <= 3; m++) {
      var pts2 = [];
      for (var j = 0; j <= 12; j++) {
        var yy = 80 + j * 33, xx = 180 + m * 26 * Math.sin(Math.min(1, (yy - 78) / 330) * Math.PI * 0.8) + m * 6;
        pts2.push([xx, yy]);
      }
      A.gfx.paintStroke(c, pts2, m === 0 ? hot : thin, 1, 1400 + m, { passes: 1, jitter: 1.2, alpha: 0.7 });
    }
    // Landmarks and their callouts.
    var marks = [[180, 84, 'AX 00'], [144, 190, '0.062 m'], [216, 190, '0.064 m'], [180, 236, 'AX 03'], [140, 300, '0.184 m'], [180, 444, 'BASE']];
    for (var q = 0; q < marks.length; q++) {
      var mk = marks[q];
      c.strokeStyle = hot; c.lineWidth = 1;
      c.beginPath(); c.moveTo(mk[0] - 6, mk[1]); c.lineTo(mk[0] + 6, mk[1]);
      c.moveTo(mk[0], mk[1] - 6); c.lineTo(mk[0], mk[1] + 6); c.stroke();
      c.beginPath(); c.moveTo(mk[0] + 7, mk[1]); c.lineTo(mk[0] + 58, mk[1] - 13); c.stroke();
      c.font = '8px Georgia, serif'; c.fillStyle = 'rgba(226,190,116,.85)';
      c.textAlign = 'left'; c.fillText(mk[2], mk[0] + 59, mk[1] - 14);
    }
    c.restore();
    c.save(); bustPath(c);
    c.strokeStyle = 'rgba(140,190,206,.65)'; c.lineWidth = 1.4; c.stroke();
    c.restore();
  }

  function wrapText(ctx, text, x, y, maxW, lineH, size, color) {
    ctx.save();
    ctx.font = size + 'px Georgia, "Times New Roman", serif';
    ctx.fillStyle = color;
    var words = String(text).split(' '), line = '', yy = y;
    for (var i = 0; i < words.length; i++) {
      var test = line ? line + ' ' + words[i] : words[i];
      if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, yy); yy += lineH; line = words[i]; }
      else line = test;
    }
    if (line) { ctx.fillText(line, x, yy); yy += lineH; }
    ctx.restore();
    return yy;
  }
  function caps(ctx, text, x, y, size, color, tracking) {
    A.gfx.copyText(ctx, text, x + 1.3, y + 1.5, size, 'rgba(255,255,255,.68)',
      { family: 'Georgia, "Times New Roman", serif', weight: '600', tracking: tracking || 0 });
    A.gfx.copyText(ctx, text, x, y, size, color,
      { family: 'Georgia, "Times New Roman", serif', weight: '600', tracking: tracking || 0 });
  }
  function rule(ctx, x, y, w, color) {
    ctx.strokeStyle = color || 'rgba(29,39,48,.34)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, y + 0.5); ctx.lineTo(x + w, y + 0.5); ctx.stroke();
  }

  function drawLaurel(ctx, cx, cy, size, t) {
    var d = (t * 0.17) % 1.35;
    var progress = clamp(d, 0.05, 1);
    for (var side = -1; side <= 1; side += 2) {
      var pts = [];
      for (var k = 0; k <= 18; k++) {
        var u = k / 18;
        pts.push([cx + side * size * u * 0.92, cy + size * (0.55 - 0.85 * u * u)]);
      }
      var n = Math.max(2, Math.round(progress * pts.length));
      A.gfx.paintStroke(ctx, pts.slice(0, n), 'rgba(111,138,150,.75)', 2.2, 330 + side, { passes: 2, jitter: 1.1, alpha: 0.75 });
      for (var j = 1; j < n - 1; j += 2) {
        var p = pts[j];
        var leaf = [[p[0], p[1]], [p[0] + side * size * 0.10, p[1] - size * 0.10], [p[0] + side * size * 0.19, p[1] - size * 0.06]];
        A.gfx.paintStroke(ctx, leaf, 'rgba(111,138,150,.55)', 2.6, 500 + j + side, { passes: 2, jitter: 1.5, alpha: 0.6 });
      }
    }
    ctx.fillStyle = P.accent;
    ctx.beginPath(); ctx.arc(cx, cy + size * 0.55, 2.4, 0, Math.PI * 2); ctx.fill();
  }

  function drawColumns(ctx, x, y, w, h, t) {
    var n = 6, unit = w / (n + 1);
    var morph = 0.5 + 0.5 * Math.sin(t * 0.42);
    var data = [0.42, 0.68, 0.55, 0.86, 0.61, 0.74];
    for (var i = 0; i < n; i++) {
      var bx = x + unit * (i + 1) - unit * 0.24, bw = unit * 0.48;
      ctx.save();
      ctx.globalAlpha = 0.85 * (1 - morph * 0.75);
      var g = A.gfx.linear(ctx, bx, 0, bx + bw, 0, [[0, '#f6f1e5'], [0.5, '#d9d2c2'], [1, '#a8a69f']]);
      ctx.fillStyle = g; ctx.fillRect(bx, y, bw, h);
      ctx.strokeStyle = 'rgba(29,39,48,.24)';
      for (var f = 1; f <= 4; f++) {
        ctx.beginPath(); ctx.moveTo(bx + bw * f / 5, y + 3); ctx.lineTo(bx + bw * f / 5, y + h - 3); ctx.stroke();
      }
      ctx.restore();
      ctx.fillStyle = 'rgba(29,39,48,.30)';
      ctx.fillRect(bx - 2, y - 4, bw + 4, 3);
      ctx.fillRect(bx - 2, y + h, bw + 4, 3);
      // The flutes resolve into measured bars.
      var value = clamp(data[i] * (0.78 + 0.22 * Math.sin(t * 0.75 + i)), 0.05, 0.98);
      var segs = 9;
      for (var s = 0; s < segs; s++) {
        if (s / segs > value) break;
        var sy = y + h - (s + 1) * (h / segs) + 2;
        ctx.globalAlpha = (0.25 + 0.75 * morph) * (0.35 + 0.65 * (1 - s / segs));
        ctx.fillStyle = i === 3 ? P.accent : P.accent2;
        ctx.fillRect(bx + bw * 0.12, sy, bw * 0.76, Math.max(2, h / segs - 3));
      }
      ctx.globalAlpha = 1;
    }
    rule(ctx, x, y + h + 7, w, 'rgba(29,39,48,.3)');
  }

  function drawGround(ctx, L) {
    var W = L.W, H = L.H;
    ctx.fillStyle = A.gfx.radial(ctx, W * 0.64, H * 0.34, 8, W * 0.64, H * 0.34, Math.max(W, H) * 0.85,
      [[0, 'rgba(255,255,255,.6)'], [0.62, 'rgba(255,255,255,0)'], [1, 'rgba(70,64,50,.14)']]);
    ctx.fillRect(0, 0, W, H);
    if (st.art && st.art.paper) {
      ctx.save(); ctx.globalAlpha = 0.5;
      ctx.fillStyle = ctx.createPattern(st.art.paper, 'repeat');
      ctx.fillRect(0, 0, W, H); ctx.restore();
    }
    A.gfx.vignette(ctx, W, H, 0.13);
  }

  function drawBorders(ctx, L) {
    var W = L.W, H = L.H, t = env.t;
    var u = clamp(22 * L.K, 14, 34), yTop = clamp(10 * L.K, 8, 16), yBot = H - yTop;
    var dim = 'rgba(111,138,150,.46)';
    function border(y0, flip) {
      ctx.strokeStyle = 'rgba(29,39,48,.22)';
      ctx.beginPath(); ctx.moveTo(L.pad, y0 + (flip > 0 ? u * 0.9 : -u * 0.9));
      ctx.lineTo(W - L.pad, y0 + (flip > 0 ? u * 0.9 : -u * 0.9)); ctx.stroke();
      var count = Math.max(2, Math.floor((W - 2 * L.pad) / u));
      var lit = Math.floor(((t * 0.55) % 1 + 1) % 1 * count);
      for (var i = 0; i < count; i++) {
        var x = L.pad + i * u;
        var pts = [[x, y0], [x + u * 0.84, y0], [x + u * 0.84, y0 + flip * u * 0.58],
          [x + u * 0.2, y0 + flip * u * 0.58], [x + u * 0.2, y0 + flip * u * 0.24],
          [x + u * 0.56, y0 + flip * u * 0.24], [x + u * 0.56, y0 + flip * u * 0.42]];
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (var k = 1; k < pts.length; k++) ctx.lineTo(pts[k][0], pts[k][1]);
        ctx.lineWidth = i === lit ? 2 : 1;
        ctx.strokeStyle = i === lit ? 'rgba(176,132,54,.95)' : dim;
        ctx.stroke();
        if (i === lit) A.gfx.spark(ctx, x + u * 0.84, y0 + flip * u * 0.58, clamp(3 * L.K, 2, 5), 'rgba(176,132,54,.9)', 0);
        if (i % 4 === 0) {
          ctx.fillStyle = 'rgba(29,39,48,.45)';
          ctx.fillRect(x - 1.5, y0 - 1.5, 3, 3);
        }
      }
    }
    border(yTop, 1);
    border(yBot, -1);
    // Thin side rails with measurement ticks.
    ctx.strokeStyle = 'rgba(29,39,48,.20)';
    ctx.beginPath(); ctx.moveTo(L.pad, H * 0.12); ctx.lineTo(L.pad, H * 0.88);
    ctx.moveTo(W - L.pad, H * 0.12); ctx.lineTo(W - L.pad, H * 0.88); ctx.stroke();
    for (var q = 0; q <= 12; q++) {
      var yy = H * (0.12 + 0.76 * q / 12);
      ctx.fillStyle = q % 3 === 0 ? 'rgba(176,132,54,.7)' : 'rgba(29,39,48,.3)';
      ctx.fillRect(W - L.pad - 3, yy, 5, 1);
    }
  }

  function drawApparatus(ctx, L) {
    var R = L.art, K = L.K, g = st.geo, t = env.t;
    ctx.save();
    A.gfx.rr(ctx, R.x, R.y, R.w, R.h, 6 * K);
    ctx.fillStyle = A.gfx.linear(ctx, R.x, R.y, R.x + R.w, R.y + R.h,
      [[0, '#e9e2d2'], [0.48, '#d7cfbd'], [1, '#bdb7a7']]);
    ctx.fill();
    ctx.save(); ctx.clip();
    // Recessed niche light.
    ctx.fillStyle = A.gfx.radial(ctx, R.x + R.w * 0.48, R.y + R.h * 0.34, 4, R.x + R.w * 0.48, R.y + R.h * 0.34, R.w * 0.85,
      [[0, 'rgba(255,255,255,.55)'], [0.6, 'rgba(255,255,255,0)'], [1, 'rgba(29,39,48,.24)']]);
    ctx.fillRect(R.x, R.y, R.w, R.h);
    // Drawn bust, then the hologram hidden in the stone.
    ctx.drawImage(st.art.marble, g.ix, g.iy, g.iw, g.ih);
    ctx.save();
    ctx.globalAlpha = 0.085;
    ctx.drawImage(st.art.wire, g.ix, g.iy, g.iw, g.ih);
    ctx.restore();
    var band = g.bandH;
    ctx.save();
    ctx.beginPath(); ctx.rect(g.ix - 10, g.scanY - band / 2, g.iw + 20, band); ctx.clip();
    ctx.drawImage(st.art.wire, g.ix, g.iy, g.iw, g.ih);
    ctx.fillStyle = A.gfx.linear(ctx, 0, g.scanY - band / 2, 0, g.scanY + band / 2,
      [[0, 'rgba(111,160,178,.10)'], [0.5, 'rgba(111,160,178,.04)'], [1, 'rgba(111,160,178,.10)']]);
    ctx.fillRect(g.ix - 10, g.scanY - band / 2, g.iw + 20, band);
    ctx.restore();
    // Scan line and its soft light.
    A.gfx.glow(ctx, R.x + R.w / 2, g.scanY, R.w * 0.52, 'rgba(176,160,96,.16)');
    ctx.fillStyle = 'rgba(205,174,100,.9)';
    ctx.fillRect(g.ix - 12, g.scanY - 1, g.iw + 24, 2);
    ctx.fillStyle = 'rgba(111,160,178,.55)';
    ctx.fillRect(g.ix - 12, g.scanY - band / 2, g.iw + 24, 1);
    ctx.fillRect(g.ix - 12, g.scanY + band / 2, g.iw + 24, 1);
    // Measurements beside the band.
    ctx.font = clamp(9 * K, 8, 12) + 'px "IBM Plex Mono", monospace';
    ctx.fillStyle = 'rgba(29,39,48,.66)'; ctx.textAlign = 'left';
    ctx.fillText('SCAN ' + (g.phase < 0.5 ? 'A' : 'B') + ' / ' + (g.phase * 0.184).toFixed(3) + ' m', R.x + 8 * K, g.scanY - band * 0.7);
    for (var k = 0; k < 9; k++) {
      var ty = g.scanY - band / 2 + band * k / 8;
      ctx.fillRect(R.x + R.w - 12 * K, ty, 5 * K, 1);
    }
    // A moving specular sweep over the stone keeps the still picture alive.
    var sweep = ((t * 0.11) % 1.6) - 0.3;
    var sx = R.x + R.w * sweep;
    ctx.fillStyle = A.gfx.linear(ctx, sx - R.w * 0.16, 0, sx + R.w * 0.16, 0,
      [[0, 'rgba(255,255,255,0)'], [0.5, 'rgba(255,255,255,.13)'], [1, 'rgba(255,255,255,0)']]);
    ctx.fillRect(sx - R.w * 0.16, R.y, R.w * 0.32, R.h);
    ctx.restore();

    // Three marks on the stone.
    for (var i = 0; i < 3; i++) {
      var m = g.marks[i], near = Math.abs(g.scanY - m.y) < g.win;
      var rad = clamp(8 * K, 6, 13);
      if (!st.marks[i]) {
        ctx.strokeStyle = near ? 'rgba(176,132,54,.95)' : 'rgba(29,39,48,.62)';
        ctx.lineWidth = near ? 2.2 : 1.3;
        ctx.beginPath(); ctx.arc(m.x, m.y, rad + (near ? 2 + Math.sin(t * 8) * 1.5 : 0), 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = near ? 'rgba(176,132,54,.85)' : 'rgba(249,245,234,.9)';
        ctx.beginPath(); ctx.arc(m.x, m.y, 2.4, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(176,132,54,.95)';
        ctx.beginPath(); ctx.arc(m.x, m.y, rad * 0.62, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(176,132,54,.6)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(m.x, m.y, rad + 3, 0, Math.PI * 2); ctx.stroke();
      }
      A.gfx.copyText(ctx, ['I', 'II', 'III'][i], m.x + rad + 4, m.y + 3, clamp(10 * K, 9, 13),
        st.marks[i] ? P.accent : 'rgba(29,39,48,.7)', { family: 'Georgia, serif', align: 'left' });
    }
    ctx.restore();
    // Brass corner brackets.
    ctx.strokeStyle = 'rgba(176,132,54,.75)'; ctx.lineWidth = 1.4;
    var c = 12 * K;
    [[R.x, R.y, 1, 1], [R.x + R.w, R.y, -1, 1], [R.x, R.y + R.h, 1, -1], [R.x + R.w, R.y + R.h, -1, -1]].forEach(function (p) {
      ctx.beginPath();
      ctx.moveTo(p[0] + p[2] * c, p[1]); ctx.lineTo(p[0], p[1]); ctx.lineTo(p[0], p[1] + p[3] * c); ctx.stroke();
    });
    // Quiet progress markers: three marks, three questions.
    var py = R.y + R.h + clamp(16 * K, 10, 24);
    if (py < L.H - 8) {
      for (var q = 0; q < 6; q++) {
        var px = R.x + q * clamp(17 * K, 12, 24);
        var done = q < 3 ? st.marks[q] : st.qCount > q - 3;
        ctx.save(); ctx.translate(px, py); ctx.rotate(Math.PI / 4);
        ctx.strokeStyle = 'rgba(29,39,48,.45)'; ctx.lineWidth = 1;
        ctx.fillStyle = done ? P.accent : 'rgba(29,39,48,.08)';
        ctx.fillRect(-3, -3, 6, 6); ctx.strokeRect(-3, -3, 6, 6);
        ctx.restore();
      }
      A.gfx.copyText(ctx, 'TASKS', R.x + 6 * clamp(17 * K, 12, 24) + 6, py + 3, clamp(9 * K, 8, 11),
        'rgba(29,39,48,.55)', { family: '"IBM Plex Mono", monospace', tracking: 1.4 });
    }
  }

  function drawSections(ctx, L, p) {
    var R = L.copy, K = L.K;
    var TS = clamp(15.5 * K, 12, 21);
    var H1 = clamp(44 * K, 25, 72);
    ctx.save();
    ctx.beginPath();
    ctx.rect(R.x - 8, R.y - 12 * K, R.w + 16, R.h + 34 * K);
    ctx.clip();
    for (var i = 0; i < COPY.length; i++) {
      var alpha = clamp(1 - Math.abs(i - p) * 1.12, 0, 1);
      if (alpha <= 0) continue;
      var Y = R.y + (i - p) * R.h * 1.12;
      drawCopy(ctx, L, i, Y, alpha, TS, H1);
    }
    ctx.restore();
    // Chapter rail.
    var rx = R.x - clamp(15 * K, 10, 20);
    if (rx > 4) {
      for (var c = 0; c < 6; c++) {
        var cy = R.y + R.h * c / 5;
        var active = Math.round(p) === c;
        ctx.fillStyle = active ? P.accent : 'rgba(29,39,48,.3)';
        ctx.fillRect(rx, cy, active ? clamp(9 * K, 6, 13) : clamp(5 * K, 3, 7), active ? 2 : 1);
      }
    }
  }

  function drawCopy(ctx, L, i, Y, alpha, TS, H1) {
    var R = L.copy, K = L.K, S = COPY[i], t = env.t;
    ctx.save(); ctx.globalAlpha = alpha;
    var eyebrowY = Y + clamp(18 * K, 12, 24);
    A.gfx.copyText(ctx, S.eyebrow.toUpperCase(), R.x, eyebrowY, clamp(10 * K, 9, 12), 'rgba(29,39,48,.6)',
      { family: '"IBM Plex Mono", monospace', tracking: clamp(1.6 * K, 1, 2.4) });
    var headSize = i === 0 ? clamp(66 * K, 34, 112) : H1;
    caps(ctx, S.head, R.x, Y + clamp(76 * K, 46, 112), headSize, P.ink, clamp(2 * K, 1, 4));
    rule(ctx, R.x, Y + clamp(92 * K, 58, 132), R.w * 0.86);
    var leadY = Y + clamp(120 * K, 76, 170);
    caps(ctx, S.lead, R.x, leadY, clamp(19 * K, 13, 27), P.accent2, 0.4);
    var yy = leadY + clamp(30 * K, 20, 42);
    for (var b = 0; b < S.body.length; b++) yy = wrapText(ctx, S.body[b], R.x, yy, R.w * 0.94, TS * 1.55, TS, P.ink) + TS * 0.62;

    if (i === 1) drawColumns(ctx, R.x, yy + clamp(8 * K, 6, 14), R.w * 0.86, clamp(78 * K, 44, 112), t);
    if (i === 2 && S.models) {
      for (var m = 0; m < S.models.length; m++) {
        var row = S.models[m], ry = yy + clamp(6 * K, 4, 10) + m * clamp(58 * K, 38, 78);
        rule(ctx, R.x, ry - 12, R.w * 0.9, 'rgba(29,39,48,.24)');
        caps(ctx, row[0], R.x, ry, clamp(17 * K, 12, 23), P.ink, 1);
        wrapText(ctx, row[1], R.x, ry + clamp(18 * K, 13, 24), R.w * 0.72, TS * 1.4, TS * 0.9, 'rgba(29,39,48,.82)');
        A.gfx.copyText(ctx, row[2], R.x + R.w * 0.9, ry, clamp(10 * K, 9, 12), 'rgba(111,138,150,.95)',
          { family: '"IBM Plex Mono", monospace', align: 'right' });
      }
    }
    if (i === 3 && S.principles) {
      for (var q = 0; q < S.principles.length; q++) {
        var py = yy + clamp(4 * K, 4, 8) + q * clamp(33 * K, 22, 46);
        A.gfx.copyText(ctx, S.principles[q][0], R.x, py, clamp(12 * K, 10, 16), P.accent,
          { family: 'Georgia, serif', weight: '600' });
        wrapText(ctx, S.principles[q][1], R.x + clamp(34 * K, 24, 48), py, R.w * 0.78, TS * 1.5, TS * 0.92, P.ink);
      }
      drawLaurel(ctx, R.x + R.w * 0.79, yy + clamp(58 * K, 40, 82), clamp(30 * K, 20, 46), t);
    }
    if (i === 4) {
      var fy = Y + clamp(170 * K, 106, 234);
      st.fieldRect = { x: R.x, y: fy, w: Math.min(R.w * 0.68, 380), h: 34 };
      A.gfx.copyText(ctx, 'QUESTION', R.x, fy - 9, clamp(9 * K, 8, 11), 'rgba(29,39,48,.6)',
        { family: '"IBM Plex Mono", monospace', tracking: 2 });
      // Thin frame for the answer, drawn in the same ink as the copy.
      var ay = fy + 50;
      rule(ctx, R.x, ay - 22, R.w * 0.9, 'rgba(29,39,48,.26)');
      if (st.answer) {
        A.gfx.copyText(ctx, 'THE ORACLE', R.x, ay - 4, clamp(9 * K, 8, 11), P.accent,
          { family: '"IBM Plex Mono", monospace', tracking: 2 });
        wrapText(ctx, st.answer, R.x, ay + clamp(24 * K, 18, 34), R.w * 0.9, TS * 1.6, clamp(17 * K, 13, 24), P.ink);
      } else {
        A.gfx.copyText(ctx, 'No question yet.', R.x, ay + clamp(20 * K, 16, 30), TS, 'rgba(29,39,48,.55)');
      }
      A.gfx.copyText(ctx, String(st.qCount) + ' / 3', R.x + R.w * 0.9, fy - 9, clamp(10 * K, 9, 12), P.accent2,
        { family: '"IBM Plex Mono", monospace', align: 'right' });
    }
    if (i === 5 && S.footer) {
      for (var f = 0; f < S.footer.length; f++) {
        var lineY = yy + clamp(16 * K, 12, 26) + f * clamp(21 * K, 15, 28);
        A.gfx.copyText(ctx, S.footer[f], R.x, lineY, clamp(10.5 * K, 9, 13), 'rgba(29,39,48,.68)',
          { family: 'Georgia, serif' });
      }
      drawLaurel(ctx, R.x + R.w * 0.85, yy + clamp(86 * K, 60, 120), clamp(28 * K, 18, 40), t);
    }
    ctx.restore();
  }

  function drawStatus(ctx, L) {
    var W = L.W, H = L.H, K = L.K;
    var y = H - clamp(28 * K, 22, 40);
    rule(ctx, L.pad, y - 14, Math.min(W * 0.42, 460), 'rgba(29,39,48,.24)');
    A.gfx.copyText(ctx, st.note, L.pad, y, clamp(10.5 * K, 9, 13), 'rgba(29,39,48,.72)',
      { family: 'Georgia, serif' });
    if (st.lastQ) {
      var maxw = Math.min(W * 0.42, 460);
      ctx.save(); ctx.globalAlpha = 0.72;
      A.gfx.copyText(ctx, 'LAST: ' + st.lastQ.slice(0, 62), L.pad, y - 19, clamp(9 * K, 8, 11),
        'rgba(29,39,48,.7)', { family: '"IBM Plex Mono", monospace' });
      ctx.restore();
      void maxw;
    }
  }

  function updateField(L, p) {
    var show = Math.abs(p - 4) < 0.46;
    if (show && st.fieldRect) {
      var r = st.fieldRect;
      var w = Math.max(120, r.w), h = 34;
      var bw = 62;
      var css = Math.round(r.x) + '|' + Math.round(r.y) + '|' + Math.round(w);
      if (css !== st.lastCss) {
        field.style.left = Math.round(r.x) + 'px';
        field.style.top = Math.round(r.y) + 'px';
        field.style.width = Math.round(Math.max(90, w - bw - 8)) + 'px';
        field.style.height = h + 'px';
        askBtn.style.left = Math.round(r.x + w - bw) + 'px';
        askBtn.style.top = Math.round(r.y) + 'px';
        askBtn.style.width = bw + 'px';
        askBtn.style.height = h + 'px';
        st.lastCss = css;
      }
      field.style.display = 'block';
      askBtn.style.display = 'block';
    } else {
      field.style.display = 'none';
      askBtn.style.display = 'none';
    }
  }

  function bot(L) {
    env.sTarget = clamp((env.t * 0.042) % 1, 0, 1);
    for (var i = 0; i < 3; i++) {
      if (!st.marks[i] && Math.abs(st.geo.scanY - st.geo.marks[i].y) < st.geo.win * 0.45) lightMark(i, 0.96);
    }
    if (st.botQ < 3 && env.t > 2.6 + st.botQ * 4.8) {
      var q = BOT_QUESTIONS[st.botQ];
      st.botQ++;
      ask(q);
    }
    if (env.t > 17 && !st.finished) {
      for (var k = 0; k < 3; k++) lightMark(k, 0.96);
      while (st.qCount < 3) ask(BOT_QUESTIONS[st.qCount % 3] + ' (' + st.qCount + ')');
    }
    void L;
  }

  function handleInput(L) {
    var clicks = env.input.consumeClicks();
    for (var i = 0; i < clicks.length; i++) {
      var c = clicks[i];
      if (c.released || c.right) continue;
      var hit = -1;
      for (var k = 0; k < 3; k++) {
        var m = st.geo.marks[k];
        if (Math.abs(c.x - m.x) < st.geo.hit && Math.abs(c.y - m.y) < st.geo.hit) { hit = k; break; }
      }
      if (hit >= 0) attemptMark(hit);
      else if (st.fieldRect && c.x > st.fieldRect.x && c.x < st.fieldRect.x + st.fieldRect.w &&
        c.y > st.fieldRect.y && c.y < st.fieldRect.y + st.fieldRect.h) {
        try { field.focus(); } catch (e) { /* no focus in some embeds */ }
      }
    }
    void L;
  }

  function frame(ctx, envArg) {
    var L = layout();
    ensureArt();
    st.geo = bustGeom(L);
    if (env.auto) bot(L);
    handleInput(L);
    var p = env.s * 5;
    st.fieldRect = null;
    drawGround(ctx, L);
    drawBorders(ctx, L);
    drawApparatus(ctx, L);
    drawSections(ctx, L, p);
    updateField(L, p);
    drawStatus(ctx, L);
    void envArg;
  }
})();
