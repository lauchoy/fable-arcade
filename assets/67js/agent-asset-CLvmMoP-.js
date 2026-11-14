/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { h as e, n as t, o as n, r, u as i } from "./mat4-BCZClxna.js";
import { r as a, t as o } from "./mat3-BUCH0Dej.js";
import { c as s, i as c, o as l, r as u } from "./agent-scene-CsHMbgI1.js";
import { o as d } from "./camera-DqWdI22s.js";
import { a as f, o as ee } from "./skinning-DjFQA5hH.js";
import { i as te, n as p } from "./morph-CbizhGSZ.js";
import { a as ne, c as re, i as m, l as h, n as ie, o as g, s as _, t as v, u as ae } from "./agent-motion-TDwEQljr.js";
import { a as y, n as b, t as x } from "./skeleton-pose-DQgRHqAu.js";
import { g as S, k as C } from "./agent-scene-capabilities-BaawWMO1.js";
import { n as w, t as T } from "./field-error-BpFTmyMO.js";
import { r as E } from "./mesh-operations-ByLVkOhP.js";
// src/agent-asset-mesh.js
var D = 25e4;
function O(e) {
	return e.map((e) => e.id).join(", ");
}
function oe(e, t) {
	if (e === void 0) return [];
	if (!Array.isArray(e) || e.length > E.maxEditedParts) throw T("meshEdits", Array.isArray(e) ? e.length : e, `an array of at most ${E.maxEditedParts} parts, such as [{ "id": "mesh-0", "edits": [] }]`);
	let n = /* @__PURE__ */ new Set(), r = [];
	for (let [i, a] of e.entries()) {
		let e = Object.keys(a ?? {}).find((e) => e !== "id" && e !== "edits");
		if (!a || typeof a != "object" || e || !Array.isArray(a.edits)) throw T(`meshEdits[${i}]${e ? `.${e}` : ""}`, e ? a[e] : a, "an object with only id and edits, such as { \"id\": \"mesh-0\", \"edits\": [] }", TypeError);
		if (!t.some((e) => e.id === a.id) || n.has(a.id)) throw T(`meshEdits[${i}].id`, a.id, `an imported mesh ID used once, such as ${O(t.slice(0, 3))}; scene_inspect lists them`);
		n.add(a.id), w(`meshEdits[${i}]`, () => S("mesh").normalizeMeshEdits(a.edits)), a.edits.length && r.push({
			id: a.id,
			edits: structuredClone(a.edits)
		});
	}
	return r;
}
function se(e, t, n) {
	if (!n.some((e) => e.id === t.geometry)) throw T("geometry", t.geometry, `an imported mesh ID such as ${O(n.slice(0, 3))}; scene_inspect lists them`);
	if (t.replace !== void 0 && typeof t.replace != "boolean") throw T("replace", t.replace, "true or false", TypeError);
	if (!Array.isArray(t.edits)) throw T("edits", t.edits, "an array of edits, such as [{ \"op\": \"subdivide\", \"levels\": 1 }]", TypeError);
	let r = e.find((e) => e.id === t.geometry), i = t.replace || !r ? t.edits : [...r.edits, ...t.edits];
	return [...e.filter((e) => e.id !== t.geometry), {
		id: t.geometry,
		edits: i
	}];
}
function k(e, t) {
	let n = e.source.skin ? "skin weights" : "morph targets";
	return `${e.id} cannot keep its ${n} after this edit: ${t.message} Undo with scene_restore or replace the edit log, and cut within the existing surface.`;
}
function A(e, t, n, r) {
	let i = e.source.geometry, a = S("mesh").editImportedGeometry(i, n, {
		maxVertices: D,
		smoothAngle: 30,
		materialTag: e.material.id,
		resolveCutter: (e) => c(e, D)
	}), o;
	try {
		f(a.geometry, e.source.skin), o = p(a.geometry, e.source.morph);
	} catch (t) {
		throw RangeError(k(e, t));
	}
	return S("mesh").registerEditedMesh(a.geometry, a.mesh, a.results), {
		key: t,
		geometry: a.geometry,
		info: r(a.geometry),
		morphMetadata: o,
		results: a.results,
		transfer: a.transfer
	};
}
function ce(e, t, n, r) {
	let i = /* @__PURE__ */ new Map();
	for (let a of e) {
		let e = JSON.stringify(a.edits), o = t.find((e) => e.id === a.id), s = n.get(a.id);
		try {
			i.set(a.id, s?.key === e ? s : A(o, e, a.edits, r));
		} catch (e) {
			throw e.message.startsWith(a.id) ? e : RangeError(`${a.id}: ${e.message}`);
		}
	}
	return i;
}
function le(e) {
	return [...e].map(([e, t]) => `${e}:${t.key}`).sort().join("|");
}
// src/agent-asset.js
C("motion", v);
var ue = 16, j = 1048576, de = 8, fe = 256, pe = 2e6, M = [
	"translation",
	"rotation",
	"scale"
], N = [
	"color",
	"metallic",
	"roughness",
	"emission",
	"emissiveColor"
], me = [
	"environment",
	"effects",
	"shadow"
], he = Object.freeze({
	"set-environment": "environment",
	"set-effects": "effects",
	"set-shadow": "shadow"
}), ge = Object.freeze({
	format: "67js.asset",
	schemaVersion: 1,
	fixedTopology: !1,
	operations: Object.freeze([
		"set-camera",
		"set-environment",
		"set-effects",
		"set-shadow",
		"set-root",
		"set-animation",
		"set-material",
		"set-asset-node",
		"set-motion",
		"set-physics",
		"edit-mesh"
	]),
	motionDrive: "drive {path | legs [{path, direction forward|reverse, pause}], cruiseSpeed | speed, wheels auto | [{id,node,side,axle,radius}], lights {headlights, tailLights [{material,signal brake|reverse,off,on}]}}: a car along a path; duration may be left out. scene_inspect motionDrive reports wheels, rejectedNames and light signals; docs/vehicle.md has every field",
	ragdoll: "physics {duration, floor?, ragdoll {}}: joints fall limp onto a floor at world height floor (default 0)",
	boundsKind: "authored-base-world"
});
function P(e, t, n) {
	if (!e || typeof e != "object" || Array.isArray(e) || Object.getPrototypeOf(e) !== Object.prototype && Object.getPrototypeOf(e) !== null) throw T(n, e, "a plain JSON object, such as {}", TypeError);
	for (let r of Object.keys(e)) if (!t.includes(r)) throw T(`${n}.${r}`, e[r], `no such field; use one of ${t.join(", ")}`, TypeError);
}
function F(e) {
	let t = 0, n = /* @__PURE__ */ new Set(), r = new TextEncoder();
	function i(e) {
		if (t += e, t > j) throw RangeError("Asset recipe JSON exceeds 1 MiB. Reduce the input.");
	}
	function a(e, t) {
		if (t > 64) throw RangeError("Asset recipe JSON nesting exceeds 64 levels.");
		if (e === null || typeof e == "boolean") return i(e === null ? 4 : String(e).length), e;
		if (typeof e == "number" && Number.isFinite(e) && Number.isFinite(Math.fround(e))) return i(String(e).length), e;
		if (typeof e == "string") {
			if (e.length > j) throw RangeError("Asset recipe JSON exceeds 1 MiB.");
			return i(r.encode(JSON.stringify(e)).length), e;
		}
		if (!e || typeof e != "object" || n.has(e)) throw TypeError("Asset recipe requires finite, acyclic JSON data.");
		let o = Array.isArray(e);
		if (o && (e.length > j || Object.getPrototypeOf(e) !== Array.prototype)) throw TypeError("Asset recipe arrays must be ordinary bounded JSON arrays.");
		if (!o && Object.getPrototypeOf(e) !== Object.prototype && Object.getPrototypeOf(e) !== null) throw TypeError("Asset recipe objects must be plain JSON objects.");
		n.add(e), i(2);
		let s = o ? [] : {};
		for (let n of Reflect.ownKeys(e)) {
			if (o && n === "length") continue;
			if (typeof n != "string" || n === "__proto__") throw TypeError("Invalid asset recipe JSON key.");
			let c = Object.getOwnPropertyDescriptor(e, n);
			if (!c.enumerable || !Object.hasOwn(c, "value")) throw TypeError("Asset recipe accessors and hidden fields are unsupported.");
			if (o && n !== String(s.length)) throw TypeError("Asset recipe arrays must be dense without extra fields.");
			i(o ? 1 : r.encode(JSON.stringify(n)).length + 2), s[n] = a(c.value, t + 1);
		}
		if (o && s.length !== e.length) throw TypeError("Asset recipe arrays cannot contain trailing holes.");
		return n.delete(e), s;
	}
	let o = a(e, 0);
	if (r.encode(JSON.stringify(o)).length > j) throw RangeError("Asset recipe JSON exceeds 1 MiB.");
	return o;
}
function I(e, t, n) {
	if (!Array.isArray(e) || e.length !== t || !e.every((e) => typeof e == "number" && Number.isFinite(Math.fround(e)))) throw T(n, e, `an array of ${t} finite numbers, such as [${Array(t).fill(1).join(", ")}]`, TypeError);
	return [...e];
}
function _e(e = {}, t = "root") {
	P(e, M, t);
	let n = {
		translation: I(e.translation === void 0 ? [
			0,
			0,
			0
		] : e.translation, 3, `${t}.translation`),
		rotation: I(e.rotation === void 0 ? [
			0,
			0,
			0,
			1
		] : e.rotation, 4, `${t}.rotation`),
		scale: I(e.scale === void 0 ? [
			1,
			1,
			1
		] : e.scale, 3, `${t}.scale`)
	}, r = Math.hypot(...n.rotation);
	if (r === 0 || n.scale.some((e) => Math.fround(e) <= 0)) throw r === 0 ? T(`${t}.rotation`, e.rotation, "a quaternion that is not all zero, such as [0, 0, 0, 1]") : T(`${t}.scale`, n.scale, "positive numbers, such as [1, 1, 1]");
	return n.rotation = n.rotation.map((e) => e / r), n;
}
function ve(e, t = []) {
	let n = {
		format: "67js.scene",
		schemaVersion: 1,
		geometries: [],
		materials: t,
		nodes: []
	};
	for (let t of ["camera", ...me]) Object.hasOwn(e, t) && (n[t] = e[t]);
	return u(n, { maxMaterials: Math.max(256, t.length) }).exportRecipe();
}
function ye(e) {
	let t = [
		0,
		0,
		0
	];
	for (let n = 0; n < e.positions.length; n += 3) for (let r = 0; r < 3; r++) t[r] = Math.max(t[r], Math.abs(e.positions[n + r]));
	return t;
}
function be(e) {
	let t = [
		Infinity,
		Infinity,
		Infinity
	], n = [
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let r = 0; r < e.positions.length; r += 3) for (let i = 0; i < 3; i++) t[i] = Math.min(t[i], e.positions[r + i]), n[i] = Math.max(n[i], e.positions[r + i]);
	return {
		min: t,
		max: n
	};
}
function xe(e, t) {
	let n = [
		Infinity,
		Infinity,
		Infinity
	], r = [
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let i = 0; i < e.length; i++) {
		let a = e[i].bounds, o = t[i];
		for (let e = 0; e < 8; e++) {
			let t = a.min.map((t, n) => e & 1 << n ? a.max[n] : t);
			for (let e = 0; e < 3; e++) {
				let i = o[e] * t[0] + o[e + 4] * t[1] + o[e + 8] * t[2] + o[e + 12];
				n[e] = Math.min(n[e], i), r[e] = Math.max(r[e], i);
			}
		}
	}
	return {
		min: n,
		max: r
	};
}
function Se(e, t, n) {
	for (let r = 0; r < 4; r++) {
		let i = 0;
		for (let a = 0; a < 4; a++) {
			let o = Math.abs(t[a * 4 + r]);
			if (n) {
				o = 0;
				for (let e = 0; e < 4; e++) {
					let i = 0;
					for (let t = a * 4 + e; t < n.jointMatrices.length; t += 16) i = Math.max(i, Math.abs(n.jointMatrices[t]));
					if (o += Math.abs(t[e * 4 + r]) * i * (1 + 2 ** -21), !Number.isFinite(Math.fround(o))) throw RangeError("Asset world/skin matrix products exceed Float32 range.");
				}
			}
			if (i += o * (a === 3 ? 1 : e[a]), !Number.isFinite(Math.fround(i))) throw RangeError("Asset world geometry bounds exceed Float32 range.");
		}
	}
}
function Ce(e, t) {
	let n = [
		Infinity,
		Infinity,
		Infinity
	], r = [
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let i = 0; i < e.length; i++) {
		let a = e[i].positions, o = t[i];
		for (let e = 0; e < a.length; e += 3) for (let t = 0; t < 3; t++) {
			let i = o[t] * a[e] + o[4 + t] * a[e + 1] + o[8 + t] * a[e + 2] + o[12 + t];
			n[t] = Math.min(n[t], i), r[t] = Math.max(r[t], i);
		}
	}
	return {
		min: n,
		max: r
	};
}
function we(e) {
	let t = e.min.map((t, n) => (t + e.max[n]) / 2), n = Math.hypot(...e.max.map((t, n) => (t - e.min[n]) / 2)), r = Math.max(.001, n * .001), i = Math.max(10, n * 10), a = Math.max(1, n), o = Math.hypot(4, 3, 5), s = [
		4,
		3,
		5
	].map((e) => e / o), c = {
		target: t,
		eye: t.map((e, t) => e + s[t] * a),
		up: [
			0,
			1,
			0
		],
		fov: 45,
		near: r,
		far: i
	}, l = d({
		minimum: e.min,
		maximum: e.max
	}, c, 1, 1.2);
	return c.eye = t.map((e, t) => e + s[t] * l), c;
}
function L(c, u, { sources: d } = {}) {
	if (!c || !Array.isArray(c.parts) || !Array.isArray(c.animations) || typeof c.stagePose != "function" || !Array.isArray(c.nodes)) throw TypeError("createAgentAssetScene requires a decoded parseGltf asset.");
	if (!c.parts.length) throw TypeError("This file has no meshes, so there is nothing to draw. A skeleton-only file works as a clip source: set motion.layers[].from on a character that has a mesh.");
	if (c.parts.length > 4096 || c.animations.length > 256 || new Set(c.parts.map((e) => e.material)).size > 4096) throw RangeError("Asset budgets allow 4096 parts, 4096 materials, and 256 animation clips.");
	let v = [...c.parts], C = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), O = v.map((e, t) => {
		if (!C.has(e.material)) {
			let t = `material-${C.size}`, n = {};
			for (let t of N) {
				let r = e.material[t];
				r !== void 0 && (n[t] = Array.isArray(r) ? [...r] : r);
			}
			C.set(e.material, {
				id: t,
				baseline: n
			});
		}
		if (!E.has(e.geometry)) {
			let t = p(e.geometry, e.morph);
			t && D.set(e.geometry, t), E.set(e.geometry, {
				id: `geometry-${E.size}`,
				maxima: ye(e.geometry),
				bounds: be(e.geometry)
			});
		}
		return f(e.geometry, e.skin), {
			id: `mesh-${t}`,
			label: String(e.name ?? `Mesh ${t}`).slice(0, 256),
			source: e,
			geometry: E.get(e.geometry),
			material: C.get(e.material),
			sourceMatrix: e.matrix,
			jointMatrices: e.skin?.jointMatrices,
			jointWorldMatrices: e.skin?.jointWorldMatrices,
			morphWeights: e.morph?.weights
		};
	}), k = new Map([...C.values()].map((e) => [e.id, e])), A = new Map(c.nodes.map((e) => [e.id, structuredClone(e)])), j = g(c.animations, [...A.values()]);
	function I(e) {
		for (let [t, n] of Object.entries(e ?? {})) /^[a-f0-9]{64}$/i.test(t) && j.external.set(t.toLowerCase(), _(n));
	}
	I(d);
	let L = /* @__PURE__ */ new Map(), Te = v.map((e) => e.morph ? Float32Array.from(e.morph.weights) : null);
	v.forEach((e, t) => {
		(e.morphTargetNames ?? []).forEach((e, n) => {
			L.has(e) || L.set(e, []), L.get(e).push({
				part: t,
				index: n
			});
		});
	});
	let Ee = F(u), R = Ee?.assetId;
	if (typeof R != "string" || !/^[a-f0-9]{64}$/i.test(R)) throw T("assetId", R, "64 hexadecimal characters, such as \"ab12...\" (the SHA256 that scene_create_asset returned)", TypeError);
	let z = R.toLowerCase(), De = !Object.hasOwn(Ee, "camera"), B, Oe = /* @__PURE__ */ new Map(), V = [], H = 0, ke = null, U = null, Ae = null, je = null, W = null, G = null, Me, K = /* @__PURE__ */ new Map(), q = [], Ne = new Map([...C].map(([e, t]) => {
		let n = {};
		for (let [t, r] of Object.entries(e)) N.includes(t) || (n[t] = Array.isArray(r) ? Object.freeze([...r]) : r);
		for (let e of N) Object.defineProperty(n, e, {
			enumerable: !0,
			get() {
				return Oe.get(t.id)[e];
			}
		});
		return [t.id, Object.freeze(n)];
	})), Pe = O.map((e) => new Float32Array(e.source.matrix)), J = /* @__PURE__ */ new Map(), Fe = le(J), Y = 0;
	function Ie(e) {
		let t = O.find((t) => t.id === e);
		if (!t) throw T("geometry", e, "an imported mesh ID such as \"mesh-0\", or a source node ID; call scene_inspect without ids to list the meshes, or with kind hierarchy for source nodes");
		return t;
	}
	function Le(e, t = /* @__PURE__ */ new Map()) {
		if (!A.get(e) || O.some((t) => t.id === e)) return [Ie(e)];
		let n = ze(e);
		for (let r of n) r.isSourceNodeReport || t.set(r.id, e);
		return n;
	}
	function Re(r) {
		let i = t(), a = [];
		for (let e = r; e; e = e.parent ? A.get(e.parent) : null) a.unshift(e);
		for (let r of a) e(i, i, n(t(), r.rotation, r.translation, r.scale));
		return {
			isSourceNodeReport: !0,
			id: r.id,
			label: r.label,
			name: r.name,
			parent: r.parent,
			joint: !!r.joint,
			translation: [...r.translation],
			rotation: [...r.rotation],
			scale: [...r.scale],
			restWorldPosition: [
				i[12],
				i[13],
				i[14]
			],
			meshIds: []
		};
	}
	function ze(e) {
		let t = [], n = [e];
		for (; n.length > 0;) {
			let e = n.pop();
			t.push(...A.get(e).meshIds ?? []), n.push(...[...A.values()].filter((t) => t.parent === e).map((e) => e.id));
		}
		return t.length === 0 ? [Re(A.get(e))] : O.filter((e) => t.includes(e.id));
	}
	function X(e, t = J) {
		return t.get(e.id)?.geometry ?? e.source.geometry;
	}
	function Be(e, t = J) {
		return t.get(e.id)?.info ?? e.geometry;
	}
	function Ve(e, t = J) {
		return t.get(e.id)?.morphMetadata ?? D.get(e.source.geometry);
	}
	function He(e) {
		return {
			maxima: ye(e),
			bounds: be(e)
		};
	}
	function Ue(e) {
		return Object.freeze(O.map((t, n) => {
			let r = {
				name: t.id,
				geometry: X(t, e),
				matrix: Pe[n],
				material: Ne.get(t.material.id)
			};
			return t.source.skin && (r.skin = t.source.skin), t.source.morph && (r.morph = t.source.morph), t.source.castShadow !== void 0 && (r.castShadow = t.source.castShadow), Object.freeze(r);
		}));
	}
	let Z = Ue(J), We = Object.freeze({
		...ge,
		animations: c.animations.length,
		skinning: Z.some((e) => !!e.skin),
		morphTargets: Z.some((e) => !!e.morph),
		textures: [...Ne.values()].some((e) => !!(e.map || e.normalMap || e.metallicRoughnessMap || e.occlusionMap || e.emissiveMap))
	});
	function Ge(e) {
		let t = F(e);
		if (P(t, [
			"format",
			"schemaVersion",
			"assetId",
			"camera",
			...me,
			"root",
			"animation",
			"materialOverrides",
			"nodeOverrides",
			"motion",
			"physics",
			"meshEdits"
		], "asset recipe"), t.format !== "67js.asset" || t.schemaVersion !== 1 || typeof t.assetId != "string" || t.assetId.toLowerCase() !== z) {
			let e = t.format === "67js.asset" ? t.schemaVersion === 1 ? "assetId" : "schemaVersion" : "format", n = e === "format" ? "\"67js.asset\"" : e === "schemaVersion" ? "1" : `the bound asset ID, such as "${z.slice(0, 8)}..."`;
			throw T(e, t[e], n);
		}
		let n = t.materialOverrides === void 0 ? [] : t.materialOverrides;
		if (!Array.isArray(n) || n.length > k.size) throw T("materialOverrides", Array.isArray(n) ? `${n.length} entries` : n, `an array of at most ${k.size} entries, one per decoded material, such as []`);
		let r = /* @__PURE__ */ new Set(), i = ve(t, n.map((e, t) => {
			P(e, ["id", ...N], `materialOverrides[${t}]`);
			let n = k.get(e.id);
			if (!n || r.has(e.id)) throw T(`materialOverrides[${t}].id`, e.id, `the ID of a decoded material, used once; one of ${[...k.keys()].slice(0, 5).join(", ")}`);
			return r.add(e.id), {
				id: e.id,
				...n.baseline,
				...e
			};
		})), a = i.materials.map((e) => {
			let t = { id: e.id };
			for (let n of N) e[n] !== void 0 && (t[n] = e[n]);
			return t;
		}), o = t.animation === void 0 ? null : t.animation;
		if (o !== null) {
			P(o, ["clip", "time"], "animation");
			let e = c.animations.length, t = c.animations[o.clip];
			if (!Number.isInteger(o.clip) || !t || !Number.isFinite(o.time) || o.time < 0 || o.time > t.duration) throw !Number.isInteger(o.clip) || !t ? T("animation.clip", o.clip, e === 0 ? "no animation, since this asset has no clips; drop it, such as null" : `a clip index from 0 to ${e - 1}, such as 0`) : T("animation.time", o.time, `seconds from 0 to ${t.duration}, such as 0`);
		}
		let s = t.nodeOverrides === void 0 ? [] : t.nodeOverrides;
		if (!Array.isArray(s) || s.length > A.size) throw T("nodeOverrides", Array.isArray(s) ? `${s.length} entries` : s, `an array of at most ${A.size} entries, one per source node, such as []`);
		let l = /* @__PURE__ */ new Set(), u = s.map((e, t) => {
			P(e, ["id", ...M], `nodeOverrides[${t}]`);
			let n = A.get(e.id);
			if (!n || l.has(e.id) || !n.editable) throw T(`nodeOverrides[${t}].id`, e.id, "the ID of an editable source node, used once; call scene_inspect with kind hierarchy to list them");
			l.add(e.id);
			let r = Object.keys(e).filter((e) => e !== "id");
			if (!r.length) throw T(`nodeOverrides[${t}]`, e, "an id plus at least one of translation, rotation or scale, such as { \"id\": \"node-1\", \"translation\": [0, 1, 0] }");
			let i = _e(Object.fromEntries(r.map((t) => [t, e[t]])), `nodeOverrides[${t}]`);
			return {
				id: e.id,
				...Object.fromEntries(r.map((e) => [e, i[e]]))
			};
		}), d = F({
			format: "67js.asset",
			schemaVersion: 1,
			assetId: z,
			camera: i.camera,
			environment: i.environment,
			effects: i.effects,
			shadow: i.shadow,
			root: _e(t.root),
			animation: o,
			materialOverrides: a,
			nodeOverrides: u
		}), f = oe(t.meshEdits, O);
		if (f.length && (d.meshEdits = f), (t.motion?.ik?.length || t.motion?.footLock) && Math.max(...d.root.scale) - Math.min(...d.root.scale) > .001 * Math.max(...d.root.scale)) throw T("root.scale", d.root.scale, "the same number on every axis, such as [1, 1, 1], because motion ik and footLock need a uniform asset root scale");
		return d.motion = m(t.motion, Q(d)), t.physics !== void 0 && t.physics !== null && (d.physics = S("physics").normalizeAssetPhysics(t.physics)), F(d);
	}
	let Ke = /* @__PURE__ */ new Map();
	function qe(e) {
		let t = JSON.stringify(e);
		return Ke.has(t) || Ke.set(t, S("drive").createAssetDrive(c, e, { materialIds: new Set(k.keys()) })), Ke.get(t);
	}
	function Q(e) {
		let r = new Map([...k].map(([e, t]) => [e, {
			id: e,
			...t.baseline
		}]));
		for (let t of e.materialOverrides) r.set(t.id, {
			...r.get(t.id),
			...t
		});
		let i = e.root;
		return {
			nodes: [...A.values()].filter((e) => e.editable),
			materials: [...r.values()],
			camera: e.camera,
			buildDrive: qe,
			normalizeDrive: (e, t) => S("drive").normalizeDrive(e, t),
			ikHierarchy: [...A.values()],
			clipLayerContext: j,
			morphTargets: [...L.keys()],
			ikRootMatrix: Array.from(n(t(), i.rotation, i.translation, [
				i.scale[0],
				i.scale[0],
				i.scale[0]
			]))
		};
	}
	function Je(e, t) {
		let n = c.stagePose({
			animation: e,
			nodeOverrides: t
		});
		try {
			return n.nodePoses();
		} finally {
			n.discard();
		}
	}
	let Ye = /* @__PURE__ */ new Map();
	function Xe(e, t) {
		let n = JSON.stringify([
			e.from,
			e.scale,
			e.rootMotion,
			t
		]);
		if (!Ye.has(n)) {
			let r = j.external.get(e.from.asset), i = x(r.animations[e.from.clip], { loop: t });
			Ye.set(n, h(r.nodes, c.nodes, i, {
				scale: e.scale,
				rootMotion: e.rootMotion
			}));
		}
		return Ye.get(n);
	}
	function Ze(e) {
		let t = e.motion;
		return t?.footLock ? ne({
			settings: t.footLock,
			nodes: c.nodes,
			rootMatrix: Q(e).ikRootMatrix,
			layers: et(t.layers),
			duration: t.duration,
			loop: t.loop
		}) : null;
	}
	function Qe(e, t) {
		if (!t?.size) return e;
		let n = new Map(e.map(({ part: e, weights: t }) => [e, t]));
		for (let [e, r] of t) for (let { part: t, index: i } of L.get(e) ?? []) n.has(t) || n.set(t, Array.from(Te[t])), n.get(t)[i] = r.weight;
		return [...n].map(([e, t]) => ({
			part: e,
			weights: t
		}));
	}
	function $e(e) {
		if (!e.strip) return {
			loop: e.loop !== !1,
			timing: {}
		};
		let t = e.from ? j.external.get(e.from.asset).clips[e.from.clip].duration : c.animations[e.clip].duration, n = re(e.strip, t), r = e.weight ?? 1;
		return {
			loop: !1,
			timing: {
				weight: (e) => r * n.weight(e),
				clipTime: n.clipTime
			}
		};
	}
	function et(e) {
		return e.map((e) => {
			let { loop: t, timing: n } = $e(e), r = {
				weight: e.weight,
				speed: e.speed,
				offset: e.offset,
				additive: e.additive,
				reference: e.reference,
				mask: e.mask,
				...n
			};
			if (e.from) return {
				clip: Xe(e, t),
				...r
			};
			let i = c.animations[e.clip];
			return {
				clip: x(i, {
					loop: t,
					rename: e.bones
				}),
				...e.morph === !1 ? {} : { morphs: y(i, { loop: t }) },
				...r
			};
		});
	}
	function tt(e) {
		return e?.layers?.length ? b(c, et(e.layers)) : null;
	}
	function nt(e, t, n, r) {
		let i = t?.evaluate(r), a = new Map(e.map((e) => [e.id, e]));
		for (let e of i?.nodeOverrides ?? []) a.set(e.id, {
			...a.get(e.id),
			...e
		});
		return {
			nodeOverrides: rt([...a.values()], n),
			morphWeights: Qe(i?.morphWeights ?? [], n?.morphs)
		};
	}
	function rt(e, t) {
		let n = new Map(e.map((e) => [e.id, e]));
		for (let [e, r] of t?.nodes ?? []) {
			let t = Object.fromEntries(Object.entries(r).map(([e, t]) => [e, Array.from(t)]));
			n.set(e, {
				...n.get(e),
				id: e,
				...t
			});
		}
		return n;
	}
	function it(e) {
		if (!e.physics) return null;
		let r = JSON.stringify([
			e.physics,
			e.animation,
			e.nodeOverrides,
			e.root
		]);
		if (Ae?.key !== r) {
			let i = e.root, a = n(t(), i.rotation, i.translation, i.scale), o = Je(e.animation, e.nodeOverrides);
			Ae = {
				key: r,
				sampler: S("physics").bakeAssetRagdoll(e.physics, [...A.values()], o, a)
			};
		}
		return Ae.sampler;
	}
	function at(e, t) {
		return [...e.sample(Math.min(t, e.duration))].map(([e, t]) => ({
			id: e,
			translation: Array.from(t.translation),
			rotation: Array.from(t.rotation)
		}));
	}
	function $(i, s = !1, l = !0, u = void 0, d = void 0) {
		let f = u === void 0 ? Ge(i) : B;
		d !== void 0 && (f = {
			...f,
			animation: d
		});
		let p = u === void 0 ? ie(f.motion, Q(f)) : ke, ne = u === void 0 ? tt(f.motion) : je, re = u === void 0 ? Ze(f) : W, m = u === void 0 ? it(f) : U, h = u === void 0 ? f.motion || f.physics ? 0 : null : u;
		if (h !== null && !p && !m) throw RangeError("The asset has no authored motion or physics to sample.");
		let g = h === null ? null : p?.sample(h);
		if (c.parts.length !== O.length) throw RangeError("Decoded part membership must remain fixed.");
		let _ = ce(f.meshEdits ?? [], O, J, He);
		for (let e = 0; e < O.length; e++) {
			let t = O[e], n = t.source;
			if (c.parts[e] !== n || X(t) !== Z[e].geometry || n.skin !== Z[e].skin || n.morph !== Z[e].morph || n.matrix !== t.sourceMatrix || n.skin?.jointMatrices !== t.jointMatrices || n.skin?.jointWorldMatrices !== t.jointWorldMatrices || n.morph?.weights !== t.morphWeights || Z[e].matrix.length !== 16 || Z[e].matrix.byteLength !== 64) throw RangeError("Decoded resources and retained adapter matrices must not change identity or detach.");
		}
		let { nodeOverrides: v, morphWeights: ae } = nt(f.nodeOverrides, h === null ? null : ne, g, h);
		if (h !== null && re) {
			let e = Je(f.animation, [...v.values()]);
			for (let t of re.solve(h, e)) A.get(t.id)?.editable && v.set(t.id, {
				...v.get(t.id),
				...t
			});
		}
		if (h !== null && p?.ikUsesStagedPose) {
			let e = Je(f.animation, [...v.values()]);
			for (let t of p.solveStagedPose(h, e)) v.set(t.id, {
				...v.get(t.id),
				...t
			});
		}
		if (h !== null && m) for (let e of at(m, h)) v.set(e.id, {
			...v.get(e.id),
			...e
		});
		let y;
		try {
			y = c.stagePose({
				animation: f.animation,
				nodeOverrides: [...v.values()],
				morphWeights: ae
			});
			let i = n(t(), f.root.rotation, f.root.translation, f.root.scale), d = o(), b = O.map((n, o) => {
				let s = y.parts[o], c = e(t(), i, s.matrix), l = r(c);
				if (!c.every(Number.isFinite) || !Number.isFinite(l) || l === 0 || !a(d, c) || !d.every(Number.isFinite)) throw RangeError("Asset root/world matrices must remain finite and nonsingular at Float32 precision.");
				return s.skin && ee(s.skin, X(n, _), c), s.morph ? te(s.morph, Ve(n, _), c, s.skin) : Se(Be(n, _).maxima, c, s.skin), c;
			});
			s && (f.camera = we(xe(O.map((e) => Be(e, _)), b)), f = Ge(f), p = ie(f.motion, Q(f)), g = h === null ? null : p?.sample(h));
			let x = new Map([...k].map(([e, t]) => [e, { ...t.baseline }]));
			for (let e of f.materialOverrides) x.set(e.id, {
				...x.get(e.id),
				...e
			});
			for (let [e, t] of g?.materials ?? []) {
				let n = Object.fromEntries(Object.entries(t).map(([e, t]) => [e, typeof t == "number" ? t : Array.from(t)]));
				x.set(e, {
					...x.get(e),
					...n
				});
			}
			for (let e of x.values()) {
				for (let t of ["color", "emissiveColor"]) e[t] && Object.freeze(e[t]);
				Object.freeze(e);
			}
			let S = g?.camera ? {
				...f.camera,
				...Object.fromEntries(Object.entries(g.camera).filter(([e]) => e !== "projection").map(([e, t]) => [e, ArrayBuffer.isView(t) ? Array.from(t) : t]))
			} : f.camera;
			ve({ camera: S });
			let C = y;
			y = null, C.commit();
			for (let e = 0; e < Z.length; e++) Float32Array.prototype.set.call(Z[e].matrix, b[e]);
			let w = le(_);
			w !== Fe && (J = _, Fe = w, Z = Ue(J), Y++);
			let T = B;
			if (u === void 0 && (B = f, ke = p, U = m, je = ne, W = re), Oe = x, Me = S, G = h, u === void 0 && (V = b), l) {
				if (u === void 0) for (q.push({
					revision: H,
					recipe: T
				}); q.length > 4;) q.shift();
				H++;
			}
			return H;
		} catch (e) {
			throw y?.discard(), e;
		}
	}
	function ot() {
		let e = l({
			assetId: z,
			warnings: c.warnings,
			skinnedParts: O.filter((e) => e.source.skin).length,
			jointCount: [...A.values()].filter((e) => e.joint).length,
			clipCount: c.animations.length
		});
		return e.length ? { diagnostics: e } : {};
	}
	function st() {
		let e = (B.motion?.layers ?? []).flatMap((e, t) => e.from ? [{
			layer: t,
			from: e.from,
			...ae(j.external.get(e.from.asset).nodes, [...A.values()], "retarget")
		}] : []);
		return {
			...e.length ? { retargets: e } : {},
			...W ? { footLock: W.report() } : {},
			...L.size ? { morphTargetNames: [...L.keys()].slice(0, 128) } : {}
		};
	}
	function ct() {
		if (!B.motion?.drive) return {};
		let e = qe(B.motion.drive);
		return { motionDrive: e.describe(G === null ? void 0 : e.sample(G).pose) };
	}
	function lt() {
		if (!B.motion?.ik?.length) return {};
		let e = ie(B.motion, Q(B));
		return { motionIk: e.sweepIk((t) => Je(B.animation, [...nt(B.nodeOverrides, je, e.sample(t), t).nodeOverrides.values()])) };
	}
	function ut(e) {
		if (P(e, ["expectedRevision"], "transaction options"), !Number.isSafeInteger(e.expectedRevision) || e.expectedRevision !== H) throw T("expectedRevision", e.expectedRevision, `the current revision, such as ${H}`);
	}
	return $(Ee, De, !1), Object.freeze({
		capabilities: We,
		get parts() {
			return Z;
		},
		get revision() {
			return H;
		},
		get topologyRevision() {
			return Y;
		},
		get camera() {
			return structuredClone(Me);
		},
		get motionTime() {
			return G;
		},
		get environment() {
			return structuredClone(B.environment);
		},
		get effects() {
			return structuredClone(B.effects);
		},
		get shadow() {
			return structuredClone(B.shadow);
		},
		exportRecipe() {
			return structuredClone(B);
		},
		provideMotionSources: I,
		sampleMotion(e) {
			if (e !== null && (!Number.isFinite(e) || e < 0 || e > 3600)) throw T("motionTime", e, "null, or seconds from 0 to 3600, such as 0.5");
			return $(B, !1, !1, e), G;
		},
		sampleFrame(e) {
			let t = F(e);
			P(t, ["animation", "motionTime"], "asset frame");
			let n = t.motionTime === void 0 ? G : t.motionTime;
			if (n !== null && (!Number.isFinite(n) || n < 0 || n > 3600)) throw T("motionTime", n, "null, or seconds from 0 to 3600, such as 0.5");
			return $(B, !1, !1, n, t.animation), G;
		},
		apply(e, t = {}) {
			if (ut(t), !Array.isArray(e) || !e.length || e.length > fe) throw T("operations", Array.isArray(e) ? `${e.length} commands` : e, `an array of 1 to ${fe} commands, such as [{ "type": "set-root", "translation": [0, 1, 0] }]`);
			let n = F(e), r = structuredClone(B);
			for (let [e, t] of n.entries()) {
				let n = `operations[${e}]`, i = Object.hasOwn(he, t.type) ? he[t.type] : null;
				if (i) {
					P(t, ["type", i], n);
					let e = t[i];
					P(e, Object.keys(r[i]), i);
					let a = i === "environment" ? "volumeFog" : i === "effects" ? "bloom" : null, o = {
						...r[i],
						...i === "environment" ? s(e) : e
					};
					a && Object.hasOwn(e, a) && (P(e[a], Object.keys(r[i][a]), a), o[a] = {
						...r[i][a],
						...e[a]
					}), r[i] = o;
				} else if (t.type === "set-camera") {
					P(t, ["type", ...Object.keys(r.camera)], n);
					for (let e of Object.keys(r.camera)) Object.hasOwn(t, e) && (r.camera[e] = t[e]);
				} else if (t.type === "set-root") {
					P(t, ["type", ...M], n);
					for (let e of M) Object.hasOwn(t, e) && (r.root[e] = t[e]);
				} else if (t.type === "set-motion") {
					if (P(t, ["type", "motion"], n), !Object.hasOwn(t, "motion")) throw T(`${n}.motion`, void 0, "a motion record, or null to clear it, such as null", TypeError);
					r.motion = t.motion;
				} else if (t.type === "set-physics") {
					if (P(t, ["type", "physics"], n), !Object.hasOwn(t, "physics")) throw T(`${n}.physics`, void 0, "a physics record, or null to clear it, such as null", TypeError);
					r.physics = t.physics;
				} else if (t.type === "set-asset-node") {
					if (P(t, [
						"type",
						"id",
						...M
					], n), !A.has(t.id)) throw T(`${n}.id`, t.id, "the ID of a source node; call scene_inspect with kind hierarchy to list them");
					let e = M.filter((e) => Object.hasOwn(t, e));
					if (!e.length) throw T(n, t, "an id plus at least one of translation, rotation or scale, such as { \"type\": \"set-asset-node\", \"id\": \"node-1\", \"translation\": [0, 1, 0] }", TypeError);
					let i = r.nodeOverrides.find((e) => e.id === t.id);
					i || (i = { id: t.id }, r.nodeOverrides.push(i));
					for (let n of e) i[n] = t[n];
				} else if (t.type === "set-animation") {
					if (P(t, [
						"type",
						"clip",
						"time"
					], n), t.clip === null) {
						if (Object.hasOwn(t, "time")) throw T(`${n}.time`, t.time, "no time when clip is null, which returns to the initial pose; drop time", TypeError);
						r.animation = null;
					} else {
						let e = t.clip === void 0 ? r.animation?.clip : t.clip, n = r.animation !== null && e === r.animation.clip;
						r.animation = {
							clip: e,
							time: t.time === void 0 ? n ? r.animation.time : 0 : t.time
						};
					}
				} else if (t.type === "set-material") {
					if (P(t, [
						"type",
						"id",
						...N
					], n), !k.has(t.id)) throw T(`${n}.id`, t.id, `the ID of a decoded material, one of ${[...k.keys()].slice(0, 5).join(", ")}`);
					let e = r.materialOverrides.find((e) => e.id === t.id);
					e || (e = { id: t.id }, r.materialOverrides.push(e));
					for (let n of N) Object.hasOwn(t, n) && (e[n] = t[n]);
				} else if (t.type === "edit-mesh") P(t, [
					"type",
					"geometry",
					"edits",
					"replace"
				], n), r.meshEdits = w(n, () => se(r.meshEdits ?? [], t, O));
				else throw T(`${n}.type`, t.type, "one of set-camera, set-root, set-motion, set-physics, set-asset-node, set-animation, set-material or edit-mesh, such as \"set-root\"; imported parts take edit-mesh with a mesh ID such as mesh-0", TypeError);
			}
			return $(r);
		},
		inspect(e = {}) {
			let t = F(e);
			P(t, [
				"ids",
				"limit",
				"includeBounds",
				"kind",
				"offset"
			], "inspection");
			let n = t.limit === void 0 ? 64 : t.limit;
			if (!Number.isInteger(n) || n < 1 || n > 256 || t.includeBounds !== void 0 && typeof t.includeBounds != "boolean") throw t.includeBounds !== void 0 && typeof t.includeBounds != "boolean" ? T("includeBounds", t.includeBounds, "true or false") : T("limit", n, "a whole number from 1 to 256, such as 64");
			let r = t.offset === void 0 ? 0 : t.offset;
			if (!Number.isInteger(r) || r < 0 || r > 4096 || t.kind !== void 0 && !["meshes", "hierarchy"].includes(t.kind)) throw t.kind !== void 0 && !["meshes", "hierarchy"].includes(t.kind) ? T("kind", t.kind, "one of meshes, hierarchy") : T("offset", r, "a whole number from 0 to 4096, such as 0");
			if (t.kind === "hierarchy") {
				if (t.ids !== void 0 && (!Array.isArray(t.ids) || t.ids.length > A.size)) throw T("ids", Array.isArray(t.ids) ? `${t.ids.length} IDs` : t.ids, `an array of at most ${A.size} source-node IDs, such as []`);
				let e = t.ids === void 0 ? [...A.values()] : t.ids.map((e) => {
					if (!A.has(e)) throw T("ids", e, "the ID of a source node; call scene_inspect with kind hierarchy to list them");
					return A.get(e);
				}), i = structuredClone(e.slice(r, r + n));
				return {
					revision: H,
					topologyRevision: Y,
					assetId: z,
					kind: "hierarchy",
					...lt(),
					...ct(),
					...st(),
					...ot(),
					counts: {
						nodes: A.size,
						joints: [...A.values()].filter((e) => e.joint).length
					},
					nodes: i,
					offset: r,
					truncated: r + i.length < e.length,
					...t.includeBounds ? { note: "Hierarchy lists no bounds; inspect without kind, with ids of nodes or meshes, to get them." } : {},
					motion: B.motion ? {
						duration: B.motion.duration,
						loop: B.motion.loop,
						tracks: B.motion.tracks.length,
						time: G
					} : null
				};
			}
			if (t.ids !== void 0 && (!Array.isArray(t.ids) || t.ids.length > Math.max(O.length, A.size))) throw T("ids", Array.isArray(t.ids) ? `${t.ids.length} IDs` : t.ids, `an array of at most ${Math.max(O.length, A.size)} mesh or node IDs, such as ["mesh-0"]`);
			let i = /* @__PURE__ */ new Map(), a = t.ids === void 0 ? O : t.ids.flatMap((e) => Le(e, i)), o = a.slice(r, r + n);
			if (t.includeBounds && o.filter((e) => !e.isSourceNodeReport).reduce((e, t) => e + X(t).positions.length / 3, 0) > pe) throw T("ids", `${o.length} meshes`, "fewer meshes, under two million authored base vertices in all, such as [\"mesh-0\"]");
			let s = o.map((e) => {
				if (e.isSourceNodeReport) {
					let { isSourceNodeReport: t, ...n } = e;
					return n;
				}
				let n = Number(e.id.slice(5)), r = {
					id: e.id,
					label: e.label,
					geometry: e.geometry.id,
					material: e.material.id,
					vertices: X(e).positions.length / 3,
					triangles: X(e).indices.length / 3,
					skinned: !!e.source.skin,
					morphTargets: X(e).morphTargets?.length ?? 0,
					...J.has(e.id) ? { edited: !0 } : {},
					...i.has(e.id) ? { fromNode: i.get(e.id) } : {}
				};
				return t.includeBounds && (r.bounds = Ce([X(e)], [V[n]]), r.boundsKind = ge.boundsKind), r;
			}), l = 0, u = 0, d = new Set(O.map((e) => X(e)));
			for (let e of d) {
				u += e.positions.length / 3;
				for (let t of Object.values(e)) ArrayBuffer.isView(t) && (l += t.byteLength);
				for (let t of e.morphTargets ?? []) l += (t.positions?.byteLength ?? 0) + (t.normals?.byteLength ?? 0);
			}
			return {
				revision: H,
				topologyRevision: Y,
				assetId: z,
				...ot(),
				counts: {
					nodes: Z.length,
					parts: Z.length,
					geometries: d.size,
					materials: C.size,
					vertices: u
				},
				geometryBytes: l,
				animation: structuredClone(B.animation),
				motion: B.motion ? {
					duration: B.motion.duration,
					loop: B.motion.loop,
					tracks: B.motion.tracks.length,
					layers: B.motion.layers?.length ?? 0,
					time: G
				} : null,
				physics: U ? U.report() : null,
				animations: c.animations.map((e, t) => ({
					id: t,
					label: String(e.name ?? `Clip ${t}`).slice(0, 256),
					duration: e.duration
				})),
				nodes: s,
				offset: r,
				truncated: a.length > r + s.length
			};
		},
		inspectMeshes(e = {}) {
			P(e, ["geometries"], "mesh inspection");
			let t = e.geometries ?? O.slice(0, ue).map((e) => e.id);
			if (!Array.isArray(t) || t.length > ue) throw T("geometries", Array.isArray(t) ? `${t.length} IDs` : t, `an array of at most ${ue} mesh IDs, such as ["mesh-0"]`);
			let n = t.map((e) => {
				let t = O.findIndex((t) => t.id === e);
				if (t < 0) throw T("geometries", e, "an imported mesh ID such as \"mesh-0\"; scene_inspect lists them");
				let n = O[t], r = J.get(e), a = V[t], o = i([
					0,
					0,
					0
				], a).map((e) => Number(e.toPrecision(4))), s = [
					0,
					4,
					8
				].map((e) => {
					let t = Math.hypot(a[e], a[e + 1], a[e + 2]) || 1;
					return [
						0,
						1,
						2
					].map((n) => Number((a[e + n] / t).toFixed(3)));
				});
				return {
					geometry: e,
					...S("mesh").importedMeshReport(X(n)),
					...r ? { transfer: r.transfer } : {},
					localToWorldScale: o,
					localAxesInWorld: s
				};
			});
			return {
				revision: H,
				meshes: n,
				truncated: !1
			};
		},
		queryParts() {
			return O.map((e) => ({
				id: e.id,
				geometry: X(e),
				matrix: V[Number(e.id.slice(5))],
				material: e.material.id
			}));
		},
		checkpoint() {
			if (K.size >= de) throw T("checkpoints", `${K.size} saved`, `at most ${de} saved checkpoints; release one first, such as with scene_release_checkpoint`);
			let e = Object.freeze({});
			return K.set(e, structuredClone(B)), e;
		},
		restore(e, t = {}) {
			if (ut(t), !K.has(e)) throw T("checkpointId", "unknown or released", "a checkpointId that scene_checkpoint returned and you have not released, such as the last one returned");
			return $(K.get(e));
		},
		restoreRevision(e, t = {}) {
			ut(t);
			let n = q.find((t) => t.revision === e);
			if (!n) {
				let t = q.map((e) => e.revision);
				throw T("revision", e, t.length > 0 ? `one of the kept revisions: ${t.join(", ")} (the last 4 are kept; older ones are dropped)` : "a revision this session kept, but none is kept yet because nothing has been edited; apply an edit first");
			}
			return $(n.recipe);
		},
		releaseCheckpoint(e) {
			if (!K.delete(e)) throw T("checkpointId", "unknown or released", "a checkpointId that scene_checkpoint returned and you have not released, such as the last one returned");
		}
	});
}
export { L as n, ge as t };
