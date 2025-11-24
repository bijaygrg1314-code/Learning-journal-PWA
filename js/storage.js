// Theme persistence
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

// Journal entries persistence
function getEntries() {
  return JSON.parse(localStorage.getItem("entries") || "[]");
}

function setEntries(entries) {
  localStorage.setItem("entries", JSON.stringify(entries));
}

function saveJournalEntry(text) {
  const entries = getEntries();
  entries.push({ text, date: new Date().toLocaleString() });
  setEntries(entries);
}

function clearAllEntries() {
  localStorage.removeItem("entries");
}

// ===== Render entries =====
function renderSavedEntries() {
  const container = document.getElementById("saved-entries");
  if (!container) return;
  container.innerHTML = "";

  const entries = getEntries();
  entries.slice().reverse().forEach((e, idx) => {
    const card = document.createElement("div");
    card.className = "saved-entry";
    card.innerHTML = `
      <div class="meta">${e.date}</div>
      <div class="text">${e.text}</div>
      <div class="entry-actions">
        <button class="copy-btn" data-index="${idx}">Copy</button>
        <button class="delete-btn" data-index="${idx}">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });

  // Copy buttons
  container.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.index, 10);
      const entries = getEntries();
      const item = entries[entries.length - 1 - idx]; // reversed view
      if (item && typeof copyToClipboard === "function") {
        copyToClipboard(item.text);
      }
    });
  });

  // Delete buttons
  container.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const idx = parseInt(btn.dataset.index, 10);
      const entries = getEntries();
      entries.splice(entries.length - 1 - idx, 1); // reversed view
      setEntries(entries);
      renderSavedEntries();

      // Notify on delete
      if (typeof notifyDeleted === "function") {
        await notifyDeleted("Entry deleted!");
      }
    });
  });
}

// ===== Hook up form =====
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("journal-form");
  const textarea = document.getElementById("journal-text");
  const clearBtn = document.getElementById("clear-entries");

  if (form && textarea) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = textarea.value.trim();
      if (text.length < 10) {
        alert("Please write at least 10 words.");
        return;
      }
      saveJournalEntry(text);
      textarea.value = "";
      renderSavedEntries();

      // Notify on save
      if (typeof notifySaved === "function") {
        await notifySaved("Entry saved!");
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", async () => {
      if (confirm("Clear all saved entries?")) {
        clearAllEntries();
        renderSavedEntries();

        // Notify on clear
        if (typeof notifyDeleted === "function") {
          await notifyDeleted("All entries cleared!");
        }
      }
    });
  }

  renderSavedEntries();
});
