// router.js

// Function to handle routing
function handleRoute(route) {
  // Load HTML content based on the route
  fetch(`${route}.html`)
    .then(response => response.text())
    .then(html => {
      document.getElementById('content').innerHTML = html;
    })
    .catch(() => {
      // Handle 404 - page not found
      document.getElementById('content').innerHTML = '<h1>404 - Page Not Found</h1>';
    });
}

// Function to parse the hash and handle routing
function handleHashChange() {
  const path = window.location.hash.substr(1) || '/'; // Get the current URL hash
  handleRoute(path); // Call handleRoute function with the path
}

// Listen for hashchange event and call handleHashChange function
window.addEventListener('hashchange', handleHashChange);

// Call handleHashChange function on page load
window.addEventListener('load', handleHashChange);
