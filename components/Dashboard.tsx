import React from 'react';
import { Course } from '../types';
import { CourseCard } from './CourseCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DashboardProps {
  courses: Course[];
  onSelectCourse: (id: string) => void;
  onDeleteCourse: (id: string) => void;
  onNewCourse: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ courses, onSelectCourse, onDeleteCourse, onNewCourse }) => {
  const chartData = courses.map(c => ({
    name: c.title.substring(0, 10) + '...',
    progress: Math.round((c.completedModules / c.totalModules) * 100) || 0,
    isCompleted: c.completedModules === c.totalModules && c.totalModules > 0
  }));

  // Using Tailwind config colors for charts
  const colorPrimary500 = '#22c55e';
  const colorPrimary600 = '#16a34a';
  const colorGold = '#f59e0b'; // amber-500

  const handleCelebrate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#fbbf24', '#3b82f6', '#f472b6']
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-800">My Learning Path</h1>
           <p className="text-slate-500 mt-1">Track your progress across generated courses.</p>
        </div>
        <button 
           onClick={onNewCourse}
           className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-primary-600/20 flex items-center gap-2"
        >
          <Plus size={20} />
          Create New Course
        </button>
      </div>

      {courses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onClick={onSelectCourse} 
                onDelete={onDeleteCourse}
                onCelebrate={course.completedModules === course.totalModules && course.totalModules > 0 ? handleCelebrate : undefined}
              />
            ))}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Learning Analytics</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} unit="%" />
                  <Tooltip 
                     cursor={{fill: '#f0fdf4'}}
                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="progress" radius={[4, 4, 0, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isCompleted ? colorGold : (entry.progress === 100 ? colorPrimary500 : colorPrimary600)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
             <Plus size={32} />
           </div>
           <h3 className="text-xl font-semibold text-slate-800 mb-2">No courses yet</h3>
           <p className="text-slate-500 max-w-sm mx-auto mb-8">Start your learning journey by generating a personalized course powered by Gemini AI.</p>
           <button 
             onClick={onNewCourse}
             className="text-primary-600 font-semibold hover:text-primary-700 hover:underline"
           >
             Generate your first course
           </button>
        </div>
      )}
    </div>
  );
};