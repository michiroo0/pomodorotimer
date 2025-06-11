class PomodoroTimer {
    constructor() {
        this.isRunning = false;
        this.currentTimer = null;
        this.timeLeft = 25 * 60; // 25分を秒に変換
        this.sessionType = 'work'; // 'work' or 'break'
        this.voice = null;
        this.speechSynthesis = null;
        this.isSpeaking = false; // 音声再生中かどうかのフラグ
        this.initializeElements();
        this.initializeEventListeners();
        this.initializeSpeech();
    }

    initializeSpeech() {
        // 音声合成エンジンの初期化
        this.speechSynthesis = window.speechSynthesis;

        // 音声合成エンジンが準備できたら、音声を設定
        this.speechSynthesis.onvoiceschanged = () => {
            const voices = this.speechSynthesis.getVoices();
            // 日本語の女性の声を探す
            // 「Kyoko」や「Haruka」のような若々しい声を探す
            this.voice = voices.find(voice => 
                voice.lang === 'ja-JP' && 
                (voice.name.includes('Kyoko') || 
                 voice.name.includes('Haruka') || 
                 voice.name.includes('女性') || 
                 voice.name.includes('Girl'))
            );

            // 音声が見つかった場合、テスト音声を再生
            if (this.voice) {
                const utterance = new SpeechSynthesisUtterance('音声が準備できました');
                utterance.voice = this.voice;
                this.speechSynthesis.speak(utterance);
            }
        };

        // 初期化のため、一度音声合成を開始
        const utterance = new SpeechSynthesisUtterance('');
        this.speechSynthesis.speak(utterance);

        // 音声エンジンの準備完了を待つための遅延
        setTimeout(() => {
            if (this.voice) {
                console.log('音声エンジンが準備できました');
            } else {
                console.log('音声エンジンの準備に失敗しました');
            }
        }, 1000);
    }

    speak(text) {
        if (!this.voice) {
            console.log('音声が設定されていません');
            return;
        }

        // 音声が再生中でない場合のみ実行
        if (this.isSpeaking) return;

        // 現在の音声をキャンセル
        this.speechSynthesis.cancel();

        // 音声の設定
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.voice;
        utterance.pitch = 1.5; // より柔らかい声
        utterance.rate = 0.7; // より自然な速度
        utterance.volume = 0.6; // やや大きい音量
        utterance.lang = 'ja-JP'; // 日本語
        utterance.pitchVariation = 0.4; // 適度な音程の変化
        utterance.stress = 0.6; // やや控えめな強調度
        utterance.range = 0.8; // 適度な音域

        // 音声のイベントリスナー
        utterance.onstart = () => {
            console.log('音声を再生中:', text);
            utterance.pitch = 1.5; // 開始時の音程
        };
        utterance.onend = () => {
            console.log('音声の再生が終了しました');
            utterance.pitch = 1.4; // 終了時の音程を少し下げ
            this.isSpeaking = false;
        };
        utterance.onerror = (error) => {
            console.error('音声の再生中にエラーが発生しました:', error);
            this.isSpeaking = false;
        };

        // 音声再生中フラグを設定
        this.isSpeaking = true;

        // 音声の再生
        this.speechSynthesis.speak(utterance);
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
        this.startBtn.addEventListener('click', () => {
            this.startTimer();
            this.speak('タイマーを開始します');
        });
        this.stopBtn.addEventListener('click', () => {
            this.stopTimer();
            this.speak('タイマーを停止しました');
        });
        this.resetBtn.addEventListener('click', () => {
            this.resetTimer();
            this.updateDisplay();
            this.speak('タイマーをリセットしました');
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
                this.speak(this.sessionType === 'work' ? '作業時間を開始します' : '休憩時間を開始します');
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

// DOMが読み込まれた後にタイマーを初期化
document.addEventListener('DOMContentLoaded', () => {
    const pomodoroTimer = new PomodoroTimer();
});
