/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { t as e } from "./field-error-BpFTmyMO.js";
// src/agent-recipe-checks.js
function t(t, n, r) {
	if (!t || Object.getPrototypeOf(t) !== Object.prototype) throw e(r, t, "a plain object, such as {}", TypeError);
	for (let i of Object.keys(t)) if (!n.includes(i)) throw e(`${r}.${i}`, t[i], `no such field; use one of ${n.join(", ")}`, TypeError);
}
function n(t, n, r, i) {
	if (typeof t != "number" || !Number.isFinite(t) || !Number.isFinite(Math.fround(t)) || t < r || t > i) throw e(n, t, `a number from ${r} to ${i}, such as ${Math.min(Math.max(1, r), i)}`);
	return t;
}
function r(t, r, i) {
	if (!Array.isArray(t) || t.length !== 3) throw e(r, t, "an array of 3 numbers, such as [0, 1, 0]", TypeError);
	return t.map((e, t) => n(e, `${r}[${t}]`, -i, i));
}
function i(t, n, r) {
	if (!Array.isArray(t) || t.length > n) throw e(r, Array.isArray(t) ? `${t.length} entries` : t, `an array of at most ${n} entries, such as []`, TypeError);
	return t;
}
function a(t, n, r, i, a, o, s = "cloth") {
	let c = typeof t == "string" ? n.get(t) : void 0;
	if (!c) throw e(o, t, "the ID of a node in the recipe, such as \"banner\"");
	if (c.geometry === void 0) throw e(o, t, "a node that draws a geometry; this one is a group");
	if (c.parent !== null) throw e(o, t, "a root node with no parent; reparent it first");
	if (r.has(t)) throw e(o, t, `a node that ${s} uses once; this one is used twice`);
	if (i.has(t) || a.has(t)) throw e(o, t, "a node that stays where it is, with no translation or rotation track and no physics body");
	r.add(t);
}
var o = {
	cloth: (e) => [...e.sheets, ...e.colliders ?? []].map((e) => e.node),
	particles: (e) => e.systems.map((e) => e.node)
};
function s(e, t = []) {
	let n = /* @__PURE__ */ new Set();
	for (let r of t) e[r] && o[r](e[r]).forEach((e) => n.add(e));
	return {
		recipeNodes: new Map(e.nodes.map((e) => [e.id, e])),
		claimedNodes: n,
		motionNodeIds: new Set((e.motion?.tracks ?? []).filter((e) => e.kind === "node" && (e.property === "translation" || e.property === "rotation")).map((e) => e.id)),
		physicsNodeIds: new Set((e.physics?.bodies ?? []).map((e) => e.node))
	};
}
export { a, t as i, i as n, r as o, n as r, s as t };
