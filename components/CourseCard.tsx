import React from 'react';
import { Course } from '../types';
import { PlayCircle, CheckCircle2, Trash2, Award, Sparkles } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
  onCelebrate?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onClick, onDelete, onCelebrate }) => {
  const progress = Math.round((course.completedModules / course.totalModules) * 100) || 0;
  const isCompleted = progress === 100 && course.totalModules > 0;

  return (
    <div 
      className={`group relative bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer ${
        isCompleted ? 'border-amber-200 ring-1 ring-amber-100' : 'border-slate-200'
      }`}
      onClick={() => onClick(course.id)}
    >
      <div className="h-40 overflow-hidden relative">
        <img 
          src={course.thumbnailUrl} 
          alt={course.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-5">
          <h3 className="text-white font-bengali font-bold text-xl line-clamp-2 leading-snug">{course.title}</h3>
        </div>
        
        {/* Completed Badge */}
        {isCompleted && (
          <div className="absolute top-3 right-3 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 border border-amber-200">
            <Award size={14} />
            Certified
          </div>
        )}
      </div>
      
      <div className="p-5">
        <p className="text-slate-500 text-sm mb-5 line-clamp-2 font-bengali h-10">{course.description}</p>
        
        <div className="space-y-3">
          <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Progress</span>
            <span className={isCompleted ? 'text-amber-600' : (progress > 0 ? 'text-primary-600' : '')}>{progress}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-amber-500' : 'bg-primary-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
              <span className={`p-1.5 rounded-full ${isCompleted ? 'bg-amber-100' : 'bg-slate-100'}`}>
                {isCompleted ? <CheckCircle2 size={16} className="text-amber-600" /> : <PlayCircle size={16} />}
              </span>
              <span>{course.totalModules} Modules</span>
            </div>
            
            <div className="flex items-center gap-1">
              {isCompleted && onCelebrate && (
                 <button
                   onClick={(e) => {
                     e.stopPropagation();
                     onCelebrate();
                   }}
                   className="text-amber-400 hover:text-amber-600 hover:bg-amber-50 transition-all p-2 rounded-lg"
                   title="Celebrate!"
                 >
                   <Sparkles size={18} />
                 </button>
              )}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(course.id);
                }}
                className="text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all p-2 rounded-lg"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};