/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { a as e, c as t, i as n, n as r, o as i, s as a, t as o } from "./agent-mesh-C9R6qW3Q.js";
import { C as s, E as c, T as l, i as u, r as d, t as f } from "./mesh-recipe-BRDW7Uj_.js";
import { a as p, i as m, n as h, r as g } from "./mesh-lod-C7TM9Cy8.js";
import { L as _, N as v, R as y, Z as b, it as x, rt as S } from "./mesh-uv-CPpcmeLo.js";
import { a as C, n as w, t as T } from "./triangle-bvh-MJBX52tQ.js";
import { i as E, n as D, t as O } from "./triangle-math-CatOnS0A.js";
import { r as k } from "./mesh-operations-ByLVkOhP.js";
// src/mesh-import.js
var A = 1 - 1e-6, j = 4;
function M(e) {
	let t = Float64Array.from(e.positions), n = T(t, e.indices), r = /* @__PURE__ */ new Float64Array(9), i = /* @__PURE__ */ new Float64Array(3), a = /* @__PURE__ */ new Float64Array(3), o = /* @__PURE__ */ new Float64Array(3), s = /* @__PURE__ */ new Float64Array(3);
	function c(c, l, u, d) {
		s[0] = c, s[1] = l, s[2] = u;
		let f = Infinity, p = 0;
		C(n, (e, t) => w(s, e, t), (e) => e * e <= f, (n) => {
			E(t, e.indices, n, r), D(s, r, i);
			let o = (i[0] - c) ** 2 + (i[1] - l) ** 2 + (i[2] - u) ** 2;
			return o < f && (f = o, p = n, a.set(i)), !1;
		}), E(t, e.indices, p, r);
		let m = O(a, r, o);
		d.triangle = p, d.distance = Math.sqrt(f);
		for (let e = 0; e < 3; e++) d.weights[e] = m ? Math.max(0, m[e]) : +(e === 0);
		let h = d.weights[0] + d.weights[1] + d.weights[2];
		for (let e = 0; e < 3; e++) d.weights[e] /= h;
		return d;
	}
	return {
		nearest: c,
		triangleVertex: (t, n) => e.indices[t * 3 + n]
	};
}
function N() {
	return {
		triangle: 0,
		distance: 0,
		weights: /* @__PURE__ */ new Float64Array(3)
	};
}
function P(e) {
	for (let t = 0; t < 3; t++) if (e[t] >= A) return t;
	return -1;
}
function F(e, t, n, r, i, a) {
	let o = P(r);
	for (let s = 0; s < t; s++) {
		let c = 0;
		if (o >= 0) c = e[n[o] * t + s];
		else for (let i = 0; i < 3; i++) c += e[n[i] * t + s] * r[i];
		i[a * t + s] = c;
	}
}
function I(e, t, n, r, i, a, o) {
	let s = P(r), c = /* @__PURE__ */ new Map();
	for (let i = 0; i < 3; i++) {
		if (s >= 0 && i !== s) continue;
		let a = s >= 0 ? 1 : r[i];
		for (let r = 0; r < j; r++) {
			let o = t[n[i] * j + r] * a;
			if (o <= 0) continue;
			let s = e[n[i] * j + r];
			c.set(s, (c.get(s) ?? 0) + o);
		}
	}
	let l = [...c].sort((e, t) => t[1] - e[1]).slice(0, j), u = l.reduce((e, [, t]) => e + t, 0), d = 0;
	for (let e of c.values()) d += e;
	let f = s >= 0 || u === 0 ? 1 : d / u;
	for (let e = 0; e < j; e++) {
		let [t, n] = l[e] ?? [0, 0];
		i[o * j + e] = t, a[o * j + e] = n * f;
	}
}
function L(e) {
	let t = [
		Infinity,
		Infinity,
		Infinity
	], n = [
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let r = 0; r < e.length; r++) {
		let i = r % 3;
		t[i] = Math.min(t[i], e[r]), n[i] = Math.max(n[i], e[r]);
	}
	return Math.hypot(n[0] - t[0], n[1] - t[1], n[2] - t[2]);
}
function R(e, t, n) {
	for (let r = t; r < n; r++) if (e.data[r * 2] === 0 && e.data[r * 2 + 1] === 0) return !0;
	return !1;
}
function z(e, t, n) {
	let r = e.attributes.corner.uv?.size === 2 ? e.attributes.corner.uv : void 0, i = r ? Float32Array.from(r.data) : new Float32Array(e.cornerCount * 2), a = N(), o = /* @__PURE__ */ new Float64Array(9), s = /* @__PURE__ */ new Float64Array(3), c = /* @__PURE__ */ new Float64Array(3), l = 0;
	for (let u = 0; u < e.faceCount; u++) {
		let d = e.faceOffsets[u], f = e.faceOffsets[u + 1];
		if (r && !R(r, d, f)) continue;
		let p = 0, m = 0, h = 0;
		for (let t = d; t < f; t++) p += e.positions[e.cornerVertices[t] * 3] / (f - d), m += e.positions[e.cornerVertices[t] * 3 + 1] / (f - d), h += e.positions[e.cornerVertices[t] * 3 + 2] / (f - d);
		n.nearest(p, m, h, a), E(t.positions, t.indices, a.triangle, o);
		for (let r = d; r < f; r++) {
			let l = e.cornerVertices[r];
			c.set(e.positions.subarray(l * 3, l * 3 + 3));
			let u = O(c, o, s);
			for (let e = 0; e < 2; e++) {
				let o = 0;
				for (let r = 0; r < 3; r++) {
					let i = u ? u[r] : +(r === 0);
					o += t.uvs[n.triangleVertex(a.triangle, r) * 2 + e] * i;
				}
				i[r * 2 + e] = o;
			}
		}
		l++;
	}
	if (!l) return {
		mesh: e,
		rebuilt: l
	};
	let u = {
		point: { ...e.attributes.point },
		edge: { ...e.attributes.edge },
		face: { ...e.attributes.face },
		corner: { ...e.attributes.corner }
	};
	return u.corner.uv = {
		data: i,
		size: 2
	}, {
		rebuilt: l,
		mesh: x({
			positions: e.positions,
			faceOffsets: e.faceOffsets,
			cornerVertices: e.cornerVertices,
			edgeVertices: e.edgeVertices,
			cornerEdges: e.cornerEdges,
			attributes: u
		})
	};
}
function B(e, t, n) {
	let r = t.positions.length / 3, i = !!(e.skinIndices && e.skinWeights), a = e.morphTargets ?? [];
	if (i && (t.skinIndices = new Uint16Array(r * j), t.skinWeights = new Float32Array(r * j)), e.colors && (t.colors = new Float32Array(r * 3)), a.length && (t.morphTargets = a.map((e) => ({
		...e.positions ? { positions: new Float32Array(r * 3) } : {},
		...e.normals ? { normals: new Float32Array(r * 3) } : {}
	}))), !i && !e.colors && !a.length) return 0;
	let o = N(), s = [
		0,
		0,
		0
	], c = 0;
	for (let l = 0; l < r; l++) {
		n.nearest(t.positions[l * 3], t.positions[l * 3 + 1], t.positions[l * 3 + 2], o), c = Math.max(c, o.distance);
		for (let e = 0; e < 3; e++) s[e] = n.triangleVertex(o.triangle, e);
		i && I(e.skinIndices, e.skinWeights, s, o.weights, t.skinIndices, t.skinWeights, l), e.colors && F(e.colors, 3, s, o.weights, t.colors, l), a.forEach((e, n) => {
			e.positions && F(e.positions, 3, s, o.weights, t.morphTargets[n].positions, l), e.normals && F(e.normals, 3, s, o.weights, t.morphTargets[n].normals, l);
		});
	}
	return c;
}
function V(e, t) {
	return t ? _(e, { [`${S}${t}`]: {
		data: new Uint8Array(e.faceCount).fill(1),
		size: 1
	} }) : e;
}
function H(e, t, { maxVertices: n, smoothAngle: r, resolveCutter: i, materialTag: a }) {
	let o = V(v(e), a), s = f(o, t, {
		maxVertices: n,
		maxFaces: n,
		resolveCutter: i && ((e) => v(i(e)))
	});
	p(b(s.mesh));
	let c = M(e), l = e.uvs ? z(s.mesh, e, c) : {
		mesh: s.mesh,
		rebuilt: 0
	}, { geometry: u } = y(l.mesh, { sharpAngle: r * Math.PI / 180 });
	if (u.positions.length / 3 > n) throw RangeError(`The edited part needs ${u.positions.length / 3} render vertices, over maxVertices ${n}. Use fewer or coarser edits.`);
	let d = B(e, u, c), m = L(e.positions) * k.maxTransferFraction, h = !!e.skinIndices || !!e.morphTargets?.length;
	if (h && d > m) throw RangeError(`This edit puts geometry ${d.toPrecision(3)} from the imported surface, over the ${m.toPrecision(3)} limit, so skin weights and morph targets would be guesses. Keep edits within ${m.toPrecision(3)} of the surface (smaller offsets, cut instead of extrude), or edit a part without skin or morphs.`);
	return {
		geometry: u,
		mesh: l.mesh,
		results: s.results,
		transfer: {
			skinWeights: !!e.skinIndices,
			morphTargets: e.morphTargets?.length ?? 0,
			colors: !!e.colors,
			uvs: !!e.uvs,
			uvFacesRebuilt: l.rebuilt,
			reach: Number(d.toPrecision(4)),
			limit: h ? Number(m.toPrecision(4)) : null
		}
	};
}
export { H as editImportedGeometry, a as expandInstancedNodes, h as generateAssetLods, g as generateGeometryLods, o as generateMeshGeometry, m as generateMeshLods, r as importedMeshReport, r as meshReport, s as loadMeshBooleans, l as meshBooleansLoaded, d as normalizeMeshEdits, u as normalizeMeshStack, t as normalizeShapeKeys, n as registerEditedMesh, c as setManifoldModuleLoader, e as taggedFacePositions, i as waterFoamGeometry };
