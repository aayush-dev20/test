import { useState, useEffect } from 'react';

export function useEduTrack() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('student');
  const [darkMode, setDarkMode] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Initialize sample data
  const initSampleData = () => {
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
    
    if (!localStorage.getItem('teachers')) {
      const teachers = [
        { id: 'T2001', name: 'Dr. R. Sharma', email: 'r.sharma@college.edu', role: 'teacher', password: 'teacher123' },
        { id: 'T2002', name: 'Prof. A. Desai', email: 'a.desai@college.edu', role: 'teacher', password: 'teacher123' }
      ];
      localStorage.setItem('teachers', JSON.stringify(teachers));
    }
    
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
  };

  // Login function
  const loginUser = (id, password, role) => {
    const users = role === 'student' 
      ? JSON.parse(localStorage.getItem('students') || '[]')
      : JSON.parse(localStorage.getItem('teachers') || '[]');
    
    const user = users.find(u => u.id === id && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      sessionStorage.setItem('eduTrackUser', JSON.stringify(user));
      return { success: true, user };
    }
    
    return { success: false, error: 'Invalid credentials' };
  };

  // Register function
  const registerUser = (userData) => {
    let users = userData.role === 'student'
      ? JSON.parse(localStorage.getItem('students') || '[]')
      : JSON.parse(localStorage.getItem('teachers') || '[]');
    
    if (users.some(u => u.id === userData.id || u.email === userData.email)) {
      return { success: false, error: 'User with this ID or email already exists' };
    }
    
    users.push(userData);
    
    localStorage.setItem(
      userData.role === 'student' ? 'students' : 'teachers',
      JSON.stringify(users)
    );
    
    setCurrentUser(userData);
    sessionStorage.setItem('eduTrackUser', JSON.stringify(userData));
    
    return { success: true, user: userData };
  };

  // Logout function
  const logoutUser = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('eduTrackUser');
  };

  // Initialize on mount
  useEffect(() => {
    initSampleData();
    
    // Check auth status
    const userData = sessionStorage.getItem('eduTrackUser');
    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Check theme
    const savedTheme = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedTheme);
    if (savedTheme) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  // Toggle theme
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

  // Voice commands
  const startVoiceRecognition = () => {
    setIsVoiceActive(true);
    // Simulate voice command
    setTimeout(() => {
      const commands = ['show dashboard', 'scan qr code', 'view attendance'];
      const randomCommand = commands[Math.floor(Math.random() * commands.length)];
      console.log('Voice command:', randomCommand);
      setIsVoiceActive(false);
    }, 2000);
  };

  return {
    currentUser,
    selectedRole,
    setSelectedRole,
    darkMode,
    toggleTheme,
    isVoiceActive,
    startVoiceRecognition,
    notifications,
    loginUser,
    registerUser,
    logoutUser,
    initSampleData
  };
}