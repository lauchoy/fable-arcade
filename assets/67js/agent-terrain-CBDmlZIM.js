/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import "./world-material-shader.js";
import { n as e } from "./terrain-CgaLbvb-.js";
import { t } from "./field-error-BpFTmyMO.js";
// src/agent-terrain.js
var n = Object.freeze({
	size: [1, 2e3],
	resolution: [2, 256],
	amplitude: [0, 200],
	defaultSize: 40,
	defaultResolution: 64,
	defaultAmplitude: 1,
	maximumHoles: 16
});
function r(e, n, [r, i], a) {
	let o = e ?? n;
	if (!Number.isFinite(o) || o < r || o > i) throw t(`terrain.${a}`, o, `a number from ${r} to ${i}, such as ${n}`);
	return o;
}
function i(e, n, [i, a], o) {
	let s = r(e, n, [i, a], o);
	if (!Number.isInteger(s)) throw t(`terrain.${o}`, s, `a whole number, such as ${n}`);
	return s;
}
function a(e) {
	let a = i(e.resolution, n.defaultResolution, n.resolution, "resolution");
	if (r(e.size, n.defaultSize, n.size, "size"), r(e.amplitude, n.defaultAmplitude, n.amplitude, "amplitude"), e.holes !== void 0 && (!Array.isArray(e.holes) || e.holes.length > n.maximumHoles)) throw t("terrain.holes", e.holes, `a list of at most ${n.maximumHoles} circles, such as [{ "center": [0, 0], "radius": 2 }]`);
	return (a + 1) * (a + 1);
}
function o(t) {
	let r = t.size ?? n.defaultSize, i = Number.isInteger(t.seed) ? t.seed : 1;
	return e({
		size: r,
		chunks: 1,
		levels: 1,
		resolution: t.resolution ?? n.defaultResolution,
		seed: i,
		holes: t.holes,
		height: {
			amplitude: t.amplitude ?? n.defaultAmplitude,
			featureSize: r / 4,
			warp: 0,
			mountainMask: () => 0
		}
	});
}
function s(e, r) {
	let i = a(e);
	if (i > r) throw t("terrain.resolution", e.resolution ?? n.defaultResolution, `a resolution whose ${i} vertices fit maxVertices ${r}; lower it`);
	return o(e).parts[0].geometry;
}
export { n as TERRAIN_LIMITS, o as createRecipeTerrain, s as generateTerrainGeometry, a as terrainVertexEstimate };
