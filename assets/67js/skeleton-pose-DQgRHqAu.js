/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { n as e, o as t } from "./mat4-BCZClxna.js";
import { c as n, d as r, f as i, l as a, o, s } from "./quat-Bl7gjwWK.js";
import { S as c, c as l, d as u, f as d, h as f, i as p, m, n as h, o as g, p as _, s as v, t as y, v as b, y as x } from "./vec3-BRYC6f_g.js";
import { n as S, r as C } from "./animation-CO9Tq0E0.js";
import { i as w } from "./skinning-DjFQA5hH.js";
import { bindSourceTracks as T, computeWorldPose as E, createPoseState as D, createRigFromSkin as O, mapHumanoidBones as k, prepareRigGeometry as A, validateRigJoints as j } from "./retarget.js";
// src/rotation-euler.js
var M = 1 - 1e-9;
function N(e, t, n, i) {
	let a = r(/* @__PURE__ */ new Float64Array(4), [
		1,
		0,
		0
	], t), o = r(/* @__PURE__ */ new Float64Array(4), [
		0,
		1,
		0
	], n), c = r(/* @__PURE__ */ new Float64Array(4), [
		0,
		0,
		1
	], i);
	return s(e, c, o), s(e, e, a);
}
function P(e) {
	let [t, n, r, i] = e, a = t * t + n * n + r * r + i * i, o = a > 0 ? 2 / a : 0, s = o * (t * r - i * n), c = o * (n * r + i * t), l = 1 - o * (t * t + n * n), u = o * (t * n + i * r), d = 1 - o * (n * n + r * r);
	if (Math.abs(s) >= M) {
		let e = 1 - o * (t * t + r * r), a = o * (n * r - i * t);
		return [
			Math.atan2(-a, e),
			Math.asin(Math.max(-1, Math.min(1, -s))),
			0
		];
	}
	return [
		Math.atan2(c, l),
		Math.asin(-s),
		Math.atan2(u, d)
	];
}
// src/skeleton-pose.js
var F = 1e-9, I = Math.PI / 180, L = Object.freeze([
	0,
	0,
	0,
	1
]);
function R(e, t) {
	let n = e.joints.map((e) => e.name), r = e.mapping ?? k(n).mapping;
	return function(e, i) {
		let a = t.indexByName.has(e) ? e : r[e], o = t.indexByName.get(a);
		if (o === void 0) {
			let t = n.slice(0, 12).join(", ");
			throw RangeError(`${i}: joint ${e} is not in the rig. Use a joint name or a humanoid bone such as leftUpperArm. Joints: ${t}${n.length > 12 ? ", ..." : ""}`);
		}
		return o;
	};
}
function z(e, t) {
	let n = new Uint8Array(e.joints.length);
	for (let e of t) n[e] = 1;
	for (let t of e.order) {
		let r = e.joints[t].parent;
		r >= 0 && n[r] && (n[t] = 1);
	}
	return n;
}
function B(e, t, n) {
	let r = new Float64Array(e.joints.length);
	if (!n) return r.fill(1);
	if (!Array.isArray(n.joints) || !n.joints.length) throw TypeError("A layer mask needs joints: a non-empty list of joint or bone names.");
	let i = n.joints.map((e) => t(e, "Layer mask"));
	if (n.descendants === !1) for (let e of i) r[e] = 1;
	else r.set(z(e, i));
	return n.exclude && z(e, n.exclude.map((e) => t(e, "Layer mask exclude"))).forEach((e, t) => {
		e && (r[t] = 0);
	}), r;
}
function V(e, t) {
	if (typeof e == "function") return e;
	if (!Number.isFinite(e) || e < 0 || e > 1) throw RangeError(`${t} must be from 0 to 1, or a function of time.`);
	return () => e;
}
function H(e, t, n) {
	let r = e(t);
	if (!Number.isFinite(r) || r < 0 || r > 1) throw RangeError(`${n} returned ${r} at time ${t}; it must be from 0 to 1.`);
	return r;
}
function ee(e, t, n, r) {
	let i = `Layer ${t}`;
	if (!e?.clip) throw TypeError(`${i} needs a clip from createAnimationClip.`);
	let a = S(e.clip), o = T(a, n);
	if (!o.length) throw RangeError(`${i}: no clip track names a joint of this rig.`);
	let s = e.additive === !0, c = e.reference ?? 0;
	if (!Number.isFinite(c)) throw RangeError(`${i} reference must be a clip time in seconds.`);
	let l = [];
	s && (a.sample(c), l = o.map((e) => Float64Array.from(e.output)));
	let u = e.speed ?? 1, d = e.offset ?? 0;
	if (!Number.isFinite(u) || !Number.isFinite(d)) throw RangeError(`${i} speed and offset must be finite.`);
	if (e.clipTime !== void 0 && typeof e.clipTime != "function") throw TypeError(`${i} clipTime must be a function from motion time to clip time.`);
	return {
		label: i,
		sampler: a,
		bindings: o,
		additive: s,
		references: l,
		speed: u,
		offset: d,
		clipTime: e.clipTime,
		weight: V(e.weight ?? 1, `${i} weight`),
		mask: B(n, r, e.mask)
	};
}
var U = /* @__PURE__ */ new Float64Array(4), te = /* @__PURE__ */ new Float64Array(4);
function W(e, t, r, a) {
	s(U, o(te, r), t), i(U, L, U, a), n(e, s(e, e, U));
}
function G(e, t) {
	let n = e.clipTime ? e.clipTime(t) : t * e.speed + e.offset;
	if (!Number.isFinite(n)) throw RangeError(`${e.label} clip time must be finite at time ${t}.`);
	return n;
}
function ne(e, t, r, a) {
	let o = H(e.weight, t, `${e.label} weight`);
	o !== 0 && (e.sampler.sample(G(e, t)), e.bindings.forEach((t, s) => {
		let c = o * e.mask[t.index];
		if (c === 0) return;
		if (t.property === "rotation") {
			let a = r[t.index];
			e.additive ? W(a, t.output, e.references[s], c) : n(a, i(a, a, t.output, c));
			return;
		}
		let l = a[t.index];
		for (let n = 0; n < 3; n++) e.additive ? l[n] += (t.output[n] - e.references[s][n]) * c : l[n] += (t.output[n] - l[n]) * c;
	}));
}
function K(e, t, n) {
	let r = e.joints[t].parent;
	for (; r >= 0;) {
		if (r === n) return !0;
		r = e.joints[r].parent;
	}
	return !1;
}
function q(e, t) {
	if (e?.length !== 3 || !Number.isFinite(e[0]) || !Number.isFinite(e[1]) || !Number.isFinite(e[2])) throw RangeError(`${t} must be three finite numbers.`);
	return e;
}
var J = [
	"x",
	"y",
	"z"
], re = 175 * I, Y = .01, X = .02;
function ie(e, t, n, r, i = "root or middle") {
	if (e === void 0) return [];
	if (!e || typeof e != "object" || Array.isArray(e)) throw TypeError(`${t} limits must be { ${i} } with an x, y or z range each.`);
	return Object.entries(e).map(([e, a]) => {
		if (!Object.hasOwn(n, e)) throw RangeError(`${t} limits: ${e} must be ${i}.`);
		let o = Object.keys(a ?? {}).find((e) => !J.includes(e));
		if (o !== void 0) throw RangeError(`${t} limits ${e}: ${o} must be x, y or z.`);
		let s = J.map((n) => {
			let r = a[n];
			if (r === void 0) return null;
			if (!Array.isArray(r) || r.length !== 2 || !r.every(Number.isFinite) || r[0] > r[1] || r[0] < -180 || r[1] > 180) throw RangeError(`${t} limits ${e}.${n} must be [min, max] degrees within -180 and 180, min first.`);
			return r.map((e) => e * I);
		}), c = n[e];
		return {
			index: c,
			name: r.joints[c].name,
			ranges: s
		};
	});
}
function ae(e, t, n, r) {
	let i, a;
	if (e.chain !== void 0) {
		if (!Array.isArray(e.chain) || e.chain.length < 2 || e.chain.length > 64) throw RangeError(`${t} chain must list 2 to 64 joints from base to end.`);
		a = e.chain, i = a.map((e) => r(e, t)), i.slice(1).forEach((e, r) => {
			if (!K(n, e, i[r])) throw RangeError(`${t}: each chain joint must descend from the one before it.`);
		});
	} else if (e.root !== void 0 && e.end !== void 0) {
		let o = r(e.root, t), s = r(e.end, t);
		if (!K(n, s, o)) throw RangeError(`${t}: end must descend from root.`);
		let c = [], l = s;
		for (; l >= 0 && (c.push(l), l !== o);) l = n.joints[l].parent;
		i = c.reverse(), a = i.map((e) => n.joints[e].name);
	} else throw TypeError(`${t} needs chain (or root and end).`);
	let o = [];
	for (let e = 0; e < i.length - 1; e++) {
		let t = [], r = i[e + 1];
		for (; r !== i[e];) t.push(r), r = n.joints[r].parent;
		o.push(t);
	}
	return {
		joints: i,
		names: a,
		segmentChildren: o,
		stretchIndices: o.flat()
	};
}
function oe(e, t, n) {
	if (e === void 0) return t;
	if (typeof e == "boolean") return +!!e;
	if (!Number.isFinite(e) || e < 0 || e > 1) throw RangeError(`${n} stretch must be a boolean or a number from 0 to 1.`);
	return e;
}
function se(e, t) {
	if (!Array.isArray(e) || e.length < 2 || e.length > 64) throw RangeError(`${t} curve must be 2 to 64 [x, y, z] points.`);
	return e.map((e, n) => q(e, `${t} curve[${n}]`));
}
function Z(e) {
	return Number((e / I).toFixed(4));
}
function Q(e, t, r) {
	let i = [];
	for (let a of e) {
		let e = t.restRotations[a.index], c = s(/* @__PURE__ */ new Float64Array(4), o(/* @__PURE__ */ new Float64Array(4), e), r[a.index]), l = P(c), u = !1;
		l.forEach((e, t) => {
			let n = a.ranges[t];
			if (!n) return;
			let r = Math.min(n[1], Math.max(n[0], e));
			Math.abs(r - e) < 1e-9 || (i.push({
				joint: a.name,
				axis: J[t],
				requested: Z(e),
				applied: Z(r)
			}), l[t] = r, u = !0);
		}), u && (N(c, l[0], l[1], l[2]), n(r[a.index], s(r[a.index], e, c)));
	}
	return i;
}
function ce(e, t, n) {
	let r = x(/* @__PURE__ */ new Float64Array(3), n, e), i = x(/* @__PURE__ */ new Float64Array(3), t, e), a = b(r);
	return a < F ? i : f(i, i, r, -l(i, r) / a);
}
function le(e, t, n, r) {
	let { positions: i, rotations: a } = e.restWorld, s = ce(i[t], i[n], i[r]), l = v(i[t], i[n]) + v(i[n], i[r]);
	if (u(s) < l * X) return null;
	let d = e.joints[t].parent, f = d >= 0 ? a[d] : e.rootRotation;
	return c(/* @__PURE__ */ new Float64Array(3), s, o(/* @__PURE__ */ new Float64Array(4), f));
}
function ue(e, t, n) {
	let r = [], i = t.positions[e.root], a = t.positions[e.middle], o = t.positions[e.end], s = h(x(/* @__PURE__ */ new Float64Array(3), i, a), x(/* @__PURE__ */ new Float64Array(3), o, a));
	s > re && r.push({
		code: "hyperextended",
		message: `${n.joints[e.middle].name} is locked straight (${Z(s)} degrees). The target is at or beyond the limb's reach, so a real joint would hyperextend.`
	});
	let d = e.bendToward;
	if (!d && e.restBend) {
		let r = n.joints[e.root].parent;
		d = c(/* @__PURE__ */ new Float64Array(3), e.restBend, r >= 0 ? t.rotations[r] : n.rootRotation);
	}
	if (!d) return r;
	let f = ce(i, a, o), p = v(i, a) + v(a, o);
	return u(f) >= p * Y && l(f, d) < 0 && r.push({
		code: "wrong-bend",
		message: `${n.joints[e.middle].name} bends away from its natural direction. Move the pole to the other side, or set bendToward.`
	}), r;
}
function de(e, t, n, r) {
	let i = `IK ${t}`, a = V(e?.weight ?? 1, `${i} weight`), s = e?.type === "ik" ? "chain" : e?.type === "spline_ik" ? "spline" : e?.type;
	if (s !== "spline" && typeof e?.target != "function" && q(e?.target, `${i} target`), e.type === "two-bone") {
		let t = r(e.root, i), s = r(e.middle, i), l = r(e.end, i);
		if (!K(n, s, t) || !K(n, l, s)) throw RangeError(`${i}: end must descend from middle, and middle from root.`);
		e.pole !== void 0 && typeof e.pole != "function" && q(e.pole, `${i} pole`);
		let u = ie(e.limits, i, {
			root: t,
			middle: s
		}, n), d = e.bendToward === void 0 ? null : _(/* @__PURE__ */ new Float64Array(3), q(e.bendToward, `${i} bendToward`));
		return e.groundNormal !== void 0 && typeof e.groundNormal != "function" && q(e.groundNormal, `${i} groundNormal`), {
			type: "two-bone",
			label: i,
			weight: a,
			root: t,
			middle: s,
			end: l,
			target: e.target,
			pole: e.pole,
			limits: u,
			bendToward: d,
			groundNormal: e.groundNormal,
			endUp: c(/* @__PURE__ */ new Float64Array(3), [
				0,
				1,
				0
			], o(/* @__PURE__ */ new Float64Array(4), n.restWorld.rotations[l])),
			restBend: le(n, t, s, l),
			keepEndRotation: e.keepEndRotation !== !1
		};
	}
	if (e.type === "aim") {
		let t = e.joints ?? (e.joint === void 0 ? [] : [e.joint]);
		if (!t.length) throw TypeError(`${i} needs joint, or joints listed from the base of the chain to the aiming joint.`);
		let s = t.map((e) => r(e, i));
		if (s.slice(1).forEach((e, t) => {
			if (!K(n, e, s[t])) throw RangeError(`${i}: list joints from the base of the chain to the aiming joint.`);
		}), e.forward !== void 0 && e.worldForward !== void 0) throw TypeError(`${i} takes forward or worldForward, not both.`);
		let l = _(/* @__PURE__ */ new Float64Array(3), q(e.forward ?? e.worldForward ?? [
			0,
			0,
			1
		], `${i} forward`));
		if (e.worldForward !== void 0) {
			let e = n.restWorld.rotations[s[s.length - 1]];
			c(l, l, o(/* @__PURE__ */ new Float64Array(4), e));
		}
		let u = e.maxAngle ?? 180;
		if (!Number.isFinite(u) || u <= 0) throw RangeError(`${i} maxAngle must be a positive number of degrees.`);
		return {
			type: "aim",
			label: i,
			weight: a,
			joints: s,
			forward: l,
			maxRadians: u * I,
			target: e.target
		};
	}
	if (s === "chain") {
		let { joints: t, names: o, segmentChildren: s, stretchIndices: c } = ae(e, i, n, r);
		e.pole !== void 0 && typeof e.pole != "function" && q(e.pole, `${i} pole`);
		let l = e.poleAngle ?? 0;
		if (!Number.isFinite(l) || l < -180 || l > 180) throw RangeError(`${i} poleAngle must be degrees from -180 to 180.`);
		let u = oe(e.stretch, 0, i), d = e.iterations ?? 16;
		if (!Number.isInteger(d) || d < 1 || d > 64) throw RangeError(`${i} iterations must be a whole number from 1 to 64.`);
		let f = {};
		t.slice(0, -1).forEach((e, t) => {
			f[o[t]] = e, f[n.joints[e].name] = e;
		});
		let p = ie(e.limits, i, f, n, "a joint in the chain");
		return {
			type: "chain",
			label: i,
			weight: a,
			joints: t,
			segmentChildren: s,
			stretchIndices: c,
			target: e.target,
			pole: e.pole,
			poleRadians: l * I,
			stretch: u,
			iterations: d,
			limits: p,
			keepEndRotation: e.keepEndRotation !== !1
		};
	}
	if (s === "spline") {
		let { joints: t, segmentChildren: o, stretchIndices: s } = ae(e, i, n, r);
		typeof e.curve != "function" && se(e.curve, i);
		let c = oe(e.stretch, 1, i);
		return {
			type: "spline",
			label: i,
			weight: a,
			joints: t,
			segmentChildren: o,
			stretchIndices: s,
			curve: e.curve,
			stretch: c
		};
	}
	throw RangeError(`${i} type must be two-bone, aim, chain or spline.`);
}
function $(e, t, n, r) {
	return q(typeof e == "function" ? e(t, Array.from(n)) : e, r);
}
function fe(e) {
	let t = Math.abs(e[1]) < .9 ? [
		0,
		1,
		0
	] : [
		1,
		0,
		0
	];
	return _(/* @__PURE__ */ new Float64Array(3), g(/* @__PURE__ */ new Float64Array(3), e, t));
}
function pe(e, t, r, a) {
	let c = () => E(e, t, r, a), l = /* @__PURE__ */ new Float64Array(4);
	function u(a, u, d) {
		let f = e.joints[a].parent, p = f >= 0 ? t.rotations[f] : e.rootRotation;
		s(l, o(/* @__PURE__ */ new Float64Array(4), p), u), n(r[a], i(r[a], r[a], l, d)), c();
	}
	return {
		state: t,
		prepared: e,
		localRotations: r,
		localTranslations: a,
		update: c,
		setWorldRotation: u
	};
}
function me(e, t, n) {
	let { state: r, prepared: i, localRotations: o, update: d, setWorldRotation: h } = n, g = H(e.weight, t, `${e.label} weight`), b = r.positions[e.end], S = $(e.target, t, b, `${e.label} target`);
	if (g === 0) return {
		reached: !0,
		error: 0,
		warnings: [],
		limited: []
	};
	let C = Float64Array.from(r.positions[e.root]), w = Float64Array.from(r.positions[e.middle]), T = Float64Array.from(b), E = Float64Array.from(r.rotations[e.end]), D = v(C, w), O = v(w, T), k = x(/* @__PURE__ */ new Float64Array(3), S, C), A = u(k);
	if (A < F || D < F || O < F) return {
		reached: !1,
		error: v(T, S),
		warnings: [],
		limited: []
	};
	let j = m(/* @__PURE__ */ new Float64Array(3), k, 1 / A), M = (D + O) * 1e-4, N = D + O - M, P = Math.min(N, Math.max(Math.abs(D - O) + M, A)), I = e.pole === void 0 ? x(/* @__PURE__ */ new Float64Array(3), w, C) : x(/* @__PURE__ */ new Float64Array(3), $(e.pole, t, w, `${e.label} pole`), C), L = l(I, j), R = f(/* @__PURE__ */ new Float64Array(3), I, j, -L);
	u(R) < F * Math.max(1, D) ? p(R, fe(j)) : _(R, R);
	let z = (D * D - O * O + P * P) / (2 * P), B = Math.sqrt(Math.max(0, D * D - z * z)), V = f(/* @__PURE__ */ new Float64Array(3), C, j, z);
	f(V, V, R, B);
	let ee = f(/* @__PURE__ */ new Float64Array(3), C, j, P), U = _(/* @__PURE__ */ new Float64Array(3), x(/* @__PURE__ */ new Float64Array(3), w, C)), te = _(/* @__PURE__ */ new Float64Array(3), x(/* @__PURE__ */ new Float64Array(3), V, C)), W = a(/* @__PURE__ */ new Float64Array(4), U, te), G = c(/* @__PURE__ */ new Float64Array(3), x(/* @__PURE__ */ new Float64Array(3), T, C), W);
	y(G, G, C);
	let ne = _(/* @__PURE__ */ new Float64Array(3), x(/* @__PURE__ */ new Float64Array(3), G, V)), K = _(/* @__PURE__ */ new Float64Array(3), x(/* @__PURE__ */ new Float64Array(3), ee, V)), q = a(/* @__PURE__ */ new Float64Array(4), ne, K), J = s(/* @__PURE__ */ new Float64Array(4), W, r.rotations[e.root]), re = s(/* @__PURE__ */ new Float64Array(4), q, s(/* @__PURE__ */ new Float64Array(4), W, r.rotations[e.middle]));
	h(e.root, J, g), h(e.middle, re, g);
	let Y = Q(e.limits, i, o);
	if (Y.length && d(), e.keepEndRotation && h(e.end, E, g), e.groundNormal !== void 0) {
		let n = _(/* @__PURE__ */ new Float64Array(3), $(e.groundNormal, t, [
			0,
			1,
			0
		], `${e.label} groundNormal`)), i = c(/* @__PURE__ */ new Float64Array(3), e.endUp, r.rotations[e.end]), o = a(/* @__PURE__ */ new Float64Array(4), i, n);
		h(e.end, s(/* @__PURE__ */ new Float64Array(4), o, r.rotations[e.end]), g);
	}
	let X = v(r.positions[e.end], S);
	return {
		reached: X <= M * 2 + F,
		error: X,
		warnings: ue(e, r, i),
		limited: Y
	};
}
function he(e, t, n) {
	let { state: r, setWorldRotation: o } = n, l = H(e.weight, t, `${e.label} weight`), d = e.joints[e.joints.length - 1], f = $(e.target, t, r.positions[d], `${e.label} target`);
	if (l === 0) return {
		reached: !0,
		error: 0
	};
	let p = () => c(/* @__PURE__ */ new Float64Array(3), e.forward, r.rotations[d]), m = x(/* @__PURE__ */ new Float64Array(3), f, r.positions[d]);
	if (u(m) < F) return {
		reached: !1,
		error: Math.PI
	};
	_(m, m);
	let g = p(), v = a(/* @__PURE__ */ new Float64Array(4), g, m), y = 2 * Math.acos(Math.min(1, Math.abs(v[3]))), b = y > e.maxRadians ? e.maxRadians / y : 1, S = i(/* @__PURE__ */ new Float64Array(4), L, v, b), C = c(/* @__PURE__ */ new Float64Array(3), g, S);
	e.joints.forEach((t, n) => {
		let c = e.joints.length - n, u = a(/* @__PURE__ */ new Float64Array(4), p(), C);
		i(u, L, u, 1 / c), o(t, s(/* @__PURE__ */ new Float64Array(4), u, r.rotations[t]), l);
	});
	let w = p(), T = x(/* @__PURE__ */ new Float64Array(3), f, r.positions[d]), E = h(w, T);
	return {
		reached: E < .02,
		error: E
	};
}
function ge(e, t) {
	let n = e.length;
	if (n === 2) return d(/* @__PURE__ */ new Float64Array(3), e[0], e[1], t);
	let r = Math.max(0, Math.min(1, t)) * (n - 1), i = Math.min(n - 2, Math.floor(r)), a = r - i, o = a * a, s = o * a, c = e[i], l = e[i + 1], u = i > 0 ? e[i - 1] : [
		2 * c[0] - l[0],
		2 * c[1] - l[1],
		2 * c[2] - l[2]
	], f = i + 2 < n ? e[i + 2] : [
		2 * l[0] - c[0],
		2 * l[1] - c[1],
		2 * l[2] - c[2]
	], p = /* @__PURE__ */ new Float64Array(3);
	for (let e = 0; e < 3; e++) {
		let t = -.5 * u[e] + 1.5 * c[e] - 1.5 * l[e] + .5 * f[e], n = u[e] - 2.5 * c[e] + 2 * l[e] - .5 * f[e], r = -.5 * u[e] + .5 * l[e];
		p[e] = t * s + n * o + r * a + c[e];
	}
	return p;
}
function _e(e) {
	let t = Array.from({ length: 129 }, (t, n) => ge(e, n / 128)), n = /* @__PURE__ */ new Float64Array(129);
	for (let e = 1; e <= 128; e++) n[e] = n[e - 1] + v(t[e - 1], t[e]);
	let r = n[128], i = x(/* @__PURE__ */ new Float64Array(3), t[128], t[127]);
	u(i) > F ? _(i, i) : i[0] = 1;
	function a(e) {
		if (e <= 0 || r <= F) return Float64Array.from(t[0]);
		if (e >= r) return f(/* @__PURE__ */ new Float64Array(3), t[128], i, e - r);
		let a = 0, o = 128;
		for (; a < o - 1;) {
			let t = a + o >> 1;
			n[t] <= e ? a = t : o = t;
		}
		let s = n[o] - n[a], c = s > F ? (e - n[a]) / s : 0;
		return d(/* @__PURE__ */ new Float64Array(3), t[a], t[o], c);
	}
	return {
		totalLength: r,
		endTangent: i,
		pointAtDistance: a
	};
}
function ve(e, t, o) {
	let { state: h, prepared: g, localRotations: y, update: b, setWorldRotation: S } = o, C = H(e.weight, t, `${e.label} weight`), w = e.joints[e.joints.length - 1], T = $(e.target, t, h.positions[w], `${e.label} target`);
	if (C === 0) return {
		reached: !0,
		error: 0,
		warnings: [],
		limited: []
	};
	let E = e.joints.map((e) => Float64Array.from(y[e])), D = e.stretchIndices.map((e) => Float64Array.from(o.localTranslations[e])), O = Float64Array.from(h.rotations[w]), k = 0;
	for (let t = 0; t < e.joints.length - 1; t++) k += v(h.positions[e.joints[t]], h.positions[e.joints[t + 1]]);
	let A = Float64Array.from(h.positions[e.joints[0]]), j = x(/* @__PURE__ */ new Float64Array(3), T, A), M = u(j);
	if (M < F || k < F) return {
		reached: !1,
		error: v(h.positions[w], T),
		warnings: [],
		limited: []
	};
	if (e.stretch > 0 && M > k) {
		let t = 1 + (M / k - 1) * e.stretch;
		for (let n of e.stretchIndices) m(o.localTranslations[n], o.localTranslations[n], t);
		b(), k *= t;
	}
	let N = m(/* @__PURE__ */ new Float64Array(3), j, 1 / M);
	if (e.pole !== void 0) {
		let n = e.joints[Math.floor(e.joints.length / 2)], i = $(e.pole, t, h.positions[n], `${e.label} pole`), o = x(/* @__PURE__ */ new Float64Array(3), i, A), d = f(/* @__PURE__ */ new Float64Array(3), o, N, -l(o, N));
		u(d) < F ? p(d, fe(N)) : _(d, d), e.poleRadians !== 0 && c(d, d, r(/* @__PURE__ */ new Float64Array(4), N, e.poleRadians));
		let g = e.joints.length - 1;
		for (let t = 0; t < g; t++) {
			let n = e.joints[t], r = e.joints[t + 1], i = x(/* @__PURE__ */ new Float64Array(3), h.positions[r], h.positions[n]), o = u(i);
			if (o <= F) continue;
			m(i, i, 1 / o);
			let c = M < k ? (.5 - (t + .5) / g) * .75 : 0, l = _(/* @__PURE__ */ new Float64Array(3), f(/* @__PURE__ */ new Float64Array(3), N, d, c)), p = a(/* @__PURE__ */ new Float64Array(4), i, l);
			S(n, s(/* @__PURE__ */ new Float64Array(4), p, h.rotations[n]), 1);
		}
	}
	for (let t = 0; t < e.iterations; t++) {
		for (let t = e.joints.length - 2; t >= 0; t--) {
			let n = e.joints[t], r = h.positions[n], i = x(/* @__PURE__ */ new Float64Array(3), h.positions[w], r), o = x(/* @__PURE__ */ new Float64Array(3), T, r), c = u(i), l = u(o);
			if (c <= F || l <= F) continue;
			m(i, i, 1 / c), m(o, o, 1 / l);
			let d = a(/* @__PURE__ */ new Float64Array(4), i, o);
			S(n, s(/* @__PURE__ */ new Float64Array(4), d, h.rotations[n]), 1);
		}
		if (e.limits.length && Q(e.limits, g, y).length && b(), v(h.positions[w], T) <= 1e-6) break;
	}
	let P = Q(e.limits, g, y);
	P.length && b(), e.keepEndRotation && S(w, O, 1), C < 1 && (e.joints.forEach((e, t) => {
		n(y[e], i(y[e], E[t], y[e], C));
	}), e.stretchIndices.forEach((e, t) => {
		d(o.localTranslations[e], D[t], o.localTranslations[e], C);
	}), b());
	let I = v(h.positions[w], T);
	return {
		reached: I <= k * .001 + 1e-4,
		error: I,
		warnings: [],
		limited: P
	};
}
function ye(e, t, r) {
	let { state: o, localRotations: c, localTranslations: l, update: f, setWorldRotation: p } = r, h = H(e.weight, t, `${e.label} weight`), g = se(typeof e.curve == "function" ? e.curve(t) : e.curve, e.label);
	if (h === 0) return {
		reached: !0,
		error: 0
	};
	let _ = e.joints.map((e) => Float64Array.from(c[e])), y = e.stretchIndices.map((e) => Float64Array.from(l[e])), b = e.joints.length - 1, S = new Float64Array(b), C = new Float64Array(b + 1);
	for (let t = 0; t < b; t++) S[t] = v(o.positions[e.joints[t]], o.positions[e.joints[t + 1]]), C[t + 1] = C[t] + S[t];
	let w = C[b], T = _e(g), E = w + (T.totalLength - w) * e.stretch, D = Array.from({ length: b + 1 }, (e, t) => {
		let n = w > F ? C[t] / w : t / b;
		return T.pointAtDistance(n * E);
	});
	for (let t = 0; t < b; t++) {
		let n = e.joints[t], r = e.joints[t + 1], i = o.positions[n], c = x(/* @__PURE__ */ new Float64Array(3), D[t + 1], i), d = u(c), h = x(/* @__PURE__ */ new Float64Array(3), o.positions[r], i), g = u(h);
		if (e.stretch > 0 && g > F && d > F) {
			let i = 1 + (d / g - 1) * e.stretch;
			for (let n of e.segmentChildren[t]) m(l[n], l[n], i);
			f(), h = x(/* @__PURE__ */ new Float64Array(3), o.positions[r], o.positions[n]), g = u(h);
		}
		if (g > F && d > F) {
			m(h, h, 1 / g), m(c, c, 1 / d);
			let e = a(/* @__PURE__ */ new Float64Array(4), h, c);
			p(n, s(/* @__PURE__ */ new Float64Array(4), e, o.rotations[n]), 1);
		}
	}
	h < 1 && (e.joints.forEach((e, t) => {
		n(c[e], i(c[e], _[t], c[e], h));
	}), e.stretchIndices.forEach((e, t) => {
		d(l[e], y[t], l[e], h);
	}), f());
	let O = e.joints[b], k = v(o.positions[O], D[b]);
	return {
		reached: k <= Math.max(T.totalLength, w) * .01 + 1e-4,
		error: k
	};
}
var be = {
	"two-bone": me,
	aim: he,
	chain: ve,
	spline: ye
}, xe = {
	position: "translation",
	quaternion: "rotation",
	scale: "scale"
}, Se = 2300, Ce = 2301, we = 2302, Te = 30;
function Ee(e, t) {
	let n = e.getInterpolation?.();
	if (n === Ce || n === Se) return Array.from(e.times, (n, r) => ({
		time: n,
		value: Array.from(e.values.subarray(r * t, (r + 1) * t))
	}));
	let r = e.createInterpolant(new Float64Array(t)), i = e.times[0], a = e.times[e.times.length - 1], o = Math.max(1, Math.ceil((a - i) * Te));
	return Array.from({ length: o + 1 }, (e, t) => {
		let n = i + (a - i) * t / o;
		return {
			time: n,
			value: Array.from(r.evaluate(n))
		};
	});
}
function De(e, { loop: t = !1, rename: n = {} } = {}) {
	if (!Array.isArray(e?.tracks) || !Number.isFinite(e.duration)) throw TypeError("clipFromGltfAnimation needs an animation from asset.animations.");
	let r = [];
	for (let t of e.tracks) {
		let e = t.name.lastIndexOf("."), i = xe[t.name.slice(e + 1)];
		if (!i || !t.times.length) continue;
		let a = i === "rotation" ? 4 : 3, o = t.name.slice(0, e);
		r.push({
			target: Object.hasOwn(n, o) ? n[o] : o,
			property: i,
			interpolation: t.getInterpolation?.() === Se ? "STEP" : "LINEAR",
			keyframes: Ee(t, a)
		});
	}
	return C({
		duration: Math.max(e.duration, .001),
		loop: t,
		tracks: r
	});
}
var Oe = ".morphTargetInfluences";
function ke(e, { loop: t = !1 } = {}) {
	if (!Array.isArray(e?.tracks) || !Number.isFinite(e.duration)) throw TypeError("morphClipFromGltfAnimation needs an animation from asset.animations.");
	let n = e.tracks.filter((e) => e.name.endsWith(Oe) && e.times.length).map((e) => {
		let t = e.values.length / e.times.length, n = e.getInterpolation?.() === we ? t / 3 : t;
		return {
			part: e.name.slice(0, -22),
			count: n,
			interpolant: e.createInterpolant(new Float64Array(n))
		};
	});
	return {
		duration: Math.max(e.duration, .001),
		loop: t,
		tracks: n
	};
}
function Ae(e, t) {
	return e.loop ? (t % e.duration + e.duration) % e.duration : Math.min(e.duration, Math.max(0, t));
}
function je(e) {
	let t = /* @__PURE__ */ new Map();
	return e.forEach((e, n) => {
		for (let r of e.meshIds ?? []) t.set(Number(r.slice(5)), n);
	}), t;
}
function Me(e, t, n, r) {
	let i = A(r, "Pose"), a = R(r, i), o = je(t);
	return n.filter((e) => e.morphs?.tracks.length).map((t) => {
		let n = B(i, a, t.mask), r = /* @__PURE__ */ new Map();
		for (let i of t.morphs.tracks) {
			let t = [...e.parts.keys()].filter((t) => {
				let r = e.parts[t];
				return r.name === i.part && r.morph?.weights.length === i.count && n[o.get(t)] > 0;
			});
			r.set(i, t);
		}
		return {
			morphs: t.morphs,
			partIndices: r,
			mask: n,
			owners: o,
			additive: t.additive === !0,
			speed: t.speed ?? 1,
			offset: t.offset ?? 0,
			clipTime: t.clipTime,
			label: "Morph layer",
			weight: V(t.weight ?? 1, "Morph layer weight"),
			reference: t.reference ?? 0
		};
	});
}
function Ne(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = H(r.weight, t, "Morph layer weight");
		if (e === 0) continue;
		let i = G(r, t);
		for (let t of r.morphs.tracks) {
			let a = Array.from(t.interpolant.evaluate(Ae(r.morphs, i))), o = r.additive ? Array.from(t.interpolant.evaluate(Ae(r.morphs, r.reference))) : null;
			for (let i of r.partIndices.get(t)) {
				let s = n.get(i) ?? Array(t.count).fill(0), c = e * r.mask[r.owners.get(i)];
				s.forEach((e, t) => {
					let n = o ? e + a[t] - o[t] : a[t];
					s[t] = Math.min(1, Math.max(0, e + (n - e) * c));
				}), n.set(i, s);
			}
		}
	}
	return [...n].map(([e, t]) => ({
		part: e,
		weights: t
	}));
}
function Pe(e, { rootMatrix: t } = {}) {
	let n = new Map(e.map((e, t) => [e.id, t])), r = e.filter((e) => e.joint).map((e) => e.name);
	return {
		mapping: k(r).mapping,
		...t ? { rootMatrix: t } : {},
		joints: e.map((e) => ({
			name: e.name,
			parent: e.parent === null ? -1 : n.get(e.parent),
			translation: e.translation,
			rotation: e.rotation,
			scale: e.scale
		}))
	};
}
function Fe(e, t) {
	let n = new Map(e.joints.map((e, t) => [e.name, t]));
	for (let r of t) {
		let t = e.joints[n.get(r)]?.parent ?? -1;
		for (; t >= 0;) {
			let n = e.joints[t], [i, a, o] = n.scale;
			if (Math.max(i, a, o) - Math.min(i, a, o) > .001 * Math.max(i, a, o)) throw RangeError(`IK: node ${n.name} above ${r} has non-uniform scale ${JSON.stringify(n.scale)}, which IK cannot solve through.`);
			t = n.parent;
		}
	}
}
function Ie(e, t, n) {
	if (typeof e?.stagePose != "function" || !Array.isArray(e.nodes)) throw TypeError("createAssetPose needs an asset from loadGltf or parseGltf.");
	if (!Array.isArray(t) || !Array.isArray(n)) throw TypeError("layers and ik must be arrays.");
	let r = e.nodes, i = Pe(r), a = ze({
		rig: i,
		layers: t.filter((e) => e?.clip || !e?.morphs),
		ik: n
	});
	Fe(i, a.solvedJointNames);
	let o = a.writtenJoints.filter(({ index: e }) => r[e].editable), s = Me(e, r, t, i);
	function c(e) {
		return a.apply(e), {
			nodeOverrides: o.map(({ index: e, translation: t }) => {
				let n = {
					id: r[e].id,
					rotation: Array.from(a.localRotation(e))
				};
				return t && (n.translation = Array.from(a.localTranslation(e))), n;
			}),
			morphWeights: Ne(s, e)
		};
	}
	return {
		pose: a,
		evaluate: c
	};
}
function Le(e, t) {
	return { evaluate: Ie(e, t, []).evaluate };
}
function Re(e, { layers: t = [], ik: n = [] } = {}) {
	let { pose: r, evaluate: i } = Ie(e, t, n);
	return {
		apply(t) {
			let { nodeOverrides: n, morphWeights: r } = i(t);
			return e.stagePose({
				animation: null,
				nodeOverrides: n,
				morphWeights: r
			}).commit();
		},
		jointWorld: r.jointWorld,
		get ikResults() {
			return r.ikResults;
		}
	};
}
function ze({ skin: n, rig: r = n && O(n), meshWorldMatrix: i, layers: a = [], ik: o = [] } = {}) {
	if (!r) throw TypeError("createSkeletonPose needs a skin or a rig.");
	if (j(r.joints, "Pose"), !Array.isArray(a) || !Array.isArray(o)) throw TypeError("layers and ik must be arrays.");
	let s = A(r, "Pose"), c = R(r, s), l = a.map((e, t) => ee(e, t, s, c)), u = o.map((e, t) => de(e, t, s, c)), d = new Set(u.flatMap((e) => e.type === "two-bone" ? [
		e.root,
		e.middle,
		e.end
	] : e.joints)), f = u.flatMap((e) => e.stretch > 0 ? e.stretchIndices : []), p = /* @__PURE__ */ new Set([...l.flatMap((e) => e.bindings.filter((e) => e.property === "translation").map((e) => e.index)), ...f]), m = /* @__PURE__ */ new Set([
		...d,
		...p,
		...l.flatMap((e) => e.bindings.filter((e) => e.property === "rotation").map((e) => e.index))
	]), h = r.joints.length, g = s.restRotations.map((e) => Float64Array.from(e)), _ = s.restTranslations.map((e) => Float64Array.from(e)), v = D(h), y = pe(s, v, g, _), b = new Float32Array(h * 16), x = e(), S = u.map(() => ({
		reached: !0,
		error: 0
	})), C = n?.bindMatrix ?? e(), T = i ?? C;
	function E() {
		for (let e = 0; e < h; e++) {
			let n = v.scales[e];
			t(x, v.rotations[e], v.positions[e], [
				n,
				n,
				n
			]), b.set(x, e * 16);
		}
		w(n, b, n.inverseBindMatrices, T, C);
	}
	function k(e) {
		let t = c(e, "jointWorld");
		return {
			position: Array.from(v.positions[t]),
			rotation: Array.from(v.rotations[t])
		};
	}
	return {
		apply(e, t) {
			if (!Number.isFinite(e)) throw RangeError("Pose time must be finite.");
			for (let e = 0; e < h; e++) g[e].set(s.restRotations[e]), _[e].set(s.restTranslations[e]);
			t?.(g, _);
			for (let t of l) ne(t, e, g, _);
			return y.update(), u.forEach((t, n) => {
				S[n] = be[t.type](t, e, y);
			}), n && E(), n;
		},
		jointWorld: k,
		localRotation(e) {
			return g[e];
		},
		localTranslation(e) {
			return _[e];
		},
		writtenJoints: [...m].map((e) => ({
			index: e,
			translation: p.has(e)
		})),
		solvedJointNames: [...d].map((e) => r.joints[e].name),
		get ikResults() {
			return S;
		}
	};
}
export { ke as a, N as c, ze as i, Le as n, Pe as o, Re as r, P as s, De as t };
