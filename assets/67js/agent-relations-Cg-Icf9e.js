/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { h as e, n as t, o as n, p as r } from "./mat4-BCZClxna.js";
import { a as i, x as a } from "./vec3-BRYC6f_g.js";
import { t as o } from "./field-error-BpFTmyMO.js";
// src/agent-relations.js
var s = Object.freeze([
	"attach",
	"flush",
	"align",
	"centered",
	"gap"
]), c = Object.freeze([
	"+x",
	"-x",
	"+y",
	"-y",
	"+z",
	"-z"
]), l = Object.freeze({
	maxPerNode: 8,
	maxNodes: 256,
	maxOffset: 1e6
}), u = Object.freeze([
	"x",
	"y",
	"z"
]), d = Object.freeze([
	"min",
	"center",
	"max"
]), f = Object.freeze({
	attach: ["side", "offset"],
	gap: ["side", "offset"],
	flush: ["side", "offset"],
	align: [
		"axis",
		"at",
		"offset"
	],
	centered: ["axes"]
});
function p(e) {
	return u.indexOf(e);
}
function m(e) {
	return p(e[1]);
}
function h(e, t) {
	return `nodes[${e}].relations[${t}]`;
}
function g(e, t, n) {
	let r = h(e, t);
	if (!n || typeof n != "object" || Array.isArray(n)) throw o(r, n, "an object such as { \"kind\": \"attach\", \"to\": \"body\", \"side\": \"+x\" }", TypeError);
	if (!s.includes(n.kind)) throw o(`${r}.kind`, n.kind, `one of ${s.join(", ")}`, TypeError);
	let i = [
		"kind",
		"to",
		"region",
		...f[n.kind] ?? []
	];
	for (let e of Object.keys(n)) if (!i.includes(e)) throw o(`${r}.${e.slice(0, 48)}`, n[e], `a field a ${n.kind} relation takes: ${i.join(", ")}`, TypeError);
	if (typeof n.to != "string" || !n.to) throw o(`${r}.to`, n.to, "the ID of the part it is placed against, such as \"body\"", TypeError);
	if (n.region !== void 0 && (typeof n.region != "string" || !n.region || n.region.length > 128)) throw o(`${r}.region`, n.region, "a mesh tag name of 1 to 128 characters, such as \"top\"", TypeError);
	let a = n.offset ?? 0;
	if (!Number.isFinite(a) || Math.abs(a) > l.maxOffset) throw o(`${r}.offset`, n.offset, `a finite number of metres within +-${l.maxOffset}, such as 0.1`);
	let p = {
		kind: n.kind,
		to: n.to
	};
	if (n.region !== void 0 && (p.region = n.region), a !== 0 && (p.offset = a), f[n.kind].includes("side")) {
		if (!c.includes(n.side)) throw o(`${r}.side`, n.side, `one of ${c.join(", ")}, the face of "${n.to}" it sits against`, TypeError);
		p.side = n.side;
	}
	if (n.kind === "align") {
		if (!u.includes(n.axis) || !d.includes(n.at)) throw o(u.includes(n.axis) ? `${r}.at` : `${r}.axis`, u.includes(n.axis) ? n.at : n.axis, u.includes(n.axis) ? `one of ${d.join(", ")}` : "x, y or z", TypeError);
		p.axis = n.axis, p.at = n.at;
	}
	if (n.kind === "centered") {
		let e = n.axes ?? u;
		if (!Array.isArray(e) || e.length === 0 || e.length > 3 || e.some((e) => !u.includes(e)) || new Set(e).size !== e.length) throw o(`${r}.axes`, n.axes, "a list of x, y, z with each at most once, such as [\"x\", \"z\"], or left out for all three", TypeError);
		p.axes = [...e].sort();
	}
	return p;
}
function _(e) {
	switch (e.kind) {
		case "attach": return [
			0,
			1,
			2
		];
		case "gap":
		case "flush": return [m(e.side)];
		case "align": return [p(e.axis)];
		default: return e.axes.map(p);
	}
}
function v(e, t) {
	let n = [], r = /* @__PURE__ */ new Set(), i = [];
	function a(s) {
		if (r.has(s)) return;
		let c = i.indexOf(s);
		if (c !== -1) {
			let t = [...i.slice(c), s].map((e) => e.slice(0, 48));
			throw o(`nodes[${[...e.keys()].indexOf(s)}].relations`, t, "relations that form no loop, since each part waits for the next in the list, parents included; remove one relation in the loop with set-node relations, or place one part with translation");
		}
		i.push(s);
		let l = e.get(s);
		l.parent !== null && e.has(l.parent) && a(l.parent);
		for (let e of l.relations ?? []) a(e.to);
		i.pop(), r.add(s), t.has(s) && n.push(s);
	}
	for (let e of t) a(e);
	return n;
}
function y(e) {
	return new Map(e.map((e) => [e.id, e]));
}
function b(e) {
	let t = e.filter((e) => e.relations !== void 0);
	if (t.length === 0) return e;
	let n = y(e), r = e.map((e) => ({ ...e })), i = y(r), a = 0;
	for (let r of t) {
		let t = e.indexOf(r);
		if (!Array.isArray(r.relations) || r.relations.length > l.maxPerNode) throw o(`nodes[${t}].relations`, r.relations, `an array of at most ${l.maxPerNode} relations; merge or drop some`);
		let s = r.relations.map((e, n) => g(t, n, e)), c = i.get(r.id);
		if (s.length === 0) {
			delete c.relations;
			continue;
		}
		if (a++, a > l.maxNodes) throw o(`nodes[${t}].relations`, r.relations, `relations on at most ${l.maxNodes} nodes; group repeated parts or place the rest with translation`);
		if (r.geometry === void 0) throw o(`nodes[${t}].relations`, r.relations, "relations on a mesh node, since this node is a group; put them on a mesh node inside the group", TypeError);
		let d = /* @__PURE__ */ new Map();
		s.forEach((e, i) => {
			let a = n.get(e.to);
			if (e.to === r.id) throw o(`${h(t, i)}.to`, e.to, "the ID of another part, such as \"body\", not its own node");
			if (!a) throw o(`${h(t, i)}.to`, e.to, "the ID of a node in this recipe; list them with scene_inspect, or drop the relation");
			if (a.geometry === void 0) throw o(`${h(t, i)}.to`, e.to, "the ID of a mesh node, such as a box, since this one is a group with no geometry");
			for (let n of _(e)) {
				if (d.has(n)) throw o(`${h(t, i)}.kind`, e.kind, `a relation that leaves the ${u[n]} axis to relation ${d.get(n)}, which already decides it; keep one relation per axis`);
				d.set(n, i);
			}
		}), c.relations = s;
	}
	return v(i, new Set(t.filter((e) => i.get(e.id).relations).map((e) => e.id))), r;
}
function x(r, i, a) {
	let o = a.get(r);
	if (o) return o;
	let s = i.get(r), c = n(t(), s.rotation, s.translation, s.scale), l = s.parent !== null && i.has(s.parent) ? e(c, x(s.parent, i, a), c) : c;
	return a.set(r, l), l;
}
function S(e, t, n) {
	return n === "min" ? e.min[t] : n === "max" ? e.max[t] : (e.min[t] + e.max[t]) / 2;
}
function C(e, t, n) {
	let r = e.offset ?? 0, i = [], a = (e) => ({
		axis: m(e),
		outward: e[0] === "+"
	});
	if (e.kind === "gap" || e.kind === "attach") {
		let { axis: t, outward: o } = a(e.side);
		i.push(o ? {
			axis: t,
			anchor: "min",
			value: n.max[t] + r
		} : {
			axis: t,
			anchor: "max",
			value: n.min[t] - r
		});
	}
	if (e.kind === "attach") {
		let { axis: t } = a(e.side);
		for (let e of [
			0,
			1,
			2
		].filter((e) => e !== t)) i.push({
			axis: e,
			anchor: "center",
			value: S(n, e, "center")
		});
	}
	if (e.kind === "flush") {
		let { axis: t, outward: o } = a(e.side), s = o ? "max" : "min";
		i.push({
			axis: t,
			anchor: s,
			value: S(n, t, s) + r
		});
	}
	if (e.kind === "align") {
		let t = p(e.axis);
		i.push({
			axis: t,
			anchor: e.at,
			value: S(n, t, e.at) + r
		});
	}
	if (e.kind === "centered") for (let t of e.axes.map(p)) i.push({
		axis: t,
		anchor: "center",
		value: S(n, t, "center")
	});
	return i.map((e) => ({
		...e,
		delta: e.value - S(t, e.axis, e.anchor)
	}));
}
function w(e, n) {
	let s = e.filter((e) => e.relations?.length);
	if (s.length === 0) return e;
	let c = e.map((e) => ({ ...e })), l = y(c), u = /* @__PURE__ */ new Map();
	for (let c of v(l, new Set(s.map((e) => e.id)))) {
		let s = l.get(c), d = e.findIndex((e) => e.id === c), f = [
			0,
			0,
			0
		], p = n(s, x(c, l, u), void 0);
		s.relations.forEach((e, t) => {
			let r = l.get(e.to), i;
			try {
				i = n(r, x(r.id, l, u), e.region);
			} catch (n) {
				throw o(`${h(d, t)}.${e.region === void 0 ? "to" : "region"}`, e.region ?? e.to, `a target that can be measured (${n.message})`);
			}
			for (let t of C(e, p, i)) f[t.axis] = t.delta;
		});
		let m = s.parent !== null && l.has(s.parent) ? x(s.parent, l, u) : t(), g = r(t(), m);
		if (!g) throw o(`nodes[${e.findIndex((e) => e.id === s.parent)}].scale`, l.get(s.parent).scale, `a scale with no zero axis, since the relations of nodes[${d}] cannot be solved under it, such as [1, 1, 1]`);
		let _ = a(i(), f, g), v = a(i(), [
			0,
			0,
			0
		], g);
		if (s.translation = s.translation.map((e, t) => e + _[t] - v[t]), !s.translation.every(Number.isFinite)) throw o(`nodes[${d}].translation`, s.translation, "finite numbers, but its relations produce a translation outside the number range; reduce offsets or part sizes");
		u.clear();
	}
	return c;
}
export { s as RELATION_KINDS, l as RELATION_LIMITS, c as RELATION_SIDES, b as normalizeRelations, _ as relationAxes, w as solveRelations };
