import { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react';
import { Question, Subject } from '../types';
import { getQuestions, getSubjects } from '../utils/storage';

interface QuestionEditorProps {
  initialSubjectFilter?: string | null;
}

export function QuestionEditor({ initialSubjectFilter = null }: QuestionEditorProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setQuestions(getQuestions());
    setSubjects(getSubjects());
    if (initialSubjectFilter) setSelectedSubject(initialSubjectFilter);
  }, [initialSubjectFilter]);

  // Lógica idéntica a SubjectManager para obtener el color
  const getSubjectColor = (subject: Subject) => {
    if (subject.color && subject.color.startsWith('#')) {
      return subject.color;
    }
    const defaultColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    const charCodeSum = subject.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return defaultColors[charCodeSum % defaultColors.length];
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || q.subjectId === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-4">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Banco de Preguntas</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {selectedSubject !== 'all' 
            ? `Mostrando preguntas de ${subjects.find(s => s.id === selectedSubject)?.name}`
            : 'Explora el repositorio completo de preguntas.'}
        </p>
      </header>

      {/* Barra de Herramientas */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar en el enunciado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 ml-2" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">Todas las materias</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Preguntas */}
      <div className="space-y-3">
        {filteredQuestions.map((q) => {
          const subject = subjects.find(s => s.id === q.subjectId);
          const mainColor = subject ? getSubjectColor(subject) : '#64748b';

          return (
            <div
              key={q.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl transition-all duration-200 ${
                expandedId === q.id 
                  ? 'border-blue-400 shadow-md ring-1 ring-blue-400/20' 
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                className="w-full text-left p-4 flex items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {/* BADGE IDÉNTICO AL SUBJECT MANAGER */}
                    <span 
                      className="text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-2"
                      style={{ 
                        backgroundColor: `${mainColor}10`, 
                        color: mainColor,
                        border: `1px solid ${mainColor}20` 
                      }}
                    >
                      <GraduationCap className="w-3 h-3" />
                      {subject?.name || 'General'}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">ID: {q.id.slice(0, 8)}</span>
                  </div>
                  <p className="font-bold text-slate-700 dark:text-slate-200 leading-snug">
                    {q.question}
                  </p>
                </div>
                <div className={`p-1 rounded-lg transition-transform ${expandedId === q.id ? 'rotate-180 bg-blue-50 text-blue-600' : 'text-slate-400'}`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>

              {expandedId === q.id && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-50 dark:border-slate-800 animate-in slide-in-from-top-2">
                  <div className="grid gap-2">
                    {Object.entries(q.options).map(([key, value]) => (
                      <div 
                        key={key}
                        className={`p-3 rounded-xl text-sm border transition-all ${
                          key === q.correctAnswer 
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold' 
                            : 'bg-slate-50 dark:bg-slate-800/50 border-transparent text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <span className="opacity-50 mr-2">{key})</span>
                        {value}
                      </div>
                    ))}
                  </div>
                  {q.explanation && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl text-xs text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/20">
                      <span className="font-bold block mb-1 uppercase tracking-tighter opacity-70">Explicación Técnica</span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredQuestions.length === 0 && (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">No hay preguntas que coincidan con los filtros</p>
          </div>
        )}
      </div>
    </div>
  );
}