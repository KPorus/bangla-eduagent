export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  content?: string; // Markdown content, generated lazily
  quiz?: QuizQuestion[]; // Generated lazily
  groundingUrls?: string[]; // Source URLs found during generation
}

export interface Course {
  id: string;
  topic: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  createdAt: number;
  totalModules: number;
  completedModules: number;
  modules: CourseModule[];
  groundingUrls?: string[];
}

export type ViewState = 'DASHBOARD' | 'GENERATOR' | 'COURSE_VIEW';

export interface AppState {
  currentView: ViewState;
  activeCourseId: string | null;
}

// Helper for parsing Gemini responses
export interface GroundingMetadata {
  groundingChunks?: {
    web?: {
      uri: string;
      title: string;
    };
  }[];
}