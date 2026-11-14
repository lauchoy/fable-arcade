/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { n as e, r as t, t as n } from "./depth-layer-Czrj5Xb7.js";
import { i as r } from "./path-tracer-reprojection-BCea75Lv.js";
var i = 1e-8, a = 2e6, o = 4e6, s = Math.cos(Math.PI / 180), c = 20, l = .0088, u = 43, d = .02, f = 64, p = 16, m = 2, h = 4096, g = /* @__PURE__ */ new Set([
	"foliage",
	"grass",
	"water",
	"fire",
	"smoke"
]), _ = /* @__PURE__ */ new WeakMap();
function v(e) {
	let t = _.get(e);
	if (t) return t;
	t = [
		Infinity,
		Infinity,
		Infinity,
		-Infinity,
		-Infinity,
		-Infinity
	];
	let { positions: n } = e;
	for (let e = 0; e < n.length; e += 3) for (let r = 0; r < 3; r++) t[r] = Math.min(t[r], n[e + r]), t[3 + r] = Math.max(t[3 + r], n[e + r]);
	return _.set(e, t), t;
}
function y(e) {
	let t = v(e.geometry), n = e.matrix, r = [
		Infinity,
		Infinity,
		Infinity,
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let e = 0; e < 8; e++) {
		let i = e & 1 ? t[3] : t[0], a = e & 2 ? t[4] : t[1], o = e & 4 ? t[5] : t[2];
		for (let e = 0; e < 3; e++) {
			let t = n[e] * i + n[4 + e] * a + n[8 + e] * o + n[12 + e];
			r[e] = Math.min(r[e], t), r[3 + e] = Math.max(r[3 + e], t);
		}
	}
	return r;
}
function b(e) {
	return e[0] * (e[5] * e[10] - e[6] * e[9]) - e[4] * (e[1] * e[10] - e[2] * e[9]) + e[8] * (e[1] * e[6] - e[2] * e[5]) < 0 ? -1 : 1;
}
function x(e) {
	return Math.hypot(e[3] - e[0], e[4] - e[1], e[5] - e[2]);
}
function S(e) {
	return 2 ** (Math.floor(Math.log2(Math.max(e, 1e-30))) - 23);
}
function ee(e) {
	return Math.max(1e-4, 8 * S(e));
}
function C(e) {
	return Math.min(.25, Math.max(.002, 15e-5 * e));
}
function w(e) {
	let { geometry: t, material: n } = e;
	return e.skin || e.morph || e.crowd || t.skinIndices || t.morphTargets ? !0 : g.has(n?.tag) || n?.transmission > 0;
}
function T(e) {
	let t = /* @__PURE__ */ new Map(), n = [];
	for (let r of e) {
		if (!r.geometry?.indices?.length || w(r)) continue;
		let e = t.get(r.geometry) ?? /* @__PURE__ */ new Map();
		t.set(r.geometry, e);
		let i = Array.prototype.join.call(r.matrix, ","), a = e.get(i) ?? 0;
		a >= 2 || (e.set(i, a + 1), n.push(r));
	}
	return n;
}
function E(e, t) {
	let n = e.map((e, t) => ({
		part: e,
		order: t,
		bounds: y(e),
		triangles: e.geometry.indices.length / 3
	}));
	if (n.reduce((e, t) => e + t.triangles, 0) <= t) return {
		entries: n,
		unchecked: []
	};
	let r = [...n].sort((e, t) => x(t.bounds) - x(e.bounds)), i = [], a = [], o = 0;
	for (let e of r) o + e.triangles <= t ? (o += e.triangles, i.push(e)) : a.push(e.part);
	return i.sort((e, t) => e.order - t.order), {
		entries: i,
		unchecked: a
	};
}
function D(e) {
	let t = e.reduce((e, t) => e + t.triangles, 0), n = {
		count: 0,
		corners: new Float64Array(t * 9),
		normals: new Float64Array(t * 3),
		boxes: new Float64Array(t * 6),
		areas: new Float64Array(t),
		owner: new Uint32Array(t),
		local: new Uint32Array(t)
	};
	return e.forEach((e, t) => O(n, e.part, t)), n;
}
function O(e, t, n) {
	let { positions: r, indices: i } = t.geometry, a = t.matrix, o = b(a), { corners: s, normals: c, boxes: l } = e;
	for (let t = 0; t < i.length; t += 3) {
		let u = e.count * 9;
		for (let e = 0; e < 3; e++) {
			let n = i[t + e] * 3, o = r[n], c = r[n + 1], l = r[n + 2];
			s[u + e * 3] = a[0] * o + a[4] * c + a[8] * l + a[12], s[u + e * 3 + 1] = a[1] * o + a[5] * c + a[9] * l + a[13], s[u + e * 3 + 2] = a[2] * o + a[6] * c + a[10] * l + a[14];
		}
		let d = s[u + 3] - s[u], f = s[u + 4] - s[u + 1], p = s[u + 5] - s[u + 2], m = s[u + 6] - s[u], h = s[u + 7] - s[u + 1], g = s[u + 8] - s[u + 2], _ = f * g - p * h, v = p * m - d * g, y = d * h - f * m, b = Math.hypot(_, v, y);
		if (!(b > 1e-12)) continue;
		let x = e.count, S = o / b;
		c[x * 3] = _ * S, c[x * 3 + 1] = v * S, c[x * 3 + 2] = y * S;
		for (let e = 0; e < 3; e++) {
			let t = Math.min(s[u + e], s[u + 3 + e], s[u + 6 + e]), n = Math.max(s[u + e], s[u + 3 + e], s[u + 6 + e]);
			l[x * 6 + e] = t, l[x * 6 + 3 + e] = n;
		}
		e.areas[x] = b / 2, e.owner[x] = n, e.local[x] = t / 3, e.count++;
	}
}
function k(e, t) {
	let n = [], r = Math.max(1, Math.floor(e.count / h));
	for (let t = 0; t < e.count; t += r) {
		let r = t * 6;
		n.push(Math.max(e.boxes[r + 3] - e.boxes[r], e.boxes[r + 4] - e.boxes[r + 1], e.boxes[r + 5] - e.boxes[r + 2]));
	}
	return n.sort((e, t) => e - t), Math.max(2 * n[n.length >> 1], 4 * t, 1e-6);
}
function A(e, t, n) {
	let r = e.normals[t * 3], i = e.normals[t * 3 + 1], a = e.normals[t * 3 + 2], o = Math.max(Math.abs(r), Math.abs(i), Math.abs(a)), s = !1, f = !1;
	for (let e of [
		r,
		i,
		a
	]) Math.abs(e) < o - d || (e < 0 ? f = !0 : s = !0);
	n.length = 0;
	for (let e of [1, -1]) {
		if (e > 0 ? !s : !f) continue;
		let t = Math.round((r * e - l) * c), o = Math.round((r * e + l) * c), d = Math.round((i * e - l) * c), p = Math.round((i * e + l) * c), m = Math.round((a * e - l) * c), h = Math.round((a * e + l) * c);
		for (let e = t; e <= o; e++) for (let t = d; t <= p; t++) for (let r = m; r <= h; r++) {
			let i = ((e + c + 1) * u + t + c + 1) * u + r + c + 1;
			n.includes(i) || n.push(i);
		}
	}
	return n;
}
var j = /* @__PURE__ */ new Int32Array(6);
function M(e, t, n, r) {
	let i = 1;
	for (let a = 0; a < 3; a++) {
		let o = Math.floor((e.boxes[t * 6 + a] - r / 2) / n), s = Math.floor((e.boxes[t * 6 + 3 + a] + r / 2) / n);
		j[a] = o, j[3 + a] = s, i *= s - o + 1;
	}
	return i;
}
function N(e, t, n, r, i) {
	return (Math.imul(n, 73856093) ^ Math.imul(r, 19349663) ^ Math.imul(i, 83492791) ^ Math.imul(e * m + t, 2654435761)) >>> 0;
}
function te(e, t, n) {
	let r = Array.from({ length: 3 }, () => /* @__PURE__ */ new Map()), i = new Uint8Array(e.count), a = [], o = (r, i, o) => {
		if (A(e, r, a), i === m) {
			for (let e of a) o(e);
			return;
		}
		M(e, r, t * p ** i, n);
		let [s, c, l, u, d, f] = j;
		for (let e of a) for (let t = s; t <= u; t++) for (let n = c; n <= d; n++) for (let r = l; r <= f; r++) o(N(e, i, t, n, r));
	};
	for (let a = 0; a < e.count; a++) {
		let s = 0;
		for (; s < m && M(e, a, t * p ** s, n) > f;) s++;
		i[a] = s;
		let c = r[s];
		o(a, s, (e) => {
			let t = c.get(e);
			t ? t.natives.push(a) : c.set(e, {
				natives: [a],
				guests: []
			});
		});
	}
	for (let t = 0; t < e.count; t++) for (let e = i[t] + 1; e <= m; e++) {
		let n = r[e];
		n.size !== 0 && o(t, e, (e) => n.get(e)?.guests.push(t));
	}
	return r.flatMap((e) => [...e.values()]);
}
var ne = /* @__PURE__ */ new Float64Array(32), re = /* @__PURE__ */ new Float64Array(32), P = /* @__PURE__ */ new Float64Array(2);
function ie(e, t, n, r, i, a) {
	let { corners: o, normals: s } = e, c = ne, l = re, u = 3;
	for (let e = 0; e < 3; e++) c[e * 2] = o[n * 9 + e * 3 + i], c[e * 2 + 1] = o[n * 9 + e * 3 + a];
	let d = t * 9, f = (o[d + 3 + i] - o[d + i]) * (o[d + 6 + a] - o[d + a]) - (o[d + 3 + a] - o[d + a]) * (o[d + 6 + i] - o[d + i]) >= 0 ? 1 : -1;
	for (let e = 0; e < 3 && u > 0; e++) {
		let t = o[d + e * 3 + i], n = o[d + e * 3 + a], r = o[d + (e + 1) % 3 * 3 + i] - t, s = o[d + (e + 1) % 3 * 3 + a] - n, p = 0, m = c[u * 2 - 2], h = c[u * 2 - 1], g = f * (r * (h - n) - s * (m - t));
		for (let e = 0; e < u; e++) {
			let i = c[e * 2], a = c[e * 2 + 1], o = f * (r * (a - n) - s * (i - t));
			if (o >= 0 != g >= 0) {
				let e = g / (g - o);
				l[p * 2] = m + (i - m) * e, l[p * 2 + 1] = h + (a - h) * e, p++;
			}
			o >= 0 && (l[p * 2] = i, l[p * 2 + 1] = a, p++), m = i, h = a, g = o;
		}
		let _ = c;
		c = l, l = _, u = p;
	}
	if (u < 3) return 0;
	let p = 0, m = 0, h = 0;
	for (let e = 0; e < u; e++) {
		let t = (e + 1) % u;
		p += c[e * 2] * c[t * 2 + 1] - c[t * 2] * c[e * 2 + 1], m += c[e * 2], h += c[e * 2 + 1];
	}
	return P[0] = m / u, P[1] = h / u, Math.abs(p) / 2 / Math.max(Math.abs(s[t * 3 + r]), 1e-12);
}
function ae(e, t, n, r, i, a, o) {
	let { corners: s, normals: c } = e, l = c[t * 3 + r] * (a - s[t * 9 + r]) + c[t * 3 + i] * (o - s[t * 9 + i]);
	return s[t * 9 + n] - l / c[t * 3 + n];
}
function oe(e, t, n, r, a) {
	let { corners: o, normals: c, boxes: l, areas: u, owner: d } = e, f = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Map(), m = (e, n) => {
		let r = Math.min(e, n) * t.length + Math.max(e, n), i = p.get(r);
		if (i === void 0) {
			let a = t[e].bounds, o = t[n].bounds;
			i = C(Math.hypot(Math.max(a[3], o[3]) - Math.min(a[0], o[0]), Math.max(a[4], o[4]) - Math.min(a[1], o[1]), Math.max(a[5], o[5]) - Math.min(a[2], o[2]))), p.set(r, i);
		}
		return i;
	};
	return function(p, h) {
		if (p === h) return;
		let g = Math.min(p, h), _ = Math.max(p, h);
		for (let e = 0; e < 3; e++) if (l[g * 6 + 3 + e] < l[_ * 6 + e] - n || l[_ * 6 + 3 + e] < l[g * 6 + e] - n) return;
		let v = c[g * 3], y = c[g * 3 + 1], b = c[g * 3 + 2], x = v * c[_ * 3] + y * c[_ * 3 + 1] + b * c[_ * 3 + 2];
		if (Math.abs(x) < s) return;
		let S = x < 0;
		if (S && t[d[g]].part.material?.doubleSided !== !0 && t[d[_]].part.material?.doubleSided !== !0) return;
		let C = m(d[g], d[_]);
		for (let e = 0; e < 3; e++) {
			let t = (o[_ * 9 + e * 3] - o[g * 9]) * v + (o[_ * 9 + e * 3 + 1] - o[g * 9 + 1]) * y + (o[_ * 9 + e * 3 + 2] - o[g * 9 + 2]) * b;
			if (Math.abs(t) > C) return;
		}
		let w = g * e.count + _;
		if (f.has(w)) return;
		f.add(w);
		let T = Math.abs(v), E = Math.abs(y), D = Math.abs(b), O = 0;
		E > T && E >= D ? O = 1 : D > T && D > E && (O = 2);
		let k = (O + 1) % 3, A = (O + 2) % 3, j = ie(e, g, _, O, k, A);
		if (j < Math.max(i, 1e-4 * Math.min(u[g], u[_]))) return;
		if (a.pairs.length >= r) {
			a.truncated = !0;
			return;
		}
		let M = (ae(e, _, O, k, A, P[0], P[1]) - ae(e, g, O, k, A, P[0], P[1])) * c[g * 3 + O], N = 0;
		for (let e = 0; e < 6; e++) N = Math.max(N, Math.abs(l[g * 6 + e]), Math.abs(l[_ * 6 + e]));
		a.pairs.push({
			first: g,
			second: _,
			gap: M,
			area: j,
			opposite: S,
			flush: Math.abs(M) <= ee(N)
		});
	};
}
function se(e, t, n, r) {
	let { natives: i, guests: a } = e;
	i.length > 2 && i.sort((e, n) => t[e * 6] - t[n * 6]);
	for (let e = 0; e < i.length; e++) {
		let o = i[e], s = t[o * 6 + 3] + n;
		for (let n = e + 1; n < i.length && !(t[i[n] * 6] > s); n++) r(o, i[n]);
		for (let e = 0; e < a.length; e++) r(o, a[e]);
	}
}
function ce(e, { triangleBudget: t = a, pairBudget: n = o } = {}) {
	let { entries: r, unchecked: i } = E(T(e), t), s = D(r), c = {
		parts: r.map((e) => e.part),
		count: s.count,
		owner: s.owner,
		local: s.local,
		areas: s.areas,
		corners: s.corners,
		pairs: [],
		unchecked: i,
		truncated: !1
	};
	if (s.count < 2) return c;
	let l = [
		Infinity,
		Infinity,
		Infinity,
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let { bounds: e } of r) for (let t = 0; t < 3; t++) l[t] = Math.min(l[t], e[t]), l[3 + t] = Math.max(l[3 + t], e[3 + t]);
	let u = C(x(l)), d = oe(s, r, u, n, c);
	for (let e of te(s, k(s, u), u)) se(e, s.boxes, u, d);
	return c.pairs.sort((e, t) => e.first - t.first || e.second - t.second), c;
}
var le = [
	"positions",
	"normals",
	"uvs",
	"lightUvs",
	"colors",
	"skyVisibility",
	"surfaceMasks"
], ue = 4, de = 1e-12, fe = 8, F = /* @__PURE__ */ new WeakMap();
function I(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (e[n] !== t[n]) return !1;
	return !0;
}
function L(e) {
	let t = {
		points: e,
		minU: Infinity,
		minV: Infinity,
		maxU: -Infinity,
		maxV: -Infinity
	};
	for (let n of e) t.minU = Math.min(t.minU, n.u), t.minV = Math.min(t.minV, n.v), t.maxU = Math.max(t.maxU, n.u), t.maxV = Math.max(t.maxV, n.v);
	return t;
}
function R(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) {
		let r = e[(n + 1) % e.length];
		t += e[n].u * r.v - r.u * e[n].v;
	}
	return Math.abs(t);
}
function z(e) {
	let t = /* @__PURE__ */ new Map(), n = [], r = (t) => Math.round(t / e);
	function i(n, i) {
		let a = r(n), o = r(i);
		for (let r = -1; r <= 1; r++) for (let s = -1; s <= 1; s++) {
			let c = t.get(`${a + r},${o + s}`);
			if (c && Math.abs(c.u - n) <= e && Math.abs(c.v - i) <= e) return c;
		}
		return null;
	}
	function a(e, i, a, o = -1) {
		let s = {
			u: e,
			v: i,
			weights: a,
			vertex: o,
			position: null,
			seam: null
		};
		return t.set(`${r(e)},${r(i)}`, s), n.push(s), s;
	}
	function o(e, t, n) {
		let r = e.u + (t.u - e.u) * n, o = e.v + (t.v - e.v) * n;
		return i(r, o) ?? a(r, o, [
			0,
			1,
			2
		].map((r) => e.weights[r] + (t.weights[r] - e.weights[r]) * n));
	}
	return {
		all: n,
		add: a,
		between: o,
		tolerance: e
	};
}
function pe(e, t, n) {
	let r = [], i = [], a = t.map((e) => e > n.tolerance ? 1 : e < -n.tolerance ? -1 : 0);
	for (let o = 0; o < e.length; o++) {
		let s = (o + 1) % e.length;
		if (a[o] >= 0 && r.push(e[o]), a[o] <= 0 && i.push(e[o]), a[o] * a[s] < 0) {
			let a = n.between(e[o], e[s], t[o] / (t[o] - t[s]));
			r.at(-1) !== a && r.push(a), i.at(-1) !== a && i.push(a);
		}
	}
	return {
		inside: r,
		outside: i,
		reaches: a.includes(1)
	};
}
function me(e, t, n, r) {
	let i = t * 10 + 1;
	return [
		0,
		1,
		2
	].map((t) => ({
		u: e[i + t * 3 + n],
		v: e[i + t * 3 + r]
	}));
}
function B(e, t) {
	let [n, r] = e.u < t.u || e.u === t.u && e.v <= t.v ? [e, t] : [t, e];
	return `${n.u},${n.v},${r.u},${r.v}`;
}
function he(e, t, n, r, i) {
	let a = (e[1].u - e[0].u) * (e[2].v - e[0].v) - (e[1].v - e[0].v) * (e[2].u - e[0].u) >= 0 ? 1 : -1, o = [];
	for (let s = 0; s < 3; s++) {
		let c = e[s], l = e[(s + 1) % 3], u = Math.hypot(l.u - c.u, l.v - c.v);
		if (!(u > 0)) return null;
		let d = {
			u: c.u,
			v: c.v,
			directionU: a * (l.u - c.u) / u,
			directionV: a * (l.v - c.v) / u,
			margin: n
		};
		(t.get(B(c, l)) > 1 || r.every((e) => V(d, e) >= -i)) && (d.margin = 0), o.push(d);
	}
	return o.minU = Math.min(e[0].u, e[1].u, e[2].u), o.maxU = Math.max(e[0].u, e[1].u, e[2].u), o.minV = Math.min(e[0].v, e[1].v, e[2].v), o.maxV = Math.max(e[0].v, e[1].v, e[2].v), o;
}
function V(e, t) {
	return e.directionU * (t.v - e.v) - e.directionV * (t.u - e.u);
}
function ge(e, t, n) {
	return e.every((e) => t.every((t) => V(t, e) >= -n));
}
function _e(e, t, n, r) {
	if (e.maxU < t.minU || e.minU > t.maxU || e.maxV < t.minV || e.minV > t.maxV) return null;
	let i = e.points, a = [];
	for (let e of t) {
		let { inside: o, outside: s, reaches: c } = pe(i, i.map((t) => V(e, t) - e.margin), r);
		if (!c || o.length < 3) return null;
		s.length >= 3 && !ge(s, t, n) && a.push(L(s)), i = o;
	}
	return R(i) <= n * n ? null : a;
}
function H(e, t) {
	let { positions: n, indices: r } = e, i = [
		0,
		1,
		2
	].map((e) => r[t * 3 + e] * 3), a = [
		0,
		1,
		2
	].map((e) => n[i[1] + e] - n[i[0] + e]), o = [
		0,
		1,
		2
	].map((e) => n[i[2] + e] - n[i[0] + e]), s = [
		a[1] * o[2] - a[2] * o[1],
		a[2] * o[0] - a[0] * o[2],
		a[0] * o[1] - a[1] * o[0]
	], c = s.reduce((e, t, n) => Math.abs(t) > Math.abs(s[e]) ? n : e, 0), l = 0;
	for (let e of i) l = Math.max(l, Math.abs(n[e]), Math.abs(n[e + 1]), Math.abs(n[e + 2]));
	return {
		offsets: i,
		axisU: (c + 1) % 3,
		axisV: (c + 2) % 3,
		largest: l
	};
}
function U(e, t, n) {
	return t.offsets.map((r, i) => n.add(e.positions[r + t.axisU], e.positions[r + t.axisV], [
		0,
		1,
		2
	].map((e) => +(e === i)), r / 3));
}
function ve(e, t, n, r, i, a) {
	let o = H(e, t), s = o.largest;
	for (let e = r * 10; e < i * 10; e++) e % 10 != 0 && (s = Math.max(s, Math.abs(n[e])));
	let c = Math.max(a, S(s)), l = ue * c, u = z(c), d = U(e, o, u), f = L(d), p = R(d), m = [], h = /* @__PURE__ */ new Map();
	for (let e = r; e < i; e++) {
		let t = me(n, e, o.axisU, o.axisV);
		m.push(t);
		for (let e = 0; e < 3; e++) {
			let n = B(t[e], t[(e + 1) % 3]);
			h.set(n, (h.get(n) ?? 0) + 1);
		}
	}
	let g = [f];
	for (let e of m) {
		let t = he(e, h, l, d, c);
		if (!t) continue;
		let n = [];
		for (let e of g) {
			let r = _e(e, t, l, u);
			r ? n.push(...r) : n.push(e);
		}
		g = n;
	}
	return g.length === 1 && g[0] === f ? null : (g = g.filter((e) => R(e.points) > de * p), {
		frame: o,
		pointSet: u,
		pieces: g,
		corners: d
	});
}
function W(e, t) {
	return `${e[t]},${e[t + 1]},${e[t + 2]}`;
}
function G(e, t, n) {
	let r = t.offsets[(n + 1) % 3], i = t.offsets[(n + 2) % 3], a = W(e.positions, r), o = W(e.positions, i), s = a <= o;
	return {
		key: s ? `${a}|${o}` : `${o}|${a}`,
		forward: s,
		start: r,
		end: i
	};
}
function ye(e) {
	return e.weights.filter((e) => e === 0).length === 1 ? e.weights.indexOf(0) : -1;
}
function be(e, t, n) {
	let { positions: r } = e;
	for (let i of new Set(t.pieces.flatMap((e) => e.points))) {
		let a = ye(i);
		if (a < 0) continue;
		let o = G(e, t.frame, a), s = o.forward ? i.weights[(a + 2) % 3] : i.weights[(a + 1) % 3], [c, l] = o.forward ? [o.start, o.end] : [o.end, o.start], u = Math.hypot(r[l] - r[c], r[l + 1] - r[c + 1], r[l + 2] - r[c + 2]), d = n.get(o.key) ?? [];
		n.set(o.key, d);
		let f = d.find((e) => Math.abs(e.along - s) * u <= t.pointSet.tolerance);
		f || (f = {
			along: s,
			position: [
				0,
				1,
				2
			].map((e) => Math.fround(r[c + e] + (r[l + e] - r[c + e]) * s))
		}, d.push(f)), i.seam = f, i.position = f.position;
	}
}
function xe(e, t, n) {
	for (let r = 0; r < 3; r++) {
		let i = G(e, t.frame, r), a = n.get(i.key);
		if (!a) continue;
		let o = t.corners[(r + 1) % 3], s = t.corners[(r + 2) % 3];
		for (let e of a) {
			if (t.pointSet.all.some((t) => t.seam === e)) continue;
			let n = i.forward ? e.along : 1 - e.along, r = t.pointSet.between(o, s, n);
			r.seam || r.vertex >= 0 || (r.seam = e, r.position = e.position);
		}
	}
}
function Se(e, t) {
	let n = new Set(e.points), r = [];
	for (let i = 0; i < e.points.length; i++) {
		let a = e.points[i], o = e.points[(i + 1) % e.points.length], s = Math.hypot(o.u - a.u, o.v - a.v);
		if (r.push(a), !(s > 0)) continue;
		let c = [];
		for (let e of t.all) {
			if (n.has(e)) continue;
			let r = ((e.u - a.u) * (o.u - a.u) + (e.v - a.v) * (o.v - a.v)) / s;
			r <= t.tolerance || r >= s - t.tolerance || Math.abs((o.u - a.u) * (e.v - a.v) - (o.v - a.v) * (e.u - a.u)) / s <= t.tolerance && c.push({
				point: e,
				along: r
			});
		}
		c.sort((e, t) => e.along - t.along);
		for (let { point: e } of c) r.push(e);
	}
	return r;
}
function Ce(e, t) {
	return e.some((n, r) => {
		let i = e[(r + e.length - 1) % e.length], a = e[(r + 1) % e.length], o = Math.hypot(a.u - i.u, a.v - i.v);
		return Math.abs((a.u - i.u) * (n.v - i.v) - (a.v - i.v) * (n.u - i.u)) <= t * o;
	});
}
function we(e, t) {
	if (!Ce(e, t.tolerance)) return e.slice(1, -1).map((t, n) => [
		e[0],
		t,
		e[n + 2]
	]);
	let n = t.add(e.reduce((e, t) => e + t.u, 0) / e.length, e.reduce((e, t) => e + t.v, 0) / e.length, [
		0,
		1,
		2
	].map((t) => e.reduce((e, n) => e + n.weights[t], 0) / e.length));
	return e.map((t, r) => [
		n,
		t,
		e[(r + 1) % e.length]
	]);
}
function Te(e, t) {
	let n = e.positions.length / 3, r = {};
	for (let i of le) {
		let a = e[i];
		if (!a) continue;
		let o = a.length / n, s = new a.constructor(a.length + t.length * o);
		s.set(a), t.forEach(({ corners: e, point: t }, n) => {
			let r = a.length + n * o;
			if (i === "positions" && t.position) s.set(t.position, r);
			else for (let n = 0; n < o; n++) s[r + n] = a[e[0] * o + n] * t.weights[0] + a[e[1] * o + n] * t.weights[1] + a[e[2] * o + n] * t.weights[2];
		}), r[i] = s;
	}
	return r;
}
function Ee(e, t, n) {
	let { indices: r } = e, i = r.length / 3, a = e.positions.length / 3, o = t.length / 10, s = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), l = 0;
	for (let r = 0; r < i && l < o; r++) {
		let i = l;
		for (; l < o && t[l * 10] === r;) l++;
		if (l === i) continue;
		let a = ve(e, r, t, i, l, n);
		a && (s.set(r, a), be(e, a, c));
	}
	if (s.size === 0) return {
		geometry: e,
		sources: null
	};
	let u = [], d = [], f = [];
	for (let t = 0; t < i; t++) {
		let i = s.get(t);
		if (!i && c.size > 0) {
			let r = H(e, t);
			if ([
				0,
				1,
				2
			].some((t) => c.has(G(e, r, t).key))) {
				let t = z(Math.max(n, S(r.largest))), a = U(e, r, t);
				i = {
					frame: r,
					pointSet: t,
					pieces: [L(a)],
					corners: a
				};
			}
		}
		if (!i) {
			u.push(r[t * 3], r[t * 3 + 1], r[t * 3 + 2]), d.push(t);
			continue;
		}
		xe(e, i, c);
		let o = [
			r[t * 3],
			r[t * 3 + 1],
			r[t * 3 + 2]
		];
		for (let e of i.pieces) {
			let n = Se(e, i.pointSet);
			for (let e of we(n, i.pointSet)) {
				for (let t of e) t.vertex >= 0 || (t.vertex = a + f.length, f.push({
					corners: o,
					point: t
				}));
				u.push(e[0].vertex, e[1].vertex, e[2].vertex), d.push(t);
			}
		}
	}
	return {
		geometry: {
			...e,
			...Te(e, f),
			indices: new Uint32Array(u)
		},
		sources: new Uint32Array(d)
	};
}
function De(e, t, n = 0) {
	if (t.length === 0) return {
		geometry: e,
		sources: null
	};
	let r = F.get(e) ?? [];
	F.set(e, r);
	let i = r.find((e) => I(e.cuts, t));
	return i || (i = {
		cuts: t,
		clipped: Ee(e, t, n)
	}, r.push(i), r.length > fe && r.shift()), i.clipped;
}
// src/flush-resolve.js
var Oe = .001, ke = 8, Ae = .001, je = .001, Me = .01;
function Ne(e) {
	let t = Ae * Math.sqrt(e);
	return Math.min(Me, Math.max(je, t));
}
var Pe = /* @__PURE__ */ new WeakMap();
function Fe(e, t) {
	return e.flush ? t[e.first] === t[e.second] ? e.second : t[e.first] < t[e.second] ? e.first : e.second : e.gap > 0 ? e.second : e.first;
}
function K(e, t, n) {
	let r = !1;
	for (let i = 0; i < t.length; i += 2) {
		let a = t[i + 1], o = e[t[i]] + 1;
		o <= e[a] || (o > 15 ? n && (n[a] = 1) : (e[a] = o, r = !0));
	}
	return r;
}
function Ie(e, t, n) {
	let r = new Uint8Array(e), i = new Uint8Array(e);
	for (let e = 0; e <= 16 && K(r, t, i); e++);
	for (let e = 0; e <= 16; e++) {
		let e = K(r, n, null), i = K(r, t, null);
		if (!e && !i) break;
	}
	return {
		ranks: r,
		overflow: i
	};
}
function Le(e, t, n) {
	return e.opposite || e.area < 1e-4 || !e.flush && !(Math.abs(e.gap) <= Ne(e.area)) || (t.material?.alphaMode ?? "opaque") !== "opaque" ? !1 : n.material?.doubleSided !== !0 || t.material?.doubleSided === !0;
}
function q(e, t) {
	return Math.hypot(e[t], e[t + 1], e[t + 2]);
}
function Re(e) {
	return S(y(e).reduce((e, t) => Math.max(e, Math.abs(t)), 0)) / Math.min(q(e.matrix, 0), q(e.matrix, 4), q(e.matrix, 8));
}
function ze(e, t, n) {
	let i = e.parts[t], { positions: a, indices: o } = i.geometry, s = r(i.matrix);
	if (!s) return null;
	n.sort((t, n) => e.local[t.back] - e.local[n.back] || t.front - n.front);
	let c = new Float64Array(n.length * 10);
	return n.forEach(({ back: n, front: r }, i) => {
		let l = i * 10;
		c[l] = e.local[n];
		for (let n = 0; n < 3; n++) {
			let i = l + 1 + n * 3;
			if (e.owner[r] === t) {
				let t = o[e.local[r] * 3 + n] * 3;
				c.set(a.subarray(t, t + 3), i);
				continue;
			}
			let u = e.corners[r * 9 + n * 3], d = e.corners[r * 9 + n * 3 + 1], f = e.corners[r * 9 + n * 3 + 2];
			c[i] = s[0] * u + s[4] * d + s[8] * f + s[12], c[i + 1] = s[1] * u + s[5] * d + s[9] * f + s[13], c[i + 2] = s[2] * u + s[6] * d + s[10] * f + s[14];
		}
	}), c;
}
function Be(e, t, n, r, i) {
	let a = e.parts[t], o = {
		geometry: a.geometry,
		sources: null
	};
	if (n.length === 0) return o;
	let s = ze(e, t, n), c = s ? De(a.geometry, s, Re(a)) : o;
	if (!s || c.geometry.indices.length === 0) {
		for (let { back: e, front: t } of n) r.push(e, t);
		return o;
	}
	if (!c.sources) return c;
	let l = new Uint8Array(a.geometry.indices.length / 3);
	for (let e of c.sources) l[e] = 1;
	for (let { back: t, front: r } of n) l[e.local[t]] && i.push(t, r);
	return c;
}
function Ve({ geometry: e, sources: t }, n) {
	if (!t && !n) return null;
	let r = n;
	t && (r = n ? Uint8Array.from(t, (e) => n[e]) : new Uint8Array(t.length));
	let i = Pe.get(e) ?? [];
	Pe.set(e, i);
	let a = i.find((e) => I(e.triangleRanks, r));
	return a || (a = He(e.indices, r), t && (a.geometry = {
		...e,
		indices: a.indices
	}), i.push(a), i.length > ke && i.shift()), a;
}
function He(e, t) {
	let n = /* @__PURE__ */ new Uint32Array(16);
	for (let e of t) n[e]++;
	let r = /* @__PURE__ */ new Uint32Array(16), i = [], a = 0;
	for (let e = 0; e <= 15; e++) r[e] = a, n[e] > 0 && i.push({
		start: a * 3,
		count: n[e] * 3,
		rank: e
	}), a += n[e];
	let o = new Uint32Array(e.length);
	for (let n = 0; n < t.length; n++) {
		let i = r[t[n]]++ * 3;
		o[i] = e[n * 3], o[i + 1] = e[n * 3 + 1], o[i + 2] = e[n * 3 + 2];
	}
	return {
		indices: o,
		ranges: i,
		triangleRanks: t
	};
}
function Ue(e) {
	let t = [
		0,
		4,
		8
	].map((t) => Math.hypot(e[t], e[t + 1], e[t + 2]));
	return Math.min(...t) < Oe * Math.max(...t);
}
function We(e, r) {
	let i = ce(e, r), { owner: a, local: o, areas: s, pairs: c, count: l } = i, u = /* @__PURE__ */ new Map(), d = (e, t, n = 1) => {
		let r = `${e}\n${t.name}`, i = u.get(r) ?? {
			reason: e,
			part: t.name,
			triangles: 0
		};
		i.triangles += n, u.set(r, i);
	}, f = [], p = [], m = i.parts.map(() => []);
	for (let e of c) {
		let t = i.parts[a[e.first]], r = i.parts[a[e.second]];
		if (n(t) !== n(r)) continue;
		if (e.opposite && !e.flush) {
			d("double-sided-gap", r);
			continue;
		}
		let o = Fe(e, s), c = o === e.first ? e.second : e.first;
		Le(e, i.parts[a[o]], i.parts[a[c]]) ? m[a[c]].push({
			back: c,
			front: o
		}) : f.push(c, o);
	}
	let h = i.parts.map((e, t) => Be(i, t, m[t], f, p)), { ranks: g, overflow: _ } = Ie(l, f, p), v = i.parts.map(() => null);
	for (let e = 0; e < l; e++) _[e] && d("rank-overflow", i.parts[a[e]]), g[e] !== 0 && (v[a[e]] ??= new Uint8Array(i.parts[a[e]].geometry.indices.length / 3), v[a[e]][o[e]] = g[e]);
	let y = new Map(i.parts.map((e, t) => [e, t])), b = 0;
	for (let n of e) {
		let e = y.get(n), r = e === void 0 ? null : Ve(h[e], v[e]);
		t(n, r), r && b++;
	}
	for (let e of i.unchecked) d("unchecked", e, e.geometry.indices.length / 3);
	i.truncated && d("unchecked", { name: "scene" }, 0);
	for (let t of e) t.matrix && t.geometry?.indices?.length && Ue(t.matrix) && d("collapsed-node", t, t.geometry.indices.length / 3);
	return {
		ranked: b,
		leftovers: [...u.values()]
	};
}
// src/coplanar-overlap.js
var Ge = .001, Ke = 1e-4, qe = .002, Je = 1e6, Ye = 6e5, J = 12, Xe = 3e6, Ze = Math.cos(Math.PI / 180), Y = 8, X = 100, Qe = 201, $e = 2 ** 27;
function et(e, t, n, r, i, a, o) {
	let s = Math.abs(e), c = Math.abs(t), l = Math.abs(n), u = e;
	c > s && c >= l ? u = t : l > s && l > c && (u = n);
	let d = u < 0 ? -1 : 1, f = Math.round(e * d * X) + X, p = Math.round(t * d * X) + X, m = Math.round(n * d * X) + X, h = (r * e + i * t + a * n) * d, g = Math.floor(h / (2 * o));
	return ((f * Qe + p) * Qe + m) * $e + g + $e / 2;
}
var tt = /* @__PURE__ */ new Float64Array(9);
function nt(e, t) {
	let { positions: n, indices: r } = e.geometry, i = e.matrix, a = b(i), o = tt;
	for (let e = 0; e < r.length; e += 3) {
		for (let t = 0; t < 3; t++) {
			let a = r[e + t] * 3, s = n[a], c = n[a + 1], l = n[a + 2];
			o[t * 3] = i[0] * s + i[4] * c + i[8] * l + i[12], o[t * 3 + 1] = i[1] * s + i[5] * c + i[9] * l + i[13], o[t * 3 + 2] = i[2] * s + i[6] * c + i[10] * l + i[14];
		}
		let s = o[3] - o[0], c = o[4] - o[1], l = o[5] - o[2], u = o[6] - o[0], d = o[7] - o[1], f = o[8] - o[2], p = c * f - l * d, m = l * u - s * f, h = s * d - c * u, g = Math.hypot(p, m, h);
		if (!(g > 1e-12)) continue;
		let _ = a / g;
		t(o, p * _, m * _, h * _);
	}
}
function rt(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	return nt(e, (e, i, a, o) => {
		for (let r = 0; r < 3; r++) {
			let i = Math.min(e[r], e[3 + r], e[6 + r]);
			if (Math.max(e[r], e[3 + r], e[6 + r]) < n[r] - t || i > n[3 + r] + t) return;
		}
		r.add(et(i, a, o, e[0], e[1], e[2], t));
	}), r;
}
function it(e, t) {
	let n = /* @__PURE__ */ new Map();
	nt(e, (e, r, i, a) => {
		let o = et(r, i, a, e[0], e[1], e[2], t), s = [
			Math.min(e[0], e[3], e[6]),
			Math.min(e[1], e[4], e[7]),
			Math.min(e[2], e[5], e[8]),
			Math.max(e[0], e[3], e[6]),
			Math.max(e[1], e[4], e[7]),
			Math.max(e[2], e[5], e[8])
		], c = {
			corners: Float64Array.from(e),
			normal: [
				r,
				i,
				a
			],
			box: s
		}, l = n.get(o);
		l ? l.triangles.push(c) : n.set(o, {
			triangles: [c],
			widest: 0
		});
	});
	for (let e of n.values()) {
		e.triangles.sort((e, t) => e.box[0] - t.box[0]);
		for (let { box: t } of e.triangles) e.widest = Math.max(e.widest, t[3] - t[0]);
	}
	return n;
}
function at(e, t, n) {
	let { triangles: r, widest: i } = e, a = 0, o = r.length, s = t[0] - n - i;
	for (; a < o;) {
		let e = a + o >> 1;
		r[e].box[0] < s ? a = e + 1 : o = e;
	}
	let c = [];
	for (let e = a; e < r.length; e++) {
		let { box: i } = r[e];
		if (i[0] > t[3] + n) break;
		i[3] < t[0] - n || i[4] < t[1] - n || i[1] > t[4] + n || i[5] < t[2] - n || i[2] > t[5] + n || c.push(r[e]);
	}
	return c;
}
function ot(e, t, n) {
	let r = e.normal;
	return (t.corners[n * 3] - e.corners[0]) * r[0] + (t.corners[n * 3 + 1] - e.corners[1]) * r[1] + (t.corners[n * 3 + 2] - e.corners[2]) * r[2];
}
function st(e, t) {
	let n = e.normal.map(Math.abs), r = n.indexOf(Math.max(...n)), i = [
		0,
		1,
		2
	].filter((e) => e !== r), a = (e, t) => [e.corners[t * 3 + i[0]], e.corners[t * 3 + i[1]]], o = [
		0,
		1,
		2
	].map((e) => a(t, e)), s = [
		0,
		1,
		2
	].map((t) => a(e, t)), c = ct(s) >= 0 ? 1 : -1;
	for (let e = 0; e < 3 && o.length > 0; e++) {
		let t = s[e], n = s[(e + 1) % 3], r = (e) => c * ((n[0] - t[0]) * (e[1] - t[1]) - (n[1] - t[1]) * (e[0] - t[0])), i = [];
		for (let e = 0; e < o.length; e++) {
			let t = o[e], n = o[(e + o.length - 1) % o.length], a = r(t), s = r(n);
			if (a >= 0 != s >= 0) {
				let e = s / (s - a);
				i.push([n[0] + (t[0] - n[0]) * e, n[1] + (t[1] - n[1]) * e]);
			}
			a >= 0 && i.push(t);
		}
		o = i;
	}
	return o.length < 3 ? 0 : Math.abs(ct(o)) / Math.max(n[r], 1e-12);
}
function ct(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) {
		let r = e[(n + 1) % e.length];
		t += e[n][0] * r[1] - r[0] * e[n][1];
	}
	return t / 2;
}
function lt(e, t, n) {
	let r = [
		0,
		0,
		0,
		0,
		0,
		0
	];
	for (let i = 0; i < 3; i++) if (r[i] = Math.max(e[i], t[i]), r[3 + i] = Math.min(e[3 + i], t[3 + i]), r[i] > r[3 + i] + n) return null;
	return r;
}
function ut(t, r) {
	return n(t) !== n(r) || !!(e(t) || e(r));
}
function dt(e, t, n) {
	for (let r = 0; r < 3; r++) {
		let i = Math.min(e.corners[r], e.corners[3 + r], e.corners[6 + r]), a = Math.max(e.corners[r], e.corners[3 + r], e.corners[6 + r]), o = Math.min(t.corners[r], t.corners[3 + r], t.corners[6 + r]), s = Math.max(t.corners[r], t.corners[3 + r], t.corners[6 + r]);
		if (a < o - n || s < i - n) return !1;
	}
	return !0;
}
function ft(e, t, n, r, i) {
	let a = e.part.material?.doubleSided === !0 || t.part.material?.doubleSided === !0;
	e.planes ??= it(e.part, r), t.planes ??= it(t.part, r);
	let o = 0, s = 0, c = null, l = 0;
	for (let [u, d] of e.planes) for (let e of [
		u - 1,
		u,
		u + 1
	]) {
		let u = t.planes.get(e);
		if (!u) continue;
		i.work += Math.log2(d.triangles.length + u.triangles.length + 2) / 4;
		let f = at(d, n, r), p = at(u, n, r);
		for (let e of f) {
			if (i.work > i.limit) break;
			for (let t of p) {
				if (i.work += 1 / 64, !dt(e, t, r)) continue;
				i.work++;
				let n = e.normal[0] * t.normal[0] + e.normal[1] * t.normal[1] + e.normal[2] * t.normal[2];
				if (!(n >= Ze || a && n <= -Ze)) continue;
				let u = 0;
				for (let n = 0; n < 3; n++) u = Math.max(u, Math.abs(ot(e, t, n)));
				if (u > r) continue;
				let d = st(e, t);
				d <= 0 || (o += d, s = Math.max(s, u), d > l && (l = d, c = e.normal));
			}
		}
	}
	return o >= 1e-4 ? {
		area: o,
		distance: s,
		normal: c
	} : null;
}
function pt(e, t) {
	let n = [...e].sort((e, t) => e.bounds[0] - t.bounds[0]);
	for (let e = 0; e < n.length; e++) {
		let r = n[e];
		for (let i = e + 1; i < n.length; i++) {
			let e = n[i];
			if (e.bounds[0] > r.bounds[3] + t) break;
			let a = lt(r.bounds, e.bounds, t);
			if (a) for (let t of [r, e]) {
				t.region ||= a.slice();
				for (let e = 0; e < 3; e++) t.region[e] = Math.min(t.region[e], a[e]), t.region[3 + e] = Math.max(t.region[3 + e], a[3 + e]);
			}
		}
	}
}
function mt(e, t, n, r) {
	let i = /* @__PURE__ */ new Map();
	pt(e, t), e.forEach((e, t) => {
		e.index = t;
	});
	let a = e.filter((e) => e.region).sort((e, t) => e.part.geometry.indices.length - t.part.geometry.indices.length);
	for (let e of a) {
		if (n.triangles <= 0) {
			n.exhausted = !0;
			break;
		}
		n.triangles -= e.part.geometry.indices.length / 3;
		for (let n of rt(e.part, t, e.region)) {
			let t = i.get(n);
			t ? t.push(e) : i.set(n, [e]);
		}
	}
	let o = /* @__PURE__ */ new Set();
	for (let [n, a] of i) {
		let s = i.get(n + 1) ?? [];
		if (a.length + s.length < 2) continue;
		let c = [...a.map((e) => ({
			entry: e,
			own: !0
		})), ...s.map((e) => ({
			entry: e,
			own: !1
		}))];
		c.sort((e, t) => e.entry.bounds[0] - t.entry.bounds[0]);
		for (let n = 0; n < c.length; n++) {
			let i = c[n];
			for (let a = n + 1; a < c.length; a++) {
				let n = c[a];
				if (n.entry.bounds[0] > i.entry.bounds[3] + t) break;
				if (!i.own && !n.own || i.entry === n.entry || n.entry.bounds[1] > i.entry.bounds[4] + t || i.entry.bounds[1] > n.entry.bounds[4] + t || n.entry.bounds[2] > i.entry.bounds[5] + t || i.entry.bounds[2] > n.entry.bounds[5] + t) continue;
				let s = Math.min(i.entry.index, n.entry.index), l = Math.max(i.entry.index, n.entry.index), u = s * e.length + l;
				o.has(u) || (o.add(u), r(i.entry, n.entry));
			}
		}
	}
}
function Z(e, { tolerance: t = Ge, workBudget: n = Je, triangleBudget: r = Ye } = {}) {
	let i = [], a = /* @__PURE__ */ new Map();
	for (let t of e) {
		if (t.skin || t.morph || !t.geometry?.indices?.length) continue;
		let e = a.get(t.geometry) ?? /* @__PURE__ */ new Map();
		a.set(t.geometry, e);
		let n = y(t);
		if (!n.every(Number.isFinite)) continue;
		let r = Array.prototype.join.call(t.matrix, ","), o = e.get(r) ?? 0;
		o >= 2 || (e.set(r, o + 1), i.push({
			part: t,
			bounds: n
		}));
	}
	let o = {
		work: 0,
		limit: n
	}, s = {
		triangles: r,
		exhausted: !1
	}, c = [];
	if (i.length < 2) return {
		overlaps: c,
		truncated: !1,
		work: 0
	};
	let l = Array.from({ length: J }, () => []), u = 0;
	mt(i, t, s, (e, n) => {
		let r = lt(e.bounds, n.bounds, t);
		if (!r || ut(e.part, n.part) || u >= Xe) return;
		let i = [
			r[3] - r[0],
			r[4] - r[1],
			r[5] - r[2]
		].sort((e, t) => e - t), a = Math.min(i[1] * i[2] || 0, Number.MAX_VALUE), o = i[0] <= t ? J / 2 : 0, s = Math.max(0, Math.min(J / 2 - 1, Math.floor(Math.log10(Math.max(a, 1e-6)) + 6)));
		l[11 - (o + s)].push(e, n, r), u++;
	});
	for (let e of l) for (let n = 0; n < e.length && o.work <= o.limit; n += 3) {
		let r = e[n], i = e[n + 1], a = ft(r, i, e[n + 2], t, o);
		if (!a) continue;
		let s = x(r.bounds) >= x(i.bounds);
		c.push({
			smaller: (s ? i : r).part,
			larger: (s ? r : i).part,
			...a
		});
	}
	let d = o.work > n || s.exhausted;
	return c.sort((e, t) => t.area - e.area || String(e.smaller.name).localeCompare(String(t.smaller.name))), {
		overlaps: c,
		truncated: d,
		work: o.work
	};
}
function Q(e) {
	return `${Math.round(e * 1e3) / 1e3}`;
}
function ht({ overlaps: e, truncated: t }) {
	let n = e.slice(0, Y).map(({ smaller: e, larger: t, area: n, distance: r, normal: i }) => ({
		kind: "coplanar-overlap",
		severity: "warning",
		target: e.name,
		parts: [e.name, t.name],
		area: Math.round(n * 1e4) / 1e4,
		message: `${e.name} and ${t.name} draw the same plane (${Q(r * 1e3)} mm apart, ${Q(n)} m2 overlap) and will flicker (z-fighting).`,
		fix: `Move ${e.name} ${Q(qe * 1e3)} mm along its normal [${i.map((e) => Math.round(e * 1e3) / 1e3).join(", ")}], or set decal: true on ${e.name}, or drop resolveCoplanar: false from the environment so the faces are ranked at draw time without moving.`
	}));
	return (e.length > Y || t && e.length) && n.push({
		kind: "coplanar-overlap",
		severity: "warning",
		target: "scene",
		message: t ? `${e.length} coplanar pairs found before the check hit its work budget; more may exist.` : `${e.length - Y} more coplanar pairs.`,
		fix: "Drop resolveCoplanar: false from the environment so every flush face is ranked at draw time."
	}), n;
}
function gt(e, t = null) {
	let n = null, r = null;
	return e.coplanarDiagnostics = (e) => {
		if (e !== n) {
			n = e;
			let i = Z(e.flatMap((e) => e.parts));
			r = ht(i), t?.(i.overlaps);
		}
		return r;
	}, e;
}
function _t(e, t) {
	return We(e, t);
}
function vt(e) {
	for (let n of e) t(n, null);
}
var $ = {
	"rank-overflow": {
		message: (e, t) => `${e}: ${t} triangles sit in stacks deeper than 15 near-coplanar faces and may flicker far away.`,
		fix: "Remove the duplicate faces in the asset."
	},
	"double-sided-gap": {
		message: (e, t) => `${e}: ${t} pairs of double-sided faces lie a small gap apart, facing opposite ways, and may flicker far away.`,
		fix: "Make the material single sided, or move the faces farther apart."
	},
	unchecked: {
		message: (e) => `${e} was not checked for flush faces: the scene is past the search budget.`,
		fix: "Split the scene, or set decal: true on the parts that lie flush on others."
	},
	"collapsed-node": {
		message: (e) => `${e} has an axis scaled to nothing, so its faces fold onto one plane and flicker.`,
		fix: "Hide the node instead of scaling it to zero."
	}
};
function yt(e) {
	return [...e].sort((e, t) => t.triangles - e.triangles).slice(0, Y).map(({ reason: e, part: t, triangles: n }) => ({
		kind: "coplanar-overlap",
		severity: "warning",
		target: t,
		reason: e,
		message: $[e].message(t, n),
		fix: $[e].fix
	}));
}
export { ht as a, gt as c, vt as i, _t as l, Ge as n, Z as o, qe as r, yt as s, Ke as t };
