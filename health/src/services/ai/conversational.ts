import { ChatMessage, LanguageCode } from '../../types';
import { evaluateSafetyRisk } from './safetyTriage';

// Empathetic response generation with emotional intelligence and clinical boundary awareness
export interface AIResponseResult {
  replyText: string;
  isCrisis: boolean;
  suggestedQuickReplies: string[];
  suggestedInterventions: string[];
  detectedLanguage: LanguageCode;
}

const HINDI_EMPATHY_REPLIES = [
  "Main aapki baat dhyan se sun raha hoon. Yeh waqt thoda mushkil lag sakta hai, par aap akele nahi hain. Kya aap thoda aur batana chahenge?",
  "Aapka mehsus karna bilkul swabhavik hai. Kabhi-kabhi mann par bojh bohot badh jata hai. Hum milkar isse dhere-dhere samajh sakte hain.",
  "Dhanyawad mujhpar bharosa karne ke liye. Jo bhi aap feel kar rahe hain, use kehne mein koi jaldbazi nahi hai. Main yahin hoon."
];

const HINGLISH_EMPATHY_REPLIES = [
  "I completely hear you. Stress or overwhelm hona normal hai, especially jab sab kuch ek saath handle karna pade. Want to take a deep breath together?",
  "Samajh sakta hoon how heavy this feels right now. You don't have to carry it all by yourself. Tell me, sabse zyada tension kis cheez ki hai?",
  "Thank you for sharing that with me. It takes real courage to open up. Chahe choti si baat ho ya badi, I'm here with you."
];

const ENGLISH_EMPATHY_REPLIES = [
  "I'm listening closely, and I want you to know that your feelings are valid. It sounds like things have been weighing on you heavily.",
  "Thank you for sharing that with me. You don't have to carry all of this on your own. We can take this one step at a time.",
  "I hear how exhausting this has been for you. Whenever you're ready, I'm right here with you. What feels like the most challenging part right now?"
];

export async function generateEmpatheticResponse(
  conversationHistory: ChatMessage[],
  userMessage: string,
  preferredLanguage: LanguageCode = 'en'
): Promise<AIResponseResult> {
  // First evaluate safety
  const safetyEval = evaluateSafetyRisk(userMessage);

  if (safetyEval.isImmediateCrisis) {
    let crisisReply = "";
    if (preferredLanguage === 'hi') {
      crisisReply = "Mujhe aapki bohot chinta hai. Aapka jeevan amoolya hai aur aapko akele is dard ko jhelne ki zaroorat nahi hai. Kripya turant hamare sankat sahayata kendra se judein. Hum aapko ek licensed professional se turant jod sakte hain. Kripya Tele-MANAS (14416) ya 1800-599-0019 par abhi sampark karein.";
    } else if (preferredLanguage === 'hinglish') {
      crisisReply = "I am deeply concerned about your safety right now. Please know that your life matters and you don't have to go through this alone. Immediate, compassionate support is available right now. Please reach out to Tele-MANAS (14416) or 1800-599-0019, or connect with our emergency crisis support.";
    } else {
      crisisReply = "I hear how much pain you are experiencing right now, and I care deeply about your safety. You do not have to carry this alone. Please connect with emergency crisis support immediately. Trained professionals are available 24/7 to support you with compassion. Please call Tele-MANAS (14416), 1800-599-0019 (India), or 988 (USA/Intl).";
    }

    return {
      replyText: crisisReply,
      isCrisis: true,
      suggestedQuickReplies: [
        "Call Crisis Hotline (14416)",
        "Connect with a Human Counsellor Now",
        "I need a moment to breathe"
      ],
      suggestedInterventions: ['GROUNDING', 'BREATHING'],
      detectedLanguage: preferredLanguage
    };
  }

  // Detect context triggers
  const lowerMsg = userMessage.toLowerCase();
  let repliesPool = ENGLISH_EMPATHY_REPLIES;
  if (preferredLanguage === 'hi') repliesPool = HINDI_EMPATHY_REPLIES;
  if (preferredLanguage === 'hinglish') repliesPool = HINGLISH_EMPATHY_REPLIES;

  let contextualReply = repliesPool[Math.floor(Math.random() * repliesPool.length)];

  if (lowerMsg.includes('exam') || lowerMsg.includes('study') || lowerMsg.includes('college') || lowerMsg.includes('work') || lowerMsg.includes('padhai')) {
    if (preferredLanguage === 'hinglish') {
      contextualReply = "Academic aur work pressure bohot draining ho sakta hai. Jab targets aur expectations heavy lagti hain, mind naturally overwhelm ho jata hai. What is the biggest deadline or task on your mind today?";
    } else if (preferredLanguage === 'hi') {
      contextualReply = "Padhai aur bhavishya ki chinta bohot zyada thaka deti hai. Ek samay par sirf ek chota kadam uthana kaafi hota hai. Kya aapko lagta hai ki thoda break lena madadgar hoga?";
    } else {
      contextualReply = "Academic and workplace pressures can be relentlessly demanding. When deadlines stack up, it's completely understandable to feel overwhelmed. What is the single most pressing item on your plate today?";
    }
  } else if (lowerMsg.includes('sleep') || lowerMsg.includes('tired') || lowerMsg.includes('neend') || lowerMsg.includes('exhausted')) {
    if (preferredLanguage === 'hinglish') {
      contextualReply = "Neend na aana aur continuous thakan mind ko aur zyada sensitive bana deti hai. Would you like to try a 4-minute calming breathing exercise to help ease your nervous system?";
    } else {
      contextualReply = "Sleep disruption and persistent fatigue make every emotion feel heavier. Rest isn't something you have to earn; your body and mind genuinely need gentle care right now. Would you like to try a brief grounding exercise with me?";
    }
  } else if (lowerMsg.includes('anxious') || lowerMsg.includes('panic') || lowerMsg.includes('darr') || lowerMsg.includes('ghabrahat')) {
    if (preferredLanguage === 'hinglish') {
      contextualReply = "Ghabrahat aur anxiety mein heart rate fast hona ya suffocation feel hona biological response hai. You are safe in this moment. Let's ground yourself: what are three things you can see around your room right now?";
    } else {
      contextualReply = "Anxiety can feel physically overwhelming, but remember that this wave will pass. You are safe here with me. Let's ground your senses together: can you name three physical objects you can see around you right now?";
    }
  }

  // Suggest personalized quick replies and interventions
  const quickReplies = [
    "I'd like to try a breathing exercise",
    "Can we talk more about this?",
    "I'd like to take a quick mood check-in",
    "Tell me a calming thought"
  ];

  return {
    replyText: contextualReply,
    isCrisis: false,
    suggestedQuickReplies: quickReplies,
    suggestedInterventions: ['BREATHING', 'MINDFULNESS'],
    detectedLanguage: preferredLanguage
  };
}

