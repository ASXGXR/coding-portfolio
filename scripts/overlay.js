// overlay.js

document.addEventListener('DOMContentLoaded', () => {
  const imageOverlay = document.getElementById('image-overlay');
  const fullScreenImage = document.getElementById('full-screen-image');
  const closeOverlay = document.getElementById('close-overlay');
  const imageDetails = document.querySelector('.image-details');
  const nav = document.querySelector('nav'); // Assuming you have a <nav> element for the navigation
  const track = document.getElementById("image-track");

  // Image click event handler
  track.addEventListener('click', e => {
    if (e.target.classList.contains('image') && !window.isTrackMoving) {
      const clickedImage = e.target;
      fullScreenImage.src = clickedImage.src;

      // Fetch and display the corresponding description from an HTML file
      const descriptionFilePath = clickedImage.dataset.description;
      fetch(descriptionFilePath)
        .then(response => response.text())
        .then(data => {
          imageDetails.innerHTML = data;

          // Initialize or preload any 3D models here if needed

          // Show the overlay
          imageOverlay.style.display = 'flex';
          setTimeout(() => {
            imageOverlay.classList.add('show');
            imageOverlay.scrollTop = 0; // Scroll to the top of the overlay
          }, 50);

          // Disable scrolling on the main page and hide the navigation
          document.body.style.overflow = 'hidden';
          if (nav) nav.style.display = 'none';
        });
    }
  });

  // Close button event handler
  closeOverlay.addEventListener('click', () => {
    closeOverlayFunction();
  });

  // Function to close the overlay
  function closeOverlayFunction() {
    imageOverlay.classList.remove('show');
    setTimeout(() => {
      imageOverlay.style.display = 'none';
      document.body.style.overflow = ''; // Enable scrolling on the main page
      if (nav) nav.style.display = ''; // Show the navigation, if it exists
    }, 500);
  }

  // Event listener for the Esc key
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === 27 && imageOverlay.classList.contains('show')) { // Check if Esc key is pressed
      closeOverlayFunction(); // Reuse the function to close the overlay
    }
  });
});
