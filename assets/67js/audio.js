/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
// src/audio.js
var e = Object.freeze({
	maximumSounds: 256,
	maximumBindings: 256,
	maximumBuses: 16,
	maximumVoices: 64,
	defaultVoices: 32,
	defaultInstancesPerSound: 8,
	maximumInstancesPerSound: 32,
	maximumMarkers: 512
}), t = Object.freeze([
	"music",
	"effects",
	"voice"
]), n = .7, r = 400, i = 2e4, a = .01, o = [
	"inverse",
	"linear",
	"exponential"
], s = [
	"pointerdown",
	"keydown",
	"touchend"
];
function c(e) {
	return e === null ? "null" : typeof e;
}
function l(e, t) {
	if (typeof e != "string" || e === "") throw TypeError(`${t} must be a non-empty string, got ${c(e)}.`);
	return e;
}
function u(e, t, n, r) {
	if (!Number.isFinite(e) || e < n || e > r) throw RangeError(`${t} must be a number from ${n} to ${r}, got ${String(e)}.`);
	return e;
}
function d(e, t) {
	if (!Array.isArray(e) && !ArrayBuffer.isView(e)) throw TypeError(`${t} must be [x, y, z], got ${c(e)}.`);
	if (e.length < 3 || !Number.isFinite(e[0]) || !Number.isFinite(e[1]) || !Number.isFinite(e[2])) throw TypeError(`${t} must be three finite numbers [x, y, z].`);
	return [
		e[0],
		e[1],
		e[2]
	];
}
function f(e) {
	return Math.min(Math.max(e, 0), 1);
}
function p(e, { model: t = "inverse", referenceDistance: n = 1, maximumDistance: r = 50, rolloff: i = 1 } = {}) {
	let a = Math.min(Math.max(e, n), r);
	if (t === "linear") {
		let e = r - n;
		return e <= 0 ? 1 : f(1 - i * (a - n) / e);
	}
	return f(t === "exponential" ? (a / n) ** -i : n / (n + i * (a - n)));
}
function ee(e, t) {
	if (e === void 0 || e === !1) return null;
	let n = e === !0 ? {} : e;
	if (typeof n != "object" || !n) throw TypeError(`${t} spatial must be true or { referenceDistance, maximumDistance, rolloff, model, occlusion }, got ${c(e)}.`);
	let r = n.model ?? "inverse";
	if (!o.includes(r)) throw RangeError(`${t} spatial model must be one of ${o.join(", ")}, got ${String(r)}.`);
	let i = u(n.referenceDistance ?? 1, `${t} spatial referenceDistance`, .01, 1e3), a = u(n.maximumDistance ?? 50, `${t} spatial maximumDistance`, i, 1e5), s = r === "linear" ? 1 : 20, l = u(n.rolloff ?? 1, `${t} spatial rolloff`, 0, s);
	return Object.freeze({
		model: r,
		referenceDistance: i,
		maximumDistance: a,
		rolloff: l,
		occlusion: n.occlusion === !0
	});
}
function m(e) {
	return [
		e[12],
		e[13],
		e[14]
	];
}
function h(e, t = "node") {
	let n = typeof e == "function" ? e() : e;
	if (typeof n != "object" || !n) throw TypeError(`${t} must be [x, y, z], { position }, { matrix } or a function returning one of them, got ${c(n)}.`);
	if (Array.isArray(n) || ArrayBuffer.isView(n) && n.length === 3) return d(n, t);
	if (n.position !== void 0) return d(n.position, `${t} position`);
	if (n.matrix !== void 0 && n.matrix.length === 16) return d(m(n.matrix), `${t} matrix`);
	throw TypeError(`${t} must be [x, y, z], { position }, { matrix } or a function returning one of them.`);
}
function g(e) {
	if (typeof e != "object" || !e) throw TypeError(`listener must be a camera frame { eye, target, up } or { position, forward, up }, got ${c(e)}.`);
	let t = e.up === void 0 ? [
		0,
		1,
		0
	] : d(e.up, "listener up");
	if (e.eye !== void 0) {
		let n = d(e.eye, "listener eye"), r = d(e.target ?? [
			n[0],
			n[1],
			n[2] - 1
		], "listener target");
		return {
			position: n,
			forward: _([
				r[0] - n[0],
				r[1] - n[1],
				r[2] - n[2]
			]),
			up: t
		};
	}
	return {
		position: d(e.position ?? [
			0,
			0,
			0
		], "listener position"),
		forward: _(d(e.forward ?? [
			0,
			0,
			-1
		], "listener forward")),
		up: t
	};
}
function _(e) {
	let t = Math.hypot(e[0], e[1], e[2]);
	return t < 1e-9 ? [
		0,
		0,
		-1
	] : [
		e[0] / t,
		e[1] / t,
		e[2] / t
	];
}
function v(e, t) {
	return Math.hypot(e[0] - t[0], e[1] - t[1], e[2] - t[2]);
}
function y(t, n, r, { loop: i = !1, duration: a = Infinity } = {}) {
	if (!Array.isArray(t) || t.length > e.maximumMarkers) throw RangeError(`markers must be an array of up to ${e.maximumMarkers} { time, name } entries.`);
	let o = [], s = i && r < n;
	for (let e of t) l(e?.name, "marker name"), u(e.time, `marker ${e.name} time`, 0, Number.MAX_VALUE), (s ? e.time > n && e.time <= a || e.time >= 0 && e.time <= r : e.time > n && e.time <= r) && o.push(e);
	return o;
}
function b(e, t, n) {
	typeof e.setTargetAtTime == "function" ? e.setTargetAtTime(t, n, a) : e.value = t;
}
function x(e, t, n) {
	e.positionX ? (b(e.positionX, t[0], n), b(e.positionY, t[1], n), b(e.positionZ, t[2], n)) : e.setPosition(t[0], t[1], t[2]);
}
function S(e, t, n) {
	e.positionX ? (b(e.positionX, t.position[0], n), b(e.positionY, t.position[1], n), b(e.positionZ, t.position[2], n), b(e.forwardX, t.forward[0], n), b(e.forwardY, t.forward[1], n), b(e.forwardZ, t.forward[2], n), b(e.upX, t.up[0], n), b(e.upY, t.up[1], n), b(e.upZ, t.up[2], n)) : (e.setPosition(t.position[0], t.position[1], t.position[2]), e.setOrientation(t.forward[0], t.forward[1], t.forward[2], t.up[0], t.up[1], t.up[2]));
}
function C(e) {
	return i * (r / i) ** e;
}
function w(e = {}) {
	let t = e.createContext ?? (() => new globalThis.AudioContext({ latencyHint: "interactive" })), n = e.fetch ?? (globalThis.fetch ? globalThis.fetch.bind(globalThis) : null), r = e.gestureTarget === void 0 ? globalThis.document : e.gestureTarget, i = null, a = null, o = null, l = null, u = /* @__PURE__ */ new Map();
	function d() {
		if (!i) throw Error("The audio backend has not started. Call audio.init() or add the audio system to a started runtime.");
		return i;
	}
	function f() {
		if (i && i.state === "suspended") {
			let e = i.resume();
			e && typeof e.catch == "function" && e.catch(() => {});
		}
	}
	return {
		name: "web-audio",
		get state() {
			return i ? i.state : "closed";
		},
		init() {
			if (!i && (i = t(), o = i.createDynamicsCompressor(), o.threshold.value = -1, o.knee.value = 0, o.ratio.value = 20, o.attack.value = .003, o.release.value = .1, o.connect(i.destination), a = i.createGain(), a.connect(o), r && typeof r.addEventListener == "function")) {
				let e = () => {
					f(), i.state !== "suspended" && l && l();
				};
				for (let t of s) r.addEventListener(t, e);
				l = () => {
					for (let t of s) r.removeEventListener(t, e);
					l = null;
				};
			}
		},
		dispose() {
			l && l(), i && typeof i.close == "function" && i.close(), i = null, u.clear();
		},
		unlock: f,
		createBus(e, t) {
			let n = d().createGain();
			n.gain.value = t, n.connect(a), u.set(e, n);
		},
		setBusVolume(e, t) {
			b((e === "master" ? a : u.get(e)).gain, t, d().currentTime);
		},
		async decode(e) {
			let t = d();
			if (typeof e == "string") {
				if (!n) throw Error("No fetch is available to load a sound from a URL. Pass an ArrayBuffer or a decoded AudioBuffer instead.");
				let r = await n(e);
				if (!r.ok) throw Error(`Loading the sound ${e} failed with status ${r.status}.`);
				return t.decodeAudioData(await r.arrayBuffer());
			}
			if (e instanceof ArrayBuffer) return t.decodeAudioData(e);
			if (e && typeof e.duration == "number") return e;
			throw TypeError(`A sound source must be a URL string, an ArrayBuffer or a decoded AudioBuffer, got ${c(e)}.`);
		},
		setListener(e) {
			let t = d();
			S(t.listener, e, t.currentTime);
		},
		startVoice(e) {
			let t = d(), n = t.currentTime, r = t.createBufferSource();
			r.buffer = e.buffer, r.loop = e.loop, r.playbackRate.value = e.pitch;
			let i = t.createGain();
			i.gain.value = e.volume;
			let a = null, o = null, s = r;
			if (e.spatial) {
				let r = e.spatial;
				r.occlusion && (a = t.createBiquadFilter(), a.type = "lowpass", a.frequency.value = C(e.occlusion), s.connect(a), s = a), o = t.createPanner(), o.panningModel = "HRTF", o.distanceModel = r.model, o.refDistance = r.referenceDistance, o.maxDistance = r.maximumDistance, o.rolloffFactor = r.rolloff, x(o, e.position, n), s.connect(o), s = o;
			}
			s.connect(i), i.connect(u.get(e.bus));
			let c = !1;
			return r.onended = () => {
				c = !0, e.onEnded();
			}, r.start(n), {
				update(e) {
					let n = t.currentTime;
					b(i.gain, e.volume, n), b(r.playbackRate, e.pitch, n), o && x(o, e.position, n), a && b(a.frequency, C(e.occlusion), n);
				},
				stop() {
					if (!c) {
						c = !0, r.onended = null;
						try {
							r.stop();
						} catch {}
						r.disconnect();
					}
				}
			};
		}
	};
}
function T(e, t, n, r, i) {
	return u(typeof e == "function" ? e(t) : e, n, r, i);
}
function E(e) {
	let t = e >>> 0;
	return () => {
		t = t + 1831565813 >>> 0;
		let e = Math.imul(t ^ t >>> 15, 1 | t);
		return e = e + Math.imul(e ^ e >>> 7, 61 | e) ^ e, ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
function D(r = {}) {
	let i = r.backend ?? w(r.webAudio), a = u(r.maximumVoices ?? e.defaultVoices, "createAudio maximumVoices", 1, e.maximumVoices), o = r.occlusion ?? null;
	if (o !== null && typeof o != "function") throw TypeError("createAudio occlusion must be a function (from, to) => 0 to 1, or left out.");
	let s = r.listener ?? null;
	if (s !== null && typeof s != "function") throw TypeError("createAudio listener must be a function () => camera frame { eye, target, up }, or left out.");
	let f = E(r.seed ?? 1), m = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), S = [], C = 0, D = 1, O = !1, k = r.input ?? null, A = {
		position: [
			0,
			0,
			0
		],
		forward: [
			0,
			0,
			-1
		],
		up: [
			0,
			1,
			0
		]
	};
	function j(t, n = 1) {
		if (l(t, "bus name"), u(n, `bus ${t} volume`, 0, 4), t === "master") throw RangeError("The bus name master is reserved for the output level. Use setBusVolume(\"master\", volume) to change it.");
		if (!x.has(t) && x.size >= e.maximumBuses) throw RangeError(`An audio can have at most ${e.maximumBuses} buses, so ${t} was not added.`);
		x.set(t, n), O && i.createBus(t, n);
	}
	x.set("master", 1);
	for (let e of t) x.set(e, 1);
	for (let [e, t] of Object.entries(r.buses ?? {})) j(e, t);
	function M(e) {
		if (!x.has(e) || e === "master") throw RangeError(`Unknown bus ${String(e)}. Use one of ${[...x.keys()].filter((e) => e !== "master").join(", ")} or add it with createBus(name).`);
		return e;
	}
	function N(e) {
		let t = m.get(e);
		if (!t) throw RangeError(`Unknown sound ${String(e)}. Define it first with audio.defineSound(name, { buffer }) or await audio.load(name, source). Known: ${[...m.keys()].join(", ") || "none"}.`);
		return t;
	}
	function P(t, n) {
		if (l(t, "sound name"), typeof n != "object" || !n) throw TypeError(`defineSound(${t}, definition) needs { buffer, bus, volume, pitch, loop, spatial }, got ${c(n)}.`);
		if (!m.has(t) && m.size >= e.maximumSounds) throw RangeError(`An audio can hold at most ${e.maximumSounds} sounds, so ${t} was not added.`);
		if (!n.buffer || typeof n.buffer.duration != "number") throw TypeError(`defineSound(${t}) buffer must be a decoded AudioBuffer. To load a URL or ArrayBuffer use await audio.load(name, source).`);
		let r = Object.freeze({
			name: t,
			buffer: n.buffer,
			bus: M(n.bus ?? "effects"),
			volume: u(n.volume ?? 1, `sound ${t} volume`, 0, 4),
			pitch: u(n.pitch ?? 1, `sound ${t} pitch`, .1, 4),
			pitchVariance: u(n.pitchVariance ?? 0, `sound ${t} pitchVariance`, 0, 1),
			loop: n.loop === !0,
			maximumInstances: u(n.maximumInstances ?? e.defaultInstancesPerSound, `sound ${t} maximumInstances`, 1, e.maximumInstancesPerSound),
			spatial: ee(n.spatial, `sound ${t}`)
		});
		return m.set(t, r), r;
	}
	async function F(e, t, n = {}) {
		l(e, "sound name"), i.init();
		let r = await i.decode(t);
		return P(e, {
			...n,
			buffer: r
		});
	}
	function I(e) {
		let t = e.sound, r = e.volume * x.get(t.bus) * x.get("master");
		return e.position && t.spatial && (r *= p(v(e.position, A.position), t.spatial), r *= 1 - n * e.occlusion), r;
	}
	function L(e) {
		return h(e.node, `sound ${e.sound.name} node`);
	}
	function R(e) {
		return !o || !e.sound.spatial?.occlusion || !e.position ? 0 : u(o(A.position, e.position), "occlusion function result", 0, 1);
	}
	function z(e) {
		if (!o || !e.sound.spatial?.occlusion || !e.position) return 0;
		let t = Number(o(A.position, e.position));
		return Number.isFinite(t) ? Math.min(Math.max(t, 0), 1) : 0;
	}
	function B(e) {
		let t = S.indexOf(e);
		t >= 0 && S.splice(t, 1);
	}
	function V(e) {
		e.backendVoice.stop(), B(e);
	}
	function H(e, t) {
		let n = S.filter((t) => t.sound === e);
		if (n.length >= e.maximumInstances && V(n[0]), S.length < a) return !0;
		let r = S.reduce((e, t) => t.level < e.level ? t : e, S[0]);
		return r.level >= t ? !1 : (V(r), !0);
	}
	function U(e, t = {}) {
		let n = N(e);
		$();
		let r = n.volume * u(t.volume ?? 1, `play ${e} volume`, 0, 4), a = n.pitchVariance === 0 ? 0 : (f() * 2 - 1) * n.pitchVariance, o = n.pitch * u(t.pitch ?? 1, `play ${e} pitch`, .1, 4) * (1 + a), s = {
			id: D,
			sound: n,
			node: t.node ?? null,
			position: null,
			volume: r,
			pitch: u(o, `play ${e} resulting pitch`, .1, 16),
			loop: t.loop ?? n.loop,
			occlusion: 0,
			level: 0,
			backendVoice: null
		};
		if (n.spatial) {
			if (s.node === null && t.position === void 0) throw TypeError(`Sound ${e} is spatial, so play it with { position: [x, y, z] } or { node }. For a flat sound define it without spatial.`);
			s.position = s.node === null ? d(t.position, `play ${e} position`) : L(s);
		}
		return s.occlusion = R(s), s.level = I(s), H(n, s.level) ? (D += 1, s.backendVoice = i.startVoice({
			buffer: n.buffer,
			bus: n.bus,
			volume: s.volume,
			pitch: s.pitch,
			loop: s.loop,
			spatial: n.spatial,
			position: s.position,
			occlusion: s.occlusion,
			onEnded: () => B(s)
		}), S.push(s), Object.freeze({
			id: s.id,
			sound: e,
			stop: () => V(s),
			get playing() {
				return S.includes(s);
			},
			get level() {
				return s.level;
			}
		})) : null;
	}
	function W(e, t, n = {}) {
		return U(t, {
			loop: !0,
			...n,
			node: e
		});
	}
	function G(e) {
		for (let t of [...S]) (e === void 0 || t.sound.name === e) && V(t);
	}
	function K() {
		return S.map((e) => Object.freeze({
			id: e.id,
			sound: e.sound.name,
			bus: e.sound.bus,
			volume: e.volume,
			pitch: e.pitch,
			loop: e.loop,
			position: e.position ? [...e.position] : null,
			occlusion: e.occlusion,
			level: e.level
		}));
	}
	function q(t, n, r = {}) {
		if (l(t, "event name"), N(n), C >= e.maximumBindings) throw RangeError(`An audio can hold at most ${e.maximumBindings} event bindings, so ${t} was not bound.`);
		for (let e of ["volume", "pitch"]) {
			let n = r[e];
			if (n !== void 0 && typeof n != "function" && !Number.isFinite(n)) throw TypeError(`bindEvent ${t} ${e} must be a number or a function (eventData) => number, got ${c(n)}.`);
		}
		_.has(t) || _.set(t, []);
		let i = {
			soundName: n,
			options: r
		};
		return _.get(t).push(i), C += 1, () => {
			let e = _.get(t), n = e ? e.indexOf(i) : -1;
			n >= 0 && (e.splice(n, 1), --C);
		};
	}
	function J(e, t) {
		let n = e.options, r = {
			volume: n.volume === void 0 ? 1 : T(n.volume, t, `${e.soundName} volume`, 0, 4),
			pitch: n.pitch === void 0 ? 1 : T(n.pitch, t, `${e.soundName} pitch`, .1, 4)
		}, i = typeof n.position == "function" ? n.position(t) : n.position ?? t?.position;
		return n.node === void 0 ? i !== void 0 && (r.position = i) : r.node = n.node, U(e.soundName, r);
	}
	function Y(e, t = {}) {
		l(e, "event name");
		let n = [];
		for (let r of [..._.get(e) ?? []]) {
			let e = J(r, t);
			e && n.push(e);
		}
		return n;
	}
	function te(e, t, n = {}) {
		if (l(e, "action name"), !k) throw TypeError("bindAction needs an input: pass createAudio({ input }) or call audio.setInput(input).");
		let r = `input:${e}`;
		return b.set(e, r), q(r, t, n);
	}
	function ne(e) {
		if (!e || typeof e.wasPressed != "function") throw TypeError("setInput needs an input from createInput (it has wasPressed(action)).");
		k = e;
	}
	function re(e, t = {}) {
		if (!Array.isArray(e)) throw TypeError(`emitContacts needs an array of contact events { started, kind, colliderA, colliderB, ... }, got ${c(e)}.`);
		for (let n of e) {
			if (n.started === !1) continue;
			let e = t.position ? {
				...n,
				position: t.position(n)
			} : n, r = n.kind === "sensor" ? "sensor" : "contact";
			Y(r, e), Y(`${r}:${String(n.colliderA)}`, e), Y(`${r}:${String(n.colliderB)}`, e);
		}
	}
	function ie(e, t, n, r = {}) {
		for (let i of y(e, t, n, r)) Y(`marker:${i.name}`, {
			...r.data,
			marker: i,
			time: i.time
		});
	}
	function ae(e, t) {
		u(t, `bus ${String(e)} volume`, 0, 4), e !== "master" && M(e), x.set(e, t), O && i.setBusVolume(e, t);
		for (let e of S) e.level = I(e);
	}
	function oe(e) {
		return x.has(e) || M(e), x.get(e);
	}
	function X(e) {
		A = g(e), O && i.setListener(A);
	}
	function Z() {
		if (s) try {
			X(s());
		} catch {}
		for (let e of [...S]) {
			if (e.node !== null && e.sound.spatial) try {
				e.position = L(e);
			} catch {
				V(e);
				continue;
			}
			e.occlusion = z(e), e.level = I(e), e.backendVoice.update({
				volume: e.volume,
				pitch: e.pitch,
				position: e.position,
				occlusion: e.occlusion
			});
		}
	}
	function Q() {
		if (k) for (let [e, t] of b) k.wasPressed(e) && Y(t, { action: e });
	}
	function $() {
		if (!O) {
			i.init();
			for (let [e, t] of x) e !== "master" && i.createBus(e, t);
			i.setBusVolume("master", x.get("master")), i.setListener(A), O = !0;
		}
	}
	return {
		name: r.name ?? "audio",
		init() {
			$();
		},
		fixedUpdate(e, t) {
			t?.mode !== "variable" && Q(), t?.mode === "fixed" && Z();
		},
		update(e, t) {
			t?.mode === "variable" && Q(), Z();
		},
		dispose() {
			G(), i.dispose(), O = !1;
		},
		backend: i,
		defineSound: P,
		load: F,
		createBus: j,
		setBusVolume: ae,
		getBusVolume: oe,
		play: U,
		attach: W,
		stopAll: G,
		activeVoices: K,
		bindEvent: q,
		bindAction: te,
		setInput: ne,
		emit: Y,
		emitContacts: re,
		emitMarkers: ie,
		setListener: X,
		synchronize: Z,
		unlock: () => i.unlock?.()
	};
}
export { e as AUDIO_LIMITS, t as DEFAULT_BUSES, n as OCCLUDED_GAIN_LOSS, D as createAudio, p as distanceGain, y as markersCrossed, g as readListener, h as readNodePosition, w as webAudioBackend };
