import { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  HeartHandshake, 
  Activity, 
  Compass, 
  Building2, 
  Lock, 
  CheckCircle2, 
  MessageSquare, 
  Star,
  PhoneCall,
  HelpCircle,
  Play
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function LandingPage({ navigate }: { navigate: (route: string) => void }) {
  const { t } = useLanguage();
  const [interactiveChatInput, setInteractiveChatInput] = useState('');
  const [interactiveChatMessages, setInteractiveChatMessages] = useState([
    { sender: 'ai', text: "Hey there. I'm here with you. How has your day been treating you?" }
  ]);
  const [isSimulatingReply, setIsSimulatingReply] = useState(false);

  const handleMiniChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interactiveChatInput.trim()) return;

    const userText = interactiveChatInput.trim();
    setInteractiveChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInteractiveChatInput('');
    setIsSimulatingReply(true);

    setTimeout(() => {
      setIsSimulatingReply(false);
      setInteractiveChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: "I completely hear you. Carrying that kind of pressure alone gets heavy fast. Would you like to try a 4-minute calming breathing exercise, or explore this a bit more together?"
        }
      ]);
    }, 900);
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 bg-gradient-to-b from-white via-[#F7F9FC] to-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-100 text-[#303F70] text-xs font-bold tracking-wide animate-fade-in shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#A99CE0]" />
              <span>AI-Powered Early Support & Clinical Referral Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-[#20283D] tracking-tight leading-[1.15]">
              You Don’t Have to Figure It Out <span className="text-[#303F70] underline decoration-[#A99CE0]/50">Alone</span>.
            </h1>

            <p className="text-base sm:text-lg text-[#697386] leading-relaxed max-w-2xl mx-auto">
              Empathetic, nonjudgmental AI conversations to recognize early distress, validated self-paced screenings, and direct connections to qualified mental health professionals.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigate('/chat')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#303F70] hover:bg-[#202b4d] text-white text-sm font-bold shadow-lg shadow-indigo-900/10 transition-transform active:scale-95 flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-[#A99CE0]" />
                <span>Start a Conversation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/how-it-works')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-[#303F70] text-sm font-bold border border-slate-200 transition-colors"
              >
                Explore How It Works
              </button>
            </div>

            {/* Quick Guarantees */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-[#697386] font-medium">
              <span className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-[#64B6AC] mr-1.5" />
                100% Confidential & DPDPA Compliant
              </span>
              <span className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-[#64B6AC] mr-1.5" />
                Zero Unsolicited Disclosures
              </span>
              <span className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-[#64B6AC] mr-1.5" />
                Verified Clinical Psychologists
              </span>
            </div>
          </div>

          {/* Interactive Live Product Preview in Hero */}
          <div className="mt-12 max-w-2xl mx-auto bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#303F70] flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4 text-[#A99CE0]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#20283D]">Interactive Companion Preview</h4>
                  <span className="text-[10px] text-emerald-600 font-semibold">● Real-time AI Assistant</span>
                </div>
              </div>
              <button 
                onClick={() => navigate('/chat')}
                className="text-[11px] font-bold text-[#303F70] hover:underline"
              >
                Open Full Screen →
              </button>
            </div>

            <div className="space-y-3 min-h-[160px] max-h-[220px] overflow-y-auto p-1">
              {interactiveChatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] text-xs p-3.5 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-[#303F70] text-white rounded-br-xs'
                        : 'bg-slate-100 text-[#20283D] rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isSimulatingReply && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 p-3 rounded-2xl text-xs text-slate-500 italic flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"></span>
                    <span>MindBridge AI is reflecting...</span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleMiniChatSubmit} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Try replying (e.g. 'I have a huge exam tomorrow and I'm stressed')..."
                value={interactiveChatInput}
                onChange={(e) => setInteractiveChatInput(e.target.value)}
                className="flex-1 text-xs py-2 px-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#303F70]/20"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#303F70] text-white text-xs font-bold shrink-0 hover:bg-[#202b4d]"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 3-Step Process: Talk, Understand, Connect */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#303F70] block mb-2">The MindBridge Pathway</span>
          <h2 className="text-3xl font-extrabold text-[#20283D] tracking-tight">
            Three Steps to Sustainable Emotional Wellbeing
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-[#303F70]/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#303F70] flex items-center justify-center font-black text-lg mb-6 group-hover:scale-110 transition-transform">
              1
            </div>
            <h3 className="text-lg font-bold text-[#20283D] mb-2">Talk Freely</h3>
            <p className="text-xs sm:text-sm text-[#697386] leading-relaxed">
              Open up without fear of judgment. Our empathetic AI companion listens warmly, validates feelings, and responds thoughtfully in English, Hindi, or Hinglish.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-[#303F70]/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#64B6AC] flex items-center justify-center font-black text-lg mb-6 group-hover:scale-110 transition-transform">
              2
            </div>
            <h3 className="text-lg font-bold text-[#20283D] mb-2">Understand Gently</h3>
            <p className="text-xs sm:text-sm text-[#697386] leading-relaxed">
              Take voluntary, clinical-grade check-ins (PHQ-9, GAD-7, PSS-10) with explainable factors breakdown. No mysterious black-box scores or diagnostic labeling.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-[#303F70]/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#A99CE0] flex items-center justify-center font-black text-lg mb-6 group-hover:scale-110 transition-transform">
              3
            </div>
            <h3 className="text-lg font-bold text-[#20283D] mb-2">Connect Safely</h3>
            <p className="text-xs sm:text-sm text-[#697386] leading-relaxed">
              Book confidential video sessions with verified licensed psychologists, or activate structured grounding and breathing self-care exercises at your own pace.
            </p>
          </div>
        </div>
      </section>

      {/* Verified Therapists Preview */}
      <section className="bg-white py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#303F70] block mb-2">Clinical Network</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#20283D] tracking-tight">
                Meet Verified Psychologists & Counsellors
              </h2>
            </div>
            <button
              onClick={() => navigate('/therapists')}
              className="text-xs font-bold text-[#303F70] hover:underline flex items-center space-x-1"
            >
              <span>Explore All Verified Specialists</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Dr. Sarah Patel, Psy.D.',
                title: 'Clinical Psychologist • Columbia Univ',
                rating: 4.95,
                specialty: 'Academic Burnout & CBT',
                img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80',
                fee: '₹1,500'
              },
              {
                name: 'Dr. Rajesh Menon, MD',
                title: 'Neuropsychiatrist • NIMHANS Alum',
                rating: 4.92,
                specialty: 'Severe Anxiety & Sleep',
                img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
                fee: '₹2,000'
              },
              {
                name: 'Elena Rostova, LCSW',
                title: 'Licensed Psychotherapist • Somatic Specialist',
                rating: 4.88,
                specialty: 'Nervous System & Grounding',
                img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&auto=format&fit=crop&q=80',
                fee: '₹1,800'
              }
            ].map((th, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center space-x-3.5 mb-3">
                    <img src={th.img} alt={th.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white" />
                    <div>
                      <h4 className="text-sm font-bold text-[#20283D]">{th.name}</h4>
                      <p className="text-[11px] text-[#303F70]">{th.title}</p>
                      <div className="flex items-center space-x-1 text-xs text-amber-500 mt-1 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{th.rating}</span>
                      </div>
                    </div>
                  </div>
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 text-[11px] font-semibold text-[#20283D]">
                    {th.specialty}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#303F70]">{th.fee} / session</span>
                  <button
                    onClick={() => navigate('/therapists')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#303F70] hover:bg-[#202b4d] text-white text-xs font-bold transition-colors"
                  >
                    View Slots
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* University & Institutional Wellness Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#303F70] to-[#202b4d] rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-white/10 text-[#A99CE0] text-xs font-bold uppercase tracking-wider">
              For Universities & Institutions
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Support Your Campus Community with Privacy-First Insights
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Equip students with 24/7 empathetic conversational support while giving wellness officers de-identified aggregate trends and privacy-compliant escalation protocols.
            </p>

            <ul className="space-y-2 text-xs text-slate-200 pt-2">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#64B6AC]" />
                <span>Zero surveillance: Individual chats and journal records are strictly inaccessible</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#64B6AC]" />
                <span>Differential privacy and k-anonymity for cohort reporting</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#64B6AC]" />
                <span>Documented human-review safety escalation desk</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 w-full lg:w-96 text-center space-y-4">
            <Building2 className="w-12 h-12 text-[#A99CE0] mx-auto" />
            <h4 className="text-base font-bold">Partner With MindBridge</h4>
            <p className="text-xs text-slate-200">
              Integrate with your university wellness center and empower student emotional resilience.
            </p>
            <button
              onClick={() => navigate('/institutions')}
              className="w-full py-3 rounded-2xl bg-white hover:bg-slate-100 text-[#303F70] text-xs font-bold transition-transform active:scale-95"
            >
              Learn About University Partnerships
            </button>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#303F70] block mb-2">Transparency & Ethics</span>
          <h2 className="text-3xl font-extrabold text-[#20283D] tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "Is MindBridge AI a replacement for human therapy or clinical diagnosis?",
              a: "No. MindBridge AI is designed exclusively as an early-support, self-reflection, and clinical-referral tool. It does not provide formal psychiatric diagnoses, prescribe treatments, or substitute for personalized human therapy."
            },
            {
              q: "Can my university or family read my private chats?",
              a: "Never. MindBridge AI enforces strict cryptographic boundaries and zero-surveillance policies. University administrators and family members cannot access personal conversations, journals, or individual assessment answers."
            },
            {
              q: "Does silence in the chat trigger an emergency escalation?",
              a: "Never. Taking time to think or closing the window in silence is completely normal and is never treated as evidence of danger. Proactive prompts stop gently after 2 quiet checks, and opt-out preferences are always respected."
            },
            {
              q: "How does the emergency safety escalation protocol work?",
              a: "If explicit high-risk self-harm intent is identified, the system immediately provides 24/7 crisis hotlines and opens a priority review case for an authorized safety professional. Notifications require valid consent and verified recipients, transmitting minimum-necessary alerts only."
            }
          ].map((faq, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-2">
              <h4 className="text-sm font-bold text-[#20283D] flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-[#303F70] shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-[#697386] leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
