const JOURNAL_STORAGE_KEY = 'learningJournalEntries';
// const JSON_DATA_PATH = 'backend/reflections.json'; // Removed, replaced by Flask API route
const FLASK_API_PATH = '/api/reflections'; // New constant for Flask route

// Enhanced Storage Manager Class - Includes LocalStorage and FLASK functionality
class JournalStorageManager {
    constructor() {
        this.localKey = JOURNAL_STORAGE_KEY;
        // this.jsonPath = JSON_DATA_PATH; // No longer needed
    }

    // === EXISTING LOCALSTORAGE METHODS (Preserved) ===
    deleteEntry(id) {
        const entryId = parseInt(id);
        let existingEntries = this.getLocalEntries();
        const updatedEntries = existingEntries.filter(entry => entry.id !== entryId);
        localStorage.setItem(this.localKey, JSON.stringify(updatedEntries));

        // Notify and re-display
        if (typeof notifyDeleted === "function") {
            notifyDeleted("Browser entry deleted!");
        }
        this.displayAllEntries();
    }

    // This method is now only called when the user explicitly saves a LocalStorage entry.
    saveLocalEntry(title, content) {
        const existingEntries = this.getLocalEntries();

        const newEntry = {
            id: Date.now(),
            title: title,
            content: content,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            source: 'browser'
        };

        existingEntries.unshift(newEntry);
        localStorage.setItem(this.localKey, JSON.stringify(existingEntries));

        // Update statistics after saving
        this.updateStatistics();
    }

    getLocalEntries() {
        return JSON.parse(localStorage.getItem(this.localKey)) || [];
    }

    // === NEW FLASK API METHODS (Replaces JSON File loading) ===
    async loadFlaskEntries() {
        try {
            // Fetch reflections from the Flask GET route
            const response = await fetch(FLASK_API_PATH);

            if (!response.ok) {
                console.warn('Could not load Flask entries. HTTP Status:', response.status);
                // Graceful fallback for GitHub Pages (Same-Origin Policy failure)
                return [];
            }

            const jsonEntries = await response.json();

            return jsonEntries.map((entry, index) => ({
                id: (9000000000000 + index), // High ID for sorting
                title: entry.name || 'Flask Reflection',
                // Use the 'reflection' key from the Flask JSON structure
                content: entry.reflection || 'No content',
                date: entry.date,
                time: entry.time || '',
                source: 'flask' // Identify as Flask/Server entry
            }));
        } catch (error) {
            console.error('Flask fetch or parsing error:', error);
            return [];
        }
    }

    // Function to save a new reflection to the Flask backend (POST method)
    async saveReflectionToFlask(name, reflection) {
        try {
            // Data structure must match what flask_app.py expects (name, reflection)
            const entry = { name: name, reflection: reflection };

            const response = await fetch(FLASK_API_PATH, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(entry)
            });

            if (!response.ok) {
                console.error('Failed to save reflection via Flask. Status:', response.status);
                alert("Failed to save to Flask backend.");
                return false;
            }

            // const newEntry = await response.json(); // Optionally read the response
            return true;

        } catch (error) {
            console.error('Error saving reflection to Flask:', error);
            alert("An error occurred while communicating with the Flask server.");
            return false;
        }
    }


    // === DATA MERGING, SORTING, AND DEDUPLICATION ===
    async getAllEntries() {
        const localEntries = this.getLocalEntries();
        // CALL THE NEW FLASK LOADING METHOD
        const flaskEntries = await this.loadFlaskEntries();

        // Merge local and flask entries
        const allEntries = [...localEntries, ...flaskEntries];
        return allEntries.sort((a, b) => b.id - a.id);
    }

    // === ENHANCED DISPLAY FUNCTION (Updated for 'flask' source) ===
    async displayAllEntries() {
        const container = document.getElementById('saved-entries');
        if (!container) return;

        container.innerHTML = `<div class="loading">Loading entries...</div>`;

        const entries = await this.getAllEntries();

        container.innerHTML = '';

        // Update statistics
        await this.updateStatistics();

        if (entries.length === 0) {
            container.innerHTML = `<p class="empty-state">No custom entries saved yet. Add entries using the form above or the Python script!</p>`;
            return;
        }

        entries.forEach(entry => {
            const isFlask = entry.source === 'flask';

            const sourceBadge = isFlask
                ? `<span class="source-badge python-badge">Server/Flask</span>`
                : `<span class="source-badge browser-badge">Browser/Local</span>`;

            const card = document.createElement("div");
            card.className = `saved-entry ${isFlask ? 'python-entry' : 'browser-entry'}`; // Added classes for CSS styling
            card.setAttribute('data-entry-id', entry.id);
            card.setAttribute('data-source', entry.source);

            const deleteButtonHtml = isFlask
                ? '<span class="delete-hint">(Server entry)</span>'
                : `<button class="delete-btn" data-entry-id="${entry.id}">Delete</button>`;

            card.innerHTML = `
                <div class="entry-header">
                    <div class="meta">
                        <span>${entry.date} ${entry.time}</span>
                        ${sourceBadge}
                        <span class="word-count">${(entry.content || '').split(/\s+/).length} words</span>
                    </div>
                </div>
                <div class="entry-content">${entry.content}</div>
                <div class="entry-actions">
                    <button class="copy-btn" data-content="${entry.content}">Copy</button>
                    ${deleteButtonHtml}
                </div>
            `;
            container.appendChild(card);
        });

        this.setupActionHandlers();
    }

    // === STATISTICS MANAGEMENT (Updated for 'flask' source) ===
    async updateStatistics() {
        try {
            const localEntries = this.getLocalEntries();
            const flaskEntries = await this.loadFlaskEntries(); // Use the Flask loader

            const totalEntries = localEntries.length + flaskEntries.length;
            const browserEntries = localEntries.length;
            const pythonEntries = flaskEntries.length; // Now correctly counts Flask entries

            // Calculate word counts
            const localWords = localEntries.reduce((sum, entry) =>
                sum + (entry.content || '').split(/\s+/).length, 0);
            const flaskWords = flaskEntries.reduce((sum, entry) =>
                sum + (entry.content || '').split(/\s+/).length, 0);
            const totalWords = localWords + flaskWords;

            // Update statistics cards
            this.updateStatCard('total-entries', totalEntries);
            this.updateStatCard('browser-entries', browserEntries);
            this.updateStatCard('python-entries', pythonEntries);
            this.updateStatCard('total-words', totalWords);

            // Update reflection count
            const countElement = document.getElementById('reflection-count');
            if (countElement) {
                countElement.innerHTML = `Total Reflections: <strong>${totalEntries}</strong> (Browser: ${browserEntries}, Server: ${pythonEntries})`;
            }

        } catch (error) {
            console.error('Error updating statistics:', error);
        }
    }

    updateStatCard(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) element.textContent = value;
    }

    // === JSON EXPORT FUNCTIONALITY (Now exports Flask/Server data) ===
    async exportJSONData() {
        try {
            const flaskEntries = await this.loadFlaskEntries(); // Exports Server data

            const dataStr = JSON.stringify(flaskEntries, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });

            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `learning-journal-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            return true;
        } catch (error) {
            console.error('Export failed:', error);
            return false;
        }
    }

    // === SEARCH FUNCTIONALITY (Unchanged) ===
    async searchEntries(searchTerm) {
        const container = document.getElementById('saved-entries');
        const allEntries = await this.getAllEntries();

        if (!searchTerm) {
            this.displayAllEntries();
            return;
        }

        const filteredEntries = allEntries.filter(entry =>
            (entry.content || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

        container.innerHTML = '';
        if (filteredEntries.length === 0) {
            container.innerHTML = '<p class="empty-state">No entries found matching your search.</p>';
            return;
        }

        filteredEntries.forEach(entry => {
            const isFlask = entry.source === 'flask';

            const sourceBadge = isFlask
                ? `<span class="source-badge python-badge">Server/Flask</span>`
                : `<span class="source-badge browser-badge">Browser/Local</span>`;

            const card = document.createElement("div");
            card.className = `saved-entry ${isFlask ? 'python-entry' : 'browser-entry'}`;
            card.setAttribute('data-entry-id', entry.id);
            card.setAttribute('data-source', entry.source);

            const deleteButtonHtml = isFlask
                ? '<span class="delete-hint">(Server entry)</span>'
                : `<button class="delete-btn" data-entry-id="${entry.id}">Delete</button>`;

            card.innerHTML = `
                <div class="entry-header">
                    <div class="meta">
                        <span>${entry.date} ${entry.time}</span>
                        ${sourceBadge}
                        <span class="word-count">${(entry.content || '').split(/\s+/).length} words</span>
                    </div>
                </div>
                <div class="entry-content">${entry.content}</div>
                <div class="entry-actions">
                    <button class="copy-btn" data-content="${entry.content}">Copy</button>
                    ${deleteButtonHtml}
                </div>
            `;
            container.appendChild(card);
        });

        this.setupActionHandlers();
    }

    // === ACTION HANDLERS SETUP (Unchanged) ===
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
                if (typeof copyToClipboard === "function") {
                   copyToClipboard(content);
                }
            });
        });
    }

    // === REFRESH DATA (Unchanged) ===
    async refreshData() {
        await this.displayAllEntries();
        if (typeof notifySaved === 'function') {
            notifySaved('Data refreshed successfully!');
        }
    }
}

// Initialize the enhanced storage manager
const journalManager = new JournalStorageManager();

// Function to attach initial DOM event handlers (run once)
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial display of all entries (local + Flask)
    journalManager.displayAllEntries();

    // 2. Setup form submission handler
    const form = document.getElementById('journal-form');
    const textarea = document.getElementById('journal-text');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const content = textarea.value.trim();
            const name = 'Browser Submission'; // Default name for the Flask entry

            if (content.length < 10) {
                alert("Please write at least 10 characters.");
                return;
            }

            // --- NEW: Save to Flask backend ---
            // Note: If you want to keep LocalStorage save for the form, use journalManager.saveLocalEntry(name, content);
            const success = await journalManager.saveReflectionToFlask(name, content);

            if (success) {
                textarea.value = "";
                // Re-display the merged list
                journalManager.displayAllEntries();

                // Notify on save
                if (typeof notifySaved === "function") {
                    await notifySaved("Server entry saved via Flask!");
                }
            }
            // --- END NEW ---
        });
    }

    // 3. Setup Clear Form button
    const clearFormBtn = document.getElementById('clear-form');
    if (clearFormBtn && textarea) {
        clearFormBtn.addEventListener('click', () => {
            textarea.value = '';
            textarea.focus();
        });
    }

    // 4. Setup Search functionality
    const searchInput = document.getElementById('search-entries');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            journalManager.searchEntries(e.target.value);
        });
    }

    // 5. Setup Export JSON button
    const exportBtn = document.getElementById('export-json');
    if (exportBtn) {
        exportBtn.addEventListener('click', async () => {
            const success = await journalManager.exportJSONData();
            if (success && typeof notifySaved === 'function') {
                notifySaved('Journal data exported successfully!');
            } else if (!success) {
                alert('Export failed. Please try again.');
            }
        });
    }

    // 6. Setup Refresh Data button
    const refreshBtn = document.getElementById('refresh-data');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            journalManager.refreshData();
        });
    }

    // 7. Setup Clear All (Disabled, as requested by lab)
    document.getElementById('clear-entries')?.addEventListener('click', () => {
        alert("Clearing all entries is disabled. Please delete individual LocalStorage entries.");
    });
});
