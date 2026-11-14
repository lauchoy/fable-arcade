/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { n as e } from "./motion-validation-BCm1CqIb.js";
// src/expression.js
var t = 1e6, n = Object.freeze({
	x: 0,
	y: 1,
	z: 2
}), r = 24, i = Object.freeze([
	"vec",
	"dot",
	"cross",
	"distance",
	"length",
	"normalize",
	"x",
	"y",
	"z"
]), a = /* @__PURE__ */ new Set([
	...i,
	"attr",
	"noise",
	"random"
]), o = /* @__PURE__ */ new Map([
	[1, "one operand"],
	[2, "two operands"],
	[3, "three operands"]
]), s = (e) => ({
	kind: "scalar",
	evaluate: e
}), c = (e) => s(() => e), l = (e, t, n) => ({
	kind: "vector",
	parts: [
		e,
		t,
		n
	]
});
function u(e) {
	return e.kind === "vector" ? e.parts : [
		e.evaluate,
		e.evaluate,
		e.evaluate
	];
}
function d(e) {
	return typeof e == "number" && Number.isFinite(e) && Math.abs(e) <= 1e6;
}
function f(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return !1;
	let t = Object.getPrototypeOf(e);
	return t === Object.prototype || t === null;
}
function p(e) {
	let t = e.length > r ? `${e.slice(0, r)}...` : e;
	return JSON.stringify(t);
}
function m(e, t) {
	let [n, r, i] = t;
	return t.length === 1 ? (t) => e(n(t)) : t.length === 2 ? (t) => e(n(t), r(t)) : (t) => e(n(t), r(t), i(t));
}
function h(e, t, n) {
	let r = (e) => {
		if (e.every((e) => e.kind === "scalar")) return s(m(n, e.map((e) => e.evaluate)));
		let t = (t) => m(n, e.map((e) => u(e)[t]));
		return l(t(0), t(1), t(2));
	};
	return {
		min: e,
		max: t,
		build: t <= 3 ? r : (e) => e.slice(1).reduce((e, t) => r([e, t]), e[0])
	};
}
function g(e, t) {
	if (e.kind !== "scalar") throw TypeError(`${t} needs a number, not a vector.`);
	return e.evaluate;
}
function _(e) {
	return {
		min: 2,
		max: 2,
		build: ([t, n]) => {
			let r = g(t, "a comparison"), i = g(n, "a comparison");
			return s((t) => +!!e(r(t), i(t)));
		}
	};
}
function v(e) {
	return {
		min: 2,
		max: 8,
		build: (t) => {
			let n = t.map((e) => g(e, "a logic operator"));
			return s((t) => {
				for (let r of n) {
					let n = r(t) !== 0;
					if (e && !n) return 0;
					if (!e && n) return 1;
				}
				return +!!e;
			});
		}
	};
}
function y() {
	return {
		min: 1,
		max: 1,
		build: ([e]) => {
			let t = g(e, "not");
			return s((e) => +(t(e) === 0));
		}
	};
}
function b() {
	return {
		min: 3,
		max: 3,
		build: ([e, t, n]) => {
			let r = g(e, "if"), [i, a, o] = u(t), [c, d, f] = u(n);
			return t.kind === "scalar" && n.kind === "scalar" ? s((e) => r(e) === 0 ? c(e) : i(e)) : l((e) => r(e) === 0 ? c(e) : i(e), (e) => r(e) === 0 ? d(e) : a(e), (e) => r(e) === 0 ? f(e) : o(e));
		}
	};
}
function x(e) {
	return Number.isFinite(e) ? e : 0;
}
function S(e, t, n) {
	if (e === t) return n < e ? 0 : 1;
	let r = Math.min(1, Math.max(0, (n - e) / (t - e)));
	return r * r * (3 - 2 * r);
}
function C() {
	return /* @__PURE__ */ new Map([
		["add", h(2, 8, (e, t) => e + t)],
		["mul", h(2, 8, (e, t) => e * t)],
		["min", h(2, 8, Math.min)],
		["max", h(2, 8, Math.max)],
		["sub", h(2, 2, (e, t) => e - t)],
		["div", h(2, 2, (e, t) => t === 0 ? 0 : e / t)],
		["mod", h(2, 2, (e, t) => t === 0 ? 0 : e - t * Math.floor(e / t))],
		["pow", h(2, 2, (e, t) => x(e ** +t))],
		["atan2", h(2, 2, Math.atan2)],
		["clamp", h(3, 3, (e, t, n) => Math.min(n, Math.max(t, e)))],
		["mix", h(3, 3, (e, t, n) => e + (t - e) * n)],
		["smoothstep", h(3, 3, S)],
		["neg", h(1, 1, (e) => -e)],
		["abs", h(1, 1, Math.abs)],
		["sqrt", h(1, 1, (e) => e < 0 ? 0 : Math.sqrt(e))],
		["sin", h(1, 1, Math.sin)],
		["cos", h(1, 1, Math.cos)],
		["floor", h(1, 1, Math.floor)],
		["ceil", h(1, 1, Math.ceil)],
		["round", h(1, 1, Math.round)],
		["fract", h(1, 1, (e) => e - Math.floor(e))],
		["sign", h(1, 1, Math.sign)],
		["saturate", h(1, 1, (e) => Math.min(1, Math.max(0, e)))],
		["lt", _((e, t) => e < t)],
		["lte", _((e, t) => e <= t)],
		["gt", _((e, t) => e > t)],
		["gte", _((e, t) => e >= t)],
		["eq", _((e, t) => e === t)],
		["and", v(!0)],
		["or", v(!1)],
		["not", y()],
		["if", b()]
	]);
}
function w({ min: e, max: t }) {
	return e === t ? o.get(e) : `${e} to ${t} operands`;
}
function T(t, n, r, i) {
	let { dialect: a } = r, o = a.operators.get(t);
	if (!o) {
		let e = [...a.operators.keys(), ...a.sourceNames];
		throw a.reject(`unknown operator ${p(t)}. Use one of ${e.join(", ")}.`, r);
	}
	let s = o.max === 1 && !(Array.isArray(n) && n.length === 1) ? [n] : n, c = `${t} takes ${w(o)}.`;
	if (!Array.isArray(s) || (e(s, 8, `${t} operands`), s.length < o.min || s.length > o.max)) throw a.reject(c, r);
	return o.build(s.map((e) => D(e, r, i + 1)));
}
function E(e) {
	return e === "time" || f(e) && Object.hasOwn(e, "node") ? "motion" : Array.isArray(e) || f(e) && (Object.hasOwn(e, "attr") || a.has(Object.keys(e)[0])) ? "field" : null;
}
function D(e, n, r) {
	let { dialect: i } = n;
	if (n.nodeCount += 1, n.nodeCount > i.maxNodes) throw i.reject(`more than ${i.maxNodes} nodes.`, n);
	if (r > i.maxDepth) throw i.reject(`nests deeper than ${i.maxDepth} levels.`, n);
	if (typeof e == "number") {
		if (!d(e)) throw i.reject(`a number must be finite and within ${t}.`, n);
		return c(e);
	}
	if (typeof e == "boolean") return c(+!!e);
	let a = i.compileInput(e, n, r);
	if (a) return a;
	let o = E(e);
	if (o && o !== i.name) throw i.reject(`this is a ${o} input and a ${i.name} expression cannot use it. A ${i.name} expression takes ${i.accepts}.`, n);
	if (!f(e)) throw i.reject(`use ${i.accepts}.`, n);
	let s = Object.keys(e);
	if (s.length !== 1) throw i.reject(`an operator object has exactly one key, such as {"add": [1, 2]}; got ${s.length}.`, n);
	return T(s[0], e[s[0]], n, r);
}
export { p as a, h as c, s as d, l as f, C as i, u as l, D as n, d as o, c as r, f as s, n as t, g as u };
