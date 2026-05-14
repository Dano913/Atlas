import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

import {
  Subject,
  TestConfig,
  SubjectConfig,
  SourceConfig,
} from '../types';

import { getSubjects, getQuestionsBySubject } from '../utils/storage';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';

interface TestModeSelectorProps {
  onStartTest: (config: TestConfig) => void;
}

type GroupedQuestions = Record<string, Record<string, number>>;

export function TestModeSelector({ onStartTest }: TestModeSelectorProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [subjectConfigs, setSubjectConfigs] = useState<SubjectConfig[]>([]);
  const [randomOrder, setRandomOrder] = useState(true);

  useEffect(() => {
    setSubjects(getSubjects());
  }, []);

  const groupQuestionsByUnitAndSource = (subjectId: string): GroupedQuestions => {
    const questions = getQuestionsBySubject(subjectId);
    const grouped: GroupedQuestions = {};

    for (const q of questions) {
      const unit = q.unitTitle || 'Sin unidad';
      const source = q.source || 'General';

      if (!grouped[unit]) grouped[unit] = {};
      grouped[unit][source] = (grouped[unit][source] || 0) + 1;
    }

    return grouped;
  };

  const buildInitialSubjectConfig = (subjectId: string): SubjectConfig => {
    const grouped = groupQuestionsByUnitAndSource(subjectId);

    const sources: SourceConfig[] = Object.entries(grouped).flatMap(([unitTitle, sources]) =>
      Object.entries(sources).map(([sourceTitle, maxQuestions]) => ({
        sourceId: `${unitTitle}::${sourceTitle}`,
        sourceTitle,
        questionCount: 0,
        maxQuestions,
      }))
    );

    return {
      subjectId,
      subjectTitle: subjects.find(s => s.id === subjectId)?.name,
      sources,
    };
  };

  const handleSubjectToggle = (subjectId: string, checked: boolean) => {
    if (checked) {
      setSelectedSubjects(prev => [...prev, subjectId]);
      setSubjectConfigs(prev => {
        if (prev.some(c => c.subjectId === subjectId)) return prev;
        return [...prev, buildInitialSubjectConfig(subjectId)];
      });
    } else {
      setSelectedSubjects(prev => prev.filter(id => id !== subjectId));
      setSubjectConfigs(prev => prev.filter(c => c.subjectId !== subjectId));
    }
  };

  const updateSource = (subjectId: string, sourceId: string, value: number) => {
    setSubjectConfigs(prev =>
      prev.map(cfg => {
        if (cfg.subjectId !== subjectId) return cfg;

        return {
          ...cfg,
          sources: cfg.sources.map(s =>
            s.sourceId === sourceId
              ? { ...s, questionCount: Math.max(0, Math.min(value, s.maxQuestions)) }
              : s
          ),
        };
      })
    );
  };

  const updateUnit = (subjectId: string, unitTitle: string, value: number) => {
    setSubjectConfigs(prev =>
      prev.map(cfg => {
        if (cfg.subjectId !== subjectId) return cfg;

        const prefix = `${unitTitle}::`;
        const unitSources = cfg.sources.filter(s => s.sourceId.startsWith(prefix));
        const unitMax = unitSources.reduce((sum, s) => sum + s.maxQuestions, 0);
        const target = Math.max(0, Math.min(value, unitMax));

        if (unitSources.length === 0) return cfg;

        if (target === 0) {
          return {
            ...cfg,
            sources: cfg.sources.map(s =>
              s.sourceId.startsWith(prefix)
                ? { ...s, questionCount: 0 }
                : s
            ),
          };
        }

        const currentTotal = unitSources.reduce((sum, s) => sum + s.questionCount, 0);

        if (currentTotal === 0) {
          let remaining = target;

          return {
            ...cfg,
            sources: cfg.sources.map(s => {
              if (!s.sourceId.startsWith(prefix)) return s;
              if (remaining <= 0) return { ...s, questionCount: 0 };

              const add = Math.min(s.maxQuestions, remaining);
              remaining -= add;
              return { ...s, questionCount: add };
            }),
          };
        }

        const factor = target / currentTotal;

        const redistributed = cfg.sources.map(s => {
          if (!s.sourceId.startsWith(prefix)) return s;
          const next = Math.floor(s.questionCount * factor);
          return { ...s, questionCount: Math.min(next, s.maxQuestions) };
        });

        let assigned = redistributed
          .filter(s => s.sourceId.startsWith(prefix))
          .reduce((sum, s) => sum + s.questionCount, 0);

        let remaining = target - assigned;

        for (const source of unitSources) {
          if (remaining <= 0) break;
          const idx = redistributed.findIndex(s => s.sourceId === source.sourceId);
          if (idx >= 0 && redistributed[idx].questionCount < redistributed[idx].maxQuestions) {
            redistributed[idx] = {
              ...redistributed[idx],
              questionCount: redistributed[idx].questionCount + 1,
            };
            remaining--;
          }
        }

        return { ...cfg, sources: redistributed };
      })
    );
  };

  const getSubjectUnits = (subjectId: string) => {
    const grouped = groupQuestionsByUnitAndSource(subjectId);
    return Object.keys(grouped);
  };

  const getUnitStats = (cfg: SubjectConfig, unitTitle: string) => {
    const prefix = `${unitTitle}::`;
    const unitSources = cfg.sources.filter(s => s.sourceId.startsWith(prefix));
    const total = unitSources.reduce((sum, s) => sum + s.questionCount, 0);
    const max = unitSources.reduce((sum, s) => sum + s.maxQuestions, 0);
    return { total, max, sources: unitSources };
  };

  const getTotalQuestions = () =>
    subjectConfigs.reduce(
      (total, cfg) => total + cfg.sources.reduce((sum, s) => sum + s.questionCount, 0),
      0
    );

  const handleStart = () => {
    onStartTest({
      mode: 'multi-subject',
      subjects: subjectConfigs,
      randomOrder,
    });
  };

  const canStart = selectedSubjects.length > 0 && getTotalQuestions() > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100">
          Configurar Examen
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Selecciona asignaturas, unidades y fuentes. Todo empieza en 0.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-3">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
              Asignaturas
            </h3>

            {subjects.map(subject => {
              const isSelected = selectedSubjects.includes(subject.id);

              return (
                <label
                  key={subject.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(v) => handleSubjectToggle(subject.id, v as boolean)}
                  />
                  <span className="font-medium text-slate-800 dark:text-slate-100">
                    {subject.name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {subjectConfigs.map(cfg => {
            const subject = subjects.find(s => s.id === cfg.subjectId);
            const units = getSubjectUnits(cfg.subjectId);

            return (
              <Card
                key={cfg.subjectId}
                className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-slate-800 dark:text-slate-100">
                    {subject?.name ?? cfg.subjectTitle ?? 'Asignatura'}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  {units.map(unitTitle => {
                    const { total: unitTotal, max: unitMax, sources } = getUnitStats(cfg, unitTitle);

                    return (
                      <div
                        key={unitTitle}
                        className="space-y-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800 dark:text-slate-100">
                              {unitTitle}
                            </span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                              {unitTotal}/{unitMax}
                            </span>
                          </div>

                          <Slider
                            value={[unitTotal]}
                            max={unitMax}
                            min={0}
                            step={1}
                            onValueChange={([v]) => updateUnit(cfg.subjectId, unitTitle, v)}
                          />

                          <Progress
                            value={unitMax > 0 ? (unitTotal / unitMax) * 100 : 0}
                            className="h-2 bg-slate-200 dark:bg-slate-800"
                          />
                        </div>

                        <div className="space-y-4 pl-2">
                          {sources.map(src => (
                            <div key={src.sourceId} className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-700 dark:text-slate-200">
                                  {src.sourceTitle}
                                </span>
                                <span className="text-slate-500 dark:text-slate-400">
                                  {src.questionCount}/{src.maxQuestions}
                                </span>
                              </div>

                              <Slider
                                value={[src.questionCount]}
                                max={src.maxQuestions}
                                min={0}
                                step={1}
                                onValueChange={([v]) => updateSource(cfg.subjectId, src.sourceId, v)}
                              />

                              <Progress
                                value={src.maxQuestions > 0 ? (src.questionCount / src.maxQuestions) * 100 : 0}
                                className="h-2 bg-slate-200 dark:bg-slate-800"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <Button
          disabled={!canStart}
          onClick={handleStart}
          className="px-8 shadow-lg"
        >
          Lanzar Examen <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}