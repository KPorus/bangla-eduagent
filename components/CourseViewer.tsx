import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Course } from '../types';
import { ChevronLeft, ChevronRight, CheckCircle, BookOpen, ExternalLink, Loader2, Award } from 'lucide-react';
import { QuizComponent } from './QuizComponent';
import { ErrorBanner } from './ErrorBanner';

interface CourseViewerProps {
  course: Course;
  onBack: () => void;
  onLoadModule: (courseId: string, moduleId: string, isBackground?: boolean) => Promise<void>;
  onCompleteModule: (courseId: string, moduleId: string) => void;
  loading: boolean;
  isModuleLoading?: (moduleId: string) => boolean;
  error: string | null;
}

export const CourseViewer: React.FC<CourseViewerProps> = ({ 
  course, 
  onBack, 
  onLoadModule,
  onCompleteModule,
  loading, // Global loading
  isModuleLoading, // Specific module loading
  error
}) => {
  const [activeModuleId, setActiveModuleId] = useState<string>(course.modules[0].id);

  const activeModule = course.modules.find(m => m.id === activeModuleId);

  useEffect(() => {
    const loadContent = async () => {
        // 1. Load active module content if missing
        if (activeModuleId && !activeModule?.content && !error) {
            // isBackground defaults to false
            await onLoadModule(course.id, activeModuleId);
        }

        // 2. Background Preloading: Load the NEXT module silently
        const currentIndex = course.modules.findIndex(m => m.id === activeModuleId);
        if (currentIndex !== -1 && currentIndex < course.modules.length - 1) {
            const nextModule = course.modules[currentIndex + 1];
            // If next module doesn't have content, load it in background
            if (!nextModule.content) {
                onLoadModule(course.id, nextModule.id, true);
            }
        }
    };

    loadContent();
  }, [activeModuleId, course.id, activeModule?.content, error, course.modules]);

  const handleRetry = () => {
    onLoadModule(course.id, activeModuleId);
  };

  if (!activeModule) return null;

  // Determine if the *current* module is loading
  const isCurrentLoading = loading || (isModuleLoading ? isModuleLoading(activeModuleId) : false);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] -m-6 md:-m-8">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <ChevronLeft />
          </button>
          <div>
            <h1 className="text-xl font-bold font-bengali text-slate-800">{course.title}</h1>
            <p className="text-xs text-slate-500 uppercase tracking-wider">
              Module {course.modules.findIndex(m => m.id === activeModuleId) + 1} of {course.modules.length}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Module List Sidebar */}
        <div className="w-80 bg-slate-50 border-r border-slate-200 hidden lg:flex flex-col">
          {/* Progress Summary Section */}
          <div className="mt-[2rem] p-5 border-b border-slate-200 bg-white/50 backdrop-blur-sm">
             <h3 className="font-bold text-slate-800 mb-2 text-sm font-bengali flex items-center gap-2">
               <Award size={16} className="text-primary-600" />
               কোর্স অগ্রগতি (Progress)
             </h3>
             <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
               <span>{course.completedModules} / {course.totalModules} Completed</span>
               <span className="text-primary-700">{Math.round((course.completedModules / course.totalModules) * 100)}%</span>
             </div>
             <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-100">
               <div 
                 className={`h-full rounded-full transition-all duration-500 ${course.completedModules === course.totalModules ? 'bg-amber-500' : 'bg-primary-500'}`}
                 style={{ width: `${(course.completedModules / course.totalModules) * 100}%` }}
               ></div>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {course.modules.map((module, idx) => (
              <button
                key={module.id}
                onClick={() => setActiveModuleId(module.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  activeModuleId === module.id
                    ? 'bg-white border-primary-500 shadow-md ring-1 ring-primary-500/20'
                    : 'bg-white border-slate-200 hover:border-primary-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    module.isCompleted ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {module.isCompleted ? <CheckCircle size={14} /> : idx + 1}
                  </span>
                  <div>
                    <h3 className={`font-bengali text-sm font-semibold ${
                      activeModuleId === module.id ? 'text-primary-700' : 'text-slate-700'
                    }`}>
                      {module.title}
                    </h3>
                    {/* Visual indicator for background loading */}
                    {isModuleLoading && isModuleLoading(module.id) && activeModuleId !== module.id && (
                        <span className="text-[10px] text-primary-500 animate-pulse flex items-center gap-1 mt-1">
                            <Loader2 size={10} className="animate-spin" /> Loading...
                        </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-white p-6 md:p-10 scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* Module Header */}
            <div className="pb-6 border-b border-slate-100">
               <h2 className="text-3xl font-bold text-slate-900 font-bengali mb-4">{activeModule.title}</h2>
               <p className="text-lg text-slate-600 font-bengali leading-relaxed">{activeModule.description}</p>
            </div>

            {/* Error State */}
            {error && !activeModule.content && (
              <ErrorBanner 
                message={error} 
                onRetry={handleRetry} 
                className="my-8"
              />
            )}

            {/* Content Body */}
            {isCurrentLoading && !activeModule.content ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="animate-spin text-primary-500 w-12 h-12" />
                <p className="text-slate-500 animate-pulse">Generative AI is writing this module...</p>
              </div>
            ) : activeModule.content ? (
              <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bengali prose-p:font-bengali prose-li:font-bengali prose-a:text-primary-600 hover:prose-a:text-primary-700">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code: ({node, className, children, ...props}) => {
                      const match = /language-(\w+)/.exec(className || '')
                      return (
                        <code className={`${className} bg-slate-100 text-primary-700 px-1.5 py-0.5 rounded text-sm font-mono`} {...props}>
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {activeModule.content}
                </ReactMarkdown>

                {/* Grounding Sources */}
                {activeModule.groundingUrls && activeModule.groundingUrls.length > 0 && (
                   <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100 not-prose">
                      <h4 className="text-sm font-bold uppercase text-slate-500 mb-3 flex items-center gap-2">
                        <BookOpen size={16} /> Sources
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {activeModule.groundingUrls.map((url, i) => (
                          <a 
                            key={i} 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:bg-primary-50 hover:text-primary-700 transition-colors truncate max-w-[200px]"
                          >
                             <ExternalLink size={10} />
                             {new URL(url).hostname}
                          </a>
                        ))}
                      </div>
                   </div>
                )}
              </div>
            ) : null}

            {/* Quiz Section */}
            {!isCurrentLoading && activeModule.content && activeModule.quiz && (
              <div className="mt-12 pt-8 border-t border-slate-200">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 font-bengali">
                  <span className="bg-primary-100 p-2 rounded-lg text-primary-700"><CheckCircle /></span>
                  মূল্যায়ন (Quiz)
                </h3>
                {activeModule.isCompleted ? (
                   <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 text-center">
                      <p className="text-primary-800 font-semibold text-lg">Module Completed!</p>
                      <button 
                        onClick={() => {
                          const currIdx = course.modules.findIndex(m => m.id === activeModuleId);
                          if (currIdx < course.modules.length - 1) {
                            setActiveModuleId(course.modules[currIdx + 1].id);
                          } else {
                            onBack();
                          }
                        }}
                        className="mt-4 text-sm font-bold text-primary-700 hover:underline flex items-center justify-center gap-1"
                      >
                        Next Module <ChevronRight size={16} />
                      </button>
                   </div>
                ) : (
                  <QuizComponent 
                    questions={activeModule.quiz} 
                    onComplete={() => onCompleteModule(course.id, activeModuleId)} 
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};