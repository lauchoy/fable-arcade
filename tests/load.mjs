/* Capacity test for the "up to 100,000 people" requirement: one HTTP progress
   sync per distinct player code, then return visits, then aggregate reads.
   Run: npm run test:load   (or LOAD_PLAYERS=10000 npm run test:load) */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PORT = Number(process.env.LOAD_PORT || 8092);
const BASE = `http://127.0.0.1:${PORT}`;
const N = Number(process.env.LOAD_PLAYERS || 100000);
const CONCURRENCY = Number(process.env.LOAD_CONCURRENCY || 48);
const DATA = process.env.LOAD_DATA || '/tmp/fable-arcade-load-data';
const GAME_IDS = ['delphi', 'tile-river', 'tarn', 'comb', 'many-hands', 'the-seed', 'fast-lens',
  'crystal-tumbler', 'cork-gallery', 'shareware-1996', 'under-the-glass', 'box-fort', 'breakwater'];
fs.rmSync(DATA, { recursive: true, force: true });
const server = spawn(process.execPath, ['server/server.mjs'], {
  cwd: ROOT, env: { ...process.env, PORT: String(PORT), DATA_DIR: DATA, HOST: '127.0.0.1' },
  stdio: ['ignore', 'pipe', 'pipe']
});
let serverLog = '';
server.stdout.on('data', d => { serverLog += d; });
server.stderr.on('data', d => { serverLog += d; });
function code(n) { return 'P' + n.toString(36).toUpperCase().padStart(15, '0'); }
function docFor(id, n) {
  const now = Date.now();
  const game = GAME_IDS[n % GAME_IDS.length];
  return {
    v: 1, playerId: id, updatedAt: now,
    games: { [game]: { plays: 3 + (n % 4), best: 250 + (n * 37) % 9000, stars: 1 + (n % 3), completed: true,
      checkpoints: ['opened', 'halfway'], seconds: 40 + n % 120, lastPlayed: now } },
    achievements: []
  };
}
async function health() {
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch(BASE + '/api/health')).ok) return; } catch (e) { /* waiting */ }
    await new Promise(r => setTimeout(r, 100));
  }
  throw new Error('server did not start: ' + serverLog);
}
function progress(label, done, total, t0) {
  if (done % Math.max(1, Math.floor(total / 5)) === 0 || done === total)
    console.log(`  ${label}: ${done.toLocaleString()}/${total.toLocaleString()} (${(done / ((Date.now() - t0) / 1000)).toFixed(0)} req/s)`);
}
let writes = 0, reads = 0, errs = 0;
try {
  await health();
  console.log(`THE THIRTEEN — capacity test: ${N.toLocaleString()} distinct player codes, ${CONCURRENCY} concurrent clients\n`);
  const t0 = Date.now();
  const writers = Array.from({ length: CONCURRENCY }, (_, k) => (async () => {
    for (let n = k; n < N; n += CONCURRENCY) {
      const id = code(n);
      try {
        const res = await fetch(`${BASE}/api/progress/${id}`, {
          method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(docFor(id, n))
        });
        await res.arrayBuffer();
        if (!res.ok) errs++;
      } catch (e) { errs++; }
      writes++;
      progress('writes', writes, N, t0);
      void k;
    }
  })());
  await Promise.all(writers);
  const writeSeconds = (Date.now() - t0) / 1000;
  // Return visits: a fifth of the players come back and GET their record.
  const M = Math.max(1000, Math.floor(N / 5));
  const t1 = Date.now();
  const readers = Array.from({ length: CONCURRENCY }, (_, k) => (async () => {
    for (let n = k; n < M; n += CONCURRENCY) {
      try { const res = await fetch(`${BASE}/api/progress/${code(n)}`); await res.arrayBuffer(); if (!res.ok) errs++; }
      catch (e) { errs++; }
      reads++;
      progress('reads', reads, M, t1);
    }
  })());
  await Promise.all(readers);
  const readSeconds = (Date.now() - t1) / 1000;
  const stats = await (await fetch(BASE + '/api/stats')).json();
  const board = await (await fetch(BASE + '/api/leaderboard')).json();
  const files = fs.readdirSync(DATA).map(f => ({ f, bytes: fs.statSync(path.join(DATA, f)).size }));
  const totalBytes = files.reduce((a, b) => a + b.bytes, 0);
  const report = {
    players: N, writes, reads, errors: errs,
    writeSeconds, readSeconds,
    writeRate: writes / writeSeconds, readRate: reads / readSeconds,
    stats, leaderboardRows: board.rows.length,
    databaseBytes: totalBytes, files
  };
  console.log('\nRESULT ' + JSON.stringify(report, null, 2));
  console.log(`\nSimulated ${N.toLocaleString()} players: ${writes.toLocaleString()} PUTs at ${report.writeRate.toFixed(0)} req/s, ` +
    `${reads.toLocaleString()} GETs at ${report.readRate.toFixed(0)} req/s, ${errs} errors.`);
  console.log(`Players stored: ${stats.players.toLocaleString()} · completions: ${stats.completions.toLocaleString()}`);
  if (errs || stats.players !== N || stats.completions !== N) {
    console.error('Capacity test FAILED'); process.exitCode = 1;
  }
} catch (e) {
  console.error('load test error', e); process.exitCode = 1;
} finally {
  server.kill('SIGTERM');
}
