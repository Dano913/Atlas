# TestMaster - Instrucciones de Uso

## 📋 Descripción General

TestMaster es una aplicación web para crear y realizar tests a partir de archivos JSON organizados por asignaturas. Los datos se cargan automáticamente desde archivos JSON ubicados en una carpeta específica.

## 🗂️ Estructura de Archivos

```
/public/data/asignaturas/
├── README.md                      # Documentación del formato
├── ejemplo-matematicas.json       # Ejemplo de asignatura
├── ejemplo-historia.json          # Ejemplo de asignatura
└── [tus-archivos].json           # Tus archivos personalizados
```

## 📝 Formato de Archivo JSON

Cada archivo JSON debe tener esta estructura:

```json
{
  "subject": {
    "name": "Nombre de la Asignatura",
    "color": "#3B82F6"
  },
  "questions": [
    {
      "question": "¿Texto de la pregunta?",
      "options": {
        "A": "Primera opción",
        "B": "Segunda opción",
        "C": "Tercera opción",
        "D": "Cuarta opción"
      },
      "correctAnswer": "A"
    }
  ]
}
```

### Campos Obligatorios:

- **subject.name**: Nombre de la asignatura (string)
- **subject.color**: Color en formato hexadecimal (string, opcional, por defecto: #3B82F6)
- **questions**: Array de objetos de preguntas
- **question**: Texto de la pregunta (string)
- **options**: Objeto con exactamente 4 opciones (A, B, C, D)
- **correctAnswer**: Letra de la respuesta correcta ("A", "B", "C" o "D")

## 🎨 Paleta de Colores Recomendada

| Color     | Código    | Vista previa |
|-----------|-----------|--------------|
| Azul      | #3B82F6   | 🔵           |
| Verde     | #10B981   | 🟢           |
| Rojo      | #EF4444   | 🔴           |
| Amarillo  | #F59E0B   | 🟡           |
| Morado    | #8B5CF6   | 🟣           |
| Rosa      | #EC4899   | 🌸           |
| Naranja   | #F97316   | 🟠           |
| Turquesa  | #14B8A6   | 🔷           |

## 🚀 Cómo Añadir Tus Asignaturas

### Opción 1: Desde Cero

1. **Crea un nuevo archivo JSON** en `/public/data/asignaturas/`
   - Nombre sugerido: `nombre-asignatura.json` (sin espacios)
   - Ejemplo: `biologia.json`, `historia-contemporanea.json`

2. **Copia la estructura base**:
   ```json
   {
     "subject": {
       "name": "Tu Asignatura",
       "color": "#3B82F6"
     },
     "questions": []
   }
   ```

3. **Añade tus preguntas** al array `questions`:
   ```json
   {
     "question": "¿Tu pregunta aquí?",
     "options": {
       "A": "Opción 1",
       "B": "Opción 2",
       "C": "Opción 3",
       "D": "Opción 4"
     },
     "correctAnswer": "A"
   }
   ```

4. **Registra el archivo** en `/src/app/utils/storage.ts`:
   ```typescript
   const JSON_FILES = [
     'ejemplo-matematicas.json',
     'ejemplo-historia.json',
     'tu-archivo.json',  // ← Añade aquí
   ];
   ```

5. **Recarga la aplicación** para ver los cambios

### Opción 2: Usar los Ejemplos como Plantilla

1. **Duplica** uno de los archivos de ejemplo:
   - `ejemplo-matematicas.json` → `tu-asignatura.json`

2. **Modifica** el contenido:
   - Cambia el nombre de la asignatura
   - Cambia el color
   - Reemplaza las preguntas

3. **Registra el archivo** en `storage.ts` (ver paso 4 anterior)

4. **Recarga la aplicación**

## ⚙️ Configuración Técnica

### Archivo de Configuración: `src/app/utils/storage.ts`

```typescript
// CONFIGURACIÓN: Añade aquí los nombres de tus archivos JSON
const JSON_FILES = [
  'ejemplo-matematicas.json',
  'ejemplo-historia.json',
  // Añade tus archivos aquí:
  'fisica.json',
  'quimica.json',
  'ingles.json',
];
```

**Importante:** Cada vez que añadas un nuevo archivo JSON, debes incluir su nombre en este array.

## 🧪 Validación de Archivos

Al cargar la aplicación, la consola del navegador mostrará el estado de la carga:

```
📚 Cargando 3 archivos JSON...
✓ ejemplo-matematicas.json: Matemáticas (5 preguntas)
✓ ejemplo-historia.json: Historia (3 preguntas)
✓ fisica.json: Física (10 preguntas)

✅ Carga completada:
   3 archivos cargados correctamente
   3 asignaturas
   18 preguntas totales
```

### Mensajes de Error Comunes:

- **`⚠️ No se pudo cargar: archivo.json`**
  - El archivo no existe o la ruta es incorrecta
  - Verifica que el archivo esté en `/public/data/asignaturas/`

- **`❌ Formato inválido en archivo.json`**
  - Falta algún campo obligatorio (subject, questions)
  - Revisa la estructura del JSON

- **`⚠️ Pregunta inválida en archivo.json`**
  - Una pregunta no tiene todos los campos necesarios
  - Verifica que cada pregunta tenga: question, options, correctAnswer

## 🔍 Verificar Archivos JSON

### Opción 1: Validador Online
1. Copia el contenido de tu archivo JSON
2. Visita: https://jsonlint.com/
3. Pega y valida

### Opción 2: Editor de Código
Usa VS Code, Sublime Text o cualquier editor con soporte JSON. Te indicará errores de sintaxis automáticamente.

## 📊 Ejemplo Completo

Archivo: `geografia.json`

```json
{
  "subject": {
    "name": "Geografía",
    "color": "#10B981"
  },
  "questions": [
    {
      "question": "¿Cuál es la capital de Francia?",
      "options": {
        "A": "Londres",
        "B": "Berlín",
        "C": "París",
        "D": "Madrid"
      },
      "correctAnswer": "C"
    },
    {
      "question": "¿Cuál es el río más largo del mundo?",
      "options": {
        "A": "Nilo",
        "B": "Amazonas",
        "C": "Yangtsé",
        "D": "Misisipi"
      },
      "correctAnswer": "B"
    },
    {
      "question": "¿En qué continente se encuentra Egipto?",
      "options": {
        "A": "Asia",
        "B": "Europa",
        "C": "África",
        "D": "América"
      },
      "correctAnswer": "C"
    }
  ]
}
```

Luego añade `'geografia.json'` al array en `storage.ts` y recarga.

## 🎯 Flujo de Trabajo Recomendado

1. **Preparación**
   - Organiza tus preguntas por asignatura
   - Elige colores para cada asignatura

2. **Creación de Archivos**
   - Crea un archivo JSON por asignatura
   - Valida la sintaxis JSON

3. **Registro**
   - Añade los nombres de archivo a `storage.ts`

4. **Verificación**
   - Recarga la aplicación
   - Revisa la consola del navegador
   - Navega a "Asignaturas" y "Preguntas"

5. **Uso**
   - Realiza tests por asignatura o aleatorios
   - Revisa tu historial de resultados

## 🛠️ Solución de Problemas

### No se cargan las asignaturas
- Verifica que los archivos estén en `/public/data/asignaturas/`
- Verifica que los nombres en `storage.ts` sean exactos (incluyendo la extensión `.json`)
- Abre la consola del navegador (F12) para ver mensajes de error

### Preguntas no aparecen
- Revisa el formato del array `questions` en tu JSON
- Asegúrate de que cada pregunta tenga los 4 campos obligatorios
- Verifica que `options` tenga exactamente las claves A, B, C, D

### Error de sintaxis JSON
- Usa un validador JSON online
- Verifica que todas las comillas sean dobles (`"`)
- Asegúrate de que no falten comas entre elementos
- El último elemento de un array/objeto no debe tener coma

## 📱 Características de la Aplicación

- ✅ Vista de asignaturas con colores identificativos
- ✅ Exploración de todas las preguntas disponibles
- ✅ Filtrado de preguntas por asignatura
- ✅ Modo test por asignatura específica
- ✅ Modo test aleatorio (todas las asignaturas mezcladas)
- ✅ Orden aleatorio de preguntas
- ✅ Temporizador de test
- ✅ Resultados detallados con respuestas correctas/incorrectas
- ✅ Historial de tests realizados
- ✅ Diseño responsive (móvil, tablet, desktop)

## 🔄 Actualización de Datos

Los datos son de **solo lectura** desde la aplicación. Para modificar:

1. Edita los archivos JSON directamente
2. Recarga la aplicación en el navegador (F5 o Cmd+R)
3. Los cambios se reflejarán inmediatamente

**Nota:** El historial de tests se guarda en localStorage y persiste entre recargas.

## 💡 Consejos

- Usa nombres de archivo descriptivos y sin espacios
- Mantén un color consistente para cada asignatura
- Escribe preguntas claras y concisas
- Verifica que haya solo una respuesta correcta por pregunta
- Crea al menos 10 preguntas por asignatura para tests variados
- Revisa la consola del navegador después de añadir nuevos archivos

## 📞 Soporte

Si encuentras problemas:
1. Revisa la consola del navegador (F12)
2. Verifica la sintaxis JSON con un validador
3. Compara tu archivo con los ejemplos incluidos
4. Consulta este documento para el formato correcto
