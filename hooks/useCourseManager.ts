import { useState, useEffect, useCallback } from 'react';
import { Course, CourseModule, Quiz, AgentState, Log } from '../types';
import * as GeminiService from '../services/geminiService';

const STORAGE_KEY = 'shikho-ai-course-state-v2';

export const useCourseManager = () => {
  const [topic, setTopic] = useState('');
  const [course, setCourse] = useState<Course | null>(null);
  const [activeModule, setActiveModule] = useState<CourseModule | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  
  const [agentState, setAgentState] = useState<AgentState>(AgentState.IDLE);
  const [logs, setLogs] = useState<Log[]>([]);
  
  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.course) setCourse(parsed.course);
        // Note: We don't restore logs or transient states to keep start fresh
      } catch (e) {
        console.warn("Failed to restore state", e);
      }
    }
  }, []);

  useEffect(() => {
    if (course) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ course }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [course]);

  // Logging Helper
  const addLog = useCallback((source: Log['source'], message: string) => {
    setLogs(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      timestamp: new Date(),
      source,
      message
    }]);
  }, []);

  // Actions
  const createCourse = useCallback(async (inputTopic: string) => {
    setTopic(inputTopic);
    setAgentState(AgentState.RESEARCHING);
    setLogs([]); // Clear previous logs
    
    addLog('User', `Requested course on: "${inputTopic}"`);
    addLog('Agent', 'Initializing Research Agent...');
    addLog('System', 'Connecting to Gemini 3 Pro (Reasoning Model)...');

    try {
      addLog('Agent', 'Searching for high-quality syllabi and resources...');
      const generatedCourse = await GeminiService.generateCourseSyllabus(inputTopic);
      
      addLog('System', `Grounding check passed. Found ${generatedCourse.sources.length} sources.`);
      addLog('Agent', `Structure generated with ${generatedCourse.modules.length} modules.`);
      
      setCourse(generatedCourse);
      setAgentState(AgentState.IDLE);
    } catch (error: any) {
      addLog('System', `Error: ${error.message}`);
      setAgentState(AgentState.ERROR);
    }
  }, [addLog]);

  const selectModule = useCallback(async (module: CourseModule) => {
    setActiveModule(module);
    
    if (!module.content) {
      setAgentState(AgentState.WRITING);
      addLog('Agent', `Drafting content for module: ${module.title}...`);
      
      try {
        if (!course) throw new Error("No course active");
        const content = await GeminiService.generateModuleContent(course.topic, module);
        
        // Update module with content
        const updatedModule = { ...module, content };
        setActiveModule(updatedModule);
        
        // Update course state
        setCourse(prev => {
          if (!prev) return null;
          return {
            ...prev,
            modules: prev.modules.map(m => m.id === module.id ? updatedModule : m)
          };
        });
        
        addLog('Agent', 'Lesson content generated and translated.');
        setAgentState(AgentState.IDLE);
      } catch (error) {
        addLog('System', 'Failed to generate content.');
        setAgentState(AgentState.ERROR);
      }
    }
  }, [course, addLog]);

  const startQuiz = useCallback(async () => {
    if (!activeModule || !activeModule.content) return;
    
    setAgentState(AgentState.EXAMINING);
    addLog('Agent', 'Analyzing lesson content to generate quiz...');
    
    try {
      const quiz = await GeminiService.generateQuiz(activeModule.title, activeModule.content);
      setActiveQuiz({ ...quiz, moduleId: activeModule.id });
      addLog('Agent', 'Quiz ready.');
      setAgentState(AgentState.IDLE);
    } catch (error) {
      addLog('System', 'Quiz generation failed.');
      setAgentState(AgentState.ERROR);
    }
  }, [activeModule, addLog]);

  const completeModule = useCallback(() => {
    if (!activeModule || !course) return;
    
    const isFirstTimeComplete = !activeModule.isCompleted;
    
    const updatedModules = course.modules.map(m => 
      m.id === activeModule.id ? { ...m, isCompleted: true } : m
    );
    
    // Unlock next module
    const currentIndex = course.modules.findIndex(m => m.id === activeModule.id);
    if (currentIndex < course.modules.length - 1) {
      updatedModules[currentIndex + 1].isLocked = false;
    }

    setCourse(prev => prev ? ({
      ...prev,
      modules: updatedModules,
      completedModules: isFirstTimeComplete ? prev.completedModules + 1 : prev.completedModules
    }) : null);

    setActiveModule(null);
    setActiveQuiz(null);
    addLog('System', `Module "${activeModule.title}" marked as complete.`);
  }, [course, activeModule, addLog]);

  const resetCourse = useCallback(() => {
    setCourse(null);
    setActiveModule(null);
    setActiveQuiz(null);
    setTopic('');
    setLogs([]);
    setAgentState(AgentState.IDLE);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const exportCourseToMarkdown = useCallback(() => {
    if (!course) return;
    
    let md = `# ${course.title}\n\n${course.description}\n\n`;
    course.modules.forEach((m, i) => {
      md += `## Module ${i+1}: ${m.title}\n`;
      md += `*${m.originalTitle}*\n\n`;
      if (m.content) {
        md += m.content + '\n\n---\n\n';
      } else {
        md += `(Content not generated yet)\n\n`;
      }
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${course.topic.replace(/\s+/g, '_')}_Course.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    addLog('System', 'Course exported to Markdown.');
  }, [course, addLog]);

  return {
    topic,
    setTopic,
    agentState,
    course,
    activeModule,
    setActiveModule,
    isLoadingContent: agentState === AgentState.WRITING,
    activeQuiz,
    setActiveQuiz,
    logs,
    createCourse,
    selectModule,
    startQuiz,
    completeModule,
    resetCourse,
    exportCourseToMarkdown
  };
};
