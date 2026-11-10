/* ========================================
   Language

   The site says everything twice. Each piece of text exists in Spanish and in
   English, side by side in the markup, and the stylesheet hides whichever one
   does not match the lang attribute on <html>. No dictionary to keep in sync
   with the content, the page prints in the chosen language, and if this script
   never loads the page still reads — it just shows both.

   The choice is remembered, and the first visit follows the browser.
   ======================================== */

const SUPPORTED = ['en', 'es'];

function preferredLang() {
  const saved = localStorage.getItem('lang');
  if (SUPPORTED.includes(saved)) return saved;
  const first = (navigator.languages || [navigator.language || 'en'])[0] || 'en';
  return first.toLowerCase().startsWith('es') ? 'es' : 'en';
}

/* Attributes cannot be duplicated the way visible text can, so the few that
   carry words — alt, title, placeholder — name both versions and get swapped
   here. */
const SWAPPED = ['alt', 'title', 'placeholder', 'aria-label', 'content'];

function applyLang(lang) {
  document.documentElement.lang = lang;
  const other = lang === 'es' ? 'en' : 'es';

  SWAPPED.forEach(attr => {
    document.querySelectorAll(`[data-${attr}-${lang}]`).forEach(el => {
      el.setAttribute(attr, el.dataset[toKey(attr, lang)]);
    });
  });

  document.querySelectorAll('.lang-toggle').forEach(btn => {
    /* The button shows the language it switches to, not the current one. */
    btn.textContent = other.toUpperCase();
    btn.setAttribute('aria-label', lang === 'es' ? 'Switch to English' : 'Cambiar a español');
  });

  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

/* data-alt-es -> dataset.altEs, data-aria-label-en -> dataset.ariaLabelEn */
function toKey(attr, lang) {
  return (attr + '-' + lang)
    .split('-')
    .map((part, i) => (i === 0 ? part : part[0].toUpperCase() + part.slice(1)))
    .join('');
}

function setLang(lang) {
  if (!SUPPORTED.includes(lang)) return;
  localStorage.setItem('lang', lang);
  applyLang(lang);
}

window.setLang = setLang;
window.getLang = () => (SUPPORTED.includes(document.documentElement.lang) ? document.documentElement.lang : 'en');

applyLang(preferredLang());

document.querySelectorAll('.lang-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    setLang(document.documentElement.lang === 'es' ? 'en' : 'es');
  });
});
