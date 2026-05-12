# 📁 Estructura del Proyecto - TestMaster

## 🗂️ Vista General

```
testmaster/
├── 📄 INICIO-RAPIDO.md          ← Lee esto primero
├── 📄 INSTRUCCIONES.md          ← Guía completa
├── 📄 CAMBIOS.md                ← Qué se modificó
├── 📄 ESTRUCTURA.md             ← Este archivo
│
├── 📦 public/
│   └── 📂 data/
│       ├── 📄 README.md         ← Formato JSON
│       └── 📂 asignaturas/      ← TUS ARCHIVOS JSON AQUÍ
│           ├── ejemplo-matematicas.json
│           ├── ejemplo-historia.json
│           ├── PLANTILLA.json
│           └── [tus-archivos].json
│
└── 📦 src/
    └── 📂 app/
        ├── 📄 App.tsx           ← Aplicación principal
        ├── 📄 types.ts          ← Definiciones de tipos
        │
        ├── 📂 components/
        │   ├── SubjectManager.tsx      ← Vista asignaturas
        │   ├── QuestionEditor.tsx      ← Vista preguntas
        │   ├── TestModeSelector.tsx    ← Configurar test
        │   ├── ActiveTest.tsx          ← Realizar test
        │   ├── TestResults.tsx         ← Ver resultados
        │   ├── TestHistory.tsx         ← Historial
        │   └── ui/                     ← Componentes UI
        │
        └── 📂 utils/
            └── 📄 storage.ts    ← ⚙️ CONFIGURA AQUÍ TUS ARCHIVOS
```

---

## 🎯 Archivos Clave

### 📄 `/src/app/utils/storage.ts`
**Función:** Configuración de archivos JSON a cargar

```typescript
const JSON_FILES = [
  'ejemplo-matematicas.json',
  'ejemplo-historia.json',
  // 👇 Añade tus archivos aquí
  'tu-archivo.json',
];
```

**Cuándo editar:** Cada vez que añadas un nuevo archivo JSON

---

### 📂 `/public/data/asignaturas/`
**Función:** Carpeta donde colocas tus archivos JSON

**Archivos incluidos:**
- `ejemplo-matematicas.json` - Ejemplo funcional
- `ejemplo-historia.json` - Ejemplo funcional
- `PLANTILLA.json` - Plantilla para copiar

**Qué hacer:**
1. Crea nuevos archivos JSON aquí
2. Sigue el formato de los ejemplos
3. Usa nombres descriptivos sin espacios

---

### 📄 `INICIO-RAPIDO.md`
**Función:** Guía rápida de 3 pasos

**Para:** Empezar inmediatamente

---

### 📄 `INSTRUCCIONES.md`
**Función:** Documentación completa

**Incluye:**
- Formato JSON detallado
- Validación de archivos
- Solución de problemas
- Ejemplos completos
- Paleta de colores

---

### 📄 `CAMBIOS.md`
**Función:** Resumen técnico de modificaciones

**Para:** Entender qué cambió del sistema anterior

---

## 🔄 Flujo de Trabajo

```
1. Crear archivo JSON
   └─> /public/data/asignaturas/mi-asignatura.json

2. Registrar en storage.ts
   └─> const JSON_FILES = [..., 'mi-asignatura.json']

3. Recargar navegador
   └─> F5 / Cmd+R

4. Verificar en consola
   └─> ✅ Datos cargados correctamente

5. Usar en la aplicación
   └─> Ver en Asignaturas → Realizar Test
```

---

## 📊 Componentes de la Aplicación

### Vista Dashboard (Inicio)
- **Archivo:** `App.tsx` (función Dashboard)
- **Muestra:** Resumen y accesos rápidos
- **Acceso:** Click en "Inicio"

### Vista Asignaturas
- **Archivo:** `SubjectManager.tsx`
- **Muestra:** Lista de asignaturas con colores
- **Modo:** Solo lectura

### Vista Preguntas
- **Archivo:** `QuestionEditor.tsx`
- **Muestra:** Banco de preguntas con filtros
- **Modo:** Solo lectura
- **Filtro:** Por asignatura

### Configurar Test
- **Archivo:** `TestModeSelector.tsx`
- **Opciones:**
  - Por asignatura específica
  - Aleatorio (todas las asignaturas)
  - Número de preguntas
  - Orden aleatorio

### Realizar Test
- **Archivo:** `ActiveTest.tsx`
- **Características:**
  - Temporizador
  - Navegación entre preguntas
  - Selección de respuestas
  - Barra de progreso

### Ver Resultados
- **Archivo:** `TestResults.tsx`
- **Muestra:**
  - Puntuación
  - Tiempo empleado
  - Respuestas correctas/incorrectas
  - Detalles por pregunta

### Historial
- **Archivo:** `TestHistory.tsx`
- **Almacenamiento:** localStorage
- **Muestra:** Tests anteriores con estadísticas

---

## 🎨 Componentes UI

```
src/app/components/ui/
├── button.tsx
├── card.tsx
├── dialog.tsx
├── input.tsx
├── select.tsx
├── radio-group.tsx
├── label.tsx
├── badge.tsx
├── progress.tsx
├── separator.tsx
└── [otros]...
```

**Función:** Componentes reutilizables de interfaz

**Basados en:** Radix UI + Tailwind CSS

---

## 📦 Dependencias Principales

| Paquete | Uso |
|---------|-----|
| React | Framework principal |
| Tailwind CSS | Estilos |
| Radix UI | Componentes UI |
| Lucide React | Iconos |
| Sonner | Notificaciones toast |

---

## 💾 Almacenamiento de Datos

### Asignaturas y Preguntas
- **Origen:** Archivos JSON en `/public/data/asignaturas/`
- **Carga:** Automática al iniciar la aplicación
- **Cache:** En memoria (subjectsCache, questionsCache)
- **Modificación:** Solo editando archivos JSON

### Historial de Tests
- **Almacenamiento:** localStorage del navegador
- **Clave:** `test-app-results`
- **Persistencia:** Por navegador/perfil
- **Formato:** Array de objetos TestResult

---

## 🔍 Debugging

### Consola del Navegador (F12)

**Mensajes esperados al cargar:**
```
📚 Cargando 2 archivos JSON...
✓ ejemplo-matematicas.json: Matemáticas (5 preguntas)
✓ ejemplo-historia.json: Historia (3 preguntas)

✅ Carga completada:
   2 archivos cargados correctamente
   2 asignaturas
   8 preguntas totales
```

**Mensajes de error:**
```
⚠️ No se pudo cargar: archivo.json
   → El archivo no existe

❌ Formato inválido en archivo.json
   → JSON mal formado

⚠️ Pregunta inválida en archivo.json
   → Faltan campos obligatorios
```

---

## 🛠️ Comandos Útiles

```bash
# Instalar dependencias
pnpm install

# Validar archivos JSON (requiere jq)
cat public/data/asignaturas/mi-archivo.json | jq .

# Listar archivos JSON en la carpeta
ls public/data/asignaturas/*.json

# Contar preguntas en un archivo
cat public/data/asignaturas/ejemplo-matematicas.json | jq '.questions | length'
```

---

## 📝 Tipos de TypeScript

```typescript
// Subject (Asignatura)
interface Subject {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

// Question (Pregunta)
interface Question {
  id: string;
  subjectId: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  createdAt: string;
}

// TestResult (Resultado)
interface TestResult {
  id: string;
  mode: 'subject' | 'random';
  subjectId?: string;
  score: number;
  total: number;
  duration: number;
  date: string;
  answers: TestAnswer[];
}
```

---

## 🎯 Puntos de Entrada

### Para Usuario
1. **Inicio Rápido:** `INICIO-RAPIDO.md`
2. **Aplicación Web:** `http://localhost:5173` (o el puerto del dev server)

### Para Desarrollador
1. **Configuración:** `/src/app/utils/storage.ts`
2. **Componente Principal:** `/src/app/App.tsx`
3. **Tipos:** `/src/app/types.ts`

---

## 📍 Archivos JSON

### Ubicación Física
```
/workspaces/default/code/public/data/asignaturas/
```

### URL en Producción
```
https://tu-dominio.com/data/asignaturas/nombre-archivo.json
```

### Carga en Código
```typescript
fetch(`/data/asignaturas/${fileName}`)
```

---

## 🔐 Permisos y Restricciones

### Datos de Solo Lectura
- ❌ No se puede crear/editar/eliminar desde la UI
- ✅ Solo mediante edición de archivos JSON
- ✅ Protege los datos originales

### Historial Editable
- ✅ Se puede borrar desde la UI
- ✅ Almacenado en localStorage
- ✅ Específico por navegador

---

## 📱 Características Responsive

- ✅ Móvil: < 768px
- ✅ Tablet: 768px - 1024px
- ✅ Desktop: > 1024px

**Adaptaciones:**
- Menú hamburguesa en móvil
- Grid de columnas adaptativo
- Botones táctiles más grandes en móvil

---

## 🎓 Resumen para Nuevos Usuarios

**Solo necesitas saber:**

1. **Donde poner tus archivos JSON:**
   `/public/data/asignaturas/`

2. **Qué formato usar:**
   Ver `PLANTILLA.json` o `ejemplo-matematicas.json`

3. **Dónde registrarlos:**
   `/src/app/utils/storage.ts` → array `JSON_FILES`

4. **Cómo probar:**
   Recarga el navegador (F5)

**¡Eso es todo!** 🎉

---

## 📞 Recursos de Ayuda

| Documento | Propósito |
|-----------|-----------|
| INICIO-RAPIDO.md | Empezar en 3 pasos |
| INSTRUCCIONES.md | Guía completa detallada |
| CAMBIOS.md | Entender modificaciones |
| ESTRUCTURA.md | Este archivo |
| /public/data/README.md | Formato JSON |

---

**Última Actualización:** 12 de Mayo de 2026
