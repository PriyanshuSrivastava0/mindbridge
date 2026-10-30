import { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Phone, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  HeartHandshake,
  UserCheck,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db/mockDatabase';
import confetti from 'canvas-confetti';

interface LoginPageProps {
  navigate: (route: string) => void;
}

export function LoginPage({ navigate }: LoginPageProps) {
  const { switchRole } = useAuth();
  const [email, setEmail] = useState('alex.chen@university.edu');
  const [password, setPassword] = useState('••••••••••••');
  
  // Emergency Helper Setup Fields
  const [helperName, setHelperName] = useState(db.currentUser.emergencyHelper?.name || 'Rohan Chen');
  const [helperPhone, setHelperPhone] = useState(db.currentUser.emergencyHelper?.phone || '+91 98765 43210');
  const [helperRelationship, setHelperRelationship] = useState(db.currentUser.emergencyHelper?.relationship || 'Older Brother');
  const [helperMessage, setHelperMessage] = useState(
    db.currentUser.emergencyHelper?.helperMessage || 
    'Emergency safeguard: Please check on me if the health monitoring system detects severe distress or deterioration.'
  );
  const [notifyOnDeterioration, setNotifyOnDeterioration] = useState(true);

  // Simulated Alert Notification Banner state
  const [simulatedAlert, setSimulatedAlert] = useState<{ delivered: boolean; message: string; recipient: string } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Save emergency helper settings to database
    db.updateEmergencyHelper({
      name: helperName,
      phone: helperPhone,
      relationship: helperRelationship,
      helperMessage: helperMessage,
      notifyOnDeterioration: notifyOnDeterioration
    });

    switchRole('STUDENT');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    navigate('/dashboard');
  };

  const handleTestEmergencyWarning = () => {
    const result = db.triggerEmergencyHelperAlert("Simulated Health Decline Test (Elevated Risk Threshold Reached)");
    setSimulatedAlert(result);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#303F70] text-white flex items-center justify-center mx-auto shadow-md">
          <Sparkles className="w-6 h-6 text-[#A99CE0]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#20283D] tracking-tight">
          Sign In to MindBridge AI
        </h1>
        <p className="text-xs sm:text-sm text-[#697386]">
          Secure login with mandatory emergency helper safeguards and zero-surveillance guarantees.
        </p>
      </div>

      {/* Main Login & Helper Form */}
      <form onSubmit={handleLogin} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-md space-y-6">
        {/* Account Credentials */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#303F70]">
            1. Account Credentials
          </h3>

          <div>
            <label className="text-xs font-semibold text-[#20283D] block mb-1">Email Address:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#303F70]/20 font-medium"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#20283D] block mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#303F70]/20"
              required
            />
          </div>
        </div>

        {/* Emergency Helper Setup */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center space-x-2 text-[#303F70]">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              2. Emergency Helper Safeguard Setup
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 leading-relaxed space-y-1">
            <strong>Emergency Deterioration Alert Guarantee:</strong>
            <p>
              If our screening engine or chat triage reports that your mental health condition is severely worsening or entering an urgent crisis, the system will send an automated emergency warning sign & notification to your designated helper so they can check on you immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#20283D] block mb-1">Helper's Name:</label>
              <input
                type="text"
                value={helperName}
                onChange={(e) => setHelperName(e.target.value)}
                placeholder="e.g. Rohan Chen"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#20283D] block mb-1">Helper's Phone / WhatsApp:</label>
              <input
                type="tel"
                value={helperPhone}
                onChange={(e) => setHelperPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#20283D] block mb-1">Relationship to You:</label>
            <input
              type="text"
              value={helperRelationship}
              onChange={(e) => setHelperRelationship(e.target.value)}
              placeholder="e.g. Older Brother / Close Friend / Parent"
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#20283D] block mb-1">
              Custom Helper Alert Instructions / Message:
            </label>
            <textarea
              rows={2}
              value={helperMessage}
              onChange={(e) => setHelperMessage(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
            />
          </div>

          <label className="flex items-start space-x-2.5 cursor-pointer text-xs text-[#20283D]">
            <input
              type="checkbox"
              checked={notifyOnDeterioration}
              onChange={(e) => setNotifyOnDeterioration(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-[#303F70]"
            />
            <span>
              I authorize MindBridge to dispatch an automated warning notification to this number if my health indicators enter acute distress.
            </span>
          </label>

          {/* Test Warning Dispatch Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleTestEmergencyWarning}
              className="px-3.5 py-2 rounded-xl border border-amber-300 hover:bg-amber-50 text-amber-800 text-xs font-bold transition-colors flex items-center space-x-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Test Simulated Helper Alert Dispatch</span>
            </button>
          </div>

          {/* Simulated SMS Alert Card */}
          {simulatedAlert && (
            <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs space-y-2 animate-fade-in shadow-lg">
              <div className="flex items-center justify-between text-emerald-400 font-bold text-[11px]">
                <span>✓ SMS Alert Dispatched to {simulatedAlert.recipient}</span>
                <span>Sent Just Now</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px] leading-relaxed">
                {simulatedAlert.message}
              </div>
              <span className="text-[10px] text-slate-400 block">
                Notice: Transmits safety warning and callback link only. Zero private chat transcripts or diagnoses leaked.
              </span>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>DPDPA 2023 Compliant</span>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[#303F70] hover:bg-[#202b4d] text-white text-xs font-bold shadow-md transition-transform active:scale-95 flex items-center space-x-2"
          >
            <span>Sign In & Activate Companion</span>
          </button>
        </div>
      </form>
    </div>
  );
}

