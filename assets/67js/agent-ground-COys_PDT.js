/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { n as e, s as t, x as n } from "./mat4-BCZClxna.js";
// src/agent-ground.js
var r = 48, i = .9, a = .25, o = .001, s = 6, c = 2, l = [
	.22,
	.22,
	.21
];
function u(e) {
	let { positions: t } = e.geometry, n = e.matrix, r = [
		Infinity,
		Infinity,
		Infinity
	], i = [
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let e = 0; e < t.length; e += 3) for (let a = 0; a < 3; a++) {
		let o = n[a] * t[e] + n[4 + a] * t[e + 1] + n[8 + a] * t[e + 2] + n[12 + a];
		r[a] = Math.min(r[a], o), i[a] = Math.max(i[a], o);
	}
	return {
		minimum: r,
		maximum: i
	};
}
function d(e) {
	let t = [
		Infinity,
		Infinity,
		Infinity
	], n = [
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let r of e) for (let e = 0; e < 3; e++) t[e] = Math.min(t[e], r.minimum[e]), n[e] = Math.max(n[e], r.maximum[e]);
	return {
		minimum: t,
		maximum: n
	};
}
function f(e, t) {
	let n = t.maximum[0] - t.minimum[0], r = t.maximum[2] - t.minimum[2], s = e.maximum[0] - e.minimum[0], c = e.maximum[2] - e.minimum[2], l = e.maximum[1] - e.minimum[1], u = s >= i * n && c >= i * r, d = l <= a * Math.max(s, c), f = e.minimum[1] <= t.minimum[1] + o;
	return u && d && f;
}
function p(e, t) {
	if (t.ground === !1 || e.length === 0) return null;
	let n = e.map(u);
	if (!n.every((e) => e.minimum.every(Number.isFinite) && e.maximum.every(Number.isFinite))) return null;
	let r = d(n);
	if (n.length > 1 && n.some((e) => f(e, r))) return null;
	let i = Math.max(r.maximum[0] - r.minimum[0], r.maximum[2] - r.minimum[2]) / 2;
	return {
		center: [(r.minimum[0] + r.maximum[0]) / 2, (r.minimum[2] + r.maximum[2]) / 2],
		radius: Math.max(c, i * s),
		height: r.minimum[1]
	};
}
function m() {
	let e = [
		0,
		0,
		0
	];
	for (let t = 0; t < r; t++) {
		let n = t / r * Math.PI * 2;
		e.push(Math.cos(n), 0, Math.sin(n));
	}
	let t = [];
	for (let e = 0; e < r; e++) t.push(0, 1 + (e + 1) % r, 1 + e);
	let n = e.map((e, t) => +(t % 3 == 1));
	return {
		positions: new Float32Array(e),
		normals: new Float32Array(n),
		indices: new Uint32Array(t)
	};
}
function h(e, r) {
	t(e.matrix, [
		r.center[0],
		r.height,
		r.center[1]
	]), n(e.matrix, e.matrix, [
		r.radius,
		1,
		r.radius
	]);
}
function g(t) {
	let n = {
		name: "Automatic floor",
		geometry: m(),
		matrix: e(),
		material: {
			color: l,
			metallic: 0,
			roughness: .9,
			emission: 0,
			tag: "surface"
		}
	};
	return h(n, t), n;
}
export { h as i, p as n, g as r, l as t };
