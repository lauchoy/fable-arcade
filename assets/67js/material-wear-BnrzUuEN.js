/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { a as e } from "./shader-registry-DHYkwAg5.js";
import { t } from "./field-error-BpFTmyMO.js";
// src/effects.js
var n = Object.freeze({
	depthOfField: Object.freeze({
		blur: 0,
		focusDistance: 5
	}),
	motionBlur: Object.freeze({ shutter: 0 })
}), r = Object.freeze({
	neutral: Object.freeze({
		depthOfField: n.depthOfField,
		motionBlur: n.motionBlur,
		saturation: 1,
		contrast: 1,
		temperature: 0,
		vignette: 0,
		grain: 0,
		ambientOcclusion: 0,
		ambientOcclusionRadius: .5,
		bloom: Object.freeze({
			strength: 0,
			threshold: 1,
			radius: 1
		})
	}),
	cinematic: Object.freeze({
		depthOfField: n.depthOfField,
		motionBlur: n.motionBlur,
		saturation: .88,
		contrast: 1.08,
		temperature: .08,
		vignette: .16,
		grain: .012,
		ambientOcclusion: 0,
		ambientOcclusionRadius: .5,
		bloom: Object.freeze({
			strength: .25,
			threshold: 1,
			radius: 1.5
		})
	}),
	vivid: Object.freeze({
		depthOfField: n.depthOfField,
		motionBlur: n.motionBlur,
		saturation: 1.15,
		contrast: 1.03,
		temperature: 0,
		vignette: .06,
		grain: 0,
		ambientOcclusion: 0,
		ambientOcclusionRadius: .5,
		bloom: Object.freeze({
			strength: .3,
			threshold: .9,
			radius: 1.2
		})
	})
});
function i(e, t, n, r, i) {
	let a = e ?? t;
	if (!Number.isFinite(a) || a < n || a > r) throw Error(`${i} must be between ${n} and ${r}.`);
	return a;
}
function a(e = {}) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw Error("Effects must be an object.");
	let t = e.bloom ?? {};
	if (!t || typeof t != "object" || Array.isArray(t)) throw Error("Bloom must be an object.");
	let n = e.depthOfField ?? {}, r = e.motionBlur ?? {};
	if (typeof n != "object" || Array.isArray(n)) throw Error("Depth of field must be an object.");
	if (typeof r != "object" || Array.isArray(r)) throw Error("Motion blur must be an object.");
	return {
		depthOfField: {
			blur: i(n.blur, 0, 0, 1, "Depth of field blur"),
			focusDistance: i(n.focusDistance, 5, .01, 1e5, "Depth of field focus distance")
		},
		motionBlur: {
			shutter: i(r.shutter, 0, 0, .5, "Motion blur shutter"),
			...r.objects > 0 ? { objects: i(r.objects, 0, 0, 1, "Motion blur objects") } : {}
		},
		saturation: i(e.saturation, 1, 0, 2, "Saturation"),
		contrast: i(e.contrast, 1, .1, 2, "Contrast"),
		temperature: i(e.temperature, 0, -1, 1, "Temperature"),
		vignette: i(e.vignette, 0, 0, 1, "Vignette"),
		grain: i(e.grain, 0, 0, .1, "Grain"),
		ambientOcclusion: i(e.ambientOcclusion, 0, 0, 1, "Ambient occlusion"),
		ambientOcclusionRadius: i(e.ambientOcclusionRadius, .5, .01, 100, "Ambient occlusion radius"),
		bloom: {
			strength: i(t.strength, 0, 0, 2, "Bloom strength"),
			threshold: i(t.threshold, 1, 0, 10, "Bloom threshold"),
			radius: i(t.radius, 1, .1, 4, "Bloom radius")
		}
	};
}
var o = Math.PI / 2 - .01, s = 1e-4;
function c(e, t, n, r) {
	if (typeof e != "number" || !Number.isFinite(e) || e < t || e > n) throw RangeError(`${r} must be between ${t} and ${n}`);
	return e;
}
function l(e, t, n, r) {
	if (e?.length !== 3) throw TypeError(`${r} must have three components`);
	for (let i = 0; i < 3; i++) c(e[i], t, n, r);
	return e;
}
function u(e, t, n) {
	let r = e[t] ?? [];
	if (!Array.isArray(r) || r.length > n) throw RangeError(`${t} must be an array of at most ${n} lights`);
	return r;
}
function d(e, t) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw TypeError(`${t} must be an object`);
	return e;
}
function f(e, t) {
	let n = e.range ?? 0;
	if (c(n, 0, 1e6, `${t} range`), n !== 0 && n < .001) throw RangeError(`${t} range must be zero or at least 0.001`);
}
function p(e, t) {
	if (e.castShadow !== void 0 && typeof e.castShadow != "boolean") throw TypeError(`${t} castShadow must be true or false`);
}
function m(e, t) {
	l(e, -1e6, 1e6, t);
	let n = Math.hypot(e[0], e[1], e[2]);
	if (n < 1e-6) throw RangeError(`${t} must not be zero length`);
	return [
		e[0] / n,
		e[1] / n,
		e[2] / n
	];
}
function h(e) {
	d(e, "Point light"), l(e.position, -1e6, 1e6, "Point light position"), l(e.color ?? [
		1,
		1,
		1
	], 0, 1, "Point light color"), c(e.intensity ?? 1, 0, 1e5, "Point light intensity"), c(e.radius ?? .05, .001, 1e6, "Point light radius"), f(e, "Point light"), p(e, "Point light");
}
function g(e) {
	d(e, "Spot light"), l(e.position, -1e6, 1e6, "Spot light position"), m(e.direction, "Spot light direction"), l(e.color ?? [
		1,
		1,
		1
	], 0, 1, "Spot light color"), c(e.intensity ?? 1, 0, 1e5, "Spot light intensity"), c(e.radius ?? .05, .001, 1e6, "Spot light radius"), c(e.angle ?? Math.PI / 4, .01, o, "Spot light angle"), c(e.penumbra ?? .15, 0, 1, "Spot light penumbra"), f(e, "Spot light"), p(e, "Spot light");
}
function _(e) {
	d(e, "Area light"), l(e.position, -1e6, 1e6, "Area light position");
	let t = m(e.direction, "Area light direction"), n = m(e.up ?? [
		0,
		1,
		0
	], "Area light up");
	if (Math.abs(t[0] * n[0] + t[1] * n[1] + t[2] * n[2]) > .999 && e.up !== void 0) throw RangeError("Area light up must not be parallel to its direction");
	l(e.color ?? [
		1,
		1,
		1
	], 0, 1, "Area light color"), c(e.intensity ?? 1, 0, 1e5, "Area light intensity"), c(e.width, .001, 1e4, "Area light width"), c(e.height, .001, 1e4, "Area light height");
}
function v(e, t) {
	let n = 0;
	for (let t of e) t.castShadow && (n += 6);
	for (let e of t) e.castShadow && (n += 1);
	if (n > 24) throw RangeError(`Shadow casting lights need ${n} atlas tiles, and the atlas holds 24 (a point light uses 6, a spot light one)`);
	return n;
}
function y() {
	return {
		positions: /* @__PURE__ */ new Float32Array(64),
		colors: /* @__PURE__ */ new Float32Array(64),
		radii: /* @__PURE__ */ new Float32Array(16),
		pointShadows: /* @__PURE__ */ new Float32Array(16),
		spotPositions: /* @__PURE__ */ new Float32Array(32),
		spotColors: /* @__PURE__ */ new Float32Array(32),
		spotDirections: /* @__PURE__ */ new Float32Array(32),
		spotParameters: /* @__PURE__ */ new Float32Array(32),
		areaPositions: /* @__PURE__ */ new Float32Array(28),
		areaColors: /* @__PURE__ */ new Float32Array(28),
		areaNormals: /* @__PURE__ */ new Float32Array(28),
		areaTangents: /* @__PURE__ */ new Float32Array(28),
		shadowCasters: [],
		keyColor: /* @__PURE__ */ new Float32Array(3),
		pointCount: 0,
		spotCount: 0,
		areaCount: 0,
		fillIntensity: 1,
		ambientIntensity: 1,
		specularAntiAliasing: 1
	};
}
function b(e, t) {
	e.positions.fill(0), e.colors.fill(0), e.radii.fill(0), e.pointShadows.fill(-1);
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		if (e.positions.set(r.position, n * 4), e.positions[n * 4 + 3] = r.range ?? 0, e.colors.set(r.color ?? [
			1,
			1,
			1
		], n * 4), e.colors[n * 4 + 3] = r.intensity ?? 1, e.radii[n] = r.radius ?? .05, r.castShadow) {
			e.pointShadows[n] = e.shadowCasters.length;
			for (let t = 0; t < 6; t++) e.shadowCasters.push({
				light: r,
				face: t
			});
		}
	}
}
function x(e, t) {
	e.spotPositions.fill(0), e.spotColors.fill(0), e.spotDirections.fill(0), e.spotParameters.fill(0);
	for (let n = 0; n < t.length; n++) {
		let r = t[n], i = r.angle ?? Math.PI / 4, a = Math.cos(i), o = a + Math.max((1 - a) * (r.penumbra ?? .15), s);
		e.spotPositions.set(r.position, n * 4), e.spotPositions[n * 4 + 3] = r.range ?? 0, e.spotColors.set(r.color ?? [
			1,
			1,
			1
		], n * 4), e.spotColors[n * 4 + 3] = r.intensity ?? 1, e.spotDirections.set(m(r.direction, "Spot light direction"), n * 4), e.spotDirections[n * 4 + 3] = a, e.spotParameters[n * 4] = r.radius ?? .05, e.spotParameters[n * 4 + 1] = o, e.spotParameters[n * 4 + 2] = -1, r.castShadow && (e.spotParameters[n * 4 + 2] = e.shadowCasters.length, e.shadowCasters.push({
			light: r,
			face: -1
		}));
	}
}
function S(e, t) {
	e.areaPositions.fill(0), e.areaColors.fill(0), e.areaNormals.fill(0), e.areaTangents.fill(0);
	for (let n = 0; n < t.length; n++) {
		let r = t[n], i = m(r.direction, "Area light direction"), a = m(r.up ?? [
			0,
			1,
			0
		], "Area light up"), o = [
			a[1] * i[2] - a[2] * i[1],
			a[2] * i[0] - a[0] * i[2],
			a[0] * i[1] - a[1] * i[0]
		], s = Math.hypot(...o);
		s < .001 && (o = [
			1,
			0,
			0
		], s = 1), e.areaPositions.set(r.position, n * 4), e.areaColors.set(r.color ?? [
			1,
			1,
			1
		], n * 4), e.areaColors[n * 4 + 3] = r.intensity ?? 1, e.areaNormals.set(i, n * 4), e.areaNormals[n * 4 + 3] = r.width, e.areaTangents.set(o.map((e) => e / s), n * 4), e.areaTangents[n * 4 + 3] = r.height;
	}
}
function C(t, n, { world: r = !1 } = {}) {
	let i = u(n, "pointLights", 16), a = u(n, "spotLights", 8), o = u(n, "areaLights", 7), s = c(n.keyIntensity ?? 1, 0, 100, "Key intensity"), d = c(n.fillIntensity ?? 1, 0, 100, "Fill intensity"), f = c(n.ambientIntensity ?? 1, 0, 100, "Ambient intensity"), p = c(n.daylight ?? 1, 0, 100, "Daylight"), m = c(n.specularAntiAliasing ?? 1, 0, 4, "Specular anti-aliasing"), y = n.keyColor ?? (r ? [
		3.7 * p,
		3.4 * p,
		2.9 * p
	] : [
		5.2,
		4.7,
		4.1
	]);
	l(y, 0, 1e3, "Key color"), i.forEach(h), a.forEach(g), o.forEach(_), v(i, a), t.shadowCasters = [], b(t, i), x(t, a), S(t, o), e.update?.(t, a, o);
	for (let e = 0; e < 3; e++) t.keyColor[e] = y[e] * s;
	return t.pointCount = i.length, t.spotCount = a.length, t.areaCount = o.length, t.fillIntensity = d, t.ambientIntensity = f, t.specularAntiAliasing = m, t;
}
// src/material-wear.js
var w = Object.freeze({
	threshold: Object.freeze([0, 1]),
	softness: Object.freeze([.001, .5]),
	levels: 2047
}), T = Object.freeze({
	threshold: .5,
	softness: .25
}), E = Object.freeze({
	color: Object.freeze([
		.56,
		.57,
		.58
	]),
	metallic: 1,
	roughness: .3
}), D = Object.freeze({
	color: Object.freeze([
		.05,
		.04,
		.03
	]),
	roughness: .9
}), O = 2, k = w.levels + 1, A = [
	"mask",
	"threshold",
	"softness",
	"metal",
	"dirt"
], j = [
	"mask",
	"threshold",
	"softness",
	"color",
	"roughness"
], M = [
	"color",
	"metallic",
	"roughness"
];
function N(e, n, r, [i, a] = [0, 1]) {
	let o = e ?? r;
	if (typeof o != "number" || !(o >= i && o <= a)) throw t(n, e, `a number from ${i} to ${a}, such as ${r}`, TypeError);
	return o;
}
function P(e, n, r) {
	let i = e ?? r;
	if (!Array.isArray(i) || i.length !== 3 || i.some((e) => typeof e != "number" || !(e >= 0 && e <= 1))) throw t(n, e, `three numbers from 0 to 1, such as [${r.join(", ")}]`, TypeError);
	return Object.freeze([...i]);
}
function F(e, n, r) {
	if (typeof e != "object" || !e || Array.isArray(e)) throw t(r, e, "an object, such as {}", TypeError);
	for (let i of Object.keys(e)) if (!n.includes(i)) throw t(`${r}.${i}`, e[i], `one of the fields ${n.join(", ")}; remove ${i}`, TypeError);
}
function I(e, n) {
	if (typeof e != "string" || e === "" || e.length > 128) throw t(n, e, "the name of a vertex group of the mesh, such as \"edge\"; make it with a vertex_group mesh edit", TypeError);
	return e;
}
function L(e) {
	F(e, A, "wear");
	let t = e.metal ?? {};
	F(t, M, "wear.metal");
	let n = {
		mask: I(e.mask, "wear.mask"),
		threshold: N(e.threshold, "wear.threshold", T.threshold, w.threshold),
		softness: N(e.softness, "wear.softness", T.softness, w.softness),
		metal: Object.freeze({
			color: P(t.color, "wear.metal.color", E.color),
			metallic: N(t.metallic, "wear.metal.metallic", E.metallic),
			roughness: N(t.roughness, "wear.metal.roughness", E.roughness)
		})
	};
	return e.dirt !== void 0 && (F(e.dirt, j, "wear.dirt"), n.dirt = Object.freeze({
		mask: I(e.dirt.mask, "wear.dirt.mask"),
		threshold: N(e.dirt.threshold, "wear.dirt.threshold", T.threshold, w.threshold),
		softness: N(e.dirt.softness, "wear.dirt.softness", T.softness, w.softness),
		color: P(e.dirt.color, "wear.dirt.color", D.color),
		roughness: N(e.dirt.roughness, "wear.dirt.roughness", D.roughness)
	})), Object.freeze(n);
}
function R(e, n, r, i) {
	let a = e.vertexGroups?.[n];
	if (!a) {
		let a = Object.keys(e.vertexGroups ?? {});
		throw t(r, n, `a vertex group of the mesh of node ${i} (known groups: ${a.join(", ") || "none"}); make one with a vertex_group mesh edit`);
	}
	return a;
}
function z(e, t, n) {
	let r = R(e, t.mask, "wear.mask", n), i = t.dirt ? R(e, t.dirt.mask, "wear.dirt.mask", n) : null, a = new Float32Array(r.length), o = w.levels;
	for (let e = 0; e < a.length; e++) {
		let t = Math.round(Math.min(1, Math.max(0, r[e])) * o), n = i ? Math.round(Math.min(1, Math.max(0, i[e])) * o) : 0;
		a[e] = O + t * k + n;
	}
	return a;
}
var B = /* @__PURE__ */ new WeakMap();
function V(e, n, r) {
	if (e.skyVisibility) throw t("wear", n.mask, `a mesh without baked sky visibility (node ${r} has it); remove wear or the floor sky bake`);
	let i = `${n.mask}|${n.dirt?.mask ?? ""}`, a = B.get(e);
	a || (a = /* @__PURE__ */ new Map(), B.set(e, a));
	let o = a.get(i);
	return o || (o = {
		...e,
		surfaceMasks: z(e, n, r)
	}, a.set(i, o)), o;
}
function H(e) {
	let t = e.dirt;
	return {
		metal: [...e.metal.color, e.metal.metallic],
		dirt: t ? [...t.color, t.roughness] : [
			0,
			0,
			0,
			0
		],
		shape: [
			e.metal.roughness,
			e.threshold,
			e.softness,
			+!!t
		],
		dirtShape: t ? [t.threshold, t.softness] : [.5, .25]
	};
}
export { C as a, y as i, L as n, r as o, H as r, a as s, V as t };
