/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { t as e } from "./shader-registry-DHYkwAg5.js";
import { n as t, t as n } from "./renderer-ecLXY8uQ.js";
import { c as r, i, s as a, t as o } from "./geometry-C1ukZMAo.js";
import { t as s } from "./export-Cb1LGQRe.js";
import { d as c, l, n as u, o as d, r as f, t as p, u as m } from "./mat4-BCZClxna.js";
import { c as h, f as g } from "./quat-Bl7gjwWK.js";
import { i as _, n as v, o as y, r as b, s as x } from "./animation-CO9Tq0E0.js";
import { t as S } from "./scene-graph-D7m1CRQ0.js";
import { i as C, t as w } from "./skinning-DjFQA5hH.js";
import { t as T } from "./morph-CbizhGSZ.js";
import { r as E } from "./environment-DsFt4psZ.js";
import { a as D, n as O, t as k } from "./budget-DiDbAzh2.js";
import { n as A } from "./assembly-CVbal4ya.js";
import { a as j, i as M, o as N } from "./camera-DqWdI22s.js";
import { n as P, t as F } from "./camera-path-C8Pae8D4.js";
import { o as I, s as L } from "./material-wear-BnrzUuEN.js";
// src/version.js
var R = "0.19.0", z = /* @__PURE__ */ new Set([
	"emission",
	"metallic",
	"roughness"
]), B = 1e-8;
function V(e) {
	if (!Number.isFinite(e)) throw TypeError("Mixer times must be finite.");
	return e;
}
function H(e) {
	if (!Number.isFinite(e) || e < 0 || e > 1) throw RangeError("Action weights must be finite and within [0, 1].");
	return e;
}
function U(e) {
	if (!(e.matrix instanceof Float32Array) || e.matrix.length !== 16 || !e.matrix.every(Number.isFinite)) throw TypeError("Mixer parts need finite Float32Array matrices.");
	if (e.matrix[3] !== 0 || e.matrix[7] !== 0 || e.matrix[11] !== 0 || e.matrix[15] !== 1) throw RangeError("Mixer matrices must be affine transforms.");
	let t = p(e.matrix), n = c(/* @__PURE__ */ new Float64Array(3), t), r = m(/* @__PURE__ */ new Float64Array(3), t);
	if (r.some((e) => e < Math.fround(B))) throw RangeError("Mixer matrices need nonzero positive scale.");
	let i = p(t);
	for (let e = 0; e < 3; e++) for (let t = 0; t < 3; t++) i[e * 4 + t] /= r[e];
	if (f(i) < .9999) throw RangeError("Mixer matrices cannot contain shear or reflected scale.");
	let a = h(/* @__PURE__ */ new Float64Array(4), l(/* @__PURE__ */ new Float64Array(4), i));
	return {
		part: e,
		originalMatrix: t,
		matrix: u(),
		base: {
			translation: n,
			rotation: a,
			scale: r,
			material: { ...e.material }
		},
		translation: new Float64Array(n),
		rotation: new Float64Array(a),
		scale: new Float64Array(r),
		properties: /* @__PURE__ */ new Map(),
		material: null,
		hasTransform: !1,
		transformWeight: 0
	};
}
function W(e, t) {
	let n = z.has(t), r, i;
	if (n) {
		let n = e.base.material[t] ?? (t === "emission" ? 0 : NaN);
		if (!Number.isFinite(n) || n < 0 || t === "metallic" && n > 1 || t === "roughness" && (n <= 0 || n > 1)) throw RangeError(`Mixer base ${t} must stay within its material range.`);
		r = new Float64Array([n]), i = /* @__PURE__ */ new Float64Array(1);
	} else {
		if (r = e.base[t], !r) throw RangeError(`Unsupported mixer property: ${t}`);
		i = e[t];
	}
	return {
		binding: e,
		property: t,
		base: r,
		output: i,
		materialProperty: n,
		weight: 0
	};
}
function G(e, t) {
	let n = e.timeline, r = -1, i = n.length;
	for (; i - r > 1;) {
		let e = Math.floor((r + i) / 2);
		n[e].at <= t ? r = e : i = e;
	}
	return r < 0 ? e.initial : n[r];
}
function K(e, t) {
	if (!e.playing) return 0;
	if (t >= e.fadeEnd) return e.toWeight;
	if (t <= e.at) return e.fromWeight;
	let n = (t - e.at) / (e.fadeEnd - e.at);
	return e.fromWeight * (1 - n) + e.toWeight * n;
}
function q(e, t) {
	V(t);
	let n = e.timeline;
	if (n.length && t < n[n.length - 1].at) throw RangeError("Schedule action controls in nondecreasing time order.");
	return G(e, t);
}
function J(e, { at: t = 0, offset: n = 0, timeScale: r = 1, weight: i = 1 } = {}) {
	if (q(e, t), V(n), !Number.isFinite(r)) throw TypeError("Action timeScale must be finite.");
	return H(i), {
		at: t,
		playing: !0,
		origin: t,
		offset: n,
		timeScale: r,
		fromWeight: i,
		toWeight: i,
		fadeEnd: t
	};
}
function Y(e, t, n, r, i = q(e, n)) {
	if (H(t), !Number.isFinite(r) || r <= 0 || !Number.isFinite(n + r) || n + r <= n) throw RangeError("Fade duration must produce a finite end time after its start.");
	if (!i.playing) throw RangeError("Play the action before scheduling its fade.");
	return {
		...i,
		at: n,
		fromWeight: K(i, n),
		toWeight: t,
		fadeEnd: n + r
	};
}
function X(e, t, n) {
	let r = e.weight + n;
	if (e.weight === 0) e.output.set(t);
	else {
		let i = n / r;
		if (e.property === "rotation") g(e.output, e.output, t, i);
		else for (let n = 0; n < e.output.length; n++) e.output[n] = e.output[n] * (1 - i) + t[n] * i;
	}
	e.weight = r;
}
function Z(e) {
	let t = e.output;
	if (e.weight < 1 && e.weight > 0) {
		if (e.property === "rotation") g(t, e.base, t, e.weight);
		else for (let n = 0; n < t.length; n++) t[n] = t[n] * e.weight + e.base[n] * (1 - e.weight);
	}
	for (let n = 0; n < t.length; n++) {
		if (!Number.isFinite(t[n])) throw RangeError("Mixed animation output must be finite.");
		(e.property === "scale" || e.property === "roughness") && (t[n] = Math.max(B, t[n])), e.property === "emission" && (t[n] = Math.max(0, t[n])), e.property === "metallic" && (t[n] = Math.max(0, t[n])), (e.property === "metallic" || e.property === "roughness") && (t[n] = Math.min(1, t[n]));
	}
	if (e.property === "rotation") {
		let e = Math.hypot(t[0], t[1], t[2], t[3]);
		if (!Number.isFinite(e) || e === 0) throw RangeError("Mixed rotation must be a finite nonzero quaternion.");
		for (let n = 0; n < 4; n++) t[n] /= e;
	}
	e.materialProperty || (e.binding.transformWeight += e.weight);
}
function Q(e) {
	if (!Array.isArray(e)) throw TypeError("Mixer parts must be an array.");
	let t = /* @__PURE__ */ new Map(), n = [];
	for (let r of e) {
		if (!r || typeof r.name != "string" || !r.name.trim()) throw TypeError("Mixer parts need names.");
		if (t.has(r.name)) throw RangeError(`Duplicate mixer part name: ${r.name}`);
		let e = U(r);
		t.set(r.name, e), n.push(e);
	}
	let r = [], i = [], a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), s = 0;
	function c(e) {
		if (a.has(e)) return a.get(e);
		let n = v(e), c = [], l = [];
		for (let e of n.tracks) {
			let n = t.get(e.target);
			if (!n) throw RangeError(`Mixer target was not found: ${e.target}`);
			if (e.property === "value") throw RangeError("Value tracks cannot bind to mixer parts.");
			let r = n.properties.get(e.property) ?? W(n, e.property);
			n.properties.has(e.property) || l.push(r), c.push({
				property: r,
				sample: e.output
			});
		}
		let u = {
			sampler: n,
			entries: c,
			timeline: [],
			initial: {
				at: -Infinity,
				playing: !1,
				origin: 0,
				offset: 0,
				timeScale: 1,
				fromWeight: 0,
				toWeight: 0,
				fadeEnd: -Infinity
			}
		}, d = Object.freeze({
			clip: e,
			play({ at: e = s, offset: t = 0, timeScale: n = 1, weight: r = 1 } = {}) {
				return u.timeline.push(J(u, {
					at: e,
					offset: t,
					timeScale: n,
					weight: r
				})), d;
			},
			stop(e = s) {
				let t = q(u, e);
				return u.timeline.push({
					...t,
					at: e,
					playing: !1,
					fromWeight: 0,
					toWeight: 0,
					fadeEnd: e
				}), d;
			},
			fadeTo(e, { at: t = s, duration: n } = {}) {
				return u.timeline.push(Y(u, e, t, n)), d;
			},
			getState(e = s) {
				V(e);
				let t = G(u, e), n = "stopped";
				return t.playing && (n = e < t.fadeEnd ? "fading" : "playing"), t === u.initial && u.timeline.length && u.timeline[0].playing && (n = "scheduled"), {
					phase: n,
					playing: t.playing,
					weight: K(t, e),
					localTime: t.playing ? (e - t.origin) * t.timeScale + t.offset : null
				};
			}
		});
		for (let e of l) {
			let t = e.binding;
			t.properties.set(e.property, e), r.push(e), e.materialProperty ? t.material ||= y(t.part) : t.hasTransform = !0;
		}
		return i.push(u), a.set(e, d), o.set(d, u), d;
	}
	let l = {
		clipAction: c,
		get time() {
			return s;
		},
		crossFade(e, t, { at: n = s, duration: r } = {}) {
			let i = o.get(e), a = o.get(t);
			if (!i || !a || i === a) throw RangeError("Crossfade needs two distinct actions from this mixer.");
			let c = Y(i, 0, n, r), u = q(a, n), d = Y(a, 1, n, r, u.playing ? u : J(a, {
				at: n,
				weight: 0
			}));
			return i.timeline.push(c), a.timeline.push(d), l;
		},
		apply(t) {
			V(t);
			for (let e = 0; e < r.length; e++) {
				let t = r[e];
				t.output.set(t.base), t.weight = 0;
			}
			for (let e = 0; e < n.length; e++) n[e].transformWeight = 0;
			for (let e = 0; e < i.length; e++) {
				let n = i[e], r = G(n, t), a = K(r, t);
				if (a !== 0) {
					n.sampler.sample((t - r.origin) * r.timeScale + r.offset);
					for (let e = 0; e < n.entries.length; e++) {
						let t = n.entries[e];
						X(t.property, t.sample, a);
					}
				}
			}
			for (let e = 0; e < r.length; e++) Z(r[e]);
			for (let e = 0; e < n.length; e++) {
				let t = n[e];
				if (t.hasTransform) {
					t.transformWeight === 0 ? t.matrix.set(t.originalMatrix) : d(t.matrix, t.rotation, t.translation, t.scale);
					for (let e = 0; e < 16; e++) if (!Number.isFinite(t.matrix[e])) throw RangeError("Mixed matrix exceeds the finite Float32 range.");
				}
			}
			for (let e = 0; e < r.length; e++) {
				let t = r[e];
				t.materialProperty && (t.binding.material[t.property] = t.output[0]);
			}
			for (let e = 0; e < n.length; e++) {
				let t = n[e];
				t.hasTransform && t.part.matrix.set(t.matrix);
			}
			return s = t, e;
		}
	};
	return l;
}
export { I as EFFECT_PRESETS, n as Glaze, n as Renderer67, e as MAX_MORPH_TARGETS, k as RENDER_PRESETS, R as VERSION, A as assemblyOffset, o as box, M as cameraView, b as createAnimationClip, Q as createAnimationMixer, _ as createAnimationPlayer, F as createCameraPath, E as createEnvironmentMap, T as createMorphPose, S as createSceneGraph, w as createSkinPose, i as cylinder, O as estimateFrameBytes, s as exportGlb, j as fitOrthographicHeight, N as fitPerspectiveDistance, P as fovFromFocalLength, D as planRenderSize, L as resolveEffects, x as sampleAnimationClip, t as shaderFeatureRepresentatives, a as sphere, r as torus, C as updateSkinPose };
