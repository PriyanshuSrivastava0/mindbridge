import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, Wind } from 'lucide-react';
import confetti from 'canvas-confetti';

export function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev > 1) return prev - 1;

          // Transition phases
          if (phase === 'Inhale') {
            setPhase('Hold');
            return 7;
          } else if (phase === 'Hold') {
            setPhase('Exhale');
            return 8;
          } else {
            // Completed 1 cycle
            setCyclesCompleted((c) => {
              const next = c + 1;
              if (next >= 4) {
                confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
              }
              return next;
            });
            setPhase('Inhale');
            return 4;
          }
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => { if (interval) clearInterval(interval); };
  }, [isActive, phase]);

  const handleReset = () => {
    setIsActive(false);
    setPhase('Inhale');
    setSecondsLeft(4);
    setCyclesCompleted(0);
  };

  const getCircleScale = () => {
    if (!isActive) return 'scale-90';
    if (phase === 'Inhale') return 'scale-125 transition-transform duration-[4000ms] ease-out';
    if (phase === 'Hold') return 'scale-125';
    return 'scale-75 transition-transform duration-[8000ms] ease-in';
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm text-center">
      <div className="flex items-center justify-center space-x-2 text-[#303F70] mb-2">
        <Wind className="w-5 h-5 text-[#64B6AC]" />
        <h3 className="text-xl font-bold">4-7-8 Parasympathetic Breathing</h3>
      </div>
      <p className="text-xs text-[#697386] max-w-md mx-auto mb-8">
        Designed by clinical physicians to calm the sympathetic nervous system and reduce acute anxiety or panic.
      </p>

      {/* Visual Breathing Bubble */}
      <div className="relative w-64 h-64 mx-auto flex items-center justify-center mb-8">
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-tr from-[#A99CE0]/30 to-[#64B6AC]/30 blur-xl transition-all duration-1000 ${
            isActive ? 'opacity-100' : 'opacity-40'
          }`}
        ></div>

        <div
          className={`w-48 h-48 rounded-full bg-gradient-to-tr from-[#303F70] to-[#A99CE0] text-white flex flex-col items-center justify-center shadow-lg transition-transform ${getCircleScale()}`}
        >
          <span className="text-sm font-semibold tracking-wide uppercase opacity-90">
            {isActive ? phase : 'Ready'}
          </span>
          <span className="text-5xl font-black my-1">
            {isActive ? secondsLeft : '4-7-8'}
          </span>
          <span className="text-[11px] opacity-80">
            {isActive
              ? phase === 'Inhale' ? 'Breathe in through nose' : phase === 'Hold' ? 'Hold gently' : 'Slow whoosh exhale'
              : 'Press Start'}
          </span>
        </div>
      </div>

      {/* Cycles Completed Indicator */}
      <div className="flex items-center justify-center space-x-2 mb-6">
        <span className="text-xs font-semibold text-[#697386]">Cycles Completed:</span>
        <div className="flex space-x-1.5">
          {[1, 2, 3, 4].map((cycle) => (
            <div
              key={cycle}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                cyclesCompleted >= cycle
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {cyclesCompleted >= cycle ? <CheckCircle2 className="w-3.5 h-3.5" /> : cycle}
            </div>
          ))}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center space-x-3">
        <button
          onClick={() => setIsActive(!isActive)}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-[#303F70] hover:bg-[#202b4d] text-white text-sm font-bold shadow-md transition-transform active:scale-95"
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
          <span>{isActive ? 'Pause Exercise' : 'Begin Breathing'}</span>
        </button>

        <button
          onClick={handleReset}
          className="p-3 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

