// Custom cursor
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
});

function animateRing() {
  rx += (mx - rx - 18) * 0.18;
  ry += (my - ry - 18) * 0.18;
  cursorRing.style.transform = `translate(${rx}px, ${ry}px)`;
  requestAnimationFrame(animateRing);
}
animateRing();

// Intersection Observer for fade-in
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Form validation
document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  let valid = true;
  const submitButton = this.querySelector('.form-submit');
  const successMessage = document.getElementById('formSuccess');
  const errorMessage = document.getElementById('formError');

  successMessage.classList.remove('show');
  errorMessage.classList.remove('show');

  const fields = [
    { id: 'name', errId: 'nameErr', validate: v => v.trim().length >= 2 },
    { id: 'email', errId: 'emailErr', validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
    { id: 'subject', errId: 'subjectErr', validate: v => v.trim().length >= 3 },
    { id: 'message', errId: 'messageErr', validate: v => v.trim().length >= 20 },
  ];

  fields.forEach(f => {
    const input = document.getElementById(f.id);
    const err = document.getElementById(f.errId);
    if (!f.validate(input.value)) {
      input.classList.add('error');
      err.classList.add('show');
      valid = false;
    } else {
      input.classList.remove('error');
      err.classList.remove('show');
    }
  });

  if (valid) {
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    try {
      const response = await fetch(this.action, {
        method: 'POST',
        body: new FormData(this),
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) throw new Error('Form submission failed');

      successMessage.classList.add('show');
      this.reset();
      setTimeout(() => successMessage.classList.remove('show'), 4000);
    } catch (error) {
      errorMessage.classList.add('show');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message →';
    }
  }
});

// Remove error on input
document.querySelectorAll('.form-input, .form-textarea').forEach(el => {
  el.addEventListener('input', function() {
    this.classList.remove('error');
    const errEl = document.getElementById(this.id + 'Err');
    if (errEl) errEl.classList.remove('show');
  });
});

// Nav active state
const nav = document.querySelector('nav');
const tickerWrap = document.querySelector('.ticker-wrap');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
let lastScrollY = window.scrollY;
let navOffset = 0;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  const tickerStart = tickerWrap.offsetTop - nav.offsetHeight;
  const tickerEnd = tickerWrap.offsetTop + tickerWrap.offsetHeight;
  const isScrollingUp = currentScrollY < lastScrollY;

  if (currentScrollY < tickerStart) {
    navOffset = 0;
    nav.style.transition = 'none';
  } else if (currentScrollY < tickerEnd) {
    navOffset = currentScrollY - tickerStart;
    navOffset = Math.max(0, Math.min(navOffset, nav.offsetHeight));
    nav.style.transition = 'none';
  } else if (isScrollingUp) {
    navOffset = 0;
    nav.style.transition = 'transform 0.5s ease';
  } else {
    navOffset = nav.offsetHeight;
    nav.style.transition = 'transform 0.5s ease';
  }

  nav.style.transform = `translateY(-${navOffset}px)`;
  lastScrollY = currentScrollY;

  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
  });
});
