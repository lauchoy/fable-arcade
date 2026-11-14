# 67.js redevelopment handoff

Validation checkpoint: 2026-11-13. The user subsequently authorized a commit and push.
See Git history for publication state. No deployment has been performed.
No live session quota meter is available. Exact 5% scheduling is not possible here.

## Request and architecture

Rebuild all 13 games using 67.js scenes authored through MCP.
Preserve the complexity order, host, anonymous progress service, and short active copy.
Installed `67js@npm:@codepawlhq/67js` at 0.19.0.
The user-level Factory MCP connection uses Playwright Chromium and SwiftShader.
Read the engine's `llms.txt` and installed docs before authoring.

All 13 entry pages now use ES modules and the shared WebGL2 runtime.
`Renderer67` and `createAgentScene` render the canonical `scene.json` files.
Distinct shared modules implement gameplay, not the minimal JSON export game rules.
The unchanged SDK supplies public audio and progress methods. Do not use its Canvas boot.
The unchanged Node/SQLite service supplies sync, restore, stats, and leaderboard.
The original Canvas code remains at Git commit `d0af75e`.

## MCP evidence

- All scenes were created, inspected, edited, reviewed, and exported through the actual MCP connection.
- Canonical recipes: `games/<id>/scene.json`.
- Review images and host cards: `assets/scenes/<id>.png`.
- Receipts: `assets/scene-builds.json`.
- Reproducible authoring inputs: `scripts/scene-recipes.mjs`.
- Vendored local engine and licenses: `assets/67js`.
- Six revised scenes use `scene_export_recipe`. Initial scenes used `scene_export_web`.
- The MCP web exporter has a cached initialization failure: `Foreign store entry: recipes`.
  The offending generated folder was moved out of `.67js-jobs`.
  Scene creation, inspection, editing, review, recipe export, and disposal still work.
  A server reconnect may be needed before another web export.
- No active scene remains.

## Fixes completed

- All entries load the new runtime. No old raycaster is used.
- Renderer samples must be 1, not 0.
- Delphi bot scans directly rather than queuing clicks that the runtime clears.
- Lens scene now has 13 rays with 16 segments each, matching the optics module.
- Initially hidden nodes stay in the renderer at tiny scale. Reveals now work for pipe bends, projectiles, and printed dots.
- Swept AABB checks stop fast bullets at walls. Shots above cover remain possible.
- Shooter bots now walk past cover before firing sideways. No forced-win fallback is used.
- Product view numbers are clamped.
- Computer tokens scale within narrow screens.
- Label and listing prints no longer satisfy the sprite-print objective.
- Frozen frames do not record play starts or milestones.
- Host cards use MCP images. Manifest controls and technology labels describe the rebuild.
- Static checks, copy audit, E2E tests, game contract, and README were adapted.
- Mobile touch controls no longer cover the status dock.
- The tile canvas reserves space for controls. Its camera fits the whole board on narrow screens.

## Verified checks so far

- `npm run check`: 13 games, zero errors or warnings.
- `npm run test:copy -- --strict`: zero flags across 37 files.
- `node tests/scene-logic.mjs`: 24 river starts/solutions, wall collision and sweeps, known optics focus and iris.
- `npm run test:probe`: all 13 boot in WebGL2, no browser errors.
- First full bot completion run: 13/13 completed with zero errors.
  These results preceded the final wall-sweep and hidden-part fixes.
- `npm run test:smoke`: host cards, MCP posters, progress drawer, sync, newer write, stats, leaderboard, and mobile host passed.
- First adapted full E2E run: 11/14 passed. Crystal input used an invalid exact slider comparison.
  Box-fort and Breakwater bots fired into cover after wall collision became correct.
  All sampled frozen/mobile checks and host/API/restore passed.
- Focused rerun after those fixes: crystal, box-fort, and Breakwater all passed completion and actual input.

## Final verification

- The full E2E run passed 14/14 checks: completion and actual controls for all 13, plus host/API/restore.
  All 13 frozen-frame and 390px checks passed.
  Real held touch input moved the player in all three shooter scenes.
  Authored hidden parts were present in the renderer.
- `node tests/computer-programs.mjs` passed all seven programs at 320px.
  It covers repeated label/listing/sprite prints and confirms only a sprite satisfies the objective.
- Final Shareware E2E rerun passed completion, input, frozen frames, and mobile.
- After layout fixes, a four-game rerun passed for tile-river and all three shooters.
- A final tile rerun passed after narrow-screen camera fitting.
  It tapped all four corner tiles through actual touch input and confirmed four moves.
- Reviewed final screenshots: tile board and bend pipes are visible; all mobile corner tiles fit;
  shooter touch buttons do not cover status; completion overlays remain usable.
- Fresh capacity run: 100,000 stored players, 100,000 writes, 20,000 reads, zero errors.
  Writes took 7.914 seconds (12,636/s); reads took 0.646 seconds (30,960/s).
  SQLite/WAL/shared-memory total: 44,719,752 bytes.
  Local loopback, 48 concurrent clients. This is not a production or concurrent-player guarantee.

## Optional follow-up and unresolved limits

No validation job remains running. No known tested-gameplay failure remains.
The feature gaps below remain if full source-prompt parity is required.
The MCP web-export store issue still needs a server reconnect before another web export.
No real-GPU performance test, Docker build, or production deployment ran.
Full E2E screenshots remain in `/tmp/fable-arcade-shots`; the most recent targeted run
overwrites `report.json`, so that file is not the aggregate full-run report.

## Honest limits

These are procedural 3D prototypes, not full source-prompt reproductions.
There are no Cycles bakes, runtime path tracing, skinned soldiers, or tactical squad cover AI.
Crystal streaks illustrate caustics; they are not physically traced caustics.
The films are short task-driven sequences, not full-length source timelines.
The river has six route puzzles but not all distinct bridge/lock/whirlpool/two-face rules.
Product pages and the gallery omit some source sections and mechanisms.
Software-rendered review images do not prove real-GPU performance.
Loopback API results do not prove 100,000 simultaneous active players.
The copy audit is a heuristic, not ASD-STE100 certification.

## Commands and paths

Repository: `/Users/jimmy/development/fable-arcade`.

```sh
npm start
npm run check
npm run test:copy -- --strict
node tests/scene-logic.mjs
node tests/computer-programs.mjs
npm run test:e2e
node tests/e2e.mjs --game=shareware-1996
npm run test:load
```

E2E screenshots and report: `/tmp/fable-arcade-shots`.
Probe screenshots: `test-results/67js`.
Do not overwrite unrelated user changes or commit/push without a request.
