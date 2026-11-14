/*! 67js MCP bundle. Complete license texts and notices: ./LICENSES.md */
import { createRequire as e } from "node:module";
import t from "node:process";
import { constants as n, setPriority as r } from "node:os";
import { copyFile as i, lstat as a, mkdir as o, open as s, readFile as c, readdir as l, realpath as u, rename as d, rm as f, rmdir as p, stat as m, unlink as h, writeFile as g } from "node:fs/promises";
import { basename as _, dirname as v, isAbsolute as y, join as b, relative as x, resolve as S, sep as C } from "node:path";
import { fileURLToPath as w, pathToFileURL as T } from "node:url";
import { appendFileSync as E, existsSync as D, readFileSync as ee, unlinkSync as O } from "node:fs";
import { createServer as te } from "node:http";
import { createHash as ne, randomBytes as re, randomUUID as ie } from "node:crypto";
import { deflateSync as k } from "node:zlib";
import { spawn as ae } from "node:child_process";
import { performance as oe } from "node:perf_hooks";
// \0rolldown/runtime.js
var se = Object.create, ce = Object.defineProperty, le = Object.getOwnPropertyDescriptor, ue = Object.getOwnPropertyNames, de = Object.getPrototypeOf, fe = Object.prototype.hasOwnProperty, A = (e, t, n) => () => {
	if (n) throw n[0];
	try {
		return e && (t = e(e = 0)), t;
	} catch (e) {
		throw n = [e], e;
	}
}, pe = (e, t) => () => (t || (e((t = { exports: {} }).exports, t, t.exports), e = null), t.exports), j = (e, t) => {
	let n = {};
	for (var r in e) ce(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || ce(n, Symbol.toStringTag, { value: "Module" }), n;
}, me = (e, t, n, r) => {
	if (t && typeof t == "object" || typeof t == "function") for (var i = ue(t), a = 0, o = i.length, s; a < o; a++) s = i[a], !fe.call(e, s) && s !== n && ce(e, s, {
		get: ((e) => t[e]).bind(null, s),
		enumerable: !(r = le(t, s)) || r.enumerable
	});
	return e;
}, he = (e, t, n) => (n = e == null ? {} : se(de(e)), me(t || !e || !e.__esModule || !fe.call(e, "default") ? ce(n, "default", {
	value: e,
	enumerable: !0
}) : n, e)), ge = (e) => fe.call(e, "module.exports") ? e["module.exports"] : me(ce({}, "__esModule", { value: !0 }), e), _e = /* @__PURE__ */ e(import.meta.url);
// node_modules/zod/v4/core/util.js
function ve(e) {
	let t = Object.values(e).filter((e) => typeof e == "number");
	return Object.entries(e).filter(([e, n]) => t.indexOf(+e) === -1).map(([e, t]) => t);
}
function ye(e, t = "|") {
	return e.map((e) => Ke(e)).join(t);
}
function be(e, t) {
	return typeof t == "bigint" ? t.toString() : t;
}
var xe = class {
	constructor(e) {
		this._getter = e, this._value = void 0;
	}
	get value() {
		let e = this._getter;
		return e !== void 0 && (this._value = e(), this._getter = void 0), this._value;
	}
};
function Se(e) {
	return new xe(e);
}
function Ce(e) {
	return e == null;
}
function we(e) {
	let t = +!!e.startsWith("^"), n = e.endsWith("$") ? e.length - 1 : e.length;
	return e.slice(t, n);
}
function Te(e, t) {
	let n = e / t, r = Math.round(n), i = 4 * 2 ** -52 * Math.max(Math.abs(n), 1);
	return Math.abs(n - r) < i ? 0 : n - r;
}
var Ee = /* @__PURE__*/ Symbol("evaluating");
function De(e, t, n) {
	let r;
	Object.defineProperty(e, t, {
		get() {
			if (r !== Ee) return r === void 0 && (r = Ee, r = n()), r;
		},
		set(n) {
			Object.defineProperty(e, t, { value: n });
		},
		configurable: !0
	});
}
function Oe(e, t, n) {
	Object.defineProperty(e, t, {
		value: n,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
function ke(e) {
	let t = Object.getOwnPropertyDescriptor(e, "shape");
	return t?.get ? t.get.raw : t?.value;
}
function Ae(e) {
	return ke(e._zod.def) ?? e._zod.def.shape;
}
function je(e, t, n) {
	Object.defineProperty(e, t, {
		get() {
			let e = n();
			return Oe(this, t, e), e;
		},
		enumerable: !0,
		configurable: !0
	});
}
function Me(e, t, n) {
	t in e ? Oe(e, t, n) : e[t] = n;
}
function Ne(e, t, n, r) {
	let i = Ae(t);
	for (let a of n) {
		let n = Object.getOwnPropertyDescriptor(i, a);
		n.enumerable && (n.get ? je(e, a, () => {
			let e = t._zod.def.shape[a];
			return r ? r(e, a) : e;
		}) : Me(e, a, r ? r(n.value, a) : n.value));
	}
}
function Pe(e, t) {
	for (let n of Reflect.ownKeys(t)) {
		let r = Object.getOwnPropertyDescriptor(t, n);
		r.enumerable && (r.get ? je(e, n, () => t[n]) : Me(e, n, r.value));
	}
}
function Fe(...e) {
	let t = {};
	for (let n of e) {
		let e = Object.getOwnPropertyDescriptors(n);
		Object.assign(t, e);
	}
	return Object.defineProperties({}, t);
}
function Ie(e) {
	return JSON.stringify(e);
}
function Le(e) {
	return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var Re = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {};
function ze(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
var Be = /* @__PURE__*/ Se(() => {
	if (It.jitless || typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare")) return !1;
	try {
		return Function(""), !0;
	} catch {
		return !1;
	}
});
function Ve(e) {
	if (ze(e) === !1) return !1;
	let t = e.constructor;
	if (t === void 0 || typeof t != "function") return !0;
	let n = t.prototype;
	return ze(n) !== !1 && Object.prototype.hasOwnProperty.call(n, "isPrototypeOf") !== !1;
}
function He(e) {
	return Ve(e) ? { ...e } : Array.isArray(e) ? [...e] : e instanceof Map ? new Map(e) : e instanceof Set ? new Set(e) : e;
}
var Ue = /* @__PURE__*/ new Set([
	"string",
	"number",
	"symbol"
]);
function We(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Ge(e, t, n) {
	let r = new e._zod.constr(t ?? e._zod.def);
	return (!t || n?.parent) && (r._zod.parent = e), r;
}
function M(e) {
	let t = e;
	if (!t) return {};
	if (typeof t == "string") return { error: () => t };
	if (t?.message !== void 0) {
		if (t?.error !== void 0) throw Error("Cannot specify both `message` and `error` params");
		t.error = t.message;
	}
	return delete t.message, typeof t.error == "string" ? {
		...t,
		error: () => t.error
	} : t;
}
function Ke(e) {
	return typeof e == "bigint" ? e.toString() + "n" : typeof e == "string" ? `"${e}"` : `${e}`;
}
function qe(e) {
	return Object.keys(e).filter((t) => e[t]._zod.optin !== void 0 && e[t]._zod.optout === "optional");
}
var Je = {
	safeint: [-(2 ** 53 - 1), 2 ** 53 - 1],
	int32: [-2147483648, 2147483647],
	uint32: [0, 4294967295],
	float32: [-34028234663852886e22, 34028234663852886e22],
	float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
}, Ye = {
	int64: [/* @__PURE__*/ BigInt("-9223372036854775808"), /* @__PURE__*/ BigInt("9223372036854775807")],
	uint64: [/* @__PURE__*/ BigInt(0), /* @__PURE__*/ BigInt("18446744073709551615")]
};
function Xe(e, t) {
	let n = e._zod.def, r = n.checks;
	if (r && r.length > 0) throw Error(".pick() cannot be used on object schemas containing refinements");
	let i = {};
	return Ne(i, e, Ze(e, t)), Ge(e, Fe(n, {
		shape: i,
		checks: []
	}));
}
function Ze(e, t) {
	let n = Ae(e), r = [];
	for (let e of Reflect.ownKeys(t)) {
		if (!Object.getOwnPropertyDescriptor(n, e)?.enumerable) throw Error(`Unrecognized key: "${String(e)}"`);
		t[e] && r.push(e);
	}
	return r;
}
function Qe(e, t) {
	let n = e._zod.def, r = n.checks;
	if (r && r.length > 0) throw Error(".omit() cannot be used on object schemas containing refinements");
	let i = new Set(Ze(e, t)), a = {};
	return Ne(a, e, Reflect.ownKeys(Ae(e)).filter((e) => !i.has(e))), Ge(e, Fe(n, {
		shape: a,
		checks: []
	}));
}
function $e(e, t) {
	if (!Ve(t)) throw Error("Invalid input to extend: expected a plain object");
	let n = e._zod.def.checks;
	if (n && n.length > 0) {
		let n = Ae(e);
		for (let e of Reflect.ownKeys(t)) if (Object.getOwnPropertyDescriptor(n, e) !== void 0) throw Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
	}
	return Ge(e, Fe(e._zod.def, { shape: et(e, t) }));
}
function et(e, t) {
	let n = {};
	return Ne(n, e, Reflect.ownKeys(Ae(e))), Pe(n, t), n;
}
function tt(e, t) {
	if (!Ve(t)) throw Error("Invalid input to safeExtend: expected a plain object");
	return Ge(e, Fe(e._zod.def, { shape: et(e, t) }));
}
function nt(e, t) {
	if (!t?._zod?.def) throw Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
	if (e._zod.def.checks?.length) throw Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
	let n = {};
	return Ne(n, e, Reflect.ownKeys(Ae(e))), Ne(n, t, Reflect.ownKeys(Ae(t))), Ge(e, Fe(e._zod.def, {
		shape: n,
		get catchall() {
			return t._zod.def.catchall;
		},
		checks: t._zod.def.checks ?? []
	}));
}
function rt(e, t, n, r = "partial") {
	let i = t._zod.def.checks;
	if (i && i.length > 0) throw Error(`.${r}() cannot be used on object schemas containing refinements`);
	let a = n ? new Set(Ze(t, n)) : void 0, o = {};
	return Ne(o, t, Reflect.ownKeys(Ae(t)), e && ((t, n) => a && !a.has(n) ? t : new e({
		type: "optional",
		innerType: t
	}))), Ge(t, Fe(t._zod.def, {
		shape: o,
		checks: []
	}));
}
function it(e, t, n) {
	let r = n ? new Set(Ze(t, n)) : void 0, i = {};
	return Ne(i, t, Reflect.ownKeys(Ae(t)), (t, n) => r && !r.has(n) ? t : new e({
		type: "nonoptional",
		innerType: t
	})), Ge(t, Fe(t._zod.def, { shape: i }));
}
function at(e, t = 0) {
	if (e.aborted === !0) return !0;
	for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue !== !0) return !0;
	return !1;
}
function ot(e, t = 0) {
	if (e.aborted === !0) return !0;
	for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue === !1) return !0;
	return !1;
}
function st(e, t) {
	return t.map((t) => {
		var n;
		return (n = t).path ?? (n.path = []), t.path.unshift(e), t;
	});
}
function ct(e) {
	return typeof e == "string" ? e : e?.message;
}
function lt(e) {
	let t = [];
	for (let n of e ?? []) {
		let e = n._zod.def;
		if (!/_(length|size)$|_equals$/.test(e.check)) break;
		let r = e.maximum ?? e.length ?? e.size;
		r >= 0 && t.push([r, n]);
	}
	return t;
}
function ut(e, t, n) {
	var r;
	for (let i = t; i < e.length; i++) (r = e[i]).schema ?? (r.schema = n);
}
function dt(e, t, n) {
	var r;
	let i = e.inst?._zod?.traits;
	i?.has("$ZodType") && (i.has("$ZodCheck") ? (r = e).schema ?? (r.schema = e.inst) : e.schema = e.inst);
	let a = e.schema === e.inst ? void 0 : e.schema?._zod.def?.error, o = e.message ? e.message : ct(e.inst?._zod.def?.error?.(e)) ?? ct(a?.(e)) ?? ct(t?.error?.(e)) ?? ct(n.customError?.(e)) ?? ct(n.localeError?.(e)) ?? "Invalid input", s = {};
	for (let t of Object.keys(e)) t !== "inst" && t !== "schema" && t !== "continue" && t !== "input" && t !== "__proto__" && (s[t] = e[t]);
	return s.path ??= [], s.message = o, t?.reportInput && (s.input = e.input), s;
}
var ft = /[\uD800-\uDBFF]/;
function pt(e) {
	let t = e.length;
	if (!ft.test(e)) return t;
	let n = t;
	for (let r = 0; r < t - 1; r++) (e.charCodeAt(r) & 64512) == 55296 && (e.charCodeAt(r + 1) & 64512) == 56320 && (n--, r++);
	return n;
}
function mt(e) {
	return Array.isArray(e) ? "array" : typeof e == "string" ? "string" : "unknown";
}
function ht(e) {
	let t = typeof e;
	switch (t) {
		case "number": return Number.isNaN(e) ? "nan" : "number";
		case "object": {
			if (e === null) return "null";
			if (Array.isArray(e)) return "array";
			let t = e;
			if (t && Object.getPrototypeOf(t) !== Object.prototype && "constructor" in t && t.constructor) return t.constructor.name;
		}
	}
	return t;
}
function gt(...e) {
	let [t, n, r] = e;
	return typeof t == "string" ? {
		message: t,
		code: "custom",
		input: n,
		inst: r
	} : { ...t };
}
function _t(e, t) {
	for (let n in t) {
		let r = Object.getOwnPropertyDescriptor(t, n);
		r.get ? Object.defineProperty(e, n, {
			...r,
			enumerable: !1
		}) : xt(e, n, r.value);
	}
}
function vt(e, t, n, r = !0) {
	return Object.defineProperty(e, t, {
		configurable: !0,
		writable: !0,
		enumerable: r,
		value: n
	}), n;
}
function yt(e, t, n) {
	return vt(e, t, n, !1);
}
/* @__NO_SIDE_EFFECTS__ */
function bt(e, t) {
	for (let n in e) {
		let r = e[n];
		Object.defineProperty(t, n, {
			configurable: !0,
			enumerable: !0,
			get() {
				return vt(this, n, r(this));
			},
			set(e) {
				vt(this, n, e);
			}
		});
	}
	return t;
}
function xt(e, t, n) {
	Object.defineProperty(e, t, {
		configurable: !0,
		get() {
			return this == null ? n : vt(this, t, n.bind(this));
		},
		set(e) {
			vt(this, t, e);
		}
	});
}
function St(e, t) {
	let n = Object.getPrototypeOf(e);
	return t in n ? void 0 : n;
}
var Ct, wt = !1, Tt = {
	configurable: !0,
	get() {
		wt = !0;
	}
};
function N(e, t, n) {
	let r = Object.getPrototypeOf(e._zod);
	t in r && Ct !== e._zod ? Ct = void 0 : (Ct = e._zod, Object.defineProperty(r, t, {
		configurable: !0,
		get() {
			Object.defineProperty(this, t, Tt);
			let e = wt;
			wt = !1;
			try {
				let r = n(this);
				return wt ? delete this[t] : Object.defineProperty(this, t, {
					configurable: !0,
					writable: !0,
					value: r
				}), wt ||= e, r;
			} catch (n) {
				throw delete this[t], wt ||= e, n;
			}
		},
		set(e) {
			Object.defineProperty(this, t, {
				configurable: !0,
				writable: !0,
				value: e
			});
		}
	}));
}
function Et(e, t, n, r) {
	let i = St(e, t);
	i && Object.defineProperty(i, t, {
		configurable: !0,
		get() {
			let e = {
				configurable: !0,
				writable: !0,
				enumerable: r,
				value: void 0
			};
			return Object.defineProperty(this, t, e), e.value = n(this), Object.defineProperty(this, t, e), e.value;
		},
		set(e) {
			Object.defineProperty(this, t, {
				configurable: !0,
				writable: !0,
				enumerable: r,
				value: e
			});
		}
	});
}
var Dt = "~constantCatch";
function Ot(e) {
	let t = () => e;
	return t[Dt] = !0, t;
}
// node_modules/zod/v4/core/core.js
var kt, At = /*@__PURE__*/ Object.freeze({ status: "aborted" }), jt = {
	value: void 0,
	enumerable: !1
}, Mt = "captureStackTrace" in Error ? Error : null;
function Nt(e) {
	let t = Mt;
	if (t) {
		let n = t.stackTraceLimit;
		if (typeof n == "number") {
			try {
				t.stackTraceLimit = 0;
			} catch {
				return Mt = null, new e();
			}
			try {
				return new e();
			} finally {
				t.stackTraceLimit = n;
			}
		}
	}
	return new e();
}
/* @__NO_SIDE_EFFECTS__ */
function P(e, t, n, r) {
	let i = {};
	function a(e) {
		this.def = e, this.constr = d, this.traits = /* @__PURE__ */ new Set();
	}
	a.prototype = i;
	let o = n, s = o && /* @__PURE__ */ new WeakSet();
	function c(n, r) {
		if (!n._zod) {
			jt.value = new a(r);
			try {
				Object.defineProperty(n, "_zod", jt);
			} finally {
				jt.value = void 0;
			}
		} else if (n._zod.traits.has(e)) return;
		if (n._zod.traits.add(e), t(n, r), s) {
			let e = Object.getPrototypeOf(n), t = n._zod.constr.prototype, r = e;
			for (; r && r !== t;) r = Object.getPrototypeOf(r);
			let i = r ?? e;
			s.has(i) || (s.add(i), _t(i, o));
		}
		let i = d.prototype;
		for (let e in i) Object.prototype.hasOwnProperty.call(i, e) && (e in n || (n[e] = i[e].bind(n)));
	}
	let l = r?.Parent ?? Object;
	class u extends l {}
	Object.defineProperty(u, "name", { value: e });
	function d(e) {
		let t = r?.Parent ? Nt(u) : this;
		c(t, e);
		let n = t._zod.deferred;
		if (n) {
			for (let e of n) e();
			t._zod.deferred = void 0;
		}
		let i = globalThis.__zod_globalConfig?.postProcessor;
		return i && i(t), t;
	}
	return Object.defineProperty(d, "init", { value: c }), Object.defineProperty(d, Symbol.hasInstance, { value: (t) => r?.Parent && t instanceof r.Parent ? !0 : t?._zod?.traits?.has(e) }), Object.defineProperty(d, "name", { value: e }), d;
}
var Pt = class extends Error {
	constructor() {
		super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
	}
}, Ft = class extends Error {
	constructor(e) {
		super(`Encountered unidirectional transform during encode: ${e}`), this.name = "ZodEncodeError";
	}
};
(kt = globalThis).__zod_globalConfig ?? (kt.__zod_globalConfig = {});
var It = globalThis.__zod_globalConfig;
function Lt(e) {
	return e && Object.assign(It, e), It;
}
// node_modules/zod/v4/core/errors.js
function Rt() {
	let e = this._zod;
	return e.message ??= JSON.stringify(e.def, be, 2), e.message;
}
function zt(e) {
	this._zod.message = e;
}
var Bt = {
	get: Rt,
	set: zt,
	enumerable: !0,
	configurable: !0
}, Vt = {
	value: void 0,
	enumerable: !1
}, Ht = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]), Ut = /* @__PURE__ */ P("$ZodError", (e, t) => {
	e.name = "$ZodError", Vt.value = t, Object.defineProperty(e, "issues", Vt), Vt.value = void 0, Object.defineProperty(e, "message", Bt);
	let n = Object.getPrototypeOf(e);
	Ht.has(n) || (Ht.add(n), Object.defineProperty(n, "toString", {
		configurable: !0,
		enumerable: !1,
		get() {
			let e = () => this.message;
			return Object.defineProperty(this, "toString", {
				value: e,
				configurable: !0,
				writable: !0
			}), e;
		},
		set(e) {
			Object.defineProperty(this, "toString", {
				value: e,
				configurable: !0,
				writable: !0
			});
		}
	}));
});
function Wt(e, t, n) {
	return Object.prototype.hasOwnProperty.call(e, t) || (t === "__proto__" ? Object.defineProperty(e, t, {
		value: n(),
		writable: !0,
		enumerable: !0,
		configurable: !0
	}) : e[t] = n()), e[t];
}
function Gt(e, t = (e) => e.message) {
	let n = {}, r = [];
	for (let i of e.issues) i.path.length > 0 ? Wt(n, i.path[0], () => []).push(t(i)) : r.push(t(i));
	return {
		formErrors: r,
		fieldErrors: n
	};
}
function Kt(e, t = (e) => e.message) {
	let n = { _errors: [] }, r = (e, i = []) => {
		for (let a of e.issues) if (a.code === "invalid_union" && a.errors.length) a.errors.map((e) => r({ issues: e }, [...i, ...a.path]));
		else if (a.code === "invalid_key") r({ issues: a.issues }, [...i, ...a.path]);
		else if (a.code === "invalid_element") r({ issues: a.issues }, [...i, ...a.path]);
		else {
			let e = [...i, ...a.path];
			if (e.length === 0) n._errors.push(t(a));
			else {
				let r = n, i = 0;
				for (; i < e.length;) {
					let n = e[i], o = i === e.length - 1;
					if (n === "_errors") {
						o && r._errors.push(t(a)), i++;
						continue;
					}
					Object.prototype.hasOwnProperty.call(r, n) || Object.defineProperty(r, n, {
						value: { _errors: [] },
						enumerable: !0,
						writable: !0,
						configurable: !0
					});
					let s = r[n];
					o && s._errors.push(t(a)), r = s, i++;
				}
			}
		}
	};
	return r(e), n;
}
// node_modules/zod/v4/core/parse.js
function qt(e, t) {
	return {
		callee: t?.callee ?? e,
		Err: t?.Err
	};
}
var Jt = (e) => {
	let t = (n, r, i, a) => {
		let o = i ? {
			...i,
			async: !1
		} : { async: !1 }, s = n._zod.run({
			value: r,
			issues: []
		}, o);
		if (s instanceof Promise) throw new Pt();
		if (s.issues.length) {
			let n = new ((a?.Err) ?? e)(s.issues.map((e) => dt(e, o, Lt())));
			throw Re(n, a?.callee ?? t), n;
		}
		return s.value;
	};
	return t;
}, Yt = (e) => {
	let t = async (n, r, i, a) => {
		let o = i ? {
			...i,
			async: !0
		} : { async: !0 }, s = n._zod.run({
			value: r,
			issues: []
		}, o);
		if (s instanceof Promise && (s = await s), s.issues.length) {
			let n = new ((a?.Err) ?? e)(s.issues.map((e) => dt(e, o, Lt())));
			throw Re(n, a?.callee ?? t), n;
		}
		return s.value;
	};
	return t;
}, Xt = (e) => (t, n, r) => {
	let i = r ? {
		...r,
		async: !1
	} : { async: !1 }, a = t._zod.run({
		value: n,
		issues: []
	}, i);
	if (a instanceof Promise) throw new Pt();
	return a.issues.length ? Zt(e, a.issues, i) : {
		success: !0,
		data: a.value
	};
};
function Zt(e, t, n) {
	let r;
	return {
		success: !1,
		get error() {
			return r || (r = new e(t.map((e) => dt(e, n, Lt()))), t = void 0, n = void 0), r;
		},
		set error(e) {
			r = e, t = void 0, n = void 0;
		}
	};
}
var Qt = (e) => async (t, n, r) => {
	let i = r ? {
		...r,
		async: !0
	} : { async: !0 }, a = t._zod.run({
		value: n,
		issues: []
	}, i);
	return a instanceof Promise && (a = await a), a.issues.length ? Zt(e, a.issues, i) : {
		success: !0,
		data: a.value
	};
}, $t = /* @__PURE__ */ Symbol.for("zod.compile.invalid"), en = /* @__PURE__ */ Symbol.for("zod.compile.fallback"), tn = ((e, t, n) => {
	let r = e._zod.bag.validator;
	if (r !== void 0) {
		if (r(t) !== $t) return !0;
		if (r.definite === !0 && n === void 0) return !1;
	}
	return nn(e, t, n);
});
function nn(e, t, n) {
	let r = n ? {
		...n,
		async: !1,
		abortEarly: !0
	} : {
		async: !1,
		abortEarly: !0
	}, i = e._zod.bag.fallbackRun, a;
	if (i ? (r[en] = !0, a = i({
		value: t,
		issues: []
	}, r)) : a = e._zod.run({
		value: t,
		issues: []
	}, r), a instanceof Promise) throw new Pt();
	return a.issues.length === 0;
}
var rn = async (e, t, n) => {
	let r = n ? {
		...n,
		async: !0,
		abortEarly: !0
	} : {
		async: !0,
		abortEarly: !0
	}, i = e._zod.run({
		value: t,
		issues: []
	}, r);
	return i instanceof Promise && (i = await i), i.issues.length === 0;
}, an = (e) => {
	let t = Jt(e), n = (e, r, i, a) => {
		let o = i ? {
			...i,
			direction: "backward"
		} : { direction: "backward" };
		return t(e, r, o, qt(n, a));
	};
	return n;
}, on = (e) => {
	let t = Jt(e), n = (e, r, i, a) => t(e, r, i, qt(n, a));
	return n;
}, sn = (e) => {
	let t = Yt(e), n = async (e, r, i, a) => {
		let o = i ? {
			...i,
			direction: "backward"
		} : { direction: "backward" };
		return await t(e, r, o, qt(n, a));
	};
	return n;
}, cn = (e) => {
	let t = Yt(e), n = async (e, r, i, a) => await t(e, r, i, qt(n, a));
	return n;
}, ln = (e) => (t, n, r) => {
	let i = r ? {
		...r,
		direction: "backward"
	} : { direction: "backward" };
	return Xt(e)(t, n, i);
}, un = (e) => (t, n, r) => Xt(e)(t, n, r), dn = (e) => async (t, n, r) => {
	let i = r ? {
		...r,
		direction: "backward"
	} : { direction: "backward" };
	return Qt(e)(t, n, i);
}, fn = (e) => async (t, n, r) => Qt(e)(t, n, r), pn = /^[cC][0-9a-z]{6,}$/, mn = /^[0-9a-z]+$/, hn = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/, gn = /^[0-9a-vA-V]{20}$/, _n = /^[A-Za-z0-9]{27}$/, vn = /^[a-zA-Z0-9_-]{21}$/;
function yn(e) {
	return RegExp(`^[a-zA-Z0-9_-]{${e}}$`);
}
var bn = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, xn = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, Sn = (e) => e ? RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, Cn = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, wn = "^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$";
function Tn() {
	return new RegExp(wn, "u");
}
var En = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Dn = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/, On = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, kn = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, An = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, jn = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/, Mn = /^https?$/, Nn = /^\+[1-9]\d{6,14}$/, Pn = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))";
function Fn(e) {
	return RegExp(`^${e}$`);
}
var In = /*@__PURE__*/ Fn(Pn);
function Ln(e) {
	let t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
	return typeof e.precision == "number" ? e.precision === -1 ? `${t}` : e.precision === 0 ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : e.seconds ? `${t}:[0-5]\\d(?:\\.\\d+)?` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function Rn(e) {
	return RegExp(`^${Ln(e)}$`);
}
function zn(e) {
	let t = ["Z"];
	e.offset && t.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
	let n = `${Ln({
		precision: e.precision,
		seconds: !0
	})}(?:${t.join("|")})`, r = e.local ? `${n}|${Ln({ precision: e.precision })}` : n;
	return RegExp(`^${Pn}T(?:${r})$`);
}
var Bn = /^[\s\S]{0,}$/, Vn = /^-?\d+$/, Hn = /^-?\d+(?:\.\d+)?$/, Un = /^(?:true|false)$/i, Wn = /^null$/i, Gn = /^[^A-Z]*$/, Kn = /^[^a-z]*$/, qn = /*@__PURE__*/ P("$ZodCheck", (e, t) => {
	var n;
	e._zod ??= {}, e._zod.def = t, (n = e._zod).onattach ?? (n.onattach = []);
}), Jn = (e) => {
	let t = e.value;
	return !Ce(t) && t.length !== void 0;
}, Yn = {
	number: "number",
	bigint: "bigint",
	object: "date"
}, Xn = /*@__PURE__*/ P("$ZodCheckLessThan", (e, t) => {
	qn.init(e, t);
	let n = Yn[typeof t.value];
	e._zod.check = (r) => {
		(t.inclusive ? r.value <= t.value : r.value < t.value) || r.issues.push({
			origin: Yn[typeof r.value] ?? n,
			code: "too_big",
			maximum: typeof t.value == "object" ? t.value.getTime() : t.value,
			input: r.value,
			inclusive: t.inclusive,
			inst: e,
			continue: !t.abort
		});
	};
}), Zn = /*@__PURE__*/ P("$ZodCheckGreaterThan", (e, t) => {
	qn.init(e, t);
	let n = Yn[typeof t.value];
	e._zod.check = (r) => {
		(t.inclusive ? r.value >= t.value : r.value > t.value) || r.issues.push({
			origin: Yn[typeof r.value] ?? n,
			code: "too_small",
			minimum: typeof t.value == "object" ? t.value.getTime() : t.value,
			input: r.value,
			inclusive: t.inclusive,
			inst: e,
			continue: !t.abort
		});
	};
}), Qn = /*@__PURE__*/ P("$ZodCheckMultipleOf", (e, t) => {
	qn.init(e, t), e._zod.check = (n) => {
		if (typeof n.value != typeof t.value) throw Error("Cannot mix number and bigint in multiple_of check.");
		(typeof n.value == "bigint" ? t.value !== BigInt(0) && n.value % t.value === BigInt(0) : Te(n.value, t.value) === 0) || n.issues.push({
			origin: typeof n.value,
			code: "not_multiple_of",
			divisor: t.value,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), $n = /*@__PURE__*/ P("$ZodCheckNumberFormat", (e, t) => {
	qn.init(e, t), t.format = t.format || "float64";
	let n = t.format?.includes("int"), r = n ? "int" : "number", [i, a] = Je[t.format];
	e._zod.check = (o) => {
		let s = o.value;
		if (n) {
			if (!Number.isInteger(s)) {
				o.issues.push({
					expected: r,
					format: t.format,
					code: "invalid_type",
					continue: !1,
					input: s,
					inst: e
				});
				return;
			}
			if (!Number.isSafeInteger(s)) {
				s > 0 ? o.issues.push({
					input: s,
					code: "too_big",
					maximum: 2 ** 53 - 1,
					note: "Integers must be within the safe integer range.",
					inst: e,
					origin: r,
					inclusive: !0,
					continue: !t.abort
				}) : o.issues.push({
					input: s,
					code: "too_small",
					minimum: -(2 ** 53 - 1),
					note: "Integers must be within the safe integer range.",
					inst: e,
					origin: r,
					inclusive: !0,
					continue: !t.abort
				});
				return;
			}
		}
		s < i && o.issues.push({
			origin: "number",
			input: s,
			code: "too_small",
			minimum: i,
			inclusive: !0,
			inst: e,
			continue: !t.abort
		}), s > a && o.issues.push({
			origin: "number",
			input: s,
			code: "too_big",
			maximum: a,
			inclusive: !0,
			inst: e,
			continue: !t.abort
		});
	};
}), er = /*@__PURE__*/ P("$ZodCheckMaxLength", (e, t) => {
	var n;
	qn.init(e, t), (n = e._zod.def).when ?? (n.when = Jn), e._zod.check = (n) => {
		let r = n.value, i = r.length;
		if ((typeof r == "string" && i > t.maximum ? pt(r) : i) <= t.maximum) return;
		let a = mt(r);
		n.issues.push({
			origin: a,
			code: "too_big",
			maximum: t.maximum,
			inclusive: !0,
			input: r,
			inst: e,
			continue: !t.abort
		});
	};
}), tr = /*@__PURE__*/ P("$ZodCheckMinLength", (e, t) => {
	var n;
	qn.init(e, t), (n = e._zod.def).when ?? (n.when = Jn), e._zod.check = (n) => {
		let r = n.value, i = r.length;
		if ((typeof r == "string" && i >= t.minimum && i < t.minimum * 2 ? pt(r) : i) >= t.minimum) return;
		let a = mt(r);
		n.issues.push({
			origin: a,
			code: "too_small",
			minimum: t.minimum,
			inclusive: !0,
			input: r,
			inst: e,
			continue: !t.abort
		});
	};
}), nr = /*@__PURE__*/ P("$ZodCheckLengthEquals", (e, t) => {
	var n;
	qn.init(e, t), (n = e._zod.def).when ?? (n.when = Jn), e._zod.check = (n) => {
		let r = n.value, i = r.length, a = typeof r == "string" && i >= t.length && i <= t.length * 2 ? pt(r) : i;
		if (a === t.length) return;
		let o = mt(r), s = a > t.length;
		n.issues.push({
			origin: o,
			...s ? {
				code: "too_big",
				maximum: t.length
			} : {
				code: "too_small",
				minimum: t.length
			},
			inclusive: !0,
			exact: !0,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), rr = /*@__PURE__*/ P("$ZodCheckStringFormat", (e, t) => {
	var n, r;
	qn.init(e, t), t.pattern ? (n = e._zod).check ?? (n.check = (n) => {
		t.pattern.lastIndex = 0, t.pattern.test(n.value) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: t.format,
			input: n.value,
			...t.pattern ? { pattern: t.pattern.toString() } : {},
			inst: e,
			continue: !t.abort
		});
	}) : (r = e._zod).check ?? (r.check = () => {});
}), ir = /*@__PURE__*/ P("$ZodCheckRegex", (e, t) => {
	rr.init(e, t), e._zod.check = (n) => {
		t.pattern.lastIndex = 0, t.pattern.test(n.value) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "regex",
			input: n.value,
			pattern: t.pattern.toString(),
			inst: e,
			continue: !t.abort
		});
	};
}), ar = /*@__PURE__*/ P("$ZodCheckLowerCase", (e, t) => {
	t.pattern ??= Gn, rr.init(e, t);
}), or = /*@__PURE__*/ P("$ZodCheckUpperCase", (e, t) => {
	t.pattern ??= Kn, rr.init(e, t);
}), sr = /*@__PURE__*/ P("$ZodCheckIncludes", (e, t) => {
	qn.init(e, t);
	let n = We(t.includes);
	t.pattern = new RegExp(typeof t.position == "number" ? `^.{${t.position},}${n}` : n), e._zod.check = (n) => {
		n.value.includes(t.includes, t.position) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "includes",
			includes: t.includes,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), cr = /*@__PURE__*/ P("$ZodCheckStartsWith", (e, t) => {
	qn.init(e, t);
	let n = RegExp(`^${We(t.prefix)}.*`);
	t.pattern ??= n, e._zod.check = (n) => {
		n.value.startsWith(t.prefix) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "starts_with",
			prefix: t.prefix,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), lr = /*@__PURE__*/ P("$ZodCheckEndsWith", (e, t) => {
	qn.init(e, t);
	let n = RegExp(`.*${We(t.suffix)}$`);
	t.pattern ??= n, e._zod.check = (n) => {
		n.value.endsWith(t.suffix) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "ends_with",
			suffix: t.suffix,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), ur = /*@__PURE__*/ P("$ZodCheckOverwrite", (e, t) => {
	qn.init(e, t), e._zod.check = (e) => {
		e.value = t.tx(e.value);
	};
}), dr = class {
	constructor(e = [], t = {}) {
		this.content = [], this.indent = 0, this.args = e, this.closed = t;
	}
	indented(e) {
		this.indent += 1;
		try {
			e(this);
		} finally {
			--this.indent;
		}
	}
	write(e) {
		if (typeof e == "function") {
			e(this, { execution: "sync" }), e(this, { execution: "async" });
			return;
		}
		let t = e.split("\n").filter((e) => e), n = Math.min(...t.map((e) => e.length - e.trimStart().length)), r = t.map((e) => e.slice(n)).map((e) => " ".repeat(this.indent * 2) + e);
		for (let e of r) this.content.push(e);
	}
	compile() {
		let e = Function, t = this?.content ?? [""];
		return new e(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {\n${t.join("\n")}\n};`)(...Object.values(this.closed));
	}
}, fr = {
	major: 4,
	minor: 6,
	patch: 7
}, pr = /*@__PURE__*/ P("$ZodType", (e, t) => {
	var n;
	e ??= {}, e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = fr;
	let r = e._zod.def.checks, i = e._zod.traits.has("$ZodCheck") ? [e, ...r ?? []] : r?.length ? [...r] : [];
	for (let t of i) for (let n of t._zod.onattach) n(e);
	if (i.length === 0) (n = e._zod).deferred ?? (n.deferred = []), e._zod.deferred?.push(() => {
		e._zod.run = e._zod.parse;
	});
	else {
		let t = (t, n, r) => {
			if (t.memo) return t;
			let i = at(t), a;
			for (let o of n) {
				if (o._zod.def.when) {
					if (ot(t) || !o._zod.def.when(t)) continue;
				} else if (i) continue;
				let n = t.issues.length, s = o._zod.check(t);
				if (s instanceof Promise && r?.async === !1) throw new Pt();
				if (a || s instanceof Promise) a = (a ?? Promise.resolve()).then(async () => {
					await s, t.issues.length !== n && (ut(t.issues, n, e), i ||= at(t, n));
				});
				else {
					if (t.issues.length === n) continue;
					ut(t.issues, n, e), i ||= at(t, n);
				}
			}
			return a ? a.then(() => t) : t;
		}, n = (n, r, a) => {
			if (at(n)) return n.aborted = !0, n;
			let o = t(r, i, a);
			if (o instanceof Promise) {
				if (a.async === !1) throw new Pt();
				return o.then((t) => e._zod.parse(t, a));
			}
			return e._zod.parse(o, a);
		};
		e._zod.run = (r, a) => {
			if (a.skipChecks) return e._zod.parse(r, a);
			if (a.direction === "backward") {
				let t = e._zod.parse({
					value: r.value,
					issues: []
				}, {
					...a,
					skipChecks: !0
				});
				return t instanceof Promise ? t.then((e) => n(e, r, a)) : n(t, r, a);
			}
			let o = e._zod.parse(r, a);
			if (o instanceof Promise) {
				if (a.async === !1) throw new Pt();
				return o.then((e) => t(e, i, a));
			}
			return t(o, i, a);
		};
	}
}, {
	get "~standard"() {
		return yt(this, "~standard", gr(this));
	},
	set "~standard"(e) {
		vt(this, "~standard", e);
	}
}), mr = (e, t) => e.issues.length ? { issues: e.issues.map((e) => dt(e, t, Lt())) } : { value: e.value };
async function hr(e, t) {
	let n = { async: !0 };
	return mr(await e._zod.run({
		value: t,
		issues: []
	}, n), n);
}
function gr(e) {
	return {
		validate: (t) => {
			let n = { async: !1 };
			try {
				let r = e._zod.run({
					value: t,
					issues: []
				}, n);
				if (!(r instanceof Promise)) return mr(r, n);
			} catch {}
			return hr(e, t);
		},
		vendor: "zod",
		version: 1
	};
}
var _r = /*@__PURE__*/ P("$ZodString", (e, t) => {
	pr.init(e, t), e._zod.pattern = t.pattern ?? Bn, e._zod.parse = (n, r) => {
		if (t.coerce) try {
			n.value = String(n.value);
		} catch {}
		return typeof n.value == "string" || n.issues.push({
			expected: "string",
			code: "invalid_type",
			input: n.value,
			inst: e
		}), n;
	};
}), vr = /*@__PURE__*/ P("$ZodStringFormat", (e, t) => {
	rr.init(e, t), _r.init(e, t);
}), yr = /*@__PURE__*/ P("$ZodGUID", (e, t) => {
	t.pattern ??= xn, vr.init(e, t);
}), br = /*@__PURE__*/ P("$ZodUUID", (e, t) => {
	if (t.version) {
		let e = {
			v1: 1,
			v2: 2,
			v3: 3,
			v4: 4,
			v5: 5,
			v6: 6,
			v7: 7,
			v8: 8
		}[t.version];
		if (e === void 0) throw Error(`Invalid UUID version: "${t.version}"`);
		t.pattern ??= Sn(e);
	} else t.pattern ??= Sn();
	vr.init(e, t);
}), xr = /*@__PURE__*/ P("$ZodEmail", (e, t) => {
	t.pattern ??= Cn, vr.init(e, t);
});
function Sr(e) {
	try {
		return typeof URL < "u" && typeof URL.canParse == "function" ? URL.canParse(e) : (new URL(e), !0);
	} catch {
		return !1;
	}
}
function Cr(e, t) {
	return !("normalize" in t) && !("hostname" in t) && !("protocol" in t) ? Sr(e) || 2 : wr(e, t);
}
function wr(e, t) {
	if (!t.normalize && t.protocol?.source === Mn.source && !/^https?:\/\//i.test(e)) return 1;
	try {
		if (typeof URL < "u") {
			let t = URL;
			if (typeof t.parse == "function") return t.parse(e) ?? 2;
		}
		return new URL(e);
	} catch {
		return 2;
	}
}
var Tr = /[\t\n\r]/g;
function Er(e) {
	return e.replace(Tr, "");
}
function Dr(e, t) {
	return t.lastIndex = 0, t.test(e.hostname);
}
function Or(e, t) {
	return t.lastIndex = 0, t.test(e.protocol.endsWith(":") ? e.protocol.slice(0, -1) : e.protocol);
}
var kr = /*@__PURE__*/ P("$ZodURL", (e, t) => {
	vr.init(e, t), e._zod.check = (n) => {
		try {
			let r = n.value.trim(), i = Cr(r, t);
			if (i === 1) {
				n.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid URL format",
					input: n.value,
					inst: e,
					continue: !t.abort
				});
				return;
			}
			if (i === 2) {
				n.issues.push({
					code: "invalid_format",
					format: "url",
					input: n.value,
					inst: e,
					continue: !t.abort
				});
				return;
			}
			if (i === !0) {
				n.value = Er(r);
				return;
			}
			t.hostname && !Dr(i, t.hostname) && n.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid hostname",
				pattern: t.hostname.source,
				input: n.value,
				inst: e,
				continue: !t.abort
			}), t.protocol && !Or(i, t.protocol) && n.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid protocol",
				pattern: t.protocol.source,
				input: n.value,
				inst: e,
				continue: !t.abort
			}), n.value = t.normalize ? i.href : Er(r);
			return;
		} catch {
			n.issues.push({
				code: "invalid_format",
				format: "url",
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		}
	};
}), Ar = /*@__PURE__*/ P("$ZodEmoji", (e, t) => {
	t.pattern ??= Tn(), vr.init(e, t);
}), jr = /*@__PURE__*/ P("$ZodNanoID", (e, t) => {
	if (t.length !== void 0 && (!Number.isInteger(t.length) || t.length < 1)) throw Error(`Invalid nanoid length: ${t.length}`);
	t.pattern ??= t.length === void 0 ? vn : yn(t.length), vr.init(e, t);
}), Mr = /*@__PURE__*/ P("$ZodCUID", (e, t) => {
	t.pattern ??= pn, vr.init(e, t);
}), Nr = /*@__PURE__*/ P("$ZodCUID2", (e, t) => {
	t.pattern ??= mn, vr.init(e, t);
}), Pr = /*@__PURE__*/ P("$ZodULID", (e, t) => {
	t.pattern ??= hn, vr.init(e, t);
}), Fr = /*@__PURE__*/ P("$ZodXID", (e, t) => {
	t.pattern ??= gn, vr.init(e, t);
}), Ir = /*@__PURE__*/ P("$ZodKSUID", (e, t) => {
	t.pattern ??= _n, vr.init(e, t);
}), Lr = /*@__PURE__*/ P("$ZodISODateTime", (e, t) => {
	t.pattern ??= zn(t), vr.init(e, t);
}), Rr = /*@__PURE__*/ P("$ZodISODate", (e, t) => {
	t.pattern ??= In, vr.init(e, t);
}), zr = /*@__PURE__*/ P("$ZodISOTime", (e, t) => {
	t.pattern ??= Rn(t), vr.init(e, t);
}), Br = /*@__PURE__*/ P("$ZodISODuration", (e, t) => {
	t.pattern ??= bn, vr.init(e, t);
}), Vr = /*@__PURE__*/ P("$ZodIPv4", (e, t) => {
	t.pattern ??= En, vr.init(e, t);
}), Hr = /^[0-9a-fA-F:.]+$/;
function Ur(e) {
	return Hr.test(e) ? Sr(`http://[${e}]`) : !1;
}
var Wr = /*@__PURE__*/ P("$ZodIPv6", (e, t) => {
	t.pattern ??= Dn, vr.init(e, t), e._zod.check = (n) => {
		Ur(n.value) || n.issues.push({
			code: "invalid_format",
			format: "ipv6",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), Gr = /*@__PURE__*/ P("$ZodCIDRv4", (e, t) => {
	t.pattern ??= On, vr.init(e, t);
});
function Kr(e) {
	let t = e.split("/");
	if (t.length !== 2) return !1;
	let [n, r] = t;
	if (!r) return !1;
	let i = Number(r);
	return `${i}` !== r || i < 0 || i > 128 ? !1 : Ur(n);
}
var qr = /*@__PURE__*/ P("$ZodCIDRv6", (e, t) => {
	t.pattern ??= kn, vr.init(e, t), e._zod.check = (n) => {
		Kr(n.value) || n.issues.push({
			code: "invalid_format",
			format: "cidrv6",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
});
function Jr(e) {
	if (e === "") return !0;
	if (/\s/.test(e) || e.length % 4 != 0) return !1;
	try {
		return atob(e), !0;
	} catch {
		return !1;
	}
}
var Yr = /^[0-9a-zA-Z+/]*={0,2}$/, Xr = /*@__PURE__*/ P("$ZodBase64", (e, t) => {
	t.pattern ??= Yr, vr.init(e, t), e._zod.check = (n) => {
		Jr(n.value) || n.issues.push({
			code: "invalid_format",
			format: "base64",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), Zr = /^[A-Za-z0-9_-]*$/;
function Qr(e) {
	if (!Zr.test(e)) return !1;
	let t = e.replace(/[-_]/g, (e) => e === "-" ? "+" : "/");
	return Jr(t.padEnd(Math.ceil(t.length / 4) * 4, "="));
}
var $r = /*@__PURE__*/ P("$ZodBase64URL", (e, t) => {
	t.pattern ??= Zr, vr.init(e, t), e._zod.check = (n) => {
		Qr(n.value) || n.issues.push({
			code: "invalid_format",
			format: "base64url",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), ei = /*@__PURE__*/ P("$ZodE164", (e, t) => {
	t.pattern ??= Nn, vr.init(e, t);
});
function ti(e, t = null) {
	try {
		let n = e.split(".");
		if (n.length !== 3) return !1;
		let [r] = n;
		if (!r) return !1;
		let i = JSON.parse(atob(r));
		return !("typ" in i && i?.typ !== "JWT" || !i.alg || t && (!("alg" in i) || i.alg !== t));
	} catch {
		return !1;
	}
}
var ni = /*@__PURE__*/ P("$ZodJWT", (e, t) => {
	vr.init(e, t), e._zod.check = (n) => {
		ti(n.value, t.alg) || n.issues.push({
			code: "invalid_format",
			format: "jwt",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), ri = /*@__PURE__*/ P("$ZodNumber", (e, t) => {
	pr.init(e, t), e._zod.pattern = Hn, e._zod.parse = (n, r) => {
		if (t.coerce) try {
			n.value = Number(n.value);
		} catch {}
		let i = n.value;
		if (typeof i == "number" && !Number.isNaN(i) && Number.isFinite(i)) return n;
		let a = typeof i == "number" ? Number.isNaN(i) ? "NaN" : Number.isFinite(i) ? void 0 : String(i) : void 0;
		return n.issues.push({
			expected: "number",
			code: "invalid_type",
			input: i,
			inst: e,
			...a ? { received: a } : {}
		}), n;
	};
}), ii = /*@__PURE__*/ P("$ZodNumberFormat", (e, t) => {
	$n.init(e, t), ri.init(e, t);
}), ai = /*@__PURE__*/ P("$ZodBoolean", (e, t) => {
	pr.init(e, t), e._zod.pattern = Un, e._zod.parse = (n, r) => {
		if (t.coerce) try {
			n.value = !!n.value;
		} catch {}
		let i = n.value;
		return typeof i == "boolean" || n.issues.push({
			expected: "boolean",
			code: "invalid_type",
			input: i,
			inst: e
		}), n;
	};
}), oi = /*@__PURE__*/ P("$ZodNull", (e, t) => {
	pr.init(e, t), e._zod.pattern = Wn, e._zod.values = /* @__PURE__ */ new Set([null]), e._zod.parse = (t, n) => {
		let r = t.value;
		return r === null || t.issues.push({
			expected: "null",
			code: "invalid_type",
			input: r,
			inst: e
		}), t;
	};
}), si = /*@__PURE__*/ P("$ZodAny", (e, t) => {
	pr.init(e, t), e._zod.parse = (e) => e;
}), ci = /*@__PURE__*/ P("$ZodUnknown", (e, t) => {
	pr.init(e, t), e._zod.parse = (e) => e;
}), li = /*@__PURE__*/ P("$ZodNever", (e, t) => {
	pr.init(e, t), e._zod.parse = (t, n) => (t.issues.push({
		expected: "never",
		code: "invalid_type",
		input: t.value,
		inst: e
	}), t);
});
function ui(e, t) {
	let n = lt(e._zod.def.checks);
	if (!n.length) return;
	let r = Math.min(...n.map((e) => e[0])), i = e._zod.parse;
	e._zod.parse = (n, a) => {
		let o = t(n.value);
		if (o > r && !a?.skipChecks && a?.direction !== "backward") {
			for (let [t, r] of lt(e._zod.def.checks)) if (o > t && r._zod.def.when(n)) {
				let t = n.issues.length;
				return r._zod.check(n), n.issues[t].continue = !1, ut(n.issues, t, e), n;
			}
		}
		return i(n, a);
	};
}
var di = (e) => Array.isArray(e) ? e.length : -1;
function fi(e, t, n) {
	e.issues.length && t.issues.push(...st(n, e.issues)), t.value[n] = e.value;
}
var pi = /*@__PURE__*/ P("$ZodArray", (e, t) => {
	pr.init(e, t);
	let n = It.memoizer;
	n?.attach(e), e._zod.parse = (r, i) => {
		let a = r.value;
		if (!Array.isArray(a)) return r.issues.push({
			expected: "array",
			code: "invalid_type",
			input: a,
			inst: e
		}), r;
		r.value = n ? n.alloc(e, r, Array(a.length), i) : Array(a.length);
		let o = [], s = i?.abortEarly;
		for (let e = 0; e < a.length; e++) {
			let n = a[e], c = t.element._zod.run({
				value: n,
				issues: []
			}, i);
			if (c instanceof Promise) o.push(c.then((t) => fi(t, r, e)));
			else if (fi(c, r, e), s && c.issues.length !== 0 && at(c)) break;
		}
		return o.length ? Promise.all(o).then(() => r) : r;
	}, ui(e, di);
});
function mi(e, t, n, r, i, a) {
	let o = n in r, s = a === "optional";
	if (o || !s || i !== "optional") {
		if (e.issues.length) {
			if (i !== void 0 && s && !o) return;
			t.issues.push(...st(n, e.issues));
		}
		!o && i === void 0 ? e.issues.length || t.issues.push({
			code: "invalid_type",
			expected: "nonoptional",
			input: void 0,
			path: [n]
		}) : e.value === void 0 ? (o || i === "defaulted" && !s) && (t.value[n] = void 0) : t.value[n] = e.value;
	}
}
var hi = [];
function gi(e) {
	let t = Object.keys(e.shape), n = Object.getOwnPropertySymbols(e.shape), r = n.length ? n : hi, i = r.length ? [...t, ...r] : t;
	for (let t of i) if (!e.shape?.[t]?._zod?.traits?.has("$ZodType")) throw Error(`Invalid element at key "${String(t)}": expected a Zod schema`);
	let a = qe(e.shape);
	return {
		...e,
		allKeys: i,
		symbolKeys: r,
		keySet: new Set(t),
		numKeys: t.length,
		optionalKeys: new Set(a)
	};
}
function _i(e, t, n, r, i, a, o) {
	let s = [], c = i.keySet, l = i.catchall._zod, u = l.def.type, d = l.optin, f = l.optout, p = 0;
	for (let i in t) {
		if (o && n.issues.length !== p) {
			if (at(n, p)) break;
			p = n.issues.length;
		}
		if (c.has(i)) continue;
		if (i === "__proto__") {
			u === "never" && s.push(i);
			continue;
		}
		if (u === "never") {
			s.push(i);
			continue;
		}
		let a = l.run({
			value: t[i],
			issues: []
		}, r);
		a instanceof Promise ? e.push(a.then((e) => mi(e, n, i, t, d, f))) : mi(a, n, i, t, d, f);
	}
	return s.length && n.issues.push({
		code: "unrecognized_keys",
		keys: s,
		input: t,
		inst: a,
		continue: !0
	}), e.length ? Promise.all(e).then(() => n) : n;
}
var vi = /*@__PURE__*/ P("$ZodObject", (e, t) => {
	pr.init(e, t);
	let n = Object.getOwnPropertyDescriptor(t, "shape"), r = n?.get ? n.get.raw : t.shape ?? {};
	if (r) {
		let e = () => {
			let n = { ...r };
			return Object.defineProperty(t, "shape", { value: n }), e.raw = n, n;
		};
		e.raw = r, Object.defineProperty(t, "shape", { get: e });
	}
	let i = Se(() => gi(t));
	N(e, "propValues", (e) => {
		let t = e.def.shape, n = {};
		for (let e in t) {
			let r = t[e]._zod;
			if (r.values) {
				Object.prototype.hasOwnProperty.call(n, e) || Oe(n, e, /* @__PURE__ */ new Set());
				for (let t of r.values) n[e].add(t);
				r.optin !== void 0 && n[e].add(void 0);
			}
		}
		return n;
	});
	let a = ze, o = t.catchall, s, c = It.memoizer;
	c?.attach(e), e._zod.parse = (t, n) => {
		s ??= i.value;
		let r = t.value;
		if (!a(r)) return t.issues.push({
			expected: "object",
			code: "invalid_type",
			input: r,
			inst: e
		}), t;
		t.value = c ? c.alloc(e, t, {}, n) : {};
		let l = [], u = s.shape, d = n?.abortEarly, f = t.issues.length;
		for (let e of s.allKeys) {
			if (d && t.issues.length !== f) {
				if (at(t, f)) break;
				f = t.issues.length;
			}
			if (e === "__proto__") continue;
			let i = u[e], a = i._zod.optin, o = i._zod.optout, s = i._zod.run({
				value: r[e],
				issues: []
			}, n);
			s instanceof Promise ? l.push(s.then((n) => mi(n, t, e, r, a, o))) : mi(s, t, e, r, a, o);
		}
		return o ? _i(l, r, t, n, i.value, e, d === !0) : l.length ? Promise.all(l).then(() => t) : t;
	};
}), yi = /*@__PURE__*/ P("$ZodObjectJIT", (e, t) => {
	vi.init(e, t);
	let n = e._zod.parse, r = Se(() => gi(t)), i = It.memoizer, a = (t) => {
		let n = r.value, a = n.symbolKeys, o = new dr(["payload", "ctx"], {
			shape: t,
			inst: e,
			memo: i,
			syms: a
		}), s = (e) => `shape[${e}]._zod.run({ value: input[${e}], issues: [] }, ctx)`, c = (e, t) => `
          let ${e}_ab = false;
          for (let i = 0; i < ${e}.issues.length; i++) {
            const iss = ${e}.issues[i];
            iss.path = iss.path ? [${t}, ...iss.path] : [${t}];
            payload.issues.push(iss);
            if (iss.continue !== true) ${e}_ab = true;
          }
          if (${e}_ab && ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }`;
		o.write("const input = payload.value;");
		let l = Object.create(null), u = 0;
		for (let e of n.allKeys) l[e] = `key_${u++}`;
		o.write(i ? "const newResult = memo.alloc(inst, payload, {}, ctx);" : "const newResult = {};");
		for (let e of n.allKeys) {
			if (e === "__proto__") continue;
			let n = l[e], r = typeof e == "symbol" ? `syms[${a.indexOf(e)}]` : Ie(e), i = `${r} in input`, u = t[e], d = u?._zod?.optin, f = d !== void 0, p = u?._zod?.optout === "optional";
			if (o.write(`const ${n} = ${s(r)};`), f && p) {
				let e = d === "optional" ? `${n}_present` : `${n}.value !== undefined || ${n}_present`;
				o.write(`
        const ${n}_present = ${i};
        if (!${n}.issues.length || ${n}_present) {
          if (${n}.issues.length) {${c(n, r)}
          }

          if (${e}) {
            newResult[${r}] = ${n}.value;
          }
        }

      `);
			} else f ? (o.write(`
        if (${n}.issues.length) {${c(n, r)}
        }
      `), d === "defaulted" ? o.write(`newResult[${r}] = ${n}.value;`) : o.write(`
        if (${n}.value !== undefined || ${i}) {
          newResult[${r}] = ${n}.value;
        }
      `)) : o.write(`
        const ${n}_present = ${i};
        if (${n}.issues.length) {${c(n, r)}
        }
        if (!${n}_present && !${n}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${r}]
          });
          if (ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }
        }

        if (${n}_present) {
          newResult[${r}] = ${n}.value;
        }

      `);
		}
		return o.write("payload.value = newResult;"), o.write("return payload;"), o.compile();
	}, o, s = ze, c = !It.jitless, l = c && Be.value, u = t.catchall, d;
	e._zod.parse = (i, f) => {
		d ??= r.value;
		let p = i.value;
		return s(p) ? c && l && f?.async === !1 && f.jitless !== !0 ? (o ||= a(t.shape), i = o(i, f), u ? _i([], p, i, f, d, e, f?.abortEarly === !0) : i) : n(i, f) : (i.issues.push({
			expected: "object",
			code: "invalid_type",
			input: p,
			inst: e
		}), i);
	};
});
function bi(e, t, n, r) {
	for (let n of e) if (n.issues.length === 0) return t.value = n.value, t;
	let i = e.filter((e) => !at(e));
	return i.length === 1 ? (t.value = i[0].value, i[0]) : (t.issues.push({
		code: "invalid_union",
		input: t.value,
		inst: n,
		errors: e.map((e) => e.issues.map((e) => dt(e, r, Lt())))
	}), t);
}
var xi = /*@__PURE__*/ P("$ZodUnion", (e, t) => {
	pr.init(e, t), N(e, "optin", (e) => e.def.options.some((e) => e._zod.optin === "defaulted") ? "defaulted" : e.def.options.some((e) => e._zod.optin !== void 0) ? "optional" : void 0), N(e, "optout", (e) => e.def.options.some((e) => e._zod.optout === "optional") ? "optional" : void 0), N(e, "values", (e) => {
		if (e.def.options.every((e) => e._zod.values)) return new Set(e.def.options.flatMap((e) => Array.from(e._zod.values)));
	}), N(e, "pattern", (e) => {
		if (e.def.options.every((e) => e._zod.pattern)) {
			let t = e.def.options.map((e) => e._zod.pattern);
			return RegExp(`^(${t.map((e) => we(e.source)).join("|")})$`);
		}
	});
	let n = t.options.length === 1 ? t.options[0]._zod.run : null;
	e._zod.parse = (r, i) => {
		if (n) return n(r, i);
		let a = !1, o = [];
		for (let e of t.options) {
			let t = e._zod.run({
				value: r.value,
				issues: []
			}, i);
			if (t instanceof Promise) o.push(t), a = !0;
			else {
				if (t.issues.length === 0) return t;
				o.push(t);
			}
		}
		return a ? Promise.all(o).then((t) => bi(t, r, e, i)) : bi(o, r, e, i);
	};
});
function Si(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.options) {
		let r = n._zod.propValues?.[e.discriminator];
		if (!r || r.size === 0) throw Error(`Invalid discriminated union option at index "${e.options.indexOf(n)}"`);
		for (let e of r) if (t.has(e)) {
			if (e !== void 0) throw Error(`Duplicate discriminator value "${String(e)}"`);
			t.set(e, null);
		} else t.set(e, n);
	}
	return t;
}
var Ci = /*@__PURE__*/ P("$ZodDiscriminatedUnion", (e, t) => {
	t.inclusive = !1, xi.init(e, t);
	let n = e._zod.parse;
	N(e, "propValues", (e) => {
		let t = {}, n = 0;
		for (let r of e.def.options) {
			let i = r._zod.propValues;
			if (!i || Object.keys(i).length === 0) throw Error(`Invalid discriminated union option at index "${e.def.options.indexOf(r)}"`);
			i[e.def.discriminator]?.has(void 0) && n++;
			for (let [e, n] of Object.entries(i)) {
				Object.prototype.hasOwnProperty.call(t, e) || Oe(t, e, /* @__PURE__ */ new Set());
				for (let r of n) t[e].add(r);
			}
		}
		return !e.def.unionFallback && n > 1 && t[e.def.discriminator]?.delete(void 0), t;
	}), t.options.forEach((e, n) => {
		let r = ke(e._zod.def);
		if (r && !Object.prototype.hasOwnProperty.call(r, t.discriminator)) throw Error(`Invalid discriminated union option at index "${n}"`);
	});
	let r = Se(() => Si(t));
	e._zod.parse = (i, a) => {
		let o = i.value;
		if (!ze(o)) return i.issues.push({
			code: "invalid_type",
			expected: "object",
			input: o,
			inst: e
		}), i;
		let s = o?.[t.discriminator], c = r.value.get(s);
		return c && (s !== void 0 || a.direction !== "backward") ? c._zod.run(i, a) : t.unionFallback || a.direction === "backward" ? n(i, a) : (i.issues.push({
			code: "invalid_union",
			errors: [],
			note: "No matching discriminator",
			discriminator: t.discriminator,
			options: Array.from(r.value.keys()).filter((e) => r.value.get(e) !== null),
			input: o,
			path: [t.discriminator],
			inst: e
		}), i);
	};
}), wi = /*@__PURE__*/ P("$ZodIntersection", (e, t) => {
	pr.init(e, t), e._zod.parse = (e, n) => {
		let r = e.value, i = t.left._zod.run({
			value: r,
			issues: []
		}, n), a = t.right._zod.run({
			value: r,
			issues: []
		}, n);
		return i instanceof Promise || a instanceof Promise ? Promise.all([i, a]).then(([t, n]) => Ei(e, t, n)) : Ei(e, i, a);
	};
});
function Ti(e, t) {
	if (e === t || e instanceof Date && t instanceof Date && +e == +t) return {
		valid: !0,
		data: e
	};
	if (Ve(e) && Ve(t)) {
		let n = Object.keys(t), r = Object.keys(e).filter((e) => n.indexOf(e) !== -1), i = {
			...e,
			...t
		};
		Object.prototype.hasOwnProperty.call(i, "__proto__") && delete i.__proto__;
		for (let n of r) {
			if (n === "__proto__") continue;
			let r = Ti(e[n], t[n]);
			if (!r.valid) return {
				valid: !1,
				mergeErrorPath: [n, ...r.mergeErrorPath]
			};
			i[n] = r.data;
		}
		return {
			valid: !0,
			data: i
		};
	}
	if (Array.isArray(e) && Array.isArray(t)) {
		if (e.length !== t.length) return {
			valid: !1,
			mergeErrorPath: []
		};
		let n = [];
		for (let r = 0; r < e.length; r++) {
			let i = e[r], a = t[r], o = Ti(i, a);
			if (!o.valid) return {
				valid: !1,
				mergeErrorPath: [r, ...o.mergeErrorPath]
			};
			n.push(o.data);
		}
		return {
			valid: !0,
			data: n
		};
	}
	return {
		valid: !1,
		mergeErrorPath: []
	};
}
function Ei(e, t, n) {
	let r = /* @__PURE__ */ new Map(), i, a = /* @__PURE__ */ new Map(), o = (e, t) => {
		let n;
		if (e.code === "unrecognized_keys" && !e.path?.length) i ??= e, n = e.keys;
		else if (e.code === "invalid_key" && e.origin === "record" && e.path?.length === 1) {
			let t = String(e.path[0]);
			a.has(t) || a.set(t, e), n = [t];
		} else return !1;
		for (let e of n) r.has(e) || r.set(e, {}), r.get(e)[t] = !0;
		return !0;
	};
	for (let n of t.issues) o(n, "l") || e.issues.push(n);
	for (let t of n.issues) o(t, "r") || e.issues.push(t);
	let s = [...r].filter(([, e]) => e.l && e.r).map(([e]) => e);
	if (s.length) {
		let t = i ? s.filter((e) => i.keys.includes(e)) : [];
		t.length && e.issues.push({
			...i,
			keys: t
		});
		for (let n of s) !t.includes(n) && a.has(n) && e.issues.push(a.get(n));
	}
	let c = Ti(t.value, n.value);
	if (!c.valid) {
		if (at(e)) return e;
		throw Error(`Unmergable intersection. Error path: ${JSON.stringify(c.mergeErrorPath)}`);
	}
	return e.value = c.data, e;
}
var Di = /*@__PURE__*/ P("$ZodTuple", (e, t) => {
	pr.init(e, t);
	let n = t.items, r = It.memoizer;
	r?.attach(e), e._zod.parse = (i, a) => {
		let o = i.value;
		if (!Array.isArray(o)) return i.issues.push({
			input: o,
			inst: e,
			expected: "tuple",
			code: "invalid_type"
		}), i;
		i.value = r ? r.alloc(e, i, [], a) : [];
		let s = [], c = Oi(n, "optin"), l = Oi(n, "optout");
		if (!t.rest) {
			if (o.length < c) return i.issues.push({
				code: "too_small",
				minimum: c,
				inclusive: !0,
				input: o,
				inst: e,
				origin: "array"
			}), i;
			o.length > n.length && i.issues.push({
				code: "too_big",
				maximum: n.length,
				inclusive: !0,
				input: o,
				inst: e,
				origin: "array"
			});
		}
		let u = Array(n.length), d = t.rest ? a?.abortEarly : void 0, f = !1;
		for (let e = 0; e < n.length; e++) {
			let t = n[e]._zod.run({
				value: o[e],
				issues: []
			}, a);
			t instanceof Promise ? s.push(t.then((t) => {
				u[e] = t;
			})) : (u[e] = t, d && !f && t.issues.length && (f = at(t)));
		}
		if (t.rest && !f) {
			let e = n.length - 1, r = o.slice(n.length), c = i.issues.length;
			for (let n of r) {
				if (d && i.issues.length !== c) {
					if (at(i, c)) break;
					c = i.issues.length;
				}
				e++;
				let r = t.rest._zod.run({
					value: n,
					issues: []
				}, a);
				r instanceof Promise ? s.push(r.then((t) => ki(t, i, e))) : ki(r, i, e);
			}
		}
		return s.length ? Promise.all(s).then(() => Ai(u, i, n, o, l)) : Ai(u, i, n, o, l);
	};
});
function Oi(e, t) {
	for (let n = e.length - 1; n >= 0; n--) if (!(t === "optin" ? e[n]._zod.optin !== void 0 : e[n]._zod.optout === "optional")) return n + 1;
	return 0;
}
function ki(e, t, n) {
	e.issues.length && t.issues.push(...st(n, e.issues)), t.value[n] = e.value;
}
function Ai(e, t, n, r, i) {
	for (let a = 0; a < n.length; a++) {
		let o = e[a], s = a < r.length;
		if (!s && a >= i && n[a]._zod.optin === "optional") {
			t.value.length = a;
			break;
		}
		if (o.issues.length) {
			if (!s && a >= i) {
				t.value.length = a;
				break;
			}
			t.issues.push(...st(a, o.issues));
		}
		t.value[a] = o.value;
	}
	for (let e = t.value.length - 1; e >= r.length && n[e]._zod.optout === "optional" && t.value[e] === void 0; e--) t.value.length = e;
	return t;
}
var ji = /*@__PURE__*/ P("$ZodRecord", (e, t) => {
	pr.init(e, t);
	let n = It.memoizer;
	n?.attach(e), e._zod.parse = (r, i) => {
		let a = r.value;
		if (!Ve(a)) return r.issues.push({
			expected: "record",
			code: "invalid_type",
			input: a,
			inst: e
		}), r;
		let o = [], s = t.keyType._zod.values;
		if (s && !t.partial) {
			r.value = n ? n.alloc(e, r, {}, i) : {};
			let c = /* @__PURE__ */ new Set();
			for (let n of s) if (typeof n == "string" || typeof n == "number" || typeof n == "symbol") {
				if (c.add(typeof n == "number" ? n.toString() : n), n === "__proto__") continue;
				let s = t.keyType._zod.run({
					value: n,
					issues: []
				}, i);
				if (s instanceof Promise) throw Error("Async schemas not supported in object keys currently");
				if (s.issues.length) {
					r.issues.push({
						code: "invalid_key",
						origin: "record",
						issues: s.issues.map((e) => dt(e, i, Lt())),
						input: n,
						path: [n],
						inst: e
					});
					continue;
				}
				let l = s.value;
				if (l === "__proto__") continue;
				let u = t.valueType._zod.run({
					value: a[n],
					issues: []
				}, i);
				u instanceof Promise ? o.push(u.then((e) => {
					e.issues.length && r.issues.push(...st(n, e.issues)), r.value[l] = e.value;
				})) : (u.issues.length && r.issues.push(...st(n, u.issues)), r.value[l] = u.value);
			}
			let l;
			for (let e in a) if (!c.has(e)) {
				if (t.mode === "loose") {
					if (e === "__proto__") continue;
					r.value[e] = a[e];
				} else l ??= [], l.push(e);
			}
			l && l.length > 0 && r.issues.push({
				code: "unrecognized_keys",
				input: a,
				inst: e,
				keys: l,
				continue: !0
			});
		} else {
			r.value = n ? n.alloc(e, r, {}, i) : {};
			let c;
			for (let n of Reflect.ownKeys(a)) {
				if (n === "__proto__" || !Object.prototype.propertyIsEnumerable.call(a, n)) continue;
				let l = t.keyType._zod.run({
					value: n,
					issues: []
				}, i);
				if (l instanceof Promise) throw Error("Async schemas not supported in object keys currently");
				if (typeof n == "string" && Hn.test(n) && l.issues.length) {
					let e = t.keyType._zod.run({
						value: Number(n),
						issues: []
					}, i);
					if (e instanceof Promise) throw Error("Async schemas not supported in object keys currently");
					e.issues.length === 0 && (l = e);
				}
				if (l.issues.length) {
					t.mode === "loose" ? r.value[n] = a[n] : s ? (c ??= [], c.push(n)) : r.issues.push({
						code: "invalid_key",
						origin: "record",
						issues: l.issues.map((e) => dt(e, i, Lt())),
						input: n,
						path: [n],
						inst: e
					});
					continue;
				}
				let u = l.value;
				if (u === "__proto__") continue;
				let d = t.valueType._zod.run({
					value: a[n],
					issues: []
				}, i);
				d instanceof Promise ? o.push(d.then((e) => {
					e.issues.length && r.issues.push(...st(n, e.issues)), r.value[u] = e.value;
				})) : (d.issues.length && r.issues.push(...st(n, d.issues)), r.value[u] = d.value);
			}
			c && c.length > 0 && r.issues.push({
				code: "unrecognized_keys",
				input: a,
				inst: e,
				keys: c,
				continue: !0
			});
		}
		return o.length ? Promise.all(o).then(() => r) : r;
	};
}), Mi = /*@__PURE__*/ P("$ZodEnum", (e, t) => {
	pr.init(e, t);
	let n = ve(t.entries), r = new Set(n);
	e._zod.values = r, N(e, "pattern", (e) => {
		let t = ve(e.def.entries).filter((e) => Ue.has(typeof e));
		return RegExp(t.length ? `^(${t.map((e) => We(e.toString())).join("|")})$` : "^[^\\s\\S]$");
	}), e._zod.parse = (t, i) => {
		let a = t.value;
		return r.has(a) || t.issues.push({
			code: "invalid_value",
			values: n,
			input: a,
			inst: e
		}), t;
	};
}), Ni = /*@__PURE__*/ P("$ZodLiteral", (e, t) => {
	pr.init(e, t);
	let n = new Set(t.values);
	e._zod.values = n, N(e, "pattern", (e) => {
		let t = e.def.values;
		return RegExp(t.length ? `^(${t.map((e) => typeof e == "string" ? We(e) : e ? We(e.toString()) : String(e)).join("|")})$` : "^[^\\s\\S]$");
	}), e._zod.parse = (r, i) => {
		let a = r.value;
		return n.has(a) || r.issues.push({
			code: "invalid_value",
			values: t.values,
			input: a,
			inst: e
		}), r;
	};
}), Pi = /*@__PURE__*/ P("$ZodTransform", (e, t) => {
	pr.init(e, t), e._zod.optin = "optional", It.memoizer?.guard(e), e._zod.parse = (n, r) => {
		if (r.direction === "backward") throw new Ft(e.constructor.name);
		let i = t.transform(n.value, n);
		if (r.async) return (i instanceof Promise ? i : Promise.resolve(i)).then((e) => (n.value = e, n));
		if (i instanceof Promise) throw new Pt();
		return n.value = i, n;
	};
});
function Fi(e, t) {
	return e.value = t.issues.length ? void 0 : t.value, e;
}
var Ii = /*@__PURE__*/ P("$ZodOptional", (e, t) => {
	pr.init(e, t), N(e, "optin", (e) => e.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional"), e._zod.optout = "optional", N(e, "values", (e) => {
		let t = e.def.innerType._zod.values;
		return t ? /* @__PURE__ */ new Set([...t, void 0]) : void 0;
	}), N(e, "pattern", (e) => {
		let t = e.def.innerType._zod.pattern;
		return t ? RegExp(`^(${we(t.source)})?$`) : void 0;
	}), e._zod.parse = (e, n) => {
		if (e.value === void 0) {
			if (t.innerType._zod.optin !== "defaulted") return e;
			let r = t.innerType._zod.run({
				value: e.value,
				issues: []
			}, n);
			return r instanceof Promise ? r.then((t) => Fi(e, t)) : Fi(e, r);
		}
		return t.innerType._zod.run(e, n);
	};
}), Li = /*@__PURE__*/ P("$ZodExactOptional", (e, t) => {
	Ii.init(e, t), N(e, "values", (e) => e.def.innerType._zod.values), N(e, "pattern", (e) => e.def.innerType._zod.pattern), e._zod.parse = (e, n) => t.innerType._zod.run(e, n);
}), Ri = /*@__PURE__*/ P("$ZodNullable", (e, t) => {
	pr.init(e, t), N(e, "optin", (e) => e.def.innerType._zod.optin), N(e, "optout", (e) => e.def.innerType._zod.optout), N(e, "pattern", (e) => {
		let t = e.def.innerType._zod.pattern;
		return t ? RegExp(`^(${we(t.source)}|null)$`) : void 0;
	}), N(e, "values", (e) => e.def.innerType._zod.values ? /* @__PURE__ */ new Set([...e.def.innerType._zod.values, null]) : void 0), e._zod.parse = (e, n) => e.value === null ? e : t.innerType._zod.run(e, n);
}), zi = /*@__PURE__*/ P("$ZodDefault", (e, t) => {
	pr.init(e, t), e._zod.optin = "defaulted", N(e, "values", (e) => e.def.innerType._zod.values), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		if (e.value === void 0) return e.value = t.defaultValue, e;
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then((e) => Bi(e, t)) : Bi(r, t);
	};
});
function Bi(e, t) {
	return e.value === void 0 && (e.value = t.defaultValue), e;
}
var Vi = /*@__PURE__*/ P("$ZodPrefault", (e, t) => {
	pr.init(e, t), e._zod.optin = "defaulted", N(e, "values", (e) => e.def.innerType._zod.values), e._zod.parse = (e, n) => (n.direction === "backward" || e.value === void 0 && (e.value = t.defaultValue), t.innerType._zod.run(e, n));
}), Hi = /*@__PURE__*/ P("$ZodNonOptional", (e, t) => {
	pr.init(e, t), N(e, "values", (e) => {
		let t = e.def.innerType._zod.values;
		return t ? new Set([...t].filter((e) => e !== void 0)) : void 0;
	}), e._zod.parse = (n, r) => {
		let i = t.innerType._zod.run(n, r);
		return i instanceof Promise ? i.then((t) => Ui(t, e)) : Ui(i, e);
	};
});
function Ui(e, t) {
	return !e.issues.length && e.value === void 0 && e.issues.push({
		code: "invalid_type",
		expected: "nonoptional",
		input: e.value,
		inst: t
	}), e;
}
function Wi(e, t, n, r) {
	return t.issues.length ? (e.value = n.catchValue({
		...t,
		value: e.value,
		error: { issues: t.issues.map((e) => dt(e, r, Lt())) },
		input: e.value
	}), e) : (e.value = t.value, t.memo && (e.memo = !0), e);
}
var Gi = /*@__PURE__*/ P("$ZodCatch", (e, t) => {
	pr.init(e, t), N(e, "optin", (e) => e.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional"), N(e, "optout", (e) => e.def.innerType._zod.optout), N(e, "values", (e) => e.def.innerType._zod.values), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		let r = t.innerType._zod.run({
			value: e.value,
			issues: []
		}, n);
		return r instanceof Promise ? r.then((r) => Wi(e, r, t, n)) : Wi(e, r, t, n);
	};
}), Ki = /*@__PURE__*/ P("$ZodPipe", (e, t) => {
	pr.init(e, t), N(e, "values", (e) => e.def.in._zod.values), N(e, "optin", (e) => e.def.in._zod.optin), N(e, "optout", (e) => e.def.out._zod.optout), N(e, "propValues", (e) => e.def.in._zod.propValues), e._zod.parse = (e, n) => {
		if (n.direction === "backward") {
			let r = t.out._zod.run(e, n);
			return r instanceof Promise ? r.then((e) => qi(e, t.in, n)) : qi(r, t.in, n);
		}
		let r = t.in._zod.run(e, n);
		return r instanceof Promise ? r.then((e) => qi(e, t.out, n)) : qi(r, t.out, n);
	};
});
function qi(e, t, n) {
	return e.issues.some((e) => e.code !== "unrecognized_keys") ? (e.aborted = !0, e) : t._zod.run({
		value: e.value,
		issues: e.issues
	}, n);
}
var Ji = /*@__PURE__*/ P("$ZodPreprocess", (e, t) => {
	Ki.init(e, t);
}), Yi = /*@__PURE__*/ P("$ZodReadonly", (e, t) => {
	pr.init(e, t), N(e, "propValues", (e) => e.def.innerType._zod.propValues), N(e, "values", (e) => e.def.innerType._zod.values), N(e, "optin", (e) => e.def.innerType?._zod?.optin), N(e, "optout", (e) => e.def.innerType?._zod?.optout), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then(Xi) : Xi(r);
	};
});
function Xi(e) {
	return e.memo || (e.value = Object.freeze(e.value)), e;
}
var Zi = /*@__PURE__*/ P("$ZodLazy", (e, t) => {
	pr.init(e, t), De(e._zod, "innerType", () => {
		let e = t;
		return e._cachedInner ||= t.getter(), e._cachedInner;
	}), N(e, "pattern", (e) => e.innerType?._zod?.pattern), N(e, "propValues", (e) => e.innerType?._zod?.propValues), N(e, "optin", (e) => e.innerType?._zod?.optin ?? void 0), N(e, "optout", (e) => e.innerType?._zod?.optout ?? void 0), e._zod.parse = (t, n) => e._zod.innerType._zod.run(t, n);
}), Qi = /*@__PURE__*/ P("$ZodCustom", (e, t) => {
	qn.init(e, t), pr.init(e, t), e._zod.parse = (e, t) => e, e._zod.check = (n) => {
		let r = n.value, i = t.fn(r);
		if (i instanceof Promise) return i.then((t) => $i(t, n, r, e));
		$i(i, n, r, e);
	};
});
function $i(e, t, n, r) {
	if (!e) {
		let e = {
			code: "custom",
			input: n,
			inst: r,
			path: [...r._zod.def.path ?? []],
			continue: !r._zod.def.abort
		};
		r._zod.def.params && (e.params = r._zod.def.params), t.issues.push(gt(e));
	}
}
// node_modules/zod/v4/core/memoizer.js
var ea = class extends Error {
	constructor() {
		super("Cannot parse a reference cycle that closes through a transform"), this.name = "ZodCyclicError";
	}
}, ta = "~memo", na = [];
function ra(e) {
	return typeof e == "object" && !!e;
}
function ia(e) {
	return e.map((e) => e.path ? {
		...e,
		path: e.path.slice()
	} : { ...e });
}
var aa = /*@__PURE__*/ new WeakMap(), oa = 0, sa = 1, ca = 2;
function la(e, t, n) {
	let r = aa.get(e);
	if (r !== void 0) return r ? ca : oa;
	if (t.has(e)) return ca;
	t.add(e);
	let i = oa, a = (e) => {
		if (i !== ca && e?._zod) {
			let r = la(e, t, n);
			r > i && (i = r);
		}
	}, o = (e, r) => {
		let i = oa;
		for (let a of Reflect.ownKeys(e)) {
			let o = Object.getOwnPropertyDescriptor(e, a);
			if (r && !o.enumerable) continue;
			let s = o.get ? sa : o.value?._zod ? la(o.value, t, n) : oa;
			s > i && (i = s);
		}
		return i;
	}, s = (e) => {
		e > i && (i = e);
	}, c = e._zod.def;
	switch (c.type) {
		case "object": {
			let e = ke(c);
			s(e ? o(e, !0) : sa), a(c.catchall);
			break;
		}
		case "array":
			a(c.element);
			break;
		case "tuple":
			for (let e of c.items) a(e);
			a(c.rest);
			break;
		case "record":
		case "map":
			a(c.keyType), a(c.valueType);
			break;
		case "set":
			a(c.valueType);
			break;
		case "union":
			for (let e of c.options) a(e);
			break;
		case "intersection":
			a(c.left), a(c.right);
			break;
		case "optional":
		case "nullable":
		case "default":
		case "prefault":
		case "catch":
		case "readonly":
		case "nonoptional":
		case "promise":
		case "success":
			a(c.innerType);
			break;
		case "pipe":
			a(c.in), a(c.out);
			break;
		case "function":
			a(c.input), a(c.output);
			break;
		case "lazy": {
			let r = c._cachedInner ?? (n ? e._zod.innerType : void 0);
			s(r ? la(r, t, !1) : sa);
			break;
		}
		case "template_literal":
		case "string":
		case "number":
		case "int":
		case "boolean":
		case "bigint":
		case "symbol":
		case "undefined":
		case "null":
		case "void":
		case "never":
		case "any":
		case "unknown":
		case "date":
		case "nan":
		case "enum":
		case "literal":
		case "file":
		case "transform":
		case "custom": break;
		default: for (let e in c) {
			let t = Object.getOwnPropertyDescriptor(c, e);
			if (!t || t.get) continue;
			let n = t.value;
			if (n && typeof n == "object") {
				if (n._zod) a(n);
				else if (Array.isArray(n)) for (let e of n) a(e);
			}
		}
	}
	return t.delete(e), ua(e, i);
}
function ua(e, t) {
	return t !== sa && aa.set(e, t === ca), t;
}
function da(e, t) {
	let n = e.buckets.get(t);
	return n || (n = /* @__PURE__ */ new WeakMap(), e.buckets.set(t, n)), n;
}
var fa, pa = [], ma = {
	alloc(e, t, n) {
		let r = fa;
		if (!r) return n;
		fa = void 0;
		let i = {
			value: n,
			issues: null
		};
		return r.set(t.value, i), pa.push(i), n;
	},
	guard(e) {
		var t;
		(t = e._zod).deferred ?? (t.deferred = []), e._zod.deferred.push(() => {
			let t = e._zod.parse, n = (e, n) => {
				if (n.direction !== "backward" && ga(n, e.value)) throw new ea();
				return t(e, n);
			};
			e._zod.parse = n, e._zod.run === t && (e._zod.run = n);
		});
	},
	attach(e) {
		var t;
		let n, r = !1, i, a;
		(t = e._zod).deferred ?? (t.deferred = []), e._zod.deferred.push(() => {
			let t = e._zod.parse, o = (s, c) => {
				if (n === void 0) {
					let i = la(e, /* @__PURE__ */ new Set(), !1);
					if (i === oa) return e._zod.parse = t, e._zod.run === o && (e._zod.run = t), t(s, c);
					i === ca || r ? n = !0 : r = !0;
				}
				let l = s.value;
				if (!ra(l)) return t(s, c);
				let u = c[ta];
				u || (u = {
					buckets: /* @__PURE__ */ new WeakMap(),
					backEdges: void 0
				}, c[ta] = u);
				let d;
				i === c ? d = a : (d = da(u, e), i = c, a = d);
				let f = d.get(l);
				if (f) return s.value = f.value, f.issues ? f.issues.length && s.issues.push(...ia(f.issues)) : (s.memo = !0, u.backEdges ?? (u.backEdges = /* @__PURE__ */ new WeakSet()), u.backEdges.add(f.value)), s;
				fa = d;
				let p = pa.length, m = t(s, c);
				fa = void 0;
				let h = pa.length > p ? pa.pop() : void 0;
				return m instanceof Promise ? m.then((e) => (h && (h.issues = e.issues.length ? ia(e.issues) : na), e)) : (h && (h.issues = m.issues.length ? ia(m.issues) : na), m);
			};
			e._zod.parse = o, e._zod.run === t && (e._zod.run = o);
		});
	}
};
function ha() {
	return ma;
}
function ga(e, t) {
	let n = e[ta]?.backEdges;
	return n !== void 0 && ra(t) && n.has(t);
}
// node_modules/zod/v4/locales/en.js
var _a = () => {
	let e = {
		string: {
			unit: "characters",
			verb: "to have"
		},
		file: {
			unit: "bytes",
			verb: "to have"
		},
		array: {
			unit: "items",
			verb: "to have"
		},
		set: {
			unit: "items",
			verb: "to have"
		},
		map: {
			unit: "entries",
			verb: "to have"
		}
	};
	function t(t) {
		return e[t] ?? null;
	}
	let n = {
		regex: "input",
		email: "email address",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO datetime",
		date: "ISO date",
		time: "ISO time",
		duration: "ISO duration",
		ipv4: "IPv4 address",
		ipv6: "IPv6 address",
		mac: "MAC address",
		cidrv4: "IPv4 range",
		cidrv6: "IPv6 range",
		base64: "base64-encoded string",
		base64url: "base64url-encoded string",
		json_string: "JSON string",
		e164: "E.164 number",
		currency_code: "currency code",
		credit_card: "credit card number",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "input"
	}, r = { nan: "NaN" };
	function i(e, t) {
		return e === "number" && typeof t == "number" && !Number.isFinite(t) ? String(t) : r[e] ?? e;
	}
	return (e) => {
		switch (e.code) {
			case "invalid_type": return `Invalid input: expected ${i(e.expected)}, received ${i(ht(e.input), e.input)}`;
			case "invalid_value": return e.values.length === 1 ? `Invalid input: expected ${Ke(e.values[0])}` : `Invalid option: expected one of ${ye(e.values, "|")}`;
			case "too_big": {
				let n = e.exact ? "exactly " : e.inclusive ? "<=" : "<", r = t(e.origin);
				return r ? `Too big: expected ${e.origin ?? "value"} to have ${n}${e.maximum.toString()} ${r.unit ?? "elements"}` : `Too big: expected ${e.origin ?? "value"} to be ${n}${e.maximum.toString()}`;
			}
			case "too_small": {
				let n = e.exact ? "exactly " : e.inclusive ? ">=" : ">", r = t(e.origin);
				return r ? `Too small: expected ${e.origin} to have ${n}${e.minimum.toString()} ${r.unit}` : `Too small: expected ${e.origin} to be ${n}${e.minimum.toString()}`;
			}
			case "invalid_format": {
				let t = e;
				return t.format === "starts_with" ? `Invalid string: must start with "${t.prefix}"` : t.format === "ends_with" ? `Invalid string: must end with "${t.suffix}"` : t.format === "includes" ? `Invalid string: must include "${t.includes}"` : t.format === "regex" ? `Invalid string: must match pattern ${t.pattern}` : `Invalid ${n[t.format] ?? e.format}`;
			}
			case "not_multiple_of": return `Invalid number: must be a multiple of ${e.divisor}`;
			case "unrecognized_keys": return `Unrecognized key${e.keys.length > 1 ? "s" : ""}: ${ye(e.keys, ", ")}`;
			case "invalid_key": return `Invalid key in ${e.origin}`;
			case "invalid_union": return e.options && Array.isArray(e.options) && e.options.length > 0 ? `Invalid discriminator value. Expected ${e.options.map((e) => `'${e}'`).join(" | ")}` : e.inclusive === !1 ? "Invalid input: more than one option matched" : "Invalid input";
			case "invalid_element": return `Invalid value in ${e.origin}`;
			default: return "Invalid input";
		}
	};
};
function va() {
	return { localeError: _a() };
}
// node_modules/zod/v4/core/registries.js
var ya, ba = class {
	constructor() {
		this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map();
	}
	add(e, ...t) {
		let n = t[0];
		return this._map.set(e, n), n && typeof n == "object" && "id" in n && this._idmap.set(n.id, e), this;
	}
	clear() {
		return this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map(), this;
	}
	remove(e) {
		let t = this._map.get(e);
		return t && typeof t == "object" && "id" in t && this._idmap.delete(t.id), this._map.delete(e), this;
	}
	get(e) {
		let t = e._zod.parent;
		if (t) {
			let n = { ...this.get(t) ?? {} };
			delete n.id;
			let r = {
				...n,
				...this._map.get(e)
			};
			return Object.keys(r).length ? r : void 0;
		}
		return this._map.get(e);
	}
	has(e) {
		return this._map.has(e);
	}
};
function xa() {
	return new ba();
}
(ya = globalThis).__zod_globalRegistry ?? (ya.__zod_globalRegistry = xa());
var Sa = globalThis.__zod_globalRegistry;
// node_modules/zod/v4/core/api.js
function Ca(e) {
	return e.checks &&= [...e.checks], e;
}
// @__NO_SIDE_EFFECTS__
function wa(e, t) {
	return new e(Ca({
		type: "string",
		...M(t)
	}));
}
// @__NO_SIDE_EFFECTS__
function Ta(e, t) {
	return new e({
		type: "string",
		format: "email",
		check: "string_format",
		abort: !1,
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ea(e, t) {
	return new e({
		type: "string",
		format: "guid",
		check: "string_format",
		abort: !1,
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Da(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Oa(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v4",
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ka(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v6",
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Aa(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v7",
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ja(e, t) {
	return new e({
		type: "string",
		format: "url",
		check: "string_format",
		abort: !1,
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ma(e, t) {
	return new e({
		type: "string",
		format: "emoji",
		check: "string_format",
		abort: !1,
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Na(e, t) {
	return new e({
		type: "string",
		format: "nanoid",
		check: "string_format",
		abort: !1,
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Pa(e, t) {
	return new e({
		type: "string",
		format: "cuid",
		check: "string_format",
		abort: !1,
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Fa(e, t) {
	return new e({
		type: "string",
		format: "cuid2",
		check: "string_format",
		abort: !1,
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ia(e, t) {
	return new e({
		type: "string",
		format: "ulid",
		check: "string_format",
		abort: !1,
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function La(e, t) {
	return new e({
		type: "string",
		format: "xid",
		check: "string_format",
		abort: !1,
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ra(e, t) {
	return new e({
		type: "string",
		format: "ksuid",
		check: "string_format",
		abort: !1,
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function za(e, t) {
	return new e({
		type: "string",
		format: "ipv4",
		check: "string_format",
		abort: !1,
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ba(e, t) {
	return new e({
		type: "string",
		format: "ipv6",
		check: "string_format",
		abort: !1,
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Va(e, t) {
	return new e({
		type: "string",
		format: "cidrv4",
		check: "string_format",
		abort: !1,
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ha(e, t) {
	return new e({
		type: "string",
		format: "cidrv6",
		check: "string_format",
		abort: !1,
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ua(e, t) {
	return new e({
		type: "string",
		format: "base64",
		check: "string_format",
		abort: !1,
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Wa(e, t) {
	return new e({
		type: "string",
		format: "base64url",
		check: "string_format",
		abort: !1,
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ga(e, t) {
	return new e({
		type: "string",
		format: "e164",
		check: "string_format",
		abort: !1,
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ka(e, t) {
	return new e({
		type: "string",
		format: "jwt",
		check: "string_format",
		abort: !1,
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function qa(e, t) {
	return new e({
		type: "string",
		format: "datetime",
		check: "string_format",
		offset: !1,
		local: !1,
		precision: null,
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ja(e, t) {
	return new e({
		type: "string",
		format: "date",
		check: "string_format",
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ya(e, t) {
	return new e({
		type: "string",
		format: "time",
		check: "string_format",
		precision: null,
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Xa(e, t) {
	return new e({
		type: "string",
		format: "duration",
		check: "string_format",
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Za(e, t) {
	return new e(Ca({
		type: "number",
		checks: [],
		...M(t)
	}));
}
// @__NO_SIDE_EFFECTS__
function Qa(e, t) {
	return new e(Ca({
		type: "number",
		coerce: !0,
		checks: [],
		...M(t)
	}));
}
// @__NO_SIDE_EFFECTS__
function $a(e, t) {
	return new e({
		type: "number",
		check: "number_format",
		abort: !1,
		format: "safeint",
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function eo(e, t) {
	return new e({
		type: "boolean",
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function to(e, t) {
	return new e({
		type: "null",
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function no(e) {
	return new e({ type: "any" });
}
// @__NO_SIDE_EFFECTS__
function ro(e) {
	return new e({ type: "unknown" });
}
// @__NO_SIDE_EFFECTS__
function io(e, t) {
	return new e({
		type: "never",
		...M(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ao(e, t) {
	return new Xn({
		check: "less_than",
		...M(t),
		value: e,
		inclusive: !1
	});
}
// @__NO_SIDE_EFFECTS__
function oo(e, t) {
	return new Xn({
		check: "less_than",
		...M(t),
		value: e,
		inclusive: !0
	});
}
// @__NO_SIDE_EFFECTS__
function so(e, t) {
	return new Zn({
		check: "greater_than",
		...M(t),
		value: e,
		inclusive: !1
	});
}
// @__NO_SIDE_EFFECTS__
function co(e, t) {
	return new Zn({
		check: "greater_than",
		...M(t),
		value: e,
		inclusive: !0
	});
}
// @__NO_SIDE_EFFECTS__
function lo(e, t) {
	return new Qn({
		check: "multiple_of",
		...M(t),
		value: e
	});
}
// @__NO_SIDE_EFFECTS__
function uo(e, t) {
	return new er({
		check: "max_length",
		...M(t),
		maximum: e
	});
}
// @__NO_SIDE_EFFECTS__
function fo(e, t) {
	return new tr({
		check: "min_length",
		...M(t),
		minimum: e
	});
}
// @__NO_SIDE_EFFECTS__
function po(e, t) {
	return new nr({
		check: "length_equals",
		...M(t),
		length: e
	});
}
// @__NO_SIDE_EFFECTS__
function mo(e, t) {
	return new ir({
		check: "string_format",
		format: "regex",
		...M(t),
		pattern: e
	});
}
// @__NO_SIDE_EFFECTS__
function ho(e) {
	return new ar({
		check: "string_format",
		format: "lowercase",
		...M(e)
	});
}
// @__NO_SIDE_EFFECTS__
function go(e) {
	return new or({
		check: "string_format",
		format: "uppercase",
		...M(e)
	});
}
// @__NO_SIDE_EFFECTS__
function _o(e, t) {
	return new sr({
		check: "string_format",
		format: "includes",
		...M(t),
		includes: e
	});
}
// @__NO_SIDE_EFFECTS__
function vo(e, t) {
	return new cr({
		check: "string_format",
		format: "starts_with",
		...M(t),
		prefix: e
	});
}
// @__NO_SIDE_EFFECTS__
function yo(e, t) {
	return new lr({
		check: "string_format",
		format: "ends_with",
		...M(t),
		suffix: e
	});
}
// @__NO_SIDE_EFFECTS__
function bo(e) {
	return new ur({
		check: "overwrite",
		tx: e
	});
}
// @__NO_SIDE_EFFECTS__
function xo(e) {
	return /* @__PURE__ */ bo((t) => t.normalize(e));
}
// @__NO_SIDE_EFFECTS__
function So() {
	return /* @__PURE__ */ bo((e) => e.trim());
}
// @__NO_SIDE_EFFECTS__
function Co() {
	return /* @__PURE__ */ bo((e) => e.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function wo() {
	return /* @__PURE__ */ bo((e) => e.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function To() {
	return /* @__PURE__ */ bo((e) => Le(e));
}
// @__NO_SIDE_EFFECTS__
function Eo(e, t, n) {
	return new e({
		type: "array",
		element: t,
		...M(n)
	});
}
// @__NO_SIDE_EFFECTS__
function Do(e, t, n) {
	return new e({
		type: "custom",
		check: "custom",
		fn: t,
		...M(n)
	});
}
// @__NO_SIDE_EFFECTS__
function Oo(e, t) {
	let n = /* @__PURE__ */ ko((t) => (t.addIssue = (e) => {
		if (typeof e == "string") t.issues.push(gt(e, t.value, n._zod.def));
		else {
			let r = e;
			r.fatal && (r.continue = !1), r.code ??= "custom", "input" in r || (r.input = t.value), r.inst ??= n, r.continue ??= !n._zod.def.abort, t.issues.push(gt(r));
		}
	}, e(t.value, t)), t);
	return n;
}
// @__NO_SIDE_EFFECTS__
function ko(e, t) {
	let n = new qn({
		check: "custom",
		...M(t)
	});
	return n._zod.check = e, n;
}
// node_modules/zod/v4/core/to-json-schema.js
function Ao(e, ...t) {
	for (let n of t) for (let t of Reflect.ownKeys(n)) Object.prototype.propertyIsEnumerable.call(n, t) && Oe(e, t, n[t]);
	return e;
}
function jo(e) {
	let t = e?.target ?? "draft-2020-12";
	return t === "draft-4" && (t = "draft-04"), t === "draft-7" && (t = "draft-07"), {
		processors: e.processors ?? {},
		metadataRegistry: e?.metadata ?? Sa,
		target: t,
		unrepresentable: e?.unrepresentable ?? "throw",
		override: e?.override ?? (() => {}),
		io: e?.io ?? "output",
		counter: 0,
		seen: /* @__PURE__ */ new Map(),
		sharedDefsExtractedFor: void 0,
		sharedEmitDoneFor: void 0,
		cycles: e?.cycles ?? "ref",
		reused: e?.reused ?? "inline",
		intersections: [],
		deferred: [],
		external: e?.external ?? void 0
	};
}
function Mo(e, t, n, r, i) {
	let a = typeof t.unrepresentable == "function" ? t.unrepresentable({
		zodSchema: e,
		path: r.path,
		message: i
	}) : t.unrepresentable;
	if (a === "any") return !1;
	if (a === void 0 || a === "throw") throw Error(i);
	return Object.assign(n, a), !0;
}
function No(e, t, n = {
	path: [],
	schemaPath: []
}) {
	var r;
	let i = e._zod.def, a = t.seen.get(e);
	if (a) return a.count++, n.schemaPath.includes(e) && (a.cycle = n.path), a.schema;
	let o = {
		schema: {},
		count: 1,
		cycle: void 0,
		path: n.path
	};
	t.seen.set(e, o), t.sharedDefsExtractedFor = void 0, t.sharedEmitDoneFor = void 0;
	let s = e._zod.toJSONSchema?.();
	if (s) o.schema = s;
	else {
		let r = {
			...n,
			schemaPath: [...n.schemaPath, e],
			path: n.path
		};
		if (e._zod.processJSONSchema) e._zod.processJSONSchema(t, o.schema, r);
		else {
			let n = o.schema, a = t.processors[i.type];
			if (!a) throw Error(`[toJSONSchema]: Non-representable type encountered: ${i.type}`);
			a(e, t, n, r);
		}
		let a = e._zod.parent;
		a && (o.ref ||= a, No(a, t, r), t.seen.get(a).isParent = !0);
	}
	let c = t.metadataRegistry.get(e);
	return c && Ao(o.schema, c), t.io === "input" && Uo(e) && (delete o.schema.examples, delete o.schema.default), t.io === "input" && "_prefault" in o.schema && ((r = o.schema).default ?? (r.default = o.schema._prefault)), delete o.schema._prefault, t.seen.get(e).schema;
}
function Po(e) {
	return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
function Fo(e, t) {
	let n = e.seen.get(t);
	if (!n) throw Error("Unprocessed schema. This is a bug in Zod.");
	if (e.external && e.sharedDefsExtractedFor === e.external) return;
	let r = /* @__PURE__ */ new Map();
	for (let t of e.seen.entries()) {
		let n = e.metadataRegistry.get(t[0])?.id;
		if (n) {
			let e = r.get(n);
			if (e && e !== t[0]) throw Error(`Duplicate schema id "${n}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
			r.set(n, t[0]);
		}
	}
	let i = (t) => {
		let r = e.target === "draft-2020-12" ? "$defs" : "definitions";
		if (e.external) {
			let n = e.external.registry.get(t[0])?.id, i = e.external.uri ?? ((e) => e);
			if (n) return { ref: i(n) };
			let a = t[1].defId ?? t[1].schema.id ?? `schema${e.counter++}`;
			return t[1].defId = a, {
				defId: a,
				ref: `${i("__shared")}#/${r}/${Po(a)}`
			};
		}
		let i = `#/${r}/`;
		if (t[1] === n && !t[1].schema.id) return { ref: "#" };
		let a = t[1].schema.id ?? `__schema${e.counter++}`;
		return {
			defId: a,
			ref: i + Po(a)
		};
	}, a = (e) => {
		if (e[1].schema.$ref) return;
		let t = e[1], { ref: n, defId: r } = i(e);
		t.def = { ...t.schema }, r && (t.defId = r);
		let a = t.schema;
		for (let e in a) delete a[e];
		a.$ref = n;
	};
	if (e.cycles === "throw") for (let t of e.seen.entries()) {
		let e = t[1];
		if (e.cycle) throw Error(`Cycle detected: #/${e.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
	}
	for (let n of e.seen.entries()) {
		let r = n[1];
		if (t === n[0]) a(n);
		else {
			if (e.external) {
				let r = e.external.registry.get(n[0])?.id;
				if (t !== n[0] && r) {
					a(n);
					continue;
				}
			}
			(e.metadataRegistry.get(n[0])?.id || r.cycle || r.count > 1 && e.reused === "ref") && a(n);
		}
	}
	e.external && (e.sharedDefsExtractedFor = e.external);
}
function Io(e) {
	let t = e.anyOf;
	if (!Array.isArray(t) || t.length === 0 || e.type !== void 0) return;
	let n = [];
	for (let e of t) {
		if (!e || typeof e != "object") return;
		Io(e);
		let t = Object.keys(e);
		if (t.length !== 1 || t[0] !== "type") return;
		let r = e.type;
		for (let e of Array.isArray(r) ? r : [r]) {
			if (typeof e != "string") return;
			n.includes(e) || n.push(e);
		}
	}
	delete e.anyOf, e.type = n.length === 1 ? n[0] : n;
}
var Lo = /* @__PURE__ */ new Set([
	"type",
	"properties",
	"required",
	"additionalProperties"
]), Ro = ["oneOf", "anyOf"];
function zo(e) {
	let t = e.additionalProperties;
	return t === void 0 || t === !1 || typeof t != "object" || !t ? null : Object.keys(t).length ? t : null;
}
function Bo(e) {
	let t = [];
	for (let n of e) {
		if (typeof n != "object" || n.type !== "object") return null;
		for (let e in n) if (!Lo.has(e)) return null;
		t.push(n);
	}
	let n = {}, r = /* @__PURE__ */ new Set();
	for (let e of t) {
		for (let r in e.properties) {
			if (Object.prototype.hasOwnProperty.call(n, r)) continue;
			let e = [];
			for (let n of t) {
				let t = n.properties?.[r] ?? zo(n);
				t != null && (e.some((e) => JSON.stringify(e) === JSON.stringify(t)) || e.push(t));
			}
			Oe(n, r, e.length === 1 ? e[0] : Bo(e) ?? { allOf: e });
		}
		for (let t of e.required ?? []) r.add(t);
	}
	let i = {
		type: "object",
		properties: n
	};
	if (r.size && (i.required = [...r]), t.every((e) => e.additionalProperties === !1)) i.additionalProperties = !1;
	else {
		let e = [];
		for (let n of t) {
			let t = zo(n);
			t && !e.some((e) => JSON.stringify(e) === JSON.stringify(t)) && e.push(t);
		}
		e.length === 1 ? i.additionalProperties = e[0] : e.length > 1 && (i.additionalProperties = { allOf: e });
	}
	return i;
}
function Vo(e) {
	let t = e.allOf;
	if (!Array.isArray(t) || t.length < 2) return;
	for (let t of Lo) if (t in e) return;
	let n = t.filter((e) => Ro.some((t) => Array.isArray(e[t]))), r = null;
	if (!n.length) r = Bo(t);
	else {
		let e = n[0], i = Ro.find((t) => Array.isArray(e[t]));
		if (Object.keys(e).length !== 1) return;
		let a = t.filter((t) => t !== e), o = e[i].map((e) => Bo([...a, e]));
		if (o.some((e) => !e)) return;
		r = { [i]: o };
	}
	r && (delete e.allOf, Ao(e, r));
}
function Ho(e, t) {
	let n = e.seen.get(t);
	if (!n) throw Error("Unprocessed schema. This is a bug in Zod.");
	let r = (t) => {
		let n = e.seen.get(t);
		if (n.ref === null) return;
		let i = n.def ?? n.schema, a = { ...i }, o = n.ref;
		if (n.ref = null, o) {
			r(o);
			let n = e.seen.get(o), s = n.schema;
			if (s.$ref && (e.target === "draft-07" || e.target === "draft-04" || e.target === "openapi-3.0") ? (i.allOf = i.allOf ?? [], i.allOf.push(s)) : Ao(i, s), Ao(i, a), t._zod.parent === o) for (let e in i) e !== "$ref" && e !== "allOf" && (e in a || delete i[e]);
			if (s.$ref && n.def) for (let e in i) e !== "$ref" && e !== "allOf" && e in n.def && JSON.stringify(i[e]) === JSON.stringify(n.def[e]) && delete i[e];
		}
		let s = t._zod.parent;
		if (s && s !== o) {
			r(s);
			let t = e.seen.get(s);
			if (t?.schema.$ref && (i.$ref = t.schema.$ref, t.def)) for (let e in i) e !== "$ref" && e !== "allOf" && e in t.def && JSON.stringify(i[e]) === JSON.stringify(t.def[e]) && delete i[e];
		}
		e.override({
			zodSchema: t,
			jsonSchema: i,
			path: n.path ?? []
		});
	};
	if (!e.external || e.sharedEmitDoneFor !== e.external) {
		for (let t of [...e.seen.entries()].reverse()) r(t[0]);
		if (e.target !== "openapi-3.0") for (let t of e.seen.entries()) Io(t[1].def ?? t[1].schema);
		for (let t of e.deferred) t();
		if (e.intersections.length) {
			let t = /* @__PURE__ */ new Map();
			for (let n of e.seen.values()) for (let e of [n.schema, n.def]) {
				let n = e?.allOf;
				if (!Array.isArray(n)) continue;
				let r = t.get(n);
				r ? r.push(e) : t.set(n, [e]);
			}
			for (let n of e.intersections) for (let e of t.get(n) ?? []) Vo(e);
		}
	}
	let i = {};
	if (e.target === "draft-2020-12" ? i.$schema = "https://json-schema.org/draft/2020-12/schema" : e.target === "draft-07" ? i.$schema = "http://json-schema.org/draft-07/schema#" : e.target === "draft-04" ? i.$schema = "http://json-schema.org/draft-04/schema#" : e.target, e.external?.uri) {
		let n = e.external.registry.get(t)?.id;
		if (!n) throw Error("Schema is missing an `id` property");
		i.$id = e.external.uri(n);
	}
	Ao(i, n.defId ? n.schema : n.def ?? n.schema);
	let a = e.metadataRegistry.get(t)?.id;
	a !== void 0 && i.id === a && delete i.id;
	let o = e.external?.defs ?? {};
	if (!e.external || e.sharedEmitDoneFor !== e.external) for (let t of e.seen.entries()) {
		let e = t[1];
		e.def && e.defId && (e.def.id === e.defId && delete e.def.id, Oe(o, e.defId, e.def));
	}
	e.external && (e.sharedEmitDoneFor = e.external), e.external || Object.keys(o).length > 0 && (e.target === "draft-2020-12" ? i.$defs = o : i.definitions = o);
	try {
		let n = JSON.parse(JSON.stringify(i));
		return Object.defineProperty(n, "~standard", {
			value: {
				...t["~standard"],
				jsonSchema: {
					input: Go(t, "input", e.processors),
					output: Go(t, "output", e.processors)
				}
			},
			enumerable: !1,
			writable: !1
		}), n;
	} catch {
		throw Error("Error converting schema to JSON.");
	}
}
function Uo(e, t) {
	let n = t ?? { seen: /* @__PURE__ */ new Set() };
	if (n.seen.has(e)) return !1;
	n.seen.add(e);
	let r = e._zod.def;
	if (r.type === "transform") return !0;
	if (r.type === "array") return Uo(r.element, n);
	if (r.type === "set") return Uo(r.valueType, n);
	if (r.type === "lazy") return Uo(r.getter(), n);
	if (r.type === "promise" || r.type === "optional" || r.type === "nonoptional" || r.type === "nullable" || r.type === "readonly" || r.type === "default" || r.type === "prefault" || r.type === "catch") return Uo(r.innerType, n);
	if (r.type === "intersection") return Uo(r.left, n) || Uo(r.right, n);
	if (r.type === "record" || r.type === "map") return Uo(r.keyType, n) || Uo(r.valueType, n);
	if (r.type === "pipe") return e._zod.traits.has("$ZodCodec") ? !0 : Uo(r.in, n) || Uo(r.out, n);
	if (r.type === "object") {
		for (let e in r.shape) if (Uo(r.shape[e], n)) return !0;
		return !1;
	}
	if (r.type === "union") {
		for (let e of r.options) if (Uo(e, n)) return !0;
		return !1;
	}
	if (r.type === "tuple") {
		for (let e of r.items) if (Uo(e, n)) return !0;
		return !!(r.rest && Uo(r.rest, n));
	}
	return !1;
}
var Wo = (e, t = {}) => (n) => {
	let r = jo({
		...n,
		processors: t
	});
	return No(e, r), Fo(r, e), Ho(r, e);
}, Go = (e, t, n = {}) => (r) => {
	let { libraryOptions: i, target: a } = r ?? {}, o = jo({
		...i ?? {},
		target: a,
		io: t,
		processors: n
	});
	return No(e, o), Fo(o, e), Ho(o, e);
}, Ko = (e, t, n) => {
	(e[t] === void 0 || n > e[t]) && (e[t] = n);
}, qo = (e, t, n) => {
	(e[t] === void 0 || n < e[t]) && (e[t] = n);
}, Jo = (e, t) => {
	Ko(e, "minimum", t), qo(e, "maximum", t);
}, Yo = (e, t) => {
	e.multipleOf ??= [], e.multipleOf.includes(t) || e.multipleOf.push(t);
}, Xo = (e, t) => {
	e.patterns ??= /* @__PURE__ */ new Set(), e.patterns.add(t);
}, Zo = (e, t) => {
	e.mime = e.mime ? e.mime.filter((e) => t.includes(e)) : [...t];
}, Qo = (e, t) => {
	e.format = t, t.includes("int") && (e.isInt = !0);
}, $o = (e, t) => Ko(e, "minimum", t.minimum), es = (e, t) => qo(e, "maximum", t.maximum), ts = (e) => (t, n) => {
	Qo(t, n.format);
	let [r, i] = e[n.format];
	Ko(t, "minimum", r), qo(t, "maximum", i);
}, ns = {
	greater_than: (e, t) => Ko(e, t.inclusive ? "minimum" : "exclusiveMinimum", t.value),
	less_than: (e, t) => qo(e, t.inclusive ? "maximum" : "exclusiveMaximum", t.value),
	multiple_of: (e, t) => Yo(e, t.value),
	number_format: ts(Je),
	bigint_format: ts(Ye),
	min_length: $o,
	max_length: es,
	length_equals: (e, t) => Jo(e, t.length),
	min_size: $o,
	max_size: es,
	size_equals: (e, t) => Jo(e, t.size),
	string_format: (e, t) => {
		Qo(e, t.format), t.pattern && Xo(e, t.pattern), (t.format === "base64" || t.format === "base64url") && (e.contentEncoding = t.format), (t.local || t.precision === -1) && (e.laxFormat = !0);
	},
	mime_type: (e, t) => Zo(e, t.mime)
};
function rs(e) {
	let t = {}, n = e._zod.def, r = e._zod.traits.has("$ZodCheck") ? [e, ...n.checks ?? []] : n.checks ?? [];
	for (let e of r) ns[e._zod.def.check]?.(t, e._zod.def);
	let i = e._zod.bag;
	i.minimum !== void 0 && Ko(t, "minimum", i.minimum), i.exclusiveMinimum !== void 0 && Ko(t, "exclusiveMinimum", i.exclusiveMinimum), i.maximum !== void 0 && qo(t, "maximum", i.maximum), i.exclusiveMaximum !== void 0 && qo(t, "exclusiveMaximum", i.exclusiveMaximum), i.multipleOf !== void 0 && Yo(t, i.multipleOf), i.format !== void 0 && (t.format ??= i.format, i.format.includes("int") && (t.isInt = !0)), i.mime && Zo(t, i.mime);
	for (let e of i.patterns ?? []) Xo(t, e);
	return t;
}
var is = {
	guid: "uuid",
	url: "uri",
	datetime: "date-time",
	json_string: "json-string",
	regex: ""
}, as = /* @__PURE__ */ new Map([[Yr, An], [Zr, jn]]), os = (e) => as.get(e) ?? e, ss = (e, t, n, r) => {
	let i = n;
	i.type = "string";
	let { minimum: a, maximum: o, format: s, patterns: c, contentEncoding: l, laxFormat: u } = rs(e);
	if (typeof a == "number" && (i.minLength = a), typeof o == "number" && (i.maxLength = o), s && (i.format = is[s] ?? s, i.format === "" && delete i.format, (s === "time" || u) && delete i.format), l && (i.contentEncoding = l), c && c.size > 0) {
		let e = [...c].map(os);
		e.length === 1 ? i.pattern = e[0].source : e.length > 1 && (i.allOf = [...e.map((e) => ({
			...t.target === "draft-07" || t.target === "draft-04" || t.target === "openapi-3.0" ? { type: "string" } : {},
			pattern: e.source
		}))]);
	}
}, cs = (e, t, n, r) => {
	let i = n, { minimum: a, maximum: o, multipleOf: s, exclusiveMaximum: c, exclusiveMinimum: l, isInt: u } = rs(e);
	i.type = u ? "integer" : "number";
	let d = typeof l == "number" && l >= (a ?? -Infinity), f = typeof c == "number" && c <= (o ?? Infinity), p = t.target === "draft-04" || t.target === "openapi-3.0";
	if (d ? p ? (i.minimum = l, i.exclusiveMinimum = !0) : i.exclusiveMinimum = l : typeof a == "number" && (i.minimum = a), f ? p ? (i.maximum = c, i.exclusiveMaximum = !0) : i.exclusiveMaximum = c : typeof o == "number" && (i.maximum = o), s) {
		let n = /* @__PURE__ */ new Set();
		for (let a of s) Number.isFinite(a) && a !== 0 ? n.add(Math.abs(a)) : Mo(e, t, i, r, `A multipleOf divisor of ${a} cannot be represented in JSON Schema`);
		let [a, ...o] = n;
		a !== void 0 && (i.multipleOf = a), o.length && (i.allOf = [...i.allOf ?? [], ...o.map((e) => ({ multipleOf: e }))]);
	}
}, ls = (e, t, n, r) => {
	n.type = "boolean";
}, us = (e, t, n, r) => {
	Mo(e, t, n, r, "BigInt cannot be represented in JSON Schema");
}, ds = (e, t, n, r) => {
	Mo(e, t, n, r, "Symbols cannot be represented in JSON Schema");
}, fs = (e, t, n, r) => {
	t.target === "openapi-3.0" ? (n.type = "string", n.nullable = !0, n.enum = [null]) : n.type = "null";
}, ps = (e, t, n, r) => {
	Mo(e, t, n, r, "Undefined cannot be represented in JSON Schema");
}, ms = (e, t, n, r) => {
	Mo(e, t, n, r, "Void cannot be represented in JSON Schema");
}, hs = (e, t, n, r) => {
	n.not = {};
}, gs = (e, t, n, r) => {}, _s = (e, t, n, r) => {}, vs = (e, t, n, r) => {
	Mo(e, t, n, r, "Date cannot be represented in JSON Schema");
}, ys = (e, t, n, r) => {
	let i = e._zod.def, a = ve(i.entries);
	a.length === 0 ? n.not = {} : (a.every((e) => typeof e == "number") && (n.type = "number"), a.every((e) => typeof e == "string") && (n.type = "string"), n.enum = a);
}, bs = (e, t, n, r) => {
	let i = e._zod.def;
	if (i.values.length === 0) {
		n.not = {};
		return;
	}
	let a = [];
	for (let o of i.values) if (o === void 0) {
		if (Mo(e, t, n, r, "Literal `undefined` cannot be represented in JSON Schema")) return;
	} else if (typeof o == "bigint") {
		if (Mo(e, t, n, r, "BigInt literals cannot be represented in JSON Schema")) return;
		a.push(Number(o));
	} else a.push(o);
	if (a.length !== 0) {
		if (a.length === 1) {
			let e = a[0];
			n.type = e === null ? "null" : typeof e, t.target === "draft-04" || t.target === "openapi-3.0" ? n.enum = [e] : n.const = e;
		} else a.every((e) => typeof e == "number") && (n.type = "number"), a.every((e) => typeof e == "string") && (n.type = "string"), a.every((e) => typeof e == "boolean") && (n.type = "boolean"), a.every((e) => e === null) && (n.type = "null"), n.enum = a;
	}
}, xs = (e, t, n, r) => {
	Mo(e, t, n, r, "NaN cannot be represented in JSON Schema");
}, Ss = (e, t, n, r) => {
	let i = n, a = e._zod.pattern;
	if (!a) throw Error("Pattern not found in template literal");
	i.type = "string", i.pattern = a.source;
}, Cs = (e, t, n, r) => {
	let i = n;
	i.type = "string", i.format = "binary", i.contentEncoding = "binary";
	let { minimum: a, maximum: o, mime: s } = rs(e);
	a !== void 0 && (i.minLength = a), o !== void 0 && (i.maxLength = o), s && (s.length === 0 ? i.not = {} : s.length === 1 ? i.contentMediaType = s[0] : i.anyOf = s.map((e) => ({ contentMediaType: e })));
}, ws = (e, t, n, r) => {
	n.type = "boolean";
}, Ts = (e, t, n, r) => {
	Mo(e, t, n, r, "Custom types cannot be represented in JSON Schema");
}, Es = (e, t, n, r) => {
	Mo(e, t, n, r, "Function types cannot be represented in JSON Schema");
}, Ds = (e, t, n, r) => {
	Mo(e, t, n, r, "Transforms cannot be represented in JSON Schema");
}, Os = (e, t, n, r) => {
	Mo(e, t, n, r, "Map cannot be represented in JSON Schema");
}, ks = (e, t, n, r) => {
	Mo(e, t, n, r, "Set cannot be represented in JSON Schema");
}, As = (e, t, n, r) => {
	let i = n, a = e._zod.def, { minimum: o, maximum: s } = rs(e);
	typeof o == "number" && (i.minItems = o), typeof s == "number" && (i.maxItems = s), i.type = "array", i.items = No(a.element, t, {
		...r,
		path: [...r.path, "items"]
	});
};
function js(e) {
	let t = e._zod.def;
	return t.type === "pipe" && t.in._zod.traits.has("$ZodTransform") ? js(t.out) : t.type === "catch" ? js(t.innerType) : e._zod.optin;
}
var Ms = (e, t, n, r) => {
	let i = n, a = e._zod.def, o = a.shape;
	if (Object.getOwnPropertySymbols(o).length && Mo(e, t, i, r, "Symbol keys cannot be represented in JSON Schema")) return;
	i.type = "object", i.properties = {};
	for (let e in o) Oe(i.properties, e, No(o[e], t, {
		...r,
		path: [
			...r.path,
			"properties",
			e
		]
	}));
	let s = [];
	for (let e of Object.keys(o)) {
		let n = a.shape[e];
		(t.io === "input" ? js(n) === void 0 : n._zod.optout === void 0) && s.push(e);
	}
	s.length > 0 && (i.required = s), a.catchall?._zod.def.type === "never" ? i.additionalProperties = !1 : a.catchall ? a.catchall && (i.additionalProperties = No(a.catchall, t, {
		...r,
		path: [...r.path, "additionalProperties"]
	})) : t.io === "output" && (i.additionalProperties = !1);
}, Ns = (e, t, n, r) => {
	let i = e._zod.def, a = i.inclusive === !1, o = i.options.map((e, n) => No(e, t, {
		...r,
		path: [
			...r.path,
			a ? "oneOf" : "anyOf",
			n
		]
	}));
	a ? n.oneOf = o : n.anyOf = o;
}, Ps = (e, t, n, r) => {
	let i = e._zod.def, a = No(i.left, t, {
		...r,
		path: [
			...r.path,
			"allOf",
			0
		]
	}), o = No(i.right, t, {
		...r,
		path: [
			...r.path,
			"allOf",
			1
		]
	}), s = (e) => "allOf" in e && Object.keys(e).length === 1, c = [...s(a) ? a.allOf : [a], ...s(o) ? o.allOf : [o]];
	n.allOf = c, t.intersections.push(c);
}, Fs = (e, t, n, r) => {
	let i = n, a = e._zod.def;
	i.type = "array";
	let o = t.target === "draft-2020-12" ? "prefixItems" : "items", s = t.target === "draft-2020-12" || t.target === "openapi-3.0" ? "items" : "additionalItems", c = a.items.map((e, n) => No(e, t, {
		...r,
		path: [
			...r.path,
			o,
			n
		]
	})), l = a.rest ? No(a.rest, t, {
		...r,
		path: [
			...r.path,
			s,
			...t.target === "openapi-3.0" ? [a.items.length] : []
		]
	}) : null, u = a.items.length;
	for (; u > 0;) {
		let e = a.items[u - 1];
		if (!(t.io === "input" ? js(e) !== void 0 : e._zod.optout === "optional")) break;
		u--;
	}
	let d = a.items.length, f = !a.rest;
	t.target === "draft-2020-12" ? (i.prefixItems = c, f ? i.items = !1 : l && (i.items = l), u > 0 && (i.minItems = u), f && (i.maxItems = d)) : t.target === "openapi-3.0" ? (i.items = { anyOf: c }, l && i.items.anyOf.push(l), u > 0 && (i.minItems = u), f && (i.maxItems = d)) : (i.items = c, f ? i.additionalItems = !1 : l && (i.additionalItems = l), u > 0 && (i.minItems = u), f && (i.maxItems = d));
	let { minimum: p, maximum: m } = rs(e);
	typeof p == "number" && (i.minItems = p), typeof m == "number" && (i.maxItems = m);
};
function Is(e, t, n) {
	if (t.$ref) {
		if (n.has(t)) return t;
		n.add(t);
		let r = e.get(t)?.def;
		if (!r) return t;
		let i = Is(e, r, n);
		return i === r ? t : i;
	}
	for (let r of ["anyOf", "oneOf"]) {
		let i = t[r];
		if (!Array.isArray(i)) continue;
		let a = i.map((t) => Is(e, t, n));
		a.some((e, t) => e !== i[t]) && (t = {
			...t,
			[r]: a
		});
	}
	let r = Array.isArray(t.type) ? t.type : [t.type], i = !r.includes("string") && r.some((e) => e === "number" || e === "integer"), a = t.enum ?? (t.const === void 0 ? void 0 : [t.const]);
	if (!i && !a?.some((e) => typeof e == "number")) return t;
	let { minimum: o, maximum: s, exclusiveMinimum: c, exclusiveMaximum: l, multipleOf: u, format: d, id: f, ...p } = t;
	return p.enum ? p.enum = p.enum.map((e) => typeof e == "number" ? String(e) : e) : typeof p.const == "number" && (p.const = String(p.const)), i && (p.type = "string", a || (p.pattern = (r.includes("number") ? Hn : Vn).source)), p;
}
var Ls = /* @__PURE__ */ new WeakMap();
function Rs(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.seen.values()) n.def && !t.has(n.schema) && t.set(n.schema, n);
	let n = /* @__PURE__ */ new Map();
	for (let r of Ls.get(e) ?? []) {
		let i = e.seen.get(r), a = (i?.def ?? i?.schema)?.propertyNames;
		if (!a || a === !0 || n.has(a)) continue;
		let o = Is(t, a, /* @__PURE__ */ new Set());
		o !== a && n.set(a, o);
	}
	if (n.size) for (let t of e.seen.values()) for (let e of [t.schema, t.def]) {
		let t = e && n.get(e.propertyNames);
		t && (e.propertyNames = t);
	}
}
var zs = (e, t, n, r) => {
	let i = n, a = e._zod.def;
	i.type = "object";
	let o = a.keyType, s = rs(o).patterns;
	if (a.mode === "loose" && s && s.size > 0) {
		let e = No(a.valueType, t, {
			...r,
			path: [
				...r.path,
				"patternProperties",
				"*"
			]
		});
		i.patternProperties = {};
		for (let t of s) Oe(i.patternProperties, os(t).source, e);
	} else {
		if (t.target === "draft-07" || t.target === "draft-2020-12") {
			i.propertyNames = No(a.keyType, t, {
				...r,
				path: [...r.path, "propertyNames"]
			});
			let n = Ls.get(t);
			n || (n = [], Ls.set(t, n), t.deferred.push(() => Rs(t))), n.push(e);
		}
		i.additionalProperties = No(a.valueType, t, {
			...r,
			path: [...r.path, "additionalProperties"]
		});
	}
	let c = o._zod.values, l = t.io === "input" && js(a.valueType) !== void 0;
	if (c && !a.partial && !l) {
		let e = [...c].filter((e) => typeof e == "string" || typeof e == "number");
		e.length > 0 && (i.required = e.map(String));
	}
}, Bs = (e, t, n, r) => {
	let i = e._zod.def, a = No(i.innerType, t, r), o = t.seen.get(e);
	t.target === "openapi-3.0" ? (o.ref = i.innerType, n.nullable = !0) : n.anyOf = [a, { type: "null" }];
}, Vs = (e, t, n, r) => {
	let i = e._zod.def;
	No(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
}, Hs = Symbol();
function Us(e, t, n, r, i) {
	let a = !1, o = JSON.stringify(e, (e, t) => typeof t == "bigint" ? (a = !0, null) : t);
	return a ? (Mo(t, n, r, i, "BigInt defaults cannot be represented in JSON Schema"), Hs) : JSON.parse(o);
}
var Ws = (e, t, n, r) => {
	let i = e._zod.def;
	No(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
	let o = Us(i.defaultValue, e, t, n, r);
	o !== Hs && (n.default = o);
}, Gs = (e, t, n, r) => {
	let i = e._zod.def;
	No(i.innerType, t, r);
	let a = t.seen.get(e);
	if (a.ref = i.innerType, t.io !== "input") return;
	let o = Us(i.defaultValue, e, t, n, r);
	o !== Hs && (n._prefault = o);
}, Ks = (e, t, n, r) => {
	let i = e._zod.def;
	No(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
	let o;
	try {
		o = i.catchValue(void 0);
	} catch {
		Mo(e, t, n, r, "Dynamic catch values are not supported in JSON Schema");
		return;
	}
	n.default = o;
}, qs = (e, t, n, r) => {
	let i = e._zod.def, a = i.in._zod.traits.has("$ZodTransform"), o = t.io === "input" ? a ? i.out : i.in : i.out;
	No(o, t, r);
	let s = t.seen.get(e);
	s.ref = o;
}, Js = (e, t, n, r) => {
	let i = e._zod.def;
	No(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType, n.readOnly = !0;
}, Ys = (e, t, n, r) => {
	let i = e._zod.def;
	No(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
}, Xs = (e, t, n, r) => {
	let i = e._zod.def;
	No(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
}, Zs = (e, t, n, r) => {
	let i = e._zod.innerType;
	No(i, t, r);
	let a = t.seen.get(e);
	a.ref = i;
}, Qs = {
	string: ss,
	number: cs,
	boolean: ls,
	bigint: us,
	symbol: ds,
	null: fs,
	undefined: ps,
	void: ms,
	never: hs,
	any: gs,
	unknown: _s,
	date: vs,
	enum: ys,
	literal: bs,
	nan: xs,
	template_literal: Ss,
	file: Cs,
	success: ws,
	custom: Ts,
	function: Es,
	transform: Ds,
	map: Os,
	set: ks,
	array: As,
	object: Ms,
	union: Ns,
	intersection: Ps,
	tuple: Fs,
	record: zs,
	nullable: Bs,
	nonoptional: Vs,
	default: Ws,
	prefault: Gs,
	catch: Ks,
	pipe: qs,
	readonly: Js,
	promise: Ys,
	optional: Xs,
	lazy: Zs
};
function $s(e, t) {
	if ("_idmap" in e) {
		let n = e, r = jo({
			...t,
			processors: Qs
		}), i = {};
		for (let e of n._idmap.entries()) {
			let [t, n] = e;
			No(n, r);
		}
		let a = {};
		r.external = {
			registry: n,
			uri: t?.uri,
			defs: i
		};
		for (let e of n._idmap.entries()) {
			let [t, n] = e;
			Fo(r, n), Oe(a, t, Ho(r, n));
		}
		return Object.keys(i).length > 0 && (a.__shared = { [r.target === "draft-2020-12" ? "$defs" : "definitions"]: i }), { schemas: a };
	}
	let n = jo({
		...t,
		processors: Qs
	});
	return No(e, n), Fo(n, e), Ho(n, e);
}
// node_modules/zod/v4/classic/errors.js
var ec = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
function tc(e, t, n) {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		get() {
			let e = n(this);
			return Object.defineProperty(this, t, {
				value: e,
				configurable: !0,
				writable: !0
			}), e;
		},
		set(e) {
			Object.defineProperty(this, t, {
				value: e,
				configurable: !0,
				writable: !0
			});
		}
	});
}
var nc = /*@__PURE__*/ P("ZodError", (e, t) => {
	Ut.init(e, t), e.name = "ZodError";
	let n = Object.getPrototypeOf(e);
	ec.has(n) || (ec.add(n), tc(n, "format", (e) => (t) => Kt(e, t)), tc(n, "flatten", (e) => (t) => Gt(e, t)), tc(n, "addIssue", (e) => (t) => {
		e.issues.push(t), e.message = JSON.stringify(e.issues, be, 2);
	}), tc(n, "addIssues", (e) => (t) => {
		e.issues.push(...t), e.message = JSON.stringify(e.issues, be, 2);
	}), Object.defineProperty(n, "isEmpty", {
		configurable: !0,
		enumerable: !1,
		get() {
			return this.issues.length === 0;
		}
	}));
}, void 0, { Parent: Error }), rc = /* @__PURE__ */ Jt(nc), ic = /* @__PURE__ */ Yt(nc), ac = /* @__PURE__ */ Xt(nc), oc = /* @__PURE__ */ Qt(nc), sc = /* @__PURE__ */ an(nc), cc = /* @__PURE__ */ on(nc), lc = /* @__PURE__ */ sn(nc), uc = /* @__PURE__ */ cn(nc), dc = /* @__PURE__ */ ln(nc), fc = /* @__PURE__ */ un(nc), pc = /* @__PURE__ */ dn(nc), mc = /* @__PURE__ */ fn(nc);
// node_modules/zod/v4/classic/schemas.js
function hc() {
	It.localeError || Lt(va());
}
function gc() {
	It.memoizer || Lt({ memoizer: ha() });
}
var _c = /*@__PURE__*/ P("ZodType", (e, t) => (hc(), pr.init(e, t), e.def = t, e.type = t.type, e), {
	check(...e) {
		let t = this.def;
		return this.clone(Fe(t, { checks: [...t.checks ?? [], ...e.map((e) => typeof e == "function" ? { _zod: {
			check: e,
			def: { check: "custom" },
			onattach: []
		} } : e)] }), { parent: !0 });
	},
	with(...e) {
		return this.check(...e);
	},
	clone(e, t) {
		return Ge(this, e, t);
	},
	brand() {
		return this;
	},
	register(e, t) {
		return e.add(this, t), this;
	},
	refine(e, t) {
		return this.check(zl(e, t));
	},
	superRefine(e, t) {
		return this.check(Bl(e, t));
	},
	overwrite(e) {
		return this.check(/* @__PURE__ */ bo(e));
	},
	optional() {
		return q(this);
	},
	exactOptional() {
		return bl(this);
	},
	nullable() {
		return Sl(this);
	},
	nullish() {
		return q(Sl(this));
	},
	nonoptional(e) {
		return Ol(this, e);
	},
	array() {
		return z(this);
	},
	or(e) {
		return U([this, e]);
	},
	and(e) {
		return ul(this, e);
	},
	transform(e) {
		return Ml(this, _l(e));
	},
	default(e) {
		return wl(this, e);
	},
	prefault(e) {
		return El(this, e);
	},
	catch(e) {
		return Al(this, e);
	},
	pipe(e) {
		return Ml(this, e);
	},
	readonly() {
		return Fl(this);
	},
	describe(e) {
		let t = this.clone();
		return Sa.add(t, { description: e }), t;
	},
	meta(...e) {
		if (e.length === 0) return Sa.get(this);
		let t = this.clone();
		return Sa.add(t, e[0]), t;
	},
	isOptional() {
		return this.safeParse(void 0).success;
	},
	isNullable() {
		return this.safeParse(null).success;
	},
	apply(e, ...t) {
		return t.length === 0 ? e(this) : e(this, ...t);
	},
	get "~standard"() {
		return yt(this, "~standard", {
			...gr(this),
			jsonSchema: {
				input: Go(this, "input"),
				output: Go(this, "output")
			}
		});
	},
	set "~standard"(e) {
		vt(this, "~standard", e);
	},
	parse: function e(t, n) {
		return rc(this, t, n, { callee: e });
	},
	parseAsync: async function e(t, n) {
		return await ic(this, t, n, { callee: e });
	},
	safeParse(e, t) {
		return ac(this, e, t);
	},
	async safeParseAsync(e, t) {
		return oc(this, e, t);
	},
	get spa() {
		return this?.safeParseAsync;
	},
	set spa(e) {
		vt(this, "spa", e);
	},
	validate(e, t) {
		return tn(this, e, t);
	},
	validateAsync(e, t) {
		return rn(this, e, t);
	},
	encode: function e(t, n) {
		return sc(this, t, n, { callee: e });
	},
	decode: function e(t, n) {
		return cc(this, t, n, { callee: e });
	},
	encodeAsync: async function e(t, n) {
		return await lc(this, t, n, { callee: e });
	},
	decodeAsync: async function e(t, n) {
		return await uc(this, t, n, { callee: e });
	},
	safeEncode(e, t) {
		return dc(this, e, t);
	},
	safeDecode(e, t) {
		return fc(this, e, t);
	},
	async safeEncodeAsync(e, t) {
		return pc(this, e, t);
	},
	async safeDecodeAsync(e, t) {
		return mc(this, e, t);
	},
	toJSONSchema(e) {
		return Wo(this, {})(e);
	},
	get description() {
		return Sa.get(this)?.description;
	},
	get _def() {
		return this._zod.def;
	}
}), vc = /*@__PURE__*/ P("_ZodString", (e, t) => {
	_r.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (t, n, r) => ss(e, t, n, r);
}, /*@__PURE__*/ bt({
	format: (e) => rs(e).format ?? null,
	minLength: (e) => rs(e).minimum ?? null,
	maxLength: (e) => rs(e).maximum ?? null
}, {
	regex(...e) {
		return this.check(/* @__PURE__ */ mo(...e));
	},
	includes(...e) {
		return this.check(/* @__PURE__ */ _o(...e));
	},
	startsWith(...e) {
		return this.check(/* @__PURE__ */ vo(...e));
	},
	endsWith(...e) {
		return this.check(/* @__PURE__ */ yo(...e));
	},
	min(...e) {
		return this.check(/* @__PURE__ */ fo(...e));
	},
	max(...e) {
		return this.check(/* @__PURE__ */ uo(...e));
	},
	length(...e) {
		return this.check(/* @__PURE__ */ po(...e));
	},
	nonempty(...e) {
		return this.check(/* @__PURE__ */ fo(1, ...e));
	},
	lowercase(e) {
		return this.check(/* @__PURE__ */ ho(e));
	},
	uppercase(e) {
		return this.check(/* @__PURE__ */ go(e));
	},
	trim() {
		return this.check(/* @__PURE__ */ So());
	},
	normalize(...e) {
		return this.check(/* @__PURE__ */ xo(...e));
	},
	toLowerCase() {
		return this.check(/* @__PURE__ */ Co());
	},
	toUpperCase() {
		return this.check(/* @__PURE__ */ wo());
	},
	slugify() {
		return this.check(/* @__PURE__ */ To());
	}
})), yc = /*@__PURE__*/ P("ZodString", (e, t) => {
	_r.init(e, t), vc.init(e, t);
}, {
	email(e) {
		return this.check(/* @__PURE__ */ Ta(Tc, e));
	},
	url(e) {
		return this.check(/* @__PURE__ */ ja(Ac, e));
	},
	jwt(e) {
		return this.check(/* @__PURE__ */ Ka(Kc, e));
	},
	emoji(e) {
		return this.check(/* @__PURE__ */ Ma(Mc, e));
	},
	guid(e) {
		return this.check(/* @__PURE__ */ Ea(Dc, e));
	},
	uuid(e) {
		return this.check(/* @__PURE__ */ Da(Oc, e));
	},
	uuidv4(e) {
		return this.check(/* @__PURE__ */ Oa(Oc, e));
	},
	uuidv6(e) {
		return this.check(/* @__PURE__ */ ka(Oc, e));
	},
	uuidv7(e) {
		return this.check(/* @__PURE__ */ Aa(Oc, e));
	},
	nanoid(e) {
		return this.check(/* @__PURE__ */ Na(Nc, e));
	},
	cuid(e) {
		return this.check(/* @__PURE__ */ Pa(Pc, e));
	},
	cuid2(e) {
		return this.check(/* @__PURE__ */ Fa(Fc, e));
	},
	ulid(e) {
		return this.check(/* @__PURE__ */ Ia(Ic, e));
	},
	base64(e) {
		return this.check(/* @__PURE__ */ Ua(Uc, e));
	},
	base64url(e) {
		return this.check(/* @__PURE__ */ Wa(Wc, e));
	},
	xid(e) {
		return this.check(/* @__PURE__ */ La(Lc, e));
	},
	ksuid(e) {
		return this.check(/* @__PURE__ */ Ra(Rc, e));
	},
	ipv4(e) {
		return this.check(/* @__PURE__ */ za(zc, e));
	},
	ipv6(e) {
		return this.check(/* @__PURE__ */ Ba(Bc, e));
	},
	cidrv4(e) {
		return this.check(/* @__PURE__ */ Va(Vc, e));
	},
	cidrv6(e) {
		return this.check(/* @__PURE__ */ Ha(Hc, e));
	},
	e164(e) {
		return this.check(/* @__PURE__ */ Ga(Gc, e));
	},
	datetime(e) {
		return this.check(/* @__PURE__ */ qa(xc, e));
	},
	date(e) {
		return this.check(/* @__PURE__ */ Ja(Sc, e));
	},
	time(e) {
		return this.check(/* @__PURE__ */ Ya(Cc, e));
	},
	duration(e) {
		return this.check(/* @__PURE__ */ Xa(wc, e));
	}
});
function F(e) {
	return /* @__PURE__ */ wa(yc, e);
}
var bc = /*@__PURE__*/ P("ZodStringFormat", (e, t) => {
	vr.init(e, t), vc.init(e, t);
}), xc = /*@__PURE__*/ P("ZodISODateTime", (e, t) => {
	Lr.init(e, t), bc.init(e, t);
}), Sc = /*@__PURE__*/ P("ZodISODate", (e, t) => {
	Rr.init(e, t), bc.init(e, t);
}), Cc = /*@__PURE__*/ P("ZodISOTime", (e, t) => {
	zr.init(e, t), bc.init(e, t);
}), wc = /*@__PURE__*/ P("ZodISODuration", (e, t) => {
	Br.init(e, t), bc.init(e, t);
}), Tc = /*@__PURE__*/ P("ZodEmail", (e, t) => {
	xr.init(e, t), bc.init(e, t);
});
function Ec(e) {
	return /* @__PURE__ */ Ta(Tc, e);
}
var Dc = /*@__PURE__*/ P("ZodGUID", (e, t) => {
	yr.init(e, t), bc.init(e, t);
}), Oc = /*@__PURE__*/ P("ZodUUID", (e, t) => {
	br.init(e, t), bc.init(e, t);
});
function kc(e) {
	return /* @__PURE__ */ Da(Oc, e);
}
var Ac = /*@__PURE__*/ P("ZodURL", (e, t) => {
	kr.init(e, t), bc.init(e, t);
});
function jc(e) {
	return /* @__PURE__ */ ja(Ac, e);
}
var Mc = /*@__PURE__*/ P("ZodEmoji", (e, t) => {
	Ar.init(e, t), bc.init(e, t);
}), Nc = /*@__PURE__*/ P("ZodNanoID", (e, t) => {
	jr.init(e, t), bc.init(e, t);
}), Pc = /*@__PURE__*/ P("ZodCUID", (e, t) => {
	Mr.init(e, t), bc.init(e, t);
}), Fc = /*@__PURE__*/ P("ZodCUID2", (e, t) => {
	Nr.init(e, t), bc.init(e, t);
}), Ic = /*@__PURE__*/ P("ZodULID", (e, t) => {
	Pr.init(e, t), bc.init(e, t);
}), Lc = /*@__PURE__*/ P("ZodXID", (e, t) => {
	Fr.init(e, t), bc.init(e, t);
}), Rc = /*@__PURE__*/ P("ZodKSUID", (e, t) => {
	Ir.init(e, t), bc.init(e, t);
}), zc = /*@__PURE__*/ P("ZodIPv4", (e, t) => {
	Vr.init(e, t), bc.init(e, t);
}), Bc = /*@__PURE__*/ P("ZodIPv6", (e, t) => {
	Wr.init(e, t), bc.init(e, t);
}), Vc = /*@__PURE__*/ P("ZodCIDRv4", (e, t) => {
	Gr.init(e, t), bc.init(e, t);
}), Hc = /*@__PURE__*/ P("ZodCIDRv6", (e, t) => {
	qr.init(e, t), bc.init(e, t);
}), Uc = /*@__PURE__*/ P("ZodBase64", (e, t) => {
	Xr.init(e, t), bc.init(e, t);
}), Wc = /*@__PURE__*/ P("ZodBase64URL", (e, t) => {
	$r.init(e, t), bc.init(e, t);
}), Gc = /*@__PURE__*/ P("ZodE164", (e, t) => {
	ei.init(e, t), bc.init(e, t);
}), Kc = /*@__PURE__*/ P("ZodJWT", (e, t) => {
	ni.init(e, t), bc.init(e, t);
}), qc = /*@__PURE__*/ P("ZodNumber", (e, t) => {
	ri.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (t, n, r) => cs(e, t, n, r), e.isFinite = !0;
}, /*@__PURE__*/ bt({
	minValue: (e) => {
		let { minimum: t, exclusiveMinimum: n } = rs(e);
		return Math.max(t ?? -Infinity, n ?? -Infinity);
	},
	maxValue: (e) => {
		let { maximum: t, exclusiveMaximum: n } = rs(e);
		return Math.min(t ?? Infinity, n ?? Infinity);
	},
	isInt: (e) => {
		let { isInt: t, multipleOf: n } = rs(e);
		return !!t || !!n?.some(Number.isSafeInteger);
	},
	format: (e) => rs(e).format ?? null
}, {
	gt(e, t) {
		return this.check(/* @__PURE__ */ so(e, t));
	},
	gte(e, t) {
		return this.check(/* @__PURE__ */ co(e, t));
	},
	min(e, t) {
		return this.check(/* @__PURE__ */ co(e, t));
	},
	lt(e, t) {
		return this.check(/* @__PURE__ */ ao(e, t));
	},
	lte(e, t) {
		return this.check(/* @__PURE__ */ oo(e, t));
	},
	max(e, t) {
		return this.check(/* @__PURE__ */ oo(e, t));
	},
	int(e) {
		return this.check(Yc(e));
	},
	safe(e) {
		return this.check(Yc(e));
	},
	positive(e) {
		return this.check(/* @__PURE__ */ so(0, e));
	},
	nonnegative(e) {
		return this.check(/* @__PURE__ */ co(0, e));
	},
	negative(e) {
		return this.check(/* @__PURE__ */ ao(0, e));
	},
	nonpositive(e) {
		return this.check(/* @__PURE__ */ oo(0, e));
	},
	multipleOf(e, t) {
		return this.check(/* @__PURE__ */ lo(e, t));
	},
	step(e, t) {
		return this.check(/* @__PURE__ */ lo(e, t));
	},
	finite() {
		return this;
	}
}));
function I(e) {
	return /* @__PURE__ */ Za(qc, e);
}
var Jc = /*@__PURE__*/ P("ZodNumberFormat", (e, t) => {
	ii.init(e, t), qc.init(e, t);
});
function Yc(e) {
	return /* @__PURE__ */ $a(Jc, e);
}
var Xc = /*@__PURE__*/ P("ZodBoolean", (e, t) => {
	ai.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (t, n, r) => ls(e, t, n, r);
});
function L(e) {
	return /* @__PURE__ */ eo(Xc, e);
}
var Zc = /*@__PURE__*/ P("ZodNull", (e, t) => {
	oi.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (t, n, r) => fs(e, t, n, r);
});
function Qc(e) {
	return /* @__PURE__ */ to(Zc, e);
}
var $c = /*@__PURE__*/ P("ZodAny", (e, t) => {
	si.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (e, t, n) => void 0;
});
function el() {
	return /* @__PURE__ */ no($c);
}
var tl = /*@__PURE__*/ P("ZodUnknown", (e, t) => {
	ci.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (e, t, n) => void 0;
});
function R() {
	return /* @__PURE__ */ ro(tl);
}
var nl = /*@__PURE__*/ P("ZodNever", (e, t) => {
	li.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (t, n, r) => hs(e, t, n, r);
});
function rl(e) {
	return /* @__PURE__ */ io(nl, e);
}
var il = /*@__PURE__*/ P("ZodArray", (e, t) => {
	gc(), pi.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (t, n, r) => As(e, t, n, r), e.element = t.element;
}, {
	min(e, t) {
		return this.check(/* @__PURE__ */ fo(e, t));
	},
	nonempty(e) {
		return this.check(/* @__PURE__ */ fo(1, e));
	},
	max(e, t) {
		return this.check(/* @__PURE__ */ uo(e, t));
	},
	length(e, t) {
		return this.check(/* @__PURE__ */ po(e, t));
	},
	unwrap() {
		return this.element;
	}
});
function z(e, t) {
	return /* @__PURE__ */ Eo(il, e, t);
}
var al = /*@__PURE__*/ P("ZodObject", (e, t) => {
	gc(), yi.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (t, n, r) => Ms(e, t, n, r), Et(e, "shape", (e) => e._zod.def.shape, !1);
}, {
	keyof() {
		return G(Object.keys(this._zod.def.shape));
	},
	catchall(e) {
		return this.clone(Fe(this._zod.def, { catchall: e }));
	},
	passthrough() {
		return this.clone(Fe(this._zod.def, { catchall: R() }));
	},
	loose() {
		return this.clone(Fe(this._zod.def, { catchall: R() }));
	},
	strict() {
		return this.clone(Fe(this._zod.def, { catchall: rl() }));
	},
	strip() {
		return this.clone(Fe(this._zod.def, { catchall: void 0 }));
	},
	extend(e) {
		return $e(this, e);
	},
	safeExtend(e) {
		return tt(this, e);
	},
	merge(e) {
		return nt(this, e);
	},
	pick(e) {
		return Xe(this, e);
	},
	omit(e) {
		return Qe(this, e);
	},
	partial(...e) {
		return rt(vl, this, e[0]);
	},
	exactPartial(...e) {
		return rt(yl, this, e[0], "exactPartial");
	},
	required(...e) {
		return it(Dl, this, e[0]);
	}
});
function B(e, t) {
	return new al({
		type: "object",
		shape: e ?? {},
		...M(t)
	});
}
function V(e, t) {
	return new al({
		type: "object",
		shape: e,
		catchall: rl(),
		...M(t)
	});
}
function H(e, t) {
	return new al({
		type: "object",
		shape: e,
		catchall: R(),
		...M(t)
	});
}
var ol = /*@__PURE__*/ P("ZodUnion", (e, t) => {
	xi.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (t, n, r) => Ns(e, t, n, r), e.options = t.options;
});
function U(e, t) {
	return new ol({
		type: "union",
		options: e,
		...M(t)
	});
}
var sl = /*@__PURE__*/ P("ZodDiscriminatedUnion", (e, t) => {
	ol.init(e, t), Ci.init(e, t);
});
function cl(e, t, n) {
	return new sl({
		type: "union",
		options: t,
		discriminator: e,
		...M(n)
	});
}
var ll = /*@__PURE__*/ P("ZodIntersection", (e, t) => {
	wi.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (t, n, r) => Ps(e, t, n, r);
});
function ul(e, t) {
	return new ll({
		type: "intersection",
		left: e,
		right: t
	});
}
var dl = /*@__PURE__*/ P("ZodTuple", (e, t) => {
	gc(), Di.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (t, n, r) => Fs(e, t, n, r);
}, {
	rest(e) {
		return this.clone({
			...this._zod.def,
			rest: e
		});
	},
	partial() {
		let e = this._zod.def;
		if (e.checks?.length) throw Error(".partial() cannot be used on tuple schemas containing refinements");
		return this.clone({
			...e,
			items: e.items.map((e) => new vl({
				type: "optional",
				innerType: e
			}))
		});
	}
});
function fl(e, t, n) {
	let r = t instanceof pr;
	return new dl({
		type: "tuple",
		items: e,
		rest: r ? t : null,
		...M(r ? n : t)
	});
}
var pl = /*@__PURE__*/ P("ZodRecord", (e, t) => {
	gc(), ji.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (t, n, r) => zs(e, t, n, r), e.keyType = t.keyType, e.valueType = t.valueType;
});
function W(e, t, n) {
	return !t || !t._zod ? new pl({
		type: "record",
		keyType: F(),
		valueType: e,
		...M(t)
	}) : new pl({
		type: "record",
		keyType: e,
		valueType: t,
		...M(n)
	});
}
var ml = /*@__PURE__*/ P("ZodEnum", (e, t) => {
	Mi.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (t, n, r) => ys(e, t, n, r), e.enum = t.entries, e.options = [...e._zod.values];
	let n = new Set(Object.keys(t.entries));
	e.extract = (e, r) => {
		let i = {};
		for (let r of e) if (n.has(r)) i[r] = t.entries[r];
		else throw Error(`Key ${r} not found in enum`);
		return new ml({
			...t,
			checks: [],
			...M(r),
			entries: i
		});
	}, e.exclude = (e, r) => {
		let i = { ...t.entries };
		for (let t of e) if (n.has(t)) delete i[t];
		else throw Error(`Key ${t} not found in enum`);
		return new ml({
			...t,
			checks: [],
			...M(r),
			entries: i
		});
	};
});
function G(e, t) {
	return new ml({
		type: "enum",
		entries: Array.isArray(e) ? Object.fromEntries(e.map((e) => [e, e])) : e,
		...M(t)
	});
}
var hl = /*@__PURE__*/ P("ZodLiteral", (e, t) => {
	Ni.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (t, n, r) => bs(e, t, n, r), e.values = new Set(t.values), Object.defineProperty(e, "value", { get() {
		if (t.values.length > 1) throw Error("This schema contains multiple valid literal values. Use `.values` instead.");
		return t.values[0];
	} });
});
function K(e, t) {
	return new hl({
		type: "literal",
		values: Array.isArray(e) ? e : [e],
		...M(t)
	});
}
var gl = /*@__PURE__*/ P("ZodTransform", (e, t) => {
	gc(), Pi.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (t, n, r) => Ds(e, t, n, r), e._zod.parse = (n, r) => {
		if (r.direction === "backward") throw new Ft(e.constructor.name);
		n.addIssue = (r) => {
			if (typeof r == "string") n.issues.push(gt(r, n.value, t));
			else {
				let t = r;
				t.fatal && (t.continue = !1), t.code ??= "custom", "input" in t || (t.input = n.value), t.inst ??= e, n.issues.push(gt(t));
			}
		};
		let i = t.transform(n.value, n);
		return i instanceof Promise ? i.then((e) => (n.value = e, n)) : (n.value = i, n);
	};
});
function _l(e) {
	return new gl({
		type: "transform",
		transform: e
	});
}
var vl = /*@__PURE__*/ P("ZodOptional", (e, t) => {
	Ii.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (t, n, r) => Xs(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function q(e) {
	return new vl({
		type: "optional",
		innerType: e
	});
}
var yl = /*@__PURE__*/ P("ZodExactOptional", (e, t) => {
	Li.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (t, n, r) => Xs(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function bl(e) {
	return new yl({
		type: "optional",
		innerType: e
	});
}
var xl = /*@__PURE__*/ P("ZodNullable", (e, t) => {
	Ri.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (t, n, r) => Bs(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Sl(e) {
	return new xl({
		type: "nullable",
		innerType: e
	});
}
var Cl = /*@__PURE__*/ P("ZodDefault", (e, t) => {
	zi.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (t, n, r) => Ws(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
});
function wl(e, t) {
	return new Cl({
		type: "default",
		innerType: e,
		get defaultValue() {
			return typeof t == "function" ? t() : He(t);
		}
	});
}
var Tl = /*@__PURE__*/ P("ZodPrefault", (e, t) => {
	Vi.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (t, n, r) => Gs(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function El(e, t) {
	return new Tl({
		type: "prefault",
		innerType: e,
		get defaultValue() {
			return typeof t == "function" ? t() : He(t);
		}
	});
}
var Dl = /*@__PURE__*/ P("ZodNonOptional", (e, t) => {
	Hi.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (t, n, r) => Vs(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Ol(e, t) {
	return new Dl({
		type: "nonoptional",
		innerType: e,
		...M(t)
	});
}
var kl = /*@__PURE__*/ P("ZodCatch", (e, t) => {
	Gi.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (t, n, r) => Ks(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
});
function Al(e, t) {
	return new kl({
		type: "catch",
		innerType: e,
		catchValue: typeof t == "function" ? t : Ot(t)
	});
}
var jl = /*@__PURE__*/ P("ZodPipe", (e, t) => {
	Ki.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (t, n, r) => qs(e, t, n, r), e.in = t.in, e.out = t.out;
});
function Ml(e, t) {
	return new jl({
		type: "pipe",
		in: e,
		out: t
	});
}
var Nl = /*@__PURE__*/ P("ZodPreprocess", (e, t) => {
	jl.init(e, t), Ji.init(e, t);
}), Pl = /*@__PURE__*/ P("ZodReadonly", (e, t) => {
	Yi.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (t, n, r) => Js(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Fl(e) {
	return new Pl({
		type: "readonly",
		innerType: e
	});
}
var Il = /*@__PURE__*/ P("ZodLazy", (e, t) => {
	Zi.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (t, n, r) => Zs(e, t, n, r), e.unwrap = () => e._zod.def.getter();
});
function Ll(e) {
	return new Il({
		type: "lazy",
		getter: e
	});
}
var Rl = /*@__PURE__*/ P("ZodCustom", (e, t) => {
	Qi.init(e, t), _c.init(e, t), e._zod.processJSONSchema = (t, n, r) => Ts(e, t, n, r);
});
function zl(e, t = {}) {
	return /* @__PURE__ */ Do(Rl, e, t);
}
function Bl(e, t) {
	return /* @__PURE__ */ Oo(e, t);
}
function Vl(e, t) {
	return new Nl({
		type: "pipe",
		in: _l(e),
		out: t
	});
}
// node_modules/zod/v4/classic/compat.js
var Hl = {
	invalid_type: "invalid_type",
	too_big: "too_big",
	too_small: "too_small",
	invalid_format: "invalid_format",
	not_multiple_of: "not_multiple_of",
	unrecognized_keys: "unrecognized_keys",
	invalid_union: "invalid_union",
	invalid_key: "invalid_key",
	invalid_element: "invalid_element",
	invalid_value: "invalid_value",
	custom: "custom"
}, Ul;
Ul ||= {};
// node_modules/zod/v4/classic/iso.js
function Wl(e) {
	return /* @__PURE__ */ qa(xc, e);
}
function Gl(e) {
	return /* @__PURE__ */ Ja(Sc, e);
}
// node_modules/zod/v4/classic/coerce.js
function Kl(e) {
	return /* @__PURE__ */ Qa(qc, e);
}
// scripts/schema-outline.mjs
var ql = "_", Jl = 3e38, Yl = (e) => Math.abs(e) >= Jl ? void 0 : e;
function Xl(e) {
	let t = Yl(e.minimum), n = Yl(e.maximum), r = t ?? (e.exclusiveMinimum === void 0 ? void 0 : `>${e.exclusiveMinimum}`), i = n ?? (e.exclusiveMaximum === void 0 ? void 0 : `<${e.exclusiveMaximum}`);
	return r === void 0 && i === void 0 ? "" : `[${r ?? ""}..${i ?? ""}]`;
}
function Zl(e) {
	return e.minItems === void 0 && e.maxItems === void 0 ? "" : `{${e.minItems ?? ""}..${e.maxItems ?? ""}}`;
}
function Ql(e, t) {
	return t.description ? `${e} // ${t.description}` : e;
}
function $l(e) {
	return e.replace("#/$defs/", "");
}
function eu(e) {
	if (e.const !== void 0) return JSON.stringify(e.const);
	if (e.enum) return e.enum.map((e) => JSON.stringify(e)).join("|");
}
function tu(e, t, n) {
	let r = e.map(eu);
	if (r.every(Boolean)) return Ql(r.join("|"), t);
	let i = e.map((e) => ru(e, n));
	return i.every((e) => typeof e == "string") ? Ql(i.join(" | "), t) : {
		oneOf: i,
		...t.description ? { [ql]: t.description } : {}
	};
}
function nu(e, t) {
	let n = new Set(e.required ?? []), r = {};
	e.description && (r[ql] = e.description);
	for (let [i, a] of Object.entries(e.properties ?? {})) r[n.has(i) ? i : `${i}?`] = ru(a, t);
	return e.additionalProperties && typeof e.additionalProperties == "object" && Object.keys(e.additionalProperties).length && (r["*"] = ru(e.additionalProperties, t)), r;
}
function ru(e, t) {
	if (e.$ref) return Ql($l(e.$ref), e);
	let n = eu(e);
	if (n) return Ql(n, e);
	let r = e.oneOf ?? e.anyOf;
	if (r) return tu(r, e, t);
	if (e.prefixItems) return Ql(`[${e.prefixItems.map((e) => ru(e, t)).join(", ")}]`, e);
	if (e.type === "array") {
		let n = e.items ? ru(e.items, t) : "any";
		return typeof n == "string" ? Ql(`${n}[]${Zl(e)}`, e) : {
			array: n,
			...Zl(e) ? { length: Zl(e) } : {},
			...e.description ? { [ql]: e.description } : {}
		};
	}
	return e.type === "object" || e.properties ? nu(e, t) : e.type === "number" || e.type === "integer" ? Ql(`${e.type === "integer" ? "int" : "number"}${Xl(e)}`, e) : Array.isArray(e.type) ? Ql(e.type.join("|"), e) : Ql(e.type ?? "any", e);
}
function iu(e) {
	let t = e.$defs ?? {}, n = ru(e, t), r = JSON.stringify(n), i = Object.fromEntries(Object.entries(t).filter(([e]) => new RegExp(String.raw`\b${e}\b`).test(r)).map(([e, n]) => [e, ru(n, t)]));
	return typeof n == "string" || !Object.keys(i).length ? n : {
		...n,
		$defs: i
	};
}
function au(e) {
	let t = (e) => {
		let n = e.oneOf ?? e.anyOf;
		return n ? n.flatMap(t) : [e];
	};
	if (!(e.oneOf ?? e.anyOf)) return;
	let n = /* @__PURE__ */ new Map();
	for (let r of t(e)) {
		let e = Object.values(r.properties ?? {}).map(eu).find(Boolean);
		e && n.set(JSON.parse(e.split("|")[0]), r);
	}
	return n.size ? n : void 0;
}
// scripts/tool-examples.mjs
var ou = Object.freeze({
	scene_create: Object.freeze({ recipe: {
		format: "67js.scene",
		schemaVersion: 1,
		geometries: [{
			id: "cube",
			type: "box",
			bevel: 0
		}],
		materials: [{
			id: "wood",
			color: [
				.55,
				.36,
				.2
			],
			roughness: .8
		}, {
			id: "stone",
			color: [
				.5,
				.5,
				.52
			]
		}],
		nodes: [{
			id: "floor",
			geometry: "cube",
			material: "stone",
			translation: [
				0,
				-.05,
				0
			],
			scale: [
				8,
				.1,
				8
			]
		}, {
			id: "crate",
			geometry: "cube",
			material: "wood",
			translation: [
				0,
				.5,
				0
			]
		}],
		camera: {
			eye: [
				3,
				2,
				4
			],
			target: [
				0,
				.5,
				0
			],
			fov: 45
		}
	} }),
	scene_apply: Object.freeze({
		expectedRevision: 0,
		operations: [
			{
				type: "set-node",
				id: "crate",
				translation: [
					1,
					.5,
					0
				]
			},
			{
				type: "set-material",
				id: "wood",
				color: [
					.7,
					.2,
					.1
				],
				roughness: .5
			},
			{
				type: "add-node",
				node: {
					id: "crate2",
					geometry: "cube",
					material: "wood",
					translation: [
						-1.2,
						.5,
						0
					],
					scale: [
						1,
						.6,
						1
					]
				}
			},
			{
				type: "set-camera",
				eye: [
					4,
					3,
					5
				],
				target: [
					0,
					.5,
					0
				]
			}
		]
	}),
	scene_create_asset: Object.freeze({ recipe: {
		format: "67js.asset",
		schemaVersion: 1,
		assetId: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
		camera: {
			eye: [
				2,
				1.5,
				3
			],
			target: [
				0,
				.8,
				0
			],
			fov: 40
		},
		root: { rotation: [
			0,
			.7071,
			0,
			.7071
		] }
	} }),
	scene_render_submit: Object.freeze({
		expectedRevision: 1,
		settings: {
			kind: "image",
			width: 1280,
			height: 720
		}
	}),
	notes: "sessionId stays out: the active scene is used. expectedRevision is the revision the last call returned. scene_create_asset takes assetId from scene_asset_catalog. Use topic examples.<tool> for one."
}), su = [
	"sceneLimits",
	"preview",
	"review",
	"assets",
	"jobs",
	"unsupported"
], cu = 110, lu = "flags";
function uu(e) {
	return typeof e == "boolean" || typeof e == "number";
}
function du(e = "") {
	let t = e.split(/\.\s/)[0].replace(/\.$/, "");
	return t.length > cu ? `${t.slice(0, 109)}…` : t;
}
function fu(e) {
	let t = /* @__PURE__ */ new Map(), n = {};
	for (let [r, i] of Object.entries(e)) uu(i) ? n[r] = i : t.set(r, i);
	return t.set("examples", ou), t.set(lu, n), t;
}
function pu(e) {
	return $s(e, {
		io: "input",
		unrepresentable: "any"
	});
}
function mu(e) {
	return {
		fields: Object.keys(e.properties ?? {}).filter((t) => e.properties[t].const === void 0),
		...e.description ? { note: du(e.description) } : {}
	};
}
function hu(e, t) {
	let n = {};
	for (let [e, r] of t) n[e] = mu(r);
	return {
		branches: n,
		use: `topic ${e}.<name> for the fields of one branch; modifier ops not listed here are in meshModifiers`
	};
}
function gu(e, t, n) {
	let r = pu(n), i = au(r), a = (e) => ({
		...e,
		...r.$defs ? { $defs: r.$defs } : {}
	});
	if (!t) return i ? hu(e, i) : iu(r);
	if (i?.has(t)) return iu(a(i.get(t)));
	let o = i ? [...i].filter(([e]) => e.startsWith(`${t}_`)) : [];
	if (o.length === 1) return iu(a(o[0][1]));
	if (o.length > 1) return hu(e, new Map(o));
	let s = r.properties?.[t];
	if (!i && s) return iu(a(s));
	let c = i ? [...i.keys()] : Object.keys(r.properties ?? {}), l = i && [...i.values()].some((e) => e.properties?.[t]) ? ` ${t} is a field of those branches, not a branch: open one branch to see it.` : "";
	throw Error(`Topic ${e} has no ${i ? "branch" : "field"} ${t}. ${i ? "Branches" : "Fields"}: ${c.join(", ") || "none"}.${l}`);
}
function _u(e, t) {
	if (t.includes(e)) return e;
	let n = e.toLowerCase().replace(/s$/, ""), r = n.length < 2 ? [] : t.filter((e) => {
		let t = e.toLowerCase();
		return t.includes(n) || t.length > 2 && n.includes(t);
	});
	return r.length === 1 ? r[0] : void 0;
}
function vu(e, t) {
	return {
		scene: [...fu(e.scene).keys()],
		runtime: su,
		schemas: [...t.keys()]
	};
}
function yu(e, t, n) {
	let r = vu(e, n);
	if (t === void 0) return {
		format: e.scene.format,
		schemaVersion: e.scene.schemaVersion,
		phase: e.phase,
		availableIn: e.availableIn,
		how: "Call scene_capabilities with topic set to a name below. Tools list common fields; schemas names the full field list of a recipe part (meshEdit and meshStack also take <name>.<op>, geometries takes geometries.<type>). examples.<tool> is one complete call.",
		topics: r
	};
	let i = [
		...r.scene,
		...r.runtime,
		...r.schemas
	], a = t.split(".");
	a[0] === "scene" && a.length > 1 && a.shift();
	let [o, s] = a, c = _u(o, i) ?? o, l = fu(e.scene).get(c), u = su.includes(c) ? e[c] : void 0, d = n.get(c);
	if (![
		l,
		u,
		d
	].some((e) => e !== void 0)) throw Error(`Unknown topic ${t}. Topics: ${i.join(", ")}.`);
	let f = [c, s].filter(Boolean).join(".");
	return d ? {
		topic: f,
		...l === void 0 ? {} : { notes: l },
		fields: gu(c, s, d)
	} : typeof l == "object" && l && s !== void 0 && Object.hasOwn(l, s) ? {
		topic: f,
		value: l[s]
	} : {
		topic: f,
		value: l ?? u
	};
}
// src/field-error.js
function bu(e) {
	let t;
	if (e === void 0) t = "undefined";
	else if (typeof e == "number" || typeof e == "bigint") t = String(e);
	else if (typeof e == "function" || typeof e == "symbol") t = typeof e;
	else try {
		t = JSON.stringify(e) ?? String(e);
	} catch {
		t = Object.prototype.toString.call(e);
	}
	return t.length > Su ? `${t.slice(0, 37)}...` : t;
}
function xu(e, t, n, r = RangeError) {
	let i = new r(`${e}: got ${bu(t)}; expected ${n}.`);
	return i.fieldPath = e, i;
}
var Su, Cu = A((() => {
	Su = 40;
}));
// src/agent-branches.js
function wu(e) {
	if (typeof e != "string" || !Eu.test(e)) throw xu("branch", e, "a name that starts with a lowercase letter and has at most 24 lowercase letters, digits, underscores or hyphens, such as \"alt-1\"", TypeError);
	return e;
}
var Tu, Eu, Du = A((() => {
	Cu(), Tu = Object.freeze({
		maximumBranches: 8,
		maximumNameLength: 24,
		maximumLabels: 24
	}), Eu = /^[a-z][a-z0-9_-]{0,23}$/;
}));
// node_modules/@modelcontextprotocol/server/dist/chunk-vYduTEsO.mjs
Du();
var Ou = Object.defineProperty, ku = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), Au = (e, t) => {
	let n = {};
	for (var r in e) Ou(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t && Ou(n, Symbol.toStringTag, { value: "Module" }), n;
}, ju = /* @__PURE__ */ new Set(["https://json-schema.org/draft/2019-09/schema", "http://json-schema.org/draft/2019-09/schema"]);
function Mu(e) {
	return typeof e == "string" && ju.has(e.replace(/#$/, ""));
}
var Nu = [
	"2025-11-25",
	"2025-06-18",
	"2025-03-26",
	"2024-11-05",
	"2024-10-07"
], Pu = "io.modelcontextprotocol/related-task", Fu = "io.modelcontextprotocol/protocolVersion", Iu = "io.modelcontextprotocol/clientInfo", Lu = "io.modelcontextprotocol/serverInfo", Ru = "io.modelcontextprotocol/clientCapabilities", zu = "io.modelcontextprotocol/subscriptionId", Bu = "io.modelcontextprotocol/logLevel", Vu = Ll(() => U([
	F(),
	I(),
	L(),
	Qc(),
	W(F(), Vu),
	z(Vu)
])), Hu = W(F(), Vu), Uu = z(Vu), Wu = U([F(), I().int()]), Gu = F(), Ku = B({ ttl: I().optional() }), qu = B({ taskId: F() }), Ju = H({
	progressToken: Wu.optional(),
	[Pu]: qu.optional()
}), Yu = B({ _meta: Ju.optional() }), Xu = Yu.extend({ task: Ku.optional() }), Zu = B({
	method: F(),
	params: Yu.loose().optional()
}), Qu = B({ _meta: Ju.optional() }), $u = B({
	method: F(),
	params: Qu.loose().optional()
}), ed = H({ get [Lu]() {
	return hd.optional().catch(void 0);
} }), td = H({ _meta: ed.optional() }), nd = U([F(), I().int()]), rd = B({
	jsonrpc: K("2.0"),
	id: nd,
	...Zu.shape
}).strict(), id = B({
	jsonrpc: K("2.0"),
	...$u.shape
}).strict(), ad = B({
	jsonrpc: K("2.0"),
	id: nd,
	result: td
}).strict(), od = B({
	jsonrpc: K("2.0"),
	id: nd.optional(),
	error: B({
		code: I().int(),
		message: F(),
		data: R().optional()
	})
}).strict(), sd = U([
	rd,
	id,
	ad,
	od
]), cd = U([ad, od]), ld = td.strict(), ud = Qu.extend({
	requestId: nd.optional(),
	reason: F().optional()
}), dd = $u.extend({
	method: K("notifications/cancelled"),
	params: ud
}), fd = B({
	src: F(),
	mimeType: F().optional(),
	sizes: z(F()).optional(),
	theme: G(["light", "dark"]).optional()
}), pd = B({ icons: z(fd).optional() }), md = B({
	name: F(),
	title: F().optional()
}), hd = md.extend({
	...md.shape,
	...pd.shape,
	version: F(),
	websiteUrl: F().optional(),
	description: F().optional()
}), gd = Vl((e) => e && typeof e == "object" && !Array.isArray(e) && Object.keys(e).length === 0 ? { form: {} } : e, ul(B({
	form: ul(B({ applyDefaults: L().optional() }), Hu).optional(),
	url: Hu.optional()
}), Hu.optional())), _d = H({
	list: Hu.optional(),
	cancel: Hu.optional(),
	requests: H({
		sampling: H({ createMessage: Hu.optional() }).optional(),
		elicitation: H({ create: Hu.optional() }).optional()
	}).optional()
}), vd = H({
	list: Hu.optional(),
	cancel: Hu.optional(),
	requests: H({ tools: H({ call: Hu.optional() }).optional() }).optional()
}), yd = B({
	experimental: W(F(), Hu).optional(),
	sampling: B({
		context: Hu.optional(),
		tools: Hu.optional()
	}).optional(),
	elicitation: gd.optional(),
	roots: B({ listChanged: L().optional() }).optional(),
	tasks: _d.optional(),
	extensions: W(F(), Hu).optional()
}), bd = Yu.extend({
	protocolVersion: F(),
	capabilities: yd,
	clientInfo: hd
}), xd = Zu.extend({
	method: K("initialize"),
	params: bd
}), Sd = B({
	experimental: W(F(), Hu).optional(),
	logging: Hu.optional(),
	completions: Hu.optional(),
	prompts: B({ listChanged: L().optional() }).optional(),
	resources: B({
		subscribe: L().optional(),
		listChanged: L().optional()
	}).optional(),
	tools: B({ listChanged: L().optional() }).optional(),
	tasks: vd.optional(),
	extensions: W(F(), Hu).optional()
}), Cd = td.extend({
	protocolVersion: F(),
	capabilities: Sd,
	serverInfo: hd,
	instructions: F().optional()
}), wd = $u.extend({
	method: K("notifications/initialized"),
	params: Qu.optional()
}), Td = Zu.extend({
	method: K("server/discover"),
	params: Yu.optional()
}), Ed = td.extend({
	supportedVersions: z(F()),
	capabilities: Sd,
	instructions: F().optional()
}), Dd = Zu.extend({
	method: K("ping"),
	params: Yu.optional()
}), Od = B({
	progress: I(),
	total: q(I()),
	message: q(F())
}), kd = B({
	...Qu.shape,
	...Od.shape,
	progressToken: Wu
}), Ad = $u.extend({
	method: K("notifications/progress"),
	params: kd
}), jd = Yu.extend({ cursor: Gu.optional() }), Md = Zu.extend({ params: jd.optional() }), Nd = td.extend({ nextCursor: Gu.optional() }), Pd = B({
	uri: F(),
	mimeType: q(F()),
	_meta: W(F(), R()).optional()
}), Fd = Pd.extend({ text: F() }), Id = F().refine((e) => {
	try {
		return atob(e), !0;
	} catch {
		return !1;
	}
}, { message: "Invalid Base64 string" }), Ld = Pd.extend({ blob: Id }), Rd = G(["user", "assistant"]), zd = B({
	audience: z(Rd).optional(),
	priority: I().min(0).max(1).optional(),
	lastModified: Wl({ offset: !0 }).optional()
}), Bd = B({
	...md.shape,
	...pd.shape,
	uri: F(),
	description: q(F()),
	mimeType: q(F()),
	size: q(I()),
	annotations: zd.optional(),
	_meta: q(H({}))
}), Vd = B({
	...md.shape,
	...pd.shape,
	uriTemplate: F(),
	description: q(F()),
	mimeType: q(F()),
	annotations: zd.optional(),
	_meta: q(H({}))
}), Hd = Md.extend({ method: K("resources/list") }), Ud = Nd.extend({ resources: z(Bd) }), Wd = Md.extend({ method: K("resources/templates/list") }), Gd = Nd.extend({ resourceTemplates: z(Vd) }), Kd = Yu.extend({ uri: F() }), qd = Kd, Jd = Zu.extend({
	method: K("resources/read"),
	params: qd
}), Yd = td.extend({ contents: z(U([Fd, Ld])) }), Xd = $u.extend({
	method: K("notifications/resources/list_changed"),
	params: Qu.optional()
}), Zd = Kd, Qd = Zu.extend({
	method: K("resources/subscribe"),
	params: Zd
}), $d = Kd, ef = Zu.extend({
	method: K("resources/unsubscribe"),
	params: $d
}), tf = B({
	toolsListChanged: L().optional(),
	promptsListChanged: L().optional(),
	resourcesListChanged: L().optional(),
	resourceSubscriptions: z(F()).optional()
}), nf = Yu.extend({ notifications: tf }), rf = Zu.extend({
	method: K("subscriptions/listen"),
	params: nf
}), af = Qu.extend({ notifications: tf }), of = $u.extend({
	method: K("notifications/subscriptions/acknowledged"),
	params: af
}), sf = ed.extend({ [zu]: nd }), cf = td.extend({ _meta: sf }), lf = Qu.extend({ uri: F() }), uf = $u.extend({
	method: K("notifications/resources/updated"),
	params: lf
}), df = B({
	name: F(),
	description: q(F()),
	required: q(L())
}), ff = B({
	...md.shape,
	...pd.shape,
	description: q(F()),
	arguments: q(z(df)),
	_meta: q(H({}))
}), pf = Md.extend({ method: K("prompts/list") }), mf = Nd.extend({ prompts: z(ff) }), hf = Yu.extend({
	name: F(),
	arguments: W(F(), F()).optional()
}), gf = Zu.extend({
	method: K("prompts/get"),
	params: hf
}), _f = B({
	type: K("text"),
	text: F(),
	annotations: zd.optional(),
	_meta: W(F(), R()).optional()
}), vf = B({
	type: K("image"),
	data: Id,
	mimeType: F(),
	annotations: zd.optional(),
	_meta: W(F(), R()).optional()
}), yf = B({
	type: K("audio"),
	data: Id,
	mimeType: F(),
	annotations: zd.optional(),
	_meta: W(F(), R()).optional()
}), bf = B({
	type: K("tool_use"),
	name: F(),
	id: F(),
	input: W(F(), R()),
	_meta: W(F(), R()).optional()
}), xf = B({
	type: K("resource"),
	resource: U([Fd, Ld]),
	annotations: zd.optional(),
	_meta: W(F(), R()).optional()
}), Sf = Bd.extend({ type: K("resource_link") }), Cf = U([
	_f,
	vf,
	yf,
	Sf,
	xf
]), wf = B({
	role: Rd,
	content: Cf
}), Tf = td.extend({
	description: F().optional(),
	messages: z(wf)
}), Ef = $u.extend({
	method: K("notifications/prompts/list_changed"),
	params: Qu.optional()
}), Df = B({
	title: F().optional(),
	readOnlyHint: L().optional(),
	destructiveHint: L().optional(),
	idempotentHint: L().optional(),
	openWorldHint: L().optional()
}), Of = B({ taskSupport: G([
	"required",
	"optional",
	"forbidden"
]).optional() }), kf = B({
	...md.shape,
	...pd.shape,
	description: F().optional(),
	inputSchema: B({
		type: K("object"),
		properties: W(F(), Vu).optional(),
		required: z(F()).optional()
	}).catchall(R()),
	outputSchema: H({ $schema: F().optional() }).optional(),
	annotations: Df.optional(),
	execution: Of.optional(),
	_meta: W(F(), R()).optional()
}), Af = Md.extend({ method: K("tools/list") }), jf = Nd.extend({ tools: z(kf) }), Mf = td.extend({
	content: z(Cf).default([]),
	structuredContent: R().optional(),
	isError: L().optional()
}), Nf = Mf.or(td.extend({ toolResult: R() })), Pf = Xu.extend({
	name: F(),
	arguments: W(F(), R()).optional()
}), Ff = Zu.extend({
	method: K("tools/call"),
	params: Pf
}), If = $u.extend({
	method: K("notifications/tools/list_changed"),
	params: Qu.optional()
}), Lf = B({
	autoRefresh: L().default(!0),
	debounceMs: I().int().nonnegative().default(300)
}), Rf = G([
	"debug",
	"info",
	"notice",
	"warning",
	"error",
	"critical",
	"alert",
	"emergency"
]), zf = Yu.extend({ level: Rf }), Bf = Zu.extend({
	method: K("logging/setLevel"),
	params: zf
}), Vf = Qu.extend({
	level: Rf,
	logger: F().optional(),
	data: R()
}), Hf = $u.extend({
	method: K("notifications/message"),
	params: Vf
}), Uf = B({ name: F().optional() }), Wf = B({
	hints: z(Uf).optional(),
	costPriority: I().min(0).max(1).optional(),
	speedPriority: I().min(0).max(1).optional(),
	intelligencePriority: I().min(0).max(1).optional()
}), Gf = B({ mode: G([
	"auto",
	"required",
	"none"
]).optional() }), Kf = B({
	type: K("tool_result"),
	toolUseId: F().describe("The unique identifier for the corresponding tool call."),
	content: z(Cf),
	structuredContent: R().optional(),
	isError: L().optional(),
	_meta: W(F(), R()).optional()
}), qf = cl("type", [
	_f,
	vf,
	yf
]), Jf = cl("type", [
	_f,
	vf,
	yf,
	bf,
	Kf
]), Yf = B({
	role: Rd,
	content: U([Jf, z(Jf)]),
	_meta: W(F(), R()).optional()
}), Xf = Xu.extend({
	messages: z(Yf),
	modelPreferences: Wf.optional(),
	systemPrompt: F().optional(),
	includeContext: G([
		"none",
		"thisServer",
		"allServers"
	]).optional(),
	temperature: I().optional(),
	maxTokens: I().int(),
	stopSequences: z(F()).optional(),
	metadata: Hu.optional(),
	tools: z(kf).optional(),
	toolChoice: Gf.optional()
}), Zf = Zu.extend({
	method: K("sampling/createMessage"),
	params: Xf
}), Qf = td.extend({
	model: F(),
	stopReason: q(G([
		"endTurn",
		"stopSequence",
		"maxTokens"
	]).or(F())),
	role: Rd,
	content: qf
}), $f = td.extend({
	model: F(),
	stopReason: q(G([
		"endTurn",
		"stopSequence",
		"maxTokens",
		"toolUse"
	]).or(F())),
	role: Rd,
	content: U([Jf, z(Jf)])
}), ep = B({
	type: K("boolean"),
	title: F().optional(),
	description: F().optional(),
	default: L().optional()
}), tp = B({
	type: K("string"),
	title: F().optional(),
	description: F().optional(),
	minLength: I().optional(),
	maxLength: I().optional(),
	format: G([
		"email",
		"uri",
		"date",
		"date-time"
	]).optional(),
	default: F().optional()
}), np = B({
	type: G(["number", "integer"]),
	title: F().optional(),
	description: F().optional(),
	minimum: I().optional(),
	maximum: I().optional(),
	default: I().optional()
}), rp = B({
	type: K("string"),
	title: F().optional(),
	description: F().optional(),
	enum: z(F()),
	default: F().optional()
}), ip = B({
	type: K("string"),
	title: F().optional(),
	description: F().optional(),
	oneOf: z(B({
		const: F(),
		title: F()
	})),
	default: F().optional()
}), ap = B({
	type: K("string"),
	title: F().optional(),
	description: F().optional(),
	enum: z(F()),
	enumNames: z(F()).optional(),
	default: F().optional()
}), op = U([rp, ip]), sp = B({
	type: K("array"),
	title: F().optional(),
	description: F().optional(),
	minItems: I().optional(),
	maxItems: I().optional(),
	items: B({
		type: K("string"),
		enum: z(F())
	}),
	default: z(F()).optional()
}), cp = B({
	type: K("array"),
	title: F().optional(),
	description: F().optional(),
	minItems: I().optional(),
	maxItems: I().optional(),
	items: B({ anyOf: z(B({
		const: F(),
		title: F()
	})) }),
	default: z(F()).optional()
}), lp = U([sp, cp]), up = U([
	ap,
	op,
	lp
]), dp = U([
	up,
	ep,
	tp,
	np
]), fp = Xu.extend({
	mode: K("form").optional(),
	message: F(),
	requestedSchema: B({
		type: K("object"),
		properties: W(F(), dp),
		required: z(F()).optional()
	}).catchall(R())
}), pp = Xu.extend({
	mode: K("url"),
	message: F(),
	elicitationId: F(),
	url: F().url()
}), mp = U([fp, pp]), hp = Zu.extend({
	method: K("elicitation/create"),
	params: mp
}), gp = Qu.extend({ elicitationId: F() }), _p = $u.extend({
	method: K("notifications/elicitation/complete"),
	params: gp
}), vp = td.extend({
	action: G([
		"accept",
		"decline",
		"cancel"
	]),
	content: Vl((e) => e === null ? void 0 : e, W(F(), U([
		F(),
		I(),
		L(),
		z(F())
	])).optional())
}), yp = B({
	type: K("ref/resource"),
	uri: F()
}), bp = B({
	type: K("ref/prompt"),
	name: F()
}), xp = Yu.extend({
	ref: U([bp, yp]),
	argument: B({
		name: F(),
		value: F()
	}),
	context: B({ arguments: W(F(), F()).optional() }).optional()
}), Sp = Zu.extend({
	method: K("completion/complete"),
	params: xp
}), Cp = td.extend({ completion: H({
	values: z(F()).max(100),
	total: q(I().int()),
	hasMore: q(L())
}) }), wp = B({
	uri: F().startsWith("file://"),
	name: F().optional(),
	_meta: W(F(), R()).optional()
}), Tp = Zu.extend({
	method: K("roots/list"),
	params: Yu.optional()
}), Ep = td.extend({ roots: z(wp) }), Dp = $u.extend({
	method: K("notifications/roots/list_changed"),
	params: Qu.optional()
}), Op = H({
	ttl: I().optional(),
	pollInterval: I().optional()
}), kp = G([
	"working",
	"input_required",
	"completed",
	"failed",
	"cancelled"
]), Ap = B({
	taskId: F(),
	status: kp,
	ttl: U([I(), Qc()]),
	createdAt: F(),
	lastUpdatedAt: F(),
	pollInterval: q(I()),
	statusMessage: q(F())
}), jp = td.extend({ task: Ap }), Mp = Qu.merge(Ap), Np = $u.extend({
	method: K("notifications/tasks/status"),
	params: Mp
}), Pp = Zu.extend({
	method: K("tasks/get"),
	params: Yu.extend({ taskId: F() })
}), Fp = td.merge(Ap), Ip = Zu.extend({
	method: K("tasks/result"),
	params: Yu.extend({ taskId: F() })
}), Lp = td.loose(), Rp = Md.extend({ method: K("tasks/list") }), zp = Nd.extend({ tasks: z(Ap) }), Bp = Zu.extend({
	method: K("tasks/cancel"),
	params: Yu.extend({ taskId: F() })
}), Vp = td.merge(Ap), Hp = U([
	Dd,
	xd,
	Td,
	Sp,
	Bf,
	gf,
	pf,
	Hd,
	Wd,
	Jd,
	Qd,
	ef,
	rf,
	Ff,
	Af
]), Up = U([
	dd,
	Ad,
	wd,
	Dp
]), Wp = U([
	ld,
	Qf,
	$f,
	vp,
	Ep
]), Gp = U([
	Dd,
	Zf,
	hp,
	Tp
]), Kp = U([
	dd,
	Ad,
	Hf,
	uf,
	Xd,
	If,
	Ef,
	of,
	_p
]), qp = U([
	ld,
	Cd,
	Ed,
	Cp,
	Tf,
	mf,
	Ud,
	Gd,
	Yd,
	Mf,
	jf,
	cf
]), Jp = jc().superRefine((e, t) => {
	if (!URL.canParse(e)) return t.addIssue({
		code: Hl.custom,
		message: "URL must be parseable",
		fatal: !0
	}), At;
}).refine((e) => {
	let t = new URL(e);
	return t.protocol !== "javascript:" && t.protocol !== "data:" && t.protocol !== "vbscript:";
}, { message: "URL cannot use javascript:, data:, or vbscript: scheme" }), Yp = H({
	resource: F().url(),
	authorization_servers: z(Jp).optional(),
	jwks_uri: F().url().optional(),
	scopes_supported: z(F()).optional(),
	bearer_methods_supported: z(F()).optional(),
	resource_signing_alg_values_supported: z(F()).optional(),
	resource_name: F().optional(),
	resource_documentation: F().optional(),
	resource_policy_uri: F().url().optional(),
	resource_tos_uri: F().url().optional(),
	tls_client_certificate_bound_access_tokens: L().optional(),
	authorization_details_types_supported: z(F()).optional(),
	dpop_signing_alg_values_supported: z(F()).optional(),
	dpop_bound_access_tokens_required: L().optional()
}), Xp = H({
	issuer: F(),
	authorization_endpoint: Jp,
	token_endpoint: Jp,
	registration_endpoint: Jp.optional(),
	scopes_supported: z(F()).optional(),
	response_types_supported: z(F()),
	response_modes_supported: z(F()).optional(),
	grant_types_supported: z(F()).optional(),
	token_endpoint_auth_methods_supported: z(F()).optional(),
	token_endpoint_auth_signing_alg_values_supported: z(F()).optional(),
	service_documentation: Jp.optional(),
	revocation_endpoint: Jp.optional(),
	revocation_endpoint_auth_methods_supported: z(F()).optional(),
	revocation_endpoint_auth_signing_alg_values_supported: z(F()).optional(),
	introspection_endpoint: F().optional(),
	introspection_endpoint_auth_methods_supported: z(F()).optional(),
	introspection_endpoint_auth_signing_alg_values_supported: z(F()).optional(),
	code_challenge_methods_supported: z(F()).optional(),
	client_id_metadata_document_supported: L().optional(),
	authorization_response_iss_parameter_supported: L().optional().catch(void 0),
	dpop_signing_alg_values_supported: z(F()).optional()
}), Zp = H({
	issuer: F(),
	authorization_endpoint: Jp,
	token_endpoint: Jp,
	userinfo_endpoint: Jp.optional(),
	jwks_uri: Jp,
	registration_endpoint: Jp.optional(),
	scopes_supported: z(F()).optional(),
	response_types_supported: z(F()),
	response_modes_supported: z(F()).optional(),
	grant_types_supported: z(F()).optional(),
	acr_values_supported: z(F()).optional(),
	subject_types_supported: z(F()),
	id_token_signing_alg_values_supported: z(F()),
	id_token_encryption_alg_values_supported: z(F()).optional(),
	id_token_encryption_enc_values_supported: z(F()).optional(),
	userinfo_signing_alg_values_supported: z(F()).optional(),
	userinfo_encryption_alg_values_supported: z(F()).optional(),
	userinfo_encryption_enc_values_supported: z(F()).optional(),
	request_object_signing_alg_values_supported: z(F()).optional(),
	request_object_encryption_alg_values_supported: z(F()).optional(),
	request_object_encryption_enc_values_supported: z(F()).optional(),
	token_endpoint_auth_methods_supported: z(F()).optional(),
	token_endpoint_auth_signing_alg_values_supported: z(F()).optional(),
	display_values_supported: z(F()).optional(),
	claim_types_supported: z(F()).optional(),
	claims_supported: z(F()).optional(),
	service_documentation: F().optional(),
	claims_locales_supported: z(F()).optional(),
	ui_locales_supported: z(F()).optional(),
	claims_parameter_supported: L().optional(),
	request_parameter_supported: L().optional(),
	request_uri_parameter_supported: L().optional(),
	require_request_uri_registration: L().optional(),
	op_policy_uri: Jp.optional(),
	op_tos_uri: Jp.optional(),
	client_id_metadata_document_supported: L().optional(),
	authorization_response_iss_parameter_supported: L().optional().catch(void 0)
}), Qp = B({
	...Zp.shape,
	...Xp.pick({ code_challenge_methods_supported: !0 }).shape
}), $p = B({
	access_token: F(),
	id_token: F().optional(),
	token_type: F(),
	expires_in: Kl().optional(),
	scope: F().optional(),
	refresh_token: F().optional(),
	issuer: F().optional().catch(void 0)
}).strip(), em = B({
	issued_token_type: K("urn:ietf:params:oauth:token-type:id-jag"),
	access_token: F(),
	token_type: F().optional(),
	expires_in: I().optional(),
	scope: F().optional()
}).strip(), tm = B({
	error: F(),
	error_description: F().optional(),
	error_uri: F().optional()
}), nm = Jp.optional().or(K("").transform(() => void 0)), rm = B({
	redirect_uris: z(Jp),
	token_endpoint_auth_method: F().optional(),
	grant_types: z(F()).optional(),
	response_types: z(F()).optional(),
	application_type: F().optional(),
	client_name: F().optional(),
	client_uri: Jp.optional(),
	logo_uri: nm,
	scope: F().optional(),
	contacts: z(F()).optional(),
	tos_uri: nm,
	policy_uri: F().optional(),
	jwks_uri: Jp.optional(),
	jwks: el().optional(),
	software_id: F().optional(),
	software_version: F().optional(),
	software_statement: F().optional()
}).strip(), im = B({
	client_id: F(),
	client_secret: F().optional(),
	client_id_issued_at: I().optional(),
	client_secret_expires_at: I().optional(),
	issuer: F().optional().catch(void 0)
}).strip(), am = rm.merge(im), om = B({
	error: F(),
	error_description: F().optional()
}).strip(), sm = B({
	token: F(),
	token_type_hint: F().optional()
}).strip(), cm = Symbol.for("mcp.sdk.errorBrands");
function lm(e, t) {
	let n = /* @__PURE__ */ new Set(), r = t;
	for (; typeof r == "function";) {
		let e = r.mcpBrand;
		Object.prototype.hasOwnProperty.call(r, "mcpBrand") && typeof e == "string" && n.add(e), r = Object.getPrototypeOf(r);
	}
	n.size !== 0 && Object.defineProperty(e, cm, {
		value: n,
		enumerable: !1,
		configurable: !0
	});
}
function um(e, t) {
	try {
		if (typeof t == "object" && t && Object.prototype.hasOwnProperty.call(e, "mcpBrand") && typeof e.mcpBrand == "string" && Object.prototype.hasOwnProperty.call(t, cm)) {
			let n = t[cm];
			if (n && typeof n.has == "function" && n.has(e.mcpBrand)) return !0;
		}
	} catch {}
	return Function.prototype[Symbol.hasInstance].call(e, t);
}
(class e extends Error {
	static {
		Object.defineProperty(this, "mcpBrand", { value: "mcp.OAuthError" });
	}
	static [Symbol.hasInstance](e) {
		return um(this, e);
	}
	static isInstance(e) {
		if (typeof this != "function") throw TypeError("isInstance must be called on the class (e.g. `SdkError.isInstance(value)`); for callbacks use `v => SdkError.isInstance(v)`");
		return um(this, e);
	}
	constructor(e, t, n) {
		super(t), this.code = e, this.errorUri = n, this.name = "OAuthError", lm(this, new.target);
	}
	toResponseObject() {
		let e = {
			error: this.code,
			error_description: this.message
		};
		return this.errorUri && (e.error_uri = this.errorUri), e;
	}
	static fromResponse(t) {
		return new e(t.error, t.error_description ?? t.error, t.error_uri);
	}
});
var dm = /* @__PURE__ */ function(e) {
	return e.NotConnected = "NOT_CONNECTED", e.AlreadyConnected = "ALREADY_CONNECTED", e.NotInitialized = "NOT_INITIALIZED", e.CapabilityNotSupported = "CAPABILITY_NOT_SUPPORTED", e.RequestTimeout = "REQUEST_TIMEOUT", e.ConnectionClosed = "CONNECTION_CLOSED", e.SendFailed = "SEND_FAILED", e.InvalidResult = "INVALID_RESULT", e.UnsupportedResultType = "UNSUPPORTED_RESULT_TYPE", e.InputRequiredRoundsExceeded = "INPUT_REQUIRED_ROUNDS_EXCEEDED", e.ListPaginationExceeded = "LIST_PAGINATION_EXCEEDED", e.MethodNotSupportedByProtocolVersion = "METHOD_NOT_SUPPORTED_BY_PROTOCOL_VERSION", e.EraNegotiationFailed = "ERA_NEGOTIATION_FAILED", e.ClientHttpNotImplemented = "CLIENT_HTTP_NOT_IMPLEMENTED", e.ClientHttpAuthentication = "CLIENT_HTTP_AUTHENTICATION", e.ClientHttpForbidden = "CLIENT_HTTP_FORBIDDEN", e.ClientHttpUnexpectedContent = "CLIENT_HTTP_UNEXPECTED_CONTENT", e.ClientHttpFailedToOpenStream = "CLIENT_HTTP_FAILED_TO_OPEN_STREAM", e.ClientHttpFailedToTerminateSession = "CLIENT_HTTP_FAILED_TO_TERMINATE_SESSION", e;
}({}), fm = class extends Error {
	static {
		Object.defineProperty(this, "mcpBrand", { value: "mcp.SdkError" });
	}
	static [Symbol.hasInstance](e) {
		return um(this, e);
	}
	static isInstance(e) {
		if (typeof this != "function") throw TypeError("isInstance must be called on the class (e.g. `SdkError.isInstance(value)`); for callbacks use `v => SdkError.isInstance(v)`");
		return um(this, e);
	}
	constructor(e, t, n, r) {
		super(t, r), this.code = e, this.data = n, this.name = "SdkError", lm(this, new.target);
	}
};
(class extends fm {
	static {
		Object.defineProperty(this, "mcpBrand", { value: "mcp.SdkHttpError" });
	}
	constructor(e, t, n, r) {
		super(e, t, n, r), this.name = "SdkHttpError";
	}
	get status() {
		return this.data.status;
	}
	get statusText() {
		return this.data.statusText;
	}
});
function pm(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function mm(e, t, n) {
	return e === "elicitation" && t === "form" && n.form === void 0 && n.url === void 0;
}
function hm(e) {
	switch (e.method) {
		case "elicitation/create": return e.params?.mode === "url" ? { elicitation: { url: {} } } : { elicitation: { form: {} } };
		case "sampling/createMessage": {
			let t = e.params;
			return t !== void 0 && (t.tools !== void 0 || t.toolChoice !== void 0) ? { sampling: { tools: {} } } : { sampling: {} };
		}
		case "roots/list": return { roots: {} };
		default: return;
	}
}
function gm(e, t) {
	let n = {};
	for (let [r, i] of Object.entries(e)) {
		if (i === void 0) continue;
		let e = t === void 0 ? void 0 : t[r];
		if (e === void 0) n[r] = i;
		else if (pm(i) && pm(e)) {
			let t = {};
			for (let [n, a] of Object.entries(i)) a !== void 0 && e[n] === void 0 && !mm(r, n, e) && (t[n] = a);
			Object.keys(t).length > 0 && (n[r] = t);
		}
	}
	return Object.keys(n).length > 0 ? n : void 0;
}
var _m = "2026-07-28", vm = [_m];
function ym(e) {
	return e >= _m;
}
function bm(e) {
	return e.filter((e) => !ym(e));
}
function xm(e) {
	return e.filter((e) => ym(e));
}
function Sm(e) {
	let t = e.structuredContent;
	return t === void 0 || typeof t == "object" && t && !Array.isArray(t) || (e.content?.some((e) => e.type === "text") ?? !1) ? e : {
		...e,
		content: [...e.content ?? [], {
			type: "text",
			text: JSON.stringify(t)
		}]
	};
}
var Cm = [
	"task",
	"inputRequests",
	"requestState"
];
function wm(e) {
	return typeof e != "object" || !e || Array.isArray(e) || e.content !== void 0 || Cm.some((t) => t in e) ? e : {
		...e,
		content: []
	};
}
function Tm() {
	let e = Ll(() => U([
		F(),
		I(),
		L(),
		Qc(),
		W(F(), e),
		z(e)
	])), t = W(F(), e), n = U([F(), I().int()]), r = F(), i = B({ ttl: I().optional() }), a = B({ taskId: F() }), o = H({
		progressToken: n.optional(),
		"io.modelcontextprotocol/related-task": a.optional()
	}), s = B({ _meta: o.optional() }), c = s.extend({ task: i.optional() }), l = B({
		method: F(),
		params: s.loose().optional()
	}), u = B({ _meta: o.optional() }), d = B({
		method: F(),
		params: u.loose().optional()
	}), f = H({ _meta: o.optional() }), p = U([F(), I().int()]), m = f.strict(), h = u.extend({
		requestId: p.optional(),
		reason: F().optional()
	}), g = d.extend({
		method: K("notifications/cancelled"),
		params: h
	}), _ = B({
		src: F(),
		mimeType: F().optional(),
		sizes: z(F()).optional(),
		theme: G(["light", "dark"]).optional()
	}), v = B({ icons: z(_).optional() }), y = B({
		name: F(),
		title: F().optional()
	}), b = y.extend({
		...y.shape,
		...v.shape,
		version: F(),
		websiteUrl: F().optional(),
		description: F().optional()
	}), x = Vl((e) => e && typeof e == "object" && !Array.isArray(e) && Object.keys(e).length === 0 ? { form: {} } : e, ul(B({
		form: ul(B({ applyDefaults: L().optional() }), t).optional(),
		url: t.optional()
	}), t.optional())), S = H({
		list: t.optional(),
		cancel: t.optional(),
		requests: H({
			sampling: H({ createMessage: t.optional() }).optional(),
			elicitation: H({ create: t.optional() }).optional()
		}).optional()
	}), C = H({
		list: t.optional(),
		cancel: t.optional(),
		requests: H({ tools: H({ call: t.optional() }).optional() }).optional()
	}), w = B({
		experimental: W(F(), t).optional(),
		sampling: B({
			context: t.optional(),
			tools: t.optional()
		}).optional(),
		elicitation: x.optional(),
		roots: B({ listChanged: L().optional() }).optional(),
		tasks: S.optional(),
		extensions: W(F(), t).optional()
	}), T = s.extend({
		protocolVersion: F(),
		capabilities: w,
		clientInfo: b
	}), E = l.extend({
		method: K("initialize"),
		params: T
	}), D = B({
		experimental: W(F(), t).optional(),
		logging: t.optional(),
		completions: t.optional(),
		prompts: B({ listChanged: L().optional() }).optional(),
		resources: B({
			subscribe: L().optional(),
			listChanged: L().optional()
		}).optional(),
		tools: B({ listChanged: L().optional() }).optional(),
		tasks: C.optional(),
		extensions: W(F(), t).optional()
	}), ee = f.extend({
		protocolVersion: F(),
		capabilities: D,
		serverInfo: b,
		instructions: F().optional()
	}), O = d.extend({
		method: K("notifications/initialized"),
		params: u.optional()
	}), te = l.extend({
		method: K("ping"),
		params: s.optional()
	}), ne = B({
		progress: I(),
		total: q(I()),
		message: q(F())
	}), re = B({
		...u.shape,
		...ne.shape,
		progressToken: n
	}), ie = d.extend({
		method: K("notifications/progress"),
		params: re
	}), k = s.extend({ cursor: r.optional() }), ae = l.extend({ params: k.optional() }), oe = f.extend({ nextCursor: r.optional() }), se = B({
		uri: F(),
		mimeType: q(F()),
		_meta: W(F(), R()).optional()
	}), ce = se.extend({ text: F() }), le = F().refine((e) => {
		try {
			return atob(e), !0;
		} catch {
			return !1;
		}
	}, { message: "Invalid Base64 string" }), ue = se.extend({ blob: le }), de = G(["user", "assistant"]), fe = B({
		audience: z(de).optional(),
		priority: I().min(0).max(1).optional(),
		lastModified: Wl({ offset: !0 }).optional()
	}), A = B({
		...y.shape,
		...v.shape,
		uri: F(),
		description: q(F()),
		mimeType: q(F()),
		size: q(I()),
		annotations: fe.optional(),
		_meta: q(H({}))
	}), pe = B({
		...y.shape,
		...v.shape,
		uriTemplate: F(),
		description: q(F()),
		mimeType: q(F()),
		annotations: fe.optional(),
		_meta: q(H({}))
	}), j = ae.extend({ method: K("resources/list") }), me = oe.extend({ resources: z(A) }), he = ae.extend({ method: K("resources/templates/list") }), ge = oe.extend({ resourceTemplates: z(pe) }), _e = s.extend({ uri: F() }), ve = _e, ye = l.extend({
		method: K("resources/read"),
		params: ve
	}), be = f.extend({ contents: z(U([ce, ue])) }), xe = d.extend({
		method: K("notifications/resources/list_changed"),
		params: u.optional()
	}), Se = _e, Ce = l.extend({
		method: K("resources/subscribe"),
		params: Se
	}), we = _e, Te = l.extend({
		method: K("resources/unsubscribe"),
		params: we
	}), Ee = u.extend({ uri: F() }), De = d.extend({
		method: K("notifications/resources/updated"),
		params: Ee
	}), Oe = B({
		name: F(),
		description: q(F()),
		required: q(L())
	}), ke = B({
		...y.shape,
		...v.shape,
		description: q(F()),
		arguments: q(z(Oe)),
		_meta: q(H({}))
	}), Ae = ae.extend({ method: K("prompts/list") }), je = oe.extend({ prompts: z(ke) }), Me = s.extend({
		name: F(),
		arguments: W(F(), F()).optional()
	}), Ne = l.extend({
		method: K("prompts/get"),
		params: Me
	}), Pe = B({
		type: K("text"),
		text: F(),
		annotations: fe.optional(),
		_meta: W(F(), R()).optional()
	}), Fe = B({
		type: K("image"),
		data: le,
		mimeType: F(),
		annotations: fe.optional(),
		_meta: W(F(), R()).optional()
	}), Ie = B({
		type: K("audio"),
		data: le,
		mimeType: F(),
		annotations: fe.optional(),
		_meta: W(F(), R()).optional()
	}), Le = B({
		type: K("tool_use"),
		name: F(),
		id: F(),
		input: W(F(), R()),
		_meta: W(F(), R()).optional()
	}), Re = B({
		type: K("resource"),
		resource: U([ce, ue]),
		annotations: fe.optional(),
		_meta: W(F(), R()).optional()
	}), ze = A.extend({ type: K("resource_link") }), Be = U([
		Pe,
		Fe,
		Ie,
		ze,
		Re
	]), Ve = B({
		role: de,
		content: Be
	}), He = f.extend({
		description: F().optional(),
		messages: z(Ve)
	}), Ue = d.extend({
		method: K("notifications/prompts/list_changed"),
		params: u.optional()
	}), We = B({
		title: F().optional(),
		readOnlyHint: L().optional(),
		destructiveHint: L().optional(),
		idempotentHint: L().optional(),
		openWorldHint: L().optional()
	}), Ge = B({ taskSupport: G([
		"required",
		"optional",
		"forbidden"
	]).optional() }), M = B({
		...y.shape,
		...v.shape,
		description: F().optional(),
		inputSchema: B({
			type: K("object"),
			properties: W(F(), e).optional(),
			required: z(F()).optional()
		}).catchall(R()),
		outputSchema: B({
			type: K("object"),
			properties: W(F(), e).optional(),
			required: z(F()).optional()
		}).catchall(R()).optional(),
		annotations: We.optional(),
		execution: Ge.optional(),
		_meta: W(F(), R()).optional()
	}), Ke = ae.extend({ method: K("tools/list") }), qe = oe.extend({ tools: z(M) }), Je = f.extend({
		content: z(Be),
		structuredContent: W(F(), R()).optional(),
		isError: L().optional()
	}), Ye = c.extend({
		name: F(),
		arguments: W(F(), R()).optional()
	}), Xe = l.extend({
		method: K("tools/call"),
		params: Ye
	}), Ze = d.extend({
		method: K("notifications/tools/list_changed"),
		params: u.optional()
	}), Qe = G([
		"debug",
		"info",
		"notice",
		"warning",
		"error",
		"critical",
		"alert",
		"emergency"
	]), $e = s.extend({ level: Qe }), et = l.extend({
		method: K("logging/setLevel"),
		params: $e
	}), tt = u.extend({
		level: Qe,
		logger: F().optional(),
		data: R()
	}), nt = d.extend({
		method: K("notifications/message"),
		params: tt
	}), rt = B({ name: F().optional() }), it = B({
		hints: z(rt).optional(),
		costPriority: I().min(0).max(1).optional(),
		speedPriority: I().min(0).max(1).optional(),
		intelligencePriority: I().min(0).max(1).optional()
	}), at = B({ mode: G([
		"auto",
		"required",
		"none"
	]).optional() }), ot = B({
		type: K("tool_result"),
		toolUseId: F().describe("The unique identifier for the corresponding tool call."),
		content: z(Be),
		structuredContent: B({}).loose().optional(),
		isError: L().optional(),
		_meta: W(F(), R()).optional()
	}), st = cl("type", [
		Pe,
		Fe,
		Ie
	]), ct = cl("type", [
		Pe,
		Fe,
		Ie,
		Le,
		ot
	]), lt = B({
		role: de,
		content: U([ct, z(ct)]),
		_meta: W(F(), R()).optional()
	}), ut = c.extend({
		messages: z(lt),
		modelPreferences: it.optional(),
		systemPrompt: F().optional(),
		includeContext: G([
			"none",
			"thisServer",
			"allServers"
		]).optional(),
		temperature: I().optional(),
		maxTokens: I().int(),
		stopSequences: z(F()).optional(),
		metadata: t.optional(),
		tools: z(M).optional(),
		toolChoice: at.optional()
	}), dt = l.extend({
		method: K("sampling/createMessage"),
		params: ut
	}), ft = f.extend({
		model: F(),
		stopReason: q(G([
			"endTurn",
			"stopSequence",
			"maxTokens"
		]).or(F())),
		role: de,
		content: st
	}), pt = f.extend({
		model: F(),
		stopReason: q(G([
			"endTurn",
			"stopSequence",
			"maxTokens",
			"toolUse"
		]).or(F())),
		role: de,
		content: U([ct, z(ct)])
	}), mt = B({
		type: K("boolean"),
		title: F().optional(),
		description: F().optional(),
		default: L().optional()
	}), ht = B({
		type: K("string"),
		title: F().optional(),
		description: F().optional(),
		minLength: I().optional(),
		maxLength: I().optional(),
		format: G([
			"email",
			"uri",
			"date",
			"date-time"
		]).optional(),
		default: F().optional()
	}), gt = B({
		type: G(["number", "integer"]),
		title: F().optional(),
		description: F().optional(),
		minimum: I().optional(),
		maximum: I().optional(),
		default: I().optional()
	}), _t = B({
		type: K("string"),
		title: F().optional(),
		description: F().optional(),
		enum: z(F()),
		default: F().optional()
	}), vt = B({
		type: K("string"),
		title: F().optional(),
		description: F().optional(),
		oneOf: z(B({
			const: F(),
			title: F()
		})),
		default: F().optional()
	}), yt = B({
		type: K("string"),
		title: F().optional(),
		description: F().optional(),
		enum: z(F()),
		enumNames: z(F()).optional(),
		default: F().optional()
	}), bt = U([_t, vt]), xt = B({
		type: K("array"),
		title: F().optional(),
		description: F().optional(),
		minItems: I().optional(),
		maxItems: I().optional(),
		items: B({
			type: K("string"),
			enum: z(F())
		}),
		default: z(F()).optional()
	}), St = B({
		type: K("array"),
		title: F().optional(),
		description: F().optional(),
		minItems: I().optional(),
		maxItems: I().optional(),
		items: B({ anyOf: z(B({
			const: F(),
			title: F()
		})) }),
		default: z(F()).optional()
	}), Ct = U([xt, St]), wt = U([
		yt,
		bt,
		Ct
	]), Tt = U([
		wt,
		mt,
		ht,
		gt
	]), N = c.extend({
		mode: K("form").optional(),
		message: F(),
		requestedSchema: B({
			type: K("object"),
			properties: W(F(), Tt),
			required: z(F()).optional()
		}).catchall(R())
	}), Et = c.extend({
		mode: K("url"),
		message: F(),
		elicitationId: F(),
		url: F().url()
	}), Dt = U([N, Et]), Ot = l.extend({
		method: K("elicitation/create"),
		params: Dt
	}), kt = u.extend({ elicitationId: F() }), At = d.extend({
		method: K("notifications/elicitation/complete"),
		params: kt
	}), jt = f.extend({
		action: G([
			"accept",
			"decline",
			"cancel"
		]),
		content: Vl((e) => e === null ? void 0 : e, W(F(), U([
			F(),
			I(),
			L(),
			z(F())
		])).optional())
	}), Mt = B({
		type: K("ref/resource"),
		uri: F()
	}), Nt = B({
		type: K("ref/prompt"),
		name: F()
	}), P = s.extend({
		ref: U([Nt, Mt]),
		argument: B({
			name: F(),
			value: F()
		}),
		context: B({ arguments: W(F(), F()).optional() }).optional()
	}), Pt = l.extend({
		method: K("completion/complete"),
		params: P
	}), Ft = f.extend({ completion: H({
		values: z(F()).max(100),
		total: q(I().int()),
		hasMore: q(L())
	}) }), It = B({
		uri: F().startsWith("file://"),
		name: F().optional(),
		_meta: W(F(), R()).optional()
	}), Lt = l.extend({
		method: K("roots/list"),
		params: s.optional()
	}), Rt = f.extend({ roots: z(It) }), zt = d.extend({
		method: K("notifications/roots/list_changed"),
		params: u.optional()
	}), Bt = H({
		ttl: I().optional(),
		pollInterval: I().optional()
	}), Vt = G([
		"working",
		"input_required",
		"completed",
		"failed",
		"cancelled"
	]), Ht = B({
		taskId: F(),
		status: Vt,
		ttl: U([I(), Qc()]),
		createdAt: F(),
		lastUpdatedAt: F(),
		pollInterval: q(I()),
		statusMessage: q(F())
	}), Ut = f.extend({ task: Ht }), Wt = u.merge(Ht), Gt = d.extend({
		method: K("notifications/tasks/status"),
		params: Wt
	}), Kt = l.extend({
		method: K("tasks/get"),
		params: s.extend({ taskId: F() })
	}), qt = f.merge(Ht), Jt = l.extend({
		method: K("tasks/result"),
		params: s.extend({ taskId: F() })
	}), Yt = f.loose(), Xt = ae.extend({ method: K("tasks/list") }), Zt = oe.extend({ tasks: z(Ht) }), Qt = l.extend({
		method: K("tasks/cancel"),
		params: s.extend({ taskId: F() })
	});
	return {
		JSONValueSchema: e,
		JSONObjectSchema: t,
		ProgressTokenSchema: n,
		CursorSchema: r,
		TaskMetadataSchema: i,
		RelatedTaskMetadataSchema: a,
		RequestMetaSchema: o,
		BaseRequestParamsSchema: s,
		TaskAugmentedRequestParamsSchema: c,
		RequestSchema: l,
		NotificationsParamsSchema: u,
		NotificationSchema: d,
		ResultSchema: f,
		RequestIdSchema: p,
		EmptyResultSchema: m,
		CancelledNotificationParamsSchema: h,
		CancelledNotificationSchema: g,
		IconSchema: _,
		IconsSchema: v,
		BaseMetadataSchema: y,
		ImplementationSchema: b,
		ClientTasksCapabilitySchema: S,
		ServerTasksCapabilitySchema: C,
		ClientCapabilitiesSchema: w,
		InitializeRequestParamsSchema: T,
		InitializeRequestSchema: E,
		ServerCapabilitiesSchema: D,
		InitializeResultSchema: ee,
		InitializedNotificationSchema: O,
		PingRequestSchema: te,
		ProgressSchema: ne,
		ProgressNotificationParamsSchema: re,
		ProgressNotificationSchema: ie,
		PaginatedRequestParamsSchema: k,
		PaginatedRequestSchema: ae,
		PaginatedResultSchema: oe,
		ResourceContentsSchema: se,
		TextResourceContentsSchema: ce,
		BlobResourceContentsSchema: ue,
		RoleSchema: de,
		AnnotationsSchema: fe,
		ResourceSchema: A,
		ResourceTemplateSchema: pe,
		ListResourcesRequestSchema: j,
		ListResourcesResultSchema: me,
		ListResourceTemplatesRequestSchema: he,
		ListResourceTemplatesResultSchema: ge,
		ResourceRequestParamsSchema: _e,
		ReadResourceRequestParamsSchema: ve,
		ReadResourceRequestSchema: ye,
		ReadResourceResultSchema: be,
		ResourceListChangedNotificationSchema: xe,
		SubscribeRequestParamsSchema: Se,
		SubscribeRequestSchema: Ce,
		UnsubscribeRequestParamsSchema: we,
		UnsubscribeRequestSchema: Te,
		ResourceUpdatedNotificationParamsSchema: Ee,
		ResourceUpdatedNotificationSchema: De,
		PromptArgumentSchema: Oe,
		PromptSchema: ke,
		ListPromptsRequestSchema: Ae,
		ListPromptsResultSchema: je,
		GetPromptRequestParamsSchema: Me,
		GetPromptRequestSchema: Ne,
		TextContentSchema: Pe,
		ImageContentSchema: Fe,
		AudioContentSchema: Ie,
		ToolUseContentSchema: Le,
		EmbeddedResourceSchema: Re,
		ResourceLinkSchema: ze,
		ContentBlockSchema: Be,
		PromptMessageSchema: Ve,
		GetPromptResultSchema: He,
		PromptListChangedNotificationSchema: Ue,
		ToolAnnotationsSchema: We,
		ToolExecutionSchema: Ge,
		ToolSchema: M,
		ListToolsRequestSchema: Ke,
		ListToolsResultSchema: qe,
		CallToolResultSchema: Je,
		CallToolRequestParamsSchema: Ye,
		CallToolRequestSchema: Xe,
		ToolListChangedNotificationSchema: Ze,
		LoggingLevelSchema: Qe,
		SetLevelRequestParamsSchema: $e,
		SetLevelRequestSchema: et,
		LoggingMessageNotificationParamsSchema: tt,
		LoggingMessageNotificationSchema: nt,
		ModelHintSchema: rt,
		ModelPreferencesSchema: it,
		ToolChoiceSchema: at,
		ToolResultContentSchema: ot,
		SamplingContentSchema: st,
		SamplingMessageContentBlockSchema: ct,
		SamplingMessageSchema: lt,
		CreateMessageRequestParamsSchema: ut,
		CreateMessageRequestSchema: dt,
		CreateMessageResultSchema: ft,
		CreateMessageResultWithToolsSchema: pt,
		BooleanSchemaSchema: mt,
		StringSchemaSchema: ht,
		NumberSchemaSchema: gt,
		UntitledSingleSelectEnumSchemaSchema: _t,
		TitledSingleSelectEnumSchemaSchema: vt,
		LegacyTitledEnumSchemaSchema: yt,
		SingleSelectEnumSchemaSchema: bt,
		UntitledMultiSelectEnumSchemaSchema: xt,
		TitledMultiSelectEnumSchemaSchema: St,
		MultiSelectEnumSchemaSchema: Ct,
		EnumSchemaSchema: wt,
		PrimitiveSchemaDefinitionSchema: Tt,
		ElicitRequestFormParamsSchema: N,
		ElicitRequestURLParamsSchema: Et,
		ElicitRequestParamsSchema: Dt,
		ElicitRequestSchema: Ot,
		ElicitationCompleteNotificationParamsSchema: kt,
		ElicitationCompleteNotificationSchema: At,
		ElicitResultSchema: jt,
		ResourceTemplateReferenceSchema: Mt,
		PromptReferenceSchema: Nt,
		CompleteRequestParamsSchema: P,
		CompleteRequestSchema: Pt,
		CompleteResultSchema: Ft,
		RootSchema: It,
		ListRootsRequestSchema: Lt,
		ListRootsResultSchema: Rt,
		RootsListChangedNotificationSchema: zt,
		TaskCreationParamsSchema: Bt,
		TaskStatusSchema: Vt,
		TaskSchema: Ht,
		CreateTaskResultSchema: Ut,
		TaskStatusNotificationParamsSchema: Wt,
		TaskStatusNotificationSchema: Gt,
		GetTaskRequestSchema: Kt,
		GetTaskResultSchema: qt,
		GetTaskPayloadRequestSchema: Jt,
		GetTaskPayloadResultSchema: Yt,
		ListTasksRequestSchema: Xt,
		ListTasksResultSchema: Zt,
		CancelTaskRequestSchema: Qt,
		CancelTaskResultSchema: f.merge(Ht),
		ClientRequestSchema: U([
			te,
			E,
			Pt,
			et,
			Ne,
			Ae,
			j,
			he,
			ye,
			Ce,
			Te,
			Xe,
			Ke,
			Kt,
			Jt,
			Xt,
			Qt
		]),
		ClientNotificationSchema: U([
			g,
			ie,
			O,
			zt,
			Gt
		]),
		ClientResultSchema: U([
			m,
			ft,
			pt,
			jt,
			Rt,
			qt,
			Zt,
			Ut
		]),
		ServerRequestSchema: U([
			te,
			dt,
			Ot,
			Lt,
			Kt,
			Jt,
			Xt,
			Qt
		]),
		ServerNotificationSchema: U([
			g,
			ie,
			nt,
			De,
			xe,
			Ze,
			Ue,
			Gt,
			At
		]),
		ServerResultSchema: U([
			m,
			ee,
			Ft,
			He,
			je,
			me,
			ge,
			be,
			Je,
			qe,
			qt,
			Zt,
			Ut
		]),
		CallToolResultWireSchema: R().superRefine((e, t) => {
			if (typeof e == "object" && e && !Array.isArray(e) && e.content === void 0) {
				for (let n of Cm) if (n in e) {
					t.addIssue({
						code: "custom",
						message: `content is required when the body carries '${n}' — another result family cannot default into an empty tools/call success`
					});
					return;
				}
			}
		}).transform(wm).pipe(Je)
	};
}
var Em;
function Dm() {
	return Em ??= Tm();
}
function Om(e) {
	return e.type !== "object";
}
var km = /* @__PURE__ */ new Set([
	"const",
	"enum",
	"default",
	"examples"
]), Am = /* @__PURE__ */ new Set([
	"properties",
	"patternProperties",
	"$defs",
	"definitions",
	"dependentSchemas",
	"dependencies"
]);
function jm(e) {
	return e !== void 0 && !(typeof e == "string" && e.startsWith("#"));
}
function Mm(e) {
	let t = typeof e.$schema == "string" ? e.$schema : void 0;
	if (jm(e.$id)) return {
		...t !== void 0 && { $schema: t },
		type: "object",
		properties: { result: e },
		required: ["result"]
	};
	let n = Mu(e.$schema) && e.$recursiveAnchor !== !0, r = (e, t) => {
		if (Array.isArray(e)) return e.map((e) => r(e, !1));
		if (typeof e != "object" || !e || !t && jm(e.$id)) return e;
		let i = {}, a = !1;
		for (let [o, s] of Object.entries(e)) t ? i[o] = r(s, !1) : (o === "$ref" || o === "$dynamicRef") && typeof s == "string" ? i[o] = s === "#" ? "#/properties/result" : s.startsWith("#/") ? `#/properties/result${s.slice(1)}` : s : o === "$recursiveRef" && s === "#" && n ? a = !0 : i[o] = km.has(o) ? s : Am.has(o) ? r(s, !0) : r(s, !1);
		return a && ("$ref" in i ? i.allOf = [...Array.isArray(i.allOf) ? i.allOf : [], { $ref: "#/properties/result" }] : i.$ref = "#/properties/result"), i;
	};
	return {
		...t !== void 0 && { $schema: t },
		type: "object",
		properties: { result: r(e, !1) },
		required: ["result"]
	};
}
var Nm = {
	ping: null,
	initialize: null,
	"completion/complete": null,
	"logging/setLevel": null,
	"prompts/get": null,
	"prompts/list": null,
	"resources/list": null,
	"resources/templates/list": null,
	"resources/read": null,
	"resources/subscribe": null,
	"resources/unsubscribe": null,
	"tools/call": null,
	"tools/list": null,
	"tasks/get": null,
	"tasks/result": null,
	"tasks/list": null,
	"tasks/cancel": null,
	"sampling/createMessage": null,
	"elicitation/create": null,
	"roots/list": null
}, Pm = {
	"notifications/cancelled": null,
	"notifications/progress": null,
	"notifications/initialized": null,
	"notifications/roots/list_changed": null,
	"notifications/tasks/status": null,
	"notifications/message": null,
	"notifications/resources/updated": null,
	"notifications/resources/list_changed": null,
	"notifications/tools/list_changed": null,
	"notifications/prompts/list_changed": null,
	"notifications/elicitation/complete": null
}, Fm = {
	ping: null,
	initialize: null,
	"completion/complete": null,
	"logging/setLevel": null,
	"prompts/get": null,
	"prompts/list": null,
	"resources/list": null,
	"resources/templates/list": null,
	"resources/read": null,
	"resources/subscribe": null,
	"resources/unsubscribe": null,
	"tools/call": null,
	"tools/list": null,
	"sampling/createMessage": null,
	"elicitation/create": null,
	"roots/list": null
}, Im;
function Lm() {
	if (Im) return Im;
	let e = Dm();
	return Im = {
		requestSchemas: {
			ping: e.PingRequestSchema,
			initialize: e.InitializeRequestSchema,
			"completion/complete": e.CompleteRequestSchema,
			"logging/setLevel": e.SetLevelRequestSchema,
			"prompts/get": e.GetPromptRequestSchema,
			"prompts/list": e.ListPromptsRequestSchema,
			"resources/list": e.ListResourcesRequestSchema,
			"resources/templates/list": e.ListResourceTemplatesRequestSchema,
			"resources/read": e.ReadResourceRequestSchema,
			"resources/subscribe": e.SubscribeRequestSchema,
			"resources/unsubscribe": e.UnsubscribeRequestSchema,
			"tools/call": e.CallToolRequestSchema,
			"tools/list": e.ListToolsRequestSchema,
			"tasks/get": e.GetTaskRequestSchema,
			"tasks/result": e.GetTaskPayloadRequestSchema,
			"tasks/list": e.ListTasksRequestSchema,
			"tasks/cancel": e.CancelTaskRequestSchema,
			"sampling/createMessage": e.CreateMessageRequestSchema,
			"elicitation/create": e.ElicitRequestSchema,
			"roots/list": e.ListRootsRequestSchema
		},
		notificationSchemas: {
			"notifications/cancelled": e.CancelledNotificationSchema,
			"notifications/progress": e.ProgressNotificationSchema,
			"notifications/initialized": e.InitializedNotificationSchema,
			"notifications/roots/list_changed": e.RootsListChangedNotificationSchema,
			"notifications/tasks/status": e.TaskStatusNotificationSchema,
			"notifications/message": e.LoggingMessageNotificationSchema,
			"notifications/resources/updated": e.ResourceUpdatedNotificationSchema,
			"notifications/resources/list_changed": e.ResourceListChangedNotificationSchema,
			"notifications/tools/list_changed": e.ToolListChangedNotificationSchema,
			"notifications/prompts/list_changed": e.PromptListChangedNotificationSchema,
			"notifications/elicitation/complete": e.ElicitationCompleteNotificationSchema
		},
		resultSchemas: {
			ping: e.EmptyResultSchema,
			initialize: e.InitializeResultSchema,
			"completion/complete": e.CompleteResultSchema,
			"logging/setLevel": e.EmptyResultSchema,
			"prompts/get": e.GetPromptResultSchema,
			"prompts/list": e.ListPromptsResultSchema,
			"resources/list": e.ListResourcesResultSchema,
			"resources/templates/list": e.ListResourceTemplatesResultSchema,
			"resources/read": e.ReadResourceResultSchema,
			"resources/subscribe": e.EmptyResultSchema,
			"resources/unsubscribe": e.EmptyResultSchema,
			"tools/call": e.CallToolResultWireSchema,
			"tools/list": e.ListToolsResultSchema,
			"sampling/createMessage": e.CreateMessageResultWithToolsSchema,
			"elicitation/create": e.ElicitResultSchema,
			"roots/list": e.ListRootsResultSchema
		}
	}, Im;
}
function Rm(e) {
	return Object.prototype.hasOwnProperty.call(Nm, e);
}
function zm(e) {
	return Object.prototype.hasOwnProperty.call(Pm, e);
}
function Bm(e) {
	return Object.prototype.hasOwnProperty.call(Fm, e);
}
function Vm(e) {
	return Bm(e) ? Lm().resultSchemas[e] : void 0;
}
function Hm(e) {
	return Rm(e) ? Lm().requestSchemas[e] : void 0;
}
function Um(e) {
	return zm(e) ? Lm().notificationSchemas[e] : void 0;
}
Object.keys(Nm), Object.keys(Pm);
function Wm(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Gm(e, t) {
	if (e === void 0) return {
		ok: !1,
		reason: "not-in-era"
	};
	let n = e.safeParse(t);
	return n.success ? {
		ok: !0,
		value: n.data
	} : {
		ok: !1,
		reason: "invalid",
		message: String(n.error)
	};
}
var Km = {
	ok: !1,
	reason: "not-in-era"
};
function qm(e) {
	return Wm(e) && Wm(e.outputSchema) && Om(e.outputSchema);
}
function Jm(e) {
	return e;
}
var Ym = {
	era: "2025-11-25",
	hasRequestMethod: Rm,
	hasNotificationMethod: zm,
	validateRequest: (e, t) => Gm(Hm(e), t),
	validateResult: (e, t) => Gm(Vm(e), t),
	validateNotification: (e, t) => Gm(Um(e), t),
	hasInputRequestMethod: () => !1,
	validateInputRequest: () => Km,
	validateInputResponse: () => Km,
	samplingResultVariant: ((e, t) => {
		let n = Dm();
		return Gm(e ? n.CreateMessageResultWithToolsSchema : n.CreateMessageResultSchema, t);
	}),
	outboundEnvelope: (e) => void 0,
	validateEnvelopeMeta: (e) => [],
	projectCallToolResult(e, t) {
		let n = Sm(e), r = n.structuredContent;
		if (r === void 0) return n;
		let i = typeof r != "object" || !r || Array.isArray(r), a = t !== void 0 && Om(t);
		return !i && !a ? n : {
			...n,
			structuredContent: { result: r }
		};
	},
	decodeResult(e, t) {
		if (Wm(t) && "resultType" in t) {
			let e = { ...t };
			return delete e.resultType, {
				kind: "complete",
				result: Jm(e)
			};
		}
		return {
			kind: "complete",
			result: Jm(t)
		};
	},
	encodeResult(e, t) {
		if (e !== "tools/list") return t;
		let n = t.tools;
		return !Array.isArray(n) || !n.some((e) => qm(e)) ? t : {
			...t,
			tools: n.map((e) => qm(e) ? {
				...e,
				outputSchema: Mm(e.outputSchema)
			} : e)
		};
	},
	encodeErrorCode: (e) => e === -32002 ? -32602 : e,
	checkInboundEnvelope: (e) => void 0
};
function Xm() {
	let e = Ll(() => U([
		F(),
		I(),
		L(),
		Qc(),
		W(F(), e),
		z(e)
	])), t = W(F(), e), n = U([F(), I().int()]), r = F(), i = U([F(), I().int()]), a = G(["user", "assistant"]), o = G([
		"debug",
		"info",
		"notice",
		"warning",
		"error",
		"critical",
		"alert",
		"emergency"
	]), s = F().refine((e) => {
		try {
			return atob(e), !0;
		} catch {
			return !1;
		}
	}, { message: "Invalid Base64 string" }), c = B({ ttl: I().optional() }), l = B({ taskId: F() }), u = H({
		progressToken: n.optional(),
		"io.modelcontextprotocol/related-task": l.optional()
	}), d = B({ _meta: u.optional() }), f = d.extend({ task: c.optional() }), p = B({ _meta: u.optional() }), m = B({
		method: F(),
		params: p.loose().optional()
	}), h = B({
		src: F(),
		mimeType: F().optional(),
		sizes: z(F()).optional(),
		theme: G(["light", "dark"]).optional()
	}), g = B({ icons: z(h).optional() }), _ = B({
		name: F(),
		title: F().optional()
	}), v = _.extend({
		..._.shape,
		...g.shape,
		version: F(),
		websiteUrl: F().optional(),
		description: F().optional()
	}), y = Vl((e) => e && typeof e == "object" && !Array.isArray(e) && Object.keys(e).length === 0 ? { form: {} } : e, ul(B({
		form: ul(B({ applyDefaults: L().optional() }), t).optional(),
		url: t.optional()
	}), t.optional())), b = H({
		list: t.optional(),
		cancel: t.optional(),
		requests: H({
			sampling: H({ createMessage: t.optional() }).optional(),
			elicitation: H({ create: t.optional() }).optional()
		}).optional()
	}), x = H({
		list: t.optional(),
		cancel: t.optional(),
		requests: H({ tools: H({ call: t.optional() }).optional() }).optional()
	}), S = B({
		experimental: W(F(), t).optional(),
		sampling: B({
			context: t.optional(),
			tools: t.optional()
		}).optional(),
		elicitation: y.optional(),
		roots: B({ listChanged: L().optional() }).optional(),
		tasks: b.optional(),
		extensions: W(F(), t).optional()
	}), C = B({
		experimental: W(F(), t).optional(),
		logging: t.optional(),
		completions: t.optional(),
		prompts: B({ listChanged: L().optional() }).optional(),
		resources: B({
			subscribe: L().optional(),
			listChanged: L().optional()
		}).optional(),
		tools: B({ listChanged: L().optional() }).optional(),
		tasks: x.optional(),
		extensions: W(F(), t).optional()
	}), w = B({
		progress: I(),
		total: q(I()),
		message: q(F())
	}), T = B({
		...p.shape,
		...w.shape,
		progressToken: n
	}), E = m.extend({
		method: K("notifications/progress"),
		params: T
	}), D = p.extend({
		level: o,
		logger: F().optional(),
		data: R()
	}), ee = m.extend({
		method: K("notifications/message"),
		params: D
	}), O = B({
		uri: F(),
		mimeType: q(F()),
		_meta: W(F(), R()).optional()
	}), te = O.extend({ text: F() }), ne = O.extend({ blob: s }), re = B({
		audience: z(a).optional(),
		priority: I().min(0).max(1).optional(),
		lastModified: Wl({ offset: !0 }).optional()
	}), ie = B({
		..._.shape,
		...g.shape,
		uri: F(),
		description: q(F()),
		mimeType: q(F()),
		size: q(I()),
		annotations: re.optional(),
		_meta: q(H({}))
	}), k = B({
		..._.shape,
		...g.shape,
		uriTemplate: F(),
		description: q(F()),
		mimeType: q(F()),
		annotations: re.optional(),
		_meta: q(H({}))
	}), ae = m.extend({
		method: K("notifications/resources/list_changed"),
		params: p.optional()
	}), oe = p.extend({ uri: F() }), se = m.extend({
		method: K("notifications/resources/updated"),
		params: oe
	}), ce = B({
		name: F(),
		description: q(F()),
		required: q(L())
	}), le = B({
		..._.shape,
		...g.shape,
		description: q(F()),
		arguments: q(z(ce)),
		_meta: q(H({}))
	}), ue = m.extend({
		method: K("notifications/prompts/list_changed"),
		params: p.optional()
	}), de = B({
		type: K("text"),
		text: F(),
		annotations: re.optional(),
		_meta: W(F(), R()).optional()
	}), fe = B({
		type: K("image"),
		data: s,
		mimeType: F(),
		annotations: re.optional(),
		_meta: W(F(), R()).optional()
	}), A = B({
		type: K("audio"),
		data: s,
		mimeType: F(),
		annotations: re.optional(),
		_meta: W(F(), R()).optional()
	}), pe = B({
		type: K("tool_use"),
		name: F(),
		id: F(),
		input: W(F(), R()),
		_meta: W(F(), R()).optional()
	}), j = B({
		type: K("resource"),
		resource: U([te, ne]),
		annotations: re.optional(),
		_meta: W(F(), R()).optional()
	}), me = ie.extend({ type: K("resource_link") }), he = U([
		de,
		fe,
		A,
		me,
		j
	]), ge = B({
		role: a,
		content: he
	}), _e = B({
		title: F().optional(),
		readOnlyHint: L().optional(),
		destructiveHint: L().optional(),
		idempotentHint: L().optional(),
		openWorldHint: L().optional()
	}), ve = m.extend({
		method: K("notifications/tools/list_changed"),
		params: p.optional()
	}), ye = B({ name: F().optional() }), be = B({
		hints: z(ye).optional(),
		costPriority: I().min(0).max(1).optional(),
		speedPriority: I().min(0).max(1).optional(),
		intelligencePriority: I().min(0).max(1).optional()
	}), xe = B({ mode: G([
		"auto",
		"required",
		"none"
	]).optional() }), Se = B({
		type: K("boolean"),
		title: F().optional(),
		description: F().optional(),
		default: L().optional()
	}), Ce = B({
		type: K("string"),
		title: F().optional(),
		description: F().optional(),
		minLength: I().optional(),
		maxLength: I().optional(),
		format: G([
			"email",
			"uri",
			"date",
			"date-time"
		]).optional(),
		default: F().optional()
	}), we = B({
		type: G(["number", "integer"]),
		title: F().optional(),
		description: F().optional(),
		minimum: I().optional(),
		maximum: I().optional(),
		default: I().optional()
	}), Te = B({
		type: K("string"),
		title: F().optional(),
		description: F().optional(),
		enum: z(F()),
		default: F().optional()
	}), Ee = B({
		type: K("string"),
		title: F().optional(),
		description: F().optional(),
		oneOf: z(B({
			const: F(),
			title: F()
		})),
		default: F().optional()
	}), De = B({
		type: K("string"),
		title: F().optional(),
		description: F().optional(),
		enum: z(F()),
		enumNames: z(F()).optional(),
		default: F().optional()
	}), Oe = U([Te, Ee]), ke = B({
		type: K("array"),
		title: F().optional(),
		description: F().optional(),
		minItems: I().optional(),
		maxItems: I().optional(),
		items: B({
			type: K("string"),
			enum: z(F())
		}),
		default: z(F()).optional()
	}), Ae = B({
		type: K("array"),
		title: F().optional(),
		description: F().optional(),
		minItems: I().optional(),
		maxItems: I().optional(),
		items: B({ anyOf: z(B({
			const: F(),
			title: F()
		})) }),
		default: z(F()).optional()
	}), je = U([ke, Ae]), Me = U([
		De,
		Oe,
		je
	]), Ne = U([
		Me,
		Se,
		Ce,
		we
	]), Pe = f.extend({
		mode: K("form").optional(),
		message: F(),
		requestedSchema: B({
			type: K("object"),
			properties: W(F(), Ne),
			required: z(F()).optional()
		}).catchall(R())
	}), Fe = B({
		type: K("ref/resource"),
		uri: F()
	}), Ie = B({
		type: K("ref/prompt"),
		name: F()
	}), Le = B({
		uri: F().startsWith("file://"),
		name: F().optional(),
		_meta: W(F(), R()).optional()
	}), Re = S.shape, ze = B({
		experimental: Re.experimental,
		sampling: Re.sampling,
		elicitation: Re.elicitation,
		roots: Re.roots,
		extensions: Re.extensions
	}), Be = C.shape, Ve = B({
		experimental: Be.experimental,
		logging: Be.logging,
		completions: Be.completions,
		prompts: Be.prompts,
		resources: Be.resources,
		tools: Be.tools,
		extensions: Be.extensions
	}), He = H({
		progressToken: n.optional(),
		[Fu]: F(),
		[Iu]: v.optional(),
		[Ru]: ze,
		[Bu]: o.optional()
	}), Ue = B({
		..._.shape,
		...g.shape,
		description: F().optional(),
		inputSchema: H({
			$schema: F().optional(),
			type: K("object")
		}),
		outputSchema: H({ $schema: F().optional() }).optional(),
		annotations: _e.optional(),
		_meta: W(F(), R()).optional()
	}), We = B({
		type: K("tool_result"),
		toolUseId: F(),
		content: z(he),
		structuredContent: R().optional(),
		isError: L().optional(),
		_meta: W(F(), R()).optional()
	}), Ge = U([
		de,
		fe,
		A,
		pe,
		We
	]), M = B({
		role: a,
		content: U([Ge, z(Ge)]),
		_meta: W(F(), R()).optional()
	}), Ke = F(), qe = H({ [Lu]: v.optional().catch(void 0) }), Je = qe.optional();
	function Ye(e) {
		return H({
			_meta: Je,
			resultType: Ke.default("complete"),
			...e
		});
	}
	let Xe = Ye({}), Ze = Ye({ nextCursor: r.optional() }), Qe = Ye({
		content: z(he),
		structuredContent: R().optional(),
		isError: L().optional()
	}), $e = Ye({
		ttlMs: I().int().min(0),
		cacheScope: G(["public", "private"]),
		tools: z(Ue),
		nextCursor: r.optional()
	}), et = Ye({
		ttlMs: I().int().min(0),
		cacheScope: G(["public", "private"]),
		prompts: z(le),
		nextCursor: r.optional()
	}), tt = Ye({
		description: F().optional(),
		messages: z(ge)
	}), nt = Ye({
		ttlMs: I().int().min(0),
		cacheScope: G(["public", "private"]),
		resources: z(ie),
		nextCursor: r.optional()
	}), rt = Ye({
		ttlMs: I().int().min(0),
		cacheScope: G(["public", "private"]),
		resourceTemplates: z(k),
		nextCursor: r.optional()
	}), it = Ye({
		ttlMs: I().int().min(0),
		cacheScope: G(["public", "private"]),
		contents: z(U([te, ne]))
	}), at = Ye({ completion: B({
		values: z(F()).max(100),
		total: I().int().optional(),
		hasMore: L().optional()
	}).loose() }), ot = Ye({
		ttlMs: I().int().min(0),
		cacheScope: G(["public", "private"])
	}), st = Ye({
		ttlMs: I().int().min(0).catch(0),
		cacheScope: G(["public", "private"]).catch("private"),
		supportedVersions: z(F()),
		capabilities: Ve,
		instructions: F().optional()
	}), ct = B({
		messages: z(M),
		modelPreferences: be.optional(),
		systemPrompt: F().optional(),
		includeContext: G([
			"none",
			"thisServer",
			"allServers"
		]).optional(),
		temperature: I().optional(),
		maxTokens: I().int(),
		stopSequences: z(F()).optional(),
		metadata: t.optional(),
		tools: z(Ue).optional(),
		toolChoice: xe.optional()
	}), lt = B({
		method: K("sampling/createMessage"),
		params: ct
	}), ut = B({
		method: K("roots/list"),
		params: B({ _meta: W(F(), R()).optional() }).optional()
	}), dt = B({
		...M.shape,
		model: F(),
		stopReason: F().optional()
	}), ft = B({ roots: z(Le) }), pt = B({
		action: G([
			"accept",
			"decline",
			"cancel"
		]),
		content: W(F(), U([
			F(),
			I(),
			L(),
			z(F())
		])).optional()
	}), mt = B({
		mode: K("url"),
		message: F(),
		url: F().url()
	}), ht = U([Pe, mt]), gt = B({
		method: K("elicitation/create"),
		params: ht
	}), _t = U([
		lt,
		ut,
		gt
	]), vt = U([
		dt,
		ft,
		pt
	]), yt = W(F(), _t), bt = W(F(), vt), xt = Ye({
		inputRequests: yt.optional(),
		requestState: F().optional()
	}), St = {
		inputResponses: bt.optional(),
		requestState: F().optional()
	}, Ct = B({
		_meta: He,
		...St
	}), wt = H({ progressToken: n.optional() });
	function Tt(e, t) {
		return B({
			method: K(e),
			params: B({
				_meta: He,
				...t
			})
		});
	}
	function N(e, t) {
		return B({
			method: K(e),
			params: B({
				_meta: wt.optional(),
				...t
			}).optional()
		});
	}
	let Et = {
		name: F(),
		arguments: W(F(), R()).optional(),
		...St
	}, Dt = { cursor: r.optional() }, Ot = Tt("tools/call", Et), kt = Tt("tools/list", Dt), At = Tt("prompts/list", Dt), jt = Tt("prompts/get", {
		name: F(),
		arguments: W(F(), F()).optional(),
		...St
	}), Mt = Tt("resources/list", Dt), Nt = Tt("resources/templates/list", Dt), P = Tt("resources/read", {
		uri: F(),
		...St
	}), Pt = {
		ref: U([Ie, Fe]),
		argument: B({
			name: F(),
			value: F()
		}),
		context: B({ arguments: W(F(), F()).optional() }).optional()
	}, Ft = Tt("completion/complete", Pt), It = Tt("server/discover", {}), Lt = B({
		toolsListChanged: L().optional(),
		promptsListChanged: L().optional(),
		resourcesListChanged: L().optional(),
		resourceSubscriptions: z(F()).optional()
	}), Rt = { notifications: Lt }, zt = Tt("subscriptions/listen", Rt), Bt = qe.extend({ "io.modelcontextprotocol/subscriptionId": i }), Vt = H({
		_meta: Bt,
		resultType: Ke.default("complete")
	}), Ht = {
		"tools/call": N("tools/call", Et),
		"tools/list": N("tools/list", Dt),
		"prompts/get": N("prompts/get", {
			name: F(),
			arguments: W(F(), F()).optional()
		}),
		"prompts/list": N("prompts/list", Dt),
		"resources/list": N("resources/list", Dt),
		"resources/templates/list": N("resources/templates/list", Dt),
		"resources/read": N("resources/read", { uri: F() }),
		"completion/complete": N("completion/complete", Pt),
		"server/discover": N("server/discover", {}),
		"subscriptions/listen": N("subscriptions/listen", Rt)
	};
	function Ut(e) {
		return H({
			_meta: Je,
			...e
		});
	}
	let Wt = {
		"tools/call": Ut({
			content: z(he),
			structuredContent: R().optional(),
			isError: L().optional()
		}),
		"tools/list": Ut({
			ttlMs: I().int().min(0),
			cacheScope: G(["public", "private"]),
			tools: z(Ue),
			nextCursor: r.optional()
		}),
		"prompts/get": Ut({
			description: F().optional(),
			messages: z(ge)
		}),
		"prompts/list": Ut({
			ttlMs: I().int().min(0),
			cacheScope: G(["public", "private"]),
			prompts: z(le),
			nextCursor: r.optional()
		}),
		"resources/list": Ut({
			ttlMs: I().int().min(0),
			cacheScope: G(["public", "private"]),
			resources: z(ie),
			nextCursor: r.optional()
		}),
		"resources/templates/list": Ut({
			ttlMs: I().int().min(0),
			cacheScope: G(["public", "private"]),
			resourceTemplates: z(k),
			nextCursor: r.optional()
		}),
		"resources/read": Ut({
			ttlMs: I().int().min(0),
			cacheScope: G(["public", "private"]),
			contents: z(U([te, ne]))
		}),
		"completion/complete": Ut({ completion: B({
			values: z(F()).max(100),
			total: I().int().optional(),
			hasMore: L().optional()
		}).loose() }),
		"server/discover": Ut({
			ttlMs: I().int().min(0).catch(0),
			cacheScope: G(["public", "private"]).catch("private"),
			supportedVersions: z(F()),
			capabilities: Ve,
			instructions: F().optional()
		}),
		"subscriptions/listen": Ut({})
	}, Gt = H({ "io.modelcontextprotocol/subscriptionId": i.optional() }), Kt = B({
		method: K("notifications/subscriptions/acknowledged"),
		params: B({
			_meta: Gt.optional(),
			notifications: Lt
		})
	}), qt = B({
		_meta: Gt.optional(),
		requestId: i,
		reason: F().optional()
	}), Jt = B({
		method: K("notifications/cancelled"),
		params: qt
	}), Yt = {
		"notifications/cancelled": Jt,
		"notifications/progress": E,
		"notifications/message": ee,
		"notifications/resources/updated": se,
		"notifications/resources/list_changed": ae,
		"notifications/tools/list_changed": ve,
		"notifications/prompts/list_changed": ue,
		"notifications/subscriptions/acknowledged": Kt
	}, Xt = (e) => B({
		jsonrpc: K("2.0"),
		id: U([F(), I().int()]),
		result: e
	}).strict();
	return {
		JSONValueSchema: e,
		JSONObjectSchema: t,
		ProgressTokenSchema: n,
		CursorSchema: r,
		RequestIdSchema: i,
		RoleSchema: a,
		LoggingLevelSchema: o,
		TaskMetadataSchema: c,
		RelatedTaskMetadataSchema: l,
		RequestMetaSchema: u,
		BaseRequestParamsSchema: d,
		TaskAugmentedRequestParamsSchema: f,
		NotificationsParamsSchema: p,
		NotificationSchema: m,
		IconSchema: h,
		IconsSchema: g,
		BaseMetadataSchema: _,
		ImplementationSchema: v,
		ClientTasksCapabilitySchema: b,
		ServerTasksCapabilitySchema: x,
		ClientCapabilitiesSchema: S,
		ServerCapabilitiesSchema: C,
		ProgressSchema: w,
		ProgressNotificationParamsSchema: T,
		ProgressNotificationSchema: E,
		LoggingMessageNotificationParamsSchema: D,
		LoggingMessageNotificationSchema: ee,
		ResourceContentsSchema: O,
		TextResourceContentsSchema: te,
		BlobResourceContentsSchema: ne,
		AnnotationsSchema: re,
		ResourceSchema: ie,
		ResourceTemplateSchema: k,
		ResourceListChangedNotificationSchema: ae,
		ResourceUpdatedNotificationParamsSchema: oe,
		ResourceUpdatedNotificationSchema: se,
		PromptArgumentSchema: ce,
		PromptSchema: le,
		PromptListChangedNotificationSchema: ue,
		TextContentSchema: de,
		ImageContentSchema: fe,
		AudioContentSchema: A,
		ToolUseContentSchema: pe,
		EmbeddedResourceSchema: j,
		ResourceLinkSchema: me,
		ContentBlockSchema: he,
		PromptMessageSchema: ge,
		ToolAnnotationsSchema: _e,
		ToolListChangedNotificationSchema: ve,
		ModelHintSchema: ye,
		ModelPreferencesSchema: be,
		ToolChoiceSchema: xe,
		BooleanSchemaSchema: Se,
		StringSchemaSchema: Ce,
		NumberSchemaSchema: we,
		UntitledSingleSelectEnumSchemaSchema: Te,
		TitledSingleSelectEnumSchemaSchema: Ee,
		LegacyTitledEnumSchemaSchema: De,
		SingleSelectEnumSchemaSchema: Oe,
		UntitledMultiSelectEnumSchemaSchema: ke,
		TitledMultiSelectEnumSchemaSchema: Ae,
		MultiSelectEnumSchemaSchema: je,
		EnumSchemaSchema: Me,
		PrimitiveSchemaDefinitionSchema: Ne,
		ElicitRequestFormParamsSchema: Pe,
		ResourceTemplateReferenceSchema: Fe,
		PromptReferenceSchema: Ie,
		RootSchema: Le,
		ClientCapabilities2026Schema: ze,
		ServerCapabilities2026Schema: Ve,
		RequestMetaEnvelopeSchema: He,
		ToolSchema: Ue,
		ToolResultContentSchema: We,
		SamplingMessageContentBlockSchema: Ge,
		SamplingMessageSchema: M,
		ResultTypeSchema: Ke,
		ResultMetaSchema: qe,
		ResultSchema: Xe,
		PaginatedResultSchema: Ze,
		CallToolResultSchema: Qe,
		ListToolsResultSchema: $e,
		ListPromptsResultSchema: et,
		GetPromptResultSchema: tt,
		ListResourcesResultSchema: nt,
		ListResourceTemplatesResultSchema: rt,
		ReadResourceResultSchema: it,
		CompleteResultSchema: at,
		CacheableResultSchema: ot,
		DiscoverResultSchema: st,
		CreateMessageRequestParamsSchema: ct,
		CreateMessageRequestSchema: lt,
		ListRootsRequestSchema: ut,
		CreateMessageResultSchema: dt,
		ListRootsResultSchema: ft,
		ElicitResultSchema: pt,
		ElicitRequestURLParamsSchema: mt,
		ElicitRequestParamsSchema: ht,
		ElicitRequestSchema: gt,
		InputRequestSchema: _t,
		InputResponseSchema: vt,
		InputRequestsSchema: yt,
		InputResponsesSchema: bt,
		InputRequiredResultSchema: xt,
		InputResponseRequestParamsSchema: Ct,
		CallToolRequestSchema: Ot,
		ListToolsRequestSchema: kt,
		ListPromptsRequestSchema: At,
		GetPromptRequestSchema: jt,
		ListResourcesRequestSchema: Mt,
		ListResourceTemplatesRequestSchema: Nt,
		ReadResourceRequestSchema: P,
		CompleteRequestSchema: Ft,
		DiscoverRequestSchema: It,
		SubscriptionFilterSchema: Lt,
		SubscriptionsListenRequestSchema: zt,
		SubscriptionsListenResultMetaSchema: Bt,
		SubscriptionsListenResultSchema: Vt,
		dispatchRequestSchemas: Ht,
		dispatchResultSchemas: Wt,
		NotificationMetaSchema: Gt,
		SubscriptionsAcknowledgedNotificationSchema: Kt,
		CancelledNotificationParamsSchema: qt,
		CancelledNotificationSchema: Jt,
		notificationSchemas2026: Yt,
		JSONRPCResultResponseSchema: Xt(Xe),
		CallToolResultResponseSchema: Xt(U([Qe, xt])),
		ListToolsResultResponseSchema: Xt($e),
		ListPromptsResultResponseSchema: Xt(et),
		GetPromptResultResponseSchema: Xt(U([tt, xt])),
		ListResourcesResultResponseSchema: Xt(nt),
		ListResourceTemplatesResultResponseSchema: Xt(rt),
		ReadResourceResultResponseSchema: Xt(U([it, xt])),
		CompleteResultResponseSchema: Xt(at),
		DiscoverResultResponseSchema: Xt(st),
		SubscriptionsListenResultResponseSchema: Xt(Vt)
	};
}
var Zm;
function Qm() {
	return Zm ??= Xm();
}
var $m = [
	"tools/list",
	"prompts/list",
	"resources/list",
	"resources/templates/list",
	"resources/read",
	"server/discover"
];
function eh(e) {
	return $m.includes(e);
}
var th = Symbol("modelcontextprotocol.resultCacheHintFallback");
function nh(e, t) {
	if (t === void 0) return e;
	let n = e[th];
	if (n === void 0) return {
		...e,
		[th]: t
	};
	let r = {}, i = n.ttlMs ?? t.ttlMs;
	i !== void 0 && (r.ttlMs = i);
	let a = n.cacheScope ?? t.cacheScope;
	return a !== void 0 && (r.cacheScope = a), {
		...e,
		[th]: r
	};
}
function rh(e) {
	return e[th];
}
function ih(e) {
	return typeof e == "number" && Number.isSafeInteger(e) && e >= 0;
}
function ah(e) {
	return e === "public" || e === "private";
}
function oh(e, t) {
	if (e.ttlMs !== void 0 && !ih(e.ttlMs)) throw RangeError(`Invalid cache hint for ${t}: ttlMs must be a non-negative safe integer (got ${String(e.ttlMs)})`);
	if (e.cacheScope !== void 0 && !ah(e.cacheScope)) throw RangeError(`Invalid cache hint for ${t}: cacheScope must be 'public' or 'private' (got ${String(e.cacheScope)})`);
}
var J = /* @__PURE__ */ function(e) {
	return e[e.ParseError = -32700] = "ParseError", e[e.InvalidRequest = -32600] = "InvalidRequest", e[e.MethodNotFound = -32601] = "MethodNotFound", e[e.InvalidParams = -32602] = "InvalidParams", e[e.InternalError = -32603] = "InternalError", e[e.ResourceNotFound = -32002] = "ResourceNotFound", e[e.MissingRequiredClientCapability = -32021] = "MissingRequiredClientCapability", e[e.UnsupportedProtocolVersion = -32022] = "UnsupportedProtocolVersion", e[e.UrlElicitationRequired = -32042] = "UrlElicitationRequired", e;
}({}), Y = class e extends Error {
	static {
		Object.defineProperty(this, "mcpBrand", { value: "mcp.ProtocolError" });
	}
	static [Symbol.hasInstance](e) {
		return um(this, e);
	}
	static isInstance(e) {
		if (typeof this != "function") throw TypeError("isInstance must be called on the class (e.g. `SdkError.isInstance(value)`); for callbacks use `v => SdkError.isInstance(v)`");
		return um(this, e);
	}
	constructor(e, t, n) {
		super(t), this.code = e, this.data = n, this.name = "ProtocolError", lm(this, new.target);
	}
	static fromError(t, n, r) {
		if (t === J.UrlElicitationRequired && r) {
			let e = r;
			if (e.elicitations) return new ch(e.elicitations, n);
		}
		if (t === J.UnsupportedProtocolVersion && r) {
			let e = r;
			if (Array.isArray(e.supported) && typeof e.requested == "string") return new lh({
				supported: e.supported,
				requested: e.requested
			}, n);
		}
		if (t === J.InvalidParams || t === J.ResourceNotFound) {
			let e = r;
			if (typeof e?.uri == "string" && (t === J.ResourceNotFound || Object.keys(e).length === 1)) return new sh(e.uri, n);
		}
		if (t === J.MissingRequiredClientCapability && r) {
			let e = r;
			if (e.requiredCapabilities !== null && typeof e.requiredCapabilities == "object" && !Array.isArray(e.requiredCapabilities)) return new uh({ requiredCapabilities: e.requiredCapabilities }, n);
		}
		return new e(t, n, r);
	}
}, sh = class extends Y {
	static {
		Object.defineProperty(this, "mcpBrand", { value: "mcp.ResourceNotFoundError" });
	}
	constructor(e, t = `Resource not found: ${e}`) {
		super(J.InvalidParams, t, { uri: e });
	}
	get uri() {
		return this.data.uri;
	}
}, ch = class extends Y {
	static {
		Object.defineProperty(this, "mcpBrand", { value: "mcp.UrlElicitationRequiredError" });
	}
	constructor(e, t = `URL elicitation${e.length > 1 ? "s" : ""} required`) {
		super(J.UrlElicitationRequired, t, { elicitations: e });
	}
	get elicitations() {
		return this.data?.elicitations ?? [];
	}
}, lh = class extends Y {
	static {
		Object.defineProperty(this, "mcpBrand", { value: "mcp.UnsupportedProtocolVersionError" });
	}
	constructor(e, t = `Unsupported protocol version: ${e.requested}`) {
		super(J.UnsupportedProtocolVersion, t, e);
	}
	get supported() {
		return this.data.supported;
	}
	get requested() {
		return this.data.requested;
	}
}, uh = class extends Y {
	static {
		Object.defineProperty(this, "mcpBrand", { value: "mcp.MissingRequiredClientCapabilityError" });
	}
	constructor(e, t = `Missing required client capabilities: ${Object.keys(e.requiredCapabilities).join(", ")}`) {
		super(J.MissingRequiredClientCapability, t, e);
	}
	get requiredCapabilities() {
		return this.data.requiredCapabilities;
	}
}, dh = 0, fh = "private", ph = [
	"tools/call",
	"prompts/get",
	"resources/read"
];
function mh(e, t) {
	let n = t.resultType;
	if (n === void 0) return {
		...t,
		resultType: "complete"
	};
	if (n === "complete" || ph.includes(e)) return t;
	throw new Y(J.InternalError, `Handler for ${e} returned resultType '${String(n)}', but results of ${e} only support 'complete' on protocol revision 2026-07-28`);
}
function hh(e, t) {
	let n = rh(t);
	if (t.resultType !== "complete" || !eh(e)) return n === void 0 ? t : bh(t);
	let r = t, i = ih(r.ttlMs) ? r.ttlMs : vh(n), a = ah(r.cacheScope) ? r.cacheScope : yh(n), o = {
		...r,
		ttlMs: i,
		cacheScope: a
	};
	return delete o[th], o;
}
function gh(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function _h(e, t) {
	if (t === void 0) return e;
	let n = e._meta;
	return n === void 0 ? {
		...e,
		_meta: { [Lu]: t }
	} : !gh(n) || n["io.modelcontextprotocol/serverInfo"] !== void 0 ? e : {
		...e,
		_meta: {
			...n,
			[Lu]: t
		}
	};
}
function vh(e) {
	return e !== void 0 && ih(e.ttlMs) ? e.ttlMs : dh;
}
function yh(e) {
	return e !== void 0 && ah(e.cacheScope) ? e.cacheScope : fh;
}
function bh(e) {
	let t = { ...e };
	return delete t[th], t;
}
var xh = [
	"elicitation/create",
	"sampling/createMessage",
	"roots/list"
], Sh;
function Ch() {
	if (Sh) return Sh;
	let e = Qm();
	return Sh = {
		request: {
			"elicitation/create": B({
				method: K("elicitation/create"),
				params: e.ElicitRequestParamsSchema
			}),
			"sampling/createMessage": B({
				method: K("sampling/createMessage"),
				params: e.CreateMessageRequestParamsSchema
			}),
			"roots/list": B({
				method: K("roots/list"),
				params: H({}).optional()
			})
		},
		response: {
			"elicitation/create": e.ElicitResultSchema,
			"sampling/createMessage": e.CreateMessageResultSchema,
			"roots/list": e.ListRootsResultSchema
		}
	}, Sh;
}
function wh(e) {
	return xh.includes(e);
}
function Th(e) {
	return wh(e) ? Ch().request[e] : void 0;
}
function Eh(e) {
	return wh(e) ? Ch().response[e] : void 0;
}
var Dh = {
	"tools/call": null,
	"tools/list": null,
	"prompts/get": null,
	"prompts/list": null,
	"resources/list": null,
	"resources/templates/list": null,
	"resources/read": null,
	"completion/complete": null,
	"server/discover": null,
	"subscriptions/listen": null
}, Oh = {
	"notifications/cancelled": null,
	"notifications/progress": null,
	"notifications/message": null,
	"notifications/resources/updated": null,
	"notifications/resources/list_changed": null,
	"notifications/tools/list_changed": null,
	"notifications/prompts/list_changed": null,
	"notifications/subscriptions/acknowledged": null
};
function kh(e) {
	return Object.prototype.hasOwnProperty.call(Dh, e);
}
function Ah(e) {
	return Object.prototype.hasOwnProperty.call(Oh, e);
}
function jh(e) {
	return Object.prototype.hasOwnProperty.call(Dh, e);
}
function Mh(e) {
	return kh(e) ? Qm().dispatchRequestSchemas[e] : void 0;
}
function Nh(e) {
	return jh(e) ? Qm().dispatchResultSchemas[e] : void 0;
}
function Ph(e) {
	return Ah(e) ? Qm().notificationSchemas2026[e] : void 0;
}
Object.keys(Dh), Object.keys(Oh);
function Fh(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Ih(e, t) {
	if (e === void 0) return {
		ok: !1,
		reason: "not-in-era"
	};
	let n = e.safeParse(t);
	return n.success ? {
		ok: !0,
		value: n.data
	} : {
		ok: !1,
		reason: "invalid",
		message: String(n.error)
	};
}
var Lh = {
	ok: !1,
	reason: "not-in-era"
}, Rh = [Fu, Ru];
function zh(e, t) {
	let n = t, r = !1, i = () => (r ||= (n = { ...n }, !0), n), a = t.tools;
	e === "tools/list" && Array.isArray(a) && a.some((e) => Fh(e) && "execution" in e) && (i().tools = a.map((e) => {
		if (!Fh(e) || !("execution" in e)) return e;
		let t = { ...e };
		return delete t.execution, t;
	}));
	let o = t.capabilities;
	if (Fh(o) && "tasks" in o) {
		let e = { ...o };
		delete e.tasks, i().capabilities = e;
	}
	return n;
}
var Bh = {
	era: "2026-07-28",
	hasRequestMethod: kh,
	hasNotificationMethod: Ah,
	hasInputRequestMethod: (e) => Th(e) !== void 0,
	validateRequest: (e, t) => Ih(Mh(e), t),
	validateResult: (e, t) => Ih(Nh(e), t),
	validateNotification: (e, t) => Ih(Ph(e), t),
	validateInputRequest: (e, t) => Ih(Th(e), t),
	validateInputResponse: (e, t) => Ih(Eh(e), t),
	samplingResultVariant: () => Lh,
	outboundEnvelope(e) {
		return {
			[Fu]: e.protocolVersion,
			[Iu]: e.clientInfo,
			[Ru]: e.clientCapabilities,
			...e.logLevel !== void 0 && { "io.modelcontextprotocol/logLevel": e.logLevel }
		};
	},
	validateEnvelopeMeta(e) {
		let t = [];
		for (let n of Rh) n in e || t.push({
			key: n,
			problem: "missing"
		});
		let n = Qm().RequestMetaEnvelopeSchema.safeParse(e);
		if (!n.success) for (let e of n.error.issues) {
			let n = e.path.map(String), r = n.length > 0 ? n.join(".") : "_meta";
			n.length === 1 && t.some((e) => e.key === r && e.problem === "missing") || t.push({
				key: r,
				problem: e.message
			});
		}
		return t;
	},
	projectCallToolResult: (e) => Sm(e),
	inputRequestSchema: Th,
	decodeResult(e, t) {
		if (!Fh(t)) return {
			kind: "invalid",
			error: new fm(dm.InvalidResult, `Invalid result for ${e}: not an object`, { method: e })
		};
		let n = t.resultType;
		if (n === void 0) return {
			kind: "invalid",
			error: new fm(dm.InvalidResult, `Invalid result for ${e}: missing required resultType — servers implementing protocol revision 2026-07-28 MUST include it (the absent-means-complete bridge applies only to earlier-revision servers)`, {
				method: e,
				violation: "missing-resultType"
			})
		};
		if (typeof n != "string") return {
			kind: "invalid",
			error: new fm(dm.InvalidResult, `Invalid result for ${e}: non-string resultType`, {
				method: e,
				resultType: n
			})
		};
		if (n === "input_required") {
			let n = t.inputRequests, r = Fh(n) ? n : {}, i = t.requestState, a = t._meta === void 0 ? void 0 : Qm().ResultMetaSchema.safeParse(t._meta), o = a?.success ? a.data : void 0;
			return Object.keys(r).length === 0 && typeof i != "string" ? {
				kind: "invalid",
				error: new fm(dm.InvalidResult, `Invalid result for ${e}: input_required carries neither inputRequests nor requestState (every input_required result must include at least one of the two)`, {
					method: e,
					violation: "input-required-missing-both"
				})
			} : {
				kind: "input_required",
				inputRequests: r,
				...typeof i == "string" && { requestState: i },
				...o !== void 0 && { _meta: o }
			};
		}
		if (n !== "complete") return {
			kind: "invalid",
			error: new fm(dm.UnsupportedResultType, `Unsupported result type '${n}' for ${e}`, {
				resultType: n,
				method: e
			})
		};
		let r = Hh(), i = Object.hasOwn(r, e) ? r[e] : void 0;
		if (i !== void 0) {
			let n = i.safeParse(t);
			if (!n.success) return {
				kind: "invalid",
				error: new fm(dm.InvalidResult, `Invalid result for ${e}: ${n.error}`, { method: e })
			};
		}
		let a = { ...t };
		return delete a.resultType, {
			kind: "complete",
			result: a
		};
	},
	encodeResult(e, t, n) {
		return _h(hh(e, mh(e, zh(e, t))), n);
	},
	encodeErrorCode: (e) => e === -32002 ? -32602 : e,
	checkInboundEnvelope(e) {
		if (e.envelope === void 0) return "Request is missing the required _meta envelope for protocol revision 2026-07-28 (io.modelcontextprotocol/protocolVersion, io.modelcontextprotocol/clientCapabilities)";
		let t = Qm().RequestMetaEnvelopeSchema.safeParse(e.envelope);
		if (!t.success) return `Invalid _meta envelope for protocol revision 2026-07-28: ${t.error.issues.map((e) => e.message).join("; ")}`;
	}
}, Vh;
function Hh() {
	if (Vh) return Vh;
	let e = Qm();
	return Vh = {
		"tools/call": e.CallToolResultSchema,
		"tools/list": e.ListToolsResultSchema,
		"prompts/get": e.GetPromptResultSchema,
		"prompts/list": e.ListPromptsResultSchema,
		"resources/list": e.ListResourcesResultSchema,
		"resources/templates/list": e.ListResourceTemplatesResultSchema,
		"resources/read": e.ReadResourceResultSchema,
		"completion/complete": e.CompleteResultSchema,
		"server/discover": e.DiscoverResultSchema
	}, Vh;
}
var Uh = "2026-07-28";
function Wh(e) {
	return e !== void 0 && ym(e) ? Bh : Ym;
}
function Gh(e) {
	return e.revision === void 0 ? e.era === "modern" ? Bh.era : Ym.era : Wh(e.revision).era;
}
function Kh(e) {
	return Yh.some((t) => t.hasRequestMethod(e));
}
function qh(e) {
	return Yh.some((t) => t.hasNotificationMethod(e));
}
function Jh(e) {
	return e === "tasks/get" || e === "tasks/cancel";
}
var Yh = [Ym, Bh];
function Xh(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Zh(e) {
	if (!Xh(e)) return;
	let t = e._meta;
	return Xh(t) ? t : void 0;
}
function Qh(e) {
	let t = Zh(e);
	return t !== void 0 && "io.modelcontextprotocol/protocolVersion" in t;
}
function $h(e) {
	let t = Zh(e)?.[Fu];
	return typeof t == "string" ? t : void 0;
}
function eg(e) {
	return Wh(Uh).validateEnvelopeMeta(e);
}
var tg = /* @__PURE__ */ Au({
	AnnotationsSchema: () => zd,
	AudioContentSchema: () => yf,
	BaseMetadataSchema: () => md,
	BaseRequestParamsSchema: () => Yu,
	BlobResourceContentsSchema: () => Ld,
	BooleanSchemaSchema: () => ep,
	CallToolRequestParamsSchema: () => Pf,
	CallToolRequestSchema: () => Ff,
	CallToolResultSchema: () => Mf,
	CancelTaskRequestSchema: () => Bp,
	CancelTaskResultSchema: () => Vp,
	CancelledNotificationParamsSchema: () => ud,
	CancelledNotificationSchema: () => dd,
	ClientCapabilitiesSchema: () => yd,
	ClientNotificationSchema: () => Up,
	ClientRequestSchema: () => Hp,
	ClientResultSchema: () => Wp,
	ClientTasksCapabilitySchema: () => _d,
	CompatibilityCallToolResultSchema: () => Nf,
	CompleteRequestParamsSchema: () => xp,
	CompleteRequestSchema: () => Sp,
	CompleteResultSchema: () => Cp,
	ContentBlockSchema: () => Cf,
	CreateMessageRequestParamsSchema: () => Xf,
	CreateMessageRequestSchema: () => Zf,
	CreateMessageResultSchema: () => Qf,
	CreateMessageResultWithToolsSchema: () => $f,
	CreateTaskResultSchema: () => jp,
	CursorSchema: () => Gu,
	DiscoverRequestSchema: () => Td,
	DiscoverResultSchema: () => Ed,
	ElicitRequestFormParamsSchema: () => fp,
	ElicitRequestParamsSchema: () => mp,
	ElicitRequestSchema: () => hp,
	ElicitRequestURLParamsSchema: () => pp,
	ElicitResultSchema: () => vp,
	ElicitationCompleteNotificationParamsSchema: () => gp,
	ElicitationCompleteNotificationSchema: () => _p,
	EmbeddedResourceSchema: () => xf,
	EmptyResultSchema: () => ld,
	EnumSchemaSchema: () => up,
	GetPromptRequestParamsSchema: () => hf,
	GetPromptRequestSchema: () => gf,
	GetPromptResultSchema: () => Tf,
	GetTaskPayloadRequestSchema: () => Ip,
	GetTaskPayloadResultSchema: () => Lp,
	GetTaskRequestSchema: () => Pp,
	GetTaskResultSchema: () => Fp,
	IconSchema: () => fd,
	IconsSchema: () => pd,
	ImageContentSchema: () => vf,
	ImplementationSchema: () => hd,
	InitializeRequestParamsSchema: () => bd,
	InitializeRequestSchema: () => xd,
	InitializeResultSchema: () => Cd,
	InitializedNotificationSchema: () => wd,
	JSONArraySchema: () => Uu,
	JSONObjectSchema: () => Hu,
	JSONRPCErrorResponseSchema: () => od,
	JSONRPCMessageSchema: () => sd,
	JSONRPCNotificationSchema: () => id,
	JSONRPCRequestSchema: () => rd,
	JSONRPCResponseSchema: () => cd,
	JSONRPCResultResponseSchema: () => ad,
	JSONValueSchema: () => Vu,
	LegacyTitledEnumSchemaSchema: () => ap,
	ListChangedOptionsBaseSchema: () => Lf,
	ListPromptsRequestSchema: () => pf,
	ListPromptsResultSchema: () => mf,
	ListResourceTemplatesRequestSchema: () => Wd,
	ListResourceTemplatesResultSchema: () => Gd,
	ListResourcesRequestSchema: () => Hd,
	ListResourcesResultSchema: () => Ud,
	ListRootsRequestSchema: () => Tp,
	ListRootsResultSchema: () => Ep,
	ListTasksRequestSchema: () => Rp,
	ListTasksResultSchema: () => zp,
	ListToolsRequestSchema: () => Af,
	ListToolsResultSchema: () => jf,
	LoggingLevelSchema: () => Rf,
	LoggingMessageNotificationParamsSchema: () => Vf,
	LoggingMessageNotificationSchema: () => Hf,
	ModelHintSchema: () => Uf,
	ModelPreferencesSchema: () => Wf,
	MultiSelectEnumSchemaSchema: () => lp,
	NotificationSchema: () => $u,
	NotificationsParamsSchema: () => Qu,
	NumberSchemaSchema: () => np,
	PaginatedRequestParamsSchema: () => jd,
	PaginatedRequestSchema: () => Md,
	PaginatedResultSchema: () => Nd,
	PingRequestSchema: () => Dd,
	PrimitiveSchemaDefinitionSchema: () => dp,
	ProgressNotificationParamsSchema: () => kd,
	ProgressNotificationSchema: () => Ad,
	ProgressSchema: () => Od,
	ProgressTokenSchema: () => Wu,
	PromptArgumentSchema: () => df,
	PromptListChangedNotificationSchema: () => Ef,
	PromptMessageSchema: () => wf,
	PromptReferenceSchema: () => bp,
	PromptSchema: () => ff,
	ReadResourceRequestParamsSchema: () => qd,
	ReadResourceRequestSchema: () => Jd,
	ReadResourceResultSchema: () => Yd,
	RelatedTaskMetadataSchema: () => qu,
	RequestIdSchema: () => nd,
	RequestMetaSchema: () => Ju,
	RequestSchema: () => Zu,
	ResourceContentsSchema: () => Pd,
	ResourceLinkSchema: () => Sf,
	ResourceListChangedNotificationSchema: () => Xd,
	ResourceRequestParamsSchema: () => Kd,
	ResourceSchema: () => Bd,
	ResourceTemplateReferenceSchema: () => yp,
	ResourceTemplateSchema: () => Vd,
	ResourceUpdatedNotificationParamsSchema: () => lf,
	ResourceUpdatedNotificationSchema: () => uf,
	ResultMetaObjectSchema: () => ed,
	ResultSchema: () => td,
	RoleSchema: () => Rd,
	RootSchema: () => wp,
	RootsListChangedNotificationSchema: () => Dp,
	SamplingContentSchema: () => qf,
	SamplingMessageContentBlockSchema: () => Jf,
	SamplingMessageSchema: () => Yf,
	ServerCapabilitiesSchema: () => Sd,
	ServerNotificationSchema: () => Kp,
	ServerRequestSchema: () => Gp,
	ServerResultSchema: () => qp,
	ServerTasksCapabilitySchema: () => vd,
	SetLevelRequestParamsSchema: () => zf,
	SetLevelRequestSchema: () => Bf,
	SingleSelectEnumSchemaSchema: () => op,
	StringSchemaSchema: () => tp,
	SubscribeRequestParamsSchema: () => Zd,
	SubscribeRequestSchema: () => Qd,
	SubscriptionFilterSchema: () => tf,
	SubscriptionsAcknowledgedNotificationParamsSchema: () => af,
	SubscriptionsAcknowledgedNotificationSchema: () => of,
	SubscriptionsListenRequestParamsSchema: () => nf,
	SubscriptionsListenRequestSchema: () => rf,
	SubscriptionsListenResultMetaSchema: () => sf,
	SubscriptionsListenResultSchema: () => cf,
	TaskAugmentedRequestParamsSchema: () => Xu,
	TaskCreationParamsSchema: () => Op,
	TaskMetadataSchema: () => Ku,
	TaskSchema: () => Ap,
	TaskStatusNotificationParamsSchema: () => Mp,
	TaskStatusNotificationSchema: () => Np,
	TaskStatusSchema: () => kp,
	TextContentSchema: () => _f,
	TextResourceContentsSchema: () => Fd,
	TitledMultiSelectEnumSchemaSchema: () => cp,
	TitledSingleSelectEnumSchemaSchema: () => ip,
	ToolAnnotationsSchema: () => Df,
	ToolChoiceSchema: () => Gf,
	ToolExecutionSchema: () => Of,
	ToolListChangedNotificationSchema: () => If,
	ToolResultContentSchema: () => Kf,
	ToolSchema: () => kf,
	ToolUseContentSchema: () => bf,
	UnsubscribeRequestParamsSchema: () => $d,
	UnsubscribeRequestSchema: () => ef,
	UntitledMultiSelectEnumSchemaSchema: () => sp,
	UntitledSingleSelectEnumSchemaSchema: () => rp
}), ng = (e) => rd.safeParse(e).success, rg = (e) => id.safeParse(e).success, ig = (e) => ad.safeParse(e).success, ag = (e) => od.safeParse(e).success, og = (e) => typeof e == "object" && !!e && !Array.isArray(e) && e.resultType === "input_required";
function sg(e) {
	if (e.params.ref.type !== "ref/prompt") throw TypeError(`Expected CompleteRequestPrompt, but got ${e.params.ref.type}`);
}
function cg(e) {
	if (e.params.ref.type !== "ref/resource") throw TypeError(`Expected CompleteRequestResourceTemplate, but got ${e.params.ref.type}`);
}
var lg = "x-mcp-header", ug = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/, dg = /* @__PURE__ */ new Set([
	"string",
	"integer",
	"boolean"
]);
function fg(e) {
	let t = [], n = /* @__PURE__ */ new Map(), r, i = (e, a, o) => {
		if (typeof e != "object" || !e) return;
		let s = e;
		if (lg in s) {
			if (!o || a.length === 0) return `${hg(a)}: x-mcp-header is only permitted on properties statically reachable via a chain of 'properties' keys (not under items, additionalProperties, oneOf/anyOf/allOf/not, if/then/else, or $ref)`;
			let e = s[lg];
			if (typeof e != "string" || e.length === 0) return `${hg(a)}: x-mcp-header MUST be a non-empty string`;
			if (!ug.test(e)) return `${hg(a)}: x-mcp-header '${e}' is not a valid RFC 9110 token (no spaces, control characters or HTTP delimiters)`;
			let i = typeof s.type == "string" ? s.type : void 0;
			if (i === void 0 || !dg.has(i)) {
				let e = `${hg(a)}: x-mcp-header is only permitted on primitive-typed properties (string, integer, boolean); got ${i ?? "<none>"}`;
				if (i !== "number") return e;
				r ??= e;
			}
			let c = e.toLowerCase(), l = n.get(c);
			if (l !== void 0) return `x-mcp-header '${e}' is not case-insensitively unique (also declared as '${l}')`;
			n.set(c, e), t.push({
				path: a,
				headerName: e,
				type: i
			});
		}
		let c = s.properties;
		if (typeof c == "object" && c) for (let [e, t] of Object.entries(c)) {
			let n = i(t, [...a, e], o);
			if (n !== void 0) return n;
		}
		for (let e of pg) {
			let t = s[e];
			if (t === void 0) continue;
			let n = Array.isArray(t) ? t : typeof t == "object" && t && mg.has(e) ? Object.values(t) : [t];
			for (let t of n) {
				let n = i(t, [...a, `<${e}>`], !1);
				if (n !== void 0) return n;
			}
		}
	}, a = i(e, [], !0);
	return a === void 0 ? r === void 0 ? {
		valid: !0,
		declarations: t
	} : {
		valid: !1,
		reason: r,
		declarations: t
	} : {
		valid: !1,
		reason: r ?? a
	};
}
var pg = [
	"items",
	"prefixItems",
	"contains",
	"additionalProperties",
	"unevaluatedProperties",
	"unevaluatedItems",
	"propertyNames",
	"patternProperties",
	"dependentSchemas",
	"oneOf",
	"anyOf",
	"allOf",
	"not",
	"if",
	"then",
	"else",
	"$defs",
	"definitions"
], mg = /* @__PURE__ */ new Set([
	"patternProperties",
	"dependentSchemas",
	"$defs",
	"definitions"
]);
function hg(e) {
	return e.length === 0 ? "<root>" : e.join(".");
}
var gg = -32020;
J.InvalidRequest, J.UnsupportedProtocolVersion, J.InvalidParams, J.MethodNotFound, J.InvalidParams, J.MissingRequiredClientCapability;
var _g = {
	[J.ParseError]: 400,
	[J.InvalidRequest]: 400,
	[J.MethodNotFound]: 404,
	[J.UnsupportedProtocolVersion]: 400,
	[J.MissingRequiredClientCapability]: 400,
	[gg]: 400
};
function vg(e, t, n, r, i) {
	return {
		kind: "reject",
		rung: e,
		cell: t,
		httpStatus: n,
		code: r.code,
		message: r.message,
		...r.data !== void 0 && { data: r.data },
		settled: i
	};
}
function yg(e) {
	if (!Qh(e)) return !1;
	let t = $h(e);
	if (t === void 0 || !ym(t)) return !1;
	let n = Zh(e);
	return n !== void 0 && eg(n).length === 0;
}
function bg(e, t) {
	switch (e.reason) {
		case "http-method": return vg("http-method", "modern-only-method-not-allowed", 405, new Y(-32e3, "Method not allowed."), !0);
		case "batch": return vg("jsonrpc-shape", "modern-only-batch-not-supported", 400, new Y(J.InvalidRequest, "Bad Request: JSON-RPC batches are not supported by this endpoint"), !0);
		case "response": return vg("jsonrpc-shape", "modern-only-response-post", 400, new Y(J.InvalidRequest, "Bad Request: JSON-RPC responses cannot be posted to this endpoint"), !0);
		case "notification": return;
		case "initialize":
		case "no-claim": {
			let n = e.requestedVersion;
			return vg("era-classification", "modern-only-missing-envelope", 400, n === void 0 ? new Y(J.UnsupportedProtocolVersion, "Unsupported protocol version: the request did not name a protocol version", { supported: [...t] }) : new lh({
				supported: [...t],
				requested: n
			}), !0);
		}
	}
}
function xg(e, t) {
	return ac(e, t);
}
function Sg(e) {
	return new Set(e.flatMap((e) => Object.keys(e.shape)));
}
function Cg(e) {
	if (e == null) return !1;
	let t = typeof e;
	return t !== "object" && t !== "function" || !("~standard" in e) ? !1 : typeof e["~standard"]?.validate == "function";
}
var wg = !1, Tg = "draft-2020-12";
function Eg(e, t = "input") {
	let n = e["~standard"], r;
	if (n.jsonSchema) r = n.jsonSchema[t]({ target: Tg });
	else if (n.vendor === "zod") {
		if (!("_zod" in e)) throw Error("Schema appears to be from zod 3, which the SDK cannot convert to JSON Schema. Upgrade to zod >=4.2.0, or wrap your JSON Schema with fromJsonSchema().");
		wg || (wg = !0, console.warn("[mcp-sdk] Your zod version does not implement `~standard.jsonSchema` (added in zod 4.2.0). Falling back to z.toJSONSchema(). Upgrade to zod >=4.2.0 to silence this warning.")), r = $s(e, {
			target: Tg,
			io: t
		});
	} else throw Error(`Schema library "${n.vendor}" does not implement StandardJSONSchemaV1 (\`~standard.jsonSchema\`). Upgrade to a version that does, or wrap your JSON Schema with fromJsonSchema().`);
	if (t === "output") return r.type === void 0 && Og(r) ? {
		type: "object",
		...r
	} : r;
	if (r.type !== void 0 && r.type !== "object") throw Error(`MCP tool and prompt schemas must describe objects (got type: ${JSON.stringify(r.type)}). Wrap your schema in z.object({...}) or equivalent.`);
	return {
		type: "object",
		...r
	};
}
var Dg = /^#\/(\$defs|definitions)\/([^/~%]+)$/;
function Og(e, t = e) {
	if ("properties" in e || "patternProperties" in e || "additionalProperties" in e || "required" in e) return !0;
	let n = typeof e.$ref == "string" && Dg.exec(e.$ref);
	if (n && t[n[1]]?.[n[2]]?.type === "object") return !0;
	for (let n of [
		"oneOf",
		"anyOf",
		"allOf"
	]) {
		let r = e[n];
		if (Array.isArray(r) && r.length > 0) return r.every((e) => typeof e == "object" && !!e && (e.type === "object" || Og(e, "$id" in e ? {} : t)));
	}
	return !1;
}
function kg(e) {
	return e.path?.length ? `${e.path.map((e) => String(typeof e == "object" ? e.key : e)).join(".")}: ${e.message}` : e.message;
}
async function Ag(e, t) {
	let n = await e["~standard"].validate(t);
	return n.issues && n.issues.length > 0 ? {
		success: !1,
		error: n.issues.map((e) => kg(e)).join(", ")
	} : {
		success: !0,
		data: n.value
	};
}
function jg(e) {
	let t = $s(e, {
		target: Tg,
		io: "input"
	});
	return typeof t.pattern == "string" ? t.pattern : void 0;
}
var Mg = /\\\.\\d\{(\d+)\}/;
function Ng(e) {
	let t = Mg.exec(e), n = [
		void 0,
		-1,
		0
	];
	return t && n.push(Number(t[1])), [!1, !0].flatMap((e) => [!1, !0].flatMap((t) => n.map((n) => Wl({
		local: e,
		offset: t,
		precision: n
	}))));
}
function Pg(e, t) {
	let n;
	switch (e) {
		case "email":
			n = [Ec()];
			break;
		case "uri":
			n = [jc()];
			break;
		case "date":
			n = [Gl()];
			break;
		case "date-time": n = Ng(t);
	}
	return new Set(n.map((e) => jg(e)).filter((e) => e !== void 0));
}
function Fg(e, t, n) {
	return n !== "zod" || Pg(e, t).has(t);
}
function Ig(e) {
	let t = Eg(e, "input"), n = t.properties || {}, r = t.required || [];
	return Object.entries(n).map(([e, t]) => ({
		name: e,
		description: t?.description,
		required: r.includes(e)
	}));
}
function Lg(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Rg(e) {
	try {
		return Eg(e, "input");
	} catch (e) {
		let t = e instanceof Error ? e.message : String(e);
		throw new Y(J.InvalidParams, `Elicitation requestedSchema must describe an object with flat primitive properties: ${t}`);
	}
}
var zg = /* @__PURE__ */ new Set([
	"$comment",
	"deprecated",
	"description",
	"examples",
	"readOnly",
	"title",
	"writeOnly"
]);
function Bg(e) {
	return zg.has(e) || e.startsWith("x-");
}
var Vg = /* @__PURE__ */ new Set(["$schema", ...Object.keys(fp.shape.requestedSchema.shape)]), Hg = {
	string: Sg([
		tp,
		rp,
		ip,
		ap
	]),
	number: Sg([np]),
	integer: Sg([np]),
	boolean: Sg([ep]),
	array: Sg([sp, cp])
}, Ug = new Set(tp.shape.format.unwrap().options);
function Wg(e, t, n, r) {
	if (!Lg(e)) return e;
	let i = typeof e.type == "string" && Object.hasOwn(Hg, e.type) ? Hg[e.type] : void 0;
	if (i === void 0) return e;
	let a = {};
	for (let [o, s] of Object.entries(e)) i.has(o) || Bg(o) ? a[o] = s : o === "pattern" && e.type === "string" && typeof e.format == "string" ? Ug.has(e.format) ? typeof s == "string" && Fg(e.format, s, n) || r.push(`${t}.${o}`) : a[o] = s : r.push(`${t}.${o}`);
	return a;
}
function Gg(e, t) {
	let n = {}, r = [];
	for (let [i, a] of Object.entries(e)) i === "properties" && Lg(a) ? n[i] = Object.fromEntries(Object.entries(a).map(([e, n]) => [e, Wg(n, `properties.${e}`, t, r)])) : Vg.has(i) ? n[i] = a : Bg(i) || r.push(i);
	if (r.length > 0) throw new Y(J.InvalidParams, `Elicitation requestedSchema contains unsupported JSON Schema constraint(s) after Standard Schema conversion: ${r.join(", ")}`);
	return n;
}
function Kg(e, t) {
	if (!Lg(e.properties)) return t;
	let n = Object.entries(e.properties).filter(([, e]) => !xg(dp, e).success).map(([e]) => `properties.${e}`);
	return n.length > 0 ? n.join(", ") : t;
}
function qg(e, t, n = "") {
	return Array.isArray(e) && Array.isArray(t) ? e.flatMap((e, r) => qg(e, t[r], `${n}[${r}]`)) : !Lg(e) || !Lg(t) ? [] : Object.entries(e).flatMap(([e, r]) => {
		let i = n ? `${n}.${e}` : e;
		return Object.prototype.hasOwnProperty.call(t, e) ? qg(r, t[e], i) : Bg(e) ? [] : [i];
	});
}
function Jg(e) {
	if (!Cg(e.requestedSchema)) return {
		...e,
		mode: "form",
		requestedSchema: e.requestedSchema
	};
	let t = e.requestedSchema["~standard"].vendor, n = Gg(Rg(e.requestedSchema), t), r = xg(fp.shape.requestedSchema, n);
	if (!r.success) throw new Y(J.InvalidParams, `Elicitation requestedSchema only supports flat primitive properties (string, number, integer, boolean, and string enums): ${Kg(n, r.error.message)}`);
	let i = qg(n, r.data);
	if (i.length > 0) throw new Y(J.InvalidParams, `Elicitation requestedSchema contains unsupported JSON Schema constraint(s) after Standard Schema conversion: ${i.join(", ")}`);
	let a = (r.data.required ?? []).filter((e) => !Object.prototype.hasOwnProperty.call(r.data.properties, e));
	if (a.length > 0) throw new Y(J.InvalidParams, `Elicitation requestedSchema lists required properties that are not defined in properties: ${a.join(", ")}`);
	return {
		...e,
		mode: "form",
		requestedSchema: r.data
	};
}
function Yg(e) {
	let t = e.inputRequests !== void 0 && Object.keys(e.inputRequests).length > 0, n = typeof e.requestState == "string";
	if (!t && !n) throw TypeError("inputRequired() requires at least one of inputRequests (with at least one entry) or requestState (spec: every InputRequiredResult MUST include at least one of the two)");
	return {
		resultType: "input_required",
		...e.inputRequests !== void 0 && { inputRequests: e.inputRequests },
		...e.requestState !== void 0 && { requestState: e.requestState }
	};
}
Object.assign(Yg, {
	elicit(e) {
		try {
			return {
				method: "elicitation/create",
				params: Jg(e)
			};
		} catch (e) {
			throw e instanceof Y ? TypeError(e.message, { cause: e }) : e;
		}
	},
	elicitUrl(e) {
		return {
			method: "elicitation/create",
			params: {
				...e,
				mode: "url"
			}
		};
	},
	createMessage(e) {
		return {
			method: "sampling/createMessage",
			params: e
		};
	},
	listRoots() {
		return { method: "roots/list" };
	}
});
function Xg(e, t) {
	return `Multi-round-trip request '${e}' still required input after ${t} rounds (inputRequired.maxRounds)`;
}
function Zg(e, t) {
	return new Promise((n, r) => {
		if (t?.aborted) {
			r(t.reason instanceof fm ? t.reason : new fm(dm.RequestTimeout, String(t.reason)));
			return;
		}
		let i = setTimeout(() => {
			t?.removeEventListener("abort", a), n();
		}, e), a = () => {
			clearTimeout(i), r(t?.reason instanceof fm ? t.reason : new fm(dm.RequestTimeout, String(t?.reason)));
		};
		t?.addEventListener("abort", a, { once: !0 });
	});
}
function Qg(e) {
	let t = new AbortController(), n = () => t.abort(e?.reason);
	return e?.addEventListener("abort", n, { once: !0 }), e?.aborted && t.abort(e.reason), {
		signal: t.signal,
		abort: (e) => t.abort(e),
		dispose: () => e?.removeEventListener("abort", n)
	};
}
var $g = /* @__PURE__ */ "AnnotationsSchema.AudioContentSchema.BaseMetadataSchema.BlobResourceContentsSchema.BooleanSchemaSchema.CallToolRequestSchema.CallToolRequestParamsSchema.CallToolResultSchema.CancelledNotificationSchema.CancelledNotificationParamsSchema.CancelTaskRequestSchema.CancelTaskResultSchema.ClientCapabilitiesSchema.ClientNotificationSchema.ClientRequestSchema.ClientResultSchema.CompatibilityCallToolResultSchema.CompleteRequestSchema.CompleteRequestParamsSchema.CompleteResultSchema.ContentBlockSchema.CreateMessageRequestSchema.CreateMessageRequestParamsSchema.CreateMessageResultSchema.CreateMessageResultWithToolsSchema.CreateTaskResultSchema.CursorSchema.DiscoverRequestSchema.DiscoverResultSchema.ElicitationCompleteNotificationSchema.ElicitationCompleteNotificationParamsSchema.ElicitRequestSchema.ElicitRequestFormParamsSchema.ElicitRequestParamsSchema.ElicitRequestURLParamsSchema.ElicitResultSchema.EmbeddedResourceSchema.EmptyResultSchema.EnumSchemaSchema.GetPromptRequestSchema.GetPromptRequestParamsSchema.GetPromptResultSchema.GetTaskPayloadRequestSchema.GetTaskPayloadResultSchema.GetTaskRequestSchema.GetTaskResultSchema.IconSchema.IconsSchema.ImageContentSchema.ImplementationSchema.InitializedNotificationSchema.InitializeRequestSchema.InitializeRequestParamsSchema.InitializeResultSchema.JSONArraySchema.JSONObjectSchema.JSONRPCErrorResponseSchema.JSONRPCMessageSchema.JSONRPCNotificationSchema.JSONRPCRequestSchema.JSONRPCResponseSchema.JSONRPCResultResponseSchema.JSONValueSchema.LegacyTitledEnumSchemaSchema.ListPromptsRequestSchema.ListPromptsResultSchema.ListResourcesRequestSchema.ListResourcesResultSchema.ListResourceTemplatesRequestSchema.ListResourceTemplatesResultSchema.ListRootsRequestSchema.ListRootsResultSchema.ListTasksRequestSchema.ListTasksResultSchema.ListToolsRequestSchema.ListToolsResultSchema.LoggingLevelSchema.LoggingMessageNotificationSchema.LoggingMessageNotificationParamsSchema.ModelHintSchema.ModelPreferencesSchema.MultiSelectEnumSchemaSchema.NotificationSchema.NumberSchemaSchema.PaginatedRequestSchema.PaginatedRequestParamsSchema.PaginatedResultSchema.PingRequestSchema.PrimitiveSchemaDefinitionSchema.ProgressSchema.ProgressNotificationSchema.ProgressNotificationParamsSchema.ProgressTokenSchema.PromptSchema.PromptArgumentSchema.PromptListChangedNotificationSchema.PromptMessageSchema.PromptReferenceSchema.ReadResourceRequestSchema.ReadResourceRequestParamsSchema.ReadResourceResultSchema.RelatedTaskMetadataSchema.RequestSchema.RequestIdSchema.RequestMetaSchema.ResourceSchema.ResourceContentsSchema.ResourceLinkSchema.ResourceListChangedNotificationSchema.ResourceRequestParamsSchema.ResourceTemplateSchema.ResourceTemplateReferenceSchema.ResourceUpdatedNotificationSchema.ResourceUpdatedNotificationParamsSchema.ResultMetaObjectSchema.ResultSchema.RoleSchema.RootSchema.RootsListChangedNotificationSchema.SamplingContentSchema.SamplingMessageSchema.SamplingMessageContentBlockSchema.ServerCapabilitiesSchema.ServerNotificationSchema.ServerRequestSchema.ServerResultSchema.SetLevelRequestSchema.SetLevelRequestParamsSchema.SingleSelectEnumSchemaSchema.StringSchemaSchema.SubscribeRequestSchema.SubscribeRequestParamsSchema.SubscriptionFilterSchema.SubscriptionsAcknowledgedNotificationSchema.SubscriptionsAcknowledgedNotificationParamsSchema.SubscriptionsListenRequestSchema.SubscriptionsListenRequestParamsSchema.SubscriptionsListenResultSchema.SubscriptionsListenResultMetaSchema.TaskAugmentedRequestParamsSchema.TaskCreationParamsSchema.TaskMetadataSchema.TaskSchema.TaskStatusSchema.TaskStatusNotificationSchema.TaskStatusNotificationParamsSchema.TextContentSchema.TextResourceContentsSchema.TitledMultiSelectEnumSchemaSchema.TitledSingleSelectEnumSchemaSchema.ToolSchema.ToolAnnotationsSchema.ToolChoiceSchema.ToolExecutionSchema.ToolListChangedNotificationSchema.ToolResultContentSchema.ToolUseContentSchema.UnsubscribeRequestSchema.UnsubscribeRequestParamsSchema.UntitledMultiSelectEnumSchemaSchema.UntitledSingleSelectEnumSchemaSchema".split("."), e_ = {
	IdJagTokenExchangeResponseSchema: em,
	OAuthClientInformationFullSchema: am,
	OAuthClientInformationSchema: im,
	OAuthClientMetadataSchema: rm,
	OAuthClientRegistrationErrorSchema: om,
	OAuthErrorResponseSchema: tm,
	OAuthMetadataSchema: Xp,
	OAuthProtectedResourceMetadataSchema: Yp,
	OAuthTokenRevocationRequestSchema: sm,
	OAuthTokensSchema: $p,
	OpenIdProviderDiscoveryMetadataSchema: Qp,
	OpenIdProviderMetadataSchema: Zp
}, t_ = {}, n_ = {};
function r_(e, t) {
	let n = e.slice(0, -6);
	t_[n] = t, n_[n] = (e) => t.safeParse(e).success;
}
for (let e of $g) r_(e, tg[e]);
for (let [e, t] of Object.entries(e_)) r_(e, t);
Object.freeze(t_), Object.freeze(n_);
function i_(e) {
	switch (e) {
		case "initialize":
		case "notifications/initialized": return Wh(void 0);
		case "server/discover": return Wh(Uh);
		default: return;
	}
}
var a_ = [
	Fu,
	Iu,
	Ru,
	Bu
], o_ = ["inputResponses", "requestState"];
function s_(e, t) {
	let n = e.params;
	if (!h_(n)) return {
		message: e,
		lifted: {}
	};
	let r = n._meta, i = h_(r) ? a_.filter((e) => e in r) : [], a = t === "request" ? o_.filter((e) => e in n) : [];
	if (i.length === 0 && a.length === 0) return {
		message: e,
		lifted: {}
	};
	let o = {}, s = { ...n };
	if (i.length > 0 && h_(r)) {
		let e = {}, t = { ...r };
		for (let n of i) e[n] = r[n], delete t[n];
		o.envelope = e, Object.keys(t).length > 0 ? s._meta = t : delete s._meta;
	}
	for (let e of a) e === "inputResponses" && (o.inputResponses = s[e]), e === "requestState" && (o.requestState = s[e]), delete s[e];
	return {
		message: {
			...e,
			params: s
		},
		lifted: o
	};
}
function c_(e, t) {
	let n = e.validateResult(t, void 0);
	if (n.ok || n.reason !== "not-in-era") return { "~standard": {
		version: 1,
		vendor: "mcp-wire-codec",
		validate(n) {
			let r = e.validateResult(t, n);
			return r.ok ? { value: r.value } : { issues: [{ message: r.reason === "invalid" ? r.message : `not-in-era: ${t}` }] };
		}
	} };
}
function l_(e) {
	return () => e;
}
var u_ = l_(void 0);
function d_(e, t) {
	return {
		...e,
		mcpReq: {
			...e.mcpReq,
			requestState: l_(t)
		}
	};
}
var f_;
function p_(e, t) {
	f_(e, t);
}
var m_ = class {
	_transport;
	_requestMessageId = 0;
	_requestHandlers = /* @__PURE__ */ new Map();
	_customSchemaRequestMethods = /* @__PURE__ */ new Set();
	_requestHandlerAbortControllers = /* @__PURE__ */ new Map();
	_notificationHandlers = /* @__PURE__ */ new Map();
	_responseHandlers = /* @__PURE__ */ new Map();
	_progressHandlers = /* @__PURE__ */ new Map();
	_timeoutInfo = /* @__PURE__ */ new Map();
	_pendingDebouncedNotifications = /* @__PURE__ */ new Set();
	_negotiatedProtocolVersion;
	static {
		f_ = (e, t) => {
			e._negotiatedProtocolVersion = t;
		};
	}
	_supportedProtocolVersions;
	onclose;
	onerror;
	fallbackRequestHandler;
	fallbackNotificationHandler;
	constructor(e) {
		this._options = e, this._supportedProtocolVersions = e?.supportedProtocolVersions ?? Nu, this.setNotificationHandler("notifications/cancelled", (e) => {
			this._oncancel(e);
		}), this.setNotificationHandler("notifications/progress", (e) => {
			this._onprogress(e);
		}), this.setRequestHandler("ping", (e) => ({}));
	}
	_shouldDropInbound(e) {}
	_outboundMetaEnvelope() {}
	_envelopeOutbound(e) {
		let t = this._outboundMetaEnvelope();
		if (t === void 0) return e;
		let n = e.params ?? {};
		return {
			...e,
			params: {
				...n,
				_meta: {
					...t,
					...n._meta
				}
			}
		};
	}
	_resolveNonCompleteResult(e, t) {
		return Promise.reject(new fm(dm.UnsupportedResultType, `Unsupported result type '${e.kind}' for ${t.request.method}`, {
			resultType: e.kind,
			method: t.request.method
		}));
	}
	_getRequestHandler(e) {
		return this._requestHandlers.get(e);
	}
	async _oncancel(e) {
		e.params.requestId !== void 0 && this._requestHandlerAbortControllers.get(e.params.requestId)?.abort(e.params.reason);
	}
	_setupTimeout(e, t, n, r, i = !1) {
		this._timeoutInfo.set(e, {
			timeoutId: setTimeout(r, t),
			startTime: Date.now(),
			timeout: t,
			maxTotalTimeout: n,
			resetTimeoutOnProgress: i,
			onTimeout: r
		});
	}
	_resetTimeout(e) {
		let t = this._timeoutInfo.get(e);
		if (!t) return !1;
		let n = Date.now() - t.startTime;
		if (t.maxTotalTimeout && n >= t.maxTotalTimeout) throw this._timeoutInfo.delete(e), new fm(dm.RequestTimeout, "Maximum total timeout exceeded", {
			maxTotalTimeout: t.maxTotalTimeout,
			totalElapsed: n
		});
		return clearTimeout(t.timeoutId), t.timeoutId = setTimeout(t.onTimeout, t.timeout), !0;
	}
	_cleanupTimeout(e) {
		let t = this._timeoutInfo.get(e);
		t && (clearTimeout(t.timeoutId), this._timeoutInfo.delete(e));
	}
	async connect(e) {
		this._transport = e;
		let t = this.transport?.onclose;
		this._transport.onclose = () => {
			try {
				t?.();
			} finally {
				this._onclose();
			}
		};
		let n = this.transport?.onerror;
		this._transport.onerror = (e) => {
			n?.(e), this._onerror(e);
		};
		let r = this._transport?.onmessage;
		this._transport.onmessage = (e, t) => {
			r?.(e, t), ig(e) || ag(e) ? this._onresponse(e) : ng(e) ? this._onrequest(e, t) : rg(e) ? this._onnotification(e, t) : this._onerror(/* @__PURE__ */ Error(`Unknown message type: ${JSON.stringify(e)}`));
		}, e.setSupportedProtocolVersions?.(this._supportedProtocolVersions), await this._transport.start();
	}
	_onclose() {
		let e = this._responseHandlers;
		this._responseHandlers = /* @__PURE__ */ new Map(), this._progressHandlers.clear(), this._pendingDebouncedNotifications.clear();
		for (let e of this._timeoutInfo.values()) clearTimeout(e.timeoutId);
		this._timeoutInfo.clear();
		let t = this._requestHandlerAbortControllers;
		this._requestHandlerAbortControllers = /* @__PURE__ */ new Map();
		let n = new fm(dm.ConnectionClosed, "Connection closed");
		this._transport = void 0;
		try {
			this.onclose?.();
		} finally {
			for (let t of e.values()) t(n);
			for (let e of t.values()) e.abort(n);
		}
	}
	_onerror(e) {
		this.onerror?.(e);
	}
	_onnotification(e, t) {
		let { message: n } = s_(e, "notification"), r = this._negotiatedWireCodec();
		if (t?.classification === void 0 && this._shouldDropInbound(e) === "drop") return;
		if (t?.classification !== void 0) {
			let e = Gh(t.classification);
			if (e !== r.era) {
				this._onerror(/* @__PURE__ */ Error(`Era mismatch on inbound notification '${n.method}': classified as ${e} but this instance serves ${r.era}`));
				return;
			}
		}
		if (qh(n.method) && !r.hasNotificationMethod(n.method)) return;
		let i = this._notificationHandlers.get(n.method), a = this.fallbackNotificationHandler;
		(i !== void 0 || a !== void 0) && Promise.resolve().then(() => i === void 0 ? a(n) : i(n, r)).catch((e) => this._onerror(/* @__PURE__ */ Error(`Uncaught error in notification handler: ${e}`)));
	}
	_onrequest(e, t) {
		let { message: n, lifted: r } = s_(e, "request"), i = this._negotiatedWireCodec();
		if (t?.classification === void 0 && this._shouldDropInbound(e) === "drop") {
			this._onerror(/* @__PURE__ */ Error(`Dropped inbound request '${e.method}': not servable on this connection's protocol era`));
			return;
		}
		let a = this._transport, o = (e, t, r) => {
			let i = {
				jsonrpc: "2.0",
				id: n.id,
				error: {
					code: e,
					message: t,
					...r !== void 0 && { data: r }
				}
			};
			a?.send(i).catch((e) => this._onerror(/* @__PURE__ */ Error(`Failed to send an error response: ${e}`)));
		};
		if (t?.classification !== void 0) {
			let e = Gh(t.classification);
			if (e !== i.era) {
				this._onerror(/* @__PURE__ */ Error(`Era mismatch on inbound request '${n.method}': classified as ${e} but this instance serves ${i.era}`));
				let r = t.classification.revision ?? e;
				o(J.UnsupportedProtocolVersion, `Unsupported protocol version: ${r}`, {
					supported: this._supportedProtocolVersions,
					requested: r
				});
				return;
			}
		}
		if (Kh(n.method) && !i.hasRequestMethod(n.method) && !(Jh(n.method) && this._customSchemaRequestMethods.has(n.method))) {
			o(J.MethodNotFound, "Method not found");
			return;
		}
		let s = this._requestHandlers.get(n.method) ?? this.fallbackRequestHandler;
		if (s === void 0) {
			o(J.MethodNotFound, "Method not found");
			return;
		}
		let c = i.checkInboundEnvelope(r);
		if (c !== void 0) {
			o(J.InvalidParams, c);
			return;
		}
		let l = (e, t) => this._notificationViaCodec(this._resolveOutboundCodec(e.method), e, {
			...t,
			relatedRequestId: n.id
		}), u = (e, t, r) => this._requestWithSchemaViaCodec(this._resolveOutboundCodec(e.method), e, t, {
			...r,
			relatedRequestId: n.id
		}), d = new AbortController();
		this._requestHandlerAbortControllers.set(n.id, d);
		let f = r.inputResponses === void 0 ? void 0 : v_(r.inputResponses), p = {
			sessionId: a?.sessionId,
			mcpReq: {
				id: n.id,
				method: n.method,
				_meta: n.params?._meta,
				...r.envelope !== void 0 && { envelope: r.envelope },
				...f !== void 0 && { inputResponses: f.accepted },
				...f !== void 0 && f.droppedKeys.length > 0 && { droppedInputResponseKeys: f.droppedKeys },
				requestState: r.requestState === void 0 ? u_ : l_(r.requestState),
				signal: d.signal,
				send: ((e, t, n) => {
					let r = this._resolveOutboundCodec(e.method);
					if (this._assertOutboundRequestInEra(r, e.method), Cg(t)) return u(e, t, n);
					let i = c_(r, e.method);
					if (i === void 0) throw TypeError(`'${e.method}' is not a spec method; pass a result schema as the second argument to ctx.mcpReq.send().`);
					return u(e, i, t);
				}),
				notify: l
			},
			http: t?.authInfo ? { authInfo: t.authInfo } : void 0
		}, m = this.buildContext(p, t);
		Promise.resolve().then(() => s(n, m)).then(async (e) => {
			if (d.signal.aborted) return;
			let t;
			try {
				t = i.encodeResult(n.method, e, this._outboundServerInfo());
			} catch (e) {
				this._onerror(/* @__PURE__ */ Error(`Failed to encode result for ${n.method}: ${e}`)), o(J.InternalError, "Internal error");
				return;
			}
			let r = {
				result: t,
				jsonrpc: "2.0",
				id: n.id
			};
			await a?.send(r);
		}, async (e) => {
			if (d.signal.aborted) return;
			let t = Number.isSafeInteger(e.code) ? e.code : J.InternalError, r = {
				jsonrpc: "2.0",
				id: n.id,
				error: {
					code: i.encodeErrorCode(t),
					message: e.message ?? "Internal error",
					...e.data !== void 0 && { data: e.data }
				}
			};
			await a?.send(r);
		}).catch((e) => this._onerror(/* @__PURE__ */ Error(`Failed to send response: ${e}`))).finally(() => {
			this._requestHandlerAbortControllers.get(n.id) === d && this._requestHandlerAbortControllers.delete(n.id);
		});
	}
	_onprogress(e) {
		let { progressToken: t, ...n } = e.params, r = Number(t), i = this._progressHandlers.get(r);
		if (!i) {
			this._onerror(/* @__PURE__ */ Error(`Received a progress notification for an unknown token: ${JSON.stringify(e)}`));
			return;
		}
		let a = this._responseHandlers.get(r), o = this._timeoutInfo.get(r);
		if (o && a && o.resetTimeoutOnProgress) try {
			this._resetTimeout(r);
		} catch (e) {
			this._responseHandlers.delete(r), this._progressHandlers.delete(r), this._cleanupTimeout(r), a(e);
			return;
		}
		i(n);
	}
	_onresponse(e) {
		let t = Number(e.id), n = this._responseHandlers.get(t);
		n === void 0 ? this._onerror(/* @__PURE__ */ Error(`Received a response for an unknown message ID: ${JSON.stringify(e)}`)) : (this._responseHandlers.delete(t), this._cleanupTimeout(t), this._progressHandlers.delete(t), ig(e) ? n(e) : n(Y.fromError(e.error.code, e.error.message, e.error.data)));
	}
	get transport() {
		return this._transport;
	}
	async close() {
		await this._transport?.close();
	}
	request(e, t, n) {
		let r = this._resolveOutboundCodec(e.method);
		if (Cg(t)) return Jh(e.method) || this._assertOutboundRequestInEra(r, e.method), this._requestWithSchemaViaCodec(r, e, t, n);
		this._assertOutboundRequestInEra(r, e.method);
		let i = c_(r, e.method);
		if (i === void 0) throw TypeError(`'${e.method}' is not a spec method; pass a result schema as the second argument to request().`);
		return this._requestWithSchemaViaCodec(r, e, i, t);
	}
	_negotiatedWireCodec() {
		return Wh(this._negotiatedProtocolVersion);
	}
	_wireCodec() {
		return this._negotiatedWireCodec();
	}
	_resolveOutboundCodec(e) {
		if (this._negotiatedProtocolVersion === void 0) {
			let t = i_(e);
			if (t) return t;
		}
		return this._negotiatedWireCodec();
	}
	_assertOutboundRequestInEra(e, t) {
		if (Kh(t) && !e.hasRequestMethod(t)) throw new fm(dm.MethodNotSupportedByProtocolVersion, `Method '${t}' is not supported by the negotiated protocol version (wire era ${e.era})`, {
			method: t,
			era: e.era
		});
	}
	_requestWithSchema(e, t, n) {
		let r = this._resolveOutboundCodec(e.method);
		return this._assertOutboundRequestInEra(r, e.method), this._requestWithSchemaViaCodec(r, e, t, n);
	}
	_requestWithSchemaViaCodec(e, t, n, r) {
		let { relatedRequestId: i, resumptionToken: a, onresumptiontoken: o, headers: s } = r ?? {}, c = Date.now(), l, u;
		return new Promise((d, f) => {
			let p = (e) => {
				f(e);
			};
			if (!this._transport) {
				p(/* @__PURE__ */ Error("Not connected"));
				return;
			}
			if (this._options?.enforceStrictCapabilities === !0) try {
				this.assertCapabilityForMethod(t.method);
			} catch (e) {
				p(e);
				return;
			}
			if (r?.signal?.aborted) {
				let e = r.signal.reason;
				throw e instanceof fm ? e : new fm(dm.RequestTimeout, String(e));
			}
			let m = e.era === "2026-07-28" && this._transport.hasPerRequestStream === !0 ? new AbortController() : void 0, h = this._requestMessageId++;
			u = h;
			let g = {
				...t,
				jsonrpc: "2.0",
				id: h
			};
			r?.onprogress && (this._progressHandlers.set(h, r.onprogress), g.params = {
				...t.params,
				_meta: {
					...t.params?._meta,
					progressToken: h
				}
			});
			let _ = this._envelopeOutbound(g), v = !1, y = (e) => {
				v || (this._progressHandlers.delete(h), m === void 0 ? t.method !== "initialize" && this._transport?.send(this._envelopeOutbound({
					jsonrpc: "2.0",
					method: "notifications/cancelled",
					params: {
						requestId: h,
						reason: String(e)
					}
				}), {
					relatedRequestId: i,
					resumptionToken: a,
					onresumptiontoken: o
				}).catch((e) => this._onerror(/* @__PURE__ */ Error(`Failed to send cancellation: ${e}`))) : m.abort(), f(e instanceof fm ? e : new fm(dm.RequestTimeout, String(e))));
			};
			this._responseHandlers.set(h, (i) => {
				if (r?.signal?.aborted) return;
				if (v = !0, i instanceof Error) return f(i);
				let a;
				try {
					a = e.decodeResult(t.method, i.result);
				} catch (e) {
					return f(e instanceof Error ? e : Error(String(e)));
				}
				if (a.kind === "invalid") return f(a.error);
				if (a.kind === "input_required") {
					if (r?.allowInputRequired === !0) return d(y_(a));
					let i = {
						codec: e,
						request: t,
						resultSchema: n,
						options: r,
						flowStartedAt: c,
						retry: (r, i) => this._requestWithSchemaViaCodec(e, r === void 0 ? { method: t.method } : {
							method: t.method,
							params: r
						}, n, i)
					};
					return d(this._resolveNonCompleteResult(a, i));
				}
				let o = a.result;
				Ag(n, o).then((e) => {
					e.success ? d(e.data) : f(new fm(dm.InvalidResult, `Invalid result for ${t.method}: ${e.error}`));
				}, f);
			}), l = () => y(r?.signal?.reason), r?.signal?.addEventListener("abort", l, { once: !0 });
			let b = r?.timeout ?? 6e4;
			this._setupTimeout(h, b, r?.maxTotalTimeout, () => y(new fm(dm.RequestTimeout, "Request timed out", { timeout: b })), r?.resetTimeoutOnProgress ?? !1), this._transport.send(_, {
				relatedRequestId: i,
				resumptionToken: a,
				onresumptiontoken: o,
				headers: s,
				requestSignal: m?.signal
			}).catch((e) => {
				this._progressHandlers.delete(h), f(e);
			});
		}).finally(() => {
			l && r?.signal?.removeEventListener("abort", l), u !== void 0 && (this._responseHandlers.delete(u), this._cleanupTimeout(u));
		});
	}
	async notification(e, t) {
		return await this._notificationViaCodec(this._resolveOutboundCodec(e.method), e, t);
	}
	async _notificationViaCodec(e, t, n) {
		if (!this._transport) throw new fm(dm.NotConnected, "Not connected");
		if (qh(t.method) && !e.hasNotificationMethod(t.method)) throw new fm(dm.MethodNotSupportedByProtocolVersion, `Notification '${t.method}' is not supported by the negotiated protocol version (wire era ${e.era})`, {
			method: t.method,
			era: e.era
		});
		this.assertNotificationCapability(t.method);
		let r = this._envelopeOutbound({
			jsonrpc: "2.0",
			...t
		});
		if ((this._options?.debouncedNotificationMethods ?? []).includes(t.method) && !t.params && n?.relatedRequestId === void 0) {
			if (this._pendingDebouncedNotifications.has(t.method)) return;
			this._pendingDebouncedNotifications.add(t.method), Promise.resolve().then(() => {
				this._pendingDebouncedNotifications.delete(t.method), this._transport && this._transport?.send(r, n).catch((e) => this._onerror(e));
			});
		} else await this._transport.send(r, n);
	}
	setRequestHandler(e, t, n) {
		this.assertRequestHandlerCapability(e);
		let r;
		if (typeof t == "function") {
			if (!Kh(e)) throw TypeError(`'${e}' is not a spec request method; pass schemas as the second argument to setRequestHandler().`);
			r = (n, r) => {
				let i = this._negotiatedWireCodec(), a = i.validateRequest(e, n);
				if (!a.ok && a.reason === "not-in-era" && (a = i.validateInputRequest(e, n)), !a.ok) throw a.reason === "not-in-era" ? new Y(J.InternalError, `No wire schema for ${e} in the resolved era`) : Error(a.message);
				return Promise.resolve(t(a.value, r));
			};
		} else if (n) r = async (r, i) => {
			let a = await Ag(t.params, { ...r.params });
			if (!a.success) throw new Y(J.InvalidParams, `Invalid params for ${e}: ${a.error}`);
			return n(a.data, i);
		};
		else throw TypeError("setRequestHandler: handler is required");
		typeof t == "function" ? this._customSchemaRequestMethods.delete(e) : this._customSchemaRequestMethods.add(e), this._requestHandlers.set(e, this._wrapHandler(e, r));
	}
	_wrapHandler(e, t) {
		return t;
	}
	_outboundServerInfo() {}
	removeRequestHandler(e) {
		this._requestHandlers.delete(e), this._customSchemaRequestMethods.delete(e);
	}
	assertCanSetRequestHandler(e) {
		if (this._requestHandlers.has(e)) throw Error(`A request handler for ${e} already exists, which would be overridden`);
	}
	setNotificationHandler(e, t, n) {
		if (typeof t == "function") {
			if (!qh(e)) throw TypeError(`'${e}' is not a spec notification method; pass schemas as the second argument to setNotificationHandler().`);
			this._notificationHandlers.set(e, (n, r) => {
				let i = r.validateNotification(e, n);
				if (!i.ok) throw i.reason === "not-in-era" ? new Y(J.InternalError, `No wire schema for ${e} in the resolved era`) : Error(i.message);
				return Promise.resolve(t(i.value));
			});
		} else {
			if (!n) throw TypeError("setNotificationHandler: handler is required");
			this._notificationHandlers.set(e, async (r) => {
				let i = await Ag(t.params, { ...r.params });
				if (!i.success) throw new Y(J.InvalidParams, `Invalid params for notification ${e}: ${i.error}`);
				await n(i.data, r);
			});
		}
	}
	removeNotificationHandler(e) {
		this._notificationHandlers.delete(e);
	}
};
function h_(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function g_(e, t) {
	let n = { ...e };
	for (let e in t) {
		let r = e, i = t[r];
		if (i === void 0) continue;
		let a = n[r];
		n[r] = h_(a) && h_(i) ? {
			...a,
			...i
		} : i;
	}
	return n;
}
function __(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function v_(e) {
	let t = {}, n = [];
	if (!__(e)) return {
		accepted: t,
		droppedKeys: n
	};
	for (let [r, i] of Object.entries(e)) !__(i) || "method" in i || "result" in i ? n.push(r) : t[r] = i;
	return {
		accepted: t,
		droppedKeys: n
	};
}
function y_(e) {
	return {
		resultType: "input_required",
		inputRequests: e.inputRequests,
		...e.requestState !== void 0 && { requestState: e.requestState },
		...e._meta !== void 0 && { _meta: e._meta }
	};
}
/*!
* content-type
* Copyright(c) 2015 Douglas Christopher Wilson
* MIT Licensed
*/
(/* @__PURE__ */ ku(((e) => {
	var t = /; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g, n = /\\([\u000b\u0020-\u00ff])/g, r = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
	e.parse = i;
	function i(e) {
		if (!e) throw TypeError("argument string is required");
		var i = typeof e == "object" ? a(e) : e;
		if (typeof i != "string") throw TypeError("argument string is required to be a string");
		var s = i.indexOf(";"), c = s === -1 ? i.trim() : i.slice(0, s).trim();
		if (!r.test(c)) throw TypeError("invalid media type");
		var l = new o(c.toLowerCase());
		if (s !== -1) {
			var u, d, f;
			for (t.lastIndex = s; d = t.exec(i);) {
				if (d.index !== s) throw TypeError("invalid parameter format");
				s += d[0].length, u = d[1].toLowerCase(), f = d[2], f.charCodeAt(0) === 34 && (f = f.slice(1, -1), f.indexOf("\\") !== -1 && (f = f.replace(n, "$1"))), l.parameters[u] = f;
			}
			if (s !== i.length) throw TypeError("invalid parameter format");
		}
		return l;
	}
	function a(e) {
		var t;
		if (typeof e.getHeader == "function" ? t = e.getHeader("content-type") : typeof e.headers == "object" && (t = e.headers && e.headers["content-type"]), typeof t != "string") throw TypeError("content-type header is missing from object");
		return t;
	}
	function o(e) {
		this.parameters = Object.create(null), this.type = e;
	}
})))();
var b_ = class {
	_buffer;
	_maxBufferSize;
	constructor(e) {
		this._maxBufferSize = e?.maxBufferSize ?? 10485760;
	}
	append(e) {
		if ((this._buffer?.length ?? 0) + e.length > this._maxBufferSize) throw this.clear(), Error(`ReadBuffer exceeded maximum size of ${this._maxBufferSize} bytes`);
		this._buffer = this._buffer ? Buffer.concat([this._buffer, e]) : e;
	}
	readMessage() {
		for (; this._buffer;) {
			let e = this._buffer.indexOf("\n");
			if (e === -1) return null;
			let t = this._buffer.toString("utf8", 0, e).replace(/\r$/, "");
			this._buffer = this._buffer.subarray(e + 1);
			try {
				return x_(t);
			} catch (e) {
				if (e instanceof SyntaxError) continue;
				throw e;
			}
		}
		return null;
	}
	clear() {
		this._buffer = void 0;
	}
};
function x_(e) {
	return sd.parse(JSON.parse(e));
}
function S_(e) {
	return JSON.stringify(e) + "\n";
}
var C_ = /^[A-Za-z0-9._-]{1,128}$/;
function w_(e) {
	let t = [];
	if (e.length === 0) return {
		isValid: !1,
		warnings: ["Tool name cannot be empty"]
	};
	if (e.length > 128) return {
		isValid: !1,
		warnings: [`Tool name exceeds maximum length of 128 characters (current: ${e.length})`]
	};
	if (e.includes(" ") && t.push("Tool name contains spaces, which may cause parsing issues"), e.includes(",") && t.push("Tool name contains commas, which may cause parsing issues"), (e.startsWith("-") || e.endsWith("-")) && t.push("Tool name starts or ends with a dash, which may cause parsing issues in some contexts"), (e.startsWith(".") || e.endsWith(".")) && t.push("Tool name starts or ends with a dot, which may cause parsing issues in some contexts"), !C_.test(e)) {
		let n = [...e].filter((e) => !/[A-Za-z0-9._-]/.test(e)).filter((e, t, n) => n.indexOf(e) === t);
		return t.push(`Tool name contains invalid characters: ${n.map((e) => `"${e}"`).join(", ")}`, "Allowed characters are: A-Z, a-z, 0-9, underscore (_), dash (-), and dot (.)"), {
			isValid: !1,
			warnings: t
		};
	}
	return {
		isValid: !0,
		warnings: t
	};
}
function T_(e, t) {
	if (t.length > 0) {
		console.warn(`Tool name validation warning for "${e}":`);
		for (let e of t) console.warn(`  - ${e}`);
		console.warn("Tool registration will proceed, but this may cause compatibility issues."), console.warn("Consider updating the tool name to conform to the MCP tool naming standard."), console.warn("See SEP: Specify Format for Tool Names (https://github.com/modelcontextprotocol/modelcontextprotocol/issues/986) for more details.");
	}
}
function E_(e) {
	let t = w_(e);
	return T_(e, t.warnings), t.isValid;
}
function D_(e) {
	return typeof e == "object" && !!e && "_zod" in e;
}
function O_(e) {
	return typeof e == "object" && !!e && !("_zod" in e) && "_def" in e && typeof e._def?.typeName == "string";
}
function k_(e) {
	if (typeof e != "object" || !e || Cg(e)) return !1;
	let t = Object.getPrototypeOf(e);
	return t !== Object.prototype && t !== null ? !1 : Object.values(e).every((e) => D_(e));
}
function A_(e) {
	if (e !== void 0) {
		if (k_(e)) return B(e);
		if (typeof e == "object" && e && !Cg(e) && Object.values(e).some((e) => O_(e))) throw TypeError("Raw-shape inputSchema/outputSchema/argsSchema fields must be Zod v4 schemas. Got a Zod v3 field schema. Import from `zod/v4` (or upgrade your zod import), or wrap with `z.object({...})` yourself.");
		if (!Cg(e)) throw TypeError("inputSchema/outputSchema/argsSchema must be a Standard Schema (e.g. z.object({...})) or a raw Zod shape ({ field: z.string() }).");
		return e;
	}
}
// scripts/mcp-sdk-shims.mjs
var j_ = class {
	getValidator() {
		throw Error("This 67js server does not validate elicitation results; it never requests elicitation.");
	}
}, M_ = Symbol.for("mcp.completable");
function N_(e) {
	return !!e && typeof e == "object" && M_ in e;
}
function P_(e) {
	return e[M_]?.complete;
}
var F_ = 2 ** 31 - 1;
function I_(e, t) {
	if (!Number.isFinite(e) || e < 1) return;
	let n = setInterval(t, Math.min(e, F_));
	return n.unref?.(), n;
}
var L_, R_ = class {
	static {
		L_ = (e) => e._classification;
	}
	onclose;
	onerror;
	onmessage;
	_classification;
	_responseMode;
	_started = !1;
	_used = !1;
	_closed = !1;
	_terminalDelivered = !1;
	_dispatchWindowOpen = !1;
	_requestId;
	_deferredResponse;
	_sse;
	_abortCleanup;
	_keepAliveMs;
	constructor(e) {
		this._classification = e.classification, this._responseMode = e.responseMode ?? "auto", this._keepAliveMs = e.keepAliveMs ?? 15e3;
	}
	async start() {
		if (this._started) throw Error("PerRequestHTTPServerTransport is already started");
		this._started = !0;
	}
	async handleMessage(e, t) {
		if (this._used) throw Error("PerRequestHTTPServerTransport serves exactly one exchange; construct a new transport per request");
		if (!this._started || this.onmessage === void 0) throw Error("PerRequestHTTPServerTransport is not connected: connect a server to this transport before handling a message");
		if (this._closed) throw Error("PerRequestHTTPServerTransport is closed");
		this._used = !0;
		let n = t?.request?.signal;
		if (n?.aborted) throw await this.close(), new fm(dm.ConnectionClosed, "The request was aborted before it could be handled");
		let r = {
			classification: this._classification,
			...t?.request !== void 0 && { request: t.request },
			...t?.authInfo !== void 0 && { authInfo: t.authInfo }
		};
		if (ng(e)) {
			this._requestId = e.id;
			let t, i, a = new Promise((e, n) => {
				t = e, i = n;
			});
			if (this._deferredResponse = {
				promise: a,
				resolve: t,
				reject: i,
				settled: !1
			}, n !== void 0) {
				let e = () => void this.close();
				n.addEventListener("abort", e, { once: !0 }), this._abortCleanup = () => n.removeEventListener("abort", e);
			}
			this._dispatchWindowOpen = !0;
			try {
				this.onmessage(e, r);
			} finally {
				this._dispatchWindowOpen = !1;
			}
			return this._responseMode === "sse" && !this._closed && !this._deferredResponse.settled && this.upgradeToSse(), a;
		}
		return this.onmessage(e, r), new Response(null, { status: 202 });
	}
	async send(e, t) {
		if (this._closed) return;
		let n = ig(e) || ag(e), r = n ? e.id : t?.relatedRequestId;
		if (this._requestId === void 0 || r === void 0 || r !== this._requestId) n && this.onerror?.(/* @__PURE__ */ Error(`Received a response for an unknown request id: ${String(e.id)}`));
		else if (n) {
			if (this._terminalDelivered) return;
			this._terminalDelivered = !0;
			let t = ag(e) ? e.error.code : void 0, n = t !== void 0 && (this._dispatchWindowOpen || t === J.MissingRequiredClientCapability) ? _g[t] : void 0;
			if (n !== void 0 && this._sse === void 0) {
				this.settleResponse(Response.json(e, {
					status: n,
					headers: { "Content-Type": "application/json" }
				})), queueMicrotask(() => void this.close());
				return;
			}
			if (this._sse !== void 0 || this._responseMode === "sse") {
				this._sse === void 0 && this.upgradeToSse(), this.writeMessageFrame(e), this.finalizeStream();
				return;
			}
			this.settleResponse(Response.json(e, {
				status: 200,
				headers: { "Content-Type": "application/json" }
			})), queueMicrotask(() => void this.close());
		} else this._responseMode !== "json" && (this._sse === void 0 && this.upgradeToSse(), this.writeMessageFrame(e));
	}
	writeCommentFrame(e) {
		if (this._closed || this._sse === void 0 || this._sse.closed) return;
		let t = e.split("\n").map((e) => `: ${e}`).join("\n");
		this.writeFrame(`${t}\n\n`);
	}
	async close() {
		if (!this._closed) {
			if (this._closed = !0, this._abortCleanup?.(), this._abortCleanup = void 0, this._sse?.keepAliveTimer !== void 0 && clearInterval(this._sse.keepAliveTimer), this._sse !== void 0 && !this._sse.closed) {
				this._sse.closed = !0;
				try {
					this._sse.controller.close();
				} catch {}
			}
			this._deferredResponse !== void 0 && !this._deferredResponse.settled && (this._deferredResponse.settled = !0, this._deferredResponse.reject(new fm(dm.ConnectionClosed, "Connection closed before a response was produced"))), this.onclose?.();
		}
	}
	settleResponse(e) {
		this._deferredResponse === void 0 || this._deferredResponse.settled || (this._deferredResponse.settled = !0, this._deferredResponse.resolve(e));
	}
	upgradeToSse() {
		let e, t = new ReadableStream({
			start: (t) => {
				e = t;
			},
			cancel: () => {
				this.close();
			}
		});
		this._sse = {
			controller: e,
			encoder: new TextEncoder(),
			closed: !1
		}, this._sse.keepAliveTimer = I_(this._keepAliveMs, () => this.writeCommentFrame("keepalive")), this.settleResponse(new Response(t, {
			status: 200,
			headers: {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache, no-transform",
				Connection: "keep-alive",
				"X-Accel-Buffering": "no"
			}
		}));
	}
	finalizeStream() {
		if (this._sse?.keepAliveTimer !== void 0 && clearInterval(this._sse.keepAliveTimer), this._sse !== void 0 && !this._sse.closed) {
			this._sse.closed = !0;
			try {
				this._sse.controller.close();
			} catch {}
		}
		queueMicrotask(() => void this.close());
	}
	writeMessageFrame(e) {
		this.writeFrame(`event: message\ndata: ${JSON.stringify(e)}\n\n`);
	}
	writeFrame(e) {
		if (!(this._sse === void 0 || this._sse.closed)) try {
			this._sse.controller.enqueue(this._sse.encoder.encode(e));
		} catch (e) {
			this.onerror?.(/* @__PURE__ */ Error(`Failed to write to the response stream: ${e}`));
		}
	}
};
function z_(e) {
	return e instanceof R_ ? L_(e) : void 0;
}
function B_(e) {
	return typeof e == "object" && !!e && "setScopeChallengeResolver" in e && typeof e.setScopeChallengeResolver == "function";
}
var V_ = 8, H_ = 6e5;
function U_(e) {
	if (e?.maxRounds !== void 0 && (!Number.isInteger(e.maxRounds) || e.maxRounds < 1)) throw RangeError(`inputRequired.maxRounds must be a positive integer (got ${e.maxRounds})`);
	if (e?.roundTimeoutMs !== void 0 && (!Number.isFinite(e.roundTimeoutMs) || e.roundTimeoutMs <= 0)) throw RangeError(`inputRequired.roundTimeoutMs must be a positive number (got ${e.roundTimeoutMs})`);
	return {
		maxRounds: e?.maxRounds ?? V_,
		roundTimeoutMs: e?.roundTimeoutMs ?? H_,
		legacyShim: e?.legacyShim ?? !0
	};
}
function W_(e, t, n) {
	if (typeof n != "object" || !n || typeof n.method != "string") throw new Y(J.InternalError, `Handler for ${e} returned an invalid input request '${t}': each inputRequests entry must be an embedded elicitation/create, sampling/createMessage, or roots/list request`);
	let r = n, i = hm(r);
	if (i === void 0) throw new Y(J.InternalError, `Handler for ${e} returned an input request '${t}' of kind '${r.method}', which is not an embedded request the 2026-07-28 revision defines`);
	return {
		embedded: r,
		required: i
	};
}
function G_() {
	let e = globalThis.crypto;
	if (e?.randomUUID !== void 0) return e.randomUUID();
	let t = /* @__PURE__ */ new Uint8Array(16);
	e.getRandomValues(t), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128;
	let n = [...t].map((e) => e.toString(16).padStart(2, "0")).join("");
	return `${n.slice(0, 8)}-${n.slice(8, 12)}-${n.slice(12, 16)}-${n.slice(16, 20)}-${n.slice(20)}`;
}
function K_(e, t) {
	if (e === "tools/call") return {
		content: [{
			type: "text",
			text: t
		}],
		isError: !0
	};
	throw new Y(J.InternalError, t);
}
var q_ = class {
	constructor(e) {
		this._host = e;
	}
	async fulfill(e, t, n, r, i) {
		let { maxRounds: a, roundTimeoutMs: o } = this._host, s = r.mcpReq.signal, c = i, l = 0;
		for (;;) {
			if (l += 1, l > a) return K_(e, Xg(e, a));
			let i = c.inputRequests, u = i != null && Object.keys(i).length > 0, d = typeof c.requestState == "string" ? c.requestState : void 0;
			if (!u && d === void 0) throw new Y(J.InternalError, `Handler for ${e} returned an input-required result with neither inputRequests nor requestState (every InputRequiredResult must include at least one of the two)`);
			let f;
			if (u) {
				let t = this._host.resolvedClientCapabilities(r), n = [];
				for (let [r, a] of Object.entries(i)) {
					let { embedded: i, required: o } = W_(e, r, a);
					if (i.method !== "roots/list" && i.params === void 0) throw new Y(J.InternalError, `Handler for ${e} returned an input request '${r}' of kind '${i.method}' without params`);
					if (gm(o, t) !== void 0) return K_(e, `Cannot request input '${r}' (${i.method}): the client on this 2025-era connection did not declare the required capability${t === void 0 ? " (no client capabilities are available on this connection — per-request legacy serving cannot receive server-to-client requests)" : ""}`);
					n.push([r, i]);
				}
				let a = Qg(s);
				try {
					let e = {
						relatedRequestId: r.mcpReq.id,
						timeout: o,
						resetTimeoutOnProgress: !0,
						onprogress: () => {},
						signal: a.signal
					}, t = await Promise.all(n.map(async ([t, n]) => {
						try {
							return [t, await this._dispatchLeg(n, e)];
						} catch (e) {
							throw a.abort(e), e;
						}
					}));
					f = Object.fromEntries(t);
				} catch (t) {
					if (s.aborted) throw t;
					return K_(e, `Fulfilling input required by '${e}' failed: ${t instanceof Error ? t.message : String(t)}`);
				} finally {
					a.dispose();
				}
			} else await Zg(250, s);
			let p = {
				...r,
				mcpReq: {
					...r.mcpReq,
					inputResponses: f,
					droppedInputResponseKeys: void 0,
					requestState: l_(d)
				}
			};
			if (d !== void 0) {
				let t = await this._host.verifyRequestState(d, p, e);
				t !== void 0 && (p = d_(p, t));
			}
			let m = await t(n, p);
			if (!og(m)) return m;
			c = m;
		}
	}
	async _dispatchLeg(e, t) {
		switch (e.method) {
			case "elicitation/create": {
				let n = e.params;
				return n.mode === "url" && n.elicitationId === void 0 && (n = {
					...n,
					elicitationId: G_()
				}), await this._host.sendElicitation(n, t);
			}
			case "sampling/createMessage": return await this._host.sendSampling(e.params, t);
			case "roots/list": return await this._host.listRoots(e.params, t);
		}
	}
}, J_ = /* @__PURE__ */ new Set([
	"tools/call",
	"prompts/get",
	"resources/read"
]), Y_, X_;
function Z_(e, t) {
	Y_(e, t);
}
function Q_(e) {
	return X_(e);
}
var $_ = class extends m_ {
	_clientCapabilities;
	_clientVersion;
	static {
		Y_ = (e, t) => {
			let n = t.filter((t) => !e._supportedProtocolVersions.includes(t));
			n.length > 0 && (e._supportedProtocolVersions = [...e._supportedProtocolVersions, ...n]), e.setRequestHandler("server/discover", () => e._ondiscover());
		}, X_ = (e) => e._serverInfo;
	}
	_capabilities;
	_instructions;
	_jsonSchemaValidator;
	_cacheHints;
	_requestStateVerify;
	_inputRequiredServing;
	_legacyShim;
	_boundFromTransport = !1;
	_legacyInputRequiredShim() {
		return this._legacyShim ??= new q_({
			maxRounds: this._inputRequiredServing.maxRounds,
			roundTimeoutMs: this._inputRequiredServing.roundTimeoutMs,
			resolvedClientCapabilities: (e) => this._inputRequestCapabilityView(e),
			verifyRequestState: (e, t, n) => this._verifyRequestState(e, t, n),
			sendElicitation: (e, t) => this._sendElicitationLeg(e, t, { validateAcceptedContent: !1 }),
			sendSampling: (e, t) => this.createMessage(e, t),
			listRoots: (e, t) => this.listRoots(e, t)
		});
	}
	oninitialized;
	constructor(e, t) {
		if (super(t), this._serverInfo = e, this._capabilities = t?.capabilities ? { ...t.capabilities } : {}, this._instructions = t?.instructions, this._jsonSchemaValidator = t?.jsonSchemaValidator ?? new j_(), this._requestStateVerify = t?.requestState?.verify, this._inputRequiredServing = U_(t?.inputRequired), t?.cacheHints !== void 0) {
			for (let [e, n] of Object.entries(t.cacheHints)) n !== void 0 && oh(n, `cacheHints['${e}']`);
			this._cacheHints = t.cacheHints;
		}
		this.setRequestHandler("initialize", (e) => this._oninitialize(e)), this.setNotificationHandler("notifications/initialized", () => this.oninitialized?.()), xm(this._supportedProtocolVersions).length > 0 && this.setRequestHandler("server/discover", () => this._ondiscover()), this._capabilities.logging && this._registerLoggingHandler();
	}
	async connect(e) {
		if (this.transport !== void 0) throw new fm(dm.AlreadyConnected, "Use a separate Server instance per connection: this instance is already connected to a transport. To connect it to a new transport, call close() first.");
		this._boundFromTransport && (this._boundFromTransport = !1, this._negotiatedProtocolVersion = void 0);
		let t = z_(e)?.revision;
		t !== void 0 && !this._servedModernEra() && vm.includes(t) && xm(this._supportedProtocolVersions).includes(t) && (this._negotiatedProtocolVersion = t, this._boundFromTransport = !0), await super.connect(e);
	}
	_registerLoggingHandler() {
		this.setRequestHandler("logging/setLevel", async (e, t) => {
			let n = t.sessionId || t.http?.req?.headers.get("mcp-session-id") || void 0, { level: r } = e.params, i = xg(Rf, r);
			return i.success && this._loggingLevels.set(n, i.data), {};
		});
	}
	buildContext(e, t) {
		let n = e.http || t?.request || t?.closeSSEStream || t?.closeStandaloneSSEStream;
		return {
			...e,
			mcpReq: {
				...e.mcpReq,
				log: (t, n, r) => {
					if (!this._capabilities.logging) return Promise.resolve();
					let i;
					if (this._servedModernEra()) {
						if (i = e.mcpReq.envelope?.[Bu], i === void 0) return Promise.resolve();
					} else i = this._loggingLevels.get(e.sessionId) ?? this._loggingLevels.get(void 0);
					return i !== void 0 && this.LOG_LEVEL_SEVERITY.get(t) < this.LOG_LEVEL_SEVERITY.get(i) ? Promise.resolve() : e.mcpReq.notify({
						method: "notifications/message",
						params: {
							level: t,
							data: n,
							logger: r
						}
					});
				},
				elicitInput: (e, t) => this.elicitInput(e, t),
				requestSampling: (e, t) => this.createMessage(e, t)
			},
			http: n ? {
				...e.http,
				req: t?.request,
				closeSSE: t?.closeSSEStream,
				closeStandaloneSSE: t?.closeStandaloneSSEStream
			} : void 0
		};
	}
	_loggingLevels = /* @__PURE__ */ new Map();
	LOG_LEVEL_SEVERITY = new Map(Rf.options.map((e, t) => [e, t]));
	isMessageIgnored = (e, t) => {
		let n = this._loggingLevels.get(t);
		return n ? this.LOG_LEVEL_SEVERITY.get(e) < this.LOG_LEVEL_SEVERITY.get(n) : !1;
	};
	registerCapabilities(e) {
		if (this.transport) throw new fm(dm.AlreadyConnected, "Cannot register capabilities after connecting to transport");
		let t = !!this._capabilities.logging;
		this._capabilities = g_(this._capabilities, e), !t && this._capabilities.logging && this._registerLoggingHandler();
	}
	_wrapHandler(e, t) {
		if (e !== "tools/call") {
			let n = this._cacheHints?.[e], r = J_.has(e);
			return n === void 0 && !r ? async (n, r) => {
				let i = await t(n, r);
				if (og(i)) throw new Y(J.InternalError, `Handler for ${e} returned an input-required result, but only tools/call, prompts/get and resources/read support input_required (protocol revision 2026-07-28)`);
				return i;
			} : async (i, a) => {
				let o = r ? await this._invokeInputRequiredCapableHandler(e, t, i, a) : await t(i, a);
				if (og(o)) {
					if (!r) throw new Y(J.InternalError, `Handler for ${e} returned an input-required result, but only tools/call, prompts/get and resources/read support input_required (protocol revision 2026-07-28)`);
					return o;
				}
				return n === void 0 ? o : nh(o, n);
			};
		}
		return async (e, n) => {
			let r = Wh(this._negotiatedProtocolVersion), i = r.validateRequest("tools/call", e);
			if (!i.ok) throw new Y(i.reason === "not-in-era" ? J.InternalError : J.InvalidParams, i.reason === "not-in-era" ? "No wire schema for tools/call in the resolved era" : `Invalid tools/call request: ${i.message}`);
			let a = await this._invokeInputRequiredCapableHandler("tools/call", t, e, n);
			if (og(a)) return a;
			let o = wm(a), s = r.validateResult("tools/call", o);
			if (!s.ok) throw new Y(s.reason === "not-in-era" ? J.InternalError : J.InvalidParams, s.reason === "not-in-era" ? "No wire schema for tools/call in the resolved era" : `Invalid tools/call result: ${s.message}`);
			return s.value;
		};
	}
	_servedModernEra() {
		return this._negotiatedProtocolVersion !== void 0 && ym(this._negotiatedProtocolVersion);
	}
	async _invokeInputRequiredCapableHandler(e, t, n, r) {
		let i = this._servedModernEra(), a = r.mcpReq.requestState();
		if (a !== void 0 && typeof a != "string") throw new Y(J.InvalidParams, "Invalid or expired requestState", { reason: "invalid_request_state" });
		let o = r;
		if (typeof a == "string") {
			let t = await this._verifyRequestState(a, r, e);
			t !== void 0 && (o = d_(r, t));
		}
		let s;
		try {
			s = await t(n, o);
		} catch (e) {
			throw e instanceof Y && e.code === J.UrlElicitationRequired && i ? new Y(J.InternalError, `URL elicitation cannot be signalled by throwing UrlElicitationRequiredError on protocol revision ${this._negotiatedProtocolVersion}: return inputRequired({ inputRequests: { …: inputRequired.elicitUrl(...) } }) from the handler instead. The urlElicitationRequired error (-32042) of earlier revisions is not available on this revision.`) : e;
		}
		if (!og(s)) return s;
		if (!i) {
			if (!this._inputRequiredServing.legacyShim) throw new Y(J.InternalError, `Handler for ${e} returned an input-required result, but this request is served on protocol revision ${this._negotiatedProtocolVersion ?? "2025-11-25"}, which has no input_required vocabulary`);
			return await this._legacyInputRequiredShim().fulfill(e, t, n, o, s);
		}
		let c = s.inputRequests, l = c != null && Object.keys(c).length > 0, u = typeof s.requestState == "string";
		if (!l && !u) throw new Y(J.InternalError, `Handler for ${e} returned an input-required result with neither inputRequests nor requestState (every InputRequiredResult must include at least one of the two)`);
		if (l) {
			let t = this._inputRequestCapabilityView(r);
			for (let [n, r] of Object.entries(c)) {
				let { embedded: i, required: a } = W_(e, n, r), o = gm(a, t);
				if (o !== void 0) throw new uh({ requiredCapabilities: o }, `Cannot request input '${n}' (${i.method}): the request's client capabilities do not declare the required capability`);
			}
		}
		return s;
	}
	async _verifyRequestState(e, t, n) {
		if (this._requestStateVerify !== void 0) try {
			return await this._requestStateVerify(e, t);
		} catch (e) {
			throw this.onerror?.(/* @__PURE__ */ Error(`requestState verification rejected ${n}: ${e instanceof Error ? e.message : String(e)}`)), new Y(J.InvalidParams, "Invalid or expired requestState", { reason: "invalid_request_state" });
		}
	}
	_inputRequestCapabilityView(e) {
		return this._servedModernEra() ? e.mcpReq.envelope?.[Ru] : this._clientCapabilities;
	}
	_assertPushApiInServedEra(e) {
		if (this._servedModernEra()) throw new fm(dm.MethodNotSupportedByProtocolVersion, `Server-to-client requests are not available on protocol revision ${this._negotiatedProtocolVersion}: '${e}' cannot be sent while serving a request on that revision. Return inputRequired({ ... }) from the handler instead — the client fulfils the embedded requests and retries the original request (multi round-trip requests).`, {
			method: e,
			era: "2026-07-28"
		});
	}
	assertCapabilityForMethod(e) {
		switch (e) {
			case "sampling/createMessage":
				if (!this._clientCapabilities?.sampling) throw new fm(dm.CapabilityNotSupported, `Client does not support sampling (required for ${e})`);
				break;
			case "elicitation/create":
				if (!this._clientCapabilities?.elicitation) throw new fm(dm.CapabilityNotSupported, `Client does not support elicitation (required for ${e})`);
				break;
			case "roots/list": if (!this._clientCapabilities?.roots) throw new fm(dm.CapabilityNotSupported, `Client does not support listing roots (required for ${e})`);
		}
	}
	assertNotificationCapability(e) {
		switch (e) {
			case "notifications/message":
				if (!this._capabilities.logging) throw new fm(dm.CapabilityNotSupported, `Server does not support logging (required for ${e})`);
				break;
			case "notifications/resources/updated":
			case "notifications/resources/list_changed":
				if (!this._capabilities.resources) throw new fm(dm.CapabilityNotSupported, `Server does not support notifying about resources (required for ${e})`);
				break;
			case "notifications/tools/list_changed":
				if (!this._capabilities.tools) throw new fm(dm.CapabilityNotSupported, `Server does not support notifying of tool list changes (required for ${e})`);
				break;
			case "notifications/prompts/list_changed":
				if (!this._capabilities.prompts) throw new fm(dm.CapabilityNotSupported, `Server does not support notifying of prompt list changes (required for ${e})`);
				break;
			case "notifications/elicitation/complete": if (!this._clientCapabilities?.elicitation?.url) throw new fm(dm.CapabilityNotSupported, `Client does not support URL elicitation (required for ${e})`);
		}
	}
	assertRequestHandlerCapability(e) {
		switch (e) {
			case "completion/complete":
				if (!this._capabilities.completions) throw new fm(dm.CapabilityNotSupported, `Server does not support completions (required for ${e})`);
				break;
			case "logging/setLevel":
				if (!this._capabilities.logging) throw new fm(dm.CapabilityNotSupported, `Server does not support logging (required for ${e})`);
				break;
			case "prompts/get":
			case "prompts/list":
				if (!this._capabilities.prompts) throw new fm(dm.CapabilityNotSupported, `Server does not support prompts (required for ${e})`);
				break;
			case "resources/list":
			case "resources/templates/list":
			case "resources/read":
				if (!this._capabilities.resources) throw new fm(dm.CapabilityNotSupported, `Server does not support resources (required for ${e})`);
				break;
			case "tools/call":
			case "tools/list": if (!this._capabilities.tools) throw new fm(dm.CapabilityNotSupported, `Server does not support tools (required for ${e})`);
		}
	}
	async _oninitialize(e) {
		let t = e.params.protocolVersion;
		this._clientCapabilities = e.params.capabilities, this._clientVersion = e.params.clientInfo;
		let n = bm(this._supportedProtocolVersions), r = n.includes(t) ? t : n[0] ?? "2025-11-25";
		return this._negotiatedProtocolVersion = r, this.transport?.setProtocolVersion?.(r), {
			protocolVersion: r,
			capabilities: this.getCapabilities(),
			serverInfo: this._serverInfo,
			...this._instructions && { instructions: this._instructions }
		};
	}
	_ondiscover() {
		return {
			supportedVersions: xm(this._supportedProtocolVersions),
			capabilities: ev(this.getCapabilities()),
			...this._instructions && { instructions: this._instructions }
		};
	}
	_outboundServerInfo() {
		return this._serverInfo;
	}
	getClientCapabilities() {
		return this._clientCapabilities;
	}
	getClientVersion() {
		return this._clientVersion;
	}
	getNegotiatedProtocolVersion() {
		return this._negotiatedProtocolVersion;
	}
	projectCallToolResult(e, t) {
		return this._wireCodec().projectCallToolResult(e, t);
	}
	getCapabilities() {
		return this._capabilities;
	}
	async ping() {
		return this._assertPushApiInServedEra("ping"), this.request({ method: "ping" });
	}
	async createMessage(e, t) {
		if (this._assertPushApiInServedEra("sampling/createMessage"), (e.tools || e.toolChoice) && !this._clientCapabilities?.sampling?.tools) throw new fm(dm.CapabilityNotSupported, "Client does not support sampling tools capability.");
		if (e.messages.length > 0) {
			let t = e.messages.at(-1), n = Array.isArray(t.content) ? t.content : [t.content], r = n.some((e) => e.type === "tool_result"), i = e.messages.length > 1 ? e.messages.at(-2) : void 0, a = i ? Array.isArray(i.content) ? i.content : [i.content] : [], o = a.some((e) => e.type === "tool_use");
			if (r) {
				if (n.some((e) => e.type !== "tool_result")) throw new Y(J.InvalidParams, "The last message must contain only tool_result content if any is present");
				if (!o) throw new Y(J.InvalidParams, "tool_result blocks are not matching any tool_use from the previous message");
			}
			if (o) {
				let e = new Set(a.filter((e) => e.type === "tool_use").map((e) => e.id)), t = new Set(n.filter((e) => e.type === "tool_result").map((e) => e.toolUseId));
				if (e.size !== t.size || ![...e].every((e) => t.has(e))) throw new Y(J.InvalidParams, "ids of tool_result blocks and tool_use blocks from previous message do not match");
			}
		}
		let n = !!(e.tools || e.toolChoice), r = await this.request({
			method: "sampling/createMessage",
			params: e
		}, t), i = this._wireCodec().samplingResultVariant(n, r);
		if (!i.ok) throw new fm(dm.InvalidResult, `Invalid sampling/createMessage result: ${i.reason === "invalid" ? i.message : i.reason}`);
		return i.value;
	}
	async elicitInput(e, t) {
		switch (this._assertPushApiInServedEra("elicitation/create"), e.mode ?? "form") {
			case "url":
				if (!this._clientCapabilities?.elicitation?.url) throw new fm(dm.CapabilityNotSupported, "Client does not support url elicitation.");
				break;
			case "form": if (!this._clientCapabilities?.elicitation?.form) throw new fm(dm.CapabilityNotSupported, "Client does not support form elicitation.");
		}
		return this._sendElicitationLeg(e, t);
	}
	async _sendElicitationLeg(e, t, n) {
		let r = e.mode ?? "form", i = n?.validateAcceptedContent ?? !0;
		switch (r) {
			case "url": {
				let n = e;
				return this.request({
					method: "elicitation/create",
					params: n
				}, t);
			}
			case "form": {
				let n = e.mode === "form" ? e : {
					...e,
					mode: "form"
				}, r = await this.request({
					method: "elicitation/create",
					params: n
				}, t);
				if (i && r.action === "accept" && r.content && n.requestedSchema) try {
					let e = this._jsonSchemaValidator.getValidator(n.requestedSchema)(r.content);
					if (!e.valid) throw new Y(J.InvalidParams, `Elicitation response content does not match requested schema: ${e.errorMessage}`);
				} catch (e) {
					throw e instanceof Y ? e : new Y(J.InternalError, `Error validating elicitation response: ${e instanceof Error ? e.message : String(e)}`);
				}
				return r;
			}
		}
	}
	createElicitationCompletionNotifier(e, t) {
		if (!this._clientCapabilities?.elicitation?.url) throw new fm(dm.CapabilityNotSupported, "Client does not support URL elicitation (required for notifications/elicitation/complete)");
		return () => this.notification({
			method: "notifications/elicitation/complete",
			params: { elicitationId: e }
		}, t);
	}
	async listRoots(e, t) {
		return this._assertPushApiInServedEra("roots/list"), this.request({
			method: "roots/list",
			params: e
		}, t);
	}
	async sendLoggingMessage(e, t) {
		if (this._capabilities.logging && !this.isMessageIgnored(e.level, t)) return this.notification({
			method: "notifications/message",
			params: e
		});
	}
	async sendResourceUpdated(e) {
		return this.notification({
			method: "notifications/resources/updated",
			params: e
		});
	}
	async sendResourceListChanged() {
		return this.notification({ method: "notifications/resources/list_changed" });
	}
	async sendToolListChanged() {
		return this.notification({ method: "notifications/tools/list_changed" });
	}
	async sendPromptListChanged() {
		return this.notification({ method: "notifications/prompts/list_changed" });
	}
};
function ev(e) {
	return { ...e };
}
function tv(e, t) {
	let n = 0, r = [e];
	for (; r.length > 0;) {
		let e = r.pop();
		if (typeof e == "object" && e) {
			if (Array.isArray(e)) for (let i of e) {
				if (++n > t) return n;
				typeof i == "object" && i && r.push(i);
			}
			else for (let i in e) {
				if (!Object.prototype.hasOwnProperty.call(e, i)) continue;
				if (++n > t) return n;
				let a = e[i];
				typeof a == "object" && a && r.push(a);
			}
		}
	}
	return n;
}
function nv(e) {
	if (e !== void 0 && e !== Infinity) {
		if (typeof e != "number" || Number.isNaN(e) || e < 1) throw RangeError(`maxToolInputElements must be a number of at least 1, or Infinity, got ${String(e)}`);
		return e;
	}
}
var rv = class {
	server;
	_maxToolInputElements;
	_registeredResources = {};
	_registeredResourceTemplates = {};
	_registeredTools = {};
	_registeredPrompts = {};
	_toolInputSchemaJson = {};
	toolInputSchemaJson(e) {
		let t = this._registeredTools[e];
		if (t !== void 0 && t.enabled) {
			if (Object.hasOwn(this._toolInputSchemaJson, e)) return this._toolInputSchemaJson[e];
			if (t.inputSchema === void 0) return av;
			try {
				let n = Eg(t.inputSchema, "input");
				return this._toolInputSchemaJson[e] = n, n;
			} catch {
				return;
			}
		}
	}
	constructor(e, t) {
		this.server = new $_(e, t), this._maxToolInputElements = nv(t?.maxToolInputElements), t?.capabilities?.tools && this.setToolRequestHandlers(), t?.capabilities?.resources && this.setResourceRequestHandlers(), t?.capabilities?.prompts && this.setPromptRequestHandlers();
	}
	async connect(e) {
		return B_(e) && e.setScopeChallengeResolver((e) => this.resolveScopeChallenge(e)), await this.server.connect(e);
	}
	async close() {
		await this.server.close();
	}
	resolveScopeChallenge = (e) => {
		switch (e.request.method) {
			case "tools/call": {
				let t = e.request.params?.name;
				if (typeof t != "string") return;
				let n = this._registeredTools[t];
				return n === void 0 || !n.enabled ? void 0 : n.scopeChallenge?.(e);
			}
			case "resources/read": {
				let t = e.request.params?.uri;
				if (typeof t != "string") return;
				let n;
				try {
					n = new URL(t);
				} catch {
					return;
				}
				let r = this._registeredResources[n.toString()];
				if (r !== void 0) return r.enabled ? r.scopeChallenge?.(e) : void 0;
				for (let t of Object.values(this._registeredResourceTemplates)) if (t.resourceTemplate.uriTemplate.match(n.toString())) return t.enabled ? t.scopeChallenge?.(e) : void 0;
				return;
			}
			case "prompts/get": {
				let t = e.request.params?.name;
				if (typeof t != "string") return;
				let n = this._registeredPrompts[t];
				return n === void 0 || !n.enabled ? void 0 : n.scopeChallenge?.(e);
			}
			default: return;
		}
	};
	_toolHandlersInitialized = !1;
	setToolRequestHandlers() {
		this._toolHandlersInitialized ||= (this.server.assertCanSetRequestHandler("tools/list"), this.server.assertCanSetRequestHandler("tools/call"), this.server.registerCapabilities({ tools: { listChanged: this.server.getCapabilities().tools?.listChanged ?? !0 } }), this.server.setRequestHandler("tools/list", () => ({ tools: Object.entries(this._registeredTools).filter(([, e]) => e.enabled).map(([e, t]) => {
			let n = {
				name: e,
				title: t.title,
				description: t.description,
				inputSchema: t.inputSchema ? ov(e, t.inputSchema) : av,
				annotations: t.annotations,
				icons: t.icons,
				execution: t.execution,
				_meta: t._meta
			};
			return t.outputSchema && (n.outputSchema = Eg(t.outputSchema, "output")), n;
		}) })), this.server.setRequestHandler("tools/call", async (e, t) => {
			let n = this._registeredTools[e.params.name];
			if (!n) throw new Y(J.InvalidParams, `Tool ${e.params.name} not found`);
			if (!n.enabled) throw new Y(J.InvalidParams, `Tool ${e.params.name} disabled`);
			try {
				let r = await this.validateToolInput(n, e.params.arguments, e.params.name), i = await this.executeToolHandler(n, r, t);
				return await this.validateToolOutput(n, i, e.params.name), og(i) ? i : this.server.projectCallToolResult(i, n.outputSchemaJson);
			} catch (e) {
				if (e instanceof Y && e.code === J.UrlElicitationRequired) throw e;
				return this.createToolError(e instanceof Error ? e.message : String(e));
			}
		}), !0);
	}
	createToolError(e) {
		return {
			content: [{
				type: "text",
				text: e
			}],
			isError: !0
		};
	}
	async validateToolInput(e, t, n) {
		if (this._maxToolInputElements !== void 0 && tv(t, this._maxToolInputElements) > this._maxToolInputElements) throw new Y(J.InvalidParams, `Invalid arguments for tool ${n}: arguments contain more than the maximum of ${this._maxToolInputElements} elements`);
		if (!e.inputSchema) return;
		let r = await Ag(e.inputSchema, t ?? {});
		if (!r.success) throw new Y(J.InvalidParams, `Input validation error: Invalid arguments for tool ${n}: ${r.error}`);
		return r.data;
	}
	async validateToolOutput(e, t, n) {
		if (!e.outputSchema || og(t) || t.isError) return;
		if (t.structuredContent === void 0) throw new Y(J.InvalidParams, `Output validation error: Tool ${n} has an output schema but no structured content was provided`);
		let r = await Ag(e.outputSchema, t.structuredContent);
		if (!r.success) throw new Y(J.InvalidParams, `Output validation error: Invalid structured content for tool ${n}: ${r.error}`);
	}
	async executeToolHandler(e, t, n) {
		return e.executor(t, n);
	}
	_completionHandlerInitialized = !1;
	setCompletionRequestHandler() {
		this._completionHandlerInitialized ||= (this.server.assertCanSetRequestHandler("completion/complete"), this.server.registerCapabilities({ completions: {} }), this.server.setRequestHandler("completion/complete", async (e) => {
			switch (e.params.ref.type) {
				case "ref/prompt": return sg(e), this.handlePromptCompletion(e, e.params.ref);
				case "ref/resource": return cg(e), this.handleResourceCompletion(e, e.params.ref);
				default: throw new Y(J.InvalidParams, `Invalid completion reference: ${e.params.ref}`);
			}
		}), !0);
	}
	async handlePromptCompletion(e, t) {
		let n = this._registeredPrompts[t.name];
		if (!n) throw new Y(J.InvalidParams, `Prompt ${t.name} not found`);
		if (!n.enabled) throw new Y(J.InvalidParams, `Prompt ${t.name} disabled`);
		if (!n.argsSchema) return uv;
		let r = pv(dv(n.argsSchema)?.[e.params.argument.name]);
		if (!N_(r)) return uv;
		let i = P_(r);
		return i ? lv(await i(e.params.argument.value, e.params.context)) : uv;
	}
	async handleResourceCompletion(e, t) {
		let n = Object.values(this._registeredResourceTemplates).find((e) => e.resourceTemplate.uriTemplate.toString() === t.uri);
		if (!n) {
			if (this._registeredResources[t.uri]) return uv;
			throw new Y(J.InvalidParams, `Resource template ${e.params.ref.uri} not found`);
		}
		let r = n.resourceTemplate.completeCallback(e.params.argument.name);
		return r ? lv(await r(e.params.argument.value, e.params.context)) : uv;
	}
	_resourceHandlersInitialized = !1;
	setResourceRequestHandlers() {
		this._resourceHandlersInitialized ||= (this.server.assertCanSetRequestHandler("resources/list"), this.server.assertCanSetRequestHandler("resources/templates/list"), this.server.assertCanSetRequestHandler("resources/read"), this.server.registerCapabilities({ resources: { listChanged: this.server.getCapabilities().resources?.listChanged ?? !0 } }), this.server.setRequestHandler("resources/list", async (e, t) => {
			let n = Object.entries(this._registeredResources).filter(([e, t]) => t.enabled).map(([e, t]) => ({
				uri: e,
				name: t.name,
				...t.metadata
			})), r = [];
			for (let e of Object.values(this._registeredResourceTemplates)) {
				if (!e.resourceTemplate.listCallback) continue;
				let n = await e.resourceTemplate.listCallback(t);
				for (let t of n.resources) r.push({
					...e.metadata,
					...t
				});
			}
			return { resources: [...n, ...r] };
		}), this.server.setRequestHandler("resources/templates/list", async () => ({ resourceTemplates: Object.entries(this._registeredResourceTemplates).map(([e, t]) => ({
			name: e,
			uriTemplate: t.resourceTemplate.uriTemplate.toString(),
			...t.metadata
		})) })), this.server.setRequestHandler("resources/read", async (e, t) => {
			let n;
			try {
				n = new URL(e.params.uri);
			} catch {
				throw new Y(J.InvalidParams, `Resource URI ${e.params.uri} is invalid`, {
					uri: e.params.uri,
					reason: "invalid_uri"
				});
			}
			let r = this._registeredResources[n.toString()];
			if (r) {
				if (!r.enabled) throw new Y(J.InvalidParams, `Resource ${n} disabled`);
				return nh(await r.readCallback(n, t), r.cacheHint);
			}
			for (let e of Object.values(this._registeredResourceTemplates)) {
				let r = e.resourceTemplate.uriTemplate.match(n.toString());
				if (r) {
					if (!e.enabled) throw new Y(J.InvalidParams, `Resource template ${e.resourceTemplate.uriTemplate} disabled`);
					return nh(await e.readCallback(n, r, t), e.cacheHint);
				}
			}
			throw new sh(e.params.uri);
		}), !0);
	}
	_promptHandlersInitialized = !1;
	setPromptRequestHandlers() {
		this._promptHandlersInitialized ||= (this.server.assertCanSetRequestHandler("prompts/list"), this.server.assertCanSetRequestHandler("prompts/get"), this.server.registerCapabilities({ prompts: { listChanged: this.server.getCapabilities().prompts?.listChanged ?? !0 } }), this.server.setRequestHandler("prompts/list", () => ({ prompts: Object.entries(this._registeredPrompts).filter(([, e]) => e.enabled).map(([e, t]) => ({
			name: e,
			title: t.title,
			description: t.description,
			arguments: t.argsSchema ? Ig(t.argsSchema) : void 0,
			icons: t.icons,
			_meta: t._meta
		})) })), this.server.setRequestHandler("prompts/get", async (e, t) => {
			let n = this._registeredPrompts[e.params.name];
			if (!n) throw new Y(J.InvalidParams, `Prompt ${e.params.name} not found`);
			if (!n.enabled) throw new Y(J.InvalidParams, `Prompt ${e.params.name} disabled`);
			return n.handler(e.params.arguments, t);
		}), !0);
	}
	registerResource(e, t, n, r) {
		let { cacheHint: i, scopeChallenge: a, ...o } = n, s = o;
		if (i !== void 0 && oh(i, `resource ${e}`), typeof t == "string") {
			if (this._registeredResources[t]) throw Error(`Resource ${t} is already registered`);
			let o = this._createRegisteredResource(e, n.title, t, s, a, r);
			return i !== void 0 && (o.cacheHint = i), this.setResourceRequestHandlers(), this.sendResourceListChanged(), o;
		}
		{
			if (this._registeredResourceTemplates[e]) throw Error(`Resource template ${e} is already registered`);
			let o = this._createRegisteredResourceTemplate(e, n.title, t, s, a, r);
			return i !== void 0 && (o.cacheHint = i), this.setResourceRequestHandlers(), this.sendResourceListChanged(), o;
		}
	}
	_createRegisteredResource(e, t, n, r, i, a) {
		let o = {
			name: e,
			title: t,
			metadata: r,
			readCallback: a,
			scopeChallenge: i,
			enabled: !0,
			disable: () => o.update({ enabled: !1 }),
			enable: () => o.update({ enabled: !0 }),
			remove: () => o.update({ uri: null }),
			update: (e) => {
				e.uri !== void 0 && e.uri !== n && (delete this._registeredResources[n], e.uri && (this._registeredResources[e.uri] = o)), e.name !== void 0 && (o.name = e.name), e.metadata !== void 0 && (o.metadata = e.metadata), e.title !== void 0 && (o.title = e.title, o.metadata = {
					...o.metadata,
					title: e.title
				}), e.callback !== void 0 && (o.readCallback = e.callback), e.scopeChallenge !== void 0 && (o.scopeChallenge = e.scopeChallenge === null ? void 0 : e.scopeChallenge), e.enabled !== void 0 && (o.enabled = e.enabled), this.sendResourceListChanged();
			}
		};
		return this._registeredResources[n] = o, o;
	}
	_createRegisteredResourceTemplate(e, t, n, r, i, a) {
		let o = {
			resourceTemplate: n,
			title: t,
			metadata: r,
			readCallback: a,
			scopeChallenge: i,
			enabled: !0,
			disable: () => o.update({ enabled: !1 }),
			enable: () => o.update({ enabled: !0 }),
			remove: () => o.update({ name: null }),
			update: (t) => {
				t.name !== void 0 && t.name !== e && (delete this._registeredResourceTemplates[e], t.name && (this._registeredResourceTemplates[t.name] = o)), t.template !== void 0 && (o.resourceTemplate = t.template), t.metadata !== void 0 && (o.metadata = t.metadata), t.title !== void 0 && (o.title = t.title, o.metadata = {
					...o.metadata,
					title: t.title
				}), t.callback !== void 0 && (o.readCallback = t.callback), t.scopeChallenge !== void 0 && (o.scopeChallenge = t.scopeChallenge === null ? void 0 : t.scopeChallenge), t.enabled !== void 0 && (o.enabled = t.enabled), this.sendResourceListChanged();
			}
		};
		this._registeredResourceTemplates[e] = o;
		let s = n.uriTemplate.variableNames;
		return Array.isArray(s) && s.some((e) => !!n.completeCallback(e)) && this.setCompletionRequestHandler(), o;
	}
	_createRegisteredPrompt(e, t, n, r, i, a, o, s) {
		let c = r, l = i, u = {
			title: t,
			description: n,
			argsSchema: r,
			icons: a,
			scopeChallenge: o,
			_meta: s,
			handler: cv(e, r, i),
			enabled: !0,
			disable: () => u.update({ enabled: !1 }),
			enable: () => u.update({ enabled: !0 }),
			remove: () => u.update({ name: null }),
			update: (t) => {
				t.name !== void 0 && t.name !== e && (delete this._registeredPrompts[e], t.name && (this._registeredPrompts[t.name] = u)), t.title !== void 0 && (u.title = t.title), t.description !== void 0 && (u.description = t.description), t.icons !== void 0 && (u.icons = t.icons), t.scopeChallenge !== void 0 && (u.scopeChallenge = t.scopeChallenge === null ? void 0 : t.scopeChallenge), t._meta !== void 0 && (u._meta = t._meta);
				let n = !1;
				t.argsSchema !== void 0 && (u.argsSchema = t.argsSchema, c = t.argsSchema, n = !0), t.callback !== void 0 && (l = t.callback, n = !0), n && (u.handler = cv(e, c, l)), t.enabled !== void 0 && (u.enabled = t.enabled), this.sendPromptListChanged();
			}
		};
		if (this._registeredPrompts[e] = u, r) {
			let e = dv(r);
			e && Object.values(e).some((e) => N_(pv(e))) && this.setCompletionRequestHandler();
		}
		return u;
	}
	_createRegisteredTool(e, t, n, r, i, a, o, s, c, l, u) {
		E_(e);
		let d = u, f, p = {
			title: t,
			description: n,
			inputSchema: r,
			outputSchema: i,
			get outputSchemaJson() {
				return f ??= sv(p.outputSchema);
			},
			set outputSchemaJson(e) {
				f = e;
			},
			annotations: a,
			icons: o,
			execution: s,
			scopeChallenge: c,
			_meta: l,
			handler: u,
			executor: iv(r, u),
			enabled: !0,
			disable: () => p.update({ enabled: !1 }),
			enable: () => p.update({ enabled: !0 }),
			remove: () => p.update({ name: null }),
			update: (t) => {
				t.name !== void 0 && t.name !== e && (typeof t.name == "string" && E_(t.name), delete this._registeredTools[e], delete this._toolInputSchemaJson[e], t.name && (delete this._toolInputSchemaJson[t.name], this._registeredTools[t.name] = p, e = t.name)), t.title !== void 0 && (p.title = t.title), t.description !== void 0 && (p.description = t.description);
				let n = !1;
				t.paramsSchema !== void 0 && (p.inputSchema = t.paramsSchema, delete this._toolInputSchemaJson[e], n = !0), t.callback !== void 0 && (p.handler = t.callback, d = t.callback, n = !0), n && (p.executor = iv(p.inputSchema, d)), t.outputSchema !== void 0 && (p.outputSchema = t.outputSchema, p.outputSchemaJson = sv(t.outputSchema)), t.annotations !== void 0 && (p.annotations = t.annotations), t.icons !== void 0 && (p.icons = t.icons), t.scopeChallenge !== void 0 && (p.scopeChallenge = t.scopeChallenge === null ? void 0 : t.scopeChallenge), t._meta !== void 0 && (p._meta = t._meta), t.enabled !== void 0 && (p.enabled = t.enabled), this.sendToolListChanged();
			}
		};
		return this._registeredTools[e] = p, this.setToolRequestHandlers(), this.sendToolListChanged(), p;
	}
	registerTool(e, t, n) {
		if (this._registeredTools[e]) throw Error(`Tool ${e} is already registered`);
		let { title: r, description: i, inputSchema: a, outputSchema: o, annotations: s, icons: c, scopeChallenge: l, _meta: u } = t;
		return this._createRegisteredTool(e, r, i, A_(a), A_(o), s, c, void 0, l, u, n);
	}
	registerPrompt(e, t, n) {
		if (this._registeredPrompts[e]) throw Error(`Prompt ${e} is already registered`);
		let { title: r, description: i, argsSchema: a, icons: o, scopeChallenge: s, _meta: c } = t, l = this._createRegisteredPrompt(e, r, i, A_(a), n, o, s, c);
		return this.setPromptRequestHandlers(), this.sendPromptListChanged(), l;
	}
	isConnected() {
		return this.server.transport !== void 0;
	}
	async sendLoggingMessage(e, t) {
		return this.server.sendLoggingMessage(e, t);
	}
	sendResourceListChanged() {
		this.isConnected() && this.server.sendResourceListChanged();
	}
	sendToolListChanged() {
		this.isConnected() && this.server.sendToolListChanged();
	}
	sendPromptListChanged() {
		this.isConnected() && this.server.sendPromptListChanged();
	}
};
function iv(e, t) {
	if (e) {
		let e = t;
		return async (t, n) => e(t, n);
	}
	let n = t;
	return async (e, t) => n(t);
}
var av = {
	type: "object",
	properties: {}
};
function ov(e, t) {
	let n = Eg(t, "input"), r = fg(n);
	return r.valid || console.warn(`[mcp-sdk] tool '${e}' carries an invalid x-mcp-header declaration and will be excluded by conforming Streamable HTTP clients: ${r.reason}`), n;
}
function sv(e) {
	if (e !== void 0) try {
		return Eg(e, "output");
	} catch {
		return;
	}
}
function cv(e, t, n) {
	if (t) {
		let r = n;
		return async (n, i) => {
			let a = await Ag(t, n ?? {});
			if (!a.success) throw new Y(J.InvalidParams, `Invalid arguments for prompt ${e}: ${a.error}`);
			return r(a.data, i);
		};
	}
	{
		let e = n;
		return async (t, n) => e(n);
	}
}
function lv(e) {
	return { completion: {
		values: e.map(String).slice(0, 100),
		total: e.length,
		hasMore: e.length > 100
	} };
}
var uv = { completion: {
	values: [],
	hasMore: !1
} };
function dv(e) {
	let t = e;
	if (t.shape && typeof t.shape == "object") return t.shape;
}
function fv(e) {
	return e?.type === "optional";
}
function pv(e) {
	return fv(e) ? e.def?.innerType ?? e : e;
}
// node_modules/@modelcontextprotocol/server/dist/listenRouter-Bartj63y.mjs
function mv(e, t) {
	switch (t.kind) {
		case "tools_list_changed": return e.toolsListChanged === !0;
		case "prompts_list_changed": return e.promptsListChanged === !0;
		case "resources_list_changed": return e.resourcesListChanged === !0;
		case "resource_updated": return e.resourceSubscriptions !== void 0 && e.resourceSubscriptions.includes(t.uri);
	}
}
function hv(e, t) {
	let n = {}, r = (e) => t === void 0 || e === !0;
	return e.toolsListChanged === !0 && r(t?.tools?.listChanged) && (n.toolsListChanged = !0), e.promptsListChanged === !0 && r(t?.prompts?.listChanged) && (n.promptsListChanged = !0), e.resourcesListChanged === !0 && r(t?.resources?.listChanged) && (n.resourcesListChanged = !0), e.resourceSubscriptions !== void 0 && e.resourceSubscriptions.length > 0 && r(t?.resources?.subscribe) && (n.resourceSubscriptions = [...e.resourceSubscriptions]), n;
}
var gv = 1024;
function _v(e, t) {
	return {
		method: e.method,
		params: {
			...e.params,
			_meta: {
				...e.params?._meta,
				[zu]: t
			}
		}
	};
}
function vv(e) {
	let t = Wh(Uh).validateRequest("subscriptions/listen", e);
	return t.ok ? t.value.params?.notifications : void 0;
}
var yv = /* @__PURE__ */ new Set([
	"notifications/tools/list_changed",
	"notifications/prompts/list_changed",
	"notifications/resources/list_changed",
	"notifications/resources/updated"
]), bv = class {
	_subs = /* @__PURE__ */ new Map();
	_serverCapabilities;
	_serverInfo;
	constructor(e = gv, t, n) {
		this._maxSubscriptions = e, this._serverCapabilities = t, this._serverInfo = n;
	}
	setServerCapabilities(e, t) {
		this._serverCapabilities = e, t !== void 0 && (this._serverInfo = t);
	}
	has(e) {
		return this._subs.has(e);
	}
	serve(e) {
		if (this._serverCapabilities === void 0) throw Error("StdioListenRouter.serve() called before setServerCapabilities(); refusing to honor a filter without capabilities");
		if (this._subs.size >= this._maxSubscriptions) return {
			jsonrpc: "2.0",
			id: e.id,
			error: {
				code: -32603,
				message: "Subscription limit reached"
			}
		};
		let t = vv(e);
		if (t === void 0) return {
			jsonrpc: "2.0",
			id: e.id,
			error: {
				code: -32602,
				message: "Invalid params: 'notifications' is required and must be a valid SubscriptionFilter"
			}
		};
		let n = hv(t, this._serverCapabilities);
		return this._subs.set(e.id, n), _v({
			method: "notifications/subscriptions/acknowledged",
			params: { notifications: n }
		}, e.id);
	}
	cancel(e) {
		return this._subs.delete(e);
	}
	routeOutbound(e) {
		if (!yv.has(e.method)) return "passthrough";
		let t = e.params?.uri, n = typeof t == "string" ? t : void 0, r = xv(e.method, n), i = [];
		for (let [t, n] of this._subs) mv(n, r) && i.push(_v({
			method: e.method,
			params: e.params ?? {}
		}, t));
		return i;
	}
	teardownAll() {
		let e = [];
		for (let t of this._subs.keys()) e.push({
			jsonrpc: "2.0",
			id: t,
			result: {
				resultType: "complete",
				_meta: {
					[zu]: t,
					...this._serverInfo !== void 0 && { "io.modelcontextprotocol/serverInfo": this._serverInfo }
				}
			}
		});
		return this._subs.clear(), e;
	}
};
function xv(e, t) {
	switch (e) {
		case "notifications/tools/list_changed": return { kind: "tools_list_changed" };
		case "notifications/prompts/list_changed": return { kind: "prompts_list_changed" };
		case "notifications/resources/list_changed": return { kind: "resources_list_changed" };
		default: return {
			kind: "resource_updated",
			uri: t ?? ""
		};
	}
}
// node_modules/@modelcontextprotocol/server/dist/stdio.mjs
var Sv = Symbol("swallowsErrorsAfterClose"), Cv = class {
	_readBuffer;
	_started = !1;
	_closed = !1;
	constructor(e = t.stdin, n = t.stdout, r) {
		this._stdin = e, this._stdout = n, this._readBuffer = new b_({ maxBufferSize: r?.maxBufferSize });
	}
	onclose;
	onerror;
	onmessage;
	_ondata = (e) => {
		try {
			this._readBuffer.append(e), this.processReadBuffer();
		} catch (e) {
			this.onerror?.(e), this.close().catch(() => {});
		}
	};
	_onerror = (e) => {
		this.onerror?.(e);
	};
	_onstdouterror = (e) => {
		this._closed || (this.onerror?.(e), this.close().catch(() => {}));
	};
	_onstdinclose = () => {
		this.close().catch(() => {});
	};
	async start() {
		if (this._started) throw Error("StdioServerTransport already started! If using Server class, note that connect() calls start() automatically.");
		this._started = !0;
		for (let e of this._stdout.listeners("error")) e[Sv] && this._stdout.off("error", e);
		(this._stdin.readableEnded || this._stdin.destroyed) && setImmediate(this._onstdinclose), this._stdin.on("data", this._ondata), this._stdin.on("error", this._onerror), this._stdin.on("end", this._onstdinclose), this._stdin.on("close", this._onstdinclose), this._stdout.on("error", this._onstdouterror);
	}
	processReadBuffer() {
		for (;;) try {
			let e = this._readBuffer.readMessage();
			if (e === null) break;
			this.onmessage?.(e);
		} catch (e) {
			this.onerror?.(e);
		}
	}
	async close() {
		this._closed || (this._closed = !0, this._stdin.off("data", this._ondata), this._stdin.off("error", this._onerror), this._stdin.off("end", this._onstdinclose), this._stdin.off("close", this._onstdinclose), this._onstdouterror[Sv] = !0, this._stdin.listenerCount("data") === 0 && this._stdin.pause(), this._readBuffer.clear(), this.onclose?.());
	}
	send(e) {
		return this._closed ? Promise.reject(/* @__PURE__ */ Error("StdioServerTransport is closed")) : new Promise((t, n) => {
			let r = S_(e), i = !1, a = (e) => {
				i || (i = !0, this._stdout.off("error", a), this._stdout.off("drain", o), n(e));
			}, o = () => {
				i || (i = !0, this._stdout.off("error", a), this._stdout.off("drain", o), t());
			};
			if (this._stdout.once("error", a), this._stdout.write(r)) {
				if (i) return;
				i = !0, this._stdout.off("error", a), t();
			} else i || this._stdout.once("drain", o);
		});
	}
}, wv = 3e3, Tv = class {
	onclose;
	onerror;
	onmessage;
	_closed = !1;
	_pendingRequests = /* @__PURE__ */ new Set();
	_drainWaiters = [];
	constructor(e, t, n) {
		this._wire = e, this._onInstanceClose = t, this._outboundIntercept = n;
	}
	async start() {}
	async send(e, t) {
		if (ig(e) || ag(e)) {
			let { id: t } = e;
			t !== void 0 && this._settle(t);
		}
		if (!this._closed && this._outboundIntercept?.(e) !== "handled") return this._wire.send(e, t);
	}
	setProtocolVersion = (e) => {
		this._wire.setProtocolVersion?.(e);
	};
	deliver(e, t) {
		if (!this._closed) {
			if (ng(e)) this._pendingRequests.add(e.id);
			else if (rg(e) && e.method === "notifications/cancelled") {
				let t = e.params?.requestId;
				t !== void 0 && this._settle(t);
			}
			this.onmessage?.(e, t);
		}
	}
	async whenRequestsAnswered(e) {
		return this._closed || this._pendingRequests.size === 0 ? !0 : await new Promise((t) => {
			let n = () => {
				clearTimeout(r), t(!0);
			}, r = setTimeout(() => {
				this._drainWaiters = this._drainWaiters.filter((e) => e !== n), t(!1);
			}, e);
			this._drainWaiters.push(n);
		});
	}
	async close() {
		if (!this._closed) {
			this._closed = !0, this._pendingRequests.clear(), this._releaseDrainWaiters();
			try {
				this._onInstanceClose();
			} finally {
				this.onclose?.();
			}
		}
	}
	_settle(e) {
		this._pendingRequests.delete(e), this._pendingRequests.size === 0 && this._releaseDrainWaiters();
	}
	_releaseDrainWaiters() {
		let e = this._drainWaiters;
		this._drainWaiters = [];
		for (let t of e) t();
	}
};
function Ev(e) {
	let t = e.params;
	if (e.method === "initialize" && !yg(t)) {
		let e = typeof t == "object" && t && typeof t.protocolVersion == "string" ? t.protocolVersion : void 0;
		return {
			kind: "legacy",
			reason: "initialize",
			...e !== void 0 && { requestedVersion: e }
		};
	}
	if (!Qh(t)) return {
		kind: "legacy",
		reason: "no-claim"
	};
	let n = Zh(t), r = (n === void 0 ? [] : eg(n))[0];
	if (r !== void 0) return {
		kind: "invalid-envelope",
		issue: r
	};
	let i = $h(t);
	return i === void 0 || !vm.includes(i) ? {
		kind: "unsupported-revision",
		requested: i ?? "unknown"
	} : {
		kind: "modern",
		revision: i,
		classification: {
			era: "modern",
			revision: i
		}
	};
}
function Dv(e, t = {}) {
	let n = t.legacy ?? "serve", r = t.transport ?? new Cv(), i = { phase: "opening" }, a, o = !1, s = () => o || i.phase === "closed", c = (e) => {
		try {
			t.onerror?.(e);
		} catch {}
	}, l = (e, t, n, i) => r.send({
		jsonrpc: "2.0",
		id: e,
		error: {
			code: t,
			message: n,
			...i !== void 0 && { data: i }
		}
	}).catch((e) => c(Ov(e))), u = new bv(t.maxSubscriptions ?? 1024), d = (e) => {
		if (!rg(e)) return;
		let t = u.routeOutbound(e);
		if (t !== "passthrough") {
			for (let e of t) r.send({
				jsonrpc: "2.0",
				...e
			}).catch((e) => c(Ov(e)));
			return "handled";
		}
	}, f = async (e) => {
		if (ng(e) && e.method === "subscriptions/listen") {
			let t = Zh(e.params), n = Qh(e.params) ? (t === void 0 ? [] : eg(t))[0] : {
				key: "_meta",
				problem: "the per-request envelope is required on protocol revision 2026-07-28"
			}, i = $h(e.params), a;
			if (n !== void 0) a = {
				jsonrpc: "2.0",
				id: e.id,
				error: {
					code: -32602,
					message: `Invalid _meta envelope: ${n.key}: ${n.problem}`
				}
			};
			else if (i === void 0 || !vm.includes(i)) {
				let t = new lh({
					supported: [...vm],
					requested: i ?? "unknown"
				});
				a = {
					jsonrpc: "2.0",
					id: e.id,
					error: {
						code: t.code,
						message: t.message,
						data: t.data
					}
				};
			} else a = u.serve(e);
			return await r.send("error" in a ? a : {
				jsonrpc: "2.0",
				method: a.method,
				params: a.params
			}).catch((e) => c(Ov(e))), !0;
		}
		if (rg(e) && e.method === "notifications/cancelled") {
			let t = e.params?.requestId;
			if (t !== void 0 && u.cancel(t)) return !0;
		}
		return !1;
	}, p = (e, t, n) => {
		let r = bg({
			kind: "legacy",
			reason: t,
			...n !== void 0 && { requestedVersion: n }
		}, vm);
		return r === void 0 ? Promise.resolve() : (c(/* @__PURE__ */ Error(`Rejected 2025-era request on a modern-only stdio connection (${r.cell}): ${r.message}`)), l(e.id, r.code, r.message, r.data));
	}, m = (e) => {
		o || e === a || S();
	}, h = async (t, n) => {
		let i = await e({ era: t }), a = i instanceof rv ? i.server : i;
		t === "modern" && (p_(a, n), Z_(a, vm), u.setServerCapabilities(a.getCapabilities(), Q_(a)));
		let o = new Tv(r, () => m(o), t === "modern" ? d : void 0);
		return await i.connect(o), {
			product: i,
			channel: o
		};
	}, g = (e) => e.product.close().catch((e) => c(Ov(e))), _ = async (e) => {
		a = e.channel;
		try {
			await e.channel.whenRequestsAnswered(wv) || c(/* @__PURE__ */ Error(`Discarded the probe instance with requests still unanswered after ${wv}ms; continuing with the fallback`)), await e.product.close();
		} catch (e) {
			c(Ov(e));
		} finally {
			a = void 0;
		}
	}, v = async (e) => {
		if (i.phase === "closed") return;
		if (i.phase === "pinned") {
			if (i.era === "modern" && ng(e) && e.method === "initialize" && !yg(e.params)) {
				await p(e, "initialize", e.params !== null && typeof e.params == "object" && typeof e.params.protocolVersion == "string" ? e.params.protocolVersion : void 0);
				return;
			}
			if (i.era === "modern" && await f(e) || s()) return;
			i.instance.channel.deliver(e);
			return;
		}
		if (!ng(e) && !rg(e)) {
			c(/* @__PURE__ */ Error("Discarded a JSON-RPC response received before the connection negotiated an era"));
			return;
		}
		let t = Ev(e);
		switch (t.kind) {
			case "invalid-envelope": {
				let n = `Invalid _meta envelope for protocol revision 2026-07-28: ${t.issue.key}: ${t.issue.problem}`;
				ng(e) ? await l(e.id, J.InvalidParams, n, { envelope: t.issue }) : c(/* @__PURE__ */ Error(`Discarded a notification with a malformed envelope: ${n}`));
				return;
			}
			case "unsupported-revision":
				if (ng(e)) {
					let n = new lh({
						supported: [...vm],
						requested: t.requested
					});
					c(n), await l(e.id, n.code, n.message, n.data);
				} else c(/* @__PURE__ */ Error(`Discarded a notification claiming unsupported protocol revision ${t.requested}`));
				return;
			case "modern":
				if (ng(e) && e.method === "server/discover") {
					if (i.phase === "probe") {
						i.instance.channel.deliver(e, { classification: t.classification });
						return;
					}
					let n = await h("modern", t.revision);
					if (s()) {
						await g(n);
						return;
					}
					i = {
						phase: "probe",
						instance: n
					}, n.channel.deliver(e, { classification: t.classification });
					return;
				}
				if (i.phase === "probe") {
					if (rg(e)) {
						i.instance.channel.deliver(e, { classification: t.classification });
						return;
					}
					i = {
						phase: "pinned",
						era: "modern",
						instance: i.instance
					};
				} else {
					let e = await h("modern", t.revision);
					if (s()) {
						await g(e);
						return;
					}
					i = {
						phase: "pinned",
						era: "modern",
						instance: e
					};
				}
				if (await f(e) || s()) return;
				i.instance.channel.deliver(e, { classification: t.classification });
				return;
			case "legacy": {
				if (n === "reject") {
					ng(e) && await p(e, t.reason, t.requestedVersion);
					return;
				}
				if (i.phase === "probe") {
					if (await _(i.instance), s()) return;
					i = { phase: "opening" };
				}
				let r = await h("legacy");
				if (s()) {
					await g(r);
					return;
				}
				i = {
					phase: "pinned",
					era: "legacy",
					instance: r
				}, i.instance.channel.deliver(e);
				return;
			}
		}
	}, y = [], b = !1, x = async () => {
		if (!b) {
			b = !0;
			try {
				for (; y.length > 0;) {
					let e = y.shift();
					try {
						await v(e);
					} catch (t) {
						ng(e) && await l(e.id, J.InternalError, "Internal server error"), c(Ov(t));
					}
				}
			} finally {
				b = !1;
			}
		}
	}, S = async () => {
		if (o || i.phase === "closed") return;
		o = !0;
		let e = i;
		i = { phase: "closed" };
		for (let e of u.teardownAll()) await r.send(e).catch((e) => c(Ov(e)));
		(e.phase === "probe" || e.phase === "pinned") && await e.instance.product.close().catch((e) => c(Ov(e))), await r.close().catch((e) => c(Ov(e)));
	};
	r.onmessage = (e) => {
		y.push(e), x();
	}, r.onerror = (e) => {
		c(e), (i.phase === "probe" || i.phase === "pinned") && i.instance.channel.onerror?.(e);
	}, r.onclose = () => {
		if (o || i.phase === "closed") return;
		o = !0;
		let e = i;
		i = { phase: "closed" }, (e.phase === "probe" || e.phase === "pinned") && e.instance.product.close().catch((e) => c(Ov(e)));
	};
	let C = r.start().catch((e) => {
		throw c(Ov(e)), e;
	});
	return C.catch(() => {}), { close: async () => {
		await C.catch(() => {}), await S();
	} };
}
function Ov(e) {
	return e instanceof Error ? e : Error(String(e));
}
// scripts/mcp-input-errors.mjs
Cu();
var kv = /* @__PURE__ */ new Set([
	"too_big",
	"too_small",
	"invalid_value",
	"invalid_format",
	"not_multiple_of"
]);
function Av(e) {
	let t = va().localeError(e), n = typeof t == "string" ? t : t?.message;
	if (n && kv.has(e.code) && Object.hasOwn(e, "input")) return `${n} (got ${bu(e.input)})`;
}
function jv() {
	Lt({ customError: Av });
}
// package.json
var Mv, Nv, Pv, Fv, Iv, Lv, Rv, zv, Bv, Vv, Hv, Uv, Wv, Gv, Kv, qv, Jv, Yv, Xv, Zv = A((() => {
	Mv = "@codepawlhq/67js", Nv = "0.19.0", Pv = "module", Fv = "3D engine that AI agents drive: an MCP server, PNG previews and CPU or GPU export to images and video", Iv = "https://67js.codepawl.com", Lv = {
		type: "git",
		url: "git+https://github.com/codepawl/67.js.git"
	}, Rv = { url: "https://github.com/codepawl/67.js/issues" }, zv = /* @__PURE__ */ "build,!build/film.js,bin,README.md,LICENSE,ROADMAP.md,THIRD-PARTY-NOTICES.md,skills,assets/looks,docs/agent-asset.md,docs/agent-character-motion.md,docs/agent-look.md,docs/agent-motion.md,docs/agent-render-jobs.md,docs/agent-review.md,docs/agent-scene.md,docs/export-glb.md,docs/gltf.md,docs/line-art.md,docs/mesh-blend.md,docs/guide.md,docs/lighting.md,docs/material-maps.md,docs/mcp.md,docs/mesh.md,docs/modeling.md,docs/physics.md,docs/runtime.md,docs/streaming.md,docs/netcode.md,docs/input.md,docs/physics-runtime.md,docs/audio.md,docs/animation-graph.md,docs/player.md,docs/vehicle.md,docs/game-rules.md,docs/game.md,docs/scene-query.md,docs/user-passes.md,docs/skeleton-pose.md,docs/verification.md".split(","), Bv = "./build/67.module.js", Vv = "./build/67.module.js", Hv = { "67js-mcp": "./bin/67js-mcp.mjs" }, Uv = { node: ">=20.19.0" }, Wv = {
		".": "./build/67.module.js",
		"./addons/model": "./build/model.js",
		"./addons/nature": "./build/nature.js",
		"./addons/motion": "./build/motion.js",
		"./addons/canvas2d": "./build/canvas2d.js",
		"./addons/gltf": "./build/gltf.js",
		"./addons/modeling": "./build/modeling.js",
		"./addons/sculpt": "./build/sculpt.js",
		"./addons/surface": "./build/surface.js",
		"./addons/mesh-query": "./build/mesh-query.js",
		"./addons/scene-query": "./build/scene-query.js",
		"./addons/mesh": "./build/mesh.js",
		"./addons/shrinkwrap": "./build/shrinkwrap.js",
		"./addons/surface-attachment": "./build/surface-attachment.js",
		"./addons/physics": "./build/physics.js",
		"./addons/spume": "./build/spume.js",
		"./addons/retarget": "./build/retarget.js",
		"./addons/crowd-skinning": "./build/crowd-skinning.js",
		"./addons/skeleton-pose": "./build/skeleton-pose.js",
		"./addons/vehicle": "./build/vehicle.js",
		"./addons/vegetation": "./build/vegetation.js",
		"./addons/terrain": "./build/terrain.js",
		"./addons/heightfield": "./build/heightfield.js",
		"./addons/export-mesh": "./build/export-mesh.js",
		"./addons/navmesh": "./build/navmesh.js",
		"./addons/grass": "./build/grass.js",
		"./addons/clutter": "./build/clutter.js",
		"./addons/light-bake": "./build/light-bake.js",
		"./addons/light-bake-gpu": "./build/light-bake-gpu.js",
		"./addons/ground-bounce": "./build/ground-bounce.js",
		"./addons/floor-sky-visibility": "./build/floor-sky-visibility.js",
		"./addons/path-tracer": "./build/path-tracer.js",
		"./addons/path-tracer-progressive": "./build/path-tracer-progressive.js",
		"./addons/path-tracer-realtime": "./build/path-tracer-realtime.js",
		"./addons/texture-set": "./build/texture-set.js",
		"./addons/agent-scene": "./build/agent-scene.js",
		"./addons/agent-asset": "./build/agent-asset.js",
		"./addons/hdri": "./build/hdri.js",
		"./addons/camera-effects": "./build/camera-effects.js",
		"./addons/water-reflection": "./build/water-reflection.js",
		"./addons/render-passes": "./build/render-passes.js",
		"./addons/user-pass": "./build/user-pass.js",
		"./addons/line-art": "./build/line-art.js",
		"./addons/mesh-blend": "./build/mesh-blend.js",
		"./addons/coplanar-overlap": "./build/coplanar-overlap.js",
		"./addons/reversed-depth": "./build/reversed-depth.js",
		"./addons/material-layer-shaders": "./build/material-layer-shaders.js",
		"./addons/view-transform-shader": "./build/view-transform-shader.js",
		"./addons/view-transform": "./build/view-transform.js",
		"./addons/liquid-shader": "./build/liquid-shader.js",
		"./addons/world-material-shader": "./build/world-material-shader.js",
		"./addons/splat-shader": "./build/splat-shader.js",
		"./addons/subsurface-shader": "./build/subsurface-shader.js",
		"./addons/fog-shader": "./build/fog-shader.js",
		"./addons/light-linking": "./build/light-linking.js",
		"./addons/cascaded-shadows": "./build/cascaded-shadows.js",
		"./addons/light-shapes": "./build/light-shapes.js",
		"./addons/compact-color": "./build/compact-color.js",
		"./addons/gaussian-splats": "./build/gaussian-splats.js",
		"./addons/replace-textured-parts": "./build/replace-textured-parts.js",
		"./addons/texture-update": "./build/texture-update.js",
		"./addons/cloth": "./build/cloth.js",
		"./addons/runtime": "./build/runtime.js",
		"./addons/streaming": "./build/streaming.js",
		"./addons/netcode": "./build/netcode.js",
		"./addons/input": "./build/input.js",
		"./addons/physics-runtime": "./build/physics-runtime.js",
		"./addons/physics-jolt": "./build/physics-jolt.js",
		"./addons/audio": "./build/audio.js",
		"./addons/animation-graph": "./build/animation-graph.js",
		"./addons/player": "./build/player.js",
		"./addons/game-rules": "./build/game-rules.js",
		"./addons/game": "./build/game.js",
		"./addons/update-part-vertices": "./build/update-part-vertices.js",
		"./package.json": "./package.json"
	}, Gv = {
		prepare: "node scripts/install-git-hooks.mjs",
		dev: "vite --host 127.0.0.1",
		build: "node scripts/prepare-release.mjs && vite build",
		"build:lib": "vite build --config vite.lib.config.js",
		"prepare:release": "node scripts/prepare-release.mjs",
		prepack: "npm run build:lib",
		deploy: "node scripts/deploy.mjs",
		preview: "vite preview --host 127.0.0.1",
		llms: "node scripts/generate-llms.mjs",
		test: "node --test",
		"test:isolated": "node scripts/test-each-file.mjs",
		"test:coverage": "node --test --experimental-test-coverage --test-coverage-exclude=\"tests/**\" --test-coverage-exclude=\"scripts/**\" --test-coverage-exclude=\"build/**\"",
		"coverage:gate": "node scripts/coverage-gate.mjs",
		preflight: "node scripts/preflight.mjs",
		smoke: "node scripts/smoke.mjs",
		"smoke:scenes": "node scripts/smoke-scenes.mjs",
		"smoke:vegetation-impostors": "node scripts/smoke-vegetation-impostors.mjs",
		"smoke:transport": "node scripts/smoke-film-transport.mjs",
		render: "node scripts/render-media.mjs",
		"docs:media": "node scripts/render-doc-media.mjs",
		score: "node scripts/score.mjs",
		"export:model": "node scripts/export-model.mjs",
		"smoke:package": "node scripts/smoke-package.mjs",
		mcp: "node bin/67js-mcp.mjs",
		"smoke:mcp": "node scripts/smoke-mcp.mjs",
		"smoke:mcp-package": "node scripts/smoke-mcp-package.mjs",
		"smoke:mcp-clients": "node scripts/smoke-mcp-clients.mjs",
		"smoke:kernel-workers": "node scripts/smoke-kernel-workers.mjs",
		"smoke:agent-topology": "node scripts/smoke-agent-topology.mjs",
		"smoke:agent-look": "node scripts/smoke-agent-look.mjs",
		"smoke:view-transform": "node scripts/smoke-view-transform.mjs",
		"smoke:agent-assets": "node scripts/smoke-agent-assets.mjs",
		"smoke:agent-vegetation": "node scripts/smoke-agent-vegetation.mjs",
		"smoke:agent-render-jobs": "node scripts/smoke-agent-render-jobs.mjs",
		"smoke:agent-post-pass": "node scripts/smoke-agent-post-pass.mjs",
		"smoke:agent-material-snippet": "node scripts/smoke-agent-material-snippet.mjs",
		"smoke:agent-texture-sequence": "node scripts/smoke-agent-texture-sequence.mjs",
		"smoke:render-passes": "node scripts/smoke-render-passes.mjs",
		"smoke:wireframe-pass": "node scripts/smoke-wireframe-pass.mjs",
		"smoke:object-motion-blur": "node scripts/smoke-object-motion-blur.mjs",
		"smoke:path-tracer": "node scripts/smoke-path-tracer.mjs",
		"smoke:film-timeline": "node scripts/smoke-film-timeline.mjs",
		"smoke:material-layers": "node scripts/smoke-material-layers.mjs",
		"smoke:agent-motion": "node scripts/smoke-agent-motion.mjs",
		"smoke:agent-physics": "node scripts/smoke-agent-physics.mjs",
		"smoke:agent-cloth": "node scripts/smoke-agent-cloth.mjs",
		"smoke:agent-particles": "node scripts/smoke-agent-particles.mjs",
		"smoke:frame-encoder": "node scripts/smoke-frame-encoder.mjs",
		"smoke:capture-parity": "node scripts/smoke-capture-parity.mjs",
		"smoke:enhancements": "node scripts/smoke-enhancements.mjs",
		"smoke:site": "node scripts/smoke-site.mjs",
		"smoke:agent-review-close": "node scripts/smoke-agent-review-close.mjs",
		"smoke:film-physics": "node scripts/smoke-film-physics.mjs",
		"plugin:sync": "node scripts/sync-plugin-version.mjs",
		"publish:ci": "node scripts/publish-ci.mjs",
		"smoke:character": "node scripts/smoke-character.mjs",
		"smoke:modeling": "node scripts/smoke-modeling.mjs",
		"smoke:material-maps": "node scripts/smoke-material-maps.mjs",
		"smoke:replace-textured-parts": "node scripts/smoke-replace-textured-parts.mjs",
		"smoke:texture-update": "node scripts/smoke-texture-update.mjs",
		"benchmark:mesh-query": "node scripts/benchmark-mesh-query.mjs",
		"benchmark:update-parts": "node scripts/benchmark-update-parts.mjs",
		"smoke:imported-topology": "node scripts/smoke-imported-topology.mjs",
		"smoke:agent-character": "node scripts/smoke-agent-character.mjs",
		"smoke:agent-retarget": "node scripts/smoke-agent-retarget.mjs",
		"smoke:agent-review": "node scripts/smoke-agent-review.mjs",
		"smoke:agent-branches": "node scripts/smoke-agent-branches.mjs",
		parity: "node scripts/parity-report.mjs",
		"bench:agent": "node bench/agent-modeling/bench.mjs",
		reference: "node bench/reference/run.mjs",
		"reference:line-art": "node bench/reference/line-art.mjs",
		size: "node scripts/measure-size.mjs",
		"size:release": "node scripts/measure-size.mjs --set-budgets",
		"tool-cost": "node scripts/check-tool-cost.mjs",
		"tool-cost:release": "node scripts/check-tool-cost.mjs --set-budgets",
		"benchmark:runtime": "node bench/runtime/run.mjs",
		"benchmark:streaming": "node bench/streaming-crossing/run.mjs",
		"benchmark:crowd": "node scripts/benchmark-crowd.mjs",
		"check:tool-schemas": "node scripts/check-tool-schemas.mjs",
		"check:links": "node scripts/check-links.mjs",
		changes: "node scripts/changelog-fragments.mjs",
		"changes:fold": "node scripts/changelog-fragments.mjs fold",
		"check:change-note": "node scripts/check-change-note.mjs",
		"check:links:package": "node scripts/check-links.mjs --package"
	}, Kv = {
		"@dimforge/rapier3d-compat": "0.21.0",
		"jolt-physics": "1.1.1",
		"manifold-3d": "3.5.4"
	}, qv = { "playwright-core": "1.64.1" }, Jv = {
		"@dimforge/rapier3d-compat": { optional: !0 },
		"jolt-physics": { optional: !0 },
		"manifold-3d": { optional: !0 }
	}, Yv = {
		"@codepawlhq/67js-denoise-oidn": "file:packages/denoise-oidn",
		"@dimforge/rapier3d-compat": "0.21.0",
		"@modelcontextprotocol/client": "2.4.0",
		"@modelcontextprotocol/server": "2.4.0",
		ajv: "^8.20.0",
		"ajv-formats": "^3.0.1",
		esbuild: "0.28.2",
		"gl-matrix": "3.4.4",
		"highlight.js": "11.12.0",
		"jolt-physics": "1.1.1",
		"manifold-3d": "3.5.4",
		meshoptimizer: "^1.3.0",
		playwright: "1.64.1",
		three: "0.187.0",
		"three-mesh-bvh": "0.9.17",
		vite: "8.3.5",
		wrangler: "4.156.1",
		ws: "^8.22.1",
		zod: "4.6.7"
	}, Xv = {
		name: Mv,
		version: Nv,
		private: !1,
		type: Pv,
		description: Fv,
		license: "MIT",
		homepage: Iv,
		repository: Lv,
		bugs: Rv,
		files: zv,
		main: Bv,
		module: Vv,
		bin: Hv,
		engines: Uv,
		exports: Wv,
		scripts: Gv,
		peerDependencies: Kv,
		dependencies: qv,
		peerDependenciesMeta: Jv,
		devDependencies: Yv
	};
})), Qv, $v, ey, ty, ny, ry, iy, ay, oy, sy = A((() => {
	Qv = /* @__PURE__ */ Object.freeze({
		weld: {
			fields: ["distance"],
			tags: []
		},
		triangulate: {
			fields: ["minVertices"],
			tags: []
		},
		edge_split: {
			fields: ["angle"],
			tags: []
		},
		smooth: {
			fields: ["factor", "iterations"],
			tags: []
		},
		simple_deform: {
			fields: [
				"mode",
				"axis",
				"angle",
				"factor"
			],
			tags: []
		},
		cast: {
			fields: ["factor", "size"],
			tags: []
		},
		screw: {
			fields: [
				"axis",
				"angle",
				"steps",
				"iterations",
				"lift"
			],
			tags: []
		},
		wireframe: {
			fields: [
				"thickness",
				"offset",
				"evenOffset",
				"replace"
			],
			tags: []
		},
		skin: {
			fields: ["radius"],
			tags: []
		},
		lattice: {
			fields: ["divisions", "moves"],
			tags: []
		},
		curve: {
			fields: ["path", "axis"],
			tags: []
		},
		hook: {
			fields: [
				"center",
				"radius",
				"translation",
				"strength",
				"falloff"
			],
			tags: []
		},
		wave: {
			fields: [
				"height",
				"width",
				"narrowness",
				"speed",
				"time",
				"timeOffset",
				"start",
				"cyclic",
				"axes",
				"normal"
			],
			tags: []
		},
		weighted_normal: {
			fields: ["angle", "weight"],
			tags: []
		},
		smooth_by_angle: {
			fields: ["angle", "ignoreSharp"],
			tags: []
		},
		bounding_box: {
			fields: [],
			tags: []
		},
		convex_hull: {
			fields: [],
			tags: []
		},
		build: {
			fields: [
				"order",
				"axis",
				"seed",
				"frame",
				"start",
				"length",
				"reverse"
			],
			tags: []
		},
		ocean: {
			fields: [
				"axis",
				"windSpeed",
				"direction",
				"choppiness",
				"size",
				"seed",
				"time",
				"resolution"
			],
			tags: []
		}
	}), $v = /* @__PURE__ */ Object.freeze({
		extrude_face_region: {
			fields: [
				"select",
				"name",
				"offset",
				"direction",
				"alongNormals"
			],
			tags: ["cap", "side"]
		},
		extrude_individual: {
			fields: [
				"select",
				"name",
				"offset",
				"direction"
			],
			tags: ["cap", "side"]
		},
		inset_region: {
			fields: [
				"select",
				"name",
				"thickness",
				"depth"
			],
			tags: ["cap", "rim"]
		},
		inset_individual: {
			fields: [
				"select",
				"name",
				"thickness",
				"depth"
			],
			tags: ["cap", "rim"]
		},
		delete: {
			fields: ["select"],
			tags: []
		},
		flip_normals: {
			fields: ["select"],
			tags: []
		},
		translate: {
			fields: [
				"select",
				"offset",
				"falloff"
			],
			tags: []
		},
		merge_by_distance: {
			fields: ["distance"],
			tags: []
		},
		tag: {
			fields: ["select", "name"],
			tags: []
		},
		boolean: {
			fields: [
				"name",
				"operation",
				"cutter",
				"translation",
				"rotation",
				"scale"
			],
			tags: ["cut"]
		},
		mirror: {
			fields: [
				"name",
				"axis",
				"merge"
			],
			tags: ["mirrored"]
		},
		array: {
			fields: [
				"name",
				"count",
				"offset",
				"relativeOffset",
				"merge"
			],
			tags: ["last"]
		},
		solidify: {
			fields: [
				"name",
				"thickness",
				"offset",
				"evenThickness"
			],
			tags: ["inner", "rim"]
		},
		bevel: {
			fields: [
				"name",
				"edges",
				"width",
				"segments",
				"profile",
				"clampOverlap"
			],
			tags: ["strip", "corner"]
		},
		loop_cut: {
			fields: [
				"name",
				"edges",
				"cuts",
				"factor"
			],
			tags: ["band-<k>"]
		},
		uv_unwrap: {
			fields: [
				"seams",
				"margin",
				"maxDistortion"
			],
			tags: []
		},
		uv_project: {
			fields: [
				"mode",
				"axis",
				"pack",
				"margin",
				"rotate"
			],
			tags: []
		},
		uv_pack: {
			fields: ["margin", "rotate"],
			tags: []
		},
		subdivide: {
			fields: [
				"levels",
				"crease",
				"sharpness"
			],
			tags: []
		},
		fill_holes: {
			fields: ["name", "sides"],
			tags: ["fill"]
		},
		dissolve_faces: {
			fields: ["select", "name"],
			tags: ["merged"]
		},
		dissolve_edges: {
			fields: ["edges", "name"],
			tags: ["merged"]
		},
		dissolve_verts: {
			fields: ["verts", "name"],
			tags: ["merged"]
		},
		dissolve_limited: {
			fields: [
				"edges",
				"angle",
				"name"
			],
			tags: ["merged"]
		},
		bisect_plane: {
			fields: [
				"name",
				"point",
				"normal",
				"distance",
				"clearInner",
				"clearOuter",
				"fill"
			],
			tags: [
				"inner",
				"outer",
				"cap"
			]
		},
		bridge_edge_loops: {
			fields: [
				"edges",
				"name",
				"segments",
				"twistOffset"
			],
			tags: ["bridge"]
		},
		subdivide_edges: {
			fields: [
				"edges",
				"name",
				"cuts"
			],
			tags: ["split"]
		},
		grid_fill: {
			fields: ["edges", "name"],
			tags: ["fill"]
		},
		knife_project: {
			fields: [
				"name",
				"path",
				"direction"
			],
			tags: ["cut"]
		},
		poke: {
			fields: [
				"select",
				"name",
				"offset",
				"relative"
			],
			tags: ["poke"]
		},
		dual: {
			fields: ["name"],
			tags: ["dual"]
		},
		tris_to_quads: {
			fields: [
				"select",
				"name",
				"angle"
			],
			tags: ["merged"]
		},
		symmetrize: {
			fields: [
				"name",
				"axis",
				"keep",
				"distance"
			],
			tags: ["mirrored"]
		},
		scale_elements: {
			fields: ["select", "scale"],
			tags: []
		},
		extrude_edges: {
			fields: [
				"edges",
				"name",
				"offset"
			],
			tags: ["side"]
		},
		split_edges: {
			fields: ["edges", "name"],
			tags: []
		},
		delete_loose: {
			fields: [],
			tags: []
		},
		flatten: {
			fields: [
				"verts",
				"normal",
				"factor"
			],
			tags: []
		},
		unsubdivide: {
			fields: [],
			tags: []
		},
		circularize: {
			fields: [
				"verts",
				"factor",
				"regular"
			],
			tags: []
		},
		set_position: {
			fields: [
				"select",
				"position",
				"offset"
			],
			tags: []
		},
		displace: {
			fields: [
				"select",
				"field",
				"strength",
				"midlevel",
				"direction",
				"group"
			],
			tags: []
		},
		vertex_group: {
			fields: [
				"select",
				"name",
				"weight",
				"field",
				"gradient",
				"measure",
				"gain",
				"angle",
				"rays",
				"distance",
				"seed"
			],
			tags: []
		},
		vertex_color: {
			fields: [
				"select",
				"color",
				"field",
				"gradient"
			],
			tags: []
		},
		decimate: {
			fields: ["ratio"],
			tags: []
		},
		remesh: {
			fields: ["voxelSize", "resolution"],
			tags: []
		},
		sculpt: {
			fields: ["select", "strokes"],
			tags: []
		},
		shrinkwrap: {
			fields: [
				"select",
				"target",
				"translation",
				"rotation",
				"scale",
				"mode",
				"direction",
				"offset",
				"maxDistance",
				"onMiss"
			],
			tags: []
		},
		...Qv
	}), ey = /* @__PURE__ */ Object.freeze([
		"mirror",
		"array",
		"solidify",
		"bevel",
		"uv_unwrap",
		"uv_project",
		"uv_pack",
		"subdivide",
		"set_position",
		"displace",
		"decimate",
		"remesh",
		...Object.keys(Qv)
	]), ty = 25e4, ny = /* @__PURE__ */ Object.freeze([
		"position",
		"normal",
		"index",
		"tag",
		"group"
	]), ry = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ "add.mul.min.max.sub.div.mod.pow.atan2.clamp.mix.smoothstep.neg.abs.sqrt.sin.cos.floor.ceil.round.fract.sign.saturate.lt.lte.gt.gte.eq.and.or.not.if.vec.dot.cross.distance.length.normalize.x.y.z.rotate.align.transform.attr.noise.random.nearest.raycast.faceArea.edgeAngle.island.neighbors.accumulate.statistic.blur.sampleIndex.rank".split(".")), iy = /* @__PURE__ */ Object.freeze([
		"grid",
		"scatter",
		"surface",
		"curve"
	]), ay = 2048, oy = /* @__PURE__ */ Object.freeze({
		maxTransferFraction: .25,
		maxEditedParts: 64
	});
})), cy, ly, uy = A((() => {
	cy = Object.freeze([
		"aces",
		"agx",
		"neutral"
	]), ly = Object.freeze([
		"warm",
		"cool",
		"contrast",
		"faded"
	]);
}));
// src/look-catalog.js
function dy(e) {
	return my.includes(e) || hy.test(e);
}
function fy(e) {
	let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), r = (e) => {
		if (!e || typeof e != "object") return;
		if (Array.isArray(e)) {
			e.forEach(r);
			return;
		}
		let i = e.environment;
		i && typeof i == "object" && !Array.isArray(i) && (typeof i.hdri == "string" && t.add(i.hdri), typeof i.look == "string" && dy(i.look) && n.add(i.look)), Object.values(e).forEach(r);
	};
	return r(e), {
		environments: [...t].sort(),
		looks: [...n].sort()
	};
}
var py, my, hy, gy = A((() => {
	py = Object.freeze(["sky-clouds", "studio-softbox"]), my = Object.freeze(["teal-orange", "noir"]), hy = /^[a-f0-9]{64}$/;
})), _y = A((() => {})), vy, yy, by, xy, Sy, Cy = A((() => {
	vy = Object.freeze([0, 1]), yy = Object.freeze({
		clearcoat: 0,
		clearcoatRoughness: 0,
		transmission: 0,
		thickness: 0,
		ior: 1.5,
		attenuationColor: Object.freeze([
			1,
			1,
			1
		]),
		attenuationDistance: Infinity,
		sheenColor: Object.freeze([
			0,
			0,
			0
		]),
		sheenRoughness: 0,
		specular: 1,
		specularColor: Object.freeze([
			1,
			1,
			1
		]),
		anisotropy: 0,
		anisotropyRotation: 0,
		iridescence: 0,
		iridescenceIor: 1.3,
		iridescenceThickness: 400,
		toon: 0
	}), by = Object.freeze(Object.keys(yy)), xy = Object.freeze({
		clearcoat: vy,
		clearcoatRoughness: vy,
		transmission: vy,
		thickness: Object.freeze([0, 1e3]),
		ior: Object.freeze([1, 2.5]),
		sheenRoughness: vy,
		specular: Object.freeze([0, 4]),
		anisotropy: vy,
		anisotropyRotation: Object.freeze([-2 * Math.PI, 2 * Math.PI]),
		iridescence: vy,
		iridescenceIor: Object.freeze([1, 3]),
		iridescenceThickness: Object.freeze([0, 1200]),
		toon: Object.freeze([0, 8])
	}), Sy = Object.freeze({
		attenuationColor: vy,
		sheenColor: vy,
		specularColor: Object.freeze([0, 4])
	});
})), wy, Ty, Ey, Dy, Oy, ky, Ay, jy, My, Ny, Py, Fy, Iy, Ly, Ry, zy, By, Vy, Hy, Uy, Wy, Gy, Ky, qy, Jy, Yy, Xy, Zy, Qy, $y = A((() => {
	uy(), gy(), _y(), sy(), Cy(), wy = Object.freeze({
		maxNodes: 4096,
		maxDepth: 256,
		maxGeometries: 256,
		maxMaterials: 256,
		maxVertices: 25e4,
		maxGeometryBytes: 33554432,
		maxOperations: 256,
		maxCheckpoints: 16,
		maxRecipeBytes: 1048576
	}), Ty = Object.freeze({
		lake: Object.freeze({
			absorption: Object.freeze([
				.35,
				.07,
				.04
			]),
			turbidity: .02
		}),
		sea: Object.freeze({
			absorption: Object.freeze([
				.4,
				.06,
				.02
			]),
			turbidity: .1
		}),
		river: Object.freeze({
			absorption: Object.freeze([
				.8,
				.9,
				1.6
			]),
			turbidity: .75
		})
	}), Ey = Object.freeze({
		clearcoat: "Lacquer lobe over the base, surface tag.",
		clearcoatRoughness: "Coat roughness.",
		transmission: "Refracts the opaque scene behind it, surface or liquid tag; blended parts do not show through; no anisotropy, iridescence, sheen or coat.",
		thickness: "Metres crossed; 0 does not bend the view.",
		ior: "Glass 1.5, water 1.33, diamond 2.42; sets the base reflectance.",
		attenuationColor: "Linear RGB kept after attenuationDistance.",
		attenuationDistance: "Metres to reach attenuationColor; omit for none.",
		sheenColor: "Linear RGB glow at grazing angles; black is off.",
		sheenRoughness: "Glow width.",
		specular: "Non-metal reflection, 1 is normal.",
		specularColor: "Linear RGB tint.",
		anisotropy: "Stretches highlights along the grain; the grain follows the UV direction, or rings the up axis without UVs.",
		anisotropyRotation: "Turns the grain around the normal, radians.",
		iridescence: "Thin-film colour shift on reflections.",
		iridescenceIor: "Film index of refraction.",
		iridescenceThickness: "Film nanometres; colours cycle as it grows.",
		toon: "Light steps (toon); 0 off."
	}), Dy = Object.freeze([
		"noise",
		"wood",
		"planks",
		"bricks",
		"tiles",
		"marble",
		"stone",
		"concrete",
		"metal",
		"rust",
		"fabric"
	]), Oy = Object.freeze([
		"color",
		"roughness",
		"metallic",
		"emission",
		"height",
		"opacity",
		"clearcoat",
		"transmission",
		"aov"
	]), ky = Object.freeze(/* @__PURE__ */ "uv.coord.mapping.vec.ramp.image.noise.whiteNoise.brick.voronoi.wave.checker.gradient.add.sub.mul.div.min.max.pow.abs.floor.fract.sqrt.invert.clamp.smoothstep.mix.layer.hue.curve".split(".")), Ay = Object.freeze({
		maxNodes: 64,
		maxDepth: 12,
		maxStops: 8,
		maxWork: 3e7
	}), jy = Object.freeze({
		maxCurvePoints: 1024,
		maxProfilePoints: 256,
		maxTextCharacters: 256,
		maxTextLines: 16,
		verticesPerCharacterSegment: 640,
		verticesPerCustomCharacterSegment: 2400,
		maxPointsPerGlyph: 128
	}), My = Object.freeze({
		curve: "bends along path, 2-64 points [x,y,z] (Catmull-Rom); the coordinate along axis (x) is the distance from the path start, so model from 0.",
		splines: "Geometry curve takes points (kind bezier|poly|nurbs, closed; nurbs also weights, order 2-8 default 4, and for open splines knotMode clamped|uniform or knots: point count plus order values that never decrease), or shape {type arc|spiral|star} (arc: radius, startAngle, sweep radians, segments; spiral: rotations, startRadius, endRadius, height, pointsPerRotation, reverse; star: points, innerRadius, outerRadius, innerTwist), or splines: up to 64 of those in one mesh. trim {start, end, length}: factors 0-1 of the arc length, or lengths when length is true; a trimmed curve is open. grow {name, steps 2-16, value}: morph targets of the curve grown step by step; animate with a motion track { kind: \"morph\", id: <name>, property: \"weight\", keyframes 0-1 } so a vine grows. See docs/modeling.md.",
		sdf: "Geometry sdf: root is a tree meshed by surface nets, resolution 4-128 cells along the longest side (default 32). Primitive {shape sphere|box|roundBox|capsule|cylinder|torus, radius, size, height, tubeRadius, position, rotation (Euler radians), scale (uniform)}. Operation {op union|subtract|intersect, smooth (blend radius), children: 2-16} (subtract removes the rest from the first) or {op offset, distance, child}. At most 64 nodes, 8 levels. See docs/modeling.md.",
		text: "Extruded text, baseline y=0 along +X, facing +Z. text (\n for lines), size (1), depth (0.2), align left|center|right, curveSegments, font. See docs/modeling.md."
	}), Ny = Object.freeze(["box", "uv"]), Py = Object.freeze({
		outputs: "color (linear RGB; a number is grey), roughness, metallic, emission (defaults to 1), height (normal map), opacity (alpha), clearcoat, transmission (masks), aov (linear RGB or scalar).",
		textures: Object.freeze({
			noise: "{\"noise\":{\"scale\":8,\"seed\":1,\"octaves\":4}}",
			voronoi: "{\"voronoi\":{\"scale\":6,\"output\":\"distance\"|\"edge\"|\"cell\"}}",
			wave: "{\"wave\":{\"frequency\":4,\"direction\":\"u\"|\"v\"|\"diagonal\",\"shape\":\"sine\"|\"saw\"|\"triangle\"}}",
			checker: "{\"checker\":{\"count\":8}} (even)",
			gradient: "{\"gradient\":{\"type\":\"u\"|\"v\"|\"radial\"}}",
			whiteNoise: "{\"whiteNoise\":{\"scale\":16,\"seed\":1,\"output\":\"value\"|\"color\"}} one random value per cell, tiles.",
			image: "{\"image\":{\"asset\":\"<64 hex catalog image asset ID>\",\"output\":\"color\"|\"alpha\"}} bilinear, repeats; color is linear RGB, decoded from sRGB. The host decodes catalog images (scene_asset_catalog); no URLs.",
			brick: "{\"brick\":{\"columns\":8,\"rows\":4,\"mortar\":0.05,\"offset\":0.5,\"seed\":1,\"output\":\"mortar\"|\"edge\"|\"cell\"}} running bond; rows even.",
			note: "Each takes \"at\", a vector such as {\"uv\":\"both\"}. Scales are whole numbers 1-64."
		}),
		uv: "{\"uv\":\"u\"|\"v\"|\"both\"} coordinates.",
		coordinates: "{\"coord\":\"generated\"|\"object\"|\"world\"} vector of where the texel sits: generated is the unit tile, object and world are metres across the tile (u * size); the third axis is 0 because a baked texture is projected. {\"mapping\":{\"vector\":node,\"scale\":n|[x,y,z],\"offset\":[x,y,z],\"rotate\":radians}} scales, turns around Z and moves a vector (default: generated). Feed either to \"at\". Meshes without UVs use box mapping; vertex_color already multiplies the baked colour. Not in graphs yet: AO, bevel, curvature, fresnel, vertexGroup (per-pixel or per-vertex data a bake does not have).",
		ramp: "{\"ramp\":{\"value\":node,\"stops\":[[0,[r,g,b]],[1,[r,g,b]]]}} 2-8 stops rising from 0 to 1.",
		mixing: "{\"layer\":{\"base\",\"top\",\"mask\",\"edge\",\"softness\"}}; {\"hue\":{\"color\",\"shift\",\"saturation\",\"value\"}}; {\"curve\":{\"value\",\"points\":[[x,y]]}}.",
		maths: "add sub mul div min max pow take [a,b]; abs floor fract sqrt invert take one node; clamp smoothstep mix take [a,b,c]; {\"vec\":[r,g,b]}.",
		mapping: "box (default) projects along object axes, no UVs; uv follows geometry UVs. size and axis only apply to box."
	}), Fy = Object.freeze([
		"opaque",
		"blend",
		"add"
	]), Iy = Object.freeze([
		"daylight",
		"overcast",
		"sunset",
		"studio"
	]), Ly = "daylight", Ry = Object.freeze([
		"albedo",
		"normal",
		"emission",
		"depth",
		"objectId",
		"diffuse",
		"glossy",
		"shadow",
		"ao",
		"mist",
		"position",
		"velocity",
		"uv",
		"transmission",
		"volume",
		"environment",
		"cryptomatte",
		"aov",
		"wireframe"
	]), zy = Object.freeze(["cpu", "nvenc"]), By = Object.freeze([
		"png",
		"png16",
		"exr"
	]), Vy = Object.freeze({
		draft: Object.freeze({
			samples: 32,
			bounces: 1,
			texelsPerUnit: 3
		}),
		standard: Object.freeze({
			samples: 128,
			bounces: 3,
			texelsPerUnit: 6
		}),
		fine: Object.freeze({
			samples: 128,
			bounces: 3,
			texelsPerUnit: 6
		})
	}), Object.freeze({
		samples: [1, 256],
		bounces: [1, 8],
		texelsPerUnit: [1, 12]
	}), Hy = 24e6, Uy = 1920, Wy = 2073600, Gy = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}\.(wav|mp3|ogg|flac)$/, Ky = Object.freeze({
		weld: "distance 0.001: merge closer vertices.",
		triangulate: "minVertices 4: split faces with that many corners or more.",
		edge_split: "angle 30: split edges bending more than this many degrees.",
		smooth: "factor 0.5 (-2 to 2) steps toward the neighbour mean; iterations 1 to 64.",
		simple_deform: "mode twist or bend use angle (45 degrees), taper or stretch use factor (0.5); axis x, y or z (z).",
		cast: "sphere about the origin: factor 0 to 1 (0.5), size radius (0 = mean vertex distance).",
		screw: "revolves every edge about axis x, y or z (z) through the origin, dropping faces: angle 360, steps 16 (1-256) and iterations 1-64, lift 0 per iteration. A whole number of turns with no lift closes the ring.",
		wireframe: "rim of thickness 0.02 on each face: offset -1..1 (0) moves the strut inside..outside, evenOffset true, replace true drops the faces.",
		skin: "closed square tube per edge: radius 0.1 or a scalar field per vertex (above 0). Simple: tubes overlap, no branch solver.",
		lattice: "divisions [2,2,2] (2-8) control points over the mesh bounds; moves up to 64 of {point:[i,j,k], offset:[x,y,z]}; trilinear blend.",
		curve: "bends the mesh along path, 2 to 64 points [x,y,z] through a Catmull-Rom spline. The coordinate along axis (x) is the distance from the path start, the other two become offsets in a twist-free frame; past the ends the mesh continues straight. Model the mesh along the axis starting at 0.",
		hook: "vertices within radius 1 of center [0,0,0] move by translation [0,0,0] times strength 0-1 (1); falloff smooth, linear or constant.",
		wave: "a gaussian ripple of height 0.5 along z (normal true: along the vertex normal) travelling from start [0,0] over axes xy (default), x or y; width 1.5, narrowness 0-50 (1.5), speed 0.25 per frame, time 0 (a frame), timeOffset 0, cyclic true repeats it. Matches Blender Wave.",
		weighted_normal: "corner normals weighted by face area ^ (weight/50), weight 1-100 (50), smoothed across edges under angle 30 that are not sharp. Put it last in the stack.",
		smooth_by_angle: "edges bending over angle 30 (0-180) become sharp, others smooth, over smoothAngle; ignoreSharp true also clears hand-made sharp edges.",
		bounding_box: "becomes its axis-aligned box.",
		convex_hull: "becomes its convex hull, up to 8192 vertices.",
		build: "shows faces one by one as frame runs from start 0 over length 60 frames (frame 0; give the current frame, e.g. from your film clock): order index (default), random (seed 0) or axis (axis y, lowest centroid first); reverse true unbuilds. Unused vertices drop; while none shows, one zero-area triangle stays.",
		ocean: "seeded sea: lifts axis (y) by waves of windSpeed 10 m/s (0-60) toward direction 0 deg, size 100 m (repeats), seed 0, time 0 s, resolution 8 (1-16); choppiness 1 (0-4) pulls points to crests. Writes group foam."
	}), qy = Object.freeze({
		vertex_group: "name (required) sets the weights 0-1 of the vertices of the selected faces; the rest keep theirs. One of weight (1), field, gradient { axis x|y|z, range [low, high], weights [atLow, atHigh] } or measure curvature (gain 0.1-16, 2; 0.5 flat, up convex), edge (angle 1-179 deg, 30; convex folds) or occlusion (rays 1-128, 32; distance m; seed). Max 32 groups. displace takes group: name and scales each move by the weight; cloth takes pinGroup. A stack node that rebuilds the mesh drops groups.",
		vertex_color: "sets the corner colors (0-1, linear, white until set) of the selected faces. One of color [r, g, b], field (vector expression of the vertex) or gradient { axis, range [low, high], colors [[r,g,b] atLow, [r,g,b] atHigh] } or { group, colors } of 2 or 3 stops along the weights of a vertex group (edge wear: curvature group, colors [dirt, paint, metal]). Drawn, written as COLOR_0 in a GLB, and multiplies the material color."
	}), Jy = Object.freeze({
		uv_project: "mode cube (each face by its dominant axis), cylinder (sides wrap around axis, caps flat) or sphere (longitude and latitude); axis x|y|z (y) for the last two, measured from the bounds centre; wrapped faces cut opposite the first radial axis. pack true (default) packs into 0..1 with one scale for every island so texel density is even; false leaves uv in mesh units for a later uv_pack. margin 0-0.2 (0.01); rotate true lays tall islands on their side. Reports islands. Texel density: cube exact, cylinder within about 15 percent, sphere stretches toward the poles.",
		uv_pack: "repacks the islands already in uv (faces joined across edges whose two ends share uv) into 0..1 with one scale. margin 0-0.2 (0.01), rotate true. Needs uv from uv_unwrap or uv_project. Reports islands."
	}), Yy = Object.freeze({ shapeKeys: "On a mesh geometry, at most 16: { name, offsets, value } or { name, edits, value }. offsets is a list of { select, offset: [x,y,z], falloff } moves like the translate edit; edits are vertex-moving mesh edits run after the stack. value (0, 0 to 1) is the weight without motion. Each key becomes a glTF morph target. Animate it with a motion track { kind: \"morph\", id: <key name>, property: \"weight\", keyframes }." }), Xy = Object.freeze({
		sculpt: "strokes run in order on the vertices of the selected faces; a tag confines them. A stroke has type inflate (along the vertex normal), displace (along direction, needed) or smooth (strength 0-1), center and radius, strength in mesh units. Falloff is smooth to zero at the radius.",
		shrinkwrap: "target is a primitive record placed by translation, rotation and scale. mode nearest (default) moves each selected vertex to the closest point; project moves it along direction (needed) to the first hit. offset (0) stands it off along the normal. maxDistance limits the search; onMiss error (default) or keep. For a decal, use enough grid cells, then solidify."
	}), Zy = Object.freeze({ cutter: "A primitive or profile record such as { type: \"cylinder\" }, or { geometry: \"<id>\" } naming another recipe geometry (a mesh with its own edits and stack, or a primitive). Put translation, rotation and scale on the edit. References form a DAG: a cycle or an unknown ID fails with the chain; at most 4 cutter geometries deep and 250000 estimated cutter vertices per mesh. Editing the cutter geometry rebuilds only the meshes that name it. Imported-part edits take inline records only." }), Qy = Object.freeze({
		format: "67js.scene",
		schemaVersion: 1,
		geometryTypes: Object.freeze([
			"box",
			"cylinder",
			"sphere",
			"cone",
			"icoSphere",
			"torus",
			"lathe",
			"extrude",
			"tube",
			"curve",
			"sdf",
			"text",
			"grid",
			"plane",
			"circle",
			"line",
			"terrain",
			"mesh"
		]),
		camera: "eye, target, up, near, far, then fov (vertical degrees) or focalLength (mm, with sensorWidth mm, 36; not both). projection orthographic with orthoScale (view height in m, default 4). shift [x, y] moves the frame by a fraction of its size. fStop (0.7-64) turns on depth of field focused on target; 1.4 or lower is full blur; effects.depthOfField.blur must stay 0. Orthographic/shifted cameras use the rasterizer.",
		terrain: "One mesh, x and z from -size/2 to size/2, hills about y = 0. size 40 m (1-2000), resolution 64 cells (2-256), seed 1, amplitude 1 m (0-200), holes up to 16 of {center:[x,z],radius}, no surface inside; radius a few cells or more.",
		placedAssets: "Node field asset:{id,materials?,clip?,drive?} turns a group node into a catalog GLB (id from asset_catalog). Its transform places it. materials:[{name,color,metallic,roughness,opacity,emission,emissiveColor}] override source materials by name. clip:{index,start=0,speed=1,loop=true} plays that clip from scene time start; set-motion tracks move the node and scene time seeks the clip. drive:{path | legs, cruiseSpeed | speed, wheels, lights} drives a car along a path in the placement frame (docs/vehicle.md). Max 512 placements, 16 assets, 16 animated.",
		navigation: "scene_inspect path:{ground,from:[x,z],to:[x,z]} returns a route over the ground node around its holes, steep slopes and the nodes in avoid:[ids] (box footprints), as keyframes [{time,value:[x,y,z]}] for a translation track with interpolation LINEAR. radius 0.3 m; maxSlope 40 degrees; cellSize defaults to radius; seconds or speed (1.4 m/s); lift adds y.",
		meshEdits: Object.freeze({
			operations: Object.freeze(Object.keys($v)),
			maxEdits: 64
		}),
		meshStack: Object.freeze({
			operations: ey,
			maxNodes: 16
		}),
		meshModifiers: Ky,
		meshSculpt: Xy,
		meshAttributes: qy,
		meshUv: Jy,
		meshBoolean: Zy,
		meshShapeKeys: Yy,
		fieldExpressions: Object.freeze({
			operators: ry,
			attributes: ny,
			maxNodes: 64,
			maxDepth: 12,
			maxElements: ty,
			rotation: "rotate [v, axis, rad]; align [dir]: Euler of +Y to dir; transform [p, move, euler, size].",
			meshShape: "faceArea {}; edgeAngle {} (radians, 0 on a border); island {}; neighbors {read edges|faces}. Over points faceArea is the mean of the faces around. A point set has no mesh and rejects them.",
			wholeDomain: "accumulate {value, group}; statistic {value, mode min|max|mean|sum|range, group}; blur {value, iterations 1-32, weight 0-1}; sampleIndex {value, index} (clamped); rank {value, descending} (Sort Elements index). value and group are number expressions.",
			surfaces: "nearest {surface, at, read distance|point|normal}; raycast {surface, at, direction, read hit|distance|point|normal, miss}. at defaults to position; rays go forward. surface: geometry id (instances where) or record (mesh edits). attr group + name reads a vertex group."
		}),
		instancing: Object.freeze({
			sources: iy,
			maxCandidatePoints: ay,
			place: "place {at vertices|faces, spacing, density 0-1, variants [id|{geometry, material}], variant, rotation Euler, size}; the last are fields."
		}),
		operations: Object.freeze([
			"set-node",
			"set-material",
			"set-camera",
			"add-node",
			"remove-node",
			"add-geometry",
			"remove-geometry",
			"add-material",
			"remove-material",
			"set-environment",
			"set-effects",
			"set-shadow",
			"set-motion",
			"set-armatures",
			"set-physics",
			"set-cloth",
			"set-timeline",
			"set-particles",
			"set-bake",
			"set-post-passes",
			"set-game",
			"edit-mesh",
			"set-mesh-stack",
			"bake-motion"
		]),
		materialTags: Object.freeze([
			"surface",
			"unlit",
			"liquid",
			"foam",
			"foliage",
			"grass",
			"water"
		]),
		water: Object.freeze({
			presets: Ty,
			default: "lake",
			note: "absorption 0..20, turbidity 0..1 softens shadows below; opacity under 1 shows the bed."
		}),
		materialLayers: Object.freeze(Object.fromEntries(by.map((e) => [e, Object.freeze({
			range: xy[e] ?? Sy[e] ?? "above 0",
			note: Ey[e]
		})]))),
		materialSubsurface: "material.subsurface { weight, radius, scale, color } as Blender Principled BSDF Subsurface; surface tag, rasterizer only. Ranges in scene_create.",
		materialWear: "material.wear { mask, threshold 0.5, softness 0.25, metal { color, metallic 1, roughness 0.3 }, dirt { mask, threshold, softness, color, roughness 0.9 } }: the material own color, metallic and roughness are the paint; per pixel it turns to the metal layer where the vertex group mask is high, then to dirt (no metal, rougher) where the dirt group is high. Masks are vertex groups of the node mesh (vertex_group measure edge, curvature or occlusion), so a mesh with no UVs works. Rasterizer only; not with baked sky visibility.",
		alphaModes: Fy,
		materialPatterns: Dy,
		maxMaterialPatterns: 16,
		materialMappings: Ny,
		renderPasses: Object.freeze({
			names: Ry,
			files: "render-<pass>.png/.exr or frame-N-<pass>.png/.exr (multilayer: true packs all into render.exr)",
			depth: "16 bits in red and green over 100 m",
			objectId: "24 bits in RGB; metrics.objectNames lists parts",
			cryptomatte: "R object hash, G material hash, B coverage; metrics.cryptomatte holds manifests",
			aov: "material.aov or pattern.graph.aov linear RGB",
			wireframe: "polygon edges over diffuse; open orange, non-manifold red, flipped cyan, degenerate magenta; metrics.wireframe"
		}),
		filmTimeline: Object.freeze({
			maxShots: 64,
			maxTotalSeconds: 60,
			maxShotSeconds: 30,
			shot: "name (unique), duration, motionStart (default: the shot start, so non-looping motion must cover it), camera (partial: eye target up fov near far), focusDistance (m) and blur (0 to 1) for the depth of field of the shot, dip (s; fades through black at the cut into this shot).",
			notSupported: "layers, overlaps, crossfades, markers, events, imported assets"
		}),
		curveText: Object.freeze({
			maxCurvePoints: jy.maxCurvePoints,
			maxProfilePoints: jy.maxProfilePoints,
			maxTextCharacters: jy.maxTextCharacters,
			maxTextLines: jy.maxTextLines,
			verticesPerCharacterSegment: jy.verticesPerCharacterSegment,
			details: My
		}),
		materialGraph: Object.freeze({
			outputs: Oy,
			operators: ky,
			...Ay,
			nodes: Py
		}),
		importedMeshEdits: Object.freeze({
			...oy,
			transfer: "New vertices take skin weights, morph deltas and colours from the nearest original surface point; faces without UVs read the nearest UV island. Unsupported: mesh_stack, relations, instancing.",
			rejects: "Skinned or morphed part: an edit farther than maxTransferFraction of the bounds diagonal from the original surface; booleans on open parts (fill_holes first)."
		}),
		fixedResources: !1,
		dynamicTopology: !0,
		checkpoints: !0,
		positiveScaleOnly: !0,
		gltfImport: "Optional extensions and line primitives load with a warning; unlit and punctual lights are read.",
		authoredLook: !0,
		maxPointLights: 16,
		catalogLooks: Object.freeze({
			hdri: "environment.hdri",
			hdris: py,
			cubeLooks: my,
			look: "environment.look",
			catalogId: "64-hex ID of a .hdr or .cube in scene_asset_catalog",
			note: "environmentIntensity and environmentRotation apply; keyIntensity 0 if the HDRI has a sun"
		}),
		physicalSky: "environment.sky {type:physical, sunElevation, sunRotation, turbidity, groundAlbedo, aerialPerspective} drives key, sky, fog",
		lightingSetups: Iy,
		defaultLightingSetup: Ly,
		ambientOcclusion: Object.freeze({
			default: 0,
			defaultRadius: .5,
			off: 0
		}),
		maxSpotLights: 8,
		maxAreaLights: 7,
		localShadows: Object.freeze({
			lights: Object.freeze(["pointLights", "spotLights"]),
			atlasTiles: 24,
			pointLightTiles: 6,
			spotLightTiles: 1,
			tileSize: 512
		}),
		lightLinking: Object.freeze({
			fields: Object.freeze([
				"environment.keyAffects",
				"pointLights[].affects",
				"spotLights[].affects",
				"areaLights[].affects"
			]),
			unlisted: "a light without affects lights every node",
			unknownNode: "rejected",
			bake: "honoured",
			pathTracer: "ignored, named in report.ignored"
		}),
		localVolumes: Object.freeze({
			field: "environment.localVolumes",
			maximum: 8,
			shapes: Object.freeze([
				"box",
				"sphere",
				"mesh"
			]),
			fields: "shape, center, size (box) or radius (sphere) or part + fit bounds|mesh (mesh: the named part, bounds by default; fit mesh fills a closed part, ignoring falloff, noise and steps), density 0-100 (1), falloff 0-1 (0.5), absorption rgb 0-1 (1,1,1), emission rgb 0-1, emissionStrength 0-1000 (1), noiseAmount 0-1 (0), noiseScale (1), steps 4-32 (16)",
			note: "Absorb and emit, no scattering; needs hdr and depth like volumeFog; noise is the same field in the rasterizer and the CPU path tracer; path tracer: backend cpu only (gpu, webgpu and native throw); a bake leaves them out, so an emissive volume lights no baked surface (bake report: skippedLocalVolumes, warnings)."
		}),
		shadowCascades: Object.freeze({
			field: "environment.shadowCascades",
			counts: Object.freeze([
				0,
				1,
				2,
				3,
				4
			]),
			zero: "one shadow map",
			automatic: "three cascades when shadow.extent is above 40 and the field is unset",
			maximumDistance: 150,
			note: "volume fog and water read the single map"
		}),
		lineArt: Object.freeze({
			field: "environment.lines",
			fields: "width px 0.25-16 (1.5), color, boundaries, creaseAngle deg (35), depthJump (0.08), toon steps 0-8, polylines [{points [x,y,z] 2-256, color, width, depthTest, closed}] max 64; {} turns on, null clears; material toon 0-8",
			note: "docs/line-art.md"
		}),
		viewTransform: Object.freeze({
			field: "environment.viewTransform",
			names: cy,
			default: "aces",
			look: "environment.look",
			looks: ly,
			choose: "agx for lit scenes and Blender comparisons, neutral for product and brand colour, aces for contrast; needs loadAgentSceneModules"
		}),
		renderFlags: Object.freeze({
			nodeFields: Object.freeze([
				"visible",
				"castShadow",
				"receiveShadow",
				"holdout",
				"shadowCatcher"
			]),
			motion: "node track property visible: 1 or 0, STEP",
			note: "visible:false hides a node and children; holdout and shadowCatcher need a transparent canvas (Renderer67 transparent:true); flags split batches. Blended and transmissive parts cast a sun shadow weighted by opacity and tinted by colour (1024 map, one extra draw of those parts only); castShadow:false turns it off, and cascades or splat/3-layer-map receivers skip the tint."
		}),
		depthBias: Object.freeze({
			nodeFields: Object.freeze(["decal", "depthLayer"]),
			maxDepthLayer: 4,
			environment: "environment.resolveCoplanar",
			modes: Object.freeze(["offset", !1]),
			default: "offset",
			warning: "coplanar-overlap",
			note: "Automatic: flush or near-flush faces, inside one mesh or across parts, are ranked per triangle at draw time, the front face wins, geometry never moves; no field needed. resolveCoplanar false opts out. decal wins over the surface below; depthLayer stacks decals. scene_inspect flush.ranked counts ranked parts. A coplanar-overlap warning carries reason rank-overflow (over 15 stacked faces: remove duplicates), double-sided-gap, unchecked or collapsed-node."
		}),
		proceduralMotion: !0,
		motionIk: Object.freeze([
			"two-bone",
			"aim",
			"chain",
			"spline"
		]),
		relations: Object.freeze({
			maxPerNode: 8,
			maxNodes: 256,
			sides: Object.freeze([
				"+x",
				"-x",
				"+y",
				"-y",
				"+z",
				"-z"
			]),
			kinds: Object.freeze({
				attach: "to, side, offset: touch the target face on side and centre on the other axes; offset is distance, negative sinks in",
				gap: "to, side, offset: as attach on that axis only",
				flush: "to, side, offset: own face on side level with the same face of the target",
				align: "to, axis, at (min, center, max), offset: anchor on one axis",
				centered: "to, axes (default x, y, z): centre on those axes"
			}),
			notes: "Region (mesh tag): target faces only. One relation per axis, no loops, mesh nodes only. A relation sets translation on its axes. set-node with relations [] removes them."
		}),
		rigging: Object.freeze({
			presets: Object.freeze(["humanoid", "quadruped"]),
			maxArmatures: 16,
			maxBones: 128,
			maxInfluences: 4,
			weights: "bone-distance"
		}),
		motionConstraints: Object.freeze([
			"copy_location",
			"copy_rotation",
			"copy_scale",
			"limit_location",
			"limit_rotation",
			"track_to",
			"child_of",
			"floor",
			"copy_transforms",
			"limit_distance",
			"limit_scale",
			"stretch_to",
			"locked_track",
			"transformation",
			"action",
			"maintain_volume",
			"damped_track",
			"pivot",
			"follow_path",
			"clamp_to",
			"shrinkwrap",
			"armature"
		]),
		motionDrivers: Object.freeze({
			maxDrivers: 32,
			maxConstraints: 32,
			maxProperties: 32,
			maxPropertyKeys: 16,
			targets: Object.freeze([
				"node",
				"material",
				"light",
				"morph",
				"camera"
			]),
			variables: Object.freeze([
				"time",
				"node",
				"custom",
				"distance",
				"rotationDifference"
			]),
			maxExpressionParts: 64,
			maxExpressionDepth: 8
		}),
		physics: Object.freeze({
			bodyTypes: Object.freeze([
				"dynamic",
				"fixed",
				"kinematic"
			]),
			shapes: Object.freeze([
				"box",
				"ball",
				"capsule",
				"convex",
				"trimesh"
			]),
			jointTypes: Object.freeze([
				"spherical",
				"revolute",
				"prismatic",
				"fixed"
			]),
			sensors: !0,
			collisionLayers: 16,
			ragdoll: "physics.ragdoll {armature}: limp capsule per bone; needs a floor",
			limits: Object.freeze({
				maxBodies: 64,
				maxJoints: 64,
				maxDuration: 10,
				framesPerSecond: 60,
				maxTrimeshTriangles: 2e4,
				maxHullPoints: 2048
			})
		}),
		cloth: Object.freeze({
			sheetGeometry: "grid { segments 1-64 }: unit sheet in XY facing +Z, sized by node scale; any triangle mesh works",
			defaults: Object.freeze({
				stiffness: .9,
				bend: .1,
				density: .2,
				damping: .3,
				friction: .3,
				thickness: .01,
				colliderShape: "box"
			}),
			notes: "density kg/m2, damping 1/s, thickness m, wind m/s steady. Colliders { node, shape ball|box } fit geometry bounds; like sheets they are root nodes without a motion track or body. Moving: { attach, shape ball|capsule, radius, offset, to, toOffset } or { armature, radiusFraction, exclude }. Sheet pinGroup: a vertex group whose vertices (weight 0.5 or more) are held. Sheet pinTo { node, weight } rides pinned edges on a node. Sheet stiffnessGroup: vertex group whose weights scale stiffness (floor 0.05). Sheet softBody { shape 0-1 (0.2), pressure 0-3 (1), bounce 0-1 (0) }: shape matching plus a volume term; pressure needs a closed mesh, a node with an open mesh fails and says to set pressure 0. bounce is the share of its landing speed the body keeps when it turns around; lower shape or sheet stiffness makes a softer, deeper dent. Sheet selfCollision true: particles of the sheet push apart (radius 0.9 of half the shortest edge, or the sheet thickness when set, up to 2000 particles); cloth does not collide with other sheets.",
			limits: Object.freeze({
				maxSheets: 8,
				maxColliders: 16,
				maxMovingColliders: 64,
				maxDuration: 10,
				maxParticles: 5e3,
				framesPerSecond: 60,
				substeps: 4,
				iterations: 8
			})
		}),
		particles: Object.freeze({
			emitter: "System node geometry is the particle shape; its transform does not move them. Fields (defaults): node, seed (1), count (100), rate (per second; omit: burst at 0), lifetime, speed, size (number or [min, max]; 1, 1, 0.05), direction ([0,1,0]), spread (cone degrees, 30), emitter { shape point|box|sphere|disc|mesh, position, halfExtents, radius; mesh: mesh node, group (vertex group weighting surface, vertices or edges), from surface (area weighted)|vertices|edges (length weighted)|volume (closed mesh), sharpAngle (degrees, edges only: keep open or bent edges), normalSpeed m/s along the normal }, instances [node ids, up to 8: each particle draws one], orient none|random|normal (mesh surface, vertices or edges), scale constant|shrink|grow, drag (1/s, 0), floor (world y they land on).",
			hair: "type hair grows strands from a read-only root surface node into node (its own geometry is ignored). Fields (defaults): surface, seed, count, length (m, number or [min, max], 0.1), segments (1-8, 4), width (m, 0.004), droop (0.5), lean (0.2), sway (tip travel m, off), swayRate (Hz, 0.5). Tapering tubes, no UVs.",
			sectionFields: "systems, gravity ([0,-9.81,0]), wind (m/s; moves emitter particles only with drag > 0, and sets the hair sway direction), fields (also cloth; wind, turbulence, vortex, drag, magnet: docs/physics.md)",
			collision: "colliders [node ids], bounce 0-1 (0.3 with colliders), friction 0-1 (0.5), spin deg/s, color [[r,g,b] birth, [r,g,b] death], alpha [birth, death].",
			notes: "Pure function of seed, index and time; raising count keeps earlier ones. No hair collision.",
			limits: Object.freeze({
				maxSystems: 4,
				maxParticlesPerSystem: 2e3,
				maxParticles: 4e3,
				maxVertices: 1e5,
				maxLifetime: 60
			})
		}),
		bake: Object.freeze({
			fields: "preset, or samples (1-256), bounces (1-8), texelsPerUnit (1-12) over it; irradianceGrid true or 8-48 nodes: baked bounced diffuse light in place of lightmaps (opt in, static); gridFog true adds the fog (sunlit closed rooms); probes room by default, false for none, or up to 4 {position, radius?}; rebake true bakes each sampled pose (4 kept).",
			presets: Vy,
			notes: "Bounced light from point, spot, area and key lights. Skips alpha, skin, morph, hair, cloth (bake.skipped). A preset shrinks to fit (bake.used, bake.reduction); explicit settings fail over maxPathWork or past maxSeconds. No environment map or specular; probes are specular, not in glTF.",
			limits: Object.freeze({
				maxSeconds: 20,
				workerMaxSeconds: 90,
				maxPathWork: Hy,
				maxPointLights: 16
			})
		}),
		motionLook: Object.freeze({
			light: "id point:N, spot:N or area:N (index in its list): position, color, intensity; direction on spot and area",
			sun: "direction, color, intensity (lightDirection, keyColor, keyIntensity)",
			environment: "skyTop, skyBottom, fogColor, fogDensity, volumeFogDensity, ambientIntensity, fillIntensity, environmentIntensity, environmentRotation",
			effects: "exposure, focusDistance (needs effects.depthOfField.blur above 0; an fStop camera focuses on its target)",
			note: "Same keyframes and easing as other tracks. After sampleMotion, scene.environment and scene.effects hold the sampled values."
		}),
		motionModifiers: "Track extrapolation constant|linear; modifiers [{type: cycles|stepped|noise|generator|limits|envelope, ...}], 8 at most; cycles and stepped remap time first.",
		motionLimits: Object.freeze({
			maxTracks: 128,
			maxKeyframesPerTrack: 64,
			maxKeyframes: 2048,
			maxDuration: 30
		}),
		motionBake: "scene_apply bake-motion { nodes (32 at most), start 0, end (motion or physics duration), step 1/30 (512 samples), tolerance { position m, angle deg, scale } }: samples tracks, IK, constraints, drivers and physics into LINEAR tracks and removes those sources (an IK solver or the physics world only when all its nodes are baked). tolerance drops keys within it; without it a track keeps every sample, 64 keys at most. Procedural scenes only."
	});
}));
// src/subsurface-limits.js
function eb(e) {
	let { weight: t = nb.weight, radius: n = nb.radius, scale: r = nb.scale, color: i = [
		-1,
		-1,
		-1
	] } = e;
	return [
		t,
		...n.map((e) => e * r),
		...i
	];
}
var tb, nb, rb, ib = A((() => {
	tb = Object.freeze([0, 1]), nb = Object.freeze({
		weight: 0,
		radius: Object.freeze([
			1,
			.2,
			.1
		]),
		scale: .05
	}), rb = Object.freeze({
		weight: tb,
		radius: Object.freeze([0, 100]),
		scale: Object.freeze([0, 10]),
		color: tb
	});
}));
Zv(), $y(), ib();
var ab = G(["concise", "detailed"]).optional(), ob = {
	scene_review: "concise",
	scene_render_status: "concise",
	scene_render_result: "concise",
	scene_capabilities: "detailed"
};
function sb(e, t) {
	return t ?? ob[e];
}
function cb(e, t) {
	let n = { ...e };
	for (let e of t) delete n[e];
	return n;
}
var lb = [
	"graphics",
	"estimatedBytes",
	"samples",
	"hdr",
	"depth",
	"geometryBuffers",
	"materialTextures",
	"skinTextures",
	"morphTextures",
	"gpuBuffers",
	"drawBatches",
	"requestedWidth",
	"requestedHeight",
	"width",
	"height"
], ub = [
	"backend",
	"peakNodeBytes",
	"peakBrowserHeap",
	"maximumPendingFrames",
	"elapsedSeconds"
];
function db(e) {
	let t = cb(e, lb);
	return t.animation === null && delete t.animation, t.motionTime === null && delete t.motionTime, t.rendererTime === 0 && delete t.rendererTime, t;
}
function fb(e) {
	return {
		...cb(e, ub),
		shots: e.shots.map(db)
	};
}
function pb(e) {
	let t = {
		jobId: e.jobId,
		state: e.state,
		frames: e.progress?.frames
	};
	return e.settings?.frameCount !== void 0 && (t.frameCount = e.settings.frameCount), e.reason !== void 0 && (t.reason = e.reason), e.artifacts?.length && (t.artifacts = e.artifacts.map((e) => e.filename)), t;
}
var mb = [
	"graphics",
	"estimatedBytes",
	"peakNodeBytes",
	"peakBrowserHeap",
	"maximumPendingFrames",
	"requestedWidth",
	"requestedHeight",
	"elapsedSeconds",
	"captureSeconds"
];
function hb(e) {
	let t = {
		jobId: e.jobId,
		sourceRevision: e.sourceRevision,
		artifacts: e.artifacts.map((e) => cb(e, ["sha256"]))
	};
	return e.metrics !== void 0 && (t.metrics = cb(e.metrics, mb)), t;
}
var gb = " // ", _b = "_";
function vb(e) {
	if (typeof e == "string") return e.split(gb)[0];
	if (Array.isArray(e)) return e.map(vb);
	if (e && typeof e == "object") {
		let t = {};
		for (let [n, r] of Object.entries(e)) n !== _b && (t[n] = vb(r));
		return t;
	}
	return e;
}
// scripts/mcp-call-log.mjs
var yb = "SIXTYSEVENJS_MCP_LOG";
function bb(e) {
	let t = 0;
	for (let n of e?.content ?? []) typeof n.text == "string" ? t += Buffer.byteLength(n.text) : typeof n.data == "string" && (t += n.data.length);
	return t;
}
function xb(e, { now: t = () => performance.now(), clock: n = () => /* @__PURE__ */ new Date() } = {}) {
	return e ? async function(r, i) {
		let a = t(), o, s;
		try {
			o = await i();
		} catch (e) {
			s = e;
		}
		let c = s !== void 0 || o?.isError === !0, l = {
			time: n().toISOString(),
			tool: r,
			durationMs: Math.round((t() - a) * 10) / 10,
			ok: !c,
			...c ? { error: s === void 0 ? "tool_error" : "thrown" } : {},
			resultBytes: bb(o)
		};
		try {
			E(e, `${JSON.stringify(l)}\n`);
		} catch (e) {
			console.error(`67js call log write failed: ${e.message}`);
		}
		if (s !== void 0) throw s;
		return o;
	} : null;
}
// src/agent-vegetation-notes.js
var Sb, Cb = A((() => {
	Sb = "Node field vegetation turns a group node into trees (src/vegetation.js). One tree: {species: broadleaf|birch|conifer|palm|bush, seed=1, height?, leaves: cards|mesh}, grown at the node transform. A scatter: {mix:{species:weight, also grass and flowers}, seed, leaves, scatter:{ground: terrain node ID, density=0.012 per m2, slopeLimit=32 degrees, area?:{min:[x,z],max:[x,z]}, exclude?:[{center:[x,z],radius}|{min,max}|{node,radius}], variants=3 (1-4), scale?:[min,max]}}; terrain holes stay clear. Instances sit in the ground node frame, so give the group the ground transform. Levels (0 full to 3 far) come from the recipe camera eye at each edit, never from a frame, plus optional cullDistance m and distanceScale, so a seek cannot change them. season 0 summer, 0.35 gold, 0.6 orange, 0.85 brown, 0.9 and up bare for broadleaf, birch and bush (conifer and palm stay green). scatterVegetation from 67js/addons/vegetation gives the same instances for the same options. At most 1000 instances. scene_inspect vegetation lists instances per species and level, culled and triangles. Tags foliage and grass sway with environment.wind {strength 0-4 (0.3), direction degrees, 0 toward +x and 90 toward +z}; a recipe material may use them, and asset materials:[{name, tag:\"foliage\"}] makes the leaves of an imported tree sway and cast moving shadows.";
})), wb, Tb = A((() => {
	wb = "Node field asset.crowd fills a group node with walking people: {id: catalog asset with a skinned clip, crowd:{clip=0 index, count 1-1000, seed=1, layout: grid|scatter, spacing=1.5, columns?, size?, rateJitter=0.15, speed=1, randomYaw, frameRate=30, lods=true, morphs=false, farDistance?+farRate?}}. All people share one batch per material (src/crowd-skinning.js), each at its own time offset; the pose is a pure function of scene time, seed and recipe camera, so a seek equals playing. farDistance m with farRate poses/s: people farther than that from the recipe camera eye hold each pose 1/farRate s. morphs:true keeps morph targets on their own part, at the weights the asset has when loaded, drawn at full detail. Part nodes count against maxNodes (count x materials). scene_inspect assets lists kind crowd with instances, batches, clip, frames, paletteBytes and boundsRadius.";
}));
// src/shader-registry.js
function Eb(e, t) {
	Db.set(e, t);
}
var Db, Ob, kb, Ab, jb = A((() => {
	Db = /* @__PURE__ */ new Map(), Ob = {}, kb = {}, Object.freeze({
		splatColor: 11,
		splatNormal: 12,
		splatPacked: 13,
		splatMask: 14
	}), Ab = [];
})), Mb = A((() => {
	jb();
})), Nb, Pb = A((() => {
	Nb = Object.freeze({
		maxBytes: 4096,
		maxPasses: 4,
		maxUniforms: 16,
		maxLoopIterations: 64,
		maxLoopWork: 4096
	}), Object.freeze([
		"float",
		"vec2",
		"vec3",
		"vec4",
		"int"
	]), Object.freeze({
		vec2: 2,
		vec3: 3,
		vec4: 4
	}), new Set("attribute const uniform varying break continue do for while if else in out inout float int void bool\n  true false discard return mat2 mat3 mat4 vec2 vec3 vec4 ivec2 ivec3 ivec4 uvec2 uvec3 uvec4 bvec2 bvec3 bvec4 struct precision highp\n  mediump lowp layout centroid flat smooth patch sample buffer shared coherent volatile restrict readonly writeonly resource common\n  partition active asm class union enum typedef template this packed goto inline noinline public static extern external interface\n  long short double half fixed unsigned superp input output filter namespace using sizeof cast switch case default uint\n  sampler2D sampler3D samplerCube".split(/\s+/)), `${Nb.maxLoopIterations}`;
})), Fb, Ib = A((() => {
	Mb(), Pb(), Object.freeze([
		"sceneColor",
		"sceneDepth",
		"resolution",
		"time",
		"depthAt",
		"worldPointAt",
		"worldNormalAt",
		"userPass"
	]), Object.freeze({
		min: .05,
		max: 1
	}), Object.freeze({
		pattern: /\bvec4\s+userPass\s*\(\s*vec2\s+[A-Za-z_]\w*\s*\)\s*\{/,
		example: "vec4 userPass(vec2 uv) { return texture(sceneColor, uv); }"
	}), Fb = Object.freeze({
		fields: "name, fragment (defines vec4 userPass(vec2 uv)), uniforms, scale 0.05-1 (1)",
		inputs: "sceneColor, sceneDepth (sampler2D), resolution (vec2, this pass), time (s), depthAt(uv), worldPointAt(uv), worldNormalAt(uv, from depth); gl_FragCoord",
		uniforms: "a number is float, [x,y(,z(,w))] is vec2-4, {type:\"int\",value} is int; name ^[a-z][A-Za-z0-9]{0,31}$",
		rules: "no # lines, while, do, uniform/layout declarations, gl_ names but gl_FragCoord, or u67_ names; for loops only as for (int i = 0; i < N; i++) { } with literal bounds, 64 iterations at most, loop work under 4096",
		limits: Object.freeze({
			maxPasses: Nb.maxPasses,
			maxBytes: Nb.maxBytes,
			maxUniforms: Nb.maxUniforms,
			maxLoopIterations: Nb.maxLoopIterations,
			maxLoopWork: Nb.maxLoopWork
		}),
		notes: "Passes run in order on the finished frame; scale under 1 renders smaller and enlarges with nearest filtering. A compile error returns the log with snippet line numbers (renderError); the scene stays. Stills and render jobs apply them; the path tracer does not. docs/user-passes.md"
	});
})), Lb, Rb = A((() => {
	Lb = Object.freeze({
		field: "recipe.game, set with set-game (null clears). Plain data, never code.",
		fields: "player {node (a node id; its children move with it), controller character, walkSpeed 3, runSpeed 6, jumpSpeed 7 (0-100 m/s), footOffset 0 (m from the node origin down to the feet)}, camera, input, physics (bool, false), ground (height in m, 0), rules (game rules document).",
		cameras: Object.freeze([
			"follow",
			"first-person",
			"top-down"
		]),
		inputPresets: Object.freeze({
			keyboard: "WASD and arrows move and look, Space jumps, Shift runs",
			gamepad: "keyboard plus the first gamepad (stick 0, jump on button 0)",
			touch: "keyboard plus a left-half virtual stick and tap to jump"
		}),
		rules: "version 1, variables, zones {id, shape sphere|box, center, radius|size}, parts {id, tags, position}, prefabs, rules [{id, once, when, if, do}]. The rules part named like the player node follows the player; a part named like a node is hidden or shown with it. Triggers enter|exit|contact|input|timer|variable (input actions: jump, run); actions set|add|show|hide|spawn|animation|sound|win|lose|restart. Full list: docs/game-rules.md.",
		notes: "Yaw 0 faces -Z; W moves forward. Zone checks use the feet position. physics true is accepted but the web export refuses it for now. scene_export_web writes the playable folder.",
		example: Object.freeze({
			type: "set-game",
			game: Object.freeze({
				player: Object.freeze({
					node: "creature",
					footOffset: .5
				}),
				camera: "follow",
				input: "keyboard",
				rules: Object.freeze({
					version: 1,
					variables: Object.freeze({ score: 0 }),
					zones: Object.freeze([Object.freeze({
						id: "goal-zone",
						shape: "box",
						center: Object.freeze([
							0,
							0,
							-6
						]),
						size: Object.freeze([
							2,
							4,
							2
						])
					})]),
					parts: Object.freeze([Object.freeze({
						id: "creature",
						tags: Object.freeze(["player"])
					})]),
					rules: Object.freeze([Object.freeze({
						when: Object.freeze({
							type: "enter",
							zone: "goal-zone",
							tag: "player"
						}),
						do: Object.freeze([Object.freeze({ type: "win" })])
					})])
				})
			})
		})
	});
}));
// src/mesh-blend.js
function zb() {
	return Array.from({ length: Vb }, (e, t) => {
		let n = Math.sqrt((t + .5) / Vb), r = t * Bb.angleStep;
		return [
			Math.cos(r) * n,
			Math.sin(r) * n,
			1 - n
		];
	});
}
var Bb, Vb, Hb, Ub, Wb, Gb, Kb, qb, Jb, Yb = A((() => {
	jb(), Object.freeze({ radius: Object.freeze([.005, 2]) }), Bb = Object.freeze({
		count: 24,
		angleStep: 2.39996323
	}), Vb = Bb.count, Hb = 40, Ub = 1024, Wb = (e) => Number.isInteger(e) ? `${e}.0` : String(Math.fround(e)), Gb = zb(), Kb = Gb.map((e) => `vec3(${e.map(Wb).join(", ")})`).join(", "), qb = Wb(Gb.reduce((e, t) => e + t[2], 0)), Jb = "nodes[].blend {radius: metres 0.005-2} softens seams; needs depth; docs/mesh-blend.md", `${Vb}${Vb}${Kb}${Ub}${Hb}${Vb}${qb}`, Eb("meshBlend", Object.freeze({
		declarations: "layout(location = 1) out highp vec4 partIdentifier;\n",
		surfaceHook: "  uint partNumber = canopyShaded || TAG_WATER || alphaMode > 1.5 ? 0u : uint(renderPassObjectBase + instanceEmission.w + 1.0);\n  uvec3 partBytes = uvec3(partNumber & 255u, (partNumber >> 8) & 255u, partNumber >> 16);\n  partIdentifier = vec4(vec3(partBytes), float((partBytes.x * 3u + partBytes.y * 5u + partBytes.z * 11u) % 251u + 1u)) / 255.0;\n"
	})), Ab.push((e) => e.includes("partIdentifier") ? e.replace("\nout vec4 outputColor;", "\nlayout(location = 0) out vec4 outputColor;") : e);
}));
// src/material-snippet.js
function Xb(e, t, { type: n, value: r }) {
	t !== null && (n === "float" ? e.uniform1f(t, r) : n === "int" ? e.uniform1i(t, r) : n === "vec2" ? e.uniform2fv(t, r) : n === "vec3" ? e.uniform3fv(t, r) : e.uniform4fv(t, r));
}
function Zb(e, t, n, r) {
	let i = e.context, a = r.parts[0].material.snippet?.feature;
	for (let r of e.shaderFeatures) {
		let e = $b.get(r);
		if (!e) continue;
		let o = (e) => (n[e] ??= i.getUniformLocation(t, e), n[e]);
		if (i.uniform1f(o(e.flag), +(r === a)), r === a) for (let [t, n] of Object.entries(e.snippet.uniforms)) Xb(i, o(`u67_${r}_${t}`), n);
	}
}
var Qb, $b, ex, tx = A((() => {
	jb(), Pb(), Object.freeze(["materialHook", "snippetMask"]), Object.freeze({
		pattern: /\bvoid\s+materialHook\s*\(\s*inout\s+vec3\s+[A-Za-z_]\w*\s*,\s*inout\s+float\s+[A-Za-z_]\w*\s*,\s*vec2\s+[A-Za-z_]\w*\s*,\s*vec3\s+[A-Za-z_]\w*\s*\)\s*\{/,
		example: "void materialHook(inout vec3 color, inout float alpha, vec2 uv, vec3 worldPosition) { }"
	}), Qb = Object.freeze({
		fields: "material.snippet { fragment (defines void materialHook(inout vec3 color, inout float alpha, vec2 uv, vec3 worldPosition)), uniforms, mask: \"map\" }; null clears it",
		inputs: "color (albedo after the map), alpha (map alpha), uv, worldPosition; snippetMask (the material map, with mask \"map\"); discard",
		uniforms: "as postPasses.uniforms",
		rules: "as postPasses.rules",
		limits: Object.freeze({
			maxBytes: Nb.maxBytes,
			maxUniforms: Nb.maxUniforms
		}),
		notes: "Runs in the colour, shadow (a discarded fragment casts no shadow; color starts white there) and ID passes. alpha cuts only with alphaMode \"mask\"; discard always. Rasterizer only. A compile error returns renderError with snippet line numbers. docs/user-passes.md"
	}), $b = /* @__PURE__ */ new Map(), ex = Ob.bind, Ob.bind = (e, t, n, r) => {
		ex?.(e, t, n, r), Zb(e, e.program, e.uniforms, r);
	}, Ob.bindDepth = (e, t) => {
		e.depthSnippetUniforms ??= {}, Zb(e, e.depthProgram, e.depthSnippetUniforms, t), t.parts[0].material.snippet?.mask && (e.context.activeTexture(e.context.TEXTURE0 + 1), e.context.bindTexture(e.context.TEXTURE_2D, t.textures[0]));
	};
})), nx, rx, ix, ax = A((() => {
	nx = Object.freeze({
		samples: Object.freeze({
			minimum: 1,
			maximum: 1024,
			default: 64
		}),
		bounces: Object.freeze({
			minimum: 1,
			maximum: 16,
			default: 8
		}),
		maxSeconds: Object.freeze({
			minimum: 1,
			maximum: 600,
			default: 120
		}),
		seed: Object.freeze({
			minimum: 0,
			maximum: 2147483647,
			default: 0
		}),
		noiseThreshold: Object.freeze({
			minimum: 0,
			maximum: .1,
			default: 0
		})
	}), rx = Object.freeze([
		"wavelet",
		"oidn",
		"none"
	]), ix = Object.freeze({
		setting: "settings.renderer { type: \"pathTracer\", backend (\"cpu\" default | \"gpu\" | \"native\"), samples, bounces, denoise (true | false | \"wavelet\" | \"oidn\" | \"none\"), seed, maxSeconds, noiseThreshold }; image, stills and video jobs, no passes. backend gpu needs a runtime on the GPU backend; backend native uses hardware ray queries through the optional @codepawlhq/67js-render-native package and falls back to gpu (cpu on a cpu runtime) with metrics.pathTracer.backendNote when the package, its binary or a Vulkan ray query adapter is missing; it traces volume fog, subsurface and noiseThreshold; the report names backend, gpuCompileSeconds and gpuKernelCompiles (1 for a whole film). Past maxSeconds on one frame the job fails.",
		noiseThreshold: "Default 0 draws every sample. Above 0 a pixel stops once its standard error relative to its mean is under the value, checked from 16 samples on: faster and noisier, and it cost quality on spot-area (score 0.0658 at 0, 0.0900 at 0.03). docs/path-tracer.md has the table.",
		traces: "emissive maps and strength; volume fog as a uniform medium (density, colour, anisotropy, box; noise, drift and ambient are not used); the material subsurface block as a bounded random walk on the cpu and gpu backends (at most 32 scattering events, mean free path radius times scale in metres), and a card with nothing behind it as thin translucency.",
		skips: "occlusion maps, liquids, anisotropy, iridescence, sheen, caustics, depth of field, bloom; metrics.pathTracer.ignored in the job result lists what the scene asked for.",
		limits: nx
	});
}));
// scripts/agent-path-trace-denoise.mjs
async function ox() {
	try {
		let e = await import(ux);
		return e.findOidnBinary() ? e : null;
	} catch {
		return null;
	}
}
async function sx(e) {
	if (e !== "oidn") return { denoise: e };
	let t = await ox();
	return t ? {
		denoise: "oidn",
		denoiser: t
	} : {
		denoise: "wavelet",
		note: `denoise "oidn" needs ${ux} and its binary (npm run fetch in that package, or OIDN_DENOISE_PATH): the wavelet filter ran instead.`
	};
}
function cx(e) {
	let t = Buffer.from(e, "base64");
	return new Float32Array(t.buffer, t.byteOffset, t.byteLength / 4);
}
async function lx({ traced: e, denoiser: t, drawLinear: n }) {
	let { width: r, height: i } = e.report, a = Object.fromEntries([
		"color",
		"albedo",
		"normal"
	].map((t) => [t, cx(e.features[t])])), o = performance.now(), s, c;
	try {
		s = await t.denoiseWithOidn({
			width: r,
			height: i,
			...a
		});
	} catch (e) {
		c = e.message;
	}
	let l = (performance.now() - o) / 1e3, u = await n({
		width: r,
		height: i,
		...s ? { linear: Buffer.from(s.buffer, s.byteOffset, s.byteLength).toString("base64") } : {}
	}), d = {
		...e.report,
		denoised: !0,
		denoiser: s ? "oidn" : "wavelet",
		denoiseSeconds: l,
		...s ? { oidnVersion: t.OIDN_VERSION } : { denoiserNote: `OIDN failed (${c}): the wavelet filter ran instead.` }
	};
	return {
		data: u.data,
		report: d
	};
}
var ux, dx = A((() => {
	ux = "@codepawlhq/67js-denoise-oidn";
})), fx = /* @__PURE__ */ j({ denoiseRadiance: () => vx });
function px(e, t) {
	return .2126 * e[t * 3] + .7152 * e[t * 3 + 1] + .0722 * e[t * 3 + 2];
}
function mx(e, t, n) {
	let r = new Float32Array(e.length);
	for (let i = 0; i < n; i++) for (let n = 0; n < 3; n++) r[i * 3 + n] = e[i * 3 + n] / Math.max(t[i * 3 + n], Cx);
	return r;
}
function hx(e, t, n, r) {
	let i = new Float32Array(n * r);
	for (let n = 0; n < i.length; n++) {
		let r = Math.max(px(t, n), Cx);
		i[n] = e[n] / (r * r);
	}
	let a = new Float32Array(i.length);
	for (let e = 0; e < r; e++) for (let t = 0; t < n; t++) {
		let o = 0, s = 0;
		for (let a = -1; a <= 1; a++) for (let c = -1; c <= 1; c++) {
			let l = e + a, u = t + c;
			l < 0 || l >= r || u < 0 || u >= n || (o += i[l * n + u], s++);
		}
		a[e * n + t] = o / s;
	}
	return a;
}
function gx(e, t, n, r, i) {
	let a = e[r * t + Math.max(i - 1, 0)], o = e[r * t + Math.min(i + 1, t - 1)], s = e[Math.max(r - 1, 0) * t + i], c = e[Math.min(r + 1, n - 1) * t + i];
	return [(o - a) / 2, (c - s) / 2];
}
function _x({ width: e, height: t, light: n, variance: r, normal: i, depth: a }, o, s, c) {
	for (let l = 0; l < t; l++) for (let u = 0; u < e; u++) {
		let d = l * e + u, f = px(n, d), [p, m] = gx(a, e, t, l, u), h = Sx * Math.sqrt(Math.max(r[d], 0)) + 1e-4, g = 0, _ = 0, v = 0, y = 0, b = 0, x = 0;
		for (let s = -2; s <= 2; s++) {
			let c = l + s * o;
			if (!(c < 0 || c >= t)) for (let t = -2; t <= 2; t++) {
				let l = u + t * o;
				if (l < 0 || l >= e) continue;
				let S = c * e + l, C = Math.max(0, i[d * 3] * i[S * 3] + i[d * 3 + 1] * i[S * 3 + 1] + i[d * 3 + 2] * i[S * 3 + 2]), w = Math.abs(p * t * o) + Math.abs(m * s * o) + .001 * Math.abs(a[d]) + 1e-5, T = Math.exp(-Math.abs(a[d] - a[S]) / w), E = Math.exp(-Math.abs(f - px(n, S)) / h), D = bx[s + 2] * bx[t + 2] * C ** xx * T * E;
				g += D, _ += D * D, v += D * D * r[S], y += D * n[S * 3], b += D * n[S * 3 + 1], x += D * n[S * 3 + 2];
			}
		}
		s[d * 3] = y / g, s[d * 3 + 1] = b / g, s[d * 3 + 2] = x / g, c[d] = v / (g * g);
	}
}
function vx({ width: e, height: t, color: n, albedo: r, normal: i, depth: a, variance: o }) {
	let s = e * t, c = mx(n, r, s), l = hx(o, r, e, t), u = new Float32Array(c.length), d = new Float32Array(l.length);
	for (let n of yx) _x({
		width: e,
		height: t,
		light: c,
		variance: l,
		normal: i,
		depth: a
	}, n, u, d), [c, u] = [u, c], [l, d] = [d, l];
	let f = new Float32Array(n.length);
	for (let e = 0; e < s; e++) for (let t = 0; t < 3; t++) f[e * 3 + t] = c[e * 3 + t] * Math.max(r[e * 3 + t], Cx);
	return f;
}
var yx, bx, xx, Sx, Cx, wx = A((() => {
	yx = [
		1,
		2,
		4,
		8,
		16
	], bx = [
		1 / 16,
		1 / 4,
		3 / 8,
		1 / 4,
		1 / 16
	], xx = 64, Sx = 3, Cx = .02;
}));
// src/camera.js
function Tx(e, t) {
	if (e.focalLength !== void 0) {
		let { focalLength: n, sensorWidth: r = 36 } = e;
		if (!Number.isFinite(n) || n <= 0 || !Number.isFinite(r) || r <= 0) throw RangeError("Focal length and sensor width must be positive and finite");
		return 2 * Math.atan(r / t / n / 2) * 180 / Math.PI;
	}
	let n = e.fov ?? 45;
	if (!Number.isFinite(n) || n <= 0 || n >= 180) throw RangeError("Camera field of view must be between 0 and 180 degrees");
	return n;
}
var Ex = A((() => {
	Object.freeze([
		"projection",
		"orthoScale",
		"focalLength",
		"sensorWidth",
		"shift",
		"fStop"
	]);
}));
// src/ray-query.js
function Dx(e, t, n) {
	let r = new Float64Array(n.length * Fx);
	for (let i = 0; i < n.length; i++) {
		let a = t[n[i] * 3] * 3, o = t[n[i] * 3 + 1] * 3, s = t[n[i] * 3 + 2] * 3, c = i * Fx;
		for (let t = 0; t < 3; t++) r[c + t] = e[a + t], r[c + 3 + t] = e[o + t] - e[a + t], r[c + 6 + t] = e[s + t] - e[a + t];
	}
	return r;
}
function Ox(e, t, n, r, i, a, o, s) {
	let c = (e[t] - n) * a, l = (e[t + 3] - n) * a, u = (e[t + 1] - r) * o, d = (e[t + 4] - r) * o, f = (e[t + 2] - i) * s, p = (e[t + 5] - i) * s, m = Math.max(0, Math.min(c, l), Math.min(u, d), Math.min(f, p));
	return m <= Math.min(Math.max(c, l), Math.max(u, d), Math.max(f, p)) * 1.000000000001 + Px ? m : Infinity;
}
function kx(e) {
	return e > Nx || e < -1e-30 ? 1 / e : e < 0 ? -1 / Nx : 1 / Nx;
}
function Ax(e) {
	let { nodeBounds: t, rightChild: n, rangeStart: r, rangeCount: i } = e.bvh, a = Dx(e.positions, e.indices, e.bvh.triangleOrder), o = e.bvh.triangleOrder, s = new Int32Array(Mx), c = new Float64Array(Mx), l = {
		nearestDistance: Infinity,
		nearestTriangle: -1,
		stopAtAnyHit: !1
	};
	function u(e, t, n, s, c, u, d) {
		let f = r[e] + i[e];
		for (let i = r[e]; i < f; i++) {
			let e = i * Fx, r = a[e + 6], f = a[e + 7], p = a[e + 8], m = u * p - d * f, h = d * r - c * p, g = c * f - u * r, _ = a[e + 3], v = a[e + 4], y = a[e + 5], b = _ * m + v * h + y * g;
			if (b === 0) continue;
			let x = t - a[e], S = n - a[e + 1], C = s - a[e + 2], w = (x * m + S * h + C * g) / b;
			if (w < 0 || w > 1) continue;
			let T = S * y - C * v, E = C * _ - x * y, D = x * v - S * _, ee = (c * T + u * E + d * D) / b;
			if (ee < 0 || w + ee > 1) continue;
			let O = (r * T + f * E + p * D) / b;
			if (!(O < 0 || O >= l.nearestDistance) && (l.nearestDistance = O, l.nearestTriangle = o[i], l.stopAtAnyHit)) return !0;
		}
		return !1;
	}
	function d(e, r, i, a, o, d, f, p) {
		l.nearestDistance = f, l.nearestTriangle = -1, l.stopAtAnyHit = p;
		let m = kx(a), h = kx(o), g = kx(d), _ = 1;
		for (s[0] = 0, c[0] = 0; _ > 0;) {
			_--;
			let f = s[_];
			if (!(c[_] < l.nearestDistance)) continue;
			let p = n[f];
			if (p < 0) {
				if (u(f, e, r, i, a, o, d)) return l;
				continue;
			}
			let v = f + 1, y = Ox(t, v * 6, e, r, i, m, h, g), b = Ox(t, p * 6, e, r, i, m, h, g), x = y <= b;
			s[_] = x ? p : v, c[_] = x ? b : y, s[_ + 1] = x ? v : p, c[_ + 1] = x ? y : b, _ += 2;
		}
		return l;
	}
	return { trace: d };
}
function jx(e, t) {
	let n = 1;
	if (t.range > 0) {
		let r = e / (t.range * t.range), i = Math.max(1 - r * r, 0);
		n = i * i;
	}
	return n / Math.max(e, t.radius * t.radius);
}
var Mx, Nx, Px, Fx, Ix = A((() => {
	Mx = 160, Nx = 1e-30, Px = 1e-12, Fx = 9;
}));
// src/light-profile.js
function Lx(e, t) {
	let n = t * Math.PI / 180;
	return e === "batwing" ? .35 + .65 * Math.sin(2 * n) ** 2 : Math.cos(n) ** Wx[e];
}
function Rx(e) {
	let t = [];
	for (let e = 0; e <= 9; e++) t.push(e * 10);
	return {
		angles: t,
		candela: t.map((t) => Lx(e, t))
	};
}
function zx(e, t = "ies") {
	if (typeof e == "string") {
		if (!Gx.includes(e)) throw RangeError(`${t} must be one of ${Gx.join(", ")} or { angles, candela }.`);
		return e;
	}
	if (!e || typeof e != "object" || Array.isArray(e)) throw TypeError(`${t} must be a profile name or { angles, candela }.`);
	let { angles: n, candela: r } = e;
	if (!Array.isArray(n) || !Array.isArray(r) || n.length !== r.length || n.length < 2 || n.length > Ux) throw RangeError(`${t} angles and candela must be arrays of the same length, from 2 to ${Ux}.`);
	if (n.forEach((e, r) => {
		if (typeof e != "number" || !Number.isFinite(e) || e < 0 || e > 180 || r > 0 && e <= n[r - 1]) throw RangeError(`${t} angles must be degrees from 0 to 180, strictly rising.`);
	}), r.forEach((e) => {
		if (typeof e != "number" || !Number.isFinite(e) || e < 0 || e > 1e7) throw RangeError(`${t} candela must be numbers from 0 to 10000000.`);
	}), !r.some((e) => e > 0)) throw RangeError(`${t} candela needs a value above zero.`);
	return {
		angles: [...n],
		candela: [...r]
	};
}
function Bx(e, t) {
	let { angles: n, candela: r } = e;
	if (t <= n[0]) return r[0];
	for (let e = 1; e < n.length; e++) if (t <= n[e]) {
		let i = (t - n[e - 1]) / (n[e] - n[e - 1]);
		return r[e - 1] + (r[e] - r[e - 1]) * i;
	}
	return 0;
}
function Vx(e) {
	let t = typeof e == "string" ? e : JSON.stringify(e), n = Kx.get(t);
	if (n) return n;
	let r = typeof e == "string" ? Rx(e) : e, i = Bx(r, 0) > 0 ? Bx(r, 0) : Math.max(...r.candela), a = /* @__PURE__ */ new Float32Array(16);
	for (let e = 0; e < 16; e++) a[e] = Bx(r, e / 15 * 90) / i;
	return Kx.size > 64 && Kx.clear(), Kx.set(t, a), a;
}
function Hx(e, t) {
	if (t <= 0) return 0;
	let n = Math.acos(Math.min(t, 1)) / (Math.PI / 2) * 15, r = Math.floor(n), i = Math.min(r + 1, 15);
	return e[r] + (e[i] - e[r]) * (n - r);
}
var Ux, Wx, Gx, Kx, qx = A((() => {
	jb(), Ux = 32, Wx = {
		"wide-flood": 1.5,
		downlight: 6,
		"narrow-spot": 30
	}, Gx = Object.freeze([...Object.keys(Wx), "batwing"]), Kx = /* @__PURE__ */ new Map(), kb.profile = (e) => Array.from(Vx(zx(e, "ies")));
}));
// src/triangle-bvh.js
function Jx(e, t) {
	let n = t.length / 3, r = new Float64Array(n * 6), i = new Float64Array(n * 3);
	for (let a = 0; a < n; a++) for (let n = 0; n < 3; n++) {
		let o = e[t[a * 3] * 3 + n], s = e[t[a * 3 + 1] * 3 + n], c = e[t[a * 3 + 2] * 3 + n], l = Math.min(o, s, c), u = Math.max(o, s, c);
		r[a * 6 + n] = l, r[a * 6 + 3 + n] = u, i[a * 3 + n] = (l + u) / 2;
	}
	return {
		bounds: r,
		centroids: i
	};
}
function Yx(e, t, n, r, i, a) {
	for (let e = 0; e < 3; e++) i[a + e] = Infinity, i[a + 3 + e] = -Infinity;
	for (let o = n; o < r; o++) {
		let n = t[o] * 6;
		for (let t = 0; t < 3; t++) i[a + t] = Math.min(i[a + t], e[n + t]), i[a + 3 + t] = Math.max(i[a + 3 + t], e[n + 3 + t]);
	}
}
function Xx(e, t) {
	let n = e[t + 3] - e[t], r = e[t + 4] - e[t + 1], i = e[t + 5] - e[t + 2];
	return n < 0 ? 0 : 2 * (n * r + r * i + i * n);
}
function Zx(e, t, n, r) {
	let i = [
		Infinity,
		Infinity,
		Infinity
	], a = [
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let o = n; o < r; o++) for (let n = 0; n < 3; n++) i[n] = Math.min(i[n], e[t[o] * 3 + n]), a[n] = Math.max(a[n], e[t[o] * 3 + n]);
	let o = a.map((e, t) => e - i[t]), s = o.indexOf(Math.max(...o));
	return {
		axis: s,
		low: i[s],
		extent: o[s]
	};
}
function Qx(e, t, n, r, i, a) {
	let o = new Uint32Array(rS), s = /* @__PURE__ */ new Float64Array(96);
	for (let t = 0; t < rS; t++) Yx(e, n, 0, 0, s, t * 6);
	let c = rS / a.extent;
	for (let l = r; l < i; l++) {
		let r = n[l], i = Math.min(15, Math.floor((t[r * 3 + a.axis] - a.low) * c));
		o[i]++;
		for (let t = 0; t < 3; t++) s[i * 6 + t] = Math.min(s[i * 6 + t], e[r * 6 + t]), s[i * 6 + 3 + t] = Math.max(s[i * 6 + 3 + t], e[r * 6 + 3 + t]);
	}
	let l = $x(o, s, 0, 1), u = $x(o, s, 15, -1), d = -1, f = Infinity, p = 0;
	for (let e = 0; e < 15; e++) {
		if (p += o[e], p === 0 || p === i - r) continue;
		let t = l[e] + u[e + 1];
		t < f && (f = t, d = e);
	}
	return d;
}
function $x(e, t, n, r) {
	let i = new Float64Array(rS), a = /* @__PURE__ */ new Float64Array(6);
	Yx(t, [], 0, 0, a, 0);
	let o = 0;
	for (let s = n; s >= 0 && s < rS; s += r) {
		o += e[s];
		for (let e = 0; e < 3; e++) a[e] = Math.min(a[e], t[s * 6 + e]), a[3 + e] = Math.max(a[3 + e], t[s * 6 + 3 + e]);
		i[s] = o * Xx(a, 0);
	}
	return i;
}
function eS(e, t, n, r, i, a) {
	let o = n, s = r - 1;
	for (; o <= s;) if (a(t[e[o] * 3 + i])) o++;
	else {
		let t = e[o];
		e[o] = e[s], e[s] = t, s--;
	}
	return o;
}
function tS(e, t, n, r, i) {
	let a = Zx(t, n, r, i);
	if (!(a.extent > 0)) return -1;
	let o = Qx(e, t, n, r, i, a), s = a.low + a.extent * (o + 1) / rS, c = o < 0 ? r : eS(n, t, r, i, a.axis, (e) => e < s);
	if (c === r || c === i) {
		let e = a.low + a.extent / 2;
		c = eS(n, t, r, i, a.axis, (t) => t < e);
	}
	return c === r || c === i ? -1 : c;
}
function nS(e, t, { leafSize: n = 8, maxDepth: r = 64 } = {}) {
	let i = t.length / 3, { bounds: a, centroids: o } = Jx(e, t), s = Uint32Array.from({ length: i }, (e, t) => t), c = Math.max(1, i * 2), l = new Float64Array(c * 6), u = new Int32Array(c).fill(-1), d = new Uint32Array(c), f = new Uint32Array(c), p = 0, m = [{
		start: 0,
		end: i,
		depth: 0,
		parent: -1
	}];
	for (; m.length;) {
		let { start: e, end: t, depth: i, parent: c } = m.pop(), h = p++;
		c >= 0 && (u[c] = h), Yx(a, s, e, t, l, h * 6), d[h] = e, f[h] = t - e;
		let g = t - e <= n || i >= r ? -1 : tS(a, o, s, e, t);
		g < 0 || (m.push({
			start: g,
			end: t,
			depth: i + 1,
			parent: h
		}), m.push({
			start: e,
			end: g,
			depth: i + 1,
			parent: -1
		}));
	}
	return {
		positions: e,
		indices: t,
		triangleOrder: s,
		nodeBounds: l,
		rightChild: u,
		rangeStart: d,
		rangeCount: f,
		nodeCount: p
	};
}
var rS, iS = A((() => {
	rS = 16;
})), aS, oS, sS = A((() => {
	_y(), aS = 17, oS = aS + 8;
}));
// src/export-box-uv.js
function cS(e) {
	return [
		0,
		4,
		8
	].map((t) => Math.hypot(e[t], e[t + 1], e[t + 2]));
}
function lS(e, t) {
	return t === 0 ? [
		e[1],
		e[0],
		e[2]
	] : t === 2 ? [
		e[0],
		e[2],
		e[1]
	] : e;
}
function uS(e, t, n, r) {
	let [i, a, o] = [
		0,
		1,
		2
	].map((e) => t[n * 3 + e] * 3), s = [
		0,
		1,
		2
	].map((t) => e[a + t] - e[i + t]), c = [
		0,
		1,
		2
	].map((t) => e[o + t] - e[i + t]), l = lS([
		s[1] * c[2] - s[2] * c[1],
		s[2] * c[0] - s[0] * c[2],
		s[0] * c[1] - s[1] * c[0]
	], r).map(Math.abs);
	return l[0] >= l[1] && l[0] >= l[2] ? 0 : l[1] >= l[2] ? 1 : 2;
}
function dS(e, t, n, r, i) {
	let [a, o, s] = lS(e.map((e, r) => e * t[r] * n), r);
	return i === 0 ? [s, o] : i === 1 ? [a, s] : [a, o];
}
function fS(e, t, n) {
	let r = new e.constructor(n.length * t);
	return n.forEach((n, i) => {
		for (let a = 0; a < t; a++) r[i * t + a] = e[n * t + a];
	}), r;
}
function pS(e, t, n, r) {
	let { positions: i, indices: a } = e, o = a.length / 3, s = /* @__PURE__ */ new Map(), c = [], l = new Uint32Array(a.length), u = [];
	for (let e = 0; e < o; e++) {
		let t = uS(i, a, e, r);
		for (let n = 0; n < 3; n++) {
			let r = a[e * 3 + n], i = r * 3 + t;
			s.has(i) || (s.set(i, c.length), c.push(r), u.push(t)), l[e * 3 + n] = s.get(i);
		}
	}
	let d = {
		...e,
		indices: l
	};
	d.positions = fS(i, 3, c), d.normals = fS(e.normals, 3, c);
	for (let [t, n] of [
		["colors", 3],
		["lightUvs", 2],
		["skinIndices", 4],
		["skinWeights", 4]
	]) e[t] && (d[t] = fS(e[t], n, c));
	return e.morphTargets && (d.morphTargets = e.morphTargets.map((e) => ({
		...e,
		...e.positions ? { positions: fS(e.positions, 3, c) } : {},
		...e.normals ? { normals: fS(e.normals, 3, c) } : {}
	}))), d.uvs = new Float32Array(c.length * 2), c.forEach((e, a) => {
		let o = [
			i[e * 3],
			i[e * 3 + 1],
			i[e * 3 + 2]
		];
		d.uvs.set(dS(o, t, n, r, u[a]), a * 2);
	}), d;
}
var mS = A((() => {}));
// src/volumetric.js
function hS(e, t, n, r) {
	if (typeof e != "number" || !Number.isFinite(e) || e < t || e > n) throw RangeError(`${r} must be between ${t} and ${n}`);
	return e;
}
function gS(e, t, n, r) {
	if (e?.length !== 3) throw TypeError(`${r} requires three components`);
	for (let i = 0; i < 3; i++) hS(e[i], t, n, r);
	return e;
}
function _S(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw TypeError("Fog field must be an object with width, height and data");
	for (let t of ["width", "height"]) {
		let n = e[t];
		if (!Number.isInteger(n) || n < 1 || n > 2048) throw RangeError(`Fog field ${t} must be an integer between 1 and ${wS}`);
	}
	if (!(e.data instanceof Float32Array)) throw TypeError("Fog field data must be a Float32Array of RGBA values");
	if (e.data.length !== e.width * e.height * 4) throw RangeError(`Fog field data must hold width * height * 4 = ${e.width * e.height * 4} values, got ${e.data.length}`);
	for (let t = 0; t < e.data.length; t++) if (!Number.isFinite(e.data[t])) throw RangeError(`Fog field data must be finite; index ${t} is not`);
	return e;
}
function vS(e = {}) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw TypeError("volumeFog must be an object");
	let t = hS(e.density ?? 0, 0, 10, "Volume density"), n = gS(e.minimum ?? yS, -1e5, 1e5, "Volume minimum"), r = gS(e.maximum ?? bS, -1e5, 1e5, "Volume maximum");
	for (let e = 0; e < 3; e++) if (Math.fround(r[e]) <= Math.fround(n[e])) throw RangeError("Volume bounds must remain ordered after Float32 rounding");
	let i = gS(e.color ?? xS, 0, 1, "Volume color"), a = gS(e.ambient ?? SS, 0, 10, "Volume ambient"), o = gS(e.drift ?? CS, -100, 100, "Volume drift"), s = hS(e.steps ?? 16, 8, 48, "Volume steps");
	if (!Number.isInteger(s)) throw RangeError("Volume steps must be an integer");
	let c = hS(e.anisotropy ?? .3, -.9, .9, "Volume anisotropy"), l = hS(e.noiseAmount ?? .5, 0, 1, "Volume noise amount"), u = hS(e.noiseScale ?? .3, .001, 100, "Volume noise scale"), d = hS(e.maxDistance ?? 100, .01, 1e4, "Volume maximum distance"), f = hS(e.heightFalloff ?? 0, 0, 1e5, "Volume height falloff"), p = {
		...e,
		density: t,
		minimum: n,
		maximum: r,
		color: i,
		ambient: a,
		drift: o,
		steps: s,
		anisotropy: c,
		noiseAmount: l,
		noiseScale: u,
		maxDistance: d,
		heightFalloff: f
	};
	if (e.shadowAmbient !== void 0 && (p.shadowAmbient = hS(e.shadowAmbient, 0, 1, "Volume shadow ambient")), e.field !== void 0 && (p.field = _S(e.field)), e.flowStrength !== void 0 && (p.flowStrength = hS(e.flowStrength, 0, 100, "Volume flow strength")), e.flowPeriod !== void 0 && (p.flowPeriod = hS(e.flowPeriod, .01, 1e3, "Volume flow period")), e.profile !== void 0) {
		if (!TS.includes(e.profile)) throw RangeError(`Volume profile must be one of ${TS.join(", ")}`);
		p.profile = e.profile;
	}
	return p;
}
var yS, bS, xS, SS, CS, wS, TS, ES = A((() => {
	yS = Object.freeze([
		-100,
		0,
		-100
	]), bS = Object.freeze([
		100,
		20,
		100
	]), xS = Object.freeze([
		.8,
		.85,
		.9
	]), SS = Object.freeze([
		.03,
		.035,
		.04
	]), CS = Object.freeze([
		.03,
		0,
		0
	]), wS = 2048, TS = Object.freeze(["exponential", "smoothstep"]);
}));
// src/local-volume-noise.js
function DS(e, t, n) {
	let r = NS(MS(e * MS(.1031))), i = NS(MS(t * MS(.1031))), a = NS(MS(n * MS(.1031))), o = MS(31.32), s = MS(MS(MS(r * MS(a + o)) + MS(i * MS(i + o))) + MS(a * MS(r + o)));
	return r = MS(r + s), i = MS(i + s), a = MS(a + s), NS(MS(MS(r + i) * a));
}
function OS(e) {
	return MS(MS(e * e) * MS(3 - MS(2 * e)));
}
function kS(e, t, n) {
	return MS(MS(e * MS(1 - n)) + MS(t * n));
}
function AS(e, t, n) {
	let r = MS(e), i = MS(t), a = MS(n), o = Math.floor(r), s = Math.floor(i), c = Math.floor(a), l = OS(MS(r - o)), u = OS(MS(i - s)), d = OS(MS(a - c));
	return kS(kS(kS(DS(o, s, c), DS(o + 1, s, c), l), kS(DS(o, s + 1, c), DS(o + 1, s + 1, c), l), u), kS(kS(DS(o, s, c + 1), DS(o + 1, s, c + 1), l), kS(DS(o, s + 1, c + 1), DS(o + 1, s + 1, c + 1), l), u), d);
}
function jS(e, t, n, r) {
	return 1 + (2 * AS(t * e.noiseScale, n * e.noiseScale, r * e.noiseScale) - 1) * e.noiseAmount;
}
var MS, NS, PS = A((() => {
	MS = Math.fround, NS = (e) => MS(e - Math.floor(e));
}));
// src/local-volumes.js
function FS(e, t, n, r) {
	if (!Array.isArray(e) || e.length !== 3) throw TypeError(`${r} must be an array of three numbers`);
	return e.map((e) => hS(e, t, n, r));
}
function IS(e, t) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw TypeError(`${t} must be an object`);
	for (let n of Object.keys(e)) if (!HS.includes(n)) throw TypeError(`${t} has no field "${n}"; use ${HS.join(", ")}`);
	let n = e.shape ?? "box";
	if (!BS.includes(n)) throw RangeError(`${t}.shape must be one of ${BS.join(", ")}`);
	let r = {
		shape: n,
		...n === "mesh" ? {} : { center: FS(e.center, -1e5, 1e5, `${t}.center`) },
		density: hS(e.density ?? 1, 0, 100, `${t}.density`),
		falloff: hS(e.falloff ?? .5, 0, 1, `${t}.falloff`),
		absorption: FS(e.absorption ?? [
			1,
			1,
			1
		], 0, 1, `${t}.absorption`),
		emission: FS(e.emission ?? [
			0,
			0,
			0
		], 0, 1, `${t}.emission`),
		emissionStrength: hS(e.emissionStrength ?? 1, 0, 1e3, `${t}.emissionStrength`),
		noiseAmount: hS(e.noiseAmount ?? 0, 0, 1, `${t}.noiseAmount`),
		noiseScale: hS(e.noiseScale ?? 1, .001, 100, `${t}.noiseScale`),
		steps: hS(e.steps ?? 16, 4, 32, `${t}.steps`)
	};
	if (!Number.isInteger(r.steps)) throw RangeError(`${t}.steps must be an integer`);
	if (n === "mesh") {
		if (typeof e.part != "string" || e.part === "") throw TypeError(`${t}.part must be the name of the part that bounds the volume`);
		for (let n of [
			"center",
			"size",
			"radius"
		]) if (e[n] !== void 0) throw TypeError(`${t}.${n} belongs to a box or a sphere; a mesh volume takes its place and size from the part named in ${t}.part`);
		if (r.part = e.part, r.fit = e.fit ?? "bounds", !VS.includes(r.fit)) throw RangeError(`${t}.fit must be one of ${VS.join(", ")}`);
		return r;
	}
	if (e.part !== void 0 || e.fit !== void 0) throw TypeError(`${t}.part and ${t}.fit belong to shape "mesh"`);
	if (n === "sphere") {
		if (e.size !== void 0) throw TypeError(`${t}.size belongs to a box; a sphere takes radius`);
		r.radius = hS(e.radius, .001, 1e4, `${t}.radius`);
	} else {
		if (e.radius !== void 0) throw TypeError(`${t}.radius belongs to a sphere; a box takes size [width, height, depth]`);
		r.size = FS(e.size, .001, 1e4, `${t}.size`);
	}
	return r;
}
function LS(e, t = "localVolumes") {
	if (!Array.isArray(e)) throw TypeError(`${t} must be an array of volumes`);
	if (e.length > 8) throw RangeError(`${t} holds at most 8 volumes, got ${e.length}`);
	return e.map((e, n) => IS(e, `${t}[${n}]`));
}
function RS(e, t, n, r) {
	if (e.shape === "mesh") return 1;
	let i = t - e.center[0], a = n - e.center[1], o = r - e.center[2];
	if (e.axes) {
		let t = e.axes, n = t[0] * i + t[1] * a + t[2] * o, r = t[3] * i + t[4] * a + t[5] * o;
		o = t[6] * i + t[7] * a + t[8] * o, i = n, a = r;
	}
	let s = e.shape === "sphere" ? Math.hypot(i, a, o) / e.radius : Math.max(Math.abs(i) / (e.size[0] / 2), Math.abs(a) / (e.size[1] / 2), Math.abs(o) / (e.size[2] / 2));
	if (s >= 1) return 0;
	let c = 1;
	if (e.falloff > 0) {
		let t = Math.min(1, Math.max(0, (s - (1 - e.falloff)) / e.falloff));
		c = 1 - t * t * (3 - 2 * t);
	}
	return e.noiseAmount > 0 && (c *= jS(e, t, n, r)), c;
}
function zS(e, t, n, r, i, a, o, s, c) {
	let l = 0, u = s;
	if (e.shape === "sphere") {
		let s = t - e.center[0], c = n - e.center[1], d = r - e.center[2], f = s * i + c * a + d * o, p = f * f - (s * s + c * c + d * d - e.radius * e.radius);
		if (p <= 0) return !1;
		let m = Math.sqrt(p);
		l = Math.max(l, -f - m), u = Math.min(u, -f + m);
	} else {
		let s = e.axes, c = t - e.center[0], d = n - e.center[1], f = r - e.center[2];
		for (let p = 0; p < 3; p++) {
			let m = p === 0 ? t : p === 1 ? n : r, h = p === 0 ? i : p === 1 ? a : o, g = e.center[p] - m;
			if (s) {
				let e = p * 3;
				g = -(s[e] * c + s[e + 1] * d + s[e + 2] * f), h = s[e] * i + s[e + 1] * a + s[e + 2] * o;
			}
			let _ = e.size[p] / 2;
			if (h === 0) {
				if (Math.abs(g) > _) return !1;
				continue;
			}
			let v = (g - _) / h, y = (g + _) / h;
			l = Math.max(l, Math.min(v, y)), u = Math.min(u, Math.max(v, y));
		}
	}
	return l < u && (c[0] = l, c[1] = u, !0);
}
var BS, VS, HS, US = A((() => {
	ES(), PS(), BS = Object.freeze([
		"box",
		"sphere",
		"mesh"
	]), VS = Object.freeze(["bounds", "mesh"]), HS = Object.freeze([
		"shape",
		"part",
		"fit",
		"center",
		"size",
		"radius",
		"density",
		"falloff",
		"absorption",
		"emission",
		"emissionStrength",
		"noiseAmount",
		"noiseScale",
		"steps"
	]), Object.freeze([
		1,
		0,
		0,
		0,
		1,
		0,
		0,
		0,
		1
	]);
}));
// src/local-volume-parts.js
function WS(e, t) {
	let n = /* @__PURE__ */ new Map(), r = new Uint32Array(e.length / 3);
	for (let i = 0; i < r.length; i++) {
		let a = `${Math.round(e[i * 3] / t)},${Math.round(e[i * 3 + 1] / t)},${Math.round(e[i * 3 + 2] / t)}`;
		n.has(a) || n.set(a, n.size), r[i] = n.get(a);
	}
	return r;
}
function GS(e, t, n) {
	let r = WS(e, n), i = /* @__PURE__ */ new Map();
	for (let e = 0; e < t.length; e += 3) for (let n = 0; n < 3; n++) {
		let a = r[t[e + n]], o = r[t[e + (n + 1) % 3]];
		if (a === o) continue;
		let s = a < o ? `${a}-${o}` : `${o}-${a}`, c = i.get(s) ?? {
			count: 0,
			direction: 0
		};
		c.count++, c.direction += a < o ? 1 : -1, i.set(s, c);
	}
	let a = 0, o = 0;
	for (let { count: e, direction: t } of i.values()) e === 2 ? t !== 0 && o++ : a++;
	return {
		open: a,
		inconsistent: o
	};
}
function KS(e, t, n) {
	return GS(e, t, n).open;
}
function qS(e) {
	let t = QS.get(e);
	if (t) return t;
	let n = e.positions, r = [
		Infinity,
		Infinity,
		Infinity
	], i = [
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let e = 0; e < n.length; e += 3) for (let t = 0; t < 3; t++) r[t] = Math.min(r[t], n[e + t]), i[t] = Math.max(i[t], n[e + t]);
	return t = {
		minimum: r,
		maximum: i
	}, QS.set(e, t), t;
}
function JS(e, t) {
	let { minimum: n, maximum: r } = qS(e.geometry), i = e.matrix ?? [
		1,
		0,
		0,
		0,
		0,
		1,
		0,
		0,
		0,
		0,
		1,
		0,
		0,
		0,
		0,
		1
	], a = n.map((e, t) => (e + r[t]) / 2), o = [
		0,
		1,
		2
	].map((e) => i[e] * a[0] + i[4 + e] * a[1] + i[8 + e] * a[2] + i[12 + e]), s = [], c = [];
	for (let a = 0; a < 3; a++) {
		let o = i[a * 4], l = i[a * 4 + 1], u = i[a * 4 + 2], d = Math.hypot(o, l, u);
		if (!(d > 0)) throw RangeError(`${t}.part "${e.name}" has a flat transform; a mesh volume needs a part with volume`);
		s.push((r[a] - n[a]) * d), c.push(o / d, l / d, u / d);
	}
	if (!s.every((e) => e > 0)) throw RangeError(`${t}.part "${e.name}" has no thickness along one axis; a mesh volume needs a part with volume`);
	return {
		center: o,
		size: s,
		axes: c
	};
}
function YS(e, t, n) {
	let r = e.find((e) => e.name === t);
	if (r) return r;
	let i = e.map((e) => e.name).filter(Boolean), a = i.slice(0, ZS).join(", ");
	throw RangeError(`${n}.part "${t}" names no part in the scene${a ? `; parts: ${a}${i.length > ZS ? ", ..." : ""}` : ""}`);
}
function XS(e, t, { label: n = "environment.localVolumes" } = {}) {
	return e.some((e) => e.shape === "mesh") ? e.map((e, r) => {
		if (e.shape !== "mesh") return e;
		let i = `${n}[${r}]`, a = YS(t, e.part, i);
		if (!a.geometry?.positions || !a.geometry.indices) throw TypeError(`${i}.part "${a.name}" has no geometry`);
		if (a.skin) throw RangeError(`${i}.part "${a.name}" is skinned; a mesh volume needs a rigid part`);
		let o = JS(a, i);
		if (e.fit === "mesh") return {
			...e,
			...o,
			part: a
		};
		let s = { ...e };
		return delete s.part, delete s.fit, {
			...s,
			shape: "box",
			...o
		};
	}) : e;
}
var ZS, QS, $S = A((() => {
	ZS = 12, QS = /* @__PURE__ */ new WeakMap();
}));
// src/path-tracer-volume.js
function eC(e) {
	if (!e) return null;
	let t = vS(e);
	return t.density > 0 ? {
		density: t.density,
		minimum: t.minimum,
		maximum: t.maximum,
		albedo: t.color,
		anisotropy: t.anisotropy,
		maxDistance: t.maxDistance
	} : null;
}
function tC(e, t, n, r, i, a, o, s, c) {
	let l = 0, u = Math.min(s, e.maxDistance);
	for (let s = 0; s < 3; s++) {
		let c = s === 0 ? t : s === 1 ? n : r, d = s === 0 ? i : s === 1 ? a : o;
		if (d === 0) {
			if (c < e.minimum[s] || c > e.maximum[s]) return !1;
			continue;
		}
		let f = (e.minimum[s] - c) / d, p = (e.maximum[s] - c) / d;
		l = Math.max(l, Math.min(f, p)), u = Math.min(u, Math.max(f, p));
	}
	return l < u && (c[0] = l, c[1] = u, !0);
}
function nC(e, t) {
	let n = e * e;
	return (1 - n) / (4 * Math.PI * (1 + n - 2 * e * t) ** 1.5);
}
function rC(e, t) {
	if (Math.abs(e) < .001) return 1 - 2 * t;
	let n = e * e, r = (1 - n) / (1 - e + 2 * e * t);
	return Math.max(-1, Math.min(1, (1 + n - r * r) / (2 * e)));
}
function iC(e, t) {
	let { geometry: n, matrix: r = uC } = e.part, i = n.positions, a = new Float32Array(i.length);
	for (let e = 0; e < i.length; e += 3) {
		let t = i[e], n = i[e + 1], o = i[e + 2];
		a[e] = r[0] * t + r[4] * n + r[8] * o + r[12], a[e + 1] = r[1] * t + r[5] * n + r[9] * o + r[13], a[e + 2] = r[2] * t + r[6] * n + r[10] * o + r[14];
	}
	let o = Math.hypot(...e.size), s = KS(a, n.indices, o * 1e-6);
	if (s > 0) throw RangeError(`${t}.part "${e.part.name}" is not a closed mesh (${s} open edges), so it has no inside; close it or use fit "bounds"`);
	let c = nS(a, n.indices);
	return {
		...e,
		mesh: {
			tracer: Ax({
				positions: a,
				indices: n.indices,
				bvh: c
			}),
			stepOffset: o * 1e-6
		}
	};
}
function aC(e, t, n, r, i, a, o, s, c) {
	let { tracer: l, stepOffset: u } = e.mesh, d = [], f = 0;
	for (; d.length < cC;) {
		let e = l.trace(t + i * f, n + a * f, r + o * f, i, a, o, Infinity, !1);
		if (e.nearestTriangle < 0) break;
		f += e.nearestDistance, d.push(f), f += u;
	}
	let p = d.length % 2 == 1, m = 0, h = 0;
	for (let e of d) {
		if (p) {
			let t = Math.min(e, s);
			t > m && h < lC && (c[h * 2] = m, c[h * 2 + 1] = t, h++);
		} else m = e;
		p = !p;
	}
	return h;
}
function oC(e, t, n, r, i, a, o, s, c, l, u) {
	let d = 0;
	for (let e = 0; e < t.length; e += 2) d += t[e + 1] - t[e];
	for (let f = 0; f < t.length; f += 2) {
		let p = t[f], m = t[f + 1] - p, h = Math.max(1, Math.round(e.steps * m / d)), g = m / h;
		for (let t = 0; t < h; t++) {
			let d = p + (t + c) * g, f = RS(e, n + a * d, r + o * d, i + s * d) * g;
			for (let t = 0; t < 3; t++) u[t] += l[t] * e.emission[t] * e.emissionStrength * f, l[t] *= Math.exp(-e.absorption[t] * e.density * f);
		}
	}
}
function sC(e) {
	let t = new Float64Array(e.length), n = new Float64Array(e.length), r = new Int32Array(e.length), i = /* @__PURE__ */ new Float64Array(2), a = /* @__PURE__ */ new Float64Array(64), o = Array(e.length);
	return function(s, c, l, u, d, f, p, m, h, g) {
		g[0] = 0, g[1] = 0, g[2] = 0;
		let _ = 0;
		for (let m = 0; m < e.length; m++) {
			if (e[m].mesh) {
				let t = aC(e[m], s, c, l, u, d, f, p, a);
				if (t === 0) continue;
				o[m] = a.slice(0, t * 2), i[0] = a[0], i[1] = a[t * 2 - 1];
			} else if (!zS(e[m], s, c, l, u, d, f, p, i)) continue;
			t[m] = i[0], n[m] = i[1];
			let h = _++;
			for (; h > 0 && t[r[h - 1]] > i[0];) r[h] = r[h - 1], h--;
			r[h] = m;
		}
		for (let i = 0; i < _; i++) {
			let a = e[r[i]];
			if (a.mesh) {
				oC(a, o[r[i]], s, c, l, u, d, f, m, h, g);
				continue;
			}
			let p = t[r[i]], _ = (n[r[i]] - p) / a.steps;
			for (let e = 0; e < a.steps; e++) {
				let t = p + (e + m) * _, n = RS(a, s + u * t, c + d * t, l + f * t);
				if (n <= 0) continue;
				let r = n * _;
				for (let e = 0; e < 3; e++) g[e] += h[e] * a.emission[e] * a.emissionStrength * r, h[e] *= Math.exp(-a.absorption[e] * a.density * r);
			}
		}
	};
}
var cC, lC, uC, dC = A((() => {
	ES(), US(), $S(), iS(), Ix(), cC = 64, lC = cC / 2, uC = [
		1,
		0,
		0,
		0,
		0,
		1,
		0,
		0,
		0,
		0,
		1,
		0,
		0,
		0,
		0,
		1
	];
}));
// src/path-tracer-shading.js
function fC(e, t, n) {
	return .2126 * e + .7152 * t + .0722 * n;
}
function pC(e, t, n, r, i) {
	let { width: a, height: o, channels: s, data: c, intensity: l, cosine: u, sine: d } = e, f = u * t - d * r, p = d * t + u * r, m = (Math.atan2(f, -p) / LC + .5) * a - .5, h = Math.acos(Math.max(-1, Math.min(1, n))) / Math.PI * o - .5, g = Math.floor(m), _ = Math.floor(h), v = m - g, y = h - _;
	i[0] = 0, i[1] = 0, i[2] = 0;
	for (let e = 0; e < 4; e++) {
		let t = ((g + (e & 1)) % a + a) % a, n = Math.max(0, Math.min(o - 1, _ + (e >> 1))), r = (e & 1 ? v : 1 - v) * (e >> 1 ? y : 1 - y), u = (n * a + t) * s;
		i[0] += r * c[u] * l, i[1] += r * c[u + 1] * l, i[2] += r * c[u + 2] * l;
	}
}
function mC(e, t, n, r) {
	let i = t, a = n - 1;
	for (; i < a;) {
		let t = i + a >> 1;
		e[t] < r ? i = t + 1 : a = t;
	}
	return i;
}
function hC(e, t, n, r) {
	let { width: i, height: a, channels: o, data: s, cosine: c, sine: l, total: u } = e, d = c * t - l * r, f = l * t + c * r, p = Math.min(i - 1, Math.floor((Math.atan2(d, -f) / LC + .5) * i)), m = Math.acos(Math.max(-1, Math.min(1, n))), h = Math.min(a - 1, Math.floor(m / Math.PI * a)), g = Math.max(Math.sin(m), 1e-6), _ = Math.sin(Math.PI * (h + .5) / a), v = (h * i + p) * o;
	return (fC(s[v], s[v + 1], s[v + 2]) + 1e-6) * _ / u * i * a / (LC * Math.PI * g);
}
function gC(e, t, n, r, i, a) {
	let { width: o, height: s, cosine: c, sine: l, rowCumulative: u, pixelCumulative: d, total: f } = e, p = mC(u, 0, s, t * f), m = p * o, h = d[m + o - 1], g = mC(d, m, m + o, n * h) - m, _ = Math.PI * (p + i) / s, v = ((g + r) / o - .5) * LC, y = Math.sin(_), b = y * Math.sin(v), x = -y * Math.cos(v);
	return a[0] = c * b + l * x, a[1] = Math.cos(_), a[2] = -l * b + c * x, hC(e, a[0], a[1], a[2]);
}
function _C(e, t) {
	let n = e * e, r = t * t * (n - 1) + 1;
	return n / (Math.PI * r * r);
}
function vC(e, t) {
	let n = e * e, r = t * t;
	return 2 * t / (t + Math.sqrt(n + (1 - n) * r));
}
function yC(e, t) {
	let n = (1 - Math.min(Math.max(t, 0), 1)) ** 5;
	return e + (1 - e) * n;
}
function bC(e, t, n, r, i, a, o) {
	let s = r * e, c = r * t, l = n, u = Math.hypot(s, c, l);
	s /= u, c /= u;
	let d = l / u, f = Math.hypot(s, c), p = f > 0 ? -c / f : 1, m = f > 0 ? s / f : 0, h = -d * (f > 0 ? s / f : 0), g = -d * (f > 0 ? c / f : 0), _ = f, v = Math.sqrt(i), y = LC * a, b = v * Math.cos(y), x = v * Math.sin(y), S = .5 * (1 + d);
	x = (1 - S) * Math.sqrt(1 - b * b) + S * x;
	let C = Math.sqrt(Math.max(0, 1 - b * b - x * x)), w = b * p + x * h + C * s, T = b * m + x * g + C * c, E = x * _ + C * d, D = r * w, ee = r * T, O = Math.max(0, E), te = Math.hypot(D, ee, O);
	o[0] = D / te, o[1] = ee / te, o[2] = O / te;
}
function xC(e) {
	return Math.max(e * e, RC);
}
function SC(e, t) {
	let n = Math.abs(e[0]) < .9, r = +!!n, i = +!n, a = e[1] * 0 - e[2] * i, o = e[2] * r - e[0] * 0, s = e[0] * i - e[1] * r, c = Math.hypot(a, o, s);
	a /= c, o /= c, s /= c, t[0] = a, t[1] = o, t[2] = s, t[3] = e[1] * s - e[2] * o, t[4] = e[2] * a - e[0] * s, t[5] = e[0] * o - e[1] * a, t[6] = e[0], t[7] = e[1], t[8] = e[2];
}
function CC(e, t, n, r, i) {
	i[0] = e[0] * t + e[3] * n + e[6] * r, i[1] = e[1] * t + e[4] * n + e[7] * r, i[2] = e[2] * t + e[5] * n + e[8] * r;
}
function wC(e, t, n, r, i) {
	i[0] = e[0] * t + e[1] * n + e[2] * r, i[1] = e[3] * t + e[4] * n + e[5] * r, i[2] = e[6] * t + e[7] * n + e[8] * r;
}
function TC() {
	return {
		frame: /* @__PURE__ */ new Float64Array(9),
		view: /* @__PURE__ */ new Float64Array(3),
		viewCosine: 0,
		diffuseColor: /* @__PURE__ */ new Float64Array(3),
		specularNormalReflectance: /* @__PURE__ */ new Float64Array(3),
		specularWeight: 1,
		specularAlpha: RC,
		coatWeight: 0,
		coatChance: 0,
		sampledCoat: !1,
		coatAlpha: RC,
		diffuseChance: 1,
		subsurfaceChance: 0,
		diffuseShare: 1,
		specularChance: 0,
		value: /* @__PURE__ */ new Float64Array(3),
		pdf: 0
	};
}
function EC(e, t, n) {
	let r = 1 - t, i = Math.min(r * r, 2 ** (-9.28 * n)) * r + (.0425 - .0275 * t), a = 1.04 - .572 * t - 1.04 * i, o = 1.04 * i + .022 * t - .04;
	return Math.min(1, Math.max(0, e * a + o));
}
function DC(e, t, n, r, i, a, o, s, c, l = t.clearcoat) {
	SC(a, e.frame), e.view[0] = o, e.view[1] = s, e.view[2] = c;
	let u = Math.max(a[0] * o + a[1] * s + a[2] * c, 1e-4);
	e.viewCosine = u;
	let d = (t.ior - 1) / (t.ior + 1), f = d * d, p = EC(f, r, u);
	e.coatWeight = l > 0 ? l * yC(BC, u) : 0;
	let m = 1 - e.coatWeight, h = (1 - n) * (1 - p) * m;
	for (let t = 0; t < 3; t++) {
		e.diffuseColor[t] = i[t] * h;
		let r = f * (1 - n) + i[t] * n;
		e.specularNormalReflectance[t] = r;
	}
	let g = fC(e.specularNormalReflectance[0], e.specularNormalReflectance[1], e.specularNormalReflectance[2]);
	e.specularWeight = m, e.specularAlpha = xC(r), e.coatAlpha = xC(t.clearcoatRoughness);
	let _ = fC(e.diffuseColor[0], e.diffuseColor[1], e.diffuseColor[2]), v = yC(g, u) * m, y = e.coatWeight, b = _ + v + y;
	e.diffuseChance = b > 0 ? _ / b : 1, e.subsurfaceChance = 0, e.diffuseShare = h, e.specularChance = b > 0 ? v / b : 0, e.coatChance = b > 0 ? y / b : 0;
}
function OC(e, t) {
	e.subsurfaceChance = e.diffuseChance * t, e.diffuseChance -= e.subsurfaceChance;
	for (let n = 0; n < 3; n++) e.diffuseColor[n] *= 1 - t;
}
function kC(e, t) {
	SC(t, e.frame), e.diffuseColor.fill(1), e.diffuseChance = 1, e.subsurfaceChance = 0, e.specularChance = 0, e.coatChance = 0, e.coatWeight = 0;
}
function AC(e, t, n, r) {
	return _C(e, r) * vC(e, t) * vC(e, n) / (4 * t * n);
}
function jC(e, t, n, r) {
	e.value[0] = 0, e.value[1] = 0, e.value[2] = 0, e.pdf = 0;
	let { frame: i, view: a, viewCosine: o } = e, s = i[6] * t + i[7] * n + i[8] * r;
	if (s <= 0) return;
	let c = a[0] + t, l = a[1] + n, u = a[2] + r, d = Math.hypot(c, l, u) || 1;
	c /= d, l /= d, u /= d;
	let f = i[6] * c + i[7] * l + i[8] * u, p = Math.max(a[0] * c + a[1] * l + a[2] * u, 0);
	e.pdf += e.diffuseChance * s / Math.PI;
	for (let t = 0; t < 3; t++) e.value[t] += e.diffuseColor[t] / Math.PI;
	if (e.specularChance > 0 && e.specularAlpha > zC) {
		let t = e.specularAlpha, n = AC(t, o, s, f) * e.specularWeight;
		for (let t = 0; t < 3; t++) e.value[t] += yC(e.specularNormalReflectance[t], p) * n;
		e.pdf += e.specularChance * vC(t, o) * _C(t, f) / (4 * o);
	}
	if (e.coatChance > 0 && e.coatAlpha > zC) {
		let t = e.coatAlpha, n = yC(BC, p) * AC(t, o, s, f) * (e.coatWeight / Math.max(yC(BC, o), 1e-6));
		for (let t = 0; t < 3; t++) e.value[t] += n;
		e.pdf += e.coatChance * vC(t, o) * _C(t, f) / (4 * o);
	}
}
function MC(e, t, n, r, i, a, o) {
	let s = 2 * (r * e + i * t + a * n);
	o[0] = s * e - r, o[1] = s * t - i, o[2] = s * n - a;
}
function NC(e, t, n, r, i) {
	let { frame: a, view: o } = e;
	if (t < e.diffuseChance) {
		let e = Math.sqrt(n), t = LC * r;
		return CC(a, e * Math.cos(t), e * Math.sin(t), Math.sqrt(Math.max(0, 1 - n)), i), !1;
	}
	let s = t >= e.diffuseChance + e.specularChance;
	e.sampledCoat = s;
	let c = s ? e.coatAlpha : e.specularAlpha;
	return wC(a, o[0], o[1], o[2], VC), c <= zC ? (i[0] = 2 * e.viewCosine * a[6] - o[0], i[1] = 2 * e.viewCosine * a[7] - o[1], i[2] = 2 * e.viewCosine * a[8] - o[2], !0) : (bC(VC[0], VC[1], VC[2], c, n, r, HC), MC(HC[0], HC[1], HC[2], VC[0], VC[1], VC[2], UC), CC(a, UC[0], UC[1], UC[2], i), !1);
}
function PC(e, t) {
	if (e.sampledCoat) t[0] = t[1] = t[2] = e.coatWeight / e.coatChance;
	else for (let n = 0; n < 3; n++) t[n] = yC(e.specularNormalReflectance[n], e.viewCosine) * e.specularWeight / e.specularChance;
}
function FC(e, t) {
	let n = t * t * (1 - e * e);
	if (n >= 1) return 1;
	let r = Math.sqrt(1 - n), i = (t * e - r) / (t * e + r), a = (e - t * r) / (e + t * r);
	return .5 * (i * i + a * a);
}
function IC(e, t, n, r, i, a, o, s, c, l, u) {
	let d = WC;
	SC(e, d);
	let f = e[0], p = e[1], m = e[2];
	o > zC && (wC(d, t, n, r, VC), bC(VC[0], VC[1], VC[2], o, c, l, HC), CC(d, HC[0], HC[1], HC[2], GC), f = GC[0], p = GC[1], m = GC[2]);
	let h = i ? 1 / a : a, g = Math.max(t * f + n * p + r * m, 1e-6);
	if (s < FC(g, h)) return MC(f, p, m, t, n, r, u), u[0] * e[0] + u[1] * e[1] + u[2] * e[2] > 0;
	let _ = Math.sqrt(Math.max(0, 1 - h * h * (1 - g * g))), v = h * g - _;
	return u[0] = v * f - h * t, u[1] = v * p - h * n, u[2] = v * m - h * r, u[0] * e[0] + u[1] * e[1] + u[2] * e[2] < 0;
}
var LC, RC, zC, BC, VC, HC, UC, WC, GC, KC = A((() => {
	LC = 2 * Math.PI, RC = .001, zC = .002, BC = .04, VC = /* @__PURE__ */ new Float64Array(3), HC = /* @__PURE__ */ new Float64Array(3), UC = /* @__PURE__ */ new Float64Array(3), WC = /* @__PURE__ */ new Float64Array(9), GC = /* @__PURE__ */ new Float64Array(3);
}));
// src/path-tracer-subsurface.js
function qC(e) {
	if (!e || !(e.weight > 0)) return null;
	let [t, ...n] = eb(e);
	return {
		weight: t,
		meanFreePath: n.slice(0, ZC).map((e) => Math.max(e, XC)),
		color: n[ZC] < 0 ? null : n.slice(ZC, 6)
	};
}
function JC(e) {
	let t = Math.min(1, Math.max(0, e)), n = Math.sqrt(9.59217 + 41.6808 * t + 17.7126 * t * t), r = 4.09712 + 4.20863 * t - n;
	return Math.min(1, Math.max(0, 1 - r * r));
}
function YC(e, t, n) {
	let r = /* @__PURE__ */ new Float64Array(9), i = /* @__PURE__ */ new Float64Array(3), a = /* @__PURE__ */ new Float64Array(3), o = new Float64Array(ZC), s = new Float64Array(ZC);
	function c(e) {
		let n = Math.sqrt(t.next()), i = 2 * Math.PI * t.next(), o = Math.sqrt(Math.max(0, 1 - n * n));
		SC(e, r);
		let s = n * Math.cos(i), c = n * Math.sin(i);
		for (let t = 0; t < 3; t++) a[t] = r[t] * s + r[3 + t] * c - e[t] * o;
	}
	function l() {
		let e = 2 * t.next() - 1, n = 2 * Math.PI * t.next(), r = Math.sqrt(Math.max(0, 1 - e * e));
		a[0] = r * Math.cos(n), a[1] = e, a[2] = r * Math.sin(n);
	}
	function u(r, u, d, f, p, m, h, g, _) {
		for (let e = 0; e < ZC; e++) o[e] = 1 / r.meanFreePath[e], s[e] = JC(u[e]);
		i[0] = d - m[0] * e.surfaceOffset, i[1] = f - m[1] * e.surfaceOffset, i[2] = p - m[2] * e.surfaceOffset, c(m);
		for (let r = 0;; r++) {
			if (!(n(e, i[0], i[1], i[2], a[0], a[1], a[2], g) && g.material === h)) return r === 0 ? QC.thin : QC.lost;
			let c = Math.min(2, Math.floor(t.next() * ZC)), u = -Math.log(1 - t.next()) / o[c];
			if (u >= g.distance) {
				let e = 0;
				for (let t = 0; t < ZC; t++) e += Math.exp(-o[t] * g.distance) / ZC;
				if (!(e > 0)) return QC.lost;
				for (let t = 0; t < ZC; t++) _[t] *= Math.exp(-o[t] * g.distance) / e;
				return QC.exit;
			}
			if (r === 32) return QC.lost;
			let d = 0;
			for (let e = 0; e < ZC; e++) d += o[e] * Math.exp(-o[e] * u) / ZC;
			if (!(d > 0)) return QC.lost;
			for (let e = 0; e < ZC; e++) _[e] *= s[e] * o[e] * Math.exp(-o[e] * u) / d;
			i[0] += a[0] * u, i[1] += a[1] * u, i[2] += a[2] * u, l();
		}
	}
	return u.direction = a, u;
}
var XC, ZC, QC, $C = A((() => {
	KC(), XC = 1e-6, ZC = 3, QC = Object.freeze({
		exit: 0,
		thin: 1,
		lost: 2
	});
}));
// src/depth-layer.js
function ew(e) {
	return tw.get(e) ?? null;
}
var tw, nw = A((() => {
	tw = /* @__PURE__ */ new WeakMap();
}));
// src/path-tracer-scene.js
function rw(e, t, n, r, i, a, o, s, c) {
	let l = r * 16;
	e[t] += i * (n[l] * a + n[l + 4] * o + n[l + 8] * s + n[l + 12] * c), e[t + 1] += i * (n[l + 1] * a + n[l + 5] * o + n[l + 9] * s + n[l + 13] * c), e[t + 2] += i * (n[l + 2] * a + n[l + 6] * o + n[l + 10] * s + n[l + 14] * c);
}
function iw(e) {
	let { geometry: t, skin: n } = e, r = t.positions.length / 3, i = new Float32Array(t.positions.length), a = new Float32Array(t.normals.length), o = t.skinWeights.length / r;
	for (let e = 0; e < r; e++) {
		let r = e * 3;
		for (let s = 0; s < o; s++) {
			let c = t.skinWeights[e * o + s];
			if (c === 0) continue;
			let l = t.skinIndices[e * o + s];
			rw(i, r, n.jointMatrices, l, c, t.positions[r], t.positions[r + 1], t.positions[r + 2], 1), rw(a, r, n.jointMatrices, l, c, t.normals[r], t.normals[r + 1], t.normals[r + 2], 0);
		}
		let s = Math.hypot(a[r], a[r + 1], a[r + 2]) || 1;
		for (let e = 0; e < 3; e++) a[r + e] /= s;
	}
	return {
		...t,
		positions: i,
		normals: a
	};
}
function aw(e) {
	let [t, n, r, , i, a, o, , s, c, l] = e, u = [
		a * l - o * c,
		o * s - i * l,
		i * c - a * s,
		r * c - n * l,
		t * l - r * s,
		n * s - t * c,
		n * o - r * a,
		r * i - t * o,
		t * a - n * i
	], d = t * u[0] + n * u[1] + r * u[2] < 0 ? -1 : 1;
	return u.map((e) => e * d);
}
function ow() {
	let e = /* @__PURE__ */ new Float32Array(256);
	for (let t = 0; t < 256; t++) {
		let n = t / 255;
		e[t] = n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4;
	}
	return e;
}
function sw(e, t = cw) {
	if (!e?.width || !e.height) return null;
	if (e.data) return e.data;
	if (e.compressed || typeof e != "object") return null;
	if (Aw.has(e)) return Aw.get(e);
	let n = t(e.width, e.height)?.getContext("2d", { willReadFrequently: !0 });
	if (!n) return null;
	n.drawImage(e, 0, 0);
	let r = n.getImageData(0, 0, e.width, e.height).data;
	return Aw.set(e, r), r;
}
function cw(e, t) {
	if (typeof OffscreenCanvas == "function") return new OffscreenCanvas(e, t);
	let n = globalThis.document?.createElement("canvas");
	return n ? (n.width = e, n.height = t, n) : null;
}
function lw(e) {
	let t = e?.image, n = sw(t);
	return n ? {
		width: t.width,
		height: t.height,
		data: n,
		colorLookup: e.colorSpace === "linear" ? null : kw,
		repeat: (e.wrapS ?? Ow) === Ow
	} : null;
}
function uw(e) {
	let t = e.pattern?.type === "graph" ? e.pattern.graph : null;
	return e.alphaMode === "blend" && t && Object.hasOwn(t, "opacity") ? .5 : 0;
}
function dw(e) {
	let t = e.emissiveColor ?? e.color, n = e.emission ?? 0;
	return {
		color: e.color ?? [
			1,
			1,
			1
		],
		metallic: e.metallic ?? 0,
		roughness: e.roughness ?? .5,
		emission: t.map((e) => e * n),
		emissiveTexture: n > 0 ? lw(e.emissiveMap) : null,
		clearcoat: e.clearcoat ?? 0,
		clearcoatTexture: lw(e.layerMaps?.clearcoatTexture),
		transmissionTexture: lw(e.transmissionMap),
		clearcoatRoughness: e.clearcoatRoughness ?? 0,
		transmission: e.transmission ?? 0,
		subsurface: qC(e.subsurface),
		ior: e.ior ?? 1.5,
		texture: lw(e.map),
		normalTexture: lw(e.normalMap),
		normalScale: e.normalScale ?? [1, 1],
		surfaceTexture: lw(e.metallicRoughnessMap),
		lightMask: e.lightMask ?? jw,
		alphaCutoff: e.alphaMode === "mask" ? e.alphaCutoff ?? .5 : uw(e)
	};
}
function fw(e, t, n) {
	if (!e || t !== void 0 && e.length !== t) throw TypeError(`${n} must hold ${t} numbers.`);
	for (let t = 0; t < e.length; t++) if (!Number.isFinite(e[t])) throw RangeError(`${n} must be finite numbers.`);
}
function pw(e, t) {
	let n = `Part ${e.name ?? ""}`.trim();
	if (fw(e.matrix ?? Dw, 16, `${n} matrix`), fw(t.positions, void 0, `${n} positions`), t.positions.length % 3 != 0 || t.indices.length % 3 != 0) throw RangeError(`${n} positions and indices must come in threes.`);
	let r = t.positions.length / 3;
	if (t.normals?.length !== t.positions.length) throw RangeError(`${n} needs one normal for every position.`);
	fw(t.normals, void 0, `${n} normals`);
	for (let e = 0; e < t.indices.length; e++) if (!(t.indices[e] < r)) throw RangeError(`${n} has an index past its last vertex.`);
	if (t.uvs && t.uvs.length !== r * 2) throw RangeError(`${n} needs one UV pair for every position.`);
	if (t.colors && t.colors.length !== r * 3) throw RangeError(`${n} needs one colour for every position.`);
}
function mw(e) {
	let t = e.skin ? iw(e) : ew(e)?.geometry ?? e.geometry, { boxMapScale: n = 0, boxMapAxis: r = 1 } = e.material ?? {};
	return n > 0 ? pS(t, cS(e.matrix ?? Dw), n, r) : t;
}
function hw(e) {
	let t = 0, n = 0, r = e.map(mw);
	e.forEach((e, t) => pw(e, r[t]));
	for (let e of r) t += e.positions.length / 3, n += e.indices.length;
	if (n / 3 > 4e5) throw RangeError(`A path trace takes at most ${ww} triangles in total.`);
	let i = {
		positions: new Float32Array(t * 3),
		normals: new Float32Array(t * 3),
		uvs: new Float32Array(t * 2),
		colors: new Float32Array(t * 3).fill(1),
		indices: new Uint32Array(n),
		triangleMaterial: new Uint32Array(n / 3)
	}, a = 0, o = 0;
	return e.forEach((e, t) => {
		let n = r[t], s = e.matrix ?? Dw, c = aw(s), l = n.positions.length / 3;
		for (let e = 0; e < l; e++) {
			let t = n.positions[e * 3], r = n.positions[e * 3 + 1], o = n.positions[e * 3 + 2], l = (a + e) * 3;
			i.positions[l] = s[0] * t + s[4] * r + s[8] * o + s[12], i.positions[l + 1] = s[1] * t + s[5] * r + s[9] * o + s[13], i.positions[l + 2] = s[2] * t + s[6] * r + s[10] * o + s[14];
			let u = n.normals[e * 3], d = n.normals[e * 3 + 1], f = n.normals[e * 3 + 2], p = c[0] * u + c[3] * d + c[6] * f, m = c[1] * u + c[4] * d + c[7] * f, h = c[2] * u + c[5] * d + c[8] * f, g = Math.hypot(p, m, h) || 1;
			i.normals[l] = p / g, i.normals[l + 1] = m / g, i.normals[l + 2] = h / g;
		}
		n.uvs && i.uvs.set(n.uvs, a * 2), n.colors && i.colors.set(n.colors, a * 3);
		for (let e = 0; e < n.indices.length; e++) i.indices[o * 3 + e] = n.indices[e] + a;
		i.triangleMaterial.fill(t, o, o + n.indices.length / 3), a += l, o += n.indices.length / 3;
	}), i;
}
function gw(e) {
	let t = Math.hypot(e[0], e[1], e[2]) || 1;
	return [
		e[0] / t,
		e[1] / t,
		e[2] / t
	];
}
function _w(e) {
	return e.ies === void 0 ? null : kb.profile(e.ies);
}
function vw(e) {
	let t = Math.max(...e.keyColor ?? [
		0,
		0,
		0
	]);
	if ((e.pointLights?.length ?? 0) + (e.spotLights?.length ?? 0) + (e.areaLights?.length ?? 0) > 32) throw RangeError("A path trace takes at most 32 point, spot and area lights.");
	return {
		sun: t > 0 ? {
			bit: 0,
			direction: gw(e.lightDirection ?? [
				0,
				1,
				0
			]),
			color: e.keyColor,
			angularRadius: e.sunAngularRadius ?? Ew
		} : null,
		points: (e.pointLights ?? []).map((e, t) => ({
			bit: 1 + t,
			position: e.position,
			color: e.color,
			intensity: e.intensity,
			radius: e.radius ?? 0,
			range: e.range ?? 0
		})),
		spots: (e.spotLights ?? []).map((e, t) => ({
			bit: aS + t,
			position: e.position,
			color: e.color,
			intensity: e.intensity,
			radius: e.radius ?? 0,
			range: e.range ?? 0,
			direction: gw(e.direction),
			cosineHalfAngle: Math.cos(e.angle),
			profile: _w(e),
			blend: (1 - Math.cos(e.angle)) * (e.penumbra ?? 0)
		})),
		areas: (e.areaLights ?? []).map((e, t) => {
			let n = gw(e.direction), r = gw(e.up ?? [
				0,
				1,
				0
			]), i = gw([
				r[1] * n[2] - r[2] * n[1],
				r[2] * n[0] - r[0] * n[2],
				r[0] * n[1] - r[1] * n[0]
			]), a = [
				n[1] * i[2] - n[2] * i[1],
				n[2] * i[0] - n[0] * i[2],
				n[0] * i[1] - n[1] * i[0]
			];
			return {
				bit: oS + t,
				position: e.position,
				color: e.color,
				intensity: e.intensity,
				width: e.width,
				height: e.height,
				normal: n,
				across: i,
				along: a,
				profile: _w(e)
			};
		})
	};
}
function yw(e) {
	if (!e) return null;
	let { width: t, height: n, channels: r, data: i, intensity: a, rotation: o } = e, s = Math.cos(o), c = Math.sin(o), l = new Float64Array(n), u = new Float64Array(t * n), d = 0;
	for (let e = 0; e < n; e++) {
		let a = Math.sin(Math.PI * (e + .5) / n), o = 0;
		for (let n = 0; n < t; n++) {
			let s = (e * t + n) * r;
			o += (.2126 * i[s] + .7152 * i[s + 1] + .0722 * i[s + 2] + 1e-6) * a, u[e * t + n] = o;
		}
		d += o, l[e] = d;
	}
	return {
		width: t,
		height: n,
		channels: r,
		data: i,
		intensity: a,
		cosine: s,
		sine: c,
		rowCumulative: l,
		pixelCumulative: u,
		total: d
	};
}
function bw(e) {
	return {
		...e,
		tracer: Ax({
			positions: e.positions,
			indices: e.indices,
			bvh: e.bvh
		})
	};
}
function xw(e, t) {
	if (e.localVolumes) throw RangeError(`environment.localVolumes is traced by the CPU path tracer only; ${t} cannot draw them. Use backend "cpu" or remove the volumes.`);
}
function Sw(e, t) {
	if (!e?.length) return {
		volumes: null,
		boundsOnlyParts: []
	};
	let n = LS(e, "environment.localVolumes"), r = new Set(n.filter((e) => e.shape === "mesh").map((e) => e.part));
	return {
		volumes: XS(n, t).map((e, t) => e.part ? iC(e, `environment.localVolumes[${t}]`) : e),
		boundsOnlyParts: t.filter((e) => r.has(e.name) && e.visible === !1)
	};
}
function Cw(e, t = {}) {
	let { volumes: n, boundsOnlyParts: r } = Sw(t.localVolumes, e), i = r.length ? e.filter((e) => !r.includes(e)) : e;
	if (!Array.isArray(i) || i.length < 1 || i.length > 1024) throw RangeError(`A path trace takes 1 to ${Tw} parts.`);
	let a = hw(i), o = nS(a.positions, a.indices), s = .001;
	for (let e = 0; e < a.positions.length; e++) s = Math.max(s, Math.abs(a.positions[e]));
	return bw({
		...a,
		bvh: o,
		materials: i.map((e) => dw(e.material ?? {})),
		lights: vw(t),
		environment: yw(t.map),
		volume: eC(t.volumeFog),
		localVolumes: n,
		surfaceOffset: s * 1e-5,
		farDistance: s * 1e4
	});
}
var ww, Tw, Ew, Dw, Ow, kw, Aw, jw, Mw = A((() => {
	iS(), Ix(), sS(), mS(), dC(), US(), $S(), $C(), jb(), nw(), ww = 4e5, Tw = 1024, Ew = Math.PI / 360, Dw = Object.freeze([
		1,
		0,
		0,
		0,
		0,
		1,
		0,
		0,
		0,
		0,
		1,
		0,
		0,
		0,
		0,
		1
	]), Ow = 10497, kw = ow(), Aw = /* @__PURE__ */ new WeakMap(), jw = -1;
}));
// src/view-transform.js
function Nw(e, t) {
	let n = [
		0,
		0,
		0
	];
	for (let r = 0; r < 3; r++) for (let i = 0; i < 3; i++) n[i] += e[r][i] * t[r];
	return n;
}
function Pw(e) {
	let t = Math.max(e, 0);
	return Gw(t * (2.51 * t + .03) / (t * (2.43 * t + .59) + .14));
}
function Fw(e, t) {
	let n = e / t.scale;
	return t.scale * n / (1 + n ** t.power) ** (1 / t.power);
}
function Iw(e) {
	let { pivot: t, slope: n, toe: r, shoulder: i } = Uw, a = n * (e - t[0]);
	return t[1] + (a >= 0 ? Fw(a, i) : -Fw(-a, r));
}
function Lw(e) {
	let { inset: t, outset: n, minimumEv: r, maximumEv: i, encodingPower: a } = Uw;
	return Nw(n, Nw(t, e).map((e) => {
		let t = (Math.log2(Math.max(e, 1e-10)) - r) / (i - r);
		return Math.max(0, Iw(Gw(t))) ** a;
	})).map(Gw);
}
function Rw(e) {
	let { startCompression: t, desaturation: n } = Ww, r = Math.min(...e), i = r < .08 ? r - 6.25 * r * r : .04, a = e.map((e) => e - i), o = Math.max(...a);
	if (o < t) return a.map(Gw);
	let s = 1 - t, c = 1 - s * s / (o + s - t), l = 1 - 1 / (n * (o - c) + 1);
	return a.map((e) => Gw(e * c / o * (1 - l) + c * l));
}
function zw(e, t) {
	if (e === "agx") return Lw(t);
	if (e === "neutral") return Rw(t);
	if (e === "aces" || e === void 0) return t.map(Pw);
	throw RangeError(`viewTransform must be one of ${cy.join(", ")}.`);
}
function Bw(e, t) {
	let { size: n, data: r } = e, i = t.map((e) => Gw(e) * (n - 1)), a = i.map((e) => Math.min(Math.floor(e), n - 2)), o = [
		0,
		0,
		0
	];
	for (let e = 0; e < 8; e++) {
		let t = [
			e & 1,
			e >> 1 & 1,
			e >> 2 & 1
		], s = 1;
		for (let e = 0; e < 3; e++) {
			let n = i[e] - a[e];
			s *= t[e] ? n : 1 - n;
		}
		let c = ((a[2] + t[2]) * n * n + (a[1] + t[1]) * n + a[0] + t[0]) * 3;
		for (let e = 0; e < 3; e++) o[e] += r[c + e] * s;
	}
	return o;
}
function Vw(e, { viewTransform: t = "aces", look: n = null } = {}) {
	let r = zw(t, e).map((e) => e ** (1 / 2.2));
	return n ? Bw(n, r) : r;
}
var Hw, Uw, Ww, Gw, Kw = A((() => {
	uy(), Hw = (e) => e[0].map((t, n) => e.map((e) => e[n])), Uw = Object.freeze({
		inset: Hw([
			[
				.57215,
				.33216,
				.09569
			],
			[
				.12368,
				.74091,
				.13541
			],
			[
				.09814,
				.19729,
				.70457
			]
		]),
		outset: Hw([
			[
				1.84762,
				-.70741,
				-.14021
			],
			[
				-.2341,
				1.3225,
				-.0884
			],
			[
				-.19713,
				-.30062,
				1.49775
			]
		]),
		minimumEv: -12.47393,
		maximumEv: 4.026069,
		pivot: [.60608, .48834],
		slope: 2.39013,
		toe: {
			scale: .56474,
			power: 1.50159
		},
		shoulder: {
			scale: .70613,
			power: 1.53357
		},
		encodingPower: 2.4
	}), Ww = Object.freeze({
		startCompression: .76,
		desaturation: .15
	}), Gw = (e) => Math.min(1, Math.max(0, e));
}));
// src/path-tracer-light-tree.js
function qw(e, t) {
	return e === "auto" ? t.points.length + t.spots.length + t.areas.length > 8 ? "tree" : "uniform" : e;
}
function Jw(e) {
	return .2126 * e[0] + .7152 * e[1] + .0722 * e[2];
}
function Yw(e, t) {
	return {
		minimum: e.map((e) => e - t),
		maximum: e.map((e) => e + t)
	};
}
function Xw(e) {
	let t = [
		Infinity,
		Infinity,
		Infinity
	], n = [
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let r of [-.5, .5]) for (let i of [-.5, .5]) for (let a = 0; a < 3; a++) {
		let o = e.position[a] + e.across[a] * r * e.width + e.along[a] * i * e.height;
		t[a] = Math.min(t[a], o), n[a] = Math.max(n[a], o);
	}
	return {
		minimum: t,
		maximum: n
	};
}
function Zw(e, t) {
	let n = Jw(e.color) * e.intensity;
	if (t === "area") return {
		...Xw(e),
		axis: [...e.normal],
		thetaO: 0,
		thetaE: mT,
		energy: n
	};
	let r = Yw(e.position, e.radius ?? 0);
	return t === "spot" ? {
		...r,
		axis: [...e.direction],
		thetaO: 0,
		thetaE: Math.acos(Math.min(1, Math.max(-1, e.cosineHalfAngle))),
		energy: n
	} : {
		...r,
		axis: [
			0,
			1,
			0
		],
		thetaO: Math.PI,
		thetaE: mT,
		energy: n
	};
}
function Qw(e, t) {
	let n = e[0] * t[0] + e[1] * t[1] + e[2] * t[2];
	return Math.acos(Math.min(1, Math.max(-1, n)));
}
function $w(e) {
	let t = e.map(Math.abs).indexOf(Math.min(...e.map(Math.abs))), n = [
		0,
		0,
		0
	];
	n[t] = 1;
	let r = [
		e[1] * n[2] - e[2] * n[1],
		e[2] * n[0] - e[0] * n[2],
		e[0] * n[1] - e[1] * n[0]
	], i = Math.hypot(...r);
	return r.map((e) => e / i);
}
function eT(e, t) {
	let [n, r] = t.thetaO > e.thetaO ? [t, e] : [e, t], i = Math.max(e.thetaE, t.thetaE), a = Qw(n.axis, r.axis);
	if (Math.min(a + r.thetaO, Math.PI) <= n.thetaO) return {
		axis: [...n.axis],
		thetaO: n.thetaO,
		thetaE: i
	};
	let o = (n.thetaO + a + r.thetaO) / 2;
	if (o >= Math.PI) return {
		axis: [...n.axis],
		thetaO: Math.PI,
		thetaE: i
	};
	let s = o - n.thetaO;
	if (Math.sin(a) < 1e-6) return {
		axis: $w(n.axis),
		thetaO: o,
		thetaE: i
	};
	let c = Math.sin(a - s) / Math.sin(a), l = Math.sin(s) / Math.sin(a), u = n.axis.map((e, t) => e * c + r.axis[t] * l), d = Math.hypot(...u) || 1;
	return {
		axis: u.map((e) => e / d),
		thetaO: o,
		thetaE: i
	};
}
function tT(e, t) {
	let n = eT(e, t);
	return {
		minimum: e.minimum.map((e, n) => Math.min(e, t.minimum[n])),
		maximum: e.maximum.map((e, n) => Math.max(e, t.maximum[n])),
		energy: e.energy + t.energy,
		...n
	};
}
function nT(e, t) {
	return e.minimum[t] + e.maximum[t];
}
function rT(e, t) {
	let n = t.map((t, n) => t - e[n]), r = Math.max(...n, 1e-6), i = n.map((e) => e + r * .001);
	return i[0] * i[1] + i[1] * i[2] + i[2] * i[0];
}
function iT(e, t) {
	let n = Math.min(e + t, Math.PI);
	return 2 * Math.PI * (1 - Math.cos(e)) + .5 * Math.PI * (2 * n * Math.sin(e) - Math.cos(e - 2 * n) - 2 * e * Math.sin(e) + Math.cos(e));
}
function aT(e) {
	return e.reduce((e, t) => e ? tT(e, t) : t, null);
}
function oT(e) {
	return e.energy * rT(e.minimum, e.maximum) * iT(e.thetaO, e.thetaE);
}
function sT(e) {
	let t = e.reduce((e, t) => ({
		minimum: e.minimum.map((e, n) => Math.min(e, t.minimum[n])),
		maximum: e.maximum.map((e, n) => Math.max(e, t.maximum[n]))
	}), {
		minimum: [
			Infinity,
			Infinity,
			Infinity
		],
		maximum: [
			-Infinity,
			-Infinity,
			-Infinity
		]
	}), n = Math.max(...t.maximum.map((e, n) => e - t.minimum[n]), 1e-9), r = null;
	for (let i = 0; i < 3; i++) {
		let a = e.map((e) => nT(e, i)), o = Math.min(...a), s = Math.max(...a);
		if (!(s - o > 1e-9)) continue;
		let c = Array.from({ length: hT }, () => []);
		e.forEach((e, t) => {
			let n = Math.min(11, Math.floor((a[t] - o) / (s - o) * hT));
			c[n].push(e);
		});
		let l = t.maximum[i] - t.minimum[i], u = n / Math.max(l, n * .001);
		for (let e = 1; e < hT; e++) {
			let t = c.slice(0, e).flat(), n = c.slice(e).flat();
			if (t.length === 0 || n.length === 0) continue;
			let i = u * (oT(aT(t)) + oT(aT(n)));
			(!r || i < r.cost) && (r = {
				cost: i,
				left: t,
				right: n
			});
		}
	}
	if (r && Number.isFinite(r.cost)) return [r.left, r.right];
	let i = 0, a = -1;
	for (let t = 0; t < 3; t++) {
		let n = e.map((e) => nT(e, t)), r = Math.max(...n) - Math.min(...n);
		r > a && (a = r, i = t);
	}
	let o = [...e].sort((e, t) => nT(e, i) - nT(t, i)), s = o.length >> 1;
	return [o.slice(0, s), o.slice(s)];
}
function cT(e) {
	let t = [
		...e.points.map((e) => Zw(e, "point")),
		...e.spots.map((e) => Zw(e, "spot")),
		...e.areas.map((e) => Zw(e, "area"))
	].map((e, t) => ({
		...e,
		lightIndex: t
	})), n = [];
	function r(e) {
		let t = n.length, i = {
			left: pT,
			right: pT,
			lightIndex: pT
		};
		if (n.push(i), e.length === 1) return Object.assign(i, e[0]), t;
		let [a, o] = sT(e);
		return i.left = r(a), i.right = r(o), Object.assign(i, tT(n[i.left], n[i.right])), t;
	}
	if (t.length === 0) return {
		nodeCount: 0,
		data: /* @__PURE__ */ new Float32Array(16)
	};
	r(t);
	let i = new Float32Array(n.length * 16);
	return n.forEach((e, t) => {
		let n = t * 16;
		i.set([...e.minimum, e.energy], n), i.set([...e.maximum, Math.cos(e.thetaO)], n + 4), i.set([...e.axis, Math.cos(e.thetaE)], n + 8), i.set([
			e.left,
			e.right,
			e.lightIndex,
			0
		], n + 12);
	}), {
		nodeCount: n.length,
		data: i
	};
}
function lT(e, t, n, r, i, a, o, s) {
	let c = t * 16, l = e[c + 3], u = (e[c] + e[c + 4]) * .5, d = (e[c + 1] + e[c + 5]) * .5, f = (e[c + 2] + e[c + 6]) * .5, p = .5 * Math.hypot(e[c + 4] - e[c], e[c + 5] - e[c + 1], e[c + 6] - e[c + 2]), m = u - n, h = d - r, g = f - i, _ = Math.hypot(m, h, g), v = Math.max(_, p, 1e-4), y = _ + p;
	if (gT.minimum = l / Math.max(y * y, 1e-8), _ <= p) return gT.maximum = l / (v * v), gT;
	let b = m / _, x = h / _, S = g / _, C = Math.acos(Math.sqrt(Math.max(0, 1 - (p / _) ** 2))), w = -(e[c + 8] * b + e[c + 9] * x + e[c + 10] * S), T = Math.acos(Math.min(1, Math.max(-1, w))), E = Math.acos(Math.min(1, Math.max(-1, e[c + 7]))), D = Math.acos(Math.min(1, Math.max(-1, e[c + 11]))), ee = Math.max(T - E - C, 0);
	if (ee >= D) return gT.maximum = 0, gT;
	let O = Math.acos(Math.min(1, Math.max(-1, a * b + o * x + s * S))), te = Math.max(Math.cos(Math.max(O - C, 0)), 0);
	return gT.maximum = l * Math.cos(ee) * te / (v * v), gT;
}
function uT(e, t, n, r) {
	let i = e + n, a = t + r;
	return a > 0 ? i > 0 ? e / i * .9 + t / a * fT : t / a : -1;
}
function dT(e, t, n, r, i, a, o, s) {
	if (_T.lightIndex = -1, _T.probability = 0, e.nodeCount === 0) return _T;
	let { data: c } = e, l = 0, u = 1;
	for (; c[l * 16 + 12] >= 0;) {
		let e = l * 16, d = c[e + 12], f = c[e + 13];
		lT(c, d, t, n, r, i, a, o);
		let p = gT.maximum, m = gT.minimum;
		lT(c, f, t, n, r, i, a, o);
		let h = uT(p, m, gT.maximum, gT.minimum);
		if (h < 0) return _T;
		s() < h ? (l = d, u *= h) : (l = f, u *= 1 - h);
	}
	return _T.lightIndex = c[l * 16 + 14], _T.probability = u, _T;
}
var fT, pT, mT, hT, gT, _T, vT = A((() => {
	fT = .1, pT = -1, mT = Math.PI / 2, hT = 12, gT = {
		maximum: 0,
		minimum: 0
	}, _T = {
		lightIndex: -1,
		probability: 0
	};
})), yT, bT, xT, ST, CT = A((() => {
	$C(), yT = "\nuniform sampler2D uSubsurface;\n", bT = "\n        subsurfaceWeight = splitSubsurface();", xT = "\n      if (subsurfaceWeight > 0.0) {\n        if (lobeUnit < surfaceSubsurfaceChance) {\n          if (!enterSubsurface(depth, normal)) break;\n          lobeUnit = 0.0;\n        } else {\n          lobeUnit -= surfaceSubsurfaceChance;\n        }\n      }", ST = "\n// ---- Subsurface random walk ----\n\nconst int WALK_STEPS = 32;\nconst int WALK_EXIT = 0;\nconst int WALK_THIN = 1;\nconst int WALK_LOST = 2;\nconst int SUBSURFACE_TEXELS = 2;\n\nfloat subsurfaceWeight = 0.0;\nfloat surfaceSubsurfaceChance = 0.0;\nvec3 walkWeight;\nvec3 walkDirection;\n\n/** Moves the subsurface share of the diffuse lobe to the walk; returns the material's weight. */\nfloat splitSubsurface() {\n  float weight = fetchData(uSubsurface, hitMaterialIndex * SUBSURFACE_TEXELS).x;\n  surfaceSubsurfaceChance = surfaceDiffuseChance * weight;\n  surfaceDiffuseChance -= surfaceSubsurfaceChance;\n  surfaceDiffuse *= 1.0 - weight;\n  return weight;\n}\n\nfloat singleScatterAlbedo(float multipleScatterAlbedo) {\n  float albedo = clamp(multipleScatterAlbedo, 0.0, 1.0);\n  float root = sqrt(9.59217 + 41.6808 * albedo + 17.7126 * albedo * albedo);\n  float offset = 4.09712 + 4.20863 * albedo - root;\n  return clamp(1.0 - offset * offset, 0.0, 1.0);\n}\n\n/** Walks inward from the entry point until the walk meets the part's own surface; leaves its throughput in walkWeight. */\nint randomWalk(vec3 point, vec3 normal, vec3 meanFreePath, vec3 color, int material) {\n  vec3 extinction = 1.0 / meanFreePath;\n  vec3 albedo = vec3(singleScatterAlbedo(color.r), singleScatterAlbedo(color.g), singleScatterAlbedo(color.b));\n  vec3 position = point - normal * uSurfaceOffset;\n  mat3 frame = buildFrame(normal);\n  float radius = sqrt(nextRandom());\n  float angle = TWO_PI * nextRandom();\n  float height = sqrt(max(0.0, 1.0 - radius * radius));\n  walkDirection = frame[0] * (radius * cos(angle)) + frame[1] * (radius * sin(angle)) - normal * height;\n  for (int scatters = 0; scatters <= WALK_STEPS; scatters++) {\n    bool found = intersectScene(position, walkDirection);\n    if (!found || hitMaterialIndex != material) return scatters == 0 ? WALK_THIN : WALK_LOST;\n    // One channel draws the distance; weighting by the mean density over the three channels keeps every channel unbiased.\n    int hero = min(2, int(floor(nextRandom() * 3.0)));\n    float distance = -log(1.0 - nextRandom()) / extinction[hero];\n    if (distance >= hitDistance) {\n      vec3 attenuation = exp(-extinction * hitDistance);\n      float survival = (attenuation.x + attenuation.y + attenuation.z) / 3.0;\n      if (!(survival > 0.0)) return WALK_LOST;\n      walkWeight *= attenuation / survival;\n      return WALK_EXIT;\n    }\n    if (scatters == WALK_STEPS) return WALK_LOST;\n    vec3 falloff = exp(-extinction * distance);\n    vec3 scatterDensity = extinction * falloff;\n    float density = (scatterDensity.x + scatterDensity.y + scatterDensity.z) / 3.0;\n    if (!(density > 0.0)) return WALK_LOST;\n    walkWeight *= albedo * scatterDensity / density;\n    position += walkDirection * distance;\n    float up = 2.0 * nextRandom() - 1.0;\n    float azimuth = TWO_PI * nextRandom();\n    float ring = sqrt(max(0.0, 1.0 - up * up));\n    walkDirection = vec3(ring * cos(azimuth), up, ring * sin(azimuth));\n  }\n  return WALK_LOST;\n}\n\n/**\n * Sends the diffuse light of the hit through its walk. On success the path stands where the walk left (or, for a card with\n * nothing behind it, on the near or far face), normal faces out of that point, the surface is white diffuse there with its\n * lights added, and the throughput carries the walk. False when the walk ended inside the part.\n */\nbool enterSubsurface(int depth, inout vec3 normal) {\n  vec4 block = fetchData(uSubsurface, hitMaterialIndex * SUBSURFACE_TEXELS);\n  vec4 colorBlock = fetchData(uSubsurface, hitMaterialIndex * SUBSURFACE_TEXELS + 1);\n  vec3 color = colorBlock.x < 0.0 ? hitColor : colorBlock.rgb;\n  int material = hitMaterialIndex;\n  vec3 entryPoint = hitPoint;\n  uint entryMask = hitMask;\n  float entryScale = surfaceDiffuseShare * block.x / surfaceSubsurfaceChance;\n  walkWeight = vec3(1.0);\n  int outcome = randomWalk(entryPoint, normal, block.yzw, color, material);\n  if (outcome == WALK_LOST) return false;\n  if (outcome == WALK_EXIT) {\n    // The exit hit is the tracer's hit now: its point and (flipped to face out of the part) its normal.\n    normal = hitNormal * (dot(hitNormal, walkDirection) < 0.0 ? -1.0 : 1.0);\n    throughput *= walkWeight * entryScale;\n  } else {\n    // A card: half of the colour is reflected on the side the ray came from and half is transmitted diffusely through it.\n    hitPoint = entryPoint;\n    hitMask = entryMask;\n    if (nextRandom() < 0.5) normal = -normal;\n    throughput *= color * entryScale;\n  }\n  surfaceFrame = buildFrame(normal);\n  surfaceDiffuse = vec3(1.0);\n  surfaceDiffuseChance = 1.0;\n  surfaceSubsurfaceChance = 0.0;\n  surfaceSpecularChance = 0.0;\n  surfaceCoatChance = 0.0;\n  surfaceCoatWeight = 0.0;\n  addLights(depth, normal);\n  return true;\n}\n";
})), wT, TT, ET = A((() => {
	CT(), $C(), wT = "\nvar<private> volumeSpan: vec2<f32>;\n\nfn clipAxis(origin: f32, axisDirection: f32, minimum: f32, maximum: f32, span: ptr<function, vec2<f32>>) -> bool {\n  if (axisDirection == 0.0) { return origin >= minimum && origin <= maximum; }\n  let first = (minimum - origin) / axisDirection;\n  let second = (maximum - origin) / axisDirection;\n  (*span).x = max((*span).x, min(first, second));\n  (*span).y = min((*span).y, max(first, second));\n  return true;\n}\n\nfn volumeInterval(origin: vec3<f32>, rayDirection: vec3<f32>, limit: f32) -> bool {\n  var span = vec2<f32>(0.0, min(limit, params.volumeAlbedoDistance.w));\n  let minimum = params.volumeMinimumDensity.xyz;\n  let maximum = params.volumeMaximumAnisotropy.xyz;\n  if (!clipAxis(origin.x, rayDirection.x, minimum.x, maximum.x, &span)) { return false; }\n  if (!clipAxis(origin.y, rayDirection.y, minimum.y, maximum.y, &span)) { return false; }\n  if (!clipAxis(origin.z, rayDirection.z, minimum.z, maximum.z, &span)) { return false; }\n  if (!(span.x < span.y)) { return false; }\n  volumeSpan = span;\n  return true;\n}\n\nfn henyeyGreensteinPhase(anisotropy: f32, cosine: f32) -> f32 {\n  let squared = anisotropy * anisotropy;\n  return (1.0 - squared) / (4.0 * PI * pow(1.0 + squared - 2.0 * anisotropy * cosine, 1.5));\n}\n\nfn sampleHenyeyGreensteinCosine(anisotropy: f32, unit: f32) -> f32 {\n  if (abs(anisotropy) < 1e-3) { return 1.0 - 2.0 * unit; }\n  let squared = anisotropy * anisotropy;\n  let ratio = (1.0 - squared) / (1.0 - anisotropy + 2.0 * anisotropy * unit);\n  return clamp((1.0 + squared - ratio * ratio) / (2.0 * anisotropy), -1.0, 1.0);\n}\n\nfn fogTransmittance(origin: vec3<f32>, distance: f32) -> f32 {\n  if (!volumeInterval(origin, lightDirection, distance)) { return 1.0; }\n  return exp(-params.volumeMinimumDensity.w * (volumeSpan.y - volumeSpan.x));\n}\n\n// Draws the next scattering event along the segment; when there is one it becomes hitPoint.\nfn scatterInFog(origin: vec3<f32>, segmentLength: f32) -> bool {\n  if (!volumeInterval(origin, direction, segmentLength)) { return false; }\n  let eventDistance = volumeSpan.x - log(1.0 - nextRandom()) / params.volumeMinimumDensity.w;\n  if (eventDistance >= volumeSpan.y) { return false; }\n  hitPoint = origin + direction * eventDistance;\n  return true;\n}\n", TT = "\nconst WALK_STEPS: i32 = 32;\nconst WALK_EXIT: i32 = 0;\nconst WALK_THIN: i32 = 1;\nconst WALK_LOST: i32 = 2;\nconst SUBSURFACE_TEXELS: i32 = 2;\n\nvar<private> subsurfaceWeight: f32 = 0.0;\nvar<private> surfaceSubsurfaceChance: f32 = 0.0;\nvar<private> walkWeight: vec3<f32>;\nvar<private> walkDirection: vec3<f32>;\nvar<private> subsurfaceNormal: vec3<f32>;\n\nfn subsurfaceVector(material: i32, offset: i32) -> vec4<f32> {\n  return materials[i32(params.seedAndAtlas.z) + material * SUBSURFACE_TEXELS + offset];\n}\n\n// Moves the subsurface share of the diffuse lobe to the walk; returns the material's weight.\nfn splitSubsurface() -> f32 {\n  let weight = subsurfaceVector(hitMaterialIndex, 0).x;\n  surfaceSubsurfaceChance = surfaceDiffuseChance * weight;\n  surfaceDiffuseChance -= surfaceSubsurfaceChance;\n  surfaceDiffuse *= 1.0 - weight;\n  return weight;\n}\n\nfn singleScatterAlbedo(multipleScatterAlbedo: f32) -> f32 {\n  let albedo = clamp(multipleScatterAlbedo, 0.0, 1.0);\n  let root = sqrt(9.59217 + 41.6808 * albedo + 17.7126 * albedo * albedo);\n  let offset = 4.09712 + 4.20863 * albedo - root;\n  return clamp(1.0 - offset * offset, 0.0, 1.0);\n}\n\n// Walks inward from the entry point until the walk meets the part's own surface; leaves its throughput in walkWeight.\nfn randomWalk(point: vec3<f32>, normal: vec3<f32>, meanFreePath: vec3<f32>, color: vec3<f32>, material: i32) -> i32 {\n  let extinction = 1.0 / meanFreePath;\n  let albedo = vec3<f32>(singleScatterAlbedo(color.r), singleScatterAlbedo(color.g), singleScatterAlbedo(color.b));\n  var position = point - normal * params.environmentRotationAndRays.z;\n  let frame = buildFrame(normal);\n  let radius = sqrt(nextRandom());\n  let angle = TWO_PI * nextRandom();\n  let height = sqrt(max(0.0, 1.0 - radius * radius));\n  walkDirection = frame[0] * (radius * cos(angle)) + frame[1] * (radius * sin(angle)) - normal * height;\n  for (var scatters = 0; scatters <= WALK_STEPS; scatters++) {\n    let found = intersectScene(position, walkDirection);\n    if (!found || hitMaterialIndex != material) { return select(WALK_LOST, WALK_THIN, scatters == 0); }\n    // One channel draws the distance; weighting by the mean density over the three channels keeps every channel unbiased.\n    let hero = min(2, i32(floor(nextRandom() * 3.0)));\n    let distance = -log(1.0 - nextRandom()) / extinction[hero];\n    if (distance >= hitDistance) {\n      let attenuation = exp(-extinction * hitDistance);\n      let survival = (attenuation.x + attenuation.y + attenuation.z) / 3.0;\n      if (!(survival > 0.0)) { return WALK_LOST; }\n      walkWeight *= attenuation / survival;\n      return WALK_EXIT;\n    }\n    if (scatters == WALK_STEPS) { return WALK_LOST; }\n    let falloff = exp(-extinction * distance);\n    let scatterDensity = extinction * falloff;\n    let density = (scatterDensity.x + scatterDensity.y + scatterDensity.z) / 3.0;\n    if (!(density > 0.0)) { return WALK_LOST; }\n    walkWeight *= albedo * scatterDensity / density;\n    position += walkDirection * distance;\n    let up = 2.0 * nextRandom() - 1.0;\n    let azimuth = TWO_PI * nextRandom();\n    let ring = sqrt(max(0.0, 1.0 - up * up));\n    walkDirection = vec3<f32>(ring * cos(azimuth), up, ring * sin(azimuth));\n  }\n  return WALK_LOST;\n}\n\n// Sends the diffuse light of the hit through its walk. On success the path stands where the walk left, subsurfaceNormal\n// faces out of that point, the surface is white diffuse there with its lights added, and the throughput carries the walk.\n// False when the walk ended inside the part.\nfn enterSubsurface(depth: i32, entryNormal: vec3<f32>) -> bool {\n  let block = subsurfaceVector(hitMaterialIndex, 0);\n  let colorBlock = subsurfaceVector(hitMaterialIndex, 1);\n  let color = select(colorBlock.rgb, hitColor, colorBlock.x < 0.0);\n  let material = hitMaterialIndex;\n  let entryPoint = hitPoint;\n  let entryMask = hitMask;\n  let entryScale = surfaceDiffuseShare * block.x / surfaceSubsurfaceChance;\n  walkWeight = vec3<f32>(1.0);\n  subsurfaceNormal = entryNormal;\n  let outcome = randomWalk(entryPoint, entryNormal, block.yzw, color, material);\n  if (outcome == WALK_LOST) { return false; }\n  if (outcome == WALK_EXIT) {\n    subsurfaceNormal = hitNormal * select(1.0, -1.0, dot(hitNormal, walkDirection) < 0.0);\n    throughput *= walkWeight * entryScale;\n  } else {\n    // A card: half of the colour is reflected on the side the ray came from and half is transmitted diffusely through it.\n    hitPoint = entryPoint;\n    hitMask = entryMask;\n    if (nextRandom() < 0.5) { subsurfaceNormal = -entryNormal; }\n    throughput *= color * entryScale;\n  }\n  surfaceFrame = buildFrame(subsurfaceNormal);\n  surfaceDiffuse = vec3<f32>(1.0);\n  surfaceDiffuseChance = 1.0;\n  surfaceSubsurfaceChance = 0.0;\n  surfaceSpecularChance = 0.0;\n  surfaceCoatChance = 0.0;\n  surfaceCoatWeight = 0.0;\n  addLights(depth, subsurfaceNormal);\n  return true;\n}\n";
})), DT, OT, kT, AT, jT, MT, NT = A((() => {
	vT(), ET(), DT = ({ hasVolume: e = !1 } = {}) => `
const PI: f32 = 3.14159265358979;
const TWO_PI: f32 = 6.28318530717959;
const TRIANGLE_TEXELS: i32 = 9;
const MATERIAL_TEXELS: i32 = 10;
const LIGHT_TEXELS: i32 = 6;
const STACK_SIZE: i32 = 128;
const ALPHA_STEP_LIMIT: i32 = 64;
const RUSSIAN_ROULETTE_START: i32 = 3;
const MINIMUM_ALPHA: f32 = 1e-3;
const MIRROR_ALPHA: f32 = 2e-3;
const DIELECTRIC_COAT_REFLECTANCE: f32 = 0.04;

struct Params {
  eye: vec4<f32>,
  forward: vec4<f32>,
  right: vec4<f32>,
  above: vec4<f32>,
  sunDirection: vec4<f32>,
  sunColorAndCosine: vec4<f32>,
  environmentShape: vec4<f32>,
  environmentRotationAndRays: vec4<f32>,
  cameraAndClamp: vec4<f32>,
  sizeBouncesLights: vec4<i32>,
  emittersFlagsSample: vec4<i32>,
  seedAndAtlas: vec4<u32>,
  tileAndDepth: vec4<u32>,
  shadowSlots: vec4<u32>,
  volumeMinimumDensity: vec4<f32>,
  volumeMaximumAnisotropy: vec4<f32>,
  volumeAlbedoDistance: vec4<f32>,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> nodes: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read> triangles: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read> materials: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read> lights: array<vec4<f32>>;
@group(0) @binding(5) var<storage, read> atlas: array<u32>;
@group(0) @binding(6) var<storage, read> environmentColors: array<vec4<f32>>;
@group(0) @binding(7) var<storage, read> environmentTables: array<f32>;
// Four planes of pixelCount vec4 each: radiance and depth, albedo, normal, luminance statistics.
@group(0) @binding(8) var<storage, read_write> accumulation: array<vec4<f32>>;

var<private> rngState: u32 = 1u;

fn resetRandom(pixel: u32, sampleIndex: u32, seed: u32) {
  var mixed = ((pixel + 0x9e3779b9u) * 0x85ebca6bu) ^ ((sampleIndex + 0x7f4a7c15u) * 0xc2b2ae35u) ^ ((seed + 0x165667b1u) * 0x27d4eb2fu);
  mixed = (mixed ^ (mixed >> 15u)) * 0x2c1b3c6du;
  mixed = (mixed ^ (mixed >> 12u)) * 0x297a2d39u;
  mixed ^= mixed >> 15u;
  rngState = select(mixed, 1u, mixed == 0u);
}

fn nextRandom() -> f32 {
  rngState = rngState * 747796405u + 2891336453u;
  var word = ((rngState >> ((rngState >> 28u) + 4u)) ^ rngState) * 277803737u;
  word = (word >> 22u) ^ word;
  return f32(word >> 8u) / 16777216.0;
}

fn hashJitter(pixel: u32, sampleIndex: u32, seed: u32, dimension: u32) -> f32 {
  var mixed = ((pixel ^ 0x51ed270bu) * 0x9e3779b1u) ^ ((sampleIndex + dimension * 0x632be5abu) * 0x85ebca6bu) ^ ((seed + 0x1b873593u) * 0xc2b2ae35u);
  mixed = (mixed ^ (mixed >> 16u)) * 0x7feb352du;
  mixed = (mixed ^ (mixed >> 15u)) * 0x846ca68bu;
  mixed ^= mixed >> 16u;
  return f32(mixed >> 8u) / 16777216.0;
}

fn luminance(color: vec3<f32>) -> f32 {
  return dot(color, vec3<f32>(0.2126, 0.7152, 0.0722));
}

// ---- Ray queries ----

var<private> nearestDistance: f32;
var<private> nearestSlot: i32;
var<private> nearestU: f32;
var<private> nearestV: f32;
var<private> nodeStack: array<i32, 128>;
var<private> entryStack: array<f32, 128>;

fn safeInverseComponent(component: f32) -> f32 {
  if (abs(component) > 1e-20) { return 1.0 / component; }
  return select(1e20, -1e20, component < 0.0);
}

fn safeInverse(direction: vec3<f32>) -> vec3<f32> {
  return vec3<f32>(safeInverseComponent(direction.x), safeInverseComponent(direction.y), safeInverseComponent(direction.z));
}

fn boxEntry(node: i32, origin: vec3<f32>, inverse: vec3<f32>) -> f32 {
  let low = nodes[node * 2];
  let high = nodes[node * 2 + 1];
  let first = (low.xyz - origin) * inverse;
  let second = (high.xyz - origin) * inverse;
  let nearest = min(first, second);
  let farthest = max(first, second);
  let entry = max(max(max(nearest.x, nearest.y), nearest.z), 0.0);
  let exitDistance = min(min(farthest.x, farthest.y), farthest.z);
  return select(1e30, entry, entry <= exitDistance * (1.0 + 1e-6) + 1e-6);
}

fn visitLeaf(node: i32, origin: vec3<f32>, direction: vec3<f32>, anyHit: bool) -> bool {
  let range = nodes[node * 2 + 1];
  let header = nodes[node * 2];
  let start = i32(range.w);
  let end = start + i32(-header.w);
  for (var slot = start; slot < end; slot++) {
    let base = slot * TRIANGLE_TEXELS;
    let corner = triangles[base].xyz;
    let edgeFirst = triangles[base + 1].xyz;
    let edgeSecond = triangles[base + 2].xyz;
    let pivot = cross(direction, edgeSecond);
    let determinant = dot(edgeFirst, pivot);
    if (determinant == 0.0) { continue; }
    let offset = origin - corner;
    let firstWeight = dot(offset, pivot) / determinant;
    if (firstWeight < 0.0 || firstWeight > 1.0) { continue; }
    let query = cross(offset, edgeFirst);
    let secondWeight = dot(direction, query) / determinant;
    if (secondWeight < 0.0 || firstWeight + secondWeight > 1.0) { continue; }
    let distance = dot(edgeSecond, query) / determinant;
    if (distance < 0.0 || distance >= nearestDistance) { continue; }
    nearestDistance = distance;
    nearestSlot = slot;
    nearestU = firstWeight;
    nearestV = secondWeight;
    if (anyHit) { return true; }
  }
  return false;
}

fn traceRay(origin: vec3<f32>, direction: vec3<f32>, limit: f32, anyHit: bool) {
  nearestDistance = limit;
  nearestSlot = -1;
  let inverse = safeInverse(direction);
  var stackSize = 1;
  nodeStack[0] = 0;
  entryStack[0] = 0.0;
  while (stackSize > 0) {
    stackSize--;
    let node = nodeStack[stackSize];
    if (!(entryStack[stackSize] < nearestDistance)) { continue; }
    let header = nodes[node * 2];
    if (header.w < 0.0) {
      if (visitLeaf(node, origin, direction, anyHit)) { return; }
      continue;
    }
    let left = node + 1;
    let right = i32(header.w);
    let leftEntry = boxEntry(left, origin, inverse);
    let rightEntry = boxEntry(right, origin, inverse);
    let nearFirst = leftEntry <= rightEntry;
    nodeStack[stackSize] = select(left, right, nearFirst);
    entryStack[stackSize] = select(leftEntry, rightEntry, nearFirst);
    nodeStack[stackSize + 1] = select(right, left, nearFirst);
    entryStack[stackSize + 1] = select(rightEntry, leftEntry, nearFirst);
    stackSize += 2;
  }
}

// ---- Hits ----

var<private> hitDistance: f32;
var<private> hitPoint: vec3<f32>;
var<private> hitNormal: vec3<f32>;
var<private> hitColor: vec3<f32>;
var<private> hitEmission: vec3<f32>;
var<private> hitMetallic: f32;
var<private> hitRoughness: f32;
var<private> hitClearcoat: f32;
var<private> hitClearcoatRoughness: f32;
var<private> hitTransmission: f32;
var<private> hitIor: f32;
var<private> hitCutoff: f32;
var<private> hitMask: u32;
var<private> hitMaterialIndex: i32;

fn srgbToLinear(encoded: vec3<f32>) -> vec3<f32> {
  return select(pow((encoded + 0.055) / 1.055, vec3<f32>(2.4)), encoded / 12.92, encoded <= vec3<f32>(0.04045));
}

fn atlasTexel(x: i32, y: i32) -> vec4<f32> {
  return unpack4x8unorm(atlas[u32(y) * params.seedAndAtlas.y + u32(x)]);
}

fn sampleAtlas(rectangle: vec4<f32>, flags: f32, uv: vec2<f32>) -> vec4<f32> {
  if (rectangle.z <= 0.0) { return vec4<f32>(1.0); }
  let width = i32(rectangle.z);
  let height = i32(rectangle.w);
  let repeat = (flags % 2.0) >= 1.0;
  let encoded = flags >= 2.0;
  let x = uv.x * rectangle.z - 0.5;
  let y = uv.y * rectangle.w - 0.5;
  let left = floor(x);
  let top = floor(y);
  let shareX = x - left;
  let shareY = y - top;
  var total = vec4<f32>(0.0);
  for (var corner = 0; corner < 4; corner++) {
    var column = i32(left) + (corner & 1);
    var row = i32(top) + (corner >> 1u);
    if (repeat) {
      column = ((column % width) + width) % width;
      row = ((row % height) + height) % height;
    } else {
      column = clamp(column, 0, width - 1);
      row = clamp(row, 0, height - 1);
    }
    let weight = select(1.0 - shareX, shareX, (corner & 1) == 1) * select(1.0 - shareY, shareY, (corner >> 1u) == 1);
    let texel = atlasTexel(i32(rectangle.x) + column, i32(rectangle.y) + row);
    let color = select(texel.rgb, srgbToLinear(texel.rgb), encoded);
    total += weight * vec4<f32>(color, texel.a);
  }
  return total;
}

fn applyNormalMap(rectangle: vec4<f32>, flags: f32, scale: vec2<f32>, edgeOne: vec3<f32>, edgeTwo: vec3<f32>, uvOne: vec2<f32>, uvTwo: vec2<f32>, uv: vec2<f32>) {
  let determinant = uvOne.x * uvTwo.y - uvTwo.x * uvOne.y;
  if (abs(determinant) < 1e-12) { return; }
  let normal = hitNormal;
  var tangent = (edgeOne * uvTwo.y - edgeTwo * uvOne.y) / determinant;
  let bitangent = (edgeTwo * uvOne.x - edgeOne * uvTwo.x) / determinant;
  tangent -= normal * dot(tangent, normal);
  let tangentLength = length(tangent);
  if (tangentLength == 0.0) { return; }
  tangent /= tangentLength;
  var across = cross(normal, tangent);
  var acrossLength = length(across);
  if (acrossLength == 0.0) { acrossLength = 1.0; }
  let handedness = select(1.0, -1.0, dot(across, bitangent) < 0.0);
  across *= handedness / acrossLength;
  let texel = sampleAtlas(rectangle, flags, uv).rgb;
  let sideways = (texel.x * 2.0 - 1.0) * scale.x;
  let forwards = (texel.y * 2.0 - 1.0) * scale.y;
  let outwards = texel.z * 2.0 - 1.0;
  let mapped = tangent * sideways + across * forwards + normal * outwards;
  let mappedLength = length(mapped);
  if (!(mappedLength > 1e-6)) { return; }
  hitNormal = mapped / mappedLength;
}

// Fills the hit globals from the triangle in nearestSlot; returns the alpha of the colour map.
fn fillHit(origin: vec3<f32>, direction: vec3<f32>, distance: f32) -> f32 {
  let base = nearestSlot * TRIANGLE_TEXELS;
  let cornerData = triangles[base];
  let edgeOne = triangles[base + 1].xyz;
  let edgeTwo = triangles[base + 2].xyz;
  let normalOneData = triangles[base + 3];
  let normalTwoData = triangles[base + 4];
  let normalThreeData = triangles[base + 5];
  let colorOneData = triangles[base + 6];
  let colorTwoData = triangles[base + 7];
  let colorThreeData = triangles[base + 8];
  let secondWeight = nearestU;
  let thirdWeight = nearestV;
  let firstWeight = 1.0 - secondWeight - thirdWeight;
  hitDistance = distance;
  hitPoint = origin + direction * distance;
  let normal = firstWeight * normalOneData.xyz + secondWeight * normalTwoData.xyz + thirdWeight * normalThreeData.xyz;
  let normalLength = length(normal);
  hitNormal = normal / select(normalLength, 1.0, normalLength == 0.0);
  let vertexColor = firstWeight * colorOneData.xyz + secondWeight * colorTwoData.xyz + thirdWeight * colorThreeData.xyz;
  let uv = firstWeight * vec2<f32>(normalOneData.w, colorOneData.w) + secondWeight * vec2<f32>(normalTwoData.w, colorTwoData.w) + thirdWeight * vec2<f32>(normalThreeData.w, colorThreeData.w);
  hitMaterialIndex = i32(cornerData.w);
  let material = hitMaterialIndex * MATERIAL_TEXELS;
  let colorMetallic = materials[material];
  let emissionRoughness = materials[material + 1];
  let coating = materials[material + 2];
  let shape = materials[material + 3];
  let flagsOne = materials[material + 4];
  let flagsTwo = materials[material + 5];
  hitColor = colorMetallic.rgb * vertexColor;
  hitEmission = emissionRoughness.rgb;
  hitMetallic = colorMetallic.w;
  hitRoughness = emissionRoughness.w;
  hitClearcoat = coating.x;
  hitClearcoatRoughness = coating.y;
  hitTransmission = coating.z;
  hitIor = coating.w;
  hitCutoff = shape.z;
  hitMask = u32(shape.w) | (u32(flagsOne.x) << 16u);
  var alpha = 1.0;
  let mapRectangle = materials[material + 6];
  if (mapRectangle.z > 0.0) {
    let texel = sampleAtlas(mapRectangle, flagsOne.y, uv);
    hitColor *= texel.rgb;
    alpha = texel.a;
  }
  let emissiveRectangle = materials[material + 9];
  if (emissiveRectangle.z > 0.0) { hitEmission *= sampleAtlas(emissiveRectangle, flagsTwo.x, uv).rgb; }
  let surfaceRectangle = materials[material + 8];
  if (surfaceRectangle.z > 0.0) {
    let texel = sampleAtlas(surfaceRectangle, flagsOne.w, uv);
    hitRoughness *= texel.g;
    hitMetallic *= texel.b;
  }
  let normalRectangle = materials[material + 7];
  if (normalRectangle.z > 0.0) {
    let uvOne = vec2<f32>(normalTwoData.w - normalOneData.w, colorTwoData.w - colorOneData.w);
    let uvTwo = vec2<f32>(normalThreeData.w - normalOneData.w, colorThreeData.w - colorOneData.w);
    applyNormalMap(normalRectangle, flagsOne.z, shape.xy, edgeOne, edgeTwo, uvOne, uvTwo, uv);
  }
  return alpha;
}

// The nearest solid hit, stepping through the transparent texels of cutout materials.
fn intersectScene(origin: vec3<f32>, direction: vec3<f32>) -> bool {
  var start = origin;
  var travelled = 0.0;
  let farDistance = params.environmentRotationAndRays.w;
  let surfaceOffset = params.environmentRotationAndRays.z;
  for (var attempt = 0; attempt < ALPHA_STEP_LIMIT; attempt++) {
    traceRay(start, direction, farDistance, false);
    if (nearestSlot < 0) { return false; }
    let foundDistance = nearestDistance;
    let alpha = fillHit(start, direction, foundDistance);
    if (hitCutoff == 0.0 || alpha >= hitCutoff) {
      hitDistance += travelled;
      return true;
    }
    let advance = foundDistance + surfaceOffset;
    travelled += advance;
    start += direction * advance;
  }
  return false;
}

// The alpha of the colour map at the nearest hit, without touching the hit globals a shadow ray must not disturb.
fn alphaAtNearestHit() -> f32 {
  let base = nearestSlot * TRIANGLE_TEXELS;
  let secondWeight = nearestU;
  let thirdWeight = nearestV;
  let firstWeight = 1.0 - secondWeight - thirdWeight;
  let first = triangles[base + 3];
  let second = triangles[base + 4];
  let third = triangles[base + 5];
  let uv = firstWeight * vec2<f32>(first.w, triangles[base + 6].w) + secondWeight * vec2<f32>(second.w, triangles[base + 7].w) + thirdWeight * vec2<f32>(third.w, triangles[base + 8].w);
  let material = i32(triangles[base].w) * MATERIAL_TEXELS;
  let mapRectangle = materials[material + 6];
  if (mapRectangle.z <= 0.0) { return 1.0; }
  return sampleAtlas(mapRectangle, materials[material + 4].y, uv).a;
}

fn occluded(origin: vec3<f32>, direction: vec3<f32>, limit: f32) -> bool {
  var start = origin;
  var remaining = limit;
  let surfaceOffset = params.environmentRotationAndRays.z;
  // A solid any-hit shadows the point wherever it lies; a transparent one hides what sits before it, so retrace for nearest hits.
  var anyHit = true;
  for (var attempt = 0; attempt < ALPHA_STEP_LIMIT; attempt++) {
    traceRay(start, direction, remaining, anyHit);
    if (nearestSlot < 0) { return false; }
    let material = i32(triangles[nearestSlot * TRIANGLE_TEXELS].w) * MATERIAL_TEXELS;
    let cutoff = materials[material + 3].z;
    if (cutoff == 0.0) { return true; }
    if (alphaAtNearestHit() >= cutoff) { return true; }
    if (anyHit) {
      anyHit = false;
      continue;
    }
    let advance = nearestDistance + surfaceOffset;
    remaining -= advance;
    if (remaining <= 0.0) { return false; }
    start += direction * advance;
  }
  return true;
}

// ---- Frames ----

fn buildFrame(normal: vec3<f32>) -> mat3x3<f32> {
  let helperIsX = abs(normal.x) < 0.9;
  let helperX = select(0.0, 1.0, helperIsX);
  let helperY = select(1.0, 0.0, helperIsX);
  let tangent = normalize(vec3<f32>(-normal.z * helperY, normal.z * helperX, normal.x * helperY - normal.y * helperX));
  return mat3x3<f32>(tangent, cross(normal, tangent), normal);
}

fn localToWorld(frame: mat3x3<f32>, local: vec3<f32>) -> vec3<f32> {
  return frame * local;
}

fn worldToLocal(frame: mat3x3<f32>, world: vec3<f32>) -> vec3<f32> {
  return transpose(frame) * world;
}

// ---- Environment map ----

fn environmentRadiance(direction: vec3<f32>) -> vec3<f32> {
  let width = params.environmentShape.x;
  let height = params.environmentShape.y;
  let cosine = params.environmentRotationAndRays.x;
  let sine = params.environmentRotationAndRays.y;
  let mapX = cosine * direction.x - sine * direction.z;
  let mapZ = sine * direction.x + cosine * direction.z;
  let column = (atan2(mapX, -mapZ) / TWO_PI + 0.5) * width - 0.5;
  let row = acos(clamp(direction.y, -1.0, 1.0)) / PI * height - 0.5;
  let left = floor(column);
  let top = floor(row);
  let shareX = column - left;
  let shareY = row - top;
  let columns = i32(width);
  let rows = i32(height);
  var total = vec3<f32>(0.0);
  for (var corner = 0; corner < 4; corner++) {
    let cornerColumn = ((i32(left) + (corner & 1)) % columns + columns) % columns;
    let cornerRow = clamp(i32(top) + (corner >> 1u), 0, rows - 1);
    let weight = select(1.0 - shareX, shareX, (corner & 1) == 1) * select(1.0 - shareY, shareY, (corner >> 1u) == 1);
    total += weight * environmentColors[cornerRow * columns + cornerColumn].rgb * params.environmentShape.z;
  }
  return total;
}

fn environmentPdf(direction: vec3<f32>) -> f32 {
  let width = params.environmentShape.x;
  let height = params.environmentShape.y;
  let cosine = params.environmentRotationAndRays.x;
  let sine = params.environmentRotationAndRays.y;
  let mapX = cosine * direction.x - sine * direction.z;
  let mapZ = sine * direction.x + cosine * direction.z;
  let column = min(i32(width) - 1, i32(floor((atan2(mapX, -mapZ) / TWO_PI + 0.5) * width)));
  let polar = acos(clamp(direction.y, -1.0, 1.0));
  let row = min(i32(height) - 1, i32(floor(polar / PI * height)));
  let sinePolar = max(sin(polar), 1e-6);
  let rowWeight = sin(PI * (f32(row) + 0.5) / height);
  let texel = environmentColors[row * i32(width) + column].rgb;
  let weight = (luminance(texel) + 1e-6) * rowWeight;
  return weight / params.environmentShape.w * width * height / (TWO_PI * PI * sinePolar);
}

// The cumulative row table sits first in environmentTables, the per-pixel tables follow it.
fn firstIndexAbove(tableOffset: i32, start: i32, end: i32, threshold: f32) -> i32 {
  var low = start;
  var high = end - 1;
  for (var step = 0; step < 24; step++) {
    if (low >= high) { break; }
    let middle = (low + high) >> 1u;
    if (environmentTables[tableOffset + middle] < threshold) { low = middle + 1; } else { high = middle; }
  }
  return low;
}

var<private> sampledDirection: vec3<f32>;

// Draws a direction in proportion to the map's light into sampledDirection; returns its pdf.
fn sampleEnvironment(rowUnit: f32, columnUnit: f32, columnJitter: f32, rowJitter: f32) -> f32 {
  let width = i32(params.environmentShape.x);
  let height = i32(params.environmentShape.y);
  let row = firstIndexAbove(0, 0, height, rowUnit);
  let rowBase = row * width;
  let column = firstIndexAbove(height, rowBase, rowBase + width, columnUnit) - rowBase;
  let polar = PI * (f32(row) + rowJitter) / f32(height);
  let azimuth = ((f32(column) + columnJitter) / f32(width) - 0.5) * TWO_PI;
  let sinePolar = sin(polar);
  let mapX = sinePolar * sin(azimuth);
  let mapZ = -sinePolar * cos(azimuth);
  let cosine = params.environmentRotationAndRays.x;
  let sine = params.environmentRotationAndRays.y;
  sampledDirection = vec3<f32>(cosine * mapX + sine * mapZ, cos(polar), -sine * mapX + cosine * mapZ);
  return environmentPdf(sampledDirection);
}

// ---- Microfacet pieces ----

fn ggxDistribution(alpha: f32, cosineHalf: f32) -> f32 {
  let alphaSquared = alpha * alpha;
  let denominator = cosineHalf * cosineHalf * (alphaSquared - 1.0) + 1.0;
  return alphaSquared / (PI * denominator * denominator);
}

fn smithMasking(alpha: f32, cosine: f32) -> f32 {
  let alphaSquared = alpha * alpha;
  return 2.0 * cosine / (cosine + sqrt(alphaSquared + (1.0 - alphaSquared) * cosine * cosine));
}

fn schlick(reflectanceAtNormal: f32, cosine: f32) -> f32 {
  let weight = pow(1.0 - clamp(cosine, 0.0, 1.0), 5.0);
  return reflectanceAtNormal + (1.0 - reflectanceAtNormal) * weight;
}

fn schlickColor(reflectanceAtNormal: vec3<f32>, cosine: f32) -> vec3<f32> {
  let weight = pow(1.0 - clamp(cosine, 0.0, 1.0), 5.0);
  return reflectanceAtNormal + (1.0 - reflectanceAtNormal) * weight;
}

fn sampleVisibleNormal(view: vec3<f32>, alpha: f32, firstUnit: f32, secondUnit: f32) -> vec3<f32> {
  var stretched = vec3<f32>(alpha * view.x, alpha * view.y, view.z);
  let stretchedLength = length(stretched);
  stretched /= stretchedLength;
  let heightAxis = stretched.z;
  let planeLength = length(stretched.xy);
  let planeDirection = select(vec2<f32>(0.0), stretched.xy / planeLength, planeLength > 0.0);
  let tangent = select(vec2<f32>(1.0, 0.0), vec2<f32>(-stretched.y, stretched.x) / planeLength, planeLength > 0.0);
  let bitangentXY = -heightAxis * planeDirection;
  let bitangentZ = planeLength;
  let radius = sqrt(firstUnit);
  let angle = TWO_PI * secondUnit;
  let diskX = radius * cos(angle);
  var diskY = radius * sin(angle);
  let blend = 0.5 * (1.0 + heightAxis);
  diskY = (1.0 - blend) * sqrt(1.0 - diskX * diskX) + blend * diskY;
  let lift = sqrt(max(0.0, 1.0 - diskX * diskX - diskY * diskY));
  let normalXY = diskX * tangent + diskY * bitangentXY + lift * stretched.xy;
  let normalZ = diskY * bitangentZ + lift * heightAxis;
  let unstretched = vec3<f32>(alpha * normalXY.x, alpha * normalXY.y, max(0.0, normalZ));
  return unstretched / length(unstretched);
}

fn roughnessToAlpha(roughness: f32) -> f32 {
  return max(roughness * roughness, MINIMUM_ALPHA);
}

// ---- The layered surface ----

var<private> surfaceFrame: mat3x3<f32>;
var<private> surfaceView: vec3<f32>;
var<private> surfaceViewCosine: f32;
var<private> surfaceDiffuse: vec3<f32>;
var<private> surfaceSpecularNormal: vec3<f32>;
var<private> surfaceSpecularWeight: f32;
var<private> surfaceSpecularAlpha: f32;
var<private> surfaceCoatWeight: f32;
var<private> surfaceCoatChance: f32;
var<private> surfaceSampledCoat: bool;
var<private> surfaceCoatAlpha: f32;
var<private> surfaceDiffuseChance: f32;
var<private> surfaceDiffuseShare: f32;
var<private> surfaceSpecularChance: f32;
var<private> surfaceValue: vec3<f32>;
var<private> surfacePdf: f32;

fn dielectricSpecularAlbedo(normalReflectance: f32, roughness: f32, viewCosine: f32) -> f32 {
  let smoothness = 1.0 - roughness;
  let slope = min(smoothness * smoothness, exp2(-9.28 * viewCosine)) * smoothness + (0.0425 - 0.0275 * roughness);
  let scale = 1.04 - 0.572 * roughness - 1.04 * slope;
  let offset = 1.04 * slope + 0.022 * roughness - 0.04;
  return clamp(normalReflectance * scale + offset, 0.0, 1.0);
}

fn prepareSurface(normal: vec3<f32>, view: vec3<f32>) {
  surfaceFrame = buildFrame(normal);
  surfaceView = view;
  let viewCosine = max(dot(normal, view), 1e-4);
  surfaceViewCosine = viewCosine;
  let ratio = (hitIor - 1.0) / (hitIor + 1.0);
  let dielectricNormalReflectance = ratio * ratio;
  let dielectricFresnel = dielectricSpecularAlbedo(dielectricNormalReflectance, hitRoughness, viewCosine);
  surfaceCoatWeight = select(0.0, hitClearcoat * schlick(DIELECTRIC_COAT_REFLECTANCE, viewCosine), hitClearcoat > 0.0);
  let underCoat = 1.0 - surfaceCoatWeight;
  let diffuseShare = (1.0 - hitMetallic) * (1.0 - dielectricFresnel) * underCoat;
  surfaceDiffuse = hitColor * diffuseShare;
  surfaceDiffuseShare = diffuseShare;
  surfaceSpecularNormal = vec3<f32>(dielectricNormalReflectance * (1.0 - hitMetallic)) + hitColor * hitMetallic;
  let specularLuminance = luminance(surfaceSpecularNormal);
  surfaceSpecularWeight = underCoat;
  surfaceSpecularAlpha = roughnessToAlpha(hitRoughness);
  surfaceCoatAlpha = roughnessToAlpha(hitClearcoatRoughness);
  let diffuseLuminance = luminance(surfaceDiffuse);
  let specularChance = schlick(specularLuminance, viewCosine) * underCoat;
  let coatChance = surfaceCoatWeight;
  let sum = diffuseLuminance + specularChance + coatChance;
  surfaceDiffuseChance = select(1.0, diffuseLuminance / sum, sum > 0.0);
  surfaceSpecularChance = select(0.0, specularChance / sum, sum > 0.0);
  surfaceCoatChance = select(0.0, coatChance / sum, sum > 0.0);
}

fn microfacetTerm(alpha: f32, viewCosine: f32, lightCosine: f32, halfCosine: f32) -> f32 {
  return ggxDistribution(alpha, halfCosine) * smithMasking(alpha, viewCosine) * smithMasking(alpha, lightCosine) / (4.0 * viewCosine * lightCosine);
}

fn evaluateSurface(lightDirection: vec3<f32>) {
  surfaceValue = vec3<f32>(0.0);
  surfacePdf = 0.0;
  let normal = surfaceFrame[2];
  let lightCosine = dot(normal, lightDirection);
  if (lightCosine <= 0.0) { return; }
  var halfVector = surfaceView + lightDirection;
  let halfLength = length(halfVector);
  halfVector /= select(halfLength, 1.0, halfLength == 0.0);
  let halfCosine = dot(normal, halfVector);
  let viewHalfCosine = max(dot(surfaceView, halfVector), 0.0);
  let viewCosine = surfaceViewCosine;
  surfacePdf += surfaceDiffuseChance * lightCosine / PI;
  surfaceValue += surfaceDiffuse / PI;
  if (surfaceSpecularChance > 0.0 && surfaceSpecularAlpha > MIRROR_ALPHA) {
    let alpha = surfaceSpecularAlpha;
    let term = microfacetTerm(alpha, viewCosine, lightCosine, halfCosine) * surfaceSpecularWeight;
    surfaceValue += schlickColor(surfaceSpecularNormal, viewHalfCosine) * term;
    surfacePdf += surfaceSpecularChance * smithMasking(alpha, viewCosine) * ggxDistribution(alpha, halfCosine) / (4.0 * viewCosine);
  }
  if (surfaceCoatChance > 0.0 && surfaceCoatAlpha > MIRROR_ALPHA) {
    let alpha = surfaceCoatAlpha;
    let reflectance = schlick(DIELECTRIC_COAT_REFLECTANCE, viewHalfCosine) * microfacetTerm(alpha, viewCosine, lightCosine, halfCosine) * (surfaceCoatWeight / max(schlick(DIELECTRIC_COAT_REFLECTANCE, viewCosine), 1e-6));
    surfaceValue += vec3<f32>(reflectance);
    surfacePdf += surfaceCoatChance * smithMasking(alpha, viewCosine) * ggxDistribution(alpha, halfCosine) / (4.0 * viewCosine);
  }
}

// The next direction of a path goes into sampledDirection; returns true for a mirror lobe, which is followed exactly.
fn sampleSurface(lobeUnit: f32, firstUnit: f32, secondUnit: f32) -> bool {
  if (lobeUnit < surfaceDiffuseChance) {
    let radius = sqrt(firstUnit);
    let angle = TWO_PI * secondUnit;
    sampledDirection = localToWorld(surfaceFrame, vec3<f32>(radius * cos(angle), radius * sin(angle), sqrt(max(0.0, 1.0 - firstUnit))));
    return false;
  }
  let isCoat = lobeUnit >= surfaceDiffuseChance + surfaceSpecularChance;
  surfaceSampledCoat = isCoat;
  let alpha = select(surfaceSpecularAlpha, surfaceCoatAlpha, isCoat);
  let localView = worldToLocal(surfaceFrame, surfaceView);
  if (alpha <= MIRROR_ALPHA) {
    sampledDirection = 2.0 * surfaceViewCosine * surfaceFrame[2] - surfaceView;
    return true;
  }
  let localHalf = sampleVisibleNormal(localView, alpha, firstUnit, secondUnit);
  let localLight = 2.0 * dot(localView, localHalf) * localHalf - localView;
  sampledDirection = localToWorld(surfaceFrame, localLight);
  return false;
}

fn mirrorWeight() -> vec3<f32> {
  if (surfaceSampledCoat) { return vec3<f32>(surfaceCoatWeight / surfaceCoatChance); }
  return schlickColor(surfaceSpecularNormal, surfaceViewCosine) * surfaceSpecularWeight / surfaceSpecularChance;
}

fn dielectricFresnelTerm(cosineIncident: f32, relativeIndex: f32) -> f32 {
  let sineSquared = relativeIndex * relativeIndex * (1.0 - cosineIncident * cosineIncident);
  if (sineSquared >= 1.0) { return 1.0; }
  let cosineTransmitted = sqrt(1.0 - sineSquared);
  let parallel = (relativeIndex * cosineIncident - cosineTransmitted) / (relativeIndex * cosineIncident + cosineTransmitted);
  let perpendicular = (cosineIncident - relativeIndex * cosineTransmitted) / (cosineIncident + relativeIndex * cosineTransmitted);
  return 0.5 * (parallel * parallel + perpendicular * perpendicular);
}

// The glass direction goes into sampledDirection; returns false when the path must end.
fn sampleGlass(normal: vec3<f32>, view: vec3<f32>, entering: bool, ior: f32, alpha: f32, selectionUnit: f32, firstUnit: f32, secondUnit: f32) -> bool {
  let frame = buildFrame(normal);
  var halfVector = normal;
  if (alpha > MIRROR_ALPHA) {
    let localView = worldToLocal(frame, view);
    halfVector = localToWorld(frame, sampleVisibleNormal(localView, alpha, firstUnit, secondUnit));
  }
  let relativeIndex = select(ior, 1.0 / ior, entering);
  let cosineIncident = max(dot(view, halfVector), 1e-6);
  let reflectChance = dielectricFresnelTerm(cosineIncident, relativeIndex);
  if (selectionUnit < reflectChance) {
    sampledDirection = 2.0 * dot(view, halfVector) * halfVector - view;
    return dot(sampledDirection, normal) > 0.0;
  }
  let cosineTransmitted = sqrt(max(0.0, 1.0 - relativeIndex * relativeIndex * (1.0 - cosineIncident * cosineIncident)));
  let bend = relativeIndex * cosineIncident - cosineTransmitted;
  sampledDirection = bend * halfVector - relativeIndex * view;
  return dot(sampledDirection, normal) < 0.0;
}

// ---- One path ----

var<private> throughput: vec3<f32>;
var<private> radiance: vec3<f32>;
var<private> direction: vec3<f32>;
var<private> lightDirection: vec3<f32>;
var<private> lightRadiance: vec3<f32>;
var<private> selectionProbability: f32 = 1.0;
var<private> environmentSampledPdf: f32 = 0.0;
var<private> sunFrame: mat3x3<f32>;
var<private> featureAlbedo: vec3<f32>;
var<private> featureNormal: vec3<f32>;
var<private> featureDepth: f32;
var<private> firstLegEscaped: f32 = 0.0;
var<private> inMedium: bool = false;

fn addRadiance(depth: i32, amountIn: vec3<f32>) {
  var amount = amountIn;
  if (depth > 0) {
    let peak = max(amount.x, max(amount.y, amount.z));
    if (peak > params.cameraAndClamp.z) { amount *= params.cameraAndClamp.z / peak; }
  }
  radiance += amount;
}

fn environmentWeight(candidatePdf: f32) -> f32 {
  let lightPdf = environmentSampledPdf * selectionProbability;
  let total = lightPdf * lightPdf + candidatePdf * candidatePdf;
  return lightPdf * lightPdf / total / lightPdf;
}

fn directWeight(mode: i32, candidatePdf: f32) -> f32 {
  if (mode == 1) { return environmentWeight(candidatePdf); }
  return 1.0 / selectionProbability;
}

// Same shape as the GLSL: addDirect records one shadow ray and flushShadowRay traces it, so the shader holds one copy of the
// shadow-ray traversal.
var<private> shadowOrigin: vec3<f32>;
var<private> shadowDirection: vec3<f32>;
var<private> shadowLimit: f32;
var<private> shadowAmount: vec3<f32>;
var<private> shadowDepth: i32;
var<private> shadowPending: bool = false;

fn addDirect(depth: i32, normal: vec3<f32>, distance: f32, weightMode: i32) {
  ${e ? "if (inMedium) {\n    let phase = henyeyGreensteinPhase(params.volumeMaximumAnisotropy.w, dot(lightDirection, direction));\n    let scale = phase * fogTransmittance(hitPoint, distance) * directWeight(weightMode, phase);\n    shadowOrigin = hitPoint;\n    shadowAmount = throughput * lightRadiance * scale;\n    shadowDepth = depth + 1;\n  } else {" : "{"}
    let cosine = dot(normal, lightDirection);
    if (cosine <= 0.0) { return; }
    evaluateSurface(lightDirection);
    let value = surfaceValue;
    if (value.x + value.y + value.z <= 0.0) { return; }
    shadowOrigin = hitPoint + normal * params.environmentRotationAndRays.z;
    ${e ? "let transmittance = fogTransmittance(shadowOrigin, distance);" : "let transmittance = 1.0;"}
    let scale = cosine * directWeight(weightMode, surfacePdf) * transmittance;
    shadowAmount = throughput * value * lightRadiance * scale;
    shadowDepth = depth;
  }
  shadowDirection = lightDirection;
  shadowLimit = distance;
  shadowPending = true;
}

${e ? wT : ""}
fn flushShadowRay() {
  if (!shadowPending) { return; }
  shadowPending = false;
  if (!occluded(shadowOrigin, shadowDirection, shadowLimit)) { addRadiance(shadowDepth, shadowAmount); }
}

fn reaches(bit: i32) -> bool {
  return inMedium || ((hitMask >> u32(bit)) & 1u) == 1u;
}

// Aims lightDirection at the target and returns the distance; distanceSquared goes into aimedDistanceSquared.
var<private> aimedDistanceSquared: f32;

fn aimAt(aimPoint: vec3<f32>) -> f32 {
  let delta = aimPoint - hitPoint;
  aimedDistanceSquared = dot(delta, delta);
  let distance = sqrt(aimedDistanceSquared);
  lightDirection = delta / distance;
  return distance;
}

fn randomOnSphere(radius: f32) -> vec3<f32> {
  let height = 2.0 * nextRandom() - 1.0;
  let angle = TWO_PI * nextRandom();
  let ring = sqrt(1.0 - height * height);
  return vec3<f32>(radius * ring * cos(angle), radius * height, radius * ring * sin(angle));
}

fn pointLightFalloff(distanceSquared: f32, range: f32, radius: f32) -> f32 {
  var cutoff = 1.0;
  if (range > 0.0) {
    let ratio = distanceSquared / (range * range);
    let fade = max(1.0 - ratio * ratio, 0.0);
    cutoff = fade * fade;
  }
  return cutoff / max(distanceSquared, radius * radius);
}

// The light tree (path-tracer-light-tree.js) follows the light table in the same buffer, four vectors a node; the word
// params.cameraAndClamp.w holds the index of its first vector, 0 when the scene draws lights uniformly.
const LIGHT_TREE_TEXELS: i32 = 4;
const LIGHT_TREE_FIRST_HIT_LIGHTS: i32 = 16;
const LIGHT_TREE_MINIMUM_SHARE: f32 = ${fT.toFixed(4)};
var<private> treeChoiceProbability: f32 = 1.0;

fn lightTreeActive() -> bool {
  return params.cameraAndClamp.w > 0.0;
}

// Past this many lights the tree also draws one light at the first hit; below it the first hit lights from every emitter.
fn firstHitByTree() -> bool {
  return lightTreeActive() && params.sizeBouncesLights.w > LIGHT_TREE_FIRST_HIT_LIGHTS;
}

// The maximum and the minimum importance measure of one tree node for the current hit point.
fn lightTreeImportance(node: i32, normal: vec3<f32>) -> vec2<f32> {
  let base = i32(params.cameraAndClamp.w) + node * LIGHT_TREE_TEXELS;
  let minimumEnergy = lights[base];
  let maximumCosineO = lights[base + 1];
  let axisCosineE = lights[base + 2];
  let energy = minimumEnergy.w;
  let delta = 0.5 * (minimumEnergy.xyz + maximumCosineO.xyz) - hitPoint;
  let halfDiagonal = 0.5 * length(maximumCosineO.xyz - minimumEnergy.xyz);
  let centerDistance = length(delta);
  let nearest = max(max(centerDistance, halfDiagonal), 1e-4);
  let farthest = centerDistance + halfDiagonal;
  let minimumMeasure = energy / max(farthest * farthest, 1e-8);
  if (centerDistance <= halfDiagonal) { return vec2<f32>(energy / (nearest * nearest), minimumMeasure); }
  let toward = delta / centerDistance;
  let ratio = halfDiagonal / centerDistance;
  let thetaU = acos(sqrt(max(0.0, 1.0 - ratio * ratio)));
  let theta = acos(clamp(-dot(axisCosineE.xyz, toward), -1.0, 1.0));
  let thetaO = acos(clamp(maximumCosineO.w, -1.0, 1.0));
  let thetaE = acos(clamp(axisCosineE.w, -1.0, 1.0));
  let thetaPrime = max(theta - thetaO - thetaU, 0.0);
  if (thetaPrime >= thetaE) { return vec2<f32>(0.0, minimumMeasure); }
  let surfaceTheta = acos(clamp(dot(normal, toward), -1.0, 1.0));
  let surfaceCosine = max(cos(max(surfaceTheta - thetaU, 0.0)), 0.0);
  return vec2<f32>(energy * cos(thetaPrime) * surfaceCosine / (nearest * nearest), minimumMeasure);
}

// Draws the emitter of a later hit and sets selectionProbability to the chance of the draw. Without a tree it is the uniform
// choice; with one the sun and the sky keep their uniform share and a local light is reached by walking the tree from the
// root. Returns -1 when no light is worth sampling.
fn chooseEmitter(normal: vec3<f32>) -> i32 {
  let emitterCount = params.emittersFlagsSample.x;
  let uniformShare = 1.0 / f32(emitterCount);
  let emitter = min(i32(floor(nextRandom() * f32(emitterCount))), emitterCount - 1);
  selectionProbability = uniformShare;
  if (!lightTreeActive()) { return emitter; }
  let firstLightEmitter = select(0, 1, params.emittersFlagsSample.y != 0);
  let lightIndex = emitter - firstLightEmitter;
  let lightCount = params.sizeBouncesLights.w;
  if (lightIndex < 0 || lightIndex >= lightCount) { return emitter; }
  // The tree weighs a node by every light under it, linked or not, so a receiver with light linking draws uniformly among the lights it can see.
  var linkedCount = 0;
  for (var index = 0; index < lightCount; index++) {
    if (reaches(i32(lights[index * LIGHT_TEXELS + 1].w))) { linkedCount++; }
  }
  if (linkedCount < lightCount) {
    if (linkedCount == 0) { return -1; }
    var skip = min(i32(floor(nextRandom() * f32(linkedCount))), linkedCount - 1);
    selectionProbability = f32(lightCount) * uniformShare / f32(linkedCount);
    for (var index = 0; index < lightCount; index++) {
      if (!reaches(i32(lights[index * LIGHT_TEXELS + 1].w))) { continue; }
      if (skip == 0) { return firstLightEmitter + index; }
      skip--;
    }
    return -1;
  }
  var node = 0;
  var pathProbability = 1.0;
  for (var step = 0; step < 64; step++) {
    let links = lights[i32(params.cameraAndClamp.w) + node * LIGHT_TREE_TEXELS + 3];
    if (links.x < 0.0) {
      selectionProbability = f32(lightCount) * uniformShare * pathProbability;
      return firstLightEmitter + i32(links.z);
    }
    let left = lightTreeImportance(i32(links.x), normal);
    let right = lightTreeImportance(i32(links.y), normal);
    let totalMaximum = left.x + right.x;
    let totalMinimum = left.y + right.y;
    if (!(totalMinimum > 0.0)) { return -1; }
    var leftProbability = left.y / totalMinimum;
    if (totalMaximum > 0.0) { leftProbability = (1.0 - LIGHT_TREE_MINIMUM_SHARE) * (left.x / totalMaximum) + LIGHT_TREE_MINIMUM_SHARE * leftProbability; }
    if (nextRandom() < leftProbability) {
      node = i32(links.x);
      pathProbability *= leftProbability;
    } else {
      node = i32(links.y);
      pathProbability *= 1.0 - leftProbability;
    }
  }
  return -1;
}

// True when the hit lights from every emitter: the first hit, unless the tree draws one there too, and any hit with one emitter.
fn lightsFromEveryEmitter(depth: i32, emitterCount: i32) -> bool {
  return (depth == 0 && !firstHitByTree()) || emitterCount <= 1;
}

// Draws one emitter's contribution into the pending shadow ray: emitter 0 is the sun when there is one, then the lights, then the sky.
fn sampleEmitter(depth: i32, normal: vec3<f32>, emitter: i32) {
  var distance = 0.0;
  var weightMode = 0;
  let hasSun = params.emittersFlagsSample.y != 0;
  let lightCount = params.sizeBouncesLights.w;
  if (hasSun && emitter == 0) {
    if (!reaches(0)) { return; }
    let cosineTheta = 1.0 - nextRandom() * (1.0 - params.sunColorAndCosine.w);
    let sineTheta = sqrt(max(0.0, 1.0 - cosineTheta * cosineTheta));
    let phi = TWO_PI * nextRandom();
    lightDirection = sunFrame[0] * (sineTheta * cos(phi)) + sunFrame[1] * (sineTheta * sin(phi)) + sunFrame[2] * cosineTheta;
    lightRadiance = params.sunColorAndCosine.rgb;
    distance = params.environmentRotationAndRays.w;
  } else {
    let index = emitter - select(0, 1, hasSun);
    if (index < lightCount) {
      let base = index * LIGHT_TEXELS;
      let positionType = lights[base];
      let colorBit = lights[base + 1];
      let directionRadius = lights[base + 2];
      let acrossCone = lights[base + 3];
      let alongBlend = lights[base + 4];
      let intensityRange = lights[base + 5];
      let lightType = i32(positionType.w);
      if (!reaches(i32(colorBit.w))) { return; }
      if (lightType == 2) {
        let across = (nextRandom() - 0.5) * directionRadius.w;
        let along = (nextRandom() - 0.5) * acrossCone.w;
        let point = positionType.xyz + acrossCone.xyz * across + alongBlend.xyz * along;
        distance = aimAt(point);
        let emitCosine = -dot(directionRadius.xyz, lightDirection);
        if (distance < 1e-6 || emitCosine <= 0.0) { return; }
        lightRadiance = colorBit.rgb * (intensityRange.x * emitCosine / aimedDistanceSquared);
      } else {
        let jitter = randomOnSphere(directionRadius.w);
        distance = aimAt(positionType.xyz + jitter);
        if (distance < 1e-6) { return; }
        var mask = 1.0;
        if (lightType == 1) {
          let inside = -dot(directionRadius.xyz, lightDirection) - acrossCone.w;
          if (inside <= 0.0) { return; }
          if (alongBlend.w > 0.0 && inside < alongBlend.w) {
            let unit = inside / alongBlend.w;
            mask = unit * unit * (3.0 - 2.0 * unit);
          }
        }
        lightRadiance = colorBit.rgb * (intensityRange.x * pointLightFalloff(aimedDistanceSquared, intensityRange.y, directionRadius.w) * mask);
      }
      distance -= params.environmentRotationAndRays.z;
    } else {
      let rowUnit = nextRandom();
      let columnUnit = nextRandom();
      let columnJitter = nextRandom();
      let rowJitter = nextRandom();
      environmentSampledPdf = sampleEnvironment(rowUnit, columnUnit, columnJitter, rowJitter);
      lightDirection = sampledDirection;
      if (!(environmentSampledPdf > 0.0)) { return; }
      lightRadiance = environmentRadiance(lightDirection);
      distance = params.environmentRotationAndRays.w;
      weightMode = 1;
    }
  }
  addDirect(depth, normal, distance, weightMode);
}

fn addEscape(depth: i32, previousPdf: f32, afterMirror: bool) {
  if (params.emittersFlagsSample.z == 0) { return; }
  let sky = environmentRadiance(direction);
  var weight = 1.0;
  if (!afterMirror) {
    let environmentSide = environmentPdf(direction) * selectionProbability;
    weight = previousPdf * previousPdf / (previousPdf * previousPdf + environmentSide * environmentSide);
  }
  addRadiance(depth, throughput * sky * weight);
}

fn survivesRoulette(depth: i32) -> bool {
  if (depth < RUSSIAN_ROULETTE_START) { return true; }
  let survival = min(0.95, max(0.05, max(throughput.x, max(throughput.y, throughput.z))));
  if (nextRandom() >= survival) { return false; }
  throughput /= survival;
  return true;
}
`, OT = DT(), kT = "\n@compute @workgroup_size(8, 8, 1)\nfn main(@builtin(global_invocation_id) id: vec3<u32>) {\n  let width = params.sizeBouncesLights.x;\n  let height = params.sizeBouncesLights.y;\n  if (i32(id.x) >= width || i32(id.y) >= height) { return; }\n  let pixel = id.y * u32(width) + id.x;\n  let sampleIndex = u32(params.emittersFlagsSample.w);\n  let seed = params.seedAndAtlas.x;\n  if (params.emittersFlagsSample.y != 0) { sunFrame = buildFrame(params.sunDirection.xyz); }\n  let jitterX = hashJitter(pixel, sampleIndex, seed, 1u);\n  let jitterY = hashJitter(pixel, sampleIndex, seed, 2u);\n  let screenX = ((f32(id.x) + jitterX) / f32(width) * 2.0 - 1.0) * params.cameraAndClamp.x;\n  let screenY = (1.0 - (f32(id.y) + jitterY) / f32(height) * 2.0) * params.cameraAndClamp.y;\n  let rayDirection = normalize(params.forward.xyz + params.right.xyz * screenX + params.above.xyz * screenY);\n  tracePath(params.eye.xyz, rayDirection, pixel, sampleIndex);\n  if (!(all(radiance >= vec3<f32>(0.0)) && all(radiance < vec3<f32>(1e30)))) { radiance = vec3<f32>(0.0); }\n  if (!(featureDepth >= 0.0 && featureDepth < 1e30)) { featureDepth = 0.0; }\n  if (!(all(featureNormal >= vec3<f32>(-1.5)) && all(featureNormal < vec3<f32>(1.5)))) { featureNormal = vec3<f32>(0.0, 0.0, 1.0); }\n  if (!(all(featureAlbedo >= vec3<f32>(0.0)) && all(featureAlbedo < vec3<f32>(1e30)))) { featureAlbedo = vec3<f32>(1.0); }\n  let sampleLuminance = luminance(radiance);\n  let pixelCount = u32(width * height);\n  accumulation[pixel] += vec4<f32>(radiance, featureDepth);\n  accumulation[pixelCount + pixel] += vec4<f32>(featureAlbedo, 0.0);\n  accumulation[2u * pixelCount + pixel] += vec4<f32>(featureNormal, 0.0);\n  accumulation[3u * pixelCount + pixel] += vec4<f32>(sampleLuminance, sampleLuminance * sampleLuminance, firstLegEscaped, 0.0);\n}\n", AT = "\n@group(0) @binding(9) var<storage, read_write> texelPoints: array<vec4<f32>>;\n@group(0) @binding(10) var<storage, read_write> texelNormals: array<vec4<f32>>;\n\n@compute @workgroup_size(64)\nfn bakeTexels(@builtin(global_invocation_id) id: vec3<u32>, @builtin(num_workgroups) groups: vec3<u32>) {\n  let texelCount = u32(params.sizeBouncesLights.x);\n  let texelIndex = id.y * groups.x * 64u + id.x;\n  if (texelIndex >= texelCount) { return; }\n  let sampleIndex = u32(params.emittersFlagsSample.w);\n  let seed = params.seedAndAtlas.x;\n  if (params.emittersFlagsSample.y != 0) { sunFrame = buildFrame(params.sunDirection.xyz); }\n  let normal = texelNormals[texelIndex].xyz;\n  let origin = texelPoints[texelIndex].xyz + normal * params.environmentRotationAndRays.z;\n  let firstUnit = (f32(sampleIndex) + hashJitter(texelIndex, sampleIndex, seed, 1u)) / f32(params.shadowSlots.z);\n  let secondUnit = hashJitter(texelIndex, sampleIndex, seed, 2u);\n  let coneRadius = sqrt(firstUnit);\n  let angle = TWO_PI * secondUnit;\n  let rayDirection = buildFrame(normal) * vec3<f32>(coneRadius * cos(angle), coneRadius * sin(angle), sqrt(max(0.0, 1.0 - firstUnit)));\n  tracePath(origin, rayDirection, texelIndex, sampleIndex);\n  if (!(all(radiance >= vec3<f32>(0.0)) && all(radiance < vec3<f32>(1e30)))) { radiance = vec3<f32>(0.0); }\n  accumulation[texelIndex] += vec4<f32>(radiance, 0.0);\n  accumulation[texelCount + texelIndex] += vec4<f32>(firstLegEscaped, 0.0, 0.0, 0.0);\n}\n", jT = ({ hasVolume: e = !1, hasSubsurface: t = !1, texelBake: n = !1, realtime: r = null } = {}) => DT({ hasVolume: e }) + `
${r ? r.declarations + r.addLights : "// The first hit lights from every emitter; later hits draw one, and divide by the chance of drawing it.\nfn addLights(depth: i32, normal: vec3<f32>) {\n  let emitterCount = params.emittersFlagsSample.x;\n  if (lightsFromEveryEmitter(depth, emitterCount)) {\n    selectionProbability = 1.0;\n    for (var emitter = 0; emitter < emitterCount; emitter++) {\n      sampleEmitter(depth, normal, emitter);\n      flushShadowRay();\n    }\n    return;\n  }\n  let chosen = chooseEmitter(normal);\n  if (chosen >= 0) {\n    sampleEmitter(depth, normal, chosen);\n    flushShadowRay();\n  }\n  // The sky is drawn with its uniform share whatever light was chosen: that share weighs the next escape ray.\n  selectionProbability = 1.0 / f32(emitterCount);\n}"}
${t ? TT : ""}
fn tracePath(origin: vec3<f32>, startDirection: vec3<f32>, pixel: u32, sampleIndex: u32) {
  resetRandom(pixel, sampleIndex, params.seedAndAtlas.x);
  radiance = vec3<f32>(0.0);
  throughput = vec3<f32>(1.0);
  featureAlbedo = vec3<f32>(1.0);
  featureNormal = vec3<f32>(0.0, 0.0, 1.0);
  featureDepth = 0.0;
  var featuresRecorded = false;
  direction = startDirection;
  var position = origin;
  var previousPdf = 0.0;
  var afterMirror = true;
  var normal = vec3<f32>(0.0, 1.0, 0.0);
  let bounces = params.sizeBouncesLights.z;
  let surfaceOffset = params.environmentRotationAndRays.z;
  for (var depth = 0; depth <= bounces; depth++) {
    let found = intersectScene(position, direction);
    ${e ? "let inFog = scatterInFog(position, select(params.environmentRotationAndRays.w, hitDistance, found));" : "let inFog = false;"}
    if (!inFog && !found) {
      if (depth == 0) { firstLegEscaped = 1.0; }
      addEscape(depth, previousPdf, afterMirror);
      break;
    }
    var isGlass = false;
    var entering = true;
    var needsLights = true;
    if (inFog) {
      throughput *= params.volumeAlbedoDistance.xyz;
      inMedium = true;
    } else {
      entering = dot(hitNormal, direction) < 0.0;
      normal = select(-hitNormal, hitNormal, entering);
      isGlass = hitTransmission > 0.0 && nextRandom() < hitTransmission;
      ${r ? r.firstHit : ""}
      if (!featuresRecorded) {
        featureAlbedo = select(hitColor, vec3<f32>(1.0), isGlass);
        featureNormal = normal;
        featureDepth = hitDistance;
        featuresRecorded = true;
      }
      addRadiance(depth, throughput * hitEmission);
      needsLights = !isGlass;
      if (needsLights) {
        prepareSurface(normal, -direction);
        ${t ? "subsurfaceWeight = splitSubsurface();" : ""}
      }
    }
    if (needsLights) { addLights(depth, normal); }
    inMedium = false;
    ${r ? r.terminal : ""}
    ${e ? "if (inFog) {\n      let phaseCosine = sampleHenyeyGreensteinCosine(params.volumeMaximumAnisotropy.w, nextRandom());\n      let phaseSine = sqrt(max(0.0, 1.0 - phaseCosine * phaseCosine));\n      let azimuth = TWO_PI * nextRandom();\n      let frame = buildFrame(direction);\n      direction = frame[0] * phaseSine * cos(azimuth) + frame[1] * phaseSine * sin(azimuth) + frame[2] * phaseCosine;\n      previousPdf = henyeyGreensteinPhase(params.volumeMaximumAnisotropy.w, phaseCosine);\n      afterMirror = false;\n      position = hitPoint;\n      if (!survivesRoulette(depth)) { break; }\n      continue;\n    }" : ""}
    if (isGlass) {
      let alpha = roughnessToAlpha(hitRoughness);
      let selectionUnit = nextRandom();
      let firstUnit = nextRandom();
      let secondUnit = nextRandom();
      if (!sampleGlass(normal, -direction, entering, hitIor, alpha, selectionUnit, firstUnit, secondUnit)) { break; }
      direction = sampledDirection;
      if (dot(direction, normal) < 0.0) { throughput *= hitColor; }
      afterMirror = true;
    } else {
      var lobeUnit = nextRandom();
      ${t ? "if (subsurfaceWeight > 0.0) {\n        if (lobeUnit < surfaceSubsurfaceChance) {\n          if (!enterSubsurface(depth, normal)) { break; }\n          normal = subsurfaceNormal;\n          lobeUnit = 0.0;\n        } else {\n          lobeUnit -= surfaceSubsurfaceChance;\n        }\n      }" : ""}
      let firstUnit = nextRandom();
      let secondUnit = nextRandom();
      let isMirror = sampleSurface(lobeUnit, firstUnit, secondUnit);
      direction = sampledDirection;
      let cosine = dot(direction, normal);
      if (cosine <= 0.0) { break; }
      if (isMirror) {
        throughput *= mirrorWeight();
        afterMirror = true;
      } else {
        evaluateSurface(direction);
        if (!(surfacePdf > 0.0)) { break; }
        throughput *= surfaceValue * cosine / surfacePdf;
        previousPdf = surfacePdf;
        afterMirror = false;
      }
      ${r ? r.record : ""}
    }
    position = hitPoint + direction * surfaceOffset;
    if (!survivesRoulette(depth)) { break; }
  }
}

${n ? AT : r ? r.main : kT}
`, jT(), MT = OT + "\n// Path state: PATH_STATE_VECTORS vec4<u32> per path (floats are stored as their bits, so nothing is ever rounded or\n// canonicalised on the way through memory), then the shadow records, three vec4 per emitter slot of a path.\n//   0 origin, previous pdf   1 direction, selection probability   2 throughput   3 radiance, first leg escaped\n//   4 albedo   5 normal, depth   6 start of the last ray segment, distance in it   7 u, v, distance before the segment\n//   8 random state, flags, hit triangle slot, material\n// Shadow record: 0 origin, limit   1 direction, unused   2 amount, 1 when the ray is pending.\n@group(0) @binding(9) var<storage, read_write> pathState: array<vec4<u32>>;\n// Word 0 counts the hits of this bounce; then per material the count and the write cursor; then the hits sorted by material.\n@group(0) @binding(10) var<storage, read_write> binQueue: array<atomic<u32>>;\n\nconst PATH_STATE_VECTORS: u32 = 9u;\nconst FLAG_ALIVE: u32 = 1u;\nconst FLAG_AFTER_MIRROR: u32 = 2u;\nconst FLAG_HIT: u32 = 4u;\nconst FLAG_SHADED: u32 = 8u;\n\nfn loadVector(index: u32) -> vec4<f32> {\n  return bitcast<vec4<f32>>(pathState[index]);\n}\n\nfn storeVector(index: u32, value: vec4<f32>) {\n  pathState[index] = bitcast<vec4<u32>>(value);\n}\n\nfn tilePathCount() -> u32 {\n  return params.tileAndDepth.y;\n}\n\nfn currentDepth() -> i32 {\n  return i32(params.tileAndDepth.z);\n}\n\nfn materialCount() -> u32 {\n  return params.tileAndDepth.w;\n}\n\n// How many shadow rays a path casts at this depth: every emitter at the first hit, one afterwards.\nfn emitterSlotCount(depth: i32) -> u32 {\n  let emitterCount = u32(max(params.emittersFlagsSample.x, 0));\n  if (lightsFromEveryEmitter(depth, i32(emitterCount))) { return emitterCount; }\n  return 1u;\n}\n\nfn shadowRecordBase(path: u32, slot: u32) -> u32 {\n  return tilePathCount() * PATH_STATE_VECTORS + (path * params.shadowSlots.x + slot) * 3u;\n}\n\nfn storeShadowRecord(path: u32, slot: u32) {\n  let base = shadowRecordBase(path, slot);\n  if (shadowPending) {\n    storeVector(base, vec4<f32>(shadowOrigin, shadowLimit));\n    storeVector(base + 1u, vec4<f32>(shadowDirection, 0.0));\n    storeVector(base + 2u, vec4<f32>(shadowAmount, 1.0));\n  } else {\n    storeVector(base + 2u, vec4<f32>(0.0));\n  }\n}\n\n// Paths are numbered in blocks of 8 by 8 pixels, so the 64 paths of a workgroup look at neighbouring pixels (rays that start\n// close together traverse the same part of the BVH). Numbers past the edge of the image have no pixel.\nfn blockedPixel(globalPath: u32) -> vec2<u32> {\n  let blocksPerRow = (u32(params.sizeBouncesLights.x) + 7u) / 8u;\n  let block = globalPath / 64u;\n  let within = globalPath % 64u;\n  return vec2<u32>((block % blocksPerRow) * 8u + within % 8u, (block / blocksPerRow) * 8u + within / 8u);\n}\n\nfn queuedPath(position: u32) -> u32 {\n  return atomicLoad(&binQueue[1u + 2u * materialCount() + position]);\n}\n\n@compute @workgroup_size(64)\nfn generatePaths(@builtin(global_invocation_id) id: vec3<u32>) {\n  if (id.x >= tilePathCount()) { return; }\n  let width = u32(params.sizeBouncesLights.x);\n  let height = u32(params.sizeBouncesLights.y);\n  let coordinates = blockedPixel(params.tileAndDepth.x + id.x);\n  let pixelX = coordinates.x;\n  let pixelY = coordinates.y;\n  if (pixelX >= width || pixelY >= height) {\n    pathState[id.x * PATH_STATE_VECTORS + 8u] = vec4<u32>(0u);\n    return;\n  }\n  let pixel = pixelY * width + pixelX;\n  let sampleIndex = u32(params.emittersFlagsSample.w);\n  let seed = params.seedAndAtlas.x;\n  let jitterX = hashJitter(pixel, sampleIndex, seed, 1u);\n  let jitterY = hashJitter(pixel, sampleIndex, seed, 2u);\n  let screenX = ((f32(pixelX) + jitterX) / f32(width) * 2.0 - 1.0) * params.cameraAndClamp.x;\n  let screenY = (1.0 - (f32(pixelY) + jitterY) / f32(height) * 2.0) * params.cameraAndClamp.y;\n  let rayDirection = normalize(params.forward.xyz + params.right.xyz * screenX + params.above.xyz * screenY);\n  resetRandom(pixel, sampleIndex, seed);\n  let base = id.x * PATH_STATE_VECTORS;\n  storeVector(base, vec4<f32>(params.eye.xyz, 0.0));\n  storeVector(base + 1u, vec4<f32>(rayDirection, 1.0));\n  storeVector(base + 2u, vec4<f32>(1.0, 1.0, 1.0, 0.0));\n  storeVector(base + 3u, vec4<f32>(0.0));\n  storeVector(base + 4u, vec4<f32>(1.0, 1.0, 1.0, 0.0));\n  storeVector(base + 5u, vec4<f32>(0.0, 0.0, 1.0, 0.0));\n  pathState[base + 8u] = vec4<u32>(rngState, FLAG_ALIVE | FLAG_AFTER_MIRROR, 0u, 0u);\n}\n\n@compute @workgroup_size(64)\nfn resetBins(@builtin(global_invocation_id) id: vec3<u32>) {\n  if (id.x == 0u) { atomicStore(&binQueue[0], 0u); }\n  if (id.x < materialCount()) { atomicStore(&binQueue[1u + id.x], 0u); }\n}\n\n// Finds the nearest solid hit of every live path (stepping through the transparent texels of cutout materials), adds the\n// sky to paths that left the scene, and counts the hits per material.\n@compute @workgroup_size(64)\nfn extendPaths(@builtin(global_invocation_id) id: vec3<u32>) {\n  if (id.x >= tilePathCount()) { return; }\n  let base = id.x * PATH_STATE_VECTORS;\n  var pathMeta = pathState[base + 8u];\n  let flags = pathMeta.y;\n  if ((flags & FLAG_ALIVE) == 0u) { return; }\n  let originPrevious = loadVector(base);\n  let directionSelection = loadVector(base + 1u);\n  let rayDirection = directionSelection.xyz;\n  let farDistance = params.environmentRotationAndRays.w;\n  let surfaceOffset = params.environmentRotationAndRays.z;\n  var start = originPrevious.xyz;\n  var travelled = 0.0;\n  var found = false;\n  for (var attempt = 0; attempt < ALPHA_STEP_LIMIT; attempt++) {\n    traceRay(start, rayDirection, farDistance, false);\n    if (nearestSlot < 0) { break; }\n    let material = i32(triangles[nearestSlot * TRIANGLE_TEXELS].w) * MATERIAL_TEXELS;\n    let cutoff = materials[material + 3].z;\n    if (cutoff == 0.0 || alphaAtNearestHit() >= cutoff) {\n      found = true;\n      break;\n    }\n    let advance = nearestDistance + surfaceOffset;\n    travelled += advance;\n    start += rayDirection * advance;\n  }\n  if (found) {\n    let materialIndex = u32(triangles[nearestSlot * TRIANGLE_TEXELS].w);\n    storeVector(base + 6u, vec4<f32>(start, nearestDistance));\n    storeVector(base + 7u, vec4<f32>(nearestU, nearestV, travelled, 0.0));\n    pathMeta = vec4<u32>(pathMeta.x, flags | FLAG_HIT, u32(nearestSlot), materialIndex);\n    pathState[base + 8u] = pathMeta;\n    if (params.shadowSlots.y == 1u) { atomicAdd(&binQueue[1u + materialIndex], 1u); }\n    return;\n  }\n  var radianceData = loadVector(base + 3u);\n  if (currentDepth() == 0) { radianceData.w = 1.0; }\n  direction = rayDirection;\n  throughput = loadVector(base + 2u).xyz;\n  radiance = radianceData.xyz;\n  selectionProbability = directionSelection.w;\n  addEscape(currentDepth(), originPrevious.w, (flags & FLAG_AFTER_MIRROR) != 0u);\n  storeVector(base + 3u, vec4<f32>(radiance, radianceData.w));\n  pathMeta.y = flags & ~(FLAG_ALIVE | FLAG_HIT);\n  pathState[base + 8u] = pathMeta;\n}\n\n@compute @workgroup_size(1)\nfn scanBins() {\n  let count = materialCount();\n  var running = 0u;\n  for (var material = 0u; material < count; material++) {\n    atomicStore(&binQueue[1u + count + material], running);\n    running += atomicLoad(&binQueue[1u + material]);\n  }\n  atomicStore(&binQueue[0], running);\n}\n\n@compute @workgroup_size(64)\nfn scatterPaths(@builtin(global_invocation_id) id: vec3<u32>) {\n  if (id.x >= tilePathCount()) { return; }\n  let pathMeta = pathState[id.x * PATH_STATE_VECTORS + 8u];\n  if ((pathMeta.y & FLAG_HIT) == 0u) { return; }\n  let count = materialCount();\n  let position = atomicAdd(&binQueue[1u + count + pathMeta.w], 1u);\n  atomicStore(&binQueue[1u + 2u * count + position], id.x);\n}\n\n// Shades the hits in material order: emission, features, one shadow record per emitter, then the next direction. Draws\n// random numbers in the order of the megakernel, so the picture is the same.\n@compute @workgroup_size(64)\nfn shadePaths(@builtin(global_invocation_id) id: vec3<u32>) {\n  var path = id.x;\n  if (params.shadowSlots.y == 1u) {\n    if (id.x >= atomicLoad(&binQueue[0])) { return; }\n    path = queuedPath(id.x);\n  } else {\n    if (id.x >= tilePathCount()) { return; }\n    if ((pathState[id.x * PATH_STATE_VECTORS + 8u].y & FLAG_HIT) == 0u) { return; }\n  }\n  let base = path * PATH_STATE_VECTORS;\n  let depth = currentDepth();\n  let originPrevious = loadVector(base);\n  let directionSelection = loadVector(base + 1u);\n  let radianceData = loadVector(base + 3u);\n  let hitStart = loadVector(base + 6u);\n  let hitInfo = loadVector(base + 7u);\n  var pathMeta = pathState[base + 8u];\n  rngState = pathMeta.x;\n  direction = directionSelection.xyz;\n  selectionProbability = directionSelection.w;\n  throughput = loadVector(base + 2u).xyz;\n  radiance = radianceData.xyz;\n  nearestSlot = i32(pathMeta.z);\n  nearestU = hitInfo.x;\n  nearestV = hitInfo.y;\n  _ = fillHit(hitStart.xyz, direction, hitStart.w);\n  hitDistance += hitInfo.z;\n  let entering = dot(hitNormal, direction) < 0.0;\n  let normal = select(-hitNormal, hitNormal, entering);\n  let isGlass = hitTransmission > 0.0 && nextRandom() < hitTransmission;\n  if (depth == 0) {\n    storeVector(base + 4u, vec4<f32>(select(hitColor, vec3<f32>(1.0), isGlass), 0.0));\n    storeVector(base + 5u, vec4<f32>(normal, hitDistance));\n  }\n  addRadiance(depth, throughput * hitEmission);\n  if (params.emittersFlagsSample.y != 0) { sunFrame = buildFrame(params.sunDirection.xyz); }\n  if (isGlass) {\n    let slotCount = emitterSlotCount(depth);\n    for (var slot = 0u; slot < slotCount; slot++) {\n      shadowPending = false;\n      storeShadowRecord(path, slot);\n    }\n  } else {\n    prepareSurface(normal, -direction);\n    let emitterCount = params.emittersFlagsSample.x;\n    if (lightsFromEveryEmitter(depth, emitterCount)) {\n      selectionProbability = 1.0;\n      for (var emitter = 0; emitter < emitterCount; emitter++) {\n        shadowPending = false;\n        sampleEmitter(depth, normal, emitter);\n        storeShadowRecord(path, u32(emitter));\n      }\n    } else {\n      let chosen = chooseEmitter(normal);\n      shadowPending = false;\n      if (chosen >= 0) { sampleEmitter(depth, normal, chosen); }\n      storeShadowRecord(path, 0u);\n      selectionProbability = 1.0 / f32(emitterCount);\n    }\n  }\n  var alive = depth < params.sizeBouncesLights.z;\n  var afterMirror = (pathMeta.y & FLAG_AFTER_MIRROR) != 0u;\n  var previousPdf = originPrevious.w;\n  if (alive && isGlass) {\n    let alpha = roughnessToAlpha(hitRoughness);\n    let selectionUnit = nextRandom();\n    let firstUnit = nextRandom();\n    let secondUnit = nextRandom();\n    if (sampleGlass(normal, -direction, entering, hitIor, alpha, selectionUnit, firstUnit, secondUnit)) {\n      direction = sampledDirection;\n      if (dot(direction, normal) < 0.0) { throughput *= hitColor; }\n      afterMirror = true;\n    } else {\n      alive = false;\n    }\n  } else if (alive) {\n    let lobeUnit = nextRandom();\n    let firstUnit = nextRandom();\n    let secondUnit = nextRandom();\n    let isMirror = sampleSurface(lobeUnit, firstUnit, secondUnit);\n    direction = sampledDirection;\n    let cosine = dot(direction, normal);\n    if (cosine <= 0.0) {\n      alive = false;\n    } else if (isMirror) {\n      throughput *= mirrorWeight();\n      afterMirror = true;\n    } else {\n      evaluateSurface(direction);\n      if (surfacePdf > 0.0) {\n        throughput *= surfaceValue * cosine / surfacePdf;\n        previousPdf = surfacePdf;\n        afterMirror = false;\n      } else {\n        alive = false;\n      }\n    }\n  }\n  var nextOrigin = originPrevious.xyz;\n  if (alive) {\n    nextOrigin = hitPoint + direction * params.environmentRotationAndRays.z;\n    alive = survivesRoulette(depth);\n  }\n  storeVector(base, vec4<f32>(nextOrigin, previousPdf));\n  storeVector(base + 1u, vec4<f32>(direction, selectionProbability));\n  storeVector(base + 2u, vec4<f32>(throughput, 0.0));\n  storeVector(base + 3u, vec4<f32>(radiance, radianceData.w));\n  pathMeta.x = rngState;\n  pathMeta.y = select(0u, FLAG_ALIVE, alive) | select(0u, FLAG_AFTER_MIRROR, afterMirror) | FLAG_SHADED;\n  pathState[base + 8u] = pathMeta;\n}\n\n// Traces the shadow rays the shade kernel recorded and adds the light that gets through. It walks the paths in pixel order\n// (not material order) so that neighbouring invocations cast rays from neighbouring points.\n@compute @workgroup_size(64)\nfn shadowPaths(@builtin(global_invocation_id) id: vec3<u32>) {\n  if (id.x >= tilePathCount()) { return; }\n  let path = id.x;\n  let base = path * PATH_STATE_VECTORS;\n  var pathMeta = pathState[base + 8u];\n  if ((pathMeta.y & FLAG_SHADED) == 0u) { return; }\n  pathMeta.y = pathMeta.y & ~FLAG_SHADED;\n  pathState[base + 8u] = pathMeta;\n  let depth = currentDepth();\n  let radianceData = loadVector(base + 3u);\n  radiance = radianceData.xyz;\n  let slotCount = emitterSlotCount(depth);\n  for (var slot = 0u; slot < slotCount; slot++) {\n    let recordBase = shadowRecordBase(path, slot);\n    let amount = loadVector(recordBase + 2u);\n    if (amount.w == 0.0) { continue; }\n    let origin = loadVector(recordBase);\n    let rayDirection = loadVector(recordBase + 1u).xyz;\n    if (!occluded(origin.xyz, rayDirection, origin.w)) { addRadiance(depth, amount.xyz); }\n  }\n  storeVector(base + 3u, vec4<f32>(radiance, radianceData.w));\n}\n\n// Adds the finished sample of every path of the tile to the accumulation planes, dropping non-finite values as the megakernel does.\n@compute @workgroup_size(64)\nfn resolvePaths(@builtin(global_invocation_id) id: vec3<u32>) {\n  if (id.x >= tilePathCount()) { return; }\n  let coordinates = blockedPixel(params.tileAndDepth.x + id.x);\n  if (coordinates.x >= u32(params.sizeBouncesLights.x) || coordinates.y >= u32(params.sizeBouncesLights.y)) { return; }\n  let base = id.x * PATH_STATE_VECTORS;\n  let radianceData = loadVector(base + 3u);\n  let normalDepth = loadVector(base + 5u);\n  var sampleRadiance = radianceData.xyz;\n  var sampleAlbedo = loadVector(base + 4u).xyz;\n  var sampleNormal = normalDepth.xyz;\n  var sampleDepth = normalDepth.w;\n  if (!(all(sampleRadiance >= vec3<f32>(0.0)) && all(sampleRadiance < vec3<f32>(1e30)))) { sampleRadiance = vec3<f32>(0.0); }\n  if (!(sampleDepth >= 0.0 && sampleDepth < 1e30)) { sampleDepth = 0.0; }\n  if (!(all(sampleNormal >= vec3<f32>(-1.5)) && all(sampleNormal < vec3<f32>(1.5)))) { sampleNormal = vec3<f32>(0.0, 0.0, 1.0); }\n  if (!(all(sampleAlbedo >= vec3<f32>(0.0)) && all(sampleAlbedo < vec3<f32>(1e30)))) { sampleAlbedo = vec3<f32>(1.0); }\n  let sampleLuminance = luminance(sampleRadiance);\n  let pixel = coordinates.y * u32(params.sizeBouncesLights.x) + coordinates.x;\n  let pixelCount = u32(params.sizeBouncesLights.x * params.sizeBouncesLights.y);\n  accumulation[pixel] += vec4<f32>(sampleRadiance, sampleDepth);\n  accumulation[pixelCount + pixel] += vec4<f32>(sampleAlbedo, 0.0);\n  accumulation[2u * pixelCount + pixel] += vec4<f32>(sampleNormal, 0.0);\n  accumulation[3u * pixelCount + pixel] += vec4<f32>(sampleLuminance, sampleLuminance * sampleLuminance, radianceData.w, 0.0);\n}\n";
})), PT, FT, IT, LT, RT, zT, BT = A((() => {
	PT = 1024, FT = .3, IT = `
uniform sampler2D uRadianceCache;
uniform float uCacheCellSize;
uniform float uCacheLevelDistance;
layout(location = 4) out vec4 outCacheUpdate;
const int CACHE_SHIFT = ${Math.log2(PT)};
const int CACHE_MASK = 1023;
const float NORMAL_AXIS_THRESHOLD = ${FT};
float recordedSlot = 0.0;
vec3 recordedRadianceBefore = vec3(0.0);
vec3 recordedThroughput = vec3(1.0);

uint normalAxisCode(float component) {
  if (component > NORMAL_AXIS_THRESHOLD) return 2u;
  if (component < -NORMAL_AXIS_THRESHOLD) return 0u;
  return 1u;
}

uint cacheHash(vec3 point, vec3 normal) {
  float level = clamp(floor(log2(max(length(point - uEye) / uCacheLevelDistance, 1.0))), 0.0, 8.0);
  ivec3 cell = ivec3(floor(point / (uCacheCellSize * exp2(level))));
  uint normalCode = normalAxisCode(normal.x) + 3u * normalAxisCode(normal.y) + 9u * normalAxisCode(normal.z);
  uint hash = uint(cell.x) * 73856093u ^ uint(cell.y) * 19349663u ^ uint(cell.z) * 83492791u;
  hash ^= (normalCode + 1u) * 0x9e3779b1u;
  hash ^= uint(level) * 0x85ebca6bu;
  hash ^= hash >> 16;
  hash *= 0x7feb352du;
  hash ^= hash >> 15;
  hash *= 0x846ca68bu;
  hash ^= hash >> 16;
  return hash & uint(1048575);
}

// The mean radiance that arrives at the cell of a surface point; black while the cell has no record yet.
vec3 cacheLookup(vec3 point, vec3 normal) {
  int slot = int(cacheHash(point, normal));
  vec4 cell = texelFetch(uRadianceCache, ivec2(slot & CACHE_MASK, slot >> CACHE_SHIFT), 0);
  return cell.a >= 1.0 ? cell.rgb : vec3(0.0);
}
`, LT = "\n    if (depth == uBounces && !inFog && !isGlass) {\n      addRadiance(depth, throughput * hitColor * cacheLookup(hitPoint, normal));\n      break;\n    }", RT = "\n      if (depth == max(uBounces - 1, 0) && !isMirror) {\n        recordedSlot = float(cacheHash(hitPoint, normal)) + 1.0;\n        recordedRadianceBefore = radiance;\n        recordedThroughput = throughput;\n      }", zT = "\n  vec3 recordedTail = clamp((radiance - recordedRadianceBefore) / max(recordedThroughput, vec3(0.05)), vec3(0.0), vec3(uFireflyClamp));\n  outCacheUpdate = recordedSlot > 0.0 ? vec4(recordedTail, recordedSlot) : vec4(0.0);", `${Math.log2(PT)}${PT}`;
}));
// src/path-tracer-gpu-shader.js
function VT({ hasSubsurface: e = !1, texelBake: t = !1, blueNoise: n = !1, lightImportance: r = !1, radianceCache: i = !1, lightTree: a = !1 } = {}) {
	return JT(e, t, n, r, i, a);
}
var HT, UT, WT, GT, KT, qT, JT, YT = A((() => {
	BT(), vT(), CT(), HT = 2048, UT = "#version 300 es\nvoid main() {\n  vec2 corner = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));\n  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);\n}", WT = "void main() {\n  ivec2 pixelCoordinate = ivec2(gl_FragCoord.xy);\n  int row = pixelCoordinate.y;\n  uint pixel = uint(row * uSize.x + pixelCoordinate.x);\n  uint sampleIndex = uint(uSample);\n  if (uHasSun) sunFrame = buildFrame(uSunDirection);\n  float jitterX = hashJitter(pixel, sampleIndex, uSeed, 1u);\n  float jitterY = hashJitter(pixel, sampleIndex, uSeed, 2u);\n  if (BLUE_NOISE_FIRST && sampleIndex == 0u) {\n    blueSample = blueNoiseAt(pixelCoordinate);\n    jitterX = blueSample.x;\n    jitterY = blueSample.y;\n    blueDrawsUsed = 0;\n  }\n  float screenX = ((float(pixelCoordinate.x) + jitterX) / float(uSize.x) * 2.0 - 1.0) * uHalfSize.x;\n  float screenY = (1.0 - (float(row) + jitterY) / float(uSize.y) * 2.0) * uHalfSize.y;\n  vec3 rayDirection = normalize(uForward + uRight * screenX + uAbove * screenY);\n  tracePath(uEye, rayDirection, pixel, sampleIndex);", GT = "uniform sampler2D uTexelPoints;\nuniform sampler2D uTexelNormals;\nuniform int uTexelCount;\nuniform int uSampleCount;", KT = "void main() {\n  ivec2 pixelCoordinate = ivec2(gl_FragCoord.xy);\n  int texelIndex = pixelCoordinate.y * uSize.x + pixelCoordinate.x;\n  uint pixel = uint(texelIndex);\n  uint sampleIndex = uint(uSample);\n  if (uHasSun) sunFrame = buildFrame(uSunDirection);\n  vec3 normal = texelFetch(uTexelNormals, pixelCoordinate, 0).xyz;\n  vec3 origin = texelFetch(uTexelPoints, pixelCoordinate, 0).xyz + normal * uSurfaceOffset;\n  float firstUnit = (float(uSample) + hashJitter(pixel, sampleIndex, uSeed, 1u)) / float(uSampleCount);\n  float secondUnit = hashJitter(pixel, sampleIndex, uSeed, 2u);\n  float coneRadius = sqrt(firstUnit);\n  float angle = TWO_PI * secondUnit;\n  vec3 rayDirection = buildFrame(normal) * vec3(coneRadius * cos(angle), coneRadius * sin(angle), sqrt(max(0.0, 1.0 - firstUnit)));\n  if (texelIndex >= uTexelCount) rayDirection = normal;\n  tracePath(origin, rayDirection, pixel, sampleIndex);", qT = `
/** The maximum and the minimum importance measure of one tree node for the current hit point. */
vec2 lightTreeImportance(int node, vec3 normal) {
  int base = node * LIGHT_TREE_TEXELS;
  vec4 minimumEnergy = fetchData(uLightTree, base);
  vec4 maximumCosineO = fetchData(uLightTree, base + 1);
  vec4 axisCosineE = fetchData(uLightTree, base + 2);
  float energy = minimumEnergy.w;
  vec3 delta = 0.5 * (minimumEnergy.xyz + maximumCosineO.xyz) - hitPoint;
  float halfDiagonal = 0.5 * length(maximumCosineO.xyz - minimumEnergy.xyz);
  float centerDistance = length(delta);
  float nearest = max(max(centerDistance, halfDiagonal), 1e-4);
  float farthest = centerDistance + halfDiagonal;
  float minimumMeasure = energy / max(farthest * farthest, 1e-8);
  if (centerDistance <= halfDiagonal) return vec2(energy / (nearest * nearest), minimumMeasure);
  vec3 toward = delta / centerDistance;
  float ratio = halfDiagonal / centerDistance;
  float thetaU = acos(sqrt(max(0.0, 1.0 - ratio * ratio)));
  float theta = acos(clamp(-dot(axisCosineE.xyz, toward), -1.0, 1.0));
  float thetaO = acos(clamp(maximumCosineO.w, -1.0, 1.0));
  float thetaE = acos(clamp(axisCosineE.w, -1.0, 1.0));
  float thetaPrime = max(theta - thetaO - thetaU, 0.0);
  if (thetaPrime >= thetaE) return vec2(0.0, minimumMeasure);
  float surfaceTheta = acos(clamp(dot(normal, toward), -1.0, 1.0));
  float surfaceCosine = max(cos(max(surfaceTheta - thetaU, 0.0)), 0.0);
  return vec2(energy * cos(thetaPrime) * surfaceCosine / (nearest * nearest), minimumMeasure);
}

/**
 * Draws one emitter. The sun and the sky keep their uniform share of the draw; a local light is reached by walking the
 * light tree from the root, each step choosing a child by the mix of its two measures. Returns -1 when no light is worth
 * sampling. With one local light, or none, this is the uniform choice.
 */
int chooseEmitterByTree(vec3 normal, out float probability) {
  float uniformShare = 1.0 / float(uEmitterCount);
  int firstLightEmitter = uHasSun ? 1 : 0;
  int emitter = min(int(floor(nextRandom() * float(uEmitterCount))), uEmitterCount - 1);
  probability = uniformShare;
  int lightIndex = emitter - firstLightEmitter;
  if (lightIndex < 0 || lightIndex >= uLightCount) return emitter;
  // The tree weighs a node by every light under it, linked or not, so a receiver with light linking draws uniformly among the lights it can see.
  int linkedCount = 0;
  for (int index = 0; index < uLightCount; index++) {
    if (reaches(int(fetchData(uLights, index * LIGHT_TEXELS + 1).w))) linkedCount++;
  }
  if (linkedCount < uLightCount) {
    if (linkedCount == 0) return -1;
    int skip = min(int(floor(nextRandom() * float(linkedCount))), linkedCount - 1);
    probability = float(uLightCount) * uniformShare / float(linkedCount);
    for (int index = 0; index < uLightCount; index++) {
      if (!reaches(int(fetchData(uLights, index * LIGHT_TEXELS + 1).w))) continue;
      if (skip == 0) return firstLightEmitter + index;
      skip--;
    }
    return -1;
  }
  int node = 0;
  float pathProbability = 1.0;
  for (int step = 0; step < 64; step++) {
    vec4 links = fetchData(uLightTree, node * LIGHT_TREE_TEXELS + 3);
    if (links.x < 0.0) {
      probability = float(uLightCount) * uniformShare * pathProbability;
      return firstLightEmitter + int(links.z);
    }
    vec2 left = lightTreeImportance(int(links.x), normal);
    vec2 right = lightTreeImportance(int(links.y), normal);
    float totalMaximum = left.x + right.x;
    float totalMinimum = left.y + right.y;
    if (!(totalMinimum > 0.0)) return -1;
    float leftProbability = left.y / totalMinimum;
    if (totalMaximum > 0.0) leftProbability = ${(1 - fT).toFixed(4)} * (left.x / totalMaximum) + ${fT.toFixed(4)} * leftProbability;
    if (nextRandom() < leftProbability) {
      node = int(links.x);
      pathProbability *= leftProbability;
    } else {
      node = int(links.y);
      pathProbability *= 1.0 - leftProbability;
    }
  }
  return -1;
}
`, JT = (e, t, n, r, i, a) => `#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;

const float PI = 3.14159265358979;
const float TWO_PI = 6.28318530717959;
const int TEXTURE_SHIFT = 11;
const int TEXTURE_MASK = 2047;
const int TRIANGLE_TEXELS = 9;
const int MATERIAL_TEXELS = 10;
const int LIGHT_TEXELS = 6;
const int STACK_SIZE = 128;
const bool BLUE_NOISE_FIRST = ${n};
const bool IMPORTANT_LIGHTS = ${r};
const bool LIGHT_TREE = ${a};
const int LIGHT_TREE_FIRST_HIT_LIGHTS = 16;
const int LIGHT_TREE_TEXELS = 4;
// The real-time kernel picks one emitter at the first hit too (the denoiser averages the choices over frames) instead of tracing a shadow ray to every emitter.
const bool STOCHASTIC_FIRST_HIT = ${i};
const int ALPHA_STEP_LIMIT = 64;
const int RUSSIAN_ROULETTE_START = 3;
const float MINIMUM_ALPHA = 1e-3;
const float MIRROR_ALPHA = 2e-3;
const float DIELECTRIC_COAT_REFLECTANCE = 0.04;

uniform sampler2D uNodes;
uniform sampler2D uTriangles;
uniform sampler2D uMaterials;
uniform sampler2D uLights;
${a ? "uniform sampler2D uLightTree;" : ""}
uniform sampler2D uAtlas;
uniform sampler2D uEnvironment;
uniform sampler2D uEnvironmentRows;
uniform sampler2D uEnvironmentPixels;
uniform sampler2D uBlueNoise;

uniform vec3 uEye;
uniform vec3 uForward;
uniform vec3 uRight;
uniform vec3 uAbove;
uniform vec2 uHalfSize;
uniform ivec2 uSize;
uniform int uSample;
uniform uint uSeed;
uniform int uBounces;
uniform float uFireflyClamp;
uniform float uSurfaceOffset;
uniform float uFarDistance;
uniform int uLightCount;
uniform int uEmitterCount;
uniform bool uHasSun;
uniform vec3 uSunDirection;
uniform vec3 uSunColor;
uniform float uSunCosineMax;
uniform bool uHasEnvironment;
uniform vec4 uEnvironmentShape;
uniform vec2 uEnvironmentRotation;
uniform bool uHasVolume;
uniform vec3 uVolumeMinimum;
uniform vec3 uVolumeMaximum;
uniform vec3 uVolumeAlbedo;
uniform vec3 uVolumeShape;
${t ? GT : ""}
${e ? yT : ""}
layout(location = 0) out vec4 outRadiance;
layout(location = 1) out vec4 outAlbedo;
layout(location = 2) out vec4 outNormal;
layout(location = 3) out vec4 outStatistics;
${i ? IT : ""}

vec4 fetchData(sampler2D source, int index) {
  return texelFetch(source, ivec2(index & TEXTURE_MASK, index >> TEXTURE_SHIFT), 0);
}

float fetchScalar(sampler2D source, int index) {
  return texelFetch(source, ivec2(index & TEXTURE_MASK, index >> TEXTURE_SHIFT), 0).r;
}

// ---- Random numbers (the same integer arithmetic as the CPU tracer) ----

uint rngState = 1u;

void resetRandom(uint pixel, uint sampleIndex, uint seed) {
  uint mixed = ((pixel + 0x9e3779b9u) * 0x85ebca6bu) ^ ((sampleIndex + 0x7f4a7c15u) * 0xc2b2ae35u) ^ ((seed + 0x165667b1u) * 0x27d4eb2fu);
  mixed = (mixed ^ (mixed >> 15)) * 0x2c1b3c6du;
  mixed = (mixed ^ (mixed >> 12)) * 0x297a2d39u;
  mixed ^= mixed >> 15;
  rngState = mixed == 0u ? 1u : mixed;
}

// Blue noise tile of the first sample of a pixel: its first two values replace the first two random draws of the path.
vec4 blueSample = vec4(0.0);
int blueDrawsUsed = 2;

vec4 blueNoiseAt(ivec2 pixelCoordinate) {
  vec4 bytes = round(texelFetch(uBlueNoise, pixelCoordinate & 63, 0) * 255.0);
  return (bytes + 0.5) / 256.0;
}

float nextRandom() {
  if (BLUE_NOISE_FIRST && blueDrawsUsed < 2) {
    blueDrawsUsed++;
    return blueDrawsUsed == 1 ? blueSample.z : blueSample.w;
  }
  rngState = rngState * 747796405u + 2891336453u;
  uint word = ((rngState >> ((rngState >> 28) + 4u)) ^ rngState) * 277803737u;
  word = (word >> 22) ^ word;
  return float(word >> 8) / 16777216.0;
}

float hashJitter(uint pixel, uint sampleIndex, uint seed, uint dimension) {
  uint mixed = ((pixel ^ 0x51ed270bu) * 0x9e3779b1u) ^ ((sampleIndex + dimension * 0x632be5abu) * 0x85ebca6bu) ^ ((seed + 0x1b873593u) * 0xc2b2ae35u);
  mixed = (mixed ^ (mixed >> 16)) * 0x7feb352du;
  mixed = (mixed ^ (mixed >> 15)) * 0x846ca68bu;
  mixed ^= mixed >> 16;
  return float(mixed >> 8) / 16777216.0;
}

float luminance(vec3 color) {
  return dot(color, vec3(0.2126, 0.7152, 0.0722));
}

// ---- Ray queries ----

float nearestDistance;
int nearestSlot;
float nearestU;
float nearestV;

float safeInverseComponent(float component) {
  if (abs(component) > 1e-20) return 1.0 / component;
  return component < 0.0 ? -1e20 : 1e20;
}

vec3 safeInverse(vec3 direction) {
  return vec3(safeInverseComponent(direction.x), safeInverseComponent(direction.y), safeInverseComponent(direction.z));
}

float boxEntry(int node, vec3 origin, vec3 inverse) {
  vec4 low = fetchData(uNodes, node * 2);
  vec4 high = fetchData(uNodes, node * 2 + 1);
  vec3 first = (low.xyz - origin) * inverse;
  vec3 second = (high.xyz - origin) * inverse;
  vec3 nearest = min(first, second);
  vec3 farthest = max(first, second);
  float entry = max(max(max(nearest.x, nearest.y), nearest.z), 0.0);
  float exitDistance = min(min(farthest.x, farthest.y), farthest.z);
  return entry <= exitDistance * (1.0 + 1e-6) + 1e-6 ? entry : 1e30;
}

bool visitLeaf(int node, vec3 origin, vec3 direction, bool anyHit) {
  vec4 range = fetchData(uNodes, node * 2 + 1);
  vec4 header = fetchData(uNodes, node * 2);
  int start = int(range.w);
  int end = start + int(-header.w);
  for (int slot = start; slot < end; slot++) {
    int base = slot * TRIANGLE_TEXELS;
    vec3 corner = fetchData(uTriangles, base).xyz;
    vec3 edgeFirst = fetchData(uTriangles, base + 1).xyz;
    vec3 edgeSecond = fetchData(uTriangles, base + 2).xyz;
    vec3 pivot = cross(direction, edgeSecond);
    float determinant = dot(edgeFirst, pivot);
    if (determinant == 0.0) continue;
    vec3 offset = origin - corner;
    float firstWeight = dot(offset, pivot) / determinant;
    if (firstWeight < 0.0 || firstWeight > 1.0) continue;
    vec3 query = cross(offset, edgeFirst);
    float secondWeight = dot(direction, query) / determinant;
    if (secondWeight < 0.0 || firstWeight + secondWeight > 1.0) continue;
    float distance = dot(edgeSecond, query) / determinant;
    if (distance < 0.0 || distance >= nearestDistance) continue;
    nearestDistance = distance;
    nearestSlot = slot;
    nearestU = firstWeight;
    nearestV = secondWeight;
    if (anyHit) return true;
  }
  return false;
}

void traceRay(vec3 origin, vec3 direction, float limit, bool anyHit) {
  nearestDistance = limit;
  nearestSlot = -1;
  vec3 inverse = safeInverse(direction);
  int nodeStack[STACK_SIZE];
  float entryStack[STACK_SIZE];
  int stackSize = 1;
  nodeStack[0] = 0;
  entryStack[0] = 0.0;
  while (stackSize > 0) {
    stackSize--;
    int node = nodeStack[stackSize];
    if (!(entryStack[stackSize] < nearestDistance)) continue;
    vec4 header = fetchData(uNodes, node * 2);
    if (header.w < 0.0) {
      if (visitLeaf(node, origin, direction, anyHit)) return;
      continue;
    }
    int left = node + 1;
    int right = int(header.w);
    float leftEntry = boxEntry(left, origin, inverse);
    float rightEntry = boxEntry(right, origin, inverse);
    bool nearFirst = leftEntry <= rightEntry;
    nodeStack[stackSize] = nearFirst ? right : left;
    entryStack[stackSize] = nearFirst ? rightEntry : leftEntry;
    nodeStack[stackSize + 1] = nearFirst ? left : right;
    entryStack[stackSize + 1] = nearFirst ? leftEntry : rightEntry;
    stackSize += 2;
  }
}

// ---- Hits ----

float hitDistance;
vec3 hitPoint;
vec3 hitNormal;
vec3 hitColor;
vec3 hitEmission;
float hitMetallic;
float hitRoughness;
float hitClearcoat;
float hitClearcoatRoughness;
float hitTransmission;
float hitIor;
float hitCutoff;
int hitMaterialIndex;
uint hitMask;

vec3 srgbToLinear(vec3 encoded) {
  return mix(pow((encoded + 0.055) / 1.055, vec3(2.4)), encoded / 12.92, lessThanEqual(encoded, vec3(0.04045)));
}

vec4 sampleAtlas(vec4 rectangle, float flags, vec2 uv) {
  if (rectangle.z <= 0.0) return vec4(1.0);
  int width = int(rectangle.z);
  int height = int(rectangle.w);
  bool repeat = mod(flags, 2.0) >= 1.0;
  bool encoded = flags >= 2.0;
  float x = uv.x * rectangle.z - 0.5;
  float y = uv.y * rectangle.w - 0.5;
  float left = floor(x);
  float top = floor(y);
  float shareX = x - left;
  float shareY = y - top;
  vec4 total = vec4(0.0);
  for (int corner = 0; corner < 4; corner++) {
    int column = int(left) + (corner & 1);
    int row = int(top) + (corner >> 1);
    if (repeat) {
      column = ((column % width) + width) % width;
      row = ((row % height) + height) % height;
    } else {
      column = clamp(column, 0, width - 1);
      row = clamp(row, 0, height - 1);
    }
    float weight = (((corner & 1) == 1) ? shareX : 1.0 - shareX) * (((corner >> 1) == 1) ? shareY : 1.0 - shareY);
    vec4 texel = texelFetch(uAtlas, ivec2(int(rectangle.x) + column, int(rectangle.y) + row), 0);
    vec3 color = encoded ? srgbToLinear(texel.rgb) : texel.rgb;
    total += weight * vec4(color, texel.a);
  }
  return total;
}

void applyNormalMap(vec4 rectangle, float flags, vec2 scale, vec3 edgeOne, vec3 edgeTwo, vec2 uvOne, vec2 uvTwo, vec2 uv) {
  float determinant = uvOne.x * uvTwo.y - uvTwo.x * uvOne.y;
  if (abs(determinant) < 1e-12) return;
  vec3 normal = hitNormal;
  vec3 tangent = (edgeOne * uvTwo.y - edgeTwo * uvOne.y) / determinant;
  vec3 bitangent = (edgeTwo * uvOne.x - edgeOne * uvTwo.x) / determinant;
  tangent -= normal * dot(tangent, normal);
  float tangentLength = length(tangent);
  if (tangentLength == 0.0) return;
  tangent /= tangentLength;
  vec3 across = cross(normal, tangent);
  float acrossLength = length(across);
  if (acrossLength == 0.0) acrossLength = 1.0;
  float handedness = dot(across, bitangent) < 0.0 ? -1.0 : 1.0;
  across *= handedness / acrossLength;
  vec3 texel = sampleAtlas(rectangle, flags, uv).rgb;
  float sideways = (texel.x * 2.0 - 1.0) * scale.x;
  float forwards = (texel.y * 2.0 - 1.0) * scale.y;
  float outwards = texel.z * 2.0 - 1.0;
  vec3 mapped = tangent * sideways + across * forwards + normal * outwards;
  float mappedLength = length(mapped);
  if (!(mappedLength > 1e-6)) return;
  hitNormal = mapped / mappedLength;
}

/** Fills the hit globals from the triangle in \`nearestSlot\`; returns the alpha of the colour map. */
float fillHit(vec3 origin, vec3 direction, float distance) {
  int base = nearestSlot * TRIANGLE_TEXELS;
  vec4 cornerData = fetchData(uTriangles, base);
  vec3 edgeOne = fetchData(uTriangles, base + 1).xyz;
  vec3 edgeTwo = fetchData(uTriangles, base + 2).xyz;
  vec4 normalOneData = fetchData(uTriangles, base + 3);
  vec4 normalTwoData = fetchData(uTriangles, base + 4);
  vec4 normalThreeData = fetchData(uTriangles, base + 5);
  vec4 colorOneData = fetchData(uTriangles, base + 6);
  vec4 colorTwoData = fetchData(uTriangles, base + 7);
  vec4 colorThreeData = fetchData(uTriangles, base + 8);
  float secondWeight = nearestU;
  float thirdWeight = nearestV;
  float firstWeight = 1.0 - secondWeight - thirdWeight;
  hitDistance = distance;
  hitPoint = origin + direction * distance;
  vec3 normal = firstWeight * normalOneData.xyz + secondWeight * normalTwoData.xyz + thirdWeight * normalThreeData.xyz;
  float normalLength = length(normal);
  hitNormal = normal / (normalLength == 0.0 ? 1.0 : normalLength);
  vec3 vertexColor = firstWeight * colorOneData.xyz + secondWeight * colorTwoData.xyz + thirdWeight * colorThreeData.xyz;
  vec2 uv = firstWeight * vec2(normalOneData.w, colorOneData.w) + secondWeight * vec2(normalTwoData.w, colorTwoData.w) + thirdWeight * vec2(normalThreeData.w, colorThreeData.w);
  hitMaterialIndex = int(cornerData.w);
  int material = hitMaterialIndex * MATERIAL_TEXELS;
  vec4 colorMetallic = fetchData(uMaterials, material);
  vec4 emissionRoughness = fetchData(uMaterials, material + 1);
  vec4 coating = fetchData(uMaterials, material + 2);
  vec4 shape = fetchData(uMaterials, material + 3);
  vec4 flagsOne = fetchData(uMaterials, material + 4);
  vec4 flagsTwo = fetchData(uMaterials, material + 5);
  hitColor = colorMetallic.rgb * vertexColor;
  hitEmission = emissionRoughness.rgb;
  hitMetallic = colorMetallic.w;
  hitRoughness = emissionRoughness.w;
  hitClearcoat = coating.x;
  hitClearcoatRoughness = coating.y;
  hitTransmission = coating.z;
  hitIor = coating.w;
  hitCutoff = shape.z;
  hitMask = uint(shape.w) | (uint(flagsOne.x) << 16);
  float alpha = 1.0;
  vec4 mapRectangle = fetchData(uMaterials, material + 6);
  if (mapRectangle.z > 0.0) {
    vec4 texel = sampleAtlas(mapRectangle, flagsOne.y, uv);
    hitColor *= texel.rgb;
    alpha = texel.a;
  }
  vec4 emissiveRectangle = fetchData(uMaterials, material + 9);
  if (emissiveRectangle.z > 0.0) hitEmission *= sampleAtlas(emissiveRectangle, flagsTwo.x, uv).rgb;
  vec4 surfaceRectangle = fetchData(uMaterials, material + 8);
  if (surfaceRectangle.z > 0.0) {
    vec4 texel = sampleAtlas(surfaceRectangle, flagsOne.w, uv);
    hitRoughness *= texel.g;
    hitMetallic *= texel.b;
  }
  vec4 normalRectangle = fetchData(uMaterials, material + 7);
  if (normalRectangle.z > 0.0) {
    vec2 uvOne = vec2(normalTwoData.w - normalOneData.w, colorTwoData.w - colorOneData.w);
    vec2 uvTwo = vec2(normalThreeData.w - normalOneData.w, colorThreeData.w - colorOneData.w);
    applyNormalMap(normalRectangle, flagsOne.z, shape.xy, edgeOne, edgeTwo, uvOne, uvTwo, uv);
  }
  return alpha;
}

/** The nearest solid hit, stepping through the transparent texels of cutout materials. */
bool intersectScene(vec3 origin, vec3 direction) {
  vec3 start = origin;
  float travelled = 0.0;
  for (int attempt = 0; attempt < ALPHA_STEP_LIMIT; attempt++) {
    traceRay(start, direction, uFarDistance, false);
    if (nearestSlot < 0) return false;
    float foundDistance = nearestDistance;
    float alpha = fillHit(start, direction, foundDistance);
    if (hitCutoff == 0.0 || alpha >= hitCutoff) {
      hitDistance += travelled;
      return true;
    }
    float advance = foundDistance + uSurfaceOffset;
    travelled += advance;
    start += direction * advance;
  }
  return false;
}

/** The alpha of the colour map at the nearest hit, without touching the hit globals a shadow ray must not disturb. */
float alphaAtNearestHit() {
  int base = nearestSlot * TRIANGLE_TEXELS;
  float secondWeight = nearestU;
  float thirdWeight = nearestV;
  float firstWeight = 1.0 - secondWeight - thirdWeight;
  vec4 first = fetchData(uTriangles, base + 3);
  vec4 second = fetchData(uTriangles, base + 4);
  vec4 third = fetchData(uTriangles, base + 5);
  vec2 uv = firstWeight * vec2(first.w, fetchData(uTriangles, base + 6).w) + secondWeight * vec2(second.w, fetchData(uTriangles, base + 7).w) + thirdWeight * vec2(third.w, fetchData(uTriangles, base + 8).w);
  int material = int(fetchData(uTriangles, base).w) * MATERIAL_TEXELS;
  vec4 mapRectangle = fetchData(uMaterials, material + 6);
  if (mapRectangle.z <= 0.0) return 1.0;
  return sampleAtlas(mapRectangle, fetchData(uMaterials, material + 4).y, uv).a;
}

bool occluded(vec3 origin, vec3 direction, float limit) {
  vec3 start = origin;
  float remaining = limit;
  // A solid any-hit shadows the point wherever it lies; a transparent one hides what sits before it, so retrace for nearest hits.
  bool anyHit = true;
  for (int attempt = 0; attempt < ALPHA_STEP_LIMIT; attempt++) {
    traceRay(start, direction, remaining, anyHit);
    if (nearestSlot < 0) return false;
    int material = int(fetchData(uTriangles, nearestSlot * TRIANGLE_TEXELS).w) * MATERIAL_TEXELS;
    float cutoff = fetchData(uMaterials, material + 3).z;
    if (cutoff == 0.0) return true;
    if (alphaAtNearestHit() >= cutoff) return true;
    if (anyHit) {
      anyHit = false;
      continue;
    }
    float advance = nearestDistance + uSurfaceOffset;
    remaining -= advance;
    if (remaining <= 0.0) return false;
    start += direction * advance;
  }
  return true;
}

// ---- Frames ----

mat3 buildFrame(vec3 normal) {
  bool helperIsX = abs(normal.x) < 0.9;
  float helperX = helperIsX ? 1.0 : 0.0;
  float helperY = helperIsX ? 0.0 : 1.0;
  vec3 tangent = vec3(-normal.z * helperY, normal.z * helperX, normal.x * helperY - normal.y * helperX);
  tangent = normalize(tangent);
  return mat3(tangent, cross(normal, tangent), normal);
}

vec3 localToWorld(mat3 frame, vec3 local) {
  return frame * local;
}

vec3 worldToLocal(mat3 frame, vec3 world) {
  return transpose(frame) * world;
}

// ---- Environment map ----

vec3 environmentRadiance(vec3 direction) {
  float width = uEnvironmentShape.x;
  float height = uEnvironmentShape.y;
  float mapX = uEnvironmentRotation.x * direction.x - uEnvironmentRotation.y * direction.z;
  float mapZ = uEnvironmentRotation.y * direction.x + uEnvironmentRotation.x * direction.z;
  float column = (atan(mapX, -mapZ) / TWO_PI + 0.5) * width - 0.5;
  float row = acos(clamp(direction.y, -1.0, 1.0)) / PI * height - 0.5;
  float left = floor(column);
  float top = floor(row);
  float shareX = column - left;
  float shareY = row - top;
  int columns = int(width);
  int rows = int(height);
  vec3 total = vec3(0.0);
  for (int corner = 0; corner < 4; corner++) {
    int cornerColumn = ((int(left) + (corner & 1)) % columns + columns) % columns;
    int cornerRow = clamp(int(top) + (corner >> 1), 0, rows - 1);
    float weight = (((corner & 1) == 1) ? shareX : 1.0 - shareX) * (((corner >> 1) == 1) ? shareY : 1.0 - shareY);
    total += weight * texelFetch(uEnvironment, ivec2(cornerColumn, cornerRow), 0).rgb * uEnvironmentShape.z;
  }
  return total;
}

float environmentPdf(vec3 direction) {
  float width = uEnvironmentShape.x;
  float height = uEnvironmentShape.y;
  float mapX = uEnvironmentRotation.x * direction.x - uEnvironmentRotation.y * direction.z;
  float mapZ = uEnvironmentRotation.y * direction.x + uEnvironmentRotation.x * direction.z;
  int column = min(int(width) - 1, int(floor((atan(mapX, -mapZ) / TWO_PI + 0.5) * width)));
  float polar = acos(clamp(direction.y, -1.0, 1.0));
  int row = min(int(height) - 1, int(floor(polar / PI * height)));
  float sinePolar = max(sin(polar), 1e-6);
  float rowWeight = sin(PI * (float(row) + 0.5) / height);
  vec3 texel = texelFetch(uEnvironment, ivec2(column, row), 0).rgb;
  float weight = (luminance(texel) + 1e-6) * rowWeight;
  return weight / uEnvironmentShape.w * width * height / (TWO_PI * PI * sinePolar);
}

int firstIndexAbove(sampler2D cumulative, int start, int end, float target) {
  int low = start;
  int high = end - 1;
  for (int step = 0; step < 24; step++) {
    if (low >= high) break;
    int middle = (low + high) >> 1;
    if (fetchScalar(cumulative, middle) < target) low = middle + 1;
    else high = middle;
  }
  return low;
}

/** Draws a direction in proportion to the map's light; returns its pdf. */
float sampleEnvironment(float rowUnit, float columnUnit, float columnJitter, float rowJitter, out vec3 direction) {
  int width = int(uEnvironmentShape.x);
  int height = int(uEnvironmentShape.y);
  int row = firstIndexAbove(uEnvironmentRows, 0, height, rowUnit);
  int rowBase = row * width;
  int column = firstIndexAbove(uEnvironmentPixels, rowBase, rowBase + width, columnUnit) - rowBase;
  float polar = PI * (float(row) + rowJitter) / float(height);
  float azimuth = ((float(column) + columnJitter) / float(width) - 0.5) * TWO_PI;
  float sinePolar = sin(polar);
  float mapX = sinePolar * sin(azimuth);
  float mapZ = -sinePolar * cos(azimuth);
  direction = vec3(
    uEnvironmentRotation.x * mapX + uEnvironmentRotation.y * mapZ,
    cos(polar),
    -uEnvironmentRotation.y * mapX + uEnvironmentRotation.x * mapZ
  );
  return environmentPdf(direction);
}

// ---- Microfacet pieces ----

float ggxDistribution(float alpha, float cosineHalf) {
  float alphaSquared = alpha * alpha;
  float denominator = cosineHalf * cosineHalf * (alphaSquared - 1.0) + 1.0;
  return alphaSquared / (PI * denominator * denominator);
}

float smithMasking(float alpha, float cosine) {
  float alphaSquared = alpha * alpha;
  return 2.0 * cosine / (cosine + sqrt(alphaSquared + (1.0 - alphaSquared) * cosine * cosine));
}

float schlick(float reflectanceAtNormal, float cosine) {
  float weight = pow(1.0 - clamp(cosine, 0.0, 1.0), 5.0);
  return reflectanceAtNormal + (1.0 - reflectanceAtNormal) * weight;
}

vec3 schlickColor(vec3 reflectanceAtNormal, float cosine) {
  float weight = pow(1.0 - clamp(cosine, 0.0, 1.0), 5.0);
  return reflectanceAtNormal + (1.0 - reflectanceAtNormal) * weight;
}

vec3 sampleVisibleNormal(vec3 view, float alpha, float firstUnit, float secondUnit) {
  vec3 stretched = vec3(alpha * view.x, alpha * view.y, view.z);
  float stretchedLength = length(stretched);
  stretched /= stretchedLength;
  float heightAxis = stretched.z;
  float planeLength = length(stretched.xy);
  vec2 planeDirection = planeLength > 0.0 ? stretched.xy / planeLength : vec2(0.0);
  vec2 tangent = planeLength > 0.0 ? vec2(-stretched.y, stretched.x) / planeLength : vec2(1.0, 0.0);
  vec3 bitangent = vec3(-heightAxis * planeDirection, planeLength);
  float radius = sqrt(firstUnit);
  float angle = TWO_PI * secondUnit;
  float diskX = radius * cos(angle);
  float diskY = radius * sin(angle);
  float blend = 0.5 * (1.0 + heightAxis);
  diskY = (1.0 - blend) * sqrt(1.0 - diskX * diskX) + blend * diskY;
  float lift = sqrt(max(0.0, 1.0 - diskX * diskX - diskY * diskY));
  vec3 normal = vec3(diskX * tangent + diskY * bitangent.xy + lift * stretched.xy, diskY * bitangent.z + lift * heightAxis);
  vec3 unstretched = vec3(alpha * normal.x, alpha * normal.y, max(0.0, normal.z));
  return unstretched / length(unstretched);
}

float roughnessToAlpha(float roughness) {
  return max(roughness * roughness, MINIMUM_ALPHA);
}

// ---- The layered surface ----

mat3 surfaceFrame;
vec3 surfaceView;
float surfaceViewCosine;
vec3 surfaceDiffuse;
vec3 surfaceSpecularNormal;
float surfaceSpecularWeight;
float surfaceSpecularAlpha;
float surfaceCoatWeight;
float surfaceCoatChance;
bool surfaceSampledCoat;
float surfaceCoatAlpha;
float surfaceDiffuseChance;
float surfaceDiffuseShare;
float surfaceSpecularChance;
vec3 surfaceValue;
float surfacePdf;

float dielectricSpecularAlbedo(float normalReflectance, float roughness, float viewCosine) {
  float smoothness = 1.0 - roughness;
  float slope = min(smoothness * smoothness, exp2(-9.28 * viewCosine)) * smoothness + (0.0425 - 0.0275 * roughness);
  float scale = 1.04 - 0.572 * roughness - 1.04 * slope;
  float offset = 1.04 * slope + 0.022 * roughness - 0.04;
  return clamp(normalReflectance * scale + offset, 0.0, 1.0);
}

void prepareSurface(vec3 normal, vec3 view) {
  surfaceFrame = buildFrame(normal);
  surfaceView = view;
  float viewCosine = max(dot(normal, view), 1e-4);
  surfaceViewCosine = viewCosine;
  float ratio = (hitIor - 1.0) / (hitIor + 1.0);
  float dielectricNormalReflectance = ratio * ratio;
  float dielectricFresnel = dielectricSpecularAlbedo(dielectricNormalReflectance, hitRoughness, viewCosine);
  surfaceCoatWeight = hitClearcoat > 0.0 ? hitClearcoat * schlick(DIELECTRIC_COAT_REFLECTANCE, viewCosine) : 0.0;
  float underCoat = 1.0 - surfaceCoatWeight;
  float diffuseShare = (1.0 - hitMetallic) * (1.0 - dielectricFresnel) * underCoat;
  surfaceDiffuse = hitColor * diffuseShare;
  surfaceDiffuseShare = diffuseShare;
  surfaceSpecularNormal = vec3(dielectricNormalReflectance * (1.0 - hitMetallic)) + hitColor * hitMetallic;
  float specularLuminance = luminance(surfaceSpecularNormal);
  surfaceSpecularWeight = underCoat;
  surfaceSpecularAlpha = roughnessToAlpha(hitRoughness);
  surfaceCoatAlpha = roughnessToAlpha(hitClearcoatRoughness);
  float diffuseLuminance = luminance(surfaceDiffuse);
  float specularChance = schlick(specularLuminance, viewCosine) * underCoat;
  float coatChance = surfaceCoatWeight;
  float sum = diffuseLuminance + specularChance + coatChance;
  surfaceDiffuseChance = sum > 0.0 ? diffuseLuminance / sum : 1.0;
  surfaceSpecularChance = sum > 0.0 ? specularChance / sum : 0.0;
  surfaceCoatChance = sum > 0.0 ? coatChance / sum : 0.0;
}

float microfacetTerm(float alpha, float viewCosine, float lightCosine, float halfCosine) {
  return ggxDistribution(alpha, halfCosine) * smithMasking(alpha, viewCosine) * smithMasking(alpha, lightCosine) / (4.0 * viewCosine * lightCosine);
}

void evaluateSurface(vec3 lightDirection) {
  surfaceValue = vec3(0.0);
  surfacePdf = 0.0;
  vec3 normal = surfaceFrame[2];
  float lightCosine = dot(normal, lightDirection);
  if (lightCosine <= 0.0) return;
  vec3 halfVector = surfaceView + lightDirection;
  float halfLength = length(halfVector);
  halfVector /= halfLength == 0.0 ? 1.0 : halfLength;
  float halfCosine = dot(normal, halfVector);
  float viewHalfCosine = max(dot(surfaceView, halfVector), 0.0);
  float viewCosine = surfaceViewCosine;
  surfacePdf += surfaceDiffuseChance * lightCosine / PI;
  surfaceValue += surfaceDiffuse / PI;
  if (surfaceSpecularChance > 0.0 && surfaceSpecularAlpha > MIRROR_ALPHA) {
    float alpha = surfaceSpecularAlpha;
    float term = microfacetTerm(alpha, viewCosine, lightCosine, halfCosine) * surfaceSpecularWeight;
    surfaceValue += schlickColor(surfaceSpecularNormal, viewHalfCosine) * term;
    surfacePdf += surfaceSpecularChance * smithMasking(alpha, viewCosine) * ggxDistribution(alpha, halfCosine) / (4.0 * viewCosine);
  }
  if (surfaceCoatChance > 0.0 && surfaceCoatAlpha > MIRROR_ALPHA) {
    float alpha = surfaceCoatAlpha;
    float reflectance = schlick(DIELECTRIC_COAT_REFLECTANCE, viewHalfCosine) * microfacetTerm(alpha, viewCosine, lightCosine, halfCosine) * (surfaceCoatWeight / max(schlick(DIELECTRIC_COAT_REFLECTANCE, viewCosine), 1e-6));
    surfaceValue += vec3(reflectance);
    surfacePdf += surfaceCoatChance * smithMasking(alpha, viewCosine) * ggxDistribution(alpha, halfCosine) / (4.0 * viewCosine);
  }
}

/** The next direction of a path; returns true for a mirror lobe, which is followed exactly. */
bool sampleSurface(float lobeUnit, float firstUnit, float secondUnit, out vec3 direction) {
  if (lobeUnit < surfaceDiffuseChance) {
    float radius = sqrt(firstUnit);
    float angle = TWO_PI * secondUnit;
    direction = localToWorld(surfaceFrame, vec3(radius * cos(angle), radius * sin(angle), sqrt(max(0.0, 1.0 - firstUnit))));
    return false;
  }
  bool isCoat = lobeUnit >= surfaceDiffuseChance + surfaceSpecularChance;
  surfaceSampledCoat = isCoat;
  float alpha = isCoat ? surfaceCoatAlpha : surfaceSpecularAlpha;
  vec3 localView = worldToLocal(surfaceFrame, surfaceView);
  if (alpha <= MIRROR_ALPHA) {
    direction = 2.0 * surfaceViewCosine * surfaceFrame[2] - surfaceView;
    return true;
  }
  vec3 localHalf = sampleVisibleNormal(localView, alpha, firstUnit, secondUnit);
  vec3 localLight = 2.0 * dot(localView, localHalf) * localHalf - localView;
  direction = localToWorld(surfaceFrame, localLight);
  return false;
}

vec3 mirrorWeight() {
  if (surfaceSampledCoat) return vec3(surfaceCoatWeight / surfaceCoatChance);
  return schlickColor(surfaceSpecularNormal, surfaceViewCosine) * surfaceSpecularWeight / surfaceSpecularChance;
}

float dielectricFresnelTerm(float cosineIncident, float relativeIndex) {
  float sineSquared = relativeIndex * relativeIndex * (1.0 - cosineIncident * cosineIncident);
  if (sineSquared >= 1.0) return 1.0;
  float cosineTransmitted = sqrt(1.0 - sineSquared);
  float parallel = (relativeIndex * cosineIncident - cosineTransmitted) / (relativeIndex * cosineIncident + cosineTransmitted);
  float perpendicular = (cosineIncident - relativeIndex * cosineTransmitted) / (cosineIncident + relativeIndex * cosineTransmitted);
  return 0.5 * (parallel * parallel + perpendicular * perpendicular);
}

bool sampleGlass(vec3 normal, vec3 view, bool entering, float ior, float alpha, float selectionUnit, float firstUnit, float secondUnit, out vec3 direction) {
  mat3 frame = buildFrame(normal);
  vec3 halfVector = normal;
  if (alpha > MIRROR_ALPHA) {
    vec3 localView = worldToLocal(frame, view);
    halfVector = localToWorld(frame, sampleVisibleNormal(localView, alpha, firstUnit, secondUnit));
  }
  float relativeIndex = entering ? 1.0 / ior : ior;
  float cosineIncident = max(dot(view, halfVector), 1e-6);
  float reflectChance = dielectricFresnelTerm(cosineIncident, relativeIndex);
  if (selectionUnit < reflectChance) {
    direction = 2.0 * dot(view, halfVector) * halfVector - view;
    return dot(direction, normal) > 0.0;
  }
  float cosineTransmitted = sqrt(max(0.0, 1.0 - relativeIndex * relativeIndex * (1.0 - cosineIncident * cosineIncident)));
  float bend = relativeIndex * cosineIncident - cosineTransmitted;
  direction = bend * halfVector - relativeIndex * view;
  return dot(direction, normal) < 0.0;
}

// ---- Fog ----

/** Narrows [entry, exit] to where the ray is inside the slab of one axis; false when it misses the box on that axis. */
bool clipAxis(float origin, float direction, float minimum, float maximum, inout float entry, inout float exitDistance) {
  if (direction == 0.0) return origin >= minimum && origin <= maximum;
  float first = (minimum - origin) / direction;
  float second = (maximum - origin) / direction;
  entry = max(entry, min(first, second));
  exitDistance = min(exitDistance, max(first, second));
  return true;
}

bool volumeInterval(vec3 origin, vec3 direction, float limit, out vec2 span) {
  float entry = 0.0;
  float exitDistance = min(limit, uVolumeShape.z);
  if (!clipAxis(origin.x, direction.x, uVolumeMinimum.x, uVolumeMaximum.x, entry, exitDistance)) return false;
  if (!clipAxis(origin.y, direction.y, uVolumeMinimum.y, uVolumeMaximum.y, entry, exitDistance)) return false;
  if (!clipAxis(origin.z, direction.z, uVolumeMinimum.z, uVolumeMaximum.z, entry, exitDistance)) return false;
  if (!(entry < exitDistance)) return false;
  span = vec2(entry, exitDistance);
  return true;
}

float henyeyGreensteinPhase(float anisotropy, float cosine) {
  float squared = anisotropy * anisotropy;
  return (1.0 - squared) / (4.0 * PI * pow(1.0 + squared - 2.0 * anisotropy * cosine, 1.5));
}

float sampleHenyeyGreensteinCosine(float anisotropy, float unit) {
  if (abs(anisotropy) < 1e-3) return 1.0 - 2.0 * unit;
  float squared = anisotropy * anisotropy;
  float ratio = (1.0 - squared) / (1.0 - anisotropy + 2.0 * anisotropy * unit);
  return clamp((1.0 + squared - ratio * ratio) / (2.0 * anisotropy), -1.0, 1.0);
}

// ---- One path ----

vec3 throughput;
vec3 radiance;
vec3 direction;
vec3 lightDirection;
vec3 lightRadiance;
bool inMedium = false;
float selectionProbability = 1.0;
float environmentSampledPdf = 0.0;
mat3 sunFrame;
vec3 featureAlbedo;
vec3 featureNormal;
float featureDepth;
float firstLegEscaped = 0.0;

void addRadiance(int depth, vec3 amount) {
  if (depth > 0) {
    float peak = max(amount.x, max(amount.y, amount.z));
    if (peak > uFireflyClamp) amount *= uFireflyClamp / peak;
  }
  radiance += amount;
}

float fogTransmittance(vec3 origin, float distance) {
  if (!uHasVolume) return 1.0;
  vec2 span;
  if (!volumeInterval(origin, lightDirection, distance, span)) return 1.0;
  return exp(-uVolumeShape.x * (span.y - span.x));
}

float environmentWeight(float candidatePdf) {
  float lightPdf = environmentSampledPdf * selectionProbability;
  float total = lightPdf * lightPdf + candidatePdf * candidatePdf;
  return lightPdf * lightPdf / total / lightPdf;
}

float directWeight(int mode, float candidatePdf) {
  if (mode == 1) return environmentWeight(candidatePdf);
  return 1.0 / selectionProbability;
}

// A shadow ray is recorded by addDirect and traced by flushShadowRay, so the whole shader holds one copy of the
// shadow-ray traversal (a compiler inlines every call, and a copy per light type took minutes to compile).
vec3 shadowOrigin;
vec3 shadowDirection;
float shadowLimit;
vec3 shadowAmount;
int shadowDepth;
bool shadowPending = false;

void addDirect(int depth, vec3 normal, float distance, int weightMode) {
  if (inMedium) {
    float cosine = dot(lightDirection, direction);
    float phase = henyeyGreensteinPhase(uVolumeShape.y, cosine);
    float scale = phase * fogTransmittance(hitPoint, distance) * directWeight(weightMode, phase);
    shadowOrigin = hitPoint;
    shadowAmount = throughput * lightRadiance * scale;
    shadowDepth = depth + 1;
  } else {
    float cosine = dot(normal, lightDirection);
    if (cosine <= 0.0) return;
    evaluateSurface(lightDirection);
    vec3 value = surfaceValue;
    if (value.x + value.y + value.z <= 0.0) return;
    shadowOrigin = hitPoint + normal * uSurfaceOffset;
    float scale = cosine * directWeight(weightMode, surfacePdf) * fogTransmittance(shadowOrigin, distance);
    shadowAmount = throughput * value * lightRadiance * scale;
    shadowDepth = depth;
  }
  shadowDirection = lightDirection;
  shadowLimit = distance;
  shadowPending = true;
}

void flushShadowRay() {
  if (!shadowPending) return;
  shadowPending = false;
  if (!occluded(shadowOrigin, shadowDirection, shadowLimit)) addRadiance(shadowDepth, shadowAmount);
}

bool reaches(int bit) {
  return inMedium || ((hitMask >> uint(bit)) & 1u) == 1u;
}

float aimAt(vec3 target, out float distanceSquared) {
  vec3 delta = target - hitPoint;
  distanceSquared = dot(delta, delta);
  float distance = sqrt(distanceSquared);
  lightDirection = delta / distance;
  return distance;
}

vec3 randomOnSphere(float radius) {
  float height = 2.0 * nextRandom() - 1.0;
  float angle = TWO_PI * nextRandom();
  float ring = sqrt(1.0 - height * height);
  return vec3(radius * ring * cos(angle), radius * height, radius * ring * sin(angle));
}

float pointLightFalloff(float distanceSquared, float range, float radius) {
  float cutoff = 1.0;
  if (range > 0.0) {
    float ratio = distanceSquared / (range * range);
    float fade = max(1.0 - ratio * ratio, 0.0);
    cutoff = fade * fade;
  }
  return cutoff / max(distanceSquared, radius * radius);
}

/** Draws one emitter's contribution into the pending shadow ray: emitter 0 is the sun when there is one, then the lights, then the sky. */
void sampleEmitter(int depth, vec3 normal, int emitter) {
  float distance = 0.0;
  int weightMode = 0;
  if (uHasSun && emitter == 0) {
    if (!reaches(0)) return;
    float cosineTheta = 1.0 - nextRandom() * (1.0 - uSunCosineMax);
    float sineTheta = sqrt(max(0.0, 1.0 - cosineTheta * cosineTheta));
    float phi = TWO_PI * nextRandom();
    lightDirection = sunFrame[0] * (sineTheta * cos(phi)) + sunFrame[1] * (sineTheta * sin(phi)) + sunFrame[2] * cosineTheta;
    lightRadiance = uSunColor;
    distance = uFarDistance;
  } else {
    int index = emitter - (uHasSun ? 1 : 0);
    if (index < uLightCount) {
      int base = index * LIGHT_TEXELS;
      vec4 positionType = fetchData(uLights, base);
      vec4 colorBit = fetchData(uLights, base + 1);
      vec4 directionRadius = fetchData(uLights, base + 2);
      vec4 acrossCone = fetchData(uLights, base + 3);
      vec4 alongBlend = fetchData(uLights, base + 4);
      vec4 intensityRange = fetchData(uLights, base + 5);
      int type = int(positionType.w);
      if (!reaches(int(colorBit.w))) return;
      float distanceSquared;
      if (type == 2) {
        float across = (nextRandom() - 0.5) * directionRadius.w;
        float along = (nextRandom() - 0.5) * acrossCone.w;
        vec3 point = positionType.xyz + acrossCone.xyz * across + alongBlend.xyz * along;
        distance = aimAt(point, distanceSquared);
        float emitCosine = -dot(directionRadius.xyz, lightDirection);
        if (distance < 1e-6 || emitCosine <= 0.0) return;
        lightRadiance = colorBit.rgb * (intensityRange.x * emitCosine / distanceSquared);
      } else {
        vec3 jitter = randomOnSphere(directionRadius.w);
        distance = aimAt(positionType.xyz + jitter, distanceSquared);
        if (distance < 1e-6) return;
        float mask = 1.0;
        if (type == 1) {
          float inside = -dot(directionRadius.xyz, lightDirection) - acrossCone.w;
          if (inside <= 0.0) return;
          if (alongBlend.w > 0.0 && inside < alongBlend.w) {
            float unit = inside / alongBlend.w;
            mask = unit * unit * (3.0 - 2.0 * unit);
          }
        }
        lightRadiance = colorBit.rgb * (intensityRange.x * pointLightFalloff(distanceSquared, intensityRange.y, directionRadius.w) * mask);
      }
      distance -= uSurfaceOffset;
    } else {
      vec3 sampled;
      float rowUnit = nextRandom();
      float columnUnit = nextRandom();
      float columnJitter = nextRandom();
      float rowJitter = nextRandom();
      environmentSampledPdf = sampleEnvironment(rowUnit, columnUnit, columnJitter, rowJitter, sampled);
      lightDirection = sampled;
      if (!(environmentSampledPdf > 0.0)) return;
      lightRadiance = environmentRadiance(lightDirection);
      distance = uFarDistance;
      weightMode = 1;
    }
  }
  addDirect(depth, normal, distance, weightMode);
}

/**
 * A cheap estimate of the light one local light brings to the hit point: its power over the squared distance, the
 * cosine at the surface and, for a spot light, whether the point is inside the cone. It ignores shadows. The estimate only
 * steers the choice; the chance of the choice is divided out, so the image stays the same in expectation.
 */
float lightImportance(int index, vec3 normal) {
  int base = index * LIGHT_TEXELS;
  vec4 positionType = fetchData(uLights, base);
  vec4 colorBit = fetchData(uLights, base + 1);
  vec4 directionRadius = fetchData(uLights, base + 2);
  vec4 acrossCone = fetchData(uLights, base + 3);
  vec4 intensityRange = fetchData(uLights, base + 5);
  vec3 delta = positionType.xyz - hitPoint;
  float distanceSquared = max(dot(delta, delta), 1e-8);
  vec3 toLight = delta * inversesqrt(distanceSquared);
  float cosine = 0.1 + max(dot(normal, toLight), 0.0);
  float power = luminance(colorBit.rgb) * intensityRange.x;
  int type = int(positionType.w);
  if (type == 2) return power * max(-dot(directionRadius.xyz, toLight), 0.0) * cosine / distanceSquared;
  float coneFactor = 1.0;
  if (type == 1 && -dot(directionRadius.xyz, toLight) - acrossCone.w <= 0.0) coneFactor = 0.0;
  return power * coneFactor * cosine * pointLightFalloff(distanceSquared, intensityRange.y, directionRadius.w);
}

/**
 * Draws one emitter. The sun and the sky keep their uniform share; the local lights split their shares by importance,
 * mixed with a uniform part so no light that could contribute has no chance. With one local light, or none, this is the
 * uniform choice with the same random number.
 */
int chooseEmitterByImportance(vec3 normal, out float probability) {
  float uniformShare = 1.0 / float(uEmitterCount);
  float draw = nextRandom();
  int firstLightEmitter = uHasSun ? 1 : 0;
  float total = 0.0;
  if (uLightCount > 1) {
    for (int index = 0; index < uLightCount; index++) total += lightImportance(index, normal);
  }
  if (!(total > 0.0)) {
    probability = uniformShare;
    return min(int(floor(draw * float(uEmitterCount))), uEmitterCount - 1);
  }
  float lightsShare = float(uLightCount) * uniformShare;
  float cumulative = 0.0;
  int chosen = uEmitterCount - 1;
  probability = uniformShare;
  for (int emitter = 0; emitter < uEmitterCount; emitter++) {
    int index = emitter - firstLightEmitter;
    float share = uniformShare;
    if (index >= 0 && index < uLightCount) share = lightsShare * (0.9 * lightImportance(index, normal) / total + 0.1 / float(uLightCount));
    cumulative += share;
    if (draw < cumulative) {
      chosen = emitter;
      probability = share;
      break;
    }
    probability = share;
  }
  return chosen;
}

${a ? qT : ""}
/**
 * The first hit lights from every emitter; later hits draw one, and divide by the chance of drawing it. The emitters and the
 * single draw share one loop, so the shader holds one copy of the emitter sampling and the shadow ray (issue #861).
 */
void addLights(int depth, vec3 normal) {
  bool firstHitByTree = LIGHT_TREE && uLightCount > LIGHT_TREE_FIRST_HIT_LIGHTS;
  bool everyEmitter = (depth == 0 && !STOCHASTIC_FIRST_HIT && !firstHitByTree) || uEmitterCount <= 1;
  int turns = uEmitterCount;
  int chosen = 0;
  bool shareAfterwards = false;
  if (everyEmitter) {
    selectionProbability = 1.0;
${a ? "  } else if (LIGHT_TREE) {\n    chosen = chooseEmitterByTree(normal, selectionProbability);\n    turns = chosen >= 0 ? 1 : 0;\n    // The sky is drawn with its uniform share whatever light was chosen: that share weighs the next escape ray.\n    shareAfterwards = true;\n" : ""}  } else if (IMPORTANT_LIGHTS) {
    turns = 1;
    chosen = chooseEmitterByImportance(normal, selectionProbability);
  } else {
    turns = 1;
    selectionProbability = 1.0 / float(uEmitterCount);
    chosen = int(floor(nextRandom() * float(uEmitterCount)));
  }
  for (int turn = 0; turn < turns; turn++) {
    sampleEmitter(depth, normal, everyEmitter ? turn : chosen);
    flushShadowRay();
  }
  if (shareAfterwards) selectionProbability = 1.0 / float(uEmitterCount);
}

void addEscape(int depth, float previousPdf, bool afterMirror) {
  if (!uHasEnvironment) return;
  vec3 sky = environmentRadiance(direction);
  float weight = 1.0;
  if (!afterMirror) {
    float environmentSide = environmentPdf(direction) * selectionProbability;
    weight = previousPdf * previousPdf / (previousPdf * previousPdf + environmentSide * environmentSide);
  }
  addRadiance(depth, throughput * sky * weight);
}

bool survivesRoulette(int depth) {
  if (depth < RUSSIAN_ROULETTE_START) return true;
  float survival = min(0.95, max(0.05, max(throughput.x, max(throughput.y, throughput.z))));
  if (nextRandom() >= survival) return false;
  throughput /= survival;
  return true;
}

bool scatterInFog(vec3 origin, float segmentLength) {
  vec2 span;
  if (!volumeInterval(origin, direction, segmentLength, span)) return false;
  float eventDistance = span.x - log(1.0 - nextRandom()) / uVolumeShape.x;
  if (eventDistance >= span.y) return false;
  hitPoint = origin + direction * eventDistance;
  return true;
}

${e ? ST : ""}
void tracePath(vec3 origin, vec3 startDirection, uint pixel, uint sampleIndex) {
  resetRandom(pixel, sampleIndex, uSeed);
  radiance = vec3(0.0);
  throughput = vec3(1.0);
  featureAlbedo = vec3(1.0);
  featureNormal = vec3(0.0, 0.0, 1.0);
  featureDepth = 0.0;
  bool featuresRecorded = false;
  direction = startDirection;
  vec3 position = origin;
  float previousPdf = 0.0;
  bool afterMirror = true;
  vec3 normal = vec3(0.0, 1.0, 0.0);
  for (int depth = 0; depth <= uBounces; depth++) {
    bool found = intersectScene(position, direction);
    bool inFog = uHasVolume && scatterInFog(position, found ? hitDistance : uFarDistance);
    if (!inFog && !found) {
      if (depth == 0) firstLegEscaped = 1.0;
      addEscape(depth, previousPdf, afterMirror);
      break;
    }
    bool isGlass = false;
    bool entering = true;
    bool needsLights = true;
    if (inFog) {
      throughput *= uVolumeAlbedo;
      inMedium = true;
    } else {
      entering = dot(hitNormal, direction) < 0.0;
      normal = entering ? hitNormal : -hitNormal;
      isGlass = hitTransmission > 0.0 && nextRandom() < hitTransmission;
      if (!featuresRecorded) {
        featureAlbedo = isGlass ? vec3(1.0) : hitColor;
        featureNormal = normal;
        featureDepth = hitDistance;
        featuresRecorded = true;
      }
      addRadiance(depth, throughput * hitEmission);
      needsLights = !isGlass;
      if (needsLights) {
        prepareSurface(normal, -direction);
${e ? bT : ""}
      }
    }
    if (needsLights) addLights(depth, normal);
    inMedium = false;
${i ? LT : ""}
    if (inFog) {
      float cosine = sampleHenyeyGreensteinCosine(uVolumeShape.y, nextRandom());
      float sine = sqrt(max(0.0, 1.0 - cosine * cosine));
      float azimuth = TWO_PI * nextRandom();
      mat3 frame = buildFrame(direction);
      direction = frame[0] * sine * cos(azimuth) + frame[1] * sine * sin(azimuth) + frame[2] * cosine;
      previousPdf = henyeyGreensteinPhase(uVolumeShape.y, cosine);
      afterMirror = false;
      position = hitPoint;
      if (!survivesRoulette(depth)) break;
      continue;
    }
    if (isGlass) {
      float alpha = roughnessToAlpha(hitRoughness);
      float selectionUnit = nextRandom();
      float firstUnit = nextRandom();
      float secondUnit = nextRandom();
      vec3 glassDirection;
      if (!sampleGlass(normal, -direction, entering, hitIor, alpha, selectionUnit, firstUnit, secondUnit, glassDirection)) break;
      direction = glassDirection;
      if (dot(direction, normal) < 0.0) throughput *= hitColor;
      afterMirror = true;
    } else {
      float lobeUnit = nextRandom();
${e ? xT : ""}
      float firstUnit = nextRandom();
      float secondUnit = nextRandom();
      vec3 sampledDirection;
      bool isMirror = sampleSurface(lobeUnit, firstUnit, secondUnit, sampledDirection);
      direction = sampledDirection;
      float cosine = dot(direction, normal);
      if (cosine <= 0.0) break;
      if (isMirror) {
        throughput *= mirrorWeight();
        afterMirror = true;
      } else {
        evaluateSurface(direction);
        if (!(surfacePdf > 0.0)) break;
        throughput *= surfaceValue * cosine / surfacePdf;
        previousPdf = surfacePdf;
        afterMirror = false;
      }
${i ? RT : ""}
    }
    position = hitPoint + direction * uSurfaceOffset;
    if (!survivesRoulette(depth)) break;
  }
}

${t ? KT : WT}
  // A sample that went through a NaN or an infinity (a grazing ray, a zero pdf) counts as black, so it cannot spread through the denoiser.
  if (!(all(greaterThanEqual(radiance, vec3(0.0))) && all(lessThan(radiance, vec3(1e30))))) radiance = vec3(0.0);
  if (!(featureDepth >= 0.0 && featureDepth < 1e30)) featureDepth = 0.0;
  if (!(all(greaterThanEqual(featureNormal, vec3(-1.5))) && all(lessThan(featureNormal, vec3(1.5))))) featureNormal = vec3(0.0, 0.0, 1.0);
  if (!(all(greaterThanEqual(featureAlbedo, vec3(0.0))) && all(lessThan(featureAlbedo, vec3(1e30))))) featureAlbedo = vec3(1.0);
  float sampleLuminance = luminance(radiance);
  outRadiance = vec4(radiance, featureDepth);
  outAlbedo = vec4(featureAlbedo, 0.0);
  outNormal = vec4(featureNormal, 0.0);
  outStatistics = vec4(sampleLuminance, sampleLuminance * sampleLuminance, firstLegEscaped, 0.0);
${i ? zT : ""}
}
`, VT();
}));
// src/path-tracer-gpu-pack.js
function XT(e, t = 4) {
	let n = Math.max(1, Math.ceil(e / HT));
	if (n > cE) throw RangeError("The scene is too large for the GPU path tracer tables.");
	return {
		width: HT,
		height: n,
		channels: t,
		data: new Float32Array(HT * n * t)
	};
}
function ZT(e) {
	let t = XT(e.nodeCount * 2), { data: n } = t;
	for (let t = 0; t < e.nodeCount; t++) {
		let r = t * 8;
		for (let i = 0; i < 3; i++) n[r + i] = e.nodeBounds[t * 6 + i], n[r + 4 + i] = e.nodeBounds[t * 6 + 3 + i];
		let i = e.rightChild[t];
		n[r + 3] = i < 0 ? -e.rangeCount[t] : i, n[r + 7] = e.rangeStart[t];
	}
	return t;
}
function QT(e) {
	let { positions: t, normals: n, uvs: r, colors: i, indices: a, triangleMaterial: o, bvh: s } = e, c = s.triangleOrder, l = XT(c.length * 9), { data: u } = l;
	for (let e = 0; e < c.length; e++) {
		let s = c[e], l = e * 9 * 4, d = [
			a[s * 3],
			a[s * 3 + 1],
			a[s * 3 + 2]
		];
		for (let e = 0; e < 3; e++) {
			let n = t[d[0] * 3 + e];
			u[l + e] = n, u[l + 4 + e] = t[d[1] * 3 + e] - n, u[l + 8 + e] = t[d[2] * 3 + e] - n;
		}
		u[l + 3] = o[s];
		for (let e = 0; e < 3; e++) {
			let t = d[e];
			for (let r = 0; r < 3; r++) u[l + (3 + e) * 4 + r] = n[t * 3 + r], u[l + (6 + e) * 4 + r] = i[t * 3 + r];
			u[l + (3 + e) * 4 + 3] = r[t * 2], u[l + (6 + e) * 4 + 3] = r[t * 2 + 1];
		}
	}
	return l;
}
function $T(e) {
	let t = [
		"texture",
		"normalTexture",
		"surfaceTexture",
		"emissiveTexture"
	], n = /* @__PURE__ */ new Map(), r = [];
	for (let i of e) for (let e of t) {
		let t = i[e];
		t && !n.has(t.data) && (n.set(t.data, null), r.push(t));
	}
	if (r.length === 0) return {
		placements: n,
		width: 1,
		height: 1,
		data: /* @__PURE__ */ new Uint8Array(4)
	};
	r.sort((e, t) => t.height - e.height);
	let i = 0, a = 0, o = 0;
	for (let e of r) {
		if (e.width > 4096) throw RangeError("A material texture is wider than the GPU atlas.");
		i + e.width > 4096 && (a += o, i = 0, o = 0), n.set(e.data, {
			x: i,
			y: a
		}), i += e.width, o = Math.max(o, e.height);
	}
	let s = a + o;
	if (s > cE) throw RangeError("The material textures do not fit the GPU atlas.");
	let c = new Uint8Array(sE * s * 4);
	for (let e of r) {
		let { x: t, y: r } = n.get(e.data);
		for (let n = 0; n < e.height; n++) c.set(e.data.subarray(n * e.width * 4, (n + 1) * e.width * 4), ((r + n) * sE + t) * 4);
	}
	return {
		placements: n,
		width: sE,
		height: s,
		data: c
	};
}
function eE(e) {
	return +!!e.repeat + (e.colorLookup ? 2 : 0);
}
function tE(e, t) {
	let n = XT(e.length * 10), { data: r } = n, i = [
		"texture",
		"normalTexture",
		"surfaceTexture",
		"emissiveTexture"
	];
	return e.forEach((e, n) => {
		let a = n * 10 * 4, o = e.lightMask < 0 ? 4294967295 : e.lightMask >>> 0;
		r.set([...e.color, e.metallic], a), r.set([...e.emission, e.roughness], a + 4), r.set([
			e.clearcoat,
			e.clearcoatRoughness,
			e.transmission,
			e.ior
		], a + 8), r.set([
			e.normalScale[0],
			e.normalScale[1],
			e.alphaCutoff,
			o & 65535
		], a + 12), r[a + 16] = o >>> 16 & 65535, i.forEach((n, i) => {
			let o = e[n];
			if (!o) return;
			let s = t.placements.get(o.data);
			r[a + 17 + i] = eE(o), r.set([
				s.x,
				s.y,
				o.width,
				o.height
			], a + (6 + i) * 4);
		});
	}), n;
}
function nE(e) {
	return e.some((e) => e.subsurface);
}
function rE(e) {
	let t = XT(e.length * 2), { data: n } = t;
	return e.forEach((e, t) => {
		let r = t * 2 * 4, i = e.subsurface;
		i && (n.set([i.weight, ...i.meanFreePath], r), n.set([...i.color ?? [
			-1,
			-1,
			-1
		], 0], r + 4));
	}), t;
}
function iE(e) {
	let t = [
		...e.points.map((e) => ({
			light: e,
			type: lE.point
		})),
		...e.spots.map((e) => ({
			light: e,
			type: lE.spot
		})),
		...e.areas.map((e) => ({
			light: e,
			type: lE.area
		}))
	], n = XT(Math.max(1, t.length) * 6), { data: r } = n;
	return t.forEach(({ light: e, type: t }, n) => {
		let i = n * 6 * 4;
		r.set([...e.position, t], i), r.set([...e.color, e.bit], i + 4), t === lE.area ? (r.set([...e.normal, e.width], i + 8), r.set([...e.across, e.height], i + 12), r.set([...e.along, 0], i + 16), r.set([
			e.intensity,
			0,
			0,
			0
		], i + 20)) : (r.set([...e.direction ?? [
			0,
			0,
			0
		], e.radius], i + 8), r.set([
			0,
			0,
			0,
			e.cosineHalfAngle ?? 0
		], i + 12), r.set([
			0,
			0,
			0,
			e.blend ?? 0
		], i + 16), r.set([
			e.intensity,
			e.range,
			0,
			0
		], i + 20));
	}), {
		table: n,
		count: t.length
	};
}
function aE(e) {
	let t = cT(e), n = XT(Math.max(1, t.nodeCount) * 4);
	return n.data.set(t.data), n;
}
function oE(e) {
	if (!e) return null;
	let { width: t, height: n, channels: r, data: i } = e, a = new Float32Array(t * n * 4);
	for (let e = 0; e < t * n; e++) {
		for (let t = 0; t < 3; t++) a[e * 4 + t] = i[e * r + t];
		a[e * 4 + 3] = 1;
	}
	let o = XT(n, 1), s = XT(t * n, 1), c = e.rowCumulative[n - 1];
	for (let t = 0; t < n; t++) o.data[t] = e.rowCumulative[t] / c;
	for (let r = 0; r < n; r++) {
		let n = e.pixelCumulative[r * t + t - 1];
		for (let i = 0; i < t; i++) s.data[r * t + i] = e.pixelCumulative[r * t + i] / n;
	}
	return {
		colors: a,
		width: t,
		height: n,
		rows: o,
		pixels: s
	};
}
var sE, cE, lE, uE = A((() => {
	YT(), vT(), CT(), sE = 4096, cE = 16384, lE = {
		point: 0,
		spot: 1,
		area: 2
	};
})), dE = /* @__PURE__ */ j({
	DEFAULT_SORT_BY_MATERIAL: () => !1,
	DEFAULT_WEBGPU_KERNEL: () => NE,
	WEBGPU_KERNELS: () => ME,
	gpuKernelCompileCount: () => pE,
	isWebGpuTracerAvailable: () => fE,
	prepareRealtimeKernel: () => kE,
	traceOnGpu: () => OE,
	traceOnWebGpu: () => OE,
	traceTexelsOnWebGpu: () => jE,
	webGpuKernelCompileCount: () => pE
});
function fE() {
	return typeof navigator < "u" && !!navigator.gpu;
}
function pE() {
	return HE;
}
async function mE() {
	if (!fE()) throw Error("The WebGPU path tracer needs navigator.gpu, which this page does not have. Use backend \"gpu\" (WebGL2) or \"cpu\".");
	let e = await navigator.gpu.requestAdapter({ powerPreference: "high-performance" });
	if (!e) throw Error("The WebGPU path tracer found no WebGPU adapter. Use backend \"gpu\" (WebGL2) or \"cpu\".");
	if (e.limits.maxStorageBuffersPerShaderStage < IE) throw Error(`The WebGPU path tracer needs ${IE} storage buffers per shader stage and this adapter allows ${e.limits.maxStorageBuffersPerShaderStage}. Use backend "gpu".`);
	let t = await e.requestDevice({ requiredLimits: {
		maxStorageBuffersPerShaderStage: IE,
		maxStorageBufferBindingSize: Math.min(e.limits.maxStorageBufferBindingSize, zE),
		maxBufferSize: Math.min(e.limits.maxBufferSize, zE)
	} }), n = [{
		binding: 0,
		visibility: GPUShaderStage.COMPUTE,
		buffer: {
			type: "uniform",
			hasDynamicOffset: !0,
			minBindingSize: PE
		}
	}];
	for (let e = 1; e < 11; e++) n.push({
		binding: e,
		visibility: GPUShaderStage.COMPUTE,
		buffer: { type: e <= 7 ? "read-only-storage" : "storage" }
	});
	let r = t.createBindGroupLayout({ entries: n }), i = e.info ?? {};
	return {
		device: t,
		bindGroupLayout: r,
		pipelineLayout: t.createPipelineLayout({ bindGroupLayouts: [r] }),
		gpu: `${i.vendor ?? "webgpu"} ${i.architecture ?? ""}`.trim(),
		kernels: /* @__PURE__ */ new Map()
	};
}
async function hE() {
	return VE ??= mE().catch((e) => {
		throw VE = null, e;
	}), VE;
}
function gE({ kernel: e, hasVolume: t, hasSubsurface: n, texelBake: r, realtime: i }) {
	return e === "wavefront" ? {
		code: MT,
		entryPoints: BE
	} : i ? {
		code: jT({
			hasVolume: t,
			hasSubsurface: n,
			realtime: i
		}),
		entryPoints: ["traceRealtime"]
	} : {
		code: jT({
			hasVolume: t,
			hasSubsurface: n,
			texelBake: r
		}),
		entryPoints: [r ? "bakeTexels" : "main"]
	};
}
async function _E(e, t) {
	let { device: n, pipelineLayout: r } = e, i = performance.now(), { code: a, entryPoints: o } = gE(t), s = n.createShaderModule({
		label: `path tracer ${t.kernel}`,
		code: a
	}), c = (await s.getCompilationInfo()).messages.filter((e) => e.type === "error");
	if (c.length > 0) throw Error(`The WebGPU path tracer shader did not compile: ${c.slice(0, 8).map((e) => `${e.lineNum}: ${e.message}`).join("; ")}`);
	let l = await Promise.all(o.map((e) => n.createComputePipelineAsync({
		layout: r,
		compute: {
			module: s,
			entryPoint: e
		}
	})));
	return HE++, {
		pipelines: Object.fromEntries(o.map((e, t) => [e, l[t]])),
		compileSeconds: (performance.now() - i) / 1e3
	};
}
async function vE(e, t) {
	let n = [
		t.kernel,
		t.hasVolume,
		t.hasSubsurface,
		t.texelBake,
		!!t.realtime
	].join(":");
	return e.kernels.has(n) || e.kernels.set(n, _E(e, t)), e.kernels.get(n);
}
function yE(e) {
	return {
		hasVolume: !!e.volume,
		hasSubsurface: nE(e.materials),
		texelBake: !1
	};
}
function bE(e, t, n) {
	let r = new Uint8Array(t.buffer, t.byteOffset, t.byteLength), i = e.createBuffer({
		label: n,
		size: Math.max(16, Math.ceil(r.byteLength / 4) * 4),
		usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
	});
	return e.queue.writeBuffer(i, 0, r), i;
}
function xE(e) {
	return new Uint32Array(e.data.buffer, e.data.byteOffset, Math.floor(e.data.byteLength / 4));
}
function SE(e, t, n = "uniform") {
	let r = $T(t.materials), i = iE(t.lights), a = qw(n, t.lights) === "tree" && i.count > 1, o = i.table.data, s = a ? o.length / 4 : 0, c = a ? aE(t.lights).data : /* @__PURE__ */ new Float32Array(), l = new Float32Array(o.length + c.length);
	l.set(o), l.set(c, o.length);
	let u = oE(t.environment), d = new Float32Array(u ? u.height + u.width * u.height : 4);
	u && (d.set(u.rows.data.subarray(0, u.height), 0), d.set(u.pixels.data.subarray(0, u.width * u.height), u.height));
	let f = tE(t.materials, r).data, p = f.length / 4, m = nE(t.materials) ? rE(t.materials).data : /* @__PURE__ */ new Float32Array(), h = new Float32Array(f.length + m.length);
	return h.set(f), h.set(m, f.length), {
		buffers: [
			bE(e, ZT(t.bvh).data, "bvh nodes"),
			bE(e, QT(t).data, "triangles"),
			bE(e, h, "materials"),
			bE(e, l, "lights"),
			bE(e, xE(r), "texture atlas"),
			bE(e, u?.colors ?? /* @__PURE__ */ new Float32Array(4), "environment colors"),
			bE(e, d, "environment tables")
		],
		lightCount: i.count,
		lightTreeBase: s,
		atlasWidth: r.width,
		subsurfaceOffset: p
	};
}
function CE(e, t, n, r, i) {
	let a = /* @__PURE__ */ new ArrayBuffer(PE), o = new Float32Array(a), s = new Int32Array(a), c = new Uint32Array(a), { sun: l } = e.lights, { environment: u } = e;
	o.set([...t.eye, 0], 0), o.set([...t.forward, 0], 4), o.set([...t.right, 0], 8), o.set([...t.above, 0], 12), o.set([...l?.direction ?? [
		0,
		1,
		0
	], 0], 16), o.set([...l?.color ?? [
		0,
		0,
		0
	], Math.cos(Math.PI / 360)], 20), o.set([
		u?.width ?? 1,
		u?.height ?? 1,
		u?.intensity ?? 1,
		u?.total ?? 1
	], 24), o.set([
		u?.cosine ?? 1,
		u?.sine ?? 0,
		e.surfaceOffset,
		e.farDistance
	], 28), o.set([
		t.halfWidth,
		t.halfHeight,
		n.fireflyClamp,
		r.lightTreeBase
	], 32), s.set([
		n.width,
		n.height,
		n.bounces,
		r.lightCount
	], 36), s.set([
		i,
		+!!l,
		+!!u,
		0
	], 40), c.set([
		n.seed >>> 0,
		r.atlasWidth,
		r.subsurfaceOffset,
		0
	], 44);
	let { volume: d } = e;
	return o.set([...d?.minimum ?? [
		0,
		0,
		0
	], d?.density ?? 0], 56), o.set([...d?.maximum ?? [
		0,
		0,
		0
	], d?.anisotropy ?? 0], 60), o.set([...d?.albedo ?? [
		1,
		1,
		1
	], d?.maxDistance ?? 0], 64), {
		unsigned: c,
		integers: s
	};
}
function wE(e, t, n, r, i, a, o) {
	let s = new Uint8Array(n.length * r * FE);
	return n.forEach((n, c) => {
		for (let l = 0; l < r; l++) {
			let u = new Uint32Array(s.buffer, (c * r + l) * FE, PE / 4);
			u.set(e.unsigned), u[UE] = t, u.set([
				n.start,
				n.count,
				l,
				i
			], WE), u[GE] = a, u[KE] = +!!o;
		}
	}), s;
}
function TE(e, t, n) {
	let r = Math.ceil(e / 8) * Math.ceil(t / 8) * 64, i = (9 + 3 * n) * 16, a = Math.min(r, Math.floor(Math.min(LE, RE / i) / 64) * 64), o = [];
	for (let e = 0; e < r; e += a) o.push({
		start: e,
		count: Math.min(a, r - e)
	});
	return {
		tiles: o,
		tilePaths: a,
		stateBytes: a * i
	};
}
function EE(e, t, n) {
	let r = {
		color: new Float32Array(t * 3),
		albedo: new Float32Array(t * 3),
		normal: new Float32Array(t * 3),
		depth: new Float32Array(t),
		variance: new Float32Array(t),
		samplesTaken: new Uint16Array(t).fill(n)
	}, i = t * 4, a = t * 8, o = t * 12;
	for (let s = 0; s < t; s++) {
		for (let t = 0; t < 3; t++) r.color[s * 3 + t] = e[s * 4 + t] / n, r.albedo[s * 3 + t] = e[i + s * 4 + t] / n, r.normal[s * 3 + t] = e[a + s * 4 + t] / n;
		r.depth[s] = e[s * 4 + 3] / n;
		let t = e[o + s * 4] / n;
		r.variance[s] = Math.max(0, e[o + s * 4 + 1] / n - t * t) / Math.max(n - 1, 1);
	}
	return r;
}
function DE(e, t, n, r, i, a, o) {
	let s = (e) => Math.ceil(e / 64), c = (n, r) => {
		e.setPipeline(t[n]), e.dispatchWorkgroups(r);
	};
	r.forEach((t, r) => {
		let l = (t) => e.setBindGroup(0, n, [(r * i + t) * FE]);
		l(0), c("generatePaths", s(t.count));
		for (let e = 0; e < i; e++) l(e), o && c("resetBins", s(Math.max(a, 1))), c("extendPaths", s(t.count)), o && (c("scanBins", 1), c("scatterPaths", s(t.count))), c("shadePaths", s(t.count)), c("shadowPaths", s(t.count));
		l(0), c("resolvePaths", s(t.count));
	});
}
async function OE(e, t, n, r) {
	let i = n.kernel ?? "megakernel";
	if (!ME.includes(i)) throw RangeError(`The WebGPU path tracer kernel must be one of ${ME.join(", ")}.`);
	let a = yE(e);
	if (i === "wavefront" && (a.hasVolume || a.hasSubsurface)) throw RangeError("The WebGPU wavefront kernel does not trace volume fog or subsurface scattering. Use the megakernel, the default.");
	let o = await hE(), { device: s } = o, { pipelines: c, compileSeconds: l } = await vE(o, {
		kernel: i,
		...a
	}), { width: u, height: d, samples: f } = n, p = u * d, m = p * 16;
	if (m * 4 > s.limits.maxStorageBufferBindingSize) throw RangeError(`A ${u} by ${d} image is too large for this WebGPU adapter. Lower the size or use backend "gpu".`);
	let h = SE(s, e, n.lightSelection), g = +!!e.lights.sun + h.lightCount + +!!e.environment, _ = Math.max(g, 1), v = e.materials.length, y = n.bounces + 1, b = i === "wavefront", x = n.sortByMaterial ?? !1, { tiles: S, tilePaths: C, stateBytes: w } = TE(u, d, _), T = b ? S.length * y : 1, E = s.createBuffer({
		label: "accumulation",
		size: m * 4,
		usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
	}), D = s.createBuffer({
		label: "parameters",
		size: T * FE,
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
	}), ee = s.createBuffer({
		label: "path state",
		size: b ? w : 16,
		usage: GPUBufferUsage.STORAGE
	}), O = 1 + 2 * v + C, te = s.createBuffer({
		label: "material bins",
		size: b ? O * 4 : 16,
		usage: GPUBufferUsage.STORAGE
	}), ne = s.createBindGroup({
		layout: o.bindGroupLayout,
		entries: [{
			binding: 0,
			resource: {
				buffer: D,
				size: PE
			}
		}, ...[
			...h.buffers,
			E,
			ee,
			te
		].map((e, t) => ({
			binding: t + 1,
			resource: { buffer: e }
		}))]
	}), re = CE(e, t, n, h, g);
	for (let e = 0; e < f; e++) {
		let t = wE(re, e, b ? S : [{
			start: 0,
			count: p
		}], b ? y : 1, v, _, x);
		s.queue.writeBuffer(D, 0, t);
		let n = s.createCommandEncoder(), i = n.beginComputePass();
		b ? DE(i, c, ne, S, y, v, x) : (i.setPipeline(c.main), i.setBindGroup(0, ne, [0]), i.dispatchWorkgroups(Math.ceil(u / 8), Math.ceil(d / 8))), i.end(), s.queue.submit([n.finish()]), await s.queue.onSubmittedWorkDone(), r();
	}
	let ie = s.createBuffer({
		size: m * 4,
		usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
	}), k = s.createCommandEncoder();
	k.copyBufferToBuffer(E, 0, ie, 0, m * 4), s.queue.submit([k.finish()]), await ie.mapAsync(GPUMapMode.READ);
	let ae = EE(new Float32Array(ie.getMappedRange()), p, f);
	ie.destroy();
	for (let e of [
		...h.buffers,
		E,
		D,
		ee,
		te
	]) e.destroy();
	return Object.assign(ae, {
		gpu: o.gpu,
		compileSeconds: l
	});
}
async function kE(e, t, n) {
	let r = await hE(), { device: i } = r, { pipelines: a, compileSeconds: o } = await vE(r, {
		kernel: "megakernel",
		...yE(e),
		realtime: n
	}), s = SE(i, e), c = +!!e.lights.sun + s.lightCount + +!!e.environment;
	return {
		device: i,
		gpu: r.gpu,
		compileSeconds: o,
		uploaded: s,
		bindGroupLayout: r.bindGroupLayout,
		pipeline: a.traceRealtime,
		parameterBytes: PE,
		parameterWords: (n) => CE(e, n, t, s, c).unsigned
	};
}
function AE(e, t) {
	let n = new Float32Array(Math.max(t, 1) * 4);
	for (let r = 0; r < t; r++) n.set(e.subarray(r * 3, r * 3 + 3), r * 4);
	return n;
}
async function jE(e, t, n, r) {
	let i = await hE(), { device: a } = i, { count: o, points: s, normals: c } = t, { samples: l, seed: u } = n, { pipelines: d, compileSeconds: f } = await vE(i, {
		kernel: "megakernel",
		...yE(e),
		texelBake: !0
	}), p = Math.max(o, 1) * 16 * 2;
	if (p > a.limits.maxStorageBufferBindingSize) throw RangeError(`${o} lightmap texels are too many for this WebGPU adapter. Lower the lightmap resolution or use backend "gpu".`);
	let m = SE(a, e), h = +!!e.lights.sun + m.lightCount + +!!e.environment, g = CE(e, {
		eye: [
			0,
			0,
			0
		],
		forward: [
			0,
			0,
			1
		],
		right: [
			1,
			0,
			0
		],
		above: [
			0,
			1,
			0
		],
		halfWidth: 1,
		halfHeight: 1
	}, {
		width: o,
		height: 1,
		seed: u,
		bounces: n.bounces - 1,
		fireflyClamp: n.fireflyClamp
	}, m, h);
	g.unsigned[qE] = l;
	let _ = a.createBuffer({
		label: "accumulation",
		size: p,
		usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
	}), v = a.createBuffer({
		label: "parameters",
		size: FE,
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
	}), y = [AE(s, o), AE(c, o)].map((e, t) => bE(a, e, t === 0 ? "texel points" : "texel normals")), b = a.createBindGroup({
		layout: i.bindGroupLayout,
		entries: [{
			binding: 0,
			resource: {
				buffer: v,
				size: PE
			}
		}, ...[
			...m.buffers,
			_,
			...y
		].map((e, t) => ({
			binding: t + 1,
			resource: { buffer: e }
		}))]
	}), x = Math.max(1, Math.ceil(o / 64)), S = Math.min(x, JE);
	for (let e = 0; e < l; e++) {
		a.queue.writeBuffer(v, 0, wE(g, e, [{
			start: 0,
			count: o
		}], 1, 0, 1, !1));
		let t = a.createCommandEncoder(), n = t.beginComputePass();
		n.setPipeline(d.bakeTexels), n.setBindGroup(0, b, [0]), n.dispatchWorkgroups(S, Math.ceil(x / S)), n.end(), a.queue.submit([t.finish()]), ((e + 1) % YE === 0 || e === l - 1) && (await a.queue.onSubmittedWorkDone(), r());
	}
	let C = a.createBuffer({
		size: p,
		usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
	}), w = a.createCommandEncoder();
	w.copyBufferToBuffer(_, 0, C, 0, p), a.queue.submit([w.finish()]), await C.mapAsync(GPUMapMode.READ);
	let T = new Float32Array(C.getMappedRange()), E = new Float32Array(o * 3), D = new Float32Array(o);
	for (let e = 0; e < o; e++) {
		for (let t = 0; t < 3; t++) E[e * 3 + t] = T[e * 4 + t] / l;
		D[e] = T[(o + e) * 4] / l;
	}
	C.destroy();
	for (let e of [
		...m.buffers,
		_,
		v,
		...y
	]) e.destroy();
	return {
		radiance: E,
		escaped: D,
		gpu: i.gpu,
		compileSeconds: f
	};
}
var ME, NE, PE, FE, IE, LE, RE, zE, BE, VE, HE, UE, WE, GE, KE, qE, JE, YE, XE = A((() => {
	NT(), vT(), uE(), ME = ["megakernel", "wavefront"], NE = "megakernel", PE = 272, FE = 512, IE = 10, LE = 1 << 19, RE = 1 << 27, zE = 1 << 30, BE = [
		"generatePaths",
		"resetBins",
		"extendPaths",
		"scanBins",
		"scatterPaths",
		"shadePaths",
		"shadowPaths",
		"resolvePaths"
	], VE = null, HE = 0, UE = 43, WE = 48, GE = 52, KE = 53, qE = 54, JE = 4096, YE = 16;
})), ZE = /* @__PURE__ */ j({
	BLUE_NOISE_CHANNELS: () => 4,
	BLUE_NOISE_SIZE: () => 64,
	createBlueNoiseTile: () => rD
});
function QE(e) {
	let t = e >>> 0 || 1;
	return () => {
		t = Math.imul(t, 747796405) + 2891336453 >>> 0;
		let e = Math.imul((t >>> (t >>> 28) + 4 ^ t) >>> 0, 277803737) >>> 0;
		return e = (e >>> 22 ^ e) >>> 0, (e >>> 8) / 16777216;
	};
}
function $E() {
	let e = /* @__PURE__ */ new Float64Array(361);
	for (let t = -9; t <= oD; t++) for (let n = -9; n <= oD; n++) e[(t + oD) * 19 + n + oD] = Math.exp(-(n * n + t * t) / (2 * aD * aD));
	return e;
}
function eD(e, t, n) {
	let r = t % 64, i = (t - r) / 64;
	for (let t = -9; t <= oD; t++) {
		let a = (i + t + 64) % 64 * 64;
		for (let i = -9; i <= oD; i++) e[a + (r + i + 64) % 64] += n * cD[(t + oD) * 19 + i + oD];
	}
}
function tD(e, t, n, r) {
	let i = -1, a = r ? -Infinity : Infinity;
	for (let o = 0; o < iD; o++) {
		if (t[o] === 1 !== n) continue;
		let s = e[o];
		(r ? s > a : s < a) && (a = s, i = o);
	}
	return i;
}
function nD(e) {
	let t = QE(e), n = new Uint8Array(iD), r = new Float64Array(iD), i = Array.from({ length: iD }, (e, t) => t);
	for (let e = 4095; e > 0; e--) {
		let n = Math.floor(t() * (e + 1));
		[i[e], i[n]] = [i[n], i[e]];
	}
	let a = Math.round(iD * sD);
	for (let e = 0; e < a; e++) n[i[e]] = 1, eD(r, i[e], 1);
	for (let e = 0; e < iD; e++) {
		let e = tD(r, n, !0, !0);
		n[e] = 0, eD(r, e, -1);
		let t = tD(r, n, !1, !1);
		if (n[t] = 1, eD(r, t, 1), t === e) break;
	}
	let o = new Uint16Array(iD), s = n.slice(), c = r.slice();
	for (let e = 409; e >= 0; e--) {
		let t = tD(r, n, !0, !0);
		n[t] = 0, eD(r, t, -1), o[t] = e;
	}
	n.set(s), r.set(c);
	for (let e = a; e < iD; e++) {
		let t = tD(r, n, !1, !1);
		n[t] = 1, eD(r, t, 1), o[t] = e;
	}
	return o;
}
function rD(e = 0) {
	let t = new Uint8Array(iD * 4);
	for (let n = 0; n < 4; n++) {
		let r = nD(Math.imul((e >>> 0) + 1, 2654435761) + n * 1663821227);
		for (let e = 0; e < iD; e++) t[e * 4 + n] = r[e] >> 4;
	}
	return t;
}
var iD, aD, oD, sD, cD, lD = A((() => {
	iD = 4096, aD = 1.5, oD = 9, sD = .1, cD = $E();
})), uD = /* @__PURE__ */ j({
	averageBuffers: () => xD,
	createBandState: () => ED,
	createTargets: () => yD,
	drawOneSample: () => DD,
	getContext: () => SD,
	getKernel: () => wD,
	gpuKernelCompileCount: () => CD,
	isGpuTracerAvailable: () => fD,
	readTarget: () => bD,
	releaseResources: () => TD,
	setSceneUniforms: () => vD,
	traceOnGpu: () => kD,
	traceTexelsOnGpu: () => AD,
	uploadScene: () => _D,
	withBlueNoiseTile: () => gD
});
function dD() {
	return typeof OffscreenCanvas == "function" ? new OffscreenCanvas(1, 1) : typeof document < "u" ? document.createElement("canvas") : null;
}
function fD() {
	let e = dD()?.getContext("webgl2");
	return e ? !!(e.getExtension("EXT_color_buffer_float") && e.getExtension("EXT_float_blend")) : !1;
}
function pD(e, t, n) {
	let r = e.createShader(t);
	if (e.shaderSource(r, n), e.compileShader(r), !e.getShaderParameter(r, e.COMPILE_STATUS)) throw Error(`The GPU path tracer shader did not compile: ${e.getShaderInfoLog(r)}`);
	return r;
}
function mD(e, t) {
	let n = e.createProgram();
	if (e.attachShader(n, pD(e, e.VERTEX_SHADER, UT)), e.attachShader(n, pD(e, e.FRAGMENT_SHADER, VT(t))), e.linkProgram(n), !e.getProgramParameter(n, e.LINK_STATUS)) throw Error(`The GPU path tracer program did not link: ${e.getProgramInfoLog(n)}`);
	return n;
}
function hD(e, t, n, r, i, a, o, s) {
	let c = e.createTexture();
	return FD.push(c), e.activeTexture(e.TEXTURE0 + t), e.bindTexture(e.TEXTURE_2D, c), e.pixelStorei(e.UNPACK_ALIGNMENT, 1), e.texImage2D(e.TEXTURE_2D, 0, n, a, o, 0, r, i, s), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.NEAREST), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.NEAREST), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), c;
}
async function gD(e) {
	if (e.samplingPattern !== "blue-noise-first") return e;
	let { BLUE_NOISE_SIZE: t, createBlueNoiseTile: n } = await Promise.resolve().then(() => (lD(), ZE));
	return {
		...e,
		blueNoiseTile: {
			size: t,
			bytes: n(e.seed ?? 0)
		}
	};
}
function _D(e, t, n, r = {}) {
	let i = $T(n.materials), a = iE(n.lights), o = oE(n.environment), s = ZT(n.bvh), c = QT(n), l = tE(n.materials, i), u = [
		["uNodes", s],
		["uTriangles", c],
		["uMaterials", l],
		["uLights", a.table]
	];
	nE(n.materials) && u.push(["uSubsurface", rE(n.materials)]), r.lightSelection === "tree" && u.push(["uLightTree", aE(n.lights)]);
	let d = 0, f = (n) => e.uniform1i(e.getUniformLocation(t, n), d++);
	for (let [t, n] of u) hD(e, d, e.RGBA32F, e.RGBA, e.FLOAT, n.width, n.height, n.data), f(t);
	hD(e, d, e.RGBA8, e.RGBA, e.UNSIGNED_BYTE, i.width, i.height, i.data), f("uAtlas");
	let p = o?.colors ?? /* @__PURE__ */ new Float32Array(4);
	hD(e, d, e.RGBA32F, e.RGBA, e.FLOAT, o?.width ?? 1, o?.height ?? 1, p), f("uEnvironment");
	let m = {
		width: 1,
		height: 1,
		data: /* @__PURE__ */ new Float32Array(1)
	};
	for (let [t, n] of [["uEnvironmentRows", o?.rows ?? m], ["uEnvironmentPixels", o?.pixels ?? m]]) hD(e, d, e.R32F, e.RED, e.FLOAT, n.width, n.height, n.data), f(t);
	return r.blueNoiseTile && (hD(e, d, e.RGBA8, e.RGBA, e.UNSIGNED_BYTE, r.blueNoiseTile.size, r.blueNoiseTile.size, r.blueNoiseTile.bytes), f("uBlueNoise")), {
		lightCount: a.count,
		nextUnit: d
	};
}
function vD(e, t, n, r, i, a) {
	let o = (n) => e.getUniformLocation(t, n), { sun: s } = n.lights, { environment: c, volume: l } = n;
	e.uniform3fv(o("uEye"), r.eye), e.uniform3fv(o("uForward"), r.forward), e.uniform3fv(o("uRight"), r.right), e.uniform3fv(o("uAbove"), r.above), e.uniform2f(o("uHalfSize"), r.halfWidth, r.halfHeight), e.uniform2i(o("uSize"), i.width, i.height), e.uniform1ui(o("uSeed"), i.seed >>> 0), e.uniform1i(o("uBounces"), i.bounces), e.uniform1f(o("uFireflyClamp"), i.fireflyClamp), e.uniform1f(o("uSurfaceOffset"), n.surfaceOffset), e.uniform1f(o("uFarDistance"), n.farDistance), e.uniform1i(o("uLightCount"), a), e.uniform1i(o("uEmitterCount"), +!!s + a + +!!c), e.uniform1i(o("uHasSun"), +!!s), e.uniform3fv(o("uSunDirection"), s?.direction ?? [
		0,
		1,
		0
	]), e.uniform3fv(o("uSunColor"), s?.color ?? [
		0,
		0,
		0
	]), e.uniform1f(o("uSunCosineMax"), Math.cos(s?.angularRadius ?? Math.PI / 360)), e.uniform1i(o("uHasEnvironment"), +!!c), e.uniform4f(o("uEnvironmentShape"), c?.width ?? 1, c?.height ?? 1, c?.intensity ?? 1, c?.total ?? 1), e.uniform2f(o("uEnvironmentRotation"), c?.cosine ?? 1, c?.sine ?? 0), e.uniform1i(o("uHasVolume"), +!!l), e.uniform3fv(o("uVolumeMinimum"), l?.minimum ?? [
		0,
		0,
		0
	]), e.uniform3fv(o("uVolumeMaximum"), l?.maximum ?? [
		0,
		0,
		0
	]), e.uniform3fv(o("uVolumeAlbedo"), l?.albedo ?? [
		1,
		1,
		1
	]), e.uniform3f(o("uVolumeShape"), l?.density ?? 0, l?.anisotropy ?? 0, l?.maxDistance ?? 0);
}
function yD(e, t, n) {
	let r = e.createFramebuffer();
	FD.push(r), e.bindFramebuffer(e.FRAMEBUFFER, r);
	let i = [];
	for (let r = 0; r < jD; r++) {
		let a = e.createTexture();
		FD.push(a), e.activeTexture(e.TEXTURE15), e.bindTexture(e.TEXTURE_2D, a), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA32F, t, n, 0, e.RGBA, e.FLOAT, null), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.NEAREST), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.NEAREST), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0 + r, e.TEXTURE_2D, a, 0), i.push(e.COLOR_ATTACHMENT0 + r);
	}
	if (e.drawBuffers(i), e.checkFramebufferStatus(e.FRAMEBUFFER) !== e.FRAMEBUFFER_COMPLETE) throw Error("The GPU path tracer cannot render to float targets here.");
	e.clearBufferfv(e.COLOR, 0, [
		0,
		0,
		0,
		0
	]);
	for (let t = 1; t < jD; t++) e.clearBufferfv(e.COLOR, t, [
		0,
		0,
		0,
		0
	]);
	return i;
}
function bD(e, t, n, r) {
	let i = new Float32Array(n * r * 4);
	return e.readBuffer(e.COLOR_ATTACHMENT0 + t), e.readPixels(0, 0, n, r, e.RGBA, e.FLOAT, i), i;
}
function xD(e, t, n, r) {
	let i = t * n, a = bD(e, 0, t, n), o = bD(e, 1, t, n), s = bD(e, 2, t, n), c = bD(e, 3, t, n), l = {
		color: new Float32Array(i * 3),
		albedo: new Float32Array(i * 3),
		normal: new Float32Array(i * 3),
		depth: new Float32Array(i),
		variance: new Float32Array(i),
		samplesTaken: new Uint16Array(i).fill(r)
	};
	for (let e = 0; e < i; e++) {
		for (let t = 0; t < 3; t++) l.color[e * 3 + t] = a[e * 4 + t] / r, l.albedo[e * 3 + t] = o[e * 4 + t] / r, l.normal[e * 3 + t] = s[e * 4 + t] / r;
		l.depth[e] = a[e * 4 + 3] / r;
		let t = c[e * 4] / r;
		l.variance[e] = Math.max(0, c[e * 4 + 1] / r - t * t) / Math.max(r - 1, 1);
	}
	return l;
}
function SD() {
	if (ID) return ID;
	let e = dD()?.getContext("webgl2", {
		antialias: !1,
		depth: !1,
		stencil: !1,
		alpha: !1,
		powerPreference: "high-performance"
	});
	if (!e) throw Error("The GPU path tracer needs WebGL2.");
	if (!e.getExtension("EXT_color_buffer_float") || !e.getExtension("EXT_float_blend")) throw Error("The GPU path tracer needs float render targets with blending.");
	let t = e.getExtension("WEBGL_debug_renderer_info");
	return ID = {
		gl: e,
		programs: /* @__PURE__ */ new Map(),
		gpu: t ? e.getParameter(t.UNMASKED_RENDERER_WEBGL) : "unknown"
	}, ID;
}
function CD() {
	return RD;
}
function wD(e, t = !1, n = {}) {
	let { gl: r, programs: i } = SD(), a = n.samplingPattern === "blue-noise-first", o = n.lightSelection === "importance", s = n.lightSelection === "tree", c = n.radianceCache === !0, l = `${e}:${t}:${a}:${o}:${c}:${s}`;
	if (!i.has(l)) {
		let n = performance.now(), u = mD(r, {
			hasSubsurface: e,
			texelBake: t,
			blueNoise: a,
			lightImportance: o,
			radianceCache: c,
			lightTree: s
		});
		r.getProgramParameter(u, r.LINK_STATUS), i.set(l, {
			program: u,
			compileSeconds: (performance.now() - n) / 1e3
		}), t || RD++;
	}
	return i.get(l);
}
function TD(e) {
	for (let t of FD) t instanceof WebGLFramebuffer ? e.deleteFramebuffer(t) : e.deleteTexture(t);
	FD.length = 0;
}
function ED(e) {
	return {
		bandRows: Math.min(e, 32),
		lastYield: performance.now()
	};
}
async function DD(e, t, n, r, i, a, o) {
	e.viewport(0, 0, n, r), e.enable(e.BLEND), e.blendFunc(e.ONE, e.ONE), e.enable(e.SCISSOR_TEST), e.uniform1i(e.getUniformLocation(t, "uSample"), i);
	let s = 0;
	for (; s < r;) {
		let t = Math.min(a.bandRows, r - s), i = s;
		s += t;
		let c = performance.now();
		e.scissor(0, i, n, t), e.drawArrays(e.TRIANGLES, 0, 3), e.finish();
		let l = (performance.now() - c) / 1e3, u = Math.min(2, MD / Math.max(l, 1e-4));
		a.bandRows = Math.max(ND, Math.min(r, Math.round(t * u))), o(), (performance.now() - a.lastYield) / 1e3 > PD && (await LD(), a.lastYield = performance.now());
	}
	e.disable(e.SCISSOR_TEST);
}
async function OD(e, t, n, r, i, a) {
	let o = ED(r);
	for (let s = 0; s < i; s++) await DD(e, t, n, r, s, o, a);
}
async function kD(e, t, n, r) {
	let i = await gD(n), a = {
		...i,
		lightSelection: qw(i.lightSelection, e.lights)
	}, { gl: o, gpu: s } = SD(), { program: c, compileSeconds: l } = wD(nE(e.materials), !1, a), { width: u, height: d, samples: f } = a;
	o.useProgram(c);
	let { lightCount: p } = _D(o, c, e, a);
	vD(o, c, e, t, a, p), yD(o, u, d), await OD(o, c, u, d, f, r);
	let m = xD(o, u, d, f);
	return TD(o), Object.assign(m, {
		gpu: s,
		compileSeconds: l
	});
}
async function AD(e, t, n, r) {
	let { gl: i, gpu: a } = SD(), { program: o, compileSeconds: s } = wD(nE(e.materials), !0), { count: c, points: l, normals: u } = t, { samples: d, seed: f } = n, p = Math.min(c, zD), m = Math.ceil(c / p);
	i.useProgram(o);
	let { lightCount: h, nextUnit: g } = _D(i, o, e);
	vD(i, o, e, {
		eye: [
			0,
			0,
			0
		],
		forward: [
			0,
			0,
			1
		],
		right: [
			1,
			0,
			0
		],
		above: [
			0,
			1,
			0
		],
		halfWidth: 1,
		halfHeight: 1
	}, {
		width: p,
		height: m,
		seed: f,
		bounces: n.bounces - 1,
		fireflyClamp: n.fireflyClamp
	}, h);
	let _ = (e, t, n) => {
		let r = new Float32Array(p * m * 4);
		for (let e = 0; e < c; e++) r.set(n.subarray(e * 3, e * 3 + 3), e * 4);
		hD(i, e, i.RGBA32F, i.RGBA, i.FLOAT, p, m, r), i.uniform1i(i.getUniformLocation(o, t), e);
	};
	_(g, "uTexelPoints", l), _(g + 1, "uTexelNormals", u), i.uniform1i(i.getUniformLocation(o, "uTexelCount"), c), i.uniform1i(i.getUniformLocation(o, "uSampleCount"), d), yD(i, p, m), await OD(i, o, p, m, d, r);
	let v = bD(i, 0, p, m), y = bD(i, 3, p, m);
	TD(i);
	let b = new Float32Array(c * 3), x = new Float32Array(c);
	for (let e = 0; e < c; e++) {
		for (let t = 0; t < 3; t++) b[e * 3 + t] = v[e * 4 + t] / d;
		x[e] = y[e * 4 + 2] / d;
	}
	return {
		radiance: b,
		escaped: x,
		gpu: a,
		compileSeconds: s
	};
}
var jD, MD, ND, PD, FD, ID, LD, RD, zD, BD = A((() => {
	vT(), YT(), uE(), jD = 4, MD = .08, ND = 4, PD = .25, FD = [], ID = null, LD = () => new Promise((e) => setTimeout(e, 0)), RD = 0, zD = 2048;
})), VD = /* @__PURE__ */ j({
	Cook: () => FO,
	LIGHT_SELECTIONS: () => kO,
	MAX_TRACE_PIXELS: () => gO,
	MAX_TRACE_RAY_WORK: () => _O,
	PATH_TRACER_DENOISERS: () => DO,
	PATH_TRACER_LIMITS: () => hO,
	SAMPLING_PATTERNS: () => OO,
	createCamera: () => JD,
	describeIgnoredFeatures: () => aO,
	normalizePathTracerOptions: () => KD,
	renderBand: () => cO,
	renderPathTracedImage: () => mO,
	toneMapToRgba8: () => iO
});
function HD(e) {
	return e.pattern?.type === "graph" && Object.hasOwn(e.pattern.graph ?? {}, "opacity");
}
function UD(e, t) {
	let n = hO[t], r = e[t] ?? n.fallback;
	if (!Number.isInteger(r) || r < n.minimum || r > n.maximum) throw RangeError(`Path tracer ${t} must be an integer from ${n.minimum} to ${n.maximum}.`);
	return r;
}
function WD(e, t) {
	let n = hO[t], r = e[t] ?? n.fallback;
	if (typeof r != "number" || !Number.isFinite(r) || r < n.minimum || r > n.maximum) throw RangeError(`Path tracer ${t} must be a number from ${n.minimum} to ${n.maximum}.`);
	return r;
}
function GD(e) {
	if (e === !0) return "wavelet";
	if (e === !1) return "none";
	if (DO.includes(e)) return e;
	throw TypeError(`Path tracer denoise must be a boolean or one of ${DO.join(", ")}.`);
}
function KD(e = {}) {
	if (typeof e != "object" || !e) throw TypeError("Path tracer options must be an object.");
	let t = {
		width: UD(e, "width"),
		height: UD(e, "height"),
		samples: UD(e, "samples"),
		bounces: UD(e, "bounces"),
		seed: UD(e, "seed"),
		threads: UD(e, "threads"),
		maxSeconds: WD(e, "maxSeconds"),
		fireflyClamp: WD(e, "fireflyClamp"),
		noiseThreshold: WD(e, "noiseThreshold"),
		denoiser: GD(e.denoise ?? !0),
		viewTransform: e.viewTransform ?? "aces",
		look: e.look ?? null,
		backend: e.backend ?? "cpu",
		samplingPattern: e.samplingPattern ?? "random",
		lightSelection: e.lightSelection ?? "auto"
	};
	if (t.denoise = t.denoiser !== "none", !cy.includes(t.viewTransform)) throw RangeError(`Path tracer viewTransform must be one of ${cy.join(", ")}.`);
	if (!AO.includes(t.backend)) throw TypeError("Path tracer backend must be \"cpu\", \"gpu\" or \"webgpu\".");
	if (!OO.includes(t.samplingPattern)) throw RangeError(`Path tracer samplingPattern must be one of ${OO.join(", ")}.`);
	if (!kO.includes(t.lightSelection)) throw RangeError(`Path tracer lightSelection must be one of ${kO.join(", ")}.`);
	if (t.backend !== "gpu" && t.samplingPattern !== "random") throw RangeError("Path tracer samplingPattern \"blue-noise-first\" needs backend \"gpu\"; the CPU reference and the WebGPU tracer draw random samples.");
	if (t.lightSelection === "importance" && t.backend !== "gpu") throw RangeError("Path tracer lightSelection \"importance\" needs backend \"gpu\"; the CPU reference and the WebGPU tracer pick lights uniformly; \"tree\" also runs on the WebGPU tracer.");
	if (t.width * t.height > 2073600) throw RangeError(`A path trace takes at most ${gO} pixels.`);
	if (t.width * t.height * t.samples * (t.bounces + 1) > 4e9) throw RangeError("This path trace would need too much ray work: lower the size, samples or bounces.");
	return t;
}
function qD(e, t) {
	if (!Array.isArray(e) || e.length !== 3 || e.some((e) => typeof e != "number" || !Number.isFinite(e))) throw TypeError(`Path tracer camera ${t} must be three finite numbers.`);
	return e;
}
function JD(e, t, n) {
	let r = qD(e.eye, "eye"), i = qD(e.target, "target"), a = qD(e.up ?? [
		0,
		1,
		0
	], "up");
	if (e.projection === "orthographic" || e.shift) throw RangeError("The path tracer draws perspective cameras without lens shift. Render those without the renderer option.");
	let o = e.focalLength === void 0 ? e.fov : Tx(e, t / n);
	if (typeof o != "number" || !(o > 1 && o < 170)) throw RangeError("Path tracer camera fov must be between 1 and 170 degrees.");
	let s = [
		i[0] - r[0],
		i[1] - r[1],
		i[2] - r[2]
	], c = Math.hypot(...s);
	if (c === 0) throw RangeError("Path tracer camera eye and target must differ.");
	for (let e = 0; e < 3; e++) s[e] /= c;
	let l = [
		s[1] * a[2] - s[2] * a[1],
		s[2] * a[0] - s[0] * a[2],
		s[0] * a[1] - s[1] * a[0]
	], u = Math.hypot(...l);
	if (u === 0) throw RangeError("Path tracer camera up must not be parallel to its view.");
	for (let e = 0; e < 3; e++) l[e] /= u;
	let d = [
		l[1] * s[2] - l[2] * s[1],
		l[2] * s[0] - l[0] * s[2],
		l[0] * s[1] - l[1] * s[0]
	], f = Math.tan(o * Math.PI / 360);
	return {
		eye: r,
		forward: s,
		right: l,
		above: d,
		halfHeight: f,
		halfWidth: f * t / n
	};
}
function YD() {
	let e = 1;
	return {
		reset(t, n, r) {
			let i = Math.imul(t + 2654435769, 2246822507) ^ Math.imul(n + 2135587861, 3266489909) ^ Math.imul(r + 374761393, 668265263);
			i = Math.imul(i ^ i >>> 15, 739982445), i = Math.imul(i ^ i >>> 12, 695872825), i ^= i >>> 15, e = i === 0 ? 1 : i;
		},
		next() {
			e = Math.imul(e, 747796405) + 2891336453 >>> 0;
			let t = Math.imul(e >>> (e >>> 28) + 4 ^ e, 277803737);
			return ((t >>> 22 ^ t) >>> 0) / 4294967296;
		}
	};
}
function XD() {
	return {
		distance: 0,
		material: null,
		point: /* @__PURE__ */ new Float64Array(3),
		normal: /* @__PURE__ */ new Float64Array(3),
		color: /* @__PURE__ */ new Float64Array(3),
		texel: /* @__PURE__ */ new Float64Array(4),
		mapTexel: /* @__PURE__ */ new Float64Array(4),
		emission: /* @__PURE__ */ new Float64Array(3),
		metallic: 0,
		roughness: 0,
		clearcoat: 0,
		transmission: 0
	};
}
function ZD(e, t, n, r) {
	let i = jO[0], a = jO[1], o = jO[2], s = jO[3], c = jO[4], l = jO[5], u = MO[0], d = MO[1], f = MO[2], p = MO[3], m = u * p - f * d;
	if (Math.abs(m) < 1e-12) return;
	let h = t.normal[0], g = t.normal[1], _ = t.normal[2], v = (i * p - s * d) / m, y = (a * p - c * d) / m, b = (o * p - l * d) / m, x = (s * u - i * f) / m, S = (c * u - a * f) / m, C = (l * u - o * f) / m, w = v * h + y * g + b * _;
	v -= h * w, y -= g * w, b -= _ * w;
	let T = Math.hypot(v, y, b);
	if (T === 0) return;
	v /= T, y /= T, b /= T;
	let E = g * b - _ * y, D = _ * v - h * b, ee = h * y - g * v, O = Math.hypot(E, D, ee) || 1, te = E * x + D * S + ee * C < 0 ? -1 : 1;
	E *= te / O, D *= te / O, ee *= te / O;
	let { mapTexel: ne } = t;
	QD(e.normalTexture, n, r, ne);
	let re = (ne[0] * 2 - 1) * e.normalScale[0], ie = (ne[1] * 2 - 1) * e.normalScale[1], k = ne[2] * 2 - 1, ae = v * re + E * ie + h * k, oe = y * re + D * ie + g * k, se = b * re + ee * ie + _ * k, ce = Math.hypot(ae, oe, se);
	ce > 1e-6 && (t.normal[0] = ae / ce, t.normal[1] = oe / ce, t.normal[2] = se / ce);
}
function QD(e, t, n, r) {
	let { width: i, height: a, data: o, colorLookup: s, repeat: c } = e, l = t * i - .5, u = n * a - .5, d = Math.floor(l), f = Math.floor(u), p = l - d, m = u - f;
	r[0] = 0, r[1] = 0, r[2] = 0, r[3] = 0;
	for (let e = 0; e < 4; e++) {
		let t = d + (e & 1), n = f + (e >> 1);
		t = c ? (t % i + i) % i : Math.max(0, Math.min(i - 1, t)), n = c ? (n % a + a) % a : Math.max(0, Math.min(a - 1, n));
		let l = (e & 1 ? p : 1 - p) * (e >> 1 ? m : 1 - m), u = (n * i + t) * 4;
		for (let e = 0; e < 3; e++) r[e] += l * (s ? s[o[u + e]] : o[u + e] / 255);
		r[3] += l * o[u + 3] / 255;
	}
}
function $D(e, t, n, r, i, a, o, s, c, l) {
	let { positions: u, normals: d, uvs: f, colors: p, indices: m } = e, h = m[t * 3], g = m[t * 3 + 1], _ = m[t * 3 + 2];
	l.distance = c, l.point[0] = n + a * c, l.point[1] = r + o * c, l.point[2] = i + s * c;
	let v = u[g * 3] - u[h * 3], y = u[g * 3 + 1] - u[h * 3 + 1], b = u[g * 3 + 2] - u[h * 3 + 2], x = u[_ * 3] - u[h * 3], S = u[_ * 3 + 1] - u[h * 3 + 1], C = u[_ * 3 + 2] - u[h * 3 + 2], w = l.point[0] - u[h * 3], T = l.point[1] - u[h * 3 + 1], E = l.point[2] - u[h * 3 + 2], D = v * v + y * y + b * b, ee = v * x + y * S + b * C, O = x * x + S * S + C * C, te = w * v + T * y + E * b, ne = w * x + T * S + E * C, re = D * O - ee * ee || 1, ie = (O * te - ee * ne) / re, k = (D * ne - ee * te) / re, ae = 1 - ie - k, oe = 0, se = 0, ce = 0, le = 0, ue = 0, de = 0, fe = 0, A = 0;
	NO[0] = h, NO[1] = g, NO[2] = _, PO[0] = ae, PO[1] = ie, PO[2] = k;
	for (let e = 0; e < 3; e++) {
		let t = NO[e], n = PO[e];
		oe += n * d[t * 3], se += n * d[t * 3 + 1], ce += n * d[t * 3 + 2], le += n * p[t * 3], ue += n * p[t * 3 + 1], de += n * p[t * 3 + 2], fe += n * f[t * 2], A += n * f[t * 2 + 1];
	}
	let pe = Math.hypot(oe, se, ce) || 1;
	l.normal[0] = oe / pe, l.normal[1] = se / pe, l.normal[2] = ce / pe;
	let j = e.materials[e.triangleMaterial[t]];
	l.material = j;
	let me = 1;
	return l.color[0] = j.color[0] * le, l.color[1] = j.color[1] * ue, l.color[2] = j.color[2] * de, j.texture && (QD(j.texture, fe, A, l.texel), l.color[0] *= l.texel[0], l.color[1] *= l.texel[1], l.color[2] *= l.texel[2], me = l.texel[3]), l.emission[0] = j.emission[0], l.emission[1] = j.emission[1], l.emission[2] = j.emission[2], j.emissiveTexture && (QD(j.emissiveTexture, fe, A, l.mapTexel), l.emission[0] *= l.mapTexel[0], l.emission[1] *= l.mapTexel[1], l.emission[2] *= l.mapTexel[2]), l.metallic = j.metallic, l.roughness = j.roughness, l.clearcoat = j.clearcoat, l.transmission = j.transmission, j.clearcoatTexture && (QD(j.clearcoatTexture, fe, A, l.mapTexel), l.clearcoat *= l.mapTexel[0]), j.transmissionTexture && (QD(j.transmissionTexture, fe, A, l.mapTexel), l.transmission *= l.mapTexel[0]), j.surfaceTexture && (QD(j.surfaceTexture, fe, A, l.mapTexel), l.roughness *= l.mapTexel[1], l.metallic *= l.mapTexel[2]), j.normalTexture && (jO[0] = v, jO[1] = y, jO[2] = b, jO[3] = x, jO[4] = S, jO[5] = C, MO[0] = f[g * 2] - f[h * 2], MO[1] = f[g * 2 + 1] - f[h * 2 + 1], MO[2] = f[_ * 2] - f[h * 2], MO[3] = f[_ * 2 + 1] - f[h * 2 + 1], ZD(j, l, fe, A)), me;
}
function eO(e, t, n, r, i, a, o, s) {
	let c = t, l = n, u = r, d = 0;
	for (let t = 0; t < vO; t++) {
		let t = e.tracer.trace(c, l, u, i, a, o, e.farDistance, !1);
		if (t.nearestTriangle < 0) return !1;
		let n = $D(e, t.nearestTriangle, c, l, u, i, a, o, t.nearestDistance, s);
		if (s.material.alphaCutoff === 0 || n >= s.material.alphaCutoff) return s.distance += d, !0;
		let r = t.nearestDistance + e.surfaceOffset;
		d += r, c += i * r, l += a * r, u += o * r;
	}
	return !1;
}
function tO(e, t, n, r, i, a, o, s, c) {
	let l = t, u = n, d = r, f = s, p = !0;
	for (let t = 0; t < vO; t++) {
		let t = e.tracer.trace(l, u, d, i, a, o, f, p);
		if (t.nearestTriangle < 0) return !1;
		if (e.materials[e.triangleMaterial[t.nearestTriangle]].alphaCutoff === 0 || $D(e, t.nearestTriangle, l, u, d, i, a, o, t.nearestDistance, c) >= c.material.alphaCutoff) return !0;
		if (p) {
			p = !1;
			continue;
		}
		let n = t.nearestDistance + e.surfaceOffset;
		if (f -= n, f <= 0) return !1;
		l += i * n, u += a * n, d += o * n;
	}
	return !0;
}
function nO(e) {
	return e * e * (3 - 2 * e);
}
function rO(e, t) {
	let n = TC(), r = XD(), i = XD(), a = /* @__PURE__ */ new Float64Array(3), o = /* @__PURE__ */ new Float64Array(3), s = /* @__PURE__ */ new Float64Array(3), c = /* @__PURE__ */ new Float64Array(3), l = /* @__PURE__ */ new Float64Array(3), u = /* @__PURE__ */ new Float64Array(3), d = /* @__PURE__ */ new Float64Array(9), f = /* @__PURE__ */ new Float64Array(3), p = /* @__PURE__ */ new Float64Array(3), m = {
		albedo: /* @__PURE__ */ new Float64Array(3),
		normal: /* @__PURE__ */ new Float64Array(3),
		depth: 0
	}, h = YD(), g = !1, { lights: _, environment: v } = e;
	_.sun && SC(_.sun.direction, d);
	let y = Math.cos(_.sun?.angularRadius ?? Ew);
	function b(e, n, r, i) {
		let a = n, s = r, c = i;
		if (e > 0) {
			let e = Math.max(n, r, i);
			if (e > t.fireflyClamp) {
				let n = t.fireflyClamp / e;
				a *= n, s *= n, c *= n;
			}
		}
		o[0] += a, o[1] += s, o[2] += c;
	}
	let x = !1, S = { pdf: 0 }, C = /* @__PURE__ */ new Float64Array(2), w = /* @__PURE__ */ new Float64Array(9), T = /* @__PURE__ */ new Float64Array(3);
	function E(t, n, r, i) {
		let { volume: a } = e;
		return !a || !tC(a, t, n, r, c[0], c[1], c[2], i, C) ? 1 : Math.exp(-a.density * (C[1] - C[0]));
	}
	function D(t, n, o) {
		let { volume: u } = e, d = c[0] * s[0] + c[1] * s[1] + c[2] * s[2], f = nC(u.anisotropy, d), [p, m, h] = r.point;
		if (tO(e, p, m, h, c[0], c[1], c[2], n, i)) return;
		S.pdf = f;
		let g = f * E(p, m, h, n) * o(S);
		b(t + 1, a[0] * l[0] * g, a[1] * l[1] * g, a[2] * l[2] * g);
	}
	function ee(t, o, s, u) {
		if (x) {
			D(t, s, u);
			return;
		}
		let d = o[0] * c[0] + o[1] * c[1] + o[2] * c[2];
		if (d <= 0) return;
		jC(n, c[0], c[1], c[2]);
		let f = n.value;
		if (f[0] + f[1] + f[2] <= 0) return;
		let p = r.point[0] + o[0] * e.surfaceOffset, m = r.point[1] + o[1] * e.surfaceOffset, h = r.point[2] + o[2] * e.surfaceOffset;
		if (tO(e, p, m, h, c[0], c[1], c[2], s, i)) return;
		let g = d * u(n) * E(p, m, h, s);
		b(t, a[0] * f[0] * l[0] * g, a[1] * f[1] * l[1] * g, a[2] * f[2] * l[2] * g);
	}
	let O = 1, te = () => 1 / O, ne = (e) => x || (r.material.lightMask >> e.bit & 1) == 1;
	function re(t, n) {
		if (!ne(_.sun)) return;
		let r = 1 - h.next() * (1 - y), i = Math.sqrt(Math.max(0, 1 - r * r)), a = 2 * Math.PI * h.next(), o = i * Math.cos(a), s = i * Math.sin(a);
		for (let e = 0; e < 3; e++) c[e] = d[e] * o + d[3 + e] * s + d[6 + e] * r;
		for (let e = 0; e < 3; e++) l[e] = _.sun.color[e];
		ee(t, n, e.farDistance, te);
	}
	function ie(e, t, n) {
		let i = e - r.point[0], a = t - r.point[1], o = n - r.point[2], s = i * i + a * a + o * o, l = Math.sqrt(s);
		return c[0] = i / l, c[1] = a / l, c[2] = o / l, {
			distance: l,
			distanceSquared: s
		};
	}
	function k(e, t) {
		let n = 2 * h.next() - 1, r = 2 * Math.PI * h.next(), i = Math.sqrt(1 - n * n);
		t[0] = e * i * Math.cos(r), t[1] = e * n, t[2] = e * i * Math.sin(r);
	}
	let ae = /* @__PURE__ */ new Float64Array(3);
	function oe(t, n, r) {
		if (!ne(r)) return;
		k(r.radius, ae);
		let { distance: i, distanceSquared: a } = ie(r.position[0] + ae[0], r.position[1] + ae[1], r.position[2] + ae[2]);
		if (i < 1e-6) return;
		let o = r.intensity * jx(a, r);
		for (let e = 0; e < 3; e++) l[e] = r.color[e] * o;
		ee(t, n, i - e.surfaceOffset, te);
	}
	function se(t, n, r) {
		if (!ne(r)) return;
		k(r.radius, ae);
		let { distance: i, distanceSquared: a } = ie(r.position[0] + ae[0], r.position[1] + ae[1], r.position[2] + ae[2]);
		if (i < 1e-6) return;
		let o = -(r.direction[0] * c[0] + r.direction[1] * c[1] + r.direction[2] * c[2]), s = o - r.cosineHalfAngle;
		if (s <= 0) return;
		let u = r.blend > 0 && s < r.blend ? nO(s / r.blend) : 1, d = r.intensity * jx(a, r) * u * (r.profile ? Hx(r.profile, o) : 1);
		for (let e = 0; e < 3; e++) l[e] = r.color[e] * d;
		ee(t, n, i - e.surfaceOffset, te);
	}
	function ce(t, n, r) {
		if (!ne(r)) return;
		let i = (h.next() - .5) * r.width, a = (h.next() - .5) * r.height, { distance: o, distanceSquared: s } = ie(r.position[0] + r.across[0] * i + r.along[0] * a, r.position[1] + r.across[1] * i + r.along[1] * a, r.position[2] + r.across[2] * i + r.along[2] * a);
		if (o < 1e-6) return;
		let u = -(r.normal[0] * c[0] + r.normal[1] * c[1] + r.normal[2] * c[2]);
		if (u <= 0) return;
		let d = r.intensity * u / s * (r.profile ? Hx(r.profile, u) : 1);
		for (let e = 0; e < 3; e++) l[e] = r.color[e] * d;
		ee(t, n, o - e.surfaceOffset, te);
	}
	let le = 0, ue = (e) => {
		let t = le * O, n = t * t + e.pdf * e.pdf;
		return t * t / n / t;
	};
	function de(t, n) {
		le = gC(v, h.next(), h.next(), h.next(), h.next(), c), le > 0 && (pC(v, c[0], c[1], c[2], l), ee(t, n, e.farDistance, ue));
	}
	let fe = +!!_.sun + _.points.length + _.spots.length + _.areas.length + +!!v;
	function A(e, t) {
		O = 1, _.sun && re(e, t);
		for (let n of _.points) oe(e, t, n);
		for (let n of _.spots) se(e, t, n);
		for (let n of _.areas) ce(e, t, n);
		v && de(e, t);
	}
	let pe = _.points.length + _.spots.length + _.areas.length, j = qw(t.lightSelection, _) === "tree" && pe > 1, me = j ? cT(_) : null, he = () => h.next();
	function ge(e, t, n) {
		return n < _.points.length ? oe(e, t, _.points[n]) : (n -= _.points.length, n < _.spots.length ? se(e, t, _.spots[n]) : ce(e, t, _.areas[n - _.spots.length]));
	}
	let _e = /* @__PURE__ */ new Map(), ve = () => [
		..._.points,
		..._.spots,
		..._.areas
	];
	function ye() {
		let e = x ? -1 : r.material.lightMask, t = _e.get(e);
		return t || (t = [], ve().forEach((n, r) => {
			(e >> n.bit & 1) == 1 && t.push(r);
		}), _e.set(e, t)), t;
	}
	function be(e, t) {
		let n = pe / fe, i = Math.floor(h.next() * fe);
		if (_.sun) {
			if (i === 0) return O = 1 / fe, re(e, t);
			i--;
		}
		if (i >= pe) return O = 1 / fe, de(e, t);
		let a = ye();
		if (a.length < pe) {
			if (O = 1 / fe, a.length === 0) return;
			O = n / a.length, ge(e, t, a[Math.floor(h.next() * a.length)]), O = 1 / fe;
			return;
		}
		let o = dT(me, r.point[0], r.point[1], r.point[2], t[0], t[1], t[2], he);
		O = 1 / fe, o.lightIndex < 0 || (O = n * o.probability, ge(e, t, o.lightIndex), O = 1 / fe);
	}
	function xe(e, t) {
		O = 1 / fe;
		let n = Math.floor(h.next() * fe);
		if (_.sun) {
			if (n === 0) return re(e, t);
			n--;
		}
		return n < _.points.length ? oe(e, t, _.points[n]) : (n -= _.points.length, n < _.spots.length ? se(e, t, _.spots[n]) : (n -= _.spots.length, n < _.areas.length ? ce(e, t, _.areas[n]) : de(e, t)));
	}
	function Se(e, t) {
		e === 0 && !(j && pe > 16) || fe <= 1 ? A(e, t) : j ? be(e, t) : xe(e, t);
	}
	function Ce(e, t, n) {
		if (!v) return;
		pC(v, s[0], s[1], s[2], u);
		let r = 1;
		if (!n) {
			let e = hC(v, s[0], s[1], s[2]) * O;
			r = t * t / (t * t + e * e);
		}
		b(e, a[0] * u[0] * r, a[1] * u[1] * r, a[2] * u[2] * r);
	}
	function we(e, t) {
		m.albedo[0] = t ? 1 : r.color[0], m.albedo[1] = t ? 1 : r.color[1], m.albedo[2] = t ? 1 : r.color[2], m.normal[0] = e[0], m.normal[1] = e[1], m.normal[2] = e[2], m.depth = r.distance;
	}
	function Te(e) {
		if (e < xO) return !0;
		let t = Math.min(.95, Math.max(.05, Math.max(a[0], a[1], a[2])));
		if (h.next() >= t) return !1;
		for (let e = 0; e < 3; e++) a[e] /= t;
		return !0;
	}
	function Ee(t, n, i, a) {
		let { volume: o } = e;
		if (!tC(o, t, n, i, s[0], s[1], s[2], a, C)) return !1;
		let c = C[0] - Math.log(1 - h.next()) / o.density;
		return c >= C[1] ? !1 : (r.point[0] = t + s[0] * c, r.point[1] = n + s[1] * c, r.point[2] = i + s[2] * c, !0);
	}
	function De(t) {
		let { volume: n } = e;
		for (let e = 0; e < 3; e++) a[e] *= n.albedo[e];
		x = !0, Se(t, p), x = !1;
		let r = rC(n.anisotropy, h.next()), i = Math.sqrt(Math.max(0, 1 - r * r)), o = 2 * Math.PI * h.next();
		SC(s, w);
		for (let e = 0; e < 3; e++) T[e] = w[e] * i * Math.cos(o) + w[3 + e] * i * Math.sin(o) + w[6 + e] * r;
		for (let e = 0; e < 3; e++) s[e] = T[e];
		return nC(n.anisotropy, r);
	}
	let Oe = e.localVolumes ? sC(e.localVolumes) : null, ke = /* @__PURE__ */ new Float64Array(3), Ae = YC(e, h, eO), je = /* @__PURE__ */ new Float64Array(3);
	function Me(e, t) {
		let o = t.color ?? r.color;
		je.fill(1);
		let s = Ae(t, o, r.point[0], r.point[1], r.point[2], p, r.material, i, je);
		if (s === QC.lost) return !1;
		let c = n.diffuseShare * t.weight / n.subsurfaceChance;
		if (s === QC.exit) {
			let e = i.normal[0] * Ae.direction[0] + i.normal[1] * Ae.direction[1] + i.normal[2] * Ae.direction[2] < 0 ? -1 : 1;
			for (let t = 0; t < 3; t++) r.point[t] = i.point[t], p[t] = i.normal[t] * e;
			for (let e = 0; e < 3; e++) a[e] *= je[e] * c;
		} else {
			if (h.next() < .5) for (let e = 0; e < 3; e++) p[e] = -p[e];
			for (let e = 0; e < 3; e++) a[e] *= o[e] * c;
		}
		return kC(n, p), Se(e, p), !0;
	}
	function Ne(i, c, l, u, d, _, v, y) {
		h.reset(v, y, t.seed), o[0] = 0, o[1] = 0, o[2] = 0, a[0] = 1, a[1] = 1, a[2] = 1, m.albedo.fill(1), g = !1, m.normal[0] = 0, m.normal[1] = 0, m.normal[2] = 1, m.depth = 0, s[0] = u, s[1] = d, s[2] = _;
		let x = i, S = c, C = l, w = 0, T = !0;
		for (let i = 0; i <= t.bounces; i++) {
			let t = eO(e, x, S, C, s[0], s[1], s[2], r), o = e.volume && Ee(x, S, C, t ? r.distance : e.farDistance);
			if (Oe) {
				let n = o ? Math.hypot(r.point[0] - x, r.point[1] - S, r.point[2] - C) : t ? r.distance : e.farDistance;
				Oe(x, S, C, s[0], s[1], s[2], n, h.next(), a, ke), b(i, ke[0], ke[1], ke[2]);
			}
			if (o) {
				if (w = De(i), T = !1, x = r.point[0], S = r.point[1], C = r.point[2], !Te(i)) break;
				continue;
			}
			if (!t) {
				Ce(i, w, T);
				break;
			}
			let c = r.material, l = r.normal[0] * s[0] + r.normal[1] * s[1] + r.normal[2] * s[2] < 0, u = l ? 1 : -1;
			p[0] = r.normal[0] * u, p[1] = r.normal[1] * u, p[2] = r.normal[2] * u;
			let d = r.transmission > 0 && h.next() < r.transmission;
			g ||= (we(p, d), !0), b(i, a[0] * r.emission[0], a[1] * r.emission[1], a[2] * r.emission[2]);
			let m = -s[0], _ = -s[1], v = -s[2];
			if (d) {
				let e = xC(r.roughness);
				if (!IC(p, m, _, v, l, c.ior, e, h.next(), h.next(), h.next(), s)) break;
				s[0] * p[0] + s[1] * p[1] + s[2] * p[2] < 0 && (a[0] *= r.color[0], a[1] *= r.color[1], a[2] *= r.color[2]), T = !0;
			} else {
				DC(n, c, r.metallic, r.roughness, r.color, p, m, _, v, r.clearcoat);
				let e = c.subsurface;
				e && OC(n, e.weight), Se(i, p);
				let t = h.next();
				if (e) {
					if (t < n.subsurfaceChance) {
						if (!Me(i, e)) break;
						t = 0;
					} else t -= n.subsurfaceChance;
				}
				let o = NC(n, t, h.next(), h.next(), s), l = s[0] * p[0] + s[1] * p[1] + s[2] * p[2];
				if (l <= 0) break;
				if (o) {
					PC(n, f);
					for (let e = 0; e < 3; e++) a[e] *= f[e];
					T = !0;
				} else {
					if (jC(n, s[0], s[1], s[2]), !(n.pdf > 0)) break;
					for (let e = 0; e < 3; e++) a[e] *= n.value[e] * l / n.pdf;
					w = n.pdf, T = !1;
				}
			}
			if (x = r.point[0] + s[0] * e.surfaceOffset, S = r.point[1] + s[1] * e.surfaceOffset, C = r.point[2] + s[2] * e.surfaceOffset, !Te(i)) break;
		}
	}
	return {
		trace: Ne,
		radiance: o,
		features: m
	};
}
function iO(e, t, n, { viewTransform: r = "aces", look: i = null } = {}) {
	let a = new Uint8ClampedArray(t * n * 4), o = r === "aces" && !i;
	for (let s = 0; s < t * n; s++) {
		let t = o ? [
			0,
			1,
			2
		].map((t) => Pw(e[s * 3 + t]) ** (1 / 2.2)) : Vw([
			e[s * 3],
			e[s * 3 + 1],
			e[s * 3 + 2]
		], {
			viewTransform: r,
			look: i
		});
		for (let e = 0; e < 3; e++) a[s * 4 + e] = Math.round(t[e] * 255);
		a[s * 4 + 3] = 255;
	}
	return a;
}
function aO(e, t) {
	let n = /* @__PURE__ */ new Set(), r = t?.volumeFog;
	r?.density > 0 && (r.noiseAmount ?? .5) > 0 && n.add("volumeFog is traced as a uniform medium: noiseAmount, noiseScale and drift are ignored."), r?.density > 0 && r.ambient && n.add("volumeFog.ambient is not added: the fog is lit by the traced lights and sky."), t?.map || n.add("There is no environment map, so the sky is black and only the lights shine.");
	for (let t of e) {
		let e = t.material ?? {};
		for (let t of TO) e[t] && n.add(`${t} is ignored.`);
		e.tag && e.tag !== "surface" && n.add(`${e.tag} materials are traced as plain surfaces.`), e.alphaMode === "blend" && n.add(HD(e) ? "A graph opacity output is traced as a cutout at 0.5." : "Blended transparency is traced as opaque."), (e.layerMaps?.clearcoatTexture || e.transmissionMap) && n.add("Graph clearcoat and transmission masks are read by the CPU tracer; the GPU tracers use the factors.");
		for (let [t, r] of EO) r(e) && n.add(`${t} is ignored.`);
	}
	return [...n];
}
function oO(e, t, n, r) {
	let i = e / n, a = Math.max(0, t / n - i * i) * n / (n - 1);
	return Math.sqrt(a / n) < r * (i + wO);
}
function sO(e, t) {
	return !(t.noiseThreshold > 0) || e < SO ? !1 : (e - SO) % CO === 0;
}
function cO(e, t, n, r, i, a = () => {}) {
	let o = rO(e, n), { width: s, height: c, samples: l } = n, u = (i - r) * s, d = new Float32Array(u * 3), f = new Float32Array(u * 3), p = new Float32Array(u * 3), m = new Float32Array(u), h = new Float32Array(u), g = new Uint16Array(u);
	for (let e = r; e < i; e++) {
		a();
		for (let i = 0; i < s; i++) {
			let a = e * s + i, u = (e - r) * s + i, _ = 0, v = 0, y = 0;
			for (; y < l;) {
				let r = y, l = lO(a, r, n.seed, 1), h = lO(a, r, n.seed, 2), g = ((i + l) / s * 2 - 1) * t.halfWidth, b = (1 - (e + h) / c * 2) * t.halfHeight, x = t.forward[0] + t.right[0] * g + t.above[0] * b, S = t.forward[1] + t.right[1] * g + t.above[1] * b, C = t.forward[2] + t.right[2] * g + t.above[2] * b, w = Math.hypot(x, S, C);
				o.trace(t.eye[0], t.eye[1], t.eye[2], x / w, S / w, C / w, a, r);
				let { radiance: T, features: E } = o, D = fC(T[0], T[1], T[2]);
				_ += D, v += D * D;
				for (let e = 0; e < 3; e++) d[u * 3 + e] += T[e], f[u * 3 + e] += E.albedo[e], p[u * 3 + e] += E.normal[e];
				if (m[u] += E.depth, y++, sO(y, n) && oO(_, v, y, n.noiseThreshold)) break;
			}
			for (let e = 0; e < 3; e++) d[u * 3 + e] /= y, f[u * 3 + e] /= y, p[u * 3 + e] /= y;
			m[u] /= y;
			let b = _ / y;
			h[u] = Math.max(0, v / y - b * b) / Math.max(y - 1, 1), g[u] = y;
		}
	}
	return {
		color: d,
		albedo: f,
		normal: p,
		depth: m,
		variance: h,
		samplesTaken: g
	};
}
function lO(e, t, n, r) {
	let i = Math.imul(e ^ 1374496523, 2654435761) ^ Math.imul(t + r * 1663821227, 2246822507) ^ Math.imul(n + 461845907, 3266489909);
	return i = Math.imul(i ^ i >>> 16, 2146121005), i = Math.imul(i ^ i >>> 15, 2221713035), i ^= i >>> 16, (i >>> 0) / 4294967296;
}
function uO(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) t += e[n];
	return t;
}
function dO(e, t) {
	for (let n = 0; n < t; n++) {
		let t = Math.hypot(e[n * 3], e[n * 3 + 1], e[n * 3 + 2]);
		if (t !== 0) for (let r = 0; r < 3; r++) e[n * 3 + r] /= t;
	}
}
function fO(e, t, n, r) {
	let i = n * r;
	for (let n of [
		"color",
		"albedo",
		"normal"
	]) e[n].set(t[n], i * 3);
	for (let n of [
		"depth",
		"variance",
		"samplesTaken"
	]) e[n].set(t[n], i);
}
function pO(e, t, n, r, i) {
	let a = Math.ceil(n.height / yO), o = Math.min(n.threads, a), s = [], { tracer: c, ...l } = e;
	return new Promise((e, c) => {
		let u = 0, d = 0, f = !1, p = (t) => {
			if (!f) {
				f = !0, clearInterval(m);
				for (let e of s) e.terminate();
				t ? c(t) : e();
			}
		}, m = setInterval(() => {
			try {
				i();
			} catch (e) {
				p(e);
			}
		}, 250), h = (e) => {
			if (u >= a) return;
			let t = u * yO;
			u++, e.postMessage({
				type: "band",
				rowStart: t,
				rowEnd: Math.min(t + yO, n.height)
			});
		};
		for (let e = 0; e < o; e++) {
			let e = new Worker(new URL(bO, import.meta.url), { type: "module" });
			s.push(e), e.onerror = (e) => p(/* @__PURE__ */ Error(`Path tracer worker failed: ${e.message}`)), e.onmessage = (t) => {
				t.data.type === "ready" ? h(e) : (fO(r, t.data.band, t.data.rowStart, n.width), d++, d === a ? p() : h(e));
			}, e.postMessage({
				type: "scene",
				scene: l,
				camera: t,
				options: n
			});
		}
	});
}
async function mO({ parts: e, environment: t = {}, camera: n }, r = {}) {
	let i = KD(r), a = performance.now(), o = () => {
		if ((performance.now() - a) / 1e3 > i.maxSeconds) throw Error(`The path trace passed its ${i.maxSeconds} second limit and was stopped.`);
	}, { width: s, height: c } = i, l = JD(n, s, c), u = Cw(e, t);
	i.backend !== "cpu" && xw(u, `backend "${i.backend}"`);
	let d = s * c, f = {
		color: new Float32Array(d * 3),
		albedo: new Float32Array(d * 3),
		normal: new Float32Array(d * 3),
		depth: new Float32Array(d),
		variance: new Float32Array(d),
		samplesTaken: new Uint16Array(d)
	}, p = typeof Worker == "function" ? i.threads : 1, m = null, h = 0, g = 0;
	if (i.backend === "gpu" || i.backend === "webgpu") {
		let { traceOnGpu: e, gpuKernelCompileCount: t } = await (i.backend === "webgpu" ? Promise.resolve().then(() => (XE(), dE)) : Promise.resolve().then(() => (BD(), uD))), n = await e(u, l, i, o);
		m = n.gpu, h = n.compileSeconds, g = t(), fO(f, n, 0, s);
	} else p > 1 ? await pO(u, l, {
		...i,
		threads: p
	}, f, o) : fO(f, cO(u, l, i, 0, c, o), 0, s);
	o();
	let _ = (performance.now() - a) / 1e3;
	dO(f.normal, d);
	let { samplesTaken: v, ...y } = f, b = i.denoiser === "wavelet" ? vx({
		width: s,
		height: c,
		...y
	}) : f.color;
	return {
		width: s,
		height: c,
		linear: b,
		rgba: iO(b, s, c, i),
		features: y,
		report: {
			width: s,
			height: c,
			samples: i.samples,
			bounces: i.bounces,
			seed: i.seed,
			denoised: i.denoiser === "wavelet",
			denoiser: i.denoiser,
			threads: p,
			backend: i.backend,
			...m ? {
				gpu: m,
				gpuCompileSeconds: h,
				gpuKernelCompiles: g
			} : {},
			averageSamples: uO(v) / d,
			noiseThreshold: i.noiseThreshold,
			triangles: u.indices.length / 3,
			tracedSeconds: _,
			seconds: (performance.now() - a) / 1e3,
			ignored: aO(e, t)
		}
	};
}
var hO, gO, _O, vO, yO, bO, xO, SO, CO, wO, TO, EO, DO, OO, kO, AO, jO, MO, NO, PO, FO, IO = A((() => {
	Ex(), Ix(), qx(), Mw(), wx(), Kw(), uy(), KC(), vT(), $C(), dC(), hO = Object.freeze({
		width: Object.freeze({
			minimum: 16,
			maximum: 4096,
			fallback: 960
		}),
		height: Object.freeze({
			minimum: 16,
			maximum: 4096,
			fallback: 540
		}),
		samples: Object.freeze({
			minimum: 1,
			maximum: 1024,
			fallback: 64
		}),
		bounces: Object.freeze({
			minimum: 1,
			maximum: 16,
			fallback: 8
		}),
		maxSeconds: Object.freeze({
			minimum: 1,
			maximum: 1800,
			fallback: 300
		}),
		fireflyClamp: Object.freeze({
			minimum: 1,
			maximum: 1e3,
			fallback: 20
		}),
		noiseThreshold: Object.freeze({
			minimum: 0,
			maximum: 1,
			fallback: 0
		}),
		seed: Object.freeze({
			minimum: 0,
			maximum: 2 ** 31 - 1,
			fallback: 0
		}),
		threads: Object.freeze({
			minimum: 1,
			maximum: 8,
			fallback: 4
		})
	}), gO = 2073600, _O = 4e9, vO = 64, yO = 8, bO = "./path-tracer-worker.js", xO = 3, SO = 16, CO = 8, wO = .05, TO = ["occlusionMap"], EO = [
		["anisotropy", (e) => e.anisotropy > 0],
		["iridescence", (e) => e.iridescence > 0],
		["sheen", (e) => (e.sheenColor ?? []).some((e) => e !== 0)],
		["moss", (e) => e.moss > 0],
		["splat layers", (e) => !!(e.layers || Object.keys(e.layerMaps ?? {}).some((e) => e !== "clearcoatTexture"))],
		["lightMap", (e) => !!e.lightMap]
	], DO = Object.freeze([
		"wavelet",
		"oidn",
		"none"
	]), OO = Object.freeze(["random", "blue-noise-first"]), kO = Object.freeze([
		"auto",
		"uniform",
		"importance",
		"tree"
	]), AO = [
		"cpu",
		"gpu",
		"webgpu"
	], jO = /* @__PURE__ */ new Float64Array(6), MO = /* @__PURE__ */ new Float64Array(4), NO = /* @__PURE__ */ new Uint32Array(3), PO = /* @__PURE__ */ new Float64Array(3), FO = mO;
})), LO = /* @__PURE__ */ j({
	PNG_SIGNATURE: () => GO,
	encodePng: () => WO,
	pngChunk: () => HO
});
function RO() {
	let e = /* @__PURE__ */ new Uint32Array(256);
	for (let t = 0; t < 256; t++) {
		let n = t;
		for (let e = 0; e < 8; e++) n = n & 1 ? 3988292384 ^ n >>> 1 : n >>> 1;
		e[t] = n >>> 0;
	}
	return e;
}
function zO(e) {
	let t = 4294967295;
	for (let n of e) t = qO[(t ^ n) & 255] ^ t >>> 8;
	return (t ^ 4294967295) >>> 0;
}
function BO(e) {
	let t = 1, n = 0;
	for (let r = 0; r < e.length; r++) t = (t + e[r]) % 65521, n = (n + t) % 65521;
	return (n << 16 | t) >>> 0;
}
function VO(e) {
	let t = Math.max(1, Math.ceil(e.length / KO)), n = new Uint8Array(2 + e.length + t * 5 + 4), r = new DataView(n.buffer);
	n[0] = 120, n[1] = 1;
	let i = 2;
	for (let a = 0; a < t; a++) {
		let o = a * KO, s = Math.min(KO, e.length - o);
		n[i] = +(a === t - 1), r.setUint16(i + 1, s, !0), r.setUint16(i + 3, ~s & 65535, !0), n.set(e.subarray(o, o + s), i + 5), i += 5 + s;
	}
	return r.setUint32(i, BO(e)), n;
}
function HO(e, t) {
	let n = new Uint8Array(12 + t.length), r = new DataView(n.buffer);
	r.setUint32(0, t.length);
	for (let t = 0; t < 4; t++) n[4 + t] = e.charCodeAt(t);
	return n.set(t, 8), r.setUint32(8 + t.length, zO(n.subarray(4, 8 + t.length))), n;
}
function UO(e) {
	for (let t = 3; t < e.length; t += 4) if (e[t] !== 255) return !0;
	return !1;
}
function WO(e, t, n, { flipRows: r = !1 } = {}) {
	let i = UO(e), a = i ? 4 : 3, o = t * a, s = new Uint8Array((o + 1) * n);
	for (let c = 0; c < n; c++) {
		let l = r ? n - 1 - c : c, u = c * (o + 1);
		s[u] = 0;
		for (let n = 0; n < t; n++) {
			let r = (l * t + n) * 4, o = u + 1 + n * a;
			s[o] = e[r], s[o + 1] = e[r + 1], s[o + 2] = e[r + 2], i && (s[o + 3] = e[r + 3]);
		}
	}
	let c = /* @__PURE__ */ new Uint8Array(13), l = new DataView(c.buffer);
	l.setUint32(0, t), l.setUint32(4, n), c[8] = 8, c[9] = i ? 6 : 2;
	let u = [
		Uint8Array.from(GO),
		HO("IHDR", c),
		HO("IDAT", VO(s)),
		HO("IEND", /* @__PURE__ */ new Uint8Array())
	], d = new Uint8Array(u.reduce((e, t) => e + t.length, 0)), f = 0;
	for (let e of u) d.set(e, f), f += e.length;
	return d;
}
var GO, KO, qO, JO = A((() => {
	GO = [
		137,
		80,
		78,
		71,
		13,
		10,
		26,
		10
	], KO = 65535, qO = RO();
}));
// scripts/agent-native-trace.mjs
async function YO(e) {
	try {
		return await e(ok);
	} catch {
		for (let t of sk) if (D(w(t))) try {
			return await e(t.href);
		} catch {
			return null;
		}
		return null;
	}
}
function XO({ importPackage: e = (e) => import(e) } = {}) {
	let t, n = null;
	return {
		async find() {
			if (process.env.JS67_NATIVE_TRACER === "off") return { reason: "renderer.backend \"native\" is switched off by JS67_NATIVE_TRACER=off." };
			t ??= YO(e).then((e) => e ? e.findNativeAddon() ? { tracer: e } : { reason: `renderer.backend "native" needs the built binary of ${ok} (npm run build in that package).` } : { reason: `renderer.backend "native" needs ${ok}.` });
			let r = await t;
			return n ? { reason: n } : r;
		},
		markUnusable(e) {
			n = `renderer.backend "native" could not trace (${e}), which usually means no Vulkan ray query adapter.`;
		}
	};
}
async function ZO({ requested: e, runtimeBackend: t, locator: n }) {
	if (e !== "native") return { backend: e };
	let r = await n.find();
	if (r.tracer) return {
		backend: "native",
		tracer: r.tracer
	};
	let i = t === "cpu" ? "cpu" : "gpu";
	return {
		backend: i,
		note: `${r.reason} The ${i} backend ran instead.`
	};
}
function QO(e) {
	let t = { triangleCount: e.triangleCount };
	for (let n of ck) {
		let r = Buffer.from(e.tables[n], "base64"), i = lk[n], a = new Uint8Array(r.length);
		a.set(r), t[n] = new i(a.buffer, 0, a.length / i.BYTES_PER_ELEMENT);
	}
	return t;
}
function $O(e) {
	for (let t = 0; t < e.length; t += 3) {
		let n = Math.hypot(e[t], e[t + 1], e[t + 2]);
		n > 1e-6 && (e[t] /= n, e[t + 1] /= n, e[t + 2] /= n);
	}
}
function ek(e, t) {
	let n = new Float32Array(t * 3);
	for (let r = 0; r < t; r++) n.set(e.subarray(r * 4, r * 4 + 3), r * 3);
	return n;
}
async function tk({ tracer: e, exported: t, width: n, height: r, samples: i, bounces: a, seed: o, denoise: s, denoiser: c, maxSeconds: l, noiseThreshold: u = 0 }) {
	let d = performance.now(), f = e.traceNative(QO(t), {
		width: n,
		height: r,
		samples: i,
		maxSeconds: l
	}), p = (performance.now() - d) / 1e3, m = n * r, h = {
		color: ek(f.rgba, m),
		albedo: f.albedo,
		normal: f.normal,
		depth: f.depth,
		variance: f.variance
	};
	$O(h.normal);
	let g = {
		width: n,
		height: r,
		samples: i,
		bounces: a,
		seed: o,
		denoised: !1,
		denoiser: "none",
		threads: 1,
		backend: "native",
		gpu: f.adapter,
		nativeBackend: f.backend,
		nativeFeatures: f.features,
		setupSeconds: f.setupSeconds,
		compileSeconds: f.compileSeconds,
		uploadSeconds: f.uploadSeconds,
		accelerationBuildSeconds: f.accelerationBuildSeconds,
		averageSamples: f.averageSamples ?? i,
		noiseThreshold: u,
		triangles: t.triangles,
		tracedSeconds: p,
		ignored: t.ignored
	}, _ = h.color, v = performance.now();
	if (s === "oidn") try {
		_ = await c.denoiseWithOidn({
			width: n,
			height: r,
			color: h.color,
			albedo: h.albedo,
			normal: h.normal
		}), Object.assign(g, {
			denoised: !0,
			denoiser: "oidn",
			oidnVersion: c.OIDN_VERSION
		});
	} catch (e) {
		g.denoiserNote = `OIDN failed (${e.message}): the wavelet filter ran instead.`, s = "wavelet";
	}
	if (s === "wavelet") {
		let { denoiseRadiance: e } = await Promise.resolve().then(() => (wx(), fx));
		_ = e({
			width: n,
			height: r,
			...h
		}), Object.assign(g, {
			denoised: !0,
			denoiser: "wavelet"
		});
	}
	g.denoised && (g.denoiseSeconds = (performance.now() - v) / 1e3);
	let [{ toneMapToRgba8: y }, { encodePng: b }] = await Promise.all([Promise.resolve().then(() => (IO(), VD)), Promise.resolve().then(() => (JO(), LO))]), x = b(y(_, n, r), n, r);
	return g.seconds = (performance.now() - d) / 1e3, {
		data: Buffer.from(x).toString("base64"),
		report: g
	};
}
function nk(e) {
	return Buffer.from(e.buffer, e.byteOffset, e.byteLength).toString("base64");
}
function rk(e) {
	let t = Buffer.from(e, "base64"), n = new Uint8Array(t.length);
	return n.set(t), new Float32Array(n.buffer, 0, n.length / Float32Array.BYTES_PER_ELEMENT);
}
function ik({ tracer: e, request: t, maxSeconds: n }) {
	let r = {
		count: t.texelCount,
		points: rk(t.points),
		normals: rk(t.normals)
	}, i = e.traceNativeTexels(QO(t), r, {
		samples: t.samples,
		maxSeconds: n
	});
	return {
		radiance: nk(i.radiance),
		escaped: nk(i.escaped),
		adapter: i.adapter,
		compileSeconds: i.compileSeconds,
		tracedSeconds: i.tracedSeconds
	};
}
function ak(e) {
	return /passed its time limit/.test(e?.message ?? "");
}
var ok, sk, ck, lk, uk = A((() => {
	ok = "@codepawlhq/67js-render-native", sk = ["../packages/render-native/index.mjs", "../../packages/render-native/index.mjs"].map((e) => new URL(
		/* @vite-ignore */
		e,
		import.meta.url
	)), ck = [
		"triangles",
		"materials",
		"lights",
		"atlas",
		"environmentColors",
		"environmentTables",
		"parameters"
	], lk = {
		triangles: Float32Array,
		materials: Float32Array,
		lights: Float32Array,
		atlas: Uint32Array,
		environmentColors: Float32Array,
		environmentTables: Float32Array,
		parameters: Uint8Array
	};
}));
// src/agent-asset-limits.js
function dk(e) {
	return e % vk === 0 ? `${e / vk} MiB` : `${e} bytes`;
}
function fk(e) {
	let t = _k.maxBytes;
	return `Asset is ${e} bytes, over the catalog maxBytes ${t} (${dk(t)}). Shrink it (meshopt compression, smaller textures) or split it into parts; a larger scene loads through loadGltf in code.`;
}
function pk(e) {
	let t = _k.maxCombinedBytes;
	return `This call sends ${e} bytes of assets to the preview page at once, over the catalog maxCombinedBytes ${t} (${dk(t)}). Place fewer or smaller assets in one call and add the rest in later calls, or shrink them (meshopt compression, smaller textures).`;
}
function mk(e) {
	let t = e.endsWith("==") ? 2 : +!!e.endsWith("=");
	return Math.floor(e.length * 3 / 4) - t;
}
function hk(e) {
	let t = 0;
	for (let n of [
		"assetData",
		"sequenceData",
		"sources"
	]) for (let r of Object.values(e?.[n] ?? {})) typeof r == "string" && (t += mk(r));
	return typeof e?.data == "string" && (t += mk(e.data)), t;
}
function gk(e) {
	let t = hk(e);
	if (t > _k.maxCombinedBytes) throw RangeError(pk(t));
}
var _k, vk, yk = A((() => {
	_k = Object.freeze({
		maxBytes: 67108864,
		maxAssets: 64,
		maxCombinedBytes: 67108864,
		maxVertices: 1e6,
		maxParts: 4096,
		maxTexturePixels: 4194304,
		maxJoints: 1024,
		maxClips: 256
	}), vk = 1048576;
}));
// scripts/agent-asset-catalog.mjs
function bk(e, t) {
	if (/\.hdr$/i.test(e)) {
		if (t.toString("latin1", 0, 2) !== "#?") throw Error("An .hdr catalog file must be a Radiance file starting with #?.");
		return "environment";
	}
	if (/\.cube$/i.test(e)) {
		if (t.length > 4194304 || !t.toString("utf8").includes("LUT_3D_SIZE")) throw Error("A .cube catalog file must be a 3D look (LUT_3D_SIZE) of at most 4 MiB.");
		return "look";
	}
	return null;
}
function xk(e) {
	return e.length >= 8 && e.subarray(0, 8).equals(Buffer.from([
		137,
		80,
		78,
		71,
		13,
		10,
		26,
		10
	])) ? "png" : e.length >= 3 && e[0] === 255 && e[1] === 216 && e[2] === 255 ? "jpeg" : e.length >= 12 && e.toString("latin1", 0, 4) === "RIFF" && e.toString("latin1", 8, 12) === "WEBP" && e.readUInt32LE(4) + 8 === e.length ? "webp" : null;
}
function Sk(e) {
	if (e.length < 20 || e.readUInt32LE(0) !== 1179937895 || e.readUInt32LE(4) !== 2 || e.readUInt32LE(8) !== e.length) throw Error("Asset must be a complete glTF 2.0 binary file.");
	let t = e.readUInt32LE(12);
	if (e.readUInt32LE(16) !== 1313821514 || t % 4 != 0 || t > e.length - 20) throw Error("GLB must start with a bounded JSON chunk.");
	let n = JSON.parse(e.subarray(20, 20 + t).toString("utf8"));
	if (n.asset?.version !== "2.0") throw Error("Asset must declare glTF version 2.0.");
	for (let e of ["buffers", "images"]) {
		if (n[e] !== void 0 && !Array.isArray(n[e])) throw Error(`GLB ${e} must be an array.`);
		for (let t of n[e] ?? []) if (!t || typeof t != "object" || Object.hasOwn(t, "uri")) throw Error("Catalog GLBs must embed all buffers and images, without resource URIs.");
	}
	return n;
}
async function Ck(e) {
	if (typeof e != "string" || !y(e)) throw TypeError("Asset root must be an explicit absolute directory path.");
	let t = await u(e);
	if (!(await a(t)).isDirectory()) throw TypeError("Asset root must be a directory.");
	let n = /* @__PURE__ */ new Map();
	async function r(e) {
		let n = b(t, e), r = await a(n);
		if (!r.isFile() || r.isSymbolicLink()) throw Error("Catalog assets must be regular files, without links.");
		let i = await u(n), o = x(t, i);
		if (o.startsWith(`..${C}`) || o === ".." || y(o) || _(i) !== e) throw Error("Asset must remain inside its configured directory.");
		let c = await s(i, "r");
		try {
			let t = await c.stat();
			if (t.isFile() && t.size > Tk) throw RangeError(`${e}: ${fk(t.size)}`);
			if (!t.isFile() || t.dev !== r.dev || t.ino !== r.ino || t.size < 20) throw Error("Asset changed during opening or is too small to be a GLB.");
			let n = Buffer.alloc(t.size), i = 0;
			for (; i < n.length;) {
				let e = await c.read(n, i, n.length - i, i);
				if (e.bytesRead === 0) throw Error("Asset was truncated during reading.");
				i += e.bytesRead;
			}
			let a = await c.stat();
			if (a.size !== t.size || a.mtimeMs !== t.mtimeMs || a.ctimeMs !== t.ctimeMs) throw Error("Asset changed during reading.");
			let o = bk(e, n), s = o ? null : xk(n);
			if (s && !Ek[s].test(e)) throw Error("Image extension must match its PNG, JPEG or WebP content.");
			if (!s && !o && !/\.glb$/i.test(e)) throw Error("Catalog files must be GLB, PNG, JPEG, WebP, HDR or CUBE, with a matching extension.");
			return {
				bytes: n,
				document: s || o ? null : Sk(n),
				assetId: ne("sha256").update(n).digest("hex"),
				imageFormat: s,
				lookKind: o
			};
		} finally {
			await c.close();
		}
	}
	let i = (await l(t, { withFileTypes: !0 })).filter((e) => /\.(glb|png|jpe?g|webp|hdr|cube)$/i.test(e.name)).sort((e, t) => e.name.localeCompare(t.name));
	if (i.length > wk) throw RangeError(`Asset catalog has ${i.length} files, over its maxAssets ${wk}. Remove files from the --assets directory.`);
	for (let e of i) {
		let { bytes: t, document: i, assetId: a, imageFormat: o, lookKind: s } = await r(e.name);
		if (n.has(a)) continue;
		if (s) {
			n.set(a, {
				filename: e.name,
				metadata: Object.freeze({
					assetId: a,
					name: e.name,
					bytes: t.length,
					kind: s
				})
			});
			continue;
		}
		if (o) {
			n.set(a, {
				filename: e.name,
				metadata: Object.freeze({
					assetId: a,
					name: e.name,
					bytes: t.length,
					kind: "image",
					mimeType: Dk[o]
				})
			});
			continue;
		}
		let c = i.animations ?? [];
		if (!Array.isArray(c)) throw Error("GLB animations must be an array.");
		n.set(a, {
			filename: e.name,
			metadata: Object.freeze({
				assetId: a,
				name: e.name,
				bytes: t.length,
				kind: "glb",
				meshes: i.meshes?.length ?? 0,
				skins: i.skins?.length ?? 0,
				images: i.images?.length ?? 0,
				animationCount: c.length,
				animationsTruncated: c.length > 16,
				animations: c.slice(0, 16).map((e, t) => ({
					index: t,
					name: String(e?.name ?? `Clip ${t}`).slice(0, 80)
				}))
			})
		});
	}
	return Object.freeze({
		list() {
			return {
				assets: structuredClone([...n.values()].map((e) => e.metadata)),
				maximumBytes: Tk,
				maximumAssets: wk
			};
		},
		async read(e) {
			let t = n.get(e);
			if (!t) throw Error("Unknown asset ID. Read the configured asset catalog first.");
			let i = await r(t.filename);
			if (i.assetId !== e) throw Error("Asset bytes changed since catalog creation. Restart the runtime to refresh the catalog.");
			let a = i.document?.animations?.length ?? 0;
			if (a > _k.maxClips) throw RangeError(`Asset has ${a} animation clips, over the catalog maxClips ${_k.maxClips}. Remove clips from the file.`);
			return i.bytes;
		}
	});
}
var wk, Tk, Ek, Dk, Ok = A((() => {
	yk(), gy(), wk = _k.maxAssets, Tk = _k.maxBytes, Ek = {
		png: /\.png$/i,
		jpeg: /\.jpe?g$/i,
		webp: /\.webp$/i
	}, Dk = {
		png: "image/png",
		jpeg: "image/jpeg",
		webp: "image/webp"
	};
}));
// scripts/agent-query-asset.mjs
function kk(e) {
	if (Array.isArray(e)) e.forEach(kk);
	else if (e && typeof e == "object") for (let t of Object.keys(e)) Mk.test(t) && Number.isInteger(e[t]?.index) ? delete e[t] : kk(e[t]);
}
function Ak(e) {
	let t = new DataView(e.buffer, e.byteOffset, e.byteLength);
	if (e.byteLength < 20 || t.getUint32(0, !0) !== 1179937895 || t.getUint32(16, !0) !== jk) throw Error("Query-only assets must be GLB files with a JSON chunk first.");
	let n = t.getUint32(12, !0), r = JSON.parse(Buffer.from(e.subarray(20, 20 + n)).toString("utf8"));
	delete r.images, delete r.textures, delete r.samplers, kk(r.materials);
	let i = Buffer.from(JSON.stringify(r)), a = Buffer.concat([i, Buffer.alloc((4 - i.length % 4) % 4, 32)]), o = e.subarray(20 + n), s = Buffer.alloc(20);
	return s.writeUInt32LE(1179937895, 0), s.writeUInt32LE(2, 4), s.writeUInt32LE(20 + a.length + o.length, 8), s.writeUInt32LE(a.length, 12), s.writeUInt32LE(jk, 16), Buffer.concat([
		s,
		a,
		o
	]);
}
var jk, Mk, Nk = A((() => {
	jk = 1313821514, Mk = /Texture$/;
})), Pk, Fk = A((() => {
	Object.freeze({
		maxPathPoints: 512,
		maxLegs: 32,
		maxWheels: 8,
		maxNodeReferences: 64,
		maxLights: 16
	}), Pk = [
		"path",
		"legs",
		"speed",
		"cruiseSpeed",
		"acceleration",
		"braking",
		"startSpeed",
		"endSpeed",
		"maxLateralAcceleration",
		"startTime",
		"steering",
		"maxSteerAngle",
		"fullBrakeDeceleration",
		"rollGain",
		"pitchGain",
		"wheels",
		"body",
		"forwardAxis",
		"wheelbase",
		"lights"
	], Pk.slice(2, 9).concat([
		"startTime",
		"maxSteerAngle",
		"fullBrakeDeceleration",
		"rollGain",
		"pitchGain",
		"wheelbase"
	]);
})), Ik, Lk, Rk = A((() => {
	Ik = Object.freeze({
		maxFrames: 64,
		maxFps: 60,
		maxSide: 1024,
		maxDecodedBytes: 67108864
	}), Lk = Object.freeze({
		field: "material.map = { sequence: { frames: [catalog image asset IDs], fps, loop } }",
		covers: "color map (map) of surface-tag materials; needs UVs (grid, box and similar); not combined with pattern",
		frame: "floor(motionTime * fps), wrapped when loop is true (default) and held on the last frame when false; frame 0 before any motion time",
		clock: "motionTime, also in render jobs (settings.motion.start + elapsed)",
		images: "PNG, JPEG or WebP files in the --assets folder, listed by scene_asset_catalog with kind image; opaque pixels, one size for all frames",
		...Ik
	});
}));
// src/material-graph.js
function zk(e) {
	let t = /* @__PURE__ */ new Set(), n = (e, r) => {
		if (!(!e || typeof e != "object" || r > Ay.maxDepth * 3)) {
			!Array.isArray(e) && typeof e.image?.asset == "string" && t.add(e.image.asset);
			for (let t of Array.isArray(e) ? e : Object.values(e)) n(t, r + 1);
		}
	};
	return n(e, 0), [...t];
}
var Bk = A((() => {}));
// src/agent-texture-sequence.js
function Vk(e) {
	let t = /* @__PURE__ */ new Set(), n = (e, r) => {
		if (!e || typeof e != "object" || r > 8) return;
		if (Array.isArray(e)) {
			for (let t of e) n(t, r + 1);
			return;
		}
		if (e.type === "graph" && e.graph) for (let n of zk(e.graph)) Hk.test(n.toLowerCase()) && t.add(n.toLowerCase());
		let i = e.map?.sequence?.frames;
		if (Array.isArray(i)) for (let e of i) typeof e == "string" && Hk.test(e.toLowerCase()) && t.add(e.toLowerCase());
		for (let t of Object.values(e)) n(t, r + 1);
	};
	return n(e, 0), [...t];
}
var Hk, Uk = A((() => {
	Rk(), Bk(), Hk = /^[a-f0-9]{64}$/;
}));
// src/agent-scene-assets.js
function Wk(e, t, n = 0) {
	if (!e || typeof e != "object" || n > 8) return;
	if (Array.isArray(e)) {
		for (let r of e) Wk(r, t, n + 1);
		return;
	}
	let r = e.asset;
	r && typeof r == "object" && typeof r.id == "string" && Kk.test(r.id.toLowerCase()) && t.push(r);
	for (let [r, i] of Object.entries(e)) r !== "asset" && Wk(i, t, n + 1);
}
function Gk(e) {
	let t = [];
	Wk(e, t);
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.id.toLowerCase(), r = n.get(t) ?? {
			id: t,
			copies: 1
		};
		(e.clip || e.drive || e.crowd) && r.copies++, n.set(t, r);
	}
	return [...n.values()];
}
var Kk, qk, Jk, Yk = A((() => {
	Fk(), Uk(), Object.freeze({
		maxPlacements: 512,
		maxAssets: 16,
		maxAnimatedPlacements: 16,
		maxOverrides: 32
	}), Kk = /^[a-f0-9]{64}$/, qk = ["color", "emissiveColor"], Jk = [
		"metallic",
		"roughness",
		"opacity"
	], [...qk, ...Jk];
}));
// scripts/web-export.mjs
async function Xk(e) {
	let t = /* @__PURE__ */ new Set(), n = [nA];
	for (; n.length;) {
		let r = n.pop();
		if (t.has(r)) continue;
		let i;
		try {
			i = await c(b(e, r), "utf8");
		} catch {
			if (r !== nA) continue;
			throw Error(`The web export needs the built engine, and ${r} is missing from ${e}. Run npm run build:lib, or install the published package.`);
		}
		if (t.add(r), t.size > tA.maxEngineFiles) throw RangeError(`The engine has more than ${tA.maxEngineFiles} modules, which is not expected. Rebuild the package.`);
		for (let e of i.matchAll(rA)) n.push(e[1].slice(2));
	}
	return [...t].sort();
}
function Zk(e) {
	return e.replace(/[&<>"']/g, (e) => `&#${e.charCodeAt(0)};`);
}
function Qk(e) {
	return Zk(String(e ?? "Game").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, tA.maxTitleLength) || "Game");
}
function $k(e) {
	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="icon" href="data:,">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<title>${Qk(e)}</title>
<style>html,body{margin:0;height:100%;background:#101014;overflow:hidden}canvas{display:block;width:100%;height:100%;touch-action:none}</style>
</head>
<body>
<canvas id="game"></canvas>
<script type="module">
import { startGame } from './engine/${nA}';
const canvas = document.getElementById('game');
const recipe = await (await fetch('./game.json')).json();
const replayName = new URLSearchParams(location.search).get('replay');
const replay = /^[\\w.-]+\\.json$/.test(replayName ?? '') ? await (await fetch('./' + replayName)).json() : undefined;
window.__game = await startGame(canvas, recipe, { replay });
<\/script>
</body>
</html>
`;
}
async function eA({ recipe: e, buildDirectory: t, outputDirectory: n, title: r }) {
	if (!e?.game) throw Error("This scene has no game. Add one with scene_apply set-game (fields: scene_capabilities topic game), then export again.");
	if (e.game.physics) throw Error("game.physics is true, and the web export does not bundle the physics engine yet. Set game.physics to false with set-game.");
	if (e.nodes?.some((e) => e.asset || e.vegetation)) throw Error("The web export holds procedural scenes only. Remove the placed catalog assets and vegetation, or build them from geometry.");
	if (e.format !== "67js.scene") throw Error("The web export needs a 67js.scene recipe. Create the scene with scene_create.");
	let a = JSON.stringify(e);
	if (Buffer.byteLength(a) > tA.maxRecipeBytes) throw RangeError(`The recipe is larger than ${tA.maxRecipeBytes} bytes. Simplify the scene.`);
	let s = await Xk(t), c = 0;
	for (let e of s) c += (await m(b(t, e))).size;
	if (c > tA.maxEngineBytes) throw RangeError(`The engine is ${c} bytes, above the ${tA.maxEngineBytes} byte limit. Rebuild the package.`);
	await o(b(n, "engine"), { recursive: !0 });
	for (let e of s) await i(b(t, e), b(n, "engine", e));
	await g(b(n, "game.json"), a);
	let l = $k(r);
	await g(b(n, "index.html"), l);
	let u = c + Buffer.byteLength(a) + Buffer.byteLength(l);
	return {
		directory: v(b(n, "index.html")),
		files: s.length + 2,
		engineModules: s.length,
		bytes: u
	};
}
var tA, nA, rA, iA = A((() => {
	tA = Object.freeze({
		maxEngineBytes: 12582912,
		maxEngineFiles: 400,
		maxTitleLength: 64,
		maxRecipeBytes: 1048576
	}), nA = "game.js", rA = /(?:from\s*|import\s*\(\s*|import\s*)["'](\.\/[A-Za-z0-9_.-]+\.js)["']/g;
}));
// src/film-timeline.js
function aA(e, t) {
	if (!e || typeof e != "object" || Array.isArray(e) || Object.getPrototypeOf(e) !== Object.prototype) throw TypeError(`${t} must be a plain object.`);
}
function oA(e, t, n) {
	for (let r of Object.keys(e)) if (!t.includes(r)) throw TypeError(`${n} has unsupported field ${JSON.stringify(r.slice(0, 48))}.`);
}
function sA(e, t, n, r) {
	if (typeof e != "number" || !Number.isFinite(e) || e < t || e > n) throw RangeError(`${r} must be a number from ${t} to ${n}.`);
	return e;
}
function cA(e) {
	return !!(e?.motion || e?.physics || e?.cloth);
}
function lA(e, t, { checkCamera: n } = {}) {
	aA(e, "timeline"), oA(e, ["shots"], "timeline");
	let { shots: r } = e;
	if (!Array.isArray(r) || r.length < 1 || r.length > hA.maxShots) throw RangeError(`timeline.shots must list 1 to ${hA.maxShots} shots.`);
	let i = cA(t), a = /* @__PURE__ */ new Set(), o = 0, s = r.map((e, s) => {
		if (aA(e, `Shot ${s}`), oA(e, _A, `Shot ${s}`), typeof e.name != "string" || !gA.test(e.name)) throw TypeError(`Shot ${s} name must be 1 to 24 letters, digits, - or _.`);
		if (a.has(e.name)) throw RangeError(`Shot name ${e.name} is used twice.`);
		a.add(e.name);
		let c = sA(e.duration, hA.minShotSeconds, hA.maxShotSeconds, `Shot ${e.name} duration`), l = {
			name: e.name,
			duration: c
		};
		if (e.motionStart !== void 0) {
			if (!i) throw RangeError(`Shot ${e.name} sets motionStart but the recipe has no motion, physics or cloth.`);
			l.motionStart = sA(e.motionStart, 0, hA.maxMotionStart, `Shot ${e.name} motionStart`);
		}
		if (i && t.motion && !t.motion.loop) {
			let n = l.motionStart ?? o;
			if (n + c > t.motion.duration) throw RangeError(`Shot ${e.name} reads motion up to ${n + c} s but the motion lasts ${t.motion.duration} s. Set motionStart, or make the motion loop.`);
		}
		if (e.dip !== void 0) {
			l.dip = sA(e.dip, .05, hA.maxDipSeconds, `Shot ${e.name} dip`);
			let t = s === 0 ? Infinity : r[s - 1].duration;
			if (l.dip / 2 > c || l.dip / 2 > t) throw RangeError(`Shot ${e.name} dip is longer than twice the shots on either side of the cut.`);
		}
		return e.camera !== void 0 && (aA(e.camera, `Shot ${e.name} camera`), l.camera = n ? n(e.camera) : { ...e.camera }), e.focusDistance !== void 0 && (l.focusDistance = sA(e.focusDistance, .01, vA, `Shot ${e.name} focusDistance`)), e.blur !== void 0 && (l.blur = sA(e.blur, 0, 1, `Shot ${e.name} blur`)), o += c, l;
	});
	if (o > hA.maxTotalSeconds) throw RangeError(`The timeline lasts ${o} s; the most is ${hA.maxTotalSeconds} s.`);
	return { shots: s };
}
function uA(e) {
	let t = 0;
	for (let n of e.shots) t += n.duration;
	return t;
}
function dA(e) {
	let t = 0;
	return e.shots.map((e) => {
		let n = {
			name: e.name,
			start: t,
			duration: e.duration
		};
		return t += e.duration, n;
	});
}
function fA(e, t, n, r) {
	let i = 1, a = e.shots[n];
	a.dip !== void 0 && (i = Math.min(i, r / (a.dip / 2)));
	let o = e.shots[n + 1];
	if (o?.dip !== void 0) {
		let e = t[n].duration - r;
		i = Math.min(i, e / (o.dip / 2));
	}
	return Math.max(0, Math.min(1, i));
}
function pA(e) {
	let t = {};
	return e.focusDistance !== void 0 && (t.focusDistance = e.focusDistance), e.blur !== void 0 && (t.blur = e.blur), Object.keys(t).length > 0 ? t : null;
}
function mA(e, t, n) {
	let r = dA(e), i = uA(e);
	if (!Number.isFinite(n) || n < 0 || n > i) throw RangeError(`Timeline time ${n} is outside 0 to ${i} s.`);
	let a = r.length - 1;
	for (let e = 0; e < r.length; e++) if (n < r[e].start + r[e].duration) {
		a = e;
		break;
	}
	let o = e.shots[a], s = n - r[a].start, c = cA(t) ? (o.motionStart ?? r[a].start) + s : null;
	return {
		shotIndex: a,
		shotName: o.name,
		shotTime: s,
		motionTime: c,
		camera: o.camera ?? null,
		depthOfField: pA(o),
		brightness: fA(e, r, a, s)
	};
}
var hA, gA, _A, vA, yA = A((() => {
	hA = Object.freeze({
		maxShots: 64,
		maxTotalSeconds: 60,
		minShotSeconds: .1,
		maxShotSeconds: 30,
		maxDipSeconds: 4,
		maxMotionStart: 3600
	}), gA = /^[A-Za-z0-9_-]{1,24}$/, _A = [
		"name",
		"duration",
		"motionStart",
		"camera",
		"dip",
		"focusDistance",
		"blur"
	], vA = 1e5;
}));
// scripts/agent-render-jobs.mjs
function bA({ frameCount: e, width: t, height: n, renderer: r }, i = VA) {
	let a = Math.max(1, t * n / WA), o = Math.ceil(HA + e * UA * a), s = r?.type === "pathTracer" ? Math.ceil(r.maxSeconds * 1e3 * e) + KA : 0;
	return Math.min(i, Math.max(o, s));
}
function xA(e, t, n) {
	if (!e || Object.getPrototypeOf(e) !== Object.prototype) throw TypeError(`${n} must be a plain object.`);
	for (let r of Object.keys(e)) if (!t.includes(r)) throw TypeError(`Unknown ${n} field: ${r}. Allowed fields: ${t.join(", ")}.`);
}
function SA(e, t, n, r, i = !1) {
	if (!Number.isFinite(e) || e < t || e > n || i && !Number.isInteger(e)) throw RangeError(`${r} must be within ${t} and ${n}${i ? " as an integer" : ""}.`);
	return e;
}
function CA(e, t = JA) {
	let n = /* @__PURE__ */ new Set(), r = 0;
	function i(e, a) {
		if (a > 64) throw RangeError("JSON nesting exceeds 64 levels.");
		if (r += typeof e == "string" ? Buffer.byteLength(e) : 1, r > t) throw RangeError("Snapshot JSON exceeds its byte budget.");
		if (e !== null && typeof e != "boolean" && typeof e != "string" && !(typeof e == "number" && Number.isFinite(e))) {
			if (!e || typeof e != "object" || n.has(e)) throw TypeError("Snapshot must contain finite, acyclic JSON.");
			if (!Array.isArray(e) && Object.getPrototypeOf(e) !== Object.prototype) throw TypeError("Snapshot must contain plain JSON.");
			if (n.add(e), Array.isArray(e) && (e.length > t || Object.keys(e).length !== e.length || Object.keys(e).some((e, t) => e !== String(t)))) throw TypeError("Snapshot arrays must be bounded and dense.");
			for (let t of Reflect.ownKeys(e)) {
				if (Array.isArray(e) && t === "length") continue;
				let n = Object.getOwnPropertyDescriptor(e, t);
				if (typeof t != "string" || t === "__proto__" || !n.enumerable || !Object.hasOwn(n, "value")) throw TypeError("Snapshot accessors and hidden fields are unsupported.");
				i(n.value, a + 1);
			}
			n.delete(e);
		}
	}
	i(e, 0);
	let a = JSON.stringify(e);
	if (Buffer.byteLength(a) > t) throw RangeError("Snapshot JSON exceeds its byte budget.");
	return JSON.parse(a);
}
function wA(e, t, n) {
	if (xA(e, [
		"kind",
		"width",
		"height",
		"fps",
		"duration",
		"animation",
		"motion",
		"rendererTime",
		"passes",
		"renderer",
		"timeline",
		"audio",
		"encoder",
		"transparent",
		"format",
		"multilayer",
		"region"
	], "settings"), ![
		"image",
		"stills",
		"video"
	].includes(e.kind)) throw TypeError("kind must be image, stills or video.");
	let r = SA(e.width, 64, Uy, "width", !0), i = SA(e.height, 64, Uy, "height", !0);
	if (r * i > 2073600) throw RangeError("width x height must not exceed 1920x1080 pixels.");
	if (e.kind === "video" && (r % 2 || i % 2)) throw RangeError("Video dimensions must be even.");
	let a = SA(e.fps ?? 24, 1, 60, "fps", !0), o = DA(e, n), s = o === void 0 || e.kind === "image" ? 1 : uA(n.timeline) - o, c = SA(e.duration ?? s, .1, 60, "duration"), l = e.kind === "image" ? 1 : e.kind === "stills" ? 8 : Math.ceil(a * c);
	if (l > 900) throw RangeError("Job exceeds 900 frames.");
	let u = {
		kind: e.kind,
		width: r,
		height: i,
		fps: a,
		duration: c,
		frameCount: l
	};
	e.passes !== void 0 && (u.passes = kA(e.passes, e.kind)), e.renderer !== void 0 && (u.renderer = EA(e.renderer, e.passes)), Object.assign(u, TA(e, u));
	let d = e.kind === "image" ? 0 : e.kind === "stills" ? c : (l - 1) / a;
	if (o !== void 0) {
		if (e.motion !== void 0 || e.animation !== void 0) throw TypeError("A timeline owns the motion clock; leave motion and animation out.");
		if (o + d > uA(n.timeline)) throw RangeError("Timeline range exceeds the timeline duration.");
		u.timeline = { start: o };
	}
	if (e.encoder !== void 0) {
		if (e.kind !== "video") throw TypeError("encoder needs kind video.");
		if (!zy.includes(e.encoder)) throw TypeError(`encoder must be one of ${zy.join(", ")}.`);
		u.encoder = e.encoder;
	}
	if (e.audio !== void 0 && (u.audio = OA(e.audio, e.kind)), e.motion !== void 0) {
		xA(e.motion, ["start"], "motion");
		let t = n?.format === "67js.scene" && Gk(n).some((e) => e.copies > 1), r = JSON.stringify(n?.materials ?? []).includes("\"sequence\":{");
		if (!["67js.scene", "67js.asset"].includes(n?.format) || !n.motion && !t && !r) throw RangeError("Motion settings require a recipe with authored motion or a placed clip (or a map sequence).");
		let i = n.motion ? SA(n.motion.duration, .1, 30, "motion duration") : void 0;
		if (n.motion?.loop !== void 0 && typeof n.motion.loop != "boolean") throw TypeError("Motion loop must be boolean.");
		let a = SA(e.motion.start === void 0 ? 0 : e.motion.start, 0, 3600, "motion start");
		if (SA(a + d, 0, 3600, "motion end"), n.motion && !n.motion.loop && a + d > i) throw RangeError("Motion range exceeds the authored duration.");
		u.motion = { start: a };
	}
	if (e.animation !== void 0) {
		xA(e.animation, ["clip", "start"], "animation");
		let n = SA(e.animation.clip, 0, t.length - 1, "clip", !0), r = SA(e.animation.start ?? 0, 0, t[n].duration, "animation start");
		if (e.kind !== "image" && r + c > t[n].duration) throw RangeError("Animation range exceeds the selected clip duration.");
		u.animation = {
			clip: n,
			start: r
		};
	}
	return e.rendererTime === void 0 ? u.rendererTime = {
		start: 0,
		rate: 1
	} : (xA(e.rendererTime, ["start", "rate"], "rendererTime"), u.rendererTime = {
		start: SA(e.rendererTime.start ?? 0, 0, 3600, "renderer time start"),
		rate: SA(e.rendererTime.rate ?? 1, -16, 16, "renderer time rate")
	}), SA(u.rendererTime.start + d * u.rendererTime.rate, 0, 3600, "renderer time end"), u;
}
function TA(e, { kind: t, width: n, height: r, renderer: i, passes: a }) {
	let o = {}, s = "The path tracer writes an opaque 8-bit PNG of the whole frame.";
	if (e.transparent !== void 0) {
		if (typeof e.transparent != "boolean") throw TypeError("transparent must be boolean.");
		if (e.transparent && t === "video") throw RangeError("H.264 video has no alpha: transparent needs kind image or stills.");
		if (e.transparent && i) throw RangeError(`transparent cannot combine with renderer. ${s}`);
		e.transparent && (o.transparent = !0);
	}
	if (e.format !== void 0) {
		if (!By.includes(e.format)) throw TypeError(`format must be one of ${By.join(", ")}.`);
		if (e.format !== "png" && t === "video") throw RangeError("A video is H.264: format needs kind image or stills.");
		if (e.format !== "png" && i) throw RangeError(`format cannot combine with renderer. ${s}`);
		e.format !== "png" && (o.format = e.format);
	}
	if (e.multilayer !== void 0) {
		if (typeof e.multilayer != "boolean") throw TypeError("multilayer must be boolean.");
		if (e.multilayer && (e.format !== "exr" || !a)) throw RangeError("multilayer requires format exr and passes.");
		e.multilayer && (o.multilayer = !0);
	}
	if (e.region !== void 0) {
		if (xA(e.region, [
			"x",
			"y",
			"width",
			"height"
		], "region"), i) throw RangeError(`region cannot combine with renderer. ${s}`);
		let a = {
			x: SA(e.region.x, 0, n - 1, "region x", !0),
			y: SA(e.region.y, 0, r - 1, "region y", !0),
			width: SA(e.region.width, qA, n, "region width", !0),
			height: SA(e.region.height, qA, r, "region height", !0)
		};
		if (a.x + a.width > n || a.y + a.height > r) throw RangeError("region must lie inside the frame.");
		if (t === "video" && (a.width % 2 || a.height % 2)) throw RangeError("A video region must have even width and height.");
		o.region = a;
	}
	return o;
}
function EA(e, t) {
	if (xA(e, [
		"type",
		"backend",
		"samples",
		"bounces",
		"denoise",
		"seed",
		"maxSeconds",
		"noiseThreshold"
	], "renderer"), e.type !== "pathTracer") throw TypeError("renderer.type must be pathTracer.");
	if (t !== void 0) throw RangeError("The path tracer writes the lit image only: leave passes out.");
	let n = e.denoise ?? !0;
	if (typeof n != "boolean" && !rx.includes(n)) throw TypeError(`renderer.denoise must be a boolean or one of ${rx.join(", ")}.`);
	let r = e.backend ?? "cpu";
	if (!$A.includes(r)) throw TypeError("renderer.backend must be cpu, gpu or native.");
	let i = {
		type: "pathTracer",
		backend: r,
		denoise: n
	};
	for (let t of Object.keys(nx)) {
		let { minimum: r, maximum: a, default: o } = nx[t], s = t === "samples" && n === "oidn" ? 16 : o;
		i[t] = SA(e[t] ?? s, r, a, `renderer ${t}`, !ej.has(t));
	}
	return i;
}
function DA(e, t) {
	if (e.timeline !== void 0) {
		if (xA(e.timeline, ["start"], "timeline"), t?.format !== "67js.scene" || !t.timeline) throw RangeError("Timeline settings require a recipe with a timeline.");
		return lA(t.timeline, t), SA(e.timeline.start ?? 0, 0, 60, "timeline start");
	}
}
function OA(e, t) {
	if (t !== "video") throw TypeError("audio needs kind video.");
	if (xA(e, [
		"file",
		"offset",
		"track"
	], "audio"), e.track !== void 0 && !["aac", "pcm"].includes(e.track)) throw TypeError("audio.track must be aac or pcm.");
	if (typeof e.file != "string" || !Gy.test(e.file)) throw TypeError("audio.file must be a file name in the configured audio folder ending in .wav, .mp3, .ogg or .flac.");
	return {
		file: e.file,
		offset: SA(e.offset ?? 0, 0, 3600, "audio offset"),
		track: e.track ?? "aac"
	};
}
function kA(e, t) {
	if (t === "video") throw RangeError("Render passes need kind image or stills; a video holds the lit image only.");
	if (!Array.isArray(e) || e.length < 1 || e.length > Ry.length) throw TypeError(`passes must list 1 to ${Ry.length} pass names.`);
	for (let t of e) if (!Ry.includes(t)) throw RangeError(`Unknown render pass: ${t}. Use ${Ry.join(", ")}.`);
	if (new Set(e).size !== e.length) throw RangeError("passes must not repeat a name.");
	return [...e];
}
function AA(e, t = [], n = "png", r = !1) {
	if (e === "video") return ["render.mp4"];
	let i = n === "exr" ? "exr" : "png", a = e === "image" ? ["render"] : Array.from({ length: 8 }, (e, t) => `frame-${t}`);
	return r ? a.map((e) => `${e}.${i}`) : a.flatMap((e) => [`${e}.${i}`, ...t.map((t) => `${e}-${t}.${i}`)]);
}
function jA(e) {
	return e.kind === "video" ? "video/mp4" : e.format === "exr" ? "image/x-exr" : "image/png";
}
function MA(e, t) {
	return e.kind === "video" ? t.maxOutputBytes : e.format === void 0 ? t.maxFrameBytes : t.maxFrameBytes * 4;
}
function NA(e) {
	let t = Ry.join("|"), n = RegExp(`^(?:render\\.(?:png|mp4|exr)|(?:render|frame-[0-7])(?:-(?:${t}))?\\.(?:png|exr))(?:\\.partial)?$`);
	return QA.has(e) || n.test(e);
}
async function PA(e) {
	let t = await a(e);
	if (!t.isFile() || t.isSymbolicLink() || t.nlink !== 1) throw Error("Job files must be regular files without links or aliases.");
	return t;
}
async function FA(e, t = JA) {
	if ((await PA(e)).size > t) throw RangeError("Persisted job JSON exceeds its budget.");
	return CA(JSON.parse(await c(e, "utf8")), t);
}
async function IA(e, t) {
	let n = await PA(e);
	if (!n.size || n.size > t) throw RangeError("Artifact exceeds its output byte budget or is empty.");
	let r = await s(e, "r");
	try {
		let e = await r.stat();
		if (e.dev !== n.dev || e.ino !== n.ino || e.nlink !== 1) throw Error("Artifact changed while opening.");
		let i = ne("sha256"), a = 0;
		for await (let e of r.createReadStream({ autoClose: !1 })) {
			if (a += e.length, a > t) throw RangeError("Artifact exceeds its output byte budget.");
			i.update(e);
		}
		let o = await r.stat();
		if (a !== n.size || o.size !== n.size || o.mtimeMs !== n.mtimeMs || o.ctimeMs !== n.ctimeMs) throw Error("Artifact changed while hashing.");
		return {
			bytes: a,
			sha256: i.digest("hex")
		};
	} finally {
		await r.close();
	}
}
async function LA({ root: e, run: t, limits: n = {} }) {
	if (typeof e != "string" || !y(e)) throw TypeError("Job root must be an explicit absolute directory.");
	if (typeof t != "function") throw TypeError("run must be an async render callback.");
	xA(n, Object.keys(GA), "limits");
	let r = {
		...GA,
		...n
	};
	for (let [e, t] of Object.entries(r)) SA(t, 1, GA[e], e, !0);
	e = S(e), await o(e, {
		recursive: !0,
		mode: 448
	});
	let i = await a(e);
	if (!i.isDirectory() || i.isSymbolicLink()) throw Error("Job root must be a real directory without links.");
	e = await u(e);
	let c = b(e, "store.lock"), f = ie(), m = /* @__PURE__ */ new Map(), _, v = !1, x, C, w = !1;
	async function T() {
		try {
			let e = await s(c, "wx", 384);
			try {
				await e.writeFile(JSON.stringify({
					schemaVersion: 1,
					pid: process.pid,
					token: f
				}));
			} finally {
				await e.close();
			}
			w = !0, process.once("exit", E);
		} catch (e) {
			if (e.code !== "EEXIST") throw e;
			await PA(c);
			let t = await FA(c, 4096);
			if (xA(t, [
				"schemaVersion",
				"pid",
				"token"
			], "store lock"), t.schemaVersion !== 1 || !RA.test(t.token)) throw Error("Unrecognized job store lock.");
			SA(t.pid, 1, 2147483647, "lock process ID", !0);
			try {
				throw process.kill(t.pid, 0), Error("The job store is already owned by a live process.");
			} catch (e) {
				if (e.code !== "ESRCH") throw e;
			}
			throw Error("Stale job store lock requires explicit repair. Verify that no process owns the store before removing store.lock.");
		}
	}
	function E() {
		if (w) {
			try {
				JSON.parse(ee(c, "utf8")).token === f && O(c);
			} catch {}
			w = !1;
		}
	}
	async function D() {
		if (w) {
			if ((await FA(c, 4096)).token !== f) throw Error("Job store lock ownership changed.");
			await h(c), w = !1, process.removeListener("exit", E);
		}
	}
	async function te(t) {
		if (!RA.test(t)) throw Error("Unknown job ID.");
		let n = b(e, t), r = await a(n);
		if (!r.isDirectory() || r.isSymbolicLink() || await u(n) !== n) throw Error("Job directory must remain inside its owned store.");
		let i = await FA(b(n, "owner.json"), 4096);
		if (xA(i, [
			"schemaVersion",
			"storeId",
			"jobId"
		], "job owner"), i.schemaVersion !== 1 || i.storeId !== C || i.jobId !== t) throw Error("Foreign job directory ownership.");
		for (let e of await l(n)) {
			if (!NA(e)) throw Error(`Foreign job entry: ${e}.`);
			await PA(b(n, e));
		}
		return n;
	}
	async function re() {
		let t = 0;
		for (let n of await l(e)) if (n !== "exports") {
			if (["store.json", "store.lock"].includes(n)) t += (await PA(b(e, n))).size;
			else {
				if (k(n)) {
					let e = await ae(n);
					for (let n of await l(e)) t += (await PA(b(e, n))).size;
					continue;
				}
				if (!RA.test(n)) throw Error(`Foreign store entry: ${n}.`);
				let e = await te(n);
				for (let n of await l(e)) t += (await PA(b(e, n))).size;
			}
		}
		if (t > r.maxStoreBytes) throw RangeError("Job store exceeds its total byte budget. Release completed jobs.");
		return t;
	}
	function k(e) {
		return e.startsWith(`.pending-${C}-`) && RA.test(e.slice(`.pending-${C}-`.length));
	}
	async function ae(t) {
		if (!k(t)) throw Error("Unrecognized pending admission.");
		let n = b(e, t), r = await a(n);
		if (!r.isDirectory() || r.isSymbolicLink() || await u(n) !== n) throw Error("Pending admission must remain inside its owned store.");
		for (let e of await l(n)) await PA(b(n, e));
		return n;
	}
	function oe(e) {
		if (typeof e != "string" || !RA.test(e) || !m.has(e)) throw Error("Unknown job ID.");
		return m.get(e);
	}
	function se(e, t = e.record) {
		let n = JSON.stringify(t);
		return e.persistence = e.persistence.then(async () => {
			let t = await te(e.record.jobId), r = b(t, "status.json.pending");
			await g(r, n, { mode: 384 }), await d(r, b(t, "status.json"));
		}), e.persistence;
	}
	async function ce() {
		let t = await l(e);
		if (t.includes("store.json")) {
			let t = await FA(b(e, "store.json"), 4096);
			if (xA(t, ["schemaVersion", "storeId"], "store metadata"), t.schemaVersion !== 1 || !RA.test(t.storeId)) throw Error("Unsupported job store metadata.");
			C = t.storeId;
		} else {
			if (t.some((e) => e !== "store.lock" && e !== "exports")) throw Error("Job root contains foreign entries without store ownership.");
			C = ie(), await g(b(e, "store.json"), JSON.stringify({
				schemaVersion: 1,
				storeId: C
			}), {
				flag: "wx",
				mode: 384
			});
		}
		for (let t of await l(e)) {
			if (ZA.includes(t)) continue;
			if (k(t)) {
				let e = await ae(t);
				(await l(e)).length || await p(e);
				continue;
			}
			if (!RA.test(t)) throw Error(`Foreign store entry: ${t}.`);
			let e = await te(t), n = await FA(b(e, "status.json"));
			if (xA(n, [
				"schemaVersion",
				"jobId",
				"sourceRevision",
				"state",
				"settings",
				"progress",
				"artifacts",
				"metrics",
				"reason"
			], "job status"), n.schemaVersion !== 1 || n.jobId !== t || !zA.includes(n.state)) throw Error("Invalid persisted job status.");
			SA(n.sourceRevision, 0, 2 ** 53 - 1, "source revision", !0);
			let i = await FA(b(e, "snapshot.json"));
			if (xA(i, ["recipe", "clips"], "snapshot"), le(i.clips ?? []), !i.recipe || typeof i.recipe != "object" || Array.isArray(i.recipe)) throw Error("Persisted snapshot recipe must be an object.");
			if ((await l(e)).includes("asset.glb") && (await PA(b(e, "asset.glb"))).size > YA) throw Error("Persisted asset exceeds its byte budget.");
			if (i.recipe.format === "67js.asset" && (await IA(b(e, "asset.glb"), YA)).sha256 !== i.recipe.assetId) throw Error("Persisted asset does not match its recipe digest.");
			let { frameCount: a, ...o } = n.settings, s = wA(o, i.clips ?? [], i.recipe);
			if (a !== s.frameCount) throw Error("Invalid persisted frame count.");
			if (n.settings = s, xA(n.progress, ["frames", "maximumPendingFrames"], "persisted progress"), SA(n.progress.frames, 0, s.frameCount, "persisted frames", !0), SA(n.progress.maximumPendingFrames, 0, 1, "persisted pending frames", !0), n.metrics !== void 0 && (n.metrics = CA(n.metrics, 65536)), n.reason !== void 0 && (typeof n.reason != "string" || n.reason.length > 2048)) throw Error("Invalid persisted job reason.");
			let c = AA(s.kind, s.passes, s.format, s.multilayer);
			if (!Array.isArray(n.artifacts) || n.artifacts.length > c.length) throw Error("Invalid persisted artifacts.");
			let u = /* @__PURE__ */ new Set();
			for (let t of n.artifacts) {
				if (xA(t, [
					"filename",
					"mimeType",
					"bytes",
					"sha256"
				], "artifact"), !c.includes(t.filename) || u.has(t.filename)) throw Error("Invalid persisted artifact name.");
				u.add(t.filename);
				let n = await IA(b(e, t.filename), MA(s, r));
				if (t.mimeType !== jA(s) || t.bytes !== n.bytes || t.sha256 !== n.sha256) throw Error("Persisted artifact integrity failed.");
			}
			if (n.state === "completed" && n.artifacts.length !== c.length) throw Error("Completed job is missing its artifacts.");
			let d = {
				record: n,
				persistence: Promise.resolve(),
				settled: Promise.resolve()
			};
			m.set(t, d), BA.has(n.state) || (n.state = "interrupted", n.reason = "The previous process stopped before the job finished.", n.artifacts = [], await se(d));
		}
		if (m.size > r.maxRecords) throw RangeError("Job store exceeds its record budget.");
		await re();
	}
	function le(e) {
		if (!Array.isArray(e) || e.length > 256) throw TypeError("Snapshot clips must contain at most 256 durations.");
		for (let t of e) xA(t, ["duration"], "clip"), SA(t.duration, 0, 3600, "clip duration");
	}
	async function ue(e, n) {
		let { record: i, controller: o } = e, s = setTimeout(() => {
			e.failure = "Render job exceeded its elapsed deadline.", i.state = "cancelling", i.reason = e.failure, o.abort(Error(e.failure)), se(e).catch(() => {});
		}, bA(i.settings, r.deadlineMs)), c = [];
		try {
			if (o.signal.aborted) throw o.signal.reason;
			i.state = "running", await se(e);
			let s = await te(i.jobId);
			if (o.signal.aborted) throw o.signal.reason;
			let l = await t({
				jobId: i.jobId,
				sessionId: e.sessionId,
				directory: s,
				snapshot: n,
				settings: structuredClone(i.settings),
				signal: o.signal,
				progress(t) {
					if (xA(t, ["frames", "maximumPendingFrames"], "progress"), o.signal.aborted) throw o.signal.reason;
					if (i.state !== "running") throw Error("Progress is only accepted while the callback is running.");
					let n = SA(t.frames ?? i.progress.frames, i.progress.frames, i.settings.frameCount, "captured frames", !0), r = SA(t.maximumPendingFrames ?? i.progress.maximumPendingFrames, 0, 1, "pending frames", !0);
					return i.progress = {
						frames: n,
						maximumPendingFrames: Math.max(i.progress.maximumPendingFrames, r)
					}, se(e);
				}
			});
			if (o.signal.aborted) throw o.signal.reason;
			i.state = "finalizing", await se(e), xA(l, ["artifacts", "metrics"], "runner result");
			let u = AA(i.settings.kind, i.settings.passes, i.settings.format, i.settings.multilayer);
			if (!Array.isArray(l.artifacts) || l.artifacts.length !== u.length) throw Error("Runner did not return the required fixed artifacts.");
			let f = await te(i.jobId), p = CA(l.metrics ?? {}, 65536), m = [], h = /* @__PURE__ */ new Set(), g = 0;
			for (let e of l.artifacts) {
				if (xA(e, [
					"temporary",
					"filename",
					"mimeType"
				], "runner artifact"), !u.includes(e.filename) || h.has(e.filename) || e.temporary !== `${e.filename}.partial` || e.mimeType !== jA(i.settings)) throw Error("Runner artifact must use the fixed filename and MIME type.");
				h.add(e.filename);
				let t = {
					filename: e.filename,
					mimeType: e.mimeType,
					...await IA(b(f, e.temporary), MA(i.settings, r))
				};
				if (g += t.bytes, g > r.maxOutputBytes) throw RangeError("Job exceeds its combined output byte budget.");
				m.push(t);
			}
			if (await re(), o.signal.aborted) throw o.signal.reason;
			for (let e of m) {
				if (o.signal.aborted) throw o.signal.reason;
				let t = b(f, e.filename);
				try {
					throw await a(t), Error("Final artifact already exists.");
				} catch (e) {
					if (e.code !== "ENOENT") throw e;
				}
				await d(b(f, `${e.filename}.partial`), t), c.push(e.filename);
			}
			if (o.signal.aborted) throw o.signal.reason;
			let _ = {
				...i,
				artifacts: m,
				metrics: p,
				state: "completed"
			};
			if (await se(e, _), o.signal.aborted) throw o.signal.reason;
			Object.assign(i, _);
		} catch (t) {
			let n = {
				...i,
				state: o.signal.aborted && !e.failure ? "cancelled" : "failed",
				reason: String(e.failure ?? t?.message ?? t).slice(0, 2048),
				artifacts: []
			};
			try {
				let t = await te(i.jobId);
				for (let e of c) await PA(b(t, e)), await d(b(t, e), b(t, `${e}.partial`));
				await se(e, n);
			} catch (e) {
				n.reason = `${n.reason} Store cleanup or persistence failed: ${e.message}`.slice(0, 2048);
			}
			Object.assign(i, n);
		} finally {
			clearTimeout(s), _ === e && (_ = void 0);
		}
	}
	await T();
	try {
		await ce();
	} catch (e) {
		throw await D(), e;
	}
	return Object.freeze({
		limits: Object.freeze(r),
		async submit(t) {
			if (v) throw Error("Render job controller is closed.");
			if (_ || x) throw Error("A render job is already active. No additional jobs are queued.");
			xA(t, [
				"sessionId",
				"sourceRevision",
				"snapshot",
				"settings"
			], "submission");
			let n = SA(t.sourceRevision, 0, 2 ** 53 - 1, "source revision", !0);
			xA(t.snapshot, [
				"recipe",
				"assetBytes",
				"clips"
			], "snapshot");
			let i = CA(t.snapshot.clips ?? []);
			le(i);
			let a = CA(t.snapshot.recipe);
			if (!a || typeof a != "object" || Array.isArray(a)) throw TypeError("Snapshot recipe must be a JSON object.");
			let s = CA({
				recipe: a,
				clips: i
			}), c = wA(t.settings, i, a);
			if (t.snapshot.assetBytes !== void 0 && (!Buffer.isBuffer(t.snapshot.assetBytes) || t.snapshot.assetBytes.length > YA || !t.snapshot.assetBytes.length)) throw RangeError(`Asset snapshot must be a nonempty Buffer of at most ${YA} bytes (${dk(YA)}).`);
			let l = {
				recipe: a,
				clips: i,
				...t.snapshot.assetBytes ? { assetBytes: Buffer.from(t.snapshot.assetBytes) } : {}
			};
			if (a.format === "67js.asset" && (!l.assetBytes || ne("sha256").update(l.assetBytes).digest("hex") !== a.assetId)) throw Error("Asset snapshot bytes must match the recipe SHA256 assetId.");
			let u = (async () => {
				if (m.size >= r.maxRecords) throw RangeError("Job record budget exhausted. Release a finished job.");
				let i = JSON.stringify(s);
				if (await re() + Buffer.byteLength(i) + (l.assetBytes?.length ?? 0) + r.maxOutputBytes + 131072 > r.maxStoreBytes) throw RangeError("Job store lacks space for the snapshot and output reservation.");
				let a = ie(), u = b(e, a), f = b(e, `.pending-${C}-${a}`);
				await o(f, { mode: 448 }), await g(b(f, "owner.json"), JSON.stringify({
					schemaVersion: 1,
					storeId: C,
					jobId: a
				}), {
					flag: "wx",
					mode: 384
				}), await g(b(f, "snapshot.json"), i, {
					flag: "wx",
					mode: 384
				}), l.assetBytes && await g(b(f, "asset.glb"), l.assetBytes, {
					flag: "wx",
					mode: 384
				});
				let p = {
					schemaVersion: 1,
					jobId: a,
					sourceRevision: n,
					state: "queued",
					settings: c,
					progress: {
						frames: 0,
						maximumPendingFrames: 0
					},
					artifacts: []
				};
				await g(b(f, "status.json"), JSON.stringify(p), {
					flag: "wx",
					mode: 384
				}), await d(f, u);
				let h = {
					record: p,
					sessionId: t.sessionId,
					controller: new AbortController(),
					persistence: Promise.resolve()
				};
				m.set(a, h), _ = h;
				let v = structuredClone(p);
				return h.settled = Promise.resolve().then(() => ue(h, l)), h.settled.catch(() => {}), v;
			})();
			x = u;
			try {
				return await u;
			} finally {
				x = void 0;
			}
		},
		status(e) {
			return structuredClone(oe(e).record);
		},
		list() {
			return [...m.values()].map((e) => structuredClone(e.record));
		},
		cancel(e) {
			if (v) throw Error("Render job controller is closed.");
			let t = oe(e);
			return BA.has(t.record.state) || (t.record.state = "cancelling", t.controller.abort(/* @__PURE__ */ Error("Render job cancelled.")), se(t).catch(() => {})), structuredClone(t.record);
		},
		result(e) {
			let t = oe(e).record;
			if (t.state !== "completed") throw Error(`Render job is ${t.state}. No completed result is available.`);
			return structuredClone({
				jobId: e,
				sourceRevision: t.sourceRevision,
				artifacts: t.artifacts,
				metrics: t.metrics
			});
		},
		async release(e) {
			if (v) throw Error("Render job controller is closed.");
			let t = oe(e);
			if (_ === t || !BA.has(t.record.state)) throw Error("Cancel and settle the active job before release.");
			await t.persistence;
			let n = await te(e);
			for (let e of await l(n)) await PA(b(n, e)), await h(b(n, e));
			return await p(n), m.delete(e), {
				jobId: e,
				released: !0
			};
		},
		async close() {
			if (v = !0, await x?.catch(() => {}), _) {
				let e = _;
				e.record.state = "cancelling", e.controller.abort(/* @__PURE__ */ Error("Render job controller closed.")), await se(e);
				let t;
				try {
					await Promise.race([e.settled, new Promise((e, n) => {
						t = setTimeout(() => n(/* @__PURE__ */ Error("Render callback did not settle after cancellation. Store ownership remains locked.")), r.cleanupMs);
					})]);
				} finally {
					clearTimeout(t);
				}
			}
			for (let e of m.values()) await e.persistence;
			await D();
		}
	});
}
var RA, zA, BA, VA, HA, UA, WA, GA, KA, qA, JA, YA, XA, ZA, QA, $A, ej, tj = A((() => {
	$y(), Yk(), yA(), ax(), yk(), RA = /^[a-f0-9]{8}-[a-f0-9]{4}-[1-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/, zA = [
		"queued",
		"running",
		"finalizing",
		"completed",
		"cancelling",
		"cancelled",
		"failed",
		"interrupted"
	], BA = /* @__PURE__ */ new Set([
		"completed",
		"cancelled",
		"failed",
		"interrupted"
	]), VA = 18e5, HA = 6e4, UA = 2e3, WA = 589824, GA = Object.freeze({
		maxRecords: 32,
		maxStoreBytes: 512 * 1024 ** 2,
		maxOutputBytes: 128 * 1024 ** 2,
		maxFrameBytes: 12 * 1024 ** 2,
		deadlineMs: VA,
		cleanupMs: 5e3
	}), KA = 6e4, qA = 16, JA = 1024 ** 2, YA = _k.maxBytes, XA = "exports", ZA = [
		"store.json",
		"store.lock",
		XA
	], QA = /* @__PURE__ */ new Set([
		"owner.json",
		"snapshot.json",
		"asset.glb",
		"status.json",
		"status.json.pending"
	]), $A = [
		"cpu",
		"gpu",
		"native"
	], ej = /* @__PURE__ */ new Set(["maxSeconds", "noiseThreshold"]);
}));
// scripts/render-output-encoders.mjs
function nj(e) {
	return Math.round(Math.min(1, Math.max(0, e)) * 65535);
}
function rj(e, t, n, r) {
	if (!Object.hasOwn(Dj, r)) throw RangeError("A 16-bit PNG has 1, 3 or 4 channels.");
	if (e.length !== t * n * r) throw RangeError("The sample count does not match the image size.");
	let i = r * 2, a = t * i, o = Buffer.alloc((a + 1) * n), s = t * r, c = Buffer.alloc(a);
	for (let t = 0; t < n; t++) {
		for (let n = 0; n < s; n++) c.writeUInt16BE(e[t * s + n], n * 2);
		let n = t * (a + 1);
		o[n] = Oj;
		for (let e = 0; e < a; e++) {
			let t = e >= i ? c[e - i] : 0;
			o[n + 1 + e] = c[e] - t & 255;
		}
	}
	let l = Buffer.alloc(13);
	return l.writeUInt32BE(t, 0), l.writeUInt32BE(n, 4), l[8] = 16, l[9] = Dj[r], Buffer.concat([
		Buffer.from(GO),
		HO("IHDR", l),
		HO("IDAT", k(o, { level: 6 })),
		HO("IEND", /* @__PURE__ */ new Uint8Array())
	]);
}
function ij(e) {
	Aj[0] = Number.isNaN(e) ? 0 : Math.min(Ej, Math.max(-65504, e));
	let t = jj[0], n = t >>> 16 & 32768, r = (t >>> 23 & 255) - 127 + 15, i = t & 8388607;
	return r <= 0 ? r < -10 ? n : n | ((i | 8388608) >> 1 - r) + 4096 >> 13 : n | (r << 10 | i >> 13) + (i >> 12 & 1);
}
function aj(e, t, n) {
	return Buffer.concat([
		Buffer.from(`${e}\0${t}\0`),
		oj(n.length),
		n
	]);
}
function oj(e) {
	let t = Buffer.alloc(4);
	return t.writeInt32LE(e), t;
}
function sj(e, t, n, r) {
	let i = Buffer.alloc(16);
	return [
		e,
		t,
		n,
		r
	].forEach((e, t) => i.writeInt32LE(e, t * 4)), i;
}
function cj(e) {
	let t = e.map(({ name: e, pixelType: t }) => {
		let n = Buffer.alloc(e.length + 1 + 16);
		return n.write(e, 0, "latin1"), n.writeInt32LE(t, e.length + 1), n.writeInt32LE(1, e.length + 9), n.writeInt32LE(1, e.length + 13), n;
	});
	return Buffer.concat([...t, Buffer.alloc(1)]);
}
function lj(e) {
	let t = Buffer.alloc(e.length), n = e.length + 1 >> 1;
	for (let r = 0; r < e.length; r++) {
		let i = r % 2 == 0 ? r / 2 : n + (r - 1) / 2;
		t[i] = e[r];
	}
	let r = t[0];
	for (let e = 1; e < t.length; e++) {
		let n = t[e];
		t[e] = n - r + 128 + 256 & 255, r = n;
	}
	let i = k(t);
	return i.length < e.length ? i : e;
}
function uj(e, t, n) {
	let r = [...n].sort((e, t) => e.name < t.name ? -1 : 1).map((e) => ({
		...e,
		pixelType: e.type === "float" ? Tj : wj
	})), i = r.reduce((e, t) => e + (t.pixelType === Tj ? 4 : 2), 0), a = Buffer.concat([
		Buffer.from([...bj, ...xj]),
		aj("channels", "chlist", cj(r)),
		aj("compression", "compression", Buffer.from([Sj])),
		aj("dataWindow", "box2i", sj(0, 0, e - 1, t - 1)),
		aj("displayWindow", "box2i", sj(0, 0, e - 1, t - 1)),
		aj("lineOrder", "lineOrder", Buffer.from([0])),
		aj("pixelAspectRatio", "float", Buffer.from(new Float32Array([1]).buffer)),
		aj("screenWindowCenter", "v2f", Buffer.from(new Float32Array([0, 0]).buffer)),
		aj("screenWindowWidth", "float", Buffer.from(new Float32Array([1]).buffer)),
		Buffer.alloc(1)
	]), o = [];
	for (let n = 0; n < t; n += Cj) {
		let a = Math.min(Cj, t - n), s = Buffer.alloc(a * e * i), c = 0;
		for (let t = 0; t < a; t++) for (let i of r) for (let r = 0; r < e; r++) {
			let a = i.values[(n + t) * e + r];
			i.pixelType === Tj ? (s.writeFloatLE(a, c), c += 4) : (s.writeUInt16LE(ij(a), c), c += 2);
		}
		let l = lj(s), u = Buffer.alloc(8);
		u.writeInt32LE(n, 0), u.writeInt32LE(l.length, 4), o.push(Buffer.concat([u, l]));
	}
	let s = Buffer.alloc(o.length * 8), c = a.length + s.length;
	return o.forEach((e, t) => {
		s.writeBigUInt64LE(BigInt(c), t * 8), c += e.length;
	}), Buffer.concat([
		a,
		s,
		...o
	]);
}
function dj(e, t, n, r) {
	return r.map((r) => {
		let i = new Float32Array(t * n);
		for (let a = 0; a < n; a++) {
			let o = n - 1 - a;
			for (let n = 0; n < t; n++) i[a * t + n] = e[(o * t + n) * 4 + r];
		}
		return i;
	});
}
function fj(e) {
	return Math.round(Math.min(1, Math.max(0, e)) * 255);
}
function pj(e, t) {
	return fj(e[t]) * 256 + fj(e[t + 1]);
}
function mj(e, t) {
	return fj(e[t]) + fj(e[t + 1]) * 256 + fj(e[t + 2]) * 65536;
}
function hj({ pixels: e, width: t, height: n, pass: r, hasAlpha: i, depthRange: a, prefix: o = "" }) {
	if (r === "depth" || r === "objectId") {
		let i = new Float32Array(t * n);
		for (let o = 0; o < n; o++) {
			let s = n - 1 - o;
			for (let n = 0; n < t; n++) {
				let c = (s * t + n) * 4;
				i[o * t + n] = r === "depth" ? pj(e, c) / 65535 * a : mj(e, c);
			}
		}
		return [{
			name: `${o}${r === "depth" ? "Z" : "id"}`,
			type: "float",
			values: i
		}];
	}
	let [s, c, l, u] = dj(e, t, n, [
		0,
		1,
		2,
		3
	]);
	if (r === "uv") return [{
		name: `${o}U`,
		type: "half",
		values: s
	}, {
		name: `${o}V`,
		type: "half",
		values: c
	}];
	if (r === "velocity") return [{
		name: `${o}X`,
		type: "half",
		values: s
	}, {
		name: `${o}Y`,
		type: "half",
		values: c
	}];
	if (r === "position") return [
		{
			name: `${o}X`,
			type: "float",
			values: s
		},
		{
			name: `${o}Y`,
			type: "float",
			values: c
		},
		{
			name: `${o}Z`,
			type: "float",
			values: l
		}
	];
	let d = [
		{
			name: `${o}R`,
			type: "half",
			values: s
		},
		{
			name: `${o}G`,
			type: "half",
			values: c
		},
		{
			name: `${o}B`,
			type: "half",
			values: l
		}
	];
	return i && d.push({
		name: `${o}A`,
		type: "half",
		values: u
	}), d;
}
function gj(e) {
	return uj(e.width, e.height, hj(e));
}
function _j({ width: e, height: t, beauty: n, passes: r = {}, hasAlpha: i = !1, depthRange: a = 100 }) {
	if (n.length !== e * t * 4) throw RangeError("The beauty pixel count does not match the image size.");
	let o = [...hj({
		pixels: n,
		width: e,
		height: t,
		pass: void 0,
		hasAlpha: i,
		depthRange: a,
		prefix: "Combined."
	})];
	for (let [n, i] of Object.entries(r)) {
		if (i.length !== e * t * 4) throw RangeError(`The ${n} pixel count does not match the image size.`);
		o.push(...hj({
			pixels: i,
			width: e,
			height: t,
			pass: n,
			hasAlpha: !1,
			depthRange: a,
			prefix: `${n}.`
		}));
	}
	return uj(e, t, o);
}
function vj({ pixels: e, width: t, height: n, pass: r, hasAlpha: i, depthRange: a = 100 }) {
	let o = t * n;
	if (r === "depth" || r === "objectId") {
		let i = new Uint16Array(o);
		for (let a = 0; a < n; a++) for (let o = 0; o < t; o++) {
			let s = ((n - 1 - a) * t + o) * 4, c = r === "depth" ? pj(e, s) : mj(e, s);
			if (c > kj && r === "objectId") throw RangeError("A 16-bit PNG holds object IDs up to 65535. Use format exr for this scene.");
			i[a * t + o] = c;
		}
		return rj(i, t, n, 1);
	}
	let s = i ? 4 : 3, c = new Uint16Array(o * s);
	for (let o = 0; o < n; o++) for (let l = 0; l < t; l++) {
		let u = ((n - 1 - o) * t + l) * 4, d = (o * t + l) * s, f = e[u + 3], p = i && f > 0 ? 1 / f : 1;
		for (let t = 0; t < 3; t++) {
			let n = e[u + t], i = r === "position" ? n / a * .5 + .5 : r === "velocity" ? t < 2 ? n * .5 + .5 : 0 : n * p;
			c[d + t] = nj(i);
		}
		i && (c[d + 3] = nj(f));
	}
	return rj(c, t, n, s);
}
function yj({ format: e, pixels: t, width: n, height: r, pass: i, hasAlpha: a = !1, depthRange: o = 100 }) {
	if (t.length !== n * r * 4) throw RangeError("The pixel count does not match the image size.");
	let s = {
		pixels: t,
		width: n,
		height: r,
		pass: i,
		hasAlpha: a && i === void 0,
		depthRange: o
	};
	if (e === "png16") return vj(s);
	if (e === "exr") return gj(s);
	throw TypeError("format must be png16 or exr.");
}
var bj, xj, Sj, Cj, wj, Tj, Ej, Dj, Oj, kj, Aj, jj, Mj = A((() => {
	JO(), bj = [
		118,
		47,
		49,
		1
	], xj = [
		2,
		0,
		0,
		0
	], Sj = 3, Cj = 16, wj = 1, Tj = 2, Ej = 65504, Dj = Object.freeze({
		1: 0,
		3: 2,
		4: 6
	}), Oj = 1, kj = 65535, Aj = /* @__PURE__ */ new Float32Array(1), jj = new Uint32Array(Aj.buffer);
})), Nj = /* @__PURE__ */ pe(((e, t) => {
	var n = [
		"nodebuffer",
		"arraybuffer",
		"fragments"
	], r = typeof Blob < "u";
	r && n.push("blob"), t.exports = {
		BINARY_TYPES: n,
		CLOSE_TIMEOUT: 3e4,
		EMPTY_BUFFER: Buffer.alloc(0),
		GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
		hasBlob: r,
		kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
		kListener: Symbol("kListener"),
		kStatusCode: Symbol("status-code"),
		kWebSocket: Symbol("websocket"),
		NOOP: () => {}
	};
})), Pj = /* @__PURE__ */ j({ default: () => Fj }), Fj, Ij = A((() => {
	throw Fj = {}, Error("Could not resolve \"bufferutil\" imported by \"ws\". Is it installed?");
})), Lj = /* @__PURE__ */ pe(((e, t) => {
	var { websocketMask: n, websocketUnmask: r } = _e("http"), { EMPTY_BUFFER: i } = Nj(), a = Buffer[Symbol.species];
	function o(e, t) {
		if (e.length === 0) return i;
		if (e.length === 1) return e[0];
		let n = Buffer.allocUnsafe(t), r = 0;
		for (let t = 0; t < e.length; t++) {
			let i = e[t];
			n.set(i, r), r += i.length;
		}
		return r < t ? new a(n.buffer, n.byteOffset, r) : n;
	}
	function s(e, t, n, r, i) {
		for (let a = 0; a < i; a++) n[r + a] = e[a] ^ t[a & 3];
	}
	function c(e, t) {
		for (let n = 0; n < e.length; n++) e[n] ^= t[n & 3];
	}
	function l(e) {
		return e.length === e.buffer.byteLength ? e.buffer : e.buffer.slice(e.byteOffset, e.byteOffset + e.length);
	}
	function u(e) {
		if (u.readOnly = !0, Buffer.isBuffer(e)) return e;
		let t;
		return e instanceof ArrayBuffer ? t = new a(e) : ArrayBuffer.isView(e) ? t = new a(e.buffer, e.byteOffset, e.byteLength) : (t = Buffer.from(e), u.readOnly = !1), t;
	}
	if (t.exports = {
		concat: o,
		mask: s,
		toArrayBuffer: l,
		toBuffer: u,
		unmask: c
	}, n) t.exports.mask = function(e, t, r, i, a) {
		a < 24 ? s(e, t, r, i, a) : n(e, t, r, i, a);
	}, t.exports.unmask = function(e, t) {
		e.length < 24 ? c(e, t) : r(e, t);
	};
	else if (!process.env.WS_NO_BUFFER_UTIL) try {
		let e = (Ij(), ge(Pj));
		t.exports.mask = function(t, n, r, i, a) {
			a < 48 ? s(t, n, r, i, a) : e.mask(t, n, r, i, a);
		}, t.exports.unmask = function(t, n) {
			t.length < 32 ? c(t, n) : e.unmask(t, n);
		};
	} catch {}
})), Rj = /* @__PURE__ */ pe(((e, t) => {
	var n = Symbol("kDone"), r = Symbol("kRun");
	t.exports = class {
		constructor(e) {
			this[n] = () => {
				this.pending--, this[r]();
			}, this.concurrency = e || Infinity, this.jobs = [], this.pending = 0;
		}
		add(e) {
			this.jobs.push(e), this[r]();
		}
		[r]() {
			if (this.pending !== this.concurrency && this.jobs.length) {
				let e = this.jobs.shift();
				this.pending++, e(this[n]);
			}
		}
	};
})), zj = /* @__PURE__ */ pe(((e, t) => {
	var n = _e("zlib"), r = Lj(), i = Rj(), { kStatusCode: a } = Nj(), o = Buffer[Symbol.species], s = Buffer.from([
		0,
		0,
		255,
		255
	]), c = Symbol("permessage-deflate"), l = Symbol("total-length"), u = Symbol("callback"), d = Symbol("buffers"), f = Symbol("error"), p;
	t.exports = class {
		constructor(e) {
			this._options = e || {}, this._threshold = this._options.threshold === void 0 ? 1024 : this._options.threshold, this._maxPayload = this._options.maxPayload | 0, this._isServer = !!this._options.isServer, this._deflate = null, this._inflate = null, this.params = null, p ||= new i(this._options.concurrencyLimit === void 0 ? 10 : this._options.concurrencyLimit);
		}
		static get extensionName() {
			return "permessage-deflate";
		}
		offer() {
			let e = {};
			return this._options.serverNoContextTakeover && (e.server_no_context_takeover = !0), this._options.clientNoContextTakeover && (e.client_no_context_takeover = !0), this._options.serverMaxWindowBits && (e.server_max_window_bits = this._options.serverMaxWindowBits), this._options.clientMaxWindowBits ? e.client_max_window_bits = this._options.clientMaxWindowBits : this._options.clientMaxWindowBits ?? (e.client_max_window_bits = !0), e;
		}
		accept(e) {
			return e = this.normalizeParams(e), this.params = this._isServer ? this.acceptAsServer(e) : this.acceptAsClient(e), this.params;
		}
		cleanup() {
			if (this._inflate &&= (this._inflate.close(), null), this._deflate) {
				let e = this._deflate[u];
				this._deflate.close(), this._deflate = null, e && e(/* @__PURE__ */ Error("The deflate stream was closed while data was being processed"));
			}
		}
		acceptAsServer(e) {
			let t = this._options, n = e.find((e) => !(t.serverNoContextTakeover === !1 && e.server_no_context_takeover || e.server_max_window_bits && (t.serverMaxWindowBits === !1 || typeof t.serverMaxWindowBits == "number" && t.serverMaxWindowBits > e.server_max_window_bits) || typeof t.clientMaxWindowBits == "number" && (typeof e.client_max_window_bits == "number" ? t.clientMaxWindowBits > e.client_max_window_bits : !e.client_max_window_bits)));
			if (!n) throw Error("None of the extension offers can be accepted");
			return t.serverNoContextTakeover && (n.server_no_context_takeover = !0), t.clientNoContextTakeover && (n.client_no_context_takeover = !0), typeof t.serverMaxWindowBits == "number" && (n.server_max_window_bits = t.serverMaxWindowBits), typeof t.clientMaxWindowBits == "number" ? n.client_max_window_bits = t.clientMaxWindowBits : (n.client_max_window_bits === !0 || t.clientMaxWindowBits === !1) && delete n.client_max_window_bits, n;
		}
		acceptAsClient(e) {
			let t = e[0];
			if (this._options.clientNoContextTakeover === !1 && t.client_no_context_takeover) throw Error("Unexpected parameter \"client_no_context_takeover\"");
			if (!t.client_max_window_bits) typeof this._options.clientMaxWindowBits == "number" && (t.client_max_window_bits = this._options.clientMaxWindowBits);
			else if (this._options.clientMaxWindowBits === !1 || typeof this._options.clientMaxWindowBits == "number" && t.client_max_window_bits > this._options.clientMaxWindowBits) throw Error("Unexpected or invalid parameter \"client_max_window_bits\"");
			return t;
		}
		normalizeParams(e) {
			return e.forEach((e) => {
				Object.keys(e).forEach((t) => {
					let n = e[t];
					if (n.length > 1) throw Error(`Parameter "${t}" must have only a single value`);
					if (n = n[0], t === "client_max_window_bits") {
						if (n !== !0) {
							let e = +n;
							if (!Number.isInteger(e) || e < 8 || e > 15) throw TypeError(`Invalid value for parameter "${t}": ${n}`);
							n = e;
						} else if (!this._isServer) throw TypeError(`Invalid value for parameter "${t}": ${n}`);
					} else if (t === "server_max_window_bits") {
						let e = +n;
						if (!Number.isInteger(e) || e < 8 || e > 15) throw TypeError(`Invalid value for parameter "${t}": ${n}`);
						n = e;
					} else if (t === "client_no_context_takeover" || t === "server_no_context_takeover") {
						if (n !== !0) throw TypeError(`Invalid value for parameter "${t}": ${n}`);
					} else throw Error(`Unknown parameter "${t}"`);
					e[t] = n;
				});
			}), e;
		}
		decompress(e, t, n) {
			p.add((r) => {
				this._decompress(e, t, (e, t) => {
					r(), n(e, t);
				});
			});
		}
		compress(e, t, n) {
			p.add((r) => {
				this._compress(e, t, (e, t) => {
					r(), n(e, t);
				});
			});
		}
		_decompress(e, t, i) {
			let a = this._isServer ? "client" : "server";
			if (!this._inflate) {
				let e = `${a}_max_window_bits`, t = typeof this.params[e] == "number" ? this.params[e] : n.Z_DEFAULT_WINDOWBITS;
				this._inflate = n.createInflateRaw({
					...this._options.zlibInflateOptions,
					windowBits: t
				}), this._inflate[c] = this, this._inflate[l] = 0, this._inflate[d] = [], this._inflate.on("error", g), this._inflate.on("data", h);
			}
			this._inflate[u] = i, this._inflate.write(e), t && this._inflate.write(s), this._inflate.flush(() => {
				let e = this._inflate[f];
				if (e) {
					this._inflate.close(), this._inflate = null, i(e);
					return;
				}
				let n = r.concat(this._inflate[d], this._inflate[l]);
				this._inflate._readableState.endEmitted ? (this._inflate.close(), this._inflate = null) : (this._inflate[l] = 0, this._inflate[d] = [], t && this.params[`${a}_no_context_takeover`] && this._inflate.reset()), i(null, n);
			});
		}
		_compress(e, t, i) {
			let a = this._isServer ? "server" : "client";
			if (!this._deflate) {
				let e = `${a}_max_window_bits`, t = typeof this.params[e] == "number" ? this.params[e] : n.Z_DEFAULT_WINDOWBITS;
				this._deflate = n.createDeflateRaw({
					...this._options.zlibDeflateOptions,
					windowBits: t
				}), this._deflate[l] = 0, this._deflate[d] = [], this._deflate.on("data", m);
			}
			this._deflate[u] = i, this._deflate.write(e), this._deflate.flush(n.Z_SYNC_FLUSH, () => {
				if (!this._deflate) return;
				let e = r.concat(this._deflate[d], this._deflate[l]);
				t && (e = new o(e.buffer, e.byteOffset, e.length - 4)), this._deflate[u] = null, this._deflate[l] = 0, this._deflate[d] = [], t && this.params[`${a}_no_context_takeover`] && this._deflate.reset(), i(null, e);
			});
		}
	};
	function m(e) {
		this[d].push(e), this[l] += e.length;
	}
	function h(e) {
		this[l] += e.length, this[c]._maxPayload < 1 || this[l] <= this[c]._maxPayload ? this[d].push(e) : (this[f] = /* @__PURE__ */ RangeError("Max payload size exceeded"), this[f].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH", this[f][a] = 1009, this.removeListener("data", h), this.reset());
	}
	function g(e) {
		this[c]._inflate = null, this[f] ? this[u](this[f]) : (e[a] = 1007, this[u](e));
	}
})), Bj = /* @__PURE__ */ j({ default: () => Vj }), Vj, Hj = A((() => {
	throw Vj = {}, Error("Could not resolve \"utf-8-validate\" imported by \"ws\". Is it installed?");
})), Uj = /* @__PURE__ */ pe(((e, t) => {
	var { isUtf8: n } = _e("buffer"), { hasBlob: r } = Nj(), i = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		0,
		1,
		0
	];
	function a(e) {
		return e >= 1e3 && e <= 1014 && e !== 1004 && e !== 1005 && e !== 1006 || e >= 3e3 && e <= 4999;
	}
	function o(e) {
		let t = e.length, n = 0;
		for (; n < t;) if (!(e[n] & 128)) n++;
		else if ((e[n] & 224) == 192) {
			if (n + 1 === t || (e[n + 1] & 192) != 128 || (e[n] & 254) == 192) return !1;
			n += 2;
		} else if ((e[n] & 240) == 224) {
			if (n + 2 >= t || (e[n + 1] & 192) != 128 || (e[n + 2] & 192) != 128 || e[n] === 224 && (e[n + 1] & 224) == 128 || e[n] === 237 && (e[n + 1] & 224) == 160) return !1;
			n += 3;
		} else if ((e[n] & 248) == 240) {
			if (n + 3 >= t || (e[n + 1] & 192) != 128 || (e[n + 2] & 192) != 128 || (e[n + 3] & 192) != 128 || e[n] === 240 && (e[n + 1] & 240) == 128 || e[n] === 244 && e[n + 1] > 143 || e[n] > 244) return !1;
			n += 4;
		} else return !1;
		return !0;
	}
	function s(e) {
		return r && typeof e == "object" && typeof e.arrayBuffer == "function" && typeof e.type == "string" && typeof e.stream == "function" && (e[Symbol.toStringTag] === "Blob" || e[Symbol.toStringTag] === "File");
	}
	if (t.exports = {
		isBlob: s,
		isValidStatusCode: a,
		isValidUTF8: o,
		tokenChars: i
	}, n) t.exports.isValidUTF8 = function(e) {
		return e.length < 24 ? o(e) : n(e);
	};
	else if (!process.env.WS_NO_UTF_8_VALIDATE) try {
		let e = (Hj(), ge(Bj));
		t.exports.isValidUTF8 = function(t) {
			return t.length < 32 ? o(t) : e(t);
		};
	} catch {}
})), Wj = /* @__PURE__ */ pe(((e, t) => {
	var { Writable: n } = _e("stream"), r = zj(), { BINARY_TYPES: i, EMPTY_BUFFER: a, kStatusCode: o, kWebSocket: s } = Nj(), { concat: c, toArrayBuffer: l, unmask: u } = Lj(), { isValidStatusCode: d, isValidUTF8: f } = Uj(), p = Buffer[Symbol.species], m = 0, h = 1, g = 2, _ = 3, v = 4, y = 5, b = 6;
	t.exports = class extends n {
		constructor(e = {}) {
			super(), this._allowSynchronousEvents = e.allowSynchronousEvents === void 0 || e.allowSynchronousEvents, this._binaryType = e.binaryType || i[0], this._extensions = e.extensions || {}, this._isServer = !!e.isServer, this._maxBufferedChunks = e.maxBufferedChunks | 0, this._maxFragments = e.maxFragments | 0, this._maxPayload = e.maxPayload | 0, this._skipUTF8Validation = !!e.skipUTF8Validation, this[s] = void 0, this._bufferedBytes = 0, this._buffers = [], this._compressed = !1, this._payloadLength = 0, this._mask = void 0, this._fragmented = 0, this._masked = !1, this._fin = !1, this._opcode = 0, this._totalPayloadLength = 0, this._messageLength = 0, this._numFragments = 0, this._fragments = [], this._errored = !1, this._loop = !1, this._state = m;
		}
		_write(e, t, n) {
			if (this._opcode === 8 && this._state == m) return n();
			this._maxBufferedChunks > 0 && this._buffers.length >= this._maxBufferedChunks ? n(this.createError(RangeError, "Too many buffered chunks", !1, 1008, "WS_ERR_TOO_MANY_BUFFERED_PARTS")) : (this._bufferedBytes += e.length, this._buffers.push(e), this.startLoop(n));
		}
		consume(e) {
			if (this._bufferedBytes -= e, e === this._buffers[0].length) return this._buffers.shift();
			if (e < this._buffers[0].length) {
				let t = this._buffers[0];
				return this._buffers[0] = new p(t.buffer, t.byteOffset + e, t.length - e), new p(t.buffer, t.byteOffset, e);
			}
			let t = Buffer.allocUnsafe(e);
			do {
				let n = this._buffers[0], r = t.length - e;
				e >= n.length ? t.set(this._buffers.shift(), r) : (t.set(new Uint8Array(n.buffer, n.byteOffset, e), r), this._buffers[0] = new p(n.buffer, n.byteOffset + e, n.length - e)), e -= n.length;
			} while (e > 0);
			return t;
		}
		startLoop(e) {
			this._loop = !0;
			do
				switch (this._state) {
					case m:
						this.getInfo(e);
						break;
					case h:
						this.getPayloadLength16(e);
						break;
					case g:
						this.getPayloadLength64(e);
						break;
					case _:
						this.getMask();
						break;
					case v:
						this.getData(e);
						break;
					case y:
					case b:
						this._loop = !1;
						return;
				}
			while (this._loop);
			this._errored || e();
		}
		getInfo(e) {
			if (this._bufferedBytes < 2) {
				this._loop = !1;
				return;
			}
			let t = this.consume(2);
			if (t[0] & 48) {
				e(this.createError(RangeError, "RSV2 and RSV3 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_2_3"));
				return;
			}
			let n = (t[0] & 64) == 64;
			if (n && !this._extensions[r.extensionName]) e(this.createError(RangeError, "RSV1 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_1"));
			else {
				if (this._fin = (t[0] & 128) == 128, this._opcode = t[0] & 15, this._payloadLength = t[1] & 127, this._opcode === 0) {
					if (n) {
						e(this.createError(RangeError, "RSV1 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_1"));
						return;
					}
					if (!this._fragmented) {
						e(this.createError(RangeError, "invalid opcode 0", !0, 1002, "WS_ERR_INVALID_OPCODE"));
						return;
					}
					this._opcode = this._fragmented;
				} else if (this._opcode === 1 || this._opcode === 2) {
					if (this._fragmented) {
						e(this.createError(RangeError, `invalid opcode ${this._opcode}`, !0, 1002, "WS_ERR_INVALID_OPCODE"));
						return;
					}
					this._compressed = n;
				} else if (this._opcode > 7 && this._opcode < 11) {
					if (!this._fin) {
						e(this.createError(RangeError, "FIN must be set", !0, 1002, "WS_ERR_EXPECTED_FIN"));
						return;
					}
					if (n) {
						e(this.createError(RangeError, "RSV1 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_1"));
						return;
					}
					if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
						e(this.createError(RangeError, `invalid payload length ${this._payloadLength}`, !0, 1002, "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"));
						return;
					}
				} else {
					e(this.createError(RangeError, `invalid opcode ${this._opcode}`, !0, 1002, "WS_ERR_INVALID_OPCODE"));
					return;
				}
				if (!this._fin && !this._fragmented && (this._fragmented = this._opcode), this._masked = (t[1] & 128) == 128, this._isServer) {
					if (!this._masked) {
						e(this.createError(RangeError, "MASK must be set", !0, 1002, "WS_ERR_EXPECTED_MASK"));
						return;
					}
				} else if (this._masked) {
					e(this.createError(RangeError, "MASK must be clear", !0, 1002, "WS_ERR_UNEXPECTED_MASK"));
					return;
				}
				this._payloadLength === 126 ? this._state = h : this._payloadLength === 127 ? this._state = g : this.haveLength(e);
			}
		}
		getPayloadLength16(e) {
			this._bufferedBytes < 2 ? this._loop = !1 : (this._payloadLength = this.consume(2).readUInt16BE(0), this.haveLength(e));
		}
		getPayloadLength64(e) {
			if (this._bufferedBytes < 8) {
				this._loop = !1;
				return;
			}
			let t = this.consume(8), n = t.readUInt32BE(0);
			n > 2 ** 21 - 1 ? e(this.createError(RangeError, "Unsupported WebSocket frame: payload length > 2^53 - 1", !1, 1009, "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH")) : (this._payloadLength = n * 2 ** 32 + t.readUInt32BE(4), this.haveLength(e));
		}
		haveLength(e) {
			this._payloadLength && this._opcode < 8 && (this._totalPayloadLength += this._payloadLength, this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) ? e(this.createError(RangeError, "Max payload size exceeded", !1, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH")) : this._state = this._masked ? _ : v;
		}
		getMask() {
			this._bufferedBytes < 4 ? this._loop = !1 : (this._mask = this.consume(4), this._state = v);
		}
		getData(e) {
			let t = a;
			if (this._payloadLength) {
				if (this._bufferedBytes < this._payloadLength) {
					this._loop = !1;
					return;
				}
				t = this.consume(this._payloadLength), this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0 && u(t, this._mask);
			}
			this._opcode > 7 ? this.controlMessage(t, e) : this._maxFragments > 0 && ++this._numFragments > this._maxFragments ? e(this.createError(RangeError, "Too many message fragments", !1, 1008, "WS_ERR_TOO_MANY_BUFFERED_PARTS")) : this._compressed ? (this._state = y, this.decompress(t, e)) : (t.length && (this._messageLength = this._totalPayloadLength, this._fragments.push(t)), this.dataMessage(e));
		}
		decompress(e, t) {
			this._extensions[r.extensionName].decompress(e, this._fin, (e, n) => {
				if (e) return t(e);
				if (n.length) {
					if (this._messageLength += n.length, this._messageLength > this._maxPayload && this._maxPayload > 0) {
						t(this.createError(RangeError, "Max payload size exceeded", !1, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"));
						return;
					}
					this._fragments.push(n);
				}
				this.dataMessage(t), this._state === m && this.startLoop(t);
			});
		}
		dataMessage(e) {
			if (!this._fin) {
				this._state = m;
				return;
			}
			let t = this._messageLength, n = this._fragments;
			if (this._totalPayloadLength = 0, this._messageLength = 0, this._fragmented = 0, this._numFragments = 0, this._fragments = [], this._opcode === 2) {
				let r;
				r = this._binaryType === "nodebuffer" ? c(n, t) : this._binaryType === "arraybuffer" ? l(c(n, t)) : this._binaryType === "blob" ? new Blob(n) : n, this._allowSynchronousEvents ? (this.emit("message", r, !0), this._state = m) : (this._state = b, setImmediate(() => {
					this.emit("message", r, !0), this._state = m, this.startLoop(e);
				}));
			} else {
				let r = c(n, t);
				if (!this._skipUTF8Validation && !f(r)) {
					e(this.createError(Error, "invalid UTF-8 sequence", !0, 1007, "WS_ERR_INVALID_UTF8"));
					return;
				}
				this._state === y || this._allowSynchronousEvents ? (this.emit("message", r, !1), this._state = m) : (this._state = b, setImmediate(() => {
					this.emit("message", r, !1), this._state = m, this.startLoop(e);
				}));
			}
		}
		controlMessage(e, t) {
			if (this._opcode === 8) {
				if (e.length === 0) this._loop = !1, this.emit("conclude", 1005, a), this.end();
				else {
					let n = e.readUInt16BE(0);
					if (!d(n)) {
						t(this.createError(RangeError, `invalid status code ${n}`, !0, 1002, "WS_ERR_INVALID_CLOSE_CODE"));
						return;
					}
					let r = new p(e.buffer, e.byteOffset + 2, e.length - 2);
					if (!this._skipUTF8Validation && !f(r)) {
						t(this.createError(Error, "invalid UTF-8 sequence", !0, 1007, "WS_ERR_INVALID_UTF8"));
						return;
					}
					this._loop = !1, this.emit("conclude", n, r), this.end();
				}
				this._state = m;
			} else this._allowSynchronousEvents ? (this.emit(this._opcode === 9 ? "ping" : "pong", e), this._state = m) : (this._state = b, setImmediate(() => {
				this.emit(this._opcode === 9 ? "ping" : "pong", e), this._state = m, this.startLoop(t);
			}));
		}
		createError(e, t, n, r, i) {
			this._loop = !1, this._errored = !0;
			let a = new e(n ? `Invalid WebSocket frame: ${t}` : t);
			return Error.captureStackTrace(a, this.createError), a.code = i, a[o] = r, a;
		}
	};
})), Gj = /* @__PURE__ */ pe(((e, t) => {
	var { Duplex: n } = _e("stream"), { randomFillSync: r } = _e("crypto"), { types: { isUint8Array: i } } = _e("util"), a = zj(), { EMPTY_BUFFER: o, kWebSocket: s, NOOP: c } = Nj(), { isBlob: l, isValidStatusCode: u } = Uj(), { mask: d, toBuffer: f } = Lj(), p = Symbol("kByteLength"), m = Buffer.alloc(4), h = 8192, g, _ = h, v = 0, y = 1, b = 2;
	t.exports = class e {
		constructor(e, t, n) {
			this._extensions = t || {}, n && (this._generateMask = n, this._maskBuffer = Buffer.alloc(4)), this._socket = e, this._firstFragment = !0, this._compress = !1, this._bufferedBytes = 0, this._queue = [], this._state = v, this.onerror = c, this[s] = void 0;
		}
		static frame(e, t) {
			let n, i = !1, a = 2, o = !1;
			t.mask && (n = t.maskBuffer || m, t.generateMask ? t.generateMask(n) : (_ === h && (g === void 0 && (g = Buffer.alloc(h)), r(g, 0, h), _ = 0), n[0] = g[_++], n[1] = g[_++], n[2] = g[_++], n[3] = g[_++]), o = (n[0] | n[1] | n[2] | n[3]) === 0, a = 6);
			let s;
			typeof e == "string" ? (!t.mask || o) && t[p] !== void 0 ? s = t[p] : (e = Buffer.from(e), s = e.length) : (s = e.length, i = t.mask && t.readOnly && !o);
			let c = s;
			s >= 65536 ? (a += 8, c = 127) : s > 125 && (a += 2, c = 126);
			let l = Buffer.allocUnsafe(i ? s + a : a);
			return l[0] = t.fin ? t.opcode | 128 : t.opcode, t.rsv1 && (l[0] |= 64), l[1] = c, c === 126 ? l.writeUInt16BE(s, 2) : c === 127 && (l[2] = l[3] = 0, l.writeUIntBE(s, 4, 6)), t.mask ? (l[1] |= 128, l[a - 4] = n[0], l[a - 3] = n[1], l[a - 2] = n[2], l[a - 1] = n[3], s ? o ? [l, e] : i ? (d(e, n, l, a, s), [l]) : (d(e, n, e, 0, s), [l, e]) : [l]) : s ? [l, e] : [l];
		}
		close(t, n, r, a) {
			let s;
			if (t === void 0) s = o;
			else if (typeof t != "number" || !u(t)) throw TypeError("First argument must be a valid error code number");
			else if (n === void 0 || !n.length) s = Buffer.allocUnsafe(2), s.writeUInt16BE(t, 0);
			else {
				let e = Buffer.byteLength(n);
				if (e > 123) throw RangeError("The message must not be greater than 123 bytes");
				if (s = Buffer.allocUnsafe(2 + e), s.writeUInt16BE(t, 0), typeof n == "string") s.write(n, 2);
				else if (i(n)) s.set(n, 2);
				else throw TypeError("Second argument must be a string or a Uint8Array");
			}
			let c = {
				[p]: s.length,
				fin: !0,
				generateMask: this._generateMask,
				mask: r,
				maskBuffer: this._maskBuffer,
				opcode: 8,
				readOnly: !1,
				rsv1: !1
			};
			this._state === v ? this.sendFrame(e.frame(s, c), a) : this.enqueue([
				this.dispatch,
				s,
				!1,
				c,
				a
			]);
		}
		ping(t, n, r) {
			let i, a;
			if (typeof t == "string" ? (i = Buffer.byteLength(t), a = !1) : l(t) ? (i = t.size, a = !1) : (t = f(t), i = t.length, a = f.readOnly), i > 125) throw RangeError("The data size must not be greater than 125 bytes");
			let o = {
				[p]: i,
				fin: !0,
				generateMask: this._generateMask,
				mask: n,
				maskBuffer: this._maskBuffer,
				opcode: 9,
				readOnly: a,
				rsv1: !1
			};
			l(t) ? this._state === v ? this.getBlobData(t, !1, o, r) : this.enqueue([
				this.getBlobData,
				t,
				!1,
				o,
				r
			]) : this._state === v ? this.sendFrame(e.frame(t, o), r) : this.enqueue([
				this.dispatch,
				t,
				!1,
				o,
				r
			]);
		}
		pong(t, n, r) {
			let i, a;
			if (typeof t == "string" ? (i = Buffer.byteLength(t), a = !1) : l(t) ? (i = t.size, a = !1) : (t = f(t), i = t.length, a = f.readOnly), i > 125) throw RangeError("The data size must not be greater than 125 bytes");
			let o = {
				[p]: i,
				fin: !0,
				generateMask: this._generateMask,
				mask: n,
				maskBuffer: this._maskBuffer,
				opcode: 10,
				readOnly: a,
				rsv1: !1
			};
			l(t) ? this._state === v ? this.getBlobData(t, !1, o, r) : this.enqueue([
				this.getBlobData,
				t,
				!1,
				o,
				r
			]) : this._state === v ? this.sendFrame(e.frame(t, o), r) : this.enqueue([
				this.dispatch,
				t,
				!1,
				o,
				r
			]);
		}
		send(e, t, n) {
			let r = this._extensions[a.extensionName], i = t.binary ? 2 : 1, o = t.compress, s, c;
			typeof e == "string" ? (s = Buffer.byteLength(e), c = !1) : l(e) ? (s = e.size, c = !1) : (e = f(e), s = e.length, c = f.readOnly), this._firstFragment ? (this._firstFragment = !1, o && r && r.params[r._isServer ? "server_no_context_takeover" : "client_no_context_takeover"] && (o = s >= r._threshold), this._compress = o) : (o = !1, i = 0), t.fin && (this._firstFragment = !0);
			let u = {
				[p]: s,
				fin: t.fin,
				generateMask: this._generateMask,
				mask: t.mask,
				maskBuffer: this._maskBuffer,
				opcode: i,
				readOnly: c,
				rsv1: o
			};
			l(e) ? this._state === v ? this.getBlobData(e, this._compress, u, n) : this.enqueue([
				this.getBlobData,
				e,
				this._compress,
				u,
				n
			]) : this._state === v ? this.dispatch(e, this._compress, u, n) : this.enqueue([
				this.dispatch,
				e,
				this._compress,
				u,
				n
			]);
		}
		getBlobData(t, n, r, i) {
			this._bufferedBytes += r[p], this._state = b, t.arrayBuffer().then((t) => {
				if (this._socket.destroyed) {
					let e = /* @__PURE__ */ Error("The socket was closed while the blob was being read");
					process.nextTick(x, this, e, i);
					return;
				}
				this._bufferedBytes -= r[p];
				let a = f(t);
				n ? this.dispatch(a, n, r, i) : (this._state = v, this.sendFrame(e.frame(a, r), i), this.dequeue());
			}).catch((e) => {
				process.nextTick(S, this, e, i);
			});
		}
		dispatch(t, n, r, i) {
			if (!n) {
				this.sendFrame(e.frame(t, r), i);
				return;
			}
			let o = this._extensions[a.extensionName];
			this._bufferedBytes += r[p], this._state = y, o.compress(t, r.fin, (t, n) => {
				if (this._socket.destroyed) {
					let e = /* @__PURE__ */ Error("The socket was closed while data was being compressed");
					x(this, e, i);
				} else this._bufferedBytes -= r[p], this._state = v, r.readOnly = !1, this.sendFrame(e.frame(n, r), i), this.dequeue();
			});
		}
		dequeue() {
			for (; this._state === v && this._queue.length;) {
				let e = this._queue.shift();
				this._bufferedBytes -= e[3][p], Reflect.apply(e[0], this, e.slice(1));
			}
		}
		enqueue(e) {
			this._bufferedBytes += e[3][p], this._queue.push(e);
		}
		sendFrame(e, t) {
			e.length === 2 ? (this._socket.cork(), this._socket.write(e[0]), this._socket.write(e[1], t), this._socket.uncork()) : this._socket.write(e[0], t);
		}
	};
	function x(e, t, n) {
		typeof n == "function" && n(t);
		for (let n = 0; n < e._queue.length; n++) {
			let r = e._queue[n], i = r[r.length - 1];
			typeof i == "function" && i(t);
		}
	}
	function S(e, t, n) {
		x(e, t, n), e.onerror(t);
	}
})), Kj = /* @__PURE__ */ pe(((e, t) => {
	var { kForOnEventAttribute: n, kListener: r } = Nj(), i = Symbol("kCode"), a = Symbol("kData"), o = Symbol("kError"), s = Symbol("kMessage"), c = Symbol("kReason"), l = Symbol("kTarget"), u = Symbol("kType"), d = Symbol("kWasClean"), f = class {
		constructor(e) {
			this[l] = null, this[u] = e;
		}
		get target() {
			return this[l];
		}
		get type() {
			return this[u];
		}
	};
	Object.defineProperty(f.prototype, "target", { enumerable: !0 }), Object.defineProperty(f.prototype, "type", { enumerable: !0 });
	var p = class extends f {
		constructor(e, t = {}) {
			super(e), this[i] = t.code === void 0 ? 0 : t.code, this[c] = t.reason === void 0 ? "" : t.reason, this[d] = t.wasClean !== void 0 && t.wasClean;
		}
		get code() {
			return this[i];
		}
		get reason() {
			return this[c];
		}
		get wasClean() {
			return this[d];
		}
	};
	Object.defineProperty(p.prototype, "code", { enumerable: !0 }), Object.defineProperty(p.prototype, "reason", { enumerable: !0 }), Object.defineProperty(p.prototype, "wasClean", { enumerable: !0 });
	var m = class extends f {
		constructor(e, t = {}) {
			super(e), this[o] = t.error === void 0 ? null : t.error, this[s] = t.message === void 0 ? "" : t.message;
		}
		get error() {
			return this[o];
		}
		get message() {
			return this[s];
		}
	};
	Object.defineProperty(m.prototype, "error", { enumerable: !0 }), Object.defineProperty(m.prototype, "message", { enumerable: !0 });
	var h = class extends f {
		constructor(e, t = {}) {
			super(e), this[a] = t.data === void 0 ? null : t.data;
		}
		get data() {
			return this[a];
		}
	};
	Object.defineProperty(h.prototype, "data", { enumerable: !0 }), t.exports = {
		CloseEvent: p,
		ErrorEvent: m,
		Event: f,
		EventTarget: {
			addEventListener(e, t, i = {}) {
				for (let a of this.listeners(e)) if (!i[n] && a[r] === t && !a[n]) return;
				let a;
				if (e === "message") a = function(e, n) {
					let r = new h("message", { data: n ? e : e.toString() });
					r[l] = this, g(t, this, r);
				};
				else if (e === "close") a = function(e, n) {
					let r = new p("close", {
						code: e,
						reason: n.toString(),
						wasClean: this._closeFrameReceived && this._closeFrameSent
					});
					r[l] = this, g(t, this, r);
				};
				else if (e === "error") a = function(e) {
					let n = new m("error", {
						error: e,
						message: e.message
					});
					n[l] = this, g(t, this, n);
				};
				else if (e === "open") a = function() {
					let e = new f("open");
					e[l] = this, g(t, this, e);
				};
				else return;
				a[n] = !!i[n], a[r] = t, i.once ? this.once(e, a) : this.on(e, a);
			},
			removeEventListener(e, t) {
				for (let i of this.listeners(e)) if (i[r] === t && !i[n]) {
					this.removeListener(e, i);
					break;
				}
			}
		},
		MessageEvent: h
	};
	function g(e, t, n) {
		typeof e == "object" && e.handleEvent ? e.handleEvent.call(e, n) : e.call(t, n);
	}
})), qj = /* @__PURE__ */ pe(((e, t) => {
	var { tokenChars: n } = Uj();
	function r(e, t, n) {
		e[t] === void 0 ? e[t] = [n] : e[t].push(n);
	}
	function i(e) {
		let t = Object.create(null), i = Object.create(null), a = !1, o = !1, s = !1, c, l, u = -1, d = -1, f = -1, p = 0;
		for (; p < e.length; p++) if (d = e.charCodeAt(p), c === void 0) {
			if (f === -1 && n[d] === 1) u === -1 && (u = p);
			else if (p !== 0 && (d === 32 || d === 9)) f === -1 && u !== -1 && (f = p);
			else if (d === 59 || d === 44) {
				if (u === -1) throw SyntaxError(`Unexpected character at index ${p}`);
				f === -1 && (f = p);
				let n = e.slice(u, f);
				d === 44 ? (r(t, n, i), i = Object.create(null)) : c = n, u = f = -1;
			} else throw SyntaxError(`Unexpected character at index ${p}`);
		} else if (l === void 0) {
			if (f === -1 && n[d] === 1) u === -1 && (u = p);
			else if (d === 32 || d === 9) f === -1 && u !== -1 && (f = p);
			else if (d === 59 || d === 44) {
				if (u === -1) throw SyntaxError(`Unexpected character at index ${p}`);
				f === -1 && (f = p), r(i, e.slice(u, f), !0), d === 44 && (r(t, c, i), i = Object.create(null), c = void 0), u = f = -1;
			} else if (d === 61 && u !== -1 && f === -1) l = e.slice(u, p), u = f = -1;
			else throw SyntaxError(`Unexpected character at index ${p}`);
		} else if (o) {
			if (n[d] !== 1) throw SyntaxError(`Unexpected character at index ${p}`);
			u === -1 ? u = p : a ||= !0, o = !1;
		} else if (s) {
			if (n[d] === 1) u === -1 && (u = p);
			else if (d === 34 && u !== -1) s = !1, f = p;
			else if (d === 92) o = !0;
			else throw SyntaxError(`Unexpected character at index ${p}`);
		} else if (d === 34 && e.charCodeAt(p - 1) === 61) s = !0;
		else if (f === -1 && n[d] === 1) u === -1 && (u = p);
		else if (u !== -1 && (d === 32 || d === 9)) f === -1 && (f = p);
		else if (d === 59 || d === 44) {
			if (u === -1) throw SyntaxError(`Unexpected character at index ${p}`);
			f === -1 && (f = p);
			let n = e.slice(u, f);
			a &&= (n = n.replace(/\\/g, ""), !1), r(i, l, n), d === 44 && (r(t, c, i), i = Object.create(null), c = void 0), l = void 0, u = f = -1;
		} else throw SyntaxError(`Unexpected character at index ${p}`);
		if (u === -1 || s || d === 32 || d === 9) throw SyntaxError("Unexpected end of input");
		f === -1 && (f = p);
		let m = e.slice(u, f);
		return c === void 0 ? r(t, m, i) : (l === void 0 ? r(i, m, !0) : a ? r(i, l, m.replace(/\\/g, "")) : r(i, l, m), r(t, c, i)), t;
	}
	function a(e) {
		return Object.keys(e).map((t) => {
			let n = e[t];
			return Array.isArray(n) || (n = [n]), n.map((e) => [t].concat(Object.keys(e).map((t) => {
				let n = e[t];
				return Array.isArray(n) || (n = [n]), n.map((e) => e === !0 ? t : `${t}=${e}`).join("; ");
			})).join("; ")).join(", ");
		}).join(", ");
	}
	t.exports = {
		format: a,
		parse: i
	};
})), Jj = /* @__PURE__ */ pe(((e, t) => {
	var n = _e("events"), r = _e("https"), i = _e("http"), a = _e("net"), o = _e("tls"), { randomBytes: s, createHash: c } = _e("crypto"), { Duplex: l, Readable: u } = _e("stream"), { URL: d } = _e("url"), f = zj(), p = Wj(), m = Gj(), { isBlob: h } = Uj(), { BINARY_TYPES: g, CLOSE_TIMEOUT: _, EMPTY_BUFFER: v, GUID: y, kForOnEventAttribute: b, kListener: x, kStatusCode: S, kWebSocket: C, NOOP: w } = Nj(), { EventTarget: { addEventListener: T, removeEventListener: E } } = Kj(), { format: D, parse: ee } = qj(), { toBuffer: O } = Lj(), te = Symbol("kAborted"), ne = [8, 13], re = [
		"CONNECTING",
		"OPEN",
		"CLOSING",
		"CLOSED"
	], ie = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/, k = class e extends n {
		constructor(t, n, r) {
			super(), this._binaryType = g[0], this._closeCode = 1006, this._closeFrameReceived = !1, this._closeFrameSent = !1, this._closeMessage = v, this._closeTimer = null, this._errorEmitted = !1, this._extensions = {}, this._paused = !1, this._protocol = "", this._readyState = e.CONNECTING, this._receiver = null, this._sender = null, this._socket = null, t === null ? (this._autoPong = r.autoPong, this._closeTimeout = r.closeTimeout, this._isServer = !0) : (this._bufferedAmount = 0, this._isServer = !1, this._redirects = 0, n === void 0 ? n = !r || r.protocols === void 0 ? [] : Array.isArray(r.protocols) ? r.protocols : [r.protocols] : Array.isArray(n) || (typeof n == "object" && n ? (r = n, n = r.protocols === void 0 ? [] : Array.isArray(r.protocols) ? r.protocols : [r.protocols]) : n = [n]), ae(this, t, n, r));
		}
		get binaryType() {
			return this._binaryType;
		}
		set binaryType(e) {
			g.includes(e) && (this._binaryType = e, this._receiver && (this._receiver._binaryType = e));
		}
		get bufferedAmount() {
			return this._socket ? this._socket._writableState.length + this._sender._bufferedBytes : this._bufferedAmount;
		}
		get extensions() {
			return Object.keys(this._extensions).join();
		}
		get isPaused() {
			return this._paused;
		}
		/* istanbul ignore next */
		get onclose() {
			return null;
		}
		/* istanbul ignore next */
		get onerror() {
			return null;
		}
		/* istanbul ignore next */
		get onopen() {
			return null;
		}
		/* istanbul ignore next */
		get onmessage() {
			return null;
		}
		get protocol() {
			return this._protocol;
		}
		get readyState() {
			return this._readyState;
		}
		get url() {
			return this._url;
		}
		setSocket(t, n, r) {
			let i = new p({
				allowSynchronousEvents: r.allowSynchronousEvents,
				binaryType: this.binaryType,
				extensions: this._extensions,
				isServer: this._isServer,
				maxBufferedChunks: r.maxBufferedChunks,
				maxFragments: r.maxFragments,
				maxPayload: r.maxPayload,
				skipUTF8Validation: r.skipUTF8Validation
			}), a = new m(t, this._extensions, r.generateMask);
			this._receiver = i, this._sender = a, this._socket = t, i[C] = this, a[C] = this, t[C] = this, i.on("conclude", de), i.on("drain", fe), i.on("error", A), i.on("message", j), i.on("ping", me), i.on("pong", he), a.onerror = ve, t.setTimeout && t.setTimeout(0), t.setNoDelay && t.setNoDelay(), n.length > 0 && t.unshift(n), t.on("close", be), t.on("data", xe), t.on("end", Se), t.on("error", Ce), this._readyState = e.OPEN, this.emit("open");
		}
		emitClose() {
			this._socket ? (this._extensions[f.extensionName] && this._extensions[f.extensionName].cleanup(), this._receiver.removeAllListeners(), this._readyState = e.CLOSED, this.emit("close", this._closeCode, this._closeMessage)) : (this._readyState = e.CLOSED, this.emit("close", this._closeCode, this._closeMessage));
		}
		close(t, n) {
			this.readyState !== e.CLOSED && (this.readyState === e.CONNECTING ? le(this, this._req, "WebSocket was closed before the connection was established") : this.readyState === e.CLOSING ? this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted) && this._socket.end() : (this._sender.close(t, n, !this._isServer, (e) => {
				e || (this._closeFrameSent = !0, (this._closeFrameReceived || this._receiver._writableState.errorEmitted) && this._socket.end());
			}), this._readyState = e.CLOSING, ye(this)));
		}
		pause() {
			this.readyState !== e.CONNECTING && this.readyState !== e.CLOSED && (this._paused = !0, this._socket.pause());
		}
		ping(t, n, r) {
			if (this.readyState === e.CONNECTING) throw Error("WebSocket is not open: readyState 0 (CONNECTING)");
			typeof t == "function" ? (r = t, t = n = void 0) : typeof n == "function" && (r = n, n = void 0), typeof t == "number" && (t = t.toString()), this.readyState === e.OPEN ? (n === void 0 && (n = !this._isServer), this._sender.ping(t || v, n, r)) : ue(this, t, r);
		}
		pong(t, n, r) {
			if (this.readyState === e.CONNECTING) throw Error("WebSocket is not open: readyState 0 (CONNECTING)");
			typeof t == "function" ? (r = t, t = n = void 0) : typeof n == "function" && (r = n, n = void 0), typeof t == "number" && (t = t.toString()), this.readyState === e.OPEN ? (n === void 0 && (n = !this._isServer), this._sender.pong(t || v, n, r)) : ue(this, t, r);
		}
		resume() {
			this.readyState !== e.CONNECTING && this.readyState !== e.CLOSED && (this._paused = !1, this._receiver._writableState.needDrain || this._socket.resume());
		}
		send(t, n, r) {
			if (this.readyState === e.CONNECTING) throw Error("WebSocket is not open: readyState 0 (CONNECTING)");
			if (typeof n == "function" && (r = n, n = {}), typeof t == "number" && (t = t.toString()), this.readyState !== e.OPEN) {
				ue(this, t, r);
				return;
			}
			let i = {
				binary: typeof t != "string",
				mask: !this._isServer,
				compress: !0,
				fin: !0,
				...n
			};
			this._extensions[f.extensionName] || (i.compress = !1), this._sender.send(t || v, i, r);
		}
		terminate() {
			this.readyState !== e.CLOSED && (this.readyState === e.CONNECTING ? le(this, this._req, "WebSocket was closed before the connection was established") : this._socket && (this._readyState = e.CLOSING, this._socket.destroy()));
		}
	};
	Object.defineProperty(k, "CONNECTING", {
		enumerable: !0,
		value: re.indexOf("CONNECTING")
	}), Object.defineProperty(k.prototype, "CONNECTING", {
		enumerable: !0,
		value: re.indexOf("CONNECTING")
	}), Object.defineProperty(k, "OPEN", {
		enumerable: !0,
		value: re.indexOf("OPEN")
	}), Object.defineProperty(k.prototype, "OPEN", {
		enumerable: !0,
		value: re.indexOf("OPEN")
	}), Object.defineProperty(k, "CLOSING", {
		enumerable: !0,
		value: re.indexOf("CLOSING")
	}), Object.defineProperty(k.prototype, "CLOSING", {
		enumerable: !0,
		value: re.indexOf("CLOSING")
	}), Object.defineProperty(k, "CLOSED", {
		enumerable: !0,
		value: re.indexOf("CLOSED")
	}), Object.defineProperty(k.prototype, "CLOSED", {
		enumerable: !0,
		value: re.indexOf("CLOSED")
	}), [
		"binaryType",
		"bufferedAmount",
		"extensions",
		"isPaused",
		"protocol",
		"readyState",
		"url"
	].forEach((e) => {
		Object.defineProperty(k.prototype, e, { enumerable: !0 });
	}), [
		"open",
		"error",
		"close",
		"message"
	].forEach((e) => {
		Object.defineProperty(k.prototype, `on${e}`, {
			enumerable: !0,
			get() {
				for (let t of this.listeners(e)) if (t[b]) return t[x];
				return null;
			},
			set(t) {
				for (let t of this.listeners(e)) if (t[b]) {
					this.removeListener(e, t);
					break;
				}
				typeof t == "function" && this.addEventListener(e, t, { [b]: !0 });
			}
		});
	}), k.prototype.addEventListener = T, k.prototype.removeEventListener = E, t.exports = k;
	function ae(e, t, n, a) {
		let o = {
			allowSynchronousEvents: !0,
			autoPong: !0,
			closeTimeout: _,
			protocolVersion: ne[1],
			maxBufferedChunks: 262144,
			maxFragments: 16384,
			maxPayload: 104857600,
			skipUTF8Validation: !1,
			perMessageDeflate: !0,
			followRedirects: !1,
			maxRedirects: 10,
			...a,
			socketPath: void 0,
			hostname: void 0,
			protocol: void 0,
			protocols: void 0,
			timeout: void 0,
			method: "GET",
			host: void 0,
			path: void 0,
			port: void 0
		};
		if (e._autoPong = o.autoPong, e._closeTimeout = o.closeTimeout, !ne.includes(o.protocolVersion)) throw RangeError(`Unsupported protocol version: ${o.protocolVersion} (supported versions: ${ne.join(", ")})`);
		let l;
		if (t instanceof d) l = t;
		else try {
			l = new d(t);
		} catch {
			throw SyntaxError(`Invalid URL: ${t}`);
		}
		l.protocol === "http:" ? l.protocol = "ws:" : l.protocol === "https:" && (l.protocol = "wss:"), e._url = l.href;
		let u = l.protocol === "wss:", p = l.protocol === "ws+unix:", m;
		if (l.protocol !== "ws:" && !u && !p ? m = "The URL's protocol must be one of \"ws:\", \"wss:\", \"http:\", \"https:\", or \"ws+unix:\"" : p && !l.pathname ? m = "The URL's pathname is empty" : l.hash && (m = "The URL contains a fragment identifier"), m) {
			let t = SyntaxError(m);
			if (e._redirects === 0) throw t;
			oe(e, t);
			return;
		}
		let h = u ? 443 : 80, g = s(16).toString("base64"), v = u ? r.request : i.request, b = /* @__PURE__ */ new Set(), x;
		if (o.createConnection = o.createConnection || (u ? ce : se), o.defaultPort = o.defaultPort || h, o.port = l.port || h, o.host = l.hostname.startsWith("[") ? l.hostname.slice(1, -1) : l.hostname, o.headers = {
			...o.headers,
			"Sec-WebSocket-Version": o.protocolVersion,
			"Sec-WebSocket-Key": g,
			Connection: "Upgrade",
			Upgrade: "websocket"
		}, o.path = l.pathname + l.search, o.timeout = o.handshakeTimeout, o.perMessageDeflate && (x = new f({
			...o.perMessageDeflate,
			isServer: !1,
			maxPayload: o.maxPayload
		}), o.headers["Sec-WebSocket-Extensions"] = D({ [f.extensionName]: x.offer() })), n.length) {
			for (let e of n) {
				if (typeof e != "string" || !ie.test(e) || b.has(e)) throw SyntaxError("An invalid or duplicated subprotocol was specified");
				b.add(e);
			}
			o.headers["Sec-WebSocket-Protocol"] = n.join(",");
		}
		if (o.origin && (o.protocolVersion < 13 ? o.headers["Sec-WebSocket-Origin"] = o.origin : o.headers.Origin = o.origin), (l.username || l.password) && (o.auth = `${l.username}:${l.password}`), p) {
			let e = o.path.indexOf(":");
			e === -1 ? (o.socketPath = o.path, o.path = "") : (o.socketPath = o.path.slice(0, e), o.path = o.path.slice(e + 1));
		}
		let S;
		if (o.followRedirects) {
			if (e._redirects === 0) {
				e._originalIpc = p, e._originalSecure = u, e._originalHostOrSocketPath = p ? o.socketPath : l.host;
				let t = a && a.headers;
				if (a = {
					...a,
					headers: {}
				}, t) for (let [e, n] of Object.entries(t)) a.headers[e.toLowerCase()] = n;
			} else if (e.listenerCount("redirect") === 0) {
				let t = p ? e._originalIpc ? o.socketPath === e._originalHostOrSocketPath : !1 : !e._originalIpc && l.host === e._originalHostOrSocketPath;
				(!t || e._originalSecure && !u) && (delete o.headers.authorization, delete o.headers.cookie, t || delete o.headers.host, o.auth = void 0);
			}
			o.auth && !a.headers.authorization && (a.headers.authorization = "Basic " + Buffer.from(o.auth).toString("base64")), S = e._req = v(o), e._redirects && e.emit("redirect", e.url, S);
		} else S = e._req = v(o);
		o.timeout && S.on("timeout", () => {
			le(e, S, "Opening handshake has timed out");
		}), S.on("error", (t) => {
			S === null || S[te] || (S = e._req = null, oe(e, t));
		}), S.on("response", (r) => {
			let i = r.headers.location, s = r.statusCode;
			if (i && o.followRedirects && s >= 300 && s < 400) {
				if (++e._redirects > o.maxRedirects) {
					le(e, S, "Maximum redirects exceeded");
					return;
				}
				S.abort();
				let r;
				try {
					r = new d(i, t);
				} catch {
					oe(e, /* @__PURE__ */ SyntaxError(`Invalid URL: ${i}`));
					return;
				}
				ae(e, r, n, a);
			} else e.emit("unexpected-response", S, r) || le(e, S, `Unexpected server response: ${r.statusCode}`);
		}), S.on("upgrade", (t, n, r) => {
			if (e.emit("upgrade", t), e.readyState !== k.CONNECTING) return;
			S = e._req = null;
			let i = t.headers.upgrade;
			if (i === void 0 || i.toLowerCase() !== "websocket") {
				le(e, n, "Invalid Upgrade header");
				return;
			}
			let a = c("sha1").update(g + y).digest("base64");
			if (t.headers["sec-websocket-accept"] !== a) {
				le(e, n, "Invalid Sec-WebSocket-Accept header");
				return;
			}
			let s = t.headers["sec-websocket-protocol"], l;
			if (s === void 0 ? b.size && (l = "Server sent no subprotocol") : b.size ? b.has(s) || (l = "Server sent an invalid subprotocol") : l = "Server sent a subprotocol but none was requested", l) {
				le(e, n, l);
				return;
			}
			s && (e._protocol = s);
			let u = t.headers["sec-websocket-extensions"];
			if (u !== void 0) {
				if (!x) {
					le(e, n, "Server sent a Sec-WebSocket-Extensions header but no extension was requested");
					return;
				}
				let t;
				try {
					t = ee(u);
				} catch {
					le(e, n, "Invalid Sec-WebSocket-Extensions header");
					return;
				}
				let r = Object.keys(t);
				if (r.length !== 1 || r[0] !== f.extensionName) {
					le(e, n, "Server indicated an extension that was not requested");
					return;
				}
				try {
					x.accept(t[f.extensionName]);
				} catch {
					le(e, n, "Invalid Sec-WebSocket-Extensions header");
					return;
				}
				e._extensions[f.extensionName] = x;
			}
			e.setSocket(n, r, {
				allowSynchronousEvents: o.allowSynchronousEvents,
				generateMask: o.generateMask,
				maxBufferedChunks: o.maxBufferedChunks,
				maxFragments: o.maxFragments,
				maxPayload: o.maxPayload,
				skipUTF8Validation: o.skipUTF8Validation
			});
		}), o.finishRequest ? o.finishRequest(S, e) : S.end();
	}
	function oe(e, t) {
		e._readyState = k.CLOSING, e._errorEmitted = !0, e.emit("error", t), e.emitClose();
	}
	function se(e) {
		return e.path = e.socketPath, a.connect(e);
	}
	function ce(e) {
		return e.path = void 0, !e.servername && e.servername !== "" && (e.servername = a.isIP(e.host) ? "" : e.host), o.connect(e);
	}
	function le(e, t, n) {
		e._readyState = k.CLOSING;
		let r = Error(n);
		Error.captureStackTrace(r, le), t.setHeader ? (t[te] = !0, t.abort(), t.socket && !t.socket.destroyed && t.socket.destroy(), process.nextTick(oe, e, r)) : (t.destroy(r), t.once("error", e.emit.bind(e, "error")), t.once("close", e.emitClose.bind(e)));
	}
	function ue(e, t, n) {
		if (t) {
			let n = h(t) ? t.size : O(t).length;
			e._socket ? e._sender._bufferedBytes += n : e._bufferedAmount += n;
		}
		if (n) {
			let t = /* @__PURE__ */ Error(`WebSocket is not open: readyState ${e.readyState} (${re[e.readyState]})`);
			process.nextTick(n, t);
		}
	}
	function de(e, t) {
		let n = this[C];
		n._closeFrameReceived = !0, n._closeMessage = t, n._closeCode = e, n._socket[C] !== void 0 && (n._socket.removeListener("data", xe), process.nextTick(ge, n._socket), e === 1005 ? n.close() : n.close(e, t));
	}
	function fe() {
		let e = this[C];
		e.isPaused || e._socket.resume();
	}
	function A(e) {
		let t = this[C];
		t._socket[C] !== void 0 && (t._socket.removeListener("data", xe), process.nextTick(ge, t._socket), t.close(e[S])), t._errorEmitted || (t._errorEmitted = !0, t.emit("error", e));
	}
	function pe() {
		this[C].emitClose();
	}
	function j(e, t) {
		this[C].emit("message", e, t);
	}
	function me(e) {
		let t = this[C];
		t._autoPong && t.pong(e, !this._isServer, w), t.emit("ping", e);
	}
	function he(e) {
		this[C].emit("pong", e);
	}
	function ge(e) {
		e.resume();
	}
	function ve(e) {
		let t = this[C];
		t.readyState !== k.CLOSED && (t.readyState === k.OPEN && (t._readyState = k.CLOSING, ye(t)), this._socket.end(), t._errorEmitted || (t._errorEmitted = !0, t.emit("error", e)));
	}
	function ye(e) {
		e._closeTimer = setTimeout(e._socket.destroy.bind(e._socket), e._closeTimeout);
	}
	function be() {
		let e = this[C];
		if (this.removeListener("close", be), this.removeListener("data", xe), this.removeListener("end", Se), e._readyState = k.CLOSING, !this._readableState.endEmitted && !e._closeFrameReceived && !e._receiver._writableState.errorEmitted && this._readableState.length !== 0) {
			let t = this.read(this._readableState.length);
			e._receiver.write(t);
		}
		e._receiver.end(), this[C] = void 0, clearTimeout(e._closeTimer), e._receiver._writableState.finished || e._receiver._writableState.errorEmitted ? e.emitClose() : (e._receiver.on("error", pe), e._receiver.on("finish", pe));
	}
	function xe(e) {
		this[C]._receiver.write(e) || this.pause();
	}
	function Se() {
		let e = this[C];
		e._readyState = k.CLOSING, e._receiver.end(), this.end();
	}
	function Ce() {
		let e = this[C];
		this.removeListener("error", Ce), this.on("error", w), e && (e._readyState = k.CLOSING, this.destroy());
	}
})), Yj = /* @__PURE__ */ pe(((e, t) => {
	Jj();
	var { Duplex: n } = _e("stream");
	function r(e) {
		e.emit("close");
	}
	function i() {
		!this.destroyed && this._writableState.finished && this.destroy();
	}
	function a(e) {
		this.removeListener("error", a), this.destroy(), this.listenerCount("error") === 0 && this.emit("error", e);
	}
	function o(e, t) {
		let o = !0, s = new n({
			...t,
			autoDestroy: !1,
			emitClose: !1,
			objectMode: !1,
			writableObjectMode: !1
		});
		return e.on("message", function(t, n) {
			let r = !n && s._readableState.objectMode ? t.toString() : t;
			s.push(r) || e.pause();
		}), e.once("error", function(e) {
			s.destroyed || (o = !1, s.destroy(e));
		}), e.once("close", function() {
			s.destroyed || s.push(null);
		}), s._destroy = function(t, n) {
			if (e.readyState === e.CLOSED) {
				n(t), process.nextTick(r, s);
				return;
			}
			let i = !1;
			e.once("error", function(e) {
				i = !0, n(e);
			}), e.once("close", function() {
				i || n(t), process.nextTick(r, s);
			}), o && e.terminate();
		}, s._final = function(t) {
			e.readyState === e.CONNECTING ? e.once("open", function() {
				s._final(t);
			}) : e._socket !== null && (e._socket._writableState.finished ? (t(), s._readableState.endEmitted && s.destroy()) : (e._socket.once("finish", function() {
				t();
			}), e.close()));
		}, s._read = function() {
			e.isPaused && e.resume();
		}, s._write = function(t, n, r) {
			e.readyState === e.CONNECTING ? e.once("open", function() {
				s._write(t, n, r);
			}) : e.send(t, r);
		}, s.on("end", i), s.on("error", a), s;
	}
	t.exports = o;
})), Xj = /* @__PURE__ */ pe(((e, t) => {
	var { tokenChars: n } = Uj();
	function r(e) {
		let t = /* @__PURE__ */ new Set(), r = -1, i = -1, a = 0;
		for (; a < e.length; a++) {
			let o = e.charCodeAt(a);
			if (i === -1 && n[o] === 1) r === -1 && (r = a);
			else if (a !== 0 && (o === 32 || o === 9)) i === -1 && r !== -1 && (i = a);
			else if (o === 44) {
				if (r === -1) throw SyntaxError(`Unexpected character at index ${a}`);
				i === -1 && (i = a);
				let n = e.slice(r, i);
				if (t.has(n)) throw SyntaxError(`The "${n}" subprotocol is duplicated`);
				t.add(n), r = i = -1;
			} else throw SyntaxError(`Unexpected character at index ${a}`);
		}
		if (r === -1 || i !== -1) throw SyntaxError("Unexpected end of input");
		let o = e.slice(r, a);
		if (t.has(o)) throw SyntaxError(`The "${o}" subprotocol is duplicated`);
		return t.add(o), t;
	}
	t.exports = { parse: r };
})), Zj = /* @__PURE__ */ pe(((e, t) => {
	var n = _e("events"), r = _e("http"), { Duplex: i } = _e("stream"), { createHash: a } = _e("crypto"), o = qj(), s = zj(), c = Xj(), l = Jj(), { CLOSE_TIMEOUT: u, GUID: d, kWebSocket: f } = Nj(), p = /^[+/0-9A-Za-z]{22}==$/, m = 0, h = 1, g = 2;
	t.exports = class extends n {
		constructor(e, t) {
			if (super(), e = {
				allowSynchronousEvents: !0,
				autoPong: !0,
				maxBufferedChunks: 262144,
				maxFragments: 16384,
				maxPayload: 104857600,
				skipUTF8Validation: !1,
				perMessageDeflate: !1,
				handleProtocols: null,
				clientTracking: !0,
				closeTimeout: u,
				verifyClient: null,
				noServer: !1,
				backlog: null,
				server: null,
				host: null,
				path: null,
				port: null,
				WebSocket: l,
				...e
			}, e.port == null && !e.server && !e.noServer || e.port != null && (e.server || e.noServer) || e.server && e.noServer) throw TypeError("One and only one of the \"port\", \"server\", or \"noServer\" options must be specified");
			if (e.port == null ? e.server && (this._server = e.server) : (this._server = r.createServer((e, t) => {
				let n = r.STATUS_CODES[426];
				t.writeHead(426, {
					"Content-Length": n.length,
					"Content-Type": "text/plain"
				}), t.end(n);
			}), this._server.listen(e.port, e.host, e.backlog, t)), this._server) {
				let e = this.emit.bind(this, "connection");
				this._removeListeners = _(this._server, {
					listening: this.emit.bind(this, "listening"),
					error: this.emit.bind(this, "error"),
					upgrade: (t, n, r) => {
						this.handleUpgrade(t, n, r, e);
					}
				});
			}
			e.perMessageDeflate === !0 && (e.perMessageDeflate = {}), e.clientTracking && (this.clients = /* @__PURE__ */ new Set(), this._shouldEmitClose = !1), this.options = e, this._state = m;
		}
		address() {
			if (this.options.noServer) throw Error("The server is operating in \"noServer\" mode");
			return this._server ? this._server.address() : null;
		}
		close(e) {
			if (this._state === g) e && this.once("close", () => {
				e(/* @__PURE__ */ Error("The server is not running"));
			}), process.nextTick(v, this);
			else if (e && this.once("close", e), this._state !== h) {
				if (this._state = h, this.options.noServer || this.options.server) this._server && (this._removeListeners(), this._removeListeners = this._server = null), this.clients && this.clients.size ? this._shouldEmitClose = !0 : process.nextTick(v, this);
				else {
					let e = this._server;
					this._removeListeners(), this._removeListeners = this._server = null, e.close(() => {
						v(this);
					});
				}
			}
		}
		shouldHandle(e) {
			if (this.options.path) {
				let t = e.url.indexOf("?");
				if ((t === -1 ? e.url : e.url.slice(0, t)) !== this.options.path) return !1;
			}
			return !0;
		}
		handleUpgrade(e, t, n, r) {
			t.on("error", y);
			let i = e.headers["sec-websocket-key"], a = e.headers.upgrade, l = +e.headers["sec-websocket-version"];
			if (e.method !== "GET") {
				x(this, e, t, 405, "Invalid HTTP method");
				return;
			}
			if (a === void 0 || a.toLowerCase() !== "websocket") {
				x(this, e, t, 400, "Invalid Upgrade header");
				return;
			}
			if (i === void 0 || !p.test(i)) {
				x(this, e, t, 400, "Missing or invalid Sec-WebSocket-Key header");
				return;
			}
			if (l !== 13 && l !== 8) {
				x(this, e, t, 400, "Missing or invalid Sec-WebSocket-Version header", { "Sec-WebSocket-Version": "13, 8" });
				return;
			}
			if (!this.shouldHandle(e)) {
				b(t, 400);
				return;
			}
			let u = e.headers["sec-websocket-protocol"], d = /* @__PURE__ */ new Set();
			if (u !== void 0) try {
				d = c.parse(u);
			} catch {
				x(this, e, t, 400, "Invalid Sec-WebSocket-Protocol header");
				return;
			}
			let f = e.headers["sec-websocket-extensions"], m = {};
			if (this.options.perMessageDeflate && f !== void 0) {
				let n = new s({
					...this.options.perMessageDeflate,
					isServer: !0,
					maxPayload: this.options.maxPayload
				});
				try {
					let e = o.parse(f);
					e[s.extensionName] && (n.accept(e[s.extensionName]), m[s.extensionName] = n);
				} catch {
					x(this, e, t, 400, "Invalid or unacceptable Sec-WebSocket-Extensions header");
					return;
				}
			}
			if (this.options.verifyClient) {
				let a = {
					origin: e.headers[`${l === 8 ? "sec-websocket-origin" : "origin"}`],
					secure: !!(e.socket.authorized || e.socket.encrypted),
					req: e
				};
				if (this.options.verifyClient.length === 2) {
					this.options.verifyClient(a, (a, o, s, c) => {
						if (!a) return b(t, o || 401, s, c);
						this.completeUpgrade(m, i, d, e, t, n, r);
					});
					return;
				}
				if (!this.options.verifyClient(a)) return b(t, 401);
			}
			this.completeUpgrade(m, i, d, e, t, n, r);
		}
		completeUpgrade(e, t, n, r, i, c, l) {
			if (!i.readable || !i.writable) return i.destroy();
			if (i[f]) throw Error("server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration");
			if (this._state > m) return b(i, 503);
			let u = [
				"HTTP/1.1 101 Switching Protocols",
				"Upgrade: websocket",
				"Connection: Upgrade",
				`Sec-WebSocket-Accept: ${a("sha1").update(t + d).digest("base64")}`
			], p = new this.options.WebSocket(null, void 0, this.options);
			if (n.size) {
				let e = this.options.handleProtocols ? this.options.handleProtocols(n, r) : n.values().next().value;
				e && (u.push(`Sec-WebSocket-Protocol: ${e}`), p._protocol = e);
			}
			if (e[s.extensionName]) {
				let t = e[s.extensionName].params, n = o.format({ [s.extensionName]: [t] });
				u.push(`Sec-WebSocket-Extensions: ${n}`), p._extensions = e;
			}
			this.emit("headers", u, r), i.write(u.concat("\r\n").join("\r\n")), i.removeListener("error", y), p.setSocket(i, c, {
				allowSynchronousEvents: this.options.allowSynchronousEvents,
				maxBufferedChunks: this.options.maxBufferedChunks,
				maxFragments: this.options.maxFragments,
				maxPayload: this.options.maxPayload,
				skipUTF8Validation: this.options.skipUTF8Validation
			}), this.clients && (this.clients.add(p), p.on("close", () => {
				this.clients.delete(p), this._shouldEmitClose && !this.clients.size && process.nextTick(v, this);
			})), l(p, r);
		}
	};
	function _(e, t) {
		for (let n of Object.keys(t)) e.on(n, t[n]);
		return function() {
			for (let n of Object.keys(t)) e.removeListener(n, t[n]);
		};
	}
	function v(e) {
		e._state = g, e.emit("close");
	}
	function y() {
		this.destroy();
	}
	function b(e, t, n, i) {
		n ||= r.STATUS_CODES[t], i = {
			Connection: "close",
			"Content-Type": "text/html",
			"Content-Length": Buffer.byteLength(n),
			...i
		}, e.once("finish", e.destroy), e.end(`HTTP/1.1 ${t} ${r.STATUS_CODES[t]}\r\n` + Object.keys(i).map((e) => `${e}: ${i[e]}`).join("\r\n") + "\r\n\r\n" + n);
	}
	function x(e, t, n, r, i, a) {
		if (e.listenerCount("wsClientError")) {
			let r = Error(i);
			Error.captureStackTrace(r, x), e.emit("wsClientError", r, n, t);
		} else b(n, r, i, a);
	}
})), Qj, $j = A((() => {
	Yj(), qj(), zj(), Wj(), Gj(), Xj(), Jj(), Qj = /* @__PURE__ */ he(Zj(), 1);
}));
// scripts/gpu-frame-reader.mjs
function eM({ width: e, height: t, fps: n }) {
	return {
		input: [
			"-f",
			"rawvideo",
			"-pix_fmt",
			"rgba",
			"-s",
			`${e}x${t}`,
			"-framerate",
			String(n)
		],
		filter: ["-vf", "vflip,scale=out_color_matrix=bt709:out_range=tv"]
	};
}
function tM({ maximumBytes: e }) {
	let t = `/__frame/${re(12).toString("hex")}`, n = new Qj.default({
		noServer: !0,
		maxPayload: e,
		perMessageDeflate: !1
	}), r = Buffer.from([1]), i, a;
	return n.on("connection", (e) => {
		e.on("message", (t, n) => {
			n && a ? a(t) : (n && (i = t), e.send(r));
		});
	}), Object.freeze({
		path: t,
		handleUpgrade(e, r, i) {
			return e.url === t && (n.handleUpgrade(e, r, i, (t) => n.emit("connection", t, e)), !0);
		},
		onChunk(e) {
			a = e;
		},
		take({ width: e, height: t }, n) {
			if (n.width !== e || n.height !== t) throw Error(`The drawing buffer is ${n.width}x${n.height} but the video is ${e}x${t}.`);
			let r = i;
			if (i = void 0, !r || r.length !== e * t * 4) throw Error("The page did not deliver a complete frame.");
			return r;
		},
		close() {
			for (let e of n.clients) e.terminate();
			n.close();
		}
	});
}
function nM(e) {
	let t = 16 * 1024 ** 2, n, r, i, a, o, s = () => new Promise((e) => setTimeout(e, 1));
	window.__finishDraw = () => document.querySelector("canvas").getContext("webgl2").finish(), window.__startVideoEncoder = async ({ width: t, height: s, fps: c, quantizer: l }) => {
		if (typeof VideoEncoder > "u" || typeof VideoFrame > "u") return {
			supported: !1,
			reason: "WebCodecs is unavailable."
		};
		let u = {
			codec: `avc1.6400${t * s > 2088960 ? "33" : "28"}`,
			width: t,
			height: s,
			framerate: c,
			bitrate: 2e7,
			bitrateMode: "quantizer",
			hardwareAcceleration: "prefer-hardware",
			latencyMode: "quality",
			avc: { format: "annexb" }
		};
		return (await VideoEncoder.isConfigSupported(u)).supported ? (r = new WebSocket(e), r.binaryType = "arraybuffer", await new Promise((e, t) => {
			r.onopen = () => e(), r.onerror = () => t(/* @__PURE__ */ Error("The video socket could not connect."));
		}), r.onmessage = () => a?.(), n = new VideoEncoder({
			output: (e) => {
				let t = new Uint8Array(e.byteLength);
				e.copyTo(t), r.send(t);
			},
			error: (e) => {
				i = e;
			}
		}), n.configure(u), o = {
			fps: c,
			quantizer: l,
			keyFrameInterval: c * 2
		}, { supported: !0 }) : {
			supported: !1,
			reason: "The browser cannot encode this size with a hardware H.264 encoder."
		};
	}, window.__encodeFrame = async (e) => {
		if (i) throw Error(`The page video encoder failed: ${i.message}`);
		let a = performance.now(), c = new VideoFrame(document.querySelector("canvas"), { timestamp: Math.round(e * 1e6 / o.fps) });
		n.encode(c, {
			keyFrame: e % o.keyFrameInterval === 0,
			avc: { quantizer: o.quantizer }
		}), c.close();
		let l = performance.now() - a;
		for (; n.encodeQueueSize > 3 || r.bufferedAmount > t;) await s();
		return {
			submitMilliseconds: l,
			waitMilliseconds: performance.now() - a - l
		};
	}, window.__finishVideoEncoder = async () => {
		if (await n.flush(), i) throw Error(`The page video encoder failed: ${i.message}`);
		let e = new Promise((e) => {
			a = e;
		});
		r.send("end"), await e, n.close(), r.close();
	};
}
async function rM(e, t, { width: n, height: r, fps: i, quantizer: a }) {
	return await e.evaluate(nM, t), e.evaluate((e) => window.__startVideoEncoder(e), {
		width: n,
		height: r,
		fps: i,
		quantizer: a
	});
}
var iM = A((() => {
	$j();
}));
// scripts/frame-encoder.mjs
function aM(e) {
	if (e === "aac") return [
		"-c:a",
		"aac",
		"-b:a",
		"192k"
	];
	if (e === "pcm") return ["-c:a", "pcm_s16le"];
	throw TypeError("Audio codec must be aac or pcm.");
}
function oM({ executable: e = "ffmpeg", output: t, fps: n, format: r = "jpeg", backend: i = "cpu", audioArguments: a = [], audioCodec: o = "aac", width: s, height: c, signal: l, maximumFrameBytes: u = 1048576, maximumOutputBytes: d = 134217728, timeoutMs: f = sM } = {}) {
	if (typeof t != "string" || !t || !Number.isFinite(n) || n < 1 || n > 60 || ![
		"jpeg",
		"png",
		"rawvideo",
		"h264"
	].includes(r) || !["cpu", "gpu"].includes(i)) throw TypeError("Encoder requires an output path, valid fps, format and backend.");
	for (let e of [
		u,
		d,
		f
	]) if (!Number.isSafeInteger(e) || e <= 0) throw RangeError("Encoder limits must be positive safe integers.");
	if (r === "rawvideo" && !(Number.isSafeInteger(s) && Number.isSafeInteger(c) && s > 0 && c > 0)) throw TypeError("Raw video frames need a width and a height.");
	l?.throwIfAborted();
	let p = r === "rawvideo" ? eM({
		width: s,
		height: c,
		fps: n
	}) : void 0, h = r === "h264", g = h ? ["-c:v", "copy"] : i === "gpu" ? [
		"-c:v",
		"h264_nvenc",
		"-preset",
		"p5",
		"-cq",
		"20"
	] : [
		"-c:v",
		"libx264",
		"-preset",
		"fast",
		"-crf",
		"18",
		"-threads",
		"2"
	], _ = [
		"-hide_banner",
		"-loglevel",
		"error",
		"-y",
		...h ? [
			"-f",
			"h264",
			"-framerate",
			String(n)
		] : p ? p.input : [
			"-f",
			"image2pipe",
			"-framerate",
			String(n),
			"-vcodec",
			r === "jpeg" ? "mjpeg" : "png"
		],
		"-i",
		"pipe:0",
		...a,
		...p ? p.filter : [],
		...g,
		...h ? [] : ["-pix_fmt", "yuv420p"],
		"-color_primaries",
		"bt709",
		"-color_trc",
		"bt709",
		"-colorspace",
		"bt709",
		"-movflags",
		"+faststart",
		...a.length ? [...aM(o), "-shortest"] : [],
		"-f",
		"mp4",
		t
	], v = ae(e, _, {
		windowsHide: !0,
		stdio: [
			"pipe",
			"ignore",
			"pipe"
		]
	}), y = "", b, x = !1, S = "writing", C, w = {
		frames: 0,
		chunks: 0,
		maximumPendingFrames: 0,
		backpressureSeconds: 0,
		finishSeconds: 0
	}, T = (e) => {
		y = (y + String(e)).slice(-8192);
	};
	v.stderr.on("data", T), v.on("error", (e) => {
		b = e, T(e.message);
	}), v.stdin.on("error", (e) => {
		b = e, T(e.message);
	});
	let E, D = new Promise((e) => {
		v.once("error", (t) => {
			v.pid || (E = { error: t }, e(E));
		}), v.once("close", (t, n) => {
			E = {
				code: t,
				terminationSignal: n
			}, e(E);
		});
	});
	function ee() {
		return /* @__PURE__ */ Error(`Video encoder stopped: ${y || b?.message || E?.terminationSignal || E?.code}`);
	}
	function O() {
		E || v.kill();
	}
	l?.addEventListener("abort", O, { once: !0 });
	function te() {
		if (l?.throwIfAborted(), b || E || v.stdin.destroyed) throw ee();
	}
	async function ne() {
		let e;
		try {
			e = await m(t);
		} catch (e) {
			if (e.code !== "ENOENT") throw e;
		}
		if (e?.size > d) throw Error("Video output exceeded its byte budget.");
	}
	async function re(e, t, n = f) {
		let r, i, a = new Promise((e, t) => {
			i = () => t(l.reason);
		});
		l?.addEventListener("abort", i, { once: !0 });
		try {
			return l?.throwIfAborted(), await Promise.race([
				e,
				a,
				new Promise((e, i) => {
					r = setTimeout(() => i(Error(t)), n);
				})
			]);
		} finally {
			clearTimeout(r), l?.removeEventListener("abort", i);
		}
	}
	return Object.freeze({
		get pid() {
			return v.pid;
		},
		get metrics() {
			return { ...w };
		},
		async writeFrame(e) {
			if (S !== "writing" || x) throw Error("Encoder accepts one pending frame and no frames after finalization.");
			if (!(e instanceof Uint8Array) || !e.byteLength || e.byteLength > u) throw RangeError("Captured frame exceeded its byte budget or was empty.");
			te(), x = !0, w.maximumPendingFrames = 1;
			try {
				let t, n = new Promise((n, r) => {
					t = v.stdin.write(e, (e) => e ? r(e) : n());
				});
				if (n.catch(() => {}), !t) {
					let e = oe.now(), t, n = new Promise((e, n) => {
						let r = () => e(), i = (e) => n(e), a = () => n(ee());
						t = () => {
							v.stdin.off("drain", r), v.stdin.off("error", i), v.off("close", a);
						}, v.stdin.once("drain", r), v.stdin.once("error", i), v.once("close", a);
					});
					try {
						await re(n, "Video encoder drain exceeded its deadline.");
					} finally {
						t();
					}
					w.backpressureSeconds += (oe.now() - e) / 1e3;
				}
				await re(n, "Video encoder write exceeded its deadline."), te(), await ne(), w.frames++;
			} finally {
				x = !1;
			}
		},
		writeChunk(e) {
			if (!h) throw Error("Chunks are for encoder format h264.");
			if (S !== "writing") throw Error("Encoder accepts no chunks after finalization.");
			te(), v.stdin.write(e), w.chunks++;
		},
		async finish() {
			if (S !== "writing" || x) throw Error("Finish requires an idle encoder that has not been finalized.");
			te(), S = "finalizing";
			let e = oe.now();
			v.stdin.end();
			let t = await re(D, "Video encoder finalization exceeded its deadline.");
			if (w.finishSeconds = (oe.now() - e) / 1e3, t.code !== 0 || b) throw ee();
			return await ne(), S = "completed", l?.removeEventListener("abort", O), { ...w };
		},
		close() {
			return C ??= (async () => {
				S = "closed", l?.removeEventListener("abort", O), v.stdin.destroy(), E || v.kill();
				let e, t = await Promise.race([D.then(() => !0), new Promise((t) => {
					e = setTimeout(() => t(!1), f);
				})]);
				if (clearTimeout(e), !t) {
					v.kill("SIGKILL");
					let t = await Promise.race([D.then(() => !0), new Promise((t) => {
						e = setTimeout(() => t(!1), f);
					})]);
					if (clearTimeout(e), !t) throw Error("Owned video encoder failed to exit after termination.");
				}
			})(), C;
		}
	});
}
var sM, cM = A((() => {
	iM(), sM = 3e4;
}));
// scripts/job-audio.mjs
function lM(e) {
	if (typeof e != "string" || !y(e)) throw TypeError("Audio root must be an explicit absolute directory path.");
	return Object.freeze({ async resolve(t) {
		if (typeof t != "string" || !Gy.test(t)) throw TypeError("Audio file name is not allowed.");
		let n = b(e, t), r = await a(n).catch(() => {
			throw RangeError(`Audio file ${t} is not in the audio folder.`);
		});
		if (!r.isFile() || r.isSymbolicLink() || r.nlink > 1) throw RangeError(`Audio file ${t} must be a regular file without links.`);
		if (r.size < 1 || r.size > pM) throw RangeError(`Audio file ${t} must be 1 byte to ${pM} bytes.`);
		let i = await u(e);
		if (!(await u(n)).startsWith(i + C)) throw RangeError("Audio file resolves outside the audio folder.");
		return n;
	} });
}
function uM(e, t) {
	return [
		"-protocol_whitelist",
		"file",
		"-ss",
		String(t),
		"-i",
		e,
		"-ar",
		String(hM)
	];
}
function dM(e) {
	let t = [...e.matchAll(/time=(\d+):(\d+):(\d+(?:\.\d+)?)/g)].at(-1);
	if (!t) throw Error("ffmpeg reported no decoded duration.");
	return Number(t[1]) * 3600 + Number(t[2]) * 60 + Number(t[3]);
}
function fM(e, t, n, { format: r } = {}) {
	let i = n === "audio" ? [
		"-map",
		"0:a:0",
		"-vn"
	] : [
		"-map",
		"0:v:0",
		"-an"
	], a = [
		"-hide_banner",
		"-nostdin",
		"-protocol_whitelist",
		"file",
		...r ? ["-f", r] : [],
		"-i",
		t,
		...i,
		"-f",
		"null",
		"-"
	];
	return new Promise((t, r) => {
		let i = ae(e, a, {
			windowsHide: !0,
			stdio: [
				"ignore",
				"ignore",
				"pipe"
			]
		}), o = "";
		i.stderr.on("data", (e) => {
			o = (o + e).slice(-16384);
		});
		let s = setTimeout(() => i.kill(), mM);
		i.once("error", r), i.once("close", (e) => {
			if (clearTimeout(s), e !== 0) return r(/* @__PURE__ */ Error(`ffmpeg could not decode the ${n} stream: ${o.slice(-300)}`));
			try {
				t(dM(o));
			} catch (e) {
				r(e);
			}
		});
	});
}
var pM, mM, hM, gM = A((() => {
	$y(), pM = 32 * 1024 ** 2, mM = 3e4, hM = 48e3;
}));
// scripts/preview-host.mjs
function _M(e, t) {
	return e === `127.0.0.1:${t}`;
}
var vM = A((() => {}));
// scripts/agent-review.mjs
function yM(e, t, n) {
	if (!e || typeof e != "object" || Array.isArray(e) || Object.keys(e).some((e) => !t.includes(e))) throw TypeError(`Invalid or unknown ${n} fields.`);
}
function bM(e, t) {
	if (!Number.isFinite(e) || e < 0 || e > 3600) throw RangeError(`${t} must be finite and within zero and 3600.`);
	return e;
}
function xM(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of e.entries()) t.has(r.branch) || t.set(r.branch, {
		branch: r.branch,
		shotIndexes: []
	}), t.get(r.branch).shotIndexes.push(n);
	return [...t.values()];
}
function SM(e) {
	if (yM(e, [
		"sessionId",
		"expectedRevision",
		"width",
		"height",
		"shots",
		"labels"
	], "review"), e.labels !== void 0 && typeof e.labels != "boolean") throw TypeError("Review labels must be boolean.");
	if (typeof e.sessionId != "string" || !Number.isSafeInteger(e.expectedRevision) || e.expectedRevision < 0) throw TypeError("Review requires a sessionId and a safe nonnegative expectedRevision.");
	let t = e.width === void 0 ? CM.defaultWidth : e.width, n = e.height === void 0 ? CM.defaultHeight : e.height;
	if (![t, n].every((e) => Number.isInteger(e) && e >= 64 && e <= 480)) throw RangeError("Review dimensions must be integers from 64 to 480.");
	if (!Array.isArray(e.shots) || e.shots.length < 1 || e.shots.length > 4) throw RangeError("Review requires one to four shots.");
	let r = e.shots.map((e, t) => {
		if (yM(e, [
			"label",
			"camera",
			"animation",
			"motionTime",
			"rendererTime",
			"branch"
		], "shot"), e.branch !== void 0 && (wu(e.branch), e.animation !== void 0)) throw TypeError("A branch shot cannot sample an imported animation.");
		if (e.label !== void 0 && (typeof e.label != "string" || e.label.length > 48)) throw TypeError("Shot label must be a string of at most 48 characters.");
		if (e.camera !== void 0) {
			yM(e.camera, [
				"eye",
				"target",
				"up",
				"fov",
				"near",
				"far"
			], "camera");
			for (let [t, n] of Object.entries(e.camera)) {
				let e = [
					"eye",
					"target",
					"up"
				].includes(t) ? n : [n];
				if (!Array.isArray(e) || e.length !== ([
					"eye",
					"target",
					"up"
				].includes(t) ? 3 : 1) || !e.every((e) => Number.isFinite(e) && Number.isFinite(Math.fround(e)))) throw RangeError("Shot camera must contain finite Float32 values.");
			}
		}
		if (e.animation !== void 0) {
			if (yM(e.animation, ["clip", "time"], "animation"), !Number.isSafeInteger(e.animation.clip) || e.animation.clip < 0) throw RangeError("Invalid animation clip.");
			bM(e.animation.time, "Animation time");
		}
		let n = e.motionTime ?? null;
		return n !== null && bM(n, "Motion time"), {
			label: e.label ?? e.branch ?? `View ${t + 1}`,
			...e.branch === void 0 ? {} : { branch: e.branch },
			...e.camera === void 0 ? {} : { camera: structuredClone(e.camera) },
			...e.animation === void 0 ? {} : { animation: structuredClone(e.animation) },
			motionTime: n,
			rendererTime: bM(e.rendererTime === void 0 ? 0 : e.rendererTime, "Renderer time")
		};
	}), i = r.length > 1 ? 2 : 1, a = xM(r);
	return {
		sessionId: e.sessionId,
		expectedRevision: e.expectedRevision,
		width: t,
		height: n,
		shots: r,
		groups: a,
		branchNames: [...new Set(r.flatMap((e) => e.branch === void 0 ? [] : [e.branch]))],
		labels: e.labels === !0,
		gridWidth: t * i,
		gridHeight: (n + CM.labelHeight) * Math.ceil(r.length / i),
		columns: i
	};
}
var CM, wM = A((() => {
	CM = Object.freeze({
		minimumShots: 1,
		maximumShots: 4,
		minimumDimension: 64,
		maximumDimension: 480,
		defaultWidth: 384,
		defaultHeight: 384,
		labelHeight: 24,
		maximumLabelLength: 48,
		maximumGridWidth: 960,
		maximumGridHeight: 1008,
		maximumImageBytes: 1048576,
		maximumPendingFrames: 1
	});
}));
// src/frame-checks.js
function TM(e, t) {
	if (t?.length) {
		e.diagnostics ??= [];
		for (let n of t) e.diagnostics.some((e) => e.kind === n.kind && e.target === n.target && e.message === n.message) || e.diagnostics.push(n);
	}
}
var EM = A((() => {}));
// src/agent-errors.js
function DM(e, t, { openSessionIds: n = [], evictedSessionIds: r = [] } = {}) {
	return r.includes(e) ? `sessionId ${e} was evicted: the server keeps a limited number of open scenes and closes the least recently used one when a new scene is created.${n.length ? ` Open scenes: ${n.join(", ")}.` : ""} Pass the sessionId of an open scene, or call scene_create again (scene_export_recipe saves a scene before it is evicted).` : t ? n.length > 1 ? `Unknown scene session ${e}. Open scenes: ${n.join(", ")}; the last used is ${t}. Pass one of them as sessionId, leave sessionId out for the last used scene, or call scene_create for a new scene.` : `Unknown scene session ${e}. The active session is ${t}; leave sessionId out or pass that one, or call scene_dispose and then scene_create for a new scene.` : "No scene is active: it was never created, was disposed, or scene_create failed. Call scene_create or scene_create_asset first, then pass the sessionId it returns.";
}
var OM, kM = A((() => {
	OM = Object.freeze({
		maxOpenScenes: 4,
		maxOpenSceneBytes: 100663296
	});
})), AM = /* @__PURE__ */ j({ createAgentRuntime: () => MM });
function jM(e) {
	let t = Array.isArray(e) ? e.filter((e) => e?.type === "set-bake") : [];
	return t.length === 0 ? void 0 : t[t.length - 1].bake != null;
}
function MM({ kernelWorkers: t = !0, backend: n = "gpu", browser: r, memory: i = 192, assets: s, jobs: l, ffmpeg: u = "ffmpeg", audio: d, previewUrl: p = new URL(
	/* @vite-ignore */
	"../build/mcp/preview.js",
	import.meta.url
) } = {}) {
	if (!["gpu", "cpu"].includes(n)) throw RangeError("backend must be gpu or cpu.");
	let m;
	if (!Number.isInteger(i) || i < 32 || i > 384) throw RangeError("memory must be an integer from 32 to 384 MiB.");
	if (r !== void 0 && (typeof r != "string" || !D(r))) throw Error("The configured browser executable does not exist.");
	if (s !== void 0 && (typeof s != "string" || !y(s))) throw TypeError("Asset root must be an explicit absolute directory path.");
	if (l !== void 0 && (typeof l != "string" || !y(l))) throw TypeError("Job root must be an explicit absolute directory path.");
	let _ = d === void 0 ? void 0 : lM(d);
	if (typeof u != "string" || !u || u !== "ffmpeg" && (!y(u) || !D(u))) throw TypeError("FFmpeg must be on PATH or configured with an existing absolute executable path.");
	let v = "idle", x, S, C, T, E, ee, O = /* @__PURE__ */ new Set(), re = [], k = /* @__PURE__ */ new Set(), ae = 0, oe = Promise.resolve(), se, ce, le, ue = [], de = [];
	function fe() {
		if (!l) throw Error("Configure --jobs with an absolute output directory before submitting render jobs.");
		if (!le && se) throw Error("The agent runtime is closing or closed.");
		return le ??= LA({
			root: l,
			run: je
		}), le;
	}
	async function A(e) {
		let t = b(l, XA);
		await o(t, {
			recursive: !0,
			mode: 448
		});
		let n = await a(t);
		if (!n.isDirectory() || n.isSymbolicLink()) throw Error("The export folder must be a real directory without links.");
		for (; ue.length >= HM;) await h(ue.shift());
		let r = `${ie()}.glb`, i = b(t, r);
		return await g(i, e, {
			flag: "wx",
			mode: 384
		}), ue.push(i), {
			path: i,
			filename: r,
			mimeType: "model/gltf-binary",
			bytes: e.length,
			sha256: ne("sha256").update(e).digest("hex"),
			keptExports: ue.length
		};
	}
	async function pe() {
		if (v !== "rendering") return;
		let e = [
			"completed",
			"cancelled",
			"failed",
			"interrupted"
		];
		if ((await fe()).list().some((t) => !e.includes(t.state))) throw Error("The renderer is leased to a render job. Wait for completion or cancel the job.");
		v = "ready";
	}
	function j() {
		if (!s) throw Error("Configure --assets with an absolute directory before importing GLB assets.");
		return ce ??= Ck(s), ce;
	}
	async function me(e) {
		let t = Gk(e), n = await Promise.all(t.map(async ({ id: e }) => [e, (await (await j()).read(e)).toString("base64")]));
		return {
			...t.length ? { assetData: Object.fromEntries(n) } : {},
			...await ge(e),
			...await he(e)
		};
	}
	async function he(e) {
		let { environments: t, looks: n } = fy(e), r = new URL("../../assets/looks/", p), i = {};
		for (let [e, a] of [["environment", t], ["look", n]]) for (let t of a) {
			let n = py.includes(t) || my.includes(t) ? await c(new URL(`${t}.${e === "environment" ? "hdr" : "cube"}`, r)) : await (await j()).read(t);
			i[t] = e === "environment" ? {
				kind: e,
				base64: n.toString("base64")
			} : {
				kind: e,
				text: n.toString("utf8")
			};
		}
		return Object.keys(i).length ? { lookData: i } : {};
	}
	async function ge(e) {
		let t = Vk(e);
		if (!t.length) return {};
		let n = await Promise.all(t.map(async (e) => [e, (await (await j()).read(e)).toString("base64")]));
		return { sequenceData: Object.fromEntries(n) };
	}
	async function _e(e) {
		let t = /* @__PURE__ */ new Set();
		for (let n of e) for (let e of Array.isArray(n?.layers) ? n.layers : []) {
			let n = e?.from?.asset;
			typeof n == "string" && /^[a-f0-9]{64}$/i.test(n) && t.add(n.toLowerCase());
		}
		if (t.size > FM) throw RangeError(`Motion layers can retarget clips of at most ${FM} other assets at once.`);
		if (!t.size) return {};
		let n = {};
		for (let e of t) n[e] = (await (await j()).read(e)).toString("base64");
		return { sources: n };
	}
	function ve(e) {
		if (se || v === "closing" || v === "closed" || v === "failed") return Promise.reject(/* @__PURE__ */ Error(`The agent runtime is ${v}.`));
		if (ae >= zM) return Promise.reject(/* @__PURE__ */ Error("The preview call queue is full. Retry after pending calls finish."));
		ae++;
		let t = oe.then(() => {
			if (se || v === "closed" || v === "failed") throw Error(`The agent runtime is ${se ? "closing" : v}.`);
			return e();
		});
		return oe = t.catch(() => {}).finally(() => {
			ae--;
		}), t;
	}
	async function ye() {
		try {
			await x?.close();
		} finally {
			x = void 0, T = void 0, S?.listening && (S.closeAllConnections(), await new Promise((e, t) => S.close((n) => n ? t(n) : e()))), S = void 0;
		}
	}
	function be(e, t) {
		let n = w(new URL("../", p));
		c(b(n, e.slice(1))).then((e) => {
			t.setHeader("Content-Type", "application/javascript; charset=utf-8"), t.end(e);
		}, () => {
			t.writeHead(404), t.end();
		});
	}
	function xe({ resolve: t, type: n }, r) {
		let i;
		try {
			i = t(e(import.meta.url));
		} catch {
			r.writeHead(404), r.end();
			return;
		}
		c(i).then((e) => {
			r.setHeader("Content-Type", n), r.end(e);
		}, () => {
			r.writeHead(404), r.end();
		});
	}
	async function Se() {
		if (!T) {
			v = "starting";
			try {
				let [{ chromium: e }, i] = await Promise.all([import("playwright-core"), c(p, "utf8")]);
				S = te((e, t) => {
					if (!_M(e.headers.host, S.address().port)) {
						t.writeHead(403), t.end();
						return;
					}
					t.setHeader("Cache-Control", "no-store"), t.setHeader("Content-Security-Policy", "default-src 'none'; script-src 'self' 'wasm-unsafe-eval'; style-src 'unsafe-inline'; img-src data: blob:; connect-src 'self' blob:");
					let n = e.method === "GET" ? XM[e.url] : void 0;
					n ? xe(n, t) : e.method === "GET" && e.url !== "/preview.js" && JM.test(e.url) ? be(e.url, t) : e.method !== "GET" || !["/", "/preview.js"].includes(e.url) ? (t.writeHead(404), t.end()) : (t.setHeader("Content-Type", e.url === "/" ? "text/html; charset=utf-8" : "application/javascript; charset=utf-8"), t.end(e.url === "/" ? YM : i));
				}), S.on("upgrade", (e, t, n) => {
					_M(e.headers.host, S.address().port) && C?.handleUpgrade(e, t, n) || t.destroy();
				}), await new Promise((e, t) => {
					S.once("error", t), S.listen(0, "127.0.0.1", e);
				});
				let a = `http://127.0.0.1:${S.address().port}`, o = [
					"--enable-webgl",
					"--ignore-gpu-blocklist",
					"--disable-renderer-backgrounding"
				];
				n === "cpu" && o.push("--use-angle=swiftshader", "--enable-unsafe-swiftshader"), x = await e.launch({
					headless: !0,
					args: o,
					...r ? { executablePath: r } : { channel: "chrome" }
				}), T = await x.newPage({
					viewport: {
						width: 768,
						height: 512
					},
					deviceScaleFactor: 1
				}), await T.route("**/*", (e) => new URL(e.request().url()).origin === a ? e.continue() : e.abort()), T.setDefaultTimeout(15e3), n === "gpu" && await T.exposeFunction("__67jsNativeBake", Ce), t || await T.addInitScript(() => {
					globalThis.__67jsKernelWorkers = "off";
				}), T.on?.("console", (e) => {
					e.text().startsWith("67js kernel fallback") && console.error(e.text());
				}), await T.goto(a), await T.waitForFunction(() => !!window.__agentPreview), v = "ready";
			} catch (e) {
				throw v = "failed", await ye(), e;
			}
		}
	}
	async function Ce(e) {
		m ??= XO();
		let t = await m.find();
		if (e.action === "probe") return { available: !!t.tracer };
		if (!t.tracer) return { error: t.reason };
		try {
			return ik({
				tracer: t.tracer,
				request: e,
				maxSeconds: 90
			});
		} catch (e) {
			return ak(e) || m.markUnusable(e.message), { error: e.message };
		}
	}
	function we() {
		let e = null;
		for (let t of O) e = t;
		return e;
	}
	function Te(e) {
		O.delete(e), k.delete(e);
	}
	function Ee() {
		O.clear(), k.clear();
	}
	function De(e) {
		if (!O.has(e)) throw Error(DM(e, we(), {
			openSessionIds: [...O],
			evictedSessionIds: re
		}));
		O.delete(e), O.add(e);
	}
	function Oe(e, t, n) {
		for (let e of t.evictedSessions ?? []) Te(e), re.push(e);
		re.splice(0, Math.max(0, re.length - BM)), O.add(e), n && k.add(e);
	}
	async function ke(e, t, n = WM) {
		if (De(t.sessionId), !x?.isConnected() || T.isClosed()) throw v = "failed", Error("The preview browser disconnected. The scene cannot be recovered from this runtime.");
		return Ae(e, t, T, n);
	}
	async function Ae(e, t, n = T, r = WM) {
		gk(t);
		let i, a = !1;
		try {
			return await Promise.race([n.evaluate(({ method: e, input: t }) => window.__agentPreview[e](t), {
				method: e,
				input: t
			}), new Promise((e, t) => {
				i = setTimeout(() => {
					a = !0, n === T && (v = "failed"), t(/* @__PURE__ */ Error(n === T ? `The preview operation exceeded ${r / 1e3} seconds. This runtime must be closed.` : `The private render operation exceeded ${r / 1e3} seconds.`));
				}, r);
			})]);
		} catch (e) {
			throw a && (n === T ? (Ee(), await ye()) : await n.close()), e;
		} finally {
			clearTimeout(i);
		}
	}
	async function je({ jobId: e, sessionId: t, directory: r, snapshot: a, settings: o, signal: s, progress: c }) {
		let l, d, f, p = !1, h = !1, _ = performance.now(), y = {
			backend: n,
			requestedWidth: o.width,
			requestedHeight: o.height,
			renderSeconds: 0,
			captureSeconds: 0,
			peakNodeBytes: 0,
			peakBrowserHeap: 0,
			maximumPendingFrames: 1
		}, w = () => {
			l?.close().catch(() => {});
		};
		s.addEventListener("abort", w, { once: !0 });
		try {
			s.throwIfAborted(), await ve(async () => {
				await ke("suspend", { sessionId: t }), h = !0;
			}), s.throwIfAborted(), l = await x.newPage({
				viewport: {
					width: o.width,
					height: o.height
				},
				deviceScaleFactor: 1
			}), s.throwIfAborted();
			let v = `http://127.0.0.1:${S.address().port}`;
			await l.route("**/*", (e) => new URL(e.request().url()).origin === v ? e.continue() : e.abort()), l.setDefaultTimeout(15e3), await l.goto(v), await l.waitForFunction(() => !!window.__agentPreview);
			let w = {
				sessionId: e,
				recipe: a.recipe,
				memoryBudgetMiB: i,
				backend: n,
				...o.transparent ? { transparent: !0 } : {},
				...a.assetBytes ? {
					data: a.assetBytes.toString("base64"),
					...await _e([a.recipe.motion])
				} : await me(a.recipe)
			}, T = await l.evaluate(({ method: e, input: t }) => window.__agentPreview[e](t), {
				method: a.assetBytes ? "createAsset" : "create",
				input: w
			}), E = o.kind === "video" ? Math.floor(T.render.width / 2) * 2 : T.render.width, D = o.kind === "video" ? Math.floor(T.render.height / 2) * 2 : T.render.height;
			if (E < 64 || D < 64) throw Error("Render budget reduced the job below its minimum output size.");
			await l.setViewportSize({
				width: E,
				height: D
			});
			let ee = await l.context().newCDPSession(l), O = o.region;
			if (o.format && o.format !== "png" && await l.evaluate((e) => window.__agentPreview.prepareFloatOutput(e), { sessionId: e }), o.passes?.includes("wireframe") && await l.evaluate((e) => window.__agentPreview.prepareWireframe(e), { sessionId: e }), O && (O.x + O.width > E || O.y + O.height > D)) throw Error(`The region lies outside the rendered frame, which the memory budget reduced to ${E}x${D}.`);
			let te = O?.width ?? E, ne = O?.height ?? D, re = o.format ?? "png", ie = re !== "png", k = re === "exr" ? "exr" : "png", ae = re === "exr" ? "image/x-exr" : "image/png";
			o.transparent && (await ee.send("Emulation.setDefaultBackgroundColorOverride", { color: {
				r: 0,
				g: 0,
				b: 0,
				a: 0
			} }), await l.evaluate(() => {
				document.documentElement.style.background = "transparent", document.body.style.background = "transparent";
			}));
			let oe = [], se = o.timeline ? a.recipe.timeline : void 0, ce = o.audio ? await Me(o) : void 0;
			if (o.kind === "video") {
				f = tM({ maximumBytes: E * D * 4 }), C = f;
				let e = `ws://127.0.0.1:${S.address().port}${f.path}`;
				o.encoder === "nvenc" && !o.renderer && !O && (p = (await rM(l, e, {
					width: E,
					height: D,
					fps: o.fps,
					quantizer: 20
				})).supported), d = oM({
					executable: u,
					output: b(r, "render.mp4.partial"),
					fps: o.fps,
					format: p ? "h264" : o.renderer ? "png" : "jpeg",
					width: te,
					height: ne,
					signal: s,
					maximumFrameBytes: IM,
					backend: o.encoder === "nvenc" ? "gpu" : "cpu",
					audioArguments: o.audio ? uM(ce.path, o.audio.offset) : [],
					audioCodec: o.audio?.track === "pcm" ? "pcm" : "aac"
				}), p && f.onChunk((e) => d.writeChunk(e)), y.videoEncoder = p ? "browser-h264" : o.encoder === "nvenc" ? "h264_nvenc" : "libx264";
			}
			se && (y.shots = dA(se));
			for (let t = 0; t < o.frameCount; t++) {
				s.throwIfAborted();
				let i = o.kind === "video" ? t / o.fps : o.kind === "stills" ? o.duration * t / (o.frameCount - 1) : 0, u = se ? Math.min(uA(se), o.timeline.start + i) : void 0, f = se ? mA(se, a.recipe, u) : void 0, h = {
					sessionId: e,
					...ie ? { floatOutput: !0 } : {},
					rendererTime: (o.rendererTime?.start ?? 0) + (u ?? i) * (o.rendererTime?.rate ?? 1),
					...o.motion ? { motionTime: o.motion.start + i } : {},
					...f?.motionTime == null ? {} : { motionTime: f.motionTime },
					...f?.camera ? { camera: f.camera } : {},
					...f?.depthOfField ? { depthOfField: f.depthOfField } : {},
					...f && f.brightness < 1 ? { brightness: f.brightness } : {},
					...o.animation ? { animation: {
						clip: o.animation.clip,
						time: o.animation.start + i
					} } : {}
				}, _ = performance.now();
				if (o.renderer) {
					let { type: e, ...i } = o.renderer;
					if (o.renderer.backend === "gpu" && n === "cpu") throw Error("renderer.backend \"gpu\" needs a runtime on the GPU backend, and this one runs on SwiftShader.");
					let a = await sx(o.renderer.denoise);
					m ??= XO();
					let s = await ZO({
						requested: o.renderer.backend,
						runtimeBackend: n,
						locator: m
					}), u = {
						width: E,
						height: D,
						...i,
						backend: s.backend === "native" ? "gpu" : s.backend,
						denoise: a.denoise,
						threads: RM
					}, f, p = s.note;
					if (s.backend === "native") try {
						let e = await l.evaluate((e) => window.__agentPreview.exportNativeScene(e), {
							...h,
							options: {
								width: E,
								height: D,
								bounces: i.bounces,
								seed: i.seed,
								fireflyClamp: 20,
								noiseThreshold: i.noiseThreshold
							}
						});
						f = await tk({
							tracer: s.tracer,
							exported: e,
							width: E,
							height: D,
							samples: i.samples,
							bounces: i.bounces,
							seed: i.seed,
							denoise: a.denoise === !0 ? "wavelet" : a.denoise === !1 ? "none" : a.denoise,
							denoiser: a.denoiser,
							maxSeconds: i.maxSeconds,
							noiseThreshold: i.noiseThreshold
						});
					} catch (e) {
						if (ak(e)) throw e;
						m.markUnusable(e.message), p = (await m.find()).reason, u.backend = n === "cpu" ? "cpu" : "gpu", p += " The " + u.backend + " backend ran instead.";
					}
					f || (f = await l.evaluate((e) => window.__agentPreview.pathTrace(e), {
						...h,
						options: u
					}), f.features && (f = await lx({
						traced: f,
						denoiser: a.denoiser,
						drawLinear: (e) => l.evaluate((e) => window.__agentPreview.finishPathTrace(e), e)
					}))), p && (f.report.backendNote = p), a.note && (f.report.denoiserNote = a.note), y.renderSeconds += (performance.now() - _) / 1e3, y.width = E, y.height = D, y.pathTracer = f.report;
					let v = Buffer.from(f.data, "base64");
					if (v.length > IM) throw Error("Path traced frame exceeded 12 MiB.");
					if (d) await d.writeFrame(v);
					else {
						let e = o.kind === "image" ? "render.png" : `frame-${t}.png`;
						await g(b(r, `${e}.partial`), v, { flag: "wx" }), oe.push({
							temporary: `${e}.partial`,
							filename: e,
							mimeType: "image/png"
						});
					}
					await c({
						frames: t + 1,
						maximumPendingFrames: 1
					});
					continue;
				}
				let v = await l.evaluate(async ({ input: e, encodeIndex: t }) => {
					let n = performance.now(), r = await window.__agentPreview.frame(e);
					if (t === null) return r;
					window.__finishDraw();
					let i = performance.now() - n;
					return {
						...r,
						drawMilliseconds: i,
						pageEncoded: await window.__encodeFrame(t)
					};
				}, {
					input: {
						...h,
						diagnose: t === 0
					},
					encodeIndex: p ? t : null
				}), x = (performance.now() - _) / 1e3, S = v.pageEncoded ? v.drawMilliseconds / 1e3 : x;
				if (y.renderSeconds += S, y.captureSeconds += x - S, n === "cpu" && !/swiftshader/i.test(v.graphics)) throw Error("CPU job did not select SwiftShader.");
				y.graphics = v.graphics, y.width = E, y.height = D, y.estimatedBytes = v.estimatedBytes, TM(y, v.diagnostics);
				async function C() {
					if (v.pageEncoded) {
						s.throwIfAborted();
						return;
					}
					let e = performance.now(), t = await ee.send("Page.captureScreenshot", {
						fromSurface: !0,
						format: o.kind === "video" ? "jpeg" : "png",
						...O ? { clip: {
							...O,
							scale: 1
						} } : {},
						...o.kind === "video" ? { quality: 95 } : { optimizeForSpeed: !0 }
					}), n = Buffer.from(t.data, "base64");
					if (y.captureSeconds += (performance.now() - e) / 1e3, n.length > IM) throw Error("Captured job frame exceeded 12 MiB.");
					return s.throwIfAborted(), n;
				}
				async function w(t) {
					let n = await l.evaluate((e) => window.__agentPreview.readFloat(e), {
						sessionId: e,
						source: t ? "pass" : "frame",
						...O ? { region: O } : {}
					}), r = Buffer.from(n.data, "base64");
					return {
						pixels: new Float32Array(r.buffer.slice(r.byteOffset, r.byteOffset + r.length)),
						width: n.width,
						height: n.height
					};
				}
				async function T(t) {
					let n = performance.now(), r = await l.evaluate((e) => window.__agentPreview.readFloat(e), {
						sessionId: e,
						source: t ? "pass" : "frame",
						...O ? { region: O } : {}
					}), i = Buffer.from(r.data, "base64"), a = new Float32Array(i.buffer.slice(i.byteOffset, i.byteOffset + i.length)), c = yj({
						format: re,
						pixels: a,
						width: r.width,
						height: r.height,
						pass: t,
						hasAlpha: o.transparent === !0,
						depthRange: 100
					});
					if (y.captureSeconds += (performance.now() - n) / 1e3, c.length > IM * 4) throw Error("Rendered frame exceeded the high-precision size limit.");
					return s.throwIfAborted(), c;
				}
				async function te(e, t) {
					await g(b(r, `${e}.partial`), t, { flag: "wx" }), oe.push({
						temporary: `${e}.partial`,
						filename: e,
						mimeType: ae
					});
				}
				let ne = o.multilayer ? void 0 : ie ? await T(void 0) : await C();
				if (d) ne && await d.writeFrame(ne);
				else {
					let e = o.kind === "image" ? "render" : `frame-${t}`;
					if (o.multilayer) {
						let t = performance.now(), n = await w(void 0), r = {};
						for (let e of o.passes ?? []) {
							let t = await l.evaluate((e) => window.__agentPreview.frame(e), {
								...h,
								floatOutput: !1,
								pass: e,
								passDepthRange: 100,
								passFloat: !0
							});
							r[e] = (await w(e)).pixels, e === "depth" && (y.depthRangeMetres = 100), e === "objectId" && (y.objectNames = t.objectNames.slice(0, LM), y.objectNamesTruncated = t.objectNames.length > LM), e === "cryptomatte" && (y.cryptomatte = t.cryptomatte), e === "wireframe" && (y.wireframe = t.wireframe);
						}
						let i = _j({
							width: n.width,
							height: n.height,
							beauty: n.pixels,
							passes: r,
							hasAlpha: o.transparent === !0,
							depthRange: 100
						});
						if (y.captureSeconds += (performance.now() - t) / 1e3, i.length > IM * 4) throw Error("Rendered frame exceeded the high-precision size limit.");
						await te(`${e}.exr`, i);
					} else {
						await te(`${e}.${k}`, ne);
						for (let t of o.passes ?? []) {
							let n = await l.evaluate((e) => window.__agentPreview.frame(e), {
								...h,
								floatOutput: !1,
								pass: t,
								passDepthRange: 100,
								...ie ? { passFloat: !0 } : {}
							});
							await te(`${e}-${t}.${k}`, ie ? await T(t) : await C()), t === "cryptomatte" && (y.cryptomatte = n.cryptomatte), t === "wireframe" && (y.wireframe = n.wireframe), t === "depth" && (y.depthRangeMetres = 100), t === "objectId" && (y.objectNames = n.objectNames.slice(0, LM), y.objectNamesTruncated = n.objectNames.length > LM);
						}
					}
				}
				y.peakNodeBytes = Math.max(y.peakNodeBytes, process.memoryUsage().rss);
				let ce = await ee.send("Runtime.getHeapUsage");
				if (y.peakBrowserHeap = Math.max(y.peakBrowserHeap, ce.usedSize), y.peakNodeBytes > 512 * 1024 ** 2 || y.peakBrowserHeap > 256 * 1024 ** 2) throw Error("Render job exceeded its Node RSS or sampled browser heap guard.");
				await c({
					frames: t + 1,
					maximumPendingFrames: 1
				});
			}
			return d && (p && await l.evaluate(() => window.__finishVideoEncoder()), y.encoder = await d.finish(), ce && (y.sync = await Ne(b(r, "render.mp4.partial"))), oe.push({
				temporary: "render.mp4.partial",
				filename: "render.mp4",
				mimeType: "video/mp4"
			})), y.elapsedSeconds = (performance.now() - _) / 1e3, {
				artifacts: oe,
				metrics: y
			};
		} finally {
			s.removeEventListener("abort", w), C = void 0, f?.close();
			try {
				await d?.close();
			} finally {
				try {
					if (l && !l.isClosed()) try {
						await l.evaluate((e) => window.__agentPreview.dispose({ sessionId: e }), e);
					} finally {
						await l.close();
					}
				} finally {
					if (h && !se) try {
						await ve(() => ke("resume", { sessionId: t })), v = "ready";
					} catch (e) {
						throw v = "failed", Error(`Preview recovery failed after render job: ${e.message}`);
					}
					else !se && v !== "failed" && (v = "ready");
				}
			}
		}
	}
	async function Me(e) {
		if (!_) throw Error("Configure --audio with an absolute folder before rendering audio.");
		let t = await _.resolve(e.audio.file), n = await fM(u, t, "audio"), r = e.frameCount / e.fps, i = n - e.audio.offset;
		if (i + qM < r) throw RangeError(`Audio has ${i.toFixed(2)} s after its offset but the video lasts ${r.toFixed(2)} s.`);
		return {
			path: t,
			availableSeconds: i
		};
	}
	async function Ne(e) {
		let t = await fM(u, e, "video", { format: "mp4" }), n = await fM(u, e, "audio", { format: "mp4" }), r = n - t;
		if (Math.abs(r) > qM) throw Error(`Audio and video lengths differ by ${(r * 1e3).toFixed(0)} ms.`);
		return {
			videoSeconds: t,
			audioSeconds: n,
			differenceSeconds: r,
			toleranceSeconds: qM
		};
	}
	return Object.freeze({
		async capabilities() {
			return {
				scene: {
					...Qy,
					game: Lb,
					postPasses: Fb,
					meshBlend: Jb,
					materialSnippet: Qb,
					vegetation: Sb,
					crowd: wb,
					textureSequence: Lk
				},
				sceneLimits: NM,
				preview: {
					backend: n,
					memoryBudgetMiB: i,
					maximumWidth: 1024,
					maximumHeight: 1024,
					maximumImageBytes: PM,
					maximumActiveScenes: OM.maxOpenScenes,
					maximumOpenSceneBytes: OM.maxOpenSceneBytes,
					maximumQueuedCalls: zM,
					evaluationTimeoutMs: WM
				},
				review: {
					...CM,
					backend: n,
					memoryBudgetMiB: i,
					evaluationTimeoutMs: WM,
					totalTimeoutMs: WM,
					sourcePreserved: !0,
					defaultMotionTime: null,
					defaultRendererTime: 0,
					branches: Tu
				},
				phase: se && v !== "closed" ? "closing" : v,
				availableIn: Xv.version,
				assets: {
					configured: !!s,
					formats: ["self-contained GLB", "PNG, JPEG or WebP image (map sequence frame)"],
					maximumBytes: _k.maxBytes,
					maximumAssets: _k.maxAssets,
					maximumCombinedBytes: _k.maxCombinedBytes,
					maximumVertices: _k.maxVertices,
					maximumParts: _k.maxParts,
					maximumTexturePixels: _k.maxTexturePixels,
					maximumJoints: _k.maxJoints,
					maximumClips: _k.maxClips,
					commands: [
						"set-root",
						"set-asset-node",
						"set-motion",
						"set-animation",
						"set-material",
						"set-camera",
						"set-environment",
						"set-effects",
						"set-shadow"
					]
				},
				jobs: {
					configured: !!l,
					kinds: [
						"image",
						"stills",
						"video"
					],
					passes: Ry,
					pathTracer: ix,
					maximumActiveJobs: 1,
					maximumWidth: Uy,
					maximumHeight: Uy,
					maximumPixels: Wy,
					maximumDuration: 60,
					maximumFps: 30,
					maximumFrames: 900,
					maximumStills: 8,
					encoder: "H.264",
					encoders: zy,
					audio: !!d,
					timeline: !0,
					previewSuspendedDuringJob: !0,
					glbExport: {
						maximumBytes: VM,
						maximumKept: HM,
						maximumTextureSize: 4096
					},
					records: l ? (await fe()).list().map((e) => ({
						jobId: e.jobId,
						state: e.state,
						sourceRevision: e.sourceRevision,
						progress: e.progress
					})) : []
				},
				unsupported: [
					"remote asset providers",
					"arbitrary code execution",
					"imported morph track authoring"
				]
			};
		},
		create({ recipe: e }) {
			return ve(async () => {
				await pe(), await Se();
				let t = ie(), r = await Ae("create", {
					recipe: e,
					sessionId: t,
					memoryBudgetMiB: i,
					backend: n,
					...await me(e)
				}, T, e?.bake ? KM : WM);
				return Oe(t, r, !!e?.bake), r;
			});
		},
		assetCatalog() {
			return ve(async () => s ? {
				configured: !0,
				...(await j()).list()
			} : {
				configured: !1,
				assets: []
			});
		},
		createAsset({ recipe: e }) {
			return ve(async () => {
				await pe();
				let t = await (await j()).read(e.assetId);
				await Se();
				let r = ie(), a = await Ae("createAsset", {
					recipe: e,
					data: t.toString("base64"),
					sessionId: r,
					memoryBudgetMiB: i,
					backend: n,
					...await _e([e.motion])
				});
				return Oe(r, a, !1), a;
			});
		},
		inspect(e) {
			return ve(() => ke("inspect", e));
		},
		inspectMeshes(e) {
			return ve(() => ke("inspectMeshes", e));
		},
		walkMap({ assetId: e, ...t }) {
			return e === void 0 ? ve(() => ke("walkMap", t)) : t.sessionId === void 0 ? ve(async () => {
				await Se();
				let n = {
					...t,
					assetId: e
				}, r = await Ae("queryOnlyWalkMap", n, T, GM);
				if (!r.needsData) return r;
				let i = Ak(await (await j()).read(e));
				return Ae("queryOnlyWalkMap", {
					...n,
					data: i.toString("base64")
				}, T, GM);
			}) : Promise.reject(/* @__PURE__ */ TypeError("scene_walkmap takes a sessionId or an assetId, not both."));
		},
		setMeshStack(e) {
			return ve(async () => (await pe(), ke("setMeshStack", e)));
		},
		editMesh(e) {
			return ve(async () => (await pe(), ke("editMesh", e)));
		},
		apply(e) {
			return ve(async () => {
				if (await pe(), e.branch !== void 0) {
					let { branch: t, ...n } = e;
					return ke("branchApply", {
						...n,
						name: wu(t)
					});
				}
				let t = jM(e.operations), n = k.has(e.sessionId), r = n || t === !0, i = (e.operations ?? []).filter((e) => e.type === "set-motion").map((e) => e.motion), a = await ke("apply", {
					...e,
					...await _e(i),
					...await me(e.operations)
				}, r ? KM : WM);
				return t ?? n ? k.add(e.sessionId) : k.delete(e.sessionId), a;
			});
		},
		look(e) {
			return ve(async () => {
				await pe(), De(e.sessionId);
				let t = e.width ?? 768, r = e.height ?? 512;
				if (![t, r].every((e) => Number.isInteger(e) && e >= 64 && e <= 1024)) throw RangeError("Preview dimensions must be integers from 64 to 1024.");
				await T.setViewportSize({
					width: t,
					height: r
				});
				let i = await ke("look", {
					sessionId: e.sessionId,
					...e.motionTime === void 0 ? {} : { motionTime: e.motionTime },
					...e.labels ? { labels: !0 } : {}
				});
				if (Buffer.byteLength(i.data, "base64") > PM) throw Error("The PNG exceeds the 1 MiB image response budget. Request a smaller preview.");
				return i.metadata.requestedWidth = t, i.metadata.requestedHeight = r, i.metadata.backend = n, i;
			});
		},
		checkpoint(e) {
			return ve(async () => (await pe(), ke("checkpoint", {
				...e,
				checkpointId: ie()
			})));
		},
		review(e) {
			let t;
			try {
				t = SM(e);
			} catch (e) {
				return Promise.reject(e);
			}
			return ve(async () => {
				await pe(), De(t.sessionId);
				let e = await ke("snapshot", t), r = /* @__PURE__ */ new Map();
				for (let e of t.branchNames) r.set(e, await ke("branchRecipe", {
					sessionId: t.sessionId,
					name: e
				}));
				let a = e.recipe.format === "67js.asset" ? await (await j()).read(e.recipe.assetId) : void 0, o, s = performance.now(), c = !1, l = !1, u, d, f = !1, p, m = new Promise((e, t) => {
					ee = (e) => {
						p ??= e, t(p), E?.close().catch(() => {});
					};
				});
				m.catch(() => {});
				let h = setTimeout(() => {
					f = !0, ee(/* @__PURE__ */ Error("The review exceeded its total 30 second deadline."));
				}, WM);
				function g() {
					if (f) throw Error("The review exceeded its total 30 second deadline.");
					if (se) throw Error("The agent runtime is closing.");
				}
				async function _(e, t) {
					g();
					let n = await Ae(e, t, E);
					return g(), n;
				}
				try {
					await ke("suspend", { sessionId: t.sessionId }), c = !0, v = "reviewing", g();
					let s = x.newPage({
						viewport: {
							width: t.width,
							height: t.height
						},
						deviceScaleFactor: 1
					}).then(async (e) => {
						if (p) throw await e.close(), p;
						return e;
					});
					E = await Promise.race([s, m]), g();
					let f = `http://127.0.0.1:${S.address().port}`;
					await E.route("**/*", (e) => new URL(e.request().url()).origin === f ? e.continue() : e.abort()), E.setDefaultTimeout(15e3), await E.goto(f), await E.waitForFunction(() => !!window.__agentPreview), await _("reviewBegin", {
						width: t.gridWidth,
						height: t.gridHeight
					}), u = await E.context().newCDPSession(E);
					let h = [], y = 0, b = 0;
					for (let s of t.groups) {
						let c = s.branch === void 0 ? void 0 : r.get(s.branch);
						o = ie(), await _(c || !a ? "create" : "createAsset", {
							sessionId: o,
							recipe: c ? c.recipe : e.recipe,
							memoryBudgetMiB: i,
							backend: n,
							...!c && a ? {
								data: a.toString("base64"),
								...await _e([e.recipe.motion])
							} : {},
							...a ? {} : await me(c ? c.recipe : e.recipe)
						}), l = !0;
						for (let e of s.shotIndexes) {
							let r = await _("reviewShot", {
								sessionId: o,
								shot: t.shots[e],
								index: e,
								width: t.width,
								height: t.height,
								columns: t.columns,
								labels: t.labels
							});
							if (n === "cpu" && !/swiftshader/i.test(r.graphics)) throw Error("CPU review did not select SwiftShader.");
							if (b = Math.max(b, process.memoryUsage().rss), y = Math.max(y, (await u.send("Runtime.getHeapUsage")).usedSize), b > 512 * 1024 ** 2 || y > 256 * 1024 ** 2) throw Error("Review exceeded its Node RSS or sampled browser heap guard.");
							h[e] = {
								...r,
								...s.branch === void 0 ? {} : {
									branch: s.branch,
									branchStale: c.stale
								}
							};
						}
						await _("dispose", { sessionId: o }), l = !1;
					}
					let C = await _("reviewResult", { sessionId: o });
					if (Buffer.byteLength(C.data, "base64") > PM) throw Error("The review PNG exceeds the 1 MiB image response budget. Request smaller shots.");
					d = {
						...C,
						metadata: {
							sessionId: t.sessionId,
							sourceRevision: e.sourceRevision,
							backend: n,
							width: t.gridWidth,
							height: t.gridHeight,
							shots: h,
							peakNodeBytes: b,
							peakBrowserHeap: y,
							maximumPendingFrames: 1
						}
					};
				} catch (e) {
					throw f ? Error("The review exceeded its total 30 second deadline.") : e;
				} finally {
					clearTimeout(h), ee = void 0;
					try {
						if (E && !E.isClosed()) try {
							l && !se && await Ae("dispose", { sessionId: o }, E);
						} finally {
							try {
								await E.close();
							} catch (e) {
								throw v = "failed", await ye(), e;
							}
						}
					} finally {
						if (E = void 0, await u?.detach().catch(() => {}), c && !se && v !== "failed") {
							try {
								await ke("resume", { sessionId: t.sessionId });
							} catch (e) {
								throw v = "failed", Error(`Preview recovery failed after review: ${e.message}`);
							}
							v = "ready";
						}
					}
				}
				return d.metadata.elapsedSeconds = (performance.now() - s) / 1e3, d;
			});
		},
		restore(e) {
			return ve(async () => {
				if (await pe(), e.branch !== void 0) return ke("keepBranch", {
					sessionId: e.sessionId,
					name: wu(e.branch),
					expectedRevision: e.expectedRevision
				});
				if (e.revision === void 0 && e.checkpointId === void 0) throw TypeError("Restore needs a checkpointId, a revision or a branch.");
				return ke("restore", e);
			});
		},
		releaseCheckpoint(e) {
			return ve(async () => (await pe(), ke("releaseCheckpoint", e)));
		},
		exportRecipe(e) {
			return ve(() => ke("exportRecipe", e));
		},
		dispose(e) {
			return ve(async () => {
				await pe();
				let t = await ke("dispose", e);
				return Te(e.sessionId), t;
			});
		},
		exportGlb({ sessionId: e, clip: t, motionTime: n, maxTextureSize: r }) {
			return ve(async () => {
				await pe(), await fe();
				let { data: i, ...a } = await ke("exportGlb", {
					sessionId: e,
					clip: t,
					motionTime: n,
					maxTextureSize: r,
					maximumBytes: VM
				}), o = await A(Buffer.from(i, "base64"));
				return {
					...a,
					...o
				};
			});
		},
		exportWeb({ sessionId: e, title: t }) {
			return ve(async () => {
				await pe(), await fe();
				let { recipe: n, revision: r } = await ke("exportRecipe", { sessionId: e }), i = b(l, XA);
				await o(i, {
					recursive: !0,
					mode: 448
				});
				let a = b(i, `web-${ie()}`), s;
				try {
					s = await eA({
						recipe: n,
						buildDirectory: w(new URL("../", p)),
						outputDirectory: a,
						title: t
					});
				} catch (e) {
					throw await f(a, {
						recursive: !0,
						force: !0
					}), e;
				}
				for (de.push(a); de.length > UM;) await f(de.shift(), {
					recursive: !0,
					force: !0
				});
				return {
					sessionId: e,
					revision: r,
					...s,
					entry: b(a, "index.html"),
					host: "Serve the folder with any static file server; no server code runs."
				};
			});
		},
		submitJob({ sessionId: e, expectedRevision: t, settings: n }) {
			return ve(async () => {
				await pe();
				let r = await fe();
				if (n?.audio) {
					if (!_) throw Error("Configure --audio with an absolute folder before submitting a job with audio.");
					await _.resolve(n.audio.file);
				}
				let i = await ke("snapshot", {
					sessionId: e,
					expectedRevision: t
				}), a = i.recipe.format === "67js.asset" ? await (await j()).read(i.recipe.assetId) : void 0;
				v = "rendering";
				try {
					return await r.submit({
						sessionId: e,
						sourceRevision: i.sourceRevision,
						snapshot: {
							recipe: i.recipe,
							clips: i.clips,
							...a ? { assetBytes: a } : {}
						},
						settings: n
					});
				} catch (e) {
					throw v = "ready", e;
				}
			});
		},
		async jobStatus({ jobId: e }) {
			let t = (await fe()).status(e);
			return v === "rendering" && [
				"completed",
				"cancelled",
				"failed",
				"interrupted"
			].includes(t.state) && await pe(), t;
		},
		async cancelJob({ jobId: e }) {
			return (await fe()).cancel(e);
		},
		async jobResult({ jobId: e }) {
			let t = (await fe()).result(e);
			return {
				...t,
				artifacts: t.artifacts.map((e) => ({
					...e,
					path: b(l, t.jobId, e.filename)
				}))
			};
		},
		async releaseJob({ jobId: e }) {
			return (await fe()).release(e);
		},
		activeSessionId() {
			return we();
		},
		close() {
			return se ||= (v = "closing", ee?.(/* @__PURE__ */ Error("The agent runtime is closing.")), (async () => {
				try {
					le && await (await le).close(), await E?.close().catch(() => {});
				} finally {
					await oe, await ye();
				}
			})().finally(() => {
				Ee(), v = "closed";
			})), se;
		}
	});
}
var NM, PM, FM, IM, LM, RM, zM, BM, VM, HM, UM, WM, GM, KM, qM, JM, YM, XM, ZM = A((() => {
	Cb(), Tb(), Ib(), Rb(), Yb(), tx(), $y(), ax(), dx(), uk(), Ok(), Nk(), yk(), Yk(), Uk(), gy(), Rk(), iA(), tj(), Mj(), cM(), iM(), gM(), yA(), vM(), wM(), EM(), Du(), kM(), NM = wy, PM = 1048576, FM = 4, IM = 12582912, LM = 1e3, RM = 8, zM = 16, BM = 32, VM = 33554432, HM = 8, UM = 4, WM = 3e4, GM = 12e4, KM = WM + 9e4, qM = .05, JM = /^\/[\w.-]+\.js$/, YM = "<!doctype html><html><head><meta charset=\"utf-8\"><style>html,body{margin:0;height:100%;background:#182126}canvas{display:block;width:100vw;height:100vh}</style></head><body><canvas></canvas><script type=\"module\" src=\"/preview.js\"><\/script></body></html>", XM = Object.freeze({
		"/vendor/manifold.js": {
			resolve: (e) => e.resolve("manifold-3d/manifold.js"),
			type: "application/javascript; charset=utf-8"
		},
		"/vendor/manifold.wasm": {
			resolve: (e) => e.resolve("manifold-3d/manifold.wasm"),
			type: "application/wasm"
		},
		"/vendor/rapier.js": {
			resolve: (e) => b(v(e.resolve("@dimforge/rapier3d-compat")), "rapier.mjs"),
			type: "application/javascript; charset=utf-8"
		}
	});
}));
Du(), Zv(), sy(), uy(), gy(), $y(), Cy(), ib(), _y(), jv();
var X = I().min(-34028234663852886e22).max(34028234663852886e22), QM = X.positive(), $M = X.nonnegative(), eN = I().min(0).max(1), Z = F().min(1).max(128).regex(/\S/).describe("Stable resource or node ID, with at least one non-space character.").meta({ id: "Identifier" }), Q = fl([
	X,
	X,
	X
]).meta({ id: "Vector3" }), tN = fl([
	eN,
	eN,
	eN
]).meta({ id: "Color" }), nN = fl([
	X,
	X,
	X,
	X
]).meta({ id: "Quaternion" }), rN = fl([X, X]), iN = /* @__PURE__ */ new Map();
function aN(e, t, n, r = {}) {
	return iN.has(e) || iN.set(e, t), H(r).describe(n).pipe(t);
}
var oN = (e, t) => Object.fromEntries(t.map((t) => [t, e[t]])), sN = (e, t) => I().int().min(e).max(t).optional(), cN = sN(3, 2048), lN = z(rN).min(3).max(4096), uN = V({
	armature: Z.describe("ID of an entry in recipe armatures."),
	maxInfluences: I().int().min(1).max(4).optional().describe("Bones that move one vertex. Defaults to 4."),
	maxDistance: QM.optional().describe("Metres from the nearest bone beyond which a vertex counts as unweighted in scene_inspect rig. Defaults to a quarter of the rig size.")
}).describe("Bind this mesh node to an armature with automatic weights: each vertex follows its nearest bones, by distance to the bone segments. Needs the armature at rest where the mesh is."), dN = z(W(F(), R())).max(8).describe("Relations against other mesh nodes; fields in scene_capabilities relations. [] removes them.").meta({ id: "Relations" }), fN = W(F(), R()).describe("Catalog GLB placed at this group node: {id,materials,clip,drive}; see scene_capabilities placedAssets.").meta({ id: "PlacedAsset" }), pN = W(F(), R()).describe("Trees at this group node: {species} for one, or {mix, scatter:{ground,...}} over a terrain node; see scene_capabilities vegetation.").meta({ id: "PlacedVegetation" }), mN = {
	relations: dN.optional(),
	asset: fN.optional(),
	vegetation: pN.optional(),
	skin: aN("skin", uN, "Bind this mesh node to an armature with automatic weights: { armature, maxInfluences, maxDistance }.", oN(uN.shape, ["armature"])).optional(),
	decal: L().optional(),
	depthLayer: I().int().min(0).max(4).optional(),
	visible: L().optional().describe("false hides the node and children; keyable in motion. Flags: scene_capabilities renderFlags."),
	castShadow: L().optional(),
	receiveShadow: L().optional(),
	holdout: L().optional(),
	shadowCatcher: L().optional(),
	blend: V({ radius: I().min(.005).max(2) }).optional().describe("Soft seam into another mesh, radius in m; docs/mesh-blend.md."),
	label: F().max(256).optional().describe("Human-readable label. Identity remains the node ID."),
	parent: Z.nullable().optional().describe("Parent node ID, or null for a root. Local transforms stay unchanged."),
	translation: Q.optional().describe("Local XYZ of the node centre in metres, Y up, relative to its parent."),
	rotation: nN.optional().describe("Nonzero local XYZW quaternion. The backend normalizes it."),
	scale: fl([
		QM,
		QM,
		QM
	]).optional().describe("Positive local XYZ scale.")
}, hN = U([
	X,
	L(),
	Q,
	W(F(), R())
]).describe("Field expression, plain JSON and never code; driver expressions use the same language. A number, a boolean or [x,y,z] is a constant; an object holds one operator: math add mul sub div mod pow atan2 min max clamp saturate mix smoothstep neg abs sqrt sin cos floor ceil round fract sign; comparison lt lte gt gte eq; logic and or not if [cond,a,b]; vectors vec [x,y,z] dot cross distance length normalize x y z; sources {\"attr\":\"position\"|\"normal\"|\"index\"|\"tag\",\"component\":\"x\"|\"y\"|\"z\",\"name\":tag}, {\"noise\":{\"scale\":3,\"seed\":7,\"octaves\":1}} in 0..1, {\"random\":{\"seed\":1}} per element in 0..1. Limits in scene_capabilities fieldExpressions."), gN = I().int().min(1).max(2048), _N = V({
	grid: V({
		counts: fl([
			gN,
			gN,
			gN
		]),
		spacing: Q
	}).optional().describe("Grid of counts[0] x counts[1] x counts[2] points centred on the group."),
	scatter: V({
		count: gN,
		min: Q,
		max: Q
	}).optional().describe("Seeded random points in a box."),
	surface: V({
		geometry: Z,
		count: gN
	}).optional().describe("Seeded random points on the surface of a recipe geometry, in that geometry's own space; parent the instanced node to the node that carries it."),
	curve: V({
		points: z(Q).min(2).max(256),
		count: gN,
		closed: L().optional(),
		fillet: I().positive().optional()
	}).optional().describe("Equal steps along a polyline; fillet is a corner radius."),
	seed: I().int().min(0).max(2147483647).optional(),
	where: hN.optional().describe("Number expression over the points (position, normal, index); points where it is 0 are dropped."),
	place: W(F(), R()).optional().describe("scene_capabilities instancing."),
	yaw: L().optional().describe("Random turn about up."),
	alignToNormal: L().optional().describe("Surface or curve: turn up to the normal or direction."),
	scale: fl([I().min(.001).max(1e3), I().min(.001).max(1e3)]).optional().describe("Random uniform scale range [min, max].")
}).describe("One of grid, scatter, surface or curve. Expands at scene_create into a group node plus one child node per point (<id>.0, <id>.1, ...) that share geometry and material and draw as one instanced batch. At most 2048 candidate points."), vN = V({
	armature: Z.optional().describe("Set on nodes an armature generates, and ignored on input. Edit bones through armatures."),
	id: Z,
	geometry: Z.optional(),
	material: Z.optional(),
	instances: aN("instances", _N, "Repeat geometry and material at points; needs both ids. Only in scene_create, not in add-node. One of grid {counts, spacing}, scatter {count, min, max}, surface {geometry, count} or curve {points, count, closed, fillet}; also seed, where, yaw, alignToNormal, scale.").optional(),
	...mN
}), yN = W(F(), R()).describe("Node graph as plain JSON, never code. Outputs, nodes, inputs and limits are in scene_capabilities materialGraph."), bN = V({
	type: G([...Dy, "graph"]).describe("Surface look: a preset, or graph for your own node graph (give graph). Directional presets (wood, planks, metal) run along axis."),
	graph: yN.optional().describe("Only with type graph."),
	mapping: G(Ny).optional().describe("box (default) or uv, which needs UVs; see scene_capabilities."),
	colors: z(tN).min(2).max(3).optional().describe("Linear RGB colours to mix, darker first. Bricks take a third for the mortar. Each type has good defaults."),
	size: I().min(.01).max(100).optional().describe("Metres per repeat of the texture, so it keeps its real size on any object and node scale."),
	count: I().int().min(1).max(64).optional().describe("Features per repeat: planks, bricks across, tiles across, wood rings or noise cells."),
	bump: I().min(0).max(4).optional().describe("Relief strength. 0 is flat."),
	seed: I().int().min(0).max(2147483647).optional(),
	axis: G([
		"x",
		"y",
		"z"
	]).optional().describe("Object axis the grain runs along. Defaults to y."),
	resolution: U([
		K(256),
		K(512),
		K(1024)
	]).optional().describe("Texture size. Defaults to 512; each pattern takes about 4 MiB at 512.")
}).describe("Procedural texture; box mapping needs no UVs. color tints it, roughness and metallic scale it.");
function xN(e) {
	let [t, n] = xy[e], r = I().min(t, `${e} must be at least ${t}. Raise it to ${t} or more.`).max(n, `${e} must be at most ${n}. Lower it to ${n} or less.`);
	return I().pipe(r).optional();
}
function SN(e) {
	let [t, n] = Sy[e], r = I().min(t, `${e} components must be at least ${t}.`).max(n, `${e} components must be at most ${n}. Use linear values.`);
	return z(I()).length(3).pipe(fl([
		r,
		r,
		r
	])).optional();
}
var CN = {
	clearcoat: xN("clearcoat"),
	clearcoatRoughness: xN("clearcoatRoughness"),
	transmission: xN("transmission"),
	thickness: xN("thickness"),
	ior: xN("ior"),
	attenuationColor: SN("attenuationColor"),
	attenuationDistance: I().positive("attenuationDistance must be above 0. Leave it out for no absorption.").max(34e37).describe("Metres to reach attenuationColor.").optional(),
	sheenColor: SN("sheenColor"),
	sheenRoughness: xN("sheenRoughness"),
	specular: xN("specular"),
	specularColor: SN("specularColor"),
	anisotropy: xN("anisotropy"),
	anisotropyRotation: xN("anisotropyRotation"),
	iridescence: xN("iridescence"),
	iridescenceIor: xN("iridescenceIor"),
	iridescenceThickness: xN("iridescenceThickness"),
	toon: xN("toon")
}, wN = {
	waterPreset: G([
		"lake",
		"sea",
		"river"
	]).optional().describe("Water tag."),
	absorption: z(I().min(0).max(20)).length(3).optional().describe("Water tag: RGB per metre."),
	turbidity: eN.optional().describe("Water tag: 0 clear to 1 murky.")
}, TN = ([e, t]) => fl([
	0,
	1,
	2
].map(() => I().min(e).max(t))), EN = V({
	weight: I().min(rb.weight[0]).max(rb.weight[1]).optional(),
	radius: TN(rb.radius).optional().describe("RGB mean free path in scale units."),
	scale: I().min(rb.scale[0]).max(rb.scale[1]).optional().describe("Metres per radius unit."),
	color: TN(rb.color).optional()
}).describe("Subsurface scattering (skin, wax, leaves) as Blender Principled BSDF; details in scene_capabilities materialSubsurface."), DN = {
	...wN,
	...CN,
	subsurface: aN("subsurface", EN, "Subsurface scattering (skin, wax, leaves): weight, radius [r,g,b], scale, color [r,g,b]; ranges in scene_capabilities materialSubsurface.").optional(),
	snippet: W(F(), R()).nullable().optional().describe("GLSL fragment hook; scene_capabilities materialSnippet."),
	wear: W(F(), R()).nullable().optional().describe("Metal showing through paint and dirt, from vertex groups; scene_capabilities materialWear."),
	pattern: aN("pattern", bN, "Procedural texture; box mapping needs no UVs. type is a preset or graph (give graph); also mapping, colors, size, count, bump, seed, axis, resolution; see scene_capabilities pattern.", oN(bN.shape, ["type"])).optional(),
	map: V({ sequence: V({
		frames: z(F().regex(/^[a-f0-9]{64}$/)).min(2).max(64),
		fps: I().positive().max(60),
		loop: L().optional()
	}) }).optional().describe("Image sequence colour map of catalog images; scene_capabilities textureSequence."),
	color: tN.optional().describe("Linear RGB base color, each component between zero and one."),
	metallic: eN.optional(),
	roughness: eN.optional(),
	emission: $M.optional().describe("Emission multiplier. Backend checks Float32 radiance products."),
	emissiveColor: fl([
		$M,
		$M,
		$M
	]).optional().describe("Independent linear RGB emission color."),
	opacity: eN.optional().describe("Surface opacity. Any value below one draws the material blended (glass, windows, visors)."),
	alphaMode: G(["opaque", "blend"]).optional().describe("blend draws after opaque geometry, sorted back to front."),
	doubleSided: L().optional().describe("Draw and light both faces (thin sheets, leaves, cloth)."),
	aov: U([eN, tN]).optional()
}, ON = G([
	"surface",
	"unlit",
	"liquid",
	"foam",
	"foliage",
	"grass",
	"water"
]).optional().describe("Surface kind; liquid, foam, foliage, grass and water change how it renders: see scene_capabilities materialTags and water."), kN = oN(DN, [
	"color",
	"metallic",
	"roughness",
	"emission",
	"opacity"
]), AN = "More fields: tag, alphaMode, doubleSided, emissiveColor, map, pattern, subsurface, snippet, wear, waterPreset, absorption, turbidity and the layers clearcoat, clearcoatRoughness, transmission, thickness, ior, attenuationColor, attenuationDistance, sheenColor, sheenRoughness, specular, specularColor, anisotropy, anisotropyRotation, iridescence, iridescenceIor, iridescenceThickness, toon; see scene_capabilities materialFields.", jN = (e, t, n) => aN("materialFields", e, `${t} ${AN}`, {
	...n,
	...kN
}), MN = V({
	thickness: I().min(0).max(100).optional().describe("Metres of liquid where it faces the camera."),
	ior: I().min(1).max(3).optional(),
	refraction: I().min(0).max(4).optional(),
	scattering: I().min(0).max(10).optional(),
	foamOpacity: eN.optional(),
	foamSoftness: eN.optional()
}), NN = {
	eye: Q.optional(),
	target: Q.optional(),
	up: Q.optional(),
	fov: X.gt(0).lt(180).optional().describe("Vertical perspective field of view in degrees. Not with focalLength."),
	near: QM.optional(),
	far: QM.optional(),
	projection: G(["perspective", "orthographic"]).optional(),
	orthoScale: QM.optional(),
	focalLength: QM.max(1e4).optional().describe("Lens in mm, instead of fov."),
	sensorWidth: QM.max(1e3).optional(),
	shift: fl([I().min(-1).max(1), I().min(-1).max(1)]).optional(),
	fStop: I().min(.7).max(64).optional()
}, $ = (e, t) => I().min(e).max(t), PN = (e, t) => fl([
	$(e, t),
	$(e, t),
	$(e, t)
]), FN = V({
	density: $(0, 10).optional(),
	minimum: PN(-1e5, 1e5).optional(),
	maximum: PN(-1e5, 1e5).optional(),
	color: tN.optional(),
	ambient: PN(0, 10).optional(),
	drift: PN(-100, 100).optional(),
	steps: I().int().min(8).max(48).optional(),
	anisotropy: $(-.9, .9).optional(),
	noiseAmount: eN.optional(),
	noiseScale: $(.001, 100).optional(),
	maxDistance: $(.01, 1e4).optional(),
	shadowAmbient: eN.optional(),
	detailOctaves: I().int().min(1).max(3).optional(),
	detailAmount: eN.optional(),
	warp: $(0, 4).optional(),
	contrast: $(0, 4).optional(),
	profileSoftness: $(0, .95).optional(),
	keyScattering: $(0, 10).optional(),
	heightFalloff: X.optional(),
	scatterOctaves: X.optional(),
	multiScatter: X.optional(),
	multiExtinction: X.optional(),
	multiAnisotropy: X.optional(),
	keyTransmittance: X.optional(),
	surfaceTransmittance: X.optional()
}), IN = z(F()).optional(), LN = el().optional(), RN = W(F(), R()).describe("Outlines, toon light and polylines as plain JSON; fields and limits in scene_capabilities lineArt. null clears."), zN = V({
	world: L().optional().describe("Draw the sky and apply surface fog."),
	ground: L().optional().describe("false: no automatic floor."),
	setup: G(Iy).optional().describe("Named lighting; resets key, fill and ambient fields. Default daylight."),
	environmentIntensity: $(0, 100).optional().describe("Scales the setup environment light and its reflections."),
	hdri: U([G(py), F().regex(hy)]).nullable().optional().describe("HDRI instead of the setup sky; scene_capabilities catalogLooks."),
	environmentRotation: $(-100, 100).optional().describe("Turns the setup environment around the vertical axis, in radians."),
	lightDirection: PN(-1e6, 1e6).optional().describe("Direction toward the key light; shadows follow."),
	keyColor: PN(0, 1e3).optional(),
	keyIntensity: $(0, 100).optional(),
	fillIntensity: $(0, 100).optional(),
	ambientIntensity: $(0, 100).optional(),
	daylight: $(0, 100).optional(),
	keyAffects: IN.describe("Node IDs lit; default all."),
	shadowCascades: I().int().min(0).max(4).optional().describe("Sun shadow slices; 0 one map."),
	sunAngularRadius: I().optional(),
	pointLights: z(V({
		position: PN(-1e6, 1e6),
		color: tN.optional(),
		intensity: $(0, 1e5).optional(),
		radius: $(.001, 1e6).optional(),
		range: U([K(0), $(.001, 1e6)]).optional(),
		castShadow: L().optional().describe("Casts a shadow; 6 atlas tiles."),
		affects: IN
	})).max(16).optional().describe("Replaces the list; [] clears. Intensity in candela."),
	spotLights: z(V({
		position: PN(-1e6, 1e6),
		direction: PN(-1e6, 1e6).describe("Nonzero direction the cone points along."),
		angle: $(.01, Math.PI / 2 - .01).optional().describe("Outer half angle, radians; default pi/4."),
		penumbra: eN.optional().describe("Soft edge, 0 hard; default 0.15."),
		color: tN.optional(),
		intensity: $(0, 1e5).optional().describe("Candela."),
		radius: $(.001, 1e6).optional(),
		range: U([K(0), $(.001, 1e6)]).optional(),
		castShadow: L().optional().describe("Casts a shadow; 1 atlas tile."),
		ies: LN,
		affects: IN
	})).max(8).optional().describe("Replaces the list; [] clears."),
	areaLights: z(V({
		position: PN(-1e6, 1e6).describe("Center of the rectangle."),
		direction: PN(-1e6, 1e6).describe("Direction the rectangle faces; emits that side only."),
		up: PN(-1e6, 1e6).optional().describe("Height axis direction; default world up."),
		width: $(.001, 1e4),
		height: $(.001, 1e4),
		color: tN.optional(),
		intensity: $(0, 1e5).optional().describe("Candela head on."),
		castShadow: L().optional(),
		ies: LN,
		affects: IN
	})).max(7).optional().describe("Replaces the list; [] clears."),
	skyTop: tN.optional(),
	skyBottom: tN.optional(),
	fogColor: tN.optional(),
	fogDensity: $(0, 10).optional(),
	volumeFog: FN.optional().describe("Light-shaft fog; needs HDR."),
	localVolumes: z(W(F(), R())).max(8).optional().describe("Up to 8 absorbing and emitting volumes; fields in scene_capabilities localVolumes."),
	liquid: MN.optional().describe("Optics for materials tagged liquid or foam."),
	lines: RN.nullable().optional(),
	objectReflections: L().optional().describe("false turns off reflection probes on smooth metal parts."),
	floorSkyTrace: L().optional().describe("false turns off the sky traced into floors of sun-lit closed rooms."),
	sunBounce: I().min(0).optional().describe("Sun bounce in a closed room: 0 off, 1 default."),
	specularAntiAliasing: I().min(0).max(4).optional().describe("Specular anti-aliasing: 0 off, 1 default; widens highlights that sparkle on grainy normal-mapped metal."),
	resolveCoplanar: U([K("offset"), K(!1)]).optional().describe("Flush faces are ranked at draw time by default ('offset'); false opts out."),
	viewTransform: G(cy).optional().describe("Display transform, for example agx to compare with Blender."),
	look: U([G([...ly, ...my]), F().regex(hy)]).nullable().optional().describe("Look preset or .cube; scene_capabilities catalogLooks. null clears."),
	sky: W(F(), R()).nullable().optional().describe("Physical sky: {type:\"physical\", sunElevation, sunRotation, turbidity, groundAlbedo, aerialPerspective}; sets key light, sky and fog. Fields in scene_capabilities physicalSky."),
	wind: V({
		strength: $(0, 4).optional(),
		direction: $(-360, 360).optional().describe("Degrees: 0 toward +x, 90 toward +z.")
	}).optional().describe("Sway of foliage and grass materials; strength defaults to 0.3.")
}), BN = aN("environment", zN, "Lighting and sky. More fields: sky (physicalSky), hdri, look, viewTransform, keyColor, keyIntensity, fillIntensity, ambientIntensity, daylight, keyAffects, shadowCascades, pointLights, spotLights, areaLights, skyTop, skyBottom, fogColor, fogDensity, volumeFog (density, scatterOctaves, multiScatter, keyTransmittance, surfaceTransmittance and more: scene_capabilities environment), liquid, lines, wind, objectReflections, floorSkyTrace, sunBounce, specularAntiAliasing, resolveCoplanar; see scene_capabilities environment.", oN(zN.shape, [
	"setup",
	"world",
	"ground",
	"lightDirection",
	"environmentIntensity"
])), VN = R().optional(), HN = V({
	exposure: $(.01, 16).optional(),
	saturation: $(0, 2).optional(),
	contrast: $(.1, 2).optional(),
	temperature: $(-1, 1).optional(),
	vignette: eN.optional(),
	grain: $(0, .1).optional(),
	ambientOcclusion: eN.optional().describe("Screen-space contact darkening, 0 off to 1 full. Default 0.7 when unset; 0 skips the pass."),
	ambientOcclusionRadius: $(.01, 100).optional().describe("World-space reach of the occlusion; default 0.5."),
	bloom: V({
		strength: $(0, 2).optional(),
		threshold: $(0, 10).optional(),
		radius: $(.1, 4).optional()
	}).optional(),
	depthOfField: V({
		blur: eN.optional(),
		focusDistance: $(.01, 1e5).optional()
	}).optional().describe("Lens blur: blur 0 to 1, focusDistance metres."),
	motionBlur: V({
		shutter: $(0, .5).optional(),
		objects: $(0, 1).optional()
	}).optional().describe("Motion smear, shutter in seconds. objects 0 to 1 also smears each moving part along its own motion (off at 0)."),
	colorBalance: VN,
	glare: VN,
	lensDistortion: VN,
	stylize: VN,
	composite: VN
}), UN = aN("effects", HN, "Post effects: exposure, saturation, contrast, temperature, vignette, grain, ambientOcclusion, ambientOcclusionRadius, bloom {strength, threshold, radius}, depthOfField {blur, focusDistance}, motionBlur {shutter}, colorBalance, glare, lensDistortion, stylize, composite; see scene_capabilities effects.", oN(HN.shape, ["exposure"])), WN = V({
	target: PN(-1e6, 1e6).optional(),
	extent: $(.01, 1e5).optional(),
	distance: $(.01, 1e6).optional(),
	near: $(.001, 1e6).optional(),
	far: $(.001, 1e6).optional()
}).describe("Directional shadow coverage. Backend checks Float32 view/projection consistency.");
function GN(e) {
	return [
		V({
			...e,
			type: K("curve"),
			points: z(R()).max(1024).optional(),
			shape: VN,
			splines: z(R()).max(64).optional(),
			kind: VN,
			weights: z(R()).max(1024).optional(),
			trim: VN,
			grow: VN,
			closed: VN,
			radius: VN,
			taper: VN,
			profile: VN,
			resolution: VN,
			radialSegments: VN
		}).refine((e) => e.points !== void 0 || e.shape !== void 0 || e.splines !== void 0, { message: "A curve needs one of points (an array of [x, y, z]), shape ({ type: \"arc\" | \"spiral\" | \"star\" }) or splines (an array of up to 64 splines). See scene_capabilities curveText." }).describe("Sweep along points, a shape or splines; see scene_capabilities curveText."),
		V({
			...e,
			type: K("sdf"),
			root: W(F(), R()),
			resolution: VN
		}).describe("Signed-distance shapes with smooth union; see scene_capabilities curveText."),
		V({
			...e,
			type: K("text"),
			text: F().max(256),
			size: VN,
			depth: VN,
			font: VN,
			align: VN,
			curveSegments: VN
		}).describe("3D text; see scene_capabilities curveText."),
		V({
			...e,
			type: K("terrain"),
			size: VN,
			resolution: VN,
			seed: VN,
			amplitude: VN,
			holes: z(R()).max(16).optional()
		}).describe("Hills with round holes; see scene_capabilities terrain.")
	];
}
function KN(e) {
	let t = e ? { id: Z } : {};
	return [
		V({
			...t,
			type: K("box"),
			bevel: X.optional().describe("Unit cube, -0.5 to 0.5. The default bevel of 0.08 rounds its edges and is scaled with the node; set 0 for exact sizes and crisp edges."),
			subdivisions: sN(1, 128)
		}),
		V({
			...t,
			type: K("cylinder"),
			segments: cN,
			bevel: X.optional().describe("Radius 1, height 1, centred. The default bevel of 0.025 rounds its rims; set 0 for exact sizes and crisp edges."),
			bevelSegments: sN(1, 128)
		}),
		V({
			...t,
			type: K("sphere"),
			segments: cN,
			rings: sN(2, 2048)
		}),
		V({
			...t,
			type: K("torus"),
			tubeRadius: X.optional(),
			segments: cN,
			sides: sN(3, 128),
			arc: X.optional(),
			start: X.optional()
		}),
		V({
			...t,
			type: K("lathe"),
			profile: z(rN).min(2).max(4096),
			segments: cN,
			startAngle: X.optional(),
			sweep: X.optional()
		}),
		V({
			...t,
			type: K("extrude"),
			contour: lN,
			holes: z(lN).max(128).optional(),
			depth: X.optional(),
			steps: sN(1, 256),
			bevel: X.optional(),
			bevelThickness: X.optional(),
			bevelSegments: sN(1, 32)
		}),
		V({
			...t,
			type: K("tube"),
			path: z(Q).min(2).max(4096),
			radius: X.optional(),
			segments: cN,
			radialSegments: sN(3, 128),
			closed: L().optional()
		}),
		...e ? GN(t) : []
	];
}
var qN = W(F(), R()).describe("Face rule: {\"all\":true}, {\"tag\":\"top\"}, {\"normal\":[0,1,0],\"maxAngle\":10}, {\"inside\":{\"min\":[x,y,z],\"max\":[x,y,z]}} (centroids), {\"faces\":[i]}, {\"and\"|\"or\":[rules]}, {\"not\":rule}, {\"grow\":rule,\"steps\":1}, {\"boundary\":rule}, {\"field\":expr}. Tags: top, bottom, side, left, right, front, back, <name>.cap|side|rim."), JN = F().regex(/^[A-Za-z0-9][A-Za-z0-9._-]{0,47}$/).optional().describe("Tag prefix. Defaults to <op>-<index>."), YN = W(F(), R()).describe("Edge rule: {\"all\":true}, {\"angle\":30}, {\"along\":[x,y,z]}, {\"between\":[faceRule,faceRule]}, {\"boundaryOf\":faceRule} or {\"open\":true} for boundary edges (also {\"open\":{\"inside\":{\"min\":[x,y,z],\"max\":[x,y,z]}}})."), XN = W(F(), R()).describe("Face rule, as in set_position."), ZN = U([X, W(F(), R())]), QN = cl("op", [
	V({
		op: K("extrude_face_region"),
		select: qN.optional(),
		name: JN,
		offset: X.describe("Distance along each connected region's average normal (negative pushes in)."),
		direction: Q.optional().describe("Move along this direction instead of the normal."),
		alongNormals: L().optional().describe("Move each vertex along its own normal instead, keeping the region joined: use for rings and curved bands.")
	}),
	V({
		op: K("extrude_individual"),
		select: qN.optional(),
		name: JN,
		offset: X.describe("Distance along each face's own normal."),
		direction: Q.optional()
	}),
	V({
		op: K("inset_region"),
		select: qN.optional(),
		name: JN,
		thickness: X.describe("Rim width, positive."),
		depth: X.optional().describe("Move the inner faces along the normal afterwards.")
	}),
	V({
		op: K("inset_individual"),
		select: qN.optional(),
		name: JN,
		thickness: X,
		depth: X.optional()
	}),
	V({
		op: K("delete"),
		select: qN
	}),
	V({
		op: K("flip_normals"),
		select: qN.optional()
	}),
	V({
		op: K("translate"),
		select: qN.optional(),
		offset: Q,
		falloff: V({
			radius: X,
			curve: G([
				"smooth",
				"sphere",
				"root",
				"sharp",
				"linear",
				"constant",
				"inverseSquare"
			]).optional(),
			connected: L().optional().describe("Measure distance along edges instead of straight lines.")
		}).optional()
	}),
	V({
		op: K("merge_by_distance"),
		distance: X.optional()
	}),
	V({
		op: K("loop_cut"),
		name: JN,
		edges: W(F(), R()).describe("Edge rule that picks the ring to cut across, usually {\"along\":[x,y,z]} for edges parallel to a direction: {\"along\":[0,1,0]} cuts around a box horizontally. Also between, angle, boundaryOf or all."),
		cuts: I().int().min(1).max(16).optional().describe("New loops per ring, evenly spaced. Defaults to 1."),
		factor: $(0, 1).optional().describe("Single cut only: position from the low side of each ring edge. Defaults to 0.5.")
	}).describe("Loop cut across quads. Bands between cuts get <name>.band-0 (low side) to <name>.band-<cuts>."),
	V({
		op: K("fill_holes"),
		name: JN,
		sides: I().int().min(3).max(4096).optional().describe("Skip boundary loops with more edges than this.")
	}).describe("Cap each closed boundary loop with one polygon, tagged <name>.fill. Fixes the lint boundary-edge warning."),
	V({
		op: K("dissolve_faces"),
		name: JN,
		select: qN
	}).describe("Merge connected selected faces into one polygon each, tagged <name>.merged."),
	V({
		op: K("dissolve_edges"),
		name: JN,
		edges: YN
	}).describe("Merge the two faces beside each selected edge, tagged <name>.merged."),
	V({
		op: K("dissolve_verts"),
		name: JN,
		verts: W(F(), R()).describe("Vertex rule: {\"all\":true}, {\"vertices\":[indices]}, {\"valence\":2} or {\"inside\":{\"min\":[x,y,z],\"max\":[x,y,z]}}.")
	}).describe("Remove vertices. Two-edge vertices leave their faces; others merge the faces around them."),
	V({
		op: K("dissolve_limited"),
		name: JN,
		edges: YN.optional().describe("Defaults to all edges."),
		angle: $(0, 180).optional().describe("Degrees of bend still counted as flat. Defaults to 5.")
	}).describe("Dissolve flat edges and the straight vertices left behind; undoes a loop cut."),
	V({
		op: K("bisect_plane"),
		name: JN,
		point: Q.describe("A point on the plane, in the mesh's local space."),
		normal: Q.describe("Plane normal. The inner side is behind it, the outer side in front."),
		distance: $(0, 1e3).optional().describe("Vertices this close to the plane count as on it. Defaults to 0.0001."),
		clearInner: L().optional(),
		clearOuter: L().optional(),
		fill: L().optional().describe("Cap the cut, tagged <name>.cap. With both sides kept the halves become two closed shells.")
	}).describe("Cut at a plane. Faces get <name>.inner or <name>.outer by side."),
	V({
		op: K("bridge_edge_loops"),
		name: JN,
		edges: YN.describe("Rule that selects exactly two boundary loops with the same edge count, usually {\"open\":true}."),
		segments: I().int().min(1).max(64).optional().describe("Quads across the strip. Defaults to 1."),
		twistOffset: I().int().min(-4096).max(4096).optional().describe("Rotate the second loop by this many vertices after the closest match.")
	}).describe("Join two boundary loops with a strip of quads, tagged <name>.bridge."),
	V({
		op: K("subdivide_edges"),
		name: JN,
		edges: YN,
		cuts: I().int().min(1).max(16).optional().describe("New points per edge. Defaults to 1.")
	}).describe("Split edges. Quads with opposite edges split become bands, with all four a grid; others keep an n-gon. New faces get <name>.split."),
	V({
		op: K("grid_fill"),
		name: JN,
		edges: YN.describe("Rule that selects closed boundary loops of an even edge count, usually {\"open\":true}.")
	}).describe("Fill each closed boundary loop with a grid of quads, tagged <name>.fill."),
	V({
		op: K("knife_project"),
		name: JN,
		path: z(Q).min(2).max(256).describe("Polyline in the mesh's local space."),
		direction: Q.describe("Direction the line is projected along, for example [0,0,-1].")
	}).describe("Cut along a polyline projected along a direction, through front and back faces. Split faces get <name>.cut."),
	V({
		op: K("poke"),
		select: qN.optional(),
		name: JN,
		offset: X.optional().describe("Move each new centre along the face normal. Defaults to 0."),
		relative: L().optional().describe("Scale offset by the face's average corner distance.")
	}).describe("Replace each selected face with a triangle fan around a centre vertex, tagged <name>.poke."),
	V({
		op: K("dual"),
		name: JN
	}).describe("Dual mesh: a vertex per face centre, a face per vertex, tagged <name>.dual. Needs a closed, consistently wound mesh."),
	V({
		op: K("tris_to_quads"),
		select: qN.optional(),
		name: JN,
		angle: $(0, 180).optional().describe("Largest angle in degrees between the two triangle normals. Defaults to 40.")
	}).describe("Join adjacent triangles into convex quads, best-shaped first, tagged <name>.merged."),
	V({
		op: K("symmetrize"),
		name: JN,
		axis: G([
			"x",
			"y",
			"z"
		]).optional(),
		keep: G(["positive", "negative"]).optional().describe("Side of the plane kept and mirrored. Defaults to positive."),
		distance: $(0, 1).optional().describe("Vertices this close to the plane count as on it. Defaults to 0.0001.")
	}).describe("Cut at the plane through the origin, drop the other half and mirror the kept half. Mirrored faces get <name>.mirrored."),
	V({
		op: K("scale_elements"),
		select: qN.optional(),
		scale: X.describe("Factor above 0 about each connected group of selected faces.")
	}).describe("Scale connected groups of selected faces about their own centres."),
	V({
		op: K("extrude_edges"),
		name: JN,
		edges: YN.describe("Edges to extrude, usually {\"open\":true} for a boundary."),
		offset: Q.describe("Where the copied vertices move.")
	}).describe("Extrude edges into quads, tagged <name>.side."),
	V({
		op: K("tag"),
		select: qN,
		name: F().regex(/^[A-Za-z0-9][A-Za-z0-9._-]{0,47}$/).describe("Tag to add to the selected faces.")
	}),
	V({
		op: K("boolean"),
		name: JN,
		operation: G([
			"union",
			"difference",
			"intersect"
		]),
		cutter: cl("type", KN(!1)).describe("Closed cutting shape in the mesh's local space, before translation, rotation and scale. Faces it contributes get the tag <name>.cut."),
		translation: Q.optional(),
		rotation: nN.optional().describe("XYZW quaternion."),
		scale: Q.optional().describe("Positive per-axis scale.")
	}).describe("Manifold boolean. Both the mesh and the cutter must be closed; mesh_inspect lists open edges."),
	V({
		op: K("sculpt"),
		select: qN.optional(),
		strokes: z(V({
			type: G([
				"inflate",
				"displace",
				"smooth"
			]),
			center: Q,
			radius: X,
			strength: X,
			direction: Q.optional()
		})).min(1).max(32)
	}).describe("Brush strokes on the vertices of the selected faces, in order. Fields and units in scene_capabilities meshSculpt."),
	V({
		op: K("vertex_group"),
		name: F().max(48),
		select: XN.optional(),
		weight: eN.optional(),
		field: ZN.optional(),
		gradient: W(F(), R()).optional()
	}).describe("Vertex group weights 0-1: weight, field or gradient. See meshAttributes."),
	V({
		op: K("vertex_color"),
		select: XN.optional(),
		color: Q.optional(),
		field: ZN.optional(),
		gradient: W(F(), R()).optional()
	}).describe("Vertex colors: color, vector field or gradient. See meshAttributes."),
	V({
		op: K("shrinkwrap"),
		select: qN.optional(),
		target: W(F(), R()).describe("Primitive to wrap onto, a record like a boolean cutter ({\"type\":\"sphere\"}), placed by translation, rotation and scale."),
		translation: Q.optional(),
		rotation: nN.optional(),
		scale: Q.optional(),
		mode: G(["nearest", "project"]).optional(),
		direction: Q.optional(),
		offset: X.optional(),
		maxDistance: X.optional(),
		onMiss: G(["error", "keep"]).optional()
	}).describe("Move the selected vertices onto the target surface, like Blender Shrinkwrap. Fields and defaults in scene_capabilities meshSculpt.")
]), $N = [
	V({
		op: K("set_position"),
		select: qN.optional(),
		position: hN.optional().describe("Vector expression for the new position of each selected vertex. Defaults to the current position."),
		offset: hN.optional().describe("Vector expression added after position, for example {\"vec\":[0,{\"noise\":{\"scale\":3}},0]}. Give position, offset or both.")
	}).describe("Blender Set Position with field expressions, evaluated on the input positions, for the vertices of the selected faces."),
	V({
		op: K("displace"),
		select: qN.optional(),
		field: hN.describe("Number expression used as the texture."),
		strength: X.optional().describe("Defaults to 1."),
		midlevel: X.optional().describe("Field value that does not move. Defaults to 0.5, the middle of noise."),
		direction: G([
			"normal",
			"x",
			"y",
			"z"
		]).optional().describe("Defaults to normal."),
		group: F().max(48).optional()
	}).describe("Blender Displace with a field as the texture: each vertex moves by (field - midlevel) * strength."),
	V({
		op: K("mirror"),
		name: JN,
		axis: G([
			"x",
			"y",
			"z"
		]).optional().describe("Mirror across the plane through the local origin perpendicular to this axis. Defaults to x."),
		merge: $(0, 1e3).optional().describe("Vertices this close to the plane are shared by both halves. Defaults to 0.001. Faces lying in the plane are removed, so a closed half becomes a closed whole.")
	}),
	V({
		op: K("array"),
		name: JN,
		count: I().int().min(1).max(256).optional(),
		offset: Q.optional().describe("Constant step between copies."),
		relativeOffset: Q.optional().describe("Step in bounding-box sizes. Defaults to [1, 0, 0] unless offset is given."),
		merge: $(0, 1e3).optional().describe("Weld touching copies and remove the faces between them.")
	}),
	V({
		op: K("solidify"),
		name: JN,
		thickness: X.describe("Wall thickness, positive."),
		offset: $(-1, 1).optional().describe("-1 grows inward (default), 1 outward, 0 centred."),
		evenThickness: L().optional()
	}),
	V({
		op: K("bevel"),
		name: JN,
		edges: W(F(), R()).optional().describe("Edge rule: {\"between\":[faceRule,faceRule]} (for example top and side for a rim), {\"angle\":30} (edges bending at least this many degrees, the default), {\"boundaryOf\":faceRule}, or {\"all\":true}."),
		width: X.describe("Distance from the edge into each face, positive."),
		segments: I().int().min(1).max(16).optional().describe("1 is a flat chamfer; 3 or more reads as round."),
		profile: $(0, 1).optional().describe("0 flat, 0.5 round (default), 1 boxy."),
		clampOverlap: L().optional().describe("Shrink width so neighbouring bevels cannot cross. Defaults to true; the result reports clamped.")
	}),
	V({
		op: K("uv_unwrap"),
		seams: W(F(), R()).optional().describe("Edge rule for seams, the same rules as bevel. Defaults to {\"angle\":60}. Extra cuts are added where an island would not lie flat."),
		margin: $(0, .2).optional().describe("Gap between islands and around the square, as a fraction of it. Defaults to 0.01."),
		maxDistortion: $(0, 100).optional().describe("Islands stretching more than this (mean |area ratio - 1|) are split into charts by facing axis. Defaults to 0.25.")
	}).describe("Conformal UV unwrap into the corner attribute uv, packed into 0..1. Put it last (or as the last stack node): later edits do not keep UVs exact. The result reports islands, flipped triangles and areaDistortion."),
	V({
		op: K("uv_project"),
		mode: G([
			"cube",
			"cylinder",
			"sphere"
		]),
		axis: G([
			"x",
			"y",
			"z"
		]).optional(),
		pack: L().optional(),
		margin: $(0, .2).optional(),
		rotate: L().optional()
	}).describe("Cube, cylinder or sphere uv projection, packed into 0..1. Detail: scene_capabilities meshUv."),
	V({
		op: K("uv_pack"),
		margin: $(0, .2).optional(),
		rotate: L().optional()
	}).describe("Pack the existing uv islands into 0..1 with one scale."),
	V({
		op: K("subdivide"),
		levels: I().int().min(1).max(4).optional().describe("Catmull-Clark levels; each multiplies the faces by about 4 (n-gons become n quads). Defaults to 1."),
		crease: W(F(), R()).optional().describe("Edge rule for creased edges, the same rules as bevel: {\"angle\":60} keeps the rims of a cylinder sharp. Boundary edges are always sharp."),
		sharpness: $(0, 10).optional().describe("Crease strength, only with crease. A crease stays fully sharp for that many levels and a fraction blends smooth and sharp. Defaults to 10, sharp at every level.")
	}).describe("Catmull-Clark subdivision with semi-sharp creases, like the Subdivision Surface modifier of Blender. Faces keep their tags and corner attributes such as uv blend linearly. Put it before uv_unwrap. Check the budget: 3 levels make 64 times the faces."),
	V({
		op: K("decimate"),
		ratio: I().gt(0).max(1).describe("Share of the triangles to keep, counted after triangulation. 0.25 keeps a quarter.")
	}).describe("Quadric edge collapse like Blender Decimate. Open boundaries and tag borders stay, tags carry over, uv and colour are dropped, so unwrap after it. Reports triangles and stoppedEarly."),
	V({
		op: K("remesh"),
		voxelSize: I().positive().optional().describe("Edge of one grid cell. Give this or resolution."),
		resolution: I().int().min(4).max(192).optional().describe("Cells along the longest side. Give this or voxelSize.")
	}).describe("Voxel remesh like Blender Remesh: a closed quad surface of even cells. The mesh must be closed (fill_holes first); tags and attributes are dropped. Over 192 cells per side is refused.")
], eP = W(F(), R()).describe(`Whole-mesh modifier { op, ...fields }, op one of: ${Object.keys(Qv).join(", ")}.`), tP = U([cl("op", $N), eP]), nP = U([cl("op", [...QN.options, ...$N]), eP]), rP = [...$N.map((e) => e.shape.op.value), ...Object.keys(Qv)], iP = [...QN.options.map((e) => e.shape.op.value), ...rP], aP = z(aN("meshStack", tP, "Stack node { op, ...fields }; fields per op: scene_capabilities meshStack.", { op: G(rP) })).max(16), oP = z(aN("meshEdit", nP, "Edit { op, ...fields }, applied in order; fields per op: scene_capabilities meshEdit, or meshEdit.<op> for one op.", { op: G(iP) })).max(64), sP = z(W(F(), R())).max(64), cP = z(W(F(), R())).max(16), lP = cl("type", [
	...KN(!0),
	V({
		id: Z,
		type: G(["grid", "plane"]),
		segments: sN(1, 64)
	}).describe("Unit sheet in XY facing +Z; plane = grid."),
	V({
		id: Z,
		type: K("cone"),
		radiusTop: X.optional(),
		radiusBottom: X.optional(),
		segments: cN
	}).describe("Along Y, height 1; radiusTop 0 is a point, radiusBottom 1."),
	V({
		id: Z,
		type: K("icoSphere"),
		subdivisions: sN(0, 7)
	}),
	V({
		id: Z,
		type: K("circle"),
		segments: cN,
		innerRadius: X.optional()
	}).describe("Unit disc facing +Z; innerRadius makes a ring."),
	V({
		id: Z,
		type: K("line"),
		from: Q,
		to: Q,
		radius: X.optional(),
		radialSegments: sN(3, 128)
	}),
	V({
		id: Z,
		type: K("mesh"),
		base: cl("type", KN(!1)).describe("Starting shape, converted to welded quads with axis face tags."),
		edits: sP.optional().describe("Replayable edit log, applied in order. Each item has the shape of one mesh_edit edit; read that tool for every op and field."),
		stack: cP.optional().describe("Non-destructive modifier stack evaluated after the edits. Each item has the shape of one mesh_stack node; read that tool for the ops."),
		smoothAngle: $(0, 180).optional().describe("Edges bending more than this many degrees render hard. Defaults to 30."),
		shapeKeys: sP.optional().describe("Named morph targets, at most 16: { name, offsets | edits, value }. See scene_capabilities meshShapeKeys.")
	})
]), uP = F().max(80).optional();
function dP(e, t, n, r) {
	return V({
		kind: K(e),
		...e === "camera" ? {} : { id: Z },
		property: K(t),
		interpolation: G([
			"LINEAR",
			"STEP",
			"SMOOTH",
			"CUBICSPLINE"
		]).optional(),
		keyframes: z(V({
			time: I().min(0).max(30),
			value: n,
			inTangent: r.optional(),
			outTangent: r.optional(),
			easing: uP
		})).min(1).max(64)
	});
}
var fP = V({
	kind: G([
		"light",
		"sun",
		"environment",
		"effects"
	]).describe("Properties per kind: scene_capabilities motionLook."),
	id: F().max(16).optional().describe("Light only: point:0, spot:0, area:0."),
	property: F().max(24),
	interpolation: G([
		"LINEAR",
		"STEP",
		"SMOOTH"
	]).optional(),
	keyframes: z(V({
		time: I().min(0).max(30),
		value: U([X, Q]),
		easing: uP
	})).min(1).max(64)
}), pP = (e, t) => V({
	interpolation: G([
		"LINEAR",
		"STEP",
		"SMOOTH"
	]).optional(),
	keyframes: z(V({
		time: I().min(0).max(30),
		value: e
	})).min(1).max(64)
}).describe(t), mP = U([
	Q,
	V({ node: Z }).describe("Follow this node's world position."),
	pP(Q, "A moving world position.")
]), hP = U([eN, pP(eN, "Fade the solve in or out over time.")]).optional(), gP = fl([I().min(-180).max(180), I().min(-180).max(180)]), _P = V({
	x: gP.optional(),
	y: gP.optional(),
	z: gP.optional()
}), vP = G([
	"x",
	"y",
	"z"
]), yP = z(vP).min(1).max(3), bP = G([
	"+x",
	"-x",
	"+y",
	"-y",
	"+z",
	"-z"
]), xP = G(["world", "local"]).optional(), SP = fl([I().min(-1e6).max(1e6), I().min(-1e6).max(1e6)]).optional(), CP = Ll(() => U([
	I().min(-1e6).max(1e6),
	K("time"),
	V({
		node: Z,
		property: G([
			"translation",
			"rotation",
			"scale"
		]),
		component: vP,
		space: G(["local", "world"]).optional()
	}),
	W(F().max(24), U([z(CP).min(1).max(8), CP]))
])).describe("Number, \"time\", {\"node\",\"property\",\"component\",\"space\"} read, or an operator like {\"mul\":[2,\"time\"]}, {\"neg\":x} too. Operators as in field expressions (scene_capabilities), no vectors, attributes or noise. At most 64 parts, 8 deep."), wP = U([eN, CP]).optional().describe("0 to 1 blend of the constraint, or an expression."), TP = cl("type", [
	V({
		type: K("copy_location"),
		node: Z,
		target: Z,
		axes: yP.optional(),
		invert: yP.optional(),
		offset: L().optional(),
		space: xP,
		influence: wP
	}),
	V({
		type: K("copy_rotation"),
		node: Z,
		target: Z,
		axes: yP.optional(),
		invert: yP.optional(),
		mix: G(["replace", "add"]).optional(),
		space: xP,
		influence: wP
	}),
	V({
		type: K("copy_scale"),
		node: Z,
		target: Z,
		axes: yP.optional(),
		offset: L().optional(),
		space: xP,
		influence: wP
	}),
	V({
		type: K("limit_location"),
		node: Z,
		x: SP,
		y: SP,
		z: SP,
		space: xP,
		influence: wP
	}),
	V({
		type: K("limit_rotation"),
		node: Z,
		x: gP.optional(),
		y: gP.optional(),
		z: gP.optional(),
		space: xP,
		influence: wP
	}),
	V({
		type: K("track_to"),
		node: Z,
		target: Z,
		trackAxis: bP.optional(),
		upAxis: vP.optional(),
		worldUp: Q.optional(),
		influence: wP
	}),
	V({
		type: K("child_of"),
		node: Z,
		target: Z,
		inverse: G(["rest", "none"]).optional(),
		influence: wP
	}),
	V({
		type: G([
			"floor",
			"copy_transforms",
			"limit_distance",
			"limit_scale",
			"stretch_to",
			"locked_track",
			"transformation",
			"action"
		]),
		node: Z,
		target: Z.optional(),
		axis: bP.optional(),
		offset: I().min(-1e6).max(1e6).optional(),
		influence: wP,
		args: W(F(), R()).optional()
	})
]), EP = V({
	target: U([V({
		kind: K("node"),
		id: Z,
		property: G([
			"translation",
			"rotation",
			"scale"
		]),
		component: vP
	}), V({
		kind: K("material"),
		id: Z,
		property: G([
			"color",
			"emissiveColor",
			"emission",
			"metallic",
			"roughness"
		]),
		component: vP.optional()
	})]),
	expression: CP
}), DP = cl("type", [V({
	type: K("two-bone"),
	root: Z,
	middle: Z,
	end: Z,
	target: mP.describe("Where end should reach: [x, y, z] in world metres, {\"node\":id}, or keyframes."),
	pole: mP.optional().describe("World point the middle joint bends toward. Give one, or a straight limb has no bend direction."),
	weight: hP,
	keepEndRotation: L().optional().describe("Default true: end keeps its world rotation, so a foot or gripper stays level."),
	limits: V({
		root: _P.optional(),
		middle: _P.optional()
	}).optional().describe("Joint limits in degrees: how far root or middle may turn from its rest rotation, per axis of its own, as Euler XYZ. scene_inspect motionIk lists each pose a limit changed."),
	bendToward: Q.optional().describe("World direction the middle joint should bend toward, such as [0, 0, 1] for a knee on a character facing +z. motionIk warns with wrong-bend when the solve bends the other way. Rigs that rest bent need none.")
}).describe("Limb of three nodes, each a descendant of the one before: shoulder, elbow, wrist. Computes their rotations, so you need no quaternions. Nodes with IK nodes below them must have uniform scale: put sizes on child mesh nodes."), V({
	type: K("aim"),
	joint: Z.optional(),
	joints: z(Z).min(1).max(16).optional().describe("A chain from its base to the aiming node, sharing the turn."),
	worldForward: Q.optional().describe("The world direction the character faces in its rest pose, such as [0, 0, 1]. Use this on imported rigs, whose bone axes vary."),
	forward: Q.optional().describe("Instead of worldForward: the aiming node's local axis to point at the target. Defaults to [0, 0, 1], the front of an unrotated recipe node."),
	target: mP,
	maxAngle: I().min(.001).max(180).optional().describe("Limits the whole turn, in degrees."),
	weight: hP
}).describe("Point a node, such as a head, lamp or camera, at a target.")]), OP = V({
	duration: I().min(.1).max(30),
	ik: z(DP).max(16).optional().describe("Inverse kinematics run after the tracks and any selected clip, in order, on recipes and imported assets. IDs are recipe node IDs or an asset's node-N IDs; find them with scene_inspect kind hierarchy. scene_inspect reports motionIk: whether each solver reaches its target across the clip."),
	constraints: z(TP).max(32).optional().describe("Blender-style node constraints, run in order after the tracks, drivers and IK, each on the pose the one before left: copy_location, copy_rotation, copy_scale, limit_location, limit_rotation, track_to, child_of, floor. Euler angles are XYZ in degrees; space defaults to world. Same result at any time, so seeking equals playing."),
	drivers: z(EP).max(32).optional().describe("Drive one node component or material property from a bounded expression over time and other nodes' values. A driven property cannot also have a track."),
	loop: L().optional(),
	tracks: z(U([
		dP("node", "translation", Q, Q),
		dP("node", "rotation", nN, nN),
		dP("node", "scale", fl([
			QM,
			QM,
			QM
		]), Q),
		dP("material", "color", tN, Q),
		dP("material", "emissiveColor", fl([
			$M,
			$M,
			$M
		]), Q),
		dP("material", "emission", $M, X),
		dP("material", "metallic", eN, X),
		dP("material", "roughness", eN, X),
		dP("camera", "eye", Q, Q),
		dP("camera", "target", Q, Q),
		dP("camera", "fov", X.gt(0).lt(180), X),
		dP("camera", "roll", X, X),
		dP("geometry", "oceanTime", X.min(-1e6).max(1e6), X),
		fP
	])).max(128)
}).describe("One absolute-time procedural clip. Local node transforms propagate through parents. Cubic tangents are derivatives per second. Backend checks references, duplicate tracks, 2048 total keys and every sampled pose."), kP = V({
	node: Z.describe("Root node with a geometry; the collider is fitted to it and the body drives its pose."),
	type: G([
		"dynamic",
		"fixed",
		"kinematic"
	]).optional().describe("Defaults to dynamic."),
	shape: G([
		"box",
		"ball",
		"capsule",
		"convex",
		"trimesh"
	]).optional().describe("Defaults: box for dynamic and sensors, trimesh for fixed. Trimesh (at most 20000 triangles) needs a fixed or kinematic body; convex takes at most 2048 distinct vertices."),
	mass: QM.optional().describe("Kilograms; mass or density, not both."),
	density: QM.optional().describe("Defaults to 1."),
	friction: $M.optional(),
	restitution: eN.optional(),
	sensor: L().optional().describe("Trigger volume; scene_inspect lists enter and leave times."),
	velocity: Q.optional(),
	angularVelocity: Q.optional(),
	layer: I().int().min(0).max(15).optional(),
	collidesWith: z(I().int().min(0).max(15)).max(16).optional().describe("Layers hit; both bodies must list each other. Defaults to all.")
}), AP = V({
	type: G([
		"spherical",
		"revolute",
		"prismatic",
		"fixed"
	]),
	bodyA: Z,
	bodyB: Z,
	anchorA: Q.optional(),
	anchorB: Q.optional(),
	axis: Q.optional().describe("Unit vector for revolute and prismatic joints."),
	limits: fl([X, X]).optional().describe("Radians for revolute, metres for prismatic.")
}), jP = V({
	duration: I().min(.1).max(10),
	gravity: Q.optional().describe("Defaults to [0, -9.81, 0]."),
	bodies: z(kP).min(1).max(64),
	joints: z(AP).max(64).optional().describe("Joint bodies are the node IDs of physics bodies.")
}).describe("Rigid bodies recorded offline with Rapier (optional peer) at 60 fps and seeked by motionTime. scene_inspect reports contacts and resting state. A node cannot have a body and a motion translation or rotation track."), MP = W(F(), R()).meta({ id: "LooseRecord" }), NP = V({
	node: Z.describe("Root mesh node."),
	pin: z(G([
		"top",
		"bottom",
		"left",
		"right",
		"topLeft",
		"topRight",
		"bottomLeft",
		"bottomRight"
	])).max(8).optional(),
	pinGroup: F().max(48).optional(),
	pinTo: MP.optional(),
	stiffnessGroup: F().max(48).optional(),
	softBody: MP.optional(),
	selfCollision: L().optional(),
	stiffness: eN.optional(),
	bend: eN.optional(),
	density: QM.optional(),
	damping: $M.optional(),
	friction: eN.optional(),
	thickness: $M.optional()
}), PP = V({
	duration: I().min(.1).max(10),
	gravity: Q.optional(),
	wind: Q.optional(),
	sheets: z(NP).min(1).max(8),
	colliders: z(MP).max(80).optional().describe("Fields: scene_capabilities cloth."),
	fields: z(MP).max(8).optional().describe("Force fields: scene_capabilities particles.")
}).describe("Baked at 60 fps, seeked by motionTime. Units, defaults: scene_capabilities cloth."), FP = W(F(), R()).describe("The same object as recipe.motion in scene_create: duration, loop, tracks, ik, constraints, drivers. Read that tool for the fields. On an imported asset it also takes layers, up to 8 clips played at motion time before tracks and ik: { clip (scene_inspect animations id), mask: { joints, descendants, exclude } of node IDs, weight, speed, offset, loop, additive, reference, bones: { clip node: asset node } to retarget by name, morph } or from: { asset, clip } for a clip of another catalog asset retargeted onto this humanoid (scale, rootMotion). motion also takes drive (a car along a path, see scene_capabilities motionDrive) and footLock (true or { contactHeight, contactSpeed, blend, ground }) and { kind: \"morph\", id: target name, property: \"weight\" } tracks. A masked layer waves while another walks."), IP = V({
	name: F().min(1).max(64).describe("Unique within the armature. Humanoid rigs use the canonical names (hips, spine, chest, neck, head, leftUpperArm, leftLowerArm, leftHand, leftUpperLeg, leftLowerLeg, leftFoot, leftToes, and right...) so retarget works."),
	parent: F().min(1).max(64).nullable().optional().describe("Parent bone name, or null for a root bone."),
	head: Q.describe("Rest position of the joint in armature space."),
	tail: Q.optional().describe("Where the bone ends. Defaults to the mean of its children, so give it on leaf bones.")
}), LP = V({
	id: Z,
	parent: Z.nullable().optional().describe("Node the armature hangs from."),
	translation: Q.optional(),
	rotation: nN.optional(),
	prefix: F().max(64).optional().describe("Prepended to each bone node ID, for a second character or a clash with another node."),
	preset: G(["humanoid", "quadruped"]).optional().describe("Places bones from fit. A humanoid faces +Z with Y up; its knees sit slightly forward of the leg line and its elbows slightly behind, so poleless two-bone IK bends the right way. A quadruped lies along Z."),
	fit: V({
		node: Z.optional().describe("A mesh node whose bounds size the preset."),
		bounds: V({
			min: Q,
			max: Q
		}).optional().describe("Or explicit bounds in armature space."),
		landmarks: W(F(), Q).optional().describe("Move a bone head by bone name, or its tail as <name>Tail, for arms held out or an odd shape.")
	}).optional(),
	bones: z(IP).min(1).max(128).optional().describe("Explicit bones, instead of a preset.")
}).describe("A skeleton. Each bone becomes a recipe node named after it (parented like the bones, rotating about its head), so motion tracks, motion.ik and set-node address bones by name. Mesh nodes bind with skin. scene_inspect rig lists unweighted vertices, bones with no vertices and joint axis problems."), RP = z(W(F(), R())).max(16).describe("The same array as recipe.armatures in scene_create: id, parent, preset, fit, bones. Read that tool for the fields."), zP = W(F(), R()).describe("Shots in order, up to 60 s; fields in scene_capabilities filmTimeline."), BP = aN("geometries", lP, "Geometry { id, type, ...fields of that type }; mesh also takes base, edits, stack, smoothAngle. Fields per type: scene_capabilities geometries. box and cylinder are unit solids (box -0.5..0.5) sized by node scale; their default bevel rounds the edges, so give bevel 0 for exact sizes. uv_unwrap stretches under a non-uniform node scale: bake the size into the vertices first (set_position, position {mul:[{attr:position},[x,y,z]]}).", {
	id: Z,
	type: G(lP.options.flatMap((e) => e.shape.type.options ?? [e.shape.type.value]))
}), VP = aN("motion", OP, "One absolute-time clip: duration in s, loop, tracks [{kind, id, property, interpolation, keyframes [{time, value, easing}]}], ik, constraints, drivers; see scene_capabilities motion.", oN(OP.shape, ["duration", "loop"])), HP = aN("physics", jP, "Rigid bodies recorded offline with Rapier: duration, gravity, bodies [{node, type, shape, mass, ...}], joints; see scene_capabilities physics.", oN(jP.shape, ["duration"])), UP = aN("cloth", PP, "Baked cloth sheets: duration, gravity, wind, sheets [{node, pin, pinTo, stiffness, ...}], colliders; see scene_capabilities cloth.", oN(PP.shape, ["duration"])), WP = aN("armatures", LP, "A skeleton { id, parent, preset humanoid|quadruped, fit, bones [{name, parent, head, tail}], prefix, translation, rotation }; see scene_capabilities armatures.", { id: Z }), GP = W(F(), R()).describe("Playable setup as plain JSON, never code: {player:{node}, camera, input, physics, ground, rules}. Fields and an example: scene_capabilities game."), KP = V({
	format: K("67js.scene"),
	schemaVersion: K(1),
	geometries: z(BP).max(256).optional(),
	materials: z(jN(V({
		id: Z,
		tag: ON,
		...DN
	}), "Material.", { id: Z })).max(256).optional().describe("Omit for none."),
	nodes: z(vN).max(4096),
	armatures: z(WP).max(16).optional(),
	camera: V(NN).optional(),
	environment: BN.optional(),
	effects: UN.optional(),
	shadow: WN.optional(),
	motion: VP.nullable().optional(),
	physics: HP.nullable().optional(),
	cloth: UP.nullable().optional(),
	timeline: zP.nullable().optional(),
	particles: W(F(), R()).nullable().optional().describe("Particle emitters and hair, seeked by motionTime. Fields: scene_capabilities particles."),
	bake: W(F(), R()).nullable().optional().describe("Bounced light baked at build time. Fields: scene_capabilities bake."),
	postPasses: z(W(F(), R())).nullable().optional().describe("Full-screen GLSL passes, [{name, fragment, uniforms, scale}]. Rules: scene_capabilities postPasses."),
	game: GP.nullable().optional()
}).describe("Bounded scene recipe; the backend validates it."), qP = V({
	format: K("67js.asset"),
	schemaVersion: K(1),
	assetId: F().regex(/^[a-f0-9]{64}$/).describe("SHA-256 asset ID from scene_asset_catalog."),
	camera: V(NN).optional(),
	environment: BN.optional(),
	effects: UN.optional(),
	shadow: WN.optional(),
	root: V({
		translation: Q.optional(),
		rotation: nN.optional(),
		scale: fl([
			QM,
			QM,
			QM
		]).optional()
	}).optional(),
	animation: V({
		clip: I().int().min(0),
		time: $M
	}).nullable().optional().describe("Absolute clip/time sample. null selects the original decoded pose."),
	materialOverrides: z(jN(V({
		id: Z,
		...DN
	}), "Override of a source material.", { id: Z })).max(4096).optional(),
	nodeOverrides: z(V({
		id: Z,
		translation: Q.optional(),
		rotation: nN.optional(),
		scale: fl([
			QM,
			QM,
			QM
		]).optional()
	})).max(4096).optional(),
	motion: FP.nullable().optional()
});
function JP(e, t) {
	return (n) => n.code === "unrecognized_keys" && n.keys.includes(t) ? `${e} takes its fields beside type, not inside ${t}: {"type":"${e}","id":"<id>",...fields}. Move the fields of ${t} up one level.` : void 0;
}
var YP = (e, t) => [V({
	type: K("set-node"),
	id: Z,
	geometry: Z.optional(),
	material: Z.optional(),
	...e
}, { error: JP("set-node", "node") }), V({
	type: K("add-node"),
	node: t
})], XP = [
	jN(V({
		type: K("set-material"),
		id: Z,
		...DN
	}, { error: JP("set-material", "material") }), "Change a material.", {
		type: K("set-material"),
		id: Z
	}),
	V({
		type: K("set-camera"),
		...NN
	}),
	V({
		type: K("set-motion"),
		motion: FP.nullable()
	}),
	V({
		type: K("bake-motion"),
		nodes: z(Z).min(1).max(32),
		start: $M.optional(),
		end: $M.optional(),
		step: QM.optional(),
		tolerance: W(F(), I()).optional()
	}),
	V({
		type: K("set-armatures"),
		armatures: RP.nullable()
	}),
	V({
		type: K("set-physics"),
		physics: W(F(), R()).nullable().describe("Same object as recipe.physics in scene_create.")
	}),
	V({
		type: K("set-cloth"),
		cloth: W(F(), R()).nullable()
	}),
	V({
		type: K("set-timeline"),
		timeline: W(F(), R()).nullable()
	}),
	V({
		type: K("set-particles"),
		particles: W(F(), R()).nullable()
	}),
	V({
		type: K("set-bake"),
		bake: W(F(), R()).nullable()
	}),
	V({
		type: K("set-post-passes"),
		postPasses: z(W(F(), R())).nullable()
	}),
	V({
		type: K("set-game"),
		game: GP.nullable()
	}),
	V({
		type: K("set-environment"),
		environment: BN
	}),
	V({
		type: K("set-effects"),
		effects: UN
	}),
	V({
		type: K("set-shadow"),
		shadow: WN
	}),
	V({
		type: K("set-root"),
		translation: Q.optional(),
		rotation: nN.optional(),
		scale: fl([
			QM,
			QM,
			QM
		]).optional()
	}),
	V({
		type: K("set-asset-node"),
		id: Z,
		translation: Q.optional(),
		rotation: nN.optional(),
		scale: fl([
			QM,
			QM,
			QM
		]).optional()
	}),
	V({
		type: K("set-animation"),
		clip: I().int().min(0).nullable().optional(),
		time: $M.optional()
	}),
	V({
		type: K("remove-node"),
		id: Z,
		recursive: L().optional().describe("Remove descendants too. Defaults to false; dangling children reject the batch.")
	}),
	V({
		type: K("add-geometry"),
		geometry: BP
	}),
	V({
		type: K("remove-geometry"),
		id: Z
	}),
	V({
		type: K("add-material"),
		material: jN(V({
			id: Z,
			tag: ON,
			...DN
		}), "New material.", {
			id: Z,
			tag: ON
		})
	}),
	V({
		type: K("remove-material"),
		id: Z
	})
], ZP = cl("type", [...YP(mN, vN), ...XP]), { relations: QP, ...$P } = mN, eF = vN.omit({ relations: !0 }), tF = KP.extend({ nodes: z(eF).max(4096) });
function nF(e) {
	let { relations: t, ...n } = e.scene;
	return {
		...e,
		scene: n
	};
}
var rF = cl("type", [...YP($P, eF), ...XP]), iF = F().regex(Eu).describe("Branch name, up to 24 characters."), aF = L().optional().describe("Draw part names, tags and lint problems on the image; returned with pixel positions."), oF = { sessionId: kc("sessionId is not a valid UUID. Leave it out to use the last used scene.").optional().describe("Leave out: the last used scene.") }, sF = {
	...oF,
	checkpointId: kc().describe("Checkpoint UUID returned by scene_checkpoint for this session.")
}, cF = I().int().min(0).max(2 ** 53 - 1).describe("Current revision returned by create, inspect, apply or restore. Stale edits fail atomically."), lF = { jobId: kc().describe("Render job UUID returned by scene_render_submit or capabilities jobs.records.") }, uF = V({
	kind: G([
		"image",
		"stills",
		"video"
	]),
	width: I().int().min(64).max(Uy),
	height: I().int().min(64).max(Uy),
	fps: I().int().min(1).max(60).optional(),
	duration: I().min(.1).max(60).optional(),
	animation: V({
		clip: I().int().min(0),
		start: I().min(0).max(3600).optional()
	}).optional(),
	motion: V({ start: I().min(0).max(3600).optional() }).optional(),
	rendererTime: V({
		start: I().min(0).max(3600).optional(),
		rate: I().min(-16).max(16).optional()
	}).optional(),
	renderer: H({
		type: K("pathTracer"),
		backend: G([
			"cpu",
			"gpu",
			"native"
		]).optional()
	}).meta({ description: "Path tracer. Also samples, bounces, denoise, seed, maxSeconds, noiseThreshold: scene_capabilities pathTracer." }).pipe(V({
		type: K("pathTracer"),
		backend: G([
			"cpu",
			"gpu",
			"native"
		]).optional(),
		samples: I().optional(),
		bounces: I().optional(),
		denoise: U([L(), G([
			"wavelet",
			"oidn",
			"none"
		])]).optional(),
		seed: I().optional(),
		maxSeconds: I().optional(),
		noiseThreshold: I().optional()
	})).optional(),
	timeline: V({ start: I().min(0).max(60).optional() }).optional().describe("Play the recipe timeline from start (default 0); it owns the motion clock, so leave motion and animation out."),
	audio: V({
		file: F().max(68),
		offset: I().min(0).max(3600).optional(),
		track: G(["aac", "pcm"]).optional()
	}).optional().describe("Video only: a file in the --audio folder, mixed in from offset seconds."),
	encoder: G(zy).optional().describe("Video only: cpu (default) or nvenc."),
	passes: z(G(Ry)).min(1).max(Ry.length).optional().describe("image and stills: also write a raw PNG per pass; opaque geometry only."),
	transparent: L().optional().describe("image and stills: lit image with alpha; no sky, auto ground or volume fog."),
	format: G(By).optional().describe("image and stills: png (default), png16 or exr (depth in metres)."),
	multilayer: L().optional().describe("With format exr and passes: pack Combined and every pass into one EXR per frame."),
	region: V({
		x: I().int().min(0),
		y: I().int().min(0),
		width: I().int().min(16),
		height: I().int().min(16)
	}).optional().describe("Pixels to keep from the top left. Not with renderer.")
}).describe("Snapshot render: one PNG, eight evenly spaced PNGs, or H.264 MP4 (even dimensions). Defaults: 24 fps, one second. motion.start plays recipe tracks, animation an imported clip, both layer. Omitted motion holds time zero."), dF = {
	readOnlyHint: !0,
	destructiveHint: !1,
	idempotentHint: !0,
	openWorldHint: !1
}, fF = {
	readOnlyHint: !1,
	destructiveHint: !1,
	idempotentHint: !1,
	openWorldHint: !1
}, pF = {
	readOnlyHint: !1,
	destructiveHint: !0,
	idempotentHint: !1,
	openWorldHint: !1
}, mF = {
	scene_capabilities: "Scene capabilities",
	scene_create: "Create scene",
	scene_asset_catalog: "Asset catalog",
	scene_create_asset: "Create scene from asset",
	scene_inspect: "Inspect scene",
	scene_walkmap: "Walkable map",
	mesh_inspect: "Inspect meshes",
	mesh_edit: "Edit mesh",
	mesh_stack: "Set mesh modifiers",
	scene_apply: "Apply scene edits",
	scene_look: "Look at scene",
	scene_review: "Review camera samples",
	scene_checkpoint: "Save checkpoint",
	scene_restore: "Restore checkpoint",
	scene_release_checkpoint: "Release checkpoint",
	scene_export_recipe: "Export recipe",
	scene_export_glb: "Export GLB",
	scene_export_web: "Export web game",
	scene_dispose: "Dispose scene",
	scene_render_submit: "Submit render job",
	scene_render_status: "Render job status",
	scene_render_cancel: "Cancel render job",
	scene_render_result: "Render job result",
	scene_render_release: "Release render job"
}, hF = {
	scene_capabilities: H({ phase: F().optional() }),
	scene_inspect: H({
		sessionId: F().optional(),
		revision: I().int().optional()
	}),
	scene_checkpoint: H({
		checkpointId: F(),
		revision: I().int().optional()
	}),
	scene_release_checkpoint: H({
		released: L(),
		checkpointId: F().optional()
	}),
	scene_render_status: H({
		jobId: F(),
		state: F()
	}),
	scene_render_result: H({
		jobId: F(),
		artifacts: z(H({
			filename: F(),
			mimeType: F(),
			bytes: I(),
			path: F()
		}))
	})
}, gF = /* @__PURE__ */ new Set([
	"image/png",
	"image/jpeg",
	"image/webp"
]), _F = 1048576;
async function vF(e, t = e) {
	let n = [{
		type: "text",
		text: JSON.stringify(t)
	}];
	for (let t of e.artifacts) gF.has(t.mimeType) && t.bytes <= _F && n.push({
		type: "image",
		data: (await c(t.path)).toString("base64"),
		mimeType: t.mimeType
	}), n.push({
		type: "resource_link",
		uri: T(t.path).href,
		name: t.filename,
		mimeType: t.mimeType,
		size: t.bytes
	});
	return {
		content: n,
		structuredContent: t
	};
}
function yF(e) {
	let t = (e instanceof Error ? e.message : String(e)).split(/\s+at (?:[^\n(]+ \()?https?:\/\//)[0].replace(/^page\.evaluate: (?:\w*Error: )?/, "").trim();
	return SF(t) ? (console.error(`67js internal error: ${t}`), xF) : t;
}
var bF = /Cannot (?:read|set) propert(?:y|ies) of (?:undefined|null)|Cannot destructure|is not a function|is not iterable|is not defined|Cannot convert undefined or null/, xF = "Internal error in the 67js server, not caused by your input. Call scene_inspect to check the scene, retry once, and if it repeats, leave out the optional field you just added (for example labels) or report the tool name.";
function SF(e) {
	return bF.test(e);
}
var CF = /* @__PURE__ */ new Set(["scene_create", "scene_create_asset"]), wF = "No scene was created, so the other tools have nothing to inspect: fix the recipe as the message says and call scene_create again.";
function TF(e) {
	return {
		content: [{
			type: "text",
			text: JSON.stringify(e)
		}],
		structuredContent: e
	};
}
function EF(e, { version: t = Xv.version, branches: n = !0, relations: r = !0, callLogPath: i = process.env[yb] } = {}) {
	let a = xb(i), o = n ? { branch: iF.optional().describe("Fork: store the result as this branch (up to 8), leaving the scene unchanged.") } : {}, s = n ? { branch: iF.optional().describe("Render this scene_apply branch.") } : {}, c = n ? { branch: iF.optional() } : {}, l = sF.checkpointId.optional(), u = new rv({
		name: "67js-scene",
		version: t
	}, { instructions: "Start with scene_capabilities. Create a procedural recipe with scene_create, or select a configured GLB digest from scene_asset_catalog and use scene_create_asset. Pass its sessionId to work on several open scenes; without it the last used scene is used. Inspect stable IDs and save a checkpoint before editing. Apply small batches with the current expectedRevision and check committed, revision and renderSucceeded. A committed edit can have a separate renderError; do not retry it with an old revision." + (n ? " To try variants, give scene_apply a branch name for each (the scene stays put), compare them in one scene_review with a branch per shot, then keep the best with scene_restore and its branch." : "") + " Pass labels: true to scene_look or scene_review to match part names to the image. Use scene_look to judge the actual image, or scene_review with the current expectedRevision to compare independent camera and motion samples in one grid while preserving the source pose. When jobs are configured, scene_render_submit captures an immutable snapshot. Poll scene_render_status, cancel when needed, and retrieve verified local artifact metadata with scene_render_result after completion. Preview rendering and edits pause during a job; source revision and checkpoints survive. Release outputs with scene_render_release. Export the final recipe and dispose the scene when finished. No arbitrary JavaScript, remote URLs or caller-selected output paths are exposed." }), d;
	u.server.onclose = () => {
		d ??= Promise.resolve().then(() => e.close()), d.then(() => console.error("67js preview resources closed."), (e) => console.error(`67js runtime cleanup failed: ${e.message}`));
	};
	function f(t, n) {
		if (!(n.shape !== void 0 && "sessionId" in n.shape) || t.sessionId !== void 0) return t;
		let r = e.activeSessionId();
		return r ? {
			...t,
			sessionId: r
		} : t;
	}
	function p(e, t, n, r, i) {
		u.registerTool(e, {
			title: mF[e],
			description: t,
			inputSchema: n,
			annotations: {
				title: mF[e],
				...r
			},
			...hF[e] ? { outputSchema: hF[e] } : {}
		}, async (t) => {
			let r = async () => {
				try {
					return await i(f(t, n));
				} catch (t) {
					return {
						isError: !0,
						content: [{
							type: "text",
							text: `${e} failed: ${yF(t)}${CF.has(e) ? ` ${wF}` : ""}`
						}]
					};
				}
			};
			return a ? a(e, r) : r();
		});
	}
	return p("scene_capabilities", "Index of supported recipe features and runtime budgets; pass topic for the detail of one. Read it before authoring. Does not launch a browser.", V({
		topic: F().min(1).max(64).optional().describe("A name from the index, or name.branch such as meshEdit.bevel. Leave out for the index."),
		response_format: ab
	}), dF, async ({ topic: t, response_format: n }) => {
		let i = yu(r ? await e.capabilities() : nF(await e.capabilities()), t, iN);
		return TF(sb("scene_capabilities", n) === "concise" && i.fields !== void 0 ? {
			...i,
			fields: vb(i.fields)
		} : i);
	}), p("scene_create", "Create a render scene from a JSON recipe; the result has its sessionId. Several scenes stay open; past the cap the least recently used one is closed.", V({ recipe: r ? KP : tF }), {
		...fF,
		destructiveHint: !1
	}, async (t) => TF(await e.create(t))), p("scene_asset_catalog", "List content-bound GLB and PNG, JPEG or WebP image IDs from the configured local asset directory. No arbitrary paths or downloads.", V({}), dF, async () => TF(await e.assetCatalog())), p("scene_create_asset", "Create the active scene from a catalog GLB and editable asset recipe. Preserves supported maps, skins, morphs and clips. The result has its sessionId.", V({ recipe: qP }), {
		...fF,
		destructiveHint: !1
	}, async (t) => TF(await e.createAsset(t))), p("scene_inspect", "Read revision, counts and selected nodes. For a recipe with physics, the result lists body final positions, resting times, contacts and sensor enter/leave events. Bounds describe authored geometry rather than shader displacement.", V({
		...oF,
		ids: z(Z).max(4096).optional().describe("Selected node IDs; an imported node means its parts and those below. Omit to inspect scene order."),
		kind: G(["meshes", "hierarchy"]).optional().describe("Imported assets only: hierarchy exposes stable source-node IDs and joints."),
		offset: I().int().min(0).max(4096).optional().describe("Imported assets only: pagination offset."),
		limit: I().int().min(1).max(4096).optional().describe("Maximum returned node records. Defaults to 64."),
		includeBounds: L().optional().describe("Include world geometry bounds. Defaults to false."),
		path: W(F(), R()).optional().describe("Walking route over a ground node, around holes: fields in scene_capabilities navigation.")
	}), dF, async (t) => TF(await e.inspect(t))), p("scene_walkmap", "Walkable map on a grid: rows of . walkable, x blocked, # no surface. keepOut (m) avoids obstacles. assetId: query a big catalog GLB, no render.", V({
		...oF,
		assetId: F().regex(/^[a-f0-9]{64}$/).optional(),
		min: fl([I(), I()]),
		max: fl([I(), I()]),
		cellSize: I().min(.05).default(1),
		clearance: I().min(0).default(2),
		keepOut: I().min(0).optional(),
		streetY: I().optional(),
		includeCells: L().optional()
	}), dF, async (t) => TF(await e.walkMap(t))), p("mesh_inspect", "Check recipe geometries as polygon meshes: vertex, edge and face counts, triangles/quads/n-gons, connected and closed parts, face tags (top, bottom, side, left, right, front, back), bounds, and lint problems (non-manifold, inconsistent winding, inverted, degenerate, open, loose) with a suggested fix each. Also imported asset parts (mesh-0). Read-only and cached per geometry.", V({
		...oF,
		geometry: Z.optional().describe("One geometry ID to check, as in mesh_edit."),
		geometries: z(Z).min(1).max(16).optional().describe("Geometry IDs to check. Omit both to check the first 16 geometries.")
	}), dF, async ({ geometry: t, geometries: n, ...r }) => TF(await e.inspectMeshes({
		...r,
		...n || t ? { geometries: [...n ?? [], ...t ? [t] : []] } : {}
	}))), p("mesh_edit", "Append edits to a recipe mesh geometry or an imported asset part such as mesh-0 (or replace its edit log), atomically like scene_apply: extrude, inset, delete, flip, translate with falloff, tag, loop cut, bevel, mirror, array, solidify, UV unwrap, set_position and displace with field expressions (math, noise, attributes), booleans with a primitive cutter, sculpt brush strokes and shrinkwrap onto a primitive. Edits that select no faces or break limits fail without changing the scene. Returns the new revision, render status and the mesh report with per-edit results.", V({
		...oF,
		expectedRevision: cF,
		geometry: Z.describe("ID of a geometry with type mesh, or an imported part such as mesh-0."),
		edits: oP.min(1),
		replace: L().optional().describe("Replace the whole edit log instead of appending.")
	}), fF, async (t) => TF(await e.editMesh(t))), p("mesh_stack", "Set the non-destructive modifier stack of a recipe mesh geometry (ops and fields: scene_capabilities meshModifiers), evaluated after its edits, each prefix cached. apply: n moves the first n nodes into the edit log, as Blender's Apply modifier. Atomic like scene_apply. Returns the revision, render status and mesh report.", V({
		...oF,
		expectedRevision: cF,
		geometry: Z.describe("ID of a geometry with type mesh."),
		stack: aP.optional().describe("The whole new stack. Omit to keep the current stack (for example with apply)."),
		apply: I().int().min(0).max(16).optional()
	}), fF, async (t) => TF(await e.setMeshStack(t))), p("scene_apply", "Atomically edit transforms, look, camera or materials. Procedural scenes support membership and set-motion authoring. Imported assets support set-root, set-asset-node, set-motion and absolute set-animation sampling. Successful batches increment revision once. Returns results (one entry per operation, with a warning when it changed nothing) and a diff of added, removed and changed IDs, not the node list (call scene_inspect for that).", V({
		...oF,
		expectedRevision: cF,
		operations: z(r ? ZP : rF).min(1).max(256).describe("Node/material/camera/root/animation commands use flat fields. Motion, look patches and add commands contain nested records. Backend validates each scene mode before publication."),
		...o
	}), fF, async (t) => TF(await e.apply(t))), p("scene_look", "Render the active scene as a bounded PNG, optionally with part labels. Optional authored motionTime seeks without changing revision; null restores the authored base pose. Omit to retain the last preview pose.", V({
		...oF,
		motionTime: I().min(0).max(3600).nullable().optional(),
		width: I().int().min(64).max(1024).default(768).describe("PNG width in pixels."),
		height: I().int().min(64).max(1024).default(512).describe("PNG height in pixels."),
		labels: aF
	}), dF, async (t) => {
		let { data: n, mimeType: r, metadata: i } = await e.look(t);
		return {
			content: [{
				type: "image",
				data: n,
				mimeType: r
			}, {
				type: "text",
				text: JSON.stringify(i)
			}],
			structuredContent: i
		};
	}), p("scene_review", "Compare one to four independent camera or motion samples in one labeled PNG grid. Preserves source revision, transient pose, viewport and checkpoints. Omitted motionTime restores authored base pose; omitted animation uses the authored asset clip pose; rendererTime defaults to zero. No render job store is required.", V({
		...oF,
		expectedRevision: cF,
		width: I().int().min(64).max(480).default(384),
		height: I().int().min(64).max(480).default(384),
		labels: aF,
		response_format: ab,
		shots: z(V({
			label: F().max(48).optional(),
			...s,
			camera: V(NN).optional(),
			animation: V({
				clip: I().int().min(0).max(2 ** 53 - 1),
				time: I().min(0).max(3600)
			}).optional(),
			motionTime: I().min(0).max(3600).nullable().optional(),
			rendererTime: I().min(0).max(3600).optional()
		})).min(1).max(4)
	}), dF, async ({ response_format: t, ...n }) => {
		let { data: r, mimeType: i, metadata: a } = await e.review(n), o = sb("scene_review", t) === "concise" ? fb(a) : a;
		return {
			content: [{
				type: "image",
				data: r,
				mimeType: i
			}, {
				type: "text",
				text: JSON.stringify(o)
			}],
			structuredContent: o
		};
	}), p("scene_checkpoint", "Save a private recipe snapshot. Up to 16 are kept per scene; past that the oldest is evicted.", V(oF), {
		...fF,
		destructiveHint: !1
	}, async (t) => TF(await e.checkpoint(t))), p("scene_restore", "Restore a checkpoint atomically using the current revision. The checkpoint remains available and revision increments. With revision (last 4 kept), undo with no checkpoint. With branch, keep that branch (one revision) and drop all branches.", V({
		...oF,
		checkpointId: l,
		revision: I().int().min(0).optional(),
		...c,
		expectedRevision: cF
	}), fF, async (t) => TF(await e.restore(t))), p("scene_release_checkpoint", "Release one checkpoint slot. Released or foreign checkpoints fail.", V(sF), pF, async (t) => TF(await e.releaseCheckpoint(t))), p("scene_export_recipe", "Read a detached canonical JSON recipe for reproduction.", V(oF), dF, async (t) => TF(await e.exportRecipe(t))), p("scene_export_glb", "Write the active scene as a GLB file in the configured jobs folder, under a server-chosen name (the result has the path, byte count and SHA-256). Needs --jobs. Exports the current pose with pattern and imported textures, skins, morph weights and IK as posed; motionTime seeks authored motion first. For an imported asset, clip adds that source clip (translation, rotation, scale and morph weight tracks) on the source skeleton, which needs no animation, node overrides or motion in the scene. At most eight files are kept, oldest removed first; the GLB is at most 32 MiB.", V({
		...oF,
		clip: I().int().min(0).max(255).optional().describe("Imported assets only: index of the source clip to write."),
		motionTime: I().min(0).max(3600).optional().describe("Seek authored motion (and IK) to this time before exporting. Leaves the preview there, like scene_look."),
		maxTextureSize: I().int().min(1).max(4096).optional().describe("Largest texture side in pixels. Defaults to 2048.")
	}), fF, async (t) => TF(await e.exportGlb(t))), p("scene_export_web", "Write the scene with its game as a static web build in the jobs folder: index.html, game.json and engine/, which any static host serves with no server code. Needs --jobs and a game set with set-game. Procedural scenes only; the newest four builds are kept.", V({
		...oF,
		title: F().max(64).optional().describe("Page title.")
	}), fF, async (t) => TF(await e.exportWeb(t))), p("scene_dispose", "Dispose the active scene and its checkpoints, releasing renderer resources.", V(oF), pF, async (t) => TF(await e.dispose(t))), p("scene_render_submit", "Start one asynchronous snapshot job in the configured private job store. Requires the current revision. Temporarily leases the preview renderer; does not change source revision or checkpoints.", V({
		...oF,
		expectedRevision: cF,
		settings: uF
	}), {
		...fF,
		destructiveHint: !1
	}, async (t) => TF(await e.submitJob(t))), p("scene_render_status", "Read render job state and durable frame progress. Terminal states are completed, cancelled, failed and interrupted.", V({
		...lF,
		response_format: ab
	}), dF, async ({ response_format: t, ...n }) => {
		let r = await e.jobStatus(n);
		return TF(sb("scene_render_status", t) === "concise" ? pb(r) : r);
	}), p("scene_render_cancel", "Request cancellation of one job. Poll status until terminal before using the preview again.", V(lF), {
		...fF,
		idempotentHint: !0
	}, async (t) => TF(await e.cancelJob(t))), p("scene_render_result", "Read completed local output paths, MIME types, byte counts, SHA-256 digests and measured render metrics. Returns a PNG inline and a resource link to each file; video stays on disk.", V({
		...lF,
		response_format: ab
	}), dF, async ({ response_format: t, ...n }) => {
		let r = await e.jobResult(n);
		return vF(r, sb("scene_render_result", t) === "concise" ? hb(r) : r);
	}), p("scene_render_release", "Delete the owned files and record for a terminal job, freeing store quota. Active jobs must be cancelled first.", V(lF), pF, async (t) => TF(await e.releaseJob(t))), u;
}
async function DF({ argumentsValue: e = process.argv.slice(2), previewUrl: t = new URL(
	/* @vite-ignore */
	"../build/mcp/preview.js",
	import.meta.url
), version: i = Xv.version } = {}) {
	let a = {
		backend: "gpu",
		memory: 192
	};
	for (let t = 0; t < e.length; t += 2) {
		let n = e[t], r = e[t + 1];
		if (![
			"--backend",
			"--browser",
			"--memory",
			"--assets",
			"--jobs",
			"--ffmpeg",
			"--audio",
			"--branches",
			"--relations"
		].includes(n) || r === void 0) throw Error("Use --backend cpu|gpu, --browser <local executable path>, --memory <32..384 MiB>, --assets <absolute GLB directory>, --jobs <absolute private output directory>, --ffmpeg <absolute executable>, --audio <absolute folder of .wav, .mp3, .ogg or .flac files for video jobs>, --branches on|off and --relations on|off (both default on).");
		a[n.slice(2)] = n === "--memory" ? Number(r) : r;
	}
	if (!["cpu", "gpu"].includes(a.backend) || !Number.isInteger(a.memory) || a.memory < 32 || a.memory > 384) throw Error("Backend must be cpu or gpu, and memory must be an integer from 32 to 384 MiB.");
	r(0, n.priority.PRIORITY_BELOW_NORMAL);
	let { createAgentRuntime: o } = await Promise.resolve().then(() => (ZM(), AM)), s = Dv(() => EF(o({
		...a,
		previewUrl: t
	}), {
		version: i,
		branches: a.branches !== "off",
		relations: a.relations !== "off"
	}), {
		transport: new Cv(process.stdin, process.stdout, { maxBufferSize: 2097152 }),
		onerror: (e) => console.error(`67js MCP error: ${e.message}`)
	});
	for (let e of ["SIGINT", "SIGTERM"]) process.once(e, () => s.close().catch((e) => console.error(`67js shutdown failed: ${e.message}`)));
}
process.argv[1] && import.meta.url === T(S(process.argv[1])).href && DF().catch((e) => {
	console.error(e.message), process.exitCode = 1;
});
export { EF as createAgentMcpServer, yF as readableErrorMessage, DF as runMcpCli };
