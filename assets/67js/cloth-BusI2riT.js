/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
// src/soft-body.js
var e = Object.freeze({
	maxPressure: 3,
	rotationIterations: 20
});
function t(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r = 0; r < e.length; r += 3) for (let i = 0; i < 3; i++) {
		let a = e[r + i], o = e[r + (i + 1) % 3], s = a < o ? a * t + o : o * t + a;
		n.set(s, (n.get(s) ?? 0) + 1);
	}
	for (let [e, r] of n) if (r !== 2) {
		let n = Math.floor(e / t), i = e - n * t;
		throw RangeError(`Cloth softBody.pressure needs a closed mesh, but the edge between particles ${n} and ${i} is used by ${r} triangle(s). Close the holes, or set pressure to 0 and keep only shape matching.`);
	}
}
function n(e, t) {
	let n = 0;
	for (let r = 0; r < t.length; r += 3) {
		let i = t[r] * 3, a = t[r + 1] * 3, o = t[r + 2] * 3;
		n += (e[i] * (e[a + 1] * e[o + 2] - e[a + 2] * e[o + 1]) + e[i + 1] * (e[a + 2] * e[o] - e[a] * e[o + 2]) + e[i + 2] * (e[a] * e[o + 1] - e[a + 1] * e[o])) / 6;
	}
	return n;
}
function r(e, t, n, r, i, a) {
	a.fill(0);
	let o = 0;
	for (let n = 0; n < t.length; n += 3) {
		let r = t[n] * 3, i = t[n + 1] * 3, s = t[n + 2] * 3, c = e[i + 1] * e[s + 2] - e[i + 2] * e[s + 1], l = e[i + 2] * e[s] - e[i] * e[s + 2], u = e[i] * e[s + 1] - e[i + 1] * e[s], d = e[s + 1] * e[r + 2] - e[s + 2] * e[r + 1], f = e[s + 2] * e[r] - e[s] * e[r + 2], p = e[s] * e[r + 1] - e[s + 1] * e[r], m = e[r + 1] * e[i + 2] - e[r + 2] * e[i + 1], h = e[r + 2] * e[i] - e[r] * e[i + 2], g = e[r] * e[i + 1] - e[r + 1] * e[i];
		o += (e[r] * c + e[r + 1] * l + e[r + 2] * u) / 6, a[r] += c / 6, a[r + 1] += l / 6, a[r + 2] += u / 6, a[i] += d / 6, a[i + 1] += f / 6, a[i + 2] += p / 6, a[s] += m / 6, a[s + 1] += h / 6, a[s + 2] += g / 6;
	}
	let s = 0;
	for (let e = 0; e < n.length; e++) {
		let t = e * 3;
		s += n[e] * (a[t] ** 2 + a[t + 1] ** 2 + a[t + 2] ** 2);
	}
	if (s < 1e-18) return;
	let c = -(o - i * r) / s;
	for (let t = 0; t < n.length; t++) {
		let r = n[t] * c;
		r !== 0 && (e[t * 3] += a[t * 3] * r, e[t * 3 + 1] += a[t * 3 + 1] * r, e[t * 3 + 2] += a[t * 3 + 2] * r);
	}
}
function i(e, t) {
	let [n, r, i, a] = e;
	t[0] = 1 - 2 * (r * r + i * i), t[1] = 2 * (n * r - i * a), t[2] = 2 * (n * i + r * a), t[3] = 2 * (n * r + i * a), t[4] = 1 - 2 * (n * n + i * i), t[5] = 2 * (r * i - n * a), t[6] = 2 * (n * i - r * a), t[7] = 2 * (r * i + n * a), t[8] = 1 - 2 * (n * n + r * r);
}
function a(t, n, r) {
	for (let a = 0; a < e.rotationIterations; a++) {
		i(n, r);
		let e = 0, a = 0, o = 0, s = 0;
		for (let n = 0; n < 3; n++) {
			let i = r[n], c = r[3 + n], l = r[6 + n], u = t[n], d = t[3 + n], f = t[6 + n];
			e += c * f - l * d, a += l * u - i * f, o += i * d - c * u, s += i * u + c * d + l * f;
		}
		let c = 1 / (Math.abs(s) + 1e-9), l = e * c, u = a * c, d = o * c, f = Math.hypot(l, u, d);
		if (f < 1e-9) break;
		let p = Math.sin(f / 2) / f, m = l * p, h = u * p, g = d * p, _ = Math.cos(f / 2), [v, y, b, x] = n;
		n[0] = _ * v + m * x + h * b - g * y, n[1] = _ * y - m * b + h * x + g * v, n[2] = _ * b + m * y - h * v + g * x, n[3] = _ * x - m * v - h * y - g * b;
		let S = Math.hypot(n[0], n[1], n[2], n[3]);
		for (let e = 0; e < 4; e++) n[e] /= S;
	}
	i(n, r);
}
function o(e) {
	let t = e.length / 3, n = [
		0,
		0,
		0
	];
	for (let r = 0; r < t; r++) for (let i = 0; i < 3; i++) n[i] += e[r * 3 + i] / t;
	let r = new Float64Array(e.length);
	for (let i = 0; i < t; i++) for (let t = 0; t < 3; t++) r[i * 3 + t] = e[i * 3 + t] - n[t];
	return {
		offsets: r,
		quaternion: [
			0,
			0,
			0,
			1
		],
		matrix: /* @__PURE__ */ new Float64Array(9),
		covariance: /* @__PURE__ */ new Float64Array(9)
	};
}
function s(e, t, n, r) {
	let { offsets: i, quaternion: o, matrix: s, covariance: c } = e, l = t.length / 3, u = [
		0,
		0,
		0
	];
	for (let e = 0; e < l; e++) for (let n = 0; n < 3; n++) u[n] += t[e * 3 + n] / l;
	c.fill(0);
	for (let e = 0; e < l; e++) for (let n = 0; n < 3; n++) {
		let r = t[e * 3 + n] - u[n];
		for (let t = 0; t < 3; t++) c[n * 3 + t] += r * i[e * 3 + t];
	}
	a(c, o, s);
	for (let e = 0; e < l; e++) if (n[e] !== 0) for (let n = 0; n < 3; n++) {
		let a = u[n] + s[n * 3] * i[e * 3] + s[n * 3 + 1] * i[e * 3 + 1] + s[n * 3 + 2] * i[e * 3 + 2];
		t[e * 3 + n] += (a - t[e * 3 + n]) * r;
	}
}
// src/cloth-self-collision.js
var c = Object.freeze({
	maxParticles: 2e3,
	workPerParticle: 10
});
function l(e, t, n) {
	return Math.imul(e, 73856093) ^ Math.imul(t, 19349663) ^ Math.imul(n, 83492791) | 0;
}
function u(e, t) {
	let n = /* @__PURE__ */ new Set();
	for (let r = 0; r < e.stretchCount; r++) {
		let i = e.firsts[r], a = e.seconds[r];
		n.add(i < a ? i * t + a : a * t + i);
	}
	return n;
}
function d(e) {
	let t = Infinity;
	for (let n = 0; n < e.stretchCount; n++) t = Math.min(t, e.restLengths[n]);
	return t / 2;
}
function f(e, t, n) {
	let r = e * 2, i = /* @__PURE__ */ new Map(), a = new Int32Array(t * 3);
	return {
		build(e) {
			i.clear();
			for (let n = 0; n < t; n++) {
				let t = Math.floor(e[n * 3] / r), o = Math.floor(e[n * 3 + 1] / r), s = Math.floor(e[n * 3 + 2] / r);
				a[n * 3] = t, a[n * 3 + 1] = o, a[n * 3 + 2] = s;
				let c = l(t, o, s), u = i.get(c);
				u ? u.push(n) : i.set(c, [n]);
			}
		},
		solve(r, o) {
			let s = e * 2;
			for (let e = 0; e < t; e++) {
				let c = a[e * 3], u = a[e * 3 + 1], d = a[e * 3 + 2];
				for (let a = -1; a <= 1; a++) for (let f = -1; f <= 1; f++) for (let m = -1; m <= 1; m++) {
					let h = i.get(l(c + a, u + f, d + m));
					if (h) for (let i of h) i <= e || n.has(e * t + i) || p(r, o, e, i, s);
				}
			}
		}
	};
}
function p(e, t, n, r, i) {
	let a = n * 3, o = r * 3, s = e[o] - e[a], c = e[o + 1] - e[a + 1], l = e[o + 2] - e[a + 2], u = s * s + c * c + l * l;
	if (u >= i * i || u < 1e-18) return;
	let d = t[n] + t[r];
	if (d === 0) return;
	let f = Math.sqrt(u), p = (i - f) / f / d;
	e[a] -= s * p * t[n], e[a + 1] -= c * p * t[n], e[a + 2] -= l * p * t[n], e[o] += s * p * t[r], e[o + 1] += c * p * t[r], e[o + 2] += l * p * t[r];
}
// src/cloth.js
var m = Object.freeze({
	maxParticles: 5e3,
	maxFrameParticles: 3e6,
	maxWork: 15e7,
	substeps: 4,
	iterations: 8
}), h = 1.2, g = 5, _ = Object.freeze([
	0,
	-9.81,
	0
]);
function v(e, t) {
	let n = /* @__PURE__ */ new Map(), r = new Uint32Array(e.length / 3), i = [];
	for (let t = 0; t < r.length; t++) {
		let a = t * 3, o = `${e[a].toFixed(g)},${e[a + 1].toFixed(g)},${e[a + 2].toFixed(g)}`, s = n.get(o);
		s === void 0 && (s = i.length, n.set(o, s), i.push(t)), r[t] = s;
	}
	let a = [];
	for (let e = 0; e < t.length; e += 3) {
		let n = r[t[e]], i = r[t[e + 1]], o = r[t[e + 2]];
		n !== i && i !== o && n !== o && a.push(n, i, o);
	}
	return {
		particleOfVertex: r,
		representatives: i,
		triangles: Uint32Array.from(a)
	};
}
function y(e, t, n) {
	return e < t ? e * n + t : t * n + e;
}
function b(e, t) {
	return t > 0 ? Math.min(t, e) : e * .9;
}
function x(e, t, n, r, i, a = null) {
	let o = /* @__PURE__ */ new Map();
	for (let e = 0; e < t.length; e += 3) for (let r = 0; r < 3; r++) {
		let i = t[e + r], a = t[e + (r + 1) % 3], s = t[e + (r + 2) % 3], c = y(i, a, n), l = o.get(c) ?? {
			first: Math.min(i, a),
			second: Math.max(i, a),
			opposites: []
		};
		l.opposites.push(s), o.set(c, l);
	}
	let s = [], c = [], l = [], u = (e, t, n) => {
		s.push(e), c.push(t), l.push(n);
	}, d = [...o.entries()].sort((e, t) => e[0] - t[0]);
	for (let [, e] of d) u(e.first, e.second, i);
	let f = s.length, p = new Int32Array(f).fill(-1);
	r > 0 && d.forEach(([, e], t) => {
		e.opposites.length === 2 && e.opposites[0] !== e.opposites[1] && (p[t] = s.length, u(e.opposites[0], e.opposites[1], r));
	});
	let m = new Float64Array(s.length);
	for (let t = 0; t < s.length; t++) {
		a && (l[t] *= Math.min(a[s[t]], a[c[t]]));
		let n = s[t] * 3, r = c[t] * 3;
		m[t] = Math.hypot(e[n] - e[r], e[n + 1] - e[r + 1], e[n + 2] - e[r + 2]);
	}
	return {
		count: s.length,
		stretchCount: f,
		bendOfEdge: p,
		firsts: Uint32Array.from(s),
		seconds: Uint32Array.from(c),
		stiffnesses: Float64Array.from(l),
		restLengths: m
	};
}
function S(e, t, n) {
	let r = new Float64Array(n);
	for (let n = 0; n < t.length; n += 3) {
		let i = C(e, t[n], t[n + 1], t[n + 2], [
			0,
			0,
			0
		]) / 2;
		for (let e = 0; e < 3; e++) r[t[n + e]] += i / 3;
	}
	return r;
}
function C(e, t, n, r, i) {
	let a = t * 3, o = n * 3, s = r * 3, c = [
		e[o] - e[a],
		e[o + 1] - e[a + 1],
		e[o + 2] - e[a + 2]
	], l = [
		e[s] - e[a],
		e[s + 1] - e[a + 1],
		e[s + 2] - e[a + 2]
	], u = c[1] * l[2] - c[2] * l[1], d = c[2] * l[0] - c[0] * l[2], f = c[0] * l[1] - c[1] * l[0], p = Math.sqrt(u * u + d * d + f * f);
	return p > 0 && (i[0] = u / p, i[1] = d / p, i[2] = f / p), p;
}
function w(e, t, n, r, i, a) {
	let { positions: o, velocities: s, particleCount: c } = e, l = e.windScratch;
	l.fill(0);
	let u = [
		0,
		0,
		0
	];
	for (let e = 0; e < r.length; e += 3) {
		let n = r[e], i = r[e + 1], a = r[e + 2], c = C(o, n, i, a, u);
		if (c === 0) continue;
		let d = 0;
		for (let e = 0; e < 3; e++) {
			let r = (s[n * 3 + e] + s[i * 3 + e] + s[a * 3 + e]) / 3;
			d += (t[e] - r) * u[e];
		}
		let f = .5 * h * d * Math.abs(d) * c / 2 / 3;
		for (let e of [
			n,
			i,
			a
		]) for (let t = 0; t < 3; t++) l[e * 3 + t] += f * u[t];
	}
	for (let e = 0; e < c; e++) {
		let t = Math.max(n[e], 1e-9) * a;
		for (let n = 0; n < 3; n++) s[e * 3 + n] += l[e * 3 + n] / t * i;
	}
}
function T(e, t, n, r, i) {
	let { count: a, firsts: o, seconds: s, stiffnesses: c, restLengths: l } = n;
	for (let n = 0; n < a; n++) {
		if (c[n] === 0) continue;
		let a = o[n], u = s[n], d = t[a] + t[u];
		if (d === 0) continue;
		let f = a * 3, p = u * 3, m = e[p] - e[f], h = e[p + 1] - e[f + 1], g = e[p + 2] - e[f + 2], _ = Math.sqrt(m * m + h * h + g * g);
		if (_ < 1e-12) continue;
		let v = c[n] * (_ - l[n]) / d, y = v / _;
		r[n] += v, t[a] === 0 && (i[f] += m * y, i[f + 1] += h * y, i[f + 2] += g * y), t[u] === 0 && (i[p] -= m * y, i[p + 1] -= h * y, i[p + 2] -= g * y), e[f] += m * y * t[a], e[f + 1] += h * y * t[a], e[f + 2] += g * y * t[a], e[p] -= m * y * t[u], e[p + 1] -= h * y * t[u], e[p + 2] -= g * y * t[u];
	}
}
function E(e, t, n, r) {
	let i = e[0] - t.center[0], a = e[1] - t.center[1], o = e[2] - t.center[2], s = Math.sqrt(i * i + a * a + o * o), c = t.radius + n;
	if (s >= c) return !1;
	s > 1e-12 ? (r[0] = i / s, r[1] = a / s, r[2] = o / s) : (r[0] = 0, r[1] = 1, r[2] = 0);
	for (let n = 0; n < 3; n++) e[n] = t.center[n] + r[n] * c;
	return !0;
}
var D = {
	center: [
		0,
		0,
		0
	],
	radius: 0
};
function O(e, t, n, r) {
	let { start: i, end: a } = t, o = a[0] - i[0], s = a[1] - i[1], c = a[2] - i[2], l = o * o + s * s + c * c, u = (e[0] - i[0]) * o + (e[1] - i[1]) * s + (e[2] - i[2]) * c, d = l > 0 ? Math.min(Math.max(u / l, 0), 1) : 0, f = i[0] + o * d, p = i[1] + s * d, m = i[2] + c * d, h = t.radius + n, g = e[0] - f, _ = e[1] - p, v = e[2] - m;
	return g * g + _ * _ + v * v >= h * h ? !1 : (D.center[0] = f, D.center[1] = p, D.center[2] = m, D.radius = t.radius, E(e, D, n, r));
}
function k(e, t, n, r) {
	let { center: i, axes: a, halfExtents: o } = t, s = [
		e[0] - i[0],
		e[1] - i[1],
		e[2] - i[2]
	], c = a.map((e) => s[0] * e[0] + s[1] * e[1] + s[2] * e[2]), l = c.map((e, t) => Math.min(Math.max(e, -o[t]), o[t])), u = c.map((e, t) => e - l[t]), d = Math.hypot(...u), f = [...c], p = [
		0,
		0,
		0
	];
	if (d > 1e-12) {
		if (d >= n) return !1;
		for (let e = 0; e < 3; e++) p[e] = u[e] / d, f[e] = l[e] + p[e] * n;
	} else {
		let e = 0;
		for (let t = 1; t < 3; t++) o[t] - Math.abs(c[t]) < o[e] - Math.abs(c[e]) && (e = t);
		let t = c[e] >= 0 ? 1 : -1;
		p[e] = t, f[e] = t * (o[e] + n);
	}
	for (let t = 0; t < 3; t++) {
		r[t] = 0, e[t] = i[t];
		for (let n = 0; n < 3; n++) r[t] += a[n][t] * p[n], e[t] += a[n][t] * f[n];
	}
	return !0;
}
var A = {
	ball: E,
	capsule: O,
	box: k
};
function j(e, t, n, r, i, a) {
	let { positions: o, inverseMasses: s, particleCount: c } = e, l = [
		0,
		0,
		0
	], u = [
		0,
		0,
		0
	];
	for (let e = 0; e < c; e++) {
		if (s[e] === 0) continue;
		let c = e * 3;
		l[0] = o[c], l[1] = o[c + 1], l[2] = o[c + 2];
		for (let e of n) {
			if (!A[e.kind](l, e, r, u)) continue;
			a && (a[c] = u[0], a[c + 1] = u[1], a[c + 2] = u[2]);
			let n = [
				l[0] - t[c],
				l[1] - t[c + 1],
				l[2] - t[c + 2]
			], o = n[0] * u[0] + n[1] * u[1] + n[2] * u[2];
			for (let e = 0; e < 3; e++) l[e] -= (n[e] - o * u[e]) * i;
		}
		o[c] = l[0], o[c + 1] = l[1], o[c + 2] = l[2];
	}
}
var M = .5;
function N(e, t) {
	let n = [
		0,
		0,
		0
	], r = 0;
	return function(i, a, o, s) {
		n.fill(0);
		for (let e = 0; e < t * 3; e += 3) for (let t = 0; t < 3; t++) n[t] += s[e + t];
		let c = Math.hypot(n[0], n[1], n[2]);
		if (c < 1e-9) {
			r = 0;
			return;
		}
		for (let e = 0; e < 3; e++) n[e] /= c;
		let l = 0, u = 0, d = 0;
		for (let e = 0; e < t; e++) {
			if (o[e] === 0) continue;
			let t = e * 3;
			l++;
			for (let e = 0; e < 3; e++) u += a[t + e] * n[e], d += i[t + e] * n[e];
		}
		if (l === 0) return;
		r = Math.max(r, -u / l);
		let f = d / l;
		if (f < 0 || r < M) return;
		let p = e * r - f;
		if (r = 0, !(p <= 0)) {
			for (let e = 0; e < t; e++) if (o[e] !== 0) for (let t = 0; t < 3; t++) i[e * 3 + t] += n[t] * p;
		}
	};
}
var P = 7;
function F(e, t, n) {
	let r = [];
	for (let i = 0; i < n; i++) {
		let n = t + i * P;
		r.push({
			kind: "capsule",
			start: e.subarray(n, n + 3),
			end: e.subarray(n + 3, n + 6),
			radius: e[n + 6]
		});
	}
	return r;
}
function I(e, t, n, r) {
	let { anchorParticles: i, anchorWeights: a } = t;
	for (let t = 0; t < i.length; t++) {
		let o = a[t];
		if (!(r && o >= 1)) for (let r = 0; r < 3; r++) {
			let a = i[t] * 3 + r;
			e[a] += (n[t * 3 + r] - e[a]) * o;
		}
	}
}
function L(e, t, n, r, i, a = 0) {
	let o = i * m.substeps * (m.iterations * (t + a) + n + e * (r + 1));
	if (e > m.maxParticles) throw RangeError(`Cloth has ${e} particles; the limit is ${m.maxParticles}. Use a coarser grid.`);
	if (e * i > m.maxFrameParticles) throw RangeError(`Cloth would record ${e * i} particle positions; the limit is ${m.maxFrameParticles}. Use a shorter duration or a coarser grid.`);
	if (o > m.maxWork) throw RangeError(`Cloth needs ${Math.round(o)} solver operations; the limit is ${m.maxWork}. Use a shorter duration or a coarser grid.`);
}
function R(e, t) {
	if (e == null) return null;
	if (e.length !== t) throw RangeError(`Cloth stiffnessWeights has ${e.length} numbers; pass one 0 to 1 weight per particle (${t}).`);
	for (let t of e) if (!(t >= 0 && t <= 1)) throw RangeError(`Cloth stiffnessWeights must all be between 0 and 1; found ${t}.`);
	return e;
}
function z(e, t, n) {
	if (!Number.isFinite(e) || e < 0 || e > n) throw RangeError(`Cloth ${t} must be a number from 0 to ${n}; found ${e}.`);
	return e;
}
function B(i, a, l, p, h) {
	let g = i.softBody ?? null, _ = i.selfCollision ?? null, v = 0, y = 0, x = 0, S = 0, C = null, w = null;
	g && (v = z(g.shape ?? .2, "softBody.shape", 1), y = z(g.pressure ?? 1, "softBody.pressure", e.maxPressure), x = z(g.bounce ?? 0, "softBody.bounce", 1), v > 0 && (C = o(a)), y > 0 && (t(l, p), S = n(a, l), w = new Float64Array(a.length)));
	let T = null;
	if (_) {
		if (p > c.maxParticles) throw RangeError(`Cloth selfCollision handles ${c.maxParticles} particles at most; this sheet has ${p}. Use a coarser grid or drop selfCollision.`);
		let e = d(h), t = _ === !0 ? b(e, i.thickness) : _.radius;
		if (!(t > 0 && t <= e)) throw RangeError(`Cloth selfCollision.radius must be above 0 and at most ${e.toPrecision(4)} (half the shortest edge); found ${t}. Use a smaller radius or true.`);
		T = f(t, p, u(h, p));
	}
	return {
		bounce: x,
		workPerIteration: (T ? c.workPerParticle * p : 0) + (y > 0 ? l.length / 3 : 0) + (C ? p / m.iterations : 0),
		beforeIterations(e, t) {
			C && s(C, e, t, v), T?.build(e);
		},
		duringIteration(e, t) {
			y > 0 && r(e, l, t, S, y, w), T?.solve(e, t);
		}
	};
}
function V(e, t) {
	let { inverseMasses: n, pinned: r, trackFixed: i, extraMasses: a, baseMass: o } = e;
	n[t] = r[t] || i[t] ? 0 : o / (o + a[t]);
}
function H(e, t) {
	let { constraints: n, broken: r } = e;
	if (n.stiffnesses[t] === 0) return;
	let i = n.bendOfEdge[t];
	for (let [e, a] of [[t, "stretch"], [i, "bend"]]) e < 0 || n.stiffnesses[e] === 0 || (n.stiffnesses[e] = 0, r.push(Object.freeze({
		constraint: e,
		first: n.firsts[e],
		second: n.seconds[e],
		kind: a
	})));
}
function U(e, t) {
	let { constraints: n, positions: r, tearStretch: i, tearForce: a, baseMass: o, impulses: s } = e, { firsts: c, seconds: l, stiffnesses: u, restLengths: d, stretchCount: f } = n, p = o / (t * t);
	for (let t = 0; t < f; t++) {
		if (u[t] === 0) continue;
		let n = c[t] * 3, o = l[t] * 3;
		(Math.hypot(r[o] - r[n], r[o + 1] - r[n + 1], r[o + 2] - r[n + 2]) > d[t] * i || s[t] * p > a) && H(e, t);
	}
}
function W(e, t, n = {}) {
	let r = e.length / 3, i = n.colliders ?? [], a = n.moving ?? null;
	for (let e of i) if (!Object.hasOwn(A, e?.kind ?? "")) throw TypeError(`Cloth collider kind must be one of ${Object.keys(A).join(", ")}.`);
	for (let e of n.pinned ?? []) if (!Number.isInteger(e) || e < 0 || e >= r) throw RangeError(`Cloth pinned particle ${e} does not exist; there are ${r}.`);
	let o = R(n.stiffnessWeights, r), s = x(e, t, r, n.bend ?? .1, n.stiffness ?? .9, o), c = B(n, e, t, r, s);
	L(r, s.count, t.length / 3, i.length + (a?.colliderCount ?? 0), n.frameCount ?? 1, c.workPerIteration);
	let l = n.density ?? .2, u = S(e, t, r), d = u.reduce((e, t) => e + t, 0), f = {
		constraints: s,
		baseMass: Math.max(d * l / r, 1e-9),
		inverseMasses: new Float64Array(r).fill(1),
		extraMasses: new Float64Array(r),
		pinned: new Uint8Array(r),
		trackFixed: new Uint8Array(r),
		pinTargets: Float64Array.from(e),
		pinForces: new Float64Array(e.length),
		impulses: new Float64Array(s.count),
		broken: [],
		positions: Float64Array.from(e),
		tearStretch: n.tearStretch ?? Infinity,
		tearForce: n.tearForce ?? Infinity
	};
	for (let e of n.pinned ?? []) f.pinned[e] = 1;
	a?.anchorParticles.forEach((e, t) => {
		a.anchorWeights[t] >= 1 && (f.trackFixed[e] = 1);
	});
	for (let e = 0; e < r; e++) V(f, e);
	let p = {
		particleCount: r,
		inverseMasses: f.inverseMasses,
		positions: f.positions,
		velocities: new Float64Array(e.length),
		windScratch: new Float64Array(e.length)
	}, h = n.gravity ?? _, g = n.damping ?? .3, v = n.friction ?? .3, y = n.thickness ?? .01, b = new Float64Array(e.length), C = c.bounce > 0 ? new Float64Array(e.length) : null, E = c.bounce > 0 ? N(c.bounce, r) : null, D = c.bounce > 0 ? new Float64Array(e.length) : null, O = new Float64Array(e.length), k = new Float64Array(e.length), M = Float32Array.from(e), z = (a?.anchorParticles.length ?? 0) * 3, W = (a?.colliderCount ?? 0) * P, G = 0;
	function K(o, d = {}) {
		let _ = d.wind ?? n.wind ?? [
			0,
			0,
			0
		], x = _.some((e) => e !== 0), S = d.colliders ?? i, A = m.substeps, N = o / A, P = Math.exp(-g * N), L = f.tearStretch !== Infinity || f.tearForce !== Infinity, { inverseMasses: R, pinned: B, pinTargets: V } = f;
		O.set(p.positions), k.fill(0);
		for (let i = 0; i < A; i++) {
			x && w(p, _, u, t, N, l), n.applyFields?.(p.positions, p.velocities, G * N, N), b.set(p.positions);
			let o = S, d = null;
			a && (d = a.anchorTrack.subarray(G * z, (G + 1) * z), o = S.concat(F(a.colliderTrack, G * W, a.colliderCount)), I(p.positions, a, d, !1));
			let g = (i + 1) / A;
			for (let e = 0; e < r; e++) {
				if (B[e]) for (let t = 0; t < 3; t++) {
					let n = e * 3 + t;
					p.positions[n] = O[n] + (V[n] - O[n]) * g;
				}
				if (R[e] !== 0) for (let t = 0; t < 3; t++) {
					let n = e * 3 + t;
					p.velocities[n] += h[t] * N, p.positions[n] += p.velocities[n] * N;
				}
			}
			C && (C.fill(0), D.set(p.velocities)), c.beforeIterations(p.positions, R);
			for (let e = 0; e < m.iterations; e++) T(p.positions, R, s, f.impulses, k), c.duringIteration(p.positions, R), a && I(p.positions, a, d, !0), j(p, b, o, y, v, C);
			L && U(f, N), f.impulses.fill(0);
			for (let t = 0; t < e.length; t++) p.velocities[t] = (p.positions[t] - b[t]) / N * P;
			E && E(p.velocities, D, R, C), G++;
		}
		if (!p.positions.every(Number.isFinite)) throw RangeError("Cloth became unstable (non-finite positions). Lower the wind, raise density or use a finer grid.");
		let H = f.baseMass / (A * N * N);
		for (let t = 0; t < e.length; t++) f.pinForces[t] = k[t] * H;
		M.set(p.positions);
	}
	function q(e) {
		if (!Number.isInteger(e) || e < 0 || e >= r) throw RangeError(`Cloth particle ${e} does not exist; there are ${r}.`);
	}
	return {
		positions: M,
		particleCount: r,
		constraintCount: s.count,
		particleMass: f.baseMass,
		broken: f.broken,
		step: K,
		pin(e, t) {
			q(e);
			let n = t ?? [
				p.positions[e * 3],
				p.positions[e * 3 + 1],
				p.positions[e * 3 + 2]
			];
			f.pinTargets[e * 3] = n[0], f.pinTargets[e * 3 + 1] = n[1], f.pinTargets[e * 3 + 2] = n[2], f.pinned[e] = 1, V(f, e);
		},
		unpin(e) {
			q(e), f.pinned[e] = 0, V(f, e);
		},
		isPinned(e) {
			return q(e), f.pinned[e] === 1;
		},
		pinForce(e, t = [
			0,
			0,
			0
		]) {
			return q(e), t[0] = f.pinForces[e * 3], t[1] = f.pinForces[e * 3 + 1], t[2] = f.pinForces[e * 3 + 2], t;
		},
		setExtraMass(e, t) {
			q(e), f.extraMasses[e] = Math.max(t, 0), V(f, e);
		},
		breakConstraint(e) {
			if (!Number.isInteger(e) || e < 0 || e >= s.stretchCount) throw RangeError(`Cloth stretch constraint ${e} does not exist; there are ${s.stretchCount}.`);
			H(f, e);
		}
	};
}
function G(e, t, n) {
	let r = W(e, t, n), i = n.framesPerSecond ?? 60, a = new Float32Array(n.frameCount * e.length);
	a.set(Float32Array.from(e), 0);
	for (let t = 1; t < n.frameCount; t++) r.step(1 / i), a.set(r.positions, t * e.length);
	return Object.freeze({
		particleCount: r.particleCount,
		frameCount: n.frameCount,
		framesPerSecond: i,
		frames: a,
		constraintCount: r.constraintCount
	});
}
function K(e, t, n) {
	let r = e.particleCount * 3, i = Math.min(Math.max(t * e.framesPerSecond, 0), e.frameCount - 1), a = Math.floor(i), o = Math.min(a + 1, e.frameCount - 1), s = i - a;
	for (let t = 0; t < r; t++) {
		let i = e.frames[a * r + t], c = e.frames[o * r + t];
		n[t] = i + (c - i) * s;
	}
	return n;
}
export { v as a, K as i, G as n, W as r, m as t };
