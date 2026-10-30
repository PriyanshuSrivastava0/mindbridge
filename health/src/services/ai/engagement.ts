import { LanguageCode } from '../../types';

export interface EngagementState {
  enabled: boolean;
  stage: 'INITIAL_WELCOME' | 'STAGE_1_GENTLE_INVITE' | 'STAGE_2_LOW_EFFORT_OPTIONS' | 'IDLE_STOPPED';
  lastActivityTimestamp: number;
  quietHoursActive: boolean;
  userDeclined: boolean;
}

export interface PromptPayload {
  stage: 'STAGE_1_GENTLE_INVITE' | 'STAGE_2_LOW_EFFORT_OPTIONS';
  message: string;
  quickReplies: string[];
}

export class ConversationEngagementService {
  private timer20s: NodeJS.Timeout | null = null;
  private timer60s: NodeJS.Timeout | null = null;
  private isEnabled: boolean = true;
  private hasUserReplied: boolean = false;
  private hasDeclined: boolean = false;
  private onPromptCallback: ((prompt: PromptPayload) => void) | null = null;
  private preferredLanguage: LanguageCode = 'en';

  constructor(
    isEnabled: boolean = true,
    preferredLanguage: LanguageCode = 'en',
    onPrompt?: (prompt: PromptPayload) => void
  ) {
    this.isEnabled = isEnabled;
    this.preferredLanguage = preferredLanguage;
    if (onPrompt) this.onPromptCallback = onPrompt;
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.cancelTimers();
    }
  }

  public setLanguage(lang: LanguageCode) {
    this.preferredLanguage = lang;
  }

  public checkQuietHours(): boolean {
    const currentHour = new Date().getHours();
    // Default quiet hours between 11 PM and 6 AM
    return currentHour >= 23 || currentHour < 6;
  }

  public startSession(onPrompt: (prompt: PromptPayload) => void) {
    this.onPromptCallback = onPrompt;
    this.hasUserReplied = false;
    this.hasDeclined = false;

    if (!this.isEnabled) return;
    if (this.checkQuietHours()) {
      console.log("[EngagementService] Quiet hours active. Skipping unsolicited proactive prompts.");
      return;
    }

    this.cancelTimers();

    // Stage 1: 20 seconds inactivity timer
    this.timer20s = setTimeout(() => {
      if (this.hasUserReplied || this.hasDeclined || !this.isEnabled) return;

      const prompt1 = this.getStage1Prompt();
      if (this.onPromptCallback) {
        this.onPromptCallback(prompt1);
      }

      // Stage 2: additional 40 seconds (total 60s)
      this.timer60s = setTimeout(() => {
        if (this.hasUserReplied || this.hasDeclined || !this.isEnabled) return;

        const prompt2 = this.getStage2Prompt();
        if (this.onPromptCallback) {
          this.onPromptCallback(prompt2);
        }

        // Stop prompting after stage 2 if user remains inactive
        this.cancelTimers();
      }, 40000);
    }, 20000);
  }

  public userActivityDetected() {
    this.hasUserReplied = true;
    this.cancelTimers();
  }

  public userDeclinedInteraction() {
    this.hasDeclined = true;
    this.cancelTimers();
  }

  public cancelTimers() {
    if (this.timer20s) {
      clearTimeout(this.timer20s);
      this.timer20s = null;
    }
    if (this.timer60s) {
      clearTimeout(this.timer60s);
      this.timer60s = null;
    }
  }

  private getStage1Prompt(): PromptPayload {
    if (this.preferredLanguage === 'hi') {
      return {
        stage: 'STAGE_1_GENTLE_INVITE',
        message: "Sahi shabd dhoondhne ka koi dabav nahi hai. Hum choti si shuruaat kar sakte hain. Kya aap batana chahenge ki aap kaisa mehsus kar rahe hain?",
        quickReplies: [
          "Mujhe thoda stress ho raha hai",
          "Mann udaas hai",
          "Mujhe kisi se baat karni hai",
          "Pata nahi kya kahu",
          "Abhi nahi, shukriya"
        ]
      };
    } else if (this.preferredLanguage === 'hinglish') {
      return {
        stage: 'STAGE_1_GENTLE_INVITE',
        message: "No pressure to find the right words. We can start small. Would you like to tell me how you're feeling?",
        quickReplies: [
          "I'm feeling stressed",
          "I feel low",
          "I need someone to listen",
          "I don't know what to say",
          "Not right now"
        ]
      };
    }

    return {
      stage: 'STAGE_1_GENTLE_INVITE',
      message: "No pressure to find the right words. We can start small. Would you like to tell me how you're feeling?",
      quickReplies: [
        "I'm feeling stressed",
        "I feel low",
        "I need someone to listen",
        "I don't know what to say",
        "Not right now"
      ]
    };
  }

  private getStage2Prompt(): PromptPayload {
    if (this.preferredLanguage === 'hi') {
      return {
        stage: 'STAGE_2_LOW_EFFORT_OPTIONS',
        message: "Agar likhna kathin lag raha hai, toh aap neeche diye gaye vikalpon mein se chun sakte hain ya bas ek lambi saans le sakte hain.",
        quickReplies: [
          "Ek 2-minute breathing exercise",
          "Bas shanti se baithna chahta hoon",
          "Main baad mein baat karunga"
        ]
      };
    } else if (this.preferredLanguage === 'hinglish') {
      return {
        stage: 'STAGE_2_LOW_EFFORT_OPTIONS',
        message: "If typing feels like too much right now, that is completely okay. You can click an option below or just take your time.",
        quickReplies: [
          "Try a 2-min calming exercise",
          "I just want quiet right now",
          "I'll come back later"
        ]
      };
    }

    return {
      stage: 'STAGE_2_LOW_EFFORT_OPTIONS',
      message: "If typing feels like too much right now, that is completely okay. You can click a gentle option below or just take all the time you need.",
      quickReplies: [
        "Try a 2-min calming exercise",
        "I just want quiet right now",
        "I'll come back later"
      ]
    };
  }
}

