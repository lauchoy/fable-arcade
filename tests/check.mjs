/* Repo-level static checks. Run: npm run check */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'assets/manifest.js'), 'utf8'), sandbox);
const GAMES = sandbox.window.ARCADE_GAMES;
const errors = [], warnings = [], notes = [];
function check(ok, msg) { if (!ok) errors.push(msg); }

check(Array.isArray(GAMES) && GAMES.length === 13, 'manifest must contain 13 games');
check(new Set(GAMES.map(g => g.id)).size === 13, 'game ids must be unique');
check(GAMES.every((g, i) => g.rank === i + 1), 'ranks must be 1..13 in complexity order');
check(GAMES.every((g, i) => i === 0 || GAMES[i - 1].minutes <= g.minutes),
  'complexity ladder should follow each prompt source time budget (non-decreasing minutes)');
check(GAMES.every(g => g.title && g.subtitle && g.logline && g.controls && g.goal && g.palette),
  'every manifest entry needs a title, logline, controls, goal and palette');

for (const g of GAMES) {
  const folder = path.join(ROOT, 'games', g.id);
  const html = path.join(folder, 'index.html'), js = path.join(folder, 'game.js');
  if (!fs.existsSync(html) || !fs.existsSync(js)) { errors.push(`${g.id}: missing index.html or game.js`); continue; }
  const h = fs.readFileSync(html, 'utf8'), s = fs.readFileSync(js, 'utf8');
  const syntax = spawnSync(process.execPath, ['--check', js], { encoding: 'utf8' });
  if (syntax.status !== 0) errors.push(`${g.id}: syntax error: ${(syntax.stderr || '').split('\n')[0]}`
  );
  check(h.includes('../../assets/sdk.js'), `${g.id}: html is missing the SDK script`);
  check(h.includes('./game.js'), `${g.id}: html is missing game.js`);
  check(!/<script[^>]+https?:/i.test(h), `${g.id}: html loads a remote script`);
  check(h.includes('type="module"'), `${g.id}: entry must load an ES module`);
  check(/\bboot\s*\(/.test(s), `${g.id}: game never boots`);
  check(s.includes(`${g.id}`), `${g.id}: game.js must use its own id`);
  check(/\bfetch\s*\(|XMLHttpRequest|https?:\/\//.test(s) === false, `${g.id}: network call in game.js`);
  check(!/requestAnimationFrame\s*\(/.test(s), `${g.id}: game drives its own RAF instead of the SDK`);
  const scenePath = path.join(folder, 'scene.json');
  check(fs.existsSync(scenePath), `${g.id}: missing MCP scene`);
  if (fs.existsSync(scenePath)) {
    const scene = JSON.parse(fs.readFileSync(scenePath, 'utf8'));
    const nodes = new Set(scene.nodes.map(n => n.id));
    const geometries = new Set(scene.geometries.map(n => n.id)), materials = new Set(scene.materials.map(n => n.id));
    check(nodes.size === scene.nodes.length, `${g.id}: duplicate scene node`);
    check(scene.format === '67js.scene' && scene.schemaVersion === 1, `${g.id}: invalid scene format`);
    check(scene.nodes.every(n => (!n.parent || nodes.has(n.parent)) && (!n.geometry || geometries.has(n.geometry)) && (!n.material || materials.has(n.material))), `${g.id}: broken scene references`);
    check(scene.nodes.length <= 4096 && scene.geometries.length <= 256 && scene.materials.length <= 256, `${g.id}: exceeds MCP scene budget`);
    check(fs.existsSync(path.join(ROOT, 'assets/scenes', g.id + '.png')), `${g.id}: missing MCP review`);
    if (g.id === 'fast-lens') {
      for (let i = 0; i < 13; i++) for (let j = 0; j < 16; j++) check(nodes.has(`ray-${i}-${j}`), `missing lens segment ${i}/${j}`);
    }
    notes.push(`${String(g.rank).padStart(2, '0')} ${g.id.padEnd(18)} ${scene.nodes.length} scene nodes`);
  }
}

for (const f of ['assets/sdk.js', 'assets/host.js', 'server/server.mjs', ...fs.readdirSync(path.join(ROOT, 'games/shared')).filter(f => f.endsWith('.js')).map(f => 'games/shared/' + f)]) {
  const r = spawnSync(process.execPath, ['--check', path.join(ROOT, f)], { encoding: 'utf8' });
  if (r.status !== 0) errors.push(`${f}: syntax error: ${(r.stderr || '').split('\n')[0]}`);
}
const server = fs.readFileSync(path.join(ROOT, 'server/server.mjs'), 'utf8');
check(!/require\s*\(\s*['"](?!node:)/.test(server), 'server has third-party dependencies');
check(/DatabaseSync/.test(server), 'server is missing its SQLite store');
check(fs.existsSync(path.join(ROOT, 'assets/67js/67.module.js')), 'missing vendored 67.js renderer');

console.log('THE THIRTEEN — static checks');
console.log(notes.join('\n'));
if (warnings.length) console.log('\nWarnings:\n- ' + warnings.join('\n- '));
if (errors.length) console.log('\nErrors:\n- ' + errors.join('\n- '));
console.log(`\n${GAMES.length} games, ${errors.length} errors, ${warnings.length} warnings.`);
process.exitCode = errors.length ? 1 : 0;
