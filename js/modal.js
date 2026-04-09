/* ========================================
   Project Data
   ======================================== */
const projectsData = {
  'heredero-del-oficio': {
    title: 'Heredero del Oficio',
    images: ['assets/images/projects/PortadaJuegoItchHDO.png'],
    video: 'assets/images/projects/Trailer_HerederoDelOficio.mp4',
    role: 'Artist & Designer',
    team: '6 people',
    duration: '4 months',
    language: 'Spanish',
    tech: ['Unity', 'FireAlpaca'],
    description: 'An educational game created for L\'Alcora\'s Culture Council to introduce schoolchildren to the town\'s centuries-old pottery tradition. I spearheaded the art and design direction — shaping the visual identity, character designs, UI, and game design — working closely with my team to bring the project\'s vision to life.',
    links: [
      { label: 'Play on itch.io', url: 'https://bitem.itch.io/heredero-del-oficio', icon: 'itchio' }
    ]
  },
  'under-the-influence': {
    title: 'Under the Influence',
    images: ['assets/images/projects/Under the influence.png'],
    role: 'Writer & Designer',
    team: '4 people',
    duration: '2 months',
    language: 'Spanish',
    tech: [],
    description: 'A narrative-driven game designed to help teenagers understand, prevent, and overcome addictions. The project was deeply rooted in storytelling — from world-building and character development to branching dialogue and emotional arcs. I led the narrative design, crafting the characters, story structure, and dialogue that drive the player experience.',
    links: [
      { label: 'View Narrative Bible', url: 'assets/images/projects/UnderTheInfluence_Narrative Bible.pdf', icon: 'doc' }
    ]
  },
  'wool-and-thread': {
    title: 'Wool & Thread',
    images: ['assets/images/projects/Wool & Thread.png'],
    role: 'Game Designer',
    team: 'Solo',
    duration: '3 months',
    language: 'Spanish',
    tech: [],
    description: 'A cozy management sim where you leave your parents\' souvenir shop to chase your lifelong passion — knitting. You\'ll open your own yarn and handmade goods store, grow it from a small local shop to an online brand. The game unfolds in three phases: managing your physical store, building a social media presence, and launching an online shop. What makes it unique is how deeply it simulates the full journey of running a modern small business — from stock management and hiring to content creation and web design — all wrapped in a relaxing, detail-rich experience.',
    links: [
      { label: 'View Game Design Document', url: 'assets/images/projects/Wool&Thread_GDD_FernandezBermejoJulia.pdf', icon: 'doc' }
    ]
  }
};

/* ========================================
   Project Modal
   ======================================== */
const modalOverlay = document.querySelector('.modal-overlay');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal__close');
const modalTitle = document.querySelector('.modal__title');
const modalCarousel = document.querySelector('.modal__carousel');
const modalMeta = document.querySelector('.modal__meta');
const modalDescription = document.querySelector('.modal__description');
const modalTechList = document.querySelector('.modal__tech-list');
const modalLinks = document.querySelector('.modal__links');
const carouselPrev = document.querySelector('.modal__carousel-btn--prev');
const carouselNext = document.querySelector('.modal__carousel-btn--next');

let currentImages = [];
let currentImageIndex = 0;

function openProjectModal(projectId) {
  const data = projectsData[projectId];
  if (!data) return;

  modalTitle.textContent = data.title;

  // Carousel — video or images
  const carouselContent = modalCarousel.querySelector('img, .placeholder-img, video');
  if (data.video) {
    const video = document.createElement('video');
    video.src = data.video;
    video.controls = true;
    video.autoplay = false;
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    if (carouselContent) carouselContent.replaceWith(video);
    carouselPrev.style.display = 'none';
    carouselNext.style.display = 'none';
  } else {
    currentImages = data.images;
    currentImageIndex = 0;
    // Restore img if it was replaced by video
    const existing = modalCarousel.querySelector('video, .placeholder-img');
    if (existing) {
      const img = document.createElement('img');
      img.alt = 'Project screenshot';
      existing.replaceWith(img);
    }
    carouselPrev.style.display = '';
    carouselNext.style.display = '';
    updateCarouselImage();
  }

  // Meta
  modalMeta.innerHTML = `
    <span class="modal__meta-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      ${data.role}
    </span>
    <span class="modal__meta-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      ${data.team}
    </span>
    <span class="modal__meta-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      ${data.duration}
    </span>
    <span class="modal__meta-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
      ${data.language}
    </span>
  `;

  // Description
  modalDescription.textContent = data.description;

  // Tech
  const techTitle = document.querySelector('.modal__section-title');
  if (data.tech && data.tech.length > 0) {
    techTitle.style.display = '';
    modalTechList.style.display = '';
    modalTechList.innerHTML = data.tech
      .map(t => `<span class="skill-pill">${t}</span>`)
      .join('');
  } else {
    techTitle.style.display = 'none';
    modalTechList.style.display = 'none';
  }

  // Links
  modalLinks.innerHTML = data.links
    .map(l => `<a href="${l.url}" target="_blank" rel="noopener" class="btn btn--outline">${l.label}</a>`)
    .join('');

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function updateCarouselImage() {
  const img = modalCarousel.querySelector('img') || modalCarousel.querySelector('.placeholder-img');
  if (currentImages.length > 0) {
    if (img.tagName === 'DIV') {
      const newImg = document.createElement('img');
      newImg.src = currentImages[currentImageIndex];
      newImg.alt = 'Project screenshot';
      img.replaceWith(newImg);
    } else {
      img.src = currentImages[currentImageIndex];
    }
  }
}

function closeModal() {
  const video = modalCarousel.querySelector('video');
  if (video) video.pause();
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

carouselPrev.addEventListener('click', () => {
  if (currentImages.length === 0) return;
  currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
  updateCarouselImage();
});

carouselNext.addEventListener('click', () => {
  if (currentImages.length === 0) return;
  currentImageIndex = (currentImageIndex + 1) % currentImages.length;
  updateCarouselImage();
});

// Open modal on card click
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => {
    openProjectModal(card.dataset.project);
  });
});

// Keyboard close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeLightbox();
  }
  if (modalOverlay.classList.contains('active')) {
    if (e.key === 'ArrowLeft') carouselPrev.click();
    if (e.key === 'ArrowRight') carouselNext.click();
  }
});

/* ========================================
   Art Lightbox
   ======================================== */
const lightboxOverlay = document.querySelector('.lightbox-overlay');
const lightboxImg = lightboxOverlay?.querySelector('img');
const lightboxClose = lightboxOverlay?.querySelector('.lightbox-close');

function openLightbox(src, alt) {
  if (!lightboxOverlay) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt || 'Artwork';
  lightboxOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightboxOverlay) return;
  lightboxOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

lightboxClose?.addEventListener('click', closeLightbox);
lightboxOverlay?.addEventListener('click', (e) => {
  if (e.target === lightboxOverlay || e.target === lightboxImg) closeLightbox();
});

document.querySelectorAll('.gallery__item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (img) openLightbox(img.src, img.alt);
  });
});
