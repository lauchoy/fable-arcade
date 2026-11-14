/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { i as e, o as t } from "./path-tracer-scene-Thw9vHJu.js";
import { checkBudget as n, checkedBakeSize as r, finishLightmaps as i, planLightmaps as a, rasterizeEntries as o, traceLightmaps as s } from "./light-bake.js";
// src/light-bake-gpu.js
var c = 1, l = 1e6;
function u({ lights: e }) {
	if ([
		...e.pointLights,
		...e.spotLights,
		...e.areaLights,
		...e.sun ? [e.sun] : []
	].some((e) => e.affects !== null)) throw RangeError("A light bake on the GPU backend does not support light linking (`affects`). Use the CPU backend.");
	return {
		pointLights: e.pointLights,
		spotLights: e.spotLights.map((e) => ({
			...e,
			angle: Math.acos(e.cosineHalfAngle),
			penumbra: e.blend / (1 - e.cosineHalfAngle)
		})),
		areaLights: e.areaLights.map((e) => ({
			...e,
			direction: e.normal,
			up: e.along
		})),
		keyColor: e.sun?.color ?? [
			0,
			0,
			0
		],
		lightDirection: e.sun?.direction ?? [
			0,
			1,
			0
		]
	};
}
function d(e) {
	let t = 0;
	for (let { covered: n } of e) for (let e of n) t += e;
	let n = new Float32Array(t * 3), r = new Float32Array(t * 3), i = [], a = 0;
	for (let { positions: t, normals: o, covered: s } of e) {
		let e = [];
		for (let i = 0; i < s.length; i++) s[i] && (n.set(t.subarray(i * 3, i * 3 + 3), a * 3), r.set(o.subarray(i * 3, i * 3 + 3), a * 3), e.push(i), a++);
		i.push(e);
	}
	return {
		count: t,
		points: n,
		normals: r,
		slices: i
	};
}
async function f(e) {
	if (e === "native") throw RangeError("A light bake on the native backend needs a `texelTracer` function in its settings: the native tracer runs outside the page.");
	return e === "webgpu" ? (await import("./path-tracer-webgpu-oihoATYw.js")).traceTexelsOnWebGpu : (await import("./path-tracer-gpu-Crg989H3.js").then((e) => e.c)).traceTexelsOnGpu;
}
async function p(n, r, i, a) {
	let o = u(n), s = d(i), p = e(n.parts, o);
	t(p, "the GPU light bake");
	let m = await (r.texelTracer ?? await f(r.backend))(p, s, {
		samples: r.samples,
		bounces: r.bounces,
		seed: c,
		fireflyClamp: l
	}, a), h = 0;
	return {
		entries: i.map(({ resolution: e }, t) => {
			let n = new Float32Array(e * e * 3), r = new Float32Array(e * e);
			for (let e of s.slices[t]) n.set(m.radiance.subarray(h * 3, h * 3 + 3), e * 3), r[e] = m.escaped[h], h++;
			return {
				light: n,
				escaped: r
			};
		}),
		gpu: m.gpu,
		compileSeconds: m.compileSeconds
	};
}
async function m(e, t) {
	let a = {
		...e.settings,
		...t
	};
	if (a.backend === "cpu") return s(e, a);
	if (a.skyOnly) throw RangeError("A sky visibility bake runs on the CPU backend only.");
	let c = r(e, a), l = o(e, a), u = await p(e, a, l, () => n(e, a)), d = i(e, a, l, u.entries, c);
	return {
		parts: d.parts,
		report: {
			...d.report,
			gpu: u.gpu,
			gpuCompileSeconds: u.compileSeconds
		}
	};
}
async function h(e, t, n = {}) {
	let r = a(e, t, n);
	return m(r, {
		...r.settings,
		skyOnly: n.skyOnly === !0,
		...n.texelTracer ? { texelTracer: n.texelTracer } : {}
	});
}
export { h as bakeLightmapsAsync, m as traceLightmapsAsync };
