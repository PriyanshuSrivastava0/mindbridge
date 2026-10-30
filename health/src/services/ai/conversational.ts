import { ChatMessage, LanguageCode } from '../../types';
import { evaluateSafetyRisk } from './safetyTriage';

export interface AIResponseResult {
  replyText: string;
  isCrisis: boolean;
  suggestedQuickReplies: string[];
  suggestedInterventions: string[];
  detectedLanguage: LanguageCode;
}

function t(lang: LanguageCode, en: string, hi: string, hing: string): string {
  if (lang === 'hi') return hi;
  if (lang === 'hinglish') return hing;
  return en;
}

export async function generateEmpatheticResponse(
  conversationHistory: ChatMessage[],
  userMessage: string,
  preferredLanguage: LanguageCode = 'en'
): Promise<AIResponseResult> {
  const safetyEval = evaluateSafetyRisk(userMessage);

  if (safetyEval.isImmediateCrisis) {
    const crisisReply = t(preferredLanguage,
      "I hear how much pain you are experiencing right now, and I am deeply concerned about your safety. You do not have to go through this alone. Please reach out to a trained professional right now. You can call Tele-MANAS (14416), KIRAN (1800-599-0019) in India, or 988 in the USA/Canada. If you are in immediate danger, please call your local emergency number (112 in India).",
      "Mujhe aapki bohot chinta hai. Aapka jeevan amoolya hai. Kripya abhi Tele-MANAS (14416) ya 1800-599-0019 par sampark karein. Aap akele nahi hain.",
      "I am deeply concerned about your safety right now. Please reach out to Tele-MANAS (14416) or 1800-599-0019, or 988. You don't have to go through this alone."
    );
    return {
      replyText: crisisReply,
      isCrisis: true,
      suggestedQuickReplies: ["Call Crisis Hotline (14416)", "Connect with a Human Counsellor Now", "I need a moment to breathe"],
      suggestedInterventions: ['GROUNDING', 'BREATHING'],
      detectedLanguage: preferredLanguage
    };
  }

  const lower = userMessage.toLowerCase();
  const priorUserMsgs = conversationHistory.filter(m => m.sender === 'user');
  const isFirst = priorUserMsgs.length <= 1;

  // Determine concern category
  let category = 'general';
  if (/exam|study|college|padhai|homework|assignment|deadline|syllabus|subject/.test(lower)) category = 'academic';
  else if (/anxious|anxiety|panic|ghabrahat|nervous|worried|fear/.test(lower)) category = 'anxiety';
  else if (/lonely|alone|akela|isolated|friends|social/.test(lower)) category = 'loneliness';
  else if (/career|job|future|bhavishya|path|confused/.test(lower)) category = 'career';
  else if (/sleep|tired|neend|exhausted|insomnia/.test(lower)) category = 'sleep';
  else if (/stress|stressed|overwhelm|pressure|tension/.test(lower)) category = 'stress';

  // Context: check previous messages for topic continuity
  const prevText = conversationHistory.map(m => m.content).join(' ').toLowerCase();
  if (category === 'general' && /exam|study|college/.test(prevText)) category = 'academic';

  let reply = '';
  let quickReplies: string[] = [];
  let interventions = ['BREATHING', 'MINDFULNESS'];

  if (isFirst) {
    // Acknowledge + ask meaningful follow-up questions
    if (category === 'academic') {
      reply = t(preferredLanguage,
        "I understand. Exams can feel overwhelming, especially when you have multiple subjects to prepare for. Let's figure out what's making things difficult.\n\nIs it mainly because:\n- You have too much syllabus to complete?\n- You're worried about your exam results?\n- You're finding certain subjects difficult?\n- You're struggling to manage your time?\n\nWe can work through this step by step.",
        "Main samajh sakta hoon. Exams overwhelming lag sakte hain. Aaiye dekhte hain kya mushkil hai.\n\nKya yeh isliye hai:\n- Bahut syllabus bacha hai?\n- Result ki chinta?\n- Kuch subjects mushkil?\n- Time management problem?",
        "I understand. Exams overwhelming ho sakte hain. Let's figure out kya mushkil hai.\n\nIs it mainly:\n- Too much syllabus?\n- Result ki worry?\n- Subjects difficult?\n- Time management?"
      );
      quickReplies = ["Too much syllabus", "Worried about results", "Subjects are difficult", "Time management"]; 
    } else if (category === 'anxiety') {
      reply = t(preferredLanguage,
        "I'm really glad you shared that. Anxiety can feel physically overwhelming, but you're safe here. Let's slow things down together.\n\nCan you tell me:\n- When did you start feeling this way?\n- Is there a specific situation triggering it?\n- How intense is it right now (1-10)?\n\nWe can try a grounding exercise together whenever you're ready.",
        "Main khush hoon ki aapne share kiya. Anxiety physically overwhelming ho sakti hai, par aap yahan safe hain.\n\nBataiye:\n- Kab se feel kar rahe hain?\n- Koi specific trigger?\n- Kitna intense hai (1-10)?",
        "Glad you shared. Anxiety overwhelming ho sakti hai, but you're safe here.\n\nBatao:\n- Kab se?\n- Trigger kya hai?\n- Intensity 1-10?"
      );
      quickReplies = ["Try a breathing exercise", "Identify my triggers", "Talk more about it", "I just need to calm down"]; interventions = ['BREATHING','GROUNDING'];
    } else if (category === 'loneliness') {
      reply = t(preferredLanguage,
        "Thank you for trusting me with this. Feeling lonely can be really heavy, and it makes sense that you'd want someone to talk to.\n\nI'm here to listen without judgment. A few questions to understand better:\n- Is this feeling recent or something you've carried for a while?\n- Are there people around you, or do you feel disconnected even when with others?\n- What would feel most supportive right now — just talking, or also finding ways to connect?",
        "Dhanyawad mujhpar bharosa karne ke liye. Akelapan heavy ho sakta hai.\n\nMain sunne ke liye yahan hoon.\n\n- Yeh feeling recent hai ya purani?\n- Log aas-paas hain par disconnected lagta hai?\n- Abhi kya support chahiye — bas baat ya connection ka rasta?",
        "Thanks for trusting. Loneliness heavy ho sakti hai.\n\n- Recent hai ya purani?\n- People around but disconnected?\n- Bas talk ya connection?"
      );
      quickReplies = ["Just someone to talk to", "Ways to connect with others", "I've felt this for a while", "Help me feel less alone"]; 
    } else if (category === 'career') {
      reply = t(preferredLanguage,
        "Career confusion is very common, especially when there are many options or expectations. Let's explore this together.\n\nTo help you better:\n- What stage are you at (student, job seeker, considering a change)?\n- What subjects or activities do you genuinely enjoy?\n- What's creating the confusion — too many choices, pressure from others, or fear of making the wrong decision?\n\nWe can break this into small, manageable steps.",
        "Career confusion common hai. Aaiye explore karein.\n\n- Aap kis stage par hain?\n- Kaunse subjects/activities pasand hain?\n- Confusion kyun — choices zyada, pressure, ya wrong decision ka dar?",
        "Career confusion common hai. Explore karein.\n\n- Stage?\n- Enjoy kya karte ho?\n- Confusion kyun?"
      );
      quickReplies = ["I'm a student unsure of my path", "Too many career options", "Pressure from family", "Create a career plan"]; 
    } else if (category === 'sleep') {
      reply = t(preferredLanguage,
        "Sleep difficulties can make everything feel heavier. Your mind and body need rest to process stress.\n\nA few questions:\n- Are you having trouble falling asleep, staying asleep, or waking too early?\n- Is your mind racing with thoughts at night?\n- How many hours are you getting on average?\n\nWe can try a calming wind-down routine together.",
        "Neend ki problem sab kuch heavy bana deti hai.\n\n- So jaana mushkil, beech mein uth jaana, ya jaldi uth jaana?\n- Raat ko thoughts race karte hain?\n- Average kitne hours?",
        "Sleep issue sab heavy bana deti hai.\n\n- Fall asleep / stay asleep / wake early?\n- Thoughts race?\n- Hours?"
      );
      quickReplies = ["Try a calming exercise", "My mind races at night", "I get very little sleep", "Sleep tips"]; interventions = ['SLEEP','BREATHING'];
    } else if (category === 'stress') {
      reply = t(preferredLanguage,
        "It makes complete sense that you're feeling stressed. Stress is your mind's way of saying something needs attention.\n\nLet's understand it better:\n- What's the main source of stress right now?\n- Is it something you can control, or mostly external?\n- How is it affecting your day-to-day?\n\nFrom there we can build a small, realistic plan.",
        "Stress feel karna bilkul samajh aata hai. Yeh mind ka signal hai ki kuch attention chahiye.\n\n- Main source kya hai?\n- Control mein hai ya external?\n- Daily life par kya effect?",
        "Stress samajh aata hai. Mind signal de raha hai.\n\n- Source?\n- Control ya external?\n- Daily effect?"
      );
      quickReplies = ["Work/academic pressure", "Personal life", "Financial concerns", "Create a stress plan"]; 
    } else {
      reply = t(preferredLanguage,
        "Hello! I'm your MindBridge AI Companion. I'm here to listen, understand what you're going through, and help you find practical ways forward.\n\nYou don't have to figure everything out alone. What's on your mind today?",
        "Namaste! Main aapka MindBridge AI Companion hoon. Main sunne, samajhne aur practical raste dhoondhne ke liye yahan hoon.\n\nAap akele nahi hain. Aaj aapke mann mein kya hai?",
        "Hello! Main your MindBridge AI Companion hoon. Listen, understand, practical ways forward.\n\nKya on your mind today?"
      );
      quickReplies = ["I'm feeling stressed", "I need help with studies", "I feel lonely", "I'm confused about my career", "I just want someone to talk to"]; 
    }
  } else {
    // Follow-up turn: provide actionable solutions based on user's clarification
    const userClarification = lower;
    if (category === 'academic' || /syllabus|subject|time|result/.test(prevText)) {
      if (/syllabus|too much|bahut/.test(userClarification)) {
        reply = t(preferredLanguage,
          "That's a very common and manageable challenge. Let's break it down.\n\nHere's a practical approach:\n1. List all remaining topics/chapters.\n2. Mark each as High/Medium/Low priority.\n3. Study in 25-minute focused sessions (Pomodoro) with 5-minute breaks.\n4. Tackle 2 high-priority topics per day.\n5. Review briefly before sleep.\n\nWould you like me to help you create a day-by-day plan for the next 3-5 days?",
          "Yeh common aur manageable hai.\n\n1. Remaining topics list karo.\n2. High/Medium/Low priority mark karo.\n3. 25-min focused sessions + 5-min break.\n4. 2 high-priority topics per day.\n5. So jaane se pehle quick review.\n\nKya 3-5 din ka plan banana hai?",
          "Common challenge.\n\n1. Topics list.\n2. Priority mark.\n3. 25-min sessions + 5-min break.\n4. 2 high topics/day.\n5. Quick review before sleep.\n\n3-5 day plan?"
        );
        quickReplies = ["Yes, create a plan", "Help me prioritize subjects", "I need a break first", "Tell me about Pomodoro"]; 
      } else if (/result|worry|results/.test(userClarification)) {
        reply = t(preferredLanguage,
          "Worrying about results is natural, but it can drain the energy you need to prepare.\n\nLet's shift focus to what you can control:\n- Your daily study effort.\n- Asking for help on weak topics.\n- Good sleep and breaks to stay sharp.\n\nResults follow preparation. Would you like a calming grounding exercise to ease the worry right now?",
          "Result ki chinta natural hai, par energy drain karti hai.\n\nControl wali cheezein:\n- Daily study effort.\n- Weak topics pe help.\n- Good sleep + breaks.\n\nResult preparation ke baad aata hai. Abhi calming exercise?",
          "Result worry natural hai.\n\nControl:\n- Daily effort.\n- Help on weak.\n- Sleep + breaks.\n\nCalming exercise now?"
        );
        quickReplies = ["Try a calming exercise", "Help me study smarter", "I need encouragement", "Talk to a counsellor"]; interventions = ['BREATHING','GROUNDING'];
      } else if (/difficult|hard|mushkil/.test(userClarification)) {
        reply = t(preferredLanguage,
          "Finding certain subjects difficult is completely okay — it just means we need a different strategy for those.\n\nTry this:\n1. Identify the specific chapters/topics that are hardest.\n2. Use alternative resources (videos, peer study groups, tutor).\n3. Practice past questions to find patterns.\n4. Teach the concept to someone else (best way to learn).\n5. Ask your teacher/counsellor for targeted help.\n\nWhich subject is giving you the most trouble?",
          "Kuch subjects mushkil lagna okay hai — bas different strategy chahiye.\n\n1. Specific hard topics identify.\n2. Videos, peer groups, tutor try.\n3. Past questions practice.\n4. Concept kisi aur ko sikhao.\n5. Teacher/counsellor se help.\n\nKaunsa subject sabse zyada?",
          "Hard subjects okay hai — different strategy.\n\n1. Hard topics identify.\n2. Videos/peers/tutor.\n3. Past questions.\n4. Teach others.\n5. Teacher help.\n\nWhich subject?"
        );
        quickReplies = ["Mathematics", "Science", "Languages", "I need a study plan"]; 
      } else if (/time|manage/.test(userClarification)) {
        reply = t(preferredLanguage,
          "Time management is a skill we can build together.\n\nHere's a simple framework:\n1. Brain-dump all tasks for the week.\n2. Pick your top 3 priorities each day.\n3. Block 2-3 study sessions (45-60 min) with breaks.\n4. Protect sleep (7-8 hrs) — it's part of productivity.\n5. Review & adjust daily.\n\nWould you like a sample daily schedule?",
          "Time management skill hai jo build kar sakte hain.\n\n1. Week ke tasks brain-dump.\n2. Top 3 priorities daily.\n3. 2-3 study sessions (45-60 min) + breaks.\n4. Sleep 7-8 hrs protect.\n5. Daily review & adjust.\n\nSample daily schedule chahiye?",
          "Time management skill.\n\n1. Brain-dump.\n2. Top 3 priorities.\n3. 2-3 sessions + breaks.\n4. Sleep 7-8.\n5. Review.\n\nSample schedule?"
        );
        quickReplies = ["Yes, show a schedule", "I procrastinate a lot", "Help me stay consistent", "I feel overwhelmed"]; 
      } else {
        // Generic follow-up providing a plan
        reply = t(preferredLanguage,
          "Thank you for sharing more. Based on what you've told me, here's a focused path forward:\n\n1. Pick ONE small task you can complete today (15-20 min).\n2. Break larger goals into daily micro-steps.\n3. Take a 5-minute breathing break between tasks.\n4. End the day by noting one thing that went well.\n\nWhat feels like the most useful next step for you right now?",
          "Aur share karne ke liye dhanyawad. Aapke batane ke aadhar par:\n\n1. Aaj ek chota task complete karo (15-20 min).\n2. Bade goals ko daily micro-steps mein todo.\n3. Tasks ke beech 5-min breathing break.\n4. Din end pe ek positive note.\n\nAbhi sabse useful next step kya lagta hai?",
          "Thanks. Based on sharing:\n\n1. One small task today (15-20 min).\n2. Goals -> daily micro-steps.\n3. 5-min breathing break.\n4. One positive note end of day.\n\nNext step?"
        );
        quickReplies = ["Create a daily plan", "I need to calm down first", "Help me prioritize", "Talk more about it"]; 
      }
    } else if (category === 'anxiety') {
      reply = t(preferredLanguage,
        "Let's work through this together with a simple grounding exercise (5-4-3-2-1):\n\n- Name 5 things you can SEE.\n- 4 things you can TOUCH.\n- 3 things you can HEAR.\n- 2 things you can SMELL.\n- 1 thing you can TASTE.\n\nTake your time. This helps bring your mind back to the present. After that, would you like to explore what triggered the anxiety?",
        "Aaiye grounding exercise karein (5-4-3-2-1):\n\n- 5 cheezein dekho.\n- 4 cheezein touch karo.\n- 3 sounds suno.\n- 2 smells.\n- 1 taste.\n\nTime lo. Present mein wapas aao. Phir trigger explore karein?",
        "Grounding exercise (5-4-3-2-1):\n\n- 5 see, 4 touch, 3 hear, 2 smell, 1 taste.\n\nTake time. Present. Then trigger explore?"
      );
      quickReplies = ["I feel a bit calmer", "Explore my triggers", "Try breathing instead", "I need more support"]; interventions = ['GROUNDING','BREATHING'];
    } else if (category === 'loneliness') {
      reply = t(preferredLanguage,
        "I'm really glad you're here. Connection takes time, and small steps matter.\n\nA few gentle ideas:\n1. Reach out to one person today with a simple message.\n2. Join a peer community or interest group (even online).\n3. Spend time in a shared space (cafe, library, park).\n4. Consider talking to a counsellor for deeper support.\n\nWhich of these feels doable for you today?",
        "Main khush hoon ki aap yahan hain. Connection time leta hai.\n\n1. Ek person ko simple message bhejo.\n2. Peer community/interest group join.\n3. Shared space (cafe, library, park).\n4. Counsellor se baat.\n\nAaj kaunsa doable lagta hai?",
        "Glad you're here.\n\n1. One person message.\n2. Peer group.\n3. Shared space.\n4. Counsellor.\n\nDoable today?"
      );
      quickReplies = ["Message a friend", "Join peer community", "Find a counsellor", "Just keep talking"]; 
    } else if (category === 'career') {
      reply = t(preferredLanguage,
        "Let's turn confusion into clarity with small steps.\n\n1. Write down 3 things you enjoy doing.\n2. Write down 3 things you're good at.\n3. Notice where they overlap — that's a strong signal.\n4. Research 2-3 career paths that match.\n5. Talk to someone in those fields (informational interview).\n\nWould you like help mapping your interests to possible paths?",
        "Confusion ko clarity mein badlein small steps se.\n\n1. 3 cheezein jo pasand hain.\n2. 3 cheezein jisme ache ho.\n3. Overlap note karo.\n4. 2-3 career paths research.\n5. Field ke logon se baat.\n\nInterests map karna hai?",
        "Confusion -> clarity.\n\n1. 3 enjoy.\n2. 3 good at.\n3. Overlap.\n4. Research 2-3 paths.\n5. Talk to professionals.\n\nMap interests?"
      );
      quickReplies = ["Map my interests", "Explore career options", "Set small goals", "Talk to a mentor"]; 
    } else if (category === 'sleep') {
      reply = t(preferredLanguage,
        "Let's try a short wind-down routine (4-7-8 breathing):\n\n- Inhale through nose for 4 seconds.\n- Hold for 7 seconds.\n- Exhale slowly for 8 seconds.\n- Repeat 4 cycles.\n\nAlso: dim lights 1 hour before bed, avoid screens, and write down tomorrow's to-dos so your mind can let go.\n\nWould you like to try this now?",
        "4-7-8 breathing try karein:\n\n- Naak se 4 sec inhale.\n- 7 sec hold.\n- 8 sec exhale.\n- 4 cycles.\n\nLights dim 1 hr pehle, screens avoid, kal ke to-dos likho.\n\nAbhi try karna hai?",
        "4-7-8 breathing:\n\n- Inhale 4, hold 7, exhale 8, 4 cycles.\n\nDim lights, no screens, write to-dos.\n\nTry now?"
      );
      quickReplies = ["Try it now", "More sleep tips", "My mind won't stop racing", "I need professional help"]; interventions = ['BREATHING','SLEEP'];
    } else {
      reply = t(preferredLanguage,
        "I'm here with you. It sounds like you're carrying a lot. Let's take it one step at a time.\n\nWould you like to:\n- Explore what's bothering you more deeply?\n- Try a calming exercise?\n- Create a small action plan?\n- Just keep talking?",
        "Main aapke saath hoon. Bahut kuch carry kar rahe hain. Ek step at a time.\n\n- Deeply explore?\n- Calming exercise?\n- Action plan?\n- Bas baat?",
        "Here with you. One step at a time.\n\n- Explore deeper?\n- Calm exercise?\n- Action plan?\n- Keep talking?"
      );
      quickReplies = ["Explore more", "Calming exercise", "Create a plan", "Just talk"]; 
    }
  }

  return {
    replyText: reply,
    isCrisis: false,
    suggestedQuickReplies: quickReplies,
    suggestedInterventions: interventions,
    detectedLanguage: preferredLanguage
  };
}
