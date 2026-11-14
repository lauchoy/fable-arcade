/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
// src/streaming.js
var e = Object.freeze({
	maximumAssets: 4096,
	maximumLevels: 8,
	maximumLoaders: 32,
	maximumConcurrentLoads: 16,
	defaultConcurrentLoads: 2,
	maximumBudgetBytes: 2 ** 40,
	defaultHysteresis: .1,
	maximumHysteresis: 1,
	eventHistory: 256,
	minimumPriority: -100,
	maximumPriority: 100
}), t = Object.freeze([
	"idle",
	"pending",
	"loaded",
	"evicted",
	"failed"
]);
function n(e) {
	return e === null ? "null" : typeof e;
}
function r(e, t) {
	return e === t ? 0 : e < t ? -1 : 1;
}
function i(e, t, n, r) {
	if (!Number.isFinite(e) || e < n || e > r) throw RangeError(`${t} must be a number from ${n} to ${r}, got ${String(e)}.`);
	return e;
}
function a(e, t) {
	if (!Array.isArray(e) && !ArrayBuffer.isView(e)) throw TypeError(`${t} must be a point like [x, y, z], got ${n(e)}.`);
	if (e.length !== 3 || !Array.prototype.every.call(e, Number.isFinite)) throw RangeError(`${t} must be three finite numbers [x, y, z].`);
	return [
		e[0],
		e[1],
		e[2]
	];
}
function o(t, n, r = 0, i = e.defaultHysteresis) {
	let a = Math.min(Math.max(r, 0), t.length);
	for (; a < t.length && n > t[a] * (1 + i);) a += 1;
	for (; a > 0 && n < t[a - 1] * (1 - i);) --a;
	return a;
}
function s({ options: e = {}, fetchBytes: t } = {}) {
	return {
		async load({ source: n, signal: r }) {
			let { parseGltf: i } = await import("./gltf.js"), a = t ? await t(n, r) : await c(n, r);
			return {
				asset: await i(a, {
					baseUrl: l(n),
					...e
				}),
				bytes: a.byteLength
			};
		},
		dispose(e) {
			e.dispose();
		}
	};
}
async function c(e, t) {
	let n = await fetch(e, { signal: t });
	if (!n.ok) throw Error(`Fetching ${e} failed with status ${n.status}.`);
	return n.arrayBuffer();
}
function l(e) {
	return /^https?:/.test(e) ? new URL(".", e).href : "";
}
function u({ createWorker: e, dispose: t } = {}) {
	if (typeof e != "function") throw TypeError("createWorkerLoader needs createWorker: a function () => Worker, e.g. () => new Worker(new URL(\"./decode.js\", import.meta.url), { type: \"module\" }).");
	if (t !== void 0 && typeof t != "function") throw TypeError("createWorkerLoader dispose must be a function (asset) or left out.");
	return {
		load({ id: t, format: r, source: i, level: a, signal: o }) {
			return new Promise((s, c) => {
				let l = null, u = (e) => (t) => {
					o.removeEventListener("abort", p), l?.terminate(), e(t);
				}, d = u(s), f = u(c);
				function p() {
					f(/* @__PURE__ */ Error(`Loading "${t}" level ${a} was aborted.`));
				}
				if (o.aborted) p();
				else {
					o.addEventListener("abort", p, { once: !0 });
					try {
						l = e(), l.onmessage = (e) => {
							let r = e?.data;
							typeof r != "object" || !r ? f(/* @__PURE__ */ TypeError(`The worker for "${t}" must answer { asset, bytes } or { error }, got ${n(r)}.`)) : r.error === void 0 ? r.asset === void 0 ? f(/* @__PURE__ */ TypeError(`The worker for "${t}" answered without an asset; answer { asset, bytes } or { error }.`)) : d({
								asset: r.asset,
								bytes: r.bytes
							}) : f(Error(String(r.error)));
						}, l.onmessageerror = () => f(/* @__PURE__ */ Error(`The worker for "${t}" sent a reply that could not be read.`)), l.onerror = (e) => f(Error(e?.message ?? `The worker for "${t}" failed.`)), l.postMessage({
							id: t,
							format: r,
							source: i,
							level: a
						});
					} catch (e) {
						f(e instanceof Error ? e : Error(String(e)));
					}
				}
			});
		},
		dispose(e) {
			t?.(e);
		}
	};
}
function d(e, t) {
	if (typeof e != "string" || !/^[a-z0-9][a-z0-9-]*$/.test(e)) throw TypeError(`A loader format must be a lowercase name like "glb" or "terrain-tile", got ${n(e)} ${String(e)}.`);
	if (typeof t != "object" || !t || typeof t.load != "function") throw TypeError(`Loader "${e}" must be an object { load(request) => Promise<{ asset, bytes }>, dispose(asset) }, got ${n(t)}.`);
	if (t.dispose !== void 0 && typeof t.dispose != "function") throw TypeError(`Loader "${e}" dispose must be a function or left out.`);
}
function f(t, r, o) {
	if (typeof t != "object" || !t) throw TypeError(`A streamed asset must be an object { id, format, source, position, loadDistance, estimatedBytes }, got ${n(t)}.`);
	let { id: s, format: c } = t;
	if (typeof s != "string" || s === "") throw TypeError("A streamed asset needs a unique id string.");
	if (!r.has(c)) {
		let e = [...r.keys()].sort().join(", ") || "none";
		throw RangeError(`Streamed asset "${s}" uses format "${String(c)}" with no loader. Register one with registerLoader first; registered: ${e}.`);
	}
	let l = a(t.position ?? [
		0,
		0,
		0
	], `Streamed asset "${s}" position`), u = t.loadDistance === void 0 ? Infinity : i(t.loadDistance, `Streamed asset "${s}" loadDistance`, 0, Infinity), d = t.levels ?? [{
		source: t.source,
		estimatedBytes: t.estimatedBytes
	}];
	if (!Array.isArray(d) || d.length < 1 || d.length > e.maximumLevels) throw RangeError(`Streamed asset "${s}" levels must be an array of 1 to ${e.maximumLevels} { source, estimatedBytes, maximumDistance }.`);
	let f = d.map((t, n) => {
		if (typeof t?.source != "string" || t.source === "") throw TypeError(`Streamed asset "${s}" level ${n} needs a source string (a URL).`);
		let r = i(t.estimatedBytes, `Streamed asset "${s}" level ${n} estimatedBytes`, 1, e.maximumBudgetBytes), a = n === d.length - 1 ? Infinity : i(t.maximumDistance, `Streamed asset "${s}" level ${n} maximumDistance`, 0, Infinity);
		return {
			source: t.source,
			estimatedBytes: Math.ceil(r),
			maximumDistance: a
		};
	});
	for (let e = 1; e < f.length - 1; e += 1) if (f[e].maximumDistance <= f[e - 1].maximumDistance) throw RangeError(`Streamed asset "${s}" level maximumDistance values must increase from the finest level to the coarsest.`);
	return {
		id: s,
		format: c,
		position: l,
		priority: t.priority === void 0 ? 0 : i(t.priority, `Streamed asset "${s}" priority`, e.minimumPriority, e.maximumPriority),
		loadDistance: u,
		unloadDistance: u * (1 + o),
		levels: f
	};
}
function p(c = {}) {
	if (typeof c != "object" || !c) throw TypeError("createStreaming options must be an object or left out.");
	let l = Math.floor(i(c.budgetBytes, "createStreaming budgetBytes", 1, e.maximumBudgetBytes)), u = i(c.hysteresis ?? e.defaultHysteresis, "createStreaming hysteresis", 0, e.maximumHysteresis), p = i(c.maximumConcurrentLoads ?? e.defaultConcurrentLoads, "createStreaming maximumConcurrentLoads", 1, e.maximumConcurrentLoads);
	if (c.focus !== void 0 && typeof c.focus != "function") throw TypeError("createStreaming focus must be a function () => [x, y, z], or left out and set with setFocus.");
	if (c.onEvent !== void 0 && typeof c.onEvent != "function") throw TypeError("createStreaming onEvent must be a function (event) or left out.");
	let m = c.evictionOrder ?? "recency";
	if (m !== "recency" && m !== "distance") throw RangeError(`createStreaming evictionOrder must be "recency" (least recently used first, the default) or "distance" (farthest first), got ${n(m)} ${String(m)}.`);
	let h = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), _ = [], v = [
		0,
		0,
		0
	], y = 0, b = 0, x = !1;
	function S(t, n, r, i = {}) {
		let a = {
			type: t,
			id: n,
			level: r,
			tick: y,
			...i
		};
		_.push(a), _.length > e.eventHistory && _.shift(), c.onEvent?.(a);
	}
	function C(t, n) {
		if (d(t, n), h.has(t)) throw RangeError(`A loader for "${t}" is already registered. Use another format name.`);
		if (h.size >= e.maximumLoaders) throw RangeError(`At most ${e.maximumLoaders} loaders can be registered.`);
		h.set(t, n);
	}
	function w(t) {
		if (x) throw Error("The streaming system was disposed.");
		let n = f(t, h, u);
		if (g.has(n.id)) throw RangeError(`A streamed asset named "${n.id}" already exists. Pass another id.`);
		if (g.size >= e.maximumAssets) throw RangeError(`At most ${e.maximumAssets} streamed assets can be defined.`);
		g.set(n.id, {
			...n,
			wanted: !1,
			requested: !1,
			level: 0,
			resident: /* @__PURE__ */ new Map(),
			pendingLevels: /* @__PURE__ */ new Map(),
			lastUsed: 0,
			state: "idle",
			failure: null
		});
	}
	let T = (e) => {
		let t = g.get(e);
		if (!t) throw RangeError(`No streamed asset named "${String(e)}". Add it with addAsset first.`);
		return t;
	};
	function E() {
		let e = 0;
		for (let t of g.values()) {
			for (let n of t.resident.values()) e += n.bytes;
			for (let n of t.pendingLevels.values()) e += n.reservedBytes;
		}
		return e;
	}
	function D() {
		let e = [];
		for (let t of g.values()) if (!(t.wanted || t.requested)) for (let [n, r] of t.resident) e.push({
			record: t,
			level: n,
			resident: r
		});
		let t = new Map(e.map((e) => [e.record.id, P(e.record)])), n = (e, n) => t.get(n.record.id) - t.get(e.record.id), i = (e, t) => e.record.lastUsed - t.record.lastUsed, [a, o] = m === "distance" ? [n, i] : [i, n];
		return e.sort((e, t) => e.record.priority - t.record.priority || a(e, t) || o(e, t) || r(e.record.id, t.record.id) || e.level - t.level);
	}
	function O({ record: e, level: t, resident: n }, r) {
		h.get(e.format).dispose?.(n.asset), e.resident.delete(t), e.resident.size === 0 && e.pendingLevels.size === 0 && (e.state = "evicted"), S("evict", e.id, t, {
			reason: r,
			bytes: n.bytes
		});
	}
	function k(e) {
		let t = E();
		if (t + e <= l) return !0;
		for (let n of D()) if (t -= n.resident.bytes, O(n, "budget"), t + e <= l) return !0;
		return !1;
	}
	function A(e, t) {
		let n = h.get(e.format), r = e.levels[t], i = new AbortController(), a = {
			reservedBytes: r.estimatedBytes,
			controller: i
		};
		e.pendingLevels.set(t, a), e.state = "pending", b += 1, S("load-start", e.id, t);
		let o = {
			id: e.id,
			format: e.format,
			source: r.source,
			level: t,
			signal: i.signal
		};
		Promise.resolve().then(() => n.load(o)).then((r) => j(e, t, a, n, r), (n) => M(e, t, a, n));
	}
	function j(e, t, n, r, i) {
		--b, e.pendingLevels.delete(t);
		let a = Number.isFinite(i?.bytes) && i.bytes >= 0 ? Math.ceil(i.bytes) : n.reservedBytes;
		x || n.controller.signal.aborted ? r.dispose?.(i?.asset) : (e.resident.set(t, {
			asset: i.asset,
			bytes: a
		}), e.state = "loaded", e.lastUsed = y, S("loaded", e.id, t, { bytes: a }), E() > l && k(0), N(e));
	}
	function M(e, t, n, r) {
		--b, e.pendingLevels.delete(t), x || n.controller.signal.aborted || (e.state = e.resident.size > 0 ? "loaded" : "failed", e.failure = r instanceof Error ? r.message : String(r), e.requested = !1, e.wanted = !1, S("failed", e.id, t, { message: e.failure }));
	}
	function N(e) {
		if (e.resident.has(e.level)) for (let [t, n] of [...e.resident]) t !== e.level && O({
			record: e,
			level: t,
			resident: n
		}, "level-switch");
	}
	function P(e) {
		return Math.hypot(e.position[0] - v[0], e.position[1] - v[1], e.position[2] - v[2]);
	}
	function F(e, t) {
		e.wanted ? t > e.unloadDistance && (e.wanted = !1) : t <= e.loadDistance && (e.wanted = !0);
	}
	function I() {
		if (x) return;
		y += 1, c.focus && (v = a(c.focus(), "createStreaming focus()"));
		let e = [];
		for (let t of g.values()) {
			if (t.state === "failed") continue;
			let n = P(t);
			F(t, n), (t.wanted || t.requested) && (t.level = o(t.levels.slice(0, -1).map((e) => e.maximumDistance), n, t.level, u), t.lastUsed = y, !t.resident.has(t.level) && !t.pendingLevels.has(t.level) ? e.push({
				record: t,
				distance: n
			}) : N(t));
		}
		e.sort((e, t) => e.distance - t.distance || r(e.record.id, t.record.id));
		for (let { record: t } of e) {
			if (b >= p) break;
			let e = t.levels[t.level].estimatedBytes;
			k(e) && A(t, t.level);
		}
	}
	function L(e) {
		let t = T(e);
		t.state === "failed" && (t.state = t.resident.size > 0 ? "loaded" : "idle", t.failure = null), t.requested = !0;
	}
	function R(e) {
		T(e).requested = !1;
	}
	function z(e) {
		v = a(e, "setFocus point");
	}
	function B(e) {
		let t = T(e), n = t.resident.get(t.level) ?? [...t.resident.values()][0];
		return {
			state: t.state,
			level: t.level,
			bytes: n?.bytes ?? 0,
			failure: t.failure
		};
	}
	function V(e) {
		let t = T(e), n = t.resident.get(t.level) ?? [...t.resident.entries()].sort(([e], [t]) => e - t)[0]?.[1];
		return n ? (t.lastUsed = y, n.asset) : null;
	}
	async function H() {
		for (let t = 0; t < e.maximumAssets * e.maximumLevels; t += 1) if (await new Promise((e) => setTimeout(e, 0)), b === 0) return;
		throw Error("Streaming did not settle; a loader never resolved.");
	}
	function U() {
		if (!x) {
			x = !0;
			for (let e of g.values()) {
				for (let t of e.pendingLevels.values()) t.controller.abort();
				for (let [t, n] of [...e.resident]) h.get(e.format).dispose?.(n.asset), e.resident.delete(t);
				e.state = "evicted";
			}
		}
	}
	let W = () => {
		let e = Object.fromEntries(t.map((e) => [e, 0]));
		for (let t of g.values()) e[t.state] += 1;
		return {
			...e,
			bytesInUse: E(),
			budgetBytes: l,
			activeLoads: b,
			assets: g.size
		};
	};
	for (let [e, t] of Object.entries(c.loaders ?? {})) C(e, t);
	h.has("glb") || C("glb", s());
	for (let e of c.assets ?? []) w(e);
	return {
		name: c.name ?? "streaming",
		update: I,
		dispose: U,
		registerLoader: C,
		addAsset: w,
		request: L,
		release: R,
		setFocus: z,
		getState: B,
		getAsset: V,
		settled: H,
		get stats() {
			return W();
		},
		get events() {
			return _.slice();
		},
		get loaders() {
			return [...h.keys()].sort();
		}
	};
}
export { e as STREAMING_LIMITS, t as STREAMING_STATES, s as createGlbLoader, p as createStreaming, u as createWorkerLoader, o as selectDetailLevel };
