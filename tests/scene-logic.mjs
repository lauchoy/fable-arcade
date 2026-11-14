import assert from 'node:assert/strict';
import { riverLevel, riverConnected, RIVER_PATHS } from '../games/shared/river.js';
import { moveCircle, circleBlocked, segmentBox } from '../games/shared/worlds.js';
import { optics } from '../games/shared/optics.js';
for (let level = 0; level < 6; level++) for (const seed of [0, 1, 7, 2026]) {
  const { tiles } = riverLevel(level, seed);
  assert.equal(riverConnected(tiles), null, `wall ${level} must start unsolved`);
  tiles.forEach(t => { t.rotation = t.goal; });
  assert.deepEqual(riverConnected(tiles), RIVER_PATHS[level]);
}
const wall = { min: [-0.1, 0, -4], max: [0.1, 2, 4] };
assert(circleBlocked(0.3, 0, [wall]));
assert(!circleBlocked(0.5, 0, [wall]));
assert(moveCircle([-1, 0, 0], 5, 0, [wall])[0] <= -0.39, 'a large move cannot tunnel through a thin wall');
assert(moveCircle([-1, 0, 0], 2, 2, [wall])[2] > 1.9, 'movement slides along walls');
assert.deepEqual(segmentBox([-3, 1, 0], [3, 1, 0], wall), { t: 2.9 / 6, axis: 0 });
assert.equal(segmentBox([-3, 3, 0], [3, 3, 0], wall), null, 'shots can pass above cover');
assert.equal(segmentBox([-3, 1, 5], [3, 1, 5], wall), null);
assert(optics(0.5, 0.78).inside, 'the known focus setting reaches the focal mark');
assert.equal(optics(0.5, 0.78).rays.length, 13);
assert(optics(0.5, 0.95).live < optics(0.5, 0).live, 'the iris blocks outer rays');
console.log('Scene logic passed: 24 river starts and solutions, collision sweeps, known focus and iris.');
