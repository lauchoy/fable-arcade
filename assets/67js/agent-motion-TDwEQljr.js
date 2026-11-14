/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { t as e } from "./rolldown-runtime-CvuOiBwx.js";
import { a as t, c as n, n as r, r as i } from "./animation-CO9Tq0E0.js";
import { n as a, t as o } from "./field-error-BpFTmyMO.js";
import { t as s } from "./camera-path-C8Pae8D4.js";
import { t as c } from "./camera-DqWdI22s.js";
import { c as l, i as u, o as d, s as f } from "./skeleton-pose-DQgRHqAu.js";
import { n as p } from "./mat3-BUCH0Dej.js";
import { d as m, h, n as g, o as _, p as v, s as y, t as b, u as x } from "./mat4-BCZClxna.js";
import { a as S, c as C, d as w, f as T, l as E, r as ee, s as D } from "./quat-Bl7gjwWK.js";
import { S as te, c as O, d as k, f as ne, h as A, i as re, m as ie, o as ae, p as j, s as oe, t as se, y as M } from "./vec3-BRYC6f_g.js";
import { a as N, i as P, n as F, r as ce, t as I } from "./motion-validation-BCm1CqIb.js";
import { c as le, d as ue, i as de, n as fe, s as pe, t as me } from "./expression-BKVPjtCf.js";
import { mapHumanoidBones as he, retargetClip as ge } from "./retarget.js";
import { g as _e } from "./agent-scene-capabilities-BaawWMO1.js";
// src/animation-modifiers.js
var ve = [
	"none",
	"repeat",
	"offset",
	"mirror"
], ye = /* @__PURE__ */ new Set(["cycles", "stepped"]), be = 8, xe = 8, Se = 16;
function L(e, t, n) {
	let r = e ?? n;
	if (!Number.isFinite(r)) throw RangeError(`Modifier ${t} must be a finite number, for example ${n}.`);
	return r;
}
function R(e, t) {
	for (let n of Object.keys(e)) if (n !== "type" && !t.includes(n)) throw RangeError(`Modifier ${e.type} has no field ${n}. Fields: ${t.join(", ")}.`);
}
function Ce(e, t) {
	let n = e ?? 0;
	if (!Number.isInteger(n) || n < 0 || n > 1e3) throw RangeError(`Modifier ${t} must be an integer from 0 (forever) to 1000.`);
	return n;
}
function we(e, t) {
	R(e, [
		"before",
		"after",
		"beforeCount",
		"afterCount"
	]);
	let n = e.before ?? "repeat", r = e.after ?? "repeat";
	for (let [e, i] of [["before", n], ["after", r]]) {
		if (!ve.includes(i)) throw RangeError(`Modifier cycles ${e} must be one of ${ve.join(", ")}, not ${i}.`);
		if (i === "offset" && t === "rotation") throw RangeError("Modifier cycles offset does not apply to rotation. Use repeat or mirror.");
	}
	return {
		type: "cycles",
		before: n,
		after: r,
		beforeCount: Ce(e.beforeCount, "cycles beforeCount"),
		afterCount: Ce(e.afterCount, "cycles afterCount")
	};
}
function Te(e) {
	R(e, ["step", "offset"]);
	let t = L(e.step, "stepped step", .1);
	if (t <= 0) throw RangeError("Modifier stepped step must be above 0 seconds, for example 0.1.");
	return {
		type: "stepped",
		step: t,
		offset: L(e.offset, "stepped offset", 0)
	};
}
function Ee(e) {
	R(e, [
		"scale",
		"strength",
		"phase",
		"seed"
	]);
	let t = L(e.scale, "noise scale", 1);
	if (t <= 0) throw RangeError("Modifier noise scale is seconds per wobble and must be above 0, for example 0.25.");
	let n = e.seed ?? 0;
	if (!Number.isInteger(n) || Math.abs(n) > 2 ** 31) throw RangeError("Modifier noise seed must be an integer, for example 7.");
	return {
		type: "noise",
		scale: t,
		strength: L(e.strength, "noise strength", 1),
		phase: L(e.phase, "noise phase", 0),
		seed: n
	};
}
function De(e) {
	R(e, ["coefficients", "additive"]);
	let t = e.coefficients ?? [0, 1];
	if (!Array.isArray(t) || !t.length || t.length > xe || !t.every(Number.isFinite)) throw RangeError(`Modifier generator coefficients are 1 to ${xe} finite numbers, lowest power first, for example [0, 1].`);
	if (e.additive !== void 0 && typeof e.additive != "boolean") throw RangeError("Modifier generator additive must be true or false.");
	return {
		type: "generator",
		coefficients: [...t],
		additive: e.additive ?? !1
	};
}
function Oe(e) {
	if (R(e, ["min", "max"]), e.min === void 0 && e.max === void 0) throw RangeError("Modifier limits needs min, max or both, for example {min:0,max:1}.");
	let t = { type: "limits" };
	if (e.min !== void 0 && (t.min = L(e.min, "limits min", 0)), e.max !== void 0 && (t.max = L(e.max, "limits max", 1)), t.min !== void 0 && t.max !== void 0 && t.min > t.max) throw RangeError("Modifier limits min must not exceed max.");
	return t;
}
function ke(e) {
	R(e, [
		"points",
		"referenceMin",
		"referenceMax"
	]);
	let t = e.points;
	if (!Array.isArray(t) || !t.length || t.length > Se) throw RangeError(`Modifier envelope points are 1 to ${Se} of {time,min,max}, for example [{time:0,min:-1,max:1}].`);
	let n = t.map((e) => ({
		time: L(e?.time, "envelope point time", 0),
		min: L(e?.min, "envelope point min", -1),
		max: L(e?.max, "envelope point max", 1)
	})).sort((e, t) => e.time - t.time);
	for (let e = 1; e < n.length; e++) if (n[e].time === n[e - 1].time) throw RangeError("Modifier envelope point times must be distinct.");
	let r = L(e.referenceMin, "envelope referenceMin", -1), i = L(e.referenceMax, "envelope referenceMax", 1);
	if (i <= r) throw RangeError("Modifier envelope referenceMax must be above referenceMin.");
	return {
		type: "envelope",
		points: n,
		referenceMin: r,
		referenceMax: i
	};
}
var Ae = {
	cycles: we,
	stepped: Te,
	noise: Ee,
	generator: De,
	limits: Oe,
	envelope: ke
};
function je(e) {
	let t = e.extrapolation ?? "constant";
	if (t !== "constant" && t !== "linear") throw RangeError(`Track extrapolation must be constant or linear, not ${t}.`);
	if (t === "linear" && e.property === "rotation") throw RangeError("Rotation tracks cannot extrapolate linearly. Use constant, or a cycles modifier.");
	let n = e.modifiers ?? [];
	if (!Array.isArray(n) || n.length > be) throw RangeError(`Track modifiers is a list of at most ${be} objects like {type:'noise'}.`);
	if (t === "constant" && !n.length) return null;
	let r = [], i = [];
	for (let t of n) {
		let n = Ae[t?.type];
		if (!n) throw RangeError(`Unknown modifier type ${t?.type}. Types: ${Object.keys(Ae).join(", ")}.`);
		if (!ye.has(t.type) && e.property === "rotation") throw RangeError(`Rotation tracks accept only cycles and stepped modifiers, not ${t.type}.`);
		(ye.has(t.type) ? r : i).push(Object.freeze(n(t, e.property)));
	}
	return Object.freeze({
		extrapolation: t,
		timeModifiers: Object.freeze(r),
		valueModifiers: Object.freeze(i)
	});
}
function Me(e) {
	let t = {};
	e.extrapolation !== "constant" && (t.extrapolation = e.extrapolation);
	let n = [...e.timeModifiers, ...e.valueModifiers];
	return n.length && (t.modifiers = n.map((e) => structuredClone(e))), t;
}
function Ne(e, t, n, r) {
	let i = t[0].time, a = t[t.length - 1].time - i, o = n;
	for (let t of e.timeModifiers) {
		if (t.type === "stepped") {
			o = Math.floor((o - t.offset) / t.step + 1e-9) * t.step + t.offset;
			continue;
		}
		if (a <= 0 || o >= i && o <= i + a) continue;
		let e = o < i, n = e ? t.before : t.after;
		if (n === "none") continue;
		let s = e ? t.beforeCount : t.afterCount, c = Math.floor((o - i) / a), l = o - i - c * a, u = e ? -c : c;
		s > 0 && u > s && (c = e ? -s : s, l = e ? 0 : a), n === "mirror" && Math.abs(c) % 2 == 1 && (l = a - l), n === "offset" && r.push(c), o = i + l;
	}
	return o;
}
function Pe(e, t) {
	let n = Math.imul(e ^ 2654435769, 2246822507) ^ Math.imul(t | 0, 3266489909);
	return n = Math.imul(n ^ n >>> 15, 739982445), n = Math.imul(n ^ n >>> 12, 695872825), n ^= n >>> 15, (n >>> 0) / 2147483648 - 1;
}
function Fe(e, t) {
	let n = Math.floor(e), r = e - n, i = r * r * (3 - 2 * r), a = Pe(n, t);
	return a + (Pe(n + 1, t) - a) * i;
}
function Ie(e, t) {
	let n = e[e.length - 1];
	if (t <= e[0].time) return [e[0].min, e[0].max];
	if (t >= n.time) return [n.min, n.max];
	let r = 1;
	for (; e[r].time < t;) r++;
	let i = e[r - 1], a = e[r], o = (t - i.time) / (a.time - i.time);
	return [i.min + (a.min - i.min) * o, i.max + (a.max - i.max) * o];
}
function Le(e, t, n) {
	for (let r of e.valueModifiers) for (let e = 0; e < n.length; e++) {
		let i = n[e];
		if (r.type === "noise") n[e] = i + Fe((t + r.phase) / r.scale, r.seed + e * 7919) * r.strength;
		else if (r.type === "generator") {
			let a = 0;
			for (let e = r.coefficients.length - 1; e >= 0; e--) a = a * t + r.coefficients[e];
			n[e] = r.additive ? i + a : a;
		} else if (r.type === "limits") n[e] = Math.min(r.max ?? Infinity, Math.max(r.min ?? -Infinity, i));
		else {
			let [a, o] = Ie(r.points, t), s = (i - r.referenceMin) / (r.referenceMax - r.referenceMin);
			n[e] = a + (o - a) * s;
		}
	}
}
function Re(e, t) {
	return typeof e == "number" ? e : e[t];
}
function ze(e, t, n) {
	return (Re(t.value, n) - Re(e.value, n)) / (t.time - e.time);
}
function Be(e, t, n, r, i) {
	let { effects: a, keyframes: o } = e, s = [], c = Ne(a, o, t, s), l = o[0], u = o[o.length - 1];
	if (r(e, c, n), a.extrapolation === "linear" && o.length > 1) {
		let e = c < l.time ? l : o[o.length - 2], t = c < l.time ? o[1] : u, r = c < l.time ? c - l.time : c > u.time ? c - u.time : 0;
		for (let i = 0; i < n.length; i++) n[i] += ze(e, t, i) * r;
	}
	for (let e of s) for (let t = 0; t < n.length; t++) n[t] += e * (Re(u.value, t) - Re(l.value, t));
	Le(a, t, n);
	for (let t = 0; t < n.length; t++) n[t] = i(e.property, n[t]);
	return n;
}
t({
	normalize: je,
	sample: Be
});
var Ve = [
	"translation",
	"rotation",
	"scale"
], He = de();
He.set("div", le(2, 2, (e, t) => e / t));
function Ue(e, t) {
	let { label: n, nodeIds: r } = t;
	if (P(e, [
		"node",
		"property",
		"component",
		"space"
	], `${n} node read`), !r.has(e.node)) throw RangeError(`${n}: node ${JSON.stringify(e.node)} is not in this scene.`);
	if (!Ve.includes(e.property)) throw RangeError(`${n}: property must be translation, rotation or scale.`);
	if (!Object.hasOwn(me, e.component)) throw RangeError(`${n}: component must be x, y or z.`);
	let i = e.space ?? "local";
	if (i !== "local" && i !== "world") throw RangeError(`${n}: space must be local or world.`);
	t.reads.add(e.node);
	let a = me[e.component];
	return ue((t) => t.read(e.node, e.property, a, i));
}
function We(e, t) {
	let { label: n, nodeIds: r, properties: i } = t;
	if (P(e, [
		"node",
		"name",
		"component"
	], `${n} custom property read`), !r.has(e.node)) throw RangeError(`${n}: node ${JSON.stringify(e.node)} is not in this scene.`);
	let a = i.get(e.node)?.get(e.name);
	if (!a) {
		let t = [...i.get(e.node)?.keys() ?? []];
		throw RangeError(`${n}: node ${JSON.stringify(e.node)} has no custom property ${JSON.stringify(e.name)}; add it to motion.properties first${t.length ? ` (it has ${t.join(", ")})` : ""}.`);
	}
	if (a === "number" && e.component !== void 0) throw RangeError(`${n}: custom property ${JSON.stringify(e.name)} is a number and takes no component.`);
	if (a !== "number" && !Object.hasOwn(me, e.component)) throw RangeError(`${n}: custom property ${JSON.stringify(e.name)} is a ${a}; component must be x, y or z.`);
	t.reads.add(e.node);
	let o = me[e.component] ?? 0;
	return ue((t) => t.custom(e.node, e.name, o));
}
function Ge(e, t, n, r) {
	let { label: i, nodeIds: a } = t;
	P(e, ["from", "to"], `${i} ${n}`);
	for (let r of [e.from, e.to]) {
		if (!a.has(r)) throw RangeError(`${i}: ${n} node ${JSON.stringify(r)} is not in this scene.`);
		t.reads.add(r);
	}
	return ue((t) => r(t, e.from, e.to));
}
var Ke = /* @__PURE__ */ new Map([["distance", (e, t, n) => e.distance(t, n)], ["rotationDifference", (e, t, n) => e.rotationDifference(t, n)]]);
function qe(e, t) {
	if (e === "time") return ue((e) => e.time);
	if (!pe(e)) return;
	if (Object.hasOwn(e, "node")) return Ue(e, t);
	let n = Object.keys(e);
	if (n.length === 1) {
		if (n[0] === "custom") return We(e.custom, t);
		if (Ke.has(n[0])) return Ge(e[n[0]], t, n[0], Ke.get(n[0]));
	}
}
var Je = Object.freeze({
	name: "motion",
	accepts: "a number, \"time\", a node read, a custom property, a distance, a rotationDifference or an operator object",
	maxNodes: 64,
	maxDepth: 8,
	operators: He,
	sourceNames: Object.freeze([
		"time",
		"node",
		"custom",
		"distance",
		"rotationDifference"
	]),
	reject: (e, t) => /* @__PURE__ */ TypeError(`${t.label}: ${e}`),
	compileInput: qe
});
function z(e, t, n, r = /* @__PURE__ */ new Map()) {
	let i = {
		dialect: Je,
		nodeCount: 0,
		label: n,
		nodeIds: t,
		properties: r,
		reads: /* @__PURE__ */ new Set()
	}, { evaluate: a } = fe(e, i, 0);
	return Object.freeze({
		reads: [...i.reads],
		evaluate(e) {
			let t = a(e);
			if (!Number.isFinite(t)) throw RangeError(`${n} produced ${t} at time ${e.time}; it must stay finite.`);
			return t;
		}
	});
}
var Ye = Object.freeze([
	"number",
	"vector",
	"color"
]), Xe = 64, Ze = 1e6, Qe = {
	number: [-1e6, Ze],
	vector: [-1e6, Ze],
	color: [0, 1]
};
function $e(e) {
	return e === "number" ? 1 : 3;
}
function et(e, t, n, r, i) {
	if ($e(t) === 1) return I(e, n, r, i);
	let a = N(e, 3, i);
	for (let e of a) I(e, n, r, i);
	return a;
}
function tt(e, t, n) {
	let r = Math.min(n, Math.max(t, 0));
	return $e(e) === 1 ? r : [
		r,
		r,
		r
	];
}
function nt(e, t, n, r) {
	let i = `Motion property ${t}`;
	if (P(e, [
		"node",
		"name",
		"kind",
		"value",
		"min",
		"max",
		"keys"
	], i), !r.has(e.node)) throw o(`${i} node`, e.node, "a node or bone ID in this recipe, such as \"lid\"");
	if (typeof e.name != "string" || !e.name.trim() || e.name.length > Xe) throw o(`${i} name`, e.name, `a name of 1 to ${Xe} characters, such as "open"`);
	let a = e.kind ?? "number";
	if (!Ye.includes(a)) throw o(`${i} kind`, a, `one of ${Ye.join(", ")}`);
	let [s, c] = Qe[a], l = I(e.min ?? s, -1e6, Ze, `${i} min`), u = I(e.max ?? c, -1e6, Ze, `${i} max`);
	if (!(l < u)) throw o(`${i} min`, l, `a number below max (${u})`);
	let d = {
		node: e.node,
		name: e.name,
		kind: a,
		min: l,
		max: u
	};
	if (e.keys === void 0) return d.value = et(e.value ?? tt(a, l, u), a, l, u, `${i} value`), d;
	if (e.value !== void 0) throw o(`${i} value`, e.value, "a field left out when keys are given, since the keys set the value");
	if (F(e.keys, 16, `${i} keys`), !e.keys.length) throw o(`${i} keys`, e.keys, "at least one key, such as [{ \"time\": 0, \"value\": 0 }, { \"time\": 1, \"value\": 1 }]");
	if (d.keys = e.keys.map((e, t) => (P(e, ["time", "value"], `${i} key ${t}`), {
		time: I(e.time, 0, n, `${i} key ${t} time`),
		value: et(e.value, a, l, u, `${i} key ${t} value`)
	})), d.keys.some((e, t) => t && e.time <= d.keys[t - 1].time)) throw o(`${i} keys`, e.keys.map((e) => e.time), "keys with rising times, one value per time");
	return d;
}
function rt(e, t, n) {
	F(e, 32, "Motion properties");
	let r = /* @__PURE__ */ new Set();
	return e.map((e, i) => {
		let a = nt(e, i, t, n), s = JSON.stringify([a.node, a.name]);
		if (r.has(s)) throw o(`Motion property ${i} name`, a.name, `a name no other property of node ${a.node} has`);
		return r.add(s), a;
	});
}
function it(e = []) {
	let t = /* @__PURE__ */ new Map();
	for (let { node: n, name: r, kind: i } of e) t.has(n) || t.set(n, /* @__PURE__ */ new Map()), t.get(n).set(r, i);
	return t;
}
function at(e, t) {
	let { keys: n } = e;
	if (!n) return e.value;
	if (t <= n[0].time) return n[0].value;
	let r = n[n.length - 1];
	if (t >= r.time) return r.value;
	let i = n.findIndex((e) => e.time > t), a = n[i - 1], o = (t - a.time) / (n[i].time - a.time), s = (e, t) => e + (t - e) * o;
	return typeof a.value == "number" ? s(a.value, n[i].value) : a.value.map((e, t) => s(e, n[i].value[t]));
}
function ot(e = []) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) t.has(n.node) || t.set(n.node, /* @__PURE__ */ new Map()), t.get(n.node).set(n.name, n);
	return (e, n, r, i) => {
		let a = at(t.get(e).get(n), i);
		return typeof a == "number" ? a : a[r];
	};
}
var B = [
	"x",
	"y",
	"z"
], V = [
	"+x",
	"-x",
	"+y",
	"-y",
	"+z",
	"-z"
], H = Math.PI / 180, U = 1e-9, W = 1e6, st = ["world", "local"], ct = [
	"emission",
	"metallic",
	"roughness"
], lt = ["color", "emissiveColor"], ut = {
	intensity: !1,
	color: !0
}, dt = { weight: !1 }, ft = ["light", "morph"], pt = {
	light: ut,
	morph: dt
}, mt = {
	eye: !0,
	target: !0,
	fov: !1,
	roll: !1
}, ht = 180 / Math.PI, gt = [
	"type",
	"node",
	"influence"
], G = {
	copy_location: [
		"target",
		"axes",
		"invert",
		"offset",
		"space"
	],
	copy_rotation: [
		"target",
		"axes",
		"invert",
		"mix",
		"space"
	],
	copy_scale: [
		"target",
		"axes",
		"offset",
		"space"
	],
	limit_location: [
		"x",
		"y",
		"z",
		"space"
	],
	limit_rotation: [
		"x",
		"y",
		"z",
		"space"
	],
	track_to: [
		"target",
		"trackAxis",
		"upAxis",
		"worldUp"
	],
	child_of: ["target", "inverse"],
	floor: [
		"target",
		"axis",
		"offset",
		"useRotation"
	],
	copy_transforms: ["target", "mix"],
	limit_distance: [
		"target",
		"distance",
		"mode"
	],
	limit_scale: [
		"x",
		"y",
		"z",
		"space"
	],
	stretch_to: [
		"target",
		"restLength",
		"volume",
		"bulge",
		"worldUp"
	],
	locked_track: [
		"target",
		"trackAxis",
		"lockAxis"
	],
	transformation: [
		"target",
		"source",
		"destination",
		"map",
		"fromMin",
		"fromMax",
		"toMin",
		"toMax",
		"mix",
		"space"
	],
	action: [
		"target",
		"source",
		"axis",
		"min",
		"max",
		"destination",
		"keys",
		"space"
	],
	maintain_volume: [
		"freeAxis",
		"volume",
		"space"
	],
	damped_track: ["target", "trackAxis"],
	pivot: ["target", "offset"],
	follow_path: [
		"points",
		"closed",
		"followCurve",
		"forwardAxis",
		"upAxis",
		"offset",
		"duration"
	],
	clamp_to: [
		"points",
		"mainAxis",
		"cyclic"
	],
	shrinkwrap: [
		"target",
		"mode",
		"projectAxis",
		"distance"
	],
	armature: ["targets"]
}, _t = [
	"translation",
	"rotation",
	"scale"
], vt = 16, yt = Object.freeze(Object.keys(G));
function bt(e, t) {
	if (e === void 0) return [...B];
	if (F(e, 3, t), !e.length || e.some((e) => !B.includes(e)) || new Set(e).size !== e.length) throw RangeError(`${t} must list distinct axes from x, y and z.`);
	return [...e];
}
function K(e, t, n, r) {
	if (e === void 0) return n;
	if (!t.includes(e)) throw RangeError(`${r} must be one of ${t.join(", ")}.`);
	return e;
}
function xt(e, t, n) {
	let r = {};
	for (let i of B) {
		if (e[i] === void 0) continue;
		let a = N(e[i], 2, `${n} ${i}`);
		if (a[0] > a[1] || Math.abs(a[0]) > t || Math.abs(a[1]) > t) throw RangeError(`${n} ${i} must be [min, max] within ${-t} and ${t}, min first.`);
		r[i] = a;
	}
	if (!Object.keys(r).length) throw RangeError(`${n} needs an x, y or z range.`);
	return r;
}
function St(e, t, n, r) {
	return e === void 0 ? 1 : typeof e == "number" ? I(e, 0, 1, `${n} influence`) : (z(e, t, `${n} influence`, r), structuredClone(e));
}
var Ct = [
	"copy_transforms",
	"limit_distance",
	"limit_scale",
	"stretch_to",
	"locked_track",
	"transformation",
	"action",
	"maintain_volume",
	"damped_track",
	"pivot",
	"follow_path",
	"clamp_to",
	"shrinkwrap",
	"armature"
];
function wt(e, t) {
	if (!e || e.args === void 0 || !Ct.includes(e.type)) return e;
	P(e.args, ["influence", ...G[e.type]], `${t} args`);
	let { args: n, ...r } = e, i = Object.keys(n).find((e) => Object.hasOwn(r, e));
	if (i) throw RangeError(`${t} gives ${i} both directly and in args.`);
	return {
		...r,
		...n
	};
}
function Tt(e, t, n, r, i) {
	let a = `Motion constraint ${t}`, o = wt(e, a);
	if (!o || !Object.hasOwn(G, o.type)) throw RangeError(`${a} type must be one of ${yt.join(", ")}.`);
	if (P(o, [...gt, ...G[o.type]], a), !n.has(o.node)) throw RangeError(`${a} node must be a node ID in this recipe; got ${JSON.stringify(o.node)}.`);
	let s = {
		type: o.type,
		node: o.node,
		influence: St(o.influence, r, a, i)
	};
	if (G[o.type].includes("target") && (o.type !== "pivot" || o.target !== void 0)) {
		if (!r.has(o.target)) throw RangeError(`${a} target must be a node ID in this recipe; got ${JSON.stringify(o.target)}.`);
		if (o.target === o.node) throw RangeError(`${a} target cannot be the constrained node itself.`);
		s.target = o.target;
	}
	switch (G[o.type].includes("space") && (s.space = K(o.space, st, "world", `${a} space`)), o.type) {
		case "copy_location":
		case "copy_rotation":
		case "copy_scale":
			if (s.axes = bt(o.axes, `${a} axes`), o.invert !== void 0) {
				if (o.type === "copy_scale") throw TypeError(`${a} does not take invert.`);
				s.invert = bt(o.invert, `${a} invert`);
			}
			if (o.offset !== void 0) {
				if (typeof o.offset != "boolean" || o.type === "copy_rotation") throw TypeError(`${a} offset must be a boolean on copy_location and copy_scale.`);
				s.offset = o.offset;
			}
			o.type === "copy_rotation" && (s.mix = K(o.mix, ["replace", "add"], "replace", `${a} mix`));
			break;
		case "limit_location":
			Object.assign(s, xt(o, W, a));
			break;
		case "limit_rotation":
			Object.assign(s, xt(o, 180, a));
			break;
		case "track_to":
			if (s.trackAxis = K(o.trackAxis, V, "-z", `${a} trackAxis`), s.upAxis = K(o.upAxis, B, "y", `${a} upAxis`), s.trackAxis.slice(1) === s.upAxis) throw RangeError(`${a} trackAxis and upAxis must be different axes.`);
			if (s.worldUp = o.worldUp === void 0 ? [
				0,
				1,
				0
			] : N(o.worldUp, 3, `${a} worldUp`), k(s.worldUp) < U) throw RangeError(`${a} worldUp cannot be zero.`);
			break;
		case "child_of":
			s.inverse = K(o.inverse, ["rest", "none"], "rest", `${a} inverse`);
			break;
		case "floor":
			if (s.axis = K(o.axis, V, "+y", `${a} axis`), s.offset = o.offset === void 0 ? 0 : I(o.offset, -1e6, W, `${a} offset`), o.useRotation !== void 0) {
				if (typeof o.useRotation != "boolean") throw TypeError(`${a} useRotation must be a boolean.`);
				s.useRotation = o.useRotation;
			}
			break;
		default: Dt(o, s, a, r);
	}
	return s;
}
function Et(e, t) {
	if (F(e, 64, `${t} points`), e.length < 2) throw RangeError(`${t} points needs at least 2 points.`);
	return e.map((e, n) => N(e, 3, `${t} points[${n}]`));
}
function Dt(e, t, n, r) {
	switch (e.type) {
		case "copy_transforms":
			t.mix = K(e.mix, [
				"replace",
				"before",
				"after"
			], "replace", `${n} mix`);
			break;
		case "limit_distance":
			t.distance = I(e.distance, 0, W, `${n} distance`), t.mode = K(e.mode, [
				"inside",
				"outside",
				"surface"
			], "inside", `${n} mode`);
			break;
		case "limit_scale":
			Object.assign(t, xt(e, W, n));
			for (let e of B) if (t[e] && !(t[e][0] > 0)) throw RangeError(`${n} ${e} minimum must be above 0.`);
			break;
		case "stretch_to":
			if (t.restLength = e.restLength === void 0 ? 0 : I(e.restLength, 0, W, `${n} restLength`), t.volume = K(e.volume, [
				"xz",
				"x",
				"z",
				"none"
			], "xz", `${n} volume`), t.bulge = e.bulge === void 0 ? 1 : I(e.bulge, 0, 4, `${n} bulge`), t.worldUp = e.worldUp === void 0 ? [
				0,
				1,
				0
			] : N(e.worldUp, 3, `${n} worldUp`), k(t.worldUp) < U) throw RangeError(`${n} worldUp cannot be zero.`);
			break;
		case "locked_track":
			if (t.trackAxis = K(e.trackAxis, V, "+y", `${n} trackAxis`), t.lockAxis = K(e.lockAxis, B, "z", `${n} lockAxis`), t.trackAxis.slice(1) === t.lockAxis) throw RangeError(`${n} trackAxis and lockAxis must be different axes.`);
			break;
		case "transformation":
			if (t.source = K(e.source, _t, "translation", `${n} source`), t.destination = K(e.destination, _t, "translation", `${n} destination`), t.map = e.map === void 0 ? [...B] : F(e.map, 3, `${n} map`), t.map.length !== 3 || t.map.some((e) => !B.includes(e))) throw RangeError(`${n} map needs three axes from x, y and z, one per destination axis.`);
			for (let [r, i] of [
				["fromMin", 0],
				["fromMax", 1],
				["toMin", 0],
				["toMax", 1]
			]) t[r] = e[r] === void 0 ? [
				i,
				i,
				i
			] : N(e[r], 3, `${n} ${r}`);
			if (t.fromMin.some((e, n) => e === t.fromMax[n])) throw RangeError(`${n} fromMax must differ from fromMin on every axis.`);
			if (t.mix = K(e.mix, [
				"replace",
				"add",
				"multiply"
			], "replace", `${n} mix`), t.mix === "multiply" && t.destination !== "scale") throw RangeError(`${n} mix multiply is only for scale destination.`);
			break;
		case "maintain_volume":
			t.freeAxis = K(e.freeAxis, B, "y", `${n} freeAxis`), t.volume = e.volume === void 0 ? 1 : I(e.volume, .001, 1e3, `${n} volume`);
			break;
		case "damped_track":
			t.trackAxis = K(e.trackAxis, V, "+y", `${n} trackAxis`);
			break;
		case "pivot":
			t.offset = e.offset === void 0 ? [
				0,
				0,
				0
			] : N(e.offset, 3, `${n} offset`);
			break;
		case "follow_path":
			if (t.points = Et(e.points, n), e.closed !== void 0 && typeof e.closed != "boolean") throw TypeError(`${n} closed must be a boolean.`);
			if (e.followCurve !== void 0 && typeof e.followCurve != "boolean") throw TypeError(`${n} followCurve must be a boolean.`);
			if (t.closed = e.closed ?? !1, t.followCurve = e.followCurve ?? !1, t.forwardAxis = K(e.forwardAxis, V, "-z", `${n} forwardAxis`), t.upAxis = K(e.upAxis, B, "y", `${n} upAxis`), t.forwardAxis.slice(1) === t.upAxis) throw RangeError(`${n} forwardAxis and upAxis must be different axes.`);
			t.offset = e.offset === void 0 ? 0 : I(e.offset, -1e6, W, `${n} offset`), t.duration = e.duration === void 0 ? 1 : I(e.duration, .001, W, `${n} duration`);
			break;
		case "clamp_to":
			if (t.points = Et(e.points, n), t.mainAxis = K(e.mainAxis, ["auto", ...B], "auto", `${n} mainAxis`), e.cyclic !== void 0 && typeof e.cyclic != "boolean") throw TypeError(`${n} cyclic must be a boolean.`);
			t.cyclic = e.cyclic ?? !1;
			break;
		case "shrinkwrap":
			t.mode = K(e.mode, [
				"nearest",
				"project",
				"surface"
			], "nearest", `${n} mode`), t.projectAxis = K(e.projectAxis, V, "-y", `${n} projectAxis`), t.distance = e.distance === void 0 ? 0 : I(e.distance, -1e6, W, `${n} distance`);
			break;
		case "armature":
			if (F(e.targets, 8, `${n} targets`), !e.targets.length) throw RangeError(`${n} targets needs at least 1 target.`);
			t.targets = e.targets.map((t, i) => {
				if (P(t, ["target", "weight"], `${n} targets[${i}]`), !r.has(t.target)) throw RangeError(`${n} targets[${i}] target must be a node ID in this recipe; got ${JSON.stringify(t.target)}.`);
				if (t.target === e.node) throw RangeError(`${n} target cannot be the constrained node itself.`);
				return {
					target: t.target,
					weight: t.weight === void 0 ? 1 : I(t.weight, 0, 1, `${n} targets[${i}] weight`)
				};
			});
			break;
		default: Ot(e, t, n);
	}
}
function Ot(e, t, n) {
	if (t.source = K(e.source, _t, "translation", `${n} source`), t.destination = K(e.destination, _t, "translation", `${n} destination`), t.axis = K(e.axis, B, "x", `${n} axis`), t.min = I(e.min, -1e6, W, `${n} min`), t.max = I(e.max, -1e6, W, `${n} max`), !(t.min < t.max)) throw RangeError(`${n} min must be below max.`);
	if (F(e.keys, vt, `${n} keys`), e.keys.length < 2) throw RangeError(`${n} keys needs at least 2 keys.`);
	if (t.keys = e.keys.map((e, t) => (P(e, ["at", "value"], `${n} key ${t}`), {
		at: I(e.at, 0, 1, `${n} key ${t} at`),
		value: N(e.value, 3, `${n} key ${t} value`)
	})), t.keys.some((e, n) => n && e.at <= t.keys[n - 1].at)) throw RangeError(`${n} keys must have rising at values.`);
}
function kt(e, t, n, r = /* @__PURE__ */ new Map()) {
	return F(e, 32, "Motion constraints"), e.map((e, i) => Tt(e, i, t, n, r));
}
function At(e, t, n, r) {
	let { id: i, property: a, component: o } = e.target;
	if (i !== void 0) throw RangeError(`${t} camera target takes no id; leave it out, such as { "kind": "camera", "property": "fov" }.`);
	let s = mt[a];
	if (s === void 0) throw RangeError(`${t} camera property must be one of ${Object.keys(mt).join(", ")}.`);
	if (s && !B.includes(o)) throw RangeError(`${t}: camera ${a} needs a component, x, y or z.`);
	if (!s && o !== void 0) throw RangeError(`${t}: camera ${a} takes no component.`);
	return z(e.expression, n, `${t} expression`, r), {
		target: {
			kind: "camera",
			property: a,
			...o === void 0 ? {} : { component: o }
		},
		expression: structuredClone(e.expression)
	};
}
function jt(e, t, n) {
	let { nodes: r, materials: i, visible: a } = n, o = `Motion driver ${t}`;
	P(e, ["target", "expression"], o), P(e.target, [
		"kind",
		"id",
		"property",
		"component"
	], `${o} target`);
	let { kind: s, id: c, property: l, component: u } = e.target;
	if (s === "camera") return At(e, o, a, n.properties);
	if (u !== void 0 && !B.includes(u)) throw RangeError(`${o} component must be x, y or z.`);
	if (s === "node") {
		if (!r.has(c)) throw RangeError(`${o} node must be a node ID in this recipe; got ${JSON.stringify(c)}.`);
		if (![
			"translation",
			"rotation",
			"scale"
		].includes(l)) throw RangeError(`${o} property must be translation, rotation or scale.`);
		if (u === void 0) throw RangeError(`${o} needs a component: x, y or z. Rotation is Euler XYZ in degrees.`);
	} else if (s === "material") {
		if (!i.has(c)) throw RangeError(`${o} material was not found: ${JSON.stringify(c)}.`);
		let e = lt.includes(l);
		if (!e && !ct.includes(l)) throw RangeError(`${o} property must be one of ${[...lt, ...ct].join(", ")}.`);
		if (e !== (u !== void 0)) throw RangeError(`${o}: color properties need a component (x, y, z for red, green, blue); the others take none.`);
	} else if (ft.includes(s)) {
		let e = s === "light" ? n.lights : n.morphs;
		if (!e.has(c)) throw RangeError(`${o} ${s} was not found: ${JSON.stringify(c)}; this scene has ${[...e].slice(0, 24).join(", ") || "none"}.`);
		let t = pt[s][l];
		if (t === void 0) throw RangeError(`${o} property must be one of ${Object.keys(pt[s]).join(", ")} for a ${s}.`);
		if (t !== (u !== void 0)) throw RangeError(`${o}: ${t ? "a light color needs a component (x, y, z for red, green, blue)" : `${l} takes no component`}.`);
	} else throw RangeError(`${o} target kind must be node, material, light, morph or camera.`);
	return z(e.expression, a, `${o} expression`, n.properties), {
		target: {
			kind: s,
			id: c,
			property: l,
			...u === void 0 ? {} : { component: u }
		},
		expression: structuredClone(e.expression)
	};
}
function Mt(e, t) {
	F(e, 32, "Motion drivers");
	let n = /* @__PURE__ */ new Set();
	return e.map((e, r) => {
		let i = jt(e, r, t), a = JSON.stringify(Object.values(i.target));
		if (n.has(a)) throw RangeError(`Motion driver ${r} drives the same property as an earlier driver.`);
		return n.add(a), i;
	});
}
function Nt(e, t) {
	let n = [
		0,
		4,
		8
	].map((n, r) => Array.from(e.slice(n, n + 3), (e) => e / (t[r] || 1)));
	return C(/* @__PURE__ */ new Float64Array(4), S(/* @__PURE__ */ new Float64Array(4), n.flat()));
}
function q(e) {
	let t = x(/* @__PURE__ */ new Float64Array(3), e);
	return {
		translation: m(/* @__PURE__ */ new Float64Array(3), e),
		rotation: Nt(e, t),
		scale: t
	};
}
function J(e) {
	return _(/* @__PURE__ */ new Float64Array(16), e.rotation, e.translation, e.scale);
}
function Pt(e) {
	return {
		translation: Float64Array.from(e.translation),
		rotation: Float64Array.from(e.rotation),
		scale: Float64Array.from(e.scale)
	};
}
function Ft(e, t, n) {
	if (n >= 1) return t;
	let r = q(e), i = q(t);
	return J({
		translation: ne(/* @__PURE__ */ new Float64Array(3), r.translation, i.translation, n),
		rotation: T(/* @__PURE__ */ new Float64Array(4), r.rotation, i.rotation, n),
		scale: ne(/* @__PURE__ */ new Float64Array(3), r.scale, i.scale, n)
	});
}
function Y(e) {
	return e.startsWith("-") ? -1 : 1;
}
function X(e) {
	return B.indexOf(e.replace(/^[+-]/, ""));
}
function It(e, t, n) {
	for (let r of n.axes) {
		let i = X(r), a = n.invert?.includes(r) ? -1 : 1;
		e.translation[i] = (n.offset ? e.translation[i] : 0) + a * t.translation[i];
	}
}
function Lt(e, t, n) {
	let r = f(e.rotation), i = f(t.rotation);
	for (let e of n.axes) {
		let t = X(e), a = n.invert?.includes(e) ? -1 : 1;
		r[t] = (n.mix === "add" ? r[t] : 0) + a * i[t];
	}
	l(e.rotation, r[0], r[1], r[2]);
}
function Rt(e, t, n) {
	for (let r of n.axes) {
		let i = X(r);
		e.scale[i] = (n.offset ? e.scale[i] : 1) * t.scale[i];
	}
}
function zt(e, t, n) {
	for (let t of B) {
		if (!n[t]) continue;
		let r = X(t);
		e.translation[r] = Math.min(n[t][1], Math.max(n[t][0], e.translation[r]));
	}
}
function Bt(e, t, n) {
	let r = f(e.rotation);
	for (let e of B) {
		if (!n[e]) continue;
		let t = X(e);
		r[t] = Math.min(n[e][1] * H, Math.max(n[e][0] * H, r[t]));
	}
	l(e.rotation, r[0], r[1], r[2]);
}
function Vt(e, t, n) {
	for (let t of B) {
		if (!n[t]) continue;
		let r = X(t);
		e.scale[r] = Math.min(n[t][1], Math.max(n[t][0], e.scale[r]));
	}
}
function Ht(e, t) {
	return t === "rotation" ? f(e.rotation).map((e) => e / H) : Array.from(e[t]);
}
function Ut(e, t, n) {
	if (t === "rotation") {
		let [t, r, i] = n.map((e) => e * H);
		l(e.rotation, t, r, i);
	} else e[t].set(n);
}
function Wt(e, t, n) {
	let r = Ht(t, n.source), i = Ht(e, n.destination);
	n.map.forEach((e, t) => {
		let a = X(e), o = (r[a] - n.fromMin[a]) / (n.fromMax[a] - n.fromMin[a]), s = Math.min(1, Math.max(0, o)), c = n.toMin[t] + s * (n.toMax[t] - n.toMin[t]);
		n.mix === "add" ? i[t] += c : n.mix === "multiply" ? i[t] *= c : i[t] = c;
	}), Ut(e, n.destination, i);
}
function Gt(e, t, n) {
	let r = X(n.freeAxis), i = Math.max(U, e.scale[r]), a = Math.sqrt(n.volume / i);
	for (let t = 0; t < 3; t++) t !== r && (e.scale[t] *= a);
}
function Kt(e, t, n) {
	let r = Ht(t, n.source)[X(n.axis)], i = Math.min(1, Math.max(0, (r - n.min) / (n.max - n.min))), { keys: a } = n, o = a.findIndex((e) => e.at >= i), s = o < 0 ? a.length - 1 : Math.max(1, o), c = a[s - 1], l = a[s], u = Math.min(1, Math.max(0, (i - c.at) / (l.at - c.at)));
	Ut(e, n.destination, c.value.map((e, t) => e + u * (l.value[t] - e)));
}
var qt = {
	copy_location: It,
	copy_rotation: Lt,
	copy_scale: Rt,
	limit_location: zt,
	limit_rotation: Bt,
	limit_scale: Vt,
	transformation: Wt,
	action: Kt,
	maintain_volume: Gt
};
function Jt(e) {
	let t = Math.abs(e[1]) < .9 ? [
		0,
		1,
		0
	] : [
		1,
		0,
		0
	];
	return j(/* @__PURE__ */ new Float64Array(3), ae(/* @__PURE__ */ new Float64Array(3), e, t));
}
function Yt(e, t, n) {
	let r = q(e), i = M(/* @__PURE__ */ new Float64Array(3), m(/* @__PURE__ */ new Float64Array(3), t), r.translation);
	if (k(i) < U) return e;
	j(i, i);
	let a = j(/* @__PURE__ */ new Float64Array(3), n.worldUp), o = A(/* @__PURE__ */ new Float64Array(3), a, i, -O(a, i));
	k(o) < 1e-6 && re(o, Jt(i)), j(o, o);
	let s = X(n.trackAxis), c = B.indexOf(n.upAxis), l = [
		null,
		null,
		null
	];
	l[s] = ie(/* @__PURE__ */ new Float64Array(3), i, Y(n.trackAxis)), l[c] = o;
	let u = 3 - s - c;
	return l[u] = ae(/* @__PURE__ */ new Float64Array(3), l[(u + 1) % 3], l[(u + 2) % 3]), r.rotation = C(/* @__PURE__ */ new Float64Array(4), S(/* @__PURE__ */ new Float64Array(4), l.flatMap((e) => Array.from(e)))), J(r);
}
function Xt(e, t, n) {
	let r = m(/* @__PURE__ */ new Float64Array(3), t), i = M(/* @__PURE__ */ new Float64Array(3), m(/* @__PURE__ */ new Float64Array(3), e), r), a = k(i), o = n.mode === "outside", s = n.mode === "inside";
	if (a < U || s && a <= n.distance || o && a >= n.distance) return e;
	let c = b(e);
	return A(i, r, i, n.distance / a), c.set(i, 12), c;
}
function Zt(e, t, n) {
	let r = q(e), i = p(/* @__PURE__ */ new Float64Array(9), r.rotation), a = (e) => Array.from(i.slice(X(e) * 3, X(e) * 3 + 3)), o = a(n.lockAxis), s = a(n.trackAxis).map((e) => e * Y(n.trackAxis)), c = M(/* @__PURE__ */ new Float64Array(3), m(/* @__PURE__ */ new Float64Array(3), t), r.translation);
	if (A(c, c, o, -O(c, o)), k(c) < U) return e;
	j(c, c);
	let l = Math.atan2(O(o, ae(/* @__PURE__ */ new Float64Array(3), s, c)), O(s, c)), u = w(/* @__PURE__ */ new Float64Array(4), o, l);
	return r.rotation = C(/* @__PURE__ */ new Float64Array(4), D(/* @__PURE__ */ new Float64Array(4), u, r.rotation)), J(r);
}
function Qt(e, t, n, r) {
	let i = Yt(e, t, {
		trackAxis: "+y",
		upAxis: "z",
		worldUp: n.worldUp
	}), a = oe(m(/* @__PURE__ */ new Float64Array(3), e), m(/* @__PURE__ */ new Float64Array(3), t));
	if (i === e || !(r > 0)) return i;
	let o = q(i), s = a / r, c = s ** -n.bulge, l = n.volume === "xz" ? Math.sqrt(c) : c;
	return o.scale[1] *= s, n.volume !== "none" && n.volume !== "z" && (o.scale[0] *= l), n.volume !== "none" && n.volume !== "x" && (o.scale[2] *= l), J(o);
}
function $t(e, t, n) {
	let r = /* @__PURE__ */ new Float64Array(3);
	r[X(n.axis)] = Y(n.axis), n.useRotation && (te(r, r, q(t).rotation), j(r, r));
	let i = m(/* @__PURE__ */ new Float64Array(3), e), a = m(/* @__PURE__ */ new Float64Array(3), t), o = O(M(/* @__PURE__ */ new Float64Array(3), i, a), r);
	if (o >= n.offset) return e;
	let s = b(e), c = n.offset - o;
	for (let e = 0; e < 3; e++) s[12 + e] += r[e] * c;
	return s;
}
function en(e, t, n) {
	let r = q(e), i = M(/* @__PURE__ */ new Float64Array(3), m(/* @__PURE__ */ new Float64Array(3), t), r.translation);
	if (k(i) < U) return e;
	j(i, i);
	let a = /* @__PURE__ */ new Float64Array(3);
	a[X(n.trackAxis)] = Y(n.trackAxis);
	let o = te(/* @__PURE__ */ new Float64Array(3), a, r.rotation);
	j(o, o);
	let s = E(/* @__PURE__ */ new Float64Array(4), o, i);
	return r.rotation = C(/* @__PURE__ */ new Float64Array(4), D(/* @__PURE__ */ new Float64Array(4), s, r.rotation)), J(r);
}
function tn(e, t, n, r) {
	let i = q(e), a = q(n), o = t ? m(/* @__PURE__ */ new Float64Array(3), t) : a.translation, s = se(/* @__PURE__ */ new Float64Array(3), o, r.offset), c = M(/* @__PURE__ */ new Float64Array(3), i.translation, s);
	return te(c, c, i.rotation), se(i.translation, s, c), J(i);
}
function nn(e, t, n) {
	let r = e.length, i = t ? r : r - 1, a = (t ? (n % 1 + 1) % 1 : Math.min(1, Math.max(0, n))) * i, o = Math.min(i - 1, Math.floor(a)), s = a - o, c = (n) => t ? e[(n % r + r) % r] : n < 0 ? e[0].map((t, n) => 2 * t - e[1][n]) : n >= r ? e[r - 1].map((t, n) => 2 * t - e[r - 2][n]) : e[n], l = c(o - 1), u = c(o), d = c(o + 1), f = c(o + 2), p = s * s, m = p * s, h = /* @__PURE__ */ new Float64Array(3), g = /* @__PURE__ */ new Float64Array(3);
	for (let e = 0; e < 3; e++) h[e] = .5 * (2 * u[e] + (-l[e] + d[e]) * s + (2 * l[e] - 5 * u[e] + 4 * d[e] - f[e]) * p + (-l[e] + 3 * u[e] - 3 * d[e] + f[e]) * m), g[e] = .5 * (-l[e] + d[e] + 2 * (2 * l[e] - 5 * u[e] + 4 * d[e] - f[e]) * s + 3 * (-l[e] + 3 * u[e] - 3 * d[e] + f[e]) * p);
	return {
		position: h,
		tangent: g
	};
}
function rn(e, t, n) {
	let r = n / t.duration + t.offset, { position: i, tangent: a } = nn(t.points, t.closed, r), o = b(e);
	if (o.set(i, 12), !t.followCurve || k(a) < U) return o;
	let s = se(/* @__PURE__ */ new Float64Array(3), i, a);
	return Yt(o, y(/* @__PURE__ */ new Float64Array(16), s), {
		trackAxis: t.forwardAxis,
		upAxis: t.upAxis,
		worldUp: [
			0,
			1,
			0
		]
	});
}
function an(e, t) {
	let n = t.points, r = X(t.mainAxis);
	if (t.mainAxis === "auto") {
		let e = [
			0,
			1,
			2
		].map((e) => {
			let t = n.map((t) => t[e]);
			return Math.max(...t) - Math.min(...t);
		});
		r = e.indexOf(Math.max(...e));
	}
	let i = n.map((e) => e[r]), a = Math.min(...i), o = Math.max(...i), s = m(/* @__PURE__ */ new Float64Array(3), e), c = Math.max(U, o - a), l = (s[r] - a) / c;
	l = t.cyclic ? (l % 1 + 1) % 1 : Math.min(1, Math.max(0, l));
	let { position: u } = nn(n, t.cyclic, l), d = b(e);
	return d.set(u, 12), d;
}
function on(e, t, n) {
	let r = m(/* @__PURE__ */ new Float64Array(3), e), i = q(t), a = b(e);
	if (n.mode === "project") {
		let e = /* @__PURE__ */ new Float64Array(3);
		e[X(n.projectAxis)] = Y(n.projectAxis);
		let t = X(n.projectAxis), o = Y(n.projectAxis);
		return r[t] = i.translation[t] - o * (i.scale[t] * .5 + n.distance), a.set(r, 12), a;
	}
	let o = M(/* @__PURE__ */ new Float64Array(3), r, i.translation), s = Math.max(...i.scale) * .5 + n.distance, c = k(o);
	return c < U ? (a[13] = i.translation[1] + s, a) : (A(r, i.translation, o, s / c), a.set(r, 12), a);
}
function sn(e, t, n, r, i) {
	let a = 0, o = /* @__PURE__ */ new Float64Array(3), s = /* @__PURE__ */ new Float64Array(3), c = /* @__PURE__ */ new Float64Array(4), l = null;
	for (let u of i.targets) {
		if (u.weight <= 0) continue;
		let i = r.get(u.target), d = v(/* @__PURE__ */ new Float64Array(16), n[i]), f = h(/* @__PURE__ */ new Float64Array(16), t[i], d), p = q(h(/* @__PURE__ */ new Float64Array(16), f, e));
		a += u.weight, A(o, o, p.translation, u.weight), A(s, s, p.scale, u.weight);
		let m = p.rotation;
		l ||= m;
		let g = ee(l, m) < 0 ? -u.weight : u.weight;
		for (let e = 0; e < 4; e++) c[e] += m[e] * g;
	}
	return a <= U ? e : (ie(o, o, 1 / a), ie(s, s, 1 / a), C(c, c), J({
		translation: o,
		rotation: c,
		scale: s
	}));
}
function cn(e, t) {
	let n = [], r = new Uint8Array(e.length), i = (a) => {
		if (r[a]) return;
		r[a] = 1;
		let o = e[a].parent;
		o != null && i(t.get(o)), n.push(a);
	};
	return e.forEach((e, t) => i(t)), n;
}
function ln(e) {
	return {
		translation: Float64Array.from(e.translation ?? [
			0,
			0,
			0
		]),
		rotation: Float64Array.from(e.rotation ?? [
			0,
			0,
			0,
			1
		]),
		scale: Float64Array.from(e.scale ?? [
			1,
			1,
			1
		])
	};
}
function un(e, t) {
	return !!(e?.length || t?.length);
}
function dn({ hierarchy: e, rootMatrix: t, constraints: n = [], drivers: r = [], materials: i = [], properties: a = [] }) {
	if (!un(n, r)) return null;
	let o = new Map(e.map((e, t) => [e.id, t])), s = cn(e, o), c = e.map((e) => e.parent === void 0 || e.parent === null ? -1 : o.get(e.parent)), u = t ? b(t) : g(), d = new Set(o.keys()), p = new Map(i.map((e) => [e.id, e])), _ = it(a), y = ot(a), x = r.map((e) => ({
		...e,
		compiled: z(e.expression, d, "Motion driver expression", _)
	})), S = n.map((e) => ({
		...e,
		compiledInfluence: typeof e.influence == "number" ? null : z(e.influence, d, "Motion constraint influence", _)
	}));
	function C(t) {
		let n = Array(e.length);
		for (let e of s) {
			let r = c[e] >= 0 ? n[c[e]] : u;
			n[e] = h(/* @__PURE__ */ new Float64Array(16), r, J(t[e]));
		}
		return n;
	}
	let w = e.map(ln), T = C(w);
	function E(e, t) {
		return (n, r, i, a) => {
			let s = o.get(n), c = a === "world" ? q(t[s]) : e[s];
			return r === "rotation" ? f(c.rotation)[i] / H : c[r][i];
		};
	}
	function D(e, t) {
		return q(e[o.get(t)]);
	}
	function te(e, t) {
		let n = C(t);
		return {
			time: e,
			read: E(t, n),
			custom: (t, n, r) => y(t, n, r, e),
			distance: (e, t) => oe(D(n, e).translation, D(n, t).translation),
			rotationDifference: (e, t) => {
				let r = Math.abs(ee(D(n, e).rotation, D(n, t).rotation));
				return 2 * Math.acos(Math.min(1, r)) * ht;
			}
		};
	}
	function O(e, t, n, r, i) {
		let a = e.compiled.evaluate(n), { kind: s, id: c, property: u, component: d } = e.target, m = B.indexOf(d);
		if (ft.includes(s) || s === "camera") {
			i.push({
				target: e.target,
				value: a
			});
			return;
		}
		if (s === "material") {
			if (m < 0) {
				r.set(c, {
					...r.get(c),
					[u]: a
				});
				return;
			}
			let e = r.get(c)?.[u] ?? Array.from(p.get(c)?.[u] ?? [
				.5,
				.5,
				.5
			]);
			e[m] = a, r.set(c, {
				...r.get(c),
				[u]: e
			});
			return;
		}
		let h = t[o.get(c)];
		if (u === "rotation") {
			let e = f(h.rotation);
			e[m] = a * H, l(h.rotation, e[0], e[1], e[2]);
		} else {
			if (u === "scale" && !(Math.fround(a) > 0)) throw RangeError(`Motion driver made the scale of ${c} not positive (${a}).`);
			h[u][m] = a;
		}
	}
	function k(e, t, n) {
		let r = C(t), i = o.get(e.node), a = c[i] >= 0 ? r[c[i]] : u, s = r[i], l = e.target === void 0 ? -1 : o.get(e.target), d = e.compiledInfluence ? Math.min(1, Math.max(0, e.compiledInfluence.evaluate(n))) : e.influence, f;
		if (qt[e.type]) {
			let n = e.space === "local", o = n ? Pt(t[i]) : q(s), c = l < 0 ? null : n ? t[l] : q(r[l]);
			qt[e.type](o, c, e), f = n ? h(/* @__PURE__ */ new Float64Array(16), a, J(o)) : J(o);
		} else if (e.type === "track_to") f = Yt(s, r[l], e);
		else if (e.type === "floor") f = $t(s, r[l], e);
		else if (e.type === "copy_transforms") f = e.mix === "before" ? h(/* @__PURE__ */ new Float64Array(16), s, r[l]) : e.mix === "after" ? h(/* @__PURE__ */ new Float64Array(16), r[l], s) : r[l];
		else if (e.type === "limit_distance") f = Xt(s, r[l], e);
		else if (e.type === "locked_track") f = Zt(s, r[l], e);
		else if (e.type === "stretch_to") {
			let t = e.restLength || oe(m(/* @__PURE__ */ new Float64Array(3), T[i]), m(/* @__PURE__ */ new Float64Array(3), T[l]));
			f = Qt(s, r[l], e, t);
		} else if (e.type === "damped_track") f = en(s, r[l], e);
		else if (e.type === "pivot") f = tn(s, l >= 0 ? r[l] : null, T[i], e);
		else if (e.type === "follow_path") f = rn(s, e, n.time);
		else if (e.type === "clamp_to") f = an(s, e);
		else if (e.type === "shrinkwrap") f = on(s, r[l], e);
		else if (e.type === "armature") f = sn(s, r, T, o, e);
		else {
			let t = e.inverse === "rest" ? v(/* @__PURE__ */ new Float64Array(16), T[l]) : g(), n = h(/* @__PURE__ */ new Float64Array(16), r[l], t);
			f = h(/* @__PURE__ */ new Float64Array(16), n, s);
		}
		let p = Ft(s, f, d);
		t[i] = q(h(/* @__PURE__ */ new Float64Array(16), v(/* @__PURE__ */ new Float64Array(16), a), p));
	}
	return Object.freeze({ evaluate(t, n = /* @__PURE__ */ new Map()) {
		let r = e.map((e, t) => {
			let r = n.get(e.id), i = Pt(w[t]);
			return r?.translation && i.translation.set(r.translation), r?.rotation && i.rotation.set(r.rotation), r?.scale && i.scale.set(r.scale), i;
		}), i = te(t, r), a = r.map(Pt), s = /* @__PURE__ */ new Map(), c = [];
		for (let e of x) O(e, a, i, s, c);
		for (let e of S) k(e, a, i);
		let l = /* @__PURE__ */ new Set([...x.filter((e) => e.target.kind === "node").map((e) => e.target.id), ...S.map((e) => e.node)]), u = new Map([...l].map((e) => [e, a[o.get(e)]]));
		for (let [e, t] of u) {
			if (![
				...t.translation,
				...t.rotation,
				...t.scale
			].every(Number.isFinite)) throw RangeError(`Motion constraints produced an invalid pose for node ${e}.`);
			if (t.scale.some((e) => !(Math.fround(e) > 0))) throw RangeError(`Motion constraints made the scale of node ${e} not positive.`);
		}
		return {
			nodes: u,
			materials: s,
			looks: c
		};
	} });
}
// src/agent-retarget.js
var fn = 24;
function pn(e) {
	return e.filter((e) => e.joint).map((e) => e.name);
}
function mn(e) {
	let { mapping: t, unmapped: n, missing: r } = he(pn(e));
	return {
		mapped: Object.keys(t).length,
		unmapped: n.slice(0, fn),
		unmappedCount: n.length,
		missing: r
	};
}
function hn(e, t, n) {
	let r = mn(e), i = mn(t);
	for (let [e, t] of [["source", r], ["target", i]]) if (t.missing.length) throw RangeError(`${n}: the ${e} asset is not humanoid to the bone map. Missing bones: ${t.missing.join(", ")}. ${t.unmappedCount} joints are unmapped.`);
	return {
		source: r,
		target: i
	};
}
function gn(e, t, n, { scale: r = 1, rootMotion: i = !0 } = {}) {
	return ge(d(e), d(t), n, {
		scale: r,
		rootMotion: i
	});
}
// src/clip-strip.js
var _n = Object.freeze([
	"nothing",
	"hold",
	"holdForward"
]), vn = Object.freeze(["replace", "add"]);
function yn(e, t) {
	return t * e.scale * e.repeat;
}
function bn(e, t) {
	return t > 0 ? Math.min(1, Math.max(0, e / t)) : 1;
}
function xn(e, t) {
	let n = yn(e, t), r = e.start + n, i = t * e.repeat;
	function a(t) {
		return t < e.start ? e.extend === "hold" ? bn(0, e.blendIn) : 0 : t > r ? e.extend === "nothing" ? 0 : bn(0, e.blendOut) : Math.min(bn(t - e.start, e.blendIn), bn(r - t, e.blendOut));
	}
	function o(n) {
		let r = Math.min(i, Math.max(0, (n - e.start) / e.scale));
		return r === 0 ? 0 : r - t * (Math.ceil(r / t) - 1);
	}
	return {
		weight: a,
		clipTime: o,
		end: r
	};
}
var Sn = 32, Cn = 64, wn = 128, Tn = 8, En = 30, Dn = 600, On = .05, kn = 20, An = .05, jn = 100;
function Mn(e, t) {
	return {
		clips: e.map((e) => ({
			duration: e.duration,
			targets: new Set(e.tracks.map((e) => e.name.slice(0, e.name.lastIndexOf("."))))
		})),
		nodes: t.map(({ id: e, name: t }) => ({
			id: e,
			name: t
		})),
		hierarchy: t,
		external: /* @__PURE__ */ new Map()
	};
}
function Nn(e) {
	return {
		clips: e.animations.map((e) => ({ duration: e.duration })),
		animations: e.animations,
		nodes: e.nodes.map((e) => structuredClone(e))
	};
}
function Pn(e) {
	let t = new Map(e.nodes.map((e) => [e.id, e.name])), n = new Set(e.nodes.map((e) => e.name));
	return function(e, r) {
		if (typeof e != "string" || !e || e.length > wn) throw o(r, e, `a node ID or name of 1 to ${wn} characters, such as "Hips"`, TypeError);
		if (t.has(e)) return t.get(e);
		if (n.has(e)) return e;
		throw o(r, e, "a node ID or name of this asset, such as \"Hips\"; find them with scene_inspect kind hierarchy");
	};
}
function Fn(e, t, n) {
	let r = `Motion layer ${n} mask`, i = `motion.layers[${n}].mask`;
	if (P(e, [
		"joints",
		"descendants",
		"exclude"
	], r), F(e.joints, Sn, `${r} joints`), !e.joints.length) throw o(`${i}.joints`, e.joints, "at least one node, such as [\"Spine\"]");
	let a = { joints: e.joints.map((e) => t(e, `${i}.joints`)) };
	if (e.descendants !== void 0) {
		if (typeof e.descendants != "boolean") throw o(`${i}.descendants`, e.descendants, "true or false", TypeError);
		a.descendants = e.descendants;
	}
	return e.exclude !== void 0 && (F(e.exclude, Sn, `${r} exclude`), a.exclude = e.exclude.map((e) => t(e, `${i}.exclude`))), a;
}
function In(e, t, n, r) {
	let i = `motion.layers[${r}].bones`;
	if (!e || Object.getPrototypeOf(e) !== Object.prototype) throw o(i, e, "an object from clip node names to asset node names, such as { \"Hips\": \"mixamorig:Hips\" }", TypeError);
	let a = Object.entries(e);
	if (!a.length || a.length > Cn) throw o(i, e, `1 to ${Cn} entries, such as { "Hips": "mixamorig:Hips" }`);
	let s = a.map(([e, r]) => {
		if (!t.targets.has(e)) throw o(`${i}.${e.slice(0, 64)}`, e, `a node the clip moves: one of ${[...t.targets].slice(0, 8).join(", ")}`);
		return [e, n(r, `${i}.${e.slice(0, 64)}`)];
	}), c = s.map(([, e]) => e);
	if (new Set(c).size !== c.length) throw o(i, e, "each asset node used once, so no two clip nodes map to the same node");
	return Object.fromEntries(s);
}
function Ln(e, t, n, r) {
	P(e, ["asset", "clip"], `${n} from`);
	let i = typeof e.asset == "string" ? t.external.get(e.asset.toLowerCase()) : void 0;
	if (!i) throw o(`${r}.from.asset`, e.asset, "the ID of a catalog asset loaded for this session other than this scene's own, such as one from scene_asset_catalog");
	let a = i.clips[e.clip];
	if (!Number.isInteger(e.clip) || !a) throw o(`${r}.from.clip`, e.clip, `the index of a clip in that asset, from 0 to ${i.clips.length - 1}`);
	return hn(i.nodes, t.hierarchy, n), {
		from: {
			asset: e.asset.toLowerCase(),
			clip: e.clip
		},
		clip: a
	};
}
function Rn(e, t, n) {
	if (!t.includes(e)) throw o(n, e, `one of ${t.join(", ")}`);
	return e;
}
function zn(e, t, n, r) {
	let i = `Motion layer ${r} strip`, a = `motion.layers[${r}].strip`;
	P(e, [
		"start",
		"end",
		"scale",
		"repeat",
		"blendIn",
		"blendOut",
		"extend",
		"blend"
	], i);
	for (let e of [
		"speed",
		"offset",
		"loop"
	]) if (t[e] !== void 0) throw o(`motion.layers[${r}].${e}`, t[e], "a field left out, since a strip times the clip with its own start, scale and repeat");
	if (!(n.duration > 0)) throw o(`${a}`, e, "a field left out, since this clip has no length to place");
	if (e.end !== void 0 && e.repeat !== void 0) throw o(`${a}.end`, e.end, "end or repeat, not both: end stops the strip at a time, repeat counts its cycles");
	let s = {
		start: I(e.start ?? 0, -600, Dn, `${i} start`),
		scale: I(e.scale ?? 1, On, kn, `${i} scale`)
	};
	if (e.end !== void 0) {
		let t = I(e.end, -600, Dn, `${i} end`);
		if (t <= s.start) throw o(`${a}.end`, t, `a time after start ${s.start}`);
		s.repeat = (t - s.start) / (n.duration * s.scale);
	} else s.repeat = e.repeat ?? 1;
	I(s.repeat, An, jn, e.end === void 0 ? `${i} repeat` : `${i} end (as ${s.repeat} repeats of the clip)`);
	let c = n.duration * s.scale * s.repeat;
	if (s.blendIn = I(e.blendIn ?? 0, 0, c, `${i} blendIn`), s.blendOut = I(e.blendOut ?? 0, 0, c, `${i} blendOut`), s.blendIn + s.blendOut > c) throw o(`${a}.blendOut`, s.blendOut, `at most ${c - s.blendIn} seconds, since blendIn ${s.blendIn} and blendOut share the strip's ${c} seconds`);
	if (s.extend = Rn(e.extend ?? "nothing", _n, `${a}.extend`), s.blend = Rn(e.blend ?? "replace", vn, `${a}.blend`), s.blend === "add" && t.additive === !1) throw o(`motion.layers[${r}].additive`, !1, "a field left out, since strip blend \"add\" makes the layer additive");
	return s;
}
function Bn(e, t, n, r) {
	let i = `Motion layer ${t}`, a = `motion.layers[${t}]`;
	P(e, [
		"clip",
		"from",
		"scale",
		"rootMotion",
		"loop",
		"weight",
		"speed",
		"offset",
		"additive",
		"reference",
		"mask",
		"bones",
		"morph",
		"strip"
	], i);
	let s = {}, c;
	if (e.from !== void 0) {
		if (e.clip !== void 0 || e.bones !== void 0 || e.morph !== void 0) throw o(`${a}.from`, e.from, "from or clip, not both, such as { \"clip\": 0 } alone; a layer with from has no bones or morph", TypeError);
		let t = Ln(e.from, n, i, a);
		if (c = t.clip, s.from = t.from, e.scale !== void 0 && (s.scale = I(e.scale, .1, 10, `${i} scale`)), e.rootMotion !== void 0) {
			if (typeof e.rootMotion != "boolean") throw o(`${a}.rootMotion`, e.rootMotion, "true or false", TypeError);
			s.rootMotion = e.rootMotion;
		}
	} else {
		if (c = n.clips[e.clip], !Number.isInteger(e.clip) || !c) throw o(`${a}.clip`, e.clip, `the index of a clip in the asset, from 0 to ${n.clips.length - 1}`);
		if (s.clip = e.clip, e.scale !== void 0 || e.rootMotion !== void 0) throw o(`${a}.${e.scale === void 0 ? "rootMotion" : "scale"}`, e.scale ?? e.rootMotion, "a field left out, since scale and rootMotion only apply to a layer with from", TypeError);
	}
	for (let t of [
		"loop",
		"additive",
		"morph"
	]) if (e[t] !== void 0) {
		if (typeof e[t] != "boolean") throw o(`${a}.${t}`, e[t], "true or false", TypeError);
		s[t] = e[t];
	}
	return e.weight !== void 0 && (s.weight = I(e.weight, 0, 1, `${i} weight`)), e.speed !== void 0 && (s.speed = I(e.speed, .05, Tn, `${i} speed`)), e.offset !== void 0 && (s.offset = I(e.offset, -30, En, `${i} offset`)), e.reference !== void 0 && (s.reference = I(e.reference, 0, c.duration, `${i} reference`)), e.strip !== void 0 && (s.strip = zn(e.strip, s, c, t), s.strip.blend === "add" && (s.additive = !0)), e.mask !== void 0 && (s.mask = Fn(e.mask, r, t)), e.bones !== void 0 && (s.bones = In(e.bones, c, r, t)), s;
}
function Vn(e, t) {
	if (!t) throw o("motion.layers", e, "a field left out, since layers play clips of an imported asset and this is a scene recipe; use an asset recipe");
	if (F(e, 8, "Motion layers"), !e.length) throw o("motion.layers", e, "at least one layer, such as [{ \"clip\": 0 }]; leave layers out to play none");
	let n = Pn(t);
	return e.map((e, r) => Bn(e, r, t, n));
}
// src/foot-lock.js
var Z = 30, Hn = 3, Un = ["left", "right"], Wn = Object.freeze({
	contactHeight: .05,
	contactSpeed: .35,
	blend: .1
});
function Gn(e) {
	if (e === !0) return { ...Wn };
	P(e, [
		"contactHeight",
		"contactSpeed",
		"blend",
		"ground"
	], "Motion footLock");
	let t = {
		contactHeight: I(e.contactHeight ?? Wn.contactHeight, .001, 1, "footLock contactHeight"),
		contactSpeed: I(e.contactSpeed ?? Wn.contactSpeed, .01, 5, "footLock contactSpeed"),
		blend: I(e.blend ?? Wn.blend, .01, 1, "footLock blend")
	};
	if (e.ground !== void 0) {
		P(e.ground, ["height", "normal"], "Motion footLock ground");
		let n = N(e.ground.normal ?? [
			0,
			1,
			0
		], 3, "footLock ground normal"), r = Math.hypot(...n);
		if (!(r > 0) || n[1] / r < .5) throw RangeError("footLock ground normal must point up within 60 degrees of +Y.");
		t.ground = {
			height: I(e.ground.height ?? 0, -1e3, 1e3, "footLock ground height"),
			normal: n.map((e) => e / r)
		};
	}
	return t;
}
function Kn(e) {
	return e * e * (3 - 2 * e);
}
function qn(e, t) {
	let n = 1 / Z, r = Math.min(...e.map((e) => e[1])), i = e.map((i, a) => {
		let o = e[Math.max(0, a - 1)], s = e[Math.min(e.length - 1, a + 1)], c = (Math.min(e.length - 1, a + 1) - Math.max(0, a - 1)) * n, l = Math.hypot(s[0] - o[0], s[2] - o[2]) / c;
		return i[1] - r <= t.contactHeight && l <= t.contactSpeed;
	}), a = [], o = null;
	for (let e = 0; e <= i.length; e++) i[e] && o === null && (o = e), !i[e] && o !== null && (e - o >= Hn && a.push({
		first: o,
		last: e - 1
	}), o = null);
	return {
		lowest: r,
		phases: a
	};
}
function Jn(e, t, n) {
	if (!n) return e;
	let [r, i, a] = n.normal, o = e[0] * r + (e[1] - n.height) * i + e[2] * a;
	return n.normal.map((n, r) => e[r] - n * (o - t));
}
function Yn({ settings: e, nodes: t, rootMatrix: n, layers: r, duration: i, loop: a }) {
	let o = d(t, { rootMatrix: n }), s = Un.map((e) => {
		let t = [
			"UpperLeg",
			"LowerLeg",
			"Foot"
		].map((t) => o.mapping[`${e}${t}`]);
		if (t.some((e) => e === void 0)) throw RangeError(`Motion footLock needs the ${e} leg mapped to the humanoid bones (${e}UpperLeg, ${e}LowerLeg, ${e}Foot). scene_inspect lists the unmapped joints.`);
		return {
			side: e,
			root: t[0],
			middle: t[1],
			end: t[2]
		};
	}), c = new Map(t.map((e) => [e.name, e.id])), l = r.map(({ morphs: e, ...t }) => t).filter((e) => e.clip), f = null;
	function p() {
		let t = u({
			rig: o,
			layers: l
		}), n = Math.max(2, Math.round(i * Z) + 1), r = s.map(() => []);
		for (let e = 0; e < n; e++) t.apply(Math.min(i, e / Z)), s.forEach((e, n) => r[n].push(t.jointWorld(e.end).position));
		return s.map((t, n) => {
			let { lowest: i, phases: a } = qn(r[n], e);
			return a.map(({ first: t, last: a }) => ({
				start: t / Z,
				end: a / Z,
				target: Jn(r[n][t], i, e.ground)
			}));
		});
	}
	function m() {
		return f ??= p(), f;
	}
	function h(e) {
		return a ? e % i : Math.min(e, i);
	}
	function g(t, n) {
		let r = {
			weight: 0,
			phase: t[0]
		};
		for (let i of t) {
			let t = 0;
			n >= i.start && n <= i.end ? t = 1 : n < i.start && n >= i.start - e.blend ? t = Kn((n - (i.start - e.blend)) / e.blend) : n > i.end && n <= i.end + e.blend && (t = Kn(1 - (n - i.end) / e.blend)), t > r.weight && (r = {
				weight: t,
				phase: i
			});
		}
		return r;
	}
	let _ = null;
	function v() {
		let t = m(), n = s.map((n, r) => {
			let i = t[r];
			return {
				type: "two-bone",
				root: n.root,
				middle: n.middle,
				end: n.end,
				target: (e, t) => i.length ? g(i, h(e)).phase.target : t,
				weight: (e) => i.length ? g(i, h(e)).weight : 0,
				...e.ground ? { groundNormal: e.ground.normal } : {}
			};
		});
		return _ = u({
			rig: o,
			ik: n
		}), _;
	}
	return {
		solve(e, t) {
			let n = _ ?? v(), r = new Map(t.map((e) => [e.id, e]));
			n.apply(e, (e, t) => {
				o.joints.forEach((n, i) => {
					let a = r.get(c.get(n.name));
					e[i].set(a.rotation), t[i].set(a.translation);
				});
			});
			let i = m();
			if (!s.some((t, n) => i[n].length && g(i[n], h(e)).weight > 0)) return [];
			let a = new Map(o.joints.map((e, t) => [e.name, t]));
			return s.flatMap((e) => [
				e.root,
				e.middle,
				e.end
			].map((e) => ({
				id: c.get(e),
				rotation: Array.from(n.localRotation(a.get(e)))
			})));
		},
		report() {
			let t = m();
			return {
				feet: s.map((e, n) => ({
					bone: `${e.side}Foot`,
					phases: t[n].map((e) => ({
						start: Number(e.start.toFixed(3)),
						end: Number(e.end.toFixed(3))
					}))
				})),
				...e.ground ? { ground: e.ground } : {}
			};
		}
	};
}
// src/agent-motion.js
var Xn = /* @__PURE__ */ e({
	compileAgentMotion: () => Hr,
	motionEffects: () => zr,
	motionEnvironment: () => Rr,
	motionMovesLook: () => Br,
	normalizeAgentMotion: () => kr
}), Zn = /* @__PURE__ */ new Set([
	"sunElevation",
	"sunRotation",
	"turbidity",
	"groundAlbedo",
	"aerialPerspective",
	"ozone"
]), Q = {
	node: {
		translation: 3,
		rotation: 4,
		scale: 3,
		visible: 1
	},
	material: {
		color: 3,
		emissiveColor: 3,
		emission: 1,
		metallic: 1,
		roughness: 1
	},
	camera: {
		eye: 3,
		target: 3,
		fov: 1,
		roll: 1
	},
	morph: { weight: 1 },
	geometry: { oceanTime: 1 },
	light: {
		position: 3,
		direction: 3,
		color: 3,
		intensity: 1
	},
	sun: {
		direction: 3,
		color: 3,
		intensity: 1
	},
	environment: {
		skyTop: 3,
		skyBottom: 3,
		fogColor: 3,
		fogDensity: 1,
		volumeFogDensity: 1,
		ambientIntensity: 1,
		fillIntensity: 1,
		environmentIntensity: 1,
		environmentRotation: 1,
		sunElevation: 1,
		sunRotation: 1,
		turbidity: 1,
		groundAlbedo: 1,
		aerialPerspective: 1,
		ozone: 1
	},
	effects: {
		exposure: 1,
		focusDistance: 1
	}
}, Qn = /* @__PURE__ */ new Set([
	"camera",
	"sun",
	"environment",
	"effects"
]), $n = /* @__PURE__ */ new Set([
	"light",
	"sun",
	"environment",
	"effects"
]), er = {
	point: "pointLights",
	spot: "spotLights",
	area: "areaLights"
}, tr = /* @__PURE__ */ new Set(["spot", "area"]), nr = {
	light: {
		position: [-1e6, 1e6],
		direction: [-1e6, 1e6],
		color: [0, 1],
		intensity: [0, 1e5]
	},
	sun: {
		direction: [-1e6, 1e6],
		color: [0, 1e3],
		intensity: [0, 100]
	},
	environment: {
		skyTop: [0, 1],
		skyBottom: [0, 1],
		fogColor: [0, 1],
		fogDensity: [0, 10],
		volumeFogDensity: [0, 1e3],
		ambientIntensity: [0, 100],
		fillIntensity: [0, 100],
		environmentIntensity: [0, 100],
		environmentRotation: [-100, 100],
		sunElevation: [-90, 90],
		sunRotation: [-360, 360],
		turbidity: [1, 10],
		groundAlbedo: [0, 1],
		aerialPerspective: [0, 4],
		ozone: [0, 10]
	},
	effects: {
		exposure: [.01, 16],
		focusDistance: [.01, 1e5]
	},
	geometry: { oceanTime: [-1e6, 1e6] }
}, rr = [
	"LINEAR",
	"STEP",
	"SMOOTH",
	"CUBICSPLINE"
], ir = 16, ar = 33, or = {
	eye: [
		4,
		3,
		5
	],
	target: [
		0,
		0,
		0
	],
	up: [
		0,
		1,
		0
	],
	fov: 45,
	near: .1,
	far: 1e3
};
function sr(e, t, n, r = `${e}.${t}`) {
	let i = typeof n == "number" ? [n] : n;
	for (let e of i) ce(e, r);
	if (t === "visible" && i.some((e) => e !== 0 && e !== 1)) throw o(r, n, "1 (shown) or 0 (hidden)");
	if (t === "scale" && i.some((e) => Math.fround(e) <= 0)) throw o(r, n, "positive numbers, such as [1, 1, 1]");
	if (e === "material") {
		if (i.some((e) => e < 0)) throw o(r, n, `numbers of 0 or more for ${t}, such as 0.5`);
		if ([
			"color",
			"metallic",
			"roughness"
		].includes(t) && i.some((e) => e > 1)) throw o(r, n, `numbers from 0 to 1 for ${t}, such as 0.5`);
	}
	if (e === "morph" && i.some((e) => e < 0 || e > 1)) throw o(r, n, "a morph weight from 0 to 1, such as 0.5");
	let a = nr[e]?.[t];
	if (a && i.some((e) => e < a[0] || e > a[1])) throw o(r, n, `${e} ${t} values from ${a[0]} to ${a[1]}, such as ${Math.min(Math.max(1, a[0]), a[1])}`);
	if (t === "direction" && Math.hypot(...i) < 1e-6) throw o(r, n, "a direction that is not all zero, such as [0, -1, 0]; keyframes of opposite directions blend through zero");
	if (e === "camera" && t === "fov" && (Math.fround(n) <= 0 || Math.fround(n) >= 180)) throw o(r, n, "degrees above 0 and below 180, such as 50");
}
function cr(e) {
	return e.property === "rotation" ? "rotation" : Q[e.kind][e.property] === 1 ? "value" : "translation";
}
function lr(e, t) {
	let n = {
		time: e.time,
		value: Array.isArray(e.value) ? [...e.value] : e.value
	};
	return e.easing !== void 0 && (n.easing = e.easing), t === "CUBICSPLINE" && (n.inTangent = Array.isArray(e.inTangent) ? [...e.inTangent] : e.inTangent, n.outTangent = Array.isArray(e.outTangent) ? [...e.outTangent] : e.outTangent), n;
}
function ur(e, t, r, i) {
	P(e, [
		"time",
		"value",
		"inTangent",
		"outTangent",
		"easing"
	], "motion keyframe");
	let a = Q[t.kind][t.property], s = {
		time: I(e.time, 0, r, "time"),
		value: N(e.value, a, "value")
	};
	sr(t.kind, t.property, s.value, "value");
	let c = n(e);
	if (c && i !== "LINEAR" && i !== "SMOOTH") throw o("easing", e.easing, `a field left out unless the track interpolation is LINEAR or SMOOTH, not ${i}`);
	if (Object.assign(s, c), i === "CUBICSPLINE") s.inTangent = N(e.inTangent, a, "Incoming tangent"), s.outTangent = N(e.outTangent, a, "Outgoing tangent");
	else if (Object.hasOwn(e, "inTangent") || Object.hasOwn(e, "outTangent")) throw o(Object.hasOwn(e, "inTangent") ? "inTangent" : "outTangent", e.inTangent ?? e.outTangent, `a field left out unless the track interpolation is CUBICSPLINE, such as "interpolation": "CUBICSPLINE" (this track is ${i})`, TypeError);
	return s;
}
function dr(e) {
	return Object.entries(er).flatMap(([t, n]) => (e[n] ?? []).map((e, n) => `${t}:${n}`));
}
function fr(e, t) {
	let { kind: n, id: r, property: i } = e;
	if ($n.has(n)) {
		if (!t.environment || !t.effects) throw o(`motion.tracks.${n}`, n, "a node, material, morph or camera track, since lights, sky and effects belong to a scene recipe and an imported asset has none");
		if (n === "light") {
			let e = dr(t.environment);
			if (!e.includes(r)) throw o("motion.tracks.id", r, `one of the lights of this scene: ${e.join(", ") || "none yet"}; the sun is a sun track, such as "point:0"`);
			if (i === "direction" && !tr.has(r.split(":")[0])) throw o("motion.tracks.property", `${r}.direction`, "a property the light has; only spot and area lights have a direction, and a point light takes position, color and intensity");
		}
		if (n === "effects" && i === "focusDistance" && !(t.effects.depthOfField?.blur > 0)) throw o("motion.tracks.property", "effects.focusDistance", "a track only when effects.depthOfField.blur is above 0, such as blur 2; a camera with an fStop focuses on its target, so move the camera target track instead");
		if (n === "environment" && Zn.has(i) && t.environment.sky?.type !== "physical") throw o("motion.tracks.property", `environment.${i}`, "a track only when environment.sky is { \"type\": \"physical\" }");
	}
}
function $(e, t, n) {
	if (typeof e != "string" || !t.has(e)) throw o(n, e, "a node ID in this recipe, such as \"arm\"");
	return e;
}
function pr(e, t, n, r) {
	P(e, ["keyframes", "interpolation"], r);
	let i = e.interpolation ?? "LINEAR";
	if (![
		"LINEAR",
		"STEP",
		"SMOOTH"
	].includes(i)) throw o(`${r}.interpolation`, i, "LINEAR, STEP or SMOOTH");
	if (F(e.keyframes, 64, `${r}.keyframes`), !e.keyframes.length) throw o(`${r}.keyframes`, e.keyframes, "at least one keyframe, such as [{ \"time\": 0, \"value\": [0, 1, 0] }]");
	return {
		interpolation: i,
		keyframes: e.keyframes.map((e) => (P(e, ["time", "value"], `${r}.keyframe`), {
			time: I(e.time, 0, n, "Keyframe time"),
			value: N(e.value, t, `${r}.value`)
		}))
	};
}
function mr(e, t, n, r) {
	if (Array.isArray(e)) return N(e, 3, r);
	if (e && Object.hasOwn(e, "node")) return P(e, ["node"], r), { node: $(e.node, t, `${r}.node`) };
	if (e && Object.hasOwn(e, "keyframes")) return pr(e, 3, n, r);
	throw o(r, e, "[x, y, z], { \"node\": id } or { \"keyframes\": [{ \"time\", \"value\" }] }, such as [0, 1, 0]", TypeError);
}
function hr(e, t, n) {
	if (e === void 0) return 1;
	if (typeof e == "number") return I(e, 0, 1, n);
	let r = pr(e, 1, t, n);
	return r.keyframes.forEach((e) => I(e.value, 0, 1, n)), r;
}
function gr(e, t, n = null) {
	if (n) {
		if (!e || typeof e != "object" || Array.isArray(e)) throw o(t, e, "an object mapping joint node IDs to { x, y, z } degree ranges", TypeError);
		for (let r of Object.keys(e)) if (!n.has(r)) throw o(`${t}.${r}`, r, "a node ID in the chain");
	} else P(e, ["root", "middle"], t);
	let r = {};
	for (let n of Object.keys(e)) {
		P(e[n], [
			"x",
			"y",
			"z"
		], `${t}.${n}`), r[n] = {};
		for (let i of Object.keys(e[n])) {
			let a = N(e[n][i], 2, `${t}.${n}.${i}`);
			if (a[0] > a[1] || a[0] < -180 || a[1] > 180) throw o(`${t}.${n}.${i}`, e[n][i], "[min, max] degrees within -180 and 180, min first, such as [-90, 90]");
			r[n][i] = a;
		}
	}
	return r;
}
function _r(e, t, n) {
	if (e.chain !== void 0 && (e.root !== void 0 || e.end !== void 0)) throw o(`${n}.chain`, e.chain, "chain, or root and end, not both", TypeError);
	if (e.chain !== void 0) {
		let r = F(e.chain, 16, `${n}.chain`);
		if (r.length < 2) throw o(`${n}.chain`, e.chain, "2 to 16 node IDs from base to end, such as [\"b0\", \"b1\", \"b2\", \"tip\"]");
		return { chain: r.map((e, r) => $(e, t, `${n}.chain[${r}]`)) };
	}
	if (e.root !== void 0 && e.end !== void 0) return {
		root: $(e.root, t, `${n}.root`),
		end: $(e.end, t, `${n}.end`)
	};
	throw o(`${n}.chain`, e.chain, "chain: [nodeIds], or root and end node IDs", TypeError);
}
function vr(e, t) {
	return typeof e == "boolean" ? e : I(e, 0, 1, t);
}
function yr(e, t, n) {
	if (Array.isArray(e)) {
		if (F(e, 64, n), e.length < 2) throw o(n, e, "2 to 64 [x, y, z] points");
		return e.map((e, t) => N(e, 3, `${n}[${t}]`));
	}
	if (e && typeof e == "object" && Object.hasOwn(e, "nodes")) {
		P(e, ["nodes"], n);
		let r = F(e.nodes, 64, `${n}.nodes`);
		if (r.length < 2) throw o(`${n}.nodes`, e.nodes, "2 to 64 node IDs");
		return { nodes: r.map((e, r) => $(e, t, `${n}.nodes[${r}]`)) };
	}
	throw o(n, e, "2 to 64 [x, y, z] points or { \"nodes\": [ids] }", TypeError);
}
function br(e, t, n, r, i) {
	let a = `motion.ik[${t}]`;
	if (e?.type === "two-bone") {
		P(e, [
			"type",
			"root",
			"middle",
			"end",
			"target",
			"pole",
			"weight",
			"keepEndRotation",
			"limits",
			"bendToward"
		], a);
		let t = {
			type: "two-bone",
			root: $(e.root, n, `${a}.root`),
			middle: $(e.middle, n, `${a}.middle`),
			end: $(e.end, n, `${a}.end`),
			target: mr(e.target, r, i, `${a}.target`),
			weight: hr(e.weight, i, `${a}.weight`)
		};
		if (e.pole !== void 0 && (t.pole = mr(e.pole, r, i, `${a}.pole`)), e.keepEndRotation !== void 0) {
			if (typeof e.keepEndRotation != "boolean") throw o(`${a}.keepEndRotation`, e.keepEndRotation, "true or false", TypeError);
			t.keepEndRotation = e.keepEndRotation;
		}
		return e.limits !== void 0 && (t.limits = gr(e.limits, `${a}.limits`)), e.bendToward !== void 0 && (t.bendToward = N(e.bendToward, 3, `${a}.bendToward`)), t;
	}
	if (e?.type === "aim") {
		if (P(e, [
			"type",
			"joint",
			"joints",
			"forward",
			"worldForward",
			"target",
			"maxAngle",
			"weight"
		], a), e.forward !== void 0 && e.worldForward !== void 0) throw o(`${a}.worldForward`, e.worldForward, "forward or worldForward, not both; leave one out", TypeError);
		if (e.joint === void 0 == (e.joints === void 0)) throw o(`${a}.joint`, e.joint, "joint, or joints listed from the base of the chain to the aiming node, such as { \"joint\": \"head\" }", TypeError);
		let t = e.joints === void 0 ? [e.joint] : F(e.joints, 16, `${a}.joints`);
		if (!t.length) throw o(`${a}.joints`, e.joints, "at least one node ID, such as [\"neck\", \"head\"]");
		let s = {
			type: "aim",
			joints: t.map((e) => $(e, n, `${a}.joint`)),
			target: mr(e.target, r, i, `${a}.target`),
			weight: hr(e.weight, i, `${a}.weight`)
		};
		return e.worldForward === void 0 ? s.forward = N(e.forward ?? [
			0,
			0,
			1
		], 3, `${a}.forward`) : s.worldForward = N(e.worldForward, 3, `${a}.worldForward`), e.maxAngle !== void 0 && (s.maxAngle = I(e.maxAngle, .001, 180, `${a}.maxAngle`)), s;
	}
	if (e?.type === "chain" || e?.type === "ik") {
		P(e, [
			"type",
			"chain",
			"root",
			"end",
			"target",
			"pole",
			"poleAngle",
			"stretch",
			"iterations",
			"limits",
			"keepEndRotation",
			"weight"
		], a);
		let t = _r(e, n, a), s = {
			type: "chain",
			...t,
			target: mr(e.target, r, i, `${a}.target`),
			weight: hr(e.weight, i, `${a}.weight`)
		};
		if (e.pole !== void 0 && (s.pole = mr(e.pole, r, i, `${a}.pole`)), e.poleAngle !== void 0 && (s.poleAngle = I(e.poleAngle, -180, 180, `${a}.poleAngle`)), e.stretch !== void 0 && (s.stretch = vr(e.stretch, `${a}.stretch`)), e.iterations !== void 0) {
			if (!Number.isInteger(e.iterations)) throw o(`${a}.iterations`, e.iterations, "a whole number of iterations from 1 to 64, such as 16", TypeError);
			s.iterations = I(e.iterations, 1, 64, `${a}.iterations`);
		}
		if (e.keepEndRotation !== void 0) {
			if (typeof e.keepEndRotation != "boolean") throw o(`${a}.keepEndRotation`, e.keepEndRotation, "true or false", TypeError);
			s.keepEndRotation = e.keepEndRotation;
		}
		if (e.limits !== void 0) {
			let r = t.chain ? new Set(t.chain.slice(0, -1)) : n;
			s.limits = gr(e.limits, `${a}.limits`, r);
		}
		return s;
	}
	if (e?.type === "spline" || e?.type === "spline_ik") {
		P(e, [
			"type",
			"chain",
			"root",
			"end",
			"curve",
			"stretch",
			"weight"
		], a);
		let t = {
			type: "spline",
			..._r(e, n, a),
			curve: yr(e.curve, r, `${a}.curve`),
			weight: hr(e.weight, i, `${a}.weight`)
		};
		return e.stretch !== void 0 && (t.stretch = vr(e.stretch, `${a}.stretch`)), t;
	}
	throw o(`${a}.type`, e?.type, "one of two-bone, aim, chain or spline");
}
function xr(e) {
	return e.type === "two-bone" ? [
		e.root,
		e.middle,
		e.end
	] : e.type === "aim" ? e.joints : e.chain ?? [e.root, e.end];
}
function Sr(e) {
	let t = [e.target, e.pole].filter((e) => e?.node).map((e) => e.node);
	return e.curve?.nodes ? [...t, ...e.curve.nodes] : t;
}
function Cr(e, t) {
	let n = [], r = t.get(e)?.parent;
	for (; r != null;) n.push(r), r = t.get(r)?.parent;
	return n;
}
function wr(e, t, n) {
	let r = new Map(Tr(n).map((e) => [e.id, e])), i = new Set(t.filter((e) => e.kind === "node" && e.property === "scale").map((e) => e.id)), a = /* @__PURE__ */ new Set();
	for (let t of e) for (let e of [...xr(t), ...Sr(t)]) Cr(e, r).forEach((e) => a.add(e));
	for (let e of a) {
		if (i.has(e)) throw o("motion.tracks", `node ${e} scale`, `no scale track on node ${e}, since IK nodes sit below it; drop the track or put the size on a child node`);
		let t = r.get(e).scale ?? [
			1,
			1,
			1
		];
		if (Math.max(...t) - Math.min(...t) > .001 * Math.max(...t)) throw o(`nodes.${e}.scale`, t, "a uniform scale such as [1, 1, 1], since IK nodes sit below it; put the size on a child node with the geometry");
	}
}
function Tr(e) {
	return e.ikHierarchy ?? e.nodes;
}
function Er(e, t, n, r) {
	F(e, ir, "Motion ik");
	let i = new Set(t.nodes.map((e) => e.id)), a = new Set(Tr(t).map((e) => e.id)), o = e.map((e, t) => br(e, t, i, a, r));
	return wr(o, n, t), o;
}
function Dr(e) {
	let t = 0;
	for (let n of e) for (let e of [
		n.target,
		n.pole,
		n.weight
	]) t += e?.keyframes?.length ?? 0;
	return t;
}
function Or(e, t) {
	if (!t.normalizeDrive) throw o("motion.drive", e, "a field left out in a scene recipe, since it moves an imported asset recipe; for an asset placed in a scene, give the placement a drive: { asset: { id, drive } }");
	let n = t.normalizeDrive(e, "motion.drive");
	return {
		canonical: n,
		built: t.buildDrive(n)
	};
}
function kr(e, t) {
	if (e == null) return null;
	P(e, [
		"duration",
		"loop",
		"tracks",
		"ik",
		"constraints",
		"drivers",
		"properties",
		"layers",
		"footLock",
		"drive"
	], "motion");
	let n = e.drive === void 0 ? null : Or(e.drive, t), r = I(e.duration === void 0 && n ? Math.ceil(n.built.duration * 1e3) / 1e3 : e.duration, .1, 30, "motion.duration"), s = e.loop !== void 0 && e.loop;
	if (typeof s != "boolean") throw o("motion.loop", s, "true or false", TypeError);
	let c = e.tracks ?? [];
	if (F(c, 128, "Motion tracks"), !c.length && !e.layers?.length && !e.ik?.length && !e.constraints?.length && !e.drivers?.length && !n) throw o("motion", e, "at least one track, IK solver, constraint or driver, such as { \"duration\": 1, \"tracks\": [...] }; use null to clear it");
	let l = new Set((t.nodes ?? []).map((e) => e.id)), u = new Set((t.materials ?? []).map((e) => e.id)), d = new Set((t.geometries ?? []).filter((e) => e.type === "mesh" && (e.stack ?? []).some((e) => e?.op === "ocean")).map((e) => e.id)), f = new Set(t.morphTargets ?? (t.geometries ?? []).flatMap((e) => e.grow ? [e.grow.name] : (e.shapeKeys ?? []).map((e) => e.name))), p = /* @__PURE__ */ new Set(), m = 0, h = c.map((e, n) => {
		if (P(e, [
			"kind",
			"id",
			"property",
			"interpolation",
			"keyframes",
			"extrapolation",
			"modifiers"
		], "motion track"), !Object.hasOwn(Q, e.kind) || !Object.hasOwn(Q[e.kind], e.property)) {
			let t = Object.hasOwn(Q, e.kind) ? ` ${e.kind} properties: ${Object.keys(Q[e.kind]).join(", ")}.` : ` Kinds: ${Object.keys(Q).join(", ")}.`;
			throw o(`motion.tracks[${n}].property`, `${e.kind}.${e.property}`, `a kind and property pair.${t}`);
		}
		if (Qn.has(e.kind)) {
			if (Object.hasOwn(e, "id")) throw o(`motion.tracks[${n}].id`, e.id, `a field left out, since ${e.kind} tracks have no ID, such as { "kind": "${e.kind}", "property": ..., "keyframes": [...] }`, TypeError);
		} else {
			if (typeof e.id != "string" || !e.id.trim() || e.id.length > 128) throw o(`motion.tracks[${n}].id`, e.id, "an ID of 1 to 128 characters, such as \"body\"", TypeError);
			let t = e.kind === "node" ? l : e.kind === "morph" ? f : e.kind === "geometry" ? d : u;
			if (e.kind !== "light" && !t.has(e.id)) {
				let r = e.kind === "morph" ? `; morph targets of this asset: ${[...f].slice(0, 24).join(", ") || "none"}` : e.kind === "geometry" ? "; a geometry track needs a mesh geometry whose stack has an ocean node, such as stack [{ \"op\": \"ocean\" }]" : "";
				throw o(`motion.tracks[${n}].id`, e.id, `the ID of a ${e.kind} in this recipe, such as ${JSON.stringify([...t][0] ?? "body")}${r}`);
			}
		}
		fr(e, t);
		let c = JSON.stringify([
			e.kind,
			e.id ?? null,
			e.property
		]);
		if (p.has(c)) throw o(`motion.tracks[${n}].property`, `${e.kind}.${e.property}`, "one track per target and property, but this one repeats an earlier track: merge the keyframes, or drop the duplicate");
		p.add(c);
		let h = e.interpolation ?? (e.property === "visible" ? "STEP" : "LINEAR");
		if (!rr.includes(h)) throw o(`motion.tracks[${n}].interpolation`, h, `one of ${rr.join(", ")}`);
		if (F(e.keyframes, 64, "Motion keyframes"), m += e.keyframes.length, m > 2048) throw o(`motion.tracks[${n}].keyframes`, e.keyframes.length, `fewer keyframes, since a motion holds at most 2048 in total and this track reaches ${m}`);
		let g = e.keyframes.map((t, i) => a(`motion.tracks[${n}].keyframes[${i}]`, () => ur(t, e, r, h))), _ = i({
			duration: r,
			loop: s,
			tracks: [{
				target: String(n),
				property: cr(e),
				interpolation: h,
				keyframes: g,
				extrapolation: e.extrapolation,
				modifiers: e.modifiers
			}]
		}), v = {
			kind: e.kind,
			property: e.property,
			interpolation: h,
			keyframes: _.tracks[0].keyframes.map((e) => lr(e, h))
		};
		return _.tracks[0].effects && Object.assign(v, Me(_.tracks[0].effects)), Qn.has(e.kind) || (v.id = e.id), v;
	}), g = {
		duration: r,
		loop: s,
		tracks: h
	};
	if (n && (g.drive = n.canonical), e.layers !== void 0 && (g.layers = Vn(e.layers, t.clipLayerContext)), e.footLock !== void 0) {
		if (!g.layers?.length) throw o("motion.footLock", e.footLock, "a field left out unless motion.layers has layers, since it plants the feet of their clips, such as layers [{ \"clip\": 0 }]");
		g.footLock = Gn(e.footLock);
	}
	if (e.ik !== void 0 && (g.ik = Er(e.ik, t, h, r), m + Dr(g.ik) > 2048)) throw o("motion.ik", e.ik, `fewer keyframes, since a motion holds at most 2048 in total and tracks plus IK reach ${m + Dr(g.ik)}`);
	let _ = new Set(Tr(t).map((e) => e.id));
	if (e.properties !== void 0 && (g.properties = rt(e.properties, r, _)), e.constraints !== void 0 && (g.constraints = kt(e.constraints, l, _, it(g.properties))), e.drivers !== void 0) {
		let n = new Set(t.environment ? dr(t.environment) : []);
		g.drivers = Mt(e.drivers, {
			nodes: l,
			materials: u,
			lights: n,
			morphs: f,
			visible: _,
			properties: it(g.properties)
		});
		for (let { target: e } of g.drivers) if (p.has(JSON.stringify([
			e.kind,
			e.id ?? null,
			e.property
		]))) {
			let t = e.id === void 0 ? e.kind : `${e.kind} ${e.id}`;
			throw o("motion.drivers", `${t} ${e.property}`, `a property no track animates, since a track on ${t} already moves ${e.property}; drop the track or the driver`);
		}
	}
	return g;
}
function Ar(e = []) {
	let t = {};
	for (let { target: n, value: r } of e) n.kind === "camera" && (n.component === void 0 ? t[n.property] = r : (t[n.property] ??= [])[Fr[n.component]] = r);
	return t;
}
function jr(e, t) {
	let n = Tr(t), r = new Map(n.map((e) => [e.id, e])), i = /* @__PURE__ */ new Set();
	for (let t of e) for (let e of [...xr(t), ...Sr(t)]) i.add(e), Cr(e, r).forEach((e) => i.add(e));
	let a = n.filter((e) => i.has(e.id)), o = new Map(a.map((e, t) => [e.id, t]));
	return {
		mapping: {},
		...t.ikRootMatrix ? { rootMatrix: t.ikRootMatrix } : {},
		joints: a.map((e) => ({
			name: e.id,
			parent: e.parent === void 0 || e.parent === null ? -1 : o.get(e.parent),
			translation: e.translation ?? [
				0,
				0,
				0
			],
			rotation: e.rotation ?? [
				0,
				0,
				0,
				1
			],
			scale: e.scale ?? [
				1,
				1,
				1
			]
		}))
	};
}
function Mr(e, t, n) {
	let r = [];
	return e.forEach((e, t) => {
		e.target?.keyframes && r.push({
			target: `target ${t}`,
			property: "translation",
			interpolation: e.target.interpolation,
			keyframes: e.target.keyframes
		}), e.pole?.keyframes && r.push({
			target: `pole ${t}`,
			property: "translation",
			interpolation: e.pole.interpolation,
			keyframes: e.pole.keyframes
		}), e.weight.keyframes && r.push({
			target: `weight ${t}`,
			property: "value",
			interpolation: e.weight.interpolation,
			keyframes: e.weight.keyframes
		});
	}), r.length ? i({
		duration: t,
		loop: n,
		tracks: r
	}) : null;
}
function Nr(e, t, n) {
	let i = jr(e.ik, t), a = Mr(e.ik, e.duration, e.loop), o = a ? r(a) : null, s = (e) => o.tracks.find((t) => t.target === e).output, c = null, l = (e, t) => {
		if (Array.isArray(e)) return () => e;
		if (e.node) return () => c.jointWorld(e.node).position;
		let n = s(t);
		return () => n;
	}, d = e.ik.map((e, t) => {
		let n = e.weight.keyframes ? s(`weight ${t}`) : null, r = n ? () => Math.min(1, Math.max(0, n[0])) : e.weight;
		if (e.type === "spline") {
			let t = Array.isArray(e.curve) ? e.curve : () => e.curve.nodes.map((e) => c.jointWorld(e).position);
			return {
				type: "spline",
				...e.chain ? { chain: e.chain } : {
					root: e.root,
					end: e.end
				},
				curve: t,
				stretch: e.stretch,
				weight: r
			};
		}
		let i = {
			target: l(e.target, `target ${t}`),
			weight: r
		};
		return e.type === "aim" ? {
			...i,
			type: "aim",
			joints: e.joints,
			forward: e.forward,
			worldForward: e.worldForward,
			maxAngle: e.maxAngle
		} : e.type === "chain" ? {
			...i,
			type: "chain",
			...e.chain ? { chain: e.chain } : {
				root: e.root,
				end: e.end
			},
			...e.pole ? { pole: l(e.pole, `pole ${t}`) } : {},
			poleAngle: e.poleAngle,
			stretch: e.stretch,
			iterations: e.iterations,
			limits: e.limits,
			keepEndRotation: e.keepEndRotation
		} : {
			...i,
			type: "two-bone",
			root: e.root,
			middle: e.middle,
			end: e.end,
			...e.pole ? { pole: l(e.pole, `pole ${t}`) } : {},
			keepEndRotation: e.keepEndRotation,
			limits: e.limits,
			bendToward: e.bendToward
		};
	});
	c = u({
		rig: i,
		ik: d
	});
	let f = new Map(i.joints.map((e, t) => [e.name, t])), p = i.joints.map((e, t) => ({
		index: t,
		tracks: n.get(e.name)
	})), m = new Set(e.ik.filter((e) => (e.type === "two-bone" || e.type === "chain") && e.keepEndRotation === !1).map((e) => e.end ?? e.chain[e.chain.length - 1])), h = new Set(c.solvedJointNames.filter((e) => !m.has(e))), g = new Map([...h].map((e) => [e, /* @__PURE__ */ new Float64Array(4)])), _ = c.writtenJoints.filter((e) => e.translation).map((e) => i.joints[e.index].name), v = new Map(_.map((e) => [e, /* @__PURE__ */ new Float64Array(3)]));
	function y(e, t) {
		for (let { index: n, tracks: r } of p) r?.rotation && e[n].set(r.rotation), r?.translation && t[n].set(r.translation);
	}
	return {
		staged: g,
		stagedTranslations: v,
		solve(e, t) {
			if (o?.sample(e), t) {
				let n = new Map(t.map((e) => [e.id, e]));
				c.apply(e, (e, t) => {
					i.joints.forEach((r, i) => {
						let a = n.get(r.name);
						e[i].set(a.rotation), t[i].set(a.translation);
					});
				});
			} else c.apply(e, y);
			for (let [e, t] of g) if (t.set(c.localRotation(f.get(e))), !t.every(Number.isFinite)) throw RangeError(`Motion ik produced an invalid rotation for node ${e}.`);
			for (let [e, t] of v) t.set(c.localTranslation(f.get(e)));
			return c.ikResults;
		}
	};
}
function Pr(e, t) {
	let n = e.emission ?? 0, r = e.emissiveColor ?? e.color ?? [
		.5,
		.5,
		.5
	];
	for (let i of r) {
		let r = Math.fround(i) * Math.fround(n);
		if (!Number.isFinite(Math.fround(r))) throw o(`materials.${t}.emission`, n, "a value that keeps emissiveColor times emission inside Float32 range, such as 5");
		if (e.tag === "unlit" && r > 65500) throw o(`materials.${t}.emission`, n, "a value that keeps an unlit emissiveColor times emission at or below 65500, such as 5");
	}
}
var Fr = {
	x: 0,
	y: 1,
	z: 2
};
function Ir(e, t) {
	let [n, r] = t.split(":");
	return e.environment[er[n]][Number(r)].color ?? [
		1,
		1,
		1
	];
}
function Lr(e) {
	let t = (e.drivers ?? []).filter((e) => e.target.kind === "node").map((e) => e.target.id);
	return /* @__PURE__ */ new Set([...t, ...(e.constraints ?? []).map((e) => e.node)]);
}
function Rr(e, t) {
	for (let [n, r] of t.lights) {
		let [t, i] = n.split(":");
		Object.assign(e[er[t]][Number(i)], Vr(r));
	}
	if (t.sun) {
		let { direction: n, color: r, intensity: i } = Vr(t.sun);
		n && (e.lightDirection = n), r && (e.keyColor = r), i !== void 0 && (e.keyIntensity = i);
	}
	if (t.environment) {
		let { volumeFogDensity: n, ...r } = Vr(t.environment), i = {};
		for (let e of Zn) r[e] !== void 0 && (i[e] = r[e], delete r[e]);
		e.sky && Object.keys(i).length > 0 && _e("physicalSky").applyPhysicalSky({
			...e.sky,
			...i
		}, e, o), Object.assign(e, r), n !== void 0 && (e.volumeFog.density = n);
	}
	return e;
}
function zr(e, t) {
	let { exposure: n, focusDistance: r } = t.effects;
	return n !== void 0 && (e.exposure = n), r !== void 0 && (e.depthOfField.focusDistance = r), e;
}
function Br(e) {
	return !!(e && (e.lights.size || e.sun || e.environment || e.effects));
}
function Vr(e) {
	return Object.fromEntries(Object.entries(e).map(([e, t]) => [e, typeof t == "number" ? t : Array.from(t)]));
}
function Hr(e, t) {
	let n = kr(e, t);
	if (n === null) return null;
	let a = n.tracks.filter((e) => e.kind !== "camera"), l = i({
		duration: n.duration,
		loop: n.loop,
		tracks: a.map((e, t) => ({
			target: String(t),
			property: cr(e),
			interpolation: e.interpolation,
			keyframes: e.keyframes,
			extrapolation: e.extrapolation,
			modifiers: e.modifiers
		}))
	}), u = r(l), d = {
		nodes: /* @__PURE__ */ new Map(),
		materials: /* @__PURE__ */ new Map(),
		morphs: /* @__PURE__ */ new Map(),
		geometries: /* @__PURE__ */ new Map(),
		lights: /* @__PURE__ */ new Map(),
		sun: null,
		environment: null,
		effects: null,
		camera: null
	}, f = {
		node: d.nodes,
		material: d.materials,
		morph: d.morphs,
		geometry: d.geometries,
		light: d.lights
	}, p = a.map((e, t) => {
		let n;
		if ($n.has(e.kind) && e.kind !== "light") d[e.kind] ??= {}, n = d[e.kind];
		else {
			let t = f[e.kind];
			t.has(e.id) || t.set(e.id, {}), n = t.get(e.id);
		}
		let r = Q[e.kind][e.property];
		return n[e.property] = r === 1 ? 0 : new Float64Array(r), {
			track: e,
			patch: n,
			staged: u.tracks[t].output
		};
	}), m = /* @__PURE__ */ new Map();
	for (let { track: e, staged: t } of p) e.kind === "node" && (m.has(e.id) || m.set(e.id, {}), m.get(e.id)[e.property] = t);
	let h = n.ik?.length ? Nr(n, t, m) : null, g = dn({
		hierarchy: Tr(t),
		rootMatrix: t.ikRootMatrix,
		constraints: n.constraints,
		drivers: n.drivers,
		materials: t.materials ?? [],
		properties: n.properties
	}), _ = !!((h || g) && t.ikHierarchy);
	if (h && !_) {
		for (let e of h.staged.keys()) {
			d.nodes.has(e) || d.nodes.set(e, {});
			let t = d.nodes.get(e);
			t.rotation ||= /* @__PURE__ */ new Float64Array(4);
		}
		for (let e of h.stagedTranslations.keys()) {
			d.nodes.has(e) || d.nodes.set(e, {});
			let t = d.nodes.get(e);
			t.translation ||= /* @__PURE__ */ new Float64Array(3);
		}
	}
	if (g && !_) for (let e of Lr(n)) {
		d.nodes.has(e) || d.nodes.set(e, {});
		let t = d.nodes.get(e);
		t.translation ??= /* @__PURE__ */ new Float64Array(3), t.rotation ??= /* @__PURE__ */ new Float64Array(4), t.scale ??= /* @__PURE__ */ new Float64Array(3);
	}
	let v = (n.drivers ?? []).filter((e) => e.target.kind === "material");
	for (let { target: e } of v) d.materials.has(e.id) || d.materials.set(e.id, {}), d.materials.get(e.id)[e.property] = e.component === void 0 ? 0 : /* @__PURE__ */ new Float64Array(3);
	for (let { target: e } of (n.drivers ?? []).filter((e) => e.target.kind === "light" || e.target.kind === "morph")) {
		let n = e.kind === "light" ? d.lights : d.morphs;
		n.has(e.id) || n.set(e.id, {});
		let r = n.get(e.id);
		e.component === void 0 ? r[e.property] = 0 : r.color ??= new Float64Array(Ir(t, e.id));
	}
	let y = n.drive ? t.buildDrive(n.drive) : null;
	if (y) {
		for (let { id: e } of y.sample(0).nodeOverrides) d.nodes.set(e, {
			translation: /* @__PURE__ */ new Float64Array(3),
			rotation: /* @__PURE__ */ new Float64Array(4),
			scale: /* @__PURE__ */ new Float64Array(3)
		});
		for (let { material: e } of n.drive.lights?.tailLights ?? []) d.materials.set(e, { emission: 0 });
	}
	let b = new Map((t.materials ?? []).map((e) => [e.id, structuredClone(e)])), x = n.tracks.filter((e) => e.kind === "camera"), S = {
		...structuredClone(or),
		...structuredClone(t.camera ?? {}),
		duration: n.duration,
		loop: n.loop
	};
	for (let e of x) S[e.property] = {
		interpolation: e.interpolation,
		keyframes: e.keyframes,
		extrapolation: e.extrapolation,
		modifiers: e.modifiers
	};
	let C = (n.drivers ?? []).filter((e) => e.target.kind === "camera"), w = x.length || C.length ? s(S) : null, T = w ? {
		eye: /* @__PURE__ */ new Float32Array(3),
		target: /* @__PURE__ */ new Float32Array(3),
		up: /* @__PURE__ */ new Float32Array(3)
	} : null;
	if (w) {
		if (S.focalLength !== void 0 && (x.some((e) => e.property === "fov") || C.some((e) => e.target.property === "fov"))) throw o("motion.tracks.property", "camera.fov", "a camera track or driver other than fov, since the camera has a focalLength; give the camera a fov instead, or leave fov out of the motion");
		d.camera = {
			eye: /* @__PURE__ */ new Float32Array(3),
			target: /* @__PURE__ */ new Float32Array(3),
			up: /* @__PURE__ */ new Float32Array(3),
			fov: 45,
			near: S.near,
			far: S.far,
			...Object.fromEntries(c.filter((e) => S[e] !== void 0).map((e) => [e, S[e]]))
		};
	}
	let E = new Map([...d.materials.keys()].map((e) => [e, { ...b.get(e) }])), ee = () => new Map([...m].map(([e, t]) => [e, { ...t }]));
	function D() {
		let e = ee();
		for (let [t, n] of h?.staged ?? []) e.set(t, {
			...e.get(t),
			rotation: n
		});
		for (let [t, n] of h?.stagedTranslations ?? []) e.set(t, {
			...e.get(t),
			translation: n
		});
		return e;
	}
	return Object.freeze({
		ikUsesStagedPose: _,
		driveSampler: y,
		solveStagedPose(e, t) {
			let n = /* @__PURE__ */ new Map(), r = new Map(t.map(({ id: e, translation: t, rotation: n, scale: r }) => [e, {
				translation: t,
				rotation: n,
				scale: r
			}]));
			if (h) {
				h.solve(e, t);
				for (let [e, t] of h.staged) n.set(e, { rotation: Array.from(t) }), r.set(e, {
					...r.get(e),
					rotation: t
				});
				for (let [e, t] of h.stagedTranslations) n.set(e, {
					...n.get(e),
					translation: Array.from(t)
				}), r.set(e, {
					...r.get(e),
					translation: t
				});
			}
			if (g) for (let [t, i] of g.evaluate(e, r).nodes) n.set(t, {
				translation: Array.from(i.translation),
				rotation: Array.from(i.rotation),
				scale: Array.from(i.scale)
			});
			return [...n].map(([e, t]) => ({
				id: e,
				...t
			}));
		},
		sweepIk(e) {
			if (!h) return [];
			let t = n.ik.map((e) => ({
				type: e.type,
				reached: !0,
				worstError: 0,
				atTime: 0,
				warnings: [],
				limited: []
			}));
			for (let r = 0; r < ar; r++) {
				let i = n.duration * r / 32;
				u.sample(i), h.solve(i, e?.(i)).forEach((e, n) => {
					let r = t[n], a = Number(i.toFixed(3));
					r.reached = r.reached && e.reached, e.error > r.worstError && (r.worstError = Number(e.error.toFixed(6)), r.atTime = a);
					for (let t of e.warnings ?? []) r.warnings.some((e) => e.code === t.code) || r.warnings.push({
						...t,
						atTime: a
					});
					for (let t of e.limited ?? []) r.limited.some((e) => e.joint === t.joint && e.axis === t.axis) || r.limited.push({
						...t,
						atTime: a
					});
				});
			}
			return t;
		},
		sample(e) {
			I(e, 0, 3600, "Motion sample time"), u.sample(e);
			for (let { track: e, staged: t } of p) {
				let n = t.length === 1 ? t[0] : t;
				sr(e.kind, e.property, n), e.kind === "material" && (E.get(e.id)[e.property] = n);
			}
			let t = y?.sample(e);
			_ || h?.solve(e);
			let n = g?.evaluate(e, _ ? ee() : D()), r = [];
			for (let { target: e } of v) {
				let t = n.materials.get(e.id)[e.property];
				sr("material", e.property, t), E.get(e.id)[e.property] = t, r.push({
					target: e,
					value: t
				});
			}
			for (let { target: e, value: t } of n?.looks ?? []) sr(e.kind, e.property, t, `driver ${e.kind} ${e.id} ${e.property}`);
			for (let [e, t] of E) Pr(t, e);
			if (w) {
				w.sample(e, T, { overrides: Ar(n?.looks) });
				for (let e of [
					"fov",
					"near",
					"far"
				]) ce(T[e], `Camera ${e}`);
				if (Math.fround(T.fov) <= 0 || Math.fround(T.fov) >= 180 || Math.fround(T.near) <= 0 || Math.fround(T.far) <= Math.fround(T.near)) throw o("motion.tracks.camera", {
					fov: T.fov,
					near: T.near,
					far: T.far
				}, "a lens with fov above 0 and below 180, near above 0 and far above near, such as fov 50, near 0.1, far 100; check the fov, near and far tracks");
			}
			for (let { track: e, patch: t, staged: n } of p) n.length === 1 ? t[e.property] = n[0] : t[e.property].set(n);
			if (h && !_) {
				for (let [e, t] of h.staged) d.nodes.get(e).rotation.set(t);
				for (let [e, t] of h.stagedTranslations) d.nodes.get(e).translation.set(t);
			}
			if (n && !_) for (let [e, t] of n.nodes) {
				let n = d.nodes.get(e);
				n.translation.set(t.translation), n.rotation.set(t.rotation), n.scale.set(t.scale);
			}
			for (let e of t?.nodeOverrides ?? []) {
				let t = d.nodes.get(e.id);
				t.translation.set(e.translation), t.rotation.set(e.rotation), t.scale.set(e.scale);
			}
			for (let { material: e, emission: n } of t?.emissions ?? []) d.materials.get(e).emission = n;
			for (let { target: e, value: t } of r) {
				let n = d.materials.get(e.id);
				typeof t == "number" ? n[e.property] = t : n[e.property].set(t);
			}
			for (let { target: e, value: t } of n?.looks ?? []) {
				if (e.kind === "camera") continue;
				let n = (e.kind === "light" ? d.lights : d.morphs).get(e.id);
				e.component === void 0 ? n[e.property] = t : n[e.property][Fr[e.component]] = t;
			}
			if (w) {
				for (let e of [
					"eye",
					"target",
					"up"
				]) d.camera[e].set(T[e]);
				for (let e of [
					"fov",
					"near",
					"far"
				]) d.camera[e] = T[e];
			}
			return d;
		}
	});
}
export { Yn as a, xn as c, kr as i, gn as l, Hr as n, Mn as o, Rr as r, Nn as s, Xn as t, hn as u };
