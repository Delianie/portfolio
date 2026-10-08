/*
 * footer-game.js
 * Endloses Mini-Game im Footer: Ein Pixel-Schaf läuft über Hügel (nur 1-px-Umriss)
 * und will einen Schmetterling fangen. Tippen/Klicken auf die Stage = Springen.
 * Kein Game Over, der Score zählt endlos hoch.
 *
 * Einbinden:
 *   <span data-footer-score>0000</span>
 *   <canvas data-footer-game tabindex="0" role="img"
 *           aria-label="Ein Pixel-Schaf läuft über Hügel und jagt einem Schmetterling nach. Tippen lässt es springen."></canvas>
 *   <script src="assets/js/footer-game.js" defer></script>
 *
 * Das Canvas braucht per CSS: display:block; width:100%; height:104px; touch-action:manipulation; cursor:pointer;
 * Farbe: nimmt die CSS-Variable --ink von :root (Fallback #111).
 *
 * Tastatur: Leertaste / Pfeil hoch springen nur, wenn die Stage Fokus hat (Tab).
 * So bleibt das normale Scrollen mit der Leertaste auf der restlichen Seite erhalten.
 */
(function () {
  'use strict';

  /* ---- Einstellungen zum Abstimmen ---- */
  var CONFIG = {
    speed: 70,        // Laufgeschwindigkeit in px pro Sekunde
    jumpTime: 1.1,    // Dauer eines Sprungs in Sekunden (länger = schwebender)
    jumpHeight: 34,   // Sprunghöhe in px
    startScore: 0     // Anzeige beim Start (im Figma-Design steht 42 nur als Beispiel)
  };

  var STAGE_H = 104;   // Höhe der Stage in px (entspricht Figma)
  var GROUND_Y = 96;   // y-Position der Grundlinie in der Stage
  var COL_W = 28;      // Breite einer Gelände-Spalte in px
  var SHEEP_PX = 3;    // Pixelgrösse Schaf
  var BFLY_PX = 2;     // Pixelgrösse Schmetterling

  /* ---- Pixel-Grafiken (X = gefüllt) ---- */
  var BODY = ['..XXXXXX.....', '.XXXXXXXXX.XX', 'XXXXXXXXXXXXX', 'XXXXXXXXXXX.X', '.XXXXXXXXXXX.', '..XXXXXXXX...'];
  var LEGS_A = ['..X.X...X.X..', '..X.X...X.X..'];
  var LEGS_B = ['...X.X.X.X...', '...X.X.X.X...'];
  var LEGS_AIR = ['.X..X...X..X.', '.X..X...X..X.'];
  var BF_OPEN = ['XX..X..XX', 'XXX.X.XXX', 'XXXXXXXXX', '.XXXXXXX.', '..XX.XX..', '..X...X..'];
  var BF_HALF = ['....X....', '..X.X.X..', '.XXXXXXX.', '..XXXXX..', '...X.X...', '...X.X...'];

  /* Gelände-Formen: Höhen in px je Spalte. Zwischen den Formen liegen 2-4 flache Spalten. */
  var SHAPES = [[0, 0, 0], [0, 0], [6, 6], [6, 12, 12, 6], [6, 6, 12, 6, 6], [12, 12], [6, 12, 18, 12, 6], [6, 6]];

  function init(cv) {
    var ctx = cv.getContext('2d');
    var scoreEl = document.querySelector('[data-footer-score]');
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var ink = '#111', W = 343, dpr = 1;
    var running = !reduced, visible = true;
    var cols = [], base = 0;
    var t = 0, scroll = 0, score = CONFIG.startScore, hy = 0, vy = 0, air = false, legT = 0, last = 0, shown = '';

    function seed() { cols = []; base = 0; for (var i = 0; i < 12; i++) cols.push(0); }

    function extend(minIdx) {
      while (base + cols.length < minIdx) {
        var n = 2 + (Math.random() * 3 | 0), i;
        for (i = 0; i < n; i++) cols.push(0);
        var s = SHAPES[Math.random() * SHAPES.length | 0];
        for (i = 0; i < s.length; i++) cols.push(s[i]);
      }
    }

    function heightAt(x) {
      var i = Math.floor(x / COL_W) - base;
      return i >= 0 && i < cols.length ? cols[i] : 0;
    }

    function jump() {
      if (!running) running = true;
      if (!air) { air = true; vy = 4 * CONFIG.jumpHeight / CONFIG.jumpTime; }
    }

    function showScore() {
      if (!scoreEl) return;
      var s = String(Math.floor(score));
      while (s.length < 4) s = '0' + s;
      if (s !== shown) { shown = s; scoreEl.textContent = s; }
    }

    function step(dt) {
      t += dt;
      scroll += CONFIG.speed * dt;
      score += CONFIG.speed * dt / 12;
      extend(Math.floor((scroll + W) / COL_W) + 8);
      var drop = Math.floor(scroll / COL_W) - base - 6;
      if (drop >= 8) { cols.splice(0, drop); base += drop; }

      var sx = Math.round(W * 0.3);
      var target = heightAt(scroll + sx + 19);
      if (air) {
        var g = 8 * CONFIG.jumpHeight / (CONFIG.jumpTime * CONFIG.jumpTime);
        vy -= g * dt;
        hy += vy * dt;
        if (hy < target) { hy = target; if (vy < 0) { air = false; vy = 0; } }
      } else {
        hy += (target - hy) * Math.min(1, dt * 18);
        if (Math.abs(target - hy) < 0.4) hy = target;
      }
      legT += dt * CONFIG.speed / 70;
      showScore();
    }

    function rows(r, p, x, y) {
      for (var j = 0; j < r.length; j++) {
        var row = r[j], i = 0;
        while (i < row.length) {
          if (row.charAt(i) === 'X') {
            var e = i;
            while (e < row.length && row.charAt(e) === 'X') e++;
            ctx.fillRect(x + i * p, y + j * p, (e - i) * p, p);
            i = e;
          } else i++;
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, STAGE_H);
      ctx.fillStyle = ink;

      /* Hügel als 1-px-Umriss */
      var i0 = Math.floor(scroll / COL_W), prev = heightAt((i0 - 1) * COL_W);
      for (var i = i0; ; i++) {
        var xl = Math.round(i * COL_W - scroll), xr = Math.round((i + 1) * COL_W - scroll);
        if (xl > W) break;
        var h = heightAt(i * COL_W);
        ctx.fillRect(xl, GROUND_Y - h, xr - xl, 1);
        if (h !== prev) ctx.fillRect(xl, GROUND_Y - Math.max(h, prev), 1, Math.abs(h - prev) + 1);
        prev = h;
      }

      /* Schaf */
      var sx = Math.round(W * 0.3), top = GROUND_Y - Math.round(hy) - 24;
      rows(BODY, SHEEP_PX, sx, top);
      var legs = air ? LEGS_AIR : (Math.floor(legT * 5) % 2 ? LEGS_B : LEGS_A);
      rows(legs, SHEEP_PX, sx, top + 18);

      /* Schmetterling: bleibt vor dem Schaf und weicht nach oben aus, wenn es springt */
      var bx = Math.round(sx + 92 + 16 * Math.sin(t * 1.1));
      var by = Math.max(4, Math.round(24 + 6 * Math.sin(t * 1.9) - Math.min(16, hy * 0.3)));
      rows(Math.floor(t * 7) % 2 ? BF_HALF : BF_OPEN, BFLY_PX, bx, by);
    }

    function frame(ts) {
      if (!last) last = ts;
      var dt = Math.min(0.05, (ts - last) / 1000);
      last = ts;
      if (visible) { if (running) step(dt); draw(); }
      requestAnimationFrame(frame);
    }

    function fit() {
      var r = cv.getBoundingClientRect();
      W = Math.max(200, Math.round(r.width));
      dpr = window.devicePixelRatio || 1;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(STAGE_H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
      draw();
    }

    function readInk() {
      var v = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim();
      ink = v || '#111';
      draw();
    }

    cv.addEventListener('pointerdown', function (e) { e.preventDefault(); jump(); });
    cv.addEventListener('keydown', function (e) {
      if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump(); }
    });

    if (window.ResizeObserver) new ResizeObserver(fit).observe(cv);
    else window.addEventListener('resize', fit);
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; }).observe(cv);
    }
    if (window.MutationObserver) {
      new MutationObserver(readInk).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }

    seed();
    showScore();
    readInk();
    fit();
    requestAnimationFrame(frame);
  }

  function boot() {
    var cv = document.querySelector('canvas[data-footer-game]');
    if (cv && cv.getContext) init(cv);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
