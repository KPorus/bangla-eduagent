import React from 'react';
import { Course, CourseModule } from '../types';
import { BookOpen, CheckCircle, Lock, Play, Clock, Globe } from 'lucide-react';

interface CourseDashboardProps {
  course: Course;
  onSelectModule: (module: CourseModule) => void;
}

export const CourseDashboard: React.FC<CourseDashboardProps> = ({ course, onSelectModule }) => {
  return (
    <div className="max-w-4xl mx-auto animate-slide-up">
      {/* Course Header */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 -mr-10 -mt-10 bg-green-50 rounded-full opacity-50 blur-3xl w-64 h-64 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3 font-bengali">{course.title}</h1>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">{course.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-gray-500">
                <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                  <BookOpen size={16} />
                  {course.modules.length} Modules
                </span>
                {course.sources.length > 0 && (
                   <span className="flex items-center gap-1.5" title="Grounded in real-world data">
                     <Globe size={16} />
                     Based on {course.sources.length} sources
                   </span>
                )}
              </div>
            </div>
            
            {/* Progress Ring (Visual Only for now) */}
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20">
                 <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="3"
                      strokeDasharray={`${(course.completedModules / course.totalModules) * 100}, 100`}
                      className="transition-all duration-1000 ease-out"
                    />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center font-bold text-sm text-gray-700">
                    {Math.round((course.completedModules / course.totalModules) * 100)}%
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 px-2">Learning Path</h2>
        {course.modules.map((module, index) => (
          <div 
            key={module.id}
            onClick={() => !module.isLocked && onSelectModule(module)}
            className={`group relative bg-white border border-gray-200 rounded-xl p-5 transition-all
              ${module.isLocked 
                ? 'opacity-70 cursor-not-allowed bg-gray-50' 
                : 'hover:shadow-md hover:border-green-200 cursor-pointer'
              }
              ${module.isCompleted ? 'border-l-4 border-l-primary' : ''}
            `}
          >
            <div className="flex items-start gap-4">
              <div className={`
                flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                ${module.isCompleted 
                  ? 'bg-green-100 text-green-700' 
                  : module.isLocked 
                    ? 'bg-gray-200 text-gray-500' 
                    : 'bg-blue-50 text-blue-600 group-hover:bg-primary group-hover:text-white transition-colors'
                }
              `}>
                {module.isCompleted ? <CheckCircle size={24} /> : (index + 1)}
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className={`text-lg font-bold font-bengali ${module.isLocked ? 'text-gray-500' : 'text-gray-900'}`}>
                    {module.title}
                  </h3>
                  {module.isLocked && <Lock size={16} className="text-gray-400" />}
                </div>
                
                <p className="text-sm text-gray-500 mb-1">{module.originalTitle}</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">{module.description}</p>
                
                <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {module.duration}
                  </span>
                  
                  {!module.isLocked && !module.isCompleted && (
                    <span className="text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Start Lesson <Play size={12} fill="currentColor" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
