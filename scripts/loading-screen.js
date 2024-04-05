// loading-script.js

let progress = 0;
const loadingText = document.querySelector('.percentage-counter');
const interval = setInterval(() => {
  progress += Math.floor(Math.random() * 4) + 1;; // Increment the progress
  loadingText.textContent = `${progress}%`;

  if (progress >= 100) {
    clearInterval(interval); // Stop the interval when progress reaches 100%
    document.getElementById('loading-screen').style.display = 'none'; // Hide the loading screen
  }
}, Math.floor(Math.random() * 70) + 1); // Update the progress every 70 milliseconds
