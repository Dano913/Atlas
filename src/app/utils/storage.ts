import { Subject, Question, TestResult, QuestionOptions } from '../types';

const STORAGE_KEYS = {
  RESULTS: 'test-app-results',
};

let subjectsCache: Subject[] = [];
let questionsCache: Question[] = [];
let isInitialLoadComplete = false;

type Listener = () => void;
const listeners: Listener[] = [];

export const subscribeToData = (cb: Listener): (() => void) => {
  listeners.push(cb);
  return () => {
    const index = listeners.indexOf(cb);
    if (index !== -1) listeners.splice(index, 1);
  };
};

const notify = (): void => {
  listeners.forEach((listener) => listener());
};

const COLOR_PALETTE: string[] = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899',
];

const JSON_FILES: string[] = [
  'preguntas_bases_datos.json',
  'preguntas_entornos.json',
  'preguntas_prog.json',
  'preguntas_fpro.json',
  'preguntas_ipe.json',
  'preguntas_ssii.json',
];

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
};

const validateQuestionOptions = (options: any): QuestionOptions => {
  return {
    A: (options?.A ?? '').toString(),
    B: (options?.B ?? '').toString(),
    C: (options?.C ?? '').toString(),
    D: (options?.D ?? '').toString(),
  };
};

export const loadDataFromJSON = async (): Promise<void> => {
  if (isInitialLoadComplete) {
    console.log('[Storage] Datos ya cargados. Omitiendo recarga.');
    return;
  }

  console.log('[Storage] Iniciando carga de datos desde JSON...');
  try {
    const subjects: Subject[] = [];
    const questions: Question[] = [];

    for (let i = 0; i < JSON_FILES.length; i++) {
      const fileName = JSON_FILES[i];
      console.log(`[Storage] Cargando ${fileName}...`);

      try {
        const response = await fetch(`/data/asignaturas/${fileName}`);
        if (!response.ok) {
          console.warn(`[Storage] ⚠️ No se pudo cargar ${fileName}: ${response.status} ${response.statusText}`);
          continue;
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          console.warn(`[Storage] ⚠️ El archivo ${fileName} no contiene un array.`);
          continue;
        }

        for (const subjectData of data) {
          if (!subjectData?.asignatura) {
            console.warn(`[Storage] ⚠️ Entrada sin 'asignatura' en ${fileName}.`);
            continue;
          }

          const subjectId = slugify(subjectData.asignatura);
          const color = COLOR_PALETTE[i % COLOR_PALETTE.length];
          const createdAt = new Date().toISOString();

          subjects.push({
            id: subjectId,
            name: subjectData.asignatura,
            color,
            createdAt,
          });

          let questionCount = 0;
          for (const unidad of subjectData.unidades ?? []) {
            if (!unidad?.unidad) {
              console.warn(`[Storage] ⚠️ Unidad sin título en ${subjectData.asignatura}.`);
              continue;
            }

            for (const [fuenteName, fuenteData] of Object.entries(unidad.fuentes || {})) {
              if (!fuenteData || typeof fuenteData !== 'object') {
                console.warn(`[Storage] ⚠️ Fuente ${fuenteName} no es un objeto en ${unidad.unidad}.`);
                continue;
              }

              const preguntas = (fuenteData as any).preguntas ?? [];
              if (!Array.isArray(preguntas)) {
                console.warn(`[Storage] ⚠️ 'preguntas' no es un array en ${unidad.unidad}::${fuenteName}.`);
                continue;
              }

              for (const q of preguntas) {
                if (!q?.pregunta) {
                  console.warn(`[Storage] ⚠️ Pregunta sin texto en ${unidad.unidad}::${fuenteName}. Omitida.`);
                  continue;
                }

                const questionId = q.id || `${subjectId}-${slugify(unidad.unidad)}-${slugify(fuenteName)}-${questionCount}`;

                const options: QuestionOptions = validateQuestionOptions(q.opciones);

                // --- CORRECCIÓN: Validar correctAnswer ---
                // Si q.correcta es 'A', 'B', 'C' o 'D' (en cualquier caso), lo normalizamos a mayúsculas.
                // Si no es válido, usamos 'A' como fallback.
                const correctAnswerRaw = typeof q.correcta === 'string' ? q.correcta.toUpperCase() : 'A';
                const correctAnswer: 'A' | 'B' | 'C' | 'D' =
                  ['A', 'B', 'C', 'D'].includes(correctAnswerRaw) ? correctAnswerRaw : 'A';

                if (correctAnswerRaw !== correctAnswer) {
                  console.warn(`[Storage] ⚠️ Respuesta correcta inválida "${q.correcta}" en ${questionId}. Usando "${correctAnswer}".`);
                }

                questions.push({
                  id: questionId,
                  subjectId,
                  question: q.pregunta.trim(),
                  options,
                  correctAnswer,
                  explanation: q.justificacion?.trim(),
                  unitTitle: unidad.unidad,
                  source: fuenteName,
                  createdAt: new Date().toISOString(),
                });
                questionCount++;
              }
            }
          }
          console.log(`✅ [Storage] ${subjectData.asignatura} (${subjectId}): ${questionCount} preguntas`);
        }
      } catch (fileError) {
        console.error(`[Storage] ❌ Error al cargar ${fileName}:`, fileError);
      }
    }

    subjectsCache = subjects;
    questionsCache = questions;
    isInitialLoadComplete = true;
    console.log(`✅ [Storage] Carga completada: ${subjects.length} asignaturas, ${questions.length} preguntas.`);
    notify();
  } catch (error) {
    console.error('[Storage] ❌ Error al cargar datos:', error);
  }
};

loadDataFromJSON().catch((error) => {
  console.error('[Storage] Error inicial al cargar datos:', error);
});

export const getSubjects = (): Subject[] => subjectsCache;
export const getQuestions = (): Question[] => questionsCache;
export const isStorageReady = (): boolean => isInitialLoadComplete;
export const getQuestionsBySubject = (subjectId: string): Question[] => {
  return questionsCache.filter((q) => q.subjectId === subjectId);
};

export const getTestResults = (): TestResult[] => {
  const data = localStorage.getItem(STORAGE_KEYS.RESULTS);
  return data ? JSON.parse(data) : [];
};

export const saveTestResult = (result: TestResult): void => {
  try {
    const results = [result, ...getTestResults()].slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
  } catch (error) {
    console.error('[Storage] ❌ Error al guardar resultado:', error);
  }
};

export const clearStorage = (): void => {
  subjectsCache = [];
  questionsCache = [];
  isInitialLoadComplete = false;
  localStorage.removeItem(STORAGE_KEYS.RESULTS);
  console.log('[Storage] Storage limpiado.');
};