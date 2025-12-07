import React from 'react';
import { AgentState } from './types';
import { useCourseManager } from './hooks/useCourseManager';
import { AgentTerminal } from './components/AgentTerminal';
import { CourseDashboard } from './components/CourseDashboard';
import { ModuleViewer } from './components/ModuleViewer';
import { QuizModal } from './components/QuizModal';
import { VoiceInput } from './components/VoiceInput';
import { Sparkles, Search, GraduationCap, Download } from 'lucide-react';

function App() {
  const {
    topic,
    setTopic,
    agentState,
    course,
    activeModule,
    setActiveModule,
    isLoadingContent,
    activeQuiz,
    setActiveQuiz,
    logs,
    createCourse,
    selectModule,
    startQuiz,
    completeModule,
    resetCourse,
    exportCourseToMarkdown
  } = useCourseManager();

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    createCourse(topic);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={resetCourse} role="button">
            <div className="bg-primary text-white p-1.5 rounded-lg shadow-sm">
                <GraduationCap size={24} />
            </div>
            <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900">Bangla EduAgent</h1>
                <p className="text-xs text-gray-500 hidden sm:block">AI-Powered Personalized Learning</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {course && (
              <>
                 <button
                   onClick={exportCourseToMarkdown}
                   className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                   title="Export to Markdown"
                 >
                   <Download size={16} />
                   Export
                 </button>
                 <button 
                   onClick={resetCourse}
                   className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                 >
                   New Course
                 </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* State: Initial Input */}
        {!course && agentState !== AgentState.RESEARCHING && (
          <div className="max-w-2xl mx-auto mt-16 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold mb-6 border border-green-100">
               <Sparkles size={12} />
               Powered by Gemini 3 Pro
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 font-bengali leading-tight">
              যেকোনো বিষয়ে শিখুন <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-600">মায়ের ভাষায়</span>
            </h2>
            <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto leading-relaxed">
              Enter a topic (e.g., "PyTorch Distillation", "History of Bengal") to generate a personalized course with quizzes.
            </p>
            
            <form onSubmit={handleCreateCourse} className="relative max-w-lg mx-auto group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                <Search className="text-white group-focus-within:text-primary" size={20} />
              </div>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What do you want to learn today?"
                className="bg-gray-700 text-white block w-full pl-12 pr-24 py-4 border-2 border-gray-200 rounded-2xl text-lg focus:ring-4 focus:ring-green-100 focus:border-primary transition-all shadow-sm outline-none placeholder:text-gray-300"
              />
              
              <VoiceInput onTranscript={(text) => setTopic(text)} />

              <button 
                type="submit"
                disabled={!topic.trim()}
                className="absolute right-2 top-2 bottom-2 bg-primary text-white px-5 rounded-xl font-medium hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
              >
                Start
              </button>
            </form>
            
            <div className="mt-10">
               <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">Popular Topics</p>
               <div className="flex flex-wrap justify-center gap-3">
                  {['Data Science', 'Kaggle Intro', 'React JS', 'Quantum Physics', 'মুক্তিযুদ্ধ'].map(t => (
                    <button 
                      key={t}
                      onClick={() => createCourse(t)}
                      className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-primary hover:text-primary hover:bg-green-50 transition-all"
                    >
                      {t}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* Global Agent Terminal */}
        {(agentState !== AgentState.IDLE || logs.length > 0) && !activeModule && (
          <AgentTerminal logs={logs} />
        )}

        {/* State: Course Dashboard */}
        {course && !activeModule && (
          <CourseDashboard 
            course={course} 
            onSelectModule={selectModule} 
          />
        )}

        {/* State: Module Viewer */}
        {activeModule && (
          <ModuleViewer 
            module={activeModule}
            isLoading={isLoadingContent}
            onBack={() => setActiveModule(null)}
            onComplete={completeModule}
            onStartQuiz={startQuiz}
          />
        )}
        
      </main>

      {/* Quiz Modal */}
      {activeQuiz && (
        <QuizModal 
          quiz={activeQuiz} 
          onClose={() => setActiveQuiz(null)} 
          onPass={completeModule}
        />
      )}
    </div>
  );
}

export default App;
