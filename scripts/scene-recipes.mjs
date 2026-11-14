import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const ids = ['delphi', 'tile-river', 'tarn', 'comb', 'many-hands', 'the-seed',
  'fast-lens', 'crystal-tumbler', 'cork-gallery', 'shareware-1996', 'under-the-glass', 'box-fort', 'breakwater'];
const q = (axis, angle) => axis.map(v => v * Math.sin(angle / 2)).concat(Math.cos(angle / 2));
export function recipeFor(id) {
  const r = {
    format: '67js.scene', schemaVersion: 1,
    geometries: [
      { id: 'box', type: 'box', bevel: 0.025, subdivisions: 2 },
      { id: 'flat', type: 'box', bevel: 0 },
      { id: 'ball', type: 'sphere', segments: 32, rings: 20 },
      { id: 'cylinder', type: 'cylinder', segments: 40, bevel: 0.015, bevelSegments: 2 },
      { id: 'ring', type: 'torus', tubeRadius: 0.035, segments: 48, sides: 8 },
    ],
    materials: [
      { id: 'ink', color: [0.015, 0.021, 0.025], roughness: 0.5 },
      { id: 'cream', color: [0.82, 0.75, 0.59], roughness: 0.7 },
      { id: 'gold', color: [0.65, 0.36, 0.10], metallic: 0.8, roughness: 0.26 },
      { id: 'silver', color: [0.7, 0.76, 0.8], metallic: 1, roughness: 0.16 },
      { id: 'coral', color: [0.8, 0.22, 0.12], roughness: 0.55, toon: 0.5 },
      { id: 'blue', color: [0.025, 0.15, 0.35], roughness: 0.28 },
      { id: 'green', color: [0.13, 0.30, 0.16], roughness: 0.7 },
      { id: 'glow', color: [0.95, 0.62, 0.18], emission: 2, roughness: 0.2 },
      { id: 'glass', tag: 'liquid', color: [0.85, 0.92, 0.97], roughness: 0.07,
        thickness: 0.12, ior: 1.5, opacity: 1, alphaMode: 'opaque', doubleSided: true },
      { id: 'wood', color: [0.45, 0.22, 0.09], roughness: 0.7,
        pattern: { type: 'wood', size: 1.8, resolution: 256, bump: 0.25, axis: 'x' } },
    ], nodes: [],
    camera: { eye: [5, 3.6, 7], target: [0, 1, 0], fov: 38 },
    environment: { setup: 'studio', world: false, ground: false, objectReflections: false,
      keyIntensity: 0.7, ambientIntensity: 0.25, fillIntensity: 0.25, daylight: 0.5,
      lightDirection: [-3, 4, 5], keyColor: [1.5, 1.35, 1.2],
      liquid: { thickness: 0.25, ior: 1.5, refraction: 0.6, scattering: 0.02 } },
    shadow: { target: [0, 0.7, 0], extent: 8, distance: 14, far: 35 },
    effects: { exposure: 0.85, bloom: { strength: 0.15, threshold: 1.2, radius: 1 },
      ambientOcclusion: 0.12, grain: 0, vignette: 0.15 },
  };
  const mat = (id, color, extra = {}) => r.materials.push({ id, color, ...extra });
  const geom = (id, type, extra) => r.geometries.push({ id, type, ...extra });
  const node = (id, geometry, material, translation, scale = [1, 1, 1], extra = {}) =>
    r.nodes.push({ id, ...(geometry ? { geometry, material } : {}), translation, scale, ...extra });
  const box = (id, m, p, s, extra) => node(id, 'box', m, p, s, extra);
  const ball = (id, m, p, s, extra) => node(id, 'ball', m, p, s, extra);
  const cyl = (id, m, p, s, extra) => node(id, 'cylinder', m, p, s, extra);
  const ring = (id, m, p, s, extra) => node(id, 'ring', m, p, s, extra);
  const group = (id, p, extra) => node(id, null, null, p, [1, 1, 1], extra);
  const text = (id, words, p, size = 0.3, m = 'gold', extra = {}) => {
    geom(id + '-type', 'text', { text: words, size, depth: 0.012, align: 'center', curveSegments: 2 });
    node(id, id + '-type', m, p, [1, 1, 1], extra);
  };
  const floor = (m = 'ink', size = 14) => box('floor', m, [0, -0.16, 0], [size, 0.25, size]);
  const person = (id, p, material = 'coral', robot = true) => {
    group(id, p);
    box(id + '-body', material, [0, 0.65, 0], [0.62, 0.55, 0.4], { parent: id });
    if (!robot) {
      ball(id + '-head', material, [0, 1.13, 0], [0.33, 0.38, 0.33], { parent: id });
      ball(id + '-helmet', 'ink', [0, 1.26, -0.015], [0.4, 0.24, 0.39], { parent: id });
      box(id + '-pack', 'ink', [0, 0.73, 0.28], [0.5, 0.55, 0.25], { parent: id });
    }
    for (let i = 0; i < 2; i++) {
      box(id + '-eye-' + i, 'ink', [-0.15 + i * 0.3, 0.72, 0.207], [0.06, 0.10, 0.025], { parent: id });
      box(id + '-arm-' + i, material, [-0.43 + i * 0.86, 0.61, 0], [0.19, 0.37, 0.22], { parent: id });
      box(id + '-leg-' + i, material, [-0.18 + i * 0.36, 0.22, 0], [0.19, 0.4, 0.25], { parent: id });
    }
  };

  if (id === 'delphi') {
    mat('marble', [0.7, 0.68, 0.61], { roughness: 0.36, pattern: { type: 'marble', resolution: 256, size: 4, bump: 0.02, colors: [[0.48, 0.49, 0.46], [0.95, 0.94, 0.87]] } });
    mat('scan', [0.12, 0.65, 0.77], { emission: 1, opacity: 0.3 });
    floor('cream');
    cyl('plinth', 'marble', [0, 0.45, 0], [2.4, 0.85, 2.4]);
    cyl('plinth-top', 'gold', [0, 0.91, 0], [2.1, 0.07, 2.1]);
    ball('shoulders', 'marble', [0, 1.45, 0], [1.85, 1.1, 0.8]);
    cyl('neck', 'marble', [0, 2.03, 0], [0.48, 0.7, 0.5]);
    ball('head', 'marble', [0, 2.65, 0], [0.92, 1.25, 0.92]);
    ball('jaw', 'marble', [0, 2.3, 0.18], [0.67, 0.48, 0.65]);
    ball('nose', 'marble', [0, 2.65, 0.51], [0.15, 0.32, 0.27]);
    for (let i = 0; i < 2; i++) {
      ball('brow-' + i, 'marble', [-0.23 + i * 0.46, 2.85, 0.39], [0.33, 0.12, 0.17]);
      ball('eye-' + i, 'cream', [-0.23 + i * 0.46, 2.76, 0.435], [0.14, 0.085, 0.08]);
      ball('ear-' + i, 'marble', [-0.47 + i * 0.94, 2.65, 0], [0.15, 0.34, 0.2]);
    }
    for (let i = 0; i < 28; i++) {
      const a = i * Math.PI * 2 / 28;
      ball('curl-' + i, 'marble', [Math.cos(a) * 0.43, 3.06 + Math.sin(a) * 0.23, -0.13], [0.25, 0.25, 0.25]);
    }
    box('scan', 'scan', [0, 2.5, 0], [2.3, 0.025, 1.5]);
    for (let i = 0; i < 3; i++) ball('mark-' + i, 'glow', [-0.5 + i * 0.5, 2.12 + i * 0.4, 0.58], [0.07, 0.07, 0.07]);
    for (let s of [-1, 1]) {
      cyl('column-' + s, 'marble', [s * 3.6, 1.5, -2], [0.7, 3.1, 0.7]);
      box('capital-' + s, 'marble', [s * 3.6, 3.05, -2], [1, 0.2, 1]);
    }
    text('name', 'D E L P H I', [0, 0.35, 1.22], 0.23);
    r.camera = { eye: [1.8, 2.7, 7.8], target: [0, 1.8, 0], fov: 35 };
  }
  if (id === 'tile-river') {
    mat('glaze', [0.9, 0.89, 0.81], { roughness: 0.19, clearcoat: 1,
      pattern: { type: 'noise', size: 0.2, resolution: 256, bump: 0.15, colors: [[0.75, 0.74, 0.68], [0.96, 0.94, 0.85]] } });
    geom('bend', 'torus', { tubeRadius: 0.075, segments: 20, sides: 8, arc: Math.PI / 2 });
    box('backing', 'wood', [0, 0, -0.22], [6.8, 6.8, 0.3]);
    for (let i = 0; i < 25; i++) {
      const x = i % 5 - 2, y = 2 - Math.floor(i / 5);
      group('tile-' + i, [x * 1.16, y * 1.16, 0]);
      box('ceramic-' + i, 'glaze', [0, 0, 0], [1.11, 1.11, 0.17], { parent: 'tile-' + i });
      group('pipe-' + i, [0, 0, 0.12], { parent: 'tile-' + i });
      box('straight-' + i, 'blue', [0, 0, 0], [1.1, 0.13, 0.035], { parent: 'pipe-' + i });
      node('bend-' + i, 'bend', 'blue', [-0.55, -0.55, 0], [0.56, 0.56, 0.56], { parent: 'pipe-' + i, visible: false });
      ball('dot-' + i, 'gold', [-0.4, 0.4, 0.11], [0.035, 0.035, 0.035], { parent: 'tile-' + i });
    }
    box('spring', 'blue', [-3.16, 0, 0.05], [0.4, 0.2, 0.15]);
    box('sea', 'blue', [3.16, 0, 0.05], [0.4, 0.2, 0.15]);
    group('boat', [-3, 0, 0.25]);
    box('boat-hull', 'gold', [0, 0, 0], [0.3, 0.12, 0.1], { parent: 'boat' });
    box('boat-sail', 'cream', [0, 0.16, 0], [0.15, 0.23, 0.025], { parent: 'boat', rotation: q([0, 0, 1], -0.2) });
    r.camera = { eye: [0, 0, 10.8], target: [0, 0, 0], fov: 39 };
  }
  if (id === 'tarn') {
    floor();
    mat('fluid', [0.035, 0.04, 0.043], { metallic: 0.97, roughness: 0.12 });
    geom('spike', 'lathe', { profile: [[0, 0], [0.21, 0], [0.21, 0.05], [0.14, 0.13], [0.07, 0.3], [0.02, 0.52], [0, 0.6]], segments: 24 });
    group('body', [0, 0, 0]);
    cyl('body-shell', 'ink', [0, 0.4, 0], [3.5, 0.8, 3.5], { parent: 'body' });
    ring('rim', 'silver', [0, 0.85, 0], [1.6, 1.6, 1.6], { rotation: q([1, 0, 0], Math.PI / 2) });
    cyl('pool', 'fluid', [0, 0.84, 0], [2.9, 0.08, 2.9]);
    group('dome', [0, 0, 0]);
    ball('dome-glass', 'glass', [0, 0.95, 0], [3.1, 0.9, 3.1], { parent: 'dome' });
    group('coil', [0, 0.6, 0]);
    for (let i = 0; i < 5; i++) ring('coil-' + i, 'gold', [0, i * 0.06, 0], [1.15, 1.15, 1.15], { parent: 'coil', rotation: q([1, 0, 0], Math.PI / 2) });
    let n = 0;
    for (let y = -4; y <= 4; y++) for (let x = -4; x <= 4; x++) {
      const px = (x + (y & 1) * 0.5) * 0.28, pz = y * 0.245;
      if (Math.hypot(px, pz) > 1.25) continue;
      node('spike-' + n++, 'spike', 'fluid', [px, 0.88, pz], [1, 0.5, 1]);
    }
    for (let i = 0; i < 64; i++) {
      const a = i / 64 * Math.PI * 2;
      ball('vent-' + i, 'silver', [Math.cos(a) * 1.74, 0.45, Math.sin(a) * 1.74], [0.025, 0.045, 0.025]);
    }
    cyl('dial', 'gold', [1.7, 0.4, 0.45], [0.24, 0.2, 0.24], { rotation: q([0, 0, 1], Math.PI / 2) });
    r.camera = { eye: [4.5, 4.2, 5.8], target: [0, 0.6, 0], fov: 34 };
  }
  if (id === 'comb' || id === 'crystal-tumbler') {
    const honey = id === 'comb';
    floor(honey ? 'cream' : 'ink');
    mat('liquid', [0.7, 0.29, 0.035], { tag: 'liquid', roughness: 0.13, opacity: 1 });
    geom('vessel', 'lathe', { profile: [[0, 0], [0.86, 0], [0.95, 0.12], [1, 1.95], [0.89, 1.99], [0.85, 0.24], [0, 0.24]], segments: honey ? 6 : 32 });
    group('jar', [0, 0, 0]);
    node('vessel', 'vessel', 'glass', [0, 0, 0], [1, 1, 1], { parent: 'jar' });
    cyl('fill', 'liquid', [0, 0.5, 0], [1.7, 0.65, 1.7], { parent: 'jar' });
    ring('lip', 'silver', [0, 1.97, 0], [0.95, 0.95, 0.95], { parent: 'jar', rotation: q([1, 0, 0], Math.PI / 2) });
    for (let i = 0; i < 18; i++) {
      const a = i * 2.4;
      ball('bead-' + i, 'glass', [Math.cos(a) * 0.96, 0.3 + i * 0.044, Math.sin(a) * 0.96], [0.04, 0.06, 0.04], { parent: 'jar' });
    }
    if (honey) {
      mat('cork', [0.48, 0.31, 0.15], { roughness: 0.95, pattern: { type: 'noise', size: 0.1, resolution: 256, bump: 0.5 } });
      cyl('lid', 'cork', [-2, 0.2, 0.1], [1.7, 0.3, 1.7]);
      box('label', 'cream', [0, 1, 0.94], [1.1, 0.58, 0.035], { parent: 'jar' });
      text('brand', 'COMB', [0, 1.04, 0.97], 0.22, 'ink', { parent: 'jar' });
      for (let i = 0; i < 18; i++) ball('thread-' + i, 'liquid', [0, 2 + i * 0.12, 0], [0.10, 0.20, 0.10]);
      cyl('dipper', 'wood', [0.3, 4.05, 0], [0.18, 1.5, 0.18], { rotation: q([0, 0, 1], -0.6) });
      for (let i = 0; i < 5; i++) ring('dipper-ring-' + i, 'wood', [0, 3.7 + i * 0.1, 0], [0.32, 0.32, 0.32], { rotation: q([1, 0, 0], Math.PI / 2) });
    } else {
      ball('ice', 'glass', [0.08, 1.13, 0], [1.35, 1.35, 1.35], { parent: 'jar' });
      for (let i = 0; i < 24; i++) {
        const a = i / 24 * Math.PI * 2;
        box('cut-' + i, 'glass', [Math.cos(a) * 0.93, 0.65, Math.sin(a) * 0.93], [0.1, 0.85, 0.14], { parent: 'jar', rotation: q([0, 1, 0], -a) });
        box('caustic-' + i, i % 3 === 0 ? 'gold' : 'cream', [Math.cos(a) * 1.65, 0.002, Math.sin(a) * 1.65], [0.025, 0.008, 0.55], { rotation: q([0, 1, 0], -a), visible: true });
      }
      for (let i = 0; i < 9; i++) ball('bubble-' + i, 'cream', [0.04, 0.9 + i * 0.045, 0.02], [0.015, 0.015, 0.015]);
    }
    r.camera = { eye: honey ? [4, 3.4, 6] : [3.8, 2.5, 4.8], target: [0, honey ? 1.7 : 0.95, 0], fov: 36 };
  }
  if (id === 'many-hands') {
    floor('wood', 18);
    box('board', 'ink', [0, 2.5, -3], [7, 3.8, 0.2]);
    box('music-box', 'wood', [0, 0.4, 0], [2.4, 0.8, 1.6]);
    cyl('spindle', 'gold', [0, 1.2, 0], [0.1, 1.2, 0.1]);
    ring('music-ring', 'gold', [0, 1.45, 0], [0.7, 0.7, 0.7], { rotation: q([1, 0, 0], Math.PI / 2) });
    for (let i = 0; i < 8; i++) {
      const x = (i % 4 - 1.5) * 1.7, z = i < 4 ? -1.7 : 2;
      person('helper-' + i, [x, 0, z]);
      box('note-' + i, 'cream', [x, 2.5 + (i < 4 ? 0.7 : -0.4), -2.85], [0.95, 0.8, 0.025]);
      box('workbench-' + i, 'wood', [x * 1.5, 0.4, z * 1.4], [1.1, 0.8, 0.8]);
      ball('part-' + i, i % 2 ? 'gold' : 'blue', [x * 1.5, 0.95, z * 1.4], [0.35, 0.35, 0.35]);
    }
    cyl('lamp-post', 'gold', [4, 2.5, -3], [0.12, 5, 0.12]);
    cyl('shade', 'green', [4, 4.7, -3], [1.5, 0.5, 1.5]);
    r.camera = { eye: [8.5, 7.5, 11], target: [0, 0.8, -0.3], fov: 40 };
    r.environment = { ...r.environment, setup: 'sunset', pointLights: [{ position: [3, 4, -2], color: [1, 0.62, 0.25], intensity: 25 }] };
  }
  if (id === 'the-seed') {
    mat('soil', [0.28, 0.15, 0.09], { roughness: 0.9 });
    mat('leaves', [0.23, 0.42, 0.18], { roughness: 0.65, toon: 0.6 });
    mat('sea', [0.10, 0.26, 0.34], { roughness: 0.2, metallic: 0.3 });
    cyl('sea', 'sea', [0, -0.8, 0], [80, 0.15, 80]);
    ball('island', 'soil', [0, -0.7, 0], [8, 1.5, 6]);
    ball('grass', 'green', [0, -0.12, 0], [7.5, 0.4, 5.5]);
    group('tree', [0.7, 0, 0]);
    cyl('trunk', 'wood', [0, 1.5, 0], [0.3, 3, 0.3], { parent: 'tree' });
    for (let i = 0; i < 9; i++) {
      const a = i * 2.4;
      ball('leaf-' + i, 'leaves', [Math.cos(a) * 0.85, 2.5 + (i % 3) * 0.4, Math.sin(a) * 0.65], [1.5, 1.1, 1.3], { parent: 'tree' });
    }
    person('gardener', [-1.5, 0, 0.5]);
    ball('seed', 'gold', [-0.7, 0.1, 0.5], [0.16, 0.22, 0.14]);
    cyl('can', 'blue', [-1.1, 0.5, 0.8], [0.35, 0.45, 0.35]);
    for (let i = 0; i < 20; i++) ball('snow-' + i, 'cream', [Math.sin(i * 6) * 4, 3 + i * 0.13, Math.cos(i * 2) * 3], [0.05, 0.05, 0.05]);
    r.camera = { eye: [7.8, 5, 10], target: [0, 1.2, 0], fov: 37 };
    r.environment = { ...r.environment, world: true, setup: 'daylight', skyTop: [0.19, 0.35, 0.47], skyBottom: [0.63, 0.74, 0.72], fogDensity: 0.006 };
  }
  if (id === 'fast-lens') {
    floor();
    group('barrel', [0, 1.4, 0], { rotation: q([0, 0, 1], Math.PI / 2) });
    for (let i = 0; i < 12; i++) ring('barrel-ring-' + i, i % 4 === 0 ? 'gold' : 'ink', [0, -1.2 + i * 0.22, 0], [1.02, 1.02, 1.02], { parent: 'barrel', rotation: q([1, 0, 0], Math.PI / 2) });
    for (let i = 0; i < 48; i++) {
      const a = i / 48 * Math.PI * 2;
      box('knurl-' + i, 'ink', [Math.cos(a), -0.7, Math.sin(a)], [0.07, 0.7, 0.08], { parent: 'barrel', rotation: q([0, 1, 0], -a) });
    }
    for (let i = 0; i < 7; i++) ball('element-' + i, 'glass', [-0.96 + i * 0.32, 1.4, 0], [0.15 + (i % 2) * 0.1, 1.75 - i * 0.06, 1.75 - i * 0.06]);
    for (let i = 0; i < 9; i++) {
      group('iris-' + i, [0.1, 1.4, 0], { rotation: q([1, 0, 0], i * Math.PI * 2 / 9) });
      box('blade-' + i, 'ink', [0, 0.56, 0], [0.045, 0.8, 0.46], { parent: 'iris-' + i, rotation: q([1, 0, 0], 0.2) });
    }
    for (let i = 0; i < 13; i++) for (let j = 0; j < 16; j++)
      box('ray-' + i + '-' + j, 'glow', [-2.5 + j * 2.1, 1.4 + (i - 4) * 0.16, 0], [2.1, 0.009, 0.009]);
    box('detector', 'blue', [3.3, 1.4, 0], [0.04, 0.7, 0.7]);
    text('lens-name', 'VESPER 50 / 1.4', [0, 0.05, 1.4], 0.16, 'cream');
    r.camera = { eye: [5.5, 4, 6], target: [0, 1.2, 0], fov: 35 };
  }
  if (id === 'cork-gallery') {
    floor('wood');
    mat('paint', [0.26, 0.065, 0.05], { roughness: 0.7 });
    box('backboard', 'paint', [0, 2.3, -3.5], [10, 5, 0.3]);
    box('counter', 'wood', [0, 0.3, 2.5], [10, 0.6, 1]);
    for (let i = 0; i < 3; i++) {
      box('shelf-' + i, 'wood', [0, 0.8 + i * 1.1, -i * 0.9], [9, 0.14, 0.6]);
      for (let j = 0; j < 5; j++) {
        const n = i * 5 + j;
        group('target-' + n, [(j - 2) * 1.55, 1 + i * 1.1, -i * 0.9]);
        ball('plate-' + n, i % 2 ? 'blue' : 'gold', [0, 0.35, 0], [0.65, 0.65, 0.13], { parent: 'target-' + n });
        ball('bull-' + n, 'cream', [0, 0.35, 0.08], [0.24, 0.24, 0.02], { parent: 'target-' + n });
        box('hinge-' + n, 'silver', [0, 0, 0], [0.26, 0.09, 0.2], { parent: 'target-' + n });
      }
    }
    for (let i = 0; i < 28; i++) {
      const a = i / 28 * Math.PI * 2;
      ball('bulb-' + i, 'glow', [Math.cos(a) * 4.75, 2.5 + Math.sin(a) * 2.3, -3.1], [0.12, 0.12, 0.12]);
    }
    text('stall', 'BRASS & CORK', [0, 4.05, -3.25], 0.42, 'cream');
    group('gun', [1.3, 0.45, 3.2]);
    cyl('gun-barrel', 'gold', [0, 0.3, -0.5], [0.17, 1.4, 0.17], { parent: 'gun', rotation: q([1, 0, 0], Math.PI / 2) });
    box('gun-stock', 'wood', [0, 0, 0], [0.28, 0.55, 0.8], { parent: 'gun' });
    ball('cork', 'wood', [0, 0, 0], [0.12, 0.12, 0.2], { visible: false });
    r.camera = { eye: [0, 2.25, 8.8], target: [0, 2.1, -1], fov: 46 };
    r.environment = { ...r.environment, setup: 'sunset' };
  }
  if (id === 'shareware-1996') {
    mat('beige', [0.56, 0.53, 0.43], { roughness: 0.65 });
    mat('screen', [0.03, 0.18, 0.15], { emission: 0.6, roughness: 0.2 });
    floor('wood', 16);
    box('wall', 'green', [0, 3.5, -3], [14, 7, 0.2]);
    box('desk', 'wood', [0, 1.2, 0], [7, 0.18, 3.2]);
    box('monitor', 'beige', [-0.8, 2.6, -0.4], [2.6, 2.1, 1.8]);
    box('screen', 'screen', [-0.8, 2.6, 0.53], [2.12, 1.55, 0.08]);
    box('monitor-foot', 'beige', [-0.8, 1.5, -0.4], [1.3, 0.4, 1.1]);
    box('tower', 'beige', [2.3, 2.3, -0.5], [1, 2.1, 1.8]);
    for (let i = 0; i < 2; i++) box('drive-' + i, 'ink', [2.3, 2.8 - i * 0.35, 0.43], [0.73, 0.1, 0.03]);
    box('keyboard', 'beige', [-0.8, 1.38, 0.95], [2.4, 0.17, 0.7]);
    for (let i = 0; i < 48; i++) box('key-' + i, 'cream', [-1.85 + i % 12 * 0.19, 1.49, 0.72 + Math.floor(i / 12) * 0.15], [0.15, 0.07, 0.12]);
    box('printer', 'beige', [-3, 1.6, 0.1], [1.35, 0.75, 1.3]);
    box('paper', 'cream', [-3, 2.1, 0.12], [1, 0.025, 1.6]);
    box('print-head', 'ink', [-3, 1.99, 0.2], [0.15, 0.1, 0.2]);
    cyl('lamp-post', 'gold', [3, 2.8, -1.2], [0.08, 3, 0.08]);
    cyl('lamp-shade', 'green', [2.7, 4.1, -1.2], [1.25, 0.5, 1.25]);
    for (let i = 0; i < 14; i++) box('book-' + i, i % 2 ? 'coral' : 'blue', [-5.4 + i * 0.29, 1.9, -2], [0.23, 1.25 + (i % 3) * 0.1, 0.75]);
    for (let i = 0; i < 256; i++) {
      box('pixel-' + i, 'ink', [-3.43 + (i % 16) * 0.057, 2.125, -0.49 + Math.floor(i / 16) * 0.075], [0.05, 0.009, 0.06], { visible: false });
      box('screen-pixel-' + i, 'coral', [-1.48 + (i % 16) * 0.085, 3.2 - Math.floor(i / 16) * 0.075, 0.58], [0.075, 0.065, 0.01], { visible: i % 17 === 0 });
    }
    r.camera = { eye: [7.2, 5.1, 8.2], target: [-0.3, 2, 0], fov: 43 };
    r.environment = { ...r.environment, setup: 'studio', keyIntensity: 0.5,
      pointLights: [{ position: [2.6, 3.7, -1], intensity: 24, color: [1, 0.63, 0.3] }] };
  }
  if (['under-the-glass', 'box-fort', 'breakwater'].includes(id)) {
    const war = id === 'breakwater', pin = id === 'under-the-glass';
    mat('wall', war ? [0.4, 0.43, 0.42] : pin ? [0.48, 0.10, 0.045] : [0.46, 0.30, 0.15],
      { roughness: war ? 0.7 : 0.85, pattern: { type: war ? 'bricks' : 'wood', size: war ? 2 : 0.7, resolution: 256, bump: 0.4 } });
    mat('ground', war ? [0.16, 0.21, 0.22] : pin ? [0.35, 0.15, 0.05] : [0.26, 0.19, 0.12],
      { roughness: war ? 0.15 : 0.65, metallic: war ? 0.35 : 0, pattern: { type: war ? 'tiles' : 'fabric', size: 0.6, resolution: 256, bump: 0.15 } });
    box('floor', 'ground', [0, -0.17, -14], [22, 0.3, 43]);
    box('left-wall', 'wall', [-8, 2, -14], [0.5, 4, 40], { label: 'solid' });
    box('right-wall', 'wall', [8, 2, -14], [0.5, 4, 40], { label: 'solid' });
    box('back-wall', 'wall', [0, 2, 5], [16, 4, 0.5], { label: 'solid' });
    box('end-wall', 'wall', [0, 2, -33], [16, 4, 0.5], { label: 'solid' });
    for (let area = 0; area < 3; area++) {
      const z = -area * 11;
      for (let s of [-1, 1]) box('divider-' + area + '-' + s, 'wall', [s * 5.6, 1.4, z - 7], [4.2, 2.8, 0.5], { label: 'solid' });
      ring('zone-' + area, 'glow', [0, 0.03, z - 4.5], [1.1, 1.1, 1.1], { rotation: q([1, 0, 0], Math.PI / 2) });
      for (let j = 0; j < (pin ? 3 : 2); j++) {
        const n = area * (pin ? 3 : 2) + j, x = pin ? (j - 1) * 3 : (j ? 3 : -3);
        if (pin) {
          group('enemy-' + n, [x, 0, z - 3.5]);
          box('target-body-' + n, 'cream', [0, 0.85, 0], [0.9, 1.5, 0.2], { parent: 'enemy-' + n });
          ball('target-mark-' + n, 'coral', [0, 0.9, 0.14], [0.4, 0.4, 0.04], { parent: 'enemy-' + n });
        } else person('enemy-' + n, [x, 0, z - 3.5], war ? 'wood' : 'cream', !war);
        if (!pin) box('cover-' + n, 'wall', [x + 1.2, 0.55, z - 1], [1.25, 1.1, 1], { label: 'solid' });
      }
      if (pin) for (let j = 0; j < 2; j++) {
        cyl('bumper-' + area + '-' + j, 'blue', [-2 + j * 4, 0.45, z - 6], [1.2, 0.9, 1.2]);
        ring('rubber-' + area + '-' + j, 'cream', [-2 + j * 4, 0.7, z - 6], [0.7, 0.7, 0.7], { rotation: q([1, 0, 0], Math.PI / 2) });
      }
      for (let j = 0; j < 10; j++) ball('lamp-' + area + '-' + j, 'glow', [-6.7 + j * 1.5, pin ? 0.05 : 3.4, z - 7.5], [0.07, 0.07, 0.07]);
    }
    group('weapon', [0.42, 0.8, 2]);
    cyl('weapon-barrel', pin ? 'silver' : war ? 'ink' : 'wood', [0, 0, -0.5], [0.15, 1.1, 0.15],
      { parent: 'weapon', rotation: q([1, 0, 0], Math.PI / 2) });
    box('weapon-body', war ? 'ink' : 'wood', [0, -0.06, 0], [0.24, 0.25, 0.65], { parent: 'weapon' });
    for (let i = 0; i < 8; i++) ring('spring-' + i, 'silver', [0, 0, -0.1 - i * 0.06], [0.13, 0.13, 0.13], { parent: 'weapon' });
    if (war) {
      box('magazine', 'ink', [0, -0.32, -0.1], [0.13, 0.4, 0.22], { parent: 'weapon' });
      box('sight', 'silver', [0, 0.23, -0.1], [0.12, 0.12, 0.12], { parent: 'weapon' });
      ball('left-glove', 'green', [-0.08, -0.16, -0.43], [0.18, 0.18, 0.25], { parent: 'weapon' });
      ball('right-glove', 'green', [0.08, -0.2, 0.2], [0.19, 0.22, 0.2], { parent: 'weapon' });
      for (let i = 0; i < 6; i++) person('squad-' + i, [-2 + i * 0.8, 0, 1.5], 'green', false);
      for (let side of [-1, 1]) for (let i = 0; i < 7; i++) {
        const z = 2 - i * 5, x = side * 10;
        box('house-' + side + '-' + i, 'wall', [x, 4, z], [4, 8 + i % 2, 4]);
        for (let w = 0; w < 6; w++) box('window-' + side + '-' + i + '-' + w, 'blue',
          [x - side * 2.02, 2 + Math.floor(w / 2) * 2.3, z - 0.9 + w % 2 * 1.8], [0.04, 1.25, 0.75]);
      }
      group('vehicle', [0, 0, -15]);
      box('vehicle-body', 'green', [0, 0.7, 0], [2.5, 1.2, 3.5], { parent: 'vehicle' });
      box('turret', 'ink', [0, 1.6, -0.3], [1.3, 0.7, 1.3], { parent: 'vehicle' });
      for (let i = 0; i < 4; i++) ball('wheel-' + i, 'ink', [i % 2 ? -1.2 : 1.2, 0.45, i < 2 ? -1 : 1], [0.6, 0.9, 0.9], { parent: 'vehicle' });
      box('tower', 'wall', [0, 6, -31], [4, 12, 3]);
      for (let i = 0; i < 12; i++) box('tower-face-' + i, 'wall', [-1.5 + i % 4, 6 + Math.floor(i / 4), -29.4], [0.9, 0.9, 0.4]);
      group('aircraft', [0, 12, -10]);
      box('fuselage', 'ink', [0, 0, 0], [0.7, 0.5, 4], { parent: 'aircraft' });
      box('wing', 'ink', [0, 0, 0], [5, 0.12, 1], { parent: 'aircraft' });
      r.environment = { ...r.environment, world: true, setup: 'overcast', skyTop: [0.25, 0.33, 0.4], skyBottom: [0.6, 0.65, 0.63], fogDensity: 0.007 };
    } else if (pin) {
      ball('hazard', 'silver', [0, 0.9, -5], [1.8, 1.8, 1.8]);
      text('backglass', 'A S T R A', [0, 2.5, -32.7], 1.2, 'glow');
      for (let i = 0; i < 20; i++) ring('rail-' + i, 'silver', [-7.5 + (i % 2) * 15, 0.8, 3 - Math.floor(i / 2) * 3.5], [0.2, 0.7, 0.2]);
    } else {
      cyl('biscuit-tin', 'silver', [0, 0.5, -30], [1.5, 0.9, 1.5]);
      box('tin-lid', 'gold', [0, 1, -30], [1.6, 0.08, 1.6]);
      for (let i = 0; i < 20; i++) box('tape-' + i, 'gold', [i % 2 ? -7.72 : 7.72, 1 + i % 3 * 0.5, 3 - i * 1.7], [0.025, 0.2, 1.3]);
    }
    for (let i = 0; i < 12; i++) ball('shot-' + i, pin ? 'silver' : war ? 'glow' : 'gold', [0, 1, 0], [0.09, 0.09, 0.18], { visible: false });
    ball('smoke', 'cream', [0, 1, -25], [0.1, 0.1, 0.1], { visible: false });
    r.camera = { eye: [0, 1.25, 3], target: [0, 1.15, -5], fov: 75 };
    r.shadow = { target: [0, 0, -12], extent: 25, distance: 35, far: 80 };
  }
  if (['delphi', 'tarn', 'comb', 'fast-lens', 'crystal-tumbler', 'cork-gallery'].includes(id)) {
    box('studio-backdrop', id === 'delphi' || id === 'comb' ? 'cream' : 'ink', [0, 8, -10], [40, 20, 0.2]);
  }
  group('scene-player', [0, 0, 4], { visible: false });
  // Primitives use radius one, while authored object sizes use full diameters.
  for (const n of r.nodes) {
    if (n.geometry === 'ball') n.scale = n.scale.map(v => v * 0.5);
    if (n.geometry === 'cylinder') n.scale = [n.scale[0] * 0.5, n.scale[1], n.scale[2] * 0.5];
  }
  return r;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = path.join(root, 'test-results', 'recipes');
  fs.mkdirSync(out, { recursive: true });
  for (const id of ids) fs.writeFileSync(path.join(out, id + '.json'), JSON.stringify(recipeFor(id)));
  console.log(`Prepared ${ids.length} scene recipes for MCP authoring.`);
}
