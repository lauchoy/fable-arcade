/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { createNavmesh as e } from "./navmesh.js";
import { t } from "./field-error-BpFTmyMO.js";
// src/agent-navigation.js
var n = [
	"ground",
	"from",
	"to",
	"avoid",
	"radius",
	"maxSlope",
	"cellSize",
	"seconds",
	"speed",
	"lift",
	"spacing"
], r = 1.4, i = 100;
function a(e) {
	return Math.round(e * 1e3) / 1e3;
}
function o(e, n, r, i) {
	if (e !== void 0) {
		if (!Number.isFinite(e) || e < r || e > i) throw t(`path.${n}`, e, `a number from ${r} to ${i}, such as ${Math.min(Math.max(1, r), i)}`);
		return e;
	}
}
function s(n, s, c) {
	let l = o(n.seconds, "seconds", .1, 600), u = o(n.speed, "speed", .01, 100);
	if (l !== void 0 && u !== void 0) throw t("path.speed", u, "speed or seconds, not both; leave speed out when seconds is set, such as { \"seconds\": 4 }");
	let d = o(n.lift, "lift", -100, i) ?? 0, f = e({
		positions: s.positions,
		indices: s.indices,
		agentRadius: o(n.radius, "radius", .01, 100),
		maxSlopeDegrees: o(n.maxSlope, "maxSlope", 1, 89),
		cellSize: o(n.cellSize, "cellSize", .05, 100),
		obstacles: c.map((e) => ({
			min: [e.min[0], e.min[2]],
			max: [e.max[0], e.max[2]]
		}))
	}), p = f.findPath(n.from, n.to, { spacing: o(n.spacing, "spacing", .1, 100) }), m = l ?? p.length / (u ?? r), h = 0, g = p.points.map((e, t) => {
		t > 0 && (h += Math.hypot(e[0] - p.points[t - 1][0], e[2] - p.points[t - 1][2]));
		let n = p.length > 0 ? h / p.length : 0;
		return {
			time: a(m * n),
			value: [
				a(e[0]),
				a(e[1] + d),
				a(e[2])
			]
		};
	});
	return {
		length: a(p.length),
		seconds: a(m),
		cellSize: f.cellSize,
		agentRadius: f.agentRadius,
		searchNodes: p.searchNodes,
		keyframes: g
	};
}
function c(e, r, i) {
	if (typeof e != "object" || !e || Array.isArray(e)) throw t("path", e, "an object such as { \"ground\": \"floor\", \"from\": [0, 0, 0], \"to\": [5, 0, 5] }", TypeError);
	for (let r of Object.keys(e)) if (!n.includes(r)) throw t(`path.${r}`, e[r], `a known field, one of ${n.join(", ")}`, TypeError);
	if (e.avoid !== void 0 && (!Array.isArray(e.avoid) || e.avoid.length > 64)) throw t("path.avoid", e.avoid, "a list of at most 64 node IDs, such as [\"wall\"]");
	let { geometry: a, worldMatrix: o } = r(e.ground, "ground"), c = new Float32Array(a.positions.length);
	for (let e = 0; e < c.length; e += 3) for (let t = 0; t < 3; t++) c[e + t] = o[t] * a.positions[e] + o[4 + t] * a.positions[e + 1] + o[8 + t] * a.positions[e + 2] + o[12 + t];
	let l = (e.avoid ?? []).map((e) => {
		let t = r(e, "avoid");
		return i(t.geometry, t.worldMatrix);
	});
	return s(e, {
		positions: c,
		indices: a.indices
	}, l);
}
export { n as NAVIGATION_FIELDS, s as queryAgentPath, c as resolvePathQuery };
