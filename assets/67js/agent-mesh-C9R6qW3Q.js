/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { A as e, D as t, N as n, R as r, T as i, ot as a } from "./mesh-uv-CPpcmeLo.js";
import { t as o } from "./field-error-BpFTmyMO.js";
import { D as s, n as c, r as l, t as u } from "./mesh-recipe-BRDW7Uj_.js";
import { d, l as f, n as p, s as m } from "./quat-Bl7gjwWK.js";
import { i as h, s as g } from "./mesh-operations-ByLVkOhP.js";
import { createTriangleSurfaceIndex as _ } from "./mesh-query.js";
import { S as v } from "./vec3-BRYC6f_g.js";
import "./agent-scene-capabilities-BaawWMO1.js";
var y = /^[A-Za-z0-9][A-Za-z0-9._-]{0,47}$/, b = [
	"name",
	"edits",
	"offsets",
	"value"
], x = [
	"select",
	"offset",
	"falloff"
];
function S(e, t) {
	return /* @__PURE__ */ TypeError(`Shape key ${e} (${t})`);
}
function ee(e, t) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw S(t, "each offsets entry must be { select, offset, falloff }");
	for (let n of Object.keys(e)) if (!x.includes(n)) throw S(t, `offsets entries do not take ${n}; fields: ${x.join(", ")}`);
	return {
		op: "translate",
		...e
	};
}
function C(e) {
	if (!Array.isArray(e) || e.length > 16) throw RangeError("shapeKeys must be an array of at most 16 keys.");
	let t = /* @__PURE__ */ new Set();
	return e.map((e, n) => {
		if (!e || typeof e != "object" || Array.isArray(e)) throw S(n, "each key must be an object");
		for (let t of Object.keys(e)) if (!b.includes(t)) throw S(n, `does not take ${t}; fields: ${b.join(", ")}`);
		if (typeof e.name != "string" || !y.test(e.name)) throw S(n, "name must be 1 to 48 letters, digits, dots, dashes or underscores");
		if (t.has(e.name)) throw S(n, `name ${e.name} is used twice`);
		if (t.add(e.name), e.edits === void 0 == (e.offsets === void 0)) throw S(n, "give exactly one of edits or offsets");
		let r = e.value ?? 0;
		if (typeof r != "number" || !(r >= 0 && r <= 1)) throw S(n, "value is the starting weight, from 0 to 1");
		let i = e.edits ?? (Array.isArray(e.offsets) ? e.offsets.map((e) => ee(e, n)) : null);
		if (!i) throw S(n, "offsets must be an array");
		return l(i), {
			name: e.name,
			value: r,
			edits: i
		};
	});
}
function w(e, t, n, r) {
	return n.map((n) => {
		let i = u(e, n.edits, r).mesh;
		if (i.vertexCount !== e.vertexCount || i.faceCount !== e.faceCount) throw RangeError(`Shape key ${n.name} changed the mesh from ${e.vertexCount} to ${i.vertexCount} vertices. Use edits that only move vertices (translate, set_position, displace, sculpt, shrinkwrap, smooth, simple_deform, lattice, hook, wave) or offsets.`);
		let a = new Float32Array(t.length * 3);
		for (let n = 0; n < t.length; n++) {
			let r = t[n];
			for (let t = 0; t < 3; t++) a[n * 3 + t] = i.positions[r * 3 + t] - e.positions[r * 3 + t];
		}
		return { positions: a };
	});
}
// src/curve-operations.js
var te = 4096, T = 1e-9, ne = 1 - 1e-9;
function E(e, t) {
	return [
		e[0] - t[0],
		e[1] - t[1],
		e[2] - t[2]
	];
}
function D(e, t, n) {
	return [
		e[0] + t[0] * n,
		e[1] + t[1] * n,
		e[2] + t[2] * n
	];
}
function O(e, t) {
	return e[0] * t[0] + e[1] * t[1] + e[2] * t[2];
}
function k(e) {
	return Math.hypot(e[0], e[1], e[2]);
}
function A(e) {
	let t = k(e);
	return t < T ? [
		0,
		0,
		0
	] : [
		e[0] / t,
		e[1] / t,
		e[2] / t
	];
}
function j(e, t) {
	let n = [], r = t ? e.length : e.length - 1;
	for (let t = 0; t < r; t++) {
		let r = e[t], i = e[(t + 1) % e.length];
		n.push({
			from: r,
			to: i,
			length: k(E(i, r))
		});
	}
	return n;
}
function M(e, t = !1) {
	return j(e, t).reduce((e, t) => e + t.length, 0);
}
function re(e, t, n = !1) {
	let r = j(e, n), i = r.reduce((e, t) => e + t.length, 0);
	if (!(i > T)) throw RangeError("The curve has no length.");
	let a = n ? i / t : i / (t - 1), o = [], s = 0, c = 0;
	for (let e = 0; e < t; e++) {
		let t = e * a;
		for (; s < r.length - 1 && t > c + r[s].length;) c += r[s].length, s++;
		let n = r[s], i = n.length < T ? 0 : Math.min(1, Math.max(0, (t - c) / n.length));
		o.push({
			point: D(n.from, E(n.to, n.from), i),
			direction: A(E(n.to, n.from))
		});
	}
	return o;
}
function ie(e, t, n, r, i) {
	let a = A(E(e, t)), o = A(E(n, t)), s = O(a, o);
	if (s <= -.999999999 || s >= ne) return [t];
	let c = Math.acos(s) / 2, l = Math.min(k(E(e, t)), k(E(n, t))) / 2, u = Math.min(r / Math.tan(c), l), d = u * Math.tan(c), f = D(t, a, u), p = D(t, o, u), m = D(t, A([
		a[0] + o[0],
		a[1] + o[1],
		a[2] + o[2]
	]), d / Math.sin(c)), h = E(f, m), g = E(p, m), _ = Math.acos(Math.min(1, Math.max(-1, O(A(h), A(g))))), v = [];
	for (let e = 0; e <= i; e++) {
		let t = e / i, n = Math.sin((1 - t) * _) / Math.sin(_), r = Math.sin(t * _) / Math.sin(_);
		v.push([
			0,
			1,
			2
		].map((e) => m[e] + h[e] * n + g[e] * r));
	}
	return v;
}
function ae(e, t, n, r = !1) {
	let i = [], a = e.length;
	for (let o = 0; o < a; o++) {
		if (!r && (o === 0 || o === a - 1)) {
			i.push(e[o]);
			continue;
		}
		let s = e[(o + a - 1) % a], c = e[(o + 1) % a];
		if (i.push(...ie(s, e[o], c, t, n)), i.length > 4096) throw RangeError(`Fillet makes more than ${te} points; use fewer corners or arc segments.`);
	}
	return i;
}
// src/mesh-instance-placement.js
var N = Object.freeze([
	"at",
	"spacing",
	"density",
	"variants",
	"variant",
	"rotation",
	"size",
	"realize"
]), oe = 25e4, se = 1e6, ce = .001, le = 1e3, ue = 1e5, de = 40, fe = 41;
function P(e) {
	return /* @__PURE__ */ TypeError(`Instances: place ${e}`);
}
function pe(e) {
	if (e === void 0) return {};
	if (!e || typeof e != "object" || Array.isArray(e)) throw P("must be an object.");
	for (let t of Object.keys(e)) if (!N.includes(t)) throw P(`does not take ${JSON.stringify(t.slice(0, 24))}; fields: ${N.join(", ")}.`);
	if (e.at !== void 0 && e.at !== "vertices" && e.at !== "faces") throw P("at is \"vertices\" or \"faces\".");
	if (e.spacing !== void 0 && !(typeof e.spacing == "number" && e.spacing > 0 && e.spacing <= se)) throw P("spacing is a distance above 0.");
	if (e.realize !== void 0 && typeof e.realize != "boolean") throw P("realize must be boolean.");
	if (e.variant !== void 0 && e.variants === void 0) throw P("variant needs a variants list.");
	let t = e.variants === void 0 ? null : me(e.variants);
	return {
		...e,
		variants: t
	};
}
function me(e) {
	if (!Array.isArray(e) || e.length < 1 || e.length > 16) throw P("variants is 1 to 16 entries.");
	return e.map((e) => {
		let t = typeof e == "string" ? { geometry: e } : e;
		if (!t || typeof t != "object" || Array.isArray(t) || typeof t.geometry != "string" || t.material !== void 0 && typeof t.material != "string" || !Object.keys(t).every((e) => e === "geometry" || e === "material")) throw P("variants entries are a geometry id or { geometry, material }.");
		return t;
	});
}
function F(e, t, n) {
	let r = [], i = [];
	if (t === "vertices") {
		let t = /* @__PURE__ */ new Set();
		for (let n = 0; n < e.positions.length / 3; n++) {
			let a = n * 3, o = [
				0,
				1,
				2
			].map((t) => Math.round(e.positions[a + t] * ue)).join(",");
			t.has(o) || (t.add(o), r.push(e.positions[a], e.positions[a + 1], e.positions[a + 2]), i.push(e.normals[a], e.normals[a + 1], e.normals[a + 2]));
		}
	} else for (let t = 0; t < e.indices.length / 3; t++) {
		let n = [
			0,
			1,
			2
		].map((n) => e.indices[t * 3 + n] * 3), a = [
			0,
			1,
			2
		].map((t) => n.reduce((n, r) => n + e.positions[r + t], 0) / 3), o = [
			0,
			1,
			2
		].map((t) => e.positions[n[1] + t] - e.positions[n[0] + t]), s = [
			0,
			1,
			2
		].map((t) => e.positions[n[2] + t] - e.positions[n[0] + t]), c = [
			o[1] * s[2] - o[2] * s[1],
			o[2] * s[0] - o[0] * s[2],
			o[0] * s[1] - o[1] * s[0]
		], l = Math.hypot(...c);
		l !== 0 && (r.push(...a), i.push(...c.map((e) => e / l)));
	}
	if (r.length / 3 > n) throw P(`at "${t}" found ${r.length / 3} points; raise the surface count to ${n} or more.`);
	return {
		positions: Float64Array.from(r),
		normals: Float64Array.from(i)
	};
}
function I(t, n, r) {
	return t.filter((t) => e(t, de, r) < n[t]);
}
function L(e, t, n) {
	let r = /* @__PURE__ */ new Map(), i = (e, r) => Math.floor(t[e * 3 + r] / n), a = [];
	for (let o of e) {
		let e = [
			i(o, 0),
			i(o, 1),
			i(o, 2)
		];
		if (!R(r, e, t, o, n)) {
			a.push(o);
			let t = e.join(",");
			r.has(t) || r.set(t, []), r.get(t).push(o);
		}
	}
	return a;
}
function R(e, t, n, r, i) {
	for (let a = -1; a <= 1; a++) for (let o = -1; o <= 1; o++) for (let s = -1; s <= 1; s++) {
		let c = e.get(`${t[0] + a},${t[1] + o},${t[2] + s}`);
		if (c) {
			for (let e of c) if (Math.hypot(n[r * 3] - n[e * 3], n[r * 3 + 1] - n[e * 3 + 1], n[r * 3 + 2] - n[e * 3 + 2]) < i) return !0;
		}
	}
	return !1;
}
function z(t, n, r, i) {
	return t[(Math.floor(n ? n[r] : e(r, fe, i) * t.length) % t.length + t.length) % t.length];
}
function he(e, t, n) {
	let r = d(p(), [
		1,
		0,
		0
	], e), i = d(p(), [
		0,
		1,
		0
	], t), a = d(p(), [
		0,
		0,
		1
	], n);
	return m(p(), m(p(), a, i), r);
}
function ge(e, t, n) {
	let r = (r) => Math.min(le, Math.max(ce, e[n ? t * 3 + r : t]));
	return [
		r(0),
		r(1),
		r(2)
	];
}
function _e(e, t = oe) {
	let n = e.reduce((e, t) => e + t.geometry.positions.length / 3, 0);
	if (n > t) throw RangeError(`Realized instances have ${n} vertices, over the limit of ${t}.`);
	let r = e.reduce((e, t) => e + t.geometry.indices.length, 0), i = e.some((e) => e.geometry.uvs?.length), a = e.some((e) => e.geometry.colors?.length), o = new Float32Array(n * 3), s = new Float32Array(n * 3), c = new Uint32Array(r), l = i ? new Float32Array(n * 2) : null, u = a ? new Float32Array(n * 3) : null;
	u && u.fill(1);
	let d = [
		0,
		0,
		0
	], f = [
		0,
		0,
		0
	], p = 0, m = 0;
	for (let { geometry: t, translation: n, rotation: r, scale: i } of e) {
		let e = t.positions.length / 3;
		for (let a = 0; a < e; a++) {
			let e = a * 3, c = (p + a) * 3;
			d[0] = t.positions[e] * i[0], d[1] = t.positions[e + 1] * i[1], d[2] = t.positions[e + 2] * i[2], v(d, d, r), o[c] = d[0] + n[0], o[c + 1] = d[1] + n[1], o[c + 2] = d[2] + n[2], f[0] = t.normals[e] / i[0], f[1] = t.normals[e + 1] / i[1], f[2] = t.normals[e + 2] / i[2], v(f, f, r);
			let l = Math.hypot(f[0], f[1], f[2]) || 1;
			s[c] = f[0] / l, s[c + 1] = f[1] / l, s[c + 2] = f[2] / l;
		}
		l && t.uvs?.length === e * 2 && l.set(t.uvs, p * 2), u && t.colors?.length === e * 3 && u.set(t.colors, p * 3);
		for (let e = 0; e < t.indices.length; e++) c[m + e] = p + t.indices[e];
		p += e, m += t.indices.length;
	}
	return {
		positions: o,
		normals: s,
		indices: c,
		...l ? { uvs: l } : {},
		...u ? { colors: u } : {}
	};
}
// src/mesh-instances.js
var B = 1e6, V = h, ve = Object.freeze([
	...V,
	"seed",
	"where",
	"yaw",
	"alignToNormal",
	"scale",
	"place",
	"realize"
]), ye = 2147483647, be = 8, H = Object.freeze([
	0,
	1,
	0
]), xe = 128, U = /* @__PURE__ */ new Map();
function Se(e) {
	return U.get(e);
}
function Ce(e, t) {
	for (U.has(e) && U.delete(e), U.set(e, t); U.size > xe;) U.delete(U.keys().next().value);
}
var we = 20, Te = 10, Ee = 11, De = 30, Oe = 31, ke = 32;
function W(e) {
	return /* @__PURE__ */ TypeError(`Instances: ${e}`);
}
function G(e, t, n) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw W(`${t} must be an object.`);
	for (let r of Object.keys(e)) if (!n.includes(r)) throw W(`${t} does not take ${JSON.stringify(r.slice(0, 24))}; fields: ${n.join(", ")}.`);
	return e;
}
function K(e, t) {
	if (!Array.isArray(e) || e.length !== 3 || !e.every((e) => typeof e == "number" && Number.isFinite(e) && Math.abs(e) <= B)) throw W(`${t} needs three finite numbers.`);
	return e;
}
function q(e, t, n, r) {
	if (!Number.isInteger(e) || e < t || e > n) throw W(`${r} must be an integer from ${t} to ${n}.`);
	return e;
}
function Ae(e) {
	G(e, "grid", ["counts", "spacing"]);
	let t = K(e.counts, "grid counts").map((e) => q(e, 1, g, "grid count")), n = t[0] * t[1] * t[2];
	if (n > 2048) throw W(`a grid of ${n} points is over the limit of ${g}.`);
	let r = K(e.spacing, "grid spacing"), i = new Float64Array(n * 3), a = 0;
	for (let e = 0; e < t[2]; e++) for (let n = 0; n < t[1]; n++) for (let o = 0; o < t[0]; o++) i[a * 3] = (o - (t[0] - 1) / 2) * r[0], i[a * 3 + 1] = (n - (t[1] - 1) / 2) * r[1], i[a * 3 + 2] = (e - (t[2] - 1) / 2) * r[2], a++;
	return {
		positions: i,
		normals: null
	};
}
function je(t, n) {
	G(t, "scatter", [
		"count",
		"min",
		"max"
	]);
	let r = q(t.count, 1, g, "scatter count"), i = K(t.min, "scatter min"), a = K(t.max, "scatter max"), o = new Float64Array(r * 3);
	for (let t = 0; t < r; t++) for (let r = 0; r < 3; r++) {
		let s = e(t, we + r, n);
		o[t * 3 + r] = i[r] + (a[r] - i[r]) * s;
	}
	return {
		positions: o,
		normals: null
	};
}
function Me(e) {
	let t = e.indices.length / 3, n = new Float64Array(t), r = 0;
	for (let i = 0; i < t; i++) {
		let [t, a, o] = [
			0,
			1,
			2
		].map((t) => e.indices[i * 3 + t] * 3), s = [
			0,
			1,
			2
		].map((n) => e.positions[a + n] - e.positions[t + n]), c = [
			0,
			1,
			2
		].map((n) => e.positions[o + n] - e.positions[t + n]), l = Math.hypot(s[1] * c[2] - s[2] * c[1], s[2] * c[0] - s[0] * c[2], s[0] * c[1] - s[1] * c[0]) / 2;
		r += l, n[i] = r;
	}
	return {
		cumulative: n,
		total: r
	};
}
function Ne(e, t) {
	let n = 0, r = e.length - 1;
	for (; n < r;) {
		let i = n + r >> 1;
		e[i] >= t ? r = i : n = i + 1;
	}
	return n;
}
function Pe(t, n, r) {
	let { cumulative: i, total: a } = Me(t);
	if (!(a > 0)) throw W("the surface geometry has no area.");
	let o = new Float64Array(n * 3), s = new Float64Array(n * 3);
	for (let c = 0; c < n; c++) {
		let n = Ne(i, e(c, De, r) * a), l = Math.sqrt(e(c, Oe, r)), u = e(c, ke, r), d = [
			1 - l,
			l * (1 - u),
			l * u
		], f = [
			0,
			1,
			2
		].map((e) => t.indices[n * 3 + e] * 3);
		for (let e = 0; e < 3; e++) o[c * 3 + e] = f.reduce((n, r, i) => n + t.positions[r + e] * d[i], 0), s[c * 3 + e] = f.reduce((n, r, i) => n + t.normals[r + e] * d[i], 0);
		let p = Math.hypot(s[c * 3], s[c * 3 + 1], s[c * 3 + 2]) || 1;
		for (let e = 0; e < 3; e++) s[c * 3 + e] /= p;
	}
	return {
		positions: o,
		normals: s
	};
}
function Fe(e) {
	if (G(e, "curve", [
		"points",
		"count",
		"length",
		"closed",
		"fillet"
	]), !Array.isArray(e.points) || e.points.length < 2 || e.points.length > 256) throw W("curve points are 2 to 256 positions.");
	let t = e.points.map((e) => K(e, "curve point")), n = e.closed === !0;
	if (e.closed !== void 0 && typeof e.closed != "boolean") throw W("curve closed must be boolean.");
	if (e.count === void 0 == (e.length === void 0)) throw W("curve needs count or length, not both.");
	if (e.length !== void 0 && !(typeof e.length == "number" && Number.isFinite(e.length) && e.length > 0 && e.length <= B)) throw W("curve length is a spacing above 0.");
	if (e.fillet !== void 0 && !(typeof e.fillet == "number" && e.fillet > 0 && e.fillet <= B)) throw W("curve fillet is a radius above 0.");
	let r = e.fillet === void 0 ? t : ae(t, e.fillet, be, n), i = n ? 3 : 2, a = q(e.count === void 0 ? n ? Math.max(i, Math.round(M(r, !0) / e.length)) : Math.max(i, Math.floor(M(r, !1) / e.length) + 1) : e.count, i, g, "curve count"), o = re(r, a, n), s = new Float64Array(a * 3), c = new Float64Array(a * 3);
	return o.forEach(({ point: e, direction: t }, n) => {
		s.set(e, n * 3), c.set(t, n * 3);
	}), {
		positions: s,
		normals: c
	};
}
function Ie(e, t, n, r) {
	let i = V.filter((t) => Object.hasOwn(e, t));
	if (i.length !== 1) throw W(`give exactly one point source: ${V.join(", ")}.`);
	if (i[0] === "grid") return Ae(e.grid);
	if (i[0] === "scatter") return je(e.scatter, t);
	if (i[0] === "curve") return Fe(e.curve);
	let a = G(e.surface, "surface", ["geometry", "count"]), o = q(a.count, 1, g, "surface count");
	if (typeof a.geometry != "string") throw W("surface needs a geometry id.");
	return r.at ? F(n(a.geometry), r.at, o) : Pe(n(a.geometry), o, t);
}
function J(e, n, r, a) {
	if (e === void 0) return null;
	let o = n.positions.length / 3, s = n.normals ?? Float64Array.from({ length: o * 3 }, (e, t) => H[t % 3]);
	return i(e, t(n.positions, s, (e) => {
		if (typeof e != "string") throw W("a field reads a surface by its geometry id.");
		return _(r(e));
	}), a ? { kind: a } : {});
}
function Le(e, t, n, r, i) {
	let a = n.positions.length / 3, o = Array.from({ length: a }, (e, t) => t);
	return r.where && (o = o.filter((e) => r.where.values[e] !== 0)), r.density && (o = I(o, r.density.values, i)), t.spacing && (o = L(o, n.positions, t.spacing)), o;
}
function Re(t, n, r, i, a) {
	let o = p();
	if (t.alignToNormal && i) {
		let e = [
			i[r * 3],
			i[r * 3 + 1],
			i[r * 3 + 2]
		];
		f(o, H, e);
	}
	if (t.yaw) {
		let t = d(p(), H, e(r, Te, n) * Math.PI * 2);
		m(o, o, t);
	}
	return a && m(o, o, he(a[r * 3], a[r * 3 + 1], a[r * 3 + 2])), Array.from(o);
}
function ze(t, n, r, i) {
	let a = t.scale === void 0 ? 1 : t.scale[0] + (t.scale[1] - t.scale[0]) * e(r, Ee, n);
	return i ? ge(i.values, r, i.kind === "vector").map((e) => e * a) : [
		a,
		a,
		a
	];
}
function Be(e) {
	G(e, "instances", ve);
	let t = e.seed === void 0 ? 0 : q(e.seed, 0, ye, "seed");
	for (let t of [
		"yaw",
		"alignToNormal",
		"realize"
	]) if (e[t] !== void 0 && typeof e[t] != "boolean") throw W(`${t} must be boolean.`);
	if (e.alignToNormal && !Object.hasOwn(e, "surface") && !Object.hasOwn(e, "curve")) throw W("alignToNormal needs a surface or curve source, because only those have normals.");
	if (e.scale !== void 0) {
		let t = e.scale;
		if (!Array.isArray(t) || t.length !== 2 || !t.every((e) => typeof e == "number" && Number.isFinite(e) && e > 0 && e <= 1e3) || t[0] > t[1]) throw W("scale is [minimum, maximum] with 0 < minimum <= maximum <= 1000.");
	}
	return t;
}
function Ve(e, t, n, r) {
	return {
		where: J(e.where, n, r, "scalar"),
		density: J(t.density, n, r, "scalar"),
		variant: J(t.variant, n, r, "scalar"),
		rotation: J(t.rotation, n, r, "vector"),
		size: J(t.size, n, r)
	};
}
function He(e, { resolveSurface: t, maxNodes: n, maxVertices: r }, i) {
	if (!Array.isArray(e)) return e;
	let a = [];
	for (let o of e) {
		if (!o || typeof o != "object" || !Object.hasOwn(o, "instances")) {
			a.push(o);
			continue;
		}
		let { instances: e, geometry: s, material: c, ...l } = o, u = pe(e?.place);
		if (typeof c != "string" || typeof s != "string" && !u.variants) throw W(`node ${JSON.stringify(String(o.id).slice(0, 48))} needs geometry and material ids to instance.`);
		let d = Be(e);
		if (u.at && !Object.hasOwn(e, "surface")) throw W("place.at needs a surface source.");
		let f = Ie(e, d, t, u), p = Ve(e, u, f, t);
		a.push(l);
		let m = Le(e, u, f, p, d).map((t, n) => {
			let r = u.variants ? z(u.variants, p.variant?.values, t, d) : {
				geometry: s,
				material: c
			};
			return {
				slot: n,
				geometry: r.geometry,
				material: r.material ?? c,
				translation: [
					f.positions[t * 3],
					f.positions[t * 3 + 1],
					f.positions[t * 3 + 2]
				],
				rotation: Re(e, d, t, f.normals, p.rotation?.values),
				scale: ze(e, d, t, p.size)
			};
		});
		if (e.realize || u.realize) {
			let e = /* @__PURE__ */ new Map();
			for (let n of m) e.has(n.material) || e.set(n.material, []), e.get(n.material).push({
				geometry: t(n.geometry),
				translation: n.translation,
				rotation: n.rotation,
				scale: n.scale
			});
			let s = 0;
			for (let [t, c] of e) {
				let e = _e(c, r), l = `${o.id}.${s}`, u = `${o.id}.realized.${s}`, d = 1;
				for (; d <= 128 && U.has(JSON.stringify({
					type: "box",
					bevel: 0,
					subdivisions: d
				}));) d++;
				let f = {
					type: "box",
					bevel: 0,
					subdivisions: d
				};
				Ce(JSON.stringify(f), e);
				let p = i?.push({
					id: u,
					type: "mesh",
					base: f
				});
				if (a.push({
					id: l,
					parent: o.id,
					geometry: u,
					material: t,
					translation: [
						0,
						0,
						0
					],
					rotation: [
						0,
						0,
						0,
						1
					],
					scale: [
						1,
						1,
						1
					],
					...typeof p == "number" ? {} : { realizedGeometry: e }
				}), s++, a.length > n) throw RangeError(`Instances expand past the limit of ${n} nodes.`);
			}
		} else for (let e of m) if (a.push({
			id: `${o.id}.${e.slot}`,
			parent: o.id,
			geometry: e.geometry,
			material: e.material,
			translation: e.translation,
			rotation: e.rotation,
			scale: e.scale
		}), a.length > n) throw RangeError(`Instances expand past the limit of ${n} nodes.`);
	}
	return a;
}
// src/agent-mesh.js
var Y = /* @__PURE__ */ new WeakMap(), X = /* @__PURE__ */ new WeakMap(), Ue = 64, Z = 67108864, We = class {
	constructor() {
		this.entries = /* @__PURE__ */ new Map(), this.bytes = 0, this.hits = 0, this.misses = 0;
	}
	get(e) {
		let t = this.entries.get(e);
		if (!t) this.misses++;
		else return this.hits++, this.entries.delete(e), this.entries.set(e, t), t.value;
	}
	set(e, t) {
		let n = Ge(t.mesh);
		if (n > Z) return;
		let r = this.entries.get(e);
		for (r && (this.bytes -= r.bytes, this.entries.delete(e)), this.entries.set(e, {
			value: t,
			bytes: n
		}), this.bytes += n; this.entries.size > Ue || this.bytes > Z;) {
			let [e, t] = this.entries.entries().next().value;
			this.entries.delete(e), this.bytes -= t.bytes;
		}
	}
};
function Ge(e) {
	let t = e.positions.byteLength + e.faceOffsets.byteLength + e.cornerVertices.byteLength + e.edgeVertices.byteLength + e.cornerEdges.byteLength;
	for (let n of Object.values(e.attributes)) for (let e of Object.values(n)) t += e.data.byteLength;
	return t;
}
var Q = new We(), $ = /* @__PURE__ */ new WeakMap();
function Ke(e, t) {
	let n = t.tag === "water" ? e.vertexGroups?.foam : void 0;
	return !n || e.skyVisibility ? e : ($.has(e) || $.set(e, {
		...e,
		skyVisibility: Float32Array.from(n, (e) => 1 - e)
	}), $.get(e));
}
function qe(e = [], t = []) {
	let n = (e) => e?.op === "ocean";
	return e.some(n) || t.some(n) ? 180 : 30;
}
function Je(e, t, { maxVertices: i, stack: a = [], smoothAngle: s = qe(t, a), resolveCutter: l, cacheKey: d, shapeKeys: f = [] }) {
	let p = d && Se(d);
	if (p) {
		if (p.positions.length / 3 > i) throw o("edits", p.positions.length / 3, `an edited mesh of at most ${i} render vertices (maxVertices); use fewer subdivisions or segments`);
		return p;
	}
	let m = d === void 0 ? void 0 : `${d}|edits|${JSON.stringify(t)}`, h = m === void 0 ? void 0 : Q.get(m);
	if (!h) {
		let r = n(e()), a = u(r, t, {
			maxVertices: i,
			maxFaces: i,
			resolveCutter: l && ((e) => n(l(e)))
		});
		h = {
			mesh: a.mesh,
			result: a.results
		}, m !== void 0 && Q.set(m, h);
	}
	let g = c(h.mesh, a, {
		maxVertices: i,
		maxFaces: i,
		cache: Q,
		cacheKey: m
	}), { geometry: _, renderVertexSource: v } = r(g.mesh, { sharpAngle: s * Math.PI / 180 });
	if (_.positions.length / 3 > i) throw o("edits", _.positions.length / 3, `an edited mesh of at most ${i} render vertices (maxVertices); use fewer subdivisions or segments`);
	let y = C(f);
	return y.length && (_.morphTargets = w(g.mesh, v, y, {
		maxVertices: i,
		maxFaces: i,
		resolveCutter: l && ((e) => n(l(e)))
	}), _.morphTargetNames = y.map((e) => e.name), _.morphTargetValues = Float32Array.from(y, (e) => e.value)), X.set(_, {
		mesh: g.mesh,
		results: h.result,
		stack: g.results
	}), _;
}
function Ye(e, t, n) {
	X.set(e, {
		mesh: t,
		results: n,
		stack: []
	});
}
function Xe(e, t) {
	let n = X.get(e);
	if (!n) throw o("region", t, "a tag on a mesh geometry; tag faces with a mesh_edit tag op, or drop region");
	let { mesh: r } = n, i = [];
	for (let e of a(r, t)) for (let t = r.faceOffsets[e]; t < r.faceOffsets[e + 1]; t++) {
		let e = r.cornerVertices[t];
		i.push(r.positions[e * 3], r.positions[e * 3 + 1], r.positions[e * 3 + 2]);
	}
	if (i.length === 0) throw o("region", t, "a tag that is on some faces; tag faces with a mesh_edit tag op, or use another region");
	return { positions: Float32Array.from(i) };
}
function Ze(e) {
	let t = {
		triangles: 0,
		quads: 0,
		ngons: 0
	};
	for (let n = 0; n < e.faceCount; n++) {
		let r = e.faceOffsets[n + 1] - e.faceOffsets[n];
		r === 3 ? t.triangles++ : r === 4 ? t.quads++ : t.ngons++;
	}
	return t;
}
function Qe(e) {
	let t = (e) => Math.round(e * 1e5) / 1e5;
	return {
		min: e.min.map(t),
		max: e.max.map(t)
	};
}
function $e(e) {
	return X.get(e)?.mesh ?? n(e);
}
function et(e) {
	let t = Y.get(e);
	if (t) return t;
	let r = X.get(e), i = r?.mesh ?? n(e), a = s(i, { geometry: !0 });
	return t = Object.freeze({
		ok: a.ok,
		counts: {
			...a.counts,
			triangles: e.indices.length / 3,
			renderVertices: e.positions.length / 3
		},
		faces: Ze(i),
		valence: a.valence,
		quadQuality: a.quadQuality,
		topologyScore: a.topologyScore,
		parts: a.parts,
		tags: a.tags,
		bounds: Qe(a.bounds),
		problems: a.problems,
		...a.skippedChecks ? { skippedChecks: a.skippedChecks } : {},
		...r ? {
			edits: r.results,
			stack: r.stack
		} : {}
	}), Y.set(e, t), t;
}
export { Xe as a, C as c, Ye as i, et as n, Ke as o, $e as r, He as s, Je as t };
