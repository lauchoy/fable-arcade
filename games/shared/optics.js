var SURF = [
    { z: 0.00, r: 0.868, n1: 1, n2: 1.52, ca: 0.300, front: 1 },
    { z: 0.10, r: 3.640, n1: 1.52, n2: 1, ca: 0.300, front: 1 },
    { z: 0.19, r: 1.190, n1: 1, n2: 1.52, ca: 0.290, front: 1 },
    { z: 0.27, r: 3.640, n1: 1.52, n2: 1, ca: 0.280, front: 1 },
    { z: 0.38, r: 1.820, n1: 1, n2: 1.62, ca: 0.270 },
    { z: 0.44, r: -2.660, n1: 1.62, n2: 1.52, ca: 0.260 },
    { z: 0.48, r: -3.360, n1: 1.52, n2: 1, ca: 0.260 },
    { z: 0.61, r: -3.360, n1: 1, n2: 1.52, ca: 0.260 },
    { z: 0.67, r: 2.660, n1: 1.52, n2: 1, ca: 0.270 },
    { z: 0.76, r: -1.820, n1: 1, n2: 1.52, ca: 0.280 },
    { z: 0.84, r: -3.640, n1: 1.52, n2: 1, ca: 0.290 },
    { z: 0.91, r: -5.600, n1: 1, n2: 1.52, ca: 0.300 },
    { z: 0.99, r: -1.330, n1: 1.52, n2: 1, ca: 0.300 }
  ];
  var ELEMENTS = [[0, 1], [2, 3], [4, 5], [5, 6], [7, 8], [9, 10], [11, 12]];
  var IRIS_Z = 0.555, FILM_Z = 1.238, MARK_R = 0.014, FAN_Y = 0.25, RAYS = 13;

  function surfZ(s, i, focus, y) {
    var z0 = s.z - (i < 4 ? focus * 0.20 : 0);
    var c = z0 + s.r;
    var q = Math.sqrt(Math.max(0, s.r * s.r - y * y));
    return c - (s.r > 0 ? q : -q);
  }
  function apertureRadius(ap) { return 0.030 + (1 - ap) * 0.225; }

  function refract(dx, dy, nx, ny, eta) {
    if (nx * dx + ny * dy > 0) { nx = -nx; ny = -ny; }
    var ci = -(nx * dx + ny * dy);
    var k = 1 - eta * eta * (1 - ci * ci);
    if (k < 0) return null;
    var f = eta * ci - Math.sqrt(k);
    var rx = eta * dx + f * nx, ry = eta * dy + f * ny;
    var l = Math.hypot(rx, ry) || 1;
    return [rx / l, ry / l];
  }

  function traceRay(y, focus, ap) {
    var pz = -0.35, py = y, dx = 1, dy = 0;
    var pts = [[pz, py]], rad = apertureRadius(ap);
    var i, s, z0, cx, R2, b, c, disc, sq, t0, t1, ts, hit, best, k, qz, qy, nx, ny, nl, u;
    for (i = 0; i < SURF.length; i++) {
      s = SURF[i];
      z0 = s.z - (i < 4 ? focus * 0.20 : 0);
      if (IRIS_Z > pz + 1e-6 && IRIS_Z <= z0 + 1e-6 && dx > 1e-6) {
        var ti = (IRIS_Z - pz) / dx;
        if (ti > 1e-6) {
          var yi = py + ti * dy;
          if (Math.abs(yi) > rad) {
            pts.push([IRIS_Z, yi]);
            return { pts: pts, blocked: true, stop: [IRIS_Z, yi] };
          }
        }
      }
      cx = z0 + s.r; R2 = s.r * s.r;
      b = (pz - cx) * dx + py * dy;
      c = (pz - cx) * (pz - cx) + py * py - R2;
      disc = b * b - c;
      if (disc < 0) return { pts: pts, blocked: true, fail: 1 };
      sq = Math.sqrt(disc);
      t0 = -b - sq; t1 = -b + sq;
      ts = [t0, t1].filter(function (t) { return t > 1e-6; }).sort(function (a, b2) { return a - b2; });
      if (!ts.length) return { pts: pts, blocked: true, fail: 1 };
      best = null;
      for (k = 0; k < ts.length; k++) {
        qz = pz + ts[k] * dx; qy = py + ts[k] * dy;
        if (Math.abs(qy) <= s.ca + 0.002 && (!best || ts[k] < best[0])) best = [ts[k], qz, qy];
      }
      if (!best) return { pts: pts, blocked: true, fail: 1 };
      pz = best[1]; py = best[2]; pts.push([pz, py]);
      nx = (cx - pz) / s.r; ny = -py / s.r;
      nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl;
      u = refract(dx, dy, nx, ny, s.n1 / s.n2);
      if (!u) return { pts: pts, blocked: true, fail: 1 };
      dx = u[0]; dy = u[1];
    }
    var filmY = py + (FILM_Z - pz) * dy / dx;
    var beyond = py + (FILM_Z + 0.075 - pz) * dy / dx;
    pts.push([FILM_Z, filmY], [FILM_Z + 0.075, beyond]);
    var zc = Math.abs(dy) > 1e-6 ? pz + (-py / dy) * dx : 99;
    return { pts: pts, blocked: false, filmY: filmY, zc: zc, dy: dy, dx: dx };
  }

  function optics(focus, ap) {
    var rays = [], ys = [], zs = [], blocked = 0, i, y, r;
    for (i = 0; i < RAYS; i++) {
      y = -FAN_Y + 2 * FAN_Y * i / (RAYS - 1);
      r = traceRay(y, focus, ap);
      rays.push(r);
      if (r.blocked) blocked++;
      else {
        ys.push(r.filmY);
        if (r.zc < 90) zs.push(r.zc);
      }
    }
    var mean = 0, j;
    for (j = 0; j < ys.length; j++) mean += ys[j];
    mean /= (ys.length || 1);
    var blur = 0;
    for (j = 0; j < ys.length; j++) blur = Math.max(blur, Math.abs(ys[j] - mean));
    var zmean = 0;
    for (j = 0; j < zs.length; j++) zmean += zs[j];
    zmean /= (zs.length || 1);
    var inside = blur <= MARK_R && Math.abs(zmean - FILM_Z) <= 0.035 && ys.length >= 3 && blocked >= 3;
    return { rays: rays, blocked: blocked, live: ys.length, blur: blur, zmean: zmean, inside: inside, mean: mean };
  }


export { optics, traceRay, SURF, ELEMENTS, FILM_Z, MARK_R };
