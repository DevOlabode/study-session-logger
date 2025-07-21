let timerInterval;
let startTime;
let isRunning = false;

function startTimer() {
    if (!isRunning) {
        startTime = new Date();
        isRunning = true;
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('stopBtn').style.display = 'inline-block';
        
        timerInterval = setInterval(updateTimer, 1000);
        
        // Request notification permission
        if ('Notification' in window) {
            Notification.requestPermission();
        }
    }
}

function stopTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        document.getElementById('startBtn').style.display = 'inline-block';
        document.getElementById('stopBtn').style.display = 'none';
        document.getElementById('timer').textContent = '00:00:00';
        
        // Set the start time for the form
        document.getElementById('startTime').value = startTime.toISOString();
    }
}

function updateTimer() {
    if (startTime) {
        const now = new Date();
        const diff = now - startTime;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        document.getElementById('timer').textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
} 