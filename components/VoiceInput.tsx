import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isListening?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript }) => {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = false;
      recognizer.lang = 'bn-BD'; // Default to Bengali, but often captures English well too in mixed mode

      recognizer.onstart = () => setListening(true);
      recognizer.onend = () => setListening(false);
      recognizer.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
      };

      setRecognition(recognizer);
    } else {
      setSupported(false);
    }
  }, [onTranscript]);

  const toggleListen = () => {
    if (!supported || !recognition) return;
    
    if (listening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={toggleListen}
      className={`absolute right-14 top-2 bottom-2 p-2 rounded-xl transition-all flex items-center justify-center ${
        listening 
          ? 'bg-red-50 text-red-600 animate-pulse border border-red-200' 
          : 'text-gray-400 hover:text-primary hover:bg-green-50'
      }`}
      title="Voice Input (Bengali/English)"
    >
      {listening ? <MicOff size={20} /> : <Mic size={20} />}
    </button>
  );
};