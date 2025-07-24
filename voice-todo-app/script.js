/**
 * Voice-Controlled To-Do List Application
 * Features: Voice input, localStorage persistence, dark/light mode, responsive design
 */

class VoiceTodoApp {
    constructor() {
        // Initialize properties
        this.tasks = [];
        this.isListening = false;
        this.recognition = null;
        this.currentTheme = 'light';
        
        // DOM elements
        this.elements = {
            voiceBtn: document.getElementById('voiceBtn'),
            voiceText: document.querySelector('.voice-text'),
            listeningIndicator: document.getElementById('listeningIndicator'),
            themeToggle: document.getElementById('themeToggle'),
            themeIcon: document.querySelector('.theme-icon'),
            taskInput: document.getElementById('taskInput'),
            addBtn: document.getElementById('addBtn'),
            taskList: document.getElementById('taskList'),
            emptyState: document.getElementById('emptyState'),
            clearCompleted: document.getElementById('clearCompleted'),
            totalTasks: document.getElementById('totalTasks'),
            completedTasks: document.getElementById('completedTasks'),
            remainingTasks: document.getElementById('remainingTasks'),
            loadingOverlay: document.getElementById('loadingOverlay'),
            errorModal: document.getElementById('errorModal'),
            errorMessage: document.getElementById('errorMessage'),
            errorClose: document.getElementById('errorClose'),
            errorBtn: document.getElementById('errorBtn')
        };
        
        // Initialize the app
        this.init();
    }
    
    /**
     * Initialize the application
     */
    async init() {
        try {
            // Show loading overlay
            this.showLoading('Initializing speech recognition...');
            
            // Load saved data
            this.loadFromStorage();
            
            // Setup speech recognition
            await this.initSpeechRecognition();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Render initial UI
            this.renderTasks();
            this.updateStats();
            this.updateTheme();
            
            // Hide loading overlay
            this.hideLoading();
            
            console.log('Voice Todo App initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
            this.hideLoading();
            this.showError('Failed to initialize the app. Please refresh and try again.');
        }
    }
    
    /**
     * Initialize Web Speech API
     */
    async initSpeechRecognition() {
        return new Promise((resolve, reject) => {
            try {
                // Check for browser support
                if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                    throw new Error('Speech recognition not supported in this browser');
                }
                
                // Create recognition instance
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                this.recognition = new SpeechRecognition();
                
                // Configure recognition settings
                this.recognition.continuous = false;
                this.recognition.interimResults = false;
                this.recognition.lang = 'en-US';
                this.recognition.maxAlternatives = 1;
                
                // Setup recognition event handlers
                this.recognition.onstart = () => {
                    console.log('Speech recognition started');
                    this.isListening = true;
                    this.updateVoiceButton();
                    this.showListeningIndicator();
                };
                
                this.recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript.trim();
                    console.log('Speech recognized:', transcript);
                    
                    if (transcript) {
                        this.addTask(transcript);
                        this.showSuccess(`Added: "${transcript}"`);
                    }
                };
                
                this.recognition.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    this.handleSpeechError(event.error);
                };
                
                this.recognition.onend = () => {
                    console.log('Speech recognition ended');
                    this.isListening = false;
                    this.updateVoiceButton();
                    this.hideListeningIndicator();
                };
                
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
    
    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Voice button
        this.elements.voiceBtn.addEventListener('click', () => this.toggleVoiceRecognition());
        
        // Theme toggle
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Manual task input
        this.elements.addBtn.addEventListener('click', () => this.addTaskFromInput());
        this.elements.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTaskFromInput();
            }
        });
        
        // Clear completed tasks
        this.elements.clearCompleted.addEventListener('click', () => this.clearCompletedTasks());
        
        // Error modal
        this.elements.errorClose.addEventListener('click', () => this.hideError());
        this.elements.errorBtn.addEventListener('click', () => this.hideError());
        this.elements.errorModal.addEventListener('click', (e) => {
            if (e.target === this.elements.errorModal) {
                this.hideError();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Space bar to toggle voice recognition
            if (e.code === 'Space' && e.target === document.body) {
                e.preventDefault();
                this.toggleVoiceRecognition();
            }
            
            // Escape to stop listening
            if (e.key === 'Escape' && this.isListening) {
                this.stopVoiceRecognition();
            }
            
            // Ctrl/Cmd + D to toggle dark mode
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
        
        // Handle visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isListening) {
                this.stopVoiceRecognition();
            }
        });
        
        // Auto-save when page is about to unload
        window.addEventListener('beforeunload', () => {
            this.saveToStorage();
        });
    }
    
    /**
     * Toggle voice recognition on/off
     */
    toggleVoiceRecognition() {
        if (!this.recognition) {
            this.showError('Speech recognition is not available in your browser.');
            return;
        }
        
        if (this.isListening) {
            this.stopVoiceRecognition();
        } else {
            this.startVoiceRecognition();
        }
    }
    
    /**
     * Start voice recognition
     */
    startVoiceRecognition() {
        try {
            if (this.recognition && !this.isListening) {
                this.recognition.start();
            }
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            this.showError('Failed to start voice recognition. Please try again.');
        }
    }
    
    /**
     * Stop voice recognition
     */
    stopVoiceRecognition() {
        try {
            if (this.recognition && this.isListening) {
                this.recognition.stop();
            }
        } catch (error) {
            console.error('Error stopping speech recognition:', error);
        }
    }
    
    /**
     * Handle speech recognition errors
     */
    handleSpeechError(error) {
        const errorMessages = {
            'no-speech': 'No speech was detected. Please try again.',
            'audio-capture': 'Audio capture failed. Please check your microphone.',
            'not-allowed': 'Microphone access denied. Please allow microphone access.',
            'network': 'Network error. Please check your internet connection.',
            'aborted': 'Speech recognition was aborted.',
            'language-not-supported': 'Language not supported.',
            'service-not-allowed': 'Speech recognition service not allowed.'
        };
        
        const message = errorMessages[error] || 'An unknown error occurred with speech recognition.';
        this.showError(message);
    }
    
    /**
     * Update voice button appearance
     */
    updateVoiceButton() {
        const { voiceBtn, voiceText } = this.elements;
        
        if (this.isListening) {
            voiceBtn.classList.add('listening');
            voiceText.textContent = 'Listening...';
        } else {
            voiceBtn.classList.remove('listening');
            voiceText.textContent = 'Start Listening';
        }
    }
    
    /**
     * Show listening indicator
     */
    showListeningIndicator() {
        this.elements.listeningIndicator.classList.add('active');
    }
    
    /**
     * Hide listening indicator
     */
    hideListeningIndicator() {
        this.elements.listeningIndicator.classList.remove('active');
    }
    
    /**
     * Add task from manual input
     */
    addTaskFromInput() {
        const taskText = this.elements.taskInput.value.trim();
        if (taskText) {
            this.addTask(taskText);
            this.elements.taskInput.value = '';
            this.elements.taskInput.focus();
        }
    }
    
    /**
     * Add a new task
     */
    addTask(text) {
        if (!text || text.trim() === '') return;
        
        const task = {
            id: this.generateId(),
            text: text.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.tasks.unshift(task); // Add to beginning
        this.saveToStorage();
        this.renderTasks();
        this.updateStats();
        
        console.log('Task added:', task);
    }
    
    /**
     * Toggle task completion status
     */
    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            
            this.saveToStorage();
            this.renderTasks();
            this.updateStats();
            
            console.log('Task toggled:', task);
        }
    }
    
    /**
     * Delete a task
     */
    deleteTask(id) {
        const taskElement = document.querySelector(`[data-task-id="${id}"]`);
        
        if (taskElement) {
            // Add removal animation
            taskElement.classList.add('removing');
            
            // Remove from array and update UI after animation
            setTimeout(() => {
                this.tasks = this.tasks.filter(t => t.id !== id);
                this.saveToStorage();
                this.renderTasks();
                this.updateStats();
                
                console.log('Task deleted:', id);
            }, 300);
        }
    }
    
    /**
     * Clear all completed tasks
     */
    clearCompletedTasks() {
        const completedCount = this.tasks.filter(t => t.completed).length;
        
        if (completedCount === 0) return;
        
        if (confirm(`Are you sure you want to delete ${completedCount} completed task${completedCount > 1 ? 's' : ''}?`)) {
            this.tasks = this.tasks.filter(t => !t.completed);
            this.saveToStorage();
            this.renderTasks();
            this.updateStats();
            
            console.log(`Cleared ${completedCount} completed tasks`);
        }
    }
    
    /**
     * Render all tasks in the UI
     */
    renderTasks() {
        const { taskList, emptyState, clearCompleted } = this.elements;
        
        // Clear existing tasks
        taskList.innerHTML = '';
        
        if (this.tasks.length === 0) {
            emptyState.classList.add('visible');
            clearCompleted.disabled = true;
            return;
        }
        
        emptyState.classList.remove('visible');
        
        // Render each task
        this.tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            taskList.appendChild(taskElement);
        });
        
        // Enable/disable clear completed button
        const hasCompleted = this.tasks.some(t => t.completed);
        clearCompleted.disabled = !hasCompleted;
    }
    
    /**
     * Create HTML element for a task
     */
    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.setAttribute('data-task-id', task.id);
        li.setAttribute('role', 'listitem');
        
        li.innerHTML = `
            <div 
                class="task-checkbox ${task.completed ? 'checked' : ''}" 
                role="checkbox" 
                aria-checked="${task.completed}"
                aria-label="Mark task as ${task.completed ? 'incomplete' : 'complete'}"
                tabindex="0"
            ></div>
            <span class="task-text ${task.completed ? 'completed' : ''}">${this.escapeHtml(task.text)}</span>
            <button 
                class="task-delete" 
                aria-label="Delete task"
                tabindex="0"
            >🗑️</button>
        `;
        
        // Add event listeners
        const checkbox = li.querySelector('.task-checkbox');
        const deleteBtn = li.querySelector('.task-delete');
        
        checkbox.addEventListener('click', () => this.toggleTask(task.id));
        checkbox.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTask(task.id);
            }
        });
        
        deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
        deleteBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.deleteTask(task.id);
            }
        });
        
        return li;
    }
    
    /**
     * Update task statistics
     */
    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const remaining = total - completed;
        
        this.elements.totalTasks.textContent = total;
        this.elements.completedTasks.textContent = completed;
        this.elements.remainingTasks.textContent = remaining;
    }
    
    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.updateTheme();
        this.saveToStorage();
    }
    
    /**
     * Apply the current theme
     */
    updateTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.elements.themeIcon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
        
        console.log('Theme updated to:', this.currentTheme);
    }
    
    /**
     * Save app state to localStorage
     */
    saveToStorage() {
        try {
            const data = {
                tasks: this.tasks,
                theme: this.currentTheme,
                lastSaved: new Date().toISOString()
            };
            
            localStorage.setItem('voiceTodoApp', JSON.stringify(data));
            console.log('Data saved to localStorage');
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            this.showError('Failed to save data. Your changes may be lost.');
        }
    }
    
    /**
     * Load app state from localStorage
     */
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('voiceTodoApp');
            if (saved) {
                const data = JSON.parse(saved);
                
                this.tasks = Array.isArray(data.tasks) ? data.tasks : [];
                this.currentTheme = data.theme || 'light';
                
                console.log('Data loaded from localStorage:', data);
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            this.showError('Failed to load saved data. Starting fresh.');
            this.tasks = [];
            this.currentTheme = 'light';
        }
    }
    
    /**
     * Show loading overlay
     */
    showLoading(message = 'Loading...') {
        this.elements.loadingOverlay.querySelector('p').textContent = message;
        this.elements.loadingOverlay.classList.add('visible');
    }
    
    /**
     * Hide loading overlay
     */
    hideLoading() {
        this.elements.loadingOverlay.classList.remove('visible');
    }
    
    /**
     * Show error modal
     */
    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.errorModal.classList.add('visible');
        this.elements.errorBtn.focus();
    }
    
    /**
     * Hide error modal
     */
    hideError() {
        this.elements.errorModal.classList.remove('visible');
    }
    
    /**
     * Show success notification (simple console log for now)
     */
    showSuccess(message) {
        console.log('Success:', message);
        
        // Create a temporary success indicator
        const successElement = document.createElement('div');
        successElement.textContent = '✓ ' + message;
        successElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1002;
            font-weight: 600;
            animation: slideInFromTop 0.3s ease;
        `;
        
        document.body.appendChild(successElement);
        
        // Remove after 3 seconds
        setTimeout(() => {
            successElement.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                document.body.removeChild(successElement);
            }, 300);
        }, 3000);
    }
    
    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Generate unique ID for tasks
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Get app statistics
     */
    getStats() {
        return {
            totalTasks: this.tasks.length,
            completedTasks: this.tasks.filter(t => t.completed).length,
            pendingTasks: this.tasks.filter(t => !t.completed).length,
            currentTheme: this.currentTheme,
            speechSupported: !!this.recognition
        };
    }
    
    /**
     * Export tasks as JSON
     */
    exportTasks() {
        const data = {
            tasks: this.tasks,
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `voice-todo-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        console.log('Tasks exported');
    }
    
    /**
     * Clear all data (with confirmation)
     */
    clearAllData() {
        if (confirm('Are you sure you want to clear all tasks and reset the app? This cannot be undone.')) {
            this.tasks = [];
            this.currentTheme = 'light';
            localStorage.removeItem('voiceTodoApp');
            
            this.renderTasks();
            this.updateStats();
            this.updateTheme();
            
            console.log('All data cleared');
            this.showSuccess('All data has been cleared');
        }
    }
}

/**
 * Initialize the app when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    // Create global app instance
    window.voiceTodoApp = new VoiceTodoApp();
    
    // Add global keyboard shortcuts info
    console.log(`
🎤 Voice Todo App - Keyboard Shortcuts:
- Space: Toggle voice recognition
- Escape: Stop listening
- Ctrl/Cmd + D: Toggle dark mode
- Enter: Add task (when input is focused)
    `);
});

/**
 * Service Worker registration (for offline support - optional)
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment if you add a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(registrationError => console.log('SW registration failed:', registrationError));
    });
}

/**
 * Handle app installation prompt (PWA - optional)
 */
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // You could show an install button here
    console.log('App can be installed');
});

/**
 * Handle app installation
 */
window.addEventListener('appinstalled', (evt) => {
    console.log('App was installed');
});

/**
 * Utility functions for debugging
 */
window.debugVoiceTodo = {
    getStats: () => window.voiceTodoApp?.getStats(),
    exportTasks: () => window.voiceTodoApp?.exportTasks(),
    clearAll: () => window.voiceTodoApp?.clearAllData(),
    addSampleTasks: () => {
        const samples = [
            'Buy groceries',
            'Walk the dog',
            'Finish project report',
            'Call dentist for appointment',
            'Read 30 minutes',
            'Exercise for 20 minutes'
        ];
        
        samples.forEach(task => window.voiceTodoApp?.addTask(task));
    }
};
