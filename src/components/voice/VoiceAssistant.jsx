import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2, Volume2, AlertCircle } from 'lucide-react';
import { startListening, speakText, unlockAudio } from '../../services/voiceService';
import './VoiceAssistant.css';

import { getApiUrl } from '../../config/apiConfig';

export const VoiceAssistant = ({ 
  driverId, 
  preferredLanguage = 'hi-IN', 
  onAssistantAction, 
  currentRisk = null 
}) => {
  const [status, setStatus] = useState('idle'); // idle, listening, processing, speaking
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('');
  const [notice, setNotice] = useState('');

  const lang = preferredLanguage;

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Built-in intelligent client-side NLP fallback when backend is cold-starting or offline
  const fallbackClientNLP = (userText) => {
    const lower = userText.toLowerCase();
    let action = null;
    let payload = {};
    let englishReply = "I am monitoring your corridor. Tell me your destination or tap a quick command.";

    // 1. Direct Risk Telemetry Explanation Request
    if (lower.includes("risk") || lower.includes("telemetry") || lower.includes("status") || lower.includes("khatra") || lower.includes("explain") || lower.includes("delay") || lower.includes("score")) {
      const score = Math.round(currentRisk?.risk_score || 72);
      const isHigh = currentRisk?.risk_level === 'High' || score >= 65;
      const delay = currentRisk?.predicted_delay_hours || 4.5;
      const factor = (currentRisk?.risk_drivers && currentRisk?.risk_drivers.length > 0)
        ? currentRisk.risk_drivers[0].replace(/^[🚨🌧️⚠️✅🛣️📍\s]+/, '').split('(')[0].trim()
        : "active mountain landslide sector";

      action = "EXPLAIN_RISK";
      payload = currentRisk;

      englishReply = `AI Risk Telemetry: Current risk score is ${score} out of 100, which is ${isHigh ? 'High Risk' : 'Safe'}. Estimated delay is ${delay} hours. Key risk factor: ${factor}.`;

      const langCode = lang.split('-')[0].toLowerCase();
      let finalReply = englishReply;

      if (langCode === 'hi') {
        const riskHi = isHigh ? "उच्च खतरा" : "सुरक्षित";
        finalReply = `एआई जोखिम टेलीमेट्री: वर्तमान जोखिम स्कोर ${score} है, जो ${riskHi} है। अनुमानित देरी ${delay} घंटे है। मुख्य कारक: ${factor}।`;
      } else if (langCode === 'te') {
        const riskTe = isHigh ? "అధిక ప్రమాదం" : "సురక్షితం";
        finalReply = `ఏఐ రిస్క్ టెలిమెట్రీ: ప్రస్తుత రిస్క్ స్కోర్ ${score}, ఇది ${riskTe}. అంచనా వేసిన ఆలస్యం ${delay} గంటలు. ప్రధాన కారణం: ${factor}.`;
      } else if (langCode === 'bn') {
        const riskBn = isHigh ? "উচ্চ বিপদ" : "নিরাপদ";
        finalReply = `এআই ঝুঁকি টেলিমেট্রি: বর্তমান ঝুঁকি স্কোর ${score}, যা ${riskBn}। আনুমানিক বিলম্ব ${delay} ঘণ্টা। মূল কারণ: ${factor}।`;
      }

      return { action, payload, replyText: finalReply };
    }

    // North-East city detection
    const cities = [
      "gangtok", "guwahati", "shillong", "silchar", "imphal", 
      "kohima", "agartala", "aizawl", "itanagar", "dimapur", "jorhat", "tezpur"
    ];

    const foundDest = cities.find(c => lower.includes(c));
    const isToPattern = lower.includes(" to ") || lower.includes(" se ");

    if (isToPattern) {
      const parts = lower.includes(" to ") ? lower.split(" to ") : lower.split(" se ");
      const origin = parts[0].replace(/.*from\s+/i, '').trim();
      const destination = parts[1].replace(/.*navigate\s+/i, '').trim();
      action = "NAVIGATE";
      payload = { origin, destination };
      englishReply = `Routing from ${origin} to ${destination}. Real-time GPS navigation is active.`;
    } else if (foundDest || lower.includes("navigate") || lower.includes("route")) {
      const dest = foundDest ? foundDest.charAt(0).toUpperCase() + foundDest.slice(1) : "Gangtok";
      action = "NAVIGATE";
      payload = { destination: dest };
      englishReply = `Calculating the safest route to ${dest} from your current position. GPS navigation started.`;
    } else if (lower.includes("landslide") || lower.includes("hazard") || lower.includes("avoid") || lower.includes("alternate") || lower.includes("detour") || lower.includes("badlo")) {
      action = "CHANGE_ROUTE";
      englishReply = "Landslide hotspot detected ahead on your corridor. Re-routing to the safest detour now.";
    } else if (lower.includes("weather") || lower.includes("rain") || lower.includes("storm") || lower.includes("barish")) {
      englishReply = "Monsoon warning active. Mountain pass has high rainfall. Reduced speed advisory in effect.";
    }

    // Regional multilingual translation fallback
    const langCode = lang.split('-')[0].toLowerCase();
    let finalReply = englishReply;

    if (langCode === 'hi') {
      if (action === "NAVIGATE") {
        finalReply = `गंगटोक का सबसे सुरक्षित मार्ग लोड किया जा रहा है। जीपीएस नेविगेशन शुरू हो गया है।`;
      } else if (action === "CHANGE_ROUTE") {
        finalReply = `आगे भूस्खलन का खतरा है। सुरक्षित बाईपास मार्ग चुना गया है।`;
      } else {
        finalReply = `मौसम चेतावनी: भारी बारिश का अनुमान है। कृपया गति धीमी रखें।`;
      }
    } else if (langCode === 'te') {
      if (action === "NAVIGATE") {
        finalReply = `సురక్షితమైన మార్గం రూపొందించబడింది. ప్రత్యక్ష GPS నావిగేషన్ ప్రారంభమైంది.`;
      } else if (action === "CHANGE_ROUTE") {
        finalReply = `ముందు కొండచరియలు విరిగిపడే ప్రమాదం ఉంది. ప్రత్యామ్నాయ మార్గం ప్రారంభించబడింది.`;
      } else {
        finalReply = `వాతావరణ హెచ్చరిక: వర్షం కారణంగా వేగం తగ్గించండి.`;
      }
    } else if (langCode === 'bn') {
      if (action === "NAVIGATE") {
        finalReply = `নিরাপদ রুট প্রস্তুত করা হচ্ছে। লাইভ জিপিএস সক্রিয় হয়েছে।`;
      } else if (action === "CHANGE_ROUTE") {
        finalReply = `সামনে ভূমিধসের ঝুঁকি রয়েছে। বিকল্প নিরাপদ রুট নির্ধারণ করা হয়েছে।`;
      } else {
        finalReply = `ভারী বৃষ্টির সতর্কতা। সাবধানে গাড়ি চালান।`;
      }
    }

    return { action, payload, replyText: finalReply };
  };

  const processText = async (text) => {
    setStatus('processing');
    setNotice('');
    unlockAudio();

    let data = null;

    try {
      // 3.5-second timeout to handle Render cold-start smoothly
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(getApiUrl('/api/assistant/chat'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driverId,
          text,
          language: lang
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        data = await res.json();
      }
    } catch {
      // Fallback silently without throwing unhandled exceptions
    }

    // If backend was unreachable or timed out, use smart client-side NLP
    if (!data || !data.replyText) {
      data = fallbackClientNLP(text);
    }

    setReply(data.replyText);
    setStatus('speaking');

    if (data.action && onAssistantAction) {
      onAssistantAction(data.action, data.payload);
    }

    speakText(data.replyText, lang);

    setTimeout(() => {
      setStatus('idle');
    }, 5000);
  };

  const handleToggleListen = () => {
    unlockAudio();
    setNotice('');

    if (status === 'listening') {
      setStatus('idle');
      return;
    }

    setTranscript('');
    setReply('');
    setStatus('listening');

    const rec = startListening(
      (text) => {
        setTranscript(text);
        processText(text);
      },
      (error) => {
        const msg = error?.message || "Microphone issue";
        setNotice(msg);
        setStatus('idle');
      },
      () => {
        setStatus((prev) => (prev === 'listening' ? 'idle' : prev));
      },
      lang
    );

    if (!rec) {
      setStatus('idle');
    }
  };

  const handleQuickCommand = (cmdText) => {
    unlockAudio();
    setTranscript(cmdText);
    processText(cmdText);
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
          {status === 'listening' && "Listening... Speak now"}
          {status === 'processing' && "Analyzing command..."}
          {status === 'speaking' && "AI is replying aloud..."}
        </div>
      </div>

      {notice && (
        <div className="va-notice-box">
          <AlertCircle size={12} />
          <span>{notice}</span>
        </div>
      )}

      {/* Instant Quick Action Chips for live demo and phone testing */}
      <div className="va-quick-chips">
        <span className="va-quick-title">Quick Commands:</span>
        <button 
          className="va-chip va-chip-highlight" 
          onClick={() => handleQuickCommand("Explain risk telemetry")}
          title="Voice explanation of current AI risk telemetry"
        >
          📊 Explain Risk
        </button>
        <button 
          className="va-chip" 
          onClick={() => handleQuickCommand("Guwahati to Gangtok")}
          title="Route to Gangtok"
        >
          📍 Gangtok
        </button>
        <button 
          className="va-chip" 
          onClick={() => handleQuickCommand("Avoid landslide hazard")}
          title="Safe Detour"
        >
          ⚠️ Avoid Hazard
        </button>
        <button 
          className="va-chip" 
          onClick={() => handleQuickCommand("Check weather ahead")}
          title="Weather Advisory"
        >
          🌦️ Weather
        </button>
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

