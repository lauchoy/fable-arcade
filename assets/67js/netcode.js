/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
// src/netcode.js
var e = Object.freeze(["server", "host"]), t = Object.freeze(["authority", "client"]), n = Object.freeze({
	maximumEntities: 256,
	maximumPeers: 32,
	maximumNameLength: 64,
	maximumVariablesPerEntity: 16,
	maximumInputKeys: 16,
	maximumInputsPerMessage: 8,
	maximumQueuedInputsPerPeer: 64,
	maximumPendingInputs: 128,
	maximumSnapshotHistory: 64,
	maximumSamplesPerEntity: 32,
	maximumInputRedundancy: 8,
	maximumInputsPerStep: 8,
	maximumCoordinate: 1e5,
	maximumMessageBytes: 1048576,
	defaultMessageBytes: 65536
}), r = 5e3, i = Object.freeze({
	snapshotEveryTicks: 2,
	inputRedundancy: 3,
	inputBufferSteps: 3,
	interpolationDelaySeconds: .1,
	maximumExtrapolationSeconds: .25,
	clockCorrectionRate: .1,
	positionStep: .01,
	rotationStep: .001,
	velocityStep: .01,
	variableStep: .01,
	movementSpeed: 5
}), a = Object.freeze([
	Object.freeze({
		wire: "p",
		name: "position",
		length: 3,
		stepOption: "positionStep"
	}),
	Object.freeze({
		wire: "r",
		name: "rotation",
		length: 4,
		stepOption: "rotationStep"
	}),
	Object.freeze({
		wire: "v",
		name: "velocity",
		length: 3,
		stepOption: "velocityStep"
	})
]), o = 0xe8d4a51000;
function s(e) {
	return e === null ? "null" : typeof e;
}
function c(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function l(e, t) {
	if (typeof e != "string" || e === "" || e.length > n.maximumNameLength) throw TypeError(`${t} must be a string of 1 to ${n.maximumNameLength} characters, got ${typeof e == "string" ? `${e.length} characters` : s(e)}.`);
	return e;
}
function u(e, t, n, r) {
	if (!Number.isFinite(e) || e < n || e > r) throw RangeError(`${t} must be a number from ${n} to ${r}, got ${String(e)}.`);
	return e;
}
function d(e, t, n, r) {
	if (!Number.isInteger(e) || e < n || e > r) throw RangeError(`${t} must be an integer from ${n} to ${r}, got ${String(e)}.`);
	return e;
}
function f(e) {
	let t = e >>> 0;
	return () => {
		t = t + 1831565813 >>> 0;
		let e = Math.imul(t ^ t >>> 15, t | 1);
		return e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
function p(e, t) {
	if (!c(e)) throw TypeError(`${t} needs a transport: an object like { id, peers(), send(peerId, message), receive(callback) }, got ${s(e)}.`);
	l(e.id, `${t} transport.id`);
	for (let n of [
		"peers",
		"send",
		"receive"
	]) if (typeof e[n] != "function") throw TypeError(`${t} transport.${n} must be a function. A transport is { id, peers(), send(peerId, message), receive(callback) }.`);
}
function m(e, t, r) {
	if (!Array.isArray(e) || e.length !== t) throw TypeError(`${r} must be an array of ${t} numbers, got ${Array.isArray(e) ? `${e.length} entries` : s(e)}.`);
	return e.map((e, t) => u(e, `${r}[${t}]`, -n.maximumCoordinate, n.maximumCoordinate));
}
function h(e, t) {
	if (!c(e)) throw TypeError(`${t} must be an object of named numbers like { score: 3 }, got ${s(e)}.`);
	let r = Object.keys(e);
	if (r.length > n.maximumVariablesPerEntity) throw RangeError(`${t} holds ${r.length} variables; at most ${n.maximumVariablesPerEntity} are synced per entity.`);
	let i = {};
	for (let a of r) l(a, `${t} variable name`), i[a] = u(e[a], `${t}.${a}`, -n.maximumCoordinate, n.maximumCoordinate);
	return i;
}
function g(e, t, n = null) {
	if (!c(e)) throw TypeError(`${t} must be an object like { position, rotation, velocity, variables }, got ${s(e)}.`);
	return {
		position: e.position === void 0 ? [...n?.position ?? [
			0,
			0,
			0
		]] : m(e.position, 3, `${t}.position`),
		rotation: e.rotation === void 0 ? [...n?.rotation ?? [
			0,
			0,
			0,
			1
		]] : m(e.rotation, 4, `${t}.rotation`),
		velocity: e.velocity === void 0 ? [...n?.velocity ?? [
			0,
			0,
			0
		]] : m(e.velocity, 3, `${t}.velocity`),
		variables: e.variables === void 0 ? { ...n?.variables ?? {} } : h(e.variables, `${t}.variables`)
	};
}
function _(e) {
	return {
		position: [...e.position],
		rotation: [...e.rotation],
		velocity: [...e.velocity],
		variables: { ...e.variables }
	};
}
function v(e, t) {
	return Math.hypot(e[0] - t[0], e[1] - t[1], e[2] - t[2]);
}
function y(e, t) {
	if (!c(e)) throw TypeError(`${t} must be an object of numbers and booleans like { moveX: 1, jump: true }, got ${s(e)}.`);
	let r = Object.keys(e);
	if (r.length > n.maximumInputKeys) throw RangeError(`${t} has ${r.length} keys; at most ${n.maximumInputKeys} are sent per input.`);
	let i = {};
	for (let a of r) {
		l(a, `${t} key`);
		let r = e[a];
		i[a] = typeof r == "boolean" ? r : u(r, `${t}.${a}`, -n.maximumCoordinate, n.maximumCoordinate);
	}
	return i;
}
function b(e = {}) {
	let t = u(e.speed ?? i.movementSpeed, "createPlanarMovement speed", 0, 1e3);
	return function(e, n, r) {
		let i = Math.max(-1, Math.min(1, Number(n.moveX) || 0)), a = Math.max(-1, Math.min(1, Number(n.moveZ) || 0)), o = [
			i * t,
			0,
			a * t
		], s = [
			e.position[0] + o[0] * r,
			e.position[1],
			e.position[2] + o[2] * r
		];
		return {
			...e,
			position: s,
			velocity: o
		};
	};
}
function x(e, t, n) {
	let r = {};
	t !== null && (r.t = t);
	for (let t of a) {
		let i = n[t.stepOption];
		r[t.wire] = e[t.name].map((e) => Math.round(e / i));
	}
	r.x = {};
	for (let [t, i] of Object.entries(e.variables)) r.x[t] = Math.round(i / n.variableStep);
	return r;
}
function S(e, t) {
	let n = {};
	for (let r of a) {
		let i = t[r.stepOption];
		n[r.name] = e[r.wire].map((e) => e * i);
	}
	n.variables = {};
	for (let [r, i] of Object.entries(e.x)) n.variables[r] = i * t.variableStep;
	return n;
}
function C(e, t) {
	return e.length === t.length && e.every((e, n) => e === t[n]);
}
function w(e, t) {
	if (!e) return t;
	let n = {};
	for (let r of a) C(e[r.wire], t[r.wire]) || (n[r.wire] = t[r.wire]);
	let r = {};
	for (let [n, i] of Object.entries(t.x)) e.x[n] !== i && (r[n] = i);
	for (let n of Object.keys(e.x)) n in t.x || (r[n] = null);
	return Object.keys(r).length > 0 && (n.x = r), Object.keys(n).length > 0 ? n : null;
}
function T(e, t) {
	let n = { ...e ?? {} };
	t.t !== void 0 && (n.t = t.t);
	for (let e of a) t[e.wire] !== void 0 && (n[e.wire] = t[e.wire]);
	let r = { ...e?.x ?? {} };
	for (let [e, n] of Object.entries(t.x ?? {})) n === null ? delete r[e] : r[e] = n;
	return n.x = r, n;
}
function E(e, t) {
	if (!Array.isArray(e) || e.length !== t) return null;
	for (let t of e) if (!Number.isSafeInteger(t) || Math.abs(t) > o) return null;
	return e;
}
function D(e, t) {
	if (!c(e)) return null;
	let r = {};
	if (e.t !== void 0) {
		if (typeof e.t != "string" || e.t.length > n.maximumNameLength) return null;
		r.t = e.t;
	}
	for (let n of a) {
		if (e[n.wire] === void 0) {
			if (t) return null;
			continue;
		}
		let i = E(e[n.wire], n.length);
		if (!i) return null;
		r[n.wire] = i;
	}
	if (e.x !== void 0) {
		if (!c(e.x) || Object.keys(e.x).length > n.maximumVariablesPerEntity) return null;
		r.x = {};
		for (let [t, i] of Object.entries(e.x)) {
			if (t.length > n.maximumNameLength || i !== null && !(Number.isSafeInteger(i) && Math.abs(i) <= o)) return null;
			r.x[t] = i;
		}
	}
	return r;
}
function O(e, t, n) {
	return e.map((e, r) => e + (t[r] - e) * n);
}
function k(e) {
	let t = Math.hypot(...e) || 1;
	return e.map((e) => e / t);
}
function A(e, t, n) {
	let r = e[0] * t[0] + e[1] * t[1] + e[2] * t[2] + e[3] * t[3] < 0 ? -1 : 1;
	return k(O(e, t.map((e) => e * r), n));
}
function j(e, t, n) {
	let r = e[0];
	if (t <= r.time) return _(r.state);
	let i = e[e.length - 1];
	if (t >= i.time) {
		let e = _(i.state), r = Math.min(t - i.time, n);
		return e.position = e.position.map((e, t) => e + i.state.velocity[t] * r), e;
	}
	let a = e.length - 1;
	for (; e[a - 1].time > t;) --a;
	let o = e[a - 1], s = e[a], c = (t - o.time) / (s.time - o.time);
	return {
		position: O(o.state.position, s.state.position, c),
		rotation: A(o.state.rotation, s.state.rotation, c),
		velocity: O(o.state.velocity, s.state.velocity, c),
		variables: { ...o.state.variables }
	};
}
function M(r) {
	if (!c(r)) throw TypeError("createNetcode needs an options object like { role: \"client\", transport, serverId: \"server\" }.");
	p(r.transport, "createNetcode");
	let a = r.role ?? "client";
	if (!t.includes(a)) throw RangeError(`createNetcode role must be one of ${t.join(", ")}, got ${String(a)}.`);
	let o = r.authority ?? "server";
	if (o === "peer") throw RangeError(`createNetcode authority "peer" (peer to peer) is not supported yet. Use one of ${e.join(", ")}.`);
	if (!e.includes(o)) throw RangeError(`createNetcode authority must be one of ${e.join(", ")}, got ${String(o)}.`);
	a === "client" && l(r.serverId, "createNetcode serverId");
	for (let e of ["simulate", "readInput"]) if (r[e] !== void 0 && typeof r[e] != "function") throw TypeError(`createNetcode ${e} must be a function or left out, got ${s(r[e])}.`);
	return a === "client" && r.localEntityId !== void 0 && l(r.localEntityId, "createNetcode localEntityId"), {
		role: a,
		authority: o,
		transport: r.transport,
		serverId: r.serverId,
		localEntityId: r.localEntityId,
		simulate: r.simulate ?? b(),
		readInput: r.readInput,
		maximumMessageBytes: d(r.maximumMessageBytes ?? n.defaultMessageBytes, "createNetcode maximumMessageBytes", 256, n.maximumMessageBytes),
		snapshotEveryTicks: d(r.snapshotEveryTicks ?? i.snapshotEveryTicks, "createNetcode snapshotEveryTicks", 1, 60),
		inputRedundancy: d(r.inputRedundancy ?? i.inputRedundancy, "createNetcode inputRedundancy", 1, n.maximumInputRedundancy),
		inputBufferSteps: d(r.inputBufferSteps ?? i.inputBufferSteps, "createNetcode inputBufferSteps", 0, 16),
		interpolationDelaySeconds: u(r.interpolationDelaySeconds ?? i.interpolationDelaySeconds, "createNetcode interpolationDelaySeconds", 0, 2),
		maximumExtrapolationSeconds: u(r.maximumExtrapolationSeconds ?? i.maximumExtrapolationSeconds, "createNetcode maximumExtrapolationSeconds", 0, 2),
		steps: {
			positionStep: u(r.positionStep ?? i.positionStep, "createNetcode positionStep", 1e-6, 1),
			rotationStep: u(r.rotationStep ?? i.rotationStep, "createNetcode rotationStep", 1e-6, 1),
			velocityStep: u(r.velocityStep ?? i.velocityStep, "createNetcode velocityStep", 1e-6, 1),
			variableStep: u(r.variableStep ?? i.variableStep, "createNetcode variableStep", 1e-6, 1)
		}
	};
}
function N(e, t) {
	let { transport: r, steps: i } = e, a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), u = 0;
	function f(e) {
		let t = o.get(e);
		return t || (o.size >= n.maximumPeers ? null : (t = {
			queue: [],
			lastQueuedSequence: 0,
			lastProcessedSequence: 0,
			acknowledgedTick: null
		}, o.set(e, t), t));
	}
	function p(e, r) {
		let i = f(e), a = c(r) && r.type === "input" && Array.isArray(r.inputs) ? r.inputs : null;
		if (!i || !a || a.length > n.maximumInputsPerMessage) t.rejectedMessages += 1;
		else {
			Number.isInteger(r.acknowledgedTick) && r.acknowledgedTick >= (i.acknowledgedTick ?? -1) && (i.acknowledgedTick = r.acknowledgedTick);
			for (let e of a) try {
				let t = d(e?.sequence, "input sequence", 1, 2 ** 53 - 1);
				if (t <= i.lastQueuedSequence) continue;
				i.queue.push({
					sequence: t,
					input: y(e.input, "input")
				}), i.lastQueuedSequence = t;
			} catch {
				t.rejectedMessages += 1;
			}
			for (; i.queue.length > n.maximumQueuedInputsPerPeer;) i.queue.shift();
		}
	}
	function m(e) {
		for (let t of a.values()) if (t.owner === e) return t;
		return null;
	}
	function h(n, r, i) {
		n.state = g(e.simulate(_(n.state), r, i), "simulate result", n.state), t.inputsProcessed += 1;
	}
	function v(t) {
		for (let [r, i] of o) {
			if (i.queue.length === 0) continue;
			let a = i.queue.length - e.inputBufferSteps, o = Math.min(Math.max(1, a), n.maximumInputsPerStep, i.queue.length), s = m(r);
			for (let e = 0; e < o; e += 1) {
				let { sequence: e, input: n } = i.queue.shift();
				s && h(s, n, t), i.lastProcessedSequence = e;
			}
		}
		if (e.readInput) {
			let n = m(r.id);
			n && h(n, y(e.readInput(), "readInput result"), t);
		}
	}
	function b(e) {
		for (let t of o.keys()) e.includes(t) || o.delete(t);
	}
	function S() {
		let e = /* @__PURE__ */ new Map();
		for (let [t, n] of a) e.set(t, x(n.state, n.tag, i));
		for (s.set(u, e); s.size > n.maximumSnapshotHistory;) s.delete(s.keys().next().value);
		return e;
	}
	function C(e, t) {
		let n = t.acknowledgedTick !== null && s.has(t.acknowledgedTick) ? t.acknowledgedTick : null, r = n === null ? null : s.get(n), i = {};
		for (let [t, n] of e) {
			let e = w(r?.get(t) ?? null, n);
			e && (i[t] = e);
		}
		let a = r ? [...r.keys()].filter((t) => !e.has(t)) : [];
		return {
			type: "snapshot",
			tick: u,
			base: n,
			lastProcessedInput: t.lastProcessedSequence,
			entities: i,
			removed: a
		};
	}
	function T() {
		let i = r.peers();
		b(i);
		let a = S();
		for (let o of i.slice(0, n.maximumPeers)) {
			let i = f(o);
			if (!i) continue;
			let s = C(a, i), c = JSON.stringify(s).length;
			if (c > e.maximumMessageBytes) throw RangeError(`A netcode snapshot is ${c} bytes, over maximumMessageBytes ${e.maximumMessageBytes}. Sync fewer entities or variables, or raise maximumMessageBytes (up to ${n.maximumMessageBytes}).`);
			r.send(o, s), t.snapshotsSent += 1, t.bytesSent += c, s.base === null && (t.fullSnapshotsSent += 1);
		}
	}
	return {
		receiveMessage: p,
		fixedUpdate(t) {
			v(t), u += 1, u % e.snapshotEveryTicks === 0 && T();
		},
		addEntity(e, t = {}) {
			if (l(e, "addEntity id"), a.has(e)) throw RangeError(`addEntity: an entity named "${e}" already exists. Use setEntityState to change it.`);
			if (a.size >= n.maximumEntities) throw RangeError(`A netcode world syncs at most ${n.maximumEntities} entities. Remove some, or sync only what players see.`);
			let r = t.owner === void 0 ? null : l(t.owner, "addEntity owner"), i = t.tag === void 0 ? null : l(t.tag, "addEntity tag");
			if (r !== null && m(r)) throw RangeError(`addEntity: "${r}" already owns an entity. A peer drives one entity.`);
			a.set(e, {
				owner: r,
				tag: i,
				state: g(t.state ?? {}, `addEntity "${e}" state`)
			});
		},
		removeEntity(e) {
			if (!a.delete(e)) throw RangeError(`removeEntity: no entity named "${String(e)}". Present: ${[...a.keys()].join(", ") || "none"}.`);
		},
		setEntityState(e, t) {
			let n = a.get(e);
			if (!n) throw RangeError(`setEntityState: no entity named "${String(e)}". Present: ${[...a.keys()].join(", ") || "none"}. Use addEntity first.`);
			n.state = g(t, `setEntityState "${e}" state`, n.state);
		},
		getEntityState(e) {
			let t = a.get(e);
			return t ? _(t.state) : null;
		},
		entityIds: () => [...a.keys()],
		get tick() {
			return u;
		}
	};
}
function P(e, t) {
	let { transport: r, steps: a } = e, o = e.localEntityId ?? null, s = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), u = [], d = null, f = -1, p = 0, m = null, h = null;
	function b(n, r) {
		for (; u.length > 0 && u[0].sequence <= r;) u.shift();
		let i = m, a = n;
		for (let { input: t } of u) a = g(e.simulate(_(a), t, d), "simulate result", a);
		m = a, t.reconciliations += 1, i && (t.lastCorrection = v(i.position, m.position), t.maximumCorrection = Math.max(t.maximumCorrection, t.lastCorrection));
	}
	function x(e) {
		return !c(e) || e.type !== "snapshot" || !Number.isSafeInteger(e.tick) || e.tick < 0 || e.base !== null && !Number.isSafeInteger(e.base) || !c(e.entities) || Object.keys(e.entities).length > n.maximumEntities || !Array.isArray(e.removed) || e.removed.length > n.maximumEntities || !Number.isSafeInteger(e.lastProcessedInput) || e.lastProcessedInput < 0 ? null : e;
	}
	function C(r, i) {
		if (r !== e.serverId) return;
		let a = x(i);
		if (!a) {
			t.rejectedMessages += 1;
			return;
		}
		if (a.tick <= f) {
			t.staleSnapshots += 1;
			return;
		}
		let o = a.base === null ? /* @__PURE__ */ new Map() : s.get(a.base);
		if (!o) {
			t.missingBaseSnapshots += 1;
			return;
		}
		let c = new Map(o);
		for (let e of a.removed) c.delete(e);
		for (let [e, n] of Object.entries(a.entities)) {
			let r = D(n, !c.has(e));
			if (!r) {
				t.rejectedMessages += 1;
				return;
			}
			c.set(e, T(c.get(e) ?? null, r));
		}
		c.size > n.maximumEntities ? t.rejectedMessages += 1 : w(a, c);
	}
	function w(r, i) {
		for (f = r.tick, t.snapshotsReceived += 1, s.set(r.tick, i); s.size > n.maximumSnapshotHistory;) s.delete(s.keys().next().value);
		let c = r.tick * d;
		for (let e of l.keys()) i.has(e) || l.delete(e);
		for (let [e, t] of i) {
			let r = l.get(e) ?? [];
			for (r.push({
				time: c,
				state: S(t, a)
			}); r.length > n.maximumSamplesPerEntity;) r.shift();
			l.set(e, r);
		}
		h === null && (h = c - e.interpolationDelaySeconds), o !== null && i.has(o) && b(S(i.get(o), a), r.lastProcessedInput);
	}
	function E(t) {
		p += 1;
		let i = e.readInput ? y(e.readInput(t), "readInput result") : {};
		if (e.readInput) {
			for (u.push({
				sequence: p,
				input: i
			}); u.length > n.maximumPendingInputs;) u.shift();
			m &&= g(e.simulate(_(m), i, d), "simulate result", m);
		}
		r.send(e.serverId, {
			type: "input",
			acknowledgedTick: f >= 0 ? f : null,
			inputs: u.slice(-e.inputRedundancy).map(({ sequence: e, input: t }) => ({
				sequence: e,
				input: t
			}))
		});
	}
	function O(t) {
		if (h === null) return;
		let n = f * d - e.interpolationDelaySeconds, r = n - h;
		if (Math.abs(r) > 1) {
			h = n;
			return;
		}
		let a = t * i.clockCorrectionRate;
		h += t + Math.max(-a, Math.min(a, r));
	}
	return {
		receiveMessage: C,
		setStep(e) {
			d = e;
		},
		fixedUpdate(e, t) {
			d = e, E(t);
		},
		update(e) {
			O(e);
		},
		getEntityState(t) {
			if (t === o && m) return _(m);
			let n = l.get(t);
			return !n || h === null ? null : j(n, h, e.maximumExtrapolationSeconds);
		},
		entityIds: () => [...l.keys()],
		get latestTick() {
			return f;
		},
		get pendingInputCount() {
			return u.length;
		}
	};
}
function F(e) {
	let t = M(e), n = {
		snapshotsSent: 0,
		fullSnapshotsSent: 0,
		bytesSent: 0,
		inputsProcessed: 0,
		snapshotsReceived: 0,
		staleSnapshots: 0,
		missingBaseSnapshots: 0,
		reconciliations: 0,
		lastCorrection: 0,
		maximumCorrection: 0,
		rejectedMessages: 0
	}, r = t.role === "authority" ? N(t, n) : P(t, n), i = null;
	function a(e) {
		if (t.role !== "authority") throw TypeError(`${e} is only for the authority. This netcode is a client; the authority owns the entities.`);
	}
	let o = {
		name: "netcode",
		get role() {
			return t.role;
		},
		get authority() {
			return t.authority;
		},
		get stats() {
			return { ...n };
		},
		get tick() {
			return t.role === "authority" ? r.tick : r.latestTick;
		},
		get pendingInputCount() {
			return r.pendingInputCount ?? 0;
		},
		init(e) {
			r.setStep?.(e.fixedStepSeconds), i = t.transport.receive((e, t) => r.receiveMessage(e, t));
		},
		fixedUpdate(e, t) {
			r.fixedUpdate(e, t);
		},
		update(e) {
			r.update?.(e);
		},
		dispose() {
			typeof i == "function" && i(), i = null;
		},
		addEntity(e, t) {
			return a("addEntity"), r.addEntity(e, t), o;
		},
		removeEntity(e) {
			return a("removeEntity"), r.removeEntity(e), o;
		},
		setEntityState(e, t) {
			return a("setEntityState"), r.setEntityState(e, t), o;
		},
		getEntityState(e) {
			return r.getEntityState(e);
		},
		get entityIds() {
			return r.entityIds();
		}
	};
	return o;
}
function I(e = {}) {
	let t = d(e.seed ?? 1, "createLoopbackNetwork seed", 0, 4294967295), r = u(e.latencyMilliseconds ?? 0, "createLoopbackNetwork latencyMilliseconds", 0, 6e4), i = u(e.jitterMilliseconds ?? 0, "createLoopbackNetwork jitterMilliseconds", 0, 6e4), a = u(e.lossRate ?? 0, "createLoopbackNetwork lossRate", 0, 1), o = d(e.maximumMessageBytes ?? n.maximumMessageBytes, "createLoopbackNetwork maximumMessageBytes", 256, n.maximumMessageBytes), s = d(e.maximumInFlight ?? 4096, "createLoopbackNetwork maximumInFlight", 1, 65536), c = f(t), p = /* @__PURE__ */ new Map(), m = [], h = {
		sent: 0,
		delivered: 0,
		dropped: 0
	}, g = 0, _ = 0;
	function v(e, t, n) {
		if (!p.has(t)) throw RangeError(`Loopback send: no transport named "${String(t)}". Connected: ${[...p.keys()].join(", ")}.`);
		let l = JSON.stringify(n);
		if (l === void 0 || l.length > o) throw RangeError(`Loopback send: a message must be JSON of at most ${o} characters, got ${l === void 0 ? "a value JSON cannot hold" : l.length}.`);
		h.sent += 1;
		let u = c(), d = c();
		if (u < a || m.length >= s) {
			h.dropped += 1;
			return;
		}
		let f = Math.max(0, r + (d * 2 - 1) * i);
		_ += 1, m.push({
			deliverAt: g + f,
			sequence: _,
			fromId: e,
			toId: t,
			text: l
		});
	}
	function y() {
		for (m.sort((e, t) => e.deliverAt - t.deliverAt || e.sequence - t.sequence); m.length > 0 && m[0].deliverAt <= g;) {
			let e = m.shift(), t = p.get(e.toId);
			if (t) {
				h.delivered += 1;
				for (let n of [...t.listeners]) n(e.fromId, JSON.parse(e.text));
			}
		}
	}
	return {
		createTransport(e) {
			if (l(e, "createTransport id"), p.has(e)) throw RangeError(`createTransport: a transport named "${e}" is already connected.`);
			let t = { listeners: /* @__PURE__ */ new Set() };
			return p.set(e, t), {
				id: e,
				peers: () => [...p.keys()].filter((t) => t !== e),
				send: (t, n) => v(e, t, n),
				receive(e) {
					if (typeof e != "function") throw TypeError("transport.receive needs a callback (peerId, message) => void.");
					return t.listeners.add(e), () => t.listeners.delete(e);
				},
				close() {
					p.delete(e);
				}
			};
		},
		advance(e) {
			u(e, "advance milliseconds", 0, 6e4), g += e, y();
		},
		get stats() {
			return {
				...h,
				inFlight: m.length
			};
		},
		get nowMilliseconds() {
			return g;
		}
	};
}
function L(e, t = {}) {
	if (typeof e != "object" || !e || typeof e.postMessage != "function" || typeof e.addEventListener != "function") throw TypeError("createBroadcastChannelTransport needs a BroadcastChannel-like object with postMessage(value) and addEventListener(type, listener), such as new BroadcastChannel(\"my-game\").");
	let i = l(t.id, "createBroadcastChannelTransport id"), a = d(t.maximumMessageBytes ?? n.defaultMessageBytes, "createBroadcastChannelTransport maximumMessageBytes", 256, n.maximumMessageBytes), o = u(t.peerTimeoutMilliseconds ?? r, "createBroadcastChannelTransport peerTimeoutMilliseconds", 50, 36e5), s = t.now ?? Date.now;
	if (typeof s != "function") throw TypeError("createBroadcastChannelTransport now must be a function that returns milliseconds, such as performance.now.");
	let f = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Map(), m = {
		sent: 0,
		received: 0,
		rejected: 0
	};
	function h() {
		let e = s() - o;
		for (let [t, n] of p) n < e && p.delete(t);
	}
	function g(e) {
		return !p.has(e) && (h(), p.size >= n.maximumPeers) ? !1 : (p.set(e, s()), !0);
	}
	function _(t) {
		let r = t?.data;
		if (!c(r) || typeof r.from != "string" || r.from === "" || r.from.length > n.maximumNameLength) {
			m.rejected += 1;
			return;
		}
		let a = r.from, o = r.to === void 0 || r.to === i;
		if (a === i || !o) return;
		if (r.left === !0) {
			p.delete(a);
			return;
		}
		let s = !p.has(a);
		if (!g(a)) m.rejected += 1;
		else if (r.hello === !0) s && r.to === void 0 && e.postMessage({
			from: i,
			to: a,
			hello: !0
		});
		else {
			m.received += 1;
			for (let e of [...f]) e(a, r.data);
		}
	}
	return e.addEventListener("message", _), e.postMessage({
		from: i,
		hello: !0
	}), {
		id: i,
		peers() {
			return h(), [...p.keys()];
		},
		send(t, n) {
			let r = JSON.stringify(n);
			if (r === void 0 || r.length > a) throw RangeError(`BroadcastChannel transport send: a message must be JSON of at most ${a} characters, got ${r === void 0 ? "a value JSON cannot hold" : r.length}.`);
			e.postMessage({
				from: i,
				to: t,
				data: JSON.parse(r)
			}), m.sent += 1;
		},
		receive(e) {
			if (typeof e != "function") throw TypeError("transport.receive needs a callback (peerId, message) => void.");
			return f.add(e), () => f.delete(e);
		},
		close() {
			e.postMessage({
				from: i,
				left: !0
			}), e.removeEventListener?.("message", _), f.clear(), p.clear(), e.close?.();
		},
		get stats() {
			return { ...m };
		}
	};
}
function R(e, t = {}) {
	if (typeof e != "object" || !e || typeof e.send != "function" || typeof e.addEventListener != "function") throw TypeError("createWebSocketTransport needs a socket-like object with send(text) and addEventListener(type, listener), such as a WebSocket you opened.");
	let r = l(t.id ?? "local", "createWebSocketTransport id"), i = l(t.remoteId ?? "server", "createWebSocketTransport remoteId"), a = t.multiplexed === !0, o = d(t.maximumMessageBytes ?? n.defaultMessageBytes, "createWebSocketTransport maximumMessageBytes", 256, n.maximumMessageBytes), s = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), f = {
		sent: 0,
		received: 0,
		rejected: 0
	};
	function p(e) {
		if (typeof e != "string" || e.length > o) return null;
		try {
			let t = JSON.parse(e);
			return c(t) ? t : null;
		} catch {
			return null;
		}
	}
	function m(e) {
		let t = p(e?.data);
		if (!t) {
			f.rejected += 1;
			return;
		}
		let r = i, o = t;
		if (a) {
			if (typeof t.from != "string" || t.from === "" || t.from.length > n.maximumNameLength) {
				f.rejected += 1;
				return;
			}
			if (r = t.from, t.left === !0) {
				u.delete(r);
				return;
			}
			if (u.size >= n.maximumPeers && !u.has(r)) {
				f.rejected += 1;
				return;
			}
			u.add(r), o = t.data;
		}
		f.received += 1;
		for (let e of [...s]) e(r, o);
	}
	return e.addEventListener("message", m), {
		id: r,
		peers: () => a ? [...u] : e.readyState === 1 ? [i] : [],
		send(t, n) {
			if (e.readyState !== 1) return;
			let r = JSON.stringify(a ? {
				to: t,
				data: n
			} : n);
			if (r === void 0 || r.length > o) throw RangeError(`WebSocket transport send: a message must be JSON of at most ${o} characters, got ${r === void 0 ? "a value JSON cannot hold" : r.length}.`);
			e.send(r), f.sent += 1;
		},
		receive(e) {
			if (typeof e != "function") throw TypeError("transport.receive needs a callback (peerId, message) => void.");
			return s.add(e), () => s.delete(e);
		},
		close() {
			e.removeEventListener?.("message", m), s.clear(), e.close?.();
		},
		get stats() {
			return { ...f };
		}
	};
}
export { e as NETCODE_AUTHORITIES, n as NETCODE_LIMITS, t as NETCODE_ROLES, L as createBroadcastChannelTransport, I as createLoopbackNetwork, F as createNetcode, b as createPlanarMovement, R as createWebSocketTransport };
