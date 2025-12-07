import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Course, CourseModule, AgentState, AgentLog, Quiz } from '../types';
import { generateCourseSyllabus, generateModuleContent, generateQuiz } from '../services/geminiService';

export const useCourseManager = () => {
  const [topic, setTopic] = useState('');
  const [agentState, setAgentState] = useState<AgentState>(AgentState.IDLE);
  const [course, setCourse] = useState<Course | null>(null);
  const [activeModule, setActiveModule] = useState<CourseModule | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [logs, setLogs] = useState<AgentLog[]>([]);

  // Persistence: Load from local storage on mount
  useEffect(() => {
    const savedCourse = localStorage.getItem('bangla_edu_course');
    if (savedCourse) {
      try {
        const parsed = JSON.parse(savedCourse);
        setCourse(parsed);
        setAgentState(AgentState.IDLE);
      } catch (e) {
        console.error("Failed to load saved course", e);
      }
    }
  }, []);

  // Persistence: Save to local storage on update
  useEffect(() => {
    if (course) {
      localStorage.setItem('bangla_edu_course', JSON.stringify(course));
    }
  }, [course]);

  const addLog = useCallback((agentName: AgentLog['agentName'], message: string) => {
    setLogs(prev => [...prev, {
      id: uuidv4(),
      agentName,
      message,
      timestamp: new Date()
    }]);
  }, []);

  const createCourse = async (inputTopic: string) => {
    if (!inputTopic.trim()) return;
    
    setTopic(inputTopic);
    setAgentState(AgentState.RESEARCHING);
    setCourse(null);
    setLogs([]);
    
    addLog('Orchestrator', `Received request for topic: "${inputTopic}"`);
    addLog('Scraper', `Initiating Google Search grounding for course syllabus...`);

    try {
      await new Promise(r => setTimeout(r, 800)); // UX delay
      
      addLog('Scraper', 'Found relevant resources. Parsing structure...');
      const generatedCourse = await generateCourseSyllabus(inputTopic);
      
      addLog('Orchestrator', 'Syllabus structure received.');
      addLog('Translator', 'Translated syllabus outline to Bengali.');
      
      setCourse(generatedCourse);
      setAgentState(AgentState.IDLE);
      addLog('Orchestrator', 'Dashboard ready.');

    } catch (error) {
      console.error(error);
      setAgentState(AgentState.ERROR);
      addLog('Orchestrator', 'Error: Failed to generate course structure.');
    }
  };

  const selectModule = async (module: CourseModule) => {
    setActiveModule(module);
    
    if (module.content) return;

    setIsLoadingContent(true);
    setAgentState(AgentState.TRANSLATING);
    addLog('Orchestrator', `User selected module: ${module.originalTitle}`);
    addLog('Translator', `Generating detailed Bengali content...`);

    try {
      // Ensure course is not null to satisfy TS, though logic dictates it exists here
      if (!course) throw new Error("No course context");

      const content = await generateModuleContent(course.topic, module);
      
      const updatedModule = { ...module, content };
      setActiveModule(updatedModule);
      
      setCourse(prev => {
        if (!prev) return null;
        return {
          ...prev,
          modules: prev.modules.map(m => m.id === module.id ? updatedModule : m)
        };
      });

      addLog('Translator', 'Content generation complete.');
    } catch (error) {
       addLog('Orchestrator', 'Error generating content.');
    } finally {
      setIsLoadingContent(false);
      setAgentState(AgentState.IDLE);
    }
  };

  const startQuiz = async () => {
    if (!activeModule || !activeModule.content) return;

    setAgentState(AgentState.QUIZZING);
    addLog('Orchestrator', `Generating quiz for ${activeModule.originalTitle}`);

    try {
        const quiz = await generateQuiz(activeModule.title, activeModule.content);
        setActiveQuiz({ ...quiz, moduleId: activeModule.id });
        addLog('Orchestrator', 'Quiz ready.');
    } catch (error) {
        addLog('Orchestrator', 'Error creating quiz.');
    } finally {
        setAgentState(AgentState.IDLE);
    }
  };

  const completeModule = () => {
    if (!course || !activeModule) return;

    const updatedModules = course.modules.map((m, idx) => {
      if (m.id === activeModule.id) {
        return { ...m, isCompleted: true };
      }
      const currentIdx = course.modules.findIndex(mod => mod.id === activeModule.id);
      if (idx === currentIdx + 1) {
        return { ...m, isLocked: false };
      }
      return m;
    });

    const completedCount = updatedModules.filter(m => m.isCompleted).length;

    setCourse({
      ...course,
      modules: updatedModules,
      completedModules: completedCount
    });

    setActiveModule(prev => prev ? { ...prev, isCompleted: true } : null);
    setActiveQuiz(null);
    setActiveModule(null); // Return to dashboard
  };

  const resetCourse = () => {
    setCourse(null);
    setActiveModule(null);
    setLogs([]);
    setTopic('');
    localStorage.removeItem('bangla_edu_course');
  };

  const exportCourseToMarkdown = () => {
    if (!course) return;
    
    let md = `# ${course.title}\n\n`;
    md += `${course.description}\n\n`;
    md += `Original Topic: ${course.topic}\n\n`;
    md += `---\n\n`;

    course.modules.forEach((mod, idx) => {
      md += `## Module ${idx + 1}: ${mod.title}\n`;
      md += `*(${mod.originalTitle})*\n\n`;
      md += `${mod.description}\n\n`;
      if (mod.content) {
        md += `${mod.content}\n\n`;
      } else {
        md += `*(Content not yet generated)*\n\n`;
      }
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${course.topic.replace(/\s+/g, '_')}_Course.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    topic,
    setTopic,
    agentState,
    course,
    activeModule,
    setActiveModule,
    isLoadingContent,
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