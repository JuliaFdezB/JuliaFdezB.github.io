/* ========================================
   Navigation
   ======================================== */
const nav = document.querySelector('.nav');
const hamburger = document.querySelector('.nav__hamburger');
const navLinks = document.querySelector('.nav__links');
const navLinkItems = document.querySelectorAll('.nav__link');

// Scroll effect
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Hamburger menu
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu on link click
navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
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
document.querySelectorAll('.gallery__stack').forEach(stack => {
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

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 15000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      const dotColor = getComputedStyle(document.documentElement).getPropertyValue('--particle-dot').trim();
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
          const lineColor = getComputedStyle(document.documentElement).getPropertyValue('--particle-line').trim();
          ctx.strokeStyle = `rgba(${lineColor}, ${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
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
