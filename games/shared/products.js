import { clamp, mix, quat } from './scene-runtime.js';
import { optics, FILM_Z } from './optics.js';

export function delphi(e) {
  const s = e.state; s.scanned = []; s.questions = []; s.section = 0;
  const sections = [
    ['Research', 'We test small models. We measure errors before we change a system.'],
    ['Models', 'A model gives an estimate. Check the estimate against a known result.'],
    ['Principles', 'Keep the inputs clear. Show the limits. Let people check the result.'],
    ['Ask the oracle', 'Ask a question about learning, models, or evidence.'],
  ];
  const markers = [0, 1, 2].map(i => e.point('mark-' + i));
  const scan = i => {
    if (i < 0) return;
    if (s.scanned.includes(i)) return;
    s.scanned.push(i); e.hide('mark-' + i); e.mark('scan-' + i); s.scanY = markers[i][1];
  };
  const scanAt = click => scan(e.nearest(markers, click, Math.max(30, e.h / 18)));
  const showSection = i => {
    s.section = i;
    e.panel('<h3>' + sections[i][0] + '</h3><p>' + sections[i][1] + '</p>');
    if (i === 3) {
      const form = document.createElement('form'); form.className = 'oracle';
      const input = document.createElement('input'); input.placeholder = 'What should I test?'; input.ariaLabel = 'Your question'; input.maxLength = 160;
      const b = document.createElement('button'); b.textContent = 'Ask'; b.type = 'submit';
      const answer = document.createElement('p'); answer.setAttribute('aria-live', 'polite');
      form.append(input, b); document.querySelector('#details').append(form, answer);
      form.onsubmit = event => { event.preventDefault(); ask(input.value, answer); input.value = ''; };
    }
  };
  function ask(question, output) {
    question = question.trim();
    if (question.length < 4) { if (output) output.textContent = 'Write a complete question.'; return; }
    const key = question.toLowerCase();
    if (!s.questions.includes(key)) { s.questions.push(key); e.mark('question-' + s.questions.length); }
    const reply = /learn|study/.test(key) ? 'Test one idea. Check the result. Repeat the test.'
      : /model|ai/.test(key) ? 'A model can be wrong. Check it with evidence.'
      : /trust|evidence/.test(key) ? 'Use a result that another person can check.'
      : 'Name the problem. Test the smallest useful change.';
    if (output) output.textContent = reply;
    e.sound(520);
  }
  sections.forEach(([title], i) => e.button(title, () => showSection(i)));
  showSection(0);
  e.wheel = delta => showSection(clamp(s.section + Math.sign(delta), 0, 3));
  let botAt = 0;
  e.update = dt => {
    const sweep = e.started ? clamp(1.1 + (1 - (e.pointer.ny + 1) / 2) * 2.3, 1.1, 3.4) : 2.3 + Math.sin(e.t * 0.8) * 0.9;
    e.set('scan', { translation: [0, s.scanY ?? sweep, 0] });
    for (const c of e.pointer.clicks) {
      scanAt(c);
    }
    if (e.auto && e.t > botAt && !e.done) {
      botAt = e.t + 0.65;
      if (s.scanned.length < 3) {
        scanAt(e.project(markers[s.scanned.length]));
      } else {
        showSection(3);
        const qs = ['How do I learn?', 'Can a model be wrong?', 'What evidence can I trust?'];
        ask(qs[s.questions.length] || qs[0], document.querySelector('#details p:last-child'));
      }
    }
    e.status(s.scanned.length + '/3 scan marks. ' + Math.min(s.questions.length, 3) + '/3 questions.');
    if (s.scanned.length === 3 && s.questions.length >= 3) e.finish();
    if (dt > 0) s.scanY = undefined;
  };
}

export function tarn(e) {
  const s = e.state; s.strength = 0.15; s.stage = 0; s.explode = 0; s.hold = 0;
  const targets = [0.3, 0.6, 0.85];
  const field = e.range('Magnet strength', 0, 1, 0.01, s.strength, v => { s.strength = v; });
  const exploded = e.range('Open the speaker', 0, 1, 0.01, 0, v => { s.explode = v; });
  e.button('Change finish', () => {
    s.finish = ((s.finish || 0) + 1) % 3;
    const material = ['ink', 'silver', 'gold'][s.finish]; e.set('body-shell', { material });
  });
  e.panel('<p>Move the pointer to move the magnet. Match each field mark. Hold it steady for one second.</p>');
  e.wheel = delta => { s.explode = clamp(s.explode + Math.sign(delta) * 0.12, 0, 1); exploded.value = s.explode; };
  const spikes = [...e.base.values()].filter(n => n.id.startsWith('spike-'));
  e.update = dt => {
    if (e.keys.has('ArrowUp')) s.strength = clamp(s.strength + dt * 0.3, 0, 1);
    if (e.keys.has('ArrowDown')) s.strength = clamp(s.strength - dt * 0.3, 0, 1);
    if (e.auto && s.stage < 3) s.strength = mix(s.strength, targets[s.stage], Math.min(1, dt * 5));
    field.value = s.strength;
    const mx = e.started ? e.pointer.nx : Math.sin(e.t * 0.6) * 0.6;
    const mz = e.started ? -e.pointer.ny : Math.cos(e.t * 0.5) * 0.5;
    for (const n of spikes) {
      const d = Math.hypot(n.translation[0] - mx, n.translation[2] - mz);
      e.set(n.id, { scale: [1, 0.13 + s.strength * Math.exp(-d * d * 1.3) * (1.6 + 0.12 * Math.sin(e.t * 3)), 1] });
    }
    e.set('dome', { translation: [0, s.explode * 1.9, 0] });
    e.set('coil', { translation: [0, 0.6 + s.explode * 0.9, 0] });
    e.set('body', { translation: [0, -s.explode * 0.35, 0] });
    if (s.stage < 3 && (e.started || e.auto) && Math.abs(s.strength - targets[s.stage]) < 0.025) s.hold += dt;
    else s.hold = 0;
    if (s.hold >= 1) { e.mark('field-' + s.stage); s.stage++; s.hold = 0; }
    e.status(s.stage < 3 ? 'Field ' + (s.stage + 1) + '/3. Set strength to ' + targets[s.stage].toFixed(2) + '.' : 'All fields match.');
    if (s.stage === 3) e.finish();
  };
}

export function comb(e) {
  const s = e.state; s.fill = 0; s.streamX = 1.4; s.pouring = false; s.chapter = 0;
  const pour = e.button('Start pouring', () => { s.pouring = !s.pouring; pour.textContent = s.pouring ? 'Stop pouring' : 'Start pouring'; });
  e.range('Jar view', 0, 1, 0.01, 0, v => { s.chapter = v; });
  e.panel('<p>Guide the honey into the open jar. Keep the thread over the centre.</p>');
  e.wheel = delta => { s.chapter = clamp(s.chapter + Math.sign(delta) * 0.1, 0, 1); };
  e.update = dt => {
    if (e.auto && !s.pouring) pour.click();
    const target = e.auto ? 0 : e.pointer.nx * 3;
    s.streamX = mix(s.streamX, target, Math.min(1, dt * 4));
    e.rotate('jar', [0, 1, 0], s.chapter * Math.PI * 2);
    for (let i = 0; i < 18; i++) {
      const x = s.streamX * (1 - i / 24) + Math.sin(e.t * 4 - i * 0.4) * 0.025;
      e.set('thread-' + i, { translation: [x, 2 + i * 0.12, 0] });
      e.scale('thread-' + i, s.pouring ? 1 : 0.12);
    }
    if (s.pouring && Math.abs(s.streamX) < 0.6 && !e.done) s.fill = clamp(s.fill + dt * 0.16, 0, 1);
    e.set('fill', { translation: [0, 0.23 + s.fill * 0.7, 0], scale: [0.85, 0.06 + s.fill * 1.4, 0.85] });
    for (let i = 1; i <= 3; i++) if (s.fill >= i / 3) e.mark('fill-' + i, 250);
    e.status('Jar ' + Math.round(s.fill * 100) + '% full. ' + (Math.abs(s.streamX) < 0.6 ? 'The thread is inside.' : 'Move the thread to the centre.'));
    if (s.fill >= 1) e.finish();
  };
}

function productViews(e, target, radius) {
  let yaw = 0, view = clamp(Math.trunc(Number(e.params.get('view')) || 1), 1, 4);
  const presets = [[1, 0.55, 1.2], [0.02, 1.8, 0.02], [0.05, 0.2, 1.7], [0.7, 0.3, 0.7]];
  const change = v => { view = v; yaw = 0; };
  [1, 2, 3, 4].forEach(v => e.button('View ' + v, () => change(v)));
  return () => {
    for (let i = 1; i <= 4; i++) if (e.pressed.has('Digit' + i)) change(i);
    if (e.pointer.down) yaw += e.pointer.dx * 0.005;
    const p = presets[view - 1], r = view === 4 ? radius * 0.6 : radius;
    e.camera = { eye: [target[0] + (p[0] * Math.cos(yaw) + p[2] * Math.sin(yaw)) * r,
      target[1] + p[1] * r, target[2] + (p[2] * Math.cos(yaw) - p[0] * Math.sin(yaw)) * r], target, fov: 38 };
  };
}

export function fastLens(e) {
  const s = e.state; s.aperture = 0.1; s.focus = 0.18; s.cut = e.params.get('view') === '3'; s.stable = 0;
  const ap = e.range('Close the iris', 0, 1, 0.01, s.aperture, v => { s.aperture = v; });
  const focus = e.range('Focus', 0, 1, 0.01, s.focus, v => { s.focus = v; });
  const cut = e.button('Show section', () => { s.cut = !s.cut; cut.textContent = s.cut ? 'Close section' : 'Show section'; });
  const views = productViews(e, [0, 1.4, 0], 3.2);
  e.panel('<p>Close the iris. Set the focus. Open the section to check the rays at the blue sensor.</p>');
  const segments = [...e.base.keys()].filter(n => /^ray-/.test(n)).length / 13;
  let cached = '';
  e.update = dt => {
    if (e.keys.has('KeyA')) s.aperture = clamp(s.aperture + dt * 0.45, 0, 1);
    if (e.keys.has('KeyS')) s.aperture = clamp(s.aperture - dt * 0.45, 0, 1);
    if (e.keys.has('KeyF')) s.focus = (s.focus + dt * 0.2) % 1;
    if (e.pressed.has('KeyX')) cut.click();
    if (e.auto) {
      s.aperture = mix(s.aperture, 0.78, Math.min(1, dt * 3));
      s.focus = mix(s.focus, 0.5, Math.min(1, dt * 2));
      if (e.t > 2 && !s.cut) cut.click();
    }
    ap.value = s.aperture; focus.value = s.focus;
    views();
    if (s.cut) e.camera = { eye: [0.2, 3.1, 6.7], target: [0.2, 1.4, 0], fov: 37 };
    const result = optics(s.focus, s.aperture); s.optics = { blur: result.blur, live: result.live, blocked: result.blocked, inside: result.inside };
    const signature = [s.focus.toFixed(4), s.aperture.toFixed(4), s.cut].join(':');
    if (cached !== signature) {
      cached = signature;
      e.set('barrel', { translation: [0, 1.4 + (s.cut ? 1.2 : 0), 0] });
      for (let i = 0; i < 9; i++) e.set('blade-' + i, { translation: [0, 0.8 - s.aperture * 0.45, 0] });
      for (let i = 0; i < 7; i++) {
        const p = [...e.base.get('element-' + i).translation];
        if (i < 2) p[0] -= s.focus * 0.44;
        e.set('element-' + i, { translation: p });
      }
      result.rays.forEach((ray, i) => {
        for (let j = 0; j < segments; j++) {
          const id = 'ray-' + i + '-' + j, a = ray.pts[j], b = ray.pts[j + 1];
          if (!a || !b || !s.cut) { e.hide(id); continue; }
          const ax = (a[0] - 0.5) * 2.2, ay = 1.4 + a[1] * 2.6;
          const bx = (b[0] - 0.5) * 2.2, by = 1.4 + b[1] * 2.6;
          e.set(id, { translation: [(ax + bx) / 2, (ay + by) / 2, 0],
            scale: [Math.hypot(bx - ax, by - ay), 0.009, 0.009], rotation: quat([0, 0, 1], Math.atan2(by - ay, bx - ax)) });
        }
      });
      e.set('detector', { translation: [(FILM_Z - 0.5) * 2.2, 1.4, 0] });
    }
    if (s.aperture > 0.7) e.mark('iris');
    if (result.inside) e.mark('focus');
    if (s.cut) e.mark('section');
    if (result.inside && s.cut && !e.done && (e.started || e.auto)) s.stable += dt; else s.stable = 0;
    e.status('Sensor spread ' + (result.blur * 1000).toFixed(2) + ' mm. ' + result.live + ' rays reach the sensor.');
    if (s.stable >= 1) e.finish();
  };
}

export function crystal(e) {
  const s = e.state; s.angle = -0.9; s.stage = 0; s.hold = 0; s.ice = 0;
  const targets = [0.4, 1.6, 2.8];
  const light = e.range('Light angle', -Math.PI, Math.PI, 0.01, s.angle, v => { s.angle = v; });
  e.button('Turn the ice', () => { s.ice += Math.PI / 3; e.mark('ice'); });
  const views = productViews(e, [0, 0.95, 0], 2.6);
  e.panel('<p>Move the light to each marked angle. Hold it steady. Press Space to turn the ice.</p>');
  e.update = dt => {
    if (e.keys.has('ArrowLeft')) s.angle -= dt;
    if (e.keys.has('ArrowRight')) s.angle += dt;
    if (e.pointer.right) s.angle += e.pointer.dx * 0.01;
    if (e.pressed.has('Space')) { s.ice += Math.PI / 3; e.mark('ice'); }
    if (e.auto && s.stage < 3) s.angle = mix(s.angle, targets[s.stage], Math.min(1, dt * 4));
    light.value = s.angle;
    views();
    e.rotate('ice', [0, 1, 0], s.ice + Math.sin(e.t) * 0.03);
    e.light = { ...e.scene.environment, lightDirection: [Math.cos(s.angle) * 5, 4, Math.sin(s.angle) * 5] };
    for (let i = 0; i < 24; i++) {
      const a = i / 24 * Math.PI * 2 + s.angle;
      e.set('caustic-' + i, { translation: [Math.cos(a) * (1.5 + (i % 3) * 0.23), 0.002, Math.sin(a) * 1.5],
        rotation: quat([0, 1, 0], -a), scale: [0.015, 0.006, 0.3 + 0.2 * Math.cos(a)] });
    }
    if (s.stage < 3 && (e.started || e.auto) && Math.abs(s.angle - targets[s.stage]) < 0.04) s.hold += dt; else s.hold = 0;
    if (s.hold >= 0.8) { e.mark('light-' + s.stage, 250); s.stage++; s.hold = 0; }
    e.status(s.stage < 3 ? 'Light ' + (s.stage + 1) + '/3. Set angle to ' + targets[s.stage].toFixed(2) + '.' : 'All light marks match.');
    if (s.stage === 3) e.finish();
  };
}
