// app.js

document.addEventListener('DOMContentLoaded', (event) => {
  // HIDDEN ELEMENTS
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('show', entry.isIntersecting);
    });
  });

  document.querySelectorAll('.hidden').forEach(el => observer.observe(el));
});