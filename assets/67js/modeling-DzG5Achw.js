/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { n as e, t } from "./surface-nets-Dwxp306C.js";
// src/modeling-curve.js
var n = 200, r = 1e-4;
function i(e, t) {
	return [
		e[0] - t[0],
		e[1] - t[1],
		e[2] - t[2]
	];
}
function a(e, t) {
	return [
		e[0] + t[0],
		e[1] + t[1],
		e[2] + t[2]
	];
}
function o(e, t) {
	return [
		e[1] * t[2] - e[2] * t[1],
		e[2] * t[0] - e[0] * t[2],
		e[0] * t[1] - e[1] * t[0]
	];
}
function s(e, t) {
	return e[0] * t[0] + e[1] * t[1] + e[2] * t[2];
}
function c(e) {
	return Math.sqrt(s(e, e));
}
function l(e) {
	let t = 1 / (c(e) || 1);
	return [
		e[0] * t,
		e[1] * t,
		e[2] * t
	];
}
function u(e, t, n) {
	let r = Math.cos(n), i = Math.sin(n), a = 1 - r, [o, s, c] = t, l = a * o, u = a * s;
	return [
		(l * o + r) * e[0] + (l * s - i * c) * e[1] + (l * c + i * s) * e[2],
		(l * s + i * c) * e[0] + (u * s + r) * e[1] + (u * c - i * o) * e[2],
		(l * c - i * s) * e[0] + (u * c + i * o) * e[1] + (a * c * c + r) * e[2]
	];
}
function d(e, t) {
	let n = i(e, t);
	return s(n, n);
}
function f(e, t, n, r, i, a, o) {
	let s = (t - e) / i - (n - e) / (i + a) + (n - t) / a, c = (n - t) / a - (r - t) / (a + o) + (r - n) / o;
	return s *= a, c *= a, [
		t,
		s,
		-3 * t + 3 * n - 2 * s - c,
		2 * t - 2 * n + s + c
	];
}
function p(e, t) {
	let o = e.length, s = (n) => {
		let r = (o - +!t) * n, s = Math.floor(r), c = r - s;
		t ? s += s > 0 ? 0 : (Math.floor(Math.abs(s) / o) + 1) * o : c === 0 && s === o - 1 && (s = o - 2, c = 1);
		let l = t || s > 0 ? e[(s - 1) % o] : a(i(e[0], e[1]), e[0]), u = e[s % o], p = e[(s + 1) % o], m = t || s + 2 < o ? e[(s + 2) % o] : a(i(e[o - 1], e[o - 2]), e[o - 1]), h = d(l, u) ** .25, g = d(u, p) ** .25, _ = d(p, m) ** .25;
		g < 1e-4 && (g = 1), h < 1e-4 && (h = g), _ < 1e-4 && (_ = g);
		let v = c * c, y = v * c;
		return [
			0,
			1,
			2
		].map((e) => {
			let [t, n, r, i] = f(l[e], u[e], p[e], m[e], h, g, _);
			return t + n * c + r * v + i * y;
		});
	}, u = [0], p = s(0), m = 0;
	for (let e = 1; e <= n; e++) {
		let t = s(e / n);
		m += c(i(t, p)), u.push(m), p = t;
	}
	let h = (e) => {
		let t = e * u[n], r = 0, i = n;
		for (; r <= i;) {
			let e = Math.floor(r + (i - r) / 2), n = u[e] - t;
			if (n < 0) r = e + 1;
			else if (n > 0) i = e - 1;
			else {
				i = e;
				break;
			}
		}
		if (u[i] === t) return i / n;
		let a = u[i + 1] - u[i];
		return (i + (t - u[i]) / a) / n;
	};
	return {
		pointAtFraction: (e) => s(h(e)),
		tangentAt: (e) => {
			let t = h(e), n = s(Math.max(t - r, 0));
			return l(i(s(Math.min(t + r, 1)), n));
		}
	};
}
function m(e) {
	let t = e.map(Math.abs), n = 0;
	t[1] <= t[n] && (n = 1), t[2] <= t[n] && (n = 2);
	let r = [
		0,
		0,
		0
	];
	return r[n] = 1, o(e, l(o(e, r)));
}
function h(e, t) {
	let n = e.length - 1, r = [m(e[0])];
	for (let t = 1; t <= n; t++) {
		let n = r[t - 1], i = o(e[t - 1], e[t]);
		if (c(i) > 2 ** -52) {
			let r = Math.acos(Math.min(Math.max(s(e[t - 1], e[t]), -1), 1));
			n = u(n, l(i), r);
		}
		r.push(n);
	}
	if (t) {
		let t = Math.acos(Math.min(Math.max(s(r[0], r[n]), -1), 1));
		t /= n, s(e[0], o(r[0], r[n])) > 0 && (t = -t);
		for (let i = 1; i <= n; i++) r[i] = u(r[i], e[i], t * i);
	}
	return r.map((t, n) => ({
		normal: t,
		binormal: o(e[n], t)
	}));
}
function g(e, t, n) {
	let r = p(e, t), i = h(Array.from({ length: n + 1 }, (e, t) => r.tangentAt(t / n)), t);
	return i.map((e, a) => {
		let o = t && a === n ? 0 : a;
		return {
			point: r.pointAtFraction(o / n),
			...i[o]
		};
	});
}
// src/triangulate.js
function _(e, t, n) {
	return (t[0] - e[0]) * (n[1] - e[1]) - (t[1] - e[1]) * (n[0] - e[0]);
}
function v(e) {
	let t = 0;
	for (let n = 0, r = e.length - 1; n < e.length; r = n++) t += e[r][0] * e[n][1] - e[n][0] * e[r][1];
	return t / 2;
}
function y(e, t) {
	return e[0] === t[0] && e[1] === t[1];
}
function ee(e, t, n, r) {
	let i = _(e, t, n), a = _(e, t, r), o = _(n, r, e), s = _(n, r, t);
	if (Math.sign(i) * Math.sign(a) < 0 && Math.sign(o) * Math.sign(s) < 0) return !0;
	let c = (e, t, n) => n[0] >= Math.min(e[0], t[0]) && n[0] <= Math.max(e[0], t[0]) && n[1] >= Math.min(e[1], t[1]) && n[1] <= Math.max(e[1], t[1]);
	return i === 0 && c(e, t, n) || a === 0 && c(e, t, r) || o === 0 && c(n, r, e) || s === 0 && c(n, r, t);
}
function b(e, t, n, r) {
	return _(e, t, n) > 0 ? _(t, n, r) > 0 && _(t, r, e) > 0 : !(_(t, e, r) > 0 && _(t, r, n) > 0);
}
function te(e, t, n, r, i, a) {
	for (let o of t) for (let t = 0; t < o.length; t++) {
		let s = o[t], c = o[(t + 1) % o.length];
		if (s !== i && c !== i && s !== a && c !== a && ee(e[n], e[r], e[s], e[c])) return !0;
	}
	return !1;
}
function x(e, t, n, r) {
	let i = 0;
	for (let t = 1; t < r.length; t++) e[r[t]][0] > e[r[i]][0] && (i = t);
	let a = r[i], o = r[(i + r.length - 1) % r.length], s = r[(i + 1) % r.length], c = [...new Set(n)].map((t) => ({
		vertex: t,
		distance: Math.hypot(e[t][0] - e[a][0], e[t][1] - e[a][1])
	})).sort((e, t) => e.distance - t.distance);
	for (let { vertex: l } of c) if (b(e[o], e[a], e[s], e[l]) && !te(e, t, a, l, a, l)) for (let t = 0; t < n.length; t++) {
		if (n[t] !== l) continue;
		let o = e[n[(t + n.length - 1) % n.length]], s = e[n[(t + 1) % n.length]];
		if (!b(o, e[l], s, e[a])) continue;
		let c = r.map((e, t) => r[(i + t) % r.length]);
		n.splice(t + 1, 0, ...c, a, l);
		return;
	}
	throw RangeError("Triangulation could not connect a hole to the contour. Adjust the holes.");
}
function S(e, t, n) {
	let r = [t, ...n], i = [...t], a = n.map((e) => e.slice()).sort((t, n) => {
		let r = (t) => Math.max(...t.map((t) => e[t][0]));
		return r(n) - r(t);
	});
	for (let t of a) x(e, r, i, t);
	return i;
}
function C(e, t) {
	let n = t.length, r = Array.from({ length: n }, (e, t) => (t + n - 1) % n), i = Array.from({ length: n }, (e, t) => (t + 1) % n), a = [], o = (n) => e[t[n]], s = (e, t) => [
		r[t],
		t,
		i[t]
	].some((t) => y(o(e), o(t))), c = (e) => {
		let t = o(r[e]), n = o(e), a = o(i[e]);
		for (let c = i[i[e]]; c !== r[e]; c = i[c]) {
			if (s(c, e) || _(o(r[c]), o(c), o(i[c])) > 0) continue;
			let l = o(c);
			if (_(t, n, l) >= 0 && _(n, a, l) >= 0 && _(a, t, l) >= 0) return !0;
		}
		return !1;
	}, l = (e) => (i[r[e]] = i[e], r[i[e]] = r[e], r[e]), u = (e) => a.push([
		t[r[e]],
		t[e],
		t[i[e]]
	]), d = n, f = 0, p = 0;
	for (; d > 3;) {
		let e = _(o(r[f]), o(f), o(i[f])), t = p > d;
		if (e === 0) f = l(f), d--, p = 0;
		else if (e > 0 && (t || !c(f))) u(f), f = l(f), d--, p = 0;
		else if (f = i[f], p++, p > d * 2) throw RangeError("Triangulation failed. The contour or holes may touch or cross.");
	}
	return _(o(r[f]), o(f), o(i[f])) > 0 && u(f), a;
}
function ne(e, t) {
	let n = [...e, ...t.flat()], r = e.map((e, t) => t);
	v(e) < 0 && r.reverse();
	let i = e.length;
	return C(n, S(n, r, t.map((e) => {
		let t = e.map((e, t) => i + t);
		return i += e.length, v(e) > 0 && t.reverse(), t;
	})));
}
// src/modeling-shapes.js
var w = 1e-10;
function T(e, t, n) {
	let r = 1 / (Math.sqrt(e * e + t * t + n * n) || 1);
	return [
		e * r,
		t * r,
		n * r
	];
}
function E(e, t, n, r) {
	let i = [], a = [0, 0];
	for (let t = 0; t < e.length; t++) {
		if (t === e.length - 1) {
			i.push([a[0], a[1]]);
			break;
		}
		let n = [e[t + 1][1] - e[t][1], -(e[t + 1][0] - e[t][0])], r = t === 0 ? n : [n[0] + a[0], n[1] + a[1]], [o, s] = T(r[0], r[1], 0);
		i.push([o, s]), a = n;
	}
	let o = [], s = [], c = [];
	for (let a = 0; a <= t; a++) {
		let l = n + 1 / t * a * r, u = Math.sin(l), d = Math.cos(l);
		for (let n = 0; n < e.length; n++) o.push(e[n][0] * u, e[n][1], e[n][0] * d), c.push(a / t, n / (e.length - 1)), s.push(i[n][0] * u, i[n][1], i[n][0] * d);
	}
	let l = [];
	for (let n = 0; n < t; n++) for (let t = 0; t < e.length - 1; t++) {
		let r = t + n * e.length, i = r + e.length;
		l.push(r, i, r + 1, i + 1, r + 1, i);
	}
	return {
		positions: Float32Array.from(o),
		normals: Float32Array.from(s),
		uvs: Float32Array.from(c),
		indices: Uint32Array.from(l)
	};
}
function re(e, t, n, r, i) {
	let a = g(e, t, r), o = [], s = [], c = [];
	for (let { point: e, normal: t, binormal: r } of a) for (let a = 0; a <= i; a++) {
		let c = a / i * Math.PI * 2, l = Math.sin(c), u = -Math.cos(c), d = T(u * t[0] + l * r[0], u * t[1] + l * r[1], u * t[2] + l * r[2]);
		s.push(...d), o.push(e[0] + n * d[0], e[1] + n * d[1], e[2] + n * d[2]);
	}
	for (let e = 0; e <= r; e++) for (let t = 0; t <= i; t++) c.push(e / r, t / i);
	let l = [];
	for (let e = 1; e <= r; e++) for (let t = 1; t <= i; t++) {
		let n = (i + 1) * (e - 1) + (t - 1), r = (i + 1) * e + (t - 1), a = (i + 1) * e + t, o = (i + 1) * (e - 1) + t;
		l.push(n, r, o, r, a, o);
	}
	return {
		positions: Float32Array.from(o),
		normals: Float32Array.from(s),
		uvs: Float32Array.from(c),
		indices: Uint32Array.from(l)
	};
}
function ie(e) {
	let t = e[0];
	for (let n = 1; n <= e.length; n++) {
		let r = n % e.length, i = e[r], a = i[0] - t[0], o = i[1] - t[1], s = Math.max(Math.abs(i[0]), Math.abs(i[1]), Math.abs(t[0]), Math.abs(t[1]));
		a * a + o * o <= w * w * s * s ? (e.splice(r, 1), n--) : t = i;
	}
}
function ae(e, t, n) {
	let r = e[0] - t[0], i = e[1] - t[1], a = n[0] - e[0], o = n[1] - e[1], s = r * r + i * i, c = r * o - i * a, l, u, d;
	if (Math.abs(c) > 2 ** -52) {
		let c = Math.sqrt(s), f = Math.sqrt(a * a + o * o), p = t[0] - i / c, m = t[1] + r / c, h = n[0] - o / f, g = n[1] + a / f, _ = ((h - p) * o - (g - m) * a) / (r * o - i * a);
		l = p + r * _ - e[0], u = m + i * _ - e[1];
		let v = l * l + u * u;
		if (v <= 2) return [l, u];
		d = Math.sqrt(v / 2);
	} else {
		let e = !1;
		e = r > 2 ** -52 ? a > 2 ** -52 : r < -(2 ** -52) ? a < -(2 ** -52) : Math.sign(i) === Math.sign(o), e ? (l = -i, u = r, d = Math.sqrt(s)) : (l = r, u = i, d = Math.sqrt(s / 2));
	}
	return [l / d, u / d];
}
function oe(e) {
	return e.map((t, n) => ae(t, e[(n + e.length - 1) % e.length], e[(n + 1) % e.length]));
}
function se(e) {
	let t = new Float32Array(e.length);
	for (let n = 0; n < e.length; n += 9) {
		let r = e[n] - e[n + 3], i = e[n + 1] - e[n + 4], a = e[n + 2] - e[n + 5], o = e[n + 6] - e[n + 3], s = e[n + 7] - e[n + 4], c = e[n + 8] - e[n + 5], l = Float32Array.from([
			s * a - c * i,
			c * r - o * a,
			o * i - s * r
		]), u = Float32Array.from(T(l[0], l[1], l[2]));
		for (let e = 0; e < 3; e++) t.set(u, n + e * 3);
	}
	return t;
}
function ce(e, t, { depth: n, steps: r, bevel: i, bevelThickness: a, bevelSegments: o }) {
	let s = i > 0 || a > 0, c = s ? a : 0, l = s ? i : 0, u = s ? o : 0, d = e.map((e) => [...e]), f = t.map((e) => e.map((e) => [...e]));
	v(d) < 0 || d.reverse();
	for (let e of f) v(e) < 0 && e.reverse();
	ie(d), f.forEach(ie);
	let p = [d, ...f], m = p.flat(), h = p.flatMap(oe), g = [], _ = (e, t) => g.push(m.map((n, r) => [
		n[0] + h[r][0] * e,
		n[1] + h[r][1] * e,
		t
	])), y = (e) => {
		let t = e / u;
		return {
			height: c * Math.cos(t * Math.PI / 2),
			distance: l * Math.sin(t * Math.PI / 2)
		};
	};
	for (let e = 0; e < u; e++) {
		let { height: t, distance: n } = y(e);
		_(n, -t);
	}
	let ee = s ? l : 0;
	_(ee, 0);
	for (let e = 1; e <= r; e++) _(ee, n / r * e);
	for (let e = u - 1; e >= 0; e--) {
		let { height: t, distance: r } = y(e);
		_(r, n + t);
	}
	let b = ne(d, f), te = s ? r + u * 2 : r, x = [], S = [], C = (e, t) => x.push(...g[e][t]), w = (e) => {
		for (let t = e; t >= 1; t--) {
			let e = x.length - t * 3;
			S.push(x[e], x[e + 1]);
		}
	};
	for (let e of b) C(0, e[2]), C(0, e[1]), C(0, e[0]), w(3);
	for (let e of b) {
		for (let t of e) C(te, t);
		w(3);
	}
	let T = 0;
	for (let e of p) {
		for (let t = e.length - 1; t >= 0; t--) {
			let n = t === 0 ? e.length - 1 : t - 1;
			for (let e = 0; e < r + u * 2; e++) {
				let r = g[e][T + t], i = g[e][T + n], a = g[e + 1][T + n], o = g[e + 1][T + t];
				x.push(...r, ...i, ...o, ...i, ...a, ...o);
				let s = Math.abs(r[1] - i[1]) < Math.abs(r[0] - i[0]) ? 0 : 1, c = (e) => [e[s], 1 - e[2]];
				S.push(...c(r), ...c(i), ...c(o), ...c(i), ...c(a), ...c(o));
			}
		}
		T += e.length;
	}
	let E = Float32Array.from(x);
	return {
		positions: E,
		normals: se(E),
		uvs: Float32Array.from(S),
		indices: null
	};
}
// src/modeling-bezier.js
var le = Math.cos(40 * Math.PI / 180), ue = 1e-12;
function de(e, t) {
	return [
		e[0] + t[0],
		e[1] + t[1],
		e[2] + t[2]
	];
}
function D(e, t) {
	return [
		e[0] - t[0],
		e[1] - t[1],
		e[2] - t[2]
	];
}
function O(e, t) {
	return [
		e[0] * t,
		e[1] * t,
		e[2] * t
	];
}
function k(e) {
	return Math.hypot(e[0], e[1], e[2]);
}
function fe(e, t) {
	let n = e.length;
	return e.map((r, i) => {
		let a = e[t ? (i + n - 1) % n : Math.max(i - 1, 0)].position, o = e[t ? (i + 1) % n : Math.min(i + 1, n - 1)].position, s = t || i > 0 && i < n - 1 ? O(D(o, a), 1 / 6) : null, c = r.handleOut, l = r.handleIn;
		return !c && l && (c = D(O(r.position, 2), l)), !l && c && (l = D(O(r.position, 2), c)), c || (c = s ? de(r.position, s) : de(r.position, O(D(o, r.position), 1 / 3)), l = s ? D(r.position, s) : de(r.position, O(D(a, r.position), 1 / 3))), {
			position: r.position,
			handleIn: l,
			handleOut: c
		};
	});
}
function pe(e, t, n, r, i) {
	let a = 1 - i, o = [
		a ** 3,
		3 * a * a * i,
		3 * a * i * i,
		i ** 3
	];
	return [
		0,
		1,
		2
	].map((i) => o[0] * e[i] + o[1] * t[i] + o[2] * n[i] + o[3] * r[i]);
}
function me(e, t, n, r, i) {
	let a = 1 - i;
	return [
		0,
		1,
		2
	].map((o) => 3 * (a * a * (t[o] - e[o]) + 2 * a * i * (n[o] - t[o]) + i * i * (r[o] - n[o])));
}
function he(e, t, n) {
	let r = t ? e.length : e.length - 1, i = [], a = [];
	for (let t = 0; t < r; t++) {
		let r = e[t], o = e[(t + 1) % e.length];
		for (let e = 0; e < n; e++) {
			let t = e / n;
			i.push(pe(r.position, r.handleOut, o.handleIn, o.position, t)), a.push(me(r.position, r.handleOut, o.handleIn, o.position, t));
		}
	}
	if (!t) {
		let t = e.at(-2), n = e.at(-1);
		i.push(n.position), a.push(me(t.position, t.handleOut, n.handleIn, n.position, 1));
	}
	return {
		points: i,
		tangents: ge(i, a, t)
	};
}
function ge(e, t, n) {
	let r = e.length;
	return t.map((e) => {
		let t = k(e);
		return t > ue ? O(e, 1 / t) : null;
	}).map((t, i) => {
		if (t) return t;
		for (let t = 1; t < r; t++) {
			let a = n ? (i + t) % r : i + t;
			if (a >= r) break;
			let o = D(e[a], e[i]), s = k(o);
			if (s > ue) return O(o, 1 / s);
		}
		throw RangeError("The curve has no length. Move its points apart.");
	});
}
function _e(e) {
	return Array.from({ length: e }, (t, n) => {
		let r = n / e * Math.PI * 2;
		return [-Math.cos(r), Math.sin(r)];
	});
}
function ve(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) {
		let r = e[(n + 1) % e.length];
		t += e[n][0] * r[1] - r[0] * e[n][1];
	}
	return t;
}
function ye(e) {
	let t = ve(e) < 0 ? [...e].reverse() : e, n = t.map((e, n) => {
		let r = t[(n + 1) % t.length], i = r[0] - e[0], a = r[1] - e[1], o = Math.hypot(i, a);
		if (o === 0) throw RangeError("The profile cannot repeat a point.");
		return [a / o, -i / o];
	}), r = (e, t) => {
		if (e[0] * t[0] + e[1] * t[1] < le) return null;
		let n = [e[0] + t[0], e[1] + t[1]], r = Math.hypot(n[0], n[1]);
		return [n[0] / r, n[1] / r];
	};
	return t.map((e, i) => {
		let a = (i + 1) % t.length, o = n[(i + t.length - 1) % t.length], s = n[i], c = n[a];
		return {
			start: t[i],
			end: t[a],
			startNormal: r(o, s) ?? s,
			endNormal: r(s, c) ?? s
		};
	});
}
function be(e, t) {
	if (!e) return 1;
	let n = t * (e.length - 1), r = Math.min(Math.floor(n), e.length - 2), i = n - r;
	return e[r] * (1 - i) + e[r + 1] * i;
}
function xe({ points: e, tangents: t, closed: n, radius: r, taper: i, profile: a, radialSegments: o }) {
	let s = e.length, c = h(n ? [...t, t[0]] : t, n), l = [0];
	for (let t = 1; t < s; t++) l.push(l[t - 1] + k(D(e[t], e[t - 1])));
	let u = n ? l[s - 1] + k(D(e[0], e[s - 1])) : l[s - 1], d = ye(a ?? _e(o)), f = [], p = [], m = [], g = [], _ = n ? s + 1 : s, v = d.length * 2;
	for (let t = 0; t < _; t++) {
		let n = t % s, { normal: a, binormal: o } = c[n], h = u > 0 ? l[n] / u : 0, g = t === s ? 1 : h, _ = r * be(i, h), v = (t, r, i) => {
			for (let i = 0; i < 3; i++) f.push(e[n][i] + _ * (t[0] * a[i] + t[1] * o[i])), p.push(r[0] * a[i] + r[1] * o[i]);
			m.push(g, i);
		};
		d.forEach((e, t) => {
			v(e.start, e.startNormal, t / d.length), v(e.end, e.endNormal, (t + 1) / d.length);
		});
	}
	for (let e = 1; e < _; e++) for (let t = 0; t < d.length; t++) {
		let n = (e - 1) * v + t * 2, r = e * v + t * 2;
		g.push(n, n + 1, r, r, n + 1, r + 1);
	}
	return n || (Ce(f, p, m, g, {
		ring: 0,
		tangent: O(t[0], -1),
		flip: !0,
		...Se(d, c, e, r, i, 0)
	}), Ce(f, p, m, g, {
		ring: s - 1,
		tangent: t[s - 1],
		flip: !1,
		...Se(d, c, e, r, i, 1)
	})), {
		positions: Float32Array.from(f),
		normals: Float32Array.from(p),
		uvs: Float32Array.from(m),
		indices: Uint32Array.from(g)
	};
}
function Se(e, t, n, r, i, a) {
	let o = a === 0 ? 0 : n.length - 1;
	return {
		edges: e,
		frame: t[o],
		center: n[o],
		size: r * be(i, a)
	};
}
function Ce(e, t, n, r, { tangent: i, flip: a, edges: o, frame: s, center: c, size: l }) {
	let u = e.length / 3, d = o.reduce((e, t) => [e[0] + t.start[0], e[1] + t.start[1]], [0, 0]).map((e) => e / o.length), f = Math.max(...o.map((e) => Math.hypot(e.start[0], e.start[1]))) || 1, p = (r) => {
		for (let n = 0; n < 3; n++) e.push(c[n] + l * (r[0] * s.normal[n] + r[1] * s.binormal[n])), t.push(i[n]);
		n.push(.5 + r[0] * .5 / f, .5 + r[1] * .5 / f);
	};
	p(d), o.forEach((e) => p(e.start));
	for (let e = 0; e < o.length; e++) {
		let t = u + 1 + e, n = u + 1 + (e + 1) % o.length;
		a ? r.push(u, n, t) : r.push(u, t, n);
	}
}
// src/modeling-splines.js
var A = Math.PI * 2, we = ["clamped", "uniform"], Te = 1e-5, j = 1e-9, Ee = [
	"arc",
	"spiral",
	"star"
];
function M(e, t, n, r, i) {
	let a = e === void 0 ? t : e;
	if (!Number.isFinite(a) || a < r || a > i) throw RangeError(`${n} must be a number from ${r} to ${i}, such as ${t}.`);
	return a;
}
function N(e, t, n, r, i) {
	let a = e === void 0 ? t : e;
	if (!Number.isInteger(a) || a < r || a > i) throw RangeError(`${n} must be an integer from ${r} to ${i}, such as ${t}.`);
	return a;
}
function De(e, t) {
	for (let n of Object.keys(e)) if (!t.includes(n)) throw TypeError(`Unknown shape field: ${n}. Use ${t.join(", ")}.`);
}
function Oe(e) {
	De(e, [
		"type",
		"radius",
		"startAngle",
		"sweep",
		"segments"
	]);
	let t = M(e.radius, 1, "shape.radius", 1e-6, 1e6), n = M(e.startAngle, 0, "shape.startAngle", -1e4, 1e4), r = M(e.sweep, Math.PI, "shape.sweep", -A, A), i = N(e.segments, 8, "shape.segments", 1, 256);
	if (Math.abs(r) < 1e-6) throw RangeError("shape.sweep must not be 0. Pass an angle in radians such as 3.14.");
	let a = Math.abs(Math.abs(r) - A) < 1e-9, o = r / i, s = 4 / 3 * Math.tan(o / 4) * t, c = a ? i : i + 1;
	return {
		type: "bezier",
		closed: a,
		points: Array.from({ length: c }, (e, r) => {
			let i = n + o * r, a = Math.cos(i), c = Math.sin(i), l = [
				t * a,
				t * c,
				0
			], u = [
				-c * s,
				a * s,
				0
			];
			return {
				position: l,
				handleIn: [
					l[0] - u[0],
					l[1] - u[1],
					0
				],
				handleOut: [
					l[0] + u[0],
					l[1] + u[1],
					0
				]
			};
		})
	};
}
function ke(e) {
	De(e, [
		"type",
		"rotations",
		"startRadius",
		"endRadius",
		"height",
		"pointsPerRotation",
		"reverse"
	]);
	let t = M(e.rotations, 2, "shape.rotations", .05, 64), n = M(e.startRadius, 1, "shape.startRadius", 0, 1e6), r = M(e.endRadius, 1, "shape.endRadius", 0, 1e6), i = M(e.height, 2, "shape.height", -1e6, 1e6), a = N(e.pointsPerRotation, 12, "shape.pointsPerRotation", 3, 128);
	if (e.reverse !== void 0 && typeof e.reverse != "boolean") throw TypeError("shape.reverse must be true or false.");
	let o = Math.max(1, Math.ceil(t * a));
	if (o + 1 > 1024) throw RangeError("The spiral needs at most 1024 points. Lower shape.rotations or shape.pointsPerRotation.");
	let s = e.reverse ? -1 : 1;
	return {
		type: "bezier",
		closed: !1,
		points: Array.from({ length: o + 1 }, (e, a) => {
			let c = a / o, l = s * A * t * c, u = n + (r - n) * c;
			return [
				u * Math.cos(l),
				u * Math.sin(l),
				i * c
			];
		})
	};
}
function Ae(e) {
	De(e, [
		"type",
		"points",
		"innerRadius",
		"outerRadius",
		"innerTwist"
	]);
	let t = N(e.points, 5, "shape.points", 3, 256), n = M(e.innerRadius, .5, "shape.innerRadius", 1e-6, 1e6), r = M(e.outerRadius, 1, "shape.outerRadius", 1e-6, 1e6), i = M(e.innerTwist, 0, "shape.innerTwist", -A, A), a = [];
	for (let e = 0; e < t; e++) {
		let o = A * e / t, s = o + Math.PI / t + i;
		a.push([
			r * Math.cos(o),
			r * Math.sin(o),
			0
		]), a.push([
			n * Math.cos(s),
			n * Math.sin(s),
			0
		]);
	}
	return {
		type: "poly",
		closed: !0,
		points: a
	};
}
function je(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw TypeError(`shape must be an object with type ${Ee.join(", ")}.`);
	if (e.type === "arc") return Oe(e);
	if (e.type === "spiral") return ke(e);
	if (e.type === "star") return Ae(e);
	throw RangeError(`shape.type must be one of ${Ee.join(", ")}, not ${JSON.stringify(e.type)}.`);
}
function P(e, t) {
	return [
		e[0] - t[0],
		e[1] - t[1],
		e[2] - t[2]
	];
}
function F(e) {
	let t = Math.hypot(e[0], e[1], e[2]);
	return t > j ? [
		e[0] / t,
		e[1] / t,
		e[2] / t
	] : null;
}
function Me(e, t) {
	let n = e.length;
	return {
		points: e,
		tangents: ge(e, e.map((r, i) => F(i === n - 1 && !t ? P(r, e[i - 1]) : P(e[(i + 1) % n], r))), t)
	};
}
function Ne(e, t, n, r = "clamped") {
	let i = e + t;
	return n || r === "uniform" ? Array.from({ length: i }, (e, t) => t) : Array.from({ length: i }, (n, r) => Math.min(Math.max(r - t + 1, 0), e - t + 1));
}
function Pe(e, t, n, r) {
	let i = t - 1;
	if (n >= r[e]) return e - 1;
	let a = i;
	for (; a < e - 1 && n >= r[a + 1];) a++;
	return a;
}
function Fe(e, t, n, r) {
	let i = r - 1, a = [1], o = [], s = [];
	for (let r = 1; r <= i; r++) {
		o[r] = t - n[e + 1 - r], s[r] = n[e + r] - t;
		let i = 0;
		for (let e = 0; e < r; e++) {
			let t = s[e + 1] + o[r - e], n = t === 0 ? 0 : a[e] / t;
			a[e] = i + s[e + 1] * n, i = o[r - e] * n;
		}
		a[r] = i;
	}
	return a;
}
function Ie(e, t, n, r, i) {
	let a = e.length, o = Pe(a, r, i, n), s = Fe(o, i, n, r), c = [
		0,
		0,
		0
	], l = 0;
	return s.forEach((n, i) => {
		let a = o - (r - 1) + i, s = n * t[a];
		l += s;
		for (let t = 0; t < 3; t++) c[t] += s * e[a][t];
	}), c.map((e) => e / l);
}
function Le(e, t, n, r, i = {}) {
	let a = Math.min(i.order ?? 4, e.length), o = n ? a - 1 : 0, s = [...e, ...e.slice(0, o)], c = [...t, ...t.slice(0, o)], l = i.knots ?? Ne(s.length, a, n, i.knotMode), u = l[a - 1], d = l[s.length], f = n ? e.length : e.length - 1, p = n ? f * r : f * r + 1, m = (e) => u + (d - u) * e / (f * r), h = (e) => Ie(s, c, l, a, Math.min(Math.max(e, u), d)), g = Array.from({ length: p }, (e, t) => h(m(t))), _ = Te * (d - u);
	return {
		points: g,
		tangents: ge(g, Array.from({ length: p }, (e, t) => {
			let r = m(t), i = h(n ? u + (r - _ - u + (d - u)) % (d - u) : r - _);
			return F(P(h(n ? u + (r + _ - u) % (d - u) : r + _), i));
		}), n)
	};
}
function Re(e, t) {
	return e.type === "poly" ? Me(e.points, e.closed) : e.type === "nurbs" ? Le(e.points, e.weights, e.closed, t, e.basis) : he(fe(e.points, e.closed), e.closed, t);
}
function I(e, t, n) {
	return e.map((e, r) => e + (t[r] - e) * n);
}
function ze(e, t) {
	let n = e.points.length;
	return e.type === "poly" ? n : (e.closed ? n : n - 1) * t + +!e.closed;
}
function Be(e, t, { start: n = 0, end: r = 1, length: i = !1 }) {
	let a = t ? [...e.points, e.points[0]] : e.points, o = t ? [...e.tangents, e.tangents[0]] : e.tangents, s = [0];
	for (let e = 1; e < a.length; e++) {
		let t = P(a[e], a[e - 1]);
		s.push(s[e - 1] + Math.hypot(t[0], t[1], t[2]));
	}
	let c = s.at(-1), l = Math.min(i ? n : n * c, c), u = Math.min(i ? r : r * c, c);
	if (u - l <= j * Math.max(c, 1)) throw RangeError("trim leaves no curve. Pass trim.end greater than trim.start, within the curve length.");
	if (!t && l <= 0 && u >= c) return e;
	let d = [], f = [], p = (e) => {
		let t = s.findIndex((t) => t >= e);
		t <= 0 && (t = 1);
		let n = (e - s[t - 1]) / (s[t] - s[t - 1] || 1);
		d.push(I(a[t - 1], a[t], n)), f.push(F(I(o[t - 1], o[t], n)) ?? o[t]);
	};
	p(l);
	for (let e = 0; e < a.length; e++) s[e] > l + j && s[e] < u - j && (d.push(a[e]), f.push(o[e]));
	return p(u), {
		points: d,
		tangents: f
	};
}
function Ve(e, t) {
	let { points: n, tangents: r } = e, i = [0];
	for (let e = 1; e < n.length; e++) {
		let t = P(n[e], n[e - 1]);
		i.push(i[e - 1] + Math.hypot(t[0], t[1], t[2]));
	}
	let a = i.at(-1), o = {
		points: [],
		tangents: []
	}, s = 1;
	for (let e = 0; e < t; e++) {
		let c = a * e / (t - 1);
		for (; s < n.length - 1 && i[s] < c;) s++;
		let l = i[s] - i[s - 1], u = l > 0 ? Math.min(Math.max((c - i[s - 1]) / l, 0), 1) : 0;
		o.points.push(I(n[s - 1], n[s], u)), o.tangents.push(F(I(r[s - 1], r[s], u)) ?? r[s]);
	}
	return o;
}
// src/modeling-sdf.js
var L = Object.freeze({
	minResolution: 4,
	maxResolution: 128,
	defaultResolution: 32,
	maxNodes: 64,
	maxDepth: 8,
	maxChildren: 16
}), He = 2, Ue = {
	sphere: ["radius"],
	box: ["size"],
	roundBox: ["size", "radius"],
	capsule: ["radius", "height"],
	cylinder: ["radius", "height"],
	torus: ["radius", "tubeRadius"]
}, We = [
	"union",
	"subtract",
	"intersect",
	"offset"
], Ge = [
	"position",
	"rotation",
	"scale"
];
function R(e, t, n) {
	let r = typeof t == "object" ? JSON.stringify(t) : String(t);
	return /* @__PURE__ */ RangeError(`${e} is ${r}; pass ${n}.`);
}
function z(e, t, n, r) {
	let i = e[t] ?? n;
	if (!Number.isFinite(i) || i <= 0) throw R(`${r}.${t}`, i, "a positive number");
	return i;
}
function B(e, t, n, { positive: r = !1 } = {}) {
	let i = e ?? t;
	if (!(Array.isArray(i) && i.length === 3 && i.every((e) => Number.isFinite(e) && (!r || e > 0)))) throw R(n, i, r ? "three positive numbers, such as [1, 1, 1]" : "three numbers, such as [0, 0, 0]");
	return i;
}
function Ke(e, t, n) {
	for (let r of Object.keys(e)) if (!t.includes(r)) throw R(`${n}.${r}`, e[r], `one of ${t.join(", ")}; remove "${r}"`);
}
function qe([e, t, n]) {
	let r = Math.cos(e), i = Math.sin(e), a = Math.cos(t), o = Math.sin(t), s = Math.cos(n), c = Math.sin(n);
	return [
		s * a,
		s * o * i - c * r,
		s * o * r + c * i,
		c * a,
		c * o * i + s * r,
		c * o * r - s * i,
		-o,
		a * i,
		a * r
	];
}
function V(e, t) {
	return Math.sqrt(e * e + t * t);
}
function H(e, t, n) {
	return Math.sqrt(e * e + t * t + n * n);
}
function Je(e, t, n, r) {
	let i = Math.abs(e) - r[0], a = Math.abs(t) - r[1], o = Math.abs(n) - r[2];
	return H(Math.max(i, 0), Math.max(a, 0), Math.max(o, 0)) + Math.min(Math.max(i, a, o), 0);
}
function Ye(e, t) {
	switch (e.shape) {
		case "sphere": {
			let n = z(e, "radius", .5, t);
			return {
				half: [
					n,
					n,
					n
				],
				distance: (e, t, r) => H(e, t, r) - n
			};
		}
		case "box": {
			let n = B(e.size, [
				1,
				1,
				1
			], `${t}.size`, { positive: !0 }).map((e) => e / 2);
			return {
				half: n,
				distance: (e, t, r) => Je(e, t, r, n)
			};
		}
		case "roundBox": {
			let n = B(e.size, [
				1,
				1,
				1
			], `${t}.size`, { positive: !0 }), r = e.radius ?? .1;
			if (!Number.isFinite(r) || r < 0 || r > Math.min(...n) / 2) throw R(`${t}.radius`, r, `a number from 0 to half the smallest size, ${Math.min(...n) / 2}`);
			let i = n.map((e) => e / 2), a = i.map((e) => e - r);
			return {
				half: i,
				distance: (e, t, n) => Je(e, t, n, a) - r
			};
		}
		case "capsule": {
			let n = z(e, "radius", .25, t), r = z(e, "height", .5, t) / 2;
			return {
				half: [
					n,
					r + n,
					n
				],
				distance: (e, t, i) => H(e, t - Math.max(-r, Math.min(r, t)), i) - n
			};
		}
		case "cylinder": {
			let n = z(e, "radius", .5, t), r = z(e, "height", 1, t) / 2;
			return {
				half: [
					n,
					r,
					n
				],
				distance: (e, t, i) => {
					let a = V(e, i) - n, o = Math.abs(t) - r;
					return Math.min(Math.max(a, o), 0) + V(Math.max(a, 0), Math.max(o, 0));
				}
			};
		}
		case "torus": {
			let n = z(e, "radius", .5, t), r = z(e, "tubeRadius", .15, t);
			return {
				half: [
					n + r,
					r,
					n + r
				],
				distance: (e, t, i) => V(V(e, i) - n, t) - r
			};
		}
		default: throw R(`${t}.shape`, e.shape, `one of ${Object.keys(Ue).join(", ")}`);
	}
}
function Xe(e, t) {
	Ke(e, [
		"shape",
		...Ue[e.shape] ?? [],
		...Ge
	], t);
	let n = Ye(e, t), r = B(e.position, [
		0,
		0,
		0
	], `${t}.position`), i = B(e.rotation, [
		0,
		0,
		0
	], `${t}.rotation`), a = e.scale ?? 1;
	if (!Number.isFinite(a) || a <= 0) throw R(`${t}.scale`, a, "one positive number; scale is uniform");
	let o = qe(i), s = 1 / a, c = (e, t, i) => {
		let c = e - r[0], l = t - r[1], u = i - r[2], d = (o[0] * c + o[3] * l + o[6] * u) * s, f = (o[1] * c + o[4] * l + o[7] * u) * s, p = (o[2] * c + o[5] * l + o[8] * u) * s;
		return n.distance(d, f, p) * a;
	}, l = [
		0,
		1,
		2
	].map((e) => a * (Math.abs(o[e * 3]) * n.half[0] + Math.abs(o[e * 3 + 1]) * n.half[1] + Math.abs(o[e * 3 + 2]) * n.half[2]));
	return {
		distance: c,
		bounds: {
			min: l.map((e, t) => r[t] - e),
			max: l.map((e, t) => r[t] + e)
		}
	};
}
function Ze(e, t, n) {
	if (n === 0) return Math.min(e, t);
	let r = Math.max(n - Math.abs(e - t), 0) / n;
	return Math.min(e, t) - r * r * n / 4;
}
function Qe(e, t) {
	switch (e) {
		case "union": return (e, n) => Ze(e, n, t);
		case "intersect": return (e, n) => -Ze(-e, -n, t);
		default: return (e, n) => -Ze(-e, n, t);
	}
}
function $e(e, t) {
	return {
		min: e.min.map((e) => e - t),
		max: e.max.map((e) => e + t)
	};
}
function et(e, t, n, r) {
	if (e === "subtract") return t[0];
	let i = e === "union" ? [Math.min, Math.max] : [Math.max, Math.min], a = {
		min: [
			0,
			1,
			2
		].map((e) => i[0](...t.map((t) => t.min[e]))),
		max: [
			0,
			1,
			2
		].map((e) => i[1](...t.map((t) => t.max[e])))
	};
	if (e === "intersect" && a.min.some((e, t) => e >= a.max[t])) throw R(r, "children that do not overlap", "children whose shapes overlap, or use union");
	return e === "union" ? $e(a, n) : a;
}
function tt(e, t, n, r) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw R(t, e, "a primitive such as { \"shape\": \"sphere\", \"radius\": 0.5 } or an operation such as { \"op\": \"union\", \"children\": [...] }");
	if (r.count += 1, r.count > L.maxNodes) throw R(t, `more than ${L.maxNodes} nodes`, `at most ${L.maxNodes} primitives and operations in all`);
	if (n > L.maxDepth) throw R(t, `nesting deeper than ${L.maxDepth}`, `at most ${L.maxDepth} levels of operations`);
	if (e.shape !== void 0) {
		if (e.op !== void 0) throw R(`${t}.op`, e.op, "either shape or op, not both");
		return Xe(e, t);
	}
	if (!We.includes(e.op)) throw R(`${t}.op`, e.op, `shape (${Object.keys(Ue).join(", ")}) or op (${We.join(", ")})`);
	if (e.op === "offset") return nt(e, t, n, r);
	Ke(e, [
		"op",
		"smooth",
		"children"
	], t);
	let i = e.smooth ?? 0;
	if (!Number.isFinite(i) || i < 0) throw R(`${t}.smooth`, i, "a blend radius of 0 or more, in the units of the shapes");
	let a = e.children;
	if (!Array.isArray(a) || a.length < 2 || a.length > L.maxChildren) throw R(`${t}.children`, Array.isArray(a) ? `${a.length} children` : a, `2 to ${L.maxChildren} nodes`);
	let o = a.map((e, i) => tt(e, `${t}.children[${i}]`, n + 1, r)), s = Qe(e.op, i), c = (e, t, n) => {
		let r = o[0].distance(e, t, n);
		for (let i = 1; i < o.length; i++) r = s(r, o[i].distance(e, t, n));
		return r;
	}, l = i / 4 * (o.length - 1);
	return {
		distance: c,
		bounds: et(e.op, o.map((e) => e.bounds), l, t)
	};
}
function nt(e, t, n, r) {
	if (Ke(e, [
		"op",
		"distance",
		"child"
	], t), !Number.isFinite(e.distance)) throw R(`${t}.distance`, e.distance, "a number: positive grows the shape, negative shrinks it");
	let i = tt(e.child, `${t}.child`, n + 1, r);
	return {
		distance: (t, n, r) => i.distance(t, n, r) - e.distance,
		bounds: e.distance > 0 ? $e(i.bounds, e.distance) : i.bounds
	};
}
function rt(e) {
	let t = Object.keys(e).filter((e) => ![
		"id",
		"type",
		"root",
		"resolution"
	].includes(e));
	if (t.length) throw R(`sdf.${t[0]}`, e[t[0]], "only root and resolution; remove it");
	let n = e.resolution ?? L.defaultResolution;
	if (!Number.isInteger(n) || n < L.minResolution || n > L.maxResolution) throw R("sdf.resolution", n, `a whole number of cells along the longest side, ${L.minResolution} to ${L.maxResolution}; the grid is capped at ${L.maxResolution ** 3} cells`);
	let r = tt(e.root, "sdf.root", 0, { count: 0 }), i = r.bounds.max.map((e, t) => e - r.bounds.min[t]), a = Math.max(...i) / n;
	return {
		root: r,
		resolution: n,
		edge: a,
		points: i.map((e) => Math.ceil(e / a - 1e-9) + 1 + 4),
		origin: r.bounds.min.map((e) => e - He * a),
		vertexEstimate: 8 * n * n
	};
}
function it(e) {
	return rt(e).vertexEstimate;
}
function at({ root: e, edge: t, points: n, origin: r }) {
	let [i, a, o] = n, s = new Float32Array(i * a * o), c = 0;
	for (let n = 0; n < o; n++) for (let o = 0; o < a; o++) for (let a = 0; a < i; a++) s[c++] = e.distance(r[0] + a * t, r[1] + o * t, r[2] + n * t);
	return s;
}
function ot(e, t, n, r, i) {
	return [
		e(t + i, n, r) - e(t - i, n, r),
		e(t, n + i, r) - e(t, n - i, r),
		e(t, n, r + i) - e(t, n, r - i)
	];
}
function st(e, t) {
	let n = [], r = (e, n) => {
		let r = t[e * 3] - t[n * 3], i = t[e * 3 + 1] - t[n * 3 + 1], a = t[e * 3 + 2] - t[n * 3 + 2];
		return r * r + i * i + a * a;
	};
	for (let [t, i, a, o] of e) r(t, a) <= r(i, o) ? n.push(t, i, a, t, a, o) : n.push(t, i, o, i, a, o);
	return Uint32Array.from(n);
}
function ct(n) {
	let r = rt(n), i = {
		points: r.points,
		edge: r.edge
	}, a = at(r), { cellVertex: o, positions: s } = t(a, i, r.origin), c = e(a, i, o);
	if (!c.length) throw RangeError("sdf has no surface: the shape is empty or smaller than a cell. Pass a larger resolution or check subtract and intersect children.");
	let l = Float32Array.from(s), u = new Float32Array(l.length), d = new Float32Array(l.length / 3 * 2);
	for (let e = 0; e < l.length / 3; e++) {
		let t = ot(r.root.distance, s[e * 3], s[e * 3 + 1], s[e * 3 + 2], r.edge * .5);
		u.set(t, e * 3);
		let [n, i] = [
			[1, 2],
			[0, 2],
			[0, 1]
		][Math.abs(t[0]) >= Math.abs(t[1]) && Math.abs(t[0]) >= Math.abs(t[2]) ? 0 : Math.abs(t[1]) >= Math.abs(t[2]) ? 1 : 2];
		d[e * 2] = s[e * 3 + n], d[e * 2 + 1] = s[e * 3 + i];
	}
	return {
		positions: l,
		normals: u,
		uvs: d,
		indices: st(c, l)
	};
}
// src/modeling.js
var U = 4096, W = 25e4;
function G(e, t) {
	if (!Number.isFinite(e) || !Number.isFinite(Math.fround(e))) throw TypeError(`${t} must be a finite float.`);
	return Math.fround(e);
}
function K(e, t, n, r) {
	if (!Number.isInteger(e) || e < t || e > n) throw RangeError(`${r} must be an integer within ${t} and ${n}.`);
	return e;
}
function q(e, t, n, r) {
	if (!Array.isArray(e) || e.length < n || e.length > U) throw RangeError(`${r} needs ${n} to ${U} points.`);
	let i = e.map((e) => {
		if (!Array.isArray(e) && !ArrayBuffer.isView(e) || e.length !== t) throw TypeError(`${r} points need ${t} components.`);
		return Array.from(e, (e) => G(e, r));
	});
	for (let e = 1; e < i.length; e++) if (i[e].every((t, n) => t === i[e - 1][n])) throw RangeError(`${r} cannot contain consecutive duplicate points.`);
	return i;
}
function J(e, t) {
	if (!Array.isArray(e) || e.length !== 3) throw TypeError(`${t} needs three components.`);
	return e.map((e) => G(e, t));
}
function lt(e, t) {
	if (Array.isArray(e)) return { position: J(e, "point") };
	if (!e || typeof e != "object") throw TypeError(`Curve point ${t} must be [x, y, z] or an object with position.`);
	for (let t of Object.keys(e)) if (![
		"position",
		"handleIn",
		"handleOut"
	].includes(t)) throw TypeError(`Unknown curve point field: ${t}.`);
	return {
		position: J(e.position, "position"),
		...e.handleIn === void 0 ? {} : { handleIn: J(e.handleIn, "handleIn") },
		...e.handleOut === void 0 ? {} : { handleOut: J(e.handleOut, "handleOut") }
	};
}
function ut(e) {
	if (e === void 0) return null;
	if (!Array.isArray(e) || e.length < 2 || e.length > 64) throw RangeError("taper needs 2 to 64 radius factors.");
	return e.map((e) => {
		if (G(e, "taper"), e < 0) throw RangeError("taper factors cannot be negative.");
		return e;
	});
}
function Y(e, t) {
	if (K(t, 3, 1e6, "maxVertices"), e > t) throw RangeError(`Modeling requires up to ${e} vertices, exceeding maxVertices ${t}. Reduce detail.`);
}
function X(e, t) {
	Y(e.positions.length / 3, t);
	let { positions: n, normals: r, uvs: i } = e, a = e.indices ?? Uint32Array.from({ length: n.length / 3 }, (e, t) => t);
	for (let e = 0; e < r.length; e += 3) {
		let t = Math.hypot(r[e], r[e + 1], r[e + 2]);
		if (!Number.isFinite(t) || t === 0) throw RangeError("Modeling produced an invalid normal. Adjust the profile or contour.");
		for (let n = 0; n < 3; n++) r[e + n] /= t;
	}
	for (let e of n) if (!Number.isFinite(e)) throw RangeError("Modeling geometry exceeds the finite Float32 range. Reduce coordinates.");
	for (let e of i) if (!Number.isFinite(e)) throw RangeError("Modeling produced invalid UVs. Adjust the profile or contour.");
	let o = !1;
	for (let e = 0; e < a.length; e += 3) {
		let t = a[e] * 3, r = a[e + 1] * 3, i = a[e + 2] * 3, s = n[r] - n[t], c = n[r + 1] - n[t + 1], l = n[r + 2] - n[t + 2], u = n[i] - n[t], d = n[i + 1] - n[t + 1], f = n[i + 2] - n[t + 2];
		if (Math.hypot(c * f - l * d, l * u - s * f, s * d - c * u) > 0) {
			o = !0;
			break;
		}
	}
	if (!o) throw RangeError("Modeling collapsed at Float32 precision. Center geometry locally and position it with a transform.");
	return {
		positions: n,
		normals: r,
		uvs: i,
		indices: a
	};
}
function dt(e, { segments: t = 64, startAngle: n = 0, sweep: r = Math.PI * 2, maxVertices: i = W } = {}) {
	if (K(t, 3, 2048, "segments"), G(n, "startAngle"), n %= Math.PI * 2, G(r, "sweep"), r <= 0 || r > Math.PI * 2) throw RangeError("sweep must be greater than zero and at most one full turn.");
	let a = q(e, 2, 2, "profile");
	if (a.some((e) => e[0] < 0) || !a.some((e) => e[0] > 0)) throw RangeError("Profile radii must be nonnegative, with at least one positive radius.");
	return Y((t + 1) * a.length, i), X(E(a, t, n, r), i);
}
function Z(e, t, n) {
	return (t[0] - e[0]) * (n[1] - e[1]) - (t[1] - e[1]) * (n[0] - e[0]);
}
function Q(e, t, n) {
	return Z(e, t, n) === 0 && n[0] >= Math.min(e[0], t[0]) && n[0] <= Math.max(e[0], t[0]) && n[1] >= Math.min(e[1], t[1]) && n[1] <= Math.max(e[1], t[1]);
}
function ft(e, t, n, r) {
	let i = Z(e, t, n), a = Z(e, t, r), o = Z(n, r, e), s = Z(n, r, t);
	return Math.sign(i) !== Math.sign(a) && Math.sign(o) !== Math.sign(s) || i === 0 && Q(e, t, n) || a === 0 && Q(e, t, r) || o === 0 && Q(n, r, e) || s === 0 && Q(n, r, t);
}
function pt(e, t) {
	let n = q(e, 2, 3, t);
	if (n[0].every((e, t) => e === n.at(-1)[t]) && n.pop(), n.length < 3) throw RangeError(`${t} needs three distinct points.`);
	let r = 0;
	for (let e = 0; e < n.length; e++) {
		let i = (e + 1) % n.length;
		r += n[e][0] * n[i][1] - n[i][0] * n[e][1];
		for (let r = e + 1; r < n.length; r++) {
			let a = (r + 1) % n.length;
			if (r !== i && a !== e && ft(n[e], n[i], n[r], n[a])) throw RangeError(`${t} cannot intersect or touch itself.`);
		}
	}
	if (r === 0) throw RangeError(`${t} must enclose a nonzero area.`);
	return n;
}
function mt(e, t) {
	let n = !1;
	for (let r = 0, i = t.length - 1; r < t.length; i = r++) {
		let a = t[r], o = t[i];
		a[1] > e[1] != o[1] > e[1] && e[0] < (o[0] - a[0]) * (e[1] - a[1]) / (o[1] - a[1]) + a[0] && (n = !n);
	}
	return n;
}
function ht(e, t) {
	for (let n = 0; n < e.length; n++) for (let r = 0; r < t.length; r++) if (ft(e[n], e[(n + 1) % e.length], t[r], t[(r + 1) % t.length])) return !0;
	return !1;
}
function gt(e) {
	let { positions: t, normals: n, uvs: r, indices: i } = e, a = (e) => `${t[e * 3]},${t[e * 3 + 1]},${t[e * 3 + 2]}`, o = (e, t) => {
		let n = a(e), r = a(t);
		return n < r ? `${n}|${r}` : `${r}|${n}`;
	}, s = /* @__PURE__ */ new Map();
	for (let e = 0; e < i.length; e += 3) for (let t = 0; t < 3; t++) {
		let n = o(i[e + t], i[e + (t + 1) % 3]);
		s.set(n, (s.get(n) ?? 0) + 1);
	}
	let c = new Set([...s].filter(([, e]) => e !== 2).map(([e]) => e));
	if (c.size === 0) return e;
	let l = /* @__PURE__ */ new Map();
	for (let e = 0; e < i.length; e += 3) for (let t = 0; t < 3; t++) {
		let n = i[e + t], r = i[e + (t + 1) % 3];
		c.has(o(n, r)) && (l.set(a(n), n), l.set(a(r), r));
	}
	let u = Array.from(t), d = Array.from(n), f = Array.from(r), p = (e, n) => {
		let r = [
			u[e * 3],
			u[e * 3 + 1],
			u[e * 3 + 2]
		], i = [
			0,
			1,
			2
		].map((e) => u[n * 3 + e] - r[e]), a = i[0] ** 2 + i[1] ** 2 + i[2] ** 2, o = 1e-6 * Math.max(Math.sqrt(a), ...r.map(Math.abs)), s = [];
		for (let e of l.values()) {
			let n = [
				0,
				1,
				2
			].map((n) => t[e * 3 + n] - r[n]), c = (n[0] * i[0] + n[1] * i[1] + n[2] * i[2]) / a;
			c <= 1e-6 || c >= 1 - 1e-6 || Math.hypot(...n.map((e, t) => e - i[t] * c)) <= o && s.push({
				candidate: e,
				along: c
			});
		}
		return s.sort((e, t) => e.along - t.along);
	}, m = (e, n, { candidate: r, along: i }) => {
		let a = u.length / 3;
		for (let a = 0; a < 3; a++) u.push(t[r * 3 + a]), d.push(d[e * 3 + a] + (d[n * 3 + a] - d[e * 3 + a]) * i);
		for (let t = 0; t < 2; t++) f.push(f[e * 2 + t] + (f[n * 2 + t] - f[e * 2 + t]) * i);
		return a;
	}, h = [], g = [];
	for (let e = i.length - 3; e >= 0; e -= 3) g.push([
		i[e],
		i[e + 1],
		i[e + 2]
	]);
	for (; g.length;) {
		let e = g.pop(), t = !1;
		for (let n = 0; n < 3 && !t; n++) {
			let r = e[n], i = e[(n + 1) % 3], a = e[(n + 2) % 3];
			if (!c.has(o(r, i))) continue;
			let s = p(r, i);
			if (!s.length) continue;
			let l = [
				r,
				...s.map((e) => m(r, i, e)),
				i
			];
			for (let e = l.length - 2; e >= 0; e--) g.push([
				l[e],
				l[e + 1],
				a
			]);
			t = !0;
		}
		t || h.push(...e);
	}
	return {
		positions: Float32Array.from(u),
		normals: Float32Array.from(d),
		uvs: Float32Array.from(f),
		indices: Uint32Array.from(h)
	};
}
function _t(e, { holes: t = [], depth: n = 1, steps: r = 1, bevel: i = 0, bevelThickness: a = i, bevelSegments: o = 3, maxVertices: s = W } = {}) {
	if (n = G(n, "depth"), i = G(i, "bevel"), a = G(a, "bevelThickness"), n <= 0 || i < 0 || a < 0) throw RangeError("depth must be positive and bevel dimensions must be nonnegative.");
	if (K(r, 1, 256, "steps"), K(o, 1, 32, "bevelSegments"), !Array.isArray(t) || t.length > 128) throw RangeError("holes must be an array with at most 128 rings.");
	if ((e?.length ?? 0) + t.reduce((e, t) => e + (t?.length ?? 0), 0) > U + t.length + 1) throw RangeError(`Contours and holes must contain at most ${U} total points.`);
	let c = pt(e, "contour"), l = t.map((e, t) => pt(e, `hole ${t}`)), u = c.length + l.reduce((e, t) => e + t.length, 0);
	if (u > U) throw RangeError(`Contours and holes must contain at most ${U} total points.`);
	let d = i > 0 || a > 0;
	Y(6 * (u + l.length * 2 - 2) + 6 * u * (r + (d ? o * 2 : 0)), s);
	for (let e = 0; e < l.length; e++) {
		if (!mt(l[e][0], c) || ht(c, l[e])) throw RangeError("Every hole must lie strictly inside the contour.");
		for (let t = 0; t < e; t++) if (ht(l[e], l[t]) || mt(l[e][0], l[t]) || mt(l[t][0], l[e])) throw RangeError("Holes cannot overlap, touch or contain each other.");
	}
	return gt(X(ce(c, l, {
		depth: n,
		steps: r,
		bevel: i,
		bevelThickness: a,
		bevelSegments: o
	}), s));
}
var vt = [
	"bezier",
	"poly",
	"nurbs"
], yt = 64, bt = 1024, xt = 4096, St = [
	"points",
	"shape",
	"closed",
	"kind",
	"weights",
	"order",
	"knots",
	"knotMode",
	"trim"
];
function Ct(e, t) {
	if (e === void 0) return null;
	if (!e || typeof e != "object" || Array.isArray(e)) throw TypeError(`${t} must be an object such as { "start": 0, "end": 0.5 }.`);
	for (let n of Object.keys(e)) if (![
		"start",
		"end",
		"length"
	].includes(n)) throw TypeError(`Unknown ${t} field: ${n}. Use start, end, length.`);
	if (e.length !== void 0 && typeof e.length != "boolean") throw TypeError(`${t}.length must be true (start and end are lengths) or false (factors 0 to 1).`);
	let n = e.length === !0, r = n ? 1e9 : 1, i = G(e.start ?? 0, `${t}.start`), a = G(e.end ?? r, `${t}.end`);
	if (i < 0 || i > r || a < 0 || a > r) throw RangeError(`${t}.start and ${t}.end must be from 0 to ${n ? "the curve length" : "1"}.`);
	if (a <= i) throw RangeError(`${t}.end must be greater than ${t}.start. Pass a range such as { "start": 0, "end": 0.5 }.`);
	return {
		start: i,
		end: a,
		length: n
	};
}
function wt(e, t, n) {
	if (e === void 0) return Array(t).fill(1);
	if (!Array.isArray(e) || e.length !== t) throw RangeError(`${n} needs one weight per point (${t}).`);
	return e.map((e) => {
		if (G(e, n), e <= 0 || e > 1e6) throw RangeError(`${n} must be greater than 0 and at most 1000000.`);
		return e;
	});
}
function Tt(e, t, n, r) {
	let { order: i = Math.min(4, t), knots: a, knotMode: o } = e;
	if (!Number.isInteger(i) || i < 2 || i > Math.min(8, t)) throw RangeError(`${r}.order must be an integer from 2 to ${Math.min(8, t)} (at most 8 and the point count ${t}), such as ${Math.min(4, t)}.`);
	if (a !== void 0 && o !== void 0) throw TypeError(`${r}.knots and ${r}.knotMode exclude each other. Pass one.`);
	if ((a !== void 0 || o !== void 0) && n) throw TypeError(`${r}.knots and ${r}.knotMode apply to open splines; a closed spline is periodic. Set closed to false.`);
	if (o !== void 0 && !we.includes(o)) throw RangeError(`${r}.knotMode must be one of ${we.join(", ")}.`);
	if (a !== void 0) {
		if (!Array.isArray(a) || a.length !== t + i) throw RangeError(`${r}.knots needs ${t + i} values (points ${t} plus order ${i}).`);
		if (a.forEach((e, t) => {
			if (G(e, `${r}.knots`), t > 0 && e < a[t - 1]) throw RangeError(`${r}.knots must not decrease; knots[${t}] ${e} is below knots[${t - 1}] ${a[t - 1]}.`);
		}), !(a[t] > a[i - 1])) throw RangeError(`${r}.knots must rise between knots[${i - 1}] and knots[${t}]; the curve is defined only there.`);
		let e = 1;
		for (let t = 1; t < a.length; t += 1) if (e = a[t] === a[t - 1] ? e + 1 : 1, e > i) throw RangeError(`${r}.knots repeats ${a[t]} more than order ${i} times (at knots[${t}]). Repeat a knot at most ${i} times.`);
		if (!(a[t] > a[t - 1])) throw RangeError(`${r}.knots[${t}] must be above knots[${t - 1}]; the curve's last span would have no width. Raise knots[${t}] or lower knots[${t - 1}].`);
	}
	return {
		order: i,
		knots: a && [...a],
		knotMode: o
	};
}
function Et(e, t) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw TypeError(`${t} must be an object with points or shape.`);
	for (let n of Object.keys(e)) if (!St.includes(n)) throw TypeError(`Unknown ${t} field: ${n}. Use ${St.join(", ")}.`);
	if (e.points === void 0 == (e.shape === void 0)) throw TypeError(`${t} needs exactly one of points or shape.`);
	let { points: n, closed: r = !1, kind: i = "bezier" } = e;
	if (e.shape !== void 0) {
		if (e.closed !== void 0 || e.kind !== void 0) throw TypeError(`${t}.closed and ${t}.kind come from shape. Remove them.`);
		({points: n, closed: r, type: i} = je(e.shape));
	}
	if (typeof r != "boolean") throw RangeError("radius must be positive and closed must be boolean.");
	if (!vt.includes(i)) throw RangeError(`${t}.kind must be one of ${vt.join(", ")}.`);
	if (!Array.isArray(n) || n.length < (r ? 3 : 2) || n.length > bt) throw RangeError(`${t === "points" ? "points" : `${t}.points`} needs ${r ? 3 : 2} to ${bt} entries.`);
	for (let n of [
		"weights",
		"order",
		"knots",
		"knotMode"
	]) if (i !== "nurbs" && e[n] !== void 0) throw TypeError(`${t}.${n} is not allowed here: weights apply to kind nurbs only, as do order, knots and knotMode.`);
	let a = i === "bezier" ? n.map(lt) : n.map((e) => J(e, "point")), o = i === "nurbs" ? wt(e.weights, n.length, `${t}.weights`) : void 0, s = i === "nurbs" ? Tt(e, n.length, r, t) : void 0;
	return {
		type: i,
		closed: r,
		points: a,
		weights: o,
		basis: s,
		trim: Ct(e.trim, `${t}.trim`)
	};
}
function Dt(e) {
	if (e.length === 1) return e[0];
	let t = e.reduce((e, t) => e + t.positions.length / 3, 0), n = e.reduce((e, t) => e + t.indices.length, 0), r = {
		positions: new Float32Array(t * 3),
		normals: new Float32Array(t * 3),
		uvs: new Float32Array(t * 2),
		indices: new Uint32Array(n)
	}, i = 0, a = 0;
	for (let t of e) r.positions.set(t.positions, i * 3), r.normals.set(t.normals, i * 3), r.uvs.set(t.uvs, i * 2), t.indices.forEach((e, t) => {
		r.indices[a + t] = e + i;
	}), i += t.positions.length / 3, a += t.indices.length;
	return r;
}
function Ot(e, t = {}, n = "splines[0]") {
	let { maxVertices: r = W } = t, i = $(e, t, n);
	Y(i.vertexCount, r);
	let { resolved: a, radius: o, profilePoints: s, taperFactors: c, radialSegments: l, resolution: u } = i;
	return X(Dt(a.map((e) => {
		let t = Re(e, u), n = e.closed;
		return e.trim && (t = Be(t, n, e.trim), n = !1), xe({
			...t,
			closed: n,
			radius: o,
			taper: c,
			profile: s,
			radialSegments: l
		});
	})), r);
}
function kt(e, t = {}) {
	return $(e, t, "splines[0]").vertexCount;
}
function $(e, { radius: t = .05, taper: n, profile: r, resolution: i = 12, radialSegments: a = 8 }, o, s = !1) {
	if (t = G(t, "radius"), t <= 0) throw RangeError("radius must be positive and closed must be boolean.");
	if (K(i, 1, 64, "resolution"), K(a, 3, 128, "radialSegments"), !Array.isArray(e) || e.length < 1 || e.length > yt) throw RangeError(`splines needs 1 to ${yt} entries.`);
	let c = e.map((e, t) => Et(e, t === 0 ? o : `splines[${t}]`)), l = c.reduce((e, t) => e + t.points.length, 0);
	if (l > xt) throw RangeError(`splines hold ${l} points in all; at most ${xt}. Remove points or splines.`);
	let u = r === void 0 ? null : q(r, 2, 3, "profile");
	if (u && u.length > 256) throw RangeError("profile needs 3 to 256 points.");
	let d = u ? u.length : a, f = ut(n);
	return {
		resolved: c,
		vertexCount: c.reduce((e, t) => {
			let n = ze(t, i), r = !!t.trim || s;
			return e + (n + (s ? +!!t.closed : t.trim ? 3 : +!!t.closed)) * d * 2 + (t.closed && !r ? 0 : 2 * (d + 1));
		}, 0),
		radius: t,
		profilePoints: u,
		taperFactors: f,
		radialSegments: a,
		resolution: i
	};
}
var At = St;
function jt(e) {
	if (e.splines === void 0) return {
		splines: [Object.fromEntries(At.map((t) => [t, e[t]]))],
		label: "points"
	};
	for (let t of At) if (e[t] !== void 0) throw TypeError(`${t} cannot be used with splines. Put ${t} inside a splines entry.`);
	return {
		splines: e.splines,
		label: "splines[0]"
	};
}
function Mt(e, t) {
	let { splines: n, label: r } = jt(e);
	return e.grow === void 0 ? Ot(n, {
		...e,
		maxVertices: t
	}, r) : zt(n, {
		...e,
		maxVertices: t
	}, r);
}
var Nt = [
	"name",
	"steps",
	"value"
], Pt = 16, Ft = 2e6, It = .01;
function Lt(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw TypeError("grow must be an object such as { \"name\": \"vine\", \"steps\": 8 }.");
	for (let t of Object.keys(e)) if (!Nt.includes(t)) throw TypeError(`Unknown grow field: ${t}. Use ${Nt.join(", ")}.`);
	if (typeof e.name != "string" || !e.name.trim() || e.name.length > 64) throw TypeError("grow.name must be 1 to 64 characters, such as \"vine\". A motion track { kind: \"morph\", id: <name>, property: \"weight\" } animates it.");
	let t = e.steps ?? 8;
	K(t, 2, Pt, "grow.steps");
	let n = G(e.value ?? 1, "grow.value");
	if (n < 0 || n > 1) throw RangeError("grow.value must be from 0 to 1 (0 is a bare root, 1 the whole curve).");
	return {
		name: e.name,
		steps: t,
		value: n
	};
}
function Rt(e, t) {
	let { resolved: n, radius: r, profilePoints: i, taperFactors: a, radialSegments: o, resolution: s } = e;
	return Dt(n.map((e) => {
		if (e.trim?.length) throw TypeError("grow works with a trim in factors (length false), not lengths. Remove trim.length.");
		let n = e.trim?.start ?? 0, c = n + ((e.trim?.end ?? 1) - n) * t, l = Math.max(2, ze(e, s) + +!!e.closed);
		return xe({
			...Ve(Be(Re(e, s), e.closed, {
				start: n,
				end: c
			}), l),
			closed: !1,
			radius: r,
			taper: a,
			profile: i,
			radialSegments: o
		});
	}));
}
function zt(e, t, n) {
	let r = Lt(t.grow), i = $(e, t, n, !0);
	if (i.vertexCount * r.steps > Ft) throw RangeError(`grow needs ${i.vertexCount * r.steps} morph vertices; at most ${Ft}. Lower grow.steps, resolution or radialSegments.`);
	let a = t.maxVertices ?? W, o = X(Rt(i, It), a);
	return o.morphTargets = Array.from({ length: r.steps }, (e, t) => {
		let n = X(Rt(i, Math.max((t + 1) / r.steps, It)), a);
		return {
			positions: n.positions.map((e, t) => e - o.positions[t]),
			normals: n.normals.map((e, t) => e - o.normals[t])
		};
	}), o.morphTargetNames = o.morphTargets.map((e, t) => `${r.name}#${t + 1}`), o.morphTargetValues = Float32Array.from(Bt(r.steps, r.value)), o.morphGrowth = Object.freeze(r), o;
}
function Bt(e, t) {
	let n = Math.min(Math.max(t, 0), 1) * e;
	return Array.from({ length: e }, (e, t) => Math.max(0, 1 - Math.abs(n - (t + 1))));
}
function Vt(e) {
	let { splines: t, label: n } = jt(e);
	return e.grow !== void 0 && Lt(e.grow), $(t, e, n, e.grow !== void 0).vertexCount;
}
function Ht(e, { closed: t = !1, kind: n, weights: r, order: i, knots: a, knotMode: o, trim: s, radius: c, taper: l, profile: u, resolution: d, radialSegments: f, maxVertices: p } = {}) {
	return Ot([{
		points: e,
		closed: t,
		kind: n,
		weights: r,
		order: i,
		knots: a,
		knotMode: o,
		trim: s
	}], {
		radius: c,
		taper: l,
		profile: u,
		resolution: d,
		radialSegments: f,
		maxVertices: p
	}, "points");
}
function Ut(e, { radius: t = .1, segments: n = 64, radialSegments: r = 12, closed: i = !1, maxVertices: a = W } = {}) {
	if (t = G(t, "radius"), t <= 0 || typeof i != "boolean") throw RangeError("radius must be positive and closed must be boolean.");
	K(n, 3, 2048, "segments"), K(r, 3, 128, "radialSegments");
	let o = q(e, 3, i ? 3 : 2, "path");
	if (i && o[0].every((e, t) => e === o.at(-1)[t]) && o.pop(), o.length < (i ? 3 : 2)) throw RangeError("The path has too few distinct points.");
	return Y((n + 1) * (r + 1), a), X(re(o, i, t, n, r), a);
}
function Wt(e, t = W) {
	return rt(e), X(ct(e), t);
}
export { kt as a, Bt as c, Ut as d, it as f, Ot as i, dt as l, Mt as n, _t as o, Vt as r, Lt as s, Ht as t, Wt as u };
