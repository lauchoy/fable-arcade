/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { t as e } from "./volumetric-D8WftbY1.js";
// src/local-volume-noise.js
var t = Math.fround, n = (e) => t(e - Math.floor(e));
function r(e, r, i) {
	let a = n(t(e * t(.1031))), o = n(t(r * t(.1031))), s = n(t(i * t(.1031))), c = t(31.32), l = t(t(t(a * t(s + c)) + t(o * t(o + c))) + t(s * t(a + c)));
	return a = t(a + l), o = t(o + l), s = t(s + l), n(t(t(a + o) * s));
}
function i(e) {
	return t(t(e * e) * t(3 - t(2 * e)));
}
function a(e, n, r) {
	return t(t(e * t(1 - r)) + t(n * r));
}
function o(e, n, o) {
	let s = t(e), c = t(n), l = t(o), u = Math.floor(s), d = Math.floor(c), f = Math.floor(l), p = i(t(s - u)), m = i(t(c - d)), h = i(t(l - f));
	return a(a(a(r(u, d, f), r(u + 1, d, f), p), a(r(u, d + 1, f), r(u + 1, d + 1, f), p), m), a(a(r(u, d, f + 1), r(u + 1, d, f + 1), p), a(r(u, d + 1, f + 1), r(u + 1, d + 1, f + 1), p), m), h);
}
function s(e, t, n, r) {
	return 1 + (2 * o(t * e.noiseScale, n * e.noiseScale, r * e.noiseScale) - 1) * e.noiseAmount;
}
var c = Object.freeze([
	"box",
	"sphere",
	"mesh"
]), l = Object.freeze(["bounds", "mesh"]), u = Object.freeze([
	"shape",
	"part",
	"fit",
	"center",
	"size",
	"radius",
	"density",
	"falloff",
	"absorption",
	"emission",
	"emissionStrength",
	"noiseAmount",
	"noiseScale",
	"steps"
]);
function d(t, n, r, i) {
	if (!Array.isArray(t) || t.length !== 3) throw TypeError(`${i} must be an array of three numbers`);
	return t.map((t) => e(t, n, r, i));
}
function f(t, n) {
	if (!t || typeof t != "object" || Array.isArray(t)) throw TypeError(`${n} must be an object`);
	for (let e of Object.keys(t)) if (!u.includes(e)) throw TypeError(`${n} has no field "${e}"; use ${u.join(", ")}`);
	let r = t.shape ?? "box";
	if (!c.includes(r)) throw RangeError(`${n}.shape must be one of ${c.join(", ")}`);
	let i = {
		shape: r,
		...r === "mesh" ? {} : { center: d(t.center, -1e5, 1e5, `${n}.center`) },
		density: e(t.density ?? 1, 0, 100, `${n}.density`),
		falloff: e(t.falloff ?? .5, 0, 1, `${n}.falloff`),
		absorption: d(t.absorption ?? [
			1,
			1,
			1
		], 0, 1, `${n}.absorption`),
		emission: d(t.emission ?? [
			0,
			0,
			0
		], 0, 1, `${n}.emission`),
		emissionStrength: e(t.emissionStrength ?? 1, 0, 1e3, `${n}.emissionStrength`),
		noiseAmount: e(t.noiseAmount ?? 0, 0, 1, `${n}.noiseAmount`),
		noiseScale: e(t.noiseScale ?? 1, .001, 100, `${n}.noiseScale`),
		steps: e(t.steps ?? 16, 4, 32, `${n}.steps`)
	};
	if (!Number.isInteger(i.steps)) throw RangeError(`${n}.steps must be an integer`);
	if (r === "mesh") {
		if (typeof t.part != "string" || t.part === "") throw TypeError(`${n}.part must be the name of the part that bounds the volume`);
		for (let e of [
			"center",
			"size",
			"radius"
		]) if (t[e] !== void 0) throw TypeError(`${n}.${e} belongs to a box or a sphere; a mesh volume takes its place and size from the part named in ${n}.part`);
		if (i.part = t.part, i.fit = t.fit ?? "bounds", !l.includes(i.fit)) throw RangeError(`${n}.fit must be one of ${l.join(", ")}`);
		return i;
	}
	if (t.part !== void 0 || t.fit !== void 0) throw TypeError(`${n}.part and ${n}.fit belong to shape "mesh"`);
	if (r === "sphere") {
		if (t.size !== void 0) throw TypeError(`${n}.size belongs to a box; a sphere takes radius`);
		i.radius = e(t.radius, .001, 1e4, `${n}.radius`);
	} else {
		if (t.radius !== void 0) throw TypeError(`${n}.radius belongs to a sphere; a box takes size [width, height, depth]`);
		i.size = d(t.size, .001, 1e4, `${n}.size`);
	}
	return i;
}
function p(e, t = "localVolumes") {
	if (!Array.isArray(e)) throw TypeError(`${t} must be an array of volumes`);
	if (e.length > 8) throw RangeError(`${t} holds at most 8 volumes, got ${e.length}`);
	return e.map((e, n) => f(e, `${t}[${n}]`));
}
function m() {
	return {
		count: 0,
		meshParts: [],
		centers: /* @__PURE__ */ new Float32Array(32),
		extents: /* @__PURE__ */ new Float32Array(32),
		absorption: /* @__PURE__ */ new Float32Array(32),
		emission: /* @__PURE__ */ new Float32Array(32),
		steps: /* @__PURE__ */ new Float32Array(32),
		axes: /* @__PURE__ */ new Float32Array(96)
	};
}
var h = Object.freeze([
	1,
	0,
	0,
	0,
	1,
	0,
	0,
	0,
	1
]);
function g(e, t) {
	if (e.some((e) => e.shape === "mesh" && !e.center)) throw RangeError("A mesh volume names a part: bind it with bindLocalVolumeParts before packing");
	return t.count = e.length, t.meshParts = [], e.forEach((e, n) => {
		let r = n * 4, i = e.shape === "sphere" ? [
			e.radius,
			e.radius,
			e.radius
		] : e.size.map((e) => e / 2), a = e.shape === "sphere" ? 1 : e.part ? 2 : 0;
		t.centers.set([...e.center, a], r), t.extents.set([...i, e.falloff], r), t.absorption.set([...e.absorption.map((t) => t * e.density), e.noiseAmount], r), t.emission.set([...e.emission.map((t) => t * e.emissionStrength), e.noiseScale], r), t.steps.set([
			e.steps,
			a === 2 ? t.meshParts.length : 0,
			0,
			0
		], r), a === 2 && t.meshParts.push({
			part: e.part,
			label: `environment.localVolumes[${n}]`
		});
		let o = e.axes ?? h;
		for (let e = 0; e < 3; e++) t.axes.set([
			o[e * 3],
			o[e * 3 + 1],
			o[e * 3 + 2],
			0
		], (n * 3 + e) * 4);
	}), t;
}
function _(e, t, n, r) {
	if (e.shape === "mesh") return 1;
	let i = t - e.center[0], a = n - e.center[1], o = r - e.center[2];
	if (e.axes) {
		let t = e.axes, n = t[0] * i + t[1] * a + t[2] * o, r = t[3] * i + t[4] * a + t[5] * o;
		o = t[6] * i + t[7] * a + t[8] * o, i = n, a = r;
	}
	let c = e.shape === "sphere" ? Math.hypot(i, a, o) / e.radius : Math.max(Math.abs(i) / (e.size[0] / 2), Math.abs(a) / (e.size[1] / 2), Math.abs(o) / (e.size[2] / 2));
	if (c >= 1) return 0;
	let l = 1;
	if (e.falloff > 0) {
		let t = Math.min(1, Math.max(0, (c - (1 - e.falloff)) / e.falloff));
		l = 1 - t * t * (3 - 2 * t);
	}
	return e.noiseAmount > 0 && (l *= s(e, t, n, r)), l;
}
function v(e, t, n, r, i, a, o, s, c) {
	let l = 0, u = s;
	if (e.shape === "sphere") {
		let s = t - e.center[0], c = n - e.center[1], d = r - e.center[2], f = s * i + c * a + d * o, p = f * f - (s * s + c * c + d * d - e.radius * e.radius);
		if (p <= 0) return !1;
		let m = Math.sqrt(p);
		l = Math.max(l, -f - m), u = Math.min(u, -f + m);
	} else {
		let s = e.axes, c = t - e.center[0], d = n - e.center[1], f = r - e.center[2];
		for (let p = 0; p < 3; p++) {
			let m = p === 0 ? t : p === 1 ? n : r, h = p === 0 ? i : p === 1 ? a : o, g = e.center[p] - m;
			if (s) {
				let e = p * 3;
				g = -(s[e] * c + s[e + 1] * d + s[e + 2] * f), h = s[e] * i + s[e + 1] * a + s[e + 2] * o;
			}
			let _ = e.size[p] / 2;
			if (h === 0) {
				if (Math.abs(g) > _) return !1;
				continue;
			}
			let v = (g - _) / h, y = (g + _) / h;
			l = Math.max(l, Math.min(v, y)), u = Math.min(u, Math.max(v, y));
		}
	}
	return l < u && (c[0] = l, c[1] = u, !0);
}
export { p as a, g as i, v as n, _ as r, m as t };
