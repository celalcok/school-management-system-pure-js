import {languages} from "./lang.js"
export let lang = localStorage.getItem('language') || 'en';
export function getText(key) {
  return languages[lang][key] || key;
}

export function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = getText(key);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = translation;
    } else {
      el.textContent = translation;
    }
  });
}
export function setLanguage(newLang) {
  lang = newLang;
  localStorage.setItem('language', lang);
  applyTranslations();
}