/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { $ as e, B as t, C as n, F as r, I as i, J as a, K as o, L as s, M as ee, N as te, P as c, Q as l, R as u, S as d, U as f, V as p, X as m, Y as h, Z as g, _, a as v, at as y, b, c as x, ct as S, d as C, dt as w, f as T, g as E, h as D, i as O, it as k, l as A, lt as j, m as M, nt as N, o as P, ot as F, p as I, q as L, r as R, rt as z, st as B, tt as V, u as H, v as U, w as W, x as G, y as K, z as q } from "./mesh-uv-CPpcmeLo.js";
import { a as J, i as Y, n as X, r as Z, t as ne } from "./mesh-lod-C7TM9Cy8.js";
import { C as re, D as ie, S as ae, T as oe, _ as se, a as ce, b as le, c as ue, d as de, f as fe, h as pe, i as me, l as he, m as ge, n as _e, o as ve, p as ye, r as be, s as xe, t as Se, u as Ce, v as we, w as Te, x as Ee, y as De } from "./mesh-recipe-BRDW7Uj_.js";
import { c as Oe, d as Q, f as ke, g as Ae } from "./mesh-operations-ByLVkOhP.js";
var je = 1024, Me = 4096;
function Ne(e, t) {
	if (!t || typeof t != "object" || Array.isArray(t)) throw TypeError("selection must be an object such as { \"open\": true }, { \"group\": \"rim\" } or { \"edges\": [0, 1, 2] }.");
	return t.edges === void 0 ? t.group === void 0 ? P(e, t, v(e)) : Fe(e, t) : Pe(e, t);
}
function Pe(e, t) {
	let n = Object.keys(t).filter((e) => e !== "edges");
	if (n.length) throw TypeError(`selection.edges does not take ${n.join(", ")}.`);
	let r = t.edges;
	if (!Array.isArray(r) || r.length < 1 || r.length > e.edgeCount) throw RangeError(`selection.edges needs 1 to ${e.edgeCount} edge indices, such as [0, 1, 2].`);
	let i = new Uint8Array(e.edgeCount);
	for (let t of r) {
		if (!Number.isInteger(t) || t < 0 || t >= e.edgeCount) throw RangeError(`selection.edges holds ${JSON.stringify(t)}; every index must be an integer from 0 to ${e.edgeCount - 1}.`);
		i[t] = 1;
	}
	return i;
}
function Fe(e, t) {
	let n = Object.keys(t).filter((e) => e !== "group" && e !== "minWeight");
	if (n.length) throw TypeError(`selection.group does not take ${n.join(", ")}. Use group and minWeight.`);
	if (typeof t.group != "string") throw TypeError("selection.group must be a vertex group name such as \"rim\".");
	let r = t.minWeight ?? .5;
	if (!Number.isFinite(r) || r <= 0 || r > 1) throw RangeError("selection.minWeight must be a number above 0 and at most 1, such as 0.5.");
	let i = w(e, t.group), a = new Uint8Array(e.edgeCount);
	for (let t = 0; t < e.edgeCount; t++) {
		let n = i[e.edgeVertices[t * 2]] >= r && i[e.edgeVertices[t * 2 + 1]] >= r;
		a[t] = +!!n;
	}
	return a;
}
function Ie(e, t) {
	let n = /* @__PURE__ */ new Map(), r = (e, t, r) => {
		n.has(e) || n.set(e, []), n.get(e).push([t, r]);
	};
	for (let n = 0; n < e.edgeCount; n++) {
		if (!t[n]) continue;
		let i = e.edgeVertices[n * 2], a = e.edgeVertices[n * 2 + 1];
		r(i, a, n), r(a, i, n);
	}
	for (let e of n.values()) e.sort((e, t) => e[0] - t[0] || e[1] - t[1]);
	return n;
}
function $(e, t, n, r) {
	let i = [e], [a, o] = t;
	for (r.add(o), i.push(a); a !== e && n.get(a).length === 2;) {
		let e = n.get(a).find(([, e]) => !r.has(e));
		if (!e) break;
		[a, o] = e, r.add(o), i.push(a);
	}
	return i;
}
function Le(e) {
	let t = /* @__PURE__ */ new Set(), n = [], r = [...e.keys()].sort((e, t) => e - t);
	for (let i of r) if (e.get(i).length !== 2) for (let r of e.get(i)) t.has(r[1]) || n.push({
		vertices: $(i, r, e, t),
		closed: !1
	});
	for (let i of r) {
		let r = e.get(i).find(([, e]) => !t.has(e));
		r && n.push({
			vertices: $(i, r, e, t).slice(0, -1),
			closed: !0
		});
	}
	return n;
}
function Re(e, t) {
	let n = Ie(e, Ne(e, t));
	if (n.size === 0) throw RangeError("selection matches no edge of the mesh. Pick edges that exist, for example { \"open\": true } on a mesh with a hole.");
	let r = Le(n);
	if (r.length > 64) throw RangeError(`The selection makes ${r.length} splines; at most 64. Select fewer edge loops or chains.`);
	let i = 0, a = r.map((t) => {
		if (t.vertices.length > 1024) throw RangeError(`A selected chain has ${t.vertices.length} points; at most ${je} for one spline. Select a shorter chain.`);
		i += t.vertices.length;
		let n = t.vertices.map((t) => Array.from(e.positions.subarray(t * 3, t * 3 + 3)));
		return {
			kind: "poly",
			closed: t.closed,
			points: n
		};
	});
	if (i > 4096) throw RangeError(`The selection makes ${i} points in all; at most ${Me}. Select fewer edges.`);
	return a;
}
export { ae as BOOLEAN_OPERATIONS, ne as DEFAULT_LOD_RATIOS, e as DOMAINS, m as EditMesh, T as FALLOFF_CURVES, V as MAX_MESH_CORNERS, Oe as MAX_MESH_EDITS, N as MAX_MESH_VERTICES, ve as MAX_REMESH_CELLS, xe as MAX_REMESH_RESOLUTION, he as MAX_SMOOTH_ITERATIONS, Q as MAX_STACK_NODES, ke as MESH_EDIT_OPERATIONS, Ce as SIMPLE_DEFORM_MODES, Ae as STACK_OPERATIONS, z as TAG_PREFIX, Se as applyMeshEdits, x as arrayMesh, O as bevelEdges, I as connectedRegions, o as cornerCycles, L as cornerFaces, p as cornerNormals, n as countSelected, k as createMeshData, pe as decimateMesh, M as deleteFaces, y as deriveEdges, a as edgeCornerTable, g as editMesh, _e as evaluateMeshStack, u as extractRender, D as extrudeFaceRegion, E as extrudeIndividual, f as faceNormals, h as faceParts, F as facesWithTag, _ as flipFaces, q as gatherRenderPositions, X as generateAssetLods, Z as generateGeometryLods, Y as generateMeshLods, U as insetIndividual, K as insetRegion, ee as joinTriangles, ie as lintMesh, re as loadMeshBooleans, Ee as loopCut, b as mergeByDistance, Te as meshBoolean, oe as meshBooleansLoaded, B as meshBounds, l as meshData, Re as meshEdgesToSplines, te as meshFromGeometry, S as meshTags, A as mirrorMesh, be as normalizeMeshEdits, me as normalizeMeshStack, de as normalizeModifierEdit, De as packUvIslands, le as projectUv, c as rebuildFromCorners, ue as remeshMesh, H as removeCoincidentFaces, fe as runModifierEdit, P as selectEdges, W as selectFaces, se as signedVolume, C as solidifyMesh, ye as splitSharpEdges, we as surfaceDeviation, j as tagCounts, G as tagFaces, r as tagFacesByAxis, ce as transformMesh, d as translateFaces, ge as triangulateFaces, t as triangulateMesh, R as unwrapUv, J as validateTopology, i as weldVertices, s as withFaceAttributes };
