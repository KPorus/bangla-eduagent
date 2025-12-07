import React from 'react';
import { CourseModule } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { ArrowLeft, CheckCircle, BrainCircuit, Loader2 } from 'lucide-react';

interface ModuleViewerProps {
  module: CourseModule;
  isLoading: boolean;
  onBack: () => void;
  onComplete: () => void; // Used if we want to allow manual complete without quiz
  onStartQuiz: () => void;
}

export const ModuleViewer: React.FC<ModuleViewerProps> = ({ 
  module, 
  isLoading, 
  onBack, 
  onStartQuiz 
}) => {
  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fade-in">
      {/* Navigation */}
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium px-4 md:px-0"
      >
        <ArrowLeft size={20} />
        Back to Syllabus
      </button>

      {/* Content Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-[60vh] overflow-hidden">
        
        {/* Header */}
        <div className="border-b border-gray-100 bg-gray-50/50 p-8">
          <div className="flex items-center gap-3 mb-2 text-sm text-gray-500 font-medium uppercase tracking-wider">
             <span>Module Lesson</span>
             <span className="w-1 h-1 rounded-full bg-gray-300"></span>
             <span>{module.duration}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-bengali">{module.title}</h1>
          <p className="text-lg text-gray-500 italic">{module.originalTitle}</p>
        </div>

        {/* Body */}
        <div className="p-8 md:p-12">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 size={48} className="text-primary animate-spin mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Creating your lesson...</h3>
              <p className="text-gray-500 max-w-sm mt-2">
                Our AI agent is writing a custom tutorial in Bangla explaining <span className="font-medium text-gray-700">{module.originalTitle}</span>.
              </p>
            </div>
          ) : (
            <div className="animate-fade-in">
              <MarkdownRenderer content={module.content || ''} />
              
              {/* Actions */}
              <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col items-center">
                <p className="text-gray-500 mb-6 text-center">Ready to test your knowledge?</p>
                <button
                  onClick={onStartQuiz}
                  className="bg-primary hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3"
                >
                  <BrainCircuit size={24} />
                  Take Quiz & Complete Module
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
