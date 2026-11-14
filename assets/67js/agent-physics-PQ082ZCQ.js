/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { d as e, h as t, l as n, n as r, o as i, t as a, u as o } from "./mat4-BCZClxna.js";
import { S as s, a as c, d as l, m as u, p as d, t as f, x as p, y as m } from "./vec3-BRYC6f_g.js";
import { t as h } from "./field-error-BpFTmyMO.js";
import { a as g, i as _, l as v } from "./rig-DvXCM9gw.js";
import { c as y, f as ee, l as te, n as b, o as x, s as S, u as ne } from "./quat-Bl7gjwWK.js";
import { bakePhysicsScene as C, loadPhysicsEngine as re, physicsEngineLoaded as w, setPhysicsModuleLoader as ie } from "./physics.js";
import { r as ae } from "./force-fields-ByNKkXEw.js";
import { E as oe } from "./agent-scene-capabilities-BaawWMO1.js";
var se = 1e-4, ce = .25, le = .2, ue = 3, T = 120 * Math.PI / 180, de = 1, fe = 65535, pe = .001, me = [
	0,
	1,
	0
];
function he(t) {
	let r = a(t.worldMatrix), i = y(b(), n(b(), r)), o = e(c(), r), u = s(c(), m(c(), t.tail, o), x(b(), i)), d = l(u);
	if (!(d > se)) throw RangeError(`Ragdoll bone ${t.id} has no length: its head and tail coincide.`);
	let f = E(r, t.id), p = t.parentId === null ? ge(t.parentWorldMatrix, t.id) : null;
	return {
		...t,
		head: o,
		rotation: i,
		uniformScale: f,
		staticParent: p,
		tailInBone: u,
		length: d
	};
}
function E(e, t) {
	let n = o(c(), e);
	if (Math.max(...n) - Math.min(...n) > pe * Math.max(...n)) throw RangeError(`Ragdoll bone ${t} sits under a stretched (non-uniform) scale ${JSON.stringify(Array.from(n))}; a ragdoll needs uniform scale above its bones.`);
	return n[0];
}
function ge(t, r) {
	return {
		translation: e(c(), t),
		rotation: y(b(), n(b(), t)),
		scale: E(t, r)
	};
}
function _e(e, t) {
	y(e, e);
	let n = S(b(), x(b(), t), e);
	n[3] < 0 && ne(n, n, -1);
	let r = 2 * Math.acos(Math.min(1, n[3]));
	if (r <= T) return;
	let i = ee(b(), b(), n, T / r);
	S(e, t, i);
}
function ve(e, t, n) {
	let r = e.length * le, i = t.layer ?? de, a = {
		name: e.id,
		body: e.id,
		shape: "capsule",
		radius: r,
		halfHeight: Math.max(e.length / 2 - r, r * .01),
		translation: Array.from(u(c(), e.tailInBone, .5)),
		rotation: Array.from(te(b(), me, d(c(), e.tailInBone))),
		groups: 1 << i,
		mask: t.collidesWith ?? fe & ~(1 << i),
		mass: (t.density ?? 1) * Math.max(e.length, n * ce)
	};
	return t.friction !== void 0 && (a.friction = t.friction), t.restitution !== void 0 && (a.restitution = t.restitution), a;
}
function ye(e, t, n) {
	let r = m(c(), e.head, t.head), i = s(c(), r, x(b(), t.rotation));
	return {
		name: `ragdoll-joint-${n}`,
		type: "spherical",
		bodyA: t.id,
		bodyB: e.id,
		anchorA: Array.from(i),
		anchorB: [
			0,
			0,
			0
		]
	};
}
function D(e, t = {}) {
	if (!Array.isArray(e) || e.length < 1 || e.length > 48) throw RangeError(`A ragdoll needs 1 to 48 bones; this rig has ${Array.isArray(e) ? e.length : 0}.`);
	let n = e.map(he), r = new Map(n.map((e) => [e.id, e])), i = Math.max(...n.map((e) => e.length)), a = [], o = [], l = [];
	for (let e of n) {
		let n = e.parentId === null ? null : r.get(e.parentId);
		if (e.parentId !== null && !n) throw RangeError(`Ragdoll bone ${e.id} names a parent that is not in the ragdoll: ${e.parentId}.`);
		a.push({
			name: e.id,
			type: "dynamic",
			translation: Array.from(e.head),
			rotation: Array.from(e.rotation),
			angularDamping: ue
		}), o.push(ve(e, t, i)), n && l.push(ye(e, n, l.length));
	}
	for (let e of n) {
		let t = e.parentId === null ? e.staticParent.rotation : r.get(e.parentId).rotation;
		e.restLocalRotation = S(b(), x(b(), t), e.rotation);
	}
	let d = c();
	return Object.freeze({
		boneIds: n.map((e) => e.id),
		definition: {
			bodies: a,
			colliders: o,
			joints: l
		},
		writePatches(e, t) {
			let r = /* @__PURE__ */ new Map();
			for (let i of n) {
				let n = e(i.id), a = i.parentId === null ? i.staticParent : r.get(i.parentId);
				r.set(i.id, {
					translation: n.translation,
					rotation: n.rotation,
					scale: i.uniformScale
				});
				let o = x(b(), a.rotation), c = t.get(i.id);
				m(d, n.translation, a.translation), s(c.translation, d, o), u(c.translation, c.translation, 1 / a.scale), S(c.rotation, o, n.rotation), _e(c.rotation, i.restLocalRotation);
			}
		},
		ends(e, t) {
			let n = r.get(e).tailInBone, i = s(c(), n, t.rotation);
			return {
				head: Array.from(t.translation),
				tail: Array.from(f(i, i, t.translation))
			};
		}
	});
}
function O(e) {
	return new Map(e.boneIds.map((e) => [e, {
		translation: /* @__PURE__ */ new Float64Array(3),
		rotation: /* @__PURE__ */ new Float64Array(4)
	}]));
}
var k = (e) => Number(e.toFixed(4));
function A(e, t) {
	let n = t.sample(t.duration), r = t.sample(Math.max(0, t.duration - t.timestep)), i = Infinity, a = -Infinity, o = 0, s = 0;
	for (let c of e.boneIds) {
		let l = t.bodyIndex(c) * 7, u = {
			translation: n.subarray(l, l + 3),
			rotation: n.subarray(l + 3, l + 7)
		}, { head: d, tail: f } = e.ends(c, u);
		i = Math.min(i, d[1], f[1]), a = Math.max(a, d[1], f[1]);
		let p = Math.hypot(...[
			0,
			1,
			2
		].map((e) => n[l + e] - r[l + e]));
		o = Math.max(o, p / t.timestep);
		let m = t.restFrames[t.bodyIndex(c)];
		s = s < 0 || m < 0 ? -1 : Math.max(s, m);
	}
	return {
		bones: e.boneIds.length,
		lowestY: k(i),
		highestY: k(a),
		fastestFinalSpeed: k(o),
		restsAtTime: s < 0 ? null : Number((s * t.timestep).toFixed(3))
	};
}
// src/agent-physics.js
var j = 60, M = 10, be = 64, N = 64, P = 15, F = 2e4, I = 2048, L = 65536, xe = 64, Se = 128, Ce = 128, we = 16, R = [
	"dynamic",
	"fixed",
	"kinematic"
], z = [
	"box",
	"ball",
	"capsule",
	"cylinder",
	"cone",
	"convex",
	"trimesh",
	"compound"
], B = [
	"box",
	"ball",
	"capsule",
	"cylinder",
	"cone"
], V = [
	"spherical",
	"revolute",
	"prismatic",
	"fixed",
	"spring"
], Te = [
	"node",
	"type",
	"shape",
	"shapes",
	"mass",
	"density",
	"friction",
	"restitution",
	"sensor",
	"velocity",
	"angularVelocity",
	"layer",
	"collidesWith"
], Ee = [
	"shape",
	"translation",
	"rotation",
	"halfExtents",
	"radius",
	"halfHeight"
], De = [
	"name",
	"type",
	"bodyA",
	"bodyB",
	"anchorA",
	"anchorB",
	"axis",
	"limits",
	"motor",
	"restLength",
	"stiffness",
	"damping",
	"contactsEnabled"
], Oe = [
	"mode",
	"target",
	"stiffness",
	"damping",
	"maxForce"
], ke = [
	"time",
	"tick",
	"type",
	"body",
	"joint",
	"impulse",
	"torqueImpulse",
	"point",
	"translation",
	"rotation",
	"motor"
], Ae = [
	"duration",
	"gravity",
	"bodies",
	"joints",
	"events",
	"fields",
	"ragdoll"
], H = [
	"armature",
	"density",
	"friction",
	"restitution",
	"layer"
];
function U(e, t, n) {
	if (!e || Object.getPrototypeOf(e) !== Object.prototype) throw h(n, e, "a plain object, such as {}", TypeError);
	for (let r of Object.keys(e)) if (!t.includes(r)) throw h(`${n}.${r}`, e[r], `no such field; use one of ${t.join(", ")}`, TypeError);
}
function W(e, t, n = -Infinity, r = Infinity) {
	if (typeof e != "number" || !Number.isFinite(e) || !Number.isFinite(Math.fround(e)) || e < n || e > r) {
		let i = Number.isFinite(n) && Number.isFinite(r), a = i ? `from ${n} to ${r}` : "that fits Float32";
		throw h(t, e, `a number ${a}, such as ${i ? Math.min(Math.max(1, n), r) : 1}`);
	}
	return e;
}
function G(e, t, n) {
	if (!Array.isArray(e) || e.length !== t) throw h(n, e, `an array of ${t} numbers, such as [${Array(t).fill(0).join(", ")}]`, TypeError);
	return e.map((e, t) => W(e, `${n}[${t}]`));
}
function K(e, t) {
	if (typeof e != "string" || !e.trim() || e.length > 128) throw h(t, e, "a node ID of 1 to 128 characters, such as \"crate\"", TypeError);
	return e;
}
function q(e, t, n) {
	if (!Array.isArray(e) || e.length > t) throw h(n, Array.isArray(e) ? `${e.length} entries` : e, `an array of at most ${t} entries, such as []`, TypeError);
	return e;
}
function je(e, t, n, r, i) {
	U(e, Te, i);
	let a = K(e.node, `${i}.node`), o = t.get(a);
	if (!o) throw h(`${i}.node`, a, `the ID of a recipe node, one of ${[...t.keys()].slice(0, 5).join(", ") || "none yet"}`);
	if (o.geometry === void 0) throw h(`${i}.node`, a, "a node with a geometry to fit a collider to; set geometry on it or pick another node");
	if (o.parent !== null) throw h(`${i}.node`, a, "a root node, with no parent; reparent it or move its parent into the body");
	if (r.has(a)) throw h(`${i}.node`, a, "a node with one physics body only; this one already has another");
	if (n.has(a)) throw h(`${i}.node`, a, "a node without a motion translation or rotation track; pick the track or the body, not both");
	r.add(a);
	let s = e.type ?? "dynamic";
	if (!R.includes(s)) throw h(`${i}.type`, s, `one of ${R.join(", ")}`);
	if (e.sensor !== void 0 && typeof e.sensor != "boolean") throw h(`${i}.sensor`, e.sensor, "true or false", TypeError);
	let c = e.sensor ?? !1, l = e.shape ?? (c || s === "dynamic" ? "box" : "trimesh");
	if (!z.includes(l)) throw h(`${i}.shape`, l, `one of ${z.join(", ")}`);
	if (l === "trimesh" && s === "dynamic") throw h(`${i}.shape`, l, "one of convex, box, ball or capsule for a dynamic body; trimesh is for fixed or kinematic bodies");
	if (s !== "dynamic" && (e.velocity !== void 0 || e.angularVelocity !== void 0)) {
		let t = e.velocity === void 0 ? "angularVelocity" : "velocity";
		throw h(`${i}.${t}`, e[t], `no velocity since the body is ${s}; only dynamic bodies take one, such as type "dynamic"`, TypeError);
	}
	if (e.mass !== void 0 && e.density !== void 0) throw h(`${i}.density`, e.density, "mass or density, not both; drop one, such as density 1", TypeError);
	let u = {
		node: a,
		type: s,
		shape: l
	};
	if (c && (u.sensor = !0), e.mass !== void 0 && (u.mass = W(e.mass, `${i}.mass`, 1e-6, 1e9)), e.density !== void 0 && (u.density = W(e.density, `${i}.density`, 1e-6, 1e9)), e.friction !== void 0 && (u.friction = W(e.friction, `${i}.friction`, 0, 100)), e.restitution !== void 0 && (u.restitution = W(e.restitution, `${i}.restitution`, 0, 1)), e.velocity !== void 0 && (u.velocity = G(e.velocity, 3, `${i}.velocity`)), e.angularVelocity !== void 0 && (u.angularVelocity = G(e.angularVelocity, 3, `${i}.angularVelocity`)), e.layer !== void 0 && (u.layer = Math.trunc(W(e.layer, `${i}.layer`, 0, P))), l === "compound") {
		let t = q(e.shapes, we, `${i}.shapes`);
		if (!t.length) throw h(`${i}.shapes`, t, "at least one sub-collider when shape is \"compound\", such as [{ \"shape\": \"box\", \"halfExtents\": [0.5, 0.5, 0.5] }]");
		u.shapes = t.map((e, t) => Me(e, `${i}.shapes[${t}]`));
	} else if (e.shapes !== void 0) throw h(`${i}.shapes`, e.shapes, "a field left out unless shape is \"compound\"", TypeError);
	if (e.collidesWith !== void 0) {
		let t = q(e.collidesWith, 16, `${i}.collidesWith`);
		u.collidesWith = [...new Set(t.map((e, t) => Math.trunc(W(e, `${i}.collidesWith[${t}]`, 0, P))))].sort((e, t) => e - t);
	}
	return u;
}
function Me(e, t) {
	if (U(e, Ee, t), !B.includes(e.shape)) throw h(`${t}.shape`, e.shape, `one of ${B.join(", ")}`);
	let n = { shape: e.shape };
	return e.translation !== void 0 && (n.translation = G(e.translation, 3, `${t}.translation`)), e.rotation !== void 0 && (n.rotation = G(e.rotation, 4, `${t}.rotation`)), e.shape === "box" ? n.halfExtents = G(e.halfExtents, 3, `${t}.halfExtents`).map((e, n) => W(e, `${t}.halfExtents[${n}]`, 1e-4, 1e6)) : e.shape === "ball" ? n.radius = W(e.radius, `${t}.radius`, 1e-4, 1e6) : (n.radius = W(e.radius, `${t}.radius`, 1e-4, 1e6), n.halfHeight = W(e.halfHeight, `${t}.halfHeight`, 1e-4, 1e6)), n;
}
function J(e, t) {
	if (e === null) return null;
	if (U(e, Oe, t), !["position", "velocity"].includes(e.mode)) throw h(`${t}.mode`, e.mode, "one of position, velocity");
	let n = {
		mode: e.mode,
		target: W(e.target, `${t}.target`, -1e4, 1e4),
		damping: W(e.damping ?? (e.mode === "velocity" ? 10 : 0), `${t}.damping`, 0, 1e6),
		maxForce: W(e.maxForce ?? 1e4, `${t}.maxForce`, 1e-6, 1e8)
	};
	if (e.mode === "position") n.stiffness = W(e.stiffness ?? 100, `${t}.stiffness`, 1e-6, 1e6);
	else if (e.stiffness !== void 0) throw h(`${t}.stiffness`, e.stiffness, "a field left out for velocity motors", TypeError);
	return n;
}
function Ne(e, t, n, r) {
	if (U(e, De, r), !V.includes(e.type)) throw h(`${r}.type`, e.type, `one of ${V.join(", ")}`);
	for (let n of ["bodyA", "bodyB"]) if (!t.has(e[n])) throw h(`${r}.${n}`, e[n], `the node of a physics body, one of ${[...t].slice(0, 5).join(", ") || "none yet"}`);
	let i = {
		type: e.type,
		bodyA: e.bodyA,
		bodyB: e.bodyB
	};
	if (e.name !== void 0) {
		let t = K(e.name, `${r}.name`);
		if (n.has(t)) throw h(`${r}.name`, t, "a unique joint name");
		n.add(t), i.name = t;
	}
	for (let t of [
		"anchorA",
		"anchorB",
		"axis"
	]) e[t] !== void 0 && (i[t] = G(e[t], 3, `${r}.${t}`));
	if (e.contactsEnabled !== void 0) {
		if (typeof e.contactsEnabled != "boolean") throw h(`${r}.contactsEnabled`, e.contactsEnabled, "true or false", TypeError);
		i.contactsEnabled = e.contactsEnabled;
	}
	if (e.limits !== void 0 && (i.limits = G(e.limits, 2, `${r}.limits`)), e.motor !== void 0 && (i.motor = J(e.motor, `${r}.motor`)), e.type === "spring") i.restLength = W(e.restLength ?? 0, `${r}.restLength`, 0, 1e6), i.stiffness = W(e.stiffness, `${r}.stiffness`, 1e-6, 1e6), e.damping !== void 0 && (i.damping = W(e.damping, `${r}.damping`, 0, 1e6));
	else if (e.restLength !== void 0 || e.stiffness !== void 0 || e.damping !== void 0) throw h(`${r}.stiffness`, e.stiffness ?? e.restLength ?? e.damping, "a field left out unless joint type is \"spring\"", TypeError);
	return i;
}
function Pe(e, t, n, r, i) {
	U(e, ke, i);
	let a = e.type ?? "impulse";
	if (![
		"impulse",
		"kinematicPose",
		"jointMotor"
	].includes(a)) throw h(`${i}.type`, a, "one of impulse, kinematicPose, jointMotor");
	let o = Math.max(0, Math.round(t * j) - 1), s;
	if (e.tick !== void 0) s = Math.trunc(W(e.tick, `${i}.tick`, 0, o));
	else {
		let n = W(e.time ?? 0, `${i}.time`, 0, t);
		s = Math.min(o, Math.max(0, Math.round(n * j)));
	}
	if (a === "jointMotor") {
		if (!r.has(e.joint)) throw h(`${i}.joint`, e.joint, `the name of a physics joint, one of ${[...r].slice(0, 5).join(", ") || "none yet"}`);
		return {
			tick: s,
			type: a,
			joint: e.joint,
			motor: J(e.motor, `${i}.motor`)
		};
	}
	if (!n.has(e.body)) throw h(`${i}.body`, e.body, `the node of a physics body, one of ${[...n.keys()].slice(0, 5).join(", ") || "none yet"}`);
	let c = {
		tick: s,
		type: a,
		body: e.body
	};
	if (a === "impulse") {
		if (n.get(e.body) !== "dynamic") throw h(`${i}.body`, e.body, "a dynamic body for an impulse event");
		if (e.impulse === void 0 && e.torqueImpulse === void 0) throw h(`${i}.impulse`, void 0, "impulse or torqueImpulse on an impulse event, such as [0, 5, 0]");
		return e.impulse !== void 0 && (c.impulse = G(e.impulse, 3, `${i}.impulse`)), e.torqueImpulse !== void 0 && (c.torqueImpulse = G(e.torqueImpulse, 3, `${i}.torqueImpulse`)), e.point !== void 0 && (c.point = G(e.point, 3, `${i}.point`)), c;
	}
	if (n.get(e.body) !== "kinematic") throw h(`${i}.body`, e.body, "a kinematic body for a kinematicPose event");
	if (e.translation === void 0 && e.rotation === void 0) throw h(`${i}.translation`, void 0, "translation or rotation on a kinematicPose event, such as [1, 0, 0]");
	return e.translation !== void 0 && (c.translation = G(e.translation, 3, `${i}.translation`)), e.rotation !== void 0 && (c.rotation = G(e.rotation, 4, `${i}.rotation`)), c;
}
function Fe(e, t, n) {
	U(e, H, "physics.ragdoll");
	let r = (t.armatures ?? []).find((t) => t.id === e.armature);
	if (!r) {
		let n = (t.armatures ?? []).slice(0, 5).map((e) => e.id).join(", ") || "none yet; add one to the recipe armatures";
		throw h("physics.ragdoll.armature", e.armature, `the ID of a recipe armature, one of ${n}`);
	}
	let i = { armature: r.id };
	e.density !== void 0 && (i.density = W(e.density, "physics.ragdoll.density", 1e-6, 1e9)), e.friction !== void 0 && (i.friction = W(e.friction, "physics.ragdoll.friction", 0, 100)), e.restitution !== void 0 && (i.restitution = W(e.restitution, "physics.ragdoll.restitution", 0, 1)), e.layer !== void 0 && (i.layer = Math.trunc(W(e.layer, "physics.ragdoll.layer", 0, P)));
	for (let e of r.bones) if (n.has(_(r, e.name))) throw h("physics.ragdoll.armature", r.id, `an armature whose bones have no motion translation or rotation track, but ${e.name} has one; pick the track or the ragdoll`);
	return Y(i, t), i;
}
function Y(e, t) {
	let n = t.armatures.find((t) => t.id === e.armature), r = new Map(t.nodes.map((e) => [e.id, e])), i = v(n.id, r), a = g(n), o = n.bones.map((e, t) => {
		let o = _(n, e.name);
		return {
			id: o,
			parentId: e.parent === null ? null : _(n, e.parent),
			worldMatrix: v(o, r),
			parentWorldMatrix: v(r.get(o).parent, r),
			tail: Array.from(p(c(), a[t], i))
		};
	}), { armature: s, ...l } = e;
	return D(o, l);
}
function Ie(e, t) {
	if (e == null) return null;
	U(e, Ae, "physics");
	let n = W(e.duration, "physics.duration", .1, M), r = new Map(t.nodes.map((e) => [e.id, e])), i = new Set((t.motion?.tracks ?? []).filter((e) => e.kind === "node" && (e.property === "translation" || e.property === "rotation")).map((e) => e.id)), a = /* @__PURE__ */ new Set(), o = q(e.bodies ?? [], be, "physics.bodies").map((e, t) => je(e, r, i, a, `physics.bodies[${t}]`));
	if (!o.length && e.ragdoll === void 0) throw h("physics.bodies", [], "at least one body, such as [{ \"node\": \"crate\" }]; use physics null to clear it");
	let s = {
		duration: n,
		bodies: o
	};
	e.ragdoll !== void 0 && (s.ragdoll = Fe(e.ragdoll, t, i)), e.gravity !== void 0 && (s.gravity = G(e.gravity, 3, "physics.gravity"));
	let c = /* @__PURE__ */ new Set();
	if (e.joints !== void 0 && (s.joints = q(e.joints, N, "physics.joints").map((e, t) => {
		let n = Ne(e, a, c, `physics.joints[${t}]`);
		return c.add(n.name ?? `joint-${t}`), n;
	})), e.events !== void 0) {
		let t = new Map(o.map((e) => [e.node, e.type]));
		s.events = q(e.events, Ce, "physics.events").map((e, r) => Pe(e, n, t, c, `physics.events[${r}]`));
	}
	return e.fields !== void 0 && (s.fields = ae(e.fields, "physics.fields")), s;
}
function Le(e, t) {
	let n = [
		Infinity,
		Infinity,
		Infinity
	], r = [
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let i = 0; i < e.length; i += 3) for (let a = 0; a < 3; a++) {
		let o = e[i + a] * t[a];
		n[a] = Math.min(n[a], o), r[a] = Math.max(r[a], o);
	}
	return {
		center: n.map((e, t) => (e + r[t]) / 2),
		halfExtents: n.map((e, t) => Math.max((r[t] - e) / 2, 1e-4))
	};
}
function Re(e, t, n) {
	if (e.length / 3 > L) throw h(`nodes[${n}].geometry`, `${e.length / 3} vertices`, `at most ${L} vertices for a convex collider; use shape box or a coarser geometry, such as shape "box"`);
	let r = /* @__PURE__ */ new Map();
	for (let i = 0; i < e.length; i += 3) {
		let a = [
			e[i] * t[0],
			e[i + 1] * t[1],
			e[i + 2] * t[2]
		];
		if (r.set(a.map((e) => e.toFixed(5)).join(","), a), r.size > I) throw h(`nodes[${n}].geometry`, `more than ${I} distinct vertices`, `at most ${I} distinct vertices for a convex collider; use shape box or a coarser geometry, such as shape "box"`);
	}
	return [...r.values()].flat();
}
function ze(e, t, n) {
	let r = e.indices.length / 3;
	if (r > F) throw h(`nodes[${n}].geometry`, `${r} triangles`, `at most ${F} triangles for a trimesh collider; use a coarser geometry or shape box, such as shape "box"`);
	let i = [];
	for (let n = 0; n < e.positions.length; n += 3) i.push(e.positions[n] * t[0], e.positions[n + 1] * t[1], e.positions[n + 2] * t[2]);
	return {
		vertices: i,
		indices: Array.from(e.indices)
	};
}
function Be(e, t, n) {
	let { center: r, halfExtents: i } = Le(n.positions, t.scale);
	if (e.shape === "box") return {
		shape: "cuboid",
		halfExtents: i,
		translation: r
	};
	if (e.shape === "ball") return {
		shape: "ball",
		radius: Math.max(...i),
		translation: r
	};
	if (e.shape === "capsule") {
		let e = Math.max(i[0], i[2]);
		return {
			shape: "capsule",
			radius: e,
			halfHeight: Math.max(i[1] - e, e * .01),
			translation: r
		};
	}
	if (e.shape === "cylinder" || e.shape === "cone") {
		let t = Math.max(i[0], i[2]);
		return {
			shape: e.shape,
			radius: t,
			halfHeight: i[1],
			translation: r
		};
	}
	return e.shape === "convex" ? {
		shape: "convexHull",
		points: Re(n.positions, t.scale, t.id)
	} : {
		shape: "trimesh",
		...ze(n, t.scale, t.id)
	};
}
function Ve(e) {
	return e.reduce((e, t) => e | 1 << t, 0);
}
function He(e, t, n, r) {
	let i = new Map(t.nodes.map((e) => [e.id, e])), a = {
		bodies: [],
		colliders: [],
		joints: []
	};
	e.gravity && (a.gravity = e.gravity);
	for (let t of e.bodies) {
		let e = i.get(t.node);
		a.bodies.push({
			name: e.id,
			type: t.type,
			translation: e.translation,
			rotation: e.rotation,
			...t.velocity ? { linearVelocity: t.velocity } : {},
			...t.angularVelocity ? { angularVelocity: t.angularVelocity } : {}
		});
		let r = {
			body: e.id,
			...t.sensor ? { sensor: !0 } : {},
			...t.friction === void 0 ? {} : { friction: t.friction },
			...t.restitution === void 0 ? {} : { restitution: t.restitution },
			groups: 1 << (t.layer ?? 0),
			mask: t.collidesWith ? Ve(t.collidesWith) : 65535
		};
		if (t.shape === "compound") t.shapes.forEach((n, i) => {
			let o = n.shape === "box" ? "cuboid" : n.shape, s = {
				name: i === 0 ? e.id : `${e.id}#${i}`,
				...r,
				...n,
				shape: o
			};
			t.mass === void 0 ? s.density = t.density ?? 1 : s.mass = t.mass / t.shapes.length, a.colliders.push(s);
		});
		else {
			let i = {
				name: e.id,
				...r,
				...Be(t, e, n.get(e.geometry))
			};
			i.shape !== "trimesh" && (t.mass === void 0 ? i.density = t.density ?? 1 : i.mass = t.mass), a.colliders.push(i);
		}
	}
	return r && (a.bodies.push(...r.definition.bodies), a.colliders.push(...r.definition.colliders), a.joints.push(...r.definition.joints)), (e.joints ?? []).forEach((e, t) => a.joints.push({
		name: e.name ?? `joint-${t}`,
		...e
	})), e.events && (a.events = e.events), e.fields && (a.fields = e.fields), a;
}
var X = (e, t) => Number((e * t).toFixed(3)), Ue = (e) => Array.from(e, (e) => Number(e.toFixed(4)));
function We(e, t) {
	let n = new Set(t.bodies.filter((e) => e.sensor).map((e) => e.node)), r = /* @__PURE__ */ new Map(), i = [];
	for (let t of e.contactEvents) {
		let a = e.colliderNames[t.colliderA], o = e.colliderNames[t.colliderB];
		if (t.kind === "sensor") {
			if (i.length < Se) {
				let r = n.has(a) ? a : o;
				i.push({
					sensor: r,
					other: r === a ? o : a,
					kind: t.started ? "enter" : "leave",
					time: X(t.frame, e.timestep)
				});
			}
			continue;
		}
		let s = [a, o].sort().join("|"), c = r.get(s) ?? {
			a: a < o ? a : o,
			b: a < o ? o : a,
			firstTime: X(t.frame, e.timestep),
			touching: 0,
			count: 0
		};
		c.touching += t.started ? 1 : -1, c.count += +!!t.started, r.set(s, c);
	}
	return {
		contacts: [...r.values()].slice(0, xe).map(({ a: e, b: t, firstTime: n, touching: r, count: i }) => ({
			a: e,
			b: t,
			firstTime: n,
			count: i,
			touchingAtEnd: r > 0
		})),
		sensorEvents: i
	};
}
function Ge(e, t) {
	let n = e.sample(e.duration), r = e.sample(Math.max(0, e.duration - e.timestep));
	return t.bodies.map((t) => {
		let i = e.bodyIndex(t.node) * 7, a = Array.from(n.subarray(i, i + 3)), o = Math.hypot(...a.map((e, t) => e - r[i + t])) / e.timestep, s = e.restFrames[e.bodyIndex(t.node)];
		return {
			node: t.node,
			type: t.type,
			shape: t.shape,
			finalPosition: Ue(a),
			finalSpeed: Number(o.toFixed(4)),
			...t.type === "dynamic" ? { restsAtTime: s < 0 ? null : X(s, e.timestep) } : {}
		};
	});
}
function Ke(e, t) {
	let n = e.nodes.filter((t) => e.physics.bodies.some((e) => e.node === t.id)), r = e.physics.ragdoll ? [e.nodes, e.armatures] : null;
	return JSON.stringify([
		e.physics,
		n,
		n.map((e) => t.get(e.geometry).signature),
		r
	]);
}
function qe(e, t, n) {
	let r = e.ragdoll ? Y(e.ragdoll, t) : null, i = He(e, t, n, r), a = Math.round(e.duration * j) + 1, o = C(i, {
		frameCount: a,
		timestep: 1 / j,
		maxColliderTriangles: F,
		maxHullPoints: I
	}), s = new Map(e.bodies.map((e) => [e.node, {
		translation: /* @__PURE__ */ new Float64Array(3),
		rotation: /* @__PURE__ */ new Float64Array(4)
	}])), c = r ? O(r) : /* @__PURE__ */ new Map();
	for (let [e, t] of c) s.set(e, t);
	let l = new Float32Array(o.bodyNames.length * 7), u = (e) => {
		let t = o.bodyIndex(e) * 7;
		return {
			translation: l.subarray(t, t + 3),
			rotation: l.subarray(t + 3, t + 7)
		};
	}, d = null;
	return Object.freeze({
		duration: e.duration,
		sample(e) {
			o.sample(e, l), r?.writePatches(u, c);
			for (let [e, t] of s) {
				if (c.has(e)) continue;
				let n = o.bodyIndex(e) * 7;
				t.translation.set(l.subarray(n, n + 3)), t.rotation.set(l.subarray(n + 3, n + 7));
			}
			return s;
		},
		report() {
			return d ??= {
				duration: e.duration,
				frames: o.frameCount,
				gravity: e.gravity ?? [
					0,
					-9.81,
					0
				],
				bodies: Ge(o, e),
				...We(o, e),
				eventsTruncated: o.contactEventsTruncated,
				...r ? { ragdoll: A(r, o) } : {}
			}, structuredClone(d);
		}
	});
}
var Je = [
	"duration",
	"gravity",
	"floor",
	"ragdoll"
], Z = 200, Q = .5;
function Ye(e) {
	U(e, Je, "physics");
	let t = { duration: W(e.duration, "physics.duration", .1, M) };
	if (e.gravity !== void 0 && (t.gravity = G(e.gravity, 3, "physics.gravity")), e.floor !== void 0 && (t.floor = W(e.floor, "physics.floor", -1e6, 1e6)), e.ragdoll === void 0) throw h("physics.ragdoll", e.ragdoll, "a ragdoll section, such as {}; it is what moves the asset joints", TypeError);
	U(e.ragdoll, H.filter((e) => e !== "armature"), "physics.ragdoll");
	let n = {};
	for (let [t, r, i] of [
		[
			"density",
			1e-6,
			1e9
		],
		[
			"friction",
			0,
			100
		],
		[
			"restitution",
			0,
			1
		]
	]) e.ragdoll[t] !== void 0 && (n[t] = W(e.ragdoll[t], `physics.ragdoll.${t}`, r, i));
	return e.ragdoll.layer !== void 0 && (n.layer = Math.trunc(W(e.ragdoll.layer, "physics.ragdoll.layer", 0, P))), {
		...t,
		ragdoll: n
	};
}
function $(e, n, i, a, o) {
	if (a.has(e.id)) return a.get(e.id);
	let s = e.parent === null ? o : $(n.get(e.parent), n, i, a, o), c = t(r(), s, i.get(e.id));
	return a.set(e.id, c), c;
}
function Xe(e, t) {
	let n = e.parent === null ? void 0 : t.get(e.parent);
	for (; n && !n.joint;) n = n.parent === null ? void 0 : t.get(n.parent);
	return n?.id ?? null;
}
function Ze(t, n, a) {
	let o = new Map(t.map((e) => [e.id, e])), s = new Map(n.map((e) => [e.id, i(r(), e.rotation, e.translation, e.scale)])), l = /* @__PURE__ */ new Map(), u = t.filter((e) => e.joint), d = u.find((e) => !e.editable);
	if (d) throw h("physics.ragdoll", d.id, "an asset whose joints can all be edited, but this one is mirrored or sheared so a ragdoll cannot drive it; remove the ragdoll or use another asset");
	let f = (e) => e.parent === null ? 0 : 1 + f(o.get(e.parent)), p = u.map((e) => ({
		node: e,
		depth: f(e)
	})).sort((e, t) => e.depth - t.depth).map((e) => e.node), m = new Map(p.map((e) => [e.id, $(e, o, s, l, a)])), _ = { bones: p.map((t) => ({
		name: t.id,
		parent: Xe(t, o),
		head: Array.from(e(c(), m.get(t.id)))
	})) }, v = g(_);
	return p.map((e, t) => ({
		id: e.id,
		parentId: _.bones[t].parent,
		worldMatrix: m.get(e.id),
		tail: v[t],
		parentWorldMatrix: e.parent === null ? a : $(o.get(e.parent), o, s, l, a)
	}));
}
function Qe(e, t, n, r) {
	let i = D(Ze(t, n, r), e.ragdoll), a = {
		bodies: [{
			name: "ragdoll-floor",
			type: "fixed",
			translation: [
				0,
				(e.floor ?? 0) - Q,
				0
			]
		}, ...i.definition.bodies],
		colliders: [{
			name: "ragdoll-floor",
			body: "ragdoll-floor",
			shape: "cuboid",
			halfExtents: [
				Z,
				Q,
				Z
			]
		}, ...i.definition.colliders],
		joints: i.definition.joints,
		...e.gravity ? { gravity: e.gravity } : {}
	}, o = Math.round(e.duration * j) + 1, s = C(a, {
		frameCount: o,
		timestep: 1 / j,
		maxColliderTriangles: F,
		maxHullPoints: I
	}), c = O(i), l = new Float32Array(s.bodyNames.length * 7), u = (e) => {
		let t = s.bodyIndex(e) * 7;
		return {
			translation: l.subarray(t, t + 3),
			rotation: l.subarray(t + 3, t + 7)
		};
	};
	return Object.freeze({
		duration: e.duration,
		sample(e) {
			return s.sample(e, l), i.writePatches(u, c), c;
		},
		report() {
			return {
				duration: e.duration,
				frames: s.frameCount,
				gravity: e.gravity ?? [
					0,
					-9.81,
					0
				],
				ragdoll: A(i, s)
			};
		}
	});
}
export { qe as bakeAgentPhysics, Qe as bakeAssetRagdoll, re as loadPhysicsEngine, oe as needsPhysics, Ie as normalizeAgentPhysics, Ye as normalizeAssetPhysics, Ke as physicsBakeKey, w as physicsEngineLoaded, ie as setPhysicsModuleLoader };
