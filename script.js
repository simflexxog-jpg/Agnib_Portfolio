/* =============================================
   AGNIB SIKDER - Portfolio Script
   Professional Edition
   ============================================= */
'use strict';

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
  const roles  = ['Full-Stack Developer', 'API Integration Builder', 'MCA Student @ RCCIIT', 'Node.js & WebSocket Dev'];
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

