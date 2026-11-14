/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { i as e, o as t } from "./path-tracer-scene-Thw9vHJu.js";
import { t as n } from "./path-tracer-denoise-j_ATlMbO.js";
import { i as r } from "./path-tracer-light-tree-BZYzVWXO.js";
import { createCamera as i, normalizePathTracerOptions as a, toneMapToRgba8 as o } from "./path-tracer.js";
import { a as s, d as c, f as l, i as u, l as d, n as f, o as p, r as m, t as h, u as g } from "./path-tracer-gpu-Crg989H3.js";
import { u as _ } from "./path-tracer-gpu-pack-DYL2MEaQ.js";
// src/path-tracer-progressive.js
var v = Object.freeze([
	4,
	2,
	1
]);
async function y(y, b = {}, { resolutionDivisors: x = v } = {}) {
	let S = await l(a({
		...b,
		backend: "gpu",
		samples: 1,
		maxSeconds: b.maxSeconds ?? 3600
	})), { gl: C, gpu: w } = s(), { width: T, height: E } = S, D = null, O = S, k = null, A = 0, j = 0, M = 0, N = 0, P = !1, F = /* @__PURE__ */ new Float32Array(4), I = f(E), L = !1, R = () => {
		let e = x[M];
		return {
			divisor: e,
			levelWidth: Math.max(1, Math.ceil(T / e)),
			levelHeight: Math.max(1, Math.ceil(E / e))
		};
	}, z = (n, i) => {
		d(C), D = e(n, i), t(D, "the progressive path tracer"), O = {
			...S,
			lightSelection: r(S.lightSelection, D.lights)
		};
		let a = p(_(D.materials), !1, O);
		k = a.program, A = a.compileSeconds, C.useProgram(k), j = c(C, k, D, O).lightCount, m(C, T, E);
	}, B = (e) => {
		let t = i(e, T, E);
		g(C, k, D, t, O, j);
	}, V = () => {
		for (let e = 0; e < 4; e++) C.clearBufferfv(C.COLOR, e, [
			0,
			0,
			0,
			0
		]);
	}, H = () => {
		let { levelWidth: e, levelHeight: t } = R();
		C.uniform2i(C.getUniformLocation(k, "uSize"), e, t);
	}, U = () => {
		M = 0, N = 0, P = !1, I = f(E), H(), V();
	};
	return z(y.parts, y.environment ?? {}), B(y.camera), U(), {
		gpu: w,
		get compileSeconds() {
			return A;
		},
		get samples() {
			return N;
		},
		get level() {
			return {
				...R(),
				final: M === x.length - 1
			};
		},
		update({ camera: e, parts: t, environment: n }) {
			t && z(t, n ?? {}), e && B(e), U();
		},
		async step(e = () => {}) {
			if (L) throw Error("This progressive tracer was disposed.");
			P && M < x.length - 1 && (M++, N = 0, H(), V());
			let { levelWidth: t, levelHeight: n, divisor: r } = R();
			return await u(C, k, t, n, N, I, e), C.readBuffer(C.COLOR_ATTACHMENT0), C.readPixels(0, 0, 1, 1, C.RGBA, C.FLOAT, F), N++, P = !0, {
				width: t,
				height: n,
				divisor: r,
				samples: N
			};
		},
		snapshot() {
			let { levelWidth: e, levelHeight: t } = R(), r = h(C, e, t, N);
			for (let n = 0; n < e * t; n++) {
				let e = Math.hypot(r.normal[n * 3], r.normal[n * 3 + 1], r.normal[n * 3 + 2]) || 1;
				for (let t = 0; t < 3; t++) r.normal[n * 3 + t] /= e;
			}
			let { samplesTaken: i, ...a } = r, s = S.denoiser === "wavelet" ? n({
				width: e,
				height: t,
				...a
			}) : r.color;
			return {
				width: e,
				height: t,
				linear: s,
				rgba: o(s, e, t, S),
				samples: N,
				features: a
			};
		},
		dispose() {
			L = !0, d(C);
		}
	};
}
export { y as createProgressiveTracer };
