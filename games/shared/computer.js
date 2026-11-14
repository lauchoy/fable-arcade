import { clamp, mix } from './scene-runtime.js';

const colours = ['#162b2d', '#f2e9ca', '#d86c4c', '#d4a64c', '#517e6a', '#4b7c9b', '#a56f90', '#8b7e60',
  '#334e45', '#dfc6a0', '#a53e35', '#958847', '#6d9e82', '#759cad', '#735878', '#bbb8a1'];
export function computer(e) {
  const s = e.state; s.pixels = Array(256).fill(0); s.ink = 2; s.drawn = false; s.gameWon = false;
  s.printed = false; s.spritePrinted = false; s.printTime = 0; s.app = ''; s.os = e.params.has('os'); s.gx = 18; s.tokens = [false, false, false];
  s.notes = Array.from({ length: 4 }, (_, row) => Array.from({ length: 16 }, (_, i) => i % (row + 2) === 0));
  const os = document.createElement('section'); os.className = 'os'; os.hidden = !s.os;
  os.innerHTML = '<header><b>POSTBOX / 1996</b><button type="button" data-close>Back to room</button></header><nav></nav><div class="os-content"></div>';
  document.body.append(os);
  const content = os.querySelector('.os-content');
  os.querySelector('[data-close]').onclick = () => { s.os = false; os.hidden = true; };
  const open = app => { s.os = true; os.hidden = false; show(app); };
  e.button('Use computer', () => open('Sprite'));
  e.button('Look at printer', () => { s.os = false; os.hidden = true; s.lookPrinter = true; });
  e.panel('<p>Draw a sprite. Use it in the game. Print your sprite on the desk.</p>');
  function paint(i) {
    s.pixels[i] = s.ink; s.drawn = true;
    e.set('screen-pixel-' + i, { material: ['ink', 'cream', 'coral', 'gold', 'green', 'blue'][s.ink % 6] });
    e.hide('screen-pixel-' + i, s.ink === 0);
    const p = content.querySelector('[data-pixel="' + i + '"]'); if (p) p.style.background = colours[s.ink];
    e.mark('sprite', 100);
  }
  function print(kind = 'sprite') {
    if (!s.drawn && kind === 'sprite') { message('Draw a sprite first.'); return; }
    s.printedPixels = kind === 'sprite' ? [...s.pixels] : Array.from({ length: 256 }, (_, i) => i % 16 < 12 && Math.floor(i / 16) % 3 === 0 ? 1 : 0);
    s.printKind = kind; s.printed = false; s.printing = true; s.printTime = 0; s.lookPrinter = true; s.os = false; os.hidden = true;
  }
  function message(text) {
    let p = content.querySelector('.message');
    if (!p) { p = document.createElement('p'); p.className = 'message'; p.setAttribute('aria-live', 'polite'); content.append(p); }
    p.textContent = text;
  }
  function button(label, fn) { return e.button(label, fn, content); }
  function show(app) {
    s.app = app; content.innerHTML = '';
    if (app === 'Sprite') {
      const palette = document.createElement('div'); palette.className = 'palette';
      colours.forEach((c, i) => { const b = document.createElement('button'); b.style.background = c; b.ariaLabel = 'Colour ' + (i + 1); b.onclick = () => { s.ink = i; }; palette.append(b); });
      const grid = document.createElement('div'); grid.className = 'pixel-grid';
      s.pixels.forEach((v, i) => { const b = document.createElement('button'); b.dataset.pixel = i; b.ariaLabel = 'Pixel ' + (i + 1); b.style.background = colours[v]; b.onpointerdown = event => { event.preventDefault(); paint(i); }; b.onpointerenter = event => { if (event.buttons === 1) paint(i); }; grid.append(b); });
      content.append(palette, grid); button('Print sprite', () => print());
    } else if (app === 'Code') {
      const code = document.createElement('textarea'); code.ariaLabel = 'Program'; code.value = 'CLS\nPRINT HELLO FROM POSTBOX\nRECT 30 30 100 40\nTONE 440';
      content.append(code);
      const output = document.createElement('pre'); content.append(output);
      const draw = document.createElement('canvas'); draw.width = 300; draw.height = 120; draw.style.maxWidth = '100%'; content.append(draw);
      button('Run', () => {
        output.textContent = ''; const ctx = draw.getContext('2d'); ctx.fillStyle = colours[0]; ctx.fillRect(0, 0, 300, 120);
        const lines = code.value.split('\n').slice(0, 100);
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim(); let m;
          if (!line || line === 'CLS') continue;
          if ((m = /^PRINT (.{0,160})$/i.exec(line))) output.textContent += m[1] + '\n';
          else if ((m = /^TONE (\d{2,4})$/i.exec(line))) e.sound(clamp(Number(m[1]), 20, 4000));
          else if ((m = /^RECT (\d+) (\d+) (\d+) (\d+)$/i.exec(line))) { ctx.fillStyle = colours[2]; ctx.fillRect(...m.slice(1).map(Number)); }
          else { output.textContent += 'Line ' + (i + 1) + ': Use PRINT, RECT, CLS, or TONE.'; break; }
        }
      });
      ['PRINT HELLO\nTONE 660', 'CLS\nRECT 20 20 80 60', 'PRINT THREE NOTES\nTONE 220\nTONE 330\nTONE 440'].forEach((sample, i) => button('Sample ' + (i + 1), () => { code.value = sample; }));
    } else if (app === 'Game') {
      content.innerHTML = '<p>Use the arrow keys or buttons. Collect three disks with your sprite.</p><div class="mini-game"><div class="mini-hero"></div></div>';
      const playfield = content.querySelector('.mini-game');
      for (let i = 0; i < 3; i++) { const t = document.createElement('div'); t.className = 'mini-token'; t.dataset.token = i; t.style.left = `calc((100% - 24px) * ${(100 + i * 90) / 350})`; t.style.top = '100px'; playfield.append(t); }
      const hero = content.querySelector('.mini-hero');
      s.pixels.forEach(v => { const pixel = document.createElement('span'); pixel.style.background = colours[v]; hero.append(pixel); });
      const left = button('Move left', () => { s.gx = clamp(s.gx - 25, 0, 350); });
      const right = button('Move right', () => { s.gx = clamp(s.gx + 25, 0, 350); });
      button('Restart game', () => { s.gx = 18; s.tokens = [false, false, false]; s.gameWon = false; });
    } else if (app === 'Tracker') {
      content.innerHTML = '<p>Four tracks. Select a step to change a note. Sound starts only after you enable it.</p>';
      s.notes.forEach((track, row) => { const r = document.createElement('div'); r.className = 'palette'; track.forEach((value, step) => { const b = e.button(value ? '●' : '·', () => { track[step] = !track[step]; b.textContent = track[step] ? '●' : '·'; }, r); b.ariaLabel = 'Track ' + (row + 1) + ' step ' + (step + 1); }); content.append(r); });
      button('Play or stop', () => { s.playMusic = !s.playMusic; });
    } else if (app === 'Modem') {
      content.innerHTML = '<p>Local bulletin board. No network connection.</p>';
      button('Dial', () => {
        [320, 600, 1200, 900, 1800].forEach((freq, i) => Arcade.sound.tone({ freq, dur: 0.18, delay: i * 0.2, gain: 0.03 }));
        message('Connected to Reed Board. Enter READ, FILES, or NORTH.');
      });
      const input = document.createElement('input'); input.ariaLabel = 'Board command'; content.append(input);
      button('Send command', () => {
        const c = input.value.trim().toUpperCase();
        message(c === 'READ' ? 'Mara: Test the new sprite editor. Oren: The next disk ships on Friday.'
          : c === 'FILES' ? 'Available files: SPRITES.PBX, NOTES.TXT, DEMO.PBX.'
          : c === 'NORTH' ? 'You enter the archive. You find the missing program disk.' : 'Commands: READ, FILES, NORTH.');
      });
    } else if (app === 'Orders') {
      content.innerHTML = '<p>Order 031: Mara, Reed Bay. One game disk.</p><p>Order 032: Oren, North Pier. Two game disks.</p>';
      button('Print label', () => print('label'));
    } else if (app === 'Print') {
      content.innerHTML = '<p>Print the current sprite or a program listing.</p>'; button('Print sprite', () => print()); button('Print listing', () => print('listing'));
    }
  }
  ['Sprite', 'Code', 'Game', 'Tracker', 'Modem', 'Orders', 'Print'].forEach(app => e.button(app, () => show(app), os.querySelector('nav')));
  if (s.os) show(e.params.get('app') || 'Sprite');
  let nextBot = 0;
  e.update = dt => {
    if (e.pointer.clicks.length && !s.os) { const c = e.pointer.clicks[0]; if (e.nearest([[-0.8, 2.6, 0.6]], c, 130) === 0) open('Sprite'); }
    if (e.pressed.has('Escape')) { s.os = false; os.hidden = true; }
    if (e.auto && e.t > nextBot && !e.done) {
      nextBot = e.t + 0.35;
      if (!s.drawn) {
        open('Sprite');
        for (const i of [68, 69, 70, 84, 86, 100, 101, 102, 116, 118, 132, 134]) paint(i);
      } else if (!s.gameWon) { if (s.app !== 'Game') open('Game'); }
      else if (!s.spritePrinted && !s.printing) print();
    }
    if (s.os && s.app === 'Game') {
      let axis = (e.keys.has('ArrowRight') ? 1 : 0) - (e.keys.has('ArrowLeft') ? 1 : 0);
      if (e.auto) axis = s.tokens.every(Boolean) ? 0 : 1;
      s.gx = clamp(s.gx + axis * dt * 110, 0, 350);
      s.tokens.forEach((taken, i) => {
        if (!taken && Math.abs(s.gx - (100 + i * 90)) < 22) { s.tokens[i] = true; e.sound(440 + i * 110); }
        const t = content.querySelector('[data-token="' + i + '"]'); if (t) t.hidden = s.tokens[i];
      });
      const hero = content.querySelector('.mini-hero'); if (hero) { hero.style.left = `calc((100% - 24px) * ${s.gx / 350})`; hero.style.top = '100px'; }
      if (s.tokens.every(Boolean) && !s.gameWon) { s.gameWon = true; e.mark('game', 500); message('Three disks collected. Print your sprite.'); }
    }
    if (s.printing) {
      s.printTime += dt;
      const row = Math.min(15, Math.floor(s.printTime * 5));
      for (let i = 0; i < 256; i++) e.hide('pixel-' + i, !s.printedPixels[i] || Math.floor(i / 16) > row);
      e.set('print-head', { translation: [-3.4 + (Math.sin(s.printTime * 15) + 1) * 0.4, 1.99, -0.4 + row * 0.075] });
      if (s.printTime > 3.3) {
        s.printing = false; s.printed = true;
        if (s.printKind === 'sprite') { s.spritePrinted = true; e.mark('print', 300); }
        else e.mark('print-' + s.printKind, 100);
      }
    }
    if (s.playMusic && Math.floor(e.t * 4) !== s.beat) {
      s.beat = Math.floor(e.t * 4);
      s.notes.forEach((track, row) => { if (track[s.beat % 16]) Arcade.sound.tone({ freq: [220, 277, 330, 110][row], type: 'triangle', dur: 0.18, gain: 0.03 }); });
    }
    const view = e.params.get('view');
    if (s.lookPrinter || view === 'printer') e.camera = { eye: [-5.5, 4.2, 4.1], target: [-3, 1.9, 0], fov: 38 };
    else if (view === 'desk' || view === 'screen') e.camera = { eye: [0, 3.2, 5], target: [-0.8, 2.6, 0], fov: 38 };
    e.status((s.drawn ? 'Sprite drawn. ' : 'Draw a sprite. ') + (s.gameWon ? 'Game cleared. ' : 'Collect three disks. ') + (s.spritePrinted ? 'Print done.' : 'Print the sprite.'));
    if (s.drawn && s.gameWon && s.spritePrinted) e.finish();
  };
}
