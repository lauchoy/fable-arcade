/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { l as e } from "./shader-registry-DHYkwAg5.js";
import { a as t, i as n, t as r } from "./local-volumes-DW4FCqaw.js";
import { n as i, t as a } from "./local-volume-parts-BNghoi6p.js";
import { n as o } from "./gl-program-DIc2K8ep.js";
import { t as s } from "./volumetric-D8WftbY1.js";
// src/mesh-volume-pass.js
var c = "#version 300 es\nprecision highp float;\nlayout(location = 0) in vec3 position;\nuniform mat4 viewProjection;\nuniform mat4 model;\nout vec3 worldPosition;\nvoid main() {\n  vec4 world = model * vec4(position, 1.0);\n  worldPosition = world.xyz;\n  gl_Position = viewProjection * world;\n}", l = "#version 300 es\nprecision highp float;\nprecision highp sampler2D;\nin vec3 worldPosition;\nuniform sampler2D sceneDepth;\nuniform mat4 inverseViewProjection;\nuniform vec3 eye;\nuniform float orthographic;\nuniform vec2 resolution;\nuniform float layerOffset;\nuniform float entryPass;\nout vec4 result;\nvoid main() {\n  vec2 pixel = vec2(gl_FragCoord.x, gl_FragCoord.y - layerOffset);\n  vec2 clipXY = pixel / resolution * 2.0 - 1.0;\n  vec4 farPoint = inverseViewProjection * vec4(clipXY, 1.0, 1.0);\n  vec4 nearPoint = inverseViewProjection * vec4(clipXY, -1.0, 1.0);\n  vec3 origin = orthographic > 0.5 ? nearPoint.xyz / nearPoint.w : eye;\n  vec3 direction = normalize(farPoint.xyz - origin * farPoint.w);\n  float depth = texelFetch(sceneDepth, ivec2(pixel), 0).r;\n  vec4 surfacePoint = inverseViewProjection * vec4(clipXY, depth * 2.0 - 1.0, 1.0);\n  float surfaceDistance = 1e30;\n  if (surfacePoint.w > 0.0) surfaceDistance = max(0.0, dot(surfacePoint.xyz - origin * surfacePoint.w, direction) / surfacePoint.w);\n  float distanceAlongRay = clamp(dot(worldPosition - origin, direction), 0.0, surfaceDistance);\n  if (entryPass > 0.5) result = vec4(0.0, gl_FrontFacing ? distanceAlongRay : 1e30, 0.0, 0.0);\n  else result = vec4(gl_FrontFacing ? -distanceAlongRay : distanceAlongRay, 0.0, 0.0, 0.0);\n}", u = [
	"viewProjection",
	"model",
	"sceneDepth",
	"inverseViewProjection",
	"eye",
	"orthographic",
	"resolution",
	"layerOffset",
	"entryPass"
], d = 1e30;
function f(e, t) {
	let n = 0;
	for (let r = 0; r < t.length; r += 3) {
		let i = t[r] * 3, a = t[r + 1] * 3, o = t[r + 2] * 3;
		n += e[i] * (e[a + 1] * e[o + 2] - e[a + 2] * e[o + 1]) + e[i + 1] * (e[a + 2] * e[o] - e[a] * e[o + 2]) + e[i + 2] * (e[a] * e[o + 1] - e[a + 1] * e[o]);
	}
	return n;
}
function p(e) {
	return e[0] * (e[5] * e[10] - e[6] * e[9]) - e[4] * (e[1] * e[10] - e[2] * e[9]) + e[8] * (e[1] * e[6] - e[2] * e[5]);
}
function m(e, t) {
	let n = e.createVertexArray();
	e.bindVertexArray(n);
	let r = e.createBuffer();
	e.bindBuffer(e.ARRAY_BUFFER, r), e.bufferData(e.ARRAY_BUFFER, t.positions instanceof Float32Array ? t.positions : new Float32Array(t.positions), e.STATIC_DRAW), e.enableVertexAttribArray(0), e.vertexAttribPointer(0, 3, e.FLOAT, !1, 0, 0);
	let i = t.indices instanceof Uint16Array, a = e.createBuffer();
	return e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, a), e.bufferData(e.ELEMENT_ARRAY_BUFFER, i || t.indices instanceof Uint32Array ? t.indices : new Uint32Array(t.indices), e.STATIC_DRAW), e.bindVertexArray(null), {
		vertexArray: n,
		buffers: [r, a],
		count: t.indices.length,
		indexType: i ? e.UNSIGNED_SHORT : e.UNSIGNED_INT,
		insideOut: f(t.positions, t.indices) < 0
	};
}
function h(e) {
	let t = e.context;
	if (!t.getExtension("EXT_float_blend")) throw Error("Local volumes with fit \"mesh\" need the WebGL extension EXT_float_blend, which this browser does not offer; use fit \"bounds\"");
	let n = o(t, c, l), r = {
		program: n,
		uniforms: Object.fromEntries(u.map((e) => [e, t.getUniformLocation(n, e)])),
		geometries: /* @__PURE__ */ new Map(),
		target: null
	}, i = e.dispose.bind(e);
	return e.dispose = () => {
		S(e, r), i();
	}, r;
}
function g(e, t, n) {
	let r = e.context, i = e.canvas.width, a = e.canvas.height * n;
	if (t.target?.width === i && t.target.height === a) return;
	if (a > r.getParameter(r.MAX_TEXTURE_SIZE)) throw RangeError(`${n} mesh volumes at ${i}x${e.canvas.height} need a ${a} pixel tall buffer, past this device's limit of ${r.getParameter(r.MAX_TEXTURE_SIZE)}; use fewer volumes with fit "mesh", a smaller canvas or fit "bounds"`);
	_(e, t);
	let o = r.createTexture();
	r.bindTexture(r.TEXTURE_2D, o), r.texImage2D(r.TEXTURE_2D, 0, r.RG32F, i, a, 0, r.RG, r.FLOAT, null), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.NEAREST), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.NEAREST), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, r.CLAMP_TO_EDGE), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.CLAMP_TO_EDGE);
	let s = r.createFramebuffer();
	if (r.bindFramebuffer(r.FRAMEBUFFER, s), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, o, 0), r.checkFramebufferStatus(r.FRAMEBUFFER) !== r.FRAMEBUFFER_COMPLETE) throw Error("The mesh volume buffer could not be allocated; use fit \"bounds\" or a smaller canvas");
	t.target = {
		texture: o,
		framebuffer: s,
		width: i,
		height: a
	}, e.renderTargets.record("meshVolumes", {
		width: i,
		height: a,
		format: "RG32F"
	});
}
function _(e, t) {
	t.target && (e.context.deleteTexture(t.target.texture), e.context.deleteFramebuffer(t.target.framebuffer), t.target = null, e.renderTargets.release("meshVolumes"));
}
function v(e, t) {
	e.deleteVertexArray(t.vertexArray), t.buffers.forEach((t) => e.deleteBuffer(t));
}
function y(e, t, n) {
	let r = new Set(n.map(({ part: e }) => e.geometry));
	for (let [n, i] of t.geometries) r.has(n) || (v(e, i), t.geometries.delete(n));
}
function b(e, t, n) {
	let r = t.geometries.get(n.geometry);
	r || (r = m(e, n.geometry), t.geometries.set(n.geometry, r));
	let i = n.matrix ?? [
		1,
		0,
		0,
		0,
		0,
		1,
		0,
		0,
		0,
		0,
		1,
		0,
		0,
		0,
		0,
		1
	];
	e.uniformMatrix4fv(t.uniforms.model, !1, i), e.frontFace(r.insideOut === p(i) < 0 ? e.CCW : e.CW), e.bindVertexArray(r.vertexArray), e.drawElements(e.TRIANGLES, r.count, r.indexType, 0);
}
function x(e, t) {
	let n = e.localVolumeBuffers?.meshParts ?? [];
	if (n.length === 0) return e.meshVolumePass && y(e.context, e.meshVolumePass, n), null;
	let r = e.context, i = e.meshVolumePass ??= h(e);
	for (let { part: e, label: t } of n) a(e, t);
	y(r, i, n), g(e, i, n.length);
	let { width: o, height: s } = e.canvas, c = r.isEnabled(r.BLEND);
	return r.bindFramebuffer(r.FRAMEBUFFER, i.target.framebuffer), r.colorMask(!0, !0, !0, !0), r.clearBufferfv(r.COLOR, 0, [
		0,
		d,
		0,
		0
	]), r.useProgram(i.program), r.disable(r.DEPTH_TEST), r.disable(r.CULL_FACE), r.enable(r.BLEND), r.blendFunc(r.ONE, r.ONE), r.activeTexture(r.TEXTURE1), r.bindTexture(r.TEXTURE_2D, e.depthTexture), r.uniform1i(i.uniforms.sceneDepth, 1), r.uniformMatrix4fv(i.uniforms.viewProjection, !1, e.viewProjection), r.uniformMatrix4fv(i.uniforms.inverseViewProjection, !1, e.inverseViewProjection), r.uniform3fv(i.uniforms.eye, t.eye), r.uniform1f(i.uniforms.orthographic, +(t.projection === "orthographic")), r.uniform2f(i.uniforms.resolution, o, s), n.forEach(({ part: e }, t) => {
		r.viewport(0, t * s, o, s), r.uniform1f(i.uniforms.layerOffset, t * s), r.uniform1f(i.uniforms.entryPass, 0), r.blendEquation(r.FUNC_ADD), r.colorMask(!0, !1, !1, !1), b(r, i, e), r.uniform1f(i.uniforms.entryPass, 1), r.blendEquation(r.MIN), r.colorMask(!1, !0, !1, !1), b(r, i, e);
	}), r.colorMask(!0, !0, !0, !0), r.frontFace(r.CCW), r.blendEquation(r.FUNC_ADD), c || r.disable(r.BLEND), r.bindVertexArray(null), r.bindFramebuffer(r.FRAMEBUFFER, t.outputFramebuffer ?? null), r.viewport(0, 0, o, s), i.target.texture;
}
function S(e, t) {
	let n = e.context;
	_(e, t), t.geometries.forEach((e) => v(n, e)), n.deleteProgram(t.program), e.meshVolumePass = null;
}
var C = {
	detailOctaves: 1,
	detailAmount: .5,
	warp: 0,
	contrast: 1,
	profileSoftness: .5,
	keyScattering: 1,
	scatterOctaves: 1,
	multiScatter: .5,
	multiExtinction: .5,
	multiAnisotropy: .5,
	keyTransmittance: 0,
	surfaceTransmittance: 0
}, w = {
	detailOctaves: [
		1,
		3,
		"Volume detail octaves"
	],
	detailAmount: [
		0,
		1,
		"Volume detail amount"
	],
	warp: [
		0,
		4,
		"Volume warp"
	],
	contrast: [
		0,
		4,
		"Volume contrast"
	],
	profileSoftness: [
		0,
		.95,
		"Volume profile softness"
	],
	keyScattering: [
		0,
		10,
		"Volume key scattering"
	],
	scatterOctaves: [
		1,
		4,
		"Volume scatter octaves"
	],
	multiScatter: [
		0,
		1,
		"Volume multi scatter"
	],
	multiExtinction: [
		0,
		1,
		"Volume multi extinction"
	],
	multiAnisotropy: [
		0,
		1,
		"Volume multi anisotropy"
	],
	keyTransmittance: [
		0,
		1,
		"Volume key transmittance"
	],
	surfaceTransmittance: [
		0,
		1,
		"Volume surface transmittance"
	]
};
function T(e) {
	let t = { ...C };
	for (let [n, [r, i, a]] of Object.entries(w)) e[n] !== void 0 && (t[n] = s(e[n], r, i, a));
	if (!Number.isInteger(t.detailOctaves)) throw RangeError("Volume detail octaves must be an integer");
	if (!Number.isInteger(t.scatterOctaves)) throw RangeError("Volume scatter octaves must be an integer");
	return t;
}
function E(e) {
	let t = T(e);
	return t.detailOctaves > 1 || t.warp > 0 || t.contrast !== 1;
}
var D = .1;
function O() {
	return {
		count: 0,
		positions: /* @__PURE__ */ new Float32Array(32),
		colors: /* @__PURE__ */ new Float32Array(32),
		directions: /* @__PURE__ */ new Float32Array(32),
		cones: /* @__PURE__ */ new Float32Array(32)
	};
}
function k(e, t, n, r) {
	let i = t * 4, a = r * 4;
	e.positions.set(n.positions.subarray(a, a + 4), i);
	let o = n.colors[a + 3];
	for (let t = 0; t < 3; t++) e.colors[i + t] = n.colors[a + t] * o;
	e.colors[i + 3] = Math.max(n.radii[r], D), e.directions.fill(0, i, i + 4), e.cones.fill(0, i, i + 4);
}
function A(e, t, n, r) {
	let i = t * 4, a = r * 4;
	e.positions.set(n.spotPositions.subarray(a, a + 4), i);
	let o = n.spotColors[a + 3];
	for (let t = 0; t < 3; t++) e.colors[i + t] = n.spotColors[a + t] * o;
	e.colors[i + 3] = Math.max(n.spotParameters[a], D), e.directions.set(n.spotDirections.subarray(a, a + 4), i), e.cones[i] = n.spotParameters[a + 1], e.cones[i + 1] = 1, e.cones[i + 2] = 0, e.cones[i + 3] = 0;
}
function j(e, t) {
	let n = 0;
	for (let r = 0; r < Math.min(e.pointCount, 16) && n < 8; r++) e.colors[r * 4 + 3] !== 0 && k(t, n++, e, r);
	for (let r = 0; r < Math.min(e.spotCount, 8) && n < 8; r++) e.spotColors[r * 4 + 3] !== 0 && A(t, n++, e, r);
	return t.count = n, n;
}
var M = class {
	constructor(e) {
		this.context = e, this.texture = null, this.width = 0, this.height = 0;
	}
	upload(e) {
		let t = this.context;
		this.texture ? t.bindTexture(t.TEXTURE_2D, this.texture) : (this.texture = t.createTexture(), t.bindTexture(t.TEXTURE_2D, this.texture), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE)), e.width === this.width && e.height === this.height ? t.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, e.width, e.height, t.RGBA, t.FLOAT, e.data) : (t.texImage2D(t.TEXTURE_2D, 0, t.RGBA16F, e.width, e.height, 0, t.RGBA, t.FLOAT, e.data), this.width = e.width, this.height = e.height);
	}
	dispose() {
		this.texture && this.context.deleteTexture(this.texture), this.texture = null, this.width = 0, this.height = 0;
	}
}, N = /* @__PURE__ */ new WeakMap();
function P(e, t, n) {
	if (e.shadowAmbient !== void 0) return e.shadowAmbient;
	let r = `${e.minimum}|${e.maximum}`, i = N.get(t);
	if (i?.key === r) return i.value;
	let a = e.minimum.map((t, n) => (t + e.maximum[n]) / 2), o = .15 + .85 * (n?.(t, a) ?? 0);
	return N.set(t, {
		key: r,
		value: o
	}), o;
}
// src/fog-shader.js
function F(e, t, n, r, i) {
	let a = e.context;
	a.activeTexture(a.TEXTURE3), a.bindTexture(a.TEXTURE_2D, e.shadowTexture), a.uniform1i(t.uniforms.volumeShadowMap, 3), a.uniformMatrix4fv(t.uniforms.volumeLightProjection, !1, e.lightProjection), a.uniform3fv(t.uniforms.volumeLightDirection, r.lightDirection), a.uniform3fv(t.uniforms.volumeLightColor, e.lighting.keyColor), a.uniform1f(t.uniforms.volumeDensity, n.density), a.uniform3fv(t.uniforms.volumeMinimum, n.minimum), a.uniform3fv(t.uniforms.volumeMaximum, n.maximum), a.uniform3fv(t.uniforms.volumeColor, n.color), a.uniform3fv(t.uniforms.volumeAmbient, n.ambient), a.uniform3fv(t.uniforms.volumeDrift, n.drift), a.uniform1i(t.uniforms.volumeSteps, n.steps), a.uniform1f(t.uniforms.volumeAnisotropy, n.anisotropy), a.uniform1f(t.uniforms.volumeShadowAmbient, P(n, e.sceneParts, e.skyOpenness)), a.uniform1f(t.uniforms.volumeNoiseAmount, n.noiseAmount), a.uniform1f(t.uniforms.volumeNoiseScale, n.noiseScale), a.uniform1f(t.uniforms.volumeMaxDistance, n.maxDistance), a.uniform1f(t.uniforms.volumeHeightFalloff, n.heightFalloff), L(e, t, n), I(a, t, n), a.uniform1f(t.uniforms.orthographic, +(i.projection === "orthographic")), a.uniform1i(t.uniforms.fogSkyVisibility, 5), a.uniform1f(t.uniforms.volumeGridFog, +!!e.sceneParts.some((e) => e.material?.irradianceGrid));
}
function I(e, t, n) {
	let r = T(n), i = (n) => t.uniforms[n] ??= e.getUniformLocation(t.program, n);
	e.uniform1i(i("volumeDetailOctaves"), r.detailOctaves), e.uniform1f(i("volumeDetailAmount"), r.detailAmount), e.uniform1f(i("volumeWarp"), r.warp), e.uniform1f(i("volumeContrast"), r.contrast), e.uniform1f(i("volumeProfileStart"), r.profileSoftness), e.uniform1f(i("volumeKeyScattering"), r.keyScattering), e.uniform1i(i("volumeScatterOctaves"), r.scatterOctaves), e.uniform1f(i("volumeMultiScatter"), r.multiScatter), e.uniform1f(i("volumeMultiExtinction"), r.multiExtinction), e.uniform1f(i("volumeMultiAnisotropy"), r.multiAnisotropy), e.uniform1f(i("volumeKeyTransmittance"), r.keyTransmittance), e.uniform1f(i("volumeSurfaceTransmittance"), r.surfaceTransmittance);
}
function L(e, t, n) {
	let r = e.context;
	n.field && (e.fogFieldTexture ??= new M(r), r.activeTexture(r.TEXTURE6), e.fogFieldTexture.upload(n.field), r.uniform1i(t.uniforms.volumeField, 6), r.uniform1f(t.uniforms.volumeProfile, +(n.profile === "smoothstep")), r.uniform1f(t.uniforms.volumeFlowStrength, n.flowStrength ?? 1), r.uniform1f(t.uniforms.volumeFlowPeriod, n.flowPeriod ?? 2));
	let i = e.fogLightBuffers;
	r.uniform1i(t.uniforms.volumeLightCount, i.count), i.count !== 0 && (r.uniform4fv(t.uniforms["volumeLightPositions[0]"], i.positions), r.uniform4fv(t.uniforms["volumeLightColors[0]"], i.colors), r.uniform4fv(t.uniforms["volumeLightDirections[0]"], i.directions), r.uniform4fv(t.uniforms["volumeLightCones[0]"], i.cones));
}
function R(e, a, o) {
	let s = t(a, "environment.localVolumes");
	if (s.length === 0) return 0;
	if (!e.depth || !e.hdr || e.transparent || e.benchmark) throw Error("Local volumes require depth:true, active HDR and an opaque canvas");
	let c = e.localVolumeBuffers ??= r();
	return n(i(s, e.sceneParts), c), x(e, o), c.count;
}
function z(e, t, n) {
	let r = e.context, i = e.localVolumeBuffers, a = (e) => t.uniforms[e] ??= r.getUniformLocation(t.program, e);
	r.uniform1i(a("localVolumeCount"), i.count), r.uniform1f(a("localOrthographic"), +(n.projection === "orthographic")), r.uniform4fv(a("localVolumeCenters[0]"), i.centers), r.uniform4fv(a("localVolumeExtents[0]"), i.extents), r.uniform4fv(a("localVolumeAbsorption[0]"), i.absorption), r.uniform4fv(a("localVolumeEmission[0]"), i.emission), r.uniform4fv(a("localVolumeSteps[0]"), i.steps), r.uniform4fv(a("localVolumeAxes[0]"), i.axes), r.activeTexture(r.TEXTURE7), r.bindTexture(r.TEXTURE_2D, i.meshParts.length > 0 ? e.meshVolumePass.target.texture : e.whiteTexture), r.uniform1i(a("localMeshVolumes"), 7);
}
var B = "\nuniform int localVolumeCount;\nuniform float localOrthographic;\nuniform vec4 localVolumeCenters[8];\nuniform vec4 localVolumeExtents[8];\nuniform vec4 localVolumeAbsorption[8];\nuniform vec4 localVolumeEmission[8];\nuniform vec4 localVolumeSteps[8];\nuniform vec4 localVolumeAxes[24];\nuniform highp sampler2D localMeshVolumes;\n", V = "\nfloat localVolumeCellHash(vec3 cell) {\n  vec3 scrambled = fract(cell * 0.1031);\n  scrambled += dot(scrambled, scrambled.zyx + 31.32);\n  return fract((scrambled.x + scrambled.y) * scrambled.z);\n}\nfloat localVolumeNoise(vec3 position) {\n  vec3 cell = floor(position);\n  vec3 fraction = fract(position);\n  fraction = fraction * fraction * (3.0 - 2.0 * fraction);\n  float lower = mix(mix(localVolumeCellHash(cell), localVolumeCellHash(cell + vec3(1,0,0)), fraction.x), mix(localVolumeCellHash(cell + vec3(0,1,0)), localVolumeCellHash(cell + vec3(1,1,0)), fraction.x), fraction.y);\n  float upper = mix(mix(localVolumeCellHash(cell + vec3(0,0,1)), localVolumeCellHash(cell + vec3(1,0,1)), fraction.x), mix(localVolumeCellHash(cell + vec3(0,1,1)), localVolumeCellHash(cell + vec3(1,1,1)), fraction.x), fraction.y);\n  return mix(lower, upper, fraction.z);\n}\nvec3 localVolumeLocal(int index, vec3 vector) {\n  return vec3(dot(localVolumeAxes[index * 3].xyz, vector), dot(localVolumeAxes[index * 3 + 1].xyz, vector), dot(localVolumeAxes[index * 3 + 2].xyz, vector));\n}\nvec2 localVolumeInterval(int index, vec3 origin, vec3 direction) {\n  vec3 center = localVolumeCenters[index].xyz;\n  vec3 halfSize = localVolumeExtents[index].xyz;\n  if (localVolumeCenters[index].w > 0.5) {\n    vec3 offset = origin - center;\n    float along = dot(offset, direction);\n    float discriminant = along * along - (dot(offset, offset) - halfSize.x * halfSize.x);\n    if (discriminant <= 0.0) return vec2(0.0);\n    float root = sqrt(discriminant);\n    return vec2(-along - root, -along + root);\n  }\n  vec3 localOrigin = localVolumeLocal(index, origin - center);\n  vec3 localDirection = localVolumeLocal(index, direction);\n  float entry = -1e30;\n  float exitDistance = 1e30;\n  for (int axis = 0; axis < 3; axis++) {\n    float relative = -localOrigin[axis];\n    if (localDirection[axis] == 0.0) {\n      if (abs(relative) > halfSize[axis]) return vec2(0.0);\n    } else {\n      float first = (relative - halfSize[axis]) / localDirection[axis];\n      float second = (relative + halfSize[axis]) / localDirection[axis];\n      entry = max(entry, min(first, second));\n      exitDistance = min(exitDistance, max(first, second));\n    }\n  }\n  return vec2(entry, exitDistance);\n}\nfloat localVolumeProfile(int index, vec3 position) {\n  vec3 offset = position - localVolumeCenters[index].xyz;\n  if (localVolumeCenters[index].w < 0.5) offset = localVolumeLocal(index, offset);\n  vec3 halfSize = localVolumeExtents[index].xyz;\n  float distanceRatio = localVolumeCenters[index].w > 0.5 ? length(offset) / halfSize.x : max(max(abs(offset.x) / halfSize.x, abs(offset.y) / halfSize.y), abs(offset.z) / halfSize.z);\n  float falloff = localVolumeExtents[index].w;\n  float profile = falloff > 0.0 ? 1.0 - smoothstep(1.0 - falloff, 1.0, distanceRatio) : 1.0 - step(1.0, distanceRatio);\n  float noiseAmount = localVolumeAbsorption[index].w;\n  if (noiseAmount > 0.0) profile *= mix(1.0, localVolumeNoise(position * localVolumeEmission[index].w) * 2.0, noiseAmount);\n  return profile;\n}\nvec3 localVolumes(vec3 background) {\n  vec2 clipXY = textureCoordinate * 2.0 - 1.0;\n  vec4 farPoint = inverseViewProjection * vec4(clipXY, 1.0, 1.0);\n  vec4 nearPoint = inverseViewProjection * vec4(clipXY, -1.0, 1.0);\n  vec3 origin = localOrthographic > 0.5 ? nearPoint.xyz / nearPoint.w : eye;\n  vec3 direction = normalize(farPoint.xyz - origin * farPoint.w);\n  float depth = texture(sceneDepth, textureCoordinate).r;\n  vec4 surfacePoint = inverseViewProjection * vec4(clipXY, depth * 2.0 - 1.0, 1.0);\n  float surfaceDistance = 1e30;\n  if (surfacePoint.w > 0.0) surfaceDistance = max(0.0, dot(surfacePoint.xyz - origin * surfacePoint.w, direction) / surfacePoint.w);\n  float entries[8];\n  float exits[8];\n  for (int index = 0; index < 8; index++) {\n    entries[index] = 1e30;\n    exits[index] = 0.0;\n    if (index >= localVolumeCount) continue;\n    if (localVolumeCenters[index].w > 1.5) {\n      vec2 inside = texelFetch(localMeshVolumes, ivec2(gl_FragCoord.xy) + ivec2(0, int(localVolumeSteps[index].y) * int(resolution.y)), 0).rg;\n      float insideLength = inside.x < -1e-5 * surfaceDistance ? inside.x + surfaceDistance : inside.x;\n      if (insideLength > 0.0) {\n        entries[index] = inside.y < 1e29 ? inside.y : 0.0;\n        exits[index] = entries[index] + insideLength;\n      }\n      continue;\n    }\n    vec2 span = localVolumeInterval(index, origin, direction);\n    float entry = max(span.x, 0.0);\n    float exitDistance = min(span.y, surfaceDistance);\n    if (exitDistance > entry) {\n      entries[index] = entry;\n      exits[index] = exitDistance;\n    }\n  }\n  vec3 transmittance = vec3(1.0);\n  vec3 radiance = vec3(0.0);\n  for (int pass = 0; pass < 8; pass++) {\n    int nearest = -1;\n    float nearestEntry = 1e29;\n    for (int index = 0; index < 8; index++) {\n      if (entries[index] < nearestEntry) {\n        nearestEntry = entries[index];\n        nearest = index;\n      }\n    }\n    if (nearest < 0) break;\n    float entry = entries[nearest];\n    float exitDistance = exits[nearest];\n    entries[nearest] = 1e30;\n    if (localVolumeCenters[nearest].w > 1.5) {\n      float insideLength = exitDistance - entry;\n      vec3 absorption = localVolumeAbsorption[nearest].rgb;\n      vec3 factor = exp(-absorption * insideLength);\n      vec3 gain = mix(vec3(insideLength), (1.0 - factor) / max(absorption, vec3(1e-6)), step(vec3(1e-6), absorption));\n      radiance += transmittance * localVolumeEmission[nearest].rgb * gain;\n      transmittance *= factor;\n      continue;\n    }\n    int steps = int(localVolumeSteps[nearest].x);\n    float stepSize = (exitDistance - entry) / float(steps);\n    float jitter = hash(vec3(gl_FragCoord.xy, float(nearest) + 1.0));\n    for (int step = 0; step < 32; step++) {\n      if (step >= steps) break;\n      vec3 position = origin + direction * (entry + (float(step) + jitter) * stepSize);\n      float profile = localVolumeProfile(nearest, position);\n      radiance += transmittance * localVolumeEmission[nearest].rgb * (profile * stepSize);\n      transmittance *= exp(-localVolumeAbsorption[nearest].rgb * (profile * stepSize));\n    }\n  }\n  return background * transmittance + radiance;\n}\n";
function H(e) {
	e.fogLightBuffers ??= O(), j(e.lighting, e.fogLightBuffers);
}
e("volumeFog", {
	support: {
		packLights: H,
		bindUniforms: F,
		usesDetail: E,
		prepareLocalVolumes: R,
		bindLocalVolumes: z
	},
	localDeclarations: B,
	localFunctions: V,
	postDeclarations: "\nuniform highp sampler2DShadow volumeShadowMap;\nuniform mat4 volumeLightProjection;\nuniform vec3 volumeLightDirection;\nuniform vec3 volumeLightColor;\nuniform float volumeDensity;\nuniform vec3 volumeMinimum;\nuniform vec3 volumeMaximum;\nuniform vec3 volumeColor;\nuniform vec3 volumeAmbient;\nuniform vec3 volumeDrift;\nuniform int volumeSteps;\nuniform float volumeAnisotropy;\nuniform float volumeShadowAmbient;\nuniform float volumeGridFog;\nuniform float volumeNoiseAmount;\nuniform float volumeNoiseScale;\nuniform float volumeMaxDistance;\nuniform float volumeHeightFalloff;\nuniform sampler2D volumeField;\nuniform float volumeProfile;\nuniform float volumeFlowStrength;\nuniform float volumeFlowPeriod;\nuniform int volumeDetailOctaves;\nuniform float volumeDetailAmount;\nuniform float volumeWarp;\nuniform float volumeContrast;\nuniform float volumeProfileStart;\nuniform float volumeKeyScattering;\nuniform int volumeScatterOctaves;\nuniform float volumeMultiScatter;\nuniform float volumeMultiExtinction;\nuniform float volumeMultiAnisotropy;\nuniform float volumeKeyTransmittance;\nuniform float volumeSurfaceTransmittance;\nuniform int volumeLightCount;\nuniform vec4 volumeLightPositions[8];\nuniform vec4 volumeLightColors[8];\nuniform vec4 volumeLightDirections[8];\nuniform vec4 volumeLightCones[8];\nuniform float orthographic;\nuniform highp sampler3D fogSkyVisibility;\n",
	postFunctions: "\nfloat henyeyGreenstein(float cosine, float anisotropy) {\n  return (1.0 - anisotropy * anisotropy) / (12.5663706 * pow(1.0 + anisotropy * anisotropy - 2.0 * anisotropy * cosine, 1.5));\n}\nfloat fogLightAttenuation(float distanceSquared, float range, float radius) {\n  float cutoff = 1.0;\n  if (range > 0.0) {\n    float squaredRatio = distanceSquared / (range * range);\n    float fade = max(1.0 - squaredRatio * squaredRatio, 0.0);\n    cutoff = fade * fade;\n  }\n  return cutoff / max(distanceSquared, radius * radius);\n}\nvec3 fogLightScattering(vec3 position, vec3 direction) {\n  vec3 total = vec3(0);\n  for (int index = 0; index < 8; index++) {\n    if (index >= volumeLightCount) break;\n    vec3 offset = volumeLightPositions[index].xyz - position;\n    float distanceSquared = dot(offset, offset);\n    if (distanceSquared < 1e-12) continue;\n    vec3 toLight = offset * inversesqrt(distanceSquared);\n    float attenuation = fogLightAttenuation(distanceSquared, volumeLightPositions[index].w, volumeLightColors[index].w);\n    if (volumeLightCones[index].y > 0.5) attenuation *= smoothstep(volumeLightDirections[index].w, volumeLightCones[index].x, dot(-toLight, volumeLightDirections[index].xyz));\n    if (attenuation <= 0.0) continue;\n    float denominator = 1.0 + volumeAnisotropy * volumeAnisotropy - 2.0 * volumeAnisotropy * dot(direction, toLight);\n    total += volumeLightColors[index].rgb * (attenuation * (1.0 - volumeAnisotropy * volumeAnisotropy) / (12.5663706 * denominator * sqrt(denominator)));\n  }\n  return total;\n}\nfloat flowedNoise(vec3 samplePosition, vec2 velocity, float noiseScale) {\n  float firstPhase = fract(time / volumeFlowPeriod);\n  float secondPhase = fract(time / volumeFlowPeriod + 0.5);\n  vec3 travel = vec3(velocity.x, 0.0, velocity.y) * volumeFlowStrength * volumeFlowPeriod;\n  float first = cloudNoise((samplePosition - travel * firstPhase) * noiseScale);\n  float second = cloudNoise((samplePosition - travel * secondPhase) * noiseScale);\n  return mix(first, second, abs(2.0 * firstPhase - 1.0));\n}\nfloat noiseAt(vec3 samplePosition, vec2 velocity, float noiseScale) {\n  return POST_FIELD ? flowedNoise(samplePosition, velocity, noiseScale) : cloudNoise(samplePosition * noiseScale);\n}\nfloat densityNoise(vec3 samplePosition, vec2 velocity) {\n  vec3 warped = samplePosition;\n  if (POST_DETAIL && volumeWarp > 0.0) {\n    vec3 seed = samplePosition * volumeNoiseScale * 0.5;\n    vec3 offset = vec3(cloudNoise(seed + 17.0), cloudNoise(seed + 43.0), cloudNoise(seed + 71.0)) - 0.5;\n    warped += offset * (2.0 * volumeWarp / volumeNoiseScale);\n  }\n  float lookup = noiseAt(warped, velocity, volumeNoiseScale);\n  if (POST_DETAIL) {\n    float total = 1.0;\n    float sum = lookup;\n    if (volumeDetailOctaves > 1) {\n      float weight = 0.5 * volumeDetailAmount;\n      sum += weight * noiseAt(warped, velocity, volumeNoiseScale * 2.0);\n      total += weight;\n    }\n    if (volumeDetailOctaves > 2) {\n      float weight = 0.25 * volumeDetailAmount;\n      sum += weight * noiseAt(warped, velocity, volumeNoiseScale * 4.0);\n      total += weight;\n    }\n    lookup = clamp(0.5 + (sum / total - 0.5) * volumeContrast, 0.0, 1.0);\n  }\n  return lookup;\n}\nfloat layerProfile(float relativeHeight) {\n  return volumeProfile > 0.5 ? 1.0 - smoothstep(volumeProfileStart, 1.0, relativeHeight) : exp(-relativeHeight);\n}\nfloat fogDensityFactor(vec3 position) {\n  float noise = 1.0;\n  vec4 field = POST_FIELD ? texture(volumeField, (position.xz - volumeMinimum.xz) / (volumeMaximum.xz - volumeMinimum.xz)) : vec4(1);\n  if (volumeNoiseAmount > 0.0) {\n    float lookup = densityNoise(position - volumeDrift * time, field.zw);\n    noise = mix(1.0, lookup * 2.0, volumeNoiseAmount);\n  }\n  if (POST_FIELD) noise *= field.r * layerProfile((position.y - volumeMinimum.y) / max(field.g, 0.0001));\n  else if (volumeHeightFalloff > 0.0) noise *= exp((volumeMinimum.y - position.y) / volumeHeightFalloff);\n  return noise;\n}\nfloat keyVisibility(vec3 position) {\n  vec4 lightPosition = volumeLightProjection * vec4(position, 1);\n  vec3 shadow = lightPosition.xyz / lightPosition.w * 0.5 + 0.5;\n  if (all(greaterThanEqual(shadow, vec3(0))) && all(lessThanEqual(shadow, vec3(1)))) {\n    return texture(volumeShadowMap, vec3(shadow.xy, shadow.z - 0.0008));\n  }\n  return 1.0;\n}\nfloat sunOpticalDepth(vec3 position, vec3 towardSun) {\n  float exitDistance = volumeMaxDistance;\n  for (int axis = 0; axis < 3; axis++) {\n    if (towardSun[axis] == 0.0) continue;\n    float first = (volumeMinimum[axis] - position[axis]) / towardSun[axis];\n    float second = (volumeMaximum[axis] - position[axis]) / towardSun[axis];\n    exitDistance = min(exitDistance, max(first, second));\n  }\n  exitDistance = max(exitDistance, 0.0);\n  float sum = 0.0;\n  for (int tap = 0; tap < 3; tap++) sum += fogDensityFactor(position + towardSun * (exitDistance * (float(tap) + 0.5) / 3.0));\n  return volumeDensity * sum * exitDistance / 3.0;\n}\nfloat keyInScatter(float cosine, float opticalDepth) {\n  float total = 0.0;\n  float weight = 1.0;\n  float extinction = 1.0;\n  float anisotropy = volumeAnisotropy;\n  for (int octave = 0; octave < 4; octave++) {\n    if (octave >= volumeScatterOctaves) break;\n    total += weight * henyeyGreenstein(cosine, anisotropy) * exp(-opticalDepth * volumeKeyTransmittance * extinction);\n    weight *= volumeMultiScatter;\n    extinction *= volumeMultiExtinction;\n    anisotropy *= volumeMultiAnisotropy;\n  }\n  return total;\n}\nvec3 volumeFog(vec3 background) {\n  vec2 clipXY = textureCoordinate * 2.0 - 1.0;\n  vec4 farPoint = inverseViewProjection * vec4(clipXY, 1.0, 1.0);\n  vec4 nearPoint = inverseViewProjection * vec4(clipXY, -1.0, 1.0);\n  vec3 origin = orthographic > 0.5 ? nearPoint.xyz / nearPoint.w : eye;\n  vec3 direction = normalize(farPoint.xyz - origin * farPoint.w);\n  float depth = texture(sceneDepth, textureCoordinate).r;\n  vec4 surfacePoint = inverseViewProjection * vec4(clipXY, depth * 2.0 - 1.0, 1.0);\n  float surfaceDistance = volumeMaxDistance;\n  if (surfacePoint.w > 0.0) surfaceDistance = max(0.0, dot(surfacePoint.xyz - origin * surfacePoint.w, direction) / surfacePoint.w);\n  float exitDistance = min(volumeMaxDistance, surfaceDistance);\n  float boxExit = volumeMaxDistance;\n  float entry = 0.0;\n  for (int axis = 0; axis < 3; axis++) {\n    if (direction[axis] == 0.0) {\n      if (origin[axis] < volumeMinimum[axis] || origin[axis] > volumeMaximum[axis]) return background;\n    } else {\n      float first = (volumeMinimum[axis] - origin[axis]) / direction[axis];\n      float second = (volumeMaximum[axis] - origin[axis]) / direction[axis];\n      entry = max(entry, min(first, second));\n      exitDistance = min(exitDistance, max(first, second));\n      boxExit = min(boxExit, max(first, second));\n    }\n  }\n  if (entry >= exitDistance) return background;\n  float stepSize = (exitDistance - entry) / float(volumeSteps);\n  vec3 lightDirection = normalize(volumeLightDirection);\n  float cosine = dot(direction, lightDirection);\n  float anisotropy = volumeAnisotropy;\n  vec3 towardSun = lightDirection;\n  bool sunTransmittance = volumeKeyTransmittance > 0.0 || volumeScatterOctaves > 1;\n  float jitter = hash(vec3(gl_FragCoord.xy, 0));\n  float transmittance = 1.0;\n  vec3 accumulated = vec3(0);\n  for (int index = 0; index < 48; index++) {\n    if (index >= volumeSteps) break;\n    vec3 position = origin + direction * (entry + (float(index) + jitter) * stepSize);\n    float noise = fogDensityFactor(position);\n    float opacity = 1.0 - exp(-volumeDensity * noise * stepSize);\n    float visibility = keyVisibility(position);\n    vec4 skyCell = POST_SKY ? texture(fogSkyVisibility, (position - volumeMinimum) / (volumeMaximum - volumeMinimum)) : vec4(0);\n    float shadowShare = POST_SKY ? 0.1 + 0.9 * min(1.0, 30.0 * skyCell.r) : volumeShadowAmbient;\n    float ambientShare = mix(shadowShare, 1.0, visibility);\n    if (volumeGridFog > 0.5) ambientShare = min(1.0, 30.0 * skyCell.r);\n    float opticalDepth = 0.0;\n    if (sunTransmittance && visibility > 0.001) opticalDepth = sunOpticalDepth(position, towardSun);\n    float phase = keyInScatter(cosine, opticalDepth);\n    vec3 scattering = volumeColor * (volumeAmbient * ambientShare + 0.6 * skyCell.gba + volumeLightColor * (phase * visibility * volumeKeyScattering));\n    if (POST_LIGHTS) scattering += volumeColor * fogLightScattering(position, direction);\n    accumulated += transmittance * opacity * scattering;\n    transmittance *= 1.0 - opacity;\n    if (transmittance < 0.001) break;\n  }\n  for (int tap = 0; tap < 24; tap++) {\n    float index = float(tap) + 0.5;\n    float radius = 0.03 + 0.0002 * index * index;\n    vec2 offset = vec2(cos(index * 2.4) * resolution.y / resolution.x, sin(index * 2.4)) * radius;\n    accumulated += textureLod(frameTexture, textureCoordinate + offset, log2(0.7 * radius * resolution.y)).rgb * volumeColor * (0.009 * (1.0 - transmittance) / (1.0 + 0.04 * index));\n  }\n  float surfaceSun = 1.0;\n  if (volumeSurfaceTransmittance > 0.0 && surfacePoint.w > 0.0 && surfaceDistance <= boxExit) {\n    vec3 surfacePosition = origin + direction * surfaceDistance + towardSun * 0.05;\n    float surfaceVisibility = keyVisibility(surfacePosition);\n    if (surfaceVisibility > 0.001) surfaceSun = mix(1.0, exp(-sunOpticalDepth(surfacePosition, towardSun) * volumeSurfaceTransmittance), surfaceVisibility);\n  }\n  return accumulated + background * transmittance * surfaceSun;\n}\n"
});
