/*! 67js, MIT License, Copyright (c) 2026 CodePawl. Bundled gl-matrix: Copyright (c) 2015-2025, Brandon Jones, Colin MacKenzie IV, MIT License. Complete license texts and third-party notices: LICENSE and THIRD-PARTY-NOTICES.md at the package root. */
import { n as e } from "./force-fields-ByNKkXEw.js";
// src/physics-jolt.js
var t = Object.freeze({
	maximumCollisionLayers: 256,
	maximumOverlaps: 1024
}), n = .05, r = [
	"ball",
	"cuboid",
	"capsule",
	"cylinder",
	"convexHull"
], i = "Install it with `npm install jolt-physics`, or build the system with rapierAdapter.", a, o;
function s() {
	return a ??= import("jolt-physics").then(async (e) => (o = await (e.default ?? e)(), o), (e) => {
		throw a = void 0, Error(`The jolt adapter needs the "jolt-physics" package, which failed to load: ${e.message}. ${i}`);
	}), a;
}
function c() {
	if (!o) throw Error("The jolt engine is not loaded. Await loadJoltEngine(), or create the system with createPhysicsSystem, which does it.");
	return o;
}
function l(e) {
	let n = [], r = e.colliders.map((e) => {
		let t = e.sensor === !0, r = n.findIndex((n) => n.groups === e.groups && n.mask === e.mask && n.sensor === t);
		return r < 0 && (r = n.length, n.push({
			groups: e.groups,
			mask: e.mask,
			sensor: t
		})), r;
	});
	if (n.length > t.maximumCollisionLayers) throw RangeError(`The jolt adapter supports at most ${t.maximumCollisionLayers} distinct collision group and mask combinations, got ${n.length}. Reuse the same groups and mask values across colliders.`);
	return {
		layers: n,
		layerOfCollider: r
	};
}
function u(e) {
	if (e.joints.length) throw TypeError("The jolt adapter does not build joints yet. Remove the joints or create the system with rapierAdapter.");
	let t = Array(e.bodies.length).fill(0);
	for (let n of e.colliders) {
		if (!r.includes(n.shape)) throw TypeError(`The jolt adapter supports ${r.join(", ")} colliders; collider "${n.name}" is ${n.shape}. Use one of those shapes or rapierAdapter.`);
		t[n.body] += 1;
	}
	t.forEach((t, n) => {
		let r = e.bodies[n];
		if (t > 1) throw TypeError(`The jolt adapter takes one collider per body; body "${r.name}" has ${t}. Split it into one body per collider, or use rapierAdapter.`);
		if (t === 0 && r.type === "dynamic") throw TypeError(`A dynamic body needs a collider for the jolt adapter; body "${r.name}" has none.`);
	});
}
function d(r) {
	let i = c();
	u(r);
	let { layers: a, layerOfCollider: o } = l(r), s = [], d = (e) => (s.push(e), e), f = Math.max(1, a.length), p = new i.ObjectLayerPairFilterTable(f);
	a.forEach((e, t) => {
		a.forEach((n, r) => {
			(e.groups & n.mask) !== 0 && (n.groups & e.mask) !== 0 && p.EnableCollision(t, r);
		});
	});
	let m = new i.BroadPhaseLayerInterfaceTable(f, 1), h = d(new i.BroadPhaseLayer(0));
	for (let e = 0; e < f; e++) m.MapObjectToBroadPhaseLayer(e, h);
	let g = d(new i.JoltSettings());
	g.mObjectLayerPairFilter = p, g.mBroadPhaseLayerInterface = m, g.mObjectVsBroadPhaseLayerFilter = new i.ObjectVsBroadPhaseLayerFilterTable(m, 1, p, f), g.mMaxBodies = Math.max(1024, r.bodies.length);
	let _ = new i.JoltInterface(g), v = _.GetPhysicsSystem(), y = v.GetBodyInterface(), b = v.GetPhysicsSettings();
	b.mNumVelocitySteps = r.solverIterations, v.SetPhysicsSettings(b);
	let x = d(new i.Vec3()), S = d(new i.RVec3()), C = d(new i.Quat());
	x.Set(...r.gravity), v.SetGravity(x);
	let w = [], T = [], E = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), O = Array(r.bodies.length).fill(-1);
	r.colliders.forEach((e, t) => {
		O[e.body] = t;
	});
	let k = {
		dynamic: i.EMotionType_Dynamic,
		fixed: i.EMotionType_Static,
		kinematic: i.EMotionType_Kinematic
	};
	function ee(e) {
		let t;
		if (e.shape === "ball") t = new i.SphereShapeSettings(e.radius);
		else if (e.shape === "cuboid") {
			let r = d(new i.Vec3(...e.halfExtents));
			t = new i.BoxShapeSettings(r, Math.min(n, ...e.halfExtents) * .5);
		} else if (e.shape === "capsule") t = new i.CapsuleShapeSettings(e.halfHeight, e.radius);
		else if (e.shape === "cylinder") t = new i.CylinderShapeSettings(e.halfHeight, e.radius, Math.min(n, e.halfHeight, e.radius) * .5);
		else {
			t = new i.ConvexHullShapeSettings();
			for (let n = 0; n < e.points.length; n += 3) t.mPoints.push_back(d(new i.Vec3(e.points[n], e.points[n + 1], e.points[n + 2])));
		}
		if (e.density !== void 0 && (t.mDensity = e.density), !(e.translation.some((e) => e !== 0) || e.rotation.some((e, t) => e !== [
			0,
			0,
			0,
			1
		][t]))) return t;
		let r = new i.Vec3(...e.translation), a = new i.Quat(...e.rotation);
		return d(r), d(a), new i.RotatedTranslatedShapeSettings(r, a, t);
	}
	function A(e) {
		let t = ee(e).Create();
		if (t.HasError()) throw RangeError(`Collider "${e.name}" could not be built by jolt: ${t.GetError().c_str()}. Convex hull points must span a volume.`);
		return t.Get();
	}
	function j() {
		for (let e of T) y.RemoveBody(e), y.DestroyBody(e);
		i.destroy(_);
		for (let e of s.reverse()) i.destroy(e);
	}
	function M(e, t) {
		let n = O[t], a = n >= 0 ? r.colliders[n] : void 0, s;
		s = a ? A(a) : new i.EmptyShapeSettings().Create().Get();
		let c = new i.RVec3(...e.translation), l = new i.Quat(...e.rotation), u = new i.BodyCreationSettings(s, c, l, k[e.type], a ? o[n] : 0);
		d(c), d(l), d(u), a && (u.mIsSensor = a.sensor === !0, u.mFriction = a.friction, u.mRestitution = a.restitution, a.mass !== void 0 && e.type === "dynamic" && (u.mOverrideMassProperties = i.EOverrideMassProperties_CalculateInertia, u.mMassPropertiesOverride.mMass = a.mass)), e.type === "dynamic" && (x.Set(...e.linearVelocity), u.mLinearVelocity = x, x.Set(...e.angularVelocity), u.mAngularVelocity = x, u.mLinearDamping = e.linearDamping, u.mAngularDamping = e.angularDamping, e.ccd && (u.mMotionQuality = i.EMotionQuality_LinearCast));
		let f = y.CreateBody(u);
		y.AddBody(f.GetID(), i.EActivation_Activate), w.push(f), T.push(f.GetID()), D.set(f.GetID().GetIndex(), f), a && E.set(f.GetID().GetIndex(), n);
	}
	try {
		r.bodies.forEach(M);
	} catch (e) {
		throw j(), e;
	}
	let N = /* @__PURE__ */ new Set(), P = [], F = (e, t) => e < t ? `${e}:${t}` : `${t}:${e}`, I = d(new i.ContactListenerJS());
	I.OnContactValidate = () => i.ValidateResult_AcceptAllContactsForThisBodyPair, I.OnContactAdded = (e, t) => {
		let n = E.get(i.wrapPointer(e, i.Body).GetID().GetIndex()), r = E.get(i.wrapPointer(t, i.Body).GetID().GetIndex()), a = F(n, r);
		N.has(a) || (N.add(a), P.push([
			n,
			r,
			!0
		]));
	}, I.OnContactPersisted = () => {}, I.OnContactRemoved = (e) => {
		let t = i.wrapPointer(e, i.SubShapeIDPair), n = D.get(t.GetBody1ID().GetIndex()), r = D.get(t.GetBody2ID().GetIndex()), a = E.get(t.GetBody1ID().GetIndex()), o = E.get(t.GetBody2ID().GetIndex()), s = F(a, o);
		![n, r].some((e) => e && !e.IsStatic() && !e.IsActive()) && N.has(s) && (N.delete(s), P.push([
			a,
			o,
			!1
		]));
	}, v.SetContactListener(I);
	let L = /* @__PURE__ */ new Map(), R = v.GetNarrowPhaseQuery(), z = d(new i.BroadPhaseLayerFilter()), B = d(new i.ShapeFilter()), V = d(new i.BodyFilter()), H = {
		mask: 65535,
		includeSensors: !1
	}, U = d(new i.ObjectLayerFilterJS());
	U.ShouldCollide = (e) => {
		let t = a[e];
		return (!t.sensor || H.includeSensors) && (t.groups & H.mask) !== 0 && t.mask !== 0;
	};
	let W = d(new i.CastRayClosestHitCollisionCollector()), G = d(new i.RayCastSettings()), K = d(new i.CastShapeClosestHitCollisionCollector()), q = d(new i.ShapeCastSettings()), J = d(new i.CollideShapeAllHitCollisionCollector()), te = d(new i.CollideShapeSettings()), Y = d(new i.Vec3(1, 1, 1)), X = d(new i.RVec3(0, 0, 0));
	function Z(e, t) {
		let r;
		if (e.type === "ball") r = new i.SphereShape(e.radius);
		else if (e.type === "capsule") r = new i.CapsuleShape(e.halfHeight, e.radius);
		else {
			let t = new i.Vec3(...e.halfExtents);
			r = new i.BoxShape(t, Math.min(n, ...e.halfExtents) * .5), i.destroy(t);
		}
		r.AddRef();
		try {
			return t(r);
		} finally {
			r.Release();
		}
	}
	function Q(e, t, n) {
		S.Set(...e), C.Set(...t);
		let r = i.RMat44.prototype.sRotationTranslation(C, S);
		try {
			return n(r);
		} finally {
			i.destroy(r);
		}
	}
	function $(e, t) {
		H.mask = e.mask, H.includeSensors = e.includeSensors;
		let n = e.excludeBody === void 0 ? void 0 : new i.IgnoreSingleBodyFilter(T[e.excludeBody]);
		try {
			return t(n ?? V);
		} finally {
			n && i.destroy(n);
		}
	}
	function ne(e) {
		let t = Math.hypot(e.GetX(), e.GetY(), e.GetZ());
		return [
			-e.GetX() / t,
			-e.GetY() / t,
			-e.GetZ() / t
		];
	}
	return {
		step(t, n) {
			for (let [e, n] of L) {
				let r = w[e], i = r.GetPosition(), a = r.GetRotation();
				S.Set(...n.translation ?? [
					i.GetX(),
					i.GetY(),
					i.GetZ()
				]), C.Set(...n.rotation ?? [
					a.GetX(),
					a.GetY(),
					a.GetZ(),
					a.GetW()
				]), y.MoveKinematic(T[e], S, C, t);
			}
			let i = [...L.keys()];
			if (L.clear(), r.fields.length) {
				let i = [
					0,
					0,
					0
				];
				r.bodies.forEach((a, o) => {
					if (a.type !== "dynamic") return;
					let s = w[o], c = s.GetPosition(), l = s.GetLinearVelocity();
					if (e(r.fields, [
						c.GetX(),
						c.GetY(),
						c.GetZ()
					], [
						l.GetX(),
						l.GetY(),
						l.GetZ()
					], n, i), !(i[0] || i[1] || i[2])) return;
					let u = t / s.GetMotionProperties().GetInverseMass();
					x.Set(i[0] * u, i[1] * u, i[2] * u), y.AddImpulse(T[o], x);
				});
			}
			_.Step(t, 1), x.Set(0, 0, 0);
			for (let e of i) y.SetLinearAndAngularVelocity(T[e], x, x);
		},
		readPose(e, t) {
			let n = w[e].GetPosition(), r = w[e].GetRotation();
			t[0] = n.GetX(), t[1] = n.GetY(), t[2] = n.GetZ(), t[3] = r.GetX(), t[4] = r.GetY(), t[5] = r.GetZ(), t[6] = r.GetW();
		},
		setKinematicPose(e, t, n) {
			let r = L.get(e) ?? {};
			t && (r.translation = t), n && (r.rotation = n), L.set(e, r);
		},
		setLinearVelocity(e, t) {
			x.Set(...t), y.SetLinearVelocity(T[e], x), y.ActivateBody(T[e]);
		},
		applyImpulse(e, t, n) {
			x.Set(...t), n ? (S.Set(...n), y.AddImpulse(T[e], x, S)) : y.AddImpulse(T[e], x);
		},
		drainEvents(e) {
			let t = P.splice(0);
			for (let [n, r, i] of t) e(n, r, i);
		},
		raycast(e, t, n, r) {
			W.Reset(), S.Set(...e), x.Set(t[0] * n, t[1] * n, t[2] * n);
			let a = new i.RRayCast(S, x);
			if ($(r, (e) => {
				R.CastRay(a, G, W, z, U, e, B);
			}), i.destroy(a), !W.HadHit()) return null;
			let o = W.mHit, s = o.mBodyID.GetIndex(), c = o.mFraction * n;
			S.Set(e[0] + t[0] * c, e[1] + t[1] * c, e[2] + t[2] * c);
			let l = D.get(s).GetWorldSpaceSurfaceNormal(o.mSubShapeID2, S), u = {
				collider: E.get(s),
				distance: c,
				normal: [
					l.GetX(),
					l.GetY(),
					l.GetZ()
				]
			};
			return i.destroy(l), u;
		},
		shapeCast(e, t, n, r, a, o) {
			if (K.Reset(), Z(e, (e) => Q(t, n, (t) => {
				x.Set(r[0] * a, r[1] * a, r[2] * a);
				let n = new i.RShapeCast(e, Y, t, x);
				$(o, (e) => {
					R.CastShape(n, q, X, K, z, U, e, B);
				}), i.destroy(n);
			})), !K.HadHit()) return null;
			let s = K.mHit;
			return {
				collider: E.get(s.mBodyID2.GetIndex()),
				distance: s.mFraction * a,
				normal: ne(s.mPenetrationAxis)
			};
		},
		overlap(e, n, r, i) {
			J.Reset(), Z(e, (e) => Q(n, r, (t) => {
				$(i, (n) => {
					R.CollideShape(e, Y, t, te, X, J, z, U, n, B);
				});
			}));
			let a = J.mHits, o = [];
			for (let e = 0; e < a.size() && o.length < t.maximumOverlaps; e++) o.push(E.get(a.at(e).mBodyID2.GetIndex()));
			return o;
		},
		free: j
	};
}
var f = Object.freeze({
	name: "jolt",
	load: s,
	createWorld: d
});
export { t as JOLT_ADAPTER_LIMITS, f as joltAdapter, s as loadJoltEngine };
