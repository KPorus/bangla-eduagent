export enum AgentState {
  IDLE = 'IDLE',
  RESEARCHING = 'RESEARCHING', // Searching web/Kaggle
  PLANNING = 'PLANNING', // Structuring the course
  TRANSLATING = 'TRANSLATING', // Generating Bengali content
  QUIZZING = 'QUIZZING', // Generating/Taking quiz
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface CourseModule {
  id: string;
  title: string; // Bengali title
  originalTitle: string; // English title for context
  description: string; // Short summary in Bengali
  content?: string; // Full markdown content in Bengali
  isLocked: boolean;
  isCompleted: boolean;
  duration: string; // e.g., "15 min"
}

export interface Course {
  topic: string;
  title: string; // Bengali Course Title
  description: string;
  modules: CourseModule[];
  totalModules: number;
  completedModules: number;
  sources?: string[]; // URLs from grounding
}

export interface QuizQuestion {
  id: string;
  question: string; // Bengali
  options: string[]; // Bengali
  correctIndex: number;
  explanation: string; // Bengali
}

export interface Quiz {
  moduleId: string;
  questions: QuizQuestion[];
}

export type AgentLog = {
  id: string;
  agentName: 'Scraper' | 'Translator' | 'Orchestrator';
  message: string;
  timestamp: Date;
};