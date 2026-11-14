/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { a as e, i as t, n, o as r } from "../kernel-offload-A_sD9y-z.js";
import { a as i, n as a, r as o, s, u as c } from "../agent-scene-CsHMbgI1.js";
import { t as l } from "../renderer-ecLXY8uQ.js";
import { a as u, i as d, o as f } from "../closed-room-CB0A9B5C.js";
import { buildWorld as p, createDirectIrradiance as m, emittedRadiance as h, hitNormal as g, normalizeLights as ee, sceneScale as te, validatePart as ne, withReach as re } from "../light-bake.js";
import { r as _ } from "../probe-trace-D5Is1f3E.js";
import { t as ie } from "../ray-query-CWJhfYYD.js";
import { effectsWithFStop as v, installCameraEffects as y } from "../camera-effects.js";
import { installRenderPasses as ae } from "../render-passes.js";
import { installMeshBlend as oe, normalizeBlend as se } from "../mesh-blend.js";
import { c as b } from "../coplanar-overlap-CfXTlSIo.js";
import { n as x } from "../camera-DqWdI22s.js";
import { d as S, h as ce, l as le, m as ue, n as C, o as de, u as fe } from "../mat4-BCZClxna.js";
import { A as pe, C as me, D as he, E as ge, S as _e, T as ve, _ as w, g as T, j as ye, n as be, w as xe, x as E, y as Se } from "../agent-scene-capabilities-BaawWMO1.js";
import { i as Ce, n as we, r as Te, t as Ee } from "../agent-ground-COys_PDT.js";
import { groundBounceEnvironment as De } from "../ground-bounce.js";
import { n as Oe } from "../agent-asset-CLvmMoP-.js";
import { i as ke } from "../gltf-ChcvILu4.js";
import { a as Ae, n as je, s as D } from "../agent-scene-assets-CkuUJjd0.js";
import { n as Me, t as Ne } from "../export-Cb1LGQRe.js";
import "../texture-update.js";
import { updatePartVertices as Pe } from "../update-part-vertices.js";
import { c as Fe, l as Ie } from "../look-catalog-BW-KqP3u.js";
import { parseRadianceHdr as Le } from "../hdri.js";
import { parseCube as Re } from "../view-transform.js";
import { t as ze } from "../skeleton-pose-DQgRHqAu.js";
import { t as Be } from "../field-error-BpFTmyMO.js";
import { createSceneQuery as Ve, walkableMask as He } from "../scene-query.js";
// scripts/native-bake-page.js
function Ue(e) {
	if (typeof e.toBase64 == "function") return e.toBase64();
	let t = 32768, n = "";
	for (let r = 0; r < e.length; r += t) n += String.fromCharCode(...e.subarray(r, r + t));
	return btoa(n);
}
function We(e) {
	if (typeof Uint8Array.fromBase64 == "function") return Uint8Array.fromBase64(e);
	let t = atob(e), n = new Uint8Array(t.length);
	for (let e = 0; e < t.length; e++) n[e] = t.charCodeAt(e);
	return n;
}
function Ge(e) {
	let t = {};
	for (let [n, r] of Object.entries(e)) ArrayBuffer.isView(r) && (t[n] = Ue(new Uint8Array(r.buffer, r.byteOffset, r.byteLength)));
	return t;
}
function Ke(e) {
	let t = We(e);
	return new Float32Array(t.buffer, t.byteOffset, t.byteLength / Float32Array.BYTES_PER_ELEMENT);
}
function qe(e) {
	return Ue(new Uint8Array(e.buffer, e.byteOffset, e.byteLength));
}
async function Je(e, t, n) {
	let [r, { buildNativeTexelInput: i }] = await Promise.all([import("../path-tracer-gpu-pack-DYL2MEaQ.js").then((e) => e.l), import("../pack-input-CCebEGOF.js")]), a = i(e, {
		texelCount: t.count,
		samples: n.samples,
		bounces: n.bounces,
		seed: n.seed,
		fireflyClamp: n.fireflyClamp
	}, r), o = await globalThis.__67jsNativeBake({
		action: "trace",
		tables: Ge(a),
		triangleCount: a.triangleCount,
		samples: n.samples,
		texelCount: t.count,
		points: qe(t.points.subarray(0, t.count * 3)),
		normals: qe(t.normals.subarray(0, t.count * 3))
	});
	if (o.error) throw Error(o.error);
	return {
		radiance: Ke(o.radiance),
		escaped: Ke(o.escaped),
		gpu: o.adapter,
		compileSeconds: o.compileSeconds
	};
}
async function Ye() {
	if (typeof globalThis.__67jsNativeBake == "function") return (await globalThis.__67jsNativeBake({ action: "probe" })).available ? Je : void 0;
}
var Xe = [
	0,
	0,
	0
], Ze = Math.PI * (3 - Math.sqrt(5));
function Qe(e, t, n, r, i) {
	let a = e.filter((e) => !["blend", "add"].includes(e.material?.alphaMode)), o, s;
	try {
		a.forEach(ne), o = p(a), s = ee(i);
	} catch {
		return null;
	}
	let c = te(o.positions), l = c * 1e-4, u = ie(o), f = m(u, re(s, a), l, c), v = a.map((e) => _(e.material)), y = a.map((e) => e.material.emissiveMap ? Xe : h(e.material)), ae = Array.from({ length: 64 }, (e, t) => d(t, 64, [
		0,
		0,
		0
	])), oe = new Float32Array(t[0] * t[1] * t[2] * 3), se = [
		0,
		0,
		0
	], b = [
		0,
		0,
		0
	], x = [
		0,
		0,
		0
	], S = 0;
	for (let e = 0; e < t[2]; e++) for (let i = 0; i < t[1]; i++) for (let a = 0; a < t[0]; a++) {
		let s = [
			a,
			i,
			e
		].map((e, i) => n[i] + (e + .5) / t[i] * (r[i] - n[i])), c = S * Ze, l = Math.cos(c), d = Math.sin(c);
		for (let e of ae) {
			b[0] = l * e[0] + d * e[2], b[1] = e[1], b[2] = -d * e[0] + l * e[2];
			let t = u.trace(s[0], s[1], s[2], b[0], b[1], b[2], Infinity, !1);
			if (t.nearestTriangle < 0) continue;
			for (let e = 0; e < 3; e++) se[e] = s[e] + b[e] * t.nearestDistance;
			g(o, t.nearestTriangle, b, x);
			let n = o.triangleOwner[t.nearestTriangle], r = f(se, x, n);
			for (let e = 0; e < 3; e++) oe[S * 3 + e] += (y[n][e] + v[n][e] * r[e] / Math.PI) / 64;
		}
		S++;
	}
	return oe;
}
// src/fog-sky-visibility.js
var $e = 5, et = /* @__PURE__ */ new WeakMap();
function tt(e, t) {
	let n = e.data.length, r = new Float32Array(n * 4);
	for (let i = 0; i < n; i++) r[i * 4] = e.data[i] / 255, t && r.set(t.subarray(i * 3, i * 3 + 3), i * 4 + 1);
	return r;
}
function nt(e, t, n, r) {
	let i = new Float32Array(t[0] * t[1] * t[2] * 3), a = [
		0,
		0,
		0
	], o = 0;
	for (let s = 0; s < t[2]; s++) for (let c = 0; c < t[1]; c++) for (let l = 0; l < t[0]; l++) [
		l,
		c,
		s
	].forEach((e, i) => {
		a[i] = n[i] + (e + .5) / t[i] * (r[i] - n[i]);
	}), i.set(e.meanRadiance(a), o * 3), o++;
	return i;
}
function rt(e, t, n) {
	let r = e.createTexture();
	e.bindTexture(e.TEXTURE_3D, r), e.texImage3D(e.TEXTURE_3D, 0, e.RGBA16F, t.size[0], t.size[1], t.size[2], 0, e.RGBA, e.FLOAT, tt(t, n)), e.texParameteri(e.TEXTURE_3D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_3D, e.TEXTURE_MAG_FILTER, e.LINEAR);
	for (let t of [
		e.TEXTURE_WRAP_S,
		e.TEXTURE_WRAP_T,
		e.TEXTURE_WRAP_R
	]) e.texParameteri(e.TEXTURE_3D, t, e.CLAMP_TO_EDGE);
	return r;
}
function it(e, t, n, r = {}) {
	if (!(t.density > 0) || t.shadowAmbient !== void 0) return null;
	let i = `${t.minimum}|${t.maximum}`, a = et.get(e);
	if (a?.context !== n || a.key !== i) {
		let o = f(e, t.minimum, t.maximum), s = e.find((e) => e.material?.irradianceGrid)?.material.irradianceGrid, c = o ? s ? nt(s, o.size, t.minimum, t.maximum) : Qe(e, o.size, t.minimum, t.maximum, { pointLights: r.pointLights }) : null;
		a = {
			context: n,
			key: i,
			texture: o && rt(n, o, c)
		}, et.set(e, a);
	}
	return a.texture && (n.activeTexture(n.TEXTURE0 + $e), n.bindTexture(n.TEXTURE_3D, a.texture)), a.texture;
}
// scripts/agent-preview-textures.js
var at = [
	"map",
	"normalMap",
	"metallicRoughnessMap",
	"occlusionMap",
	"emissiveMap"
];
function ot(e) {
	return e.some((e) => e.material.boxMapScale || at.some((t) => e.material[t]));
}
// src/agent-errors.js
function st(e, t, { openSessionIds: n = [], evictedSessionIds: r = [] } = {}) {
	return r.includes(e) ? `sessionId ${e} was evicted: the server keeps a limited number of open scenes and closes the least recently used one when a new scene is created.${n.length ? ` Open scenes: ${n.join(", ")}.` : ""} Pass the sessionId of an open scene, or call scene_create again (scene_export_recipe saves a scene before it is evicted).` : t ? n.length > 1 ? `Unknown scene session ${e}. Open scenes: ${n.join(", ")}; the last used is ${t}. Pass one of them as sessionId, leave sessionId out for the last used scene, or call scene_create for a new scene.` : `Unknown scene session ${e}. The active session is ${t}; leave sessionId out or pass that one, or call scene_dispose and then scene_create for a new scene.` : "No scene is active: it was never created, was disposed, or scene_create failed. Call scene_create or scene_create_asset first, then pass the sessionId it returns.";
}
var ct = Object.freeze({
	maxOpenScenes: 4,
	maxOpenSceneBytes: 100663296
}), lt = .05, ut = 5 / 255, dt = 250 / 255, ft = .98, pt = .35;
function O(e, t, n, r) {
	return {
		kind: e,
		severity: "warning",
		target: t,
		message: n,
		fix: r
	};
}
function k(e, t) {
	return [
		e[0] - t[0],
		e[1] - t[1],
		e[2] - t[2]
	];
}
function A(e, t) {
	return e[0] * t[0] + e[1] * t[1] + e[2] * t[2];
}
function mt(e, t) {
	return [
		e[1] * t[2] - e[2] * t[1],
		e[2] * t[0] - e[0] * t[2],
		e[0] * t[1] - e[1] * t[0]
	];
}
function ht(e) {
	let t = Math.hypot(...e) || 1;
	return e.map((e) => e / t);
}
function j(e) {
	return Math.round(e * 100) / 100;
}
function gt(e, t) {
	return e.projection === "orthographic" || e.shift ? null : Number.isFinite(e.fov) ? Math.tan(e.fov * Math.PI / 360) : Number.isFinite(e.focalLength) ? (e.sensorWidth ?? 36) / t / 2 / e.focalLength : null;
}
function M(e) {
	let t = [
		0,
		1,
		2
	].map((t) => (e.min[t] + e.max[t]) / 2);
	return {
		center: t,
		radius: Math.hypot(...k(e.max, t))
	};
}
function _t(e) {
	let t = [
		Infinity,
		Infinity,
		Infinity
	], n = [
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let r of e) for (let e = 0; e < 3; e++) t[e] = Math.min(t[e], r.min[e]), n[e] = Math.max(n[e], r.max[e]);
	return {
		min: t,
		max: n
	};
}
function vt(e, t, n) {
	let { center: r, radius: i } = M(_t(t)), a = ht(k(e.eye, e.target)), o = Math.max(i / n * 1.15, e.near * 2), s = r.map((e, t) => e + a[t] * o);
	return `Set camera.target to [${r.map(j)}] and camera.eye to [${s.map(j)}]`;
}
function yt({ camera: e, aspect: t, boxes: n }) {
	let r = gt(e, t);
	if (!r) return [];
	if (n.length === 0) return [O("empty-frame", "nodes", "The scene has no visible parts, so the frame shows only the background.", "Add a mesh node with scene_apply add-node (and add-geometry, add-material), or set visible: true on a hidden node.")];
	let i = r * t, a = ht(k(e.target, e.eye)), o = ht(mt(a, e.up)), s = mt(o, a), c = Math.sqrt(1 + r * r), l = Math.sqrt(1 + i * i), u = n.filter((t) => {
		let { center: n, radius: u } = M(t), d = k(n, e.eye), f = A(d, a);
		if (f + u < e.near || f - u > e.far) return !1;
		let p = (Math.abs(A(d, o)) - i * f) / l, m = (Math.abs(A(d, s)) - r * f) / c;
		return p <= u && m <= u;
	});
	if (u.length * 2 < n.length) return [O("subject-out-of-frame", "camera", `${n.length - u.length} of ${n.length} parts are outside the camera frustum.`, `${vt(e, n, r)} to put every part in view.`)];
	let { center: d, radius: f } = M(_t(u)), p = A(k(d, e.eye), a);
	return p > 0 && f / (p * r) < lt ? [O("subject-too-small", "camera", `The visible parts fill under ${Math.round(lt * 100)} percent of the frame height.`, `${vt(e, u, r)} to fill the frame, or lower camera.fov.`)] : [];
}
function bt(e) {
	let t = 0, n = 0, r = e.length / 4;
	for (let r = 0; r < e.length; r += 4) {
		let i = (.2126 * e[r] + .7152 * e[r + 1] + .0722 * e[r + 2]) / 255;
		i <= ut ? t++ : i >= dt && n++;
	}
	return {
		black: t / r,
		white: n / r
	};
}
function xt({ shares: e, exposure: t }) {
	return e.black >= ft ? [O("exposure-black", "effects.exposure", `${Math.round(e.black * 100)} percent of the frame is black after tone mapping.`, `Raise effects.exposure from ${t} to ${j(Math.max(t, .25) * 4)}, raise environment.keyIntensity, or aim a light at the subject.`)] : e.white >= pt ? [O("exposure-clipped", "effects.exposure", `${Math.round(e.white * 100)} percent of the frame is clipped to white after tone mapping.`, `Lower effects.exposure from ${t} to ${j(t / 2)}, or lower environment.keyIntensity.`)] : [];
}
// src/agent-branches.js
var N = Object.freeze({
	maximumBranches: 8,
	maximumNameLength: 24,
	maximumLabels: 24
}), St = /^[a-z][a-z0-9_-]{0,23}$/;
function Ct(e) {
	if (typeof e != "string" || !St.test(e)) throw Be("branch", e, "a name that starts with a lowercase letter and has at most 24 lowercase letters, digits, underscores or hyphens, such as \"alt-1\"", TypeError);
	return e;
}
function wt(e, t = 32) {
	return String(e).replace(/[^\x20-\x7e]/g, "?").slice(0, t);
}
function Tt() {
	let e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map();
	function n() {
		return new Set([...t.values()].map((e) => e.recipeKey));
	}
	function r() {
		let t = n();
		for (let n of e.keys()) t.has(n) || e.delete(n);
	}
	return {
		fork(n, { recipe: i, baseRecipe: a, operations: o, baseRevision: s }) {
			if (Ct(n), !t.has(n) && t.size >= N.maximumBranches) throw Be("branch", n, `a name that is already a branch, since at most ${N.maximumBranches} branches can exist; reuse one to replace it, such as "${[...t.keys()][0]}"`);
			let c = JSON.stringify(i), l = [...t.entries()].some(([e, t]) => e !== n && t.recipeKey === c);
			return t.set(n, {
				recipeKey: c,
				baseKey: JSON.stringify(a),
				operations: structuredClone(o),
				baseRevision: s
			}), e.has(c) || e.set(c, i), r(), { shared: l };
		},
		get(n) {
			Ct(n);
			let r = t.get(n);
			if (!r) throw Be("branch", n, `one of the known branches: ${[...t.keys()].join(", ") || "none yet, so fork one first"}`);
			return {
				recipe: structuredClone(e.get(r.recipeKey)),
				baseKey: r.baseKey,
				operations: structuredClone(r.operations),
				baseRevision: r.baseRevision
			};
		},
		names() {
			return [...t.keys()];
		},
		snapshotCount() {
			return e.size;
		},
		clear() {
			t.clear(), e.clear();
		}
	};
}
// src/agent-asset-limits.js
var Et = Object.freeze({
	maxBytes: 67108864,
	maxAssets: 64,
	maxCombinedBytes: 67108864,
	maxVertices: 1e6,
	maxParts: 4096,
	maxTexturePixels: 4194304,
	maxJoints: 1024,
	maxClips: 256
});
function Dt() {
	let { maxBytes: e, maxVertices: t, maxParts: n, maxTexturePixels: r, maxJoints: i } = Et;
	return {
		maxBytes: e,
		maxVertices: t,
		maxParts: n,
		maxTexturePixels: r,
		maxJoints: i
	};
}
function Ot(e) {
	if (!(e instanceof RangeError) || !/Fix: pass \{[^}]*\}\./.test(e.message)) return e;
	let { maxBytes: t, maxVertices: n, maxParts: r, maxJoints: i, maxTexturePixels: a } = Et, o = `The MCP catalog limits are maxBytes ${t}, maxVertices ${n}, maxParts ${r}, maxJoints ${i} and maxTexturePixels ${a}, and an agent cannot raise them. Simplify the asset (fewer vertices, meshopt compression, smaller textures) or load it with loadGltf in code.`;
	return RangeError(e.message.replace(/Fix: pass \{[^}]*\}\./, o));
}
// scripts/agent-walkmap.js
var kt = 4096;
function At(e) {
	let t = 0;
	for (let n of e) for (let e = 0; e < 16; e++) t += n.matrix[e] * (e + 1);
	return t;
}
function jt(e) {
	return typeof e.queryParts == "function" ? e.queryParts() : e.parts.map((e) => ({
		id: e.name,
		geometry: e.geometry,
		matrix: e.matrix,
		material: e.material?.id
	}));
}
function Mt(e) {
	let t = jt(e.scene), n = `${e.scene.revision}:${t.length}:${At(t)}`;
	return e.sceneQueryKey !== n && (e.sceneQuery?.dispose(), e.sceneQuery = Ve(t), e.sceneQueryKey = n), e.sceneQuery;
}
function Nt(e, t, n) {
	return t === void 0 && n === void 0 ? e : {
		...e,
		obstacles: n === void 0 || { streetY: n }
	};
}
function Pt(e) {
	return Math.round(e * 100) / 100;
}
function Ft(e, { clearance: t, groundRange: n, keepOut: r, includeCells: i }) {
	let { columns: a, rows: o, cellSize: s, min: c } = e, l = He(e, {
		clearance: t,
		groundRange: n,
		keepOut: r
	}), u = Array.from({ length: o }, () => Array(a).fill("#")), d = [];
	for (let [t, n, r, i] of e.cells) {
		let e = Math.round((t - c[0]) / s), a = Math.round((n - c[1]) / s);
		u[a][e] = "x", d.push([
			t,
			n,
			Pt(r),
			Pt(i)
		]);
	}
	let f = 0;
	for (let e = 0; e < a; e++) for (let t = 0; t < o; t++) l[e * o + t] && (u[t][e] = ".", f++);
	if (i && d.length > kt) throw RangeError(`includeCells lists at most ${kt} cells and this region has ${d.length} with a surface. Shrink the region or raise cellSize.`);
	return {
		cellSize: s,
		min: c,
		columns: a,
		rows: o,
		surfaceCells: e.cells.length,
		walkableCells: f,
		legend: {
			".": "walkable",
			x: "ground with too little headroom, an obstacle, outside groundRange or within keepOut",
			"#": "no surface"
		},
		grid: u.map((e) => e.join("")),
		...i ? { cells: d } : {}
	};
}
var P = Object.freeze({
	maxVertices: 6e6,
	maxTriangles: 6e6,
	maxParts: 16384,
	memoryBudgetMiB: 256
});
function It(e) {
	let t = null;
	async function n(t) {
		let n = await e(t.buffer.slice(t.byteOffset, t.byteOffset + t.byteLength), {
			maxBytes: t.length + 1024,
			maxVertices: P.maxVertices,
			maxParts: P.maxParts
		}), r = 0;
		for (let e of n.parts) r += e.geometry.indices.length / 3;
		if (r > P.maxTriangles) throw RangeError(`Query-only asset has ${r} triangles, over the query maxTriangles ${P.maxTriangles}. Split it or decimate it.`);
		let i = n.parts.map((e, t) => ({
			id: e.name ?? `part-${t}`,
			geometry: e.geometry,
			matrix: e.matrix,
			material: e.material?.id
		}));
		return {
			query: Ve(i, { memoryBudgetMiB: P.memoryBudgetMiB }),
			parts: i.length,
			triangles: r
		};
	}
	return Object.freeze({
		async walkMap({ assetId: e, bytes: r, clearance: i = 2, groundRange: a, keepOut: o, streetY: s, includeCells: c = !1, ...l }) {
			let u = performance.now();
			if (t?.assetId !== e) {
				if (!r) return { needsData: !0 };
				t?.scene.query.dispose(), t = null, t = {
					assetId: e,
					scene: await n(r)
				};
			}
			let { query: d, parts: f, triangles: p } = t.scene;
			return {
				assetId: e,
				queryOnly: !0,
				parts: f,
				triangles: p,
				...Ft(d.walkMap(Nt(l, o, s)), {
					clearance: i,
					groundRange: a,
					keepOut: o,
					includeCells: c
				}),
				skippedParts: d.skipped.length,
				milliseconds: Math.round(performance.now() - u)
			};
		},
		dispose() {
			t?.scene.query.dispose(), t = null;
		}
	});
}
// scripts/agent-preview-browser.js
var F = /* @__PURE__ */ new Map(), I = null, Lt = 32, L = [], R = document.querySelector("canvas");
function Rt(e) {
	let t = [...F.keys()];
	return Error(st(e, t.at(-1), {
		openSessionIds: t,
		evictedSessionIds: L
	}));
}
function z(e) {
	let t = F.get(e);
	if (!t) throw Rt(e);
	return F.delete(e), F.set(e, t), t;
}
function B(e) {
	let t = !1;
	for (let n of F.values()) n !== e && n.renderer && (n.renderer.dispose(), n.renderer = null, t = !0);
	t && J();
}
function V(e) {
	let t = z(e);
	return t.renderer || I || (B(t), t.renderer = Y(t.scene, t.options), t.rendererTopology = t.scene.topologyRevision, t.rendererTextured = K(t.scene), t.shadowKey = null), t;
}
function zt(e, t) {
	if (e.checkpoints.has(t)) return;
	let n = [...e.checkpoints.keys()], r = e.evictedCheckpointIds.includes(t) ? `was evicted as the oldest when more than ${be.maxCheckpoints} were saved` : "is unknown or was released";
	throw Error(`checkpointId ${t} ${r}. Pass a checkpointId that scene_checkpoint returned for sessionId ${e.sessionId}${n.length ? `: ${n.join(", ")}` : "; this scene has none, so call scene_checkpoint first"}.`);
}
function Bt(e) {
	try {
		e.renderer?.dispose();
	} finally {
		e.asset?.dispose(), Sn(e.placedAssets);
	}
	e.checkpoints.clear(), e.branches.clear(), F.delete(e.sessionId);
}
function Vt(e) {
	return e.scene.inspect().residentGeometryBytes ?? 0;
}
function Ht(e) {
	let t = [], n = e, r = /* @__PURE__ */ new Map();
	for (let e of F.values()) {
		let t = Vt(e);
		r.set(e, t), n += t;
	}
	for (let e of [...F.values()]) {
		if (!(F.size + 1 > ct.maxOpenScenes) && n <= ct.maxOpenSceneBytes) break;
		n -= r.get(e), Bt(e), t.push(e.sessionId), L.push(e.sessionId);
	}
	return L.splice(0, Math.max(0, L.length - Lt)), t;
}
function H(e) {
	if (typeof Uint8Array.fromBase64 == "function") return Uint8Array.fromBase64(e);
	let t = atob(e), n = new Uint8Array(t.length);
	for (let e = 0; e < t.length; e++) n[e] = t.charCodeAt(e);
	return n;
}
async function Ut(e = {}) {
	let t = {};
	for (let [n, r] of Object.entries(e)) {
		let e = await xn(H(r).buffer);
		t[n] = {
			animations: e.animations,
			nodes: e.nodes
		}, e.dispose();
	}
	return t;
}
function U(e) {
	let t = ue(C(), e.eye, e.target, e.up);
	for (let n of [1 / 16, 16]) {
		let r = x(C(), e, n);
		if (![r, ce(C(), r, t)].every((e) => e.every(Number.isFinite))) throw RangeError("Camera matrices must remain finite for all supported preview aspect ratios.");
	}
}
function Wt(e, t) {
	let n = e.scene.exportRecipe().camera;
	for (let e of t) e.type === "set-camera" && a(n, e);
	return o({
		format: "67js.scene",
		schemaVersion: 1,
		geometries: [],
		materials: [],
		nodes: [],
		camera: n
	}).camera;
}
var W = 64, Gt;
function Kt() {
	Gt ??= Object.assign(document.createElement("canvas"), {
		width: W,
		height: W
	});
	let e = Gt.getContext("2d", { willReadFrequently: !0 });
	return e.drawImage(R, 0, 0, W, W), bt(e.getImageData(0, 0, W, W).data);
}
function qt(e, t, n) {
	let r = [], i = e.scene.worldBounds?.();
	return i && r.push(...yt({
		camera: t,
		aspect: R.width / R.height,
		boxes: i
	})), e.scene.bakeStaleness && r.push(...e.scene.bakeStaleness()), n !== void 0 && r.push(...xt({
		shares: Kt(),
		exposure: n
	})), r;
}
function G(e, t = []) {
	let n = [...e.diagnostics ?? [], ...t], r = e.context, i = r.getExtension("WEBGL_debug_renderer_info");
	return {
		graphics: r.getParameter(i ? i.UNMASKED_RENDERER_WEBGL : r.RENDERER),
		estimatedBytes: e.memoryPlan.estimatedBytes,
		width: R.width,
		height: R.height,
		samples: e.capabilities.samples,
		hdr: e.capabilities.hdr,
		depth: e.depth,
		geometryBuffers: e.geometryBuffers?.size ?? 0,
		materialTextures: e.textures ? [...e.textures.keys()].filter(Boolean).length : 0,
		skinTextures: e.skinTextures?.size ?? 0,
		morphTextures: e.morphTextures?.size ?? 0,
		gpuBuffers: e.buffers?.length ?? 0,
		drawBatches: e.batches?.length ?? 0,
		...n.length ? { diagnostics: n } : {}
	};
}
async function Jt(e, t) {
	let n = await createImageBitmap(new Blob([H(t)]), {
		premultiplyAlpha: "none",
		colorSpaceConversion: "none"
	});
	try {
		if (n.width > D.maxSide || n.height > D.maxSide) throw RangeError(`Sequence frame ${e.slice(0, 12)} is ${n.width}x${n.height}; frames are at most ${D.maxSide} pixels on a side.`);
		let t = new OffscreenCanvas(n.width, n.height).getContext("2d", { willReadFrequently: !0 });
		t.drawImage(n, 0, 0);
		let { data: r } = t.getImageData(0, 0, n.width, n.height);
		return {
			width: n.width,
			height: n.height,
			data: r
		};
	} finally {
		n.close();
	}
}
function Yt(e) {
	for (let [t, n] of Object.entries(e ?? {})) n.kind === "environment" ? Fe(t, Le(H(n.base64))) : Ie(t, Re(n.text));
}
async function Xt(e, t) {
	for (let [n, r] of Object.entries(t ?? {})) if (!e.has(n)) {
		try {
			e.set(n, await Jt(n, r));
		} catch (e) {
			throw e instanceof RangeError ? e : Error(`Sequence frame ${n.slice(0, 12)} is not a PNG, JPEG or WebP image the browser can decode.`);
		}
		if ([...e.values()].reduce((e, t) => e + t.data.length, 0) > D.maxDecodedBytes) throw e.delete(n), RangeError(`Sequence frames decode to more than ${D.maxDecodedBytes / 1048576} MiB. Use fewer or smaller frames.`);
	}
	return e;
}
var Zt = /* @__PURE__ */ new WeakMap();
function Qt(e) {
	let t = Zt.get(e.renderer) ?? /* @__PURE__ */ new Map();
	Zt.set(e.renderer, t);
	for (let { descriptor: n, index: r, image: i } of e.scene.sequenceTextures?.() ?? []) (t.get(n) ?? 0) !== r && e.renderer.textures.has(n) && (e.renderer.updateTexture(n, { image: i }), t.set(n, r));
}
function K(e) {
	return ot(e.parts) || (e.sequenceTextures?.().length ?? 0) > 0 || e.parts.some((e) => e.material.snippet);
}
function $t(e) {
	w("materialSnippet") && T("materialSnippet").probeMaterialSnippets(e.parts);
}
function en(e) {
	$t(e.scene), e.renderer.dispose(), e.renderer = null, J(), e.renderer = Y(e.scene, e.options), e.shadowKey = null;
}
function tn(e) {
	let t = we(e.scene.parts, e.scene.environment);
	!!t == !!e.renderer.groundPart ? t && (Ce(e.renderer.groundPart, t), e.renderer.updateParts([...e.scene.parts, e.renderer.groundPart])) : (en(e), e.renderer.resize());
}
function nn(e, t, n) {
	let r = De(e, {
		...t,
		map: s(t)
	}, { automaticAlbedo: n ? Ee : null });
	return w("floorSky") ? T("floorSky").withSunBounce(e, r) : r;
}
function rn(e) {
	fn(e.scene) !== (e.renderer.shadowCascades?.count ?? 0) && (en(e), e.renderer.resize());
}
function q(e, t = 0, n = e.scene.camera, r = {}) {
	if (!e.renderer) throw Error("The scene renderer is leased to a render job.");
	if (e.renderer.context.isContextLost()) throw Error("The render context was lost. Export the recipe and dispose this session.");
	if (e.renderer.resize(), e.rendererTopology !== e.scene.topologyRevision) {
		let t = K(e.scene);
		t || e.rendererTextured || e.asset ? en(e) : e.renderer.replaceParts(e.scene.parts), e.rendererTextured = t, e.rendererTopology = e.scene.topologyRevision, e.renderer.resize();
	} else e.renderer.updateParts(e.scene.parts);
	if (w("cloth")) {
		let { isLiveClothGeometry: t } = T("cloth");
		for (let n of e.scene.parts) t(n.geometry) && Pe(e.renderer, n, n.geometry.positions, n.geometry.normals);
	}
	tn(e), rn(e), Qt(e);
	let i = e.scene.environment, a = e.scene.effects, o = e.scene.shadow, s = JSON.stringify([i.lightDirection, o]);
	e.shadowKey !== s && (e.renderer.shadowBounds = c(o, i.lightDirection), e.renderer.shadowsDirty = !0, e.shadowKey = s), e.renderer.world = i.world, an(e), e.renderer.userPasses?.set(e.scene.postPasses ?? []), mn(e.renderer, i);
	let { objectMotion: l, ...u } = r, d = {
		...n,
		environment: nn(e.scene.parts, i, !!e.renderer.groundPart),
		effects: a,
		exposure: a.exposure,
		time: t,
		lines: i.lines,
		...pn(i),
		...u,
		effects: v(u.effects ?? a, n)
	}, f = !!l;
	if (a.colorBalance || a.glare || a.lensDistortion || a.stylize || a.composite) {
		let t = T("postSteps");
		t.installPostSteps(e.renderer), f ||= t.usesObjectMask(t.resolvePostSteps(d.effects));
	}
	if (l) {
		let { installObjectMotionBlur: t, packObjectMotion: n } = T("objectMotionBlur");
		d.pass || t(e.renderer), d.pass || e.renderer.render({
			...d,
			pass: "objectId",
			previousCamera: void 0
		}), d.objectMotion = n(e.renderer, l.current, l.previous);
	} else f && !d.pass && e.renderer.render({
		...d,
		pass: "objectId",
		previousCamera: void 0
	});
	e.renderer.render(d);
	let p = e.renderer.context.getError();
	if (p !== 0) throw Error(`WebGL render failed with error ${p}.`);
}
function an(e) {
	if (e.blendRevision === e.scene.revision && e.blendRenderer === e.renderer) return;
	e.blendRevision = e.scene.revision, e.blendRenderer = e.renderer;
	let t = /* @__PURE__ */ new Map();
	for (let n of e.scene.exportRecipe().nodes ?? []) n.blend !== void 0 && t.set(n.id, se(n.blend).radius);
	e.renderer.meshBlend.radii = t;
}
function on(e) {
	let t = G(e.renderer);
	return e.lastRender = t, {
		sessionId: e.sessionId,
		revision: e.scene.revision,
		topologyRevision: e.scene.topologyRevision,
		render: t
	};
}
function sn(e) {
	let { sessionId: t, revision: n, topologyRevision: r, render: i } = on(e);
	return {
		sessionId: t,
		revision: n,
		topologyRevision: r,
		inspection: e.scene.inspect(),
		render: i
	};
}
function cn(e) {
	let { diagnostics: t } = e.scene.inspect();
	return t?.length ? { diagnostics: t } : {};
}
function ln(e) {
	let t = e.scene.releasedRevisions ?? 0;
	return t > 0 ? { undoNote: `Released ${t} oldest undo revision${t === 1 ? "" : "s"} to fit maxVertices; newer ones still undo.` } : {};
}
function un(e) {
	try {
		return q(e), {
			...on(e),
			...cn(e),
			...ln(e),
			committed: !0,
			renderSucceeded: !0
		};
	} catch (t) {
		return {
			sessionId: e.sessionId,
			revision: e.scene.revision,
			render: e.lastRender ?? null,
			...cn(e),
			...ln(e),
			committed: !0,
			renderSucceeded: !1,
			renderError: t.message
		};
	}
}
function dn(e) {
	if (!e) return R.toDataURL("image/png").split(",")[1];
	let t = document.createElement("canvas");
	t.width = R.width, t.height = R.height;
	let n = t.getContext("2d");
	return n.drawImage(R, 0, 0), Gn(n, e, 0, 0), t.toDataURL("image/png").split(",")[1];
}
function J() {
	R.getContext("webgl2")?.getExtension("WEBGL_lose_context")?.loseContext();
	let e = document.createElement("canvas");
	R.replaceWith(e), R = e;
}
function fn(e) {
	return T("cascades").effectiveShadowCascades(e.environment, e.shadow);
}
function pn(e) {
	return e.wind ? { wind: e.wind.strength } : {};
}
function mn(e, t) {
	w("worldMaterials") && (t.wind || e.windHeading) && T("worldMaterials").applyWindHeading(e, (t.wind?.direction ?? 0) * Math.PI / 180);
}
function hn(e) {
	let t = fn(e);
	return t > 0 ? T("cascades").createCascadedShadows({ count: t }) : null;
}
function Y(e, { memoryBudgetMiB: t, backend: n, transparent: r = !1 }) {
	$t(e);
	let i = we(e.parts, e.environment), a = b(ae(y(new l(R, e.parts, {
		ground: i ? Te(i) : !1,
		hdr: !0,
		depth: !0,
		world: e.environment.world,
		environment: nn(e.parts, e.environment, !!i),
		shadowBounds: c(e.shadow, e.environment.lightDirection),
		shadowCascades: hn(e),
		skyOpenness: u,
		fogSkyVisibility: it,
		pixelRatio: 1,
		samples: n === "cpu" ? 1 : 4,
		memoryBudgetMiB: t,
		transparent: r
	}))));
	return T("userPass").installUserPasses(T("lineArt").installLineArt(oe(a)));
}
function gn(e, t) {
	let n = o({
		format: "67js.scene",
		schemaVersion: 1,
		geometries: [],
		materials: [],
		nodes: [],
		camera: {
			...e,
			...t
		}
	}).camera;
	return U(n), n;
}
function _n(e, t, n = !1) {
	let r = e.scene.effects.motionBlur.shutter || (n ? 1 / 24 : 0);
	if (r <= 0 || t === void 0 || e.asset) return;
	e.scene.sampleMotion(Math.max(0, t - r));
	let i = e.scene.camera;
	return e.scene.sampleMotion(t), i;
}
function vn(e, t, n = !1) {
	let { shutter: r, objects: i } = e.scene.effects.motionBlur, a = r || (n ? 1 / 24 : 0);
	if (!(a > 0 && (i > 0 || n)) || t === void 0 || e.asset) return;
	let { sampleWorldMatrices: o } = T("objectMotionBlur"), s = o(e.scene.parts);
	e.scene.sampleMotion(Math.max(0, t - a));
	let c = o(e.scene.parts);
	return e.scene.sampleMotion(t), {
		current: s,
		previous: c
	};
}
function X(e, { sessionId: t, memoryBudgetMiB: n, backend: r, transparent: i = !1 }, a, o, s) {
	if (I) throw Error("The scene renderer is leased to a render job.");
	U(e.camera);
	let c;
	try {
		B(null), c = Y(e, {
			memoryBudgetMiB: n,
			backend: r,
			transparent: i
		});
		let l = {
			scene: e,
			renderer: c,
			asset: a,
			placedAssets: o,
			sessionId: t,
			options: {
				memoryBudgetMiB: n,
				backend: r,
				transparent: i
			},
			checkpoints: /* @__PURE__ */ new Map(),
			evictedCheckpointIds: [],
			branches: Tt(),
			rendererTopology: e.topologyRevision,
			rendererTextured: K(e),
			sequenceFrames: s
		};
		q(l);
		let u = sn(l);
		if (r === "gpu" && /swiftshader|llvmpipe|software/i.test(u.render.graphics)) throw Error("Hardware GPU rendering was requested, but the browser selected a software renderer.");
		let d = Ht(u.inspection.residentGeometryBytes ?? 0);
		return F.set(t, l), d.length ? {
			...u,
			evictedSessions: d
		} : u;
	} catch (e) {
		throw c?.dispose(), J(), e;
	}
}
pe(() => import(
	/* @vite-ignore */
	new URL("/vendor/manifold.js", location.href).href
)), ye(() => import(
	/* @vite-ignore */
	new URL("/vendor/rapier.js", location.href).href
));
var yn, bn = Dt();
async function xn(e) {
	try {
		return await ke(e, bn);
	} catch (e) {
		throw Ot(e);
	}
}
function Sn(e) {
	for (let t of e?.values() ?? []) t.dispose();
	e?.clear();
}
async function Cn(e, t, n) {
	for (let { id: r, copies: i } of Ae(t)) for (let t = 0; t < i; t++) {
		let i = je(r, t);
		if (!e.has(i)) {
			if (!n?.[r]) throw Error(`Asset ${r.slice(0, 12)} was not supplied. Check asset_catalog for its id.`);
			e.set(i, await xn(H(n[r]).buffer));
		}
	}
}
function Z(e, t) {
	if (!Se()) return E().then(() => Z(e, t));
	let n = [];
	return !xe() && ve(e) && n.push(_e()), !he() && ge(e) && n.push(me()), n.length ? Promise.all(n).then(t) : t();
}
var wn = typeof PerformanceObserver == "function" && PerformanceObserver.supportedEntryTypes?.includes("longtask") ? new PerformanceObserver(() => {}) : null;
wn?.observe({ type: "longtask" });
var Q = {
	buildMilliseconds: 0,
	longestBlockMilliseconds: 0,
	longestLongTaskMilliseconds: 0,
	longTasks: 0
}, Tn = 20, En = performance.now();
setInterval(() => {
	let e = performance.now();
	Q.longestBlockMilliseconds = Math.max(Q.longestBlockMilliseconds, Math.round(e - En - Tn)), En = e;
}, Tn);
function Dn() {
	for (let e of wn?.takeRecords() ?? []) Q.longTasks++, Q.longestLongTaskMilliseconds = Math.max(Q.longestLongTaskMilliseconds, Math.round(e.duration));
}
function On() {
	Dn(), Object.assign(Q, {
		buildMilliseconds: 0,
		longestBlockMilliseconds: 0,
		longestLongTaskMilliseconds: 0,
		longTasks: 0
	}), En = performance.now(), r();
}
function kn(e) {
	Q.buildMilliseconds = Math.round(performance.now() - e);
}
function An() {
	return Dn(), {
		...t(),
		...Q
	};
}
function jn() {
	return e() && globalThis.__67jsKernelWorkers !== "off";
}
async function Mn(e, t) {
	if (!e.bake || t !== "gpu") return;
	let { gpuBakeKernels: n } = await import("../agent-bake-gpu-ByNLcaSe.js");
	return n({ texelTracer: await Ye() });
}
async function Nn(e, t, r) {
	let i = await Mn(e, r);
	return n(() => {
		let n = o(e, {}, t);
		for (let e of n.parts) e.material.map;
		return n;
	}, { pageKernels: i });
}
function Pn(e, t) {
	e.asset ? e.scene.sampleFrame({ motionTime: t }) : e.scene.sampleMotion(t);
}
function Fn(e) {
	let t = e.scene.rigExport?.() ?? {
		nodes: [],
		clips: []
	};
	return {
		parts: e.scene.parts.map(Ln),
		options: t.nodes.length ? t : {}
	};
}
var In = .001;
function Ln(e) {
	if (e.skin) return e;
	let t = [
		0,
		4,
		8
	].map((t) => {
		let n = [
			e.matrix[t],
			e.matrix[t + 1],
			e.matrix[t + 2]
		], r = Math.hypot(...n);
		return r === 0 ? n : n.map((e) => e / r);
	}), n = [
		[0, 1],
		[0, 2],
		[1, 2]
	].map(([e, n]) => Math.abs(t[e].reduce((e, r, i) => e + r * t[n][i], 0)));
	if (Math.max(...n) > In) return e;
	let r = fe([
		0,
		0,
		0
	], e.matrix), i = le([
		0,
		0,
		0,
		1
	], e.matrix), a = S([
		0,
		0,
		0
	], e.matrix);
	return {
		...e,
		matrix: de(C(), i, a, r)
	};
}
function Rn(e, t) {
	let { asset: n, scene: r } = e;
	if (!n) throw Error("clip needs an imported asset scene. Recipe scenes export their current pose.");
	let i = n.animations[t];
	if (!i) throw RangeError(`clip ${t} does not exist. The asset has ${n.animations.length} clips.`);
	let a = r.exportRecipe();
	if (a.animation || a.nodeOverrides.length || a.motion) throw Error("Exporting a clip needs the unposed asset: remove animation, node overrides and motion first, or export without clip for the current pose.");
	let o = ze(i), s = String(i.name || `clip ${t}`), c = {
		...o,
		name: s,
		tracks: [...o.tracks, ...Me(i)]
	};
	return {
		parts: n.parts.map((e, t) => r.parts[t].geometry === e.geometry ? e : {
			...e,
			geometry: r.parts[t].geometry
		}),
		options: {
			nodes: n.nodes,
			clips: [c]
		}
	};
}
function zn(e) {
	if (typeof e.toBase64 == "function") return e.toBase64();
	let t = 32768, n = "";
	for (let r = 0; r < e.length; r += t) n += String.fromCharCode(...e.subarray(r, r + t));
	return btoa(n);
}
var Bn;
function Vn(e, t, n) {
	let r = document.createElement("canvas");
	return r.width = t, r.height = n, r.getContext("2d").putImageData(new ImageData(e, t, n), 0, 0), r.toDataURL("image/png").split(",")[1];
}
var $;
function Hn(e, t, n, r) {
	let [i, a, o] = t, s = e[0] * i + e[4] * a + e[8] * o + e[12], c = e[1] * i + e[5] * a + e[9] * o + e[13], l = e[3] * i + e[7] * a + e[11] * o + e[15];
	if (!(l > 0)) return null;
	let u = s / l, d = c / l;
	return Math.abs(u) > 1 || Math.abs(d) > 1 ? null : {
		x: Math.round((u * .5 + .5) * n),
		y: Math.round((1 - (d * .5 + .5)) * r)
	};
}
function Un(e, t) {
	let n = /* @__PURE__ */ new Map();
	if (typeof e.inspectMeshes != "function" || t.length === 0) return n;
	let { meshes: r } = e.inspectMeshes({ geometries: t.slice(0, 16) });
	for (let e of r) {
		let t = Array.isArray(e.tags) ? e.tags : Object.keys(e.tags ?? {});
		n.set(e.geometry, {
			problems: e.problems.map((e) => e.kind),
			faceTags: t.slice(0, 6)
		});
	}
	return n;
}
function Wn(e, t, n, r) {
	let { scene: i } = e, a = (t) => e.asset ? t.id : t.geometry, o = i.inspect({ includeBounds: !0 }).nodes.filter((e) => e.bounds), s = new Map((i.exportRecipe().materials ?? []).map((e) => [e.id, e.tag])), c = ue(C(), t.eye, t.target, t.up), l = ce(C(), x(C(), t, n / r), c), u = Un(i, [...new Set(o.map(a))]), d = [];
	for (let e of o) {
		let t = Hn(l, [
			0,
			1,
			2
		].map((t) => (e.bounds.min[t] + e.bounds.max[t]) / 2), n, r);
		if (!t || d.length >= N.maximumLabels) continue;
		let i = u.get(a(e));
		d.push({
			id: e.id,
			name: wt(e.label),
			tag: s.get(e.material) ?? null,
			faceTags: i?.faceTags ?? [],
			problems: i?.problems ?? [],
			x: t.x,
			y: t.y
		});
	}
	return d;
}
function Gn(e, t, n, r) {
	e.font = "11px sans-serif", e.textBaseline = "middle";
	for (let i of t) {
		let t = [
			i.name,
			i.tag === "surface" ? null : i.tag,
			...i.problems.length ? [`! ${i.problems.join(",")}`] : []
		].filter(Boolean).join(" "), a = n + i.x, o = r + i.y;
		e.fillStyle = i.problems.length ? "#ff8a65" : "#ffe082", e.fillRect(a - 2, o - 2, 4, 4), e.lineWidth = 3, e.strokeStyle = "rgba(16,20,22,0.85)", e.strokeText(t, a + 5, o), e.fillText(t, a + 5, o);
	}
}
window.__agentPreview = {
	reviewBegin({ width: e, height: t }) {
		$ = document.createElement("canvas"), $.width = e, $.height = t;
		let n = $.getContext("2d");
		return n.fillStyle = "#202428", n.fillRect(0, 0, e, t), {
			width: e,
			height: t
		};
	},
	reviewShot({ sessionId: e, shot: t, index: n, width: r, height: i, columns: a, labels: s = !1 }) {
		let c = V(e), l = c.scene.exportRecipe(), u = t.animation ?? l.animation ?? null;
		if (c.asset) c.scene.sampleFrame({
			animation: u,
			motionTime: t.motionTime
		});
		else {
			if (t.animation !== void 0) throw RangeError("Imported animation requires an asset scene.");
			c.scene.sampleMotion(t.motionTime);
		}
		let d = o({
			format: "67js.scene",
			schemaVersion: 1,
			geometries: [],
			materials: [],
			nodes: [],
			camera: {
				...c.scene.camera,
				...t.camera
			}
		}).camera;
		U(d), q(c, t.rendererTime, d);
		let f = G(c.renderer, qt(c, d, c.scene.effects.exposure));
		if (f.width < 64 || f.height < 64) throw Error("Render budget reduced review below its minimum output size.");
		let p = $.getContext("2d"), m = n % a * r, h = Math.floor(n / a) * (i + 24);
		p.drawImage(R, m, h + 24, r, i), p.fillStyle = "#e4e7e9", p.font = "12px sans-serif", p.textBaseline = "middle", p.fillText(t.label.replace(/[\r\n\t]/g, " "), m + 8, h + 12, r - 16);
		let g = s ? Wn(c, d, r, i) : void 0;
		return g && Gn(p, g, m, h + 24), {
			label: t.label,
			camera: d,
			animation: c.asset ? u : null,
			motionTime: c.scene.motionTime ?? null,
			rendererTime: t.rendererTime,
			requestedWidth: r,
			requestedHeight: i,
			...f,
			...g ? { labels: g } : {}
		};
	},
	reviewResult() {
		return {
			data: $.toDataURL("image/png").split(",")[1],
			mimeType: "image/png"
		};
	},
	snapshot({ sessionId: e, expectedRevision: t }) {
		let n = V(e);
		if (n.scene.revision !== t) throw Error("Stale revision for render snapshot.");
		return {
			sourceRevision: n.scene.revision,
			recipe: n.scene.exportRecipe(),
			clips: n.asset?.animations.map((e) => ({ duration: e.duration })) ?? []
		};
	},
	suspend({ sessionId: e }) {
		let t = z(e);
		if (I) throw Error("Scene renderer is already suspended.");
		return B(null), J(), I = t, {
			sessionId: e,
			revision: t.scene.revision,
			suspended: !0
		};
	},
	resume({ sessionId: e }) {
		let t = z(e);
		if (I !== t) throw Error("Scene renderer is already active.");
		I = null;
		try {
			return t.renderer = Y(t.scene, t.options), t.rendererTopology = t.scene.topologyRevision, t.rendererTextured = K(t.scene), t.shadowKey = null, q(t), sn(t);
		} catch (e) {
			throw t.renderer?.dispose(), t.renderer = null, J(), e;
		}
	},
	frame({ sessionId: e, animation: t, motionTime: n, rendererTime: r = 0, pass: i, passDepthRange: a, passFloat: o = !1, floatOutput: s = !1, camera: c, depthOfField: l, brightness: u = 1, diagnose: d = !1 }) {
		let f = V(e);
		if (!Number.isFinite(u) || u < 0 || u > 1) throw RangeError("Invalid frame brightness.");
		if (!Number.isFinite(r) || r < 0 || r > 3600) throw RangeError("Invalid render time.");
		f.asset && (t !== void 0 || n !== void 0) ? f.scene.sampleFrame({
			...t === void 0 ? {} : { animation: t },
			...n === void 0 ? {} : { motionTime: n }
		}) : n !== void 0 && f.scene.sampleMotion(n);
		let p = c ? gn(f.scene.camera, c) : void 0, m = i === "velocity", h = !i || m ? _n(f, n, m) : void 0, g = h && c ? gn(h, c) : h, ee = !i || m ? vn(f, n, m) : void 0, te = f.scene.effects.exposure * u, ne = l ? {
			...f.scene.effects,
			depthOfField: {
				...f.scene.effects.depthOfField,
				...l
			}
		} : void 0, re = s && !i ? f.floatModule.outputFor(f, R).framebuffer : void 0, _ = () => q(f, r, p, {
			pass: i,
			passDepthRange: a,
			passFloat: o,
			previousCamera: g,
			outputFramebuffer: re,
			...ee ? { objectMotion: ee } : {},
			...u === 1 ? {} : { exposure: te },
			...ne ? { effects: ne } : {}
		}), ie = i === "wireframe" ? f.wireframeModule.withWireframe(f.renderer, _) : _(), v = d && !i && !s && u === 1, y = G(f.renderer, i ? [] : qt(f, p ?? f.scene.camera, v ? f.scene.effects.exposure : void 0));
		return i === "wireframe" ? {
			...y,
			wireframe: ie
		} : i === "objectId" ? {
			...y,
			objectNames: f.renderer.passSupport.objectNames()
		} : i === "cryptomatte" ? {
			...y,
			cryptomatte: f.renderer.passSupport.cryptomatteManifest()
		} : y;
	},
	async prepareFloatOutput({ sessionId: e }) {
		V(e).floatModule = await import("../float-output-CeXlmEEM.js");
	},
	async prepareWireframe({ sessionId: e }) {
		V(e).wireframeModule = await import("../wireframe-pass-Cgzhgxc_.js");
	},
	readFloat({ sessionId: e, source: t, region: n }) {
		let r = V(e);
		return r.floatModule.readFrame(r, R, t, n);
	},
	async pathTrace({ sessionId: e, animation: t, motionTime: n, options: r }) {
		let i = V(e);
		i.asset && (t !== void 0 || n !== void 0) ? i.scene.sampleFrame({
			...t === void 0 ? {} : { animation: t },
			...n === void 0 ? {} : { motionTime: n }
		}) : n !== void 0 && i.scene.sampleMotion(n);
		let { renderPathTracedImage: a } = await import("../path-tracer.js"), o = i.scene.environment, c = await a({
			parts: i.scene.parts,
			environment: {
				...o,
				map: s(o)
			},
			camera: i.scene.camera
		}, r);
		if (c.report.denoiser === "oidn") {
			Bn = c.features;
			let e = {};
			for (let t of [
				"color",
				"albedo",
				"normal"
			]) {
				let n = c.features[t];
				e[t] = zn(new Uint8Array(n.buffer, n.byteOffset, n.byteLength));
			}
			return {
				features: e,
				report: c.report
			};
		}
		return {
			data: Vn(c.rgba, c.width, c.height),
			report: c.report
		};
	},
	async exportNativeScene({ sessionId: e, animation: t, motionTime: n, options: r }) {
		let i = V(e);
		i.asset && (t !== void 0 || n !== void 0) ? i.scene.sampleFrame({
			...t === void 0 ? {} : { animation: t },
			...n === void 0 ? {} : { motionTime: n }
		}) : n !== void 0 && i.scene.sampleMotion(n);
		let [{ createCamera: a, describeIgnoredFeatures: o }, { buildTraceScene: c, refuseLocalVolumes: l }, u, { buildNativeInput: d }] = await Promise.all([
			import("../path-tracer.js"),
			import("../path-tracer-scene-Thw9vHJu.js").then((e) => e.a),
			import("../path-tracer-gpu-pack-DYL2MEaQ.js").then((e) => e.l),
			import("../pack-input-CCebEGOF.js")
		]), f = {
			...i.scene.environment,
			map: s(i.scene.environment)
		}, p = c(i.scene.parts, f);
		l(p, "the native path tracer");
		let m = d(p, a(i.scene.camera, r.width, r.height), r, u), h = Ge(m), g = o(i.scene.parts, f);
		return {
			tables: h,
			triangleCount: m.triangleCount,
			triangles: p.indices.length / 3,
			ignored: g
		};
	},
	async finishPathTrace({ width: e, height: t, linear: n }) {
		let { toneMapToRgba8: r } = await import("../path-tracer.js"), i;
		if (n) {
			let e = atob(n), t = new Uint8Array(e.length);
			for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
			i = new Float32Array(t.buffer);
		} else {
			let { denoiseRadiance: n } = await import("../path-tracer-denoise-j_ATlMbO.js").then((e) => e.n);
			i = n({
				width: e,
				height: t,
				...Bn
			});
		}
		return Bn = void 0, { data: Vn(r(i, e, t), e, t) };
	},
	async createWithAssets(e) {
		let t = /* @__PURE__ */ new Map();
		try {
			await E(), await Cn(t, e.recipe, e.assetData);
			let n = await Xt(/* @__PURE__ */ new Map(), e.sequenceData);
			return await Z(e.recipe, () => {
				On();
				let r = performance.now(), i = o(e.recipe, {}, {
					assets: t,
					sequenceFrames: n
				});
				return kn(r), X(i, e, void 0, t, n);
			});
		} catch (e) {
			throw Sn(t), e;
		}
	},
	create(e) {
		if (Yt(e.lookData), Ae(e.recipe).length) return this.createWithAssets(e);
		let t = (t) => {
			On();
			let n = performance.now();
			if (!jn()) {
				let r = o(e.recipe, {}, { sequenceFrames: t });
				return kn(n), X(r, e, void 0, void 0, t);
			}
			return Nn(e.recipe, { sequenceFrames: t }, e.backend).then((r) => (kn(n), X(r, e, void 0, void 0, t)));
		};
		return Z(e.recipe, () => e.sequenceData ? Xt(/* @__PURE__ */ new Map(), e.sequenceData).then(t) : t(/* @__PURE__ */ new Map()));
	},
	async createAsset(e) {
		let t = H(e.data), n;
		try {
			return await E(), n = await xn(t.buffer), X(Oe(n, e.recipe, { sources: await Ut(e.sources) }), e, n);
		} catch (e) {
			throw n?.dispose(), e;
		}
	},
	inspect({ sessionId: e, ...t }) {
		return {
			sessionId: e,
			...V(e).scene.inspect(t),
			kernels: An()
		};
	},
	inspectMeshes({ sessionId: e, ...t }) {
		let n = V(e).scene;
		if (typeof n.inspectMeshes != "function") throw TypeError("mesh_inspect needs a procedural recipe scene or an imported asset scene.");
		return Se() ? {
			sessionId: e,
			...n.inspectMeshes(t)
		} : E().then(() => this.inspectMeshes({
			sessionId: e,
			...t
		}));
	},
	async queryOnlyWalkMap({ data: e, ...t }) {
		return yn ??= It(ke), yn.walkMap({
			...t,
			bytes: e === void 0 ? void 0 : H(e)
		});
	},
	async walkMap({ sessionId: e, clearance: t = 2, groundRange: n, keepOut: r, streetY: i, includeCells: a = !1, ...o }) {
		let s = V(e);
		Se() || await E();
		let c = performance.now(), l = Mt(s), u = l.walkMap(Nt(o, r, i));
		return {
			sessionId: e,
			revision: s.scene.revision,
			...Ft(u, {
				clearance: t,
				groundRange: n,
				keepOut: r,
				includeCells: a
			}),
			skippedParts: l.skipped.length,
			milliseconds: Math.round(performance.now() - c)
		};
	},
	apply(e) {
		if (Yt(e.lookData), e.sequenceData) {
			let { sequenceFrames: t } = V(e.sessionId);
			if (!t) throw Error("This scene was created from an imported asset and has no image sequences.");
			return Xt(t, e.sequenceData).then(() => this.apply({
				...e,
				sequenceData: void 0
			}));
		}
		if (e.sources) {
			let { scene: t } = V(e.sessionId);
			return Ut(e.sources).then((n) => (t.provideMotionSources?.(n), Z(e.operations, () => this.applyLoaded(e))));
		}
		return Ae(e.operations).length ? this.applyWithAssets(e) : Z(e.operations, () => this.applyLoaded(e));
	},
	async applyWithAssets(e) {
		let t = V(e.sessionId);
		if (!t.placedAssets) throw Error("This scene was created without placed assets. Recreate it with an asset node in scene_create, then add more.");
		return await E(), await Cn(t.placedAssets, e.operations, e.assetData), Z(e.operations, () => this.applyLoaded(e));
	},
	applyLoaded({ sessionId: e, operations: t, expectedRevision: n }) {
		let r = V(e);
		U(Wt(r, t));
		let a = r.scene.environment.volumeFog.density;
		for (let e of t) e.type === "set-environment" && Object.hasOwn(e.environment?.volumeFog ?? {}, "density") && (a = e.environment.volumeFog.density);
		if (a > 0 && !r.renderer.capabilities.hdr) throw Error("Volumetric fog requires HDR support; this preview cannot enable it.");
		let o = typeof r.scene.exportRecipe == "function" ? r.scene.exportRecipe() : null;
		r.scene.apply(t, { expectedRevision: n });
		let s = o ? i(o, r.scene.exportRecipe(), t) : {};
		return {
			...un(r),
			...s
		};
	},
	editMesh({ sessionId: e, expectedRevision: t, geometry: n, edits: r, replace: i }) {
		let a = V(e);
		if (typeof a.scene.inspectMeshes != "function") throw TypeError("mesh_edit needs a procedural recipe scene or an imported asset scene.");
		let o = {
			type: "edit-mesh",
			geometry: n,
			edits: r,
			...i === void 0 ? {} : { replace: i }
		};
		return Z(r, () => {
			let r = this.applyLoaded({
				sessionId: e,
				operations: [o],
				expectedRevision: t
			}), [i] = a.scene.inspectMeshes({ geometries: [n] }).meshes;
			return {
				...r,
				mesh: i
			};
		});
	},
	setMeshStack({ sessionId: e, expectedRevision: t, geometry: n, stack: r, apply: i }) {
		let a = V(e);
		if (typeof a.scene.inspectMeshes != "function" || a.asset) throw TypeError("mesh_stack supports procedural recipe scenes. Imported parts take mesh_edit with a mesh ID such as mesh-0.");
		let o = {
			type: "set-mesh-stack",
			geometry: n,
			...r === void 0 ? {} : { stack: r },
			...i === void 0 ? {} : { apply: i }
		}, s = this.applyLoaded({
			sessionId: e,
			operations: [o],
			expectedRevision: t
		}), [c] = a.scene.inspectMeshes({ geometries: [n] }).meshes;
		return {
			...s,
			mesh: c
		};
	},
	look({ sessionId: e, motionTime: t, labels: n = !1 }) {
		let r = V(e);
		if (t !== void 0) {
			if (typeof r.scene.sampleMotion != "function") throw RangeError("Procedural motion time is unavailable for imported assets.");
			r.scene.sampleMotion(t);
		}
		q(r);
		let i = G(r.renderer, qt(r, r.scene.camera, r.scene.effects.exposure));
		r.lastRender = i;
		let a = n ? Wn(r, r.scene.camera, R.width, R.height) : void 0;
		return {
			data: dn(a),
			mimeType: "image/png",
			metadata: {
				sessionId: e,
				revision: r.scene.revision,
				topologyRevision: r.scene.topologyRevision,
				motionTime: r.scene.motionTime ?? null,
				...i,
				...a ? { labels: a } : {}
			}
		};
	},
	checkpoint({ sessionId: e, checkpointId: t }) {
		let n = V(e), r = [];
		for (; n.checkpoints.size >= be.maxCheckpoints;) {
			let [e, t] = n.checkpoints.entries().next().value;
			n.scene.releaseCheckpoint(t.handle), n.checkpoints.delete(e), n.evictedCheckpointIds.push(e), r.push(e);
		}
		n.evictedCheckpointIds.splice(0, Math.max(0, n.evictedCheckpointIds.length - Lt));
		let i = n.scene.checkpoint();
		return n.checkpoints.set(t, {
			handle: i,
			fogDensity: n.scene.environment.volumeFog.density
		}), {
			sessionId: e,
			checkpointId: t,
			revision: n.scene.revision,
			...r.length ? { evictedCheckpointIds: r } : {}
		};
	},
	restore({ sessionId: e, checkpointId: t, revision: n, expectedRevision: r }) {
		let i = V(e);
		if (n !== void 0) return i.scene.restoreRevision(n, { expectedRevision: r }), un(i);
		zt(i, t);
		let a = i.checkpoints.get(t);
		if (a.fogDensity > 0 && !i.renderer.capabilities.hdr) throw Error("Volumetric fog requires HDR support; this preview cannot restore it.");
		return i.scene.restore(a.handle, { expectedRevision: r }), un(i);
	},
	releaseCheckpoint({ sessionId: e, checkpointId: t }) {
		let n = V(e);
		return zt(n, t), n.scene.releaseCheckpoint(n.checkpoints.get(t).handle), n.checkpoints.delete(t), {
			sessionId: e,
			checkpointId: t,
			released: !0
		};
	},
	branchApply({ sessionId: e, name: t, operations: n, expectedRevision: r }) {
		return Z(n, () => {
			let i = V(e);
			if (i.asset) throw TypeError("Branches support procedural recipe scenes.");
			if (i.scene.revision !== r) throw Error("Stale revision for branch.");
			let a = i.scene.exportRecipe(), s = o(a);
			U(Wt(i, n)), s.apply(n, { expectedRevision: s.revision });
			let { shared: c } = i.branches.fork(t, {
				recipe: s.exportRecipe(),
				baseRecipe: a,
				operations: n,
				baseRevision: r
			});
			return {
				sessionId: e,
				branch: t,
				sourceRevision: i.scene.revision,
				shared: c,
				branches: i.branches.names(),
				snapshots: i.branches.snapshotCount()
			};
		});
	},
	branchRecipe({ sessionId: e, name: t }) {
		let n = V(e), r = n.branches.get(t);
		return {
			recipe: r.recipe,
			stale: r.baseKey !== JSON.stringify(n.scene.exportRecipe())
		};
	},
	keepBranch({ sessionId: e, name: t, expectedRevision: n }) {
		let r = V(e), i = r.branches.get(t);
		if (i.baseKey !== JSON.stringify(r.scene.exportRecipe())) throw Error(`The scene changed since branch ${t} was forked. Fork it again from the current revision.`);
		let a = this.applyLoaded({
			sessionId: e,
			operations: i.operations,
			expectedRevision: n
		});
		return r.branches.clear(), {
			...a,
			kept: t
		};
	},
	exportRecipe({ sessionId: e }) {
		let t = V(e);
		return {
			sessionId: e,
			revision: t.scene.revision,
			recipe: t.scene.exportRecipe()
		};
	},
	exportGlb({ sessionId: e, clip: t, motionTime: n, maxTextureSize: r, maximumBytes: i }) {
		let a = V(e);
		n !== void 0 && Pn(a, n);
		let { parts: o, options: s } = t === void 0 ? Fn(a) : Rn(a, t), c = Ne(o, {
			...s,
			...r === void 0 ? {} : { maxTextureSize: r }
		});
		if (c.byteLength > i) throw RangeError(`The GLB is ${c.byteLength} bytes, above the ${i} byte limit. Lower maxTextureSize or simplify the scene.`);
		return {
			sessionId: e,
			revision: a.scene.revision,
			bytes: c.byteLength,
			parts: o.length,
			clips: s.clips?.length ?? 0,
			data: zn(new Uint8Array(c))
		};
	},
	dispose({ sessionId: e }) {
		return Bt(z(e)), {
			sessionId: e,
			disposed: !0
		};
	}
};
