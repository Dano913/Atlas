import { useState, useEffect } from 'react';
import { Shuffle, BookOpen, ArrowRight, Settings2, GraduationCap } from 'lucide-react';
import { Subject, TestConfig, SubjectConfig, SourceConfig } from '../types';
import { getSubjects, getQuestionsBySubject } from '../utils/storage';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Checkbox } from './ui/checkbox';

interface TestModeSelectorProps {
  onStartTest: (config: TestConfig) => void;
}

export function TestModeSelector({ onStartTest }: TestModeSelectorProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [subjectConfigs, setSubjectConfigs] = useState<SubjectConfig[]>([]);
  const [randomOrder, setRandomOrder] = useState(true);

  useEffect(() => {
    setSubjects(getSubjects());
  }, []);

  const getSourcesForSubject = (subjectId: string): SourceConfig[] => {
    const questions = getQuestionsBySubject(subjectId);
    const sources = [...new Set(questions.map(q => q.source).filter(Boolean))];

    return sources.map(source => {
      const sourceQuestions = questions.filter(q => q.source === source);
      return {
        source: source || 'General',
        questionCount: Math.min(10, sourceQuestions.length),
        maxQuestions: sourceQuestions.length,
      };
    });
  };

  const handleSubjectToggle = (subjectId: string, checked: boolean) => {
    if (checked) {
      setSelectedSubjects(prev => [...prev, subjectId]);
      const sources = getSourcesForSubject(subjectId);
      setSubjectConfigs(prev => [...prev, { subjectId, sources }]);
    } else {
      setSelectedSubjects(prev => prev.filter(id => id !== subjectId));
      setSubjectConfigs(prev => prev.filter(config => config.subjectId !== subjectId));
    }
  };

  const handleSourceCountChange = (subjectId: string, source: string, count: number) => {
    setSubjectConfigs(prev =>
      prev.map(config =>
        config.subjectId === subjectId
          ? {
              ...config,
              sources: config.sources.map(src =>
                src.source === source ? { ...src, questionCount: count } : src
              ),
            }
          : config
      )
    );
  };

  const getTotalQuestions = () => {
    return subjectConfigs.reduce((total, config) =>
      total + config.sources.reduce((subTotal, source) => subTotal + source.questionCount, 0), 0
    );
  };

  const handleStart = () => {
    const config: TestConfig = {
      mode: 'multi-subject',
      subjects: subjectConfigs,
      randomOrder,
    };
    onStartTest(config);
  };

  const canStart = selectedSubjects.length > 0 && getTotalQuestions() > 0;

  // Utilidad para colores dinámicos con soporte Dark Mode
  const getSubjectStyles = (hex: string) => {
    return {
      border: `2px solid ${hex}`,
      backgroundColor: `${hex}10`, // Opacidad para modo claro
      '--subject-color': hex
    } as React.CSSProperties;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="text-center space-y-2">
        <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100">Configurar Examen</h2>
        <p className="text-slate-500 dark:text-slate-400">Personaliza tu sesión de estudio eligiendo materias y cantidad de preguntas.</p>
      </header>

      {/* Modo de Test Visual */}
      <div className="relative group overflow-hidden p-8 rounded-2xl bg-gradient-to-br from-blue-800 to-blue-900 text-white shadow-xl shadow-blue-500/20">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl">
            <GraduationCap className="w-10 h-10" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold">Modo Multi-Asignatura Activo</h3>
            <p className="text-blue-100 text-sm max-w-md">
              Estás configurando un test personalizado. Puedes mezclar temas de diferentes asignaturas en una sola sesión.
            </p>
          </div>
        </div>
        <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Settings2 className="w-64 h-64" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Selección */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-800/30 border-b dark:border-slate-800">
              <CardTitle className="text-sm uppercase tracking-widest text-slate-500">Asignaturas</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {subjects.map(subject => {
                const isSelected = selectedSubjects.includes(subject.id);
                const qCount = getQuestionsBySubject(subject.id).length;

                return (
                  <label
                    key={subject.id}
                    className={`flex items-center p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                        : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleSubjectToggle(subject.id, checked as boolean)}
                      disabled={qCount === 0}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${isSelected ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {subject.name}
                      </p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{qCount} preguntas</p>
                    </div>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }} />
                  </label>
                );
              })}
            </CardContent>
          </Card>

          <Card className="dark:bg-slate-900 dark:border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-bold">Aleatorizar</Label>
                  <p className="text-xs text-slate-500">Mezclar preguntas</p>
                </div>
                <Switch checked={randomOrder} onCheckedChange={setRandomOrder} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna Derecha: Configuración de Fuentes */}
        <div className="lg:col-span-2 space-y-6">
          {subjectConfigs.length === 0 ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <ArrowRight className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-400">Selecciona una asignatura para configurar</h4>
              <p className="text-sm text-slate-400">Podrás elegir cuántas preguntas tomar de cada fuente.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {subjectConfigs.map(config => {
                const subject = subjects.find(s => s.id === config.subjectId);
                if (!subject) return null;

                return (
                  <Card key={config.subjectId} className="overflow-hidden dark:bg-slate-900 transition-colors" style={getSubjectStyles(subject.color)}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2" style={{ color: subject.color }}>
                        <BookOpen className="w-5 h-5" />
                        {subject.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-2">
                      {config.sources.map(source => (
                        <div key={source.source} className="space-y-3 bg-white/50 dark:bg-slate-950/40 p-4 rounded-xl border border-black/5 dark:border-white/5">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-bold text-slate-700 dark:text-slate-200">{source.source}</Label>
                            <span className="text-xs font-mono bg-white dark:bg-slate-900 px-2 py-1 rounded border dark:border-slate-800">
                              {source.questionCount} / {source.maxQuestions}
                            </span>
                          </div>
                          <div className="pt-2">
                            <Slider
                              value={[source.questionCount]}
                              onValueChange={([value]) => handleSourceCountChange(config.subjectId, source.source, value)}
                              max={source.maxQuestions}
                              min={0}
                              step={1}
                            />
                          </div>
                          <Progress 
                            value={(source.questionCount / source.maxQuestions) * 100} 
                            className="h-1.5 opacity-60"
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Barra de Acción Flotante */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-4xl z-50">
        <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-xl flex flex-col items-center justify-center shadow-lg shadow-blue-500/40">
              <span className="text-xl font-black leading-none">{getTotalQuestions()}</span>
              <span className="text-[8px] uppercase font-bold">Items</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Resumen de carga</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedSubjects.length} materias preparadas
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleStart}
            disabled={!canStart}
            size="lg"
            className="w-full sm:w-auto px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-95"
          >
            <span>Lanzar Examen</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}