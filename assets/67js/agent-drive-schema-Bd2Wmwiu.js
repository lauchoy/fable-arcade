/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { t as e } from "./field-error-BpFTmyMO.js";
// src/agent-drive-schema.js
var t = Object.freeze({
	maxPathPoints: 512,
	maxLegs: 32,
	maxWheels: 8,
	maxNodeReferences: 64,
	maxLights: 16
}), n = [
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
], r = n.slice(2, 9).concat([
	"startTime",
	"maxSteerAngle",
	"fullBrakeDeceleration",
	"rollGain",
	"pitchGain",
	"wheelbase"
]), i = [
	"id",
	"node",
	"nodes",
	"side",
	"axle",
	"radius",
	"center",
	"steerable",
	"spinSign"
], a = ["headlights", "tailLights"], o = [
	"id",
	"position",
	"direction"
], s = [
	"id",
	"material",
	"signal",
	"off",
	"on"
], c = [
	"duration",
	"loop",
	"eye"
];
function l(t, n, r) {
	if (!t || typeof t != "object" || Array.isArray(t)) throw e(r, t, "an object, such as {}", TypeError);
	for (let i of Object.keys(t)) if (!n.includes(i)) throw e(`${r}.${i}`, t[i], `no such field; use one of ${n.join(", ")}`, TypeError);
}
function u(t, n) {
	if (!Array.isArray(t) || t.length !== 3 || t.some((e) => !Number.isFinite(e))) throw e(n, t, "an array of 3 finite numbers, such as [0, 0, 1]", TypeError);
	return [...t];
}
function d(t, n) {
	if (typeof t != "string" || !t || t.length > 256) throw e(n, t, "a node label or id of 1 to 256 characters, such as \"wheel-front-left\"", TypeError);
	return t;
}
function f(n, r) {
	if (Array.isArray(n)) {
		if (n.length < 2 || n.length > t.maxPathPoints) throw e(r, `${n.length} points`, `2 to ${t.maxPathPoints} points, such as [[0, 0, 0], [0, 0, 10]]`);
		return n.map((e, t) => u(e, `${r}[${t}]`));
	}
	if (l(n, c, r), !n.eye || !Array.isArray(n.eye.keyframes) || n.eye.keyframes.length > t.maxPathPoints) throw e(r, n, "an array of [x, y, z] points, such as [[0, 0, 0], [0, 0, 10]], or a camera path such as { \"duration\": 5, \"eye\": { \"keyframes\": [] } }", TypeError);
	return structuredClone(n);
}
function p(n, r) {
	if (n === "auto") return n;
	if (!Array.isArray(n) || n.length < 2 || n.length > t.maxWheels) throw e(r, Array.isArray(n) ? `${n.length} wheels` : n, `"auto", or a list of 2 to ${t.maxWheels} wheels, such as "auto"`);
	return n.map((n, a) => {
		let o = `${r}[${a}]`;
		l(n, i, o);
		let s = n.nodes ?? [n.node];
		if (!Array.isArray(s) || !s.length || s.length > t.maxNodeReferences) throw e(`${o}.${n.nodes === void 0 ? "node" : "nodes"}`, n.nodes ?? n.node, "a node, or nodes listing tire, hub and bolts, such as \"wheel-0\"", TypeError);
		return s.forEach((e, t) => d(e, n.nodes === void 0 ? `${o}.node` : `${o}.nodes[${t}]`)), structuredClone(n);
	});
}
function m(n, r) {
	l(n, a, r);
	let i = {};
	if (n.headlights !== void 0) {
		if (!Array.isArray(n.headlights) || n.headlights.length > t.maxLights) throw e(`${r}.headlights`, Array.isArray(n.headlights) ? `${n.headlights.length} lamps` : n.headlights, `a list of at most ${t.maxLights} lamps, such as [{ "position": [0.5, 0.6, 2] }]`);
		i.headlights = n.headlights.map((e, t) => {
			let n = `${r}.headlights[${t}]`;
			l(e, o, n);
			let i = { position: u(e.position, `${n}.position`) };
			return e.id !== void 0 && (i.id = String(e.id)), e.direction !== void 0 && (i.direction = u(e.direction, `${n}.direction`)), i;
		});
	}
	if (n.tailLights !== void 0) {
		if (!Array.isArray(n.tailLights) || n.tailLights.length > t.maxLights) throw e(`${r}.tailLights`, Array.isArray(n.tailLights) ? `${n.tailLights.length} lamps` : n.tailLights, `a list of at most ${t.maxLights} lamps, such as [{ "material": "tail", "signal": "brake" }]`);
		i.tailLights = n.tailLights.map((t, n) => {
			let i = `${r}.tailLights[${n}]`;
			if (l(t, s, i), typeof t.material != "string" || !t.material) throw e(`${i}.material`, t.material, "the id of the material whose emission the lamp drives, such as \"tail\"", TypeError);
			if (t.signal !== "brake" && t.signal !== "reverse") throw e(`${i}.signal`, t.signal, "one of brake, reverse");
			return structuredClone(t);
		});
	}
	return i;
}
function h(i, a = "drive") {
	if (l(i, n, a), i.path === void 0 == (i.legs === void 0)) throw e(`${a}.${i.path === void 0 ? "path" : "legs"}`, i.path ?? i.legs, "exactly one of path or legs, such as a path [[0, 0, 0], [0, 0, 10]]", TypeError);
	let o = {};
	if (i.path !== void 0 && (o.path = f(i.path, `${a}.path`)), i.legs !== void 0) {
		if (!Array.isArray(i.legs) || !i.legs.length || i.legs.length > t.maxLegs) throw e(`${a}.legs`, Array.isArray(i.legs) ? `${i.legs.length} legs` : i.legs, `1 to ${t.maxLegs} legs, such as [{ "path": [[0, 0, 0], [0, 0, 10]] }]`);
		o.legs = i.legs.map((t, n) => {
			let r = `${a}.legs[${n}]`;
			if (l(t, [
				"path",
				"direction",
				"pause"
			], r), t.direction !== void 0 && t.direction !== "forward" && t.direction !== "reverse") throw e(`${r}.direction`, t.direction, "one of forward, reverse");
			return {
				...structuredClone(t),
				path: f(t.path, `${r}.path`)
			};
		});
	}
	for (let t of r) if (i[t] !== void 0) {
		if (!Number.isFinite(i[t])) throw e(`${a}.${t}`, i[t], "a finite number, such as 5", TypeError);
		o[t] = i[t];
	}
	if (i.steering !== void 0) {
		if (i.steering !== "ackermann" && i.steering !== "shared") throw e(`${a}.steering`, i.steering, "one of ackermann, shared");
		o.steering = i.steering;
	}
	if (i.forwardAxis !== void 0) {
		if (![
			"+x",
			"-x",
			"+z",
			"-z"
		].includes(i.forwardAxis)) throw e(`${a}.forwardAxis`, i.forwardAxis, "one of +x, -x, +z, -z");
		o.forwardAxis = i.forwardAxis;
	}
	if (i.wheels !== void 0 && (o.wheels = p(i.wheels, `${a}.wheels`)), i.body !== void 0) {
		if (!Array.isArray(i.body) || !i.body.length || i.body.length > t.maxNodeReferences) throw e(`${a}.body`, Array.isArray(i.body) ? `${i.body.length} nodes` : i.body, `a list of 1 to ${t.maxNodeReferences} nodes, such as ["body"]`);
		o.body = i.body.map((e, t) => d(e, `${a}.body[${t}]`));
	}
	return i.lights !== void 0 && (o.lights = m(i.lights, `${a}.lights`)), o;
}
export { h as t };
