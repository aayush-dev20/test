// ==============================================
// DATA MANAGEMENT FUNCTIONS
// ==============================================
function initSampleData() {
    // Initialize students
    if (!localStorage.getItem('students')) {
        const students = [
            { id: 'S1001', name: 'Rahul Sharma', email: 'rahul@college.edu', role: 'student', password: 'student123' },
            { id: 'S1002', name: 'Priya Patel', email: 'priya@college.edu', role: 'student', password: 'student123' },
            { id: 'S1003', name: 'Amit Kumar', email: 'amit@college.edu', role: 'student', password: 'student123' },
            { id: 'S1004', name: 'Neha Singh', email: 'neha@college.edu', role: 'student', password: 'student123' },
            { id: 'S1005', name: 'Vikram Joshi', email: 'vikram@college.edu', role: 'student', password: 'student123' }
        ];
        localStorage.setItem('students', JSON.stringify(students));
    }
    
    // Initialize teachers
    if (!localStorage.getItem('teachers')) {
        const teachers = [
            { id: 'T2001', name: 'Dr. R. Sharma', email: 'r.sharma@college.edu', role: 'teacher', password: 'teacher123' },
            { id: 'T2002', name: 'Prof. A. Desai', email: 'a.desai@college.edu', role: 'teacher', password: 'teacher123' }
        ];
        localStorage.setItem('teachers', JSON.stringify(teachers));
    }
    
    // Initialize attendance
    if (!localStorage.getItem('attendance')) {
        const attendance = [
            { studentId: 'S1001', subject: 'Mathematics', date: new Date().toISOString(), status: 'present' },
            { studentId: 'S1002', subject: 'Mathematics', date: new Date().toISOString(), status: 'present' },
            { studentId: 'S1003', subject: 'Mathematics', date: new Date().toISOString(), status: 'absent' },
            { studentId: 'S1004', subject: 'Physics', date: new Date(Date.now() - 86400000).toISOString(), status: 'present' },
            { studentId: 'S1005', subject: 'Physics', date: new Date(Date.now() - 86400000).toISOString(), status: 'present' },
            { studentId: 'S1001', subject: 'Chemistry', date: new Date(Date.now() - 172800000).toISOString(), status: 'present' }
        ];
        localStorage.setItem('attendance', JSON.stringify(attendance));
    }
    
    // Initialize marks
    if (!localStorage.getItem('marks')) {
        const marks = [
            { studentId: 'S1001', subject: 'Mathematics', type: 'semester', marks: 85, remarks: 'Excellent', date: new Date().toISOString() },
            { studentId: 'S1002', subject: 'Mathematics', type: 'semester', marks: 78, remarks: 'Good', date: new Date().toISOString() },
            { studentId: 'S1003', subject: 'Physics', type: 'assignment', marks: 92, remarks: 'Outstanding', date: new Date(Date.now() - 86400000).toISOString() },
            { studentId: 'S1004', subject: 'Chemistry', type: 'quiz', marks: 70, remarks: 'Needs improvement', date: new Date(Date.now() - 172800000).toISOString() },
            { studentId: 'S1005', subject: 'Programming', type: 'project', marks: 88, remarks: 'Well done', date: new Date(Date.now() - 259200000).toISOString() }
        ];
        localStorage.setItem('marks', JSON.stringify(marks));
    }
}

function getStudentAttendance(studentId) {
    const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
    return attendance.filter(a => a.studentId === studentId);
}

function getStudentMarks(studentId) {
    const marks = JSON.parse(localStorage.getItem('marks') || '[]');
    return marks.filter(m => m.studentId === studentId);
}

function getAllAttendance() {
    return JSON.parse(localStorage.getItem('attendance') || '[]');
}

function getAllMarks() {
    return JSON.parse(localStorage.getItem('marks') || '[]');
}

function getMarksSummary() {
    const marks = getAllMarks();
    const summary = {};
    
    marks.forEach(mark => {
        const key = `${mark.date.split('T')[0]}_${mark.subject}_${mark.type}`;
        if (!summary[key]) {
            summary[key] = {
                date: mark.date,
                subject: mark.subject,
                type: mark.type,
                count: 0
            };
        }
        summary[key].count++;
    });
    
    return Object.values(summary).sort((a, b) => new Date(b.date) - new Date(a.date));
}

function calculateOverallAttendance() {
    const attendance = getAllAttendance();
    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'present').length;
    return total > 0 ? Math.round((present / total) * 100) : 0;
}

// ==============================================
// NOTIFICATION SYSTEM
// ==============================================
function initNotifications() {
    if (!localStorage.getItem('notifications')) {
        const notifications = [
            { id: 1, type: 'info', message: 'Welcome to EduTrack Pro!', time: 'Just now' },
            { id: 2, type: 'success', message: 'System updated successfully', time: '2 hours ago' },
            { id: 3, type: 'warning', message: 'Attendance below 75% in Mathematics', time: '1 day ago' }
        ];
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }
    AppState.notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
}

function addNotification(type, message) {
    const notification = {
        id: Date.now(),
        type: type,
        message: message,
        time: 'Just now'
    };
    
    AppState.notifications.unshift(notification);
    if (AppState.notifications.length > 10) {
        AppState.notifications = AppState.notifications.slice(0, 10);
    }
    
    localStorage.setItem('notifications', JSON.stringify(AppState.notifications));
}