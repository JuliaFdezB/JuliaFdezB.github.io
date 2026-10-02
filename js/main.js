/* ========================================
   Freezing the page behind a dialog

   Setting overflow:hidden on the body does not stop the scroll on iOS: the
   finger drags the page behind the dialog instead of the dialog itself.
   Pinning the body with position:fixed does stop it, as long as we remember
   where the page was and put it back on the way out.

   The counter is there because several things can be open at once (the menu
   and then a project, say) and the last one to close must be the one that
   gives the page back.
   ======================================== */
const scrollLock = { depth: 0, y: 0 };

window.freezeBackground = (freeze) => {
  const body = document.body;

  if (freeze) {
    if (scrollLock.depth === 0) {
      scrollLock.y = window.scrollY;
      body.style.position = 'fixed';
      body.style.top = `-${scrollLock.y}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
    }
    scrollLock.depth++;
    return;
  }

  scrollLock.depth = Math.max(0, scrollLock.depth - 1);
  if (scrollLock.depth > 0) return;

  body.style.position = '';
  body.style.top = '';
  body.style.left = '';
  body.style.right = '';
  body.style.width = '';

  /* Straight back, no animation: the page scrolls smoothly by default, and
     from a frozen body that means watching it travel all the way down. */
  const html = document.documentElement;
  const smooth = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  window.scrollTo(0, scrollLock.y);
  html.style.scrollBehavior = smooth;
};

/* ========================================
   Navigation
   ======================================== */
const nav = document.querySelector('.nav');
const hamburger = document.querySelector('.nav__hamburger');
const navLinks = document.querySelector('.nav__links');
const navLinkItems = document.querySelectorAll('.nav__link');
const navBackdrop = document.querySelector('.nav__backdrop');

// Scroll effect
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Hamburger menu
function setMenu(open) {
  if (navLinks.classList.contains('open') === open) return;
  hamburger.classList.toggle('active', open);
  navLinks.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  window.freezeBackground(open);

  /* The veil has to exist before it can fade, hence the two steps. */
  if (!navBackdrop) return;
  if (open) {
    navBackdrop.hidden = false;
    requestAnimationFrame(() => navBackdrop.classList.add('visible'));
  } else {
    navBackdrop.classList.remove('visible');
    setTimeout(() => {
      if (!navLinks.classList.contains('open')) navBackdrop.hidden = true;
    }, 300);
  }
}

hamburger.addEventListener('click', () => {
  setMenu(!navLinks.classList.contains('open'));
});

// Close mobile menu on link click
navLinkItems.forEach(link => {
  link.addEventListener('click', () => setMenu(false));
});

// Tapping anywhere outside the panel closes it, which is what people try
// first on a phone. The tap lands on the veil, so it never reaches the card
// underneath and opens a project by accident.
navBackdrop?.addEventListener('click', () => setMenu(false));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setMenu(false);
});

// Rotating the phone or widening the window brings the desktop menu back:
// the panel must not stay open and frozen behind it.
window.matchMedia('(min-width: 769px)').addEventListener('change', (e) => {
  if (e.matches) setMenu(false);
});

// Active section highlighting
const sections = document.querySelectorAll('section[id]');
const observerOptions = { rootMargin: '-20% 0px -80% 0px' };

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinkItems.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

/* ========================================
   Project Filters
   ======================================== */
const projectFilterBtns = document.querySelectorAll('.projects .filter-btn');
const projectCards = document.querySelectorAll('.project-card');

projectFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    projectFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    projectCards.forEach(card => {
      if (filter === 'all' || card.dataset.category.includes(filter)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ========================================
   Gallery Filters
   ======================================== */
const galleryFilterBtns = document.querySelectorAll('.gallery__filters .filter-btn');
const galleryItems = document.querySelectorAll('.gallery__item');

galleryFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    galleryFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

/* ========================================
   Gallery Stacks — delayed collapse
   ======================================== */
/* Sin ratón las pilas no se despliegan: el CSS las deshace y enseña todas
   las fotos en la rejilla, porque si no las de debajo quedan inalcanzables. */
const hasHover = window.matchMedia('(hover: hover)').matches;

document.querySelectorAll('.gallery__stack').forEach(stack => {
  if (!hasHover) return;
  let closeTimer = null;

  stack.addEventListener('mouseenter', () => {
    clearTimeout(closeTimer);
    stack.classList.add('expanded');
  });

  stack.addEventListener('mouseleave', () => {
    closeTimer = setTimeout(() => {
      stack.classList.remove('expanded');
    }, 200);
  });
});

/* ========================================
   Scroll Reveal Animations
   ======================================== */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

/* ========================================
   Hero Particle Animation
   ======================================== */
function initParticles() {
  const canvas = document.querySelector('.hero__canvas');
  if (!canvas) return;

  // Nobody should get a looping animation they asked their system to stop.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId = null;
  let width = 0;
  let height = 0;

  /* The two colours come from the theme, so they change with it — but asking
     the browser for them inside the drawing loop meant one lookup per pair of
     particles, thousands of them every frame, which is what made the hero
     crawl on a phone. They are read once here and again when the theme is
     switched. */
  let dotColor = '';
  let lineColor = '';

  function readColors() {
    const styles = getComputedStyle(document.documentElement);
    dotColor = styles.getPropertyValue('--particle-dot').trim();
    lineColor = styles.getPropertyValue('--particle-line').trim();
  }

  function resize() {
    /* Drawing at the screen's own resolution: on a phone the canvas is
       stretched over two or three device pixels and the dots look smeared. */
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function createParticles() {
    /* Fewer dots on a narrow screen: they are smaller, closer together and
       cost more, since the connection check grows with the square of them. */
    const density = width < 700 ? 24000 : 15000;
    const count = Math.min(Math.floor((width * height) / density), 120);

    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${dotColor}, ${p.opacity})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${lineColor}, ${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(draw);
  }

  function start() {
    if (animationId === null) animationId = requestAnimationFrame(draw);
  }

  function stop() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  readColors();
  resize();
  createParticles();
  start();

  window.addEventListener('resize', () => {
    /* On a phone, scrolling hides and shows the address bar, and every time it
       moves the browser reports a resize. Rebuilding the particles on each one
       made the hero flicker, so only a real change of width counts. */
    const sameWidth = Math.abs(canvas.offsetWidth - width) < 2;
    resize();
    if (!sameWidth) createParticles();
  });

  // Nothing to animate while the hero is off screen or the tab is in the back.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) start();
    else stop();
  }).observe(canvas);

  // The theme toggle swaps the colours underneath us.
  new MutationObserver(readColors).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
}

initParticles();

/* ========================================
   Contact Form
   ======================================== */
const contactForm = document.querySelector('.contact__form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn');
    const originalText = btn.innerHTML;

    btn.innerHTML = 'Sending...';
    btn.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        btn.innerHTML = 'Sent!';
        contactForm.reset();
        setTimeout(() => { btn.innerHTML = originalText; btn.disabled = false; }, 3000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch {
      btn.innerHTML = 'Error — try again';
      btn.disabled = false;
      setTimeout(() => { btn.innerHTML = originalText; }, 3000);
    }
  });
}

/* ========================================
   Theme Toggle
   ======================================== */
const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'blue' ? 'warm' : 'blue';
    if (next === 'warm') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'blue');
    }
    localStorage.setItem('theme', next);
  });
}
