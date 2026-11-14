/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
// src/input-sources.js
var e = Object.freeze({
	maximumTouchSticks: 4,
	maximumRecordedEvents: 1e5,
	maximumReplayControls: 128
});
function t(e) {
	return e === null ? "null" : typeof e;
}
function n(e, n) {
	if (typeof e != "string" || e === "") throw TypeError(`${n} must be a non-empty string, got ${t(e)}.`);
	return e;
}
function r(e, t) {
	if (!Number.isFinite(e) || e <= 0) throw RangeError(`${t} must be a number above 0, got ${String(e)}.`);
	return e;
}
function i(e, t) {
	if (!e || typeof e.addEventListener != "function" || typeof e.removeEventListener != "function") throw TypeError(`${t} must have addEventListener and removeEventListener, such as window or a canvas.`);
}
function a(e) {
	return Math.max(-1, Math.min(1, e));
}
function o(e, i) {
	if (typeof e != "object" || !e) throw TypeError(`touchSource sticks[${i}] must be { name, area: { x, y, width, height }, radius }, got ${t(e)}.`);
	let a = n(e.name, `touchSource sticks[${i}] name`), o = e.area;
	for (let e of [
		"x",
		"y",
		"width",
		"height"
	]) if (typeof o != "object" || !o || !Number.isFinite(o[e])) throw TypeError(`touchSource stick "${a}" area needs numbers x, y, width and height as fractions of the target, such as { x: 0, y: 0, width: 0.5, height: 1 } for the left half.`);
	return {
		name: a,
		area: o,
		radius: r(e.radius ?? 60, `touchSource stick "${a}" radius`)
	};
}
function s(t = {}) {
	let n = t.target ?? globalThis, s = t.blurTarget ?? globalThis, c = (t.sticks ?? []).map(o);
	if (c.length > e.maximumTouchSticks) throw RangeError(`touchSource takes up to ${e.maximumTouchSticks} sticks, got ${c.length}.`);
	let l = r(t.tapMaximumMilliseconds ?? 250, "touchSource tapMaximumMilliseconds"), u = r(t.tapMaximumDistance ?? 10, "touchSource tapMaximumDistance"), d = r(t.swipeMinimumDistance ?? 50, "touchSource swipeMinimumDistance"), f = r(t.swipeMaximumMilliseconds ?? 400, "touchSource swipeMaximumMilliseconds"), p = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Set(), g = 0, _ = null, v = [
		"pointerdown",
		"pointermove",
		"pointerup",
		"pointercancel"
	];
	function y() {
		return n.getBoundingClientRect?.() || {
			left: 0,
			top: 0,
			width: n.innerWidth ?? 1,
			height: n.innerHeight ?? 1
		};
	}
	function b(e, t) {
		let { left: n, top: r, width: i, height: a } = y();
		return c.find(({ area: o, name: s }) => {
			let c = n + o.x * i, l = r + o.y * a, u = e >= c && e <= c + o.width * i && t >= l && t <= l + o.height * a, d = [...p.values()].some((e) => e.stick.name === s);
			return u && !d;
		});
	}
	function x() {
		let [e, t] = [...m.values()];
		return Math.hypot(e.x - t.x, e.y - t.y);
	}
	function S(e, t) {
		h.add(t), e(t, 1);
	}
	function C(e, t, n) {
		let r = n.clientX - t.startX, i = n.clientY - t.startY, a = Math.hypot(r, i), o = (n.timeStamp ?? 0) - t.startTime;
		a <= u && o <= l ? S(e, "tap") : a < d || o > f || (Math.abs(r) >= Math.abs(i) ? S(e, r < 0 ? "swipeLeft" : "swipeRight") : S(e, i < 0 ? "swipeUp" : "swipeDown"));
	}
	function w(e, t) {
		if (t.pointerType !== "touch") return;
		let n = b(t.clientX, t.clientY);
		n ? (p.set(t.pointerId, {
			stick: n,
			originX: t.clientX,
			originY: t.clientY
		}), e(`${n.name}Active`, 1)) : m.set(t.pointerId, {
			startX: t.clientX,
			startY: t.clientY,
			startTime: t.timeStamp ?? 0,
			x: t.clientX,
			y: t.clientY
		});
	}
	function T(e, t) {
		let n = p.get(t.pointerId);
		if (n) {
			e(`${n.stick.name}X`, a((t.clientX - n.originX) / n.stick.radius)), e(`${n.stick.name}Y`, a((t.clientY - n.originY) / n.stick.radius));
			return;
		}
		let r = m.get(t.pointerId);
		if (!r) return;
		let i = m.size === 2 ? x() : 0;
		r.x = t.clientX, r.y = t.clientY, i > 0 && (g += x() / i - 1, e("pinch", g));
	}
	function E(e, t) {
		let n = p.get(t.pointerId);
		if (n) {
			p.delete(t.pointerId), e(`${n.stick.name}Active`, 0), e(`${n.stick.name}X`, 0), e(`${n.stick.name}Y`, 0);
			return;
		}
		let r = m.get(t.pointerId);
		r && (m.delete(t.pointerId), m.size === 0 && C(e, r, t));
	}
	return {
		name: "touch",
		attach(e) {
			i(n, "touchSource target"), _ = {
				pointerdown: (t) => w(e, t),
				pointermove: (t) => T(e, t),
				pointerup: (t) => E(e, t),
				pointercancel: (t) => E(e, t),
				blur: () => {
					p.clear(), m.clear(), e.releaseAll();
				}
			};
			for (let e of v) n.addEventListener(e, _[e]);
			s.addEventListener?.("blur", _.blur);
		},
		endSample(e) {
			for (let t of h) e(t, 0);
			h = /* @__PURE__ */ new Set(), g !== 0 && e("pinch", 0), g = 0;
		},
		dispose() {
			if (_ !== null) {
				for (let e of v) n.removeEventListener(e, _[e]);
				s.removeEventListener?.("blur", _.blur), _ = null;
			}
		}
	};
}
function c(e = {}) {
	let t = e.target ?? globalThis, n = null;
	return {
		name: "motion",
		attach(e) {
			i(t, "deviceMotionSource target");
			let r = (t, n) => {
				Number.isFinite(n) && e(t, n);
			};
			n = {
				devicemotion: (e) => {
					let t = e.accelerationIncludingGravity ?? {};
					r("accelX", t.x), r("accelY", t.y), r("accelZ", t.z);
					let n = e.rotationRate ?? {};
					r("rotationAlpha", n.alpha), r("rotationBeta", n.beta), r("rotationGamma", n.gamma);
				},
				deviceorientation: (t) => {
					r("alpha", t.alpha), r("beta", t.beta), r("gamma", t.gamma), Number.isFinite(t.gamma) && e("tiltX", a(t.gamma / 45)), Number.isFinite(t.beta) && e("tiltY", a(t.beta / 45));
				}
			};
			for (let e of Object.keys(n)) t.addEventListener(e, n[e]);
		},
		async requestPermission() {
			let e = [globalThis.DeviceMotionEvent, globalThis.DeviceOrientationEvent].filter((e) => typeof e?.requestPermission == "function");
			for (let t of e) if (await t.requestPermission() !== "granted") return !1;
			return !0;
		},
		dispose() {
			if (n !== null) {
				for (let e of Object.keys(n)) t.removeEventListener(e, n[e]);
				n = null;
			}
		}
	};
}
function l(t) {
	if (typeof t != "object" || !t || typeof t.onControlChange != "function" || typeof t.onSample != "function") throw TypeError("recordInput needs an input made by createInput.");
	let n = [], r = 0, i = !1, a = t.onControlChange((t, a) => {
		n.length >= e.maximumRecordedEvents ? i = !0 : n.push([
			r,
			t,
			a
		]);
	}), o = t.onSample(() => {
		r += 1;
	});
	return {
		get sampleCount() {
			return r;
		},
		stop() {
			return a(), o(), {
				version: 1,
				samples: r,
				truncated: i,
				events: n.map((e) => [...e])
			};
		}
	};
}
var u = /^[^/\s]+\/\S+$/;
function d(t) {
	if (!(typeof t == "object" && t && t.version === 1 && Array.isArray(t.events) && Number.isInteger(t.samples) && t.samples >= 0)) throw TypeError("replaySource needs a recording from recordInput(input).stop(): { version: 1, samples, events }.");
	if (t.events.length > e.maximumRecordedEvents) throw RangeError(`A recording holds up to ${e.maximumRecordedEvents} events, got ${t.events.length}.`);
	let n = 0, r = /* @__PURE__ */ new Set();
	t.events.forEach((t, i) => {
		if (!(Array.isArray(t) && t.length === 3 && Number.isInteger(t[0]) && t[0] >= n && typeof t[1] == "string" && u.test(t[1]) && Number.isFinite(t[2]))) throw TypeError(`Recording event ${i} must be [sampleIndex, "source/control", value] with sample indexes that do not go down, got ${JSON.stringify(t)}.`);
		if (n = t[0], r.add(t[1]), r.size > e.maximumReplayControls) throw RangeError(`A recording may touch up to ${e.maximumReplayControls} distinct controls, event ${i} adds another.`);
	});
}
function f(e, t = {}) {
	d(e);
	let n = t.loop === !0, r = /* @__PURE__ */ new Set(), i = 0, a = 0;
	return {
		name: t.name ?? "replay",
		writesAnyControl: !0,
		get finished() {
			return !n && a > e.samples;
		},
		poll(t) {
			if (a >= e.samples) {
				for (let e of r) t.control(e, 0);
				r.clear(), a = n ? 0 : e.samples + 1, i = 0;
			} else {
				for (; i < e.events.length && e.events[i][0] <= a;) {
					let [, n, a] = e.events[i];
					t.control(n, a), r.add(n), i += 1;
				}
				a += 1;
			}
		}
	};
}
// src/input.js
var p = Object.freeze({
	maximumSources: 16,
	maximumControls: 512,
	maximumActions: 128,
	maximumAxes: 64,
	maximumBindings: 16,
	defaultButtonThreshold: .5,
	defaultDeadZone: .15
});
function m(e) {
	return e === null ? "null" : typeof e;
}
function h(e, t) {
	if (typeof e != "string" || e === "") throw TypeError(`${t} must be a non-empty string, got ${m(e)}.`);
	return e;
}
function g(e, t) {
	if (!Array.isArray(e) || e.length === 0 || e.length > p.maximumBindings) throw RangeError(`${t} must be an array of 1 to ${p.maximumBindings} control names such as "keyboard/Space".`);
	return e.map((e) => {
		let n = typeof e == "string" ? {
			control: e,
			scale: 1
		} : e;
		if (typeof n != "object" || !n) throw TypeError(`${t} entries must be a control name or { control, scale }, got ${m(e)}.`);
		let r = n.scale === void 0 ? 1 : n.scale;
		if (!Number.isFinite(r)) throw TypeError(`${t} scale must be a finite number, got ${String(n.scale)}.`);
		return {
			control: h(n.control, `${t} control`),
			scale: r
		};
	});
}
function _(e, t) {
	let n = Math.abs(e);
	return n <= t ? 0 : Math.sign(e) * Math.min(1, (n - t) / (1 - t));
}
function v(e = {}) {
	let t = e.buttonThreshold ?? p.defaultButtonThreshold;
	if (!Number.isFinite(t) || t <= 0 || t > 1) throw RangeError(`createInput buttonThreshold must be a number above 0 and up to 1, got ${String(t)}.`);
	let n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), o = !1, s = !1, c = {
		actions: /* @__PURE__ */ new Map(),
		axes: /* @__PURE__ */ new Map()
	}, l = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set();
	function d() {
		if (s) throw Error("This input was disposed. Call createInput again.");
	}
	function f(e, r) {
		if (d(), h(e, "setControl control"), !Number.isFinite(r)) throw TypeError(`setControl value for "${e}" must be a finite number (1 or 0 for a button), got ${String(r)}.`);
		let i = n.get(e);
		if (i === void 0) {
			if (n.size >= p.maximumControls) throw RangeError(`Input already has ${p.maximumControls} controls. Reuse control names, or call releaseControls for sources that went away.`);
			i = {
				value: 0,
				pressedLatch: !1,
				releasedLatch: !1
			}, n.set(e, i);
		}
		let a = i.value >= t, o = r >= t;
		o && !a && (i.pressedLatch = !0), !o && a && (i.releasedLatch = !0), i.value = r;
		for (let t of [...l]) t(e, r);
	}
	function v(e, t, n) {
		if (typeof t != "function") throw TypeError(`${n} needs a function, got ${m(t)}.`);
		return e.add(t), () => e.delete(t);
	}
	function y(e) {
		for (let [t, r] of n) (e === void 0 || t.startsWith(`${e}/`)) && r.value !== 0 && f(t, 0);
	}
	function b(e) {
		e.attached || typeof e.source.attach != "function" ? e.attached = !0 : (e.attached = !0, e.source.attach(e.emit));
	}
	function x(e) {
		if (d(), typeof e != "object" || !e) throw TypeError(`An input source must be an object like { name, attach(emit), poll(emit), dispose() }, got ${m(e)}.`);
		let t = h(e.name, "An input source name");
		if (t.includes("/")) throw RangeError(`Input source name "${t}" must not contain "/". Use "midi", not "midi/1".`);
		for (let n of [
			"attach",
			"poll",
			"endSample",
			"dispose"
		]) if (e[n] !== void 0 && typeof e[n] != "function") throw TypeError(`Input source "${t}" ${n} must be a function or left out, got ${m(e[n])}.`);
		if (a.has(t)) throw RangeError(`An input source named "${t}" is already registered. Pass another name, or unregisterSource first.`);
		if (a.size >= p.maximumSources) throw RangeError(`Input already has ${p.maximumSources} sources. Unregister one before adding "${t}".`);
		let r = /* @__PURE__ */ new Set(), i = (e, n) => f(`${t}/${e}`, n);
		i.releaseAll = () => {
			y(t);
			for (let e of r) n.has(e) && f(e, 0);
		}, e.writesAnyControl === !0 && (i.control = (e, t) => {
			r.add(e), f(e, t);
		});
		let s = {
			source: e,
			emit: i,
			attached: !1,
			foreignControls: r
		};
		return a.set(t, s), o && b(s), k;
	}
	function S(e) {
		let t = a.get(e);
		if (t === void 0) throw RangeError(`No input source named "${String(e)}". Registered: ${[...a.keys()].join(", ") || "none"}.`);
		t.source.dispose?.(), a.delete(e), t.emit.releaseAll();
		for (let r of [...n.keys()]) (r.startsWith(`${e}/`) || t.foreignControls.has(r)) && n.delete(r);
		return k;
	}
	function C(e, t) {
		if (d(), h(e, "bindAction name"), !r.has(e) && r.size >= p.maximumActions) throw RangeError(`Input already has ${p.maximumActions} actions. Reuse a name or unbindAction first.`);
		return r.set(e, g(t, `Action "${e}" bindings`)), k;
	}
	function w(e, t) {
		d(), h(e, "bindAxis name");
		let n = Array.isArray(t) ? t : t?.bindings, r = (Array.isArray(t) ? void 0 : t?.deadZone) ?? p.defaultDeadZone, a = (Array.isArray(t) ? void 0 : t?.smoothing) ?? 0;
		if (!Number.isFinite(a) || a < 0 || a >= 1) throw RangeError(`Axis "${e}" smoothing must be a number from 0 (none) up to but not including 1, got ${String(a)}. Each sample moves the axis (1 - smoothing) of the way to its target.`);
		if (!Number.isFinite(r) || r < 0 || r >= 1) throw RangeError(`Axis "${e}" deadZone must be a number from 0 up to but not including 1, got ${String(r)}.`);
		if (!i.has(e) && i.size >= p.maximumAxes) throw RangeError(`Input already has ${p.maximumAxes} axes. Reuse a name or unbindAxis first.`);
		return i.set(e, {
			bindings: g(n, `Axis "${e}" bindings`),
			deadZone: r,
			smoothing: a,
			smoothed: 0
		}), k;
	}
	function T() {
		d();
		for (let e of a.values()) e.source.poll?.(e.emit);
		let e = /* @__PURE__ */ new Map();
		for (let [i, a] of r) {
			let r = {
				held: !1,
				pressed: !1,
				released: !1
			};
			for (let { control: e } of a) {
				let i = n.get(e);
				i !== void 0 && (i.value >= t && (r.held = !0), i.pressedLatch && (r.pressed = !0), i.releasedLatch && (r.released = !0));
			}
			e.set(i, r);
		}
		let o = /* @__PURE__ */ new Map();
		for (let [e, t] of i) {
			let r = 0;
			for (let { control: e, scale: i } of t.bindings) r += (n.get(e)?.value ?? 0) * i;
			let i = _(Math.max(-1, Math.min(1, r)), t.deadZone);
			t.smoothed = t.smoothing === 0 ? i : t.smoothed + (i - t.smoothed) * (1 - t.smoothing), o.set(e, t.smoothed);
		}
		for (let e of n.values()) e.pressedLatch = !1, e.releasedLatch = !1;
		c = {
			actions: e,
			axes: o
		};
		for (let e of [...u]) e();
		for (let e of a.values()) e.source.endSample?.(e.emit);
	}
	function E(e) {
		let t = c.actions.get(e);
		if (t !== void 0) return t;
		if (!r.has(e)) throw RangeError(`No action named "${String(e)}". Bind it first: input.bindAction("${String(e)}", ["keyboard/Space"]).`);
		return {
			held: !1,
			pressed: !1,
			released: !1
		};
	}
	function D(e) {
		let t = c.axes.get(e);
		if (t !== void 0) return t;
		if (!i.has(e)) throw RangeError(`No axis named "${String(e)}". Bind it first: input.bindAxis("${String(e)}", { bindings: ["gamepad/0.axis0"] }).`);
		return 0;
	}
	function O() {
		if (!s) {
			for (let e of [...a.values()].reverse()) e.source.dispose?.();
			a.clear(), n.clear(), r.clear(), i.clear(), c = {
				actions: /* @__PURE__ */ new Map(),
				axes: /* @__PURE__ */ new Map()
			}, l.clear(), u.clear(), s = !0;
		}
	}
	let k = {
		name: e.name ?? "input",
		registerSource: x,
		unregisterSource: S,
		bindAction: C,
		bindAxis: w,
		unbindAction: (e) => r.delete(e),
		unbindAxis: (e) => i.delete(e),
		setControl: f,
		press: (e) => f(e, 1),
		release: (e) => f(e, 0),
		releaseControls: y,
		sample: T,
		onControlChange: (e) => v(l, e, "onControlChange"),
		onSample: (e) => v(u, e, "onSample"),
		isHeld: (e) => E(e).held,
		wasPressed: (e) => E(e).pressed,
		wasReleased: (e) => E(e).released,
		getAxis: D,
		get sources() {
			return [...a.keys()];
		},
		init() {
			d(), o = !0;
			for (let e of a.values()) b(e);
		},
		fixedUpdate() {
			T();
		},
		update(e, t) {
			t?.mode === "variable" && T();
		},
		dispose: O
	};
	for (let t of e.sources ?? []) x(t);
	for (let [t, n] of Object.entries(e.actions ?? {})) C(t, n);
	for (let [t, n] of Object.entries(e.axes ?? {})) w(t, n);
	return k;
}
function y(e = {}) {
	let t = e.target ?? globalThis, n = e.blurTarget ?? globalThis, r = null;
	return {
		name: "keyboard",
		attach(e) {
			S(t, "keyboardSource target"), r = {
				keydown: (t) => {
					t.repeat || e(t.code, 1);
				},
				keyup: (t) => e(t.code, 0),
				blur: () => e.releaseAll()
			}, t.addEventListener("keydown", r.keydown), t.addEventListener("keyup", r.keyup), n.addEventListener?.("blur", r.blur);
		},
		dispose() {
			r !== null && (t.removeEventListener("keydown", r.keydown), t.removeEventListener("keyup", r.keyup), n.removeEventListener?.("blur", r.blur), r = null);
		}
	};
}
function b(e = {}) {
	let t = e.target ?? globalThis, n = e.blurTarget ?? globalThis, r = null, i = 0, a = 0;
	return {
		name: "mouse",
		attach(o) {
			S(t, "mouseSource target"), r = {
				pointerdown: (t) => {
					o(`button${t.button ?? 0}`, 1), e.pointerLockElement?.requestPointerLock && e.pointerLockElement.requestPointerLock();
				},
				pointerup: (e) => o(`button${e.button ?? 0}`, 0),
				pointermove: (e) => {
					o("x", e.clientX ?? 0), o("y", e.clientY ?? 0), i += e.movementX ?? 0, a += e.movementY ?? 0, o("deltaX", i), o("deltaY", a);
				},
				blur: () => o.releaseAll()
			};
			for (let e of [
				"pointerdown",
				"pointerup",
				"pointermove"
			]) t.addEventListener(e, r[e]);
			n.addEventListener?.("blur", r.blur);
		},
		endSample(e) {
			i = 0, a = 0, e("deltaX", 0), e("deltaY", 0);
		},
		dispose() {
			if (r !== null) {
				for (let e of [
					"pointerdown",
					"pointerup",
					"pointermove"
				]) t.removeEventListener(e, r[e]);
				n.removeEventListener?.("blur", r.blur), r = null;
			}
		}
	};
}
function x(e = {}) {
	let t = e.getGamepads ?? (() => typeof navigator < "u" && navigator.getGamepads ? navigator.getGamepads() : []), n = /* @__PURE__ */ new Set();
	return {
		name: "gamepad",
		poll(e) {
			let r = /* @__PURE__ */ new Set();
			for (let n of t() ?? []) n && (n.buttons.forEach((t, i) => {
				let a = `${n.index}.button${i}`;
				r.add(a), e(a, t.pressed ? 1 : t.value ?? 0);
			}), n.axes.forEach((t, i) => {
				let a = `${n.index}.axis${i}`;
				r.add(a), e(a, t);
			}));
			for (let t of n) r.has(t) || e(t, 0);
			n = r;
		}
	};
}
function S(e, t) {
	if (!e || typeof e.addEventListener != "function" || typeof e.removeEventListener != "function") throw TypeError(`${t} must have addEventListener and removeEventListener, such as window or a canvas.`);
}
export { b as a, l as c, y as i, f as l, v as n, e as o, x as r, c as s, p as t, s as u };
