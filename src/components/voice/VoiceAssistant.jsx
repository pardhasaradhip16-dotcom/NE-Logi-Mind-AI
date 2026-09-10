import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2, Volume2 } from 'lucide-react';
import { startListening, speakText } from '../../services/voiceService';
import './VoiceAssistant.css';

import { getApiUrl } from '../../config/apiConfig';

export const VoiceAssistant = ({ driverId, preferredLanguage = 'hi-IN', onAssistantAction }) => {
  const [status, setStatus] = useState('idle'); // idle, listening, processing, speaking
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('');

  // Dynamically uses the driver's native language to listen to speech
  const lang = preferredLanguage;

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const handleToggleListen = () => {
    if (status === 'listening') {
      // It will auto-stop on silence or we can force stop
      setStatus('idle');
      return;
    }

    setTranscript('');
    setReply('');
    setStatus('listening');

    startListening(
      (text) => {
        setTranscript(text);
        processWithBackend(text);
      },
      (error) => {
        console.error("Voice Error:", error);
        setStatus('idle');
      },
      () => {
        setStatus((prev) => (prev === 'listening' ? 'idle' : prev));
      },
      lang
    );
  };

  const processWithBackend = async (text) => {
    setStatus('processing');
    try {
      const res = await fetch(getApiUrl('/api/assistant/chat'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driverId,
          text,
          language: lang
        })
      });

      if (!res.ok) throw new Error("Backend error");
      const data = await res.json();

      setReply(data.replyText);
      setStatus('speaking');

      if (data.action) {
        onAssistantAction(data.action, data.payload);
      }

      speakText(data.replyText, lang);

      // Reset to idle after some time (rough estimate, actual relies on onend event of utterance if we bind it, 
      // but setTimeout is simpler for this mock)
      setTimeout(() => {
        setStatus('idle');
      }, 5000);

    } catch (err) {
      console.error("Assistant API Error:", err);
      setStatus('idle');
    }
  };

  return (
    <div className="voice-assistant-card notranslate" translate="no">
      <div className="va-header">
        <Volume2 size={15} className="text-primary" />
        <h4>AI Voice Copilot</h4>
        {(status === 'listening' || status === 'speaking') && (
          <div className="va-sound-wave" title="Audio Processing Active">
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
            <span className="wave-bar"></span>
          </div>
        )}
      </div>

      <div className="va-body">
        <button 
          className={`va-mic-btn ${status}`} 
          onClick={handleToggleListen}
          title="Tap to speak"
        >
          {status === 'listening' ? <MicOff size={22} /> : 
           status === 'processing' ? <Loader2 size={22} className="spin" /> : 
           <Mic size={22} />}
        </button>
        
        <div className="va-status-text">
          {status === 'idle' && "Tap mic to speak"}
          {status === 'listening' && "Listening..."}
          {status === 'processing' && "Thinking..."}
          {status === 'speaking' && "Replying..."}
        </div>
      </div>

      {(transcript || reply) && (
        <div className="va-transcript-box">
          {transcript && <div className="va-user"><strong>You:</strong> {transcript}</div>}
          {reply && <div className="va-ai"><strong>AI:</strong> {reply}</div>}
        </div>
      )}
    </div>
  );
};
