import { Sparkles, Shield, Lock } from 'lucide-react';

interface FooterProps {
  navigate: (route: string) => void;
}

export function Footer({ navigate }: FooterProps) {
  return (
    <footer className="bg-white border-t border-slate-200/80 pt-12 pb-8 text-[#20283D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mandatory Clinical & Non-Diagnostic Disclaimer Banner */}
        <div className="mb-10 p-5 rounded-3xl bg-[#F7F9FC] border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-[#303F70] shrink-0 mt-0.5">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#303F70]">
                Important Healthcare Notice & Non-Diagnostic Disclaimer
              </h4>
              <p className="text-xs text-[#697386] mt-0.5 leading-relaxed max-w-3xl">
                MindBridge AI is designed exclusively as an early-support, self-reflection, and clinical-referral platform. It is <strong>not</strong> an automated diagnostic system, emergency dispatch service, or replacement for personalized psychiatric or psychotherapeutic medical care. If you are experiencing acute distress, immediate suicidal thoughts, or a medical crisis, please call emergency services immediately (India: <strong>112</strong> / USA: <strong>911</strong> / Tele-MANAS: <strong>14416</strong>).
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/safety')}
            className="shrink-0 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#303F70] hover:bg-white transition-colors"
          >
            Review Safety Protocol
          </button>
        </div>

        {/* 4-column Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-xs">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-[#303F70] flex items-center justify-center text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-sm text-[#303F70]">MindBridge AI</span>
            </div>
            <p className="text-[#697386] leading-relaxed mb-3">
              Empathetic AI conversation, explainable wellness screenings, and verified clinical connections for students and young professionals.
            </p>
            <div className="flex items-center space-x-1.5 text-[11px] text-[#64B6AC] font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>DPDPA & GDPR Privacy Aligned</span>
            </div>
          </div>

          <div>
            <h5 className="font-bold uppercase tracking-wider text-[#303F70] mb-3">Platform</h5>
            <ul className="space-y-2 text-[#697386]">
              <li><button onClick={() => navigate('/chat')} className="hover:text-[#303F70]">Empathetic AI Companion</button></li>
              <li><button onClick={() => navigate('/screenings')} className="hover:text-[#303F70]">Validated Screenings (PHQ-9/GAD-7)</button></li>
              <li><button onClick={() => navigate('/interventions')} className="hover:text-[#303F70]">Guided Breathing & Grounding</button></li>
              <li><button onClick={() => navigate('/therapists')} className="hover:text-[#303F70]">Licensed Therapist Directory</button></li>
              <li><button onClick={() => navigate('/institutions')} className="hover:text-[#303F70]">University Wellness Partnerships</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold uppercase tracking-wider text-[#303F70] mb-3">Trust & Clinical</h5>
            <ul className="space-y-2 text-[#697386]">
              <li><button onClick={() => navigate('/safety')} className="hover:text-[#303F70]">Emergency Safety Protocol</button></li>
              <li><button onClick={() => navigate('/privacy')} className="hover:text-[#303F70]">Data Privacy & Security</button></li>
              <li><button onClick={() => navigate('/consent')} className="hover:text-[#303F70]">Granular Consent Manager</button></li>
              <li><button onClick={() => navigate('/terms')} className="hover:text-[#303F70]">Terms of Service</button></li>
              <li><button onClick={() => navigate('/resources')} className="hover:text-[#303F70]">Crisis Resources Directory</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold uppercase tracking-wider text-[#303F70] mb-3">24/7 Helplines</h5>
            <div className="space-y-2 text-[#697386]">
              <div>
                <span className="font-semibold text-[#20283D] block">Tele-MANAS (India):</span>
                <span className="text-[#303F70] font-bold">14416 / 1800-891-4416</span>
              </div>
              <div>
                <span className="font-semibold text-[#20283D] block">KIRAN Helpline:</span>
                <span className="text-[#303F70] font-bold">1800-599-0019</span>
              </div>
              <div>
                <span className="font-semibold text-[#20283D] block">USA & Canada 988:</span>
                <span className="text-[#303F70] font-bold">Call / Text 988</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-[#697386] gap-3">
          <div>
            © {new Date().getFullYear()} MindBridge AI Technologies. Built for proactive mental wellness and clinical collaboration.
          </div>
          <div className="flex space-x-4">
            <button onClick={() => navigate('/privacy')} className="hover:underline">Privacy Policy</button>
            <button onClick={() => navigate('/terms')} className="hover:underline">Terms of Service</button>
            <button onClick={() => navigate('/consent')} className="hover:underline">Consent Preferences</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

