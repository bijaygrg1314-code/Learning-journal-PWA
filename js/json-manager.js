
// JSON Data Manager for Learning Journal PWA
class JSONDataManager {
    constructor() {
        this.jsonPath = 'backend/reflections.json';
        this.entries = [];
    }

    // Fetch JSON data from the backend
    async fetchJSONData() {
        try {
            console.log('📡 Fetching JSON data from:', this.jsonPath);
            const response = await fetch(this.jsonPath);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.entries = await response.json();
            console.log('✅ JSON data loaded successfully:', this.entries.length, 'entries');
            return this.entries;
            
        } catch (error) {
            console.warn(' Could not load JSON data:', error.message);
            console.log(' This is expected when running on GitHub Pages or if the file does not exist locally.');
            this.entries = [];
            return this.entries;
        }
    }

    // Get all entries with enhanced metadata
    async getAllEntries() {
        await this.fetchJSONData();
        return this.entries.map((entry, index) => ({
            id: `json-${index}-${entry.date}`,
            date: entry.date,
            text: entry.text,
            source: 'python',
            type: 'reflection'
        }));
    }

    // Get entry count
    async getEntryCount() {
        await this.fetchJSONData();
        return this.entries.length;
    }

    // Filter entries by keyword
    async filterEntries(keyword) {
        const entries = await this.getAllEntries();
        if (!keyword) return entries;
        
        const searchTerm = keyword.toLowerCase();
        return entries.filter(entry => 
            entry.text.toLowerCase().includes(searchTerm) ||
            entry.date.toLowerCase().includes(searchTerm)
        );
    }

    // Get entries from specific date
    async getEntriesByDate(dateString) {
        const entries = await this.getAllEntries();
        return entries.filter(entry => entry.date.startsWith(dateString));
    }

    // Export JSON data as downloadable file
    async exportJSONData() {
        try {
            const dataStr = JSON.stringify(this.entries, null, 2);
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

    // Get statistics about entries
    async getStatistics() {
        const entries = await this.getAllEntries();
        const wordCounts = entries.map(entry => entry.text.split(/\s+/).length);
        const totalWords = wordCounts.reduce((sum, count) => sum + count, 0);
        
        return {
            totalEntries: entries.length,
            totalWords: totalWords,
            averageWords: entries.length > 0 ? Math.round(totalWords / entries.length) : 0,
            earliestEntry: entries.length > 0 ? entries[entries.length - 1].date : null,
            latestEntry: entries.length > 0 ? entries[0].date : null
        };
    }
}

// Enhanced Storage Manager that integrates JSON data
class EnhancedStorageManager {
    constructor() {
        this.localKey = 'learningJournalEntries';
        this.jsonManager = new JSONDataManager();
    }

    // Get all entries from both sources
    async getAllEntries() {
        const localEntries = this.getLocalEntries();
        const jsonEntries = await this.jsonManager.getAllEntries();
        
        // Combine and sort by date (newest first)
        const allEntries = [...localEntries, ...jsonEntries];
        return allEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Get local storage entries
    getLocalEntries() {
        const entries = JSON.parse(localStorage.getItem(this.localKey)) || [];
        return entries.map(entry => ({
            ...entry,
            source: 'browser'
        }));
    }

    // Save to local storage
    saveToLocalStorage(title, content) {
        const existingEntries = this.getLocalEntries();
        const newEntry = {
            id: Date.now(),
            title: title,
            content: content,
            date: new Date().toISOString(),
            source: 'browser'
        };

        existingEntries.unshift(newEntry);
        localStorage.setItem(this.localKey, JSON.stringify(existingEntries));
        return newEntry;
    }

    // Delete from local storage
    deleteFromLocalStorage(id) {
        const entries = this.getLocalEntries();
        const updatedEntries = entries.filter(entry => entry.id !== id);
        localStorage.setItem(this.localKey, JSON.stringify(updatedEntries));
    }

    // Display all entries with enhanced features
    async displayAllEntries() {
        const container = document.getElementById('saved-entries');
        const countElement = document.getElementById('reflection-count');
        
        if (!container) return;

        const entries = await this.getAllEntries();
        
        // Update counter with enhanced statistics
        if (countElement) {
            const stats = await this.jsonManager.getStatistics();
            countElement.innerHTML = `
                Total Reflections: <strong>${entries.length}</strong> 
                (Browser: ${entries.filter(e => e.source === 'browser').length}, 
                Python: ${stats.totalEntries}) 
                | Words: ${stats.totalWords}
            `;
        }

        // Clear container
        container.innerHTML = '';

        if (entries.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p> No journal entries yet.</p>
                    <p>Add entries using the Python script or the browser form!</p>
                    <div class="action-hint">
                        <strong>Run in terminal:</strong>
                        <code>python backend/save_entry.py</code>
                    </div>
                </div>
            `;
            return;
        }

        // Render each entry
        entries.forEach(entry => {
            const entryElement = this.createEntryElement(entry);
            container.appendChild(entryElement);
        });

        this.setupEventHandlers();
    }

    // Create individual entry element
    createEntryElement(entry) {
        const card = document.createElement('div');
        card.className = `saved-entry ${entry.source}-entry`;
        card.setAttribute('data-entry-id', entry.id);
        card.setAttribute('data-source', entry.source);

        const sourceBadge = entry.source === 'python' 
            ? '<span class="source-badge python-badge"> Python/File</span>'
            : '<span class="source-badge browser-badge"> Browser/Local</span>';

        const wordCount = entry.text?.split(/\s+/).length || entry.content?.split(/\s+/).length || 0;

        card.innerHTML = `
            <div class="entry-header">
                <div class="meta">
                    ${new Date(entry.date).toLocaleString()} 
                    ${sourceBadge}
                    <span class="word-count">${wordCount} words</span>
                </div>
            </div>
            <div class="entry-content">
                ${entry.text || entry.content}
            </div>
            <div class="entry-actions">
                <button class="copy-btn" data-content="${entry.text || entry.content}">
                    📋 Copy
                </button>
                ${entry.source === 'browser' 
                    ? `<button class="delete-btn" data-entry-id="${entry.id}">🗑️ Delete</button>`
                    : '<span class="file-entry-note">(File-based - edit via Python)</span>'
                }
            </div>
        `;

        return card;
    }

    // Setup event handlers for interactive elements
    setupEventHandlers() {
        // Copy buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const content = btn.getAttribute('data-content');
                if (typeof copyToClipboard === 'function') {
                    await copyToClipboard(content);
                }
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const entryId = parseInt(e.target.getAttribute('data-entry-id'));
                if (confirm('Are you sure you want to delete this browser entry?')) {
                    this.deleteFromLocalStorage(entryId);
                    this.displayAllEntries();
                    if (typeof notifyDeleted === 'function') {
                        notifyDeleted('Entry deleted successfully!');
                    }
                }
            });
        });
    }

    // Search/filter functionality
    async searchEntries(searchTerm) {
        const container = document.getElementById('saved-entries');
        const allEntries = await this.getAllEntries();
        
        if (!searchTerm) {
            this.displayAllEntries();
            return;
        }

        const filteredEntries = allEntries.filter(entry => {
            const content = (entry.text || entry.content || '').toLowerCase();
            return content.includes(searchTerm.toLowerCase());
        });

        container.innerHTML = '';
        if (filteredEntries.length === 0) {
            container.innerHTML = '<p>No entries found matching your search.</p>';
            return;
        }

        filteredEntries.forEach(entry => {
            const entryElement = this.createEntryElement(entry);
            container.appendChild(entryElement);
        });

        this.setupEventHandlers();
    }
}

// Initialize the enhanced storage manager
const storageManager = new EnhancedStorageManager();

// Export functionality for the JSON data
async function exportJournalData() {
    const success = await storageManager.jsonManager.exportJSONData();
    if (success && typeof notifySaved === 'function') {
        notifySaved('Journal data exported successfully!');
    } else {
        alert('Export failed. Please try again.');
    }
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-entries');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            storageManager.searchEntries(e.target.value);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log(' Initializing Enhanced Journal PWA...');
    
    // Display all entries
    await storageManager.displayAllEntries();
    
    // Setup search functionality
    setupSearch();
    
    // Setup form handler (for browser entries)
    const form = document.getElementById('journal-form');
    const textarea = document.getElementById('journal-text');
    
    if (form && textarea) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const content = textarea.value.trim();
            
            if (content.length < 10) {
                alert('Please write at least 10 characters for your reflection.');
                return;
            }
            
            storageManager.saveToLocalStorage('Manual Entry', content);
            textarea.value = '';
            
            await storageManager.displayAllEntries();
            
            if (typeof notifySaved === 'function') {
                await notifySaved('Browser entry saved successfully!');
            }
        });
    }

    // Setup export button
    const exportBtn = document.getElementById('export-json');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportJournalData);
    }

    console.log(' Enhanced Journal PWA initialized successfully!');
});