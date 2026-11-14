/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { t as e } from "./rolldown-runtime-CvuOiBwx.js";
import { t } from "./field-error-BpFTmyMO.js";
import { h as n } from "./mat4-BCZClxna.js";
import { t as r } from "./agent-drive-schema-Bd2Wmwiu.js";
import { r as i } from "./material-texture-kit-DIh3eyE-.js";
import { n as a } from "./material-graph-DN1JJGAL.js";
// src/texture-sequence-limits.js
var o = Object.freeze({
	maxFrames: 64,
	maxFps: 60,
	maxSide: 1024,
	maxDecodedBytes: 67108864
});
Object.freeze({
	field: "material.map = { sequence: { frames: [catalog image asset IDs], fps, loop } }",
	covers: "color map (map) of surface-tag materials; needs UVs (grid, box and similar); not combined with pattern",
	frame: "floor(motionTime * fps), wrapped when loop is true (default) and held on the last frame when false; frame 0 before any motion time",
	clock: "motionTime, also in render jobs (settings.motion.start + elapsed)",
	images: "PNG, JPEG or WebP files in the --assets folder, listed by scene_asset_catalog with kind image; opaque pixels, one size for all frames",
	...o
});
// src/agent-texture-sequence.js
var s = /^[a-f0-9]{64}$/, c = ["sequence"], l = [
	"frames",
	"fps",
	"loop"
];
function u(e, n, r) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw t(r, e, "an object, such as {}", TypeError);
	for (let i of Object.keys(e)) if (!n.includes(i)) throw t(`${r}.${i}`, e[i], `no such field; use one of ${n.join(", ")}`, TypeError);
}
function d(e) {
	if (u(e, c, "map"), e.sequence === void 0) throw t("map.sequence", e.sequence, "a sequence, such as { \"frames\": [<asset id>, <asset id>], \"fps\": 12 }", TypeError);
	let n = e.sequence;
	u(n, l, "map.sequence");
	let { frames: r, fps: i, loop: a = !0 } = n;
	if (!Array.isArray(r) || r.length < 2 || r.length > o.maxFrames) throw t("map.sequence.frames", Array.isArray(r) ? `${r.length} frames` : r, `a list of 2 to ${o.maxFrames} catalog image asset IDs, such as [<asset id>, <asset id>]`);
	if (r.forEach((e, n) => {
		if (typeof e != "string" || !s.test(e.toLowerCase())) throw t(`map.sequence.frames[${n}]`, e, "the 64 hexadecimal characters of a catalog image asset ID; scene_asset_catalog lists them", TypeError);
	}), !Number.isFinite(i) || i <= 0 || i > o.maxFps) throw t("map.sequence.fps", i, `a number above 0 and at most ${o.maxFps}, such as 12`);
	if (typeof a != "boolean") throw t("map.sequence.loop", a, "true or false", TypeError);
	return { sequence: {
		frames: r.map((e) => e.toLowerCase()),
		fps: i,
		loop: a
	} };
}
function f(e, t) {
	let n = e.frames.length, r = Math.floor(Math.max(0, t ?? 0) * e.fps + 1e-9);
	return e.loop ? r % n : Math.min(r, n - 1);
}
function p(e) {
	let t = /* @__PURE__ */ new Set(), n = (e, r) => {
		if (!e || typeof e != "object" || r > 8) return;
		if (Array.isArray(e)) {
			for (let t of e) n(t, r + 1);
			return;
		}
		if (e.type === "graph" && e.graph) for (let n of a(e.graph)) s.test(n.toLowerCase()) && t.add(n.toLowerCase());
		let i = e.map?.sequence?.frames;
		if (Array.isArray(i)) for (let e of i) typeof e == "string" && s.test(e.toLowerCase()) && t.add(e.toLowerCase());
		for (let t of Object.values(e)) n(t, r + 1);
	};
	return n(e, 0), [...t];
}
function m(e, n) {
	if (n.tag !== "surface") throw t("map", e.map, "a material with the surface tag; remove map or use the surface tag");
	if (e.pattern !== void 0) throw t("pattern", e.pattern, "nothing, because a material takes a pattern or a map sequence, not both", TypeError);
	n.map = d(e.map), e.color === void 0 && (n.color = [
		1,
		1,
		1
	]);
}
function h(e, n, r) {
	let { frames: a, fps: o, loop: s } = n.sequence, c = a.map((t) => {
		let n = r?.get(t);
		if (!n) throw Error(`Material ${e}: image ${t.slice(0, 12)} was not loaded. The host decodes catalog images before createAgentScene or apply.`);
		return n;
	}), { width: l, height: u } = c[0];
	if (c.some((e) => e.width !== l || e.height !== u)) throw t("map.sequence.frames", `frames of different sizes in material ${e}`, `frames that all measure ${l}x${u}; resize the images in the catalog`);
	let d = c.map((e) => i(e.data, e.width, e.height)), p = {
		image: d[0],
		colorSpace: "srgb"
	}, m = {
		frames: a,
		fps: o,
		loop: s
	}, h = 0;
	return {
		descriptor: p,
		seek(e) {
			return h = f(m, e), h;
		},
		get index() {
			return h;
		},
		get image() {
			return d[h];
		},
		describe() {
			return {
				material: e,
				frames: a.length,
				fps: o,
				loop: s,
				index: h,
				frame: a[h],
				size: [l, u]
			};
		}
	};
}
// src/agent-scene-assets.js
var g = /* @__PURE__ */ e({
	ASSET_PLACEMENT_LIMITS: () => _,
	applyMapSequence: () => m,
	assetCopyKey: () => P,
	clipTimeAt: () => B,
	createTextureSequence: () => h,
	describeAssetPlacements: () => H,
	expandAssetPlacements: () => R,
	jsonMaterial: () => F,
	materialOutput: () => L,
	normalizeAssetPlacement: () => j,
	normalizeMapSequence: () => d,
	recipeAssetNeeds: () => N,
	registerCrowdModule: () => y,
	sequenceFrameIds: () => p,
	sequenceFrameIndex: () => f,
	stageAssetClips: () => V
}), _ = Object.freeze({
	maxPlacements: 512,
	maxAssets: 16,
	maxAnimatedPlacements: 16,
	maxOverrides: 32
}), v = null;
function y(e) {
	v = e;
}
function b() {
	if (!v) throw Error("This recipe places a crowd, which loads on demand: await loadAgentSceneModules(recipe) before createAgentScene or apply.");
	return v;
}
var x = /^[a-f0-9]{64}$/, S = [
	"id",
	"materials",
	"clip",
	"drive",
	"crowd"
], C = [
	"index",
	"start",
	"speed",
	"loop"
], w = ["color", "emissiveColor"], T = [
	"metallic",
	"roughness",
	"opacity"
], E = [
	"name",
	"tag",
	...w,
	...T,
	"emission"
], D = [
	"surface",
	"foliage",
	"grass"
];
function O(e, n, r) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw t(r, e, "an object, such as {}", TypeError);
	for (let i of Object.keys(e)) if (!n.includes(i)) throw t(`${r}.${i}`, e[i], `no such field; use one of ${n.join(", ")}`, TypeError);
}
function k(e, n) {
	if (!Array.isArray(e) || e.length !== 3 || e.some((e) => !Number.isFinite(e) || e < 0)) throw t(n, e, "an array of 3 linear RGB numbers of 0 or more, such as [0.5, 0.2, 0.1]");
	return [...e];
}
function A(e, n) {
	let r = `asset.materials[${n}]`;
	if (O(e, E, r), typeof e.name != "string" || !e.name || e.name.length > 256) throw t(`${r}.name`, e.name, "the name of a source material, such as \"paint\"; scene_inspect lists the names under assets", TypeError);
	let i = { name: e.name };
	if (e.tag !== void 0) {
		if (!D.includes(e.tag)) throw t(`${r}.tag`, e.tag, `one of ${D.join(", ")}`);
		i.tag = e.tag;
	}
	for (let t of w) e[t] !== void 0 && (i[t] = k(e[t], `${r}.${t}`));
	for (let n of T) if (e[n] !== void 0) {
		if (!Number.isFinite(e[n]) || e[n] < 0 || e[n] > 1) throw t(`${r}.${n}`, e[n], "a number from 0 to 1, such as 0.5");
		i[n] = e[n];
	}
	if (e.emission !== void 0) {
		if (!Number.isFinite(e.emission) || e.emission < 0) throw t(`${r}.emission`, e.emission, "a number of 0 or more, such as 1");
		i.emission = e.emission;
	}
	return i;
}
function j(e) {
	if (O(e, S, "asset"), typeof e.id != "string" || !x.test(e.id.toLowerCase())) throw t("asset.id", e.id, "64 hexadecimal characters, such as \"ab12...\" (a catalog asset id that asset_catalog lists)", TypeError);
	let n = { id: e.id.toLowerCase() };
	if (e.materials !== void 0) {
		if (!Array.isArray(e.materials) || e.materials.length > _.maxOverrides) throw t("asset.materials", Array.isArray(e.materials) ? `${e.materials.length} overrides` : e.materials, `a list of at most ${_.maxOverrides} overrides, such as [{ "name": "paint", "color": [1, 0, 0] }]`);
		let r = e.materials.map((e, t) => A(e, t));
		if (new Set(r.map((e) => e.name)).size !== r.length) throw t("asset.materials", `${r.length} overrides`, "overrides that each name a different source material, such as one override per name");
		n.materials = r;
	}
	if (e.clip !== void 0) {
		O(e.clip, C, "asset.clip");
		let { index: r, start: i = 0, speed: a = 1, loop: o = !0 } = e.clip;
		if (!Number.isInteger(r) || r < 0) throw t("asset.clip.index", r, "a whole number of 0 or more, such as 0");
		if (!Number.isFinite(i) || i < 0 || i > 3600) throw t("asset.clip.start", i, "seconds from 0 to 3600, such as 0");
		if (!Number.isFinite(a) || a <= 0 || a > 16) throw t("asset.clip.speed", a, "a number above 0 and at most 16, such as 1");
		if (typeof o != "boolean") throw t("asset.clip.loop", o, "true or false", TypeError);
		n.clip = {
			index: r,
			start: i,
			speed: a,
			loop: o
		};
	}
	if (e.crowd !== void 0) {
		if (e.clip !== void 0 || e.drive !== void 0) throw t("asset.crowd", e.crowd, "only one of clip, drive or crowd; drop the others, such as keeping just the crowd", TypeError);
		n.crowd = b().normalizeCrowd(e.crowd);
	}
	if (e.drive !== void 0) {
		if (e.clip !== void 0) throw t("asset.drive", e.drive, "a drive or a clip, not both; drop one, such as keeping just the drive", TypeError);
		if (n.drive = r(e.drive, "asset.drive"), n.drive.lights?.tailLights) throw t("asset.drive.lights.tailLights", e.drive.lights.tailLights, "no tail lights on a placed asset, since placed assets share their materials; tail lights glow only in an asset recipe (motion.drive), such as motion.drive.lights.tailLights");
	}
	return n;
}
function M(e, t, n = 0) {
	if (!e || typeof e != "object" || n > 8) return;
	if (Array.isArray(e)) {
		for (let r of e) M(r, t, n + 1);
		return;
	}
	let r = e.asset;
	r && typeof r == "object" && typeof r.id == "string" && x.test(r.id.toLowerCase()) && t.push(r);
	for (let [r, i] of Object.entries(e)) r !== "asset" && M(i, t, n + 1);
}
function N(e) {
	let t = [];
	M(e, t);
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.id.toLowerCase(), r = n.get(t) ?? {
			id: t,
			copies: 1
		};
		(e.clip || e.drive || e.crowd) && r.copies++, n.set(t, r);
	}
	return [...n.values()];
}
function P(e, t) {
	return `${e}:${t}`;
}
function F(e) {
	let t = {};
	for (let [n, r] of Object.entries(e)) typeof r == "number" || typeof r == "string" || typeof r == "boolean" ? t[n] = r : Array.isArray(r) && r.every((e) => typeof e == "number") && (t[n] = [...r]);
	return t;
}
function I(e) {
	let t = {};
	e?.tag !== void 0 && (t.tag = e.tag);
	for (let n of [
		...w,
		...T,
		"emission"
	]) e?.[n] !== void 0 && (t[n] = e[n]);
	return t;
}
function L(e, t) {
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) n[e] = Array.isArray(r) ? Object.freeze([...r]) : r;
	return t.emission !== void 0 && t.emission > 0 && !n.emissiveColor?.some((e) => e > 0) && (n.emissiveColor = Object.freeze([
		1,
		1,
		1
	])), Object.freeze(n);
}
function R(e, n, r, i = /* @__PURE__ */ new Map(), a = null) {
	let o = e.nodes.filter((e) => e.asset), s = {
		placements: [],
		geometryParts: /* @__PURE__ */ new Map(),
		materialOutputs: /* @__PURE__ */ new Map(),
		partExtras: /* @__PURE__ */ new Map(),
		animators: []
	};
	if (!o.length) return s;
	if (!n) throw Error("This recipe places catalog assets, which a host loads and decodes first. Pass them as the assets option of createAgentScene; MCP does this for scene_create.");
	let c = new Set(o.map((e) => e.asset.id)), l = o.filter((e) => e.asset.clip || e.asset.drive || e.asset.crowd);
	if (o.length > _.maxPlacements || c.size > _.maxAssets || l.length > _.maxAnimatedPlacements) throw RangeError(`A scene places at most ${_.maxPlacements} assets, ${_.maxAssets} different ones, ${_.maxAnimatedPlacements} of them playing a clip; this recipe places ${o.length}, ${c.size} and ${l.length}.`);
	let u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Map(), p = [];
	for (let c of o) {
		let { id: o, materials: l = [], clip: m, drive: h, crowd: g } = c.asset, _ = 0;
		(m || h || g) && (_ = (u.get(o) ?? 0) + 1, u.set(o, _));
		let v = n.get(P(o, _));
		if (!v) throw Error(`Asset ${o.slice(0, 12)} copy ${_} is not loaded. The host loads it before createAgentScene or apply.`);
		if (m && !v.animations[m.index]) throw t(`nodes[${e.nodes.indexOf(c)}].asset.clip.index`, m.index, `a clip index from 0 to ${v.animations.length - 1}, since asset ${o.slice(0, 12)} has ${v.animations.length} clips; scene_inspect lists them under assets`);
		if (g) {
			let t = b().expandCrowd(e, c, v, _, i, s, r);
			p.push(...t.nodes), s.placements.push(t.record), s.animators.push(t.record);
			continue;
		}
		let y = new Set(v.parts.map((e) => e.material.name).filter(Boolean));
		for (let n of l) if (!y.has(n.name)) throw t(`nodes[${e.nodes.indexOf(c)}].asset.materials[${l.indexOf(n)}].name`, n.name, `one of ${[...y].slice(0, 16).map((e) => JSON.stringify(e)).join(", ") || "none, since the asset materials are unnamed"}`);
		let x = new Map(l.map((e) => [e.name, e])), S = /* @__PURE__ */ new Map(), C = [];
		v.parts.forEach((t, n) => {
			let r = `asset:${o.slice(0, 12)}:${_}:${n}`;
			d.has(r) || (d.add(r), e.geometries.push({
				id: r,
				type: "asset",
				assetId: o,
				copy: _,
				part: n
			}), s.geometryParts.set(r, t.geometry)), S.has(t.material) || S.set(t.material, S.size);
			let a = I(x.get(t.material.name)), l = `asset:${o.slice(0, 12)}:${_}:${S.get(t.material)}:${JSON.stringify(a)}`;
			f.has(l) || (f.set(l, l), e.materials.push({
				id: l,
				...F(t.material),
				...a,
				assetSource: !0
			}), i.get(l)?.source !== t.material && i.set(l, {
				source: t.material,
				output: L(t.material, a)
			}), s.materialOutputs.set(l, i.get(l).output));
			let u = `${c.id}/${n}`;
			C.push(u), p.push({
				id: u,
				parent: c.id,
				label: String(t.name ?? u).slice(0, 256),
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
				geometry: r,
				material: l,
				assetPart: {
					placement: c.id,
					index: n,
					matrix: Array.from(t.matrix)
				}
			}), s.partExtras.set(u, {
				...t.skin ? { skin: t.skin } : {},
				...t.morph ? { morph: t.morph } : {},
				...t.castShadow === void 0 ? {} : { castShadow: t.castShadow }
			});
		});
		let w = {
			node: c.id,
			assetId: o,
			copy: _,
			asset: v,
			partNodeIds: C,
			clip: m ?? null,
			drive: h ? z(c.id, `nodes[${e.nodes.indexOf(c)}].asset.drive`, a, v, h) : null,
			drivePose: null
		};
		s.placements.push(w), (m || h) && s.animators.push(w);
	}
	if (e.nodes.length + p.length > r.maxNodes) throw RangeError(`Placed assets expand to ${p.length} part nodes, which with the ${e.nodes.length} authored nodes exceeds maxNodes ${r.maxNodes}. Place fewer copies or simpler assets.`);
	return e.nodes.push(...p), s;
}
function z(e, t, n, r, i) {
	if (!n) throw Error("This recipe drives a placed asset, which needs the drive code: await loadAgentSceneModules(recipe) before createAgentScene or apply.");
	try {
		return n(r, i, { fieldPath: t });
	} catch (t) {
		throw typeof t?.fieldPath != "string" && (t.message = `Node ${e} drive: ${t.message}`), t;
	}
}
function B(e, t, n) {
	let r = Math.max(0, ((n ?? 0) - e.start) * e.speed);
	return t <= 0 ? 0 : e.loop ? r % t : Math.min(r, t);
}
function V(e, t, r) {
	let i = [], a = /* @__PURE__ */ new Map();
	try {
		for (let o of e.animators) {
			let e;
			if (o.crowd) {
				i.push(o.crowd.stage(r ?? 0));
				continue;
			}
			if (o.drive) {
				let t = o.drive.sample(r ?? 0);
				o.drivePose = t.pose, e = o.asset.stagePose({ nodeOverrides: t.nodeOverrides });
			} else {
				let t = o.asset.animations[o.clip.index].duration;
				e = o.asset.stagePose({
					animation: {
						clip: o.clip.index,
						time: B(o.clip, t, r)
					},
					nodeOverrides: []
				});
			}
			i.push(e);
			let s = t.getNode(o.node).worldMatrix;
			o.partNodeIds.forEach((t, r) => {
				a.set(t, n(/* @__PURE__ */ new Float32Array(16), s, e.parts[r].matrix));
			});
		}
	} catch (e) {
		for (let e of i) e.discard();
		throw e;
	}
	return {
		matrices: a,
		commit() {
			for (let e of i) e.commit();
		}
	};
}
function H(e, t, n) {
	return e.placements.map((e) => {
		if (e.crowd) return e.crowd.describe();
		let r = [
			Infinity,
			Infinity,
			Infinity
		], i = [
			-Infinity,
			-Infinity,
			-Infinity
		];
		for (let a of e.partNodeIds) {
			let e = t.getNode(a), o = n(e.geometry);
			for (let t = 0; t < 8; t++) {
				let n = [
					0,
					1,
					2
				].map((e) => t & 1 << e ? o.max[e] : o.min[e]);
				for (let t = 0; t < 3; t++) {
					let a = e.worldMatrix[t] * n[0] + e.worldMatrix[4 + t] * n[1] + e.worldMatrix[8 + t] * n[2] + e.worldMatrix[12 + t];
					r[t] = Math.min(r[t], a), i[t] = Math.max(i[t], a);
				}
			}
		}
		return {
			node: e.node,
			assetId: e.assetId,
			parts: e.partNodeIds.length,
			bounds: {
				min: r,
				max: i
			},
			clips: e.asset.animations.map((e, t) => ({
				index: t,
				name: e.name ?? `clip ${t}`,
				duration: e.duration
			})),
			materials: [...new Set(e.asset.parts.map((e) => e.material.name).filter(Boolean))],
			...e.clip ? { playing: e.clip } : {},
			...e.drive ? { drive: e.drive.describe(e.drivePose ?? void 0) } : {}
		};
	});
}
export { N as a, L as i, P as n, y as o, F as r, o as s, g as t };
