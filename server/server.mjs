/* The Thirteen - one-file backend: static files + anonymous progress sync.
   Zero npm dependencies. Node >= 22 (node:sqlite). Run: node server/server.mjs
   There is no account, no PII and no auth: a player is a random 16-char code. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || '0.0.0.0';
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(ROOT, 'data'));
const MAX_BODY = 32 * 1024;
const GAME_IDS = new Set([
  'delphi', 'tile-river', 'tarn', 'comb', 'many-hands', 'the-seed', 'fast-lens',
  'crystal-tumbler', 'cork-gallery', 'shareware-1996', 'under-the-glass',
  'box-fort', 'breakwater'
]);
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.map': 'application/json'
};
const DENY = /^(\/(data|server|tests|node_modules|\.git)(\/|$)|\/\.|package(-lock)?\.json$|.*\.(sqlite|log)$)/i;

fs.mkdirSync(DATA_DIR, { recursive: true });
const db = new DatabaseSync(path.join(DATA_DIR, 'progress.sqlite'));
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;
  PRAGMA busy_timeout = 3000;
  CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    doc TEXT NOT NULL,
    updated_at INTEGER NOT NULL,
    synced_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS scores (
    player_id TEXT NOT NULL,
    game_id TEXT NOT NULL,
    best INTEGER NOT NULL DEFAULT 0,
    stars INTEGER NOT NULL DEFAULT 0,
    plays INTEGER NOT NULL DEFAULT 0,
    completed INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (player_id, game_id)
  );
  CREATE INDEX IF NOT EXISTS idx_scores_game_best ON scores(game_id, best DESC);
`);

const upsertPlayer = db.prepare(`INSERT INTO players (id, doc, updated_at, synced_at)
  VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET doc=excluded.doc,
  updated_at=excluded.updated_at, synced_at=excluded.synced_at`);
const getPlayer = db.prepare('SELECT doc, updated_at FROM players WHERE id = ?');
const upsertScore = db.prepare(`INSERT INTO scores (player_id, game_id, best, stars, plays, completed)
  VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(player_id, game_id) DO UPDATE SET
  best=MAX(best, excluded.best), stars=MAX(stars, excluded.stars),
  plays=MAX(plays, excluded.plays), completed=MAX(completed, excluded.completed)`);
function syncScores(id, doc) {
  // node:sqlite has no transaction helper; this whole function is synchronous,
  // so a BEGIN/COMMIT pair cannot interleave with another request's writes.
  db.exec('BEGIN');
  try {
    for (const [gameId, g] of Object.entries(doc.games)) {
      upsertScore.run(id, gameId, g.best | 0, g.stars | 0, g.plays | 0, g.completed ? 1 : 0);
    }
    db.exec('COMMIT');
  } catch (err) { db.exec('ROLLBACK'); throw err; }
}

function clampNum(v, max = 99999999) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, Math.min(max, Math.round(n))) : 0;
}
function validCode(id) { return typeof id === 'string' && /^[A-Z0-9]{8,16}$/.test(id); }
function sanitize(raw, id) {
  const src = (raw && typeof raw === 'object') ? raw : {};
  const games = {};
  const input = (src.games && typeof src.games === 'object') ? src.games : {};
  for (const gameId of GAME_IDS) {
    const g = input[gameId];
    if (!g || typeof g !== 'object') continue;
    games[gameId] = {
      plays: clampNum(g.plays, 100000),
      best: clampNum(g.best),
      stars: clampNum(g.stars, 3),
      completed: !!g.completed,
      checkpoints: Array.isArray(g.checkpoints)
        ? g.checkpoints.filter(k => typeof k === 'string').slice(0, 64).map(k => k.slice(0, 48)) : [],
      seconds: clampNum(g.seconds),
      lastPlayed: clampNum(g.lastPlayed, 4102444800000)
    };
  }
  return {
    v: 1, playerId: id, updatedAt: clampNum(src.updatedAt, 4102444800000),
    games, achievements: []
  };
}
function json(res, code, body, extra = {}) {
  const data = JSON.stringify(body);
  res.writeHead(code, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(data),
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'no-referrer',
    ...extra
  });
  res.end(data);
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => {
      size += c.length;
      if (size > MAX_BODY) { reject(new Error('too large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch (e) { reject(new Error('bad json')); }
    });
    req.on('error', reject);
  });
}

/* Tiny fixed-window rate limiter. No state beyond the current window, so it
   stays cheap even with 100k distinct player codes. */
const buckets = new Map();
let windowStart = Date.now();
function limited(key, max) {
  const now = Date.now();
  if (now - windowStart > 60000) { buckets.clear(); windowStart = now; }
  const n = (buckets.get(key) || 0) + 1;
  buckets.set(key, n);
  return n > max;
}

function api(req, res, url) {
  const parts = url.pathname.split('/').filter(Boolean); // api, progress, CODE
  const ip = req.socket.remoteAddress || 'local';
  // Loopback is exempt from the coarse per-IP cap so load tests and local
  // development are not throttled; per-code write/read caps still apply.
  const loopback = ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
  if (limited(ip + ':all', loopback ? 1000000 : 6000)) return json(res, 429, { ok: false, error: 'rate limit' });
  if (parts[1] === 'health' && req.method === 'GET') {
    return json(res, 200, { ok: true, players: db.prepare('SELECT COUNT(*) n FROM players').get().n, uptime: process.uptime() });
  }
  if (parts[1] === 'stats' && req.method === 'GET') {
    const totals = db.prepare(`SELECT COUNT(DISTINCT player_id) players, COALESCE(SUM(plays),0) plays,
      COALESCE(SUM(completed),0) completed FROM scores`).get();
    const byGame = db.prepare(`SELECT game_id, SUM(plays) plays, SUM(completed) cleared, MAX(best) best
      FROM scores GROUP BY game_id`).all();
    const games = Object.fromEntries(byGame.map(r => [r.game_id, { plays: r.plays, cleared: r.cleared, best: r.best }]));
    return json(res, 200, { ok: true, players: totals.players, plays: totals.plays, completions: totals.completed, games });
  }
  if (parts[1] === 'leaderboard' && req.method === 'GET') {
    const game = parts[2] && GAME_IDS.has(parts[2]) ? parts[2] : null;
    const rows = game
      ? db.prepare('SELECT player_id, game_id, best, stars FROM scores WHERE game_id=? ORDER BY best DESC, player_id LIMIT 10').all(game)
      : db.prepare('SELECT player_id, game_id, best, stars FROM scores WHERE best>0 ORDER BY best DESC, player_id LIMIT 12').all();
    return json(res, 200, { ok: true, rows: rows.map(r => ({
      player: r.player_id.slice(0, 4) + '…' + r.player_id.slice(-2), game: r.game_id,
      score: r.best, stars: r.stars
    })) });
  }
  if (parts[1] !== 'progress' || !parts[2]) return json(res, 404, { ok: false, error: 'not found' });
  const id = String(parts[2]).toUpperCase();
  if (!validCode(id)) return json(res, 400, { ok: false, error: 'bad player code' });
  if (req.method === 'GET') {
    if (limited(id + ':read', 300)) return json(res, 429, { ok: false, error: 'rate limit' });
    const row = getPlayer.get(id);
    // A missing record is a normal first visit, not an HTTP error: keep the
    // browser console clean for the many first-time players.
    if (!row) return json(res, 200, { ok: true, found: false, doc: null });
    return json(res, 200, { ok: true, found: true, doc: JSON.parse(row.doc), syncedAt: row.updated_at });
  }
  if (req.method === 'PUT') {
    if (limited(id + ':write', 180)) return json(res, 429, { ok: false, error: 'rate limit' });
    return readBody(req).then(raw => {
      const doc = sanitize(raw, id);
      const now = Date.now();
      // Keep the client clock value: clamping it to server time would make every
      // later write from that device look older. Cap only far-future values.
      doc.updatedAt = Math.min(doc.updatedAt, now + 60000);
      const existing = getPlayer.get(id);
      if (existing && existing.updated_at > doc.updatedAt) {
        return json(res, 200, { ok: true, doc: JSON.parse(existing.doc), newer: false, kept: 'server' });
      }
      upsertPlayer.run(id, JSON.stringify(doc), doc.updatedAt, now);
      syncScores(id, doc);
      return json(res, 200, { ok: true, doc, newer: true, syncedAt: now });
    }).catch(err => json(res, err.message === 'too large' ? 413 : 400, { ok: false, error: err.message }));
  }
  return json(res, 405, { ok: false, error: 'method not allowed' });
}

function statics(req, res, url) {
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch (e) { return json(res, 400, { ok: false, error: 'bad path' }); }
  if (pathname === '/') pathname = '/index.html';
  if (pathname === '/favicon.ico') pathname = '/assets/favicon.svg'; // no favicon 404s for top-level game pages
  if (DENY.test(pathname)) return json(res, 403, { ok: false, error: 'forbidden' });
  const file = path.resolve(ROOT, '.' + pathname);
  if (!file.startsWith(ROOT + path.sep) && file !== ROOT) return json(res, 403, { ok: false, error: 'forbidden' });
  const ext = path.extname(file).toLowerCase();
  const type = MIME[ext];
  if (!type) return json(res, 404, { ok: false, error: 'not found' });
  let st;
  try { st = fs.statSync(file); } catch (e) { return json(res, 404, { ok: false, error: 'not found' }); }
  if (!st.isFile()) return json(res, 404, { ok: false, error: 'not found' });
  res.writeHead(200, {
    'content-type': type,
    'content-length': st.size,
    'cache-control': ext === '.html' ? 'no-cache' : (ext === '.js' || ext === '.css' ? 'public, max-age=300' : 'public, max-age=86400'),
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'no-referrer',
    'content-security-policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-src 'self'; object-src 'none'; base-uri 'self'"
  });
  if (req.method === 'HEAD') { res.end(); return; }
  fs.createReadStream(file).pipe(res);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname.startsWith('/api/')) {
    try { api(req, res, url); } catch (err) { console.error('api error', err); json(res, 500, { ok: false, error: 'server error' }); }
  } else if (req.method === 'GET' || req.method === 'HEAD') {
    try { statics(req, res, url); } catch (err) { console.error('static error', err); json(res, 500, { ok: false, error: 'server error' }); }
  } else json(res, 405, { ok: false, error: 'method not allowed' });
});
server.requestTimeout = 15000;
server.headersTimeout = 20000;
server.listen(PORT, HOST, () => {
  console.log(`The Thirteen: http://localhost:${PORT}  (data: ${DATA_DIR})`);
});
function shutdown() { server.close(() => { try { db.close(); } catch (e) {} process.exit(0); }); }
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
