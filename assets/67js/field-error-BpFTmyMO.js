/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
function e(e) {
	let t;
	if (e === void 0) t = "undefined";
	else if (typeof e == "number" || typeof e == "bigint") t = String(e);
	else if (typeof e == "function" || typeof e == "symbol") t = typeof e;
	else try {
		t = JSON.stringify(e) ?? String(e);
	} catch {
		t = Object.prototype.toString.call(e);
	}
	return t.length > 40 ? `${t.slice(0, 37)}...` : t;
}
function t(t, n, r, i = RangeError) {
	let a = new i(`${t}: got ${e(n)}; expected ${r}.`);
	return a.fieldPath = t, a;
}
function n(e, t) {
	try {
		return t();
	} catch (t) {
		throw typeof t?.fieldPath == "string" && t.message.startsWith(t.fieldPath) && (t.message = `${e}.${t.message}`, t.fieldPath = `${e}.${t.fieldPath}`), t;
	}
}
export { n, t };
