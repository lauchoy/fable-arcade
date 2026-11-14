/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { t as e } from "./field-error-BpFTmyMO.js";
// src/motion-validation.js
function t(e, t, n) {
	if (!e || Object.getPrototypeOf(e) !== Object.prototype) throw TypeError(`${n} must be a plain object.`);
	for (let r of Reflect.ownKeys(e)) {
		let i = Object.getOwnPropertyDescriptor(e, r);
		if (typeof r != "string" || !t.includes(r) || !i.enumerable || !Object.hasOwn(i, "value")) throw TypeError(`Unknown or unsupported ${n} field: ${String(r)}. Allowed fields: ${t.join(", ")}.`);
	}
}
function n(t, n) {
	if (!Number.isFinite(t) || !Number.isFinite(Math.fround(t))) throw e(n, t, "a finite number that fits Float32, such as 0.5");
	return t;
}
function r(t, r, i, a) {
	if (n(t, a), t < r || t > i) throw e(a, t, `a number from ${r} to ${i}, such as ${r > 0 ? r : Math.min(i, 1)}`);
	return t;
}
function i(e, t, n) {
	if (!Array.isArray(e) || e.length > t || Object.keys(e).length !== e.length || Reflect.ownKeys(e).length !== e.length + 1 || Object.keys(e).some((e, t) => e !== String(t))) throw TypeError(`${n} must be a bounded dense array.`);
	for (let t = 0; t < e.length; t++) if (!Object.hasOwn(Object.getOwnPropertyDescriptor(e, t), "value")) throw TypeError(`${n} cannot contain accessors.`);
	return e;
}
function a(t, r, a) {
	if (r === 1) return n(t, a);
	if (i(t, r, a), t.length !== r) throw e(a, t, `an array of ${r} numbers, such as [${Array(r).fill(0).join(", ")}]`, TypeError);
	return t.map((e) => n(e, a));
}
export { a, t as i, i as n, n as r, r as t };
