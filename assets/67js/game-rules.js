/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
// src/game-rules.js
var e = Object.freeze({
	maximumVariables: 32,
	maximumZones: 64,
	maximumParts: 64,
	maximumPrefabs: 16,
	maximumRules: 64,
	maximumActionsPerRule: 8,
	maximumSpawns: 64,
	maximumTagsPerPart: 8,
	maximumExpressionDepth: 4,
	maximumEventLogEntries: 2e3,
	maximumNameLength: 64
}), t = Object.freeze([
	"enter",
	"exit",
	"contact",
	"input",
	"timer",
	"variable"
]), n = Object.freeze([
	"set",
	"add",
	"show",
	"hide",
	"spawn",
	"animation",
	"sound",
	"win",
	"lose",
	"restart"
]), r = Object.freeze([
	"+",
	"-",
	"*",
	"/",
	"<",
	"<=",
	">",
	">=",
	"==",
	"!="
]), i = /^[A-Za-z0-9][A-Za-z0-9_.-]*$/, a = [
	"pressed",
	"released",
	"held"
], o = 1e-9, s = {
	"<": (e, t) => e < t,
	"<=": (e, t) => e <= t,
	">": (e, t) => e > t,
	">=": (e, t) => e >= t,
	"==": (e, t) => e === t,
	"!=": (e, t) => e !== t
}, c = {
	"+": (e, t) => e + t,
	"-": (e, t) => e - t,
	"*": (e, t) => e * t,
	"/": (e, t) => t === 0 ? 0 : e / t
};
function l(e, t, n) {
	throw RangeError(`Game rules ${e} ${t}. ${n}`);
}
function u(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function d(e, t, n) {
	u(e) || l(t, "must be an object", `Pass { ${n.join(", ")} }.`);
	for (let r of Object.keys(e)) n.includes(r) || l(`${t}.${r}`, "is not a known field", `Use one of: ${n.join(", ")}.`);
}
function f(e, t, n) {
	Array.isArray(e) || l(t, "must be an array", `Pass an array of at most ${n} items.`), e.length > n && l(t, `has ${e.length} items`, `Pass at most ${n}; split the game or drop some.`);
}
function p(t, n) {
	return typeof t == "string" && t.length <= e.maximumNameLength && i.test(t) || l(n, `is ${JSON.stringify(t)}`, `Pass a name of letters, digits, "_", "-" or "." that starts with a letter or digit, at most ${e.maximumNameLength} characters.`), t;
}
function m(e, t, n) {
	if (!Number.isFinite(e) || n !== void 0 && e <= n) {
		let r = n === void 0 ? "a finite number" : `a finite number above ${n}`;
		l(t, `is ${JSON.stringify(e)}`, `Pass ${r}.`);
	}
	return e;
}
function h(e, t) {
	return Array.isArray(e) && e.length === 3 && e.every(Number.isFinite) || l(t, `is ${JSON.stringify(e)}`, "Pass [x, y, z] with three finite numbers."), [...e];
}
function g(e, t) {
	return typeof e != "boolean" && l(t, `is ${JSON.stringify(e)}`, "Pass true or false."), e;
}
function _(e, t, n) {
	return p(e, t), n.has(e) && l(t, `repeats the id "${e}"`, "Give every entry its own id."), n.add(e), e;
}
function v(t, n) {
	return t === void 0 ? [] : (f(t, n, e.maximumTagsPerPart), t.map((e, t) => p(e, `${n}[${t}]`)));
}
function y(e, t, n) {
	return n.includes(e) || l(t, `is ${JSON.stringify(e)}`, `Pass one of: ${n.join(", ")}.`), e;
}
function b(t) {
	if (t === void 0) return {};
	u(t) || l("variables", "must be an object", "Pass { \"score\": 0 }, a name for each number.");
	let n = Object.keys(t);
	n.length > e.maximumVariables && l("variables", `has ${n.length} variables`, `Pass at most ${e.maximumVariables}.`);
	let r = {};
	for (let e of n) p(e, `variables.${e}`), r[e] = m(t[e], `variables.${e}`);
	return r;
}
function x(t) {
	if (t === void 0) return [];
	f(t, "zones", e.maximumZones);
	let n = /* @__PURE__ */ new Set();
	return t.map((e, t) => {
		let r = `zones[${t}]`;
		d(e, r, [
			"id",
			"shape",
			"center",
			"size",
			"radius"
		]);
		let i = _(e.id, `${r}.id`, n), a = y(e.shape, `${r}.shape`, ["box", "sphere"]), o = h(e.center, `${r}.center`);
		if (a === "box") {
			e.radius !== void 0 && l(`${r}.radius`, "does not apply to a box", "Pass size: [x, y, z] for a box, or shape \"sphere\" with radius.");
			let t = h(e.size, `${r}.size`);
			return t.every((e) => e > 0) || l(`${r}.size`, `is ${JSON.stringify(t)}`, "Pass three extents above 0."), {
				id: i,
				shape: a,
				center: o,
				size: t
			};
		}
		return e.size !== void 0 && l(`${r}.size`, "does not apply to a sphere", "Pass radius for a sphere, or shape \"box\" with size."), {
			id: i,
			shape: a,
			center: o,
			radius: m(e.radius, `${r}.radius`, 0)
		};
	});
}
function S(t) {
	if (t === void 0) return [];
	f(t, "parts", e.maximumParts);
	let n = /* @__PURE__ */ new Set();
	return t.map((e, t) => {
		let r = `parts[${t}]`;
		return d(e, r, [
			"id",
			"tags",
			"position",
			"visible"
		]), {
			id: _(e.id, `${r}.id`, n),
			tags: v(e.tags, `${r}.tags`),
			position: e.position === void 0 ? null : h(e.position, `${r}.position`),
			visible: e.visible === void 0 || g(e.visible, `${r}.visible`)
		};
	});
}
function C(t) {
	if (t === void 0) return [];
	f(t, "prefabs", e.maximumPrefabs);
	let n = /* @__PURE__ */ new Set();
	return t.map((e, t) => {
		let r = `prefabs[${t}]`;
		return d(e, r, ["id", "tags"]), {
			id: _(e.id, `${r}.id`, n),
			tags: v(e.tags, `${r}.tags`)
		};
	});
}
function w(t, n, i, a = 1) {
	if (typeof t == "number") return m(t, n);
	if (typeof t == "string") {
		if (!i.variableNames.has(t)) {
			let e = [...i.variableNames].join(", ") || "none declared";
			l(n, `names the variable "${t}", which is not declared`, `Declare it under "variables", or use one of: ${e}.`);
		}
		return t;
	}
	Array.isArray(t) && t.length === 3 || l(n, `is ${JSON.stringify(t)}`, "Pass a number, a variable name, or [operator, left, right]."), a > e.maximumExpressionDepth && l(n, "nests deeper than the limit", `Nest at most ${e.maximumExpressionDepth} levels; compute part of it into a variable first.`);
	let [o, s, c] = t;
	return y(o, `${n}[0]`, r), [
		o,
		w(s, `${n}[1]`, i, a + 1),
		w(c, `${n}[2]`, i, a + 1)
	];
}
function T(e, t, n, r) {
	if (p(e, t), !n.has(e)) {
		let i = [...n].join(", ") || `none declared; add one under "${r}"`;
		l(t, `names the ${r.replace(/s$/, "")} "${e}", which is not declared`, `Use one of: ${i}.`);
	}
	return e;
}
function E(e, n, r) {
	u(e) || l(n, "must be an object", `Pass { type } with type one of: ${t.join(", ")}.`);
	let i = y(e.type, `${n}.type`, t);
	switch (i) {
		case "enter":
		case "exit": return d(e, n, [
			"type",
			"zone",
			"tag"
		]), {
			type: i,
			zone: T(e.zone, `${n}.zone`, r.zoneIds, "zones"),
			tag: T(e.tag, `${n}.tag`, r.tags, "tags")
		};
		case "contact": return d(e, n, ["type", "between"]), f(e.between, `${n}.between`, 2), e.between.length !== 2 && l(`${n}.between`, `has ${e.between.length} tags`, "Pass exactly two tags, such as [\"player\", \"enemy\"]."), {
			type: i,
			between: e.between.map((e, t) => T(e, `${n}.between[${t}]`, r.tags, "tags"))
		};
		case "input": {
			d(e, n, [
				"type",
				"action",
				"phase"
			]), r.hasInput || (r.usesInput = !0);
			let t = e.phase === void 0 ? "pressed" : y(e.phase, `${n}.phase`, a);
			return {
				type: i,
				action: p(e.action, `${n}.action`),
				phase: t
			};
		}
		case "timer": {
			d(e, n, [
				"type",
				"seconds",
				"repeat"
			]);
			let t = e.repeat !== void 0 && g(e.repeat, `${n}.repeat`);
			return {
				type: i,
				seconds: m(e.seconds, `${n}.seconds`, 0),
				repeat: t
			};
		}
		default: return d(e, n, ["type", "expression"]), {
			type: i,
			expression: w(e.expression, `${n}.expression`, r)
		};
	}
}
function D(e, t, r) {
	u(e) || l(t, "must be an object", `Pass { type } with type one of: ${n.join(", ")}.`);
	let i = y(e.type, `${t}.type`, n);
	switch (i) {
		case "set":
		case "add": return d(e, t, [
			"type",
			"variable",
			"value"
		]), {
			type: i,
			variable: T(e.variable, `${t}.variable`, r.variableNames, "variables"),
			value: w(e.value, `${t}.value`, r)
		};
		case "show":
		case "hide": return d(e, t, ["type", "part"]), {
			type: i,
			part: T(e.part, `${t}.part`, r.partIds, "parts")
		};
		case "spawn": return d(e, t, [
			"type",
			"prefab",
			"position"
		]), {
			type: i,
			prefab: T(e.prefab, `${t}.prefab`, r.prefabIds, "prefabs"),
			position: h(e.position, `${t}.position`)
		};
		case "animation": return d(e, t, ["type", "event"]), {
			type: i,
			event: p(e.event, `${t}.event`)
		};
		case "sound": return d(e, t, ["type", "name"]), {
			type: i,
			name: p(e.name, `${t}.name`)
		};
		default: return d(e, t, ["type"]), { type: i };
	}
}
function O(t, n) {
	if (t === void 0) return [];
	f(t, "rules", e.maximumRules);
	let r = /* @__PURE__ */ new Set();
	return t.map((t, i) => {
		let a = `rules[${i}]`;
		return d(t, a, [
			"id",
			"when",
			"if",
			"once",
			"do"
		]), f(t.do, `${a}.do`, e.maximumActionsPerRule), t.do.length === 0 && l(`${a}.do`, "is empty", "Pass at least one action, such as { \"type\": \"add\", \"variable\": \"score\", \"value\": 1 }."), {
			id: t.id === void 0 ? `rule${i}` : _(t.id, `${a}.id`, r),
			when: E(t.when, `${a}.when`, n),
			condition: t.if === void 0 ? null : w(t.if, `${a}.if`, n),
			once: t.once !== void 0 && g(t.once, `${a}.once`),
			actions: t.do.map((e, t) => D(e, `${a}.do[${t}]`, n))
		};
	});
}
function k(e, { hasInput: t = !0 } = {}) {
	d(e, "document", [
		"version",
		"variables",
		"zones",
		"parts",
		"prefabs",
		"rules"
	]), e.version !== 1 && l("version", `is ${JSON.stringify(e.version)}`, "Pass version: 1.");
	let n = b(e.variables), r = x(e.zones), i = S(e.parts), a = C(e.prefabs), o = {
		variableNames: new Set(Object.keys(n)),
		zoneIds: new Set(r.map((e) => e.id)),
		partIds: new Set(i.map((e) => e.id)),
		prefabIds: new Set(a.map((e) => e.id)),
		tags: new Set([...i, ...a].flatMap((e) => e.tags)),
		hasInput: t,
		usesInput: !1
	}, s = O(e.rules, o);
	return o.usesInput && l(`rules[${s.findIndex((e) => e.when.type === "input")}].when`, "is an input trigger, and the game has no input", "Pass options.input from createInput, or use another trigger."), {
		version: 1,
		variables: n,
		zones: r,
		parts: i,
		prefabs: a,
		rules: s
	};
}
function A(e, t) {
	if (typeof e == "number") return e;
	if (typeof e == "string") return t[e];
	let [n, r, i] = e, a = A(r, t), o = A(i, t), l = c[n];
	return l === void 0 ? +!!s[n](a, o) : l(a, o);
}
function j(e, t) {
	return e.shape === "sphere" ? t.reduce((t, n, r) => t + (n - e.center[r]) ** 2, 0) <= e.radius ** 2 : t.every((t, n) => Math.abs(t - e.center[n]) <= e.size[n] / 2);
}
function M(e, t) {
	return `${e}\u0000${t}`;
}
function N(t, n = {}) {
	let r = k(t, { hasInput: n.input !== void 0 }), i = r.variables, a = new Map(r.prefabs.map((e) => [e.id, e.tags])), s = [], c = 0, l = 0, u = 0, d = "playing", f = { ...i }, p = [], m = /* @__PURE__ */ new Set(), g = 0, _ = /* @__PURE__ */ new Set(), v = /* @__PURE__ */ new Map(), y = [], b = [], x = [];
	function S() {
		f = { ...i }, p = r.parts.map((e) => ({
			...e,
			tags: [...e.tags],
			position: e.position && [...e.position]
		})), m = /* @__PURE__ */ new Set(), g = 0, _ = /* @__PURE__ */ new Set(), v = /* @__PURE__ */ new Map(), y = [], b = [], x = [], d = "playing", u = 0;
	}
	S();
	function C(t) {
		s.length >= e.maximumEventLogEntries ? c += 1 : (s.push(t), n.onEvent?.(t));
	}
	function w(e, t) {
		let n = p.find((t) => t.id === e);
		if (n === void 0) throw RangeError(`${t} names the part "${e}", which the game does not have. Use one of: ${p.map((e) => e.id).join(", ") || "none declared"}.`);
		return n;
	}
	function T() {
		let e = /* @__PURE__ */ new Set();
		for (let t of p) {
			let i = n.getPartPosition?.(t.id);
			if (i !== void 0 && (t.position = h(i, `getPartPosition("${t.id}") result`)), t.visible && t.position !== null) for (let n of r.zones) j(n, t.position) && e.add(M(n.id, t.id));
		}
		b = [], x = [];
		for (let t of r.zones) for (let n of p) {
			let r = M(t.id, n.id);
			e.has(r) && !m.has(r) && b.push({
				zone: t.id,
				part: n
			}), !e.has(r) && m.has(r) && x.push({
				zone: t.id,
				part: n
			});
		}
		m = e;
	}
	function E(e, t) {
		let n = e.find((e) => e.zone === t.zone && e.part.tags.includes(t.tag));
		return n === void 0 ? null : { part: n.part.id };
	}
	function D(e) {
		let [t, n] = e.between;
		for (let [e, r] of y) {
			if (e.tags.includes(t) && r.tags.includes(n)) return { parts: [e.id, r.id] };
			if (r.tags.includes(t) && e.tags.includes(n)) return { parts: [r.id, e.id] };
		}
		return null;
	}
	function O(e) {
		let { input: t } = n;
		return {
			pressed: t.wasPressed,
			released: t.wasReleased,
			held: t.isHeld
		}[e.phase](e.action) ? { action: e.action } : null;
	}
	function N(e, t) {
		if (e.repeat) {
			let n = Math.floor(t / e.seconds + o);
			return Math.floor(u / e.seconds + o) > n ? {} : null;
		}
		return t < e.seconds - o && u >= e.seconds - o ? {} : null;
	}
	function P(e, t) {
		let n = A(e.expression, f) !== 0, r = v.get(t) === !0;
		return v.set(t, n), n && !r ? {} : null;
	}
	function F(e, t, n) {
		let r = e.when;
		switch (r.type) {
			case "enter": return E(b, r);
			case "exit": return E(x, r);
			case "contact": return D(r);
			case "input": return O(r);
			case "timer": return N(r, n);
			default: return P(r, t);
		}
	}
	function I(t, n) {
		let r = {
			step: l,
			rule: n,
			action: t.type
		};
		switch (t.type) {
			case "set":
			case "add": {
				let e = A(t.value, f);
				f[t.variable] = t.type === "set" ? e : f[t.variable] + e, C({
					...r,
					variable: t.variable,
					value: f[t.variable]
				});
				return;
			}
			case "show":
			case "hide":
				w(t.part, `rules[${n}] action`).visible = t.type === "show", C({
					...r,
					part: t.part
				});
				return;
			case "spawn":
				if (g >= e.maximumSpawns) {
					C({
						...r,
						prefab: t.prefab,
						refused: "spawn limit"
					});
					return;
				}
				g += 1, p.push({
					id: `${t.prefab}#${g}`,
					tags: [...a.get(t.prefab)],
					position: [...t.position],
					visible: !0
				}), C({
					...r,
					prefab: t.prefab,
					part: p[p.length - 1].id
				});
				return;
			case "animation":
				C({
					...r,
					event: t.event
				});
				return;
			case "sound":
				C({
					...r,
					name: t.name
				});
				return;
			case "win":
			case "lose":
				d = t.type === "win" ? "won" : "lost", C(r);
				return;
			default: C(r), S();
		}
	}
	function L(e, t, n) {
		C({
			step: l,
			rule: t,
			trigger: e.when.type,
			...n
		});
		for (let n of e.actions) {
			let e = d;
			if (I(n, t), n.type === "restart" || d !== e) return !1;
		}
		return !0;
	}
	function R(e) {
		if (!Number.isFinite(e) || e <= 0) throw RangeError(`fixedUpdate step must be a number above 0 seconds, got ${String(e)}.`);
		if (d !== "playing") return;
		l += 1;
		let t = u;
		u += e, T();
		for (let [e, n] of r.rules.entries()) {
			if (n.once && _.has(e)) continue;
			let r = F(n, e, t);
			if (r !== null && (n.condition === null || A(n.condition, f) !== 0) && (_.add(e), !L(n, e, r))) break;
		}
		y = [];
	}
	function z() {
		C({
			step: l,
			rule: null,
			action: "restart"
		}), S();
	}
	return {
		name: n.name ?? "game-rules",
		fixedUpdate: R,
		restart: z,
		setPartPosition(e, t) {
			w(e, "setPartPosition").position = h(t, `setPartPosition("${e}") position`);
		},
		reportContact(e, t) {
			y.push([w(e, "reportContact"), w(t, "reportContact")]);
		},
		get state() {
			return {
				status: d,
				won: d === "won",
				lost: d === "lost",
				step: l,
				elapsedSeconds: u,
				variables: { ...f },
				parts: p.map((e) => ({
					id: e.id,
					tags: [...e.tags],
					position: e.position && [...e.position],
					visible: e.visible
				}))
			};
		},
		get eventLog() {
			return s.map((e) => ({ ...e }));
		},
		get droppedEvents() {
			return c;
		}
	};
}
export { e as GAME_RULES_LIMITS, n as GAME_RULE_ACTIONS, r as GAME_RULE_OPERATORS, t as GAME_RULE_TRIGGERS, N as createGameRules, k as validateGameRules };
