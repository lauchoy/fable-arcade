/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { g as e, h as t, m as n, n as r, o as i, p as a, r as o, t as s } from "./mat4-BCZClxna.js";
import { r as c, t as l } from "./mat3-BUCH0Dej.js";
import { a as u, c as d, i as f, n as p, o as m, r as h, s as ee, t as g } from "./geometry-C1ukZMAo.js";
import { t as _ } from "./scene-graph-D7m1CRQ0.js";
import { n as v, t as y } from "./field-error-BpFTmyMO.js";
import { n as te, s as ne, t as re } from "./camera-DqWdI22s.js";
import { a as b, i as x, n as S, s as ie, t as ae } from "./material-wear-BnrzUuEN.js";
import { n as C } from "./volumetric-D8WftbY1.js";
import { a as oe } from "./local-volumes-DW4FCqaw.js";
import { n as w, t as T } from "./liquid-optics-DJcQhRHD.js";
import { r as se } from "./environment-DsFt4psZ.js";
import { _ as E, c as D, g as O, h as k, l as A, n as j, s as M, t as N } from "./agent-scene-capabilities-BaawWMO1.js";
import { a as P, n as ce, o as le, r as ue, s as F, t as de } from "./look-catalog-BW-KqP3u.js";
import { a as fe, s as pe } from "./shader-registry-DHYkwAg5.js";
import { n as me, t as he } from "./view-transform-names-CDWKtFlr.js";
import { r as ge, s as _e } from "./material-layers-C6j9cFSS.js";
import { r as ve } from "./closed-room-CB0A9B5C.js";
import { t as ye } from "./depth-layer-Czrj5Xb7.js";
import { c as be, d as xe, f as Se, l as Ce, n as we, o as Te, p as Ee, r as De, s as Oe, t as ke, u as Ae } from "./rig-DvXCM9gw.js";
// src/lighting-setups.js
var je = 128, Me = 64, Ne = Object.freeze({
	daylight: Object.freeze({
		sky: {
			zenith: [
				.28,
				.46,
				.95
			],
			horizon: [
				.95,
				1,
				1.05
			],
			ground: [
				.32,
				.29,
				.25
			]
		},
		panels: [],
		fields: {
			lightDirection: [
				-3,
				6,
				4
			],
			keyColor: [
				3,
				2.8,
				2.5
			],
			keyIntensity: 1,
			fillIntensity: 0,
			ambientIntensity: 1,
			skyTop: [
				.2,
				.38,
				.52
			],
			skyBottom: [
				.62,
				.7,
				.67
			]
		}
	}),
	overcast: Object.freeze({
		sky: {
			zenith: [
				.85,
				.88,
				.92
			],
			horizon: [
				.6,
				.62,
				.65
			],
			ground: [
				.28,
				.28,
				.28
			]
		},
		panels: [],
		fields: {
			lightDirection: [
				-1,
				6,
				2
			],
			keyColor: [
				.9,
				.9,
				.92
			],
			keyIntensity: 1,
			fillIntensity: 0,
			ambientIntensity: 1,
			skyTop: [
				.6,
				.62,
				.66
			],
			skyBottom: [
				.55,
				.57,
				.6
			]
		}
	}),
	sunset: Object.freeze({
		sky: {
			zenith: [
				.12,
				.18,
				.42
			],
			horizon: [
				1.7,
				.75,
				.32
			],
			ground: [
				.22,
				.13,
				.1
			]
		},
		panels: [{
			direction: [
				-6,
				1.5,
				3
			],
			radius: .35,
			color: [
				6,
				2.6,
				.9
			]
		}],
		fields: {
			lightDirection: [
				-6,
				1.5,
				3
			],
			keyColor: [
				3.4,
				1.8,
				.85
			],
			keyIntensity: 1,
			fillIntensity: 0,
			ambientIntensity: 1,
			skyTop: [
				.1,
				.16,
				.38
			],
			skyBottom: [
				.9,
				.45,
				.25
			]
		}
	}),
	studio: Object.freeze({
		sky: {
			zenith: [
				.5,
				.5,
				.5
			],
			horizon: [
				.3,
				.3,
				.31
			],
			ground: [
				.22,
				.22,
				.22
			]
		},
		panels: [
			{
				direction: [
					-3,
					6,
					4
				],
				radius: .7,
				color: [
					5,
					4.9,
					4.7
				]
			},
			{
				direction: [
					0,
					1,
					0
				],
				radius: .8,
				color: [
					3,
					3,
					3.1
				]
			},
			{
				direction: [
					4,
					1.5,
					-3
				],
				radius: .5,
				color: [
					1.8,
					2,
					2.4
				]
			}
		],
		fields: {
			lightDirection: [
				-3,
				6,
				4
			],
			keyColor: [
				2.4,
				2.3,
				2.2
			],
			keyIntensity: 1,
			fillIntensity: 0,
			ambientIntensity: 1,
			skyTop: [
				.45,
				.45,
				.46
			],
			skyBottom: [
				.3,
				.3,
				.32
			]
		}
	})
}), Pe = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), Fe = 16;
function Ie(e) {
	if (!A.includes(e)) throw RangeError(`Unknown lighting setup: ${String(e)}. Use ${A.join(", ")}.`);
	return Ne[e];
}
function Le(e) {
	return structuredClone(Ie(e).fields);
}
function Re(e) {
	let t = Math.hypot(...e);
	return e.map((e) => e / t);
}
function ze(e, t, n) {
	return e.map((e, r) => e + (t[r] - e) * n);
}
function Be(e, t) {
	return t >= 0 ? ze(e.horizon, e.zenith, Math.sqrt(t)) : ze(e.horizon, e.ground, Math.min(1, (-t) ** .4 * 1.4));
}
function Ve(e, t) {
	let n = Re(e.direction), r = n[0] * t[0] + n[1] * t[1] + n[2] * t[2], i = Math.cos(e.radius), a = Math.cos(e.radius * 1.6), o = Math.min(1, Math.max(0, (r - a) / (i - a)));
	return o * o * (3 - 2 * o);
}
function He(e) {
	let t = /* @__PURE__ */ new Float32Array(24576);
	for (let n = 0; n < Me; n++) {
		let r = (n + .5) / Me * Math.PI;
		for (let i = 0; i < je; i++) {
			let a = ((i + .5) / je - .5) * 2 * Math.PI, o = [
				Math.sin(r) * Math.sin(a),
				Math.cos(r),
				-Math.sin(r) * Math.cos(a)
			], s = Be(e.sky, o[1]);
			for (let t of e.panels) {
				let e = Ve(t, o);
				for (let n = 0; n < 3; n++) s[n] += t.color[n] * e;
			}
			t.set(s, (n * je + i) * 3);
		}
	}
	return t;
}
function Ue(e, { intensity: t = 1, rotation: n = 0, showBackground: r = !1 } = {}) {
	let i = Ie(e), a = [
		e,
		t,
		n,
		r
	].join("|");
	if (I.has(a)) return I.get(a);
	Pe.has(e) || Pe.set(e, He(i)), I.size >= Fe && I.clear();
	let o = se({
		width: je,
		height: Me,
		data: Pe.get(e),
		intensity: t,
		rotation: n,
		showBackground: r
	});
	return I.set(a, o), o;
}
function We(e, { intensity: t = 1, rotation: n = 0, showBackground: r = !1 } = {}) {
	let i = [
		"catalog",
		e,
		P(),
		t,
		n,
		r
	].join("|");
	return I.has(i) || (I.size >= Fe && I.clear(), I.set(i, se({
		...ue(e),
		intensity: t,
		rotation: n,
		showBackground: r
	}))), I.get(i);
}
// src/agent-look.js
var Ge = 16, Ke = /* @__PURE__ */ "world.ground.setup.hdri.environmentIntensity.environmentRotation.lightDirection.keyColor.keyIntensity.fillIntensity.ambientIntensity.daylight.pointLights.spotLights.areaLights.skyTop.skyBottom.fogColor.fogDensity.volumeFog.localVolumes.liquid.shadowCascades.keyAffects.objectReflections.floorSkyTrace.sunBounce.specularAntiAliasing.sunAngularRadius.lines.resolveCoplanar.viewTransform.look.wind.sky".split("."), qe = [
	"exposure",
	"saturation",
	"contrast",
	"temperature",
	"vignette",
	"grain",
	"ambientOcclusion",
	"ambientOcclusionRadius",
	"bloom",
	"depthOfField",
	"motionBlur"
], Je = [
	"target",
	"extent",
	"distance",
	"near",
	"far"
], Ye = [
	"position",
	"color",
	"intensity",
	"radius",
	"range",
	"castShadow",
	"affects"
], Xe = [
	"position",
	"direction",
	"angle",
	"penumbra",
	"color",
	"intensity",
	"radius",
	"range",
	"castShadow",
	"ies",
	"affects"
], Ze = [
	"position",
	"direction",
	"up",
	"width",
	"height",
	"color",
	"intensity",
	"castShadow",
	"ies",
	"affects"
], Qe = [
	"minimum",
	"maximum",
	"color",
	"ambient",
	"drift"
], $e = [
	"density",
	"steps",
	"anisotropy",
	"noiseAmount",
	"noiseScale",
	"maxDistance",
	"shadowAmbient",
	"heightFalloff",
	"detailOctaves",
	"detailAmount",
	"warp",
	"contrast",
	"profileSoftness",
	"keyScattering",
	"scatterOctaves",
	"multiScatter",
	"multiExtinction",
	"multiAnisotropy",
	"keyTransmittance",
	"surfaceTransmittance"
], et = Object.freeze([...Qe, ...$e]), tt = [
	"strength",
	"threshold",
	"radius"
], nt = ["blur", "focusDistance"], rt = ["shutter", "objects"], it = 4, at = 1024;
function ot(e, t) {
	if (e.affects === void 0) return {};
	let n = e.affects;
	if (!Array.isArray(n) || n.length > at || n.some((e) => typeof e != "string" || e.length < 1 || e.length > 128)) throw TypeError(`${t} affects must be a list of at most ${at} node IDs.`);
	return { affects: [...n] };
}
function st(e) {
	if (!Number.isInteger(e) || e < 0 || e > it) throw RangeError(`environment.shadowCascades must be an integer from 1 to ${it}, or 0 for the single shadow map.`);
	return e;
}
function ct(e) {
	let t = [
		...e.pointLights ?? [],
		...e.spotLights ?? [],
		...e.areaLights ?? []
	];
	return e.keyAffects !== void 0 || t.some((e) => e.affects !== void 0);
}
function lt(e, t) {
	if (!e || typeof e != "object" || Array.isArray(e) || Object.getPrototypeOf(e) !== Object.prototype && Object.getPrototypeOf(e) !== null) throw TypeError(`${t} must be a plain JSON object.`);
}
function L(e, t, n) {
	lt(e, n);
	for (let r of Reflect.ownKeys(e)) if (typeof r != "string" || !t.includes(r)) throw TypeError(`Unknown ${n} field: ${String(r)}.`);
}
function R(e, t = 0, n = /* @__PURE__ */ new Set()) {
	if (t > 32) throw RangeError("Look JSON nesting exceeds 32 levels.");
	if (e === null || typeof e == "boolean" || typeof e == "string") return e;
	if (typeof e == "number") {
		if (!Number.isFinite(e) || !Number.isFinite(Math.fround(e))) throw TypeError("Look JSON numbers must be finite Float32 values.");
		return e;
	}
	if (!e || typeof e != "object" || n.has(e)) throw TypeError("Look must contain acyclic plain JSON data.");
	let r = Array.isArray(e);
	if (r && (Object.getPrototypeOf(e) !== Array.prototype || e.length > Ge)) throw TypeError(`Look JSON arrays must be ordinary arrays with at most ${Ge} entries.`);
	r || lt(e, "Look"), n.add(e);
	let i = r ? [] : {};
	for (let a of Reflect.ownKeys(e)) {
		if (r && a === "length") continue;
		if (typeof a != "string" || a === "__proto__") throw TypeError("Look JSON keys must be ordinary strings.");
		let o = Object.getOwnPropertyDescriptor(e, a);
		if (!o.enumerable || !Object.hasOwn(o, "value")) throw TypeError("Look JSON accessors and hidden fields are unsupported.");
		if (r && a !== String(i.length)) throw TypeError("Look JSON arrays must be dense without extra fields.");
		i[a] = R(o.value, t + 1, n);
	}
	if (r && i.length !== e.length) throw TypeError("Look JSON arrays cannot contain trailing holes.");
	return n.delete(e), i;
}
function ut(e, t) {
	return e <= 1 && t >= 1 ? "1" : String(e > 0 ? e : t);
}
function z(e, t, n, r) {
	if (typeof e != "number" || !Number.isFinite(e) || !Number.isFinite(Math.fround(e)) || e < t || e > n) throw y(r, e, t < -1e30 && n > 1e30 ? "a finite number, such as 0.5" : `a number from ${t} to ${n}, such as ${ut(t, n)}`);
	return e;
}
function B(e, t, n, r) {
	if (!Array.isArray(e) || e.length !== 3) {
		let i = ut(t, n);
		throw y(r, e, `an array of three numbers from ${t} to ${n}, such as [${i}, ${i}, ${i}]`, TypeError);
	}
	return e.map((e, i) => z(e, t, n, `${r}[${i}]`));
}
function V(e, t) {
	return e === void 0 ? t : e;
}
function H(e, t = "lightDirection") {
	let n = B(e, -1e6, 1e6, t), r = Math.hypot(...n);
	if (r < 1e-6) throw y(t, n, "a direction that is not all zero, such as [0, -1, 0]");
	return {
		direction: n,
		unitDirection: n.map((e) => e / r)
	};
}
function dt(e, t, n) {
	let r = V(e, []);
	if (!Array.isArray(r) || r.length > t) throw y(n, Array.isArray(r) ? `${r.length} entries` : r, `an array of at most ${t} lights, such as []`);
	return r;
}
function ft(e) {
	let t = z(V(e.range, 0), 0, 1e6, "range");
	if (t !== 0 && t < .001) throw y("range", t, "0 for unlimited, or at least 0.001, such as 10");
	return t;
}
function pt(e) {
	let t = V(e.castShadow, !1);
	if (typeof t != "boolean") throw y("castShadow", t, "true or false", TypeError);
	return t ? { castShadow: t } : {};
}
function mt(e) {
	return L(e, Ye, "point light"), {
		position: B(e.position, -1e6, 1e6, "position"),
		color: B(V(e.color, [
			1,
			1,
			1
		]), 0, 1, "color"),
		intensity: z(V(e.intensity, 1), 0, 1e5, "intensity"),
		radius: z(V(e.radius, .05), .001, 1e6, "radius"),
		range: ft(e),
		...pt(e),
		...ot(e, "point light")
	};
}
function ht(e) {
	return L(e, Xe, "spot light"), {
		position: B(e.position, -1e6, 1e6, "position"),
		direction: H(e.direction, "direction").direction,
		angle: z(V(e.angle, Math.PI / 4), .01, Math.PI / 2 - .01, "angle"),
		penumbra: z(V(e.penumbra, .15), 0, 1, "penumbra"),
		color: B(V(e.color, [
			1,
			1,
			1
		]), 0, 1, "color"),
		intensity: z(V(e.intensity, 1), 0, 1e5, "intensity"),
		radius: z(V(e.radius, .05), .001, 1e6, "radius"),
		range: ft(e),
		...pt(e),
		...ot(e, "spot light")
	};
}
function gt(e) {
	L(e, Ze, "area light");
	let t = {
		position: B(e.position, -1e6, 1e6, "position"),
		direction: H(e.direction, "direction").direction,
		width: z(e.width, .001, 1e4, "width"),
		height: z(e.height, .001, 1e4, "height"),
		color: B(V(e.color, [
			1,
			1,
			1
		]), 0, 1, "color"),
		intensity: z(V(e.intensity, 1), 0, 1e5, "intensity")
	};
	return e.up !== void 0 && (t.up = H(e.up, "up").direction), {
		...t,
		...ot(e, "area light")
	};
}
function _t(e = {}) {
	L(e, et, "volumeFog");
	for (let t of Qe) Object.hasOwn(e, t) && B(e[t], -1e5, 1e5, `volumeFog.${t}`);
	for (let t of $e) Object.hasOwn(e, t) && z(e[t], -Number.MAX_VALUE, Number.MAX_VALUE, `volumeFog.${t}`);
	return R(C(e));
}
function vt(e = {}) {
	L(e, Ke, "environment");
	let t = V(e.world, !1);
	if (typeof t != "boolean") throw y("environment.world", t, "true or false", TypeError);
	let n = V(e.setup, D);
	if (!A.includes(n)) throw y("environment.setup", n, `one of ${A.join(", ")}`);
	let r = Le(n), i = {
		world: t,
		setup: n,
		environmentIntensity: z(V(e.environmentIntensity, 1), 0, 100, "environment.environmentIntensity"),
		environmentRotation: z(V(e.environmentRotation, 0), -100, 100, "environment.environmentRotation"),
		lightDirection: H(V(e.lightDirection, r.lightDirection), "environment.lightDirection").direction,
		keyColor: B(V(e.keyColor, r.keyColor), 0, 1e3, "environment.keyColor"),
		keyIntensity: z(V(e.keyIntensity, r.keyIntensity), 0, 100, "environment.keyIntensity"),
		fillIntensity: z(V(e.fillIntensity, r.fillIntensity), 0, 100, "environment.fillIntensity"),
		ambientIntensity: z(V(e.ambientIntensity, r.ambientIntensity), 0, 100, "environment.ambientIntensity"),
		daylight: z(V(e.daylight, 1), 0, 100, "environment.daylight"),
		pointLights: dt(e.pointLights, 16, "environment.pointLights").map((e, t) => v(`environment.pointLights[${t}]`, () => mt(e))),
		skyTop: B(V(e.skyTop, r.skyTop), 0, 1, "environment.skyTop"),
		skyBottom: B(V(e.skyBottom, r.skyBottom), 0, 1, "environment.skyBottom"),
		fogColor: B(V(e.fogColor, [
			.35,
			.43,
			.43
		]), 0, 1, "environment.fogColor"),
		fogDensity: e.fogDensity === void 0 || e.fogDensity === null ? null : z(e.fogDensity, 0, 10, "environment.fogDensity"),
		volumeFog: _t(e.volumeFog)
	};
	if (e.ground !== void 0) {
		if (typeof e.ground != "boolean") throw y("environment.ground", e.ground, "true or false", TypeError);
		i.ground = e.ground;
	}
	if (e.objectReflections !== void 0) {
		if (typeof e.objectReflections != "boolean") throw y("environment.objectReflections", e.objectReflections, "true or false", TypeError);
		i.objectReflections = e.objectReflections;
	}
	if (e.floorSkyTrace !== void 0) {
		if (typeof e.floorSkyTrace != "boolean") throw y("environment.floorSkyTrace", e.floorSkyTrace, "true or false", TypeError);
		i.floorSkyTrace = e.floorSkyTrace;
	}
	if (e.sunBounce !== void 0) {
		if (!Number.isFinite(e.sunBounce) || e.sunBounce < 0) throw y("environment.sunBounce", e.sunBounce, "a number of 0 or more, such as 1", TypeError);
		i.sunBounce = e.sunBounce;
	}
	if (e.specularAntiAliasing !== void 0 && (i.specularAntiAliasing = z(e.specularAntiAliasing, 0, 4, "environment.specularAntiAliasing")), e.lines !== void 0 && e.lines !== null && (i.lines = R(O("lineArt").resolveLineArt(e.lines))), e.resolveCoplanar !== void 0) {
		if (e.resolveCoplanar !== "offset" && e.resolveCoplanar !== !1) throw y("environment.resolveCoplanar", e.resolveCoplanar, "'offset' or false", TypeError);
		i.resolveCoplanar = e.resolveCoplanar;
	}
	if (e.spotLights !== void 0 && (i.spotLights = dt(e.spotLights, 8, "environment.spotLights").map((e, t) => v(`environment.spotLights[${t}]`, () => ht(e)))), e.areaLights !== void 0 && (i.areaLights = dt(e.areaLights, 7, "environment.areaLights").map((e, t) => v(`environment.areaLights[${t}]`, () => gt(e)))), e.localVolumes !== void 0 && (i.localVolumes = R(oe(e.localVolumes, "environment.localVolumes"))), e.shadowCascades !== void 0 && (i.shadowCascades = st(e.shadowCascades)), e.wind !== void 0 && e.wind !== null && (i.wind = O("vegetation").normalizeWind(e.wind)), e.hdri !== void 0 && e.hdri !== null) {
		if (typeof e.hdri != "string" || !F(e.hdri)) throw y("environment.hdri", e.hdri, `one of ${ce.join(", ")} or the 64-character ID of a .hdr file in the asset catalog`);
		i.hdri = e.hdri;
	}
	if (e.viewTransform !== void 0) {
		if (!me.includes(e.viewTransform)) throw y("environment.viewTransform", e.viewTransform, `one of ${me.join(", ")}`);
		i.viewTransform = e.viewTransform;
	}
	if (e.look !== void 0 && e.look !== null) {
		if (!he.includes(e.look) && !le(e.look)) throw y("environment.look", e.look, `one of ${[...he, ...de].join(", ")} or the 64-character ID of a .cube file in the asset catalog`);
		i.look = e.look;
	}
	return e.keyAffects !== void 0 && (i.keyAffects = ot({ affects: e.keyAffects }, "environment keyAffects").affects), e.liquid !== void 0 && (L(e.liquid, Object.keys(T), "liquid"), i.liquid = R(w(R(e.liquid)))), e.sky !== void 0 && e.sky !== null && O("physicalSky").applyPhysicalSky(e.sky, i, y), fe.normalize?.(e, i), b(x(), i, { world: t }), i;
}
function yt(e) {
	return e.setup === void 0 ? e : {
		...Le(e.setup),
		...e
	};
}
function bt(e) {
	return e.sky ? O("physicalSky").createPhysicalSkyMap(e) : e.hdri ? We(e.hdri, {
		intensity: e.environmentIntensity,
		rotation: e.environmentRotation,
		showBackground: e.world
	}) : Ue(e.setup, {
		intensity: e.environmentIntensity,
		rotation: e.environmentRotation,
		showBackground: e.world
	});
}
function xt(e = {}) {
	L(e, [...qe, ...pe.fields], "effects");
	let t = {
		bloom: tt,
		depthOfField: nt,
		motionBlur: rt
	};
	for (let n of qe) !(n in t) && Object.hasOwn(e, n) && z(e[n], -Number.MAX_VALUE, Number.MAX_VALUE, `effects.${n}`);
	let n = {};
	for (let [r, i] of Object.entries(t)) {
		n[r] = V(e[r], {}), L(n[r], i, r);
		for (let e of i) Object.hasOwn(n[r], e) && z(n[r][e], -Number.MAX_VALUE, Number.MAX_VALUE, `${r}.${e}`);
	}
	let r = V(e.ambientOcclusion, 0);
	return {
		...ie({
			...e,
			ambientOcclusion: r,
			...n,
			bloom: {
				strength: .12,
				threshold: 1,
				radius: 1,
				...n.bloom
			}
		}),
		exposure: z(V(e.exposure, 1), .01, 16, "exposure"),
		...pe.resolve?.(e)
	};
}
function St(e = {}) {
	L(e, Je, "shadow");
	let t = {
		target: B(V(e.target, [
			0,
			1,
			0
		]), -1e6, 1e6, "shadow target"),
		extent: z(V(e.extent, 3.5), .01, 1e5, "shadow extent"),
		distance: z(V(e.distance, 8), .01, 1e6, "shadow distance"),
		near: z(V(e.near, .1), .001, 1e6, "shadow near"),
		far: z(V(e.far, 15), .001, 1e6, "shadow far")
	};
	if (Math.fround(t.near) >= Math.fround(t.far)) throw RangeError("Shadow needs near < far at Float32 precision.");
	return t;
}
function Ct(i, a) {
	let { unitDirection: s } = H(a), c = i.target.map((e, t) => e + s[t] * i.distance);
	if (!c.every((e) => Number.isFinite(Math.fround(e))) || c.every((e, t) => Math.fround(e) === Math.fround(i.target[t]))) throw RangeError("Shadow eye and target must remain finite and distinguishable at Float32 precision.");
	let l = Math.abs(s[1]) > .99 ? [
		0,
		0,
		1
	] : [
		0,
		1,
		0
	], u = n(r(), c, i.target, l), d = e(r(), -i.extent, i.extent, -i.extent, i.extent, i.near, i.far), f = t(r(), d, u);
	for (let e of [
		u,
		d,
		f
	]) {
		let t = o(e);
		if (!e.every(Number.isFinite) || !Number.isFinite(t) || t === 0) throw RangeError("Shadow view, projection, and combined matrices must remain finite and nonsingular at Float32 precision.");
	}
	return {
		eye: c,
		target: [...i.target],
		up: l,
		extent: i.extent,
		near: i.near,
		far: i.far
	};
}
function wt(e = {}, t = [
	-3,
	6,
	4
]) {
	return Ct(St(R(e)), R(t));
}
function Tt(e = {}) {
	L(e, [
		"environment",
		"effects",
		"shadow"
	], "look");
	let t = R(e), n = vt(t.environment), r = xt(t.effects), i = St(t.shadow);
	return Ct(i, n.lightDirection), {
		environment: n,
		effects: r,
		shadow: i
	};
}
// src/agent-diagnostics.js
var Et = [
	"clearcoat",
	"sheenColor",
	"specular",
	"specularColor",
	"anisotropy",
	"iridescence"
], Dt = ["anisotropy", "iridescence"], Ot = [
	"thickness",
	"attenuationColor",
	"attenuationDistance"
];
function U(e, t, n, r, i) {
	return {
		kind: e,
		severity: t,
		target: n,
		message: r,
		fix: i
	};
}
function kt(e, t) {
	let n = e[t];
	return Array.isArray(n) ? n.some((e) => e !== 0) : typeof n == "number" && n !== 0;
}
function At(e) {
	let t = [], n = e.tag ?? "surface", r = kt(e, "transmission");
	if (n !== "surface" && n !== "liquid") for (let r of Et.filter((t) => kt(e, t))) t.push(U("ignored-material-field", "warning", e.id, `${r} is ignored on a material with tag ${n}.`, `Remove ${r}, or set the material tag to surface with scene_apply set-material.`));
	if (r) for (let n of Dt.filter((t) => kt(e, t))) t.push(U("ignored-material-field", "warning", e.id, `${n} is ignored on a transmitting material.`, `Set transmission to 0 to see ${n}, or remove ${n}.`));
	else for (let n of Ot.filter((t) => kt(e, t))) t.push(U("ignored-material-field", "warning", e.id, `${n} only matters with transmission, and transmission is 0.`, `Set transmission above 0 for glass or gems, or remove ${n}.`));
	return r && (e.alphaMode === "blend" || e.opacity < 1) && t.push(U("transmission-blended", "warning", e.id, "A transmitting material that is also blended does not refract what is behind it.", "Set opacity to 1 and alphaMode to opaque for refraction, or drop transmission and keep the blended look.")), e.pattern && (n === "liquid" || n === "foam" || n === "unlit") && t.push(U("ignored-material-field", "warning", e.id, `pattern is not applied to a material with tag ${n}.`, "Move the pattern to a surface material, or remove it.")), t;
}
function jt(e) {
	let t = e.materials.flatMap(At), n = new Set(e.nodes.map((e) => e.material).filter(Boolean)), r = new Set(e.nodes.map((e) => e.geometry).filter(Boolean));
	for (let r of e.materials.filter((e) => !n.has(e.id))) t.push(U("unused-material", "info", r.id, `Material ${r.id} is used by no node.`, "Assign it to a node with scene_apply set-node, or remove it with remove-material."));
	for (let n of e.geometries.filter((e) => !r.has(e.id))) t.push(U("unused-geometry", "info", n.id, `Geometry ${n.id} is used by no node, so nothing draws it.`, "Add a node that uses it with scene_apply add-node, or remove it with remove-geometry."));
	return t;
}
function Mt(e, t = !1) {
	return t ? U("closed-room-without-bake", "warning", "bake", `${Math.round(e * 100)} percent of rays from the middle of the scene hit a wall, so this is a closed room lit only by its point, spot or area lights. Without a bake the walls bounce light only as one average colour over the whole room: no brighter corner beside a lamp, no colour bleeding off a red wall onto the floor next to it.`, "Add \"bake\": { \"preset\": \"standard\" } (scene_apply set-bake) for bounced light that follows the lamps and the wall colours.") : U("closed-room-without-bake", "warning", "bake", `${Math.round(e * 100)} percent of rays from the middle of the scene hit a wall, so this is a closed room, and without a bake the world's light still reaches it: the room renders lifted and grey, with weak contact shadows.`, "Add \"bake\": { \"preset\": \"standard\" } (scene_apply set-bake). It darkens what the sky cannot see and adds bounced light, halving the indirect-light error of a closed room.");
}
function Nt({ assetId: e, warnings: t = [], skinnedParts: n, jointCount: r, clipCount: i }) {
	let a = t.map((t) => U("unsupported-asset-feature", "warning", e, String(t), "The asset loads without it. Remove the feature from the GLB, or bake it into the base colour texture."));
	return n > 0 && r === 0 && a.push(U("rig-without-joints", "error", e, `${n} meshes are skinned but the asset has no joint nodes, so no pose or ik can move them.`, "Re-export the GLB with its armature, or use an asset that has joints.")), n === 0 && r > 0 && a.push(U("rig-without-skin", "warning", e, `The asset has ${r} joint nodes but no mesh is skinned to them, so moving a joint changes nothing you can see.`, "Move the parent node with set-asset-node instead, or fix the skin binding in the source file.")), i === 0 && a.push(U("asset-without-clips", "info", e, "The asset has no animation clips, so set-animation and the export clip option are unavailable.", "Pose it with motion tracks or ik, or choose an asset that ships clips.")), a;
}
// src/agent-apply-report.js
var Pt = Object.freeze({
	maxEntries: 20,
	maxDiffIds: 8,
	maxText: 48
}), Ft = Object.freeze({
	node: "nodes",
	material: "materials",
	geometry: "geometries"
}), It = Object.freeze({
	"set-environment": "environment",
	"set-effects": "effects",
	"set-shadow": "shadow"
}), Lt = Object.freeze({
	"set-motion": "motion",
	"set-physics": "physics",
	"set-timeline": "timeline",
	"set-cloth": "cloth",
	"set-bake": "bake",
	"set-particles": "particles",
	"set-post-passes": "postPasses",
	"set-armatures": "armatures",
	"set-game": "game"
});
function W(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function G(e, t) {
	if (e === t) return !0;
	if (Array.isArray(e) && Array.isArray(t)) return e.length === t.length && e.every((e, n) => G(e, t[n]));
	if (W(e) && W(t)) {
		let n = Object.keys(e);
		return n.length === Object.keys(t).length && n.every((n) => Object.hasOwn(t, n) && G(e[n], t[n]));
	}
	return !1;
}
function Rt(e, t) {
	return !W(t) || !W(e) ? G(e, t) : Object.keys(t).every((n) => Rt(e[n], t[n]));
}
function zt(e, t) {
	if (!W(t) || !W(e)) return structuredClone(t);
	let n = { ...e };
	for (let r of Object.keys(t)) n[r] = zt(e[r], t[r]);
	return n;
}
function Bt(e, t) {
	return Object.keys(e).filter((e) => !t.includes(e));
}
function Vt(e, t) {
	let n = e.join(", ");
	return n.length > t ? `${n.slice(0, t - 1)}…` : n;
}
function Ht(e) {
	let t = e.id ?? e.geometry;
	if (typeof t == "string") return t;
	for (let t of [
		"node",
		"material",
		"geometry"
	]) if (typeof e[t]?.id == "string") return e[t].id;
	return Object.hasOwn(It, e.type) ? It[e.type] : e.type === "set-camera" ? "camera" : void 0;
}
function Ut(e, t, n) {
	let { type: r } = t, i = /^add-(node|material|geometry)$/.exec(r);
	if (i) {
		let [, n] = i;
		return e[Ft[n]].push(structuredClone(t[n])), { changed: `added ${n}` };
	}
	let a = /^remove-(node|material|geometry)$/.exec(r);
	if (a) {
		let [, n] = a, r = e[Ft[n]], i = r.findIndex((e) => e.id === t.id);
		return i >= 0 && r.splice(i, 1), { changed: `removed ${n}` };
	}
	let o = It[r] ?? (r === "set-camera" ? "camera" : null);
	if (o) {
		let i = r === "set-camera" ? Object.fromEntries(Bt(t, ["type"]).map((e) => [e, t[e]])) : t[o];
		if (Rt(e[o], i)) return { warning: "no change, values already set" };
		let a = Object.keys(i).filter((t) => !Rt(e[o]?.[t], i[t]));
		return e[o] = zt(e[o] ?? {}, i), { changed: Vt(a, n) };
	}
	if (r === "set-node" || r === "set-material") {
		let i = e[r === "set-node" ? "nodes" : "materials"].find((e) => e.id === t.id), a = Bt(t, ["type", "id"]);
		if (!i) return { changed: Vt(a, n) };
		let o = a.filter((e) => !G(i[e], t[e]));
		if (o.length === 0) return { warning: "no change, values already set" };
		for (let e of o) i[e] = structuredClone(t[e]);
		return { changed: Vt(o, n) };
	}
	if (Object.hasOwn(Lt, r)) {
		let n = Lt[r], i = t[n] === null ? void 0 : t[n];
		return G(e[n], i) ? { warning: "no change, section already set" } : (i === void 0 ? delete e[n] : e[n] = structuredClone(i), { changed: t[n] === null ? `cleared ${n}` : `set ${n}` });
	}
	if (r === "bake-motion") return { changed: `baked ${Vt(t.nodes ?? [], n)} to keys` };
	if (r === "edit-mesh") {
		let e = Array.isArray(t.edits) ? t.edits.length : 0;
		return e === 0 && !t.replace ? { warning: "no change, no edits given" } : { changed: `${t.replace ? "replaced the log with" : "appended"} ${e} edit${e === 1 ? "" : "s"}` };
	}
	return { changed: Vt(Bt(t, ["type", "id"]), n) || "applied" };
}
function Wt(e, t, n) {
	let r = new Map(e.map((e) => [e.id, e])), i = new Set(t.map((e) => e.id)), a = t.filter((e) => !r.has(e.id)).map((e) => e.id), o = e.filter((e) => !i.has(e.id)).map((e) => e.id), s = t.filter((e) => r.has(e.id) && !G(r.get(e.id), e)).map((e) => e.id), c = {};
	for (let [e, t] of [
		["added", a],
		["removed", o],
		["changed", s]
	]) t.length > 0 && (c[e] = t.length > n ? [...t.slice(0, n), `+${t.length - n} more`] : t);
	return c;
}
function Gt(e, t, n, r = Pt) {
	let i = structuredClone(e);
	for (let e of Object.values(Ft)) i[e] ??= [];
	let a = n.map((e, t) => {
		let n = Ut(i, e, r.maxText), a = Ht(e);
		return {
			i: t,
			op: e.type,
			...a === void 0 ? {} : { target: a },
			...n
		};
	}), o = a.slice(r.maxEntries), s = o.filter((e) => e.warning).length, c = {};
	for (let n of Object.values(Ft)) {
		let i = Wt(e[n] ?? [], t[n] ?? [], r.maxDiffIds);
		Object.keys(i).length > 0 && (c[n] = i);
	}
	return {
		results: a.slice(0, r.maxEntries),
		...o.length > 0 ? { omittedResults: o.length } : {},
		...s > 0 ? { omittedWarnings: s } : {},
		diff: c
	};
}
// src/agent-scene.js
var Kt = 4, qt = j, Jt = 16, Yt = 4, Xt = 25e4, Zt = Object.freeze({
	definitions: null,
	chain: Object.freeze([])
}), Qt = Object.freeze({
	eye: [
		4,
		3,
		5
	],
	target: [
		0,
		0,
		0
	],
	up: [
		0,
		1,
		0
	],
	fov: 45,
	near: .1,
	far: 1e3
}), $t = [
	"visible",
	"castShadow",
	"receiveShadow",
	"holdout",
	"shadowCatcher"
], en = $t.slice(1), tn = [
	"translation",
	"rotation",
	"scale",
	"parent",
	"label",
	"geometry",
	"material",
	"skin",
	"relations",
	"asset",
	"vegetation",
	"decal",
	"depthLayer",
	"blend",
	...$t
], nn = [
	"color",
	"metallic",
	"roughness",
	"emission",
	"emissiveColor",
	"opacity",
	"alphaMode",
	"doubleSided",
	"pattern",
	"map",
	"subsurface",
	"snippet",
	"waterPreset",
	"absorption",
	"turbidity",
	"aov",
	"wear",
	...ge
], rn = [
	"map",
	"normalMap",
	"metallicRoughnessMap",
	"emissiveMap",
	"layerMaps",
	"transmissionMap",
	"aovMap",
	"boxMapScale",
	"boxMapAxis"
], an = [...Object.keys(Qt), ...re], on = Object.freeze({
	"set-environment": "environment",
	"set-effects": "effects",
	"set-shadow": "shadow"
}), sn = Object.freeze({
	"add-geometry": ["geometries", "geometry"],
	"add-material": ["materials", "material"],
	"add-node": ["nodes", "node"]
}), cn = Object.freeze({
	"remove-geometry": "geometries",
	"remove-material": "materials"
});
function K(e, t, n) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw y(n, e, "an object, such as {}", TypeError);
	for (let r of Object.keys(e)) if (!t.includes(r)) throw y(`${n}.${r}`, e[r], `one of the fields ${t.join(", ")}; remove ${r}`, TypeError);
}
function ln(e) {
	K(e, Object.keys(qt), "limits");
	let t = {
		...qt,
		...e
	};
	for (let [e, n] of Object.entries(t)) if (!Number.isSafeInteger(n) || n <= 0) throw y(`limits.${e}`, n, "a positive whole number, such as 1024");
	if (t.maxNodes > 4096) throw RangeError("maxNodes cannot exceed 4096.");
	return Object.freeze(t);
}
function un(e, t) {
	let n = 0, r = /* @__PURE__ */ new Set(), i = new TextEncoder();
	function a(e) {
		if (n += e, n > t) throw RangeError("JSON exceeds maxRecipeBytes. Reduce the input.");
	}
	function o(e, n) {
		if (n > 64) throw RangeError("JSON nesting exceeds 64 levels.");
		if (e === null || typeof e == "boolean") return a(e === null ? 4 : String(e).length), e;
		if (typeof e == "number" && Number.isFinite(e)) return a(String(e).length), e;
		if (typeof e == "string") {
			if (e.length > t) throw RangeError("JSON exceeds maxRecipeBytes.");
			return a(i.encode(JSON.stringify(e)).length), e;
		}
		if (!e || typeof e != "object" || r.has(e)) throw TypeError("Recipe must contain finite, acyclic JSON data.");
		let s = Array.isArray(e);
		if (s && e.length > t) throw RangeError("JSON exceeds maxRecipeBytes.");
		if (!s && Object.getPrototypeOf(e) !== Object.prototype && Object.getPrototypeOf(e) !== null) throw TypeError("Recipe objects must be plain JSON objects.");
		r.add(e), a(2);
		let c = s ? [] : {}, l = Reflect.ownKeys(e);
		for (let t of l) {
			if (s && t === "length") continue;
			if (typeof t != "string" || t === "__proto__") throw TypeError("Invalid JSON key.");
			let r = Object.getOwnPropertyDescriptor(e, t);
			if (!r.enumerable || !Object.hasOwn(r, "value")) throw TypeError("JSON accessors and hidden fields are unsupported.");
			if (s && t !== String(c.length)) throw TypeError("JSON arrays must be dense without extra fields.");
			a(s ? 1 : i.encode(JSON.stringify(t)).length + 2), c[t] = o(r.value, n + 1);
		}
		if (s && c.length !== e.length) throw TypeError("JSON arrays must be dense without trailing holes.");
		return r.delete(e), c;
	}
	let s = o(e, 0);
	if (i.encode(JSON.stringify(s)).length > t) throw RangeError("JSON exceeds maxRecipeBytes.");
	return s;
}
function q(e, t) {
	if (!Number.isFinite(e) || !Number.isFinite(Math.fround(e))) throw y(t, e, "a finite number that fits Float32, such as 0.5", TypeError);
	return e;
}
function J(e, t, n) {
	if (!Array.isArray(e) || e.length !== t) {
		let r = `[${Array.from({ length: t }, (e, n) => +(n === t - 1 && t === 4)).join(", ")}]`;
		throw y(n, e, `an array of ${t} numbers, such as ${r}`, TypeError);
	}
	return e.map((e, t) => q(e, `${n}[${t}]`));
}
function Y(e, t) {
	return e === void 0 ? t : e;
}
function dn(e, t, n, r) {
	if (!Number.isInteger(e) || e < t || e > n) throw y(r, e, `a whole number from ${t} to ${n}, such as ${t}`);
	return e;
}
function X(e, t = "id") {
	if (typeof e != "string" || !e.trim() || e.length > 128) throw y(t, e, "a string of 1 to 128 characters, such as \"wall-left\"", TypeError);
	return e;
}
function fn(e, t, n, r) {
	if (!Array.isArray(e) || e.length > t) throw y(n, Array.isArray(e) ? `${e.length} entries` : e, `an array of at most ${t} entries, such as []`);
	let i = /* @__PURE__ */ new Set();
	return e.map((e, t) => v(`${n}[${t}]`, () => {
		if (X(e?.id), i.has(e.id)) throw y("id", e.id, `an ID no other ${n} entry uses; rename one, or remove the other`);
		return i.add(e.id), r(e);
	}));
}
function pn(e, t) {
	for (let n of ge) e[n] !== void 0 && (t[n] = Array.isArray(e[n]) ? J(e[n], 3, n) : e[n]);
	_e(t), e.subsurface !== void 0 && (t.subsurface = O("subsurfaceShader").copySubsurface(e.subsurface, t.tag)), e.snippet && (t.snippet = O("materialSnippet").normalizeMaterialSnippet(e.snippet, { hasMap: !!(e.map || e.pattern) })), (t.anisotropy > 0 || t.iridescence > 0) && O("layerShaders"), t.toon > 0 && O("lineArt");
}
function mn(e) {
	K(e, [
		"id",
		"tag",
		...nn
	], "material");
	let t = e.pattern === void 0 ? [
		.5,
		.5,
		.5
	] : [
		1,
		1,
		1
	], n = e.pattern?.type === "graph" ? e.pattern.graph : {}, r = (e, t) => Object.hasOwn(n ?? {}, e) ? 1 : t, i = {
		id: e.id,
		tag: Y(e.tag, "surface"),
		color: J(Y(e.color, t), 3, "color"),
		...r("clearcoat", 0) && { clearcoat: 1 },
		...r("transmission", 0) && { transmission: 1 },
		metallic: Y(e.metallic, r("metallic", 0)),
		roughness: Y(e.roughness, r("roughness", .5)),
		emission: Y(e.emission, r("emission", 0))
	};
	if (!N.materialTags.includes(i.tag)) throw y("tag", i.tag, `one of ${N.materialTags.join(", ")}`);
	if (e.map !== void 0 && O("assets").applyMapSequence(e, i), e.pattern !== void 0) {
		if (i.tag !== "surface") throw y("pattern", e.pattern?.type, "a material with the surface tag; remove pattern or set tag to surface");
		i.pattern = O("patterns").normalizeMaterialPattern(e.pattern);
	}
	if (i.opacity = Y(e.opacity, 1), q(i.opacity, "opacity"), i.opacity < 0 || i.opacity > 1) throw y("opacity", i.opacity, "a number from 0 to 1, such as 0.5");
	let a = Y(e.alphaMode, "opaque");
	if (!k.includes(a)) throw y("alphaMode", a, `one of ${k.join(", ")}`);
	let o = r("opacity", 0);
	if (i.alphaMode = (i.opacity < 1 || o) && a === "opaque" ? "blend" : a, i.doubleSided = Y(e.doubleSided, !1), typeof i.doubleSided != "boolean") throw y("doubleSided", i.doubleSided, "true or false", TypeError);
	for (let e of ["metallic", "roughness"]) if (q(i[e], e), i[e] < 0 || i[e] > 1) throw y(e, i[e], "a number from 0 to 1, such as 0.5");
	if (q(i.emission, "emission"), i.emission < 0) throw y("emission", i.emission, "a number of 0 or more, such as 1");
	if (i.color.some((e) => e < 0 || e > 1)) throw y("color", i.color, "three numbers from 0 to 1, such as [0.8, 0.2, 0.1]");
	if (e.emissiveColor !== void 0 && (i.emissiveColor = J(e.emissiveColor, 3, "emissiveColor"), i.emissiveColor.some((e) => e < 0))) throw y("emissiveColor", i.emissiveColor, "three numbers of 0 or more, such as [1, 0.5, 0.2]");
	if (e.aov !== void 0) {
		let t = typeof e.aov == "number" ? [
			q(e.aov, "aov"),
			e.aov,
			e.aov
		] : J(e.aov, 3, "aov");
		if (t.some((e) => e < 0 || e > 1)) throw y("aov", e.aov, "a number or three numbers from 0 to 1, such as [1, 0.5, 0]");
		i.aov = t;
	}
	pn(e, i), e.wear && (i.wear = S(e.wear)), E("worldMaterials") && O("worldMaterials").copyWaterFields(e, i, J);
	let s = i.emissiveColor ?? i.color;
	for (let e of s) {
		let t = Math.fround(e) * Math.fround(i.emission);
		if (!Number.isFinite(Math.fround(t))) throw y("emission", i.emission, "an emission that keeps color times emission within Float32 range, such as 2");
		if (i.tag === "unlit" && t > 65500) throw y("emission", i.emission, "an unlit emission that keeps color times emission at or below 65500, such as 2");
	}
	return i;
}
function hn(e) {
	K(e, [
		"id",
		"geometry",
		"material",
		...tn
	], "node");
	let t = {
		...e,
		parent: e.parent ?? null,
		translation: J(Y(e.translation, [
			0,
			0,
			0
		]), 3, "translation"),
		rotation: J(Y(e.rotation, [
			0,
			0,
			0,
			1
		]), 4, "rotation"),
		scale: J(Y(e.scale, [
			1,
			1,
			1
		]), 3, "scale")
	};
	if (t.parent !== null && X(t.parent, "parent"), t.label !== void 0 && (typeof t.label != "string" || t.label.length > 256)) throw y("label", t.label, "a string of at most 256 characters, such as \"left wall\"", TypeError);
	if (t.scale.some((e) => e <= 0 || Math.fround(e) <= 0)) throw y("scale", t.scale, "three positive numbers, such as [1, 1, 1]");
	let n = Math.hypot(...t.rotation);
	if (n === 0) throw y("rotation", t.rotation, "a nonzero quaternion [x, y, z, w], such as [0, 0, 0, 1] for no rotation");
	if (t.rotation = t.rotation.map((e) => e / n), e.geometry !== void 0 != (e.material !== void 0)) throw y(e.geometry === void 0 ? "geometry" : "material", e.geometry ?? e.material, `set together with ${e.geometry === void 0 ? "material" : "geometry"} to draw a mesh, or drop both for a group node`, TypeError);
	if (e.geometry !== void 0 && (X(e.geometry), X(e.material)), e.asset !== void 0) {
		if (e.geometry !== void 0 || e.skin !== void 0) throw y("asset", e.geometry ?? e.skin, "an asset node without geometry, material and skin; an asset node is a group", TypeError);
		t.asset = O("assets").normalizeAssetPlacement(e.asset);
	}
	if (e.vegetation !== void 0 && (t.vegetation = O("vegetation").normalizeVegetation(e.vegetation, e)), e.decal !== void 0 && typeof e.decal != "boolean") throw y("decal", e.decal, "true or false", TypeError);
	e.depthLayer !== void 0 && dn(e.depthLayer, 0, 4, "depthLayer");
	for (let t of $t) {
		if (e[t] !== void 0 && typeof e[t] != "boolean") throw y(t, e[t], "true or false", TypeError);
		if (t !== "visible" && e[t] !== void 0 && e.geometry === void 0) throw y(t, e[t], "a flag on a mesh node with geometry and material; remove it from group nodes", TypeError);
	}
	if (e.holdout === !0 && e.shadowCatcher === !0) throw y("shadowCatcher", e.shadowCatcher, "false when holdout is true; a node is a holdout or a shadow catcher, not both", TypeError);
	if (e.skin !== void 0) {
		if (e.geometry === void 0) throw y("skin", e.skin, "a skin on a mesh node with geometry and material; remove skin from group nodes", TypeError);
		if (K(e.skin, [
			"armature",
			"maxInfluences",
			"maxDistance"
		], "skin"), X(e.skin.armature), e.skin.maxInfluences !== void 0 && dn(e.skin.maxInfluences, 1, 4, "skin maxInfluences"), e.skin.maxDistance !== void 0 && !(Number.isFinite(e.skin.maxDistance) && e.skin.maxDistance > 0)) throw y("skin.maxDistance", e.skin.maxDistance, "a positive number of metres, such as 0.5");
	}
	return t;
}
function gn(e, t) {
	_n(t);
	for (let n of an) Object.hasOwn(t, n) && (e[n] = t[n]);
	return Object.hasOwn(t, "focalLength") && delete e.fov, t.projection === "perspective" && !Object.hasOwn(t, "orthoScale") && delete e.orthoScale, Object.hasOwn(t, "fov") && (delete e.focalLength, delete e.sensorWidth), e;
}
function _n(e) {
	if (e.fov !== void 0 && e.focalLength !== void 0) throw y("camera.focalLength", e.focalLength, "only one of fov (degrees) or focalLength (millimetres with sensorWidth), such as fov 45; remove the other");
}
function vn(e) {
	if (e.projection !== void 0 && e.projection !== "perspective" && e.projection !== "orthographic") throw y("camera.projection", e.projection, "perspective or orthographic");
	let t = e.projection === "orthographic";
	if (e.orthoScale !== void 0) {
		if (!t) throw y("camera.orthoScale", e.orthoScale, "a field of an orthographic camera; set projection to orthographic, or remove orthoScale");
		if (!Number.isFinite(e.orthoScale) || e.orthoScale <= 0) throw y("camera.orthoScale", e.orthoScale, "a positive view height in metres, such as 10");
	}
	if (e.sensorWidth !== void 0 && e.focalLength === void 0) throw y("camera.sensorWidth", e.sensorWidth, "a field used with focalLength, such as focalLength 35; add focalLength or remove sensorWidth");
	if (e.focalLength !== void 0) {
		if (t) throw y("camera.focalLength", e.focalLength, "a field of a perspective camera; an orthographic camera is sized by orthoScale, so remove focalLength");
		if (!Number.isFinite(e.focalLength) || e.focalLength <= 0 || e.focalLength > 1e4) throw y("camera.focalLength", e.focalLength, "a lens length above 0 and up to 10000 millimetres, such as 35");
		if (e.sensorWidth !== void 0 && !(Number.isFinite(e.sensorWidth) && e.sensorWidth > 0 && e.sensorWidth <= 1e3)) throw y("camera.sensorWidth", e.sensorWidth, "a width above 0 and up to 1000 millimetres, such as 36");
	}
	if (e.shift !== void 0 && ne(e.shift), e.fStop !== void 0 && !(Number.isFinite(e.fStop) && e.fStop >= .7 && e.fStop <= 64)) throw y("camera.fStop", e.fStop, "a number from 0.7 to 64, such as 2.8 (smaller numbers blur more)");
}
function yn(e = {}) {
	K(e, an, "camera"), _n(e);
	let t = {
		...Qt,
		...e
	};
	t.focalLength !== void 0 && delete t.fov, vn(t), t.eye = J(t.eye, 3, "camera.eye"), t.target = J(t.target, 3, "camera.target"), t.up = J(t.up, 3, "camera.up");
	let i = Math.hypot(...t.up);
	if (i === 0) throw y("camera.up", t.up, "a nonzero direction, such as [0, 1, 0]");
	t.up = t.up.map((e) => e / i);
	for (let e of [
		"fov",
		"near",
		"far"
	]) t[e] !== void 0 && q(t[e], `camera.${e}`);
	if (t.fov !== void 0 && (Math.fround(t.fov) <= 0 || Math.fround(t.fov) >= 180) || Math.fround(t.near) <= 0 || Math.fround(t.far) <= Math.fround(t.near)) throw t.fov !== void 0 && (Math.fround(t.fov) <= 0 || Math.fround(t.fov) >= 180) ? y("camera.fov", t.fov, "degrees above 0 and below 180, such as 50") : y("camera.near", [t.near, t.far], "near above 0 and far above near, such as near 0.1 and far 100");
	if (t.eye.every((e, n) => Math.fround(e) === Math.fround(t.target[n]))) throw y("camera.target", t.target, `a point different from eye ${JSON.stringify(t.eye)}, such as [0, 0, 0]`);
	let a = t.target.map((e, n) => e - t.eye[n]), s = Math.hypot(...a), c = a.map((e) => e / s), l = Math.hypot(c[1] * t.up[2] - c[2] * t.up[1], c[2] * t.up[0] - c[0] * t.up[2], c[0] * t.up[1] - c[1] * t.up[0]);
	if (Math.fround(l) === 0) throw y("camera.up", t.up, "a direction not parallel to the view from eye to target, such as [0, 1, 0]");
	let u = n(r(), t.eye, t.target, t.up), d = te(r(), t, 1);
	for (let e of [u, d]) {
		let t = o(e);
		if (!e.every(Number.isFinite) || !Number.isFinite(t) || t === 0) throw RangeError("Camera matrices must remain finite and nonsingular at Float32 precision.");
	}
	return t;
}
var bn = {
	box: ["bevel", "subdivisions"],
	cylinder: [
		"segments",
		"bevel",
		"bevelSegments"
	],
	sphere: ["segments", "rings"],
	grid: ["segments"],
	plane: ["segments"],
	cone: [
		"radiusTop",
		"radiusBottom",
		"segments"
	],
	icoSphere: ["subdivisions"],
	circle: ["segments", "innerRadius"],
	line: [
		"from",
		"to",
		"radius",
		"radialSegments"
	],
	torus: [
		"tubeRadius",
		"segments",
		"sides",
		"arc",
		"start"
	],
	lathe: [
		"profile",
		"segments",
		"startAngle",
		"sweep"
	],
	extrude: [
		"contour",
		"holes",
		"depth",
		"steps",
		"bevel",
		"bevelThickness",
		"bevelSegments"
	],
	tube: [
		"path",
		"radius",
		"segments",
		"radialSegments",
		"closed"
	],
	sdf: ["root", "resolution"],
	curve: [
		"points",
		"shape",
		"splines",
		"closed",
		"kind",
		"weights",
		"order",
		"knots",
		"knotMode",
		"trim",
		"grow",
		"radius",
		"taper",
		"profile",
		"resolution",
		"radialSegments"
	],
	text: [
		"text",
		"size",
		"depth",
		"font",
		"align",
		"curveSegments"
	],
	mesh: [
		"base",
		"edits",
		"stack",
		"smoothAngle",
		"shapeKeys"
	],
	terrain: [
		"size",
		"resolution",
		"seed",
		"amplitude",
		"holes"
	]
};
function xn(e) {
	let t = [e.from, e.to];
	for (let e of t) J(e, 3, "line end");
	if (t[0].every((e, n) => e === t[1][n])) throw y("to", e.to, `a point different from from ${JSON.stringify(e.from)}, such as [0, 1, 0]`);
	return t;
}
function Z(e, t = Zt) {
	if (!Object.hasOwn(bn, e.type)) throw y("type", e.type, `one of ${Object.keys(bn).join(", ")}`, TypeError);
	K(e, [
		"id",
		"type",
		...bn[e.type]
	], "geometry");
	function n(t, n, r, i) {
		return dn(e[t] ?? n, r, i, t);
	}
	function r(e, t, n, r = "points") {
		if (!Array.isArray(e) || e.length < n || e.length > 4096) throw y(r, Array.isArray(e) ? `${e.length} points` : e, `a list of ${n} to 4096 points of ${t} numbers, such as ${JSON.stringify(Array.from({ length: n }, (e, n) => Array.from({ length: t }, () => n)))}`);
		for (let n of e) J(n, t, "geometry point");
		return e.length;
	}
	for (let t of bn[e.type]) e[t] !== void 0 && !(/* @__PURE__ */ "profile.contour.holes.path.closed.base.edits.stack.shapeKeys.points.taper.text.font.align.from.to.shape.splines.kind.weights.order.knots.knotMode.trim.grow.root".split(".")).includes(t) && q(e[t], t);
	switch (e.type) {
		case "box": return e.bevel === 0 ? 24 : 6 * (2 * n("subdivisions", 6, 1, 128) + 2) ** 2;
		case "cylinder": return (n("segments", 80, 3, 2048) + 1) * 2 * (n("bevelSegments", 6, 1, 128) + 1) + 2 * ((e.segments ?? 80) + 2);
		case "sphere": return (n("segments", 64, 3, 2048) + 1) * (n("rings", 40, 2, 2048) + 1);
		case "grid":
		case "plane": return (n("segments", 16, 1, 64) + 1) ** 2;
		case "cone": return (n("segments", 64, 3, 2048) + 1) * 2 + 2 * ((e.segments ?? 64) + 2);
		case "icoSphere": return 10 * 4 ** n("subdivisions", 2, 0, 7) + 2;
		case "circle": return e.innerRadius > 0 ? (n("segments", 64, 3, 2048) + 1) * 2 : n("segments", 64, 3, 2048) + 2;
		case "line": {
			let t = n("radialSegments", 8, 3, 128);
			return xn(e), 2 * t * 2 + 2 * (t + 1);
		}
		case "torus": return (n("segments", 96, 3, 2048) + 1) * (n("sides", 24, 3, 128) + 1) + 2 * ((e.sides ?? 24) + 2);
		case "lathe": return (n("segments", 64, 3, 2048) + 1) * r(e.profile, 2, 2, "profile");
		case "tube":
			if (r(e.path, 3, e.closed ? 3 : 2, "path"), e.closed !== void 0 && typeof e.closed != "boolean") throw y("closed", e.closed, "true or false", TypeError);
			return (n("segments", 64, 3, 2048) + 1) * (n("radialSegments", 12, 3, 128) + 1);
		case "curve": {
			if ([
				"shape",
				"splines",
				"kind",
				"weights",
				"order",
				"knots",
				"knotMode",
				"trim",
				"grow"
			].some((t) => e[t] !== void 0)) return O("modeling").curveGeometryVertexCount(e);
			let t = e.points;
			if (!Array.isArray(t) || t.length < 2 || t.length > M.maxCurvePoints) throw y("points", Array.isArray(t) ? `${t.length} points` : t, `a list of 2 to ${M.maxCurvePoints} points, such as [[0, 0, 0], [0, 1, 0]]`);
			let i = e.profile === void 0 ? n("radialSegments", 8, 3, 128) : r(e.profile, 2, 3, "profile");
			return ((e.closed ? t.length : t.length - 1) * n("resolution", 12, 1, 64) + 1) * i * 2 + 2 * (i + 1);
		}
		case "sdf": return O("modeling").sdfVertexEstimate(e);
		case "text":
			if (typeof e.text != "string") throw y("text", e.text, "a string, such as \"Hello\"", TypeError);
			return [...e.text].filter((e) => !/\s/.test(e)).length * (e.font === void 0 || e.font === "default" ? M.verticesPerCharacterSegment : M.verticesPerCustomCharacterSegment) * n("curveSegments", 4, 1, 16);
		case "terrain": return O("terrain").terrainVertexEstimate(e);
		case "extrude": {
			let t = e.holes ?? [];
			if (!Array.isArray(t) || t.length > 128) throw y("holes", Array.isArray(t) ? `${t.length} rings` : t, "a list of at most 128 rings of points, such as []");
			let i = r(e.contour, 2, 3, "contour") + t.reduce((e, t) => e + r(t, 2, 3, "holes"), 0);
			if (i > 4096) throw y("contour", `${i} points`, "a contour and holes with at most 4096 points in total; simplify them");
			let a = (e.bevel ?? 0) > 0 || (e.bevelThickness ?? e.bevel ?? 0) > 0;
			return 6 * (i + t.length * 2 - 2) + 6 * i * (n("steps", 1, 1, 256) + (a ? n("bevelSegments", 3, 1, 32) * 2 : 0));
		}
		case "mesh": {
			let n = e.base;
			if (!n || typeof n != "object" || Array.isArray(n) || n.type === "mesh" || Object.hasOwn(n, "id")) throw y("base", n, "a primitive or profile record without an id, such as { \"type\": \"box\" } (box, cylinder, sphere, torus, lathe, extrude or tube)", TypeError);
			let r = Z({
				id: "base",
				...n
			}), i = wn(e, t), a = 0;
			for (let t of O("mesh").normalizeMeshEdits(e.edits ?? [])) {
				if (t.op !== "boolean") continue;
				let e = Tn(t.cutter, i);
				r += e, Cn(t.cutter) && (a += e);
			}
			if (a > Xt) throw y("cutter.geometry", `${a} estimated cutter vertices in ${i.chain.join(" -> ")}`, `cutter geometries that total at most ${Xt} estimated vertices; use fewer segments or fewer referenced cutters`);
			for (let t of O("mesh").normalizeMeshStack(e.stack ?? [])) r *= t.op === "array" ? t.count : 2;
			if (e.shapeKeys !== void 0 && O("mesh").normalizeShapeKeys(e.shapeKeys), e.smoothAngle !== void 0 && (e.smoothAngle < 0 || e.smoothAngle > 180)) throw y("smoothAngle", e.smoothAngle, "degrees from 0 to 180, such as 30");
			return r * 2;
		}
	}
}
function Sn(e) {
	return !Array.isArray(e) || e.some((e) => e && typeof e == "object" && Object.hasOwn(e, "instances"));
}
function Cn(e) {
	return Object.hasOwn(e, "geometry");
}
function wn(e, t) {
	return t && {
		definitions: t.definitions,
		chain: t.chain.length ? t.chain : [e.id]
	};
}
function Tn(e, t) {
	if (Cn(e)) return En(e, t);
	if (e.type === "mesh" || Object.hasOwn(e, "id")) throw y("cutter", e, "a primitive or profile record without an id, such as { \"type\": \"box\" } (box, cylinder, sphere, torus, lathe, extrude or tube), or { \"geometry\": \"<recipe geometry id>\" }", TypeError);
	return Z({
		id: "cutter",
		...e
	});
}
function En(e, t) {
	if (Object.keys(e).length !== 1 || typeof e.geometry != "string") throw y("cutter", e, "only { \"geometry\": \"<recipe geometry id>\" }; put translation, rotation and scale on the boolean edit", TypeError);
	if (!t) throw y("cutter.geometry", e.geometry, "a primitive or profile record such as { \"type\": \"box\" }; only recipe meshes can name another geometry");
	let n = [...t.chain, e.geometry];
	if (n.indexOf(e.geometry) !== n.length - 1) throw y("cutter.geometry", n.join(" -> "), `a geometry that does not cut with itself; remove ${e.geometry} from the cutters of ${t.chain[t.chain.length - 1]} or give it another cutter`);
	if (n.length - 1 > Yt) throw y("cutter.geometry", n.join(" -> "), `a chain of at most ${Yt} cutter geometries; build the inner cutters into one geometry`);
	if (!t.definitions) return 0;
	let r = t.definitions.get(e.geometry);
	if (!r) throw y("cutter.geometry", n.join(" -> "), `the ID of a geometry in geometries, one of ${[...t.definitions.keys()].join(", ") || "none yet"}; add ${e.geometry} or pick one of them`);
	return Z(r, {
		definitions: t.definitions,
		chain: n
	});
}
function Dn(e) {
	return e?.op === "boolean" && typeof e.cutter?.geometry == "string";
}
function On(e, t) {
	let n = [];
	for (let r of e.edits ?? []) {
		if (!Dn(r)) continue;
		let e = t.get(r.cutter.geometry);
		n.push(JSON.stringify(e), On(e, t));
	}
	return n.join("|");
}
function kn(e, t) {
	return (e.edits ?? []).some(Dn) ? (Z(e, {
		definitions: t,
		chain: []
	}), On(e, t)) : "";
}
function An(e, t) {
	let n = e.type === "mesh" ? kn(e, t) : "";
	return n ? `${JSON.stringify(e)}|cutters|${n}` : JSON.stringify(e);
}
function jn(e) {
	return new Map(e.map((e) => [e.id, e]));
}
function Mn(e) {
	return {
		definitions: jn(e),
		chain: []
	};
}
function Nn(e, t) {
	return Tn(e), Q(e, t);
}
function Q(e, t, n) {
	switch (e.type) {
		case "box": return g(e.bevel, e.subdivisions);
		case "cylinder": return f(e.segments, e.bevel, e.bevelSegments);
		case "sphere": return ee(e.segments, e.rings);
		case "grid":
		case "plane": return u(e.segments);
		case "cone": return h(e.radiusTop, e.radiusBottom, e.segments);
		case "icoSphere": return m(e.subdivisions);
		case "circle": return p(e.segments, e.innerRadius);
		case "line": return O("modeling").curve(xn(e), {
			radius: e.radius,
			radialSegments: e.radialSegments,
			resolution: 1,
			maxVertices: t
		});
		case "torus": return d(e.tubeRadius, e.segments, e.sides, e.arc, e.start);
		case "lathe": return O("modeling").lathe(e.profile, {
			...e,
			maxVertices: t
		});
		case "extrude": return O("modeling").extrude(e.contour, {
			...e,
			maxVertices: t
		});
		case "tube": return O("modeling").tube(e.path, {
			...e,
			maxVertices: t
		});
		case "sdf": return O("modeling").sdfGeometry(e, t);
		case "curve": return O("modeling").curveGeometry(e, t);
		case "text": return O("text").text(e.text, {
			...e,
			maxVertices: t
		});
		case "terrain": return O("terrain").generateTerrainGeometry(e, t);
		case "mesh": {
			let r = wn(e, n), i = n ? kn(e, n.definitions) : "";
			return O("mesh").generateMeshGeometry(() => Q(e.base, t), e.edits ?? [], {
				maxVertices: t,
				smoothAngle: e.smoothAngle,
				stack: e.stack ?? [],
				shapeKeys: e.shapeKeys ?? [],
				cacheKey: i ? `${JSON.stringify(e.base)}|cutters|${i}` : JSON.stringify(e.base),
				resolveCutter: (e) => {
					if (Tn(e, r), !Cn(e)) return Q(e, t);
					let i = [...r.chain, e.geometry];
					return Q(n.definitions.get(e.geometry), t, {
						definitions: n.definitions,
						chain: i
					});
				}
			});
		}
	}
}
function Pn(e, t, n, a) {
	let o = new Map(e.materials.map((e) => [e.id, e])), c = _(e.nodes.map((e) => {
		if (e.geometry !== void 0 && (!t.has(e.geometry) || !o.has(e.material))) {
			let n = t.has(e.geometry) ? "material" : "geometry";
			throw y(`nodes.${e.id}.${n}`, e[n], `one of ${(t.has(e.geometry) ? [...o.keys()] : [...t.keys()]).join(", ")}`);
		}
		return {
			name: e.id,
			parent: e.parent,
			matrix: e.assetPart ? s(e.assetPart.matrix) : i(r(), e.rotation, e.translation, e.scale),
			geometry: t.get(e.geometry),
			material: o.get(e.material)
		};
	}), a);
	return Fn(c, n), c;
}
function Fn(e, t) {
	let n = l();
	for (let r of e.nodes) {
		if (!c(n, r.worldMatrix) || !n.every(Number.isFinite)) throw RangeError(`Node ${r.name} normal transform exceeds Float32 range.`);
		if (r.geometry) {
			let e = t.get(r.geometry);
			for (let t = 0; t < 8; t++) {
				let n = [
					0,
					1,
					2
				].map((n) => t & 1 << n ? e.max[n] : e.min[n]);
				for (let e = 0; e < 3; e++) {
					let t = r.worldMatrix, i = Math.abs(t[e] * n[0]) + Math.abs(t[4 + e] * n[1]) + Math.abs(t[8 + e] * n[2]) + Math.abs(t[12 + e]);
					if (!Number.isFinite(Math.fround(i))) throw RangeError(`Node ${r.name} world geometry bounds exceed Float32 range.`);
				}
			}
		}
	}
}
function $(e, t) {
	let n = [
		Infinity,
		Infinity,
		Infinity
	], r = [
		-Infinity,
		-Infinity,
		-Infinity
	], i = e.positions;
	for (let e = 0; e < i.length; e += 3) for (let a = 0; a < 3; a++) {
		let o = t[a] * i[e] + t[4 + a] * i[e + 1] + t[8 + a] * i[e + 2] + t[12 + a];
		n[a] = Math.min(n[a], o), r[a] = Math.max(r[a], o);
	}
	return {
		min: n,
		max: r
	};
}
function In(e, n) {
	if (!Object.hasOwn(e, "armatures")) {
		for (let t of e.nodes) if (t.skin) throw y(`nodes.${t.id}.skin`, t.skin, "a skin only when the recipe has armatures; add an armatures list or remove skin");
		return;
	}
	let i = new Map(e.nodes.map((e) => [e.id, e]));
	e.armatures = Oe(e.armatures, { resolveBounds: (o, s) => {
		let c = i.get(s);
		if (!c?.geometry) throw y(`armatures.${o.id}.fit`, s, "the ID of a mesh node with a geometry, such as one scene_inspect lists");
		let l = $(Q(e.geometries.find((e) => e.id === c.geometry), Math.min(n.maxVertices, 1e6), Mn(e.geometries)), r()), u = a(r(), Ce(o.id, i, [o])), d = Ce(c.id, i);
		return Se(l, t(r(), u, d));
	} });
	let o = e.armatures.flatMap(ke);
	for (let e of o) if (i.has(e.id)) throw y(`armatures.${e.id}`, e.id, "a bone node ID no other node uses; give the armature a prefix, such as \"rig-\"");
	if (new Set(o.map((e) => e.id)).size !== o.length) throw y("armatures", e.armatures.map((e) => e.id), "armatures that generate different node IDs; give one a prefix, such as \"rig-\"");
	for (let t of e.nodes) if (t.skin && !e.armatures.some((e) => e.id === t.skin.armature)) throw y(`nodes.${t.id}.skin.armature`, t.skin.armature, `one of ${e.armatures.map((e) => e.id).join(", ")}`);
	e.nodes = [...o, ...e.nodes];
}
var Ln = "default";
function Rn(e) {
	let t = e.materials, n = (Array.isArray(e.nodes) ? e.nodes : []).filter((e) => e?.geometry !== void 0 && e.material === void 0);
	if (n.length === 0 || !Array.isArray(t)) return t;
	for (let e of n) e.material = Ln;
	return t.some((e) => e?.id === Ln) ? t : [...t, { id: Ln }];
}
function zn(e) {
	if (!ct(e.environment)) return;
	let t = O("lightLinking").unknownLightLinkNames(e.environment, e.nodes);
	if (t.length > 0) throw y("environment.keyAffects", t.slice(0, 4), "node IDs that exist in nodes in every affects list; scene_inspect lists them");
}
function Bn(e) {
	let t = [
		...e.pointLights,
		...e.spotLights ?? [],
		...e.areaLights ?? []
	];
	return JSON.stringify([e.keyAffects ?? null, ...t.map((e) => e.affects ?? null)]);
}
function Vn(e, t, n) {
	let r = n.get(e) ?? /* @__PURE__ */ new Map();
	if (n.set(e, r), !r.has(t)) {
		let n = {};
		for (let t of Object.keys(e)) Object.defineProperty(n, t, {
			enumerable: !0,
			get: () => e[t]
		});
		Object.defineProperty(n, "lightMask", {
			enumerable: !0,
			value: t
		}), r.set(t, Object.freeze(n));
	}
	return r.get(t);
}
function Hn(e, t) {
	let n = un(e, t.maxRecipeBytes);
	if (K(n, [
		"format",
		"schemaVersion",
		"geometries",
		"materials",
		"nodes",
		"armatures",
		"camera",
		"environment",
		"effects",
		"shadow",
		"motion",
		"physics",
		"cloth",
		"timeline",
		"particles",
		"bake",
		"postPasses",
		"game"
	], "recipe"), n.format !== "67js.scene" || n.schemaVersion !== 1) throw y(n.format === "67js.scene" ? "schemaVersion" : "format", n.format === "67js.scene" ? n.schemaVersion : n.format, n.format === "67js.scene" ? "1" : "\"67js.scene\"");
	n.geometries ??= [], n.materials ??= [], Array.isArray(n.geometries) && (n.geometries = n.geometries.filter((e) => e?.type !== "asset")), Array.isArray(n.materials) && (n.materials = n.materials.filter((e) => !e?.assetSource)), Array.isArray(n.nodes) && (n.nodes = n.nodes.filter((e) => !e?.assetPart)), n.geometries = fn(n.geometries, t.maxGeometries, "geometries", (e) => {
		Z(e);
		let t = {
			id: e.id,
			type: e.type === "plane" ? "grid" : e.type
		};
		for (let n of bn[e.type]) Object.hasOwn(e, n) && (t[n] = e[n]);
		return t;
	});
	let r = jn(n.geometries);
	n.geometries.forEach((e, t) => {
		e.type === "mesh" && v(`geometries[${t}]`, () => kn(e, r));
	}), n.materials = fn(Rn(n), t.maxMaterials, "materials", mn);
	let i = new Set(n.materials.filter((e) => e.pattern).map((e) => JSON.stringify(e.pattern)));
	if (i.size > 16) throw y("materials", `${i.size} different patterns`, "at most 16 different material patterns; reuse one and tint it with color");
	n.nodes = Ee(n.nodes), Sn(n.nodes) && (n.nodes = O("mesh").expandInstancedNodes(n.nodes, {
		maxNodes: t.maxNodes,
		resolveSurface: (e) => {
			let r = n.geometries.find((t) => t.id === e);
			if (!r) throw y("instances.surface", e, `the ID of a geometry in geometries, such as ${n.geometries[0]?.id ?? "ground"}`);
			return Q(r, Math.min(t.maxVertices, 1e6), Mn(n.geometries));
		}
	}, n.geometries)), n.nodes = fn(n.nodes, t.maxNodes, "nodes", hn), In(n, t), n.nodes.some((e) => e.relations !== void 0) && (n.nodes = O("relations").normalizeRelations(n.nodes)), n.camera = yn(n.camera);
	let a = {};
	for (let e of [
		"environment",
		"effects",
		"shadow"
	]) Object.hasOwn(n, e) && (a[e] = n[e]);
	if (Object.assign(n, Tt(a)), n.camera.fStop !== void 0 && n.effects?.depthOfField.blur > 0) throw y("camera.fStop", n.camera.fStop, "a camera without effects.depthOfField.blur above 0; set blur to 0 or remove fStop");
	return zn(n), Object.hasOwn(n, "motion") && (n.motion = n.motion === null || n.motion === void 0 ? null : O("motion").normalizeAgentMotion(n.motion, n)), Object.hasOwn(n, "physics") && (n.physics = O("physics").normalizeAgentPhysics(n.physics, n)), Object.hasOwn(n, "cloth") && (n.cloth = O("cloth").normalizeAgentCloth(n.cloth, n)), Object.hasOwn(n, "timeline") && (n.timeline === null ? delete n.timeline : n.timeline = O("timeline").normalizeFilmTimeline(n.timeline, n, { checkCamera: (e) => Un(n.camera, e) })), Object.hasOwn(n, "particles") && (n.particles = O("particles").normalizeAgentParticles(n.particles, n)), Object.hasOwn(n, "bake") && (n.bake = n.bake === null ? null : O("bake").normalizeAgentBake(n.bake)), Object.hasOwn(n, "postPasses") && (n.postPasses = O("userPass").normalizeUserPasses(n.postPasses ?? [])), Object.hasOwn(n, "game") && (n.game === null ? delete n.game : n.game = O("game").normalizeGameSetup(n.game, new Set(n.nodes.map((e) => e.id)))), n = un(n, t.maxRecipeBytes), n;
}
function Un(e, t) {
	return yn({
		...e,
		...t
	}), structuredClone(t);
}
function Wn(e) {
	let t = 0, n = 0, r = 0;
	for (let i of e) t += i.vertices, n += i.geometryBytes, r += i.estimatedVertices * 56;
	return {
		vertices: t,
		geometryBytes: n,
		estimatedGeometryBytes: r
	};
}
function Gn(e) {
	return `${e.tag}|${e.alphaMode}|${e.opacity}|${e.transmission > 0}|${e.doubleSided}|${JSON.stringify(e.pattern ?? e.map ?? null)}|${JSON.stringify(e.snippet)}`;
}
function Kn(e, t, n) {
	let r = {
		snapshot: e,
		sequence: t,
		images: n
	}, i = {};
	for (let e of [
		"id",
		"tag",
		...nn
	]) Object.defineProperty(i, e, {
		enumerable: !0,
		configurable: !0,
		get() {
			return r.snapshot[e];
		}
	});
	for (let e of rn) Object.defineProperty(i, e, {
		enumerable: !0,
		get() {
			return e === "map" && r.sequence ? r.sequence.descriptor : r.snapshot.pattern ? O("patterns").materialPatternTextures(r.snapshot.pattern, r.images)[e] : void 0;
		}
	});
	return {
		holder: r,
		output: Object.freeze(i)
	};
}
function qn(e) {
	for (let t of [
		"color",
		"emissiveColor",
		"absorption",
		"aov"
	]) e[t] && Object.freeze(e[t]);
	return Object.freeze(e);
}
var Jn = Object.freeze({
	placements: [],
	animators: [],
	geometryParts: /* @__PURE__ */ new Map(),
	materialOutputs: /* @__PURE__ */ new Map(),
	partExtras: /* @__PURE__ */ new Map()
});
function Yn(e, t, ...n) {
	return n.find((e) => e?.output === t) ?? {
		holder: { snapshot: e },
		output: t
	};
}
function Xn(e) {
	for (let t of e) if (t.matrix.length !== 16 || t.matrix.byteLength !== 64) throw RangeError("Retained render matrices must not be detached.");
}
function Zn(e) {
	let i = yn({
		eye: Array.from(e.eye),
		target: Array.from(e.target),
		up: Array.from(e.up),
		...e.focalLength === void 0 ? { fov: e.fov } : {},
		near: e.near,
		far: e.far,
		...Object.fromEntries(re.filter((t) => e[t] !== void 0).map((t) => [t, e[t]]))
	}), a = n(r(), i.eye, i.target, i.up);
	for (let e of [1 / 16, 16]) {
		let n = te(r(), i, e);
		if (![n, t(r(), n, a)].every((e) => e.every(Number.isFinite))) throw RangeError("Motion camera matrices exceed the supported Float32 aspect range.");
	}
	return i;
}
function Qn(e, t) {
	return t === null ? null : e.physicsSampler?.sample(Math.min(t, e.physicsSampler.duration));
}
function $n(e, t, n) {
	let r = t?.nodes.get(e.id), i = n?.get(e.id);
	return {
		translation: i?.translation ?? r?.translation ?? e.translation,
		rotation: i?.rotation ?? r?.rotation ?? e.rotation,
		scale: r?.scale ?? e.scale
	};
}
function er(e) {
	let t = new Map(e.recipe.nodes.map((e) => [e.id, e]));
	return {
		animated: !!(e.motionSampler || e.physicsSampler),
		motionDuration: e.recipe.motion?.duration ?? 0,
		physicsDuration: e.physicsSampler?.duration ?? 0,
		sampleLocalTransforms(n, r) {
			let i = e.motionSampler?.sample(n) ?? null, a = Qn(e, n);
			return new Map(r.map((e) => [e, $n(t.get(e), i, a)]));
		}
	};
}
function tr(e, t) {
	let n = t === null ? null : e.motionSampler?.sample(t), r = sr(e.recipe, n), a = Qn(e, t), o = e.poseGraph ?? e.graph;
	if (e.poseGraph) {
		for (let t of e.recipe.nodes) {
			let { translation: e, rotation: r, scale: s } = $n(t, n, a);
			if (Array.from(s).some((e) => !Number.isFinite(Math.fround(e)) || Math.fround(e) <= 0)) throw RangeError("Motion scale must remain positive at Float32 precision.");
			t.assetPart ? o.getNode(t.id).localMatrix.set(t.assetPart.matrix) : i(o.getNode(t.id).localMatrix, r, e, s);
		}
		o.update(), Fn(o, e.localBounds);
	}
	xe(e.skinStages, o);
	let s = [];
	for (let t of e.recipe.materials) {
		let r = n?.materials.get(t.id), i = t;
		if (r) {
			let e = {
				...t,
				...r
			};
			for (let t of ["color", "emissiveColor"]) e[t] && (e[t] = Array.from(e[t]));
			i = qn(mn(e));
		}
		s.push({
			holder: e.materialHandles.get(t.id).holder,
			snapshot: i
		});
	}
	let c = n?.camera ? Zn(n.camera) : e.recipe.camera;
	return Xn(e.parts), {
		graph: o,
		materialUpdates: s,
		camera: c,
		time: t,
		clothGeometries: rr(e, t, n),
		assetClips: e.assetRuntime.animators.length ? O("assets").stageAssetClips(e.assetRuntime, o, t) : null,
		hiddenNodes: r,
		movedLook: e.motionSampler && O("motion").motionMovesLook(n) ? n : null,
		morphs: n?.morphs ?? null
	};
}
function nr(e, t) {
	let n = t?.geometries;
	if (!n?.size) return /* @__PURE__ */ new Map();
	let r = e.oceanFrames ??= /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
	for (let [t, a] of n) {
		let n = r.get(t);
		if (n?.time !== a.oceanTime) {
			let i = e.recipe.geometries.find((e) => e.id === t), o = i.stack.map((e) => e.op === "ocean" ? {
				...e,
				time: a.oceanTime
			} : e), s = Mn(e.recipe.geometries);
			n = {
				time: a.oceanTime,
				geometry: Object.freeze(Q({
					...i,
					stack: o
				}, e.maxGeometryVertices, s))
			}, r.set(t, n);
		}
		for (let r of e.recipe.nodes) r.geometry === t && i.set(r.id, n.geometry);
	}
	return i;
}
function rr(e, t, n) {
	if (t === null) return null;
	let r = nr(e, n);
	for (let n of [e.clothSampler, e.particleSampler]) n?.sample(t)?.forEach((e, t) => r.set(t, e));
	return r.size ? r : null;
}
function ir(e) {
	return Object.fromEntries(en.filter((t) => e[t] !== void 0).map((t) => [t, e[t]]));
}
function ar(e, t, n, r) {
	return en.every((n) => e[n] === (t[n] ?? r?.[n])) && !!e.visibility === n;
}
function or(e) {
	return e.nodes.some((e) => e.visible !== void 0) || !!e.motion?.tracks?.some((e) => e.kind === "node" && e.property === "visible");
}
function sr(e, t) {
	let n = /* @__PURE__ */ new Set();
	if (!or(e)) return n;
	let r = new Map(e.nodes.map((e) => [e.id, e])), i = (e) => {
		let n = t?.nodes.get(e.id)?.visible;
		return n === void 0 ? e.visible === !1 : n < .5;
	};
	for (let t of e.nodes) for (let e = t, a = 0; e && a < 256; e = r.get(e.parent), a++) if (i(e)) {
		n.add(t.id);
		break;
	}
	return n;
}
function cr(e, t, n) {
	if (!t) return e;
	let r = e.map((e, r) => {
		let i = t.get(e.name);
		return i ? n[r]?.geometry === i ? n[r] : Object.freeze({
			...e,
			geometry: i
		}) : e;
	});
	return r.every((e, t) => e === n[t]) ? n : Object.freeze(r);
}
function lr(e, t) {
	let { morphTargetNames: n, morphTargetValues: r, morphGrowth: i } = e.geometry;
	if (n && e.morph) {
		if (i) {
			let n = t?.get(i.name)?.weight ?? i.value;
			O("modeling").growthWeights(i.steps, n).forEach((t, n) => {
				e.morph.weights[n] = t;
			});
		} else n.forEach((n, i) => {
			e.morph.weights[i] = t?.get(n)?.weight ?? r[i];
		});
	}
}
function ur(e, t) {
	for (let n of e.restParts) n.visibility && (n.visibility.visible = !t.hiddenNodes.has(n.name)), Float32Array.prototype.set.call(n.matrix, t.graph.getNode(n.name).worldMatrix), lr(n, t.morphs);
	for (let e of t.materialUpdates) e.holder.snapshot = e.snapshot;
	if (be(e.skinStages), t.assetClips) {
		t.assetClips.commit();
		for (let n of e.restParts) {
			let e = t.assetClips.matrices.get(n.name);
			e && Float32Array.prototype.set.call(n.matrix, e);
		}
	}
	for (let n of e.sequences) n.seek(t.time);
	e.renderCamera = t.camera, e.movedLook = t.movedLook, e.motionTime = t.time;
	let n = cr(e.restParts, t.clothGeometries, e.parts), r = n !== e.parts;
	return e.parts = n, r;
}
function dr(e) {
	let t = structuredClone(e);
	return t.nodes = t.nodes.filter((e) => !e.assetPart), t.geometries = t.geometries.filter((e) => e.type !== "asset"), t.materials = t.materials.filter((e) => !e.assetSource), t;
}
function fr(e, t, n) {
	X(t.geometry);
	let r = e.geometries.find((e) => e.id === t.geometry);
	if (!r) throw y("geometry", t.geometry, `one of ${[...e.geometries.map((e) => e.id)].join(", ")}`);
	if (r.type !== "mesh") throw y("geometry", t.geometry, `the ID of a mesh geometry, but it is a ${r.type}. ${n(r.type)}`, TypeError);
	return r;
}
function pr(e, t) {
	K(t, [
		"type",
		"id",
		"recursive"
	], "operation"), X(t.id);
	let n = t.recursive !== void 0 && t.recursive;
	if (typeof n != "boolean") throw y("recursive", n, "true or false", TypeError);
	if (!e.nodes.some((e) => e.id === t.id)) throw y("id", t.id, "the ID of a node in nodes; scene_inspect lists them");
	let r = /* @__PURE__ */ new Map();
	for (let t of e.nodes) {
		let e = r.get(t.parent) ?? [];
		e.push(t.id), r.set(t.parent, e);
	}
	if (!n && (r.get(t.id)?.length ?? 0) > 0) throw y("recursive", n, "true for a node with children, such as true; or remove the children first");
	let i = /* @__PURE__ */ new Set([t.id]), a = [t.id];
	if (n) for (let e = 0; e < a.length; e++) for (let t of r.get(a[e]) ?? []) i.has(t) || (i.add(t), a.push(t));
	return e.nodes = e.nodes.filter((e) => !i.has(e.id)), i;
}
function mr(e, t = {}, n = {}) {
	let i = ln(t), a = /* @__PURE__ */ new Map(), o = null, s = 0, c = 0, l = 0, u = null, d = null, f = null, p = null, m = null, h = null, ee = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), _ = [];
	function v() {
		return {
			recipe: dr(o.recipe),
			geometryRecords: new Map(o.geometryRecords),
			materialHandles: new Map(o.materialHandles),
			restParts: o.restParts,
			sourceRestParts: o.sourceRestParts
		};
	}
	function te(e, t) {
		X(e);
		let n = o.recipe.nodes.find((t) => t.id === e), r = n && o.geometries.get(n.geometry);
		if (!r) throw y(`path.${t}`, e, "the ID of a node with a drawn geometry; scene_inspect lists node IDs");
		return {
			geometry: r,
			worldMatrix: o.graph.getNode(e).worldMatrix
		};
	}
	let ne = (e) => O("navigation").resolvePathQuery(e, te, $);
	function re() {
		let e = new Set(o?.geometryRecords.values() ?? []), t = [...g.values(), ..._.map((e) => e.snapshot)];
		for (let n of t) for (let t of n.geometryRecords.values()) e.add(t);
		return e;
	}
	function b(e, t = null, s = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set()) {
		l = 0;
		let u = Hn(e, i), d = u.nodes.some((e) => e.asset) ? O("assets").expandAssetPlacements(u, n.assets, i, a, u.nodes.some((e) => e.asset?.drive) ? O("drive").createAssetDrive : null) : Jn, f = u.nodes.some((e) => e.vegetation) ? O("vegetation").expandVegetation(u, i, a, d) : d;
		o && Xn(o.parts);
		let p = jn(u.geometries), m = () => {
			let e = re(), n = /* @__PURE__ */ new Map();
			for (let t of e) n.set(t.signature, t);
			let r = u.geometries.map((e) => {
				let r = An(e, p);
				return {
					definition: e,
					signature: r,
					existing: [
						t?.geometryRecords.get(e.id),
						o?.geometryRecords.get(e.id),
						n.get(r)
					].find((e) => e?.signature === r),
					estimatedVertices: e.type === "asset" ? 0 : Z(e, {
						definitions: p,
						chain: []
					})
				};
			}), a = Wn(e), s = r.filter((e) => !e.existing).reduce((e, t) => e + t.estimatedVertices, 0);
			return {
				plans: r,
				residentStats: a,
				pendingVertices: s,
				overBudget: a.vertices + s > i.maxVertices || a.geometryBytes + s * 56 > i.maxGeometryBytes
			};
		}, h = m();
		for (; h.overBudget && _.length > 0;) _.shift(), l++, h = m();
		let { residentStats: g } = h, { plans: v, pendingVertices: y } = h;
		if (h.overBudget) throw RangeError("Geometry preflight exceeds peak maxVertices or maxGeometryBytes across active, checkpoint and staged resources. Reduce detail or release checkpoints");
		let te = /* @__PURE__ */ new Map(), ne = /* @__PURE__ */ new Map();
		for (let e of v) {
			let t = e.existing?.geometry ?? Object.freeze({});
			te.set(e.definition.id, t), ne.set(t, e.existing?.bounds ?? {
				min: [
					0,
					0,
					0
				],
				max: [
					0,
					0,
					0
				]
			});
		}
		Pn(u, te, ne, i);
		let b = /* @__PURE__ */ new Map();
		for (let e of v) {
			let t = e.existing;
			if (!t && e.definition.type === "asset") {
				let n = f.geometryParts.get(e.definition.id);
				t = Object.freeze({
					signature: e.signature,
					geometry: n,
					bounds: $(n, r()),
					vertices: 0,
					geometryBytes: 0,
					estimatedVertices: 0
				});
			} else if (!t) {
				let n = Object.freeze(Q(e.definition, Math.min(i.maxVertices, 1e6), {
					definitions: p,
					chain: []
				})), a = Object.values(n).reduce((e, t) => e + t.byteLength, 0), o = n.positions.length / 3;
				if (e.definition.type === "mesh") {
					for (; _.length > 0 && g.vertices + y - e.estimatedVertices + o > i.maxVertices;) _.shift(), l++, g = Wn(re());
					if (g.vertices + y - e.estimatedVertices + o > i.maxVertices) throw RangeError(`Mesh ${e.definition.id} has ${o} render vertices after its edits, which exceeds maxVertices across the scene. Reduce detail or edits.`);
				} else if (o > e.estimatedVertices || a > e.estimatedVertices * 60) throw RangeError("Generated geometry exceeds its conservative preflight bound.");
				t = Object.freeze({
					signature: e.signature,
					geometry: n,
					bounds: $(n, r()),
					vertices: o,
					geometryBytes: a,
					estimatedVertices: e.estimatedVertices
				});
			}
			b.set(e.definition.id, t);
		}
		let x = new Map([...b].map(([e, t]) => [e, t.geometry])), S = new Map([...b.values()].map((e) => [e.geometry, e.bounds]));
		u.nodes.some((e) => e.relations?.length) && (u.nodes = O("relations").solveRelations(u.nodes, (e, t, n) => {
			let r = x.get(e.geometry);
			return $(n === void 0 ? r : O("mesh").taggedFacePositions(r, n), t);
		}));
		let C = Pn(u, x, S, i), w = De({
			recipe: u,
			graph: C,
			geometryRecords: b,
			cache: ee
		}), T = /* @__PURE__ */ new Map();
		for (let e of u.materials) {
			let r = qn(e), i = t?.materialHandles.get(e.id), a = c.has(e.id) ? null : o?.materialHandles.get(e.id), s = [i, a].find((t) => t && Gn(t.holder.snapshot) === Gn(e)), l = f.materialOutputs.get(e.id), u = l ? Yn(r, l, i, a) : s ?? Kn(r, e.map && O("assets").createTextureSequence(e.id, e.map, n.sequenceFrames), n.sequenceFrames);
			T.set(e.id, u);
		}
		let se = new Map(o?.sourceRestParts.map((e) => [e.name, e]) ?? []), E = new Map(t?.sourceRestParts.map((e) => [e.name, e]) ?? []), D = or(u), k = u.nodes.filter((e) => e.geometry !== void 0).map((e) => {
			let t = w.get(e.id), n = T.get(e.material).output, r = t?.geometry ?? x.get(e.geometry), i = r.vertexGroups?.foam ? O("mesh").waterFoamGeometry(r, n) : r, a = n.wear ? ae(i, n.wear, e.id) : i, o = f.partExtras.get(e.id), c = a.morphTargetValues && !o?.morph ? { weights: Float32Array.from(a.morphTargetValues) } : void 0;
			return [s.has(e.id) ? null : se.get(e.id), E.get(e.id)].find((r) => r?.geometry === a && r.material === n && r.skin === (o?.skin ?? t?.skin) && (o?.morph ? r.morph === o.morph : !!r.morph == !!c) && ye(r) === ye(e) && ar(r, e, D, o)) ?? Object.freeze({
				name: e.id,
				geometry: a,
				material: n,
				...ye(e) ? { depthLayer: ye(e) } : {},
				...ir(e),
				...D ? { visibility: { visible: !0 } } : {},
				matrix: new Float32Array(C.getNode(e.id).worldMatrix),
				...t ? { skin: t.skin } : {},
				...c ? { morph: c } : {},
				...o
			});
		});
		Xn(k);
		let A = o && o.sourceRestParts.length === k.length && o.sourceRestParts.every((e, t) => e === k[t]) ? o.sourceRestParts : Object.freeze(k), j = oe(u, A, C), { reflected: M, restParts: N } = ie(u, A, j, C), P = {
			recipe: u,
			geometryRecords: b,
			geometries: x,
			graph: C,
			materialHandles: T,
			sourceRestParts: A,
			parts: N,
			restParts: N,
			bakeReport: j ? O("bake").withLocalVolumeReport({
				...j.report,
				reused: j.reused
			}, u.environment.localVolumes) : null,
			reflectionReport: M ? M.report : null,
			topologyChanged: !(!o || N === o.restParts && o.parts === o.restParts),
			stats: Wn(b.values())
		};
		P.assetRuntime = f, P.maxGeometryVertices = Math.min(i.maxVertices, 1e6), P.sequences = [...T.values()].map((e) => e.holder.sequence).filter(Boolean), P.localBounds = S, P.skinBindings = w, P.skinStages = Te(w), P.motionSampler = u.motion ? O("motion").compileAgentMotion(u.motion, u) : null, P.physicsSampler = ce(u, b), P.clothSampler = le(u, b, P.motionSampler), P.particleSampler = ue(u, b);
		let F = !!(P.motionSampler || P.physicsSampler || P.clothSampler || P.particleSampler || f.animators.length);
		return P.poseGraph = F ? Pn(u, x, S, i) : null, P.initialPose = tr(P, F ? 0 : null), P;
	}
	function x(e, t) {
		if (!ct(e.environment)) return t;
		let { environment: n } = e, r = Bn(n);
		if (m?.parts === t && m.linksKey === r) return m.linked;
		let i = O("lightLinking").lightMasksFor(t, n), a = /* @__PURE__ */ new Map(), o = Object.freeze(t.map((e, t) => i[t] === -1 ? e : Object.freeze({
			...e,
			material: Vn(e.material, i[t], a)
		})));
		return m = {
			parts: t,
			linksKey: r,
			linked: o
		}, o;
	}
	function S() {
		return p && o.recipe.bake && o.motionSampler ? O("bake").staleBakeProblems(o, p.key) : [];
	}
	function ie(e, t, n, r) {
		let i = n?.parts ?? t, a = w(e, t, i, r);
		return {
			reflected: a,
			restParts: j(e, x(e, T(e, a ? a.parts : i)))
		};
	}
	function C(e) {
		let t = o.recipe.bake?.rebake && O("bake").bakeAtSampledPose(p, o.recipe, e);
		t && (o.restParts = ie(o.recipe, o.sourceRestParts, t, e.graph).restParts, o.bakeReport = O("bake").withLocalVolumeReport(t.report, o.recipe.environment.localVolumes));
	}
	function oe(e, t, n) {
		if (!e.bake) return null;
		let r = new Map(t.map((e) => [e.name, new Float32Array(n.getNode(e.name).worldMatrix)])), i = O("bake").bakeGenerators(e), a = O("bake").lightBakeKey(e, i, e.environment, r);
		if (p?.key === a && p.sourceRestParts === t) return p.currentKey = a, {
			...p,
			reused: !0
		};
		let o = O("bake").bakeAgentParts(t, r, e.environment, e.bake, i);
		return p = {
			key: a,
			currentKey: a,
			sourceRestParts: t,
			parts: o.parts,
			report: o.report
		}, {
			...p,
			reused: !1
		};
	}
	function w(e, t, n, r) {
		return e.environment.objectReflections === !1 || !E("reflections") ? null : (h = O("reflections").stageObjectReflections(h, e, t, n, r, bt(e.environment)), h.result);
	}
	function T(e, t) {
		return E("floorSky") ? O("floorSky").stageFloorSky(e.environment, t) : t;
	}
	function se(e) {
		let t = (e.pointLights?.length ?? 0) + (e.spotLights?.length ?? 0) + (e.areaLights?.length ?? 0), n = e.keyColor ?? [
			1,
			1,
			1
		], r = (e.keyIntensity ?? 1) * (n[0] + n[1] + n[2]);
		return t > 0 && r === 0;
	}
	let D = null;
	function k() {
		if (o.recipe.bake) return [];
		if (D?.revision !== s) {
			let e = new Map(o.parts.map((e) => [e.name, o.graph.getNode(e.name).worldMatrix]));
			D = {
				revision: s,
				share: ve(o.parts, e)
			};
		}
		let { share: e } = D;
		return e !== null && e >= .9 ? [Mt(e, se(o.recipe.environment))] : [];
	}
	let A = null;
	function j(e, t) {
		if (!E("coplanar")) return t;
		let n = O("coplanar");
		if (e.environment.resolveCoplanar === !1) return A && n.clearFlushParts(A.parts), A = null, t;
		if (A?.parts !== t) {
			let e = n.resolveFlushParts(t);
			A = {
				parts: t,
				staged: e.ranked ? Object.freeze([...t]) : t,
				...e
			};
		}
		return A.staged;
	}
	let M = null;
	function P() {
		if (!E("coplanar")) return [];
		if (o.recipe.environment.resolveCoplanar !== !1) return O("coplanar").flushLeftoverDiagnostics(A?.leftovers ?? []);
		if (M?.revision !== s) {
			let e = O("coplanar");
			M = {
				revision: s,
				problems: e.coplanarOverlapDiagnostics(e.findCoplanarOverlaps(o.parts))
			};
		}
		return M.problems;
	}
	function ce(e, t) {
		if (!e.physics) return null;
		let n = O("physics").physicsBakeKey(e, t);
		if (u?.key !== n) {
			let r = new Map([...t].map(([e, t]) => [e, t.geometry]));
			u = {
				key: n,
				sampler: O("physics").bakeAgentPhysics(e.physics, e, r)
			};
		}
		return u.sampler;
	}
	function le(e, t, n) {
		if (!e.cloth) return null;
		let r = new Set([...e.cloth.sheets, ...e.cloth.colliders ?? []].map((e) => e.node)), i = e.nodes.filter((e) => r.has(e.id)), a = e.cloth.sheets.some((e) => e.pinTo) || (e.cloth.colliders ?? []).some((e) => e.node === void 0), o = JSON.stringify([
			e.cloth,
			i,
			i.map((e) => t.get(e.geometry)?.signature),
			a ? [
				e.motion,
				e.nodes,
				e.armatures
			] : null
		]);
		if (d?.key !== o) {
			let r = new Map([...t].map(([e, t]) => [e, t.geometry]));
			d = {
				key: o,
				sampler: O("cloth").bakeAgentCloth(e.cloth, e, r, n)
			};
		}
		return d.sampler;
	}
	function ue(e, t) {
		if (!e.particles) return null;
		let n = e.nodes.filter((t) => e.particles.systems.some((e) => e.node === t.id)), r = JSON.stringify([
			e.particles,
			n,
			n.map((e) => t.get(e.geometry).signature)
		]);
		if (f?.key !== r) {
			let n = new Map([...t].map(([e, t]) => [e, t.geometry]));
			f = {
				key: r,
				sampler: O("particles").bakeAgentParticles(e.particles, e, n)
			};
		}
		return f.sampler;
	}
	function F(e, t) {
		if (ur(e, e.initialPose), e.topologyChanged && c++, t && o) for (_.push({
			revision: s,
			snapshot: v()
		}); _.length > 4;) _.shift();
		return o = e, t && s++, s;
	}
	function de(e) {
		if (K(e, ["expectedRevision"], "transaction options"), !Number.isSafeInteger(e.expectedRevision) || e.expectedRevision !== s) throw y("expectedRevision", e.expectedRevision, `the current revision, ${s}; scene_inspect returns it`);
	}
	return F(b(e), !1), Object.freeze({
		capabilities: N,
		limits: i,
		get parts() {
			return o.parts;
		},
		get releasedRevisions() {
			return l;
		},
		get revision() {
			return s;
		},
		get topologyRevision() {
			return c;
		},
		get camera() {
			return structuredClone(o.renderCamera);
		},
		get motionTime() {
			return o.motionTime;
		},
		sequenceTextures() {
			return o.sequences;
		},
		sampleMotion(e) {
			if (e !== null && (!Number.isFinite(e) || e < 0 || e > 3600)) throw y("time", e, "null or a number of seconds from 0 to 3600, such as 0.5");
			if (e !== null && !o.motionSampler && !o.physicsSampler && !o.clothSampler && !o.particleSampler && !o.assetRuntime.animators.length && !o.sequences.length) throw y("time", e, "null, because this recipe has no motion, physics, cloth, particles or placed asset clip to sample; add motion first");
			let t = tr(o, e);
			return C(t), ur(o, t) && c++, o.motionTime;
		},
		get environment() {
			let e = structuredClone(o.recipe.environment);
			return o.movedLook ? O("motion").motionEnvironment(e, o.movedLook) : e;
		},
		worldBounds() {
			let e = [], t = new Map(o.restParts.map((e) => [e.name, e]));
			for (let n of o.sourceRestParts) {
				let r = t.get(n.name), i = o.localBounds.get(n.geometry);
				if (!r || !i || r.visibility?.visible === !1) continue;
				let a = [];
				for (let e = 0; e < 8; e++) a.push(e & 1 ? i.max[0] : i.min[0], e & 2 ? i.max[1] : i.min[1], e & 4 ? i.max[2] : i.min[2]);
				e.push({
					name: r.name,
					...$({ positions: a }, r.matrix)
				});
			}
			return e;
		},
		bakeStaleness: S,
		get postPasses() {
			return structuredClone(o.recipe.postPasses ?? []);
		},
		get effects() {
			let e = structuredClone(o.recipe.effects);
			return o.movedLook?.effects ? O("motion").motionEffects(e, o.movedLook) : e;
		},
		get shadow() {
			return structuredClone(o.recipe.shadow);
		},
		exportRecipe() {
			return dr(o.recipe);
		},
		rigExport(e = {}) {
			if (!o.recipe.armatures) return {
				nodes: [],
				clips: []
			};
			let t = we(o.recipe, o.graph, o.motionSampler, e);
			return ur(o, tr(o, o.motionTime)), t;
		},
		apply(e, t = {}) {
			if (de(t), !Array.isArray(e) || e.length === 0 || e.length > i.maxOperations) throw y("operations", Array.isArray(e) ? `${e.length} operations` : e, `a list of 1 to ${i.maxOperations} operations, such as [{ "type": "set-camera", "fov": 50 }]`);
			let n = un(e, i.maxRecipeBytes), r = dr(o.recipe), a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set();
			for (let e of n) {
				let t = Object.hasOwn(Lt, e.type) ? Lt[e.type] : null;
				if (t) {
					if (K(e, ["type", t], "operation"), !Object.hasOwn(e, t)) throw y(t, void 0, `a ${t} value, or null to clear it, in a ${e.type} operation`, TypeError);
					r[t] = e[t], r.armatures === null && delete r.armatures;
					continue;
				}
				let n = Object.hasOwn(on, e.type) ? on[e.type] : null;
				if (n) {
					K(e, ["type", n], "operation");
					let t = e[n], i = n === "environment" ? [
						"ground",
						"spotLights",
						"areaLights",
						"shadowCascades",
						"localVolumes",
						"keyAffects",
						"objectReflections",
						"floorSkyTrace",
						"sunBounce",
						"specularAntiAliasing",
						"sunAngularRadius",
						"lines",
						"resolveCoplanar",
						"viewTransform",
						"look",
						"hdri",
						"sky"
					] : n === "effects" ? pe.fields : [];
					K(t, [...Object.keys(r[n]), ...i], n);
					let a = n === "environment" ? "volumeFog" : "bloom", o = {
						...r[n],
						...n === "environment" ? yt(t) : t
					};
					if (a && Object.hasOwn(t, a)) {
						let e = a === "volumeFog" ? [...Object.keys(r[n][a]), ...et] : Object.keys(r[n][a]);
						K(t[a], e, a), o[a] = {
							...r[n][a],
							...t[a]
						};
					}
					t.sky && (o.sky = {
						...r[n].sky,
						...t.sky
					}), r[n] = o;
					continue;
				}
				let i = Object.hasOwn(sn, e.type) ? sn[e.type] : null;
				if (i) {
					let [t, n] = i;
					K(e, ["type", n], "operation");
					let a = e[n];
					if (X(a?.id), e.type === "add-geometry" ? Z(a) : e.type === "add-material" ? mn(a) : hn(a), r[t].some((e) => e.id === a.id)) throw y(`${n}.id`, a.id, `an ID no ${t} entry uses yet; pick a new ID, or remove the existing one first`);
					r[t].push(a);
					continue;
				}
				if (e.type === "bake-motion") {
					O("motionBake").bakeMotion(r, e, er(o));
					continue;
				}
				if (e.type === "edit-mesh") {
					K(e, [
						"type",
						"geometry",
						"edits",
						"replace"
					], "operation");
					let t = fr(r, e, (e) => `Add a mesh geometry with base: { type: '${e}', ... } to edit it.`);
					if (e.replace !== void 0 && typeof e.replace != "boolean") throw y("replace", e.replace, "true or false", TypeError);
					if (!Array.isArray(e.edits)) throw y("edits", e.edits, "an array of mesh edits, such as [{ \"op\": \"extrude\" }]", TypeError);
					t.edits = e.replace ? e.edits : [...t.edits ?? [], ...e.edits], O("mesh").normalizeMeshEdits(t.edits);
					continue;
				}
				if (e.type === "set-mesh-stack") {
					K(e, [
						"type",
						"geometry",
						"stack",
						"apply"
					], "operation");
					let t = fr(r, e, () => "Only mesh geometries have a modifier stack."), n = e.stack ?? t.stack ?? [];
					O("mesh").normalizeMeshStack(n);
					let i = e.apply ?? 0;
					if (!Number.isInteger(i) || i < 0 || i > n.length) throw y("apply", i, `a whole number from 0 to the stack length ${n.length}, such as 0`);
					t.edits = [...t.edits ?? [], ...n.slice(0, i)], t.stack = n.slice(i), O("mesh").normalizeMeshEdits(t.edits);
					continue;
				}
				if (e.type === "remove-node") {
					for (let t of pr(r, e)) a.add(t);
					continue;
				}
				let c = Object.hasOwn(cn, e.type) ? cn[e.type] : null;
				if (c) {
					K(e, ["type", "id"], "operation"), X(e.id);
					let t = r[c].findIndex((t) => t.id === e.id);
					if (t < 0) throw y("id", e.id, `the ID of an existing ${c} entry; scene_inspect lists them`);
					r[c].splice(t, 1), e.type === "remove-material" && s.add(e.id);
					continue;
				}
				let l, u;
				if (e.type === "set-node") u = tn, l = r.nodes.find((t) => t.id === e.id);
				else if (e.type === "set-material") u = [...nn, "map"], l = r.materials.find((t) => t.id === e.id);
				else if (e.type === "set-camera") u = an, l = r.camera;
				else throw y("type", e.type, `one of ${N.operations.join(", ")}`, TypeError);
				if (K(e, [
					"type",
					...e.type === "set-camera" ? [] : ["id"],
					...u
				], "operation"), !l) throw y("id", e.id, `the ID of an existing ${e.type === "set-node" ? "node" : "material"}; scene_inspect lists them, or add it first with an add operation`);
				if (e.type === "set-camera") gn(l, e);
				else for (let t of u) Object.hasOwn(e, t) && (l[t] = e[t]);
			}
			return F(b(r, null, a, s), !0);
		},
		inspect(e = {}) {
			K(e, [
				"ids",
				"limit",
				"includeBounds",
				"path"
			], "inspection");
			let t = dn(e.limit ?? Math.min(64, i.maxNodes), 1, i.maxNodes, "inspection limit");
			if (e.includeBounds !== void 0 && typeof e.includeBounds != "boolean") throw y("includeBounds", e.includeBounds, "true or false", TypeError);
			if (e.ids !== void 0 && (!Array.isArray(e.ids) || e.ids.length > i.maxNodes)) throw y("ids", Array.isArray(e.ids) ? `${e.ids.length} IDs` : e.ids, `a list of at most ${i.maxNodes} node IDs, such as ["body"]`);
			let n = e.ids === void 0 ? o.recipe.nodes.filter((e) => !e.assetPart) : e.ids.map((e) => {
				X(e);
				let t = o.recipe.nodes.find((t) => t.id === e);
				if (!t) throw y("ids", e, "IDs of existing nodes; call scene_inspect without ids to list them");
				return t;
			}), r = n.slice(0, t).map((t) => {
				let n = o.geometries.get(t.geometry), r = {
					id: t.id,
					label: t.label ?? t.id,
					parent: t.parent,
					geometry: t.geometry ?? null,
					material: t.material ?? null,
					vertices: n ? n.positions.length / 3 : 0,
					triangles: n ? n.indices.length / 3 : 0
				};
				return e.includeBounds && (r.bounds = n ? $(n, o.graph.getNode(t.id).worldMatrix) : null), r;
			}), a = Wn(re()), l = [
				...jt(o.recipe),
				...k(),
				...S(),
				...P()
			];
			return {
				revision: s,
				topologyRevision: c,
				...o.recipe.motion?.ik?.length ? { motionIk: O("motion").compileAgentMotion(o.recipe.motion, o.recipe).sweepIk() } : {},
				motion: o.recipe.motion ? {
					duration: o.recipe.motion.duration,
					loop: o.recipe.motion.loop,
					tracks: o.recipe.motion.tracks.length,
					time: o.motionTime
				} : null,
				physics: o.physicsSampler ? o.physicsSampler.report() : null,
				...o.clothSampler ? { cloth: o.clothSampler.report() } : {},
				...o.particleSampler ? { particles: o.particleSampler.report() } : {},
				...o.assetRuntime.vegetation ? { vegetation: o.assetRuntime.vegetation } : {},
				...o.assetRuntime.placements.length ? { assets: O("assets").describeAssetPlacements(o.assetRuntime, o.graph, (e) => o.localBounds.get(e)) } : {},
				...o.sequences.length ? { textureSequences: o.sequences.map((e) => e.describe()) } : {},
				...o.bakeReport ? { bake: o.bakeReport } : {},
				...o.recipe.postPasses?.length ? { postPasses: O("userPass").describeUserPasses(o.recipe.postPasses) } : {},
				...o.reflectionReport ? { reflections: o.reflectionReport } : {},
				...o.recipe.armatures ? { rig: Ae(o.recipe, o.skinBindings) } : {},
				boundsSpace: "authored-base-world",
				...l.length ? { diagnostics: l } : {},
				...A?.ranked ? { flush: { ranked: A.ranked } } : {},
				counts: {
					nodes: o.recipe.nodes.length,
					parts: o.parts.length,
					geometries: o.geometries.size,
					materials: o.recipe.materials.length,
					vertices: o.stats.vertices
				},
				geometryBytes: o.stats.geometryBytes,
				estimatedGeometryBytes: o.stats.estimatedGeometryBytes,
				residentGeometryBytes: a.geometryBytes,
				residentGeometryVertices: a.vertices,
				look: {
					world: o.recipe.environment.world,
					pointLights: o.recipe.environment.pointLights.length,
					spotLights: o.recipe.environment.spotLights?.length ?? 0,
					areaLights: o.recipe.environment.areaLights?.length ?? 0,
					volumeFogDensity: o.recipe.environment.volumeFog.density,
					exposure: o.recipe.effects.exposure
				},
				nodes: r,
				truncated: n.length > r.length,
				...e.path === void 0 ? {} : { path: ne(e.path) }
			};
		},
		inspectMeshes(e = {}) {
			K(e, ["geometries"], "mesh inspection");
			let t = e.geometries ?? [...o.geometries.keys()];
			if (!Array.isArray(t) || e.geometries !== void 0 && t.length > Jt) throw y("geometries", Array.isArray(t) ? `${t.length} IDs` : t, `a list of at most ${Jt} geometry IDs, such as ["block"]`);
			let n = t.slice(0, Jt), r = n.map((e) => {
				X(e);
				let t = o.geometries.get(e);
				if (!t) throw y("geometries", e, `one of ${[...o.geometries.keys()].join(", ")}`);
				return {
					geometry: e,
					...O("mesh").meshReport(t)
				};
			});
			return {
				revision: s,
				meshes: r,
				truncated: t.length > n.length
			};
		},
		checkpoint() {
			if (g.size >= i.maxCheckpoints) throw y("checkpoints", `${g.size} saved`, `at most ${i.maxCheckpoints} saved checkpoints; release one with scene_release_checkpoint first`);
			let e = Object.freeze({});
			return g.set(e, v()), e;
		},
		restore(e, t = {}) {
			de(t);
			let n = g.get(e);
			if (!n) throw y("checkpointId", e, "a checkpointId that scene_checkpoint returned and you have not released");
			return F(b(n.recipe, n), !0);
		},
		restoreRevision(e, t = {}) {
			de(t);
			let n = _.find((t) => t.revision === e);
			if (!n) {
				let t = _.map((e) => e.revision);
				throw y("revision", e, t.length > 0 ? `one of the kept revisions: ${t.join(", ")} (the last 4 are kept; older ones are dropped)` : "a revision this session kept, but none is kept yet because nothing has been edited; apply an edit first");
			}
			return F(b(n.snapshot.recipe, n.snapshot), !0);
		},
		releaseCheckpoint(e) {
			if (!g.delete(e)) throw y("checkpointId", e, "a checkpointId that scene_checkpoint returned and you have not released");
		}
	});
}
export { Gt as a, yt as c, Nn as i, Tt as l, gn as n, Nt as o, mr as r, bt as s, Kt as t, wt as u };
