let cachedVoices = [];

const loadVoices = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const v = window.speechSynthesis.getVoices();
    if (v && v.length > 0) {
      cachedVoices = v;
    }
  }
};

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

export const unlockAudio = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch (e) {
      // ignore
    }
  }
};

export const isSpeechSupported = () => {
  const hasSynthesis = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const hasRecognition = typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  return { hasSynthesis, hasRecognition };
};

export const speakText = (text, lang = 'en-IN') => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return;
  
  try {
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  } catch (e) {}

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.96; // Optimal clarity for driver guidance
  utterance.pitch = 1.0;

  // Retrieve cached voices or fresh list
  const voices = (cachedVoices.length > 0) ? cachedVoices : window.speechSynthesis.getVoices();
  const langCode = lang.split('-')[0].toLowerCase(); // 'hi', 'te', 'bn', 'en', etc.

  if (voices && voices.length > 0) {
    // 1. Exact match (e.g. hi-IN or te-IN)
    let matchedVoice = voices.find(v => v.lang.replace('_', '-').toLowerCase() === lang.toLowerCase());
    
    // 2. Language prefix match (e.g. starts with 'hi' or 'te' or 'bn')
    if (!matchedVoice) {
      matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(langCode));
    }

    // 3. Prefer high quality Google / Microsoft / Natural voices if available
    if (matchedVoice) {
      const preferredVariant = voices.find(v => 
        v.lang.toLowerCase().startsWith(langCode) && 
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Microsoft') || v.name.includes('India'))
      );
      utterance.voice = preferredVariant || matchedVoice;
    }
  }

  try {
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn("Speech synthesis trigger error:", e);
  }
};

export const startListening = (onResult, onError, onEnd, lang = 'hi-IN') => {
  unlockAudio();
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    onError(new Error("Voice recognition is not supported in this browser. Please use Google Chrome or tap the quick commands below."));
    return null;
  }

  let recognition;
  try {
    recognition = new SpeechRecognition();
  } catch (err) {
    onError(new Error("Could not initialize microphone. Please check permissions or tap quick commands."));
    return null;
  }

  recognition.lang = lang;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    if (event.results && event.results[0] && event.results[0][0]) {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    }
  };

  recognition.onerror = (event) => {
    let errorMsg = event.error || "Speech recognition error";
    if (event.error === 'not-allowed' || event.error === 'permission-denied') {
      errorMsg = "Microphone access denied. Please allow microphone in browser address bar.";
    } else if (event.error === 'no-speech') {
      errorMsg = "No speech heard. Try speaking closer to mic or tap a quick command.";
    } else if (event.error === 'network') {
      errorMsg = "Network latency detected. You can use quick command chips.";
    }
    onError(new Error(errorMsg));
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  try {
    recognition.start();
    return recognition;
  } catch (err) {
    onError(err);
    return null;
  }
};
