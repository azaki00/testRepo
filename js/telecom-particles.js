(function() {
  const container = document.getElementById('netBox');
  const svg = document.getElementById('netSvg');
  const svgNS = 'http://www.w3.org/2000/svg';

  const PARTICLE_COUNT = 50;
  const LINK_DIST = 130;
  const MOUSE_RADIUS = 170;
  const MAX_LINKS = 140;

  let width = 0, height = 0;
  let particles = [];
  let linkPool = [];
  let mouseLinkPool = [];
  let mouse = { x: 0, y: 0, active: false };

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function resize() {
    const rect = container.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
  }
  window.addEventListener('resize', resize);
  resize();

  const defs = document.createElementNS(svgNS, 'defs');
  defs.innerHTML =
    '<radialGradient id="pGlow" cx="50%" cy="50%" r="50%">' +
      '<stop offset="0%" stop-color="rgba(155,110,255,0.55)"/>' +
      '<stop offset="100%" stop-color="rgba(155,110,255,0)"/>' +
    '</radialGradient>' +
    '<radialGradient id="mGlow" cx="50%" cy="50%" r="50%">' +
      '<stop offset="0%" stop-color="rgba(155,110,255,0.10)"/>' +
      '<stop offset="100%" stop-color="rgba(155,110,255,0)"/>' +
    '</radialGradient>';
  svg.appendChild(defs);

  const linkGroup = document.createElementNS(svgNS, 'g');
  svg.appendChild(linkGroup);

  const mouseGlow = document.createElementNS(svgNS, 'circle');
  mouseGlow.setAttribute('r', MOUSE_RADIUS);
  mouseGlow.setAttribute('fill', 'url(#mGlow)');
  mouseGlow.setAttribute('opacity', '0');
  svg.appendChild(mouseGlow);

  const particleGroup = document.createElementNS(svgNS, 'g');
  svg.appendChild(particleGroup);

  function makeLine() {
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('stroke', '#8c64f0');
    line.setAttribute('stroke-width', '0.6');
    line.setAttribute('stroke-opacity', '0');
    linkGroup.appendChild(line);
    return line;
  }
  for (let i = 0; i < MAX_LINKS; i++) linkPool.push(makeLine());

  function makeMouseLine() {
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('stroke', '#be96ff');
    line.setAttribute('stroke-width', '0.8');
    line.setAttribute('stroke-opacity', '0');
    linkGroup.appendChild(line);
    return line;
  }
  for (let i = 0; i < PARTICLE_COUNT; i++) mouseLinkPool.push(makeMouseLine());

  class Particle {
    constructor() {
      this.x = rand(0, width);
      this.y = rand(0, height);
      this.vx = rand(-0.2, 0.2);
      this.vy = rand(-0.2, 0.2);
      this.pulse = rand(0, Math.PI * 2);
      this.pulseSpeed = rand(0.01, 0.03);
      this.baseR = rand(1.2, 2.2);

      this.g = document.createElementNS(svgNS, 'g');

      this.glow = document.createElementNS(svgNS, 'circle');
      this.glow.setAttribute('r', 9);
      this.glow.setAttribute('fill', 'url(#pGlow)');

      this.core = document.createElementNS(svgNS, 'circle');
      this.core.setAttribute('r', this.baseR);
      this.core.setAttribute('fill', '#c8afff');

      this.g.appendChild(this.glow);
      this.g.appendChild(this.core);
      particleGroup.appendChild(this.g);
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += this.pulseSpeed;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.active) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 2;
          this.y += Math.sin(angle) * force * 2;
        }
      }
    }

    draw() {
      const glowAmt = 0.5 + Math.sin(this.pulse) * 0.5;
      this.g.setAttribute('transform', `translate(${this.x},${this.y})`);
      this.core.setAttribute('fill-opacity', 0.7 + glowAmt * 0.3);
      this.glow.setAttribute('fill-opacity', 0.4 + glowAmt * 0.5);
    }
  }

  function init() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
  }
  init();

  function updateLinks() {
    let linkIndex = 0;
    for (let i = 0; i < particles.length && linkIndex < MAX_LINKS; i++) {
      for (let j = i + 1; j < particles.length && linkIndex < MAX_LINKS; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          const line = linkPool[linkIndex++];
          line.setAttribute('x1', a.x);
          line.setAttribute('y1', a.y);
          line.setAttribute('x2', b.x);
          line.setAttribute('y2', b.y);
          line.setAttribute('stroke-opacity', (1 - dist / LINK_DIST) * 0.5);
        }
      }
    }
    for (let k = linkIndex; k < MAX_LINKS; k++) {
      linkPool[k].setAttribute('stroke-opacity', 0);
    }

    let mIndex = 0;
    if (mouse.active) {
      for (let i = 0; i < particles.length; i++) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const line = mouseLinkPool[mIndex++];
          line.setAttribute('x1', particles[i].x);
          line.setAttribute('y1', particles[i].y);
          line.setAttribute('x2', mouse.x);
          line.setAttribute('y2', mouse.y);
          line.setAttribute('stroke-opacity', (1 - dist / MOUSE_RADIUS) * 0.8);
        }
      }
    }
    for (let k = mIndex; k < mouseLinkPool.length; k++) {
      mouseLinkPool[k].setAttribute('stroke-opacity', 0);
    }
  }

  function animate() {
    if (mouse.active) {
      const pulse = 0.5 + Math.sin(Date.now() * 0.004) * 0.5;
      mouseGlow.setAttribute('cx', mouse.x);
      mouseGlow.setAttribute('cy', mouse.y);
      mouseGlow.setAttribute('opacity', 0.5 + pulse * 0.3);
    } else {
      mouseGlow.setAttribute('opacity', 0);
    }

    particles.forEach(p => { p.update(); p.draw(); });
    updateLinks();

    requestAnimationFrame(animate);
  }
  animate();

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  container.addEventListener('mouseleave', () => {
    mouse.active = false;
  });
})();
