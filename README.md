# The Thirteen

Thirteen browser games, in order of complexity, with anonymous progress tracking.
The current rebuild uses **67.js 0.19.0** and scenes authored through its MCP tools.
The original Canvas build remains in Git at `d0af75e`.

## Run

Use Node 22 or newer, with `node:sqlite`.

```sh
npm start
# http://localhost:8080
```

The runtime engine is vendored in `assets/67js`. Playing needs no npm install or build step.
Use `npm install` for authoring and tests. Install Chromium with `npx playwright install chromium`.

## Games

The order follows the source prompt budgets and controls.
The costs below belong to the source bundle. They are not costs of this rebuild.

| Rank | Source | Game | Source budget | Source cost | Current objective |
| ---: | ---: | --- | ---: | ---: | --- |
| 1 | 13 | Delphi | 45 min | $14.43 | Scan three marks and ask three questions |
| 2 | 12 | The tile river | 60 min | $14.00 | Join the river on six walls |
| 3 | 10 | Tarn | 90 min | $15.95 | Match three magnet strengths |
| 4 | 11 | Comb | 90 min | $20.14 | Guide honey into the jar |
| 5 | 7 | Many hands | 110 min | $17.00 | Send eight helpers to work |
| 6 | 8 | The seed | 110 min | $23.31 | Help a tree through five seasons |
| 7 | 5 | The fast lens | 110 min | $27.13 | Focus the ray fan and open the section |
| 8 | 6 | The crystal tumbler | 110 min | $35.53 | Match three light angles |
| 9 | 2 | The cork gallery | 150 min | $11.39 | Hit fifteen plates |
| 10 | 9 | Shareware, 1996 | 150 min | $37.62 | Draw, play, and print a sprite |
| 11 | 1 | Under the glass | 150 min | $33.18 | Drop targets and hold three rings |
| 12 | 3 | The box fort | 150 min | $33.55 | Clear box bots across three areas |
| 13 | 4 | Breakwater | 210 min | $103.11 | Capture three points with a launcher and smoke |

## Architecture

- `games/<id>/scene.json`: canonical MCP scene exports.
- `scripts/scene-recipes.mjs`: reproducible authoring inputs. These go in `test-results/recipes`, not the private MCP job store.
- `assets/scene-builds.json`: authoring receipts. `assets/scenes` holds review images and host card pictures.
- `games/shared/scene-runtime.js`: `Renderer67`, scene updates, input, DOM controls, and the animation clock.
- Other shared modules implement distinct game rules. The JSON `game` sections are minimal export contracts, not the full gameplay.
- `assets/sdk.js`: existing audio and progress methods. The new games do not use its old Canvas boot path.
- `assets/67js`: local browser engine, license, and third-party notices.
- `server/server.mjs`: unchanged Node HTTP server and SQLite WAL progress store.

All game modules and scenes load from the same origin. There is no runtime engine CDN.
The host requests Google Fonts. Sound stays off until the player enables it.
The server serves the game files directly. No bundler is needed.

### Authoring

The npm alias is `67js@npm:@codepawlhq/67js`.
Read [the engine guide](https://67js.codepawl.com/llms.txt) before changing scenes.
Use `npx 67js-mcp` with an absolute jobs path and a working browser.
This machine uses a user-level Factory MCP connection and Playwright Chromium.

The authoring loop is create, inspect, apply, look, export, dispose.
All 13 scenes first used `scene_export_web`. Six revised scenes use `scene_export_recipe`.
The web exporter then hit a job-store initialization error. Receipts record that limit.
The local engine remains the same installed 0.19.0 build.

### Progress API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Health and player count |
| GET, PUT | `/api/progress/:code` | Restore or merge progress |
| GET | `/api/stats` | Aggregate progress |
| GET | `/api/leaderboard` or `/api/leaderboard/:game` | Top scores |

Each player has a random 16-character restore code. Treat it as a bearer secret.
There are no accounts or email addresses. Records include scores, stars, plays, milestones, and completion.
The server caps documents at 32 KB. It accepts known game IDs and clamps numbers.
The last write wins by timestamp. Record scores and stars cannot decrease.
Scores come from the browser. Do not use this service for prize competitions.

### Capacity and hosting

Static files can use a CDN. The new engine adds about 4 MB before compression, plus scene data and images.
The old few-hundred-KB estimate no longer applies.
Run the API on a persistent Node host with a writable volume. Set `PORT` and `DATA_DIR`.
SQLite uses one process. It is not a multi-region or highly available service.
Vercel can host the frontend with an API rewrite. Its ephemeral filesystem cannot hold this SQLite service.
No deployment has been performed.

The fresh 2026-11-13 load test stored 100,000 player records with zero errors.
It measured 100,000 writes in 7.914 seconds, about 12,636 per second.
It measured 20,000 reads in 0.646 seconds, about 30,960 per second.
SQLite, WAL, and shared-memory files totaled 44,719,752 bytes.
These measurements used local loopback and 48 concurrent clients.
Those numbers are not proof of 100,000 simultaneous active players or production capacity.
Run `npm run test:load` for a fresh backend measurement.

```sh
docker build -t the-thirteen .
docker run -p 8080:8080 -v "$(pwd)/data:/app/data" the-thirteen
```

## Validation

```sh
npm run check
npm run test:copy -- --strict
node tests/scene-logic.mjs
npm run test:probe
npm run test:completion
npm run test:smoke
npm run test:e2e
npm run test:load
```

Browser tests launch throwaway local servers and SQLite data.
The probe saves screenshots in `test-results/67js`. The E2E suite saves them in `/tmp/fable-arcade-shots`.
See `HANDOFF-67JS.md` for the latest verified results and unresolved work.
Do not use the original Canvas validation results as evidence for this rebuild.

The rebuilt browser suite passed 14/14 checks: 13 game completions with real input,
plus host sync and restore. All 13 frozen-frame and 390px checks passed.
The computer's seven programs passed at 320px. Focused reruns passed after the
final sprite-print, tile framing, and touch-control layout fixes.
Static checks and the strict copy audit passed with zero flags.

## Test URLs

- `?auto=1`: play through the normal rules with a bot.
- `?t=4.2`: freeze the animation clock without recording progress.
- `?seed=7`: select the puzzle seed.
- `?view=1` through `?view=4`: product camera views.
- `?os=1&app=Sprite`: open the computer's sprite program.
- `?state=area2` or `?state=area3`: world scene starting area.
- `?view=wide`, `vehicle`, or `soldier`: world photo views.

## Scope and limits

These are procedural 3D prototypes. They are not full reproductions of every source requirement.
There are no Cycles bakes, path-traced runtime scenes, or skinned soldiers.
The crystal light streaks illustrate caustics; they are not traced physical caustics.
The lens uses Snell-law rays through thirteen surfaces and seven elements.
The films use short task-driven sequences, not full-length cinematic timelines.
The river has six route puzzles. The named bridge, lock, whirlpool, and two-face levels do not yet implement all distinct source mechanics.
Product pages do not contain every source section. The gallery uses fifteen plates, not the full source round and prize mechanisms.
The squad uses procedural animation, not tactical cover AI.

MCP reviews use SwiftShader software rendering. They do not establish real-GPU frame rates.
The UI uses short sentences, active voice, and common words, targeting about 80% ASD-STE100 style.
The copy audit is a heuristic, not a language certification.

Source prompts: Nick Saraev's `fable-5-2-demo-prompts-and-costs.zip`.
All game names, places, and characters are invented for this project.
