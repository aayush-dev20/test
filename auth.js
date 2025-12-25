// ==============================================
// AUTHENTICATION SYSTEM
// ==============================================
function checkAuthStatus() {
    const userData = sessionStorage.getItem('eduTrackUser');
    
    if (userData) {
        try {
            AppState.currentUser = JSON.parse(userData);
            loadDashboard();
            updateUserInterface();
        } catch (error) {
            console.error('Error parsing user data:', error);
            showLoginPage();
        }
    } else {
        showLoginPage();
    }
}

function showLoginPage() {
    const loginPageHTML = `
        <div class="auth-container">
            <div class="card auth-card">
                <div class="auth-header">
                    <div class="auth-icon">
                        <i class="fas fa-graduation-cap"></i>
                    </div>
                    <h1 class="auth-title">EduTrack Pro</h1>
                    <p class="auth-subtitle">Advanced Academic Management System</p>
                </div>
                
                <button class="btn" id="showLoginModal" style="width: 100%; margin-bottom: 1rem;">
                    <i class="fas fa-sign-in-alt"></i> Login / Register
                </button>
                
                <div style="text-align: center;">
                    <h3 style="margin-bottom: 1rem; color: var(--primary-color);">Features</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                        <div style="text-align: center;">
                            <i class="fas fa-qrcode" style="font-size: 1.5rem; color: var(--primary-color); margin-bottom: 0.5rem;"></i>
                            <div style="font-size: 0.875rem;">QR Attendance</div>
                        </div>
                        <div style="text-align: center;">
                            <i class="fas fa-chart-line" style="font-size: 1.5rem; color: var(--primary-color); margin-bottom: 0.5rem;"></i>
                            <div style="font-size: 0.875rem;">Marks Analytics</div>
                        </div>
                        <div style="text-align: center;">
                            <i class="fas fa-robot" style="font-size: 1.5rem; color: var(--primary-color); margin-bottom: 0.5rem;"></i>
                            <div style="font-size: 0.875rem;">AI Insights</div>
                        </div>
                        <div style="text-align: center;">
                            <i class="fas fa-microphone" style="font-size: 1.5rem; color: var(--primary-color); margin-bottom: 0.5rem;"></i>
                            <div style="font-size: 0.875rem;">Voice Commands</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('mainContent').innerHTML = loginPageHTML;
    document.getElementById('userInfo').style.display = 'none';
    
    // Add event listener for login button
    setTimeout(() => {
        const loginBtn = document.getElementById('showLoginModal');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                document.getElementById('authModal').classList.add('active');
            });
        }
    }, 100);
}

function loginUser(id, password, role) {
    const users = role === 'student' 
        ? JSON.parse(localStorage.getItem('students') || '[]')
        : JSON.parse(localStorage.getItem('teachers') || '[]');
    
    const user = users.find(u => u.id === id && u.password === password);
    
    if (user) {
        AppState.currentUser = user;
        sessionStorage.setItem('eduTrackUser', JSON.stringify(user));
        showToast(`Welcome back, ${user.name}!`, 'success');
        loadDashboard();
        updateUserInterface();
        document.getElementById('authModal').classList.remove('active');
        return true;
    }
    
    showToast('Invalid credentials. Please try again.', 'error');
    return false;
}

function registerUser(userData) {
    let users = userData.role === 'student'
        ? JSON.parse(localStorage.getItem('students') || '[]')
        : JSON.parse(localStorage.getItem('teachers') || '[]');
    
    // Check if user already exists
    if (users.some(u => u.id === userData.id || u.email === userData.email)) {
        showToast('User with this ID or email already exists.', 'error');
        return false;
    }
    
    users.push(userData);
    
    localStorage.setItem(
        userData.role === 'student' ? 'students' : 'teachers',
        JSON.stringify(users)
    );
    
    AppState.currentUser = userData;
    sessionStorage.setItem('eduTrackUser', JSON.stringify(userData));
    
    showToast(`Account created successfully! Welcome ${userData.name}!`, 'success');
    loadDashboard();
    updateUserInterface();
    document.getElementById('authModal').classList.remove('active');
    return true;
}

function logoutUser() {
    AppState.currentUser = null;
    sessionStorage.removeItem('eduTrackUser');
    showToast('Logged out successfully', 'success');
    showLoginPage();
}