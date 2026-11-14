/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { t as e } from "./field-error-BpFTmyMO.js";
import { createCrowd as t } from "./retarget.js";
import { bakeCrowdPalette as n, createCrowdParts as r, createCrowdRig as i } from "./crowd-skinning.js";
import { i as a, o, r as s } from "./agent-scene-assets-CkuUJjd0.js";
// src/agent-crowd.js
var c = Object.freeze({
	maxInstances: 1e3,
	maxCachedCrowds: 4
}), l = [
	"clip",
	"count",
	"seed",
	"layout",
	"spacing",
	"columns",
	"size",
	"rateJitter",
	"randomYaw",
	"speed",
	"frameRate",
	"morphs",
	"lods",
	"farDistance",
	"farRate"
];
function u(t, n, r, i) {
	if (!Number.isFinite(t) || t < n || t > r) throw e(`crowd.${i}`, t, `a number from ${n} to ${r}, such as ${Math.min(Math.max(1, n), r)}`);
	return t;
}
function d(t) {
	if (!t || typeof t != "object" || Array.isArray(t)) throw e("crowd", t, "an object such as { \"count\": 50, \"layout\": \"grid\" }", TypeError);
	for (let n of Object.keys(t)) if (!l.includes(n)) throw e(`crowd.${n}`, t[n], `a known field, one of ${l.join(", ")}`, TypeError);
	if (!Number.isInteger(t.count) || t.count < 1 || t.count > c.maxInstances) throw e("crowd.count", t.count, `an integer from 1 to ${c.maxInstances}, such as 50`);
	let n = t.layout ?? "grid";
	if (n !== "grid" && n !== "scatter") throw e("crowd.layout", n, "one of grid or scatter");
	let r = t.clip ?? 0;
	if (!Number.isInteger(r) || r < 0) throw e("crowd.clip", r, "a clip index of 0 or more, such as 0");
	let i = {
		clip: r,
		count: t.count,
		seed: u(t.seed ?? 1, -2147483648, 2147483647, "seed"),
		layout: n,
		spacing: u(t.spacing ?? 1.5, .05, 1e3, "spacing"),
		rateJitter: u(t.rateJitter ?? .15, 0, .9, "rateJitter"),
		speed: u(t.speed ?? 1, .05, 16, "speed"),
		frameRate: u(t.frameRate ?? 30, 4, 60, "frameRate")
	};
	t.columns !== void 0 && (i.columns = Math.round(u(t.columns, 1, c.maxInstances, "columns"))), t.size !== void 0 && (i.size = u(t.size, .1, 1e5, "size"));
	for (let n of [
		"randomYaw",
		"morphs",
		"lods"
	]) if (t[n] !== void 0 && typeof t[n] != "boolean") throw e(`crowd.${n}`, t[n], "true or false", TypeError);
	if (i.randomYaw = t.randomYaw ?? !1, i.morphs = t.morphs ?? !1, i.lods = t.lods ?? !0, t.farDistance === void 0 != (t.farRate === void 0)) throw e(t.farDistance === void 0 ? "crowd.farDistance" : "crowd.farRate", void 0, "both farDistance and farRate, or neither, such as { \"farDistance\": 40, \"farRate\": 8 }", TypeError);
	return t.farDistance !== void 0 && (i.farDistance = u(t.farDistance, .1, 1e5, "farDistance"), i.farRate = u(t.farRate, 1, 60, "farRate")), i;
}
function f(e, o, s) {
	let c = e.animations[s.clip], l = i(e.parts, { morphs: s.morphs }), u = n(l, (t) => e.stagePose({
		animation: {
			clip: s.clip,
			time: t
		},
		nodeOverrides: []
	}).commit(), {
		duration: c.duration,
		frameRate: s.frameRate
	}), d = t({
		count: s.count,
		clip: {
			duration: c.duration,
			tracks: []
		},
		seed: s.seed,
		layout: s.layout,
		spacing: s.spacing,
		columns: s.columns,
		size: s.size,
		rateJitter: s.rateJitter,
		randomYaw: s.randomYaw
	}), f = s.farDistance ? {
		distance: s.farDistance,
		rate: s.farRate
	} : null;
	return {
		asset: e,
		rig: l,
		palette: u,
		crowd: d,
		set: r({
			rig: l,
			palette: u,
			instances: d.instances,
			lods: s.lods,
			farPose: f,
			name: o.slice(0, 12)
		}),
		materialOutputs: l.parts.map((e) => a(e.material, {})),
		clipName: c.name ?? `clip ${s.clip}`,
		duration: c.duration
	};
}
function p(t, n, r, i, a, o, l) {
	let { id: u, crowd: d } = n.asset;
	if (!r.animations[d.clip]) throw e(`nodes.${n.id}.asset.crowd.clip`, d.clip, `a clip index from 0 to ${r.animations.length - 1} (asset ${u.slice(0, 12)} has ${r.animations.length} clips)`);
	let p = `crowd:${n.id}:${u}:${i}:${JSON.stringify(d)}`;
	if (a.get(p)?.asset !== r) {
		let e = [...a.keys()].filter((e) => e.startsWith("crowd:"));
		e.length >= c.maxCachedCrowds && a.delete(e[0]);
		try {
			a.set(p, f(r, u, d));
		} catch (e) {
			throw e.message = `Node ${n.id} crowd: ${e.message}`, e;
		}
	}
	let m = a.get(p), h = m.rig.parts.length;
	if (t.nodes.length + d.count * h > l.maxNodes) throw e(`nodes.${n.id}.asset.crowd.count`, d.count, `a count whose part nodes (${h} per instance) fit in maxNodes ${l.maxNodes} beside the ${t.nodes.length} authored nodes, so at most ${Math.max(0, Math.floor((l.maxNodes - t.nodes.length) / h))}`);
	let g = `crowd:${u.slice(0, 12)}:${i}`, _ = m.rig.parts.map((e, n) => {
		let r = `${g}:${n}`;
		return o.materialOutputs.set(r, m.materialOutputs[n]), t.materials.push({
			id: r,
			...s(e.material),
			assetSource: !0
		}), o.geometryParts.set(r, e.geometry), t.geometries.push({
			id: r,
			type: "asset",
			assetId: u,
			copy: i,
			part: n
		}), r;
	}), v = [], y = [];
	m.set.parts.forEach((e, t) => {
		let r = Math.floor(t / h), i = t % h, a = `${n.id}/${r}/${i}`;
		y.push(a), v.push({
			id: a,
			parent: n.id,
			label: `${m.clipName} ${r}`,
			translation: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0,
				1
			],
			scale: [
				1,
				1,
				1
			],
			geometry: `${g}:${i}`,
			material: _[i],
			assetPart: {
				placement: n.id,
				index: r,
				matrix: Array.from(e.matrix)
			}
		}), o.partExtras.set(a, {
			crowd: e.crowd,
			assembly: e.assembly,
			...e.lods ? { lods: e.lods } : {},
			...e.morph ? { morph: e.morph } : {}
		});
	});
	let b = t.camera?.eye ?? null;
	return {
		nodes: v,
		record: {
			node: n.id,
			assetId: u,
			copy: i,
			asset: r,
			partNodeIds: y,
			clip: null,
			drive: null,
			drivePose: null,
			crowd: {
				stage(e) {
					let t = e * d.speed;
					return {
						commit: () => m.set.setTimes((e) => m.crowd.clipTime(e, t), b),
						discard() {}
					};
				},
				describe() {
					return {
						node: n.id,
						assetId: u,
						kind: "crowd",
						instances: d.count,
						parts: y.length,
						batches: h,
						clip: {
							index: d.clip,
							name: m.clipName,
							duration: m.duration
						},
						frames: m.palette.frameCount,
						paletteBytes: m.palette.data.byteLength,
						boundsRadius: m.palette.bounds.radius,
						lods: d.lods,
						morphs: m.rig.parts.filter((e) => e.morph).length,
						...d.farDistance ? { farPose: {
							distance: d.farDistance,
							rate: d.farRate
						} } : {}
					};
				}
			}
		}
	};
}
o({
	normalizeCrowd: d,
	expandCrowd: p
});
export { c as CROWD_LIMITS, p as expandCrowd, d as normalizeCrowd };
