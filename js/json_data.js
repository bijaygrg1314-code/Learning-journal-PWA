// EXTRA FEATURE: Reflection Counter & JSON Fetching Logic

async function fetchAndRenderJsonEntries() {
  const container = document.getElementById("saved-entries");
  const countElement = document.getElementById("reflection-count");

  if (!container) return;

  // Display fetching status
  container.innerHTML = '<p>Fetching file-based entries...</p>';
  if (countElement) countElement.textContent = 'Total Reflections: 0 (Loading...)';

  try {
    // Fetch the JSON data from the backend directory
    const response = await fetch("backend/reflections.json");

    if (!response.ok) {
        // Fallback for when the file cannot be accessed (e.g., on GitHub Pages without a server)
        throw new Error(`HTTP error! Status: ${response.status}. Cannot load file-based entries.`);
    }

    // Parse the JSON data
    const entries = await response.json();

    // Clear the loading message and check data validity
    container.innerHTML = '';
    if (!Array.isArray(entries)) {
        throw new Error("JSON data is not a valid array.");
    }
    
    // EXTRA FEATURE: Update the reflection counter
    if (countElement) {
        countElement.textContent = `Total Reflections: ${entries.length}`;
    }

    // Render entries dynamically (most recent first)
    entries.slice().reverse().forEach(entry => {
      const card = document.createElement("div");
      card.className = "saved-entry";
      card.innerHTML = `
        <div class="meta">${entry.date}</div>
        <div class="text">${entry.text}</div>
      `;
      container.appendChild(card);
    });

  } catch (error) {
    console.error("Error fetching or rendering JSON entries:", error);
    // Display error message
    container.innerHTML = '<p style="color: #FF6F00;">Note: Could not load file-based entries. Run the Python script and serve locally to view.</p>';
    if (countElement) countElement.textContent = 'Total Reflections: 0 (Error)';
  }
}

// Execute the function when the DOM is fully loaded on the journal page
document.addEventListener("DOMContentLoaded", () => {
    // Only attempt to run if we are on the journal page
    if (document.getElementById("saved-entries")) {
        fetchAndRenderJsonEntries();
    }
});

// Remove LocalStorage functions since they are no longer used for entries
// in the context of the JSON file storage.
const getEntries = () => [];
const setEntries = () => {};
const saveJournalEntry = () => {};
const clearAllEntries = () => {};
