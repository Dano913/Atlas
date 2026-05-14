import { Subject, Question, TestResult } from '../types';

// =====================
// STORAGE KEYS
// =====================
const STORAGE_KEYS = {
  RESULTS: 'test-app-results',
};

const QUESTIONS_KEY = 'quiz_questions';

// =====================
// CACHE
// =====================
let subjectsCache: Subject[] = [];
let questionsCache: Question[] = [];
let dataLoaded = false;

// =====================
// EVENT SYSTEM (FIX subscribeToData)
// =====================
type Listener = () => void;

const listeners: Listener[] = [];

export const subscribeToData = (cb: Listener) => {
  listeners.push(cb);

  return () => {
    const index = listeners.indexOf(cb);
    if (index !== -1) listeners.splice(index, 1);
  };
};

const notify = () => {
  listeners.forEach((l) => l());
};

// =====================
// JSON STRUCTURE
// =====================
interface SubjectDataFile {
  asignatura: string;
  unidades: {
    unidad: string;
    fuentes: Record<
      string,
      {
        total_preguntas: number;
        preguntas: {
          id: string;
          pregunta: string;
          opciones: Record<string, string>;
          correcta: 'A' | 'B' | 'C' | 'D';
          justificacion?: string;
        }[];
      }
    >;
  }[];
}

// =====================
// CONFIG
// =====================
const JSON_FILES = [
  'preguntas_bases_datos.json',
  'preguntas_entornos.json',
  'preguntas_prog.json',
  'preguntas_fpro.json',
  'preguntas_ipe.json',
  'preguntas_ssii.json',
];

const COLOR_PALETTE = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#71717a',
];

// =====================
// LOAD DATA (FIXED)
// =====================
export const loadDataFromJSON = async (): Promise<void> => {
  if (dataLoaded) return;

  try {
    const subjects: Subject[] = [];
    const questions: Question[] = [];

    for (let i = 0; i < JSON_FILES.length; i++) {
      const fileName = JSON_FILES[i];

      const response = await fetch(`/data/asignaturas/${fileName}`);
      if (!response.ok) continue;

      const data: SubjectDataFile[] = await response.json();

      for (const subjectData of data) {
        if (!subjectData?.asignatura) continue;

        const subjectId = crypto.randomUUID();

        subjects.push({
          id: subjectId,
          name: subjectData.asignatura,
          color: COLOR_PALETTE[i % COLOR_PALETTE.length],
          createdAt: new Date().toISOString(),
        });

        let count = 0;

        // =====================
        // UNIDADES
        // =====================
        for (const unidad of subjectData.unidades ?? []) {

          // 🔥 FIX: fuentes ES OBJETO, no array
          const fuentesObj = unidad.fuentes ?? {};

          for (const [fuenteName, fuenteData] of Object.entries(fuentesObj)) {

            for (const q of fuenteData.preguntas ?? []) {
              if (!q?.pregunta) continue;

              questions.push({
                id: q.id || crypto.randomUUID(),
                subjectId,

                question: q.pregunta,

                options: {
                  A: q.opciones?.A ?? '',
                  B: q.opciones?.B ?? '',
                  C: q.opciones?.C ?? '',
                  D: q.opciones?.D ?? '',
                },

                correctAnswer: q.correcta,

                createdAt: new Date().toISOString(),

                explanation: q.justificacion,

                source: fuenteName,
                unitTitle: unidad.unidad,
              });

              count++;
            }
          }
        }

        console.log(`✓ ${subjectData.asignatura}: ${count} preguntas`);
      }
    }

    subjectsCache = subjects;
    questionsCache = questions;
    dataLoaded = true;

    notify();

    console.log('========================');
    console.log('✔ SUBJECTS:', subjects.length);
    console.log('✔ QUESTIONS:', questions.length);
    console.log('========================');

  } catch (error) {
    console.error('❌ Error cargando JSON:', error);
  }
};

// auto init
loadDataFromJSON();

// =====================
// GETTERS
// =====================
export const getSubjects = (): Subject[] => subjectsCache;
export const getQuestions = (): Question[] => questionsCache;

export const getQuestionsBySubject = (subjectId: string): Question[] =>
  questionsCache.filter((q) => q.subjectId === subjectId);

// =====================
// MUTATIONS
// =====================
export const addQuestions = (newQuestions: Question[]) => {
  questionsCache = [...questionsCache, ...newQuestions];
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questionsCache));
  notify();
};

// =====================
// TEST RESULTS
// =====================
export const getTestResults = (): TestResult[] => {
  const data = localStorage.getItem(STORAGE_KEYS.RESULTS);
  return data ? JSON.parse(data) : [];
};

export const saveTestResult = (result: TestResult) => {
  const results = getTestResults();
  results.unshift(result);

  localStorage.setItem(
    STORAGE_KEYS.RESULTS,
    JSON.stringify(results.slice(0, 50))
  );
};