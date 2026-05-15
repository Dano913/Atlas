import { useState, useEffect } from 'react';
import { BookOpen, FileJson, GraduationCap, ChevronRight, RefreshCw } from 'lucide-react';
import { Subject } from '../types';
import { getSubjects, getQuestionsBySubject, isStorageReady, subscribeToData } from '../utils/storage';

interface SubjectManagerProps {
  onSelectSubject: (subjectId: string) => void;
  onNavigateToQuestions: () => void;
}

interface SubjectWithInfo extends Subject {
  questionCount: number;
  unitCount: number;
  sourceCount: number;
}

export function SubjectManager({ onSelectSubject, onNavigateToQuestions }: SubjectManagerProps) {
  const [subjectsWithInfo, setSubjectsWithInfo] = useState<SubjectWithInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos y suscribirse a cambios
  useEffect(() => {
    const loadData = () => {
      if (!isStorageReady()) {
        setIsLoading(true);
        return;
      }

      const subjects = getSubjects();
      const subjectsWithInfo = subjects.map((subject) => {
        const questions = getQuestionsBySubject(subject.id);
        const units = new Set(questions.map(q => q.unitTitle));
        const sources = new Set(questions.map(q => q.source));

        return {
          ...subject,
          questionCount: questions.length,
          unitCount: units.size,
          sourceCount: sources.size,
        };
      });

      setSubjectsWithInfo(subjectsWithInfo);
      setIsLoading(false);
    };

    loadData();
    const unsubscribe = subscribeToData(loadData);
    return () => unsubscribe();
  }, []);

  const handleCardClick = (subjectId: string) => {
    onSelectSubject(subjectId);
    onNavigateToQuestions();
  };

  const getSubjectColor = (subject: Subject) => {
    if (subject.color?.startsWith('#')) return subject.color;
    const defaultColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    const charCodeSum = subject.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return defaultColors[charCodeSum % defaultColors.length];
  };

  return (
    <div className="space-y-6 p-4 animate-in fade-in duration-500">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Asignaturas Disponibles
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Selecciona una materia para revisar sus preguntas específicas.
        </p>
      </header>

      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <div className="flex items-center gap-3">
          <FileJson className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
            Haz clic en cualquier tarjeta para filtrar el banco de preguntas.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <RefreshCw className="w-16 h-16 mx-auto animate-spin text-blue-500" />
          <p className="text-slate-500 mt-4">Cargando asignaturas...</p>
        </div>
      ) : subjectsWithInfo.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <BookOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">No se encontraron asignaturas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectsWithInfo.map((subject) => {
            const mainColor = getSubjectColor(subject);
            return (
              <div
                key={subject.id}
                onClick={() => handleCardClick(subject.id)}
                className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 transition-all group cursor-pointer active:scale-[0.98]"
              >
                <div className="h-1.5 w-full" style={{ backgroundColor: mainColor }} />

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className="p-2.5 rounded-xl transition-transform group-hover:scale-110 duration-300"
                      style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <GraduationCap style={{ color: mainColor }} className="w-6 h-6" />
                    </div>
                    <span
                      className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider"
                      style={{ backgroundColor: `${mainColor}10`, color: mainColor }}
                    >
                      {subject.questionCount} PREGUNTAS
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1 group-hover:text-blue-600 transition-colors">
                    {subject.name}
                  </h3>

                  <p className="text-sm text-slate-500 mb-4">
                    {subject.unitCount} unidades • {subject.sourceCount} fuentes
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800/50">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Ver preguntas
                    </span>
                    <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}