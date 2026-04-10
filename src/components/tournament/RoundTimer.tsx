import { useState, useEffect, useRef } from 'react';
import { formatTime } from '../../lib/utils';

interface Props {
  timerEnd: number | null;
  timerMinutes: number;
  onStart: () => void;
  onReset: () => void;
}

export default function RoundTimer({ timerEnd, timerMinutes, onStart, onReset }: Props) {
  const [remaining, setRemaining] = useState<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    if (timerEnd === null) {
      setRemaining(timerMinutes * 60);
      return;
    }

    const tick = () => {
      const diff = Math.max(0, Math.ceil((timerEnd - Date.now()) / 1000));
      setRemaining(diff);
    };

    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerEnd, timerMinutes]);

  if (timerMinutes === 0) return null;

  const isRunning = timerEnd !== null && remaining > 0;
  const isExpired = timerEnd !== null && remaining === 0;

  return (
    <div className={`bg-dark-card border rounded-lg p-4 text-center ${
      isExpired ? 'border-loss/50 animate-pulse' : 'border-dark-border'
    }`}>
      <div className="text-xs text-slate-400 uppercase mb-1">Round Timer</div>
      <div className={`text-4xl font-mono font-bold ${
        isExpired ? 'text-loss' : remaining <= 300 && isRunning ? 'text-draw' : 'text-white'
      }`}>
        {formatTime(remaining)}
      </div>
      <div className="flex gap-2 justify-center mt-3">
        {!isRunning && !isExpired && (
          <button
            onClick={onStart}
            className="bg-win hover:bg-win/80 text-black px-4 py-1.5 rounded text-sm font-medium transition-colors"
          >
            Start
          </button>
        )}
        {(isRunning || isExpired) && (
          <button
            onClick={onReset}
            className="bg-dark-surface hover:bg-dark-border text-slate-300 px-4 py-1.5 rounded text-sm font-medium transition-colors"
          >
            Reset
          </button>
        )}
        {isExpired && (
          <span className="text-loss text-sm font-medium self-center">Time's up!</span>
        )}
      </div>
    </div>
  );
}
