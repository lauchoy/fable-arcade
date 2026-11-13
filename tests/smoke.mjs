/* Fast host smoke test (no games needed). Run: node tests/smoke.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
const ROOT = path.resolve(import.meta.dirname, '..');
const PORT = 8093, BASE = `http://127.0.0.1:${PORT}`;
const DATA = '/tmp/fable-arcade-smoke-data';
fs.rmSync(DATA, { recursive: true, force: true });
fs.mkdirSync('/tmp/fable-arcade-shots', { recursive: true });
const server = spawn(process.execPath, ['server/server.mjs'], {
  cwd: ROOT, env: { ...process.env, PORT: String(PORT), DATA_DIR: DATA, HOST: '127.0.0.1' }, stdio: ['ignore','pipe','pipe']
});
let log = ''; server.stdout.on('data', d => log += d); server.stderr.on('data', d => log += d);
let browser;
try {
  for (let i = 0; i < 80; i++) { try { if ((await fetch(BASE + '/api/health')).ok) break; } catch(e){} await new Promise(r=>setTimeout(r,100)); }
  const health = await (await fetch(BASE + '/api/health')).json();
  browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('response', r => { if (r.status() >= 400) errors.push('HTTP ' + r.status() + ' ' + r.url()); });
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  const info = await page.evaluate(() => ({
    cards: document.querySelectorAll('.card').length,
    steps: document.querySelectorAll('.step').length,
    posters: [...document.querySelectorAll('.poster')].every(img => img.src.startsWith('data:image/png')),
    code: document.getElementById('syncCode').textContent.trim(),
    sync: document.getElementById('syncText').textContent,
    font: getComputedStyle(document.querySelector('h1')).fontFamily,
    railRects: ['sync','playerBtn','progressBtn'].map(id => { const b = document.getElementById(id).getBoundingClientRect(); return { id, x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) }; })
  }));
  await page.screenshot({ path: '/tmp/fable-arcade-shots/host-desktop.png', fullPage: false });
  await page.screenshot({ path: '/tmp/fable-arcade-shots/host-full.png', fullPage: true });
  await page.locator('#progressBtn').click();
  await page.waitForTimeout(400);
  const drawer = await page.evaluate(() => ({ open: document.getElementById('drawer').classList.contains('open'), badges: document.querySelectorAll('.badge').length, rows: document.querySelectorAll('.rr').length }));
  await page.locator('#closeDrawer').click();
  await page.evaluate(() => window.Arcade.complete('delphi', { score: 1234, stars: 2, seconds: 42 }));
  await page.waitForTimeout(2200);
  const after = await page.evaluate(() => ({ count: document.getElementById('clearCount').textContent, sync: document.getElementById('syncText').textContent, code: JSON.parse(localStorage.getItem('fable-arcade.progress.v1')).playerId }));
  const api = await (await fetch(BASE + '/api/progress/' + after.code)).json();
  const stats = await (await fetch(BASE + '/api/stats')).json();
  const board = await (await fetch(BASE + '/api/leaderboard')).json();
  const secondDoc = JSON.parse(JSON.stringify(api.doc));
  secondDoc.updatedAt = Date.now() + 2000;
  secondDoc.games.delphi.best = 5678;
  const put2 = await (await fetch(BASE + '/api/progress/' + after.code, {
    method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(secondDoc)
  })).json();
  const api2 = await (await fetch(BASE + '/api/progress/' + after.code)).json();
  const secondWrite = { newer: put2.newer, best: api2.doc && api2.doc.games.delphi.best };
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/tmp/fable-arcade-shots/host-mobile.png', fullPage: false });
  console.log(JSON.stringify({ health, info, drawer, after, apiCompleted: !!(api.doc && api.doc.games.delphi && api.doc.games.delphi.completed), secondWrite, stats, leaderboard: board.rows.length, errors }, null, 2));
  if (errors.length || info.cards !== 13 || info.steps !== 13 || !info.posters || !drawer.open || after.count !== '1/13' || !api.doc.games.delphi.completed || !put2.newer || secondWrite.best !== 5678) process.exitCode = 1;
} catch (e) { console.error('smoke failed', e, '\nserver log:', log); process.exitCode = 1; }
finally { if (browser) await browser.close(); server.kill('SIGTERM'); }
