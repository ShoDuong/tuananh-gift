/* ============================================================
   NGƯỜI TUYẾT VẪY TAY — cảnh ASCII cho popup photobooth
   Dùng: startSnowman(canvas) / stopSnowman() / pokeSnowman()
   Không thư viện, không ảnh: mọi thứ là chữ trên lưới.
   ============================================================ */
(function (global) {
  'use strict';

  var COLS = 100, ROWS = 80;
  var AR = 1 / 1.62;
  var RAMP = ' .,:;-=+*#%@';

  /* ---------- seeded random ---------- */
  var seed = 20261203 >>> 0;
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
  function hash(a, b, c) {
    var h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ease(v) { v = clamp01(v); return v * v * (3 - 2 * v); }
  function backOut(v) { v = clamp01(v); var p = v - 1; return 1 + p * p * (2.7 * p + 1.7); }

  /* ---------- point clouds (built once) ---------- */
  /* mỗi phần: P (x,y,z), N (normal), C (màu r,g,b 0..1), tag */
  var parts = null;

  function sphere(n, cx, cy, cz, r, col, tag) {
    var P = new Float32Array(n * 3), N = new Float32Array(n * 3);
    for (var i = 0; i < n; i++) {
      var x = gauss(), y = gauss(), z = gauss();
      var L = Math.sqrt(x * x + y * y + z * z) || 1;
      x /= L; y /= L; z /= L;
      N[i * 3] = x; N[i * 3 + 1] = y; N[i * 3 + 2] = z;
      P[i * 3] = cx + x * r; P[i * 3 + 1] = cy + y * r * 0.97; P[i * 3 + 2] = cz + z * r;
    }
    return { P: P, N: N, n: n, col: col, tag: tag || '' };
  }
  function cyl(n, r0, r1, y0, y1, col, tag, capTop) {
    var P = new Float32Array(n * 3), N = new Float32Array(n * 3);
    for (var i = 0; i < n; i++) {
      var a = rnd() * Math.PI * 2;
      if (capTop && rnd() < 0.25) {
        var rr = r1 * Math.sqrt(rnd());
        P[i * 3] = Math.cos(a) * rr; P[i * 3 + 1] = y1; P[i * 3 + 2] = Math.sin(a) * rr;
        N[i * 3] = 0; N[i * 3 + 1] = 1; N[i * 3 + 2] = 0;
        continue;
      }
      var f = rnd(), r = r0 + (r1 - r0) * f;
      P[i * 3] = Math.cos(a) * r; P[i * 3 + 1] = y0 + (y1 - y0) * f; P[i * 3 + 2] = Math.sin(a) * r;
      N[i * 3] = Math.cos(a); N[i * 3 + 1] = 0; N[i * 3 + 2] = Math.sin(a);
    }
    return { P: P, N: N, n: n, col: col, tag: tag || '' };
  }

  var SNOW = [0.93, 0.95, 1.0], SHADE = [0.42, 0.52, 0.72];
  var COAL = [0.13, 0.14, 0.18], CARROT = [1.0, 0.52, 0.18];
  var RED = [0.92, 0.22, 0.27], CREAM = [0.98, 0.94, 0.88];
  var HATC = [0.16, 0.17, 0.22], BAND = [0.88, 0.2, 0.3];
  var TWIG = [0.55, 0.36, 0.2];

  function build() {
    if (parts) return parts;
    parts = {};
    parts.bottom = sphere(5200, 0, 0.55, 0, 0.56, SNOW, 'snow');
    parts.mid = sphere(3800, 0, 1.33, 0, 0.41, SNOW, 'snow');
    parts.head = sphere(2800, 0, 1.97, 0, 0.30, SNOW, 'snow');

    /* mũ chóp + dải đỏ */
    var hb = cyl(1400, 0.27, 0.27, 2.17, 2.19, HATC, 'hat');
    var hs = cyl(1800, 0.17, 0.165, 2.19, 2.56, HATC, 'hat', true);
    for (var i = 0; i < hs.n; i++) {
      var y = hs.P[i * 3 + 1];
      if (y > 2.21 && y < 2.29 && hs.N[i * 3 + 1] === 0) hs.col2 = true;
    }
    parts.hatBrim = hb; parts.hatTop = hs;

    /* khăn quàng */
    var sc = cyl(2000, 0.33, 0.30, 1.64, 1.76, RED, 'scarf');
    parts.scarf = sc;
    var tn = 900;
    var tl = { P: new Float32Array(tn * 3), N: new Float32Array(tn * 3), n: tn, col: RED, tag: 'scarfTail', F: new Float32Array(tn) };
    for (var i = 0; i < tn; i++) {
      var f = rnd();
      tl.F[i] = f;
      tl.P[i * 3] = 0.16 + (rnd() - 0.5) * 0.13;
      tl.P[i * 3 + 1] = 1.66 - f * 0.52;
      tl.P[i * 3 + 2] = 0.31 + (rnd() - 0.5) * 0.03 + f * 0.05;
      tl.N[i * 3 + 2] = 1;
    }
    parts.scarfTail = tl;

    /* mũi cà rốt */
    var nn = 600;
    var nose = { P: new Float32Array(nn * 3), N: new Float32Array(nn * 3), n: nn, col: CARROT, tag: 'nose' };
    for (var i = 0; i < nn; i++) {
      var f = rnd(), a = rnd() * Math.PI * 2, r = 0.055 * (1 - f);
      nose.P[i * 3] = Math.cos(a) * r + f * 0.03;
      nose.P[i * 3 + 1] = 1.95 + Math.sin(a) * r - f * 0.03;
      nose.P[i * 3 + 2] = 0.28 + f * 0.30;
      nose.N[i * 3] = Math.cos(a); nose.N[i * 3 + 1] = Math.sin(a);
    }
    parts.nose = nose;

    /* mắt, miệng, cúc áo: than */
    var dots = [];
    function coal(cx, cy, cz, r, tag) {
      var d = sphere(140, cx, cy, cz, r, COAL, tag);
      dots.push(d);
    }
    coal(-0.105, 2.05, 0.265, 0.042, 'eye');
    coal(0.105, 2.05, 0.265, 0.042, 'eye');
    for (var s = 0; s < 6; s++) {
      var aa = -0.85 + 1.7 * s / 5;
      coal(0.14 * Math.sin(aa), 1.86 - 0.045 * Math.cos(aa), 0.27 - 0.03 * Math.abs(Math.sin(aa)), 0.022, 'mouth');
    }
    coal(0, 1.46, 0.39, 0.045, 'btn');
    coal(0, 1.30, 0.41, 0.048, 'btn');
    coal(0, 1.13, 0.385, 0.045, 'btn');
    parts.dots = dots;

    /* tay que (2 đoạn) + ngón */
    parts.armN = 520;
    parts.armF = new Float32Array(parts.armN);
    parts.armJ = new Float32Array(parts.armN * 3);
    for (var i = 0; i < parts.armN; i++) {
      parts.armF[i] = rnd();
      parts.armJ[i * 3] = gauss() * 0.014; parts.armJ[i * 3 + 1] = gauss() * 0.014; parts.armJ[i * 3 + 2] = gauss() * 0.014;
    }

    /* tuyết rơi */
    parts.flakes = [];
    for (var i = 0; i < 150; i++) {
      parts.flakes.push({ x: rnd(), y: rnd(), v: 0.015 + rnd() * 0.04, a: 0.25 + rnd() * 0.75, p: rnd() * 6.28, big: rnd() < 0.12 });
    }
    parts.bokeh = [];
    for (var i = 0; i < 7; i++) {
      parts.bokeh.push({ x: rnd(), y: rnd(), v: 0.008 + rnd() * 0.015, r: 3 + rnd() * 5, a: 0.18 + rnd() * 0.25, p: rnd() * 6.28 });
    }
    return parts;
  }

  /* ---------- render state ---------- */
  var cv = null, ctx = null, raf = 0, t0 = 0, alive = false;
  var CW = 0, CH = 0, DPR = 1, LW = 0, LH = 0;
  var img = null, dep = null;
  var pokes = [];

  var F = 169, CAMZ = 5.0, CAMY = 1.15, CY = 45;
  var yawC = 1, yawS = 0, lean = 0, lift = 0, scaleAll = 1;
  var LIGHT = [-0.55, 0.62, 0.56];

  function sizeTo(el) {
    DPR = Math.min(global.devicePixelRatio || 1, 2);
    var w = el.clientWidth || 360;
    var h = Math.round(w * (ROWS / AR) / COLS);
    el.style.height = h + 'px';
    cv.width = Math.round(w * DPR); cv.height = Math.round(h * DPR);
    LW = w; LH = h;
    CW = w / COLS; CH = h / ROWS;
  }

  var tmp = [0, 0, 0];
  function xform(x, y, z) {
    /* nghiêng người (quanh chân), nhún, rồi xoay nhẹ quanh trục đứng */
    var s = scaleAll;
    x *= s; y *= s; z *= s;
    x += lean * y;
    y += lift;
    tmp[0] = x * yawC + z * yawS;
    tmp[1] = y;
    tmp[2] = -x * yawS + z * yawC;
  }
  function plot(x, y, z, r, g, b) {
    xform(x, y, z);
    var dz = CAMZ - tmp[2];
    var gx = (COLS / 2 + tmp[0] * F / dz) | 0;
    var gy = (CY - (tmp[1] - CAMY) * F / dz * AR) | 0;
    if (gx < 0 || gx >= COLS || gy < 0 || gy >= ROWS) return;
    var i = gy * COLS + gx;
    if (dz >= dep[i]) return;
    dep[i] = dz;
    img[i * 3] = r; img[i * 3 + 1] = g; img[i * 3 + 2] = b;
  }

  function lightOf(nx, ny, nz) {
    var rx = nx * yawC + nz * yawS, rz = -nx * yawS + nz * yawC;
    var d = rx * LIGHT[0] + ny * LIGHT[1] + rz * LIGHT[2];
    return clamp01(0.5 + 0.62 * d);
  }

  function drawPart(pt, g, extraY, blink) {
    if (g <= 0) return;
    var k = backOut(g);
    var col = pt.col;
    for (var i = 0; i < pt.n; i++) {
      var x = pt.P[i * 3], y = pt.P[i * 3 + 1], z = pt.P[i * 3 + 2];
      if (blink && pt.tag === 'eye') {
        y = 2.05 + (y - 2.05) * blink;
      }
      var sh = lightOf(pt.N[i * 3], pt.N[i * 3 + 1], pt.N[i * 3 + 2]);
      var r, gg, b;
      if (pt.tag === 'snow') {
        var m = 0.55 + 0.55 * sh;
        r = (SNOW[0] * sh + SHADE[0] * (1 - sh)) * m;
        gg = (SNOW[1] * sh + SHADE[1] * (1 - sh)) * m;
        b = (SNOW[2] * sh + SHADE[2] * (1 - sh)) * m;
        /* hạt tuyết lấp lánh trên thân */
        if (hash(i, pt.n, 7) > 0.985) { r = 1.25; gg = 1.2; b = 0.9; }
      } else if (pt.tag === 'scarf') {
        var a = Math.atan2(z, x);
        var c2 = (Math.sin(a * 9) > 0.2) ? RED : CREAM;
        var m2 = 0.45 + 0.75 * sh;
        r = c2[0] * m2; gg = c2[1] * m2; b = c2[2] * m2;
      } else if (pt.tag === 'hat') {
        var band = (y > 2.2 && y < 2.29 && pt.N[i * 3 + 1] === 0);
        var c3 = band ? BAND : HATC;
        var m3 = band ? (0.5 + 0.7 * sh) : (0.6 + 1.4 * sh);
        r = c3[0] * m3; gg = c3[1] * m3; b = c3[2] * m3;
      } else {
        var m4 = 0.55 + 0.75 * sh;
        r = col[0] * m4; gg = col[1] * m4; b = col[2] * m4;
      }
      plot(x * k, (y - extraY) * k + extraY, z * k, r, gg, b);
    }
  }

  function drawArm(t, side, g) {
    if (g <= 0) return;
    var P = parts;
    var sx = side * 0.36, sy = 1.40, sz = 0.02;
    var a1, a2, fing;
    if (side > 0) {
      /* tay phải (bên phải màn hình) vẫy chào */
      var w = Math.sin(t * 7.2);
      a1 = 0.95 + 0.12 * Math.sin(t * 3.6);
      a2 = 1.55 + 0.55 * w;
      fing = w;
    } else {
      a1 = -0.55 + 0.06 * Math.sin(t * 1.4);
      a2 = -0.25 + 0.06 * Math.sin(t * 1.4 + 1);
      fing = 0;
    }
    var L1 = 0.42 * g, L2 = 0.36 * g;
    var ex = sx + side * Math.cos(a1) * L1, ey = sy + Math.sin(a1) * L1;
    var hx = ex + side * Math.cos(a2) * L2, hy = ey + Math.sin(a2) * L2;
    var half = P.armN / 2;
    for (var i = 0; i < P.armN; i++) {
      var f = P.armF[i], x, y;
      if (i < half) { x = sx + (ex - sx) * f; y = sy + (ey - sy) * f; }
      else { x = ex + (hx - ex) * f; y = ey + (hy - ey) * f; }
      var m = 0.75 + 0.35 * (1 - f);
      plot(x + P.armJ[i * 3], y + P.armJ[i * 3 + 1], sz + P.armJ[i * 3 + 2], TWIG[0] * m, TWIG[1] * m, TWIG[2] * m);
    }
    /* ba nhánh ngón ở đầu tay */
    var base = Math.atan2(hy - ey, side * (hx - ex));
    for (var k = -1; k <= 1; k++) {
      var fa = base + k * 0.55 + fing * 0.15;
      var fl = (k === 0 ? 0.13 : 0.1) * g;
      for (var s = 0; s < 22; s++) {
        var ff = s / 21;
        plot(hx + side * Math.cos(fa) * fl * ff, hy + Math.sin(fa) * fl * ff, sz, TWIG[0] * 1.05, TWIG[1] * 1.05, TWIG[2] * 1.05);
      }
    }
    /* nhánh phụ giữa tay */
    var ba = a1 + 0.7;
    for (var s = 0; s < 18; s++) {
      var ff = s / 17;
      plot(ex - side * Math.cos(a1) * L1 * 0.3 + side * Math.cos(ba) * 0.09 * ff,
        ey - Math.sin(a1) * L1 * 0.3 + Math.sin(ba) * 0.09 * ff, sz, TWIG[0], TWIG[1], TWIG[2]);
    }
  }

  function groundHeight(gx) {
    var u = gx / COLS;
    return 0.845 * ROWS - 4.2 * Math.exp(-Math.pow((u - 0.5) / 0.2, 2)) - 1.2 * Math.sin(u * 7.1 + 0.6) - 0.8 * Math.sin(u * 15.3);
  }

  function frame(t) {
    img.fill(0);
    dep.fill(99);

    /* xuất hiện: trồi lên từ tuyết rồi nhún */
    var intro = clamp01(t / 1.1);
    var hop = 0;
    for (var i = 0; i < pokes.length; i++) {
      var d = t - pokes[i];
      if (d > 0 && d < 1.2) hop += Math.max(0, Math.sin(d * Math.PI / 0.55)) * Math.exp(-d * 2.2) * 0.32;
    }
    scaleAll = 1;
    lift = -(1 - ease(intro)) * 2.4 + hop + 0.02 * Math.abs(Math.sin(t * 3.6));
    lean = 0.045 * Math.sin(t * 1.5) + 0.03 * Math.sin(t * 3.6);
    var yaw = 0.32 * Math.sin(t * 0.55) + 0.08 * Math.sin(t * 1.3);
    yawC = Math.cos(yaw); yawS = Math.sin(yaw);

    var blinkPhase = t % 4.2;
    var blink = blinkPhase > 4.02 ? 0.15 : 1;

    var g = clamp01((t - 0.05) / 0.9);
    drawPart(parts.bottom, g, 0.0);
    drawPart(parts.mid, clamp01((t - 0.2) / 0.9), 0.95);
    drawPart(parts.head, clamp01((t - 0.35) / 0.9), 1.7);
    var gd = clamp01((t - 0.75) / 0.6);
    if (gd > 0) {
      for (var j = 0; j < parts.dots.length; j++) drawPart(parts.dots[j], gd, parts.dots[j].P[1], blink);
      drawPart(parts.nose, gd, 1.95);
      drawPart(parts.scarf, gd, 1.7);
      /* đuôi khăn bay */
      var tl = parts.scarfTail;
      var k = backOut(gd);
      for (var i = 0; i < tl.n; i++) {
        var f = tl.F[i];
        var fl = 0.05 * f * Math.sin(f * 6 - t * 5);
        var on = Math.sin(f * 18) > 0;
        var c = on ? RED : CREAM;
        plot(tl.P[i * 3] + fl, (tl.P[i * 3 + 1] - 1.7) * k + 1.7, tl.P[i * 3 + 2], c[0] * 0.85, c[1] * 0.85, c[2] * 0.85);
      }
      drawPart(parts.hatBrim, gd, 2.17);
      drawPart(parts.hatTop, gd, 2.17);
    }
    var ga = clamp01((t - 1.0) / 0.5);
    drawArm(t, 1, ga);
    drawArm(t, -1, ga);
  }

  var colCache = new Map();
  function colStr(r, g, b, a) {
    var ri = Math.max(0, Math.min(255, r * 255 | 0)) >> 3 << 3;
    var gi = Math.max(0, Math.min(255, g * 255 | 0)) >> 3 << 3;
    var bi = Math.max(0, Math.min(255, b * 255 | 0)) >> 3 << 3;
    var ai = a === undefined ? 10 : Math.max(1, Math.min(10, Math.round(a * 10)));
    var key = ((ri << 16) | (gi << 8) | bi) * 11 + ai;
    var v = colCache.get(key);
    if (v === undefined) {
      v = ai === 10 ? 'rgb(' + ri + ',' + gi + ',' + bi + ')' : 'rgba(' + ri + ',' + gi + ',' + bi + ',' + (ai / 10) + ')';
      colCache.set(key, v);
    }
    return v;
  }

  function paint(t) {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    var grd = ctx.createLinearGradient(0, 0, 0, LH);
    grd.addColorStop(0, '#080b12');
    grd.addColorStop(0.7, '#0c111b');
    grd.addColorStop(1, '#121a28');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, LW, LH);

    /* đốm tuyết mờ xa (bokeh) */
    for (var i = 0; i < parts.bokeh.length; i++) {
      var bk = parts.bokeh[i];
      var by = ((bk.y + t * bk.v) % 1) * LH * 0.8;
      var bx = (bk.x + 0.02 * Math.sin(t * 0.4 + bk.p)) * LW;
      var rg = ctx.createRadialGradient(bx, by, 0, bx, by, bk.r * 2);
      rg.addColorStop(0, 'rgba(220,228,240,' + bk.a + ')');
      rg.addColorStop(1, 'rgba(220,228,240,0)');
      ctx.fillStyle = rg;
      ctx.beginPath(); ctx.arc(bx, by, bk.r * 2, 0, Math.PI * 2); ctx.fill();
    }

    ctx.font = '700 ' + (CH * 1.0).toFixed(2) + 'px Menlo, Consolas, "DejaVu Sans Mono", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

    /* tuyết rơi (sau lưng người tuyết) */
    for (var i = 0; i < parts.flakes.length; i++) {
      var fk = parts.flakes[i];
      var fy = ((fk.y + t * fk.v) % 1) * ROWS * 0.86;
      var fx = (fk.x + 0.012 * Math.sin(t * 0.6 + fk.p)) * COLS;
      var gi = (fy | 0) * COLS + (fx | 0);
      if (gi >= 0 && gi < COLS * ROWS && dep[gi] < 99) continue;
      ctx.fillStyle = colStr(0.95, 0.97, 1, fk.a);
      ctx.fillText(fk.big ? '+' : '.', (fx | 0) * CW + CW * 0.5, (fy | 0) * CH + CH * 0.5);
    }

    /* người tuyết */
    var last = null;
    for (var y = 0; y < ROWS; y++) {
      for (var x = 0; x < COLS; x++) {
        var i3 = y * COLS + x;
        if (dep[i3] >= 99) continue;
        var r = img[i3 * 3], g = img[i3 * 3 + 1], b = img[i3 * 3 + 2];
        var m = Math.max(r, g, b);
        var idx = Math.max(3, Math.min(RAMP.length - 1, (m * (RAMP.length - 1)) | 0));
        var c = colStr(Math.pow(Math.min(r, 1), 0.85), Math.pow(Math.min(g, 1), 0.85), Math.pow(Math.min(b, 1), 0.85));
        if (c !== last) { ctx.fillStyle = c; last = c; }
        ctx.fillText(RAMP.charAt(idx), x * CW + CW * 0.5, y * CH + CH * 0.5);
      }
    }
      /* bãi tuyết */
    for (var x = 0; x < COLS; x++) {
      var top = groundHeight(x) | 0;
      for (var y = top; y < ROWS; y++) {
        var i2 = y * COLS + x;
        var depthF = (y - top) / Math.max(1, ROWS - top);
        var tw = hash(x, y, (t * 3) | 0);
        var ch, cr, cg, cb, al = 1;
        if (y === top) { ch = '-'; cr = 0.86; cg = 0.9; cb = 1; }
        else {
          ch = (y - top) % 2 ? '=' : '~';
          var l = 0.62 - depthF * 0.22 + (hash(x, y, 2) - 0.5) * 0.12;
          cr = l * 0.86; cg = l * 0.92; cb = l * 1.08;
        }
        if (tw > 0.965) { ch = tw > 0.99 ? '*' : '.'; cr = 1; cg = 0.94; cb = 0.55; }
        /* bóng người tuyết trên tuyết */
        var sxp = (x - COLS / 2) / 17, syp = (y - (top + 1.5)) / 2.2;
        if (sxp * sxp + syp * syp < 1) { cr *= 0.62; cg *= 0.66; cb *= 0.78; }
        ctx.fillStyle = colStr(cr, cg, cb, al);
        ctx.fillText(ch, x * CW + CW * 0.5, y * CH + CH * 0.5);
      }
    }

}

  var lastPaint = 0;
  function tick(now) {
    if (!alive) return;
    raf = requestAnimationFrame(tick);
    if (now - lastPaint < 33) return;
    lastPaint = now;
    var t = now / 1000 - t0;
    frame(t);
    paint(t);
  }

  function startSnowman(canvas) {
    if (!canvas) return;
    cv = canvas; ctx = cv.getContext('2d');
    build();
    img = new Float32Array(COLS * ROWS * 3);
    dep = new Float32Array(COLS * ROWS);
    sizeTo(cv.parentNode || cv);
    t0 = performance.now() / 1000;
    pokes = [];
    alive = true; lastPaint = 0;
    raf = requestAnimationFrame(tick);
  }
  function stopSnowman() {
    alive = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }
  function resizeSnowman() { if (cv) sizeTo(cv.parentNode || cv); }
  function pokeSnowman() {
    if (!alive) return;
    var t = performance.now() / 1000 - t0;
    pokes = pokes.filter(function (p) { return t - p < 1.5; });
    if (pokes.length < 3) pokes.push(t);
  }

  global.startSnowman = startSnowman;
  global.stopSnowman = stopSnowman;
  global.resizeSnowman = resizeSnowman;
  global.pokeSnowman = pokeSnowman;
})(window);
