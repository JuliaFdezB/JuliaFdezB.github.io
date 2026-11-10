/* ========================================
   Artbook — Out of Sight

   Tres cosas: la bombilla que enciende el libro, las animaciones hechas con
   los fotogramas de verdad del juego, y el interruptor que cambia una pieza
   entre su versión clara y su versión oscura.
   ======================================== */

const body = document.body;
const stillness = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ----------------------------------------
   La bombilla

   Igual que en el menú del juego: la página abre a oscuras y hay que pulsar
   la farola. Quien no quiera jugar a eso tiene el enlace de debajo, y quien
   llegue con un ancla a un capítulo concreto se la encuentra ya encendida,
   porque viene a leer ese capítulo y no a la portada.
   ---------------------------------------- */
const bulb = document.getElementById('ab-bulb');

function lightUp() {
  if (body.classList.contains('is-lit')) return;
  body.classList.remove('is-dark');
  body.classList.add('is-lit');
  bulb?.setAttribute('aria-pressed', 'true');
}

bulb?.addEventListener('click', lightUp);

document.querySelector('.ab-cover__skip')?.addEventListener('click', lightUp);

/* Una bombilla parpadeando es exactamente lo que alguien que ha pedido quieto
   el movimiento no quiere ver. */
if (stillness.matches) lightUp();

/* Llegar directo a un capítulo, desde un enlace compartido o desde el menú. */
if (location.hash && location.hash !== '#cover') lightUp();

/* El teclado también: si alguien tabula hasta dentro del libro sin haber
   pasado por la farola, encenderla es lo cortés. */
document.querySelector('.ab-main')?.addEventListener('focusin', lightUp);

/* ----------------------------------------
   Animación por fotogramas

   Los personajes tienen sus cuatro dibujos sueltos en disco, así que se
   reproducen tal cual, cambiando la imagen a los fotogramas por segundo que
   diga la marca. Nada de intermedios: entre dos dibujos de dieciséis píxeles
   no hay nada que interpolar.

   Solo se mueven mientras se les ve. Un artbook con treinta bucles corriendo
   a la vez calienta el portátil para nada.
   ---------------------------------------- */
const BASE = 'assets/images/artbook/pieces/';

document.querySelectorAll('[data-frames]').forEach(img => {
  const frames = img.dataset.frames.split(',').map(n => BASE + n.trim());
  if (frames.length < 2) return;

  const fps = Number(img.dataset.fps) || 6;
  let timer = null;
  let i = 0;

  // Que el primer salto no se note: las imágenes ya están en memoria.
  frames.forEach(src => { new Image().src = src; });

  function play() {
    if (timer || stillness.matches) return;
    timer = setInterval(() => {
      i = (i + 1) % frames.length;
      img.src = frames[i];
    }, 1000 / fps);
  }

  function pause() {
    clearInterval(timer);
    timer = null;
  }

  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) play();
    else pause();
  }, { threshold: 0.1 }).observe(img);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause();
  });
});

/* ----------------------------------------
   Claro y oscuro

   La mecánica del juego como mando del libro: la misma silueta, el otro
   color. Las piezas pequeñas responden también al ratón por encima, que eso
   lo lleva la hoja de estilos; aquí va el clic, que es lo único que funciona
   con el dedo.
   ---------------------------------------- */
document.querySelectorAll('[data-compare]').forEach(stage => {
  const button = stage.closest('figure')?.querySelector('[data-compare-btn]');

  function flip() {
    const on = stage.classList.toggle('is-b');
    button?.classList.toggle('is-b', on);
  }

  stage.addEventListener('click', flip);
  button?.addEventListener('click', flip);
});
