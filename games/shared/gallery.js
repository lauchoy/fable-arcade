import { clamp, mix, quat } from './scene-runtime.js';

export function gallery(e) {
  const s = e.state; s.targets = Array.from({ length: 15 }, (_, i) => ({ id: i, hit: false, fall: 0, position: [] }));
  s.shots = []; s.fired = 0; s.hits = 0; s.combo = 0; s.cooldown = 0; s.nextBot = 1;
  function direction(click) {
    const camera = e.camera, f = camera.target.map((v, i) => v - camera.eye[i]);
    const length = Math.hypot(...f); for (let i = 0; i < 3; i++) f[i] /= length;
    const right = [f[2] * -1, 0, f[0]], rl = Math.hypot(...right); right.forEach((v, i) => right[i] = v / rl);
    const up = [right[1] * f[2] - right[2] * f[1], right[2] * f[0] - right[0] * f[2], right[0] * f[1] - right[1] * f[0]];
    const k = Math.tan(camera.fov * Math.PI / 360), nx = (click.x / e.w * 2 - 1) * k * e.w / e.h, ny = (1 - click.y / e.h * 2) * k;
    const v = f.map((x, i) => x + right[i] * nx + up[i] * ny), l = Math.hypot(...v);
    return v.map(x => x / l);
  }
  function fire(click) {
    if (s.cooldown > 0 || e.done) return;
    s.cooldown = 0.32; s.fired++; s.recoil = 0.2;
    const d = direction(click), p = [...e.camera.eye];
    s.shots.push({ p, v: d.map(x => x * 25), age: 0 });
    if (s.shots.length > 8) s.shots.shift();
    e.sound(180); Arcade.sound.noise({ dur: 0.05, gain: 0.06, freq: 800 });
  }
  e.panel('<p>Aim at the plates. Corks drop with distance. Clear all three rows.</p>');
  e.button('Fire at centre', () => fire({ x: e.w / 2, y: e.h / 2 }));
  e.update = dt => {
    s.cooldown = Math.max(0, s.cooldown - dt); s.recoil = Math.max(0, (s.recoil || 0) - dt * 2);
    s.targets.forEach((t, i) => {
      const p = e.base.get('target-' + i).translation;
      t.position = [p[0] + (i >= 5 && i < 10 ? Math.sin(e.t * 0.8) * 0.25 : 0), p[1] + 0.35, p[2]];
      if (t.hit) t.fall = Math.min(Math.PI / 2, t.fall + dt * 5);
      e.set('target-' + i, { translation: [t.position[0], p[1], p[2]], rotation: quat([1, 0, 0], -t.fall) });
    });
    for (const c of e.pointer.clicks) if (c.button === 0) fire(c);
    if (e.pressed.has('Space')) fire({ x: e.w / 2, y: e.h / 2 });
    if (e.auto && e.t >= s.nextBot) {
      const t = s.targets.find(t => !t.hit);
      if (t) {
        const travel = Math.hypot(...t.position.map((v, i) => v - e.camera.eye[i])) / 25;
        const p = e.project([t.position[0], t.position[1] + 0.75 * travel * travel, t.position[2]]);
        fire(p);
      }
      s.nextBot = e.t + 0.63;
    }
    for (const shot of s.shots) {
      for (let time = 0; time < dt; time += 1 / 120) {
        const h = Math.min(1 / 120, dt - time); shot.age += h;
        shot.v[1] -= 1.5 * h; shot.p = shot.p.map((v, i) => v + shot.v[i] * h);
        const target = s.targets.find(t => !t.hit && Math.hypot(...t.position.map((v, i) => v - shot.p[i])) < 0.45);
        if (target) {
          target.hit = true; shot.age = 3; s.hits++; s.combo++;
          e.mark('plate-' + target.id, 100 + Math.floor(target.id / 5) * 100 + s.combo * 10);
          e.sound(800); break;
        }
      }
    }
    s.shots = s.shots.filter(shot => shot.age < 2);
    const latest = s.shots.at(-1);
    if (latest) { e.hide('cork', false); e.set('cork', { translation: latest.p }); } else e.hide('cork');
    e.set('gun', { translation: [1.3 + e.pointer.nx * 0.3, 0.45, 3.2 + s.recoil] });
    e.status('Round ' + Math.min(3, Math.floor(s.hits / 5) + 1) + '/3. ' + s.hits + '/15 plates. ' + s.fired + ' shots.');
    if (s.hits === 15) e.finish();
  };
}
