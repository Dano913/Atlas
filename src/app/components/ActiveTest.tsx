import { useState, useEffect } from 'react';
import { ChevronRight, Clock, Check } from 'lucide-react';
import { Question, Subject, TestAnswer } from '../types';
import { getSubjects } from '../utils/storage';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

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
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
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

    const duration = Math.floor((Date.now() - startTime) / 1000);
    onFinish(testAnswers, duration);
  };

  const getSubjectById = (id: string) => {
    return subjects.find(s => s.id === id);
  };

  const subject = getSubjectById(currentQuestion.subjectId);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = answers.size;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {subject && (
            <span
              className="px-3 py-1 rounded text-white text-sm"
              style={{ backgroundColor: subject.color }}
            >
              {subject.name}
            </span>
          )}
          <span className="text-sm text-gray-600">
            Pregunta {currentIndex + 1} de {questions.length}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{formatTime(elapsedTime)}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-gray-500 text-right">
          {answeredCount} de {questions.length} respondidas
        </p>
      </div>

      {/* Question */}
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h3 className="text-lg mb-6">{currentQuestion.question}</h3>

        <div className="space-y-3">
          {(['A', 'B', 'C', 'D'] as const).map((option) => (
            <div
              key={option}
              className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
                currentAnswer === option
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleAnswer(option)}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${
                  currentAnswer === option
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {currentAnswer === option && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium">{option}</span>
                    <span className="flex-1">{currentQuestion.options[option]}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center gap-4">
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          variant="outline"
        >
          Anterior
        </Button>

        <div className="flex gap-1 overflow-x-auto flex-nowrap max-w-sm px-2 pb-2">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-8 h-8 rounded text-xs transition-all flex-shrink-0 ${
                idx === currentIndex
                  ? 'bg-blue-500 text-white'
                  : answers.has(questions[idx].id)
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {currentIndex < questions.length - 1 ? (
          <Button onClick={handleNext}>
            Siguiente
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleFinish} className="bg-green-600 hover:bg-green-700">
            <Check className="w-4 h-4 mr-2" />
            Finalizar
          </Button>
        )}
      </div>
    </div>
  );
}
