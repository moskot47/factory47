(() => {
  "use strict";

  const canvas = document.getElementById("fireplace");
  const ctx = canvas.getContext("2d");
  let W = 0;
  let H = 0;
  let dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  // Geometry of the fire base, recomputed on resize.
  function fireBase() {
    return {
      x: W / 2,
      y: H * 0.8,
      width: Math.min(W * 0.5, 540),
    };
  }

  // Flickering intensity driven by layered sines — gives the fire its life.
  let flicker = 1;
  function updateFlicker(t) {
    const v =
      0.5 * Math.sin(t * 0.011) +
      0.3 * Math.sin(t * 0.027) +
      0.2 * Math.sin(t * 0.063);
    flicker = 0.82 + 0.18 * (v * 0.5 + 0.5);
  }

  const particles = [];
  const embers = [];
  const MAX_PARTICLES = 340;

  function spawnParticle() {
    const base = fireBase();
    particles.push({
      x: base.x + (Math.random() - 0.5) * base.width,
      y: base.y + Math.random() * 12,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(0.8 + Math.random() * 1.7),
      life: 1,
      decay: 0.006 + Math.random() * 0.008,
      size: 18 + Math.random() * 28,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.02 + Math.random() * 0.04,
    });
  }

  function spawnEmber() {
    const base = fireBase();
    embers.push({
      x: base.x + (Math.random() - 0.5) * base.width * 0.8,
      y: base.y,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(1 + Math.random() * 2.2),
      life: 1,
      decay: 0.004 + Math.random() * 0.006,
      size: 1 + Math.random() * 2,
    });
  }

  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.wobble += p.wobbleSpeed;
      p.x += p.vx + Math.sin(p.wobble) * 0.3;
      p.y += p.vy;
      p.vy *= 0.99;
      p.size *= 0.985;
      p.life -= p.decay;
      if (p.life <= 0 || p.size < 1) particles.splice(i, 1);
    }
  }

  function updateEmbers() {
    for (let i = embers.length - 1; i >= 0; i--) {
      const e = embers[i];
      e.x += e.vx;
      e.y += e.vy;
      e.vy *= 0.995;
      e.life -= e.decay;
      if (e.life <= 0) embers.splice(i, 1);
    }
  }

  function drawBackground() {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#0b0608");
    g.addColorStop(0.6, "#120a06");
    g.addColorStop(1, "#1c0e05");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Warm glow cast on the room by the fire.
    const base = fireBase();
    const glowR = base.width * 1.7 * flicker;
    const glow = ctx.createRadialGradient(base.x, base.y, 0, base.x, base.y, glowR);
    glow.addColorStop(0, `rgba(255, 140, 40, ${0.26 * flicker})`);
    glow.addColorStop(0.4, `rgba(255, 90, 20, ${0.12 * flicker})`);
    glow.addColorStop(1, "rgba(255, 60, 10, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
  }

  function drawLog(x, y, w, h, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
    g.addColorStop(0, "#3a1d0c");
    g.addColorStop(0.5, "#241008");
    g.addColorStop(1, "#120804");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, h / 2);
    ctx.fill();
    // glowing top edge where embers sit
    ctx.fillStyle = `rgba(255, 120, 30, ${0.5 * flicker})`;
    ctx.fillRect(-w / 2, -h / 2, w, 3);
    ctx.restore();
  }

  function drawLogs() {
    const base = fireBase();
    ctx.save();
    ctx.translate(base.x, base.y + 16);
    drawLog(-62, -10, 150, 22, -0.2);
    drawLog(-52, 10, 138, 20, 0.16);
    ctx.restore();
  }

  function drawParticles() {
    ctx.globalCompositeOperation = "lighter";
    for (const p of particles) {
      const life = p.life;
      const hue = 50 * life; // yellow (50) -> red (0)
      const light = 60 * life + 10;
      const alpha = life * 0.5;
      const r = p.size * (0.6 + 0.4 * flicker);
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      grad.addColorStop(0, `hsla(${hue}, 100%, ${light}%, ${alpha})`);
      grad.addColorStop(1, `hsla(${hue}, 100%, ${light}%, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  function drawEmbers() {
    ctx.globalCompositeOperation = "lighter";
    for (const e of embers) {
      const a = e.life * 0.9;
      ctx.fillStyle = `rgba(255, ${180 + Math.floor(60 * e.life)}, 80, ${a})`;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  let last = performance.now();
  function frame(now) {
    last = now;
    updateFlicker(now);
    drawBackground();
    drawLogs();

    const spawnCount = Math.floor(3 + flicker * 3);
    for (let i = 0; i < spawnCount; i++) {
      if (particles.length < MAX_PARTICLES) spawnParticle();
    }
    if (Math.random() < 0.3) spawnEmber();

    updateParticles();
    updateEmbers();
    drawParticles();
    drawEmbers();

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // --- Sound toggle (browsers block autoplay until a user gesture) ---
  const audio = document.getElementById("fire-audio");
  const btn = document.getElementById("sound-toggle");
  const icon = btn.querySelector(".icon");
  const label = btn.querySelector(".label");
  let soundOn = false;

  btn.addEventListener("click", () => {
    soundOn = !soundOn;
    if (soundOn) {
      audio.volume = 0.6;
      audio.play().catch(() => {});
      btn.classList.add("on");
      btn.setAttribute("aria-pressed", "true");
      icon.textContent = "🔊";
      label.textContent = "Mute";
    } else {
      audio.pause();
      btn.classList.remove("on");
      btn.setAttribute("aria-pressed", "false");
      icon.textContent = "🔇";
      label.textContent = "Enable sound";
    }
  });
})();
