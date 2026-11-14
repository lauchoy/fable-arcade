/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { h as e, n as t, o as n, p as r } from "./mat4-BCZClxna.js";
import { a as i, s as a, x as o } from "./vec3-BRYC6f_g.js";
import { s } from "./kernel-offload-A_sD9y-z.js";
import { t as c } from "./cloth-fields-Czh1DSet.js";
import { r as l } from "./force-fields-ByNKkXEw.js";
import { a as u, i as d, t as f } from "./cloth-BusI2riT.js";
import { t as p } from "./geometry-normals-DRzK4L7V.js";
import { t as m } from "./field-error-BpFTmyMO.js";
import { a as h, i as g, n as _, o as v, r as y, t as ee } from "./agent-recipe-checks-UYhtNllK.js";
import { a as te, i as ne, l as b } from "./rig-DvXCM9gw.js";
// src/agent-cloth.js
var re = .2, x = 60, ie = 10, S = 8, C = 16, w = 64, ae = .001, oe = 10, T = 100, se = 1e-4, E = [
	"top",
	"bottom",
	"left",
	"right",
	"topLeft",
	"topRight",
	"bottomLeft",
	"bottomRight"
], D = ["ball", "box"], O = ["ball", "capsule"], k = [
	"duration",
	"gravity",
	"wind",
	"fields",
	"sheets",
	"colliders"
], A = [
	"node",
	"pin",
	"pinGroup",
	"pinTo",
	"stiffnessGroup",
	"softBody",
	"selfCollision",
	"stiffness",
	"bend",
	"density",
	"damping",
	"friction",
	"thickness"
], j = ["node", "weight"], M = [
	"shape",
	"pressure",
	"bounce"
], N = .05, P = ["node", "shape"], F = [
	"attach",
	"shape",
	"radius",
	"offset",
	"to",
	"toOffset"
], I = [
	"armature",
	"radiusFraction",
	"exclude"
], L = 1e-4, R = .5, z = /^[A-Za-z0-9][A-Za-z0-9._-]{0,47}$/, B = /* @__PURE__ */ new Map();
function V(e, t, n) {
	g(e, A, n), h(e.node, t.recipeNodes, t.claimedNodes, t.motionNodeIds, t.physicsNodeIds, `${n}.node`);
	let r = { node: e.node };
	if (e.pin !== void 0) {
		let t = _(e.pin, E.length, `${n}.pin`);
		t.forEach((e, t) => {
			if (!E.includes(e)) throw m(`${n}.pin[${t}]`, e, `one of ${E.join(", ")}`);
		}), r.pin = [...new Set(t)];
	}
	if (e.pinGroup !== void 0) {
		if (typeof e.pinGroup != "string" || !z.test(e.pinGroup)) throw m(`${n}.pinGroup`, e.pinGroup, "the name of a vertex group on the sheet mesh, such as \"hem\"");
		r.pinGroup = e.pinGroup;
	}
	if (e.stiffnessGroup !== void 0) {
		if (typeof e.stiffnessGroup != "string" || !z.test(e.stiffnessGroup)) throw m(`${n}.stiffnessGroup`, e.stiffnessGroup, "the name of a vertex group on the sheet mesh whose weights scale stiffness, such as \"sleeve\"");
		r.stiffnessGroup = e.stiffnessGroup;
	}
	if (e.softBody !== void 0 && (g(e.softBody, M, `${n}.softBody`), r.softBody = {}, e.softBody.shape !== void 0 && (r.softBody.shape = y(e.softBody.shape, `${n}.softBody.shape`, 0, 1)), e.softBody.pressure !== void 0 && (r.softBody.pressure = y(e.softBody.pressure, `${n}.softBody.pressure`, 0, 3)), e.softBody.bounce !== void 0 && (r.softBody.bounce = y(e.softBody.bounce, `${n}.softBody.bounce`, 0, 1))), e.selfCollision !== void 0) {
		if (typeof e.selfCollision != "boolean") throw m(`${n}.selfCollision`, e.selfCollision, "true or false; the radius follows the mesh edge length");
		r.selfCollision = e.selfCollision;
	}
	if (e.pinTo !== void 0) {
		if (g(e.pinTo, j, `${n}.pinTo`), !r.pin?.length && !r.pinGroup) throw m(`${n}.pinTo`, e.pinTo, "a sheet that also sets pin (such as [\"top\"]) or pinGroup, because pinTo moves the pinned vertices");
		let i = H(e.pinTo.node, t, `${n}.pinTo.node`);
		if (i === e.node) throw m(`${n}.pinTo.node`, i, "a node other than the sheet itself, such as a pole or a hand");
		r.pinTo = {
			node: i,
			weight: e.pinTo.weight === void 0 ? 1 : y(e.pinTo.weight, `${n}.pinTo.weight`, .01, 1)
		};
	}
	for (let [t, [i, a]] of Object.entries({
		stiffness: [.01, 1],
		bend: [0, 1],
		density: [.01, 10],
		damping: [0, 100],
		friction: [0, 1],
		thickness: [0, .5]
	})) e[t] !== void 0 && (r[t] = y(e[t], `${n}.${t}`, i, a));
	return r;
}
function H(e, t, n) {
	if (typeof e != "string" || !t.recipeNodes.has(e)) throw m(n, e, "the ID of a node in the recipe, such as \"pole\"");
	return e;
}
function U(e, t, n) {
	g(e, F, n);
	let r = e.shape ?? "ball";
	if (!O.includes(r)) throw m(`${n}.shape`, r, `one of ${O.join(", ")}`);
	if (r === "capsule" && e.to === void 0) throw m(`${n}.to`, e.to, "the ID of the node the capsule other end rides on, such as \"hand\"");
	if (r === "ball" && e.to !== void 0) throw m(`${n}.to`, e.to, "nothing for a ball; drop it or set shape to \"capsule\"");
	let i = {
		attach: H(e.attach, t, `${n}.attach`),
		shape: r,
		radius: y(e.radius, `${n}.radius`, ae, oe)
	};
	if (e.offset !== void 0 && (i.offset = v(e.offset, `${n}.offset`, T)), r === "capsule") i.to = H(e.to, t, `${n}.to`), e.toOffset !== void 0 && (i.toOffset = v(e.toOffset, `${n}.toOffset`, T));
	else if (e.toOffset !== void 0) throw m(`${n}.toOffset`, e.toOffset, "nothing for a ball; drop it or set shape to \"capsule\"");
	return i;
}
function W(e, t, n) {
	g(e, I, n);
	let r = (t.armatures ?? []).find((t) => t.id === e.armature);
	if (!r) throw m(`${n}.armature`, e.armature, "the ID of an armature in the recipe armatures, such as \"rig\"");
	let i = { armature: r.id };
	if (e.radiusFraction !== void 0 && (i.radiusFraction = y(e.radiusFraction, `${n}.radiusFraction`, .02, .5)), e.exclude !== void 0) {
		let t = new Set(r.bones.map((e) => e.name));
		i.exclude = [...new Set(_(e.exclude, w, `${n}.exclude`))];
		for (let e of i.exclude) if (!t.has(e)) throw m(`${n}.exclude`, e, `a bone name of ${r.id}, such as "${r.bones[0]?.name ?? "spine"}"`);
	}
	return i;
}
function ce(e, t, n, r) {
	if (typeof e == "object" && e && Object.hasOwn(e, "attach")) return U(e, t, r);
	if (typeof e == "object" && e && Object.hasOwn(e, "armature")) return W(e, n, r);
	g(e, P, r), h(e.node, t.recipeNodes, t.claimedNodes, t.motionNodeIds, t.physicsNodeIds, `${r}.node`);
	let i = e.shape ?? "box";
	if (!D.includes(i)) throw m(`${r}.shape`, i, `one of ${D.join(", ")}`);
	return {
		node: e.node,
		shape: i
	};
}
function G(e, t) {
	if (e == null) return null;
	g(e, k, "cloth");
	let n = ee(t), r = { duration: y(e.duration, "cloth.duration", .1, ie) };
	if (r.sheets = _(e.sheets, S, "cloth.sheets").map((e, t) => V(e, n, `cloth.sheets[${t}]`)), !r.sheets.length) throw m("cloth.sheets", r.sheets, "at least one sheet, such as [{ \"node\": \"banner\", \"pin\": [\"top\"] }]; use cloth: null to clear it");
	if (e.gravity !== void 0 && (r.gravity = v(e.gravity, "cloth.gravity", 1e3)), e.wind !== void 0 && (r.wind = v(e.wind, "cloth.wind", 100)), e.fields !== void 0 && (r.fields = l(e.fields, "Cloth force field")), e.colliders !== void 0) {
		let i = _(e.colliders, 80, "cloth.colliders");
		_(i.filter((e) => !Object.hasOwn(e ?? {}, "attach") && !Object.hasOwn(e ?? {}, "armature")), C, "cloth.colliders"), r.colliders = i.map((e, r) => ce(e, n, t, `cloth.colliders[${r}]`));
		let a = Z(r, t).length;
		if (a > w) throw m("cloth.colliders", `${a} moving colliders`, `at most ${w} balls and capsules, counting one per armature bone; exclude bones or drop colliders`);
	}
	return r;
}
function K(e) {
	let t = [
		Infinity,
		Infinity,
		Infinity
	], n = [
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let r = 0; r < e.length; r += 3) for (let i = 0; i < 3; i++) t[i] = Math.min(t[i], e[r + i]), n[i] = Math.max(n[i], e[r + i]);
	return {
		minimum: t,
		maximum: n
	};
}
function q(e) {
	return n(t(), e.rotation, e.translation, e.scale);
}
function le(e, t, n) {
	let r = q(t), { minimum: i, maximum: a } = K(n.positions), o = i.map((e, t) => (e + a[t]) / 2), s = i.map((e, n) => Math.max((a[n] - e) / 2 * Math.abs(t.scale[n]), 1e-4)), c = [
		r[0] * o[0] + r[4] * o[1] + r[8] * o[2] + r[12],
		r[1] * o[0] + r[5] * o[1] + r[9] * o[2] + r[13],
		r[2] * o[0] + r[6] * o[1] + r[10] * o[2] + r[14]
	];
	return e.shape === "ball" ? {
		kind: "ball",
		center: c,
		radius: Math.max(...s)
	} : {
		kind: "box",
		center: c,
		axes: [
			0,
			1,
			2
		].map((e) => {
			let t = [
				r[e * 4],
				r[e * 4 + 1],
				r[e * 4 + 2]
			], n = Math.hypot(...t);
			return t.map((e) => e / n);
		}),
		halfExtents: s
	};
}
function J(e, t, n) {
	let r = e[n];
	if (!r) return null;
	let i = t.vertexGroups?.[r];
	if (!i) {
		let i = Object.keys(t.vertexGroups ?? {});
		throw m(`cloth.sheets[].${n}`, r, `a vertex group of node ${e.node} (known groups: ${i.join(", ") || "none"}); make one with a vertex_group mesh edit`);
	}
	return i;
}
var Y = (e, t) => J(e, t, "pinGroup");
function ue(e, t, n) {
	let r = J(e, t, "stiffnessGroup");
	if (r) return Float64Array.from(n, (e) => Math.max(r[e], N));
}
function X(e, t, n, r = null) {
	if (!n?.length && !r) return [];
	let i = t.map((t) => e.subarray(t * 3, t * 3 + 3)), { minimum: a, maximum: o } = K(i.reduce((e, t) => [...e, ...t], [])), s = L * Math.max(o[0] - a[0], o[1] - a[1], 1e-6), c = (e, t, n) => Math.abs(e[t] - (n === "min" ? a[t] : o[t])) <= s, l = {
		top: (e) => c(e, 1, "max"),
		bottom: (e) => c(e, 1, "min"),
		left: (e) => c(e, 0, "min"),
		right: (e) => c(e, 0, "max"),
		topLeft: (e) => c(e, 1, "max") && c(e, 0, "min"),
		topRight: (e) => c(e, 1, "max") && c(e, 0, "max"),
		bottomLeft: (e) => c(e, 1, "min") && c(e, 0, "min"),
		bottomRight: (e) => c(e, 1, "min") && c(e, 0, "max")
	}, u = [];
	return i.forEach((e, i) => {
		let a = n?.some((t) => l[t](e)), o = r !== null && r[t[i]] >= R;
		(a || o) && u.push(i);
	}), u;
}
function Z(e, t) {
	let n = new Map(t.nodes.map((e) => [e.id, e])), r = [];
	for (let i of e.colliders ?? []) if (i.attach !== void 0) {
		let e = [
			0,
			0,
			0
		];
		r.push(i.shape === "ball" ? {
			kind: "ball",
			node: i.attach,
			offset: i.offset ?? e,
			radius: i.radius
		} : {
			kind: "capsule",
			startNode: i.attach,
			startOffset: i.offset ?? e,
			endNode: i.to,
			endOffset: i.toOffset ?? e,
			radius: i.radius
		});
	} else i.armature !== void 0 && r.push(...de(i, t, n));
	return r;
}
function de(e, n, s) {
	let c = n.armatures.find((t) => t.id === e.armature), l = b(c.id, s), u = te(c), d = new Set(e.exclude ?? []), f = [];
	return c.bones.forEach((n, p) => {
		if (d.has(n.name)) return;
		let m = ne(c, n.name), h = b(m, s), g = o(i(), [
			0,
			0,
			0
		], h), _ = o(i(), u[p], l), v = a(g, _);
		if (v < se) return;
		let y = o(i(), _, r(t(), h));
		f.push({
			kind: "capsule",
			startNode: m,
			startOffset: [
				0,
				0,
				0
			],
			endNode: m,
			endOffset: Array.from(y),
			radius: v * (e.radiusFraction ?? re)
		});
	}), f;
}
function fe(r, i) {
	let a = new Map(r.nodes.map((e) => [e.id, e]));
	return function(r) {
		let o = i ? i.sample(r).nodes : B, s = /* @__PURE__ */ new Map(), c = (r) => {
			let i = s.get(r);
			if (!i) {
				let l = a.get(r), u = o.get(r);
				i = n(t(), u?.rotation ?? l.rotation, u?.translation ?? l.translation, u?.scale ?? l.scale), l.parent !== null && e(i, c(l.parent), i), s.set(r, i);
			}
			return i;
		};
		return c;
	};
}
function pe(e) {
	let t = [];
	for (let n = 1; n < e; n++) for (let e = 1; e <= f.substeps; e++) t.push((n - 1 + e / f.substeps) / x);
	return t;
}
function me(e, t, n) {
	let r = new Float64Array(n.length * e.length * 7), a = i(), s = (e, t, n, i) => {
		o(a, i, t(n)), r.set(a, e);
	};
	return n.forEach((n, i) => {
		let a = t(n);
		e.forEach((t, n) => {
			let o = (i * e.length + n) * 7, c = t.kind === "ball";
			s(o, a, c ? t.node : t.startNode, c ? t.offset : t.startOffset), s(o + 3, a, c ? t.node : t.endNode, c ? t.offset : t.endOffset), r[o + 6] = t.radius;
		});
	}), r;
}
function Q(e, n, a, s, c) {
	let l = r(t(), s(0)(e.node)), u = n.map((e) => o(i(), a.subarray(e * 3, e * 3 + 3), l)), d = new Float64Array(c.length * n.length * 3), f = i();
	return c.forEach((t, r) => {
		let i = s(t)(e.node);
		u.forEach((e, t) => {
			o(f, e, i), d.set(f, (r * n.length + t) * 3);
		});
	}), d;
}
function he(e, t, n, r, i) {
	let { specs: a, worldMatricesAt: o } = r, s = pe(i);
	r.colliderTrack ??= me(a, o, s);
	let c = Uint32Array.from(e.pinTo ? t : []);
	return {
		anchorParticles: c,
		anchorWeights: new Float64Array(c.length).fill(e.pinTo?.weight ?? 1),
		anchorTrack: e.pinTo ? Q(e.pinTo, t, n, o, s) : /* @__PURE__ */ new Float64Array(),
		colliderCount: a.length,
		colliderTrack: r.colliderTrack
	};
}
function ge(e, n, i, a, o, l, d) {
	let f = u(a.positions, a.indices), p = q(i), m = new Float64Array(f.representatives.length * 3);
	f.representatives.forEach((e, t) => {
		let n = a.positions.subarray(e * 3, e * 3 + 3), r = [
			0,
			0,
			0
		];
		for (let e = 0; e < 3; e++) r[e] = p[e] * n[0] + p[4 + e] * n[1] + p[8 + e] * n[2] + p[12 + e];
		m.set(r, t * 3);
	});
	let h = X(a.positions, f.representatives, e.pin, Y(e, a)), g = d && (e.pinTo || d.specs.length) ? he(e, h, m, d, l) : null, _ = Object.freeze({ ...s("cloth", [
		m,
		f.triangles,
		{
			pinned: e.pinTo ? [] : h,
			moving: g,
			stiffnessWeights: ue(e, a, f.representatives),
			softBody: e.softBody,
			selfCollision: e.selfCollision,
			gravity: n.gravity,
			wind: n.wind,
			fields: n.fields,
			stiffness: e.stiffness,
			bend: e.bend,
			density: e.density,
			damping: e.damping,
			friction: e.friction,
			thickness: e.thickness,
			colliders: o,
			frameCount: l,
			framesPerSecond: x
		}
	], c) });
	return {
		recording: _,
		welded: f,
		inverse: r(t(), p),
		geometry: a,
		particleScratch: new Float32Array(_.particleCount * 3),
		live: _e(a)
	};
}
var $ = /* @__PURE__ */ new WeakSet();
function _e(e) {
	let t = Object.freeze({
		...e,
		positions: Float32Array.from(e.positions),
		normals: Float32Array.from(e.normals)
	});
	return $.add(t), t;
}
function ve(e) {
	return $.has(e);
}
function ye(e, t) {
	let { recording: n, welded: r, inverse: i, geometry: a, particleScratch: o, live: s } = e;
	d(n, t, o);
	let c = s.positions;
	for (let e = 0; e < r.particleOfVertex.length; e++) {
		let t = r.particleOfVertex[e] * 3;
		for (let n = 0; n < 3; n++) c[e * 3 + n] = i[n] * o[t] + i[4 + n] * o[t + 1] + i[8 + n] * o[t + 2] + i[12 + n];
	}
	return s.normals.set(p(a, c)), s;
}
function be(e, t, n) {
	let { recording: r, welded: i, geometry: a } = e, o = new Float32Array(r.particleCount * 3);
	d(r, Infinity, o);
	let s = [
		Infinity,
		Infinity,
		Infinity
	], c = [
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let e = 0; e < o.length; e += 3) for (let t = 0; t < 3; t++) s[t] = Math.min(s[t], o[e + t]), c[t] = Math.max(c[t], o[e + t]);
	let l = (e) => e.map((e) => Number(e.toFixed(4)));
	return {
		node: t.id,
		particles: r.particleCount,
		triangles: i.triangles.length / 3,
		vertices: a.positions.length / 3,
		pinned: X(a.positions, i.representatives, n.pin, Y(n, a)).length,
		finalBoundsMin: l(s),
		finalBoundsMax: l(c)
	};
}
function xe(e, t, n, r = null) {
	let i = new Map(t.nodes.map((e) => [e.id, e])), a = Math.round(e.duration * x) + 1, o = Z(e, t), s = o.length > 0 || e.sheets.some((e) => e.pinTo) ? {
		specs: o,
		worldMatricesAt: fe(t, r)
	} : null, c = (e.colliders ?? []).filter((e) => e.node !== void 0).map((e) => le(e, i.get(e.node), n.get(i.get(e.node).geometry))), l = new Map(e.sheets.map((t) => {
		let r = i.get(t.node);
		return [t.node, ge(t, e, r, n.get(r.geometry), c, a, s)];
	})), u = null;
	return Object.freeze({
		duration: e.duration,
		sample(t) {
			if (t <= 0) return null;
			let n = Math.min(t, e.duration);
			return new Map([...l].map(([e, t]) => [e, ye(t, n)]));
		},
		report() {
			return u ??= {
				duration: e.duration,
				frames: a,
				gravity: e.gravity ?? [
					0,
					-9.81,
					0
				],
				wind: e.wind ?? [
					0,
					0,
					0
				],
				fields: e.fields ?? [],
				sheets: e.sheets.map((e) => be(l.get(e.node), i.get(e.node), e))
			}, structuredClone(u);
		}
	});
}
export { xe as bakeAgentCloth, ve as isLiveClothGeometry, Z as movingColliderSpecs, G as normalizeAgentCloth };
