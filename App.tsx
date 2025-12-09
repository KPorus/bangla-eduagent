import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { CourseGenerator } from './components/CourseGenerator';
import { CourseViewer } from './components/CourseViewer';
import { useCourseManager } from './hooks/useCourseManager';
import { ViewState } from './types';

const App: React.FC = () => {
  const { 
    courses, 
    loading, 
    isModuleLoading,
    error,
    clearError,
    createCourse, 
    loadModuleContent, 
    markModuleComplete,
    deleteCourse 
  } = useCourseManager();

  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

  const handleCreateCourse = async (topic: string) => {
    const newCourseId = await createCourse(topic);
    if (newCourseId) {
      setActiveCourseId(newCourseId);
      setCurrentView('COURSE_VIEW');
    }
  };

  const handleSelectCourse = (id: string) => {
    setActiveCourseId(id);
    setCurrentView('COURSE_VIEW');
  };

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    clearError(); // Clear errors when changing views
  };

  const activeCourse = courses.find(c => c.id === activeCourseId);

  return (
    <Layout activeView={currentView} onNavigate={handleNavigate}>
      {currentView === 'DASHBOARD' && (
        <Dashboard 
          courses={courses} 
          onSelectCourse={handleSelectCourse}
          onDeleteCourse={deleteCourse}
          onNewCourse={() => setCurrentView('GENERATOR')}
        />
      )}

      {currentView === 'GENERATOR' && (
        <CourseGenerator 
          onCreate={handleCreateCourse} 
          loading={loading}
          error={error}
          onClearError={clearError}
        />
      )}

      {currentView === 'COURSE_VIEW' && activeCourse && (
        <CourseViewer
          course={activeCourse}
          onBack={() => setCurrentView('DASHBOARD')}
          onLoadModule={loadModuleContent}
          onCompleteModule={markModuleComplete}
          loading={loading}
          isModuleLoading={isModuleLoading}
          error={error}
        />
      )}
    </Layout>
  );
};

export default App;