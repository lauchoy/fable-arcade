/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { s as e } from "./animation-CO9Tq0E0.js";
// src/animation-root-motion.js
var t = Object.freeze({
	minimumScale: 1e-6,
	maximumScale: 1e6
}), n = Object.freeze(["+z", "-z"]), r = Object.freeze([0, 0]);
function i(e, r) {
	if (typeof e != "object" || !e || Array.isArray(e)) throw TypeError(`${r} must be an object like { bone: "Root" }, got ${e === null ? "null" : typeof e}.`);
	if (typeof e.bone != "string" || !e.bone.trim()) throw TypeError(`${r}.bone must be the name of the root bone whose translation track carries the motion, such as "Root".`);
	let i = e.facing ?? "+z";
	if (!n.includes(i)) throw RangeError(`${r}.facing must be "+z" or "-z" (the way the rig faces at rest; glTF rigs face "+z"), got ${JSON.stringify(i)}.`);
	let a = e.scale ?? 1, { minimumScale: o, maximumScale: s } = t;
	if (!Number.isFinite(a) || a < o || a > s) throw RangeError(`${r}.scale must be a number from ${o} to ${s} (clip units to metres, 0.01 for a rig in centimetres), got ${String(a)}.`);
	return {
		bone: e.bone,
		layer: e.layer,
		facing: i,
		scale: a
	};
}
function a(e) {
	let t = e.keyframes[0].value[0], n = e.keyframes[0].value[2], r = e.keyframes.map((e) => {
		let r = {
			...e,
			value: [
				t,
				e.value[1],
				n
			]
		};
		return e.inTangent && (r.inTangent = [
			0,
			e.inTangent[1],
			0
		]), e.outTangent && (r.outTangent = [
			0,
			e.outTangent[1],
			0
		]), Object.freeze(r);
	});
	return Object.freeze({
		...e,
		keyframes: Object.freeze(r)
	});
}
function o(t, n) {
	let { bone: i, facing: o, scale: s } = n, c = t.tracks.find((e) => e.target === i && e.property === "translation");
	if (!c) return {
		clip: t,
		hasMotion: !1,
		displacement: () => r
	};
	let l = Object.freeze({
		duration: t.duration,
		loop: !1,
		tracks: Object.freeze([c])
	}), u = c.keyframes[0].value, d = c.keyframes[c.keyframes.length - 1].value, f = o === "+z" ? -1 : 1, p = [0, 0];
	function m(n, r = t.loop) {
		let i = r ? Math.floor(n) : 0, a = r ? n - i : Math.min(Math.max(n, 0), 1), o = e(l, a * t.duration)[0].value;
		return p[0] = f * s * (i * (d[0] - u[0]) + o[0] - u[0]), p[1] = f * s * (i * (d[2] - u[2]) + o[2] - u[2]), p;
	}
	return {
		clip: Object.freeze({
			...t,
			tracks: Object.freeze(t.tracks.map((e) => e === c ? a(c) : e))
		}),
		hasMotion: !0,
		displacement: m
	};
}
// src/animation-ik.js
var s = 1;
function c(e, t, n, r, i, a) {
	let o = n ?? r;
	if (!Number.isFinite(o) || o < i || o > a) throw RangeError(`${e} ${t} must be a number from ${i} to ${a}, got ${String(o)}.`);
	return o;
}
function l(e) {
	let t = null;
	return function(n) {
		let r = t === null ? Infinity : n - t;
		return r === 0 ? 0 : (t = n, e === 0 || r < 0 || r > s ? 1 : 1 - Math.exp(-r / e));
	};
}
function u(e = {}) {
	let t = "createFootPlacement";
	for (let [n, r] of [
		["root", "hip"],
		["middle", "knee"],
		["end", "ankle"]
	]) if (e[n] === void 0) throw TypeError(`${t} needs ${n}: the joint name of the leg's ${r}.`);
	let { groundOffset: n } = e;
	if (typeof n != "function") throw TypeError(`${t} groundOffset must be a function (footPosition) => ground height change in metres, such as foot => terrain(foot[0], foot[2]) - baseHeight, got ${n === null ? "null" : typeof n}.`);
	let r = c(t, "ankleHeight", e.ankleHeight, 0, -1e3, 1e3), i = c(t, "liftHeight", e.liftHeight, .15, 1e-6, 1e3), a = c(t, "maxAdjust", e.maxAdjust, .4, 0, 1e3), o = l(c(t, "smoothSeconds", e.smoothSeconds, .06, 0, 10)), s = 0;
	function u(e, c) {
		let l = n([
			c[0],
			c[1],
			c[2]
		]);
		if (!Number.isFinite(l)) throw RangeError(`${t} groundOffset must return a finite number, got ${String(l)}.`);
		let u = Math.max(-a, Math.min(a, l)), d = Math.min(1, Math.max(0, (c[1] - r) / i)), f = 1 - d * d * (3 - 2 * d);
		return s += (u * f - s) * o(e), [
			c[0],
			c[1] + s,
			c[2]
		];
	}
	let d = {
		type: "two-bone",
		root: e.root,
		middle: e.middle,
		end: e.end,
		target: u,
		weight: e.weight ?? 1
	};
	for (let t of [
		"pole",
		"bendToward",
		"groundNormal",
		"limits",
		"keepEndRotation"
	]) e[t] !== void 0 && (d[t] = e[t]);
	return d;
}
function d(e = {}) {
	let t = "createLookAt";
	if (!Array.isArray(e.joints) || e.joints.length === 0) throw TypeError(`${t} needs joints: bone names from the base of the chain to the aiming joint, such as ["neck", "head"].`);
	let n = Array.isArray(e.target) && e.target.length === 3 && e.target.every(Number.isFinite);
	if (!n && typeof e.target != "function") throw TypeError(`${t} target must be a point [x, y, z] or a function (time, current) => [x, y, z].`);
	let r = c(t, "maxAngle", e.maxAngle, 70, 1e-6, 180), i = l(c(t, "smoothSeconds", e.smoothSeconds, .1, 0, 10)), a = [
		0,
		0,
		0
	];
	function o(r, o) {
		let s = n ? e.target : e.target(r, o);
		if (!Array.isArray(s) || s.length !== 3 || !s.every(Number.isFinite)) throw RangeError(`${t} target must return three finite numbers, got ${JSON.stringify(s)}.`);
		let c = i(r);
		for (let e = 0; e < 3; e++) a[e] += (s[e] - a[e]) * c;
		return [
			a[0],
			a[1],
			a[2]
		];
	}
	let s = {
		type: "aim",
		joints: e.joints,
		maxAngle: r,
		target: o,
		weight: e.weight ?? 1
	};
	return e.forward !== void 0 && (s.forward = e.forward), e.worldForward !== void 0 && (s.worldForward = e.worldForward), s;
}
// src/npc-follower.js
var f = Object.freeze({
	maximumWaypoints: 256,
	maximumSpeed: 100
}), p = Object.freeze({
	parameter: "speed",
	cruiseSpeed: 2.2,
	acceleration: 6,
	turnRate: 6,
	arrivalRadius: .1,
	slowRadius: 1,
	cornerRadius: .2,
	cornerSlowDistance: 1.5,
	minimumSpeed: .3
}), m = 1e-9;
function h(e) {
	return typeof e == "string" ? JSON.stringify(e) : Array.isArray(e) ? `an array of ${e.length}` : e === null ? "null" : typeof e == "object" ? "an object" : String(e);
}
function g(e, t, n, r = Infinity) {
	let i = e ?? t;
	if (!Number.isFinite(i) || i <= 0 || i > r) throw RangeError(`createPathFollower ${n} must be a number above 0${r < Infinity ? ` and at most ${r}` : ""}, got ${h(e)}.`);
	return i;
}
function _(e, t) {
	if (!Array.isArray(e) || e.length !== 2 && e.length !== 3 || !e.every(Number.isFinite)) throw TypeError(`follower path point ${t} must be [x, z] or [x, y, z] in metres, got ${h(e)}.`);
	return e.length === 2 ? [
		e[0],
		null,
		e[1]
	] : [
		e[0],
		e[1],
		e[2]
	];
}
function v(e) {
	let t = Array.isArray(e) ? e : e?.points;
	if (!Array.isArray(t) || t.length < 1 || t.length > f.maximumWaypoints) throw RangeError(`follower.follow needs a list of 1 to ${f.maximumWaypoints} points, or the { points } of navmesh.findPath, got ${h(e)}.`);
	return t.map(_);
}
function y(e) {
	return Math.atan2(Math.sin(e), Math.cos(e));
}
function b(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
function x(e = {}) {
	let { graph: t, navmesh: n } = e;
	if (!t || typeof t.set != "function" || !("rootMotion" in t)) throw TypeError("createPathFollower graph must be an animation graph from createAnimationGraph, such as createPathFollower({ graph, position: [0, 0, 0] }).");
	let r = e.position ?? [
		0,
		0,
		0
	];
	if (!Array.isArray(r) || r.length !== 3 || !r.every(Number.isFinite)) throw TypeError(`createPathFollower position must be [x, y, z] in metres, got ${h(r)}.`);
	if (e.yaw !== void 0 && !Number.isFinite(e.yaw)) throw TypeError(`createPathFollower yaw must be a number in radians, got ${h(e.yaw)}.`);
	if (n !== void 0 && (typeof n?.isWalkable != "function" || typeof n.findPath != "function")) throw TypeError("createPathFollower navmesh must come from createNavmesh (it needs isWalkable, heightAt and findPath).");
	let i = {
		parameter: e.parameter ?? p.parameter,
		cruiseSpeed: g(e.cruiseSpeed, p.cruiseSpeed, "cruiseSpeed", f.maximumSpeed),
		acceleration: g(e.acceleration, p.acceleration, "acceleration"),
		turnRate: g(e.turnRate, p.turnRate, "turnRate"),
		arrivalRadius: g(e.arrivalRadius, p.arrivalRadius, "arrivalRadius"),
		slowRadius: g(e.slowRadius, p.slowRadius, "slowRadius"),
		cornerRadius: g(e.cornerRadius, p.cornerRadius, "cornerRadius"),
		cornerSlowDistance: g(e.cornerSlowDistance, p.cornerSlowDistance, "cornerSlowDistance"),
		minimumSpeed: g(e.minimumSpeed, p.minimumSpeed, "minimumSpeed")
	};
	if (i.minimumSpeed > i.cruiseSpeed) throw RangeError("createPathFollower minimumSpeed must not exceed cruiseSpeed.");
	t.rootMotion, t.get(i.parameter);
	let a = {
		position: [...r],
		yaw: e.yaw ?? 0,
		speed: 0,
		status: "idle",
		waypointIndex: 0,
		blockedSteps: 0,
		lastMove: 0
	}, o = [];
	function s(e, t, r) {
		return n?.heightAt?.(e, t) ?? r;
	}
	function c(e) {
		return Math.hypot(e[0] - a.position[0], e[2] - a.position[2]);
	}
	function l(e) {
		if (e + 1 >= o.length) return 0;
		let t = o[e - 1], n = o[e], r = o[e + 1], i = Math.atan2(n[0] - t[0], n[2] - t[2]), a = Math.atan2(r[0] - n[0], r[2] - n[2]);
		return Math.abs(y(a - i));
	}
	function u(e) {
		let t = a.waypointIndex, n = t === o.length - 1, r = i.cruiseSpeed;
		if (n) r = Math.min(r, i.cruiseSpeed * c(o[t]) / i.slowRadius);
		else {
			let e = l(t) / Math.PI, n = i.cruiseSpeed * (1 - e), a = b(c(o[t]) / i.cornerSlowDistance, 0, 1);
			r = Math.min(r, n + (i.cruiseSpeed - n) * a);
		}
		return r = Math.max(r, i.minimumSpeed), r * b(Math.cos(e), 0, 1);
	}
	function d() {
		a.status = "arrived", a.speed = 0, t.set(i.parameter, 0);
	}
	function _(e) {
		let t = o[e - 1], n = o[e], r = n[0] - t[0], i = n[2] - t[2];
		return (n[0] - a.position[0]) * r + (n[2] - a.position[2]) * i <= 0;
	}
	function x() {
		for (; a.waypointIndex < o.length;) {
			let e = o[a.waypointIndex];
			if (a.waypointIndex === o.length - 1) return c(e) > i.arrivalRadius || (d(), !1);
			if (c(e) > i.cornerRadius && !_(a.waypointIndex)) return !0;
			a.waypointIndex += 1;
		}
		return !1;
	}
	function S(e) {
		let n = o[a.waypointIndex], r = Math.atan2(n[0] - a.position[0], -(n[2] - a.position[2])), s = y(r - a.yaw), c = i.turnRate * e;
		a.yaw = y(a.yaw + b(s, -c, c));
		let l = u(y(r - a.yaw)), d = i.acceleration * e;
		a.speed += b(l - a.speed, -d, d), t.set(i.parameter, a.speed);
	}
	function C() {
		let e = t.rootMotion.delta, r = Math.sin(a.yaw), i = -Math.cos(a.yaw), o = Math.cos(a.yaw), c = Math.sin(a.yaw), l = o * e[0] - r * e[1], u = c * e[0] - i * e[1], [d, f, p] = a.position, h = [
			[l, u],
			[l, 0],
			[0, u]
		];
		a.lastMove = 0;
		for (let [e, t] of h) {
			let r = d + e, i = p + t;
			if (!(n && !n.isWalkable(r, i) || Math.hypot(e, t) < m)) {
				a.position = [
					r,
					s(r, i, f),
					i
				], a.lastMove = Math.hypot(e, t), (e !== l || t !== u) && (a.blockedSteps += 1);
				return;
			}
		}
		Math.hypot(l, u) >= m && (a.blockedSteps += 1);
	}
	let w = {
		state: a,
		follow(e) {
			let t = v(e).map((e) => [
				e[0],
				e[1] ?? a.position[1],
				e[2]
			]);
			return o = [[...a.position], ...t], a.waypointIndex = 1, a.status = "moving", a.blockedSteps = 0, w;
		},
		goTo(e) {
			if (!n) throw TypeError("follower.goTo needs the navmesh option, such as createPathFollower({ graph, navmesh }). Use follower.follow(points) for any other path.");
			let t = n.findPath([a.position[0], a.position[2]], e, { spacing: 1e6 });
			return w.follow(t);
		},
		stop() {
			return o = [], a.status = "idle", a.speed = 0, t.set(i.parameter, 0), w;
		},
		step(e) {
			if (!Number.isFinite(e) || e <= 0) throw RangeError(`follower.step stepSeconds must be a number above 0, got ${h(e)}.`);
			return a.lastMove = 0, a.status === "moving" && (C(), x() && S(e)), w;
		},
		system({ name: e = "npc-follower" } = {}) {
			return {
				name: e,
				fixedUpdate(e) {
					w.step(e);
				},
				update(e, t) {
					t.mode === "variable" && w.step(e);
				}
			};
		}
	};
	return w;
}
// src/animation-graph.js
var S = Object.freeze({
	maximumFadingStates: 4,
	maximumParameters: 64,
	maximumLayers: 8,
	maximumStates: 64,
	maximumTransitions: 256,
	maximumConditions: 8,
	maximumMotions: 16,
	maximumFadeSeconds: 10,
	maximumDeltaSeconds: 10
}), C = [
	"number",
	"boolean",
	"trigger"
], w = {
	greater: (e, t) => e > t,
	atLeast: (e, t) => e >= t,
	less: (e, t) => e < t,
	atMost: (e, t) => e <= t,
	equals: (e, t) => e === t,
	notEquals: (e, t) => e !== t
}, T = 1e-9;
function E(e) {
	return e === null ? "null" : typeof e;
}
function D(e, t) {
	if (typeof e != "string" || e === "") throw TypeError(`${t} must be a non-empty string, got ${E(e)}.`);
	return e;
}
function O(e, t) {
	if (typeof e != "object" || !e || Array.isArray(e)) throw TypeError(`${t} must be an object, got ${Array.isArray(e) ? "array" : E(e)}.`);
	return e;
}
function k(e, t, n) {
	if (!Array.isArray(e) || e.length === 0 || e.length > n) throw RangeError(`${t} must be an array of 1 to ${n} entries.`);
	return e;
}
function A(e, t, n = -Infinity, r = Infinity) {
	if (!Number.isFinite(e) || e < n || e > r) {
		let i = n === -Infinity && r === Infinity ? "a finite number" : `a number from ${n} to ${r}`;
		throw RangeError(`${t} must be ${i}, got ${String(e)}.`);
	}
	return e;
}
function j(e, t) {
	O(e, "createAnimationGraph clips");
	let n = /* @__PURE__ */ new Map();
	for (let [r, i] of Object.entries(e)) {
		let e = `createAnimationGraph clips.${r}`;
		O(i, e), A(i.duration, `${e}.duration`, 1e-6);
		let a = t && Array.isArray(i.tracks) ? o(i, t) : null;
		n.set(r, {
			name: r,
			clip: a ? a.clip : i,
			duration: i.duration,
			loop: i.loop === !0,
			rootMotion: a?.hasMotion ? a : null
		});
	}
	return n;
}
function M(e) {
	O(e, "createAnimationGraph parameters");
	let t = Object.entries(e);
	if (t.length > S.maximumParameters) throw RangeError(`createAnimationGraph holds at most ${S.maximumParameters} parameters. Merge some.`);
	let n = /* @__PURE__ */ new Map();
	for (let [e, r] of t) {
		let t = `createAnimationGraph parameters.${e}`;
		if (O(r, t), !C.includes(r.type)) throw TypeError(`${t}.type must be one of ${C.join(", ")}, got ${String(r.type)}.`);
		let i = r.type !== "boolean" && 0;
		if (r.type === "number" && (i = A(r.initial ?? 0, `${t}.initial`)), r.type === "boolean" && (i = r.initial ?? !1, typeof i != "boolean")) throw TypeError(`${t}.initial must be a boolean, got ${E(i)}.`);
		r.type === "trigger" && (i = !1), n.set(e, {
			name: e,
			type: r.type,
			initial: i,
			value: i
		});
	}
	return n;
}
function N(e, t, n) {
	let r = e.get(t);
	if (!r) throw RangeError(`${n} names parameter "${String(t)}", which is not declared. Declared: ${[...e.keys()].join(", ") || "none"}.`);
	return r;
}
function P(e, t, n) {
	let r = N(e, t, n);
	if (r.type !== "number") throw TypeError(`${n} needs a number parameter, but "${t}" is a ${r.type}.`);
	return r;
}
function F(e, t, n) {
	if (e === void 0) return;
	let r = e;
	if (typeof e == "string" && (r = t[e], !r)) throw RangeError(`${n} names bone group "${e}", which is not in boneGroups. Declared: ${Object.keys(t).join(", ") || "none"}.`);
	O(r, n), k(r.joints, `${n}.joints`, 256).forEach((e, t) => D(e, `${n}.joints[${t}]`));
	let i = { joints: [...r.joints] };
	return r.descendants !== void 0 && (i.descendants = r.descendants !== !1), r.exclude !== void 0 && (i.exclude = k(r.exclude, `${n}.exclude`, 256).map((e, t) => D(e, `${n}.exclude[${t}]`))), i;
}
function I(e, t, n) {
	O(e, t);
	let r = D(e.clip, `${t}.clip`), i = n.get(r);
	if (!i) throw RangeError(`${t}.clip names "${r}", which is not in clips. Declared: ${[...n.keys()].join(", ") || "none"}.`);
	return { clip: i };
}
function L(e, t, n, r) {
	P(r, e.parameter, `${t}.parameter`);
	let i = k(e.motions, `${t}.motions`, S.maximumMotions).map((e, r) => ({
		...I(e, `${t}.motions[${r}]`, n),
		threshold: A(e.threshold, `${t}.motions[${r}].threshold`)
	})), a = [...i].sort((e, t) => e.threshold - t.threshold);
	for (let e = 1; e < a.length; e++) if (a[e].threshold === a[e - 1].threshold) throw RangeError(`${t}.motions has two motions at threshold ${a[e].threshold}. Give each its own threshold.`);
	return {
		kind: "blend1d",
		parameterNames: [e.parameter],
		motions: i,
		sorted: a
	};
}
function R(e, t, n, r) {
	if (!Array.isArray(e.parameters) || e.parameters.length !== 2) throw TypeError(`${t}.parameters must be two number parameter names such as ["strafe", "forward"].`);
	e.parameters.forEach((e, n) => P(r, e, `${t}.parameters[${n}]`));
	let i = k(e.motions, `${t}.motions`, S.maximumMotions).map((e, r) => {
		let i = e.position;
		if (!Array.isArray(i) || i.length !== 2) throw TypeError(`${t}.motions[${r}].position must be [x, y].`);
		return {
			...I(e, `${t}.motions[${r}]`, n),
			x: A(i[0], `${t}.motions[${r}].position[0]`),
			y: A(i[1], `${t}.motions[${r}].position[1]`)
		};
	});
	for (let e = 0; e < i.length; e++) for (let n = e + 1; n < i.length; n++) if (i[e].x === i[n].x && i[e].y === i[n].y) throw RangeError(`${t}.motions[${n}] sits at the same position as motions[${e}]. Move one of them.`);
	return {
		kind: "blend2d",
		parameterNames: [...e.parameters],
		motions: i
	};
}
function z(e, t, n, r) {
	O(e, t);
	let i = D(e.name, `${t}.name`);
	if (e.clip === void 0 == (e.blend === void 0)) throw TypeError(`${t} (state "${i}") needs exactly one of clip (a clip name) or blend (a blend space).`);
	let a;
	e.clip === void 0 ? (O(e.blend, `${t}.blend`), a = e.blend.parameters === void 0 ? L(e.blend, `${t}.blend`, n, r) : R(e.blend, `${t}.blend`, n, r)) : a = {
		kind: "clip",
		parameterNames: [],
		motions: [I({ clip: e.clip }, t, n)]
	};
	let o = A(e.speed ?? 1, `${t}.speed`, 0, 100), s = e.speedParameter;
	s !== void 0 && P(r, s, `${t}.speedParameter`);
	let c = e.loop ?? (a.kind !== "clip" || a.motions[0].clip.loop);
	if (typeof c != "boolean") throw TypeError(`${t}.loop must be a boolean, got ${E(c)}.`);
	return {
		name: i,
		...a,
		speed: o,
		speedParameter: s,
		loop: c
	};
}
function B(e, t, n) {
	O(e, t);
	let r = N(n, e.parameter, `${t}.parameter`), i = Object.keys(e).filter((e) => e !== "parameter");
	if (r.type === "number") {
		let n = i.filter((e) => Object.hasOwn(w, e));
		if (n.length !== 1 || i.length !== 1) throw TypeError(`${t} on number parameter "${r.name}" needs exactly one of ${Object.keys(w).join(", ")}, such as { parameter: "${r.name}", greater: 0.1 }.`);
		let a = n[0];
		return {
			parameter: r,
			test: w[a],
			limit: A(e[a], `${t}.${a}`)
		};
	}
	if (i.some((e) => e !== "is")) throw TypeError(`${t} on ${r.type} parameter "${r.name}" takes only is: true or is: false.`);
	let a = e.is ?? !0;
	if (typeof a != "boolean") throw TypeError(`${t}.is must be a boolean, got ${E(a)}.`);
	return {
		parameter: r,
		test: (e, t) => e === t,
		limit: a
	};
}
function V(e, t) {
	if (e !== void 0 && typeof e != "boolean") throw TypeError(`${t}.interrupt must be true or false, got ${E(e)}.`);
	return e === !0;
}
function H(e, t, n, r) {
	O(e, t);
	let i = e.from ?? "*";
	if (i !== "*" && !n.has(i)) throw RangeError(`${t}.from names "${String(i)}", which is not a state of this layer. Use a state name or "*" for any state.`);
	let a = e.to;
	if (!n.has(a)) throw RangeError(`${t}.to names "${String(a)}", which is not a state of this layer. States: ${[...n.keys()].join(", ")}.`);
	if (i === a) throw RangeError(`${t} goes from "${a}" to itself. Remove it, or use a different target state.`);
	let o = e.when === void 0 ? [] : k(e.when, `${t}.when`, S.maximumConditions), s = e.exitPhase;
	if (s !== void 0 && A(s, `${t}.exitPhase`, 0, 1e3), o.length === 0 && s === void 0) throw TypeError(`${t} needs when (a list of parameter conditions) or exitPhase, or it would fire at once, every step.`);
	return {
		from: i,
		to: a,
		duration: A(e.duration ?? 0, `${t}.duration`, 0, S.maximumFadeSeconds),
		exitPhase: s,
		interrupt: V(e.interrupt, t),
		conditions: o.map((e, n) => B(e, `${t}.when[${n}]`, r))
	};
}
function U(e, t, n, r, i) {
	let a = `createAnimationGraph layers[${t}]`;
	O(e, a);
	let o = D(e.name, `${a}.name`), s = k(e.states, `${a}.states`, S.maximumStates), c = /* @__PURE__ */ new Map();
	s.forEach((e, t) => {
		let i = z(e, `${a}.states[${t}]`, n, r);
		if (c.has(i.name)) throw RangeError(`${a} has two states named "${i.name}". Rename one.`);
		c.set(i.name, i);
	});
	let l = e.initial ?? s[0].name;
	if (!c.has(l)) throw RangeError(`${a}.initial names "${String(l)}", which is not a state. States: ${[...c.keys()].join(", ")}.`);
	let u = (e.transitions === void 0 ? [] : k(e.transitions, `${a}.transitions`, S.maximumTransitions)).map((e, t) => H(e, `${a}.transitions[${t}]`, c, r)), d = e.reference ?? 0;
	if (A(d, `${a}.reference`), e.additive !== void 0 && typeof e.additive != "boolean") throw TypeError(`${a}.additive must be a boolean.`);
	let f = [], p = /* @__PURE__ */ new Map();
	for (let e of c.values()) for (let t of e.motions) p.has(t.clip.name) || (p.set(t.clip.name, f.length), f.push({
		clip: t.clip,
		weight: 0,
		time: 0,
		poseWeight: 0
	}));
	return {
		name: o,
		states: c,
		initial: l,
		transitions: u,
		slots: f,
		slotOf: p,
		mask: F(e.mask, i, `${a}.mask`),
		additive: e.additive === !0,
		reference: d,
		initialWeight: A(e.weight ?? 1, `${a}.weight`, 0, 1)
	};
}
function W(e, t, n) {
	n.fill(0), e.kind === "clip" ? n[0] = 1 : e.kind === "blend1d" ? G(e, t.get(e.parameterNames[0]).value, n) : K(e, t.get(e.parameterNames[0]).value, t.get(e.parameterNames[1]).value, n);
}
function G(e, t, n) {
	let { sorted: r, motions: i } = e, a = r.length - 1;
	if (t <= r[0].threshold) {
		n[i.indexOf(r[0])] = 1;
		return;
	}
	if (t >= r[a].threshold) {
		n[i.indexOf(r[a])] = 1;
		return;
	}
	let o = 1;
	for (; r[o].threshold < t;) o += 1;
	let s = r[o - 1], c = (t - s.threshold) / (r[o].threshold - s.threshold);
	n[i.indexOf(s)] = 1 - c, n[i.indexOf(r[o])] = c;
}
function K(e, t, n, r) {
	let { motions: i } = e, a = 0;
	for (let e = 0; e < i.length; e++) {
		let o = 1;
		for (let r = 0; r < i.length && o > 0; r++) {
			if (r === e) continue;
			let a = i[r].x - i[e].x, s = i[r].y - i[e].y, c = ((t - i[e].x) * a + (n - i[e].y) * s) / (a * a + s * s);
			o = Math.min(o, Math.max(0, 1 - c));
		}
		r[e] = o, a += o;
	}
	if (a === 0) r[0] = 1;
	else for (let e = 0; e < i.length; e++) r[e] /= a;
}
function q(e) {
	return {
		state: e,
		phase: 0,
		previousPhase: 0,
		frozen: !1,
		weights: new Float64Array(e.motions.length)
	};
}
function J(e, t) {
	let { state: n } = e, r = n.speedParameter ? t.get(n.speedParameter).value : 1;
	return n.speed * Math.max(0, r);
}
function Y(e, t, n) {
	let { state: r, weights: i } = e;
	e.frozen || W(r, t, i);
	let a = 0;
	for (let e = 0; e < i.length; e++) a += i[e] * r.motions[e].clip.duration;
	e.previousPhase = e.phase, e.phase += n * J(e, t) / a;
}
function X(e, t, n) {
	let { state: r, weights: i, phase: a, previousPhase: o } = e;
	r.motions.forEach((e, s) => {
		let c = t * i[s], l = e.clip.rootMotion;
		if (c <= 0 || !l) return;
		let u = l.displacement(a, r.loop), d = u[0], f = u[1], p = l.displacement(o, r.loop);
		n[0] += c * (d - p[0]), n[1] += c * (f - p[1]);
	});
}
function Z(e, t) {
	let { phase: n, state: r } = e;
	return (r.loop ? n - Math.floor(n) : Math.min(n, 1)) * t.clip.duration;
}
function Q(e, t) {
	return e.exitPhase !== void 0 && t.phase < e.exitPhase ? !1 : e.conditions.every((e) => e.test(e.parameter.value, e.limit));
}
function ee(e, t) {
	let n = {
		layer: e,
		weight: e.initialWeight,
		current: null,
		fading: [],
		fadeElapsed: 0,
		fadeDuration: 0,
		rootTravel: [0, 0]
	};
	function r() {
		n.current = q(e.states.get(e.initial)), n.fading = [], n.fadeElapsed = 0, n.fadeDuration = 0, n.rootTravel = [0, 0], n.weight = e.initialWeight, W(n.current.state, t, n.current.weights);
	}
	function i() {
		return n.fading.length ? Math.min(1, n.fadeElapsed / n.fadeDuration) : 1;
	}
	function a(e) {
		let t = i();
		for (let e of n.fading) e.base *= 1 - t;
		n.current.frozen = !0, n.fading.push({
			stateRuntime: n.current,
			base: t
		}), n.fading = n.fading.filter((e) => e.base > 0), n.fading.length > S.maximumFadingStates && n.fading.shift();
		let r = n.fading.reduce((e, t) => e + t.base, 0);
		for (let e of n.fading) e.base /= r;
		n.fadeElapsed = 0, n.fadeDuration = e;
	}
	function o() {
		let t = n.current.state.name, r = n.fading.length > 0, i = e.transitions.find((e) => (!r || e.interrupt) && (e.from === "*" || e.from === t) && e.to !== t && Q(e, n.current));
		if (!i) return;
		for (let e of i.conditions) e.parameter.type === "trigger" && (e.parameter.value = !1);
		let o = q(e.states.get(i.to));
		i.duration > 0 ? a(i.duration) : n.fading = [], n.current = o;
	}
	function s() {
		for (let t of e.slots) t.weight = 0;
		let t = i(), r = [...n.fading.map((e) => [e.stateRuntime, e.base * (1 - t)]), [n.current, t]];
		for (let [t, n] of r) t.state.motions.forEach((r, i) => {
			let a = n * t.weights[i];
			if (a <= 0) return;
			let o = e.slots[e.slotOf.get(r.clip.name)];
			o.weight += a, o.time = Z(t, r);
		});
		c();
	}
	function c() {
		let t = 0;
		for (let r = e.slots.length - 1; r >= 0; r--) {
			let i = e.slots[r], a = n.weight * i.weight;
			if (e.additive) {
				i.poseWeight = a;
				continue;
			}
			let o = 1 - t;
			i.poseWeight = o > 0 ? Math.min(1, Math.max(0, a / o)) : 0, t += a;
		}
	}
	return {
		begin() {
			r(), s();
		},
		advance(r) {
			o(), Y(n.current, t, r);
			for (let e of n.fading) Y(e.stateRuntime, t, r);
			if (n.fadeElapsed += r, e.followsRootMotion) {
				let e = i();
				n.rootTravel = [0, 0];
				for (let t of n.fading) X(t.stateRuntime, t.base * (1 - e), n.rootTravel);
				X(n.current, e, n.rootTravel);
			}
			n.fading.length && n.fadeElapsed >= n.fadeDuration - T && (n.fading = [], n.fadeElapsed = 0), s();
		},
		rootTravel() {
			return [n.rootTravel[0] * n.weight, n.rootTravel[1] * n.weight];
		},
		setWeight(e) {
			n.weight = e, c();
		},
		describe() {
			return {
				state: n.current.state.name,
				previousState: n.fading.length ? n.fading[n.fading.length - 1].stateRuntime.state.name : null,
				fade: n.fading.length ? i() : null,
				phase: n.current.phase,
				weight: n.weight,
				clips: e.slots.filter((e) => e.weight > 0).map((e) => ({
					clip: e.clip.name,
					time: e.time,
					weight: e.weight
				}))
			};
		}
	};
}
var $ = Object.freeze({
	delta: Object.freeze([0, 0]),
	distance: 0,
	speed: 0
});
function te(e, t) {
	let n = Math.hypot(e[0], e[1]);
	return Object.freeze({
		delta: Object.freeze(e),
		distance: n,
		speed: t > 0 ? n / t : 0
	});
}
function ne(e, t, n) {
	let r = e.layer === void 0 ? t[0] : t.find((t) => t.name === e.layer);
	if (!r) throw RangeError(`createAnimationGraph rootMotion.layer names "${String(e.layer)}", which is not a layer. Layers: ${t.map((e) => e.name).join(", ")}.`);
	if (![...n.values()].some((e) => e.rootMotion)) throw RangeError(`createAnimationGraph rootMotion.bone "${e.bone}" has no translation track in any clip. Name the bone that the clips move, as the track target.`);
	return r;
}
function re(e) {
	O(e, "createAnimationGraph definition");
	let t = e.rootMotion === void 0 ? null : i(e.rootMotion, "createAnimationGraph rootMotion"), n = j(e.clips ?? {}, t), r = M(e.parameters ?? {}), a = O(e.boneGroups ?? {}, "createAnimationGraph boneGroups"), o = k(e.layers, "createAnimationGraph layers", S.maximumLayers).map((e, t) => U(e, t, n, r, a)), s = /* @__PURE__ */ new Set();
	for (let e of o) {
		if (s.has(e.name)) throw RangeError(`createAnimationGraph has two layers named "${e.name}". Rename one.`);
		s.add(e.name);
	}
	let c = t ? ne(t, o, n) : null;
	for (let e of o) e.followsRootMotion = e === c;
	let l = o.map((e) => ee(e, r)), u = 0, d = $;
	function f(e) {
		let t = o.findIndex((t) => t.name === e);
		if (t < 0) throw RangeError(`No layer named "${String(e)}". Layers: ${o.map((e) => e.name).join(", ")}.`);
		return l[t];
	}
	let p = {
		get layers() {
			return o.map((e) => e.name);
		},
		get time() {
			return u;
		},
		get rootMotion() {
			if (!t) throw TypeError("graph.rootMotion needs the rootMotion option, for example createAnimationGraph({ rootMotion: { bone: \"Root\" }, ... }).");
			return d;
		},
		set(e, t) {
			let n = N(r, e, "graph.set name");
			if (n.type === "trigger") throw TypeError(`Parameter "${e}" is a trigger. Call graph.trigger("${e}") instead.`);
			if (n.type === "boolean" && typeof t != "boolean") throw TypeError(`Parameter "${e}" is a boolean; pass true or false, got ${E(t)}.`);
			return n.type === "number" && A(t, `Parameter "${e}"`), n.value = t, p;
		},
		trigger(e) {
			let t = N(r, e, "graph.trigger name");
			if (t.type !== "trigger") throw TypeError(`Parameter "${e}" is a ${t.type}, not a trigger. Use graph.set("${e}", value).`);
			return t.value = !0, p;
		},
		resetParameter(e) {
			let t = N(r, e, "graph.resetParameter name");
			return t.value = t.initial, p;
		},
		get(e) {
			return N(r, e, "graph.get name").value;
		},
		setLayerWeight(e, t) {
			return A(t, `Layer "${e}" weight`, 0, 1), f(e).setWeight(t), p;
		},
		advance(e) {
			A(e, "graph.advance deltaSeconds", 0, S.maximumDeltaSeconds);
			for (let t of l) t.advance(e);
			return u += e, c && (d = te(l[o.indexOf(c)].rootTravel(), e)), p;
		},
		reset() {
			for (let e of r.values()) e.value = e.initial;
			for (let e of l) e.begin();
			return u = 0, d = $, p;
		},
		layerState(e) {
			return f(e).describe();
		},
		poseLayers() {
			return o.flatMap((e) => e.slots.map((t) => ({
				clip: t.clip.clip,
				weight: () => t.poseWeight,
				clipTime: () => t.time,
				...e.mask ? { mask: e.mask } : {},
				...e.additive ? {
					additive: !0,
					reference: e.reference
				} : {}
			})));
		},
		system({ name: e = "animation-graph", apply: t } = {}) {
			if (D(e, "graph.system name"), t !== void 0 && typeof t != "function") throw TypeError("graph.system apply must be a function (graph, context) or left out.");
			return {
				name: e,
				fixedUpdate(e) {
					p.advance(e);
				},
				update(e, n) {
					n.mode === "variable" && p.advance(e), t?.(p, n);
				}
			};
		}
	};
	return p.reset(), p;
}
export { S as ANIMATION_GRAPH_LIMITS, f as NPC_FOLLOWER_LIMITS, re as createAnimationGraph, u as createFootPlacement, d as createLookAt, x as createPathFollower, o as extractRootMotion };
