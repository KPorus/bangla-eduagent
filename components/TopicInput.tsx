import React, { useState, useEffect } from 'react';

interface TopicInputProps {
  onGenerate: (topic: string) => void;
  isGenerating: boolean;
}

const TopicInput: React.FC<TopicInputProps> = ({ onGenerate, isGenerating }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Initialize Speech Recognition if available
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.lang = 'bn-BD'; // Defaulting to Bengali/English mix context if supported, or could be 'en-US'
        recognitionInstance.interimResults = false;

        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };

        recognitionInstance.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) onGenerate(input);
  };

  const suggestions = ["React JS", "Python for Data Science", "Machine Learning Basics", "History of Bengal", "Personal Finance"];

  return (
    <div className="max-w-2xl mx-auto mt-12 px-4 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          <span className="text-indigo-600">Shikho</span> AI
        </h1>
        <p className="text-lg text-slate-600">
          Your personal Bengali AI Tutor. Type or speak any topic to generate a complete course syllabus instantly.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What do you want to learn today? (e.g., Quantum Physics)"
              className="w-full pl-6 pr-24 py-4 text-lg rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400"
              disabled={isGenerating}
            />
            
            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`absolute right-2 p-2 rounded-lg transition-all ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'}`}
              title="Voice Input"
            >
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
               </svg>
            </button>
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? 'Thinking...' : 'Start Learning'}
          </button>
        </form>

        <div className="mt-6">
          <p className="text-sm text-slate-400 font-medium mb-3 uppercase tracking-wider text-xs">Try these topics:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 rounded-full text-sm transition-colors border border-slate-200 hover:border-indigo-200"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicInput;
