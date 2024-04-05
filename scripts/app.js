// app.js

document.addEventListener('DOMContentLoaded', (event) => {
  // HIDDEN ELEMENTS
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      } else {
        entry.target.classList.remove('show');
      }
    });
  }, {
    rootMargin: '0px 0px -250px 0px'
  });

  document.querySelectorAll('.hidden').forEach(el => observer.observe(el));
});