// ==============================================
// DASHBOARD SYSTEM
// ==============================================
function loadDashboard() {
    if (!AppState.currentUser) return;
    
    if (AppState.currentUser.role === 'student') {
        loadStudentDashboard();
    } else {
        loadTeacherDashboard();
    }
}

function loadStudentDashboard() {
    const attendance = getStudentAttendance(AppState.currentUser.id);
    const marks = getStudentMarks(AppState.currentUser.id);
    
    // Calculate statistics
    const totalClasses = 60;
    const presentClasses = attendance.filter(a => a.status === 'present').length;
    const attendancePercentage = Math.round((presentClasses / totalClasses) * 100);
    const averageMarks = marks.length > 0 
        ? Math.round(marks.reduce((sum, m) => sum + m.marks, 0) / marks.length)
        : 0;
    
    document.getElementById('mainContent').innerHTML = `
        <div class="container">
            <div class="dashboard-header">
                <div class="dashboard-title">
                    <h1>Student Dashboard</h1>
                    <p>Welcome back, ${AppState.currentUser.name}</p>
                </div>
                <button class="btn" id="scanQrBtn">
                    <i class="fas fa-qrcode"></i> Scan QR
                </button>
            </div>
            
            <!-- AI Insights -->
            <div class="ai-insights">
                <h3><i class="fas fa-robot"></i> AI Insights</h3>
                <div class="insight-item">
                    <i class="fas fa-chart-line insight-icon"></i>
                    <div>
                        <strong>Attendance Trend</strong>
                        <p>Your attendance is ${attendancePercentage >= 75 ? 'good' : 'needs improvement'} at ${attendancePercentage}%</p>
                    </div>
                </div>
                <div class="insight-item">
                    <i class="fas fa-lightbulb insight-icon"></i>
                    <div>
                        <strong>Study Tip</strong>
                        <p>Focus on Mathematics - Your current score is 78%</p>
                    </div>
                </div>
            </div>
            
            <!-- Statistics -->
            <div class="stats-grid">
                <div class="card stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-calendar-check"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${attendancePercentage}%</h3>
                        <p>Attendance</p>
                    </div>
                </div>
                
                <div class="card stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${averageMarks}%</h3>
                        <p>Average Marks</p>
                    </div>
                </div>
                
                <div class="card stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="stat-info">
                        <h3>6</h3>
                        <p>Active Subjects</p>
                    </div>
                </div>
                
                <div class="card stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-award"></i>
                    </div>
                    <div class="stat-info">
                        <h3>B+</h3>
                        <p>Current GPA</p>
                    </div>
                </div>
            </div>
            
            <!-- Main Sections -->
            <div class="sections-grid">
                <!-- QR Attendance -->
                <div class="card">
                    <div class="section-header">
                        <h3><i class="fas fa-qrcode"></i> QR Attendance</h3>
                    </div>
                    <div class="qr-scanner-container">
                        <div class="qr-scanner">
                            <i class="fas fa-camera" style="font-size: 3rem; color: var(--gray-400);"></i>
                        </div>
                        <p>Click "Scan QR" button to mark your attendance</p>
                        <button class="btn btn-success" id="simulateScanBtn">
                            <i class="fas fa-camera"></i> Simulate Scan
                        </button>
                    </div>
                </div>
                
                <!-- Recent Attendance -->
                <div class="card">
                    <div class="section-header">
                        <h3><i class="fas fa-history"></i> Recent Attendance</h3>
                    </div>
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Subject</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${attendance.slice(-5).reverse().map(a => `
                                    <tr>
                                        <td>${formatDate(a.date)}</td>
                                        <td>${a.subject}</td>
                                        <td><span class="badge ${a.status === 'present' ? 'badge-success' : 'badge-danger'}">${a.status}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Marks Overview -->
                <div class="card">
                    <div class="section-header">
                        <h3><i class="fas fa-chart-bar"></i> Marks Overview</h3>
                    </div>
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Type</th>
                                    <th>Marks</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${marks.slice(-5).reverse().map(m => `
                                    <tr>
                                        <td>${m.subject}</td>
                                        <td>${m.type}</td>
                                        <td>${m.marks}/100</td>
                                        <td>${calculateGrade(m.marks)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Profile & Badges -->
                <div class="card">
                    <div class="section-header">
                        <h3><i class="fas fa-user"></i> Profile & Achievements</h3>
                    </div>
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div class="user-avatar" style="width: 60px; height: 60px; font-size: 1.25rem;">
                            ${getInitials(AppState.currentUser.name)}
                        </div>
                        <div>
                            <h4>${AppState.currentUser.name}</h4>
                            <p style="color: var(--gray-500); font-size: 0.875rem;">${AppState.currentUser.id}</p>
                        </div>
                    </div>
                    
                    <div class="badges-container">
                        <div class="badge-item">
                            <i class="fas fa-calendar-check"></i>
                            <span>Perfect Week</span>
                        </div>
                        <div class="badge-item">
                            <i class="fas fa-star"></i>
                            <span>Top Performer</span>
                        </div>
                        <div class="badge-item">
                            <i class="fas fa-bolt"></i>
                            <span>Early Bird</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    setTimeout(() => {
        document.getElementById('scanQrBtn').addEventListener('click', scanQRCode);
        document.getElementById('simulateScanBtn').addEventListener('click', simulateQRScan);
    }, 100);
}

function loadTeacherDashboard() {
    const attendance = getAllAttendance();
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const marks = getAllMarks();
    
    // Calculate statistics
    const totalStudents = students.length;
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter(a => a.date.split('T')[0] === today);
    const presentToday = todayAttendance.filter(a => a.status === 'present').length;
    
    document.getElementById('mainContent').innerHTML = `
        <div class="container">
            <div class="dashboard-header">
                <div class="dashboard-title">
                    <h1>Teacher Dashboard</h1>
                    <p>Welcome, Prof. ${AppState.currentUser.name}</p>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn" id="generateQrBtn">
                        <i class="fas fa-qrcode"></i> Generate QR
                    </button>
                    <button class="btn btn-success" id="uploadMarksBtn">
                        <i class="fas fa-upload"></i> Upload Marks
                    </button>
                </div>
            </div>
            
            <!-- Statistics -->
            <div class="stats-grid">
                <div class="card stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${totalStudents}</h3>
                        <p>Total Students</p>
                    </div>
                </div>
                
                <div class="card stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-user-check"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${presentToday}/${totalStudents}</h3>
                        <p>Present Today</p>
                    </div>
                </div>
                
                <div class="card stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-clipboard-list"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${marks.length}</h3>
                        <p>Marks Entries</p>
                    </div>
                </div>
                
                <div class="card stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-chalkboard-teacher"></i>
                    </div>
                    <div class="stat-info">
                        <h3>5</h3>
                        <p>Subjects</p>
                    </div>
                </div>
            </div>
            
            <!-- AI Insights -->
            <div class="ai-insights">
                <h3><i class="fas fa-robot"></i> Teaching Insights</h3>
                <div class="insight-item">
                    <i class="fas fa-chart-line insight-icon"></i>
                    <div>
                        <strong>Class Performance</strong>
                        <p>Overall class average: 78% with 12% improvement this month</p>
                    </div>
                </div>
                <div class="insight-item">
                    <i class="fas fa-exclamation-triangle insight-icon"></i>
                    <div>
                        <strong>Attention Needed</strong>
                        <p>3 students need extra help in Mathematics</p>
                    </div>
                </div>
            </div>
            
            <!-- Main Sections -->
            <div class="sections-grid">
                <!-- Quick Actions -->
                <div class="card">
                    <div class="section-header">
                        <h3><i class="fas fa-cogs"></i> Quick Actions</h3>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem;">
                        <button class="btn" id="actionQrBtn" style="display: flex; flex-direction: column; padding: 1rem;">
                            <i class="fas fa-qrcode" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                            <span>Generate QR</span>
                        </button>
                        <button class="btn btn-success" id="actionMarksBtn" style="display: flex; flex-direction: column; padding: 1rem;">
                            <i class="fas fa-upload" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                            <span>Upload Marks</span>
                        </button>
                        <button class="btn btn-secondary" id="actionExportBtn" style="display: flex; flex-direction: column; padding: 1rem;">
                            <i class="fas fa-file-export" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                            <span>Export Data</span>
                        </button>
                        <button class="btn btn-warning" id="actionEditBtn" style="display: flex; flex-direction: column; padding: 1rem;">
                            <i class="fas fa-edit" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                            <span>Edit Attendance</span>
                        </button>
                    </div>
                </div>
                
                <!-- Today's Attendance -->
                <div class="card">
                    <div class="section-header">
                        <h3><i class="fas fa-calendar-day"></i> Today's Attendance</h3>
                        <button class="btn btn-secondary" id="refreshAttendanceBtn" style="padding: 0.375rem 0.75rem; font-size: 0.75rem;">
                            <i class="fas fa-sync-alt"></i> Refresh
                        </button>
                    </div>
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Name</th>
                                    <th>Subject</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${todayAttendance.slice(0, 5).map(a => {
                                    const student = students.find(s => s.id === a.studentId);
                                    return `
                                        <tr>
                                            <td>${a.studentId}</td>
                                            <td>${student ? student.name : 'Unknown'}</td>
                                            <td>${a.subject}</td>
                                            <td><span class="badge ${a.status === 'present' ? 'badge-success' : 'badge-danger'}">${a.status}</span></td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Recent Marks -->
                <div class="card">
                    <div class="section-header">
                        <h3><i class="fas fa-history"></i> Recent Marks</h3>
                    </div>
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Subject</th>
                                    <th>Type</th>
                                    <th>Entries</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${getMarksSummary().slice(0, 5).map(m => `
                                    <tr>
                                        <td>${formatDate(m.date)}</td>
                                        <td>${m.subject}</td>
                                        <td>${m.type}</td>
                                        <td>${m.count} students</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Attendance Analytics -->
                <div class="card">
                    <div class="section-header">
                        <h3><i class="fas fa-chart-pie"></i> Attendance Analytics</h3>
                    </div>
                    <div style="text-align: center; padding: 1.5rem;">
                        <div style="font-size: 3rem; font-weight: 700; color: var(--primary-color);">
                            ${calculateOverallAttendance()}%
                        </div>
                        <p style="color: var(--gray-500); margin-top: 0.5rem;">Overall Class Attendance</p>
                        <div style="display: flex; justify-content: space-between; margin-top: 1.5rem;">
                            <div>
                                <p style="font-size: 0.875rem; color: var(--gray-500);">Best Subject</p>
                                <p style="font-weight: 600;">Mathematics</p>
                            </div>
                            <div>
                                <p style="font-size: 0.875rem; color: var(--gray-500);">Needs Improvement</p>
                                <p style="font-weight: 600;">Physics</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    setTimeout(() => {
        document.getElementById('generateQrBtn').addEventListener('click', generateQRCode);
        document.getElementById('uploadMarksBtn').addEventListener('click', uploadMarks);
        document.getElementById('actionQrBtn').addEventListener('click', generateQRCode);
        document.getElementById('actionMarksBtn').addEventListener('click', uploadMarks);
        document.getElementById('actionExportBtn').addEventListener('click', exportData);
        document.getElementById('actionEditBtn').addEventListener('click', editAttendance);
        document.getElementById('refreshAttendanceBtn').addEventListener('click', () => {
            loadTeacherDashboard();
            showToast('Attendance data refreshed', 'success');
        });
    }, 100);
}

// ==============================================
// TEACHER FUNCTIONS
// ==============================================
function uploadMarks() {
    showToast('Marks upload feature would open here', 'info');
    // This would open a modal for uploading marks
}

function editAttendance() {
    showToast('Attendance edit feature would open here', 'info');
}

function exportData() {
    const attendance = getAllAttendance();
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    
    let csv = 'Student ID,Name,Subject,Date,Status\n';
    attendance.forEach(record => {
        const student = students.find(s => s.id === record.studentId);
        const name = student ? student.name : 'Unknown';
        const date = new Date(record.date).toLocaleDateString();
        csv += `${record.studentId},${name},${record.subject},${date},${record.status}\n`;
    });
    
    // Create and trigger download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Data exported successfully as CSV', 'success');
}