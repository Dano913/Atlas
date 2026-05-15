import { QuestionOptions } from '../types';

export interface ParsedQuestion {
  question: string;

  options: QuestionOptions;

  correctAnswer?: 'A' | 'B' | 'C' | 'D';

  explanation?: string;
}

interface RawQuestion {
  pregunta?: unknown;

  opciones?: {
    A?: unknown;
    B?: unknown;
    C?: unknown;
    D?: unknown;
  };

  correcta?: unknown;

  justificacion?: unknown;
}

const isValidAnswer = (
  value: unknown
): value is 'A' | 'B' | 'C' | 'D' => {
  return (
    typeof value === 'string' &&
    ['A', 'B', 'C', 'D'].includes(
      value.toUpperCase()
    )
  );
};

const safeString = (
  value: unknown
): string => {
  return typeof value === 'string'
    ? value.trim()
    : '';
};

export const validateQuestions = (
  data: unknown
): ParsedQuestion[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  const questions: ParsedQuestion[] = [];

  for (const raw of data as RawQuestion[]) {
    const question = safeString(
      raw.pregunta
    );

    if (!question) {
      continue;
    }

    const options: QuestionOptions = {
      A: safeString(raw.opciones?.A),
      B: safeString(raw.opciones?.B),
      C: safeString(raw.opciones?.C),
      D: safeString(raw.opciones?.D),
    };

    if (
      !options.A ||
      !options.B ||
      !options.C ||
      !options.D
    ) {
      continue;
    }

    questions.push({
      question,

      options,

      correctAnswer:
        isValidAnswer(raw.correcta)
          ? raw.correcta.toUpperCase() as
              | 'A'
              | 'B'
              | 'C'
              | 'D'
          : undefined,

      explanation: safeString(
        raw.justificacion
      ),
    });
  }

  return questions;
};