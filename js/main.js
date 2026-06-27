document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  // Set active nav link
  const page = document.body.dataset.page;
  if (page) {
    nav.querySelectorAll('a').forEach(a => {
      if (a.getAttribute('href') === page) a.classList.add('active');
    });
  }
});
