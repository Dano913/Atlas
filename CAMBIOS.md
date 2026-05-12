# 🔄 Resumen de Cambios - Sistema de Carga desde JSON

## 📦 Modificaciones Realizadas

La aplicación ha sido modificada para cargar las preguntas directamente desde archivos JSON ubicados en una carpeta específica, en lugar de usar importación desde Word y localStorage.

---

## 🗂️ Nuevos Archivos Creados

### 1. Carpeta de Datos
- **`/public/data/asignaturas/`** - Carpeta principal para archivos JSON
- **`/public/data/README.md`** - Documentación del formato JSON
- **`/public/data/asignaturas/.gitkeep`** - Archivo para mantener la carpeta en Git

### 2. Archivos de Ejemplo
- **`ejemplo-matematicas.json`** - 5 preguntas de matemáticas
- **`ejemplo-historia.json`** - 3 preguntas de historia
- **`PLANTILLA.json`** - Plantilla vacía para copiar

### 3. Documentación
- **`INSTRUCCIONES.md`** - Guía completa de uso (raíz del proyecto)
- **`CAMBIOS.md`** - Este archivo de resumen

---

## 🔧 Archivos Modificados

### 1. `/src/app/utils/storage.ts`
**Cambios principales:**
- ✅ Nueva función `loadDataFromJSON()` para cargar datos desde archivos JSON
- ✅ Cache en memoria para subjects y questions
- ✅ Sistema de validación de formato JSON
- ✅ Logs detallados en consola para debugging
- ✅ Configuración simple mediante array `JSON_FILES`
- ⚠️ Funciones de edición ahora muestran advertencias (datos de solo lectura)

### 2. `/src/app/App.tsx`
**Cambios principales:**
- ✅ Importación de `loadDataFromJSON`
- ✅ Estado `dataLoaded` para controlar la carga inicial
- ✅ Spinner de carga mientras se cargan los datos
- ✅ Hook `useEffect` para cargar datos al iniciar
- ✅ Eliminada opción "Importar" del menú de navegación
- ✅ Actualizado Dashboard con nueva información
- ✅ Añadida sección de instrucciones en el Dashboard

### 3. `/src/app/components/SubjectManager.tsx`
**Cambios principales:**
- ✅ Simplificado a modo de solo lectura
- ✅ Eliminados botones de edición y eliminación
- ✅ Banner informativo sobre el modo de solo lectura
- ✅ Vista mejorada de tarjetas de asignaturas
- ⚠️ Ya no permite crear/editar/eliminar asignaturas

### 4. `/src/app/components/QuestionEditor.tsx`
**Cambios principales:**
- ✅ Simplificado a modo de solo lectura
- ✅ Eliminados botones de edición y eliminación
- ✅ Banner informativo sobre el modo de solo lectura
- ✅ Vista mejorada de tarjetas de preguntas
- ✅ Contador de preguntas en el filtro
- ⚠️ Ya no permite editar/eliminar preguntas

---

## 🎯 Formato JSON Esperado

```json
{
  "subject": {
    "name": "Nombre Asignatura",
    "color": "#3B82F6"
  },
  "questions": [
    {
      "question": "¿Texto de la pregunta?",
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

---

## 📋 Componentes NO Modificados

Los siguientes componentes mantienen su funcionalidad original:
- ✅ **ActiveTest.tsx** - Realización de tests
- ✅ **TestModeSelector.tsx** - Configuración de tests
- ✅ **TestResults.tsx** - Visualización de resultados
- ✅ **TestHistory.tsx** - Historial de tests
- ✅ **types.ts** - Definiciones de tipos
- ✅ Todos los componentes UI (Button, Card, Dialog, etc.)

---

## 🚀 Cómo Añadir Tus Datos

### Paso 1: Crear Archivo JSON
Crea un archivo en `/public/data/asignaturas/` con tus preguntas.

**Ejemplo:** `fisica.json`

### Paso 2: Registrar Archivo
Edita `/src/app/utils/storage.ts`:

```typescript
const JSON_FILES = [
  'ejemplo-matematicas.json',
  'ejemplo-historia.json',
  'fisica.json',  // ← Añade tu archivo aquí
];
```

### Paso 3: Recargar Aplicación
Presiona F5 o Cmd+R para recargar. Verás los mensajes de carga en la consola del navegador.

---

## 🔍 Validación y Debugging

### Consola del Navegador
Al cargar la aplicación, verás mensajes como:

```
📚 Cargando 2 archivos JSON...
✓ ejemplo-matematicas.json: Matemáticas (5 preguntas)
✓ ejemplo-historia.json: Historia (3 preguntas)

✅ Carga completada:
   2 archivos cargados correctamente
   2 asignaturas
   8 preguntas totales
```

### Tipos de Mensajes

| Símbolo | Significado |
|---------|-------------|
| ✓       | Archivo cargado correctamente |
| ⚠️      | Advertencia (archivo no encontrado o pregunta inválida) |
| ❌      | Error crítico (formato JSON inválido) |

---

## ⚙️ Características Mantenidas

✅ **Tests por Asignatura** - Selecciona una asignatura específica  
✅ **Tests Aleatorios** - Mezcla preguntas de todas las asignaturas  
✅ **Orden Aleatorio** - Baraja las preguntas  
✅ **Temporizador** - Mide el tiempo de realización  
✅ **Resultados Detallados** - Ver respuestas correctas/incorrectas  
✅ **Historial** - Guarda tests anteriores en localStorage  
✅ **Responsive** - Funciona en móvil, tablet y desktop  

---

## 🔄 Nuevas Características

✅ **Carga Automática** - Los datos se cargan al iniciar la aplicación  
✅ **Validación JSON** - Detecta errores en el formato  
✅ **Logs Detallados** - Información clara en la consola  
✅ **Sistema de Colores** - Cada asignatura con su color único  
✅ **Vista de Solo Lectura** - Protege los datos originales  

---

## 📊 Antes vs Después

### ANTES
- ❌ Importación manual desde archivos Word (.docx)
- ❌ Procesamiento con mammoth.js
- ❌ Almacenamiento en localStorage
- ❌ Edición directa en la interfaz
- ❌ Gestión compleja de datos

### DESPUÉS
- ✅ Carga automática desde archivos JSON
- ✅ Formato estándar y validable
- ✅ Datos centralizados en una carpeta
- ✅ Vista de solo lectura protegida
- ✅ Gestión simple mediante archivos

---

## 🛠️ Archivos Que Puedes Eliminar (Opcional)

Si no planeas volver al sistema anterior, puedes eliminar:
- `/src/app/components/QuestionImport.tsx` (ya no se usa)
- La dependencia `mammoth` del `package.json`

Para eliminar mammoth:
```bash
pnpm remove mammoth
```

---

## 💾 Persistencia de Datos

| Tipo de Dato | Almacenamiento | Persistencia |
|--------------|----------------|--------------|
| Asignaturas  | Archivos JSON  | Permanente (requiere edición manual) |
| Preguntas    | Archivos JSON  | Permanente (requiere edición manual) |
| Resultados   | localStorage   | Por navegador (se mantiene entre sesiones) |

---

## 🎨 Paleta de Colores Disponible

```javascript
Azul      → #3B82F6  🔵
Verde     → #10B981  🟢
Rojo      → #EF4444  🔴
Amarillo  → #F59E0B  🟡
Morado    → #8B5CF6  🟣
Rosa      → #EC4899  🌸
Naranja   → #F97316  🟠
Turquesa  → #14B8A6  🔷
```

---

## 📚 Recursos Adicionales

- **INSTRUCCIONES.md** - Guía completa paso a paso
- **README.md** (en /public/data/) - Formato y estructura JSON
- **PLANTILLA.json** - Plantilla lista para copiar y usar
- **ejemplo-matematicas.json** - Ejemplo completo funcional
- **ejemplo-historia.json** - Otro ejemplo funcional

---

## 🚨 Limitaciones Actuales

⚠️ **Datos de Solo Lectura**
- No se pueden crear/editar/eliminar asignaturas desde la UI
- No se pueden crear/editar/eliminar preguntas desde la UI
- Todos los cambios deben hacerse editando los archivos JSON

⚠️ **Registro Manual de Archivos**
- Cada archivo JSON nuevo debe añadirse al array `JSON_FILES` en `storage.ts`
- No hay auto-detección de archivos (se podría implementar con un endpoint adicional)

⚠️ **Sin Importación Word**
- La funcionalidad de importar desde .docx ha sido removida
- Los archivos deben crearse manualmente en formato JSON

---

## ✅ Próximos Pasos Recomendados

1. **Revisar los ejemplos** incluidos (matemáticas e historia)
2. **Crear tu primer archivo JSON** usando la plantilla
3. **Registrarlo** en `storage.ts`
4. **Recargar la aplicación** y verificar la carga
5. **Realizar un test** para probar la funcionalidad
6. **Consultar INSTRUCCIONES.md** para dudas específicas

---

## 🆘 Soporte

Si encuentras problemas:

1. **Abre la consola del navegador** (F12)
2. **Busca mensajes de error** en rojo (❌) o amarillo (⚠️)
3. **Valida tu JSON** en https://jsonlint.com/
4. **Compara con los ejemplos** incluidos
5. **Consulta INSTRUCCIONES.md** para el formato correcto

---

## 📝 Notas Técnicas

- Los archivos JSON deben estar en UTF-8
- Las comillas deben ser dobles (`"`)
- No usar comas al final del último elemento
- Los colores deben estar en formato hexadecimal (#RRGGBB)
- Las respuestas correctas deben ser exactamente: "A", "B", "C" o "D"

---

**Fecha de Modificación:** 12 de Mayo de 2026  
**Versión:** 2.0 - Sistema JSON
