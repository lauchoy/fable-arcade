/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
// src/player.js
var e = Object.freeze({
	maximumSpeed: 100,
	maximumAcceleration: 1e3,
	maximumGravity: 200,
	maximumRadius: 10,
	maximumHeight: 20,
	maximumObstacles: 256,
	maximumDistance: 1e4,
	maximumSubsteps: 64,
	maximumPitch: 1.5
}), t = [
	0,
	1,
	0
];
function n(e) {
	return e === null ? "null" : typeof e;
}
function r(e, t, n, r, i, a) {
	let o = n ?? r;
	if (!Number.isFinite(o) || o < i || o > a) throw RangeError(`${e} ${t} must be a number from ${i} to ${a}, got ${String(o)}.`);
	return o;
}
function i(t, n, r, i) {
	let a = r ?? i, o = e.maximumDistance;
	if (!Array.isArray(a) || a.length !== 3 || !a.every((e) => Number.isFinite(e) && Math.abs(e) <= o)) throw TypeError(`${t} ${n} must be an array of 3 finite numbers within ${o}, such as [0, 0, 0], got ${JSON.stringify(a)}.`);
	return [...a];
}
function a(e, t) {
	if (!(typeof t == "object" && t && [
		"getAxis",
		"isHeld",
		"wasPressed"
	].every((e) => typeof t[e] == "function"))) throw TypeError(`${e} needs options.input: the object from createInput() with getAxis, isHeld and wasPressed, got ${n(t)}.`);
	return t;
}
function o(e) {
	return [
		Math.sin(e),
		0,
		-Math.cos(e)
	];
}
function s(e) {
	return [
		Math.cos(e),
		0,
		Math.sin(e)
	];
}
function c(e) {
	let t = (e + Math.PI) % (2 * Math.PI);
	return (t < 0 ? t + 2 * Math.PI : t) - Math.PI;
}
function l(e, t, n) {
	return Math.max(t, Math.min(n, e));
}
function u(e, t, n) {
	return e.map((e, r) => e + (t[r] - e) * n);
}
function d(t) {
	if (!Array.isArray(t) || t.length > e.maximumObstacles) throw RangeError(`createKinematicMover obstacles must be an array of at most ${e.maximumObstacles} boxes like { min: [x, y, z], max: [x, y, z] }.`);
	return t.map((e, t) => {
		let n = `obstacles[${t}]`, r = i("createKinematicMover", `${n}.min`, e?.min), a = i("createKinematicMover", `${n}.max`, e?.max);
		if (r.some((e, t) => e > a[t])) throw RangeError(`createKinematicMover ${n} min must not exceed max on any axis, got min ${JSON.stringify(r)} and max ${JSON.stringify(a)}.`);
		return {
			min: r,
			max: a
		};
	});
}
function f(t = {}) {
	let r = t.ground ?? 0;
	if (typeof r != "function" && !Number.isFinite(r)) throw TypeError(`createKinematicMover ground must be a height number or a function (x, z) => height, got ${n(r)}.`);
	let i = d(t.obstacles ?? []);
	function a(e, t) {
		let n = typeof r == "function" ? r(e, t) : r;
		if (!Number.isFinite(n)) throw RangeError(`createKinematicMover ground(${e}, ${t}) must return a finite height, got ${String(n)}.`);
		return n;
	}
	function o(e, t, n, r, o) {
		let s = a(e, t);
		for (let { min: a, max: c } of i) e >= a[0] - n && e <= c[0] + n && t >= a[2] - n && t <= c[2] + n && a[1] <= r + o && (s = Math.max(s, c[1]));
		return s;
	}
	function s(t, n) {
		let [r, i, a] = t.position, { radius: s, stepHeight: c } = t, u = Math.hypot(n[0], n[2]), d = l(Math.ceil(u / s), 1, e.maximumSubsteps), f = r, p = a;
		for (let e = 0; e < d; e += 1) {
			let e = f + n[0] / d;
			o(e, p, s, i, c) <= i + c && (f = e);
			let t = p + n[2] / d;
			o(f, t, s, i, c) <= i + c && (p = t);
		}
		let m = o(f, p, s, i, c), h = i + n[1];
		return h <= m || t.grounded && n[1] <= 0 && h - m <= c ? {
			position: [
				f,
				m,
				p
			],
			grounded: !0
		} : {
			position: [
				f,
				h,
				p
			],
			grounded: !1
		};
	}
	return {
		move: s,
		groundHeight: a
	};
}
function p(e, t) {
	if (typeof t != "object" || !t || typeof t.move != "function") throw TypeError(`${e} mover must be an object with move(body, displacement, stepSeconds) => { position, grounded }, such as createKinematicMover(), got ${n(t)}.`);
	return t;
}
function m(e, t) {
	if (!(Array.isArray(t?.position) && t.position.length === 3 && t.position.every(Number.isFinite)) || typeof t.grounded != "boolean") throw TypeError(`${e} mover.move must return { position: [x, y, z], grounded: boolean }, got ${JSON.stringify(t)}.`);
	return t;
}
function h(t = {}) {
	let d = "createCharacterController", h = a(d, t.input), g = p(d, t.mover ?? f({
		ground: t.ground,
		obstacles: t.obstacles
	})), _ = {
		walkSpeed: r(d, "walkSpeed", t.walkSpeed, 3, 0, e.maximumSpeed),
		runSpeed: r(d, "runSpeed", t.runSpeed, 6, 0, e.maximumSpeed),
		jumpSpeed: r(d, "jumpSpeed", t.jumpSpeed, 7, 0, e.maximumSpeed),
		gravity: r(d, "gravity", t.gravity, 20, 0, e.maximumGravity),
		acceleration: r(d, "acceleration", t.acceleration, 40, .01, e.maximumAcceleration),
		airControl: r(d, "airControl", t.airControl, .3, 0, 1),
		turnSpeed: r(d, "turnSpeed", t.turnSpeed, 12, 0, 100),
		radius: r(d, "radius", t.radius, .4, .01, e.maximumRadius),
		height: r(d, "height", t.height, 1.8, .01, e.maximumHeight),
		stepHeight: r(d, "stepHeight", t.stepHeight, .4, 0, e.maximumHeight)
	}, v = {
		moveX: t.moveX ?? "moveX",
		moveForward: t.moveForward ?? "moveForward",
		jump: t.jump ?? "jump",
		run: t.run ?? "run"
	}, y = t.rootMotion;
	if (y !== void 0 && typeof y != "function") throw TypeError(`${d} rootMotion must be a function () => [x, z] giving the travel of the last animation step, such as () => graph.rootMotion.delta, got ${n(y)}.`);
	let b = t.faceCamera ?? !1, x = t.cameraYaw ?? 0;
	if (typeof x != "function" && !Number.isFinite(x)) throw TypeError(`${d} cameraYaw must be a yaw in radians or a function returning one, such as () => rig.yaw, got ${n(x)}.`);
	let S = D(d, t.node), C = i(d, "position", t.position, [
		0,
		0,
		0
	]), w = {
		position: C,
		previousPosition: [...C],
		velocity: [
			0,
			0,
			0
		],
		yaw: r(d, "yaw", t.yaw, 0, -1e3, 1e3),
		grounded: !1,
		airborne: !0,
		speed: 0,
		intentSpeed: 0,
		running: !1
	};
	function T() {
		O(S, w.position, w.yaw);
	}
	function E() {
		let e = typeof x == "function" ? x() : x;
		if (!Number.isFinite(e)) throw TypeError(`${d} cameraYaw must give a finite number of radians, got ${String(e)}.`);
		return e;
	}
	function k(e, t) {
		let n = c(e - w.yaw), r = _.turnSpeed * t;
		w.yaw = c(w.yaw + l(n, -r, r));
	}
	function A(e) {
		let t = y();
		if (!(Array.isArray(t) && t.length === 2 && t.every(Number.isFinite))) throw TypeError(`${d} rootMotion must return [x, z] as finite numbers, such as graph.rootMotion.delta, got ${JSON.stringify(t)}.`);
		let n = o(w.yaw), r = s(w.yaw);
		e[0] = r[0] * t[0] - n[0] * t[1], e[2] = r[2] * t[0] - n[2] * t[1];
	}
	function j(t) {
		if (!(t > 0)) return;
		w.previousPosition = [...w.position];
		let n = h.getAxis(v.moveX), r = h.getAxis(v.moveForward), i = Math.min(1, Math.hypot(n, r)), a = i > 0 ? i / Math.hypot(n, r) : 0, c = E(), l = o(c), u = s(c);
		w.running = h.isHeld(v.run);
		let f = w.running ? _.runSpeed : _.walkSpeed, p = (l[0] * r + u[0] * n) * a * f, x = (l[2] * r + u[2] * n) * a * f;
		w.intentSpeed = Math.hypot(p, x);
		let S = w.grounded ? 1 : _.airControl, C = _.acceleration * S * t, D = p - w.velocity[0], O = x - w.velocity[2], j = Math.hypot(D, O), M = j > C ? C / j : 1;
		w.velocity[0] += D * M, w.velocity[2] += O * M, b ? k(c, t) : i > .1 && k(Math.atan2(p, -x), t), w.grounded && h.wasPressed(v.jump) && (w.velocity[1] = _.jumpSpeed, w.grounded = !1), w.velocity[1] = Math.max(-e.maximumSpeed, w.velocity[1] - _.gravity * t);
		let N = {
			position: [...w.position],
			velocity: [...w.velocity],
			radius: _.radius,
			height: _.height,
			stepHeight: _.stepHeight,
			grounded: w.grounded
		}, P = w.velocity.map((e) => e * t);
		y && w.grounded && A(P);
		let F = m(d, g.move(N, P, t));
		w.velocity[0] = (F.position[0] - w.position[0]) / t, w.velocity[2] = (F.position[2] - w.position[2]) / t, F.grounded && w.velocity[1] <= 0 && (w.velocity[1] = 0), w.position = [...F.position], w.grounded = F.grounded, w.airborne = !F.grounded, w.speed = Math.hypot(w.velocity[0], w.velocity[2]), T();
	}
	let M = {
		name: t.name ?? "player",
		kind: "character",
		state: w,
		positionAt: (e) => u(w.previousPosition, w.position, e),
		teleport(e, t = w.yaw) {
			return w.position = i(d, "teleport position", e), w.previousPosition = [...w.position], w.velocity = [
				0,
				0,
				0
			], w.yaw = r(d, "teleport yaw", t, 0, -1e3, 1e3), w.grounded = !1, w.airborne = !0, T(), M;
		},
		init: T,
		fixedUpdate: j,
		update(e, t) {
			t?.mode === "variable" && j(e);
		}
	};
	return M;
}
var g = Object.freeze({
	follow: {
		pitch: .35,
		minimumPitch: -.2,
		maximumPitch: 1.3,
		distance: 5,
		lookHeight: 1.5,
		followSeconds: .12,
		lookAxes: !0
	},
	firstPerson: {
		pitch: 0,
		minimumPitch: -1.4,
		maximumPitch: 1.4,
		eyeHeight: 1.6,
		followSeconds: 0,
		lookAxes: !0
	},
	topDown: {
		pitch: 1.2,
		minimumPitch: .5,
		maximumPitch: 1.5,
		distance: 12,
		lookHeight: 0,
		followSeconds: .2,
		lookAxes: !1
	},
	orbit: {
		pitch: .4,
		minimumPitch: -1.4,
		maximumPitch: 1.4,
		distance: 6,
		lookHeight: 1,
		followSeconds: .05,
		lookAxes: !0
	},
	chase: {
		pitch: .25,
		minimumPitch: -.2,
		maximumPitch: 1.3,
		distance: 7,
		lookHeight: 1.2,
		followSeconds: .1,
		lookAxes: !1,
		yawFollowSeconds: .3
	},
	sideScroller: {
		pitch: 0,
		minimumPitch: 0,
		maximumPitch: 0,
		distance: 10,
		lookHeight: 1,
		followSeconds: .25,
		lookAxes: !1,
		lookAhead: 2
	}
});
function _(e, t, n) {
	let r = t.yaw, i = t.pitch;
	if (e === "firstPerson") {
		let e = [
			n[0],
			n[1] + t.eyeHeight,
			n[2]
		], a = Math.cos(i), o = [
			Math.sin(r) * a,
			Math.sin(i),
			-Math.cos(r) * a
		];
		return {
			eye: e,
			target: e.map((e, t) => e + o[t])
		};
	}
	if (e === "sideScroller") {
		let e = [
			n[0],
			n[1] + t.lookHeight,
			n[2]
		];
		return {
			eye: [
				e[0],
				e[1],
				e[2] + t.distance
			],
			target: e
		};
	}
	let a = [
		n[0],
		n[1] + t.lookHeight,
		n[2]
	], s = o(r), c = t.distance * Math.cos(i), l = [
		a[0] - s[0] * c,
		a[1] + t.distance * Math.sin(i),
		a[2] - s[2] * c
	];
	return {
		eye: t.clipEye ? t.clipEye(a, l) : l,
		target: a
	};
}
function v(i, o) {
	let s = `create${i[0].toUpperCase()}${i.slice(1)}Camera`, d = g[i], f = o.subject;
	if (typeof f != "object" || !f || !Array.isArray(f.position)) throw TypeError(`${s} needs options.subject: a controller's state (controller.state) or any { position: [x, y, z], yaw }, got ${n(f)}.`);
	if (o.clipEye !== void 0 && typeof o.clipEye != "function") throw TypeError(`${s} clipEye must be a function (target, eye) => eye, or left out, got ${n(o.clipEye)}.`);
	let p = d.lookAxes ? {
		x: o.lookX ?? "lookX",
		y: o.lookY ?? "lookY"
	} : {
		x: o.lookX,
		y: o.lookY
	}, m = p.x !== null && p.x !== void 0, h = m || p.y || o.zoom ? a(s, o.input) : o.input, v = r(s, "minimumPitch", o.minimumPitch, d.minimumPitch, -e.maximumPitch, e.maximumPitch), y = r(s, "maximumPitch", o.maximumPitch, d.maximumPitch, v, e.maximumPitch), b = r(s, "lookSpeed", o.lookSpeed, 2.5, 0, 100), x = r(s, "followSeconds", o.followSeconds, d.followSeconds, 0, 10), S = r(s, "yawFollowSeconds", o.yawFollowSeconds, d.yawFollowSeconds ?? 0, 0, 10), C = o.zoom ?? null, w = r(s, "minimumDistance", o.minimumDistance, 1, .1, e.maximumDistance), T = r(s, "maximumDistance", o.maximumDistance, 50, w, e.maximumDistance), E = r(s, "zoomSpeed", o.zoomSpeed, 8, 0, 1e3), D = {
		name: o.name ?? "camera",
		kind: i,
		subject: f,
		yaw: r(s, "yaw", o.yaw, f.yaw ?? 0, -1e3, 1e3),
		pitch: l(r(s, "pitch", o.pitch, d.pitch, -e.maximumPitch, e.maximumPitch), v, y),
		distance: r(s, "distance", o.distance, d.distance ?? 0, d.distance === void 0 ? 0 : .1, e.maximumDistance),
		lookHeight: r(s, "lookHeight", o.lookHeight, d.lookHeight ?? 0, -e.maximumHeight, e.maximumHeight),
		eyeHeight: r(s, "eyeHeight", o.eyeHeight, d.eyeHeight ?? 0, 0, e.maximumHeight),
		clipEye: o.clipEye,
		lookAhead: r(s, "lookAhead", o.lookAhead, d.lookAhead ?? 0, 0, e.maximumDistance),
		focus: [...f.position],
		previousFocus: [...f.position]
	};
	function O(e) {
		if (m && (D.yaw = c(D.yaw + h.getAxis(p.x) * b * e)), p.y && (D.pitch = l(D.pitch + h.getAxis(p.y) * b * e, v, y)), C !== null && (D.distance = l(D.distance - h.getAxis(C) * E * e, w, T)), S > 0) {
			let t = 1 - Math.exp(-e / S);
			D.yaw = c(D.yaw + c((D.subject.yaw ?? D.yaw) - D.yaw) * t);
		}
		D.previousFocus = D.focus;
		let t = x === 0 ? 1 : 1 - Math.exp(-e / x);
		D.focus = u(D.focus, k(), t);
	}
	function k() {
		let e = D.subject.position;
		if (i !== "sideScroller" || D.lookAhead === 0) return e;
		let t = D.subject.velocity?.[0] ?? 0;
		return [
			e[0] + D.lookAhead * l(t / 5, -1, 1),
			e[1],
			e[2]
		];
	}
	return D.init = () => {
		D.focus = [...k()], D.previousFocus = [...D.focus];
	}, D.fixedUpdate = O, D.update = (e, t) => {
		t?.mode === "variable" && O(e);
	}, D.pose = (e) => {
		let n = u(D.previousFocus, D.focus, e?.alpha ?? 1);
		return {
			..._(i, D, n),
			up: t
		};
	}, D;
}
function y(e = {}) {
	return v("follow", e);
}
function b(e = {}) {
	return v("firstPerson", e);
}
function x(e = {}) {
	return v("topDown", e);
}
function S(e = {}) {
	return v("orbit", e);
}
function C(e = {}) {
	return v("chase", e);
}
function w(e = {}) {
	return v("sideScroller", e);
}
var T = 0;
function E(e = {}) {
	let t = "createCameraClip", i = r(t, "padding", e.padding, .25, 0, 10), a = d(e.obstacles ?? []).map(({ min: e, max: t }) => ({
		min: e.map((e) => e - i),
		max: t.map((e) => e + i)
	})), o = e.ground ?? 0;
	if (typeof o != "function" && !Number.isFinite(o)) throw TypeError(`${t} ground must be a height number or a function (x, z) => height, got ${n(o)}.`);
	let s = (e, t) => {
		let n = typeof o == "function" ? o(e, t) : o;
		return Number.isFinite(n) ? n : T;
	};
	function c(e, t, n) {
		let r = 0, i = 1;
		for (let a = 0; a < 3; a += 1) {
			if (t[a] === 0) {
				if (e[a] < n.min[a] || e[a] > n.max[a]) return 1;
				continue;
			}
			let o = (n.min[a] - e[a]) / t[a], s = (n.max[a] - e[a]) / t[a];
			r = Math.max(r, Math.min(o, s)), i = Math.min(i, Math.max(o, s));
		}
		return r > i || i < 0 ? 1 : r;
	}
	function l(e, t, n) {
		let r = e[0] + t[0] * n, a = e[2] + t[2] * n;
		return e[1] + t[1] * n < s(r, a) + i;
	}
	return function(e, t) {
		let n = t.map((t, n) => t - e[n]), r = 1;
		for (let t of a) r = Math.min(r, c(e, n, t));
		for (let t = 1; t <= 24; t += 1) {
			let i = r * t / 24;
			if (!l(e, n, i)) continue;
			let a = r * (t - 1) / 24, o = i;
			for (let t = 0; t < 8; t += 1) {
				let t = (a + o) / 2;
				l(e, n, t) ? o = t : a = t;
			}
			r = a;
			break;
		}
		return e.map((e, t) => e + n[t] * r);
	};
}
function D(e, t) {
	if (t !== void 0 && (typeof t != "object" || !t || !Array.isArray(t.position))) throw TypeError(`${e} node must be an object with a position array, such as { position: [0, 0, 0] }, got ${n(t)}.`);
	return t;
}
function O(e, t, n) {
	e && (e.position[0] = t[0], e.position[1] = t[1], e.position[2] = t[2], "rotationY" in e && (e.rotationY = -n));
}
function k(e) {
	let { state: t, writeNode: n, advance: r, teleport: i } = e, a = {
		name: e.name,
		kind: e.kind,
		state: t,
		positionAt: (e) => u(t.previousPosition, t.position, e),
		teleport(e, t) {
			return i(e, t), n(), a;
		},
		init: n,
		fixedUpdate: r,
		update(e, t) {
			t?.mode === "variable" && e > 0 && r(e);
		}
	};
	return a;
}
function A(t, n) {
	let i = e.maximumSpeed, a = e.maximumAcceleration;
	return {
		maximumSpeed: r(t, "maximumSpeed", n.maximumSpeed, 20, 0, i),
		reverseSpeed: r(t, "reverseSpeed", n.reverseSpeed, 6, 0, i),
		acceleration: r(t, "acceleration", n.acceleration, 12, .01, a),
		brakeDeceleration: r(t, "brakeDeceleration", n.brakeDeceleration, 25, .01, a),
		coastDeceleration: r(t, "coastDeceleration", n.coastDeceleration, 4, 0, a),
		wheelbase: r(t, "wheelbase", n.wheelbase, 2.5, .1, e.maximumRadius),
		maximumSteer: r(t, "maximumSteer", n.maximumSteer, .6, .01, 1.4),
		steerSeconds: r(t, "steerSeconds", n.steerSeconds, .15, .001, 10),
		gravity: r(t, "gravity", n.gravity, 20, 0, e.maximumGravity),
		radius: r(t, "radius", n.radius, 1, .01, e.maximumRadius),
		height: r(t, "height", n.height, 1.5, .01, e.maximumHeight),
		stepHeight: r(t, "stepHeight", n.stepHeight, .4, 0, e.maximumHeight)
	};
}
function j(t = {}) {
	let n = "createVehicleController", s = a(n, t.input), u = p(n, t.mover ?? f({
		ground: t.ground,
		obstacles: t.obstacles
	})), d = A(n, t), h = {
		steer: t.steer ?? "moveX",
		throttle: t.throttle ?? "moveForward",
		brake: t.brake ?? "jump"
	}, g = D(n, t.node), _ = i(n, "position", t.position, [
		0,
		0,
		0
	]), v = {
		position: _,
		previousPosition: [..._],
		velocity: [
			0,
			0,
			0
		],
		yaw: r(n, "yaw", t.yaw, 0, -1e3, 1e3),
		forwardSpeed: 0,
		speed: 0,
		steer: 0,
		grounded: !1,
		airborne: !0,
		braking: !1
	};
	function y() {
		O(g, v.position, v.yaw);
	}
	function b(e, t, n) {
		let r = t * n;
		v.forwardSpeed += l(e - v.forwardSpeed, -r, r);
	}
	function x(e, t) {
		if (v.braking = s.isHeld(h.brake), v.braking) b(0, d.brakeDeceleration, t);
		else if (e > 0) {
			let n = v.forwardSpeed < 0 ? d.brakeDeceleration : d.acceleration;
			b(e * d.maximumSpeed, n, t);
		} else if (e < 0) {
			let n = v.forwardSpeed > .1 ? d.brakeDeceleration : d.acceleration;
			b(e * d.reverseSpeed, n, t);
		} else b(0, d.coastDeceleration, t);
	}
	function S(t) {
		if (!(t > 0)) return;
		v.previousPosition = [...v.position], x(l(s.getAxis(h.throttle), -1, 1), t);
		let r = l(s.getAxis(h.steer), -1, 1);
		v.steer += (r - v.steer) * (1 - Math.exp(-t / d.steerSeconds));
		let i = v.forwardSpeed / d.wheelbase * Math.tan(v.steer * d.maximumSteer);
		v.yaw = c(v.yaw + i * t);
		let a = o(v.yaw), f = v.grounded ? 0 : Math.max(-e.maximumSpeed, v.velocity[1] - d.gravity * t), p = [
			a[0] * v.forwardSpeed * t,
			f * t,
			a[2] * v.forwardSpeed * t
		], g = {
			position: [...v.position],
			velocity: [...v.velocity],
			grounded: v.grounded,
			radius: d.radius,
			height: d.height,
			stepHeight: d.stepHeight
		}, _ = m(n, u.move(g, p, t)), b = (_.position[0] - v.position[0]) / t, S = (_.position[2] - v.position[2]) / t;
		v.forwardSpeed = b * a[0] + S * a[2], v.velocity = [
			b,
			_.grounded ? 0 : f,
			S
		], v.position = [..._.position], v.grounded = _.grounded, v.airborne = !_.grounded, v.speed = Math.abs(v.forwardSpeed), y();
	}
	return k({
		name: t.name ?? "vehicle",
		kind: "vehicle",
		state: v,
		writeNode: y,
		advance: S,
		teleport(e, t) {
			v.position = i(n, "teleport position", e), v.previousPosition = [...v.position], v.velocity = [
				0,
				0,
				0
			], v.forwardSpeed = 0, v.yaw = r(n, "teleport yaw", t, v.yaw, -1e3, 1e3), v.grounded = !1, v.airborne = !0;
		}
	});
}
function M(t, n) {
	let i = e.maximumSpeed, a = r(t, "maximumPitch", n.maximumPitch, 1.2, 0, e.maximumPitch);
	return {
		cruiseSpeed: r(t, "cruiseSpeed", n.cruiseSpeed, 14, 0, i),
		boostSpeed: r(t, "boostSpeed", n.boostSpeed, 24, 0, i),
		brakeSpeed: r(t, "brakeSpeed", n.brakeSpeed, 6, 0, i),
		acceleration: r(t, "acceleration", n.acceleration, 10, .01, e.maximumAcceleration),
		turnRate: r(t, "turnRate", n.turnRate, 1.4, 0, 20),
		pitchRate: r(t, "pitchRate", n.pitchRate, 1.1, 0, 20),
		maximumPitch: a,
		levelSeconds: r(t, "levelSeconds", n.levelSeconds, .6, .001, 100),
		radius: r(t, "radius", n.radius, .8, .01, e.maximumRadius),
		height: r(t, "height", n.height, .6, .01, e.maximumHeight)
	};
}
function N(e = {}) {
	let t = "createFlightController", n = a(t, e.input), o = p(t, e.mover ?? f({
		ground: e.ground,
		obstacles: e.obstacles
	})), s = M(t, e), u = {
		yaw: e.yawAxis ?? "moveX",
		pitch: e.pitchAxis ?? "moveForward",
		boost: e.boost ?? "run",
		brake: e.brake ?? "jump"
	}, d = D(t, e.node), h = i(t, "position", e.position, [
		0,
		10,
		0
	]), g = {
		position: h,
		previousPosition: [...h],
		velocity: [
			0,
			0,
			0
		],
		yaw: r(t, "yaw", e.yaw, 0, -1e3, 1e3),
		pitch: r(t, "pitch", e.pitch, 0, -s.maximumPitch, s.maximumPitch),
		roll: 0,
		speed: s.cruiseSpeed,
		grounded: !1,
		airborne: !0,
		boosting: !1
	};
	function _() {
		O(d, g.position, g.yaw), d && "rotationX" in d && (d.rotationX = g.pitch), d && "rotationZ" in d && (d.rotationZ = g.roll);
	}
	function v(e) {
		let t = l(n.getAxis(u.yaw), -1, 1), r = l(n.getAxis(u.pitch), -1, 1);
		g.yaw = c(g.yaw + t * s.turnRate * e), r === 0 ? g.pitch -= g.pitch * (1 - Math.exp(-e / s.levelSeconds)) : g.pitch += r * s.pitchRate * e, g.pitch = l(g.pitch, -s.maximumPitch, s.maximumPitch), g.roll += (-t * .6 - g.roll) * (1 - Math.exp(-e / .2));
	}
	function y(e) {
		g.boosting = n.isHeld(u.boost);
		let t = s.cruiseSpeed;
		n.isHeld(u.brake) ? t = s.brakeSpeed : g.boosting && (t = s.boostSpeed);
		let r = s.acceleration * e;
		g.speed += l(t - g.speed, -r, r);
	}
	function b(e) {
		if (!(e > 0)) return;
		g.previousPosition = [...g.position], v(e), y(e);
		let n = Math.cos(g.pitch), r = [
			Math.sin(g.yaw) * n,
			Math.sin(g.pitch),
			-Math.cos(g.yaw) * n
		].map((t) => t * g.speed * e), i = {
			position: [...g.position],
			velocity: [...g.velocity],
			grounded: !1,
			radius: s.radius,
			height: s.height,
			stepHeight: 0
		}, a = m(t, o.move(i, r, e));
		g.velocity = a.position.map((t, n) => (t - g.position[n]) / e), g.position = [...a.position], g.grounded = a.grounded, g.airborne = !a.grounded, g.grounded && g.pitch < 0 && (g.pitch = 0), _();
	}
	return k({
		name: e.name ?? "flyer",
		kind: "flight",
		state: g,
		writeNode: _,
		advance: b,
		teleport(e, n) {
			g.position = i(t, "teleport position", e), g.previousPosition = [...g.position], g.velocity = [
				0,
				0,
				0
			], g.yaw = r(t, "teleport yaw", n, g.yaw, -1e3, 1e3), g.pitch = 0, g.grounded = !1, g.airborne = !0;
		}
	});
}
var P = 64, F = /* @__PURE__ */ new Map([
	["character", h],
	["vehicle", j],
	["flight", N]
]), I = /* @__PURE__ */ new Map([
	["follow", y],
	["firstPerson", b],
	["topDown", x],
	["orbit", S],
	["chase", C],
	["sideScroller", w]
]);
function L(e, t, r, i) {
	if (typeof r != "string" || r.length === 0 || r.length > 64) throw TypeError(`${e} kind must be a non-empty string of at most 64 characters, such as "boat", got ${n(r)}.`);
	if (typeof i != "function") throw TypeError(`${e} factory for "${r}" must be a function (options) => runtime system, got ${n(i)}.`);
	if (t.has(r)) throw RangeError(`${e} kind "${r}" is already registered. Pick another name; kinds cannot be replaced.`);
	if (t.size >= P) throw RangeError(`${e} holds at most ${P} kinds.`);
	t.set(r, i);
}
function R(e, t, n, r) {
	let i = t.get(n);
	if (!i) throw RangeError(`${e} has no kind "${n}". Registered kinds: ${[...t.keys()].join(", ")}.`);
	return i(r);
}
function z(e, t) {
	L("registerController", F, e, t);
}
function B(e, t) {
	L("registerCameraRig", I, e, t);
}
function V() {
	return [...F.keys()];
}
function H() {
	return [...I.keys()];
}
function U(e, t = {}) {
	let n = R("createController", F, e, t);
	if (!(n?.state && Array.isArray(n.state.position)) || typeof n.fixedUpdate != "function" && typeof n.update != "function") throw TypeError(`createController kind "${e}" must return a runtime system with state.position and a fixedUpdate or update function.`);
	return n;
}
function W(e, t = {}) {
	let n = R("createCameraRigOfKind", I, e, t);
	if (typeof n?.pose != "function") throw TypeError(`createCameraRigOfKind kind "${e}" must return a rig with pose(context) giving { eye, target, up }.`);
	return n;
}
function G(e, t, n, r = {}) {
	let i = e.getSystem(t);
	if (!i?.state) throw RangeError(`replaceController found no controller system named "${t}" in the runtime.`);
	let a = U(n, {
		position: [...i.state.position],
		yaw: i.state.yaw,
		name: t,
		...r
	});
	return e.replaceSystem(t, a), a;
}
function K(e, t, n, r = {}) {
	let i = e.getSystem(t);
	if (!i?.subject) throw RangeError(`replaceCameraRig found no camera rig system named "${t}" in the runtime.`);
	let a = W(n, {
		subject: i.subject,
		yaw: i.yaw,
		name: t,
		...r
	});
	return e.replaceSystem(t, a), a;
}
export { e as PLAYER_LIMITS, E as createCameraClip, W as createCameraRigOfKind, h as createCharacterController, C as createChaseCamera, U as createController, b as createFirstPersonCamera, N as createFlightController, y as createFollowCamera, f as createKinematicMover, S as createOrbitCamera, w as createSideScrollerCamera, x as createTopDownCamera, j as createVehicleController, H as listCameraRigKinds, V as listControllerKinds, B as registerCameraRig, z as registerController, K as replaceCameraRig, G as replaceController };
