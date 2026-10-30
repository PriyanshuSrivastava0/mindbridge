import { useState } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  ShieldCheck, 
  FileText, 
  Sparkles,
  Share2,
  Lock
} from 'lucide-react';
import { db } from '../../services/db/mockDatabase';
import { useAuth } from '../../context/AuthContext';

export function VideoConsultationRoom({ appointmentId, navigate }: { appointmentId: string; navigate: (route: string) => void }) {
  const { user } = useAuth();
  const appointment = db.appointments.find(a => a.id === appointmentId) || db.appointments[0];

  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [clinicalNotes, setClinicalNotes] = useState(appointment?.clinicalNotes || '');
  const [isNotesSaved, setIsNotesSaved] = useState(false);
  const [showNotesPanel, setShowNotesPanel] = useState(true);

  const handleSaveNotes = () => {
    if (appointment) {
      db.updateClinicalNotes(appointment.id, clinicalNotes);
      setIsNotesSaved(true);
      setTimeout(() => setIsNotesSaved(false), 2000);
    }
  };

  const handleEndCall = () => {
    if (confirm("End this consultation session?")) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#303F70]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#20283D] flex items-center space-x-2">
              <span>Secure Telehealth Consultation</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                End-to-End Encrypted
              </span>
            </h2>
            <p className="text-xs text-[#697386]">
              With {user.role === 'THERAPIST' ? appointment?.userName : appointment?.therapistName} • {appointment?.dateTime}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowNotesPanel(!showNotesPanel)}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-1.5"
        >
          <FileText className="w-3.5 h-3.5 text-[#303F70]" />
          <span>{showNotesPanel ? 'Hide Notes' : 'Show Notes'}</span>
        </button>
      </div>

      {/* Main Video & Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Area (2 Cols) */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <div className="relative bg-slate-900 rounded-3xl overflow-hidden aspect-video flex items-center justify-center shadow-xl">
            {/* Clinician or Remote Feed */}
            {isVideoOn ? (
              <img
                src={
                  user.role === 'THERAPIST'
                    ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
                    : 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80'
                }
                alt="Consultation Remote Participant"
                className="w-full h-full object-cover opacity-90"
              />
            ) : (
              <div className="text-center text-slate-400 text-xs">
                <VideoOff className="w-10 h-10 mx-auto mb-2 text-slate-500" />
                <span>Camera is turned off</span>
              </div>
            )}

            {/* Remote Label */}
            <div className="absolute top-4 left-4 bg-slate-900/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs font-medium flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{user.role === 'THERAPIST' ? appointment?.userName : appointment?.therapistName}</span>
            </div>

            {/* Self View (Picture-in-Picture) */}
            <div className="absolute bottom-4 right-4 w-36 sm:w-44 aspect-video rounded-2xl overflow-hidden border-2 border-white/20 bg-slate-800 shadow-lg">
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
                alt="Self Video Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1.5 left-2 text-[9px] bg-slate-900/80 px-1.5 py-0.5 rounded text-white font-medium">
                You ({user.name})
              </div>
            </div>
          </div>

          {/* Call Controls Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-center space-x-4">
            <button
              onClick={() => setIsAudioOn(!isAudioOn)}
              className={`p-3.5 rounded-2xl transition-all ${
                isAudioOn ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-rose-500 text-white'
              }`}
              title={isAudioOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3.5 rounded-2xl transition-all ${
                isVideoOn ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-rose-500 text-white'
              }`}
              title={isVideoOn ? 'Turn Video Off' : 'Turn Video On'}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => alert("Screen sharing enabled for consultation.")}
              className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Share Screen"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={handleEndCall}
              className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center space-x-2 transition-transform active:scale-95 shadow-md"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Leave Room</span>
            </button>
          </div>
        </div>

        {/* Right Area: Clinical / Patient Notes & Shared Screening */}
        {showNotesPanel && (
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center space-x-2 text-[#303F70]">
                  <Lock className="w-4 h-4" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">
                    {user.role === 'THERAPIST' ? 'Confidential Clinical Notes' : 'Session Reflection Notes'}
                  </h3>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded-full">
                  HIPAA / DPDPA Protected
                </span>
              </div>

              {user.role === 'THERAPIST' && (
                <div className="p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-[11px] text-[#20283D] mb-4">
                  <strong className="block text-[#303F70] mb-0.5">Patient Screening Summary:</strong>
                  <span>Recent PHQ-9: 7/27 (Mild) • Sleep latency & academic stress noted. User authorized intake review.</span>
                </div>
              )}

              <label className="text-xs text-[#697386] font-medium block mb-1">
                {user.role === 'THERAPIST' 
                  ? 'Objective observations, therapeutic interventions applied, and follow-up plan:'
                  : 'Personal insights, exercises discussed, or questions for your counsellor:'}
              </label>

              <textarea
                rows={12}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="Type confidential session notes here..."
                className="w-full text-xs p-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#303F70]/20"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {isNotesSaved ? '✓ Saved securely' : 'Auto-save supported'}
              </span>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 rounded-xl bg-[#303F70] hover:bg-[#202b4d] text-white text-xs font-bold shadow-xs transition-colors"
              >
                Save Notes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

