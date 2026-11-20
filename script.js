/* ---------- 1. HOME PAGE: hero slider (unchanged) ---------- */
// Only runs if the page has the slider (index.html)
if (document.getElementById('dots') && document.getElementById('home')) {
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
}

/* ---------- 2. MOBILE MENU (all pages) ---------- */
// The HTML uses id="mainNav" and the CSS shows the menu with the class "show"
const nav = document.getElementById('mainNav');
const menuToggle = document.getElementById('menuToggle');
if (nav && menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('show');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  // Close the menu after a link is clicked
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('show');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
}

/* ---------- Helper: fade an element up when it scrolls into view ---------- */
// Used by both the About page and the Services page
function revealOnScroll(elements, stagger) {
  // Respect people who turn off animations
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        observer.unobserve(entry.target); // animate only once
        // After the fade finishes, remove the inline styles so the CSS hover effects work again
        const el = entry.target;
        setTimeout(() => {
          el.style.opacity = '';
          el.style.transform = '';
          el.style.transition = '';
          el.style.transitionDelay = '';
        }, 1000);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach((el, i) => {
    // Start hidden and slightly lower
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    // Small delay so items in a row appear one after another
    el.style.transitionDelay = ((i % stagger) * 0.1) + 's';
    observer.observe(el);
  });
}

/* ---------- 3. ABOUT PAGE ---------- */
if (document.body.classList.contains('about-page')) {

  // 3a. Hero text fades in one after another when the page loads
  document.querySelectorAll('.hero-item').forEach(item => {
    const order = Number(item.style.getPropertyValue('--i')) || 0;
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    item.style.transitionDelay = (0.2 + order * 0.15) + 's';
    // Wait a moment so the browser sees the hidden state first
    requestAnimationFrame(() => requestAnimationFrame(() => {
      item.style.opacity = '1';
      item.style.transform = 'none';
    }));
  });

  // 3b. Sections fade in when scrolled to
  revealOnScroll(document.querySelectorAll('.reveal'), 3);

  // 3c. Years of experience: calculated from the year we opened (1989)
  const years = new Date().getFullYear() - 1989;
  const yearsCount = document.getElementById('yearsCount');
  const factYears = document.getElementById('factYears');
  if (yearsCount) yearsCount.textContent = years;
  if (factYears) {
    // Count up from 0 when the number scrolls into view
    const counter = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      counter.disconnect();
      let n = 0;
      const step = setInterval(() => {
        n++;
        factYears.textContent = n + '+';
        if (n >= years) clearInterval(step);
      }, 40);
    }, { threshold: 0.5 });
    counter.observe(factYears);
  }

  // 3d. Tabs: "Our clients" / "Events we cover"
  const tabs = Array.from(document.querySelectorAll('.about-tab'));
  const panels = document.querySelectorAll('.about-tabpanel');

  function showTab(tab) {
    // Reset every tab and panel
    tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
      t.tabIndex = -1;
    });
    panels.forEach(p => p.classList.remove('active'));

    // Turn on the chosen tab and its matching panel
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    tab.tabIndex = 0;
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    panel.classList.add('active');

    // Make the tiles pop in one by one
    panel.querySelectorAll('.about-tiles li').forEach((tile, i) => {
      tile.style.opacity = '0';
      tile.style.transform = 'translateY(12px)';
      tile.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      tile.style.transitionDelay = (i * 0.06) + 's';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        tile.style.opacity = '1';
        tile.style.transform = 'none';
      }));
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => showTab(tab));
    // Left / Right arrow keys move between tabs
    tab.addEventListener('keydown', event => {
      let next = null;
      if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
      if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
      if (next) {
        showTab(next);
        next.focus();
      }
    });
  });

  // 3e. Big "Iloilo City" watermark slides sideways as you scroll
  const watermark = document.getElementById('serveWatermark');
  const serveSection = document.getElementById('who-we-serve');
  if (watermark && serveSection) {
    window.addEventListener('scroll', () => {
      const box = serveSection.getBoundingClientRect();
      // Only move while the section is on screen
      if (box.top < window.innerHeight && box.bottom > 0) {
        watermark.style.transform = 'translateX(' + (box.top * 0.15) + 'px)';
      }
    }, { passive: true });
  }

  // 3f. Smooth scroll for the "Learn More" button
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ---------- 4. SERVICES PAGE ---------- */
const serviceCards = document.querySelectorAll('.service-card');
if (serviceCards.length) {

  // 4a. Service cards and package cards fade in as you scroll
  revealOnScroll(serviceCards, 3);
  revealOnScroll(document.querySelectorAll('.package-card'), 2);

  // 4b. Smooth scroll for "Explore our services"
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
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

