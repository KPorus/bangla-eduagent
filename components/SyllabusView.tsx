import React from 'react';
import { Course, CourseModule } from '../types';

interface SyllabusViewProps {
  course: Course;
  onSelectModule: (module: CourseModule) => void;
}

const SyllabusView: React.FC<SyllabusViewProps> = ({ course, onSelectModule }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
        <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-indigo-100 text-lg opacity-90">{course.description}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium opacity-75">
             {course.sources.length > 0 && <span>Sources: {course.sources.map(s => {
               try { return new URL(s).hostname } catch { return s }
             }).join(', ')}</span>}
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Course Syllabus</h2>
            <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
              {course.modules.length} Modules
            </span>
          </div>

          <div className="space-y-4">
            {course.modules.map((module, idx) => (
              <div 
                key={module.id}
                onClick={() => onSelectModule(module)}
                className="group border border-slate-200 rounded-xl p-5 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer bg-white"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {idx + 1}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mb-1">{module.originalTitle}</p>
                    <p className="text-slate-600 text-sm">{module.description}</p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {module.duration}
                      </span>
                      <span className="font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        Start Lesson &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyllabusView;
