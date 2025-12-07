export interface CourseModule {
  id: string;
  title: string;
  originalTitle: string;
  description: string;
  duration: string;
  isLocked: boolean;
  isCompleted: boolean;
  content?: string; // Markdown content
}

export interface Course {
  topic: string;
  title: string;
  description: string;
  modules: CourseModule[];
  totalModules: number;
  completedModules: number;
  sources: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  moduleId: string;
  questions: QuizQuestion[];
}

export enum AgentState {
  IDLE = 'IDLE',
  RESEARCHING = 'RESEARCHING',
  WRITING = 'WRITING',
  EXAMINING = 'EXAMINING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface Log {
  id: string;
  timestamp: Date;
  source: 'System' | 'Agent' | 'User';
  message: string;
}
