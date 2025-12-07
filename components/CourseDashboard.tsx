import React from 'react';
import { Course, CourseModule } from '../types';
import { BookOpen, CheckCircle, Lock, PlayCircle, BarChart3, Award, Link, ExternalLink } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface CourseDashboardProps {
  course: Course;
  onSelectModule: (module: CourseModule) => void;
  activeModuleId?: string;
}

export const CourseDashboard: React.FC<CourseDashboardProps> = ({ course, onSelectModule, activeModuleId }) => {
  
  const completionPercentage = Math.round((course.completedModules / course.totalModules) * 100) || 0;

  const chartData = [
    { name: 'Completed', value: course.completedModules },
    { name: 'Remaining', value: course.totalModules - course.completedModules },
  ];
  
  const COLORS = ['#0F9D58', '#E5E7EB'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in pb-10">
      {/* Sidebar / Stats */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 font-bengali border-b pb-3">আপনার অগ্রগতি (Your Progress)</h2>
          
          <div className="h-52 relative">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-extrabold text-gray-800">{completionPercentage}%</span>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide mt-1">Done</span>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
             <div className="flex flex-col items-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                <BarChart3 size={20} className="text-blue-600 mb-1" />
                <span className="text-2xl font-bold text-blue-900">{course.totalModules}</span>
                <span className="text-xs text-blue-600 font-medium">Modules</span>
             </div>
             <div className="flex flex-col items-center p-3 bg-green-50 rounded-xl border border-green-100">
                <Award size={20} className="text-green-600 mb-1" />
                <span className="text-2xl font-bold text-green-900">{course.completedModules}</span>
                <span className="text-xs text-green-600 font-medium">Completed</span>
             </div>
          </div>

           {course.sources && course.sources.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-800 mb-3">
                        <Link size={16} />
                        <span className="text-sm font-bold">Recommended Resources</span>
                    </div>
                    <ul className="space-y-2">
                        {course.sources.slice(0, 4).map((url, idx) => (
                            <li key={idx} className="text-sm">
                                <a 
                                    href={url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="group flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-primary transition-colors border border-transparent hover:border-gray-200"
                                >
                                    <span className="truncate max-w-[85%]">{new URL(url).hostname.replace('www.', '')}</span>
                                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
             )}
        </div>

        <div className="bg-gradient-to-br from-primary to-green-700 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Award size={100} />
            </div>
            <h3 className="font-bold text-lg mb-2 font-bengali z-10 relative">কোর্স সার্টিফিকেট</h3>
            <p className="text-green-100 text-sm mb-4 font-bengali z-10 relative leading-relaxed">
              সবগুলো মডিউল সম্পন্ন করার পর আপনি আপনার দক্ষতা যাচাই করতে পারবেন।
            </p>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden z-10 relative">
                <div 
                  className="bg-white h-full transition-all duration-700 ease-out" 
                  style={{ width: `${completionPercentage}%` }}
                />
            </div>
        </div>
      </div>

      {/* Main Module List */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
          <div className="p-8 border-b border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold tracking-wide mb-3">COURSE SYLLABUS</span>
            <h1 className="text-3xl font-bold text-gray-900 font-bengali mb-3 leading-tight">{course.title}</h1>
            <p className="text-gray-600 font-bengali text-lg leading-relaxed">{course.description}</p>
          </div>
          
          <div className="divide-y divide-gray-100 flex-1">
            {course.modules.map((module, index) => {
              const isActive = module.id === activeModuleId;
              const isLocked = module.isLocked;

              return (
                <div 
                  key={module.id} 
                  className={`p-6 transition-all duration-200 group ${
                    isActive ? 'bg-blue-50/60' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-5">
                    <div className="mt-1 shrink-0">
                      {module.isCompleted ? (
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                           <CheckCircle size={20} className="fill-current" />
                        </div>
                      ) : isLocked ? (
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                           <Lock size={18} />
                        </div>
                      ) : (
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold text-sm transition-colors ${
                             isActive ? 'border-blue-500 text-blue-600 bg-white' : 'border-gray-300 text-gray-500 bg-white'
                         }`}>
                           {isActive ? <PlayCircle size={20} className="fill-blue-50 text-blue-600" /> : index + 1}
                         </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-1">
                        <h3 className={`font-bold text-lg font-bengali group-hover:text-primary transition-colors ${
                            module.isCompleted ? 'text-gray-800' : isActive ? 'text-blue-700' : 'text-gray-700'
                        }`}>
                          {module.title}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 whitespace-nowrap shrink-0">
                          {module.duration}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2 font-medium">{module.originalTitle}</p>
                      <p className="text-gray-600 text-sm font-bengali line-clamp-2 leading-relaxed">
                        {module.description}
                      </p>
                      
                      {!isLocked && (
                        <div className={`mt-4 overflow-hidden transition-all duration-300 ${isActive ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100'}`}>
                            <button
                            onClick={() => onSelectModule(module)}
                            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all font-bengali shadow-sm ${
                                isActive 
                                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                : 'bg-white border border-gray-300 text-gray-700 hover:border-primary hover:text-primary'
                            }`}
                            >
                            {module.isCompleted ? 'রিভিউ করুন (Review)' : isActive ? 'পড়া চালিয়ে যান (Continue)' : 'শুরু করুন (Start Lesson)'}
                            </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};