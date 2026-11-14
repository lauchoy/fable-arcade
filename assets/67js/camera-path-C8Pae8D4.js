/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { n as e, r as t } from "./animation-CO9Tq0E0.js";
// src/camera-path.js
function n(e, t, n) {
	return n && typeof n == "object" && !Array.isArray(n) && !ArrayBuffer.isView(n) ? {
		...n,
		target: e,
		property: t
	} : {
		target: e,
		property: t,
		keyframes: [{
			time: 0,
			value: n
		}]
	};
}
function r(e, t) {
	if (!Array.isArray(e) && !ArrayBuffer.isView(e) || e.length !== 3) throw TypeError(`${t} must contain three finite components.`);
	for (let n of e) if (!Number.isFinite(n)) throw RangeError(`${t} must contain three finite components.`);
}
function i(e, t, n) {
	r(e, "Camera eye"), r(t, "Camera target"), r(n, "Camera up");
	let i = t[0] - e[0], a = t[1] - e[1], o = t[2] - e[2], s = Math.hypot(i, a, o), c = Math.hypot(...n);
	if (!Number.isFinite(s) || s <= 1e-8 || !Number.isFinite(c) || c <= 1e-8) throw RangeError("Camera eye and target must be distinct, with a nonzero up vector.");
	let l = Math.abs(i / s * (n[0] / c) + a / s * (n[1] / c) + o / s * (n[2] / c));
	if (!Number.isFinite(l) || l >= 1 - 1e-10) throw RangeError("Camera up must not be parallel to the viewing direction.");
}
function a(e, t, n) {
	if (!Number.isFinite(e) || e <= 0 || e >= 180) throw RangeError("Camera field of view must be between 0 and 180 degrees.");
	if (!Number.isFinite(t) || !Number.isFinite(n) || t <= 0 || n <= t) throw RangeError("Camera clipping planes must satisfy 0 < near < far.");
}
function o(e, t) {
	let n = Object.getOwnPropertyDescriptor(e, t), r = n, i = Object.getPrototypeOf(e);
	for (; !r && i !== null;) r = Object.getOwnPropertyDescriptor(i, t), i = Object.getPrototypeOf(i);
	if (r && (!("value" in r) || !r.writable) || !n && !Object.isExtensible(e)) throw TypeError("Camera output fields must be writable data properties.");
}
function s(e, t) {
	if (!Array.isArray(t) && !ArrayBuffer.isView(t) || t.length !== 16 || !Array.from(t).every(Number.isFinite)) throw TypeError("Tracking requires a finite affine target matrix.");
	if (t[3] !== 0 || t[7] !== 0 || t[11] !== 0 || t[15] !== 1) throw RangeError("Tracking requires an affine target matrix.");
	let n = e[0], r = e[1], i = e[2];
	for (let a = 0; a < 3; a++) e[a] = t[a] * n + t[a + 4] * r + t[a + 8] * i + t[a + 12];
}
function c(e, { sensorHeight: t = 24 } = {}) {
	if (!Number.isFinite(e) || e <= 0 || !Number.isFinite(t) || t <= 0) throw RangeError("Focal length and sensor height must be positive and finite.");
	let n = 2 * Math.atan(t / e / 2) * 180 / Math.PI;
	return a(n, .1, 100), n;
}
function l(e, t) {
	if (t) for (let n = 0; n < 3; n++) t[n] !== void 0 && (e[n] = t[n]);
}
function u({ duration: c, loop: u = !1, eye: d, target: f = [
	0,
	0,
	0
], fov: p = 45, roll: m = 0, up: h = [
	0,
	1,
	0
], near: g = .1, far: _ = 100 } = {}) {
	if (r(h, "Camera up"), a(45, g, _), Math.hypot(...h) <= 1e-8) throw RangeError("Camera up must be nonzero.");
	let v = Object.freeze(Array.from(h)), y = Math.hypot(...v), b = v.map((e) => e / y), x = t({
		duration: c,
		loop: u,
		tracks: [
			n("eye", "translation", d),
			n("target", "translation", f),
			n("fov", "value", p),
			n("roll", "value", m)
		]
	});
	for (let e of x.tracks[2].keyframes) a(e.value, g, _);
	let S = e(x), C = /* @__PURE__ */ new Float64Array(3), w = /* @__PURE__ */ new Float64Array(3), T = /* @__PURE__ */ new Float64Array(3), E = /* @__PURE__ */ new Float64Array(3);
	function D(e, t = {
		eye: [
			0,
			0,
			0
		],
		target: [
			0,
			0,
			0
		],
		up: [
			0,
			0,
			0
		]
	}, { targetMatrix: n, overrides: r } = {}) {
		let c = [
			t.eye,
			t.target,
			t.up
		];
		for (let e of c) {
			if (!(Array.isArray(e) || e instanceof Float32Array || e instanceof Float64Array) || e.length !== 3) throw TypeError("Camera output needs writable three-component eye, target and up arrays.");
			if (Object.isFrozen(e)) throw TypeError("Camera output arrays must be writable.");
			if (Array.isArray(e)) for (let t = 0; t < 3; t++) o(e, t);
		}
		if (new Set(c).size !== 3 || Object.isFrozen(t)) throw TypeError("Camera output must be writable and its vectors must be distinct.");
		for (let e = 0; e < c.length; e++) for (let t = e + 1; t < c.length; t++) {
			let n = c[e], r = c[t];
			if (ArrayBuffer.isView(n) && ArrayBuffer.isView(r) && n.buffer === r.buffer && n.byteOffset < r.byteOffset + r.byteLength && r.byteOffset < n.byteOffset + n.byteLength) throw TypeError("Camera output vectors must not overlap in memory.");
		}
		for (let e of [
			"fov",
			"near",
			"far",
			"projection"
		]) o(t, e);
		let u = S.sample(e);
		C.set(u[0].output), w.set(u[1].output), l(C, r?.eye), l(w, r?.target), n !== void 0 && s(w, n), i(C, w, v);
		let d = r?.fov ?? u[2].output[0];
		a(d, g, _);
		let f = r?.roll ?? u[3].output[0], p = Math.hypot(w[0] - C[0], w[1] - C[1], w[2] - C[2]);
		for (let e = 0; e < 3; e++) E[e] = (w[e] - C[e]) / p;
		let m = Math.cos(f), h = Math.sin(f), y = E[0] * b[0] + E[1] * b[1] + E[2] * b[2];
		for (let e = 0; e < 3; e++) {
			let t = (e + 1) % 3, n = (e + 2) % 3, r = E[t] * b[n] - E[n] * b[t];
			T[e] = b[e] * m + r * h + E[e] * y * (1 - m);
		}
		let x = [
			C,
			w,
			T
		];
		for (let e = 0; e < c.length; e++) if (c[e] instanceof Float32Array) for (let t = 0; t < 3; t++) x[e][t] = Math.fround(x[e][t]);
		i(C, w, T);
		for (let e = 0; e < c.length; e++) for (let t = 0; t < 3; t++) c[e][t] = x[e][t];
		return t.fov = d, t.near = g, t.far = _, t.projection = "perspective", t;
	}
	return D(0), Object.freeze({
		duration: x.duration,
		loop: x.loop,
		clip: x,
		sample: D
	});
}
export { c as n, u as t };
