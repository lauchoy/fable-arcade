/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { h as e, n as t } from "./mat4-BCZClxna.js";
import { i as n, n as r } from "./gl-program-DIc2K8ep.js";
import { h as i } from "./shader-registry-DHYkwAg5.js";
// src/reversed-depth.js
var a = /* @__PURE__ */ new Float32Array(4);
function o(e, t) {
	for (let n = 0; n < 4; n++) {
		let r = n * 4 + 2, i = t[r], a = t[r + 1];
		e[n * 4] = t[n * 4], e[n * 4 + 1] = t[n * 4 + 1], e[r] = (a - i) / 2, e[r + 1] = a;
	}
	return e;
}
var s = "gl_Position = viewProjection * world;", c = "gl_Position = viewProjection * vec4(world.xyz - cameraOffset.xyz, 1.0 - cameraOffset.w) + cameraShift;", l = "uniform mat4 lightProjection;\nuniform vec4 cameraOffset;\nuniform vec4 cameraShift;", u = !1, d = !1;
function f(e) {
	return !u || !e.includes(s) ? e : e.replace("uniform mat4 lightProjection;", l).replace(s, c);
}
var p = "#version 300 es\nprecision highp float;\nuniform highp sampler2D reversedDepth;\nvoid main() {\n  gl_FragDepth = 1.0 - texelFetch(reversedDepth, ivec2(gl_FragCoord.xy), 0).r;\n}";
function m() {
	let e = null, t = null, i = null;
	function a(e) {
		i &&= (e.deleteTexture(i.texture), e.deleteFramebuffer(i.framebuffer), null);
	}
	function o(e, t, n) {
		let r = e.createTexture();
		e.bindTexture(e.TEXTURE_2D, r), e.texImage2D(e.TEXTURE_2D, 0, e.DEPTH_COMPONENT32F, t, n, 0, e.DEPTH_COMPONENT, e.FLOAT, null), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.NEAREST), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.NEAREST);
		let i = e.createFramebuffer();
		return e.bindFramebuffer(e.FRAMEBUFFER, i), e.framebufferTexture2D(e.FRAMEBUFFER, e.DEPTH_ATTACHMENT, e.TEXTURE_2D, r, 0), {
			texture: r,
			framebuffer: i,
			width: t,
			height: n
		};
	}
	function s(s) {
		if (!s.depthTexture) return null;
		let c = s.context, { width: l, height: u } = s.canvas;
		return e || (e = r(c, n, p), t = c.getUniformLocation(e, "reversedDepth")), i && (i.width !== l || i.height !== u) && a(c), i ??= o(c, l, u), c.bindFramebuffer(c.READ_FRAMEBUFFER, s.resolveFramebuffer), c.bindFramebuffer(c.DRAW_FRAMEBUFFER, i.framebuffer), c.blitFramebuffer(0, 0, l, u, 0, 0, l, u, c.DEPTH_BUFFER_BIT, c.NEAREST), c.bindFramebuffer(c.FRAMEBUFFER, s.resolveFramebuffer), c.viewport(0, 0, l, u), c.useProgram(e), c.activeTexture(c.TEXTURE0), c.bindTexture(c.TEXTURE_2D, i.texture), c.uniform1i(t, 0), c.enable(c.DEPTH_TEST), c.depthFunc(c.ALWAYS), c.colorMask(!1, !1, !1, !1), c.disable(c.CULL_FACE), c.bindVertexArray(null), c.drawArrays(c.TRIANGLES, 0, 3), c.colorMask(!0, !0, !0, !0), c.depthFunc(c.LESS), c.disable(c.DEPTH_TEST), null;
	}
	function c(t) {
		a(t), e && t.deleteProgram(e), e = null;
	}
	return {
		name: "Reversed depth",
		apply: s,
		releaseTargets: a,
		dispose: c
	};
}
function h(e) {
	let t = e.context;
	if (!e.multisampleFramebuffer) return;
	let { width: n, height: r } = e.canvas;
	t.bindRenderbuffer(t.RENDERBUFFER, e.multisampleDepth), t.renderbufferStorageMultisample(t.RENDERBUFFER, e.multisampleSamples, t.DEPTH_COMPONENT32F, n, r), e.renderTargets?.record("multisampleDepth", {
		width: n,
		height: r,
		format: "DEPTH_COMPONENT32F",
		samples: e.multisampleSamples
	}), e.depthTexture && (t.bindTexture(t.TEXTURE_2D, e.depthTexture), t.texImage2D(t.TEXTURE_2D, 0, t.DEPTH_COMPONENT32F, n, r, 0, t.DEPTH_COMPONENT, t.FLOAT, null), e.renderTargets?.record("sceneDepth", {
		width: n,
		height: r,
		format: "DEPTH_COMPONENT32F"
	}));
	for (let n of [e.multisampleFramebuffer, e.resolveFramebuffer]) if (t.bindFramebuffer(t.FRAMEBUFFER, n), t.checkFramebufferStatus(t.FRAMEBUFFER) !== t.FRAMEBUFFER_COMPLETE) throw Error("Reversed depth targets failed to allocate. Pass reversedDepth: false to the install.");
	t.bindFramebuffer(t.FRAMEBUFFER, null);
}
function g(e) {
	if (e.cameraRelativeMainProgram) return;
	d ||= (i.push(f), !0);
	let t = e.startMainProgram;
	e.startMainProgram = function() {
		u = !0;
		try {
			return t.call(this);
		} finally {
			u = !1;
		}
	}, e.cameraRelativeMainProgram = !0;
}
function _(n, r = "auto") {
	if (r === !1 && (n.reversedDepth ??= !1), r === !1 || n.reversedDepth !== void 0) return n;
	let i = n.context, s = {
		render: n.render,
		applyEnvironmentUniforms: n.applyEnvironmentUniforms,
		applyDepthRank: n.applyDepthRank,
		resolveFrame: n.resolveFrame,
		allocateFrameTargets: n.allocateFrameTargets
	}, c = t(), l = t(), u = new Float32Array([
		0,
		0,
		0,
		1
	]), d = /* @__PURE__ */ new Float32Array(4), f = null, p = !1, _ = !1, v = null, y = null;
	function b() {
		_ && f.active !== !1 && (f.extension.clipControlEXT(f.extension.LOWER_LEFT_EXT, f.extension.NEGATIVE_ONE_TO_ONE_EXT), i.depthFunc(i.LESS), f.active = !1);
	}
	function x(e, t) {
		i.uniform4fv(i.getUniformLocation(n.program, "cameraOffset"), e), i.uniform4fv(i.getUniformLocation(n.program, "cameraShift"), t), y = n.program;
	}
	function S() {
		y === n.program && (i.useProgram(n.program), x(a, a), y = null);
	}
	function C() {
		o(c, n.projection), e(l, c, n.view), i.uniformMatrix4fv(n.uniforms.viewProjection, !1, l), n.setFlushProjection(l), u.set(v), d.set(c.subarray(12, 16)), x(u, d), i.clearDepth(0), i.clear(i.DEPTH_BUFFER_BIT), i.clearDepth(1), f.extension.clipControlEXT(f.extension.LOWER_LEFT_EXT, f.extension.ZERO_TO_ONE_EXT), i.depthFunc(i.GREATER), f.active = !0;
	}
	function w() {
		n.shaderFeatures && (n.cameraRelativeMainProgram || (g(n), n.rebuildMainProgram()));
	}
	function T() {
		let e = n.benchmark ? null : i.getExtension?.("EXT_clip_control");
		return e ? (f = {
			extension: e,
			active: !1
		}, _ = !0, n.reversedDepth = !0, n.rasterProjection = c, n.rasterViewProjection = l, n.capabilities && (n.capabilities.reversedDepth = !0), n.applyEnvironmentUniforms = function(e, t) {
			s.applyEnvironmentUniforms.call(this, e, t), p && !f.active && t === void 0 && C();
		}, n.applyDepthRank = function(e) {
			s.applyDepthRank.call(this, e, f.active ? 1 : -1);
		}, n.resolveFrame = function(...e) {
			return b(), s.resolveFrame.apply(this, e);
		}, n.allocateFrameTargets = function(e, t) {
			s.allocateFrameTargets.call(this, e, t), h(this);
		}, n.postStages.unshift(m()), h(n), w(), !0) : (n.reversedDepth = !1, !1);
	}
	return n.render = function(e) {
		let t = v;
		v = e.eye, p = !0;
		try {
			return s.render.call(this, e);
		} finally {
			p = !1, v = t, b(), S();
		}
	}, T(), n;
}
export { _ as installReversedDepth, g as prepareCameraRelativeProgram, o as reverseProjectionDepth };
