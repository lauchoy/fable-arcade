/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
// src/path-tracer-reprojection.js
var e = .06, t = .9, n = [
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
function r(e, t) {
	return e.every((e, n) => e === t[n]);
}
function i(e) {
	let [t, n, r, , i, a, o, , s, c, l, , u, d, f] = e, p = a * l - c * o, m = c * r - n * l, h = n * o - a * r, g = t * p + i * m + s * h;
	if (!(Math.abs(g) > 1e-12)) return null;
	let _ = [
		p,
		s * o - i * l,
		i * c - s * a,
		m,
		t * l - s * r,
		s * n - t * c,
		h,
		i * r - t * o,
		t * a - i * n
	].map((e) => e / g), v = [
		0,
		1,
		2
	].map((e) => -(_[e * 3] * u + _[e * 3 + 1] * d + _[e * 3 + 2] * f));
	return [
		_[0],
		_[3],
		_[6],
		0,
		_[1],
		_[4],
		_[7],
		0,
		_[2],
		_[5],
		_[8],
		0,
		v[0],
		v[1],
		v[2],
		1
	];
}
function a(e, t) {
	let n = Array(16).fill(0);
	for (let r = 0; r < 4; r++) for (let i = 0; i < 4; i++) for (let a = 0; a < 4; a++) n[r * 4 + i] += e[a * 4 + i] * t[r * 4 + a];
	return n;
}
function o(e, t) {
	let o = new Float32Array(Math.max(1, t.length) * 16);
	return t.forEach((t, s) => {
		let c = s * 16, l = e?.[s], u = t.matrix ?? n, d = l?.matrix ?? n, f = !!l && l.geometry === t.geometry && !t.skin && !l.skin, p = 2, m = n;
		if (f && r(d, u)) p = 0;
		else if (f) {
			let e = i(u);
			e && (m = a(d, e), p = 1);
		}
		for (let e = 0; e < 3; e++) for (let t = 0; t < 4; t++) o[c + e * 4 + t] = m[t * 4 + e];
		o[c + 12] = p;
	}), o;
}
var s = `
uniform vec3 uEye;
uniform vec3 uForward;
uniform vec3 uRight;
uniform vec3 uAbove;
uniform vec2 uHalfSize;
uniform vec3 uPreviousEye;
uniform vec3 uPreviousForward;
uniform vec3 uPreviousRight;
uniform vec3 uPreviousAbove;
uniform vec2 uPreviousHalfSize;
const float DEPTH_TOLERANCE = ${e};
const float NORMAL_AGREEMENT = ${t};

vec3 pixelRayDirection(vec2 pixelPosition, vec2 size) {
  float screenX = (pixelPosition.x / size.x * 2.0 - 1.0) * uHalfSize.x;
  float screenY = (1.0 - pixelPosition.y / size.y * 2.0) * uHalfSize.y;
  return normalize(uForward + uRight * screenX + uAbove * screenY);
}

bool projectToPrevious(vec3 point, vec2 size, out vec2 pixelPosition, out float distanceToEye) {
  vec3 offset = point - uPreviousEye;
  float alongView = dot(offset, uPreviousForward);
  distanceToEye = length(offset);
  pixelPosition = vec2(0.0);
  if (!(alongView > 1e-6)) return false;
  float screenX = dot(offset, uPreviousRight) / alongView / uPreviousHalfSize.x;
  float screenY = dot(offset, uPreviousAbove) / alongView / uPreviousHalfSize.y;
  pixelPosition = vec2(screenX * 0.5 + 0.5, 0.5 - screenY * 0.5) * size;
  return true;
}

bool isHistoryConsistent(float expectedDistance, float historyDistance, vec3 normal, vec3 historyNormal) {
  return abs(historyDistance - expectedDistance) <= DEPTH_TOLERANCE * expectedDistance && dot(normal, historyNormal) >= NORMAL_AGREEMENT;
}
`;
function c(e, t, n, r) {
	e.uniform3fv(t("uEye"), n.eye), e.uniform3fv(t("uForward"), n.forward), e.uniform3fv(t("uRight"), n.right), e.uniform3fv(t("uAbove"), n.above), e.uniform2f(t("uHalfSize"), n.halfWidth, n.halfHeight), e.uniform3fv(t("uPreviousEye"), r.eye), e.uniform3fv(t("uPreviousForward"), r.forward), e.uniform3fv(t("uPreviousRight"), r.right), e.uniform3fv(t("uPreviousAbove"), r.above), e.uniform2f(t("uPreviousHalfSize"), r.halfWidth, r.halfHeight);
}
export { o as a, i, t as n, c as o, s as r, e as t };
