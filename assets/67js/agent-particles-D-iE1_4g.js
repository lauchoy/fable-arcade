/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { r as e, t } from "./mat3-BUCH0Dej.js";
import { n, o as r, p as i } from "./mat4-BCZClxna.js";
import { r as a, t as o } from "./force-fields-ByNKkXEw.js";
import { t as s } from "./field-error-BpFTmyMO.js";
import { a as c, i as l, n as u, o as d, r as f, t as p } from "./agent-recipe-checks-UYhtNllK.js";
// src/particle-collision.js
var m = 1e-12;
function h(e) {
	let t = e.reduce((e, t) => e + t.indices.length / 3, 0), n = new Float64Array(t * 9), r = [], i = 0;
	for (let t of e) {
		let e = [
			Infinity,
			Infinity,
			Infinity,
			-Infinity,
			-Infinity,
			-Infinity
		], a = i;
		for (let r = 0; r < t.indices.length; r += 3) {
			let a = i * 9, [o, s, c] = [
				0,
				1,
				2
			].map((e) => t.indices[r + e] * 3);
			for (let r = 0; r < 3; r++) {
				n[a + r] = t.positions[o + r], n[a + 3 + r] = t.positions[s + r] - t.positions[o + r], n[a + 6 + r] = t.positions[c + r] - t.positions[o + r];
				for (let n of [
					o,
					s,
					c
				]) e[r] = Math.min(e[r], t.positions[n + r]), e[3 + r] = Math.max(e[3 + r], t.positions[n + r]);
			}
			i++;
		}
		r.push({
			first: a,
			end: i,
			bounds: e
		});
	}
	return Object.freeze({
		triangles: n,
		groups: r,
		triangleCount: t
	});
}
function g(e, t, n) {
	for (let r = 0; r < 3; r++) if (Math.max(t[r], n[r]) < e[r] || Math.min(t[r], n[r]) > e[3 + r]) return !0;
	return !1;
}
function _(e, t, n, r) {
	let i = n[0] - t[0], a = n[1] - t[1], o = n[2] - t[2], s = !1;
	for (let c of e.groups) if (!g(c.bounds, t, n)) for (let n = c.first; n < c.end; n++) {
		let c = n * 9, l = e.triangles[c + 3], u = e.triangles[c + 4], d = e.triangles[c + 5], f = e.triangles[c + 6], p = e.triangles[c + 7], h = e.triangles[c + 8], g = a * h - o * p, _ = o * f - i * h, v = i * p - a * f, y = l * g + u * _ + d * v;
		if (Math.abs(y) < m) continue;
		let b = t[0] - e.triangles[c], x = t[1] - e.triangles[c + 1], S = t[2] - e.triangles[c + 2], C = (b * g + x * _ + S * v) / y;
		if (C < 0 || C > 1) continue;
		let w = x * d - S * u, T = S * l - b * d, E = b * u - x * l, D = (i * w + a * T + o * E) / y;
		if (D < 0 || C + D > 1) continue;
		let O = (f * w + p * T + h * E) / y;
		if (O < 0 || O > 1 || O >= r.fraction) continue;
		let k = u * h - d * p, A = d * f - l * h, j = l * p - u * f, M = Math.hypot(k, A, j), N = k * i + A * a + j * o > 0 ? -1 : 1;
		r.fraction = O, r.normal[0] = N * k / M, r.normal[1] = N * A / M, r.normal[2] = N * j / M, r.onFloor = !1, s = !0;
	}
	return s;
}
// src/particles.js
var v = Object.freeze({
	maxSystems: 4,
	maxParticlesPerSystem: 2e3,
	maxParticles: 4e3,
	maxVertices: 1e5,
	maxLifetime: 60,
	landingIterations: 32,
	fieldStepSeconds: 1 / 120,
	maxColliders: 8,
	maxColliderTriangles: 4096,
	maxEmitterTriangles: 8192,
	maxInstances: 8
}), y = 1e-6, b = .4, x = 20, S = 1e-4, C = 2654435761;
function w(e, t) {
	let n = (Math.imul(t + 1, C) ^ Math.floor(e)) >>> 0;
	return () => {
		n = n + 1831565813 >>> 0;
		let e = Math.imul(n ^ n >>> 15, n | 1);
		return e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
function T(e, t) {
	return e[0] + (e[1] - e[0]) * t;
}
function E(e) {
	let t = Math.hypot(e[0], e[1], e[2]) || 1;
	return [
		e[0] / t,
		e[1] / t,
		e[2] / t
	];
}
function D(e, t) {
	return [
		e[1] * t[2] - e[2] * t[1],
		e[2] * t[0] - e[0] * t[2],
		e[0] * t[1] - e[1] * t[0]
	];
}
function O(e, t, n, r) {
	let i = 1 - n * (1 - Math.cos(t)), a = Math.sqrt(Math.max(0, 1 - i * i)), o = r * Math.PI * 2, s = E(D(e, Math.abs(e[1]) < .99 ? [
		0,
		1,
		0
	] : [
		1,
		0,
		0
	])), c = D(e, s);
	return [
		0,
		1,
		2
	].map((t) => e[t] * i + (s[t] * Math.cos(o) + c[t] * Math.sin(o)) * a);
}
function k(e, t) {
	let [n, r, i] = t;
	if (e.shape === "box") return e.halfExtents.map((e, n) => (t[n] * 2 - 1) * e);
	if (e.shape === "sphere") {
		let t = e.radius * Math.cbrt(n), a = r * 2 - 1, o = Math.sqrt(1 - a * a);
		return [
			t * o * Math.cos(i * Math.PI * 2),
			t * a,
			t * o * Math.sin(i * Math.PI * 2)
		];
	}
	if (e.shape === "disc") {
		let t = e.radius * Math.sqrt(n);
		return [
			t * Math.cos(r * Math.PI * 2),
			0,
			t * Math.sin(r * Math.PI * 2)
		];
	}
	return [
		0,
		0,
		0
	];
}
function A(e, t) {
	let n = e[1];
	if (n < -.9999) {
		t.set([
			1,
			0,
			0,
			0,
			-1,
			0,
			0,
			0,
			-1
		]);
		return;
	}
	let [r, i, a] = [
		e[2],
		0,
		-e[0]
	], o = 1 / (1 + n);
	t[0] = n + o * r * r, t[1] = -a + o * r * i, t[2] = i + o * r * a, t[3] = a + o * r * i, t[4] = n + o * i * i, t[5] = -r + o * i * a, t[6] = -i + o * r * a, t[7] = r + o * i * a, t[8] = n + o * a * a;
}
function j(e) {
	let { count: t, seed: n, emitter: r, lifetime: i, speed: a, direction: o, spreadRadians: s, size: c, rate: l, forces: u } = e, d = e.instanceCount ?? 1, f = e.orient ?? "none", p = r.normalSpeed ?? 0, m = e.spin ?? [0, 0], h = E(o), g = new Float64Array(t), _ = new Float64Array(t), v = new Float64Array(t * 3), y = new Float64Array(t * 3), b = new Float64Array(t), x = new Float64Array(t * 3), S = new Float64Array(t), C = new Float64Array(t), D = f === "none" ? void 0 : new Float64Array(t * 9), j = d > 1 ? new Uint8Array(t) : void 0;
	for (let e = 0; e < t; e++) {
		let t = w(n, e);
		t();
		let o = r.shape === "mesh" ? r.source.sample(t) : {
			point: k(r, [
				t(),
				t(),
				t()
			]),
			normal: null
		}, u = O(h, s, t(), t()), E = T(a, t());
		for (let t = 0; t < 3; t++) v[e * 3 + t] = r.position[t] + o.point[t], y[e * 3 + t] = u[t] * E + (o.normal ? o.normal[t] * p : 0);
		_[e] = T(i, t()), b[e] = T(c, t()), g[e] = l ? e / l : 0;
		let M = O([
			0,
			1,
			0
		], Math.PI, t(), t());
		x.set(M, e * 3), S[e] = T(m, t()) * Math.PI / 180, C[e] = t() * Math.PI * 2, j && (j[e] = Math.min(Math.floor(t() * d), d - 1)), f === "random" ? se(O([
			0,
			1,
			0
		], Math.PI, t(), t()), t() * Math.PI * 2, D.subarray(e * 9, e * 9 + 9)) : f === "normal" && A(o.normal, D.subarray(e * 9, e * 9 + 9));
	}
	let M = {
		count: t,
		birth: g,
		life: _,
		origin: v,
		velocity: y,
		size: b,
		spinAxis: x,
		spinRate: S,
		spinStart: C,
		orientation: D,
		instancePick: j,
		hasSpin: m[0] !== 0 || m[1] !== 0,
		landing: new Float64Array(t).fill(Infinity)
	};
	if (u.fields?.length || u.colliders || u.bounce > 0) return M.track = {
		position: Float64Array.from(v),
		velocity: Float64Array.from(y),
		steps: new Int32Array(t),
		resting: new Uint8Array(t),
		spin: Float64Array.from({ length: t * 2 }, (e, t) => t % 2 ? S[t >> 1] : C[t >> 1])
	}, M;
	for (let e = 0; e < t; e++) M.landing[e] = te(M, e, u);
	return M;
}
function M(e, t, n, r, i) {
	if (r < y) return e * i + .5 * t * i * i;
	let a = n + t / r;
	return a * i + (e - a) * (1 - Math.exp(-r * i)) / r;
}
function N(e, t, n, r) {
	return e.origin[t * 3 + 1] + M(e.velocity[t * 3 + 1], n.gravity[1], n.wind[1], n.drag, r);
}
function ee(e, t, n, r) {
	if (r < y) {
		let n = t === 0 ? Infinity : -e / t;
		return n > 0 ? n : Infinity;
	}
	let i = n + t / r, a = i / (i - e);
	return a > 0 && a < 1 ? -Math.log(a) / r : Infinity;
}
function te(e, t, n) {
	let r = e.life[t], i = n.floor;
	if (i === void 0 || N(e, t, n, 0) < i) return Infinity;
	let a = ee(e.velocity[t * 3 + 1], n.gravity[1], n.wind[1], n.drag), o = r;
	if (N(e, t, n, r) > i) {
		if (!(a < r) || N(e, t, n, a) > i) return Infinity;
		o = a;
	}
	let s = 0;
	for (let r = 0; r < v.landingIterations; r++) {
		let r = (s + o) / 2;
		N(e, t, n, r) > i ? s = r : o = r;
	}
	return o;
}
var P = [
	0,
	0,
	0
], F = [
	0,
	0,
	0
], I = [
	0,
	0,
	0
], L = {
	fraction: Infinity,
	normal: [
		0,
		1,
		0
	],
	onFloor: !1
};
function ne(e, t, n) {
	return L.fraction = Infinity, e.floor !== void 0 && n[1] <= e.floor && (L.fraction = t[1] > e.floor ? (t[1] - e.floor) / (t[1] - n[1]) : 0, L.normal[0] = 0, L.normal[1] = 1, L.normal[2] = 0, L.onFloor = !0), e.colliders && _(e.colliders, t, n, L), L.fraction <= 1;
}
function re(e, t, n, r, i, a, o) {
	for (let e = 0; e < 3; e++) t[e] = r[e] + (i[e] - r[e]) * L.fraction;
	if (L.onFloor && (t[1] = e.floor), !(e.bounce > 0)) return a[1] = 0, !0;
	let s = L.normal, c = n[0] * s[0] + n[1] * s[1] + n[2] * s[2], l = c < 0 ? -c * e.bounce : 0, u = l < b ? 0 : l, d = [
		0,
		0,
		0
	], f = 0;
	for (let e = 0; e < 3; e++) d[e] = n[e] - s[e] * c, f += d[e] * d[e];
	f = Math.sqrt(f);
	let p = Math.abs(Math.min(c, 0)) + u, m = f > 0 ? Math.max(0, 1 - e.friction * p / f) : 0, h = 0;
	for (let e = 0; e < 3; e++) {
		let r = d[e] * m;
		n[e] = r + s[e] * u, t[e] += s[e] * S, h += r * r;
	}
	a[1] *= u > 0 ? 1 - e.friction : Math.max(0, 1 - e.friction * x * o);
	let g = u === 0 && Math.sqrt(h) < b;
	if (g && (a[1] = 0), !g) for (let e = 0; e < 3; e++) t[e] += n[e] * o * (1 - L.fraction);
	return g;
}
function R(e, t, n, r, i, a) {
	r[0] += r[1] * i;
	for (let t = 0; t < 3; t++) I[t] = e.gravity[t] + e.drag * (e.wind[t] - n[t]);
	for (let r of e.fields) o(r, t, n, a, I);
	for (let e = 0; e < 3; e++) n[e] += I[e] * i, P[e] = t[e], F[e] = t[e] + n[e] * i;
	if (ne(e, P, F)) return re(e, t, n, P, F, r, i);
	for (let e = 0; e < 3; e++) t[e] = F[e];
	return !1;
}
function ie(e, t, n, r, i) {
	let a = e.track, o = v.fieldStepSeconds, s = Math.floor(r / o);
	if (a.steps[t] > s) {
		for (let n = 0; n < 3; n++) a.position[t * 3 + n] = e.origin[t * 3 + n], a.velocity[t * 3 + n] = e.velocity[t * 3 + n];
		a.steps[t] = 0, a.resting[t] = 0, a.spin[t * 2] = e.spinStart[t], a.spin[t * 2 + 1] = e.spinRate[t];
	}
	let c = a.position.subarray(t * 3, t * 3 + 3), l = a.velocity.subarray(t * 3, t * 3 + 3), u = a.spin.subarray(t * 2, t * 2 + 2);
	for (; a.steps[t] < s && !a.resting[t];) R(n, c, l, u, o, e.birth[t] + a.steps[t] * o) && (a.resting[t] = 1, e.landing[t] = (a.steps[t] + 1) * o), a.steps[t]++;
	if (a.resting[t]) {
		a.steps[t] = s;
		for (let e = 0; e < 3; e++) i.position[e] = c[e];
		i.angle = u[0];
		return;
	}
	let d = [
		c[0],
		c[1],
		c[2]
	], f = [
		l[0],
		l[1],
		l[2]
	], p = [u[0], u[1]], m = r - s * o;
	m > 1e-9 && R(n, d, f, p, m, e.birth[t] + s * o);
	for (let e = 0; e < 3; e++) i.position[e] = d[e];
	i.angle = p[0];
}
function ae(e, t) {
	return e === "shrink" ? 1 - t : e === "grow" ? t : 1;
}
function oe(e, t, n, r, i, a) {
	let o = i - e.birth[t], s = e.life[t];
	if (a.fraction = Math.min(Math.max(o / s, 0), 1), o < 0 || o >= s) {
		a.scale = 0, a.motionAge = 0;
		for (let n = 0; n < 3; n++) a.position[n] = e.origin[t * 3 + n];
		return a;
	}
	if (a.scale = e.size[t] * ae(r, o / s), e.track) return ie(e, t, n, o, a), a.motionAge = Math.min(o, e.landing[t]), a;
	let c = e.landing[t], l = Math.min(o, c);
	a.motionAge = l, a.angle = e.hasSpin ? e.spinStart[t] + e.spinRate[t] * l : 0;
	for (let r = 0; r < 3; r++) a.position[r] = e.origin[t * 3 + r] + M(e.velocity[t * 3 + r], n.gravity[r], n.wind[r], n.drag, l);
	return c <= o && (a.position[1] = n.floor), a;
}
function se(e, t, n) {
	let r = Math.cos(t), i = Math.sin(t), [a, o, s] = e, c = 1 - r;
	n[0] = r + a * a * c, n[1] = a * o * c - s * i, n[2] = a * s * c + o * i, n[3] = o * a * c + s * i, n[4] = r + o * o * c, n[5] = o * s * c - a * i, n[6] = s * a * c - o * i, n[7] = s * o * c + a * i, n[8] = r + s * s * c;
}
function ce(e, t, n, r, i, a) {
	for (let o = 0; o < 3; o++) r[i + o] = (e[o * 3] * t[n] + e[o * 3 + 1] * t[n + 1] + e[o * 3 + 2] * t[n + 2]) * a;
}
var le = Object.freeze([
	1,
	0,
	0,
	0,
	1,
	0,
	0,
	0,
	1
]);
function ue(e, t, n) {
	for (let r = 0; r < 3; r++) for (let i = 0; i < 3; i++) n[r * 3 + i] = e[r * 3] * t[i] + e[r * 3 + 1] * t[3 + i] + e[r * 3 + 2] * t[6 + i];
}
function de(e, t, n, r, i, a = {}) {
	let o = Array.isArray(e) ? e : [e], s = (e) => t.instancePick ? t.instancePick[e] : 0, c = 0, l = 0;
	for (let e = 0; e < t.count; e++) {
		let t = o[s(e)];
		c += t.positions.length / 3, l += t.indices.length;
	}
	let u = new Float32Array(c * 3), d = new Float32Array(c * 3), f = new Uint32Array(l), p = o.every((e) => e.uvs) ? new Float32Array(c * 2) : void 0, m = a.color || a.alpha ? new Float32Array(c * 3) : void 0, h = {
		position: [
			0,
			0,
			0
		],
		scale: 0
	}, g = /* @__PURE__ */ new Float64Array(9), _ = /* @__PURE__ */ new Float64Array(9), v = [
		1,
		1,
		1
	], y = t.hasSpin || !!t.orientation, b = 0, x = 0;
	for (let e = 0; e < t.count; e++) {
		let c = o[s(e)], l = c.positions.length / 3;
		if (oe(t, e, n, r, i, h), y) {
			t.hasSpin && se(t.spinAxis.subarray(e * 3, e * 3 + 3), h.angle, g);
			let n = t.orientation ? t.orientation.subarray(e * 9, e * 9 + 9) : le;
			t.hasSpin ? ue(g, n, _) : _.set(n);
		}
		if (m) {
			let e = a.alpha ? a.alpha[0] + (a.alpha[1] - a.alpha[0]) * h.fraction : 1;
			for (let t = 0; t < 3; t++) {
				let n = a.color ? a.color[0][t] : 1, r = a.color ? a.color[1][t] : 1;
				v[t] = (n + (r - n) * h.fraction) * e;
			}
		}
		for (let e = 0; e < l; e++) {
			let t = (b + e) * 3;
			y && (ce(_, c.positions, e * 3, u, t, h.scale), ce(_, c.normals, e * 3, d, t, 1));
			for (let n = 0; n < 3; n++) u[t + n] = h.position[n] + (y ? u[t + n] : c.positions[e * 3 + n] * h.scale), m && (m[t + n] = v[n] * (c.colors ? c.colors[e * 3 + n] : 1));
		}
		y || d.set(c.normals, b * 3), p?.set(c.uvs, b * 2);
		for (let e = 0; e < c.indices.length; e++) f[x + e] = c.indices[e] + b;
		b += l, x += c.indices.length;
	}
	let S = {
		...o[0],
		positions: u,
		normals: d,
		indices: f
	};
	return o.length > 1 && (delete S.uvs, delete S.colors), p && (S.uvs = p), m && (S.colors = m), S;
}
// src/hair.js
var z = Object.freeze({
	maxSegments: 8,
	ringSides: 3,
	taperAtTip: .15
});
function fe(e, t, n) {
	let r = [], i = 0;
	for (let t = 0; t < n.length; t += 3) {
		let a = [
			n[t],
			n[t + 1],
			n[t + 2]
		], o = a.map((t) => [
			e[t * 3],
			e[t * 3 + 1],
			e[t * 3 + 2]
		]), s = o[1].map((e, t) => e - o[0][t]), c = o[2].map((e, t) => e - o[0][t]), l = Math.hypot(...D(s, c)) / 2;
		l > 0 && (i += l, r.push({
			vertices: a,
			points: o,
			area: l,
			cumulativeArea: i
		}));
	}
	return {
		triangles: r,
		totalArea: i,
		normals: t
	};
}
function pe(e, t) {
	let n = t * e.totalArea, r = 0, i = e.triangles.length - 1;
	for (; r < i;) {
		let t = r + i >> 1;
		e.triangles[t].cumulativeArea >= n ? i = t : r = t + 1;
	}
	return e.triangles[r];
}
function me(e, t, n, r) {
	let i = fe(t, n, r);
	if (!i.triangles.length) throw RangeError("Hair surface has no triangle with area.");
	let a = new Float64Array(e.count * 3), o = new Float64Array(e.count * 3), s = new Float64Array(e.count), c = new Float64Array(e.count);
	for (let t = 0; t < e.count; t++) {
		let r = w(e.seed, t);
		r();
		let l = pe(i, r()), u = r(), d = r();
		u + d > 1 && (u = 1 - u, d = 1 - d);
		let f = [
			1 - u - d,
			u,
			d
		], p = [
			0,
			0,
			0
		];
		for (let e = 0; e < 3; e++) {
			let r = l.vertices[e];
			for (let i = 0; i < 3; i++) a[t * 3 + i] += l.points[e][i] * f[e], p[i] += n[r * 3 + i] * f[e];
		}
		let m = [
			r() * 2 - 1,
			r() * 2 - 1,
			r() * 2 - 1
		].map((t) => t * e.spread), h = E(E(p).map((e, t) => e + m[t]));
		o.set(h, t * 3), s[t] = e.length[0] + (e.length[1] - e.length[0]) * r(), c[t] = r() * Math.PI * 2;
	}
	return {
		count: e.count,
		roots: a,
		directions: o,
		lengths: s,
		phases: c
	};
}
var he = .02, B = Object.freeze([
	0,
	0,
	0
]);
function ge(e, t, n, r) {
	let i = [
		0,
		0,
		0
	], a = [
		e.roots[t * 3],
		e.roots[t * 3 + 1],
		e.roots[t * 3 + 2]
	];
	for (let e of n) o(e, a, B, r, i);
	let s = Math.hypot(...i), c = s > 0 ? Math.min(he, e.lengths[t] / s) : 0;
	return i.map((e) => e * c);
}
function _e(e, t, n, r) {
	let i = [], a = e.lengths[t] / n.segments, o = [
		e.directions[t * 3],
		e.directions[t * 3 + 1],
		e.directions[t * 3 + 2]
	], s = [
		e.roots[t * 3],
		e.roots[t * 3 + 1],
		e.roots[t * 3 + 2]
	], c = n.sway ? n.sway.amplitude * Math.sin(Math.PI * 2 * n.sway.rate * r + e.phases[t]) : 0, l = n.fields?.length ? ge(e, t, n.fields, r) : B;
	for (let e = 0; e <= n.segments; e++) {
		let t = e / n.segments, r = n.sway?.direction ?? [
			0,
			0,
			0
		];
		i.push({
			center: s.map((e, n) => e + (r[n] * c + l[n]) * t * t),
			direction: o
		}), o = E([
			o[0],
			o[1] - n.droop / n.segments,
			o[2]
		]), s = s.map((e, t) => e + o[t] * a);
	}
	return i;
}
function V(e, t, n) {
	let r = t.segments + 1, i = z.ringSides, a = r * i, o = new Float32Array(e.count * a * 3), s = new Float32Array(o.length), c = new Uint32Array(e.count * t.segments * i * 6), l = 0;
	for (let r = 0; r < e.count; r++) {
		_e(e, r, t, n).forEach(({ center: e, direction: n }, c) => {
			let l = E(D(n, Math.abs(n[1]) < .99 ? [
				0,
				1,
				0
			] : [
				1,
				0,
				0
			])), u = D(n, l), d = t.width / 2 * (1 - (1 - z.taperAtTip) * c / t.segments);
			for (let t = 0; t < i; t++) {
				let n = t / i * Math.PI * 2, f = (r * a + c * i + t) * 3;
				for (let t = 0; t < 3; t++) {
					let r = l[t] * Math.cos(n) + u[t] * Math.sin(n);
					o[f + t] = e[t] + r * d, s[f + t] = r;
				}
			}
		});
		for (let e = 0; e < t.segments; e++) for (let t = 0; t < i; t++) {
			let n = (t + 1) % i, o = r * a + e * i, s = [
				o + t,
				o + n,
				o + i + t,
				o + i + n
			];
			c.set([
				s[0],
				s[1],
				s[2],
				s[1],
				s[3],
				s[2]
			], l), l += 6;
		}
	}
	return {
		positions: o,
		normals: s,
		indices: c
	};
}
// src/particle-emitter-mesh.js
var H = Object.freeze([
	"surface",
	"vertices",
	"edges",
	"volume"
]), ve = 200, U = Object.freeze([
	.5773,
	.5791,
	.5759
]), ye = 1e-12, be = 1e-5;
function W(e, t) {
	return [
		e[t * 3],
		e[t * 3 + 1],
		e[t * 3 + 2]
	];
}
function G(e, t) {
	return [
		e[0] - t[0],
		e[1] - t[1],
		e[2] - t[2]
	];
}
function K(e, t) {
	return [
		e[1] * t[2] - e[2] * t[1],
		e[2] * t[0] - e[0] * t[2],
		e[0] * t[1] - e[1] * t[0]
	];
}
function q(e, t) {
	return e[0] * t[0] + e[1] * t[1] + e[2] * t[2];
}
function xe(e, t, n) {
	let r = [];
	for (let i = 0; i + 2 < t.length; i += 3) {
		let a = W(e, t[i]), o = W(e, t[i + 1]), s = W(e, t[i + 2]), c = K(G(o, a), G(s, a)), l = Math.hypot(c[0], c[1], c[2]), u = n ? (n[t[i]] + n[t[i + 1]] + n[t[i + 2]]) / 3 : 1;
		r.push({
			a,
			b: o,
			c: s,
			doubleArea: l,
			emitWeight: l * u,
			normal: l > 0 ? c.map((e) => e / l) : [
				0,
				1,
				0
			]
		});
	}
	return r;
}
function Se(e) {
	let t = [], n = 0;
	for (let r of e) n += r.emitWeight, t.push(n);
	return n > 0 ? (r) => {
		let i = r() * n, a = 0, o = t.length - 1;
		for (; a < o;) {
			let e = a + o >> 1;
			t[e] < i ? a = e + 1 : o = e;
		}
		let s = e[a], c = Math.sqrt(r()), l = r(), u = c * (1 - l), d = c * l, f = 1 - c;
		return {
			point: [
				0,
				1,
				2
			].map((e) => s.a[e] * f + s.b[e] * u + s.c[e] * d),
			normal: s.normal
		};
	} : null;
}
function Ce(e, t) {
	let n = G(t.b, t.a), r = G(t.c, t.a), i = K(U, r), a = q(n, i);
	if (Math.abs(a) < ye) return !1;
	let o = G(e, t.a), s = q(o, i) / a;
	if (s < 0 || s > 1) return !1;
	let c = K(o, n), l = q(U, c) / a;
	return l < 0 || s + l > 1 ? !1 : q(r, c) / a > 0;
}
function we(e, t) {
	let n = 0;
	for (let r of e) Ce(t, r) && n++;
	return n % 2 == 1;
}
function Te(e, t) {
	let n = [
		Infinity,
		Infinity,
		Infinity
	], r = [
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let e = 0; e < t.length; e += 3) for (let i = 0; i < 3; i++) n[i] = Math.min(n[i], t[e + i]), r[i] = Math.max(r[i], t[e + i]);
	return (t) => {
		for (let i = 0; i < ve; i++) {
			let i = [
				0,
				1,
				2
			].map((e) => n[e] + (r[e] - n[e]) * t());
			if (we(e, i)) return {
				point: i,
				normal: null
			};
		}
		return null;
	};
}
function Ee(e, t, n) {
	let r = e.length / 3, i = [], a = 0;
	for (let e = 0; e < r; e++) a += n ? n[e] : 1, i.push(a);
	return a > 0 ? (n) => {
		let o = n() * a, s = 0, c = r - 1;
		for (; s < c;) {
			let e = s + c >> 1;
			i[e] <= o ? s = e + 1 : c = e;
		}
		return {
			point: W(e, s),
			normal: W(t, s)
		};
	} : null;
}
function J(e) {
	let t = Math.hypot(e[0], e[1], e[2]);
	return t > 0 ? e.map((e) => e / t) : null;
}
function De(e) {
	return e.map((e) => Math.round(e / be)).join(",");
}
function Oe(e, t, n) {
	let r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
	for (let a = 0; a + 2 < t.length; a += 3) {
		let o = [
			0,
			1,
			2
		].map((n) => W(e, t[a + n])), s = o.map(De), c = J(K(G(o[1], o[0]), G(o[2], o[0])));
		for (let e = 0; e < 3; e++) {
			n && i.set(s[e], Math.max(i.get(s[e]) ?? 0, n[t[a + e]]));
			let l = (e + 1) % 3;
			if (s[e] === s[l]) continue;
			let u = s[e] < s[l] ? `${s[e]}|${s[l]}` : `${s[l]}|${s[e]}`, d = r.get(u);
			if (!d) {
				let [t, n] = s[e] < s[l] ? [e, l] : [l, e];
				d = {
					start: o[t],
					end: o[n],
					startKey: s[t],
					endKey: s[n],
					faceNormals: []
				}, d.length = Math.hypot(...G(d.end, d.start)), r.set(u, d);
			}
			c && d.faceNormals.push(c);
		}
	}
	for (let e of r.values()) e.weight = n ? Math.min(i.get(e.startKey), i.get(e.endKey)) : 1;
	return [...r.values()];
}
function ke(e, t) {
	if (e.faceNormals.length !== 2) return !0;
	let n = Math.max(-1, Math.min(1, q(e.faceNormals[0], e.faceNormals[1])));
	return Math.acos(n) * 180 / Math.PI > t;
}
function Ae(e, t, n, r) {
	let i = Oe(e, t, n);
	r !== null && (i = i.filter((e) => ke(e, r)));
	let a = [], o = 0;
	for (let e of i) o += e.length * e.weight, a.push(o);
	return o > 0 ? (e) => {
		let t = e() * o, n = 0, r = a.length - 1;
		for (; n < r;) {
			let e = n + r >> 1;
			a[e] < t ? n = e + 1 : r = e;
		}
		let s = i[n], c = e();
		return {
			point: [
				0,
				1,
				2
			].map((e) => s.start[e] + (s.end[e] - s.start[e]) * c),
			normal: J(s.faceNormals.reduce((e, t) => e.map((e, n) => e + t[n]), [
				0,
				0,
				0
			])) ?? s.faceNormals[0] ?? [
				0,
				1,
				0
			]
		};
	} : null;
}
function je(e, t, n, r, i = null, a = null) {
	let o = xe(e, n, i);
	if (!o.length) return null;
	let s = null;
	return s = r === "vertices" ? Ee(e, t, i) : r === "edges" ? Ae(e, n, i, a) : r === "volume" ? Te(o, e) : Se(o), s ? Object.freeze({
		mode: r,
		triangleCount: o.length,
		sample(e) {
			let t = s(e);
			if (!t) throw Error("The particle emitter mesh has no inside to fill: pass a closed mesh (every edge shared by two faces) for emitter.from \"volume\", or use \"surface\".");
			return t;
		}
	}) : null;
}
// src/agent-particles.js
var Me = [
	"gravity",
	"wind",
	"fields",
	"systems"
], Ne = ["emitter", "hair"], Pe = [
	"type",
	"node",
	"seed",
	"count",
	"rate",
	"lifetime",
	"speed",
	"direction",
	"spread",
	"emitter",
	"size",
	"scale",
	"drag",
	"floor",
	"bounce",
	"friction",
	"colliders",
	"spin",
	"color",
	"alpha",
	"instances",
	"orient"
], Fe = [
	"type",
	"node",
	"surface",
	"seed",
	"count",
	"length",
	"segments",
	"width",
	"droop",
	"lean",
	"sway",
	"swayRate"
], Ie = [
	"shape",
	"position",
	"halfExtents",
	"radius",
	"mesh",
	"from",
	"group",
	"sharpAngle",
	"normalSpeed"
], Le = [
	"point",
	"box",
	"sphere",
	"disc",
	"mesh"
], Re = [
	"none",
	"random",
	"normal"
], ze = [
	"constant",
	"shrink",
	"grow"
], Be = Object.freeze([
	0,
	-9.81,
	0
]), Ve = .3, He = .5, Y = 1e4, Ue = 4294967295;
function X(e, t, n, r) {
	if (typeof e == "number") return [f(e, t, n, r), e];
	if (!Array.isArray(e) || e.length !== 2) throw s(t, e, `a number or [minimum, maximum] from ${n} to ${r}, such as [${Math.max(n, .5)}, ${Math.min(r, 1)}]`, TypeError);
	let i = e.map((e, i) => f(e, `${t}[${i}]`, n, r));
	if (i[0] > i[1]) throw s(t, e, `[minimum, maximum] with the minimum not above the maximum, such as [${i[1]}, ${i[0]}]`);
	return i;
}
function We(e, t, n, r) {
	c(e.mesh, n.recipeNodes, /* @__PURE__ */ new Set(), n.motionNodeIds, n.physicsNodeIds, `${r}.mesh`, "particles");
	let i = e.from ?? "surface";
	if (!H.includes(i)) throw s(`${r}.from`, i, `one of ${H.join(", ")}`);
	if (t.mesh = e.mesh, t.from = i, e.group !== void 0) {
		if (typeof e.group != "string" || !e.group) throw s(`${r}.group`, e.group, "the name of a vertex group on the emitter mesh, such as \"edge\"");
		if (i === "volume") throw s(`${r}.group`, e.group, `left out, because a vertex group weighs ${r}.from "surface", "vertices" or "edges", not "volume"`);
		t.group = e.group;
	}
	if (e.sharpAngle !== void 0) {
		if (i !== "edges") throw s(`${r}.sharpAngle`, e.sharpAngle, `left out unless ${r}.from is "edges"`);
		t.sharpAngle = f(e.sharpAngle, `${r}.sharpAngle`, 0, 180);
	}
	e.normalSpeed !== void 0 && (t.normalSpeed = f(e.normalSpeed, `${r}.normalSpeed`, -1e3, 1e3));
}
function Ge(e, t, n) {
	l(e, Ie, n);
	let r = e.shape ?? "point";
	if (!Le.includes(r)) throw s(`${n}.shape`, r, `one of ${Le.join(", ")}`);
	let i = {
		shape: r,
		position: e.position === void 0 ? [
			0,
			0,
			0
		] : d(e.position, `${n}.position`, Y),
		halfExtents: e.halfExtents === void 0 ? [
			.5,
			.5,
			.5
		] : d(e.halfExtents, `${n}.halfExtents`, Y).map(Math.abs),
		radius: e.radius === void 0 ? .5 : f(e.radius, `${n}.radius`, 0, Y)
	};
	if (r === "mesh") We(e, i, t, n);
	else for (let t of [
		"mesh",
		"from",
		"group",
		"sharpAngle",
		"normalSpeed"
	]) if (e[t] !== void 0) throw s(`${n}.${t}`, e[t], `left out unless ${n}.shape is "mesh"`);
	return i;
}
function Ke(e, t, n, r) {
	if (e.instances !== void 0) {
		let i = u(e.instances, v.maxInstances, `${r}.instances`);
		if (!i.length) throw s(`${r}.instances`, i, "at least one node ID, such as [\"leaf\"]; leave it out to repeat the system node");
		i.forEach((e, t) => {
			c(e, n.recipeNodes, /* @__PURE__ */ new Set(), n.motionNodeIds, n.physicsNodeIds, `${r}.instances[${t}]`, "particles");
		}), t.instances = i;
	}
	let i = e.orient ?? "none";
	if (!Re.includes(i)) throw s(`${r}.orient`, i, `one of ${Re.join(", ")}`);
	let a = t.emitter;
	if (i === "normal" && (a.shape !== "mesh" || a.from === "volume")) throw s(`${r}.orient`, i, `"none" or "random", because a normal needs ${r}.emitter.shape "mesh" with from "surface", "vertices" or "edges"`);
	if (a.normalSpeed && a.from === "volume") throw s(`${r}.emitter.normalSpeed`, a.normalSpeed, "left out when from is \"volume\", which has no surface normal");
	i !== "none" && (t.orient = i);
}
function qe(e, t) {
	let n = e.count ?? 100;
	if (!Number.isInteger(n) || n < 1 || n > v.maxParticlesPerSystem) throw s(`${t}.count`, n, `a whole number from 1 to ${v.maxParticlesPerSystem}, such as 100`);
	return n;
}
function Je(e, t) {
	let n = e.seed ?? 1;
	if (!Number.isInteger(n) || n < 0 || n > Ue) throw s(`${t}.seed`, n, `a whole number from 0 to ${Ue}, such as 1`);
	return n;
}
function Ye(e, t) {
	if (!Array.isArray(e) || e.length !== 2) throw s(t, e, "[start, end], each [r, g, b] from 0 to 1, such as [[1, 0.6, 0.1], [0.3, 0, 0]]", TypeError);
	return e.map((e, n) => d(e, `${t}[${n}]`, 1e3).map((e, r) => f(e, `${t}[${n}][${r}]`, 0, 1e3)));
}
function Xe(e, t) {
	if (typeof e == "number") return [f(e, t, 0, 1), e];
	if (!Array.isArray(e) || e.length !== 2) throw s(t, e, "a number or [start, end] from 0 to 1, such as [1, 0]", TypeError);
	return e.map((e, n) => f(e, `${t}[${n}]`, 0, 1));
}
function Ze(e, t, n) {
	let r = u(e, v.maxColliders, n);
	return r.forEach((e, r) => {
		c(e, t.recipeNodes, /* @__PURE__ */ new Set(), t.motionNodeIds, t.physicsNodeIds, `${n}[${r}]`, "particles");
	}), r;
}
function Qe(e, t, n) {
	l(e, Pe, n), c(e.node, t.recipeNodes, t.claimedNodes, t.motionNodeIds, t.physicsNodeIds, `${n}.node`, "particles");
	let r = {
		type: "emitter",
		node: e.node,
		seed: Je(e, n),
		count: qe(e, n),
		lifetime: X(e.lifetime ?? 1, `${n}.lifetime`, .01, v.maxLifetime),
		speed: X(e.speed ?? 1, `${n}.speed`, 0, 1e3),
		size: X(e.size ?? .05, `${n}.size`, 1e-4, 100),
		direction: e.direction === void 0 ? [
			0,
			1,
			0
		] : d(e.direction, `${n}.direction`, 1e3),
		spread: e.spread === void 0 ? 30 : f(e.spread, `${n}.spread`, 0, 180),
		emitter: Ge(e.emitter ?? {}, t, `${n}.emitter`),
		scale: e.scale ?? "constant",
		drag: e.drag === void 0 ? 0 : f(e.drag, `${n}.drag`, 0, 100)
	};
	if (Math.hypot(...r.direction) === 0) throw s(`${n}.direction`, r.direction, "a direction that is not the zero vector, such as [0, 1, 0]");
	if (!ze.includes(r.scale)) throw s(`${n}.scale`, r.scale, `one of ${ze.join(", ")}`);
	if (e.rate !== void 0 && (r.rate = f(e.rate, `${n}.rate`, .01, v.maxParticlesPerSystem * 100)), e.bounce !== void 0 && (r.bounce = f(e.bounce, `${n}.bounce`, 0, 1)), e.friction !== void 0 && (r.friction = f(e.friction, `${n}.friction`, 0, 1)), e.spin !== void 0 && (r.spin = X(e.spin, `${n}.spin`, -1e5, 1e5)), e.color !== void 0 && (r.color = Ye(e.color, `${n}.color`)), e.alpha !== void 0 && (r.alpha = Xe(e.alpha, `${n}.alpha`)), e.colliders !== void 0 && (r.colliders = Ze(e.colliders, t, `${n}.colliders`), r.colliders.includes(r.node))) throw s(`${n}.colliders`, r.colliders, `node IDs other than the system's own node "${r.node}"`);
	return Ke(e, r, t, n), e.floor !== void 0 && (r.floor = f(e.floor, `${n}.floor`, -1e4, Y)), r;
}
function $e(e, t, n) {
	if (l(e, Fe, n), c(e.node, t.recipeNodes, t.claimedNodes, t.motionNodeIds, t.physicsNodeIds, `${n}.node`, "particles"), c(e.surface, t.recipeNodes, /* @__PURE__ */ new Set(), t.motionNodeIds, t.physicsNodeIds, `${n}.surface`, "particles"), e.surface === e.node) throw s(`${n}.surface`, e.surface, "a node other than the hair node, such as the head mesh");
	let r = e.segments ?? 4;
	if (!Number.isInteger(r) || r < 1 || r > z.maxSegments) throw s(`${n}.segments`, r, `a whole number from 1 to ${z.maxSegments}, such as 4`);
	let i = {
		type: "hair",
		node: e.node,
		surface: e.surface,
		seed: Je(e, n),
		count: qe(e, n),
		segments: r,
		length: X(e.length ?? .1, `${n}.length`, .001, 100),
		width: f(e.width ?? .004, `${n}.width`, 1e-4, 10),
		droop: f(e.droop ?? .5, `${n}.droop`, 0, 10),
		lean: f(e.lean ?? .2, `${n}.lean`, 0, 2)
	};
	return e.sway !== void 0 && (i.sway = f(e.sway, `${n}.sway`, 0, 10), i.swayRate = f(e.swayRate ?? .5, `${n}.swayRate`, .01, 20)), i;
}
function et(e, t, n) {
	let r = e?.type ?? "emitter";
	if (!Ne.includes(r)) throw s(`${n}.type`, r, `one of ${Ne.join(", ")}`);
	return r === "hair" ? $e(e, t, n) : Qe(e, t, n);
}
function tt(e, t) {
	if (e == null) return null;
	l(e, Me, "particles");
	let n = p(t, ["cloth"]), r = {};
	if (r.systems = u(e.systems, v.maxSystems, "particles.systems").map((e, t) => et(e, n, `particles.systems[${t}]`)), !r.systems.length) throw s("particles.systems", r.systems, "at least one system, such as [{ \"node\": \"sparks\" }]; use particles: null to clear it");
	let i = new Set(r.systems.map((e) => e.node));
	for (let e of r.systems) {
		let t = e.colliders?.find((e) => i.has(e));
		if (t) throw s("particles.systems", t, "colliders that are not particle system nodes, because a system replaces its own geometry with particles");
	}
	let o = r.systems.reduce((e, t) => e + t.count, 0);
	if (o > v.maxParticles) throw s("particles.systems", `${o} particles in total`, `counts that add up to at most ${v.maxParticles}, such as a lower count in each system`);
	return e.gravity !== void 0 && (r.gravity = d(e.gravity, "particles.gravity", 1e3)), e.wind !== void 0 && (r.wind = d(e.wind, "particles.wind", 100)), e.fields !== void 0 && (r.fields = a(e.fields, "Particle force field")), r;
}
function Z(e) {
	return r(n(), e.rotation, e.translation, e.scale);
}
function nt(e, t) {
	let r = i(n(), t), a = new Float32Array(e.positions.length), o = new Float32Array(e.normals.length);
	for (let n = 0; n < a.length; n += 3) {
		let i = e.positions[n], s = e.positions[n + 1], c = e.positions[n + 2];
		for (let l = 0; l < 3; l++) a[n + l] = r[l] * i + r[4 + l] * s + r[8 + l] * c + r[12 + l], o[n + l] = t[l * 4] * e.normals[n] + t[l * 4 + 1] * e.normals[n + 1] + t[l * 4 + 2] * e.normals[n + 2];
		let l = Math.hypot(o[n], o[n + 1], o[n + 2]) || 1;
		for (let e = 0; e < 3; e++) o[n + e] /= l;
	}
	return Object.freeze({
		...e,
		positions: a,
		normals: o
	});
}
function rt(e) {
	let t = [];
	for (let n = 0; n < e.count; n++) t.push([e.birth[n], 1], [e.birth[n] + e.life[n], -1]);
	t.sort((e, t) => e[0] - t[0] || e[1] - t[1]);
	let n = 0, r = 0;
	for (let [, e] of t) n += e, r = Math.max(r, n);
	return {
		maxAlive: r,
		endsAt: Number(t.at(-1)[0].toFixed(4))
	};
}
function Q(n, r) {
	let i = new Float64Array(n.positions.length), a = new Float64Array(n.normals.length), o = e(t(), r);
	for (let e = 0; e < i.length; e += 3) for (let t = 0; t < 3; t++) i[e + t] = r[t] * n.positions[e] + r[4 + t] * n.positions[e + 1] + r[8 + t] * n.positions[e + 2] + r[12 + t], a[e + t] = o[t] * n.normals[e] + o[3 + t] * n.normals[e + 1] + o[6 + t] * n.normals[e + 2];
	return {
		positions: i,
		normals: a
	};
}
function it(e, t, n) {
	if (e > v.maxVertices || t > v.maxVertices) throw s("particles.systems", `${t} vertices on node ${n}`, `shape vertices times count of at most ${v.maxVertices}; use a shape with fewer segments or a lower count`);
}
function $(e) {
	return e.instances ?? [e.node];
}
function at(e) {
	let t = Math.hypot(e[0], e[2]);
	return t > 1e-6 ? [
		e[0] / t,
		0,
		e[2] / t
	] : [
		1,
		0,
		0
	];
}
function ot(e, t, n) {
	if (!e.colliders) return;
	let r = h(e.colliders.map((e) => {
		let r = t.get(e), i = n.get(r.geometry);
		return {
			positions: Q(i, Z(r)).positions,
			indices: i.indices
		};
	}));
	if (r.triangleCount > v.maxColliderTriangles) throw s("particles.systems", `${r.triangleCount} collider triangles for node ${e.node}`, `colliders with at most ${v.maxColliderTriangles} triangles in total, such as a simpler collider mesh`);
	return r;
}
function st(e, t) {
	let n = t.vertexGroups?.[e.group];
	if (!n) {
		let n = Object.keys(t.vertexGroups ?? {});
		throw s("particles.systems[].emitter.group", e.group, `a vertex group of node ${e.mesh} (known groups: ${n.join(", ") || "none"}); make one with a vertex_group mesh edit`);
	}
	return n;
}
function ct(e, t, n) {
	let r = e.emitter;
	if (r.shape !== "mesh") return r;
	let i = t.get(r.mesh), a = n.get(i.geometry), o = Q(a, Z(i)), c = r.group ? st(r, a) : null, l = r.sharpAngle ?? null, u = je(o.positions, o.normals, a.indices, r.from, c, l);
	if (!u) {
		let e = r.group ? ` and some weight in vertex group "${r.group}"` : "";
		throw s("particles.systems[].emitter.mesh", r.mesh, `a node whose mesh has triangles with some area${e}, because emitter.from is "${r.from}"`);
	}
	if (u.triangleCount > v.maxEmitterTriangles) throw s("particles.systems[].emitter.mesh", `${u.triangleCount} triangles on node ${r.mesh}`, `a mesh with at most ${v.maxEmitterTriangles} triangles, such as a simpler proxy mesh`);
	return {
		...r,
		source: u
	};
}
function lt(e, t, n, r, i, a) {
	let o = {
		...r,
		drag: e.drag,
		floor: e.floor,
		bounce: e.bounce ?? (i ? Ve : 0),
		friction: e.friction ?? He,
		colliders: i
	}, s = j({
		...e,
		emitter: a,
		instanceCount: n.length,
		spreadRadians: e.spread * Math.PI / 180,
		forces: o
	});
	return {
		node: t,
		report: () => ({
			node: e.node,
			type: "emitter",
			particles: e.count,
			verticesPerParticle: Math.max(...n.map((e) => e.positions.length / 3)),
			...rt(s)
		}),
		build: (t) => de(n, s, o, e.scale, t, e)
	};
}
function ut(e, t, n, r, i) {
	let a = Q(r, Z(n)), o = me({
		...e,
		spread: e.lean
	}, a.positions, a.normals, r.indices), s = {
		segments: e.segments,
		width: e.width,
		droop: e.droop,
		fields: i.fields,
		sway: e.sway ? {
			amplitude: e.sway,
			rate: e.swayRate,
			direction: at(i.wind)
		} : void 0
	}, c = (e.segments + 1) * z.ringSides, l = null;
	return {
		node: t,
		report: () => ({
			node: e.node,
			type: "hair",
			surface: e.surface,
			strands: e.count,
			segments: e.segments,
			verticesPerStrand: c
		}),
		build: (e) => s.sway || s.fields.some((e) => e.type === "turbulence") ? V(o, s, e) : (l ??= V(o, s, 0), l)
	};
}
function dt(e, t, n) {
	let r = new Map(t.nodes.map((e) => [e.id, e])), i = {
		gravity: e.gravity ?? Be,
		wind: e.wind ?? [
			0,
			0,
			0
		],
		fields: e.fields ?? []
	}, a = 0, o = e.systems.map((e) => {
		let t = r.get(e.node), o = e.type === "hair" ? (e.segments + 1) * z.ringSides : Math.max(...$(e).map((e) => n.get(r.get(e).geometry).positions.length / 3));
		if (a += o * e.count, it(o * e.count, a, e.node), e.type === "hair") {
			let a = r.get(e.surface);
			return ut(e, t, a, n.get(a.geometry), i);
		}
		return lt(e, t, $(e).map((e) => n.get(r.get(e).geometry)), i, ot(e, r, n), ct(e, r, n));
	});
	return Object.freeze({
		sample(e) {
			return new Map(o.map(({ node: t, build: n }) => [t.id, nt(n(e), Z(t))]));
		},
		report() {
			return {
				gravity: [...i.gravity],
				wind: [...i.wind],
				fields: i.fields.map((e) => ({ ...e })),
				vertices: a,
				systems: o.map((e) => e.report())
			};
		}
	});
}
export { dt as bakeAgentParticles, tt as normalizeAgentParticles };
