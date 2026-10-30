import { Phone, ShieldAlert, X, Heart, MessageSquare } from 'lucide-react';
import { CRISIS_RESOURCES } from '../../services/ai/safetyTriage';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CrisisModal({ isOpen, onClose }: CrisisModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#20283D]">Crisis Support & Emergency Hotlines</h3>
              <p className="text-xs text-[#697386]">Free, confidential, and available 24 hours a day, 7 days a week</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-5 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-amber-900 text-sm leading-relaxed flex items-start space-x-3">
          <Heart className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>You matter, and you are not alone.</strong> If you or someone you know is in immediate physical danger, experiencing overwhelming thoughts of self-harm, or needs urgent medical help, please reach out to one of the verified hotlines below.
          </div>
        </div>

        <div className="space-y-3">
          {CRISIS_RESOURCES.map((res) => (
            <div 
              key={res.id}
              className="p-4 rounded-2xl border border-slate-200/80 hover:border-[#303F70]/40 bg-slate-50/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-[#20283D]">{res.name}</span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-200/60 text-[#697386]">
                    {res.region}
                  </span>
                </div>
                <p className="text-xs text-[#697386] mt-1">{res.description}</p>
                <p className="text-xs text-emerald-700 font-medium mt-1">● {res.availability}</p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {res.type === 'PHONE' ? (
                  <a
                    href={`tel:${res.contact.replace(/[^0-9+]/g, '')}`}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#303F70] hover:bg-[#202b4d] text-white text-xs font-semibold shadow-sm transition-transform active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call {res.contact}</span>
                  </a>
                ) : (
                  <div className="inline-flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-200 text-slate-800 text-xs font-semibold">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{res.contact}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#697386]">
          <span>MindBridge AI does not replace emergency medical response services.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

