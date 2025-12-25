import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize app when component mounts
  useEffect(() => {
    // Initialize your EduTrack app here
    console.log('EduTrack Pro initialized');
    
    // Check for saved theme
    const savedTheme = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedTheme);
    
    if (savedTheme) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
  };

  return (
    <>
      <header className="header">
        <div className="container header-content">
          <a href="#" className="logo">
            <i className="fas fa-graduation-cap logo-icon"></i>
            <span className="logo-text">EduTrack Pro</span>
          </a>
          
          <div className="nav-controls">
            <button className="btn btn-secondary" onClick={toggleTheme} style={{ padding: '0.5rem' }}>
              <i className={darkMode ? 'fas fa-sun' : 'fas fa-moon'}></i>
            </button>
            
            <div className="user-info" style={{ display: 'none' }} id="userInfo">
              <div className="user-avatar" id="userAvatar">U</div>
              <span id="userName">User</span>
              <button className="btn btn-danger" id="logoutBtn">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content" id="mainContent">
        <div className="auth-container">
          <div className="card auth-card">
            <div className="auth-header">
              <div className="auth-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h1 className="auth-title">EduTrack Pro</h1>
              <p className="auth-subtitle">Advanced Academic Management System</p>
            </div>
            
            <button className="btn" id="showLoginModal" style={{ width: '100%', marginBottom: '1rem' }}>
              <i className="fas fa-sign-in-alt"></i> Login / Register
            </button>
            
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Features</h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '1rem', 
                marginBottom: '1.5rem' 
              }}>
                <div style={{ textAlign: 'center' }}>
                  <i className="fas fa-qrcode" style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}></i>
                  <div style={{ fontSize: '0.875rem' }}>QR Attendance</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <i className="fas fa-chart-line" style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}></i>
                  <div style={{ fontSize: '0.875rem' }}>Marks Analytics</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <i className="fas fa-robot" style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}></i>
                  <div style={{ fontSize: '0.875rem' }}>AI Insights</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <i className="fas fa-microphone" style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}></i>
                  <div style={{ fontSize: '0.875rem' }}>Voice Commands</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-logo">
            <i className="fas fa-graduation-cap"></i> EduTrack Pro
          </div>
          
          <div className="team-credit">
            <strong>Project developed by TechNova</strong>
            <div>Team of First-Year Engineering Students, Indo Global College</div>
            <p>Advanced QR Attendance & Marks Management System</p>
          </div>
          
          <div className="footer-links">
            <a href="#"><i className="fas fa-info-circle"></i> About</a>
            <a href="#"><i className="fas fa-envelope"></i> Contact</a>
            <a href="#"><i className="fas fa-shield-alt"></i> Privacy</a>
            <a href="#"><i className="fas fa-file-alt"></i> Terms</a>
          </div>
          
          <div className="copyright">
            © 2024 EduTrack Pro. All rights reserved. | GDG-IGC Hackathon Project
          </div>
        </div>
      </footer>

      {/* Voice Command Indicator */}
      <div className="voice-indicator" id="voiceIndicator" title="Click for voice commands">
        <i className="fas fa-microphone"></i>
      </div>

      {/* Toast Container */}
      <div className="toast-container" id="toastContainer"></div>

      {/* Authentication Modal */}
      <div className="modal" id="authModal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Welcome to EduTrack Pro</h3>
            <button className="modal-close" id="closeAuthModal">&times;</button>
          </div>
          <div className="modal-body">
            <div className="auth-tabs">
              <button className="auth-tab active" id="loginTab">Login</button>
              <button className="auth-tab" id="registerTab">Register</button>
            </div>
            
            <form id="loginForm">
              <div className="role-selector">
                <div className="role-option selected" data-role="student">
                  <i className="fas fa-user-graduate"></i>
                  <div>Student</div>
                </div>
                <div className="role-option" data-role="teacher">
                  <i className="fas fa-chalkboard-teacher"></i>
                  <div>Teacher</div>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">ID Number</label>
                <input type="text" className="form-control" id="loginId" placeholder="Enter your ID" required />
              </div>
              
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" id="loginPassword" placeholder="Enter your password" required />
              </div>
              
              <button type="submit" className="btn" style={{ width: '100%' }}>Login</button>
            </form>
            
            <form id="registerForm" style={{ display: 'none' }}>
              <div className="role-selector">
                <div className="role-option selected" data-role="student">
                  <i className="fas fa-user-graduate"></i>
                  <div>Student</div>
                </div>
                <div className="role-option" data-role="teacher">
                  <i className="fas fa-chalkboard-teacher"></i>
                  <div>Teacher</div>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">ID Number</label>
                <input type="text" className="form-control" id="registerId" placeholder="Enter your ID" required />
              </div>
              
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control" id="registerName" placeholder="Enter your name" required />
              </div>
              
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" id="registerEmail" placeholder="Enter your email" required />
              </div>
              
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" id="registerPassword" placeholder="Create password" required />
              </div>
              
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input type="password" className="form-control" id="registerConfirmPassword" placeholder="Confirm password" required />
              </div>
              
              <button type="submit" className="btn" style={{ width: '100%' }}>Register</button>
            </form>
            
            <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--gray-500)', fontSize: '0.875rem' }}>
              <strong>Demo Credentials:</strong><br />
              Student: ID: S1001, Password: student123<br />
              Teacher: ID: T2001, Password: teacher123
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;