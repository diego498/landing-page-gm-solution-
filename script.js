/* ===========================
   GMsolution – script.js
=========================== */

/* ---- NAV scroll state ---- */
const nav = document.getElementById('nav');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---- Mobile burger ---- */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ---- Scroll reveal (Intersection Observer) ---- */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ---- Hero elements appear on load ---- */
document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
  setTimeout(() => el.classList.add('visible'), 200 + i * 150);
});

/* ---- Counter animation ---- */
const counters = document.querySelectorAll('.stat__num');

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      const duration = 1800;
      const start = performance.now();

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };

      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);

counters.forEach(c => countObserver.observe(c));

/* ---- Smooth scroll for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---- Parallax subtle on hero ---- */
const heroBg = document.querySelector('.hero__bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroBg.style.transform = `translateY(${y * 0.3}px)`;
    }
  }, { passive: true });
}

/* ---- Form submit (placeholder) ---- */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    // Simulate send – connect to your backend or Formspree here
    setTimeout(() => {
      btn.textContent = '¡Mensaje enviado!';
      btn.style.background = '#06752E';
      form.reset();
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1200);
  });
}

/* ---- Calculadora de ahorro ---- */
const billSlider   = document.getElementById('billSlider');
const billDisplay  = document.getElementById('billDisplay');
const monthlySaving = document.getElementById('monthlySaving');
const yearlySaving  = document.getElementById('yearlySaving');
const roiEl         = document.getElementById('roi');

let savingFactor = 0.85;

function formatCLP(n) {
  return '$' + Math.round(n).toLocaleString('es-CL');
}

function updateCalc() {
  if (!billSlider) return;
  const bill = +billSlider.value;
  billDisplay.textContent = bill.toLocaleString('es-CL');
  const monthly = bill * savingFactor;
  const yearly  = monthly * 12;
  // Avg system cost ~3.5M CLP, ROI in years
  const systemCost = bill < 50000 ? 1800000 : bill < 150000 ? 3500000 : 6000000;
  const roiYears = (systemCost / yearly).toFixed(1);
  monthlySaving.textContent = formatCLP(monthly);
  yearlySaving.textContent  = formatCLP(yearly);
  roiEl.textContent = `~${roiYears} años`;

  // Update slider gradient
  const pct = ((bill - 20000) / (500000 - 20000)) * 100;
  billSlider.style.background = `linear-gradient(to right, var(--teal) ${pct}%, #ddd ${pct}%)`;
}

if (billSlider) {
  billSlider.addEventListener('input', updateCalc);
  updateCalc();
}

document.querySelectorAll('.calc__opt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.calc__opt').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    savingFactor = +btn.dataset.factor;
    updateCalc();
  });
});

/* ---- FAQ accordion ---- */
document.querySelectorAll('.faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq__item');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('open'));
    // Toggle clicked
    if (!isOpen) item.classList.add('open');
  });
});

/* ---- Active nav link highlight ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));
