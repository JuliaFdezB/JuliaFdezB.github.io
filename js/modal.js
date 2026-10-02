/* ========================================
   Project Data
   ======================================== */
const projectsData = {
  'ptolemys-night': {
    title: 'Ptolemy\'s Night',
    images: ['assets/images/projects/PN-PortadaWeb.jpg'],
    video: 'https://www.youtube.com/embed/fnKnYpNfvLI',
    role: 'Research, Design & Development',
    team: 'Solo',
    duration: '5 months',
    language: 'English',
    tech: ['Unity 6', 'C#', 'Claude Code', 'Blender'],
    description: 'My Final Degree Work: a puzzle game that is also a study of how artificial intelligence is changing the way games get made. You play as the spirit of Cassiopeia, arranging the room of the 2nd-century astronomer Claudius Ptolemy so that he discovers and documents her constellation on his own during the night — he is an autonomous NPC driven by a custom checkpoint-based decision tree, which keeps the puzzle solvable and verifiable from a known starting state. I ran the research from inside the project: four development scenarios, each modelling a different studio team, from AI as a supporting tool with me leading the work to progressively heavier AI roles. For each one I recorded the time invested, the state of the resulting build and every human intervention it needed, then compared them to answer how AI can be used efficiently and how much the human still matters. Built in Unity 6 over five months, entirely on my own.',
    links: [
      { label: 'Play on itch.io', url: 'https://julia-fdez.itch.io/ptolemys-night', icon: 'itchio' },
      { label: 'Read the Final Degree Work', url: 'https://drive.google.com/file/d/1UQcQt2FAG5qjipO-6Pk72iDTAIvrV0iw/view?usp=sharing', icon: 'doc' }
    ]
  },
  'heredero-del-oficio': {
    title: 'Heredero del Oficio',
    images: ['assets/images/projects/PortadaJuegoItchHDO.jpg'],
    video: 'https://www.youtube.com/embed/T_Q7CUA4oM4',
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
    images: ['assets/images/projects/Under the influence.jpg'],
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
    images: ['assets/images/projects/Wool & Thread.jpg'],
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

  // Carousel — video/youtube or images
  const carouselContent = modalCarousel.querySelector('img, .placeholder-img, video, iframe');
  if (data.video && data.video.includes('youtube.com')) {
    const iframe = document.createElement('iframe');
    iframe.src = data.video;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    if (carouselContent) carouselContent.replaceWith(iframe);
    carouselPrev.style.display = 'none';
    carouselNext.style.display = 'none';
  } else if (data.video) {
    const video = document.createElement('video');
    video.src = data.video;
    video.controls = true;
    video.autoplay = false;
    video.style.width = '100%';
    video.style.height = '100%';
    // 'contain' y no 'cover': recortar un vídeo le corta la imagen por
    // arriba y por abajo, y en una pantalla estrecha se pierde media escena.
    video.style.objectFit = 'contain';
    if (carouselContent) carouselContent.replaceWith(video);
    carouselPrev.style.display = 'none';
    carouselNext.style.display = 'none';
  } else {
    currentImages = data.images;
    currentImageIndex = 0;
    // Restore img if it was replaced by video/iframe
    const existing = modalCarousel.querySelector('video, iframe, .placeholder-img');
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

  if (!modalOverlay.classList.contains('active')) {
    modalOverlay.classList.add('active');
    window.freezeBackground(true);
  }
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
  if (!modalOverlay.classList.contains('active')) return;
  const video = modalCarousel.querySelector('video');
  if (video) video.pause();
  const iframe = modalCarousel.querySelector('iframe');
  if (iframe) iframe.src = '';
  modalOverlay.classList.remove('active');
  window.freezeBackground(false);
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

/* ========================================
   Swiping through images

   Shared by the project carousel and the enlarged artwork. A swipe only
   counts when it is clearly sideways and long enough, so that scrolling the
   page with the finger never changes the picture by accident.
   ======================================== */
function onSwipe(element, onLeft, onRight) {
  const MIN = 45;
  let startX = 0;
  let startY = 0;
  let tracking = false;

  element.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    tracking = true;
  }, { passive: true });

  element.addEventListener('touchend', (e) => {
    if (!tracking) return;
    tracking = false;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;

    if (Math.abs(dx) < MIN || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx < 0) onLeft();
    else onRight();
  }, { passive: true });
}

onSwipe(modalCarousel, () => carouselNext.click(), () => carouselPrev.click());

// Open modal on card click
document.querySelectorAll('.project-card').forEach(card => {
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');

  card.addEventListener('click', () => {
    openProjectModal(card.dataset.project);
  });

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openProjectModal(card.dataset.project);
    }
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
  if (!lightboxOverlay || lightboxOverlay.classList.contains('active')) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt || 'Artwork';
  lightboxOverlay.classList.add('active');
  window.freezeBackground(true);
}

function closeLightbox() {
  if (!lightboxOverlay || !lightboxOverlay.classList.contains('active')) return;
  lightboxOverlay.classList.remove('active');
  window.freezeBackground(false);
}

lightboxClose?.addEventListener('click', closeLightbox);
lightboxOverlay?.addEventListener('click', (e) => {
  if (e.target === lightboxOverlay || e.target === lightboxImg) closeLightbox();
});

document.querySelectorAll('.gallery__item').forEach(item => {
  item.setAttribute('role', 'button');
  item.setAttribute('tabindex', '0');

  const abrir = (e) => {
    if (e.target.closest('a')) return;
    const img = item.querySelector('img');
    if (img) openLightbox(img.src, img.alt);
  };

  item.addEventListener('click', abrir);

  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      abrir(e);
    }
  });
});

/* ========================================
   CV Modal
   ======================================== */
const cvOverlay = document.getElementById('cv-overlay');
const cvIframe = document.getElementById('cv-iframe');
const cvDownloadBtn = document.getElementById('cv-download');
const cvCloseBtn = document.getElementById('cv-close');
const cvTabs = document.querySelectorAll('.cv-tab');
let currentCvLang = 'en';

const cvFiles = {
  en: 'cv/cv_en.html',
  es: 'cv/cv_es.html'
};

document.getElementById('view-cv-btn').addEventListener('click', () => {
  if (cvOverlay.classList.contains('active')) return;
  cvOverlay.classList.add('active');
  window.freezeBackground(true);
});

function closeCvModal() {
  if (!cvOverlay.classList.contains('active')) return;
  cvOverlay.classList.remove('active');
  window.freezeBackground(false);
}

cvCloseBtn.addEventListener('click', closeCvModal);

cvOverlay.addEventListener('click', (e) => {
  if (e.target === cvOverlay) closeCvModal();
});

cvTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    cvTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentCvLang = tab.dataset.lang;
    cvIframe.src = cvFiles[currentCvLang];
  });
});

const cvPdfFiles = {
  en: 'cv/JuliaFernandezBermejoCVenglish.pdf',
  es: 'cv/JuliaFernandezBermejoCVespañol.pdf'
};

cvDownloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.href = cvPdfFiles[currentCvLang];
  link.download = '';
  link.click();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && cvOverlay.classList.contains('active')) {
    closeCvModal();
  }
});
