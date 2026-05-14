export interface Subject {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface QuestionOptions {
  A: string;
  B: string;
  C: string;
  D: string;
}

export type AnswerOption = 'A' | 'B' | 'C' | 'D';

export interface Question {
  id: string;
  subjectId: string;

  question: string;
  options: QuestionOptions;
  correctAnswer: AnswerOption;

  explanation?: string;

  unitTitle: string;
  source: string;

  createdAt: string;

  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
}

export interface TestAnswer {
  questionId: string;
  selectedAnswer: AnswerOption;
  correctAnswer: AnswerOption;
  isCorrect: boolean;
}

export interface SourceConfig {
  sourceId: string;
  sourceTitle: string;

  questionCount: number;
  maxQuestions: number;
}

export interface SubjectConfig {
  subjectId: string;

  // Opcional para evitar búsquedas extra
  subjectTitle?: string;

  sources: SourceConfig[];
}

export interface TestResult {
  id: string;

  mode: 'subject' | 'random' | 'multi-subject';

  subjectId?: string;
  subjects?: SubjectConfig[];

  score: number;
  total: number;

  // segundos
  duration: number;

  date: string;

  answers: TestAnswer[];

  // Estadísticas futuras
  percentage?: number;
  passed?: boolean;
}

export interface TestConfig {
  mode: 'multi-subject' | 'random' | 'subject';

  subjects?: SubjectConfig[];

  subjectId?: string;

  randomOrder: boolean;

  // Futuro
  shuffleAnswers?: boolean;
  includeFailedOnly?: boolean;
}

export type ViewMode =
  | 'dashboard'
  | 'subjects'
  | 'import'
  | 'questions'
  | 'test-config'
  | 'test-active'
  | 'test-results'
  | 'history';