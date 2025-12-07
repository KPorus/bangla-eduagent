import React from 'react';
import { CourseModule } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface ModuleViewProps {
  module: CourseModule;
  onBack: () => void;
  onTakeQuiz: () => void;
  loadingQuiz: boolean;
}

const ModuleView: React.FC<ModuleViewProps> = ({ module, onBack, onTakeQuiz, loadingQuiz }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in pb-24">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium"
      >
        &larr; Back to Syllabus
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[60vh]">
        <div className="border-b border-slate-100 pb-6 mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{module.title}</h1>
          <p className="text-slate-500 text-lg">{module.originalTitle}</p>
        </div>

        <div className="prose prose-slate max-w-none prose-lg prose-headings:font-bold prose-a:text-indigo-600 hover:prose-a:text-indigo-500 prose-img:rounded-xl">
          <MarkdownRenderer content={module.content || ''} />
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
          <button
            onClick={onTakeQuiz}
            disabled={loadingQuiz}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
          >
            {loadingQuiz ? (
              <>Generating Quiz...</>
            ) : (
              <>
                <span>Take Quiz</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModuleView;
