/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
// src/cooperative.js
var e = performance.now();
async function t() {
	await (globalThis.scheduler?.yield ? globalThis.scheduler.yield() : new Promise((e) => setTimeout(e, 0))), e = performance.now();
}
var n = 49152;
function r(n = 8) {
	return async function() {
		performance.now() - e <= n || await t();
	};
}
async function i(e, t, r) {
	for (let i = 0; i < e; i += n) r(i, Math.min(i + n, e)), await t();
}
export { i as n, r as t };
