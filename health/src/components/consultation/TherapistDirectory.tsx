import { useState } from 'react';
import { 
  HeartHandshake, 
  Search, 
  Star, 
  ShieldCheck, 
  Video, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  X,
  CreditCard
} from 'lucide-react';
import { Therapist } from '../../types';
import { db } from '../../services/db/mockDatabase';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

export function TherapistDirectory({ navigate }: { navigate: (route: string) => void }) {
  const { user } = useAuth();
  const [therapists] = useState<Therapist[]>(db.therapists);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);

  // Booking Modal State
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [consultType, setConsultType] = useState<'VIDEO' | 'AUDIO' | 'CHAT'>('VIDEO');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [bookingSuccessId, setBookingSuccessId] = useState<string | null>(null);

  const specialties = ['ALL', 'Academic Burnout', 'Generalized Anxiety', 'Depression', 'CBT', 'Imposter Syndrome', 'Sleep Disorders'];
  const languages = ['ALL', 'English', 'Hindi', 'Hinglish', 'Gujarati', 'Malayalam', 'Spanish'];

  const filteredTherapists = therapists.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'ALL' || t.specializations.includes(selectedSpecialty);
    const matchesLanguage = selectedLanguage === 'ALL' || t.languages.includes(selectedLanguage);
    return matchesSearch && matchesSpecialty && matchesLanguage;
  });

  const handleOpenBooking = (t: Therapist) => {
    setSelectedTherapist(t);
    setSelectedDay(t.availableDays[0] || 'Monday');
    setSelectedSlot(t.availableSlots[0] || '10:00 AM');
    setBookingSuccessId(null);
  };

  const handleConfirmBooking = () => {
    if (!selectedTherapist) return;
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      const newApt = db.addAppointment({
        userId: user.id,
        userName: user.name,
        therapistId: selectedTherapist.id,
        therapistName: selectedTherapist.name,
        therapistTitle: selectedTherapist.title,
        dateTime: `${selectedDay} at ${selectedSlot}`,
        durationMinutes: selectedTherapist.sessionDurationMinutes,
        type: consultType,
        status: 'CONFIRMED',
        fee: selectedTherapist.sessionFee,
        isPaid: true,
        meetingLink: `/consultation/apt-${Math.random().toString(36).substring(2, 7)}`,
        clinicalNotes: 'Intake booked through MindBridge AI. Confidential clinical record created.'
      });

      setBookingSuccessId(newApt.id);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-[#303F70] text-xs font-bold mb-3">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Licensed & Verified Clinical Network</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#20283D] tracking-tight">
          Connect with Qualified Therapists & Counsellors
        </h1>
        <p className="text-xs sm:text-sm text-[#697386] mt-2">
          Every psychologist and psychiatrist on MindBridge is independently credentialed, verified with national councils (RCI / MCI), and trained in evidence-based care.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, expertise, or approach..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs py-2.5 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#303F70]/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none"
          >
            {specialties.map((s) => (
              <option key={s} value={s}>
                {s === 'ALL' ? 'All Specializations' : s}
              </option>
            ))}
          </select>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none"
          >
            {languages.map((l) => (
              <option key={l} value={l}>
                {l === 'ALL' ? 'All Languages' : l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Therapists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTherapists.map((therapist) => (
          <div
            key={therapist.id}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start space-x-4">
                <img
                  src={therapist.avatarUrl}
                  alt={therapist.name}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0 ring-2 ring-indigo-50"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-[#20283D]">{therapist.name}</h3>
                    {therapist.isVerified && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#303F70] font-medium mt-0.5">{therapist.title}</p>
                  
                  <div className="flex items-center space-x-3 mt-2 text-xs text-[#697386]">
                    <span className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                      {therapist.rating}
                    </span>
                    <span>({therapist.reviewsCount} verified reviews)</span>
                    <span>• {therapist.sessionDurationMinutes} mins</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#697386] leading-relaxed mt-4 line-clamp-3">
                {therapist.bio}
              </p>

              {/* Badges */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {therapist.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-[#20283D]"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              <div className="mt-3 text-xs text-[#697386]">
                <strong className="text-[#20283D]">Languages:</strong> {therapist.languages.join(', ')}
              </div>
            </div>

            {/* Price & Book Button */}
            <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#697386] block">Session Fee</span>
                <span className="text-base font-extrabold text-[#303F70]">
                  ₹{therapist.sessionFee.toLocaleString()}
                  <span className="text-xs font-normal text-[#697386]"> / session</span>
                </span>
              </div>

              <button
                onClick={() => handleOpenBooking(therapist)}
                className="px-5 py-2.5 rounded-xl bg-[#303F70] hover:bg-[#202b4d] text-white text-xs font-bold shadow-sm transition-transform active:scale-95 flex items-center space-x-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-[#A99CE0]" />
                <span>Book Consultation</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedTherapist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-[#20283D]">Book Consultation</h3>
                <p className="text-xs text-[#697386]">With {selectedTherapist.name}</p>
              </div>
              <button
                onClick={() => setSelectedTherapist(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!bookingSuccessId ? (
              <div className="space-y-5 my-5">
                {/* Consultation Format */}
                <div>
                  <label className="text-xs font-bold text-[#20283D] block mb-2">
                    Consultation Format:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { type: 'VIDEO', label: 'Secure Video', icon: Video },
                      { type: 'AUDIO', label: 'Audio Call', icon: Clock },
                      { type: 'CHAT', label: 'Live Chat', icon: HeartHandshake }
                    ].map((f) => {
                      const Icon = f.icon;
                      return (
                        <button
                          key={f.type}
                          type="button"
                          onClick={() => setConsultType(f.type as any)}
                          className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                            consultType === f.type
                              ? 'border-[#303F70] bg-[#303F70]/5 text-[#303F70]'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{f.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Day Selection */}
                <div>
                  <label className="text-xs font-bold text-[#20283D] block mb-2">
                    Select Available Day:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {selectedTherapist.availableDays.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setSelectedDay(day)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                          selectedDay === day
                            ? 'bg-[#303F70] text-white border-[#303F70]'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slot Selection */}
                <div>
                  <label className="text-xs font-bold text-[#20283D] block mb-2">
                    Select Time Slot ({selectedTherapist.sessionDurationMinutes} mins):
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedTherapist.availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          selectedSlot === slot
                            ? 'bg-[#303F70] text-white border-[#303F70]'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pricing & Guarantee */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#697386] block">Total Consultation Fee</span>
                    <span className="text-base font-bold text-[#303F70]">
                      ₹{selectedTherapist.sessionFee.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded-md">
                    100% Confidential
                  </span>
                </div>

                {/* Payment button */}
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={isProcessingPayment}
                  className="w-full py-3 rounded-2xl bg-[#303F70] hover:bg-[#202b4d] text-white text-xs font-bold shadow-md transition-transform active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4 text-[#A99CE0]" />
                  <span>
                    {isProcessingPayment ? 'Authorizing Secure Payment...' : `Confirm & Pay ₹${selectedTherapist.sessionFee}`}
                  </span>
                </button>
              </div>
            ) : (
              /* Success Confirmation */
              <div className="text-center py-6 space-y-4 animate-fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-[#20283D]">Appointment Confirmed!</h4>
                <p className="text-xs text-[#697386] max-w-sm mx-auto leading-relaxed">
                  Your appointment with {selectedTherapist.name} is scheduled for <strong>{selectedDay} at {selectedSlot}</strong>. A calendar invite and encrypted meeting link have been generated.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedTherapist(null);
                      navigate(`/consultation/${bookingSuccessId}`);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#303F70] hover:bg-[#202b4d] text-white text-xs font-bold shadow-sm"
                  >
                    Enter Consultation Room
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTherapist(null);
                      navigate('/dashboard');
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    View in Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

