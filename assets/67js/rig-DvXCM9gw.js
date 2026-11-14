/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { d as e, h as t, l as n, n as r, o as i, p as a, u as o } from "./mat4-BCZClxna.js";
import { a as s, c, d as l, m as u, s as d, x as f, y as p } from "./vec3-BRYC6f_g.js";
import { r as m } from "./animation-CO9Tq0E0.js";
import { i as h, t as g } from "./skinning-DjFQA5hH.js";
// src/rig-presets.js
var _ = Object.freeze(["humanoid", "quadruped"]), v = .012, y = -.012;
function b(e) {
	return {
		size: e.max.map((t, n) => t - e.min[n]),
		center: e.max.map((t, n) => (t + e.min[n]) / 2),
		floorY: e.min[1],
		minimumZ: e.min[2]
	};
}
function x(e) {
	let { size: t, center: n, floorY: r } = b(e), i = t[1], a = (e, t, a) => [
		n[0] + e * i,
		r + t * i,
		n[2] + a * i
	], o = [
		{
			name: "hips",
			parent: null,
			head: a(0, .52, 0)
		},
		{
			name: "spine",
			parent: "hips",
			head: a(0, .58, 0)
		},
		{
			name: "chest",
			parent: "spine",
			head: a(0, .68, 0)
		},
		{
			name: "neck",
			parent: "chest",
			head: a(0, .8, 0)
		},
		{
			name: "head",
			parent: "neck",
			head: a(0, .86, 0),
			tail: a(0, 1, 0)
		}
	];
	for (let [e, t] of [["left", 1], ["right", -1]]) {
		let n = (t) => `${e}${t}`;
		o.push({
			name: n("Shoulder"),
			parent: "chest",
			head: a(t * .03, .77, 0)
		}, {
			name: n("UpperArm"),
			parent: n("Shoulder"),
			head: a(t * .1, .77, 0)
		}, {
			name: n("LowerArm"),
			parent: n("UpperArm"),
			head: a(t * .12, .6, y)
		}, {
			name: n("Hand"),
			parent: n("LowerArm"),
			head: a(t * .135, .45, 0),
			tail: a(t * .145, .37, 0)
		}, {
			name: n("UpperLeg"),
			parent: "hips",
			head: a(t * .06, .5, 0)
		}, {
			name: n("LowerLeg"),
			parent: n("UpperLeg"),
			head: a(t * .065, .28, v)
		}, {
			name: n("Foot"),
			parent: n("LowerLeg"),
			head: a(t * .065, .05, 0)
		}, {
			name: n("Toes"),
			parent: n("Foot"),
			head: a(t * .065, .02, .07),
			tail: a(t * .065, .02, .12)
		});
	}
	return o;
}
function S(e) {
	let { size: t, center: n, floorY: r, minimumZ: i } = b(e), [a, o, s] = t, c = (e, t, c) => [
		n[0] + e * a,
		r + t * o,
		i + c * s
	], l = [
		{
			name: "hips",
			parent: null,
			head: c(0, .62, .25)
		},
		{
			name: "spine",
			parent: "hips",
			head: c(0, .64, .45)
		},
		{
			name: "chest",
			parent: "spine",
			head: c(0, .64, .65)
		},
		{
			name: "neck",
			parent: "chest",
			head: c(0, .72, .78)
		},
		{
			name: "head",
			parent: "neck",
			head: c(0, .85, .86),
			tail: c(0, .85, 1)
		},
		{
			name: "tail1",
			parent: "hips",
			head: c(0, .64, .18)
		},
		{
			name: "tail2",
			parent: "tail1",
			head: c(0, .6, .1)
		},
		{
			name: "tail3",
			parent: "tail2",
			head: c(0, .55, .04),
			tail: c(0, .5, 0)
		}
	];
	for (let [e, t] of [["left", 1], ["right", -1]]) {
		let n = t * .28;
		l.push({
			name: `${e}FrontUpperLeg`,
			parent: "chest",
			head: c(n, .6, .65)
		}, {
			name: `${e}FrontLowerLeg`,
			parent: `${e}FrontUpperLeg`,
			head: c(n, .33, .638)
		}, {
			name: `${e}FrontFoot`,
			parent: `${e}FrontLowerLeg`,
			head: c(n, .1, .65),
			tail: c(n, 0, .68)
		}, {
			name: `${e}HindUpperLeg`,
			parent: "hips",
			head: c(n, .6, .25)
		}, {
			name: `${e}HindLowerLeg`,
			parent: `${e}HindUpperLeg`,
			head: c(n, .33, .298)
		}, {
			name: `${e}HindFoot`,
			parent: `${e}HindLowerLeg`,
			head: c(n, .1, .25),
			tail: c(n, 0, .28)
		});
	}
	return l;
}
var C = {
	humanoid: x,
	quadruped: S
};
function w(e, t, n = {}) {
	if (!Object.hasOwn(C, e)) throw RangeError(`Armature preset must be one of ${_.join(", ")}.`);
	let r = /* @__PURE__ */ new Set(), i = C[e](t).map((e) => (r.add(e.name), {
		...e,
		head: n[e.name] ?? e.head,
		...e.tail || n[`${e.name}Tail`] ? { tail: n[`${e.name}Tail`] ?? e.tail } : {}
	}));
	for (let t of Object.keys(n)) {
		let n = t.endsWith("Tail") ? t.slice(0, -4) : t;
		if (!r.has(n)) throw RangeError(`Landmark ${t} does not name a ${e} bone. Bones: ${[...r].join(", ")}.`);
	}
	return i;
}
var T = 4, E = 4, D = .02, O = .25, k = .002, A = 1e-6, j = 256, M = [
	0,
	0,
	1
];
function N(e, t) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw TypeError(`${t} must be an object.`);
}
function P(e, t, n) {
	N(e, n);
	for (let r of Object.keys(e)) if (!t.includes(r)) throw TypeError(`${n} has an unsupported field: ${JSON.stringify(r.slice(0, 48))}.`);
}
function F(e, t) {
	if (typeof e != "string" || !e.trim() || e.length > 64) throw TypeError(`${t} must be a name of 1 to 64 characters.`);
	return e;
}
function I(e, t, n) {
	if (!Array.isArray(e) || e.length !== t || e.some((e) => !Number.isFinite(e))) throw TypeError(`${n} must be an array of ${t} finite numbers.`);
	return e.slice();
}
function L(e, t) {
	P(e, ["min", "max"], t);
	let n = {
		min: I(e.min, 3, `${t} min`),
		max: I(e.max, 3, `${t} max`)
	};
	if (n.max.some((e, t) => e <= n.min[t])) throw RangeError(`${t} must have max above min on every axis.`);
	return n;
}
function R(e, t) {
	let n = new Map(e.map((e) => [e.name, e])), r = [], i = /* @__PURE__ */ new Map();
	function a(e) {
		if (i.get(e.name) !== 2) {
			if (i.get(e.name) === 1) throw RangeError(`Armature ${t} bones form a cycle at ${e.name}.`);
			i.set(e.name, 1), e.parent !== null && a(n.get(e.parent)), i.set(e.name, 2), r.push(e);
		}
	}
	return e.forEach(a), r;
}
function z(e, t) {
	if (!Array.isArray(e) || e.length < 1 || e.length > 128) throw RangeError(`Armature ${t} needs 1 to 128 bones.`);
	let n = /* @__PURE__ */ new Set(), r = e.map((e, r) => {
		let i = `Armature ${t} bone ${r}`;
		P(e, [
			"name",
			"parent",
			"head",
			"tail"
		], i);
		let a = F(e.name, `${i} name`);
		if (n.has(a)) throw RangeError(`Armature ${t} repeats bone ${a}.`);
		n.add(a);
		let o = {
			name: a,
			parent: e.parent === void 0 || e.parent === null ? null : F(e.parent, `${i} parent`),
			head: I(e.head, 3, `${i} head`)
		};
		return e.tail !== void 0 && (o.tail = I(e.tail, 3, `${i} tail`)), o;
	});
	for (let e of r) if (e.parent !== null && !n.has(e.parent)) throw RangeError(`Armature ${t} bone ${e.name} names an unknown parent ${e.parent}.`);
	return R(r, t);
}
function B(e, t, n) {
	if (t === void 0) throw TypeError(`Armature ${e.id} preset needs fit: { node } or fit: { bounds }.`);
	if (P(t, [
		"node",
		"bounds",
		"landmarks"
	], `Armature ${e.id} fit`), t.node === void 0 == (t.bounds === void 0)) throw TypeError(`Armature ${e.id} fit takes node or bounds, not both.`);
	return t.bounds === void 0 ? n(e, t.node) : L(t.bounds, `Armature ${e.id} fit bounds`);
}
function V(e, t) {
	return e === void 0 ? {} : (N(e, `Armature ${t} landmarks`), Object.fromEntries(Object.entries(e).map(([e, n]) => [e, I(n, 3, `Armature ${t} landmark ${e}`)])));
}
function H(e, { resolveBounds: t }) {
	if (!Array.isArray(e) || e.length > 16) throw RangeError("armatures must be an array of at most 16.");
	let n = /* @__PURE__ */ new Set();
	return e.map((e) => {
		P(e, [
			"id",
			"parent",
			"translation",
			"rotation",
			"prefix",
			"preset",
			"fit",
			"bones"
		], "armature");
		let r = F(e.id, "armature id");
		if (n.has(r)) throw RangeError(`Duplicate armature ID: ${r}.`);
		n.add(r);
		let i = I(e.rotation ?? [
			0,
			0,
			0,
			1
		], 4, `Armature ${r} rotation`), a = Math.hypot(...i);
		if (a === 0) throw RangeError(`Armature ${r} rotation must be nonzero.`);
		let o = {
			id: r,
			parent: e.parent === void 0 || e.parent === null ? null : F(e.parent, `Armature ${r} parent`),
			translation: I(e.translation ?? [
				0,
				0,
				0
			], 3, `Armature ${r} translation`),
			rotation: i.map((e) => e / a),
			prefix: e.prefix === void 0 || e.prefix === "" ? "" : F(e.prefix, `Armature ${r} prefix`)
		};
		if (e.preset === void 0 == (e.bones === void 0)) throw TypeError(`Armature ${r} needs preset or bones, not both.`);
		if (e.preset === void 0) {
			if (e.fit !== void 0) throw TypeError(`Armature ${r} fit only applies to a preset.`);
			return {
				...o,
				bones: z(e.bones, r)
			};
		}
		if (!_.includes(e.preset)) throw RangeError(`Armature ${r} preset must be one of ${_.join(", ")}.`);
		let s = B(o, e.fit, t);
		return {
			...o,
			bones: z(w(e.preset, s, V(e.fit.landmarks, r)), r)
		};
	});
}
function U(e, t) {
	return `${e.prefix}${t}`;
}
function W(e) {
	let t = new Map(e.bones.map((e) => [e.name, e.head]));
	return [{
		id: e.id,
		parent: e.parent,
		translation: e.translation,
		rotation: e.rotation,
		scale: [
			1,
			1,
			1
		],
		armature: e.id
	}, ...e.bones.map((n) => {
		let r = n.parent === null ? [
			0,
			0,
			0
		] : t.get(n.parent);
		return {
			id: U(e, n.name),
			parent: n.parent === null ? e.id : U(e, n.parent),
			translation: n.head.map((e, t) => e - r[t]),
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
			armature: e.id
		};
	})];
}
function G(e) {
	return Array.isArray(e) ? e.filter((e) => !Object.hasOwn(e ?? {}, "armature")) : e;
}
function K(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.bones) n.parent !== null && t.set(n.parent, [...t.get(n.parent) ?? [], n]);
	let n = new Map(e.bones.map((e) => [e.name, e.head]));
	return e.bones.map((e) => {
		if (e.tail) return e.tail;
		let r = t.get(e.name);
		return r ? [
			0,
			1,
			2
		].map((e) => r.reduce((t, n) => t + n.head[e], 0) / r.length) : e.parent === null ? [
			e.head[0],
			e.head[1] + .1,
			e.head[2]
		] : e.head.map((t, r) => t + (t - n.get(e.parent)[r]) * .5);
	});
}
function q(e, n, a = []) {
	let o = r(), s = e;
	for (let c = 0; s != null; c++) {
		if (c > j) throw RangeError(`Node ${e} has a parent chain that never ends.`);
		let l = n.get(s) ?? a.find((e) => e.id === s);
		if (!l) throw RangeError(`Unknown node or armature ${JSON.stringify(String(s).slice(0, 48))} in a parent chain.`);
		t(o, i(r(), l.rotation, l.translation, l.scale ?? [
			1,
			1,
			1
		]), o), s = l.parent;
	}
	return o;
}
function ee(e, t) {
	let n = [
		Infinity,
		Infinity,
		Infinity
	], r = [
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let i = 0; i < 8; i++) f(s(), [
		0,
		1,
		2
	].map((t) => i & 1 << t ? e.max[t] : e.min[t]), t).forEach((e, t) => {
		n[t] = Math.min(n[t], e), r[t] = Math.max(r[t], e);
	});
	return {
		min: n,
		max: r
	};
}
function J(e, t, n, r, i) {
	let a = i[0] - r[0], o = i[1] - r[1], s = i[2] - r[2], c = a * a + o * o + s * s, l = c === 0 ? 0 : ((e - r[0]) * a + (t - r[1]) * o + (n - r[2]) * s) / c, u = Math.min(1, Math.max(0, l)), d = e - (r[0] + a * u), f = t - (r[1] + o * u), p = n - (r[2] + s * u);
	return d * d + f * f + p * p;
}
function Y(e, t) {
	let n = [], r = /* @__PURE__ */ new Set();
	for (let i = 0; i < t; i++) {
		let t = -1;
		for (let n = 0; n < e.length; n++) !r.has(n) && (t < 0 || e[n] > e[t]) && (t = n);
		if (t < 0 || e[t] <= 0) break;
		r.add(t), n.push(t);
	}
	return n;
}
function X({ positions: e, meshMatrix: t, segments: n, maxInfluences: r = T, maxDistance: i, softness: a }) {
	let o = e.length / 3, c = new Uint16Array(o * 4), l = new Float32Array(o * 4), u = new Float64Array(n.length), d = new Float64Array(n.length), p = new Float64Array(n.length), m = s(), h = [];
	for (let s = 0; s < o; s++) {
		f(m, [
			e[s * 3],
			e[s * 3 + 1],
			e[s * 3 + 2]
		], t);
		let o = Infinity;
		n.forEach((e, t) => {
			p[t] = Math.sqrt(J(m[0], m[1], m[2], e.head, e.tail)), o = Math.min(o, p[t]);
		}), o > i && h.push(s);
		for (let e = 0; e < n.length; e++) d[e] = ((o + a) / (p[e] + a)) ** E;
		let g = Y(d, r), _ = g.reduce((e, t) => e + d[t], 0);
		g.forEach((e, t) => {
			c[s * 4 + t] = e, l[s * 4 + t] = d[e] / _, u[e] += d[e] / _;
		});
	}
	return {
		indices: c,
		weights: l,
		unweighted: h,
		boneTotals: u
	};
}
function Z(e, t) {
	return {
		maxInfluences: e.maxInfluences ?? T,
		maxDistance: e.maxDistance ?? t * O,
		softness: t * D
	};
}
function Q(e, t) {
	let n = K(e);
	return e.bones.map((e, r) => ({
		head: Array.from(f(s(), e.head, t)),
		tail: Array.from(f(s(), n[r], t))
	}));
}
function $(e) {
	let t = [
		Infinity,
		Infinity,
		Infinity
	], n = [
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let { head: r, tail: i } of e) for (let e of [r, i]) e.forEach((e, r) => {
		t[r] = Math.min(t[r], e), n[r] = Math.max(n[r], e);
	});
	return Math.max(...n.map((e, n) => e - t[n]), 1e-6);
}
function te(e, t, n) {
	let i = e.bones.length, o = g(i), s = new Float32Array(i * 16);
	return t.forEach((e, t) => s.set(a(r(), e), t * 16)), Object.assign(o, {
		joints: e.bones.map((t) => ({
			name: U(e, t.name),
			parent: t.parent === null ? -1 : e.bones.findIndex((e) => e.name === t.parent)
		})),
		inverseBindMatrices: s,
		bindMatrix: Float32Array.from(n),
		jointWorldMatrices: new Float32Array(i * 16)
	});
}
function ne({ recipe: e, graph: t, geometryRecords: n, cache: r }) {
	let i = /* @__PURE__ */ new Map();
	for (let a of e.nodes.filter((e) => e.skin)) {
		let o = e.armatures?.find((e) => e.id === a.skin.armature);
		if (!o) throw RangeError(`Node ${a.id} skin names armature ${a.skin.armature}, which is not in armatures.`);
		let s = n.get(a.geometry), c = t.getNode(a.id).worldMatrix, l = o.bones.map((e) => U(o, e.name)), u = l.map((e) => t.getNode(e).worldMatrix), d = JSON.stringify([
			s.signature,
			o,
			a.skin,
			Array.from(c),
			u.map((e) => Array.from(e))
		]), f = r.get(a.id);
		if (f?.key === d) {
			i.set(a.id, f);
			continue;
		}
		let p = Q(o, t.getNode(o.id).worldMatrix), m = $(p), h = X({
			positions: s.geometry.positions,
			meshMatrix: c,
			segments: p,
			...Z(a.skin, m)
		}), g = Object.freeze({
			...s.geometry,
			skinIndices: h.indices,
			skinWeights: h.weights
		}), _ = {
			node: a.id,
			armature: o.id,
			vertices: s.geometry.positions.length / 3,
			unweightedVertices: h.unweighted.length,
			boneWeight: h.boneTotals
		}, v = {
			key: d,
			geometry: g,
			skin: te(o, u, c),
			armature: o,
			boneIds: l,
			report: _
		};
		r.set(a.id, v), i.set(a.id, v);
	}
	return i;
}
function re(e, t) {
	for (let { binding: n, scratch: r, jointWorlds: i, meshNodeId: a } of e) n.boneIds.forEach((e, n) => i.set(t.getNode(e).worldMatrix, n * 16)), h(r, i, n.skin.inverseBindMatrices, t.getNode(a).worldMatrix, n.skin.bindMatrix);
}
function ie(e) {
	for (let { binding: t, scratch: n, jointWorlds: r } of e) t.skin.jointMatrices.set(n.jointMatrices), t.skin.jointWorldMatrices.set(r);
}
function ae(e) {
	return [...e].map(([e, t]) => ({
		meshNodeId: e,
		binding: t,
		scratch: g(t.boneIds.length),
		jointWorlds: new Float32Array(t.boneIds.length * 16)
	}));
}
function oe(e, t, n, r, i) {
	let a = new Map(e.bones.map((e, n) => [e.name, {
		bone: e,
		tail: t[n]
	}])), o = a.get(n), d = a.get(r), f = a.get(o.bone.parent), m = p(s(), d.bone.head, f.bone.head), h = p(s(), o.bone.head, f.bone.head), g = l(m);
	if (g < A) return null;
	let _ = u(s(), m, c(h, m) / (g * g)), v = p(s(), h, _);
	if (l(v) / g < k) return {
		bone: n,
		problem: "straight-chain",
		detail: `${f.bone.name}, ${n} and ${r} are collinear at rest, so a two-bone solve has no bend direction unless it gets a pole.`
	};
	let y = c(v, M);
	return (i ? y < 0 : y > 0) ? {
		bone: n,
		problem: i ? "knee-bends-backward" : "elbow-bends-forward",
		detail: `${n} sits ${i ? "behind" : "in front of"} the line from ${f.bone.name} to ${r} on a character facing +Z, so a poleless solve folds the joint the wrong way.`
	} : null;
}
function se(e) {
	let t = K(e), n = [];
	e.bones.forEach((e, r) => {
		d(e.head, t[r]) < A && n.push({
			bone: e.name,
			problem: "zero-length",
			detail: `${e.name} has its tail at its head.`
		});
	});
	for (let r of e.bones) {
		let i = e.bones.find((e) => e.parent === r.name);
		if (!i || r.parent === null) continue;
		let a = /LowerLeg$/.test(r.name) && !/Front/.test(r.name), o = /LowerArm$/.test(r.name) || /FrontLowerLeg$/.test(r.name);
		if (!a && !o) continue;
		let s = oe(e, t, r.name, i.name, a);
		s && n.push(s);
	}
	return n;
}
function ce(e, t) {
	return e.armatures.map((e) => {
		let n = [...t.values()].filter((t) => t.armature.id === e.id), r = e.bones.map((e, t) => n.reduce((e, n) => e + n.report.boneWeight[t], 0));
		return {
			id: e.id,
			bones: e.bones.length,
			skinned: n.map((e) => ({
				node: e.report.node,
				vertices: e.report.vertices,
				unweightedVertices: e.report.unweightedVertices
			})),
			bonesWithNoVertices: n.length ? e.bones.filter((e, t) => r[t] < .001).map((e) => e.name) : [],
			jointAxisProblems: se(e)
		};
	});
}
function le(e, t, n) {
	let r = Math.max(1, Math.ceil(t * n)), i = /* @__PURE__ */ new Map();
	for (let a = 0; a <= r; a++) {
		let r = Math.min(t, a / n);
		for (let [t, n] of e.sample(r).nodes) for (let e of ["rotation", "translation"]) {
			if (!n[e]) continue;
			let a = `${t}\u0000${e}`;
			i.has(a) || i.set(a, {
				target: t,
				property: e,
				interpolation: "LINEAR",
				keyframes: []
			}), i.get(a).keyframes.push({
				time: r,
				value: Array.from(n[e])
			});
		}
	}
	return [...i.values()];
}
function ue(t, r, i, { frameRate: a = 30 } = {}) {
	let c = t.nodes.filter((e) => Object.hasOwn(e, "armature")).map((i) => {
		let a = t.armatures.some((e) => e.id === i.id), c = a ? r.getNode(i.id).worldMatrix : null;
		return {
			id: i.id,
			name: i.id,
			meshIds: [],
			parent: a ? null : i.parent,
			translation: c ? Array.from(e(s(), c)) : i.translation,
			rotation: c ? Array.from(n([
				0,
				0,
				0,
				1
			], c)) : i.rotation,
			scale: c ? Array.from(o(s(), c)) : i.scale
		};
	}), l = new Set(c.map((e) => e.id)), u = i ? le(i, t.motion.duration, a).filter((e) => l.has(e.target)) : [], d = u.length ? {
		...m({
			duration: t.motion.duration,
			loop: t.motion.loop,
			tracks: u
		}),
		name: "motion"
	} : null;
	return {
		nodes: c,
		clips: d ? [d] : []
	};
}
export { K as a, ie as c, re as d, ee as f, U as i, q as l, ue as n, ae as o, G as p, ne as r, H as s, W as t, ce as u };
