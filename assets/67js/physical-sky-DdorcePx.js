/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { r as e } from "./environment-DsFt4psZ.js";
// src/physical-sky.js
var t = Object.freeze([
	"type",
	"sunElevation",
	"sunRotation",
	"turbidity",
	"groundAlbedo",
	"aerialPerspective",
	"ozone",
	"sunDisc"
]), n = Object.freeze({
	sunElevation: 45,
	sunRotation: 0,
	turbidity: 3,
	groundAlbedo: .3,
	aerialPerspective: 1,
	ozone: 1,
	sunDisc: !0
}), r = Object.freeze({
	sunElevation: [
		-90,
		90,
		"degrees above the horizon, such as 15"
	],
	sunRotation: [
		-360,
		360,
		"degrees clockwise from -Z seen from above, such as 120"
	],
	turbidity: [
		1,
		10,
		"haze from 1 (very clear) to 10 (thick haze), such as 3"
	],
	groundAlbedo: [
		0,
		1,
		"a reflectance from 0 to 1, such as 0.3"
	],
	aerialPerspective: [
		0,
		4,
		"a scale from 0 (none) to 4, such as 1"
	],
	ozone: [
		0,
		10,
		"ozone absorption from 0 (none) to 10, such as 1"
	]
}), i = 1024, a = 512, o = [
	.04,
	.1,
	.24
], s = [
	.0125,
	.015,
	.0175
], c = [
	.02,
	.014,
	5e-4
], l = 3.4, u = 2.2, d = 18, f = .9994, p = 20, m = .76;
function h(e, i) {
	let a = Object.keys(e).filter((e) => !t.includes(e));
	if (a.length > 0 || e.type !== "physical") throw i("environment.sky", e.type === "physical" ? a[0] : e.type, `type 'physical' with fields ${t.slice(1).join(", ")}`);
	let o = { type: "physical" };
	for (let [t, [a, s, c]] of Object.entries(r)) {
		let r = e[t] ?? n[t];
		if (!Number.isFinite(r) || r < a || r > s) throw i(`environment.sky.${t}`, r, `a number from ${a} to ${s}, ${c}`);
		o[t] = r;
	}
	let s = e.sunDisc ?? n.sunDisc;
	if (typeof s != "boolean") throw i("environment.sky.sunDisc", s, "true or false");
	return o.sunDisc = s, o;
}
function g(e) {
	let t = Math.max(e, 0) * 180 / Math.PI;
	return Math.min(p, 1 / (Math.sin(Math.max(e, 0)) + .15 * (t + 3.885) ** -1.253));
}
function _(e, t = 1) {
	return o.map((n, r) => n + s[r] * e + c[r] * t);
}
function v(e) {
	let t = e.sunElevation * Math.PI / 180, n = e.sunRotation * Math.PI / 180;
	return [
		Math.cos(t) * Math.sin(n),
		Math.sin(t),
		-Math.cos(t) * Math.cos(n)
	];
}
function y(e) {
	let t = g(e.sunElevation * Math.PI / 180), n = _(e.turbidity, e.ozone ?? 1), r = Math.min(1, Math.max(0, (e.sunElevation + 1) / 3));
	return n.map((e) => l * Math.exp(-e * t) * r);
}
function b(e, t, n) {
	let r = e.ozone ?? 1, i = _(e.turbidity, r), a = g(Math.asin(Math.max(-1, Math.min(1, n[1])))), l = t[0] * n[0] + t[1] * n[1] + t[2] * n[2], d = .75 * (1 + l * l), f = m, p = (1 - f * f) / (1.5776 - 2 * f * l) ** 1.5 / (4 * Math.PI) * 4, h = Math.min(p, 2.5), v = g(Math.asin(Math.max(0, t[1])) + .02), y = Math.min(1, Math.max(0, (e.sunElevation + 6) / 8));
	return i.map((n, i) => {
		let f = o[i], p = s[i] * e.turbidity, m = (f * d + p * h * 1.5) / (f + p), g = 1 - Math.exp(-(f + p) * v), _ = Math.max(0, l) ** 2 * (1 - Math.max(0, t[1])), b = Math.min(4, a) * (1 - _) + a * _, x = Math.exp(-n * b * .45 - c[i] * r * v * .35);
		return u * m * g * x * y;
	});
}
function x(e, t, n, r) {
	let i = Math.max(r[1], 0);
	return t.map((t, r) => e.groundAlbedo * (t * i * .3 + n[r] * .55));
}
function S(e) {
	let t = v(e), n = y(e), r = [
		-t[2],
		.04,
		t[0]
	], i = b(e, [
		0,
		1,
		0
	], t), a = b(e, [
		t[0],
		Math.max(.04, t[1] * .2),
		t[2]
	], t), o = b(e, r, t);
	return {
		sun: t,
		color: n,
		zenith: i,
		horizon: a.map((e, t) => e * .7 + o[t] * .3)
	};
}
function C(e) {
	let { sun: t, color: n, zenith: r, horizon: i } = S(e), a = (e) => e.map((t) => Math.max(0, t / Math.max(1, ...e)));
	return {
		lightDirection: t,
		keyColor: n.map((e) => Math.round(e * 1e3) / 1e3),
		skyTop: a(r),
		skyBottom: a(i),
		fogColor: a(i),
		aerialDensity: .0025 * e.turbidity * e.aerialPerspective
	};
}
function w(e, t, n) {
	let r = h(e, n), { aerialDensity: i, ...a } = C(r);
	Object.assign(t, a, {
		sky: r,
		fogDensity: i
	});
}
var T = /* @__PURE__ */ new Map(), E = 8;
function D(e) {
	let t = (e - f) / .0006000000000000449, n = Math.min(Math.max(t / .64, 0), 1);
	return n * n * (3 - 2 * n) * d;
}
var O = .12;
function k(e, t, n, r, i) {
	let a = b(e, [
		i[0],
		0,
		i[2]
	], r), o = x(e, t, n, r).map((t, n) => t + a[n] * .35 * (1 - e.groundAlbedo)), s = Math.min(-i[1] / O, 1), c = s * s * (3 - 2 * s);
	return o.map((e, t) => a[t] + (e - a[t]) * c);
}
function A(e) {
	let { sun: t, color: n, zenith: r } = S(e), o = e.sunDisc !== !1 && e.sunElevation > -1.5, s = new Float32Array(i * a * 3);
	for (let c = 0; c < a; c++) {
		let l = (c + .5) / a * Math.PI;
		for (let a = 0; a < i; a++) {
			let u = ((a + .5) / i - .5) * 2 * Math.PI, d = [
				Math.sin(l) * Math.sin(u),
				Math.cos(l),
				-Math.sin(l) * Math.cos(u)
			], p = d[0] * t[0] + d[1] * t[1] + d[2] * t[2], m = o && d[1] > 0 && p > f ? D(p) : 0, h = d[1] >= 0 ? b(e, d, t).map((e, t) => e + n[t] * m) : k(e, n, r, t, d);
			s.set(h, (c * i + a) * 3);
		}
	}
	return s;
}
function j({ sky: n, environmentIntensity: r, environmentRotation: o, world: s }) {
	let c = [
		...t.slice(1).map((e) => n[e]),
		r,
		o,
		s
	].join("|");
	return T.has(c) || (T.size >= E && T.clear(), T.set(c, e({
		width: i,
		height: a,
		data: A(n),
		intensity: r,
		rotation: o,
		showBackground: s
	}))), T.get(c);
}
export { t as PHYSICAL_SKY_FIELDS, w as applyPhysicalSky, j as createPhysicalSkyMap, C as physicalSkyFields, v as physicalSunDirection, h as resolvePhysicalSky };
