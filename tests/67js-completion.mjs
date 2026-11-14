import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ids } from '../scripts/scene-recipes.mjs';
const root = path.resolve(import.meta.dirname, '..'), port = 8097;
const data = fs.mkdtempSync(path.join(os.tmpdir(), 'fable-completion-'));
const server = spawn(process.execPath, ['server/server.mjs'], { cwd: root, env: { ...process.env, PORT: String(port), HOST: '127.0.0.1', DATA_DIR: data }, stdio: 'pipe' });
let browser;
try {
  for (let i = 0; i < 60; i++) { try { if ((await fetch(`http://127.0.0.1:${port}/api/health`)).ok) break; } catch {} await new Promise(r => setTimeout(r, 100)); }
  browser = await chromium.launch({ headless: true });
  for (const id of process.argv.slice(2).length ? process.argv.slice(2) : ids) {
    const page = await browser.newPage({ viewport: { width: 640, height: 480 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(`http://127.0.0.1:${port}/games/${id}/index.html?auto=1`);
    await page.waitForFunction(() => window.__arcadeEnv, null, { timeout: 25000 });
    await page.waitForFunction(() => window.__arcadeEnv.done || window.__arcadeEnv.error, null, { timeout: 60000 }).catch(() => {});
    const result = await page.evaluate(() => {
      const e = window.__arcadeEnv;
      return { done: e.done, error: e.error, frame: e.frame, simulationSeconds: e.t, fps: e.fps, status: document.querySelector('#status').textContent,
        marks: e.state.marks, player: e.state.player, enemies: e.state.enemies?.map(n => n.hp), vehicleHp: e.state.vehicleHp };
    });
    console.log(JSON.stringify({ id, ...result, errors }));
    if (!result.done || result.error || errors.length) process.exitCode = 1;
    await page.close();
  }
} finally { await browser?.close(); server.kill('SIGTERM'); }
