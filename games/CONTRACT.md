# Game contract (read this before writing any game)

Each build lives in `games/<id>/` and has exactly two files: `index.html` and `game.js`.
`index.html` is a small classic-script page:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <title>...</title>
</head>
<body>
  <script src="../../assets/sdk.js"></script>
  <!-- for World-tier FPS games only: -->
  <!-- <script src="../shared/raycaster.js"></script> -->
  <script src="./game.js"></script>
</body>
</html>
```

`game.js` is one classic script (no `import`, no modules, no build step). Wrap it in an IIFE with `'use strict'`. It must pass `node --check game.js`. There are **no network requests** in a game: no CDN, no fonts, no images, no fetch. All picture and sound are made in code. Original invented names only.

## Boot

```js
var env = Arcade.boot({
  id: 'tile-river',                 // must be exactly this game's folder name
  title: 'The tile river',
  hint: 'Click a tile to turn it.  U undo, H hint.',
  background: '#f2eee4',            // canvas clear colour
  ink: '#173d6b',                   // colour of the SDK HUD text
  scroll: false,                    // true = wheel / touch-drag changes env.s
  sections: 1,                      // number of scroll chapters when scroll:true
  onFrame: function (ctx, env) { /* all drawing */ }
});
```

`onFrame(ctx, env)` runs once per animation frame. `ctx` is a CanvasRenderingContext2D in **CSS pixels** (device pixel ratio and dynamic resolution scaling are handled by the SDK). Never call `requestAnimationFrame` yourself.

### env fields

| field | meaning |
| --- | --- |
| `w`, `h` | CSS pixel size of the window |
| `t` | seconds since load, or the frozen `?t=<seconds>` value |
| `dt` | seconds since last frame, 0 when frozen |
| `frame` | frame counter |
| `frozen` | `?t=` was given; draw the exact same frame at that time |
| `attract` | true until the first input, and always true with `?auto=1` |
| `started` | true after the first input |
| `auto` | `?auto=1` - the bot must play a complete run |
| `state` | `?state=<name>` - jump to a named state (start of an area, end screen, ...) |
| `view` | `?view=<name>` or `?view=<1-4>` - select a composed camera/state |
| `s` | normalised scroll 0..1 (`?s=` sets it) |
| `section` | current chapter index from `sections` |
| `seed` | `?seed=<n>` (default 2026) |
| `rand` | seeded PRNG function `() -> [0,1)`; use it for repeatable art |
| `rng`, `clamp`, `lerp`, `smooth`, `noise2`, `hash` | helpers |
| `gfx` | drawing helpers (see below) |
| `sound` | audio helper object (see below) |
| `input` | input state (see below) |
| `fps` | smoothed measured frame rate |

Draw every frame as a pure function of `env.t` where practical so `?t=` really freezes a moment. A game must look alive from the first frame with no input (idle attract motion), and react to pointer or keyboard in the first second of input.

### input

```
env.input.isDown('KeyW')            // held key by KeyboardEvent.code
env.input.justPressed('Space')      // pressed this frame only
env.input.mouse                     // {x,y,left,right,inside,dragX,dragY,wheel}
env.input.consumeClicks()           // -> [{x,y,button,right,released,pointerType}] and empties the queue
env.input.consumeLook()             // -> {x,y} pointer-lock/right-drag look deltas and resets them
env.input.consumeWheel()            // -> deltaY accumulated this frame
Arcade.lockPointer()                // request pointer lock (FPS games on first click)
```

Pointer down **and** pointer up are queued as clicks (`released:true` on up), so charge-to-fire mechanics work. Right-drag and pointer lock both feed `consumeLook()`. Arrow keys are also available (`ArrowLeft` etc.).

### drawing helpers: `env.gfx` / `Arcade.gfx`

`rr(ctx,x,y,w,h,r)` rounded rect path; `linear(ctx,x0,y0,x1,y1,[[0,color],[1,color]])`; `radial(...)`; `vignette(ctx,w,h,strength)`; `grain(ctx,w,h,alpha)` cached film grain; `paintStroke(ctx,[[x,y],...],color,width,seed,{passes,jitter,alpha})` hand-painted brush strokes; `glow(ctx,x,y,r,color)`; `spark(ctx,x,y,r,color,rot)`; `letterbox(ctx,w,h,color)`; `copyText(ctx,text,x,y,size,color,{family,weight,align,tracking})`; `offscreen(w,h,draw)` returns a cached canvas you can draw every frame (use it for textures and static art).

### sound

Sound starts muted and the SDK draws an "Enable sound" button. Never create an AudioContext before that click. Use only:

```
Arcade.sound.tone({freq:440,dur:.15,type:'sine',gain:.12,slideTo:220,pan:0,delay:0});
Arcade.sound.noise({dur:.12,gain:.1,freq:1800,filter:'lowpass',delay:0});
Arcade.sound.chord([220,277,330], .5, .08);
Arcade.sound.enabled                     // bool
```

All calls silently no-op while muted, so the picture must be complete with sound off.

### progress (this is how the arcade tracks a player)

```
Arcade.mark(id, 'checkpoint-name');          // optional milestones, unique keys
Arcade.score(id, 1250);                      // running best score
Arcade.finish({                              // exactly once per completed run
  score: 1250, stars: 2,
  title: 'Machine cleared',
  lines: ['Score 1250', 'Time 61s']          // shown on the end card
});
```

`Arcade.finish` writes the completion to localStorage, posts it to the host iframe, and shows the end card with "Play again" and "Back to arcade". Do not call `Arcade.complete` directly unless you draw your own end screen. `Arcade.toast('...')` shows a brief message. `Arcade.end({title,stars,lines})` shows a custom end card without writing progress.

### supported URLs (implement the ones listed for your game)

`?auto=1` bot playthrough **must reach the end screen**, `?seed=<n>` repeatable, `?state=<name>` jump to a named state, `?view=<name|1-4>` camera/state, `?t=<seconds>` freeze, `?s=<0..1>` scroll position. A bot may use a scripted route but must visibly move and shoot; if the route stalls, finish the run anyway so the attract loop always proves the game is completable.

## World-tier FPS games only

Load `../shared/raycaster.js` after the SDK and call `Raycaster.boot(opts)` (do **not** also call `Arcade.boot`). It creates the canvas, handles WASD movement with circle-vs-grid collision, pointer lock / right-drag / arrow-key look, fog, a wall depth buffer, sorted billboard sprites, and firing. The game supplies the world and the rules:

```js
var st = Raycaster.boot({
  id: 'under-the-glass', title: 'Under the glass', hint: '...',
  map: '111111111\n100000001\n100200001\n111111111',  // digits only: 0 empty, 1-9 wall types
  wall: { 1: { solid:true, tex: tex1, height:1, color:'#53422f' },
          2: { solid:true, tex: tex2, emissive:'#e0692f' } },  // or wall: function(v,x,y){ return {...}; }
  textures: {},                          // optional: {1:canvas,...}; wall.tex overrides
  spawn: { x:2.5, y:2.5, angle:0 },
  sky: function(ctx,env,st){...},         // optional; defaults to a sky/floor gradient
  fogColor:'#1a1218', fogNear:2, fogFar:17,
  reflect: 0.25,                          // 0..1 mirrored wall reflection under the horizon
  fire:'click',                          // 'click' | 'charge' | 'auto'
  cooldown:0.28, chargeTime:1.1,
  onInit: function(st,env){},
  onUpdate: function(st,env,dt,ctx){},    // projectiles, enemies, objectives
  onFire: function(st,env,power){},       // spawn shot; power 0.12..1 for charge mode
  onWeapon: function(ctx,env,st){},       // first-person object, lower right
  onHud: function(ctx,env,st){},          // score, lives, objective (left)
  onFx: function(ctx,env,st){},           // flashes, particles over the world
  onBot: function(st,env){ return {f:1,s:0,angle:0,fire:false}; }
});
```

`st` fields you can use or change: `x,y,angle,pitch,vx,vy,bob,moving,recoil,charge,charging,score,lives,time,sprites,zbuffer,env,fireCooldown,reflect,fogNear,fogFar`. `st.sprites` is an array (or a function returning one) of billboards:

```js
{ x:4.2, y:3.1, size:0.7, lift:0.5, hidden:false,
  draw:function(ctx,cx,cy,size,dist,sp){ /* centered at cx,cy; size is on-screen height */ } }
```

`Raycaster.guide(st,tx,ty)` returns `{angle,diff,dist}` for aiming a bot.
`Raycaster.solidAt(st.world,x,y)` and `Raycaster.cellAt(st.world,x,y)` are collision/map helpers.
Make wall textures with `Arcade.gfx.offscreen(w,h,fn)`; 64-256 px tall, tiled per column.

## Copy style for all text the player sees

Write short sentences. Put one idea in each sentence. Use the active voice. Use plain common words. Do not use metaphors, idioms, slang or filler words. Write controls as short instructions, for example: "Click a tile to turn it. Press U for undo." A title can be a short noun phrase. Keep proper names and technical terms such as "WebAudio", "Canvas 2D" and "pointer lock". Say "game", not "machine". Say "order by complexity", not "ladder".

This rule applies to hints, captions, section headings, end-card text, oracle answers, invented labels and HUD text. It does not apply to code identifiers.

## Quality bar

- One physical medium and one palette per game, obeyed in every pixel. Use the palette in `assets/manifest.js` for your game.
- Invented names, sentence-case real copy, no emoji, no lorem ipsum, no copied brands or characters.
- Distinct silhouettes, light and texture: layered gradients, glaze/paper/grain, contact shadows, glow, depth. No bare rectangles as "art".
- Scale all layout off `env.w`/`env.h`; the game must still read at 390 px wide and at 1920x1080.
- Cache expensive art in offscreen canvases. Cap particle counts. Target 60 fps.
- Do not edit anything outside your own `games/<id>/` folder.
