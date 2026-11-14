/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
// src/depth-layer.js
var e = /* @__PURE__ */ new WeakMap();
function t(t, n) {
	n ? e.set(t, n) : e.delete(t);
}
function n(t) {
	return e.get(t) ?? null;
}
function r(e) {
	return e.depthLayer ?? +!!e.decal;
}
export { n, t as r, r as t };
