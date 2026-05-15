import { useState, useEffect, useMemo } from 'react';
import { 
  Check, 
  X, 
  BarChart3, 
  Home, 
  Clock, 
  Award, 
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
    // Cargamos los sujetos del storage (que ahora tienen IDs fijos como 'sistemas-informaticos')
    setSubjects(getSubjects());
  }, []);

  // Memorizamos las estadísticas para evitar cálculos innecesarios en cada render
  const { score, correctCount, incorrectCount, statsBySubject } = useMemo(() => {
    const correct = answers.filter(a => a.isCorrect).length;
    const total = answers.length;
    const stats = new Map<string, { correct: number; total: number }>();

    questions.forEach((q) => {
      const existing = stats.get(q.subjectId) || { correct: 0, total: 0 };
      existing.total++;
      
      // Buscamos la respuesta correspondiente a esta pregunta
      const answer = answers.find(a => a.questionId === q.id);
      if (answer?.isCorrect) {
        existing.correct++;
      }
      stats.set(q.subjectId, existing);
    });

    return {
      correctCount: correct,
      incorrectCount: total - correct,
      score: total > 0 ? Math.round((correct / total) * 100) : 0,
      statsBySubject: stats
    };
  }, [questions, answers]);

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
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {!showReview ? (
        <>
          {/* Hero del Score */}
          <div className={`relative overflow-hidden bg-gradient-to-br ${getScoreTheme(score)} text-white rounded-[2.5rem] p-10 text-center shadow-2xl`}>
            <div className="relative z-10">
              <Award className="w-16 h-16 mx-auto mb-4 opacity-30 animate-bounce" />
              <h2 className="text-xl font-bold uppercase tracking-[0.2em] opacity-80">Resultado Final</h2>
              <div className="text-8xl font-black my-4 tracking-tighter drop-shadow-md">
                {score}<span className="text-4xl opacity-60">%</span>
              </div>
              <p className="text-lg font-medium opacity-90 max-w-xs mx-auto leading-relaxed">
                Has acertado {correctCount} de {answers.length} preguntas en {formatDuration(duration)}.
              </p>
            </div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
          </div>

          {/* Grid de Stats Rápidas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Correctas', val: correctCount, icon: Check, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
              { label: 'Incorrectas', val: incorrectCount, icon: X, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
              { label: 'Tiempo', val: formatDuration(duration), icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
            ].map((stat, i) => (
              <div key={i} className={`${stat.bg} ${stat.border} p-6 rounded-3xl border shadow-sm transition-transform hover:scale-[1.02] dark:bg-slate-900 dark:border-slate-800`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</span>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className={`text-2xl font-black ${stat.color}`}>{stat.val}</p>
              </div>
            ))}
          </div>

          {/* Desglose por Materia */}
          {statsBySubject.size > 1 && (
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Rendimiento por materia</h3>
              </div>
              <div className="grid gap-8">
                {Array.from(statsBySubject.entries()).map(([subjectId, stats]) => {
                  const subject = getSubjectById(subjectId);
                  if (!subject) return null;
                  const subjectScore = Math.round((stats.correct / stats.total) * 100);
                  return (
                    <div key={subjectId} className="group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-5 rounded-full" style={{ backgroundColor: subject.color }} />
                          <span className="font-bold text-slate-700 dark:text-slate-200">{subject.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-slate-800 dark:text-slate-100">{subjectScore}%</span>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{stats.correct} / {stats.total} ACERTADAS</p>
                        </div>
                      </div>
                      <Progress value={subjectScore} className="h-2.5" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button onClick={() => setShowReview(true)} variant="outline" className="flex-1 h-16 rounded-2xl border-2 font-bold transition-all">
              <BookOpen className="w-5 h-5 mr-2" /> Revisar Preguntas
            </Button>
            <Button onClick={onReturnHome} className="flex-1 h-16 rounded-2xl font-bold bg-slate-900 text-white shadow-xl hover:bg-slate-800 transition-all">
              <Home className="w-5 h-5 mr-2" /> Volver al Inicio
            </Button>
          </div>
        </>
      ) : (
        /* --- MODO REVISIÓN --- */
        <>
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Revisión</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Analiza tus fallos y aciertos</p>
            </div>
            <Button onClick={() => setShowReview(false)} variant="outline" className="rounded-xl font-bold">
              <RotateCcw className="w-4 h-4 mr-2" /> Volver
            </Button>
          </div>

          <div className="grid gap-6">
            {questions.map((question, idx) => {
              const answer = answers.find(a => a.questionId === question.id);
              const subject = getSubjectById(question.subjectId);
              const isCorrect = answer?.isCorrect;

              return (
                <div key={question.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-black px-3 py-1">#{idx + 1}</Badge>
                      {subject && (
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded" style={{ color: subject.color, backgroundColor: `${subject.color}15` }}>
                          {subject.name}
                        </span>
                      )}
                    </div>
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase ${isCorrect ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                      {isCorrect ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {isCorrect ? 'Correcta' : 'Fallida'}
                    </div>
                  </div>

                  <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">{question.question}</h4>

                  <div className="grid gap-3">
                    {(['A', 'B', 'C', 'D'] as const).map((option) => {
                      const isSelected = answer?.selectedAnswer === option;
                      const isAnswerCorrect = question.correctAnswer === option;
                      
                      let cardStyle = "border-slate-100 dark:border-slate-800 opacity-60";
                      if (isAnswerCorrect) cardStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 opacity-100";
                      else if (isSelected && !isAnswerCorrect) cardStyle = "border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-700 opacity-100";

                      return (
                        <div key={option} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${cardStyle}`}>
                          <span className="text-xs font-black">{option}</span>
                          <span className="flex-1 text-sm font-bold">{question.options[option]}</span>
                          {isAnswerCorrect && <Check className="w-5 h-5" />}
                          {isSelected && !isAnswerCorrect && <X className="w-5 h-5" />}
                        </div>
                      );
                    })}
                  </div>

                  {question.explanation && (
                    <div className="mt-6 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <span className="font-black mr-2">EXPLICACIÓN:</span> {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-10 flex justify-center">
            <Button onClick={onReturnHome} size="lg" className="rounded-2xl px-12 h-14 font-black bg-slate-900 text-white">
              Finalizar Sesión
            </Button>
          </div>
        </>
      )}
    </div>
  );
}