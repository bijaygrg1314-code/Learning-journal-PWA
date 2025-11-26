
const JOURNAL_STORAGE_KEY = 'learningJournalEntries';
const JSON_DATA_PATH = 'backend/reflections.json';

// Enhanced Storage Manager Class
class JournalStorageManager {
    constructor() {
        this.localKey = JOURNAL_STORAGE_KEY;
    }

    // === EXISTING LOCALSTORAGE METHODS ===
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
        this.displayAllEntries();
    }

    getLocalEntries() {
        return JSON.parse(localStorage.getItem(this.localKey)) || [];
    }

    // === DEBUGGED JSON FILE METHODS ===
    async loadJSONEntries() {
        try {
            console.log('🔄 Attempting to fetch from:', this.jsonPath);
            
            const response = await fetch(JSON_DATA_PATH); 
            
            console.log('📡 Response status:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const jsonEntries = await response.json();
            console.log('✅ JSON data loaded:', jsonEntries);
            
            return jsonEntries.map((entry, index) => ({
                id: (9000000000000 + index), 
                title: entry.title || 'Python Reflection',
                content: entry.text || entry.content,
                date: entry.date,
                time: entry.time || '',
                source: 'python'
            }));
        } catch (error) {
            console.error('❌ JSON fetch failed:', error.message);
            console.log('💡 Check: File exists? Correct path? CORS issues?');
            return [];
        }
    }

    // === REST OF YOUR EXISTING CODE ===
    async getAllEntries() {
        const localEntries = this.getLocalEntries();
        const jsonEntries = await this.loadJSONEntries();
        
        const allEntries = [...localEntries, ...jsonEntries];
        return allEntries.sort((a, b) => b.id - a.id);
    }

    async displayAllEntries() {
        const container = document.getElementById('saved-entries'); 
        if (!container) return;

        const entries = await this.getAllEntries();
        container.innerHTML = '';

        // Update statistics
        await this.updateStatistics();
        
        if (entries.length === 0) {
            container.innerHTML = `<p>No entries saved yet. Add entries using the form or Python script!</p>`;
            return;
        }

        entries.forEach(entry => {
            const sourceBadge = entry.source === 'python' 
                ? '<span class="source-badge python-badge">Python/File</span>' 
                : '<span class="source-badge browser-badge">Browser/Local</span>';
            
            const card = document.createElement("div");
            card.className = "saved-entry";
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

    async updateStatistics() {
        try {
            const localEntries = this.getLocalEntries();
            const jsonEntries = await this.loadJSONEntries();
            
            const totalEntries = localEntries.length + jsonEntries.length;
            const browserEntries = localEntries.length;
            const pythonEntries = jsonEntries.length;
            
            // Update UI elements
            this.updateStatCard('total-entries', totalEntries);
            this.updateStatCard('browser-entries', browserEntries);
            this.updateStatCard('python-entries', pythonEntries);
            this.updateStatCard('total-words', this.calculateTotalWords(localEntries, jsonEntries));

            const countElement = document.getElementById('reflection-count');
            if (countElement) {
                countElement.innerHTML = `Total Reflections: <strong>${totalEntries}</strong> (Browser: ${browserEntries}, Python: ${pythonEntries})`;
            }

        } catch (error) {
            console.error('Error updating statistics:', error);
        }
    }

    calculateTotalWords(localEntries, jsonEntries) {
        const localWords = localEntries.reduce((sum, entry) => sum + (entry.content || '').split(/\s+/).length, 0);
        const jsonWords = jsonEntries.reduce((sum, entry) => sum + (entry.content || '').split(/\s+/).length, 0);
        return localWords + jsonWords;
    }

    updateStatCard(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) element.textContent = value;
    }

    setupActionHandlers() {
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const entryId = event.target.dataset.entryId;
                if (confirm('Delete this LocalStorage entry?')) {
                    this.deleteEntry(entryId);
                }
            });
        });

        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const content = btn.parentElement.previousElementSibling.textContent;
                if (typeof copyToClipboard === "function") {
                   copyToClipboard(content);
                }
            });
        });
    }

    // === JSON EXPORT ===
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
}

// Initialize
const journalManager = new JournalStorageManager();

document.addEventListener('DOMContentLoaded', () => {
    journalManager.displayAllEntries();

    const form = document.getElementById('journal-form');
    const textarea = document.getElementById('journal-text');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            const content = textarea.value.trim();
            const title = 'Manual Entry';

            if (content.split(/\s+/).length < 10) {
                alert("Please write at least 10 words.");
                return;
            }
            
            journalManager.saveEntry(title, content);
            textarea.value = "";
        });
    }

    // Setup other buttons
    document.getElementById('export-json')?.addEventListener('click', async () => {
        const success = await journalManager.exportJSONData();
        if (success) alert('Export successful!');
        else alert('Export failed.');
    });

    document.getElementById('refresh-data')?.addEventListener('click', () => {
        journalManager.displayAllEntries();
    });

    document.getElementById('clear-form')?.addEventListener('click', () => {
        document.getElementById('journal-text').value = '';
    });
});
