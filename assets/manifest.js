/* The thirteen builds, ordered by implementation complexity (easiest first).
   The order follows each prompt's time budget, its tools and its controls.
   `cost` and `minutes` are the numbers printed in the source prompt bundle.
   Site copy uses short sentences, one idea per sentence, active voice and
   plain common words. */
(function (root) {
  'use strict';
  root.ARCADE_TIERS = [
    { id: 'I', name: 'Simple', blurb: 'One page and one idea' },
    { id: 'II', name: 'Medium', blurb: 'One object with live light' },
    { id: 'III', name: 'Complex', blurb: 'A room or a round of play' },
    { id: 'IV', name: 'Most complex', blurb: 'A walkable world with moving opponents' }
  ];
  root.ARCADE_GAMES = [
    {
      id: 'delphi', original: 13, rank: 1, tier: 'I', minutes: 45, cost: 14.43,
      title: 'Delphi', subtitle: 'A marble bust and a scan',
      logline: 'A page for an invented AI lab. A scan line crosses a marble bust. You see a wireframe under the stone.',
      prompt: 'A page with research, models, principles and an oracle. The oracle answers in short sentences. The page has carved capitals and Greek key borders.',
      tech: 'Canvas 2D, procedural marble, DOM text',
      controls: 'Move the pointer to scan. Click the three marks. Ask the oracle three questions.',
      goal: 'Complete the scan. Ask three questions.',
      palette: { bg: '#efe9dc', ink: '#1d2730', accent: '#b08436', accent2: '#6f8a96' }
    },
    {
      id: 'tile-river', original: 12, rank: 2, tier: 'I', minutes: 60, cost: 14.00,
      title: 'The tile river', subtitle: 'Blue and white tiles',
      logline: 'Turn blue and white tiles. Join the river from the spring to the sea. A painted boat then sails the wall.',
      prompt: 'Six walls. Each wall teaches one tile type. The types are bridge, lock, whirlpool and two-faced. The game has undo and a hint. The attract mode solves one wall.',
      tech: 'Canvas 2D brushwork, cached tile images',
      controls: 'Click a tile to turn it. Press U for undo. Press H for a hint.',
      goal: 'Join the river on all six walls.',
      palette: { bg: '#f2eee4', ink: '#173d6b', accent: '#2f6cb0', accent2: '#d8b46a' }
    },
    {
      id: 'tarn', original: 10, rank: 3, tier: 'II', minutes: 90, cost: 15.95,
      title: 'Tarn', subtitle: 'A speaker with ferrofluid',
      logline: 'A dark page for an invented speaker. Ferrofluid rises into spikes under the pointer. The spikes follow the sound.',
      prompt: 'A page with six sections. The scroll takes the product apart. A silent pulse moves the fluid until you enable sound.',
      tech: 'Canvas 2D height field, mirror highlights, sections',
      controls: 'Move the pointer to raise the spikes. Use the arrow keys to move the field.',
      goal: 'Match three field strengths.',
      palette: { bg: '#0b0c0d', ink: '#ece9e2', accent: '#b48b45', accent2: '#7d8f96' }
    },
    {
      id: 'comb', original: 11, rank: 4, tier: 'II', minutes: 90, cost: 20.14,
      title: 'Comb', subtitle: 'Honey and a glass jar',
      logline: 'A warm page for an invented honey. A thread of honey pours into a pool. The jar turns as you scroll.',
      prompt: 'Six sections. The sections show three apiaries, a harvest table, tasting notes, sizes and a footer.',
      tech: 'Canvas 2D thread, bubbles, light',
      controls: 'Drag to guide the thread into the jar.',
      goal: 'Fill the jar to the marked line.',
      palette: { bg: '#f6ecd8', ink: '#3a2a17', accent: '#c78518', accent2: '#7a8b56' }
    },
    {
      id: 'many-hands', original: 7, rank: 5, tier: 'II', minutes: 110, cost: 17.00,
      title: 'Many hands', subtitle: 'An interactive film',
      logline: 'One small character has eight jobs. It divides into eight copies. The copies build one music box.',
      prompt: 'A toon-shaded film in a workshop. You send each copy to a job. The jobs build one music box. The copies join again at dawn.',
      tech: 'Canvas 2D toon shading, fixed timeline, WebAudio',
      controls: 'Click a note to send a copy to a job. Press Space to pause.',
      goal: 'Send all eight copies to work.',
      palette: { bg: '#25203a', ink: '#f7e9d2', accent: '#ee7b55', accent2: '#e9b45f' }
    },
    {
      id: 'the-seed', original: 8, rank: 6, tier: 'II', minutes: 110, cost: 23.31,
      title: 'The seed', subtitle: 'A year on a small island',
      logline: 'A small character plants one seed. It tends the tree through five seasons. It picks up a new seed in spring.',
      prompt: 'A quiet toon-shaded film. The tree grows in one place. The light changes with each season.',
      tech: 'Canvas 2D seasons, fixed timeline, WebAudio',
      controls: 'Press Space at each season to help the tree. Click to pick up the new seed.',
      goal: 'Help the tree in all five seasons.',
      palette: { bg: '#1a2c3d', ink: '#f6ead6', accent: '#ee7b55', accent2: '#8ec0a4' }
    },
    {
      id: 'fast-lens', original: 5, rank: 7, tier: 'II', minutes: 110, cost: 27.13,
      title: 'The fast lens', subtitle: 'Seven glass elements',
      logline: 'A 50 mm lens of an invented make. Close the aperture. Turn the focus. Cut the lens in half to see the light rays.',
      prompt: 'Four views of one lens. Nine iris blades. A ray fan bends at each glass surface. The rays meet at one point.',
      tech: 'Canvas 2D optical section, geometric refraction',
      controls: 'Press A or S to close the iris. Press F for focus. Press X to cut the lens. Press 1 to 4 for views.',
      goal: 'Bring the light rays inside the marked focal spot.',
      palette: { bg: '#0e1012', ink: '#e8e4dc', accent: '#d8a14a', accent2: '#7fb0c4' }
    },
    {
      id: 'crystal-tumbler', original: 6, rank: 8, tier: 'II', minutes: 110, cost: 35.53,
      title: 'The crystal tumbler', subtitle: 'Cut glass and clear ice',
      logline: 'A cut-crystal glass holds amber liquid and one clear ice sphere. Move the light. Caustics move across the stone.',
      prompt: 'Four views. Sharp facets. Spectra at the cut edges. Condensation on the glass.',
      tech: 'Canvas 2D facets, spectral caustics, four views',
      controls: 'Drag or use the arrow keys to move the light. Press Space to turn the ice. Press 1 to 4 for views.',
      goal: 'Match the three light marks.',
      palette: { bg: '#11100e', ink: '#efe7d6', accent: '#c98a35', accent2: '#8ba9bb' }
    },
    {
      id: 'cork-gallery', original: 2, rank: 9, tier: 'III', minutes: 150, cost: 11.39,
      title: 'The cork gallery', subtitle: 'A fairground stall at dusk',
      logline: 'A cork gun fires at three rows of targets. The corks drop with distance. A chain lifts the fallen targets.',
      prompt: 'Three rounds. You get more points for far targets and ricochets. A flip counter shows the score. Bulbs light on the prize shelf.',
      tech: 'Canvas 2D perspective stage, cork physics',
      controls: 'Move the pointer to aim. Click to fire.',
      goal: 'Beat the stall score in three rounds.',
      palette: { bg: '#22253f', ink: '#f6e6c8', accent: '#e8a13c', accent2: '#c9534c' }
    },
    {
      id: 'shareware-1996', original: 9, rank: 10, tier: 'III', minutes: 150, cost: 37.62,
      title: 'Shareware, 1996', subtitle: 'A room with a working computer',
      logline: 'A 1996 shareware studio. Enter the monitor. Draw a sprite. Play a small game. Print the sprite on paper in the room.',
      prompt: 'A 16-colour operating system with seven programs. A sprite editor feeds a playable game. A printer prints your sprite.',
      tech: 'Canvas 2D room, canvas OS, WebAudio',
      controls: 'Click the monitor to enter. Click windows, keys and the printer. Press Escape to leave.',
      goal: 'Draw a sprite. Clear the small game. Print the sprite.',
      palette: { bg: '#191a20', ink: '#d8d2bd', accent: '#e0a44a', accent2: '#4d8c7a' }
    },
    {
      id: 'under-the-glass', original: 1, rank: 11, tier: 'IV', minutes: 150, cost: 33.18,
      title: 'Under the glass', subtitle: 'A shooter inside a pinball table',
      logline: 'You stand on a pinball playfield. Hold the plunger to charge it. Fire steel balls at drop targets. Light a word on the backglass.',
      prompt: 'Three areas. Drop targets, bumpers, spinners and flippers. A chrome ball is the hazard. You have three credits.',
      tech: 'Canvas 2D raycaster, sprite billboards, WebAudio',
      controls: 'Press W A S D to walk. Use the mouse or arrow keys to look. Hold the left button, then release to fire.',
      goal: 'Light every letter. Walk into the special hole.',
      palette: { bg: '#171016', ink: '#f3e3c4', accent: '#e0692f', accent2: '#54b3c4' }
    },
    {
      id: 'box-fort', original: 3, rank: 12, tier: 'IV', minutes: 150, cost: 33.55,
      title: 'The box fort', subtitle: 'Cardboard, tape and rubber bands',
      logline: 'You walk inside a cardboard fort. A rubber-band shooter folds box robots flat. A biscuit tin waits in the tower room.',
      prompt: 'Three areas: gate hall, tunnel and tower room. Robots throw paper balls. You have three star stickers.',
      tech: 'Canvas 2D raycaster, cardboard textures, WebAudio',
      controls: 'Press W A S D to walk. Use the mouse or arrow keys to look. Click to fire a rubber band.',
      goal: 'Reach the biscuit tin.',
      palette: { bg: '#43301f', ink: '#f6e7c9', accent: '#d99a4e', accent2: '#e4c06c' }
    },
    {
      id: 'breakwater', original: 4, rank: 13, tier: 'IV', minutes: 210, cost: 103.11,
      title: 'Breakwater', subtitle: 'A harbour town after rain',
      logline: 'A squad takes three points in a harbour town. Armour and aircraft join the fight. Wet streets reflect the sky.',
      prompt: 'A wide battle with three capture points. Squad mates use cover. A launcher stops an armoured car. A tower face falls.',
      tech: 'Canvas 2D raycaster, squad AI, WebAudio',
      controls: 'Press W A S D to move. Use the mouse or arrow keys to look. Click to fire. Press Shift to sprint. Press C to crouch. Press R to reload.',
      goal: 'Capture points A, B and C in order.',
      palette: { bg: '#262b30', ink: '#e6e4dd', accent: '#c8a06a', accent2: '#79a2ad' }
    }
  ];
  root.ARCADE_BY_ID = Object.fromEntries(root.ARCADE_GAMES.map(g => [g.id, g]));
})(window);
