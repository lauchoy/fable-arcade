/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { S as e, b as t, d as n, f as r, h as i, l as a, o, p as s, s as c, u as l, v as u, y as d } from "./mat4-BCZClxna.js";
import { a as f, g as p, h as m, o as h, p as g, s as _, t as v, x as y, y as b } from "./vec3-BRYC6f_g.js";
import { t as x } from "./field-error-BpFTmyMO.js";
// src/vehicle.js
var S = Object.freeze({
	"+x": [
		1,
		0,
		0
	],
	"-x": [
		-1,
		0,
		0
	],
	"+z": [
		0,
		0,
		1
	],
	"-z": [
		0,
		0,
		-1
	]
}), C = Object.freeze([
	0,
	1,
	0
]), w = 35 * Math.PI / 180, T = .35, E = 1 / 240, D = 2, O = .1, k = 2e4, A = .5, j = /* @__PURE__ */ new Map([
	["wheel", "wheel"],
	["wheels", "wheel"],
	["tire", "tire"],
	["tires", "tire"],
	["tyre", "tire"],
	["tyres", "tire"],
	["rim", "rim"],
	["rims", "rim"],
	["hub", "rim"],
	["hubcap", "rim"],
	["hubcaps", "rim"]
]), ee = /* @__PURE__ */ new Set([
	"steering",
	"spare",
	"fender",
	"fenders",
	"mudguard",
	"arch",
	"arches",
	"well",
	"wells",
	"guard",
	"brake",
	"brakes",
	"caliper",
	"rotor",
	"disc",
	"housing",
	"cover",
	"shield"
]), te = /* @__PURE__ */ new Map([
	["fl", ["front", "left"]],
	["fr", ["front", "right"]],
	["rl", ["rear", "left"]],
	["rr", ["rear", "right"]],
	["bl", ["rear", "left"]],
	["br", ["rear", "right"]],
	["lf", ["front", "left"]],
	["rf", ["front", "right"]],
	["lr", ["rear", "left"]],
	["lb", ["rear", "left"]],
	["rb", ["rear", "right"]]
]), ne = /* @__PURE__ */ new Map([
	["front", "front"],
	["rear", "rear"],
	["back", "rear"]
]), re = /* @__PURE__ */ new Map([
	["left", "left"],
	["l", "left"],
	["right", "right"],
	["r", "right"]
]);
function M() {
	return r(/* @__PURE__ */ new Float64Array(16));
}
function N(e, t, n = "1") {
	if (!Number.isFinite(e) || e <= 0) throw x(t, e, `a finite number above 0, such as ${n}`);
}
function P(e, t, n) {
	return Math.min(n, Math.max(t, e));
}
function ie(e) {
	return e.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}
function ae(e) {
	let t = null, n = null;
	for (let r of e) {
		let e = te.get(r);
		e && (t ??= e[0], n ??= e[1]), t ??= ne.get(r) ?? null, n ??= re.get(r) ?? null;
	}
	return {
		axle: t,
		side: n
	};
}
function F(e) {
	if (!Array.isArray(e) || e.some((e) => typeof e != "string")) throw TypeError("findWheelCandidates needs an array of name strings.");
	let t = [], n = [];
	return e.forEach((e, r) => {
		let i = ie(e), a = i.find((e) => j.has(e));
		if (!a) return;
		let o = i.find((e) => ee.has(e));
		if (o) {
			n.push({
				index: r,
				name: e,
				reason: `contains "${o}", which does not roll with the wheel`
			});
			return;
		}
		let { axle: s, side: c } = ae(i), l = s && c ? `${s}-${c}` : null;
		t.push({
			index: r,
			name: e,
			kind: j.get(a),
			axle: s,
			side: c,
			corner: l
		});
	}), {
		wheels: t,
		rejected: n
	};
}
function oe(e) {
	if (!Array.isArray(e) || e.length === 0) throw TypeError("parts must be a non-empty array of parts with a 16-value matrix.");
	return I("parts", e.map((e, t) => {
		if (!e || !e.matrix || e.matrix.length !== 16) throw TypeError(`Part ${t} needs a 16-value matrix.`);
		let n = Float64Array.from(e.matrix);
		return {
			key: e,
			label: String(e.name ?? `part-${t}`),
			parentKey: null,
			restWorld: n,
			meshes: e.geometry ? [{
				geometry: e.geometry,
				matrix: n
			}] : []
		};
	}));
}
function se(e) {
	if (!e || !e.nodes || e.nodes.length === 0) throw TypeError("graph must be a scene graph with nodes.");
	return I("graph", Array.from(e.nodes, (e) => {
		let t = Float64Array.from(e.worldMatrix);
		return {
			key: e.name,
			label: e.name,
			parentKey: e.parent,
			restWorld: t,
			pivot: e.pivot,
			meshes: e.geometry ? [{
				geometry: e.geometry,
				matrix: t
			}] : []
		};
	}));
}
function ce(e) {
	let t = M();
	return o(t, e.rotation, e.translation, e.scale), t;
}
function le(e) {
	if (!e || !e.nodes || !e.parts || typeof e.stagePose != "function") throw TypeError("asset must be a loadGltf result with nodes, parts and stagePose.");
	let t = new Map(e.nodes.map((e) => [e.id, e])), n = /* @__PURE__ */ new Map();
	function r(e) {
		if (n.has(e)) return n.get(e);
		let a = t.get(e), o = ce(a), s = a.parent === null ? o : i(M(), r(a.parent), o);
		return n.set(e, s), s;
	}
	return I("asset", e.nodes.map((t) => ({
		key: t.id,
		label: t.label,
		parentKey: t.parent,
		restWorld: r(t.id),
		editable: t.editable,
		meshes: (t.meshIds ?? []).map((t) => {
			let n = e.parts[Number(t.slice(5))];
			return {
				geometry: n.geometry,
				matrix: Float64Array.from(n.matrix)
			};
		})
	})));
}
function I(e, t) {
	let n = new Map(t.map((e) => [e.key, e]));
	for (let e of t) e.childKeys = [];
	for (let e of t) e.parentKey !== null && n.has(e.parentKey) && n.get(e.parentKey).childKeys.push(e.key);
	return {
		kind: e,
		entries: t,
		byKey: n
	};
}
function ue({ parts: e, graph: t, asset: n }) {
	if ([
		e,
		t,
		n
	].filter((e) => e !== void 0).length !== 1) throw TypeError("createVehicleRig needs exactly one of parts, graph or asset.");
	return e === void 0 ? t === void 0 ? le(n) : se(t) : oe(e);
}
function L(e, t, n = "target") {
	if (e.byKey.has(t)) return e.byKey.get(t);
	if (Number.isInteger(t) && e.kind === "parts" && e.entries[t]) return e.entries[t];
	if (typeof t == "string") {
		let r = e.entries.filter((e) => e.label === t);
		if (r.length === 1) return r[0];
		if (r.length > 1) throw x(n, t, `a ${e.kind} name that is used once; this name matches ${r.length}, such as an id from scene_inspect`);
	}
	throw x(n, t?.name ?? t, `the name of a ${e.kind === "parts" ? "part" : "node"} in the asset, such as one scene_inspect lists`);
}
function R(e, t, n = []) {
	n.push(...t.meshes);
	for (let r of t.childKeys) R(e, e.byKey.get(r), n);
	return n;
}
function z(e) {
	let t = [
		Infinity,
		Infinity,
		Infinity
	], n = [
		-Infinity,
		-Infinity,
		-Infinity
	], r = f();
	for (let { geometry: i, matrix: a } of e) {
		let e = i.positions;
		for (let i = 0; i + 2 < e.length; i += 3) {
			p(r, e[i], e[i + 1], e[i + 2]), y(r, r, a);
			for (let e = 0; e < 3; e++) t[e] = Math.min(t[e], r[e]), n[e] = Math.max(n[e], r[e]);
		}
	}
	return Number.isFinite(t[0]) ? {
		minimum: t,
		maximum: n
	} : null;
}
function B(e, t) {
	let n = 0;
	for (let r = 0; r < 3; r++) n += Math.abs(t[r]) * (e.maximum[r] - e.minimum[r]);
	return n;
}
function V(e, t) {
	return {
		center: e.minimum.map((t, n) => (t + e.maximum[n]) / 2),
		radius: Math.max(B(e, C), B(e, t)) / 2
	};
}
function H(e, t, n) {
	let r = t.parentKey;
	for (; r !== null && e.byKey.has(r);) {
		if (n.has(r)) return !0;
		r = e.byKey.get(r).parentKey;
	}
	return !1;
}
function de(e, t) {
	let { wheels: n, rejected: r } = F(e.entries.map((e) => e.label)), i = new Set(n.map((t) => e.entries[t.index].key)), a = n.filter((t) => !H(e, e.entries[t.index], i)), o = /* @__PURE__ */ new Map(), s = [];
	for (let t of a) if (t.corner) {
		let n = o.get(t.corner) ?? {
			id: t.corner,
			axle: t.axle,
			side: t.side,
			entries: []
		};
		n.entries.push(e.entries[t.index]), o.set(t.corner, n);
	} else s.push(e.entries[t.index]);
	let c = (n) => {
		let r = z(R(e, n));
		return r ? {
			entry: n,
			...V(r, t)
		} : {
			entry: n,
			center: null,
			radius: 0
		};
	}, l = Array.from(o.values()).map((e) => {
		let t = e.entries.map(c).sort((e, t) => t.radius - e.radius)[0];
		return {
			...e,
			center: t.center,
			radius: t.radius
		};
	});
	for (let e of s.map(c).sort((e, t) => t.radius - e.radius)) {
		let t = e.center && l.find((t) => t.center && _(t.center, e.center) < t.radius * .6);
		t ? t.entries.push(e.entry) : l.push({
			id: `wheel-${l.length}`,
			axle: null,
			side: null,
			entries: [e.entry],
			center: e.center,
			radius: e.radius
		});
	}
	return {
		groups: l,
		rejected: r
	};
}
function fe(e, t, n) {
	let r = `wheels[${n}]`, i = t.targets ?? t.parts ?? t.nodes ?? [t.target ?? t.part ?? t.node];
	if (!Array.isArray(i) || i.length === 0 || i.includes(void 0)) throw x(`${r}.node`, t.node, "a node, part or targets list, such as \"wheel-0\"", TypeError);
	let a = i.map((t) => L(e, t, `${r}.node`));
	return {
		id: t.id ?? a[0].label,
		index: n,
		entries: a,
		axle: t.axle,
		side: t.side,
		spec: t
	};
}
function pe(e, t, n) {
	if (t === void 0 || t === "auto") {
		let { groups: t, rejected: r } = de(e, n);
		return {
			described: t.map((e, t) => ({
				id: e.id,
				index: t,
				entries: e.entries,
				axle: e.axle,
				side: e.side,
				spec: {}
			})),
			rejected: r
		};
	}
	if (!Array.isArray(t)) throw x("wheels", t, "\"auto\", or an array of wheel descriptions, such as \"auto\"", TypeError);
	return {
		described: t.map((t, n) => fe(e, t, n)),
		rejected: []
	};
}
function me(e, t, n) {
	let r = z(t.entries.flatMap((t) => R(e, t))), i = r ? V(r, n) : null, a = t.spec.center ?? i?.center, o = t.spec.radius ?? i?.radius;
	if (!a || o === void 0) throw x(`wheels[${t.index}].radius`, o, "a radius with a center, or geometry to measure them from, such as 0.35");
	if (a.length !== 3 || !Array.from(a).every(Number.isFinite)) throw x(`wheels[${t.index}].center`, a, "an array of 3 finite numbers, such as [0.8, 0.35, 1.2]");
	return N(o, `wheels[${t.index}].radius`, "0.35"), {
		...t,
		center: Array.from(a),
		radius: o
	};
}
function he(e, t, n) {
	let r = M();
	return r.set([
		...e,
		0,
		...C,
		0,
		...t,
		0,
		...n,
		1
	]), r;
}
function U(e) {
	return e.reduce((e, t) => e + t, 0) / e.length;
}
function ge(e, t) {
	let n = h(f(), C, t), r = [
		0,
		1,
		2
	].map((t) => U(e.map((e) => e.center[t]))), i = he(n, t, m(f(), r, C, -U(e.map((e) => e.radius)))), a = s(M(), i);
	return {
		wheels: e.map((e, t) => {
			let n = y(f(), e.center, a), r = e.side ?? (Math.abs(n[0]) < 1e-4 ? "center" : n[0] > 0 ? "left" : "right"), i = e.axle ?? (n[2] >= 0 ? "front" : "rear");
			if (![
				"left",
				"right",
				"center"
			].includes(r)) throw x(`wheels[${e.index}].side`, r, "one of left, right, center");
			if (!["front", "rear"].includes(i)) throw x(`wheels[${e.index}].axle`, i, "one of front, rear");
			let o = e.spec.spinSign ?? 1;
			if (o !== 1 && o !== -1) throw x(`wheels[${e.index}].spinSign`, o, "one of 1, -1");
			return {
				id: e.id || `wheel-${t}`,
				entries: e.entries,
				side: r,
				axle: i,
				radius: e.radius,
				steerable: e.spec.steerable ?? i === "front",
				spinSign: o,
				centerLocal: Array.from(n)
			};
		}),
		restFrame: i,
		inverseRestFrame: a
	};
}
function _e(e, t) {
	if (t !== void 0) return N(t, "wheelbase", "2.7"), t;
	let n = e.filter((e) => e.axle === "front"), r = e.filter((e) => e.axle === "rear");
	if (n.length && r.length) {
		let e = U(n.map((e) => e.centerLocal[2])) - U(r.map((e) => e.centerLocal[2]));
		if (e > 1e-6) return e;
	}
	if (e.some((e) => e.steerable)) throw x("wheelbase", void 0, "a wheelbase in metres, such as 2.7, or wheels marked with axle front and rear so it can be measured");
	return 0;
}
function ve(e, t, n) {
	if (t !== void 0) {
		if (!Array.isArray(t) || t.length === 0) throw x("body", t, "a non-empty array of parts or nodes, such as [\"body\"]", TypeError);
		return t.map((t, n) => L(e, t, `body[${n}]`));
	}
	let r = new Set(n.flatMap((e) => e.entries.map((e) => e.key))), i = e.entries.filter((t) => !r.has(t.key) && !H(e, t, r) && (e.kind === "parts" || t.parentKey === null));
	if (i.length === 0) throw x("body", void 0, "a list of the body nodes, such as [\"body\"], since no body parts remain after removing the wheels");
	return i;
}
function ye(e) {
	for (let t of e) if (t.pivot && t.pivot.some((e) => e !== 0)) throw x("body", t.label, "nodes with a zero pivot, since vehicle poses do not support a nonzero one; pick another node");
}
function W(e, t, n) {
	let r = y(f(), v(f(), t, n), e), i = y(f(), t, e);
	return g(r, b(r, r, i));
}
function G(e, t) {
	if (!e || e.length !== 3 || !Array.from(e).every(Number.isFinite)) throw x(t, e, "an array of 3 finite numbers, such as [0.5, 0.6, 2]", TypeError);
}
function be(e, t = {}, n, r) {
	let i = (t.headlights ?? []).map((e, t) => {
		G(e.position, `lights.headlights[${t}].position`);
		let i = e.direction ?? r;
		G(i, `lights.headlights[${t}].direction`);
		let a = y(f(), e.position, n);
		return {
			id: e.id ?? `headlight-${t}`,
			positionLocal: Array.from(a),
			directionLocal: Array.from(W(n, e.position, i))
		};
	}), a = (t.tailLights ?? []).map((t, n) => {
		if (t.signal !== "brake" && t.signal !== "reverse") throw x(`lights.tailLights[${n}].signal`, t.signal, "one of brake, reverse");
		let r = t.targets ?? t.parts ?? t.nodes ?? [t.target ?? t.part ?? t.node];
		if (!Array.isArray(r) || r.length === 0 || r.includes(void 0)) throw x(`lights.tailLights[${n}].node`, t.node, "a node, part or targets list, such as \"tail\"", TypeError);
		let { off: i = 0, on: a = 4 } = t;
		if (!Number.isFinite(i) || !Number.isFinite(a) || i < 0 || a < 0) throw x(`lights.tailLights[${n}].${Number.isFinite(i) && i >= 0 ? "on" : "off"}`, Number.isFinite(i) && i >= 0 ? a : i, "a number of 0 or more, such as 4");
		let o = r.map((t) => L(e, t, `lights.tailLights[${n}].node`));
		return {
			id: t.id ?? o[0].label,
			signal: t.signal,
			entries: o,
			off: i,
			on: a
		};
	});
	return {
		headlights: Object.freeze(i),
		tailLights: Object.freeze(a)
	};
}
function xe({ parts: e, graph: t, asset: n, body: r, wheels: i = "auto", forwardAxis: a = "+z", wheelbase: o, maxSteerAngle: s = w, lights: c } = {}) {
	let l = S[a];
	if (!l) throw x("forwardAxis", a, "one of +x, -x, +z, -z");
	N(s, "maxSteerAngle", "0.6");
	let u = ue({
		parts: e,
		graph: t,
		asset: n
	}), { described: d, rejected: f } = pe(u, i, l);
	if (d.length < 2) throw x("wheels", d.length, "at least 2 wheels, such as \"auto\" on a car with 4 wheel nodes, or a list of wheel nodes");
	let p = ge(d.map((e) => me(u, e, l)), l), m = ve(u, r, p.wheels);
	ye([...m, ...p.wheels.flatMap((e) => e.entries)]);
	let h = _e(p.wheels, o), g = p.wheels.some((e) => e.axle === "front") ? p.wheels.filter((e) => e.axle === "front") : p.wheels, _ = g.map((e) => e.centerLocal[0]);
	return Object.freeze({
		kind: u.kind,
		source: u,
		forwardAxis: a,
		wheelbase: h,
		trackWidth: Math.max(..._) - Math.min(..._),
		rearAxleZ: U(g.map((e) => e.centerLocal[2])) - h,
		...be(u, c, p.inverseRestFrame, l),
		maxSteerAngle: s,
		restFrame: p.restFrame,
		inverseRestFrame: p.inverseRestFrame,
		bodyEntries: m,
		wheels: Object.freeze(p.wheels),
		rejectedNames: f
	});
}
function Se(e, t, n) {
	if (!Array.isArray(e) && !ArrayBuffer.isView(e) || e.length !== 3 || !Array.from(e).every(Number.isFinite)) throw x(`${n}[${t}]`, e, "an array of 3 finite numbers, such as [0, 0, 10]", TypeError);
}
function Ce(e, t, n) {
	if (Array.isArray(e)) return e.map((e) => Array.from(e));
	if (e && typeof e.sample == "function" && Number.isFinite(e.duration) && e.duration > 0) {
		let n = [];
		for (let r = 0; r <= t; r++) n.push(Array.from(e.sample(e.duration * r / t).eye));
		return n;
	}
	throw x(n, e, "an array of [x, y, z] points, such as [[0, 0, 0], [0, 0, 10]], or a camera path with duration and sample(time)", TypeError);
}
function we(e) {
	return e.filter((t, n) => n === 0 || _(t, e[n - 1]) > 1e-6);
}
function Te(e, t, n) {
	let r = (e, t, r, i) => {
		let a = i - r;
		return e.map((e, o) => (i - n) / a * e + (n - r) / a * t[o]);
	}, [i, a, o, s] = e, [c, l, u, d] = t, f = r(i, a, c, l), p = r(a, o, l, u), m = r(o, s, u, d);
	return r(r(f, p, c, u), r(p, m, l, d), l, u);
}
function Ee(e) {
	if (e.length === 2) return e;
	let t = (e, t) => e.map((e, n) => 2 * e - t[n]), n = [
		t(e[0], e[1]),
		...e,
		t(e.at(-1), e.at(-2))
	], r = [e[0]];
	for (let e = 1; e < n.length - 2; e++) {
		let t = n.slice(e - 1, e + 3), i = [0];
		for (let e = 1; e < 4; e++) i.push(i[e - 1] + Math.sqrt(_(t[e - 1], t[e])));
		let a = P(Math.ceil(_(t[1], t[2]) / .05), 8, 2e3);
		for (let e = 1; e <= a; e++) r.push(Te(t, i, i[1] + (i[2] - i[1]) * e / a));
	}
	return r;
}
function De(e, t) {
	let n = [0];
	for (let t = 1; t < e.length; t++) n.push(n[t - 1] + _(e[t - 1], e[t]));
	let r = n.at(-1);
	if (!(r > 1e-6)) throw x(t, "a path of zero length", "points that are not all the same, such as [[0, 0, 0], [0, 0, 10]]");
	let i = Math.max(2, Math.ceil(r / Math.max(O, r / k))), a = r / i, o = [], s = 0;
	for (let t = 0; t <= i; t++) {
		let r = t * a;
		for (; s < e.length - 2 && n[s + 1] < r;) s++;
		let i = n[s + 1] - n[s], c = i > 0 ? P((r - n[s]) / i, 0, 1) : 0;
		o.push(e[s].map((t, n) => t + (e[s + 1][n] - t) * c));
	}
	return {
		positions: o,
		spacing: a,
		length: r
	};
}
function Oe(e, t) {
	return e.map((n, r) => {
		let i = Math.max(0, r - t), a = Math.min(e.length - 1, r + t), o = 0;
		for (let t = i; t <= a; t++) o += e[t];
		return o / (a - i + 1);
	});
}
function ke(e, t, n) {
	let r = Ce(e, t, n);
	r.forEach((e, t) => Se(e, t, n));
	let i = we(r);
	if (i.length < 2) throw x(n, `${i.length} distinct point`, "at least 2 distinct points, such as [[0, 0, 0], [0, 0, 10]]");
	let { positions: a, spacing: o, length: s } = De(Ee(i), n), c = [], l = [];
	return a.forEach((e, t) => {
		let n = a[Math.max(0, t - 1)], r = a[Math.min(a.length - 1, t + 1)], i = Math.hypot(r[0] - n[0], r[2] - n[2]), o = i > 1e-9 ? Math.atan2(r[0] - n[0], r[2] - n[2]) : c.at(-1) ?? 0;
		t > 0 && (o += Math.round((c[t - 1] - o) / (2 * Math.PI)) * 2 * Math.PI), c.push(o), l.push(i > 1e-9 ? Math.atan2(r[1] - n[1], i) : 0);
	}), {
		positions: a,
		headings: c,
		slopes: l,
		curvature: Oe(c.map((e, t) => {
			let n = Math.max(0, t - 1), r = Math.min(c.length - 1, t + 1);
			return (c[r] - c[n]) / ((r - n) * o);
		}), 5),
		spacing: o,
		length: s
	};
}
function Ae(e, t) {
	let { cruiseSpeed: n, acceleration: r, braking: i, startSpeed: a, endSpeed: o, maxLateralAcceleration: s } = t, c = e.positions.length, l = e.curvature.map((e) => {
		let t = s / Math.max(Math.abs(e), 1e-9);
		return Math.min(n ** 2, Math.max(t, A ** 2));
	}), u = Float64Array.from(l);
	u[0] = Math.min(a ** 2, l[0]);
	for (let t = 1; t < c; t++) u[t] = Math.min(u[t], u[t - 1] + 2 * r * e.spacing);
	u[c - 1] = Math.min(u[c - 1], o ** 2);
	for (let t = c - 2; t >= 0; t--) u[t] = Math.min(u[t], u[t + 1] + 2 * i * e.spacing);
	let d = u.map(Math.sqrt), f = new Float64Array(c);
	for (let t = 1; t < c; t++) {
		let n = (d[t - 1] + d[t]) / 2;
		if (n < 1e-9) throw x("acceleration", "a speed profile that never leaves rest", "a higher acceleration or startSpeed, such as acceleration 3");
		f[t] = f[t - 1] + e.spacing / n;
	}
	return {
		speeds: d,
		times: f,
		duration: f[c - 1]
	};
}
function je(e, t) {
	let n = 0, r = e.length - 1;
	for (; r - n > 1;) {
		let i = n + r >> 1;
		e[i] <= t ? n = i : r = i;
	}
	return n;
}
function Me(e, t) {
	let n = t.startTime;
	if (t.speed !== void 0) {
		let r = e.length / t.speed;
		return {
			duration: n + r,
			distanceAt: (r) => P((r - n) * t.speed, 0, e.length),
			speedAt: (e) => e > n && e < n + r ? t.speed : 0,
			accelerationAt: () => 0
		};
	}
	let r = Ae(e, t), i = e.spacing;
	function a(e) {
		let t = je(r.times, e), n = r.speeds[t] ** 2, a = r.speeds[t + 1] ** 2;
		return {
			index: t,
			elapsed: e - r.times[t],
			acceleration: (a - n) / (2 * i)
		};
	}
	return {
		duration: n + r.duration,
		distanceAt(t) {
			let o = t - n;
			if (o <= 0) return 0;
			if (o >= r.duration) return e.length;
			let { index: s, elapsed: c, acceleration: l } = a(o);
			return s * i + r.speeds[s] * c + .5 * l * c ** 2;
		},
		speedAt(e) {
			let t = e - n;
			if (t <= 0 || t >= r.duration) return 0;
			let { index: i, elapsed: o, acceleration: s } = a(t);
			return Math.max(0, r.speeds[i] + s * o);
		},
		accelerationAt(e) {
			let t = e - n;
			return t <= 0 || t >= r.duration ? 0 : a(t).acceleration;
		}
	};
}
function K(e, t, n) {
	let r = P(n / t, 0, e.length - 1), i = Math.min(Math.floor(r), e.length - 2), a = r - i, o = e[i], s = e[i + 1];
	return Array.isArray(o) ? o.map((e, t) => e + (s[t] - e) * a) : o + (s - o) * a;
}
function Ne(e, t) {
	let n = Math.ceil((e.duration + D) / E) + 1, r = new Float64Array(n), i = new Float64Array(n), a = 2 * Math.PI * t.bounceFrequency, o = 2 * t.dampingRatio * a, s = 0, c = 0, l = 0, u = 0;
	for (let d = 0; d < n; d++) {
		let n = d * E, f = e.signedSpeedAt(n), p = (e.signedSpeedAt(n + E) - e.signedSpeedAt(n - E)) / (2 * E), m = e.curvatureAt(n), h = P(t.pitchGain * p, -.35, T), g = P(t.rollGain * f * f * m, -.35, T);
		l += (a ** 2 * (h - s) - o * l) * E, u += (a ** 2 * (g - c) - o * u) * E, s += l * E, c += u * E, r[d] = s, i[d] = c;
	}
	return {
		pitches: r,
		rolls: i
	};
}
function Pe(e, t, n, r) {
	let i = Math.cos(n), a = Math.sin(n), o = e.wheels.map((e) => {
		let [n, , o] = e.centerLocal;
		return {
			left: n,
			forward: o,
			height: q(r, t[0] + n * i + o * a, t[2] - n * a + o * i)
		};
	}), s = U(o.map((e) => e.left)), c = U(o.map((e) => e.forward)), l = U(o.map((e) => e.height)), u = 0, d = 0, f = 0, p = 0, m = 0;
	for (let e of o) {
		let t = e.left - s, n = e.forward - c, r = e.height - l;
		u += t * t, d += n * n, f += t * n, p += t * r, m += n * r;
	}
	let h = u * d - f ** 2, g = h > 1e-9 * Math.max(1, u * d), _ = g ? (p * d - m * f) / h : 0, v = g ? (m * u - p * f) / h : 0;
	return {
		height: l - _ * s - v * c,
		pitch: Math.atan(v),
		roll: Math.atan(_)
	};
}
function q(e, t, n) {
	let r = e(t, n);
	if (!Number.isFinite(r)) throw TypeError("groundHeight must return a finite number.");
	return r;
}
function J(e, n, r, i) {
	let a = c(M(), e);
	return d(a, a, n), u(a, a, -r), t(a, a, i), a;
}
function Fe(e, t, n, r) {
	let i = f(), a = Math.max(.5, t[5]);
	return e.wheels.map((e) => n ? (y(i, e.centerLocal, t), P((q(n, i[0], i[2]) + e.radius - i[1]) / a, -r, r)) : 0);
}
function Ie(e, t, n = {}) {
	return Y(e, [{ path: t }], n, () => "path");
}
function Le(e, t, n) {
	let r = [];
	return e.forEach((i, a) => {
		let { path: o, direction: s = "forward", pause: c = 0 } = i ?? {};
		if (s !== "forward" && s !== "reverse") throw x(`legs[${a}].direction`, s, "one of forward, reverse");
		if (!Number.isFinite(c) || c < 0) throw x(`legs[${a}].pause`, c, "seconds of 0 or more, such as 2");
		let l = r.at(-1), u = s === "reverse" ? -1 : 1, d = l ? l.endTime + c : t.startTime, f = ke(o, t.pathSamples, n(a)), p = Me(f, {
			...t,
			startTime: d,
			startSpeed: l ? 0 : t.startSpeed,
			endSpeed: a === e.length - 1 ? t.endSpeed : 0
		}), m = s === "reverse" ? Math.PI : 0;
		if (l) {
			let e = l.headingShift + l.table.headings.at(-1);
			m += Math.round((e - f.headings[0] - m) / (2 * Math.PI)) * 2 * Math.PI;
		}
		r.push({
			table: f,
			motion: p,
			sign: u,
			startTime: d,
			endTime: p.duration,
			headingShift: m,
			startForwardDistance: l ? l.startForwardDistance + l.sign * l.table.length : 0,
			startHeadingChange: l ? l.startHeadingChange + l.table.headings.at(-1) - l.table.headings[0] : 0
		});
	}), r;
}
function Y(e, t, n = {}, r = (e) => `legs[${e}].path`) {
	if (!e || !e.wheels || !e.restFrame) throw TypeError("driveAlongPath needs a rig from createVehicleRig.");
	if (!Array.isArray(t) || t.length === 0) throw x("legs", t, "a non-empty array of { path, direction, pause }, such as [{ \"path\": [[0, 0, 0], [0, 0, 10]] }]", TypeError);
	let i = Re(e, n), a = Le(t, i, r), o = a.at(-1).endTime, s = a.reduce((e, t) => e + t.table.length, 0), c = (e) => a.findLast((t) => t.startTime <= e) ?? a[0], l = Ne({
		duration: o,
		signedSpeedAt(e) {
			let t = c(e);
			return t.sign * t.motion.speedAt(e);
		},
		curvatureAt(e) {
			let t = c(e);
			return t.sign * K(t.table.curvature, t.table.spacing, t.motion.distanceAt(e));
		}
	}, i), u = i.maxSteerAngle;
	function d(t) {
		if (!Number.isFinite(t)) throw RangeError("Sample time must be finite.");
		let n = c(t), { table: r, motion: a, sign: o } = n, s = a.distanceAt(t), d = n.startForwardDistance + o * s, f = K(r.headings, r.spacing, s), p = f + n.headingShift, m = o * K(r.curvature, r.spacing, s), h = n.startHeadingChange + f - r.headings[0], g = P(t, 0, (l.pitches.length - 1) * E) / E, _ = Math.min(Math.floor(g), l.pitches.length - 2), v = g - _, y = l.pitches[_] + (l.pitches[_ + 1] - l.pitches[_]) * v, b = l.rolls[_] + (l.rolls[_ + 1] - l.rolls[_]) * v, x = K(r.positions, r.spacing, s), S = o * K(r.slopes, r.spacing, s), C = 0;
		if (i.groundHeight) {
			let t = Pe(e, x, p, i.groundHeight);
			x[1] = t.height, S = t.pitch, C = t.roll;
		}
		let w = S + y, T = C + b, D = J(x, p, w, T), O = Fe(e, D, i.groundHeight, i.suspensionTravel), k = P(Math.atan(e.wheelbase * m), -u, u), A = i.steering === "ackermann" ? ze(e, k) : null, j = o * a.speedAt(t);
		return {
			time: t,
			distance: d,
			speed: j,
			direction: o,
			position: x,
			heading: p,
			pitch: w,
			roll: T,
			steerAngle: k,
			wheels: e.wheels.map((e, t) => ({
				id: e.id,
				spinAngle: e.spinSign * (d - e.centerLocal[0] * h) / e.radius,
				steerAngle: A ? A[t] : e.steerable ? k : 0,
				suspensionOffset: O[t]
			})),
			lights: Be(e, D, {
				braking: Math.max(0, -a.accelerationAt(t)) / i.fullBrakeDeceleration,
				reversing: o < 0 && j !== 0
			})
		};
	}
	return Object.freeze({
		rig: e,
		length: s,
		duration: o,
		sample: d
	});
}
function Re(e, t) {
	let { speed: n, cruiseSpeed: r, acceleration: i = 3, braking: a = 4, startSpeed: o = 0, endSpeed: s = 0, maxLateralAcceleration: c = Infinity, startTime: l = 0, groundHeight: u, maxSteerAngle: d = e.maxSteerAngle, rollGain: f = .012, pitchGain: p = .012, bounceFrequency: m = 1.6, dampingRatio: h = .45, suspensionTravel: g = .2, pathSamples: _ = 400, steering: v = "ackermann", fullBrakeDeceleration: y = a } = t;
	if (v !== "ackermann" && v !== "shared") throw x("steering", v, "one of ackermann, shared");
	if (N(y, "fullBrakeDeceleration", "4"), n === void 0 == (r === void 0)) throw x(n === void 0 ? "speed" : "cruiseSpeed", n ?? r, "exactly one of speed (constant) or cruiseSpeed (with acceleration and braking), such as speed 8", TypeError);
	if (n !== void 0 && N(n, "speed", "8"), r !== void 0 && (N(r, "cruiseSpeed", "8"), N(i, "acceleration", "3"), N(a, "braking", "4")), !Number.isFinite(l) || l < 0) throw x("startTime", l, "seconds of 0 or more, such as 0");
	if (u !== void 0 && typeof u != "function") throw TypeError("groundHeight must be a function (x, z) => height.");
	if (N(d, "maxSteerAngle", "0.6"), N(m, "bounceFrequency", "1.6"), N(h, "dampingRatio", "0.45"), !Number.isFinite(o) || o < 0 || !Number.isFinite(s) || s < 0) {
		let e = !Number.isFinite(o) || o < 0 ? "startSpeed" : "endSpeed";
		throw x(e, e === "startSpeed" ? o : s, "a speed of 0 or more, such as 0");
	}
	if (!(c > 0)) throw x("maxLateralAcceleration", c, "a number above 0, such as 6");
	if (!Number.isInteger(_) || _ < 8) throw x("pathSamples", _, "a whole number of 8 or more, such as 400");
	return {
		speed: n,
		cruiseSpeed: r,
		acceleration: i,
		braking: a,
		startSpeed: o,
		endSpeed: s,
		maxLateralAcceleration: c,
		startTime: l,
		groundHeight: u,
		maxSteerAngle: d,
		rollGain: f,
		pitchGain: p,
		bounceFrequency: m,
		dampingRatio: h,
		suspensionTravel: g,
		pathSamples: _,
		steering: v,
		fullBrakeDeceleration: y
	};
}
function ze(e, t) {
	let n = Math.tan(t);
	return e.wheels.map((t) => {
		if (!t.steerable) return 0;
		let r = t.centerLocal[2] - e.rearAxleZ;
		return Math.atan2(r * n, e.wheelbase - t.centerLocal[0] * n);
	});
}
function Be(e, t, { braking: n, reversing: r }) {
	return {
		brake: P(n, 0, 1),
		reverse: +!!r,
		headlights: e.headlights.map((e) => ({
			id: e.id,
			position: Array.from(y(f(), e.positionLocal, t)),
			direction: Array.from(W(t, e.positionLocal, e.directionLocal))
		}))
	};
}
function X(e, t) {
	if (!t || !t.lights) throw TypeError("pose must come from drive.sample for this rig.");
	return e.tailLights.map((e) => ({
		id: e.id,
		emission: e.off + (e.on - e.off) * t.lights[e.signal],
		entries: e.entries
	}));
}
function Ve(e, t) {
	Q(e, "parts");
	let n = [];
	for (let { id: r, emission: i, entries: a } of X(e, t)) for (let { key: e } of a) {
		if (!e.material) throw TypeError(`Tail light ${r} part needs a material to set emission on.`);
		e.material.emission = i, n.push(e);
	}
	return n;
}
function He(t, n) {
	let r = c(M(), [
		0,
		n.suspensionOffset,
		0
	]);
	return e(r, r, t.centerLocal), d(r, r, n.steerAngle), u(r, r, n.spinAngle), e(r, r, t.centerLocal.map((e) => -e)), r;
}
function Z(e, t) {
	if (!t || !Array.isArray(t.wheels) || t.wheels.length !== e.wheels.length) throw TypeError("pose must come from drive.sample for this rig.");
	let n = J(t.position, t.heading, t.pitch, t.roll), r = i(M(), n, e.inverseRestFrame), a = /* @__PURE__ */ new Map();
	for (let t of e.bodyEntries) a.set(t.key, i(M(), r, t.restWorld));
	return e.wheels.forEach((r, o) => {
		let s = i(M(), n, He(r, t.wheels[o]));
		i(s, s, e.inverseRestFrame);
		for (let e of r.entries) a.set(e.key, i(M(), s, e.restWorld));
	}), a;
}
function Q(e, t) {
	if (e.kind !== t) throw TypeError(`This rig was built from ${e.kind}, not ${t}.`);
}
function Ue(e, t) {
	Q(e, "parts");
	let n = Z(e, t), r = [];
	for (let [e, t] of n) e.matrix.set(t), r.push(e);
	return r;
}
function We(e, t) {
	let { byKey: n } = e.source, r = /* @__PURE__ */ new Map();
	function a(e) {
		if (t.has(e)) return t.get(e);
		if (r.has(e)) return r.get(e);
		let o = n.get(e), c = o.restWorld;
		if (o.parentKey !== null && n.has(o.parentKey)) {
			let e = n.get(o.parentKey).restWorld, t = i(M(), s(M(), e), o.restWorld);
			c = i(M(), a(o.parentKey), t);
		}
		return r.set(e, c), c;
	}
	return function(e, t) {
		if (e.parentKey === null || !n.has(e.parentKey)) return Float64Array.from(t);
		let r = s(M(), a(e.parentKey));
		return i(M(), r, t);
	};
}
function Ge(e, t, n) {
	Q(e, "graph");
	let r = Z(e, t), i = We(e, r);
	for (let [t, a] of r) n.getNode(t).localMatrix.set(i(e.source.byKey.get(t), a));
	return n.update();
}
function $(e, t) {
	Q(e, "asset");
	let r = Z(e, t), i = We(e, r), o = [];
	for (let [t, s] of r) {
		let r = e.source.byKey.get(t);
		if (r.editable === !1) throw RangeError(`Imported node ${r.label} has an authored pose that cannot be overridden.`);
		let c = i(r, s);
		o.push({
			id: t,
			translation: Array.from(n(f(), c)),
			rotation: Array.from(a(/* @__PURE__ */ new Float64Array(4), c)),
			scale: Array.from(l(f(), c))
		});
	}
	return o;
}
function Ke(e, t, n) {
	return n.stagePose({ nodeOverrides: $(e, t) }).commit();
}
export { Ve as applyVehicleLightsToParts, Ke as applyVehiclePoseToAsset, Ue as applyVehiclePoseToParts, Ge as applyVehiclePoseToSceneGraph, X as computeVehicleLightEmissions, $ as createVehicleNodeOverrides, xe as createVehicleRig, Y as driveAlongLegs, Ie as driveAlongPath, F as findWheelCandidates };
