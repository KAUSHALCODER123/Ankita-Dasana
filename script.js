// ===== Year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Sticky nav + scroll progress bar =====
const nav = document.getElementById('nav');
const progress = document.getElementById('progress');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
  const h = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// ===== Active nav link highlight =====
const navLinks = [...document.querySelectorAll('.nav__links a:not(.nav__cta)')];
const sections = navLinks
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);
const navIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = '#' + e.target.id;
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => navIO.observe(s));

// ===== Mobile menu =====
const burger = document.getElementById('burger');
const menu = document.getElementById('mobileMenu');
const toggleMenu = (open) => {
  burger.classList.toggle('open', open);
  menu.classList.toggle('open', open);
};
burger.addEventListener('click', () => toggleMenu(!menu.classList.contains('open')));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

// ===== Scroll reveal =====
const revealTargets = document.querySelectorAll(
  '.about, .stat, .work__head, .quote, .tl, .certs__inner, .contact__title'
);
revealTargets.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.transitionDelay = `${Math.min(i * 60, 240)}ms`;
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
revealTargets.forEach(el => io.observe(el));

// ===== Animated counters =====
const animateCount = (el) => {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const dur = 1500;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const countIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      countIO.unobserve(e.target);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));

// ===== Motion capability checks =====
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// ===== Infinite auto-scroll for case-study cards =====
const cards = document.getElementById('cards');
if (cards) {
  const originals = [...cards.children];
  // duplicate the set so the loop is seamless
  originals.forEach(c => {
    const clone = c.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    cards.appendChild(clone);
  });
  if (!reduceMotion) {
    const distance = cards.children[originals.length].offsetLeft - cards.children[0].offsetLeft;
    const cardAnim = cards.animate(
      [{ transform: 'translateX(0)' }, { transform: `translateX(-${distance}px)` }],
      { duration: distance * 16, iterations: Infinity, easing: 'linear' }
    );
    cards.addEventListener('mouseenter', () => cardAnim.pause());
    cards.addEventListener('mouseleave', () => cardAnim.play());
  }
}

// ===== Card hover-tilt =====
if (finePointer && !reduceMotion) {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        `perspective(900px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  // ===== Magnetic buttons =====
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const mx = e.clientX - r.left - r.width / 2;
      const my = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${mx * 0.25}px, ${my * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}
