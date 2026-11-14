import { clamp, mix } from './scene-runtime.js';

export function manyHands(e) {
  const s = e.state; s.jobs = Array(8).fill(null); s.completed = 0; s.paused = false;
  const names = ['Water the plant', 'Wind the clock', 'Carry the pencil', 'Draw the plan',
    'Paint the case', 'Sort the screws', 'Read the plan', 'Fit the last part'];
  const starts = Array.from({ length: 8 }, (_, i) => [...e.base.get('helper-' + i).translation]);
  function send(i) {
    if (s.jobs[i]) return;
    s.jobs[i] = { time: 0, done: false };
    buttons[i].disabled = true; e.sound(300 + i * 50);
  }
  const buttons = names.map((name, i) => e.button(name, () => send(i)));
  e.button('Pause', event => { s.paused = !s.paused; });
  e.panel('<p>Send each helper to a job. The helpers make one music box.</p>');
  e.update = dt => {
    if (e.pressed.has('Space')) s.paused = !s.paused;
    if (e.auto && e.t > (s.nextBot || 0)) {
      const next = s.jobs.findIndex(j => !j);
      if (next >= 0) send(next);
      s.nextBot = e.t + 0.6;
    }
    if (s.paused) dt = 0;
    s.jobs.forEach((job, i) => {
      const time = e.frozen ? Math.max(0, e.t - i * 1.1) : job ? (job.time += dt) : 0;
      const a = starts[i], b = [a[0] * 1.5, 0, a[2] * 1.4], p = clamp(time / 1.2, 0, 1);
      const work = time > 1.2 && time < 3.2, back = clamp((time - 3.2) / 1.3, 0, 1);
      const x = mix(mix(a[0], b[0], p), (i % 4 - 1.5) * 0.2, back);
      const z = mix(mix(a[2], b[2], p), 1.2, back);
      e.set('helper-' + i, { translation: [x, (work ? Math.abs(Math.sin(time * 7)) : Math.abs(Math.sin(time * 10))) * (time ? 0.06 : 0.01), z] });
      for (let arm = 0; arm < 2; arm++) e.rotate('helper-' + i + '-arm-' + arm, [0, 0, 1], work ? Math.sin(time * 7 + arm) * 0.8 : 0.12);
      if (time > 2.7) {
        const f = clamp((time - 2.7) / 0.8, 0, 1), target = [Math.sin(i) * 0.6, 1, Math.cos(i) * 0.4];
        e.set('part-' + i, { translation: [mix(b[0], target[0], f), mix(0.95, target[1], f), mix(b[2], target[2], f)] });
      }
      if (job && time >= 4.5 && !job.done) {
        job.done = true; s.completed++; e.mark('job-' + i, 200); e.hide('note-' + i);
      }
    });
    e.rotate('music-ring', [0, 1, 0], e.t);
    e.status(s.completed + '/8 jobs done.' + (s.paused ? ' Paused.' : ''));
    if (s.completed === 8) e.finish();
  };
}

export function theSeed(e) {
  const s = e.state; s.season = 0; s.growth = 0.1; s.wait = 0; s.helped = false;
  const names = ['Plant the seed', 'Water the tree', 'Shade the roots', 'Clear the snow', 'Pick up the seed'];
  const seasons = ['Spring', 'Summer', 'Autumn', 'Winter', 'Spring again'];
  const colours = [[0.23, 0.42, 0.18], [0.16, 0.36, 0.12], [0.68, 0.26, 0.035], [0.6, 0.66, 0.64], [0.3, 0.5, 0.2]];
  const action = e.button(names[0], help);
  e.panel('<p>Help the tree in each season. Press Space or use the action button.</p>');
  function help() {
    if (s.helped || e.done) return;
    s.helped = true; s.wait = 0; e.mark('season-' + s.season, 200); action.disabled = true;
  }
  e.update = dt => {
    if (e.pressed.has('Space')) help();
    if (e.auto && !s.helped && e.t > 0.6) help();
    if (s.helped) {
      s.wait += dt;
      s.growth = mix(s.growth, 0.28 + s.season * 0.18, Math.min(1, dt * 1.5));
      if (s.wait > 2.2) {
        if (s.season === 4) e.finish();
        else { s.season++; s.helped = false; action.disabled = false; action.textContent = names[s.season]; }
      }
    }
    const season = e.frozen ? Math.floor(e.t / 12) % 5 : s.season;
    const growth = e.frozen ? 0.2 + season * 0.18 : s.growth;
    e.scale('tree', growth);
    for (let i = 0; i < 9; i++) {
      e.set('leaf-' + i, { material: season === 3 ? 'cream' : season === 2 ? 'gold' : 'leaves' });
      e.scale('leaf-' + i, season === 3 ? 0.3 : 1 + 0.025 * Math.sin(e.t + i));
    }
    for (let i = 0; i < 20; i++) {
      e.hide('snow-' + i, season !== 3);
      e.set('snow-' + i, { translation: [Math.sin(i * 6) * 4, 4 - (e.t * 0.3 + i * 0.13) % 4, Math.cos(i * 2) * 3] });
    }
    e.set('gardener', { translation: [-1.5, Math.abs(Math.sin(e.t * 2)) * (s.helped ? 0.07 : 0.01), 0.5] });
    e.status(seasons[season] + '. ' + (s.helped ? 'The tree is growing.' : names[s.season] + '.'));
  };
}
