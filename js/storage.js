const JOURNAL_STORAGE_KEY = 'learningJournalEntries';
const JSON_DATA_PATH = 'backend/reflections.json'; // Adjusted path for better compatibility

// Enhanced Storage Manager Class
class JournalStorageManager {
    constructor() {
        this.localKey = JOURNAL_STORAGE_KEY;
    }

    // === EXISTING LOCALSTORAGE METHODS ===
    // Used to delete entries ONLY saved in the browser (source: 'browser')
    deleteEntry(id) {
        const entryId = parseInt(id); 
        let existingEntries = this.getLocalEntries();
        // Filter out the entry to delete
        const updatedEntries = existingEntries.filter(entry => entry.id !== entryId);
        localStorage.setItem(this.localKey, JSON.stringify(updatedEntries));
        // Re-display all entries (local + JSON)
        this.displayAllEntries();
    }

    // Used to save new entries ONLY to the browser (source: 'browser')
    saveEntry(title, content) {
        const existingEntries = this.getLocalEntries();

        const newEntry = {
            // Use Date.now() for unique ID for local entries
            id: Date.now(), 
            title: title,
            content: content,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            source: 'browser' // Label local entries
        };

        existingEntries.unshift(newEntry);
        localStorage.setItem(this.localKey, JSON.stringify(existingEntries));
    }

    getLocalEntries() {
        return JSON.parse(localStorage.getItem(this.localKey)) || [];
    }

    // === NEW JSON FILE METHODS ===
    async loadJSONEntries() {
        try {
            // Note: The path must be correct relative to journal.html
            const response = await fetch(JSON_DATA_PATH); 
            
            if (!response.ok) {
                // Return empty list if file not found (e.g., on GitHub Pages)
                console.warn('Could not load JSON entries. HTTP Status:', response.status);
                return [];
            }
            
            const jsonEntries = await response.json();
            
            // Add source identifier and a unique ID for JSON entries
            return jsonEntries.map((entry, index) => ({
                // Use a combination of index and a unique large number for ID
                id: (9000000000000 + index), 
                title: entry.title || 'Python Reflection', // Title may be missing from simple Python save
                content: entry.text || entry.content, // Use text if content is not available
                date: entry.date,
                time: entry.time || '',
                source: 'python' // Label file-based entries
            }));
        } catch (error) {
            console.error('JSON fetch or parsing error:', error);
            return [];
        }
    }

    // === DATA MERGING, SORTING, AND DEDUPLICATION ===
    async getAllEntries() {
        const localEntries = this.getLocalEntries();
        const jsonEntries = await this.loadJSONEntries();
        
        // Combine all entries
        const allEntries = [...localEntries, ...jsonEntries];
        
        // Sort by ID (newest first)
        return allEntries.sort((a, b) => b.id - a.id);
    }

    // === ENHANCED DISPLAY FUNCTION (Lab 5 Goal) ===
    async displayAllEntries() {
        // Renamed container ID to match the old project structure
        const container = document.getElementById('saved-entries'); 
        if (!container) return;

        const entries = await this.getAllEntries();

        // Clear existing content
        container.innerHTML = ''; 

        // Add entry counter and stats (Lab 5 Extra Feature)
        const browserEntries = entries.filter(e => e.source === 'browser').length;
        const pythonEntries = entries.filter(e => e.source === 'python').length;

        // Update the counter element
        const countElement = document.getElementById('reflection-count');
        if (countElement) {
            countElement.innerHTML = `Total entries: <strong>${entries.length}</strong> (Browser: ${browserEntries}, Python: ${pythonEntries})`;
        }
        
        if (entries.length === 0) {
            container.innerHTML = `<p>No custom entries saved yet. Add entries using the form above or the Python script!</p>`;
            return;
        }

        entries.forEach(entry => {
            const sourceBadge = entry.source === 'python' 
                ? '<span class="source-badge python-badge" style="background-color: #FFA726;">Python/File</span>' 
                : '<span class="source-badge browser-badge" style="background-color: #FF6F00;">Browser/Local</span>';
            
            // Render card using existing styling classes
            const card = document.createElement("div");
            card.className = "saved-entry";
            card.setAttribute('data-entry-id', entry.id);
            card.setAttribute('data-source', entry.source);

            card.innerHTML = `
                <div class="meta">${entry.date} ${entry.time} ${sourceBadge}</div>
                <div class="text">${entry.content}</div>
                <div class="entry-actions">
                    <button class="copy-btn" data-content="${entry.content}">Copy</button>
                    ${entry.source === 'browser' 
                        ? `<button class="delete-btn" data-entry-id="${entry.id}">Delete</button>`
                        : '<span class="delete-hint">(File-based entry)</span>'
                    }
                </div>
            `;
            container.appendChild(card);
        });

        // Re-attach listeners for the delete and copy buttons
        this.setupActionHandlers();
    }

    // === ACTION HANDLERS SETUP ===
    setupActionHandlers() {
        // Setup Delete Handler (Delegated)
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const entryId = event.target.dataset.entryId;
                if (confirm('Are you sure you want to delete this LocalStorage entry?')) {
                    this.deleteEntry(entryId);
                }
            });
        });

        // Setup Copy Handler (Delegated)
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const content = btn.parentElement.previousElementSibling.textContent;
                 // Assuming browser.js has copyToClipboard function
                if (typeof copyToClipboard === "function") {
                   copyToClipboard(content);
                }
            });
        });
    }
}

// Initialize the storage manager
const journalManager = new JournalStorageManager();

// Function to attach initial DOM event handlers (run once)
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial display of all entries (local + JSON)
    journalManager.displayAllEntries();

    // 2. Setup form submission handler for LocalStorage entries
    const form = document.getElementById('journal-form');
    const textarea = document.getElementById('journal-text');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            const content = textarea.value.trim();
            const title = 'Manual Entry'; // Simplification since your form only has content

            if (content.length < 10) {
                alert("Please write at least 10 words.");
                return;
            }
            
            // Save to LocalStorage
            journalManager.saveEntry(title, content);
            textarea.value = "";
            
            // Re-display the merged list
            journalManager.displayAllEntries(); 

            // Notify on save (assuming notifySaved from browser.js is available)
            if (typeof notifySaved === "function") {
                await notifySaved("Browser entry saved!");
            }
        });
    }

    // 3. Setup Clear All (Disabled, as requested by lab)
    document.getElementById('clear-entries')?.addEventListener('click', () => {
        alert("Clearing all entries is disabled. Please delete individual LocalStorage entries.");
    });
});
