/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { d as e, f as t, u as n } from "./agent-scene-capabilities-BaawWMO1.js";
import { c as r, d as i, f as a, n as o, o as s, r as c, s as l, t as u } from "./material-texture-kit-DIh3eyE-.js";
// src/material-graph.js
var d = 1e6, f = 2147483647, p = 24, m = 64, h = 6, g = 8, _ = 3;
function v(e) {
	return /* @__PURE__ */ TypeError(`Material graph: ${e}`);
}
function y(e) {
	let t = e.length > p ? `${e.slice(0, p)}...` : e;
	return JSON.stringify(t);
}
function b(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return !1;
	let t = Object.getPrototypeOf(e);
	return t === Object.prototype || t === null;
}
function x(e, t, n) {
	for (let r of Object.keys(e)) if (!t.includes(r)) throw v(`${n} does not take ${y(r)}; fields: ${t.join(", ")}.`);
}
function S(e, t, n, r) {
	if (!Number.isInteger(e) || e < t || e > n) throw v(`${r} must be a whole number from ${t} to ${n}.`);
	return e;
}
function C(e, t, n) {
	if (typeof e != "string" || !t.includes(e)) throw v(`${n} must be one of ${t.join(", ")}.`);
	return e;
}
function w(e) {
	return typeof e == "number" && Number.isFinite(e) && Math.abs(e) <= d;
}
var T = (e) => ({
	kind: "scalar",
	evaluate: e
}), E = (e, t, n) => ({
	kind: "vector",
	parts: [
		e,
		t,
		n
	]
}), ee = (e) => e.kind === "vector" ? e.parts : [
	e.evaluate,
	e.evaluate,
	e.evaluate
];
function D(e, t) {
	if (e.every((e) => e.kind === "scalar")) {
		let [n, r, i] = e.map((e) => e.evaluate);
		return T((e, a) => t(n(e, a), r?.(e, a), i?.(e, a)));
	}
	let [n, r, i] = e.map(ee), a = (e) => (a, o) => t(n[e](a, o), r?.[e](a, o), i?.[e](a, o));
	return E(a(0), a(1), a(2));
}
var O = (e) => Number.isFinite(e) ? e : 0, k = (e) => e - Math.floor(e), A = (e, t, n) => e + (t - e) * n, j = /* @__PURE__ */ new Map([
	["add", [2, (e, t) => e + t]],
	["sub", [2, (e, t) => e - t]],
	["mul", [2, (e, t) => e * t]],
	["div", [2, (e, t) => t === 0 ? 0 : e / t]],
	["min", [2, (e, t) => Math.min(e, t)]],
	["max", [2, (e, t) => Math.max(e, t)]],
	["pow", [2, (e, t) => Math.abs(e) ** Math.min(Math.max(t, -16), 16)]],
	["abs", [1, Math.abs]],
	["floor", [1, Math.floor]],
	["fract", [1, k]],
	["sqrt", [1, (e) => Math.sqrt(Math.max(e, 0))]],
	["invert", [1, (e) => 1 - e]],
	["clamp", [3, (e, t, n) => Math.min(Math.max(e, t), Math.max(t, n))]],
	["smoothstep", [3, (e, t, n) => e === t ? n < e ? 0 : 1 : i(e, t, n)]],
	["mix", [3, A]]
]);
function te(e) {
	let t = C(e.uv, [
		"u",
		"v",
		"both"
	], "uv");
	if (Object.keys(e).length !== 1) throw v("uv takes no other fields.");
	return t === "u" ? T((e) => e) : t === "v" ? T((e, t) => t) : E((e) => e, (e, t) => t, () => 0);
}
function M(e, t, n) {
	if (e.at === void 0) return [(e) => e, (e, t) => t];
	let r = K(e.at, t, n + 1);
	if (r.kind !== "vector") throw v("\"at\" needs a vector such as {\"uv\":\"both\"}.");
	return r.parts;
}
function N(e, t, n) {
	let r = e[t];
	if (!b(r) || Object.keys(e).length !== 1) throw v(`${t} takes { ${n.join(", ")} } and nothing else.`);
	return x(r, n, t), r;
}
var P = 3735928580, F = (e, t) => e << t | e >>> 32 - t, ne = .6616, re = .5, ie = 2;
function I(e, t) {
	let n = P + e >>> 0, r = P + t >>> 0, i = P;
	return i = (i ^ r) - F(r, 14), n = ((n ^ i) >>> 0) - F(i, 11), r = ((r ^ n) >>> 0) - F(n, 25), i = ((i ^ r) >>> 0) - F(r, 16), n = ((n ^ i) >>> 0) - F(i, 4), r = ((r ^ n) >>> 0) - F(n, 14), i = ((i ^ r) >>> 0) - F(r, 24), i >>> 0;
}
function L(e, t, n) {
	let r = e & 7, i = r < 4 ? t : n, a = 2 * (r < 4 ? n : t);
	return (r & 1 ? -i : i) + (r & 2 ? -a : a);
}
var R = (e) => e * e * e * (e * (e * 6 - 15) + 10);
function z(e, t, n) {
	return n === 0 ? I(e, t) : I(a(e, n), a(t, n));
}
function ae(e, t, n) {
	let r = Math.floor(e), i = Math.floor(t), a = e - r, o = t - i, s = R(a), c = R(o);
	return ne * A(A(L(z(r, i, n), a, o), L(z(r + 1, i, n), a - 1, o), s), A(L(z(r, i + 1, n), a, o - 1), L(z(r + 1, i + 1, n), a - 1, o - 1), s), c);
}
function oe(e, t, n, r = 0) {
	let i = 0, a = 1, o = 0, s = 1;
	for (let c = 0; c < n; c++) i += ae(e * s, t * s, r * s) * a, o += a, a *= re, s *= ie;
	return .5 * i / o + .5;
}
var se = 7919, ce = 104729, B = 1024;
function le(e, t, n) {
	let r = N(e, "noise", [
		"scale",
		"seed",
		"octaves",
		"tile",
		"at"
	]), i = S(r.scale ?? 4, 1, m, "noise scale"), a = S(r.seed ?? 0, 0, f, "noise seed"), o = S(r.octaves ?? 4, 1, h, "noise octaves");
	if (r.tile !== void 0 && typeof r.tile != "boolean") throw v("noise tile must be true or false.");
	let s = r.tile === !1 ? 0 : i, c = a * se % B, l = a * ce % B;
	t.cost += o * _;
	let [u, d] = M(r, t, n);
	return T((e, t) => oe(u(e, t) * i + c, d(e, t) * i + l, o, s));
}
var ue = [
	"distance",
	"edge",
	"cell"
];
function de(e, t, n) {
	let r = N(e, "voronoi", [
		"scale",
		"seed",
		"output",
		"at"
	]), i = S(r.scale ?? 4, 1, m, "voronoi scale"), a = S(r.seed ?? 0, 0, f, "voronoi seed"), s = C(r.output ?? "distance", ue, "voronoi output");
	t.cost += g;
	let [c, l] = M(r, t, n);
	return T((e, t) => {
		let { nearest: n, second: r, cell: d } = u(c(e, t), l(e, t), i, a);
		return s === "cell" ? d / 4294967296 : o(s === "edge" ? r - n : n);
	});
}
var fe = [
	"u",
	"v",
	"diagonal"
], pe = [
	"sine",
	"saw",
	"triangle"
];
function me(e, t, n) {
	let r = N(e, "wave", [
		"frequency",
		"direction",
		"shape",
		"at"
	]), i = S(r.frequency ?? 4, 1, m, "wave frequency"), a = C(r.direction ?? "u", fe, "wave direction"), o = C(r.shape ?? "sine", pe, "wave shape"), [s, c] = M(r, t, n);
	return T((e, t) => {
		let n = (a === "u" ? s(e, t) : a === "v" ? c(e, t) : s(e, t) + c(e, t)) * i;
		return o === "sine" ? Math.sin(n * Math.PI * 2) * .5 + .5 : o === "saw" ? k(n) : 1 - Math.abs(k(n) * 2 - 1);
	});
}
function he(e, t, n) {
	let r = N(e, "checker", ["count", "at"]), i = S(r.count ?? 8, 2, m, "checker count");
	if (i % 2 != 0) throw v("checker count must be even so it tiles.");
	let [a, o] = M(r, t, n);
	return T((e, t) => (Math.floor(a(e, t) * i) + Math.floor(o(e, t) * i)) % 2 == 0 ? 0 : 1);
}
var ge = [
	"u",
	"v",
	"radial"
];
function _e(e, t, n) {
	let r = N(e, "gradient", ["type", "at"]), i = C(r.type ?? "u", ge, "gradient type"), [a, s] = M(r, t, n);
	return T((e, t) => o(i === "u" ? a(e, t) : i === "v" ? s(e, t) : 1 - Math.hypot(a(e, t) - .5, s(e, t) - .5) * 2));
}
function ve(e, t, n) {
	if (!Array.isArray(e) || e.length !== 2) throw v(`ramp stop ${t} must be [position, value].`);
	let [r, i] = e;
	if (typeof r != "number" || !Number.isFinite(r) || r < 0 || r > 1 || r <= n) throw v("ramp stop positions must rise strictly from 0 to 1.");
	let a = Array.isArray(i);
	if (a ? i.length !== 3 || !i.every(w) : !w(i)) throw v(`ramp stop ${t} value must be a number or [r, g, b] of finite numbers.`);
	return {
		position: r,
		value: i,
		isVector: a
	};
}
function ye(e, t, r) {
	let i = N(e, "ramp", ["value", "stops"]), { stops: a } = i;
	if (!Array.isArray(a) || a.length < 2 || a.length > n.maxStops) throw v(`ramp needs 2 to ${n.maxStops} stops.`);
	let s = -1, c = a.map((e, t) => {
		let n = ve(e, t, s);
		return s = n.position, n;
	});
	if (!c.every((e) => e.isVector === c[0].isVector)) throw v("ramp stops are all numbers or all [r, g, b].");
	let l = K(i.value, t, r + 1);
	if (l.kind !== "scalar") throw v("ramp \"value\" needs a number.");
	let u = (e) => (t, n) => {
		let r = o(l.evaluate(t, n)), i = (t) => t.isVector ? t.value[e] : t.value;
		if (r <= c[0].position) return i(c[0]);
		for (let e = 1; e < c.length; e++) if (r <= c[e].position) {
			let t = c[e - 1], n = c[e];
			return A(i(t), i(n), (r - t.position) / (n.position - t.position));
		}
		return i(c[c.length - 1]);
	};
	return t.cost += 2, c[0].isVector ? E(u(0), u(1), u(2)) : T(u(0));
}
function be(e, t, n) {
	if (!Array.isArray(e.vec) || e.vec.length !== 3 || Object.keys(e).length !== 1) throw v("vec needs [x, y, z] in an array.");
	let [r, i, a] = e.vec.map((e) => {
		let r = K(e, t, n + 1);
		if (r.kind !== "scalar") throw v("vec parts must be numbers.");
		return r.evaluate;
	});
	return E(r, i, a);
}
function xe(e, t, n, r) {
	let [i, a] = j.get(e), o = i === 1 && !Array.isArray(t[e]) ? [t[e]] : t[e];
	if (!Array.isArray(o) || o.length !== i) throw v(`${e} needs ${i} argument${i === 1 ? "" : "s"}.`);
	return D(o.map((e) => K(e, n, r + 1)), a);
}
function V(e, t, n, r) {
	let i = K(e, t, n + 1);
	if (i.kind !== "scalar") throw v(`${r} needs a number.`);
	return i;
}
function Se(e, t, n) {
	let r = N(e, "layer", [
		"base",
		"top",
		"mask",
		"edge",
		"softness"
	]);
	for (let e of [
		"base",
		"top",
		"mask"
	]) if (r[e] === void 0) throw v(`layer needs "${e}".`);
	let a = r.edge ?? .5, o = r.softness ?? .1;
	if (!w(a) || !w(o) || o < 0) throw v("layer edge is a number and softness a number from 0.");
	let s = K(r.base, t, n + 1), c = K(r.top, t, n + 1), l = V(r.mask, t, n, "layer \"mask\"");
	return D([
		s,
		c,
		T((e, t) => {
			let n = l.evaluate(e, t);
			return o === 0 ? +(n >= a) : i(a - o, a + o, n);
		})
	], A);
}
function Ce(e, t, n) {
	let r = Math.max(e, t, n), i = r - Math.min(e, t, n), a = 0;
	return i > 0 && (a = r === e ? ((t - n) / i + 6) % 6 : r === t ? (n - e) / i + 2 : (e - t) / i + 4), [
		a / 6,
		r === 0 ? 0 : i / r,
		r
	];
}
function we(e, t, n) {
	let r = (r) => {
		let i = (r + e * 6) % 6;
		return n * (1 - t * Math.max(0, Math.min(i, 4 - i, 1)));
	};
	return [
		r(5),
		r(3),
		r(1)
	];
}
function Te(e, t, n) {
	let r = N(e, "hue", [
		"color",
		"shift",
		"saturation",
		"value"
	]), i = r.saturation ?? 1, a = r.value ?? 1;
	for (let e of [i, a]) if (typeof e != "number" || !Number.isFinite(e) || e < 0 || e > 4) throw v("hue saturation and value are numbers from 0 to 4.");
	let s = K(r.color, t, n + 1);
	if (s.kind !== "vector") throw v("hue \"color\" needs a colour such as [r, g, b].");
	let c = V(r.shift ?? 0, t, n, "hue \"shift\"");
	t.cost += 4;
	let [l, u, d] = s.parts, f = NaN, p = NaN, m = [
		0,
		0,
		0
	], h = (e, t) => {
		if (e !== f || t !== p) {
			let [n, r, s] = Ce(O(l(e, t)), O(u(e, t)), O(d(e, t)));
			m = we(k(n + O(c.evaluate(e, t))), o(r * i), s * a), f = e, p = t;
		}
		return m;
	};
	return E((e, t) => h(e, t)[0], (e, t) => h(e, t)[1], (e, t) => h(e, t)[2]);
}
function Ee(e, t, r) {
	let i = N(e, "curve", ["value", "points"]), { points: a } = i;
	if (!Array.isArray(a) || a.length < 2 || a.length > n.maxStops) throw v(`curve needs 2 to ${n.maxStops} points.`);
	let o = -Infinity;
	for (let e of a) {
		if (!Array.isArray(e) || e.length !== 2 || !e.every(w) || e[0] <= o) throw v("curve points are [x, y] with x rising.");
		o = e[0];
	}
	return t.cost += 2, D([K(i.value, t, r + 1)], (e) => {
		if (e <= a[0][0]) return a[0][1];
		for (let t = 1; t < a.length; t++) if (e <= a[t][0]) {
			let [n, r] = a[t - 1], [i, o] = a[t];
			return A(r, o, (e - n) / (i - n));
		}
		return a[a.length - 1][1];
	});
}
var De = [
	"generated",
	"object",
	"world"
];
function Oe(e, t) {
	let n = C(e.coord, De, "coord");
	if (Object.keys(e).length !== 1) throw v("coord takes no other fields.");
	let r = n === "generated" ? 1 : t.size;
	return E((e) => e * r, (e, t) => t * r, () => 0);
}
var ke = [
	"vector",
	"scale",
	"offset",
	"rotate"
];
function H(e, t, n) {
	if (e === void 0) return t;
	let r = typeof e == "number" ? [
		e,
		e,
		e
	] : e;
	if (!Array.isArray(r) || r.length !== 3 || !r.every(w)) throw v(`mapping "${n}" is a number or [x, y, z] of finite numbers.`);
	return r;
}
function Ae(e, t, n) {
	let r = N(e, "mapping", ke), [i, a, o] = H(r.scale, [
		1,
		1,
		1
	], "scale"), [s, c, l] = H(r.offset, [
		0,
		0,
		0
	], "offset"), u = r.rotate ?? 0;
	if (!w(u)) throw v("mapping \"rotate\" is an angle in radians around Z.");
	let d = K(r.vector ?? { coord: "generated" }, t, n + 1);
	if (d.kind !== "vector") throw v("mapping \"vector\" needs a vector such as {\"coord\":\"generated\"}.");
	let [f, p, m] = d.parts, h = Math.cos(u), g = Math.sin(u);
	return E((e, t) => f(e, t) * i * h - p(e, t) * a * g + s, (e, t) => f(e, t) * i * g + p(e, t) * a * h + c, (e, t) => m(e, t) * o + l);
}
var je = [
	"mortar",
	"edge",
	"cell"
], Me = 4;
function Ne(e, t, n) {
	let r = N(e, "brick", [
		"columns",
		"rows",
		"mortar",
		"offset",
		"seed",
		"output",
		"at"
	]), c = S(r.columns ?? 8, 1, m, "brick columns"), l = S(r.rows ?? 8, 2, m, "brick rows");
	if (l % 2 != 0) throw v("brick rows must be even so the bond tiles.");
	let u = S(r.seed ?? 0, 0, f, "brick seed"), d = C(r.output ?? "mortar", je, "brick output"), p = r.mortar ?? .05, h = r.offset ?? .5;
	if (!w(p) || p < 0 || p > .5) throw v("brick mortar is the joint width as a share of a brick, from 0 to 0.5.");
	if (!w(h) || h < 0 || h >= 1) throw v("brick offset is the shift of every other row as a share of a brick, from 0 up to 1.");
	t.cost += Me;
	let [g, _] = M(r, t, n);
	return T((e, t) => {
		let n = _(e, t) * l, r = Math.floor(n), f = g(e, t) * c + (a(r, 2) === 1 ? h : 0), m = Math.floor(f);
		if (d === "cell") return s(a(m, c), a(r, l), u) / 4294967296;
		let v = f - m, y = n - r, b = Math.min(v, 1 - v, y, 1 - y);
		return d === "edge" ? o(b * 2) : p === 0 ? 0 : 1 - i(p * .5, p, b);
	});
}
var Pe = ["value", "color"];
function Fe(e, t, n) {
	let r = N(e, "whiteNoise", [
		"scale",
		"seed",
		"output",
		"at"
	]), i = S(r.scale ?? 16, 1, m, "whiteNoise scale"), o = S(r.seed ?? 0, 0, f, "whiteNoise seed"), c = C(r.output ?? "value", Pe, "whiteNoise output"), [l, u] = M(r, t, n), d = (e) => (t, n) => {
		let r = a(Math.floor(l(t, n) * i), i), c = a(Math.floor(u(t, n) * i), i);
		return s(r, c, o + e * 7919 | 0) / 4294967296;
	};
	return c === "color" ? E(d(1), d(2), d(3)) : T(d(0));
}
var Ie = ["color", "alpha"], Le = 4, Re = /^[a-f0-9]{64}$/, U = (e) => {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
};
function ze(e, t, n, r, i) {
	let { width: o, height: s, data: c } = e, l = k(t) * o - .5, u = k(n) * s - .5, d = Math.floor(l), f = Math.floor(u), p = l - d, m = u - f, h = (e, t) => i(c[(a(t, s) * o + a(e, o)) * 4 + r]);
	return A(A(h(d, f), h(d + 1, f), p), A(h(d, f + 1), h(d + 1, f + 1), p), m);
}
function W(e) {
	let t = /* @__PURE__ */ new Set(), r = (e, i) => {
		if (!(!e || typeof e != "object" || i > n.maxDepth * 3)) {
			!Array.isArray(e) && typeof e.image?.asset == "string" && t.add(e.image.asset);
			for (let t of Array.isArray(e) ? e : Object.values(e)) r(t, i + 1);
		}
	};
	return r(e, 0), [...t];
}
function Be(e, t, n) {
	let r = N(e, "image", [
		"asset",
		"output",
		"at"
	]), i = typeof r.asset == "string" ? r.asset.toLowerCase() : r.asset;
	if (typeof i != "string" || !Re.test(i)) throw v("image asset must be the 64 hexadecimal characters of a catalog image asset ID; scene_asset_catalog lists them. Remote URLs are not accepted.");
	let a = C(r.output ?? "color", Ie, "image output");
	t.cost += Le;
	let [o, s] = M(r, t, n), c = t.images ? t.images.get(i) : null;
	if (t.images && !c) throw v(`image ${i.slice(0, 12)} was not loaded. The host decodes catalog images before the scene is created.`);
	if (!c) return a === "alpha" ? T(() => 0) : E(() => 0, () => 0, () => 0);
	let l = (e, t) => (n, r) => ze(c, o(n, r), s(n, r), e, t);
	return a === "alpha" ? T(l(3, (e) => e / 255)) : E(l(0, U), l(1, U), l(2, U));
}
var G = /* @__PURE__ */ new Map([
	["image", Be],
	["noise", le],
	["whiteNoise", Fe],
	["brick", Ne],
	["voronoi", de],
	["wave", me],
	["checker", he],
	["gradient", _e]
]);
function K(t, r, i) {
	if (r.nodeCount++, r.cost++, r.nodeCount > n.maxNodes) throw v(`more than ${n.maxNodes} nodes.`);
	if (i > n.maxDepth) throw v(`nesting deeper than ${n.maxDepth}.`);
	if (typeof t == "number") {
		if (!w(t)) throw v(`numbers must be finite and within ${d}.`);
		return T(() => t);
	}
	if (Array.isArray(t)) {
		if (t.length !== 3 || !t.every(w)) throw v("a vector literal is three finite numbers; build one from expressions with \"vec\".");
		let [e, n, r] = t;
		return E(() => e, () => n, () => r);
	}
	if (!b(t)) throw v("each node is a number, a vector of three numbers or an object with one operator.");
	let a = Object.keys(t);
	if (a.length !== 1) throw v(`a node holds exactly one operator; got ${a.length}.`);
	let o = a[0];
	if (o === "uv") return te(t);
	if (o === "coord") return Oe(t, r);
	if (o === "mapping") return Ae(t, r, i);
	if (o === "vec") return be(t, r, i);
	if (o === "ramp") return ye(t, r, i);
	if (o === "layer") return Se(t, r, i);
	if (o === "hue") return Te(t, r, i);
	if (o === "curve") return Ee(t, r, i);
	if (G.has(o)) return G.get(o)(t, r, i);
	if (j.has(o)) return xe(o, t, r, i);
	throw v(`unknown operator ${y(o)}. Use one of ${e.join(", ")}.`);
}
var Ve = [
	"roughness",
	"metallic",
	"height",
	"opacity",
	"clearcoat",
	"transmission"
];
function q(e, { size: n = 1, images: r } = {}) {
	if (!b(e)) throw v(`graph must be an object with outputs: ${t.join(", ")}.`);
	x(e, t, "graph");
	let i = Object.keys(e);
	if (i.length === 0) throw v(`graph needs at least one output: ${t.join(", ")}.`);
	let a = {
		nodeCount: 0,
		cost: 0,
		size: n,
		images: r
	}, o = {};
	for (let t of i) if (o[t] = K(e[t], a, 0), Ve.includes(t) && o[t].kind !== "scalar") throw v(`${t} needs a number, not a vector.`);
	return {
		outputs: o,
		nodeCount: a.nodeCount,
		cost: a.cost
	};
}
function J(e, t) {
	if (e.cost * t * t > n.maxWork) throw RangeError(`Material graph: ${e.cost} work units per pixel at ${t} by ${t} is over the limit of ${n.maxWork}. Use fewer nodes or a smaller resolution.`);
}
function Y(e, t) {
	return J(q(e), t), JSON.parse(JSON.stringify(e));
}
function X(e, t, n) {
	if (e.kind === "scalar") {
		let r = O(e.evaluate(t, n));
		return [
			r,
			r,
			r
		];
	}
	return [
		O(e.parts[0](t, n)),
		O(e.parts[1](t, n)),
		O(e.parts[2](t, n))
	];
}
var Z = (e) => Math.round(o(O(e)) * 255);
function Q(e, t, n) {
	e[t] = Z(n), e[t + 3] = 255;
}
function $(e, t, n) {
	for (let r = 0; r < 3; r++) e[t + r] = l(n[r]);
	e[t + 3] = 255;
}
function He(e) {
	return e ? e instanceof Map ? e : new Map(Object.entries(e)) : /* @__PURE__ */ new Map();
}
function Ue(e, t) {
	let n = {};
	for (let r of W(e)) {
		let e = r.toLowerCase(), i = t?.get(e);
		i && (n[e] = {
			width: i.width,
			height: i.height,
			data: i.data
		});
	}
	return n;
}
function We(e, { resolution: t, bump: n, size: i = 1 }, a) {
	let s = q(e, {
		size: i,
		images: He(a)
	});
	J(s, t);
	let { color: l, roughness: u, metallic: d, emission: f, height: p, opacity: m, clearcoat: h, transmission: g, aov: _ } = s.outputs, v = t * t, y = l || m ? new Uint8ClampedArray(v * 4).fill(255) : null, b = h ? new Uint8ClampedArray(v * 4) : null, x = g ? new Uint8ClampedArray(v * 4) : null, S = f ? new Uint8ClampedArray(v * 4) : null, C = _ ? new Uint8ClampedArray(v * 4) : null, w = u || d ? new Uint8ClampedArray(v * 4) : null;
	for (let e = 0; e < t; e++) for (let n = 0; n < t; n++) {
		let r = e * t + n, i = (n + .5) / t, a = (e + .5) / t, s = r * 4;
		if (l && $(y, s, X(l, i, a)), m && (y[s + 3] = Z(m.evaluate(i, a))), h && Q(b, s, h.evaluate(i, a)), g && Q(x, s, g.evaluate(i, a)), f && $(S, s, X(f, i, a)), _) {
			let e = X(_, i, a);
			for (let t = 0; t < 3; t++) C[s + t] = Z(e[t]);
			C[s + 3] = 255;
		}
		w && (w[s] = 255, w[s + 1] = u ? Math.round(o(O(u.evaluate(i, a))) * 255) : 255, w[s + 2] = d ? Math.round(o(O(d.evaluate(i, a))) * 255) : 255, w[s + 3] = 255);
	}
	let T = (e, n) => e ? {
		image: c(e, t, t),
		colorSpace: n
	} : void 0;
	return {
		map: T(y, "srgb"),
		emissiveMap: T(S, "srgb"),
		metallicRoughnessMap: T(w, "linear"),
		layerMaps: b ? { clearcoatTexture: T(b, "linear") } : void 0,
		transmissionMap: T(x, "linear"),
		aovMap: T(C, "linear"),
		normalMap: T(p ? r((e, t) => O(p.evaluate(e, t)), t, n) : null, "linear")
	};
}
export { Y as i, W as n, Ue as r, We as t };
