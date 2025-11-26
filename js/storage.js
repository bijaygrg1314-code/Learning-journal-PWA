// ===================================
// NOTE: JOURNAL ENTRY PERSISTENCE (LocalStorage)
// HAS BEEN DISABLED for Lab 5.
// Entries are now managed via Python/JSON file.
// ===================================

// Theme persistence (Kept Active)
function saveThemePreference(isDark) {
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

function loadThemePreference() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    return true;
  }
  return false;
}

// Apply persisted theme immediately
loadThemePreference();

// ===================================
// DISABLED JOURNAL ENTRY FUNCTIONS BELOW
// All functions related to entries are now placeholder stubs 
// to prevent runtime errors from other scripts.
// ===================================

function getEntries() {
  console.warn("getEntries() is disabled. Data is managed by reflections.json now.");
  return []; 
}

function setEntries(entries) { 
  console.warn("setEntries() is disabled."); 
}

function saveJournalEntry(text) { 
  console.warn("saveJournalEntry() is disabled. Use Python script."); 
}

function clearAllEntries() { 
  console.warn("clearAllEntries() is disabled.");
}

// ===== Render entries (Disabled) =====
function renderSavedEntries() {
  // This function is now entirely handled by json_data.js via fetchAndRenderJsonEntries()
}

// ===== Hook up form (Disabled) =====
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("journal-form");
  const textarea = document.getElementById("journal-text");
  const clearBtn = document.getElementById("clear-entries");

  // Prevent form submission and clearing entries
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Form submission is disabled. Use 'python backend/save_entry.py' to save entries.");
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      alert("Clear All Entries is disabled. Data is in the JSON file.");
    });
  }
});
