
const JOURNAL_STORAGE_KEY = 'learningJournalEntries';
const JSON_DATA_PATH = '/backend/reflections.json';

// Enhanced Storage Manager Class - Includes both LocalStorage and JSON functionality
class JournalStorageManager {
    constructor() {
        this.localKey = JOURNAL_STORAGE_KEY;
        this.jsonPath = JSON_DATA_PATH;
    }

    // === EXISTING LOCALSTORAGE METHODS (Preserved) ===
    deleteEntry(id) {
        const entryId = parseInt(id); 
        let existingEntries = this.getLocalEntries();
        const updatedEntries = existingEntries.filter(entry => entry.id !== entryId);
        localStorage.setItem(this.localKey, JSON.stringify(updatedEntries));
        this.displayAllEntries();
    }

    saveEntry(title, content) {
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

    // === NEW JSON FILE METHODS ===
    async loadJSONEntries() {
        try {
            const response = await fetch(this.jsonPath); 
            
            if (!response.ok) {
                console.warn('Could not load JSON entries. HTTP Status:', response.status);
                return [];
            }
            
            const jsonEntries = await response.json();
            
            return jsonEntries.map((entry, index) => ({
                id: (9000000000000 + index), 
                title: entry.title || 'Python Reflection',
                content: entry.text || entry.content,
                date: entry.date,
                time: entry.time || '',
                source: 'python'
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
        
        const allEntries = [...localEntries, ...jsonEntries];
        return allEntries.sort((a, b) => b.id - a.id);
    }

    // === ENHANCED DISPLAY FUNCTION (Lab 5 Goal) ===
    async displayAllEntries() {
        const container = document.getElementById('saved-entries'); 
        if (!container) return;

        const entries = await this.getAllEntries();

        container.innerHTML = '';

        // Update statistics
        await this.updateStatistics();
        
        if (entries.length === 0) {
            container.innerHTML = `<p>No custom entries saved yet. Add entries using the form above or the Python script!</p>`;
            return;
        }

        entries.forEach(entry => {
            const sourceBadge = entry.source === 'python' 
                ? '<span class="source-badge python-badge" style="background-color: #FFA726;">Python/File</span>' 
                : '<span class="source-badge browser-badge" style="background-color: #FF6F00;">Browser/Local</span>';
            
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

        this.setupActionHandlers();
    }

    // === STATISTICS MANAGEMENT (Lab 5 Extra Feature) ===
    async updateStatistics() {
        try {
            const localEntries = this.getLocalEntries();
            const jsonEntries = await this.loadJSONEntries();
            
            const totalEntries = localEntries.length + jsonEntries.length;
            const browserEntries = localEntries.length;
            const pythonEntries = jsonEntries.length;
            
            // Calculate word counts
            const localWords = localEntries.reduce((sum, entry) => 
                sum + (entry.content || '').split(/\s+/).length, 0);
            const jsonWords = jsonEntries.reduce((sum, entry) => 
                sum + (entry.content || '').split(/\s+/).length, 0);
            const totalWords = localWords + jsonWords;

            // Update statistics cards
            this.updateStatCard('total-entries', totalEntries);
            this.updateStatCard('browser-entries', browserEntries);
            this.updateStatCard('python-entries', pythonEntries);
            this.updateStatCard('total-words', totalWords);

            // Update reflection count
            const countElement = document.getElementById('reflection-count');
            if (countElement) {
                countElement.innerHTML = `Total Reflections: <strong>${totalEntries}</strong> (Browser: ${browserEntries}, Python: ${pythonEntries})`;
            }

        } catch (error) {
            console.error('Error updating statistics:', error);
        }
    }

    updateStatCard(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) element.textContent = value;
    }

    // === JSON EXPORT FUNCTIONALITY ===
    async exportJSONData() {
        try {
            const jsonEntries = await this.loadJSONEntries();
            const dataStr = JSON.stringify(jsonEntries, null, 2);
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

    // === SEARCH FUNCTIONALITY ===
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
            container.innerHTML = '<p>No entries found matching your search.</p>';
            return;
        }

        filteredEntries.forEach(entry => {
            const sourceBadge = entry.source === 'python' 
                ? '<span class="source-badge python-badge" style="background-color: #FFA726;">Python/File</span>' 
                : '<span class="source-badge browser-badge" style="background-color: #FF6F00;">Browser/Local</span>';
            
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
                if (typeof copyToClipboard === "function") {
                   copyToClipboard(content);
                }
            });
        });
    }

    // === REFRESH DATA ===
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
    // 1. Initial display of all entries (local + JSON)
    journalManager.displayAllEntries();

    // 2. Setup form submission handler for LocalStorage entries
    const form = document.getElementById('journal-form');
    const textarea = document.getElementById('journal-text');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            const content = textarea.value.trim();
            const title = 'Manual Entry';

            if (content.length < 10) {
                alert("Please write at least 10 words.");
                return;
            }
            
            // Save to LocalStorage
            journalManager.saveEntry(title, content);
            textarea.value = "";
            
            // Re-display the merged list
            journalManager.displayAllEntries(); 

            // Notify on save
            if (typeof notifySaved === "function") {
                await notifySaved("Browser entry saved!");
            }
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
            } else {
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
