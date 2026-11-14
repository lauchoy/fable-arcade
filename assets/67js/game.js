/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { t as e } from "./renderer-ecLXY8uQ.js";
import { r as t, s as n } from "./agent-scene-CsHMbgI1.js";
import { b as r } from "./agent-scene-capabilities-BaawWMO1.js";
import { n as i, r as a, t as o } from "./agent-ground-COys_PDT.js";
import { groundBounceEnvironment as s } from "./ground-bounce.js";
import { createRuntime as c } from "./runtime.js";
import { i as l, l as u, n as d, r as f, u as p } from "./input-NRkidDbb.js";
import { createCharacterController as m, createFirstPersonCamera as h, createFollowCamera as g, createTopDownCamera as _ } from "./player.js";
import { createGameRules as v } from "./game-rules.js";
// src/game.js
var y = {
	jump: ["keyboard/Space"],
	run: ["keyboard/ShiftLeft"]
}, b = {
	moveX: ["keyboard/KeyD", {
		control: "keyboard/KeyA",
		scale: -1
	}],
	moveForward: ["keyboard/KeyW", {
		control: "keyboard/KeyS",
		scale: -1
	}],
	lookX: ["keyboard/ArrowRight", {
		control: "keyboard/ArrowLeft",
		scale: -1
	}],
	lookY: ["keyboard/ArrowUp", {
		control: "keyboard/ArrowDown",
		scale: -1
	}]
}, x = {
	name: "move",
	area: {
		x: 0,
		y: 0,
		width: .5,
		height: 1
	},
	radius: 60
};
function S(e) {
	let t = {
		jump: [...y.jump],
		run: [...y.run]
	}, n = Object.fromEntries(Object.entries(b).map(([e, t]) => [e, [...t]]));
	return e === "gamepad" && (t.jump.push("gamepad/0.button0"), n.moveX.push("gamepad/0.axis0"), n.moveForward.push({
		control: "gamepad/0.axis1",
		scale: -1
	}), n.lookX.push("gamepad/0.axis2"), n.lookY.push({
		control: "gamepad/0.axis3",
		scale: -1
	})), e === "touch" && (t.jump.push("touch/tap"), n.moveX.push("touch/moveX"), n.moveForward.push({
		control: "touch/moveY",
		scale: -1
	})), {
		actions: t,
		axes: n
	};
}
function C(e, t) {
	let n = [l()];
	return e === "gamepad" && n.push(f()), e === "touch" && n.push(p({
		target: t,
		sticks: [x]
	})), n;
}
function w(e, t, n) {
	let r = {
		subject: t.state,
		input: n
	};
	return e === "first-person" ? h(r) : e === "top-down" ? _(r) : g(r);
}
function T(e, t) {
	let n = new Map(e.map((e) => [e.id, e])), r = [
		0,
		0,
		0
	];
	for (let e = n.get(t); e; e = n.get(e.parent)) for (let t = 0; t < 3; t++) r[t] += e.translation?.[t] ?? 0;
	return r;
}
function E(e, t) {
	let r = e.environment;
	return s(e.parts, {
		...r,
		map: n(r)
	}, { automaticAlbedo: t ? o : null });
}
function D(e) {
	let t = document.createElement("div");
	return t.style.cssText = "position:fixed;left:12px;top:12px;padding:6px 10px;border-radius:6px;background:rgba(0,0,0,.55);color:#fff;font:14px system-ui,sans-serif;pointer-events:none;user-select:none", e.parentNode.appendChild(t), t;
}
function O(e) {
	return `${Object.entries(e.variables).map(([e, t]) => `${e} ${t}`).join("   ")}${e.status === "won" ? "   YOU WIN" : e.status === "lost" ? "   GAME OVER" : ""}`;
}
async function k(e, t, n = {}) {
	let r = [];
	try {
		let i = await j(e, t, n, r), a = !1;
		return {
			...i,
			dispose() {
				a || (a = !0, A(r));
			}
		};
	} catch (e) {
		throw A(r), e;
	}
}
function A(e) {
	for (; e.length > 0;) e.pop()();
}
async function j(n, o, { replay: s, showStatus: l = !0, createRenderer: f = (...t) => new e(...t) }, p) {
	if (!o.game) throw Error("startGame needs a recipe with a game section. Add one with the set-game operation.");
	await r(o);
	let h = t(o), { game: g } = h.exportRecipe(), _ = i(h.parts, h.environment), y = E(h, !!_), b = f(n, h.parts, {
		ground: _ ? a(_) : !1,
		hdr: !0,
		depth: !0,
		world: h.environment.world,
		environment: y,
		pixelRatio: Math.min(globalThis.devicePixelRatio ?? 1, 2)
	});
	p.push(() => b.dispose());
	let { actions: x, axes: k } = S(g.input), A = d({
		sources: s ? [u(s)] : C(g.input, n),
		actions: x,
		axes: k
	}), j = g.player.footOffset, M = T(o.nodes, g.player.node), N = {
		position: [
			0,
			0,
			0
		],
		rotationY: 0
	}, P = null, F = m({
		input: A,
		position: [
			M[0],
			M[1] - j,
			M[2]
		],
		ground: g.ground,
		walkSpeed: g.player.walkSpeed,
		runSpeed: g.player.runSpeed,
		jumpSpeed: g.player.jumpSpeed,
		faceCamera: g.camera === "first-person",
		cameraYaw: () => P?.yaw ?? 0,
		node: N
	});
	P = w(g.camera, F, A);
	let I = new Set(o.nodes.map((e) => e.id)), L = g.rules ? v(g.rules, {
		input: A,
		getPartPosition: (e) => e === g.player.node ? [...F.state.position] : void 0
	}) : null, R = /* @__PURE__ */ new Map(), z = h.topologyRevision, B = l && L ? D(n) : null;
	B && p.push(() => B.remove());
	let V = {
		name: "scene",
		update(e, t) {
			let n = F.positionAt(t.alpha), r = [{
				type: "set-node",
				id: g.player.node,
				translation: [
					n[0],
					n[1] + j,
					n[2]
				],
				rotation: [
					0,
					Math.sin(N.rotationY / 2),
					0,
					Math.cos(N.rotationY / 2)
				]
			}];
			for (let e of L?.state.parts ?? []) I.has(e.id) && e.id !== g.player.node && R.get(e.id) !== e.visible && (R.set(e.id, e.visible), r.push({
				type: "set-node",
				id: e.id,
				visible: e.visible
			}));
			h.apply(r, { expectedRevision: h.revision }), h.topologyRevision === z ? b.updateParts(h.parts) : (b.replaceParts(h.parts), z = h.topologyRevision), B && (B.textContent = O(L.state));
		}
	}, H = h.camera, U = c(b, {
		fixedRate: 60,
		systems: [
			A,
			F,
			P,
			...L ? [L] : [],
			V
		],
		frame: (e) => ({
			...H,
			...P.pose(e),
			environment: y,
			time: e.elapsedSeconds
		})
	});
	p.push(() => U.dispose());
	let W = () => b.resize();
	return globalThis.addEventListener?.("resize", W), p.push(() => globalThis.removeEventListener?.("resize", W)), W(), U.start(), {
		scene: h,
		runtime: U,
		rules: L,
		input: A,
		controller: F,
		renderer: b
	};
}
export { k as startGame };
