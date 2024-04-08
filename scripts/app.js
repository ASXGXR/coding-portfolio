// app.js

document.addEventListener('DOMContentLoaded', (event) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'all 1s'; // Apply transition dynamically
        entry.target.classList.add('show');
      } else {
        entry.target.classList.remove('show');
        entry.target.style.transition = 'none'; // Remove transition when not in view
      }
    });
  }, {
    rootMargin: '0px 0px -215px 0px'
  });

  document.querySelectorAll('.hidden').forEach(el => observer.observe(el));
});
