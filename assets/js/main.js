
const navToggle = document.querySelector('[data-nav-toggle]');
const menu = document.querySelector('#menu-principal');
if (navToggle && menu) {
  navToggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
}

document.querySelectorAll('[data-slider]').forEach((slider) => {
  const slides = Array.from(slider.querySelectorAll('.slide'));
  const dots = Array.from(slider.querySelectorAll('.slider-dot'));
  let current = 0;
  let timer = null;
  const show = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
  };
  const start = () => {
    if (slides.length > 1) timer = setInterval(() => show(current + 1), 3500);
  };
  dots.forEach((dot, i) => dot.addEventListener('click', () => {
    show(i);
    if (timer) { clearInterval(timer); start(); }
  }));
  start();
});

document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});
