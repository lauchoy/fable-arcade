/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { n as e, o as t, r as n } from "./mat4-BCZClxna.js";
import { n as r, s as i, t as a } from "./quat-Bl7gjwWK.js";
import { S as o, c as s, d as c, h as l, s as u, t as d, y as f } from "./vec3-BRYC6f_g.js";
import { n as p, r as m } from "./force-fields-ByNKkXEw.js";
// src/physics.js
var h, g, _ = () => import("@dimforge/rapier3d-compat"), v = [
	0,
	0,
	0
], y = [
	0,
	0,
	0,
	1
], b = 2 ** -126, x = 1e6, S = 1e4, C = 1e6, w = 1e8, T = Math.fround(Math.PI), E = {
	maxBodies: [256, 4096],
	maxColliders: [1024, 8192],
	maxJoints: [512, 8192],
	maxEvents: [1e4, 1e5],
	maxFrames: [3601, 1e6],
	maxColliderTriangles: [2e4, 2e5],
	maxHullPoints: [2048, 16384],
	maxContactEvents: [4096, 1e5]
}, D = .02, O = .05, k = 65535;
function A(e) {
	_ = e, h = void 0, g = void 0;
}
function j() {
	return h ??= _().then(async (e) => {
		let t = e.default ?? e;
		return await t.init(), g = t, t;
	}, (e) => {
		throw h = void 0, e;
	}), h;
}
function M() {
	return g !== void 0;
}
function N(e, t, n) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw TypeError(`${n} must be an object`);
	for (let r of Object.keys(e)) if (!t.includes(r)) throw TypeError(`${n}.${r} is unsupported`);
}
function P(e, t, n = -Infinity, r = Infinity) {
	let i = Math.fround(e);
	if (typeof e != "number" || !Number.isFinite(e) || !Number.isFinite(i) || e < n || e > r || i < n || i > r) throw RangeError(`${t} must be finite Float32 in [${n}, ${r}]`);
	return i;
}
function F(e, t) {
	let n = P(e, t, 0);
	if (n === 0) throw RangeError(`${t} must remain positive in Float32`);
	return n;
}
function I(e, t) {
	let n = P(e, t, b);
	return F(1 / n, `${t} reciprocal`), n;
}
function L(e, t) {
	let n = e[0] ** 2 + e[1] ** 2 + e[2] ** 2;
	return P(n, `${t} squared norm`, 0), Math.sqrt(n);
}
function R(e, t, n, r) {
	if (e ??= r, !e || e.length !== t) throw TypeError(`${n} must contain ${t} numbers`);
	return Array.from(e, (e, t) => P(e, `${n}[${t}]`));
}
function z(e, t) {
	let n = R(e, 4, t, y), r = Math.hypot(...n);
	if (!r || Math.abs(r - 1) > 1e-4) throw RangeError(`${t} must be a unit quaternion`);
	let i = n[3] === 0 && n.find((e) => e !== 0) < 0 ? -1 : 1;
	return n.map((e) => e === 0 ? 0 : Math.fround(i * e / r));
}
function B(e, t, n, r) {
	if (!Number.isSafeInteger(e) || e < n || e > r) throw RangeError(`${t} must be an integer in [${n}, ${r}]`);
	return e;
}
function V(e, t, n) {
	if (!Array.isArray(e) || e.length > n) throw RangeError(`${t} must be an array with at most ${n} entries`);
	let r = /* @__PURE__ */ new Set();
	for (let n of e) {
		if (typeof n?.name != "string" || !n.name.length || r.has(n.name)) throw TypeError(`${t} names must be nonempty and unique`);
		r.add(n.name);
	}
	return e;
}
function ee(e, t) {
	let n = R(e, 2, "joint limits"), r = t === "revolute" ? T : x;
	for (let e of n) P(e, "joint limit", -r, r);
	if (n[0] >= n[1]) throw RangeError("joint limits must remain strictly increasing in Float32");
	return n;
}
function H(e, t) {
	if (e === null) return null;
	if (N(e, [
		"mode",
		"target",
		"stiffness",
		"damping",
		"maxForce"
	], "motor"), !["position", "velocity"].includes(e.mode)) throw TypeError("motor mode must be position or velocity");
	if (e.mode === "velocity" && e.stiffness !== void 0) throw TypeError("velocity motors do not accept stiffness");
	let n = e.mode === "velocity" ? S : t.type === "revolute" ? T : x, r = P(e.target, "motor target", -n, n);
	if (e.target !== 0 && r === 0) throw RangeError("motor target must not collapse to zero in Float32");
	if (e.mode === "position" && t.limits && (r < t.limits[0] || r > t.limits[1])) throw RangeError("motor position target must stay within joint limits");
	let i = e.mode === "position" ? F(e.stiffness, "motor stiffness") : 0;
	if (i > C) throw RangeError("motor stiffness exceeds the supported gain bound");
	let a = P(e.damping, "motor damping", 0, C);
	if (e.damping !== 0 && a === 0) throw RangeError("motor damping must not collapse to zero in Float32");
	if (e.mode === "velocity" && a === 0) throw RangeError("velocity motor damping must remain positive in Float32");
	let o = I(e.maxForce, "motor maxForce");
	if (o > w) throw RangeError("motor maxForce exceeds the supported force bound");
	return {
		mode: e.mode,
		target: r,
		stiffness: i,
		damping: a,
		maxForce: o
	};
}
function U(e, t) {
	let n = t[e.bodyA], r = t[e.bodyB], p = o(/* @__PURE__ */ new Float64Array(3), e.axis, n.rotation), m = o(/* @__PURE__ */ new Float64Array(3), e.axis, r.rotation);
	if (u(p, m) > 1e-4) throw RangeError("controlled joint axes must initially align in world space");
	let h = o(/* @__PURE__ */ new Float64Array(3), e.anchorA, n.rotation), g = o(/* @__PURE__ */ new Float64Array(3), e.anchorB, r.rotation);
	d(h, h, n.translation), d(g, g, r.translation);
	let _ = f(/* @__PURE__ */ new Float64Array(3), g, h), v = i(/* @__PURE__ */ new Float64Array(4), a(/* @__PURE__ */ new Float64Array(4), n.rotation), r.rotation), y;
	if (e.type === "prismatic") {
		if (y = s(_, p), l(_, _, p, -y), c(_) > 1e-4 || Math.abs(v[3]) < .9999) throw RangeError("prismatic joint anchors must initially align along its axis with matching body orientations");
	} else {
		if (c(_) > 1e-4) throw RangeError("controlled revolute joint anchors must initially coincide");
		y = 2 * Math.atan2(v[0] * e.axis[0] + v[1] * e.axis[1] + v[2] * e.axis[2], v[3]), y > Math.PI && (y -= 2 * Math.PI), y < -Math.PI && (y += 2 * Math.PI), Math.abs(y) === Math.PI && (y = e.limits && e.limits[1] < Math.PI ? -Math.PI : Math.PI);
	}
	if (y = P(y, "initial joint coordinate", e.type === "revolute" ? -T : -1e6, e.type === "revolute" ? T : x), e.limits && (y < e.limits[0] || y > e.limits[1])) throw RangeError("initial joint coordinate must stay within joint limits");
}
function W(e, t, n) {
	if (!Array.isArray(e) && !ArrayBuffer.isView(e)) throw TypeError(`${t} must be an array of numbers`);
	if (e.length > n) throw RangeError(`${t} has ${e.length} numbers; the limit is ${n}`);
	return Float32Array.from(e, (e, n) => P(e, `${t}[${n}]`));
}
function G(e, t) {
	if (e.vertices !== void 0 || e.indices !== void 0 || e.radius !== void 0 || e.halfHeight !== void 0 || e.halfExtents !== void 0) throw TypeError("convexHull only accepts points");
	if (!e.points || e.points.length % 3 != 0 || e.points.length < 12) throw TypeError("convexHull points must hold at least four xyz points");
	let n = W(e.points, "points", t.maxHullPoints * 3), r = [
		Infinity,
		Infinity,
		Infinity
	], i = [
		-Infinity,
		-Infinity,
		-Infinity
	], a = 0;
	for (let e = 0; e < n.length; e += 3) {
		for (let t = 0; t < 3; t++) r[t] = Math.min(r[t], n[e + t]), i[t] = Math.max(i[t], n[e + t]);
		a = Math.max(a, Math.hypot(n[e], n[e + 1], n[e + 2]));
	}
	let o = i.map((e, t) => e - r[t]);
	return {
		shape: "convexHull",
		points: n,
		volume: o[0] * o[1] * o[2],
		smallestExtent: Math.min(...o) / 2,
		largestExtent: a
	};
}
function K(e, t, n, r) {
	if (t.type === "dynamic") throw TypeError("trimesh colliders need a fixed or kinematic body; use convexHull for a dynamic body");
	if (e.points !== void 0 || e.radius !== void 0 || e.halfHeight !== void 0 || e.halfExtents !== void 0) throw TypeError("trimesh only accepts vertices and indices");
	if (!e.vertices || e.vertices.length % 3 != 0 || !e.indices || e.indices.length % 3 != 0 || !e.indices.length) throw TypeError("trimesh needs xyz vertices and triangle indices");
	if (r.triangles += e.indices.length / 3, r.triangles > n.maxColliderTriangles) throw RangeError(`trimesh colliders hold ${r.triangles} triangles; maxColliderTriangles is ${n.maxColliderTriangles}`);
	let i = W(e.vertices, "vertices", n.maxColliderTriangles * 3 * 3), a = i.length / 3;
	return {
		shape: "trimesh",
		vertices: i,
		indices: Uint32Array.from(e.indices, (e, t) => B(e, `indices[${t}]`, 0, a - 1))
	};
}
function te(e, t, n, r) {
	if (e.shape === "convexHull") return G(e, n);
	if (e.shape === "trimesh") return K(e, t, n, r);
	if (e.points !== void 0 || e.vertices !== void 0 || e.indices !== void 0) throw TypeError(`${e.shape} does not accept points, vertices or indices`);
	return null;
}
function q(e, t) {
	N(e, [
		"bodies",
		"colliders",
		"joints",
		"events",
		"fields",
		"gravity"
	], "definition"), N(t, [
		"frameCount",
		"timestep",
		"solverIterations",
		"maxMemoryBytes",
		...Object.keys(E)
	], "options");
	let n = {};
	for (let [e, [r, i]] of Object.entries(E)) n[e] = B(t[e] ?? r, e, 1, i);
	let r = B(t.frameCount ?? 601, "frameCount", 1, n.maxFrames), i = F(t.timestep ?? 1 / 60, "timestep");
	if (F(1 / i, "timestep reciprocal"), i > 1) throw RangeError("timestep must be at most one second");
	let a = B(t.solverIterations ?? 8, "solverIterations", 1, 128), o = B(t.maxMemoryBytes ?? 134217728, "maxMemoryBytes", 1, 2 ** 31 - 1), s = V(e.bodies, "bodies", n.maxBodies);
	if (!s.length) throw RangeError("bodies must not be empty");
	let c = V(e.colliders ?? [], "colliders", n.maxColliders), l = V(e.joints ?? [], "joints", n.maxJoints), u = e.events ?? [];
	if (!Array.isArray(u) || u.length > n.maxEvents) throw RangeError("events exceed maxEvents");
	let d = s.length * r * 7 * Float32Array.BYTES_PER_ELEMENT, f = 1048576 + s.length * 16384 + c.length * 16384 + l.length * 8192 + c.length ** 2 * 128, p = d + f;
	if (!Number.isSafeInteger(p) || p > o) throw RangeError(`physics memory plan ${p} exceeds maxMemoryBytes ${o}`);
	let h = s.map((e) => {
		N(e, [
			"name",
			"type",
			"translation",
			"rotation",
			"linearVelocity",
			"angularVelocity",
			"linearDamping",
			"angularDamping",
			"ccd"
		], `body ${e.name}`);
		let t = e.type ?? "dynamic";
		if (![
			"dynamic",
			"fixed",
			"kinematic"
		].includes(t)) throw TypeError(`body ${e.name} has unsupported type`);
		if (t !== "dynamic" && (e.linearVelocity || e.angularVelocity || e.linearDamping !== void 0 || e.angularDamping !== void 0 || e.ccd !== void 0)) throw TypeError(`body ${e.name} only supports velocity, damping, and CCD when dynamic`);
		if (e.ccd !== void 0 && typeof e.ccd != "boolean") throw TypeError("ccd must be boolean");
		return {
			name: e.name,
			type: t,
			translation: R(e.translation, 3, "translation", v),
			rotation: z(e.rotation, "rotation"),
			linearVelocity: R(e.linearVelocity, 3, "linearVelocity", v),
			angularVelocity: R(e.angularVelocity, 3, "angularVelocity", v),
			linearDamping: P(e.linearDamping ?? 0, "linearDamping", 0),
			angularDamping: P(e.angularDamping ?? 0, "angularDamping", 0),
			ccd: e.ccd ?? !1
		};
	}), g = new Map(h.map((e, t) => [e.name, t]));
	function _(e) {
		if (!g.has(e)) throw TypeError(`unknown body ${e}`);
		return g.get(e);
	}
	let y = { triangles: 0 }, b = c.map((e) => {
		N(e, [
			"name",
			"body",
			"shape",
			"radius",
			"halfHeight",
			"halfExtents",
			"points",
			"vertices",
			"indices",
			"translation",
			"rotation",
			"mass",
			"density",
			"friction",
			"restitution",
			"sensor",
			"groups",
			"mask"
		], `collider ${e.name}`);
		let t = _(e.body), r = te(e, h[t], n, y);
		if (e.sensor !== void 0 && typeof e.sensor != "boolean") throw TypeError("sensor must be boolean");
		let i = {
			name: e.name,
			body: t,
			translation: R(e.translation, 3, "collider translation", v),
			rotation: z(e.rotation, "collider rotation"),
			friction: P(e.friction ?? .5, "friction", 0),
			restitution: P(e.restitution ?? 0, "restitution", 0, 1),
			sensor: e.sensor ?? !1,
			groups: B(e.groups ?? k, "groups", 0, k),
			mask: B(e.mask ?? k, "mask", 0, k)
		};
		if (r?.shape === "trimesh") return {
			...i,
			...r,
			effectiveMass: 0,
			minimumInertia: 0,
			largestExtent: 0
		};
		let a, o, s, c, l;
		if (e.shape === "ball") {
			if (e.halfHeight !== void 0 || e.halfExtents !== void 0) throw TypeError("ball only accepts radius");
			a = F(e.radius, "radius"), c = 4 * Math.PI * a ** 3 / 3, l = a;
		} else if (e.shape === "cuboid") {
			if (e.radius !== void 0 || e.halfHeight !== void 0) throw TypeError("cuboid only accepts halfExtents");
			s = R(e.halfExtents, 3, "halfExtents");
			for (let e of s) F(e, "halfExtents");
			c = 8 * s[0] * s[1] * s[2], l = Math.min(...s);
		} else if (e.shape === "capsule") {
			if (e.halfExtents !== void 0) throw TypeError("capsule only accepts radius and halfHeight");
			a = F(e.radius, "radius"), o = F(e.halfHeight, "halfHeight"), c = Math.PI * a ** 2 * 2 * o + 4 * Math.PI * a ** 3 / 3, l = a;
		} else if (e.shape === "cylinder" || e.shape === "cone") {
			if (e.halfExtents !== void 0) throw TypeError(`${e.shape} only accepts radius and halfHeight`);
			a = F(e.radius, "radius"), o = F(e.halfHeight, "halfHeight"), c = Math.PI * a ** 2 * 2 * o / (e.shape === "cone" ? 3 : 1), l = Math.min(a, o);
		} else if (r) c = r.volume, l = r.smallestExtent;
		else throw TypeError(`unsupported collider shape ${e.shape}`);
		if (F(c, "collider volume"), e.mass !== void 0 && e.density !== void 0) throw TypeError("collider accepts either mass or density");
		let u = e.mass === void 0 ? void 0 : F(e.mass, "mass"), d = u === void 0 ? F(e.density ?? 1, "density") : void 0, f = I(u ?? c * d, "collider effective mass");
		u !== void 0 && F(u / c, "collider effective density");
		let p = I(.1 * f * l ** 2, "collider minimum inertia scale"), m = r ? r.largestExtent : s ? Math.max(...s) : a + (o ?? 0);
		return F(f * m ** 2, "collider maximum inertia scale"), {
			...i,
			shape: e.shape,
			radius: a,
			halfHeight: o,
			halfExtents: s,
			points: r?.points,
			mass: u,
			density: d,
			effectiveMass: f,
			minimumInertia: p,
			largestExtent: m
		};
	}), S = Array(h.length).fill(0), w = Array(h.length).fill(0), T = Array(h.length).fill(0), D = Array(h.length).fill(0);
	for (let e of b) {
		if (e.shape === "trimesh") continue;
		let t = e.body;
		S[t] = I(S[t] + e.effectiveMass, "compound body mass"), w[t] = F(w[t] + e.effectiveMass * (e.largestExtent ** 2 + Math.hypot(...e.translation) ** 2), "compound body inertia scale"), T[t] = I(T[t] + e.minimumInertia, "compound body minimum inertia"), D[t] = Math.max(D[t], Math.hypot(...e.translation));
		for (let t of e.translation) P(e.effectiveMass * t, "collider weighted center");
	}
	for (let e = 0; e < h.length; e++) if (h[e].type === "dynamic" && S[e] === 0) throw TypeError(`dynamic body ${h[e].name} requires a collider with mass`);
	let O = l.map((e) => {
		if (N(e, [
			"name",
			"type",
			"bodyA",
			"bodyB",
			"anchorA",
			"anchorB",
			"axis",
			"frameA",
			"frameB",
			"contactsEnabled",
			"limits",
			"motor",
			"restLength",
			"stiffness",
			"damping"
		], `joint ${e.name}`), ![
			"spherical",
			"revolute",
			"prismatic",
			"fixed",
			"spring"
		].includes(e.type)) throw TypeError("unsupported joint type");
		let t = _(e.bodyA), n = _(e.bodyB);
		if (t === n) throw TypeError("joint bodies must differ");
		if (e.contactsEnabled !== void 0 && typeof e.contactsEnabled != "boolean") throw TypeError("contactsEnabled must be boolean");
		let r = e.type === "revolute" || e.type === "prismatic";
		if (!r && e.axis !== void 0) throw TypeError("axis requires a revolute or prismatic joint");
		if (!r && (e.limits !== void 0 || e.motor !== void 0)) throw TypeError("limits and motors require a revolute or prismatic joint");
		if (e.type !== "fixed" && (e.frameA !== void 0 || e.frameB !== void 0)) throw TypeError("joint frames require a fixed joint");
		if (e.type !== "spring" && (e.restLength !== void 0 || e.stiffness !== void 0 || e.damping !== void 0)) throw TypeError("restLength, stiffness and damping require a spring joint");
		let i = r ? R(e.axis, 3, "axis") : void 0;
		if (i && Math.abs(Math.hypot(...i) - 1) > 1e-4) throw RangeError("axis must be a unit vector");
		if (i) {
			let e = Math.hypot(...i);
			for (let t = 0; t < 3; t++) i[t] = Math.fround(i[t] / e);
		}
		let a = {
			type: e.type,
			bodyA: t,
			bodyB: n,
			anchorA: R(e.anchorA, 3, "anchorA", v),
			anchorB: R(e.anchorB, 3, "anchorB", v),
			axis: i,
			frameA: z(e.frameA, "frameA"),
			frameB: z(e.frameB, "frameB"),
			contactsEnabled: e.contactsEnabled ?? !1
		};
		if (e.type === "spring") {
			if (a.restLength = P(e.restLength ?? 0, "restLength", 0, x), a.stiffness = F(e.stiffness, "stiffness"), a.stiffness > C) throw RangeError("spring stiffness exceeds the supported gain bound");
			a.damping = P(e.damping ?? 0, "damping", 0, C);
		}
		return e.limits !== void 0 && (a.limits = ee(e.limits, e.type)), e.motor !== void 0 && (a.motor = H(e.motor, a)), (e.type === "prismatic" || e.limits !== void 0 || e.motor !== void 0) && U(a, h), a;
	}), A = new Map(l.map((e, t) => [e.name, t])), j = u.map((e, t) => {
		let n = B(e.tick, "event tick", 0, r - 2), i = e.type ?? "impulse";
		if (i === "jointMotor") {
			if (N(e, [
				"tick",
				"type",
				"joint",
				"motor"
			], `event ${t}`), !A.has(e.joint)) throw TypeError(`unknown joint ${e.joint}`);
			let r = A.get(e.joint);
			if (!["revolute", "prismatic"].includes(O[r].type)) throw TypeError("motor events require a revolute or prismatic joint");
			return U(O[r], h), {
				tick: n,
				type: i,
				order: t,
				joint: r,
				motor: H(e.motor, O[r])
			};
		}
		N(e, [
			"tick",
			"body",
			"type",
			"impulse",
			"torqueImpulse",
			"point",
			"translation",
			"rotation"
		], `event ${t}`);
		let a = _(e.body);
		if (i === "impulse") {
			if (h[a].type !== "dynamic") throw TypeError("impulses require a dynamic body");
			if (e.translation !== void 0 || e.rotation !== void 0 || e.impulse === void 0 && e.torqueImpulse === void 0 || e.point !== void 0 && e.impulse === void 0) throw TypeError("invalid impulse event fields");
			return {
				tick: n,
				body: a,
				type: i,
				order: t,
				impulse: e.impulse === void 0 ? void 0 : R(e.impulse, 3, "impulse"),
				torqueImpulse: e.torqueImpulse === void 0 ? void 0 : R(e.torqueImpulse, 3, "torqueImpulse"),
				point: e.point === void 0 ? void 0 : R(e.point, 3, "point")
			};
		}
		if (i !== "kinematicPose" || h[a].type !== "kinematic") throw TypeError("kinematicPose events require a kinematic body");
		if (e.impulse !== void 0 || e.torqueImpulse !== void 0 || e.point !== void 0 || e.translation === void 0 && e.rotation === void 0) throw TypeError("invalid kinematicPose event fields");
		return {
			tick: n,
			body: a,
			type: i,
			order: t,
			translation: e.translation === void 0 ? void 0 : R(e.translation, 3, "event translation"),
			rotation: e.rotation === void 0 ? void 0 : z(e.rotation, "event rotation")
		};
	}).sort((e, t) => e.tick - t.tick || e.order - t.order), M = m(e.fields ?? [], "fields"), L = R(e.gravity, 3, "gravity", [
		0,
		-9.81,
		0
	]);
	re(h, j, L, M, i, r, S, T, D, O, w);
	let W = Object.freeze({
		timelineBytes: d,
		solverReserveBytes: f,
		estimatedPeakBytes: p,
		maxMemoryBytes: o,
		bodyCount: h.length,
		colliderCount: b.length,
		jointCount: O.length,
		eventCount: j.length,
		frameCount: r
	});
	return {
		bodies: h,
		colliders: b,
		joints: O,
		events: j,
		fields: M,
		gravity: L,
		frameCount: r,
		timestep: i,
		solverIterations: a,
		maxContactEvents: n.maxContactEvents,
		memoryPlan: W
	};
}
function ne(e, t, n, r, i, a, o, s, c, l, u) {
	let d = e.map((e, t) => t);
	function f(e) {
		for (; d[e] !== e;) e = d[e];
		return e;
	}
	for (let e of t) d[f(e.bodyB)] = f(e.bodyA);
	let p = t.map(() => 0);
	function m(n, i) {
		if (!i) return;
		let a = t[n];
		if (e[a.bodyA].type !== "dynamic" && e[a.bodyB].type !== "dynamic") throw TypeError("active motors need at least one directly attached dynamic body");
		if (I(i.maxForce ** 2, "motor force squared norm"), I((i.maxForce * r) ** 2, "motor step impulse squared norm"), i.stiffness && I((i.stiffness * r ** 2) ** 2, "motor timestep stiffness squared"), i.damping && I((i.damping * r) ** 2, "motor timestep damping squared"), i.target !== 0) {
			I(i.target ** 2, "motor target squared norm");
			let e = i.mode === "position" ? i.stiffness : i.damping;
			I((Math.min(Math.abs(e * i.target), i.maxForce) * r) ** 2, "motor commanded impulse squared norm");
		}
		p[n] = Math.max(p[n], i.maxForce);
	}
	for (let e = 0; e < t.length; e++) m(e, t[e].motor);
	for (let e of n) e.type === "jointMotor" && m(e.joint, e.motor);
	let h = e.map(() => 0), g = e.map(() => 0), _ = e.map(() => 0);
	for (let t = 0; t < e.length; t++) _[f(t)] += c[t];
	for (let e = 0; e < t.length; e++) {
		let n = t[e], r = f(n.bodyA);
		_[r] += Math.hypot(...n.anchorA) + Math.hypot(...n.anchorB), n.type === "prismatic" ? h[r] += p[e] : g[r] += p[e];
	}
	for (let t = 0; t < e.length; t++) {
		if (e[t].type !== "dynamic") continue;
		let n = f(t), r = h[n], c = g[n] + r * _[n];
		if (!r && !c) continue;
		P(r ** 2, "combined motor force squared norm", 0), P(c ** 2, "combined motor torque squared norm", 0), r && I((r / a[t]) ** 2, "motor linear acceleration squared norm"), c && I((c / s[t]) ** 2, "motor angular acceleration squared norm");
		let d = c / o[t], p = r / a[t] + d * _[n];
		u[t] += d * i, l[t] += p * i, P(u[t] ** 2, "motor-induced angular velocity squared norm", 0), P(l[t] ** 2, "motor-induced linear velocity squared norm", 0), P((Math.hypot(...e[t].translation) + l[t] * i) ** 2, "motor-induced position squared norm", 0);
	}
}
function re(e, t, n, r, i, a, o, s, c, l, u) {
	let d = (a - 1) * i, f = r.reduce((e, t) => e + (t.type === "drag" ? 0 : Math.abs(t.strength)), 0), p = L(n, "gravity") + f, m = e.map((e) => {
		let t = L(e.linearVelocity, "linearVelocity") + (e.type === "dynamic" ? p * d : 0);
		return P(t ** 2, "accumulated linear velocity squared norm", 0), t;
	}), h = e.map((e) => L(e.angularVelocity, "angularVelocity"));
	for (let e of t) if (e.type === "impulse") {
		if (e.impulse) {
			let t = L(e.impulse, "impulse");
			m[e.body] += t / o[e.body], P(m[e.body] ** 2, "accumulated linear velocity squared norm", 0);
		}
		if (e.torqueImpulse) {
			let t = L(e.torqueImpulse, "torqueImpulse");
			h[e.body] += t / s[e.body], P(h[e.body] ** 2, "accumulated angular velocity squared norm", 0);
		}
	}
	ne(e, l, t, i, d, o, s, u, c, m, h);
	let g = e.map((e) => e.translation.slice()), _ = e.map((e) => e.translation.slice()), v = Array(e.length).fill(-1);
	for (let n of t) {
		let t = e[n.body];
		if (n.type === "kinematicPose") {
			if (n.translation) {
				v[n.body] !== n.tick && (_[n.body] = g[n.body]);
				let e = _[n.body];
				L(n.translation.map((t, n) => (t - e[n]) / i), "kinematic target velocity"), g[n.body] = n.translation, v[n.body] = n.tick;
			}
			n.rotation && P((Math.PI / i) ** 2, "kinematic angular velocity squared norm", 0);
		} else if (n.impulse && n.point) {
			let e = L(n.impulse, "impulse"), r = m[n.body] * d, i = e * (Math.hypot(...n.point) + Math.hypot(...t.translation) + r + c[n.body]);
			P(i ** 2, "off-center torque impulse squared norm", 0), h[n.body] += i / s[n.body], P(h[n.body] ** 2, "accumulated angular velocity squared norm", 0);
		}
	}
}
function ie(e, t = {}) {
	return q(e, t).memoryPlan;
}
var J = (e) => ({
	x: e[0],
	y: e[1],
	z: e[2]
}), Y = (e) => ({
	...J(e),
	w: e[3]
});
function X(e, t, n) {
	t.configureMotorModel(e.MotorModel.ForceBased), t.setMotorMaxForce(n?.maxForce ?? 0), n ? n.mode === "position" ? t.configureMotorPosition(n.target, n.stiffness, n.damping) : t.configureMotorVelocity(n.target, n.damping) : t.configureMotor(0, 0, 0, 0), t.body1().wakeUp(), t.body2().wakeUp();
}
async function ae(e, t = {}) {
	let n = q(e, t);
	return await j(), $(n);
}
function oe(e, t = {}) {
	if (!g) throw Error("Physics engine is not loaded. Await loadPhysicsEngine() first.");
	return $(q(e, t));
}
function se(e, t) {
	let n;
	if (t.shape === "ball") n = e.ColliderDesc.ball(t.radius);
	else if (t.shape === "cuboid") n = e.ColliderDesc.cuboid(...t.halfExtents);
	else if (t.shape === "capsule") n = e.ColliderDesc.capsule(t.halfHeight, t.radius);
	else if (t.shape === "cylinder") n = e.ColliderDesc.cylinder(t.halfHeight, t.radius);
	else if (t.shape === "cone") n = e.ColliderDesc.cone(t.halfHeight, t.radius);
	else if (t.shape === "convexHull") {
		if (n = e.ColliderDesc.convexHull(t.points), !n) throw RangeError("convexHull points are degenerate: they must span a volume");
	} else n = e.ColliderDesc.trimesh(t.vertices, t.indices);
	return n.setTranslation(...t.translation), n.setRotation(Y(t.rotation)), n.setFriction(t.friction), n.setRestitution(t.restitution), n.setSensor(t.sensor), n.setCollisionGroups((t.groups << 16 | t.mask) >>> 0), n.setActiveEvents(e.ActiveEvents.COLLISION_EVENTS), t.shape !== "trimesh" && (t.mass === void 0 ? n.setDensity(t.density) : n.setMass(t.mass)), n;
}
function Z(e, t) {
	let n = new e.World(J(t.gravity)), r = /* @__PURE__ */ new Map();
	try {
		n.timestep = t.timestep, n.numSolverIterations = t.solverIterations;
		let i = t.bodies.map((t) => {
			let r;
			return r = t.type === "dynamic" ? e.RigidBodyDesc.dynamic() : t.type === "fixed" ? e.RigidBodyDesc.fixed() : e.RigidBodyDesc.kinematicPositionBased(), r.setTranslation(...t.translation), r.setRotation(Y(t.rotation)), t.type === "dynamic" && (r.setLinvel(...t.linearVelocity), r.setAngvel(J(t.angularVelocity)), r.setLinearDamping(t.linearDamping), r.setAngularDamping(t.angularDamping), r.setCcdEnabled(t.ccd)), n.createRigidBody(r);
		});
		return t.colliders.forEach((t, a) => {
			let o = n.createCollider(se(e, t), i[t.body]);
			r.set(o.handle, a);
		}), {
			world: n,
			bodies: i,
			joints: t.joints.map((t) => {
				let r = J(t.anchorA), a = J(t.anchorB), o;
				o = t.type === "spherical" ? e.JointData.spherical(r, a) : t.type === "revolute" ? e.JointData.revolute(r, a, J(t.axis)) : t.type === "prismatic" ? e.JointData.prismatic(r, a, J(t.axis)) : t.type === "spring" ? e.JointData.spring(t.restLength, t.stiffness, t.damping, r, a) : e.JointData.fixed(r, Y(t.frameA), a, Y(t.frameB));
				let s = n.createImpulseJoint(o, i[t.bodyA], i[t.bodyB], !0);
				return s.setContactsEnabled(t.contactsEnabled), t.limits && s.setLimits(...t.limits), t.motor !== void 0 && X(e, s, t.motor), s;
			}),
			colliderIndices: r
		};
	} catch (e) {
		throw n.free(), e;
	}
}
function Q(e, t, n) {
	let r = [
		0,
		0,
		0
	];
	for (let i = 0; i < t.length; i++) {
		if (e.bodies[i].type !== "dynamic") continue;
		let a = t[i], o = a.translation(), s = a.linvel();
		p(e.fields, [
			o.x,
			o.y,
			o.z
		], [
			s.x,
			s.y,
			s.z
		], n, r);
		let c = a.mass() * e.timestep;
		(r[0] || r[1] || r[2]) && a.applyImpulse({
			x: r[0] * c,
			y: r[1] * c,
			z: r[2] * c
		}, !0);
	}
}
function $(e) {
	let t = g, { world: n, bodies: r, joints: i, colliderIndices: a } = Z(t, e), o = new t.EventQueue(!0), s = [], c = new Int32Array(e.bodies.length).fill(-1), l = !1, u;
	try {
		u = new Float32Array(e.memoryPlan.timelineBytes / 4);
		let d = 0;
		for (let f = 0; f < e.frameCount; f++) {
			if (f > 0) {
				for (; d < e.events.length && e.events[d].tick === f - 1;) {
					let n = e.events[d];
					if (d++, n.type === "jointMotor") {
						X(t, i[n.joint], n.motor);
						continue;
					}
					let a = r[n.body];
					n.type === "kinematicPose" ? (n.translation && a.setNextKinematicTranslation(J(n.translation)), n.rotation && a.setNextKinematicRotation(Y(n.rotation))) : (n.impulse && (n.point ? a.applyImpulseAtPoint(J(n.impulse), J(n.point), !0) : a.applyImpulse(J(n.impulse), !0)), n.torqueImpulse && a.applyTorqueImpulse(J(n.torqueImpulse), !0));
				}
				e.fields.length && Q(e, r, (f - 1) * e.timestep), n.step(o), o.drainCollisionEvents((t, n, r) => {
					if (s.length >= e.maxContactEvents) {
						l = !0;
						return;
					}
					let i = a.get(t), o = a.get(n), c = e.colliders[i].sensor || e.colliders[o].sensor;
					s.push(Object.freeze({
						frame: f,
						kind: c ? "sensor" : "contact",
						started: r,
						colliderA: i,
						colliderB: o
					}));
				});
			}
			for (let t = 0; t < r.length; t++) {
				let n = r[t].linvel(), i = r[t].angvel();
				P(n.x ** 2 + n.y ** 2 + n.z ** 2, "solver linear velocity squared norm", 0), P(i.x ** 2 + i.y ** 2 + i.z ** 2, "solver angular velocity squared norm", 0), (Math.hypot(n.x, n.y, n.z) > D || Math.hypot(i.x, i.y, i.z) > O) && (c[t] = f);
				let a = r[t].translation(), o = r[t].rotation(), s = (f * r.length + t) * 7;
				u[s] = a.x, u[s + 1] = a.y, u[s + 2] = a.z, u[s + 3] = o.x, u[s + 4] = o.y, u[s + 5] = o.z, u[s + 6] = o.w;
				for (let n = 0; n < 7; n++) if (!Number.isFinite(u[s + n])) throw RangeError(`solver produced nonfinite pose at frame ${f}, body ${e.bodies[t].name}`);
				let l = Math.hypot(o.x, o.y, o.z, o.w);
				if (!l || Math.abs(l - 1) > .001) throw RangeError("solver produced invalid quaternion");
			}
		}
	} finally {
		o.free(), n.free();
	}
	return ce(e, u, {
		contactEvents: s,
		contactEventsTruncated: l,
		lastMovingFrames: c
	});
}
function ce(i, a, o) {
	let s = Object.freeze(i.bodies.map((e) => e.name)), c = new Map(s.map((e, t) => [e, t])), l = s.length * 7, u = (i.frameCount - 1) * i.timestep;
	function d() {
		if (!a) throw Error("physics scene is disposed");
	}
	function f(e) {
		if (d(), !c.has(e)) throw TypeError(`unknown body ${e}`);
		return c.get(e);
	}
	function p(e, t) {
		if (d(), typeof e != "number" || !Number.isFinite(e)) throw RangeError("sample time must be finite");
		if (t ??= new Float32Array(l), !(t instanceof Float32Array) || t.length !== l) throw TypeError(`sample output must be Float32Array(${l})`);
		let n = Math.max(0, Math.min(u, e)) / i.timestep, r = Math.round(n);
		Math.abs(n - r) <= 2 ** -52 * Math.max(1, n) * 4 && (n = r);
		let o = Math.min(i.frameCount - 1, Math.floor(n)), c = Math.min(i.frameCount - 1, o + 1), f = n - o;
		for (let e = 0; e < s.length; e++) {
			let n = e * 7, r = o * l + n, i = c * l + n;
			for (let e = 0; e < 3; e++) t[n + e] = a[r + e] * (1 - f) + a[i + e] * f;
			if (f === 0 || o === c) {
				for (let e = 3; e < 7; e++) t[n + e] = a[r + e];
				continue;
			}
			let s = 0;
			for (let e = 3; e < 7; e++) s += a[r + e] * a[i + e];
			let u = s < 0 ? -1 : 1;
			s = Math.min(1, Math.abs(s));
			let d = 1 - f, p = f;
			if (s < .9995) {
				let e = Math.acos(s), t = Math.sin(e);
				d = Math.sin((1 - f) * e) / t, p = Math.sin(f * e) / t;
			}
			let m = 0;
			for (let e = 3; e < 7; e++) {
				let o = d * a[r + e] + u * p * a[i + e];
				t[n + e] = o, m += o ** 2;
			}
			let h = Math.sqrt(m);
			for (let e = 3; e < 7; e++) t[n + e] /= h;
		}
		return t;
	}
	function m(a) {
		if (d(), !Array.isArray(a) || a.length > i.memoryPlan.bodyCount * 16) throw RangeError("bindings must be a bounded array");
		let o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), c = a.map((t) => {
			N(t, ["body", "part"], "binding");
			let i = f(t.body), a = t.part?.matrix;
			if (!(a instanceof Float32Array) || a.length !== 16 || o.has(a)) throw TypeError("each binding requires a distinct retained Float32 part.matrix");
			o.add(a);
			let c = s.get(a.buffer);
			c || (c = [], s.set(a.buffer, c)), c.push(a);
			for (let e of a) P(e, "binding matrix");
			if (a[3] !== 0 || a[7] !== 0 || a[11] !== 0 || a[15] !== 1) throw TypeError("binding matrix must be affine");
			let l = [
				Math.hypot(a[0], a[1], a[2]),
				Math.hypot(a[4], a[5], a[6]),
				Math.hypot(a[8], a[9], a[10])
			];
			for (let e of l) F(e, "binding scale");
			for (let [e, t] of [
				[0, 1],
				[0, 2],
				[1, 2]
			]) {
				let n = a[e * 4] * a[t * 4] + a[e * 4 + 1] * a[t * 4 + 1] + a[e * 4 + 2] * a[t * 4 + 2];
				if (Math.abs(n / l[e] / l[t]) > 1e-5) throw TypeError("binding matrix shear is unsupported");
			}
			return n(a) < 0 && (l[0] *= -1), {
				part: t.part,
				matrix: a,
				index: i,
				scale: l,
				position: /* @__PURE__ */ new Float32Array(3),
				rotation: r(),
				scratchMatrix: e()
			};
		});
		for (let e of s.values()) {
			e.sort((e, t) => e.byteOffset - t.byteOffset);
			for (let t = 1; t < e.length; t++) {
				let n = e[t - 1], r = e[t];
				if (n.byteOffset + n.byteLength > r.byteOffset) throw TypeError("binding matrix views must not overlap");
			}
		}
		let u = new Float32Array(l);
		return Object.freeze({ apply(e) {
			d();
			for (let e = 0; e < c.length; e++) if (c[e].part.matrix !== c[e].matrix) throw Error("binding part.matrix identity changed");
			p(e, u);
			for (let e = 0; e < c.length; e++) {
				let n = c[e], r = n.index * 7;
				for (let e = 0; e < 3; e++) n.position[e] = u[r + e];
				for (let e = 0; e < 4; e++) n.rotation[e] = u[r + e + 3];
				t(n.scratchMatrix, n.rotation, n.position, n.scale);
				for (let e = 0; e < 16; e++) if (!Number.isFinite(n.scratchMatrix[e])) throw RangeError("binding transform exceeds Float32 range");
			}
			for (let e = 0; e < c.length; e++) c[e].matrix.set(c[e].scratchMatrix);
			return a;
		} });
	}
	return Object.freeze({
		bodyNames: s,
		frameCount: i.frameCount,
		timestep: i.timestep,
		duration: u,
		memoryPlan: i.memoryPlan,
		bodyIndex: f,
		sample: p,
		bindParts: m,
		colliderNames: Object.freeze(i.colliders.map((e) => i.bodies[e.body].name)),
		contactEvents: Object.freeze(o.contactEvents),
		contactEventsTruncated: o.contactEventsTruncated,
		restFrames: Object.freeze(Array.from(o.lastMovingFrames, (e) => e < i.frameCount - 1 ? e + 1 : -1)),
		dispose() {
			a = null;
		},
		get disposed() {
			return a === null;
		}
	});
}
function le(e, t = {}) {
	if (e && e.events !== void 0 && e.events.length) throw TypeError("a live physics definition takes no events; call applyImpulse, setKinematicPose or setLinearVelocity on the system instead");
	return q({
		...e,
		events: []
	}, {
		...t,
		frameCount: 1
	});
}
function ue() {
	if (!g) throw Error("Physics engine is not loaded. Await loadPhysicsEngine() first.");
	return g;
}
export { Q as applyForceFieldImpulses, oe as bakePhysicsScene, ae as createPhysicsScene, Z as createRapierWorld, j as loadPhysicsEngine, M as physicsEngineLoaded, ie as planPhysicsScene, le as prepareLivePhysics, ue as requireRapier, A as setPhysicsModuleLoader };
