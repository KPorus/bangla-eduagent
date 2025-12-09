import { useState, useEffect, useCallback, useRef } from 'react';
import { Course, CourseModule } from '../types';
import { generateCourseSyllabus, generateModuleContent } from '../services/geminiService';

const STORAGE_KEY = 'bangla_edu_agent_courses';

export const useCourseManager = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Track loading state for specific modules to allow granular UI updates
  const [loadingModules, setLoadingModules] = useState<Set<string>>(new Set());
  
  // Ref to track in-flight requests to prevent duplicate calls
  const fetchingIds = useRef<Set<string>>(new Set());

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCourses(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load courses", e);
        // Don't show an error to the user for cache issues, just start fresh
      }
    }
  }, []);

  // Save to local storage whenever courses change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  }, [courses]);

  const clearError = useCallback(() => setError(null), []);

  const createCourse = useCallback(async (topic: string) => {
    setLoading(true);
    setError(null);
    try {
      const syllabus = await generateCourseSyllabus(topic);
      
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        topic,
        title: syllabus.title || topic,
        description: syllabus.description || "Generated Course",
        thumbnailUrl: `https://picsum.photos/seed/${encodeURIComponent(topic)}/400/200`,
        createdAt: Date.now(),
        totalModules: syllabus.modules?.length || 0,
        completedModules: 0,
        modules: syllabus.modules as CourseModule[],
        groundingUrls: syllabus.groundingUrls
      };

      setCourses(prev => [newCourse, ...prev]);
      return newCourse.id;
    } catch (err: any) {
      setError(err.message || "Failed to create course. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadModuleContent = useCallback(async (courseId: string, moduleId: string, isBackground = false) => {
    const requestKey = `${courseId}:${moduleId}`;

    // Prevent duplicate requests for the same module
    if (fetchingIds.current.has(requestKey)) return;

    // Find course and module to validate and get context
    // We access courses from state directly here; beware of closure staleness if not careful,
    // but fetchingIds prevents re-entry so it's safer.
    const courseIndex = courses.findIndex(c => c.id === courseId);
    if (courseIndex === -1) return;

    const moduleIndex = courses[courseIndex].modules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) return;

    const module = courses[courseIndex].modules[moduleIndex];

    // If content already exists, don't regenerate
    if (module.content) return;

    // Start tracking
    fetchingIds.current.add(requestKey);
    setLoadingModules(prev => {
      const next = new Set(prev);
      next.add(moduleId);
      return next;
    });

    if (!isBackground) {
      setError(null);
      // We don't set global loading=true here anymore to avoid blocking the whole UI.
      // Instead we rely on loadingModules state and component logic.
    }

    try {
      const data = await generateModuleContent(
        courses[courseIndex].title,
        module.title,
        module.description
      );

      setCourses(prevCourses => {
        const cIndex = prevCourses.findIndex(c => c.id === courseId);
        if (cIndex === -1) return prevCourses;

        const updatedCourses = [...prevCourses];
        const mIndex = updatedCourses[cIndex].modules.findIndex(m => m.id === moduleId);
        
        if (mIndex === -1) return prevCourses;

        const updatedModule = {
          ...updatedCourses[cIndex].modules[mIndex],
          content: data.content,
          quiz: data.quiz,
          groundingUrls: data.groundingUrls
        };
        
        // Deep copy modules array
        const newModules = [...updatedCourses[cIndex].modules];
        newModules[mIndex] = updatedModule;
        
        updatedCourses[cIndex] = {
          ...updatedCourses[cIndex],
          modules: newModules
        };

        return updatedCourses;
      });

    } catch (err: any) {
      console.error(err);
      if (!isBackground) {
        setError(err.message || "Failed to load module content. Please check your connection.");
      }
    } finally {
      fetchingIds.current.delete(requestKey);
      setLoadingModules(prev => {
        const next = new Set(prev);
        next.delete(moduleId);
        return next;
      });
    }
  }, [courses]);

  const markModuleComplete = useCallback((courseId: string, moduleId: string) => {
    setCourses(prev => prev.map(course => {
      if (course.id !== courseId) return course;

      const updatedModules = course.modules.map(m => {
        if (m.id === moduleId) return { ...m, isCompleted: true };
        return m;
      });

      const completedCount = updatedModules.filter(m => m.isCompleted).length;

      return {
        ...course,
        modules: updatedModules,
        completedModules: completedCount
      };
    }));
  }, []);

  const deleteCourse = useCallback((courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
  }, []);

  const isModuleLoading = useCallback((moduleId: string) => loadingModules.has(moduleId), [loadingModules]);

  return {
    courses,
    loading,
    isModuleLoading,
    error,
    clearError,
    createCourse,
    loadModuleContent,
    markModuleComplete,
    deleteCourse
  };
};