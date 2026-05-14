import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  BookOpen,
  ChevronDown,
  GraduationCap,
  List,
  LayoutList,
} from 'lucide-react';

import { Question, Subject } from '../types';
import { getQuestions, getSubjects } from '../utils/storage';
import { Button } from './ui/button';

interface QuestionEditorProps {
  initialSubjectFilter?: string | null;
}

export function QuestionEditor({
  initialSubjectFilter = null,
}: QuestionEditorProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [collapsedUnits, setCollapsedUnits] = useState<Set<string>>(new Set());
  const [collapsedSources, setCollapsedSources] = useState<Set<string>>(new Set());

  useEffect(() => {
    setQuestions(getQuestions());
    setSubjects(getSubjects());
    if (initialSubjectFilter) setSelectedSubject(initialSubjectFilter);
  }, [initialSubjectFilter]);

  const getSubjectColor = (subject: Subject) => {
    if (subject.color && subject.color.startsWith('#')) return subject.color;
    const defaultColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    const sum = subject.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return defaultColors[sum % defaultColors.length];
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || q.subjectId === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  // 🔥 3 niveles reales
  const groupedQuestions = filteredQuestions.reduce((acc, q) => {
    const subject = subjects.find((s) => s.id === q.subjectId);
    const subjectName = subject?.name || 'General';
    const unitName = q.unitTitle || 'Sin unidad';
    const sourceName = (q as any).source || 'Sin fuente';

    if (!acc[subjectName]) acc[subjectName] = {};
    if (!acc[subjectName][unitName]) acc[subjectName][unitName] = {};
    if (!acc[subjectName][unitName][sourceName]) acc[subjectName][unitName][sourceName] = [];

    acc[subjectName][unitName][sourceName].push(q);
    return acc;
  }, {} as Record<string, Record<string, Record<string, Question[]>>>);

  const toggleQuestion = (id: string) => {
    const next = new Set(expandedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedIds(next);
  };

  const unitKey = (s: string, u: string) => `${s}||${u}`;
  const sourceKey = (s: string, u: string, f: string) => `${s}||${u}||${f}`;

  const toggleUnit = (s: string, u: string) => {
    const key = unitKey(s, u);
    const next = new Set(collapsedUnits);
    next.has(key) ? next.delete(key) : next.add(key);
    setCollapsedUnits(next);
  };

  const toggleSource = (s: string, u: string, f: string) => {
    const key = sourceKey(s, u, f);
    const next = new Set(collapsedSources);
    next.has(key) ? next.delete(key) : next.add(key);
    setCollapsedSources(next);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-4">

      {/* HEADER (COPIADO TAL CUAL) */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Banco de Preguntas
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {selectedSubject !== 'all'
              ? `Mostrando preguntas de ${
                  subjects.find((s) => s.id === selectedSubject)?.name
                }`
              : 'Explora el repositorio completo de preguntas.'}
          </p>
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="space-y-10">
        {Object.entries(groupedQuestions).map(([subjectName, units]) => (
          <div key={subjectName} className="space-y-4">

            {/* SUBJECT HEADER (COPIA EXACTA) */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              <h2 className="text-xl font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">
                {subjectName}
              </h2>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            {/* UNITS */}
            <div className="space-y-4">
              {Object.entries(units).map(([unitName, sources]) => {
                const uKey = unitKey(subjectName, unitName);
                const unitCollapsed = collapsedUnits.has(uKey);

                return (
                  <div key={unitName} className="space-y-3">

                    {/* UNIDAD (COPIA EXACTA TUYA) */}
                    <button
                      onClick={() => toggleUnit(subjectName, unitName)}
                      className="sticky top-0 z-10 w-full text-left backdrop-blur-md bg-slate-100/90 dark:bg-slate-950/90 rounded-2xl px-4 py-3 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between group transition-colors hover:border-slate-300 dark:hover:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <h3 className="font-black uppercase tracking-wide text-sm text-slate-700 dark:text-slate-200">
                          {unitName}
                        </h3>
                      </div>

                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          unitCollapsed ? '-rotate-90' : 'rotate-0'
                        }`}
                      />
                    </button>

                    {!unitCollapsed && (
                      <div className="space-y-3">

                        {/* SOURCES */}
                        {Object.entries(sources).map(([sourceName, qs]) => {
                          const sKey = sourceKey(subjectName, unitName, sourceName);
                          const sourceCollapsed = collapsedSources.has(sKey);

                          return (
                            <div key={sourceName} className="space-y-3">

                              {/* SOURCE (MISMO HTML QUE UNIDAD SOLO MÁS PEQUEÑO) */}
                              <button
                                onClick={() =>
                                  toggleSource(subjectName, unitName, sourceName)
                                }
                                className="w-full text-left backdrop-blur-md bg-slate-50/90 dark:bg-slate-900/90 rounded-xl px-4 py-2 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-700"
                              >
                                <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">
                                  {sourceName}
                                </span>

                                <ChevronDown
                                  className={`w-4 h-4 text-slate-400 transition-transform ${
                                    sourceCollapsed ? '-rotate-90' : ''
                                  }`}
                                />
                              </button>

                              {!sourceCollapsed && (
                                <div className="space-y-3">

                                  {/* QUESTIONS (TU UI ORIGINAL SIN TOCAR) */}
                                  {qs.map((q) => {
                                    const isExpanded = expandedIds.has(q.id);
                                    const subject = subjects.find((s) => s.id === q.subjectId);
                                    const mainColor = subject ? getSubjectColor(subject) : '#64748b';

                                    return (
                                      <div
                                        key={q.id}
                                        className={`bg-white dark:bg-slate-900 border rounded-2xl transition-all duration-200 ${
                                          isExpanded
                                            ? 'border-blue-400 dark:border-blue-500/50 shadow-md ring-1 ring-blue-400/20'
                                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                                        }`}
                                      >
                                        <button
                                          onClick={() => toggleQuestion(q.id)}
                                          className="w-full text-left p-4 flex items-start justify-between gap-4"
                                        >
                                          <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                              <span
                                                className="text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-2"
                                                style={{
                                                  backgroundColor: `${mainColor}15`,
                                                  color: mainColor,
                                                  border: `1px solid ${mainColor}25`,
                                                }}
                                              >
                                                <GraduationCap className="w-3 h-3" />
                                                {subject?.name || 'General'}
                                              </span>

                                              <span className="text-[10px] font-medium text-slate-400">
                                                {unitName}
                                              </span>

                                              <span className="text-[10px] font-medium text-slate-400">
                                                ID: {q.id.slice(0, 8)}
                                              </span>
                                            </div>

                                            <p className="font-bold text-slate-700 dark:text-slate-200 leading-snug">
                                              {q.question}
                                            </p>
                                          </div>

                                          <div
                                            className={`p-1 rounded-lg transition-transform duration-300 ${
                                              isExpanded
                                                ? 'rotate-180 bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                                                : 'text-slate-400'
                                            }`}
                                          >
                                            <ChevronDown className="w-5 h-5" />
                                          </div>
                                        </button>

                                        {isExpanded && (
                                          <div className="px-4 pb-4 pt-2 border-t border-slate-50 dark:border-slate-800">
                                            <div className="grid gap-2">
                                              {Object.entries(q.options).map(([k, v]) => (
                                                <div
                                                  key={k}
                                                  className={`p-3 rounded-xl text-sm border ${
                                                    k === q.correctAnswer
                                                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold'
                                                      : 'bg-slate-50 dark:bg-slate-800/50 border-transparent text-slate-600 dark:text-slate-400'
                                                  }`}
                                                >
                                                  <span className="opacity-50 mr-2">{k})</span>
                                                  {v}
                                                </div>
                                              ))}
                                            </div>

                                            {q.explanation && (
                                              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl text-xs text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/20">
                                                <span className="font-bold block mb-1 uppercase tracking-tighter opacity-70">
                                                  Explicación Técnica
                                                </span>
                                                {q.explanation}
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}

                                </div>
                              )}
                            </div>
                          );
                        })}

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredQuestions.length === 0 && (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">
              No hay preguntas que coincidan con los filtros
            </p>
          </div>
        )}
      </div>
    </div>
  );
}