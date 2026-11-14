/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
// src/export-mesh.js
var e = 1e6, t = [
	"opaque",
	"mask",
	"blend",
	"add"
], n = [
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
function r(e, t) {
	for (let n of e) if (!Number.isFinite(n)) throw RangeError(`OBJ export requires finite ${t}.`);
}
function i(e, t, n = 1) {
	if (!Number.isFinite(e) || e < 0 || e > n) throw RangeError(`OBJ export requires ${t} to be a finite number ${n === 1 ? "within [0,1]" : "of at least 0"}.`);
}
function a(e, t) {
	if (!e || e.length !== 3) throw TypeError(`OBJ export requires ${t} as three linear RGB components.`);
	for (let n of e) i(n, t);
}
function o(e, n) {
	let { uvs: o, normals: s } = e.geometry;
	o?.length === n * 2 && r(o, "geometry.uvs"), s?.length === n * 3 && r(s, "geometry.normals");
	let c = e.material;
	if (c !== void 0) {
		if (typeof c != "object" || !c) throw TypeError("OBJ export requires part.material to be an object.");
		if (c.color !== void 0 && a(c.color, "material.color"), c.emissiveColor !== void 0 && a(c.emissiveColor, "material.emissiveColor"), c.roughness !== void 0 && i(c.roughness, "material.roughness"), c.metallic !== void 0 && i(c.metallic, "material.metallic"), c.emission !== void 0 && i(c.emission, "material.emission", Infinity), c.alphaMode !== void 0 && !t.includes(c.alphaMode)) throw TypeError("OBJ export requires material.alphaMode to be 'opaque', 'mask', 'blend' or 'add'.");
		c.opacity !== void 0 && i(c.opacity, "material.opacity");
	}
}
function s(t, n) {
	if (!Array.isArray(t) || t.length === 0) throw TypeError(`${n} export requires a nonempty parts array.`);
	let r = 0;
	for (let i of t) {
		let { positions: t, indices: a } = i?.geometry ?? {};
		if (!t || t.length < 9 || t.length % 3 != 0) throw TypeError(`${n} export requires geometry.positions with XYZ vertices on every part.`);
		for (let e of t) if (!Number.isFinite(e)) throw RangeError(`${n} export requires finite positions.`);
		if (!(a instanceof Uint32Array) || a.length === 0 || a.length % 3 != 0) throw TypeError(`${n} export requires geometry.indices as a nonempty Uint32Array of triangles.`);
		let s = t.length / 3;
		for (let e of a) if (e >= s) throw RangeError(`${n} export found an index past the ${s} vertices.`);
		if (i.matrix !== void 0 && (i.matrix.length !== 16 || Array.from(i.matrix).some((e) => !Number.isFinite(e)))) throw RangeError(`${n} export requires part.matrix with 16 finite components.`);
		if (n === "OBJ" && o(i, s), r += a.length / 3, r > 1e6) throw RangeError(`${n} export is limited to ${e} triangles. Simplify the scene or export fewer parts.`);
	}
}
function c(e) {
	let t = e.matrix ?? n, { positions: r, indices: i } = e.geometry, a = r.length / 3, o = new Float64Array(a * 3);
	for (let e = 0; e < a; e++) {
		let n = r[e * 3], i = r[e * 3 + 1], a = r[e * 3 + 2];
		for (let r = 0; r < 3; r++) o[e * 3 + r] = t[r] * n + t[4 + r] * i + t[8 + r] * a + t[12 + r];
	}
	let s = t[0] * (t[5] * t[10] - t[9] * t[6]) - t[4] * (t[1] * t[10] - t[9] * t[2]) + t[8] * (t[1] * t[6] - t[5] * t[2]) < 0, c = new Uint32Array(i);
	if (s) for (let e = 0; e < c.length; e += 3) {
		let t = c[e + 1];
		c[e + 1] = c[e + 2], c[e + 2] = t;
	}
	return {
		world: o,
		triangles: c,
		matrix: t
	};
}
function l(e, t, n, r) {
	let i = [
		0,
		1,
		2
	].map((r) => e[n * 3 + r] - e[t * 3 + r]), a = [
		0,
		1,
		2
	].map((n) => e[r * 3 + n] - e[t * 3 + n]), o = [
		i[1] * a[2] - i[2] * a[1],
		i[2] * a[0] - i[0] * a[2],
		i[0] * a[1] - i[1] * a[0]
	], s = Math.hypot(...o);
	return s === 0 ? [
		0,
		0,
		0
	] : o.map((e) => e / s);
}
function u(e) {
	s(e, "STL");
	let t = e.map(c), n = t.reduce((e, t) => e + t.triangles.length / 3, 0), r = /* @__PURE__ */ new ArrayBuffer(84 + n * 50), i = new DataView(r);
	new Uint8Array(r, 0, 80).set(new TextEncoder().encode("67js binary STL")), i.setUint32(80, n, !0);
	let a = 84;
	for (let { world: e, triangles: n } of t) for (let t = 0; t < n.length; t += 3) {
		let r = n[t], o = n[t + 1], s = n[t + 2];
		for (let t of l(e, r, o, s)) i.setFloat32(a, t, !0), a += 4;
		for (let t of [
			r,
			o,
			s
		]) for (let n = 0; n < 3; n++) i.setFloat32(a, e[t * 3 + n], !0), a += 4;
		a += 2;
	}
	return r;
}
function d(e) {
	let t = Number(e.toPrecision(9));
	return String(t === 0 ? 0 : t);
}
function f(e, t) {
	return String(e ?? "").replace(/[^A-Za-z0-9_.-]+/g, "_").slice(0, 64) || t;
}
function p(e) {
	return JSON.stringify([
		e?.color,
		e?.emissiveColor,
		e?.emission,
		e?.metallic,
		e?.roughness,
		m(e)
	]);
}
function m(e) {
	return (e?.alphaMode ?? "opaque") === "opaque" ? 1 : e.opacity ?? 1;
}
function h(e, t) {
	let n = t?.color ?? [
		.8,
		.8,
		.8
	], r = [`newmtl ${e}`, `Kd ${n.map(d).join(" ")}`];
	if ((t?.emission ?? 0) > 0) {
		let e = (t.emissiveColor ?? n).map((e) => e * Math.min(t.emission, 1));
		r.push(`Ke ${e.map(d).join(" ")}`);
	}
	return r.push(`Pr ${d(t?.roughness ?? .5)}`, `Pm ${d(t?.metallic ?? 0)}`, `d ${d(m(t))}`), r.join("\n");
}
function g(e, t = {}) {
	s(e, "OBJ");
	let n = t.mtlFilename ?? "model.mtl";
	if (typeof n != "string" || !/^[A-Za-z0-9_.-]{1,64}\.mtl$/.test(n)) throw TypeError("OBJ export mtlFilename must be a plain file name ending in .mtl, such as \"model.mtl\".");
	let r = /* @__PURE__ */ new Map(), i = [], a = ["67js OBJ export", `mtllib ${n}`], o = 1, l = 1, u = 1;
	return e.forEach((e, t) => {
		let { world: n, triangles: s, matrix: m } = c(e), g = p(e.material);
		if (!r.has(g)) {
			let t = `material_${r.size}`;
			r.set(g, t), i.push(h(t, e.material));
		}
		a.push(`o ${f(e.name, `part_${t}`)}`, `usemtl ${r.get(g)}`);
		let v = n.length / 3;
		for (let e = 0; e < v; e++) a.push(`v ${d(n[e * 3])} ${d(n[e * 3 + 1])} ${d(n[e * 3 + 2])}`);
		let y = e.geometry.uvs?.length === v * 2 ? e.geometry.uvs : null;
		if (y) for (let e = 0; e < v; e++) a.push(`vt ${d(y[e * 2])} ${d(y[e * 2 + 1])}`);
		let b = e.geometry.normals?.length === v * 3 ? _(e.geometry.normals, m) : null;
		if (b) for (let e = 0; e < v; e++) a.push(`vn ${d(b[e * 3])} ${d(b[e * 3 + 1])} ${d(b[e * 3 + 2])}`);
		for (let e = 0; e < s.length; e += 3) {
			let t = [
				0,
				1,
				2
			].map((t) => {
				let n = s[e + t], r = n + o, i = n + u;
				return y && b ? `${r}/${n + l}/${i}` : y ? `${r}/${n + l}` : b ? `${r}//${i}` : `${r}`;
			});
			a.push(`f ${t.join(" ")}`);
		}
		o += v, y && (l += v), b && (u += v);
	}), {
		obj: `${a.join("\n")}\n`,
		mtl: `# 67js MTL export\n${i.join("\n\n")}\n`
	};
}
function _(e, t) {
	let [n, r, i, , a, o, s, , c, l, u] = t, d = [
		o * u - s * l,
		s * c - a * u,
		a * l - o * c,
		i * l - r * u,
		n * u - i * c,
		r * c - n * l,
		r * s - i * o,
		i * a - n * s,
		n * o - r * a
	], f = new Float64Array(e.length), p = n * d[0] + r * d[1] + i * d[2] < 0 ? -1 : 1;
	for (let t = 0; t < e.length; t += 3) {
		let n = e[t], r = e[t + 1], i = e[t + 2], a = [
			0,
			1,
			2
		].map((e) => p * (d[e] * n + d[3 + e] * r + d[6 + e] * i)), o = Math.hypot(...a) || 1;
		for (let e = 0; e < 3; e++) f[t + e] = a[e] / o;
	}
	return f;
}
export { e as MAX_MESH_EXPORT_TRIANGLES, g as exportObj, u as exportStl };
