import { useState, useEffect } from 'react';
import { ChevronRight, Clock, Check, GraduationCap } from 'lucide-react';
import { Question, Subject, TestAnswer } from '../types';
import { getSubjects } from '../utils/storage';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface ActiveTestProps {
  questions: Question[];
  onFinish: (answers: TestAnswer[], duration: number) => void;
}

export function ActiveTest({ questions, onFinish }: ActiveTestProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, 'A' | 'B' | 'C' | 'D'>>(new Map());
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    setSubjects(getSubjects());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const currentAnswer = answers.get(currentQuestion.id) || '';

  const handleAnswer = (answer: 'A' | 'B' | 'C' | 'D') => {
    const newAnswers = new Map(answers);
    newAnswers.set(currentQuestion.id, answer);
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleFinish = () => {
    const testAnswers: TestAnswer[] = questions.map(q => {
      const selectedAnswer = answers.get(q.id);
      return {
        questionId: q.id,
        selectedAnswer: selectedAnswer || 'A',
        correctAnswer: q.correctAnswer,
        isCorrect: selectedAnswer === q.correctAnswer,
      };
    });
    onFinish(testAnswers, Math.floor((Date.now() - startTime) / 1000));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Lógica de color idéntica a tus otros componentes
  const getSubjectColor = (subject?: Subject) => {
    if (!subject) return '#64748b';
    if (subject.color && subject.color.startsWith('#')) return subject.color;
    const defaultColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    const charCodeSum = subject.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return defaultColors[charCodeSum % defaultColors.length];
  };

  const subject = subjects.find(s => s.id === currentQuestion.subjectId);
  const mainColor = getSubjectColor(subject);

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span 
            className="text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-2"
            style={{ 
              backgroundColor: `${mainColor}15`, 
              color: mainColor,
              border: `1px solid ${mainColor}25` 
            }}
          >
            <GraduationCap className="w-3 h-3" />
            {subject?.name || 'General'}
          </span>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Pregunta {currentIndex + 1} de {questions.length}
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm text-slate-600 dark:text-slate-300">
          <Clock className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-mono font-bold">{formatTime(elapsedTime)}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2 bg-slate-200 dark:bg-slate-800" />
        <div className="flex justify-between items-center">
           <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{Math.round(progress)}% completado</span>
           <span className="text-xs text-slate-500 dark:text-slate-400">
            {answers.size} de {questions.length} respondidas
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-6 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-8 leading-tight">
          {currentQuestion.question}
        </h3>

        <div className="grid gap-3">
          {(['A', 'B', 'C', 'D'] as const).map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className={`group flex items-start p-4 rounded-2xl border-2 transition-all text-left ${
                currentAnswer === option
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10'
                  : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
              }`}
            >
              <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${
                currentAnswer === option
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-slate-300 dark:border-slate-600'
              }`}>
                {currentAnswer === option ? (
                  <Check className="w-4 h-4 stroke-[3px]" />
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600">{option}</span>
                )}
              </div>
              <span className={`text-sm md:text-base transition-colors ${
                currentAnswer === option 
                  ? 'font-bold text-blue-700 dark:text-blue-400' 
                  : 'text-slate-600 dark:text-slate-300'
              }`}>
                {currentQuestion.options[option]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation & Question Grid */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="outline"
            className="rounded-xl border-slate-200 dark:border-slate-800 dark:hover:bg-slate-800"
          >
            Anterior
          </Button>

          {currentIndex < questions.length - 1 ? (
            <Button 
              onClick={handleNext}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
            >
              Siguiente
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button 
              onClick={handleFinish} 
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
            >
              <Check className="w-4 h-4 mr-2" />
              Finalizar Test
            </Button>
          )}
        </div>

        {/* Quick Jump Grid */}
        <div className="flex flex-wrap justify-center gap-2 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
          {questions.map((_, idx) => {
            const isAnswered = answers.has(questions[idx].id);
            const isCurrent = idx === currentIndex;
            
            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-10 h-10 rounded-xl text-xs font-bold transition-all transform hover:scale-110 ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-500/20'
                    : isAnswered
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}