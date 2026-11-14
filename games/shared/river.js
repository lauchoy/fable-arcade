import { quat } from './scene-runtime.js';

export const RIVER_PATHS = [
  [10, 11, 12, 13, 14],
  [10, 5, 6, 7, 12, 13, 14],
  [10, 11, 12, 7, 8, 9, 14],
  [10, 15, 16, 17, 12, 7, 8, 13, 14],
  [10, 5, 0, 1, 2, 7, 12, 17, 18, 19, 14],
  [10, 11, 6, 1, 2, 3, 8, 7, 12, 17, 18, 13, 14],
];
const delta = [[1, 0], [0, -1], [-1, 0], [0, 1]];
const direction = (a, b) => delta.findIndex(([x, y]) => b[0] - a[0] === x && b[1] - a[1] === y);
const cell = i => [i % 5, Math.floor(i / 5)];
export function riverLevel(level, seed = 2026) {
  const route = RIVER_PATHS[level];
  const tiles = Array.from({ length: 25 }, (_, i) => ({ type: i % 3 === 0 ? 'bend' : 'straight', rotation: (seed + i * 7) % 4, goal: 0 }));
  route.forEach((index, i) => {
    const here = cell(index), before = i ? cell(route[i - 1]) : [-1, 2], after = i + 1 < route.length ? cell(route[i + 1]) : [5, 2];
    const dirs = [direction(here, before), direction(here, after)];
    const straight = Math.abs(dirs[0] - dirs[1]) === 2;
    const base = straight ? [0, 2] : [2, 3];
    const goal = [0, 1, 2, 3].find(k => dirs.every(d => base.map(v => (v + k) % 4).includes(d)));
    tiles[index] = { type: straight ? 'straight' : 'bend', goal, rotation: (goal + 1 + ((index + seed) % 2)) % 4 };
  });
  return { tiles, route };
}
export function riverConnected(tiles) {
  let x = 0, y = 2, incoming = 2;
  const seen = new Set(), route = [];
  while (x >= 0 && x < 5 && y >= 0 && y < 5) {
    const i = y * 5 + x;
    if (seen.has(i)) return null;
    seen.add(i); route.push(i);
    const t = tiles[i], base = t.type === 'straight' ? [0, 2] : [2, 3];
    const dirs = base.map(v => (v + t.rotation) % 4);
    if (!dirs.includes(incoming)) return null;
    const out = dirs.find(d => d !== incoming);
    x += delta[out][0]; y += delta[out][1]; incoming = (out + 2) % 4;
  }
  return x === 5 && y === 2 ? route : null;
}
export function river(e) {
  const s = e.state; s.level = 0; s.moves = 0; s.undo = []; s.sailing = 0; s.selected = -1; s.swap = false;
  const names = ['A straight channel', 'The first bend', 'The bridge', 'The lock', 'The whirlpool', 'The two-face wall'];
  const points = Array.from({ length: 25 }, (_, i) => [(i % 5 - 2) * 1.16, (2 - Math.floor(i / 5)) * 1.16, 0.15]);
  function draw() {
    s.tiles.forEach((t, i) => {
      e.rotate('pipe-' + i, [0, 0, 1], t.rotation * Math.PI / 2);
      e.hide('straight-' + i, t.type !== 'straight'); e.hide('bend-' + i, t.type !== 'bend');
      e.set('ceramic-' + i, { material: s.selected === i ? 'gold' : 'glaze' });
    });
  }
  function load() {
    Object.assign(s, riverLevel(s.level, e.seed)); s.undo = []; s.sailing = 0; s.selected = -1; draw();
    e.hide('boat'); e.panel('<p>' + names[s.level] + '. Turn the tiles. Join the left spring to the right sea.</p>');
  }
  function turn(i) {
    if (i < 0 || s.sailing || e.done) return;
    s.undo.push(structuredClone(s.tiles));
    if (s.swap) {
      if (s.selected < 0) { s.selected = i; draw(); return; }
      [s.tiles[i], s.tiles[s.selected]] = [s.tiles[s.selected], s.tiles[i]];
      s.selected = -1;
    } else s.tiles[i].rotation = (s.tiles[i].rotation + 1) % 4;
    s.moves++; draw(); e.sound(330);
    const connected = riverConnected(s.tiles);
    if (connected) { s.solvedRoute = connected; s.sailing = 0.001; e.hide('boat', false); e.mark('wall-' + s.level, 500); }
  }
  const hint = () => {
    const i = s.route.find(index => {
      const t = s.tiles[index], period = t.type === 'straight' ? 2 : 4;
      return t.rotation % period !== t.goal % period;
    });
    if (i !== undefined) turn(i);
  };
  const undo = () => { if (!s.sailing && s.undo.length) { s.tiles = s.undo.pop(); s.selected = -1; draw(); } };
  e.button('Undo', undo); e.button('Hint', hint);
  const swap = e.button('Swap two tiles', () => { s.swap = !s.swap; s.selected = -1; swap.textContent = s.swap ? 'Turn tiles' : 'Swap two tiles'; draw(); });
  e.update = dt => {
    e.camera = { ...e.recipe.camera, eye: [0, 0, 10.8 * Math.max(1, e.h / e.w)] };
    if (e.pressed.has('KeyU')) undo();
    if (e.pressed.has('KeyH')) hint();
    for (const c of e.pointer.clicks) turn(e.nearest(points, c, Math.min(e.w / 11, e.h / 11)));
    if (e.auto && !s.sailing && e.t > (s.nextBot || 0)) { s.nextBot = e.t + 0.16; hint(); }
    if (s.sailing) {
      s.sailing += dt * 3;
      const route = s.solvedRoute, n = Math.min(route.length - 1, Math.floor(s.sailing)), f = s.sailing - n;
      const a = points[route[n]], b = points[route[Math.min(n + 1, route.length - 1)]];
      e.set('boat', { translation: [a[0] + (b[0] - a[0]) * Math.min(f, 1), a[1] + (b[1] - a[1]) * Math.min(f, 1), 0.27] });
      if (s.sailing >= route.length) { if (s.level === 5) e.finish(); else { s.level++; load(); } }
    }
    e.status('Wall ' + (s.level + 1) + '/6. ' + s.moves + ' moves.');
  };
  load();
}
