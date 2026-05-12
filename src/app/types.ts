export interface Subject {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface Question {
  id: string;
  subjectId: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  createdAt: string;
  explanation?: string;
  unit?: number;
  unitTitle?: string;
  source?: string;
}

export interface TestAnswer {
  questionId: string;
  selectedAnswer: 'A' | 'B' | 'C' | 'D';
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
}

export interface TestResult {
  id: string;
  mode: 'subject' | 'random' | 'multi-subject';
  subjectId?: string;
  subjects?: SubjectConfig[];
  score: number;
  total: number;
  duration: number; // en segundos
  date: string;
  answers: TestAnswer[];
}

export interface SourceConfig {
  source: string;
  questionCount: number;
  maxQuestions: number;
}

export interface SubjectConfig {
  subjectId: string;
  sources: SourceConfig[];
}

export interface TestConfig {
  mode: 'multi-subject' | 'random';
  subjects?: SubjectConfig[];
  subjectId?: string;
  randomOrder: boolean;
}

export type ViewMode = 'dashboard' | 'subjects' | 'import' | 'questions' | 'test-config' | 'test-active' | 'test-results' | 'history';
