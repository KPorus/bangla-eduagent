import React from 'react';
import { LayoutDashboard, PlusCircle, GraduationCap } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onNavigate: (view: any) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate }) => {
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 z-20 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-50">
          <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-600/20">
            <GraduationCap size={22} />
          </div>
          <span className="font-bold text-lg text-slate-800 tracking-tight">Bangla EduAgent</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-2">
          <button
            onClick={() => onNavigate('DASHBOARD')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              activeView === 'DASHBOARD' 
                ? 'bg-primary-50 text-primary-700 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => onNavigate('GENERATOR')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              activeView === 'GENERATOR' 
                ? 'bg-primary-50 text-primary-700 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <PlusCircle size={20} />
            <span>New Course</span>
          </button>
        </nav>

        <div className="p-6 border-t border-slate-100 text-xs text-slate-400">
          <p className="font-semibold text-slate-500 mb-1">Powered by</p>
          <p>Gemini 3 Pro</p>
          <p className="mt-4">&copy; 2025 EduAgent</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
};