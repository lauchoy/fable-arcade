/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { validateGameRules as e } from "./game-rules.js";
// src/game-setup.js
var t = Object.freeze([
	"follow",
	"first-person",
	"top-down"
]), n = Object.freeze([
	"keyboard",
	"gamepad",
	"touch"
]), r = Object.freeze(["character"]), i = Object.freeze({
	maxSpeed: 100,
	maxJumpSpeed: 100,
	maxFootOffset: 100,
	maxGround: 1e4
}), a = [
	"player",
	"camera",
	"input",
	"physics",
	"ground",
	"rules"
], o = [
	"node",
	"controller",
	"walkSpeed",
	"runSpeed",
	"jumpSpeed",
	"footOffset"
];
function s(e, t) {
	throw RangeError(`Game setup ${e} ${t}`);
}
function c(e, t) {
	(!e || typeof e != "object" || Array.isArray(e)) && s(t, "must be an object, such as { \"node\": \"creature\" }.");
}
function l(e, t, n) {
	for (let r of Object.keys(e)) t.includes(r) || s(`${n}.${r}`, `is not a field. Use one of: ${t.join(", ")}.`);
}
function u(e, t, n, r) {
	return e === void 0 ? n : (t.includes(e) || s(r, `is ${JSON.stringify(e)}. Use one of: ${t.join(", ")}.`), e);
}
function d(e, t, n, r, i) {
	return e === void 0 ? t : ((typeof e != "number" || !Number.isFinite(e) || e < n || e > r) && s(i, `must be a number from ${n} to ${r}, got ${JSON.stringify(e)}.`), e);
}
function f(e, t) {
	if (c(e, "player"), l(e, o, "player"), typeof e.node != "string" || !t.has(e.node)) {
		let n = [...t].slice(0, 12).join(", ") || "none yet; add the node first";
		s("player.node", `names ${JSON.stringify(e.node)}, which is not a node of the scene. Use one of: ${n}.`);
	}
	return {
		node: e.node,
		controller: u(e.controller, r, "character", "player.controller"),
		walkSpeed: d(e.walkSpeed, 3, 0, i.maxSpeed, "player.walkSpeed"),
		runSpeed: d(e.runSpeed, 6, 0, i.maxSpeed, "player.runSpeed"),
		jumpSpeed: d(e.jumpSpeed, 7, 0, i.maxJumpSpeed, "player.jumpSpeed"),
		footOffset: d(e.footOffset, 0, -i.maxFootOffset, i.maxFootOffset, "player.footOffset")
	};
}
function p(t, n) {
	let r;
	try {
		r = e(t, { hasInput: !0 });
	} catch (e) {
		throw RangeError(`Game setup rules: ${e.message}`);
	}
	return r.parts.some((e) => e.id === n) || s("rules.parts", `has no part "${n}", the player node. Add { "id": "${n}", "tags": ["player"] } so zones can see the player.`), structuredClone(t);
}
function m(e, r) {
	c(e, "game"), l(e, a, "game");
	let o = f(e.player, r);
	e.physics !== void 0 && typeof e.physics != "boolean" && s("physics", `must be true or false, got ${JSON.stringify(e.physics)}.`);
	let m = {
		player: o,
		camera: u(e.camera, t, "follow", "camera"),
		input: u(e.input, n, "keyboard", "input"),
		physics: e.physics ?? !1,
		ground: d(e.ground, 0, -i.maxGround, i.maxGround, "ground")
	};
	return e.rules !== void 0 && (m.rules = p(e.rules, o.node)), m;
}
export { t as GAME_CAMERAS, r as GAME_CONTROLLERS, n as GAME_INPUT_PRESETS, i as GAME_SETUP_LIMITS, m as normalizeGameSetup };
