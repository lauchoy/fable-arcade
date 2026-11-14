/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { t as e } from "./cooperative-KKQp9xLa.js";
import { r as t } from "./environment-DsFt4psZ.js";
// src/hdri.js
var n = 256 * 1024 ** 2, r = 8, i = 32767;
function a(e, t) {
	let n = t;
	for (; n < e.length && e[n] !== 10;) n++;
	if (n >= e.length) throw Error("Radiance HDR header is truncated.");
	return {
		text: String.fromCharCode(...e.subarray(t, Math.min(n, t + 256))).replace(/\r$/, ""),
		next: n + 1
	};
}
function o(e) {
	let t = a(e, 0);
	if (!t.text.startsWith("#?")) throw Error("Not a Radiance HDR file: missing #? signature.");
	let n = !1, r = t.next;
	for (; t = a(e, r), r = t.next, t.text !== "";) if (t.text.startsWith("FORMAT=")) {
		if (t.text !== "FORMAT=32-bit_rle_rgbe") throw Error(`Unsupported Radiance HDR format: ${t.text}.`);
		n = !0;
	}
	if (!n) throw Error("Radiance HDR header has no FORMAT=32-bit_rle_rgbe line.");
	t = a(e, r);
	let i = /^-Y (\d+) \+X (\d+)$/.exec(t.text);
	if (!i) throw Error("Unsupported Radiance HDR orientation. Only \"-Y height +X width\" is supported.");
	let o = Number(i[1]), s = Number(i[2]);
	if (s < 1 || o < 1 || s > 16384 || o > 16384) throw RangeError("Radiance HDR dimensions are outside the supported range.");
	return {
		width: s,
		height: o,
		dataStart: t.next
	};
}
function s(e, t, n, r) {
	let i = t + 4;
	for (let t = 0; t < 4; t++) {
		let a = 0;
		for (; a < n;) {
			if (i >= e.length) throw Error("Radiance HDR pixel data is truncated.");
			let o = e[i++], s = o > 128, c = s ? o - 128 : o;
			if (c === 0 || a + c > n) throw Error("Radiance HDR run length is invalid.");
			if (s) {
				if (i >= e.length) throw Error("Radiance HDR pixel data is truncated.");
				let n = e[i++];
				for (let e = 0; e < c; e++) r[(a + e) * 4 + t] = n;
			} else {
				if (i + c > e.length) throw Error("Radiance HDR pixel data is truncated.");
				for (let n = 0; n < c; n++) r[(a + n) * 4 + t] = e[i + n];
				i += c;
			}
			a += c;
		}
	}
	return i;
}
function c(e, t, n) {
	return n >= r && n <= i && e[t] === 2 && e[t + 1] === 2 && (e[t + 2] << 8 | e[t + 3]) === n;
}
function* l(e) {
	let t = e instanceof Uint8Array ? e : new Uint8Array(e);
	if (t.length > n) throw RangeError("Radiance HDR file is larger than 256 MiB.");
	let { width: r, height: i, dataStart: a } = o(t), l = new Float32Array(r * i * 3), u = new Uint8Array(r * 4), d = a;
	for (let e = 0; e < i; e++) {
		if (c(t, d, r)) d = s(t, d, r, u);
		else {
			if (d + r * 4 > t.length) throw Error("Radiance HDR pixel data is truncated.");
			u.set(t.subarray(d, d + r * 4)), d += r * 4;
		}
		for (let t = 0; t < r; t++) {
			let n = u[t * 4 + 3], i = (e * r + t) * 3;
			if (n === 0) continue;
			let a = 2 ** (n - 136);
			l[i] = u[t * 4] * a, l[i + 1] = u[t * 4 + 1] * a, l[i + 2] = u[t * 4 + 2] * a;
		}
		yield e;
	}
	return {
		width: r,
		height: i,
		data: l
	};
}
function u(e) {
	let t = l(e), n = t.next();
	for (; !n.done;) n = t.next();
	return n.value;
}
async function d(e, t) {
	let n = l(e), r = n.next();
	for (; !r.done;) await t(), r = n.next();
	return r.value;
}
async function f(n, { intensity: r, rotation: i, showBackground: a, backgroundBlur: o, signal: s, fetchImplementation: c = globalThis.fetch } = {}) {
	let l = await c(n, { signal: s });
	if (!l.ok) throw Error(`HDRI download failed: HTTP ${l.status}.`);
	let u = await d(await l.arrayBuffer(), e());
	return t({
		...u,
		intensity: r,
		rotation: i,
		showBackground: a,
		backgroundBlur: o
	});
}
var p = 20, m = Math.PI / 18;
function h(e, t) {
	return .2126 * e[t] + .7152 * e[t + 1] + .0722 * e[t + 2];
}
function g(e, t, n, r) {
	let i = ((e + .5) / n - .5) * 2 * Math.PI, a = (t + .5) / r * Math.PI;
	return [
		Math.sin(a) * Math.sin(i),
		Math.cos(a),
		-Math.sin(a) * Math.cos(i)
	];
}
function _([e, t, n], r) {
	let i = Math.cos(r), a = Math.sin(r);
	return [
		i * e + a * n,
		t,
		-a * e + i * n
	];
}
function v(e) {
	let { width: t, height: n, channels: r, data: i } = e, a = Float64Array.from({ length: n }, (e, t) => Math.sin((t + .5) / n * Math.PI)), o = new Float32Array(t * n), s = 0;
	for (let e = 0; e < n; e++) for (let n = 0; n < t; n++) {
		let c = h(i, (e * t + n) * r);
		o[e * t + n] = c, s += c * a[e];
	}
	let c = s / (a.reduce((e, t) => e + t, 0) * t), l = 0, u = 0, d = 0;
	for (let e = 1; e < n - 1; e++) for (let n = 0; n < t; n++) {
		let r = 0;
		for (let i = -1; i <= 1; i++) for (let a = -1; a <= 1; a++) r += o[(e + i) * t + (n + a + t) % t];
		r / 9 > l && (l = r / 9, u = n, d = e);
	}
	if (!(l > p * c)) return null;
	let f = g(u, d, t, n), v = Math.cos(m), y = 2 * Math.PI / t * (Math.PI / n), b = [
		0,
		0,
		0
	], x = [
		0,
		0,
		0
	], S = 0;
	for (let e = 0; e < n; e++) for (let s = 0; s < t; s++) {
		let c = o[e * t + s];
		if (c < l * .5) continue;
		let u = g(s, e, t, n), d = u[0] * f[0] + u[1] * f[1] + u[2] * f[2];
		if (d < v) continue;
		let p = c * a[e];
		for (let n = 0; n < 3; n++) b[n] += u[n] * p, x[n] += i[(e * t + s) * r + n] * p;
		S += c * a[e] * y * Math.max(d, 0);
	}
	let C = Math.hypot(...b), w = Math.max(...x);
	return {
		lightDirection: _(b.map((e) => e / C), e.rotation),
		keyColor: x.map((e) => e / w),
		keyIntensity: S * e.intensity / Math.PI
	};
}
function y(e, t) {
	let n = v(e);
	if (!n) return null;
	let r = t.min.map((e, n) => (e + t.max[n]) / 2), i = Math.max(Math.hypot(...t.max.map((e, n) => e - t.min[n])) / 2, .001), a = r.map((e, t) => e + n.lightDirection[t] * i * 2), { lightDirection: o, keyColor: s, keyIntensity: c } = n;
	return {
		environment: {
			lightDirection: o,
			keyColor: s,
			keyIntensity: c
		},
		shadowBounds: {
			target: r,
			eye: a,
			extent: i,
			near: i * .5,
			far: i * 3.5
		}
	};
}
export { t as createEnvironmentMap, y as keyLightFromHdri, f as loadHdri, u as parseRadianceHdr, d as parseRadianceHdrInSlices, v as sunFromEnvironmentMap };
