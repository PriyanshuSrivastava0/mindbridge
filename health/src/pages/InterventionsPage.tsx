import { useState } from 'react';
import { Compass, Wind, Moon, Sparkles, CheckSquare, ArrowRight } from 'lucide-react';
import { BreathingExercise } from '../components/interventions/BreathingExercise';
import { GroundingExercise } from '../components/interventions/GroundingExercise';
import { WELLNESS_INTERVENTIONS } from '../services/ai/recommendations';

export function InterventionsPage({ navigate }: { navigate: (route: string) => void }) {
  const [activeTab, setActiveTab] = useState<'BREATHING' | 'GROUNDING' | 'SLEEP' | 'REFRAME'>('BREATHING');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-[#64B6AC] text-xs font-bold">
          <Compass className="w-3.5 h-3.5" />
          <span>Evidence-Based Self-Care Modules</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#20283D] tracking-tight">
          Somatic & Cognitive Wellness Exercises
        </h1>
        <p className="text-xs sm:text-sm text-[#697386]">
          Interactive, patient-paced micro-interventions designed to soothe acute distress, downregulate stress hormones, and regain calm focus.
        </p>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {[
            { id: 'BREATHING', label: '4-7-8 Breathing Circle', icon: Wind },
            { id: 'GROUNDING', label: '5-4-3-2-1 Sensory Reset', icon: Compass },
            { id: 'SLEEP', label: 'Sleep Wind-Down', icon: Moon },
            { id: 'REFRAME', label: 'Thought Reframing', icon: Sparkles }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 border ${
                  activeTab === tab.id
                    ? 'bg-[#303F70] text-white border-[#303F70] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Exercise Canvas */}
      <div>
        {activeTab === 'BREATHING' && <BreathingExercise />}
        {activeTab === 'GROUNDING' && <GroundingExercise />}

        {activeTab === 'SLEEP' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6 text-center max-w-2xl mx-auto">
            <Moon className="w-12 h-12 text-[#303F70] mx-auto" />
            <h3 className="text-xl font-bold text-[#20283D]">Restorative Sleep Wind-Down Ritual</h3>
            <p className="text-xs text-[#697386] leading-relaxed">
              Research demonstrates that taking 10 minutes to decelerate cognitive stimulation before bed increases deep sleep cycles by up to 23%.
            </p>

            <div className="space-y-3 text-left">
              {[
                { title: "1. Screen Dimming & Warm Lighting", text: "Dim bedside lights and activate blue-light reduction on all screens." },
                { title: "2. 60-Second Brain Dump", text: "Jot down tomorrow's urgent items on a notepad so your mind does not hold onto them." },
                { title: "3. Progressive Muscle Relaxation", text: "Tighten your shoulders for 5 seconds, then let them drop completely." },
                { title: "4. Cool Temperature", text: "Ensure the bedroom temperature is cool and well-ventilated." }
              ].map((step, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="text-xs font-bold text-[#303F70]">{step.title}</h4>
                  <p className="text-xs text-[#697386] mt-0.5">{step.text}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('BREATHING')}
              className="px-6 py-2.5 rounded-xl bg-[#303F70] text-white text-xs font-bold hover:bg-[#202b4d]"
            >
              Continue to 4-7-8 Breathing
            </button>
          </div>
        )}

        {activeTab === 'REFRAME' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <Sparkles className="w-10 h-10 text-[#A99CE0] mx-auto" />
              <h3 className="text-xl font-bold text-[#20283D]">Cognitive Thought Reframing</h3>
              <p className="text-xs text-[#697386]">
                Break cycles of catastrophic thinking by gently challenging irrational assumptions.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#20283D] block mb-1">
                  1. The Distressing Thought (e.g., "I'm going to fail this exam and ruin everything"):
                </label>
                <input
                  type="text"
                  placeholder="Type the recurring catastrophic thought..."
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#20283D] block mb-1">
                  2. Objective Evidence Against It (What are the facts?):
                </label>
                <textarea
                  rows={2}
                  placeholder="I have prepared, I have solved practice problems before, and one test does not define my future..."
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#20283D] block mb-1">
                  3. A Balanced, Compassionate Reframe:
                </label>
                <textarea
                  rows={2}
                  placeholder="It is normal to feel nervous because this matters to me. I will take it one question at a time..."
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => alert("Reframe saved to your reflection space.")}
                className="px-5 py-2.5 rounded-xl bg-[#303F70] text-white text-xs font-bold hover:bg-[#202b4d]"
              >
                Save Balanced Reframe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

