import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Loader, Search, Mic, History, X } from 'lucide-react';
import { ErrorBanner } from './ErrorBanner';

interface CourseGeneratorProps {
  onCreate: (topic: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  onClearError: () => void;
}

export const CourseGenerator: React.FC<CourseGeneratorProps> = ({ onCreate, loading, error, onClearError }) => {
  const [topic, setTopic] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recent searches", e);
      }
    }
  }, []);

  const saveRecentSearch = (term: string) => {
    const normalizedTerm = term.trim();
    if (!normalizedTerm) return;
    
    // Remove duplicates and keep top 5
    const updated = [normalizedTerm, ...recentSearches.filter(s => s !== normalizedTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
  };

  const removeRecentSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation(); // Prevent click from bubbling to the container
    const updated = recentSearches.filter(s => s !== term);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
    inputRef.current?.focus(); // Keep focus on input
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      saveRecentSearch(topic.trim());
      onCreate(topic);
      setShowRecent(false);
    }
  };

  const handleTopicChange = (val: string) => {
    setTopic(val);
    if (error) onClearError();
  };

  const handleSelectRecent = (term: string) => {
    setTopic(term);
    saveRecentSearch(term);
    onCreate(term);
    setShowRecent(false);
  };

  const handleVoiceInput = () => {
    if (isListening) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // Default to English for tech topics, could be 'bn-BD' for Bengali
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTopic(transcript);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary-400 blur-xl opacity-20 animate-pulse rounded-full"></div>
          <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
             <Loader className="w-12 h-12 text-primary-600 animate-spin" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2 font-bengali">কোর্স তৈরি করা হচ্ছে...</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          Our agents are researching "{topic}" and structuring a personalized learning path in Bengali.
        </p>
        
        <div className="mt-8 flex gap-3">
            {['Researching', 'Structuring', 'Translating'].map((step, i) => (
                <div key={step} className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: `${i * 200}ms`}}></div>
                    {step}
                </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 w-full max-w-5xl mx-auto">
      
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-semibold mb-8 shadow-sm">
        <Sparkles size={12} className="text-primary-600" />
        <span>Powered by Gemini 3 Pro</span>
      </div>

      {/* Headlines */}
      <div className="text-center mb-10 space-y-3">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight font-bengali">
          যেকোনো বিষয়ে শিখুন <span className="text-primary-600">মায়ের <br className="md:hidden"/> ভাষায়</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-xl mx-auto font-light">
          Enter a topic (e.g., "PyTorch Distillation", "History of Bengal") to generate a personalized course with quizzes.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="w-full max-w-2xl mb-6">
          <ErrorBanner message={error} onDismiss={onClearError} />
        </div>
      )}

      {/* Search Input Container */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl relative z-10">
        <div className={`relative flex items-center bg-slate-800 rounded-2xl p-2 shadow-2xl shadow-slate-200 transition-transform duration-300 ${error ? 'ring-2 ring-red-400' : 'focus-within:scale-[1.02]'}`}>
          <div className="pl-4 text-slate-400">
            <Search size={22} />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={topic}
            onChange={(e) => handleTopicChange(e.target.value)}
            onFocus={() => setShowRecent(true)}
            onBlur={() => setTimeout(() => setShowRecent(false), 200)}
            placeholder="What do you want to learn today?"
            className="flex-1 bg-transparent border-none text-white placeholder-slate-400 px-4 py-3 text-lg focus:ring-0 outline-none w-full font-light"
            autoFocus
          />
          <div className="flex items-center gap-2 pr-1">
            <button 
              type="button" 
              onClick={handleVoiceInput}
              className={`p-2 transition-all rounded-full ${isListening ? 'text-red-500 bg-red-100/10 animate-pulse ring-2 ring-red-500/50' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
              title="Voice Input"
            >
              <Mic size={20} />
            </button>
            <button
              type="submit"
              disabled={!topic.trim()}
              className="bg-primary-700 hover:bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Start
            </button>
          </div>
        </div>

        {/* Recent Searches Dropdown */}
        {showRecent && recentSearches.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-2 animate-fade-in z-20">
            <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between">
              <span>Recent Searches</span>
            </div>
            {recentSearches.map(term => (
              <div
                key={term}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center justify-between gap-3 text-slate-700 transition-colors group cursor-pointer"
                onClick={() => handleSelectRecent(term)}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                   <History size={16} className="text-slate-400 flex-shrink-0" />
                   <span className="truncate">{term}</span>
                </div>
                <button
                  onClick={(e) => removeRecentSearch(e, term)}
                  className="text-slate-300 hover:text-red-500 p-1 rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                  title="Remove from history"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </form>

      {/* Popular Topics */}
      <div className="mt-12 text-center">
        <h3 className="text-xs font-bold text-slate-400 tracking-[0.2em] uppercase mb-4">Popular Topics</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { label: 'Data Science', val: 'Data Science' },
            { label: 'Kaggle Intro', val: 'Introduction to Kaggle' },
            { label: 'React JS', val: 'React JS' },
            { label: 'Quantum Physics', val: 'Quantum Physics' },
            { label: 'মুক্তিযুদ্ধ', val: 'History of 1971 Liberation War' }
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                  setTopic(item.val);
                  saveRecentSearch(item.val);
                  onCreate(item.val);
              }}
              className="px-5 py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-sm hover:border-primary-500 hover:text-primary-700 hover:shadow-md transition-all font-medium"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};