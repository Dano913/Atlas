import { Subject, Question, TestResult } from '../types';

const STORAGE_KEYS = {
  RESULTS: 'test-app-results',
  DATA_LOADED: 'test-app-data-loaded',
};

const QUESTIONS_KEY = 'quiz_questions';

// Estructura avanzada del JSON
interface SubjectDataFile {
  asignatura: string;
  fuentes: {
    fuente: string;
    total_preguntas: number;
    unidades: {
      unidad: string;
      total: number;
      preguntas: {
        id: string;
        pregunta: string;
        opciones: Record<string, string>;
        correcta: 'A' | 'B' | 'C' | 'D';
        justificacion?: string;
      }[];
    }[];
  }[];
}

// Cache en memoria
let subjectsCache: Subject[] = [];
let questionsCache: Question[] = [];
let dataLoaded = false;

// CONFIGURACIÓN
const JSON_FILES = [
  'preguntas_bases_datos.json',
  'preguntas_entornos.json',
  'preguntas_prog.json',
  'preguntas_fpro.json',
  'preguntas_ipe.json',
  'preguntas_ssii.json'
];

// Paleta de colores para asignar a las asignaturas
const COLOR_PALETTE = [
  '#3b82f6', // Azul
  '#10b981', // Verde
  '#f59e0b', // Ámbar
  '#ef4444', // Rojo
  '#8b5cf6', // Violeta
  '#ec4899', // Rosa
  '#06b6d4', // Cian
  '#71717a', // Gris
];

// Cargar datos
export const loadDataFromJSON = async (): Promise<void> => {
  if (dataLoaded) return;

  try {
    const subjects: Subject[] = [];
    const questions: Question[] = [];
    let successCount = 0;
    let errorCount = 0;

    console.log(`📚 Cargando ${JSON_FILES.length} archivos JSON...`);

    // Usamos el índice para asignar un color diferente a cada archivo
    for (let i = 0; i < JSON_FILES.length; i++) {
      const fileName = JSON_FILES[i];
      try {
        const response = await fetch(`/data/asignaturas/${fileName}`);
        
        if (!response.ok) {
          console.warn(`⚠️ No se pudo cargar: ${fileName}`);
          errorCount++;
          continue;
        }

        const data: SubjectDataFile[] = await response.json();

        // Recorrer asignaturas dentro del JSON
        for (const subjectData of data) {
          if (!subjectData.asignatura || !subjectData.fuentes) {
            console.error(`❌ Formato inválido en ${fileName}`);
            continue;
          }

          const subjectId = crypto.randomUUID();
          
          // Asignación de color basada en el índice del archivo
          const subject: Subject = {
            id: subjectId,
            name: subjectData.asignatura,
            color: COLOR_PALETTE[i % COLOR_PALETTE.length], // Color rotativo
            createdAt: new Date().toISOString(),
          };

          subjects.push(subject);
          let questionCount = 0;

          // Recorrer fuentes -> unidades -> preguntas
          subjectData.fuentes.forEach((fuenteData) => {
            fuenteData.unidades.forEach((unidadData) => {
              unidadData.preguntas.forEach((q) => {
                if (!q.pregunta || !q.opciones || !q.correcta) return;

                const question: Question = {
                  id: q.id || crypto.randomUUID(),
                  subjectId: subjectId,
                  question: q.pregunta,
                  options: {
                    A: q.opciones.A || '',
                    B: q.opciones.B || '',
                    C: q.opciones.C || '',
                    D: q.opciones.D || '',
                  },
                  correctAnswer: q.correcta, 
                  createdAt: new Date().toISOString(),
                  explanation: q.justificacion,
                  source: fuenteData.fuente,
                  unitTitle: unidadData.unidad,
                };

                questions.push(question);
                questionCount++;
              });
            });
          });

          console.log(`✓ ${subjectData.asignatura}: ${questionCount} preguntas [Color: ${subject.color}]`);
          successCount++;
        }
      } catch (error) {
        console.error(`❌ Error procesando ${fileName}:`, error);
        errorCount++;
      }
    }

    subjectsCache = subjects;
    questionsCache = questions;
    dataLoaded = true;

    console.log(`\n✅ Carga completada: ${subjectsCache.length} asignaturas, ${questionsCache.length} preguntas.`);
  } catch (error) {
    console.error('❌ Error crítico cargando datos:', error);
  }
};

// Auto-ejecución de la carga
loadDataFromJSON();

// --- GETTERS ---

export const getSubjects = (): Subject[] => subjectsCache;

export const getQuestions = (): Question[] => questionsCache;

export const getQuestionsBySubject = (subjectId: string): Question[] => {
  return questionsCache.filter(q => q.subjectId === subjectId);
};

export const addQuestions = (newQuestions: Question[]) => {
  const currentQuestions = getQuestions();
  const updatedQuestions = [...currentQuestions, ...newQuestions];
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(updatedQuestions));
};

// --- MÉTODOS DE SOLO LECTURA (LOGS DE ADVERTENCIA) ---

export const saveSubjects = () => console.warn('Asignaturas son de solo lectura (JSON)');
export const addSubject = () => console.warn('No se pueden añadir asignaturas vía código');
export const updateSubject = () => console.warn('No se pueden editar asignaturas vía código');
export const deleteSubject = () => console.warn('No se pueden eliminar asignaturas vía código');

// --- RESULTADOS DEL TEST (LOCALSTORAGE) ---

export const getTestResults = (): TestResult[] => {
  const data = localStorage.getItem(STORAGE_KEYS.RESULTS);
  return data ? JSON.parse(data) : [];
};

export const saveTestResult = (result: TestResult) => {
  const results = getTestResults();
  results.unshift(result);
  localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results.slice(0, 50))); // Guardamos los últimos 50
};