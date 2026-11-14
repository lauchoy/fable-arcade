/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { N as e, R as t, st as n } from "./mesh-uv-CPpcmeLo.js";
import { g as r, h as i } from "./mesh-recipe-BRDW7Uj_.js";
// src/mesh-validate.js
function a(e) {
	throw RangeError(`Topology invalid: ${e}`);
}
function o(e) {
	let t = e.vertices.arrays.edgeSlot, n = e.edges.arrays.diskNext, r = e.edges.arrays.diskPrev, i = e.edges.arrays.vertex, o = e.edges.count * 2, s = 0;
	for (let c of e.liveIndices("point")) {
		let l = t[c];
		if (l === -1) continue;
		let u = l, d = 0;
		do
			(u < 0 || u >= o || e.edges.removed[u >> 1]) && a(`vertex ${c} disk reaches a removed or missing edge.`), i[u] !== c && a(`vertex ${c} disk contains edge ${u >> 1}, which does not use it.`), r[n[u]] !== u && a(`vertex ${c} disk links are not symmetric at edge ${u >> 1}.`), d++, d > o && a(`vertex ${c} disk cycle does not close.`), u = n[u];
		while (u !== l);
		s += d;
	}
	return s;
}
function s(e, t) {
	let n = e.edges.arrays.vertex, r = e.edges.arrays.loop, i = e.loops.arrays, o = 0, s = 0;
	for (let t of e.liveIndices("edge")) {
		s++;
		let c = n[t * 2], l = n[t * 2 + 1];
		e.vertices.isLive(c) && e.vertices.isLive(l) || a(`edge ${t} uses a removed vertex.`), c === l && a(`edge ${t} is a loop on vertex ${c}.`), e.findEdge(c, l) !== t && a(`edge ${t} duplicates another edge between ${c} and ${l}.`);
		let u = r[t];
		if (u === -1) continue;
		let d = u, f = 0;
		do
			e.loops.isLive(d) || a(`edge ${t} radial cycle reaches a removed loop.`), i.edge[d] !== t && a(`edge ${t} radial cycle contains loop ${d} of edge ${i.edge[d]}.`), i.radialPrev[i.radialNext[d]] !== d && a(`edge ${t} radial links are not symmetric.`), f++, f > e.loops.count && a(`edge ${t} radial cycle does not close.`), d = i.radialNext[d];
		while (d !== u);
		o += f;
	}
	return t !== s * 2 && a(`disk cycles hold ${t} edge ends, expected ${s * 2}.`), o;
}
function c(e, t) {
	let n = e.loops.arrays, r = 0, i = new Int32Array(e.vertices.count).fill(-1);
	for (let t of e.liveIndices("face")) {
		let o = e.faces.arrays.loop[t], s = e.faces.arrays.size[t];
		s < 3 && a(`face ${t} has ${s} corners.`);
		let c = o, l = 0;
		do {
			e.loops.isLive(c) || a(`face ${t} reaches a removed loop.`), n.face[c] !== t && a(`face ${t} contains loop ${c} of face ${n.face[c]}.`), n.prev[n.next[c]] !== c && a(`face ${t} loop links are not symmetric.`);
			let r = n.vertex[c], o = n.vertex[n.next[c]], u = n.edge[c], d = e.edges.arrays.vertex[u * 2], f = e.edges.arrays.vertex[u * 2 + 1];
			d === r && f === o || d === o && f === r || a(`face ${t} loop ${c} edge ${u} does not join vertices ${r} and ${o}.`), i[r] === t && a(`face ${t} repeats vertex ${r}.`), i[r] = t, l++, l > s && a(`face ${t} has more loops than its size ${s}.`), c = n.next[c];
		} while (c !== o);
		l !== s && a(`face ${t} has ${l} loops but size ${s}.`), r += l;
	}
	r !== e.loops.liveCount && a(`faces own ${r} loops but ${e.loops.liveCount} are live.`), t !== r && a(`radial cycles hold ${t} loops but faces own ${r}.`);
}
function l(e) {
	return c(e, s(e, o(e))), {
		vertices: e.vertexCount,
		edges: e.edgeCount,
		faces: e.faceCount,
		loops: e.loopCount,
		euler: e.vertexCount - e.edgeCount + e.faceCount
	};
}
// src/mesh-lod.js
var u = Object.freeze([
	.5,
	.25,
	.1
]);
function d(e) {
	if (!Array.isArray(e) || e.length < 1 || e.length > 8) throw RangeError("ratios needs 1 to 8 numbers.");
	e.forEach((t, n) => {
		if (typeof t != "number" || !(t > 0) || !(t < 1) || n > 0 && t >= e[n - 1]) throw RangeError("ratios must be strictly decreasing numbers above 0 and below 1.");
	});
}
function f(e, t) {
	let n = [
		0,
		0,
		0
	], r = new Uint8Array(e.vertexCount), i = 0;
	for (let a of e.cornerVertices) if (!r[a]) {
		r[a] = 1;
		for (let t = 0; t < 3; t++) n[t] = e.positions[a * 3 + t];
		i = Math.max(i, t.query(n).distance);
	}
	return i;
}
function p(e, { ratios: t = u } = {}) {
	d(t);
	let a = r(e), o = n(e), s = Math.hypot(...o.max.map((e, t) => e - o.min[t])), c = [{
		level: 0,
		ratio: 1,
		mesh: e,
		triangles: a.triangleCount,
		error: 0,
		relativeError: 0
	}], l = 1, p = e;
	return t.forEach((e, t) => {
		let n = i(p, { ratio: e / l }), r = f(n.mesh, a);
		c.push({
			level: t + 1,
			ratio: e,
			mesh: n.mesh,
			triangles: n.triangles.after,
			error: r,
			relativeError: r / s
		}), p = n.mesh, l = e;
	}), c;
}
function m(n, { ratios: r = u, smoothAngle: i = 30 } = {}) {
	return p(e(n, {
		quads: !1,
		tags: "none"
	}), { ratios: r }).map(({ mesh: e, ...r }) => ({
		...r,
		geometry: r.level === 0 ? n : t(e, { sharpAngle: i * Math.PI / 180 }).geometry
	}));
}
function h(e, t = {}) {
	let n = e?.parts;
	if (!Array.isArray(n) || !n.length) throw TypeError("An asset needs a parts array.");
	for (let e of n) if (e.skin || e.morph) throw RangeError(`Part ${e.name ?? e.id ?? "?"} is skinned or morphed; LODs support static parts only.`);
	let r = /* @__PURE__ */ new Map();
	for (let e of n) r.has(e.geometry) || r.set(e.geometry, m(e.geometry, t));
	let i = r.get(n[0].geometry).length;
	return Array.from({ length: i }, (t, i) => {
		let a = n.map((e) => ({
			...e,
			geometry: r.get(e.geometry)[i].geometry
		})), o = [...r.values()].map((e) => e[i]);
		return {
			level: i,
			ratio: o[0].ratio,
			triangles: o.reduce((e, t) => e + t.triangles, 0),
			error: Math.max(...o.map((e) => e.error)),
			asset: {
				...e,
				parts: a
			}
		};
	});
}
export { l as a, p as i, h as n, m as r, u as t };
