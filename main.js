// ==============================================
// GLOBAL VARIABLES AND STATE MANAGEMENT
// ==============================================
const AppState = {
    currentUser: null,
    selectedRole: 'student',
    isDarkMode: localStorage.getItem('darkMode') === 'true',
    isVoiceActive: false,
    notifications: []
};

// ==============================================
// INITIALIZATION FUNCTION
// ==============================================
function initializeApp() {
    console.log('🚀 Initializing EduTrack Pro...');
    
    // Initialize theme
    initTheme();
    
    // Check authentication
    checkAuthStatus();
    
    // Initialize event listeners
    initEventListeners();
    
    // Show app is ready
    setTimeout(() => {
        hideLoader();
        showToast('EduTrack Pro is ready!', 'success');
    }, 1000);
}

// ==============================================
// THEME MANAGEMENT
// ==============================================
function initTheme() {
    if (AppState.isDarkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('darkMode')) {
            AppState.isDarkMode = e.matches;
            document.body.classList.toggle('dark-mode', e.matches);
        }
    });
}

function toggleTheme() {
    AppState.isDarkMode = !AppState.isDarkMode;
    document.body.classList.toggle('dark-mode');
    
    if (AppState.isDarkMode) {
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('darkMode', 'true');
    } else {
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('darkMode', 'false');
    }
    
    showToast(`Theme changed to ${AppState.isDarkMode ? 'dark' : 'light'} mode`, 'success');
}

// ==============================================
// UI HELPER FUNCTIONS
// ==============================================
function updateUserInterface() {
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    
    if (AppState.currentUser) {
        userInfo.style.display = 'flex';
        userName.textContent = AppState.currentUser.name;
        userAvatar.textContent = getInitials(AppState.currentUser.name);
    } else {
        userInfo.style.display = 'none';
    }
}

function showLoader() {
    document.getElementById('loader').classList.add('active');
}

function hideLoader() {
    document.getElementById('loader').classList.remove('active');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' :
                type === 'warning' ? 'fa-exclamation-triangle' :
                type === 'error' ? 'fa-times-circle' : 'fa-info-circle';
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="toast-content">${message}</div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'toastSlideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
    
    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.style.animation = 'toastSlideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
}

function calculateGrade(marks) {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C';
    return 'F';
}

function getInitials(name) {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
}

// ==============================================
// EVENT LISTENERS INITIALIZATION
// ==============================================
function initEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', logoutUser);
    
    // Home link
    document.getElementById('homeLink').addEventListener('click', (e) => {
        e.preventDefault();
        if (AppState.currentUser) {
            loadDashboard();
        } else {
            showLoginPage();
        }
    });
    
    // Auth modal tabs
    document.getElementById('loginTab').addEventListener('click', () => {
        document.getElementById('loginTab').classList.add('active');
        document.getElementById('registerTab').classList.remove('active');
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
        document.querySelector('#authModal .modal-header h3').textContent = 'Login to EduTrack Pro';
    });
    
    document.getElementById('registerTab').addEventListener('click', () => {
        document.getElementById('registerTab').classList.add('active');
        document.getElementById('loginTab').classList.remove('active');
        document.getElementById('registerForm').style.display = 'block';
        document.getElementById('loginForm').style.display = 'none';
        document.querySelector('#authModal .modal-header h3').textContent = 'Register for EduTrack Pro';
    });
    
    // Role selection
    document.querySelectorAll('.role-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.role-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            AppState.selectedRole = this.dataset.role;
        });
    });
    
    // Login form submission
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('loginId').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        
        if (!id || !password) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        loginUser(id, password, AppState.selectedRole);
    });
    
    // Register form submission
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = document.getElementById('registerId').value.trim();
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value.trim();
        const confirmPassword = document.getElementById('registerConfirmPassword').value.trim();
        
        // Validation
        if (!id || !name || !email || !password || !confirmPassword) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }
        
        if (password.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }
        
        const userData = {
            id: id,
            name: name,
            email: email,
            role: AppState.selectedRole,
            password: password
        };
        
        registerUser(userData);
    });
    
    // Close auth modal
    document.getElementById('closeAuthModal').addEventListener('click', () => {
        document.getElementById('authModal').classList.remove('active');
    });
    
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + D for dark mode
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            toggleTheme();
        }
        
        // Esc to close modals
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
    
    // Initialize voice commands
    initVoiceCommands();
}

// ==============================================
// START THE APPLICATION
// ==============================================
// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Handle page reload
window.addEventListener('beforeunload', () => {
    // Clean up if needed
});

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    showToast('An error occurred. Please refresh the page.', 'error');
});