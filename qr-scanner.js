// ==============================================
// QR CODE FUNCTIONS
// ==============================================
function scanQRCode() {
    showToast('Opening QR scanner...', 'info');
    // Simulate QR scanning
    setTimeout(() => {
        const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Programming', 'Database'];
        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
        
        markAttendance(randomSubject);
    }, 2000);
}

function simulateQRScan() {
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Programming', 'Database'];
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    
    showToast(`Scanning QR for ${randomSubject}...`, 'info');
    
    setTimeout(() => {
        markAttendance(randomSubject);
    }, 1500);
}

function markAttendance(subject) {
    const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
    
    attendance.push({
        studentId: AppState.currentUser.id,
        subject: subject,
        date: new Date().toISOString(),
        status: 'present'
    });
    
    localStorage.setItem('attendance', JSON.stringify(attendance));
    showToast(`Attendance marked for ${subject}!`, 'success');
    
    // Reload dashboard to show updated attendance
    loadDashboard();
}

function generateQRCode() {
    showToast('QR Code generated for classroom attendance', 'success');
    // In a real application, this would generate an actual QR code
}