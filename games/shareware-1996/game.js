/* Shareware, 1996 - a spare room, a 16-colour operating system, and a printer
   that carries what you draw back out into the room. Canvas2D only. */
(function () {
  'use strict';

  var G = Arcade.gfx;
  var ID = 'shareware-1996';
  var BW = 1600, BH = 900, OW = 320, OH = 240;

  var env = Arcade.boot({
    id: ID,
    title: 'Shareware, 1996',
    hint: 'Click the monitor to sit at the desk. Press Escape to leave.',
    background: '#191a20',
    ink: '#d8d2bd',
    onFrame: onFrame
  });

  var PAL = ['#0e1014', '#22253f', '#4d8c7a', '#8fb573', '#d8d2bd', '#e0a44a',
    '#d3733e', '#c9534c', '#a15b7a', '#6c548c', '#4d7db3', '#7fc0c7',
    '#7a5638', '#6e7186', '#a9a8a0', '#f4efe0'];
  var K = { black: 0, navy: 1, teal: 2, green: 3, cream: 4, amber: 5, orange: 6,
    red: 7, magenta: 8, purple: 9, blue: 10, cyan: 11, brown: 12, gray: 13,
    lgray: 14, white: 15 };
  function C(k) { return PAL[K[k]]; }

  /* ---------- hand-drawn bitmap type (5 x 7, no font files) ---------- */
  var FONTDEF = {
    'A': '01110/10001/10001/11111/10001/10001/10001',
    'B': '11110/10001/10001/11110/10001/10001/11110',
    'C': '01111/10000/10000/10000/10000/10000/01111',
    'D': '11110/10001/10001/10001/10001/10001/11110',
    'E': '11111/10000/10000/11110/10000/10000/11111',
    'F': '11111/10000/10000/11110/10000/10000/10000',
    'G': '01111/10000/10000/10111/10001/10001/01111',
    'H': '10001/10001/10001/11111/10001/10001/10001',
    'I': '01110/00100/00100/00100/00100/00100/01110',
    'J': '00111/00010/00010/00010/00010/10010/01100',
    'K': '10001/10010/10100/11000/10100/10010/10001',
    'L': '10000/10000/10000/10000/10000/10000/11111',
    'M': '10001/11011/10101/10101/10001/10001/10001',
    'N': '10001/11001/10101/10011/10001/10001/10001',
    'O': '01110/10001/10001/10001/10001/10001/01110',
    'P': '11110/10001/10001/11110/10000/10000/10000',
    'Q': '01110/10001/10001/10001/10101/10010/01101',
    'R': '11110/10001/10001/11110/10100/10010/10001',
    'S': '01111/10000/10000/01110/00001/00001/11110',
    'T': '11111/00100/00100/00100/00100/00100/00100',
    'U': '10001/10001/10001/10001/10001/10001/01110',
    'V': '10001/10001/10001/10001/10001/01010/00100',
    'W': '10001/10001/10001/10101/10101/11011/10001',
    'X': '10001/10001/01010/00100/01010/10001/10001',
    'Y': '10001/10001/01010/00100/00100/00100/00100',
    'Z': '11111/00001/00010/00100/01000/10000/11111',
    '0': '01110/10001/10011/10101/11001/10001/01110',
    '1': '00100/01100/00100/00100/00100/00100/01110',
    '2': '01110/10001/00001/00010/00100/01000/11111',
    '3': '11110/00001/00001/00110/00001/00001/11110',
    '4': '00010/00110/01010/10010/11111/00010/00010',
    '5': '11111/10000/10000/11110/00001/00001/11110',
    '6': '00110/01000/10000/11110/10001/10001/01110',
    '7': '11111/00001/00010/00100/01000/01000/01000',
    '8': '01110/10001/10001/01110/10001/10001/01110',
    '9': '01110/10001/10001/01111/00001/00010/01100',
    ' ': '00000/00000/00000/00000/00000/00000/00000',
    '.': '00000/00000/00000/00000/00000/00110/00110',
    ',': '00000/00000/00000/00000/00110/00100/01000',
    ':': '00000/00110/00110/00000/00110/00110/00000',
    ';': '00000/00110/00110/00000/00110/00100/01000',
    '!': '00100/00100/00100/00100/00100/00000/00100',
    '?': '01110/10001/00001/00010/00100/00000/00100',
    '-': '00000/00000/00000/11111/00000/00000/00000',
    '_': '00000/00000/00000/00000/00000/00000/11111',
    '/': '00001/00001/00010/00100/01000/10000/10000',
    '(': '00010/00100/01000/01000/01000/00100/00010',
    ')': '01000/00100/00010/00010/00010/00100/01000',
    '[': '01110/01000/01000/01000/01000/01000/01110',
    ']': '01110/00010/00010/00010/00010/00010/01110',
    "'": '00100/00100/00000/00000/00000/00000/00000',
    '+': '00000/00100/00100/11111/00100/00100/00000',
    '=': '00000/00000/11111/00000/11111/00000/00000',
    '*': '00000/10101/01110/11111/01110/10101/00000',
    '<': '00010/00100/01000/10000/01000/00100/00010',
    '>': '01000/00100/00010/00001/00010/00100/01000',
    '#': '01010/01010/11111/01010/11111/01010/01010',
    '%': '11001/11001/00010/00100/01000/10011/10011',
    '"': '01010/01010/00000/00000/00000/00000/00000',
    '&': '01100/10010/10100/01000/10101/10010/01101',
    '@': '01110/10001/10111/10101/10111/10000/01110',
    '$': '00100/01111/10100/01110/00101/11110/00100',
    '^': '00100/01010/10001/00000/00000/00000/00000',
    '\\': '10000/10000/01000/00100/00010/00001/00001',
    '|': '00100/00100/00100/00100/00100/00100/00100',
    '~': '00000/00000/01001/10110/00000/00000/00000'
  };
  var CHARS = Object.keys(FONTDEF);
  var CIDX = {}, FONT = {};
  for (var fi = 0; fi < CHARS.length; fi++) {
    CIDX[CHARS[fi]] = fi;
    FONT[CHARS[fi]] = FONTDEF[CHARS[fi]].split('/').map(function (s) { return parseInt(s, 2); });
  }
  var atlasCache = {};
  function atlas(color, scale) {
    var key = color + '|' + scale;
    if (atlasCache[key]) return atlasCache[key];
    var cw = Math.max(1, CHARS.length * 6 * scale), ch = 8 * scale;
    atlasCache[key] = G.offscreen(cw, ch, function (c) {
      c.fillStyle = color;
      for (var g = 0; g < CHARS.length; g++) {
        var mask = FONT[CHARS[g]];
        for (var row = 0; row < 7; row++) for (var col = 0; col < 5; col++) {
          if (mask[row] & (1 << (4 - col))) c.fillRect((g * 6 + col) * scale, row * scale, scale, scale);
        }
      }
    });
    return atlasCache[key];
  }
  function txt(c, text, x, y, color, scale) {
    scale = scale || 1;
    var A = atlas(color, scale), s = String(text).toUpperCase();
    for (var i = 0; i < s.length; i++) {
      var idx = CIDX[s.charAt(i)];
      if (idx === undefined) idx = CIDX[' '];
      c.drawImage(A, idx * 6 * scale, 0, 6 * scale, 8 * scale,
        x + i * 6 * scale, y, 6 * scale, 8 * scale);
    }
  }
  function tw(s, scale) { return String(s).length * 6 * (scale || 1); }

  /* ---------- small helpers ---------- */
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function s01(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  function inside(x, y, r) { return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h; }
  function rr(c, x, y, w, h, rad) { G.rr(c, x, y, w, h, rad); }

  /* ---------- room geometry, all in base coordinates ---------- */
  var MON = { x: 558, y: 276, w: 336, h: 252 };
  var PAPER = { x: 1204, y: 356, w: 292, h: 250 };
  var HOT = [
    { key: 'monitor', r: { x: 520, y: 235, w: 420, h: 380 }, title: 'The tube monitor',
      line: 'You see a curved monitor. Click it to sit at the desk.', focus: { x: 730, y: 400 }, zoom: 3.0, enter: true },
    { key: 'printer', r: { x: 1140, y: 350, w: 400, h: 440 }, title: 'The dot-matrix printer',
      line: 'The printer holds fan-fold paper. It prints the sprite you draw.', focus: { x: 1330, y: 560 }, zoom: 1.85 },
    { key: 'tower', r: { x: 958, y: 290, w: 165, h: 350 }, title: 'The beige tower',
      line: 'The tower has two floppy drives and a turbo button. The speed display shows 66.', focus: { x: 1040, y: 460 }, zoom: 1.9 },
    { key: 'cork', r: { x: 355, y: 62, w: 330, h: 250 }, title: 'The order board',
      line: 'Pins hold postal orders. You see a level on graph paper.', focus: { x: 520, y: 190 }, zoom: 1.9 },
    { key: 'calendar', r: { x: 700, y: 68, w: 180, h: 180 }, title: 'October 1996',
      line: 'You see three weeks of orders. A circle marks the twenty-third.', focus: { x: 790, y: 160 }, zoom: 2.0 },
    { key: 'books', r: { x: 990, y: 60, w: 570, h: 270 }, title: 'The shelf',
      line: 'The shelf holds thick books and a cassette radio.', focus: { x: 1260, y: 190 }, zoom: 1.85 },
    { key: 'floppies', r: { x: 150, y: 700, w: 220, h: 180 }, title: 'Disk boxes',
      line: 'Felt-tip labels name Moonset, Tinfold, and the order book.', focus: { x: 270, y: 780 }, zoom: 2.0 },
    { key: 'modem', r: { x: 990, y: 640, w: 210, h: 90 }, title: 'The modem',
      line: 'Red lights blink while you use the board.', focus: { x: 1090, y: 690 }, zoom: 2.1 },
    { key: 'mug', r: { x: 400, y: 600, w: 100, h: 115 }, title: 'The mug',
      line: 'You see pens and cold tea. Tape holds a cable to the skirting.', focus: { x: 440, y: 660 }, zoom: 2.1 }
  ];

  /* ---------- global state ---------- */
  var S, osCanvas, osCtx, roomBg, roomDesk, deskArt, scanPat, bgGlow, codeScreen, prerolled = false;

  var PRESETS = [
    { name: 'MOON', rows: [
      '................', '.....33333......', '...33FFFFF33....', '..3FFFFFFFFF3...',
      '.3FFFFFFFFFFF3..', '.3FFF3333FFFF3..', '3FFF333333FFFF3.', '3FFF333333FFFF3.',
      '3FFF333333FFFF3.', '3FFF333333FFFF3.', '.3FFF3333FFFF3..', '.3FFFFFFFFFFF3..',
      '..3FFFFFFFFF3...', '...33FFFFF33....', '.....33333......', '................' ] },
    { name: 'KETTLE', rows: [
      '................', '.......55.......', '......5555......', '....77777777....',
      '...7777777777...', '..7CCCCCCCC77...', '.7CC4CCCCCCC77..', '.7C44CCCCCCCC7.',
      '.7CC4CCCCCCCC77.', '.77CCCCCCCCC77..', '..77777777777...', '...777777777....',
      '....7777777.....', '.....55555......', '......555.......', '................' ] },
    { name: 'MOTH', rows: [
      '................', '................', '...B........B...', '..BBB......BBB..',
      '.BBBBB....BBBBB.', 'BBBBBBDDBBBBBBDD', 'BBBBBDDAABBBBBDD', '.BBBBDDAADDBBB..',
      '..BBBDDAA DDBB..', '...BDDDAADDDDB..', '....DDAAAAAADD..', '.....DDAAAADD...',
      '......DDFFDD....', '.......DDDD.....', '........DD......', '................' ] }
  ];

  var SAMPLES = [
    { name: 'RAINBOW', lines: ['CLS 1', 'FOR I = 1 TO 8', 'CIRCLE 40 35 I 5', 'PLOT 10 10 5', 'NEXT', 'SOUND 440 8', 'PRINT DONE', 'END'] },
    { name: 'CHIME', lines: ['CLS 1', 'FOR I = 1 TO 6', 'BOX 8 8 12 12 5', 'SOUND 220 6', 'SOUND 330 6', 'NEXT', 'PRINT CHIME', 'END'] },
    { name: 'MAZE', lines: ['CLS 1', 'FOR I = 1 TO 10', 'LINE 5 5 80 60 3', 'PLOT 20 20 7', 'SOUND 660 3', 'NEXT', 'PRINT MAZE', 'END'] }
  ];

  var SONG = [
    [0, 0, 3, 0, 7, 0, 3, 0, 5, 0, 8, 0, 7, 0, 3, 0],
    [12, 0, 12, 0, 10, 0, 10, 0, 8, 0, 8, 0, 7, 0, 7, 0],
    [0, 3, 0, 3, 0, 5, 0, 5, 0, 7, 0, 7, 0, 5, 0, 3],
    [1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 2, 1, 2]
  ];
  var NOTES = [0, 262, 294, 330, 392, 440, 523, 587, 659, 784, 880, 1047, 196, 220];

  var POSTS = [
    { who: 'M. DABNEY', sub: 'MOONSET BUG', body: 'THE HERO VANISHES IN ROOM FOUR. FIX IN THE NEXT DISK?' },
    { who: 'R. VELL', sub: 'ORDER BOOK', body: 'SIX MORE ENVELOPES TODAY. POST THE LABELS BY FRIDAY.' },
    { who: 'E. TALLOW', sub: 'TRACKER SONG', body: 'NIGHT SHIFT SOUNDS FINE ON A SMALL SPEAKER. KEEP IT.' },
    { who: 'P. ASH', sub: 'SPRITE TIP', body: 'A DARK OUTLINE HELPS YOU SEE THE 16 COLOURS.' },
    { who: 'D. ROO', sub: 'REGISTRATION', body: 'ENCLOSED THREE POUNDS AND A STAMP. THANK YOU.' }
  ];
  var FILES = [
    { name: 'MOONSET.ZIP', size: '148K', note: 'DEMO DISK THREE' },
    { name: 'TINBIRD.EXE', size: '61K', note: 'ONE LEVEL ONLY' },
    { name: 'ORDER96.TXT', size: '9K', note: 'POSTAL LIST' },
    { name: 'NIGHTSHF.MOD', size: '32K', note: 'FOUR CHANNELS' }
  ];
  var ORDERS = [
    { who: 'E. TALLOW', town: 'WRENFORD', item: 'MOONSET DISK 2', paid: 'PAID' },
    { who: 'M. DABNEY', town: 'LOW MARSH', item: 'TINBIRD BOX', paid: 'PAID' },
    { who: 'R. VELL', town: 'ASH HOLT', item: 'MOONSET DISK 1', paid: 'DUE' },
    { who: 'P. ASH', town: 'GREY QUAY', item: 'REGISTRATION', paid: 'PAID' },
    { who: 'D. ROO', town: 'NINE ELMS', item: 'TRACKER DISK', paid: 'PAID' }
  ];

  var APPDEFS = {
    sprite: { title: 'SPRITE.BIN', x: 8, y: 20, w: 192, h: 178 },
    code: { title: 'TINY BASIC', x: 24, y: 16, w: 276, h: 200 },
    game: { title: 'LAMP RUN', x: 56, y: 24, w: 210, h: 190 },
    tracker: { title: 'NIGHT TRACKER', x: 14, y: 18, w: 292, h: 196 },
    modem: { title: 'MODEM / BBS', x: 20, y: 16, w: 280, h: 202 },
    orders: { title: 'ORDER BOOK', x: 22, y: 20, w: 276, h: 194 },
    print: { title: 'PRINT', x: 40, y: 26, w: 240, h: 170 },
    readme: { title: 'NIGHT NOTE', x: 206, y: 24, w: 104, h: 102 }
  };

  function presetPixels(which) {
    var p = new Array(256), rows = PRESETS[which].rows;
    for (var y = 0; y < 16; y++) for (var x = 0; x < 16; x++) {
      var ch = rows[y].charAt(x);
      p[y * 16 + x] = ch === '.' || ch === ' ' ? 0 : (parseInt(ch, 16) || 0);
    }
    return p;
  }

  function freshState() {
    var R = Arcade.rng(env.seed + 4103);
    var st = {
      t: 0, R: R, marks: {}, finished: false, started: false,
      fly: 0, flyTarget: 0,
      cam: { zoom: 1, cx: 800, cy: 470, zt: 1, cxt: 800, cyt: 470 },
      ptr: { x: env.w * 0.5, y: env.h * 0.5 },
      osMouse: { x: 160, y: 120 }, paintDrag: false, drag: null,
      regions: [], windows: [], menu: false, focus: 'sprite',
      sprite: presetPixels(0), spriteColor: 7, preset: 0, editedSprite: false, gameWon: false,
      windowsSeq: 0,
      code: { lines: SAMPLES[0].lines.slice(), editor: true, output: '', err: '', sample: 0, cursor: 0 },
      game: { gems: [], hazards: [], hx: 96, score: 0, hearts: 3, won: false, spawn: 0, over: false },
      track: { grid: null, playing: true, step: 0, timer: 0, tempo: 120, name: 'NIGHT SHIFT' },
      modem: { state: 'idle', t0: 0, tab: 0, post: 0, lamp: '', lastGame: '' },
      orders: { sel: 0 },
      printapp: { src: 'sprite' },
      print: null, printed: false, printedKind: '',
      detail: null, bot: { t: 0, phase: 0, target: { x: 160, y: 120 }, next: 0, done: false },
      frozenDone: false
    };
    st.track.grid = [];
    for (var ch = 0; ch < 4; ch++) st.track.grid.push(SONG[ch].slice());
    S = st;
  }

  function mark(key) {
    if (env.frozen || S.marks[key]) return;
    S.marks[key] = true;
    Arcade.mark(ID, key);
  }
  function finishRun(forced) {
    if (S.finished) return;
    S.finished = true;
    var stars = clamp(1 + (S.editedSprite ? 1 : 0) + (S.gameWon ? 1 : 0), 1, 3);
    if (!env.frozen) Arcade.score(ID, stars * 100);
    Arcade.finish({
      score: stars * 100, stars: stars, seconds: Math.round(S.t),
      title: forced ? 'You leave the studio' : 'You print the sprite',
      lines: ['Sprite ' + (S.editedSprite ? 'edited' : 'untouched') +
        ' / game ' + (S.gameWon ? 'cleared' : 'not cleared'),
        (S.printed ? 'You printed the ' + (S.printedKind === 'label' ? 'postal label' :
          S.printedKind === 'listing' ? 'BASIC listing' : 'sprite you drew') + ' on fan-fold paper' : 'You printed nothing'),
        'Hollowreed Software  /  October 1996'],
      note: 'shareware'
    });
  }

  /* ---------- cached room art ---------- */
  function panel(c, x, y, w, h, colTop, colBot, hi) {
    var g = G.linear(c, x, y, x + w * 0.12, y + h, [[0, colTop], [0.55, colBot], [1, '#14100f']]);
    c.fillStyle = g; c.fillRect(x, y, w, h);
    if (hi !== false) {
      c.fillStyle = 'rgba(255,235,196,.10)'; c.fillRect(x, y, w, Math.max(1, h * 0.02));
      c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(x, y + h - 2, w, 2);
    }
  }
  function label(c, text, x, y, size, color, align) {
    G.copyText(c, text, x, y, size, color || '#d8d2bd',
      { family: 'Georgia, serif', align: align || 'left', tracking: 0.5 });
  }
  function tiny(c, text, x, y, size, color, align) {
    G.copyText(c, text, x, y, size, color,
      { family: 'monospace', align: align || 'left' });
  }
  function bevelled(c, x, y, w, h, base) {
    panel(c, x, y, w, h, base, '#8d8069', false);
    c.strokeStyle = 'rgba(255,245,215,.35)'; c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(x, y + h - 1); c.lineTo(x, y); c.lineTo(x + w - 1, y); c.stroke();
    c.strokeStyle = 'rgba(25,20,18,.55)';
    c.beginPath(); c.moveTo(x + w - 1, y + 1); c.lineTo(x + w - 1, y + h - 1); c.lineTo(x, y + h - 1); c.stroke();
  }
  function paperSheet(c, x, y, w, h, rot, R, tint) {
    c.save(); c.translate(x + w / 2, y + h / 2); c.rotate(rot || 0);
    c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(-w / 2 + 4, -h / 2 + 5, w, h);
    var g = G.linear(c, -w / 2, -h / 2, w / 2, h / 2,
      [[0, tint || '#e7dcc0'], [0.6, '#cdbf9e'], [1, '#a89a7f']]);
    c.fillStyle = g; c.fillRect(-w / 2, -h / 2, w, h);
    for (var i = 0; i < 7; i++) {
      c.fillStyle = 'rgba(70,62,54,.22)';
      c.fillRect(-w * 0.38, -h * 0.36 + i * h * 0.11, w * (0.3 + R() * 0.42), 1.2);
    }
    c.strokeStyle = 'rgba(65,55,45,.35)'; c.lineWidth = 1;
    c.strokeRect(-w / 2, -h / 2, w, h);
    c.restore();
  }

  function drawBackground(c, R) {
    var g = G.linear(c, 0, 0, BW * 0.4, BH,
      [[0, '#26272c'], [0.45, '#2d2a26'], [1, '#171719']]);
    c.fillStyle = g; c.fillRect(0, 0, BW, BH);
    for (var i = 0; i < 70; i++) {
      c.fillStyle = 'rgba(214,196,158,' + (0.010 + R() * 0.018).toFixed(3) + ')';
      c.fillRect(i * 24 + 3, 0, 1.5, 640);
    }
    c.fillStyle = '#111216'; c.fillRect(0, 620, BW, 280);
    var lamp = G.radial(c, 420, 520, 10, 420, 520, 760,
      [[0, 'rgba(240,178,92,.27)'], [0.45, 'rgba(202,132,62,.10)'], [1, 'rgba(0,0,0,0)']]);
    c.fillStyle = lamp; c.fillRect(0, 0, BW, BH);
    var street = G.linear(c, 0, 100, 300, 500,
      [[0, 'rgba(112,146,176,.20)'], [1, 'rgba(112,146,176,0)']]);
    c.fillStyle = street; c.fillRect(0, 0, 380, 620);

    /* window with rain and blinds */
    var wx = 46, wy = 62, ww = 258, wh = 408;
    c.fillStyle = '#3a3028'; c.fillRect(wx - 18, wy - 18, ww + 36, wh + 36);
    var wg = G.linear(c, wx, wy, wx, wy + wh, [[0, '#162233'], [0.5, '#1b2c3f'], [1, '#0c1520']]);
    c.fillStyle = wg; c.fillRect(wx, wy, ww, wh);
    var lg = G.radial(c, wx + 190, wy + 110, 0, wx + 190, wy + 110, 120,
      [[0, 'rgba(220,206,150,.55)'], [0.25, 'rgba(190,175,120,.20)'], [1, 'rgba(0,0,0,0)']]);
    c.fillStyle = lg; c.fillRect(wx, wy, ww, wh);
    c.fillStyle = 'rgba(232,220,170,.5)'; c.beginPath(); c.arc(wx + 190, wy + 110, 12, 0, 6.283); c.fill();
    for (var r = 0; r < 60; r++) {
      var rx = wx + R() * ww, ry = wy + R() * wh;
      c.strokeStyle = 'rgba(180,205,225,.13)'; c.lineWidth = 0.8 + R();
      c.beginPath(); c.moveTo(rx, ry); c.lineTo(rx - 3, ry + 12 + R() * 20); c.stroke();
    }
    for (var b = 0; b < 11; b++) {
      var by = wy + 10 + b * 37;
      c.fillStyle = G.linear(c, 0, by, 0, by + 22,
        [[0, '#575044'], [0.5, '#3c372f'], [1, '#2b2722']]);
      c.fillRect(wx - 6, by, ww + 12, 22);
      c.fillStyle = 'rgba(255,231,180,.08)'; c.fillRect(wx - 6, by, ww + 12, 2);
    }
    c.fillStyle = '#4b3f33';
    c.fillRect(wx + ww / 2 - 5, wy, 10, wh);
    c.fillRect(wx, wy + wh / 2 - 5, ww, 10);
    for (var lb = 0; lb < 8; lb++) {
      c.save();
      c.globalAlpha = 0.045;
      c.fillStyle = '#c6d4dd';
      c.beginPath();
      c.moveTo(300, 100 + lb * 60); c.lineTo(BW * 0.95, 180 + lb * 95);
      c.lineTo(BW * 0.95, 205 + lb * 95); c.lineTo(300, 120 + lb * 60);
      c.closePath(); c.fill(); c.restore();
    }

    /* cork board */
    bevelled(c, 352, 58, 336, 252, '#6b4a2c');
    c.fillStyle = '#9c7448'; c.fillRect(364, 70, 312, 228);
    for (var cork = 0; cork < 420; cork++) {
      c.fillStyle = 'rgba(52,32,18,' + (0.04 + R() * 0.09).toFixed(3) + ')';
      c.fillRect(364 + R() * 312, 70 + R() * 228, 2 + R() * 4, 1 + R() * 2);
    }
    paperSheet(c, 380, 86, 132, 112, -0.045, R);
    label(c, 'ORDER FORM', 392, 110, 13, '#46382c');
    label(c, 'MOONSET - DISK 2', 392, 130, 11, '#5c4a38');
    label(c, 'E. TALLOW / WRENFORD', 392, 148, 10, '#5c4a38');
    c.strokeStyle = 'rgba(70,56,42,.35)';
    for (var ln = 0; ln < 3; ln++) { c.beginPath(); c.moveTo(390, 164 + ln * 12); c.lineTo(500, 164 + ln * 12); c.stroke(); }
    c.fillStyle = '#c9534c'; c.beginPath(); c.arc(446, 84, 5, 0, 6.283); c.fill();
    paperSheet(c, 528, 88, 132, 128, 0.035, R, '#d9dcc9');
    c.save(); c.translate(538, 102);
    c.strokeStyle = 'rgba(74,112,110,.45)'; c.lineWidth = 0.7;
    for (var gx = 0; gx < 12; gx++) { c.beginPath(); c.moveTo(gx * 9, 0); c.lineTo(gx * 9, 100); c.stroke(); }
    for (var gy = 0; gy < 11; gy++) { c.beginPath(); c.moveTo(0, gy * 9); c.lineTo(100, gy * 9); c.stroke(); }
    c.strokeStyle = '#2b5a63'; c.lineWidth = 2.5;
    c.beginPath(); c.moveTo(8, 82); c.lineTo(38, 82); c.lineTo(38, 50); c.lineTo(76, 50);
    c.lineTo(76, 20); c.lineTo(96, 20); c.stroke();
    c.fillStyle = '#c9534c';
    c.fillRect(30, 74, 7, 7); c.fillRect(70, 14, 7, 7);
    c.restore();
    label(c, 'LEVEL 4 / WEST WING', 530, 234, 10, '#4e4234');

    /* calendar */
    paperSheet(c, 702, 68, 178, 172, 0.018, R, '#efe6cb');
    label(c, 'OCTOBER 1996', 791, 96, 16, '#3c342b', 'center');
    c.strokeStyle = '#6e5a44'; c.lineWidth = 1;
    c.beginPath(); c.moveTo(716, 104); c.lineTo(866, 104); c.stroke();
    var days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    for (var d = 0; d < 7; d++) tiny(c, days[d], 720 + d * 21, 120, 10, '#5a4b3a', 'center');
    for (var day = 1; day <= 31; day++) {
      var col = (day + 1) % 7, row = Math.floor((day + 1) / 7);
      var dx = 720 + col * 21, dy = 138 + row * 18;
      if (day === 23) {
        c.strokeStyle = '#c9534c'; c.lineWidth = 1.4;
        c.beginPath(); c.ellipse(dx + 4, dy - 3, 10, 8, 0, 0, 6.283); c.stroke();
      }
      tiny(c, String(day), dx, dy, 10, day === 23 ? '#a63e38' : '#4e4234', 'center');
    }
    label(c, 'POST THE BOXES', 720, 224, 10, '#7a5a3e');

    /* shelves and books */
    panel(c, 964, 60, 596, 18, '#563a24', '#2b1c14');
    panel(c, 964, 218, 596, 18, '#563a24', '#2b1c14');
    var bookCols = ['#3f5b52', '#89493e', '#4a5377', '#8b6b35', '#5e4a67', '#476b6b', '#96583c', '#394d62', '#7a6440', '#5c3f4d', '#3d6152'];
    var titles = ['THE BRAMBLE BOOK', 'SPRITES AND SOUND', 'DISK INPUT / OUTPUT', 'TINY BASIC', 'PALETTE NOTES', 'NIGHT CODING', 'SHAREWARE BY POST', 'FOUR CHANNELS', 'SCREEN MODES', 'ORDER LEDGER', 'CRACKED SPINES'];
    for (var bk = 0; bk < 11; bk++) {
      var bx = 980 + bk * 50, by = 80 + (bk % 2) * 6, bw = 34 + (bk % 3) * 6, bh = 132;
      c.fillStyle = 'rgba(0,0,0,.45)'; c.fillRect(bx + 4, by + 4, bw, bh);
      var bgc = G.linear(c, bx, by, bx + bw, by,
        [[0, '#1b1713'], [0.15, bookCols[bk]], [0.8, bookCols[bk]], [1, '#191512']]);
      c.fillStyle = bgc; c.fillRect(bx, by, bw, bh);
      c.fillStyle = 'rgba(240,214,160,.30)'; c.fillRect(bx + 3, by, 2, bh);
      c.fillStyle = 'rgba(240,214,160,.22)'; c.fillRect(bx + bw - 5, by + 8, 2, bh - 16);
      c.save(); c.translate(bx + bw / 2, by + bh - 12); c.rotate(-Math.PI / 2);
      label(c, titles[bk], 0, 0, 11, 'rgba(238,222,186,.82)', 'center');
      c.restore();
      c.strokeStyle = 'rgba(20,14,12,.55)'; c.lineWidth = 1;
      for (var crack = 0; crack < 3; crack++) {
        var cy = by + 14 + R() * (bh - 30);
        c.beginPath(); c.moveTo(bx, cy); c.lineTo(bx + 5 + R() * 8, cy + 4); c.stroke();
      }
    }
    /* cassette radio on the lower shelf */
    bevelled(c, 1300, 236, 220, 96, '#6a5a45');
    panel(c, 1312, 246, 92, 72, '#2d2b28', '#151412');
    for (var sp = 0; sp < 9; sp++) {
      c.fillStyle = 'rgba(180,168,140,.16)';
      for (var sd = 0; sd < 7; sd++) c.fillRect(1318 + sd * 11, 252 + sp * 7, 7, 2);
    }
    panel(c, 1414, 250, 92, 58, '#494d50', '#252829');
    c.fillStyle = '#1d2326'; c.fillRect(1420, 256, 78, 38);
    c.fillStyle = '#a59570'; c.beginPath(); c.arc(1440, 275, 9, 0, 6.283); c.fill();
    c.beginPath(); c.arc(1476, 275, 9, 0, 6.283); c.fill();
    tiny(c, 'HOLLOWREED AM', 1420, 324, 10, '#d4c7a4');
    c.fillStyle = '#e0a44a'; c.fillRect(1418, 316, 40, 3);

    /* skirting board and taped cable */
    panel(c, 0, 838, BW, 62, '#3a3029', '#1c1815');
    c.strokeStyle = '#171819'; c.lineWidth = 6;
    c.beginPath(); c.moveTo(0, 866); c.bezierCurveTo(220, 874, 480, 858, 760, 870);
    c.bezierCurveTo(1000, 880, 1250, 858, BW, 868); c.stroke();
    for (var tp = 0; tp < 7; tp++) {
      c.save(); c.translate(120 + tp * 145, 864 + Math.sin(tp) * 4); c.rotate(-0.05);
      c.fillStyle = 'rgba(216,205,174,.55)'; c.fillRect(-16, -7, 32, 14);
      c.restore();
    }
  }

  function drawDesk(c, R) {
    /* desk top */
    var dg = G.linear(c, 0, 560, BW, 820,
      [[0, '#513521'], [0.25, '#74472b'], [0.55, '#5a361f'], [1, '#2e1c14']]);
    c.fillStyle = dg; c.fillRect(0, 566, BW, 240);
    c.save(); c.beginPath(); c.rect(0, 566, BW, 240); c.clip();
    for (var gr = 0; gr < 44; gr++) {
      G.paintStroke(c, [[R() * BW * 0.3, 570 + R() * 230], [BW * 0.4 + R() * BW * 0.3, 570 + R() * 230], [BW, 570 + R() * 230]],
        'rgba(26,14,10,' + (0.05 + R() * 0.09).toFixed(3) + ')', 1 + R() * 4, 700 + gr, { passes: 1, jitter: 6 });
    }
    c.restore();
    c.fillStyle = 'rgba(240,190,120,.10)';
    c.beginPath(); c.ellipse(650, 690, 560, 95, 0, 0, 6.283); c.fill();
    panel(c, 0, 790, BW, 110, '#3b2419', '#1a100d');
    c.fillStyle = 'rgba(255,224,170,.12)'; c.fillRect(0, 790, BW, 3);
    c.fillStyle = '#22160f';
    c.fillRect(90, 880, 90, 20); c.fillRect(1420, 880, 90, 20);

    /* desk lamp */
    c.save();
    c.strokeStyle = '#6f5330'; c.lineWidth = 12; c.lineCap = 'round';
    c.beginPath(); c.moveTo(300, 620); c.lineTo(322, 470); c.lineTo(392, 390); c.stroke();
    c.strokeStyle = '#d8b273'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(300, 620); c.lineTo(322, 470); c.lineTo(392, 390); c.stroke();
    c.fillStyle = '#3a2a1a'; c.beginPath(); c.ellipse(300, 624, 62, 16, 0, 0, 6.283); c.fill();
    c.fillStyle = '#8a6534'; c.beginPath(); c.ellipse(300, 620, 56, 13, 0, 0, 6.283); c.fill();
    c.save(); c.translate(402, 380); c.rotate(0.62);
    var shade = G.linear(c, -60, -34, 60, 40, [[0, '#5a3f22'], [0.4, '#c08d45'], [1, '#3a2818']]);
    c.fillStyle = shade;
    c.beginPath(); c.moveTo(-58, -30); c.lineTo(58, -30); c.lineTo(80, 34); c.lineTo(-80, 34); c.closePath(); c.fill();
    c.strokeStyle = '#e6c688'; c.lineWidth = 3; c.stroke();
    c.fillStyle = '#f6dc9d'; c.beginPath(); c.ellipse(0, 33, 76, 9, 0, 0, 6.283); c.fill();
    c.restore();
    c.restore();
    var bulbG = G.radial(c, 410, 420, 0, 410, 420, 330,
      [[0, 'rgba(255,214,138,.28)'], [0.4, 'rgba(240,168,80,.10)'], [1, 'rgba(0,0,0,0)']]);
    c.fillStyle = bulbG; c.fillRect(120, 300, 700, 520);

    /* monitor */
    c.fillStyle = 'rgba(0,0,0,.45)';
    c.beginPath(); c.ellipse(744, 622, 236, 26, 0, 0, 6.283); c.fill();
    bevelled(c, 516, 236, 420, 374, '#c7bfa4');
    bevelled(c, MON.x - 20, MON.y - 20, MON.w + 40, MON.h + 44, '#b7ac91');
    c.fillStyle = '#121416';
    G.rr(c, MON.x - 9, MON.y - 9, MON.w + 18, MON.h + 18, 22); c.fill();
    c.fillStyle = '#282a29';
    G.rr(c, MON.x - 5, MON.y - 5, MON.w + 10, MON.h + 10, 20); c.fill();
    c.fillStyle = '#0a0d12';
    G.rr(c, MON.x, MON.y, MON.w, MON.h, 18); c.fill();
    c.fillStyle = '#d2c8aa'; c.fillRect(516, 588, 420, 22);
    c.fillStyle = '#594d3a'; c.fillRect(700, 594, 56, 8);
    c.fillStyle = '#8fb573'; c.beginPath(); c.arc(924, 599, 4, 0, 6.283); c.fill();
    label(c, 'PINWHEEL 15', 536, 604, 11, '#4e4436');
    /* vents */
    for (var vt = 0; vt < 9; vt++) { c.fillStyle = 'rgba(60,52,42,.35)'; c.fillRect(540 + vt * 12, 250, 5, 4); }

    /* tower */
    c.fillStyle = 'rgba(0,0,0,.45)'; c.fillRect(962, 632, 156, 14);
    bevelled(c, 958, 292, 156, 348, '#c4bca1');
    c.fillStyle = '#a49a80'; c.fillRect(970, 310, 132, 6);
    for (var fd = 0; fd < 2; fd++) {
      var fy = 336 + fd * 62;
      panel(c, 980, fy, 112, 38, '#756c59', '#302b25');
      c.fillStyle = '#1c1b1a'; c.fillRect(988, fy + 9, 92, 9);
      c.fillStyle = '#d5cbaa'; c.fillRect(1078, fy + 24, 10, 5);
      tiny(c, fd ? 'B:' : 'A:', 984, fy + 34, 10, '#312b24');
    }
    panel(c, 980, 470, 112, 44, '#38342f', '#171614');
    tiny(c, '66', 1036, 504, 26, '#e0a44a', 'center');
    label(c, 'TURBO', 986, 530, 10, '#4c4436');
    c.fillStyle = '#c9534c'; c.fillRect(1060, 520, 22, 12);
    c.fillStyle = '#8a8169'; c.fillRect(1060, 520, 22, 3);
    for (var vv = 0; vv < 12; vv++) { c.fillStyle = 'rgba(60,54,44,.28)'; c.fillRect(980 + vv * 9, 566, 4, 12); }
    label(c, 'HOLLOWREED 486', 970, 624, 11, '#4b4235');

    /* printer body (paper drawn live) */
    c.fillStyle = 'rgba(0,0,0,.45)'; c.fillRect(1142, 786, 396, 18);
    bevelled(c, 1140, 596, 396, 194, '#b9b19a');
    panel(c, 1154, 610, 368, 66, '#504b43', '#242320');
    c.fillStyle = '#131514'; c.fillRect(1170, 624, 336, 24);
    c.fillStyle = '#8a826d'; c.fillRect(1170, 652, 336, 10);
    for (var bt = 0; bt < 4; bt++) {
      c.fillStyle = '#d3c9ab'; c.fillRect(1200 + bt * 70, 694, 44, 16);
      c.fillStyle = '#4c4437'; c.fillRect(1204 + bt * 70, 698, 36, 3);
    }
    c.fillStyle = '#8fb573'; c.beginPath(); c.arc(1500, 704, 5, 0, 6.283); c.fill();
    label(c, 'PANTHER 9-PIN', 1160, 776, 12, '#484036');
    for (var hole = 0; hole < 2; hole++) {
      c.fillStyle = '#3b362c';
      c.beginPath(); c.arc(hole ? 1490 : 1172, 590, 9, 0, 6.283); c.fill();
    }

    /* modem */
    bevelled(c, 988, 648, 212, 66, '#9b9482');
    label(c, 'HOLLOWREED LINK 2400', 998, 666, 10, '#3c372e');
    for (var ld = 0; ld < 8; ld++) {
      c.fillStyle = '#3a1414'; c.beginPath(); c.arc(1004 + ld * 22, 690, 5, 0, 6.283); c.fill();
      c.fillStyle = 'rgba(255,120,90,.10)'; c.beginPath(); c.arc(1004 + ld * 22, 690, 7, 0, 6.283); c.fill();
    }
    c.fillStyle = '#4e473a'; c.fillRect(1176, 682, 16, 3);

    /* keyboard */
    c.fillStyle = 'rgba(0,0,0,.42)'; c.fillRect(498, 742, 360, 18);
    bevelled(c, 490, 658, 366, 86, '#cabfa2');
    for (var kr = 0; kr < 4; kr++) for (var kc = 0; kc < 15; kc++) {
      var kx = 500 + kc * 23, ky = 668 + kr * 18;
      c.fillStyle = '#3a342b'; c.fillRect(kx, ky + 2, 19, 13);
      c.fillStyle = G.linear(c, kx, ky, kx + 19, ky + 13,
        [[0, '#e5dabc'], [1, '#b4a787']]);
      c.fillRect(kx, ky, 19, 13);
      c.fillStyle = 'rgba(255,255,235,.35)'; c.fillRect(kx + 2, ky + 1, 14, 2);
    }
    c.fillStyle = '#ddd0b2'; c.fillRect(556, 738, 160, 8);
    /* coiled cable */
    c.strokeStyle = '#3a322a'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(856, 690);
    for (var coil = 0; coil < 7; coil++) c.quadraticCurveTo(878 + coil * 12, 676 - (coil % 2) * 20, 890 + coil * 12, 690);
    c.stroke();

    /* mouse and worn pad */
    bevelled(c, 872, 662, 116, 78, '#4f5c55');
    c.fillStyle = 'rgba(228,216,180,.10)'; c.fillRect(880, 670, 100, 60);
    c.fillStyle = '#c8bfa4';
    c.beginPath(); c.ellipse(922, 696, 26, 18, -0.2, 0, 6.283); c.fill();
    c.strokeStyle = '#6e6758'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(922, 680); c.lineTo(922, 688); c.stroke();
    c.strokeStyle = '#38332b'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(922, 680); c.quadraticCurveTo(940, 646, 980, 652); c.stroke();

    /* mug of pens and cold tea */
    c.fillStyle = 'rgba(0,0,0,.4)'; c.beginPath(); c.ellipse(442, 706, 44, 10, 0, 0, 6.283); c.fill();
    panel(c, 406, 626, 66, 80, '#e0d5bb', '#8b8069');
    c.fillStyle = '#4a4034'; c.beginPath(); c.ellipse(439, 630, 31, 9, 0, 0, 6.283); c.fill();
    for (var pen = 0; pen < 5; pen++) {
      c.save(); c.translate(424 + pen * 8, 610 + (pen % 2) * 5); c.rotate(-0.25 + pen * 0.09);
      c.fillStyle = ['#c9534c', '#3d6a63', '#e0a44a', '#4d7db3', '#6e7186'][pen];
      c.fillRect(-2, 0, 4, 38);
      c.fillStyle = '#e8dcc0'; c.fillRect(-2, 0, 4, 4);
      c.restore();
    }
    c.fillStyle = 'rgba(0,0,0,.4)'; c.beginPath(); c.ellipse(358, 704, 30, 8, 0, 0, 6.283); c.fill();
    panel(c, 330, 644, 54, 60, '#ded2b6', '#8a7e68');
    c.fillStyle = '#6d4a2a'; c.beginPath(); c.ellipse(357, 649, 25, 7, 0, 0, 6.283); c.fill();
    c.fillStyle = 'rgba(230,214,176,.2)'; c.beginPath(); c.arc(348, 646, 5, 0, 6.283); c.fill();
    c.strokeStyle = '#c9bda0'; c.lineWidth = 2;
    c.beginPath(); c.arc(384, 660, 10, -1.2, 1.2); c.stroke();

    /* floppy boxes and envelopes */
    for (var fb = 0; fb < 3; fb++) {
      var fx = 170 + fb * 66, fy = 716 - fb * 6;
      c.save(); c.translate(fx, fy); c.rotate(-0.03 + fb * 0.025);
      panel(c, 0, 0, 74, 96, fb % 2 ? '#7d6a4d' : '#6b6248', '#3b3428');
      c.fillStyle = '#ded2b6';
      var lbl = ['MOONSET', 'TINFOLD', 'ORDER 96'][fb];
      c.fillRect(8, 14, 58, 26);
      label(c, lbl, 37, 32, 10, '#40382c', 'center');
      tiny(c, 'DISK ' + (fb + 1), 12, 62, 10, '#cfc2a2');
      for (var dl = 0; dl < 3; dl++) { c.fillStyle = 'rgba(60,50,40,.35)'; c.fillRect(10, 70 + dl * 7, 52, 1.5); }
      c.restore();
    }
    for (var ev = 0; ev < 4; ev++) {
      c.save(); c.translate(40 + ev * 14, 776 - ev * 13); c.rotate(-0.06 + ev * 0.03);
      var eg = G.linear(c, 0, 0, 190, 66, [[0, '#c4b79a'], [0.6, '#9d9177'], [1, '#766c58']]);
      c.fillStyle = eg; G.rr(c, 0, 0, 190, 66, 5); c.fill();
      c.fillStyle = 'rgba(255,255,240,.10)';
      for (var q = 0; q < 26; q++) c.fillRect((q * 37) % 180, (q * 23) % 58, 8, 5);
      c.fillStyle = '#e7dcc0'; c.fillRect(10, 8, 88, 40);
      label(c, ORDERS[ev].who, 16, 24, 11, '#41382c');
      label(c, ORDERS[ev].town, 16, 40, 10, '#54483a');
      c.fillStyle = '#b9574b'; c.fillRect(152, 8, 26, 22);
      c.restore();
    }
    label(c, 'HOLLOWREED SOFTWARE / MOONSET BY POST', 30, 866, 11, 'rgba(214,198,166,.5)');
  }

  function buildRoom() {
    var R = Arcade.rng(env.seed * 13 + 907);
    roomBg = G.offscreen(BW, BH, function (c) { drawBackground(c, R); });
    roomDesk = G.offscreen(BW, BH, function (c) { drawDesk(c, R); });
    scanPat = (function () {
      var cv = G.offscreen(4, 4, function (c) {
        c.fillStyle = 'rgba(0,0,0,0)'; c.fillRect(0, 0, 4, 4);
        c.fillStyle = 'rgba(8,12,20,.22)'; c.fillRect(0, 3, 4, 1);
      });
      return cv.getContext('2d').createPattern(cv, 'repeat');
    })();
    bgGlow = G.offscreen(256, 256, function (c) {
      var gg = c.createRadialGradient(128, 128, 0, 128, 128, 128);
      gg.addColorStop(0, 'rgba(255,226,164,.75)');
      gg.addColorStop(0.4, 'rgba(232,168,76,.22)');
      gg.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = gg; c.fillRect(0, 0, 256, 256);
    });
    osCanvas = G.offscreen(OW, OH, function () {});
    osCtx = osCanvas.getContext('2d');
    codeScreen = G.offscreen(160, 96, function (c) { c.fillStyle = C('navy'); c.fillRect(0, 0, 160, 96); });
    deskArt = G.offscreen(OW, OH, function (c) {
      c.fillStyle = C('navy'); c.fillRect(0, 0, OW, OH);
      c.fillStyle = C('black');
      for (var y = 0; y < OH; y += 2) for (var x = (y / 2) % 4; x < OW; x += 8) c.fillRect(x, y, 2, 1);
      c.fillStyle = C('teal'); c.fillRect(0, 0, OW, 10);
      c.fillStyle = C('black'); c.fillRect(0, 9, OW, 1);
      txt(c, 'BRAMBLE 16  /  2.4', 3, 1, C('white'), 1);
      c.fillStyle = C('lgray'); c.fillRect(0, OH - 15, OW, 15);
      c.fillStyle = C('white'); c.fillRect(0, OH - 15, OW, 1);
      c.fillStyle = C('black'); c.fillRect(0, OH - 1, OW, 1);
    });
  }

  /* ---------- OS windowing ---------- */
  function reg(win, x, y, w, h, cmd, arg) {
    S.regions.push({ x: win.x + x, y: win.y + 9 + y, w: w, h: h, cmd: cmd, arg: arg, win: win });
  }
  function frame(c, x, y, w, h, color, label2) {
    c.fillStyle = C('black'); c.fillRect(x + 2, y + 2, w, h);
    c.fillStyle = C('white'); c.fillRect(x, y, w, 1); c.fillRect(x, y, 1, h);
    c.fillStyle = C('gray'); c.fillRect(x + w - 1, y + 1, 1, h - 1); c.fillRect(x + 1, y + h - 1, w - 1, 1);
    c.fillStyle = C('lgray'); c.fillRect(x + 1, y + 1, w - 2, h - 2);
    c.fillStyle = C('black'); c.fillRect(x + 2, y + 2, w - 4, h - 4);
    c.fillStyle = color; c.fillRect(x + 2, y + 2, w - 4, 7);
    if (label2) txt(c, label2, x + 4, y + 2, C('white'), 1);
  }
  function button(c, win, x, y, w, h, label2, cmd, arg, active) {
    var col = active ? C('teal') : C('lgray');
    var textCol = active ? C('white') : C('black');
    c.fillStyle = C('black'); c.fillRect(x + 1, y + 1, w, h);
    c.fillStyle = col; c.fillRect(x, y, w, h);
    c.fillStyle = C('white'); c.fillRect(x, y, w, 1);
    c.fillRect(x, y, 1, h);
    c.fillStyle = C('gray');
    c.fillRect(x + w - 1, y + 1, 1, h - 1);
    c.fillRect(x + 1, y + h - 1, w - 1, 1);
    var lx = x + Math.max(2, (w - tw(label2, 1)) / 2);
    txt(c, label2, lx, y + Math.max(1, (h - 8) / 2), textCol, 1);
    reg(win, x, y, w, h, cmd, arg);
  }
  function openApp(name) {
    if (!APPDEFS[name]) return null;
    for (var i = 0; i < S.windows.length; i++) if (S.windows[i].app === name) {
      var w = S.windows.splice(i, 1)[0]; S.windows.push(w); S.focus = w.id; return w;
    }
    var d = APPDEFS[name], n = S.windows.length;
    var w2 = { id: 'w' + (++S.windowsSeq), app: name, title: d.title,
      x: clamp(d.x + (n % 3) * 6, 2, OW - d.w - 2),
      y: clamp(d.y + (n % 3) * 6, 11, OH - d.h - 18), w: d.w, h: d.h };
    S.windows.push(w2); S.focus = w2.id;
    if (name !== 'sprite' && name !== 'readme') mark('open-' + name);
    return w2;
  }
  function closeWindow(id) {
    for (var i = 0; i < S.windows.length; i++) if (S.windows[i].id === id) {
      S.windows.splice(i, 1);
      if (S.windows.length) S.focus = S.windows[S.windows.length - 1].id;
      return;
    }
  }
  function focusWindow(id) {
    for (var i = 0; i < S.windows.length; i++) if (S.windows[i].id === id) {
      var w = S.windows.splice(i, 1)[0]; S.windows.push(w); S.focus = id; return w;
    }
    return null;
  }

  /* ---------- applications ---------- */
  function drawSpriteApp(c, win) {
    var gx = 6, gy = 6, cell = 6;
    c.fillStyle = C('black'); c.fillRect(gx - 2, gy - 2, 16 * cell + 4, 16 * cell + 4);
    c.fillStyle = C('gray'); c.fillRect(gx - 1, gy - 1, 16 * cell + 2, 16 * cell + 2);
    for (var y = 0; y < 16; y++) for (var x = 0; x < 16; x++) {
      var v = S.sprite[y * 16 + x];
      c.fillStyle = v === 0 ? ((x + y) % 2 ? C('navy') : C('black')) : PAL[v] || C('black');
      c.fillRect(gx + x * cell, gy + y * cell, cell, cell);
    }
    c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 1;
    reg(win, gx, gy, 16 * cell, 16 * cell, 'sprite-grid', { gx: gx, gy: gy, cell: cell });
    var px0 = 110, py0 = 6;
    for (var k = 0; k < 16; k++) {
      var sx = px0 + (k % 8) * 9, sy = py0 + Math.floor(k / 8) * 10;
      c.fillStyle = PAL[k]; c.fillRect(sx, sy, 8, 9);
      if (k === S.spriteColor) {
        c.fillStyle = C('white'); c.fillRect(sx - 1, sy - 1, 10, 1);
        c.fillRect(sx - 1, sy + 9, 10, 1); c.fillRect(sx - 1, sy, 1, 9); c.fillRect(sx + 8, sy, 1, 9);
      }
    }
    reg(win, px0, py0, 72, 20, 'sprite-pal', { px: px0, py: py0 });
    button(c, win, 110, 34, 74, 10, 'OPEN MOON', 'sprite-preset', 0);
    button(c, win, 110, 47, 74, 10, 'OPEN KETTLE', 'sprite-preset', 1);
    button(c, win, 110, 60, 74, 10, 'OPEN MOTH', 'sprite-preset', 2);
    button(c, win, 110, 73, 74, 10, 'CLEAR GRID', 'sprite-clear', 0);
    txt(c, 'COLOUR ' + S.spriteColor, 6, 108, C('amber'), 1);
    txt(c, S.editedSprite ? 'EDITED - IN THE GAME' : 'PAINT ONE PIXEL', 6, 119, C('cyan'), 1);
    txt(c, 'HOLLOWREED SPRITE', 6, 132, C('cream'), 1);
    txt(c, '16 X 16 / 16 COLOURS', 6, 143, C('gray'), 1);
  }

  function drawCodeApp(c, win) {
    var lines = S.code.lines;
    c.fillStyle = C('black'); c.fillRect(4, 4, 164, 92);
    c.fillStyle = C('navy'); c.fillRect(5, 5, 162, 90);
    for (var i = 0; i < Math.min(11, lines.length); i++) {
      var num = String(i + 1);
      txt(c, (num.length < 2 ? '0' : '') + num, 7, 7 + i * 8, C('gray'), 1);
      txt(c, lines[i].slice(0, 24), 21, 7 + i * 8,
        i === S.code.cursor ? C('amber') : C('cream'), 1);
    }
    reg(win, 4, 4, 164, 92, 'code-edit', 0);
    button(c, win, 174, 4, 46, 12, 'RUN', 'code-run', 0, true);
    button(c, win, 174, 19, 46, 11, 'SAMPLE 1', 'code-sample', 0);
    button(c, win, 174, 33, 46, 11, 'SAMPLE 2', 'code-sample', 1);
    button(c, win, 174, 47, 46, 11, 'SAMPLE 3', 'code-sample', 2);
    button(c, win, 174, 61, 46, 11, 'PRINT', 'code-print', 0);
    c.fillStyle = C('black'); c.fillRect(174, 78, 74, 62);
    c.drawImage(codeScreen, 176, 80, 70, 42);
    txt(c, S.code.err ? 'ERROR' : 'READY', 4, 100, S.code.err ? C('red') : C('green'), 1);
    if (S.code.err) {
      txt(c, S.code.err.slice(0, 27), 4, 110, C('orange'), 1);
      if (S.code.err.length > 27) txt(c, S.code.err.slice(27, 54), 4, 120, C('orange'), 1);
    } else {
      txt(c, S.code.output.slice(0, 27), 4, 110, C('cyan'), 1);
      txt(c, 'TYPE A LINE, THEN RUN', 4, 120, C('gray'), 1);
    }
    txt(c, 'EDITOR: CLICK A LINE. TYPE.', 4, 137, C('gray'), 1);
    txt(c, 'PLOT LINE BOX CIRCLE SOUND', 4, 148, C('lgray'), 1);
    txt(c, 'FOR NEXT PRINT CLS END', 4, 159, C('lgray'), 1);
  }

  function drawGameApp(c, win) {
    var px = 6, py = 6, pw = 196, ph = 128;
    c.fillStyle = C('black'); c.fillRect(px, py, pw, ph);
    c.fillStyle = C('navy'); c.fillRect(px + 1, py + 1, pw - 2, ph - 2);
    for (var s = 0; s < 26; s++) {
      var sx = px + 4 + ((s * 53 + 11) % (pw - 8)), sy = py + 4 + ((s * 29 + 5) % (ph - 8));
      c.fillStyle = (s % 3 === 0) ? C('cyan') : C('gray');
      c.fillRect(sx, sy, 1, 1);
    }
    c.fillStyle = C('teal'); c.fillRect(px + 1, py + ph - 7, pw - 2, 1);
    for (var i = 0; i < S.game.gems.length; i++) {
      var g = S.game.gems[i];
      c.fillStyle = C('amber'); c.fillRect(px + g.x - 2, py + g.y - 2, 4, 4);
      c.fillStyle = C('white'); c.fillRect(px + g.x - 1, py + g.y - 2, 2, 1);
    }
    for (var j = 0; j < S.game.hazards.length; j++) {
      var h = S.game.hazards[j];
      c.fillStyle = C('red'); c.fillRect(px + h.x - 3, py + h.y - 3, 6, 6);
      c.fillStyle = C('black'); c.fillRect(px + h.x - 1, py + h.y - 1, 2, 2);
    }
    /* hero drawn live from the Sprite editor */
    for (var yy = 0; yy < 16; yy++) for (var xx = 0; xx < 16; xx++) {
      var v = S.sprite[yy * 16 + xx];
      if (v) {
        c.fillStyle = PAL[v] || C('white');
        c.fillRect(px + S.game.hx - 8 + xx, py + ph - 22 + yy, 1, 1);
      }
    }
    reg(win, px, py, pw, ph, 'game-move', 0);
    txt(c, 'GEMS ' + S.game.score + '/8', 6, 139, C('amber'), 1);
    txt(c, 'HEARTS ' + S.game.hearts, 70, 139, C('red'), 1);
    if (S.game.won) {
      c.fillStyle = C('teal'); c.fillRect(px + 24, py + 46, pw - 48, 36);
      c.fillStyle = C('black'); c.fillRect(px + 25, py + 47, pw - 50, 34);
      txt(c, 'STAGE CLEAR', px + 62, py + 56, C('white'), 2);
      txt(c, 'YOUR SPRITE WON', px + 56, py + 70, C('amber'), 1);
    }
    if (S.game.over) txt(c, 'TRY AGAIN - CLICK FIELD', 6, 151, C('orange'), 1);
    button(c, win, 148, 137, 54, 11, 'RESTART', 'game-restart', 0);
    txt(c, 'ARROWS OR POINTER', 6, 151, C('gray'), 1);
  }

  function drawTrackerApp(c, win) {
    var x0 = 6, y0 = 8, cw = 17, chh = 13;
    for (var s = 0; s < 16; s++) {
      c.fillStyle = s === S.track.step ? C('amber') : (s % 4 === 0 ? C('gray') : C('lgray'));
      c.fillRect(x0 + s * cw, y0 - 4, cw - 2, 3);
      for (var ch = 0; ch < 4; ch++) {
        var v = S.track.grid[ch][s];
        var col = ch === 3 ? C('purple') : (ch === 0 ? C('teal') : C('blue'));
        c.fillStyle = s === S.track.step ? C('orange') : C('black');
        c.fillRect(x0 + s * cw, y0 + ch * chh, cw - 1, chh - 1);
        txt(c, v === 0 ? '---' : (ch === 3 ? 'D' + v : 'N' + v), x0 + s * cw + 2, y0 + ch * chh + 3,
          s === S.track.step ? C('white') : col, 1);
      }
    }
    reg(win, x0, y0, 16 * cw, 4 * chh, 'tracker-cell', { x: x0, y: y0, cw: cw, ch: chh });
    button(c, win, 6, 66, 44, 12, S.track.playing ? 'STOP' : 'PLAY', 'tracker-toggle', 0, S.track.playing);
    button(c, win, 54, 66, 34, 12, 'SLOW', 'tracker-tempo', -8);
    button(c, win, 92, 66, 34, 12, 'FAST', 'tracker-tempo', 8);
    button(c, win, 130, 66, 52, 12, 'LOAD SONG', 'tracker-song', 0);
    button(c, win, 186, 66, 44, 12, 'CLEAR', 'tracker-clear', 0);
    txt(c, S.track.name + '  /  ' + S.track.tempo + ' BPM', 6, 84, C('amber'), 1);
    txt(c, 'CLICK A CELL TO EDIT A NOTE', 6, 96, C('cyan'), 1);
    txt(c, 'CH 1 LEAD   CH 2 BASS', 6, 108, C('cream'), 1);
    txt(c, 'CH 3 ARP    CH 4 DRUM', 6, 120, C('cream'), 1);
    txt(c, 'PLAYS IN FOUR CHANNELS', 6, 134, C('gray'), 1);
    txt(c, 'HOLLOWREED NIGHT TRACKER', 6, 148, C('lgray'), 1);
  }

  function drawModemApp(c, win) {
    if (S.modem.state === 'idle') {
      txt(c, 'HOLLOWREED LINK 2400', 8, 8, C('amber'), 1);
      txt(c, 'THE NIGHT BOARD', 8, 24, C('white'), 2);
      txt(c, 'POSTS / FILES / A SMALL GAME', 8, 46, C('cream'), 1);
      txt(c, 'DIAL TONE AND HANDSHAKE', 8, 60, C('gray'), 1);
      txt(c, 'IN WEBAUDIO WHEN SOUND IS ON', 8, 72, C('gray'), 1);
      button(c, win, 8, 92, 74, 14, 'DIAL THE BOARD', 'modem-dial', 0, true);
      txt(c, 'NO CONNECTION', 100, 96, C('red'), 1);
    } else if (S.modem.state === 'dialing') {
      txt(c, 'DIALLING 0555 1996', 8, 12, C('amber'), 1);
      var p = clamp((S.t - S.modem.t0) / 2.4, 0, 1);
      c.fillStyle = C('black'); c.fillRect(8, 32, 200, 12);
      c.fillStyle = C('green'); c.fillRect(8, 32, Math.floor(200 * p), 12);
      txt(c, ['RINGING', 'CARRIER', 'NEGOTIATING', 'CONNECTED'][Math.min(3, Math.floor(p * 4))],
        8, 52, C('cyan'), 1);
      txt(c, '2400 / 8N1', 8, 70, C('gray'), 1);
    } else {
      button(c, win, 6, 4, 46, 11, 'POSTS', 'modem-tab', 0, S.modem.tab === 0);
      button(c, win, 55, 4, 46, 11, 'FILES', 'modem-tab', 1, S.modem.tab === 1);
      button(c, win, 104, 4, 46, 11, 'GAME', 'modem-tab', 2, S.modem.tab === 2);
      button(c, win, 208, 4, 56, 11, 'HANG UP', 'modem-hangup', 0);
      c.fillStyle = C('black'); c.fillRect(6, 18, 258, 106);
      c.fillStyle = C('navy'); c.fillRect(7, 19, 256, 104);
      if (S.modem.tab === 0) {
        for (var i = 0; i < 4; i++) {
          var idx = (S.modem.post + i) % POSTS.length, po = POSTS[idx];
          txt(c, (idx + 1) + ' ' + po.who + ' / ' + po.sub, 10, 23 + i * 25,
            i === 0 ? C('amber') : C('cyan'), 1);
          txt(c, po.body.slice(0, 42), 10, 32 + i * 25, C('cream'), 1);
        }
        button(c, win, 6, 128, 60, 11, 'NEXT POST', 'modem-post', 1);
      } else if (S.modem.tab === 1) {
        txt(c, 'DOWNLOAD AREA / HOLLOWREED', 10, 24, C('amber'), 1);
        for (var f = 0; f < FILES.length; f++) {
          txt(c, FILES[f].name, 10, 40 + f * 16, C('cyan'), 1);
          txt(c, FILES[f].size, 132, 40 + f * 16, C('cream'), 1);
          txt(c, FILES[f].note, 170, 40 + f * 16, C('gray'), 1);
        }
        txt(c, 'POSTAGE PAID ON DISK ORDERS', 10, 112, C('cream'), 1);
      } else {
        txt(c, 'THE LAMP GAME', 10, 24, C('amber'), 2);
        txt(c, 'THREE DOORS. ONE LAMP.', 10, 46, C('cream'), 1);
        txt(c, S.modem.lamp || 'PICK A DOOR: 1, 2 OR 3', 10, 62, C('cyan'), 1);
        button(c, win, 10, 80, 40, 12, 'DOOR 1', 'modem-door', 1);
        button(c, win, 58, 80, 40, 12, 'DOOR 2', 'modem-door', 2);
        button(c, win, 106, 80, 40, 12, 'DOOR 3', 'modem-door', 3);
        txt(c, 'A TEXT GAME BY R. VELL', 10, 108, C('gray'), 1);
      }
      txt(c, 'CONNECTED / 2400', 6, 146, C('green'), 1);
      txt(c, 'MODEM LIGHTS ARE ON IN THE ROOM', 6, 158, C('gray'), 1);
    }
  }

  function drawOrdersApp(c, win) {
    txt(c, 'POSTAL ORDERS / OCTOBER 1996', 6, 4, C('amber'), 1);
    for (var i = 0; i < ORDERS.length; i++) {
      var o = ORDERS[i], y = 18 + i * 22;
      c.fillStyle = i === S.orders.sel ? C('teal') : C('black');
      c.fillRect(5, y, 254, 19);
      txt(c, o.who + ' / ' + o.town, 9, y + 3, i === S.orders.sel ? C('white') : C('cream'), 1);
      txt(c, o.item + '  ' + o.paid, 9, y + 11, i === S.orders.sel ? C('amber') : C('gray'), 1);
      reg(win, 5, y, 254, 19, 'orders-select', i);
    }
    button(c, win, 6, 134, 88, 13, 'PRINT LABEL', 'orders-label', 0, true);
    txt(c, 'A LABEL GOES TO THE PRINTER', 100, 137, C('gray'), 1);
    txt(c, 'HOLLOWREED / MOONSET BY POST', 6, 154, C('cyan'), 1);
    txt(c, 'FIVE ENVELOPES LEFT TO STAMP', 6, 166, C('lgray'), 1);
  }

  function drawPrintApp(c, win) {
    txt(c, 'SEND TO THE PANTHER 9-PIN', 6, 4, C('amber'), 1);
    var srcs = ['SPRITE', 'LISTING', 'LABEL'];
    for (var i = 0; i < 3; i++)
      button(c, win, 6 + i * 72, 20, 68, 14, srcs[i], 'print-src', ['sprite', 'listing', 'label'][i],
        S.printapp.src === ['sprite', 'listing', 'label'][i]);
    c.fillStyle = C('black'); c.fillRect(6, 42, 214, 72);
    c.fillStyle = C('navy'); c.fillRect(7, 43, 212, 70);
    txt(c, S.printapp.src.toUpperCase() + ' / ' +
      (S.printapp.src === 'sprite' ? '16 X 16 DOTS' : S.printapp.src === 'listing' ? 'BASIC LISTING' : 'POSTAL LABEL'),
      12, 52, C('cream'), 1);
    var demo = ['HOLLOWREED SOFTWARE', 'MOONSET / 1996', '9 PIN / FAN FOLD', 'PAPER READY'];
    for (var d = 0; d < demo.length; d++) txt(c, demo[d], 12, 68 + d * 11, C('cyan'), 1);
    button(c, win, 6, 122, 100, 16, 'SEND TO PRINTER', 'print-send', 0, true);
    txt(c, S.printed ? 'LAST JOB: ' + S.printedKind.toUpperCase() : 'PRINTER IDLE', 6, 146, C('green'), 1);
    txt(c, 'THE PAPER FEEDS IN THE ROOM', 6, 158, C('gray'), 1);
  }

  function drawReadmeApp(c, win) {
    /* idle demo: sprite drifting across a tiny star field */
    c.fillStyle = C('black'); c.fillRect(4, 4, 94, 62);
    c.fillStyle = C('navy'); c.fillRect(5, 5, 92, 60);
    var t = env.t;
    for (var st = 0; st < 14; st++) {
      c.fillStyle = st % 4 === 0 ? C('cyan') : C('gray');
      c.fillRect(6 + ((st * 23 + Math.floor(t * 6)) % 90), 6 + ((st * 17) % 58), 1, 1);
    }
    var dx = 8 + Math.floor((Math.sin(t * 0.7) * 0.5 + 0.5) * 62);
    var dy = 18 + Math.floor((Math.cos(t * 0.9) * 0.5 + 0.5) * 24);
    for (var yy = 0; yy < 16; yy++) for (var xx = 0; xx < 16; xx++) {
      var v = S.sprite[yy * 16 + xx];
      if (v) { c.fillStyle = PAL[v] || C('white'); c.fillRect(dx + xx / 2, dy + yy / 2, 1, 1); }
    }
    txt(c, 'NIGHT SHIFT', 4, 70, C('amber'), 1);
    txt(c, 'DRAW A PIXEL.', 4, 80, C('cream'), 1);
    txt(c, 'CLEAR THE GAME.', 4, 90, C('cream'), 1);
    txt(c, 'PRINT THE SPRITE.', 4, 100, C('cream'), 1);
  }

  function drawOS(c) {
    S.regions.length = 0;
    c.drawImage(deskArt, 0, 0);
    /* live desktop status */
    var mins = 41 + Math.floor(env.t / 60) % 12;
    txt(c, '23:' + (mins < 10 ? '0' : '') + mins, 268, 1, C('white'), 1);
    txt(c, 'PROGRAMS', 4, OH - 13, C('black'), 1);
    c.fillStyle = C('black');
    c.fillRect(2, OH - 15, 58, 13);
    c.fillStyle = C('lgray'); c.fillRect(3, OH - 14, 56, 11);
    txt(c, 'PROGRAMS', 6, OH - 12, S.menu ? C('white') : C('black'), 1);
    S.regions.push({ x: 2, y: OH - 15, w: 58, h: 13, cmd: 'menu', arg: 0, win: null });
    var bx = 64;
    for (var i = 0; i < S.windows.length; i++) {
      var w = S.windows[i], aw = Math.min(52, Math.max(30, tw(w.title, 1) + 6));
      c.fillStyle = S.focus === w.id ? C('teal') : C('gray');
      c.fillRect(bx, OH - 14, aw, 11);
      txt(c, w.title.slice(0, 8), bx + 3, OH - 13, S.focus === w.id ? C('white') : C('black'), 1);
      S.regions.push({ x: bx, y: OH - 14, w: aw, h: 11, cmd: 'focus', arg: w.id, win: w });
      bx += aw + 3;
    }
    c.fillStyle = C('lgray'); c.fillRect(OW - 62, OH - 14, 60, 11);
    txt(c, 'SOUND ' + (Arcade.sound.enabled ? 'ON' : 'OFF'), OW - 60, OH - 13, C('black'), 1);

    for (var wi = 0; wi < S.windows.length; wi++) {
      var win = S.windows[wi], focused = S.focus === win.id;
      c.fillStyle = C('black'); c.fillRect(win.x + 3, win.y + 3, win.w, win.h);
      c.fillStyle = C('white'); c.fillRect(win.x, win.y, win.w, 1); c.fillRect(win.x, win.y, 1, win.h);
      c.fillStyle = C('gray');
      c.fillRect(win.x + win.w - 1, win.y + 1, 1, win.h - 1);
      c.fillRect(win.x + 1, win.y + win.h - 1, win.w - 1, 1);
      c.fillStyle = C('lgray'); c.fillRect(win.x + 1, win.y + 1, win.w - 2, win.h - 2);
      c.fillStyle = C('black'); c.fillRect(win.x + 2, win.y + 2, win.w - 4, win.h - 4);
      c.fillStyle = focused ? C('teal') : C('gray');
      c.fillRect(win.x + 2, win.y + 2, win.w - 4, 7);
      txt(c, win.title.slice(0, 26), win.x + 4, win.y + 2, C('white'), 1);
      c.fillStyle = C('red'); c.fillRect(win.x + win.w - 11, win.y + 3, 8, 6);
      txt(c, 'X', win.x + win.w - 10, win.y + 3, C('white'), 1);
      c.fillStyle = C('lgray'); c.fillRect(win.x + 3, win.y + 10, win.w - 6, win.h - 13);
      c.save();
      c.translate(win.x + 3, win.y + 10);
      c.beginPath(); c.rect(0, 0, win.w - 6, win.h - 13); c.clip();
      var appWin = { x: win.x + 3 - (win.x + 3), y: 0, w: win.w, h: win.h };
      /* region helper expects absolute window coords; body origin is win.x+3, win.y+10 */
      var regWin = { x: win.x + 3, y: win.y + 1, w: win.w - 6, h: win.h - 13, id: win.id, app: win.app };
      void appWin;
      if (win.app === 'sprite') drawSpriteApp(c, regWin);
      else if (win.app === 'code') drawCodeApp(c, regWin);
      else if (win.app === 'game') drawGameApp(c, regWin);
      else if (win.app === 'tracker') drawTrackerApp(c, regWin);
      else if (win.app === 'modem') drawModemApp(c, regWin);
      else if (win.app === 'orders') drawOrdersApp(c, regWin);
      else if (win.app === 'print') drawPrintApp(c, regWin);
      else drawReadmeApp(c, regWin);
      c.restore();
      S.regions.push({ x: win.x, y: win.y, w: win.w - 12, h: 9, cmd: 'drag', arg: win.id, win: win });
      S.regions.push({ x: win.x + win.w - 12, y: win.y + 2, w: 10, h: 8, cmd: 'close', arg: win.id, win: win });
      S.regions.push({ x: win.x, y: win.y, w: win.w, h: win.h, cmd: 'focus', arg: win.id, win: win });
    }
    if (S.menu) {
      c.fillStyle = C('black'); c.fillRect(2, 64, 112, 158);
      c.fillStyle = C('white'); c.fillRect(3, 65, 110, 1); c.fillRect(3, 65, 1, 156);
      c.fillStyle = C('lgray'); c.fillRect(4, 66, 108, 154);
      var names = ['SPRITE', 'CODE', 'GAME', 'TRACKER', 'MODEM', 'ORDERS', 'PRINT'];
      var keys = ['sprite', 'code', 'game', 'tracker', 'modem', 'orders', 'print'];
      txt(c, 'BRAMBLE 16 / APPS', 7, 68, C('black'), 1);
      for (var m = 0; m < names.length; m++) {
        c.fillStyle = m % 2 ? C('cyan') : C('white'); c.fillRect(6, 79 + m * 19, 104, 17);
        txt(c, names[m], 10, 84 + m * 19, C('black'), 1);
        S.regions.push({ x: 6, y: 79 + m * 19, w: 104, h: 17, cmd: 'open', arg: keys[m], win: null });
      }
      txt(c, 'ESC: LEAVE THE DESK', 10, 214, C('red'), 1);
    }
    /* bitmap cursor */
    var mx = Math.round(S.osMouse.x), my = Math.round(S.osMouse.y);
    c.fillStyle = C('black');
    for (var cy = 0; cy < 10; cy++) {
      var wdt = Math.max(0, 8 - cy);
      c.fillRect(mx + 1, my + 1 + cy, wdt, 1);
    }
    c.fillStyle = C('white');
    for (var cy2 = 0; cy2 < 10; cy2++) {
      var wdt2 = Math.max(0, 7 - cy2);
      c.fillRect(mx, my + cy2, wdt2, 1);
    }
  }

  /* ---------- commands ---------- */
  function paintCell(bx, by, arg) {
    var x = Math.floor(bx / arg.cell), y = Math.floor(by / arg.cell);
    if (x < 0 || y < 0 || x > 15 || y > 15) return;
    var before = S.sprite[y * 16 + x];
    S.sprite[y * 16 + x] = S.spriteColor;
    if (before !== S.spriteColor) {
      S.editedSprite = true;
      mark('sprite-pixel');
      Arcade.toast('You change a pixel. The game uses your sprite.');
    }
  }
  function runBASIC() {
    var ctx2 = codeScreen.getContext('2d');
    ctx2.fillStyle = C('navy'); ctx2.fillRect(0, 0, 160, 96);
    S.code.err = ''; S.code.output = 'RUN OK';
    var lines = S.code.lines, loop = null, steps = 0, pc = 0;
    function num(tok, ln) {
      var v = parseFloat(tok);
      if (isNaN(v)) throw new Error('line ' + (ln + 1) + ': expected a number near ' + tok);
      return v;
    }
    function drawLine(x1, y1, x2, y2, col) {
      var n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), 1);
      for (var q = 0; q <= n; q++) ctx2.fillRect(Math.round(x1 + (x2 - x1) * q / n), Math.round(y1 + (y2 - y1) * q / n), 2, 2);
    }
    try {
      while (pc < lines.length && steps++ < 2400) {
        var raw = String(lines[pc]).trim();
        var parts = raw.split(/\s+/), cmd = (parts[0] || '').toUpperCase();
        if (!raw || cmd === 'REM' || cmd.charAt(0) === "'") { pc++; continue; }
        if (cmd === 'CLS') { ctx2.fillStyle = C('navy'); ctx2.fillRect(0, 0, 160, 96); pc++; continue; }
        if (cmd === 'PLOT') {
          ctx2.fillStyle = PAL[clamp(num(parts[3], pc), 0, 15)] || C('white');
          ctx2.fillRect(num(parts[1], pc) % 160, num(parts[2], pc) % 96, 3, 3); pc++; continue;
        }
        if (cmd === 'BOX') {
          ctx2.strokeStyle = PAL[clamp(num(parts[5], pc), 0, 15)] || C('white');
          ctx2.lineWidth = 1;
          ctx2.strokeRect(num(parts[1], pc) % 160, num(parts[2], pc) % 96,
            num(parts[3], pc), num(parts[4], pc)); pc++; continue;
        }
        if (cmd === 'LINE') {
          ctx2.fillStyle = PAL[clamp(num(parts[5], pc), 0, 15)] || C('white');
          drawLine(num(parts[1], pc), num(parts[2], pc), num(parts[3], pc), num(parts[4], pc));
          pc++; continue;
        }
        if (cmd === 'CIRCLE') {
          ctx2.strokeStyle = PAL[clamp(num(parts[4], pc), 0, 15)] || C('white');
          ctx2.beginPath(); ctx2.arc(num(parts[1], pc) % 160, num(parts[2], pc) % 96,
            Math.max(1, num(parts[3], pc)), 0, 6.283); ctx2.stroke(); pc++; continue;
        }
        if (cmd === 'SOUND' || cmd === 'BEEP') {
          var f = cmd === 'BEEP' ? 660 : num(parts[1], pc);
          var d = cmd === 'BEEP' ? 0.12 : Math.max(0.04, num(parts[2], pc) / 60);
          Arcade.sound.tone({ freq: clamp(f, 40, 3000), dur: d, gain: 0.06, type: 'square', delay: steps * 0.012 });
          pc++; continue;
        }
        if (cmd === 'PRINT') {
          var s = raw.slice(5).trim().toUpperCase();
          ctx2.fillStyle = C('cream');
          for (var k = 0; k < s.length; k++) {
            var mk = FONT[s.charAt(k)] || FONT[' '];
            for (var row = 0; row < 7; row++) for (var col = 0; col < 5; col++)
              if (mk[row] & (1 << (4 - col))) ctx2.fillRect(6 + k * 6 + col, 76 + row, 1, 1);
          }
          S.code.output = s.slice(0, 24) || 'PRINTED';
          pc++; continue;
        }
        if (cmd === 'FOR') {
          loop = { var: (parts[1] || 'I').toUpperCase(), to: num(parts[3], pc), at: pc };
          pc++; continue;
        }
        if (cmd === 'NEXT') {
          if (loop) {
            loop.cur = (loop.cur || 1) + 1;
            if (loop.cur <= loop.to) { pc = loop.at + 1; continue; }
            loop = null;
          }
          pc++; continue;
        }
        if (cmd === 'END') { break; }
        if (raw.indexOf('=') > 0) { pc++; continue; }
        throw new Error('line ' + (pc + 1) + ': unknown word ' + cmd);
      }
      if (steps >= 2400) throw new Error('program ran too long / STEP LIMIT');
      Arcade.sound.tone({ freq: 880, dur: 0.06, gain: 0.05, type: 'square' });
      mark('basic-run');
    } catch (e) {
      S.code.err = e.message || 'RUN ERROR';
      Arcade.sound.tone({ freq: 160, dur: 0.18, gain: 0.06, type: 'sawtooth' });
    }
  }
  function textRows(str) {
    var rows = [];
    for (var r = 0; r < 7; r++) {
      var row = [];
      for (var i = 0; i < str.length; i++) {
        var mk = FONT[String(str).toUpperCase().charAt(i)] || FONT[' '];
        for (var c = 0; c < 5; c++) row.push(!!(mk[r] & (1 << (4 - c))));
        row.push(false);
      }
      rows.push(row);
    }
    return rows;
  }
  function printRowsFor(kind) {
    var rows = [];
    if (kind === 'sprite') {
      rows = textRows('SPRITE');
      rows.push([]);
      for (var y = 0; y < 16; y++) {
        var row = [];
        for (var x = 0; x < 16; x++) row.push(S.sprite[y * 16 + x] !== 0);
        rows.push(row);
      }
      rows.push([]);
      rows = rows.concat(textRows('OCT 1996'));
    } else if (kind === 'label') {
      var o = ORDERS[S.orders.sel];
      rows = textRows('LABEL');
      rows.push([]);
      rows = rows.concat(textRows(String(o.who).slice(0, 7)));
      rows = rows.concat(textRows(String(o.town).slice(0, 7)));
      rows.push([]);
      rows = rows.concat(textRows('DISK 1/3'));
    } else {
      rows = textRows('BASIC');
      rows.push([]);
      var ls = S.code.lines.slice(0, 3);
      for (var l = 0; l < ls.length; l++)
        rows = rows.concat(textRows(String(ls[l]).toUpperCase().slice(0, 8)));
    }
    while (rows.length > 32) rows.pop();
    return rows;
  }
  function startPrint(kind) {
    S.printapp.src = kind;
    var rows = printRowsFor(kind);
    S.print = { kind: kind, rows: rows, line: 0, t0: S.t, done: false, r0: S.r || 0 };
    S.printed = true; S.printedKind = kind;
    S.flyTarget = 0;
    S.cam.zt = 1.75; S.cam.cxt = 1320; S.cam.cyt = 520;
    S.detail = { title: 'The dot-matrix printer', line: 'The printer prints your ' + kind + ' one line at a time.' };
    S.bbsOpen = false;
    mark('print');
    Arcade.sound.noise({ dur: 0.22, gain: 0.05, freq: 2200, filter: 'bandpass' });
    Arcade.toast('The Panther 9-pin starts printing');
  }
  function modemDial() {
    if (S.modem.state !== 'idle') return;
    S.modem.state = 'dialing'; S.modem.t0 = S.t;
    Arcade.sound.tone({ freq: 350, dur: 0.5, gain: 0.05 });
    Arcade.sound.tone({ freq: 440, dur: 0.5, gain: 0.05 });
    for (var i = 0; i < 7; i++) {
      Arcade.sound.tone({ freq: 700 + i * 90, dur: 0.08, gain: 0.05, delay: 0.55 + i * 0.11, type: 'square' });
      Arcade.sound.tone({ freq: 1200 + i * 60, dur: 0.08, gain: 0.04, delay: 0.55 + i * 0.11, type: 'square' });
    }
    Arcade.sound.noise({ dur: 0.45, gain: 0.06, freq: 1700, delay: 1.4 });
    Arcade.sound.tone({ freq: 1650, dur: 0.4, gain: 0.05, delay: 1.55 });
    Arcade.sound.tone({ freq: 2100, dur: 0.3, gain: 0.04, delay: 1.9 });
    Arcade.sound.chord([440, 660, 880], 0.14, 0.04);
    mark('modem-dial');
  }

  function doCmd(cmd, arg, bx, by, right) {
    if (cmd === 'menu') { S.menu = !S.menu; return; }
    if (cmd === 'open') { S.menu = false; openApp(arg); return; }
    if (cmd === 'close') { closeWindow(arg); return; }
    if (cmd === 'focus') { focusWindow(arg); return; }
    if (cmd === 'drag') {
      var w = focusWindow(arg);
      if (w) S.drag = { id: arg, dx: S.osMouse.x - w.x, dy: S.osMouse.y - w.y };
      return;
    }
    if (cmd === 'sprite-grid') { paintCell(bx, by, arg); S.paintDrag = true; return; }
    if (cmd === 'sprite-pal') {
      var cx = Math.floor(bx / 9), cy = Math.floor(by / 10);
      S.spriteColor = clamp(cy * 8 + cx, 0, 15);
      return;
    }
    if (cmd === 'sprite-preset') { S.preset = arg; S.sprite = presetPixels(arg); return; }
    if (cmd === 'sprite-clear') { S.sprite = new Array(256).fill(0); return; }
    if (cmd === 'code-edit') { S.code.cursor = clamp(Math.floor(by / 8), 0, S.code.lines.length - 1); return; }
    if (cmd === 'code-run') { runBASIC(); return; }
    if (cmd === 'code-sample') { S.code.lines = SAMPLES[arg].lines.slice(); S.code.err = ''; S.code.sample = arg; mark('basic-sample'); return; }
    if (cmd === 'code-print') { startPrint('listing'); return; }
    if (cmd === 'game-move') { S.game.hx = clamp(bx, 12, 184); return; }
    if (cmd === 'game-restart') { resetGame(); return; }
    if (cmd === 'tracker-cell') {
      var s = clamp(Math.floor(bx / arg.cw), 0, 15), ch = clamp(Math.floor(by / arg.ch), 0, 3);
      var max = ch === 3 ? 2 : 12;
      S.track.grid[ch][s] = (S.track.grid[ch][s] + (right ? max : 1)) % (max + 1);
      mark('tracker-edit');
      return;
    }
    if (cmd === 'tracker-toggle') { S.track.playing = !S.track.playing; return; }
    if (cmd === 'tracker-tempo') { S.track.tempo = clamp(S.track.tempo + arg, 60, 220); return; }
    if (cmd === 'tracker-song') {
      S.track.grid = []; for (var q = 0; q < 4; q++) S.track.grid.push(SONG[q].slice());
      S.track.playing = true; S.track.name = 'NIGHT SHIFT'; return;
    }
    if (cmd === 'tracker-clear') {
      S.track.grid = []; for (var z = 0; z < 4; z++) S.track.grid.push(new Array(16).fill(0));
      return;
    }
    if (cmd === 'modem-dial') { modemDial(); return; }
    if (cmd === 'modem-tab') { S.modem.tab = arg; return; }
    if (cmd === 'modem-post') { S.modem.post = (S.modem.post + arg) % POSTS.length; return; }
    if (cmd === 'modem-door') {
      var winDoor = (Math.floor(env.seed) + arg * 7 + Math.floor(S.t)) % 3 + 1;
      S.modem.lamp = arg === winDoor ? 'YOU FIND THE LAMP. YOU WIN A SILVER KEY.' : 'DARK ROOM. TRY ANOTHER DOOR.';
      S.modem.lastGame = arg === winDoor ? 'WIN' : 'MISS';
      mark('bbs-game');
      return;
    }
    if (cmd === 'modem-hangup') { S.modem.state = 'idle'; S.bbsOpen = false; return; }
    if (cmd === 'orders-select') { S.orders.sel = arg; return; }
    if (cmd === 'orders-label') { startPrint('label'); openApp('print'); return; }
    if (cmd === 'print-src') { S.printapp.src = arg; return; }
    if (cmd === 'print-send') { startPrint(S.printapp.src); return; }
  }

  /* ---------- mini-game ---------- */
  function resetGame() {
    S.game.gems = []; S.game.hazards = []; S.game.score = 0;
    S.game.hearts = 3; S.game.won = false; S.game.over = false; S.game.hx = 96; S.game.spawn = 0;
  }
  function winGame() {
    if (S.game.won) return;
    S.game.won = true; S.gameWon = true;
    mark('game-clear');
    Arcade.sound.chord([523, 659, 784], 0.4, 0.07);
    Arcade.toast('You clear Lamp run with your sprite');
  }
  function stepGame(dt) {
    var g = S.game;
    if (g.won) return;
    g.spawn -= dt;
    if (g.spawn <= 0) {
      g.spawn = 0.42 + (S.R() * 0.30);
      var x = 10 + S.R() * 176;
      if (S.R() < 0.73) g.gems.push({ x: x, y: -4, vy: 46 + S.R() * 30 });
      else g.hazards.push({ x: x, y: -4, vy: 52 + S.R() * 34 });
    }
    if (g.gems.length > 14) g.gems.shift();
    if (g.hazards.length > 8) g.hazards.shift();
    if (env.input.isDown('ArrowLeft')) g.hx -= 110 * dt;
    if (env.input.isDown('ArrowRight')) g.hx += 110 * dt;
    if (osMode() && env.started && !env.auto) {
      /* pointer steering only when the game window is being used */
      if (S.mouseGame) g.hx = clamp(S.osMouse.x - (S.gameWinX || 56) - 3, 12, 184);
    }
    if (env.auto) {
      var nearest = null, bd = 1e9;
      for (var i = 0; i < g.gems.length; i++) {
        var d = Math.abs(g.gems[i].x - g.hx) + g.gems[i].y * 0.35;
        if (d < bd) { bd = d; nearest = g.gems[i]; }
      }
      if (nearest) g.hx += clamp(nearest.x - g.hx, -135 * dt, 135 * dt);
      if (g.gems.length >= 8) winGame();
    }
    g.hx = clamp(g.hx, 12, 184);
    for (var j = g.gems.length - 1; j >= 0; j--) {
      var gem = g.gems[j]; gem.y += gem.vy * dt;
      if (gem.y > 112 && Math.abs(gem.x - g.hx) < 13) {
        g.gems.splice(j, 1); g.score++;
        Arcade.sound.tone({ freq: 880 + g.score * 60, dur: 0.07, gain: 0.05, type: 'square' });
        if (g.score >= 8) winGame();
      } else if (gem.y > 132) g.gems.splice(j, 1);
    }
    for (var k = g.hazards.length - 1; k >= 0; k--) {
      var hz = g.hazards[k]; hz.y += hz.vy * dt;
      if (hz.y > 108 && Math.abs(hz.x - g.hx) < 12) {
        g.hazards.splice(k, 1); g.hearts--;
        if (g.hearts <= 0) { g.hearts = 3; g.score = Math.max(0, g.score - 2); }
        Arcade.sound.noise({ dur: 0.12, gain: 0.07, freq: 600 });
      } else if (hz.y > 132) g.hazards.splice(k, 1);
    }
  }

  function stepTracker(dt) {
    if (!S.track.playing) return;
    S.track.timer += dt;
    var spb = 60 / S.track.tempo / 4;
    while (S.track.timer >= spb) {
      S.track.timer -= spb;
      S.track.step = (S.track.step + 1) % 16;
      for (var ch = 0; ch < 4; ch++) {
        var v = S.track.grid[ch][S.track.step];
        if (!v) continue;
        if (ch === 3) {
          Arcade.sound.noise({ dur: 0.09, gain: v === 2 ? 0.07 : 0.045, freq: v === 2 ? 3600 : 1400 });
        } else {
          var f = NOTES[v] || 330;
          if (ch === 1) f /= 2;
          Arcade.sound.tone({ freq: f, dur: spb * 0.9, gain: 0.035,
            type: ch === 2 ? 'triangle' : 'square' });
        }
      }
    }
  }

  /* ---------- room rendering ---------- */
  function osScale() {
    if (env.w < 700) return { sx: env.w / OW, sy: env.h / OH, ox: 0, oy: 0 };
    var s = Math.min(env.w / OW, env.h / OH);
    if (s >= 1.4) s = Math.floor(s);
    return { sx: s, sy: s, ox: (env.w - OW * s) / 2, oy: (env.h - OH * s) / 2 };
  }
  function osMode() { return S.fly > 0.55; }
  function toOS(px, py) {
    var o = osScale();
    return { x: (px - o.ox) / o.sx, y: (py - o.oy) / o.sy };
  }
  function fromOS(ox, oy) {
    var o = osScale();
    return { x: o.ox + ox * o.sx, y: o.oy + oy * o.sy };
  }
  function camK() { return Math.max(env.w / BW, env.h / BH) * S.cam.zoom; }
  function camPar() {
    var nx = (S.ptr.x / Math.max(1, env.w) - 0.5), ny = (S.ptr.y / Math.max(1, env.h) - 0.5);
    return { x: -nx * 30, y: -ny * 20 };
  }
  function toBase(px, py) {
    var k = camK(), par = camPar();
    return { x: (px - env.w / 2 - par.x) / k + S.cam.cx,
      y: (py - env.h / 2 - par.y) / k + S.cam.cy };
  }

  function screenPath(c, x, y, w, h) {
    c.beginPath();
    c.moveTo(x + 14, y);
    c.quadraticCurveTo(x + w / 2, y - 9, x + w - 14, y);
    c.quadraticCurveTo(x + w + 8, y + h / 2, x + w - 14, y + h);
    c.quadraticCurveTo(x + w / 2, y + h + 9, x + 14, y + h);
    c.quadraticCurveTo(x - 8, y + h / 2, x + 14, y);
    c.closePath();
  }
  function drawMonitorScreen(c, t) {
    var warm = clamp((t - 0.55) / 1.35, 0, 1);
    var wobble = Math.exp(-Math.max(0, t - 0.6) * 2.2);
    c.save();
    screenPath(c, MON.x, MON.y, MON.w, MON.h);
    c.clip();
    c.fillStyle = '#05070c'; c.fillRect(MON.x, MON.y, MON.w, MON.h);
    var slices = 18, sh = MON.h / slices;
    for (var i = 0; i < slices; i++) {
      var ox = Math.sin(t * 22 + i * 0.65) * 8 * wobble;
      var oy = Math.sin(t * 14 + i * 0.9) * 2.5 * wobble;
      c.drawImage(osCanvas, 0, i * OH / slices, OW, OH / slices,
        MON.x + ox, MON.y + i * sh + oy, MON.w, sh + 1);
    }
    if (warm < 1) {
      c.fillStyle = 'rgba(2,4,8,' + (1 - warm).toFixed(3) + ')';
      c.fillRect(MON.x, MON.y, MON.w, MON.h);
      var bh = MON.h * (0.02 + warm * 0.96);
      c.fillStyle = 'rgba(214,236,236,' + (0.22 + 0.55 * (1 - warm)).toFixed(3) + ')';
      c.fillRect(MON.x, MON.y + MON.h / 2 - bh / 2, MON.w, bh);
    }
    c.fillStyle = scanPat; c.globalAlpha = 0.7;
    c.fillRect(MON.x, MON.y, MON.w, MON.h);
    c.globalAlpha = 1;
    var glass = G.linear(c, MON.x, MON.y, MON.x + MON.w * 0.8, MON.y + MON.h,
      [[0, 'rgba(255,255,244,.12)'], [0.35, 'rgba(190,210,230,.035)'], [1, 'rgba(0,0,0,.18)']]);
    c.fillStyle = glass; c.fillRect(MON.x, MON.y, MON.w, MON.h);
    var vg = G.radial(c, MON.x + MON.w / 2, MON.y + MON.h / 2, MON.h * 0.15,
      MON.x + MON.w / 2, MON.y + MON.h / 2, MON.w * 0.72,
      [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.55)']]);
    c.fillStyle = vg; c.fillRect(MON.x, MON.y, MON.w, MON.h);
    c.globalAlpha = 0.03 + 0.02 * Math.sin(t * 27);
    c.fillStyle = '#9fc8c0'; c.fillRect(MON.x, MON.y, MON.w, MON.h);
    c.restore();
  }

  function drawPaper(c, t) {
    var pr = S.print;
    var feed = pr ? clamp(pr.line / Math.max(1, pr.rows.length), 0, 1) : 0;
    var top = PAPER.y - 28 * feed;
    var ph = PAPER.h + 28 * feed;
    c.save();
    c.fillStyle = 'rgba(0,0,0,.35)';
    c.fillRect(PAPER.x + 6, top + 6, PAPER.w, ph);
    var pg = G.linear(c, PAPER.x, top, PAPER.x + PAPER.w, top,
      [[0, '#d9d0b6'], [0.45, '#f2ead2'], [0.85, '#ded4b7'], [1, '#bdb29a']]);
    c.fillStyle = pg; c.fillRect(PAPER.x, top, PAPER.w, ph);
    c.strokeStyle = 'rgba(90,80,66,.35)'; c.lineWidth = 1;
    for (var ln = 1; ln < 9; ln++) {
      var yy = top + ph * ln / 9;
      c.beginPath(); c.setLineDash([5, 5]);
      c.moveTo(PAPER.x + 8, yy); c.lineTo(PAPER.x + PAPER.w - 8, yy); c.stroke();
      c.setLineDash([]);
    }
    for (var hole = 0; hole < 12; hole++) {
      var hy = top + 12 + hole * (ph - 20) / 12;
      c.fillStyle = '#8c8270';
      c.beginPath(); c.arc(PAPER.x + 9, hy, 2.6, 0, 6.283); c.fill();
      c.beginPath(); c.arc(PAPER.x + PAPER.w - 9, hy, 2.6, 0, 6.283); c.fill();
    }
    if (pr) {
      var lineH = Math.min(5.6, (ph - 46) / Math.max(18, pr.rows.length));
      var pitch = 5.0, dot = 3.0;
      for (var row = 0; row < Math.min(pr.line, pr.rows.length); row++) {
        var y = top + 12 + row * lineH;
        if (y > PAPER.y + PAPER.h - 22) break;
        var cols = pr.rows[row];
        for (var col = 0; col < Math.min(cols.length, 48); col++) {
          if (!cols[col]) continue;
          c.fillStyle = row % 7 === 0 ? '#3d4a52' : '#2a3238';
          c.fillRect(PAPER.x + 18 + col * pitch, y, dot, Math.max(2, lineH * 0.6));
        }
      }
      if (!pr.done) {
        var cur = Math.min(pr.rows.length - 1, Math.floor(pr.line));
        var hy = top + 12 + cur * lineH;
        var hx = PAPER.x + 18 + Math.floor((S.t * 130) % (pitch * 48));
        c.fillStyle = '#4b4237'; c.fillRect(hx - 8, hy - 2, 22, lineH + 5);
        c.fillStyle = '#d8c9a4'; c.fillRect(hx - 4, hy, 3, lineH);
      }
    } else {
      /* blank fan-fold waiting */
      label(c, 'PANTHER 9-PIN  /  PAPER READY', PAPER.x + 20, PAPER.y + 40, 12, 'rgba(60,54,44,.4)');
    }
    c.restore();
  }

  function drawRoom(ctx) {
    var k = camK(), par = camPar(), t = env.t;
    ctx.save();
    ctx.translate(env.w / 2 + par.x, env.h / 2 + par.y);
    ctx.scale(k, k);
    ctx.translate(-S.cam.cx, -S.cam.cy);
    ctx.drawImage(roomBg, par.x * 0.45 / k, par.y * 0.45 / k, BW, BH);
    ctx.drawImage(roomDesk, 0, 0, BW, BH);
    /* monitor glow on the desk */
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.16 + 0.03 * Math.sin(t * 3);
    ctx.drawImage(bgGlow, 480, 340, 560, 420);
    ctx.restore();
    drawMonitorScreen(ctx, t);
    /* live modem lights */
    if (S.bbsOpen || S.modem.state === 'dialing') {
      for (var ld = 0; ld < 8; ld++) {
        var on = Math.sin(t * 21 + ld * 1.7) > (S.modem.state === 'dialing' ? 0.55 : -0.2);
        if (!on) continue;
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.9;
        ctx.drawImage(bgGlow, 988 + ld * 22, 674, 34, 34);
        ctx.restore();
        ctx.fillStyle = '#ff5c47';
        ctx.beginPath(); ctx.arc(1004 + ld * 22, 690, 4, 0, 6.283); ctx.fill();
      }
    }
    drawPaper(ctx, t);
    /* lamp beam dust */
    for (var d = 0; d < 34; d++) {
      var ph = d * 2.399, dx = 300 + ((Math.sin(ph) * 0.5 + 0.5) * 380) + Math.sin(t * 0.4 + ph) * 14;
      var dy = 420 + ((t * 12 + d * 39) % 300);
      ctx.fillStyle = 'rgba(255,224,170,' + (0.05 + 0.11 * Math.sin(t + ph) ** 2).toFixed(3) + ')';
      ctx.fillRect(dx, dy, 1.6, 1.6);
    }
    /* rain on the window */
    ctx.save();
    ctx.beginPath(); ctx.rect(46, 62, 258, 408); ctx.clip();
    for (var rr = 0; rr < 26; rr++) {
      var rx = 46 + ((rr * 71) % 258), ry = 62 + ((t * 95 + rr * 47) % 408);
      ctx.strokeStyle = 'rgba(190,214,230,.20)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 2, ry + 15); ctx.stroke();
    }
    ctx.restore();
    ctx.restore();
  }

  function drawCaption(ctx) {
    if (!S.detail) return;
    var w = env.w, h = env.h;
    var bh = Math.max(46, h * 0.075);
    ctx.save();
    ctx.fillStyle = 'rgba(10,10,14,.78)';
    ctx.fillRect(0, h - bh, w, bh);
    ctx.fillStyle = 'rgba(224,164,74,.7)'; ctx.fillRect(0, h - bh, w, 1);
    G.copyText(ctx, S.detail.title, Math.max(14, w * 0.018), h - bh + Math.max(20, bh * 0.42),
      Math.max(13, h * 0.024), '#f4efe0', { family: 'Georgia, serif' });
    G.copyText(ctx, S.detail.line, Math.max(14, w * 0.018), h - bh + Math.max(36, bh * 0.75),
      Math.max(10, h * 0.016), 'rgba(216,210,189,.78)', { family: 'Georgia, serif' });
    G.copyText(ctx, 'ESCAPE / CLICK OUTSIDE TO LEAVE', w - Math.max(14, w * 0.018),
      h - bh + Math.max(20, bh * 0.42), Math.max(9, h * 0.014),
      'rgba(216,210,189,.5)', { family: 'Georgia, serif', align: 'right' });
    ctx.restore();
  }

  /* ---------- input ---------- */
  var KEYMAP = {
    KeyA: 'A', KeyB: 'B', KeyC: 'C', KeyD: 'D', KeyE: 'E', KeyF: 'F', KeyG: 'G',
    KeyH: 'H', KeyI: 'I', KeyJ: 'J', KeyK: 'K', KeyL: 'L', KeyM: 'M', KeyN: 'N',
    KeyO: 'O', KeyP: 'P', KeyQ: 'Q', KeyR: 'R', KeyS: 'S', KeyT: 'T', KeyU: 'U',
    KeyV: 'V', KeyW: 'W', KeyX: 'X', KeyY: 'Y', KeyZ: 'Z',
    Digit0: '0', Digit1: '1', Digit2: '2', Digit3: '3', Digit4: '4', Digit5: '5',
    Digit6: '6', Digit7: '7', Digit8: '8', Digit9: '9',
    Space: ' ', Minus: '-', Equal: '=', Comma: ',', Period: '.', Slash: '/',
    Semicolon: ';', Quote: '"', BracketLeft: '(', BracketRight: ')', Backslash: '\\'
  };
  function readTyping() {
    var win = null;
    for (var i = 0; i < S.windows.length; i++) if (S.windows[i].id === S.focus) win = S.windows[i];
    if (!win || win.app !== 'code' || !osMode()) return;
    Object.keys(KEYMAP).forEach(function (code) {
      if (env.input.justPressed(code)) {
        var ch = KEYMAP[code];
        if (ch === undefined) return;
        var ln = S.code.lines[S.code.cursor] || '';
        S.code.lines[S.code.cursor] = (ln + ch).slice(0, 32);
      }
    });
    if (env.input.justPressed('Backspace')) {
      var l2 = S.code.lines[S.code.cursor] || '';
      S.code.lines[S.code.cursor] = l2.slice(0, Math.max(0, l2.length - 1));
    }
    if (env.input.justPressed('Enter')) {
      if (S.code.lines.length < 12) {
        S.code.lines.splice(S.code.cursor + 1, 0, '');
        S.code.cursor = Math.min(S.code.lines.length - 1, S.code.cursor + 1);
      } else S.code.err = 'EDITOR FULL / 12 LINES';
    }
  }

  function findRegion(x, y) {
    var fallback = null, topIdx = -1, topWin = null;
    for (var k = 0; k < S.regions.length; k++) {
      var f = S.regions[k];
      if (f.cmd === 'focus' && f.win && inside(x, y, f)) { topIdx = k; topWin = f.win; }
    }
    for (var i = S.regions.length - 1; i >= 0; i--) {
      var r = S.regions[i];
      if (!inside(x, y, r)) continue;
      if (r.cmd === 'focus') { if (!fallback) fallback = r; continue; }
      /* controls of a covered window must not fire through the window above it */
      if (topWin && r.win && r.win.id !== topWin.id && i < topIdx) continue;
      return r;
    }
    return fallback;
  }
  function osClick(ox, oy, down, released, right) {
    if (released) { S.drag = null; S.paintDrag = false; return; }
    if (!down) return;
    var found = findRegion(ox, oy);
    if (!found) { S.menu = false; return; }
    if (found.cmd === 'game-move') S.mouseGame = true;
    doCmd(found.cmd, found.arg, ox - found.x, oy - found.y, right);
  }

  function roomClick(bx, by) {
    for (var i = 0; i < HOT.length; i++) {
      var h = HOT[i];
      if (inside(bx, by, h.r)) {
        if (h.enter) {
          S.flyTarget = 1;
          S.cam.zt = 3.1; S.cam.cxt = 730; S.cam.cyt = 400;
          S.detail = null;
          mark('enter-os');
          Arcade.toast('You sit at the desk');
        } else {
          S.cam.zt = h.zoom; S.cam.cxt = h.focus.x; S.cam.cyt = h.focus.y;
          S.detail = { title: h.title, line: h.line };
          mark('detail-' + h.key);
        }
        return;
      }
    }
    S.cam.zt = 1; S.cam.cxt = 800; S.cam.cyt = 470;
    S.detail = null;
  }

  /* ---------- scripted bot ---------- */
  function botTargetOS(x, y) { return { x: x, y: y }; }
  function botClick(x, y) {
    S.osMouse = { x: x, y: y };
    var found = findRegion(x, y);
    if (found) doCmd(found.cmd, found.arg, x - found.x, y - found.y, false);
    S.ptr = fromOS(x, y);
  }
  function stepBot(dt) {
    var b = S.bot;
    b.t += dt;
    if (b.phase === 0 && b.t > 1.6) {
      S.flyTarget = 1; S.cam.zt = 3.1; S.cam.cxt = 730; S.cam.cyt = 400;
      b.phase = 1; b.target = botTargetOS(60, 78);
    } else if (b.phase === 1 && b.t > 2.7) {
      var sw = null;
      for (var i = 0; i < S.windows.length; i++) if (S.windows[i].app === 'sprite') sw = S.windows[i];
      if (sw) {
        focusWindow(sw.id);
        var gx = sw.x + 3 + 6 + 8 * 6 + 3, gy = sw.y + 10 + 6 + 7 * 6 + 3;
        S.spriteColor = 7;
        botClick(gx, gy);
      }
      b.phase = 2; b.target = botTargetOS(160, 120);
    } else if (b.phase === 2 && b.t > 3.6) {
      var gw = openApp('game');
      if (gw) { S.gameWinX = gw.x + 3; focusWindow(gw.id); }
      b.phase = 3;
    } else if (b.phase === 3 && S.gameWon) {
      b.phase = 4; b.target = botTargetOS(170, 140);
    } else if (b.phase === 4 && b.t > 5.2) {
      var pw = openApp('print');
      if (pw) { focusWindow(pw.id); S.printWin = pw; }
      b.target = botTargetOS(125, 145);
      b.phase = 5;
    } else if (b.phase === 5 && b.t > 6.1) {
      if (S.printWin) botClick(S.printWin.x + 3 + 20, S.printWin.y + 10 + 27);
      b.phase = 6;
    } else if (b.phase === 6 && b.t > 7.0) {
      if (S.printWin) botClick(S.printWin.x + 3 + 50, S.printWin.y + 10 + 130);
      b.phase = 7;
    }
    /* smooth cursor motion toward the current target */
    var k = Math.min(1, dt * 5);
    S.osMouse.x += (b.target.x - S.osMouse.x) * k;
    S.osMouse.y += (b.target.y - S.osMouse.y) * k;
    S.ptr = fromOS(S.osMouse.x, S.osMouse.y);
    if (b.t > 18 && !S.gameWon) winGame();
    if (b.t > 22 && !S.print) startPrint('sprite');
    if (b.t > 30 && !S.finished) finishRun(true);
  }

  function viewInit() {
    var v = env.view, os = env.params.get('os') === '1';
    if (v === 'screen' || v === 'os' || os) { S.fly = 1; S.flyTarget = 1; S.cam.zoom = 3.1; S.cam.cx = 730; S.cam.cy = 400; S.cam.zt = 3.1; S.cam.cxt = 730; S.cam.cyt = 400; }
    else if (v === 'desk') { S.cam.zoom = S.cam.zt = 1.35; S.cam.cx = S.cam.cxt = 800; S.cam.cy = S.cam.cyt = 590; }
    else if (v === 'printer') { S.cam.zoom = S.cam.zt = 1.85; S.cam.cx = S.cam.cxt = 1330; S.cam.cy = S.cam.cyt = 560; S.detail = { title: 'The dot-matrix printer', line: 'The printer holds fan-fold paper. It prints the sprite you draw.' }; }
    else if (v === 'detail') { S.cam.zoom = S.cam.zt = 1.9; S.cam.cx = S.cam.cxt = 520; S.cam.cy = S.cam.cyt = 190; S.detail = { title: 'The order board', line: 'Pins hold postal orders. You see a level on graph paper.' }; }
    if (env.state === 'end') { S.printed = true; S.printedKind = 'sprite'; S.editedSprite = true; S.gameWon = true; } else if (env.state === 'last') {
      S.editedSprite = true; S.gameWon = true; S.printapp.src = 'sprite';
    }
  }

  function step(dt) {
    if (dt <= 0) return;
    S.t += dt;
    if (env.input.justPressed('Escape')) {
      if (osMode()) {
        S.flyTarget = 0;
        S.cam.zt = 1; S.cam.cxt = 800; S.cam.cyt = 470;
        S.detail = null;
      } else { S.cam.zt = 1; S.cam.cxt = 800; S.cam.cyt = 470; S.detail = null; }
    }
    readTyping();

    var clicks = env.input.consumeClicks();
    if (env.auto || !env.started) {
      /* attract / bot owns the pointer */
    } else if (osMode()) {
      var m = env.input.mouse;
      var o = toOS(m.x, m.y);
      S.osMouse = { x: clamp(o.x, 0, OW - 1), y: clamp(o.y, 0, OH - 1) };
      S.ptr = { x: m.x, y: m.y };
      for (var ci = 0; ci < clicks.length; ci++) {
        var c = clicks[ci];
        var op = toOS(c.x, c.y);
        osClick(op.x, op.y, !c.released, !!c.released, !!c.right);
      }
      if (S.drag) {
        var w = focusWindow(S.drag.id);
        if (w) {
          w.x = clamp(S.osMouse.x - S.drag.dx, 0, OW - w.w);
          w.y = clamp(S.osMouse.y - S.drag.dy, 10, OH - w.h - 16);
        }
      }
      if (S.paintDrag && env.input.mouse.left) {
        for (var ri = S.regions.length - 1; ri >= 0; ri--) {
          var rg = S.regions[ri];
          if (rg.cmd === 'sprite-grid' && inside(S.osMouse.x, S.osMouse.y, rg)) {
            paintCell(S.osMouse.x - rg.x, S.osMouse.y - rg.y, rg.arg);
            break;
          }
        }
      }
      /* pointer steers the game when its window is focused and hovered */
      var fw = null;
      for (var fi2 = 0; fi2 < S.windows.length; fi2++) if (S.windows[fi2].id === S.focus) fw = S.windows[fi2];
      if (fw && fw.app === 'game') {
        S.gameWinX = fw.x + 3;
        if (S.mouseGame && inside(S.osMouse.x, S.osMouse.y, { x: fw.x + 3 + 6, y: fw.y + 10 + 6, w: 196, h: 128 })) {
          S.game.hx = clamp(S.osMouse.x - fw.x - 3 - 6, 12, 184);
        }
      }
    } else {
      S.ptr = { x: env.input.mouse.x, y: env.input.mouse.y };
      for (var cj = 0; cj < clicks.length; cj++) {
        var cc = clicks[cj];
        if (!cc.released && !cc.right) {
          var bp = toBase(cc.x, cc.y);
          roomClick(bp.x, bp.y);
        }
      }
      var bpd = toBase(env.input.mouse.x, env.input.mouse.y), hovered = false;
      for (var hi = 0; hi < HOT.length; hi++) {
        if (inside(bpd.x, bpd.y, HOT[hi].r)) {
          hovered = true;
          if (!S.detail) S.detail = { title: HOT[hi].title, line: 'Click for a closer look.' };
          break;
        }
      }
      if (!hovered && S.detail && S.detail.line === 'Click for a closer look.') S.detail = null;
    }

    if (env.auto) stepBot(dt);
    else if (!env.started) {
      /* idle attract: pointer drifts and the OS demo keeps moving */
      S.ptr = { x: env.w * (0.5 + 0.16 * Math.sin(env.t * 0.35)),
        y: env.h * (0.5 + 0.10 * Math.cos(env.t * 0.27)) };
      S.osMouse = { x: 160 + 70 * Math.sin(env.t * 0.5), y: 120 + 40 * Math.cos(env.t * 0.4) };
    }

    if (S.modem.state === 'dialing' && S.t - S.modem.t0 > 2.4) {
      S.modem.state = 'bbs'; S.bbsOpen = true; mark('bbs-open');
    }
    if (S.modem.state === 'idle') S.bbsOpen = false;

    S.fly += (S.flyTarget - S.fly) * Math.min(1, dt * 3.0);
    S.cam.zoom += (S.cam.zt - S.cam.zoom) * Math.min(1, dt * 2.4);
    S.cam.cx += (S.cam.cxt - S.cam.cx) * Math.min(1, dt * 2.4);
    S.cam.cy += (S.cam.cyt - S.cam.cy) * Math.min(1, dt * 2.4);

    var gameOpen = false;
    for (var go = 0; go < S.windows.length; go++) if (S.windows[go].app === 'game') gameOpen = true;
    if (gameOpen || (env.auto && S.bot.phase >= 2) || env.state === 'last') stepGame(dt);
    stepTracker(dt);
    if (S.print && !S.print.done) {
      var prevLine = S.print.line;
      S.print.line += dt * 9;
      var newLine = Math.floor(S.print.line);
      if (newLine > Math.floor(prevLine) && newLine % 2 === 0) {
        Arcade.sound.noise({ dur: 0.045, gain: 0.045, freq: 2600, filter: 'bandpass' });
        Arcade.sound.tone({ freq: 180, dur: 0.035, gain: 0.02, type: 'square' });
      }
      if (S.print.line >= S.print.rows.length) {
        S.print.line = S.print.rows.length;
        S.print.done = true;
        S.print.doneT = S.t;
        Arcade.sound.tone({ freq: 320, dur: 0.12, gain: 0.05, type: 'square' });
        mark('print-finished');
      }
    }
    if (S.print && S.print.done && !S.finished && S.t - S.print.doneT > 3.6) finishRun(false);
    if (env.auto && !env.frozen && S.t > 40 && !S.finished) finishRun(true);
  }

  /* ---------- main frame ---------- */
  function onFrame(ctx) {
    if (!osCanvas) {
      buildRoom();
      freshState();
      viewInit();
      openApp('sprite');
      openApp('readme');
      var startupApp = env.params.get('app');
      if (startupApp && APPDEFS[startupApp]) { var aw = openApp(startupApp); if (aw) focusWindow(aw.id); }
      if (env.state === 'end') {
        S.fly = 1; S.flyTarget = 1;
        finishRun(false);
      }
      if (env.auto) { S.fly = 0; S.flyTarget = 0; }
    }
    if (env.frozen && !prerolled) {
      var n = Math.min(5400, Math.max(0, Math.floor(env.t * 60)));
      for (var f = 0; f < n; f++) step(1 / 60);
      prerolled = true;
    } else if (!env.frozen) step(env.dt);

    drawOS(osCtx);
    ctx.save();
    drawRoom(ctx);
    G.grain(ctx, env.w, env.h, 0.05);
    G.vignette(ctx, env.w, env.h, 0.46);
    ctx.restore();
    if (S.fly > 0.01) {
      ctx.save();
      ctx.globalAlpha = s01(S.fly);
      var o = osScale();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(osCanvas, o.ox, o.oy, OW * o.sx, OH * o.sy);
      ctx.restore();
    }
    if (S.fly < 0.9) drawCaption(ctx);
  }
})();
