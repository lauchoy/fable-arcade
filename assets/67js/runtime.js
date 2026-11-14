/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
// src/runtime.js
var e = Object.freeze([
	"fixed",
	"variable",
	"both"
]), t = Object.freeze({
	defaultFixedStepSeconds: 1 / 60,
	minimumFixedStepSeconds: 1 / 1e3,
	maximumFixedStepSeconds: 1,
	defaultMaximumFrameSeconds: .25,
	defaultMaximumStepsPerFrame: 8,
	maximumStepsPerFrameLimit: 1e3,
	maximumSystems: 64,
	frameWindow: 120
}), n = [
	"init",
	"fixedUpdate",
	"update",
	"dispose"
];
function r(e) {
	return e === null ? "null" : typeof e;
}
function i(e, t, n, r) {
	if (!Number.isFinite(e) || e < n || e > r) throw RangeError(`createRuntime ${t} must be a number from ${n} to ${r}, got ${String(e)}.`);
	return e;
}
function a(e, t) {
	if (typeof e != "object" || !e) throw TypeError(`A runtime system must be an object like { name, init, fixedUpdate, update, dispose }, got ${r(e)}.`);
	if (typeof e.name != "string" || e.name === "") throw TypeError("A runtime system needs a unique name string, such as { name: \"physics\", fixedUpdate(step) {} }.");
	for (let t of n) if (e[t] !== void 0 && typeof e[t] != "function") throw TypeError(`Runtime system "${e.name}" ${t} must be a function or left out, got ${r(e[t])}.`);
	if (t.has(e.name)) throw RangeError(`A runtime system named "${e.name}" already exists. Pass another name, or use replaceSystem to swap it.`);
}
function o() {
	if (typeof requestAnimationFrame != "function" || typeof cancelAnimationFrame != "function") throw TypeError("createRuntime found no requestAnimationFrame. Pass options.scheduler as { request(callback), cancel(handle) }.");
	return {
		request: (e) => requestAnimationFrame(e),
		cancel: (e) => cancelAnimationFrame(e)
	};
}
function s() {
	return () => performance.now();
}
function c() {
	return typeof document > "u" ? {
		hidden: !1,
		subscribe: () => () => {}
	} : {
		get hidden() {
			return document.hidden;
		},
		subscribe(e) {
			return document.addEventListener("visibilitychange", e), () => document.removeEventListener("visibilitychange", e);
		}
	};
}
function l(n, r) {
	if (typeof n != "object" || !n || typeof n.render != "function") throw TypeError("createRuntime needs a renderer as its first argument: an object with a render(frame) method, such as a Renderer67.");
	if (typeof r != "object" || !r) throw TypeError("createRuntime options must be an object or left out.");
	let a = r.mode ?? "both";
	if (!e.includes(a)) throw RangeError(`createRuntime mode must be one of ${e.join(", ")}, got ${String(a)}.`);
	if (r.fixedStepSeconds !== void 0 && r.fixedRate !== void 0) throw RangeError("createRuntime takes fixedStepSeconds or fixedRate, not both.");
	let o = r.fixedRate === void 0 ? r.fixedStepSeconds ?? t.defaultFixedStepSeconds : 1 / i(r.fixedRate, "fixedRate", 1, 1 / t.minimumFixedStepSeconds);
	i(o, "fixedStepSeconds", t.minimumFixedStepSeconds, t.maximumFixedStepSeconds);
	let s = i(r.maximumFrameSeconds ?? t.defaultMaximumFrameSeconds, "maximumFrameSeconds", .001, 10), c = i(r.maximumStepsPerFrame ?? t.defaultMaximumStepsPerFrame, "maximumStepsPerFrame", 1, t.maximumStepsPerFrameLimit);
	if (r.frame !== void 0 && typeof r.frame != "function") throw TypeError("createRuntime frame must be a function (context) => frame for target.render, or left out.");
	if (typeof (r.pauseWhenHidden ?? !0) != "boolean") throw TypeError("createRuntime pauseWhenHidden must be a boolean.");
	let l = r.systems ?? [];
	if (!Array.isArray(l)) throw TypeError("createRuntime systems must be an array of system objects, in the order they run.");
	return {
		mode: a,
		fixedStepSeconds: o,
		maximumFrameSeconds: s,
		maximumStepsPerFrame: c,
		systems: l
	};
}
function u(e, n = {}) {
	let r = l(e, n), { mode: u, fixedStepSeconds: d, maximumFrameSeconds: f, maximumStepsPerFrame: p } = r, m = n.scheduler ?? o(), h = n.clock ?? s(), g = n.visibility ?? c(), _ = n.pauseWhenHidden ?? !0, v = n.frame ?? ((e) => ({ time: e.elapsedSeconds })), y = u !== "variable", b = u !== "fixed", x = [], S = /* @__PURE__ */ new Set(), C = {
		runtime: null,
		target: e,
		mode: u,
		fixedStepSeconds: d,
		deltaSeconds: 0,
		elapsedSeconds: 0,
		alpha: 1
	}, w = [], T = {
		frames: 0,
		fixedSteps: 0,
		droppedSeconds: 0,
		lastFixedSteps: 0,
		frameMilliseconds: 0,
		updateMilliseconds: 0,
		renderMilliseconds: 0
	}, E = !1, D = !1, O = !1, k = null, A = null, j = 0, M = null, N = () => D || _ && g.hidden === !0;
	function P(e, t, ...n) {
		if (e[t]) try {
			e[t](...n, C);
		} catch (n) {
			throw n.message = `Runtime system "${e.name}" ${t} failed: ${n.message}`, n;
		}
	}
	function F(e) {
		S.has(e) || (S.add(e), P(e, "init"));
	}
	function I(e) {
		S.delete(e) && P(e, "dispose");
	}
	function L() {
		k !== null && (m.cancel(k), k = null);
	}
	function R() {
		E && k === null && !N() && (k = m.request(H));
	}
	function z(e) {
		w.push(e), w.length > t.frameWindow && w.shift();
	}
	function B() {
		let e = 0;
		for (; j >= d && e < p;) {
			C.deltaSeconds = d;
			for (let e of x) P(e, "fixedUpdate", d);
			j -= d, e += 1;
		}
		j >= d && (T.droppedSeconds += j - j % d, j %= d), T.lastFixedSteps = e, T.fixedSteps += e;
	}
	function V(e) {
		if (C.elapsedSeconds += e, y && (j += e, B()), b) {
			C.deltaSeconds = e;
			for (let t of x) P(t, "update", e);
		}
		C.alpha = u === "both" ? j / d : 1;
	}
	function H() {
		if (k = null, !E || N()) return;
		let t = h(), n = A === null ? 0 : Math.max(0, t - A);
		A = t;
		let r = Math.min(n / 1e3, f);
		try {
			V(r);
			let n = h();
			e.render(v(C));
			let i = h();
			T.updateMilliseconds = n - t, T.renderMilliseconds = i - n;
		} catch (e) {
			throw U(), e;
		}
		T.frames += 1, T.frameMilliseconds = n, T.frames > 1 && z(n), R();
	}
	function U() {
		E = !1, L(), A = null, j = 0;
	}
	function W() {
		N() ? L() : (A = null, R());
	}
	function G(e) {
		if (O) throw Error(`Cannot ${e}: this runtime was disposed. Call createRuntime again.`);
	}
	let K = {
		get mode() {
			return u;
		},
		get running() {
			return E;
		},
		get paused() {
			return E && N();
		},
		get systems() {
			return x.map((e) => e.name);
		},
		start() {
			if (G("start"), E) return K;
			E = !0, A = null;
			try {
				for (let e of x) F(e);
			} catch (e) {
				throw E = !1, e;
			}
			return M ??= g.subscribe(W), R(), K;
		},
		stop() {
			return U(), K;
		},
		pause() {
			return D = !0, L(), K;
		},
		resume() {
			return G("resume"), D = !1, A = null, R(), K;
		},
		step(t = d * 1e3) {
			G("step"), i(t, "step milliseconds", 0, f * 1e3);
			for (let e of x) F(e);
			return V(t / 1e3), e.render(v(C)), T.frames += 1, K;
		},
		addSystem(e, n = x.length) {
			if (G("addSystem"), a(e, new Set(x.map((e) => e.name))), x.length >= t.maximumSystems) throw RangeError(`A runtime holds at most ${t.maximumSystems} systems. Merge some, or remove one first.`);
			if (!Number.isInteger(n) || n < 0 || n > x.length) throw RangeError(`addSystem index must be an integer from 0 to ${x.length}, got ${String(n)}.`);
			return x.splice(n, 0, e), E && F(e), K;
		},
		replaceSystem(e, t) {
			G("replaceSystem");
			let n = x.findIndex((t) => t.name === e);
			if (n < 0) throw RangeError(`No runtime system named "${String(e)}". Present: ${K.systems.join(", ") || "none"}. Use addSystem to add one.`);
			a(t, new Set(x.filter((e, t) => t !== n).map((e) => e.name)));
			let [r] = x.splice(n, 1, t);
			return I(r), E && F(t), K;
		},
		removeSystem(e) {
			G("removeSystem");
			let t = x.findIndex((t) => t.name === e);
			if (t < 0) throw RangeError(`No runtime system named "${String(e)}". Present: ${K.systems.join(", ") || "none"}.`);
			let [n] = x.splice(t, 1);
			return I(n), K;
		},
		getSystem(e) {
			return x.find((t) => t.name === e);
		},
		get stats() {
			let e = w.length, t = e ? w.reduce((e, t) => e + t, 0) / e : 0;
			return {
				...T,
				averageFrameMilliseconds: t,
				maximumFrameMilliseconds: e ? Math.max(...w) : 0,
				framesPerSecond: t > 0 ? 1e3 / t : 0,
				alpha: C.alpha,
				elapsedSeconds: C.elapsedSeconds
			};
		},
		dispose() {
			if (!O) {
				U(), M?.(), M = null, O = !0;
				for (let e of [...x].reverse()) I(e);
				x.length = 0;
			}
		}
	};
	C.runtime = K;
	for (let e of r.systems) K.addSystem(e);
	return K;
}
export { t as RUNTIME_LIMITS, e as RUNTIME_MODES, u as createRuntime };
