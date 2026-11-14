/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { t as e } from "./camera-path-C8Pae8D4.js";
import { n as t, t as n } from "./field-error-BpFTmyMO.js";
import { createVehicleNodeOverrides as r, createVehicleRig as i, driveAlongLegs as a } from "./vehicle.js";
import { t as o } from "./agent-drive-schema-Bd2Wmwiu.js";
// src/agent-drive.js
function s(t) {
	return Array.isArray(t) ? t : e({
		loop: !1,
		...t
	});
}
function c(e) {
	return Number(e.toFixed(5));
}
function l(e, n, { materialIds: r = null, fieldPath: i = "motion.drive" } = {}) {
	return t(i, () => u(e, n, r));
}
function u(e, t, o) {
	let { path: l, legs: u, wheels: d, body: f, forwardAxis: p, wheelbase: m, lights: h = {}, ...g } = t, _ = i({
		asset: e,
		wheels: d,
		body: f,
		forwardAxis: p,
		wheelbase: m,
		maxSteerAngle: g.maxSteerAngle,
		lights: { headlights: h.headlights }
	});
	for (let [e, t] of (h.tailLights ?? []).entries()) if (o && !o.has(t.material)) throw n(`lights.tailLights[${e}].material`, t.material, `the id of a material in the asset, one of ${[...o].slice(0, 5).join(", ")}`);
	let v = a(_, (u ?? [{ path: l }]).map((e) => ({
		...e,
		path: s(e.path)
	})), g, u ? void 0 : () => "path"), y = h.tailLights ?? [];
	return Object.freeze({
		rig: _,
		duration: v.duration,
		length: v.length,
		sample(e) {
			let t = v.sample(e);
			return {
				pose: t,
				nodeOverrides: r(_, t),
				emissions: y.map((e) => ({
					material: e.material,
					emission: (e.off ?? 0) + ((e.on ?? 4) - (e.off ?? 0)) * t.lights[e.signal]
				}))
			};
		},
		describe(e) {
			return {
				wheels: _.wheels.map((e) => ({
					id: e.id,
					side: e.side,
					axle: e.axle,
					radius: c(e.radius),
					steerable: e.steerable,
					nodes: e.entries.map((e) => e.label)
				})),
				rejectedNames: _.rejectedNames,
				wheelbase: c(_.wheelbase),
				trackWidth: c(_.trackWidth),
				duration: c(v.duration),
				length: c(v.length),
				...e ? {
					lights: {
						brake: c(e.lights.brake),
						reverse: e.lights.reverse,
						headlights: e.lights.headlights.map((e) => ({
							id: e.id,
							position: e.position.map(c),
							direction: e.direction.map(c)
						}))
					},
					speed: c(e.speed),
					direction: e.direction
				} : {}
			};
		}
	});
}
export { l as createAssetDrive, o as normalizeDrive };
