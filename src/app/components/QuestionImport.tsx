import { useState, useEffect } from 'react';
import { Upload, FileText, Check, X } from 'lucide-react';
import mammoth from 'mammoth';
import { Subject, Question } from '../types';
import { getSubjects, addQuestions } from '../utils/storage';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface ParsedQuestion {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer?: 'A' | 'B' | 'C' | 'D';
}

export function QuestionImport() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setSubjects(getSubjects());
  }, []);

  const parseWordDocument = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value;

      // Parsear el texto para extraer preguntas
      // Formato esperado:
      // 1. Pregunta aquí?
      // A) Opción A
      // B) Opción B
      // C) Opción C
      // D) Opción D
      
      const questions: ParsedQuestion[] = [];
      const lines = text.split('\n').filter(line => line.trim());
      
      let currentQuestion: Partial<ParsedQuestion> = {};
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Detectar pregunta (empieza con número)
        if (/^\d+[\.)]\s/.test(line)) {
          if (currentQuestion.question && currentQuestion.options) {
            questions.push(currentQuestion as ParsedQuestion);
          }
          currentQuestion = {
            question: line.replace(/^\d+[\.)]\s/, '').trim(),
            options: { A: '', B: '', C: '', D: '' }
          };
        }
        // Detectar opciones
        else if (/^[A-D][\)]/i.test(line)) {
          const option = line[0].toUpperCase() as 'A' | 'B' | 'C' | 'D';
          const text = line.substring(2).trim();
          if (currentQuestion.options) {
            currentQuestion.options[option] = text;
          }
        }
      }
      
      // Añadir última pregunta
      if (currentQuestion.question && currentQuestion.options) {
        questions.push(currentQuestion as ParsedQuestion);
      }

      if (questions.length === 0) {
        toast.error('No se pudieron extraer preguntas del documento');
        return;
      }

      setParsedQuestions(questions);
      toast.success(`${questions.length} preguntas extraídas`);
    } catch (error) {
      toast.error('Error al procesar el archivo');
      console.error(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      parseWordDocument(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.docx')) {
      parseWordDocument(file);
    } else {
      toast.error('Por favor, sube un archivo .docx');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const setCorrectAnswer = (index: number, answer: 'A' | 'B' | 'C' | 'D') => {
    const updated = [...parsedQuestions];
    updated[index].correctAnswer = answer;
    setParsedQuestions(updated);
  };

  const handleSave = () => {
    if (!selectedSubject) {
      toast.error('Selecciona una asignatura');
      return;
    }

    const incomplete = parsedQuestions.filter(q => !q.correctAnswer);
    if (incomplete.length > 0) {
      toast.error(`${incomplete.length} preguntas sin respuesta correcta marcada`);
      return;
    }

    const questions: Question[] = parsedQuestions.map(pq => ({
      id: crypto.randomUUID(),
      subjectId: selectedSubject,
      question: pq.question,
      options: pq.options,
      correctAnswer: pq.correctAnswer!,
      createdAt: new Date().toISOString(),
    }));

    addQuestions(questions);
    toast.success(`${questions.length} preguntas guardadas`);
    setParsedQuestions([]);
    setSelectedSubject('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl">Importar Preguntas desde Word</h2>

      {subjects.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">Primero debes crear al menos una asignatura</p>
        </div>
      ) : (
        <>
          {parsedQuestions.length === 0 ? (
            <div>
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-lg mb-2">Arrastra un archivo .docx aquí</p>
                <p className="text-sm text-gray-500 mb-4">o haz clic para seleccionar</p>
                <input
                  type="file"
                  accept=".docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button asChild>
                    <span className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Seleccionar Archivo
                    </span>
                  </Button>
                </label>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm mb-2"><strong>Formato esperado:</strong></p>
                <pre className="text-xs bg-white p-3 rounded border">
{`1. ¿Cuál es la capital de Francia?
A) Londres
B) París
C) Madrid
D) Roma

2. ¿Cuánto es 2 + 2?
A) 3
B) 4
C) 5
D) 6`}
                </pre>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label>Asignatura</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una asignatura" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: subject.color }}
                            />
                            {subject.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => setParsedQuestions([])} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  <Check className="w-4 h-4 mr-2" />
                  Guardar ({parsedQuestions.length})
                </Button>
              </div>

              <div className="space-y-4">
                {parsedQuestions.map((pq, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-white">
                    <p className="mb-3">
                      <strong>{index + 1}. </strong>
                      {pq.question}
                    </p>
                    <RadioGroup
                      value={pq.correctAnswer}
                      onValueChange={(value) => setCorrectAnswer(index, value as 'A' | 'B' | 'C' | 'D')}
                      className="space-y-2"
                    >
                      {(['A', 'B', 'C', 'D'] as const).map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`q${index}-${option}`} />
                          <Label htmlFor={`q${index}-${option}`} className="flex-1 cursor-pointer">
                            <strong>{option})</strong> {pq.options[option]}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {!pq.correctAnswer && (
                      <p className="text-sm text-red-600 mt-2">⚠️ Marca la respuesta correcta</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
