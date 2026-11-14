/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { i as e, o as t } from "./path-tracer-scene-Thw9vHJu.js";
import { createCamera as n } from "./path-tracer.js";
import { a as r, d as i, l as a, o, u as s } from "./path-tracer-gpu-Crg989H3.js";
import { h as c, u as l, v as u, y as d } from "./path-tracer-gpu-pack-DYL2MEaQ.js";
import { i as f, n as p, r as m, t as h } from "./path-tracer-realtime-options-imMUtUAP.js";
// src/path-tracer-realtime.js
async function g(g, _ = {}) {
	let v = p(_), y = null;
	if (v.backend === "webgpu") try {
		let { createWebGpuRealtimeTracer: e } = await import("./path-tracer-realtime-webgpu-DFGi1TJl.js");
		return await e(g, v, _.canvas);
	} catch (e) {
		y = e.message;
	}
	let { outputWidth: b, outputHeight: x, traceWidth: S, traceHeight: C, options: w, historyLimit: T, filterIterations: E, cacheCellSize: D } = v, { gl: O, gpu: k } = r();
	if (O.getParameter(O.MAX_COMBINED_TEXTURE_IMAGE_UNITS) < 28) throw Error("The real-time path tracer needs 28 texture units.");
	O.canvas.width = b, O.canvas.height = x;
	let A = [u(O, S, C), u(O, S, C)], j = [u(O, S, C), u(O, S, C)], M = u(O, S, C), N = u(O, S, C), P = [0, 1].map((e) => d(O, [
		{
			slot: 0,
			texture: A[e]
		},
		{
			slot: 1,
			texture: M
		},
		{
			slot: 2,
			texture: j[e]
		},
		{
			slot: 4,
			texture: N
		}
	])), F = c(O), I = f(O, {
		traceWidth: S,
		traceHeight: C,
		outputWidth: b,
		outputHeight: x,
		historyLimit: T,
		filterIterations: E
	}), L = /* @__PURE__ */ new Uint8Array(4), R = null, z = null, B = 0, V = 0, H = 0, U = 0, W = 0, G = null, K = null, q = !0, J = !1, Y = (n, r) => {
		a(O), R = e(n, r), t(R, "the WebGL realtime path tracer");
		let s = o(l(R.materials), !1, w);
		z = s.program, H = s.compileSeconds, O.useProgram(z);
		let c = i(O, z, R, w);
		B = c.lightCount, V = c.nextUnit, O.uniform1i(O.getUniformLocation(z, "uRadianceCache"), V);
		let { cellSize: u, levelDistance: d } = h(R, D);
		O.uniform1f(O.getUniformLocation(z, "uCacheCellSize"), u), O.uniform1f(O.getUniformLocation(z, "uCacheLevelDistance"), d), F.clear(), G = null, q = !0;
	};
	Y(g.parts, g.environment ?? {});
	let X = () => {
		O.useProgram(z), O.uniform1i(O.getUniformLocation(z, "uSample"), W + 1), O.activeTexture(O.TEXTURE0 + V), O.bindTexture(O.TEXTURE_2D, F.texture), O.bindFramebuffer(O.FRAMEBUFFER, P[U]), O.viewport(0, 0, S, C), O.disable(O.BLEND), O.disable(O.SCISSOR_TEST), O.drawArrays(O.TRIANGLES, 0, 3);
	};
	return {
		gpu: k,
		backend: "gpu",
		fallbackReason: y,
		canvas: O.canvas,
		width: b,
		height: x,
		traceWidth: S,
		traceHeight: C,
		get compileSeconds() {
			return H;
		},
		get frameCount() {
			return W;
		},
		update({ parts: e, environment: t }) {
			e && Y(e, t ?? {});
		},
		resetHistory() {
			q = !0;
		},
		frame(e, { wait: t = !1 } = {}) {
			if (J) throw Error("This real-time tracer was disposed.");
			let r = n(e, b, x);
			return K = G ?? r, m(G, r) || (O.useProgram(z), s(O, z, R, r, w, B)), G = r, X(), F.update(N, S, C), I.run({
				radiance: A[U],
				albedo: M,
				normal: j[U],
				previousRadiance: A[1 - U],
				previousNormal: j[1 - U],
				camera: G,
				previousCamera: K,
				resetHistory: q,
				farDistance: R.farDistance
			}), q = !1, U = 1 - U, W++, t && O.readPixels(0, 0, 1, 1, O.RGBA, O.UNSIGNED_BYTE, L), { frame: W };
		},
		readFrame() {
			O.bindFramebuffer(O.FRAMEBUFFER, null);
			let e = new Uint8Array(b * x * 4);
			O.readPixels(0, 0, b, x, O.RGBA, O.UNSIGNED_BYTE, e);
			let t = new Uint8ClampedArray(e.length), n = b * 4;
			for (let r = 0; r < x; r++) t.set(e.subarray((x - 1 - r) * n, (x - r) * n), r * n);
			return {
				width: b,
				height: x,
				rgba: t
			};
		},
		dispose() {
			J = !0, F.dispose(), I.dispose();
			for (let e of [
				...A,
				...j,
				M,
				N
			]) O.deleteTexture(e);
			for (let e of P) O.deleteFramebuffer(e);
			a(O);
		}
	};
}
export { g as createRealtimeTracer };
