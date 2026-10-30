import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Trash2, 
  Clock, 
  Wind,
  Phone,
  PhoneCall,
  PhoneOff,
  Lock,
  CheckCircle2,
  Radio
} from 'lucide-react';
import { ChatMessage, LanguageCode } from '../../types';
import { db } from '../../services/db/mockDatabase';
import { generateEmpatheticResponse } from '../../services/ai/conversational';
import { SpeechService } from '../../services/ai/speech';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { CrisisModal } from '../common/CrisisModal';

interface ChatCompanionProps {
  navigate: (route: string) => void;
}

export function ChatCompanion({ navigate }: ChatCompanionProps) {
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>(db.conversations[0]?.messages || []);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inactivityPromptEnabled, setInactivityPromptEnabled] = useState(true);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [isCallingModalOpen, setIsCallingModalOpen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallMuted, setIsCallMuted] = useState(false);
  const [callStatus, setCallStatus] = useState<'CONNECTING' | 'CONNECTED' | 'ENDED'>('CONNECTING');
  const [shareToast, setShareToast] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);
  const midConvoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messageIdRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const triggerMidConvoNudge = useCallback(() => {
    let nudgeText: string;
    if (language === 'hi') {
      nudgeText = "Main dekh raha hoon ki aap thoda ruk gaye hain. Bilkul koi jaldbazi nahi hai—jab bhi aap taiyar hon, main yahin hoon. Kya aap ek chota sa break lena chahenge ya kuch aur share karna chahenge?";
    } else if (language === 'hinglish') {
      nudgeText = "Hey, I noticed you paused for a moment. Bilkul tension mat lo—take all the time you need. I'm right here whenever you want to type, ya hum ek 2-minute calm breathing exercise try kar sakte hain?";
    } else {
      nudgeText = "Hey, I noticed you paused for a moment. No rush at all—I'm still right here with you whenever you're ready. Would you like to take your time, or try a 2-minute calming breathing exercise?";
    }

    const nudgeMsg: ChatMessage = {
      id: 'nudge-' + Date.now(),
      conversationId: 'conv-01',
      sender: 'assistant',
      content: nudgeText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMidConvoNudge: true,
      suggestedInterventions: ['BREATHING', 'GROUNDING']
    };

    const updated = [...messages, nudgeMsg];
    setMessages(updated);
    if (db.conversations[0]) {
      db.conversations[0].messages = updated;
      db.persist();
    }
  }, [messages, language]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Mid-conversation inactivity detector:
  // If the last message is from the assistant and user hasn't replied for 20 seconds, trigger gentle nudge!
  useEffect(() => {
    if (!inactivityPromptEnabled) {
      if (midConvoTimerRef.current) clearTimeout(midConvoTimerRef.current);
      return;
    }

    if (midConvoTimerRef.current) clearTimeout(midConvoTimerRef.current);

    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.sender === 'assistant' && !lastMsg.isMidConvoNudge) {
      midConvoTimerRef.current = setTimeout(() => {
        triggerMidConvoNudge();
      }, 20000); // 20s mid-conversation pause
    }

    return () => {
      if (midConvoTimerRef.current) clearTimeout(midConvoTimerRef.current);
    };
  }, [messages, inactivityPromptEnabled, language, triggerMidConvoNudge]);

  // Call timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isCallingModalOpen && callStatus === 'CONNECTED') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isCallingModalOpen, callStatus]);



  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content) return;

    if (midConvoTimerRef.current) clearTimeout(midConvoTimerRef.current);

    const userMsg: ChatMessage = {
      id: 'msg-' + ++messageIdRef.current,
      conversationId: 'conv-01',
      sender: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language,
      approvedForCounsellor: false // strictly private by default!
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsTyping(true);

    if (db.conversations[0]) {
      // eslint-disable-next-line react-hooks/immutability
      db.conversations[0].messages = newHistory;
      // eslint-disable-next-line react-hooks/immutability
      db.conversations[0].lastInteractionAt = new Date().toISOString();
      db.persist();
    }

    try {
      const response = await generateEmpatheticResponse(newHistory, content, language);
      setIsTyping(false);

      const aiMsg: ChatMessage = {
        id: 'msg-ai-' + ++messageIdRef.current,
        conversationId: 'conv-01',
        sender: 'assistant',
        content: response.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCrisis: response.isCrisis,
        language: response.detectedLanguage,
        suggestedInterventions: response.suggestedInterventions,
        approvedForCounsellor: false
      };

      const updatedWithAI = [...newHistory, aiMsg];
      setMessages(updatedWithAI);

      if (db.conversations[0]) {
        // eslint-disable-next-line react-hooks/immutability
        db.conversations[0].messages = updatedWithAI;
        db.persist();
      }

      if (response.isCrisis) {
        setShowCrisisModal(true);
        // Automatically dispatch emergency warning helper alert if enabled
        db.triggerEmergencyHelperAlert("Severe self-harm or distress risk keyword detected in active session");
        db.addSafetyCase({
          userId: user.id,
          userDisplayName: user.name,
          institutionId: user.institutionId,
          riskCategory: 'HIGH_RISK_IMMEDIATE',
          status: 'PENDING_REVIEW',
          escalationRequired: true
        });
      }
    } catch (err) {
      console.error("AI Response error:", err);
      setIsTyping(false);
      const fallback: ChatMessage = {
        id: 'msg-ai-' + ++messageIdRef.current,
        conversationId: 'conv-01',
        sender: 'assistant',
        content:
          language === 'hi'
            ? "Mujhe maaf kijiye, main abhi aapka jawab nahi de paa raha hoon. Kripya thoda der baad phir se koshish karein. Main aapke saath hoon."
            : language === 'hinglish'
            ? "Sorry, I'm having trouble replying right now. Please try again in a moment—I'm still here with you."
            : "I'm sorry, I'm having trouble replying right now. Please try again in a moment—I'm still here with you and I'm listening.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language,
        suggestedInterventions: ['BREATHING', 'MINDFULNESS'],
        approvedForCounsellor: false
      };
      const updatedWithAI = [...newHistory, fallback];
      setMessages(updatedWithAI);
      if (db.conversations[0]) {
        // eslint-disable-next-line react-hooks/immutability
        db.conversations[0].messages = updatedWithAI;
        db.persist();
      }
    }
  };

  const toggleApproveMessageForCounsellor = (msgId: string) => {
    const msg = messages.find(m => m.id === msgId);
    if (!msg) return;

    const newStatus = !msg.approvedForCounsellor;
    msg.approvedForCounsellor = newStatus;
    db.approveChatMessageForCounsellor(msgId, newStatus);
    setMessages([...messages]);

    const statusText = newStatus 
      ? "✓ Message shared with your assigned counsellor (Dr. Sarah Patel)" 
      : "🔒 Message locked & kept private from counsellor";
    setShareToast(statusText);
    setTimeout(() => setShareToast(null), 3000);
  };

  const toggleVoiceRecording = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setIsListening(false);
    } else {
      setIsListening(true);
      const rec = SpeechService.startListening(
        (transcript) => {
          setInputText(transcript);
        },
        (err) => {
          console.warn("Speech error:", err);
          setIsListening(false);
        }
      );
      recognitionRef.current = rec;
    }
  };

  const handleSpeakMessage = (text: string) => {
    if (isSpeaking) {
      SpeechService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      SpeechService.speak(text, language === 'hi' ? 'hi' : 'en', () => {
        setIsSpeaking(false);
      });
    }
  };

  const handleClearHistory = () => {
    if (confirm("Clear current conversation history? (Your health trends & journal remain intact)")) {
      const initial: ChatMessage[] = [
        {
          id: 'msg-fresh',
          conversationId: 'conv-01',
          sender: 'assistant',
          content: "Hey, I'm right here with you. How can I support you right now?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          approvedForCounsellor: false
        }
      ];
      setMessages(initial);
      if (db.conversations[0]) {
        db.conversations[0].messages = initial;
        db.persist();
      }
    }
  };

  const startVoiceCall = () => {
    setIsCallingModalOpen(true);
    setCallStatus('CONNECTING');
    setCallDuration(0);

    setTimeout(() => {
      setCallStatus('CONNECTED');
    }, 1800);
  };

  const endVoiceCall = () => {
    setCallStatus('ENDED');
    setTimeout(() => {
      setIsCallingModalOpen(false);
      setCallDuration(0);
    }, 600);
  };

  const formatCallTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Privacy Notice Banner */}
      {shareToast && (
        <div className="mb-4 p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-[#303F70] text-xs font-bold flex items-center space-x-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{shareToast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)] min-h-[640px]">
        {/* Left Sidebar: Conversations & Privacy Controls */}
        <div className="hidden lg:flex flex-col justify-between bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#303F70]">Active Chat</span>
              <button 
                onClick={handleClearHistory}
                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                title="Clear current conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#303F70]/5 border border-[#303F70]/20 mb-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#303F70]">
                <Sparkles className="w-3.5 h-3.5 text-[#A99CE0]" />
                <span>Empathetic Companion</span>
              </div>
              <p className="text-[11px] text-[#697386] truncate mt-1">
                {messages[messages.length - 1]?.content || "Ready whenever you are..."}
              </p>
            </div>

            {/* Inactivity Proactive Prompt Settings */}
            <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#303F70] block">
                Mid-Convo Nudge Engine
              </span>
              <label className="flex items-start space-x-2.5 cursor-pointer text-xs text-[#20283D]">
                <input
                  type="checkbox"
                  checked={inactivityPromptEnabled}
                  onChange={(e) => setInactivityPromptEnabled(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#303F70] focus:ring-[#303F70]"
                />
                <div>
                  <span className="font-semibold block">Mid-Conversation Nudge</span>
                  <span className="text-[11px] text-[#697386] leading-tight block mt-0.5">
                    Gently checks in if you go quiet mid-conversation for ~20 seconds.
                  </span>
                </div>
              </label>

              {/* Instant Test Button */}
              <button
                type="button"
                onClick={triggerMidConvoNudge}
                className="w-full py-2 px-3 rounded-xl border border-dashed border-[#A99CE0] hover:bg-indigo-50/50 text-[#303F70] text-[11px] font-bold transition-colors flex items-center justify-center space-x-1.5"
                title="Immediately simulate a mid-conversation pause nudge"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#A99CE0]" />
                <span>Test Mid-Convo Nudge Now</span>
              </button>
            </div>

            {/* Counsellor Privacy Boundary Box */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-[11px] text-[#697386] space-y-1.5">
              <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
                <Lock className="w-3.5 h-3.5" />
                <span>Strict Counsellor Privacy</span>
              </div>
              <p className="leading-relaxed">
                Your counsellor sees your overall <strong>daily improvement track</strong>, but cannot read your messages unless you click the <strong>lock icon</strong> on a specific message to approve it!
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-[#697386] space-y-1">
            <div className="flex items-center space-x-1.5 text-[#303F70] font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Zero Pressure</span>
            </div>
            <p>Silence alone is never an emergency. Take all the time you need.</p>
          </div>
        </div>

        {/* Center: Main Chat Window */}
        <div className="lg:col-span-2 flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Chat Header with Voice Call & Language */}
          <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#303F70] to-[#A99CE0] flex items-center justify-center text-white shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#20283D] flex items-center space-x-1.5">
                  <span>MindBridge Companion</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-[#303F70] font-semibold">AI Support</span>
                </h3>
                <p className="text-[11px] text-[#697386]">Empathetic, confidential, and judgment-free</p>
              </div>
            </div>

            {/* Actions: Direct Audio Call & Language Switcher */}
            <div className="flex items-center space-x-2">
              {/* Direct Calling Button */}
              <button
                onClick={startVoiceCall}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-transform active:scale-95"
                title="Start Voice Audio Call with Counsellor / Client"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Voice Call</span>
              </button>

              {/* Language Switcher pill in Chat */}
              <div className="flex items-center space-x-1">
                {(['en', 'hi', 'hinglish'] as LanguageCode[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`text-[10px] uppercase font-bold px-2 py-1 rounded-lg transition-colors ${
                      language === lang ? 'bg-[#303F70] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
                    msg.sender === 'user'
                      ? 'bg-[#303F70] text-white rounded-br-sm shadow-sm'
                      : msg.isCrisis
                      ? 'bg-rose-50 border border-rose-200 text-rose-950 rounded-bl-sm'
                      : msg.isMidConvoNudge
                      ? 'bg-indigo-50/80 border border-indigo-200/80 text-[#20283D] rounded-bl-sm'
                      : 'bg-[#F7F9FC] text-[#20283D] border border-slate-100 rounded-bl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Crisis Callout Banner if detected */}
                  {msg.isCrisis && (
                    <div className="mt-3 pt-3 border-t border-rose-200/80 flex items-center justify-between gap-2">
                      <span className="font-bold text-rose-700 text-xs">Immediate Help: Tele-MANAS 14416</span>
                      <button
                        onClick={() => setShowCrisisModal(true)}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] shadow-sm"
                      >
                        View Crisis Helplines
                      </button>
                    </div>
                  )}

                  {/* Mid-convo Nudge Quick Replies */}
                  {msg.isMidConvoNudge && (
                    <div className="mt-3 pt-2 border-t border-indigo-200/60 flex flex-wrap gap-1.5">
                      {[
                        "Still thinking, give me a moment",
                        "A bit overwhelmed right now",
                        "Can you suggest a calming exercise?",
                        "Let's pause here, thanks"
                      ].map((chip) => (
                        <button
                          key={chip}
                          onClick={() => handleSendMessage(chip)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#303F70] hover:text-white text-[#303F70] text-[11px] font-semibold border border-indigo-200 transition-colors"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message Meta: Timestamp + Counsellor Sharing Toggle */}
                <div className="flex items-center space-x-2 mt-1 px-1 text-[10px] text-[#697386]">
                  <span>{msg.timestamp}</span>

                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => handleSpeakMessage(msg.content)}
                      className="hover:text-[#303F70] transition-colors"
                      title="Read aloud"
                    >
                      {isSpeaking ? <VolumeX className="w-3 h-3 text-indigo-600" /> : <Volume2 className="w-3 h-3" />}
                    </button>
                  )}

                  {/* User message sharing approval button */}
                  {msg.sender === 'user' && (
                    <button
                      onClick={() => toggleApproveMessageForCounsellor(msg.id)}
                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full transition-all text-[10px] font-semibold ${
                        msg.approvedForCounsellor
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 hover:text-[#303F70] hover:bg-slate-200'
                      }`}
                      title="Click to toggle sharing this message with your assigned counsellor"
                    >
                      {msg.approvedForCounsellor ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Approved for Counsellor</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>Private (Click to Share)</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-2xl w-24">
                <div className="w-2 h-2 rounded-full bg-[#303F70] animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-[#A99CE0] animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-[#64B6AC] animate-bounce [animation-delay:0.4s]"></div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starters */}
          <div className="px-4 py-2 border-t border-slate-100 overflow-x-auto flex space-x-2 scrollbar-none">
            {[
              "I'm feeling really stressed about exams",
              "Can we do a quick breathing exercise?",
              "I feel exhausted and can't sleep",
              "I need someone to listen without judgment"
            ].map((starter) => (
              <button
                key={starter}
                onClick={() => handleSendMessage(starter)}
                className="whitespace-nowrap px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#697386] hover:text-[#20283D] text-[11px] font-medium transition-colors shrink-0"
              >
                {starter}
              </button>
            ))}
          </div>

          {/* Message Composer */}
          <div className="p-4 border-t border-slate-100 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`p-2.5 rounded-2xl transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
                title="Voice speech-to-text input"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Share what is on your mind... (English, Hindi, Hinglish)"
                rows={1}
                className="flex-1 text-xs sm:text-sm py-2.5 px-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#303F70]/20 transition-all resize-none max-h-32"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="p-2.5 rounded-2xl bg-[#303F70] hover:bg-[#202b4d] text-white disabled:opacity-40 transition-transform active:scale-95 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Sidebar: Quick Wellness Tools & Peer Circles */}
        <div className="hidden lg:flex flex-col space-y-4">
          {/* Health Improvement Tracker Mini Widget */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#303F70]">Your Health Record</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                +30 pts (Improving)
              </span>
            </div>
            <p className="text-[11px] text-[#697386]">
              Your daily wellness score has improved by <strong>55%</strong> over the last 14 days.
            </p>
            <button
              onClick={() => navigate('/health-records')}
              className="w-full mt-1 py-2 rounded-xl bg-slate-50 hover:bg-[#303F70] hover:text-white text-xs font-bold text-[#303F70] border border-slate-200 transition-colors"
            >
              View Day-by-Day Track →
            </button>
          </div>

          {/* Peer Community Circles */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-2.5">
            <div className="flex items-center space-x-2 text-[#303F70]">
              <Radio className="w-4 h-4 text-[#A99CE0]" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Peer Community</h4>
            </div>
            <p className="text-[11px] text-[#697386] leading-relaxed">
              Connect anonymously with peers experiencing similar stress or wellness levels.
            </p>
            <button
              onClick={() => navigate('/community')}
              className="w-full py-2.5 rounded-xl bg-[#303F70] hover:bg-[#202b4d] text-white text-xs font-bold text-center shadow-xs transition-colors"
            >
              Join Matched Peer Circles
            </button>
          </div>

          {/* Quick Interventions */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center space-x-2 text-[#303F70] mb-3">
              <Wind className="w-4 h-4 text-[#64B6AC]" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Quick Interventions</h4>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => navigate('/interventions')}
                className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-[#303F70]/5 border border-slate-100 transition-all text-xs"
              >
                <span className="font-bold text-[#20283D] block">4-7-8 Breathing Circle</span>
                <span className="text-[11px] text-[#697386]">4-min parasympathetic calming</span>
              </button>

              <button
                onClick={() => navigate('/journal')}
                className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-[#303F70]/5 border border-slate-100 transition-all text-xs"
              >
                <span className="font-bold text-[#20283D] block">Private Journaling</span>
                <span className="text-[11px] text-[#697386]">Encrypted personal space</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Voice Audio Call Modal */}
      {isCallingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
          <div className="bg-gradient-to-b from-[#303F70] to-[#202b4d] text-white rounded-3xl max-w-md w-full p-8 shadow-2xl text-center space-y-6">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full bg-[#A99CE0]/20 animate-ping"></div>
              <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center mx-auto shadow-inner">
                <PhoneCall className={`w-10 h-10 ${callStatus === 'CONNECTED' ? 'text-emerald-400' : 'text-[#A99CE0] animate-pulse'}`} />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold">
                {callStatus === 'CONNECTING' ? 'Connecting Secure Call...' : 'MindBridge Voice Support'}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {callStatus === 'CONNECTING' 
                  ? 'Connecting to on-duty counsellor line...' 
                  : 'Connected • Encrypted Clinical Audio Stream'}
              </p>
              {callStatus === 'CONNECTED' && (
                <div className="mt-2 text-2xl font-mono font-bold text-emerald-400">
                  {formatCallTime(callDuration)}
                </div>
              )}
            </div>

            {/* Sound Wave Animation */}
            {callStatus === 'CONNECTED' && (
              <div className="flex items-center justify-center space-x-1.5 h-10">
                {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
                  <div
                    key={bar}
                    className="w-1.5 bg-[#64B6AC] rounded-full animate-pulse"
                    style={{
                      height: `${20 + (bar % 3) * 16}px`,
                      animationDelay: `${bar * 0.15}s`
                    }}
                  ></div>
                ))}
              </div>
            )}

            <div className="pt-4 flex items-center justify-center space-x-4">
              <button
                onClick={() => setIsCallMuted(!isCallMuted)}
                className={`p-4 rounded-full transition-all ${
                  isCallMuted ? 'bg-rose-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title={isCallMuted ? 'Unmute' : 'Mute'}
              >
                {isCallMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>

              <button
                onClick={endVoiceCall}
                className="p-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg transition-transform active:scale-95"
                title="End Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Crisis Modal */}
      <CrisisModal isOpen={showCrisisModal} onClose={() => setShowCrisisModal(false)} />
    </div>
  );
}
