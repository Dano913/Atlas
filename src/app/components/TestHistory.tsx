import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  X, 
  History, 
  Award, 
  Lightbulb 
} from 'lucide-react';
import { TestResult, Subject, Question } from '../types';
import { getTestResults, getSubjects, getQuestions } from '../utils/storage';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

export function TestHistory() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);

  useEffect(() => {
    // Carga inicial de datos desde el storage determinista
    setResults(getTestResults());
    setSubjects(getSubjects());
    setQuestions(getQuestions());
  }, []);

  const getSubjectById = (id: string) => subjects.find(s => s.id === id);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-rose-500';
  };

  const averageScore = results.length > 0
    ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length)
    : 0;

  const maxScore = results.length > 0 
    ? Math.max(...results.map(r => r.score)) 
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Tu Progreso</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Revisa tus estadísticas y repasa tus errores.</p>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] bg-slate-50/50 dark:bg-slate-900/50">
          <div className="bg-white dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <History className="w-10 h-10 text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Aún no hay actividad</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-sm">
            Completa tu primer test para empezar a registrar tus resultados y ver tu evolución.
          </p>
        </div>
      ) : (
        <>
          {/* Dashboard de Stats Superiores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="dark:bg-slate-900 border-none shadow-xl bg-blue-600 text-white overflow-hidden relative group">
              <CardContent className="p-8 flex items-center justify-between relative z-10">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70 mb-1">Total Tests</p>
                  <p className="text-5xl font-black">{results.length}</p>
                </div>
                <Target className="w-12 h-12 opacity-20 group-hover:scale-110 transition-transform" />
              </CardContent>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            </Card>

            <Card className="dark:bg-slate-900 border-none shadow-xl bg-white dark:border dark:border-slate-800 overflow-hidden relative group">
              <CardContent className="p-8 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Media Global</p>
                  <p className="text-5xl font-black text-slate-900 dark:text-white">{averageScore}%</p>
                </div>
                <TrendingUp className="w-12 h-12 text-purple-500/20 group-hover:scale-110 transition-transform" />
              </CardContent>
            </Card>

            <Card className="dark:bg-slate-900 border-none shadow-xl bg-white dark:border dark:border-slate-800 overflow-hidden relative group">
              <CardContent className="p-8 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Puntuación Récord</p>
                  <p className="text-5xl font-black text-emerald-600">{maxScore}%</p>
                </div>
                <Award className="w-12 h-12 text-emerald-500/20 group-hover:scale-110 transition-transform" />
              </CardContent>
            </Card>
          </div>

          {/* Listado de Tests (Cronológico inverso) */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest ml-2">Actividad Reciente</h3>
            {results.slice().reverse().map((result) => {
              const subject = result.subjectId ? getSubjectById(result.subjectId) : null;
              const isExpanded = expandedTestId === result.id;

              return (
                <div key={result.id} className="group overflow-hidden rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:shadow-lg">
                  <button
                    onClick={() => setExpandedTestId(isExpanded ? null : result.id)}
                    className="w-full text-left p-6 md:p-8"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                      <div className="flex flex-wrap items-center gap-4">
                        {subject ? (
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }} />
                             <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 tracking-wider">
                               {subject.name}
                             </span>
                          </div>
                        ) : (
                          <Badge className="bg-slate-900 text-white border-none font-black uppercase text-[9px] px-3 py-1.5 rounded-xl">Mix Aleatorio</Badge>
                        )}
                        <div className="flex items-center gap-4 text-[11px] text-slate-400 font-bold uppercase tracking-tight">
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(result.date)}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {formatDuration(result.duration)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className={`text-3xl font-black ${getScoreColor(result.score)} tracking-tighter`}>{result.score}%</span>
                        </div>
                        <div className={`p-2 rounded-full transition-colors ${isExpanded ? 'bg-slate-100 dark:bg-slate-800' : 'bg-transparent'}`}>
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Aciertos</span>
                        <span>{result.answers.filter(a => a.isCorrect).length} / {result.total}</span>
                      </div>
                      <Progress value={result.score} className="h-2 rounded-full" />
                    </div>
                  </button>

                  {/* Detalle del Test (Preguntas revisables) */}
                  {isExpanded && (
                    <div className="border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20 p-6 md:p-8 space-y-6 animate-in slide-in-from-top-4 duration-300">
                      {result.answers.map((answer, idx) => {
                        const question = questions.find(q => q.id === answer.questionId);
                        if (!question) return null;

                        return (
                          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-start gap-4 mb-5">
                              <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${answer.isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                {idx + 1}
                              </div>
                              <p className="text-base font-bold text-slate-800 dark:text-slate-100 pt-1 leading-snug">{question.question}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-12">
                              {(['A', 'B', 'C', 'D'] as const).map(opt => {
                                const isCorrect = opt === question.correctAnswer;
                                const isSelected = opt === answer.selectedAnswer;
                                
                                let stateClasses = "border-slate-100 dark:border-slate-800 text-slate-500 opacity-60";
                                if (isCorrect) stateClasses = "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-800 dark:text-emerald-400 font-bold opacity-100 shadow-sm";
                                else if (isSelected && !isCorrect) stateClasses = "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-800 dark:text-rose-400 opacity-100 shadow-sm";

                                return (
                                  <div key={opt} className={`px-4 py-3 rounded-xl text-xs border-2 transition-all flex items-center justify-between ${stateClasses}`}>
                                    <span><span className="font-black mr-2">{opt}</span> {question.options[opt]}</span>
                                    {isCorrect && <Check className="w-4 h-4" />}
                                    {isSelected && !isCorrect && <X className="w-4 h-4" />}
                                  </div>
                                );
                              })}
                            </div>

                            {question.explanation && (
                              <div className="ml-12 mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl flex gap-3 text-xs text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30">
                                <Lightbulb className="w-4 h-4 shrink-0 text-blue-500" />
                                <p><span className="font-black uppercase text-[10px] mr-2">Explicación:</span> {question.explanation}</p>
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
        </>
      )}
    </div>
  );
}