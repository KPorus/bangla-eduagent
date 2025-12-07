import React, { useState } from 'react';
import { CourseModule, Quiz } from '../types';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, BookOpen, CheckCircle, BrainCircuit } from 'lucide-react';

interface ModuleViewerProps {
  module: CourseModule;
  onBack: () => void;
  onComplete: () => void;
  onStartQuiz: () => void;
  isLoading: boolean;
}

export const ModuleViewer: React.FC<ModuleViewerProps> = ({ 
  module, 
  onBack, 
  onComplete, 
  onStartQuiz,
  isLoading 
}) => {
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <BookOpen className="absolute inset-0 m-auto text-primary" size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 font-bengali mb-2">পাঠ প্রস্তুত করা হচ্ছে...</h3>
        <p className="text-gray-500">Generating personalized content in Bengali</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-100 p-4 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-bold text-gray-800 font-bengali truncate max-w-md">
          {module.title}
        </h2>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 lg:p-10 max-w-4xl mx-auto w-full">
        <article className="prose prose-slate lg:prose-lg max-w-none prose-headings:font-bengali prose-p:font-bengali prose-li:font-bengali">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-gray-900 mb-6" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 border-b pb-2" {...props} />,
              p: ({node, ...props}) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
              code: ({node, className, children, ...props}) => {
                const match = /language-(\w+)/.exec(className || '')
                return match ? (
                  <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto text-sm text-gray-100 font-mono shadow-md">
                    {children}
                  </div>
                ) : (
                  <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {module.content || ''}
          </ReactMarkdown>
        </article>
      </div>

      {/* Footer / Actions */}
      <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-4 rounded-b-xl">
         {!module.isCompleted && (
           <button
            onClick={onStartQuiz}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-secondary text-secondary font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-sm font-bengali"
           >
             <BrainCircuit size={20} />
             কুইজ দিন (Take Quiz)
           </button>
         )}
         
         <button
           onClick={onComplete}
           disabled={module.isCompleted}
           className={`flex items-center gap-2 px-6 py-3 font-bold rounded-lg transition-all shadow-md font-bengali ${
             module.isCompleted 
              ? 'bg-green-100 text-green-700 cursor-default'
              : 'bg-primary text-white hover:bg-green-700 hover:shadow-lg'
           }`}
         >
           <CheckCircle size={20} />
           {module.isCompleted ? 'সম্পন্ন হয়েছে (Completed)' : 'সম্পন্ন করুন (Mark as Done)'}
         </button>
      </div>
    </div>
  );
};
