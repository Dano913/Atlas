import { useEffect, useState, useCallback } from 'react';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { Subject, TestConfig, SubjectConfig, SourceConfig, Question } from '../types';
import { getSubjects, getQuestionsBySubject, subscribeToData } from '../utils/storage';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { ActiveTest } from './ActiveTest';

interface TestModeSelectorProps {}

type GroupedQuestions = Record<string, Record<string, number>>;

export function TestModeSelector({}: TestModeSelectorProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [subjectConfigs, setSubjectConfigs] = useState<SubjectConfig[]>([]);
  const [randomOrder, setRandomOrder] = useState(true);

  // 🔥 CONTROL DE EXAMEN
  const [questions, setQuestions] = useState<Question[]>([]);
  const [started, setStarted] = useState(false);

  const loadData = useCallback(() => {
    const data = getSubjects();
    if (data.length > 0) {
      setSubjects(data);
      console.log("✅ Asignaturas cargadas:", data.length);
    }
  }, []);

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToData(loadData);
    return () => unsubscribe();
  }, [loadData]);

  const groupQuestionsByUnitAndSource = (subjectId: string): GroupedQuestions => {
    const questions = getQuestionsBySubject(subjectId);
    const grouped: GroupedQuestions = {};

    for (const q of questions) {
      const unit = (q.unitTitle || 'Sin unidad').trim();
      const source = (q.source || 'General').trim();

      if (!grouped[unit]) grouped[unit] = {};
      grouped[unit][source] = (grouped[unit][source] || 0) + 1;
    }

    return grouped;
  };

  const buildInitialSubjectConfig = (subjectId: string): SubjectConfig => {
    const grouped = groupQuestionsByUnitAndSource(subjectId);
    const currentSubject = subjects.find(s => s.id === subjectId);

    const sources: SourceConfig[] = Object.entries(grouped).flatMap(([unitTitle, sourcesMap]) =>
      Object.entries(sourcesMap).map(([sourceTitle, maxQuestions]) => ({
        sourceId: `${unitTitle.trim()}::${sourceTitle.trim()}`,
        sourceTitle: sourceTitle.trim(),
        questionCount: 0,
        maxQuestions,
      }))
    );

    return {
      subjectId,
      subjectTitle: currentSubject?.name || 'Asignatura',
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
              ? { ...s, questionCount: value }
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
        let remaining = value;

        return {
          ...cfg,
          sources: cfg.sources.map(s => {
            if (!s.sourceId.startsWith(prefix)) return s;

            const take = Math.min(s.maxQuestions, remaining);
            remaining -= take;

            return { ...s, questionCount: take };
          }),
        };
      })
    );
  };

  // 🚀 START COMPLETO
  const handleStart = () => {
    const config: TestConfig = {
      mode: 'multi-subject',
      subjects: subjectConfigs.filter(s =>
        s.sources.some(src => src.questionCount > 0)
      ),
      randomOrder,
    };

    const generatedQuestions: Question[] = config.subjects.flatMap(subject => {
      const all = getQuestionsBySubject(subject.subjectId);

      return subject.sources.flatMap(source => {
        return all
          .filter(q =>
            `${q.unitTitle?.trim()}::${q.source?.trim()}` === source.sourceId
          )
          .slice(0, source.questionCount);
      });
    });

    console.group("🚀 EXAM START");
    console.log("CONFIG:", config);
    console.log("QUESTIONS:", generatedQuestions.length);
    console.groupEnd();

    setQuestions(generatedQuestions);
    setStarted(true);
  };

  const getTotalQuestions = () =>
    subjectConfigs.reduce((t, cfg) =>
      t + cfg.sources.reduce((s, src) => s + src.questionCount, 0), 0
    );

  // 🔥 SI EXAMEN INICIADO → ACTIVE TEST
  if (started) {
    return (
      <ActiveTest
        questions={questions}
        onFinish={() => {
          setStarted(false);
          setQuestions([]);
        }}
      />
    );
  }

  // 🔥 UI SELECTOR
  if (subjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-500">
        <RefreshCw className="w-10 h-10 animate-spin mb-4 text-blue-500" />
        <p>Cargando asignaturas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">

      <h2 className="text-2xl font-bold">Configurar Examen</h2>

      <div className="grid grid-cols-3 gap-6">

        {/* ASIGNATURAS */}
        <div>
          {subjects.map(subject => (
            <label key={subject.id} className="flex gap-2">
              <Checkbox
                checked={selectedSubjects.includes(subject.id)}
                onCheckedChange={(v) =>
                  handleSubjectToggle(subject.id, v as boolean)
                }
              />
              {subject.name}
            </label>
          ))}
        </div>

        {/* CONFIG */}
        <div className="col-span-2 space-y-6">
          {subjectConfigs.map(cfg => (
            <Card key={cfg.subjectId}>
              <CardHeader>
                <CardTitle>{cfg.subjectTitle}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {Object.keys(groupQuestionsByUnitAndSource(cfg.subjectId)).map(unitTitle => {
                  const prefix = `${unitTitle}::`;

                  const unitSources = cfg.sources.filter(s =>
                    s.sourceId.startsWith(prefix)
                  );

                  const unitTotal = unitSources.reduce((a, b) => a + b.questionCount, 0);
                  const unitMax = unitSources.reduce((a, b) => a + b.maxQuestions, 0);

                  return (
                    <div key={unitTitle}>
                      <div className="flex justify-between">
                        <span>{unitTitle}</span>
                        <span>{unitTotal}/{unitMax}</span>
                      </div>

                      <Slider
                        value={[unitTotal]}
                        max={unitMax}
                        onValueChange={([v]) =>
                          updateUnit(cfg.subjectId, unitTitle, v)
                        }
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Button
        onClick={handleStart}
        disabled={getTotalQuestions() === 0}
      >
        Empezar ({getTotalQuestions()})
        <ArrowRight />
      </Button>
    </div>
  );
}