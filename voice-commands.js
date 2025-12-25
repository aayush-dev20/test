// ==============================================
// VOICE COMMAND SYSTEM
// ==============================================
function initVoiceCommands() {
    const voiceBtn = document.getElementById('voiceIndicator');
    
    voiceBtn.addEventListener('click', () => {
        if (!AppState.isVoiceActive) {
            startVoiceRecognition();
        } else {
            stopVoiceRecognition();
        }
    });
}

function startVoiceRecognition() {
    AppState.isVoiceActive = true;
    document.getElementById('voiceIndicator').classList.add('listening');
    showToast('Listening for voice commands...', 'info');
    
    // Simulate voice command processing
    setTimeout(() => {
        const commands = [
            'show dashboard',
            'scan qr code',
            'view attendance',
            'check marks',
            'generate report'
        ];
        
        const randomCommand = commands[Math.floor(Math.random() * commands.length)];
        processVoiceCommand(randomCommand);
        
        // Auto-stop after 5 seconds
        setTimeout(stopVoiceRecognition, 5000);
    }, 1000);
}

function stopVoiceRecognition() {
    AppState.isVoiceActive = false;
    document.getElementById('voiceIndicator').classList.remove('listening');
    showToast('Voice recognition stopped', 'info');
}

function processVoiceCommand(command) {
    showToast(`Voice command: "${command}"`, 'success');
    
    switch(command.toLowerCase()) {
        case 'show dashboard':
            loadDashboard();
            break;
        case 'scan qr code':
            simulateQRScan();
            break;
        case 'view attendance':
            showToast('Showing attendance records...', 'info');
            break;
        case 'check marks':
            showToast('Opening marks overview...', 'info');
            break;
        case 'generate report':
            exportData();
            break;
    }
}