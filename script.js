// ============================================================
// AKSHARA SCHOOL — SHARED INTERACTIONS
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Navbar transform + mobile menu ---------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    updateProgress();
  });

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }

  /* ---------- Scroll progress bar ---------- */
  const progress = document.getElementById('scrollProgress');
  function updateProgress() {
    if (!progress) return;
    const h = document.documentElement;
    const scrolled = (h.scrollTop || document.body.scrollTop);
    const height = h.scrollHeight - h.clientHeight;
    progress.style.width = (scrolled / height * 100) + '%';
  }

  /* ---------- Generic reveal-on-scroll ---------- */
  const revealTargets = document.querySelectorAll('.reveal, .vine-divider');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add(e.target.classList.contains('vine-divider') ? 'revealed' : 'in-view');
      }
    });
  }, { threshold: 0.25 });
  revealTargets.forEach(t => io.observe(t));

  /* ---------- Academics path step activation ---------- */
  const pathItems = document.querySelectorAll('[data-path]');
  const io2 = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
  }, { threshold: 0.6 });
  pathItems.forEach(p => io2.observe(p));

  /* ---------- Floating favorite-things icons ---------- */
  const prefersReducedForIcons = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedForIcons) {
    document.querySelectorAll('.float-zone').forEach(zone => {
      const icons = (zone.dataset.icons || '🎈,⭐').split(',');
      const count = parseInt(zone.dataset.iconCount || '5', 10);
      for (let i = 0; i < count; i++) {
        const span = document.createElement('span');
        span.className = 'float-icon';
        span.setAttribute('aria-hidden', 'true');
        span.textContent = icons[Math.floor(Math.random() * icons.length)];
        span.style.left = (Math.random() * 90 + 3) + '%';
        span.style.fontSize = (1.2 + Math.random() * 1.1) + 'rem';
        const duration = 12 + Math.random() * 8;
        span.style.animationDuration = duration + 's';
        const slot = duration / count;
        const jitter = (Math.random() - 0.5) * slot * 0.6;
        span.style.animationDelay = Math.max(0, (slot * i) + jitter) + 's';
        zone.appendChild(span);
      }
    });
  }

  /* ---------- Animated counters ---------- */
  const stats = document.querySelectorAll('.stat h3[data-target]');
  const io3 = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.done) {
        e.target.dataset.done = 'true';
        animateCount(e.target);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(s => io3.observe(s));

  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Contact form -> WhatsApp ---------- */
  const WHATSAPP_NUMBER = '918309008948'; // +91 83090 08948 (no spaces/+)
  const form = document.getElementById('enquiryForm');
  const success = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const parent = document.getElementById('parentName').value.trim();
      const phone  = document.getElementById('phone').value.trim();
      const grade  = document.getElementById('childGrade').value.trim();
      const msg    = document.getElementById('message').value.trim();

      let text = `Hello Akshara School,%0A%0A`;
      text += `I'd like to enquire about admissions.%0A%0A`;
      text += `*Parent's Name:* ${parent}%0A`;
      text += `*Phone:* ${phone}%0A`;
      if (grade) text += `*Child's Age / Grade:* ${grade}%0A`;
      if (msg)   text += `*Message:* ${msg}%0A`;
      text += `%0APlease share the next steps. Thank you!`;

      const waURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;

      // Show in-page success first
      form.style.opacity = '0';
      form.style.pointerEvents = 'none';
      setTimeout(() => {
        form.style.display = 'none';
        success.classList.add('show');
      }, 250);

      // Open WhatsApp in a new tab
      window.open(waURL, '_blank');
    });

    form.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('blur', () => {
        el.closest('.field').classList.toggle('filled', el.value.trim() !== '');
      });
    });
  }

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Image fallback ---------- */
  document.querySelectorAll('.ph img').forEach(img => {
    img.addEventListener('error', () => { img.style.display = 'none'; });
  });

  /* ---------- Respect reduced motion ---------- */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll('.cloud, .bird, .particle, .balloon, .kite, .star, .dust, .butterfly, .float-icon, .cartoon-sun')
      .forEach(el => el.style.display = 'none');
  }

  /* ============================================================
     MICRO-INTERACTIONS (skipped on touch devices)
     ============================================================ */
  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  if (!isTouchDevice) {
    /* Cursor glow */
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    let glowX = 0, glowY = 0, curX = 0, curY = 0;
    window.addEventListener('mousemove', (e) => {
      glowX = e.clientX; glowY = e.clientY;
      glow.classList.add('active');
      const darkSection = e.target.closest('.academics, .principal, .footer');
      glow.classList.toggle('on-dark', !!darkSection);
    });
    document.addEventListener('mouseleave', () => glow.classList.remove('active'));
    (function animateGlow(){
      curX += (glowX - curX) * 0.18;
      curY += (glowY - curY) * 0.18;
      glow.style.left = curX + 'px';
      glow.style.top = curY + 'px';
      requestAnimationFrame(animateGlow);
    })();
    document.querySelectorAll('a, button, .sl-card, .masonry-item, .social-btn').forEach(el => {
      el.addEventListener('mouseenter', () => glow.classList.add('big'));
      el.addEventListener('mouseleave', () => glow.classList.remove('big'));
    });

    /* Magnetic buttons */
    document.querySelectorAll('.btn, .nav-cta, .back-to-top').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const relX = e.clientX - (r.left + r.width / 2);
        const relY = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${relX * 0.18}px, ${relY * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });

    /* 3D tilt cards */
    document.querySelectorAll('.sl-card, .masonry-item').forEach(card => {
      card.classList.add('tilt-card');
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${py * -8}deg) rotateY(${px * 8}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* Ripple on click */
  document.querySelectorAll('.btn, .nav-cta, .back-to-top').forEach(el => {
    el.addEventListener('click', (e) => {
      const r = el.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(r.width, r.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - r.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - r.top - size / 2) + 'px';
      el.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

});
