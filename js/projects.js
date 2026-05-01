// Custom cursor
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
});
function animateRing() {
  rx += (mx - rx - 18) * 0.12;
  ry += (my - ry - 18) * 0.12;
  cursorRing.style.transform = `translate(${rx}px, ${ry}px)`;
  requestAnimationFrame(animateRing);
}
animateRing();

// Navbar + filter bar scroll behavior
const nav = document.querySelector('nav');
const filterBar = document.querySelector('.filter-bar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    nav.classList.add('nav-hidden');
    filterBar.classList.add('filter-at-top');
  } else {
    nav.classList.remove('nav-hidden');
    filterBar.classList.remove('filter-at-top');
  }
});

// Fade in
const observer = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 100);
  });
}, { threshold: 0.05 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Toggle card expand/collapse
function toggleCard(headerEl) {
  const card = headerEl.closest('.project-card');
  const isOpen = card.classList.contains('open');
  // Close all
  document.querySelectorAll('.project-card').forEach(c => c.classList.remove('open'));
  // Open clicked if it wasn't already open
  if (!isOpen) card.classList.add('open');
}

// Filter
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    const filter = this.dataset.filter;
    const cards = document.querySelectorAll('.project-card');
    let visible = 0;

    cards.forEach(card => {
      const tags = card.dataset.tags || '';
      const show = filter === 'all' || tags.includes(filter);
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    document.getElementById('countNum').textContent = visible;
    document.getElementById('noResults').classList.toggle('show', visible === 0);
  });
});