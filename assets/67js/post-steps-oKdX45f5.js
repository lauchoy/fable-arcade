/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { s as e } from "./shader-registry-DHYkwAg5.js";
import { createStage as t, sharedFragmentHeader as n } from "./camera-effects.js";
var r = 128;
function i(e, t, n, r, i) {
	let a = e ?? t;
	if (!Number.isFinite(a) || a < n || a > r) throw RangeError(`${i} must be between ${n} and ${r}.`);
	return a;
}
function a(e, t, n) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw TypeError(`${n} must be an object.`);
	for (let r of Object.keys(e)) if (!t.includes(r)) throw TypeError(`Unknown ${n} field "${r}". Fix: use ${t.join(", ")}.`);
}
function o(e, t) {
	if (!Array.isArray(e) || e.length === 0 || e.length > 16) throw TypeError(`${t} must be a list of 1 to 16 part names.`);
	return e.forEach((e, n) => {
		if (typeof e != "string" || e.length === 0 || e.length > r) throw TypeError(`${t}[${n}] must be a part name of 1 to ${r} characters. Fix: pass the node id, as the object ID pass lists it.`);
	}), [...e];
}
function s(e, t) {
	if (a(e, [
		"objects",
		"depth",
		"invert"
	], t), e.objects === void 0 && e.depth === void 0) throw TypeError(`${t} needs a source. Fix: name objects (a list of part names), depth ({ near, far, feather }), or both.`);
	let n = { invert: e.invert === !0 };
	if (e.invert !== void 0 && typeof e.invert != "boolean") throw TypeError(`${t}.invert must be true or false.`);
	if (e.objects !== void 0 && (n.objects = o(e.objects, `${t}.objects`)), e.depth !== void 0) {
		a(e.depth, [
			"near",
			"far",
			"feather"
		], `${t}.depth`);
		let r = i(e.depth.near, 0, 0, 1e5, `${t}.depth.near`), o = i(e.depth.far, 1e5, 0, 1e5, `${t}.depth.far`);
		if (o <= r) throw RangeError(`${t}.depth.far must be greater than near. Fix: distances are metres along the view direction.`);
		n.depth = {
			near: r,
			far: o,
			feather: i(e.depth.feather, 0, 0, 1e4, `${t}.depth.feather`)
		};
	}
	return n;
}
function c(e) {
	return Object.values(e).some((e) => !!e?.mask?.objects);
}
var l = [
	"objectIds",
	"maskObjectCount",
	"maskObjectIds",
	"maskUseDepth",
	"maskDepth",
	"maskInvert",
	"maskEye",
	"maskForward"
], u = "\nuniform sampler2D objectIds;\nuniform int maskObjectCount;\nuniform int maskObjectIds[16];\nuniform float maskUseDepth;\nuniform vec3 maskDepth;\nuniform float maskInvert;\nuniform vec3 maskEye;\nuniform vec3 maskForward;\nfloat maskAt(vec2 coordinate) {\n  float mask = 1.0;\n  if (maskObjectCount > 0) {\n    vec3 idBytes = floor(texelFetch(objectIds, ivec2(coordinate * resolution), 0).rgb * 255.0 + 0.5);\n    int identifier = int(idBytes.r + idBytes.g * 256.0 + idBytes.b * 65536.0);\n    float hit = 0.0;\n    for (int index = 0; index < 16; index++) {\n      if (index >= maskObjectCount) break;\n      if (maskObjectIds[index] == identifier) hit = 1.0;\n    }\n    mask *= hit;\n  }\n  if (maskUseDepth > 0.5) {\n    float distanceAlongView = dot(worldPointAt(coordinate) - maskEye, maskForward);\n    float feather = max(maskDepth.z, 0.0001);\n    mask *= clamp((distanceAlongView - (maskDepth.x - feather)) / feather, 0.0, 1.0)\n      * (1.0 - clamp((distanceAlongView - maskDepth.y) / feather, 0.0, 1.0));\n  }\n  return mix(mask, 1.0 - mask, maskInvert);\n}\n";
function d(e, t) {
	if (!e.passSupport) throw Error("A mask by objects needs installRenderPasses(renderer) and the object ID pass drawn first.");
	let n = e.passSupport.objectNames(), r = [];
	for (let e of t) {
		let t = n.flatMap((t, n) => t === e ? [n + 1] : []);
		if (t.length === 0) throw Error(`Mask object "${e}" is not a part in the frame. Fix: use a part name such as ${n.slice(0, 8).map((e) => `"${e}"`).join(", ") || "(the scene has no opaque parts)"}.`);
		r.push(...t);
	}
	if (r.length > 16) throw RangeError(`The mask names ${r.length} parts; the limit is 16. Fix: name fewer parts.`);
	return r;
}
function f(e, t, n, r, i) {
	let a = i?.objects ? d(n, i.objects) : [];
	if (e.uniform1i(t.maskObjectCount, a.length), a.length > 0) {
		let r = /* @__PURE__ */ new Int32Array(16);
		r.set(a), e.uniform1iv(t.maskObjectIds, r), e.activeTexture(e.TEXTURE2), e.bindTexture(e.TEXTURE_2D, n.passSupport.texture), e.uniform1i(t.objectIds, 2);
	}
	e.uniform1f(t.maskUseDepth, +!!i?.depth), i?.depth && (e.uniform3f(t.maskDepth, i.depth.near, i.depth.far, i.depth.feather), e.uniform3fv(t.maskEye, r.eye), e.uniform3fv(t.maskForward, n.viewForward)), e.uniform1f(t.maskInvert, +!!i?.invert), e.activeTexture(e.TEXTURE1);
}
function p(e) {
	e.activeTexture(e.TEXTURE2), e.bindTexture(e.TEXTURE_2D, null), e.activeTexture(e.TEXTURE1);
}
// src/post-steps.js
var m = 8, h = 24, g = 32, _ = 8, v = .03;
function y(e, t, n, r, i) {
	let a = e ?? t;
	if (!Number.isFinite(a) || a < n || a > r) throw RangeError(`${i} must be between ${n} and ${r}.`);
	return a;
}
var b = Object.freeze({
	lift: [
		0,
		0,
		0
	],
	gamma: [
		1,
		1,
		1
	],
	gain: [
		1,
		1,
		1
	]
});
function x(e, t) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw TypeError(`${t} must be an object.`);
	return e;
}
function S(e, t, n) {
	for (let r of Object.keys(e)) if (!t.includes(r)) throw TypeError(`Unknown ${n} field "${r}".`);
}
function C(e, t, n, r, i) {
	let a = e ?? t;
	if (!Array.isArray(a) || a.length !== 3) throw TypeError(`${i} must be three numbers.`);
	return a.map((e, a) => y(e, t[a], n, r, `${i}[${a}]`));
}
function w(e) {
	let t = x(e, "colorBalance");
	return S(t, [
		"lift",
		"gamma",
		"gain",
		"mask"
	], "colorBalance"), {
		lift: C(t.lift, b.lift, -1, 1, "colorBalance.lift"),
		gamma: C(t.gamma, b.gamma, .1, 4, "colorBalance.gamma"),
		gain: C(t.gain, b.gain, 0, 4, "colorBalance.gain"),
		...t.mask === void 0 ? {} : { mask: s(t.mask, "colorBalance.mask") }
	};
}
function T(e, t, n, r) {
	let i = y(e, void 0, t, n, r);
	if (!Number.isInteger(i)) throw RangeError(`${r} must be a whole number.`);
	return i;
}
function E(e) {
	let t = x(e, "stylize");
	S(t, [
		"sharpen",
		"kuwahara",
		"posterize",
		"pixelate",
		"mask"
	], "stylize");
	let n = {};
	return t.sharpen !== void 0 && (n.sharpen = y(t.sharpen, void 0, 0, 2, "stylize.sharpen")), t.kuwahara !== void 0 && (n.kuwahara = T(t.kuwahara, 0, _, "stylize.kuwahara")), t.posterize !== void 0 && (n.posterize = T(t.posterize, 0, 256, "stylize.posterize")), t.pixelate !== void 0 && (n.pixelate = T(t.pixelate, 0, 64, "stylize.pixelate")), t.mask !== void 0 && (n.mask = s(t.mask, "stylize.mask")), n;
}
var D = 64, O = .7;
function k(e, t) {
	if (!Array.isArray(e) || e.length !== 3) throw TypeError(`${t} must be three numbers.`);
	return C(e, [
		0,
		0,
		0
	], 0, D, t);
}
function A(e) {
	let t = x(e, "composite.background");
	if (S(t, [
		"color",
		"top",
		"bottom"
	], "composite.background"), t.color !== void 0) {
		if (t.top !== void 0 || t.bottom !== void 0) throw TypeError("composite.background takes color, or top and bottom, not both. Fix: pass one of them.");
		return { color: k(t.color, "composite.background.color") };
	}
	if (t.top === void 0 || t.bottom === void 0) throw TypeError("composite.background needs color, or both top and bottom. Fix: { \"color\": [0.1, 0.3, 0.8] } or { \"top\": [..], \"bottom\": [..] }.");
	return {
		top: k(t.top, "composite.background.top"),
		bottom: k(t.bottom, "composite.background.bottom")
	};
}
function j(e) {
	let t = x(e, "composite.key");
	if (S(t, ["chroma", "luma"], "composite.key"), t.chroma === void 0 == (t.luma === void 0)) throw TypeError("composite.key needs exactly one of chroma ({ color, tolerance, softness }) or luma ({ low, high, invert }).");
	if (t.chroma !== void 0) {
		let e = x(t.chroma, "composite.key.chroma");
		return S(e, [
			"color",
			"tolerance",
			"softness"
		], "composite.key.chroma"), { chroma: {
			color: k(e.color, "composite.key.chroma.color"),
			tolerance: y(e.tolerance, .3, 0, 1, "composite.key.chroma.tolerance"),
			softness: y(e.softness, .1, 0, 1, "composite.key.chroma.softness")
		} };
	}
	let n = x(t.luma, "composite.key.luma");
	S(n, [
		"low",
		"high",
		"invert"
	], "composite.key.luma");
	let r = y(n.low, 0, 0, 10, "composite.key.luma.low"), i = y(n.high, 1, 0, 10, "composite.key.luma.high");
	if (i <= r) throw RangeError("composite.key.luma.high must be greater than low. Fix: luma is linear scene light, 0.18 is middle grey.");
	if (n.invert !== void 0 && typeof n.invert != "boolean") throw TypeError("composite.key.luma.invert must be true or false.");
	return { luma: {
		low: r,
		high: i,
		invert: n.invert === !0
	} };
}
function M(e) {
	let t = x(e, "composite");
	S(t, [
		"background",
		"key",
		"mask"
	], "composite");
	let n = {};
	if (t.background !== void 0 && (n.background = A(t.background)), t.key !== void 0 && (n.key = j(t.key)), t.mask !== void 0 && (n.mask = s(t.mask, "composite.mask")), n.key && !n.background) throw TypeError("composite.key needs composite.background to show through the keyed pixels. Fix: add background { color } or { top, bottom }.");
	if (n.mask && !n.key) throw TypeError("composite.mask limits the key, so it needs composite.key. Fix: add a key, or remove the mask.");
	return n;
}
function N(e) {
	let t = x(e, "glare");
	S(t, [
		"streaks",
		"count",
		"angle",
		"fogGlow",
		"threshold",
		"size"
	], "glare");
	let n = y(t.count, 4, 1, m, "glare.count");
	if (!Number.isInteger(n)) throw RangeError("glare.count must be a whole number.");
	return {
		streaks: y(t.streaks, 0, 0, 1, "glare.streaks"),
		count: n,
		angle: y(t.angle, 0, -360, 360, "glare.angle"),
		fogGlow: y(t.fogGlow, 0, 0, 1, "glare.fogGlow"),
		threshold: y(t.threshold, 1, 0, 10, "glare.threshold"),
		size: y(t.size, .15, .01, 1, "glare.size")
	};
}
function P(e) {
	let t = x(e, "lensDistortion");
	return S(t, ["distortion", "dispersion"], "lensDistortion"), {
		distortion: y(t.distortion, 0, -1, 1, "lensDistortion.distortion"),
		dispersion: y(t.dispersion, 0, 0, 1, "lensDistortion.dispersion")
	};
}
function F(e) {
	let t = {};
	return e.colorBalance !== void 0 && (t.colorBalance = w(e.colorBalance)), e.glare !== void 0 && (t.glare = N(e.glare)), e.lensDistortion !== void 0 && (t.lensDistortion = P(e.lensDistortion)), e.stylize !== void 0 && (t.stylize = E(e.stylize)), e.composite !== void 0 && (t.composite = M(e.composite)), I(t), t;
}
function I(e) {
	let t = e.lensDistortion, n = !!t && (t.distortion !== 0 || t.dispersion > 0), r = [
		"colorBalance",
		"stylize",
		"composite"
	].find((t) => e[t]?.mask);
	if (n && r) throw TypeError(`${r}.mask cannot be combined with lensDistortion: the mask is in undistorted screen space and would not line up with the warped image. Fix: remove the mask, or set lensDistortion.distortion and dispersion to 0.`);
}
e.fields = [
	"colorBalance",
	"glare",
	"lensDistortion",
	"stylize",
	"composite"
], e.resolve = F;
var L = `${n}
${u}
uniform vec3 lift;
uniform vec3 inverseGamma;
uniform vec3 gain;
void main() {
  vec4 source = texture(sourceTexture, textureCoordinate);
  vec3 graded = source.rgb * gain + lift * (1.0 - clamp(source.rgb, 0.0, 1.0));
  graded = pow(max(graded, vec3(0.0)), inverseGamma);
  float mask = maskAt(textureCoordinate);
  outputColor = vec4(mask < 1.0 ? mix(source.rgb, graded, mask) : graded, source.a);
}`, R = `${n}
${u}
uniform float sharpenAmount;
uniform int kuwaharaRadius;
uniform float posterizeLevels;
uniform float pixelateSize;
vec2 snapped(vec2 coordinate) {
  if (pixelateSize < 1.0) return coordinate;
  return (floor(coordinate * resolution / pixelateSize) + 0.5) * pixelateSize / resolution;
}
vec4 sourceAt(vec2 coordinate) {
  return texture(sourceTexture, snapped(coordinate));
}
vec3 kuwahara(vec2 coordinate) {
  vec3 bestMean = vec3(0.0);
  float bestVariance = 1e30;
  for (int quadrant = 0; quadrant < 4; quadrant++) {
    vec2 direction = vec2(quadrant == 1 || quadrant == 3 ? -1.0 : 1.0, quadrant >= 2 ? -1.0 : 1.0);
    vec3 sum = vec3(0.0);
    float lumaSum = 0.0;
    float lumaSquareSum = 0.0;
    float count = 0.0;
    for (int row = 0; row <= ${_}; row++) {
      if (row > kuwaharaRadius) break;
      for (int column = 0; column <= ${_}; column++) {
        if (column > kuwaharaRadius) break;
        vec3 color = sourceAt(coordinate + direction * vec2(float(column), float(row)) / resolution).rgb;
        float luma = dot(color, vec3(0.299, 0.587, 0.114));
        sum += color;
        lumaSum += luma;
        lumaSquareSum += luma * luma;
        count += 1.0;
      }
    }
    float variance = lumaSquareSum / count - (lumaSum / count) * (lumaSum / count);
    if (variance < bestVariance) {
      bestVariance = variance;
      bestMean = sum / count;
    }
  }
  return bestMean;
}
void main() {
  vec4 source = texture(sourceTexture, textureCoordinate);
  vec4 center = sourceAt(textureCoordinate);
  vec3 color = kuwaharaRadius > 0 ? kuwahara(textureCoordinate) : center.rgb;
  if (sharpenAmount > 0.0) {
    vec2 texel = 1.0 / resolution;
    vec3 around = sourceAt(textureCoordinate + vec2(texel.x, 0.0)).rgb + sourceAt(textureCoordinate - vec2(texel.x, 0.0)).rgb
      + sourceAt(textureCoordinate + vec2(0.0, texel.y)).rgb + sourceAt(textureCoordinate - vec2(0.0, texel.y)).rgb;
    color = max(color + sharpenAmount * (center.rgb * 4.0 - around), vec3(0.0));
  }
  if (posterizeLevels > 0.0) color = floor(color * posterizeLevels + 0.5) / posterizeLevels;
  float mask = maskAt(textureCoordinate);
  outputColor = vec4(mask < 1.0 ? mix(source.rgb, color, mask) : color, source.a);
}`, z = `${n}
${u}
uniform float keyMode;
uniform vec3 keyColor;
uniform vec3 keyRange;
uniform float keyInvert;
uniform vec3 backgroundTop;
uniform vec3 backgroundBottom;
vec2 chromaOf(vec3 color) {
  vec3 normalized = color / max(max(color.r, max(color.g, color.b)), 0.0001);
  return vec2(dot(normalized, vec3(-0.169, -0.331, 0.5)), dot(normalized, vec3(0.5, -0.419, -0.081)));
}
float keepAmount(vec3 color) {
  if (keyMode > 1.5) {
    float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
    float keep = smoothstep(keyRange.x, keyRange.y, luma);
    return mix(keep, 1.0 - keep, keyInvert);
  }
  float distanceToKey = distance(chromaOf(color), chromaOf(keyColor));
  return smoothstep(keyRange.x, keyRange.x + keyRange.y, distanceToKey);
}
void main() {
  vec4 source = texture(sourceTexture, textureCoordinate);
  float keep = 1.0;
  if (keyMode > 0.5) keep = mix(1.0, keepAmount(source.rgb), maskAt(textureCoordinate));
  vec3 background = mix(backgroundBottom, backgroundTop, textureCoordinate.y);
  outputColor = vec4(mix(background, source.rgb, keep * source.a), 1.0);
}`, B = `${n}
uniform float streakAmount;
uniform int streakCount;
uniform float streakAngle;
uniform float fogAmount;
uniform float threshold;
uniform float sizePixels;
uniform float fogLod;
vec3 brightPart(vec2 coordinate, float lod) {
  vec3 color = textureLod(sourceTexture, coordinate, lod).rgb;
  float peak = max(color.r, max(color.g, color.b));
  return color * max(peak - threshold, 0.0) / max(peak, 0.00001);
}
void main() {
  vec4 source = texture(sourceTexture, textureCoordinate);
  vec3 glow = vec3(0.0);
  float jitter = pixelRotation() / 6.2831853;
  if (streakAmount > 0.0) {
    vec3 streaks = vec3(0.0);
    for (int arm = 0; arm < ${m}; arm++) {
      if (arm >= streakCount) break;
      float angle = streakAngle + float(arm) * 6.2831853 / float(streakCount);
      vec2 step = vec2(cos(angle), sin(angle)) * sizePixels / ${h}.0 / resolution;
      for (int index = 1; index <= ${h}; index++) {
        float along = float(index) - jitter;
        float weight = 1.0 - along / (${h}.0 + 1.0);
        streaks += brightPart(textureCoordinate + step * along, 0.0) * weight * weight * weight;
      }
    }
    glow += streaks * streakAmount * 4.0 / ${h}.0;
  }
  if (fogAmount > 0.0) {
    vec3 fog = vec3(0.0);
    float weightSum = 0.0;
    for (int index = 0; index < ${g}; index++) {
      float ring = sqrt((float(index) + 0.5) / ${g}.0);
      float angle = float(index) * 2.3999632;
      float weight = 1.0 - ring * ring;
      fog += brightPart(textureCoordinate + vec2(cos(angle), sin(angle)) * ring * sizePixels / resolution, fogLod) * weight;
      weightSum += weight;
    }
    glow += fog / weightSum * fogAmount;
  }
  outputColor = vec4(source.rgb + glow, source.a);
}`, V = `${n}
uniform float distortion;
uniform float dispersion;
void main() {
  float aspect = resolution.x / resolution.y;
  vec2 centered = (textureCoordinate - 0.5) * 2.0;
  centered.x *= aspect;
  float bend = 1.0 + distortion * 0.25 * dot(centered, centered);
  vec3 spread = 1.0 + dispersion * ${v} * vec3(1.0, 0.0, -1.0);
  float cornerBend = max(1.0 + distortion * 0.25 * (aspect * aspect + 1.0), 1.0);
  vec3 scales = bend * spread / (cornerBend * (1.0 + dispersion * ${v}));
  vec2 red = centered * scales.r;
  vec2 green = centered * scales.g;
  vec2 blue = centered * scales.b;
  vec4 center = texture(sourceTexture, green / vec2(aspect, 1.0) * 0.5 + 0.5);
  outputColor = vec4(texture(sourceTexture, red / vec2(aspect, 1.0) * 0.5 + 0.5).r, center.g,
    texture(sourceTexture, blue / vec2(aspect, 1.0) * 0.5 + 0.5).b, center.a);
}`;
function H(e) {
	return F(e.effects ?? {});
}
function U(e) {
	return !!e && [
		"lift",
		"gamma",
		"gain"
	].some((t) => e[t].some((e, n) => e !== b[t][n]));
}
function W(e) {
	return {
		...e,
		apply(t, n, r, i) {
			let a = e.apply(t, n, r, i);
			return a && p(t.context), a;
		}
	};
}
function G() {
	return W(t({
		name: "Color balance",
		fragment: L,
		uniformNames: [
			"lift",
			"inverseGamma",
			"gain",
			...l
		],
		isActive: (e, t) => U(H(t).colorBalance),
		setUniforms(e, t, n, r) {
			let { colorBalance: i } = H(r);
			e.uniform3fv(t.lift, i.lift), e.uniform3fv(t.inverseGamma, i.gamma.map((e) => 1 / e)), e.uniform3fv(t.gain, i.gain), f(e, t, n, r, i.mask);
		}
	}));
}
function K(e) {
	return !!e && (e.sharpen > 0 || e.kuwahara > 0 || e.posterize > 0 || e.pixelate > 0);
}
function q() {
	return W(t({
		name: "Stylize",
		fragment: R,
		uniformNames: [
			"sharpenAmount",
			"kuwaharaRadius",
			"posterizeLevels",
			"pixelateSize",
			...l
		],
		isActive: (e, t) => K(H(t).stylize),
		setUniforms(e, t, n, r) {
			let { stylize: i } = H(r);
			e.uniform1f(t.sharpenAmount, i.sharpen ?? 0), e.uniform1i(t.kuwaharaRadius, i.kuwahara ?? 0), e.uniform1f(t.posterizeLevels, i.posterize ?? 0), e.uniform1f(t.pixelateSize, i.pixelate ?? 0), f(e, t, n, r, i.mask);
		}
	}));
}
function J() {
	return W(t({
		name: "Composite",
		fragment: z,
		uniformNames: [
			"keyMode",
			"keyColor",
			"keyRange",
			"keyInvert",
			"backgroundTop",
			"backgroundBottom",
			...l
		],
		isActive: (e, t) => !!H(t).composite?.background,
		setUniforms(e, t, n, r) {
			let { composite: i } = H(r), { background: a, key: o } = i;
			e.uniform3fv(t.backgroundTop, a.color ?? a.top), e.uniform3fv(t.backgroundBottom, a.color ?? a.bottom);
			let s = o?.chroma, c = o?.luma;
			e.uniform1f(t.keyMode, s ? 1 : c ? 2 : 0), e.uniform3fv(t.keyColor, s?.color ?? [
				0,
				0,
				0
			]);
			let l = s ? [
				s.tolerance * O,
				Math.max(s.softness * O, 1e-4),
				0
			] : [
				c?.low ?? 0,
				c?.high ?? 1,
				0
			];
			e.uniform3fv(t.keyRange, l), e.uniform1f(t.keyInvert, +!!c?.invert), f(e, t, n, r, i.mask);
		}
	}));
}
function Y() {
	let e = t({
		name: "Glare",
		fragment: B,
		uniformNames: [
			"streakAmount",
			"streakCount",
			"streakAngle",
			"fogAmount",
			"threshold",
			"sizePixels",
			"fogLod"
		],
		isActive: (e, t) => {
			let { glare: n } = H(t);
			return !!n && (n.streaks > 0 || n.fogGlow > 0);
		},
		setUniforms(e, t, n, r) {
			let { glare: i } = H(r);
			e.uniform1f(t.streakAmount, i.streaks), e.uniform1i(t.streakCount, i.count), e.uniform1f(t.streakAngle, i.angle * Math.PI / 180), e.uniform1f(t.fogAmount, i.fogGlow), e.uniform1f(t.threshold, i.threshold);
			let a = i.size * n.canvas.height;
			e.uniform1f(t.sizePixels, a), e.uniform1f(t.fogLod, Math.max(0, Math.log2(a / 1.5)));
		}
	});
	return {
		...e,
		apply(t, n, r, i) {
			let a = t.context, o = H(n).glare?.fogGlow > 0;
			o && (a.activeTexture(a.TEXTURE0), a.bindTexture(a.TEXTURE_2D, i), a.generateMipmap(a.TEXTURE_2D), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.LINEAR_MIPMAP_LINEAR));
			let s = e.apply(t, n, r, i);
			return o && (a.activeTexture(a.TEXTURE0), a.bindTexture(a.TEXTURE_2D, i), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.LINEAR)), s;
		}
	};
}
function X() {
	return t({
		name: "Lens distortion",
		fragment: V,
		uniformNames: ["distortion", "dispersion"],
		isActive: (e, t) => {
			let { lensDistortion: n } = H(t);
			return !!n && (n.distortion !== 0 || n.dispersion > 0);
		},
		setUniforms(e, t, n, r) {
			let { lensDistortion: i } = H(r);
			e.uniform1f(t.distortion, i.distortion), e.uniform1f(t.dispersion, i.dispersion);
		}
	});
}
function Z(e) {
	return e.postStages.some((e) => e.name === "Glare") || e.postStages.push(Y(), X(), G(), q(), J()), e;
}
export { L as colorBalanceFragment, z as compositeFragment, B as glareFragment, Z as installPostSteps, V as lensDistortionFragment, F as resolvePostSteps, R as stylizeFragment, c as usesObjectMask };
