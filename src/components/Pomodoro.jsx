import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

const MODE_TIMES = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

export default function Pomodoro() {
  const [mode, setMode] = useState('focus'); // focus, short, long
  const [timeLeft, setTimeLeft] = useState(MODE_TIMES.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const timerRef = useRef(null);
  const totalTime = MODE_TIMES[mode];

  // Chuyển đổi chế độ
  const handleModeChange = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODE_TIMES[newMode]);
  };

  // Khởi động / Tạm dừng
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  // Reset đồng hồ
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODE_TIMES[mode]);
  };

  // Nhạc chuông báo hiệu dùng Web Audio API
  const playAlarmSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const playBeep = (time, frequency, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, time);
        
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.3, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration - 0.05);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(time);
        osc.stop(time + duration);
      };

      // Phát 2 tiếng bíp liên tục
      playBeep(ctx.currentTime, 880, 0.4);
      playBeep(ctx.currentTime + 0.5, 880, 0.4);
    } catch (error) {
      console.warn('Không thể phát âm thanh Pomodoro:', error);
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            playAlarmSound();
            // Tự động chuyển đổi hoặc thông báo
            alert(mode === 'focus' ? 'Hết giờ tập trung! Hãy giải lao một chút.' : 'Hết thời gian nghỉ! Quay lại làm việc thôi.');
            return MODE_TIMES[mode];
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, mode, soundEnabled]);

  // Đồng bộ thời gian khi đổi mode
  useEffect(() => {
    setTimeLeft(MODE_TIMES[mode]);
  }, [mode]);

  // Định dạng thời gian MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Tính toán SVG Dash Offset
  // Bán kính r=55, chu vi = 2 * PI * 55 = 345.575
  const radius = 55;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / totalTime) * circumference;

  return (
    <div className="pomodoro-widget">
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '0.25rem' }}>
        <h2 style={{ fontSize: '0.9375rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Pomodoro Timer</h2>
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)} 
          className="btn-icon" 
          title={soundEnabled ? "Tắt âm báo" : "Bật âm báo"}
          style={{ padding: '0.25rem' }}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>

      <div className="pomodoro-modes">
        <button 
          className={`pomodoro-mode-btn ${mode === 'focus' ? 'active' : ''}`}
          onClick={() => handleModeChange('focus')}
        >
          Tập trung
        </button>
        <button 
          className={`pomodoro-mode-btn ${mode === 'short' ? 'active' : ''}`}
          onClick={() => handleModeChange('short')}
        >
          Nghỉ ngắn
        </button>
        <button 
          className={`pomodoro-mode-btn ${mode === 'long' ? 'active' : ''}`}
          onClick={() => handleModeChange('long')}
        >
          Nghỉ dài
        </button>
      </div>

      <div className="pomodoro-timer-circle">
        <svg className="pomodoro-svg-circle" width="130" height="130">
          {/* Vòng tròn nền */}
          <circle 
            cx="65" 
            cy="65" 
            r={radius} 
            fill="transparent" 
            stroke="var(--border-color)" 
            strokeWidth={strokeWidth} 
          />
          {/* Vòng tròn tiến độ chạy ngược */}
          <circle 
            cx="65" 
            cy="65" 
            r={radius} 
            fill="transparent" 
            stroke="var(--accent-primary)" 
            strokeWidth={strokeWidth} 
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <span className="pomodoro-timer-display">{formatTime(timeLeft)}</span>
      </div>

      <div className="pomodoro-controls">
        <button 
          className="btn btn-primary" 
          onClick={toggleTimer}
          style={{ minWidth: '80px', height: '36px', borderRadius: 'var(--radius-sm)' }}
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
          {isRunning ? 'Tạm dừng' : 'Bắt đầu'}
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={resetTimer}
          title="Đặt lại"
          style={{ width: '36px', height: '36px', padding: 0 }}
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}
