/* =============================================
   AGNIB SIKDER — Portfolio Script
   Professional Edition
   ============================================= */
'use strict';

/* ── Cursor glow ── */
(function () {
  const el = document.querySelector('.cursor-glow');
  if (!el || window.innerWidth < 768) return;
  let raf;
  document.addEventListener('mousemove', e => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      el.style.left = e.clientX + 'px';
      el.style.top  = e.clientY + 'px';
    });
  });
})();

/* ── Particle canvas ── */
(function () {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function mkPt() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 1.2 + .4,
      vx: (Math.random() - .5) * .22,
      vy: (Math.random() - .5) * .22,
      a:  Math.random() * .3 + .06,
    };
  }

  function init() {
    resize();
    pts = Array.from({ length: 38 }, mkPt);
    window.addEventListener('resize', () => { resize(); pts = Array.from({ length: 38 }, mkPt); }, { passive: true });
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(96,165,250,${p.a})`;
      ctx.fill();
    });

    // Draw faint connection lines
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(96,165,250,${0.04 * (1 - d / 120)})`;
          ctx.lineWidth = .6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  init();
})();

/* ── Navbar ── */
(function () {
  const nav    = document.getElementById('nav');
  const toggle = document.getElementById('n-toggle');
  const menu   = document.getElementById('n-menu');
  const links  = menu ? menu.querySelectorAll('a[href^="#"]') : [];

  window.addEventListener('scroll', () => {
    nav.classList.toggle('stuck', window.scrollY > 30);
    updateActive();
  }, { passive: true });

  function updateActive() {
    const sections = document.querySelectorAll('section[id]');
    let cur = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 130) cur = s.id;
    });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  }

  if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.toggle('open'));
    links.forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
  }
})();

/* ── Scroll Reveal ── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: .1 });
  els.forEach(el => io.observe(el));
})();

/* ── Typed text ── */
(function () {
  const el     = document.getElementById('typed-text');
  if (!el) return;
  const roles  = ['Full-Stack Developer', 'AI Integration Builder', 'MCA Student @ RCCIIT', 'Node.js & WebSocket Dev'];
  let ri = 0, ci = 0, del = false;

  function tick() {
    const cur = roles[ri];
    el.textContent = del ? cur.slice(0, --ci) : cur.slice(0, ++ci);
    if (!del && ci === cur.length) { del = true; setTimeout(tick, 1800); return; }
    if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; }
    setTimeout(tick, del ? 38 : 74);
  }
  tick();
})();

/* ── Counter animation ── */
(function () {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const tgt = +el.dataset.count;
      const sfx = el.dataset.suffix || '';
      let   s   = 0;
      const start = performance.now();
      const dur   = 1200;
      const fn    = ts => {
        const p = Math.min((ts - start) / dur, 1);
        const v = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(v * tgt) + sfx;
        if (p < 1) requestAnimationFrame(fn);
      };
      requestAnimationFrame(fn);
      io.unobserve(el);
    });
  }, { threshold: .5 });
  els.forEach(el => io.observe(el));
})();

/* ── 3-D card tilt ── */
(function () {
  const cards = document.querySelectorAll('.proj-card');
  cards.forEach(c => {
    c.addEventListener('mousemove', e => {
      const r  = c.getBoundingClientRect();
      const x  = (e.clientX - r.left) / r.width  - .5;
      const y  = (e.clientY - r.top)  / r.height - .5;
      c.style.transition = 'transform .08s ease, box-shadow .08s ease, border-color .35s';
      c.style.transform  = `perspective(700px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateY(-7px)`;
    });
    c.addEventListener('mouseleave', () => {
      c.style.transition = 'transform .5s ease, box-shadow .35s, border-color .35s';
      c.style.transform  = '';
    });
  });
})();

/* ── Skill chip accent colors on hover ── */
(function () {
  const map = {
    'Java':'.f89820', 'JavaScript':'#f7df1e', 'C':'#00599c', 'C#':'#9b4f96',
    'SQL':'#336791', 'HTML5':'#e34f26', 'CSS3':'#1572b6', 'ES6+':'#f0db4f',
    'Angular':'#dd0031', 'Node.js':'#3c873a', 'PHP':'#777bb4',
    'MySQL':'#4479a1', 'MongoDB':'#47a248', 'Git':'#f05032', '.NET':'#512bd4',
    'WebSocket':'#60a5fa', 'REST API':'#a78bfa', 'Gemini':'#4285f4',
    'OpenAI':'#10a37f', 'Groq':'#f55036',
  };
  document.querySelectorAll('.sk').forEach(chip => {
    const nm    = chip.querySelector('.sk-name')?.textContent.trim();
    const color = map[nm];
    if (!color) return;
    chip.addEventListener('mouseenter', () => {
      chip.style.boxShadow  = `0 0 22px ${color}28`;
      chip.style.borderColor = color + '44';
    });
    chip.addEventListener('mouseleave', () => {
      chip.style.boxShadow  = '';
      chip.style.borderColor = '';
    });
  });
})();

/* ── Stagger skill chip entrance ── */
(function () {
  document.querySelectorAll('.sk').forEach((c, i) => {
    c.style.transitionDelay = `${i * 28}ms`;
  });
})();
