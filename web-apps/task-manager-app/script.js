// Task Manager App
class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.editingTaskId = null;
        this.initializeElements();
        this.attachEventListeners();
        this.initializeTheme();
        this.render();
    }

    initializeElements() {
        this.taskInput = document.getElementById('taskInput');
        this.prioritySelect = document.getElementById('prioritySelect');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.taskList = document.getElementById('taskList');
        this.searchInput = document.getElementById('searchInput');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.emptyState = document.getElementById('emptyState');
        this.taskCount = document.getElementById('taskCount');
        this.themeToggle = document.getElementById('themeToggle');
        this.editModal = document.getElementById('editModal');
        this.editTaskInput = document.getElementById('editTaskInput');
        this.editPrioritySelect = document.getElementById('editPrioritySelect');
        this.saveEditBtn = document.getElementById('saveEditBtn');
        this.cancelEditBtn = document.getElementById('cancelEditBtn');
    }

    attachEventListeners() {
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        this.searchInput.addEventListener('input', () => this.render());

        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        this.saveEditBtn.addEventListener('click', () => this.saveEdit());
        this.cancelEditBtn.addEventListener('click', () => this.closeEditModal());

        this.editModal.addEventListener('click', (e) => {
            if (e.target === this.editModal) this.closeEditModal();
        });

        this.editTaskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveEdit();
        });
    }

    loadTasks() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    addTask() {
        const text = this.taskInput.value.trim();
        if (!text) return;

        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            priority: this.prioritySelect.value,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.taskInput.value = '';
        this.render();
    }

    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveTasks();
            this.render();
        }
    }

    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
        }
    }

    openEditModal(id) {
        const task = this.tasks.find(task => task.id === id);
        if (!task) return;

        this.editingTaskId = id;
        this.editTaskInput.value = task.text;
        this.editPrioritySelect.value = task.priority;
        this.editModal.classList.add('active');
        this.editTaskInput.focus();
    }

    closeEditModal() {
        this.editModal.classList.remove('active');
        this.editingTaskId = null;
        this.editTaskInput.value = '';
    }

    saveEdit() {
        const text = this.editTaskInput.value.trim();
        if (!text) return;

        const task = this.tasks.find(task => task.id === this.editingTaskId);
        if (task) {
            task.text = text;
            task.priority = this.editPrioritySelect.value;
            this.saveTasks();
            this.closeEditModal();
            this.render();
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.render();
    }

    getFilteredTasks() {
        const searchTerm = this.searchInput.value.toLowerCase();

        let filtered = this.tasks;

        // Apply completion filter
        if (this.currentFilter === 'active') {
            filtered = filtered.filter(task => !task.completed);
        } else if (this.currentFilter === 'completed') {
            filtered = filtered.filter(task => task.completed);
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(task =>
                task.text.toLowerCase().includes(searchTerm)
            );
        }

        return filtered;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffTime / (1000 * 60));

        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

        return date.toLocaleDateString();
    }

    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? 'checked' : ''}
                data-id="${task.id}"
            >
            <div class="task-content">
                <div class="task-text">${this.escapeHtml(task.text)}</div>
                <div class="task-meta">
                    <span class="priority-badge ${task.priority}">${task.priority}</span>
                    <span> • ${this.formatDate(task.createdAt)}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="task-btn edit-btn" data-id="${task.id}">Edit</button>
                <button class="task-btn delete-btn" data-id="${task.id}">Delete</button>
            </div>
        `;

        // Attach event listeners
        const checkbox = li.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => this.toggleTask(task.id));

        const editBtn = li.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => this.openEditModal(task.id));

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

        return li;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateStats() {
        const filtered = this.getFilteredTasks();
        const total = filtered.length;
        const completed = filtered.filter(task => task.completed).length;

        if (this.currentFilter === 'all') {
            this.taskCount.textContent = `${total} task${total !== 1 ? 's' : ''} (${completed} completed)`;
        } else if (this.currentFilter === 'active') {
            this.taskCount.textContent = `${total} active task${total !== 1 ? 's' : ''}`;
        } else {
            this.taskCount.textContent = `${total} completed task${total !== 1 ? 's' : ''}`;
        }
    }

    render() {
        const filteredTasks = this.getFilteredTasks();

        this.taskList.innerHTML = '';

        if (filteredTasks.length === 0) {
            this.emptyState.classList.remove('hidden');
            if (this.searchInput.value) {
                this.emptyState.innerHTML = '<p>No tasks found matching your search.</p>';
            } else if (this.currentFilter === 'completed') {
                this.emptyState.innerHTML = '<p>No completed tasks yet.</p>';
            } else if (this.currentFilter === 'active') {
                this.emptyState.innerHTML = '<p>No active tasks. Great job!</p>';
            } else {
                this.emptyState.innerHTML = '<p>No tasks yet. Add one to get started!</p>';
            }
        } else {
            this.emptyState.classList.add('hidden');
            filteredTasks.forEach(task => {
                this.taskList.appendChild(this.createTaskElement(task));
            });
        }

        this.updateStats();
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        const icon = this.themeToggle.querySelector('.theme-icon');
        icon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});
