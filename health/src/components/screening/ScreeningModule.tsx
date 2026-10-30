import { useState } from 'react';
import { 
  Activity, 
  HelpCircle, 
  ChevronRight, 
  CheckCircle, 
  RotateCcw, 
  HeartHandshake,
  Compass
} from 'lucide-react';
import { ScreeningType, ScreeningResult } from '../../types';
import { 
  PHQ9_QUESTIONS, 
  GAD7_QUESTIONS, 
  PSS10_QUESTIONS, 
  calculateScreeningScore 
} from '../../services/ai/screening';
import { db } from '../../services/db/mockDatabase';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

export function ScreeningModule({ navigate }: { navigate: (route: string) => void }) {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<ScreeningType>('PHQ-9');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [activeResult, setActiveResult] = useState<ScreeningResult | null>(null);

  const getQuestionSet = () => {
    if (selectedType === 'PHQ-9') return PHQ9_QUESTIONS;
    if (selectedType === 'GAD-7') return GAD7_QUESTIONS;
    return PSS10_QUESTIONS;
  };

  const questions = getQuestionSet();
  const currentQ = questions[currentQuestionIndex];
  const progressPercent = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  const handleSelectOption = (score: number) => {
    const updated = { ...answers, [currentQ.id]: score };
    setAnswers(updated);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Completed all questions
      const finalResult = calculateScreeningScore(selectedType, updated);
      finalResult.userId = user.id;
      db.addScreeningResult(finalResult);
      setActiveResult(finalResult);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });

      // If Item 9 on PHQ-9 is positive, flag for safety review
      if (selectedType === 'PHQ-9' && updated[9] > 0) {
        db.addSafetyCase({
          userId: user.id,
          userDisplayName: user.name,
          institutionId: user.institutionId,
          riskCategory: 'ELEVATED_CONCERN',
          status: 'PENDING_REVIEW',
          escalationRequired: false
        });
      }
    }
  };

  const handleReset = (type: ScreeningType) => {
    setSelectedType(type);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setActiveResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header and Instrument Selectors */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-[#303F70] text-xs font-bold mb-3">
          <Activity className="w-3.5 h-3.5" />
          <span>Clinical-Grade Standardized Screenings</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#20283D] tracking-tight">
          Confidential Mental Wellness Screening
        </h1>
        <p className="text-xs sm:text-sm text-[#697386] max-w-xl mx-auto mt-2">
          Self-paced, voluntary check-ins based on validated clinical psychological instruments. Informational only, non-diagnostic.
        </p>

        {/* Screening Type Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {[
            { type: 'PHQ-9' as ScreeningType, name: 'PHQ-9 Depression Check', desc: '9 questions' },
            { type: 'GAD-7' as ScreeningType, name: 'GAD-7 Anxiety Scale', desc: '7 questions' },
            { type: 'PSS-10' as ScreeningType, name: 'PSS-10 Perceived Stress', desc: '10 questions' }
          ].map((tab) => (
            <button
              key={tab.type}
              onClick={() => handleReset(tab.type)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                selectedType === tab.type
                  ? 'bg-[#303F70] text-white border-[#303F70] shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{tab.name}</span>
              <span className={`block text-[10px] font-normal ${selectedType === tab.type ? 'text-indigo-200' : 'text-[#697386]'}`}>
                {tab.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Flow: Questionnaire OR Results */}
      {!activeResult ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm animate-fade-in">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-[#697386] mb-2 font-medium">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{progressPercent}% Complete</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#303F70] to-[#A99CE0] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Question Prompt */}
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A99CE0] block mb-2">
              Over the last 2 weeks, how often have you been bothered by:
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#20283D] leading-relaxed">
              {currentQ.text}
            </h3>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {currentQ.options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => handleSelectOption(opt.score)}
                className="p-4 rounded-2xl border border-slate-200 hover:border-[#303F70] bg-slate-50 hover:bg-white text-left text-xs sm:text-sm font-semibold text-[#20283D] transition-all shadow-2xs hover:shadow-sm flex items-center justify-between group"
              >
                <span>{opt.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#303F70] transition-colors" />
              </button>
            ))}
          </div>

          {/* Navigation back */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
            <button
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className="text-[#697386] hover:text-[#20283D] disabled:opacity-30 font-medium"
            >
              Previous Question
            </button>
            <span className="text-[11px] text-[#697386]">
              All responses remain private and confidential under your consent policy.
            </span>
          </div>
        </div>
      ) : (
        /* Explainable Assessment Results Card */
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm animate-fade-in space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                  Screening Completed
                </span>
                <span className="text-xs text-[#697386]">{activeResult.screeningType}</span>
              </div>
              <h2 className="text-2xl font-bold text-[#20283D] mt-1">
                Your Assessment Overview
              </h2>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <span className="text-xs text-[#697386] block">Wellness Concern Index</span>
                <span className="text-3xl font-black text-[#303F70]">
                  {activeResult.concernIndex}<span className="text-sm font-normal text-[#697386]">/100</span>
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#303F70]">
                <Activity className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Severity & Score Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-[#697386] font-medium block">Instrument Score</span>
              <span className="text-lg font-bold text-[#20283D] mt-0.5 block">
                {activeResult.totalScore} of {activeResult.maxScore} points
              </span>
              <span className="text-[11px] text-[#697386] mt-1 block">Validated scoring metric</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-[#697386] font-medium block">Symptom Severity Band</span>
              <span className="text-lg font-bold text-[#303F70] mt-0.5 block">
                {activeResult.severityLevel}
              </span>
              <span className="text-[11px] text-[#697386] mt-1 block">Informational categorization</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-[#697386] font-medium block">Assessment Confidence</span>
              <span className="text-lg font-bold text-emerald-700 mt-0.5 block">
                {(activeResult.confidence * 100).toFixed(0)}% (Full completion)
              </span>
              <span className="text-[11px] text-[#697386] mt-1 block">Low uncertainty</span>
            </div>
          </div>

          {/* Explainable Factors Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#303F70]">
              Explainable Factor Breakdown
            </h3>

            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/60 space-y-2">
              <span className="text-xs font-bold text-[#303F70] block">What this means:</span>
              <p className="text-xs text-[#20283D] leading-relaxed">
                {activeResult.explanations.whatItMeans}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2">
              <div className="flex items-center space-x-1.5 text-amber-800 text-xs font-bold">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>What this DOES NOT mean:</span>
              </div>
              <p className="text-xs text-[#20283D] leading-relaxed">
                {activeResult.explanations.whatItDoesNotMean}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="text-xs font-bold text-[#20283D] block">Observed Influencing Indicators:</span>
              <ul className="space-y-1.5 text-xs text-[#697386]">
                {activeResult.explanations.observedIndicators.map((ind, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Next Steps Recommendations */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => handleReset(selectedType)}
              className="inline-flex items-center space-x-2 text-xs font-semibold text-[#697386] hover:text-[#303F70]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Questionnaire</span>
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/interventions')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center space-x-1.5"
              >
                <Compass className="w-4 h-4 text-[#64B6AC]" />
                <span>Try Self-Help Exercises</span>
              </button>

              <button
                onClick={() => navigate('/therapists')}
                className="px-5 py-2.5 rounded-xl bg-[#303F70] hover:bg-[#202b4d] text-white text-xs font-bold shadow-sm transition-transform active:scale-95 flex items-center space-x-1.5"
              >
                <HeartHandshake className="w-4 h-4 text-[#A99CE0]" />
                <span>Book Verified Counsellor</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

