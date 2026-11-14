/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { h as e, n as t } from "./mat4-BCZClxna.js";
import { n } from "./gl-program-DIc2K8ep.js";
import { r } from "./agent-mesh-C9R6qW3Q.js";
import { J as i, U as a, st as o } from "./mesh-uv-CPpcmeLo.js";
// src/mesh-wireframe.js
var s = Object.freeze([
	"regular",
	"boundary",
	"nonManifold",
	"flipped",
	"degenerate"
]), c = 2e5, l = 0, u = 1, d = 2, f = 3, p = 4, m = Object.freeze([
	0,
	1,
	4,
	2,
	3
]);
function h(e, t) {
	let n = new Uint8Array(e.edgeCount);
	for (let r = 0; r < e.edgeCount; r++) {
		let i = t.edgeOffsets[r], a = t.edgeOffsets[r + 1] - i;
		a === 1 ? n[r] = u : a > 2 ? n[r] = d : e.cornerVertices[t.edgeCorners[i]] === e.cornerVertices[t.edgeCorners[i + 1]] && (n[r] = f);
	}
	return n;
}
function g(e, t) {
	let n = o(e), r = (Math.hypot(...n.max.map((e, t) => e - n.min[t])) * 1e-7) ** 2, { areas: i } = a(e);
	for (let n = 0; n < e.faceCount; n++) if (!(i[n] > r)) for (let r = e.faceOffsets[n]; r < e.faceOffsets[n + 1]; r++) {
		let n = e.cornerEdges[r];
		m[p] > m[t[n]] && (t[n] = p);
	}
}
function _(e, { maximumSegments: t = c } = {}) {
	if (!Number.isInteger(t) || t < 1) throw RangeError("maximumSegments must be a positive integer.");
	let n = h(e, i(e));
	g(e, n);
	let r = Object.fromEntries(s.map((e) => [e, 0]));
	for (let e of n) r[s[e]]++;
	let a = e.edgeCount - r.regular, o = Math.min(e.edgeCount, t), u = new Float32Array(o * 7), d = 0;
	for (let t of [!0, !1]) for (let r = 0; r < e.edgeCount && d < o; r++) {
		if (n[r] !== l !== t) continue;
		let i = d * 7;
		u.set(e.positions.subarray(e.edgeVertices[r * 2] * 3, e.edgeVertices[r * 2] * 3 + 3), i), u.set(e.positions.subarray(e.edgeVertices[r * 2 + 1] * 3, e.edgeVertices[r * 2 + 1] * 3 + 3), i + 3), u[i + 6] = n[r], d++;
	}
	return {
		segments: u,
		count: d,
		counts: r,
		truncated: d < e.edgeCount,
		droppedFaults: Math.max(0, a - d)
	};
}
// src/wireframe-pass.js
var v = 1e6, y = 20, b = Object.freeze([
	[
		.06,
		.07,
		.09
	],
	[
		1,
		.55,
		0
	],
	[
		1,
		.05,
		.05
	],
	[
		0,
		.85,
		1
	],
	[
		1,
		0,
		.9
	]
]), x = Object.freeze([
	.7,
	1.6,
	1.6,
	1.6,
	1.6
]), S = 2e-4, C = "#version 300 es\nprecision highp float;\nlayout(location = 0) in vec3 endpointA;\nlayout(location = 1) in vec3 endpointB;\nlayout(location = 2) in float kind;\nuniform mat4 modelViewProjection;\nuniform vec2 viewportSize;\nuniform float halfWidths[5];\nuniform float depthBias;\nflat out float edgeKind;\nvoid main() {\n  const vec2 corners[6] = vec2[6](vec2(0.0, -1.0), vec2(1.0, -1.0), vec2(1.0, 1.0), vec2(0.0, -1.0), vec2(1.0, 1.0), vec2(0.0, 1.0));\n  vec4 clipA = modelViewProjection * vec4(endpointA, 1.0);\n  vec4 clipB = modelViewProjection * vec4(endpointB, 1.0);\n  edgeKind = kind;\n  const float nearW = 1e-4;\n  if (clipA.w < nearW && clipB.w < nearW) {\n    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);\n    return;\n  }\n  if (clipA.w < nearW) clipA = mix(clipA, clipB, (nearW - clipA.w) / (clipB.w - clipA.w));\n  if (clipB.w < nearW) clipB = mix(clipB, clipA, (nearW - clipB.w) / (clipA.w - clipB.w));\n  vec2 screenA = clipA.xy / clipA.w * viewportSize * 0.5;\n  vec2 screenB = clipB.xy / clipB.w * viewportSize * 0.5;\n  vec2 along = screenB - screenA;\n  vec2 direction = length(along) > 1e-6 ? normalize(along) : vec2(1.0, 0.0);\n  vec2 side = vec2(-direction.y, direction.x);\n  vec2 corner = corners[gl_VertexID];\n  vec4 clip = mix(clipA, clipB, corner.x);\n  vec2 offset = (side * corner.y + direction * (corner.x * 2.0 - 1.0)) * halfWidths[int(kind + 0.5)] / (viewportSize * 0.5);\n  clip.xy += offset * clip.w;\n  clip.z -= depthBias * clip.w;\n  gl_Position = clip;\n}", w = "#version 300 es\nprecision highp float;\nuniform vec3 colors[5];\nflat in float edgeKind;\nout vec4 outputColor;\nvoid main() { outputColor = vec4(colors[int(edgeKind + 0.5)], 1.0); }", T = /* @__PURE__ */ new WeakMap();
function E(e) {
	let t = T.get(e);
	if (t) return t;
	let r = e.context, i = n(r, C, w);
	return t = {
		handle: i,
		modelViewProjection: r.getUniformLocation(i, "modelViewProjection"),
		viewportSize: r.getUniformLocation(i, "viewportSize"),
		halfWidths: r.getUniformLocation(i, "halfWidths[0]"),
		depthBias: r.getUniformLocation(i, "depthBias"),
		colors: r.getUniformLocation(i, "colors[0]")
	}, T.set(e, t), t;
}
function D(e, t, n) {
	let i = n.get(t);
	if (i) return i;
	let a;
	try {
		a = _(r(t), { maximumSegments: c });
	} catch (e) {
		if (!(e instanceof RangeError || e instanceof TypeError)) throw e;
		return i = {
			unreadable: !0,
			count: 0
		}, n.set(t, i), i;
	}
	let o = e.context, s = o.createBuffer();
	o.bindBuffer(o.ARRAY_BUFFER, s), o.bufferData(o.ARRAY_BUFFER, a.segments, o.STATIC_DRAW);
	let l = o.createVertexArray();
	o.bindVertexArray(l);
	for (let [e, t, n] of [
		[
			0,
			3,
			0
		],
		[
			1,
			3,
			12
		],
		[
			2,
			1,
			24
		]
	]) o.enableVertexAttribArray(e), o.vertexAttribPointer(e, t, o.FLOAT, !1, 28, n), o.vertexAttribDivisor(e, 1);
	return i = {
		buffer: s,
		vertexArray: l,
		count: a.count,
		counts: a.counts,
		truncated: a.truncated
	}, n.set(t, i), i;
}
function O(e) {
	return e.batches.filter((t) => e.drawsInOpaqueLoop(t)).flatMap((e) => e.parts);
}
function k(e, t) {
	for (let n of t.values()) n.vertexArray && (e.deleteVertexArray(n.vertexArray), e.deleteBuffer(n.buffer));
}
function A(e) {
	let { regular: t, ...n } = e;
	return n;
}
function j(n) {
	let r = n.context, i = E(n), a = n.reversedDepth === !0, o = a ? n.rasterViewProjection : n.viewProjection;
	r.bindFramebuffer(r.FRAMEBUFFER, n.passSupport.framebuffer), r.viewport(0, 0, n.canvas.width, n.canvas.height), r.useProgram(i.handle), r.uniform2f(i.viewportSize, n.canvas.width, n.canvas.height), r.uniform1fv(i.halfWidths, x), r.uniform1f(i.depthBias, a ? -2e-4 : S), r.uniform3fv(i.colors, b.flat()), r.enable(r.DEPTH_TEST), r.depthFunc(a ? r.GEQUAL : r.LEQUAL), r.depthMask(!1), r.disable(r.CULL_FACE);
	let c = Object.fromEntries(s.map((e) => [e, 0])), l = [], u = t(), d = 0, f = 0, p = 0, m = !1, h = /* @__PURE__ */ new Map();
	try {
		for (let t of O(n)) {
			let a = D(n, t.geometry, h);
			if (a.unreadable) {
				p++;
				continue;
			}
			if (d + a.count > 1e6) {
				f++;
				continue;
			}
			d += a.count, m ||= a.truncated;
			for (let e of s) c[e] += a.counts[e];
			let g = A(a.counts);
			Object.values(g).some((e) => e > 0) && l.push({
				part: t.name,
				...g
			}), e(u, o, t.matrix), r.uniformMatrix4fv(i.modelViewProjection, !1, u), r.bindVertexArray(a.vertexArray), r.drawArraysInstanced(r.TRIANGLES, 0, 6, a.count);
		}
	} finally {
		r.bindVertexArray(null), k(r, h);
	}
	r.depthMask(!0), r.depthFunc(a ? r.GREATER : r.LESS), r.enable(r.CULL_FACE);
	let g = (e) => e.boundary + e.nonManifold + e.flipped + e.degenerate;
	return l.sort((e, t) => g(t) - g(e)), {
		edges: c,
		faultyParts: l.slice(0, 20),
		faultyPartsOmitted: Math.max(0, l.length - 20),
		partsOmitted: f,
		partsSkipped: p,
		truncated: m
	};
}
function M(e, t) {
	let n = null;
	e.passSupport.overlay = () => {
		n = j(e);
	};
	try {
		t();
	} finally {
		e.passSupport.overlay = null;
	}
	if (!n) throw Error("The wireframe pass drew no frame.");
	return n;
}
export { v as MAXIMUM_WIREFRAME_FRAME_SEGMENTS, y as MAXIMUM_WIREFRAME_REPORTED_PARTS, b as WIREFRAME_COLORS, M as withWireframe };
