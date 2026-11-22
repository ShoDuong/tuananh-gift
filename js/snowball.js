/* ============================================================
   Quả Cầu Tuyết ASCII — người tuyết trong quả cầu, lắc là tuyết bay
   Dùng: startSnowball(canvasElement)  /  stopSnowball()
   Không cần thư viện. Vẽ bằng chữ trên canvas.
   ============================================================ */
(function (global) {
  'use strict';

  var COLS = 96, ROWS = 64;
  var ZOOM = 1.2, VCEN = 0.44;
  var SHADE = ' .,:;-=+*#%@';
  var LOOP = 16.0;
  var SHAKES = [0.35, 7.6, 13.4];
  var BUILD = { low: 0.8, mid: 1.25, head: 1.7, face: 2.15, nose: 2.45, button: 2.7, hat: 3.0, scarf: 3.4, arm: 3.8, pine: 4.4, bulb: 5.0 };

  /* ---------- seeded random ---------- */
  var seed = 1119 >>> 0;
  function rnd() {
    seed = (seed + 0x6D2B79F5) >>> 0;
    var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  function gauss() {
    var u = 1 - rnd(), v = rnd();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  /* ---------- colours ---------- */
  var WHITE = [255, 255, 255], ICE = [150, 205, 255], SHADOW = [105, 150, 235];
  var GOLD = [255, 215, 120], RED = [255, 70, 80], ORANGE = [255, 150, 50];
  var COAL = [60, 70, 95], BROWN = [175, 115, 65];
  var HAT = [60, 125, 245], PINE = [40, 165, 100], WOOD = [70, 115, 225];
  var BULBS = [RED, GOLD, [120, 190, 255], [255, 130, 210]];
  var LIGHT = [-0.45, 0.6, 0.66];

  var MANX = -0.1, MANY = -0.04, MANZ = 0.12, K = 0.43;

  /* ---------- point cloud helpers ---------- */
  function ball(n) {
    var P = new Float32Array(n * 3);
    for (var i = 0; i < n; i++) {
      var x = gauss(), y = gauss(), z = gauss();
      var L = Math.sqrt(x * x + y * y + z * z) || 1;
      P[i * 3] = x / L; P[i * 3 + 1] = y / L; P[i * 3 + 2] = z / L;
    }
    return P;
  }
  function tube(r0, r1, y0, y1, n) {
    var P = new Float32Array(n * 3), F = new Float32Array(n), A = new Float32Array(n);
    for (var i = 0; i < n; i++) {
      var f = rnd(), a = rnd() * Math.PI * 2, r = r0 + (r1 - r0) * f;
      P[i * 3] = r * Math.cos(a); P[i * 3 + 1] = y0 + (y1 - y0) * f; P[i * 3 + 2] = r * Math.sin(a);
      F[i] = f; A[i] = a;
    }
    return { P: P, F: F, A: A, n: n };
  }
  function disc(r, y, n) {
    var P = new Float32Array(n * 3);
    for (var i = 0; i < n; i++) {
      var a = rnd() * Math.PI * 2, rr = r * Math.sqrt(rnd());
      P[i * 3] = rr * Math.cos(a); P[i * 3 + 1] = y; P[i * 3 + 2] = rr * Math.sin(a);
    }
    return P;
  }

  /* ---------- geometry built once ---------- */
  var G = null;
  function build() {
    if (G) return G;
    G = {};
    G.glass = ball(9000);
    G.base = tube(0.92, 0.74, -1.3, -1.0, 5200);
    G.baseTop = disc(0.74, -1.0, 1600);
    G.mound = disc(0.86, 0, 4200);
    for (var i = 0; i < 4200; i++) {
      var x = G.mound[i * 3], z = G.mound[i * 3 + 2];
      var r = Math.sqrt(x * x + z * z), a = Math.atan2(z, x);
      G.mound[i * 3 + 1] = -0.62 + 0.1 * Math.cos(r * 1.8) + 0.03 * Math.sin(r * 9 + a * 3);
    }
    G.body = [
      { cy: -0.72, r: 0.62, D: ball(4200) },
      { cy: 0.06, r: 0.45, D: ball(3000) },
      { cy: 0.70, r: 0.31, D: ball(2200) }
    ];
    G.dot = ball(220);
    G.eyes = [[-0.12, 0.80, 0.27], [0.12, 0.80, 0.27]];
    G.smile = [];
    for (var s = 0; s < 5; s++) {
      var aa = -0.9 + 1.8 * s / 4;
      G.smile.push([0.16 * Math.sin(aa), 0.62 - 0.05 * Math.cos(aa), 0.29 - 0.02 * Math.abs(Math.sin(aa))]);
    }
    G.buttons = [[0, 0.22, 0.435], [0, 0.04, 0.45], [0, -0.14, 0.435]];
    var NN = 700;
    G.nose = new Float32Array(NN * 3);
    for (var i = 0; i < NN; i++) {
      var t = i / (NN - 1);
      G.nose[i * 3] = gauss() * 0.03 * (1 - t);
      G.nose[i * 3 + 1] = 0.70 + gauss() * 0.03 * (1 - t);
      G.nose[i * 3 + 2] = 0.30 + t * 0.32;
    }
    G.hatSide = tube(0.22, 0.22, 0.93, 1.32, 2600);
    G.hatBrim = tube(0.20, 0.38, 0.93, 0.94, 1800);
    G.hatTop = tube(0.0, 0.22, 1.32, 1.32, 1100);
    G.scarf = tube(0.33, 0.37, 0.40, 0.53, 2600);
    var TN = 1300;
    G.tail = new Float32Array(TN * 3); G.tailF = new Float32Array(TN);
    for (var i = 0; i < TN; i++) {
      var f = rnd();
      G.tailF[i] = f;
      G.tail[i * 3] = (rnd() - 0.5) * 0.14;
      G.tail[i * 3 + 1] = f;
      G.tail[i * 3 + 2] = 0;
    }
    G.armF = new Float32Array(700); G.twig = new Float32Array(700 * 3);
    for (var i = 0; i < 700; i++) {
      G.armF[i] = rnd();
      G.twig[i * 3] = gauss() * 0.013; G.twig[i * 3 + 1] = gauss() * 0.013; G.twig[i * 3 + 2] = gauss() * 0.013;
    }
    /* thông nhỏ phía sau */
    G.pines = []; G.bulbs = [];
    var spec = [[-0.58, -0.3, 0.5], [0.12, -0.55, 0.62], [0.62, -0.42, 0.46]];
    for (var p = 0; p < 3; p++) {
      var px = spec[p][0], pz = spec[p][1], ph = spec[p][2];
      var n = 2600;
      var P = new Float32Array(n * 3), SH = new Float32Array(n), FF = new Float32Array(n);
      for (var i = 0; i < n; i++) {
        var k = Math.floor(rnd() * 3), f = Math.pow(rnd(), 0.7), a = rnd() * Math.PI * 2;
        var r = (0.36 - k * 0.09) * f * ph;
        P[i * 3] = px + r * Math.cos(a);
        P[i * 3 + 1] = -0.58 + (k * 0.3 + (1 - f) * 0.45 + 0.12) * ph;
        P[i * 3 + 2] = pz + r * Math.sin(a);
        var nd = Math.cos(a) * LIGHT[0] + 0.4 * LIGHT[1] + Math.sin(a) * LIGHT[2];
        SH[i] = Math.max(0.2, Math.min(1, 0.45 + 0.55 * nd));
        FF[i] = f;
        if (f > 0.5 && f < 0.78 && G.bulbs.length < 27 && rnd() < 0.02) {
          G.bulbs.push([P[i * 3], P[i * 3 + 1], P[i * 3 + 2]]);
        }
      }
      G.pines.push({ P: P, SH: SH, F: FF, n: n, cx: px, cz: pz });
    }
    /* tuyết bên trong cầu */
    var NI = 520;
    G.inY = new Float32Array(NI); G.inR = new Float32Array(NI);
    G.inA = new Float32Array(NI); G.inV = new Float32Array(NI);
    for (var i = 0; i < NI; i++) {
      G.inY[i] = rnd(); G.inR[i] = Math.sqrt(rnd()) * 0.93;
      G.inA[i] = rnd() * Math.PI * 2; G.inV[i] = 0.5 + rnd();
    }
    G.NI = NI;
    return G;
  }

  /* ---------- easing ---------- */
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ease(v) { v = clamp01(v); return v * v * (3 - 2 * v); }
  function at(t, s, d) { return clamp01((t - s) / (d || 0.45)); }

  /* ---------- renderer ---------- */
  var cv = null, ctx = null, raf = 0, t0 = 0, alive = false;
  var extraShakes = [], extraBorn = [], curT = 0;
  var CW = 0, CH = 0, FX = 0, FY = 0, DPR = 1;
  var img = null, depth = null, chars = null;
  var yawC = 1, yawS = 0, tiltC = 1, tiltS = 0, hop = 0;

  function sizeTo(el) {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    var w = el.clientWidth || 360;
    var h = Math.round(w * (ROWS * 1.62) / COLS);
    el.style.height = h + 'px';
    cv.width = Math.round(w * DPR); cv.height = Math.round(h * DPR);
    CW = w / COLS; CH = h / ROWS;
    FX = 210 * COLS / 154 * ZOOM; FY = 131 * ROWS / 109 * ZOOM;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.font = '700 ' + (CH * 1.02).toFixed(2) + 'px Menlo, Consolas, "DejaVu Sans Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
  }

  function spinRock(x, y, z, out) {
    var yy = y + 1.3;
    var rx = x * tiltC - yy * tiltS;
    var ry = x * tiltS + yy * tiltC - 1.3 + hop;
    out[0] = rx * yawC + z * yawS;
    out[1] = ry;
    out[2] = -rx * yawS + z * yawC;
  }

  var tmp = [0, 0, 0];
  function solidPoint(x, y, z, r, g, b) {
    spinRock(x, y, z, tmp);
    var zz = 3.9 - tmp[2]; if (zz < 1.2) zz = 1.2;
    var gx = (COLS / 2 + tmp[0] * FX / zz) | 0;
    var gy = (ROWS * VCEN - (tmp[1] + 0.13) * FY / zz) | 0;
    if (gx < 0 || gx >= COLS || gy < 0 || gy >= ROWS) return;
    var i = gy * COLS + gx;
    if (zz >= depth[i]) return;
    depth[i] = zz;
    img[i * 3] = r; img[i * 3 + 1] = g; img[i * 3 + 2] = b;
  }
  function glowPoint(x, y, z, v, r, g, b) {
    spinRock(x, y, z, tmp);
    var zz = 3.9 - tmp[2]; if (zz < 1.2) zz = 1.2;
    var gx = (COLS / 2 + tmp[0] * FX / zz) | 0;
    var gy = (ROWS * VCEN - (tmp[1] + 0.13) * FY / zz) | 0;
    if (gx < 0 || gx >= COLS || gy < 0 || gy >= ROWS) return;
    var i = gy * COLS + gx;
    if (zz > depth[i] + 0.05) return;
    img[i * 3] += r * v; img[i * 3 + 1] += g * v; img[i * 3 + 2] += b * v;
  }

  /* đặt một cụm điểm đang "mọc lên" */
  function place(P, n, cr, cg, cb, g, pvx, pvy, pvz, drop, lean, off) {
    if (g <= 0) return;
    var e = ease(g);
    var k = e * (1 + 0.35 * Math.sin(Math.PI * g));
    var dy = (1 - e) * (drop === undefined ? 0.7 : drop);
    var boost = 1 + 0.9 * Math.sin(Math.PI * g);
    var r = cr * boost, gg = cg * boost, b = cb * boost;
    if (r > 255) r = 255; if (gg > 255) gg = 255; if (b > 255) b = 255;
    for (var i = 0; i < n; i++) {
      var x = pvx + (P[i * 3] + (off ? off[0] : 0) - pvx) * k;
      var y = pvy + (P[i * 3 + 1] + (off ? off[1] : 0) - pvy) * k + dy;
      var z = pvz + (P[i * 3 + 2] + (off ? off[2] : 0) - pvz) * k;
      if (lean) x += lean * (y + 1.34);
      solidPoint(x, y, z, r, gg, b);
    }
  }

  function manPt(x, y, z, out) {
    out[0] = MANX + x * K; out[1] = MANY + y * K; out[2] = MANZ + z * K;
  }

  var mp = [0, 0, 0];
  function frame(t) {
    var i, j, n;
    img.fill(0);
    depth.fill(99);

    var tilt = 0, hopv = 0, stir = 0, burst = 0;
    var allShakes = SHAKES;
    if (extraShakes.length) allShakes = SHAKES.concat(extraShakes);
    for (i = 0; i < allShakes.length; i++) {
      var d = t - allShakes[i];
      if (d < 0) d += LOOP;
      if (d <= 0 || d > 6) continue;
      tilt += 0.2 * Math.sin(d * 15) * Math.exp(-d * 3.0);
      hopv += 0.12 * Math.abs(Math.sin(d * 9)) * Math.exp(-d * 4.5);
      stir += Math.exp(-d / 1.5);
      burst += 1 - Math.exp(-d * 1.4);
    }
    if (stir > 1) stir = 1;
    var yaw = 0.28 * Math.sin(2 * Math.PI * t / LOOP) + 0.5 * Math.exp(-t * 1.6);
    yawC = Math.cos(yaw); yawS = Math.sin(yaw);
    tiltC = Math.cos(tilt); tiltS = Math.sin(tilt);
    hop = hopv;

    var Lc = [LIGHT[0] * yawC - LIGHT[2] * yawS, LIGHT[1], LIGHT[0] * yawS + LIGHT[2] * yawC];

    /* ---- đế ---- */
    var B = G.base;
    for (i = 0; i < B.n; i++) {
      var f = B.F[i], a = B.A[i];
      var sh = Math.max(0.25, Math.min(1.25, 0.4 + 0.8 * (Math.cos(a) * Lc[0] + 0.2 * Lc[1] + Math.sin(a) * Lc[2])));
      var c = (f > 0.55 && f < 0.7) ? GOLD : WOOD;
      solidPoint(B.P[i * 3], B.P[i * 3 + 1], B.P[i * 3 + 2], c[0] * sh, c[1] * sh, c[2] * sh);
    }
    for (i = 0; i < 1600; i++) {
      solidPoint(G.baseTop[i * 3], G.baseTop[i * 3 + 1], G.baseTop[i * 3 + 2], WOOD[0] * 0.45, WOOD[1] * 0.45, WOOD[2] * 0.45);
    }

    /* ---- nền tuyết ---- */
    for (i = 0; i < 4200; i++) {
      var x = G.mound[i * 3], z = G.mound[i * 3 + 2];
      var rr = Math.sqrt(x * x + z * z), aa = Math.atan2(z, x);
      var s = 0.42 + 0.25 * Math.pow(Math.sin(rr * 7 + aa * 4), 2);
      solidPoint(x, G.mound[i * 3 + 1], z,
        (ICE[0] * 0.4 + WHITE[0] * 0.6) * s, (ICE[1] * 0.4 + WHITE[1] * 0.6) * s, (ICE[2] * 0.4 + WHITE[2] * 0.6) * s);
    }

    /* ---- người tuyết ---- */
    var wave = at(t, BUILD.arm + 0.6, 0.5);
    var lean = (0.05 * Math.sin(t * 2.2) + tilt * 1.2 + 0.07 * wave) * K;
    var keys = [BUILD.low, BUILD.mid, BUILD.head];
    for (j = 0; j < 3; j++) {
      var bd = G.body[j], g = at(t, keys[j]);
      if (g <= 0) continue;
      var e = ease(g), k = e * (1 + 0.35 * Math.sin(Math.PI * g));
      var dy = (1 - e) * 0.7;
      var boost = 1 + 0.9 * Math.sin(Math.PI * g);
      manPt(0, bd.cy - bd.r, 0, mp);
      n = bd.D.length / 3;
      for (i = 0; i < n; i++) {
        var dx = bd.D[i * 3], dyy = bd.D[i * 3 + 1], dz = bd.D[i * 3 + 2];
        var sh = Math.max(0, Math.min(1, 0.3 + 0.7 * (dx * Lc[0] + dyy * Lc[1] + dz * Lc[2])));
        var m = (0.78 + 0.32 * sh) * boost;
        var cr = (WHITE[0] * sh + SHADOW[0] * (1 - sh)) * m;
        var cg = (WHITE[1] * sh + SHADOW[1] * (1 - sh)) * m;
        var cb = (WHITE[2] * sh + SHADOW[2] * (1 - sh)) * m;
        var wx = MANX + (dx * bd.r) * K, wy = MANY + (dyy * bd.r + bd.cy) * K, wz = MANZ + (dz * bd.r) * K;
        var px = mp[0] + (wx - mp[0]) * k;
        var py = mp[1] + (wy - mp[1]) * k + dy;
        var pz = mp[2] + (wz - mp[2]) * k;
        solidPoint(px + lean * (py + 1.34), py, pz, cr > 255 ? 255 : cr, cg > 255 ? 255 : cg, cb > 255 ? 255 : cb);
      }
    }

    var gFace = at(t, BUILD.face);
    if (gFace > 0) {
      for (j = 0; j < G.eyes.length; j++) dotAt(G.eyes[j], 0.06, COAL, gFace, lean);
      for (j = 0; j < G.smile.length; j++) dotAt(G.smile[j], 0.038, COAL, gFace, lean);
    }
    var gNose = at(t, BUILD.nose);
    if (gNose > 0) {
      manPt(0, 0.7, 0.3, mp);
      placeMan(G.nose, 700, ORANGE, gNose, mp, 0, lean);
    }
    var gB = at(t, BUILD.button);
    if (gB > 0) for (j = 0; j < G.buttons.length; j++) dotAt(G.buttons[j], 0.04, COAL, gB, lean);

    var gHat = at(t, BUILD.hat);
    if (gHat > 0) {
      manPt(0, 0.93, 0, mp);
      var HS = G.hatSide;
      placeManShaded(HS, HAT, RED, gHat, mp, 1.2, lean, Lc);
      placeMan(G.hatBrim.P, G.hatBrim.n, [HAT[0] * 0.9, HAT[1] * 0.9, HAT[2] * 0.9], gHat, mp, 1.2, lean);
      placeMan(G.hatTop.P, G.hatTop.n, [HAT[0] * 0.6, HAT[1] * 0.6, HAT[2] * 0.6], gHat, mp, 1.2, lean);
    }
    var gS = at(t, BUILD.scarf);
    if (gS > 0) {
      manPt(0, 0.46, 0, mp);
      var SC = G.scarf;
      var e2 = ease(gS), k2 = e2 * (1 + 0.35 * Math.sin(Math.PI * gS));
      var boost2 = 1 + 0.9 * Math.sin(Math.PI * gS);
      for (i = 0; i < SC.n; i++) {
        var c = (Math.sin(SC.A[i] * 10) > 0) ? RED : WHITE;
        var wx = MANX + SC.P[i * 3] * K, wy = MANY + SC.P[i * 3 + 1] * K, wz = MANZ + SC.P[i * 3 + 2] * K;
        var px = mp[0] + (wx - mp[0]) * k2, py = mp[1] + (wy - mp[1]) * k2, pz = mp[2] + (wz - mp[2]) * k2;
        solidPoint(px + lean * (py + 1.34), py, pz,
          Math.min(255, c[0] * boost2), Math.min(255, c[1] * boost2), Math.min(255, c[2] * boost2));
      }
      /* đuôi khăn bay */
      manPt(0.3, 0.46, 0.2, mp);
      for (i = 0; i < 1300; i++) {
        var f = G.tailF[i];
        var fl = 0.12 * f * Math.sin(f * 7 - t * 6);
        var lx = 0.3 + G.tail[i * 3] + f * 0.28 + fl * 0.3;
        var ly = 0.46 - f * 0.42 + fl;
        var lz = 0.22 + fl;
        var c2 = (Math.sin(f * 22) > 0) ? RED : WHITE;
        var wx = MANX + lx * K, wy = MANY + ly * K, wz = MANZ + lz * K;
        var px = mp[0] + (wx - mp[0]) * k2, py = mp[1] + (wy - mp[1]) * k2, pz = mp[2] + (wz - mp[2]) * k2;
        solidPoint(px + lean * (py + 1.34), py, pz,
          Math.min(255, c2[0] * boost2), Math.min(255, c2[1] * boost2), Math.min(255, c2[2] * boost2));
      }
    }
    var gA = at(t, BUILD.arm);
    if (gA > 0) {
      var e3 = ease(gA), k3 = e3 * (1 + 0.35 * Math.sin(Math.PI * gA));
      var boost3 = 1 + 0.9 * Math.sin(Math.PI * gA);
      for (var sg = -1; sg <= 1; sg += 2) {
        var up = 0.3 + (sg > 0 ? wave * (0.55 + 0.35 * Math.sin(t * 7)) : 0);
        var bx = sg * 0.42, by = 0.12;
        var tx = sg * (0.42 + 0.6 * Math.cos(up)), ty = 0.12 + 0.6 * Math.sin(up);
        manPt(bx, by, 0, mp);
        for (i = 0; i < 700; i++) {
          var f2 = G.armF[i];
          var lx = bx + (tx - bx) * f2 + G.twig[i * 3];
          var ly = by + (ty - by) * f2 + G.twig[i * 3 + 1];
          var lz = G.twig[i * 3 + 2];
          var wx = MANX + lx * K, wy = MANY + ly * K, wz = MANZ + lz * K;
          var px = mp[0] + (wx - mp[0]) * k3, py = mp[1] + (wy - mp[1]) * k3, pz = mp[2] + (wz - mp[2]) * k3;
          solidPoint(px + lean * (py + 1.34), py, pz,
            Math.min(255, BROWN[0] * boost3), Math.min(255, BROWN[1] * boost3), Math.min(255, BROWN[2] * boost3));
        }
      }
    }

    /* ---- thông nhỏ ---- */
    var gP = at(t, BUILD.pine, 1.1);
    if (gP > 0) {
      var eP = ease(gP), kP = eP * (1 + 0.35 * Math.sin(Math.PI * gP));
      var bP = 1 + 0.9 * Math.sin(Math.PI * gP);
      for (p2 = 0; p2 < G.pines.length; p2++) {
        var PN = G.pines[p2];
        for (i = 0; i < PN.n; i++) {
          var f3 = PN.F[i], sh3 = PN.SH[i];
          var cr, cg, cb;
          if (f3 > 0.8) { cr = WHITE[0] * 0.95; cg = WHITE[1] * 0.95; cb = WHITE[2] * 0.95; }
          else {
            var m3 = 0.4 + 0.8 * sh3 * (0.5 + 0.5 * f3);
            cr = PINE[0] * m3; cg = PINE[1] * m3; cb = PINE[2] * m3;
          }
          var px = PN.cx + (PN.P[i * 3] - PN.cx) * kP;
          var py = -0.58 + (PN.P[i * 3 + 1] + 0.58) * kP;
          var pz = PN.cz + (PN.P[i * 3 + 2] - PN.cz) * kP;
          solidPoint(px, py, pz, Math.min(255, cr * bP), Math.min(255, cg * bP), Math.min(255, cb * bP));
        }
      }
    }
    var p2;

    /* ---- kính ---- */
    for (i = 0; i < 9000; i++) {
      var gx0 = G.glass[i * 3], gy0 = G.glass[i * 3 + 1], gz0 = G.glass[i * 3 + 2];
      if (gy0 < -0.93) continue;
      var nx = gx0 * yawC + gz0 * yawS;
      var nz = -gx0 * yawS + gz0 * yawC;
      var edge = Math.pow(1 - Math.abs(nz), 3);
      var sweep = ((t * 0.35 + 0.8 * stir) % 3) - 1.2;
      var streak = (nz > 0.2) ? Math.exp(-Math.pow((nx * 0.7 + gy0 * 0.7 - sweep) / 0.07, 2)) : 0;
      var v = 0.05 * edge + 0.05 * streak;
      if (v < 0.012) continue;
      glowPoint(gx0, gy0 - 0.05, gz0, v,
        ICE[0] * 0.55 + WHITE[0] * 0.45, ICE[1] * 0.55 + WHITE[1] * 0.45, ICE[2] * 0.55 + WHITE[2] * 0.45);
    }

    /* ---- tuyết bay trong cầu ---- */
    for (i = 0; i < G.NI; i++) {
      var yy = (G.inY[i] - 0.05 * t * G.inV[i] + 0.9 * burst * G.inV[i]) % 1;
      if (yy < 0) yy += 1;
      var hy = -0.6 + yy * 1.48;
      var dd = 1 - (hy + 0.05) * (hy + 0.05);
      var wide = (dd > 0 ? Math.sqrt(dd) : 0) * 0.96;
      var aa2 = G.inA[i] + (0.25 * t + 2.6 * burst) * G.inV[i];
      var spark = (Math.sin(G.inA[i] * 7 + t * 5) > 0.9) ? stir : 0;
      var vv = 0.5 + 0.45 * stir + 0.8 * spark;
      glowPoint(G.inR[i] * wide * Math.cos(aa2), hy, G.inR[i] * wide * Math.sin(aa2), vv,
        ICE[0] * 0.45 + WHITE[0] * 0.55, ICE[1] * 0.45 + WHITE[1] * 0.55, ICE[2] * 0.45 + WHITE[2] * 0.55);
    }

    /* ---- đèn trên cây ---- */
    var gL = at(t, BUILD.bulb, 1.4);
    if (gL > 0) {
      for (i = 0; i < G.bulbs.length; i++) {
        if (i > gL * G.bulbs.length) break;
        var on = 0.4 + 0.6 * ((Math.sin(t * 5 + i * 1.7) > -0.2) ? 1 : 0);
        var c4 = BULBS[i % 4];
        var bb = G.bulbs[i];
        for (j = 0; j < 40; j++) {
          glowPoint(bb[0] + G.dot[j * 3] * 0.022, bb[1] + G.dot[j * 3 + 1] * 0.022, bb[2] + G.dot[j * 3 + 2] * 0.022,
            0.12 * on, c4[0], c4[1], c4[2]);
        }
      }
    }
  }

  function dotAt(p, r, col, g, lean) {
    manPt(p[0], p[1], p[2], mp);
    var e = ease(g), k = e * (1 + 0.35 * Math.sin(Math.PI * g));
    var boost = 1 + 0.9 * Math.sin(Math.PI * g);
    for (var i = 0; i < 220; i++) {
      var wx = MANX + (p[0] + G.dot[i * 3] * r) * K;
      var wy = MANY + (p[1] + G.dot[i * 3 + 1] * r) * K;
      var wz = MANZ + (p[2] + G.dot[i * 3 + 2] * r) * K;
      var px = mp[0] + (wx - mp[0]) * k, py = mp[1] + (wy - mp[1]) * k, pz = mp[2] + (wz - mp[2]) * k;
      solidPoint(px + lean * (py + 1.34), py, pz,
        Math.min(255, col[0] * boost), Math.min(255, col[1] * boost), Math.min(255, col[2] * boost));
    }
  }
  function placeMan(P, n, col, g, pv, drop, lean) {
    var e = ease(g), k = e * (1 + 0.35 * Math.sin(Math.PI * g));
    var dy = (1 - e) * (drop || 0);
    var boost = 1 + 0.9 * Math.sin(Math.PI * g);
    for (var i = 0; i < n; i++) {
      var wx = MANX + P[i * 3] * K, wy = MANY + P[i * 3 + 1] * K, wz = MANZ + P[i * 3 + 2] * K;
      var px = pv[0] + (wx - pv[0]) * k, py = pv[1] + (wy - pv[1]) * k + dy, pz = pv[2] + (wz - pv[2]) * k;
      solidPoint(px + lean * (py + 1.34), py, pz,
        Math.min(255, col[0] * boost), Math.min(255, col[1] * boost), Math.min(255, col[2] * boost));
    }
  }
  function placeManShaded(T, colA, colB, g, pv, drop, lean, Lc) {
    var e = ease(g), k = e * (1 + 0.35 * Math.sin(Math.PI * g));
    var dy = (1 - e) * (drop || 0);
    var boost = 1 + 0.9 * Math.sin(Math.PI * g);
    for (var i = 0; i < T.n; i++) {
      var col = (T.F[i] < 0.24) ? colB : colA;
      var nx = T.P[i * 3] / 0.22, nz = T.P[i * 3 + 2] / 0.22;
      var sh = Math.max(0.35, Math.min(1.1, 0.5 + 0.6 * (nx * Lc[0] + nz * Lc[2])));
      var wx = MANX + T.P[i * 3] * K, wy = MANY + T.P[i * 3 + 1] * K, wz = MANZ + T.P[i * 3 + 2] * K;
      var px = pv[0] + (wx - pv[0]) * k, py = pv[1] + (wy - pv[1]) * k + dy, pz = pv[2] + (wz - pv[2]) * k;
      solidPoint(px + lean * (py + 1.34), py, pz,
        Math.min(255, col[0] * sh * boost), Math.min(255, col[1] * sh * boost), Math.min(255, col[2] * sh * boost));
    }
  }

  var colCache = new Map();
  function colStr(r, g, b) {
    var ri = r < 0 ? 0 : r > 255 ? 255 : r | 0;
    var gi = g < 0 ? 0 : g > 255 ? 255 : g | 0;
    var bi = b < 0 ? 0 : b > 255 ? 255 : b | 0;
    ri = (ri >> 3) << 3; gi = (gi >> 3) << 3; bi = (bi >> 3) << 3;
    var key = (ri << 16) | (gi << 8) | bi;
    var v = colCache.get(key);
    if (v === undefined) { v = 'rgb(' + ri + ',' + gi + ',' + bi + ')'; colCache.set(key, v); }
    return v;
  }

  function paint() {
    var w = cv.width / DPR, h = cv.height / DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    var grd = ctx.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, '#0d1526');
    grd.addColorStop(0.6, '#13203a');
    grd.addColorStop(1, '#1b2a48');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);
    ctx.font = '700 ' + (CH * 1.02).toFixed(2) + 'px Menlo, Consolas, "DejaVu Sans Mono", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    var last = null;
    for (var y = 0; y < ROWS; y++) {
      for (var x = 0; x < COLS; x++) {
        var i = y * COLS + x;
        var r = img[i * 3], g = img[i * 3 + 1], b = img[i * 3 + 2];
        var m = r > g ? r : g; if (b > m) m = b;
        if (m < 12) continue;
        var bi = m / 255;
        var hot = bi > 1 ? Math.min(1, bi - 1) : 0;
        if (hot > 0) { r = r * (1 - hot) + 255 * hot; g = g * (1 - hot) + 255 * hot; b = b * (1 - hot) + 255 * hot; }
        var idx = Math.min(SHADE.length - 1, Math.max(0, (bi * (SHADE.length - 1)) | 0));
        var ch = SHADE.charAt(idx);
        if (ch === ' ') continue;
        var c = colStr(Math.pow(Math.min(r, 255) / 255, 0.8) * 255,
          Math.pow(Math.min(g, 255) / 255, 0.8) * 255,
          Math.pow(Math.min(b, 255) / 255, 0.8) * 255);
        if (c !== last) { ctx.fillStyle = c; last = c; }
        ctx.fillText(ch, x * CW + CW * 0.5, y * CH + CH * 0.5);
      }
    }
  }

  var lastPaint = 0;
  function tick(now) {
    if (!alive) return;
    raf = requestAnimationFrame(tick);
    if (now - lastPaint < 38) return;
    lastPaint = now;
    var t = ((now / 1000) - t0) % LOOP;
    curT = t;
    for (var q = extraShakes.length - 1; q >= 0; q--) {
      if (now - extraBorn[q] > 6000) { extraShakes.splice(q, 1); extraBorn.splice(q, 1); }
    }
    frame(t);
    paint();
  }

  function startSnowball(canvas) {
    if (!canvas) return;
    cv = canvas;
    ctx = cv.getContext('2d');
    build();
    img = new Float32Array(COLS * ROWS * 3);
    depth = new Float32Array(COLS * ROWS);
    sizeTo(cv.parentNode || cv);
    t0 = performance.now() / 1000;
    alive = true;
    lastPaint = 0;
    raf = requestAnimationFrame(tick);
  }
  function stopSnowball() {
    alive = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }
  function resizeSnowball() {
    if (cv) sizeTo(cv.parentNode || cv);
  }

  function shakeSnowball() {
    if (!alive || extraShakes.length > 3) return;
    extraShakes.push(curT);
    extraBorn.push(performance.now());
  }

  global.shakeSnowball = shakeSnowball;
  global.startSnowball = startSnowball;
  global.stopSnowball = stopSnowball;
  global.resizeSnowball = resizeSnowball;
})(window);
