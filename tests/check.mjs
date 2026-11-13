/* Repo-level static checks. Run: npm run check */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'assets/manifest.js'), 'utf8'), sandbox);
const GAMES = sandbox.window.ARCADE_GAMES;
const FPS = new Set(['under-the-glass', 'box-fort', 'breakwater']);
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
  if (FPS.has(g.id)) check(h.includes('../shared/raycaster.js'), `${g.id}: FPS build must load the raycaster`);
  check(/\.\s*boot\s*\(/.test(s), `${g.id}: game never boots`);
  check(s.includes(`${g.id}`), `${g.id}: game.js must use its own id`);
  check(/\.\s*(finish|complete)\s*\(/.test(s), `${g.id}: no completion call`);
  check(/\bfetch\s*\(|XMLHttpRequest|https?:\/\//.test(s) === false, `${g.id}: network call in game.js`);
  check(!/requestAnimationFrame\s*\(/.test(s), `${g.id}: game drives its own RAF instead of the SDK`);
  if (!/\bauto\b|\battract\b/i.test(s)) warnings.push(`${g.id}: no attract/bot handling found`);
  if (s.split('\n').length < 110) warnings.push(`${g.id}: game.js is suspiciously short (${s.split('\n').length} lines)`);
  notes.push(`${String(g.rank).padStart(2, '0')} ${g.id.padEnd(18)} ${String(s.split('\n').length).padStart(4)} lines  ${String(g.minutes).padStart(3)} min  $${g.cost.toFixed(2)}  tier ${g.tier}`);
}

for (const f of ['assets/sdk.js', 'assets/host.js', 'assets/posters.js', 'games/shared/raycaster.js', 'server/server.mjs']) {
  const r = spawnSync(process.execPath, ['--check', path.join(ROOT, f)], { encoding: 'utf8' });
  if (r.status !== 0) errors.push(`${f}: syntax error: ${(r.stderr || '').split('\n')[0]}`);
}
const server = fs.readFileSync(path.join(ROOT, 'server/server.mjs'), 'utf8');
check(!/require\s*\(\s*['"](?!node:)/.test(server), 'server has third-party dependencies');
check(/DatabaseSync/.test(server), 'server is missing its SQLite store');

console.log('THE THIRTEEN — static checks');
console.log(notes.join('\n'));
if (warnings.length) console.log('\nWarnings:\n- ' + warnings.join('\n- '));
if (errors.length) console.log('\nErrors:\n- ' + errors.join('\n- '));
console.log(`\n${GAMES.length} games, ${errors.length} errors, ${warnings.length} warnings.`);
process.exitCode = errors.length ? 1 : 0;
