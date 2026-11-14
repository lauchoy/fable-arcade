/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { h as e, n as t, o as n } from "./mat4-BCZClxna.js";
import { _ as r, a as i, c as a, g as o, i as s } from "./vegetation-t1HZyQyp.js";
import { createRecipeTerrain as c } from "./agent-terrain-CBDmlZIM.js";
import { t as l } from "./field-error-BpFTmyMO.js";
// src/agent-vegetation.js
var u = Object.freeze({
	maxInstances: 1e3,
	maxVariants: 4,
	maxExclusions: 32,
	maxCandidates: 4e3,
	maxCachedSets: 4
}), d = [
	...Object.keys(r),
	"grass",
	"flowers"
], f = [
	"species",
	"mix",
	"seed",
	"height",
	"leaves",
	"season",
	"cullDistance",
	"distanceScale",
	"scatter"
], p = [
	"ground",
	"density",
	"slopeLimit",
	"area",
	"exclude",
	"variants",
	"scale"
], m = [
	"center",
	"radius",
	"min",
	"max",
	"node"
], h = .5, g = Object.freeze([
	[.35, [
		196,
		150,
		40
	]],
	[.6, [
		186,
		84,
		26
	]],
	[.85, [
		112,
		66,
		34
	]]
]), _ = [
	80,
	128,
	40
], v = .9, y = /* @__PURE__ */ new Set([
	"broadleaf",
	"birch",
	"bush"
]);
function b(e, t, n) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw l(n, e, "an object, such as {}", TypeError);
	for (let r of Object.keys(e)) if (!t.includes(r)) throw l(`${n}.${r}`, e[r], `no such field; use one of ${t.join(", ")}`, TypeError);
}
function x(e, t, n, r) {
	if (!Number.isFinite(e) || e < t || e > n) throw l(r, e, `a number from ${t} to ${n}, such as ${Math.min(Math.max(1, t), n)}`);
	return e;
}
function S(e, t) {
	if (!Array.isArray(e) || e.length !== 2 || e.some((e) => !Number.isFinite(e))) throw l(t, e, "[x, z] in metres, such as [0, 0]", TypeError);
	return [...e];
}
function C(e, t) {
	if (b(e, m, t), e.min !== void 0 || e.max !== void 0) {
		let n = S(e.min, `${t}.min`), r = S(e.max, `${t}.max`);
		if (r[0] <= n[0] || r[1] <= n[1]) throw l(`${t}.max`, r, `[x, z] above min ${JSON.stringify(n)} on both axes`);
		return {
			min: n,
			max: r
		};
	}
	let n = x(e.radius, .01, 2e3, `${t}.radius`);
	if (e.node !== void 0) {
		if (typeof e.node != "string" || !e.node) throw l(`${t}.node`, e.node, "a node ID, such as \"pond\"", TypeError);
		return {
			node: e.node,
			radius: n
		};
	}
	return {
		center: S(e.center, `${t}.center`),
		radius: n
	};
}
function w(e, t) {
	if (b(e, p, t), typeof e.ground != "string" || !e.ground) throw l(`${t}.ground`, e.ground, "the ID of a terrain node, such as \"ground\"", TypeError);
	let n = {
		ground: e.ground,
		density: x(e.density ?? .012, 1e-4, 4, `${t}.density`),
		slopeLimit: x(e.slopeLimit ?? 32, 0, 90, `${t}.slopeLimit`),
		variants: x(e.variants ?? 3, 1, u.maxVariants, `${t}.variants`),
		exclude: []
	};
	if (!Number.isInteger(n.variants)) throw l(`${t}.variants`, n.variants, `a whole number from 1 to ${u.maxVariants}, such as 3`);
	if (e.exclude !== void 0) {
		if (!Array.isArray(e.exclude) || e.exclude.length > u.maxExclusions) throw l(`${t}.exclude`, Array.isArray(e.exclude) ? `${e.exclude.length} areas` : e.exclude, `a list of at most ${u.maxExclusions} areas, such as [{ "center": [0, 0], "radius": 5 }]`);
		n.exclude = e.exclude.map((e, n) => C(e, `${t}.exclude[${n}]`));
	}
	if (e.area !== void 0 && (b(e.area, ["min", "max"], `${t}.area`), n.area = {
		min: S(e.area.min, `${t}.area.min`),
		max: S(e.area.max, `${t}.area.max`)
	}, n.area.max[0] <= n.area.min[0] || n.area.max[1] <= n.area.min[1])) throw l(`${t}.area.max`, n.area.max, `[x, z] above min ${JSON.stringify(n.area.min)} on both axes`);
	if (e.scale !== void 0) {
		if (!Array.isArray(e.scale) || e.scale.length !== 2) throw l(`${t}.scale`, e.scale, "[min, max], such as [0.8, 1.2]", TypeError);
		if (n.scale = [x(e.scale[0], .1, 10, `${t}.scale[0]`), x(e.scale[1], .1, 10, `${t}.scale[1]`)], n.scale[1] < n.scale[0]) throw l(`${t}.scale`, e.scale, "[min, max] with max not below min, such as [0.8, 1.2]");
	}
	return n;
}
function T(e) {
	return b(e, ["strength", "direction"], "environment.wind"), {
		strength: x(e.strength ?? .3, 0, 4, "environment.wind.strength"),
		direction: x(e.direction ?? 0, -360, 360, "environment.wind.direction")
	};
}
function E(e, t) {
	return {
		...e,
		vegetation: t.report,
		geometryParts: new Map([...e.geometryParts, ...t.geometryParts]),
		materialOutputs: new Map([...e.materialOutputs, ...t.materialOutputs]),
		partExtras: new Map([...e.partExtras, ...t.partExtras])
	};
}
function D(e, t) {
	let n = t && [
		"geometry",
		"skin",
		"asset"
	].find((e) => t[e] !== void 0);
	if (n) throw l(n, t[n], "nothing, because a node that grows vegetation is a group; drop geometry, material, skin and asset", TypeError);
	b(e, f, "vegetation");
	let i = {};
	if (e.species === void 0 == (e.mix === void 0)) throw l("vegetation.species", e.species, "exactly one of species (one tree, such as \"broadleaf\") or mix (a scatter, such as { \"broadleaf\": 3, \"bush\": 1 })", TypeError);
	if (e.species !== void 0) {
		if (!d.includes(e.species) || !e.scatter && !r[e.species]) throw l("vegetation.species", e.species, `one of ${(e.scatter ? d : Object.keys(r)).join(", ")}`);
		i.species = e.species;
	} else {
		if (!e.scatter) throw l("vegetation.scatter", e.scatter, "a scatter, such as { \"ground\": \"ground\" }, because mix needs one; a single tree takes species", TypeError);
		if (!e.mix || typeof e.mix != "object" || Array.isArray(e.mix)) throw l("vegetation.mix", e.mix, "an object that maps species to weights, such as { \"broadleaf\": 3, \"bush\": 1 }", TypeError);
		i.mix = {};
		for (let [t, n] of Object.entries(e.mix)) {
			if (!d.includes(t)) throw l("vegetation.mix", t, `species names among ${d.join(", ")}`);
			i.mix[t] = x(n, 0, 100, `vegetation.mix.${t}`);
		}
		if (!Object.values(i.mix).some((e) => e > 0)) throw l("vegetation.mix", e.mix, "at least one positive weight, such as { \"broadleaf\": 1 }");
	}
	if (i.seed = x(e.seed ?? 1, -2147483648, 2147483647, "vegetation.seed"), e.height !== void 0 && (i.height = x(e.height, .2, 80, "vegetation.height")), i.leaves = e.leaves ?? "cards", i.leaves !== "cards" && i.leaves !== "mesh") throw l("vegetation.leaves", i.leaves, "\"cards\" or \"mesh\"");
	return i.season = x(e.season ?? 0, 0, 1, "vegetation.season"), e.cullDistance !== void 0 && (i.cullDistance = x(e.cullDistance, 1, 1e5, "vegetation.cullDistance")), i.distanceScale = x(e.distanceScale ?? 1, .1, 10, "vegetation.distanceScale"), e.scatter !== void 0 && (i.scatter = w(e.scatter, "vegetation.scatter")), i;
}
function O(e, t) {
	let n = [[0, e], ...g];
	if (t >= n[n.length - 1][0]) return [...n[n.length - 1][1]];
	let r = 0;
	for (; t > n[r + 1][0];) r++;
	let [i, a] = n[r], [o, s] = n[r + 1], c = (t - i) / (o - i);
	return a.map((e, t) => Math.round(e + (s[t] - e) * c));
}
function k(e, t, n, i) {
	if (e.map) {
		let a = r[n], s = n === "grass" ? "grass" : e === t.materials.crown ? "clump" : a.leaf.texture, c = n === "grass" ? _ : a.leaf.color;
		return {
			...e,
			map: o(s, O(c, i))
		};
	}
	let a = e.color.map((e) => e ** (1 / 2.2) * 255);
	return {
		...e,
		color: O(a, i).map((e) => (e / 255) ** 2.2)
	};
}
function A(r, i) {
	let a = new Map(r.map((e) => [e.id, e])), o = n(t(), i.rotation, i.translation, i.scale), s = i.parent === null ? null : a.get(i.parent);
	for (let r = 0; s && r < 256; r++) {
		let r = n(t(), s.rotation, s.translation, s.scale);
		o = e(t(), r, o), s = s.parent === null ? null : a.get(s.parent);
	}
	return o;
}
function j(e, t) {
	let n = e.nodes.find((e) => e.id === t.ground), r = n && e.geometries.find((e) => e.id === n.geometry);
	if (r?.type !== "terrain") throw l("vegetation.scatter.ground", t.ground, "the ID of a node that draws a terrain geometry, such as \"ground\"; give the group node the same transform as the ground");
	return {
		definition: r,
		terrain: c(r)
	};
}
function M(e, t) {
	let n = (t.size ?? 40) / 2 - h, r = e.area ?? {
		min: [-n, -n],
		max: [n, n]
	};
	return {
		minX: Math.max(r.min[0], -n),
		maxX: Math.min(r.max[0], n),
		minZ: Math.max(r.min[1], -n),
		maxZ: Math.min(r.max[1], n)
	};
}
function N(e, t, n) {
	let r = t.exclude.map((t) => {
		if (t.min) return (e, n) => e >= t.min[0] && e <= t.max[0] && n >= t.min[1] && n <= t.max[1];
		let n = t.center;
		if (t.node) {
			let r = e.nodes.find((e) => e.id === t.node);
			if (!r) throw l("vegetation.scatter.exclude[].node", t.node, "the ID of a node in the recipe, such as \"pond\"");
			n = [r.translation[0], r.translation[2]];
		}
		return (e, r) => Math.hypot(e - n[0], r - n[1]) <= t.radius;
	});
	return (e, t) => n.isHole(e, t) || r.some((n) => n(e, t));
}
function P(e, t) {
	let { scatter: n } = t, { definition: r, terrain: i } = j(e, n), a = M(n, r), o = (a.maxX - a.minX) * (a.maxZ - a.minZ) * n.density;
	if (o > u.maxCandidates) throw l("vegetation.scatter.density", n.density, `a density that tries at most ${u.maxCandidates} trees over the area (this tries about ${Math.round(o)}); lower it or give a smaller area`);
	return {
		area: a,
		density: n.density,
		terrainHeight: i.heightAt,
		slopeLimit: n.slopeLimit,
		exclusion: N(e, n, i),
		seed: t.seed,
		mix: t.mix ?? { [t.species]: 1 },
		variants: n.variants,
		leaves: t.leaves,
		...n.scale ? { scale: n.scale } : {}
	};
}
function F(e, n) {
	if (!n.scatter) {
		let e = s({
			species: n.species,
			leaves: n.leaves,
			...n.height ? { height: n.height } : {}
		}, n.seed);
		return {
			variants: [e],
			instances: [{
				variant: e,
				matrix: t(),
				species: n.species
			}]
		};
	}
	let r = a(P(e, n));
	if (r.instances.length > u.maxInstances) throw l("vegetation.scatter.density", n.scatter.density, `a density that places at most ${u.maxInstances} instances (this placed ${r.instances.length}); lower it or give a smaller area`);
	return {
		variants: Object.values(r.variants).flat(),
		instances: r.instances
	};
}
function I(e, t) {
	let { vegetation: n } = t, r = n.scatter ? e.geometries.find((t) => t.id === e.nodes.find((e) => e.id === n.scatter.ground)?.geometry) : null, i = n.scatter?.exclude.filter((e) => e.node).map((t) => e.nodes.find((e) => e.id === t.node)?.translation), { season: a, cullDistance: o, distanceScale: s, ...c } = n;
	return JSON.stringify([
		c,
		r,
		i
	]);
}
function L(e) {
	return {
		tag: e.tag ?? "surface",
		color: [...e.color],
		metallic: e.metallic ?? 0,
		roughness: e.roughness ?? .5,
		emission: e.emission ?? 0,
		opacity: 1,
		alphaMode: e.alphaMode ?? "opaque",
		doubleSided: !!e.doubleSided
	};
}
function R(e, t, n, r) {
	n.serial ??= 0;
	let a = e.nodes.filter((e) => e.vegetation), o = {
		geometryParts: /* @__PURE__ */ new Map(),
		materialOutputs: /* @__PURE__ */ new Map(),
		partExtras: /* @__PURE__ */ new Map(),
		report: []
	}, s = [], c = /* @__PURE__ */ new Set(), d = e.camera?.eye ?? [
		0,
		0,
		0
	];
	for (let t of a) {
		let { vegetation: r } = t, a = `vegetation:${I(e, t)}`;
		if (!n.has(a)) {
			let t = [...n.keys()].filter((e) => e.startsWith("vegetation:"));
			t.length >= u.maxCachedSets && n.delete(t[0]), n.set(a, {
				serial: ++n.serial,
				grown: F(e, r),
				outputs: /* @__PURE__ */ new Map()
			});
		}
		let l = n.get(a), f = r.season >= v, p = A(e.nodes, t), m = new Map(l.grown.variants.map((e, t) => [e, t])), h = /* @__PURE__ */ new Map(), g = {}, _ = 0, b = 0;
		l.grown.instances.forEach((n, a) => {
			let u = [
				n.matrix[12],
				n.matrix[13],
				n.matrix[14]
			], v = [
				p[0] * u[0] + p[4] * u[1] + p[8] * u[2] + p[12],
				p[1] * u[0] + p[5] * u[1] + p[9] * u[2] + p[13],
				p[2] * u[0] + p[6] * u[1] + p[10] * u[2] + p[14]
			], x = Math.hypot(d[0] - v[0], d[1] - v[1], d[2] - v[2]), S = i(x, n.variant, {
				distanceScale: r.distanceScale,
				cullDistance: r.cullDistance
			}), C = g[n.species] ??= {
				instances: 0,
				levels: []
			};
			if (C.instances++, S < 0) {
				b++;
				return;
			}
			C.levels[S] = (C.levels[S] ?? 0) + 1;
			let w = f && y.has(n.species), T = y.has(n.species) || n.species === "grass";
			n.variant.levels[S].parts.forEach((i, u) => {
				if (w && i.tintable) return;
				let d = `vegetation:${l.serial}:${m.get(n.variant)}:${S}:${u}`;
				c.has(d) || (c.add(d), e.geometries.push({
					id: d,
					type: "asset",
					vegetation: l.serial
				}), o.geometryParts.set(d, i.geometry));
				let f = i.tintable && T && r.season > 0;
				h.has(i.material) || h.set(i.material, h.size);
				let p = `vegetation:${l.serial}:${m.get(n.variant)}:${h.get(i.material)}:${f ? `s${r.season}` : "plain"}`;
				o.materialOutputs.has(p) || (l.outputs.has(p) || l.outputs.set(p, Object.freeze(f ? k(i.material, n.variant, n.species, r.season) : { ...i.material })), o.materialOutputs.set(p, l.outputs.get(p)), e.materials.push({
					id: p,
					...L(l.outputs.get(p)),
					assetSource: !0
				}));
				let g = `${t.id}/${a}/${i.role}`;
				s.push({
					id: g,
					parent: t.id,
					label: `${n.species} ${i.role}`,
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
					geometry: d,
					material: p,
					assetPart: {
						placement: t.id,
						index: a,
						matrix: Array.from(n.matrix)
					}
				}), i.shadowLods && o.partExtras.set(g, { shadowLods: i.shadowLods }), _ += i.geometry.indices.length / 3;
			});
		}), o.report.push({
			node: t.id,
			mode: r.scatter ? "scatter" : "tree",
			instances: l.grown.instances.length,
			culled: b,
			season: r.season,
			bare: f,
			triangles: _,
			species: Object.fromEntries(Object.entries(g).map(([e, t]) => [e, {
				instances: t.instances,
				levels: Array.from(t.levels, (e) => e ?? 0)
			}]))
		});
	}
	if (e.nodes.length + s.length > t.maxNodes) throw l("vegetation.scatter.density", `${s.length} generated part nodes`, `a density that keeps authored plus generated nodes (${e.nodes.length} authored) within maxNodes ${t.maxNodes}; lower it or cull far trees with cullDistance`);
	return e.nodes.push(...s), E(r, o);
}
export { u as VEGETATION_LIMITS, R as expandVegetation, D as normalizeVegetation, T as normalizeWind, P as scatterOptionsFor, O as seasonLeafColor };
