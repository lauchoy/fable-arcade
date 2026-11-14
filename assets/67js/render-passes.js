/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { h as e, m as t, n, p as r } from "./mat4-BCZClxna.js";
import { n as i } from "./camera-DqWdI22s.js";
import { i as a, n as o } from "./gl-program-DIc2K8ep.js";
import { l as s } from "./shader-registry-DHYkwAg5.js";
// src/lighting-pass-shader.js
s("lightingPass", {
	declarations: "#define USES_LIGHTING_PASS (renderPassMode > 5.5)\nvec3 glossyLight = vec3(0.0);\nvec3 environmentLight = vec3(0.0);\nuniform float passFloatOutput;\nuniform mat4 passCurrentViewProjection;\nuniform mat4 passPreviousViewProjection;\nuniform mat4 passObjectDeltas[8];\nuniform float passVolumeDensity;\nuniform vec3 passVolumeColor;\nuniform float passMaterialIds[32];\nuniform float passTransmission;\nuniform vec3 passMaterialAov;\nuniform float hasPassAuxMap;\nfloat cryptoHash(float id) {\n  uint h = uint(id + 0.5) * 0x9e3779b9u;\n  h ^= h >> 16u;\n  h *= 0x85ebca6bu;\n  h ^= h >> 13u;\n  return float((h % 255u) + 1u) / 255.0;\n}\n",
	illuminateSpecular: "  if (USES_LIGHTING_PASS) glossyLight += specular * radiance * normalLight;\n",
	probeReflection: "  if (USES_LIGHTING_PASS && ENVIRONMENT_ENABLED) {\n    glossyLight += environmentLighting(normal, specularNormal, baseReflectance, viewDirection, reflected, vec3(0.0), metallic, roughness, occlusion, ambientIntensity, skyReflection);\n    environmentLight = environmentLighting(normal, specularNormal, baseReflectance, viewDirection, reflected, color, metallic, roughness, occlusion, ambientIntensity, skyReflection);\n  }\n",
	probeSurroundings: "    if (USES_LIGHTING_PASS) {\n      vec3 envSpecular = surroundings * reflectance * skyReflection * (1.0 - roughness * 0.55) * mix(1.0, 0.5 * daylight, worldMode) * occlusion * ambientIntensity;\n      glossyLight += envSpecular;\n      environmentLight = envSpecular + color * (1.0 - metallic) * mix(vec3(0.16, 0.20, 0.22), vec3(0.19, 0.25, 0.30) * max(daylight, 0.08), worldMode) * (0.45 + 0.55 * max(normal.y, 0.0)) * occlusion * ambientIntensity;\n    }\n",
	worldFinal: "  if (USES_LIGHTING_PASS) {\n    float mist = 1.0 - exp(-length(worldPosition - eye) * fogDensity);\n    int instanceIndex = int(instanceEmission.w + 0.5);\n    vec4 currentClip = passCurrentViewProjection * vec4(worldPosition, 1.0);\n    vec2 currentScreen = currentClip.xy / max(currentClip.w, 1e-6) * 0.5 + 0.5;\n    vec4 prevClip = passPreviousViewProjection * (passObjectDeltas[min(instanceIndex, 7)] * vec4(worldPosition, 1.0));\n    vec2 prevScreen = prevClip.w > 0.0 ? prevClip.xy / prevClip.w * 0.5 + 0.5 : currentScreen;\n    vec2 vel = currentScreen - prevScreen;\n    vec2 uvCoord = max(textureUV, vec2(0.0));\n    vec4 auxSample = hasPassAuxMap > 0.5 ? (BOX_MAPPED ? sampleBox(emissiveMap) : texture(emissiveMap, textureUV)) : vec4(1.0);\n    vec3 passValue = renderPassMode < 6.5 ? (radiance - glossyLight - emission) * exposure\n      : renderPassMode < 7.5 ? glossyLight * exposure\n      : renderPassMode < 8.5 ? vec3(visibility)\n      : renderPassMode < 9.5 ? vec3(occlusion)\n      : renderPassMode < 10.5 ? vec3(mist)\n      : renderPassMode < 11.5 ? (passFloatOutput > 0.5 ? worldPosition : clamp(worldPosition / renderPassDepthRange * 0.5 + 0.5, 0.0, 1.0))\n      : renderPassMode < 12.5 ? (passFloatOutput > 0.5 ? vec3(vel, 0.0) : vec3(clamp(vel * 0.5 + 0.5, 0.0, 1.0), 0.0))\n      : renderPassMode < 13.5 ? (passFloatOutput > 0.5 ? vec3(uvCoord, 0.0) : vec3(clamp(fract(uvCoord), 0.0, 1.0), 0.0))\n      : renderPassMode < 14.5 ? (1.0 - reflectance) * passTransmission * auxSample.r * ((radiance - glossyLight - emission) + color * ambientIntensity * 0.5) * exposure\n      : renderPassMode < 15.5 ? passVolumeColor * (1.0 - exp(-length(worldPosition - eye) * passVolumeDensity)) * exposure\n      : renderPassMode < 16.5 ? environmentLight * exposure\n      : renderPassMode < 17.5 ? vec3(cryptoHash(renderPassObjectBase + instanceEmission.w + 1.0), cryptoHash(passMaterialIds[min(instanceIndex, 31)]), 1.0)\n      : passMaterialAov * auxSample.rgb;\n    outputColor = vec4(passValue, 1.0);\n    return;\n  }\n"
});
// src/render-passes.js
var c = Object.freeze({
	albedo: 1,
	normal: 2,
	emission: 3,
	depth: 4,
	objectId: 5,
	diffuse: 6,
	glossy: 7,
	shadow: 8,
	ao: 9,
	mist: 10,
	position: 11,
	velocity: 12,
	uv: 13,
	transmission: 14,
	volume: 15,
	environment: 16,
	cryptomatte: 17,
	aov: 18
}), l = Object.freeze({ wireframe: "diffuse" }), u = Object.freeze({
	depth: [
		1,
		1,
		0,
		1
	],
	shadow: [
		1,
		1,
		1,
		1
	],
	ao: [
		1,
		1,
		1,
		1
	],
	mist: [
		1,
		1,
		1,
		1
	],
	wireframe: [
		.82,
		.84,
		.86,
		1
	]
}), d = 5, f = Object.freeze([
	0,
	0,
	0,
	1
]), p = n();
function m(e) {
	let t = Math.imul(e >>> 0, 2654435769) >>> 0;
	return t = (t ^ t >>> 16) >>> 0, t = Math.imul(t, 2246822507) >>> 0, t = (t ^ t >>> 13) >>> 0, (t % 255 + 1) / 255;
}
function h(e) {
	let t = 2166136261;
	for (let n = 0; n < e.length; n++) t = Math.imul(t ^ e.charCodeAt(n), 16777619) >>> 0;
	return t.toString(16).padStart(8, "0");
}
var g = "#version 300 es\nprecision highp float;\nuniform sampler2D sourceTexture;\nout vec4 outputColor;\nvoid main() { outputColor = vec4(texelFetch(sourceTexture, ivec2(gl_FragCoord.xy), 0).rgb, 1.0); }";
function _(e, t, n, r = !1) {
	if (r && !e.getExtension("EXT_color_buffer_float")) throw Error("16-bit PNG and EXR output need EXT_color_buffer_float. Use format png.");
	let i = e.createTexture();
	e.bindTexture(e.TEXTURE_2D, i), r ? e.texImage2D(e.TEXTURE_2D, 0, e.RGBA16F, t, n, 0, e.RGBA, e.HALF_FLOAT, null) : e.texImage2D(e.TEXTURE_2D, 0, e.RGBA8, t, n, 0, e.RGBA, e.UNSIGNED_BYTE, null), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.NEAREST), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.NEAREST);
	let a = e.createRenderbuffer();
	e.bindRenderbuffer(e.RENDERBUFFER, a), e.renderbufferStorage(e.RENDERBUFFER, e.DEPTH_COMPONENT24, t, n);
	let o = e.createFramebuffer();
	if (e.bindFramebuffer(e.FRAMEBUFFER, o), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, i, 0), e.framebufferRenderbuffer(e.FRAMEBUFFER, e.DEPTH_ATTACHMENT, e.RENDERBUFFER, a), e.checkFramebufferStatus(e.FRAMEBUFFER) !== e.FRAMEBUFFER_COMPLETE) throw Error("Render pass framebuffer allocation failed. Choose a lower quality preset.");
	return {
		texture: i,
		depth: a,
		framebuffer: o,
		float: r
	};
}
function v(s) {
	if (s.passSupport) return s;
	let v = null, y = null, b = null, x = null, S = null, C = null, w = /* @__PURE__ */ new Float32Array(128), T = /* @__PURE__ */ new Float32Array(32);
	function E(e) {
		if (x === e && S) return S;
		let t = s.context;
		return x = e, S = {
			passFloatOutput: t.getUniformLocation(e, "passFloatOutput"),
			passCurrentViewProjection: t.getUniformLocation(e, "passCurrentViewProjection"),
			passPreviousViewProjection: t.getUniformLocation(e, "passPreviousViewProjection"),
			passObjectDeltas: t.getUniformLocation(e, "passObjectDeltas[0]"),
			passVolumeDensity: t.getUniformLocation(e, "passVolumeDensity"),
			passVolumeColor: t.getUniformLocation(e, "passVolumeColor"),
			passMaterialIds: t.getUniformLocation(e, "passMaterialIds[0]"),
			passTransmission: t.getUniformLocation(e, "passTransmission"),
			passMaterialAov: t.getUniformLocation(e, "passMaterialAov"),
			hasPassAuxMap: t.getUniformLocation(e, "hasPassAuxMap")
		}, S;
	}
	function D(e) {
		v &&= (e.deleteTexture(v.texture), e.deleteRenderbuffer(v.depth), e.deleteFramebuffer(v.framebuffer), s.renderTargets.release("passColor", "passDepth"), null);
	}
	function O(e) {
		D(e), y && e.deleteProgram(y), y = null, x = null, S = null;
	}
	function k(e) {
		let t = c[l[e.pass] ?? e.pass];
		if (!t) throw RangeError(`Unknown render pass: ${e.pass}. Use ${[...Object.keys(c), ...Object.keys(l)].join(", ")}.`);
		if (s.benchmark) throw Error("Render passes are unavailable in benchmark mode.");
		let n = e.passDepthRange ?? 1;
		if (!Number.isFinite(n) || n <= 0) throw RangeError("Pass depth range must be positive and finite.");
		let r = s.context;
		s.requireFeatureNames(t > d ? ["renderPass", "lightingPass"] : ["renderPass"]), y || (y = o(r, a, g), b = r.getUniformLocation(y, "sourceTexture"));
		let i = e.passFloat === !0;
		if (v && v.float !== i && D(r), !v) {
			let { width: e, height: t } = s.canvas;
			v = _(r, e, t, i), s.renderTargets.record("passColor", {
				width: e,
				height: t,
				format: i ? "RGBA16F" : "RGBA8"
			}), s.renderTargets.record("passDepth", {
				width: e,
				height: t,
				format: "DEPTH_COMPONENT24"
			});
		}
		return t;
	}
	function A() {
		let e = s.context;
		s.passSupport.overlay?.(), e.bindFramebuffer(e.FRAMEBUFFER, null), e.viewport(0, 0, s.canvas.width, s.canvas.height), e.disable(e.DEPTH_TEST), e.disable(e.CULL_FACE), e.bindVertexArray(null), e.useProgram(y), e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, v.texture), e.uniform1i(b, 0), e.drawArrays(e.TRIANGLES, 0, 3);
	}
	function j(e, t) {
		return s.drawsInOpaqueLoop(e) || t === c.transmission && e.layerState[9] > 0;
	}
	function M() {
		return s.batches.filter((e) => s.drawsInOpaqueLoop(e)).flatMap((e) => e.parts.map((e) => e.name));
	}
	function N() {
		let e = /* @__PURE__ */ new Map();
		for (let t of s.batches) if (s.drawsInOpaqueLoop(t)) for (let n of t.parts) {
			let t = n.material, r = t.id ?? t.name ?? t;
			if (!e.has(r)) {
				let t = e.size + 1, n = typeof r == "string" ? r : `material-${t}`;
				e.set(r, {
					id: t,
					name: n
				});
			}
		}
		return e;
	}
	function P() {
		return {
			objects: Object.fromEntries(M().map((e, t) => [e, {
				id: t + 1,
				hash: h(e),
				value: m(t + 1)
			}])),
			materials: Object.fromEntries([...N().values()].map(({ id: e, name: t }) => [t, {
				id: e,
				hash: h(t),
				value: m(e)
			}]))
		};
	}
	function F(r) {
		if (r.previousViewProjection) return r.previousViewProjection;
		if (!r.previousCamera) return s.viewProjection;
		let a = s.canvas.width / s.canvas.height, o = r.previousCamera, c = t(n(), o.eye, o.target ?? [
			0,
			1.2,
			0
		], o.up ?? [
			0,
			1,
			0
		]), l = i(n(), o, a);
		return e(n(), l, c);
	}
	function I(e, t, n) {
		let r = s.context, i = E(s.program), a = n.density > 0 ? n.density : t.fogDensity ?? .006, o = n.density > 0 ? n.color : t.fogColor ?? [
			.35,
			.43,
			.43
		];
		r.uniform1f(i.passFloatOutput, +!!e.passFloat), r.uniformMatrix4fv(i.passCurrentViewProjection, !1, s.viewProjection), r.uniformMatrix4fv(i.passPreviousViewProjection, !1, F(e)), r.uniform1f(i.passVolumeDensity, a), r.uniform3fv(i.passVolumeColor, o), C = N();
	}
	function L(t, i, a, o) {
		let l = C ?? N(), u = s.context, d = E(s.program), f = Math.min(t.parts.length, 8);
		for (let i = 0; i < 8; i++) {
			let s = w.subarray(i * 16, (i + 1) * 16);
			if (i < f && a.objectMotion?.matrices) {
				let e = (o + i) * 16;
				if (e + 16 <= a.objectMotion.matrices.length) {
					s.set(a.objectMotion.matrices.subarray(e, e + 16));
					continue;
				}
			}
			if (i < f && a.previousMatrices) {
				let o = t.parts[i].name, c = a.previousMatrices instanceof Map ? a.previousMatrices.get(o) : a.previousMatrices[o], l = n();
				if (c && r(l, t.parts[i].matrix)) {
					e(s, c, l);
					continue;
				}
			}
			s.set(p);
		}
		u.uniformMatrix4fv(d.passObjectDeltas, !1, w), T.fill(1);
		for (let e = 0; e < Math.min(t.parts.length, 32); e++) {
			let n = t.parts[e].material;
			T[e] = l.get(n.id ?? n.name ?? n)?.id ?? 1;
		}
		u.uniform1fv(d.passMaterialIds, T), u.uniform1f(d.passTransmission, t.layerState[9] ?? 0);
		let m = t.parts[0].material, h = m.aov ?? (m.aovMap ? [
			1,
			1,
			1
		] : [
			0,
			0,
			0
		]);
		u.uniform3f(d.passMaterialAov, h[0], h[1], h[2]);
		let g = i === c.aov ? m.aovMap : i === c.transmission ? m.transmissionMap : null;
		u.uniform1f(d.hasPassAuxMap, +!!g);
		let _ = t.textures[4];
		g && (t.textures[4] = s.createTexture(g));
		try {
			let e = i !== c.objectId && i !== c.cryptomatte;
			s.drawAlphaBatch(t, !0, e);
		} finally {
			t.textures[4] = _;
		}
	}
	return s.passSupport = {
		overlay: null,
		prepare: k,
		get framebuffer() {
			return v.framebuffer;
		},
		get texture() {
			return v.texture;
		},
		background: (e) => u[e] ?? f,
		copyToCanvas: A,
		drawsInPass: j,
		bindFrame: I,
		drawBatch: L,
		objectNames: M,
		cryptomatteManifest: P,
		releaseTargets: D,
		dispose: O
	}, s;
}
export { c as RENDER_PASS_MODES, h as cryptomatteHashHex, m as cryptomatteValue, v as installRenderPasses };
