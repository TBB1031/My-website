// main.js — complete, no placeholders
(() => {
  // Helpers
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // DOM elements
  const navToggle = $('#nav-toggle');
  const navMenu = $('#nav-menu');
  const themeToggle = $('#theme-toggle');
  const form = $('#contact-form');
  const feedback = $('#form-feedback');
  const yearSpan = $('#year');

  // Set current year
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // MOBILE NAV TOGGLE
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('open');
    });

    // close on link click (mobile)
    navMenu.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // THEME TOGGLE (persist in localStorage)
  const root = document.documentElement;
  const preferred = localStorage.getItem('nebula-theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  function applyTheme(t) {
    if (t === 'light') {
      root.setAttribute('data-theme', 'light');
      themeToggle.setAttribute('aria-pressed', 'true');
    } else {
      root.removeAttribute('data-theme');
      themeToggle.setAttribute('aria-pressed', 'false');
    }
  }

  applyTheme(preferred);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem('nebula-theme', next);
    });
  }

  // Simple client-side contact form validation and submit simulation
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();
      feedback.textContent = '';
      const data = new FormData(form);
      const name = (data.get('name') || '').trim();
      const email = (data.get('email') || '').trim();
      const message = (data.get('message') || '').trim();

      let valid = true;

      if (name.length < 2) {
        showError('#name', 'Please enter your name (min 2 characters).');
        valid = false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('#email', 'Please enter a valid email address.');
        valid = false;
      }
      if (message.length < 10) {
        showError('#message', 'Message is too short (min 10 characters).');
        valid = false;
      }

      if (!valid) {
        feedback.textContent = 'Please fix the errors above.';
        feedback.classList.remove('success');
        return;
      }

      // Simulate send (no real network call)
      feedback.textContent = 'Sending…';
      feedback.classList.remove('success');

      // fake "send" with timeout
      setTimeout(() => {
        form.reset();
        feedback.textContent = 'Thanks! Your message has been received. (Demo only — no network call.)';
        feedback.classList.add('success');
      }, 800);
    });

    form.addEventListener('reset', () => {
      setTimeout(() => {
        clearErrors();
        feedback.textContent = '';
      }, 50);
    });
  }

  function showError(selector, message) {
    const el = $(selector);
    if (!el) return;
    const parent = el.closest('.form-row');
    if (!parent) return;
    const err = parent.querySelector('.error');
    if (err) err.textContent = message;
    el.setAttribute('aria-invalid', 'true');
    el.focus();
  }

  function clearErrors() {
    $$('.error').forEach(e => e.textContent = '');
    $$('#contact-form input, #contact-form textarea').forEach(i => i.removeAttribute('aria-invalid'));
  }

  // Small: allow details to toggle with keyboard Enter/Space on summary for consistent behavior
  document.querySelectorAll('details summary').forEach(summary => {
    summary.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        summary.parentElement.open = !summary.parentElement.open;
      }
    });
  });

  // Accessibility: close mobile menu on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (navMenu && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    }
  });

})();