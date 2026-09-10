let cachedVoices = [];

const loadVoices = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
};

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

export const speakText = (text, lang = 'en-IN') => {
  if (!('speechSynthesis' in window)) return;
  
  // Stop any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.96; // Optimal clarity for driver guidance
  utterance.pitch = 1.0;

  // Retrieve cached voices or fresh list
  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  const langCode = lang.split('-')[0].toLowerCase(); // 'hi', 'te', 'bn', 'en', etc.

  if (voices.length > 0) {
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

  window.speechSynthesis.speak(utterance);
};

export const startListening = (onResult, onError, onEnd, lang = 'hi-IN') => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    onError(new Error("Speech recognition not supported in this browser. Please use Chrome."));
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = lang; // Default to Hindi since the user asked for "their own language" often Hindi/local in India context.
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event) => {
    onError(new Error(event.error));
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
