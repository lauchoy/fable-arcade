/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
// src/local-volume-parts.js
function e(e, t) {
	let n = /* @__PURE__ */ new Map(), r = new Uint32Array(e.length / 3);
	for (let i = 0; i < r.length; i++) {
		let a = `${Math.round(e[i * 3] / t)},${Math.round(e[i * 3 + 1] / t)},${Math.round(e[i * 3 + 2] / t)}`;
		n.has(a) || n.set(a, n.size), r[i] = n.get(a);
	}
	return r;
}
function t(t, n, r) {
	let i = e(t, r), a = /* @__PURE__ */ new Map();
	for (let e = 0; e < n.length; e += 3) for (let t = 0; t < 3; t++) {
		let r = i[n[e + t]], o = i[n[e + (t + 1) % 3]];
		if (r === o) continue;
		let s = r < o ? `${r}-${o}` : `${o}-${r}`, c = a.get(s) ?? {
			count: 0,
			direction: 0
		};
		c.count++, c.direction += r < o ? 1 : -1, a.set(s, c);
	}
	let o = 0, s = 0;
	for (let { count: e, direction: t } of a.values()) e === 2 ? t !== 0 && s++ : o++;
	return {
		open: o,
		inconsistent: s
	};
}
function n(e, n, r) {
	return t(e, n, r).open;
}
var r = /* @__PURE__ */ new WeakMap();
function i(e) {
	let t = r.get(e);
	if (t) return t;
	let n = e.positions, i = [
		Infinity,
		Infinity,
		Infinity
	], a = [
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let e = 0; e < n.length; e += 3) for (let t = 0; t < 3; t++) i[t] = Math.min(i[t], n[e + t]), a[t] = Math.max(a[t], n[e + t]);
	return t = {
		minimum: i,
		maximum: a
	}, r.set(e, t), t;
}
function a(e, t) {
	let { minimum: n, maximum: r } = i(e.geometry), a = e.matrix ?? [
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
	], o = n.map((e, t) => (e + r[t]) / 2), s = [
		0,
		1,
		2
	].map((e) => a[e] * o[0] + a[4 + e] * o[1] + a[8 + e] * o[2] + a[12 + e]), c = [], l = [];
	for (let i = 0; i < 3; i++) {
		let o = a[i * 4], s = a[i * 4 + 1], u = a[i * 4 + 2], d = Math.hypot(o, s, u);
		if (!(d > 0)) throw RangeError(`${t}.part "${e.name}" has a flat transform; a mesh volume needs a part with volume`);
		c.push((r[i] - n[i]) * d), l.push(o / d, s / d, u / d);
	}
	if (!c.every((e) => e > 0)) throw RangeError(`${t}.part "${e.name}" has no thickness along one axis; a mesh volume needs a part with volume`);
	return {
		center: s,
		size: c,
		axes: l
	};
}
var o = /* @__PURE__ */ new WeakMap();
function s(e, n) {
	let r = o.get(e.geometry);
	if (!r) {
		let { minimum: n, maximum: a } = i(e.geometry), s = Math.hypot(a[0] - n[0], a[1] - n[1], a[2] - n[2]);
		r = t(e.geometry.positions, e.geometry.indices, s * 1e-6), o.set(e.geometry, r);
	}
	if (r.open > 0) throw RangeError(`${n}.part "${e.name}" is not a closed mesh (${r.open} open edges), so it has no inside; close it or use fit "bounds"`);
	if (r.inconsistent > 0) throw RangeError(`${n}.part "${e.name}" has faces wound against each other (${r.inconsistent} edges), so the rasterizer cannot tell inside from outside; flip those faces or use the path tracer`);
}
function c(e, t, n) {
	let r = e.find((e) => e.name === t);
	if (r) return r;
	let i = e.map((e) => e.name).filter(Boolean), a = i.slice(0, 12).join(", ");
	throw RangeError(`${n}.part "${t}" names no part in the scene${a ? `; parts: ${a}${i.length > 12 ? ", ..." : ""}` : ""}`);
}
function l(e, t, { label: n = "environment.localVolumes" } = {}) {
	return e.some((e) => e.shape === "mesh") ? e.map((e, r) => {
		if (e.shape !== "mesh") return e;
		let i = `${n}[${r}]`, o = c(t, e.part, i);
		if (!o.geometry?.positions || !o.geometry.indices) throw TypeError(`${i}.part "${o.name}" has no geometry`);
		if (o.skin) throw RangeError(`${i}.part "${o.name}" is skinned; a mesh volume needs a rigid part`);
		let s = a(o, i);
		if (e.fit === "mesh") return {
			...e,
			...s,
			part: o
		};
		let l = { ...e };
		return delete l.part, delete l.fit, {
			...l,
			shape: "box",
			...s
		};
	}) : e;
}
export { l as n, n as r, s as t };
