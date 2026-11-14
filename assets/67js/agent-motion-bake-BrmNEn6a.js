/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { f as e, r as t } from "./quat-Bl7gjwWK.js";
import { t as n } from "./field-error-BpFTmyMO.js";
import { i as r, t as i } from "./motion-validation-BCm1CqIb.js";
// src/agent-motion-bake.js
var a = Object.freeze({
	maxNodes: 32,
	maxSamples: 512,
	maxKeysPerTrack: 64,
	defaultStep: 1 / 30,
	minimumStep: 1 / 120
}), o = Object.freeze({
	position: .001,
	angle: .1
}), s = 30, c = [
	"translation",
	"rotation",
	"scale"
], l = {
	translation: [
		0,
		0,
		0
	],
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
	]
}, u = 1e-6, d = Math.PI / 180;
function f(e) {
	return Math.round(e * 1e6) / 1e6;
}
function p(e) {
	if (e === void 0) return null;
	r(e, [
		"position",
		"angle",
		"scale"
	], "tolerance");
	let t = i(e.position ?? o.position, 0, 10, "tolerance.position"), n = i(e.angle ?? o.angle, 0, 45, "tolerance.angle"), a = i(e.scale ?? t, 0, 10, "tolerance.scale");
	return {
		translation: t,
		rotation: n * d,
		scale: a
	};
}
function m(e, t) {
	let r = new Map(t.nodes.map((e) => [e.id, e])), i = JSON.stringify([t.nodes.find((e) => !e.assetPart)?.id ?? "crate"]);
	if (!Array.isArray(e) || e.length < 1 || e.length > a.maxNodes) throw n("nodes", Array.isArray(e) ? `${e.length} IDs` : e, `a list of 1 to ${a.maxNodes} node IDs, such as ${i}`, Array.isArray(e) ? RangeError : TypeError);
	return e.forEach((t, a) => {
		let o = r.get(t);
		if (!o || o.assetPart) throw n(`nodes[${a}]`, t, `the ID of a node you placed, such as ${i}; scene_inspect lists them`);
		if (e.indexOf(t) !== a) throw n(`nodes[${a}]`, t, "each node ID once");
	}), e;
}
function h(e, t, o) {
	r(e, [
		"type",
		"nodes",
		"start",
		"end",
		"step",
		"tolerance"
	], "operation");
	let c = m(e.nodes, t);
	if (!o.animated) throw n("nodes", c, "a scene that already moves: add motion or physics first, since there is nothing to sample yet");
	let l = Math.max(o.motionDuration, o.physicsDuration), u = i(e.start ?? 0, 0, s, "start"), d = f(i(e.end ?? Math.min(l, s), 0, s, "end"));
	if (d <= u) throw n("end", d, `a time after start ${u}, up to ${s} seconds, such as ${f(u + 1)}`);
	let h = i(e.step ?? a.defaultStep, a.minimumStep, 1, "step"), g = Math.ceil((d - u) / h - 1e-9) + 1;
	if (g > a.maxSamples) throw n("step", h, `a step that gives at most ${a.maxSamples} samples over ${f(d - u)} seconds, so at least ${f((d - u) / (a.maxSamples - 1))}, or a shorter start to end range`);
	return {
		ids: c,
		start: u,
		end: d,
		step: h,
		sampleCount: g,
		tolerance: p(e.tolerance),
		toleranceInput: e.tolerance
	};
}
function g({ start: e, end: t, step: n, sampleCount: r }) {
	return Array.from({ length: r }, (i, a) => a === r - 1 ? t : f(e + a * n));
}
function _(e, n) {
	let r = g(e), i = new Map(e.ids.map((e) => [e, {
		translation: [],
		rotation: [],
		scale: []
	}]));
	for (let a of r) {
		let r = n.sampleLocalTransforms(a, e.ids);
		for (let n of e.ids) {
			let e = r.get(n), a = i.get(n);
			for (let n of c) {
				let r = Array.from(e[n]), i = a[n].at(-1);
				n === "rotation" && i && t(i, r) < 0 && r.forEach((e, t) => {
					r[t] = -e;
				}), a[n].push(r);
			}
		}
	}
	return {
		times: r,
		series: i
	};
}
function v(e, t) {
	return Math.hypot(...e.map((e, n) => e - t[n]));
}
function y(e, n) {
	return 2 * Math.acos(Math.min(1, Math.abs(t(e, n))));
}
function b(e, t, n) {
	return e === "rotation" ? y(t, n) : v(t, n);
}
function x(t, n, r, i) {
	return t === "rotation" ? Array.from(e(/* @__PURE__ */ new Float64Array(4), n, r, i)) : n.map((e, t) => e + (r[t] - e) * i);
}
function S(e, t, n, r) {
	let i = /* @__PURE__ */ new Set([0, n.length - 1]), a = [[0, n.length - 1]];
	for (; a.length;) {
		let [o, s] = a.pop(), c = -1, l = r;
		for (let r = o + 1; r < s; r++) {
			let i = (t[r] - t[o]) / (t[s] - t[o]), a = b(e, x(e, n[o], n[s], i), n[r]);
			a > l && (l = a, c = r);
		}
		c >= 0 && (i.add(c), a.push([o, c], [c, s]));
	}
	return [...i].sort((e, t) => e - t);
}
function C(e, t, n, r, i) {
	let a = Math.max(i?.[e] ?? 0, u);
	return n.every((t) => b(e, t, n[0]) <= a) ? b(e, n[0], r) <= a ? null : [{
		time: t[0],
		value: n[0]
	}] : (i ? S(e, t, n, a) : n.map((e, t) => t)).map((e) => ({
		time: t[e],
		value: n[e]
	}));
}
function w(e, t, r, i) {
	let o = new Map(i.nodes.map((e) => [e.id, e])), s = [];
	for (let i of e.ids) for (let u of c) {
		let c = o.get(i)[u] ?? l[u], d = C(u, r, t.get(i)[u], c, e.tolerance);
		if (d) {
			if (d.length > a.maxKeysPerTrack) {
				let t = e.tolerance ? "a larger tolerance" : "a tolerance such as { \"position\": 0.005, \"angle\": 0.5 }";
				throw n("tolerance", e.toleranceInput ?? null, `${t}, or a larger step, since a track holds at most ${a.maxKeysPerTrack} keys and ${i} ${u} needs ${d.length}`);
			}
			s.push({
				kind: "node",
				id: i,
				property: u,
				interpolation: "LINEAR",
				keyframes: d
			});
		}
	}
	return s;
}
function T(e, t) {
	if (e.type === "two-bone") return [
		e.root,
		e.middle,
		e.end
	];
	if (e.type === "aim") return e.joints;
	if (e.chain) return e.chain;
	let n = [];
	for (let r = e.end; r != null && (n.push(r), r !== e.root); r = t.get(r)?.parent);
	return n;
}
function E(e, t) {
	let n = (e.bodies ?? []).map((e) => e.node);
	return e.ragdoll && n.push(...t.nodes.filter((t) => t.armature === e.ragdoll.armature && t.id !== t.armature).map((e) => e.id)), n;
}
function D(e, t, r, i) {
	let a = e.filter((e) => !i.has(e));
	if (a.length) throw n("nodes", [...i], `every node the ${t} moves, so also ${a.slice(0, 6).join(", ")}${a.length > 6 ? " and more" : ""}; ${r}`);
}
function O(e, t) {
	let n = new Set(t), r = new Map(e.nodes.map((e) => [e.id, e])), { motion: i, physics: a } = e;
	if (a) {
		let t = E(a, e);
		t.some((e) => n.has(e)) && (D(t, "physics world", "bodies collide, so they bake together", n), delete e.physics);
	}
	if (!i) return;
	let o = {
		ik: (i.ik ?? []).filter((e) => {
			let t = T(e, r);
			return !t.some((e) => n.has(e)) || (D(t, `${e.type} IK solver`, "its joints bake together", n), !1);
		}),
		constraints: (i.constraints ?? []).filter((e) => !n.has(e.node)),
		drivers: (i.drivers ?? []).filter((e) => !(e.target.kind === "node" && n.has(e.target.id)))
	};
	for (let [e, t] of Object.entries(o)) t.length ? i[e] = t : delete i[e];
}
function k(e) {
	return !!(e.tracks.length || e.layers?.length || e.ik?.length || e.constraints?.length || e.drivers?.length || e.drive);
}
function A(e, t, r) {
	let i = h(t, e, r);
	if (e.motion?.loop && i.end > e.motion.duration) throw n("end", i.end, `at most the looping motion duration ${e.motion.duration}, since a longer bake would change the loop; set the motion loop to false first`);
	O(e, i.ids);
	let { times: a, series: o } = _(i, r), s = w(i, o, a, e), l = new Set(i.ids), u = e.motion ?? {
		duration: Math.max(i.end, .1),
		loop: !1,
		tracks: []
	};
	return u.duration = Math.max(u.duration, i.end), u.tracks = [...u.tracks.filter((e) => !(e.kind === "node" && l.has(e.id) && c.includes(e.property))), ...s], k(u) ? e.motion = u : delete e.motion, {
		tracks: s.length,
		keyframes: s.reduce((e, t) => e + t.keyframes.length, 0)
	};
}
export { a as BAKE_LIMITS, A as bakeMotion };
