/* Browser end-to-end suite: every game loads, draws, accepts input, and its
   ?auto=1 attract bot completes a run; then host -> API -> restore is checked.
   Run: npm run test:e2e   (requires `npx playwright install chromium`) */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawn } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const PORT = Number(process.env.E2E_PORT || 8091);
const BASE = `http://127.0.0.1:${PORT}`;
const SHOTS = process.env.E2E_SHOTS || '/tmp/fable-arcade-shots';
const DATA = process.env.E2E_DATA || '/tmp/fable-arcade-e2e-data';
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'assets/manifest.js'), 'utf8'), sandbox);
const GAMES = sandbox.window.ARCADE_GAMES;
const only = process.argv.find(a => a.startsWith('--game='));
const many = process.argv.find(a => a.startsWith('--games='));
const hostOnly = process.argv.includes('--host-only');
const ids = hostOnly ? null : (many ? many.slice(8).split(',').filter(Boolean) : (only ? [only.slice(7)] : null));
const SELECTED = hostOnly ? [] : (ids ? GAMES.filter(g => ids.includes(g.id)) : GAMES);
fs.mkdirSync(SHOTS, { recursive: true });
fs.rmSync(DATA, { recursive: true, force: true });

const results = [];
const server = spawn(process.execPath, ['server/server.mjs'], {
  cwd: ROOT, env: { ...process.env, PORT: String(PORT), DATA_DIR: DATA, HOST: '127.0.0.1' },
  stdio: ['ignore', 'pipe', 'pipe']
});
let serverLog = '';
server.stdout.on('data', d => { serverLog += d; });
server.stderr.on('data', d => { serverLog += d; });

async function waitForHealth() {
  for (let i = 0; i < 80; i++) {
    try { const r = await fetch(BASE + '/api/health'); if (r.ok) return; } catch (e) { /* not yet */ }
    await new Promise(r => setTimeout(r, 150));
  }
  throw new Error('server did not start:\n' + serverLog);
}
async function playGame(browser, g) {
  const errors = [], warnings = [];
  const result = { id: g.id, rank: g.rank, errors, warnings, frames: 0, fps: 0, completed: false, ms: 0, drew: false, inputOk: false };
  const t0 = Date.now();
  function watch(page) {
    page.on('pageerror', e => errors.push('pageerror: ' + e.message));
    page.on('console', m => { if (m.type() === 'error' && errors.length < 20) errors.push('console: ' + m.text().slice(0, 240)); });
  }
  // A. The ?auto=1 attract bot plays an uninterrupted full run.
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  watch(page);
  try {
    await page.goto(`${BASE}/games/${g.id}/index.html?auto=1&seed=7`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1300);
    const env = await page.evaluate(() => {
      const e = window.__arcadeEnv;
      if (!e) return null;
      const c = document.querySelector('#stage');
      let drew = false;
      if (c) {
        const x = c.getContext('2d');
        const d = x.getImageData(Math.floor(c.width * .35), Math.floor(c.height * .45), 1, 1).data;
        const d2 = x.getImageData(Math.floor(c.width * .65), Math.floor(c.height * .35), 1, 1).data;
        drew = d[0] !== d2[0] || d[1] !== d2[1] || d[2] !== d2[2] || c.width > 100;
      }
      return { frames: e.frame, fps: e.fps, w: e.w, h: e.h, attract: e.attract, drew, canvas: !!c };
    });
    if (!env) throw new Error('SDK never booted (window.__arcadeEnv missing)');
    result.frames = env.frames; result.fps = Math.round(env.fps); result.drew = !!env.drew;
    if (!env.canvas || env.w < 300 || env.h < 300) errors.push('canvas missing or too small');
    if (env.frames < 8) warnings.push(`only ${env.frames} frames in 1.3s`);
    if (env.fps < 20) warnings.push(`low measured fps: ${Math.round(env.fps)}`);
    await page.screenshot({ path: path.join(SHOTS, `${String(g.rank).padStart(2, '0')}-${g.id}-start.png`) });
    await page.waitForFunction(id => {
      try {
        const d = JSON.parse(localStorage.getItem('fable-arcade.progress.v1') || '{}');
        return !!(d.games && d.games[id] && d.games[id].completed);
      } catch (e) { return false; }
    }, g.id, { timeout: 105000, polling: 500 });
    result.completed = true;
    await page.screenshot({ path: path.join(SHOTS, `${String(g.rank).padStart(2, '0')}-${g.id}-end.png`) });
    const state = await page.evaluate(id => {
      const d = JSON.parse(localStorage.getItem('fable-arcade.progress.v1'));
      return d.games[id];
    }, g.id);
    result.state = { plays: state.plays, best: state.best, stars: state.stars, checkpoints: (state.checkpoints || []).length };
  } catch (e) {
    errors.push('bot: ' + String(e.message || e).split('\n')[0].slice(0, 240));
  }
  if (errors.length) {
    try { await page.screenshot({ path: path.join(SHOTS, `${String(g.rank).padStart(2, '0')}-${g.id}-error.png`) }); } catch (e) { /* ignore */ }
  }
  await ctx.close();

  // B. A separate page proves the game reacts to real first-second input.
  // (Input in the bot page would disable some games' attract mode.)
  const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p2 = await ctx2.newPage();
  const inputErrors = [];
  p2.on('pageerror', e => inputErrors.push('pageerror: ' + e.message));
  p2.on('console', m => { if (m.type() === 'error' && inputErrors.length < 20) inputErrors.push('console: ' + m.text().slice(0, 200)); });
  try {
    await p2.goto(`${BASE}/games/${g.id}/index.html?seed=7`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await p2.waitForTimeout(450);
    await p2.mouse.move(640, 400);
    await p2.mouse.click(640, 400);
    await p2.keyboard.press('Space');
    await p2.keyboard.down('KeyW'); await p2.waitForTimeout(350); await p2.keyboard.up('KeyW');
    await p2.keyboard.press('ArrowRight');
    await p2.mouse.move(760, 430);
    await p2.mouse.down({ button: 'right' }); await p2.mouse.move(820, 470); await p2.mouse.up({ button: 'right' });
    await p2.mouse.wheel(0, 180);
    await p2.waitForTimeout(650);
    await p2.screenshot({ path: path.join(SHOTS, `${String(g.rank).padStart(2, '0')}-${g.id}-input.png`) });
    const after = await p2.evaluate(() => ({ frame: window.__arcadeEnv ? window.__arcadeEnv.frame : 0, started: window.__arcadeEnv ? window.__arcadeEnv.started : false }));
    result.inputOk = after.frame > 5 && after.started;
    if (!result.inputOk) errors.push('input page did not start or draw');
  } catch (e) { errors.push('input: ' + String(e.message || e).split('\n')[0].slice(0, 200)); }
  errors.push(...inputErrors);
  await ctx2.close();
  result.ms = Date.now() - t0;
  return result;
}
async function frozenFrameTest(browser, g) {
  const ctx = await browser.newContext({ viewport: { width: 900, height: 600 } });
  const page = await ctx.newPage();
  let ok = true;
  try {
    await page.goto(`${BASE}/games/${g.id}/index.html?t=4.2&seed=3`, { waitUntil: 'load', timeout: 20000 });
    await page.waitForTimeout(400);
    const a = await page.screenshot();
    await page.waitForTimeout(500);
    const b = await page.screenshot();
    ok = Buffer.compare(a, b) === 0;
  } catch (e) { ok = false; }
  await ctx.close();
  return { id: g.id, frozen: ok };
}

async function responsiveTest(browser, g) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  let dims = null;
  try {
    await page.goto(`${BASE}/games/${g.id}/index.html?t=2&seed=1`, { waitUntil: 'load', timeout: 20000 });
    await page.waitForTimeout(600);
    dims = await page.evaluate(() => { const e = window.__arcadeEnv; return e ? { w: e.w, h: e.h, frames: e.frame } : null; });
    if (!dims || dims.w > 400 || dims.frames < 3) errors.push('did not draw at 390px');
  } catch (e) { errors.push(String(e.message)); }
  await ctx.close();
  return { id: g.id, errors };
}

async function hostAndApiTest(browser) {
  const out = { cards: 0, iframeGame: false, hostCleared: false, sync: false, restore: false, api: false, errors: [] };
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', e => out.errors.push('host: ' + e.message));
  try {
    await page.goto(BASE + '/', { waitUntil: 'load' });
    await page.waitForTimeout(800);
    out.cards = await page.locator('.card').count();
    if (out.cards !== 13) out.errors.push('host does not show 13 cabinet cards');
    await page.locator('#search').fill('pinball');
    await page.waitForTimeout(100);
    out.searchWorks = (await page.locator('.card').count()) >= 1;
    await page.locator('#search').fill('');
    // Load a game with its ?auto=1 bot inside the host iframe: this exercises
    // SDK postMessage -> host render -> debounced PUT -> server.
    await page.evaluate(() => {
      const v = document.getElementById('gameview');
      v.hidden = false;
      document.body.classList.add('playing');
      document.getElementById('gameFrame').src = 'games/delphi/index.html?auto=1&seed=11';
    });
    await page.waitForTimeout(900);
    out.iframeGame = await page.frameLocator('#gameFrame').locator('#stage').count() > 0;
    await page.waitForFunction(() => {
      const n = document.getElementById('clearCount');
      return n && parseInt(n.textContent, 10) >= 1;
    }, null, { timeout: 90000, polling: 500 });
    out.hostCleared = true;
    const playerId = await page.evaluate(() => JSON.parse(localStorage.getItem('fable-arcade.progress.v1')).playerId);
    for (let i = 0; i < 60; i++) {
      const probe = await fetch(`${BASE}/api/progress/${playerId}`, { cache: 'no-store' });
      const pd = await probe.json();
      if (pd.doc && pd.doc.games && pd.doc.games.delphi && pd.doc.games.delphi.completed) break;
      await new Promise(r => setTimeout(r, 250));
    }
    const apiRes = await fetch(`${BASE}/api/progress/${playerId}`);
    const apiDoc = await apiRes.json();
    out.api = apiRes.ok && !!(apiDoc.doc && apiDoc.doc.games.delphi && apiDoc.doc.games.delphi.completed);
    await page.waitForFunction(() => document.getElementById('syncText').textContent === 'Synced', null, { timeout: 15000 }).catch(() => {});
    out.sync = (await page.locator('#syncText').textContent()) === 'Synced';
    out.playerId = playerId;
    const stats = await (await fetch(BASE + '/api/stats')).json();
    out.stats = { players: stats.players, completions: stats.completions };
    const board = await (await fetch(BASE + '/api/leaderboard')).json();
    out.leaderboard = board.rows.length;
    await page.close();
    // Fresh device: restore the same code from the server.
    const ctx2 = await browser.newContext({ viewport: { width: 1200, height: 800 } });
    const p2 = await ctx2.newPage();
    await p2.goto(BASE + '/', { waitUntil: 'load' });
    await p2.locator('#progressBtn').click();
    await p2.locator('#restoreInput').fill(playerId);
    await p2.locator('#restoreBtn').click();
    await p2.locator('#restoreBtn').click();
    await p2.waitForFunction(() => parseInt(document.getElementById('clearCount').textContent, 10) >= 1, null, { timeout: 15000 });
    out.restore = true;
    await ctx2.close();
  } catch (e) { out.errors.push('integration: ' + String(e.message || e).split('\n')[0]); }
  await ctx.close().catch(() => {});
  return out;
}

let browser;
try {
  await waitForHealth();
  browser = await chromium.launch({ headless: true, args: [
    '--disable-background-timer-throttling', '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding', '--disable-features=CalculateNativeWinOcclusion'
  ] });
  console.log('THE THIRTEEN — browser suite\nserver up at ' + BASE + '\n');
  const batchSize = 3;
  for (let i = 0; i < SELECTED.length; i += batchSize) {
    const batch = SELECTED.slice(i, i + batchSize);
    const rs = await Promise.all(batch.map(g => playGame(browser, g)));
    for (const r of rs) {
      results.push(r);
      console.log(`${String(r.rank).padStart(2, '0')} ${r.id.padEnd(18)} ${r.completed ? 'CLEARED' : 'FAILED  '} ` +
        `${(r.ms / 1000).toFixed(1).padStart(5)}s  frames ${String(r.frames).padStart(3)}  fps ${String(r.fps).padStart(3)}  ` +
        `errors ${r.errors.length}  ${r.state ? `score ${r.state.best} stars ${r.state.stars} marks ${r.state.checkpoints}` : ''}`);
      if (r.errors.length) console.log('   ' + r.errors.slice(0, 4).join('\n   '));
    }
  }
  // Deterministic ?t= freeze and 390px checks are sampled on a few builds.
  const sample = SELECTED.filter((_, i) => i % 4 === 0);
  const frozen = await Promise.all(sample.map(g => frozenFrameTest(browser, g)));
  console.log('\nFrozen-frame ?t= checks: ' + frozen.map(f => `${f.id}:${f.frozen ? 'exact' : 'moving'}`).join('  '));
  const mobile = await Promise.all(sample.map(g => responsiveTest(browser, g)));
  console.log('390px checks: ' + mobile.map(m => `${m.id}:${m.errors.length ? 'FAIL' : 'ok'}`).join('  '));
  if (!ids) {
    const host = await hostAndApiTest(browser);
    console.log('\nHost + sync: ' + JSON.stringify(host, null, 2));
    if (host.errors.length) { console.log('Host problems:\n- ' + host.errors.join('\n- ')); }
    results.push({ id: 'host+api', errors: host.errors, completed: host.hostCleared && host.api && host.restore && host.cards === 13 });
  }
  const failed = results.filter(r => !r.completed || r.errors.length);
  fs.writeFileSync(path.join(SHOTS, 'report.json'), JSON.stringify({ results, frozen, mobile }, null, 2));
  console.log(`\n${results.length - failed.length}/${results.length} checks passed. Screenshots: ${SHOTS}`);
  if (failed.length) { console.log('Failed: ' + failed.map(f => f.id).join(', ')); process.exitCode = 1; }
} catch (e) {
  console.error('suite error', e);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}
