/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { r as e } from "./camera-DqWdI22s.js";
import { n as t } from "./ray-query-CWJhfYYD.js";
import { r as n } from "./light-profile-BGXnJOGo.js";
import { i as r, n as i, o as a } from "./path-tracer-scene-Thw9vHJu.js";
import { t as o } from "./path-tracer-denoise-j_ATlMbO.js";
import { acesChannel as s, displayColor as c } from "./view-transform.js";
import { n as l } from "./view-transform-names-CDWKtFlr.js";
import { _ as u, a as d, c as f, d as p, f as m, g as h, h as g, i as _, l as v, m as y, n as b, o as x, p as S, s as C, t as w, u as T } from "./path-tracer-subsurface-Dyu5_MBA.js";
import { i as E, n as D, r as O } from "./path-tracer-light-tree-BZYzVWXO.js";
import { a as ee, n as k, o as A, t as te } from "./path-tracer-volume-MKWQbCqG.js";
// src/path-tracer.js
var j = Object.freeze({
	width: Object.freeze({
		minimum: 16,
		maximum: 4096,
		fallback: 960
	}),
	height: Object.freeze({
		minimum: 16,
		maximum: 4096,
		fallback: 540
	}),
	samples: Object.freeze({
		minimum: 1,
		maximum: 1024,
		fallback: 64
	}),
	bounces: Object.freeze({
		minimum: 1,
		maximum: 16,
		fallback: 8
	}),
	maxSeconds: Object.freeze({
		minimum: 1,
		maximum: 1800,
		fallback: 300
	}),
	fireflyClamp: Object.freeze({
		minimum: 1,
		maximum: 1e3,
		fallback: 20
	}),
	noiseThreshold: Object.freeze({
		minimum: 0,
		maximum: 1,
		fallback: 0
	}),
	seed: Object.freeze({
		minimum: 0,
		maximum: 2 ** 31 - 1,
		fallback: 0
	}),
	threads: Object.freeze({
		minimum: 1,
		maximum: 8,
		fallback: 4
	})
}), M = 2073600, N = 4e9, P = 64, F = 8, I = "./path-tracer-worker.js", ne = 3, L = 16, R = 8, z = .05, B = ["occlusionMap"], V = [
	["anisotropy", (e) => e.anisotropy > 0],
	["iridescence", (e) => e.iridescence > 0],
	["sheen", (e) => (e.sheenColor ?? []).some((e) => e !== 0)],
	["moss", (e) => e.moss > 0],
	["splat layers", (e) => !!(e.layers || Object.keys(e.layerMaps ?? {}).some((e) => e !== "clearcoatTexture"))],
	["lightMap", (e) => !!e.lightMap]
];
function H(e) {
	return e.pattern?.type === "graph" && Object.hasOwn(e.pattern.graph ?? {}, "opacity");
}
function U(e, t) {
	let n = j[t], r = e[t] ?? n.fallback;
	if (!Number.isInteger(r) || r < n.minimum || r > n.maximum) throw RangeError(`Path tracer ${t} must be an integer from ${n.minimum} to ${n.maximum}.`);
	return r;
}
function W(e, t) {
	let n = j[t], r = e[t] ?? n.fallback;
	if (typeof r != "number" || !Number.isFinite(r) || r < n.minimum || r > n.maximum) throw RangeError(`Path tracer ${t} must be a number from ${n.minimum} to ${n.maximum}.`);
	return r;
}
var re = Object.freeze([
	"wavelet",
	"oidn",
	"none"
]), G = Object.freeze(["random", "blue-noise-first"]), K = Object.freeze([
	"auto",
	"uniform",
	"importance",
	"tree"
]);
function ie(e) {
	if (e === !0) return "wavelet";
	if (e === !1) return "none";
	if (re.includes(e)) return e;
	throw TypeError(`Path tracer denoise must be a boolean or one of ${re.join(", ")}.`);
}
var ae = [
	"cpu",
	"gpu",
	"webgpu"
];
function oe(e = {}) {
	if (typeof e != "object" || !e) throw TypeError("Path tracer options must be an object.");
	let t = {
		width: U(e, "width"),
		height: U(e, "height"),
		samples: U(e, "samples"),
		bounces: U(e, "bounces"),
		seed: U(e, "seed"),
		threads: U(e, "threads"),
		maxSeconds: W(e, "maxSeconds"),
		fireflyClamp: W(e, "fireflyClamp"),
		noiseThreshold: W(e, "noiseThreshold"),
		denoiser: ie(e.denoise ?? !0),
		viewTransform: e.viewTransform ?? "aces",
		look: e.look ?? null,
		backend: e.backend ?? "cpu",
		samplingPattern: e.samplingPattern ?? "random",
		lightSelection: e.lightSelection ?? "auto"
	};
	if (t.denoise = t.denoiser !== "none", !l.includes(t.viewTransform)) throw RangeError(`Path tracer viewTransform must be one of ${l.join(", ")}.`);
	if (!ae.includes(t.backend)) throw TypeError("Path tracer backend must be \"cpu\", \"gpu\" or \"webgpu\".");
	if (!G.includes(t.samplingPattern)) throw RangeError(`Path tracer samplingPattern must be one of ${G.join(", ")}.`);
	if (!K.includes(t.lightSelection)) throw RangeError(`Path tracer lightSelection must be one of ${K.join(", ")}.`);
	if (t.backend !== "gpu" && t.samplingPattern !== "random") throw RangeError("Path tracer samplingPattern \"blue-noise-first\" needs backend \"gpu\"; the CPU reference and the WebGPU tracer draw random samples.");
	if (t.lightSelection === "importance" && t.backend !== "gpu") throw RangeError("Path tracer lightSelection \"importance\" needs backend \"gpu\"; the CPU reference and the WebGPU tracer pick lights uniformly; \"tree\" also runs on the WebGPU tracer.");
	if (t.width * t.height > 2073600) throw RangeError(`A path trace takes at most ${M} pixels.`);
	if (t.width * t.height * t.samples * (t.bounces + 1) > 4e9) throw RangeError("This path trace would need too much ray work: lower the size, samples or bounces.");
	return t;
}
function q(e, t) {
	if (!Array.isArray(e) || e.length !== 3 || e.some((e) => typeof e != "number" || !Number.isFinite(e))) throw TypeError(`Path tracer camera ${t} must be three finite numbers.`);
	return e;
}
function J(t, n, r) {
	let i = q(t.eye, "eye"), a = q(t.target, "target"), o = q(t.up ?? [
		0,
		1,
		0
	], "up");
	if (t.projection === "orthographic" || t.shift) throw RangeError("The path tracer draws perspective cameras without lens shift. Render those without the renderer option.");
	let s = t.focalLength === void 0 ? t.fov : e(t, n / r);
	if (typeof s != "number" || !(s > 1 && s < 170)) throw RangeError("Path tracer camera fov must be between 1 and 170 degrees.");
	let c = [
		a[0] - i[0],
		a[1] - i[1],
		a[2] - i[2]
	], l = Math.hypot(...c);
	if (l === 0) throw RangeError("Path tracer camera eye and target must differ.");
	for (let e = 0; e < 3; e++) c[e] /= l;
	let u = [
		c[1] * o[2] - c[2] * o[1],
		c[2] * o[0] - c[0] * o[2],
		c[0] * o[1] - c[1] * o[0]
	], d = Math.hypot(...u);
	if (d === 0) throw RangeError("Path tracer camera up must not be parallel to its view.");
	for (let e = 0; e < 3; e++) u[e] /= d;
	let f = [
		u[1] * c[2] - u[2] * c[1],
		u[2] * c[0] - u[0] * c[2],
		u[0] * c[1] - u[1] * c[0]
	], p = Math.tan(s * Math.PI / 360);
	return {
		eye: i,
		forward: c,
		right: u,
		above: f,
		halfHeight: p,
		halfWidth: p * n / r
	};
}
function se() {
	let e = 1;
	return {
		reset(t, n, r) {
			let i = Math.imul(t + 2654435769, 2246822507) ^ Math.imul(n + 2135587861, 3266489909) ^ Math.imul(r + 374761393, 668265263);
			i = Math.imul(i ^ i >>> 15, 739982445), i = Math.imul(i ^ i >>> 12, 695872825), i ^= i >>> 15, e = i === 0 ? 1 : i;
		},
		next() {
			e = Math.imul(e, 747796405) + 2891336453 >>> 0;
			let t = Math.imul(e >>> (e >>> 28) + 4 ^ e, 277803737);
			return ((t >>> 22 ^ t) >>> 0) / 4294967296;
		}
	};
}
function ce() {
	return {
		distance: 0,
		material: null,
		point: /* @__PURE__ */ new Float64Array(3),
		normal: /* @__PURE__ */ new Float64Array(3),
		color: /* @__PURE__ */ new Float64Array(3),
		texel: /* @__PURE__ */ new Float64Array(4),
		mapTexel: /* @__PURE__ */ new Float64Array(4),
		emission: /* @__PURE__ */ new Float64Array(3),
		metallic: 0,
		roughness: 0,
		clearcoat: 0,
		transmission: 0
	};
}
var Y = /* @__PURE__ */ new Float64Array(6), X = /* @__PURE__ */ new Float64Array(4);
function le(e, t, n, r) {
	let i = Y[0], a = Y[1], o = Y[2], s = Y[3], c = Y[4], l = Y[5], u = X[0], d = X[1], f = X[2], p = X[3], m = u * p - f * d;
	if (Math.abs(m) < 1e-12) return;
	let h = t.normal[0], g = t.normal[1], _ = t.normal[2], v = (i * p - s * d) / m, y = (a * p - c * d) / m, b = (o * p - l * d) / m, x = (s * u - i * f) / m, S = (c * u - a * f) / m, C = (l * u - o * f) / m, w = v * h + y * g + b * _;
	v -= h * w, y -= g * w, b -= _ * w;
	let T = Math.hypot(v, y, b);
	if (T === 0) return;
	v /= T, y /= T, b /= T;
	let E = g * b - _ * y, D = _ * v - h * b, O = h * y - g * v, ee = Math.hypot(E, D, O) || 1, k = E * x + D * S + O * C < 0 ? -1 : 1;
	E *= k / ee, D *= k / ee, O *= k / ee;
	let { mapTexel: A } = t;
	Z(e.normalTexture, n, r, A);
	let te = (A[0] * 2 - 1) * e.normalScale[0], j = (A[1] * 2 - 1) * e.normalScale[1], M = A[2] * 2 - 1, N = v * te + E * j + h * M, P = y * te + D * j + g * M, F = b * te + O * j + _ * M, I = Math.hypot(N, P, F);
	I > 1e-6 && (t.normal[0] = N / I, t.normal[1] = P / I, t.normal[2] = F / I);
}
function Z(e, t, n, r) {
	let { width: i, height: a, data: o, colorLookup: s, repeat: c } = e, l = t * i - .5, u = n * a - .5, d = Math.floor(l), f = Math.floor(u), p = l - d, m = u - f;
	r[0] = 0, r[1] = 0, r[2] = 0, r[3] = 0;
	for (let e = 0; e < 4; e++) {
		let t = d + (e & 1), n = f + (e >> 1);
		t = c ? (t % i + i) % i : Math.max(0, Math.min(i - 1, t)), n = c ? (n % a + a) % a : Math.max(0, Math.min(a - 1, n));
		let l = (e & 1 ? p : 1 - p) * (e >> 1 ? m : 1 - m), u = (n * i + t) * 4;
		for (let e = 0; e < 3; e++) r[e] += l * (s ? s[o[u + e]] : o[u + e] / 255);
		r[3] += l * o[u + 3] / 255;
	}
}
var ue = /* @__PURE__ */ new Uint32Array(3), Q = /* @__PURE__ */ new Float64Array(3);
function de(e, t, n, r, i, a, o, s, c, l) {
	let { positions: u, normals: d, uvs: f, colors: p, indices: m } = e, h = m[t * 3], g = m[t * 3 + 1], _ = m[t * 3 + 2];
	l.distance = c, l.point[0] = n + a * c, l.point[1] = r + o * c, l.point[2] = i + s * c;
	let v = u[g * 3] - u[h * 3], y = u[g * 3 + 1] - u[h * 3 + 1], b = u[g * 3 + 2] - u[h * 3 + 2], x = u[_ * 3] - u[h * 3], S = u[_ * 3 + 1] - u[h * 3 + 1], C = u[_ * 3 + 2] - u[h * 3 + 2], w = l.point[0] - u[h * 3], T = l.point[1] - u[h * 3 + 1], E = l.point[2] - u[h * 3 + 2], D = v * v + y * y + b * b, O = v * x + y * S + b * C, ee = x * x + S * S + C * C, k = w * v + T * y + E * b, A = w * x + T * S + E * C, te = D * ee - O * O || 1, j = (ee * k - O * A) / te, M = (D * A - O * k) / te, N = 1 - j - M, P = 0, F = 0, I = 0, ne = 0, L = 0, R = 0, z = 0, B = 0;
	ue[0] = h, ue[1] = g, ue[2] = _, Q[0] = N, Q[1] = j, Q[2] = M;
	for (let e = 0; e < 3; e++) {
		let t = ue[e], n = Q[e];
		P += n * d[t * 3], F += n * d[t * 3 + 1], I += n * d[t * 3 + 2], ne += n * p[t * 3], L += n * p[t * 3 + 1], R += n * p[t * 3 + 2], z += n * f[t * 2], B += n * f[t * 2 + 1];
	}
	let V = Math.hypot(P, F, I) || 1;
	l.normal[0] = P / V, l.normal[1] = F / V, l.normal[2] = I / V;
	let H = e.materials[e.triangleMaterial[t]];
	l.material = H;
	let U = 1;
	return l.color[0] = H.color[0] * ne, l.color[1] = H.color[1] * L, l.color[2] = H.color[2] * R, H.texture && (Z(H.texture, z, B, l.texel), l.color[0] *= l.texel[0], l.color[1] *= l.texel[1], l.color[2] *= l.texel[2], U = l.texel[3]), l.emission[0] = H.emission[0], l.emission[1] = H.emission[1], l.emission[2] = H.emission[2], H.emissiveTexture && (Z(H.emissiveTexture, z, B, l.mapTexel), l.emission[0] *= l.mapTexel[0], l.emission[1] *= l.mapTexel[1], l.emission[2] *= l.mapTexel[2]), l.metallic = H.metallic, l.roughness = H.roughness, l.clearcoat = H.clearcoat, l.transmission = H.transmission, H.clearcoatTexture && (Z(H.clearcoatTexture, z, B, l.mapTexel), l.clearcoat *= l.mapTexel[0]), H.transmissionTexture && (Z(H.transmissionTexture, z, B, l.mapTexel), l.transmission *= l.mapTexel[0]), H.surfaceTexture && (Z(H.surfaceTexture, z, B, l.mapTexel), l.roughness *= l.mapTexel[1], l.metallic *= l.mapTexel[2]), H.normalTexture && (Y[0] = v, Y[1] = y, Y[2] = b, Y[3] = x, Y[4] = S, Y[5] = C, X[0] = f[g * 2] - f[h * 2], X[1] = f[g * 2 + 1] - f[h * 2 + 1], X[2] = f[_ * 2] - f[h * 2], X[3] = f[_ * 2 + 1] - f[h * 2 + 1], le(H, l, z, B)), U;
}
function fe(e, t, n, r, i, a, o, s) {
	let c = t, l = n, u = r, d = 0;
	for (let t = 0; t < P; t++) {
		let t = e.tracer.trace(c, l, u, i, a, o, e.farDistance, !1);
		if (t.nearestTriangle < 0) return !1;
		let n = de(e, t.nearestTriangle, c, l, u, i, a, o, t.nearestDistance, s);
		if (s.material.alphaCutoff === 0 || n >= s.material.alphaCutoff) return s.distance += d, !0;
		let r = t.nearestDistance + e.surfaceOffset;
		d += r, c += i * r, l += a * r, u += o * r;
	}
	return !1;
}
function pe(e, t, n, r, i, a, o, s, c) {
	let l = t, u = n, d = r, f = s, p = !0;
	for (let t = 0; t < P; t++) {
		let t = e.tracer.trace(l, u, d, i, a, o, f, p);
		if (t.nearestTriangle < 0) return !1;
		if (e.materials[e.triangleMaterial[t.nearestTriangle]].alphaCutoff === 0 || de(e, t.nearestTriangle, l, u, d, i, a, o, t.nearestDistance, c) >= c.material.alphaCutoff) return !0;
		if (p) {
			p = !1;
			continue;
		}
		let n = t.nearestDistance + e.surfaceOffset;
		if (f -= n, f <= 0) return !1;
		l += i * n, u += a * n, d += o * n;
	}
	return !0;
}
function me(e) {
	return e * e * (3 - 2 * e);
}
function he(e, r) {
	let a = d(), o = ce(), s = ce(), c = /* @__PURE__ */ new Float64Array(3), l = /* @__PURE__ */ new Float64Array(3), v = /* @__PURE__ */ new Float64Array(3), j = /* @__PURE__ */ new Float64Array(3), M = /* @__PURE__ */ new Float64Array(3), N = /* @__PURE__ */ new Float64Array(3), P = /* @__PURE__ */ new Float64Array(9), F = /* @__PURE__ */ new Float64Array(3), I = /* @__PURE__ */ new Float64Array(3), L = {
		albedo: /* @__PURE__ */ new Float64Array(3),
		normal: /* @__PURE__ */ new Float64Array(3),
		depth: 0
	}, R = se(), z = !1, { lights: B, environment: V } = e;
	B.sun && _(B.sun.direction, P);
	let H = Math.cos(B.sun?.angularRadius ?? i);
	function U(e, t, n, i) {
		let a = t, o = n, s = i;
		if (e > 0) {
			let e = Math.max(t, n, i);
			if (e > r.fireflyClamp) {
				let t = r.fireflyClamp / e;
				a *= t, o *= t, s *= t;
			}
		}
		l[0] += a, l[1] += o, l[2] += s;
	}
	let W = !1, re = { pdf: 0 }, G = /* @__PURE__ */ new Float64Array(2), K = /* @__PURE__ */ new Float64Array(9), ie = /* @__PURE__ */ new Float64Array(3);
	function ae(t, n, r, i) {
		let { volume: a } = e;
		return !a || !A(a, t, n, r, j[0], j[1], j[2], i, G) ? 1 : Math.exp(-a.density * (G[1] - G[0]));
	}
	function oe(t, n, r) {
		let { volume: i } = e, a = j[0] * v[0] + j[1] * v[1] + j[2] * v[2], l = k(i.anisotropy, a), [u, d, f] = o.point;
		if (pe(e, u, d, f, j[0], j[1], j[2], n, s)) return;
		re.pdf = l;
		let p = l * ae(u, d, f, n) * r(re);
		U(t + 1, c[0] * M[0] * p, c[1] * M[1] * p, c[2] * M[2] * p);
	}
	function q(t, n, r, i) {
		if (W) {
			oe(t, r, i);
			return;
		}
		let l = n[0] * j[0] + n[1] * j[1] + n[2] * j[2];
		if (l <= 0) return;
		f(a, j[0], j[1], j[2]);
		let u = a.value;
		if (u[0] + u[1] + u[2] <= 0) return;
		let d = o.point[0] + n[0] * e.surfaceOffset, p = o.point[1] + n[1] * e.surfaceOffset, m = o.point[2] + n[2] * e.surfaceOffset;
		if (pe(e, d, p, m, j[0], j[1], j[2], r, s)) return;
		let h = l * i(a) * ae(d, p, m, r);
		U(t, c[0] * u[0] * M[0] * h, c[1] * u[1] * M[1] * h, c[2] * u[2] * M[2] * h);
	}
	let J = 1, Y = () => 1 / J, X = (e) => W || (o.material.lightMask >> e.bit & 1) == 1;
	function le(t, n) {
		if (!X(B.sun)) return;
		let r = 1 - R.next() * (1 - H), i = Math.sqrt(Math.max(0, 1 - r * r)), a = 2 * Math.PI * R.next(), o = i * Math.cos(a), s = i * Math.sin(a);
		for (let e = 0; e < 3; e++) j[e] = P[e] * o + P[3 + e] * s + P[6 + e] * r;
		for (let e = 0; e < 3; e++) M[e] = B.sun.color[e];
		q(t, n, e.farDistance, Y);
	}
	function Z(e, t, n) {
		let r = e - o.point[0], i = t - o.point[1], a = n - o.point[2], s = r * r + i * i + a * a, c = Math.sqrt(s);
		return j[0] = r / c, j[1] = i / c, j[2] = a / c, {
			distance: c,
			distanceSquared: s
		};
	}
	function ue(e, t) {
		let n = 2 * R.next() - 1, r = 2 * Math.PI * R.next(), i = Math.sqrt(1 - n * n);
		t[0] = e * i * Math.cos(r), t[1] = e * n, t[2] = e * i * Math.sin(r);
	}
	let Q = /* @__PURE__ */ new Float64Array(3);
	function de(n, r, i) {
		if (!X(i)) return;
		ue(i.radius, Q);
		let { distance: a, distanceSquared: o } = Z(i.position[0] + Q[0], i.position[1] + Q[1], i.position[2] + Q[2]);
		if (a < 1e-6) return;
		let s = i.intensity * t(o, i);
		for (let e = 0; e < 3; e++) M[e] = i.color[e] * s;
		q(n, r, a - e.surfaceOffset, Y);
	}
	function he(r, i, a) {
		if (!X(a)) return;
		ue(a.radius, Q);
		let { distance: o, distanceSquared: s } = Z(a.position[0] + Q[0], a.position[1] + Q[1], a.position[2] + Q[2]);
		if (o < 1e-6) return;
		let c = -(a.direction[0] * j[0] + a.direction[1] * j[1] + a.direction[2] * j[2]), l = c - a.cosineHalfAngle;
		if (l <= 0) return;
		let u = a.blend > 0 && l < a.blend ? me(l / a.blend) : 1, d = a.intensity * t(s, a) * u * (a.profile ? n(a.profile, c) : 1);
		for (let e = 0; e < 3; e++) M[e] = a.color[e] * d;
		q(r, i, o - e.surfaceOffset, Y);
	}
	function ge(t, r, i) {
		if (!X(i)) return;
		let a = (R.next() - .5) * i.width, o = (R.next() - .5) * i.height, { distance: s, distanceSquared: c } = Z(i.position[0] + i.across[0] * a + i.along[0] * o, i.position[1] + i.across[1] * a + i.along[1] * o, i.position[2] + i.across[2] * a + i.along[2] * o);
		if (s < 1e-6) return;
		let l = -(i.normal[0] * j[0] + i.normal[1] * j[1] + i.normal[2] * j[2]);
		if (l <= 0) return;
		let u = i.intensity * l / c * (i.profile ? n(i.profile, l) : 1);
		for (let e = 0; e < 3; e++) M[e] = i.color[e] * u;
		q(t, r, s - e.surfaceOffset, Y);
	}
	let _e = 0, ve = (e) => {
		let t = _e * J, n = t * t + e.pdf * e.pdf;
		return t * t / n / t;
	};
	function ye(t, n) {
		_e = S(V, R.next(), R.next(), R.next(), R.next(), j), _e > 0 && (C(V, j[0], j[1], j[2], M), q(t, n, e.farDistance, ve));
	}
	let $ = +!!B.sun + B.points.length + B.spots.length + B.areas.length + +!!V;
	function be(e, t) {
		J = 1, B.sun && le(e, t);
		for (let n of B.points) de(e, t, n);
		for (let n of B.spots) he(e, t, n);
		for (let n of B.areas) ge(e, t, n);
		V && ye(e, t);
	}
	let xe = B.points.length + B.spots.length + B.areas.length, Se = E(r.lightSelection, B) === "tree" && xe > 1, Ce = Se ? D(B) : null, we = () => R.next();
	function Te(e, t, n) {
		return n < B.points.length ? de(e, t, B.points[n]) : (n -= B.points.length, n < B.spots.length ? he(e, t, B.spots[n]) : ge(e, t, B.areas[n - B.spots.length]));
	}
	let Ee = /* @__PURE__ */ new Map(), De = () => [
		...B.points,
		...B.spots,
		...B.areas
	];
	function Oe() {
		let e = W ? -1 : o.material.lightMask, t = Ee.get(e);
		return t || (t = [], De().forEach((n, r) => {
			(e >> n.bit & 1) == 1 && t.push(r);
		}), Ee.set(e, t)), t;
	}
	function ke(e, t) {
		let n = xe / $, r = Math.floor(R.next() * $);
		if (B.sun) {
			if (r === 0) return J = 1 / $, le(e, t);
			r--;
		}
		if (r >= xe) return J = 1 / $, ye(e, t);
		let i = Oe();
		if (i.length < xe) {
			if (J = 1 / $, i.length === 0) return;
			J = n / i.length, Te(e, t, i[Math.floor(R.next() * i.length)]), J = 1 / $;
			return;
		}
		let a = O(Ce, o.point[0], o.point[1], o.point[2], t[0], t[1], t[2], we);
		J = 1 / $, a.lightIndex < 0 || (J = n * a.probability, Te(e, t, a.lightIndex), J = 1 / $);
	}
	function Ae(e, t) {
		J = 1 / $;
		let n = Math.floor(R.next() * $);
		if (B.sun) {
			if (n === 0) return le(e, t);
			n--;
		}
		return n < B.points.length ? de(e, t, B.points[n]) : (n -= B.points.length, n < B.spots.length ? he(e, t, B.spots[n]) : (n -= B.spots.length, n < B.areas.length ? ge(e, t, B.areas[n]) : ye(e, t)));
	}
	function je(e, t) {
		e === 0 && !(Se && xe > 16) || $ <= 1 ? be(e, t) : Se ? ke(e, t) : Ae(e, t);
	}
	function Me(e, t, n) {
		if (!V) return;
		C(V, v[0], v[1], v[2], N);
		let r = 1;
		if (!n) {
			let e = x(V, v[0], v[1], v[2]) * J;
			r = t * t / (t * t + e * e);
		}
		U(e, c[0] * N[0] * r, c[1] * N[1] * r, c[2] * N[2] * r);
	}
	function Ne(e, t) {
		L.albedo[0] = t ? 1 : o.color[0], L.albedo[1] = t ? 1 : o.color[1], L.albedo[2] = t ? 1 : o.color[2], L.normal[0] = e[0], L.normal[1] = e[1], L.normal[2] = e[2], L.depth = o.distance;
	}
	function Pe(e) {
		if (e < ne) return !0;
		let t = Math.min(.95, Math.max(.05, Math.max(c[0], c[1], c[2])));
		if (R.next() >= t) return !1;
		for (let e = 0; e < 3; e++) c[e] /= t;
		return !0;
	}
	function Fe(t, n, r, i) {
		let { volume: a } = e;
		if (!A(a, t, n, r, v[0], v[1], v[2], i, G)) return !1;
		let s = G[0] - Math.log(1 - R.next()) / a.density;
		return s >= G[1] ? !1 : (o.point[0] = t + v[0] * s, o.point[1] = n + v[1] * s, o.point[2] = r + v[2] * s, !0);
	}
	function Ie(t) {
		let { volume: n } = e;
		for (let e = 0; e < 3; e++) c[e] *= n.albedo[e];
		W = !0, je(t, I), W = !1;
		let r = ee(n.anisotropy, R.next()), i = Math.sqrt(Math.max(0, 1 - r * r)), a = 2 * Math.PI * R.next();
		_(v, K);
		for (let e = 0; e < 3; e++) ie[e] = K[e] * i * Math.cos(a) + K[3 + e] * i * Math.sin(a) + K[6 + e] * r;
		for (let e = 0; e < 3; e++) v[e] = ie[e];
		return k(n.anisotropy, r);
	}
	let Le = e.localVolumes ? te(e.localVolumes) : null, Re = /* @__PURE__ */ new Float64Array(3), ze = b(e, R, fe), Be = /* @__PURE__ */ new Float64Array(3);
	function Ve(e, t) {
		let n = t.color ?? o.color;
		Be.fill(1);
		let r = ze(t, n, o.point[0], o.point[1], o.point[2], I, o.material, s, Be);
		if (r === w.lost) return !1;
		let i = a.diffuseShare * t.weight / a.subsurfaceChance;
		if (r === w.exit) {
			let e = s.normal[0] * ze.direction[0] + s.normal[1] * ze.direction[1] + s.normal[2] * ze.direction[2] < 0 ? -1 : 1;
			for (let t = 0; t < 3; t++) o.point[t] = s.point[t], I[t] = s.normal[t] * e;
			for (let e = 0; e < 3; e++) c[e] *= Be[e] * i;
		} else {
			if (R.next() < .5) for (let e = 0; e < 3; e++) I[e] = -I[e];
			for (let e = 0; e < 3; e++) c[e] *= n[e] * i;
		}
		return h(a, I), je(e, I), !0;
	}
	function He(t, n, i, s, d, h, _, b) {
		R.reset(_, b, r.seed), l[0] = 0, l[1] = 0, l[2] = 0, c[0] = 1, c[1] = 1, c[2] = 1, L.albedo.fill(1), z = !1, L.normal[0] = 0, L.normal[1] = 0, L.normal[2] = 1, L.depth = 0, v[0] = s, v[1] = d, v[2] = h;
		let x = t, S = n, C = i, w = 0, E = !0;
		for (let t = 0; t <= r.bounces; t++) {
			let n = fe(e, x, S, C, v[0], v[1], v[2], o), r = e.volume && Fe(x, S, C, n ? o.distance : e.farDistance);
			if (Le) {
				let i = r ? Math.hypot(o.point[0] - x, o.point[1] - S, o.point[2] - C) : n ? o.distance : e.farDistance;
				Le(x, S, C, v[0], v[1], v[2], i, R.next(), c, Re), U(t, Re[0], Re[1], Re[2]);
			}
			if (r) {
				if (w = Ie(t), E = !1, x = o.point[0], S = o.point[1], C = o.point[2], !Pe(t)) break;
				continue;
			}
			if (!n) {
				Me(t, w, E);
				break;
			}
			let i = o.material, s = o.normal[0] * v[0] + o.normal[1] * v[1] + o.normal[2] * v[2] < 0, l = s ? 1 : -1;
			I[0] = o.normal[0] * l, I[1] = o.normal[1] * l, I[2] = o.normal[2] * l;
			let d = o.transmission > 0 && R.next() < o.transmission;
			z ||= (Ne(I, d), !0), U(t, c[0] * o.emission[0], c[1] * o.emission[1], c[2] * o.emission[2]);
			let h = -v[0], _ = -v[1], b = -v[2];
			if (d) {
				let e = m(o.roughness);
				if (!y(I, h, _, b, s, i.ior, e, R.next(), R.next(), R.next(), v)) break;
				v[0] * I[0] + v[1] * I[1] + v[2] * I[2] < 0 && (c[0] *= o.color[0], c[1] *= o.color[1], c[2] *= o.color[2]), E = !0;
			} else {
				p(a, i, o.metallic, o.roughness, o.color, I, h, _, b, o.clearcoat);
				let e = i.subsurface;
				e && u(a, e.weight), je(t, I);
				let n = R.next();
				if (e) {
					if (n < a.subsurfaceChance) {
						if (!Ve(t, e)) break;
						n = 0;
					} else n -= a.subsurfaceChance;
				}
				let r = g(a, n, R.next(), R.next(), v), s = v[0] * I[0] + v[1] * I[1] + v[2] * I[2];
				if (s <= 0) break;
				if (r) {
					T(a, F);
					for (let e = 0; e < 3; e++) c[e] *= F[e];
					E = !0;
				} else {
					if (f(a, v[0], v[1], v[2]), !(a.pdf > 0)) break;
					for (let e = 0; e < 3; e++) c[e] *= a.value[e] * s / a.pdf;
					w = a.pdf, E = !1;
				}
			}
			if (x = o.point[0] + v[0] * e.surfaceOffset, S = o.point[1] + v[1] * e.surfaceOffset, C = o.point[2] + v[2] * e.surfaceOffset, !Pe(t)) break;
		}
	}
	return {
		trace: He,
		radiance: l,
		features: L
	};
}
function ge(e, t, n, { viewTransform: r = "aces", look: i = null } = {}) {
	let a = new Uint8ClampedArray(t * n * 4), o = r === "aces" && !i;
	for (let l = 0; l < t * n; l++) {
		let t = o ? [
			0,
			1,
			2
		].map((t) => s(e[l * 3 + t]) ** (1 / 2.2)) : c([
			e[l * 3],
			e[l * 3 + 1],
			e[l * 3 + 2]
		], {
			viewTransform: r,
			look: i
		});
		for (let e = 0; e < 3; e++) a[l * 4 + e] = Math.round(t[e] * 255);
		a[l * 4 + 3] = 255;
	}
	return a;
}
function _e(e, t) {
	let n = /* @__PURE__ */ new Set(), r = t?.volumeFog;
	r?.density > 0 && (r.noiseAmount ?? .5) > 0 && n.add("volumeFog is traced as a uniform medium: noiseAmount, noiseScale and drift are ignored."), r?.density > 0 && r.ambient && n.add("volumeFog.ambient is not added: the fog is lit by the traced lights and sky."), t?.map || n.add("There is no environment map, so the sky is black and only the lights shine.");
	for (let t of e) {
		let e = t.material ?? {};
		for (let t of B) e[t] && n.add(`${t} is ignored.`);
		e.tag && e.tag !== "surface" && n.add(`${e.tag} materials are traced as plain surfaces.`), e.alphaMode === "blend" && n.add(H(e) ? "A graph opacity output is traced as a cutout at 0.5." : "Blended transparency is traced as opaque."), (e.layerMaps?.clearcoatTexture || e.transmissionMap) && n.add("Graph clearcoat and transmission masks are read by the CPU tracer; the GPU tracers use the factors.");
		for (let [t, r] of V) r(e) && n.add(`${t} is ignored.`);
	}
	return [...n];
}
function ve(e, t, n, r) {
	let i = e / n, a = Math.max(0, t / n - i * i) * n / (n - 1);
	return Math.sqrt(a / n) < r * (i + z);
}
function ye(e, t) {
	return !(t.noiseThreshold > 0) || e < L ? !1 : (e - L) % R === 0;
}
function $(e, t, n, r, i, a = () => {}) {
	let o = he(e, n), { width: s, height: c, samples: l } = n, u = (i - r) * s, d = new Float32Array(u * 3), f = new Float32Array(u * 3), p = new Float32Array(u * 3), m = new Float32Array(u), h = new Float32Array(u), g = new Uint16Array(u);
	for (let e = r; e < i; e++) {
		a();
		for (let i = 0; i < s; i++) {
			let a = e * s + i, u = (e - r) * s + i, _ = 0, y = 0, b = 0;
			for (; b < l;) {
				let r = b, l = be(a, r, n.seed, 1), h = be(a, r, n.seed, 2), g = ((i + l) / s * 2 - 1) * t.halfWidth, x = (1 - (e + h) / c * 2) * t.halfHeight, S = t.forward[0] + t.right[0] * g + t.above[0] * x, C = t.forward[1] + t.right[1] * g + t.above[1] * x, w = t.forward[2] + t.right[2] * g + t.above[2] * x, T = Math.hypot(S, C, w);
				o.trace(t.eye[0], t.eye[1], t.eye[2], S / T, C / T, w / T, a, r);
				let { radiance: E, features: D } = o, O = v(E[0], E[1], E[2]);
				_ += O, y += O * O;
				for (let e = 0; e < 3; e++) d[u * 3 + e] += E[e], f[u * 3 + e] += D.albedo[e], p[u * 3 + e] += D.normal[e];
				if (m[u] += D.depth, b++, ye(b, n) && ve(_, y, b, n.noiseThreshold)) break;
			}
			for (let e = 0; e < 3; e++) d[u * 3 + e] /= b, f[u * 3 + e] /= b, p[u * 3 + e] /= b;
			m[u] /= b;
			let x = _ / b;
			h[u] = Math.max(0, y / b - x * x) / Math.max(b - 1, 1), g[u] = b;
		}
	}
	return {
		color: d,
		albedo: f,
		normal: p,
		depth: m,
		variance: h,
		samplesTaken: g
	};
}
function be(e, t, n, r) {
	let i = Math.imul(e ^ 1374496523, 2654435761) ^ Math.imul(t + r * 1663821227, 2246822507) ^ Math.imul(n + 461845907, 3266489909);
	return i = Math.imul(i ^ i >>> 16, 2146121005), i = Math.imul(i ^ i >>> 15, 2221713035), i ^= i >>> 16, (i >>> 0) / 4294967296;
}
function xe(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) t += e[n];
	return t;
}
function Se(e, t) {
	for (let n = 0; n < t; n++) {
		let t = Math.hypot(e[n * 3], e[n * 3 + 1], e[n * 3 + 2]);
		if (t !== 0) for (let r = 0; r < 3; r++) e[n * 3 + r] /= t;
	}
}
function Ce(e, t, n, r) {
	let i = n * r;
	for (let n of [
		"color",
		"albedo",
		"normal"
	]) e[n].set(t[n], i * 3);
	for (let n of [
		"depth",
		"variance",
		"samplesTaken"
	]) e[n].set(t[n], i);
}
function we(e, t, n, r, i) {
	let a = Math.ceil(n.height / F), o = Math.min(n.threads, a), s = [], { tracer: c, ...l } = e;
	return new Promise((e, c) => {
		let u = 0, d = 0, f = !1, p = (t) => {
			if (!f) {
				f = !0, clearInterval(m);
				for (let e of s) e.terminate();
				t ? c(t) : e();
			}
		}, m = setInterval(() => {
			try {
				i();
			} catch (e) {
				p(e);
			}
		}, 250), h = (e) => {
			if (u >= a) return;
			let t = u * F;
			u++, e.postMessage({
				type: "band",
				rowStart: t,
				rowEnd: Math.min(t + F, n.height)
			});
		};
		for (let e = 0; e < o; e++) {
			let e = new Worker(new URL(I, import.meta.url), { type: "module" });
			s.push(e), e.onerror = (e) => p(/* @__PURE__ */ Error(`Path tracer worker failed: ${e.message}`)), e.onmessage = (t) => {
				t.data.type === "ready" ? h(e) : (Ce(r, t.data.band, t.data.rowStart, n.width), d++, d === a ? p() : h(e));
			}, e.postMessage({
				type: "scene",
				scene: l,
				camera: t,
				options: n
			});
		}
	});
}
async function Te({ parts: e, environment: t = {}, camera: n }, i = {}) {
	let s = oe(i), c = performance.now(), l = () => {
		if ((performance.now() - c) / 1e3 > s.maxSeconds) throw Error(`The path trace passed its ${s.maxSeconds} second limit and was stopped.`);
	}, { width: u, height: d } = s, f = J(n, u, d), p = r(e, t);
	s.backend !== "cpu" && a(p, `backend "${s.backend}"`);
	let m = u * d, h = {
		color: new Float32Array(m * 3),
		albedo: new Float32Array(m * 3),
		normal: new Float32Array(m * 3),
		depth: new Float32Array(m),
		variance: new Float32Array(m),
		samplesTaken: new Uint16Array(m)
	}, g = typeof Worker == "function" ? s.threads : 1, _ = null, v = 0, y = 0;
	if (s.backend === "gpu" || s.backend === "webgpu") {
		let { traceOnGpu: e, gpuKernelCompileCount: t } = await (s.backend === "webgpu" ? import("./path-tracer-webgpu-oihoATYw.js") : import("./path-tracer-gpu-Crg989H3.js").then((e) => e.c)), n = await e(p, f, s, l);
		_ = n.gpu, v = n.compileSeconds, y = t(), Ce(h, n, 0, u);
	} else g > 1 ? await we(p, f, {
		...s,
		threads: g
	}, h, l) : Ce(h, $(p, f, s, 0, d, l), 0, u);
	l();
	let b = (performance.now() - c) / 1e3;
	Se(h.normal, m);
	let { samplesTaken: x, ...S } = h, C = s.denoiser === "wavelet" ? o({
		width: u,
		height: d,
		...S
	}) : h.color;
	return {
		width: u,
		height: d,
		linear: C,
		rgba: ge(C, u, d, s),
		features: S,
		report: {
			width: u,
			height: d,
			samples: s.samples,
			bounces: s.bounces,
			seed: s.seed,
			denoised: s.denoiser === "wavelet",
			denoiser: s.denoiser,
			threads: g,
			backend: s.backend,
			..._ ? {
				gpu: _,
				gpuCompileSeconds: v,
				gpuKernelCompiles: y
			} : {},
			averageSamples: xe(x) / m,
			noiseThreshold: s.noiseThreshold,
			triangles: p.indices.length / 3,
			tracedSeconds: b,
			seconds: (performance.now() - c) / 1e3,
			ignored: _e(e, t)
		}
	};
}
var Ee = Te;
export { Ee as Cook, K as LIGHT_SELECTIONS, M as MAX_TRACE_PIXELS, N as MAX_TRACE_RAY_WORK, re as PATH_TRACER_DENOISERS, j as PATH_TRACER_LIMITS, G as SAMPLING_PATTERNS, J as createCamera, _e as describeIgnoredFeatures, oe as normalizePathTracerOptions, $ as renderBand, Te as renderPathTracedImage, ge as toneMapToRgba8 };
