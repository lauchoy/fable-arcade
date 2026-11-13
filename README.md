# The Thirteen

This site has **13 browser games**. We built one game from each prompt in the [Fable 5.2 demo prompts and costs](../../Downloads/fable-5-2-demo-prompts-and-costs.zip) bundle. The site tracks each player's progress. We built the games in **order of complexity**. We started with the simplest game.

The source bundle has 13 prompts. They describe first-person shooters in a pinball table and a cardboard fort. They also describe a harbour-town mission, two glass renders, two films, three pages, a 1996 computer room, a shooting gallery and a tile puzzle. Each prompt gives a time budget (45 to 210 minutes). Each prompt gives an API-token cost ($11 to $103). Each prompt lists the tools used in its source run.

## What is here

Every game runs in one browser page. Each game has an invented name. Each game has an attract mode. Each game has one clear objective. WebAudio makes all sound. Sound stays off until you enable it. The site records each completion. Three source builds are films. Four are landing pages. We made them **interactive** here. You calibrate a scanning light. You tend a tree. You focus a ray fan. Progress then means the same thing in all 13 games. Code makes all pictures and all sound.

**Scope.** The source prompts ask for Blender Cycles light bakes, WebGL2 path tracers, skinned soldiers and 6 to 8 art-direction rounds for each build. We did not do that work here. We used Canvas 2D instead. Each game keeps the prompt's subject, medium, mechanics, controls, structure, invented names and progression. The pictures are drawn in code. They are not photographs. They are not path-traced stills. The three largest games share one texture-mapped raycaster with billboard sprites. This design lets one static site serve 100,000 players.

## Order by complexity

We set the order from each source prompt. We read its time budget, its improvement rounds, its tools and its controls. The tools progress from plain Canvas to fluid renders, a working computer room, a baked level and a large battle. Source time budgets do not decrease.

| Rank | Source no. | Game | Tier | Source budget | Source cost | Added difficulty ||
| ---: | ---: | --- | --- | ---: | ---: | --- |
| 1 | 13 | Delphi | I Simple | 45 min | $14.43 | One page, one scan |
| 2 | 12 | The tile river | I Simple | 60 min | $14.00 | A solvable puzzle across 6 walls |
| 3 | 10 | Tarn | II Medium | 90 min | $15.95 | Ferrofluid field + scroll chapters |
| 4 | 11 | Comb | II Medium | 90 min | $20.14 | Viscous thread + scroll chapters |
| 5 | 07 | Many hands | II Medium | 110 min | $17.00 | Deterministic film + 8-job state |
| 6 | 08 | The seed | II Medium | 110 min | $23.31 | Deterministic seasons + growing tree |
| 7 | 05 | The fast lens | II Medium | 110 min | $27.13 | Snell's-law ray fan through 7 elements |
| 8 | 06 | The crystal tumbler | II Medium | 110 min | $35.53 | Facet caustics + light marks |
| 9 | 02 | The cork gallery | III Complex | 150 min | $11.39 | 3D-ish ballistics, 3 rounds, mechanisms |
| 10 | 09 | Shareware, 1996 | III Complex | 150 min | $37.62 | A room and a working 16-colour OS |
| 11 | 01 | Under the glass | IV Most complex | 150 min | $33.18 | Raycast FPS, bouncing balls, 3 areas |
| 12 | 03 | The box fort | IV Most complex | 150 min | $33.55 | Raycast FPS, bots with 3-stage damage |
| 13 | 04 | Breakwater | IV Most complex | 210 min | $103.11 | Wide FPS, squad AI, 3 capture points |

The site shows this order. `No.` on a card gives the source prompt number. `Rank` gives its place in the order.

## Architecture

```
browser                                  one small Node process
┌──────────────────────────────────┐      ┌─────────────────────────────┐
│ index.html    host shell / SPA   │      │ server/server.mjs           │
│   assets/host.css, host.js       │ GET  │  static files               │
│   assets/posters.js (13 cards)   │◄────►│  GET/PUT /api/progress/:id  │
│   assets/sdk.js, manifest.js     │ PUT  │  GET /api/stats             │
│                                  │      │  GET /api/leaderboard       │
│ iframe: games/<id>/index.html    │      │  node:sqlite WAL            │
│    game.js (standalone canvas)   │      │  data/progress.sqlite       │
│    postMessage progress ─────────┼─────►│                             │
│    localStorage (source of truth)│      └─────────────────────────────┘
└──────────────────────────────────┘
```

- **Gameplay runs in the browser.** Every game is two files (`index.html`, `game.js`) with no build step, no framework, no CDN, no network requests while playing. The only request the site makes is Google Fonts for the host. Game JS lives in separate files so it is easy to audit.
- **The shared SDK** (`assets/sdk.js`) owns the canvas. It caps DPR at 2 and scales resolution. It owns the animation clock and the `?t=` freeze. It makes randomness repeatable from a seed. It reads pointer lock, right-drag look, arrow keys, touch and wheel. WebAudio stays silent until you click "Enable sound". It draws the title and hint HUD. It writes all progress.
- **The shared raycaster** (`games/shared/raycaster.js`) serves the three largest games. It draws textured walls and fog. It hides sprites behind near walls. It sorts billboard sprites. It handles collision on a grid. It offers three firing modes.
- **Progress** is one small JSON document in `localStorage`. It stores `plays`, `best`, `stars`, `completed`, `checkpoints`, `seconds` and `lastPlayed` for each game. It also stores `playerId` and `updatedAt`. The game SDK is the only writer. The host reads this document and draws the new state. It shows a game in a full-screen iframe. It syncs the document to the server after 1.6 seconds. It syncs at once on completion or when the page hides.
- **The backend** is one file with zero npm dependencies. `node:http` serves static files. `node:sqlite` (WAL) holds two tables: `players` and `scores`. The API has five endpoints. We do not use accounts, email, analytics or PII. A player is a random 16-character code. That code also restores progress on another device.
- **Conflict rule.** The last write wins on `updatedAt`. The server caps timestamps that are more than one minute in the future. The server merges scores, stars and play counts with `MAX`. A stale device cannot lower a record. The API accepts only the 13 known game ids. It clamps numbers. It caps bodies at 32 KB. It limits requests per code and per IP.

### API

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | liveness + player count |
| `GET` | `/api/progress/:code` | restore a record |
| `PUT` | `/api/progress/:code` | write/merge a record (`application/json`) |
| `GET` | `/api/stats` | players, plays, completions, per-game numbers |
| `GET` | `/api/leaderboard` or `/api/leaderboard/:game` | top pseudonymous scores |

### Capacity for 100,000 players

The server does no work per player. The browser renders the game. It plays the sound. It holds the game state. A CDN serves the static files. They use a few hundred KB. A player makes one small `PUT` at each milestone and at completion. This is about 10 writes per active player per day. For 100,000 players, that is about 1,000,000 writes per day. It is about 12 writes per second on average. A few visits per player use about 10 GB to 50 GB of CDN data. `npm run test:load` measures the API on this machine. The test uses 100,000 player codes. It writes one record for each code. It then reads 20,000 records again. On this machine (Node 25, local loopback, one process), the run made 100,000 PUTs at about 14,000 requests per second and 20,000 GETs at about 33,000 requests per second. It had zero errors. The SQLite database was about 45 MB. These are local numbers. Network and CDN limits will set the real deployment rate.

For a real deployment, put the whole repo on a static CDN. Leave out `data/`, `tests/` and `node_modules/`. Run `server/server.mjs` on one small container with a persistent volume. Set `PORT` and `DATA_DIR`. If the service must run in several regions, use a managed key-value store in place of SQLite. The API contract does not change. These limits are deliberate. One process gives one point of failure. The sync code is a bearer secret, so keep it private. The server trusts scores that the browser reports. This is fine for a toy arcade. It is not fit for a prize competition.

## Run it

Requires Node 22 or newer (for `node:sqlite`). No `npm install` is needed to play.

```sh
cd fable-arcade
npm start                    # http://localhost:8080
```

```sh
npm run check                # static checks: order, 13 games, syntax, no network calls
npm run test:smoke           # quick host + API check with Chromium
npm run test:copy            # report long sentences, passive forms and metaphoric words
npm run test:e2e             # plays all 13 games in Chromium via ?auto=1 bots, checks host+API+restore
npm run test:load            # 100,000 simulated player codes against the sync API
```

The browser suite and load test need the dev dependency. Run `npm install`. For the browser suite, also run `npx playwright install chromium`. They write screenshots to `/tmp/fable-arcade-shots/` and use throwaway SQLite files in `/tmp`.

```sh
docker build -t the-thirteen .
docker run -p 8080:8080 -v "$(pwd)/data:/app/data" the-thirteen
```

## URL parameters for a game

`?auto=1` runs its attract bot through a complete run. `?seed=<n>` makes a run repeatable. `?state=<name>` jumps to an area/end screen. `?view=<name|1-4>` selects a composed camera. `?t=<seconds>` freezes the exact frame (all games draw from the SDK clock). `?s=<0..1>` sets the scroll chapter on a page. `?drag=1` enables left-drag look in Breakwater. `?os=1` and `?app=<name>` open the 1996 OS directly. Each game's `game.js` lists the names it supports.

## Validation

These checks ran on this machine. The results come from the final code.

| Check | Result |
| --- | --- |
| `npm run check` | 13 games. 0 errors. 0 warnings. |
| `npm run test:copy` | 0 flagged strings across 17 files. |
| `npm run test:smoke` | 13 cards. 13 record rows. 8 badges. 1 game cleared. Sync, stats, leaderboard and a second newer write all pass. 0 console errors. |
| `npm run test:e2e` | 13 games cleared in Chromium with 0 errors. Exact `?t=` frames on 4 sampled games. 390px checks pass. Host sync, API completion and restore pass. 14 of 14 checks pass. |
| `npm run test:load` | 100,000 player codes. 100,000 PUTs at about 14,000 requests per second. 20,000 GETs at about 33,000 requests per second. 0 errors. About 45 MB of SQLite data. |

The load test runs on local loopback. Network and CDN limits set the real rate. We did not deploy the site.

## Language

Site text uses short sentences. Each sentence has one idea. We use the active voice and plain common words. We do not use metaphors, idioms or filler words. We keep proper names and technical terms. This is about 80 percent of the way to ASD-STE100 Simplified Technical English. The rest allows short brand names, labels and normal product copy.

## Layout

```
index.html                 host shell
assets/manifest.js         the 13 games, metadata, palette, order
assets/sdk.js              game SDK: clock, input, audio, progress, HUD, gfx
assets/raycaster (games/shared/raycaster.js)
assets/host.css            host design
assets/host.js             catalog, game view, progress, sync
assets/posters.js          13 procedural card pictures
games/<id>/                index.html + game.js, one per game
games/CONTRACT.md          the API every game is written against
server/server.mjs          static files + progress API
tests/                     static, browser and capacity checks
```

Source prompts and costs: `fable-5-2-demo-prompts-and-costs.zip` by Nick Saraev. All names, brands, places, characters and copy in the games are invented for this build.
