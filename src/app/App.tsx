import { useState, useEffect } from 'react';
import { BookOpen, Edit3, Play, History, Menu, X, Sun, Moon } from 'lucide-react';
import { ViewMode, Question, TestAnswer, TestResult, TestConfig } from './types';
import { getQuestions, saveTestResult, loadDataFromJSON } from './utils/storage';
import { useTheme } from '../context/ThemeContext';

// Componentes
import { SubjectManager } from './components/SubjectManager';
import { QuestionEditor } from './components/QuestionEditor';
import { TestModeSelector } from './components/TestModeSelector';
import { ActiveTest } from './components/ActiveTest';
import { TestResults } from './components/TestResults';
import { TestHistory } from './components/TestHistory';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [testAnswers, setTestAnswers] = useState<TestAnswer[]>([]);
  const [testDuration, setTestDuration] = useState(0);
  const [testConfig, setTestConfig] = useState<TestConfig | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [filterSubjectId, setFilterSubjectId] = useState<string | null>(null);

  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    loadDataFromJSON().then(() => {
      setDataLoaded(true);
    });
  }, []);

  const navigateTo = (view: ViewMode) => {
    if (view !== 'questions') setFilterSubjectId(null);
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  const handleStartTest = (config: TestConfig) => {
    let selectedQuestions: Question[] = [];
    const allQuestions = getQuestions();

    if (config.mode === 'multi-subject') {
      config.subjects?.forEach((subjectConfig) => {
        subjectConfig.sources.forEach((sourceConfig) => {
          if (sourceConfig.questionCount > 0) {
            // ✅ FIX: usar sourceConfig.sourceTitle para comparar con q.source
            // q.source se asigna desde el nombre de la fuente (fuenteName) en storage.ts
            const subjectQuestions = allQuestions.filter(
              (q) =>
                q.subjectId === subjectConfig.subjectId &&
                q.source === sourceConfig.sourceTitle
            );

            const shuffled = config.randomOrder
              ? [...subjectQuestions].sort(() => Math.random() - 0.5)
              : subjectQuestions;

            selectedQuestions.push(...shuffled.slice(0, sourceConfig.questionCount));
          }
        });
      });
    } else if (config.mode === 'random') {
      selectedQuestions = [...allQuestions]
        .sort(() => Math.random() - 0.5)
        .slice(0, 20);
    } else if (config.mode === 'subject' && config.subjectId) {
      // ✅ FIX: manejar el modo 'subject' que antes no tenía rama
      selectedQuestions = allQuestions.filter(
        (q) => q.subjectId === config.subjectId
      );
    }

    // Mezcla final si randomOrder está activo
    if (config.randomOrder) {
      selectedQuestions = [...selectedQuestions].sort(() => Math.random() - 0.5);
    }

    // ✅ FIX: guardar antes si no hay preguntas para evitar test roto
    if (selectedQuestions.length === 0) {
      console.warn('[App] No se encontraron preguntas con la configuración dada.');
      return;
    }

    setTestQuestions(selectedQuestions);
    setTestConfig(config);
    setCurrentView('test-active');
  };

  const handleFinishTest = (answers: TestAnswer[], duration: number) => {
    // ✅ FIX: guardar estado antes de cambiar de vista para evitar renders con estado vacío
    setTestAnswers(answers);
    setTestDuration(duration);

    // ✅ FIX: proteger división por cero si answers llega vacío
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const score =
      answers.length > 0
        ? Math.round((correctCount / answers.length) * 100)
        : 0;

    const result: TestResult = {
      id: crypto.randomUUID(),
      mode: testConfig!.mode,
      subjectId: testConfig?.subjectId,
      subjects: testConfig?.subjects,
      score,
      total: answers.length,
      duration,
      date: new Date().toISOString(),
      answers,
    };

    saveTestResult(result);

    // ✅ FIX: cambiar vista en el siguiente tick para que los setState anteriores
    // hayan actualizado el estado antes de que TestResults los lea
    setTimeout(() => setCurrentView('test-results'), 0);
  };

  const navigationItems = [
    { id: 'dashboard' as ViewMode, label: 'Inicio', icon: Menu },
    { id: 'subjects' as ViewMode, label: 'Asignaturas', icon: BookOpen },
    { id: 'questions' as ViewMode, label: 'Preguntas', icon: Edit3 },
    { id: 'test-config' as ViewMode, label: 'Realizar Test', icon: Play },
    { id: 'history' as ViewMode, label: 'Historial', icon: History },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Toaster />

      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigateTo('dashboard')}
            >
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
                  TestMaster
                </h1>
                <p className="text-[10px] uppercase tracking-widest opacity-50">
                  Sistema de Evaluación
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-slate-600" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-400" />
                )}
              </button>

              <nav className="hidden lg:flex gap-1 ml-4">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      currentView === item.id
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </nav>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 dark:text-slate-300"
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                  currentView === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-8">
        {!dataLoaded ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-500 animate-pulse">
              Sincronizando biblioteca de preguntas...
            </p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {currentView === 'dashboard' && (
              <Dashboard onNavigate={navigateTo} />
            )}

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

            {currentView === 'test-active' && testQuestions.length > 0 && (
              <ActiveTest
                questions={testQuestions}
                onFinish={handleFinishTest}
              />
            )}

            {currentView === 'test-results' && testAnswers.length > 0 && (
              <TestResults
                questions={testQuestions}
                answers={testAnswers}
                duration={testDuration}
                onReturnHome={() => navigateTo('dashboard')}
              />
            )}

            {currentView === 'history' && <TestHistory />}
          </div>
        )}
      </main>
    </div>
  );
}

// Sub-componente Dashboard
function Dashboard({ onNavigate }: { onNavigate: (view: ViewMode) => void }) {
  const [stats, setStats] = useState({ subjects: 0, questions: 0, tests: 0 });

  useEffect(() => {
    const loadStats = async () => {
      const { getSubjects, getQuestions, getTestResults } = await import(
        './utils/storage'
      );
      setStats({
        subjects: getSubjects().length,
        questions: getQuestions().length,
        tests: getTestResults().length,
      });
    };
    loadStats();
  }, []);

  const menuCards = [
    {
      id: 'subjects',
      title: 'Asignaturas',
      desc: 'Explora materias y temas',
      icon: BookOpen,
      color: 'bg-blue-500',
      count: stats.subjects,
    },
    {
      id: 'questions',
      title: 'Banco de Preguntas',
      desc: 'Consulta el temario completo',
      icon: Edit3,
      color: 'bg-emerald-500',
      count: stats.questions,
    },
    {
      id: 'test-config',
      title: 'Nuevo Examen',
      desc: 'Pon a prueba tus conocimientos',
      icon: Play,
      color: 'bg-orange-500',
    },
    {
      id: 'history',
      title: 'Tu Progreso',
      desc: 'Analiza tus resultados previos',
      icon: History,
      color: 'bg-purple-500',
      count: stats.tests,
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-800 dark:text-white">
          Panel de Control
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          Selecciona una sección para comenzar tu preparación.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {menuCards.map((card) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.id as ViewMode)}
            className="group relative bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all text-left"
          >
            <div
              className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
            >
              <card.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-1 text-slate-800 dark:text-white">
              {card.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              {card.desc}
            </p>
            {card.count !== undefined && (
              <span className="text-2xl font-black opacity-10 group-hover:opacity-100 transition-opacity absolute bottom-6 right-6">
                {card.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}