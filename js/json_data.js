// Function to fetch and render entries from the JSON file
async function fetchAndRenderJsonEntries() {
  const container = document.getElementById("saved-entries");
  // Check if the container element exists on the page
  if (!container) return;

  // Clear existing LocalStorage entries display
  container.innerHTML = 'Fetching file-based entries...';

  try {
    // 1. Fetch the JSON data from the backend directory
    [span_0](start_span)const response = await fetch("backend/reflections.json");[span_0](end_span)
    
    // Check for a successful HTTP response
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // 2. Parse the JSON data
    [span_1](start_span)const entries = await response.json();[span_1](end_span)

    // Clear the loading message
    container.innerHTML = '';
    
    // Check if the fetched data is an array
    if (!Array.isArray(entries)) {
        throw new Error("JSON data is not a valid array.");
    }

    // 3. Render entries dynamically (most recent first)
    entries.slice().reverse().forEach(entry => {
      const card = document.createElement("div");
      card.className = "saved-entry";
      // Using existing styling classes
      card.innerHTML = `
        <div class="meta">${entry.date}</div>
        <div class="text">${entry.text}</div>
      [span_2](start_span)`;[span_2](end_span)
      container.appendChild(card);
    });

  } catch (error) {
    console.error("Error fetching or rendering JSON entries:", error);
    container.innerHTML = '<p style="color: red;">Could not load file-based entries. Ensure Python script has been run and server is active.</p>';
  }
}

// Execute the function when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", fetchAndRenderJsonEntries);

