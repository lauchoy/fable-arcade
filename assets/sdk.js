/* The Thirteen - shared game SDK.
   Classic script (no build step, no modules, no network requests).
   Every game loads ../../assets/sdk.js and calls Arcade.boot({...}).
   The host loads this same file for progress + sync helpers. */
(function (root) {
  'use strict';

  var PROGRESS_KEY = 'fable-arcade.progress.v1';
  var PLAYER_KEY = 'fable-arcade.player.v1';
  var MAX_BODY = 32 * 1024;

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(a, b, x) { var t = clamp((x - a) / (b - a || 1), 0, 1); return t * t * (3 - 2 * t); }
  function fract(x) { return x - Math.floor(x); }
  function hash(x, y) { var n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123; return fract(n); }
  function noise2(x, y) {
    var ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    var ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
    return lerp(lerp(hash(ix, iy), hash(ix + 1, iy), ux), lerp(hash(ix, iy + 1), hash(ix + 1, iy + 1), ux), uy);
  }
  function rng(seed) {
    var s = (seed >>> 0) || 1;
    return function () {
      s += 0x6D2B79F5; var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shortId() {
    if (root.crypto && root.crypto.randomUUID) return root.crypto.randomUUID().replace(/-/g, '').slice(0, 16).toUpperCase();
    var s = ''; for (var i = 0; i < 16; i++) s += '0123456789ABCDEFGHJKMNPQRSTVWXYZ'[Math.floor(Math.random() * 32)];
    return s;
  }
  function validId(id) { return typeof id === 'string' && /^[a-z0-9-]{2,40}$/.test(id); }
  function softParse(raw, fallback) { try { var v = JSON.parse(raw); return v && typeof v === 'object' ? v : fallback; } catch (e) { return fallback; } }

  /* ---------------- player + progress (one localStorage key, one writer) --- */
  function player() {
    var p = softParse(root.localStorage && root.localStorage.getItem(PLAYER_KEY), null);
    if (!p || !p.id || typeof p.id !== 'string') {
      p = { id: shortId(), createdAt: Date.now() };
      try { root.localStorage.setItem(PLAYER_KEY, JSON.stringify(p)); } catch (e) { /* private mode */ }
    }
    return p;
  }
  function setPlayerId(id) {
    id = String(id || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16);
    if (id.length < 8) return false;
    try { root.localStorage.setItem(PLAYER_KEY, JSON.stringify({ id: id, createdAt: Date.now(), restored: true })); } catch (e) { return false; }
    return true;
  }
  function emptyProgress() {
    return { v: 1, playerId: player().id, updatedAt: 0, games: {}, achievements: [] };
  }
  function progress() {
    var d = softParse(root.localStorage && root.localStorage.getItem(PROGRESS_KEY), null);
    if (!d || !d.games || typeof d.games !== 'object') d = emptyProgress();
    if (!d.playerId) d.playerId = player().id;
    if (!Array.isArray(d.achievements)) d.achievements = [];
    if (typeof d.updatedAt !== 'number') d.updatedAt = 0;
    d.v = 1;
    return d;
  }
  function broadcast(doc, event, payload) {
    try { root.dispatchEvent(new CustomEvent('arcade:progress', { detail: { doc: doc, event: event, payload: payload || {} } })); } catch (e) { /* old browser */ }
    if (root.parent && root.parent !== root) {
      try { root.parent.postMessage({ source: 'fable-arcade-sdk', type: 'progress', event: event, payload: payload || {}, doc: doc }, '*'); } catch (e) { /* cross origin */ }
    }
  }
  function write(doc) {
    doc.updatedAt = Date.now();
    try { root.localStorage.setItem(PROGRESS_KEY, JSON.stringify(doc).slice(0, MAX_BODY)); } catch (e) { /* storage full */ }
  }
  function mutate(fn) { var d = progress(); fn(d); write(d); return d; }
  function gameState(d, id) {
    if (!d.games[id]) d.games[id] = { plays: 0, best: 0, stars: 0, completed: false, checkpoints: [], seconds: 0, lastPlayed: 0 };
    var g = d.games[id];
    if (!Array.isArray(g.checkpoints)) g.checkpoints = [];
    return g;
  }
  function num(v) { v = Number(v); return isFinite(v) ? clamp(Math.round(v), 0, 99999999) : 0; }

  var API = {
    PROGRESS_KEY: PROGRESS_KEY,
    clamp: clamp, lerp: lerp, smooth: smooth, hash: hash, noise2: noise2, rng: rng,
    player: player, setPlayerId: setPlayerId, progress: progress,
    onProgress: function (cb) {
      root.addEventListener('arcade:progress', function (e) { cb(e.detail.doc, e.detail); });
      root.addEventListener('storage', function (e) { if (e.key === PROGRESS_KEY) cb(progress(), { event: 'storage' }); });
      return cb;
    },
    state: function (id) { return progress().games[id] || null; },
    start: function (id) {
      if (!validId(id)) return progress();
      var d = mutate(function (d) { var g = gameState(d, id); g.plays += 1; g.lastPlayed = Date.now(); });
      broadcast(d, 'start', { game: id });
      return d;
    },
    mark: function (id, key) {
      if (!validId(id)) return progress();
      var d = mutate(function (d) {
        var g = gameState(d, id);
        key = String(key).slice(0, 48);
        if (g.checkpoints.indexOf(key) < 0 && g.checkpoints.length < 64) g.checkpoints.push(key);
      });
      broadcast(d, 'checkpoint', { game: id, key: key });
      return d;
    },
    score: function (id, value) {
      if (!validId(id)) return progress();
      var v = num(value);
      var d = mutate(function (d) { var g = gameState(d, id); g.best = Math.max(g.best, v); });
      broadcast(d, 'score', { game: id, score: v });
      return d;
    },
    fail: function (id, note) {
      if (!validId(id)) return progress();
      var d = progress();
      broadcast(d, 'fail', { game: id, note: String(note || '').slice(0, 80) });
      return d;
    },
    complete: function (id, opts) {
      if (!validId(id)) return progress();
      opts = opts || {};
      var score = num(opts.score), stars = clamp(num(opts.stars), 0, 3), seconds = num(opts.seconds);
      var d = mutate(function (d) {
        var g = gameState(d, id);
        if (g.plays === 0) g.plays = 1;
        g.completed = true;
        g.best = Math.max(g.best, score);
        g.stars = Math.max(g.stars, stars);
        g.seconds = seconds || g.seconds;
        g.lastPlayed = Date.now();
      });
      broadcast(d, 'complete', { game: id, score: score, stars: stars, seconds: seconds, note: String(opts.note || '').slice(0, 80) });
      return d;
    },
    resetProgress: function () { var d = emptyProgress(); write(d); broadcast(d, 'reset', {}); return d; },
    exit: function () {
      if (root.parent && root.parent !== root) {
        try { root.parent.postMessage({ source: 'fable-arcade-sdk', type: 'exit' }, '*'); return; } catch (e) { /* fallthrough */ }
      }
      root.location.href = '../../index.html';
    }
  };

  /* ---------------- small drawing helpers -------------------------------- */
  function rr(ctx, x, y, w, h, r) {
    r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function linear(ctx, x0, y0, x1, y1, stops) {
    var g = ctx.createLinearGradient(x0, y0, x1, y1);
    for (var i = 0; i < stops.length; i++) g.addColorStop(stops[i][0], stops[i][1]);
    return g;
  }
  function radial(ctx, x, y, r0, x1, y1, r1, stops) {
    var g = ctx.createRadialGradient(x, y, r0, x1 === undefined ? x : x1, y1 === undefined ? y : y1, r1);
    for (var i = 0; i < stops.length; i++) g.addColorStop(stops[i][0], stops[i][1]);
    return g;
  }
  function vignette(ctx, w, h, strength) {
    var g = radial(ctx, w / 2, h / 2, Math.min(w, h) * 0.12, w / 2, h / 2, Math.max(w, h) * 0.78,
      [[0, 'rgba(0,0,0,0)'], [0.65, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,' + (strength === undefined ? 0.55 : strength) + ')']]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  var grainTile = null;
  function grain(ctx, w, h, alpha, seed) {
    if (!grainTile) {
      grainTile = document.createElement('canvas'); grainTile.width = grainTile.height = 128;
      var g = grainTile.getContext('2d'), im = g.createImageData(128, 128), r = rng(seed || 9137);
      for (var i = 0; i < im.data.length; i += 4) {
        var v = 110 + Math.floor(r() * 145);
        im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255;
      }
      g.putImageData(im, 0, 0);
    }
    ctx.save(); ctx.globalAlpha = alpha === undefined ? 0.055 : alpha;
    ctx.globalCompositeOperation = 'overlay';
    var p = ctx.createPattern(grainTile, 'repeat'); ctx.fillStyle = p; ctx.fillRect(0, 0, w, h); ctx.restore();
  }
  function paintStroke(ctx, points, color, width, seed, opts) {
    opts = opts || {};
    var r = rng(seed || 1), passes = opts.passes || 3;
    for (var p = 0; p < passes; p++) {
      ctx.beginPath();
      for (var i = 0; i < points.length; i++) {
        var x = points[i][0] + (r() - 0.5) * (opts.jitter || width * 0.4);
        var y = points[i][1] + (r() - 0.5) * (opts.jitter || width * 0.4);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.quadraticCurveTo(points[i - 1][0], points[i - 1][1], (x + points[i - 1][0]) / 2, (y + points[i - 1][1]) / 2);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = width * (0.35 + r() * 0.75) / Math.sqrt(passes);
      ctx.globalAlpha = (opts.alpha === undefined ? 0.75 : opts.alpha) * (0.45 + r() * 0.55);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  function glow(ctx, x, y, r, color) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = radial(ctx, x, y, 0, x, y, r, [[0, color], [0.35, color], [1, 'rgba(0,0,0,0)']]);
    ctx.globalAlpha = 0.55; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  function spark(ctx, x, y, r, color, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0);
    ctx.fillStyle = color; ctx.beginPath();
    ctx.moveTo(0, -r); ctx.quadraticCurveTo(r * 0.12, -r * 0.12, r, 0);
    ctx.quadraticCurveTo(r * 0.12, r * 0.12, 0, r);
    ctx.quadraticCurveTo(-r * 0.12, r * 0.12, -r, 0);
    ctx.quadraticCurveTo(-r * 0.12, -r * 0.12, 0, -r); ctx.fill(); ctx.restore();
  }
  function letterbox(ctx, w, h, bar) {
    var ratio = 16 / 9, vh = w / ratio;
    if (vh > h) { var bw = (w - h * ratio) / 2; ctx.fillStyle = bar || '#000'; ctx.fillRect(0, 0, bw, h); ctx.fillRect(w - bw, 0, bw, h); }
    else { var bh = (h - vh) / 2; ctx.fillStyle = bar || '#000'; ctx.fillRect(0, 0, w, bh); ctx.fillRect(0, h - bh, w, bh); }
  }
  function copyText(ctx, text, x, y, size, color, opts) {
    opts = opts || {};
    ctx.save();
    ctx.font = (opts.weight || '') + ' ' + size + 'px ' + (opts.family || 'Georgia, serif');
    ctx.fillStyle = color; ctx.textAlign = opts.align || 'left'; ctx.textBaseline = opts.baseline || 'alphabetic';
    if ('letterSpacing' in ctx && opts.tracking) ctx.letterSpacing = opts.tracking + 'px';
    ctx.fillText(String(text), x, y); ctx.restore();
  }
  function offscreen(w, h, draw) {
    var c = document.createElement('canvas'); c.width = Math.max(1, w | 0); c.height = Math.max(1, h | 0);
    draw(c.getContext('2d'), c.width, c.height); return c;
  }
  API.gfx = { rr: rr, linear: linear, radial: radial, vignette: vignette, grain: grain, paintStroke: paintStroke,
    glow: glow, spark: spark, letterbox: letterbox, copyText: copyText, offscreen: offscreen };

  /* ---------------- WebAudio, silent until the player enables it ---------- */
  var audio = { ctx: null, master: null, enabled: false };
  function ensureAudio() {
    if (audio.ctx) return audio.ctx;
    var AC = root.AudioContext || root.webkitAudioContext;
    if (!AC) return null;
    audio.ctx = new AC();
    audio.master = audio.ctx.createGain(); audio.master.gain.value = 0.5; audio.master.connect(audio.ctx.destination);
    return audio.ctx;
  }
  function tone(o) {
    if (!audio.enabled) return;
    var ac = ensureAudio(); if (!ac) return;
    o = typeof o === 'number' ? { freq: o } : (o || {});
    var t0 = ac.currentTime + (o.delay || 0), dur = Math.max(0.02, o.dur || 0.16);
    var osc = ac.createOscillator(), gain = ac.createGain(), pan = ac.createStereoPanner ? ac.createStereoPanner() : null;
    osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(Math.max(20, o.freq || 440), t0);
    if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.slideTo), t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, o.gain === undefined ? 0.14 : o.gain), t0 + Math.min(0.02, dur * 0.25));
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    var tail = pan || gain;
    if (pan) { pan.pan.value = clamp(o.pan || 0, -1, 1); osc.connect(gain); gain.connect(pan); pan.connect(audio.master); }
    else { osc.connect(gain); gain.connect(audio.master); }
    osc.start(t0); osc.stop(t0 + dur + 0.02); void tail;
  }
  function noise(o) {
    if (!audio.enabled) return;
    var ac = ensureAudio(); if (!ac) return;
    o = o || {}; var dur = Math.max(0.02, o.dur || 0.12);
    var len = Math.floor(ac.sampleRate * dur), buf = ac.createBuffer(1, len, ac.sampleRate), data = buf.getChannelData(0), r = rng(9481);
    for (var i = 0; i < len; i++) data[i] = (r() * 2 - 1) * (1 - i / len);
    var src = ac.createBufferSource(), filt = ac.createBiquadFilter(), gain = ac.createGain();
    src.buffer = buf; filt.type = o.filter || 'lowpass'; filt.frequency.value = o.freq || 1800;
    gain.gain.value = o.gain === undefined ? 0.12 : o.gain;
    var t0 = ac.currentTime + (o.delay || 0);
    src.connect(filt); filt.connect(gain); gain.connect(audio.master); src.start(t0);
  }
  API.sound = {
    get enabled() { return audio.enabled; },
    enable: function () {
      var ac = ensureAudio(); if (!ac) return false;
      if (ac.state === 'suspended') ac.resume();
      audio.enabled = true;
      root.dispatchEvent(new CustomEvent('arcade:sound', { detail: { enabled: true } }));
      tone({ freq: 660, dur: 0.1, gain: 0.08 }); tone({ freq: 990, dur: 0.16, gain: 0.06, delay: 0.07 });
      return true;
    },
    mute: function () { audio.enabled = false; root.dispatchEvent(new CustomEvent('arcade:sound', { detail: { enabled: false } })); },
    tone: tone, noise: noise,
    chord: function (freqs, dur, gain) { for (var i = 0; i < freqs.length; i++) tone({ freq: freqs[i], dur: dur || 0.5, gain: (gain || 0.06) / Math.sqrt(freqs.length), type: 'triangle' }); }
  };

  /* ---------------- boot: canvas, input, loop, overlays ------------------- */
  var CSS = [
    'html,body{margin:0;height:100%;width:100%;overflow:hidden;background:#111;color:#f4efe4;}',
    'body{font-family:"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,monospace;-webkit-user-select:none;user-select:none;}',
    '#stage{display:block;width:100vw;height:100vh;touch-action:none;cursor:crosshair;}',
    '.arcade-hud{position:fixed;left:22px;top:18px;z-index:20;pointer-events:none;max-width:60vw;text-shadow:0 1px 8px rgba(0,0,0,.65);}',
    '.arcade-hud .t{font-size:13px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;}',
    '.arcade-hud .h{font-size:11px;line-height:1.5;opacity:.68;margin-top:5px;letter-spacing:.04em;}',
    '.arcade-sound{position:fixed;right:18px;bottom:18px;z-index:22;background:rgba(12,12,12,.72);color:#f4efe4;',
    'border:1px solid rgba(244,239,228,.38);border-radius:2px;padding:9px 13px;font:11px/1 "IBM Plex Mono",monospace;',
    'letter-spacing:.16em;text-transform:uppercase;cursor:pointer;backdrop-filter:blur(6px);}',
    '.arcade-sound:hover{background:rgba(244,239,228,.16);}',
    '.arcade-toast{position:fixed;left:50%;top:26px;transform:translate(-50%,-16px);z-index:30;opacity:0;color:#f4efe4;',
    'transition:opacity .25s,transform .25s;background:rgba(10,10,10,.82);border:1px solid rgba(244,239,228,.25);',
    'padding:10px 18px;font:12px/1.4 "IBM Plex Mono",monospace;letter-spacing:.08em;pointer-events:none;}',
    '.arcade-toast.show{opacity:1;transform:translate(-50%,0);}',
    '.arcade-end{position:fixed;inset:0;z-index:40;display:none;align-items:center;justify-content:center;color:#f4efe4;',
    'background:rgba(8,8,10,.78);backdrop-filter:blur(8px);font-family:Georgia,serif;text-align:center;}',
    '.arcade-end.show{display:flex;}',
    '.arcade-end .card{max-width:520px;padding:44px 48px;border:1px solid rgba(244,239,228,.3);background:rgba(14,14,16,.9);}',
    '.arcade-end h1{font-weight:400;font-size:42px;margin:0 0 12px;letter-spacing:.01em;}',
    '.arcade-end .sub{font:12px/1.8 "IBM Plex Mono",monospace;opacity:.75;margin:0 0 26px;letter-spacing:.08em;}',
    '.arcade-end .stars{font-size:26px;letter-spacing:.35em;color:#e7b357;margin-bottom:22px;}',
    '.arcade-end button{font:11px/1 "IBM Plex Mono",monospace;letter-spacing:.16em;text-transform:uppercase;',
    'padding:12px 20px;margin:0 5px;background:transparent;color:inherit;border:1px solid rgba(244,239,228,.5);cursor:pointer;}',
    '.arcade-end button:hover{background:rgba(244,239,228,.15);}',
    '@media(max-width:600px){.arcade-hud{left:12px;top:10px}.arcade-sound{right:10px;bottom:10px}}'
  ].join('');
  function injectCSS() {
    if (document.getElementById('arcade-sdk-css')) return;
    var s = document.createElement('style'); s.id = 'arcade-sdk-css'; s.textContent = CSS; document.head.appendChild(s);
  }

  function Input(canvas, env) {
    var self = this;
    this.keys = {}; this.pressed = {}; this.clicks = [];
    this.mouse = { x: 0, y: 0, left: false, right: false, inside: false, dragX: 0, dragY: 0, wheel: 0 };
    this.lookX = 0; this.lookY = 0; this.locked = false;
    this.isDown = function (code) { return !!self.keys[code]; };
    this.justPressed = function (code) { return !!self.pressed[code]; };
    this.consumeClicks = function () { var c = self.clicks; self.clicks = []; return c; };
    this.consumeLook = function () { var v = { x: self.lookX, y: self.lookY }; self.lookX = 0; self.lookY = 0; return v; };
    this.consumeWheel = function () { var w = self.mouse.wheel; self.mouse.wheel = 0; return w; };

    function first(e) {
      if (!env.started) { env.started = true; env.attract = !!env.auto; if (env.onFirstInput) env.onFirstInput(e); }
    }
    window.addEventListener('keydown', function (e) {
      if (!e.repeat) self.pressed[e.code] = true;
      self.keys[e.code] = true; first(e);
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Tab'].indexOf(e.code) >= 0) e.preventDefault();
    });
    window.addEventListener('keyup', function (e) { self.keys[e.code] = false; });
    window.addEventListener('blur', function () { self.keys = {}; self.mouse.left = self.mouse.right = false; });
    function pos(e) {
      var r = canvas.getBoundingClientRect();
      self.mouse.x = (e.clientX - r.left) / r.width * env.w;
      self.mouse.y = (e.clientY - r.top) / r.height * env.h;
    }
    canvas.addEventListener('pointerdown', function (e) {
      first(e); pos(e);
      try { if (canvas.setPointerCapture && e.pointerId !== undefined) canvas.setPointerCapture(e.pointerId); }
      catch (err) { /* synthetic pointer events may not have an active pointer id */ }
      if (e.pointerType === 'mouse') {
        if (e.button === 0) self.mouse.left = true;
        if (e.button === 2) self.mouse.right = true;
      } else { self.mouse.left = true; }
      self.clicks.push({ x: self.mouse.x, y: self.mouse.y, button: e.button, right: e.button === 2, pointerType: e.pointerType });
    });
    canvas.addEventListener('pointerup', function (e) {
      pos(e);
      if (e.button === 0) self.mouse.left = false;
      if (e.button === 2) self.mouse.right = false;
      if (e.pointerType !== 'mouse') self.mouse.left = false;
      self.clicks.push({ x: self.mouse.x, y: self.mouse.y, button: e.button, right: false, released: true, pointerType: e.pointerType });
    });
    canvas.addEventListener('pointermove', function (e) {
      pos(e);
      if (document.pointerLockElement === canvas) { self.lookX += e.movementX || 0; self.lookY += e.movementY || 0; return; }
      var dx = e.movementX || 0, dy = e.movementY || 0;
      self.mouse.dragX = dx; self.mouse.dragY = dy;
      if (self.mouse.right || (env.dragLook && self.mouse.left)) { self.lookX += dx; self.lookY += dy; }
      if (self.mouse.left && env.scroll) env.sTarget = clamp(env.sTarget - dy / Math.max(200, env.h), 0, 1);
    });
    canvas.addEventListener('pointerenter', function () { self.mouse.inside = true; });
    canvas.addEventListener('pointerleave', function () { self.mouse.inside = false; });
    canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    canvas.addEventListener('wheel', function (e) {
      e.preventDefault(); first(e);
      self.mouse.wheel += e.deltaY;
      if (env.scroll) env.sTarget = clamp(env.sTarget + Math.sign(e.deltaY) * 0.09, 0, 1);
    }, { passive: false });
    document.addEventListener('pointerlockchange', function () { self.locked = document.pointerLockElement === canvas; });
  }
  API.lockPointer = function () { var c = document.getElementById('stage'); if (c && c.requestPointerLock) { var p = c.requestPointerLock(); if (p && p.catch) p.catch(function () {}); } };

  var booted = null;
  API.boot = function (opts) {
    opts = opts || {};
    if (booted) return booted;
    injectCSS();
    var params = new URLSearchParams(root.location.search);
    var id = String(opts.id || params.get('game') || 'unknown').slice(0, 40);
    var title = opts.title || id;
    var hint = opts.hint || 'Move the pointer to begin';
    document.title = title + ' - The Thirteen';
    var canvas = opts.canvas || document.getElementById('stage');
    if (!canvas) { canvas = document.createElement('canvas'); canvas.id = 'stage'; document.body.appendChild(canvas); }
    var ctx = canvas.getContext('2d', { alpha: false });
    var bg = opts.background || '#111';
    canvas.style.background = bg;
    document.body.style.background = bg;
    var cssColor = opts.ink || '#f4efe4';
    document.body.style.color = cssColor;

    var hud = null, soundBtn = null, toastEl = null, endEl = null;
    if (opts.chrome === undefined || opts.chrome.hud !== false) {
      hud = document.createElement('div'); hud.className = 'arcade-hud';
      hud.innerHTML = '<div class="t"></div><div class="h"></div>';
      hud.querySelector('.t').textContent = title;
      hud.querySelector('.h').textContent = hint;
      document.body.appendChild(hud);
    }
    if (opts.chrome === undefined || opts.chrome.sound !== false) {
      soundBtn = document.createElement('button'); soundBtn.className = 'arcade-sound'; soundBtn.type = 'button';
      soundBtn.textContent = 'Enable sound'; document.body.appendChild(soundBtn);
      soundBtn.addEventListener('click', function (e) { e.stopPropagation(); API.sound.enable(); });
      root.addEventListener('arcade:sound', function (e) {
        soundBtn.textContent = e.detail.enabled ? 'Sound on' : 'Enable sound';
        if (!e.detail.enabled) API.sound.mute();
      });
    }
    toastEl = document.createElement('div'); toastEl.className = 'arcade-toast'; document.body.appendChild(toastEl);
    endEl = document.createElement('div'); endEl.className = 'arcade-end';
    endEl.innerHTML = '<div class="card"><h1></h1><div class="stars"></div><div class="sub"></div>' +
      '<button data-act="again">Play again</button><button data-act="exit">Back to all games</button></div>';
    document.body.appendChild(endEl);
    endEl.querySelector('[data-act="again"]').addEventListener('click', function () { root.location.reload(); });
    endEl.querySelector('[data-act="exit"]').addEventListener('click', function () { API.exit(); });

    var tParam = params.has('t') ? parseFloat(params.get('t')) : null;
    var frozen = tParam !== null && isFinite(tParam);
    var seedParam = params.has('seed') ? (parseInt(params.get('seed'), 10) || 1) : 2026;
    var sParam = params.has('s') ? parseFloat(params.get('s')) : 0;
    var env = {
      id: id, title: title, w: 0, h: 0, dpr: 1, scale: 1, t: frozen ? tParam : 0, dt: 0, frame: 0,
      canvas: canvas, ctx: ctx, input: null, seed: seedParam, rand: rng(seedParam), rng: rng,
      auto: params.get('auto') === '1', state: params.get('state') || '', view: params.get('view') || '',
      s: clamp(isFinite(sParam) ? sParam : 0, 0, 1), sTarget: clamp(isFinite(sParam) ? sParam : 0, 0, 1),
      scroll: !!opts.scroll, dragLook: params.get('drag') === '1' || !!opts.dragLook,
      frozen: frozen, started: false, attract: true, sections: opts.sections || 1,
      sound: API.sound, gfx: API.gfx, params: params,
      get section() { return clamp(Math.round(this.s * (this.sections - 1)), 0, this.sections - 1); }
    };
    env.attract = true;
    env.input = new Input(canvas, env);
    booted = env;
    root.__arcadeEnv = env; // used by tests for fps/attract/frame inspection

    function resize() {
      var w = window.innerWidth, h = window.innerHeight;
      env.w = w; env.h = h;
      env.dpr = Math.min(window.devicePixelRatio || 1, 2) * env.scale;
      canvas.width = Math.max(1, Math.floor(w * env.dpr));
      canvas.height = Math.max(1, Math.floor(h * env.dpr));
      ctx.setTransform(env.dpr, 0, 0, env.dpr, 0, 0);
      if (opts.onResize) opts.onResize(env);
    }
    window.addEventListener('resize', resize);
    resize();
    if (opts.onStart) opts.onStart(env);

    var t0 = performance.now(), last = frozen ? tParam : 0, slow = 0, frames = 0, fps = 60;
    function frame(now) {
      if (frozen) { env.t = tParam; env.dt = 0; }
      else {
        var t = (now - t0) / 1000;
        env.dt = Math.min(0.1, Math.max(0, t - last)); last = t; env.t = t;
      }
      if (env.scroll) env.s = lerp(env.s, env.sTarget, Math.min(1, 8 * (env.dt || 0.016)));
      env.frame++;
      ctx.setTransform(env.dpr, 0, 0, env.dpr, 0, 0);
      ctx.clearRect(0, 0, env.w, env.h);
      ctx.fillStyle = bg; ctx.fillRect(0, 0, env.w, env.h);
      try { if (opts.onFrame) opts.onFrame(ctx, env); } catch (err) { console.error('[arcade] frame error', err); }
      env.input.pressed = {};
      env.input.mouse.dragX = 0; env.input.mouse.dragY = 0;
      frames++;
      if (env.dt > 0.026) slow++; else slow = Math.max(0, slow - 1);
      if (frames > 90 && slow > 45 && env.scale > 0.62) {
        env.scale = env.scale > 0.82 ? 0.8 : 0.62; slow = 0; frames = 0; resize();
      }
      fps = lerp(fps, 1 / Math.max(0.001, env.dt), 0.05);
      env.fps = fps;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    API.toast = function (msg, ms) {
      toastEl.textContent = String(msg); toastEl.classList.add('show');
      clearTimeout(toastEl._timer);
      toastEl._timer = setTimeout(function () { toastEl.classList.remove('show'); }, ms || 2000);
    };
    API.end = function (o) {
      o = o || {};
      endEl.querySelector('h1').textContent = o.title || 'Complete';
      endEl.querySelector('.stars').textContent = '★★★☆☆'.slice(0, clamp(o.stars || 0, 0, 5)) || '';
      endEl.querySelector('.sub').innerHTML = '';
      var sub = endEl.querySelector('.sub');
      (o.lines || []).forEach(function (line) { var d = document.createElement('div'); d.textContent = line; sub.appendChild(d); });
      endEl.classList.add('show');
    };
    API.finish = function (o) {
      o = o || {};
      API.complete(id, { score: o.score, stars: o.stars, seconds: o.seconds, note: o.note });
      API.end({
        title: o.title || 'Game cleared',
        stars: o.stars || 1,
        lines: o.lines || [('Score ' + (o.score || 0)), 'The site saved your progress']
      });
    };
    API.start(id);
    return env;
  };
  API.toast = function () {};
  API.end = function () {};
  API.finish = function (o) { if (o && validId(o.id)) API.complete(o.id, o); };

  root.Arcade = API;
})(window);
