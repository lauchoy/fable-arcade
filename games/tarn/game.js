(function () {
  'use strict';
  var A = window.Arcade;
  var TAU = Math.PI * 2;
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(a, b, x) { var t = clamp((x - a) / (b - a || 1), 0, 1); return t * t * (3 - 2 * t); }

  var P = { bg: '#0b0c0d', ink: '#ece9e2', accent: '#b48b45', oil: '#7d8f96', dim: 'rgba(236,233,226,.52)' };
  var TARGETS = [0.30, 0.55, 0.82];
  var TARGET_LABELS = ['I', 'II', 'III'];
  var FINISHES = [
    { name: 'Bead-blasted soot', note: 'Fine, even grain. No direction.', a: '#27292b', b: '#0d0f10', c: '#4a4e50' },
    { name: 'Brushed graphite', note: 'A straight grain. You see it from the side.', a: '#40464a', b: '#14171a', c: '#646c70', brushed: true },
    { name: 'Etched bronze', note: 'We cut a shallow cross-hatch. We darken it.', a: '#594830', b: '#221c13', c: '#8b7145', etched: true }
  ];
  var MEASURES = [
    ['Body', 'Bead-blasted aluminium 6061', '148 mm diameter'],
    ['Height', 'Dome closed', '62 mm'],
    ['Dome', 'Borosilicate glass, 1.8 mm', '96 mm aperture'],
    ['Pool', 'Ester-based ferrofluid', '12 ml'],
    ['Coil', 'Enamelled copper, 0.4 mm', '1.1 mH'],
    ['Driver', '76 mm neodymium', '4 ohm nominal'],
    ['Mass', 'Assembled, with cable', '2.34 kg'],
    ['Cable', 'Braided, detachable', '1.8 m']
  ];
  var MELODY = [220, 0, 277, 330, 0, 247, 294, 0, 196, 0, 247, 330, 0, 294, 220, 0];
  var COPY = [
    { eyebrow: 'Tarn / object 01 / field study', head: 'TARN', lead: 'A speaker with a pool.',
      body: ['A loudspeaker has a glass dome. A pool of ferrofluid sits under it. The pool rises with the sound.',
        'This is not a screen. The fluid moves with sound.'] },
    { eyebrow: 'Listen / 02', head: 'LISTEN', lead: 'A short piece for one speaker.',
      body: ['The crown rises with low notes. Small ripples follow high notes.',
        'You can enable sound. Before that, a silent pulse moves the fluid.'] },
    { eyebrow: 'Parts / 03', head: 'SIX PARTS', lead: 'Six pieces, one axis.',
      body: ['It has six parts. We draw the label lines. We do not print them.',
        'Scroll to open it. Scroll back to close it.'] },
    { eyebrow: 'Materials and measures / 04', head: 'MEASURES', lead: 'We give exact measures.',
      body: ['It has one cylinder, one glass dome and one pool. We list the sizes.'] },
    { eyebrow: 'Finishes / 05', head: 'THREE FINISHES', lead: 'We change the material.',
      body: ['We bead-blast the soot. We brush the graphite. We etch the bronze. Pick one. The cylinder changes.'] },
    { eyebrow: 'Price and waiting list / 06', head: 'WAITING LIST', lead: 'We make a small number.',
      body: ['It costs GBP 1,180. You wait fourteen weeks. You get one finish. Ask for others.',
        'We store nothing you type. We keep no list.'],
      footer: ['Tarn Acoustics, Vale Works, Unit 4. Write us a letter.',
        'We draw the ferrofluid as a height field. We draw the reflections.',
        'One long soft light, one thin rim light. No other colours.' ] }
  ];

  var st = {
    field: 0.30, desired: 0.30, keyBias: 0, targetIdx: 0, holdFor: 0, accuracy: [],
    finished: false, finish: 0, note: 'Hold the pointer near the pool. Set three field heights.',
    formNote: '', formRect: null, lastCss: '', seqStep: -1, swatches: [], art: null,
    magnet: null, viewP: null
  };

  var form = document.createElement('input');
  form.type = 'text'; form.maxLength = 64; form.placeholder = 'Write a name';
  form.setAttribute('aria-label', 'Waiting list. We send nothing.');
  form.style.cssText = 'position:fixed;z-index:24;display:none;box-sizing:border-box;padding:8px 11px;' +
    'font:14px Georgia,serif;color:#ece9e2;background:rgba(18,19,20,.92);' +
    'border:1px solid rgba(236,233,226,.34);border-radius:0;outline:none;';
  document.body.appendChild(form);
  var formBtn = document.createElement('button');
  formBtn.type = 'button'; formBtn.textContent = 'Add';
  formBtn.style.cssText = 'position:fixed;z-index:24;display:none;box-sizing:border-box;height:34px;padding:0 15px;' +
    'font:11px "IBM Plex Mono",monospace;letter-spacing:.14em;text-transform:uppercase;' +
    'color:#0b0c0d;background:#ece9e2;border:1px solid #ece9e2;cursor:pointer;';
  document.body.appendChild(formBtn);

  var env = A.boot({
    id: 'tarn',
    title: 'Tarn - a loudspeaker',
    hint: 'Move the pointer near the pool. Hold it at three marks.',
    background: P.bg,
    ink: P.ink,
    scroll: true,
    sections: 6,
    onFrame: frame
  });

  var VIEW_S = { pool: 0, hero: 0, listen: 0.2, exploded: 0.4, measure: 0.6, finishes: 0.8, price: 1 };
  if (Object.prototype.hasOwnProperty.call(VIEW_S, env.view)) { env.s = env.sTarget = VIEW_S[env.view]; }

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
      if (e.code === 'PageDown') env.sTarget = clamp(env.sTarget + 0.2, 0, 1);
      else if (e.code === 'PageUp') env.sTarget = clamp(env.sTarget - 0.2, 0, 1);
      else if (e.code === 'Home') env.sTarget = 0;
      else if (e.code === 'End') env.sTarget = 1;
    });
  })();


  function noticeInput() {
    if (!env.started) { env.started = true; env.attract = !!env.auto; }
  }
  function submitForm() {
    st.formNote = 'We send nothing. We save no names.';
    form.value = '';
    A.sound.tone({ freq: 330, dur: 0.14, gain: 0.05 });
  }
  form.addEventListener('pointerdown', noticeInput);
  form.addEventListener('keydown', function (e) {
    e.stopPropagation(); noticeInput();
    if (e.key === 'Enter') { e.preventDefault(); submitForm(); }
    if (e.key === 'Escape') form.blur();
  });
  formBtn.addEventListener('pointerdown', noticeInput);
  formBtn.addEventListener('click', function (e) { e.stopPropagation(); noticeInput(); submitForm(); });

  function layout() {
    var W = env.w, H = env.h, narrow = W < 720;
    var pad = clamp(W * 0.055, 16, 92);
    var K = clamp(Math.min(W / 1200, H / 800), 0.5, 1.5);
    var stage = narrow
      ? { x: pad, y: H * 0.075, w: W - 2 * pad, h: H * 0.375 }
      : { x: W * 0.50, y: H * 0.10, w: W * 0.45, h: H * 0.80 };
    var copy = narrow
      ? { x: pad, y: H * 0.47, w: W - 2 * pad, h: H * 0.47 }
      : { x: pad, y: H * 0.19, w: W * 0.40, h: H * 0.67 };
    return { W: W, H: H, narrow: narrow, pad: pad, K: K, stage: stage, copy: copy };
  }
  function geom(L, p) {
    var s = L.stage;
    var zoom = 1 - 0.10 * Math.min(1, Math.abs(p - 2) * 0.5);
    var R = Math.min(s.w * 0.35, s.h * (L.narrow ? 0.30 : 0.285)) * zoom;
    return {
      cx: s.x + s.w * 0.5, cy: s.y + s.h * (L.narrow ? 0.46 : 0.44), R: R,
      ex: smooth(0.06, 0.96, 1 - Math.abs(p - 2)),
      sep: R * (L.narrow ? 0.36 : 0.52)
    };
  }

  function ensureArt() {
    if (st.art) return;
    function texture(kind) {
      return A.gfx.offscreen(128, 128, function (c, w, h) {
        var r = env.rng(env.seed * 19 + kind * 1013 + 7);
        c.fillStyle = 'rgba(0,0,0,0)'; c.clearRect(0, 0, w, h);
        for (var i = 0; i < 2600; i++) {
          var v = r();
          c.fillStyle = v > 0.55 ? 'rgba(236,233,226,' + (0.03 + r() * 0.07) + ')' : 'rgba(0,0,0,' + (0.04 + r() * 0.1) + ')';
          c.fillRect(r() * w, r() * h, 0.6 + r() * 1.3, 0.6 + r() * 1.3);
        }
        if (kind === 1) {
          for (var j = 0; j < 128; j += 2) {
            c.fillStyle = 'rgba(236,233,226,.035)'; c.fillRect(0, j, w, 0.7);
          }
        }
        if (kind === 2) {
          c.strokeStyle = 'rgba(180,139,69,.055)'; c.lineWidth = 0.6;
          for (var k = -128; k < 128; k += 7) {
            c.beginPath(); c.moveTo(k, 0); c.lineTo(k + 128, 128); c.stroke();
            c.beginPath(); c.moveTo(k + 128, 0); c.lineTo(k, 128); c.stroke();
          }
        }
      });
    }
    st.art = [texture(0), texture(1), texture(2)];
  }

  function fieldFromPointer(G, L) {
    var m = env.input.mouse;
    if (!m.inside) return null;
    var dx = (m.x - G.cx) / (G.R * 1.42), dy = (m.y - G.cy) / (G.R * 1.42);
    var d = Math.sqrt(dx * dx + dy * dy);
    var f = clamp(1 - d, 0, 1);
    if (m.left) f = clamp(f * 1.06 + 0.05, 0, 1);
    return f;
  }
  function pulse(t) { return 0.5 - 0.5 * Math.cos(t * TAU * 0.13); }
  function humanActive() { return env.started || env.input.mouse.inside || env.auto; }

  function updateField(G, L, p) {
    var active = humanActive();
    var desired = 0.30;
    st.magnet = null;
    if (env.auto) {
      var t = env.t;
      if (t < 2.4) desired = TARGETS[0] * smooth(0.15, 2.0, t);
      else if (t < 5.0) desired = lerp(TARGETS[0], TARGETS[1], smooth(2.4, 4.3, t));
      else desired = lerp(TARGETS[1], TARGETS[2], smooth(5.0, 7.0, t));
      desired = clamp(desired, 0, 1);
      st.magnet = { x: G.cx + (1 - desired) * G.R * 1.15, y: G.cy - G.R * 0.24 };
    } else if (active) {
      var f = fieldFromPointer(G, L);
      if (f === null) desired = st.keyBias;
      else { st.keyBias = lerp(st.keyBias, 0, 0.06); desired = clamp(f, 0, 1); }
    } else {
      desired = 0.26 + 0.20 * (0.5 + 0.5 * Math.sin(env.t * 0.38));
    }
    // Before sound is enabled a silent low pulse still drives the fluid.
    var beat = A.sound.enabled ? Math.max(0, Math.sin(env.t * TAU * 0.13)) : pulse(env.t);
    st.pulse = beat;
    st.desired = clamp(desired + beat * 0.045, 0, 1);
    if (env.frozen) {
      st.field = clamp(0.24 + 0.52 * (0.5 + 0.5 * Math.sin(env.t * 0.62)), 0, 1);
    } else {
      st.field += (st.desired - st.field) * (1 - Math.exp(-Math.max(0, env.dt) * 3.3));
      st.field = clamp(st.field, 0, 1);
    }
    var tol = 0.062;
    var target = TARGETS[Math.min(st.targetIdx, 2)];
    var err = Math.abs(st.field - target);
    if (active && !env.frozen && st.targetIdx < 3 && err < tol) {
      st.holdFor += env.dt;
      if (st.holdFor > 0.62) {
        st.accuracy.push(clamp(1 - err / tol, 0.05, 1));
        A.mark('tarn', 'field-' + (st.targetIdx + 1));
        A.sound.tone({ freq: 392 + st.targetIdx * 98, dur: 0.24, gain: 0.07 });
        st.targetIdx++;
        st.holdFor = 0;
        st.note = st.targetIdx >= 3 ? 'You hold all three field strengths.' : 'You hold mark ' + st.targetIdx + '. Move to ' + TARGET_LABELS[st.targetIdx] + '.';
        if (st.targetIdx >= 3) finishRun();
      }
    } else if (!env.frozen) {
      st.holdFor = Math.max(0, st.holdFor - env.dt * 1.5);
    }
    if (env.auto && env.t > 10 && !st.finished) {
      while (st.targetIdx < 3) { st.accuracy.push(0.9); A.mark('tarn', 'field-' + (st.targetIdx + 1)); st.targetIdx++; }
      finishRun();
    }
    void p;
  }

  function finishRun() {
    if (st.finished) return;
    st.finished = true;
    var sum = 0;
    for (var i = 0; i < st.accuracy.length; i++) sum += st.accuracy[i];
    var avg = sum / Math.max(1, st.accuracy.length);
    var stars = avg > 0.68 ? 3 : (avg > 0.34 ? 2 : 1);
    var score = Math.round(700 + avg * 1100);
    A.score('tarn', score);
    A.sound.chord([196, 294, 392, 494], 0.9, 0.045);
    A.finish({
      score: score, stars: stars,
      title: 'You calibrate the field',
      lines: ['You set three crown heights.', 'Accuracy ' + Math.round(avg * 100) + '%', 'One material, one light']
    });
  }

  function maybePlayScore(p) {
    if (!A.sound.enabled || Math.abs(p - 1) > 0.85) return;
    var step = Math.floor(env.t / 0.44) % 16;
    if (step === st.seqStep) return;
    st.seqStep = step;
    var f = MELODY[step];
    if (f) {
      A.sound.tone({ freq: f, dur: 0.52, gain: 0.055, type: 'sine' });
      A.sound.tone({ freq: f * 2, dur: 0.24, gain: 0.018, type: 'triangle' });
    }
    if (step % 4 === 0) A.sound.chord([f || 220, (f || 220) * 1.5], 0.7, 0.022);
    if (step % 2 === 1) A.sound.noise({ dur: 0.09, gain: 0.018, freq: 3600, filter: 'highpass' });
  }

  function drawBackground(ctx, L) {
    var W = L.W, H = L.H;
    ctx.fillStyle = A.gfx.radial(ctx, W * 0.62, H * 0.32, 10, W * 0.62, H * 0.32, Math.max(W, H) * 0.9,
      [[0, '#1a1d1f'], [0.36, '#101214'], [0.78, '#0b0c0d'], [1, '#070809']]);
    ctx.fillRect(0, 0, W, H);
    // One long soft light from the upper left.
    ctx.save();
    ctx.translate(W * 0.35, H * 0.2); ctx.rotate(-0.32);
    ctx.fillStyle = A.gfx.linear(ctx, -W * 0.3, 0, W * 0.3, 0,
      [[0, 'rgba(236,233,226,0)'], [0.5, 'rgba(236,233,226,.045)'], [1, 'rgba(236,233,226,0)']]);
    ctx.fillRect(-W * 0.3, -H * 0.5, W * 0.6, H);
    ctx.restore();
    // Thin rim light at the right edge of the set.
    ctx.fillStyle = A.gfx.linear(ctx, W - 2, 0, W - 40, 0,
      [[0, 'rgba(236,233,226,.10)'], [1, 'rgba(236,233,226,0)']]);
    ctx.fillRect(W - 40, 0, 40, H);
    A.gfx.grain(ctx, W, H, 0.032);
    A.gfx.vignette(ctx, W, H, 0.42);
  }

  function drawCable(ctx, G) {
    var R = G.R, cx = G.cx, cy = G.cy;
    A.gfx.paintStroke(ctx, [[cx + R * 0.8, cy + R * 0.34], [cx + R * 1.45, cy + R * 0.62],
      [cx + R * 1.9, cy + R * 0.55], [cx + R * 2.25, cy + R * 0.92]],
      'rgba(126,132,134,.55)', 4.2, 1201, { passes: 3, jitter: 1.4, alpha: 0.7 });
    for (var i = 0; i < 22; i++) {
      var u = i / 21;
      var x = cx + R * (0.85 + 1.35 * u), y = cy + R * (0.36 + 0.5 * u * u);
      ctx.strokeStyle = 'rgba(236,233,226,.10)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x - 2, y - 3); ctx.lineTo(x + 2, y + 3); ctx.stroke();
    }
  }

  function drawPart(ctx, part, y, G, L, t, ex) {
    var R = G.R, cx = G.cx, fin = FINISHES[st.finish], K = L.K;
    ctx.save();
    if (part === 5) {
      ctx.fillStyle = A.gfx.radial(ctx, cx, y + R * 0.18, 2, cx, y + R * 0.18, R * 1.6,
        [[0, 'rgba(0,0,0,.75)'], [.6, 'rgba(0,0,0,.3)'], [1, 'rgba(0,0,0,0)']]);
      ctx.beginPath(); ctx.ellipse(cx, y + R * 0.26, R * 1.25, R * 0.3, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = A.gfx.linear(ctx, cx - R, y, cx + R, y,
        [[0, '#141618'], [0.4, '#2a2d30'], [0.72, '#17191b'], [1, '#34383a']]);
      ctx.beginPath(); ctx.ellipse(cx, y, R * 0.9, R * 0.22, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(236,233,226,.14)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(cx, y - R * 0.02, R * 0.9, R * 0.22, 0, 0, TAU); ctx.stroke();
    }
    if (part === 4) {
      var topY = y - R * 0.17, botY = y + R * 0.3;
      A.gfx.rr(ctx, cx - R, topY, R * 2, botY - topY, R * 0.24);
      var bodyGrad = A.gfx.linear(ctx, cx - R, 0, cx + R, 0,
        [[0, '#08090a'], [0.13, fin.b], [0.36, fin.a], [0.54, fin.c], [0.74, fin.a], [0.9, fin.b], [1, '#060708']]);
      ctx.fillStyle = bodyGrad; ctx.fill();
      ctx.save(); ctx.clip();
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = ctx.createPattern(st.art[st.finish], 'repeat');
      ctx.fillRect(cx - R, topY, R * 2, botY - topY);
      ctx.globalAlpha = 1;
      ctx.fillStyle = A.gfx.linear(ctx, 0, topY, 0, botY,
        [[0, 'rgba(0,0,0,0)'], [0.7, 'rgba(0,0,0,.18)'], [1, 'rgba(0,0,0,.6)']]);
      ctx.fillRect(cx - R, topY, R * 2, botY - topY);
      // Long soft light across the cylinder.
      ctx.fillStyle = A.gfx.linear(ctx, cx - R * 0.45, 0, cx + R * 0.2, 0,
        [[0, 'rgba(236,233,226,0)'], [0.55, 'rgba(236,233,226,.085)'], [1, 'rgba(236,233,226,0)']]);
      ctx.fillRect(cx - R * 0.45, topY, R * 0.65, botY - topY);
      ctx.restore();
      // Chamfered top edge and the ring of fine holes.
      ctx.fillStyle = A.gfx.linear(ctx, cx - R, topY, cx + R, topY,
        [[0, '#0b0c0d'], [0.35, fin.c], [0.62, fin.a], [1, '#0b0c0d']]);
      ctx.beginPath(); ctx.ellipse(cx, topY, R, R * 0.235, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(236,233,226,.25)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(cx, topY, R * 0.985, R * 0.23, 0, 0, Math.PI); ctx.stroke();
      for (var h = 0; h < 34; h++) {
        var a = Math.PI * (0.03 + 0.94 * h / 33);
        var hx = cx + Math.cos(a) * R * 0.88, hy = topY + Math.sin(a) * R * 0.2;
        ctx.fillStyle = 'rgba(3,4,5,.85)';
        ctx.beginPath(); ctx.ellipse(hx, hy, Math.max(0.7, R * 0.012), Math.max(0.5, R * 0.008), 0, 0, TAU); ctx.fill();
      }
      // Knurled dial.
      var dx = cx + R * 0.79, dy = y + R * 0.1, dr = R * 0.115;
      ctx.fillStyle = A.gfx.radial(ctx, dx - dr * 0.3, dy - dr * 0.3, 1, dx, dy, dr,
        [[0, '#4c5052'], [0.6, '#222527'], [1, '#0b0c0d']]);
      ctx.beginPath(); ctx.arc(dx, dy, dr, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(236,233,226,.3)'; ctx.lineWidth = 0.8;
      for (var n = 0; n < 20; n++) {
        var na = n / 20 * TAU;
        ctx.beginPath();
        ctx.moveTo(dx + Math.cos(na) * dr * 0.72, dy + Math.sin(na) * dr * 0.72);
        ctx.lineTo(dx + Math.cos(na) * dr * 0.98, dy + Math.sin(na) * dr * 0.98);
        ctx.stroke();
      }
      ctx.fillStyle = P.accent;
      ctx.beginPath(); ctx.arc(dx - dr * 0.1, dy - dr * 0.9, Math.max(1, R * 0.012), 0, TAU); ctx.fill();
    }
    if (part === 3) {
      ctx.fillStyle = A.gfx.radial(ctx, cx, y, 2, cx, y, R * 0.8,
        [[0, '#2c3033'], [0.55, '#111315'], [1, '#08090a']]);
      ctx.beginPath(); ctx.ellipse(cx, y, R * 0.72, R * 0.185, 0, 0, TAU); ctx.fill();
      for (var c = 1; c <= 3; c++) {
        ctx.strokeStyle = 'rgba(236,233,226,' + (0.16 - c * 0.035) + ')'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(cx, y, R * 0.72 * c / 4, R * 0.185 * c / 4, 0, 0, TAU); ctx.stroke();
      }
      ctx.fillStyle = 'rgba(0,0,0,.7)';
      ctx.beginPath(); ctx.ellipse(cx, y, R * 0.14, R * 0.045, 0, 0, TAU); ctx.fill();
    }
    if (part === 2) {
      ctx.strokeStyle = 'rgba(180,139,69,.72)'; ctx.lineWidth = Math.max(1.4, R * 0.035);
      ctx.beginPath(); ctx.ellipse(cx, y, R * 0.62, R * 0.16, 0, 0, TAU); ctx.stroke();
      for (var w = 0; w < 30; w++) {
        var wa = w / 30 * TAU;
        var wx = cx + Math.cos(wa) * R * 0.62, wy = y + Math.sin(wa) * R * 0.16;
        ctx.strokeStyle = 'rgba(180,139,69,.42)'; ctx.lineWidth = 0.9;
        ctx.beginPath(); ctx.moveTo(wx * 0.998 + cx * 0.002, wy - 2);
        ctx.lineTo(wx, wy + 2); ctx.stroke();
      }
      ctx.fillStyle = 'rgba(0,0,0,.65)';
      ctx.beginPath(); ctx.ellipse(cx, y, R * 0.5, R * 0.12, 0, 0, TAU); ctx.fill();
    }
    if (part === 1) drawPoolPart(ctx, y, G, L, t);
    if (part === 0) {
      var dh = R * 0.52;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx - R * 0.84, y);
      ctx.bezierCurveTo(cx - R * 0.8, y - dh * 1.04, cx + R * 0.8, y - dh * 1.04, cx + R * 0.84, y);
      ctx.closePath();
      ctx.fillStyle = A.gfx.linear(ctx, cx, y - dh, cx, y,
        [[0, 'rgba(236,233,226,.055)'], [0.55, 'rgba(236,233,226,.012)'], [1, 'rgba(236,233,226,.05)']]);
      ctx.fill();
      ctx.clip();
      A.gfx.paintStroke(ctx, [[cx - R * 0.62, y - R * 0.07], [cx - R * 0.3, y - dh * 0.84], [cx + R * 0.04, y - dh * 0.96]],
        'rgba(236,233,226,.22)', Math.max(1.5, R * 0.045), 3301, { passes: 3, jitter: 1, alpha: 0.5 });
      A.gfx.paintStroke(ctx, [[cx + R * 0.4, y - dh * 0.78], [cx + R * 0.68, y - R * 0.12]],
        'rgba(236,233,226,.10)', Math.max(1, R * 0.025), 3302, { passes: 2, jitter: 0.8, alpha: 0.5 });
      ctx.restore();
      ctx.strokeStyle = 'rgba(236,233,226,.22)'; ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.ellipse(cx, y, R * 0.84, R * 0.19, 0, 0, Math.PI); ctx.stroke();
      ctx.strokeStyle = 'rgba(236,233,226,.10)';
      ctx.beginPath(); ctx.ellipse(cx, y, R * 0.84, R * 0.19, 0, Math.PI, TAU); ctx.stroke();
    }
    ctx.restore();
    void ex; void K;
  }

  function spikePositions(R) {
    var pts = [], sp = R * 0.235;
    for (var row = -3; row <= 3; row++) {
      for (var col = -3; col <= 3; col++) {
        var x = (col + ((row & 1) ? 0.5 : 0)) * sp, z = row * sp * 0.86;
        var nx = x / (R * 0.82), nz = z / (R * 0.36);
        if (nx * nx + nz * nz > 1) continue;
        pts.push({ x: x, z: z });
      }
    }
    return pts.sort(function (a, b) { return a.z - b.z; });
  }
  function drawSpike(ctx, x, y, h, w, lean, seed) {
    if (h < 0.8) return;
    ctx.beginPath();
    ctx.moveTo(x - w, y);
    ctx.bezierCurveTo(x - w * 0.62, y - h * 0.26, x - w * 0.2 + lean * 0.35, y - h * 0.84, x + lean, y - h);
    ctx.bezierCurveTo(x + w * 0.25 + lean * 0.4, y - h * 0.76, x + w * 0.72, y - h * 0.2, x + w, y);
    ctx.closePath();
    ctx.fillStyle = A.gfx.linear(ctx, x - w, y - h, x + w, y,
      [[0, 'rgba(125,143,150,.30)'], [0.16, 'rgba(46,54,58,.94)'], [0.46, 'rgba(8,10,11,1)'],
        [0.82, 'rgba(34,39,42,.96)'], [1, 'rgba(125,143,150,.26)']]);
    ctx.fill();
    A.gfx.paintStroke(ctx, [[x - w * 0.14, y - h * 0.04], [x + lean * 0.35, y - h * 0.44],
      [x + lean * 0.75, y - h * 0.93]], 'rgba(236,233,226,.28)', Math.max(0.8, w * 0.17), seed,
      { passes: 2, jitter: w * 0.07, alpha: 0.55 });
    A.gfx.paintStroke(ctx, [[x + w * 0.52, y - h * 0.05], [x + w * 0.34 + lean * 0.3, y - h * 0.55]],
      'rgba(125,143,150,.15)', Math.max(0.6, w * 0.12), seed + 71, { passes: 1, jitter: w * 0.06, alpha: 0.5 });
  }

  function drawPoolPart(ctx, y, G, L, t) {
    var R = G.R, cx = G.cx, K = L.K;
    ctx.save();
    ctx.beginPath(); ctx.ellipse(cx, y, R * 0.82, R * 0.265, 0, 0, TAU); ctx.clip();
    ctx.fillStyle = A.gfx.radial(ctx, cx - R * 0.25, y - R * 0.08, 2, cx, y, R * 0.95,
      [[0, '#202425'], [0.36, '#0e1011'], [0.78, '#050607'], [1, '#020303']]);
    ctx.fillRect(cx - R, y - R, R * 2, R * 2);
    // Reflected studio light, a long soft band.
    ctx.fillStyle = A.gfx.linear(ctx, 0, y - R * 0.16, 0, y + R * 0.05,
      [[0, 'rgba(236,233,226,0)'], [0.55, 'rgba(236,233,226,.085)'], [1, 'rgba(236,233,226,0)']]);
    ctx.fillRect(cx - R, y - R * 0.16, R * 2, R * 0.21);
    // Upside-down brand type in the mirror.
    ctx.save();
    ctx.translate(cx, y + R * 0.10); ctx.scale(1, -0.72);
    ctx.transform(1, 0, -0.09, 1, 0, 0); ctx.globalAlpha = 0.17;
    A.gfx.copyText(ctx, 'TARN', 0, 0, R * 0.52, 'rgba(236,233,226,.85)',
      { family: 'Georgia, serif', weight: '400', align: 'center', tracking: R * 0.08 });
    ctx.restore();
    // Fine ripples follow the high notes; the low pulse swells the pool.
    for (var q = 0; q < 3; q++) {
      var rr = R * (0.22 + 0.18 * q + 0.02 * Math.sin(t * 3.1 + q));
      ctx.strokeStyle = 'rgba(125,143,150,' + (0.09 - q * 0.02) + ')'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(cx + R * 0.1, y + R * 0.02, rr, rr * 0.30, 0, 0, TAU); ctx.stroke();
    }
    ctx.restore();
    // Crown of spikes: a hexagon lattice with weight, lag and merging feet.
    var pos = spikePositions(R), f = clamp(st.field, 0, 1);
    var mag = st.magnet || (env.input.mouse.inside ? { x: env.input.mouse.x, y: env.input.mouse.y } : { x: cx, y: y });
    var inflMagX = (mag.x - cx) / (R * 0.9);
    for (var i = 0; i < pos.length; i++) {
      var p = pos[i];
      var sx = cx + p.x * 0.96;
      var sy = y + p.z * 0.34 - R * 0.02;
      var ddx = (p.x / (R * 0.85) - inflMagX * 0.25), ddz = p.z / (R * 0.5);
      var infl = clamp(1 - 0.42 * (ddx * ddx + ddz * ddz), 0.16, 1);
      var merge = 0.82 + 0.18 * Math.sin(t * 0.9 + i * 1.37);
      var h = R * 0.92 * f * infl * merge;
      var w = R * (0.085 + 0.025 * f);
      var lean = Math.sin(t * 0.62 + i * 0.8) * R * 0.035 * f;
      if (h < 0.7) continue;
      // The foot sits in the mirror.
      ctx.fillStyle = 'rgba(3,4,5,.75)';
      ctx.beginPath(); ctx.ellipse(sx, sy, w * 1.35, w * 0.42, 0, 0, TAU); ctx.fill();
      drawSpike(ctx, sx, sy, h, w, lean, 5000 + i * 37);
    }
    // Thin rim light on the pool edge.
    ctx.strokeStyle = 'rgba(236,233,226,.18)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(cx, y, R * 0.82, R * 0.265, 0, Math.PI * 1.02, Math.PI * 1.98); ctx.stroke();
    void K;
  }

  var PART_NAMES = ['Dome', 'Pool', 'Coil', 'Driver', 'Body', 'Base'];
  function drawProduct(ctx, L, G, p) {
    var t = env.t, R = G.R, ex = G.ex;
    var offsets = [-R * 0.02, 0, R * 0.10, R * 0.20, R * 0.31, R * 0.60];
    drawCable(ctx, G);
    var ys = [];
    for (var i = 0; i < 6; i++) ys[i] = G.cy + offsets[i] + ex * (i - 2.5) * G.sep;
    // Back to front.
    for (var part = 5; part >= 0; part--) drawPart(ctx, part, ys[part], G, L, t, ex);
    // Thin label lines for the exploded view.
    if (ex > 0.16) {
      var lx = Math.min(L.W - 12 * L.K, G.cx + R * 1.18);
      ctx.save(); ctx.globalAlpha = clamp((ex - 0.16) / 0.5, 0, 1);
      for (var k = 0; k < 6; k++) {
        var y = ys[k];
        ctx.strokeStyle = k === 1 ? 'rgba(180,139,69,.7)' : 'rgba(236,233,226,.30)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(G.cx + R * 0.86, y); ctx.lineTo(lx, y); ctx.lineTo(lx + (L.narrow ? 8 : 18 * L.K), y);
        ctx.stroke();
        A.gfx.copyText(ctx, (L.narrow ? '' : '0' + (k + 1) + '  ') + PART_NAMES[k].toUpperCase(),
          lx + (L.narrow ? 11 : 23 * L.K), y + 3, clamp(9 * L.K, 8, 12),
          k === 1 ? 'rgba(180,139,69,.85)' : 'rgba(236,233,226,.72)',
          { family: '"IBM Plex Mono", monospace', tracking: 0.6 });
      }
      ctx.restore();
    }
    // Ghost magnet in the bot run.
    if (st.magnet) {
      ctx.strokeStyle = 'rgba(180,139,69,.65)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(st.magnet.x, st.magnet.y, clamp(7 * L.K, 5, 10), 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(st.magnet.x - 12, st.magnet.y); ctx.lineTo(st.magnet.x + 12, st.magnet.y);
      ctx.moveTo(st.magnet.x, st.magnet.y - 12); ctx.lineTo(st.magnet.x, st.magnet.y + 12); ctx.stroke();
    }
    void p;
  }

  function drawGauge(ctx, L, G) {
    var R = G.R, K = L.K;
    var gx = Math.min(L.W - clamp(26 * K, 18, 44), G.cx + R * 1.30);
    if (L.narrow) gx = Math.min(L.W - 16, G.cx + R * 1.18);
    var y0 = G.cy - R * 0.58, y1 = G.cy + R * 0.58;
    var yFor = function (v) { return lerp(y1, y0, clamp(v, 0, 1)); };
    ctx.save();
    A.gfx.copyText(ctx, 'FIELD', gx, y0 - 12 * K, clamp(9 * K, 8, 11), 'rgba(236,233,226,.55)',
      { family: '"IBM Plex Mono", monospace', align: 'center', tracking: 1.4 });
    ctx.strokeStyle = 'rgba(236,233,226,.22)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(gx, y0); ctx.lineTo(gx, y1); ctx.stroke();
    for (var i = 0; i < 3; i++) {
      var ty = yFor(TARGETS[i]);
      var done = i < st.targetIdx;
      var active = i === st.targetIdx;
      ctx.strokeStyle = done ? 'rgba(180,139,69,.5)' : (active ? 'rgba(180,139,69,.95)' : 'rgba(236,233,226,.34)');
      ctx.lineWidth = active ? 1.6 : 1;
      ctx.beginPath(); ctx.moveTo(gx - (active ? 9 : 6) * K, ty); ctx.lineTo(gx + (active ? 9 : 6) * K, ty); ctx.stroke();
      A.gfx.copyText(ctx, TARGET_LABELS[i], gx - 15 * K, ty + 3 * K, clamp(9 * K, 8, 11),
        active ? 'rgba(180,139,69,.9)' : 'rgba(236,233,226,.42)',
        { family: 'Georgia, serif', align: 'right' });
      if (active) {
        ctx.fillStyle = 'rgba(180,139,69,.13)';
        ctx.fillRect(gx - 5 * K, yFor(TARGETS[i] + 0.062), 10 * K, yFor(TARGETS[i] - 0.062) - yFor(TARGETS[i] + 0.062));
      }
    }
    var cy = yFor(st.field);
    ctx.fillStyle = 'rgba(180,139,69,.95)';
    ctx.save(); ctx.translate(gx, cy); ctx.rotate(Math.PI / 4);
    ctx.fillRect(-3.2 * K, -3.2 * K, 6.4 * K, 6.4 * K); ctx.restore();
    if (st.targetIdx < 3 && Math.abs(st.field - TARGETS[st.targetIdx]) < 0.062) {
      ctx.strokeStyle = 'rgba(180,139,69,' + (0.3 + 0.35 * clamp(st.holdFor / 0.62, 0, 1)) + ')';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(gx, cy, clamp(10 * K, 7, 15), 0, TAU * clamp(st.holdFor / 0.62, 0.02, 1)); ctx.stroke();
    }
    A.gfx.copyText(ctx, 'CALIBRATE ' + Math.min(st.targetIdx + 1, 3) + ' / 3', gx, y1 + 16 * K,
      clamp(9 * K, 8, 11), 'rgba(236,233,226,.55)',
      { family: '"IBM Plex Mono", monospace', align: 'center', tracking: 1 });
    ctx.restore();
  }

  function wrapText(ctx, text, x, y, maxW, lineH, size, color) {
    ctx.save(); ctx.font = size + 'px Georgia, "Times New Roman", serif';
    ctx.fillStyle = color;
    var words = String(text).split(' '), line = '', yy = y;
    for (var i = 0; i < words.length; i++) {
      var test = line ? line + ' ' + words[i] : words[i];
      if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, yy); yy += lineH; line = words[i]; }
      else line = test;
    }
    if (line) { ctx.fillText(line, x, yy); yy += lineH; }
    ctx.restore(); return yy;
  }
  function caps(ctx, text, x, y, size, color, tracking) {
    A.gfx.copyText(ctx, text, x, y, size, color,
      { family: 'Georgia, "Times New Roman", serif', weight: '400', tracking: tracking || 0 });
  }
  function rule(ctx, x, y, w, alpha) {
    ctx.strokeStyle = 'rgba(236,233,226,' + (alpha === undefined ? 0.2 : alpha) + ')';
    ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y + 0.5); ctx.lineTo(x + w, y + 0.5); ctx.stroke();
  }

  function drawSections(ctx, L, p) {
    var R = L.copy, K = L.K;
    var TS = clamp(15 * K, 12, 20), H1 = clamp(40 * K, 24, 64);
    ctx.save();
    ctx.beginPath(); ctx.rect(R.x - 8, R.y - 10 * K, R.w + 16, R.h + 30 * K); ctx.clip();
    for (var i = 0; i < COPY.length; i++) {
      var alpha = clamp(1 - Math.abs(i - p) * 1.12, 0, 1);
      if (alpha <= 0) continue;
      drawCopy(ctx, L, i, R.y + (i - p) * R.h * 1.12, alpha, TS, H1);
    }
    ctx.restore();
    // Quiet chapter marks.
    var rx = R.x - clamp(13 * K, 9, 18);
    if (rx > 3) {
      for (var c = 0; c < 6; c++) {
        ctx.fillStyle = Math.round(p) === c ? P.accent : 'rgba(236,233,226,.26)';
        ctx.fillRect(rx, R.y + R.h * c / 5, Math.round(p) === c ? 8 * K : 4 * K, 1);
      }
    }
  }

  function drawCopy(ctx, L, i, Y, alpha, TS, H1) {
    var R = L.copy, K = L.K, S = COPY[i], t = env.t;
    ctx.save(); ctx.globalAlpha = alpha;
    A.gfx.copyText(ctx, S.eyebrow.toUpperCase(), R.x, Y + clamp(16 * K, 11, 24), clamp(9.5 * K, 9, 12),
      'rgba(236,233,226,.47)', { family: '"IBM Plex Mono", monospace', tracking: clamp(1.4 * K, 1, 2.2) });
    var headSize = i === 0 ? clamp(60 * K, 32, 100) : H1;
    caps(ctx, S.head, R.x - 1, Y + clamp(70 * K, 44, 106), headSize, 'rgba(236,233,226,.94)', clamp(3 * K, 2, 6));
    rule(ctx, R.x, Y + clamp(86 * K, 55, 124), R.w * 0.86, 0.22);
    caps(ctx, S.lead, R.x, Y + clamp(114 * K, 72, 160), clamp(18 * K, 13, 26), P.accent, 0);
    var yy = Y + clamp(142 * K, 92, 194);
    for (var b = 0; b < S.body.length; b++) yy = wrapText(ctx, S.body[b], R.x, yy, R.w * 0.92, TS * 1.55, TS, 'rgba(236,233,226,.78)') + TS * 0.6;

    if (i === 1) {
      // A drawn score strip; the piece is played only after sound is enabled.
      var sx = R.x, sw = R.w * 0.86, stepY = yy + clamp(12 * K, 10, 20);
      rule(ctx, sx, stepY - 12, sw, 0.12);
      var beatStep = Math.floor(env.t / 0.44) % 16;
      for (var n = 0; n < 16; n++) {
        var nx = sx + sw * n / 15;
        ctx.fillStyle = n === beatStep && A.sound.enabled ? 'rgba(180,139,69,.9)' : (MELODY[n] ? 'rgba(236,233,226,.55)' : 'rgba(236,233,226,.16)');
        var off = MELODY[n] ? Math.sin(n * 0.7) * 8 * K : 0;
        ctx.beginPath(); ctx.arc(nx, stepY + off, n === beatStep ? 3.2 * K : 2 * K, 0, TAU); ctx.fill();
      }
      A.gfx.copyText(ctx, A.sound.enabled ? 'Playing a sixteen-step piece' : 'Sound is off. A silent pulse moves.',
        sx, stepY + clamp(26 * K, 20, 36), clamp(10 * K, 9, 12), 'rgba(236,233,226,.5)',
        { family: '"IBM Plex Mono", monospace' });
    }
    if (i === 3) {
      var ty = yy + clamp(8 * K, 6, 14), rowH = clamp(27 * K, 19, 36);
      for (var m = 0; m < MEASURES.length; m++) {
        var row = MEASURES[m], ry = ty + m * rowH;
        rule(ctx, R.x, ry - rowH * 0.42, R.w * 0.92, 0.11);
        A.gfx.copyText(ctx, row[0].toUpperCase(), R.x, ry, clamp(10.5 * K, 9, 13), 'rgba(236,233,226,.82)',
          { family: '"IBM Plex Mono", monospace', tracking: 0.6 });
        A.gfx.copyText(ctx, row[1], R.x + R.w * 0.24, ry, clamp(11 * K, 9.5, 14), 'rgba(236,233,226,.62)',
          { family: 'Georgia, serif' });
        A.gfx.copyText(ctx, row[2], R.x + R.w * 0.92, ry, clamp(10 * K, 9, 12), 'rgba(180,139,69,.8)',
          { family: '"IBM Plex Mono", monospace', align: 'right' });
      }
    }
    if (i === 4) {
      st.swatches = [];
      for (var f = 0; f < 3; f++) {
        var fx = R.x + f * clamp(84 * K, 58, 116), fy = yy + clamp(26 * K, 20, 40);
        var rad = clamp(19 * K, 13, 27);
        var fin = FINISHES[f];
        var g = A.gfx.radial(ctx, fx - rad * 0.4, fy - rad * 0.4, 1, fx, fy, rad,
          [[0, fin.c], [0.55, fin.a], [1, fin.b]]);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(fx + rad, fy, rad, 0, TAU); ctx.fill();
        ctx.save(); ctx.beginPath(); ctx.arc(fx + rad, fy, rad, 0, TAU); ctx.clip();
        ctx.globalAlpha = 0.45; ctx.fillStyle = ctx.createPattern(st.art[f], 'repeat');
        ctx.fillRect(fx, fy - rad, rad * 2, rad * 2); ctx.restore();
        ctx.strokeStyle = st.finish === f ? 'rgba(180,139,69,.95)' : 'rgba(236,233,226,.25)';
        ctx.lineWidth = st.finish === f ? 2 : 1;
        ctx.beginPath(); ctx.arc(fx + rad, fy, rad + 3, 0, TAU); ctx.stroke();
        A.gfx.copyText(ctx, '0' + (f + 1), fx + rad, fy + rad + clamp(16 * K, 13, 22), clamp(10 * K, 9, 12),
          st.finish === f ? 'rgba(180,139,69,.9)' : 'rgba(236,233,226,.5)',
          { family: '"IBM Plex Mono", monospace', align: 'center' });
        st.swatches.push({ x: fx, y: fy - rad, w: rad * 2, h: rad * 2, i: f });
      }
      A.gfx.copyText(ctx, FINISHES[st.finish].name + '. ' + FINISHES[st.finish].note,
        R.x, yy + clamp(90 * K, 62, 124), clamp(11 * K, 10, 14), 'rgba(236,233,226,.66)',
        { family: 'Georgia, serif' });
    }
    if (i === 5) {
      var priceY = yy + clamp(16 * K, 12, 24);
      caps(ctx, 'GBP 1,180', R.x, priceY, clamp(30 * K, 20, 44), 'rgba(236,233,226,.92)', 1);
      var fy = priceY + clamp(34 * K, 26, 46);
      st.formRect = { x: R.x, y: fy, w: Math.min(R.w * 0.82, 390), h: 34 };
      A.gfx.copyText(ctx, 'WAITING LIST (WE SEND NOTHING)', R.x, fy - 8, clamp(9 * K, 8, 11), 'rgba(236,233,226,.48)',
        { family: '"IBM Plex Mono", monospace', tracking: 1.2 });
      if (st.formNote) A.gfx.copyText(ctx, st.formNote, R.x, fy + 58, clamp(11 * K, 10, 14), 'rgba(180,139,69,.82)',
        { family: 'Georgia, serif' });
      for (var q = 0; q < S.footer.length; q++) {
        A.gfx.copyText(ctx, S.footer[q], R.x, fy + clamp(96 * K, 74, 130) + q * clamp(19 * K, 15, 26),
          clamp(10 * K, 9, 12), 'rgba(236,233,226,.42)', { family: 'Georgia, serif' });
      }
    }
    ctx.restore();
    void t;
  }

  function updateForm(L, p) {
    var show = Math.abs(p - 5) < 0.46 && st.formRect;
    if (show) {
      var r = st.formRect, w = Math.max(150, r.w), bw = 58;
      var css = Math.round(r.x) + '|' + Math.round(r.y) + '|' + Math.round(w);
      if (css !== st.lastCss) {
        form.style.left = Math.round(r.x) + 'px'; form.style.top = Math.round(r.y) + 'px';
        form.style.width = Math.round(Math.max(90, w - bw - 8)) + 'px'; form.style.height = '34px';
        formBtn.style.left = Math.round(r.x + w - bw) + 'px'; formBtn.style.top = Math.round(r.y) + 'px';
        formBtn.style.width = bw + 'px'; formBtn.style.height = '34px';
        st.lastCss = css;
      }
      form.style.display = 'block'; formBtn.style.display = 'block';
    } else {
      form.style.display = 'none'; formBtn.style.display = 'none';
    }
    void L;
  }

  function handleInput(ctx, L, p) {
    var clicks = env.input.consumeClicks();
    for (var i = 0; i < clicks.length; i++) {
      var c = clicks[i];
      if (c.released || c.right) continue;
      for (var s = 0; s < st.swatches.length; s++) {
        var w = st.swatches[s];
        if (c.x > w.x && c.x < w.x + w.w + 30 * L.K && c.y > w.y && c.y < w.y + w.h) {
          st.finish = w.i;
          st.note = FINISHES[st.finish].name + ' covers the cylinder.';
          A.sound.tone({ freq: 220 + w.i * 55, dur: 0.16, gain: 0.05 });
          break;
        }
      }
      if (st.formRect && c.x > st.formRect.x && c.x < st.formRect.x + st.formRect.w &&
        c.y > st.formRect.y && c.y < st.formRect.y + st.formRect.h) {
        try { form.focus(); } catch (e) { /* embedded frames may refuse focus */ }
      }
    }
    if (env.input.justPressed('Digit1')) st.finish = 0;
    if (env.input.justPressed('Digit2')) st.finish = 1;
    if (env.input.justPressed('Digit3')) st.finish = 2;
    if (env.input.isDown('ArrowUp')) st.keyBias = clamp(st.keyBias + 0.6 * Math.max(env.dt, 0.006), 0, 1);
    if (env.input.isDown('ArrowDown')) st.keyBias = clamp(st.keyBias - 0.6 * Math.max(env.dt, 0.006), 0, 1);
    void ctx; void p;
  }

  function frame(ctx) {
    var L = layout();
    var p = env.s * 5;
    var G = geom(L, p);
    ensureArt();
    updateField(G, L, p);
    maybePlayScore(p);
    if (env.auto) env.sTarget = clamp((env.t * 0.07) % 1, 0, 1);
    st.swatches = [];
    st.formRect = null;
    drawBackground(ctx, L);
    drawProduct(ctx, L, G, p);
    drawGauge(ctx, L, G);
    drawSections(ctx, L, p);
    handleInput(ctx, L, p);
    updateForm(L, p);
    A.gfx.copyText(ctx, st.note, L.pad, L.H - clamp(22 * L.K, 20, 34), clamp(10.5 * L.K, 9, 13),
      'rgba(236,233,226,.55)', { family: 'Georgia, serif' });
  }
})();
