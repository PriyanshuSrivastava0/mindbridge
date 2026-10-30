import { useState } from 'react';
import { Compass, CheckCircle2, Eye, Hand, Volume2, Sparkles, Coffee } from 'lucide-react';
import confetti from 'canvas-confetti';

const STEPS = [
  {
    count: 5,
    sense: 'SEE',
    title: '5 Things you can SEE around you',
    icon: Eye,
    prompt: 'Look at the room, desk, window, light patterns, shadows, or small details.',
    color: 'text-indigo-600 bg-indigo-50'
  },
  {
    count: 4,
    sense: 'TOUCH',
    title: '4 Things you can physically TOUCH / FEEL',
    icon: Hand,
    prompt: 'Feel the fabric of your clothes, the desk surface, your feet on the floor, or the cool air.',
    color: 'text-teal-600 bg-teal-50'
  },
  {
    count: 3,
    sense: 'HEAR',
    title: '3 Things you can HEAR right now',
    icon: Volume2,
    prompt: 'Listen for distant traffic, a ceiling fan, distant voices, or your own breath.',
    color: 'text-purple-600 bg-purple-50'
  },
  {
    count: 2,
    sense: 'SMELL',
    title: '2 Things you can SMELL',
    icon: Sparkles,
    prompt: 'Notice the scent of coffee, room fragrance, laundry detergent, or fresh air.',
    color: 'text-amber-600 bg-amber-50'
  },
  {
    count: 1,
    sense: 'TASTE',
    title: '1 Thing you can TASTE',
    icon: Coffee,
    prompt: 'Take a sip of water, notice the lingering taste of mint, or simply focus on your mouth.',
    color: 'text-emerald-600 bg-emerald-50'
  }
];

export function GroundingExercise() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [notes, setNotes] = useState<Record<number, string>>({});

  const currentStep = STEPS[currentStepIndex];

  const handleNext = () => {
    if (!completedSteps.includes(currentStepIndex)) {
      setCompletedSteps([...completedSteps, currentStepIndex]);
    }
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const isDone = completedSteps.length === STEPS.length;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
      <div className="flex items-center space-x-2 text-[#303F70] mb-2">
        <Compass className="w-5 h-5 text-[#64B6AC]" />
        <h3 className="text-xl font-bold">5-4-3-2-1 Sensory Grounding</h3>
      </div>
      <p className="text-xs text-[#697386] mb-6">
        An evidence-based somatic grounding technique that activates the sensory cortex to arrest runaway panic cycles.
      </p>

      {/* Progress Pills */}
      <div className="grid grid-cols-5 gap-2 mb-8">
        {STEPS.map((s, idx) => (
          <button
            key={s.count}
            onClick={() => setCurrentStepIndex(idx)}
            className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all border ${
              currentStepIndex === idx
                ? 'border-[#303F70] bg-[#303F70]/5 text-[#303F70]'
                : completedSteps.includes(idx)
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                : 'border-slate-100 bg-slate-50 text-slate-400'
            }`}
          >
            {completedSteps.includes(idx) ? '✓ ' : ''}{s.count} {s.sense}
          </button>
        ))}
      </div>

      {/* Step Card */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${currentStep.color}`}>
            {currentStep.count}
          </div>
          <div>
            <h4 className="text-base font-bold text-[#20283D]">{currentStep.title}</h4>
            <p className="text-xs text-[#697386] mt-0.5">{currentStep.prompt}</p>
          </div>
        </div>

        <textarea
          rows={3}
          value={notes[currentStepIndex] || ''}
          onChange={(e) => setNotes({ ...notes, [currentStepIndex]: e.target.value })}
          placeholder="Optional: Type what you notice to anchor your focus..."
          className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#303F70]/20"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
          className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 disabled:opacity-40 hover:bg-slate-50"
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          className="px-6 py-2.5 rounded-xl bg-[#303F70] hover:bg-[#202b4d] text-white text-xs font-bold shadow-sm transition-transform active:scale-95 flex items-center space-x-1.5"
        >
          <span>{currentStepIndex === STEPS.length - 1 ? 'Complete Grounding' : 'Next Step'}</span>
          <CheckCircle2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {isDone && (
        <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center font-medium animate-fade-in">
          ✨ Wonderful job grounding yourself today. Take a moment to feel your body resting firmly where you are sitting.
        </div>
      )}
    </div>
  );
}

