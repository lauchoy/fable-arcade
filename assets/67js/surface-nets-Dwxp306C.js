/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
// src/surface-nets.js
var e = [
	[
		0,
		0,
		0
	],
	[
		1,
		0,
		0
	],
	[
		0,
		1,
		0
	],
	[
		1,
		1,
		0
	],
	[
		0,
		0,
		1
	],
	[
		1,
		0,
		1
	],
	[
		0,
		1,
		1
	],
	[
		1,
		1,
		1
	]
], t = [
	[0, 1],
	[2, 3],
	[4, 5],
	[6, 7],
	[0, 2],
	[1, 3],
	[4, 6],
	[5, 7],
	[0, 4],
	[1, 5],
	[2, 6],
	[3, 7]
];
function n(n, r, i) {
	let [a, o, s] = r.points, c = a - 1, l = o - 1, u = new Int32Array(c * l * (s - 1)).fill(-1), d = [], f = /* @__PURE__ */ new Float64Array(8);
	for (let p = 0; p < s - 1; p++) for (let s = 0; s < l; s++) for (let m = 0; m < c; m++) {
		let h = 0;
		for (let t = 0; t < 8; t++) {
			let [r, i, c] = e[t];
			f[t] = n[((p + c) * o + s + i) * a + m + r], f[t] < 0 && h++;
		}
		if (h === 0 || h === 8) continue;
		let g = [
			0,
			0,
			0
		], _ = 0;
		for (let [n, r] of t) {
			if (f[n] < 0 == f[r] < 0) continue;
			let t = f[n] / (f[n] - f[r]);
			for (let i = 0; i < 3; i++) g[i] += e[n][i] + t * (e[r][i] - e[n][i]);
			_++;
		}
		u[(p * l + s) * c + m] = d.length / 3, d.push(i[0] + (m + g[0] / _) * r.edge, i[1] + (s + g[1] / _) * r.edge, i[2] + (p + g[2] / _) * r.edge);
	}
	return {
		cellVertex: u,
		positions: d
	};
}
var r = [
	[1, 2],
	[2, 0],
	[0, 1]
], i = [
	[-1, -1],
	[0, -1],
	[0, 0],
	[-1, 0]
];
function a(e, t, n) {
	let a = t.points.map((e) => e - 1), [s, c, l] = t.points, u = [
		1,
		s,
		s * c
	], d = [], f = [
		0,
		0,
		0
	];
	for (let p = 0; p < l; p++) for (let l = 0; l < c; l++) for (let m = 0; m < s; m++) {
		f[0] = m, f[1] = l, f[2] = p;
		let h = (p * c + l) * s + m;
		for (let s = 0; s < 3; s++) {
			let [c, l] = r[s];
			if (f[s] + 1 >= t.points[s] || f[c] === 0 || f[l] === 0) continue;
			let p = e[h];
			if (p < 0 == e[h + u[s]] < 0) continue;
			let m = i.map(([e, t]) => o(n, a, f, s, c, l, e, t));
			m.includes(-1) || d.push(p < 0 ? m : m.reverse());
		}
	}
	return d;
}
function o(e, t, n, r, i, a, o, s) {
	let c = [
		n[0],
		n[1],
		n[2]
	];
	return c[i] += o, c[a] += s, c[0] >= t[0] || c[1] >= t[1] || c[2] >= t[2] ? -1 : e[(c[2] * t[1] + c[1]) * t[0] + c[0]];
}
export { a as n, n as t };
