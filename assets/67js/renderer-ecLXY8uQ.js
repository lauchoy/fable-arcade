/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { _ as e, d as t, f as n, g as r, i, m as a, n as o, o as s, p as c, r as l, v as u } from "./shader-registry-DHYkwAg5.js";
import { _ as d, g as f, h as p, m, n as h, p as g } from "./mat4-BCZClxna.js";
import { r as _, t as v } from "./mat3-BUCH0Dej.js";
import { a as y, c as b, d as x, f as S, i as C, n as ee, o as te, r as w, s as ne, t as re, u as T } from "./shaders-C3WxnVo1.js";
import { a as E, i as D, n as O, o as ie, r as k, s as A, t as ae } from "./gl-program-DIc2K8ep.js";
import { a as oe, i as j, n as M, r as se } from "./budget-DiDbAzh2.js";
import { n as N } from "./camera-DqWdI22s.js";
import { installReversedDepth as ce, prepareCameraRelativeProgram as le } from "./reversed-depth.js";
import { a as ue, i as de, r as fe, s as pe } from "./material-wear-BnrzUuEN.js";
import { n as me, t as P } from "./shadow-light-Oy72milt.js";
import { n as F, t as I } from "./depth-layer-Czrj5Xb7.js";
import { n as he, r as ge } from "./volumetric-D8WftbY1.js";
import { a as L } from "./environment-shading-BFHO3WeH.js";
import { a as _e, o as ve } from "./material-layers-C6j9cFSS.js";
// src/post.js
function ye(e, t, n, r) {
	return `#version 300 es
${e}
precision highp float;
in vec2 textureCoordinate;
uniform sampler2D frameTexture;
uniform float transparent;
uniform sampler2D bloomTexture;
uniform float bloomStrength;
uniform float hdrEnabled;
uniform vec3 grade;
uniform float vignette;
uniform float grainAmount;
uniform vec2 resolution;
uniform float monochrome;
uniform float fade;
uniform float cinematic;
uniform float time;
uniform float volumeExplosion;
uniform float explosionProgress;
uniform mat4 inverseViewProjection;
uniform vec3 eye;
uniform sampler2D sceneDepth;
${n}
uniform sampler2D occlusionTexture;
uniform float occlusionStrength;
uniform vec2 occlusionTexel;
out vec4 outputColor;
float luminance(vec3 color) { return dot(color, vec3(0.299, 0.587, 0.114)); }
float hash(vec3 position) { return fract(sin(dot(position, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float cloudNoise(vec3 position) {
  vec3 cell = floor(position);
  vec3 fraction = fract(position);
  fraction = fraction * fraction * (3.0 - 2.0 * fraction);
  float lower = mix(mix(hash(cell), hash(cell + vec3(1,0,0)), fraction.x), mix(hash(cell + vec3(0,1,0)), hash(cell + vec3(1,1,0)), fraction.x), fraction.y);
  float upper = mix(mix(hash(cell + vec3(0,0,1)), hash(cell + vec3(1,0,1)), fraction.x), mix(hash(cell + vec3(0,1,1)), hash(cell + vec3(1,1,1)), fraction.x), fraction.y);
  return mix(lower, upper, fraction.z);
}
${t}
${r}
void main() {
  vec2 texel = 1.0 / resolution;
  vec3 center = texture(frameTexture, textureCoordinate).rgb;
  vec3 northwest = texture(frameTexture, textureCoordinate + vec2(-1.0, -1.0) * texel).rgb;
  vec3 northeast = texture(frameTexture, textureCoordinate + vec2(1.0, -1.0) * texel).rgb;
  vec3 southwest = texture(frameTexture, textureCoordinate + vec2(-1.0, 1.0) * texel).rgb;
  vec3 southeast = texture(frameTexture, textureCoordinate + vec2(1.0, 1.0) * texel).rgb;
  float centerLuma = luminance(center);
  float northwestLuma = luminance(northwest);
  float northeastLuma = luminance(northeast);
  float southwestLuma = luminance(southwest);
  float southeastLuma = luminance(southeast);
  float minimumLuma = min(centerLuma, min(min(northwestLuma, northeastLuma), min(southwestLuma, southeastLuma)));
  float maximumLuma = max(centerLuma, max(max(northwestLuma, northeastLuma), max(southwestLuma, southeastLuma)));
  vec2 direction = vec2(-((northwestLuma + northeastLuma) - (southwestLuma + southeastLuma)), (northwestLuma + southwestLuma) - (northeastLuma + southeastLuma));
  float reduction = max((northwestLuma + northeastLuma + southwestLuma + southeastLuma) * 0.03125, 0.0078125);
  direction = clamp(direction / (min(abs(direction.x), abs(direction.y)) + reduction), vec2(-6.0), vec2(6.0)) * texel;
  vec3 first = 0.5 * (texture(frameTexture, textureCoordinate + direction * (-1.0 / 6.0)).rgb + texture(frameTexture, textureCoordinate + direction * (1.0 / 6.0)).rgb);
  vec3 second = first * 0.5 + 0.25 * (texture(frameTexture, textureCoordinate - direction * 0.5).rgb + texture(frameTexture, textureCoordinate + direction * 0.5).rgb);
  float secondLuma = luminance(second);
  vec3 color = secondLuma < minimumLuma || secondLuma > maximumLuma ? first : second;
  if (maximumLuma - minimumLuma < max(0.03, maximumLuma * 0.125)) color = center;
  float coverage = POST_TRANSPARENT ? texture(frameTexture, textureCoordinate).a : 1.0;
  if (POST_TRANSPARENT) color = center / max(coverage, 0.00001);
  if (POST_OCCLUSION) {
    float visibility = 0.0;
    for (int row = -1; row <= 1; row++) {
      for (int column = -1; column <= 1; column++) {
        visibility += texture(occlusionTexture, textureCoordinate + vec2(float(column), float(row)) * occlusionTexel).r;
      }
    }
    float directShare = 1.0 / (1.0 + 0.4 * luminance(color));
    color *= mix(1.0, visibility / 9.0, occlusionStrength * directShare);
  }
  if (POST_BLOOM) color += texture(bloomTexture, textureCoordinate).rgb * bloomStrength;
  if (POST_LOCAL) color = localVolumes(color);
  if (POST_VOLUME) color = volumeFog(color);
  if (hdrEnabled > 0.5) {
    color = clamp((color * (2.51 * color + 0.03)) / (color * (2.43 * color + 0.59) + 0.14), 0.0, 1.0);
    color = pow(color, vec3(1.0 / 2.2));
  }
  if (POST_EXPLOSION) color = explosion(color);
  if (POST_FINISH) {
  color = mix(color, vec3(luminance(color)), monochrome);
  if (grade.x != 1.0) color = mix(vec3(luminance(color)), color, grade.x);
  if (grade.y != 1.0) color = (color - 0.5) * grade.y + 0.5;
  if (grade.z != 0.0) color *= vec3(1.0 + grade.z * 0.1, 1.0, 1.0 - grade.z * 0.1);
  vec2 centered = textureCoordinate * 2.0 - 1.0;
  color *= max(0.0, 1.0 - (cinematic * 0.20 + vignette) * dot(centered, centered));
  float grain = fract(sin(dot(gl_FragCoord.xy + floor(time * 24.0), vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
  color += grain * (0.018 * cinematic + grainAmount);
  }
  float alpha = POST_TRANSPARENT ? coverage : 1.0;
  outputColor = vec4(color * (1.0 - fade) * alpha, alpha);
}`;
}
var be = "#version 300 es\nprecision highp float;\nin vec2 textureCoordinate;\nuniform vec3 skyTop;\nuniform vec3 skyBottom;\nuniform vec3 sunDirection;\nuniform mat4 inverseViewProjection;\nuniform vec3 eye;\nuniform float time;\nuniform float daylight;\nuniform float hdrEnabled;\nout vec4 outputColor;\nfloat noise(vec2 position) {\n  return sin(position.x * 2.1 + sin(position.y * 1.3)) * 0.5 + sin(position.y * 2.8 - position.x * 0.8) * 0.3;\n}\nvoid main() {\n  vec4 world = inverseViewProjection * vec4(textureCoordinate * 2.0 - 1.0, 1.0, 1.0);\n  vec3 direction = normalize(world.xyz / world.w - eye);\n  float height = clamp(direction.y * 1.3 + 0.12, 0.0, 1.0);\n  vec3 color = mix(skyBottom, skyTop, pow(height, 0.6));\n  float sun = max(dot(direction, normalize(sunDirection)), 0.0);\n  color += vec3(1.0, 0.72, 0.35) * pow(sun, 300.0) * 0.7 * daylight;\n  color += vec3(0.30, 0.22, 0.12) * pow(sun, 8.0) * daylight;\n  vec2 cloudPosition = direction.xz / max(0.08, direction.y) * 0.5 + vec2(time * 0.006, 0.0);\n  float cloud = smoothstep(0.1, 0.55, noise(cloudPosition) + noise(cloudPosition * 2.4) * 0.25);\n  cloud *= smoothstep(0.02, 0.22, direction.y) * (1.0 - smoothstep(0.5, 0.95, direction.y));\n  color = mix(color, mix(skyBottom, vec3(0.94, 0.93, 0.85), 0.7), cloud * 0.28 * daylight);\n  outputColor = vec4(hdrEnabled > 0.5 ? pow(max(color, vec3(0)), vec3(2.2)) : color, 1.0);\n}", xe = "#version 300 es\nprecision highp float;\nin vec2 textureCoordinate;\nuniform sampler2D sourceTexture;\nuniform vec2 texelDirection;\nuniform float threshold;\nuniform float extract;\nout vec4 outputColor;\nvec3 sampleBloom(vec2 coordinate) {\n  vec3 color = texture(sourceTexture, coordinate).rgb;\n  if (extract > 0.5) {\n    float peak = max(color.r, max(color.g, color.b));\n    color *= max(peak - threshold, 0.0) / max(peak, 0.00001);\n  }\n  return color;\n}\nvoid main() {\n  vec3 color = sampleBloom(textureCoordinate) * 0.227027;\n  color += sampleBloom(textureCoordinate + texelDirection * 1.384615) * 0.316216;\n  color += sampleBloom(textureCoordinate - texelDirection * 1.384615) * 0.316216;\n  color += sampleBloom(textureCoordinate + texelDirection * 3.230769) * 0.070270;\n  color += sampleBloom(textureCoordinate - texelDirection * 3.230769) * 0.070270;\n  outputColor = vec4(color, 1.0);\n}", Se = {
	transparent: ["POST_TRANSPARENT", "transparent > 0.5"],
	occlusion: ["POST_OCCLUSION", "occlusionStrength > 0.0"],
	bloom: ["POST_BLOOM", "bloomStrength > 0.0"],
	volume: ["POST_VOLUME", "volumeDensity > 0.0"],
	sky: ["POST_SKY", "true"],
	field: ["POST_FIELD", "true"],
	detail: ["POST_DETAIL", "true"],
	lights: ["POST_LIGHTS", "volumeLightCount > 0"],
	local: ["POST_LOCAL", "localVolumeCount > 0"],
	explosion: ["POST_EXPLOSION", "volumeExplosion > 0.5"],
	finish: ["POST_FINISH", "true"]
}, Ce = Object.freeze([
	"volume",
	"sky",
	"field",
	"detail",
	"lights",
	"local",
	"explosion"
]), we = Object.freeze(Object.keys(Se).filter((e) => !Ce.includes(e))), Te = "vec3 explosion(vec3 background) { return background; }", Ee = "vec3 volumeFog(vec3 background) { return background; }", De = "vec3 localVolumes(vec3 background) { return background; }";
function Oe(e) {
	if (!e.has("explosion")) return Te;
	let n = t.get("explosion");
	if (!n) throw Error("The explosion step needs its shader code: add import './explosion-shader.js' (the film player does).");
	return n.post;
}
function ke(e) {
	let t = "", n = "";
	if (e.has("volume")) {
		let e = c("volumeFog");
		t += e.postDeclarations, n += e.postFunctions;
	} else n += Ee;
	if (e.has("local")) {
		let e = c("volumeFog");
		t += e.localDeclarations, n += e.localFunctions;
	} else n += De;
	return {
		declarations: t,
		functions: n
	};
}
function Ae(e = we) {
	let t = new Set(e), n = Object.entries(Se).map(([e, [n, r]]) => `#define ${n} ${t.has(e) ? `(${r})` : "false"}`).join("\n"), r = ke(t);
	return ye(n, Oe(t), r.declarations, r.functions);
}
var je = Ae(), Me = "#version 300 es\nprecision highp float;\nin vec2 textureCoordinate;\nuniform sampler2D sceneDepth;\nuniform mat4 inverseViewProjection;\nuniform float radius;\nuniform float projectionScale;\nuniform float aspect;\nuniform float orthographic;\nout vec4 occlusion;\n\nvec3 worldPosition(vec2 uv, float depth) {\n  vec4 point = inverseViewProjection * vec4(uv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);\n  return point.xyz / point.w;\n}\n\nfloat interleavedNoise(vec2 pixel) {\n  return fract(52.9829189 * fract(dot(pixel, vec2(0.06711056, 0.00583715))));\n}\n\nvoid main() {\n  float depth = texture(sceneDepth, textureCoordinate).r;\n  if (depth >= 1.0) {\n    occlusion = vec4(1.0);\n    return;\n  }\n  vec3 position = worldPosition(textureCoordinate, depth);\n  vec3 normal = normalize(cross(dFdx(position), dFdy(position)));\n  if (orthographic < 0.5 && dot(normal, position) > 0.0) normal = -normal;\n  float screenRadius = min(radius * projectionScale / (orthographic > 0.5 ? 1.0 : length(position)), 0.25);\n  float rotation = interleavedNoise(gl_FragCoord.xy) * 6.2831853;\n  float total = 0.0;\n  for (int index = 0; index < 12; index++) {\n    float fraction = (float(index) + 0.5) / float(12);\n    float angle = rotation + float(index) * 2.3999632;\n    vec2 offset = vec2(cos(angle), sin(angle)) * sqrt(fraction) * screenRadius;\n    vec2 sampleUv = textureCoordinate + vec2(offset.x / aspect, offset.y);\n    float sampleDepth = texture(sceneDepth, sampleUv).r;\n    if (sampleDepth >= 1.0) continue;\n    vec3 toSample = worldPosition(sampleUv, sampleDepth) - position;\n    float sampleDistance = length(toSample);\n    float falloff = 1.0 - clamp(sampleDistance / (radius * 1.5), 0.0, 1.0);\n    total += max(dot(normal, toSample) / max(sampleDistance, 0.0001) - 0.15, 0.0) * falloff;\n  }\n  float visibility = clamp(1.0 - 2.5 * total / float(12), 0.0, 1.0);\n  occlusion = vec4(vec3(visibility), 1.0);\n}", Ne = 6, Pe = 1e-6, Fe = /* @__PURE__ */ new WeakMap();
function Ie(e) {
	let t = Fe.get(e);
	if (t) return t;
	let n = e.positions, r = [
		Infinity,
		Infinity,
		Infinity
	], i = [
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let e = 0; e < n.length; e += 3) for (let t = 0; t < 3; t++) r[t] = Math.min(r[t], n[e + t]), i[t] = Math.max(i[t], n[e + t]);
	let a = r.map((e, t) => (e + i[t]) / 2), o = 0;
	for (let e = 0; e < n.length; e += 3) {
		let t = n[e] - a[0], r = n[e + 1] - a[1], i = n[e + 2] - a[2];
		o = Math.max(o, t * t + r * r + i * i);
	}
	let s = Object.freeze({
		center: Object.freeze(a),
		radius: Math.sqrt(o),
		minimum: r,
		maximum: i
	});
	return Fe.set(e, s), s;
}
function Le(e, t) {
	for (let n = 0; n < Ne; n++) {
		let r = n >> 1, i = n % 2 == 0 ? 1 : -1;
		for (let a = 0; a < 4; a++) t[n * 4 + a] = e[a * 4 + 3] + i * e[a * 4 + r];
		let a = Math.hypot(t[n * 4], t[n * 4 + 1], t[n * 4 + 2]);
		for (let e = 0; e < 4; e++) t[n * 4 + e] /= a || 1;
	}
	return t;
}
function Re(e, t) {
	let n = e[t] ** 2 + e[t + 1] ** 2 + e[t + 2] ** 2, r = e[t + 4] ** 2 + e[t + 5] ** 2 + e[t + 6] ** 2, i = e[t + 8] ** 2 + e[t + 9] ** 2 + e[t + 10] ** 2;
	return Math.sqrt(Math.max(n, r, i));
}
function ze(e, t, n, r, i) {
	for (let a = 0; a < Ne; a++) {
		let o = a * 4;
		if (e[o] * t + e[o + 1] * n + e[o + 2] * r + e[o + 3] < -i) return !0;
	}
	return !1;
}
function Be(e, t, n, r) {
	let i = 0;
	for (let a = 1; a < e.length && !(e[a] * t * n > r); a++) i = a;
	return i;
}
var Ve = class {
	constructor(e, t) {
		this.indices = Array.from({ length: t }, () => new Uint32Array(e)), this.counts = new Uint32Array(t), this.visibleCount = 0;
	}
	get isEverything() {
		return this.visibleCount === this.indices[0].length && this.counts[0] === this.visibleCount;
	}
};
function He(e, { instanceData: t, instanceCount: n, stride: r, bounds: i, margin: a = 0, levelErrors: o, planes: s, viewProjection: c, pixelsPerUnit: l, pixelError: u = 1, belowHeight: d = -Infinity, minimumPixelRadius: f = 0 }) {
	e.counts.fill(0), e.visibleCount = 0;
	let p = o.length > 1, [m, h, g] = i.center;
	for (let _ = 0; _ < n; _++) {
		let n = _ * r, v = t[n] * m + t[n + 4] * h + t[n + 8] * g + t[n + 12], y = t[n + 1] * m + t[n + 5] * h + t[n + 9] * g + t[n + 13], b = t[n + 2] * m + t[n + 6] * h + t[n + 10] * g + t[n + 14], x = Re(t, n), S = i.radius * x + a;
		if (y + S < d || ze(s, v, y, b, S)) continue;
		let C = 0;
		if (p || f > 0) {
			let e = c[3] * v + c[7] * y + c[11] * b + c[15];
			if (e > Pe && S * l / e < f) continue;
			C = p && e > Pe ? Be(o, x, l / e, u) : 0;
		}
		e.indices[C][e.counts[C]++] = _, e.visibleCount++;
	}
	return e;
}
// src/near-plane-fit.js
var Ue = .1, We = .05, Ge = .9, Ke = .01;
function qe(e) {
	let t = [
		Infinity,
		Infinity,
		Infinity
	], n = [
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let r of e) {
		if (r.skin || r.morph || r.crowd || !r.matrix) return null;
		let e = Ie(r.geometry);
		for (let i = 0; i < 8; i++) {
			let a = i & 1 ? e.maximum[0] : e.minimum[0], o = i & 2 ? e.maximum[1] : e.minimum[1], s = i & 4 ? e.maximum[2] : e.minimum[2], c = r.matrix;
			for (let e = 0; e < 3; e++) {
				let r = c[e] * a + c[4 + e] * o + c[8 + e] * s + c[12 + e];
				t[e] = Math.min(t[e], r), n[e] = Math.max(n[e], r);
			}
		}
	}
	if (!t.every(Number.isFinite) || !n.every(Number.isFinite)) return null;
	let r = Math.max(...n.map((e, n) => e - t[n])) * We;
	return {
		minimum: t.map((e) => e - r),
		maximum: n.map((e) => e + r)
	};
}
function Je(e, t) {
	let n = Infinity;
	for (let r = 0; r < 8; r++) {
		let i = r & 1 ? e.maximum[0] : e.minimum[0], a = r & 2 ? e.maximum[1] : e.minimum[1], o = r & 4 ? e.maximum[2] : e.minimum[2];
		n = Math.min(n, -(t[2] * i + t[6] * a + t[10] * o + t[14]));
	}
	return n;
}
function Ye(e, t, n) {
	let r = Je(e, t);
	return r > .1 / Ge ? Math.min(r * Ge, n * Ke) : Ue;
}
// src/frame-diagnostics.js
var Xe = 10, Ze = Object.freeze([]);
function Qe(e, t, n, r) {
	return {
		kind: e,
		severity: "warning",
		target: t,
		message: n,
		fix: r
	};
}
function $e(e, t) {
	let n = e[0] * t[0] + e[1] * t[1] + e[2] * t[2], r = Math.hypot(...e) * Math.hypot(...t);
	return r > 1e-6 ? Math.acos(Math.max(-1, Math.min(1, n / r))) * 180 / Math.PI : 0;
}
function et(e, t, n) {
	let r = P(e, t, n), i = $e(r.eye.map((e, t) => e - r.target[t]), t);
	return i < Xe ? null : Qe("shadow-light-direction-mismatch", "shadowBounds.eye", `shadowBounds.eye is ${Math.round(i)} degrees off lightDirection; the eye sets the shadow direction.`, "Drop shadowBounds.eye, or point lightDirection from shadowBounds.target to it.");
}
function tt({ world: e, depth: t, effects: n, lightDirection: r, shadowBounds: i, coplanarProblems: a = null, skinProblems: o = null }) {
	let s = [];
	if (n.ambientOcclusion > 0 && !t && s.push(Qe("ambient-occlusion-without-depth", "effects.ambientOcclusion", `ambientOcclusion is ${n.ambientOcclusion} but the renderer has no depth, so the pass is skipped.`, "Build the renderer with depth: true, or set ambientOcclusion to 0.")), i?.eye && r) {
		let t = et(e, r, i);
		t && s.push(t);
	}
	return a?.length && s.push(...a), o?.length && s.push(...o), s.length ? s : Ze;
}
// src/render-target-ledger.js
var nt = {
	R8: 1,
	RGBA8: 4,
	RGBA16F: 8,
	R11F_G11F_B10F: 4,
	R11F_G11F_B10F: 4,
	DEPTH_COMPONENT16: 2,
	DEPTH_COMPONENT24: 4,
	DEPTH_COMPONENT32F: 4
}, rt = 1048576, it = class {
	targets = /* @__PURE__ */ new Map();
	record(e, { width: t, height: n, format: r, samples: i = 1, layers: a = 1 }) {
		let o = t * n * a * i * nt[r];
		this.targets.set(e, {
			name: e,
			width: t,
			height: n,
			layers: a,
			format: r,
			samples: i,
			bytes: o,
			megabytes: Number((o / rt).toFixed(2))
		});
	}
	release(...e) {
		for (let t of e) this.targets.delete(t);
	}
	report() {
		let e = [...this.targets.values()].sort((e, t) => t.bytes - e.bytes), t = e.reduce((e, t) => e + t.bytes, 0);
		return {
			totalBytes: t,
			totalMegabytes: Number((t / rt).toFixed(2)),
			targets: e
		};
	}
}, at = 2048;
at / 512;
var ot = .05, st = 30, ct = 92 * Math.PI / 180, lt = 4 * Math.PI / 180, ut = 170 * Math.PI / 180, dt = [
	[
		1,
		0,
		0
	],
	[
		-1,
		0,
		0
	],
	[
		0,
		1,
		0
	],
	[
		0,
		-1,
		0
	],
	[
		0,
		0,
		1
	],
	[
		0,
		0,
		-1
	]
], ft = [
	[
		0,
		1,
		0
	],
	[
		0,
		1,
		0
	],
	[
		0,
		0,
		1
	],
	[
		0,
		0,
		-1
	],
	[
		0,
		1,
		0
	],
	[
		0,
		1,
		0
	]
];
function pt(e) {
	return Math.abs(e[1]) > .99 ? [
		1,
		0,
		0
	] : [
		0,
		1,
		0
	];
}
function mt({ light: e, face: t }, n) {
	let r = e.range > 0 ? e.range : st, i = t === -1, a = i ? Math.min(2 * (e.angle ?? Math.PI / 4) + lt, ut) : ct, o = i ? e.direction : dt[t], s = i ? pt(o) : ft[t], c = [
		e.position[0] + o[0],
		e.position[1] + o[1],
		e.position[2] + o[2]
	], l = m(h(), e.position, c, s), u = d(h(), a, 1, ot, r);
	return p(n, u, l), 2 * Math.tan(a / 2) / 512;
}
function ht(e) {
	let t = e % 4, n = Math.floor(e / 4);
	return [
		t * 512,
		n * 512,
		512,
		512
	];
}
Object.freeze(/* @__PURE__ */ "map.normalMap.metallicRoughnessMap.occlusionMap.emissiveMap.tag.alphaMode.alphaCutoff.opacity.doubleSided.occlusionStrength.moss.boxMapScale.boxMapAxis.lightMapScale.layerMaps.lightMask.clearcoat.clearcoatRoughness.transmission.thickness.ior.sheenRoughness.specular.anisotropy.anisotropyRotation.iridescence.iridescenceIor.iridescenceThickness.attenuationDistance.toon".split(".")), Object.freeze([
	"normalScale",
	"mossColor",
	"lightMap",
	"attenuationColor",
	"sheenColor",
	"specularColor",
	"subsurface",
	"wear"
]);
function gt(e) {
	return e.normalScale === void 0 && e.mossColor === void 0 && e.lightMap === void 0 && e.attenuationColor === void 0 && e.sheenColor === void 0 && e.specularColor === void 0 && e.subsurface === void 0 && e.wear === void 0;
}
var _t = class e {
	static of(t) {
		return gt(t) ? new e(t) : null;
	}
	constructor(e) {
		this.map = e.map, this.normalMap = e.normalMap, this.metallicRoughnessMap = e.metallicRoughnessMap, this.occlusionMap = e.occlusionMap, this.emissiveMap = e.emissiveMap, this.tag = e.tag, this.alphaMode = e.alphaMode, this.alphaCutoff = e.alphaCutoff, this.opacity = e.opacity, this.doubleSided = e.doubleSided, this.occlusionStrength = e.occlusionStrength, this.moss = e.moss, this.boxMapScale = e.boxMapScale, this.boxMapAxis = e.boxMapAxis, this.lightMapScale = e.lightMapScale, this.layerMaps = e.layerMaps, this.lightMask = e.lightMask, this.clearcoat = e.clearcoat, this.clearcoatRoughness = e.clearcoatRoughness, this.transmission = e.transmission, this.thickness = e.thickness, this.ior = e.ior, this.sheenRoughness = e.sheenRoughness, this.specular = e.specular, this.anisotropy = e.anisotropy, this.anisotropyRotation = e.anisotropyRotation, this.iridescence = e.iridescence, this.iridescenceIor = e.iridescenceIor, this.iridescenceThickness = e.iridescenceThickness, this.attenuationDistance = e.attenuationDistance, this.toon = e.toon;
	}
	matches(e) {
		return gt(e) && this.map === e.map && this.normalMap === e.normalMap && this.metallicRoughnessMap === e.metallicRoughnessMap && this.occlusionMap === e.occlusionMap && this.emissiveMap === e.emissiveMap && this.tag === e.tag && this.alphaMode === e.alphaMode && this.alphaCutoff === e.alphaCutoff && this.opacity === e.opacity && this.doubleSided === e.doubleSided && this.occlusionStrength === e.occlusionStrength && this.moss === e.moss && this.boxMapScale === e.boxMapScale && this.boxMapAxis === e.boxMapAxis && this.lightMapScale === e.lightMapScale && this.layerMaps === e.layerMaps && this.lightMask === e.lightMask && this.clearcoat === e.clearcoat && this.clearcoatRoughness === e.clearcoatRoughness && this.transmission === e.transmission && this.thickness === e.thickness && this.ior === e.ior && this.sheenRoughness === e.sheenRoughness && this.specular === e.specular && this.anisotropy === e.anisotropy && this.anisotropyRotation === e.anisotropyRotation && this.iridescence === e.iridescence && this.iridescenceIor === e.iridescenceIor && this.iridescenceThickness === e.iridescenceThickness && this.attenuationDistance === e.attenuationDistance && this.toon === e.toon;
	}
}, vt = .006, yt = 1.2;
function bt(e) {
	let t = 0;
	for (let n = 0; n < 3; n++) t = Math.max(t, Math.hypot(e[n * 4], e[n * 4 + 1], e[n * 4 + 2]));
	return t;
}
function xt(e) {
	let t = [
		Infinity,
		Infinity,
		Infinity
	], n = [
		-Infinity,
		-Infinity,
		-Infinity
	];
	for (let r of e) {
		if (!r.geometry?.positions?.length || !r.matrix) continue;
		let e = Ie(r.geometry), i = r.matrix, a = e.radius * bt(i);
		for (let r = 0; r < 3; r++) {
			let o = i[r] * e.center[0] + i[4 + r] * e.center[1] + i[8 + r] * e.center[2] + i[12 + r];
			t[r] = Math.min(t[r], o - a), n[r] = Math.max(n[r], o + a);
		}
	}
	return Number.isFinite(t[0]) ? Math.hypot(n[0] - t[0], n[1] - t[1], n[2] - t[2]) : 0;
}
function St(e) {
	let t = xt(e);
	return t > 0 ? Math.min(vt, yt / t) : vt;
}
// src/renderer.js
var Ct = 2048, wt = /* @__PURE__ */ new Set(["liquid", "foam"]), R = 42, Tt = 41, Et = 3e38, Dt = {
	opaque: 0,
	mask: 1,
	blend: 2,
	add: 3
};
function Ot(e) {
	return e === "blend" || e === "add";
}
var z = Object.freeze([
	0,
	0,
	0
]), B = [
	"map",
	"normalMap",
	"metallicRoughnessMap",
	"occlusionMap",
	"emissiveMap"
], kt = [
	"baseMap",
	"normalMap",
	"metallicRoughnessMap",
	"occlusionMap",
	"emissiveMap"
], At = [
	"hasBaseMap",
	"hasNormalMap",
	"hasMetallicRoughnessMap",
	"hasOcclusionMap",
	"hasEmissiveMap"
], jt = [1, 1], Mt = 8, V = /* @__PURE__ */ new Set([
	"water",
	"foliage",
	"grass",
	"terrain",
	"floor",
	"fire",
	"smoke",
	"liquid",
	"foam"
]), Nt = /* @__PURE__ */ new Set(["foliage", "grass"]), Pt = 1e-4, Ft = 2 ** -19, It = 2 ** -22, Lt = 4 / 256, Rt = /* @__PURE__ */ new Float32Array(4), zt = /* @__PURE__ */ new Set([
	"foliage",
	"grass",
	"water",
	"fire",
	"smoke"
]), Bt = .56, Vt = /* @__PURE__ */ "transparent.frameTexture.bloomTexture.bloomStrength.hdrEnabled.grade.vignette.grainAmount.resolution.monochrome.fade.cinematic.time.volumeExplosion.explosionProgress.inverseViewProjection.eye.sceneDepth.volumeShadowMap.volumeLightProjection.volumeLightDirection.volumeLightColor.volumeDensity.volumeMinimum.volumeMaximum.volumeColor.volumeAmbient.volumeDrift.volumeSteps.volumeAnisotropy.volumeShadowAmbient.volumeGridFog.volumeNoiseAmount.volumeNoiseScale.volumeHeightFalloff.volumeMaxDistance.volumeField.volumeProfile.volumeFlowStrength.volumeFlowPeriod.volumeLightCount.volumeLightPositions[0].volumeLightColors[0].volumeLightDirections[0].volumeLightCones[0].fogSkyVisibility.orthographic.occlusionTexture.occlusionStrength.occlusionTexel".split(".");
function Ht(e, t) {
	return Object.fromEntries(Vt.map((n) => [n, e.getUniformLocation(t, n)]));
}
var Ut = [
	"baseMap",
	"normalMap",
	"metallicRoughnessMap",
	"occlusionMap",
	"emissiveMap"
], Wt = [
	"skin",
	"crowd",
	"morph",
	"lightMap",
	"waterReflection"
], Gt = [
	"moss",
	"anisotropy",
	"iridescence",
	"toon",
	"boxMapScale"
], Kt = /* @__PURE__ */ new Set([
	"floor",
	"water",
	"foliage",
	"terrain",
	"grass",
	"fire",
	"smoke",
	"unlit"
]);
function qt(e) {
	let t = [];
	return e.spotCount > 0 && t.push("spotLights"), e.areaCount > 0 && t.push("areaLights"), e.shadowCasters.length > 0 && t.push("localShadows"), e.extraFeatures && t.push(...e.extraFeatures), e.fillIntensity > 0 && t.push("fill"), t;
}
function Jt(e) {
	let t = /* @__PURE__ */ new Set(), n = [], r = /* @__PURE__ */ new Map(), i = null;
	for (let a of e) {
		let e = Yt([a]);
		[...e].some((e) => !t.has(e)) && (e.forEach((e) => t.add(e)), n.push(a)), !i && r.has(a.geometry) ? i = [r.get(a.geometry), a] : r.has(a.geometry) || r.set(a.geometry, a);
	}
	if (i) for (let e of i) n.includes(e) || n.push(e);
	return n.length > 0 ? n : e.slice(0, 1);
}
function Yt(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		let { material: e } = n;
		for (let r of Wt) (n[r] || e[r]) && t.add(r);
		B.forEach((n, r) => {
			e[n] && t.add(Ut[r]);
		}), vn(n) && t.add("tintedShadows"), e.environmentProbe && t.add("probe"), e.irradianceGrid && t.add("irradianceGrid"), e.normalMap?.uvTransform && t.add("normalMapTransform"), Object.keys(e.layerMaps ?? {}).forEach((e) => t.add(e)), e.layers && t.add("splat");
		for (let n of Gt) e[n] > 0 && t.add(n);
		e.lightMask !== void 0 && t.add("lightLinking"), (e.alphaMode ?? "opaque") !== "opaque" && t.add("alphaMode"), e.subsurface?.weight > 0 && t.add("subsurface"), e.wear && t.add("surfaceWear"), e.snippet && t.add(e.snippet.feature), ve(e, "clearcoat") > 0 && t.add("clearcoat"), ve(e, "sheenColor").some((e) => e !== 0) && t.add("sheen"), Kt.has(e.tag) && t.add(e.tag), [n.geometry, ...(n.lods ?? []).map((e) => e.geometry)].some((e) => e.colors || $(e)) && t.add("vertexColors");
	}
	return t;
}
function H(e) {
	return e.transmission > 0 ? "liquid" : wt.has(e.tag) ? e.tag : "opaque";
}
function Xt(t, n = !!e.begin) {
	return !!(t.skin || t.morph || t.geometry.morphTargets || t.geometry.skinIndices || wn(t.material) && !n);
}
function U(e) {
	return e.pass ?? "opaque";
}
var Zt = [
	"skinEnabled",
	"skinInfluences",
	"jointPalette",
	"crowdEnabled"
], Qt = [
	"alphaMode",
	"alphaCutoff",
	"materialOpacity",
	"alphaToCoverage",
	"doubleSided"
], $t = [
	"alphaMasked",
	"alphaCutoff",
	"materialOpacity",
	"hasBaseMap",
	"baseMap",
	"tintPass",
	"tintTransmission",
	"tintMapSize",
	"tintBias",
	"opaqueShadow"
], en = [
	"morphEnabled",
	"morphVertexCount",
	"morphTargetCount",
	"morphWeights[0]",
	"morphTargets"
], tn = [
	"environmentSpecular",
	"environmentEnabled",
	"environmentIntensity",
	"environmentRotation",
	"environmentLevelMax",
	"environmentBrdf",
	"environmentIrradiance[0]"
], nn = 6, W = 9, rn = 10, an = 15, on = 13, G = 1024, sn = 2, cn = [
	"pointLightCount",
	"pointLightPositions[0]",
	"pointLightColors[0]",
	"pointLightRadii[0]",
	"pointLightShadowTiles[0]",
	"spotLightCount",
	"spotLightPositions[0]",
	"spotLightColors[0]",
	"spotLightDirections[0]",
	"spotLightParameters[0]",
	"areaLightCount",
	"areaLightPositions[0]",
	"areaLightColors[0]",
	"areaLightNormals[0]",
	"areaLightTangents[0]",
	"localShadowAtlas",
	"localShadowMatrices[0]",
	"localShadowTexelAngles[0]",
	"keyColor",
	"fillIntensity",
	"ambientIntensity",
	"specularAntiAliasing"
], ln = [
	"splatEnabled",
	"splatColor",
	"splatNormal",
	"splatPacked",
	"splatMask",
	"splatLayer[0]",
	"splatTint[0]",
	"splatSlope[0]",
	"splatHeightRange[0]",
	"splatMaskChannel[0]",
	"splatMaskInvert[0]",
	"splatBlend",
	"splatOptions",
	"splatMaskBounds",
	"splatVariation"
];
function un(e) {
	if (V.has(e.tag)) for (let t = 1; t < B.length; t++) {
		let n = B[t] === "normalMap" && Nt.has(e.tag);
		if (e[B[t]] && !n) throw Error("Material maps require a standard PBR material tag. Procedural tags accept only a base map, and foliage and grass also a normal map.");
	}
	if (e.tag === "unlit" && (e.normalMap || e.metallicRoughnessMap || e.occlusionMap)) throw Error("Unlit materials support only base and emissive maps.");
	let t = e.normalScale ?? jt;
	if (t.length !== 2 || !Number.isFinite(t[0]) || !Number.isFinite(t[1]) || !Number.isFinite(Math.fround(t[0])) || !Number.isFinite(Math.fround(t[1]))) throw Error("normalScale must contain two finite floats.");
	let n = e.occlusionStrength ?? 1;
	if (!Number.isFinite(n) || n < 0 || n > 1) throw Error("occlusionStrength must be within zero and one.");
	fn(e);
}
var dn = Object.freeze([
	.05,
	.085,
	.02
]);
function fn(e) {
	if (e.moss === void 0) return;
	if (typeof e.moss != "number" || !(e.moss >= 0 && e.moss <= 1)) throw Error("moss must be within zero and one.");
	if (e.moss > 0 && V.has(e.tag)) throw Error("Moss needs a standard PBR material tag.");
	let t = e.mossColor ?? dn;
	if (!Array.isArray(t) || t.length !== 3 || !t.every(Number.isFinite)) throw Error("mossColor must be three linear RGB numbers.");
}
function pn(e) {
	return [e.moss ?? 0, ...e.mossColor ?? dn];
}
function mn(e) {
	un(e);
	let t = e.normalScale ?? jt, n = e.occlusionStrength ?? 1;
	if ((e.layers || e.splat) && a().validate(e), e.layers && V.has(e.tag)) throw Error("Splat layers require a standard PBR material tag.");
	return [
		...B.map((t) => e[t] ?? null),
		t[0],
		t[1],
		n,
		...pn(e),
		e.boxMapScale ?? 0,
		e.boxMapAxis ?? 1,
		...hn(e),
		e.layers ?? null,
		e.splat ?? null,
		e.layerMaps ?? null,
		e.environmentProbe ?? null,
		e.waterReflection ?? null,
		e.irradianceGrid ?? null,
		e.wear ?? null
	];
}
function hn(e) {
	if (!e.lightMap) return [null, 0];
	let t = e.lightMapScale ?? 1;
	if (!Number.isFinite(t) || t < 0) throw RangeError("lightMapScale must be a nonnegative number.");
	if ((e.lightMap.colorSpace ?? "srgb") !== "srgb") throw Error("lightMap requires an srgb texture descriptor.");
	return [e.lightMap, t];
}
function gn(e) {
	let t = e.alphaMode ?? "opaque";
	if (!Object.hasOwn(Dt, t)) throw Error("alphaMode must be 'opaque', 'mask', 'blend' or 'add'.");
	for (let t of ["alphaCutoff", "opacity"]) {
		let n = e[t] ?? 1;
		if (typeof n != "number" || !Number.isFinite(n) || n < 0 || n > 1) throw Error(`${t} must be a number within zero and one.`);
	}
	if (e.doubleSided !== void 0 && typeof e.doubleSided != "boolean") throw TypeError("doubleSided must be a boolean");
}
function _n(e) {
	return Ot(e.alphaMode ?? "opaque") ? (e.opacity ?? 1) + (e.opacityBias ?? 0) : 1;
}
function K(e) {
	gn(e);
	let t = e.alphaMode ?? "opaque";
	return [
		t,
		t === "mask" ? e.alphaCutoff ?? .5 : 0,
		t === "mask" ? (e.opacity ?? 1) + (e.opacityBias ?? 0) : 1,
		e.doubleSided === !0
	];
}
function q(e) {
	let t = e.material.alphaMode ?? "opaque", n = t === "blend" && I(e) > 0;
	return e.castShadow ?? !(e.shadowCatcher === !0 || t === "add" || n);
}
function vn(e) {
	return q(e) && e.material.tag !== "floor" && ((e.material.alphaMode ?? "opaque") === "blend" || e.material.transmission > 0);
}
var yn = (e) => e.receiveShadow !== !1, bn = (e) => e.holdout === !0 ? 1 : e.shadowCatcher === !0 ? 2 : 0, xn = [
	"castShadow",
	"receiveShadow",
	"holdout",
	"shadowCatcher",
	"visible"
];
function Sn(e) {
	for (let t of xn) if (e[t] !== void 0 && typeof e[t] != "boolean") throw TypeError(`${t} must be a boolean`);
	if (e.holdout === !0 && e.shadowCatcher === !0) throw Error(`A part is a holdout or a shadow catcher, not both: ${e.name}`);
}
var Cn = (e) => e.visible === !1 || e.visibility?.visible === !1;
function wn(e) {
	return B.some((t) => e[t]);
}
var Tn = 2 ** 128 - 2 ** 103;
function En(e) {
	return typeof e == "number" && e > -Tn && e < Tn;
}
function J(e, t) {
	if (e?.length !== t) return !1;
	if (e instanceof Float32Array) {
		let n = 0;
		for (let r = 0; r < t; r++) n += e[r] * 0;
		return n === 0;
	}
	for (let n = 0; n < t; n++) if (!En(e[n])) return !1;
	return !0;
}
function Dn(e, t = v()) {
	if (!J(e.matrix, 16)) throw Error(`Invalid transform: ${e.name}`);
	if (!_(t, e.matrix) || !J(t, 9)) throw Error(`Singular transform: ${e.name}`);
	let n = e.material, r = e.assembly;
	if (!J(n.color, 3) || n.emissiveColor !== void 0 && !J(n.emissiveColor, 3) || r && (!J(r.offset ?? z, 3) || !J(r.detailOffset ?? z, 3))) throw Error(`Invalid instance vector: ${e.name}`);
	if (!En(e.material.metallic) || !En(e.material.roughness) || !En(e.material.emission ?? 0)) throw Error(`Invalid material: ${e.name}`);
	return t;
}
function On(e, t, n) {
	e[t] = n[0], e[t + 1] = n[1], e[t + 2] = n[2];
}
function kn(e) {
	return e[0] * (e[5] * e[10] - e[6] * e[9]) - e[4] * (e[1] * e[10] - e[2] * e[9]) + e[8] * (e[1] * e[6] - e[2] * e[5]) < 0;
}
function An(e, t, n, r) {
	let i = t * R, a = n.material;
	Cn(n) ? e.fill(0, i, i + 25) : (e.set(n.matrix, i), e.set(r, i + 16)), On(e, i + 25, a.color), e[i + 28] = a.metallic, e[i + 29] = a.roughness, e[i + 30] = a.emission ?? 0, e[i + 31] = s[a.tag] ?? 0, On(e, i + 32, n.assembly?.offset ?? z), On(e, i + 35, n.assembly?.detailOffset ?? z), On(e, i + 38, a.emissiveColor ?? a.color), e[i + Tt] = _n(a);
}
var jn = 5;
function Mn(e) {
	let t = e[0];
	return t.skin || t.morph || zt.has(t.material.tag) && !Nt.has(t.material.tag) || H(t.material) !== "opaque" || Ot(K(t.material)[0]) ? !1 : e.every((e) => !e.assembly || e.crowd);
}
function Nn(e, t) {
	if (!Array.isArray(t) || t.length < 2 || t[0].geometry !== e.geometry) throw TypeError(`lods must list level 0 (the own geometry of the part) and at least one coarser level: ${e.name}`);
	t.forEach((n, r) => {
		if (!n.geometry?.positions || !n.geometry.indices) throw TypeError(`Every lods entry needs a geometry: ${e.name}`);
		if (!Number.isFinite(n.error) || n.error < 0 || r > 0 && n.error < t[r - 1].error) throw RangeError(`lods errors must be finite and not decrease from level to level: ${e.name}`);
	});
}
function Pn(e) {
	let t = [
		e.geometry,
		...(e.lods ?? []).map((e) => e.geometry),
		...(e.shadowLods ?? []).map((e) => e.geometry)
	], n = F(e)?.geometry;
	return n && t.push(n), t;
}
function Fn(e, t) {
	return {
		levelErrors: e.map((e) => e.error),
		levelGeometries: e.map((e) => e.geometry),
		levelDraws: [],
		selection: new Ve(t, e.length)
	};
}
function In(e) {
	let t = Infinity, n = -Infinity;
	for (let { geometry: r, matrix: i } of e) {
		if (!r?.positions?.length || !i) continue;
		let { minimum: e, maximum: a } = Ie(r), o = i[13], s = 0;
		for (let t = 0; t < 3; t++) {
			let n = i[1 + t * 4];
			o += Math.min(n * e[t], n * a[t]), s += Math.abs(n) * (a[t] - e[t]);
		}
		t = Math.min(t, o), n = Math.max(n, o + s);
	}
	let r = n - t;
	return .019 - t > r * .1 ? t + r * .02 : .019;
}
function Ln(e = .019) {
	return {
		name: "Studio floor",
		geometry: {
			positions: new Float32Array([
				-100,
				e,
				-100,
				-100,
				e,
				100,
				100,
				e,
				100,
				100,
				e,
				-100
			]),
			normals: new Float32Array([
				0,
				1,
				0,
				0,
				1,
				0,
				0,
				1,
				0,
				0,
				1,
				0
			]),
			indices: new Uint32Array([
				0,
				1,
				2,
				0,
				2,
				3
			])
		},
		matrix: h(),
		material: {
			color: [
				.04,
				.05,
				.06
			],
			metallic: 0,
			roughness: 1,
			emission: 0,
			tag: "floor"
		}
	};
}
var Y = () => n("validateSkinGeometry", "skinning.js"), X = () => n("validateMorphGeometry", "morph.js"), Rn = (e) => !!(e.skin || e.geometry.skinIndices || e.geometry.skinWeights), zn = (e) => !!(e.morph || e.geometry.morphTargets !== void 0);
function Z(e, t = !0) {
	let n = /* @__PURE__ */ new Map(), r = [], i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
	for (let s of e) {
		if (Dn(s), Sn(s), Rn(s)) {
			let { validateSkinGeometry: e, validateSkinPose: t } = Y();
			e(s.geometry, s.skin), s.skin && t(s.skin, s.geometry, s.matrix);
		}
		if (s.skin && V.has(s.material.tag)) throw Error("Skinned parts require a standard material tag.");
		if (zn(s)) {
			let { validateMorphGeometry: e, validateMorphPose: t, validateMorphTransform: n } = X();
			i.has(s.geometry) ? t(s.morph, i.get(s.geometry)) : i.set(s.geometry, e(s.geometry, s.morph)), s.morph && n(s.morph, i.get(s.geometry), s.matrix, s.skin);
		}
		if (s.morph && V.has(s.material.tag)) throw Error("Morphed parts require a standard material tag.");
		let e = t ? s.geometry : s;
		n.has(e) || n.set(e, /* @__PURE__ */ new Map());
		let c = n.get(e), l = a.get(s.material);
		l || (l = [...mn(s.material), ..._e(s.material)], a.set(s.material, l));
		let u = o.get(s.material);
		u || (u = [
			H(s.material),
			...K(s.material),
			s.material.aovMap ?? null,
			s.material.transmissionMap ?? null,
			...s.material.aov ?? z
		], o.set(s.material, u));
		for (let e of [
			...l,
			s.skin ?? null,
			s.material.snippet,
			s.crowd ?? null,
			s.morph ?? null,
			q(s),
			yn(s),
			bn(s),
			I(s),
			F(s),
			s.lods ?? null,
			s.shadowLods ?? null,
			kn(s.matrix),
			...u
		]) c.has(e) || c.set(e, /* @__PURE__ */ new Map()), c = c.get(e);
		if (!c.has("parts")) {
			let e = [];
			c.set("parts", e), r.push(e);
		}
		c.get("parts").push(s);
	}
	return r;
}
function Bn(e, t, n = !0) {
	let r = e && n && e.parts.length <= t.length && e.parts.every((e, n) => e === t[n]) ? t.slice(e.parts.length) : null;
	if (r && r.every((t) => !e.geometries.has(t.geometry))) {
		for (let t of r) e.geometries.add(t.geometry);
		let i = [...e.batches, ...Z(r, n)];
		return {
			batches: i,
			state: {
				parts: t.slice(),
				geometries: e.geometries,
				batches: i
			}
		};
	}
	let i = Z(t, n);
	return {
		batches: i,
		state: {
			parts: t.slice(),
			geometries: new Set(t.map((e) => e.geometry)),
			batches: i
		}
	};
}
function Vn(e, t, n, r, i) {
	if (!i) return {
		batches: Z(n ? [...t, n] : t, r),
		state: null
	};
	let a = Bn(e, t, r);
	return n ? {
		batches: a.state.geometries.has(n.geometry) ? Z([...t, n], r) : [...a.batches, ...Z([n], r)],
		state: a.state
	} : a;
}
function Q(e, t = Infinity) {
	let n = e.image?.naturalWidth ?? e.image?.width, r = e.image?.naturalHeight ?? e.image?.height;
	if (!Number.isInteger(n) || !Number.isInteger(r) || n <= 0 || r <= 0 || n > t || r > t) throw Error("Texture image dimensions are invalid or exceed MAX_TEXTURE_SIZE.");
	if (![0, 1].includes(e.uvChannel ?? 0)) throw Error("Only texture UV channels 0 and 1 are supported.");
	if (e.transform || e.offset || e.repeat || e.rotation !== void 0 || e.extensions && Object.keys(e.extensions).length) throw Error("Texture transforms and extensions are unsupported. Bake them into UV channel 0.");
	if (e.colorSpace && !["srgb", "linear"].includes(e.colorSpace)) throw Error("Texture color space must be srgb or linear.");
	let i = e.wrapS ?? 10497, a = e.wrapT ?? 10497, o = e.minFilter ?? 9987, s = e.magFilter ?? 9729;
	if (![
		10497,
		33071,
		33648
	].includes(i) || ![
		10497,
		33071,
		33648
	].includes(a)) throw Error("Unsupported texture wrap mode.");
	if (![
		9728,
		9729,
		9984,
		9985,
		9986,
		9987
	].includes(o) || ![9728, 9729].includes(s)) throw Error("Unsupported texture filtering mode.");
	let c = e.image.compressed;
	if (c) return {
		width: n,
		height: r,
		wrapS: i,
		wrapT: a,
		minFilter: c.minFilter(o),
		magFilter: s,
		mipmaps: !1,
		bytes: c.bytes
	};
	let l = o >= 9984;
	return {
		width: n,
		height: r,
		wrapS: i,
		wrapT: a,
		minFilter: o,
		magFilter: s,
		mipmaps: l,
		bytes: se(n, r, { mipmaps: l })
	};
}
function Hn(e, t, n) {
	let r = Array.from(e.getInternalformatParameter(e.RENDERBUFFER, t, e.SAMPLES)), i = Array.from(e.getInternalformatParameter(e.RENDERBUFFER, e.DEPTH_COMPONENT24, e.SAMPLES));
	return Math.max(0, ...r.filter((e) => e <= n && i.includes(e)));
}
function Un(e) {
	return e.lightUvs ? e.lightUvs.byteLength * 2 : e.uvs?.byteLength ?? 0;
}
function Wn(e) {
	let t = e.lightUvs.length / 2, n = new Float32Array(t * 4);
	for (let r = 0; r < t; r++) n[r * 4] = e.uvs?.[r * 2] ?? 0, n[r * 4 + 1] = e.uvs?.[r * 2 + 1] ?? 0, n[r * 4 + 2] = e.lightUvs[r * 2], n[r * 4 + 3] = e.lightUvs[r * 2 + 1];
	return n;
}
function $(e) {
	return e.surfaceMasks ?? e.skyVisibility;
}
function Gn(e) {
	let t = $(e).length, n = new Float32Array(t * 4);
	for (let r = 0; r < t; r++) {
		for (let t = 0; t < 3; t++) n[r * 4 + t] = e.colors ? e.colors[r * 3 + t] : 1;
		n[r * 4 + 3] = $(e)[r];
	}
	return n;
}
function Kn(e) {
	let t = [
		"positions",
		"normals",
		"colors",
		"indices"
	].reduce((t, n) => t + (e[n]?.byteLength ?? 0), Un(e));
	return $(e) ? t - (e.colors?.byteLength ?? 0) + $(e).length * 16 : t;
}
function qn(e) {
	let t = e.positions?.length / 3;
	if (!(e.positions instanceof Float32Array) || !Number.isInteger(t) || t < 1 || !(e.normals instanceof Float32Array) || e.normals.length !== t * 3 || !(e.indices instanceof Uint32Array) || e.indices.length < 3 || e.indices.length % 3 != 0) throw TypeError("Replacement geometry needs matching Float32 positions/normals and Uint32 triangles.");
	for (let [n, r] of [
		["positions", 3],
		["normals", 3],
		["uvs", 2],
		["colors", 3]
	]) {
		let i = e[n];
		if ((i || !["uvs", "colors"].includes(n)) && (!(i instanceof Float32Array) || i.length !== t * r || !Jn(i))) throw TypeError(`Replacement ${n} must contain finite matching Float32 data.`);
	}
	let n = e.indices;
	for (let e = 0; e < n.length; e++) if (n[e] >= t) throw RangeError("Replacement triangle indices must address existing vertices.");
}
function Jn(e) {
	for (let t = 0; t < e.length; t++) {
		let n = e[t];
		if (!(n > -Infinity && n < Infinity)) return !1;
	}
	return !0;
}
var Yn = class {
	constructor(e, t, { batching: n = !0, pixelRatio: r = 1.5, benchmark: i = !1, world: o = !1, ground: s = !0, transparent: c = !1, samples: l = 4, hdr: u = !1, depth: d = !1, memoryBudgetMiB: f, environment: p = {}, shadowBounds: m = {}, shadowCascades: g = null, culling: _ = !0, lodPixelError: v = 1, createGpuTimer: b = null, skyOpenness: x = null, fogSkyVisibility: S = null, shading: C = "full", viewTransform: w = "aces", look: ne = null, resolveCoplanar: T = !1, reversedDepth: E = "auto", deferProgramLink: O = !1, deferEnvironmentPrefilter: ie = !1 } = {}) {
		if (this.canvas = e, this.sceneParts = t, this.skyOpenness = x, this.fogSkyVisibility = S, this.fogFieldOverride = null, this.fogFieldTexture = null, this.fogLightBuffers = null, this.createGpuTimer = b, this.gpuTimer = void 0, this.gpuMilliseconds = null, this.culling = _, this.lodPixelError = v, this.frustumPlanes = /* @__PURE__ */ new Float32Array(24), !Number.isInteger(l) || l < 1) throw Error("MSAA sample count must be a positive integer.");
		if (!ee.includes(C)) throw Error(`shading must be one of ${ee.join(", ")}.`);
		if (this.shading = C, new Set(t).size !== t.length) throw Error("Scene parts must have distinct object identities for animation.");
		this.lighting = de(), ue(this.lighting, p, { world: o });
		let k = he(p.volumeFog);
		if (k.density > 0 && (!d || i || c || !u)) throw Error("Volume fog requires depth:true, hdr:true, an opaque canvas and normal rendering");
		if (this.context = e.getContext("webgl2", {
			antialias: !0,
			alpha: !!c,
			premultipliedAlpha: !0,
			powerPreference: "high-performance"
		}), !this.context) throw Error("WebGL2 is unavailable. Enable hardware acceleration or use a supported browser.");
		this.transparent = !!c, this.pixelRatio = r, this.benchmark = i, this.depth = !(!d || i), this.world = o, this.environment = p, this.fittedFogDensity = o ? St(t) : void 0, this.shadowBounds = m, this.coplanarDiagnostics = null, this.reversedDepthMode = E;
		let ae = E !== !1 && !i && !!this.context.getExtension?.("EXT_clip_control");
		if (this.diagnostics = [], this.activeLightDirection = p.lightDirection ?? [
			-3,
			6,
			4
		], this.shadowCascades = g, this.renderTargets = new it(), this.defaultViewTransform = w, this.defaultLook = ne, this.viewTransform = "aces", this.look = null, this.lookSource = null, this.selectViewTransform(w, ne), this.hdr = !!(u && !i && this.context.getExtension("EXT_color_buffer_float")), k.density > 0 && !this.hdr) throw Error("Volume fog requires EXT_color_buffer_float for HDR rendering");
		if (this.multisampleSamples = i ? 0 : Hn(this.context, this.hdr ? this.context.RGBA16F : this.context.RGBA8, Math.min(C === "light" ? Math.min(l, 2) : l, this.context.getParameter(this.context.MAX_SAMPLES))), this.capabilities = {
			hdr: this.hdr,
			hdrRequested: !!u,
			hdrFallbackReason: u && !this.hdr ? i ? "HDR is disabled in benchmark mode" : "EXT_color_buffer_float is unavailable" : null,
			samples: this.multisampleSamples
		}, this.geometryBytes = 0, this.geometryBuffers = /* @__PURE__ */ new Map(), this.batching = n, this.groundPart = s === !0 ? Ln(In(t)) : s || null, this.buffers = [], this.batches = [], this.partLocations = /* @__PURE__ */ new Map(), this.updateBatches = /* @__PURE__ */ new Set(), this.postStages = [], this.passSupport = null, this.updateSkins = /* @__PURE__ */ new Set(), this.updateMorphs = /* @__PURE__ */ new Set(), this.skinTextures = /* @__PURE__ */ new Map(), this.influenceTextures = /* @__PURE__ */ new Map(), this.morphTextures = /* @__PURE__ */ new Map(), this.textures = /* @__PURE__ */ new Map(), this.splatResources = /* @__PURE__ */ new Map(), this.textureBytes = 4, this.shadowsDirty = !0, this.windState = {
			time: 0,
			strength: .3
		}, this.assemblyAmount = 0, T && typeof T != "function") throw TypeError("resolveCoplanar is resolveFlushParts from 67js/addons/coplanar-overlap.");
		T && !i && T(t), this.fitParts = this.groundPart ? [...t, this.groundPart] : t;
		let j = Z(this.fitParts, n), M = this.context.getParameter(this.context.MAX_TEXTURE_SIZE);
		if (this.hasSkins = j.some((e) => e[0].skin || e[0].crowd), this.hasMorphs = j.some((e) => e[0].morph), this.hasSkins && (this.context.getParameter(this.context.MAX_VERTEX_TEXTURE_IMAGE_UNITS) < 2 || this.context.getParameter(this.context.MAX_COMBINED_TEXTURE_IMAGE_UNITS) < 8)) throw Error("GPU skinning requires two vertex texture units and eight combined texture units.");
		if (this.hasMorphs && (this.context.getParameter(this.context.MAX_VERTEX_TEXTURE_IMAGE_UNITS) < (this.hasSkins ? 3 : 1) || this.context.getParameter(this.context.MAX_COMBINED_TEXTURE_IMAGE_UNITS) < 9)) throw Error("GPU morphing requires one additional vertex texture unit and nine combined texture units.");
		let se = /* @__PURE__ */ new Set();
		for (let e of j) {
			let t = e[0];
			if (!t.morph || se.has(t.geometry)) continue;
			let n = t.geometry.positions.length / 3 * t.geometry.morphTargets.length * 2;
			this.textureBytes += X().skinTextureLayout(n, M, 2).bytes, se.add(t.geometry);
		}
		let N = /* @__PURE__ */ new Set(), ce = /* @__PURE__ */ new Set();
		for (let e of j) {
			let t = e[0];
			t.crowd && !N.has(t.crowd) && (this.textureBytes += Y().skinTextureLayout(t.crowd.data.length / 4, M, 4).bytes, N.add(t.crowd)), t.skin && (N.has(t.skin) || (this.textureBytes += Y().skinTextureLayout(t.skin.jointMatrices.length / 4, M, 4).bytes), ce.has(t.geometry) || (this.textureBytes += Y().skinTextureLayout(t.geometry.positions.length / 3 * 2, M, 2).bytes), N.add(t.skin), ce.add(t.geometry));
		}
		let fe = /* @__PURE__ */ new Set();
		for (let e of j) {
			let t = e[0].material;
			for (let [e, n] of [...B, "lightMap"].map((e) => [e, t[e]]).concat(Object.entries(t.layerMaps ?? {}))) {
				if (!n) continue;
				let t = Q(n, M);
				if ([
					"normalMap",
					"metallicRoughnessMap",
					"occlusionMap"
				].includes(e) && n.colorSpace !== "linear") throw Error(`${e} requires a linear texture descriptor.`);
				if (e === "emissiveMap" && (n.colorSpace ?? "srgb") !== "srgb") throw Error("emissiveMap requires an srgb texture descriptor.");
				fe.has(n) || (this.textureBytes += t.bytes), fe.add(n);
			}
		}
		this.splatBytes = 0;
		let pe = /* @__PURE__ */ new Set();
		for (let e of j) {
			let t = e[0].material;
			t.layers && !pe.has(t.layers) && (pe.add(t.layers), this.splatBytes += a().textureBytes(a().resolveSize(t, M), t.layers.length) + (t.splat?.maskMap ? Q(t.splat.maskMap, M).bytes : 0));
		}
		this.textureBytes += this.splatBytes, this.capabilities.maximumTextureSize = M, this.environmentResources = null, this.environmentBackgroundProgram = null, this.environmentBytes = !i && p.map ? L().estimateBytes(p.map, M) : 0, this.textureBytes += this.environmentBytes;
		for (let e of j) {
			let t = e[0].geometry;
			if (t.uvs && t.uvs.length !== t.positions.length / 3 * 2) throw Error("Geometry UV count must match the vertex count.");
			if (wn(e[0].material) && !t.uvs && !t.lightUvs && !e[0].material.boxMapScale) throw Error("Textured geometry requires UV channel 0.");
			for (let e of t.uvs ?? []) if (!Number.isFinite(e)) throw Error("Geometry UVs must be finite.");
			if (t.colors && t.colors.length !== t.positions.length) throw Error("Geometry colors must contain RGB for every vertex.");
		}
		let me = j.reduce((e, t) => e + Kn(t[0].geometry) + t.length * R * 4, 0);
		this.memoryBudgetMiB = oe({
			width: Math.max(1, e.clientWidth),
			height: Math.max(1, e.clientHeight),
			pixelRatio: r,
			samples: this.samples,
			memoryBudgetMiB: f,
			geometryBytes: me,
			textureBytes: this.textureBytes,
			hdr: this.hdr,
			bloom: !i,
			depth: this.depth,
			maximumSize: M
		}).memoryBudgetMiB, this.view = h(), this.projection = h(), this.viewProjection = h(), this.lightProjection = h(), this.shadowBiasPerSlope = 0, this.inverseViewProjection = h(), this.shaderFeatures = Yt(j.flat()), j.some((e) => e.length > 1) && this.shaderFeatures.add("instanced"), this.shaderFeatures.add(p.map ? "environmentMap" : "studioLighting"), qt(this.lighting).forEach((e) => this.shaderFeatures.add(e)), C === "light" && this.shaderFeatures.add(re), g && this.shaderFeatures.add(g.shaderFeature), this.shaderFeatures.has("tintedShadows") && (g || !this.context.getExtension("EXT_color_buffer_float")) && this.shaderFeatures.delete("tintedShadows"), this.tintedShadowsActive = this.shaderFeatures.has("tintedShadows"), ae && le(this);
		let P = {
			main: this.startMainProgram(),
			depth: A(this.context, te(this.shaderFeatures), y(this.shaderFeatures))
		};
		i || (P.post = A(this.context, D, this.withViewTransform(je, "post")), P.sky = A(this.context, D, be), P.bloom = A(this.context, D, xe), p.map && this.startEnvironmentPrograms()), j.forEach((e) => this.batches.push(this.uploadBatch(e))), this.pendingConstruction = {
			pending: P,
			parts: t,
			environment: p
		}, this.deferEnvironmentPrefilter = ie, O || this.finishConstruction();
	}
	finishConstruction() {
		let { pending: e, parts: t, environment: n } = this.pendingConstruction;
		this.pendingConstruction = null;
		let r = this.benchmark;
		this.finishMainProgram(e.main), this.depthProgram = k(this.context, e.depth), this.depthSkinUniforms = Object.fromEntries(Zt.map((e) => [e, this.context.getUniformLocation(this.depthProgram, e)])), this.depthMorphUniforms = Object.fromEntries(en.map((e) => [e, this.context.getUniformLocation(this.depthProgram, e)])), r || (this.postProgram = k(this.context, e.post), this.skyProgram = k(this.context, e.sky), this.postUniforms = Ht(this.context, this.postProgram), this.postVariants = /* @__PURE__ */ new Map(), this.bloomProgram = k(this.context, e.bloom), this.bloomUniforms = Object.fromEntries([
			"sourceTexture",
			"texelDirection",
			"threshold",
			"extract"
		].map((e) => [e, this.context.getUniformLocation(this.bloomProgram, e)])), this.skyUniforms = Object.fromEntries([
			"skyTop",
			"skyBottom",
			"sunDirection",
			"inverseViewProjection",
			"eye",
			"time",
			"daylight",
			"hdrEnabled"
		].map((e) => [e, this.context.getUniformLocation(this.skyProgram, e)]))), this.depthAlphaUniforms = Object.fromEntries($t.map((e) => [e, this.context.getUniformLocation(this.depthProgram, e)])), this.depthUniform = this.context.getUniformLocation(this.depthProgram, "lightProjection"), this.depthAssemblyUniform = this.context.getUniformLocation(this.depthProgram, "assemblyAmount"), this.depthWindUniforms = {
			time: this.context.getUniformLocation(this.depthProgram, "time"),
			wind: this.context.getUniformLocation(this.depthProgram, "wind")
		}, this.partCount = t.length, this.triangles = t.reduce((e, t) => e + t.geometry.indices.length / 3, 0), this.whiteTexture = this.createTexture(null);
		for (let [e, t] of [[this.program, this.uniforms], [this.depthProgram, this.depthSkinUniforms]]) this.context.useProgram(e), this.context.uniform1i(t.skinInfluences, 6), this.context.uniform1i(t.jointPalette, 7);
		for (let [e, t] of [[this.program, this.uniforms], [this.depthProgram, this.depthMorphUniforms]]) this.context.useProgram(e), this.context.uniform1i(t.morphTargets, 8);
		for (let e of [
			6,
			7,
			8
		]) this.context.activeTexture(this.context.TEXTURE0 + e), this.context.bindTexture(this.context.TEXTURE_2D, this.whiteTexture);
		this.shaderFeatures.has("splat") && a().initializePlaceholders(this), this.initializeEnvironment(n.map), this.createShadowMap(), this.reversedDepthMode !== !1 && !r && ce(this, this.reversedDepthMode), this.resize(), !this.benchmark && !this.multisampleFramebuffer && this.allocateFrameTargets(this.canvas.width, this.canvas.height);
	}
	async programsReady() {
		if (!this.pendingConstruction) return;
		let e = this.context, t = e.getExtension("KHR_parallel_shader_compile"), { pending: n } = this.pendingConstruction, r = [...Object.values(n), ...this.pendingEnvironmentPrograms?.values() ?? []].map((e) => e.program);
		for (; t && r.some((n) => !e.getProgramParameter(n, t.COMPLETION_STATUS_KHR));) await new Promise((e) => setTimeout(e, 8));
		this.finishConstruction();
	}
	async prepareFrame(e, { timeoutMilliseconds: t = 6e3 } = {}) {
		await this.programsReady();
		let n = this.context, r = performance.now() + t;
		ie(n, !0);
		try {
			for (;;) try {
				return this.render(e), !0;
			} catch (e) {
				if (!(e instanceof ae)) throw e;
				for (; !E(n, e.program) && performance.now() < r;) await new Promise((e) => setTimeout(e, 8));
				if (performance.now() >= r) break;
			}
		} finally {
			ie(n, !1);
		}
		return this.render(e), !1;
	}
	selectViewTransform(e, t) {
		if ((e !== "aces" || t) && !u.apply) throw Error("viewTransform and look need their shader code: add import '@codepawlhq/67js/addons/view-transform-shader' (a recipe: await loadAgentSceneModules(recipe)).");
		this.viewTransform = e, this.lookSource = t, this.look = t ? u.resolveLook(t) : null;
	}
	syncViewTransform(e) {
		let t = e.viewTransform ?? this.defaultViewTransform, n = e.look ?? this.defaultLook;
		if (t === this.viewTransform && n === this.lookSource || (u.dispose?.(this), this.selectViewTransform(t, n), this.benchmark)) return;
		let r = this.context;
		this.rebuildMainProgram();
		for (let e of this.postVariants.values()) r.deleteProgram(e.pending ? k(r, e.pending) : e.program);
		this.postVariants.clear(), r.deleteProgram(this.postProgram), this.postProgram = k(r, A(r, D, this.withViewTransform(je, "post"))), this.postUniforms = Ht(r, this.postProgram), this.liquidProgram && r.deleteProgram(this.liquidProgram), this.liquidProgram = null, this.environmentBackgroundProgram && r.deleteProgram(this.environmentBackgroundProgram), this.environmentBackgroundProgram = null;
	}
	withViewTransform(e, t) {
		return this.viewTransform === "aces" && !this.look ? e : u.apply(e, t, this.viewTransform, !!this.look);
	}
	startMainProgram() {
		let e = this.benchmark, t = e ? w : this.withViewTransform(ne(this.shaderFeatures), "main");
		return A(this.context, e ? C : b(this.shaderFeatures), t);
	}
	buildMainProgram() {
		this.finishMainProgram(this.startMainProgram());
	}
	finishMainProgram(e) {
		this.program = k(this.context, e), this.uniforms = Object.fromEntries([
			"materialDielectric",
			"materialCoat",
			"materialSheen",
			"materialAnisotropy",
			"materialIridescence",
			"lightLinkMask",
			"boxMapScale",
			"boxMapAxis",
			"lightMap",
			"lightMapScale",
			"hasLightMap",
			"viewProjection",
			"flushBias",
			"clipPerMetre",
			"lightProjection",
			"eye",
			"armorColor",
			"armorSurface",
			"exposure",
			"inspection",
			"shadowMap",
			"shadowBiasPerSlope",
			...kt,
			...At,
			...Zt,
			...en,
			"normalScale",
			"occlusionStrength",
			"materialMoss",
			"wearEnabled",
			"wearMetal",
			"wearDirt",
			"wearShape",
			"wearDirtShape",
			...ln,
			"hdrEnabled",
			"time",
			"wind",
			"worldMode",
			"daylight",
			"fogColor",
			"lightDirection",
			"fogDensity",
			"waterRipple",
			"rippleTime",
			"explosionProgress",
			"explosionCenter",
			"assemblyAmount",
			"renderPassMode",
			"renderPassDepthRange",
			"renderPassObjectBase",
			"baseColor",
			"surface",
			"instanceEmission",
			"instanceOpacity",
			"boxNormalMatrix",
			"shadowBlind",
			"compositeMode",
			"tintShadowMap",
			"tintBlind",
			...Qt
		].map((e) => [e, this.context.getUniformLocation(this.program, e)]));
		for (let e of cn) this.uniforms[e] = this.context.getUniformLocation(this.program, e);
		for (let e of tn) this.uniforms[e] = this.context.getUniformLocation(this.program, e);
		this.keepSamplerTypesApart();
	}
	keepSamplerTypesApart() {
		let e = this.context;
		e.useProgram(this.program);
		let t = e.getProgramParameter(this.program, e.ACTIVE_UNIFORMS);
		for (let n = 0; n < t; n++) {
			let t = e.getActiveUniform(this.program, n);
			t.type === e.SAMPLER_2D && e.uniform1iv(e.getUniformLocation(this.program, t.name), new Int32Array(t.size).fill(1));
		}
	}
	get samples() {
		return Math.max(1, this.multisampleSamples);
	}
	uploadBuffer(e, t, n = this.context.STATIC_DRAW) {
		let r = this.context.createBuffer();
		return this.buffers.push(r), this.context.bindBuffer(e, r), this.context.bufferData(e, t, n), this.geometryBytes += t.byteLength, r;
	}
	applyAnisotropy(e) {
		let t = this.context, n = t.getExtension("EXT_texture_filter_anisotropic");
		if (!n) return;
		let r = t.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
		t.texParameterf(e, n.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(Mt, r));
	}
	createTexture(e) {
		if (this.textures.has(e)) return this.textures.get(e);
		let t = this.context, n = t.createTexture();
		t.bindTexture(t.TEXTURE_2D, n);
		let r = t.getParameter(t.UNPACK_FLIP_Y_WEBGL), i = t.getParameter(t.UNPACK_COLORSPACE_CONVERSION_WEBGL);
		try {
			if (t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, e?.flipY ?? !1), t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL, t.NONE), e) {
				let n = Q(e, t.getParameter(t.MAX_TEXTURE_SIZE));
				e.image.compressed ? e.image.compressed.upload(t) : t.texImage2D(t.TEXTURE_2D, 0, e.colorSpace === "linear" ? t.RGBA8 : t.SRGB8_ALPHA8, t.RGBA, t.UNSIGNED_BYTE, e.image), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, n.wrapS), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, n.wrapT), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, n.minFilter), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, n.magFilter), n.mipmaps && (t.generateMipmap(t.TEXTURE_2D), this.applyAnisotropy(t.TEXTURE_2D));
			} else t.texImage2D(t.TEXTURE_2D, 0, t.RGBA8, 1, 1, 0, t.RGBA, t.UNSIGNED_BYTE, new Uint8Array([
				255,
				255,
				255,
				255
			])), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR);
		} catch (e) {
			throw t.deleteTexture(n), e;
		} finally {
			t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, r), t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL, i);
		}
		return this.textures.set(e, n), n;
	}
	updateTexture(e, t = {}) {
		if (!r.update) throw Error("updateTexture needs its code: add import '@codepawlhq/67js/addons/texture-update'.");
		r.update(this, e, t);
	}
	requireShaderFeatures(e) {
		this.requireFeatureNames([...Yt(e), ...e.length > 1 ? ["instanced"] : []]);
	}
	requireFeatureNames(e) {
		if (this.benchmark || !this.shaderFeatures) return;
		let t = e.filter((e) => !this.shaderFeatures.has(e));
		t.length !== 0 && (t.forEach((e) => this.shaderFeatures.add(e)), this.rebuildMainProgram());
	}
	rebuildMainProgram() {
		let e = this.context, t = this.program;
		this.buildMainProgram(), e.deleteProgram(t), e.useProgram(this.program);
		for (let [t, n] of [
			["skinInfluences", 6],
			["jointPalette", 7],
			["morphTargets", 8],
			...Object.entries(o),
			["environmentSpecular", W],
			["environmentBrdf", rn]
		]) e.uniform1i(this.uniforms[t], n);
		e.uniform1f(this.uniforms.splatEnabled, 0), this.shaderFeatures.has("splat") && !this.splatPlaceholder && a().initializePlaceholders(this);
	}
	uploadBatch(e) {
		this.requireShaderFeatures(e);
		let t = this.context, n = t.createVertexArray();
		try {
			return this.uploadBatchData(e, n);
		} catch (e) {
			throw t.bindVertexArray(null), t.deleteVertexArray(n), e;
		}
	}
	bindSurfaceWear(e) {
		let { context: t, uniforms: n } = this;
		if (t.uniform1f(n.wearEnabled, +!!e), !e) return;
		let r = fe(e);
		t.uniform4fv(n.wearMetal, r.metal), t.uniform4fv(n.wearDirt, r.dirt), t.uniform4fv(n.wearShape, r.shape), t.uniform2fv(n.wearDirtShape, r.dirtShape);
	}
	bindGeometryAttributes(e, t) {
		let n = this.context, r = this.geometryBuffers.get(e);
		if (!r) {
			r = /* @__PURE__ */ new Map();
			for (let t of [
				"positions",
				"normals",
				"uvs",
				"colors",
				"indices",
				"crowdPacked"
			]) if (e[t]) {
				let i = t === "indices" ? n.ELEMENT_ARRAY_BUFFER : n.ARRAY_BUFFER, a = t === "uvs" && e.lightUvs ? Wn(e) : e[t];
				r.set(t, this.uploadBuffer(i, t === "colors" && $(e) ? Gn(e) : a));
			}
			$(e) && !e.colors && r.set("colors", this.uploadBuffer(n.ARRAY_BUFFER, Gn(e))), e.lightUvs && !e.uvs && r.set("uvs", this.uploadBuffer(n.ARRAY_BUFFER, Wn(e))), this.geometryBuffers.set(e, r);
		}
		for (let [e, t] of [[0, "positions"], [1, "normals"]]) n.bindBuffer(n.ARRAY_BUFFER, r.get(t)), n.enableVertexAttribArray(e), n.vertexAttribPointer(e, 3, n.FLOAT, !1, 0, 0);
		if (e.lightUvs && e.lightUvs.length !== e.positions.length / 3 * 2) throw Error("Geometry lightUvs count must match the vertex count.");
		if (e.uvs || e.lightUvs) {
			if (e.uvs && e.uvs.length !== e.positions.length / 3 * 2) throw Error("Geometry UV count must match the vertex count.");
			n.bindBuffer(n.ARRAY_BUFFER, r.get("uvs")), n.enableVertexAttribArray(13), n.vertexAttribPointer(13, e.lightUvs ? 4 : 2, n.FLOAT, !1, 0, 0);
		} else {
			if (wn(t) && !t.boxMapScale) throw Error("Textured geometry requires UV channel 0.");
			n.disableVertexAttribArray(13), n.vertexAttrib2f(13, -1, -1);
		}
		if (e.colors && e.colors.length !== e.positions.length) throw Error("Geometry colors must contain RGB for every vertex.");
		if ($(e) && $(e).length !== e.positions.length / 3) throw Error("Geometry skyVisibility must hold one value for every vertex.");
		e.colors || $(e) ? (n.bindBuffer(n.ARRAY_BUFFER, r.get("colors")), n.enableVertexAttribArray(14), n.vertexAttribPointer(14, $(e) ? 4 : 3, n.FLOAT, !1, 0, 0)) : (n.disableVertexAttribArray(14), n.vertexAttrib3f(14, 1, 1, 1)), e.crowdPacked && (n.bindBuffer(n.ARRAY_BUFFER, r.get("crowdPacked")), n.enableVertexAttribArray(14), n.vertexAttribPointer(14, 4, n.FLOAT, !1, 0, 0)), n.bindBuffer(n.ELEMENT_ARRAY_BUFFER, r.get("indices"));
	}
	pointInstanceAttributes() {
		for (let e = 0; e < 4; e++) this.attribute(2 + e, 4, 168, e * 16);
		for (let e = 0; e < 3; e++) this.attribute(6 + e, 3, 168, 64 + e * 12);
		this.attribute(9, 3, 168, 100), this.attribute(10, 4, 168, 112), this.attribute(11, 3, 168, 128), this.attribute(12, 3, 168, 140), this.attribute(15, 4, 168, 152);
	}
	createCullingState(e) {
		let t = e[0], n = Mn(e);
		if (t.lods && (Nn(t, t.lods), !n)) throw RangeError(`lods need rigid or swaying, opaque parts without assembly motion: ${t.name}`);
		if (t.shadowLods && (Nn(t, t.shadowLods), !n)) throw RangeError(`shadowLods need rigid or swaying, opaque parts without assembly motion: ${t.name}`);
		let r = t.lods ?? [{
			geometry: t.geometry,
			error: 0
		}], i = t.crowd?.bounds ?? Ie(t.geometry), a = {
			center: i.center,
			radius: i.radius + Math.max(...r.map((e) => e.error))
		}, o = t.shadowLods ? Fn(t.shadowLods, e.length) : null;
		return {
			cullable: n,
			bounds: a,
			swayReach: Nt.has(t.material.tag) ? Bt : 0,
			...Fn(r, e.length),
			shadowLevels: o
		};
	}
	levelDraw(e, t, n = e) {
		if (n.levelDraws[t]) return n.levelDraws[t];
		let r = this.context, i = n === e && t === 0, a = i && e.flushOrder?.geometry || n.levelGeometries[t], o = r.createVertexArray();
		r.bindVertexArray(o), this.bindGeometryAttributes(a, e.parts[0].material), e.flushIndexBuffer && i && r.bindBuffer(r.ELEMENT_ARRAY_BUFFER, e.flushIndexBuffer);
		let s = r.createBuffer();
		return this.buffers.push(s), r.bindBuffer(r.ARRAY_BUFFER, s), r.bufferData(r.ARRAY_BUFFER, e.instanceData.byteLength, r.DYNAMIC_DRAW), this.pointInstanceAttributes(), r.bindVertexArray(null), n.levelDraws[t] = {
			vertexArray: o,
			instanceBuffer: s,
			indexCount: a.indices.length
		}, n.levelDraws[t];
	}
	releaseLevelDraws(e, t) {
		for (let n of [e, e.shadowLevels]) if (n) {
			for (let e of n.levelDraws) e && (this.context.deleteVertexArray(e.vertexArray), t?.add(e.instanceBuffer));
			n.levelDraws = [];
		}
	}
	selectBatchInstances(e) {
		return !this.culling || !e.cullable ? null : He(e.selection, {
			instanceData: e.instanceData,
			instanceCount: e.instanceCount,
			stride: R,
			bounds: e.bounds,
			margin: e.swayReach * Math.abs(this.windState.strength),
			levelErrors: e.levelErrors,
			planes: this.frustumPlanes,
			viewProjection: this.viewProjection,
			pixelsPerUnit: this.canvas.height / 2 * this.projection[5],
			pixelError: this.lodPixelError * (this.mirrorCulling?.lodScale ?? 1),
			belowHeight: this.mirrorCulling?.belowHeight,
			minimumPixelRadius: this.mirrorCulling?.minimumPixelRadius
		});
	}
	drawSelectedLevels(e, t, n = e, r = null) {
		let i = this.context, a = R;
		for (let o = 0; o < t.counts.length; o++) {
			let s = t.counts[o];
			if (s === 0) continue;
			let c = this.levelDraw(e, o, n);
			this.selectionScratch?.length >= s * a || (this.selectionScratch = new Float32Array(s * a));
			for (let n = 0; n < s; n++) {
				let r = t.indices[o][n];
				this.selectionScratch.set(e.instanceData.subarray(r * a, (r + 1) * a), n * a);
			}
			i.bindBuffer(i.ARRAY_BUFFER, c.instanceBuffer), i.bufferSubData(i.ARRAY_BUFFER, 0, this.selectionScratch, 0, s * a), i.bindVertexArray(c.vertexArray), r && o === 0 ? this.drawFlushRanges(e, r, s) : i.drawElementsInstanced(i.TRIANGLES, c.indexCount, i.UNSIGNED_INT, 0, s);
		}
	}
	drawFlushRanges(e, t, n) {
		let r = this.context, i = (e.depthLayer ?? 0) * 16;
		for (let e of t) this.applyDepthRank(i + e.rank), r.drawElementsInstanced(r.TRIANGLES, e.count, r.UNSIGNED_INT, e.start * 4, n);
		this.applyDepthRank(i);
	}
	uploadBatchData(e, t) {
		let n = this.context, r = e[0].geometry;
		n.bindVertexArray(t);
		let i = F(e[0]);
		this.bindGeometryAttributes(i?.geometry ?? r, e[0].material);
		let o = i && !i.geometry ? this.uploadBuffer(n.ELEMENT_ARRAY_BUFFER, i.indices) : null, s = R, c = new Float32Array(e.length * s), l = v();
		e.forEach((e, t) => {
			_(l, e.matrix), An(c, t, e, l);
		});
		let u = this.uploadBuffer(n.ARRAY_BUFFER, c, n.DYNAMIC_DRAW);
		this.pointInstanceAttributes(), n.bindVertexArray(null);
		let d = e[0].material.map ?? null, f = mn(e[0].material), p = f.slice(0, 5).map((e) => this.createTexture(e)), m = e[0].material.layers ? a().createResources(this, e[0].material, a()) : null, h = f[14] ? this.createTexture(f[14]) : null;
		if (h && (e[0].skin || e[0].morph || !r.lightUvs)) throw Error("A light map needs lightUvs on rigid geometry, with no skin or morph.");
		let g = e[0].skin ?? null, y = g ? this.createSkinTexture(this.skinTextures, g, g.jointMatrices, 4) : null, b = g ? this.createSkinTexture(this.influenceTextures, r, null, 2) : null, x = e[0].crowd ?? null, S = x ? this.createSkinTexture(this.skinTextures, x, x.data, 4) : null, C = e[0].morph ?? null, ee = C ? this.createMorphTexture(r, C) : null, te = C ? new Float32Array(C.weights) : null, [w, ne, re, T] = K(e[0].material), E = _e(e[0].material), D = this.createCullingState(e), O = {
			...D,
			alphaMode: w,
			alphaCutoff: ne,
			opacity: re,
			doubleSided: T,
			mirrored: kn(e[0].matrix),
			layerState: E,
			wear: e[0].material.wear ?? null,
			parts: [...e],
			vertexArray: t,
			instanceBuffer: u,
			instanceData: c,
			textures: p,
			mapState: f,
			splat: m,
			lightMapTexture: h,
			texture: p[0],
			map: d,
			skin: g,
			skinTexture: y,
			influenceTexture: b,
			crowd: x,
			crowdTexture: S,
			morph: C,
			morphTexture: ee,
			morphWeights: te,
			indexCount: i?.indices.length ?? r.indices.length,
			instanceCount: e.length,
			floor: e[0].material.tag === "floor",
			castShadow: q(e[0]),
			tintedShadow: vn(e[0]),
			tintBlind: !!m || Object.keys(e[0].material.layerMaps ?? {}).length >= 3,
			receivesShadow: yn(e[0]),
			compositeMode: bn(e[0]),
			depthLayer: I(e[0]),
			flushOrder: i,
			flushIndexBuffer: o,
			pass: H(e[0].material)
		};
		return e[0].lods && D.levelGeometries.forEach((e, t) => this.levelDraw(O, t)), D.shadowLevels?.levelGeometries.forEach((e, t) => this.levelDraw(O, t, O.shadowLevels)), e.forEach((e, t) => this.partLocations.set(e, {
			batch: O,
			index: t,
			geometry: e.geometry,
			map: d,
			mapState: f,
			layerState: E,
			skin: g,
			jointMatrices: g?.jointMatrices,
			skinIndices: r.skinIndices,
			skinWeights: r.skinWeights,
			morph: C,
			morphWeights: C?.weights,
			morphTargets: r.morphTargets,
			normalMatrix: v(),
			committedMatrix: O.instanceData.subarray(t * R, t * R + 16)
		})), O;
	}
	replaceParts(t, { regroupOnly: n = !1, retainedUnchanged: r = !1 } = {}) {
		if (!Array.isArray(t) || new Set(t).size !== t.length) throw TypeError("Scene parts must be an array with distinct object identities.");
		let i = this.groundPart ? [...t, this.groundPart] : t;
		this.fitParts = i, this.fitBounds = void 0;
		let a = Vn(r ? this.incrementalGrouping : null, t, this.groundPart, this.batching, r);
		this.incrementalGrouping = a.state;
		let o = a.batches, s = new Set(i.flatMap(Pn));
		for (let e of s) this.geometryBuffers.has(e) || qn(e);
		let c = /* @__PURE__ */ new Set(), l = o.map((e) => {
			let t = e[0], n = this.partLocations.get(t), r = n?.batch, i = mn(t.material), a = r?.parts.length === e.length && r.parts.every((t, n) => t === e[n]), o = K(t.material), s = n?.geometry === t.geometry && r?.castShadow === q(t) && r.receivesShadow === yn(t) && r.compositeMode === bn(t) && (r.depthLayer ?? 0) === I(t) && (r.flushOrder ?? null) === F(t) && r.floor === (t.material.tag === "floor") && U(r) === H(t.material) && [
				r.alphaMode,
				r.alphaCutoff,
				r.opacity,
				r.doubleSided
			].every((e, t) => e === o[t]) && r.mapState.every((e, t) => e === i[t]) && r.layerState.every((e, n) => e === _e(t.material)[n]);
			return a && s ? (c.add(r), {
				group: e,
				batch: r
			}) : {
				group: e,
				batch: null
			};
		});
		for (let t of l) if (!t.batch && t.group.some((t) => Xt(t, n || !!e.begin))) throw Error("replaceParts can add or change only rigid, untextured parts. Keep textured, skinned and morphed parts unchanged, or import replace-textured-parts to add textured ones.");
		for (let [t, r] of this.partLocations) if (!c.has(r.batch) && (r.skin || r.morph || r.morphTargets || r.skinIndices || r.mapState.slice(0, 5).some(Boolean) && !e.begin && !n)) throw Error(`replaceParts can remove or regroup only existing rigid, untextured parts; ${t.name} is textured, skinned or morphed and needs a new renderer.`);
		let u = [...s].filter((e) => !this.geometryBuffers.has(e)).reduce((e, t) => e + Kn(t), 0), d = l.filter((e) => !e.batch).reduce((e, t) => e + t.group.length * R * 4, 0), f = M(this.canvas.width, this.canvas.height, this.samples, 2048, {
			hdr: this.hdr,
			bloom: !this.benchmark,
			depth: this.depth
		});
		if (f + this.textureBytes + this.geometryBytes + u + d > this.memoryBudgetMiB * 1024 * 1024) throw j(this.geometryBytes + u + d, this.textureBytes, f, this.memoryBudgetMiB);
		let p = this.partLocations, m = [...this.buffers], h = this.geometryBytes, g = new Map(this.geometryBuffers), _ = e.begin?.(this), v = /* @__PURE__ */ new Map(), y = [];
		this.partLocations = v;
		try {
			for (let e of l) if (e.batch) {
				y.push(e.batch);
				for (let t of e.group) v.set(t, p.get(t));
			} else y.push(this.uploadBatch(e.group));
			let e = this.context.getError();
			if (e !== 0) throw Error(`WebGL replacement allocation failed with error ${e}.`);
		} catch (e) {
			for (let e of y) c.has(e) || (this.context.deleteVertexArray(e.vertexArray), this.releaseLevelDraws(e));
			for (let e of this.buffers.slice(m.length)) this.context.deleteBuffer(e);
			throw this.context.bindVertexArray(null), this.buffers = m, this.geometryBytes = h, this.geometryBuffers = g, _?.(), this.partLocations = p, e;
		}
		let b = /* @__PURE__ */ new Set();
		for (let e of this.batches) c.has(e) || (this.context.deleteVertexArray(e.vertexArray), b.add(e.instanceBuffer), e.flushIndexBuffer && b.add(e.flushIndexBuffer), this.releaseLevelDraws(e, b));
		for (let [e, t] of this.geometryBuffers) if (!s.has(e)) {
			for (let e of t.values()) b.add(e);
			this.geometryBuffers.delete(e);
		}
		for (let e of b) this.context.deleteBuffer(e);
		return this.buffers = this.buffers.filter((e) => !b.has(e)), _?.(this.batches, y), this.geometryBytes = [...s].reduce((e, t) => e + Kn(t), 0) + i.length * R * 4, this.batches = y, this.partCount = t.length, this.triangles = t.reduce((e, t) => e + t.geometry.indices.length / 3, 0), this.updateBatches.clear(), this.shadowsDirty = !0, this.updateParts(r ? i.filter((e) => !c.has(this.partLocations.get(e)?.batch)) : i), t.length;
	}
	createSkinTexture(e, t, n, r) {
		if (e.has(t)) return e.get(t);
		let i = this.context, a = n ? n.length / 4 : t.positions.length / 3 * 2, o = Y().skinTextureLayout(a, i.getParameter(i.MAX_TEXTURE_SIZE), r), s = n ? new Float32Array(o.width * o.height * 4) : Y().packSkinInfluences(t, o);
		n && s.set(n);
		let c = this.createPackedTexture(o, s);
		return c.pose = n ? t : null, e.set(t, c), c;
	}
	createMorphTexture(e, t) {
		if (this.morphTextures.has(e)) return this.morphTextures.get(e);
		let n = X().validateMorphGeometry(e, t), r = X().skinTextureLayout(n.vertexCount * n.targetCount * 2, this.context.getParameter(this.context.MAX_TEXTURE_SIZE), 2), i = this.createPackedTexture(r, X().packMorphTargets(e, r));
		return i.info = n, this.morphTextures.set(e, i), i;
	}
	createPackedTexture(e, t) {
		let n = this.context, r = n.createTexture();
		n.bindTexture(n.TEXTURE_2D, r);
		try {
			n.texImage2D(n.TEXTURE_2D, 0, n.RGBA32F, e.width, e.height, 0, n.RGBA, n.FLOAT, t), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MIN_FILTER, n.NEAREST), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MAG_FILTER, n.NEAREST), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_S, n.CLAMP_TO_EDGE), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_T, n.CLAMP_TO_EDGE);
		} catch (e) {
			throw n.deleteTexture(r), e;
		}
		return {
			...e,
			texture: r,
			data: t
		};
	}
	updateParts(e, { shadows: t = !0, checks: n = !0 } = {}) {
		if (typeof n != "boolean") throw TypeError("updateParts checks must be a boolean.");
		this.updatePartIdentities ??= /* @__PURE__ */ new Set(), this.updatePartIdentities.clear(), this.updateSkins.clear(), this.updateMorphs ??= /* @__PURE__ */ new Set(), this.updateMorphs.clear(), this.updateBatches.clear();
		let r = this.updateLocations ??= [];
		r.length = e.length;
		let i = !1;
		for (let t = 0; t < e.length; t++) {
			let a = e[t], o = this.partLocations.get(a);
			if (!o) throw Error(`Unknown part identity: ${a.name}`);
			if (r[t] = o, (a.skin || a.morph) && this.updatePartIdentities.add(a), Sn(a), q(a) !== o.batch.castShadow) throw Error(`Shadow casting changes require a new renderer: ${a.name}`);
			if (yn(a) !== o.batch.receivesShadow || bn(a) !== o.batch.compositeMode) throw Error(`receiveShadow, holdout and shadowCatcher changes require replaceParts: ${a.name}`);
			if (I(a) !== (o.batch.depthLayer ?? 0)) throw Error(`depthLayer changes require replaceParts: ${a.name}`);
			let s = o.materialSnapshot?.matches(a.material) === !0;
			if (!s) {
				let e = K(a.material), t = [
					o.batch.alphaMode,
					o.batch.alphaCutoff,
					o.batch.opacity,
					o.batch.doubleSided
				];
				if (e.some((e, n) => e !== t[n])) throw Error(`Alpha mode, cutoff, double-sided and mask opacity changes require a new renderer (blend and add opacity may change): ${a.name}`);
			}
			if (a.geometry !== o.geometry) throw Error(`Geometry changes require a new renderer: ${a.name}`);
			if (kn(a.matrix) !== !!o.batch.mirrored && (i = !0), !s && H(a.material) !== U(o.batch)) throw Error(`Moving a part into or out of the liquid or foam pass requires replaceParts: ${a.name}`);
			if ((a.skin ?? null) !== o.skin || a.skin?.jointMatrices !== o.jointMatrices || a.geometry.skinIndices !== o.skinIndices || a.geometry.skinWeights !== o.skinWeights) throw Error(`Skin identity changes require a new renderer: ${a.name}`);
			if (a.skin) {
				if (V.has(a.material.tag)) throw Error("Skinned parts require a standard material tag.");
				n && Y().validateSkinPose(a.skin, a.geometry, a.matrix), this.updateSkins.add(o.batch.skinTexture);
			}
			if ((a.morph ?? null) !== (o.morph ?? null) || a.morph?.weights !== o.morphWeights || a.geometry.morphTargets !== o.morphTargets) throw Error(`Morph identity changes require a new renderer: ${a.name}`);
			if (a.morph) {
				if (V.has(a.material.tag)) throw Error("Morphed parts require a standard material tag.");
				n && X().validateMorphTransform(a.morph, o.batch.morphTexture.info, a.matrix, a.skin), this.updateMorphs.add(a.morph);
			}
			if (s) {
				Dn(a, o.normalMatrix);
				continue;
			}
			if ((a.material.map ?? null) !== o.map) throw Error(`Texture map changes require a new renderer: ${a.name}`);
			un(a.material);
			let c = a.material.normalScale ?? jt, l = o.mapState;
			for (let e = 0; e < B.length; e++) if ((a.material[B[e]] ?? null) !== l[e]) throw Error(`Material map or scale changes require a new renderer: ${a.name}`);
			let [u, d] = hn(a.material);
			if (u !== (l[14] ?? null) || d !== (l[15] ?? 0) || (a.material.layerMaps ?? null) !== (l[18] ?? null)) throw Error(`Light map and layer texture changes require a new renderer: ${a.name}`);
			if (c[0] !== l[5] || c[1] !== l[6] || (a.material.occlusionStrength ?? 1) !== l[7] || pn(a.material).some((e, t) => e !== l[8 + t]) || _e(a.material).some((e, t) => e !== o.layerState[t])) throw Error(`Material map or scale changes require a new renderer: ${a.name}`);
			Dn(a, o.normalMatrix), o.materialSnapshot = _t.of(a.material);
		}
		if (i) return this.replaceParts([...this.partLocations.keys()].filter((e) => e !== this.groundPart), { regroupOnly: !0 }), e.length;
		if (n && this.updateSkins.size) for (let [e, t] of this.partLocations) {
			if (!t.skin || !this.updateSkins.has(t.batch.skinTexture) || this.updatePartIdentities.has(e)) continue;
			let n = t.committedMatrix ?? t.batch.instanceData.subarray(t.index * R, t.index * R + 16);
			Y().validateSkinPose(t.skin, t.geometry, n);
		}
		if (n && (this.updateMorphs.size || this.updateSkins.size)) for (let [e, t] of this.partLocations) {
			if (!t.morph || this.updatePartIdentities.has(e) || !this.updateMorphs.has(t.morph) && !this.updateSkins.has(t.batch.skinTexture)) continue;
			let n = t.committedMatrix ?? t.batch.instanceData.subarray(t.index * R, t.index * R + 16);
			X().validateMorphTransform(t.morph, t.batch.morphTexture.info, n, t.skin);
		}
		this.updateBatches.clear();
		for (let t = 0; t < e.length; t++) {
			let n = e[t], i = r[t];
			Kt.has(n.material.tag) && !this.shaderFeatures?.has(n.material.tag) && this.requireShaderFeatures([n]), An(i.batch.instanceData, i.index, n, i.normalMatrix), this.updateBatches.add(i.batch);
		}
		for (let e of this.updateBatches) this.context.bindBuffer(this.context.ARRAY_BUFFER, e.instanceBuffer), this.context.bufferSubData(this.context.ARRAY_BUFFER, 0, e.instanceData);
		for (let e of this.updateSkins) {
			let t = e.pose;
			e.data.set(t.jointMatrices), this.context.bindTexture(this.context.TEXTURE_2D, e.texture), this.context.texSubImage2D(this.context.TEXTURE_2D, 0, 0, 0, e.width, e.height, this.context.RGBA, this.context.FLOAT, e.data);
		}
		for (let e of this.batches ?? []) e.morph && this.updateMorphs.has(e.morph) && e.morphWeights.set(e.morph.weights);
		return t && e.length > 0 && (this.shadowsDirty = !0), e.length;
	}
	attribute(e, t, n, r) {
		this.context.enableVertexAttribArray(e), this.context.vertexAttribPointer(e, t, this.context.FLOAT, !1, n, r), this.context.vertexAttribDivisor(e, 1);
	}
	shadowMapSizeWanted() {
		return this.batches.some((e) => !e.floor && e.castShadow && !this.tintsShadow(e)) && !this.shadowCascades?.replacesSingleMap(this) ? Ct : 1;
	}
	createShadowMap() {
		let e = this.context, t = this.shadowMapSizeWanted();
		if (this.shadowTexture ??= e.createTexture(), e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, this.shadowTexture), t !== this.shadowMapSize && (this.shadowMapSize = t, e.texImage2D(e.TEXTURE_2D, 0, e.DEPTH_COMPONENT24, t, t, 0, e.DEPTH_COMPONENT, e.UNSIGNED_INT, null), this.renderTargets.record("shadowMap", {
			width: t,
			height: t,
			format: "DEPTH_COMPONENT24"
		})), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_COMPARE_MODE, e.COMPARE_REF_TO_TEXTURE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), this.shadowFramebuffer ||= e.createFramebuffer(), e.bindFramebuffer(e.FRAMEBUFFER, this.shadowFramebuffer), e.framebufferTexture2D(e.FRAMEBUFFER, e.DEPTH_ATTACHMENT, e.TEXTURE_2D, this.shadowTexture, 0), e.drawBuffers([e.NONE]), e.readBuffer(e.NONE), e.checkFramebufferStatus(e.FRAMEBUFFER) !== e.FRAMEBUFFER_COMPLETE) throw Error("Shadow framebuffer is incomplete.");
		let n = P(this.world, this.activeLightDirection, this.shadowBounds), r = m(h(), n.eye, n.target, n.up ?? [
			0,
			1,
			0
		]);
		f(this.lightProjection, -n.extent, n.extent, -n.extent, n.extent, n.near, n.far), p(this.lightProjection, this.lightProjection, r), e.viewport(0, 0, t, t), e.enable(e.DEPTH_TEST), e.enable(e.CULL_FACE), e.clear(e.DEPTH_BUFFER_BIT), this.shadowBiasPerSlope = me(n, Ct), this.drawShadowCasters(this.lightProjection, t, !0), this.drawTintedShadows(), e.bindFramebuffer(e.FRAMEBUFFER, null), this.shadowsDirty = !1;
	}
	tintsShadow(e) {
		return !!(this.tintedShadowsActive && e.tintedShadow);
	}
	bindPlaceholderOpaqueShadow() {
		let e = this.context;
		e.activeTexture(e.TEXTURE0 + sn), this.placeholderShadowTexture || (this.placeholderShadowTexture = e.createTexture(), e.bindTexture(e.TEXTURE_2D, this.placeholderShadowTexture), e.texImage2D(e.TEXTURE_2D, 0, e.DEPTH_COMPONENT24, 1, 1, 0, e.DEPTH_COMPONENT, e.UNSIGNED_INT, null), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.NEAREST), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.NEAREST), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_COMPARE_MODE, e.COMPARE_REF_TO_TEXTURE)), e.bindTexture(e.TEXTURE_2D, this.placeholderShadowTexture), e.activeTexture(e.TEXTURE0);
	}
	allocateTintTarget() {
		let e = this.context;
		if (this.tintTexture = e.createTexture(), e.activeTexture(e.TEXTURE0 + on), e.bindTexture(e.TEXTURE_2D, this.tintTexture), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA16F, G, G, 0, e.RGBA, e.HALF_FLOAT, null), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), this.renderTargets.record("tintShadow", {
			width: G,
			height: G,
			format: "RGBA16F"
		}), this.tintFramebuffer = e.createFramebuffer(), e.bindFramebuffer(e.FRAMEBUFFER, this.tintFramebuffer), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, this.tintTexture, 0), e.drawBuffers([e.COLOR_ATTACHMENT0]), e.checkFramebufferStatus(e.FRAMEBUFFER) !== e.FRAMEBUFFER_COMPLETE) throw Error("Tinted shadow framebuffer is incomplete.");
	}
	drawTintedShadows() {
		let e = this.batches.filter((e) => !e.floor && e.castShadow && this.tintsShadow(e));
		if (e.length === 0) return;
		let t = this.context;
		this.tintFramebuffer || this.allocateTintTarget(), t.bindFramebuffer(t.FRAMEBUFFER, this.tintFramebuffer), t.viewport(0, 0, G, G), t.activeTexture(t.TEXTURE0 + sn), t.bindTexture(t.TEXTURE_2D, this.shadowTexture), t.activeTexture(t.TEXTURE0), t.useProgram(this.depthProgram);
		let n = this.depthAlphaUniforms;
		t.uniform1f(n.tintMapSize, G), t.uniform1f(n.tintBias, this.shadowBiasPerSlope * 2), t.uniform1f(n.tintPass, 1), t.disable(t.DEPTH_TEST), t.enable(t.BLEND), t.blendEquationSeparate(t.FUNC_ADD, t.MIN), t.blendFuncSeparate(t.DST_COLOR, t.ZERO, t.ONE, t.ONE), t.clearColor(1, 1, 1, 1), t.clear(t.COLOR_BUFFER_BIT), t.enable(t.POLYGON_OFFSET_FILL), t.polygonOffset(1, 1);
		for (let r of e) this.applyAlphaState(r, !1), t.uniform1f(n.tintTransmission, r.layerState[9]), this.drawBatch(r, !1, this.selectShadowInstances(r, r, this.lightProjection, G), r);
		t.disable(t.POLYGON_OFFSET_FILL), t.enable(t.CULL_FACE), t.disable(t.BLEND), t.blendEquation(t.FUNC_ADD), t.enable(t.DEPTH_TEST), t.uniform1f(n.tintPass, 0);
	}
	bindTintedShadows() {
		if (!this.tintedShadowsActive || !this.tintTexture) return;
		let e = this.context;
		e.activeTexture(e.TEXTURE0 + on), e.bindTexture(e.TEXTURE_2D, this.tintTexture), e.uniform1i(this.uniforms.tintShadowMap, on), e.activeTexture(e.TEXTURE0);
	}
	selectShadowInstances(e, t, n, r) {
		if (!this.culling || !e.cullable) return null;
		let i = Le(n, this.shadowFrustumPlanes ??= /* @__PURE__ */ new Float32Array(24)), a = n[3] === 0 && n[7] === 0 && n[11] === 0 && n[15] === 1, o = !!r && a && t.levelErrors.length > 1, s = o ? Math.hypot(n[0], n[4], n[8]) * r / 2 : 0;
		return He(t.selection, {
			instanceData: e.instanceData,
			instanceCount: e.instanceCount,
			stride: R,
			bounds: e.bounds,
			margin: e.swayReach * Math.abs(this.windState.strength),
			levelErrors: o ? t.levelErrors : [0],
			planes: i,
			viewProjection: n,
			pixelsPerUnit: s,
			pixelError: this.lodPixelError
		});
	}
	drawShadowCasters(e = this.lightProjection, t = null, n = !1) {
		let r = this.context;
		r.useProgram(this.depthProgram), r.uniformMatrix4fv(this.depthUniform, !1, e), r.uniform1f(this.depthAssemblyUniform, this.assemblyAmount ?? 0), r.uniform1f(this.depthWindUniforms.time, this.windState.time), r.uniform1f(this.depthWindUniforms.wind, this.windState.strength), r.uniform1i(this.depthAlphaUniforms.baseMap, 1), this.tintedShadowsActive && (r.uniform1f(this.depthAlphaUniforms.tintPass, 0), r.uniform1i(this.depthAlphaUniforms.opaqueShadow, sn), this.bindPlaceholderOpaqueShadow()), r.enable(r.POLYGON_OFFSET_FILL), r.polygonOffset(1, 1);
		for (let r of this.batches) {
			if (r.floor || !r.castShadow || r.tintedShadow && (n && this.tintedShadowsActive || r.alphaMode === "blend" && r.parts[0].castShadow !== !0)) continue;
			let i = r.shadowLevels ?? r, a = this.selectShadowInstances(r, i, e, t);
			a?.visibleCount !== 0 && (this.applyAlphaState(r, !1), this.drawBatch(r, !1, a, i));
		}
		r.disable(r.POLYGON_OFFSET_FILL), r.enable(r.CULL_FACE);
	}
	allocateLocalShadowAtlas(e) {
		let t = this.context;
		if (this.localShadowTexture && t.deleteTexture(this.localShadowTexture), this.localShadowFramebuffer && t.deleteFramebuffer(this.localShadowFramebuffer), this.localShadowAtlasHeight = Math.ceil(e / 4) * 512, this.localShadowTexture = t.createTexture(), t.activeTexture(t.TEXTURE0 + an), t.bindTexture(t.TEXTURE_2D, this.localShadowTexture), t.texImage2D(t.TEXTURE_2D, 0, t.DEPTH_COMPONENT24, at, this.localShadowAtlasHeight, 0, t.DEPTH_COMPONENT, t.UNSIGNED_INT, null), this.renderTargets.record("localShadowAtlas", {
			width: at,
			height: this.localShadowAtlasHeight,
			format: "DEPTH_COMPONENT24"
		}), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.NEAREST), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.NEAREST), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), this.localShadowFramebuffer = t.createFramebuffer(), t.bindFramebuffer(t.FRAMEBUFFER, this.localShadowFramebuffer), t.framebufferTexture2D(t.FRAMEBUFFER, t.DEPTH_ATTACHMENT, t.TEXTURE_2D, this.localShadowTexture, 0), t.drawBuffers([t.NONE]), t.readBuffer(t.NONE), t.checkFramebufferStatus(t.FRAMEBUFFER) !== t.FRAMEBUFFER_COMPLETE) throw Error("Local shadow framebuffer is incomplete.");
		t.activeTexture(t.TEXTURE0);
	}
	updateLocalShadows(e) {
		let t = this.lighting.shadowCasters;
		if (t.length === 0 || this.benchmark) return;
		let n = this.localShadowMatrices ??= /* @__PURE__ */ new Float32Array(384), r = this.localShadowTexelAngles ??= /* @__PURE__ */ new Float32Array(24), i = this.localShadowPreviousMatrices ??= /* @__PURE__ */ new Float32Array(384), a = /* @__PURE__ */ new Float32Array(16);
		if (t.forEach((e, t) => {
			r[t] = mt(e, a), n.set(a, t * 16);
		}), !(t.length !== this.localShadowTileCount || n.some((e, t) => e !== i[t])) && !e && this.localShadowTexture) return;
		i.set(n), this.localShadowTileCount = t.length;
		let o = this.context;
		(!this.localShadowTexture || Math.ceil(t.length / 4) * 512 > this.localShadowAtlasHeight) && this.allocateLocalShadowAtlas(t.length), o.bindFramebuffer(o.FRAMEBUFFER, this.localShadowFramebuffer), o.viewport(0, 0, at, this.localShadowAtlasHeight), o.enable(o.DEPTH_TEST), o.clear(o.DEPTH_BUFFER_BIT);
		for (let e = 0; e < t.length; e++) o.viewport(...ht(e)), this.drawShadowCasters(n.subarray(e * 16, e * 16 + 16));
		o.bindFramebuffer(o.FRAMEBUFFER, null);
	}
	updateWindState(e) {
		let t = {
			time: e.time ?? 0,
			strength: e.wind ?? .3
		}, n = this.windState;
		return this.windState = t, n.time === t.time && n.strength === t.strength ? !1 : this.batches.some((e) => e.castShadow && Nt.has(e.parts[0].material.tag));
	}
	resize() {
		let e = oe({
			width: Math.max(1, this.canvas.clientWidth),
			height: Math.max(1, this.canvas.clientHeight),
			pixelRatio: this.pixelRatio,
			samples: this.samples,
			memoryBudgetMiB: this.memoryBudgetMiB,
			geometryBytes: this.geometryBytes,
			textureBytes: this.textureBytes,
			hdr: this.hdr,
			bloom: !this.benchmark,
			depth: this.depth,
			maximumSize: Math.min(this.context.getParameter(this.context.MAX_RENDERBUFFER_SIZE), this.context.getParameter(this.context.MAX_TEXTURE_SIZE))
		}), { width: t, height: n } = e;
		this.memoryPlan = e, (this.canvas.width !== t || this.canvas.height !== n) && (this.canvas.width = t, this.canvas.height = n, this.benchmark || this.allocateFrameTargets(t, n)), d(this.projection, this.world ? Math.PI / 4 : Math.PI / 5.5, t / n, .1, this.world ? 600 : 100);
	}
	withFittedNear(e) {
		if (this.reversedDepth || e.near !== void 0 || e.projection === "orthographic" || (this.fitBounds === void 0 && (this.fitBounds = qe(this.fitParts)), !this.fitBounds)) return e;
		let t = e.far ?? (this.world ? 600 : 100), n = Ye(this.fitBounds, this.view, t);
		return n === .1 ? e : {
			...e,
			near: n
		};
	}
	memoryReport() {
		return this.renderTargets.report();
	}
	releaseFrameTargets() {
		let e = this.context;
		this.multisampleFramebuffer && e.deleteFramebuffer(this.multisampleFramebuffer), this.resolveFramebuffer && e.deleteFramebuffer(this.resolveFramebuffer), this.multisampleColor && e.deleteRenderbuffer(this.multisampleColor), this.multisampleDepth && e.deleteRenderbuffer(this.multisampleDepth), this.frameTexture && e.deleteTexture(this.frameTexture), this.depthTexture && e.deleteTexture(this.depthTexture);
		for (let t of this.bloomTargets ?? []) e.deleteTexture(t.texture), e.deleteFramebuffer(t.framebuffer);
		this.bloomTargets = [], this.renderTargets.release("multisampleColor", "multisampleDepth", "frameColor", "sceneDepth", "bloomA", "bloomB"), this.releaseOcclusionTarget(), this.passSupport?.releaseTargets(e);
		for (let t of this.postStages ?? []) t.releaseTargets(e);
		this.multisampleFramebuffer = null, this.resolveFramebuffer = null, this.multisampleColor = null, this.multisampleDepth = null, this.frameTexture = null, this.depthTexture = null;
	}
	releaseOcclusionTarget() {
		this.occlusionTarget &&= (this.context.deleteTexture(this.occlusionTarget.texture), this.context.deleteFramebuffer(this.occlusionTarget.framebuffer), this.renderTargets.release("ambientOcclusion"), null);
	}
	drawsInOpaqueLoop(e) {
		return U(e) === "opaque" && !Ot(e.alphaMode);
	}
	ensureOcclusionTarget() {
		let e = this.context;
		if (!this.occlusionProgram) {
			this.occlusionProgram = O(e, D, Me);
			let t = [
				"sceneDepth",
				"inverseViewProjection",
				"radius",
				"projectionScale",
				"aspect",
				"orthographic"
			];
			this.occlusionUniforms = Object.fromEntries(t.map((t) => [t, e.getUniformLocation(this.occlusionProgram, t)]));
		}
		if (this.occlusionTarget) return;
		let t = Math.max(1, Math.ceil(this.canvas.width / 2)), n = Math.max(1, Math.ceil(this.canvas.height / 2)), r = e.createTexture();
		e.bindTexture(e.TEXTURE_2D, r), e.texImage2D(e.TEXTURE_2D, 0, e.R8, t, n, 0, e.RED, e.UNSIGNED_BYTE, null), this.renderTargets.record("ambientOcclusion", {
			width: t,
			height: n,
			format: "R8"
		}), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE);
		let i = e.createFramebuffer();
		e.bindFramebuffer(e.FRAMEBUFFER, i), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, r, 0), this.occlusionTarget = {
			texture: r,
			framebuffer: i,
			width: t,
			height: n
		};
	}
	drawAmbientOcclusion(e, t) {
		let n = this.context;
		this.ensureOcclusionTarget();
		let r = this.occlusionUniforms;
		n.bindFramebuffer(n.FRAMEBUFFER, this.occlusionTarget.framebuffer), n.viewport(0, 0, this.occlusionTarget.width, this.occlusionTarget.height), n.disable(n.DEPTH_TEST), n.disable(n.CULL_FACE), n.bindVertexArray(null), n.useProgram(this.occlusionProgram), n.activeTexture(n.TEXTURE1), n.bindTexture(n.TEXTURE_2D, this.depthTexture), n.uniform1i(r.sceneDepth, 1), n.uniformMatrix4fv(r.inverseViewProjection, !1, g([], this.projection)), n.uniform1f(r.radius, t.ambientOcclusionRadius), n.uniform1f(r.projectionScale, .5 * this.projection[5]), n.uniform1f(r.aspect, this.canvas.width / this.canvas.height), n.uniform1f(r.orthographic, +(e.projection === "orthographic")), n.drawArrays(n.TRIANGLES, 0, 3);
	}
	allocateFrameTargets(e, t) {
		let n = this.context;
		this.releaseFrameTargets(), this.multisampleFramebuffer = n.createFramebuffer(), n.bindFramebuffer(n.FRAMEBUFFER, this.multisampleFramebuffer), this.multisampleColor = n.createRenderbuffer(), n.bindRenderbuffer(n.RENDERBUFFER, this.multisampleColor), n.renderbufferStorageMultisample(n.RENDERBUFFER, this.multisampleSamples, this.hdr ? n.RGBA16F : n.RGBA8, e, t), n.framebufferRenderbuffer(n.FRAMEBUFFER, n.COLOR_ATTACHMENT0, n.RENDERBUFFER, this.multisampleColor), this.multisampleDepth = n.createRenderbuffer(), n.bindRenderbuffer(n.RENDERBUFFER, this.multisampleDepth);
		let r = "DEPTH_COMPONENT24";
		if (n.renderbufferStorageMultisample(n.RENDERBUFFER, this.multisampleSamples, n[r], e, t), n.framebufferRenderbuffer(n.FRAMEBUFFER, n.DEPTH_ATTACHMENT, n.RENDERBUFFER, this.multisampleDepth), n.checkFramebufferStatus(n.FRAMEBUFFER) !== n.FRAMEBUFFER_COMPLETE) throw Error("Multisample framebuffer allocation failed. Choose a lower quality preset.");
		if (this.renderTargets.record("multisampleColor", {
			width: e,
			height: t,
			format: this.hdr ? "RGBA16F" : "RGBA8",
			samples: this.multisampleSamples
		}), this.renderTargets.record("multisampleDepth", {
			width: e,
			height: t,
			format: r,
			samples: this.multisampleSamples
		}), this.renderTargets.record("frameColor", {
			width: e,
			height: t,
			format: this.hdr ? "RGBA16F" : "RGBA8"
		}), this.frameTexture = n.createTexture(), n.bindTexture(n.TEXTURE_2D, this.frameTexture), n.texImage2D(n.TEXTURE_2D, 0, this.hdr ? n.RGBA16F : n.RGBA8, e, t, 0, n.RGBA, this.hdr ? n.HALF_FLOAT : n.UNSIGNED_BYTE, null), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MIN_FILTER, n.LINEAR), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MAG_FILTER, n.LINEAR), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_S, n.CLAMP_TO_EDGE), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_T, n.CLAMP_TO_EDGE), this.resolveFramebuffer = n.createFramebuffer(), n.bindFramebuffer(n.FRAMEBUFFER, this.resolveFramebuffer), n.framebufferTexture2D(n.FRAMEBUFFER, n.COLOR_ATTACHMENT0, n.TEXTURE_2D, this.frameTexture, 0), this.depth && (this.depthTexture = n.createTexture(), n.bindTexture(n.TEXTURE_2D, this.depthTexture), n.texImage2D(n.TEXTURE_2D, 0, n.DEPTH_COMPONENT24, e, t, 0, n.DEPTH_COMPONENT, n.UNSIGNED_INT, null), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MIN_FILTER, n.NEAREST), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MAG_FILTER, n.NEAREST), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_S, n.CLAMP_TO_EDGE), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_T, n.CLAMP_TO_EDGE), n.framebufferTexture2D(n.FRAMEBUFFER, n.DEPTH_ATTACHMENT, n.TEXTURE_2D, this.depthTexture, 0), this.renderTargets.record("sceneDepth", {
			width: e,
			height: t,
			format: "DEPTH_COMPONENT24"
		})), n.checkFramebufferStatus(n.FRAMEBUFFER) !== n.FRAMEBUFFER_COMPLETE) throw Error("Resolve framebuffer allocation failed. Choose a lower quality preset.");
		this.bloomWidth = Math.max(1, Math.ceil(e / 2)), this.bloomHeight = Math.max(1, Math.ceil(t / 2)), n.bindFramebuffer(n.FRAMEBUFFER, null);
	}
	startEnvironmentPrograms() {
		this.pendingEnvironmentPrograms = /* @__PURE__ */ new Map();
		for (let e of [L().prefilterFragment, L().brdfFragment]) this.pendingEnvironmentPrograms.set(e, A(this.context, D, e));
	}
	compileEnvironmentProgram(e, t, n) {
		let r = this.pendingEnvironmentPrograms?.get(n);
		return r ? (this.pendingEnvironmentPrograms.delete(n), k(e, r)) : O(e, t, n);
	}
	initializeEnvironment(e) {
		let t = this.context;
		t.useProgram(this.program), t.uniform1i(this.uniforms.environmentSpecular, W), t.uniform1i(this.uniforms.environmentBrdf, rn), this.liquidProgram && (t.useProgram(this.liquidProgram), t.uniform1i(this.liquidUniforms.environmentSpecular, W)), this.bindEnvironmentTextures(this.whiteTexture, this.whiteTexture), !this.benchmark && e && !this.deferEnvironmentPrefilter && this.prepareEnvironment(e);
	}
	bindEnvironmentTextures(e, t) {
		let n = this.context;
		n.activeTexture(n.TEXTURE0 + W), n.bindTexture(n.TEXTURE_2D, e), n.activeTexture(n.TEXTURE0 + rn), n.bindTexture(n.TEXTURE_2D, t);
	}
	prepareEnvironment(e) {
		if (L().assertMap(e), this.environmentResources?.data === e.data && this.environmentResources.irradianceSource === e.irradianceSource) return !1;
		L().estimateBytes(e, this.capabilities.maximumTextureSize);
		let t = L().createResources(this.context, e, {
			compileProgram: (e, t, n) => this.compileEnvironmentProgram(e, t, n),
			fullscreenVertex: D
		});
		return this.environmentResources?.dispose(), this.environmentResources = t, this.textureBytes += t.bytes - this.environmentBytes, this.environmentBytes = t.bytes, !0;
	}
	async prepareEnvironmentInSlices(e, t) {
		if (L().assertMap(e), this.environmentResources?.data === e.data && this.environmentResources.irradianceSource === e.irradianceSource) return !1;
		L().estimateBytes(e, this.capabilities.maximumTextureSize);
		let n = await L().createResourcesInSlices(this.context, e, {
			compileProgram: (e, t, n) => this.compileEnvironmentProgram(e, t, n),
			fullscreenVertex: D
		}, t);
		return this.environmentResources?.dispose(), this.environmentResources = n, this.textureBytes += n.bytes - this.environmentBytes, this.environmentBytes = n.bytes, !0;
	}
	activateEnvironment(e) {
		return this.activeMap = this.benchmark ? null : e, this.benchmark || !e ? (this.bindEnvironmentTextures(this.whiteTexture, this.whiteTexture), null) : (this.prepareEnvironment(e) && this.resize(), this.bindEnvironmentTextures(this.environmentResources.specularTexture, this.environmentResources.brdfTexture), e);
	}
	applyEnvironmentUniforms(e, t = this.uniforms) {
		let n = this.context;
		n.uniform1f(t.environmentEnabled, +!!e), e && (t["environmentIrradiance[0]"] && n.uniform3fv(t["environmentIrradiance[0]"], e.irradianceWithBounce?.(this.environmentResources.irradiance) ?? this.environmentResources.irradiance), n.uniform1f(t.environmentIntensity, e.intensity), n.uniform2f(t.environmentRotation, Math.cos(e.rotation), Math.sin(e.rotation)), n.uniform1f(t.environmentLevelMax, this.environmentResources.levelCount - 1));
	}
	drawEnvironmentBackground(e, t, n) {
		if (!e?.showBackground || this.transparent) return !1;
		let r = this.context;
		if (!this.environmentBackgroundProgram) {
			this.environmentBackgroundProgram = O(r, D, this.withViewTransform(L().backgroundFragment, "background"));
			let e = [
				"inverseViewProjection",
				"eye",
				"backgroundLevel",
				"exposure",
				"hdrEnabled",
				"environmentSpecular",
				"environmentRotation",
				"environmentIntensity",
				"environmentLevelMax"
			];
			this.environmentBackgroundUniforms = Object.fromEntries(e.map((e) => [e, r.getUniformLocation(this.environmentBackgroundProgram, e)]));
		}
		let i = this.environmentBackgroundUniforms, a = this.environmentResources.levelCount - 1;
		return r.disable(r.DEPTH_TEST), r.disable(r.CULL_FACE), r.bindVertexArray(null), r.useProgram(this.environmentBackgroundProgram), r.uniformMatrix4fv(i.inverseViewProjection, !1, this.inverseViewProjection), r.uniform3fv(i.eye, t.eye), r.uniform1f(i.backgroundLevel, e.backgroundBlur * a), r.uniform1f(i.exposure, n), r.uniform1f(i.hdrEnabled, +!!this.hdr), r.uniform1i(i.environmentSpecular, W), r.uniform2f(i.environmentRotation, Math.cos(e.rotation), Math.sin(e.rotation)), r.uniform1f(i.environmentIntensity, e.intensity), r.uniform1f(i.environmentLevelMax, a), r.drawArrays(r.TRIANGLES, 0, 3), !0;
	}
	drawSky(e) {
		let t = this.context, n = {
			skyTop: [
				.2,
				.38,
				.52
			],
			skyBottom: [
				.62,
				.7,
				.67
			],
			lightDirection: [
				-3,
				6,
				4
			],
			daylight: 1,
			...this.environment,
			...e.environment
		};
		t.disable(t.DEPTH_TEST), t.disable(t.CULL_FACE), t.bindVertexArray(null), t.useProgram(this.skyProgram), t.uniform3fv(this.skyUniforms.skyTop, n.skyTop), t.uniform3fv(this.skyUniforms.skyBottom, n.skyBottom), t.uniform3fv(this.skyUniforms.sunDirection, n.lightDirection), t.uniformMatrix4fv(this.skyUniforms.inverseViewProjection, !1, this.inverseViewProjection), t.uniform3fv(this.skyUniforms.eye, e.eye), t.uniform1f(this.skyUniforms.time, e.time ?? 0), t.uniform1f(this.skyUniforms.daylight, n.daylight), t.uniform1f(this.skyUniforms.hdrEnabled, +!!this.hdr), t.drawArrays(t.TRIANGLES, 0, 3);
	}
	prepareLocalVolumes(e, t) {
		return e === void 0 || Array.isArray(e) && e.length === 0 ? !1 : c("volumeFog").support.prepareLocalVolumes(this, e, t) > 0;
	}
	postStepsOf(e, t, n, r, i, a) {
		let o = [];
		return this.transparent && o.push("transparent"), r && o.push("occlusion"), t.bloom.strength > 0 && o.push("bloom"), n.density > 0 && o.push("volume"), n.density > 0 && n.field && o.push("field"), n.density > 0 && c("volumeFog").support.usesDetail(n) && o.push("detail"), n.density > 0 && this.fogLightBuffers?.count > 0 && o.push("lights"), a && o.push("local"), i && o.push("sky"), e.volumeExplosion && o.push("explosion"), (t.saturation !== 1 || t.contrast !== 1 || t.temperature !== 0 || (e.monochrome ?? 0) !== 0 || e.cinematic || t.vignette !== 0 || t.grain !== 0) && o.push("finish"), o;
	}
	selectPostProgram(e) {
		if (e.join() === we.join()) return {
			program: this.postProgram,
			uniforms: this.postUniforms
		};
		let t = e.join(","), n = this.postVariants.get(t);
		if (n || (n = { pending: A(this.context, D, this.withViewTransform(Ae(e), "post")) }, this.postVariants.set(t, n)), n.pending) {
			let t = this.context.getExtension("KHR_parallel_shader_compile");
			if (t && !Ce.some((t) => e.includes(t)) && !this.context.getProgramParameter(n.pending.program, t.COMPLETION_STATUS_KHR)) return {
				program: this.postProgram,
				uniforms: this.postUniforms
			};
			n.program = k(this.context, n.pending), n.uniforms = Ht(this.context, n.program), n.pending = null;
		}
		return n;
	}
	restoreSingleLevelFiltering() {
		if (!this.mipmappedTexture) return;
		let e = this.context;
		e.bindTexture(e.TEXTURE_2D, this.mipmappedTexture), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), this.mipmappedTexture = null;
	}
	resolveFrame(e, t, n, r) {
		let i = this.context;
		i.bindFramebuffer(i.READ_FRAMEBUFFER, this.multisampleFramebuffer), i.bindFramebuffer(i.DRAW_FRAMEBUFFER, this.resolveFramebuffer), i.blitFramebuffer(0, 0, this.canvas.width, this.canvas.height, 0, 0, this.canvas.width, this.canvas.height, i.COLOR_BUFFER_BIT | (this.depth ? i.DEPTH_BUFFER_BIT : 0), i.NEAREST), this.restoreSingleLevelFiltering();
		let a = this.frameTexture;
		for (let n of this.postStages) a = n.apply(this, e, t, a) ?? a;
		t.bloom.strength > 0 && this.drawBloom(t.bloom, a);
		let o = t.ambientOcclusion > 0 && !!this.depthTexture;
		o && this.drawAmbientOcclusion(e, t), i.bindFramebuffer(i.FRAMEBUFFER, e.outputFramebuffer ?? null), i.viewport(0, 0, this.canvas.width, this.canvas.height), i.disable(i.DEPTH_TEST), i.disable(i.CULL_FACE), i.bindVertexArray(null);
		let s = this.fogSkyVisibility?.(this.sceneParts, r, i, n), l = r.density > 0 ? c("volumeFog").support : null, d = this.prepareLocalVolumes(n.localVolumes, e);
		l ? l.packLights(this) : this.fogLightBuffers && (this.fogLightBuffers.count = 0);
		let f = this.selectPostProgram(this.postStepsOf(e, t, r, o, s, d));
		i.useProgram(f.program), this.look && u.bindLook(this, f.program), i.activeTexture(i.TEXTURE0), i.bindTexture(i.TEXTURE_2D, a), r.density > 0 ? (i.generateMipmap(i.TEXTURE_2D), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_MIN_FILTER, i.LINEAR_MIPMAP_LINEAR), this.mipmappedTexture = a) : this.mipmappedTexture === a && (i.texParameteri(i.TEXTURE_2D, i.TEXTURE_MIN_FILTER, i.LINEAR), this.mipmappedTexture = null), i.uniform1i(f.uniforms.frameTexture, 0), i.activeTexture(i.TEXTURE1), i.bindTexture(i.TEXTURE_2D, this.depthTexture ?? this.whiteTexture), i.uniform1i(f.uniforms.sceneDepth, 1), l?.bindUniforms(this, f, r, n, e), d && c("volumeFog").support.bindLocalVolumes(this, f, e), i.activeTexture(i.TEXTURE2), i.bindTexture(i.TEXTURE_2D, t.bloom.strength > 0 ? this.bloomTargets[1].texture : this.whiteTexture), i.uniform1i(f.uniforms.bloomTexture, 2), i.uniform1f(f.uniforms.bloomStrength, t.bloom.strength), i.activeTexture(i.TEXTURE4), i.bindTexture(i.TEXTURE_2D, o ? this.occlusionTarget.texture : this.whiteTexture), i.uniform1i(f.uniforms.occlusionTexture, 4), i.uniform1f(f.uniforms.occlusionStrength, o ? t.ambientOcclusion : 0), i.uniform2f(f.uniforms.occlusionTexel, 1 / Math.ceil(this.canvas.width / 2), 1 / Math.ceil(this.canvas.height / 2)), i.uniform1f(f.uniforms.transparent, +!!this.transparent), i.uniform1f(f.uniforms.hdrEnabled, +!!this.hdr), i.uniform3f(f.uniforms.grade, t.saturation, t.contrast, t.temperature), i.uniform1f(f.uniforms.vignette, t.vignette), i.uniform1f(f.uniforms.grainAmount, t.grain), i.uniform2f(f.uniforms.resolution, this.canvas.width, this.canvas.height), i.uniform1f(f.uniforms.monochrome, e.monochrome ?? 0), i.uniform1f(f.uniforms.fade, e.fade ?? 0), i.uniform1f(f.uniforms.cinematic, +!!e.cinematic), i.uniform1f(f.uniforms.time, e.time ?? 0), i.uniform1f(f.uniforms.volumeExplosion, +!!e.volumeExplosion), i.uniform1f(f.uniforms.explosionProgress, e.explosionProgress ?? 1), i.uniformMatrix4fv(f.uniforms.inverseViewProjection, !1, this.inverseViewProjection), i.uniform3fv(f.uniforms.eye, e.eye), i.drawArrays(i.TRIANGLES, 0, 3);
	}
	drawTranslucent(e, t, n, r) {
		this.activateEnvironment(r);
		let i = this.batches.filter((e) => U(e) === "liquid"), a = this.batches.filter((e) => U(e) === "foam");
		(i.length !== 0 || a.length !== 0) && x()(this, {
			frame: e,
			environment: t,
			assemblyAmount: n,
			environmentMap: r,
			liquids: i,
			foams: a,
			environmentSpecularUnit: W,
			maximumDistance: Et,
			vertexSource: S,
			fragmentSource: T()
		});
	}
	ensureBloomTargets() {
		if (this.bloomTargets.length > 0) return;
		let e = this.context;
		for (let t = 0; t < 2; t++) {
			let t = e.createTexture(), n = e.createFramebuffer();
			if (this.bloomTargets.push({
				texture: t,
				framebuffer: n
			}), e.bindTexture(e.TEXTURE_2D, t), e.texImage2D(e.TEXTURE_2D, 0, this.hdr ? e.RGBA16F : e.RGBA8, this.bloomWidth, this.bloomHeight, 0, e.RGBA, this.hdr ? e.HALF_FLOAT : e.UNSIGNED_BYTE, null), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), e.bindFramebuffer(e.FRAMEBUFFER, n), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, t, 0), e.checkFramebufferStatus(e.FRAMEBUFFER) !== e.FRAMEBUFFER_COMPLETE) throw Error("Bloom framebuffer allocation failed. Choose a lower quality preset.");
		}
		e.bindFramebuffer(e.FRAMEBUFFER, null), this.renderTargets.record("bloomA", {
			width: this.bloomWidth,
			height: this.bloomHeight,
			format: this.hdr ? "RGBA16F" : "RGBA8"
		}), this.renderTargets.record("bloomB", {
			width: this.bloomWidth,
			height: this.bloomHeight,
			format: this.hdr ? "RGBA16F" : "RGBA8"
		});
	}
	drawBloom(e, t = this.frameTexture) {
		let n = this.context;
		this.ensureBloomTargets(), n.disable(n.DEPTH_TEST), n.disable(n.CULL_FACE), n.bindVertexArray(null), n.useProgram(this.bloomProgram), n.viewport(0, 0, this.bloomWidth, this.bloomHeight), n.uniform1i(this.bloomUniforms.sourceTexture, 0), n.uniform1f(this.bloomUniforms.threshold, e.threshold);
		for (let r = 0; r < 2; r++) n.bindFramebuffer(n.FRAMEBUFFER, this.bloomTargets[r].framebuffer), n.activeTexture(n.TEXTURE0), n.bindTexture(n.TEXTURE_2D, r === 0 ? t : this.bloomTargets[0].texture), n.uniform1f(this.bloomUniforms.extract, +(r === 0)), n.uniform2f(this.bloomUniforms.texelDirection, r === 0 ? e.radius / this.bloomWidth : 0, r === 1 ? e.radius / this.bloomHeight : 0), n.drawArrays(n.TRIANGLES, 0, 3);
	}
	applyAlphaState(e, t) {
		let n = this.context;
		e.doubleSided || !t ? n.disable(n.CULL_FACE) : n.enable(n.CULL_FACE);
		let r = e.alphaMode === "mask";
		if (!t) {
			let t = this.depthAlphaUniforms;
			n.uniform1f(t.alphaMasked, +!!r), n.uniform1f(t.alphaCutoff, e.alphaCutoff), n.uniform1f(t.materialOpacity, e.opacity), n.uniform1f(t.hasBaseMap, +!!e.mapState[0]), i.bindDepth?.(this, e), (r || e.tintedShadow) && (n.activeTexture(n.TEXTURE0 + 1), n.bindTexture(n.TEXTURE_2D, e.textures[0]));
			return;
		}
		this.applyDepthRank((e.depthLayer ?? 0) * 16);
		let a = r && this.samples > 1 && !this.benchmark && !this.renderingPass;
		a ? n.enable(n.SAMPLE_ALPHA_TO_COVERAGE) : n.disable(n.SAMPLE_ALPHA_TO_COVERAGE);
		let o = this.uniforms;
		n.uniform1f(o.alphaMode, Dt[e.alphaMode]), n.uniform1f(o.alphaCutoff, e.alphaCutoff), n.uniform1f(o.materialOpacity, e.opacity), n.uniform1f(o.alphaToCoverage, +!!a), n.uniform1f(o.doubleSided, +!!e.doubleSided);
	}
	applyDepthRank(e, t = -1) {
		let n = this.context;
		n.uniform3f(this.uniforms.flushBias, e * Pt, e * Ft, t < 0 && e ? -e * It : 0), e ? (n.enable(n.POLYGON_OFFSET_FILL), n.polygonOffset(t * e * Lt, 0)) : n.disable(n.POLYGON_OFFSET_FILL);
	}
	setFlushProjection(e) {
		let t = this.view, n = [
			-t[2],
			-t[6],
			-t[10]
		];
		for (let t = 0; t < 4; t++) Rt[t] = e[t] * n[0] + e[4 + t] * n[1] + e[8 + t] * n[2];
		this.context.uniform4fv(this.uniforms.clipPerMetre, Rt);
	}
	uploadSortedInstances(e, t) {
		if (e.instanceCount < 2) return;
		let n = e.instanceData, r = Array.from({ length: e.instanceCount }, (e, r) => {
			let i = r * R;
			return {
				index: r,
				distance: Math.hypot(n[i + 12] - t[0], n[i + 13] - t[1], n[i + 14] - t[2])
			};
		});
		r.sort((e, t) => t.distance - e.distance), e.sortedData ??= new Float32Array(n.length), r.forEach(({ index: t }, r) => {
			e.sortedData.set(n.subarray(t * R, (t + 1) * R), r * R);
		}), this.context.bindBuffer(this.context.ARRAY_BUFFER, e.instanceBuffer), this.context.bufferSubData(this.context.ARRAY_BUFFER, 0, e.sortedData);
	}
	hasOpaqueInstance(e) {
		for (let t = 0; t < e.instanceCount; t++) if (e.instanceData[t * R + Tt] >= .999) return !0;
		return !1;
	}
	drawBlendBatches(e) {
		let t = this.context, n = e.eye, r = this.batches.filter((e) => e.alphaMode === "blend" && U(e) === "opaque"), i = this.batches.filter((e) => e.alphaMode === "add" && U(e) === "opaque");
		if (r.length === 0 && i.length === 0) return;
		t.bindFramebuffer(t.FRAMEBUFFER, this.multisampleFramebuffer), t.viewport(0, 0, this.canvas.width, this.canvas.height), t.enable(t.DEPTH_TEST), t.useProgram(this.program), t.activeTexture(t.TEXTURE0), t.bindTexture(t.TEXTURE_2D, this.shadowTexture), t.uniform1i(this.uniforms.shadowMap, 0);
		let a = (e) => {
			let t = 0;
			for (let r = 0; r < e.instanceCount; r++) {
				let i = r * R;
				t += Math.hypot(e.instanceData[i + 12] - n[0], e.instanceData[i + 13] - n[1], e.instanceData[i + 14] - n[2]);
			}
			return t / e.instanceCount;
		}, o = r.map((e) => ({
			batch: e,
			distance: a(e)
		})).sort((e, t) => t.distance - e.distance);
		for (let { batch: e } of o) this.hasOpaqueInstance(e) && this.drawAlphaBatch({
			...e,
			alphaMode: "mask",
			alphaCutoff: .999
		}, !0);
		t.enable(t.BLEND), t.blendFuncSeparate(t.SRC_ALPHA, t.ONE_MINUS_SRC_ALPHA, t.ONE, t.ONE_MINUS_SRC_ALPHA), t.depthMask(!1);
		for (let { batch: e } of o) this.uploadSortedInstances(e, n), this.drawAlphaBatch(e, !0);
		if (i.length > 0) {
			t.blendFuncSeparate(t.SRC_ALPHA, t.ONE, t.ZERO, t.ONE);
			for (let e of i) this.drawAlphaBatch(e, !0);
		}
		t.depthMask(!0), this.applyDepthRank(0), t.disable(t.BLEND), t.disable(t.SAMPLE_ALPHA_TO_COVERAGE), t.enable(t.CULL_FACE), t.bindVertexArray(null);
	}
	drawAlphaBatch(e, t, n = !1) {
		let r = n ? this.selectBatchInstances(e) : null;
		r?.visibleCount !== 0 && (this.applyAlphaState(e, t), this.drawBatch(e, t, r));
	}
	setSingleInstanceUniforms(e) {
		let t = this.context;
		t.uniform3f(this.uniforms.baseColor, e[25], e[26], e[27]), t.uniform4f(this.uniforms.surface, e[28], e[29], e[30], e[31]), t.uniform4f(this.uniforms.instanceEmission, e[38], e[39], e[40], 0), t.uniform1f(this.uniforms.instanceOpacity, e[Tt]), this.shaderFeatures.has("boxMapScale") && t.uniformMatrix3fv(this.uniforms.boxNormalMatrix, !1, e.subarray(16, 25));
	}
	drawBatch(e, t = !1, n = null, r = e) {
		if (this.hasMorphs) {
			let n = t ? this.uniforms : this.depthMorphUniforms;
			this.context.uniform1f(n.morphEnabled, +!!e.morph), e.morph && (this.context.uniform1i(n.morphVertexCount, e.morphTexture.info.vertexCount), this.context.uniform1i(n.morphTargetCount, e.morphTexture.info.targetCount), this.context.uniform1fv(n["morphWeights[0]"], e.morphWeights), this.context.activeTexture(this.context.TEXTURE0 + 8), this.context.bindTexture(this.context.TEXTURE_2D, e.morphTexture.texture));
		}
		if (this.hasSkins) {
			let n = t ? this.uniforms : this.depthSkinUniforms;
			this.context.uniform1f(n.crowdEnabled, +!!e.crowd), this.context.uniform1f(n.skinEnabled, +!!e.skin), e.crowd ? (this.context.activeTexture(this.context.TEXTURE0 + 7), this.context.bindTexture(this.context.TEXTURE_2D, e.crowdTexture.texture), this.context.uniform1i(n.jointPalette, 7)) : e.skin && (this.context.activeTexture(this.context.TEXTURE0 + 6), this.context.bindTexture(this.context.TEXTURE_2D, e.influenceTexture.texture), this.context.uniform1i(n.skinInfluences, 6), this.context.activeTexture(this.context.TEXTURE0 + 7), this.context.bindTexture(this.context.TEXTURE_2D, e.skinTexture.texture), this.context.uniform1i(n.jointPalette, 7));
		}
		if (t && !this.benchmark) {
			this.context.uniform1f(this.uniforms.shadowBlind, +(e.receivesShadow === !1)), this.context.uniform1f(this.uniforms.tintBlind, +!!e.tintBlind), this.context.uniform1f(this.uniforms.compositeMode, e.compositeMode ?? 0);
			for (let t = 0; t < B.length; t++) this.context.activeTexture(this.context.TEXTURE0 + t + 1), this.context.bindTexture(this.context.TEXTURE_2D, e.textures[t]), this.context.uniform1i(this.uniforms[kt[t]], t + 1), this.context.uniform1f(this.uniforms[At[t]], e.mapState[t] ? 1 + (e.mapState[t].uvChannel ?? 0) : 0);
			this.context.uniform2f(this.uniforms.normalScale, e.mapState[5], e.mapState[6]), this.context.uniform1f(this.uniforms.occlusionStrength, e.mapState[7]), this.context.uniform4f(this.uniforms.materialMoss, e.mapState[8], e.mapState[9], e.mapState[10], e.mapState[11]), this.bindSurfaceWear(e.wear);
			let t = e.layerState;
			this.context.uniform3f(this.uniforms.materialDielectric, t[0], t[1], t[2]), this.context.uniform2f(this.uniforms.materialCoat, t[3], t[4]), this.context.uniform4f(this.uniforms.materialSheen, t[5], t[6], t[7], t[8]), this.context.uniform2f(this.uniforms.materialAnisotropy, t[16], t[17]), this.context.uniform3f(this.uniforms.materialIridescence, t[18], t[19], t[20]), this.context.uniform1i(this.uniforms.lightLinkMask, t[21]), this.context.uniform1f(this.uniforms.materialToon, t[22]), this.context.uniform1f(this.uniforms.boxMapScale, e.mapState[12]), this.context.uniform1i(this.uniforms.boxMapAxis, e.mapState[13]), this.shaderFeatures?.has("splat") && a().bind(this, e.splat), i.bind?.(this, e.mapState, t, e), this.context.uniform1f(this.uniforms.hasLightMap, +!!e.lightMapTexture), e.lightMapTexture && (this.context.activeTexture(this.context.TEXTURE0 + nn), this.context.bindTexture(this.context.TEXTURE_2D, e.lightMapTexture), this.context.uniform1i(this.uniforms.lightMap, nn), this.context.uniform1f(this.uniforms.lightMapScale, e.mapState[15]));
		}
		t && !this.benchmark && this.shaderFeatures?.has("instanced") === !1 && this.setSingleInstanceUniforms(e.instanceData), e.mirrored && this.context.frontFace(this.context.CW);
		let o = t && !this.benchmark ? e.flushOrder?.ranges ?? null : null;
		n && !n.isEverything ? this.drawSelectedLevels(e, n, r, r === e ? o : null) : (this.context.bindVertexArray(e.vertexArray), o ? this.drawFlushRanges(e, o, e.instanceCount) : this.context.drawElementsInstanced(this.context.TRIANGLES, e.indexCount, this.context.UNSIGNED_INT, 0, e.instanceCount)), e.mirrored && this.context.frontFace(this.context.CCW);
	}
	preparePass(e) {
		if (e.pass === void 0) return 0;
		if (!this.passSupport) throw Error("Render passes need installRenderPasses(renderer) from 67js/addons/render-passes.");
		return this.passSupport.prepare(e);
	}
	setFogField(e) {
		this.fogFieldOverride = e === null ? null : ge(e);
	}
	render(e) {
		let { eye: t, target: n = [
			0,
			1.2,
			0
		], armorColor: r = [
			.53,
			.39,
			.24
		], armorSurface: i = [.88, .32], exposure: a = 1, inspection: o = !1 } = e, s = pe(e.effects), u = {
			lightDirection: [
				-3,
				6,
				4
			],
			fogColor: [
				.35,
				.43,
				.43
			],
			fogDensity: .006,
			daylight: 1,
			explosionCenter: [
				0,
				0,
				0
			],
			...this.environment,
			...e.environment
		};
		u.fogDensity ??= this.fittedFogDensity ?? .006;
		let d = he(u.volumeFog);
		if (this.fogFieldOverride && (d.field = this.fogFieldOverride), d.density > 0) {
			if (c("volumeFog"), !this.depth || !this.hdr || this.transparent || this.benchmark) throw Error("Volume fog requires depth:true, active HDR and an opaque canvas");
			if (!Number.isFinite(e.time ?? 0) || Math.abs(e.time ?? 0) > 1e6) throw RangeError("Volume time must be finite and within ±1000000 seconds");
			let t = u.lightDirection, n = t?.length === 3 ? Math.hypot(...t) : NaN;
			if (!Number.isFinite(n) || n < 1e-6 || !Array.from(t).every((e) => typeof e == "number" && Math.abs(e) <= 1e6)) throw RangeError("Volume light direction must have a finite nonzero length and bounded components");
		}
		ue(this.lighting, u, { world: this.world }), this.syncViewTransform(u);
		let f = String(this.activeLightDirection) !== String(u.lightDirection);
		this.activeLightDirection = u.lightDirection, this.diagnostics = tt({
			world: this.world,
			depth: this.depth,
			effects: s,
			lightDirection: u.lightDirection,
			shadowBounds: this.shadowBounds,
			coplanarProblems: this.coplanarDiagnostics?.(this.batches),
			skinProblems: l.reflectedSkinDiagnostics?.(this.partLocations)
		});
		let h = performance.now(), _ = this.context;
		this.beginGpuTiming();
		let v = Math.max(0, Math.min(1, e.assemblyAmount ?? 0)), y = this.updateWindState(e), b = this.assemblyAmount !== v || this.shadowsDirty || y || f;
		this.requireFeatureNames(qt(this.lighting));
		let x = this.preparePass(e);
		this.renderingPass = x > 0, this.volumeShadowWanted = d.density > 0, (b || this.shadowMapSizeWanted() !== this.shadowMapSize) && (this.assemblyAmount = v, this.createShadowMap()), this.updateLocalShadows(b);
		let S = this.activateEnvironment(u.map);
		this.requireFeatureNames([S ? "environmentMap" : "studioLighting"]), m(this.view, t, n, e.up ?? [
			0,
			1,
			0
		]), N(this.projection, this.withFittedNear(e), this.canvas.width / this.canvas.height, { world: this.world }), p(this.viewProjection, this.projection, this.view), g(this.inverseViewProjection, this.viewProjection), Le(this.viewProjection, this.frustumPlanes), this.viewForward = [
			-this.view[2],
			-this.view[6],
			-this.view[10]
		], e.reflectionTarget && this.shadowCascades?.texture ? this.cascadeCastersChanged ||= b : (this.shadowCascades?.update(this, b || !!this.cascadeCastersChanged), this.cascadeCastersChanged = !1);
		let C = e.reflectionTarget;
		_.bindFramebuffer(_.FRAMEBUFFER, C ? C.framebuffer : x ? this.passSupport.framebuffer : this.benchmark ? null : this.multisampleFramebuffer), _.viewport(0, 0, C?.width ?? this.canvas.width, C?.height ?? this.canvas.height), x ? _.clearColor(...this.passSupport.background(e.pass)) : this.transparent ? _.clearColor(0, 0, 0, 0) : _.clearColor(.145, .162, .177, 1);
		let ee = !x && !!S?.showBackground && !this.transparent;
		_.clear(ee ? _.DEPTH_BUFFER_BIT : _.COLOR_BUFFER_BIT | _.DEPTH_BUFFER_BIT);
		let te = !x && this.drawEnvironmentBackground(S, e, a);
		this.world && !this.benchmark && !x && !te && this.drawSky(e), _.enable(_.DEPTH_TEST), _.enable(_.CULL_FACE), _.useProgram(this.program), _.uniformMatrix4fv(this.uniforms.viewProjection, !1, this.viewProjection), this.setFlushProjection(this.viewProjection), _.uniformMatrix4fv(this.uniforms.lightProjection, !1, this.lightProjection), _.uniform1f(this.uniforms.shadowBiasPerSlope, this.shadowBiasPerSlope), _.uniform3fv(this.uniforms.eye, t), this.shadowCascades?.bindUniforms(this), _.uniform3fv(this.uniforms.armorColor, r), _.uniform2fv(this.uniforms.armorSurface, i), _.uniform1f(this.uniforms.exposure, a), _.uniform1f(this.uniforms.inspection, +!!o), _.uniform1f(this.uniforms.hdrEnabled, +!!this.hdr), _.uniform1i(this.uniforms.pointLightCount, e.reflectionTarget ? 0 : this.lighting.pointCount), _.uniform4fv(this.uniforms["pointLightPositions[0]"], this.lighting.positions), _.uniform4fv(this.uniforms["pointLightColors[0]"], this.lighting.colors), _.uniform1fv(this.uniforms["pointLightRadii[0]"], this.lighting.radii), this.applyLocalLightUniforms(!!e.reflectionTarget), this.lighting.bind?.(this), _.uniform3fv(this.uniforms.keyColor, this.lighting.keyColor), _.uniform1f(this.uniforms.fillIntensity, this.lighting.fillIntensity), _.uniform1f(this.uniforms.ambientIntensity, this.lighting.ambientIntensity), _.uniform1f(this.uniforms.specularAntiAliasing, this.lighting.specularAntiAliasing), _.uniform1f(this.uniforms.time, e.time ?? 0), _.uniform1f(this.uniforms.wind, e.wind ?? .3), _.uniform1f(this.uniforms.worldMode, +!!this.world), _.uniform1f(this.uniforms.daylight, u.daylight), _.uniform3fv(this.uniforms.lightDirection, u.lightDirection), _.uniform3fv(this.uniforms.fogColor, u.fogColor), _.uniform1f(this.uniforms.fogDensity, u.fogDensity), _.uniform3fv(this.uniforms.waterRipple, e.waterRipple ?? [
			1e4,
			0,
			1e4
		]), _.uniform1f(this.uniforms.rippleTime, e.rippleTime ?? -1e3), _.uniform1f(this.uniforms.explosionProgress, e.explosionProgress ?? 1), _.uniform3fv(this.uniforms.explosionCenter, u.explosionCenter), _.uniform1f(this.uniforms.assemblyAmount, v), _.activeTexture(_.TEXTURE0), _.bindTexture(_.TEXTURE_2D, this.shadowTexture), _.uniform1i(this.uniforms.shadowMap, 0), this.bindTintedShadows(), this.applyEnvironmentUniforms(S), _.uniform1f(this.uniforms.renderPassMode, x), _.uniform1f(this.uniforms.renderPassDepthRange, e.passDepthRange ?? 100), x > 5 && this.passSupport.bindFrame(e, u, d);
		let w = 0;
		for (let t of this.batches) this.benchmark ? this.drawBatch(t, !0) : (x > 5 ? this.passSupport.drawsInPass(t, x) : this.drawsInOpaqueLoop(t)) && !(C && t.mapState[20]) && (_.uniform1f(this.uniforms.renderPassObjectBase, w), w += t.instanceCount, x > 5 ? this.passSupport.drawBatch(t, x, e, w - t.instanceCount) : this.drawAlphaBatch(t, !0, x !== jn));
		this.applyDepthRank(0), _.disable(_.SAMPLE_ALPHA_TO_COVERAGE), _.enable(_.CULL_FACE), _.bindVertexArray(null), C ? (this.renderingPass = !1, this.endGpuTiming()) : (x ? this.passSupport.copyToCanvas() : this.benchmark || (this.drawTranslucent(e, u, v, S), this.drawBlendBatches(e), this.resolveFrame(e, s, u, d)), this.renderingPass = !1, this.endGpuTiming(), this.cpuMilliseconds = performance.now() - h);
	}
	beginGpuTiming() {
		this.gpuTimer === void 0 && (this.gpuTimer = this.createGpuTimer?.(this.context) ?? null), this.gpuTimer?.begin();
	}
	endGpuTiming() {
		this.gpuTimer && (this.gpuTimer.end(), this.gpuMilliseconds = this.gpuTimer.collect());
	}
	applyLocalLightUniforms(e = !1) {
		let t = this.context, n = this.lighting, r = this.uniforms;
		t.uniform1fv(r["pointLightShadowTiles[0]"], n.pointShadows), t.uniform1i(r.spotLightCount, e ? 0 : n.spotCount), t.uniform4fv(r["spotLightPositions[0]"], n.spotPositions), t.uniform4fv(r["spotLightColors[0]"], n.spotColors), t.uniform4fv(r["spotLightDirections[0]"], n.spotDirections), t.uniform4fv(r["spotLightParameters[0]"], n.spotParameters), t.uniform1i(r.areaLightCount, e ? 0 : n.areaCount), t.uniform4fv(r["areaLightPositions[0]"], n.areaPositions), t.uniform4fv(r["areaLightColors[0]"], n.areaColors), t.uniform4fv(r["areaLightNormals[0]"], n.areaNormals), t.uniform4fv(r["areaLightTangents[0]"], n.areaTangents), n.shadowCasters.length !== 0 && this.localShadowTexture && (t.uniformMatrix4fv(r["localShadowMatrices[0]"], !1, this.localShadowMatrices), t.uniform1fv(r["localShadowTexelAngles[0]"], this.localShadowTexelAngles), t.activeTexture(t.TEXTURE0 + an), t.bindTexture(t.TEXTURE_2D, this.localShadowTexture), t.uniform1i(r.localShadowAtlas, an), t.activeTexture(t.TEXTURE0));
	}
	dispose() {
		this.fogFieldTexture?.dispose(), this.releaseFrameTargets(), this.shadowCascades?.dispose(this.context, this.renderTargets), u.dispose?.(this), this.localShadowTexture && this.context.deleteTexture(this.localShadowTexture), this.localShadowFramebuffer && this.context.deleteFramebuffer(this.localShadowFramebuffer), this.placeholderShadowTexture && this.context.deleteTexture(this.placeholderShadowTexture), this.tintFramebuffer && (this.context.deleteTexture(this.tintTexture), this.context.deleteFramebuffer(this.tintFramebuffer)), this.batches.forEach((e) => {
			this.context.deleteVertexArray(e.vertexArray), this.releaseLevelDraws(e);
		}), this.buffers.forEach((e) => this.context.deleteBuffer(e)), this.geometryBuffers?.clear(), this.context.deleteTexture(this.shadowTexture), this.context.deleteFramebuffer(this.shadowFramebuffer), this.context.deleteProgram(this.program), this.liquidProgram && this.context.deleteProgram(this.liquidProgram), this.context.deleteProgram(this.depthProgram), this.postProgram && this.context.deleteProgram(this.postProgram);
		for (let e of this.postVariants?.values() ?? []) this.context.deleteProgram(e.pending ? k(this.context, e.pending) : e.program);
		this.skyProgram && this.context.deleteProgram(this.skyProgram), this.bloomProgram && this.context.deleteProgram(this.bloomProgram), this.occlusionProgram && this.context.deleteProgram(this.occlusionProgram), this.passSupport?.dispose(this.context);
		for (let e of this.postStages ?? []) e.dispose(this.context);
		this.environmentBackgroundProgram && this.context.deleteProgram(this.environmentBackgroundProgram), this.environmentResources?.dispose();
		for (let e of this.textures.values()) this.context.deleteTexture(e);
		this.splatPlaceholder && a().dispose(this), this.textures.clear();
		for (let e of [
			this.skinTextures,
			this.influenceTextures,
			this.morphTextures
		]) {
			for (let t of e?.values() ?? []) this.context.deleteTexture(t.texture);
			e?.clear();
		}
		this.partLocations.clear(), this.updatePartIdentities?.clear(), this.updateSkins?.clear(), this.updateMorphs?.clear(), this.updateBatches?.clear();
	}
};
export { Jt as n, Q as r, Yn as t };
