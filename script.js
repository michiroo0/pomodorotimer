class PomodoroTimer {
    constructor() {
        this.isRunning = false;
        this.currentTimer = null;
        this.timeLeft = 25 * 60; // 25分を秒に変換
        this.sessionType = 'work'; // 'work' or 'break'
        this.initializeElements();
        this.initializeEventListeners();
    }

    initializeElements() {
        this.timeDisplay = document.getElementById('timeDisplay');
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.pomodoroTimeInput = document.getElementById('pomodoroTime');
        this.breakTimeInput = document.getElementById('breakTime');
    }

    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.startTimer());
        this.stopBtn.addEventListener('click', () => this.stopTimer());
        this.resetBtn.addEventListener('click', () => {
            this.resetTimer();
            this.updateDisplay();
        });
        this.pomodoroTimeInput.addEventListener('change', () => this.updateTime());
        this.breakTimeInput.addEventListener('change', () => this.updateTime());
    }

    updateTime() {
        const pomodoroTime = parseInt(this.pomodoroTimeInput.value) * 60;
        const breakTime = parseInt(this.breakTimeInput.value) * 60;
        this.timeLeft = this.sessionType === 'work' ? pomodoroTime : breakTime;
        this.updateDisplay();
    }

    startTimer() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.currentTimer = setInterval(() => {
            if (this.timeLeft <= 0) {
                this.stopTimer();
                this.sessionType = this.sessionType === 'work' ? 'break' : 'work';
                const time = this.sessionType === 'work' ? 
                    parseInt(this.pomodoroTimeInput.value) * 60 : 
                    parseInt(this.breakTimeInput.value) * 60;
                this.timeLeft = time;
                this.startTimer();
            } else {
                this.timeLeft--;
                this.updateDisplay();
            }
        }, 1000);
    }

    stopTimer() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        clearInterval(this.currentTimer);
    }

    resetTimer() {
        this.isRunning = false;
        if (this.currentTimer) {
            clearInterval(this.currentTimer);
        }
        this.timeLeft = 25 * 60; // デフォルトの25分にリセット
        this.sessionType = 'work';
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// タイマーの初期化
const pomodoroTimer = new PomodoroTimer();
