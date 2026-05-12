import { useState, useEffect } from 'react';
import { Calendar, Clock, Target, TrendingUp, ChevronDown, ChevronUp, Check, X, History, Award, Lightbulb } from 'lucide-react';
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
    setResults(getTestResults());
    setSubjects(getSubjects());
    setQuestions(getQuestions());
  }, []);

  const getSubjectById = (id: string) => subjects.find(s => s.id === id);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  const averageScore = results.length > 0
    ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length)
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100">Historial de Actividad</h2>

      {results.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50">
          <History className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">No hay tests completados</p>
        </div>
      ) : (
        <>
          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="dark:bg-slate-900 border-none shadow-sm bg-blue-50/50 dark:bg-blue-950/10">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Total Tests</p>
                  <p className="text-3xl font-black text-blue-700 dark:text-blue-300">{results.length}</p>
                </div>
                <Target className="w-8 h-8 text-blue-500/50" />
              </CardContent>
            </Card>

            <Card className="dark:bg-slate-900 border-none shadow-sm bg-purple-50/50 dark:bg-purple-950/10">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Media Global</p>
                  <p className="text-3xl font-black text-purple-700 dark:text-purple-300">{averageScore}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500/50" />
              </CardContent>
            </Card>

            <Card className="dark:bg-slate-900 border-none shadow-sm bg-emerald-50/50 dark:bg-emerald-950/10">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Récord</p>
                  <p className="text-3xl font-black text-emerald-700 dark:text-emerald-300">{Math.max(...results.map(r => r.score))}%</p>
                </div>
                <Award className="w-8 h-8 text-emerald-500/50" />
              </CardContent>
            </Card>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {results.slice().reverse().map((result) => {
              const subject = result.subjectId ? getSubjectById(result.subjectId) : null;
              const isExpanded = expandedTestId === result.id;

              return (
                <div key={result.id} className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:shadow-md">
                  <button
                    onClick={() => setExpandedTestId(isExpanded ? null : result.id)}
                    className="w-full text-left p-5"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex flex-wrap items-center gap-3">
                        {subject ? (
                          <Badge style={{ backgroundColor: subject.color }} className="text-white border-none font-bold uppercase text-[10px]">
                            {subject.name}
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-700 text-white border-none font-bold uppercase text-[10px]">Mix Aleatorio</Badge>
                        )}
                        <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(result.date)}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {formatDuration(result.duration)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-2xl font-black ${getScoreColor(result.score)}`}>{result.score}%</span>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        <span>Progreso de aciertos</span>
                        <span>{result.answers.filter(a => a.isCorrect).length} / {result.total}</span>
                      </div>
                      <Progress value={result.score} className="h-1.5" />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 p-5 space-y-4 animate-in slide-in-from-top-2">
                      {result.answers.map((answer, idx) => {
                        const question = questions.find(q => q.id === answer.questionId);
                        if (!question) return null;

                        return (
                          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
                            <div className="flex items-start gap-3 mb-4">
                              <div className={`p-1 rounded-full mt-0.5 ${answer.isCorrect ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600'}`}>
                                {answer.isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                              </div>
                              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{question.question}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-8">
                              {(['A', 'B', 'C', 'D'] as const).map(opt => {
                                const isCorrect = opt === answer.correctAnswer;
                                const isSelected = opt === answer.selectedAnswer;
                                
                                return (
                                  <div key={opt} className={`px-3 py-2 rounded-lg text-xs border ${
                                    isCorrect ? 'bg-emerald-500/10 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold' :
                                    isSelected && !isCorrect ? 'bg-rose-500/10 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400' :
                                    'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-500'
                                  }`}>
                                    <span className="font-black mr-2">{opt}</span> {question.options[opt]}
                                  </div>
                                );
                              })}
                            </div>

                            {question.explanation && (
                              <div className="ml-8 mt-3 p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg flex gap-2 text-[11px] text-blue-800 dark:text-blue-300 italic border border-blue-100 dark:border-blue-900/30">
                                <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                                <p><strong>Explicación:</strong> {question.explanation}</p>
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