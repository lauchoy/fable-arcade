import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ids } from '../scripts/scene-recipes.mjs';
const root = path.resolve(import.meta.dirname, '..'), port = 8096;
const data = fs.mkdtempSync(path.join(os.tmpdir(), 'fable-67js-probe-'));
const out = path.join(root, 'test-results', '67js');
fs.mkdirSync(out, { recursive: true });
const server = spawn(process.execPath, ['server/server.mjs'], { cwd: root, env: { ...process.env, PORT: '' + port, HOST: '127.0.0.1', DATA_DIR: data }, stdio: 'pipe' });
let log = ''; server.stderr.on('data', d => { log += d; });
let browser;
try {
  for (let i = 0; i < 60; i++) { try { if ((await fetch(`http://127.0.0.1:${port}/api/health`)).ok) break; } catch {} await new Promise(r => setTimeout(r, 100)); }
  browser = await chromium.launch({ headless: true });
  for (const id of ids) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 500)); });
    await page.goto(`http://127.0.0.1:${port}/games/${id}/index.html?auto=1`, { waitUntil: 'load' });
    await page.waitForFunction(() => !!window.__arcadeEnv, null, { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(1500);
    const result = await page.evaluate(() => { const e = window.__arcadeEnv; return e ? { frame: e.frame, fps: Math.round(e.fps), error: e.error, status: document.querySelector('#status').textContent, renderer: e.canvas.getContext('webgl2')?.getParameter(e.canvas.getContext('webgl2').VERSION) } : { loading: document.querySelector('#loading').textContent }; });
    await page.screenshot({ path: path.join(out, id + '-probe.png') });
    console.log(JSON.stringify({ id, ...result, errors }));
    if (errors.length || !result.frame || result.error) process.exitCode = 1;
    await page.close();
  }
} catch (e) { console.error(e, log); process.exitCode = 1; }
finally { await browser?.close(); server.kill('SIGTERM'); }
