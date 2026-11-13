/* The Thirteen - shared first-person raycaster for the three World-tier builds.
   Load ../../assets/sdk.js first, then ../shared/raycaster.js (from a game folder).
   Raycaster.boot(opts) wraps Arcade.boot and gives the game a small set of hooks. */
(function (root) {
  'use strict';
  var A = root.Arcade;
  var TAU = Math.PI * 2;

  function solidAt(world, x, y) {
    var ix = Math.floor(x), iy = Math.floor(y);
    if (ix < 0 || iy < 0 || ix >= world.w || iy >= world.h) return true;
    var v = world.cells[iy * world.w + ix];
    if (!v) return false;
    var info = typeof world.wall === 'function' ? world.wall(v, ix, iy) : (world.wall[v] || {});
    return info.solid !== false;
  }
  function cellAt(world, x, y) {
    var ix = Math.floor(x), iy = Math.floor(y);
    if (ix < 0 || iy < 0 || ix >= world.w || iy >= world.h) return 0;
    return world.cells[iy * world.w + ix];
  }
  function wallInfo(world, v, ix, iy) {
    return typeof world.wall === 'function' ? world.wall(v, ix, iy) : (world.wall[v] || {});
  }
  function makeWorld(map, wall, textures) {
    var rows = Array.isArray(map) ? map : String(map).trim().split('\n');
    rows = rows.map(function (r) { return r.trim(); });
    var h = rows.length, w = Math.max.apply(null, rows.map(function (r) { return r.length; }));
    var cells = new Uint8Array(w * h);
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) cells[y * w + x] = (rows[y][x] || '0').charCodeAt(0) - 48;
    return { w: w, h: h, cells: cells, wall: wall, textures: textures || {} };
  }

  function moveWithCollision(st, env, dt, f, s) {
    var speed = (st.sprinting ? 5.6 : 3.5) * (st.crouching ? 0.55 : 1);
    var ax = Math.cos(st.angle) * f - Math.sin(st.angle) * s;
    var ay = Math.sin(st.angle) * f + Math.cos(st.angle) * s;
    var len = Math.hypot(ax, ay) || 1;
    ax = ax / len * speed; ay = ay / len * speed;
    st.vx = A.lerp(st.vx, ax, Math.min(1, dt * 11));
    st.vy = A.lerp(st.vy, ay, Math.min(1, dt * 11));
    var steps = Math.max(1, Math.ceil(Math.hypot(st.vx, st.vy) * dt / 0.12));
    var sx = st.vx * dt / steps, sy = st.vy * dt / steps, r = 0.2;
    for (var i = 0; i < steps; i++) {
      var nx = st.x + sx, ny = st.y + sy;
      if (!blocked(nx, st.y, r)) st.x = nx;
      else st.vx *= 0.2;
      if (!blocked(st.x, ny, r)) st.y = ny;
      else st.vy *= 0.2;
    }
    st.moving = Math.hypot(st.vx, st.vy) > 0.4;
    st.bob += dt * (st.moving ? 9 : 2.5) * Math.min(2, Math.hypot(st.vx, st.vy) / 3);
    function blocked(x, y, rr) {
      return solidAt(st.world, x - rr, y - rr) || solidAt(st.world, x + rr, y - rr) ||
        solidAt(st.world, x - rr, y + rr) || solidAt(st.world, x + rr, y + rr);
    }
  }

  function castWalls(ctx, env, st) {
    var w = env.w, h = env.h, fov = st.fov || 1.31; // 75 degrees
    var proj = (w / 2) / Math.tan(fov / 2);
    var step = w > 1500 ? 3 : 2;
    var horizon = h * (0.5 + (st.pitch || 0));
    var zb = st.zbuffer, cols = Math.ceil(w / step);
    if (!zb || zb.length !== cols) { zb = st.zbuffer = new Float32Array(cols); }
    for (var c = 0; c < cols; c++) {
      var sx = c * step;
      var camX = ((sx + step / 2) - w / 2) / (w / 2) * Math.tan(fov / 2);
      var dirX = Math.cos(st.angle) - Math.sin(st.angle) * camX;
      var dirY = Math.sin(st.angle) + Math.cos(st.angle) * camX;
      var mapX = Math.floor(st.x), mapY = Math.floor(st.y);
      var ddx = Math.abs(1 / (dirX || 1e-9)), ddy = Math.abs(1 / (dirY || 1e-9));
      var stepX, stepY, sideX, sideY;
      if (dirX < 0) { stepX = -1; sideX = (st.x - mapX) * ddx; } else { stepX = 1; sideX = (mapX + 1 - st.x) * ddx; }
      if (dirY < 0) { stepY = -1; sideY = (st.y - mapY) * ddy; } else { stepY = 1; sideY = (mapY + 1 - st.y) * ddy; }
      var hit = 0, side = 0, guard = 0, type = 1;
      while (!hit && guard++ < 96) {
        if (sideX < sideY) { sideX += ddx; mapX += stepX; side = 0; }
        else { sideY += ddy; mapY += stepY; side = 1; }
        var v = cellAt(st.world, mapX + 0.5, mapY + 0.5);
        if (v && wallInfo(st.world, v, mapX, mapY).solid !== false) { hit = 1; type = v; }
        if (mapX < -2 || mapY < -2 || mapX > st.world.w + 2 || mapY > st.world.h + 2) break;
      }
      var dist = side === 0 ? (sideX - ddx) : (sideY - ddy);
      dist = Math.max(0.15, dist) * Math.cos(Math.atan(camX));
      zb[c] = dist;
      var info = wallInfo(st.world, type, mapX, mapY) || {};
      var tex = info.tex || st.world.textures[type];
      var lineH = Math.min(h * 8, proj * (info.height || 1) / dist);
      var top = horizon - lineH / 2, bottom = horizon + lineH / 2;
      if (tex) {
        var u = side === 0 ? (st.y + dist * dirY) : (st.x + dist * dirX);
        u -= Math.floor(u);
        var tx = Math.min(tex.width - 1, Math.floor(u * tex.width));
        if ((side === 0 && dirX > 0) || (side === 1 && dirY < 0)) tx = tex.width - 1 - tx;
        ctx.drawImage(tex, tx, 0, 1, tex.height, sx, top, step + 0.6, lineH);
        if (side === 1) { ctx.fillStyle = 'rgba(0,0,0,.16)'; ctx.fillRect(sx, top, step + 0.6, lineH); }
      } else {
        ctx.fillStyle = info.color || '#52483c';
        ctx.fillRect(sx, top, step + 0.6, lineH);
      }
      var fog = A.clamp((dist - (st.fogNear || 2)) / (st.fogFar || 16), 0, 0.94);
      if (fog > 0.01) {
        ctx.globalAlpha = fog; ctx.fillStyle = st.fogColor || '#14161a';
        ctx.fillRect(sx, top, step + 0.6, lineH); ctx.globalAlpha = 1;
      }
      if (st.reflect && tex) {
        ctx.save(); ctx.globalAlpha = (st.reflect || 0) * (1 - A.clamp(dist / 14, 0, 1));
        ctx.translate(0, bottom); ctx.scale(1, -0.62);
        ctx.drawImage(tex, tx, 0, 1, tex.height, sx, 0, step + 0.6, lineH);
        ctx.restore();
      }
      if (info.emissive) {
        ctx.globalAlpha = 0.35; ctx.fillStyle = info.emissive; ctx.fillRect(sx, top, step + 0.6, 2); ctx.globalAlpha = 1;
      }
    }
    st.cols = cols; st.step = step; st.horizon = horizon; st.proj = proj;
  }

  function castSprites(ctx, env, st) {
    var list = (typeof st.sprites === 'function' ? st.sprites() : st.sprites) || [];
    var w = env.w, h = env.h, horizon = st.horizon || h / 2, proj = st.proj || w;
    var cos = Math.cos(st.angle), sin = Math.sin(st.angle);
    var visible = [];
    for (var i = 0; i < list.length; i++) {
      var sp = list[i];
      if (sp.hidden) continue;
      var dx = sp.x - st.x, dy = sp.y - st.y;
      var tz = dx * cos + dy * sin;   // depth
      var tx = -dx * sin + dy * cos;  // camera x
      if (tz < 0.25 || tz > (st.fogFar || 16) * 2) continue;
      var cx = w / 2 + tx / tz * proj;
      var size = Math.min(h * 5, proj * (sp.size || 0.6) / tz);
      if (cx + size < -40 || cx - size > w + 40) continue;
      var c = A.clamp(Math.floor(cx / st.step), 0, st.cols - 1);
      if (tz > st.zbuffer[c] + 0.12) continue;
      visible.push({ sp: sp, x: cx, size: size, dist: tz });
    }
    visible.sort(function (a, b) { return b.dist - a.dist; });
    for (var j = 0; j < visible.length; j++) {
      var v = visible[j], sp2 = v.sp;
      var ground = horizon + proj * 0.5 / v.dist;
      var cy = ground - v.size * (sp2.lift === undefined ? 0.5 : sp2.lift);
      var alpha = 1 - A.clamp((v.dist - (st.fogNear || 2)) / ((st.fogFar || 16) * 1.7), 0, 0.85);
      ctx.save(); ctx.globalAlpha = alpha;
      if (sp2.draw) sp2.draw(ctx, v.x, cy, v.size, v.dist, sp2);
      else { ctx.fillStyle = sp2.color || '#ddd'; ctx.fillRect(v.x - v.size / 2, cy - v.size / 2, v.size, v.size); }
      ctx.restore();
    }
  }

  function boot(opts) {
    var st = {
      x: opts.spawn.x, y: opts.spawn.y, angle: opts.spawn.angle || 0, pitch: 0,
      vx: 0, vy: 0, bob: 0, moving: false, recoil: 0, charge: 0, charging: false,
      fov: opts.fov || 1.31, fogColor: opts.fogColor || '#14161a', fogNear: opts.fogNear || 2,
      fogFar: opts.fogFar || 17, reflect: opts.reflect || 0,
      world: makeWorld(opts.map, opts.wall || {}, opts.textures),
      sprites: [], zbuffer: null, score: 0, lives: opts.lives || 3, time: 0,
      fireCooldown: 0, sprinting: false, crouching: false
    };
    var envRef = null;
    var env = A.boot({
      id: opts.id, title: opts.title, hint: opts.hint, background: opts.background || '#14161a',
      ink: opts.ink, dragLook: opts.dragLook,
      onResize: function (e) { if (opts.onResize) opts.onResize(st, e); },
      onStart: function (e) { envRef = e; if (opts.onInit) opts.onInit(st, e); },
      onFrame: function (ctx, e) { draw(ctx, e); }
    });
    envRef = env;

    function handleFire(e, dt, clicks) {
      var input = e.input;
      var mode = opts.fire || 'click';
      var fireDown = input.mouse.left || input.isDown('Space');
      if (mode === 'charge') {
        var pressed = false, released = false;
        for (var i = 0; i < clicks.length; i++) {
          if (clicks[i].right) continue;
          if (clicks[i].released) released = true; else pressed = true;
        }
        if (pressed || input.justPressed('Space')) st.charging = true;
        if ((st.charging || fireDown) && !e.frozen) st.charge = A.clamp(st.charge + dt / (opts.chargeTime || 1.1), 0, 1);
        if (released || (st.charging && !fireDown)) {
          if (st.charge > 0.03) fire(A.clamp(st.charge, 0.12, 1));
          st.charging = false; st.charge = 0;
        }
      } else {
        var want = fireDown || clicks.some(function (c) { return !c.released && !c.right; });
        if (want && st.fireCooldown <= 0) {
          fire(1);
          st.fireCooldown = opts.cooldown || (mode === 'auto' ? 0.11 : 0.28);
        }
      }
      function fire(power) {
        st.recoil = 1;
        if (opts.onFire) opts.onFire(st, e, power);
        if (opts.soundFire) opts.soundFire(power);
      }
    }

    function draw(ctx, e) {
      var dt = e.frozen ? 0 : Math.min(0.05, e.dt || 0.016);
      var clicks = e.input.consumeClicks();
      st.time += dt;
      st.fireCooldown = Math.max(0, st.fireCooldown - dt);
      if (opts.sky) opts.sky(ctx, e, st);
      else {
        ctx.fillStyle = A.gfx.linear(ctx, 0, 0, 0, e.h, [[0, opts.skyTop || '#25303c'], [0.5, opts.skyHorizon || '#4a4a44'], [0.501, opts.floorColor || '#312a24'], [1, '#1b1714']]);
        ctx.fillRect(0, 0, e.w, e.h);
      }
      var look = e.input.consumeLook();
      st.angle += look.x * 0.0023;
      st.pitch = A.clamp(st.pitch + look.y * 0.0012, -0.22, 0.22);
      if (e.input.isDown('ArrowLeft')) st.angle -= dt * 1.9;
      if (e.input.isDown('ArrowRight')) st.angle += dt * 1.9;
      if (e.input.isDown('ArrowUp')) st.pitch = A.clamp(st.pitch - dt * 0.35, -0.22, 0.22);
      if (e.input.isDown('ArrowDown')) st.pitch = A.clamp(st.pitch + dt * 0.35, -0.22, 0.22);
      st.sprinting = !!e.input.isDown('ShiftLeft') || !!e.input.isDown('ShiftRight');
      st.crouching = !!e.input.isDown('KeyC');
      var f = (e.input.isDown('KeyW') ? 1 : 0) - (e.input.isDown('KeyS') ? 1 : 0);
      var s = (e.input.isDown('KeyD') ? 1 : 0) - (e.input.isDown('KeyA') ? 1 : 0);
      if (e.attract && opts.onBot) {
        var bot = opts.onBot(st, e) || {};
        if (typeof bot.angle === 'number') st.angle = bot.angle;
        if (bot.f !== undefined) f = bot.f;
        if (bot.s !== undefined) s = bot.s;
        if (bot.fire && st.fireCooldown <= 0) { st.recoil = 1; if (opts.onFire) opts.onFire(st, e, bot.power || 1); st.fireCooldown = opts.cooldown || 0.28; }
      }
      moveWithCollision(st, e, dt, f, s);
      st.recoil = Math.max(0, st.recoil - dt * 4.5);
      if (!e.frozen && !e.attract) handleFire(e, dt, clicks);
      if (opts.onUpdate) opts.onUpdate(st, e, dt, ctx);
      castWalls(ctx, e, st);
      castSprites(ctx, e, st);
      if (opts.onWorld) opts.onWorld(ctx, e, st);
      if (opts.onWeapon) opts.onWeapon(ctx, e, st);
      if (opts.onFx) opts.onFx(ctx, e, st);
      if (opts.onHud) opts.onHud(ctx, e, st);
      // quiet central aim mark
      var ax = e.w / 2, ay = e.h * (0.5 + st.pitch);
      ctx.strokeStyle = 'rgba(245,239,225,.62)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ax - 7, ay); ctx.lineTo(ax - 2, ay); ctx.moveTo(ax + 2, ay); ctx.lineTo(ax + 7, ay);
      ctx.moveTo(ax, ay - 7); ctx.lineTo(ax, ay - 2); ctx.moveTo(ax, ay + 2); ctx.lineTo(ax, ay + 7); ctx.stroke();
      if (opts.onOverlay) opts.onOverlay(ctx, e, st);
    }
    st.env = env;
    return st;
  }

  root.Raycaster = {
    boot: boot, makeWorld: makeWorld, solidAt: solidAt, cellAt: cellAt,
    TAU: TAU,
    guide: function (st, tx, ty) {
      var d = Math.atan2(ty - st.y, tx - st.x);
      var diff = ((d - st.angle + Math.PI * 3) % TAU) - Math.PI;
      return { angle: d, diff: diff, dist: Math.hypot(tx - st.x, ty - st.y) };
    },
    mapChars: function (rows) { return makeWorld(rows, {}); }
  };
})(window);
