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
  const ctx = await browser.newContext({ viewport: { width: 640, height: 480 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  watch(page);
  try {
    await page.goto(`${BASE}/games/${g.id}/index.html?auto=1&seed=7`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForFunction(() => window.__arcadeEnv?.frame > 0);
    const env = await page.evaluate(() => {
      const e = window.__arcadeEnv;
      if (!e) return null;
      const c = document.querySelector('#stage');
      let drew = false;
      if (c) {
        const gl = c.getContext('webgl2');
        drew = !!gl && c.width > 100 && !e.error;
      }
      return { frames: e.frame, fps: e.fps, w: e.w, h: e.h, attract: e.attract, drew, canvas: !!c };
    });
    if (!env) throw new Error('SDK never booted (window.__arcadeEnv missing)');
    result.frames = env.frames; result.fps = Math.round(env.fps); result.drew = !!env.drew;
    if (!env.canvas || env.w < 300 || env.h < 300) errors.push('canvas missing or too small');
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
    const final = await page.evaluate(() => {
      const e = window.__game;
      return { frames: e.frame, fps: Math.round(e.fps),
        hiddenPartsPresent: e.recipe.nodes.filter(n => n.visible === false && n.geometry).every(n => e.scene.parts.some(p => p.name === n.id)) };
    });
    result.frames = final.frames; result.fps = final.fps;
    if (!final.hiddenPartsPresent) errors.push('an authored hidden part is absent from the renderer');
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
    await p2.waitForFunction(() => window.__arcadeEnv?.frame > 0);
    const firstButton = () => p2.locator('#controls button').first().click();
    if (g.id === 'delphi') {
      const p = await p2.evaluate(() => window.__game.project(window.__game.point('mark-0')));
      await p2.mouse.click(p.x, p.y);
    } else if (g.id === 'tile-river') await p2.getByRole('button', { name: 'Hint', exact: true }).click();
    else if (['tarn', 'fast-lens', 'crystal-tumbler'].includes(g.id)) {
      await p2.locator('#controls input').first().fill('0.8');
    } else if (g.id === 'comb') {
      await firstButton(); await p2.mouse.move(640, 200);
    } else if (['many-hands', 'the-seed'].includes(g.id)) await firstButton();
    else if (g.id === 'cork-gallery') {
      const p = await p2.evaluate(() => window.__game.project(window.__game.point('target-2').map((v, i) => v + (i === 1 ? 0.4 : 0))));
      await p2.mouse.click(p.x, p.y);
    } else if (g.id === 'shareware-1996') {
      await firstButton(); await p2.locator('[data-pixel="68"]').click();
    } else {
      await p2.keyboard.down('KeyW'); await p2.waitForTimeout(700); await p2.keyboard.up('KeyW');
      await p2.keyboard.down('ArrowRight'); await p2.waitForTimeout(400); await p2.keyboard.up('ArrowRight');
      await p2.mouse.move(640, 250); await p2.mouse.down(); await p2.waitForTimeout(700); await p2.mouse.up();
    }
    await p2.waitForFunction(id => {
      const e = window.__game, s = e.state;
      return id === 'delphi' ? s.scanned.length > 0
        : id === 'tile-river' ? s.moves > 0
        : id === 'tarn' ? s.strength === 0.8
        : id === 'comb' ? s.fill > 0
        : id === 'many-hands' ? !!s.jobs[0]
        : id === 'the-seed' ? s.helped
        : id === 'fast-lens' ? s.aperture === 0.8
        : id === 'crystal-tumbler' ? Math.abs(s.angle - 0.8) < 0.01
        : id === 'cork-gallery' ? s.fired > 0
        : id === 'shareware-1996' ? s.drawn
        : s.player[2] < 2.5 && s.fired > 0 && s.yaw > 0;
    }, g.id, { timeout: 10000 });
    await p2.screenshot({ path: path.join(SHOTS, `${String(g.rank).padStart(2, '0')}-${g.id}-input.png`) });
    const after = await p2.evaluate(() => ({ frame: window.__arcadeEnv ? window.__arcadeEnv.frame : 0, started: window.__arcadeEnv ? window.__arcadeEnv.started : false }));
    result.inputOk = after.frame > 0 && after.started;
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
    await page.waitForFunction(() => window.__game?.frame > 2);
    const a = await page.locator('#stage').screenshot();
    await page.waitForTimeout(500);
    const b = await page.locator('#stage').screenshot();
    ok = Buffer.compare(a, b) === 0;
  } catch (e) { ok = false; }
  await ctx.close();
  return { id: g.id, frozen: ok };
}

async function responsiveTest(browser, g) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  let dims = null;
  try {
    await page.goto(`${BASE}/games/${g.id}/index.html?seed=1`, { waitUntil: 'load', timeout: 20000 });
    await page.waitForFunction(() => window.__game?.frame > 2);
    dims = await page.evaluate(() => { const e = window.__arcadeEnv; return e ? { w: e.w, h: e.h, frames: e.frame } : null; });
    if (!dims || dims.w > 400 || dims.frames < 3) errors.push('did not draw at 390px');
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) errors.push('mobile page overflows horizontally');
    if (g.id === 'tile-river') {
      const corners = await page.evaluate(() => {
        const e = window.__game;
        return [0, 4, 20, 24].map(i => e.project([(i % 5 - 2) * 1.16, (2 - Math.floor(i / 5)) * 1.16, 0.15]));
      });
      for (const p of corners) {
        if (p.x <= 0 || p.x >= dims.w || p.y <= 0 || p.y >= dims.h) throw Error('a corner tile is outside the mobile view');
        await page.touchscreen.tap(p.x, p.y);
      }
      await page.waitForFunction(() => window.__game.state.moves === 4);
    }
    if (['under-the-glass', 'box-fort', 'breakwater'].includes(g.id)) {
      const button = page.getByRole('button', { name: 'Move forward', exact: true });
      const box = await button.boundingBox();
      const session = await ctx.newCDPSession(page);
      await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + box.width / 2, y: box.y + box.height / 2 }] });
      await page.waitForTimeout(800);
      await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      if (!await page.evaluate(() => window.__game.state.player[2] < 2.8)) errors.push('touch forward control did not move the player');
      await session.detach();
    }
    await page.screenshot({ path: path.join(SHOTS, `${g.id}-mobile.png`) });
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
  const batchSize = 1;
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
  const sample = SELECTED;
  const frozen = [];
  for (const g of sample) frozen.push(await frozenFrameTest(browser, g));
  console.log('\nFrozen-frame ?t= checks: ' + frozen.map(f => `${f.id}:${f.frozen ? 'exact' : 'moving'}`).join('  '));
  const mobile = [];
  for (const g of sample) mobile.push(await responsiveTest(browser, g));
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
  if (failed.length || frozen.some(f => !f.frozen) || mobile.some(m => m.errors.length)) {
    console.log('Failed: ' + failed.map(f => f.id).join(', ')); process.exitCode = 1;
  }
} catch (e) {
  console.error('suite error', e);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}
