const slides = document.querySelectorAll('.slide');
const dotsWrap = document.getElementById('dots');
const hero = document.getElementById('home');
let current = 0;
let timer;

slides.forEach((_, index) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.className = 'dot' + (index === 0 ? ' active' : '');
  dot.setAttribute('aria-label', 'Go to slide ' + (index + 1));
  dot.setAttribute('aria-current', index === 0 ? 'true' : 'false');
  dot.addEventListener('click', () => {
    goTo(index);
    restart();
  });
  dotsWrap.appendChild(dot);
});

const dots = dotsWrap.querySelectorAll('.dot');

function goTo(index) {
  slides[current].classList.remove('active');
  slides[current].setAttribute('aria-hidden', 'true');
  dots[current].classList.remove('active');
  dots[current].setAttribute('aria-current', 'false');

  current = (index + slides.length) % slides.length;

  slides[current].classList.add('active');
  slides[current].setAttribute('aria-hidden', 'false');
  dots[current].classList.add('active');
  dots[current].setAttribute('aria-current', 'true');
}

function restart() {
  clearInterval(timer);
  timer = setInterval(() => goTo(current + 1), 5000);
}

document.getElementById('next').addEventListener('click', () => {
  goTo(current + 1);
  restart();
});
document.getElementById('prev').addEventListener('click', () => {
  goTo(current - 1);
  restart();
});

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') {
    goTo(current + 1);
    restart();
  }
  if (event.key === 'ArrowLeft') {
    goTo(current - 1);
    restart();
  }
});

let startX = 0;
hero.addEventListener('touchstart', event => {
  startX = event.touches[0].clientX;
}, { passive: true });
hero.addEventListener('touchend', event => {
  const difference = event.changedTouches[0].clientX - startX;
  if (Math.abs(difference) > 50) {
    goTo(current + (difference < 0 ? 1 : -1));
    restart();
  }
});

hero.addEventListener('mouseenter', () => clearInterval(timer));
hero.addEventListener('mouseleave', restart);
restart();

const nav = document.getElementById('nav');
const menuToggle = document.getElementById('menuToggle');
menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

