/* ============================================================
   GƯƠNG MỜ — lớp sương phủ thẳng lên camera của photobooth
   Bật/tắt: toggleFogOverlay()
   - Thổi vào mic: sương loang ra quanh miệng
   - Chụm ngón cái + ngón trỏ: vẽ nét nhỏ (như bút chuột)
   - Nắm tay quẹt: lau sạch cả mảng
   - Chuột / ngón tay trên màn hình cũng vẽ được
   Dùng lại video #liveVideo của photobooth, không mở camera lần 2.
   ============================================================ */
(function (global) {
  'use strict';

  var HANDS_VER = '0.4.1675469240';
  var FACE_VER = '0.4.1646425229';
  var HANDS_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@' + HANDS_VER + '/';
  var FACE_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@' + FACE_VER + '/';

  var on = false;
  var host = null, video = null;
  var view = null, vctx = null;
  var fogCv = null, fogCtx = null, frostCv = null, frostCtx = null;
  var ui = null, brushInput = null, tipEl = null;
  var W = 0, H = 0, DPR = 1;
  var raf = 0, frameNo = 0;

  var micStream = null, AC = null, analyser = null, audioData = null;
  var noiseFloor = 0.004, breath = 0, holdBlow = false;

  var hands = null, face = null, busy = false, faceBusy = false;
  var hand = null, lastSeen = 0, releaseFrames = 0;
  var penDown = false, hasPt = false;
  var smX = 0, smY = 0, brX = 0, brY = 0, starX = 0, starY = 0;
  var hasWipe = false, lastWipeX = 0, lastWipeY = 0;
  var fogCx = 0, fogCy = 0, hasFace = false;
  var brushR = 4;

  var ptDown = false, ptX = 0, ptY = 0;

  function px(v) { return v * DPR; }

  /* ---------- styles ---------- */
  function injectCSS() {
    if (document.getElementById('fogOverlayCSS')) return;
    var st = document.createElement('style');
    st.id = 'fogOverlayCSS';
    st.textContent = [
      '.fog-view{position:absolute;inset:0;width:100%;height:100%;z-index:3;touch-action:none;cursor:crosshair}',
      '.fog-ui{position:absolute;inset:0;z-index:6;pointer-events:none;font-family:Nunito,system-ui,sans-serif}',
      '.fog-ui .fpill{position:absolute;pointer-events:auto;display:flex;align-items:center;gap:8px;',
      'padding:6px 12px;border-radius:999px;border:1px solid rgba(255,255,255,.4);',
      'background:rgba(255,255,255,.18);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);',
      'color:#fff;font:700 12px Nunito,system-ui,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.18)}',
      '.fog-ui .fog-off{top:46px;right:12px;cursor:pointer;background:rgba(224,85,111,.88);border-color:rgba(255,255,255,.6)}',
      '.fog-ui .fog-brush{left:12px;bottom:12px}',
      '.fog-ui .fog-brush span{opacity:.95;letter-spacing:.3px}',
      '.fog-ui .fog-brush input{width:88px;accent-color:#fff}',
      '.fog-ui .fog-tools{right:12px;bottom:12px;gap:6px;padding:4px 6px}',
      '.fog-ui .fog-tools button{border:0;background:rgba(255,255,255,.22);color:#fff;border-radius:999px;',
      'padding:5px 10px;font:700 12px Nunito,system-ui,sans-serif;cursor:pointer;user-select:none;-webkit-user-select:none;touch-action:none}',
      '.fog-ui .fog-tools button:active,.fog-ui .fog-tools button.held{background:rgba(255,255,255,.45)}',
      '.fog-ui .fog-tip{top:46px;left:12px;pointer-events:none;font-weight:600;font-size:11px;line-height:1.5;',
      'padding:5px 11px;border-radius:12px;max-width:62%}',
      '#fogToggleBtn.is-on{box-shadow:0 0 0 3px #38bdf8,0 0 18px rgba(56,189,248,.7) !important}',
      '@media (max-width:760px){.fog-ui .fog-tip{display:none}.fog-ui .fog-brush input{width:70px}}'
    ].join('');
    document.head.appendChild(st);
  }

  /* ---------- size ---------- */
  function resize() {
    if (!host) return;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    var r = host.getBoundingClientRect();
    var nw = Math.max(1, Math.round(r.width)), nh = Math.max(1, Math.round(r.height));
    if (nw === W && nh === H && view.width === Math.round(nw * DPR)) return;
    var keep = null;
    if (fogCv.width > 1) {
      keep = document.createElement('canvas');
      keep.width = fogCv.width; keep.height = fogCv.height;
      keep.getContext('2d').drawImage(fogCv, 0, 0);
    }
    W = nw; H = nh;
    var pw = Math.round(W * DPR), ph = Math.round(H * DPR);
    view.width = pw; view.height = ph;
    fogCv.width = pw; fogCv.height = ph;
    frostCv.width = pw; frostCv.height = ph;
    if (keep) fogCtx.drawImage(keep, 0, 0, pw, ph);
    else resetFog();
  }

  function resetFog() {
    fogCtx.globalCompositeOperation = 'source-over';
    fogCtx.clearRect(0, 0, fogCv.width, fogCv.height);
    fogCtx.fillStyle = 'rgba(255,255,255,0.55)';
    fogCtx.fillRect(0, 0, fogCv.width, fogCv.height);
  }

  /* ---------- video geometry (object-fit:cover + mirror) ---------- */
  var geo = { ox: 0, oy: 0, dw: 1, dh: 1 };
  function updateGeo() {
    var vw = video.videoWidth || 640, vh = video.videoHeight || 480;
    var s = Math.max(W / vw, H / vh);
    geo.dw = vw * s; geo.dh = vh * s;
    geo.ox = (W - geo.dw) / 2; geo.oy = (H - geo.dh) / 2;
  }
  function lmX(lm) { return W - (geo.ox + lm.x * geo.dw); }
  function lmY(lm) { return geo.oy + lm.y * geo.dh; }

  /* ---------- erase / fog ---------- */
  function eraseStamp(x, y, r, a) {
    var g = fogCtx.createRadialGradient(px(x), px(y), 0, px(x), px(y), px(r));
    g.addColorStop(0, 'rgba(0,0,0,' + a + ')');
    g.addColorStop(0.62, 'rgba(0,0,0,' + (a * 0.78) + ')');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    fogCtx.globalCompositeOperation = 'destination-out';
    fogCtx.fillStyle = g;
    fogCtx.beginPath();
    fogCtx.arc(px(x), px(y), px(r), 0, Math.PI * 2);
    fogCtx.fill();
    fogCtx.globalCompositeOperation = 'source-over';
  }
  var lastMidX = 0, lastMidY = 0, hasMid = false;
  function penStroke(x0, y0, x1, y1, r) {
    var mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
    fogCtx.globalCompositeOperation = 'destination-out';
    fogCtx.strokeStyle = 'rgba(0,0,0,1)';
    fogCtx.lineCap = 'round'; fogCtx.lineJoin = 'round';
    fogCtx.lineWidth = px(r * 2);
    fogCtx.beginPath();
    if (hasMid) fogCtx.moveTo(px(lastMidX), px(lastMidY));
    else fogCtx.moveTo(px(x0), px(y0));
    fogCtx.quadraticCurveTo(px(x0), px(y0), px(mx), px(my));
    fogCtx.stroke();
    fogCtx.globalCompositeOperation = 'source-over';
    lastMidX = mx; lastMidY = my; hasMid = true;
  }
  function addFog(amount) {
    var cx = hasFace ? fogCx : W / 2;
    var cy = (hasFace ? fogCy : H * 0.55) + Math.min(W, H) * 0.05;
    var reach = Math.min(W, H) * 0.43;
    for (var i = 0; i < 12; i++) {
      var ang = Math.random() * Math.PI * 2;
      var rad = Math.pow(Math.random(), 0.65) * reach;
      var bx = cx + Math.cos(ang) * rad * 1.45, by = cy + Math.sin(ang) * rad;
      var br = reach * (0.18 + Math.random() * 0.26);
      fogCtx.filter = 'blur(' + (px(br) * 0.6).toFixed(1) + 'px)';
      fogCtx.fillStyle = 'rgba(255,255,255,' + (0.36 * amount).toFixed(3) + ')';
      fogCtx.beginPath();
      fogCtx.arc(px(bx), px(by), px(br), 0, Math.PI * 2);
      fogCtx.fill();
    }
    fogCtx.filter = 'none';
  }

  /* ---------- mic ---------- */
  function startMic() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
    navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      video: false
    }).then(function (s) {
      if (!on) { s.getTracks().forEach(function (t) { t.stop(); }); return; }
      micStream = s;
      var ACtor = global.AudioContext || global.webkitAudioContext;
      if (!ACtor) return;
      AC = new ACtor();
      var src = AC.createMediaStreamSource(s);
      analyser = AC.createAnalyser();
      analyser.fftSize = 1024; analyser.smoothingTimeConstant = 0.25;
      src.connect(analyser);
      audioData = new Float32Array(analyser.fftSize);
    }).catch(function () {
      setTip('🎤 Mic bị chặn — giữ nút 💨 để làm mờ thay cho thổi');
    });
  }
  function micLevel() {
    if (!analyser) return 0;
    analyser.getFloatTimeDomainData(audioData);
    var s = 0;
    for (var i = 0; i < audioData.length; i++) s += audioData[i] * audioData[i];
    return Math.sqrt(s / audioData.length);
  }

  /* ---------- mediapipe (tải khi bật lần đầu) ---------- */
  var libsPromise = null;
  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = src; s.crossOrigin = 'anonymous';
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  function loadLibs() {
    if (libsPromise) return libsPromise;
    libsPromise = Promise.all([
      global.Hands ? Promise.resolve() : loadScript(HANDS_URL + 'hands.js'),
      global.FaceDetection ? Promise.resolve() : loadScript(FACE_URL + 'face_detection.js')
    ]);
    return libsPromise;
  }
  function setupTrackers() {
    loadLibs().then(function () {
      if (!on) return;
      if (global.Hands && !hands) {
        hands = new global.Hands({ locateFile: function (f) { return HANDS_URL + f; } });
        hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.6, minTrackingConfidence: 0.6 });
        hands.onResults(function (r) {
          if (r.multiHandLandmarks && r.multiHandLandmarks.length) { hand = r.multiHandLandmarks[0]; lastSeen = performance.now(); }
          else hand = null;
        });
      }
      if (global.FaceDetection && !face) {
        face = new global.FaceDetection({ locateFile: function (f) { return FACE_URL + f; } });
        face.setOptions({ model: 'short', minDetectionConfidence: 0.5 });
        face.onResults(function (r) {
          if (!r.detections || !r.detections.length) return;
          var d = r.detections[0], kp = d.landmarks || d.keypoints, mx, my;
          if (kp && kp.length >= 4) { mx = lmX(kp[3]); my = lmY(kp[3]); }
          else { var bb = d.boundingBox; mx = lmX({ x: bb.xCenter }); my = lmY({ y: bb.yCenter + bb.height * 0.22 }); }
          if (!hasFace) { fogCx = mx; fogCy = my; hasFace = true; }
          else { fogCx += (mx - fogCx) * 0.4; fogCy += (my - fogCy) * 0.4; }
        });
      }
    }).catch(function () {
      setTip('✋ Chưa tải được phần bắt bàn tay — dùng chuột / ngón tay vẽ lên camera nhé');
    });
  }

  /* ---------- gestures ---------- */
  function d3(a, b) {
    var dx = a.x - b.x, dy = a.y - b.y, dz = (a.z || 0) - (b.z || 0);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  function handSize(lm) {
    var a = Math.hypot(lmX(lm[5]) - lmX(lm[17]), lmY(lm[5]) - lmY(lm[17]));
    var b = Math.hypot(lmX(lm[0]) - lmX(lm[9]), lmY(lm[0]) - lmY(lm[9]));
    return Math.max(a, b);
  }
  /* nắm tay thật: cả 4 đầu ngón cuộn sát vào lòng bàn tay */
  function isFist(lm) {
    var tips = [8, 12, 16, 20], pips = [6, 10, 14, 18];
    for (var i = 0; i < 4; i++) {
      if (d3(lm[tips[i]], lm[0]) > d3(lm[pips[i]], lm[0]) * 0.92) return false;
    }
    return true;
  }
  function indexOut(lm) { return d3(lm[8], lm[0]) > d3(lm[6], lm[0]) * 1.05; }

  /* ---------- loop ---------- */
  function loop() {
    if (!on) return;
    raf = requestAnimationFrame(loop);
    frameNo++;
    resize();
    updateGeo();
    var now = performance.now();
    var ready = video && video.readyState >= 2;

    if (ready && hands && !busy) {
      busy = true;
      hands.send({ image: video }).then(function () { busy = false; }, function () { busy = false; });
    }
    if (ready && face && !faceBusy && frameNo % 5 === 0) {
      faceBusy = true;
      face.send({ image: video }).then(function () { faceBusy = false; }, function () { faceBusy = false; });
    }

    var drawing = ptDown, wiping = false, showStar = false;

    if (hand) {
      var lm = hand, hs = handSize(lm) || 1;
      var pinch = Math.hypot(lmX(lm[4]) - lmX(lm[8]), lmY(lm[4]) - lmY(lm[8])) / hs;
      var tx = (lmX(lm[4]) + lmX(lm[8])) / 2, ty = (lmY(lm[4]) + lmY(lm[8])) / 2;

      if (!penDown && isFist(lm)) {
        var r = 1.3 * hs;
        var wx = (lmX(lm[0]) + lmX(lm[9])) / 2, wy = (lmY(lm[0]) + lmY(lm[9])) / 2;
        if (hasWipe) {
          var dx = wx - lastWipeX, dy = wy - lastWipeY, dd = Math.hypot(dx, dy);
          if (dd > Math.min(W, H) * 0.30) eraseStamp(wx, wy, r, 0.34);
          else {
            var n = Math.min(40, Math.max(1, Math.ceil(dd / Math.max(1, r * 0.5))));
            for (var i = 1; i <= n; i++) eraseStamp(lastWipeX + dx * i / n, lastWipeY + dy * i / n, r, 0.34);
          }
        } else eraseStamp(wx, wy, r, 0.34);
        lastWipeX = wx; lastWipeY = wy; hasWipe = true;
        wiping = true;
      } else {
        hasWipe = false;
        if (!penDown && pinch < 0.22 && indexOut(lm)) { penDown = true; hasPt = false; hasMid = false; }
        else if (penDown && pinch > 0.38) { penDown = false; hasPt = false; hasMid = false; }

        if (!hasPt) { smX = tx; smY = ty; brX = tx; brY = ty; starX = tx; starY = ty; }
        smX += (tx - smX) * 0.45; smY += (ty - smY) * 0.45;
        starX += (smX - starX) * 0.55; starY += (smY - starY) * 0.55;
        var nbx = brX + (smX - brX) * 0.22, nby = brY + (smY - brY) * 0.22;
        if (penDown) {
          showStar = true;
          if (!hasPt) { eraseStamp(nbx, nby, brushR, 0.95); drawing = true; }
          else if (Math.hypot(nbx - brX, nby - brY) > W * 0.0006) { penStroke(brX, brY, nbx, nby, brushR); drawing = true; }
          hasPt = true;
        }
        brX = nbx; brY = nby;
      }
      releaseFrames = 0;
    } else {
      releaseFrames++;
      if (now - lastSeen > 250 && releaseFrames >= 2) { penDown = false; hasPt = false; hasWipe = false; hasMid = false; }
      if (penDown) showStar = true;
    }

    /* thở */
    var lvl = micLevel();
    if (lvl < noiseFloor) noiseFloor += (lvl - noiseFloor) * 0.05;
    else noiseFloor += (lvl - noiseFloor) * 0.0008;
    var str = analyser ? Math.max(0, Math.min(1, (lvl - (noiseFloor + 0.0025)) / 0.0005)) : 0;
    breath += (str - breath) * 0.35;
    var amt = holdBlow ? 1 : breath;
    if (!drawing && !wiping && amt > 0.05 && frameNo % 2 === 0) addFog(amt);

    /* vẽ: chỉ lớp sương (camera thật vẫn là #liveVideo bên dưới) */
    var pw = view.width, ph = view.height;
    vctx.setTransform(1, 0, 0, 1, 0, 0);
    vctx.clearRect(0, 0, pw, ph);
    if (ready) {
      frostCtx.setTransform(1, 0, 0, 1, 0, 0);
      frostCtx.globalCompositeOperation = 'source-over';
      frostCtx.clearRect(0, 0, pw, ph);
      frostCtx.save();
      frostCtx.filter = 'blur(' + px(Math.max(8, Math.min(18, W / 40))).toFixed(1) + 'px) brightness(1.18)';
      frostCtx.translate(pw, 0); frostCtx.scale(-1, 1);
      frostCtx.drawImage(video, px(geo.ox), px(geo.oy), px(geo.dw), px(geo.dh));
      frostCtx.restore();
      frostCtx.filter = 'none';
      frostCtx.fillStyle = 'rgba(242,238,231,0.30)';
      frostCtx.fillRect(0, 0, pw, ph);
      frostCtx.fillStyle = 'rgba(255,255,255,0.62)';
      frostCtx.fillRect(0, 0, pw, ph);
      frostCtx.globalCompositeOperation = 'destination-in';
      frostCtx.drawImage(fogCv, 0, 0);
      frostCtx.globalCompositeOperation = 'source-over';
      vctx.drawImage(frostCv, 0, 0);
    }
    if (showStar) {
      var g = vctx.createRadialGradient(px(starX), px(starY), 0, px(starX), px(starY), px(10));
      g.addColorStop(0, 'rgba(255,255,255,0.95)');
      g.addColorStop(0.4, 'rgba(220,238,255,0.4)');
      g.addColorStop(1, 'rgba(220,238,255,0)');
      vctx.fillStyle = g;
      vctx.beginPath(); vctx.arc(px(starX), px(starY), px(10), 0, Math.PI * 2); vctx.fill();
    }
  }

  /* ---------- UI ---------- */
  function setTip(t) { if (tipEl) tipEl.textContent = t; }
  function buildUI() {
    view = document.createElement('canvas');
    view.className = 'fog-view';
    vctx = view.getContext('2d');
    fogCv = document.createElement('canvas'); fogCtx = fogCv.getContext('2d');
    frostCv = document.createElement('canvas'); frostCtx = frostCv.getContext('2d');
    fogCv.width = 1; fogCv.height = 1;

    ui = document.createElement('div');
    ui.className = 'fog-ui';
    ui.innerHTML =
      '<button type="button" class="fpill fog-off">✕ OFF</button>' +
      '<div class="fpill fog-tip">🤏 chụm ngón để vẽ · ✊ nắm tay để lau · 😮 thổi vào mic cho mờ</div>' +
      '<div class="fpill fog-brush"><span>brush</span><input type="range" min="2" max="16" step="1" value="' + brushR + '"></div>' +
      '<div class="fpill fog-tools"><button type="button" class="fog-blow" title="Giữ để làm mờ">💨 giữ</button>' +
      '<button type="button" class="fog-clear" title="Phủ mờ lại">🧽</button></div>';
    tipEl = ui.querySelector('.fog-tip');
    brushInput = ui.querySelector('.fog-brush input');
    brushInput.addEventListener('input', function () { brushR = +brushInput.value; });
    ui.querySelector('.fog-off').addEventListener('click', function (e) { e.stopPropagation(); setOn(false); });
    ui.querySelector('.fog-clear').addEventListener('click', function (e) { e.stopPropagation(); resetFog(); });
    var blow = ui.querySelector('.fog-blow');
    function bOn(e) { e.preventDefault(); holdBlow = true; blow.classList.add('held'); }
    function bOff() { holdBlow = false; blow.classList.remove('held'); }
    blow.addEventListener('pointerdown', bOn);
    blow.addEventListener('pointerup', bOff);
    blow.addEventListener('pointerleave', bOff);
    blow.addEventListener('pointercancel', bOff);

    view.addEventListener('pointerdown', function (e) {
      var r = view.getBoundingClientRect();
      ptDown = true; ptX = e.clientX - r.left; ptY = e.clientY - r.top; hasMid = false;
      eraseStamp(ptX, ptY, brushR, 0.95);
      try { view.setPointerCapture(e.pointerId); } catch (err) { }
    });
    view.addEventListener('pointermove', function (e) {
      if (!ptDown) return;
      var r = view.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      penStroke(ptX, ptY, x, y, brushR);
      ptX = x; ptY = y;
    });
    function up() { ptDown = false; hasMid = false; }
    view.addEventListener('pointerup', up);
    view.addEventListener('pointercancel', up);
  }

  function setOn(v) {
    if (v === on) return;
    on = v;
    var btn = document.getElementById('fogToggleBtn');
    if (on) {
      host = document.querySelector('.screen-container');
      video = document.getElementById('liveVideo');
      if (!host || !video) { on = false; return; }
      injectCSS();
      if (!view) buildUI();
      W = 0; H = 0;
      host.appendChild(view);
      host.appendChild(ui);
      fogCv.width = 1;
      resize();
      resetFog();
      hasFace = false; hand = null; penDown = false; hasPt = false; hasWipe = false;
      startMic();
      setupTrackers();
      raf = requestAnimationFrame(loop);
      if (btn) { btn.classList.add('is-on'); var s = btn.querySelector('span'); if (s) s.textContent = 'Gương Mờ: ON'; }
    } else {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (view && view.parentNode) view.parentNode.removeChild(view);
      if (ui && ui.parentNode) ui.parentNode.removeChild(ui);
      if (micStream) { micStream.getTracks().forEach(function (t) { t.stop(); }); micStream = null; }
      if (AC && AC.close) { try { AC.close(); } catch (e) { } }
      AC = null; analyser = null;
      hand = null; penDown = false; ptDown = false; holdBlow = false;
      if (btn) { btn.classList.remove('is-on'); var s2 = btn.querySelector('span'); if (s2) s2.textContent = 'Gương Mờ'; }
    }
  }

  global.toggleFogOverlay = function () { setOn(!on); };
  global.setFogOverlay = setOn;
  global.isFogOverlayOn = function () { return on; };
})(window);
