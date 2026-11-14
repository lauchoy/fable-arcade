import { Renderer67 } from '../../assets/67js/67.module.js';
import { createAgentScene, loadAgentSceneModules, resolveAgentShadow } from '../../assets/67js/agent-scene.js';

export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const mix = (a, b, t) => a + (b - a) * t;
export const quat = (axis, angle) => axis.map(v => v * Math.sin(angle / 2)).concat(Math.cos(angle / 2));
export const distance = (a, b) => Math.hypot(...a.map((v, i) => v - b[i]));
const sub = (a, b) => a.map((v, i) => v - b[i]);
const norm = v => { const d = Math.hypot(...v) || 1; return v.map(x => x / d); };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);

export async function boot(id, setup) {
  document.body.dataset.game = id;
  const params = new URLSearchParams(location.search);
  const recipe = await (await fetch('./scene.json')).json();
  const entry = window.ARCADE_BY_ID[id];
  await loadAgentSceneModules(recipe);
  const canvas = document.querySelector('#stage');
  // Keep hidden parts in the renderer so later reveals do not require topology changes.
  const renderRecipe = structuredClone(recipe);
  for (const node of renderRecipe.nodes) if (node.visible === false) {
    node.visible = true;
    node.scale = (node.scale || [1, 1, 1]).map(v => v * 0.0001);
  }
  const scene = createAgentScene(renderRecipe);
  const renderer = new Renderer67(canvas, scene.parts, {
    ground: false, world: scene.environment.world, hdr: true, depth: true, samples: 1,
    pixelRatio: Math.min(devicePixelRatio, 1.5), memoryBudgetMiB: 192,
    environment: scene.environment,
    shadowBounds: resolveAgentShadow(scene.shadow, scene.environment.lightDirection),
  });
  const nodes = new Map(renderRecipe.nodes.map(n => [n.id, structuredClone(n)]));
  const base = new Map(recipe.nodes.map(n => [n.id, structuredClone(n)]));
  const pending = new Map();
  const keys = new Set(), pressed = new Set();
  const pointer = { x: innerWidth / 2, y: innerHeight / 2, nx: 0, ny: 0, down: false, right: false, dx: 0, dy: 0, clicks: [] };
  const env = {
    id, entry, recipe, scene, renderer, canvas, nodes, base, params, keys, pressed, pointer,
    w: innerWidth, h: innerHeight, frame: 0, fps: 60, dt: 0, t: 0, started: false,
    auto: params.get('auto') === '1', attract: true, frozen: params.has('t'),
    seed: Number(params.get('seed') || 2026), done: false, score: 0,
    camera: structuredClone(recipe.camera), state: {}, elapsed: 0, interactionCount: 0,
    set(nodeId, fields) {
      const n = nodes.get(nodeId);
      if (!n) throw Error('Unknown scene node: ' + nodeId);
      const op = pending.get(nodeId) || { type: 'set-node', id: nodeId };
      for (const [k, v] of Object.entries(fields)) {
        if (JSON.stringify(n[k]) === JSON.stringify(v)) continue;
        n[k] = v; op[k] = v;
      }
      if (Object.keys(op).length > 2) pending.set(nodeId, op);
    },
    scale(nodeId, factor) {
      const s = base.get(nodeId).scale;
      env.set(nodeId, { scale: s.map((v, i) => v * (Array.isArray(factor) ? factor[i] : factor)) });
    },
    rotate(nodeId, axis, angle) { env.set(nodeId, { rotation: quat(axis, angle) }); },
    hide(nodeId, hidden = true) { env.scale(nodeId, hidden ? 0.0001 : 1); },
    point(nodeId) {
      let n = nodes.get(nodeId), p = [...n.translation];
      while (n.parent) { n = nodes.get(n.parent); p = p.map((v, i) => v + n.translation[i]); }
      return p;
    },
    project(p) {
      const f = norm(sub(env.camera.target, env.camera.eye)), r = norm(cross(f, [0, 1, 0])), u = cross(r, f);
      const v = sub(p, env.camera.eye), z = dot(v, f), s = env.h / (2 * Math.tan((env.camera.fov || 40) * Math.PI / 360));
      return { x: env.w / 2 + dot(v, r) / z * s, y: env.h / 2 - dot(v, u) / z * s, z };
    },
    nearest(points, click, radius = 65) {
      return points.map((p, i) => ({ i, p: env.project(p) }))
        .filter(o => o.p.z > 0 && Math.hypot(o.p.x - click.x, o.p.y - click.y) < radius)
        .sort((a, b) => Math.hypot(a.p.x - click.x, a.p.y - click.y) - Math.hypot(b.p.x - click.x, b.p.y - click.y))[0]?.i ?? -1;
    },
    mark(key, value = 100) {
      if (env.done || env.frozen) return;
      if (!env.state.marks) env.state.marks = [];
      if (env.state.marks.includes(key)) return;
      env.state.marks.push(key); env.score += value;
      Arcade.mark(id, key); Arcade.score(id, env.score);
      Arcade.sound.tone({ freq: 440 + env.state.marks.length * 65, dur: 0.12, gain: 0.06 });
    },
    finish() {
      if (env.done || env.frozen) return;
      env.done = true;
      const seconds = Math.round(env.elapsed);
      Arcade.complete(id, { score: env.score, stars: 3, seconds });
      document.querySelector('#end').hidden = false;
      document.querySelector('#end-score').textContent = env.score + ' points. ' + seconds + ' seconds.';
    },
    status(text) { document.querySelector('#status').textContent = text; },
    hint(text) { document.querySelector('#hint').textContent = text; },
    button(label, onClick, parent = document.querySelector('#controls')) {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = label;
      b.addEventListener('click', () => { env.started = true; env.attract = env.auto; env.interactionCount++; onClick(); });
      parent.append(b); return b;
    },
    range(label, min, max, step, value, change) {
      const l = document.createElement('label'); l.className = 'range';
      const span = document.createElement('span'); span.textContent = label;
      const input = document.createElement('input'); Object.assign(input, { type: 'range', min, max, step, value, ariaLabel: label });
      input.addEventListener('input', () => { env.started = true; env.interactionCount++; change(Number(input.value)); });
      l.append(span, input); document.querySelector('#controls').append(l); return input;
    },
    panel(html) { document.querySelector('#details').innerHTML = html; },
    sound(freq = 280) { Arcade.sound.tone({ freq, dur: 0.09, gain: 0.08 }); },
  };
  let disposed = false, raf = 0, last = null, slow = 0;
  function flush() {
    if (!pending.size) return;
    const ops = [...pending.values()]; pending.clear();
    const revision = scene.topologyRevision;
    for (let i = 0; i < ops.length; i += 256) scene.apply(ops.slice(i, i + 256), { expectedRevision: scene.revision });
    if (scene.topologyRevision !== revision) renderer.replaceParts(scene.parts);
    else renderer.updateParts(scene.parts);
    renderer.shadowsDirty = true;
  }
  function resize() { env.w = canvas.clientWidth; env.h = canvas.clientHeight; renderer.resize(); }
  function position(e) {
    pointer.dx += e.movementX || 0; pointer.dy += e.movementY || 0;
    pointer.x = e.clientX; pointer.y = e.clientY;
    pointer.nx = e.clientX / env.w * 2 - 1; pointer.ny = 1 - e.clientY / env.h * 2;
  }
  function start() { env.started = true; env.attract = env.auto; env.interactionCount++; }
  const listeners = [];
  function on(target, name, fn, options) { target.addEventListener(name, fn, options); listeners.push(() => target.removeEventListener(name, fn, options)); }
  on(window, 'keydown', e => {
    if (/INPUT|TEXTAREA/.test(e.target.tagName)) return;
    if (!e.repeat) pressed.add(e.code); keys.add(e.code); start();
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
  });
  on(window, 'keyup', e => keys.delete(e.code));
  on(window, 'blur', () => { keys.clear(); pointer.down = false; pointer.right = false; });
  on(canvas, 'pointermove', position);
  on(canvas, 'pointerdown', e => {
    position(e); start(); pointer.down = e.button === 0; pointer.right = e.button === 2;
    pointer.clicks.push({ x: e.clientX, y: e.clientY, button: e.button });
    try { canvas.setPointerCapture(e.pointerId); } catch {}
  });
  on(canvas, 'pointerup', e => { position(e); pointer.down = false; pointer.right = false; });
  on(canvas, 'contextmenu', e => e.preventDefault());
  on(canvas, 'wheel', e => { e.preventDefault(); start(); env.wheel?.(e.deltaY); }, { passive: false });
  on(window, 'resize', resize);
  on(document, 'visibilitychange', () => { last = null; });
  document.querySelector('#title').textContent = entry.title;
  env.hint(entry.controls);
  document.querySelector('#sound').onclick = () => {
    if (Arcade.sound.enabled) { Arcade.sound.mute(); document.querySelector('#sound').textContent = 'Enable sound'; }
    else { Arcade.sound.enable(); document.querySelector('#sound').textContent = 'Mute sound'; }
  };
  document.querySelector('#again').onclick = () => location.reload();
  document.querySelector('#exit').onclick = () => Arcade.exit();
  document.querySelector('#back').onclick = () => Arcade.exit();
  document.querySelector('#restart').onclick = () => location.reload();
  await setup(env);
  flush(); resize();
  if (!env.frozen) Arcade.start(id);
  window.__arcadeEnv = env;
  window.__game = env;
  function frame(now) {
    if (disposed) return;
    const rawDt = last === null || document.hidden ? 0 : Math.max(0, (now - last) / 1000);
    const dt = clamp(rawDt, 0, 0.1); last = now;
    env.dt = env.frozen ? 0 : dt;
    if (!env.frozen) { env.t += dt; env.elapsed += env.done ? 0 : dt; }
    else env.t = Number(params.get('t')) || 0;
    env.frame++;
    if (rawDt > 0) env.fps = mix(env.fps, 1 / rawDt, 0.08);
    try {
      env.update?.(env.dt);
      flush();
      renderer.render({ ...env.camera, environment: env.light || scene.environment, effects: scene.effects,
        exposure: scene.effects.exposure, time: env.t });
      if (rawDt > 0.033) slow++; else slow = Math.max(0, slow - 1);
      if (!env.frozen && slow > 15 && renderer.pixelRatio > 0.5) {
        renderer.pixelRatio = Math.max(0.5, renderer.pixelRatio * 0.8); resize(); slow = 0;
      }
    } catch (err) {
      console.error(err); env.error = String(err); env.status('The game could not continue. Press Restart.'); return;
    }
    pressed.clear(); pointer.clicks = []; pointer.dx = 0; pointer.dy = 0;
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  env.dispose = () => { if (disposed) return; disposed = true; cancelAnimationFrame(raf); listeners.forEach(f => f()); renderer.dispose(); };
  on(window, 'pagehide', env.dispose);
  return env;
}
