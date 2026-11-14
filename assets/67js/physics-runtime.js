/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { o as e } from "./mat4-BCZClxna.js";
import { f as t, n } from "./quat-Bl7gjwWK.js";
import { applyForceFieldImpulses as r, createRapierWorld as i, loadPhysicsEngine as a, prepareLivePhysics as o, requireRapier as s } from "./physics.js";
// src/physics-runtime.js
var c = Object.freeze({
	maximumListeners: 64,
	maximumBindings: 4096,
	maximumOverlaps: 1024,
	maximumQueryDistance: 1e6
}), l = [
	"ball",
	"cuboid",
	"capsule"
], u = 65535, d = 1e-9, f = 7;
function p(e) {
	return e === null ? "null" : typeof e;
}
function m(e, t, n) {
	if (!(Array.isArray(e) || ArrayBuffer.isView(e)) || e.length !== t || !Array.from(e).every(Number.isFinite)) throw TypeError(`${n} must be an array of ${t} finite numbers, got ${Array.isArray(e) ? JSON.stringify(e) : p(e)}.`);
	return Array.from(e);
}
function h(e, t) {
	let n = m(e, 3, t), r = Math.hypot(...n);
	if (!(r > 0)) throw RangeError(`${t} must not be the zero vector; pass a direction such as [0, -1, 0].`);
	return n.map((e) => e / r);
}
function g(e, t) {
	if (typeof e != "number" || !(e > 0) || e > c.maximumQueryDistance) throw RangeError(`${t} must be a number above 0 and up to ${c.maximumQueryDistance}, got ${String(e)}.`);
	return e;
}
function _(e, t) {
	if (typeof e != "number" || !Number.isFinite(e) || e <= 0) throw RangeError(`${t} must be a number above 0, got ${String(e)}.`);
	return e;
}
function v(e, t) {
	if (typeof e != "object" || !e || !l.includes(e.type)) {
		let n = typeof e != "object" || !e ? p(e) : String(e.type);
		throw TypeError(`${t} must be { type: ${l.map((e) => `"${e}"`).join(" | ")}, ... }, got ${n}.`);
	}
	if (e.type === "ball") return {
		type: "ball",
		radius: _(e.radius, `${t}.radius`)
	};
	if (e.type === "capsule") return {
		type: "capsule",
		halfHeight: _(e.halfHeight, `${t}.halfHeight`),
		radius: _(e.radius, `${t}.radius`)
	};
	let n = m(e.halfExtents, 3, `${t}.halfExtents`);
	return n.forEach((e, n) => _(e, `${t}.halfExtents[${n}]`)), {
		type: "cuboid",
		halfExtents: n
	};
}
function y(e, t) {
	if (e === void 0) return [
		0,
		0,
		0,
		1
	];
	let n = m(e, 4, t), r = Math.hypot(...n);
	if (!(r > 0)) throw RangeError(`${t} must not be the zero quaternion; pass [x, y, z, w] such as [0, 0, 0, 1].`);
	return n.map((e) => e / r);
}
var b = (e) => ({
	x: e[0],
	y: e[1],
	z: e[2]
}), x = (e) => ({
	...b(e),
	w: e[3]
}), S = Object.freeze({
	name: "rapier",
	load: a,
	createWorld(e) {
		let t = s(), { world: n, bodies: a, colliderIndices: o } = i(t, e), l = new t.EventQueue(!0);
		function u(e) {
			return [
				e.includeSensors ? void 0 : t.QueryFilterFlags.EXCLUDE_SENSORS,
				(-65536 | e.mask) >>> 0,
				void 0,
				e.excludeBody === void 0 ? void 0 : a[e.excludeBody]
			];
		}
		function d(e) {
			return e.type === "ball" ? new t.Ball(e.radius) : e.type === "capsule" ? new t.Capsule(e.halfHeight, e.radius) : new t.Cuboid(...e.halfExtents);
		}
		return {
			step(t, i) {
				n.timestep = t, e.fields.length && r({
					...e,
					timestep: t
				}, a, i), n.step(l);
			},
			readPose(e, t) {
				let n = a[e].translation(), r = a[e].rotation();
				t[0] = n.x, t[1] = n.y, t[2] = n.z, t[3] = r.x, t[4] = r.y, t[5] = r.z, t[6] = r.w;
			},
			setKinematicPose(e, t, n) {
				t && a[e].setNextKinematicTranslation(b(t)), n && a[e].setNextKinematicRotation(x(n));
			},
			setLinearVelocity(e, t) {
				a[e].setLinvel(b(t), !0);
			},
			applyImpulse(e, t, n) {
				n ? a[e].applyImpulseAtPoint(b(t), b(n), !0) : a[e].applyImpulse(b(t), !0);
			},
			drainEvents(e) {
				l.drainCollisionEvents((t, n, r) => {
					e(o.get(t), o.get(n), r);
				});
			},
			raycast(e, r, i, a) {
				let s = new t.Ray(b(e), b(r)), c = n.castRayAndGetNormal(s, i, !0, ...u(a));
				return c ? {
					collider: o.get(c.collider.handle),
					distance: c.timeOfImpact,
					normal: [
						c.normal.x,
						c.normal.y,
						c.normal.z
					]
				} : null;
			},
			shapeCast(e, t, r, i, a, s) {
				let c = n.castShape(b(t), x(r), b(i), d(e), 0, a, !0, ...u(s));
				return c ? {
					collider: o.get(c.collider.handle),
					distance: c.time_of_impact,
					normal: [
						c.normal1.x,
						c.normal1.y,
						c.normal1.z
					]
				} : null;
			},
			overlap(e, t, r, i) {
				let a = [];
				return n.intersectionsWithShape(b(t), x(r), d(e), (e) => (a.push(o.get(e.handle)), a.length < c.maximumOverlaps), ...u(i)), a;
			},
			free() {
				l.free(), n.free();
			}
		};
	}
});
function C(e) {
	if (typeof e != "object" || !e || typeof e.createWorld != "function" || typeof e.name != "string") throw TypeError("createPhysicsSystem adapter must be an object like { name, load?(), createWorld(prepared) }, such as rapierAdapter.");
	return e;
}
function w(e, t) {
	if (typeof e != "object" || !e) throw TypeError("A physics query options value must be an object like { mask, excludeBody, includeSensors } or left out.");
	let n = e.mask ?? u;
	if (!Number.isInteger(n) || n < 0 || n > u) throw RangeError(`A physics query mask must be an integer from 0 to ${u}, got ${String(e.mask)}.`);
	let r;
	if (e.excludeBody !== void 0 && (r = t.get(e.excludeBody), r === void 0)) throw RangeError(`A physics query excludeBody names no body: "${String(e.excludeBody)}". Present: ${[...t.keys()].join(", ")}.`);
	return {
		mask: n,
		excludeBody: r,
		includeSensors: e.includeSensors === !0
	};
}
function T(e) {
	return [
		Math.hypot(e[0], e[1], e[2]),
		Math.hypot(e[4], e[5], e[6]),
		Math.hypot(e[8], e[9], e[10])
	];
}
async function E(r, i = {}) {
	if (typeof i != "object" || !i) throw TypeError("createPhysicsSystem options must be an object or left out.");
	let { adapter: a, name: s, bindings: l, ...u } = i, _ = C(a ?? S), b = u.timestep ?? 1 / 60, x = o(r, {
		...u,
		timestep: b
	});
	await _.load?.();
	let E = _.createWorld(x), D = Object.freeze(x.bodies.map((e) => e.name)), O = new Map(D.map((e, t) => [e, t])), k = new Float32Array(D.length * f), A = new Float32Array(D.length * f), j = [], M = {
		contact: /* @__PURE__ */ new Set(),
		sensor: /* @__PURE__ */ new Set()
	}, N = [], P = !1, F = 0, I = !1;
	function L() {
		for (let e = 0; e < D.length; e++) E.readPose(e, A.subarray(e * f, (e + 1) * f));
	}
	function R(e) {
		try {
			return e();
		} catch (e) {
			throw E.free(), e;
		}
	}
	function z() {
		for (let e = 0; e < D.length; e++) {
			let t = e * f, n = 0;
			for (let r = 0; r < f; r++) {
				let i = A[t + r];
				if (!Number.isFinite(i)) throw RangeError(`Body "${D[e]}" has a non-finite pose at step ${F}. Apply smaller velocities and impulses.`);
				r >= 3 && (n += i * i);
			}
			if (Math.abs(Math.sqrt(n) - 1) > .001) throw RangeError(`Body "${D[e]}" has a non-unit rotation at step ${F}. Apply smaller velocities and impulses.`);
		}
	}
	R(() => {
		L(), z(), k.set(A);
	});
	function B() {
		if (I) throw Error("This physics system was disposed. Call createPhysicsSystem again.");
	}
	function V(e, t) {
		let n = O.get(e);
		if (n === void 0) throw RangeError(`${t} names no body: "${String(e)}". Present: ${D.join(", ")}.`);
		return n;
	}
	function H(e, t, n) {
		let r = V(e, t), i = x.bodies[r].type;
		if (i !== n) throw TypeError(`${t} needs a ${n} body; "${e}" is ${i}.`);
		return r;
	}
	let U = (e) => D[x.colliders[e].body];
	function W(e, t, n) {
		return {
			body: U(e.collider),
			collider: x.colliders[e.collider].name,
			distance: e.distance,
			point: t.map((t, r) => t + n[r] * e.distance),
			normal: e.normal
		};
	}
	function G() {
		let e = [];
		return P = !1, E.drainEvents((t, n, r) => {
			if (e.length >= x.maxContactEvents) {
				P = !0;
				return;
			}
			let [i, a] = t < n ? [t, n] : [n, t], o = x.colliders[i].sensor || x.colliders[a].sensor;
			e.push(Object.freeze({
				step: F,
				kind: o ? "sensor" : "contact",
				started: r,
				colliderA: i,
				colliderB: a,
				bodyA: U(i),
				bodyB: U(a)
			}));
		}), e.sort((e, t) => e.colliderA - t.colliderA || e.colliderB - t.colliderB || Number(t.started) - Number(e.started)), e;
	}
	function K(n) {
		for (let r of j) {
			let i = r.index * f;
			for (let e = 0; e < 3; e++) r.position[e] = k[i + e] + (A[i + e] - k[i + e]) * n;
			for (let e = 0; e < 4; e++) r.start[e] = k[i + 3 + e], r.end[e] = A[i + 3 + e];
			t(r.rotation, r.start, r.end, n), e(r.part.matrix, r.rotation, r.position, r.scale);
		}
	}
	function q(e, t) {
		B();
		let r = V(e, "bind"), i = t?.matrix;
		if (!(i instanceof Float32Array) || i.length !== 16) throw TypeError(`bind("${e}") needs a part with a retained Float32Array(16) matrix, got ${p(i)}.`);
		if (j.length >= c.maximumBindings) throw RangeError(`A physics system binds at most ${c.maximumBindings} parts.`);
		if (j.some((e) => e.part.matrix === i)) throw RangeError(`bind("${e}") got a part whose matrix is already bound.`);
		let a = T(i);
		if (!a.every((e) => e > 0 && Number.isFinite(e))) throw RangeError(`bind("${e}") needs a part matrix with a positive scale, such as the identity matrix.`);
		return j.push({
			part: t,
			index: r,
			scale: a,
			position: /* @__PURE__ */ new Float32Array(3),
			rotation: n(),
			start: n(),
			end: n()
		}), K(1), Y;
	}
	function J(e, t) {
		if (B(), !(e in M)) throw RangeError(`on() kind must be "contact" or "sensor", got ${String(e)}.`);
		if (typeof t != "function") throw TypeError(`on("${e}") needs a listener function, got ${p(t)}.`);
		if (M[e].size >= c.maximumListeners) throw RangeError(`A physics system holds at most ${c.maximumListeners} listeners per kind.`);
		return M[e].add(t), () => M[e].delete(t);
	}
	let Y = {
		name: s ?? "physics",
		adapter: _.name,
		timestep: b,
		bodyNames: D,
		get stepCount() {
			return F;
		},
		get events() {
			return N;
		},
		get eventsTruncated() {
			return P;
		},
		on: J,
		bind: q,
		fixedUpdate(e, t) {
			if (B(), Math.abs(e - b) > d * Math.max(1, b)) throw RangeError(`The runtime fixed step is ${e} s but this physics system was built with timestep ${b} s. Create the runtime with fixedStepSeconds: physics.timestep, or pass timestep: ${e} to createPhysicsSystem.`);
			E.step(e, F * e), F += 1, [k, A] = [A, k], L(), z(), N = G(), t?.mode !== "both" && K(1);
			for (let e of N) for (let t of M[e.kind]) t(e);
		},
		update(e, t) {
			t?.mode === "both" && K(t.alpha);
		},
		dispose() {
			I || (I = !0, E.free(), j.length = 0);
		},
		setKinematicPose(e, t) {
			B();
			let n = H(e, "setKinematicPose", "kinematic");
			if (typeof t != "object" || !t || t.translation === void 0 && t.rotation === void 0) throw TypeError("setKinematicPose needs { translation, rotation } with at least one of them.");
			let r = t.translation === void 0 ? void 0 : m(t.translation, 3, "setKinematicPose translation"), i = t.rotation === void 0 ? void 0 : y(t.rotation, "setKinematicPose rotation");
			return E.setKinematicPose(n, r, i), Y;
		},
		setLinearVelocity(e, t) {
			B();
			let n = H(e, "setLinearVelocity", "dynamic");
			return E.setLinearVelocity(n, m(t, 3, "setLinearVelocity velocity")), Y;
		},
		applyImpulse(e, t, n) {
			B();
			let r = H(e, "applyImpulse", "dynamic");
			return E.applyImpulse(r, m(t, 3, "applyImpulse impulse"), n === void 0 ? void 0 : m(n, 3, "applyImpulse point")), Y;
		},
		getPose(e) {
			B();
			let t = V(e, "getPose") * f;
			return {
				translation: Array.from(A.subarray(t, t + 3)),
				rotation: Array.from(A.subarray(t + 3, t + f))
			};
		},
		raycast(e, t, n = {}) {
			B();
			let r = m(e, 3, "raycast origin"), i = h(t, "raycast direction"), a = g(n.maxDistance ?? 1e3, "raycast maxDistance"), o = E.raycast(r, i, a, w(n, O));
			return o ? W(o, r, i) : null;
		},
		shapeCast(e, t, n, r = {}) {
			B();
			let i = v(e, "shapeCast shape"), a = m(t, 3, "shapeCast translation"), o = h(n, "shapeCast direction"), s = g(r.maxDistance ?? 1e3, "shapeCast maxDistance"), c = y(r.rotation, "shapeCast rotation"), l = E.shapeCast(i, a, c, o, s, w(r, O));
			return l ? W(l, a, o) : null;
		},
		overlap(e, t, n = {}) {
			B();
			let r = v(e, "overlap shape"), i = m(t, 3, "overlap translation"), a = y(n.rotation, "overlap rotation"), o = E.overlap(r, i, a, w(n, O));
			return [...new Set(o.map(U))].sort();
		}
	};
	return R(() => {
		for (let e of l ?? []) q(e.body, e.part);
	}), Y;
}
export { c as PHYSICS_RUNTIME_LIMITS, E as createPhysicsSystem, S as rapierAdapter };
