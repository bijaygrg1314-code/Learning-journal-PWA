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

// Highlight active page
const currentPage = window.location.pathname.split("/").pop();
document.querySelectorAll(".navbar a").forEach(link => {
  if (link.getAttribute("href") === currentPage) link.classList.add("active");
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

