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

/* ---------- 5. FOOTER: years of experience (any page that has it) ---------- */
// The business opened in 1989, so this number never goes out of date
const footerYears = document.getElementById('footerYears');
if (footerYears) footerYears.textContent = new Date().getFullYear() - 1989;

/* ---------- 6. CONTACT PAGE: form validation ---------- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {

  // The form fields
  const fields = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    eventType: document.getElementById('eventType'),
    eventDate: document.getElementById('eventDate'),
    message: document.getElementById('message')
  };
  const status = document.getElementById('formStatus');
  const counter = document.getElementById('messageCount');

  // The event date cannot be earlier than today
  const today = new Date().toISOString().split('T')[0];
  fields.eventDate.min = today;

  // Each rule returns an error message, or '' if the value is OK
  const rules = {
    name(v) {
      if (!v) return 'Please enter your name.';
      if (v.length < 2) return 'Name is too short.';
      if (!/^[A-Za-z\u00C0-\u024F.'\- ]+$/.test(v)) return 'Name can only contain letters.';
      return '';
    },
    email(v) {
      if (!v) return 'Please enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Enter a valid email, e.g. name@email.com.';
      return '';
    },
    phone(v) {
      if (!v) return 'Please enter your mobile number.';
      // Removes spaces and dashes, then accepts 09XXXXXXXXX or +639XXXXXXXXX
      const digits = v.replace(/[\s-]/g, '');
      if (!/^(09|\+639)\d{9}$/.test(digits)) return 'Enter a valid PH number, e.g. 0930 323 9145.';
      return '';
    },
    eventType(v) {
      return v ? '' : 'Please tell us the type of event.';
    },
    eventDate(v) {
      // Optional field: only check it when something is filled in
      if (v && v < today) return 'Event date cannot be in the past.';
      return '';
    },
    message(v) {
      if (!v) return 'Please write a short message.';
      if (v.length < 10) return 'Message is too short (at least 10 characters).';
      return '';
    }
  };

  // Show or clear the red error text under a field
  function showError(input, message) {
    let note = input.parentElement.querySelector('.field-error[data-for="' + input.id + '"]');
    if (!note) {
      note = document.createElement('small');
      note.className = 'field-error';
      note.dataset.for = input.id;
      // min-height reserves the space so the page does not jump when an error appears
      note.style.cssText = 'color:#f04f52;display:block;margin-top:4px;font-size:0.78rem;min-height:1.1em;';
      input.insertAdjacentElement('afterend', note);
    }
    note.textContent = message;
    input.style.borderColor = message ? '#f04f52' : '#30343b';
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  // Create the (empty) error lines now, so the layout never shifts later
  Object.keys(fields).forEach(key => showError(fields[key], ''));

  // Check one field. Returns true if valid
  function validateField(key) {
    const input = fields[key];
    const message = rules[key](input.value.trim());
    showError(input, message);
    return message === '';
  }

  // Check while typing / leaving each field
  Object.keys(fields).forEach(key => {
    fields[key].addEventListener('blur', () => validateField(key));
    fields[key].addEventListener('input', () => {
      // Only re-check live if the field already shows an error
      if (fields[key].getAttribute('aria-invalid') === 'true') validateField(key);
    });
  });

  // Live character counter for the message box
  fields.message.addEventListener('input', () => {
    counter.textContent = fields.message.value.length + ' / 500';
  });

  // When the form is submitted
  contactForm.addEventListener('submit', event => {
    event.preventDefault(); // stop the page from reloading
    status.textContent = '';

    // Check ALL fields (don't stop at the first error)
    let allValid = true;
    Object.keys(fields).forEach(key => {
      if (!validateField(key)) allValid = false;
    });

    if (!allValid) {
      status.style.color = '#f04f52';
      status.textContent = 'Please fix the highlighted fields and try again.';
      // Jump to the first field with an error
      contactForm.querySelector('[aria-invalid="true"]').focus();
      return;
    }

    // No server yet, so we just show a success message
    status.style.color = '#6fcf97';
    status.textContent = 'Thank you, ' + fields.name.value.trim().split(' ')[0] +
      '! Your inquiry was received. We will contact you soon.';
    contactForm.reset();
    counter.textContent = '0 / 500';
    contactForm.querySelectorAll('input, textarea').forEach(input => {
      showError(input, '');
      input.removeAttribute('aria-invalid');
    });
  });
}
