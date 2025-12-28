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
                <div style="display:flex;align-items:center;gap:0.5rem;">
                    <button class="btn" id="scanQrBtn">
                        <i class="fas fa-qrcode"></i> Scan QR
                    </button>
                    <span id="qrStatusBadge" style="margin-left:0.5rem; font-size:0.85rem; color:var(--gray-500);">Status: idle</span>
                </div>
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
    
    // Add event listeners (robust attach with retries + debug)
    (function attachStudentListeners(retries = 10) {
        const scanBtn = document.getElementById('scanQrBtn');
        const simBtn = document.getElementById('simulateScanBtn');

        if (scanBtn) {
            console.debug('[EduTrack] Attaching scan QR listener');
            scanBtn.addEventListener('click', function () {
                console.debug('[EduTrack] scanQrBtn clicked');
                showToast('Opening QR scanner...', 'info');
                try {
                    scanQRCode();
                } catch (e) {
                    console.error('Error calling scanQRCode:', e);
                    showToast('Failed to open QR scanner', 'error');
                }
            });
        } else if (retries > 0) {
            setTimeout(() => attachStudentListeners(retries - 1), 100);
        } else {
            console.warn('[EduTrack] scanQrBtn not found to attach listener');
        }

        if (simBtn) {
            simBtn.addEventListener('click', () => {
                console.debug('[EduTrack] simulateScanBtn clicked');
                simulateQRScan();
            });
        }
    })();
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
    if (!AppState.currentUser || AppState.currentUser.role !== 'teacher') {
        showToast('Only teachers can upload marks', 'error');
        return;
    }

    const modal = document.getElementById('marksUploadModal');
    if (!modal) {
        showToast('Upload modal not found', 'error');
        return;
    }

    // Open modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Attach listeners once
    if (modal.dataset.listenersAttached) return;
    modal.dataset.listenersAttached = '1';

    // Close behavior
    document.getElementById('closeMarksUpload').addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Toggle single/bulk
    const singleBtn = document.getElementById('singleEntryBtn');
    const bulkBtn = document.getElementById('bulkUploadBtn');
    const singleForm = document.getElementById('singleMarksForm');
    const bulkForm = document.getElementById('bulkUploadForm');

    singleBtn.addEventListener('click', () => {
        singleForm.style.display = 'block';
        bulkForm.style.display = 'none';
        singleBtn.classList.add('active');
        bulkBtn.classList.remove('active');
    });

    bulkBtn.addEventListener('click', () => {
        singleForm.style.display = 'none';
        bulkForm.style.display = 'block';
        bulkBtn.classList.add('active');
        singleBtn.classList.remove('active');
    });

    // Student search in single entry
    document.getElementById('searchStudentBtn').addEventListener('click', () => {
        const id = document.getElementById('studentId').value.trim();
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        const student = students.find(s => s.id === id);
        if (student) {
            document.getElementById('studentInfo').style.display = 'block';
            document.getElementById('studentName').textContent = student.name + ' (' + student.id + ')';
        } else {
            document.getElementById('studentInfo').style.display = 'none';
            showToast('Student not found', 'warning');
        }
    });

    // Handle single form submit
    document.getElementById('singleMarksForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const studentId = document.getElementById('studentId').value.trim();
        const subject = document.getElementById('marksSubject').value;
        const marksValue = parseFloat(document.getElementById('marksValue').value);
        const maxMarks = parseFloat(document.getElementById('maxMarks').value) || 100;
        const assessment = document.getElementById('assessmentType').value;
        const date = document.getElementById('marksDate').value || new Date().toISOString().split('T')[0];

        if (!studentId || isNaN(marksValue)) {
            showToast('Please provide valid student ID and marks', 'error');
            return;
        }

        const students = JSON.parse(localStorage.getItem('students') || '[]');
        const exists = students.some(s => s.id === studentId);
        if (!exists) {
            showToast('Student ID does not exist', 'error');
            return;
        }

        const marks = JSON.parse(localStorage.getItem('marks') || '[]');
        marks.push({ studentId: studentId, subject: subject, type: assessment.toLowerCase(), marks: marksValue, maxMarks: maxMarks, remarks: '', date: new Date(date).toISOString() });
        localStorage.setItem('marks', JSON.stringify(marks));
        showToast('Marks saved successfully', 'success');
        // reset form
        this.reset();
        document.getElementById('studentInfo').style.display = 'none';
        modal.classList.remove('active');
        document.body.style.overflow = '';
        loadTeacherDashboard();
    });

    // CSV upload handling
    const csvInput = document.getElementById('csvFileInput');
    const browseBtn = document.getElementById('browseCsvBtn');
    const csvPreview = document.getElementById('csvPreview');
    const csvPreviewBody = document.getElementById('csvPreviewBody');
    const processBtn = document.getElementById('processCsvBtn');
    const csvDropZone = document.getElementById('csvDropZone');
    const downloadTemplate = document.getElementById('downloadTemplate');

    browseBtn.addEventListener('click', () => csvInput.click());

    csvDropZone.addEventListener('click', () => csvInput.click());

    ['dragenter','dragover'].forEach(ev => csvDropZone.addEventListener(ev, (e) => { e.preventDefault(); csvDropZone.classList.add('dragover'); }));
    ['dragleave','drop'].forEach(ev => csvDropZone.addEventListener(ev, (e) => { e.preventDefault(); csvDropZone.classList.remove('dragover'); }));

    csvDropZone.addEventListener('drop', (e) => {
        const file = e.dataTransfer.files && e.dataTransfer.files[0];
        if (file) handleCsvFile(file);
    });

    csvInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) handleCsvFile(file);
    });

    downloadTemplate.addEventListener('click', (e) => {
        e.preventDefault();
        const csv = 'studentId,subject,marks,maxMarks,assessmentType,date\nS1001,Mathematics,85,100,Assignment,' + new Date().toISOString().split('T')[0] + '\n';
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'marks-template.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    });

    function handleCsvFile(file) {
        const reader = new FileReader();
        reader.onload = function(ev) {
            const text = ev.target.result;
            const rows = parseCsvText(text);
            if (!rows || !rows.length) { showToast('No valid rows found in CSV', 'warning'); return; }

            // show preview
            csvPreviewBody.innerHTML = rows.slice(0, 20).map(r => `\n                <tr>\n                    <td>${escapeHtml(r.studentId)}</td>\n                    <td>${escapeHtml(r.subject)}</td>\n                    <td>${escapeHtml(r.marks)}</td>\n                    <td>${escapeHtml(r.assessmentType)}</td>\n                </tr>`).join('');
            csvPreview.style.display = 'block';
            processBtn.style.display = 'block';

            processBtn.onclick = () => processCsvRows(rows);
        };
        reader.readAsText(file);
    }

    function processCsvRows(rows) {
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        const marks = JSON.parse(localStorage.getItem('marks') || '[]');
        const errors = [];
        let added = 0;
        rows.forEach((r, idx) => {
            if (!r.studentId || typeof r.marks === 'undefined' || isNaN(parseFloat(r.marks))) {
                errors.push({ row: idx+1, reason: 'Invalid studentId or marks' });
                return;
            }
            const exists = students.some(s => s.id === r.studentId);
            if (!exists) { errors.push({ row: idx+1, reason: 'Student not found: ' + r.studentId }); return; }
            marks.push({ studentId: r.studentId, subject: r.subject || 'General', type: (r.assessmentType || 'assignment').toLowerCase(), marks: parseFloat(r.marks), maxMarks: parseFloat(r.maxMarks) || 100, remarks: r.remarks || '', date: r.date ? new Date(r.date).toISOString() : new Date().toISOString() });
            added++;
        });

        localStorage.setItem('marks', JSON.stringify(marks));
        if (errors.length) {
            showToast(`Processed with ${errors.length} errors. ${added} records added. Check console for details.`, 'warning');
            console.warn('CSV processing errors:', errors);
        } else {
            showToast(`CSV processed successfully. ${added} records added.`, 'success');
        }

        // close and refresh
        modal.classList.remove('active');
        document.body.style.overflow = '';
        loadTeacherDashboard();
    }

    function parseCsvText(text) {
        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length);
        if (!lines.length) return [];
        const headerParts = lines[0].split(',').map(h => h.trim().toLowerCase());
        const hasHeader = headerParts.includes('studentid') || headerParts.includes('student_id') || headerParts.includes('studentId');
        const rows = [];
        for (let i = hasHeader ? 1 : 0; i < lines.length; i++) {
            const parts = lines[i].split(',').map(p => p.trim());
            // support minimal columns
            const studentId = parts[0];
            const subject = parts[1] || 'General';
            const marks = parts[2] || '';
            const maxMarks = parts[3] || '100';
            const assessmentType = parts[4] || 'assignment';
            const date = parts[5] || '';
            rows.push({ studentId, subject, marks, maxMarks, assessmentType, date });
        }
        return rows;
    }

    function escapeHtml(s) { return (s+'').replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
}

function editAttendance() {
    if (!AppState.currentUser || AppState.currentUser.role !== 'teacher') {
        showToast('Only teachers can edit attendance', 'error');
        return;
    }

    // Build modal HTML
    const attendance = getAllAttendance();
    const students = JSON.parse(localStorage.getItem('students') || '[]');

    const modalHTML = `
        <div class="modal active" id="attendanceEditModal">
            <div class="modal-content" style="max-width: 900px;">
                <div class="modal-header">
                    <h3><i class="fas fa-edit"></i> Edit Attendance</h3>
                    <button class="modal-close" id="closeAttendanceEdit">&times;</button>
                </div>
                <div class="modal-body">
                    <p style="color:var(--gray-500);">Edit attendance records below. Changes will update local storage.</p>
                    <div style="overflow:auto; max-height:60vh; margin-top:1rem;">
                        <table class="data-table" id="attendanceEditTable" style="width:100%; min-width:720px;">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Student ID</th>
                                    <th>Name</th>
                                    <th>Subject</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${attendance.map((a, i) => {
                                    const student = students.find(s => s.id === a.studentId);
                                    const name = student ? student.name : 'Unknown';
                                    const dateVal = new Date(a.date).toISOString().split('T')[0];
                                    return `
                                        <tr data-index="${i}" data-original-index="${i}">
                                            <td>${i+1}</td>
                                            <td class="att-student-id">${a.studentId}</td>
                                            <td>${name}</td>
                                            <td><input class="form-control att-subject" value="${a.subject || ''}" /></td>
                                            <td><input type="date" class="form-control att-date" value="${dateVal}" /></td>
                                            <td>
                                                <select class="form-control att-status">
                                                    <option value="present" ${a.status === 'present' ? 'selected' : ''}>present</option>
                                                    <option value="absent" ${a.status === 'absent' ? 'selected' : ''}>absent</option>
                                                </select>
                                            </td>
                                            <td><button class="btn btn-danger att-delete">Delete</button></td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                    <div style="display:flex;gap:0.5rem;justify-content:flex-end;margin-top:1rem;">
                        <button class="btn btn-secondary" id="cancelAttendanceEdits">Cancel</button>
                        <button class="btn" id="saveAttendanceEdits">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';

    // Attach listeners
    setTimeout(() => {
        const modal = document.getElementById('attendanceEditModal');
        const closeBtn = document.getElementById('closeAttendanceEdit');
        const cancelBtn = document.getElementById('cancelAttendanceEdits');
        const saveBtn = document.getElementById('saveAttendanceEdits');

        if (closeBtn) closeBtn.addEventListener('click', () => { if (modal) modal.remove(); document.body.style.overflow = ''; });
        if (cancelBtn) cancelBtn.addEventListener('click', () => { if (modal) modal.remove(); document.body.style.overflow = ''; });

        // Delete row (UI-only; persist on Save)
        document.querySelectorAll('#attendanceEditTable .att-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const tr = this.closest('tr');
                if (!tr) return;
                if (!confirm('Delete this attendance record?')) return;
                tr.remove();
                showToast('Record removed from editor (not saved yet)', 'info');
                // re-index rows and update data-index attributes
                document.querySelectorAll('#attendanceEditTable tbody tr').forEach((r, i) => {
                    r.dataset.index = i;
                    const firstTd = r.querySelector('td');
                    if (firstTd) firstTd.textContent = i+1;
                });
            });
        });

        // Save changes
        if (saveBtn) saveBtn.addEventListener('click', () => {
            const rows = Array.from(document.querySelectorAll('#attendanceEditTable tbody tr'));
            const snapshot = attendance; // original snapshot in order
            const updated = [];

            rows.forEach((r) => {
                const origIdx = parseInt(r.dataset.originalIndex, 10);
                const studentId = r.querySelector('.att-student-id').textContent.trim();
                const subject = r.querySelector('.att-subject').value.trim();
                const date = r.querySelector('.att-date').value;
                const status = r.querySelector('.att-status').value;
                const base = (typeof snapshot[origIdx] !== 'undefined') ? snapshot[origIdx] : {};
                updated.push({
                    studentId: studentId,
                    subject: subject || (base.subject || 'General'),
                    teacherId: base.teacherId || base.teacherId || 'Unknown',
                    classId: base.classId || base.classId || 'Unknown',
                    date: new Date(date).toISOString(),
                    status: status
                });
            });

            localStorage.setItem('attendance', JSON.stringify(updated));
            showToast('Attendance updated successfully', 'success');
            if (modal) modal.remove();
            document.body.style.overflow = '';
            // Keep teacher on Teacher dashboard after editing
            loadTeacherDashboard();
        });

        // Close on background click
        if (modal) modal.addEventListener('click', function(e) { if (e.target === this) { modal.remove(); document.body.style.overflow = ''; } });
    }, 100);
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

function generateQRCode() {
    // Create a unique session ID
    const sessionId = 'SESS_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Get subject from teacher (you can modify this to get from input)
    const subject = prompt("Enter subject name for this QR session:", "Mathematics");
    
    if (!subject) return;
    
    // Create QR data: "subject|sessionId|timestamp"
    const qrData = `${subject}|${sessionId}|${Date.now()}`;
    
    // Generate QR code
    document.getElementById('mainContent').innerHTML = `
        <div class="container">
            <div class="dashboard-header">
                <h1><i class="fas fa-qrcode"></i> Generate QR Code</h1>
                <button class="btn" onclick="loadDashboard()">
                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                </button>
            </div>
            
            <div class="sections-grid">
                <div class="card">
                    <div class="section-header">
                        <h3><i class="fas fa-qrcode"></i> QR Code for: ${subject}</h3>
                        <span class="badge badge-info">Session: ${sessionId}</span>
                    </div>
                    
                    <div style="text-align: center; padding: 2rem;">
                        <!-- QR Code will be rendered here -->
                        <div id="qrcode" style="margin: 0 auto; display: inline-block;"></div>
                        
                        <div style="margin-top: 2rem;">
                            <p><strong>Subject:</strong> ${subject}</p>
                            <p><strong>Session ID:</strong> ${sessionId}</p>
                            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                        </div>
                        
                        <div style="margin-top: 2rem;">
                            <button class="btn btn-success" onclick="downloadQRCode()">
                                <i class="fas fa-download"></i> Download QR Code
                            </button>
                            <button class="btn" onclick="printQRCode()">
                                <i class="fas fa-print"></i> Print
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <div class="section-header">
                        <h3><i class="fas fa-info-circle"></i> Instructions</h3>
                    </div>
                    <ol style="padding-left: 1.5rem;">
                        <li>Display this QR code to your students</li>
                        <li>Students scan it using their phone cameras</li>
                        <li>Attendance is automatically recorded</li>
                        <li>Each QR code can only be scanned once per student</li>
                        <li>Generate a new code for each class session</li>
                    </ol>
                    
                    <div style="margin-top: 2rem;">
                        <h4>Active Sessions</h4>
                        <div id="activeSessions" style="margin-top: 1rem;">
                            <!-- Active sessions will be listed here -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Generate QR code image
    setTimeout(() => {
        const qrcodeEl = document.getElementById('qrcode');
        qrcodeEl.innerHTML = '';

        // Prefer 'qrcode' library with toCanvas (https://github.com/soldair/node-qrcode)
        if (window.QRCode && typeof QRCode.toCanvas === 'function') {
            // Create a canvas element (library expects a canvas or context, not a div)
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            canvas.style.width = '256px';
            canvas.style.height = '256px';
            qrcodeEl.appendChild(canvas);

            QRCode.toCanvas(canvas, qrData, {
                width: 256,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            }, function(error) {
                if (error) {
                    console.error(error);
                    qrcodeEl.innerHTML = '<p style="color: red;">Failed to generate QR code</p>';
                }
            });
        } else if (typeof qrcode === 'function') {
            // Use qrcode-generator fallback (creates SVG)
            try {
                const qr = qrcode(0, 'M');
                qr.addData(qrData);
                qr.make();
                const svg = qr.createSvgTag({ cellSize: 4, margin: 0 });
                qrcodeEl.innerHTML = svg;
            } catch (err) {
                console.error(err);
                qrcodeEl.innerHTML = '<p style="color: red;">Failed to generate QR code</p>';
            }
        } else {
            qrcodeEl.innerHTML = '<p style="color: red;">No QR library available</p>';
            showToast('No QR library available to generate the QR code', 'error');
        }

        // Save this session
        saveSession(subject, sessionId, qrData);
        loadActiveSessions();
    }, 100);
}

function saveSession(subject, sessionId, qrData) {
    const sessions = JSON.parse(localStorage.getItem('teacherSessions') || '[]');
    
    sessions.push({
        subject: subject,
        sessionId: sessionId,
        qrData: qrData,
        generatedAt: new Date().toISOString(),
        attendanceCount: 0
    });
    
    localStorage.setItem('teacherSessions', JSON.stringify(sessions));
    showToast(`QR session created for ${subject}`, 'success');
}

function loadActiveSessions() {
    const sessions = JSON.parse(localStorage.getItem('teacherSessions') || '[]');
    const container = document.getElementById('activeSessions');
    
    if (sessions.length === 0) {
        container.innerHTML = '<p>No active sessions</p>';
        return;
    }
    
    // Show last 3 sessions
    const recentSessions = sessions.slice(-3).reverse();
    
    container.innerHTML = recentSessions.map(session => `
        <div style="border: 1px solid #ddd; border-radius: 5px; padding: 0.75rem; margin-bottom: 0.5rem;">
            <div style="display: flex; justify-content: space-between;">
                <strong>${session.subject}</strong>
                <small>${new Date(session.generatedAt).toLocaleTimeString()}</small>
            </div>
            <div style="font-size: 0.8rem; color: #666;">ID: ${session.sessionId}</div>
        </div>
    `).join('');
}

function downloadQRCode() {
    const canvas = document.querySelector('#qrcode canvas');
    if (canvas) {
        const link = document.createElement('a');
        link.download = `qr-attendance-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('QR code downloaded', 'success');
        return;
    }

    // Try SVG fallback
    const svg = document.querySelector('#qrcode svg');
    if (svg) {
        const svgContent = svg.outerHTML;
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qr-attendance-${Date.now()}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('QR code downloaded (SVG)', 'success');
        return;
    }

    showToast('QR code not found', 'error');
}

function printQRCode() {
    window.print();
}