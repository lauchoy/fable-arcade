import { clamp, mix, quat } from './scene-runtime.js';

export function circleBlocked(x, z, solids, radius = 0.3) {
  return solids.some(b => {
    const px = clamp(x, b.min[0], b.max[0]), pz = clamp(z, b.min[2], b.max[2]);
    return Math.hypot(x - px, z - pz) < radius;
  });
}
export function moveCircle(p, dx, dz, solids, radius = 0.3) {
  const steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / (radius * 0.6)));
  const q = [...p];
  for (let i = 0; i < steps; i++) {
    if (!circleBlocked(q[0] + dx / steps, q[2], solids, radius)) q[0] += dx / steps;
    if (!circleBlocked(q[0], q[2] + dz / steps, solids, radius)) q[2] += dz / steps;
  }
  return q;
}
function segmentDistance(p, a, b) {
  const v = b.map((x, i) => x - a[i]), w = p.map((x, i) => x - a[i]);
  const t = clamp(w.reduce((s, x, i) => s + x * v[i], 0) / (v.reduce((s, x) => s + x * x, 0) || 1), 0, 1);
  return Math.hypot(...p.map((x, i) => x - a[i] - v[i] * t));
}
export function segmentBox(a, b, box) {
  let enter = 0, leave = 1, axis = -1;
  for (let i = 0; i < 3; i++) {
    const d = b[i] - a[i];
    if (Math.abs(d) < 1e-9) {
      if (a[i] < box.min[i] || a[i] > box.max[i]) return null;
      continue;
    }
    const lo = Math.min((box.min[i] - a[i]) / d, (box.max[i] - a[i]) / d);
    const hi = Math.max((box.min[i] - a[i]) / d, (box.max[i] - a[i]) / d);
    if (lo > enter) { enter = lo; axis = i; }
    leave = Math.min(leave, hi);
    if (enter > leave) return null;
  }
  return { t: enter, axis };
}
export function world(e) {
  const s = e.state, pin = e.id === 'under-the-glass', war = e.id === 'breakwater';
  const perArea = pin ? 3 : 2, hp = pin ? 1 : war ? 2 : 3;
  Object.assign(s, { player: [0, 0, 3], yaw: 0, pitch: 0, vx: 0, vz: 0, area: 0, captures: 0, capture: 0,
    health: war ? 100 : 3, bullets: [], cooldown: 0, fired: 0, charge: 0, wasDown: false,
    ammo: war ? 30 : 6, reload: 0, nextHit: 0, vehicleHp: war ? 2 : 0, launcher: false, equipped: false, smoke: false });
  const areaNames = war ? ['Market square', 'Tram bridge', 'Tower yard'] : pin ? ['Lower field', 'Bumper nest', 'Top lanes'] : ['Gate hall', 'Tunnel', 'Tower room'];
  s.enemies = Array.from({ length: perArea * 3 }, (_, i) => ({ id: i, area: Math.floor(i / perArea), hp,
    origin: [...e.base.get('enemy-' + i).translation], position: [], nextFire: 3 + i * 0.6, fall: 0 }));
  const solids = [...e.base.values()].filter(n => n.label === 'solid').map(n => ({
    id: n.id, min: n.translation.map((v, i) => v - n.scale[i] / 2), max: n.translation.map((v, i) => v + n.scale[i] / 2),
  }));
  s.solids = solids;
  const crosshair = document.createElement('div'); crosshair.className = 'crosshair'; document.body.append(crosshair);
  const pad = document.createElement('div'); pad.className = 'touch-pad active';
  for (const [label, key] of [['Turn left', 'ArrowLeft'], ['W', 'KeyW'], ['Turn right', 'ArrowRight'], ['A', 'KeyA'], ['S', 'KeyS'], ['D', 'KeyD']]) {
    const b = document.createElement('button'); b.textContent = label; b.ariaLabel = label.length === 1 ? 'Move ' + ({ W: 'forward', A: 'left', S: 'back', D: 'right' }[label]) : label;
    b.onpointerdown = event => { event.preventDefault(); e.started = true; e.keys.add(key); b.setPointerCapture(event.pointerId); };
    const release = () => e.keys.delete(key); b.onpointerup = release; b.onpointercancel = release; pad.append(b);
  }
  document.body.append(pad);
  const fireButton = document.createElement('button'); fireButton.className = 'touch-fire active'; fireButton.textContent = pin ? 'Charge' : 'Fire';
  fireButton.onpointerdown = event => { event.preventDefault(); e.started = true; s.touchFire = true; fireButton.setPointerCapture(event.pointerId); };
  fireButton.onpointerup = fireButton.onpointercancel = () => { s.touchFire = false; };
  document.body.append(fireButton);
  e.button('Reload', () => reload());
  if (war) {
    e.button('Take launcher', () => { if (s.area >= 1) { s.launcher = true; s.equipped = true; e.mark('launcher', 100); } });
    e.button('Use smoke', smoke);
  }
  e.panel('<p>' + (pin ? 'Hold to charge. Release to fire. Drop each bank of targets. Walk through the lit rings.'
    : war ? 'Clear each point. Hold the ring. Use the launcher at B. Use smoke at C.'
    : 'Hit each box bot three times. Follow the rings to the biscuit tin.') + '</p>');
  e.hint('Press W A S D to move. Use arrow keys or right-drag to look. Click for pointer lock. Press Escape to release it.');
  const stateNames = ['start', 'area1', 'area2', 'area3', 'a', 'b', 'c', 'gate', 'tunnel', 'tower'];
  const named = e.params.get('state');
  const initialArea = named === 'area2' || named === 'b' || named === 'tunnel' ? 1 : named === 'area3' || named === 'c' || named === 'tower' ? 2 : 0;
  if (initialArea) {
    s.area = initialArea; s.captures = initialArea; s.player[2] = 3 - initialArea * 11;
    s.enemies.forEach(n => { if (n.area < initialArea) n.hp = 0; });
    if (initialArea === 2) { s.vehicleHp = 0; s.launcher = true; }
  }
  function reload() { if (!s.reload) s.reload = war ? 1.1 : 0.65; }
  function smoke() {
    if (!war || s.area !== 2 || s.smoke) return;
    s.smoke = true; s.smokeTime = 0; e.mark('smoke', 100); e.sound(130);
  }
  function fire(power = 1) {
    if (s.cooldown || s.reload || e.done) return;
    if (s.ammo <= 0) { reload(); return; }
    s.ammo--; s.cooldown = war ? 0.14 : 0.24; s.recoil = 0.14; s.fired++;
    const cp = Math.cos(s.pitch), d = [Math.sin(s.yaw) * cp, Math.sin(s.pitch), -Math.cos(s.yaw) * cp];
    const speed = pin ? 16 + power * 18 : war ? 65 : 30;
    s.bullets.push({ p: [s.player[0], s.player[1] + 1.15, s.player[2]], v: d.map(x => x * speed), age: 0, enemy: false, rocket: war && s.equipped, bounces: 0 });
    e.sound(pin ? 310 : war ? 90 : 240); Arcade.sound.noise({ dur: war ? 0.13 : 0.05, freq: war ? 1200 : 2600, gain: 0.09 });
  }
  function aimAt(p) {
    const dx = p[0] - s.player[0], dz = p[2] - s.player[2];
    s.yaw = Math.atan2(dx, -dz);
    s.pitch = Math.atan2(p[1] - s.player[1] - 1.15, Math.hypot(dx, dz));
  }
  function damage() {
    if (e.t < s.nextHit || e.done) return;
    s.nextHit = e.t + 1.4; s.health -= war ? 22 : 1; s.lastDamage = e.t;
    e.sound(100);
    if (s.health <= 0) {
      s.health = war ? 100 : 3; s.player = [0, 0, 3 - s.area * 11]; s.bullets = []; s.capture = 0;
      for (const n of s.enemies) if (n.area === s.area) { n.hp = hp; n.fall = 0; }
      e.status('Area restarted.');
    }
  }
  function bot(dt) {
    const foes = s.enemies.filter(n => n.area === s.area && n.hp > 0);
    const target = war && s.area === 1 && s.vehicleHp > 0 ? { position: [0, 1.4, -15] } : foes[0];
    if (target) {
      // Walk through the centre lane and past the cover before firing sideways.
      const desiredZ = (pin ? 0.5 : -2) - s.area * 11;
      const dz = desiredZ - s.player[2];
      if (Math.abs(dz) > 0.2) s.player = moveCircle(s.player, -s.player[0] * dt * 3, Math.sign(dz) * dt * 4, solids);
      aimAt([target.position[0], target.position[1] + (target.id === undefined ? 0 : 0.8), target.position[2]]);
      if (war && s.area === 1 && s.vehicleHp) { s.launcher = true; s.equipped = true; e.mark('launcher'); }
      if (pin) { s.charge += dt; if (s.charge > 0.45) { fire(s.charge); s.charge = 0; } }
      else fire();
    } else {
      const goalZ = -4.5 - s.area * 11;
      s.yaw = 0; s.pitch = 0;
      s.player = moveCircle(s.player, -s.player[0] * dt * 4, clamp(goalZ - s.player[2], -1, 1) * dt * 4.5, solids);
      if (war && s.area === 2 && !s.smoke) smoke();
    }
  }
  e.update = dt => {
    s.cooldown = Math.max(0, s.cooldown - dt); s.recoil = Math.max(0, (s.recoil || 0) - dt);
    if (s.reload) { s.reload = Math.max(0, s.reload - dt); if (!s.reload) s.ammo = war ? 30 : 6; }
    if (e.pressed.has('KeyR')) reload();
    if (e.pressed.has('KeyG')) smoke();
    if (e.pressed.has('Digit2') && s.launcher) s.equipped = !s.equipped;
    s.enemies.forEach(n => {
      n.position = [n.origin[0] + Math.sin(e.t * 0.7 + n.id) * (pin ? 0 : 0.6), n.origin[1], n.origin[2]];
      const targetYaw = Math.atan2(s.player[0] - n.position[0], s.player[2] - n.position[2]);
      if (n.hp <= 0) n.fall = Math.min(1, n.fall + dt * 2);
      e.set('enemy-' + n.id, { translation: [n.position[0], -n.fall * (pin ? 1.7 : 0.5), n.position[2]],
        rotation: pin ? quat([1, 0, 0], -n.fall * Math.PI / 2) : quat([0, 1, 0], targetYaw),
        scale: n.hp <= 0 && !pin ? [1, Math.max(0.08, 1 - n.fall), 1] : [1, 1, 1] });
      if (!pin) for (let j = 0; j < 2; j++) e.rotate('enemy-' + n.id + '-leg-' + j, [1, 0, 0], n.hp > 0 ? Math.sin(e.t * 4 + j * Math.PI) * 0.17 : 0);
      if (!pin && n.area === s.area && n.hp > 0 && e.t > n.nextFire && e.started) {
        n.nextFire = e.t + 4;
        const p = [n.position[0], 0.9, n.position[2]], d = s.player.map((v, i) => v + (i === 1 ? 0.9 : 0) - p[i]), length = Math.hypot(...d);
        s.bullets.push({ p, v: d.map(v => v / length * (war ? 16 : 6)), age: 0, enemy: true });
      }
    });
    if (e.auto && !e.done) { e.started = true; bot(dt); }
    else if (!e.done) {
      let turn = (e.keys.has('ArrowRight') ? 1 : 0) - (e.keys.has('ArrowLeft') ? 1 : 0);
      s.yaw += turn * dt * 1.7;
      if (e.pointer.right || document.pointerLockElement === e.canvas || (e.params.has('drag') && e.pointer.down)) {
        s.yaw += e.pointer.dx * 0.003; s.pitch = clamp(s.pitch - e.pointer.dy * 0.003, -0.7, 0.7);
      }
      const f = (e.keys.has('KeyW') ? 1 : 0) - (e.keys.has('KeyS') ? 1 : 0), right = (e.keys.has('KeyD') ? 1 : 0) - (e.keys.has('KeyA') ? 1 : 0);
      const speed = e.keys.has('ShiftLeft') ? 6.5 : e.keys.has('KeyC') ? 1.7 : 3.8, divisor = Math.max(1, Math.hypot(f, right));
      const vx = (Math.sin(s.yaw) * f + Math.cos(s.yaw) * right) * speed / divisor;
      const vz = (-Math.cos(s.yaw) * f + Math.sin(s.yaw) * right) * speed / divisor;
      s.vx = mix(s.vx, vx, Math.min(1, dt * 12)); s.vz = mix(s.vz, vz, Math.min(1, dt * 12));
      s.player = moveCircle(s.player, s.vx * dt, s.vz * dt, solids);
      const down = e.pointer.down || s.touchFire;
      if (pin) { if (down) s.charge = Math.min(1, s.charge + dt); if (!down && s.wasDown) { fire(s.charge); s.charge = 0; } }
      else if (down || e.pressed.has('Space')) fire();
      s.wasDown = down;
      if (e.pointer.clicks.some(c => c.button === 0) && !matchMedia('(pointer:coarse)').matches && document.pointerLockElement !== e.canvas) {
        e.canvas.requestPointerLock?.()?.catch?.(() => {});
      }
    }
    for (const bullet of s.bullets) {
      const previous = [...bullet.p];
      bullet.age += dt;
      if (pin && !bullet.enemy) bullet.v[1] -= dt * 0.35;
      bullet.p = bullet.p.map((v, i) => v + bullet.v[i] * dt);
      const wall = solids.map(box => segmentBox(previous, bullet.p, box)).filter(Boolean).sort((a, b) => a.t - b.t)[0];
      if (wall) {
        // Stop the sweep at the first wall. Targets behind it cannot take damage.
        bullet.p = previous.map((v, i) => v + (bullet.p[i] - v) * Math.max(0, wall.t - 0.001));
        if (pin && bullet.bounces < 3) {
          if (wall.axis >= 0) bullet.v[wall.axis] *= -0.8;
          bullet.bounces++;
        } else bullet.age = 5;
      }
      if (bullet.enemy) {
        if (segmentDistance([s.player[0], 0.9, s.player[2]], previous, bullet.p) < 0.43) { damage(); bullet.age = 5; }
      } else {
        const foe = s.enemies.find(n => n.hp > 0 && segmentDistance([n.position[0], 0.8, n.position[2]], previous, bullet.p) < (pin ? 0.7 : 0.6));
        if (foe) {
          foe.hp--; bullet.age = 5; e.sound(600);
          if (foe.hp === 0) e.mark('target-' + foe.id, pin ? 200 + bullet.bounces * 150 : 300);
        }
        if (war && s.vehicleHp && segmentDistance([0, 1, -15], previous, bullet.p) < 1.5) {
          if (bullet.rocket) { s.vehicleHp--; e.sound(70); }
          bullet.age = 5;
          if (!s.vehicleHp) e.mark('vehicle', 500);
        }
      }
    }
    s.bullets = s.bullets.filter(b => b.age < 3 && b.p[1] > -0.5).slice(-12);
    for (let i = 0; i < 12; i++) {
      const b = s.bullets[i]; e.hide('shot-' + i, !b);
      if (b) e.set('shot-' + i, { translation: b.p, material: b.enemy ? 'cream' : pin ? 'silver' : 'glow' });
    }
    if (pin) {
      const p = [Math.sin(e.t * 0.7) * 4.8, 0.9, -5 - s.area * 11 + Math.sin(e.t * 0.4) * 3];
      e.set('hazard', { translation: p });
      if (Math.hypot(p[0] - s.player[0], p[2] - s.player[2]) < 1.15 && e.started) damage();
    }
    const cleared = s.enemies.filter(n => n.area === s.area).every(n => !n.hp);
    const near = Math.hypot(s.player[0], s.player[2] + 4.5 + s.area * 11) < 1.3;
    const special = !war || (s.area === 1 ? !s.vehicleHp : s.area === 2 ? s.smoke && s.smokeTime > 2.5 : true);
    if (cleared && near && special) s.capture += dt; else s.capture = Math.max(0, s.capture - dt * 0.5);
    if (s.capture >= 1.3 && !e.done) {
      e.mark('area-' + s.area, 500); s.captures++; s.capture = 0;
      if (s.area === 2) e.finish(); else { s.area++; s.equipped = false; }
    }
    if (war) {
      for (let i = 0; i < 6; i++) {
        e.set('squad-' + i, { translation: [s.player[0] - 3 + (i % 3) * 3, 0, s.player[2] + 2.5 + Math.floor(i / 3)], rotation: quat([0, 1, 0], Math.PI) });
        for (let j = 0; j < 2; j++) e.rotate('squad-' + i + '-leg-' + j, [1, 0, 0], Math.sin(e.t * 5 + j * Math.PI + i) * 0.25);
      }
      e.set('aircraft', { translation: [-25 + e.t * 3 % 50, 12, -16] });
      e.set('vehicle', { rotation: quat([0, 0, 1], s.vehicleHp ? 0 : 0.2) });
      if (s.smoke) {
        s.smokeTime += dt; e.hide('smoke', false);
        e.set('smoke', { translation: [Math.sin(e.t) * 0.25, 1.2 + s.smokeTime * 0.12, -26], scale: [0.7, 1.5, 0.7].map(v => v * Math.min(s.smokeTime, 2)) });
        if (s.smokeTime > 1.2) for (let i = 0; i < 12; i++) {
          const n = e.base.get('tower-face-' + i), t = clamp(s.smokeTime - 1.2 - i * 0.03, 0, 3);
          e.set(n.id, { translation: [n.translation[0] + Math.sin(i) * t, Math.max(0.3, n.translation[1] - t * t * 3), n.translation[2] + t], rotation: quat([1, 0, 0], t * (i % 2 ? -1 : 1)) });
        }
      }
      if (s.lastDamage && e.t - s.lastDamage > 4) s.health = Math.min(100, s.health + dt * 6);
    }
    const bob = Math.sin(e.t * 8) * Math.min(0.025, Math.hypot(s.vx, s.vz) * 0.006), eyeHeight = e.keys.has('KeyC') ? 0.8 : 1.25;
    const eye = [s.player[0], s.player[1] + eyeHeight + bob, s.player[2]];
    e.camera = { eye, target: [eye[0] + Math.sin(s.yaw) * Math.cos(s.pitch), eye[1] + Math.sin(s.pitch), eye[2] - Math.cos(s.yaw) * Math.cos(s.pitch)], fov: war && e.pointer.right ? 58 : 75 };
    const wp = [eye[0] + Math.cos(s.yaw) * 0.36 + Math.sin(s.yaw) * 0.55, eye[1] - 0.4 - (s.reload ? 0.15 : 0), eye[2] + Math.sin(s.yaw) * 0.36 - Math.cos(s.yaw) * 0.55 + (s.recoil || 0)];
    e.set('weapon', { translation: wp, rotation: quat([0, 1, 0], -s.yaw) });
    if (pin) for (let i = 0; i < 8; i++) e.set('spring-' + i, { translation: [0, 0, -0.1 - i * 0.06 * (1 - s.charge * 0.65)] });
    const photo = e.params.get('view');
    if (photo === 'wide' || photo === '1') e.camera = { eye: [12, 12, 10], target: [0, 0, -13], fov: 55 };
    else if (photo === 'vehicle' || photo === '3') e.camera = { eye: [4, 3, -10], target: [0, 1, -15], fov: 45 };
    else if (photo === 'soldier' || photo === '4') e.camera = { eye: [-2, 1.5, 5], target: [-3, 0.8, 2.5], fov: 40 };
    e.status(areaNames[s.area] + '. Point ' + (s.area + 1) + '/3.\n' + (cleared ? 'Hold the ring: ' + Math.round(s.capture / 1.3 * 100) + '%.' : 'Targets left: ' + s.enemies.filter(n => n.area === s.area && n.hp > 0).length + '.')
      + '\n' + (war ? 'Health ' + Math.ceil(s.health) : 'Lives ' + s.health) + '. ' + (s.reload ? 'Reloading.' : 'Ammo ' + s.ammo + '.') + (war && s.equipped ? ' Launcher ready.' : ''));
  };
}
