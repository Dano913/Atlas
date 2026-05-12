import { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  BarChart3, 
  Home, 
  Clock, 
  Award, 
  ChevronRight, 
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { Question, Subject, TestAnswer } from '../types';
import { getSubjects } from '../utils/storage';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface TestResultsProps {
  questions: Question[];
  answers: TestAnswer[];
  duration: number;
  onReturnHome: () => void;
}

export function TestResults({ questions, answers, duration, onReturnHome }: TestResultsProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    setSubjects(getSubjects());
  }, []);

  const correctCount = answers.filter(a => a.isCorrect).length;
  const incorrectCount = answers.length - correctCount;
  const score = Math.round((correctCount / answers.length) * 100);

  const subjectStats = new Map<string, { correct: number; total: number }>();
  questions.forEach((q, idx) => {
    const existing = subjectStats.get(q.subjectId) || { correct: 0, total: 0 };
    existing.total++;
    if (answers[idx]?.isCorrect) {
      existing.correct++;
    }
    subjectStats.set(q.subjectId, existing);
  });

  const getSubjectById = (id: string) => subjects.find(s => s.id === id);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreTheme = (score: number) => {
    if (score >= 80) return "from-emerald-500 to-teal-600";
    if (score >= 50) return "from-amber-400 to-orange-500";
    return "from-rose-500 to-red-600";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
      {!showReview ? (
        <>
          {/* Main Hero Score */}
          <div className={`relative overflow-hidden bg-gradient-to-br ${getScoreTheme(score)} text-white rounded-[2rem] p-10 text-center shadow-xl`}>
            <div className="relative z-10">
              <Award className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <h2 className="text-xl font-bold uppercase tracking-widest opacity-80">Resultado Final</h2>
              <div className="text-8xl font-black my-4 tracking-tighter">
                {score}<span className="text-4xl opacity-60">%</span>
              </div>
              <p className="text-lg font-medium opacity-90 max-w-xs mx-auto">
                Has acertado {correctCount} de {answers.length} preguntas en un tiempo de {formatDuration(duration)}.
              </p>
            </div>
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-3xl" />
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Correctas', val: correctCount, icon: Check, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Incorrectas', val: incorrectCount, icon: X, color: 'text-rose-600', bg: 'bg-rose-50' },
              { label: 'Velocidad', val: formatDuration(duration), icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
            ].map((stat, i) => (
              <div key={i} className={`${stat.bg} p-6 rounded-2xl border border-white dark:border-slate-800 shadow-sm`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">{stat.label}</span>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className={`text-2xl font-black ${stat.color}`}>{stat.val}</p>
              </div>
            ))}
          </div>

          {/* Subject Breakdown - Card Style */}
          {subjectStats.size > 1 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-slate-400" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Rendimiento por materia</h3>
              </div>
              <div className="grid gap-6">
                {Array.from(subjectStats.entries()).map(([subjectId, stats]) => {
                  const subject = getSubjectById(subjectId);
                  if (!subject) return null;
                  const subjectScore = Math.round((stats.correct / stats.total) * 100);
                  return (
                    <div key={subjectId} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-6 rounded-full" style={{ backgroundColor: subject.color }} />
                          <span className="font-bold text-slate-700 dark:text-slate-300">{subject.name}</span>
                        </div>
                        <span className="text-sm font-black text-slate-500">
                          {stats.correct}/{stats.total} <span className="ml-2 text-slate-300">|</span> {subjectScore}%
                        </span>
                      </div>
                      <Progress value={subjectScore} className="h-2 rounded-full" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              onClick={() => setShowReview(true)} 
              variant="outline" 
              className="flex-1 h-14 rounded-2xl border-2 font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Revisar Fallos
            </Button>
            <Button 
              onClick={onReturnHome} 
              className="flex-1 h-14 rounded-2xl font-bold bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-200 dark:shadow-none transition-all"
            >
              <Home className="w-5 h-5 mr-2" />
              Finalizar Sesión
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* Review Mode Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100">Revisión</h2>
              <p className="text-slate-500 font-medium text-sm">Analiza tus respuestas detalladamente</p>
            </div>
            <Button onClick={() => setShowReview(false)} variant="ghost" className="rounded-xl font-bold hover:bg-slate-100">
              <RotateCcw className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>

          <div className="space-y-6">
            {questions.map((question, idx) => {
              const answer = answers[idx];
              const subject = getSubjectById(question.subjectId);
              return (
                <div key={question.id} className="relative group">
                  <div className={`absolute -left-2 top-0 bottom-0 w-1 rounded-full ${answer.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-all group-hover:shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="font-bold">Pregunta {idx + 1}</Badge>
                        {subject && (
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {subject.name}
                          </span>
                        )}
                      </div>
                      {answer.isCorrect ? (
                        <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-black uppercase tracking-tighter flex items-center gap-1">
                          <Check className="w-3 h-3" /> Correcta
                        </span>
                      ) : (
                        <span className="text-rose-600 bg-rose-50 px-3 py-1 rounded-full text-xs font-black uppercase tracking-tighter flex items-center gap-1">
                          <X className="w-3 h-3" /> Incorrecta
                        </span>
                      )}
                    </div>

                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 leading-tight">
                      {question.question}
                    </p>

                    <div className="grid gap-3">
                      {(['A', 'B', 'C', 'D'] as const).map((option) => {
                        const isSelected = answer.selectedAnswer === option;
                        const isCorrect = question.correctAnswer === option;
                        
                        let stateClass = "border-slate-100 dark:border-slate-800 bg-slate-50/50 text-slate-500";
                        if (isCorrect) stateClass = "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/20";
                        if (isSelected && !isCorrect) stateClass = "border-rose-200 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 ring-1 ring-rose-500/20";

                        return (
                          <div key={option} className={`relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${stateClass}`}>
                            <span className="font-black opacity-40 text-xs w-4">{option}</span>
                            <span className="flex-1 text-sm font-semibold">{question.options[option]}</span>
                            {isCorrect && <Check className="w-5 h-5" />}
                            {isSelected && !isCorrect && <X className="w-5 h-5" />}
                          </div>
                        );
                      })}
                    </div>

                    {question.explanation && !answer.isCorrect && (
                      <div className="mt-6 p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                         <div className="flex gap-2 text-blue-800 dark:text-blue-300 text-sm italic">
                            <RotateCcw className="w-4 h-4 shrink-0 mt-0.5 opacity-50" />
                            <p><strong>Refuerzo:</strong> {question.explanation}</p>
                         </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-8 flex justify-center">
             <Button onClick={onReturnHome} size="lg" className="rounded-2xl px-12 font-bold bg-slate-900">
               Finalizar Revisión
             </Button>
          </div>
        </>
      )}
    </div>
  );
}