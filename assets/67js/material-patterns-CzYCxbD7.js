/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { t as e } from "./rolldown-runtime-CvuOiBwx.js";
import { m as t, p as n } from "./agent-scene-capabilities-BaawWMO1.js";
import { i as r, r as i, t as a } from "./material-graph-DN1JJGAL.js";
import { r as o, s } from "./kernel-offload-A_sD9y-z.js";
import { a as c, d as l, f as u, i as d, l as f, n as p, o as m, r as h, s as g, t as _, u as v } from "./material-texture-kit-DIh3eyE-.js";
// src/material-patterns.js
var y = /* @__PURE__ */ e({
	PATTERN_DEFAULTS: () => T,
	bakeMaterialPattern: () => I,
	cellularNoise: () => _,
	fractalNoise: () => d,
	gradientNoise: () => c,
	materialPatternTextures: () => B,
	normalizeMaterialPattern: () => F,
	ridgedNoise: () => v
});
function b(e, t, n) {
	return m(e, t, n) / 4294967296;
}
function x(e, t, n, r, i, a) {
	let o = t * r, s = Math.floor(o), c = e * n + (s % 2 == 1 ? a : 0), d = Math.floor(c), f = c - d, p = o - s, m = Math.min(f, 1 - f) / n, h = Math.min(p, 1 - p) / r, g = Math.min(m, h);
	return {
		row: s,
		column: u(d, n),
		body: l(i * .5, i * 1.5, g)
	};
}
function S(e, t, n, r) {
	let i = d(e, t, 2, 1, n, 3) * 1.6, a = e * r + i, o = a - Math.floor(a), s = o < .85 ? o / .85 : (1 - o) / .15, c = d(e, t, 128, 2, n + 7, 3) * .5 + .5, l = d(e, t, 256, 8, n + 11, 2) * .5 + .5;
	return {
		tone: p(s * .45 + c * .4 + l * .15),
		fibre: c
	};
}
var C = {
	noise(e, t, n, r) {
		let i = d(e, t, r, r, n, 6) * .5 + .5;
		return {
			tone: l(.25, .75, i),
			height: i,
			roughness: .75 + i * .25,
			metal: 1
		};
	},
	wood(e, t, n, r) {
		let { tone: i, fibre: a } = S(e, t, n, r);
		return {
			tone: i,
			height: i * .5 + a * .5,
			roughness: .75 + (1 - i) * .25,
			metal: 1
		};
	},
	planks(e, t, n, r) {
		let i = e * r, a = Math.floor(i), o = i - a, s = t + b(a, 0, n), c = Math.min(s - Math.floor(s), 1 - (s - Math.floor(s))), d = Math.min(Math.min(o, 1 - o) / r, c), f = l(.0015, .005, d), { tone: m, fibre: h } = S(e, w(t + b(u(a, r), 1, n)), n + u(a, r) * 17, 12), g = p(m * .8 + b(u(a, r), 2, n) * .2);
		return {
			tone: g * f,
			height: (.55 + h * .25) * f,
			roughness: .75 + (1 - g) * .2 + (1 - f) * .05,
			metal: 1
		};
	},
	bricks(e, t, n, r) {
		let i = r * 2, { row: a, column: o, body: s } = x(e, t, r, i, .006, .5), c = b(o, u(a, i), n), l = d(e, t, 24, 24, n + 3, 4) * .5 + .5;
		return {
			tone: p(c * .6 + l * .4),
			joint: 1 - s,
			height: s * (.75 + l * .25),
			roughness: .85 + l * .15,
			metal: 1
		};
	},
	tiles(e, t, n, r) {
		let { row: i, column: a, body: o } = x(e, t, r, r, .004, 0), s = b(a, u(i, r), n), c = d(e, t, 8, 8, n + 5, 3) * .5 + .5;
		return {
			tone: p(.75 + s * .2 + c * .05) * o,
			height: o * (.9 + c * .1),
			roughness: o > .5 ? .45 + c * .15 : 1,
			metal: 1
		};
	},
	marble(e, t, n, r) {
		let i = d(e, t, r, r, n, 5) * .5 + .5, a = v(e, t, r, r, n + 11, 4), o = l(.72, .95, a);
		return {
			tone: p(.75 + i * .25 - o),
			height: .5,
			roughness: .3 + o * .2,
			metal: 1
		};
	},
	stone(e, t, n, r) {
		let i = v(e, t, r, r, n, 5), { nearest: a, second: o } = _(e, t, r * 2, n + 9), s = l(0, .07, o - a), c = p(i * .8 + .1);
		return {
			tone: c * (.6 + s * .4),
			height: c * .7 + s * .3,
			roughness: .85 + (1 - c) * .15,
			metal: 1
		};
	},
	concrete(e, t, n, r) {
		let i = d(e, t, r, r, n, 6) * .5 + .5, { nearest: a } = _(e, t, r * 16, n + 13), o = l(.02, .12, a);
		return {
			tone: p(i * .9 + .05) * (.7 + o * .3),
			height: .5 + (o - 1) * .4 + i * .1,
			roughness: .85 + i * .15,
			metal: 1
		};
	},
	metal(e, t, n, r) {
		let i = d(e, t, r * 16, 2, n, 4) * .5 + .5, a = d(e, t, 4, 4, n + 3, 3) * .5 + .5;
		return {
			tone: p(i * .7 + a * .3),
			height: i * .25,
			roughness: .55 + i * .35 + a * .1,
			metal: 1
		};
	},
	rust(e, t, n, r) {
		let i = d(e, t, r, r, n, 6) * .5 + .5, a = d(e, t, r * 16, r * 16, n + 3, 3) * .5 + .5, o = l(.42, .58, i + (a - .5) * .15);
		return {
			tone: o * (.5 + a * .5),
			height: o * (.4 + a * .6),
			roughness: .45 + o * .55,
			metal: 1 - o
		};
	},
	fabric(e, t, n, r) {
		let i = r * 16, a = Math.sin(e * i * Math.PI * 2) * .5 + .5, o = Math.sin(t * i * Math.PI * 2) * .5 + .5, s = (Math.floor(e * i) + Math.floor(t * i)) % 2 == 0 ? a : o, c = d(e, t, 16, 16, n, 3) * .5 + .5;
		return {
			tone: p(s * .5 + c * .5),
			height: s,
			roughness: .9 + c * .1,
			metal: 1
		};
	}
};
function w(e) {
	return e - Math.floor(e);
}
var T = {
	noise: {
		colors: [[
			.2,
			.2,
			.2
		], [
			.7,
			.7,
			.7
		]],
		size: 1,
		count: 4,
		bump: .5
	},
	wood: {
		colors: [[
			.16,
			.07,
			.025
		], [
			.5,
			.27,
			.11
		]],
		size: .6,
		count: 12,
		bump: .4
	},
	planks: {
		colors: [[
			.12,
			.055,
			.02
		], [
			.46,
			.25,
			.1
		]],
		size: 1,
		count: 6,
		bump: .8
	},
	bricks: {
		colors: [
			[
				.33,
				.1,
				.06
			],
			[
				.52,
				.2,
				.12
			],
			[
				.45,
				.42,
				.38
			]
		],
		size: 1,
		count: 4,
		bump: 1
	},
	tiles: {
		colors: [[
			.32,
			.32,
			.31
		], [
			.75,
			.75,
			.72
		]],
		size: 1,
		count: 4,
		bump: .8
	},
	marble: {
		colors: [[
			.2,
			.2,
			.22
		], [
			.85,
			.84,
			.82
		]],
		size: 1,
		count: 3,
		bump: 0
	},
	stone: {
		colors: [[
			.09,
			.085,
			.08
		], [
			.42,
			.4,
			.37
		]],
		size: 1.5,
		count: 4,
		bump: 1.4
	},
	concrete: {
		colors: [[
			.24,
			.24,
			.23
		], [
			.5,
			.5,
			.48
		]],
		size: 2,
		count: 4,
		bump: .4
	},
	metal: {
		colors: [[
			.5,
			.5,
			.52
		], [
			.8,
			.8,
			.82
		]],
		size: .5,
		count: 4,
		bump: .15
	},
	rust: {
		colors: [[
			.55,
			.55,
			.56
		], [
			.22,
			.07,
			.025
		]],
		size: 1,
		count: 4,
		bump: .7
	},
	fabric: {
		colors: [[
			.2,
			.2,
			.25
		], [
			.45,
			.45,
			.55
		]],
		size: .25,
		count: 4,
		bump: .5
	}
}, E = [
	256,
	512,
	1024
], D = 64, O = "graph", k = {
	size: 1,
	bump: 1
}, A = [
	"colors",
	"count",
	"seed"
];
function j(e) {
	return /* @__PURE__ */ RangeError(`Material pattern ${e}`);
}
function M(e, t) {
	let n = "colors must be two linear RGB colours from 0 to 1 (three for bricks: the third is the mortar)", r = T[t].colors.length;
	if (!Array.isArray(e) || e.length !== 2 && e.length !== r) throw j(n);
	for (let t of e) if (!Array.isArray(t) || t.length !== 3 || t.some((e) => !Number.isFinite(e) || e < 0 || e > 1)) throw j(n);
	return e.map((e) => [...e]);
}
function N(e, t, n, r) {
	if (!Number.isFinite(e) || e < n || e > r) throw j(`${t} must be a number from ${n} to ${r}.`);
	return e;
}
function P(e, t) {
	for (let t of A) if (e[t] !== void 0) throw j(`of type graph does not take ${t}: the graph holds the colours and the noise seeds.`);
	let n = e.axis ?? "y";
	if (![
		"x",
		"y",
		"z"
	].includes(n)) throw j("axis must be x, y or z: the object axis the texture V runs along.");
	let i = e.resolution ?? 512;
	if (!E.includes(i)) throw j(`resolution must be one of ${E.join(", ")}.`);
	return {
		type: O,
		graph: r(e.graph, i),
		size: N(e.size ?? k.size, "size", .01, 100),
		bump: N(e.bump ?? k.bump, "bump", 0, 4),
		axis: n,
		resolution: i,
		...t
	};
}
function F(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw j(`must be an object such as { "type": "wood" }. Types: ${t.join(", ")}.`);
	let r = [
		"type",
		"colors",
		"size",
		"count",
		"bump",
		"seed",
		"axis",
		"resolution",
		"mapping",
		"graph"
	];
	for (let t of Object.keys(e)) if (!r.includes(t)) throw j(`does not take ${t}. Fields: ${r.join(", ")}.`);
	let i = e.mapping ?? "box";
	if (!n.includes(i)) throw j(`mapping must be one of ${n.join(", ")}: box projects along the object axes, uv follows the geometry's UVs.`);
	let a = i === "uv" ? { mapping: i } : {};
	if (e.type === O) return P(e, a);
	if (e.graph !== void 0) throw j("does not take graph unless its type is graph.");
	if (!Object.hasOwn(T, e.type ?? "")) throw j(`type must be one of ${t.join(", ")}.`);
	let o = T[e.type], s = e.count ?? o.count;
	if (!Number.isInteger(s) || s < 1 || s > D) throw j(`count must be a whole number from 1 to ${D}.`);
	let c = e.seed ?? 1;
	if (!Number.isInteger(c) || c < 0 || c > 2147483647) throw j("seed must be a nonnegative whole number.");
	let l = e.axis ?? "y";
	if (![
		"x",
		"y",
		"z"
	].includes(l)) throw j("axis must be x, y or z: the object axis the grain runs along.");
	let u = e.resolution ?? 512;
	if (!E.includes(u)) throw j(`resolution must be one of ${E.join(", ")}.`);
	return {
		type: e.type,
		colors: e.colors === void 0 ? o.colors.map((e) => [...e]) : M(e.colors, e.type),
		size: N(e.size ?? o.size, "size", .01, 100),
		count: s,
		bump: N(e.bump ?? o.bump, "bump", 0, 4),
		seed: c,
		axis: l,
		resolution: u,
		...a
	};
}
function I(e, n) {
	let r = {
		boxMapScale: e.mapping === "uv" ? 0 : 1 / e.size,
		boxMapAxis: [
			"x",
			"y",
			"z"
		].indexOf(e.axis)
	};
	if (e.type === O) return {
		...a(e.graph, e, n),
		...r
	};
	let { resolution: i, type: o, seed: s, count: c, colors: l, bump: u } = e;
	if (!Object.hasOwn(C, o)) throw j(`type must be one of ${t.join(", ")}.`);
	let d = C[o], m = i * i, _ = new Float32Array(m), v = new Uint8ClampedArray(m * 4), y = new Uint8ClampedArray(m * 4), [b, x, S] = l;
	for (let e = 0; e < i; e++) for (let t = 0; t < i; t++) {
		let n = e * i + t, r = d((t + .5) / i, (e + .5) / i, s, c);
		_[n] = r.height;
		let a = p(r.tone), o = S ? r.joint ?? 0 : 0, l = n * 4;
		for (let e = 0; e < 3; e++) {
			let t = b[e] + (x[e] - b[e]) * a;
			v[l + e] = g(o > 0 ? t + (S[e] - t) * o : t);
		}
		v[l + 3] = 255, y[l] = 255, y[l + 1] = Math.round(p(r.roughness) * 255), y[l + 2] = Math.round(p(r.metal) * 255), y[l + 3] = 255;
	}
	let w = f(_, i, u);
	return {
		map: {
			image: h(v, i, i),
			colorSpace: "srgb"
		},
		normalMap: {
			image: h(w, i, i),
			colorSpace: "linear"
		},
		metallicRoughnessMap: {
			image: h(y, i, i),
			colorSpace: "linear"
		},
		...r
	};
}
var L = /* @__PURE__ */ new Map(), R = 32, z = /* @__PURE__ */ new WeakMap();
function B(e, t) {
	let n = e.graph ? i(e.graph, t) : {}, r = Object.keys(n).length > 0, a = z.get(e);
	if (a && (!r || V(a.images, n))) return a.baked;
	let c = r ? o("pattern", [e, n]) : JSON.stringify(e), l = L.get(c);
	return l ? L.delete(c) : (l = s("pattern", r ? [e, n] : [e], I), L.size >= R && L.delete(L.keys().next().value)), L.set(c, l), z.set(e, {
		baked: l,
		images: n
	}), l;
}
function V(e, t) {
	let n = Object.keys(t);
	return n.length === Object.keys(e).length && n.every((n) => e[n]?.data === t[n].data);
}
export { y as n, I as t };
