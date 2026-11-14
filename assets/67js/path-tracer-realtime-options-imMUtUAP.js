/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { normalizePathTracerOptions as e } from "./path-tracer.js";
import { _ as t, b as n, g as r, v as i, x as a, y as o } from "./path-tracer-gpu-pack-DYL2MEaQ.js";
import { o as s, r as c } from "./path-tracer-reprojection-BCea75Lv.js";
var l = .02, u = 4, d = 2.5, f = 8, p = "\nfloat luminanceOf(vec3 color) {\n  return dot(color, vec3(0.2126, 0.7152, 0.0722));\n}\nfloat distanceOf(vec4 radianceAndDistance, float farDistance) {\n  return radianceAndDistance.a > 0.0 ? radianceAndDistance.a : farDistance;\n}\n", m = `${r}
${c}
${p}
uniform sampler2D uRadiance;
uniform sampler2D uAlbedo;
uniform sampler2D uNormal;
uniform sampler2D uPreviousRadiance;
uniform sampler2D uPreviousNormal;
uniform sampler2D uHistoryColor;
uniform sampler2D uHistoryMoments;
uniform sampler2D uHistoryAlbedo;
uniform ivec2 uTraceSize;
uniform bool uResetHistory;
uniform float uFarDistance;
uniform float uHistoryLimit;
const float FIREFLY_DEVIATIONS = ${d};
const float SHORT_HISTORY_LENGTH = ${f}.0;
layout(location = 0) out vec4 outColor;
layout(location = 1) out vec4 outMoments;
layout(location = 2) out vec4 outAlbedo;
layout(location = 3) out vec4 outFilter;

vec3 illuminationAt(ivec2 texel) {
  ivec2 clamped = clamp(texel, ivec2(0), uTraceSize - 1);
  return texelFetch(uRadiance, clamped, 0).rgb / max(texelFetch(uAlbedo, clamped, 0).rgb, vec3(${l}));
}

void main() {
  ivec2 texel = ivec2(gl_FragCoord.xy);
  vec4 traced = texelFetch(uRadiance, texel, 0);
  vec3 albedo = texelFetch(uAlbedo, texel, 0).rgb;
  vec3 normal = texelFetch(uNormal, texel, 0).rgb;
  vec3 illumination = traced.rgb / max(albedo, vec3(${l}));
  vec2 size = vec2(uTraceSize);
  float distanceToEye = distanceOf(traced, uFarDistance);
  vec3 point = uEye + pixelRayDirection(vec2(texel) + 0.5, size) * distanceToEye;

  vec4 history = vec4(0.0);
  vec4 historyMoments = vec4(0.0);
  vec3 historyAlbedo = vec3(0.0);
  float totalWeight = 0.0;
  vec2 previousPosition;
  float previousDistance;
  if (!uResetHistory && projectToPrevious(point, size, previousPosition, previousDistance)) {
    vec2 base = floor(previousPosition - 0.5);
    vec2 fraction = previousPosition - 0.5 - base;
    for (int tap = 0; tap < 4; tap++) {
      ivec2 offset = ivec2(tap & 1, tap >> 1);
      ivec2 historyTexel = ivec2(base) + offset;
      if (any(lessThan(historyTexel, ivec2(0))) || any(greaterThanEqual(historyTexel, uTraceSize))) continue;
      float weight = (offset.x == 1 ? fraction.x : 1.0 - fraction.x) * (offset.y == 1 ? fraction.y : 1.0 - fraction.y);
      float historyDistance = distanceOf(texelFetch(uPreviousRadiance, historyTexel, 0), uFarDistance);
      if (!isHistoryConsistent(previousDistance, historyDistance, normal, texelFetch(uPreviousNormal, historyTexel, 0).rgb)) continue;
      history += weight * texelFetch(uHistoryColor, historyTexel, 0);
      historyMoments += weight * texelFetch(uHistoryMoments, historyTexel, 0);
      historyAlbedo += weight * texelFetch(uHistoryAlbedo, historyTexel, 0).rgb;
      totalWeight += weight;
    }
  }

  float neighbourSum = 0.0;
  float neighbourSumOfSquares = 0.0;
  for (int offsetY = -1; offsetY <= 1; offsetY++) {
    for (int offsetX = -1; offsetX <= 1; offsetX++) {
      if (offsetX == 0 && offsetY == 0) continue;
      float neighbour = luminanceOf(illuminationAt(texel + ivec2(offsetX, offsetY)));
      neighbourSum += neighbour;
      neighbourSumOfSquares += neighbour * neighbour;
    }
  }
  float neighbourMean = neighbourSum / 8.0;
  float neighbourDeviation = sqrt(max(0.0, neighbourSumOfSquares / 8.0 - neighbourMean * neighbourMean));
  float luminanceLimit = neighbourMean * 1.05 + FIREFLY_DEVIATIONS * neighbourDeviation + 0.01;
  float luminance = luminanceOf(illumination);
  bool shortHistory = totalWeight <= 1e-3 || history.a < SHORT_HISTORY_LENGTH;
  if (shortHistory && luminance > luminanceLimit) {
    illumination *= luminanceLimit / luminance;
    luminance = luminanceLimit;
  }
  vec2 currentMoments = vec2(luminance, luminance * luminance);
  vec3 color = illumination;
  vec3 blendedAlbedo = albedo;
  vec2 moments = currentMoments;
  float historyLength = 1.0;
  if (totalWeight > 1e-3) {
    history /= totalWeight;
    historyMoments /= totalWeight;
    historyAlbedo /= totalWeight;
    historyLength = min(history.a + 1.0, uHistoryLimit);
    float blend = 1.0 / historyLength;
    color = mix(history.rgb, illumination, blend);
    blendedAlbedo = mix(historyAlbedo, albedo, blend);
    moments = mix(historyMoments.xy, currentMoments, blend);
  }
  float variance = max(0.0, moments.y - moments.x * moments.x);
  if (historyLength < ${u}.0) {
    float sum = neighbourSum + luminance;
    float sumOfSquares = neighbourSumOfSquares + luminance * luminance;
    variance = max(0.0, sumOfSquares / 9.0 - (sum / 9.0) * (sum / 9.0));
  }
  outColor = vec4(color, historyLength);
  outMoments = vec4(moments, variance, 0.0);
  outAlbedo = vec4(blendedAlbedo, 1.0);
  outFilter = vec4(color, variance);
}`, h = `${r}
${c}
${p}
uniform sampler2D uFilter;
uniform sampler2D uRadiance;
uniform sampler2D uNormal;
uniform ivec2 uTraceSize;
uniform int uStep;
uniform float uFarDistance;
out vec4 outFilter;

const float KERNEL[3] = float[3](0.375, 0.25, 0.0625);
const float PLANE_SIGMA = 0.02;
const float LUMINANCE_SIGMA = 4.0;
const float NORMAL_POWER = 64.0;

void main() {
  ivec2 texel = ivec2(gl_FragCoord.xy);
  vec2 size = vec2(uTraceSize);
  vec4 center = texelFetch(uFilter, texel, 0);
  vec3 centerNormal = texelFetch(uNormal, texel, 0).rgb;
  float centerDistance = distanceOf(texelFetch(uRadiance, texel, 0), uFarDistance);
  vec3 centerPoint = pixelRayDirection(vec2(texel) + 0.5, size) * centerDistance;
  float centerLuminance = luminanceOf(center.rgb);
  float smoothedVariance = 0.0;
  for (int offsetY = -1; offsetY <= 1; offsetY++) {
    for (int offsetX = -1; offsetX <= 1; offsetX++) {
      ivec2 neighbour = clamp(texel + ivec2(offsetX, offsetY), ivec2(0), uTraceSize - 1);
      smoothedVariance += texelFetch(uFilter, neighbour, 0).a * (offsetX == 0 ? 0.5 : 0.25) * (offsetY == 0 ? 0.5 : 0.25);
    }
  }
  float luminanceScale = LUMINANCE_SIGMA * sqrt(max(smoothedVariance, 0.0)) + 1e-4;

  vec3 sumColor = vec3(0.0);
  float sumVariance = 0.0;
  float sumWeight = 0.0;
  for (int offsetY = -2; offsetY <= 2; offsetY++) {
    for (int offsetX = -2; offsetX <= 2; offsetX++) {
      ivec2 neighbour = texel + ivec2(offsetX, offsetY) * uStep;
      if (any(lessThan(neighbour, ivec2(0))) || any(greaterThanEqual(neighbour, uTraceSize))) continue;
      vec4 value = texelFetch(uFilter, neighbour, 0);
      float neighbourDistance = distanceOf(texelFetch(uRadiance, neighbour, 0), uFarDistance);
      vec3 neighbourPoint = pixelRayDirection(vec2(neighbour) + 0.5, size) * neighbourDistance;
      float planeDistance = abs(dot(centerNormal, neighbourPoint - centerPoint));
      float planeWeight = exp(-planeDistance / (PLANE_SIGMA * centerDistance));
      float normalWeight = pow(max(dot(centerNormal, texelFetch(uNormal, neighbour, 0).rgb), 0.0), NORMAL_POWER);
      float luminanceWeight = exp(-abs(luminanceOf(value.rgb) - centerLuminance) / luminanceScale);
      float weight = KERNEL[abs(offsetX)] * KERNEL[abs(offsetY)] * planeWeight * normalWeight * luminanceWeight;
      sumColor += weight * value.rgb;
      sumVariance += weight * weight * value.a;
      sumWeight += weight;
    }
  }
  outFilter = sumWeight > 1e-6 ? vec4(sumColor / sumWeight, sumVariance / (sumWeight * sumWeight)) : center;
}`, g = `${r}
${p}
uniform sampler2D uFilter;
uniform sampler2D uAlbedoHistory;
uniform sampler2D uRadiance;
uniform sampler2D uNormal;
uniform ivec2 uTraceSize;
uniform ivec2 uOutputSize;
uniform float uFarDistance;
out vec4 outColor;

vec3 toneMap(vec3 linear) {
  vec3 color = max(linear, vec3(0.0));
  vec3 mapped = clamp((color * (2.51 * color + 0.03)) / (color * (2.43 * color + 0.59) + 0.14), 0.0, 1.0);
  return pow(mapped, vec3(1.0 / 2.2));
}

void main() {
  vec2 outputPixel = vec2(gl_FragCoord.x, float(uOutputSize.y) - gl_FragCoord.y);
  vec2 position = outputPixel / vec2(uOutputSize) * vec2(uTraceSize);
  ivec2 nearest = clamp(ivec2(floor(position)), ivec2(0), uTraceSize - 1);
  float nearestDistance = distanceOf(texelFetch(uRadiance, nearest, 0), uFarDistance);
  vec3 nearestNormal = texelFetch(uNormal, nearest, 0).rgb;
  vec2 base = floor(position - 0.5);
  vec2 fraction = position - 0.5 - base;
  vec3 illumination = vec3(0.0);
  vec3 albedo = vec3(0.0);
  float totalWeight = 0.0;
  for (int tap = 0; tap < 4; tap++) {
    ivec2 offset = ivec2(tap & 1, tap >> 1);
    ivec2 texel = clamp(ivec2(base) + offset, ivec2(0), uTraceSize - 1);
    float weight = (offset.x == 1 ? fraction.x : 1.0 - fraction.x) * (offset.y == 1 ? fraction.y : 1.0 - fraction.y);
    float distanceDifference = abs(distanceOf(texelFetch(uRadiance, texel, 0), uFarDistance) - nearestDistance);
    weight *= exp(-distanceDifference / (0.02 * nearestDistance));
    weight *= pow(max(dot(nearestNormal, texelFetch(uNormal, texel, 0).rgb), 0.0), 16.0);
    illumination += weight * texelFetch(uFilter, texel, 0).rgb;
    albedo += weight * texelFetch(uAlbedoHistory, texel, 0).rgb;
    totalWeight += weight;
  }
  if (totalWeight < 1e-5) {
    illumination = texelFetch(uFilter, nearest, 0).rgb;
    albedo = texelFetch(uAlbedoHistory, nearest, 0).rgb;
    totalWeight = 1.0;
  }
  vec3 light = illumination / totalWeight;
  vec3 surface = albedo / totalWeight;
  outColor = vec4(toneMap(light * max(surface, vec3(${l}))), 1.0);
}`;
function _(e, { traceWidth: r, traceHeight: c, outputWidth: l, outputHeight: u, historyLimit: d = 48, filterIterations: f = 4 }) {
	let p = n(e, m), _ = n(e, h), v = n(e, g), y = () => [i(e, r, c), i(e, r, c)], b = y(), x = y(), S = y(), C = y(), w = [0, 1].map((t) => o(e, [
		{
			slot: 0,
			texture: b[t]
		},
		{
			slot: 1,
			texture: x[t]
		},
		{
			slot: 2,
			texture: S[t]
		},
		{
			slot: 3,
			texture: C[0]
		}
	])), T = C.map((t) => o(e, [{
		slot: 0,
		texture: t
	}])), E = 0, D = (n, i) => {
		t(e, n, "uRadiance", 0, i.radiance), t(e, n, "uNormal", 1, i.normal), e.uniform2i(n.locate("uTraceSize"), r, c), e.uniform1f(n.locate("uFarDistance"), i.farDistance);
	}, O = (n) => {
		let i = 1 - E;
		e.useProgram(p.program), D(p, n), t(e, p, "uAlbedo", 2, n.albedo), t(e, p, "uPreviousRadiance", 3, n.previousRadiance), t(e, p, "uPreviousNormal", 4, n.previousNormal), t(e, p, "uHistoryColor", 5, b[i]), t(e, p, "uHistoryMoments", 6, x[i]), t(e, p, "uHistoryAlbedo", 7, S[i]), s(e, p.locate, n.camera, n.previousCamera), e.uniform1i(p.locate("uResetHistory"), +!!n.resetHistory), e.uniform1f(p.locate("uHistoryLimit"), d), a(e, w[E], r, c);
	}, k = (n) => {
		e.useProgram(_.program), D(_, n), s(e, _.locate, n.camera, n.previousCamera);
		let i = 0;
		for (let n = 0; n < f; n++) t(e, _, "uFilter", 2, C[i]), e.uniform1i(_.locate("uStep"), 1 << n), a(e, T[1 - i], r, c), i = 1 - i;
		return C[i];
	}, A = (n, r) => {
		e.useProgram(v.program), D(v, n), t(e, v, "uFilter", 2, r), t(e, v, "uAlbedoHistory", 3, S[E]), e.uniform2i(v.locate("uOutputSize"), l, u), a(e, null, l, u);
	};
	return {
		run(e) {
			O(e);
			let t = k(e);
			A(e, t), E = 1 - E;
		},
		dispose() {
			for (let t of [
				...b,
				...x,
				...S,
				...C
			]) e.deleteTexture(t);
			for (let t of [...w, ...T]) e.deleteFramebuffer(t);
			for (let t of [
				p,
				_,
				v
			]) e.deleteProgram(t.program);
		}
	};
}
// src/path-tracer-realtime-options.js
var v = ["gpu", "webgpu"], y = 2, b = 2, x = 200, S = 64, C = 1e4;
function w(t) {
	let n = t.resolutionDivisor ?? b, r = t.width ?? 960, i = t.height ?? 540, a = Math.max(1, Math.ceil(r / n)), o = Math.max(1, Math.ceil(i / n)), s = t.backend ?? "gpu";
	if (!v.includes(s)) throw RangeError(`The real-time path tracer backend must be one of ${v.join(", ")}.`);
	let c = e({
		seed: t.seed,
		lightSelection: t.lightSelection ?? "importance",
		bounces: t.bounces ?? y,
		width: a,
		height: o,
		samples: 1,
		backend: "gpu",
		denoise: !1
	});
	return c.radianceCache = !0, {
		backend: s,
		outputWidth: r,
		outputHeight: i,
		traceWidth: a,
		traceHeight: o,
		options: c,
		historyLimit: t.historyLimit,
		filterIterations: t.filterIterations,
		cacheCellSize: t.cacheCellSize,
		followPartMotion: t.followPartMotion ?? !0
	};
}
function T(e, t) {
	let n = e.farDistance / C, r = t ?? n / x;
	return {
		cellSize: r,
		levelDistance: r * S
	};
}
function E(e, t) {
	return !e || !t ? !1 : [
		"eye",
		"forward",
		"right",
		"above"
	].every((n) => e[n].every((e, r) => e === t[n][r])) && e.halfWidth === t.halfWidth && e.halfHeight === t.halfHeight;
}
export { _ as i, w as n, E as r, T as t };
