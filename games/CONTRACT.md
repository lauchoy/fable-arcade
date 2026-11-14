# 67.js game contract

Each game has `index.html`, an ES-module `game.js`, and `scene.json`.
The scene must come from the 67.js MCP tools. Keep its review image and receipt.
Use `scripts/scene-recipes.mjs` to prepare authoring inputs outside the MCP job store.

## Runtime

Import `boot` from `../shared/scene-runtime.js` and pass the game ID and initializer.
The runtime fetches the same-origin recipe. It uses the local engine in `assets/67js`.
It owns rendering, input, resize, the clock, audio controls, and progress.
Do not call the old Canvas `Arcade.boot` or the old raycaster.

The initializer gets `e`. Set `e.update = dt => { ... }`.
Use `e.state` for game state. Use `e.t` for animation.
Use `e.set`, `e.scale`, `e.rotate`, and `e.hide` to change scene nodes.
Scales passed to `e.set` are absolute. `e.scale` multiplies the authored scale.
Hidden parts stay in the renderer at a small scale so they can be revealed later.
`e.point` adds parent translations only. It is not a full world-transform helper.
Do not use it for rotated or scaled parent chains.

Use `e.camera = {eye, target, fov}` for the camera.
Use `e.project(worldPoint)` for pointer targets in CSS pixels.
Use `e.keys`, `e.pressed`, and `e.pointer` for input.
Use `e.button`, `e.range`, `e.panel`, `e.status`, and `e.hint` for the UI.
Use touch controls for actions that need held keys or mouse buttons.

## Progress and sound

`e.mark(key, points)` records one milestone. Repeated keys add no score.
`e.finish()` records one completion and shows the end card.
Both use the existing SDK and its parent-window messages.
Sound stays off until the player enables it.
Use `e.sound` or `Arcade.sound`; do not start another AudioContext.

## Test URLs

- `?auto=1` must complete through the normal game rules. Never force a win after a timeout.
- `?t=4.2` freezes the clock. Do not record progress from frozen frames.
- `?seed=7` selects the puzzle seed.
- Product scenes support `?view=1` through `?view=4`.
- The computer supports `?os=1&app=Sprite`, plus its other seven program labels.
- World scenes support `?state=area2` or `?state=area3`.
- World photo views are `wide`, `vehicle`, and `soldier`. Some fit only Breakwater.

The exported JSON `game` field is a minimal MCP web-export contract.
Custom modules implement the actual game rules. Do not describe them as JSON-only gameplay.

## Quality and checks

Keep the 13-game complexity order. Use invented names and short, active sentences.
Keep one idea in each sentence. Use common words and no filler.
Do not add remote runtime scripts or send player data to other services.

Run `npm run check`, `npm run test:copy -- --strict`, and `node tests/scene-logic.mjs`.
Run browser checks through the real game entries. Check actual input, completion,
frozen frames, mobile layout, and host sync. Check parts that start hidden.
Software rendering results are not real-GPU performance claims.
