/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { $ as e, A as t, B as n, C as r, E as i, G as a, H as o, J as s, K as c, M as l, O as u, Q as d, S as f, T as p, U as m, V as h, W as g, Y as _, Z as v, _ as y, a as b, at as x, b as S, c as C, d as ee, dt as te, et as ne, f as re, g as ie, h as ae, i as oe, it as w, j as se, k as T, l as ce, lt as le, m as ue, n as de, o as E, q as fe, r as pe, rt as me, s as D, st as he, t as ge, ut as _e, v as ve, w as O, x as ye, y as be } from "./mesh-uv-CPpcmeLo.js";
import { t as k } from "./field-error-BpFTmyMO.js";
import { createMeshPairQuery as xe, createMeshQueryIndex as Se, createTriangleSurfaceIndex as Ce } from "./mesh-query.js";
import { s as we, t as Te } from "./kernel-offload-A_sD9y-z.js";
import { a as Ee, n as De, t as Oe } from "./triangle-bvh-MJBX52tQ.js";
import { i as ke, n as Ae, t as je } from "./triangle-math-CatOnS0A.js";
import { a as Me, f as Ne, g as Pe, h as Fe, m as Ie, p as Le, u as Re } from "./mesh-operations-ByLVkOhP.js";
import { r as ze, t as Be } from "./sculpt-strokes-DssfwB0s.js";
import { d as A, f as Ve, l as He, n as Ue, o as We, r as Ge, s as Ke, u as qe } from "./expression-BKVPjtCf.js";
import { n as Je, t as Ye } from "./surface-nets-Dwxp306C.js";
// src/mesh-lint-geometry.js
var j = Object.freeze({
	maxTrianglesPerPart: 2e4,
	maxTotalTriangles: 6e4,
	maxPartPairs: 64,
	maxThinWallSamples: 256,
	maxSymmetryVertices: 5e4,
	maxSampleElements: 8
}), Xe = .005, Ze = 1e-4, Qe = 1e-4, $e = .8, et = Object.freeze([
	1,
	0,
	0,
	0,
	0,
	1,
	0,
	0,
	0,
	0,
	1,
	0,
	0,
	0,
	0,
	1
]);
function tt(e, t) {
	let n = Array.from({ length: t }, () => []);
	for (let t = 0; t < e.length; t++) n[e[t]].push(t);
	return n;
}
function nt(e, t) {
	let n = /* @__PURE__ */ new Map(), r = [], i = [], a = (t) => {
		let i = n.get(t);
		return i === void 0 && (i = n.size, n.set(t, i), r.push(e.positions[t * 3], e.positions[t * 3 + 1], e.positions[t * 3 + 2])), i;
	};
	for (let n of t) {
		let t = e.faceOffsets[n], r = e.faceOffsets[n + 1], o = a(e.cornerVertices[t]);
		for (let n = t + 1; n + 1 < r; n++) i.push(o, a(e.cornerVertices[n]), a(e.cornerVertices[n + 1]));
	}
	return {
		positions: Float32Array.from(r),
		indices: Uint32Array.from(i)
	};
}
function rt(e) {
	let t = [
		Infinity,
		Infinity,
		Infinity
	], n = [
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let r = 0; r < e.positions.length; r += 3) for (let i = 0; i < 3; i++) t[i] = Math.min(t[i], e.positions[r + i]), n[i] = Math.max(n[i], e.positions[r + i]);
	return {
		min: t,
		max: n
	};
}
function it(e, t) {
	let n = 0;
	for (let r = 0; r < 3; r++) {
		let i = Math.max(e.min[r] - t.max[r], t.min[r] - e.max[r], 0);
		n += i * i;
	}
	return Math.sqrt(n);
}
function at(e) {
	return e.slice(0, j.maxSampleElements);
}
function ot(e, t) {
	if (e.length < 2) return [];
	let n = [];
	for (let r = 0; r < e.length; r++) e.some((n, i) => i !== r && it(e[r], n) <= t) || n.push(r);
	return n;
}
function st(e, t, n, r) {
	let i = [], a = 0;
	for (let o = 0; o < e.length; o++) for (let s = o + 1; s < e.length; s++) {
		if (it(t[o], t[s]) > n) continue;
		if (a++ >= j.maxPartPairs) return r.add("intersecting-parts"), i;
		let c = Se(e[o]), l = Se(e[s]);
		try {
			xe(c, l).evaluate(et, et).kind === "surface-intersection" && i.push(o * 1e3 + s);
		} catch {
			r.add("intersecting-parts");
		} finally {
			c.dispose(), l.dispose();
		}
	}
	return i;
}
var ct = /intersect|overlap/i;
function lt(e, t) {
	try {
		return Se(e, { solid: !0 }).dispose(), !1;
	} catch (e) {
		return ct.test(e.message) ? !0 : (t.add("self-intersection"), !1);
	}
}
function ut(e, t) {
	let n = e.faceOffsets[t], r = e.faceOffsets[t + 1], i = [
		0,
		0,
		0
	];
	for (let t = n; t < r; t++) for (let n = 0; n < 3; n++) i[n] += e.positions[e.cornerVertices[t] * 3 + n];
	return i.map((e) => e / (r - n));
}
function dt(e, t, n, r, i) {
	let a = Se(t), o = i * Ze, s = i * Xe, c = Math.max(1, Math.ceil(n.length / j.maxThinWallSamples)), l = [];
	try {
		for (let t = 0; t < n.length; t += c) {
			let i = n[t], c = [
				r[i * 3],
				r[i * 3 + 1],
				r[i * 3 + 2]
			], u = ut(e, i).map((e, t) => e - c[t] * o), d = a.raycast(et, {
				origin: u,
				direction: c.map((e) => -e)
			});
			d && d.distance + o < s && l.push(i);
		}
	} finally {
		a.dispose();
	}
	return l;
}
function ft(e) {
	return `${e[0]},${e[1]},${e[2]}`;
}
function pt(e, t, n, r) {
	let i = r * 4, a = /* @__PURE__ */ new Set(), o = (e) => e.map((e) => Math.round(e / i)), s = (t) => [
		e.positions[t * 3],
		e.positions[t * 3 + 1],
		e.positions[t * 3 + 2]
	];
	for (let t = 0; t < e.vertexCount; t++) a.add(ft(o(s(t))));
	let c = [];
	for (let r = 0; r < e.vertexCount; r++) {
		let e = s(r);
		e[t] = 2 * n - e[t];
		let i = o(e), l = !1;
		for (let e = -1; e <= 1 && !l; e++) for (let t = -1; t <= 1 && !l; t++) for (let n = -1; n <= 1 && !l; n++) l = a.has(ft([
			i[0] + e,
			i[1] + t,
			i[2] + n
		]));
		l || c.push(r);
	}
	return c;
}
function mt(e, t, n) {
	let r = [];
	for (let [i, a] of [[0, "x"], [2, "z"]]) {
		let o = 0;
		for (let t = 0; t < e.vertexCount; t++) o += e.positions[t * 3 + i];
		let s = [
			0,
			(t.min[i] + t.max[i]) / 2,
			o / e.vertexCount
		].map((t) => pt(e, i, t, n * Qe)).reduce((e, t) => t.length < e.length ? t : e), c = 1 - s.length / e.vertexCount;
		s.length > 0 && c >= $e && r.push({
			axis: a,
			unmatched: s
		});
	}
	return r;
}
function ht(e, t, n, r) {
	try {
		return n();
	} catch {
		return t.add(e), r;
	}
}
function gt(e, t, n = {}) {
	return {
		kind: e,
		count: t.length,
		sample: at(t),
		...n
	};
}
function _t(e, { facePart: t, partCount: n, solidParts: r, bounds: i, diagonal: a }) {
	let o = /* @__PURE__ */ new Set(), s = [], c = tt(t, n), l = a * Ze;
	if (c.reduce((e, t) => e + t.length, 0) <= j.maxTotalTriangles && c.every((e) => e.length <= j.maxTrianglesPerPart)) {
		let t = c.map((t) => nt(e, t)), n = t.map(rt), i = ht("intersecting-parts", o, () => st(t, n, l, o), []);
		i.length && s.push(gt("intersecting-parts", i));
		let u = r.filter((e) => lt(t[e], o));
		u.length && s.push(gt("self-intersection", u));
		let { normals: d } = m(e), f = r.flatMap((n) => ht("thin-wall", o, () => dt(e, t[n], c[n], d, a), []));
		f.length && s.push(gt("thin-wall", f));
		let p = ot(n, l);
		p.length && s.push(gt("floating-part", p));
	} else for (let e of [
		"intersecting-parts",
		"self-intersection",
		"thin-wall",
		"floating-part"
	]) o.add(e);
	if (e.vertexCount <= j.maxSymmetryVertices) for (let { axis: t, unmatched: n } of mt(e, i, a)) s.push(gt("asymmetric", n, { axis: t }));
	else o.add("asymmetric");
	return {
		problems: s,
		skipped: [...o]
	};
}
// src/mesh-lint.js
var vt = 8, yt = Object.freeze({
	"non-manifold-edge": {
		severity: "error",
		fix: "Delete the extra faces or split the edge; booleans and solidify need two faces per edge."
	},
	"inconsistent-winding": {
		severity: "error",
		fix: "Run recalc_normals on the part so neighbouring faces wind the same way."
	},
	"inverted-part": {
		severity: "error",
		fix: "Run flip_normals on the part; its normals point inward."
	},
	"degenerate-face": {
		severity: "error",
		fix: "Run merge_by_distance or dissolve the zero-area faces."
	},
	"loose-vertex": {
		severity: "warning",
		fix: "Delete loose vertices; they do not render and confuse bounds."
	},
	"boundary-edge": {
		severity: "warning",
		fix: "Open surface. Run fill_holes to cap each boundary loop, or add solidify if the part must be closed."
	}
}), bt = Object.freeze({
	"intersecting-parts": {
		severity: "warning",
		fix: "Two parts cross each other (sample holds first * 1000 + second part index). Move them apart, or run a union boolean if they should be one solid."
	},
	"self-intersection": {
		severity: "warning",
		fix: "A closed part cuts through itself. Undo the last extrude, inset or translate that folded it, or lower its offset."
	},
	"thin-wall": {
		severity: "warning",
		fix: "The wall behind these faces (sample is face indices) is under 0.5% of the mesh size thick. Thicken it with solidify, or move the faces apart."
	},
	"floating-part": {
		severity: "warning",
		fix: "This part (sample is part indices) touches no other part. Translate it onto its neighbour, or ignore this if it is meant to stand alone."
	},
	asymmetric: {
		severity: "warning",
		fix: "The mesh is mirror-symmetric except for the vertices in sample. Rebuild one half and mirror it, or set_position those vertices to their partners."
	},
	"non-planar-quad": {
		severity: "warning",
		fix: "These quads (sample is face indices) fold by more than 45 degrees across their diagonal and pinch shading. Triangulate them, or flatten their corners."
	},
	"skewed-quad": {
		severity: "warning",
		fix: "These quads (sample is face indices) have a corner over 60 degrees from a right angle. Dissolve or slide edges so corners stay near 90 degrees."
	}
}), xt = 45, St = 60;
function Ct(e) {
	return Math.round(e * 1e4) / 1e4;
}
function wt(e, t = s(e), n = null) {
	let r = new Uint32Array(e.vertexCount), i = new Uint8Array(e.vertexCount);
	for (let n = 0; n < e.edgeCount; n++) {
		let a = e.edgeVertices[n * 2], o = e.edgeVertices[n * 2 + 1];
		r[a]++, r[o]++, t.edgeOffsets[n + 1] - t.edgeOffsets[n] !== 2 && (i[a] = 1, i[o] = 1);
	}
	let a = 0, o = 0, c = 0, l = 0;
	for (let t = 0; t < e.vertexCount; t++) r[t] === 0 || i[t] || (r[t] === 4 ? a++ : r[t] === 3 ? o++ : r[t] === 5 ? c++ : r[t] >= 6 && l++);
	let u = e.positions, d = 0, f = 0, p = 0, m = 1, h = 0;
	for (let t = 0; t < e.faceCount; t++) {
		let i = e.faceOffsets[t];
		if (e.faceOffsets[t + 1] - i !== 4) continue;
		d++;
		let a = e.cornerVertices[i] * 3, o = e.cornerVertices[i + 1] * 3, s = e.cornerVertices[i + 2] * 3, c = e.cornerVertices[i + 3] * 3, l = [
			a,
			o,
			s,
			c
		], g = Infinity, _ = 0, v = 0, y = 0;
		for (let e = 0; e < 4; e++) {
			let t = l[e], n = l[e + 1 & 3], r = l[e + 3 & 3], i = u[n] - u[t], a = u[n + 1] - u[t + 1], o = u[n + 2] - u[t + 2], s = u[r] - u[t], c = u[r + 1] - u[t + 1], d = u[r + 2] - u[t + 2], f = Math.hypot(i, a, o);
			f < g && (g = f), f > _ && (_ = f);
			let p = Math.hypot(a * d - o * c, o * s - i * d, i * c - a * s), m = Math.atan2(p, i * s + a * c + o * d) * 180 / Math.PI, h = Math.abs(m - 90);
			y += h, h > v && (v = h);
		}
		if (f += y / 4, v > p && (p = v), g > 1e-12) {
			let e = _ / g;
			e > m && (m = e);
		}
		let b = u[s] - u[a], x = u[s + 1] - u[a + 1], S = u[s + 2] - u[a + 2], C = u[o] - u[a], ee = u[o + 1] - u[a + 1], te = u[o + 2] - u[a + 2], ne = u[c] - u[a], re = u[c + 1] - u[a + 1], ie = u[c + 2] - u[a + 2], ae = ee * S - te * x, oe = te * b - C * S, w = C * x - ee * b, se = x * ie - S * re, T = S * ne - b * ie, ce = b * re - x * ne, le = Math.hypot(ae, oe, w), ue = Math.hypot(se, T, ce), de = 0;
		if (le > 1e-12 && ue > 1e-12) {
			let e = Math.max(-1, Math.min(1, (ae * se + oe * T + w * ce) / (le * ue)));
			de = Math.acos(e) * 180 / Math.PI, de > h && (h = de);
		}
		if (n) {
			de > xt && Tt(n, "non-planar-quad", t);
			let e = [
				a,
				o,
				s,
				c
			].some((e) => r[e / 3] >= 6);
			v > St && !e && Tt(n, "skewed-quad", t);
		}
	}
	return {
		valence: {
			regular: a,
			poles3: o,
			poles5: c,
			poles6Plus: l
		},
		quadQuality: {
			meanAngleError: d ? Ct(f / d) : 0,
			maxAngleError: Ct(p),
			maxAspect: Ct(m),
			maxWarp: Ct(h)
		}
	};
}
function Tt(e, t, n) {
	let r = e.get(t);
	r || (r = {
		kind: t,
		...bt[t],
		count: 0,
		sample: []
	}, e.set(t, r)), r.count++, r.sample.length < vt && r.sample.push(n);
}
function M(e, t, n) {
	let r = e.get(t);
	r || (r = {
		kind: t,
		...yt[t],
		count: 0,
		sample: []
	}, e.set(t, r)), r.count++, r.sample.length < vt && r.sample.push(n);
}
function Et(e, t, n) {
	let r = new Float64Array(n), i = e.positions;
	for (let n = 0; n < e.faceCount; n++) {
		let a = e.faceOffsets[n], o = e.faceOffsets[n + 1], s = e.cornerVertices[a] * 3;
		for (let c = a + 1; c + 1 < o; c++) {
			let a = e.cornerVertices[c] * 3, o = e.cornerVertices[c + 1] * 3;
			r[t[n]] += (i[s] * (i[a + 1] * i[o + 2] - i[a + 2] * i[o + 1]) + i[s + 1] * (i[a + 2] * i[o] - i[a] * i[o + 2]) + i[s + 2] * (i[a] * i[o + 1] - i[a + 1] * i[o])) / 6;
		}
	}
	return r;
}
var Dt = [
	.8017837,
	.5345225,
	.2672612
];
function Ot(e, t, n, r, i) {
	let a = [
		t[r] - t[n],
		t[r + 1] - t[n + 1],
		t[r + 2] - t[n + 2]
	], o = [
		t[i] - t[n],
		t[i + 1] - t[n + 1],
		t[i + 2] - t[n + 2]
	], [s, c, l] = Dt, u = [
		c * o[2] - l * o[1],
		l * o[0] - s * o[2],
		s * o[1] - c * o[0]
	], d = a[0] * u[0] + a[1] * u[1] + a[2] * u[2];
	if (Math.abs(d) < 1e-12) return !1;
	let f = 1 / d, p = [
		e[0] - t[n],
		e[1] - t[n + 1],
		e[2] - t[n + 2]
	], m = (p[0] * u[0] + p[1] * u[1] + p[2] * u[2]) * f;
	if (m < 0 || m > 1) return !1;
	let h = [
		p[1] * a[2] - p[2] * a[1],
		p[2] * a[0] - p[0] * a[2],
		p[0] * a[1] - p[1] * a[0]
	], g = (s * h[0] + c * h[1] + l * h[2]) * f;
	return g < 0 || m + g > 1 ? !1 : (o[0] * h[0] + o[1] * h[1] + o[2] * h[2]) * f > 0;
}
function kt(e, t, n) {
	let r = 0;
	for (; t[r] !== n;) r++;
	let i = e.cornerVertices[e.faceOffsets[r]] * 3, a = [
		e.positions[i],
		e.positions[i + 1],
		e.positions[i + 2]
	], o = 0;
	for (let r = 0; r < e.faceCount; r++) {
		if (t[r] === n) continue;
		let i = e.faceOffsets[r], s = e.cornerVertices[i] * 3;
		for (let t = i + 1; t + 1 < e.faceOffsets[r + 1]; t++) Ot(a, e.positions, s, e.cornerVertices[t] * 3, e.cornerVertices[t + 1] * 3) && o++;
	}
	return o % 2 == 1;
}
function At(e, { geometry: t = !1 } = {}) {
	let n = /* @__PURE__ */ new Map(), r = s(e), i = fe(e), { facePart: a, partCount: o } = _(e, r, i), c = new Uint8Array(o), l = new Uint8Array(o);
	for (let t = 0; t < e.edgeCount; t++) {
		let o = r.edgeOffsets[t], s = r.edgeOffsets[t + 1] - o, u = a[i[r.edgeCorners[o]]];
		s === 1 ? (M(n, "boundary-edge", t), c[u] = 1) : s > 2 ? (M(n, "non-manifold-edge", t), c[u] = 1) : e.cornerVertices[r.edgeCorners[o]] === e.cornerVertices[r.edgeCorners[o + 1]] && (M(n, "inconsistent-winding", t), l[u] = 1);
	}
	let u = he(e), d = Math.hypot(...u.max.map((e, t) => e - u.min[t])), f = (d * 1e-7) ** 2, { areas: p } = m(e);
	for (let t = 0; t < e.faceCount; t++) p[t] <= f && M(n, "degenerate-face", t);
	let h = new Uint8Array(e.vertexCount);
	for (let t of e.cornerVertices) h[t] = 1;
	for (let t = 0; t < e.vertexCount; t++) h[t] || M(n, "loose-vertex", t);
	let g = Et(e, a, o), v = 0, y = 0, b = [];
	for (let t = 0; t < o; t++) c[t] || l[t] || (v++, g[t] >= 0 ? b.push(t) : kt(e, a, t) ? y++ : M(n, "inverted-part", t));
	let x = wt(e, r, t ? n : null), S = [...n.values()], C;
	if (t) {
		let t = _t(e, {
			facePart: a,
			partCount: o,
			solidParts: b,
			bounds: u,
			diagonal: d
		});
		for (let e of t.problems) S.push({
			...e,
			...bt[e.kind]
		});
		t.skipped.length && (C = t.skipped);
	}
	let ee = !S.some((e) => e.severity === "error");
	return {
		ok: ee,
		counts: {
			vertices: e.vertexCount,
			edges: e.edgeCount,
			faces: e.faceCount,
			corners: e.cornerCount
		},
		parts: {
			count: o,
			closed: v,
			cavities: y
		},
		valence: x.valence,
		quadQuality: x.quadQuality,
		topologyScore: jt(e, ee, x),
		tags: le(e),
		bounds: u,
		problems: S,
		...C ? { skippedChecks: C } : {}
	};
}
function jt(e, t, { valence: n, quadQuality: r }) {
	if (!t || e.faceCount === 0) return 0;
	let i = 0;
	for (let t = 0; t < e.faceCount; t++) e.faceOffsets[t + 1] - e.faceOffsets[t] === 4 && i++;
	let a = i / e.faceCount, o = n.regular + n.poles3 + n.poles5 + n.poles6Plus, s = o > 0 ? (n.regular + .5 * n.poles3 + .5 * n.poles5) / o : 1, c = (Math.max(0, 1 - r.meanAngleError / 60) + Math.max(0, 1 - r.maxWarp / 90)) / 2;
	return Ct(.5 * a + .25 * s + .25 * c);
}
// src/mesh-edit-field.js
function N(e, t, n, r, i = TypeError) {
	return k(`edits[${e}].${t}`, n, r, i);
}
function P(e, t, n, r, i) {
	if (!Number.isInteger(e) || e < r || e > i) throw N(t, n, e, `a whole number from ${r} to ${i}, such as ${Math.min(Math.max(1, r), i)}`);
	return e;
}
function F(e, t, n) {
	if (e !== void 0 && typeof e != "boolean") throw N(t, n, e, "true or false");
	return e;
}
var Mt = [
	"x",
	"y",
	"z"
];
function Nt(e, t, n = "axis") {
	if (!Mt.includes(e)) throw N(t, n, e, "one of \"x\", \"y\", \"z\"");
	return e;
}
function I(e, t, n, r) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw N(t, n, e, r);
	return e;
}
// src/mesh-boolean.js
var Pt = null, Ft = null, It = () => import("manifold-3d");
function Lt(e) {
	if (typeof e != "function") throw TypeError("The Manifold loader must be a function returning a module promise.");
	It = e;
}
function Rt({ wasmBinary: e } = {}) {
	return Pt ??= It().catch((e) => {
		throw Error(`Mesh booleans need the optional peer dependency manifold-3d 3.5.4: npm install manifold-3d@3.5.4 (${e.message}).`);
	}).then(async ({ default: t }) => {
		let n = await t(e ? { wasmBinary: e } : void 0);
		return n.setup(), Ft = n, n;
	}).catch((e) => {
		throw Pt = null, e;
	}), Pt;
}
function zt() {
	return Ft !== null;
}
function Bt() {
	if (!Ft) throw Error("Mesh booleans are not loaded yet. Await loadMeshBooleans() before running a boolean edit.");
	return Ft;
}
var Vt = Object.freeze([
	"union",
	"difference",
	"intersect"
]);
function Ht(e) {
	return e.attributes.corner.uv?.size === 2;
}
function Ut(e, t, r, i) {
	let { normals: a } = m(t), { triangleCorners: o, triangleFaces: s } = n(t, a), c = Ht(t) ? t.attributes.corner.uv.data : null, l = new Float32Array(t.cornerCount * i);
	for (let e = 0; e < t.cornerCount; e++) {
		let n = t.cornerVertices[e];
		l[e * i] = t.positions[n * 3], l[e * i + 1] = t.positions[n * 3 + 1], l[e * i + 2] = t.positions[n * 3 + 2], i === 5 && c && (l[e * i + 3] = c[e * 2], l[e * i + 4] = c[e * 2 + 1]);
	}
	let u = new Uint32Array(s.length);
	for (let e = 0; e < s.length; e++) u[e] = s[e] + r;
	let d = new e.Mesh({
		numProp: i,
		vertProperties: l,
		triVerts: new Uint32Array(o),
		faceID: u
	});
	return d.merge(), d;
}
function Wt(e, t, n) {
	let r = t.status();
	return r === "NoError" || r === e.ErrorStatus?.NoError || r === 0 ? null : `${n} is not a closed manifold for the boolean solver (${r}). Run mesh_inspect: every edge needs exactly two faces with matching winding. Fix open edges or merge_by_distance first.`;
}
function Gt(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let e = 0; e < n.length; e++) {
		let t = n[e];
		r.has(t) || r.set(t, []), r.get(t).push(e);
	}
	let i = [];
	for (let [n, a] of r) {
		let r = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
		for (let n of a) for (let i = 0; i < 3; i++) {
			let a = e[n * 3 + i], s = e[n * 3 + (i + 1) % 3];
			r.add(`${a},${s}`), o.has(a) || o.set(a, t[n * 3 + i]);
		}
		let s = /* @__PURE__ */ new Map(), c = 0, l = !1;
		for (let e of r) {
			let [t, n] = e.split(",").map(Number);
			r.has(`${n},${t}`) || (c++, s.has(t) && (l = !0), s.set(t, n));
		}
		let u = null;
		if (!l && c >= 3) {
			let e = s.keys().next().value;
			u = [e];
			let t = s.get(e);
			for (; t !== e && u.length <= c;) u.push(t), t = s.get(t);
			(t !== e || u.length !== c) && (u = null);
		}
		if (u) i.push({
			sourceFace: n,
			vertices: u,
			properties: u.map((e) => o.get(e))
		});
		else for (let r of a) {
			let a = Array.from(e.subarray(r * 3, r * 3 + 3));
			new Set(a).size === 3 && i.push({
				sourceFace: n,
				vertices: a,
				properties: Array.from(t.subarray(r * 3, r * 3 + 3))
			});
		}
	}
	return i;
}
function Kt(e, t, n, { cutTag: r } = {}) {
	if (!Vt.includes(n)) throw RangeError(`Boolean operation must be one of ${Vt.join(", ")}.`);
	let i = Bt();
	for (let [n, r] of [["The mesh", e], ["The cutter", t]]) {
		let e = At(r).problems.filter((e) => [
			"boundary-edge",
			"non-manifold-edge",
			"inconsistent-winding"
		].includes(e.kind));
		if (e.length) throw RangeError(`${n} must be closed for a boolean: ${e.map((e) => `${e.count} ${e.kind}`).join(", ")}. ${e[0].fix}`);
	}
	let a = Ht(e) ? 5 : 3, o = [];
	try {
		let s = Ut(i, e, 0, a);
		o.push(s);
		let c = Ut(i, t, e.faceCount, a);
		o.push(c);
		let l = new i.Manifold(s);
		o.push(l);
		let u = new i.Manifold(c);
		o.push(u);
		let d = Wt(i, l, "The mesh") ?? Wt(i, u, "The cutter");
		if (d) throw RangeError(d);
		let f = n === "union" ? l.add(u) : n === "difference" ? l.subtract(u) : l.intersect(u);
		o.push(f);
		let p = f.getMesh();
		if (o.push(p), !p.triVerts.length) throw RangeError(`The ${n} leaves nothing. Check the cutter's position and size against mesh_inspect bounds.`);
		return qt(e, p, a, r);
	} finally {
		for (let e of o.reverse()) e.delete?.();
	}
}
function qt(e, t, n, r) {
	let i = t.numProp, a = t.vertProperties.length / i, o = /* @__PURE__ */ new Map(), s = new Uint32Array(a), c = [];
	for (let e = 0; e < a; e++) {
		let n = t.vertProperties[e * i], r = t.vertProperties[e * i + 1], a = t.vertProperties[e * i + 2], l = `${n},${r},${a}`, u = o.get(l);
		u === void 0 && (u = c.length / 3, o.set(l, u), c.push(n, r, a)), s[e] = u;
	}
	let u = new Uint32Array(t.triVerts.length);
	for (let e = 0; e < t.triVerts.length; e++) u[e] = s[t.triVerts[e]];
	let d = Gt(u, t.triVerts, t.faceID), f = new Uint32Array(d.length + 1), p = [], m = n === 5 ? [] : null, h = new Uint32Array(d.length);
	d.forEach((e, n) => {
		h[n] = e.sourceFace, e.vertices.forEach((n, r) => {
			if (p.push(n), m) {
				let n = e.properties[r];
				m.push(t.vertProperties[n * i + 3], t.vertProperties[n * i + 4]);
			}
		}), f[n + 1] = p.length;
	});
	let g = Uint32Array.from(p), _ = x(c.length / 3, f, g), v = {}, y = (t) => h[t] >= e.faceCount;
	for (let [t, n] of Object.entries(e.attributes.face)) {
		let e = new n.data.constructor(d.length * n.size);
		for (let t = 0; t < d.length; t++) y(t) || e.set(n.data.subarray(h[t] * n.size, (h[t] + 1) * n.size), t * n.size);
		v[t] = {
			data: e,
			size: n.size
		};
	}
	let b = 0;
	if (r) {
		let e = v["tag:" + r]?.data ?? new Uint8Array(d.length);
		for (let t = 0; t < d.length; t++) y(t) && (e[t] = 1, b++);
		v[me + r] = {
			data: e,
			size: 1
		};
	}
	let S = w({
		positions: Float32Array.from(c),
		faceOffsets: f,
		cornerVertices: g,
		edgeVertices: _.edgeVertices,
		cornerEdges: _.cornerEdges,
		attributes: {
			face: v,
			corner: m ? { uv: {
				data: Float32Array.from(m),
				size: 2
			} } : {}
		}
	}), C = l(S);
	return r && (b = Jt(C, r)), {
		mesh: C,
		cutterFaces: b
	};
}
function Jt(e, t) {
	let n = e.attributes.face[me + t].data, r = 0;
	for (let t = 0; t < e.faceCount; t++) r += +!!n[t];
	return r;
}
// src/mesh-loopcut.js
function Yt(e, t, n) {
	let r = e.loops.arrays, i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), o = [], s = (t) => e.faces.arrays.size[t] === 4;
	for (let c of t) {
		if (i.has(c)) continue;
		let [t, l] = e.edgeVertices(c), u = n(t), d = n(l), f = [
			0,
			1,
			2
		].map((e) => d[e] - u[e]), p = f[f.map(Math.abs).indexOf(Math.max(...f.map(Math.abs)))] >= 0 ? t : l, m = {
			index: o.length,
			edges: /* @__PURE__ */ new Map([[c, p]]),
			quads: [],
			closed: !1
		};
		i.set(c, m.index);
		for (let t of e.edgeLoops(c)) {
			let n = t, o = p;
			for (; s(r.face[n]);) {
				let t = r.face[n];
				if (a.has(t)) {
					if (a.get(t) === m.index) {
						m.closed = !0;
						break;
					}
					throw RangeError(`Loop cut rings cross at face ${t}. Cut them in separate edits.`);
				}
				a.set(t, m.index), m.quads.push({
					face: t,
					entryLoop: n,
					entryLow: o
				});
				let s = r.next[r.next[n]], c = r.edge[s], l = r.vertex[n] === o ? r.vertex[r.next[s]] : r.vertex[s];
				if (i.has(c) && i.get(c) !== m.index) throw RangeError(`Loop cut rings cross at edge ${c}. Cut them in separate edits.`);
				m.edges.set(c, l), i.set(c, m.index);
				let u = r.radialNext[s];
				if (u === s || e.edgeFaceCount(c) !== 2) break;
				n = u, o = l;
			}
		}
		o.push(m);
	}
	return o;
}
function Xt(e, t, { cuts: n = 1, factor: r = .5, name: i = "loop" } = {}) {
	let a = b(e), o = [];
	if (E(e, t, a).forEach((e, t) => {
		e && o.push(t);
	}), !o.length) throw RangeError("The edge rule selects no edges to start a loop cut. Check with mesh_inspect; along [0, 1, 0] picks vertical edges.");
	let s = v(e), c = s.loops.arrays, l = (e) => s.vertexPosition(e), u = Yt(s, o, l), d = n === 1 ? [r] : Array.from({ length: n }, (e, t) => (t + 1) / (n + 1)), f = new D(e), p = new Uint32Array(e.vertexCount);
	for (let t = 0; t < e.vertexCount; t++) p[t] = f.addVertex(...l(t));
	let m = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
	for (let e of u) for (let [t, n] of e.edges) {
		let e = s.edgeOtherVertex(t, n), r = l(n), i = l(e);
		m.set(t, d.map((e) => f.addVertex(...[
			0,
			1,
			2
		].map((t) => r[t] + (i[t] - r[t]) * e)))), h.set(t, n);
	}
	let g = (e) => {
		let t = c.edge[e], n = m.get(t);
		return n ? c.vertex[e] === h.get(t) ? n.map((e, t) => ({
			point: e,
			t: d[t]
		})) : n.map((e, t) => ({
			point: e,
			t: 1 - d[t]
		})).reverse() : [];
	}, _ = (t) => e.faceOffsets[c.face[t]] + s.faceLoops(c.face[t]).indexOf(t), y = /* @__PURE__ */ new Map();
	for (let e of u) for (let t of e.quads) y.set(t.face, t);
	for (let t = 0; t < e.faceCount; t++) {
		let e = y.get(t);
		if (!e) {
			let e = [], n = [];
			for (let r of s.faceLoops(t)) {
				let t = _(r);
				e.push(p[c.vertex[r]]), n.push(t);
				let i = _(c.next[r]);
				for (let { point: a, t: o } of g(r)) e.push(a), n.push({
					from: t,
					to: i,
					t: o
				});
			}
			f.addFace(e, {
				sourceFace: t,
				sourceCorners: n
			});
			continue;
		}
		let n = e.entryLoop, r = c.next[n], a = c.next[r], o = c.next[a], l = g(n), u = g(a).reverse(), d = _(n), m = _(r), h = _(a), v = _(o), b = [
			{
				point: p[c.vertex[n]],
				source: d
			},
			...l.map(({ point: e, t }) => ({
				point: e,
				source: {
					from: d,
					to: m,
					t
				}
			})),
			{
				point: p[c.vertex[r]],
				source: m
			}
		], x = [
			{
				point: p[c.vertex[o]],
				source: v
			},
			...u.map(({ point: e, t }) => ({
				point: e,
				source: {
					from: h,
					to: v,
					t
				}
			})),
			{
				point: p[c.vertex[a]],
				source: h
			}
		], S = c.vertex[n] === e.entryLow;
		for (let e = 0; e + 1 < b.length; e++) {
			let n = S ? e : b.length - 2 - e;
			f.addFace([
				b[e].point,
				b[e + 1].point,
				x[e + 1].point,
				x[e].point
			], {
				sourceFace: t,
				sourceCorners: [
					b[e].source,
					b[e + 1].source,
					x[e + 1].source,
					x[e].source
				],
				tags: [`${i}.band-${n}`]
			});
		}
	}
	return {
		mesh: f.build(),
		rings: u.length,
		closedRings: u.filter((e) => e.closed).length,
		splitEdges: m.size
	};
}
// src/mesh-polygons.js
function L(e) {
	let t = [];
	for (let n = 0; n < e.faceCount; n++) {
		let r = {
			vertices: [],
			sourceFace: n,
			sourceCorners: [],
			sourceEdges: [],
			tags: []
		};
		for (let t = e.faceOffsets[n]; t < e.faceOffsets[n + 1]; t++) r.vertices.push(e.cornerVertices[t]), r.sourceCorners.push(t), r.sourceEdges.push(e.cornerEdges[t]);
		t.push(r);
	}
	return t;
}
function R(e, t, n = []) {
	let r = /* @__PURE__ */ new Set();
	for (let e of t) for (let t of e.vertices) r.add(t);
	let i = new D(e), a = /* @__PURE__ */ new Map();
	for (let t of [...r].sort((e, t) => e - t)) {
		let r = t < e.vertexCount ? [
			e.positions[t * 3],
			e.positions[t * 3 + 1],
			e.positions[t * 3 + 2]
		] : n[t - e.vertexCount];
		a.set(t, i.addVertex(...r));
	}
	for (let e of t) i.addFace(e.vertices.map((e) => a.get(e)), {
		sourceFace: e.sourceFace,
		sourceCorners: e.sourceCorners,
		sourceEdges: e.sourceEdges,
		keepTags: e.keepTags ?? !0,
		tags: e.tags
	});
	return i.build();
}
function Zt(e) {
	let t = new Uint32Array(e.edgeCount);
	for (let n of e.cornerEdges) t[n]++;
	return t;
}
function Qt(e, t = null) {
	let n = Zt(e), r = /* @__PURE__ */ new Map();
	for (let i = 0; i < e.faceCount; i++) {
		let a = e.faceOffsets[i], o = e.faceOffsets[i + 1];
		for (let i = a; i < o; i++) {
			let a = e.cornerEdges[i];
			if (n[a] !== 1 || t && !t[a]) continue;
			let o = e.cornerVertices[i];
			r.has(o) || r.set(o, []), r.get(o).push(i);
		}
	}
	let i = (t) => {
		let n = $t(e, t);
		return t + 1 === e.faceOffsets[n + 1] ? e.faceOffsets[n] : t + 1;
	}, a = /* @__PURE__ */ new Set(), o = [];
	for (let t of r.values()) for (let n of t) {
		if (a.has(n)) continue;
		let t = {
			vertices: [],
			corners: [],
			closed: !1
		}, s = n;
		for (; s !== void 0 && !a.has(s);) {
			a.add(s), t.vertices.push(e.cornerVertices[s]), t.corners.push(s);
			let n = e.cornerVertices[i(s)];
			if (n === t.vertices[0]) {
				t.closed = !0;
				break;
			}
			s = (r.get(n) ?? []).find((e) => !a.has(e));
		}
		o.push(t);
	}
	return o;
}
function $t(e, t) {
	let n = 0, r = e.faceCount - 1;
	for (; n < r;) {
		let i = n + r + 1 >> 1;
		e.faceOffsets[i] <= t ? n = i : r = i - 1;
	}
	return n;
}
function en(e) {
	let t = /* @__PURE__ */ new Map(), n = (e, n) => {
		t.has(e) || t.set(e, /* @__PURE__ */ new Set()), t.get(e).add(n);
	};
	for (let t of e) t.vertices.forEach((e, r) => {
		let i = t.vertices[(r + 1) % t.vertices.length];
		n(e, i), n(i, e);
	});
	return t;
}
// src/mesh-dissolve.js
function tn(e, { sides: t = Infinity, name: n = "fill" } = {}) {
	let r = L(e), i = 0, a = 0;
	for (let o of Qt(e)) !o.closed || o.vertices.length > t ? a++ : (r.push({
		vertices: [...o.vertices].reverse(),
		sourceFace: $t(e, o.corners[0]),
		sourceCorners: [...o.corners].reverse(),
		sourceEdges: [...o.corners].reverse().map((t) => e.cornerEdges[t]),
		keepTags: !1,
		tags: [`${n}.fill`]
	}), i++);
	if (i === 0) throw RangeError(a === 0 ? "The mesh has no open boundary to fill." : `No boundary loop could be filled: ${a} skipped because they are open chains or have more than ${t} sides.`);
	return {
		mesh: R(e, r),
		filled: i,
		skipped: a
	};
}
function nn(e, t) {
	let n = t;
	for (; e[n] !== n;) n = e[n];
	for (; e[t] !== n;) {
		let r = e[t];
		e[t] = n, t = r;
	}
	return n;
}
function rn(e, t, n) {
	let r = b(e), i = Array.from({ length: e.faceCount }, (e, t) => t), a = new Uint8Array(e.edgeCount);
	for (let n = 0; n < e.edgeCount; n++) {
		let e = r.faces[n];
		t[n] && e.length === 2 && (a[n] = 1, i[nn(i, e[0])] = nn(i, e[1]));
	}
	let o = /* @__PURE__ */ new Map();
	for (let t = 0; t < e.faceCount; t++) {
		let e = nn(i, t);
		o.has(e) || o.set(e, []), o.get(e).push(t);
	}
	let s = L(e), c = [], l = 0;
	for (let t of o.values()) t.length === 1 ? c.push(s[t[0]]) : (c.push(an(e, t, a, n)), l++);
	return {
		polygons: c,
		merged: l,
		dissolvedEdges: a.reduce((e, t) => e + t, 0)
	};
}
function an(e, t, n, r) {
	let i = /* @__PURE__ */ new Map(), a = 0;
	for (let r of t) for (let t = e.faceOffsets[r]; t < e.faceOffsets[r + 1]; t++) {
		if (n[e.cornerEdges[t]]) continue;
		let r = e.cornerVertices[t];
		if (i.has(r)) throw RangeError(`Dissolving would pinch a face at vertex ${r}. Dissolve fewer edges.`);
		i.set(r, t), a++;
	}
	let o = {
		vertices: [],
		sourceFace: Math.min(...t),
		sourceCorners: [],
		sourceEdges: [],
		tags: [`${r}.merged`]
	}, s = i.values().next().value, c = s;
	do {
		o.vertices.push(e.cornerVertices[c]), o.sourceCorners.push(c), o.sourceEdges.push(e.cornerEdges[c]);
		let t = $t(e, c), n = c + 1 === e.faceOffsets[t + 1] ? e.faceOffsets[t] : c + 1;
		c = i.get(e.cornerVertices[n]);
	} while (c !== void 0 && c !== s);
	if (o.vertices.length !== a) throw RangeError("Dissolving would leave a face with a hole or a split outline. Dissolve fewer edges.");
	return o;
}
function on(e, t, { name: n = "dissolve" } = {}) {
	let r = b(e), i = new Uint8Array(e.edgeCount);
	for (let n = 0; n < e.edgeCount; n++) {
		let e = r.faces[n];
		i[n] = e.length === 2 && t[e[0]] && t[e[1]] ? 1 : 0;
	}
	let a = rn(e, i, n);
	if (a.merged === 0) throw RangeError("The selection holds no two faces that share an edge, so nothing dissolves.");
	return {
		mesh: R(e, a.polygons),
		merged: a.merged
	};
}
function sn(e, t, { name: n = "dissolve" } = {}) {
	let r = rn(e, t, n);
	if (r.merged === 0) throw RangeError("The rule selects no edge with a face on each side, so nothing dissolves.");
	return {
		mesh: R(e, r.polygons),
		merged: r.merged,
		dissolvedEdges: r.dissolvedEdges
	};
}
function cn(e, t) {
	for (let n of e) {
		let e = n.vertices.map((e) => !t.has(e));
		if (!e.every(Boolean)) {
			if (e.filter(Boolean).length < 3) throw RangeError("Removing the vertices would collapse a face below three corners.");
			for (let t of [
				"vertices",
				"sourceCorners",
				"sourceEdges"
			]) n[t] = n[t].filter((t, n) => e[n]);
		}
	}
}
function ln(e, t, { name: n = "dissolve" } = {}) {
	let r = en(L(e)), i = new Uint8Array(e.edgeCount), a = /* @__PURE__ */ new Set();
	for (let n = 0; n < e.vertexCount; n++) t[n] && (r.get(n)?.size ?? 0) === 2 && a.add(n);
	for (let n = 0; n < e.edgeCount; n++) {
		let r = e.edgeVertices[n * 2], o = e.edgeVertices[n * 2 + 1];
		(t[r] && !a.has(r) || t[o] && !a.has(o)) && (i[n] = 1);
	}
	let o = rn(e, i, n);
	if (cn(o.polygons, a), t.reduce((e, t) => e + t, 0) === 0) throw RangeError("The rule selects no vertices.");
	return {
		mesh: R(e, o.polygons),
		merged: o.merged,
		removedStraight: a.size
	};
}
function un(e, t, n) {
	let r = [
		0,
		1,
		2
	].map((r) => e.positions[n * 3 + r] - e.positions[t * 3 + r]), i = Math.hypot(...r) || 1;
	return r.map((e) => e / i);
}
function dn(e, t, { angle: n = 5, name: r = "dissolve" } = {}) {
	let i = b(e), { normals: a } = m(e), o = Math.cos(n * Math.PI / 180) - 1e-9, s = new Uint8Array(e.edgeCount);
	for (let n = 0; n < e.edgeCount; n++) {
		let e = i.faces[n];
		if (!t[n] || e.length !== 2) continue;
		let [r, c] = e;
		[
			0,
			1,
			2
		].reduce((e, t) => e + a[r * 3 + t] * a[c * 3 + t], 0) >= o && (s[n] = 1);
	}
	let c = rn(e, s, r), l = en(c.polygons), u = /* @__PURE__ */ new Set();
	for (let [t, n] of l) {
		if (n.size !== 2 || t >= e.vertexCount) continue;
		let [r, i] = [...n], a = un(e, r, t), s = un(e, t, i);
		a.reduce((e, t, n) => e + t * s[n], 0) >= o && u.add(t);
	}
	if (fn(c.polygons, u), c.merged === 0 && u.size === 0) throw RangeError(`Nothing is within ${n} degrees of flat among the selected edges.`);
	return {
		mesh: R(e, c.polygons),
		merged: c.merged,
		removedStraight: u.size
	};
}
function fn(e, t) {
	let n = /* @__PURE__ */ new Set();
	for (let r of e) {
		let e = r.vertices.filter((e) => t.has(e)).length;
		r.vertices.length - e < 3 && r.vertices.forEach((e) => n.add(e));
	}
	for (let e of n) t.delete(e);
	cn(e, t);
}
function pn(e, t) {
	if (!t || typeof t != "object" || Array.isArray(t) || Object.keys(t).length !== 1) throw TypeError("Vertex rule takes exactly one of all, vertices, valence, inside.");
	let n = new Uint8Array(e.vertexCount);
	if (t.all === !0) return n.fill(1);
	if (Array.isArray(t.vertices)) {
		for (let r of t.vertices) {
			if (!Number.isInteger(r) || r < 0 || r >= e.vertexCount) throw RangeError(`Vertex ${r} does not exist.`);
			n[r] = 1;
		}
		return n;
	}
	if (Number.isInteger(t.valence)) {
		let r = en(L(e));
		for (let i = 0; i < e.vertexCount; i++) n[i] = +((r.get(i)?.size ?? 0) === t.valence);
		return n;
	}
	if (t.inside && Array.isArray(t.inside.min) && Array.isArray(t.inside.max)) {
		for (let r = 0; r < e.vertexCount; r++) n[r] = +!![
			0,
			1,
			2
		].every((n) => {
			let i = e.positions[r * 3 + n];
			return i >= t.inside.min[n] - 1e-6 && i <= t.inside.max[n] + 1e-6;
		});
		return n;
	}
	throw TypeError("Vertex rule takes exactly one of all, vertices (indices), valence (integer), inside ({ min, max }).");
}
// src/mesh-bisect.js
var mn = (e, t) => [
	e[0] - t[0],
	e[1] - t[1],
	e[2] - t[2]
], hn = (e, t) => e[0] * t[0] + e[1] * t[1] + e[2] * t[2], gn = (e, t, n) => e.map((e, r) => e + (t[r] - e) * n), _n = (e) => {
	let t = Math.hypot(...e);
	if (t === 0) throw RangeError("A direction cannot be zero.");
	return e.map((e) => e / t);
};
function vn(e, t, n) {
	return n >= e.vertexCount ? t[n - e.vertexCount] : [
		e.positions[n * 3],
		e.positions[n * 3 + 1],
		e.positions[n * 3 + 2]
	];
}
function yn(e, t, n) {
	let r = [];
	for (let i = t;; i = (i + 1) % e.length) if (r.push(e[i]), i === n) return r;
}
function bn(e, t, n, r, i) {
	let a = (t, n, r, i) => ({
		...e,
		vertices: [...yn(e.vertices, t, n), ...r],
		sourceCorners: [...yn(e.sourceCorners, t, n), ...i],
		sourceEdges: [...yn(e.sourceEdges, t, n), ...r.map(() => -1)]
	});
	return [a(t, n, [...r].reverse(), r.map(() => i)), a(n, t, r, r.map(() => i))];
}
function xn(e, t, n, r) {
	let i = new Int8Array(e.vertexCount), a = new Float64Array(e.vertexCount);
	for (let o = 0; o < e.vertexCount; o++) {
		let s = hn(mn(vn(e, [], o), t), n);
		a[o] = s, i[o] = s > r ? 1 : s < -r ? -1 : 0;
	}
	return {
		signs: i,
		offsets: a
	};
}
function Sn(e, t, n, r) {
	let i = /* @__PURE__ */ new Map();
	for (let a = 0; a < e.edgeCount; a++) {
		let o = e.edgeVertices[a * 2], s = e.edgeVertices[a * 2 + 1];
		if (t[o] * t[s] !== -1) continue;
		let c = n[o] / (n[o] - n[s]);
		r.push(gn(vn(e, [], o), vn(e, [], s), c)), i.set(a, {
			vertex: e.vertexCount + r.length - 1,
			from: o,
			fraction: c
		});
	}
	return i;
}
function Cn(e, t, n, r) {
	let i = {
		...t,
		vertices: [],
		sourceCorners: [],
		sourceEdges: []
	}, a = [], o = t.vertices.length;
	for (let e = 0; e < o; e++) {
		let s = t.vertices[e], c = t.sourceCorners[e], l = t.sourceEdges[e];
		i.vertices.push(s), i.sourceCorners.push(c), i.sourceEdges.push(l), a.push(n[s]);
		let u = r.get(l);
		if (!u) continue;
		let d = t.sourceCorners[(e + 1) % o], f = u.from === s ? u.fraction : 1 - u.fraction;
		i.vertices.push(u.vertex), i.sourceCorners.push({
			from: c,
			to: d,
			t: f
		}), i.sourceEdges.push(l), a.push(0);
	}
	return {
		outline: i,
		sides: a
	};
}
function wn(e) {
	return e.find((e) => e !== 0) ?? 0;
}
function Tn(e, t, n, r, i) {
	let { outline: a, sides: o } = Cn(e, t, n, r);
	if (!o.includes(1) || !o.includes(-1)) return {
		pieces: [{
			polygon: a,
			side: wn(o)
		}],
		cut: !1
	};
	let s = o.map((e, t) => e === 0 ? t : -1).filter((e) => e >= 0);
	if (s.length !== 2) throw RangeError(`Face ${i} crosses the plane ${s.length} times. Split it into convex faces first.`);
	let [c, l] = s, u = yn(o, c, l), d = bn(a, c, l, [], -1);
	return {
		pieces: [{
			polygon: d[0],
			side: wn(u)
		}, {
			polygon: d[1],
			side: -wn(u)
		}],
		cut: !0
	};
}
function En(e, t) {
	let n = [];
	for (let { polygon: r } of e) r.vertices.forEach((e, i) => {
		let a = r.vertices[(i + 1) % r.vertices.length];
		t(e) && t(a) && n.push({
			from: e,
			to: a,
			polygon: r,
			position: i
		});
	});
	return n;
}
function Dn(e, t, n) {
	let r = En(e, n), i = new Set(En([...e, ...t], n).map(({ from: e, to: t }) => `${e}>${t}`));
	return r.filter(({ from: e, to: t }) => !i.has(`${t}>${e}`));
}
function On(e) {
	let t = new Map(e.map((e) => [e.from, e])), n = /* @__PURE__ */ new Set(), r = [], i = 0;
	for (let a of e) {
		if (n.has(a)) continue;
		let e = [], o = a;
		for (; o && !n.has(o);) n.add(o), e.push(o), o = t.get(o.to);
		o === a ? r.push(e) : i++;
	}
	return {
		loops: r,
		open: i
	};
}
function kn(e, t) {
	let n = [...e].reverse();
	return {
		vertices: n.map((e) => e.to),
		sourceFace: e[0].polygon.sourceFace,
		sourceCorners: n.map((e) => e.polygon.sourceCorners[e.position]),
		sourceEdges: n.map(() => -1),
		keepTags: !1,
		tags: [t]
	};
}
function An(e, { point: t, normal: n, distance: r = 1e-4, clearInner: i = !1, clearOuter: a = !1, fill: o = !1, name: s = "bisect" }) {
	let { signs: c, offsets: l } = xn(e, t, _n(n), r), u = [], d = Sn(e, c, l, u), f = [], p = 0;
	if (L(e).forEach((t, n) => {
		let r = Tn(e, t, c, d, n);
		r.cut && p++, f.push(...r.pieces);
	}), p === 0) throw RangeError("The plane does not cross any face. Check point and normal against the mesh bounds.");
	let m = (t) => t >= e.vertexCount || c[t] === 0, h = f.filter((e) => e.side === -1), g = f.filter((e) => e.side === 1), _ = f.filter((e) => e.side === 0);
	for (let { polygon: e, side: t } of f) t === -1 && (e.tags = [...e.tags, `${s}.inner`]), t === 1 && (e.tags = [...e.tags, `${s}.outer`]);
	let v = f.filter(({ side: e }) => e === -1 && !i || e === 1 && !a || e === 0).map(({ polygon: e }) => e), y = (e) => {
		let { loops: t, open: n } = On(Dn(e, _, m));
		return {
			caps: t.map((e) => kn(e, `${s}.cap`)),
			open: n
		};
	}, b = 0, x = 0;
	if (o) {
		let t = i ? {
			caps: [],
			open: 0
		} : y(h), n = a ? {
			caps: [],
			open: 0
		} : y(g);
		!i && !a && jn(e, [...g.map(({ polygon: e }) => e), ...n.caps], m, u), v.push(...t.caps, ...n.caps), b = t.caps.length + n.caps.length, x = t.open + n.open;
	}
	return {
		mesh: R(e, v, u),
		cutFaces: p,
		capped: b,
		unfilled: x,
		newVertices: d.size
	};
}
function jn(e, t, n, r) {
	let i = /* @__PURE__ */ new Map(), a = (t) => (i.has(t) || (r.push(vn(e, r, t)), i.set(t, e.vertexCount + r.length - 1)), i.get(t));
	for (let e of t) e.vertices = e.vertices.map((e) => n(e) ? a(e) : e);
}
// src/mesh-bridge.js
var Mn = 65536;
function z(e, t, n) {
	return n >= e.vertexCount ? t[n - e.vertexCount] : [
		e.positions[n * 3],
		e.positions[n * 3 + 1],
		e.positions[n * 3 + 2]
	];
}
var Nn = (e, t, n) => e.map((e, r) => e + (t[r] - e) * n), Pn = (e, t) => e.reduce((e, n, r) => e + (n - t[r]) ** 2, 0);
function Fn(e, t, n) {
	return t.push(n), e.vertexCount + t.length - 1;
}
function In(e, t, n) {
	return {
		vertices: e,
		sourceFace: t,
		sourceCorners: e.map(() => -1),
		sourceEdges: e.map(() => -1),
		keepTags: !1,
		tags: [n]
	};
}
function Ln(e, t, n) {
	let r = 0, i = Infinity;
	for (let a = 0; a < t.length; a++) {
		let o = 0;
		for (let r = 0; r < t.length; r++) o += Pn(z(e, [], t[r]), z(e, [], n[(r + a) % n.length]));
		o < i - 1e-12 && (r = a, i = o);
	}
	return r;
}
function Rn(e, t, { segments: n = 1, twist: r = 0, name: i = "bridge" } = {}) {
	let a = Qt(e, t);
	if (a.length !== 2) throw RangeError(`The edge rule selects ${a.length} boundary loops; bridge needs exactly 2. Use { "open": true } for every hole, or { "open": { "inside": { "min": [x, y, z], "max": [x, y, z] } } } to pick some.`);
	let [o, s] = a;
	if (o.closed !== s.closed) throw RangeError("One loop is closed and the other is an open chain; bridge needs two of the same kind.");
	if (o.vertices.length !== s.vertices.length) throw RangeError(`The loops have ${o.vertices.length} and ${s.vertices.length} edges; bridge needs the same number. Run subdivide_edges on the shorter one first.`);
	let c = o.vertices.length, l = o.closed;
	if ((c + 1) * (n + 1) > Mn) throw RangeError("The bridge would make too many vertices. Lower segments.");
	let u = Bn(e, o), d = Bn(e, s).reverse(), f = l ? (Ln(e, u, d) + r % c + c) % c : 0, p = u.map((e, t) => d[(t + f) % d.length]), m = [], h = [u];
	for (let t = 1; t < n; t++) h.push(u.map((r, i) => Fn(e, m, Nn(z(e, m, r), z(e, m, p[i]), t / n))));
	h.push(p);
	let g = L(e), _ = $t(e, o.corners[0]);
	for (let e = 0; e < n; e++) for (let t = 0; t < c; t++) {
		let n = (t + 1) % u.length;
		g.push(In([
			h[e][n],
			h[e][t],
			h[e + 1][t],
			h[e + 1][n]
		], _, `${i}.bridge`));
	}
	return {
		mesh: R(e, g, m),
		loopEdges: c,
		strips: n * c
	};
}
function zn(e, t) {
	let n = $t(e, t);
	return t + 1 === e.faceOffsets[n + 1] ? e.faceOffsets[n] : t + 1;
}
function Bn(e, t) {
	if (t.closed) return [...t.vertices];
	let n = t.corners[t.corners.length - 1];
	return [...t.vertices, e.cornerVertices[zn(e, n)]];
}
function Vn(e, t, n, r) {
	let i = z(e, [], n).map((n, r) => n - z(e, [], t)[r]), a = z(e, [], r).map((t, r) => t - z(e, [], n)[r]), o = Math.hypot(...i) * Math.hypot(...a) || 1, s = i.reduce((e, t, n) => e + t * a[n], 0) / o;
	return Math.acos(Math.max(-1, Math.min(1, s)));
}
function Hn(e, t) {
	let n = t.length, r = null;
	for (let i = 1; i < n / 2; i++) {
		let a = n / 2 - i;
		for (let o = 0; o < n; o++) {
			let s = [
				0,
				i,
				i + a,
				2 * i + a
			].map((e) => (o + e) % n).reduce((r, i) => r + Vn(e, t[(i + n - 1) % n], t[i], t[(i + 1) % n]), 0) - Math.abs(i - a) * 1e-6;
			(!r || s > r.score + 1e-9) && (r = {
				score: s,
				a: i,
				b: a,
				start: o
			});
		}
	}
	return r;
}
function Un(e, t, n, r) {
	let i = t.vertices, a = i.length, { a: o, b: s, start: c } = Hn(e, i), l = (e) => i[(c + e) % a], u = Array.from({ length: o + 1 }, () => Array(s + 1));
	for (let e = 0; e <= o; e++) u[e][0] = l(e), u[e][s] = l(2 * o + s - e);
	for (let e = 0; e <= s; e++) u[o][e] = l(o + e), u[0][e] = l(a - e);
	let d = (t, n) => z(e, r, u[t][n]);
	for (let t = 1; t < o; t++) for (let n = 1; n < s; n++) {
		let i = t / o, a = n / s, c = [
			0,
			1,
			2
		].map((e) => (1 - a) * d(t, 0)[e] + a * d(t, s)[e] + (1 - i) * d(0, n)[e] + i * d(o, n)[e] - ((1 - i) * (1 - a) * d(0, 0)[e] + i * (1 - a) * d(o, 0)[e] + (1 - i) * a * d(0, s)[e] + i * a * d(o, s)[e]));
		u[t][n] = Fn(e, r, c);
	}
	let f = $t(e, t.corners[0]), p = [];
	for (let e = 0; e < o; e++) for (let t = 0; t < s; t++) p.push(In([
		u[e][t],
		u[e][t + 1],
		u[e + 1][t + 1],
		u[e + 1][t]
	], f, `${n}.fill`));
	return p;
}
function Wn(e, t, { name: n = "grid" } = {}) {
	let r = Qt(e, t);
	if (r.length === 0) throw RangeError("The edge rule selects no boundary loop. Use { \"open\": true } to pick the holes.");
	let i = L(e), a = [];
	for (let t of r) {
		let r = t.vertices.length;
		if (!t.closed) throw RangeError("A selected boundary chain is open; grid_fill needs closed loops.");
		if (r < 4 || r % 2 != 0) throw RangeError(`A loop has ${r} edges; grid_fill needs an even number, at least 4. Subdivide one edge or use fill_holes.`);
		i.push(...Un(e, t, n, a));
	}
	return {
		mesh: R(e, i, a),
		loops: r.length
	};
}
// src/mesh-edgesplit.js
function Gn(e, t, n) {
	return e.map((e, r) => e + (t[r] - e) * n);
}
function Kn(e, t, n) {
	let r = 0;
	for (let n = 0; n < e.edgeCount; n++) r += +!!t[n];
	let i = n + 1;
	return {
		vertices: e.vertexCount + r * n + e.faceCount * n * n,
		faces: e.faceCount * i * i
	};
}
function qn(e, t, { cuts: n = 1, name: r = "subdivide" } = {}) {
	let i = [], a = e.vertexCount, o = (t) => [
		e.positions[t * 3],
		e.positions[t * 3 + 1],
		e.positions[t * 3 + 2]
	], s = (e) => (i.push(e), a + i.length - 1), c = /* @__PURE__ */ new Map();
	for (let r = 0; r < e.edgeCount; r++) {
		if (!t[r]) continue;
		let i = o(e.edgeVertices[r * 2]), a = o(e.edgeVertices[r * 2 + 1]);
		c.set(r, Array.from({ length: n }, (e, t) => s(Gn(i, a, (t + 1) / (n + 1)))));
	}
	let l = (e) => e >= a ? i[e - a] : o(e), u = Array.from({ length: n }, (e, t) => (t + 1) / (n + 1)), d = (t, n) => {
		let r = c.get(t.sourceEdges[n]);
		return r ? (t.vertices[n] === e.edgeVertices[t.sourceEdges[n] * 2] ? r : [...r].reverse()).map((e, t) => ({
			vertex: e,
			t: u[t]
		})) : [];
	}, f = [], p = 0;
	for (let t of L(e)) {
		let e = t.vertices.length, i = t.vertices.map((e, n) => d(t, n).length > 0);
		if (!i.some(Boolean)) {
			f.push(t);
			continue;
		}
		p++;
		let a = e === 4 ? Xn(t, i, d, l, s, n) : null;
		f.push(...(a ?? Jn(t, d)).map((e) => ({
			...e,
			tags: [...t.tags, `${r}.split`]
		})));
	}
	return {
		mesh: R(e, f, i),
		splitEdges: c.size,
		splitFaces: p
	};
}
function Jn(e, t) {
	let n = {
		...e,
		vertices: [],
		sourceCorners: [],
		sourceEdges: []
	}, r = e.vertices.length;
	return e.vertices.forEach((i, a) => {
		n.vertices.push(i), n.sourceCorners.push(e.sourceCorners[a]), n.sourceEdges.push(e.sourceEdges[a]);
		for (let { vertex: i, t: o } of t(e, a)) n.vertices.push(i), n.sourceCorners.push({
			from: e.sourceCorners[a],
			to: e.sourceCorners[(a + 1) % r],
			t: o
		}), n.sourceEdges.push(e.sourceEdges[a]);
	}), [n];
}
function Yn(e, t) {
	let n = (e) => e.map((n, r) => e[(r + t) % e.length]);
	return {
		...e,
		vertices: n(e.vertices),
		sourceCorners: n(e.sourceCorners),
		sourceEdges: n(e.sourceEdges)
	};
}
function Xn(e, t, n, r, i, a) {
	let o = t.filter(Boolean).length, s = o === 2 && t[0] === t[2];
	if (o !== 4 && !s) return null;
	let c = o === 4 || t[0] ? e : Yn(e, 1), [l, u, d, f] = c.vertices, [p, m, h, g] = c.sourceCorners, _ = (e) => n(c, e), v = [
		{
			vertex: l,
			source: p
		},
		..._(0).map(({ vertex: e, t }) => ({
			vertex: e,
			source: {
				from: p,
				to: m,
				t
			}
		})),
		{
			vertex: u,
			source: m
		}
	], y = [
		{
			vertex: f,
			source: g
		},
		..._(2).reverse().map(({ vertex: e, t }) => ({
			vertex: e,
			source: {
				from: g,
				to: h,
				t: 1 - t
			}
		})),
		{
			vertex: d,
			source: h
		}
	];
	return o === 2 ? Qn(c, v, y) : $n(c, v, y, _, r, i, a);
}
function Zn(e, t, n) {
	return {
		...e,
		vertices: t,
		sourceCorners: n,
		sourceEdges: t.map(() => -1)
	};
}
function Qn(e, t, n) {
	let r = [];
	for (let i = 0; i + 1 < t.length; i++) r.push(Zn(e, [
		t[i].vertex,
		t[i + 1].vertex,
		n[i + 1].vertex,
		n[i].vertex
	], [
		t[i].source,
		t[i + 1].source,
		n[i + 1].source,
		n[i].source
	]));
	return r;
}
function $n(e, t, n, r, i, a, o) {
	let [s, c, l, u] = e.vertices, [d, f, p, m] = e.sourceCorners, h = o + 2, g = [
		c,
		...r(1).map(({ vertex: e }) => e),
		l
	], _ = [
		s,
		...r(3).reverse().map(({ vertex: e }) => e),
		u
	], v = Array.from({ length: h }, () => Array(h)), y = Array.from({ length: h }, () => Array(h));
	for (let e = 0; e < h; e++) v[e][0] = t[e].vertex, v[e][h - 1] = n[e].vertex;
	for (let e = 0; e < h; e++) v[0][e] = _[e], v[h - 1][e] = g[e];
	let b = [
		d,
		f,
		p,
		m
	];
	for (let e = 0; e < h; e++) for (let t = 0; t < h; t++) {
		let n = e / (h - 1), r = t / (h - 1), i = [
			(1 - n) * (1 - r),
			n * (1 - r),
			n * r,
			(1 - n) * r
		];
		y[e][t] = { weights: b.map((e, t) => [e, i[t]]) };
	}
	let [x, S, C, ee] = [
		s,
		c,
		l,
		u
	].map(i);
	for (let e = 1; e < h - 1; e++) for (let t = 1; t < h - 1; t++) {
		let n = e / (h - 1), r = t / (h - 1);
		v[e][t] = a(Gn(Gn(x, S, n), Gn(ee, C, n), r));
	}
	let te = [];
	for (let t = 0; t + 1 < h; t++) for (let n = 0; n + 1 < h; n++) {
		let r = [
			[t, n],
			[t + 1, n],
			[t + 1, n + 1],
			[t, n + 1]
		];
		te.push(Zn(e, r.map(([e, t]) => v[e][t]), r.map(([e, t]) => y[e][t])));
	}
	return te;
}
// src/mesh-knife.js
var er = 256, tr = 1e-6, nr = (e, t) => e[0] * t[0] + e[1] * t[1] + e[2] * t[2], rr = (e, t) => [
	e[1] * t[2] - e[2] * t[1],
	e[2] * t[0] - e[0] * t[2],
	e[0] * t[1] - e[1] * t[0]
], ir = (e, t, n) => e.map((e, r) => e + (t[r] - e) * n), ar = (e, t) => e[0] * t[1] - e[1] * t[0];
function or(e) {
	let t = Math.hypot(...e);
	if (t === 0) throw RangeError("direction cannot be zero.");
	let n = e.map((e) => e / t), r = n.map(Math.abs).indexOf(Math.min(...n.map(Math.abs))), i = [
		0,
		0,
		0
	];
	i[r] = 1;
	let a = rr(n, i), o = Math.hypot(...a), s = a.map((e) => e / o);
	return {
		along: n,
		sideways: s,
		upwards: rr(n, s)
	};
}
function sr(e, t) {
	let n = !1;
	for (let r = 0, i = t.length - 1; r < t.length; i = r++) {
		let [a, o] = t[r], [s, c] = t[i];
		o > e[1] != c > e[1] && e[0] < (s - a) * (e[1] - o) / (c - o) + a && (n = !n);
	}
	return n;
}
function cr(e, t, n, r, i) {
	let a = /* @__PURE__ */ new Map();
	for (let o = 0; o < e.edgeCount; o++) {
		let s = e.edgeVertices[o * 2], c = e.edgeVertices[o * 2 + 1], l = t[s], u = [t[c][0] - l[0], t[c][1] - l[1]], d = [];
		for (let t = 0; t + 1 < r.points.length; t++) {
			let a = r.points[t], o = [r.points[t + 1][0] - a[0], r.points[t + 1][1] - a[1]], f = ar(u, o);
			if (Math.abs(f) < 1e-12) continue;
			let p = [a[0] - l[0], a[1] - l[1]], m = ar(p, o) / f, h = ar(p, u) / f;
			if (m < -1e-6 || m > 1.000001 || h < -1e-6 || h > 1.000001) continue;
			let g = Math.min(1, Math.max(0, m)), _ = r.lengths[t] + Math.min(1, Math.max(0, h)) * (r.lengths[t + 1] - r.lengths[t]);
			d.some((e) => Math.abs(e.t - g) < tr) || (g < tr ? d.push({
				t: 0,
				vertex: s,
				s: _,
				inserted: !1
			}) : g > .999999 ? d.push({
				t: 1,
				vertex: c,
				s: _,
				inserted: !1
			}) : (i.push(ir(n(s), n(c), g)), d.push({
				t: g,
				vertex: e.vertexCount + i.length - 1,
				s: _,
				inserted: !0
			})));
		}
		d.length && a.set(o, d.sort((e, t) => e.t - t.t));
	}
	return a;
}
function lr(e, t, n) {
	let r = {
		...t,
		vertices: [],
		sourceCorners: [],
		sourceEdges: []
	}, i = t.vertices.length, a = [];
	return t.vertices.forEach((o, s) => {
		r.vertices.push(o), r.sourceCorners.push(t.sourceCorners[s]), r.sourceEdges.push(t.sourceEdges[s]);
		let c = t.sourceEdges[s], l = n.get(c);
		if (!l) return;
		let u = o === e.edgeVertices[c * 2];
		for (let e of u ? l : [...l].reverse()) a.push(e), e.inserted && (r.vertices.push(e.vertex), r.sourceCorners.push({
			from: t.sourceCorners[s],
			to: t.sourceCorners[(s + 1) % i],
			t: u ? e.t : 1 - e.t
		}), r.sourceEdges.push(c));
	}), {
		outline: r,
		events: a
	};
}
function ur(e) {
	let t = [
		0,
		0,
		0
	];
	return e.forEach((n, r) => {
		let i = e[(r + 1) % e.length];
		t[0] += (n[1] - i[1]) * (n[2] + i[2]), t[1] += (n[2] - i[2]) * (n[0] + i[0]), t[2] += (n[0] - i[0]) * (n[1] + i[1]);
	}), t;
}
function dr(e, t) {
	let n = 0;
	for (; n + 2 < e.lengths.length && e.lengths[n + 1] < t;) n++;
	let r = e.lengths[n + 1] - e.lengths[n] || 1;
	return ir(e.points[n], e.points[n + 1], (t - e.lengths[n]) / r);
}
function fr(e, t, n, r) {
	let i = t.sideways.map((n, r) => n * e[0] + t.upwards[r] * e[1]), a = nr(r, n.map((e, t) => e - i[t])) / nr(r, t.along);
	return i.map((e, n) => e + t.along[n] * a);
}
function pr(e, { path: t, direction: n, name: r = "knife" }) {
	if (!Array.isArray(t) || t.length < 2 || t.length > er) throw RangeError(`path needs 2 to ${er} points.`);
	let i = or(n), a = (t) => [
		e.positions[t * 3],
		e.positions[t * 3 + 1],
		e.positions[t * 3 + 2]
	], o = (e) => [nr(e, i.sideways), nr(e, i.upwards)], s = Array.from({ length: e.vertexCount }, (e, t) => o(a(t))), c = t.map(o), l = [0];
	for (let e = 1; e < c.length; e++) l.push(l[e - 1] + Math.hypot(c[e][0] - c[e - 1][0], c[e][1] - c[e - 1][1]));
	let u = {
		points: c,
		lengths: l
	}, d = [], f = cr(e, s, a, u, d), p = [], m = 0;
	for (let t of L(e)) {
		let { outline: n, events: o } = lr(e, t, f), c = mr(e, t, n, o, {
			basis: i,
			line: u,
			flat: s,
			vertexPoint: a,
			extraPositions: d,
			name: r
		});
		c.length > 1 && m++, p.push(...c);
	}
	if (m === 0) throw RangeError("The line does not cross any face when projected along the direction. Check path and direction against the mesh bounds.");
	return {
		mesh: R(e, p, d),
		cutFaces: m,
		newVertices: d.length
	};
}
function mr(e, t, n, r, i) {
	let { basis: a, line: o, flat: s, vertexPoint: c, extraPositions: l, name: u } = i, d = t.vertices.map(c), f = ur(d);
	if (Math.abs(nr(f, a.along)) < 1e-9 * Math.hypot(...f)) return [n];
	let p = [];
	for (let e of [...r].sort((e, t) => e.s - t.s)) {
		let t = p[p.length - 1];
		t && t.vertex === e.vertex && Math.abs(t.s - e.s) < 1e-6 || p.push(e);
	}
	let m = t.vertices.map((e) => s[e]), h = d[0], g = [n];
	for (let n = 0; n + 1 < p.length; n++) {
		let r = p[n], i = p[n + 1];
		if (r.vertex === i.vertex || !sr(dr(o, (r.s + i.s) / 2), m)) continue;
		let s = [];
		o.lengths.forEach((t, n) => {
			t <= r.s + 1e-9 || t >= i.s - 1e-9 || (l.push(fr(o.points[n], a, h, f)), s.push(e.vertexCount + l.length - 1));
		}), g = g.flatMap((e) => {
			let n = e.vertices.indexOf(r.vertex), a = e.vertices.indexOf(i.vertex);
			return n < 0 || a < 0 ? [e] : bn(e, n, a, s, e.sourceCorners[n]).map((e) => ({
				...e,
				tags: [...t.tags, `${u}.cut`]
			}));
		});
	}
	return g;
}
// src/mesh-cut-edits.js
var hr = Object.freeze([
	"fill_holes",
	"dissolve_faces",
	"dissolve_edges",
	"dissolve_verts",
	"dissolve_limited",
	"bisect_plane",
	"bridge_edge_loops",
	"subdivide_edges",
	"grid_fill",
	"knife_project"
]), gr = 256, _r = "an edge rule such as { \"all\": true }, { \"angle\": 30 }, { \"along\": [x, y, z] } or { \"open\": true }";
function vr(e, t, n) {
	return F(e, t, n) ?? !1;
}
function yr(e, t, n, { finiteNumber: r, vector: i }) {
	switch (e.op) {
		case "fill_holes":
			e.sides !== void 0 && (t.sides = P(e.sides, n, "sides", 3, 4096));
			break;
		case "dissolve_faces": break;
		case "dissolve_edges":
		case "bridge_edge_loops":
		case "subdivide_edges":
		case "grid_fill":
			t.edges = I(e.edges, n, "edges", _r);
			break;
		case "dissolve_verts":
			t.verts = I(e.verts, n, "verts", "a vertex rule such as { \"all\": true }, { \"vertices\": [0, 1] }, { \"valence\": 2 } or { \"inside\": { \"min\": [x, y, z], \"max\": [x, y, z] } }");
			break;
		case "dissolve_limited":
			t.edges = e.edges === void 0 ? { all: !0 } : I(e.edges, n, "edges", _r), t.angle = e.angle === void 0 ? 5 : r(e.angle, n, "angle", {
				minimum: 0,
				maximum: 180
			});
			break;
		case "bisect_plane":
			if (t.point = i(e.point, n, "point"), t.normal = i(e.normal, n, "normal"), t.normal.every((e) => e === 0)) throw N(n, "normal", t.normal, "a direction with at least one nonzero number, such as [0, 0, 1]");
			if (t.distance = e.distance === void 0 ? 1e-4 : r(e.distance, n, "distance", {
				minimum: 0,
				maximum: 1e3
			}), t.clearInner = vr(e.clearInner, n, "clearInner"), t.clearOuter = vr(e.clearOuter, n, "clearOuter"), t.fill = vr(e.fill, n, "fill"), t.clearInner && t.clearOuter) throw N(n, "clearOuter", !0, "false when clearInner is true, such as clearOuter false (both together would remove everything)");
			break;
		case "bridge_edge_loops": break;
		case "knife_project":
			if (!Array.isArray(e.path) || e.path.length < 2 || e.path.length > gr) throw N(n, "path", e.path, `an array of 2 to ${gr} points in object space, such as [[0, 0, 0], [1, 0, 0]]`);
			if (t.path = e.path.map((e) => i(e, n, "path")), t.direction = i(e.direction, n, "direction"), t.direction.every((e) => e === 0)) throw N(n, "direction", t.direction, "a direction with at least one nonzero number, such as [0, 0, -1]");
	}
	e.op === "bridge_edge_loops" && (t.segments = e.segments === void 0 ? 1 : P(e.segments, n, "segments", 1, 64), t.twistOffset = e.twistOffset === void 0 ? 0 : P(e.twistOffset, n, "twistOffset", -4096, 4096)), e.op === "subdivide_edges" && (t.cuts = e.cuts === void 0 ? 1 : P(e.cuts, n, "cuts", 1, 16));
}
function br(e, t, n, r) {
	if (t.op !== "subdivide_edges") return;
	let i = Kn(e, E(e, t.edges, b(e)), t.cuts);
	if (i.vertices > n.maxVertices || i.faces > n.maxFaces) throw N(r, "cuts", t.cuts, `a number of cuts that keeps the mesh within ${n.maxVertices} vertices and ${n.maxFaces} faces (this edit would make up to ${i.vertices} vertices and ${i.faces} faces), such as 1, or select fewer edges`, RangeError);
}
function xr(e, t) {
	return E(e, t, b(e));
}
function Sr(e, t) {
	switch (t.op) {
		case "fill_holes": {
			let n = tn(e, {
				sides: t.sides ?? Infinity,
				name: t.name
			});
			return {
				mesh: n.mesh,
				result: {
					filled: n.filled,
					skipped: n.skipped
				}
			};
		}
		case "dissolve_faces": {
			let n = O(e, t.select);
			if (r(n) === 0) throw k("select", t.select, "a rule that matches at least one face, such as { \"all\": true } (check tags and counts with mesh_inspect)");
			let i = on(e, n, { name: t.name });
			return {
				mesh: i.mesh,
				result: { merged: i.merged }
			};
		}
		case "dissolve_edges": {
			let n = sn(e, xr(e, t.edges), { name: t.name });
			return {
				mesh: n.mesh,
				result: {
					merged: n.merged,
					dissolvedEdges: n.dissolvedEdges
				}
			};
		}
		case "dissolve_verts": {
			let n = ln(e, pn(e, t.verts), { name: t.name });
			return {
				mesh: n.mesh,
				result: {
					merged: n.merged,
					removedStraight: n.removedStraight
				}
			};
		}
		case "dissolve_limited": {
			let n = dn(e, xr(e, t.edges), {
				angle: t.angle,
				name: t.name
			});
			return {
				mesh: n.mesh,
				result: {
					merged: n.merged,
					removedStraight: n.removedStraight
				}
			};
		}
		case "bisect_plane": {
			let n = An(e, t);
			return {
				mesh: n.mesh,
				result: {
					cutFaces: n.cutFaces,
					capped: n.capped,
					unfilled: n.unfilled
				}
			};
		}
		case "bridge_edge_loops": {
			let n = Rn(e, xr(e, t.edges), {
				segments: t.segments,
				twist: t.twistOffset,
				name: t.name
			});
			return {
				mesh: n.mesh,
				result: {
					loopEdges: n.loopEdges,
					strips: n.strips
				}
			};
		}
		case "subdivide_edges": {
			let n = qn(e, xr(e, t.edges), {
				cuts: t.cuts,
				name: t.name
			});
			return {
				mesh: n.mesh,
				result: {
					splitEdges: n.splitEdges,
					splitFaces: n.splitFaces
				}
			};
		}
		case "grid_fill": {
			let n = Wn(e, xr(e, t.edges), { name: t.name });
			return {
				mesh: n.mesh,
				result: { loops: n.loops }
			};
		}
		case "knife_project": {
			let n = pr(e, t);
			return {
				mesh: n.mesh,
				result: {
					cutFaces: n.cutFaces,
					newVertices: n.newVertices
				}
			};
		}
	}
	throw TypeError(`Not a cutting edit: ${t.op}`);
}
// src/mesh-reshape-more.js
function Cr(e, t) {
	return [
		e.positions[t * 3],
		e.positions[t * 3 + 1],
		e.positions[t * 3 + 2]
	];
}
function wr(e, t, n) {
	let r = t[0];
	for (let i of t.slice(1)) {
		let t = e.cornerVertices[r.from] === e.cornerVertices[i.from];
		n.union(r.from, t ? i.from : i.to), n.union(r.to, t ? i.to : i.from);
	}
}
function Tr(e, t) {
	let n = b(e), r = new a(e.cornerVertices.length), i = Array.from({ length: e.edgeCount }, () => []);
	for (let t = 0; t < e.faceCount; t++) {
		let n = e.faceOffsets[t], r = e.faceOffsets[t + 1];
		for (let t = n; t < r; t++) i[e.cornerEdges[t]].push({
			from: t,
			to: t + 1 === r ? n : t + 1
		});
	}
	let o = 0;
	for (let a = 0; a < e.edgeCount; a++) t[a] ? n.faces[a].length > 1 && o++ : wr(e, i[a], r);
	if (o === 0) throw RangeError("The rule selects no edge shared by two faces. Select interior edges, such as { \"angle\": 30 } or { \"all\": true }.");
	let s = [], c = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Set(), u = L(e);
	for (let t of u) t.vertices = t.sourceCorners.map((t) => {
		let n = e.cornerVertices[t], i = r.find(t);
		return c.has(i) || (l.has(n) ? (s.push(Cr(e, n)), c.set(i, e.vertexCount + s.length - 1)) : (l.add(n), c.set(i, n))), c.get(i);
	});
	return {
		mesh: R(e, u, s),
		splitEdges: o,
		addedVertices: s.length
	};
}
function Er(e) {
	let t = new Uint8Array(e.vertexCount);
	for (let n of e.cornerVertices) t[n] = 1;
	let n = t.reduce((e, t) => e + +!t, 0);
	if (n === 0) throw RangeError("The mesh has no loose vertex. mesh_lint lists loose vertices as loose-vertex.");
	return {
		mesh: R(e, L(e)),
		removedVertices: n
	};
}
function Dr(e, t) {
	let { normals: n, areas: r } = m(e), i = [
		0,
		0,
		0
	];
	for (let a = 0; a < e.faceCount; a++) {
		let o = !0;
		for (let n = e.faceOffsets[a]; n < e.faceOffsets[a + 1]; n++) t[e.cornerVertices[n]] || (o = !1);
		if (o) for (let e = 0; e < 3; e++) i[e] += n[a * 3 + e] * r[a];
	}
	return i;
}
function Or(e, t, { normal: n = null, factor: r = 1 } = {}) {
	let i = [
		0,
		0,
		0
	], a = 0;
	for (let n = 0; n < e.vertexCount; n++) if (t[n]) {
		a++;
		for (let t = 0; t < 3; t++) i[t] += e.positions[n * 3 + t];
	}
	if (a === 0) throw RangeError("The rule selects no vertex. Use { \"all\": true } or { \"vertices\": [0, 1, 2, 3] }.");
	for (let e = 0; e < 3; e++) i[e] /= a;
	let o = n ?? Dr(e, t), s = Math.hypot(...o);
	if (s === 0) throw RangeError("No plane direction: no face has all of its vertices selected. Pass normal, such as [0, 1, 0].");
	let c = o.map((e) => e / s), l = Float32Array.from(e.positions);
	for (let n = 0; n < e.vertexCount; n++) {
		if (!t[n]) continue;
		let a = 0;
		for (let t = 0; t < 3; t++) a += (e.positions[n * 3 + t] - i[t]) * c[t];
		for (let e = 0; e < 3; e++) l[n * 3 + e] -= c[e] * a * r;
	}
	return {
		mesh: w({
			positions: l,
			faceOffsets: e.faceOffsets,
			cornerVertices: e.cornerVertices,
			edgeVertices: e.edgeVertices,
			cornerEdges: e.cornerEdges,
			attributes: e.attributes
		}),
		flattenedVertices: a
	};
}
function kr(e, t) {
	return [
		e[1] * t[2] - e[2] * t[1],
		e[2] * t[0] - e[0] * t[2],
		e[0] * t[1] - e[1] * t[0]
	];
}
function Ar(e, t) {
	return e[0] * t[0] + e[1] * t[1] + e[2] * t[2];
}
function jr(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r = 0; r < e.edgeCount; r++) {
		let i = e.edgeVertices[r * 2], a = e.edgeVertices[r * 2 + 1];
		if (t[i] && t[a]) for (let [e, t] of [[i, a], [a, i]]) n.has(e) || n.set(e, []), n.get(e).push(t);
	}
	let r = [], i = /* @__PURE__ */ new Set();
	for (let a = 0; a < e.vertexCount; a++) {
		if (!t[a]) continue;
		let e = n.get(a) ?? [];
		if (e.length !== 2) throw RangeError(`Vertex ${a} has ${e.length} selected neighbours; circularize needs closed loops where each vertex has exactly 2. Select only the vertices of the loop, such as { "vertices": [0, 1, 2, 3] }.`);
		if (i.has(a)) continue;
		let o = [a];
		i.add(a);
		let s = a, c = Math.min(...e);
		for (; c !== a;) {
			o.push(c), i.add(c);
			let [e, t] = n.get(c);
			if (e === void 0 || t === void 0) throw RangeError("The selected vertices do not form closed loops.");
			let r = e === s ? t : e;
			s = c, c = r;
		}
		if (o.length < 3) throw RangeError(`The loop through vertex ${a} has ${o.length} vertices; circularize needs at least 3.`);
		r.push(o);
	}
	if (r.length === 0) throw RangeError("The rule selects no vertex. Use a loop such as { \"vertices\": [0, 1, 2, 3] }.");
	return r;
}
function Mr(e, t, { factor: n = 1, regular: r = !0 } = {}) {
	let i = Float32Array.from(e.positions), a = 0;
	for (let o of jr(e, t)) {
		let t = o.map((t) => Cr(e, t)), s = [
			0,
			1,
			2
		].map((e) => t.reduce((t, n) => t + n[e], 0) / t.length), c = t.map((e) => e.map((e, t) => e - s[t])), l = [
			0,
			0,
			0
		];
		c.forEach((e, t) => {
			let n = kr(e, c[(t + 1) % c.length]);
			for (let e = 0; e < 3; e++) l[e] += n[e];
		});
		let u = Math.hypot(...l);
		if (u === 0) throw RangeError(`The loop through vertex ${o[0]} is degenerate (no plane); circularize needs a loop that encloses an area.`);
		let d = l.map((e) => e / u), f = c.map((e) => {
			let t = Ar(e, d);
			return e.map((e, n) => e - d[n] * t);
		}), p = f.reduce((e, t) => e + Math.hypot(...t), 0) / f.length, m = Math.hypot(...f[0]);
		if (m === 0) throw RangeError(`Vertex ${o[0]} sits on the loop's centre; circularize cannot tell its direction.`);
		let h = f[0].map((e) => e / m), g = kr(d, h);
		o.forEach((e, t) => {
			let c = r ? t * 2 * Math.PI / o.length : Math.atan2(Ar(f[t], g), Ar(f[t], h));
			for (let t = 0; t < 3; t++) {
				let r = s[t] + p * (Math.cos(c) * h[t] + Math.sin(c) * g[t]), a = i[e * 3 + t];
				i[e * 3 + t] = a + (r - a) * n;
			}
			a++;
		});
	}
	return {
		mesh: w({
			positions: i,
			faceOffsets: e.faceOffsets,
			cornerVertices: e.cornerVertices,
			edgeVertices: e.edgeVertices,
			cornerEdges: e.cornerEdges,
			attributes: e.attributes
		}),
		circularizedVertices: a
	};
}
// src/mesh-unsubdivide.js
var Nr = 0, Pr = 1, Fr = 2, Ir = -1;
function Lr(e, t) {
	return Array.from(e.cornerVertices.subarray(e.faceOffsets[t], e.faceOffsets[t + 1]));
}
function Rr(e) {
	let t = Array.from({ length: e.vertexCount }, () => []);
	for (let n = 0; n < e.edgeCount; n++) {
		let r = e.edgeVertices[n * 2], i = e.edgeVertices[n * 2 + 1];
		t[r].push(i), t[i].push(r);
	}
	return t;
}
function zr(e) {
	let t = Array.from({ length: e.vertexCount }, () => []);
	for (let n = 0; n < e.faceCount; n++) for (let r of Lr(e, n)) t[r].push(n);
	return t;
}
function Br(e, t, n) {
	let r = [e];
	n[e] = 0;
	for (let e = 0; e < r.length; e++) {
		let i = r[e];
		for (let e of t[i]) if (n[e] === -1) n[e] = 1 - n[i], r.push(e);
		else if (n[e] === n[i]) return null;
	}
	return r;
}
function Vr(e, t, n, r, i) {
	let a = t.find((e) => r[e] === Ir);
	if (a === void 0) return "it has no vertex besides the edge points";
	let o = [a];
	r[a] = i;
	for (let t = 0; t < o.length; t++) {
		let i = o[t];
		for (let t of n[i]) {
			let n = Lr(e, t), a = n[(n.indexOf(i) + 2) % 4];
			if (r[a] === Ir) r[a] = r[i] === Pr ? Fr : Pr, o.push(a);
			else if (r[a] === r[i]) return `quad ${t} joins two vertices of the same kind across its diagonal`;
		}
	}
	return null;
}
function Hr(e, t, n, r) {
	let i = n[t].map((n) => {
		let i = Lr(e, n), a = i.indexOf(t), [, o, s, c] = [
			0,
			1,
			2,
			3
		].map((e) => i[(a + e) % 4]);
		return {
			face: n,
			edgeBefore: o,
			original: s,
			edgeAfter: c,
			fits: r[o] === Nr && r[s] === Fr && r[c] === Nr
		};
	}), a = i.find((e) => !e.fits);
	if (a) return { error: `quad ${a.face} around vertex ${t} is not face point, edge point, original vertex, edge point` };
	let o = new Map(i.map((e) => [e.edgeBefore, e]));
	if (o.size !== i.length) return { error: `the quads around vertex ${t} share an edge point twice` };
	let s = [], c = i[0];
	do
		s.push(c.original), c = o.get(c.edgeAfter);
	while (c && c !== i[0] && s.length <= i.length);
	return c !== i[0] || s.length !== i.length ? { error: `the quads around vertex ${t} do not close into one ring` } : s.length < 3 || new Set(s).size !== s.length ? { error: `vertex ${t} would make a coarse face of fewer than 3 distinct vertices` } : {
		polygon: s,
		quadCount: i.length
	};
}
function Ur(e, t, n, r, i, a) {
	let o = new Int8Array(e.vertexCount).fill(Ir), s = [...t].sort((e, t) => e - t);
	for (let e of s) a[e] === n && (o[e] = Nr);
	let c = Vr(e, t, i, o, r);
	if (c) return { error: c };
	let l = [], u = 0;
	for (let t of s) {
		if (o[t] !== Pr) continue;
		let n = Hr(e, t, i, o);
		if (n.error) return n;
		l.push(n.polygon), u += n.quadCount;
	}
	let d = new Set(t.flatMap((e) => i[e])).size;
	return u === d ? { polygons: l } : { error: "some quads have no face point" };
}
function Wr(e, t, n, r) {
	let i = r[t[0]], a = [];
	for (let o of [1 - i, i]) for (let i of [Fr, Pr]) {
		let s = Ur(e, t, o, i, n, r);
		if (s.polygons) return s.polygons;
		a.push(s.error);
	}
	return { error: a[0] };
}
function Gr(e) {
	let t = Array.from({ length: e.faceCount }, (e, t) => t).find((t) => e.faceOffsets[t + 1] - e.faceOffsets[t] !== 4);
	if (t !== void 0) throw RangeError(`Face ${t} is not a quad; unsubdivide reverses Catmull-Clark subdivision, which leaves only quads. Run tris_to_quads first, or use a mesh from the subdivide edit.`);
	let n = Rr(e), r = zr(e), i = new Int8Array(e.vertexCount).fill(-1), a = [];
	for (let t = 0; t < e.vertexCount; t++) {
		if (i[t] !== -1 || n[t].length === 0) continue;
		let o = Br(t, n, i);
		if (!o) throw RangeError(`The edges around vertex ${t} form an odd cycle, so the mesh is not a subdivided surface (a subdivided mesh alternates edge points and the rest). Unsubdivide needs one level of Catmull-Clark output.`);
		let s = Wr(e, o, r, i);
		if (s.error) throw RangeError(`The mesh is not one level of Catmull-Clark subdivision: ${s.error}. Unsubdivide only reverses that exact pattern.`);
		a.push(...s);
	}
	let o = [...new Set(a.flat())].sort((e, t) => e - t), s = new D(e), c = new Map(o.map((t) => [t, s.addVertex(e.positions[t * 3], e.positions[t * 3 + 1], e.positions[t * 3 + 2])]));
	for (let e of a) s.addFace(e.map((e) => c.get(e)));
	return {
		mesh: s.build(),
		coarseFaces: a.length,
		removedVertices: e.vertexCount - o.length
	};
}
// src/mesh-reshape.js
var Kr = Object.freeze({
	x: 0,
	y: 1,
	z: 2
});
function qr(e, t) {
	return [
		e.positions[t * 3],
		e.positions[t * 3 + 1],
		e.positions[t * 3 + 2]
	];
}
function B(e, t) {
	let n = [];
	for (let r = e.faceOffsets[t]; r < e.faceOffsets[t + 1]; r++) n.push(e.cornerVertices[r]);
	return n;
}
function Jr(e, t) {
	let n = [
		0,
		0,
		0
	], r = B(e, t);
	for (let t of r) for (let i = 0; i < 3; i++) n[i] += e.positions[t * 3 + i] / r.length;
	return n;
}
function Yr(e, t, { offset: n = 0, relative: r = !1, name: i = "poke" } = {}) {
	let { normals: a } = m(e), o = [], s = L(e), c = [], l = 0;
	if (s.forEach((s, u) => {
		if (!t[u]) {
			c.push(s);
			return;
		}
		let d = Jr(e, u), f = s.vertices, p = n;
		r && (p = n * (f.reduce((t, n) => t + Math.hypot(...qr(e, n).map((e, t) => e - d[t])), 0) / f.length)), o.push(d.map((e, t) => e + a[u * 3 + t] * p));
		let m = e.vertexCount + o.length - 1;
		for (let e = 0; e < f.length; e++) {
			let t = (e + 1) % f.length;
			c.push({
				vertices: [
					f[e],
					f[t],
					m
				],
				sourceFace: u,
				sourceCorners: [
					s.sourceCorners[e],
					s.sourceCorners[t],
					{
						from: s.sourceCorners[e],
						to: s.sourceCorners[t],
						t: .5
					}
				],
				sourceEdges: [
					s.sourceEdges[e],
					-1,
					-1
				],
				tags: [`${i}.poke`]
			});
		}
		l++;
	}), l === 0) throw RangeError("The selection holds no face to poke.");
	return {
		mesh: R(e, c, o),
		pokedFaces: l
	};
}
function Xr(e, { name: t = "dual" } = {}) {
	let n = (t, n) => t * e.vertexCount + n, r = /* @__PURE__ */ new Map(), i = Array.from({ length: e.vertexCount }, () => []);
	for (let t = 0; t < e.faceCount; t++) {
		let a = B(e, t);
		a.forEach((e, o) => {
			let s = a[(o + 1) % a.length], c = n(e, s);
			if (r.has(c)) throw RangeError(`Faces ${r.get(c)} and ${t} both run from vertex ${e} to vertex ${s}; dual needs consistent winding. Run flip_normals on the faces that point the wrong way.`);
			r.set(c, t), i[e].push({
				face: t,
				previous: a[(o + a.length - 1) % a.length]
			});
		});
	}
	let a = new D(e), o = Array.from({ length: e.faceCount }, (t, n) => a.addVertex(...Jr(e, n)));
	for (let s = 0; s < e.vertexCount; s++) {
		let e = i[s];
		if (e.length === 0) continue;
		let c = new Map(e.map(({ face: e, previous: t }) => [e, t])), l = [], u = e[0].face;
		do {
			l.push(u);
			let e = r.get(n(s, c.get(u)));
			if (e === void 0) throw RangeError(`Vertex ${s} lies on an open boundary; dual needs a closed mesh. Run fill_holes first.`);
			u = e;
		} while (u !== e[0].face && l.length <= e.length);
		if (l.length !== e.length) throw RangeError(`The faces around vertex ${s} do not form one ring (a pinched or non-manifold vertex); dual needs a manifold mesh. Run merge_by_distance or split the mesh.`);
		a.addFace(l.map((e) => o[e]), { tags: [`${t}.dual`] });
	}
	return {
		mesh: a.build(),
		dualFaces: a.faceSources.length,
		dualVertices: e.faceCount
	};
}
function Zr(e, t, n) {
	let r = t.map((t, n) => t - e[n]), i = n.map((t, n) => t - e[n]), a = r[0] * i[0] + r[1] * i[1] + r[2] * i[2], o = [
		r[1] * i[2] - r[2] * i[1],
		r[2] * i[0] - r[0] * i[2],
		r[0] * i[1] - r[1] * i[0]
	];
	return Math.atan2(Math.hypot(...o), a) * 180 / Math.PI;
}
function Qr(e, t, n, r, i, a) {
	let o = e.edgeVertices[t * 2], s = e.edgeVertices[t * 2 + 1], c = B(e, n), l = B(e, r), u = c.findIndex((e) => e !== o && e !== s), d = c[u], f = c[(u + 1) % 3], p = c[(u + 2) % 3], m = [
		d,
		f,
		l.find((e) => e !== f && e !== p),
		p
	], h = i[n * 3] * i[r * 3] + i[n * 3 + 1] * i[r * 3 + 1] + i[n * 3 + 2] * i[r * 3 + 2];
	if (Math.acos(Math.max(-1, Math.min(1, h))) * 180 / Math.PI > a) return null;
	let g = m.map((t) => qr(e, t)), _ = 0;
	for (let e = 0; e < 4; e++) {
		let t = Zr(g[e], g[(e + 3) % 4], g[(e + 1) % 4]);
		if (t >= 179) return null;
		_ += Math.abs(t - 90);
	}
	let v = i[n * 3] + i[r * 3], y = i[n * 3 + 1] + i[r * 3 + 1], b = i[n * 3 + 2] + i[r * 3 + 2];
	for (let e = 0; e < 4; e++) {
		let t = g[(e + 3) % 4], n = g[e], r = g[(e + 1) % 4], i = n.map((e, n) => e - t[n]), a = r.map((e, t) => e - n[t]);
		if ((i[1] * a[2] - i[2] * a[1]) * v + (i[2] * a[0] - i[0] * a[2]) * y + (i[0] * a[1] - i[1] * a[0]) * b <= 0) return null;
	}
	return {
		edge: t,
		faceA: n,
		faceB: r,
		cost: _
	};
}
function $r(e, t, { angle: n = 40, name: r = "tris" } = {}) {
	let { normals: i } = m(e), a = b(e), o = [];
	for (let r = 0; r < e.edgeCount; r++) {
		let s = a.faces[r];
		if (s.length !== 2) continue;
		let [c, l] = s;
		if (!t[c] || !t[l] || e.faceOffsets[c + 1] - e.faceOffsets[c] !== 3 || e.faceOffsets[l + 1] - e.faceOffsets[l] !== 3) continue;
		let u = Qr(e, r, c, l, i, n);
		u && o.push(u);
	}
	o.sort((e, t) => e.cost - t.cost || e.edge - t.edge);
	let s = new Uint8Array(e.faceCount), c = new Uint8Array(e.edgeCount), l = 0;
	for (let { edge: e, faceA: t, faceB: n } of o) s[t] || s[n] || (s[t] = 1, s[n] = 1, c[e] = 1, l++);
	if (l === 0) throw RangeError(`No two adjacent selected triangles join into a convex quad within ${n} degrees. Select triangles (triangulate first), or raise angle.`);
	return {
		mesh: sn(e, c, { name: r }).mesh,
		joinedPairs: l
	};
}
function ei(e, t) {
	let n = {
		...e.attributes,
		face: { ...e.attributes.face }
	};
	for (let e of t) delete n.face[me + e];
	return w({
		positions: e.positions,
		faceOffsets: e.faceOffsets,
		cornerVertices: e.cornerVertices,
		edgeVertices: e.edgeVertices,
		cornerEdges: e.cornerEdges,
		attributes: n
	});
}
function ti(e, { axis: t = "x", keep: n = "positive", distance: r = 1e-4, name: i = "symmetrize" } = {}) {
	let a = Kr[t], o = n === "positive" ? 1 : -1, s = (e, t) => {
		let n = e.positions[t * 3 + a] * o;
		return n > r ? 1 : n < -r ? -1 : 0;
	}, c = !1;
	for (let t = 0; t < e.faceCount && !c; t++) {
		let n = B(e, t).map((t) => s(e, t));
		c = n.includes(1) && n.includes(-1);
	}
	let l = e;
	if (c) {
		let t = [
			0,
			0,
			0
		];
		t[a] = 1;
		let n = `${i}.cut`;
		l = ei(An(e, {
			point: [
				0,
				0,
				0
			],
			normal: t,
			distance: r,
			name: n
		}).mesh, [`${n}.inner`, `${n}.outer`]);
	}
	let u = L(l).filter((e) => e.vertices.every((e) => s(l, e) >= 0));
	if (!u.some((e) => e.vertices.some((e) => s(l, e) === 1))) throw RangeError(`No face lies on the ${n} side of the ${t} axis, so there is nothing to mirror. Use keep "${n === "positive" ? "negative" : "positive"}" or another axis.`);
	let d = l.faceCount - u.length, f = R(l, u);
	return {
		mesh: ce(f, {
			axis: t,
			merge: r,
			name: i
		}),
		removedFaces: d
	};
}
function ni(e, t, { scale: n }) {
	let r = new a(e.vertexCount), i = new Uint8Array(e.vertexCount), o = 0;
	for (let n = 0; n < e.faceCount; n++) {
		if (!t[n]) continue;
		o++;
		let a = B(e, n);
		for (let e of a) i[e] = 1, r.union(a[0], e);
	}
	if (o === 0) throw RangeError("The selection holds no face to scale.");
	let s = /* @__PURE__ */ new Map();
	for (let t = 0; t < e.vertexCount; t++) {
		if (!i[t]) continue;
		let n = r.find(t);
		s.has(n) || s.set(n, {
			total: [
				0,
				0,
				0
			],
			count: 0
		});
		let a = s.get(n);
		for (let n = 0; n < 3; n++) a.total[n] += e.positions[t * 3 + n];
		a.count++;
	}
	let c = Float32Array.from(e.positions), l = 0;
	for (let t = 0; t < e.vertexCount; t++) {
		if (!i[t]) continue;
		let a = s.get(r.find(t));
		for (let r = 0; r < 3; r++) {
			let i = a.total[r] / a.count;
			c[t * 3 + r] = i + (e.positions[t * 3 + r] - i) * n;
		}
		l++;
	}
	return {
		mesh: w({
			positions: c,
			faceOffsets: e.faceOffsets,
			cornerVertices: e.cornerVertices,
			edgeVertices: e.edgeVertices,
			cornerEdges: e.cornerEdges,
			attributes: e.attributes
		}),
		movedVertices: l,
		islands: s.size
	};
}
function ri(e, t, { offset: n, name: r = "extrude" }) {
	let i = b(e), a = L(e), o = [], s = /* @__PURE__ */ new Map(), c = (t) => (s.has(t) || (o.push(qr(e, t).map((e, t) => e + n[t])), s.set(t, e.vertexCount + o.length - 1)), s.get(t)), l = 0;
	for (let n = 0; n < e.edgeCount; n++) {
		if (!t[n]) continue;
		let o = i.faces[n][0], s = -1, u = -1;
		for (let t = e.faceOffsets[o]; t < e.faceOffsets[o + 1]; t++) e.cornerEdges[t] === n && (s = e.cornerVertices[t], u = e.cornerVertices[t + 1 === e.faceOffsets[o + 1] ? e.faceOffsets[o] : t + 1]);
		a.push({
			vertices: [
				u,
				s,
				c(s),
				c(u)
			],
			sourceFace: -1,
			sourceCorners: null,
			sourceEdges: null,
			tags: [`${r}.side`]
		}), l++;
	}
	if (l === 0) throw RangeError("The rule selects no edge. For a surface boundary use { \"open\": true }.");
	return {
		mesh: R(e, a, o),
		extrudedEdges: l
	};
}
// src/mesh-reshape-edits.js
var ii = Object.freeze([
	"poke",
	"dual",
	"tris_to_quads",
	"symmetrize",
	"scale_elements",
	"extrude_edges",
	"split_edges",
	"delete_loose",
	"flatten",
	"unsubdivide",
	"circularize"
]), ai = Object.freeze(["positive", "negative"]), oi = 1e3, si = "a vertex rule such as { \"all\": true }, { \"vertices\": [0, 1] }, { \"valence\": 4 } or { \"inside\": { \"min\": [x, y, z], \"max\": [x, y, z] } }";
function ci(e, t, n, { finiteNumber: r, vector: i }) {
	switch (e.op) {
		case "poke":
			if (t.offset = e.offset === void 0 ? 0 : r(e.offset, n, "offset"), e.relative !== void 0 && typeof e.relative != "boolean") throw N(n, "relative", e.relative, "true or false");
			t.relative = e.relative ?? !1;
			break;
		case "tris_to_quads":
			t.angle = e.angle === void 0 ? 40 : r(e.angle, n, "angle", {
				minimum: 0,
				maximum: 180
			});
			break;
		case "symmetrize":
			if (e.axis !== void 0 && ![
				"x",
				"y",
				"z"
			].includes(e.axis)) throw N(n, "axis", e.axis, "one of \"x\", \"y\", \"z\"");
			if (t.axis = e.axis ?? "x", e.keep !== void 0 && !ai.includes(e.keep)) throw N(n, "keep", e.keep, `one of ${ai.map((e) => `"${e}"`).join(", ")}`);
			t.keep = e.keep ?? "positive", t.distance = e.distance === void 0 ? 1e-4 : r(e.distance, n, "distance", {
				minimum: 0,
				maximum: 1
			});
			break;
		case "scale_elements":
			t.scale = r(e.scale, n, "scale", {
				minimum: 0,
				maximum: oi,
				exclusiveMinimum: !0
			});
			break;
		case "split_edges":
			t.edges = I(e.edges, n, "edges", _r);
			break;
		case "flatten":
			if (t.verts = I(e.verts, n, "verts", si), e.normal !== void 0 && (t.normal = i(e.normal, n, "normal"), t.normal.every((e) => e === 0))) throw N(n, "normal", e.normal, "a direction that is not all zeros, such as [0, 1, 0]");
			t.factor = e.factor === void 0 ? 1 : r(e.factor, n, "factor", {
				minimum: 0,
				maximum: 1
			});
			break;
		case "circularize":
			if (t.verts = I(e.verts, n, "verts", si), t.factor = e.factor === void 0 ? 1 : r(e.factor, n, "factor", {
				minimum: 0,
				maximum: 1
			}), e.regular !== void 0 && typeof e.regular != "boolean") throw N(n, "regular", e.regular, "true or false");
			t.regular = e.regular ?? !0;
			break;
		case "extrude_edges": t.edges = I(e.edges, n, "edges", _r), t.offset = i(e.offset, n, "offset");
	}
}
function li(e, t, n, i) {
	if (t.op === "poke") {
		let a = O(e, t.select), o = 0;
		for (let t = 0; t < e.faceCount; t++) a[t] && (o += e.faceOffsets[t + 1] - e.faceOffsets[t]);
		let s = e.faceCount - r(a) + o;
		if (s > n.maxFaces) throw N(i, "select", t.select, `a rule that keeps the mesh within ${n.maxFaces} faces (this edit would make ${s}), such as { "tag": "top" }`, RangeError);
	}
	if (t.op === "split_edges") {
		let a = r(E(e, t.edges, b(e)));
		if (e.vertexCount + a * 2 > n.maxVertices) throw N(i, "edges", t.edges, `a rule that keeps the mesh within ${n.maxVertices} vertices (this edit would add up to ${a * 2}), such as { "angle": 30 }`, RangeError);
	}
	if (t.op === "extrude_edges") {
		let a = r(E(e, t.edges, b(e)));
		if (e.faceCount + a > n.maxFaces || e.vertexCount + a * 2 > n.maxVertices) throw N(i, "edges", t.edges, `a rule that keeps the mesh within ${n.maxVertices} vertices and ${n.maxFaces} faces (this edit would add up to ${a * 2} vertices and ${a} faces), such as { "open": true }`, RangeError);
	}
}
function ui(e, t) {
	let n = O(e, t);
	if (r(n) === 0) throw k("select", t, "a rule that matches at least one face, such as { \"all\": true } (check tags and counts with mesh_inspect)");
	return n;
}
function di(e, t) {
	switch (t.op) {
		case "poke": {
			let n = Yr(e, ui(e, t.select), {
				offset: t.offset,
				relative: t.relative,
				name: t.name
			});
			return {
				mesh: n.mesh,
				result: { pokedFaces: n.pokedFaces }
			};
		}
		case "dual": {
			let n = Xr(e, { name: t.name });
			return {
				mesh: n.mesh,
				result: {
					dualVertices: n.dualVertices,
					dualFaces: n.dualFaces
				}
			};
		}
		case "tris_to_quads": {
			let n = $r(e, ui(e, t.select), {
				angle: t.angle,
				name: t.name
			});
			return {
				mesh: n.mesh,
				result: { joinedPairs: n.joinedPairs }
			};
		}
		case "symmetrize": {
			let n = ti(e, {
				axis: t.axis,
				keep: t.keep,
				distance: t.distance,
				name: t.name
			});
			return {
				mesh: n.mesh,
				result: { removedFaces: n.removedFaces }
			};
		}
		case "scale_elements": {
			let n = ni(e, ui(e, t.select), { scale: t.scale });
			return {
				mesh: n.mesh,
				result: {
					movedVertices: n.movedVertices,
					islands: n.islands
				}
			};
		}
		case "extrude_edges": {
			let n = ri(e, E(e, t.edges, b(e)), {
				offset: t.offset,
				name: t.name
			});
			return {
				mesh: n.mesh,
				result: { extrudedEdges: n.extrudedEdges }
			};
		}
		case "split_edges": {
			let n = Tr(e, E(e, t.edges, b(e)));
			return {
				mesh: n.mesh,
				result: {
					splitEdges: n.splitEdges,
					addedVertices: n.addedVertices
				}
			};
		}
		case "delete_loose": {
			let t = Er(e);
			return {
				mesh: t.mesh,
				result: { removedVertices: t.removedVertices }
			};
		}
		case "flatten": {
			let n = Or(e, pn(e, t.verts), {
				normal: t.normal,
				factor: t.factor
			});
			return {
				mesh: n.mesh,
				result: { flattenedVertices: n.flattenedVertices }
			};
		}
		case "unsubdivide": {
			let t = Gr(e);
			return {
				mesh: t.mesh,
				result: {
					coarseFaces: t.coarseFaces,
					removedVertices: t.removedVertices
				}
			};
		}
		case "circularize": {
			let n = Mr(e, pn(e, t.verts), {
				factor: t.factor,
				regular: t.regular
			});
			return {
				mesh: n.mesh,
				result: { circularizedVertices: n.circularizedVertices }
			};
		}
	}
	throw TypeError(`Not a reshaping edit: ${t.op}`);
}
// src/mesh-uv-project.js
var fi = Object.freeze([
	"cube",
	"cylinder",
	"sphere"
]), pi = Object.freeze({
	x: 0,
	y: 1,
	z: 2
}), mi = Math.PI * 2, hi = 1e-6, gi = Math.SQRT1_2;
function _i(t, n) {
	let r = {};
	for (let n of e) r[n] = { ...t.attributes[n] };
	return r.corner.uv = {
		data: n,
		size: 2
	}, w({
		positions: t.positions,
		faceOffsets: t.faceOffsets,
		cornerVertices: t.cornerVertices,
		edgeVertices: t.edgeVertices,
		cornerEdges: t.cornerEdges,
		attributes: r
	});
}
function vi(e) {
	let t = [
		Infinity,
		Infinity,
		Infinity
	], n = [
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let r = 0; r < e.vertexCount; r++) for (let i = 0; i < 3; i++) {
		let a = e.positions[r * 3 + i];
		t[i] = Math.min(t[i], a), n[i] = Math.max(n[i], a);
	}
	return t.map((e, t) => (e + n[t]) / 2);
}
function yi(e, t, n) {
	let r = e.cornerVertices[t];
	return [
		0,
		1,
		2
	].map((t) => e.positions[r * 3 + t] - n[t]);
}
function bi(e, t, n) {
	let r = (t + 1) % 3, i = (t + 2) % 3;
	return [n ? -e[r] : e[r], e[i]];
}
function xi(e, t) {
	let n = 0;
	for (let r = 1; r < 3; r++) Math.abs(e[t * 3 + r]) > Math.abs(e[t * 3 + n]) && (n = r);
	return n;
}
function Si(e, t, n, r) {
	let i = (n + 1) % 3, a = (n + 2) % 3, o = [];
	for (let n = e.faceOffsets[t]; n < e.faceOffsets[t + 1]; n++) {
		let t = yi(e, n, r), s = Math.hypot(t[i], t[a]) < 1e-9;
		o.push(s ? null : Math.atan2(t[a], t[i]));
	}
	let s = o.find((e) => e !== null) ?? 0;
	return o.map((e) => {
		if (e === null) return s;
		let t = e;
		for (; t - s > Math.PI;) t -= mi;
		for (; t - s < -Math.PI;) t += mi;
		return t;
	});
}
function Ci(e, t, n) {
	let r = 0;
	for (let i = 0; i < e.vertexCount; i++) {
		let a = [
			0,
			1,
			2
		].map((n) => e.positions[i * 3 + n] - t[n]);
		r += n(a);
	}
	let i = e.vertexCount ? r / e.vertexCount : 0;
	return i > 1e-9 ? i : 1;
}
function wi(e, t, n) {
	let r = vi(e), { normals: i } = m(e), a = new Float32Array(e.cornerCount * 2), o = (n + 1) % 3, s = (n + 2) % 3, c = t === "cylinder" ? Ci(e, r, (e) => Math.hypot(e[o], e[s])) : Ci(e, r, (e) => Math.hypot(e[0], e[1], e[2]));
	for (let o = 0; o < e.faceCount; o++) {
		let s = e.faceOffsets[o], l = e.faceOffsets[o + 1], u = t === "cylinder" && Math.abs(i[o * 3 + n]) > gi, d = t === "cube" || u ? null : Si(e, o, n, r), f = t === "cube" ? xi(i, o) : n;
		for (let u = s; u < l; u++) {
			let l = yi(e, u, r), p, m;
			d ? t === "cylinder" ? (p = d[u - s] * c, m = l[n]) : (p = d[u - s] * c, m = Math.asin(Math.max(-1, Math.min(1, l[n] / Math.max(Math.hypot(l[0], l[1], l[2]), 1e-12)))) * c) : [p, m] = bi(l, f, i[o * 3 + f] < 0), a[u * 2] = p, a[u * 2 + 1] = m;
		}
	}
	return a;
}
function Ti(e, t) {
	let n = s(e), { nextCorner: r } = c(e), i = new Uint32Array(e.cornerCount);
	for (let t = 0; t < e.faceCount; t++) for (let n = e.faceOffsets[t]; n < e.faceOffsets[t + 1]; n++) i[n] = t;
	let o = (e, n) => Math.abs(t[e * 2] - t[n * 2]) <= hi && Math.abs(t[e * 2 + 1] - t[n * 2 + 1]) <= hi, l = new a(e.faceCount);
	for (let t = 0; t < e.edgeCount; t++) {
		if (n.edgeOffsets[t + 1] - n.edgeOffsets[t] !== 2) continue;
		let e = n.edgeCorners[n.edgeOffsets[t]], a = n.edgeCorners[n.edgeOffsets[t] + 1];
		o(e, r[a]) && o(r[e], a) && l.union(i[e], i[a]);
	}
	let u = /* @__PURE__ */ new Map();
	for (let t = 0; t < e.faceCount; t++) {
		let e = l.find(t);
		u.has(e) || u.set(e, []), u.get(e).push(t);
	}
	return [...u.values()];
}
function Ei(e, { margin: t = .01, rotate: n = !0 } = {}) {
	let r = e.attributes.corner.uv?.data;
	if (!r) throw RangeError("the mesh has no uv to pack. Put uv_unwrap, or uv_project with pack false, before uv_pack.");
	let i = Ti(e, r).map((t) => {
		let n = [];
		for (let r of t) for (let t = e.faceOffsets[r]; t < e.faceOffsets[r + 1]; t++) n.push(t);
		let i = n.map((e) => [r[e * 2], r[e * 2 + 1]]);
		return {
			corners: n,
			points: i,
			box: ge(i),
			offset: [0, 0]
		};
	});
	if (!i.length) return {
		mesh: e,
		islands: 0
	};
	let a = de(i, t, n), o = new Float32Array(e.cornerCount * 2);
	for (let e of i) e.corners.forEach((n, r) => {
		o[n * 2] = t + (e.points[r][0] + e.offset[0]) * a, o[n * 2 + 1] = t + (e.points[r][1] + e.offset[1]) * a;
	});
	return {
		mesh: _i(e, o),
		islands: i.length
	};
}
function Di(e, { mode: t = "cube", axis: n = "y", pack: r = !0, margin: i = .01, rotate: a = !0 } = {}) {
	let o = _i(e, wi(e, t, pi[n]));
	return r ? Ei(o, {
		margin: i,
		rotate: a
	}) : {
		mesh: o,
		islands: Ti(o, o.attributes.corner.uv.data).length
	};
}
// src/mesh-field-edits.js
var Oi = Object.freeze([
	"normal",
	"x",
	"y",
	"z"
]), ki = /* @__PURE__ */ new Map([
	["x", [
		1,
		0,
		0
	]],
	["y", [
		0,
		1,
		0
	]],
	["z", [
		0,
		0,
		1
	]]
]);
function V(e, t) {
	return w({
		positions: t,
		faceOffsets: e.faceOffsets,
		cornerVertices: e.cornerVertices,
		edgeVertices: e.edgeVertices,
		cornerEdges: e.cornerEdges,
		attributes: e.attributes
	});
}
function Ai(e, t) {
	let n = new Uint8Array(e.vertexCount);
	if (!t) return n.fill(1), n;
	let r = O(e, t);
	for (let t = 0; t < e.faceCount; t++) if (r[t]) for (let r = e.faceOffsets[t]; r < e.faceOffsets[t + 1]; r++) n[e.cornerVertices[r]] = 1;
	return n;
}
function ji(e, { select: t, position: n, offset: r }, a) {
	let o = i(e, "point", a), s = n === void 0 ? null : p(n, o, { kind: "vector" }).values, c = r === void 0 ? null : p(r, o, { kind: "vector" }).values, l = Ai(e, t), u = new Float32Array(e.positions), d = 0;
	for (let t = 0; t < e.vertexCount; t++) if (l[t]) {
		d++;
		for (let n = 0; n < 3; n++) {
			let r = s ? s[t * 3 + n] : e.positions[t * 3 + n];
			u[t * 3 + n] = r + (c ? c[t * 3 + n] : 0);
		}
	}
	return {
		mesh: V(e, u),
		movedVertices: d
	};
}
function Mi(e, { select: t, field: n, strength: r = 1, midlevel: a = .5, direction: o = "normal", group: s }, c) {
	let l = i(e, "point", c), { values: u } = p(n, l, { kind: "scalar" }), d = o === "normal" ? g(e) : null, f = ki.get(o), m = Ai(e, t), h = s === void 0 ? null : te(e, s), _ = new Float32Array(e.positions), v = 0;
	for (let t = 0; t < e.vertexCount; t++) {
		if (!m[t]) continue;
		let e = h ? h[t] : 1;
		if (e === 0) continue;
		v++;
		let n = (u[t] - a) * r * e;
		for (let e = 0; e < 3; e++) {
			let r = d ? d[t * 3 + e] : f[e];
			_[t * 3 + e] += n * r;
		}
	}
	return {
		mesh: V(e, _),
		movedVertices: v
	};
}
// src/mesh-surface-distance.js
function H(e) {
	let { triangleCorners: t } = n(e, m(e).normals), r = new Uint32Array(t.length);
	for (let n = 0; n < r.length; n++) r[n] = e.cornerVertices[t[n]];
	return {
		positions: e.positions,
		indices: r
	};
}
function Ni(e, { signed: t = !1 } = {}) {
	let { positions: n, indices: r } = H(e), i = Oe(n, r), a = t ? g(e) : null, o = /* @__PURE__ */ new Float64Array(9), s = [
		0,
		0,
		0
	], c = [
		0,
		0,
		0
	];
	function l(e, t) {
		if (ke(n, r, t, o), Ae(e, o, s), !je(s, o, c)) return 1;
		let i = 0;
		for (let n = 0; n < 3; n++) {
			let o = 0;
			for (let e = 0; e < 3; e++) o += c[e] * a[r[t * 3 + e] * 3 + n];
			i += o * (e[n] - s[n]);
		}
		return i < 0 ? -1 : 1;
	}
	function u(e) {
		let a = Infinity, c = -1;
		return Ee(i, (t, n) => De(e, t, n), (e) => e <= a, (t) => {
			ke(n, r, t, o), Ae(e, o, s);
			let i = Math.hypot(s[0] - e[0], s[1] - e[1], s[2] - e[2]);
			return i < a && (a = i, c = t), !1;
		}), {
			distance: t && c >= 0 ? a * l(e, c) : a,
			triangle: c
		};
	}
	return {
		query: u,
		triangleCount: r.length / 3
	};
}
function Pi(e, t) {
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
function Fi(e, t) {
	let n = Pi(e, Ni(t)), r = Pi(t, Ni(e));
	return {
		toReference: n,
		fromReference: r,
		hausdorff: Math.max(n, r)
	};
}
function Ii(e) {
	let { positions: t, indices: n } = H(e), r = 0;
	for (let e = 0; e < n.length / 3; e++) {
		let [i, a, o] = [
			0,
			1,
			2
		].map((t) => n[e * 3 + t] * 3);
		r += (t[i] * (t[a + 1] * t[o + 2] - t[a + 2] * t[o + 1]) + t[i + 1] * (t[a + 2] * t[o] - t[a] * t[o + 2]) + t[i + 2] * (t[a] * t[o + 1] - t[a + 1] * t[o])) / 6;
	}
	return r;
}
// src/mesh-masks.js
var Li = Object.freeze([
	"curvature",
	"edge",
	"occlusion"
]), U = Object.freeze({
	gain: Object.freeze([.1, 16]),
	angle: Object.freeze([1, 179]),
	rays: Object.freeze([1, 128]),
	seed: Object.freeze([0, 2147483647]),
	maxRayCasts: 2e6,
	maxTriangleTests: 2e7
}), Ri = Object.freeze({
	gain: 2,
	angle: 30,
	rays: 32,
	seed: 0
}), zi = 1e-4, Bi = .6180339887498949, Vi = .25;
function Hi(e) {
	return Math.min(1, Math.max(0, e));
}
function Ui(e, t) {
	let n = g(e), r = new Float64Array(e.vertexCount), i = new Float64Array(e.vertexCount), a = e.positions;
	for (let t = 0; t < e.edgeCount; t++) {
		let o = e.edgeVertices[t * 2], s = e.edgeVertices[t * 2 + 1], c = a[s * 3] - a[o * 3], l = a[s * 3 + 1] - a[o * 3 + 1], u = a[s * 3 + 2] - a[o * 3 + 2], d = Math.hypot(c, l, u);
		d !== 0 && (r[o] += c * n[o * 3] + l * n[o * 3 + 1] + u * n[o * 3 + 2], r[s] -= c * n[s * 3] + l * n[s * 3 + 1] + u * n[s * 3 + 2], i[o] += d, i[s] += d);
	}
	let o = new Float32Array(e.vertexCount);
	for (let n = 0; n < e.vertexCount; n++) {
		let e = i[n] > 0 ? -r[n] / i[n] : 0;
		o[n] = Hi(.5 + t * e);
	}
	return o;
}
function Wi(e, t) {
	let { normals: n } = m(e), r = o(e), i = fe(e), { edgeOffsets: a, edgeCorners: c } = s(e), l = t * Math.PI / 180, u = new Float32Array(e.vertexCount);
	for (let t = 0; t < e.edgeCount; t++) {
		if (a[t + 1] - a[t] !== 2) continue;
		let o = i[c[a[t]]], s = i[c[a[t] + 1]];
		if (n[o * 3] * (r[s * 3] - r[o * 3]) + n[o * 3 + 1] * (r[s * 3 + 1] - r[o * 3 + 1]) + n[o * 3 + 2] * (r[s * 3 + 2] - r[o * 3 + 2]) >= 0) continue;
		let d = n[o * 3] * n[s * 3] + n[o * 3 + 1] * n[s * 3 + 1] + n[o * 3 + 2] * n[s * 3 + 2], f = Hi(Math.acos(Math.max(-1, Math.min(1, d))) / l);
		for (let n of [e.edgeVertices[t * 2], e.edgeVertices[t * 2 + 1]]) u[n] = Math.max(u[n], f);
	}
	return u;
}
function Gi(e, t, n, r, i) {
	let a = Math.abs(e) > .9, o = +!a, s = +!!a, c = o * e + s * t;
	o -= c * e, s -= c * t;
	let l = -c * n, u = Math.hypot(o, s, l);
	o /= u, s /= u;
	let d = l / u, f = t * d - n * s, p = n * o - e * d, m = e * s - t * o, h = Math.sqrt(r), g = 2 * Math.PI * i, _ = h * Math.cos(g), v = h * Math.sin(g), y = Math.sqrt(Math.max(0, 1 - r));
	return [
		o * _ + f * v + e * y,
		s * _ + p * v + t * y,
		d * _ + m * v + n * y
	];
}
function Ki(e, n, { rays: r, distance: i, seed: a }) {
	let o = g(e), s = he(e), c = Math.hypot(s.max[0] - s.min[0], s.max[1] - s.min[1], s.max[2] - s.min[2]), l = i ?? c * Vi, u = H(e), d = Se({
		positions: new Float32Array(u.positions),
		indices: u.indices
	}), f = new Float32Array(e.vertexCount), p = 0;
	try {
		for (let i = 0; i < e.vertexCount; i++) {
			if (!n[i]) continue;
			let s = o[i * 3], u = o[i * 3 + 1], m = o[i * 3 + 2];
			if (s === 0 && u === 0 && m === 0) continue;
			let h = [
				e.positions[i * 3] + s * c * zi,
				e.positions[i * 3 + 1] + u * c * zi,
				e.positions[i * 3 + 2] + m * c * zi
			], g = t(i, 0, a), _ = 0;
			for (let e = 0; e < r; e++) {
				let t = Gi(s, u, m, (e + .5) / r, (g + e * Bi) % 1), n = d.project({
					origin: h,
					direction: t,
					maxDistance: l,
					maxTriangleTests: U.maxTriangleTests - p
				});
				p += n.triangleTests, n.hit && _++;
			}
			f[i] = _ / r;
		}
	} finally {
		d.dispose();
	}
	return f;
}
function qi(e, t) {
	if (e * t > U.maxRayCasts) throw RangeError(`Occlusion would cast ${e * t} rays; the limit is ${U.maxRayCasts}. Pass fewer rays, or a select that holds fewer vertices.`);
}
function Ji(e, t, n, r) {
	if (t === "curvature") return Ui(e, n.gain ?? Ri.gain);
	if (t === "edge") return Wi(e, n.angle ?? Ri.angle);
	if (t === "occlusion") return Ki(e, r, {
		rays: n.rays ?? Ri.rays,
		distance: n.distance,
		seed: n.seed ?? Ri.seed
	});
	throw RangeError(`Unknown measure ${t}. Use one of ${Li.join(", ")}.`);
}
// src/mesh-attribute-edits.js
var Yi = Object.freeze([
	"x",
	"y",
	"z"
]), Xi = "color", Zi = Object.freeze({
	x: 0,
	y: 1,
	z: 2
});
function Qi(e, t, n, r) {
	return r(e, t, n, {
		minimum: 0,
		maximum: 1
	});
}
function $i(e, t, n, r) {
	for (let t of Object.keys(e)) if (!["group", "colors"].includes(t)) throw N(n, `gradient.${t}`, e[t], `one of the group gradient fields group, colors; remove "${t}"`);
	if (typeof e.group != "string" || e.group === "") throw N(n, "gradient.group", e.group, "the name of a vertex group, such as \"wear\"");
	if (!Array.isArray(e.colors) || e.colors.length < 2 || e.colors.length > 3) throw N(n, "gradient.colors", e.colors, "two colors (weight 0 then 1) or three (weight 0, 0.5 then 1), such as [[0.1, 0.1, 0.1], [0.8, 0.1, 0.1], [0.8, 0.8, 0.8]]");
	t.gradient = {
		group: e.group,
		colors: e.colors.map((e, t) => r(e, `gradient.colors[${t}]`))
	};
}
function ea(e, t, n, { finiteNumber: r, valuesKey: i, readValue: a }) {
	let o = i === "weights" ? "[0, 1]" : "[[1, 0, 0], [0, 0, 1]]";
	if (!e || typeof e != "object" || Array.isArray(e)) throw N(n, "gradient", e, `an object such as { "axis": "z", "range": [0, 1], "${i}": ${o} }`);
	if (e.group !== void 0 && i === "colors") return $i(e, t, n, a);
	for (let t of Object.keys(e)) if (![
		"axis",
		"range",
		i
	].includes(t)) throw N(n, `gradient.${t}`, e[t], `one of the gradient fields axis, range, ${i}; remove "${t}"`);
	if (!Yi.includes(e.axis)) throw N(n, "gradient.axis", e.axis, `one of ${Yi.join(", ")}`);
	if (!Array.isArray(e.range) || e.range.length !== 2) throw N(n, "gradient.range", e.range, "an array of two numbers, low then high, such as [0, 1]");
	let s = e.range.map((e) => r(e, n, "gradient.range"));
	if (!(s[0] < s[1])) throw N(n, "gradient.range", s, "two numbers with low below high, such as [0, 1]");
	if (!Array.isArray(e[i]) || e[i].length !== 2) throw N(n, `gradient.${i}`, e[i], `an array of two entries, the value at the low end then at the high end, such as ${o}`);
	t.gradient = {
		axis: e.axis,
		range: s,
		[i]: e[i].map((e, t) => a(e, `gradient.${i}[${t}]`))
	};
}
function ta(e, t, n) {
	let r = n.filter((t) => e[t] !== void 0);
	if (r.length > 1) throw N(t, r[1], e[r[1]], `left out, because only one of ${n.join(", ")} is allowed, such as keeping ${r[0]}`);
	return r[0];
}
var na = Object.freeze({
	curvature: ["gain"],
	edge: ["angle"],
	occlusion: [
		"rays",
		"distance",
		"seed"
	]
});
function ra(e, t, n, r) {
	if (!Li.includes(e.measure)) throw N(n, "measure", e.measure, `one of ${Li.join(", ")}`);
	t.measure = e.measure;
	let i = na[e.measure];
	for (let a of Object.keys(U).filter((e) => Array.isArray(U[e])).concat("distance")) if (e[a] !== void 0) {
		if (!i.includes(a)) throw N(n, a, e[a], `left out, because measure "${e.measure}" takes ${i.join(", ")}`);
		if (a === "distance") t.distance = r(e.distance, n, "distance", {
			minimum: 0,
			exclusiveMinimum: !0
		});
		else if (a === "rays" || a === "seed") {
			let [r, i] = U[a];
			if (!Number.isInteger(e[a]) || e[a] < r || e[a] > i) throw N(n, a, e[a], `a whole number from ${r} to ${i}`);
			t[a] = e[a];
		} else {
			let [i, o] = U[a];
			t[a] = r(e[a], n, a, {
				minimum: i,
				maximum: o
			});
		}
	}
}
function ia(e, t, n, { finiteNumber: r, checkedField: i }) {
	let a = ta(e, n, [
		"weight",
		"field",
		"gradient",
		"measure"
	]);
	a === "measure" ? ra(e, t, n, r) : a === "field" ? t.field = i(e.field, n, "field", "scalar") : a === "gradient" ? ea(e.gradient, t, n, {
		finiteNumber: r,
		valuesKey: "weights",
		readValue: (e, t) => Qi(e, n, t, r)
	}) : t.weight = e.weight === void 0 ? 1 : Qi(e.weight, n, "weight", r);
}
function aa(e, t, n, { finiteNumber: r, checkedField: i }) {
	let a = (e, t) => {
		if (!Array.isArray(e) || e.length !== 3) throw N(n, t, e, "an array of three numbers from 0 to 1, such as [1, 0.5, 0]");
		return e.map((e) => Qi(e, n, t, r));
	}, o = ta(e, n, [
		"color",
		"field",
		"gradient"
	]);
	o === "field" ? t.field = i(e.field, n, "field", "vector") : o === "gradient" ? ea(e.gradient, t, n, {
		finiteNumber: r,
		valuesKey: "colors",
		readValue: a
	}) : t.color = e.color === void 0 ? [
		1,
		1,
		1
	] : a(e.color, "color");
}
function oa(e, t, n, r) {
	let i = {
		point: { ...e.attributes.point },
		edge: { ...e.attributes.edge },
		face: { ...e.attributes.face },
		corner: { ...e.attributes.corner }
	};
	return i[t][n] = r, w({
		positions: e.positions,
		faceOffsets: e.faceOffsets,
		cornerVertices: e.cornerVertices,
		edgeVertices: e.edgeVertices,
		cornerEdges: e.cornerEdges,
		attributes: i
	});
}
function sa(e, t) {
	let n = Zi[t.axis], [r, i] = t.range, a = new Float64Array(e.vertexCount);
	for (let t = 0; t < e.vertexCount; t++) {
		let o = (e.positions[t * 3 + n] - r) / (i - r);
		a[t] = Math.min(1, Math.max(0, o));
	}
	return a;
}
function ca(e, { group: t, colors: n }) {
	let r = te(e, t), i = n.length - 1;
	return (e, t) => {
		let a = Math.min(1, Math.max(0, r[e])) * i, o = Math.min(i - 1, Math.floor(a));
		return n[o][t] + (n[o + 1][t] - n[o][t]) * (a - o);
	};
}
function la(e, { select: t, name: n, weight: r, field: a, gradient: o, measure: s, ...c }, l) {
	let u = ne + n, d = e.attributes.point[u];
	if (!d && _e(e).length >= 32) throw RangeError("A mesh holds at most 32 vertex groups.");
	let f = d ? Float32Array.from(d.data) : new Float32Array(e.vertexCount), m = Ai(e, t), h = a === void 0 ? null : p(a, i(e, "point", l), { kind: "scalar" }).values, g = o?.axis ? sa(e, o) : null;
	s === "occlusion" && qi(m.reduce((e, t) => e + +!!t, 0), c.rays ?? 32);
	let _ = s ? Ji(e, s, c, m) : null, v = 0;
	for (let t = 0; t < e.vertexCount; t++) {
		if (!m[t]) continue;
		v++;
		let e = r;
		h && (e = h[t]), _ && (e = _[t]), g && (e = o.weights[0] + (o.weights[1] - o.weights[0]) * g[t]), f[t] = Math.min(1, Math.max(0, e));
	}
	return {
		mesh: oa(e, "point", u, {
			data: f,
			size: 1
		}),
		assignedVertices: v
	};
}
function ua(e, { select: t, color: n, field: r, gradient: a }, o) {
	let s = e.attributes.corner[Xi], c = s?.size === 3 ? Float32Array.from(s.data) : new Float32Array(e.cornerCount * 3).fill(1), l = t ? O(e, t) : null, u = r === void 0 ? null : p(r, i(e, "point", o), { kind: "vector" }).values, d = a?.axis ? sa(e, a) : null, f = a?.group === void 0 ? null : ca(e, a), m = 0;
	for (let t = 0; t < e.faceCount; t++) if (!l || l[t]) for (let r = e.faceOffsets[t]; r < e.faceOffsets[t + 1]; r++) {
		let t = e.cornerVertices[r];
		m++;
		for (let e = 0; e < 3; e++) {
			let i = n?.[e];
			u && (i = u[t * 3 + e]), d && (i = a.colors[0][e] + (a.colors[1][e] - a.colors[0][e]) * d[t]), f && (i = f(t, e)), c[r * 3 + e] = Math.min(1, Math.max(0, i));
		}
	}
	return {
		mesh: oa(e, "corner", Xi, {
			data: c,
			size: 3
		}),
		assignedCorners: m
	};
}
function da(e, t) {
	let n = e.vertexCount, r = e.edgeCount, i = e.faceCount, a = e.cornerCount;
	for (let e = 0; e < t; e++) n += r + i, r = 2 * r + a, i = a, a *= 4;
	return {
		vertices: n,
		edges: r,
		faces: i,
		corners: a
	};
}
function fa(e, t, n) {
	let r = new Float64Array(e.edgeCount);
	if (!t) return r;
	let i = E(e, t, b(e));
	if (!i.includes(1)) throw RangeError("The crease rule selects no edges with two faces. Check tags with mesh_inspect, or lower angle.");
	for (let t = 0; t < e.edgeCount; t++) i[t] && (r[t] = n);
	return r;
}
function pa(e, t, n) {
	return e + 1 === n ? t : e + 1;
}
function ma(e) {
	let { positions: t, faceOffsets: n, cornerVertices: r, faceCount: i } = e, a = new Float64Array(i * 3);
	for (let e = 0; e < i; e++) {
		let i = n[e], o = n[e + 1];
		for (let n = i; n < o; n++) {
			let i = r[n] * 3;
			a[e * 3] += t[i], a[e * 3 + 1] += t[i + 1], a[e * 3 + 2] += t[i + 2];
		}
		let s = o - i;
		a[e * 3] /= s, a[e * 3 + 1] /= s, a[e * 3 + 2] /= s;
	}
	return a;
}
function ha(e) {
	let { faceOffsets: t, cornerEdges: n, edgeCount: r, faceCount: i } = e, a = new Int32Array(r).fill(-1), o = new Int32Array(r).fill(-1), s = new Uint32Array(r);
	for (let e = 0; e < i; e++) for (let r = t[e]; r < t[e + 1]; r++) {
		let t = n[r];
		s[t] === 0 && (a[t] = e), s[t] === 1 && (o[t] = e), s[t]++;
	}
	return {
		firstFace: a,
		secondFace: o,
		faceUses: s
	};
}
function ga(e, t) {
	let n = new Float64Array(e.edgeCount);
	for (let r = 0; r < e.edgeCount; r++) n[r] = t.faceUses[r] === 2 ? e.edgeSharpness[r] : Infinity;
	return n;
}
function _a(e, t, n, r) {
	let { positions: i, edgeVertices: a, edgeCount: o } = e, s = new Float64Array(o * 3);
	for (let e = 0; e < o; e++) {
		let o = a[e * 2] * 3, c = a[e * 2 + 1] * 3, l = Math.min(1, r[e]), u = n.firstFace[e] * 3, d = n.secondFace[e] * 3;
		for (let n = 0; n < 3; n++) {
			let r = (i[o + n] + i[c + n]) / 2;
			if (l >= 1) {
				s[e * 3 + n] = r;
				continue;
			}
			let a = (i[o + n] + i[c + n] + t[u + n] + t[d + n]) / 4;
			s[e * 3 + n] = a + (r - a) * l;
		}
	}
	return s;
}
function va(e, t, n) {
	let { positions: r, vertexCount: i, edgeVertices: a, edgeCount: o, faceOffsets: s, cornerVertices: c, faceCount: l } = e, u = new Float64Array(i * 3), d = new Float64Array(i * 3), f = new Float64Array(i * 3), p = new Uint32Array(i), m = new Uint32Array(i), h = new Uint32Array(i), g = new Float64Array(i);
	for (let e = 0; e < l; e++) for (let n = s[e]; n < s[e + 1]; n++) {
		let r = c[n];
		p[r]++;
		for (let n = 0; n < 3; n++) u[r * 3 + n] += t[e * 3 + n];
	}
	for (let e = 0; e < o; e++) {
		let t = n[e] > 0;
		for (let i = 0; i < 2; i++) {
			let o = a[e * 2 + i], s = a[e * 2 + 1 - i];
			m[o]++;
			for (let e = 0; e < 3; e++) d[o * 3 + e] += (r[o * 3 + e] + r[s * 3 + e]) / 2, t && (f[o * 3 + e] += r[s * 3 + e]);
			t && (h[o]++, g[o] += Math.min(1, n[e]));
		}
	}
	return {
		faceSum: u,
		midpointSum: d,
		sharpNeighborSum: f,
		faceTotal: p,
		edgeTotal: m,
		sharpTotal: h,
		sharpnessSum: g
	};
}
function ya(e, t, n) {
	let { positions: r, vertexCount: i } = e, a = va(e, t, n), o = new Float64Array(i * 3);
	for (let e = 0; e < i; e++) {
		let t = a.sharpTotal[e], n = a.edgeTotal[e], i = t >= 3 || t === 2 && a.faceTotal[e] === 1 && n === 2, s = t === 2 && !i, c = t >= 2 ? a.sharpnessSum[e] / t : 0;
		for (let t = 0; t < 3; t++) {
			let l = r[e * 3 + t], u = (a.faceSum[e * 3 + t] / Math.max(a.faceTotal[e], 1) + 2 * (a.midpointSum[e * 3 + t] / Math.max(n, 1)) + (n - 3) * l) / n, d = u;
			i && (d = l), s && (d = (6 * l + a.sharpNeighborSum[e * 3 + t]) / 8), o[e * 3 + t] = u + (d - u) * Math.min(1, c);
		}
	}
	return o;
}
function ba(e, t) {
	let n = {}, { faceOffsets: r, faceCount: i } = e;
	for (let [a, o] of Object.entries(t)) {
		let { data: t, size: s } = o, c = t instanceof Float32Array, l = new t.constructor(e.cornerCount * 4 * s);
		for (let e = 0; e < i; e++) {
			let n = r[e], i = r[e + 1];
			for (let e = 0; e < s; e++) {
				let r = 0;
				for (let a = n; a < i; a++) r += t[a * s + e];
				let a = c ? r / (i - n) : t[n * s + e];
				for (let r = n; r < i; r++) {
					let o = r * 4 * s + e, u = t[r * s + e], d = t[pa(r, n, i) * s + e], f = t[(r === n ? i - 1 : r - 1) * s + e];
					l[o] = u, l[o + s] = c ? (u + d) / 2 : u, l[o + 2 * s] = a, l[o + 3 * s] = c ? (u + f) / 2 : u;
				}
			}
		}
		n[a] = {
			data: l,
			size: s
		};
	}
	return n;
}
function xa(e, t) {
	let n = {};
	for (let [r, i] of Object.entries(t)) {
		let { data: t, size: a } = i, o = new t.constructor(e.cornerCount * a);
		for (let n = 0; n < e.faceCount; n++) for (let r = e.faceOffsets[n]; r < e.faceOffsets[n + 1]; r++) o.set(t.subarray(n * a, (n + 1) * a), r * a);
		n[r] = {
			data: o,
			size: a
		};
	}
	return n;
}
function Sa(e, t, n) {
	let r = new Float64Array(t.edgeCount), i = new Int32Array(t.edgeCount).fill(-1);
	for (let n = 0; n < e.cornerCount; n++) {
		let a = e.cornerEdges[n], o = e.cornerFaceStarts[n], s = n === o ? e.cornerFaceEnds[n] - 1 : n - 1, c = [t.cornerEdges[n * 4], t.cornerEdges[n * 4 + 3]], l = [a, e.cornerEdges[s]];
		c.forEach((t, n) => {
			i[t] = l[n], r[t] = Math.max(0, e.edgeSharpness[l[n]] - 1);
		});
	}
	let a = {};
	for (let [e, r] of Object.entries(n)) {
		let { data: n, size: o } = r, s = new n.constructor(t.edgeCount * o);
		i.forEach((e, t) => {
			e !== -1 && s.set(n.subarray(e * o, (e + 1) * o), t * o);
		}), a[e] = {
			data: s,
			size: o
		};
	}
	return {
		sharpness: r,
		attributes: a
	};
}
function Ca(e) {
	let t = new Uint32Array(e.cornerCount), n = new Uint32Array(e.cornerCount);
	for (let r = 0; r < e.faceCount; r++) for (let i = e.faceOffsets[r]; i < e.faceOffsets[r + 1]; i++) t[i] = e.faceOffsets[r], n[i] = e.faceOffsets[r + 1];
	return {
		cornerFaceStarts: t,
		cornerFaceEnds: n
	};
}
function wa(e, t, n, r) {
	let { vertexCount: i, edgeCount: a, faceCount: o, faceOffsets: s, cornerVertices: c, cornerEdges: l } = e, u = new Float64Array((i + a + o) * 3);
	u.set(r), u.set(n, i * 3), u.set(t, (i + a) * 3);
	let d = new Uint32Array(e.cornerCount * 4);
	for (let e = 0; e < o; e++) {
		let t = s[e], n = s[e + 1];
		for (let r = t; r < n; r++) {
			let o = r === t ? n - 1 : r - 1;
			d[r * 4] = c[r], d[r * 4 + 1] = i + l[r], d[r * 4 + 2] = i + a + e, d[r * 4 + 3] = i + l[o];
		}
	}
	let f = new Uint32Array(e.cornerCount + 1);
	for (let t = 0; t <= e.cornerCount; t++) f[t] = t * 4;
	return {
		positions: u,
		faceOffsets: f,
		cornerVertices: d
	};
}
function Ta(e) {
	let t = ma(e), n = ha(e), r = ga(e, n), i = wa(e, t, _a(e, t, n, r), ya(e, t, r)), a = x(i.positions.length / 3, i.faceOffsets, i.cornerVertices), o = {
		...i,
		vertexCount: i.positions.length / 3,
		faceCount: e.cornerCount,
		cornerCount: e.cornerCount * 4,
		edgeVertices: a.edgeVertices,
		cornerEdges: a.cornerEdges,
		edgeCount: a.edgeCount
	}, s = Sa({
		...e,
		...Ca(e)
	}, o, e.attributes.edge);
	return o.edgeSharpness = s.sharpness, o.attributes = {
		face: xa(e, e.attributes.face),
		corner: ba(e, e.attributes.corner),
		edge: s.attributes
	}, o;
}
function Ea(e, { levels: t = 1, crease: n, sharpness: r = 10 } = {}) {
	let i = {
		positions: Float64Array.from(e.positions),
		vertexCount: e.vertexCount,
		edgeCount: e.edgeCount,
		faceCount: e.faceCount,
		cornerCount: e.cornerCount,
		faceOffsets: e.faceOffsets,
		cornerVertices: e.cornerVertices,
		edgeVertices: e.edgeVertices,
		cornerEdges: e.cornerEdges,
		edgeSharpness: fa(e, n, r),
		attributes: e.attributes
	};
	for (let e = 0; e < t; e++) i = Ta(i);
	return w({
		positions: Float32Array.from(i.positions),
		faceOffsets: i.faceOffsets,
		cornerVertices: i.cornerVertices,
		edgeVertices: i.edgeVertices,
		cornerEdges: i.cornerEdges,
		attributes: {
			point: {},
			...i.attributes
		}
	});
}
var Da = 100, Oa = .2, ka = 1.5, Aa = class {
	constructor() {
		this.entries = [];
	}
	get size() {
		return this.entries.length;
	}
	push(e) {
		let t = this.entries, n = t.length;
		for (t.push(e); n > 0;) {
			let r = n - 1 >> 1;
			if (t[r].cost <= e.cost) break;
			t[n] = t[r], n = r;
		}
		t[n] = e;
	}
	pop() {
		let e = this.entries, t = e[0], n = e.pop();
		if (e.length) {
			let t = 0;
			for (;;) {
				let r = t * 2 + 1;
				if (r >= e.length || (r + 1 < e.length && e[r + 1].cost < e[r].cost && r++, e[r].cost >= n.cost)) break;
				e[t] = e[r], t = r;
			}
			e[t] = n;
		}
		return t;
	}
};
function ja(e, t, n, r, i, a, o) {
	let s = t * 10;
	e[s] += o * n * n, e[s + 1] += o * n * r, e[s + 2] += o * n * i, e[s + 3] += o * n * a, e[s + 4] += o * r * r, e[s + 5] += o * r * i, e[s + 6] += o * r * a, e[s + 7] += o * i * i, e[s + 8] += o * i * a, e[s + 9] += o * a * a;
}
function Ma(e, t, n, r) {
	return e[0] * t * t + 2 * e[1] * t * n + 2 * e[2] * t * r + 2 * e[3] * t + e[4] * n * n + 2 * e[5] * n * r + 2 * e[6] * n + e[7] * r * r + 2 * e[8] * r + e[9];
}
function Na(e) {
	let [t, n, r, i, a, o, s, c, l] = e, u = t * (a * c - o * o) - n * (n * c - o * r) + r * (n * o - a * r), d = Math.abs(t) * Math.abs(a) * Math.abs(c);
	return Math.abs(u) <= 1e-9 * d || d === 0 ? null : [
		-(i * (a * c - o * o) - n * (s * c - o * l) + r * (s * o - a * l)) / u,
		-(t * (s * c - o * l) - i * (n * c - o * r) + r * (n * l - s * r)) / u,
		-(t * (a * l - s * o) - n * (n * l - s * r) + i * (n * o - a * r)) / u
	];
}
function Pa(e, t, n) {
	return Math.sqrt(e * e + t * t + n * n);
}
function Fa(e, t, n) {
	return e < t ? e * n + t : t * n + e;
}
function Ia(e) {
	let t = Object.entries(e.attributes.face).filter(([e]) => e.startsWith(me)).map(([, e]) => e.data);
	return Uint32Array.from({ length: e.faceCount }, (e, n) => {
		let r = 0;
		return t.forEach((e, t) => {
			r = r * 31 + (e[n] ? t + 1 : 0) >>> 0;
		}), r;
	});
}
var La = class {
	constructor(e) {
		this.mesh = e, this.vertexCount = e.vertexCount, this.positions = Float64Array.from(e.positions), this.cornerBuffer = /* @__PURE__ */ new Float64Array(9), this.combinedQuadric = /* @__PURE__ */ new Float64Array(10);
		let { triangleCorners: t, triangleFaces: r } = n(e, m(e).normals);
		this.triangleCount = r.length, this.sourceFaces = r, this.triangles = Int32Array.from(t, (t) => e.cornerVertices[t]), this.alive = new Uint8Array(this.triangleCount).fill(1), this.aliveCount = this.triangleCount, this.vertexAlive = new Uint8Array(this.vertexCount).fill(1), this.vertexTriangles = Array.from({ length: this.vertexCount }, () => []);
		for (let e = 0; e < this.triangleCount; e++) for (let t = 0; t < 3; t++) this.vertexTriangles[this.triangles[e * 3 + t]].push(e);
		this.quadrics = new Float64Array(this.vertexCount * 10), this.constrainedVertex = new Uint8Array(this.vertexCount), this.constraintEdges = /* @__PURE__ */ new Set(), this.buildQuadrics();
	}
	triangleNormal(e, t = -1, n = null) {
		let r = this.cornerBuffer;
		for (let i = 0; i < 3; i++) {
			let a = this.triangles[e * 3 + i], o = a === t ? n : this.positions, s = a === t ? 0 : a * 3;
			r[i * 3] = o[s], r[i * 3 + 1] = o[s + 1], r[i * 3 + 2] = o[s + 2];
		}
		let i = r[3] - r[0], a = r[4] - r[1], o = r[5] - r[2], s = r[6] - r[0], c = r[7] - r[1], l = r[8] - r[2];
		return [
			a * l - o * c,
			o * s - i * l,
			i * c - a * s
		];
	}
	buildQuadrics() {
		let e = Ia(this.mesh), t = /* @__PURE__ */ new Map();
		for (let e = 0; e < this.triangleCount; e++) {
			let n = this.triangleNormal(e), r = Math.hypot(...n);
			if (r > 0) {
				let t = n.map((e) => e / r), i = this.triangles[e * 3] * 3, a = -(t[0] * this.positions[i] + t[1] * this.positions[i + 1] + t[2] * this.positions[i + 2]);
				for (let n = 0; n < 3; n++) ja(this.quadrics, this.triangles[e * 3 + n], t[0], t[1], t[2], a, r / 2);
			}
			for (let n = 0; n < 3; n++) {
				let r = Fa(this.triangles[e * 3 + n], this.triangles[e * 3 + (n + 1) % 3], this.vertexCount);
				t.has(r) || t.set(r, []), t.get(r).push(e);
			}
		}
		for (let [n, r] of t) {
			let t = r.every((t) => e[this.sourceFaces[t]] === e[this.sourceFaces[r[0]]]);
			if (r.length === 2 && t) continue;
			this.constraintEdges.add(n);
			let i = Math.floor(n / this.vertexCount), a = n - i * this.vertexCount;
			this.constrainedVertex[i] = 1, this.constrainedVertex[a] = 1;
			for (let e of r) this.addConstraintPlane(i, a, e);
		}
	}
	addConstraintPlane(e, t, n) {
		let r = [
			0,
			1,
			2
		].map((n) => this.positions[t * 3 + n] - this.positions[e * 3 + n]), i = this.triangleNormal(n), a = [
			r[1] * i[2] - r[2] * i[1],
			r[2] * i[0] - r[0] * i[2],
			r[0] * i[1] - r[1] * i[0]
		], o = Math.hypot(...a);
		if (o === 0) return;
		let s = a.map((e) => e / o), c = -(s[0] * this.positions[e * 3] + s[1] * this.positions[e * 3 + 1] + s[2] * this.positions[e * 3 + 2]), l = Da * (r[0] ** 2 + r[1] ** 2 + r[2] ** 2);
		ja(this.quadrics, e, s[0], s[1], s[2], c, l), ja(this.quadrics, t, s[0], s[1], s[2], c, l);
	}
	neighbors(e) {
		let t = /* @__PURE__ */ new Set();
		for (let n of this.vertexTriangles[e]) for (let e = 0; e < 3; e++) t.add(this.triangles[n * 3 + e]);
		return t.delete(e), t;
	}
	evaluate(e, t) {
		let n = this.vertexTriangles[e].filter((e) => this.vertexTriangles[t].includes(e));
		if (!n.length) return null;
		let r = this.constrainedVertex[e] === 1, i = this.constrainedVertex[t] === 1;
		if (r && i && !this.constraintEdges.has(Fa(e, t, this.vertexCount))) return null;
		let a = this.neighbors(t);
		if ([...this.neighbors(e)].filter((e) => a.has(e)).length !== n.length) return null;
		let o = this.chooseTarget(e, t, r, i);
		return this.keepsOrientation(e, t, n, o.point) ? o : null;
	}
	chooseTarget(e, t, n, r) {
		let i = this.combinedQuadric;
		for (let n = 0; n < 10; n++) i[n] = this.quadrics[e * 10 + n] + this.quadrics[t * 10 + n];
		let a = (e) => [
			this.positions[e * 3],
			this.positions[e * 3 + 1],
			this.positions[e * 3 + 2]
		], o = a(e), s = a(t), c = [];
		if (n !== r) c.push(n ? o : s);
		else {
			let e = [
				(o[0] + s[0]) / 2,
				(o[1] + s[1]) / 2,
				(o[2] + s[2]) / 2
			];
			c.push(o, s, e);
			let t = n ? null : Na(i), r = t && Pa(t[0] - e[0], t[1] - e[1], t[2] - e[2]);
			t && r <= ka * Pa(o[0] - s[0], o[1] - s[1], o[2] - s[2]) && c.push(t);
		}
		let l = null;
		for (let e of c) {
			let t = Ma(i, e[0], e[1], e[2]);
			(!l || t < l.cost) && (l = {
				point: e,
				cost: Math.max(t, 0)
			});
		}
		return l;
	}
	keepsOrientation(e, t, n, r) {
		for (let i of [e, t]) for (let e of this.vertexTriangles[i]) {
			if (n.includes(e)) continue;
			let t = this.triangleNormal(e), a = this.triangleNormal(e, i, r), o = Pa(t[0], t[1], t[2]) * Pa(a[0], a[1], a[2]);
			if (o === 0 || (t[0] * a[0] + t[1] * a[1] + t[2] * a[2]) / o < Oa) return !1;
		}
		return !0;
	}
	collapse(e, t, n) {
		for (let n of [...this.vertexTriangles[t]]) {
			let r = [
				0,
				1,
				2
			].map((e) => this.triangles[n * 3 + e]);
			if (r.includes(e)) {
				this.alive[n] = 0, this.aliveCount--;
				for (let e of r) this.dropTriangle(e, n);
			} else this.triangles[n * 3 + r.indexOf(t)] = e, this.vertexTriangles[e].push(n);
		}
		this.moveConstraintEdges(e, t), this.positions.set(n, e * 3);
		for (let n = 0; n < 10; n++) this.quadrics[e * 10 + n] += this.quadrics[t * 10 + n];
		this.constrainedVertex[e] ||= this.constrainedVertex[t], this.vertexAlive[t] = 0, this.vertexTriangles[t] = [];
	}
	moveConstraintEdges(e, t) {
		if (this.constrainedVertex[t]) for (let n of this.neighbors(t)) {
			let r = Fa(t, n, this.vertexCount);
			this.constraintEdges.has(r) && (this.constraintEdges.delete(r), n !== e && this.constraintEdges.add(Fa(e, n, this.vertexCount)));
		}
	}
	dropTriangle(e, t) {
		let n = this.vertexTriangles[e], r = n.indexOf(t);
		r >= 0 && (n[r] = n[n.length - 1], n.pop());
	}
	run(e) {
		let t = new Aa(), n = (e, n) => {
			let r = this.constrainedVertex[e] === 1, i = this.constrainedVertex[n] === 1;
			r && i && !this.constraintEdges.has(Fa(e, n, this.vertexCount)) || t.push({
				cost: this.chooseTarget(e, n, r, i).cost,
				first: e,
				second: n
			});
		};
		for (let e = 0; e < this.triangleCount; e++) for (let t = 0; t < 3; t++) {
			let r = this.triangles[e * 3 + t], i = this.triangles[e * 3 + (t + 1) % 3];
			(r < i || !this.hasTriangleOnOtherSide(r, i, e)) && n(r, i);
		}
		for (; this.aliveCount > e && t.size;) {
			let { cost: e, first: r, second: i } = t.pop();
			if (!this.vertexAlive[r] || !this.vertexAlive[i]) continue;
			let a = this.evaluate(r, i);
			if (a) {
				if (a.cost > e * 1.0001 + 1e-18) t.push({
					cost: a.cost,
					first: r,
					second: i
				});
				else {
					this.collapse(r, i, a.point);
					for (let e of this.neighbors(r)) n(r, e);
				}
			}
		}
	}
	hasTriangleOnOtherSide(e, t, n) {
		return this.vertexTriangles[e].some((e) => e !== n && this.vertexTriangles[t].includes(e));
	}
	result() {
		let e = new Int32Array(this.vertexCount).fill(-1), t = [];
		for (let e = 0; e < this.triangleCount; e++) this.alive[e] && t.push(e);
		let n = [], r = new Uint32Array(t.length * 3);
		t.forEach((t, i) => {
			for (let a = 0; a < 3; a++) {
				let o = this.triangles[t * 3 + a];
				e[o] < 0 && (e[o] = n.length / 3, n.push(this.positions[o * 3], this.positions[o * 3 + 1], this.positions[o * 3 + 2])), r[i * 3 + a] = e[o];
			}
		});
		let i = Uint32Array.from({ length: t.length + 1 }, (e, t) => t * 3), a = {};
		for (let [e, n] of Object.entries(this.mesh.attributes.face)) e.startsWith("tag:") && (a[e] = {
			data: Uint8Array.from(t, (e) => n.data[this.sourceFaces[e]]),
			size: 1
		});
		return w({
			positions: Float32Array.from(n),
			faceOffsets: i,
			cornerVertices: r,
			attributes: { face: a }
		});
	}
};
function Ra(e, { ratio: t }) {
	if (typeof t != "number" || !(t > 0) || t > 1) throw RangeError("ratio must be above 0 and at most 1.");
	let n = new La(e), r = n.aliveCount, i = Math.max(4, Math.ceil(r * t));
	n.run(i);
	let a = n.result();
	return {
		mesh: a,
		triangles: {
			before: r,
			after: a.faceCount
		},
		reachedTarget: a.faceCount <= i
	};
}
// src/mesh-restructure.js
var za = 1e-6;
function Ba(e, t, n) {
	return t + 1 === e.faceOffsets[n + 1] ? e.faceOffsets[n] : t + 1;
}
function Va(e, t) {
	for (let n = 0; n < e.vertexCount; n++) t.addVertex(e.positions[n * 3], e.positions[n * 3 + 1], e.positions[n * 3 + 2]);
}
function Ha(e, t) {
	let n = [];
	for (let r = e.faceOffsets[t]; r < e.faceOffsets[t + 1]; r++) n.push(r);
	return n;
}
function Ua(e, t, n) {
	let r = Ha(t, n);
	e.addFace(r.map((e) => t.cornerVertices[e]), {
		sourceFace: n,
		sourceCorners: r,
		sourceEdges: r.map((e) => t.cornerEdges[e])
	});
}
function Wa(e, t, n, r) {
	let i = r.map((e, i) => {
		let a = r[(i + 1) % 3];
		return Ba(t, e, n) === a ? t.cornerEdges[e] : -1;
	});
	e.addFace(r.map((e) => t.cornerVertices[e]), {
		sourceFace: n,
		sourceCorners: r,
		sourceEdges: i
	});
}
function Ga(e, { minVertices: t = 4, maxFaces: r = Infinity } = {}) {
	let i = 0;
	for (let n = 0; n < e.faceCount; n++) {
		let r = e.faceOffsets[n + 1] - e.faceOffsets[n];
		i += r >= t ? r - 2 : 1;
	}
	if (i > r) throw RangeError(`triangulate would make ${i} faces, over the limit of ${r}.`);
	let { triangleCorners: a, triangleFaces: o } = n(e, m(e).normals), s = new D(e);
	Va(e, s);
	let c = 0, l = 0;
	for (let n = 0; n < e.faceCount; n++) {
		let r = e.faceOffsets[n + 1] - e.faceOffsets[n];
		if (r < t) Ua(s, e, n), c += r - 2;
		else {
			r > 3 && l++;
			for (let t = r - 2; t > 0; t--, c++) Wa(s, e, n, Array.from(a.subarray(c * 3, c * 3 + 3)));
		}
	}
	return {
		mesh: s.build(),
		triangulated: l,
		triangles: i
	};
}
function Ka(e, t, n, r) {
	return e.cornerVertices[n] === r ? n : Ba(e, n, t[n]);
}
function qa(e, t) {
	let n = m(e).normals, r = s(e), i = fe(e), o = Math.cos(t * Math.PI / 180) - za, c = new a(e.cornerCount);
	for (let t = 0; t < e.edgeCount; t++) {
		let a = r.edgeOffsets[t];
		if (r.edgeOffsets[t + 1] - a !== 2) continue;
		let s = r.edgeCorners[a], l = r.edgeCorners[a + 1], u = i[s] * 3, d = i[l] * 3;
		if (!(n[u] * n[d] + n[u + 1] * n[d + 1] + n[u + 2] * n[d + 2] < o)) for (let n of [e.edgeVertices[t * 2], e.edgeVertices[t * 2 + 1]]) c.union(Ka(e, i, s, n), Ka(e, i, l, n));
	}
	return c;
}
function Ja(e, { angle: t = 30, maxVertices: n = Infinity } = {}) {
	let r = qa(e, t), i = /* @__PURE__ */ new Map(), a = new Uint8Array(e.vertexCount), o = e.vertexCount, s = new Uint32Array(e.cornerCount);
	for (let t = 0; t < e.cornerCount; t++) {
		let n = r.find(t);
		if (s[t] = n, i.has(n)) continue;
		let c = e.cornerVertices[t];
		i.set(n, a[c] ? -1 : c), a[c] && o++, a[c] = 1;
	}
	if (o > n) throw RangeError(`edge_split would make ${o} vertices, over the limit of ${n}.`);
	let c = new D(e);
	Va(e, c);
	let l = [];
	for (let t = 0; t < e.faceCount; t++) {
		let n = Ha(e, t), r = n.map((t) => {
			let n = s[t];
			if (i.get(n) === -1) {
				let r = e.cornerVertices[t] * 3, a = c.addVertex(e.positions[r], e.positions[r + 1], e.positions[r + 2]);
				i.set(n, a), l.push(a);
			}
			return i.get(n);
		});
		c.addFace(r, {
			sourceFace: t,
			sourceCorners: n,
			sourceEdges: n.map((t) => e.cornerEdges[t])
		});
	}
	return {
		mesh: c.build(),
		addedVertices: l.length
	};
}
var Ya = Object.freeze({
	x: 0,
	y: 1,
	z: 2
}), Xa = 1e-6, Za = 1e-12;
function Qa(e, t, n, { maxVertices: r, maxFaces: i }, a) {
	if (t > r || n > i) throw RangeError(`${e} would make ${t} vertices and ${n} faces, over the limit of ${r} vertices and ${i} faces. ${a}`);
}
function $a(e, t) {
	let n = new Uint32Array(t.length / 4 + 1);
	for (let e = 0; e < n.length; e++) n[e] = e * 4;
	return w({
		positions: Float32Array.from(e),
		faceOffsets: n,
		cornerVertices: Uint32Array.from(t)
	});
}
function eo(e, t, n) {
	let r = (t + 1) % 3, i = (t + 2) % 3, a = Math.cos(n), o = Math.sin(n), s = [...e];
	return s[r] = e[r] * a - e[i] * o, s[i] = e[r] * o + e[i] * a, s;
}
function to(e, { axis: t, angle: n, steps: r, iterations: i, lift: a }, o) {
	let s = r * i, c = n * i / 360, l = a === 0 && Math.abs(c) >= .999999 && Math.abs(c - Math.round(c)) < Xa, u = l ? s : s + 1;
	Qa("screw", e.vertexCount * u, e.edgeCount * s, o, "Lower steps or iterations, or revolve a smaller profile.");
	let d = Ya[t], f = n * Math.PI / 180 / r, p = a / r, m = [];
	for (let t = 0; t < u; t++) for (let n = 0; n < e.vertexCount; n++) {
		let r = eo([
			e.positions[n * 3],
			e.positions[n * 3 + 1],
			e.positions[n * 3 + 2]
		], d, f * t);
		r[d] += p * t, m.push(...r);
	}
	let h = [];
	for (let t = 0; t < s; t++) {
		let n = t * e.vertexCount, r = (t + 1) % u * e.vertexCount;
		for (let t = 0; t < e.edgeCount; t++) {
			let i = e.edgeVertices[t * 2], a = e.edgeVertices[t * 2 + 1];
			h.push(n + i, n + a, r + a, r + i);
		}
	}
	return {
		mesh: $a(m, h),
		result: {
			steps: s,
			closed: l
		}
	};
}
function no(e, t) {
	return [
		e[1] * t[2] - e[2] * t[1],
		e[2] * t[0] - e[0] * t[2],
		e[0] * t[1] - e[1] * t[0]
	];
}
function ro(e) {
	let t = Math.hypot(...e);
	return t > 0 ? e.map((e) => e / t) : e;
}
function io(e, { thickness: t, offset: n, evenOffset: r, replace: i }, a) {
	let o = i ? 0 : e.vertexCount, s = i ? 0 : e.faceCount;
	Qa("wireframe", o + e.vertexCount * 2 + e.cornerCount, s + e.cornerCount * 2, a, "Use a mesh with fewer faces.");
	let c = g(e), l = m(e).normals, u = t / 2, d = [];
	i || d.push(...e.positions);
	for (let t = 0; t < e.vertexCount; t++) for (let r of [(n - 1) * u, (1 + n) * u]) for (let n = 0; n < 3; n++) d.push(e.positions[t * 3 + n] + c[t * 3 + n] * r);
	let f = o + e.vertexCount * 2, p = (t) => [
		e.positions[t * 3],
		e.positions[t * 3 + 1],
		e.positions[t * 3 + 2]
	];
	for (let t = 0; t < e.faceCount; t++) {
		let i = e.faceOffsets[t], a = e.faceOffsets[t + 1], o = [...l.subarray(t * 3, t * 3 + 3)];
		for (let t = i; t < a; t++) {
			let s = e.cornerVertices[t], l = p(e.cornerVertices[t === i ? a - 1 : t - 1]), f = p(e.cornerVertices[t + 1 === a ? i : t + 1]), m = p(s), h = ro(m.map((e, t) => e - l[t])), g = ro(f.map((e, t) => e - m[t])), _ = no(o, h), v = no(o, g), y = _.map((e, t) => e + v[t]), b = _[0] * v[0] + _[1] * v[1] + _[2] * v[2], x = r ? y.map((e) => e * u / Math.max(1 + b, .001)) : ro(y).map((e) => e * u);
			for (let e = 0; e < 3; e++) d.push(m[e] + c[s * 3 + e] * n * u + x[e]);
		}
	}
	let h = (e) => o + e * 2, _ = (e) => o + e * 2 + 1, v = [0], y = [], b = (e) => {
		y.push(...e), v.push(y.length);
	};
	if (!i) for (let t = 0; t < e.faceCount; t++) b(Array.from(e.cornerVertices.subarray(e.faceOffsets[t], e.faceOffsets[t + 1])));
	for (let t = 0; t < e.faceCount; t++) {
		let n = e.faceOffsets[t], r = e.faceOffsets[t + 1];
		for (let t = n; t < r; t++) {
			let i = t + 1 === r ? n : t + 1, a = e.cornerVertices[t], o = e.cornerVertices[i];
			b([
				f + t,
				f + i,
				h(o),
				h(a)
			]), b([
				f + i,
				f + t,
				_(a),
				_(o)
			]);
		}
	}
	return {
		mesh: w({
			positions: Float32Array.from(d),
			faceOffsets: Uint32Array.from(v),
			cornerVertices: Uint32Array.from(y)
		}),
		result: {}
	};
}
function ao(e) {
	let t = e.map(Math.abs).indexOf(Math.min(...e.map(Math.abs))), n = [
		0,
		0,
		0
	];
	n[t] = 1;
	let r = ro(no(e, n));
	return [r, no(e, r)];
}
function oo(e, t) {
	if (typeof t == "number") return new Float64Array(e.vertexCount).fill(t);
	let { values: n } = p(t, i(e, "point"), { kind: "scalar" });
	for (let t = 0; t < e.vertexCount; t++) if (!(n[t] > 0) || !Number.isFinite(n[t])) throw k("radius", n[t], `above 0 at every vertex, such as 0.1 (vertex ${t} breaks this); change the radius field, for example wrap it in max`);
	return n;
}
function so(e, { radius: t }, n) {
	Qa("skin", e.edgeCount * 8, e.edgeCount * 6, n, "Skin a mesh with fewer edges.");
	let r = oo(e, t), i = [], a = [], o = [];
	for (let t = 0; t < e.edgeCount; t++) {
		let n = e.edgeVertices[t * 2], s = e.edgeVertices[t * 2 + 1], c = [
			e.positions[n * 3],
			e.positions[n * 3 + 1],
			e.positions[n * 3 + 2]
		], l = [
			e.positions[s * 3],
			e.positions[s * 3 + 1],
			e.positions[s * 3 + 2]
		], u = l.map((e, t) => e - c[t]);
		if (Math.hypot(...u) < Za) throw RangeError(`skin edge ${t} has no length. Weld the mesh first.`);
		let [d, f] = ao(ro(u)), p = i.length / 3;
		for (let [e, t] of [[c, r[n]], [l, r[s]]]) for (let [n, r] of [
			[-1, -1],
			[1, -1],
			[1, 1],
			[-1, 1]
		]) for (let a = 0; a < 3; a++) i.push(e[a] + (d[a] * n + f[a] * r) * t);
		for (let e = 0; e < 4; e++) {
			let t = (e + 1) % 4;
			a.push(p + e, p + t, p + 4 + t, p + 4 + e);
		}
		o.push([
			p + 3,
			p + 2,
			p + 1,
			p
		], [
			p + 4,
			p + 5,
			p + 6,
			p + 7
		]);
	}
	let s = [0], c = [];
	for (let e = 0; e < a.length; e += 4) c.push(a[e], a[e + 1], a[e + 2], a[e + 3]), s.push(c.length);
	for (let e of o) c.push(...e), s.push(c.length);
	return {
		mesh: w({
			positions: Float32Array.from(i),
			faceOffsets: Uint32Array.from(s),
			cornerVertices: Uint32Array.from(c)
		}),
		result: { tubes: e.edgeCount }
	};
}
function co(e, t, n, { finiteNumber: r, checkedField: i }) {
	switch (e.op) {
		case "screw":
			t.axis = e.axis ?? "z", Nt(t.axis, n), t.angle = e.angle === void 0 ? 360 : r(e.angle, n, "angle", {
				minimum: -3600,
				maximum: 3600
			}), t.steps = e.steps === void 0 ? 16 : P(e.steps, n, "steps", 1, 256), t.iterations = e.iterations === void 0 ? 1 : P(e.iterations, n, "iterations", 1, 64), t.lift = e.lift === void 0 ? 0 : r(e.lift, n, "lift", {
				minimum: -1e4,
				maximum: 1e4
			});
			break;
		case "wireframe":
			t.thickness = e.thickness === void 0 ? .02 : r(e.thickness, n, "thickness", {
				minimum: 0,
				maximum: 1e3,
				exclusiveMinimum: !0
			}), t.offset = e.offset === void 0 ? 0 : r(e.offset, n, "offset", {
				minimum: -1,
				maximum: 1
			}), t.evenOffset = e.evenOffset ?? !0, t.replace = e.replace ?? !0, F(t.evenOffset, n, "evenOffset"), F(t.replace, n, "replace");
			break;
		case "skin": t.radius = e.radius === void 0 ? .1 : typeof e.radius == "number" ? r(e.radius, n, "radius", {
			minimum: 0,
			maximum: 1e3,
			exclusiveMinimum: !0
		}) : i(e.radius, n, "radius", "scalar");
	}
}
var lo = Object.freeze({
	screw: to,
	wireframe: io,
	skin: so
}), uo = 50, fo = 1e-6;
function po(e, { edge: t = {}, corner: n = {} }) {
	return w({
		positions: e.positions,
		faceOffsets: e.faceOffsets,
		cornerVertices: e.cornerVertices,
		edgeVertices: e.edgeVertices,
		cornerEdges: e.cornerEdges,
		attributes: {
			...e.attributes,
			edge: {
				...e.attributes.edge,
				...t
			},
			corner: {
				...e.attributes.corner,
				...n
			}
		}
	});
}
function mo(e, { angle: t, ignoreSharp: n }) {
	let r = m(e).normals, i = s(e), a = fe(e), o = Math.cos(t * Math.PI / 180) - fo, c = new Uint8Array(e.edgeCount), l = new Uint8Array(e.edgeCount), u = e.attributes.edge.sharp?.data;
	for (let t = 0; t < e.edgeCount; t++) {
		let e = !!u?.[t];
		if (i.edgeOffsets[t + 1] - i.edgeOffsets[t] !== 2) {
			c[t] = +!!e;
			continue;
		}
		let s = a[i.edgeCorners[i.edgeOffsets[t]]] * 3, d = a[i.edgeCorners[i.edgeOffsets[t] + 1]] * 3, f = r[s] * r[d] + r[s + 1] * r[d + 1] + r[s + 2] * r[d + 2] < o;
		c[t] = f || e && !n ? 1 : 0, l[t] = +!c[t];
	}
	return po(e, { edge: {
		sharp: {
			data: c,
			size: 1
		},
		smooth: {
			data: l,
			size: 1
		}
	} });
}
function ho(e, { angle: t, weight: n }) {
	let { groupOfCorner: r, groupCount: i } = h(e, { sharpAngle: t * Math.PI / 180 }), { normals: a, areas: o } = m(e), s = fe(e), c = n / uo, l = new Float64Array(i * 3);
	for (let t = 0; t < e.cornerCount; t++) {
		let e = s[t], n = o[e] ** +c;
		for (let i = 0; i < 3; i++) l[r[t] * 3 + i] += a[e * 3 + i] * n;
	}
	let u = new Float32Array(e.cornerCount * 3);
	for (let t = 0; t < e.cornerCount; t++) {
		let e = r[t] * 3, n = Math.hypot(l[e], l[e + 1], l[e + 2]), i = s[t] * 3;
		for (let r = 0; r < 3; r++) u[t * 3 + r] = n > 0 ? l[e + r] / n : a[i + r];
	}
	return po(e, { corner: { normal: {
		data: u,
		size: 3
	} } });
}
function go(e, t, n, { finiteNumber: r }) {
	t.angle = e.angle === void 0 ? 30 : r(e.angle, n, "angle", {
		minimum: 0,
		maximum: 180
	}), e.op === "smooth_by_angle" ? t.ignoreSharp = F(e.ignoreSharp, n, "ignoreSharp") ?? !1 : t.weight = e.weight === void 0 ? uo : r(e.weight, n, "weight", {
		minimum: 1,
		maximum: 100
	});
}
var _o = Object.freeze({
	smooth_by_angle: mo,
	weighted_normal: ho
}), vo = Object.freeze([
	"smooth",
	"linear",
	"constant"
]), yo = Object.freeze([
	"xy",
	"x",
	"y"
]), bo = Object.freeze({
	x: 0,
	y: 1,
	z: 2
}), xo = 16, So = 1e-9;
function Co(e) {
	let t = [
		Infinity,
		Infinity,
		Infinity
	], n = [
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let r = 0; r < e.vertexCount; r++) for (let i = 0; i < 3; i++) t[i] = Math.min(t[i], e.positions[r * 3 + i]), n[i] = Math.max(n[i], e.positions[r * 3 + i]);
	return {
		low: t,
		high: n
	};
}
function wo(e, { divisions: t, moves: n }) {
	let [r, i, a] = t, o = new Float64Array(r * i * a * 3), s = (e, t, n) => ((n * i + t) * r + e) * 3;
	for (let { point: e, offset: t } of n) for (let n = 0; n < 3; n++) o[s(...e) + n] += t[n];
	let { low: c, high: l } = Co(e), u = [
		r,
		i,
		a
	], d = new Float32Array(e.positions);
	for (let t = 0; t < e.vertexCount; t++) {
		let n = [
			0,
			0,
			0
		], r = [
			0,
			0,
			0
		];
		for (let i = 0; i < 3; i++) {
			let a = l[i] - c[i], o = a > So ? (e.positions[t * 3 + i] - c[i]) / a * (u[i] - 1) : 0;
			n[i] = Math.min(Math.floor(o), u[i] - 2), r[i] = o - n[i];
		}
		for (let e = 0; e < 8; e++) {
			let i = e & 1, a = e >> 1 & 1, c = e >> 2 & 1, l = (i ? r[0] : 1 - r[0]) * (a ? r[1] : 1 - r[1]) * (c ? r[2] : 1 - r[2]);
			if (l === 0) continue;
			let u = s(n[0] + i, n[1] + a, n[2] + c);
			for (let e = 0; e < 3; e++) d[t * 3 + e] += o[u + e] * l;
		}
	}
	return d;
}
function To(e, t, n) {
	if (t >= n) return 0;
	let r = 1 - t / n;
	return e === "constant" ? 1 : e === "linear" ? r : r * r * (3 - 2 * r);
}
function Eo(e, { center: t, radius: n, translation: r, strength: i, falloff: a }) {
	let o = new Float32Array(e.positions);
	for (let s = 0; s < e.vertexCount; s++) {
		let c = To(a, Math.hypot(e.positions[s * 3] - t[0], e.positions[s * 3 + 1] - t[1], e.positions[s * 3 + 2] - t[2]), n) * i;
		if (c !== 0) for (let e = 0; e < 3; e++) o[s * 3 + e] += r[e] * c;
	}
	return o;
}
function Do(e, { height: t, width: n, narrowness: r, speed: i, time: a, timeOffset: o, start: s, cyclic: c, axes: l, normal: u }) {
	let d = new Float32Array(e.positions), f = u ? g(e) : null, p = 1 / Math.exp(n * r * n * r);
	for (let u = 0; u < e.vertexCount; u++) {
		let m = e.positions[u * 3] - s[0], h = e.positions[u * 3 + 1] - s[1], g = l === "xy" ? Math.hypot(m, h) : l === "x" ? m : h;
		if (g -= (a - o) * i, c && (g = (g - n) % (n * 2) + n), !(g > -n && g < n)) continue;
		let _ = g * r, v = t * (1 / Math.exp(_ * _) - p);
		if (f) for (let e = 0; e < 3; e++) d[u * 3 + e] += f[u * 3 + e] * v;
		else d[u * 3 + 2] += v;
	}
	return d;
}
function Oo(e, t, n, r, i) {
	let a = i * i, o = a * i;
	return t.map((t, s) => .5 * (2 * t + (n[s] - e[s]) * i + (2 * e[s] - 5 * t + 4 * n[s] - r[s]) * a + (3 * t - e[s] - 3 * n[s] + r[s]) * o));
}
function ko(e) {
	let t = Math.hypot(...e);
	return e.map((e) => e / t);
}
function Ao(e, t) {
	return e[0] * t[0] + e[1] * t[1] + e[2] * t[2];
}
function jo(e, t) {
	return [
		e[1] * t[2] - e[2] * t[1],
		e[2] * t[0] - e[0] * t[2],
		e[0] * t[1] - e[1] * t[0]
	];
}
function Mo(e, t) {
	let n = [];
	for (let t = 0; t + 1 < e.length; t++) {
		let r = e[Math.max(t - 1, 0)], i = e[Math.min(t + 2, e.length - 1)];
		for (let a = 0; a < xo; a++) n.push(Oo(r, e[t], e[t + 1], i, a / xo));
	}
	n.push(e.at(-1));
	let r = [0];
	for (let e = 1; e < n.length; e++) r.push(r[e - 1] + Math.hypot(...n[e].map((t, r) => t - n[e - 1][r])));
	if (!(r.at(-1) > So)) throw k("path", e, "points that are apart, such as [[0, 0, 0], [0, 0, 2]]");
	let i = n.map((e, t) => {
		let r = n[Math.min(t + 1, n.length - 1)], i = n[Math.max(t - 1, 0)], a = r.map((e, t) => e - i[t]);
		return Math.hypot(...a) > 0 ? ko(a) : [
			1,
			0,
			0
		];
	}), a = [
		0,
		0,
		0
	];
	a[t] = 1;
	let o = [], s = a;
	return i.forEach((e, i) => {
		let a = s.map((t, n) => t - Ao(s, e) * e[n]);
		if (Math.hypot(...a) < 1e-6) {
			let n = [
				0,
				0,
				0
			];
			n[(t + 1) % 3] = 1, a = n.map((t, r) => t - Ao(n, e) * e[r]);
		}
		s = ko(a), o.push({
			tangent: e,
			normal: s,
			binormal: jo(e, s),
			point: n[i],
			distance: r[i]
		});
	}), o;
}
function No(e, t) {
	let n = e.length - 1;
	if (t <= 0) return {
		...e[0],
		along: t
	};
	if (t >= e[n].distance) return {
		...e[n],
		along: t - e[n].distance
	};
	let r = 0, i = n;
	for (; i - r > 1;) {
		let n = r + i >> 1;
		e[n].distance <= t ? r = n : i = n;
	}
	let a = e[i].distance - e[r].distance, o = a > 0 ? (t - e[r].distance) / a : 0, s = (e, t) => e.map((e, n) => e + (t[n] - e) * o), c = ko(s(e[r].tangent, e[i].tangent)), l = ko(s(e[r].normal, e[i].normal));
	return {
		tangent: c,
		normal: l,
		binormal: jo(c, l),
		point: s(e[r].point, e[i].point),
		along: 0
	};
}
function Po(e, { path: t, axis: n }) {
	let r = bo[n], i = Mo(t, (r + 1) % 3), a = new Float32Array(e.positions);
	for (let t = 0; t < e.vertexCount; t++) {
		let n = e.positions[t * 3 + r], o = e.positions[t * 3 + (r + 1) % 3], s = e.positions[t * 3 + (r + 2) % 3], c = No(i, n);
		for (let e = 0; e < 3; e++) a[t * 3 + e] = c.point[e] + c.tangent[e] * c.along + c.normal[e] * o + c.binormal[e] * s;
	}
	return a;
}
function Fo(e, t, n, r) {
	if (!Array.isArray(e) || e.length !== 3) throw N(t, n, e, "an array of three numbers, such as [0, 1, 0]");
	return e.map((e) => r(e, t, n));
}
function Io(e, t, n, { finiteNumber: r }) {
	let i = e.divisions ?? [
		2,
		2,
		2
	];
	if (!Array.isArray(i) || i.length !== 3) throw N(n, "divisions", i, "an array of three whole numbers from 2 to 8, such as [2, 2, 2]");
	t.divisions = i.map((e) => P(e, n, "divisions", 2, 8));
	let a = e.moves ?? [];
	if (!Array.isArray(a) || a.length > 64) throw N(n, "moves", a, "a list of at most 64 moves, such as [{ \"point\": [0, 0, 0], \"offset\": [0, 0, 1] }]", RangeError);
	t.moves = a.map((e, i) => {
		if (!e || typeof e != "object" || Array.isArray(e)) throw N(n, `moves[${i}]`, e, "an object such as { \"point\": [0, 0, 0], \"offset\": [0, 0, 1] }");
		if (!Array.isArray(e.point) || e.point.length !== 3) throw N(n, `moves[${i}].point`, e.point, "three grid indices, such as [0, 1, 0]");
		return {
			point: e.point.map((e, r) => P(e, n, `moves[${i}].point`, 0, t.divisions[r] - 1)),
			offset: Fo(e.offset, n, `moves[${i}].offset`, r)
		};
	});
}
function Lo(e, t, n, { finiteNumber: r }) {
	if (!Array.isArray(e.path) || e.path.length < 2 || e.path.length > 64) throw N(n, "path", e.path, "an array of 2 to 64 points of three numbers, such as [[0, 0, 0], [0, 0, 2]]");
	t.path = e.path.map((e) => Fo(e, n, "path", r)), t.axis = e.axis ?? "x", Nt(t.axis, n);
}
function Ro(e, t, n, { finiteNumber: r }) {
	if (t.center = Fo(e.center ?? [
		0,
		0,
		0
	], n, "center", r), t.radius = e.radius === void 0 ? 1 : r(e.radius, n, "radius", {
		minimum: 0,
		maximum: 1e4,
		exclusiveMinimum: !0
	}), t.translation = Fo(e.translation ?? [
		0,
		0,
		0
	], n, "translation", r), t.strength = e.strength === void 0 ? 1 : r(e.strength, n, "strength", {
		minimum: 0,
		maximum: 1
	}), t.falloff = e.falloff ?? "smooth", !vo.includes(t.falloff)) throw N(n, "falloff", t.falloff, `one of ${vo.join(", ")}`);
}
function zo(e, t, n, { finiteNumber: r }) {
	t.height = e.height === void 0 ? .5 : r(e.height, n, "height", {
		minimum: -1e4,
		maximum: 1e4
	}), t.width = e.width === void 0 ? 1.5 : r(e.width, n, "width", {
		minimum: 0,
		maximum: 1e4,
		exclusiveMinimum: !0
	}), t.narrowness = e.narrowness === void 0 ? 1.5 : r(e.narrowness, n, "narrowness", {
		minimum: 0,
		maximum: 50
	}), t.speed = e.speed === void 0 ? .25 : r(e.speed, n, "speed", {
		minimum: -1e4,
		maximum: 1e4
	}), t.time = e.time === void 0 ? 0 : r(e.time, n, "time", {
		minimum: -1e6,
		maximum: 1e6
	}), t.timeOffset = e.timeOffset === void 0 ? 0 : r(e.timeOffset, n, "timeOffset", {
		minimum: -1e6,
		maximum: 1e6
	});
	let i = e.start ?? [0, 0];
	if (!Array.isArray(i) || i.length !== 2) throw N(n, "start", i, "an array of two numbers, x and y, such as [0, 0]");
	if (t.start = i.map((e) => r(e, n, "start")), t.cyclic = e.cyclic ?? !0, t.normal = e.normal ?? !1, F(t.cyclic, n, "cyclic"), F(t.normal, n, "normal"), t.axes = e.axes ?? "xy", !yo.includes(t.axes)) throw N(n, "axes", t.axes, `one of ${yo.join(", ")}`);
}
var Bo = Object.freeze({
	lattice: Io,
	curve: Lo,
	hook: Ro,
	wave: zo
}), Vo = Object.freeze({
	lattice: wo,
	curve: Po,
	hook: Eo,
	wave: Do
}), Ho = (e) => Object.hasOwn(Vo, e);
function Uo(e, t, n, r) {
	Bo[e.op](e, t, n, r);
}
function Wo(e, t) {
	return {
		mesh: V(e, Vo[t.op](e, t)),
		result: {}
	};
}
// src/mesh-modifiers.js
var Go = Object.freeze([
	"twist",
	"bend",
	"taper",
	"stretch"
]), Ko = Object.freeze({
	x: 0,
	y: 1,
	z: 2
}), qo = 64, Jo = 1e-7;
function Yo(e) {
	return Object.hasOwn(Le, e);
}
function Xo(e, t, n, r) {
	if (e[n] !== void 0) throw N(t, n, e[n], `left out, because ${e.op} ${e.mode} takes ${r}`);
}
function Zo(e, t, n, r) {
	if (!Go.includes(e.mode)) throw N(n, "mode", e.mode, `one of ${Go.join(", ")}`);
	t.mode = e.mode, t.axis = e.axis ?? "z", Nt(t.axis, n), e.mode === "twist" || e.mode === "bend" ? (Xo(e, n, "factor", "angle in degrees, such as \"angle\": 45"), t.angle = e.angle === void 0 ? 45 : r(e.angle, n, "angle", {
		minimum: -3600,
		maximum: 3600
	})) : (Xo(e, n, "angle", "factor, such as \"factor\": 0.5"), t.factor = e.factor === void 0 ? .5 : r(e.factor, n, "factor", {
		minimum: -10,
		maximum: 10
	}));
}
function Qo(e, t, n, { finiteNumber: r, checkedField: i }) {
	if (Object.hasOwn(lo, e.op)) co(e, t, n, {
		finiteNumber: r,
		checkedField: i
	});
	else if (Object.hasOwn(_o, e.op)) go(e, t, n, { finiteNumber: r });
	else if (Ho(e.op)) Uo(e, t, n, { finiteNumber: r });
	else if (Object.hasOwn(as, e.op)) as[e.op](e, t, n, {
		finiteNumber: r,
		integerInRange: P
	});
	else switch (e.op) {
		case "weld":
			t.distance = e.distance === void 0 ? .001 : r(e.distance, n, "distance", {
				minimum: 0,
				maximum: 1e3,
				exclusiveMinimum: !0
			});
			break;
		case "triangulate":
			t.minVertices = e.minVertices === void 0 ? 4 : P(e.minVertices, n, "minVertices", 4, 4096);
			break;
		case "edge_split":
			t.angle = e.angle === void 0 ? 30 : r(e.angle, n, "angle", {
				minimum: 0,
				maximum: 180
			});
			break;
		case "smooth":
			t.factor = e.factor === void 0 ? .5 : r(e.factor, n, "factor", {
				minimum: -2,
				maximum: 2
			}), t.iterations = e.iterations === void 0 ? 1 : P(e.iterations, n, "iterations", 1, 64);
			break;
		case "simple_deform":
			Zo(e, t, n, r);
			break;
		case "cast": t.factor = e.factor === void 0 ? .5 : r(e.factor, n, "factor", {
			minimum: 0,
			maximum: 1
		}), t.size = e.size === void 0 ? 0 : r(e.size, n, "size", {
			minimum: 0,
			maximum: 1e6
		});
	}
}
function $o(e, { factor: t, iterations: n }) {
	let r = Float64Array.from(e.positions), i = new Float64Array(r.length), a = new Uint32Array(e.vertexCount);
	for (let o = 0; o < n; o++) {
		i.fill(0), a.fill(0);
		for (let t = 0; t < e.edgeCount; t++) {
			let n = e.edgeVertices[t * 2], o = e.edgeVertices[t * 2 + 1];
			for (let e = 0; e < 3; e++) i[n * 3 + e] += r[o * 3 + e], i[o * 3 + e] += r[n * 3 + e];
			a[n]++, a[o]++;
		}
		for (let n = 0; n < e.vertexCount; n++) if (a[n] !== 0) for (let e = 0; e < 3; e++) {
			let o = n * 3 + e;
			r[o] += t / 2 * (i[o] / a[n] - r[o]);
		}
	}
	return Float32Array.from(r);
}
function es(e, { factor: t, size: n }) {
	let r = new Float64Array(e.vertexCount), i = 0;
	for (let t = 0; t < e.vertexCount; t++) r[t] = Math.hypot(e.positions[t * 3], e.positions[t * 3 + 1], e.positions[t * 3 + 2]), i += r[t];
	let a = n > 0 ? n : i / e.vertexCount, o = new Float32Array(e.positions);
	for (let n = 0; n < e.vertexCount; n++) {
		if (r[n] === 0) continue;
		let i = a / r[n];
		for (let r = 0; r < 3; r++) {
			let a = n * 3 + r;
			o[a] = e.positions[a] * (1 - t) + e.positions[a] * i * t;
		}
	}
	return o;
}
function ts(e, t) {
	return e === "bend" ? [
		[
			0,
			1,
			2
		],
		[
			1,
			0,
			2
		],
		[
			2,
			1,
			0
		]
	][t] : [
		(t + 1) % 3,
		(t + 2) % 3,
		t
	];
}
function ns(e, [t, n, r], i) {
	if (e === "twist") {
		let e = r * i;
		return [
			t * Math.cos(e) - n * Math.sin(e),
			t * Math.sin(e) + n * Math.cos(e),
			r
		];
	}
	if (e === "taper") {
		let e = 1 + r * i;
		return [
			t * e,
			n * e,
			r
		];
	}
	if (e === "stretch") {
		let e = r * r * i - i + 1;
		return [
			t * e,
			n * e,
			r * (1 + i)
		];
	}
	let a = r * i;
	return [
		t,
		n * Math.cos(a) + (1 - Math.cos(a)) / i,
		-(n - 1 / i) * Math.sin(a)
	];
}
function rs(e, { mode: t, axis: n, angle: r, factor: i }) {
	let a = ts(t, Ko[n]), o = Infinity, s = -Infinity;
	for (let t = 0; t < e.vertexCount; t++) o = Math.min(o, e.positions[t * 3 + a[2]]), s = Math.max(s, e.positions[t * 3 + a[2]]);
	let c = s - o, l = (t === "twist" || t === "bend" ? r * Math.PI / 180 : i) / c, u = new Float32Array(e.positions);
	if (!(c > 1e-9) || t === "bend" && Math.abs(l) < Jo) return u;
	for (let n = 0; n < e.vertexCount; n++) {
		let r = ns(t, a.map((t) => e.positions[n * 3 + t]), l);
		a.forEach((e, t) => {
			u[n * 3 + e] = r[t];
		});
	}
	return u;
}
var is = Object.create(null), as = Object.create(null);
function os(e, t) {
	as[e] = t;
}
function ss(e, t) {
	is[e] = t;
}
function cs(e, t, { maxVertices: n, maxFaces: r }) {
	if (Object.hasOwn(lo, t.op)) return lo[t.op](e, t, {
		maxVertices: n,
		maxFaces: r
	});
	if (Object.hasOwn(_o, t.op)) return {
		mesh: _o[t.op](e, t),
		result: {}
	};
	if (Object.hasOwn(is, t.op)) return is[t.op](e, t);
	if (Ho(t.op)) return Wo(e, t);
	switch (t.op) {
		case "weld": {
			let n = S(e, t.distance);
			return {
				mesh: n.mesh,
				result: {
					removedVertices: n.removedVertices,
					removedFaces: n.removedFaces
				}
			};
		}
		case "triangulate": {
			let n = Ga(e, {
				minVertices: t.minVertices,
				maxFaces: r
			});
			return {
				mesh: n.mesh,
				result: { triangulated: n.triangulated }
			};
		}
		case "edge_split": {
			let r = Ja(e, {
				angle: t.angle,
				maxVertices: n
			});
			return {
				mesh: r.mesh,
				result: { addedVertices: r.addedVertices }
			};
		}
		case "smooth": return {
			mesh: V(e, $o(e, t)),
			result: {}
		};
		case "cast": return {
			mesh: V(e, es(e, t)),
			result: {}
		};
		case "simple_deform": return {
			mesh: V(e, rs(e, t)),
			result: {}
		};
	}
	throw TypeError(`Not a modifier: ${t.op}`);
}
// src/mesh-sculpt.js
function ls(e, t) {
	let n = g(e), r = [];
	for (let i = 0; i < e.vertexCount; i++) {
		let a = i * 3;
		r.push({
			point: Array.from(e.positions.subarray(a, a + 3)),
			normal: Array.from(n.subarray(a, a + 3)),
			neighbors: t ? /* @__PURE__ */ new Set() : null
		});
	}
	if (t) for (let t = 0; t < e.edgeVertices.length; t += 2) {
		let n = e.edgeVertices[t], i = e.edgeVertices[t + 1];
		r[n].neighbors.add(i), r[i].neighbors.add(n);
	}
	return r;
}
function us(e, t) {
	if (t > 32) throw RangeError("A sculpt edit takes at most 32 strokes. Split the work into several sculpt edits.");
	if (e.vertexCount * t > 5e6) throw RangeError("Sculpting would visit too many vertices. Use fewer strokes or a coarser mesh.");
}
function ds(e, { select: t, strokes: n }) {
	let r = ze(n), i = ls(e, r.some((e) => e.type === "smooth"));
	for (let e of r) Be(i, e);
	let a = Ai(e, t), o = new Float32Array(e.positions), s = 0;
	for (let t = 0; t < e.vertexCount; t++) {
		if (!a[t]) continue;
		let e = i[t].point;
		e.some((e, n) => Math.fround(e) !== o[t * 3 + n]) && s++, o.set(e, t * 3);
	}
	return {
		mesh: V(e, o),
		movedVertices: s
	};
}
// src/mesh-shrinkwrap.js
function fs(e, t, { mode: n, direction: r, maxDistance: i }, a) {
	return n === "project" ? e.project({
		origin: t,
		direction: r,
		maxDistance: i,
		maxTriangleTests: a
	}) : e.nearest(t, {
		maxDistance: i,
		maxTriangleTests: a
	});
}
function ps(e, { mode: t, direction: n }) {
	return t === "project" && e[0] * n[0] + e[1] * n[1] + e[2] * n[2] > 0 ? -1 : 1;
}
function ms(e, t, n) {
	let { select: r, offset: i, onMiss: a } = n, o = Ai(e, r), s = H(t), c = Se({
		positions: new Float32Array(s.positions),
		indices: s.indices
	}), l = new Float32Array(e.positions), u = 0, d = 0, f = 0;
	try {
		for (let t = 0; t < e.vertexCount; t++) {
			if (!o[t]) continue;
			let r = Re - f;
			if (r <= 0) throw k("select", "a selection that needs too many triangle tests", "fewer faces or a simpler target, such as a smaller select");
			let s = fs(c, Array.from(e.positions.subarray(t * 3, t * 3 + 3)), n, r);
			if (f += s.triangleTests, !s.hit) {
				if (d++, a === "error") throw k("onMiss", a, `"keep", such as onMiss "keep", to leave vertices that find no surface in place (vertex ${t} found none); or raise maxDistance, or change the direction`);
				continue;
			}
			let p = ps(s.hit.normal, n);
			for (let e = 0; e < 3; e++) l[t * 3 + e] = s.hit.point[e] + s.hit.normal[e] * p * i;
			u++;
		}
	} finally {
		c.dispose();
	}
	return {
		mesh: V(e, l),
		movedVertices: u,
		missedVertices: d
	};
}
// src/mesh-field-surfaces.js
var hs = Object.freeze([
	"distance",
	"point",
	"normal"
]), gs = Object.freeze([
	"hit",
	"distance",
	"point",
	"normal"
]), _s = /* @__PURE__ */ new Set(["point", "normal"]), vs = 2e7;
function W(e) {
	return /* @__PURE__ */ TypeError(`Field expression: ${e}`);
}
function ys(e, t, n) {
	for (let r of Object.keys(e)) if (!t.includes(r)) throw W(`${n} does not take ${JSON.stringify(r.slice(0, 24))}; fields: ${t.join(", ")}.`);
}
function bs(e) {
	let t = /* @__PURE__ */ new Map();
	return {
		budget: { remaining: vs },
		indexOf(n) {
			if (!e) throw RangeError("This context has no surfaces to sample.");
			let r = typeof n == "string" ? n : JSON.stringify(n);
			return t.has(r) || t.set(r, e(n)), t.get(r);
		}
	};
}
function xs(e, t) {
	let n = e.surface;
	if (typeof n != "string" && !Ke(n)) throw W(`${t} needs a surface: a geometry id or a geometry record.`);
	return n;
}
function Ss(e, t, n, r) {
	let i = e.read ?? n;
	if (!t.includes(i)) throw W(`${r} read must be one of ${t.join(", ")}.`);
	return i;
}
function Cs(e, t, n, r, i) {
	let a = e.at === void 0 ? i() : Ue(e.at, t, n + 1);
	if (a.kind !== "vector") throw W(`${r} "at" needs a vector.`);
	return a.parts;
}
function ws(e, t, n) {
	let r = n ?? 0, i = {
		index: -1,
		found: null
	}, a = (e) => (i.index !== e && (i.found = t(e), i.index = e), i.found);
	if (!_s.has(e)) return A((t) => {
		let n = a(t);
		return e === "hit" ? +!!n : n ? n.distance : r;
	});
	let o = (t) => (n) => {
		let i = a(n);
		return i ? i[e][t] : r;
	};
	return Ve(o(0), o(1), o(2));
}
function Ts(e, t) {
	let { budget: n } = ks(e.context), r = t(n.remaining);
	if (n.remaining -= r.triangleTests, n.remaining <= 0) throw RangeError("Field expression searched too many surface triangles. Use fewer elements or a simpler surface.");
	return r.hit;
}
function Es(e, t, n, r) {
	let i = e.nearest;
	if (!Ke(i)) throw W("nearest takes { surface, at, read }.");
	ys(i, [
		"surface",
		"at",
		"read"
	], "nearest");
	let a = xs(i, "nearest"), o = Ss(i, hs, "distance", "nearest"), [s, c, l] = Cs(i, t, n, "nearest", r), u = ks(t.context);
	if (!u) return _s.has(o) ? Ve(() => 0, () => 0, () => 0) : Ge(0);
	let d = u.indexOf(a);
	return ws(o, (e) => Ts(t, (t) => d.nearest([
		s(e),
		c(e),
		l(e)
	], { maxTriangleTests: t })), 0);
}
function Ds(e, t, n, r) {
	let i = e.raycast;
	if (!Ke(i)) throw W("raycast takes { surface, at, direction, read, miss }.");
	ys(i, [
		"surface",
		"at",
		"direction",
		"read",
		"miss",
		"maxDistance"
	], "raycast");
	let a = xs(i, "raycast"), o = Ss(i, gs, "hit", "raycast"), s = i.direction;
	if (!Array.isArray(s) || s.length !== 3 || !s.every(We) || s.every((e) => e === 0)) throw W("raycast direction needs three numbers, not all 0.");
	if (i.miss !== void 0 && !We(i.miss)) throw W("raycast miss must be a number.");
	if (i.maxDistance !== void 0 && !(We(i.maxDistance) && i.maxDistance > 0)) throw W("raycast maxDistance must be above 0.");
	let [c, l, u] = Cs(i, t, n, "raycast", r), d = ks(t.context);
	if (!d) return _s.has(o) ? Ve(() => 0, () => 0, () => 0) : Ge(0);
	let f = d.indexOf(a), p = i.maxDistance ?? Infinity;
	return ws(o, (e) => Ts(t, (t) => f.project({
		origin: [
			c(e),
			l(e),
			u(e)
		],
		direction: s,
		maxDistance: p,
		maxTriangleTests: t
	})), i.miss);
}
var Os = /* @__PURE__ */ new WeakMap();
function ks(e) {
	return e.loadSurface ? (Os.has(e) || Os.set(e, bs(e.loadSurface)), Os.get(e)) : null;
}
T("nearest", Es), T("raycast", Ds);
// src/field-rotation.js
var G = Object.freeze([
	0,
	1,
	0
]), As = 1 - 1e-9;
function js(e) {
	let t = Math.hypot(e[0], e[1], e[2]);
	return t === 0 ? [
		0,
		0,
		0
	] : [
		e[0] / t,
		e[1] / t,
		e[2] / t
	];
}
function Ms(e, t, n) {
	let r = js(t);
	if (r[0] === 0 && r[1] === 0 && r[2] === 0) return [...e];
	let i = Math.cos(n), a = Math.sin(n), o = r[0] * e[0] + r[1] * e[1] + r[2] * e[2], s = [
		r[1] * e[2] - r[2] * e[1],
		r[2] * e[0] - r[0] * e[2],
		r[0] * e[1] - r[1] * e[0]
	];
	return e.map((e, t) => e * i + s[t] * a + r[t] * o * (1 - i));
}
function Ns([e, t, n]) {
	let [r, i, a, o, s, c] = [
		Math.sin(e),
		Math.cos(e),
		Math.sin(t),
		Math.cos(t),
		Math.sin(n),
		Math.cos(n)
	];
	return [
		c * o,
		c * a * r - s * i,
		c * a * i + s * r,
		s * o,
		s * a * r + c * i,
		s * a * i - c * r,
		-a,
		o * r,
		o * i
	];
}
function Ps(e) {
	let t = js(e), n = t[1];
	if (t[0] === 0 && t[1] === 0 && t[2] === 0) return [
		0,
		0,
		0
	];
	let r = [
		G[1] * t[2] - G[2] * t[1],
		G[2] * t[0] - G[0] * t[2],
		G[0] * t[1] - G[1] * t[0]
	];
	n <= -.999999999999 && (r = [
		1,
		0,
		0
	]);
	let i = Math.acos(Math.min(1, Math.max(-1, n))), a = [
		[
			1,
			0,
			0
		],
		[
			0,
			1,
			0
		],
		[
			0,
			0,
			1
		]
	].map((e) => Ms(e, r, i)), o = (e, t) => a[t][e];
	return Math.abs(o(2, 0)) >= As ? [
		Math.atan2(-o(1, 2), o(1, 1)),
		Math.asin(Math.max(-1, Math.min(1, -o(2, 0)))),
		0
	] : [
		Math.atan2(o(2, 1), o(2, 2)),
		Math.asin(-o(2, 0)),
		Math.atan2(o(1, 0), o(0, 0))
	];
}
function Fs(e, t) {
	if (e.kind !== "vector") throw TypeError(`${t} needs a vector.`);
	return e.parts;
}
function Is(e) {
	let t = -1, n = null;
	return (r) => (i) => (i !== t && (n = e(i), t = i), n[r]);
}
function Ls(e, t) {
	return [
		e[0](t),
		e[1](t),
		e[2](t)
	];
}
function Rs([e, t, n]) {
	let r = Fs(e, "rotate"), i = Fs(t, "rotate"), a = qe(n, "rotate"), o = Is((e) => Ms(Ls(r, e), Ls(i, e), a(e)));
	return Ve(o(0), o(1), o(2));
}
function zs([e]) {
	let t = Fs(e, "align"), n = Is((e) => Ps(Ls(t, e)));
	return Ve(n(0), n(1), n(2));
}
function Bs([e, t, n, r]) {
	let i = Fs(e, "transform"), a = t === void 0 ? null : He(t), o = n === void 0 ? null : Fs(n, "transform"), s = r === void 0 ? null : He(r), c = Is((e) => {
		let t = Ls(i, e).map((t, n) => s ? t * s[n](e) : t), n = o ? Ns(Ls(o, e)) : null;
		return (n ? [
			0,
			1,
			2
		].map((e) => n[e * 3] * t[0] + n[e * 3 + 1] * t[1] + n[e * 3 + 2] * t[2]) : t).map((t, n) => a ? t + a[n](e) : t);
	});
	return Ve(c(0), c(1), c(2));
}
var Vs = Object.freeze({
	rotate: {
		min: 3,
		max: 3,
		build: Rs
	},
	align: {
		min: 1,
		max: 1,
		build: zs
	},
	transform: {
		min: 1,
		max: 4,
		build: Bs
	}
});
for (let [e, t] of Object.entries(Vs)) u(e, t);
// src/field-mesh-inputs.js
var Hs = 32, Us = Object.freeze([
	"min",
	"max",
	"mean",
	"sum",
	"range"
]), Ws = Object.freeze(["edges", "faces"]);
function K(e) {
	return /* @__PURE__ */ TypeError(`Field expression: ${e}`);
}
function Gs(e, t, n) {
	for (let r of Object.keys(e)) if (!t.includes(r)) throw K(`${n} does not take ${JSON.stringify(r.slice(0, 24))}; fields: ${t.join(", ") || "none"}.`);
}
function q(e, t, n) {
	let r = e[t];
	if (!Ke(r)) throw K(`${t} takes an object${n.length ? ` { ${n.join(", ")} }` : ", written {}"}.`);
	return Gs(r, n, t), r;
}
var Ks = /* @__PURE__ */ new WeakMap();
function qs(e) {
	return e.sort((e, t) => e - t), e.filter((t, n) => n === 0 || t !== e[n - 1]);
}
function Js(e) {
	let { vertexCount: t, faceCount: n, faceOffsets: r, cornerVertices: i } = e, a = /* @__PURE__ */ new Map(), o = [], s = [], c = new Int32Array(i.length).fill(-1);
	for (let e = 0; e < n; e++) {
		let n = r[e], l = r[e + 1];
		for (let r = n; r < l; r++) {
			let u = i[r], d = i[r + 1 < l ? r + 1 : n];
			if (u === d) continue;
			let f = Math.min(u, d) * t + Math.max(u, d), p = a.get(f);
			p === void 0 && (p = o.length, a.set(f, p), o.push([u, d]), s.push([])), c[r] = p;
			let m = s[p];
			m[m.length - 1] !== e && m.push(e);
		}
	}
	return {
		edgeEnds: o,
		edgeFaces: s,
		cornerEdges: c
	};
}
function Ys(e, t) {
	let n = Array.from({ length: e.vertexCount }, () => []);
	for (let [e, r] of t) n[e].push(r), n[r].push(e);
	return n;
}
function Xs(e, t) {
	let n = Array.from({ length: e.faceCount }, () => []);
	for (let e of t) for (let t = 1; t < e.length; t++) n[e[t - 1]].push(e[t]), n[e[t]].push(e[t - 1]);
	return n.map(qs);
}
function Zs(e) {
	let t = new Float64Array(e.vertexCount), n = new Int32Array(e.vertexCount).fill(-1);
	for (let r = 0; r < e.faceCount; r++) for (let i = e.faceOffsets[r]; i < e.faceOffsets[r + 1]; i++) {
		let a = e.cornerVertices[i];
		n[a] !== r && (n[a] = r, t[a]++);
	}
	return t;
}
function Qs(e, t) {
	let { normals: n } = m(e), r = new Float64Array(e.vertexCount), i = new Float64Array(t.edgeEnds.length);
	t.edgeFaces.forEach((e, a) => {
		if (e.length !== 2) return;
		let [o, s] = e, c = n[o * 3] * n[s * 3] + n[o * 3 + 1] * n[s * 3 + 1] + n[o * 3 + 2] * n[s * 3 + 2], l = Math.acos(Math.min(1, Math.max(-1, c)));
		i[a] = l;
		for (let e of t.edgeEnds[a]) r[e] = Math.max(r[e], l);
	});
	let a = new Float64Array(e.faceCount);
	for (let n = 0; n < e.faceCount; n++) for (let r = e.faceOffsets[n]; r < e.faceOffsets[n + 1]; r++) {
		let e = t.cornerEdges[r];
		e >= 0 && (a[n] = Math.max(a[n], i[e]));
	}
	return {
		point: r,
		face: a
	};
}
function $s(e, t) {
	let n = t;
	for (; e[n] !== n;) n = e[n];
	let r = t;
	for (; e[r] !== n;) {
		let t = e[r];
		e[r] = n, r = t;
	}
	return n;
}
function ec(e) {
	let t = Uint32Array.from({ length: e.vertexCount }, (e, t) => t);
	for (let n = 0; n < e.faceCount; n++) {
		let r = e.faceOffsets[n], i = e.faceOffsets[n + 1];
		for (let n = r; n < i; n++) {
			let a = $s(t, e.cornerVertices[n]), o = $s(t, e.cornerVertices[n + 1 < i ? n + 1 : r]);
			a !== o && (t[Math.max(a, o)] = Math.min(a, o));
		}
	}
	return tc(e, t);
}
function tc(e, t) {
	let n = /* @__PURE__ */ new Map(), r = new Float64Array(e.vertexCount);
	for (let i = 0; i < e.vertexCount; i++) {
		let e = $s(t, i);
		n.has(e) || n.set(e, n.size), r[i] = n.get(e);
	}
	let i = new Float64Array(e.faceCount);
	for (let t = 0; t < e.faceCount; t++) i[t] = r[e.cornerVertices[e.faceOffsets[t]]];
	return {
		point: r,
		face: i
	};
}
function nc(e) {
	if (!Ks.has(e)) {
		let t = Js(e);
		t.pointNeighbors = Ys(e, t.edgeEnds), t.faceNeighbors = Xs(e, t.edgeFaces), Ks.set(e, t);
	}
	return Ks.get(e);
}
function rc(e, t) {
	if (e.validationOnly) return null;
	if (!e.mesh) throw K(`${t} reads the faces and edges of a mesh, which a point set does not have. Use it in a mesh edit, a face selection or an instance rule over a mesh.`);
	return e;
}
function ic(e, t) {
	let { areas: n } = m(e);
	if (t === "face") return n;
	let r = new Float64Array(e.vertexCount), i = Zs(e);
	for (let t = 0; t < e.faceCount; t++) for (let i = e.faceOffsets[t]; i < e.faceOffsets[t + 1]; i++) r[e.cornerVertices[i]] += n[t];
	return r.map((e, t) => i[t] ? e / i[t] : 0);
}
function ac(e, t, n) {
	let r = nc(e);
	return t === "point" ? n === "edges" ? Float64Array.from(r.pointNeighbors, (e) => e.length) : Zs(e) : n === "faces" ? Float64Array.from(r.faceNeighbors, (e) => e.length) : Float64Array.from({ length: e.faceCount }, (t, n) => e.faceOffsets[n + 1] - e.faceOffsets[n]);
}
function oc(e, t, n) {
	return (r, i) => {
		let a = q(r, e, t), o = rc(i.context, e);
		if (!o) return Ge(0);
		let s = n(o.mesh, o.domain, a);
		return A((e) => s[e]);
	};
}
function sc(e, t) {
	let n = q(e, "neighbors", ["read"]).read ?? "edges";
	if (!Ws.includes(n)) throw K(`neighbors read must be one of ${Ws.join(", ")}.`);
	let r = rc(t.context, "neighbors");
	if (!r) return Ge(0);
	let i = ac(r.mesh, r.domain, n);
	return A((e) => i[e]);
}
function cc(e, t) {
	if (e.count > 25e4) throw RangeError(`Field expression: ${e.count} elements is over the limit of ${Me}, so ${t} cannot run. Select fewer elements.`);
	return e.count;
}
function J(e, t, n, r, i, { optional: a = !1 } = {}) {
	if (e[t] === void 0) {
		if (a) return null;
		throw K(`${i} needs "${t}": a number expression, such as {"attr":"index"}.`);
	}
	let o = Ue(e[t], n, r + 1);
	if (o.kind !== "scalar") throw K(`${i} "${t}" needs a number, not a vector; read one component with x, y or z.`);
	let s = cc(n.context, i), c = new Float64Array(s);
	for (let e = 0; e < s; e++) {
		let t = o.evaluate(e);
		c[e] = Number.isFinite(t) ? t : 0;
	}
	return c;
}
function lc(e, t) {
	return e ? Array.from({ length: t }, (t, n) => Math.round(e[n])) : Array(t).fill(0);
}
function uc(e, t, n) {
	let r = q(e, "accumulate", ["value", "group"]), i = J(r, "value", t, n, "accumulate"), a = lc(J(r, "group", t, n, "accumulate", { optional: !0 }), i.length), o = /* @__PURE__ */ new Map(), s = new Float64Array(i.length);
	for (let e = 0; e < i.length; e++) {
		let t = (o.get(a[e]) ?? 0) + i[e];
		o.set(a[e], t), s[e] = t;
	}
	return A((e) => s[e]);
}
function dc(e, t) {
	return e === "mean" ? t.sum / t.count : e === "range" ? t.max - t.min : t[e];
}
function fc(e, t, n) {
	let r = q(e, "statistic", [
		"value",
		"mode",
		"group"
	]), i = r.mode ?? "mean";
	if (!Us.includes(i)) throw K(`statistic mode must be one of ${Us.join(", ")}.`);
	let a = J(r, "value", t, n, "statistic"), o = lc(J(r, "group", t, n, "statistic", { optional: !0 }), a.length), s = /* @__PURE__ */ new Map();
	for (let e = 0; e < a.length; e++) {
		let t = s.get(o[e]) ?? {
			min: Infinity,
			max: -Infinity,
			sum: 0,
			count: 0
		};
		t.min = Math.min(t.min, a[e]), t.max = Math.max(t.max, a[e]), t.sum += a[e], t.count++, s.set(o[e], t);
	}
	let c = Float64Array.from(o, (e) => dc(i, s.get(e)));
	return A((e) => c[e]);
}
function pc(e, t, n) {
	let r = q(e, "blur", [
		"value",
		"iterations",
		"weight"
	]), i = r.iterations ?? 1;
	if (!Number.isInteger(i) || i < 1 || i > Hs) throw K(`blur iterations must be an integer from 1 to ${Hs}.`);
	let a = r.weight ?? 1;
	if (typeof a != "number" || !(a >= 0 && a <= 1)) throw K("blur weight must be a number from 0 to 1.");
	let o = J(r, "value", t, n, "blur"), s = rc(t.context, "blur");
	if (!s) return Ge(0);
	let c = nc(s.mesh), l = s.domain === "point" ? c.pointNeighbors : c.faceNeighbors;
	for (let e = 0; e < i; e++) {
		let e = new Float64Array(o.length);
		for (let t = 0; t < o.length; t++) {
			let n = l[t], r = 0;
			for (let e of n) r += o[e];
			e[t] = n.length ? o[t] + (r / n.length - o[t]) * a : o[t];
		}
		o = e;
	}
	let u = o;
	return A((e) => u[e]);
}
function mc(e, t, n) {
	let r = q(e, "sampleIndex", ["value", "index"]), i = J(r, "value", t, n, "sampleIndex"), a = J(r, "index", t, n, "sampleIndex"), o = i.length - 1;
	return A((e) => o < 0 ? 0 : i[Math.min(o, Math.max(0, Math.round(a[e])))]);
}
function hc(e, t, n) {
	let r = q(e, "rank", ["value", "descending"]);
	if (r.descending !== void 0 && typeof r.descending != "boolean") throw K("rank descending must be true or false.");
	let i = J(r, "value", t, n, "rank"), a = r.descending ? -1 : 1, o = Array.from({ length: i.length }, (e, t) => t);
	o.sort((e, t) => a * (i[e] - i[t]) || e - t);
	let s = new Float64Array(i.length);
	return o.forEach((e, t) => {
		s[e] = t;
	}), A((e) => s[e]);
}
T("faceArea", oc("faceArea", [], ic)), T("edgeAngle", oc("edgeAngle", [], (e, t) => Qs(e, nc(e))[t])), T("island", oc("island", [], (e, t) => ec(e)[t])), T("neighbors", sc), T("accumulate", uc), T("statistic", fc), T("blur", pc), T("sampleIndex", mc), T("rank", hc);
// src/mesh-hull-modifiers.js
var gc = 8192, _c = 1e-9, vc = Object.freeze([
	[
		0,
		4,
		6,
		2
	],
	[
		1,
		3,
		7,
		5
	],
	[
		0,
		1,
		5,
		4
	],
	[
		2,
		6,
		7,
		3
	],
	[
		0,
		2,
		3,
		1
	],
	[
		4,
		5,
		7,
		6
	]
]);
function yc(e) {
	let t = [
		Infinity,
		Infinity,
		Infinity
	], n = [
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let r = 0; r < e.vertexCount; r++) for (let i = 0; i < 3; i++) {
		let a = e.positions[r * 3 + i];
		a < t[i] && (t[i] = a), a > n[i] && (n[i] = a);
	}
	let r = /* @__PURE__ */ new Float32Array(24);
	for (let e = 0; e < 8; e++) for (let i = 0; i < 3; i++) r[e * 3 + i] = e >> i & 1 ? n[i] : t[i];
	let i = Uint32Array.from({ length: 7 }, (e, t) => t * 4);
	return w({
		positions: r,
		faceOffsets: i,
		cornerVertices: Uint32Array.from(vc.flat())
	});
}
function Y(e, t) {
	return [
		e[t * 3],
		e[t * 3 + 1],
		e[t * 3 + 2]
	];
}
function X(e, t) {
	return [
		e[0] - t[0],
		e[1] - t[1],
		e[2] - t[2]
	];
}
function bc(e, t) {
	return [
		e[1] * t[2] - e[2] * t[1],
		e[2] * t[0] - e[0] * t[2],
		e[0] * t[1] - e[1] * t[0]
	];
}
function xc(e, t) {
	return e[0] * t[0] + e[1] * t[1] + e[2] * t[2];
}
function Sc(e, t, n, r) {
	let i = Y(e, t), a = bc(X(Y(e, n), i), X(Y(e, r), i)), o = Math.hypot(a[0], a[1], a[2]) || 1, s = [
		a[0] / o,
		a[1] / o,
		a[2] / o
	];
	return {
		corners: [
			t,
			n,
			r
		],
		normal: s,
		offset: xc(s, i),
		alive: !0
	};
}
function Cc(e, t) {
	return xc(e.normal, t) - e.offset;
}
function wc(e, t, n) {
	let r = [0, 0];
	for (let n = 1; n < t; n++) e[n * 3] < e[r[0] * 3] && (r[0] = n), e[n * 3] > e[r[1] * 3] && (r[1] = n);
	let i = r[0], a = r[1];
	(i === a || Math.hypot(...X(Y(e, i), Y(e, a))) <= n) && (a = Array.from({ length: t }, (e, t) => t).reduce((t, n) => Math.hypot(...X(Y(e, n), Y(e, i))) > Math.hypot(...X(Y(e, t), Y(e, i))) ? n : t, i));
	let o = X(Y(e, a), Y(e, i)), s = -1, c = n;
	for (let n = 0; n < t; n++) {
		let t = Math.hypot(...bc(o, X(Y(e, n), Y(e, i))));
		t > c && (c = t, s = n);
	}
	if (s < 0) throw RangeError("convex_hull needs vertices that do not all lie on one line.");
	let l = bc(o, X(Y(e, s), Y(e, i))), u = -1, d = n * Math.hypot(...l);
	for (let n = 0; n < t; n++) {
		let t = Math.abs(xc(l, X(Y(e, n), Y(e, i))));
		t > d && (d = t, u = n);
	}
	if (u < 0) throw RangeError("convex_hull needs vertices that do not all lie in one plane.");
	return [
		i,
		a,
		s,
		u
	];
}
function Tc(e) {
	if (e.vertexCount > 8192) throw RangeError(`convex_hull takes at most ${gc} vertices and the mesh has ${e.vertexCount}. Decimate or weld first.`);
	let { positions: t } = e, n = e.vertexCount, r = yc(e).positions, i = Math.hypot(r[21] - r[0], r[22] - r[1], r[23] - r[2]) * _c, [a, o, s, c] = wc(t, n, i), l = [
		0,
		1,
		2
	].map((e) => (t[a * 3 + e] + t[o * 3 + e] + t[s * 3 + e] + t[c * 3 + e]) / 4), u = [];
	for (let [e, n, r] of [
		[
			a,
			o,
			s
		],
		[
			a,
			o,
			c
		],
		[
			a,
			s,
			c
		],
		[
			o,
			s,
			c
		]
	]) {
		let i = Sc(t, e, n, r);
		Cc(i, l) > 0 && (i.corners = [
			e,
			r,
			n
		], i.normal = i.normal.map((e) => -e), i.offset = -i.offset), u.push(i);
	}
	let d = /* @__PURE__ */ new Set([
		a,
		o,
		s,
		c
	]);
	for (let e = 0; e < n; e++) {
		if (d.has(e)) continue;
		let n = Y(t, e), r = u.filter((e) => e.alive && Cc(e, n) > i);
		if (r.length === 0) continue;
		let a = /* @__PURE__ */ new Map();
		for (let e of r) {
			e.alive = !1;
			for (let t = 0; t < 3; t++) a.set(`${e.corners[t]}:${e.corners[(t + 1) % 3]}`, [e.corners[t], e.corners[(t + 1) % 3]]);
		}
		for (let [n, r] of a.values()) a.has(`${r}:${n}`) || u.push(Sc(t, n, r, e));
	}
	let f = u.filter((e) => e.alive), p = /* @__PURE__ */ new Map(), m = [], h = [];
	for (let e of f) for (let n of e.corners) p.has(n) || (p.set(n, p.size), m.push(...Y(t, n))), h.push(p.get(n));
	let g = Uint32Array.from({ length: f.length + 1 }, (e, t) => t * 3);
	return w({
		positions: Float32Array.from(m),
		faceOffsets: g,
		cornerVertices: Uint32Array.from(h)
	});
}
var Ec = Object.freeze({
	bounding_box: (e) => ({
		mesh: yc(e),
		result: {}
	}),
	convex_hull: (e) => {
		let t = Tc(e);
		return {
			mesh: t,
			result: { hullVertices: t.vertexCount }
		};
	}
});
for (let [e, t] of Object.entries(Ec)) ss(e, t);
var Dc = 5e7, Oc = 9.81, kc = .21, Ac = .75, jc = 40, Mc = 41, Nc = 42, Pc = Object.freeze({
	x: 0,
	y: 1,
	z: 2
}), Fc = 2147483647;
function Ic(e, t, n) {
	let r = n * n / Oc, i = r / 1e3;
	return Math.exp(-1 / (e * r) ** 2) / e ** 4 * t * t * Math.exp(-((e * i) ** 2));
}
function Lc(e, n) {
	return Math.sqrt(-2 * Math.log(Math.max(t(e, jc, n), 1e-12))) * Math.cos(2 * Math.PI * t(e, Mc, n));
}
function Rc({ windSpeed: e, direction: n, size: r, seed: i, resolution: a }) {
	let o = Math.cos(n * Math.PI / 180), s = Math.sin(n * Math.PI / 180), c = [], l = 0, u = 2 * Math.PI / r;
	for (let n = -a; n <= a; n++) for (let r = -a; r <= a; r++) {
		if (n === 0 && r === 0) continue;
		let a = r * u, d = n * u, f = Math.hypot(a, d), p = (a * o + d * s) / f, m = Math.sqrt(Ic(f, p, e)) * Lc(c.length, i);
		l += m * m / 2, c.push({
			waveX: a,
			waveZ: d,
			waveNumber: f,
			amplitude: m,
			phase: t(c.length, Nc, i) * 2 * Math.PI,
			frequency: Math.sqrt(Oc * f)
		});
	}
	let d = kc * e * e / Oc / 4, f = l > 0 ? d / Math.sqrt(l) : 0;
	for (let e of c) e.amplitude *= f;
	return c;
}
function zc(e, t, n, r, i) {
	let a = 0, o = 0, s = 0, c = 0, l = 0, u = 0;
	for (let d of e) {
		let e = d.waveX * t + d.waveZ * n - d.frequency * r + d.phase, f = Math.sin(e), p = Math.cos(e), m = d.waveX / d.waveNumber, h = d.waveZ / d.waveNumber;
		a += d.amplitude * p, o -= i * m * d.amplitude * f, s -= i * h * d.amplitude * f;
		let g = i * d.amplitude * d.waveNumber * p;
		c -= m * m * g, l -= h * h * g, u -= m * h * g;
	}
	let d = (1 + c) * (1 + l) - u * u, f = Math.min(1, Math.max(0, (Ac - d) / .5));
	return {
		height: a,
		moveX: o,
		moveZ: s,
		foam: f
	};
}
function Bc(e, { axis: t, windSpeed: n, direction: r, choppiness: i, size: a, seed: o, time: s, resolution: c }) {
	let l = Rc({
		windSpeed: n,
		direction: r,
		size: a,
		seed: o,
		resolution: c
	});
	if (l.length * e.vertexCount > 5e7) throw RangeError(`ocean would make ${l.length * e.vertexCount} wave evaluations, over the limit of ${Dc}. Lower resolution or use a coarser grid.`);
	let u = Pc[t], d = (u + 1) % 3, f = (u + 2) % 3, p = new Float32Array(e.positions), m = new Float32Array(e.vertexCount);
	for (let t = 0; t < e.vertexCount; t++) {
		let e = zc(l, p[t * 3 + d], p[t * 3 + f], s, i);
		p[t * 3 + u] += e.height, p[t * 3 + d] += e.moveX, p[t * 3 + f] += e.moveZ, m[t] = e.foam;
	}
	let h = {
		...e.attributes,
		point: {
			...e.attributes.point,
			[`${ne}foam`]: {
				data: m,
				size: 1
			}
		}
	};
	return w({
		positions: p,
		faceOffsets: e.faceOffsets,
		cornerVertices: e.cornerVertices,
		edgeVertices: e.edgeVertices,
		cornerEdges: e.cornerEdges,
		attributes: h
	});
}
function Vc(e, t, n, { finiteNumber: r, integerInRange: i }) {
	if (t.axis = e.axis ?? "y", !Object.hasOwn(Pc, t.axis)) throw TypeError(`Mesh edit ${n} (axis must be x, y or z)`);
	t.windSpeed = e.windSpeed === void 0 ? 10 : r(e.windSpeed, n, "windSpeed", {
		minimum: 0,
		maximum: 60,
		exclusiveMinimum: !0
	}), t.direction = e.direction === void 0 ? 0 : r(e.direction, n, "direction", {
		minimum: -3600,
		maximum: 3600
	}), t.choppiness = e.choppiness === void 0 ? 1 : r(e.choppiness, n, "choppiness", {
		minimum: 0,
		maximum: 4
	}), t.size = e.size === void 0 ? 100 : r(e.size, n, "size", {
		minimum: 1,
		maximum: 1e4
	}), t.seed = e.seed === void 0 ? 0 : i(e.seed, n, "seed", 0, Fc), t.time = e.time === void 0 ? 0 : r(e.time, n, "time", {
		minimum: -1e6,
		maximum: 1e6
	}), t.resolution = e.resolution === void 0 ? 8 : i(e.resolution, n, "resolution", 1, 16);
}
os("ocean", Vc), ss("ocean", (e, t) => ({
	mesh: Bc(e, t),
	result: {}
}));
// src/mesh-build-modifier.js
var Hc = Object.freeze([
	"index",
	"random",
	"axis"
]), Uc = 1e6, Wc = 2147483647, Gc = Object.freeze({
	x: 0,
	y: 1,
	z: 2
}), Kc = 71;
function qc(e, { order: n, axis: r, seed: i }) {
	let a = Array.from({ length: e.faceCount }, (e, t) => t);
	if (n === "index") return a;
	let s = new Float64Array(e.faceCount);
	if (n === "random") for (let e of a) s[e] = t(e, Kc, i);
	else {
		let t = o(e);
		for (let e of a) s[e] = t[e * 3 + Gc[r]];
	}
	return a.sort((e, t) => s[e] - s[t] || e - t);
}
function Jc(e, { frame: t, start: n, length: r, reverse: i }) {
	let a = Math.min(1, Math.max(0, (t - n) / r));
	return Math.floor((i ? 1 - a : a) * e + 1e-9);
}
function Yc(e, t) {
	let [n, r, i] = e.positions;
	return t.addFace([
		t.addVertex(n, r, i),
		t.addVertex(n, r, i),
		t.addVertex(n, r, i)
	]), t.build();
}
function Xc(e, t) {
	let n = Jc(e.faceCount, t);
	if (n >= e.faceCount) return e;
	let r = new D(e);
	if (n === 0) return Yc(e, r);
	let i = /* @__PURE__ */ new Map();
	for (let a of qc(e, t).slice(0, n).sort((e, t) => e - t)) {
		let t = [];
		for (let n = e.faceOffsets[a]; n < e.faceOffsets[a + 1]; n++) t.push(n);
		let n = t.map((t) => {
			let n = e.cornerVertices[t];
			return i.has(n) || i.set(n, r.addVertex(e.positions[n * 3], e.positions[n * 3 + 1], e.positions[n * 3 + 2])), i.get(n);
		});
		r.addFace(n, {
			sourceFace: a,
			sourceCorners: t,
			sourceEdges: t.map((t) => e.cornerEdges[t])
		});
	}
	return r.build();
}
function Zc(e, t, n, { finiteNumber: r, integerInRange: i }) {
	if (t.order = e.order ?? "index", !Hc.includes(t.order)) throw N(n, "order", e.order, `one of ${Hc.join(", ")}, such as "random" with a seed`);
	if (t.frame = e.frame === void 0 ? 0 : r(e.frame, n, "frame", {
		minimum: -1e6,
		maximum: Uc
	}), t.start = e.start === void 0 ? 0 : r(e.start, n, "start", {
		minimum: -1e6,
		maximum: Uc
	}), t.length = e.length === void 0 ? 60 : r(e.length, n, "length", {
		minimum: 0,
		maximum: Uc,
		exclusiveMinimum: !0
	}), t.reverse = F(e.reverse, n, "reverse") ?? !1, t.order === "random") t.seed = e.seed === void 0 ? 0 : i(e.seed, n, "seed", 0, Wc);
	else if (e.seed !== void 0) throw N(n, "seed", e.seed, "left out, because only order \"random\" uses a seed");
	if (t.order === "axis") {
		if (t.axis = e.axis ?? "y", !Object.hasOwn(Gc, t.axis)) throw N(n, "axis", e.axis, "one of \"x\", \"y\", \"z\"");
	} else if (e.axis !== void 0) throw N(n, "axis", e.axis, "left out, because only order \"axis\" uses an axis");
}
os("build", Zc), ss("build", (e, t) => {
	let n = Xc(e, t);
	return {
		mesh: n,
		result: {
			visibleFaces: n === e ? e.faceCount : Jc(e.faceCount, t),
			totalFaces: e.faceCount
		}
	};
});
// src/mesh-remesh.js
var Qc = 192, $c = 4194304, el = 2, tl = 3;
function nl(e) {
	let t = s(e);
	for (let n = 0; n < e.edgeCount; n++) if (t.edgeOffsets[n + 1] - t.edgeOffsets[n] !== 2) throw RangeError("remesh needs a closed surface: every edge must join exactly two faces. Run fill_holes first.");
}
function rl(e, { voxelSize: t, resolution: n }) {
	let r = he(e), i = r.max.map((e, t) => e - r.min[t]), a = Math.max(...i);
	if (t === void 0 == (n === void 0)) throw RangeError("remesh takes either voxelSize or resolution.");
	let o = t ?? a / n;
	if (!(o > 0) || !(a > 0)) throw RangeError("remesh needs a positive voxel size and a mesh with volume.");
	let s = i.map((e) => Math.ceil(e / o) + 1 + 6), c = s.reduce((e, t) => e * (t - 1), 1);
	if (a / o > 192 || c > 4194304) throw RangeError(`remesh would use ${c} cells and ${Math.ceil(a / o)} along the longest side, over the limits of ${$c} cells and 192 per side. Use a larger voxelSize or a lower resolution.`);
	return {
		bounds: r,
		edge: o,
		points: s,
		cells: c
	};
}
function il(e, t) {
	let { positions: n, indices: r } = e, [i, a, o] = t.points, s = new Uint8Array(i * a * o), c = [
		0,
		0,
		0
	], l = [
		0,
		0,
		0
	];
	for (let e = 0; e < r.length / 3; e++) {
		for (let i = 0; i < 3; i++) {
			let a = [
				0,
				1,
				2
			].map((t) => n[r[e * 3 + t] * 3 + i]), o = t.bounds.min[i] - tl * t.edge;
			c[i] = Math.max(0, Math.floor((Math.min(...a) - o) / t.edge) - el), l[i] = Math.min(t.points[i] - 1, Math.ceil((Math.max(...a) - o) / t.edge) + el);
		}
		for (let e = c[2]; e <= l[2]; e++) for (let t = c[1]; t <= l[1]; t++) {
			let n = (e * a + t) * i;
			s.fill(1, n + c[0], n + l[0] + 1);
		}
	}
	return s;
}
function al(e, t) {
	let [n, r, i] = t, a = new Uint8Array(e.length), o = [0];
	a[0] = 1;
	let s = [
		1,
		n,
		n * r
	];
	for (; o.length;) {
		let t = o.pop(), c = [
			t % n,
			Math.floor(t / n) % r,
			Math.floor(t / (n * r))
		];
		for (let l = 0; l < 3; l++) for (let u of [-1, 1]) {
			let d = c[l] + u;
			if (d < 0 || d >= [
				n,
				r,
				i
			][l]) continue;
			let f = t + u * s[l];
			e[f] || a[f] || (a[f] = 1, o.push(f));
		}
	}
	return a;
}
function ol(e, t, n) {
	let [r, i] = n.points, a = il(t, n), o = al(a, n.points), s = new Float32Array(a.length), c = Ni(e, { signed: !0 }).query, l = 3 * n.edge, u = n.bounds.min.map((e) => e - tl * n.edge), d = [
		0,
		0,
		0
	];
	for (let e = 0; e < a.length; e++) a[e] ? (d[0] = u[0] + e % r * n.edge, d[1] = u[1] + Math.floor(e / r) % i * n.edge, d[2] = u[2] + Math.floor(e / (r * i)) * n.edge, s[e] = c(d).distance) : s[e] = o[e] ? l : -l;
	return {
		distances: s,
		origin: u
	};
}
function sl(e, t) {
	nl(e);
	let n = rl(e, t), { distances: r, origin: i } = ol(e, H(e), n), { cellVertex: a, positions: o } = Ye(r, n, i), s = Je(r, n, a);
	if (!s.length) throw RangeError("remesh found no surface: the voxel size is larger than the mesh.");
	let c = Uint32Array.from({ length: s.length + 1 }, (e, t) => t * 4);
	return {
		mesh: w({
			positions: Float32Array.from(o),
			faceOffsets: c,
			cornerVertices: Uint32Array.from(s.flat())
		}),
		voxelSize: n.edge,
		cells: n.cells
	};
}
// src/mesh-recipe.js
var cl = /^[A-Za-z0-9][A-Za-z0-9._-]{0,47}$/, ll = 1e6;
function Z(e, t, n) {
	return typeof e?.fieldPath == "string" && e.message.startsWith(e.fieldPath) ? (e.message = `edits[${t}].${e.message}`, e.fieldPath = `edits[${t}].${e.fieldPath}`, e) : new e.constructor(`Mesh edit ${t} (${n}): ${e.message}`);
}
function Q(e, t, n, { minimum: r = -1e6, maximum: i = ll, exclusiveMinimum: a = !1 } = {}) {
	if (typeof e != "number" || !Number.isFinite(e) || e < r || e > i || a && e === r) throw N(t, n, e, `a number ${a ? "above" : "from"} ${r}${i < ll ? ` to ${i}` : ""}, such as ${a ? r + 1 : Math.min(Math.max(1, r), i)}`);
	return e;
}
function $(e, t, n) {
	if (!Array.isArray(e) || e.length !== 3) throw N(t, n, e, "an array of three numbers, such as [0, 1, 0]");
	return e.map((e) => Q(e, t, n));
}
function ul(e, t, n, r) {
	try {
		se(e, { kind: r });
	} catch (i) {
		throw N(t, n, e, `a ${r} field expression such as ${r === "vector" ? "[0, 1, 0]" : "0.5"} (${i.message})`);
	}
	return e;
}
function dl(e, t, n) {
	if (t.translation = e.translation === void 0 ? [
		0,
		0,
		0
	] : $(e.translation, n, "translation"), t.scale = e.scale === void 0 ? [
		1,
		1,
		1
	] : $(e.scale, n, "scale"), t.scale.some((e) => e <= 0)) throw N(n, "scale", t.scale, "three numbers above 0, such as [1, 1, 1]");
	if (e.rotation === void 0) {
		t.rotation = [
			0,
			0,
			0,
			1
		];
		return;
	}
	if (!Array.isArray(e.rotation) || e.rotation.length !== 4) throw N(n, "rotation", e.rotation, "an XYZW quaternion of four numbers, such as [0, 0, 0, 1]");
	let r = e.rotation.map((e) => Q(e, n, "rotation")), i = Math.hypot(...r);
	if (i === 0) throw N(n, "rotation", r, "a nonzero XYZW quaternion, such as [0, 0, 0, 1]");
	t.rotation = r.map((e) => e / i);
}
function fl(e, t, n) {
	let r = `strokes[${n}]`;
	if (!e || typeof e != "object" || Array.isArray(e)) throw N(t, r, e, `an object such as { "type": "${Ie[0]}", "center": [0, 0, 0], "radius": 0.5, "strength": 0.2 }`);
	for (let n of Object.keys(e)) if (![
		"type",
		"center",
		"radius",
		"strength",
		"direction"
	].includes(n)) throw N(t, `${r}.${n}`, e[n], `one of the stroke fields type, center, radius, strength, direction; remove "${n}"`);
	if (!Ie.includes(e.type)) throw N(t, `${r}.type`, e.type, `one of ${Ie.join(", ")}`);
	let i = {
		type: e.type,
		center: $(e.center, t, `${r}.center`),
		radius: Q(e.radius, t, `${r}.radius`, {
			minimum: 0,
			exclusiveMinimum: !0
		}),
		strength: Q(e.strength, t, `${r}.strength`)
	};
	if (e.type === "smooth" && (i.strength < 0 || i.strength > 1)) throw N(t, `${r}.strength`, i.strength, "a number from 0 to 1 for a smooth stroke, such as 0.5");
	if (e.type === "displace") {
		if (i.direction = $(e.direction, t, `${r}.direction`), i.direction.every((e) => e === 0)) throw N(t, `${r}.direction`, i.direction, "a nonzero direction, such as [0, 0, 1]");
	} else if (e.direction !== void 0) throw N(t, `${r}.direction`, e.direction, "left out, because only a displace stroke takes direction");
	return i;
}
function pl(e) {
	if (!Array.isArray(e)) throw k("edits", e, "an array of edits, such as [{ \"op\": \"subdivide\", \"levels\": 1 }]", TypeError);
	if (e.length > 64) throw RangeError("A mesh holds at most 64 edits. Apply fewer or start from a new base.");
	return e.map((e, t) => {
		if (!e || typeof e != "object" || Array.isArray(e)) throw k(`edits[${t}]`, e, "an object such as { \"op\": \"subdivide\", \"levels\": 1 }", TypeError);
		let n = Ne[e.op];
		if (!n) throw N(t, "op", e.op, `one of ${Object.keys(Ne).join(", ")}`);
		for (let r of Object.keys(e)) if (r !== "op" && !n.fields.includes(r)) throw N(t, r, e[r], `one of the fields ${e.op} takes: ${n.fields.join(", ")}; remove "${r}"`);
		let r = { op: e.op };
		if (n.fields.includes("select")) {
			if (e.select === void 0 && [
				"delete",
				"tag",
				"dissolve_faces"
			].includes(e.op)) throw N(t, "select", e.select, "a face rule such as { \"all\": true } or { \"tag\": \"top\" }");
			r.select = e.select ?? { all: !0 };
		}
		if (n.fields.includes("name")) {
			let n = e.name ?? (["tag", "vertex_group"].includes(e.op) ? void 0 : `${e.op.split("_")[0]}-${t + 1}`);
			if (typeof n != "string" || !cl.test(n)) throw N(t, "name", n, "1 to 48 letters, digits, dots, dashes or underscores, such as \"lid.cap\"");
			r.name = n;
		}
		switch (e.op) {
			case "extrude_face_region":
			case "extrude_individual":
				if (r.offset = Q(e.offset, t, "offset"), e.direction !== void 0 && (r.direction = $(e.direction, t, "direction")), e.alongNormals !== void 0) {
					if (typeof e.alongNormals != "boolean") throw N(t, "alongNormals", e.alongNormals, "true or false");
					if (e.alongNormals && e.direction !== void 0) throw N(t, "direction", e.direction, "left out when alongNormals is true");
					r.alongNormals = e.alongNormals;
				}
				break;
			case "inset_region":
			case "inset_individual":
				r.thickness = Q(e.thickness, t, "thickness", {
					minimum: 0,
					exclusiveMinimum: !0
				}), r.depth = e.depth === void 0 ? 0 : Q(e.depth, t, "depth");
				break;
			case "translate":
				if (r.offset = $(e.offset, t, "offset"), e.falloff !== void 0) {
					let n = e.falloff;
					if (!n || typeof n != "object") throw N(t, "falloff", n, "an object such as { \"radius\": 1, \"curve\": \"smooth\", \"connected\": false }");
					for (let e of Object.keys(n)) if (![
						"radius",
						"curve",
						"connected"
					].includes(e)) throw N(t, `falloff.${e}`, n[e], `one of the falloff fields radius, curve, connected; remove "${e}"`);
					let i = n.curve ?? "smooth";
					if (!Object.hasOwn(re, i)) throw N(t, "falloff.curve", i, `one of ${Object.keys(re).join(", ")}`);
					if (n.connected !== void 0 && typeof n.connected != "boolean") throw N(t, "falloff.connected", n.connected, "true or false");
					r.falloff = {
						radius: Q(n.radius, t, "falloff.radius", {
							minimum: 0,
							exclusiveMinimum: !0
						}),
						curve: i,
						connected: n.connected ?? !1
					};
				}
				break;
			case "boolean": {
				if (!Vt.includes(e.operation)) throw N(t, "operation", e.operation, `one of ${Vt.join(", ")}`);
				r.operation = e.operation;
				let n = e.cutter && typeof e.cutter == "object" && !Array.isArray(e.cutter), i = n && Object.hasOwn(e.cutter, "geometry");
				if (!n || !i && typeof e.cutter.type != "string") throw N(t, "cutter", e.cutter, "a primitive record such as { \"type\": \"cylinder\", \"segments\": 32 } or a recipe geometry such as { \"geometry\": \"tool\" }");
				r.cutter = e.cutter, dl(e, r, t);
				break;
			}
			case "sculpt":
				if (!Array.isArray(e.strokes) || e.strokes.length < 1 || e.strokes.length > 32) throw N(t, "strokes", e.strokes, `an array of 1 to 32 brush strokes, such as [{ "type": "${Ie[0]}", "center": [0, 0, 0], "radius": 0.5, "strength": 0.2 }]`);
				r.strokes = e.strokes.map((e, n) => fl(e, t, n));
				break;
			case "shrinkwrap":
				if (!e.target || typeof e.target != "object" || Array.isArray(e.target) || typeof e.target.type != "string") throw N(t, "target", e.target, "a primitive record such as { \"type\": \"sphere\", \"radius\": 0.5 }");
				if (r.target = e.target, dl(e, r, t), !Fe.includes(e.mode ?? "nearest")) throw N(t, "mode", e.mode, `one of ${Fe.join(", ")}`);
				if (r.mode = e.mode ?? "nearest", r.mode === "project") {
					if (r.direction = $(e.direction, t, "direction"), r.direction.every((e) => e === 0)) throw N(t, "direction", r.direction, "a nonzero direction, such as [0, -1, 0]");
				} else if (e.direction !== void 0) throw N(t, "direction", e.direction, "left out unless mode is \"project\"");
				if (r.offset = e.offset === void 0 ? 0 : Q(e.offset, t, "offset", { minimum: 0 }), e.maxDistance !== void 0 && (r.maxDistance = Q(e.maxDistance, t, "maxDistance", { minimum: 0 })), !["error", "keep"].includes(e.onMiss ?? "error")) throw N(t, "onMiss", e.onMiss, "\"error\" or \"keep\"");
				r.onMiss = e.onMiss ?? "error";
				break;
			case "mirror":
				if (![
					"x",
					"y",
					"z"
				].includes(e.axis ?? "x")) throw N(t, "axis", e.axis, "\"x\", \"y\" or \"z\"");
				r.axis = e.axis ?? "x", r.merge = e.merge === void 0 ? .001 : Q(e.merge, t, "merge", {
					minimum: 0,
					maximum: 1e3
				});
				break;
			case "array":
				if (!Number.isInteger(e.count ?? 2) || (e.count ?? 2) < 1 || (e.count ?? 2) > 256) throw N(t, "count", e.count, "a whole number from 1 to 256, such as 4");
				r.count = e.count ?? 2, r.offset = e.offset === void 0 ? [
					0,
					0,
					0
				] : $(e.offset, t, "offset"), r.relativeOffset = e.relativeOffset === void 0 ? e.offset === void 0 ? [
					1,
					0,
					0
				] : [
					0,
					0,
					0
				] : $(e.relativeOffset, t, "relativeOffset"), r.merge = e.merge === void 0 ? 0 : Q(e.merge, t, "merge", {
					minimum: 0,
					maximum: 1e3
				});
				break;
			case "solidify":
				if (r.thickness = Q(e.thickness, t, "thickness", {
					minimum: 0,
					exclusiveMinimum: !0
				}), r.offset = e.offset === void 0 ? -1 : Q(e.offset, t, "offset", {
					minimum: -1,
					maximum: 1
				}), e.evenThickness !== void 0 && typeof e.evenThickness != "boolean") throw N(t, "evenThickness", e.evenThickness, "true or false");
				r.evenThickness = e.evenThickness ?? !0;
				break;
			case "bevel":
				if (e.edges !== void 0 && (!e.edges || typeof e.edges != "object" || Array.isArray(e.edges))) throw N(t, "edges", e.edges, "an edge rule such as { \"all\": true }, { \"angle\": 30 }, { \"between\": [faceRule, faceRule] } or { \"boundaryOf\": faceRule }");
				if (r.edges = e.edges ?? { angle: 30 }, r.width = Q(e.width, t, "width", {
					minimum: 0,
					exclusiveMinimum: !0
				}), !Number.isInteger(e.segments ?? 1) || (e.segments ?? 1) < 1 || (e.segments ?? 1) > 16) throw N(t, "segments", e.segments, "a whole number from 1 to 16, such as 3");
				if (r.segments = e.segments ?? 1, r.profile = e.profile === void 0 ? .5 : Q(e.profile, t, "profile", {
					minimum: 0,
					maximum: 1
				}), e.clampOverlap !== void 0 && typeof e.clampOverlap != "boolean") throw N(t, "clampOverlap", e.clampOverlap, "true or false");
				r.clampOverlap = e.clampOverlap ?? !0;
				break;
			case "loop_cut":
				if (!e.edges || typeof e.edges != "object" || Array.isArray(e.edges)) throw N(t, "edges", e.edges, "a rule that picks the ring, such as { \"along\": [0, 1, 0] } for the vertical edges");
				if (r.edges = e.edges, !Number.isInteger(e.cuts ?? 1) || (e.cuts ?? 1) < 1 || (e.cuts ?? 1) > 16) throw N(t, "cuts", e.cuts, "a whole number from 1 to 16, such as 1");
				if (r.cuts = e.cuts ?? 1, e.factor !== void 0 && r.cuts !== 1) throw N(t, "factor", e.factor, "left out when cuts is above 1, because factor applies only to a single cut");
				if (r.factor = e.factor === void 0 ? .5 : Q(e.factor, t, "factor", {
					minimum: 0,
					maximum: 1
				}), r.factor === 0 || r.factor === 1) throw N(t, "factor", r.factor, "a number above 0 and below 1, such as 0.5");
				break;
			case "uv_unwrap":
				if (e.seams !== void 0 && (!e.seams || typeof e.seams != "object" || Array.isArray(e.seams))) throw N(t, "seams", e.seams, "an edge rule such as { \"angle\": 60 } or { \"boundaryOf\": { \"tag\": \"lid.cap\" } }");
				r.seams = e.seams ?? { angle: 60 }, r.margin = e.margin === void 0 ? .01 : Q(e.margin, t, "margin", {
					minimum: 0,
					maximum: .2
				}), r.maxDistortion = e.maxDistortion === void 0 ? .25 : Q(e.maxDistortion, t, "maxDistortion", {
					minimum: 0,
					maximum: 100
				});
				break;
			case "uv_project":
				if (!fi.includes(e.mode)) throw N(t, "mode", e.mode, `one of ${fi.join(", ")}`);
				if (r.mode = e.mode, ![
					"x",
					"y",
					"z"
				].includes(e.axis ?? "y")) throw N(t, "axis", e.axis, "\"x\", \"y\" or \"z\", the cylinder or sphere axis");
				r.axis = e.axis ?? "y", r.pack = e.pack ?? !0, r.margin = e.margin === void 0 ? .01 : Q(e.margin, t, "margin", {
					minimum: 0,
					maximum: .2
				}), r.rotate = e.rotate ?? !0, F(r.pack, t, "pack"), F(r.rotate, t, "rotate");
				break;
			case "uv_pack":
				r.margin = e.margin === void 0 ? .01 : Q(e.margin, t, "margin", {
					minimum: 0,
					maximum: .2
				}), r.rotate = e.rotate ?? !0, F(r.rotate, t, "rotate");
				break;
			case "subdivide":
				if (!Number.isInteger(e.levels ?? 1) || (e.levels ?? 1) < 1 || (e.levels ?? 1) > 4) throw N(t, "levels", e.levels, "a whole number from 1 to 4, such as 1");
				if (r.levels = e.levels ?? 1, e.crease !== void 0) {
					if (!e.crease || typeof e.crease != "object" || Array.isArray(e.crease)) throw N(t, "crease", e.crease, "an edge rule such as { \"angle\": 60 } or { \"between\": [faceRule, faceRule] }");
					r.crease = e.crease, r.sharpness = e.sharpness === void 0 ? 10 : Q(e.sharpness, t, "sharpness", {
						minimum: 0,
						maximum: 10,
						exclusiveMinimum: !0
					});
				} else if (e.sharpness !== void 0) throw N(t, "sharpness", e.sharpness, "left out unless a crease rule is given, such as \"crease\": { \"angle\": 60 }");
				break;
			case "set_position":
				if (e.position === void 0 && e.offset === void 0) throw N(t, "position", void 0, "a vector field expression such as [0, 1, 0], given as position or as offset");
				e.position !== void 0 && (r.position = ul(e.position, t, "position", "vector")), e.offset !== void 0 && (r.offset = ul(e.offset, t, "offset", "vector"));
				break;
			case "displace":
				if (r.field = ul(e.field, t, "field", "scalar"), r.strength = e.strength === void 0 ? 1 : Q(e.strength, t, "strength"), r.midlevel = e.midlevel === void 0 ? .5 : Q(e.midlevel, t, "midlevel"), e.direction !== void 0 && !Oi.includes(e.direction)) throw N(t, "direction", e.direction, `one of ${Oi.join(", ")}`);
				if (r.direction = e.direction ?? "normal", e.group !== void 0) {
					if (typeof e.group != "string" || !cl.test(e.group)) throw N(t, "group", e.group, "1 to 48 letters, digits, dots, dashes or underscores naming a vertex group, such as \"mask\"");
					r.group = e.group;
				}
				break;
			case "vertex_group":
				ia(e, r, t, {
					finiteNumber: Q,
					checkedField: ul
				});
				break;
			case "vertex_color":
				aa(e, r, t, {
					finiteNumber: Q,
					checkedField: ul
				});
				break;
			case "decimate":
				r.ratio = Q(e.ratio, t, "ratio", {
					minimum: 0,
					maximum: 1,
					exclusiveMinimum: !0
				});
				break;
			case "remesh":
				if (e.voxelSize === void 0 == (e.resolution === void 0)) throw N(t, "voxelSize", e.voxelSize, "exactly one of voxelSize and resolution, such as \"voxelSize\": 0.1");
				if (e.voxelSize !== void 0 && (r.voxelSize = Q(e.voxelSize, t, "voxelSize", {
					minimum: 0,
					exclusiveMinimum: !0
				})), e.resolution !== void 0) {
					if (!Number.isInteger(e.resolution) || e.resolution < 4 || e.resolution > 192) throw N(t, "resolution", e.resolution, "a whole number from 4 to 192, such as 32");
					r.resolution = e.resolution;
				}
				break;
			case "merge_by_distance": r.distance = Q(e.distance ?? 1e-4, t, "distance", {
				minimum: 0,
				maximum: 1e3
			});
		}
		return hr.includes(e.op) && yr(e, r, t, {
			finiteNumber: Q,
			vector: $
		}), ii.includes(e.op) && ci(e, r, t, {
			finiteNumber: Q,
			vector: $
		}), Yo(e.op) && Qo(e, r, t, {
			finiteNumber: Q,
			checkedField: ul
		}), r;
	});
}
function ml(e, t, n, r) {
	let i = da(e, t.levels);
	if (i.vertices > n.maxVertices || i.faces > n.maxFaces) throw N(r, "levels", t.levels, `a number of levels that keeps the mesh within ${n.maxVertices} vertices and ${n.maxFaces} faces (this edit would make ${i.vertices} vertices and ${i.faces} faces), such as 1, or use a simpler mesh`, RangeError);
}
function hl(e, t, n, r) {
	if (br(e, t, n, r), li(e, t, n, r), t.op === "sculpt") {
		try {
			us(e, t.strokes.length);
		} catch (e) {
			throw Z(e, r, "sculpt");
		}
		return;
	}
	if (t.op === "subdivide") {
		ml(e, t, n, r);
		return;
	}
	if (t.op === "remesh") {
		try {
			rl(e, t);
		} catch (e) {
			throw Z(e, r, "remesh");
		}
		return;
	}
	if (t.op !== "array") return;
	let i = e.vertexCount * t.count, a = e.faceCount * t.count;
	if (i > n.maxVertices || a > n.maxFaces) throw N(r, "count", t.count, `a count that keeps the mesh within ${n.maxVertices} vertices and ${n.maxFaces} faces (this edit would make ${i} vertices and ${a} faces), such as 2, or use a simpler mesh`, RangeError);
}
function gl(e, t, n, r) {
	if (e.vertexCount > t.maxVertices || e.faceCount > t.maxFaces) throw RangeError(`Mesh edit ${n} (${r}) grows the mesh to ${e.vertexCount} vertices and ${e.faceCount} faces, over the limit of ${t.maxVertices} vertices or ${t.maxFaces} faces.`);
}
function _l(e, { translation: t, rotation: n, scale: r }) {
	let [i, a, o, s] = n, c = new Float32Array(e.positions.length);
	for (let n = 0; n < c.length; n += 3) {
		let l = e.positions[n] * r[0], u = e.positions[n + 1] * r[1], d = e.positions[n + 2] * r[2], f = a * d - o * u, p = o * l - i * d, m = i * u - a * l;
		c[n] = l + 2 * (s * f + a * m - o * p) + t[0], c[n + 1] = u + 2 * (s * p + o * f - i * m) + t[1], c[n + 2] = d + 2 * (s * m + i * p - a * f) + t[2];
	}
	return w({
		positions: c,
		faceOffsets: e.faceOffsets,
		cornerVertices: e.cornerVertices,
		edgeVertices: e.edgeVertices,
		cornerEdges: e.cornerEdges,
		attributes: e.attributes
	});
}
function vl(e, t, n) {
	if (!n) throw TypeError("shrinkwrap needs a target resolver; recipe meshes provide one.");
	return ms(e, _l(n(t.target), t), t);
}
function yl(e) {
	return (t) => {
		if (!e || typeof t == "string") throw TypeError("A mesh edit field reads a surface given as a geometry record such as { \"type\": \"terrain\", ... }, not an id.");
		return Ce(H(e(t)));
	};
}
function bl(e, t, n, { resolveCutter: i, limits: a }) {
	let o = yl(i), s = { op: t.op };
	if (t.name && (s.name = t.name), Yo(t.op)) {
		let r;
		try {
			r = cs(e, t, a);
		} catch (e) {
			throw Z(e, n, `${t.op}`);
		}
		return Object.assign(s, r.result), {
			mesh: r.mesh,
			result: s
		};
	}
	if (t.op === "boolean") {
		if (!i) throw TypeError(`Mesh edit ${n} (boolean) needs a cutter resolver; recipe meshes provide one.`);
		let r;
		try {
			r = _l(i(t.cutter), t);
		} catch (e) {
			throw Z(e, n, "boolean cutter");
		}
		let a = `${t.name}.cut`, o;
		try {
			o = Kt(e, r, t.operation, { cutTag: a });
		} catch (e) {
			throw Z(e, n, `boolean ${t.operation}`);
		}
		return s.operation = t.operation, s.tags = { [a]: o.cutterFaces }, {
			mesh: o.mesh,
			result: s
		};
	}
	if (t.op === "merge_by_distance") {
		let n = S(e, t.distance);
		return s.removedVertices = n.removedVertices, s.removedFaces = n.removedFaces, {
			mesh: n.mesh,
			result: s
		};
	}
	if (t.op === "loop_cut") {
		let r;
		try {
			r = Xt(e, t.edges, t);
		} catch (e) {
			throw Z(e, n, "loop_cut");
		}
		return s.rings = r.rings, s.closedRings = r.closedRings, s.splitEdges = r.splitEdges, s.tags = Sl(r.mesh, t.name), {
			mesh: r.mesh,
			result: s
		};
	}
	if (t.op === "bevel") {
		let r;
		try {
			r = oe(e, t.edges, t);
		} catch (e) {
			throw Z(e, n, "bevel");
		}
		return s.edges = r.bevelEdges, s.width = r.width, r.clamped && (s.clamped = !0), s.tags = Sl(r.mesh, t.name), {
			mesh: r.mesh,
			result: s
		};
	}
	if (hr.includes(t.op) || ii.includes(t.op)) {
		let r;
		try {
			r = hr.includes(t.op) ? Sr(e, t) : di(e, t);
		} catch (e) {
			throw Z(e, n, `${t.op}`);
		}
		Object.assign(s, r.result);
		let i = Sl(r.mesh, t.name);
		return Object.keys(i).length && (s.tags = i), {
			mesh: r.mesh,
			result: s
		};
	}
	if (t.op === "set_position" || t.op === "displace") {
		let r;
		try {
			r = t.op === "set_position" ? ji(e, t, o) : Mi(e, t, o);
		} catch (e) {
			throw Z(e, n, `${t.op}`);
		}
		return s.movedVertices = r.movedVertices, {
			mesh: r.mesh,
			result: s
		};
	}
	if (t.op === "vertex_group" || t.op === "vertex_color") {
		let r;
		try {
			r = t.op === "vertex_group" ? la(e, t, o) : ua(e, t, o);
		} catch (e) {
			throw Z(e, n, `${t.op}`);
		}
		return t.op === "vertex_group" ? (s.group = t.name, s.assignedVertices = r.assignedVertices) : s.assignedCorners = r.assignedCorners, {
			mesh: r.mesh,
			result: s
		};
	}
	if (t.op === "sculpt" || t.op === "shrinkwrap") {
		let r;
		try {
			r = t.op === "sculpt" ? ds(e, t) : vl(e, t, i);
		} catch (e) {
			throw Z(e, n, `${t.op}`);
		}
		return s.movedVertices = r.movedVertices, r.missedVertices && (s.missedVertices = r.missedVertices), {
			mesh: r.mesh,
			result: s
		};
	}
	if (t.op === "subdivide") {
		let r;
		try {
			r = Ea(e, {
				levels: t.levels,
				crease: t.crease,
				sharpness: t.sharpness
			});
		} catch (e) {
			throw Z(e, n, "subdivide");
		}
		return s.levels = t.levels, {
			mesh: r,
			result: s
		};
	}
	if (t.op === "decimate") {
		let r;
		try {
			r = Ra(e, t);
		} catch (e) {
			throw Z(e, n, "decimate");
		}
		return s.triangles = r.triangles, r.reachedTarget || (s.stoppedEarly = !0), {
			mesh: r.mesh,
			result: s
		};
	}
	if (t.op === "remesh") {
		let r;
		try {
			r = sl(e, t);
		} catch (e) {
			throw Z(e, n, "remesh");
		}
		return s.voxelSize = Number(r.voxelSize.toPrecision(5)), {
			mesh: r.mesh,
			result: s
		};
	}
	if (t.op === "uv_unwrap") {
		let r;
		try {
			let n = we("uvUnwrap", [e, t], pe);
			r = {
				...n,
				mesh: w(n.mesh)
			};
		} catch (e) {
			throw e instanceof Te ? e : Z(e, n, "uv_unwrap");
		}
		return s.islands = r.islands, s.seamEdges = r.seamEdges, s.cutEdges = r.cutEdges, s.chartEdges = r.chartEdges, s.flipped = r.flipped, s.areaDistortion = Number(r.areaDistortion.toFixed(4)), s.utilization = Number(r.utilization.toFixed(4)), {
			mesh: r.mesh,
			result: s
		};
	}
	if (t.op === "uv_project" || t.op === "uv_pack") {
		let r;
		try {
			r = t.op === "uv_project" ? Di(e, t) : Ei(e, t);
		} catch (e) {
			throw Z(e, n, t.op);
		}
		return s.islands = r.islands, {
			mesh: r.mesh,
			result: s
		};
	}
	if (Object.hasOwn(xl, t.op)) {
		let n = xl[t.op](e, t);
		return s.tags = Sl(n, t.name), {
			mesh: n,
			result: s
		};
	}
	let c;
	try {
		c = O(e, t.select);
	} catch (e) {
		throw Z(e, n, `${t.op}`);
	}
	let l = r(c);
	if (l === 0) throw N(n, "select", t.select, "a rule that matches at least one face, such as { \"all\": true } (check tags and counts with mesh_inspect)", RangeError);
	s.selected = l;
	let u = v(e), p = null;
	switch (t.op) {
		case "extrude_face_region":
			p = ae(u, c, t);
			break;
		case "extrude_individual":
			p = ie(u, c, t);
			break;
		case "inset_region":
		case "inset_individual": {
			let e = t.op === "inset_region" ? be(u, c, t) : ve(u, c, t);
			p = {
				capFaces: e.capFaces,
				sideFaces: e.sideFaces,
				sideTag: "rim"
			};
			break;
		}
		case "delete":
			s.deletedFaces = ue(u, c).deletedFaces;
			break;
		case "flip_normals":
			y(u, c);
			break;
		case "translate":
			s.movedVertices = f(u, c, t).movedVertices;
			break;
		case "tag": ye(u, Array.from(c.keys()).filter((e) => c[e]), t.name), s.tags = { [t.name]: l };
	}
	if (p) {
		let e = `${t.name}.${p.sideTag ?? "side"}`;
		ye(u, p.capFaces, `${t.name}.cap`), ye(u, p.sideFaces, e), s.tags = {
			[`${t.name}.cap`]: p.capFaces.length,
			[e]: p.sideFaces.length
		};
	}
	return {
		mesh: d(u),
		result: s
	};
}
var xl = Object.freeze({
	mirror: (e, t) => ce(e, t),
	array: (e, t) => C(e, t),
	solidify: (e, t) => ee(e, t)
});
function Sl(e, t) {
	let n = {};
	for (let [r, i] of Object.entries(e.attributes.face)) {
		if (!r.startsWith(`tag:${t}.`)) continue;
		let a = 0;
		for (let t = 0; t < e.faceCount; t++) a += +!!i.data[t];
		n[r.slice(4)] = a;
	}
	return n;
}
function Cl(e, t, { maxVertices: n = 25e4, maxFaces: r = 25e4, resolveCutter: i } = {}) {
	let a = pl(t), o = {
		maxVertices: n,
		maxFaces: r
	}, s = [], c = e;
	return a.forEach((e, t) => {
		hl(c, e, o, t);
		let n = bl(c, e, t, {
			resolveCutter: i,
			limits: o
		});
		c = n.mesh, gl(c, o, t, e.op), n.result.after = {
			vertices: c.vertexCount,
			faces: c.faceCount
		}, s.push(n.result);
	}), {
		mesh: c,
		results: s
	};
}
function wl(e) {
	if (!Array.isArray(e)) throw TypeError("stack must be an array.");
	if (e.length > 16) throw RangeError("A stack holds at most 16 nodes.");
	for (let [t, n] of e.entries()) if (!Pe.includes(n?.op)) throw TypeError(`Stack node ${t} op must be one of ${Pe.join(", ")}.`);
	return pl(e.map((e, t) => Ne[e.op].fields.includes("name") ? {
		...e,
		name: e.name ?? `${e.op}-s${t + 1}`
	} : e));
}
function Tl(e, t, { maxVertices: n = 25e4, maxFaces: r = 25e4, cache: i, cacheKey: a } = {}) {
	let o = wl(t), s = {
		maxVertices: n,
		maxFaces: r
	}, c = [], l = e, u = a;
	return o.forEach((e, t) => {
		u = u === void 0 ? void 0 : `${u}|${JSON.stringify(e)}`;
		let n = u === void 0 ? void 0 : i?.get(u), r;
		if (n) l = n.mesh, r = {
			...n.result,
			cached: !0
		};
		else {
			hl(l, e, s, t);
			let n = bl(l, e, t, { limits: s });
			l = n.mesh, gl(l, s, t, e.op), n.result.after = {
				vertices: l.vertexCount,
				faces: l.faceCount
			}, r = n.result, u !== void 0 && i?.set(u, {
				mesh: l,
				result: r
			});
		}
		c.push(r);
	}), {
		mesh: l,
		results: c
	};
}
export { Rt as C, At as D, Lt as E, Vt as S, zt as T, Ii as _, _l as a, Di as b, sl as c, Qo as d, cs as f, Ni as g, Ra as h, wl as i, qo as l, Ga as m, Tl as n, $c as o, Ja as p, pl as r, Qc as s, Cl as t, Go as u, Fi as v, Kt as w, Xt as x, Ei as y };
