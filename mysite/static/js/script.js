// ===== Navigation =====
const navHTML = `
  <nav class="navbar">
    <a href="index.html">Home</a>
    <a href="journal.html">Journal</a>
    <a href="projects.html">Projects</a>
    <a href="about.html">About</a>
  </nav>
`;
document.querySelector("header").innerHTML = navHTML;

// Highlight active page (MODIFIED FOR FLASK ROUTES)
const currentPath = window.location.pathname;

document.querySelectorAll(".navbar a").forEach(link => {
  const linkHref = link.getAttribute("href");

  // 1. Check if the link's href matches the end of the current path
  if (currentPath.endsWith(linkHref)) {
    link.classList.add("active");
  }

  // 2. Special handling for the root route ('index.html' or '/')
  if (linkHref === 'index.html' && (currentPath === '/' || currentPath === '/index.html')) {
    link.classList.add("active");
  }
});

// ===== Live Date/Time =====
function updateDateTime() {
  const el = document.getElementById("date-time");
  if (el) el.textContent = new Date().toLocaleString();
}
setInterval(updateDateTime, 1000);

// ===== Theme Toggle =====
function insertThemeToggle() {
  const btn = document.createElement("button");
  btn.id = "theme-toggle";
  btn.textContent = "🌙";
  document.body.insertBefore(btn, document.querySelector("main"));

  if (window.loadThemePreference) {
    const isDark = loadThemePreference();
    if (isDark) btn.textContent = "☀️";
  }

  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    btn.textContent = isDark ? "☀️" : "🌙";
    if (window.saveThemePreference) saveThemePreference(isDark);
  });
}
insertThemeToggle();

// ===== Collapsibles (for journal page only) =====
document.querySelectorAll(".collapsible").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    const content = btn.nextElementSibling;
    content.style.display = content.style.display === "block" ? "none" : "block";
  });
});

// ===== Service Worker Registration (Lab 7) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Registering /sw.js at the root scope (handled by flask_app.py route)
        navigator.serviceWorker.register('/sw.js')
            .then((reg) => console.log('Service Worker Registered!', reg.scope))
            .catch((err) => console.log('Service Worker Failed:', err));
    });
}

// ===== Lab 7 Extra Feature: Offline Status Notification =====
function setupOfflineNotification() {
  // 1. Create the HTML element dynamically
  const notifyEl = document.createElement('div');
  notifyEl.id = 'offline-notification';
  document.body.appendChild(notifyEl);

  // 2. Function to update the UI
  function updateOnlineStatus() {
    if (navigator.onLine) {
      // Back Online
      notifyEl.textContent = "You are back online! 🌐";
      notifyEl.className = 'online';

      // Hide the "Online" message after 3 seconds
      setTimeout(() => {
        notifyEl.style.display = 'none';
        notifyEl.className = '';
      }, 3000);
    } else {
      // Went Offline
      notifyEl.textContent = "You are offline. Using cached mode. 📡";
      notifyEl.className = 'offline';
      notifyEl.style.display = 'block';
    }
  }

  // 3. Add Event Listeners
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
}

// Initialize the feature
document.addEventListener('DOMContentLoaded', setupOfflineNotification);
