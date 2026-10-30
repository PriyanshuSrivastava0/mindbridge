// Web Speech STT & TTS Service with graceful fallbacks

export class SpeechService {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;

  public static isSTTSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  public static isTTSSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'speechSynthesis' in window;
  }

  public static speak(text: string, lang: 'en' | 'hi' = 'en', onEnd?: () => void) {
    if (!this.synth) {
      console.warn("Speech synthesis not supported in this browser environment.");
      if (onEnd) onEnd();
      return;
    }

    this.synth.cancel(); // Stop any active speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.95; // slightly gentle and calm pace
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error:", e);
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  public static stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public static startListening(
    onResult: (transcript: string) => void,
    onError: (err: string) => void
  ): { stop: () => void } {
    if (typeof window === 'undefined') {
      onError("Audio input unavailable");
      return { stop: () => {} };
    }

    const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
                              (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError("Voice speech recognition is not supported on this browser.");
      return { stop: () => {} };
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        onResult(transcript);
      };

      recognition.onerror = (event: any) => {
        onError(event.error || "Speech recognition encountered an issue.");
      };

      recognition.start();

      return {
        stop: () => {
          try {
            recognition.stop();
          } catch {
            // ignore
          }
        }
      };
    } catch (e: any) {
      onError(e?.message || "Failed to initialize microphone.");
      return { stop: () => {} };
    }
  }
}

