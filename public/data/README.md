# Carpeta de Datos - TestMaster

## Estructura de Archivos JSON

Coloca tus archivos JSON de asignaturas en la carpeta `/public/data/asignaturas/`.

Cada archivo debe seguir el formato: `nombre-de-asignatura.json`

## Formato de Archivo JSON

Cada archivo debe contener:

```json
{
  "subject": {
    "name": "Nombre de la Asignatura",
    "color": "#3B82F6"
  },
  "questions": [
    {
      "question": "¿Cuál es la pregunta?",
      "options": {
        "A": "Opción A",
        "B": "Opción B",
        "C": "Opción C",
        "D": "Opción D"
      },
      "correctAnswer": "A"
    }
  ]
}
```

### Campos:

- **subject.name**: Nombre de la asignatura (string)
- **subject.color**: Color identificativo en formato hexadecimal (string)
- **questions**: Array de preguntas
  - **question**: Texto de la pregunta (string)
  - **options**: Objeto con las 4 opciones (A, B, C, D)
  - **correctAnswer**: Letra de la respuesta correcta ("A", "B", "C" o "D")

## Colores Recomendados

- Azul: #3B82F6
- Verde: #10B981
- Rojo: #EF4444
- Amarillo: #F59E0B
- Morado: #8B5CF6
- Rosa: #EC4899
- Naranja: #F97316
- Turquesa: #14B8A6

## Ejemplo Completo

Ver el archivo `ejemplo-matematicas.json` para una referencia completa.
