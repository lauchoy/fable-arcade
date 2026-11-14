/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { n as e } from "./volumetric-D8WftbY1.js";
import { n as t, r as n } from "./local-volumes-DW4FCqaw.js";
import { r } from "./local-volume-parts-BNghoi6p.js";
import { t as i } from "./triangle-bvh-MJBX52tQ.js";
import { t as a } from "./ray-query-CWJhfYYD.js";
// src/path-tracer-volume.js
function o(t) {
	if (!t) return null;
	let n = e(t);
	return n.density > 0 ? {
		density: n.density,
		minimum: n.minimum,
		maximum: n.maximum,
		albedo: n.color,
		anisotropy: n.anisotropy,
		maxDistance: n.maxDistance
	} : null;
}
function s(e, t, n, r, i, a, o, s, c) {
	let l = 0, u = Math.min(s, e.maxDistance);
	for (let s = 0; s < 3; s++) {
		let c = s === 0 ? t : s === 1 ? n : r, d = s === 0 ? i : s === 1 ? a : o;
		if (d === 0) {
			if (c < e.minimum[s] || c > e.maximum[s]) return !1;
			continue;
		}
		let f = (e.minimum[s] - c) / d, p = (e.maximum[s] - c) / d;
		l = Math.max(l, Math.min(f, p)), u = Math.min(u, Math.max(f, p));
	}
	return l < u && (c[0] = l, c[1] = u, !0);
}
function c(e, t) {
	let n = e * e;
	return (1 - n) / (4 * Math.PI * (1 + n - 2 * e * t) ** 1.5);
}
function l(e, t) {
	if (Math.abs(e) < .001) return 1 - 2 * t;
	let n = e * e, r = (1 - n) / (1 - e + 2 * e * t);
	return Math.max(-1, Math.min(1, (1 + n - r * r) / (2 * e)));
}
var u = 64, d = u / 2, f = [
	1,
	0,
	0,
	0,
	0,
	1,
	0,
	0,
	0,
	0,
	1,
	0,
	0,
	0,
	0,
	1
];
function p(e, t) {
	let { geometry: n, matrix: o = f } = e.part, s = n.positions, c = new Float32Array(s.length);
	for (let e = 0; e < s.length; e += 3) {
		let t = s[e], n = s[e + 1], r = s[e + 2];
		c[e] = o[0] * t + o[4] * n + o[8] * r + o[12], c[e + 1] = o[1] * t + o[5] * n + o[9] * r + o[13], c[e + 2] = o[2] * t + o[6] * n + o[10] * r + o[14];
	}
	let l = Math.hypot(...e.size), u = r(c, n.indices, l * 1e-6);
	if (u > 0) throw RangeError(`${t}.part "${e.part.name}" is not a closed mesh (${u} open edges), so it has no inside; close it or use fit "bounds"`);
	let d = i(c, n.indices);
	return {
		...e,
		mesh: {
			tracer: a({
				positions: c,
				indices: n.indices,
				bvh: d
			}),
			stepOffset: l * 1e-6
		}
	};
}
function m(e, t, n, r, i, a, o, s, c) {
	let { tracer: l, stepOffset: f } = e.mesh, p = [], m = 0;
	for (; p.length < u;) {
		let e = l.trace(t + i * m, n + a * m, r + o * m, i, a, o, Infinity, !1);
		if (e.nearestTriangle < 0) break;
		m += e.nearestDistance, p.push(m), m += f;
	}
	let h = p.length % 2 == 1, g = 0, _ = 0;
	for (let e of p) {
		if (h) {
			let t = Math.min(e, s);
			t > g && _ < d && (c[_ * 2] = g, c[_ * 2 + 1] = t, _++);
		} else g = e;
		h = !h;
	}
	return _;
}
function h(e, t, r, i, a, o, s, c, l, u, d) {
	let f = 0;
	for (let e = 0; e < t.length; e += 2) f += t[e + 1] - t[e];
	for (let p = 0; p < t.length; p += 2) {
		let m = t[p], h = t[p + 1] - m, g = Math.max(1, Math.round(e.steps * h / f)), _ = h / g;
		for (let t = 0; t < g; t++) {
			let f = m + (t + l) * _, p = n(e, r + o * f, i + s * f, a + c * f) * _;
			for (let t = 0; t < 3; t++) d[t] += u[t] * e.emission[t] * e.emissionStrength * p, u[t] *= Math.exp(-e.absorption[t] * e.density * p);
		}
	}
}
function g(e) {
	let r = new Float64Array(e.length), i = new Float64Array(e.length), a = new Int32Array(e.length), o = /* @__PURE__ */ new Float64Array(2), s = /* @__PURE__ */ new Float64Array(64), c = Array(e.length);
	return function(l, u, d, f, p, g, _, v, y, b) {
		b[0] = 0, b[1] = 0, b[2] = 0;
		let x = 0;
		for (let n = 0; n < e.length; n++) {
			if (e[n].mesh) {
				let t = m(e[n], l, u, d, f, p, g, _, s);
				if (t === 0) continue;
				c[n] = s.slice(0, t * 2), o[0] = s[0], o[1] = s[t * 2 - 1];
			} else if (!t(e[n], l, u, d, f, p, g, _, o)) continue;
			r[n] = o[0], i[n] = o[1];
			let h = x++;
			for (; h > 0 && r[a[h - 1]] > o[0];) a[h] = a[h - 1], h--;
			a[h] = n;
		}
		for (let t = 0; t < x; t++) {
			let o = e[a[t]];
			if (o.mesh) {
				h(o, c[a[t]], l, u, d, f, p, g, v, y, b);
				continue;
			}
			let s = r[a[t]], m = (i[a[t]] - s) / o.steps;
			for (let e = 0; e < o.steps; e++) {
				let t = s + (e + v) * m, r = n(o, l + f * t, u + p * t, d + g * t);
				if (r <= 0) continue;
				let i = r * m;
				for (let e = 0; e < 3; e++) b[e] += y[e] * o.emission[e] * o.emissionStrength * i, y[e] *= Math.exp(-o.absorption[e] * o.density * i);
			}
		}
	};
}
export { l as a, o as i, c as n, s as o, p as r, g as t };
