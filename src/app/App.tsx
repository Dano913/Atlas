import { useState, useEffect } from 'react';
import { BookOpen, Edit3, Play, History, Sun, Moon } from 'lucide-react';
import { ViewMode, Question, TestAnswer, TestResult, TestConfig } from './types';
import { getQuestions, saveTestResult, loadDataFromJSON } from './utils/storage';
import { useTheme } from '../context/ThemeContext';

// Components
import { SubjectManager } from './components/SubjectManager';
import { QuestionEditor } from './components/QuestionEditor';
import { TestModeSelector } from './components/TestModeSelector';
import { ActiveTest } from './components/ActiveTest';
import { TestResults } from './components/TestResults';
import { TestHistory } from './components/TestHistory';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('subjects');
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [testAnswers, setTestAnswers] = useState<TestAnswer[]>([]);
  const [testDuration, setTestDuration] = useState(0);
  const [testConfig, setTestConfig] = useState<TestConfig | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [filterSubjectId, setFilterSubjectId] = useState<string | null>(null);

  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    loadDataFromJSON()
      .then(() => setDataLoaded(true))
      .catch(() => setDataLoaded(true));
  }, []);

  const navigateTo = (view: ViewMode) => {
    if (view !== 'questions') setFilterSubjectId(null);
    setCurrentView(view);
  };

  // 🔥 START TEST
  const handleStartTest = (config: TestConfig) => {
    const allQuestions = getQuestions();
    let selectedQuestions: Question[] = [];

    config.subjects?.forEach(subjectConfig => {
      subjectConfig.sources.forEach(sourceConfig => {
        if (sourceConfig.questionCount <= 0) return;

        const filtered = allQuestions.filter(q =>
          q.subjectId === subjectConfig.subjectId &&
          `${q.unitTitle}::${q.source}` === sourceConfig.sourceId
        );

        selectedQuestions.push(
          ...filtered.slice(0, sourceConfig.questionCount)
        );
      });
    });

    if (selectedQuestions.length === 0) {
      alert('No hay preguntas disponibles para este test');
      return;
    }

    // 🔀 AQUÍ VA LA ALEATORIEDAD
    if (config.randomOrder) {
      selectedQuestions = [...selectedQuestions].sort(() => Math.random() - 0.5);
    }

    setTestQuestions(selectedQuestions);
    setTestConfig(config);
    setCurrentView('test-active');
  };

  // 🔥 FINISH TEST
  const handleFinishTest = (answers: TestAnswer[], duration: number) => {
    if (!testConfig) return;

    setTestAnswers(answers);
    setTestDuration(duration);

    const correctCount = answers.filter(a => a.isCorrect).length;

    const score = answers.length
      ? Math.round((correctCount / answers.length) * 100)
      : 0;

    const result: TestResult = {
      id: crypto.randomUUID(),
      mode: testConfig.mode,
      subjectId: testConfig.subjectId,
      subjects: testConfig.subjects,
      score,
      total: answers.length,
      duration,
      date: new Date().toISOString(),
      answers,
    };

    saveTestResult(result);
    setCurrentView('test-results');
  };

  const navigationItems = [
    { id: 'subjects' as ViewMode, label: 'Asignaturas', icon: BookOpen },
    { id: 'questions' as ViewMode, label: 'Preguntas', icon: Edit3 },
    { id: 'test-config' as ViewMode, label: 'Test', icon: Play },
    { id: 'history' as ViewMode, label: 'Historial', icon: History },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">

      <Toaster />

      {/* HEADER */}
      <header className="border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center">

        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <span className="font-bold">TestMaster</span>
        </div>

        <button onClick={toggleTheme}>
          {theme === 'light'
            ? <Moon className="w-5 h-5" />
            : <Sun className="w-5 h-5 text-yellow-400" />
          }
        </button>

      </header>

      {/* NAV */}
      <nav className="flex gap-3 p-3 border-b border-slate-200 dark:border-slate-800">
        {navigationItems.map(item => (
          <button
            key={item.id}
            onClick={() => navigateTo(item.id)}
            className={`px-3 py-1 rounded ${
              currentView === item.id
                ? 'bg-blue-600 text-white'
                : 'text-slate-500'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* MAIN */}
      <main className="p-6">

        {!dataLoaded ? (
          <div>Cargando...</div>
        ) : (
          <>
            {currentView === 'subjects' && (
              <SubjectManager
                onSelectSubject={(id) => setFilterSubjectId(id)}
                onNavigateToQuestions={() => setCurrentView('questions')}
              />
            )}

            {currentView === 'questions' && (
              <QuestionEditor initialSubjectFilter={filterSubjectId} />
            )}

            {currentView === 'test-config' && (
              <TestModeSelector onStartTest={handleStartTest} />
            )}

            {currentView === 'test-active' && (
              <ActiveTest
                questions={testQuestions}
                onFinish={handleFinishTest}
              />
            )}

            {currentView === 'test-results' && (
              <TestResults
                questions={testQuestions}
                answers={testAnswers}
                duration={testDuration}
                onReturnHome={() => setCurrentView('subjects')}
              />
            )}

            {currentView === 'history' && <TestHistory />}
          </>
        )}

      </main>
    </div>
  );
}